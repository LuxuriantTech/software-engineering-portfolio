from mytradingbot_showcase.qualification import qualify_synthetic_run


def test_negative_synthetic_run_is_reported_as_no_go() -> None:
    report = qualify_synthetic_run(gross_return_bps=4.0, simulated_cost_bps=6.0)

    assert report == {
        "scope": "synthetic-paper-only",
        "net_return_bps": -2.0,
        "verdict": "NO-GO",
    }
