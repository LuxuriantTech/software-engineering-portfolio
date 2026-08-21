from fastapi.testclient import TestClient

from mytradingbot_showcase.api import app


def test_interactive_documentation_is_disabled_for_the_offline_demo() -> None:
    client = TestClient(app)

    assert client.get("/docs").status_code == 404
    assert client.get("/redoc").status_code == 404


def test_health_discloses_paper_only_execution() -> None:
    response = TestClient(app).get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "execution": "paper-only",
        "external_calls": False,
    }
