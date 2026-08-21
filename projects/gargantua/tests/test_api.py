from fastapi.testclient import TestClient

from gargantua_showcase.api import app


def test_dashboard_uses_fictional_guild_data() -> None:
    response = TestClient(app).get("/api/dashboard")

    assert response.status_code == 200
    payload = response.json()
    assert payload["runtime"] == "offline-demo"
    assert payload["guilds"] == [{"id": "demo-guild-01", "name": "Northstar Demo"}]

