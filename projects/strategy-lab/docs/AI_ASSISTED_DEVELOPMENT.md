# Abstention-contract review

See the [portfolio-wide agent workflow](../../../README.md#how-i-use-coding-agents).
Here, malformed LLM output is checked against a narrow contract and becomes
`ABSTAIN`; it cannot be inferred into an approval. The separate synthetic
candidate verdict remains conditional on its generated value and supplied
simulated cost.
