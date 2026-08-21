from __future__ import annotations

import json
from pathlib import Path


def generate_demo_data(output: Path) -> Path:
    payload = {
        "guild": {"id": "demo-guild-01", "name": "Northstar Demo"},
        "members": [
            {"id": "demo-user-01", "display_name": "Morgan Example"},
            {"id": "demo-user-02", "display_name": "Sam Example"},
        ],
        "moderation_actions": [],
        "source": "synthetic",
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return output


def main() -> None:
    output = Path("demo/synthetic_data/guild.json")
    generate_demo_data(output)
    print(f"Generated {output}")


if __name__ == "__main__":
    main()
