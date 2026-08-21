from fastapi.testclient import TestClient

from mytradingbot_showcase.api import app


def test_health_discloses_paper_only_execution() -> None:
    response = TestClient(app).get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "execution": "paper-only",
        "external_calls": False,
    }

