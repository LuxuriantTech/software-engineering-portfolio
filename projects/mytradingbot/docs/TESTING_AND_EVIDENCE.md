# Testing and evidence

Verified locally on 21 August 2026, branch `main`, no remote, using Python
3.12.13 and uv 0.11.7.

| Check | Result | Scope |
| --- | --- | --- |
| uv run --no-sync ruff check src tests scripts | Passed | Sanitized Python and local tooling |
| uv run --no-sync mypy src | Passed | Public source types |
| uv run --no-sync pytest -q | 6 passed | Paper fill, live rejection, risk, qualification and health |
| python -m mytradingbot_showcase.qualification | NO-GO | Fixed synthetic arithmetic |
| Local Markdown link check | Passed | Versioned Markdown files, local targets only |

The suite is intentionally targeted. Historical private full-suite evidence
contained failures and errors, so no aggregate passing-test total is used as a
readiness claim.

No command contacted a venue, Telegram, private host or production database.
