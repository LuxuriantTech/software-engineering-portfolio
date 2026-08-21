# Synthetic comparison example

Run `PYTHONPATH=src uv run --no-sync python -m strategy_lab_showcase.demo`
after the documented dependency sync. A fixed random seed produces a small
synthetic gross estimate, which the function compares with a supplied simulated
cost to emit `FAIL` or `PASS`.

The default seeded input emits `FAIL`; a separate test supplies a lower cost and
obtains `PASS`. Neither case is a backtest or market evidence.
