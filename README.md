# Ardian Mehaj: Software Engineering Portfolio

Four small runnable samples derived from larger private projects, plus the dedicated
public repository for EvidenceDesk. They use synthetic data, focused tests and
explicit limits so that a reviewer can inspect the work without access to a
private system.

I am a junior software developer based in Brussels. I work mainly with Python,
FastAPI, TypeScript, React, PostgreSQL and automated testing, with an emphasis
on requirements, debugging and verification.

## Projects

| Project | What is reviewable here | Status |
|---|---|---|
| [EvidenceDesk](projects/evidencedesk/README.md) | Dedicated full-source repository: React/FastAPI application, asynchronous ingestion, hybrid retrieval, pgvector, RBAC, PII masking, audit trail and reproducible evaluation | Experimental local prototype; blind v7 is `HONEST_NEGATIVE` |
| [Synthevia](projects/synthevia/README.md) | React → local FastAPI → in-memory SQLite synthetic record, deterministic retrieval and focused frontend/backend tests | Private product is pre-launch; this edition is offline and not production-ready |
| [Gargantua / GLXBot](projects/gargantua/README.md) | Asynchronous moderation logic, a rejected member action, a record type without a message-content field and a local API | Historically deployed; current runtime is unverified |
| [Synthevia Strategy Lab](projects/strategy-lab/README.md) | Benjamini–Hochberg p-value adjustment, a compact HAC check, one-use holdout, a declared fill/position sanity gate and deterministic LLM abstention | Internal R&D; synthetic examples only |
| [MyTradingBot](projects/mytradingbot/README.md) | Additional paper-execution sample: live-mode rejection, absolute and configurable equity-relative notional limits and synthetic NO-GO qualification | Paper-only prototype; no live-readiness or profitability claim |

The four bundled samples keep their own README, decisions, limitations, source
and tests. EvidenceDesk remains in its dedicated repository; this portfolio only
contains its concise review card and two authentic screenshots.

## Project Atlas navigator

The [Project Atlas site](site/README.md) adds a single-page interface for
moving between the five summaries. It uses the same bounded claims as these
README files and links back to the reviewable source. It contains no form,
analytics, private API call or runtime secret.

```mermaid
flowchart LR
    P[Portfolio index] --> S[Synthevia\nfrontend and API samples]
    P --> E[EvidenceDesk\ndedicated public repository]
    P --> G[Gargantua\nmoderation service sample]
    P --> L[Strategy Lab\nresearch guard samples]
    P --> M[MyTradingBot\nadditional paper-execution sample]

    D[Synthetic local data] --> S
    D --> E
    D --> G
    D --> L
    D --> M

    O[Private original repositories] -. excluded .-> P
```

## Verify the repository

Prerequisites: Python 3.12 or newer, [uv](https://docs.astral.sh/uv/), Node.js
24 and npm 11. The first installation requires package-index access.

```bash
./scripts/verify_all.sh
```

That command installs each locked dependency set, runs lint and selected tests,
runs strict type checking where configured, audits the frontend dependencies,
regenerates the four bundled synthetic demo outputs, validates the Synthevia frontend
and the Project Atlas site, then checks local Markdown links. It does not
contact a private API, exchange, Discord, Telegram, production server or real
database.

For a shorter review, open a project README and run only its documented demo.

## Boundaries of this public edition

This repository was rebuilt with a new Git history. Apart from the linked
EvidenceDesk repository, it does not contain complete source trees of the
projects. Credentials, real
user or community data, private infrastructure, deployment configuration,
live execution paths, proprietary strategies and parameters, logs, dumps and
operational findings are excluded.

The examples demonstrate selected contracts, decisions and failure paths. They
do not prove commercial traction, current deployment, production maturity,
complete security, trading profitability or readiness to use capital.

## How I use coding agents

I use Claude Code and Codex for exploration, implementation, review and
debugging. I define the requirements, split work into bounded tasks, inspect
the result, run the evidence and decide what is accepted. I do not claim that
every line was written manually.

The project READMEs give concrete examples: an unbounded retrieval input was
restricted in Synthevia; a permission-failure path was retained in Gargantua;
malformed LLM output must become `ABSTAIN` in Strategy Lab; and MyTradingBot
removes the live adapter instead of trusting only a runtime flag.

## Private technical review

The complete repositories behind the four bundled samples remain private because
they include proprietary implementation and operational configuration.
EvidenceDesk is the exception: its complete experimental source and evidence are
published separately at [LuxuriantTech/evidencedesk](https://github.com/LuxuriantTech/evidencedesk).

## Contact

Ardian Mehaj, Brussels, Belgium  
mehajardian@gmail.com

## Education

Planning to begin the University of London BSc Computer Science programme in
October 2026.
