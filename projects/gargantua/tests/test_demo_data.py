import json
from pathlib import Path

from gargantua_showcase.demo_data import generate_demo_data


def test_generator_writes_fictional_guild_without_message_content(tmp_path: Path) -> None:
    output = tmp_path / "guild.json"

    generate_demo_data(output)
    payload = json.loads(output.read_text(encoding="utf-8"))

    assert payload["guild"]["id"] == "demo-guild-01"
    assert payload["guild"]["name"] == "Northstar Demo"
    assert "messages" not in payload
