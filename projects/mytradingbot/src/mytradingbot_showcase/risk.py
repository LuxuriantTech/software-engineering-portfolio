from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal


class RiskLimitExceeded(RuntimeError):
    pass


@dataclass(frozen=True)
class RiskDecision:
    approved: bool
    reason: str


class RiskGate:
    def __init__(
        self,
        *,
        max_notional: Decimal,
        max_equity_fraction: Decimal = Decimal("1"),
    ) -> None:
        if max_notional <= 0:
            raise ValueError("max_notional must be positive")
        if max_equity_fraction <= 0 or max_equity_fraction > 1:
            raise ValueError("max_equity_fraction must be within (0, 1]")
        self._max_notional = max_notional
        self._max_equity_fraction = max_equity_fraction

    def evaluate(
        self, *, equity: Decimal, requested_notional: Decimal
    ) -> RiskDecision:
        if equity <= 0 or requested_notional <= 0:
            raise RiskLimitExceeded("equity and notional must be positive")
        if requested_notional > self._max_notional:
            raise RiskLimitExceeded("synthetic notional limit exceeded")
        if requested_notional > equity * self._max_equity_fraction:
            raise RiskLimitExceeded("synthetic equity-relative limit exceeded")
        return RiskDecision(True, "within synthetic notional limit")
