from strategy_lab_showcase.statistics import benjamini_hochberg, newey_west_mean


def test_benjamini_hochberg_controls_a_family_of_candidates() -> None:
    adjusted = benjamini_hochberg([0.001, 0.02, 0.04, 0.40])

    assert adjusted == [0.004, 0.04, 0.05333333333333334, 0.4]


def test_newey_west_reports_effective_sample_information() -> None:
    result = newey_west_mean([0.01, 0.02, -0.01, 0.01, 0.0, 0.02], max_lag=1)

    assert result.observations == 6
    assert result.max_lag == 1
    assert result.standard_error > 0

