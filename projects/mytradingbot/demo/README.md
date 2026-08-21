# Paper-only qualification

Run `PYTHONPATH=src uv run --no-sync python -m mytradingbot_showcase.qualification`
after the documented dependency sync. It evaluates one fixed synthetic observation:
4 gross basis points minus 6 simulated basis points of cost. The expected
verdict is NO-GO.

No data file, credential, exchange client or messaging service is loaded.
