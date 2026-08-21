# Research architecture

The private lab separates protocol, data access, statistical analysis, search
campaigns, execution modelling and research records. Read-only database access
and paper collectors support investigations, but their configuration and data
are outside this repository.

The public package has no I/O except the demo's JSON output to stdout:

```mermaid
flowchart LR
    S[Seeded synthetic values] --> D[Candidate demo]
    P[P-values] --> B[BH adjustment]
    R[Dependent returns] --> N[Newey-West summary]
    Q[Position declaration] --> G[Realizability gate]
    O[Ordered observations] --> H[One-use holdout]
    L[Untrusted LLM object] --> V[Schema contract]
    V -->|invalid| A[ABSTAIN]
```

The components are intentionally independent so a reviewer can challenge one
assumption without running a research campaign.
