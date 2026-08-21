from __future__ import annotations

import json
from pathlib import Path


def build_demo_payload() -> dict[str, object]:
    return {
        "workspace_id": "demo-workspace-01",
        "workspace_name": "Northstar Demo",
        "account": {"name": "Alex Example", "email": "alex@example.com"},
        "financial_activity": "simulated",
        "documents": [
            {"id": "demo-1", "title": "Synthetic onboarding guide"},
            {"id": "demo-2", "title": "Synthetic billing guide"},
        ],
    }


def generate_demo_data(output: Path) -> Path:
    payload = build_demo_payload()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return output


def main() -> None:
    output = Path("demo/synthetic_data/workspace.json")
    generate_demo_data(output)
    print(f"Generated {output}")


if __name__ == "__main__":
    main()
