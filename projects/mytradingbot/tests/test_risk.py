from decimal import Decimal

import pytest

from mytradingbot_showcase.risk import RiskDecision, RiskGate, RiskLimitExceeded


def test_risk_gate_rejects_notional_above_synthetic_limit() -> None:
    gate = RiskGate(max_notional=Decimal("500"))

    with pytest.raises(RiskLimitExceeded):
        gate.evaluate(equity=Decimal("1000"), requested_notional=Decimal("501"))


def test_risk_gate_returns_auditable_decision() -> None:
    gate = RiskGate(max_notional=Decimal("500"))

    assert gate.evaluate(
        equity=Decimal("1000"), requested_notional=Decimal("250")
    ) == RiskDecision(approved=True, reason="within synthetic notional limit")

