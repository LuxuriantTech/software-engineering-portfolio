from strategy_lab_showcase.llm_contract import validate_research_assistant_output


def test_valid_structured_output_is_accepted() -> None:
    output = validate_research_assistant_output(
        {"decision": "REJECT", "reason": "Synthetic costs exceed estimated edge."}
    )

    assert output.decision == "REJECT"
    assert output.used_fallback is False


def test_invalid_output_falls_back_to_abstain() -> None:
    output = validate_research_assistant_output({"decision": "PASS", "score": 99})

    assert output.decision == "ABSTAIN"
    assert output.reason == "invalid assistant output"
    assert output.used_fallback is True

