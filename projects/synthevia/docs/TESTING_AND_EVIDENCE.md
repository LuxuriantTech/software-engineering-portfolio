# Testing and evidence

## Verified 21 August 2026

Branch: `main`, local repository with no remote. Python 3.12.13 and uv 0.11.7.

| Command | Result | Scope |
| --- | --- | --- |
| uv run --no-sync ruff check src tests scripts | Passed | Selected Python code, tests and local tooling |
| uv run --no-sync pytest -q | 6 passed | Offline API, bounded retrieval and generated data |
| npm test | 1 test passed | Selected React component |
| npm run typecheck | Passed | Showcase frontend only |
| npm run build | Passed | Production-mode Vite build of the showcase frontend |
| Local Markdown link check | Passed | Versioned Markdown files, local targets only |

The dependency lockfiles were generated from the showcase manifests. The
original product's historical test totals were intentionally not reused.

## What this does not prove

These checks do not exercise private authentication, payments, provider
adapters, database migrations, deployment state, load behaviour or live
financial execution. Security scanning is reported in the local delivery audit,
not converted into a claim of complete security.
