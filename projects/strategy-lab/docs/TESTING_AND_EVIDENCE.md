# Testing and evidence

Verified locally on 21 August 2026, branch `main`, no remote, using Python
3.12.13 and uv 0.11.7.

| Command | Result | What it covers |
| --- | --- | --- |
| uv run --no-sync ruff check src tests scripts | Passed | Public package, tests and local tooling |
| uv run --no-sync mypy src | Passed, strict mode | Public source types |
| uv run --no-sync pytest -q | 9 passed | BH adjustment, HAC summary, holdout, declared fill/position gate, LLM fallback and conditional demo |
| python -m strategy_lab_showcase.demo | Conditional synthetic verdict | Seeded input and supplied simulated cost only |
| Local Markdown link check | Passed | Versioned Markdown files, local targets only |

No test count from the internal repository is used here. No test accesses real
market data, PostgreSQL, an exchange or an LLM service.

The compact statistical implementations were checked for their declared
examples, not certified as general-purpose scientific software.
