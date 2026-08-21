from fastapi import FastAPI

app = FastAPI(
    title="Gargantua sanitized demo",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
)


@app.get("/api/dashboard")
def dashboard() -> dict[str, object]:
    return {
        "runtime": "offline-demo",
        "guilds": [{"id": "demo-guild-01", "name": "Northstar Demo"}],
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "scope": "offline-demo"}
