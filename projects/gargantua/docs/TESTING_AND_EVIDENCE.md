# Testing and evidence

Verified locally on 21 August 2026, branch `main`, no remote, using Python
3.12.13 and uv 0.11.7.

| Check | Result | Boundary |
| --- | --- | --- |
| uv run --no-sync ruff check src tests scripts | Passed | Showcase Python and local tooling |
| pytest | 5 passed | Disabled CDN-backed docs, permission, minimal audit, API and generator |
| python -m gargantua_showcase.demo_data | Passed | Fictional JSON only |
| Local Markdown link check | Passed | Versioned Markdown files, local targets only |

The original repository has broader tests and historical deployment material,
but neither is used to inflate this result. No live Discord request or current
server health check was performed.
