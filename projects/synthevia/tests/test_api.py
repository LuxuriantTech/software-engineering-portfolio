from fastapi.testclient import TestClient

from synthevia_showcase.api import app


def test_interactive_documentation_is_disabled_for_the_offline_demo() -> None:
    client = TestClient(app)

    assert client.get("/docs").status_code == 404
    assert client.get("/redoc").status_code == 404


def test_project_summary_discloses_sanitized_prelaunch_status() -> None:
    response = TestClient(app).get("/api/project-summary")

    assert response.status_code == 200
    assert response.json() == {
        "edition": "sanitized-portfolio",
        "status": "pre-launch",
        "paper_only": True,
        "external_calls": False,
    }


def test_workspace_endpoint_reads_a_synthetic_local_record() -> None:
    response = TestClient(app).get("/api/workspaces/demo-workspace-01")

    assert response.status_code == 200
    assert response.json() == {
        "id": "demo-workspace-01",
        "name": "Northstar Demo",
        "account_email": "alex@example.com",
        "document_count": 2,
        "financial_activity": "simulated",
        "storage": "in-memory-sqlite",
    }


def test_workspace_endpoint_does_not_invent_unknown_records() -> None:
    response = TestClient(app).get("/api/workspaces/not-present")

    assert response.status_code == 404
    assert response.json() == {"detail": "Synthetic workspace not found"}
