import pytest

from strategy_lab_showcase.protocol import (
    HoldoutAlreadyConsumed,
    PositionSpecification,
    ResearchProtocol,
    UnreachablePnl,
)


def test_realisability_gate_rejects_post_entry_quantity_refits() -> None:
    specification = PositionSpecification(
        quantities_fixed_at_entry=False,
        executable_fill=True,
        price_source="trade",
    )

    with pytest.raises(UnreachablePnl):
        specification.assert_realisable()


def test_holdout_can_be_consumed_only_once() -> None:
    protocol = ResearchProtocol(range(20), train_size=12, validation_size=4)

    assert list(protocol.consume_holdout()) == [16, 17, 18, 19]
    with pytest.raises(HoldoutAlreadyConsumed):
        protocol.consume_holdout()

