# Architecture

The private prototype separates strategy engines, risk controls, paper/live
execution boundaries, API services, qualification artifacts and optional
remote control. Exchange, Telegram and deployment paths remain private.

This edition reduces that design to an inspectable path:

~~~mermaid
sequenceDiagram
    participant Reviewer
    participant RiskGate
    participant PaperExchange
    participant Qualification
    Reviewer->>RiskGate: equity + synthetic notional
    RiskGate-->>Reviewer: approved or exception
    Reviewer->>PaperExchange: PAPER request
    PaperExchange-->>Reviewer: labelled simulated fill
    Reviewer->>Qualification: gross and simulated costs
    Qualification-->>Reviewer: CANDIDATE or NO-GO
    Reviewer->>PaperExchange: LIVE request
    PaperExchange-->>Reviewer: LiveExecutionDisabled
~~~

The API is deliberately read-only and exposes only a health document. There is
no hidden environment switch that installs a live adapter.
