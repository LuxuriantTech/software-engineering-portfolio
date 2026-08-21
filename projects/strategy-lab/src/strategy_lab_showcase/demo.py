from __future__ import annotations

import random


def evaluate_synthetic_candidate(
    *, seed: int, simulated_cost_bps: float = 0.75
) -> dict[str, object]:
    generator = random.Random(seed)
    simulated_gross_bps = sum(generator.uniform(-1.0, 1.0) for _ in range(40)) / 40
    clears_costs = simulated_gross_bps > simulated_cost_bps
    return {
        "data": "synthetic",
        "gross_edge_bps": round(simulated_gross_bps, 4),
        "simulated_cost_bps": simulated_cost_bps,
        "verdict": "PASS" if clears_costs else "FAIL",
        "reason": (
            "estimated edge clears simulated costs"
            if clears_costs
            else "estimated edge does not clear simulated costs"
        ),
    }


def main() -> None:
    import json

    print(json.dumps(evaluate_synthetic_candidate(seed=7), indent=2))


if __name__ == "__main__":
    main()
