from fastapi.testclient import TestClient

from synthevia_showcase.api import app


def test_project_summary_discloses_sanitized_prelaunch_status() -> None:
    response = TestClient(app).get("/api/project-summary")

    assert response.status_code == 200
    assert response.json() == {
        "edition": "sanitized-portfolio",
        "status": "pre-launch",
        "paper_only": True,
        "external_calls": False,
    }

