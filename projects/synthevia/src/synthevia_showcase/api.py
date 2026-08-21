from fastapi import FastAPI

app = FastAPI(title="Synthevia sanitized demo", version="1.0.0")


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

