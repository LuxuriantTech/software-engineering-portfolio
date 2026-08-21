# Synthevia Strategy Lab

Python research tooling for falsification-first strategy evaluation using
synthetic data, typed code and reproducible validation controls.

## Research status

The private project is internal R&D. It is not a trading product, not
production-ready and not evidence of profitable live trading. This portfolio
edition contains generic methodological controls only; it cannot place an
order and includes no proprietary hypothesis or parameter.

## The question behind the project

Backtests make it easy to find a convincing chart after enough trials. I built
the lab to make rejection cheaper and false confidence harder: separate
training from validation, touch the holdout once, correct families of tests,
account for serial dependence, and ask whether a real position could have
reached the reported PnL.

A negative result is useful here. If a candidate disappears after simulated
costs or fails an executability gate, recording FAIL prevents a weaker result
from becoming a claim.

## What this edition contains

- a generic Benjamini–Hochberg adjustment;
- a small Newey–West mean standard-error calculation;
- a one-use holdout protocol;
- a position-realizability gate;
- an LLM output contract that abstains on invalid structure;
- a seeded synthetic candidate that is rejected after costs;
- tests and strict type checking.

## Deliberate exclusions

Exact strategies, optimised parameters, private hypotheses, exchange
credentials, proprietary datasets, database routes, order routing, mainnet
paths and real performance results are absent. The original Git history is not
carried over.

## Method flow

~~~mermaid
flowchart TD
    H[Pre-registered hypothesis] --> T[Train]
    T --> V[Validation once]
    V --> G{Protocol gates}
    G -->|family testing| F[FDR adjustment]
    G -->|dependent observations| N[HAC check]
    G -->|position definition| P[PnL realizability]
    F --> O[Holdout once]
    N --> O
    P --> O
    O --> C[Costs and executable fills]
    C --> D{Decision}
    D -->|insufficient| X[Document FAIL]
    D -->|survives| R[Further review, not capital]

    S[Synthetic public input] -. only public data .-> T
~~~

The public functions represent a few gates from that workflow. They are not a
complete statistical research library. See [Architecture](docs/ARCHITECTURE.md).

## Technical stack

### Research code

Python 3.12 or newer with strict typing.

### Private data stack

The private lab uses NumPy, Polars, SciPy, statsmodels, scikit-learn,
PostgreSQL and SQLite. This edition uses generated Python values only.

### Quality gates

pytest, Ruff and mypy strict.

### Reproducibility

uv lockfiles and a self-contained GitHub Actions workflow. No tunnel, remote
database or exchange is involved.

## Three research decisions

### Consume holdout once

**Why it was made:** repeated inspection turns unseen data into another tuning
set.

**Trade-offs:** mistakes discovered after consumption cannot be silently
retested on the same observations.

**Current limitation:** the public guard is in-memory; the private workflow
needs durable research records to enforce this across processes.

### Reject unreachable PnL before statistical interpretation

**Why it was made:** a price series can move without offering a fill that a
fixed position could capture.

**Trade-offs:** this removes attractive results and requires more detailed
execution assumptions.

**Current limitation:** the example checks declared properties; it does not
simulate an order book.

### Make invalid LLM output abstain

**Why it was made:** prose or an unknown decision should never pass a research
gate accidentally.

**Trade-offs:** potentially useful but malformed output is discarded.

**Current limitation:** the public contract validates two fields, not factual
correctness of a model's reason.

## Verified checks

Latest local run — 21 August 2026, branch `main`, Python 3.12.13 and uv 0.11.7.

~~~bash
uv sync --locked --dev --no-install-project
uv run --no-sync ruff check src tests scripts
uv run --no-sync mypy src
uv run --no-sync pytest -q
PYTHONPATH=src uv run --no-sync python -m strategy_lab_showcase.demo
~~~

Result: 7 tests passed; lint, strict type checking and the local Markdown-link
check passed. The seeded demo
reported FAIL because its estimated synthetic edge did not clear the stated
simulated cost. This result covers only the selected public functions. It is
not a validation of a strategy, a return metric or the private research corpus.

## How I used Claude Code and Codex

Claude Code and Codex supported exploration, implementation, test suggestions
and failure analysis. I set the research rules, decomposed tasks, checked
statistical assumptions, reviewed generated code and accepted or rejected
results.

I do not claim that every line was hand-written. The relevant skill shown here
is structured agentic development with explicit contracts and adversarial
verification, including the willingness to keep a negative verdict.

A specific acceptance check was the LLM contract: malformed output must become
`ABSTAIN`, never an inferred approval. Separately, the seeded candidate remains
`FAIL` when simulated costs exceed its estimated gross edge.

## Known limitations

- The statistics functions are compact examples, not replacements for vetted
  scientific libraries.
- No power calculation or full walk-forward engine is included.
- Synthetic observations cannot establish market behaviour.
- The one-use holdout guard is process-local.
- No result here supports profitability, capital allocation or live readiness.

## Run the falsification demo

~~~bash
uv sync --locked --dev --no-install-project
PYTHONPATH=src uv run --no-sync python -m strategy_lab_showcase.demo
~~~

The command uses a fixed seed, makes no network request and prints one
synthetic FAIL record. It cannot access a wallet, venue or real database.
Initial dependency installation requires package-index access.

## Private technical review

The complete repositories remain private because they include proprietary
implementation, infrastructure and operational configuration.

After an initial interview, I can provide:

- a guided technical walkthrough;
- selected source files;
- test evidence;
- or temporary read-only access to a dedicated sanitized review repository.

Access would be limited to a separate reviewed copy, normally for 7 to 14 days.
Read-only permission does not prevent copying.

## Contact

Ardian Mehaj — Brussels, Belgium  
mehajardian@gmail.com
