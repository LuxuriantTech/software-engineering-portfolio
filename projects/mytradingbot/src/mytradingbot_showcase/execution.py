from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from enum import StrEnum


class LiveExecutionDisabled(RuntimeError):
    pass


class ExecutionMode(StrEnum):
    PAPER = "paper"
    LIVE = "live"


@dataclass(frozen=True)
class OrderRequest:
    symbol: str
    quantity: Decimal
    reference_price: Decimal


@dataclass(frozen=True)
class PaperFill:
    symbol: str
    quantity: Decimal
    price: Decimal
    simulated: bool = True

    @property
    def notional(self) -> Decimal:
        return self.quantity * self.price


class PaperExchange:
    def __init__(self, *, slippage_bps: Decimal = Decimal("0")) -> None:
        self._slippage_bps = slippage_bps

    def execute(self, request: OrderRequest, *, mode: ExecutionMode) -> PaperFill:
        if mode is not ExecutionMode.PAPER:
            raise LiveExecutionDisabled("this portfolio edition has no live adapter")
        multiplier = Decimal("1") + self._slippage_bps / Decimal("10000")
        price = request.reference_price * multiplier
        return PaperFill(request.symbol, request.quantity, price)
