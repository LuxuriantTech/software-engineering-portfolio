from decimal import Decimal

import pytest

from mytradingbot_showcase.execution import (
    ExecutionMode,
    LiveExecutionDisabled,
    OrderRequest,
    PaperExchange,
)


def test_live_execution_is_not_available() -> None:
    exchange = PaperExchange()
    request = OrderRequest(
        symbol="DEMO-USD",
        quantity=Decimal("1"),
        reference_price=Decimal("100"),
    )

    with pytest.raises(LiveExecutionDisabled):
        exchange.execute(request, mode=ExecutionMode.LIVE)


def test_paper_fill_is_deterministic_and_labelled_simulated() -> None:
    exchange = PaperExchange(slippage_bps=Decimal("5"))
    request = OrderRequest(
        symbol="DEMO-USD",
        quantity=Decimal("2"),
        reference_price=Decimal("100"),
    )

    fill = exchange.execute(request, mode=ExecutionMode.PAPER)

    assert fill.price == Decimal("100.05")
    assert fill.notional == Decimal("200.10")
    assert fill.simulated is True

