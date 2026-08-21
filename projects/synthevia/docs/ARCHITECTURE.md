# Architecture

## Private system boundary

The verified codebase separates a React/TypeScript client from FastAPI routes
and service modules. PostgreSQL is used through SQLAlchemy and Alembic; Redis
supports short-lived state, and pgvector is used in retrieval-related paths.
OAuth, payment and other providers sit behind service boundaries.

This description is intentionally logical. Hosts, private routes, environment
names and deployment topology are excluded.

## Public edition

The public API has two read-only routes. Retrieval accepts caller-supplied
fictional documents and keeps no state. The generator writes one local JSON
file. The React sample displays the demo status and never contacts a backend.

~~~mermaid
sequenceDiagram
    participant Reviewer
    participant DemoAPI
    participant Retrieval
    participant LocalFile
    Reviewer->>DemoAPI: GET project summary
    DemoAPI-->>Reviewer: sanitized, pre-launch, paper-only
    Reviewer->>Retrieval: query + fictional documents
    Retrieval-->>Reviewer: deterministic ranking
    Reviewer->>LocalFile: generate demo data
    LocalFile-->>Reviewer: example.com identities
~~~

There is no route from this edition to a production database, payment service,
OAuth provider or trading venue.
