from strategy_lab_showcase.demo import evaluate_synthetic_candidate


def test_synthetic_false_positive_is_rejected_after_costs() -> None:
    report = evaluate_synthetic_candidate(seed=7)

    assert report["data"] == "synthetic"
    assert report["verdict"] == "FAIL"
    assert report["reason"] == "estimated edge does not clear simulated costs"


def test_candidate_passes_only_when_estimated_edge_clears_costs() -> None:
    report = evaluate_synthetic_candidate(seed=0, simulated_cost_bps=0.1)

    assert report["gross_edge_bps"] == 0.1986
    assert report["verdict"] == "PASS"
    assert report["reason"] == "estimated edge clears simulated costs"
