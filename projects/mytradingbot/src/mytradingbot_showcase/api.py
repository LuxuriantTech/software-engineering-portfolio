from fastapi import FastAPI

app = FastAPI(
    title="MyTradingBot sanitized demo",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
)


@app.get("/health")
def health() -> dict[str, str | bool]:
    return {
        "status": "ok",
        "execution": "paper-only",
        "external_calls": False,
    }
