from __future__ import annotations


def qualify_synthetic_run(
    *, gross_return_bps: float, simulated_cost_bps: float
) -> dict[str, object]:
    net = round(gross_return_bps - simulated_cost_bps, 6)
    return {
        "scope": "synthetic-paper-only",
        "net_return_bps": net,
        "verdict": "CANDIDATE" if net > 0 else "NO-GO",
    }


def main() -> None:
    import json

    print(json.dumps(qualify_synthetic_run(gross_return_bps=4, simulated_cost_bps=6), indent=2))


if __name__ == "__main__":
    main()
