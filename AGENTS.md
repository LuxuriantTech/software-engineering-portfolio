# Repository Guidelines

## Project Structure & Module Organization

`projects/` contains four runnable Python showcase samples (`synthevia`, `gargantua`, `strategy-lab`, `mytradingbot`) and review pages for other projects. Each sample keeps code in `src/`, tests in `tests/`, and its scope and limits in its README. `projects/synthevia/frontend/` is a separate React app. `site/src/` contains the portfolio React UI and career content; `site/public/` holds static demo pages, images, and public documents. `site/contract-demo/` adapts the separately published API Contract Guard engine for the browser. Repository-wide checks live in `scripts/`; CI lives in `.github/workflows/`.

## Build, Test, and Development Commands

Use Python 3.12+, `uv`, Node 24, and npm 11. From the repository root, `./scripts/verify_all.sh` installs locked dependencies and runs lint, type checks where configured, tests, demos, builds, audits, and the Markdown link check. For the portfolio alone, run `cd site`, `npm ci --ignore-scripts`, then `npm run check` (Node tests and production build) or `npm run dev` (local Vite server). For one Python sample, enter its directory and run `uv sync --locked --dev --no-install-project`, then `uv run --no-sync pytest -q`.

## Coding Style & Naming Conventions

Follow nearby JavaScript/JSX formatting; use two-space indentation, `camelCase` functions, and `PascalCase` React components. Python uses four spaces and `snake_case`; Ruff enforces a 100-character line length plus import sorting. Run the checks instead of reformatting unrelated files. Keep generated browser bundles and public documents in sync with their source scripts.

## Testing Guidelines

Python tests use pytest files named `test_*.py`; the site uses Node tests named `*.test.mjs`, and the Synthévia frontend uses Vitest. No repository-wide coverage percentage is configured. Add focused tests for behavior changes, including rejected inputs and documented limits. Preserve negative evaluation results. Run the affected project's checks before a pull request; run `./scripts/verify_all.sh` for cross-project changes.

## Commits, Pull Requests & Public Boundaries

Recent commits use short, imperative subjects such as `Clarify junior profile` and `Run editable API contract comparisons`. Keep pull requests focused; describe the change, tests, remaining limits, and screenshots for visible UI changes. Link an issue when one exists. Use synthetic data in demos. Never commit credentials, private operational material, or unverified claims of production readiness, trading profitability, or independent authorship of AI-assisted code.
