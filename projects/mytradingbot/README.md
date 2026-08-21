# MyTradingBot

A paper-first Python automation prototype with strategy orchestration, risk
controls, FastAPI services and auditable qualification workflows.

## Current status

The private project is an advanced research prototype. It is not
production-ready, stable live-trading software or evidence of profitability.
This sanitized repository goes further: live execution is absent by design and
every example uses synthetic values.

## Why paper-first matters

Automation can turn a software defect into a financial action. I built the
prototype around a stricter sequence: generate a candidate, apply explicit risk
gates, execute through paper infrastructure, and produce a qualification
artifact that can say NO-GO.

The private project explored several engines, exchange integrations, APIs and
remote controls. My main responsibility was organising that work into
reviewable tasks, testing control boundaries and refusing to treat a large
historical test count as proof that the whole system was ready.

## Safe components included

- a paper exchange with deterministic simulated slippage;
- an explicit exception when live mode is requested;
- a Decimal-based synthetic notional gate;
- a qualification report that subtracts simulated costs;
- a local health route that reports paper-only and no external calls;
- focused tests for the failure and audit paths.

## Components excluded

Exact strategies and parameters, exchange and CCXT configuration, keys, VPS and
SSH details, live routes, Telegram credentials and operational commands,
private market data, logs, local paths, original qualification archives and Git
history are not included.

## Control flow

~~~mermaid
flowchart LR
    S[Strategy candidate] --> G{Risk gate}
    G -->|reject| N[NO-GO record]
    G -->|approved| P[Paper exchange]
    P --> F[Simulated fill]
    F --> Q[Qualification]
    Q -->|costs not cleared| N
    Q -->|candidate only| R[Further review]

    L[Live mode] --> X[Disabled in showcase]
    T[Telegram control] -. private, excluded .-> S
    E[Exchange adapter] -. private, excluded .-> P
~~~

In the public path, no node has network access or a live adapter. The API
exposes health information only. See [Architecture](docs/ARCHITECTURE.md).

## Technical stack

### Automation core

Python, FastAPI, Pydantic concepts and Decimal for price or notional examples.

### Evidence boundary

The private prototype includes backtest and qualification artifacts. This
edition operates on values created inside its tests and demo.

### Control checks

pytest, Ruff and mypy strict.

### Operational separation

The private project contains GitHub Actions and exchange-related operational
material. The portfolio CI job requires no user-supplied credential or private
server.

## Engineering choices

### Omit the live adapter

**Why it was made:** an environment flag is weaker than removing the capability
from a public demonstration.

**Trade-offs:** the repository cannot demonstrate real exchange behaviour.

**Current limitation:** paper fills do not model latency, partial fills or
selection effects.

### Use Decimal at the execution boundary

**Why it was made:** binary floating-point is a poor default for requested
quantity, price and notional.

**Trade-offs:** callers must convert external values deliberately.

**Current limitation:** the qualification summary still uses float for a small
synthetic basis-point example and is not an accounting ledger.

### Let qualification return NO-GO

**Why it was made:** gross behaviour that does not clear stated costs should
not become a success claim.

**Trade-offs:** the simple report cannot model an entire fee or fill schedule.

**Current limitation:** CANDIDATE means only that one arithmetic gate passed;
it does not authorize deployment or capital.

## Testing and evidence

Latest verified local run — 21 August 2026, branch `main`, Python 3.12.13 and uv 0.11.7.

~~~bash
uv sync --locked --dev --no-install-project
uv run --no-sync ruff check src tests scripts
uv run --no-sync mypy src
uv run --no-sync pytest -q
PYTHONPATH=src uv run --no-sync python -m mytradingbot_showcase.qualification
~~~

Result: 6 tests passed; lint, strict type checking and the local Markdown-link
check passed. Tests cover live
mode rejection, deterministic paper fills, notional rejection, an auditable
risk decision, a NO-GO after costs and the paper-only health response.

This is a targeted green suite. It does not replace or conceal the broader
private suite, which had unresolved failures and errors in historical full-run
evidence. No private test total is presented as a general success metric.

## Run the qualification example

~~~bash
uv sync --locked --dev --no-install-project
PYTHONPATH=src uv run --no-sync python -m mytradingbot_showcase.qualification
PYTHONPATH=src uv run --no-sync uvicorn mytradingbot_showcase.api:app --host 127.0.0.1 --port 8000
~~~

The demo prints a synthetic NO-GO because 4 gross basis points do not clear 6
simulated basis points of cost. It does not contact Telegram, an exchange or a
database. Initial dependency installation requires package-index access.

## How I used Claude Code and Codex

Claude Code and Codex helped implement, inspect and debug parts of the
prototype. I defined the paper-first requirements, split work across
components, reviewed tests and qualification artifacts, analysed failures and
decided whether results were acceptable.

I do not claim that the code was written without AI assistance. The engineering
signal I want to make reviewable is the control process: bounded agent work,
failure-path tests, explicit limits and no promotion from paper results to a live
claim.

For example, I rejected a design that relied only on a runtime flag and kept no
live adapter in this edition. The tests require a live-mode request to raise,
and the demo records `NO-GO` when 4 gross basis points do not clear 6 simulated
basis points of cost.

## Paper-execution boundary

- The paper fill model is deterministic and deliberately small.
- Risk evaluation demonstrates one notional ceiling, not portfolio risk.
- The API has no strategy or order route.
- No current live readiness or stable profitability has been demonstrated.
- The complete private suite was not green in the evidence reviewed.
- Telegram, CCXT and VPS workflows are outside the public boundary.

## Private technical review

The complete repositories remain private because they include proprietary
implementation, infrastructure and operational configuration.

After an initial interview, I can provide:

- a guided technical walkthrough;
- selected source files;
- test evidence;
- or temporary read-only access to a dedicated sanitized review repository.

Any repository access would be to a separate sanitized copy for 7 to 14 days,
without administrative permission or deployment keys. Read-only access does
not prevent copying.

## Contact

Ardian Mehaj — Brussels, Belgium  
mehajardian@gmail.com
