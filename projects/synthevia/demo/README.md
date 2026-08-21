# Offline demo

Run `PYTHONPATH=src uv run --no-sync python -m synthevia_showcase.demo_data`
from the repository root after the documented dependency sync. It recreates
synthetic_data/workspace.json with reserved example identities. The file is
safe to delete and regenerate.

The demo does not open a network connection, create a payment or submit an
order.
