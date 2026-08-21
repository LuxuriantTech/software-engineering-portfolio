from strategy_lab_showcase.demo import evaluate_synthetic_candidate


def test_synthetic_false_positive_is_rejected_after_costs() -> None:
    report = evaluate_synthetic_candidate(seed=7)

    assert report["data"] == "synthetic"
    assert report["verdict"] == "FAIL"
    assert report["reason"] == "estimated edge does not clear simulated costs"

