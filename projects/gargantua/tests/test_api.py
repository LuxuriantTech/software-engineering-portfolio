from fastapi.testclient import TestClient

from gargantua_showcase.api import app


def test_interactive_documentation_is_disabled_for_the_offline_demo() -> None:
    client = TestClient(app)

    assert client.get("/docs").status_code == 404
    assert client.get("/redoc").status_code == 404


def test_dashboard_uses_fictional_guild_data() -> None:
    response = TestClient(app).get("/api/dashboard")

    assert response.status_code == 200
    payload = response.json()
    assert payload["runtime"] == "offline-demo"
    assert payload["guilds"] == [{"id": "demo-guild-01", "name": "Northstar Demo"}]
