from fastapi import FastAPI

app = FastAPI(title="MyTradingBot sanitized demo", version="1.0.0")


@app.get("/health")
def health() -> dict[str, str | bool]:
    return {
        "status": "ok",
        "execution": "paper-only",
        "external_calls": False,
    }

