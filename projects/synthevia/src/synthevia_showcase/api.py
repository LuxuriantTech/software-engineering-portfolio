from fastapi import FastAPI, HTTPException

from .storage import SyntheticWorkspaceStore

app = FastAPI(
    title="Synthevia sanitized demo",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
)
workspace_store = SyntheticWorkspaceStore()


@app.get("/api/project-summary")
def project_summary() -> dict[str, str | bool]:
    return {
        "edition": "sanitized-portfolio",
        "status": "pre-launch",
        "paper_only": True,
        "external_calls": False,
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "scope": "offline-demo"}


@app.get("/api/workspaces/{workspace_id}")
def workspace(workspace_id: str) -> dict[str, str | int]:
    record = workspace_store.get(workspace_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Synthetic workspace not found")
    return record
