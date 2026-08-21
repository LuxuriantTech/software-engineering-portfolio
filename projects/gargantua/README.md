# Gargantua / GLXBot

A Discord community platform combining a Python bot, FastAPI services and a
React dashboard. This repository is an offline portfolio edition of the
private project.

## Status

The original project was deployed historically. Its current runtime was not
verified during the 20 August 2026 audit, so I do not present it as an active
service. This repository is an offline review sample, not the deployed bot and
not a production-ready release.

## The community problem

The project grew from a practical moderation problem: routine actions,
configuration and audit trails were split between Discord commands and manual
administration. I wanted one bot workflow for members and moderators, plus a
dashboard for settings that were awkward to manage through chat commands.

That created an asynchronous integration problem. Discord events, permission
checks, database writes and web requests can arrive independently, while every
action still needs to stay inside the correct guild boundary.

## Included here

- an asynchronous moderation service with a role gate;
- an in-memory audit record that deliberately excludes message content;
- a read-only FastAPI dashboard response using one fictional guild;
- a reproducible guild-data generator;
- focused permission, audit and API tests;
- standalone CI without Discord, a private database or Sentry.

## Kept private

Bot tokens, real guild and user identifiers, messages, tickets, sanctions,
administrative commands, the complete OAuth flow, privilege-sensitive
workflows, backups, infrastructure, monitoring configuration and original Git
history are excluded.

## System shape

~~~mermaid
flowchart LR
    DG[Discord gateway] --> B[discord.py bot]
    B --> C[Async services]
    W[React dashboard] --> A[FastAPI dashboard]
    A --> C
    C --> DB[(PostgreSQL or SQLite)]
    C --> O[Metrics and error reporting]

    R[Reviewer] --> P[Offline FastAPI sample]
    R --> M[Sanitized moderation service]
    M --> I[(In-memory audit)]

    classDef public fill:#eef7ee,stroke:#238636
    class R,P,M,I public
~~~

The upper path is the verified logical architecture of the private codebase;
the lower path is this repository. Discord, OAuth and monitoring are not mocked
as if they were real. More detail is in [Architecture](docs/ARCHITECTURE.md).

## Technical stack

### Runtime

Python, discord.py, FastAPI, React and TypeScript.

### Storage boundary

PostgreSQL and SQLite in the private system; plain Python objects and generated
JSON in this edition.

### Failure-path checks

pytest, pytest-asyncio and FastAPI TestClient.

### Historical operations

The private repository contains Docker Compose, nginx, Prometheus and Sentry
integration. The showcase contains GitHub Actions only.

## Decisions I can defend

### Record the action, not the conversation

**Why it was made:** a moderation audit needs actor, subject, guild, reason and
action identity; copying message content would add unnecessary private data.

**Trade-offs:** a reviewer cannot reconstruct the complete conversation from
the audit record.

**Current limitation:** the sample store is in memory and does not demonstrate
retention or database concurrency.

### Keep permission checks in the service boundary

**Why it was made:** commands and web routes should not each invent their own
role rule.

**Trade-offs:** the service needs a trusted, current actor context.

**Current limitation:** this edition does not reproduce Discord OAuth or live
permission refresh.

### Avoid a fake Discord demo

**Why it was made:** a local review should not need a bot token or a real
server.

**Trade-offs:** gateway timing and Discord rate limits are out of scope.

**Current limitation:** asynchronous behaviour is demonstrated at service
level, not through the Discord network.

## Evidence

Latest verified local run — 21 August 2026, branch `main`, Python 3.12.13 and uv 0.11.7.

~~~bash
uv sync --locked --dev --no-install-project
uv run --no-sync ruff check src tests scripts
uv run --no-sync pytest -q
PYTHONPATH=src uv run --no-sync python -m gargantua_showcase.demo_data
~~~

Result: 4 tests passed; Ruff and the local Markdown-link check passed. The tests cover a rejected member action, an audited
moderator action, fictional dashboard data and generated data without message
content. This is a selected showcase suite, not the private project's full
historical test count or current deployment health.

## How I used Claude Code and Codex

Claude Code and Codex helped explore the larger repository, implement bounded
changes and suggest tests. I defined the behaviour, separated sensitive from
publishable paths, reviewed failures and decided which results were acceptable.
I do not claim that every line was manually written.

The important part for this project was verification at permission and guild
boundaries. Generated code was challenged with negative tests and an
independent security pass; issues found in the private code are tracked
privately rather than described here.

For example, I required a member-level action to fail before accepting the
moderation service, then checked that an allowed action records actor, subject
and reason without copying Discord message content.

## Limits

- Current service availability is unverified.
- OAuth and permission-revocation behaviour are not part of the public sample.
- There are no real Discord users, guilds or operational metrics here.
- The in-memory store is a teaching surface, not a durability claim.
- Complete security, production readiness and user-count claims are not made.

## Run the sample

Python 3.12 or newer and uv are required.

~~~bash
uv sync --locked --dev --no-install-project
PYTHONPATH=src uv run --no-sync python -m gargantua_showcase.demo_data
PYTHONPATH=src uv run --no-sync uvicorn gargantua_showcase.api:app --host 127.0.0.1 --port 8000
~~~

Open http://127.0.0.1:8000/api/dashboard. The returned guild is fictional; the
server does not connect to Discord or write a database. Initial dependency
installation requires package-index access; the installed demo makes no
outbound request.

## Private technical review

The complete repositories remain private because they include proprietary
implementation, infrastructure and operational configuration.

After an initial interview, I can provide:

- a guided technical walkthrough;
- selected source files;
- test evidence;
- or temporary read-only access to a dedicated sanitized review repository.

Such access would normally last 7 to 14 days and be removed manually. Read-only
permission cannot prevent copying.

## Contact

Ardian Mehaj — Brussels, Belgium  
mehajardian@gmail.com
