# Synthevia

A full-stack SaaS platform built with React, FastAPI and PostgreSQL. This
repository contains a small offline portfolio edition of the private
pre-launch product.

## Current status

The private product is pre-launch. This repository is a small, independently
rebuilt portfolio edition: it is offline by default, paper-only where financial
examples appear, and not production-ready. Current deployment state was not
verified during the 20 August 2026 portfolio audit.

## Why I built it

Synthevia started as a single workspace for account management, subscription
flows, document retrieval and research tools. The hard part was not adding one
more API integration. It was keeping authentication, persistence, background
work and a TypeScript interface understandable as the scope grew.

I used the project to practise product decomposition and integration: defining
the workflow first, giving coding agents bounded tasks, reviewing their output,
and rejecting changes that did not survive tests or security review.

## What is included

- a FastAPI status endpoint that discloses the demo boundary;
- deterministic retrieval over two fictional documents;
- a synthetic workspace-data generator;
- a small React component that labels simulated activity;
- focused Python and frontend tests;
- a CI workflow with lint, tests, type checking, link checking and secret scan.

![Sanitized Synthevia demo workspace](docs/screenshots/synthevia-demo.png)

## What is not included

The original history, database models, migrations, private infrastructure,
authentication implementation, payment and OAuth configuration, production
endpoints, customer data, financial data, exchange adapters and research
parameters remain private. No credential or real account is required here.

## Architecture

The first diagram describes the private system at a non-operational level. The
highlighted public path is the only part reproduced in this repository.

~~~mermaid
flowchart LR
    U[React client] --> A[FastAPI services]
    A --> P[(PostgreSQL)]
    A --> R[(Redis)]
    A --> V[(Vector search)]
    A -. private adapters .-> E[External providers]

    D[Public demo client] --> S[Sanitized FastAPI routes]
    S --> M[In-memory retrieval]
    G[Synthetic generator] --> J[Local JSON]

    classDef public fill:#e8f4ff,stroke:#2563eb
    class D,S,M,G,J public
~~~

In the full project, the API is the boundary between the browser and data or
external services. In this edition, persistence and providers are replaced by
deterministic local objects. See [the architecture notes](docs/ARCHITECTURE.md).

## Technical stack

### Product surface

Python, FastAPI, React and TypeScript.

### Data boundary

The private project uses PostgreSQL, SQLAlchemy, Alembic, Redis and pgvector.
This public demo uses generated JSON and in-memory documents only.

### Verification

pytest, Vitest, Testing Library and TypeScript type checking.

### Packaging

The private project contains Docker and GitHub Actions configuration. This
edition keeps only a standalone GitHub Actions workflow.

## Engineering decisions

### Keep the public edition offline

**Why it was made:** a recruiter can run the relevant path without receiving a
credential or touching a private service.

**Trade-offs:** mocks do not demonstrate provider behaviour or operational
latency.

**Current limitation:** the demo proves component contracts, not the complete
integration.

### Make simulated state visible in the interface and API

**Why it was made:** paper-only results should not be mistaken for real account
activity.

**Trade-offs:** the repeated label is intentionally more explicit than a normal
product screen.

**Current limitation:** there is no end-to-end browser build in this small
edition; the selected component is tested in isolation.

### Use deterministic retrieval for the example

**Why it was made:** the result can be tested without an embedding API or hidden
model dependency.

**Trade-offs:** token overlap is not a substitute for semantic retrieval.

**Current limitation:** this example demonstrates ranking boundaries, not RAG
quality.

## Testing and evidence

Latest verified local run — 21 August 2026, branch `main`, Python 3.12.13 and uv 0.11.7.

~~~bash
uv sync --locked --dev --no-install-project
uv run --no-sync ruff check src tests scripts
uv run --no-sync pytest -q
cd frontend
npm ci
npm test
npm run typecheck
npm run build
~~~

Result: the Python suite reported 6 passed; the frontend suite reported one
test file and one test passed. Ruff, the local Markdown-link check, frontend
type checking and the Vite build completed successfully.
The scope is this sanitized repository only. It says nothing about the complete
private suite, current deployment health or security of the original product.
Full commands and limits are recorded in
[Testing and evidence](docs/TESTING_AND_EVIDENCE.md).

## How I used Claude Code and Codex

I used Claude Code and Codex to accelerate implementation, exploration, review
and debugging in the private project and in preparing this edition. My
responsibility covered product requirements, task decomposition, validation
criteria, integration, test review, failure analysis and final acceptance.

I do not claim that every line was written manually. The point of this
repository is to show how I framed a system, checked generated work and reduced
it to a reproducible, safe review surface.

One concrete correction came from the final adversarial review: the retrieval
helper accepted an unbounded document iterable. I added explicit query,
document-count and text-length limits, then kept tests that prove consumption
stops at the validation boundary.

## Known limitations

- The product is pre-launch and has no commercial traction claim.
- No current production runtime was verified for this audit.
- The selected retrieval example is deliberately smaller than the private RAG
  workflow.
- Open remediation and dependency work in the private code is not exposed here
  and prevents direct publication of that repository.
- No profitability, scale or complete-security claim is made.

## Running the demo

Python 3.12 or newer and uv are required.

~~~bash
uv sync --locked --dev --no-install-project
PYTHONPATH=src uv run --no-sync python -m synthevia_showcase.demo_data
PYTHONPATH=src uv run --no-sync uvicorn synthevia_showcase.api:app --host 127.0.0.1 --port 8000
~~~

The generator writes only fictional records under demo/synthetic_data. The API
makes no external call. Initial dependency installation requires package-index
access. In another terminal, curl
http://127.0.0.1:8000/api/project-summary.

## Private technical review

The complete repository remains private because it includes proprietary
implementation, infrastructure and operational configuration.

After an initial interview, I can provide:

- a guided technical walkthrough;
- selected source files;
- test evidence;
- or temporary read-only access to a dedicated sanitized review repository.

Read-only access does not technically prevent copying. It would be time-limited
and removed manually after review.

## Contact

Ardian Mehaj — Brussels, Belgium  
mehajardian@gmail.com
