import json
from pathlib import Path

from synthevia_showcase.demo_data import generate_demo_data


def test_demo_generator_writes_only_reserved_example_domains(tmp_path: Path) -> None:
    output = tmp_path / "workspace.json"

    generate_demo_data(output)
    payload = json.loads(output.read_text(encoding="utf-8"))

    assert payload["account"]["email"].endswith("@example.com")
    assert payload["workspace_id"].startswith("demo-")
    assert payload["financial_activity"] == "simulated"

