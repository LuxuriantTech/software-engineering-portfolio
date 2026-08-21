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


def test_risk_gate_applies_a_configured_equity_fraction() -> None:
    gate = RiskGate(
        max_notional=Decimal("500"),
        max_equity_fraction=Decimal("0.10"),
    )

    with pytest.raises(RiskLimitExceeded, match="equity-relative"):
        gate.evaluate(equity=Decimal("1000"), requested_notional=Decimal("101"))


@pytest.mark.parametrize("fraction", [Decimal("0"), Decimal("1.01")])
def test_risk_gate_rejects_invalid_equity_fraction(fraction: Decimal) -> None:
    with pytest.raises(ValueError, match="max_equity_fraction"):
        RiskGate(max_notional=Decimal("500"), max_equity_fraction=fraction)
