# Engineering decisions

## One permission rule at the service edge

The sample rejects an actor before any audit mutation. Keeping that rule beside
the operation reduces the chance that one command entry point forgets it. The
real system needs a current Discord-derived actor context; the sample does not
pretend otherwise.

## Minimal audit records

The record holds identifiers and a synthetic reason, not message bodies. This
is enough to demonstrate an auditable transition without publishing community
content.

## Offline review over token-based realism

A real Discord demonstration would create an unnecessary credential and
privacy burden. The selected async service is narrower, but a reviewer can run
and falsify it locally.
