# Bounded retrieval review

See the [portfolio-wide agent workflow](../../../README.md#how-i-use-coding-agents).
For this sample, the review corrected an unbounded document iterable: query
length, document count and document text length are now checked before ranking,
and the test asserts that consumption stops at the document limit.
