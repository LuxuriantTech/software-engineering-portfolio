from __future__ import annotations

import random


def evaluate_synthetic_candidate(*, seed: int) -> dict[str, object]:
    generator = random.Random(seed)
    simulated_gross_bps = sum(generator.uniform(-1.0, 1.0) for _ in range(40)) / 40
    simulated_cost_bps = 0.75
    return {
        "data": "synthetic",
        "gross_edge_bps": round(simulated_gross_bps, 4),
        "simulated_cost_bps": simulated_cost_bps,
        "verdict": "FAIL",
        "reason": "estimated edge does not clear simulated costs",
    }


def main() -> None:
    import json

    print(json.dumps(evaluate_synthetic_candidate(seed=7), indent=2))


if __name__ == "__main__":
    main()

