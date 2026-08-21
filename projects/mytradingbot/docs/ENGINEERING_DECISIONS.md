# Engineering decisions

## Capability removal over configuration

The public package does not import CCXT or define a live exchange. Asking for
LIVE raises a specific exception. This is easier to audit than relying on one
environment variable.

## Decimal for fill arithmetic

Quantity, reference price, simulated slippage and notional stay in Decimal.
The example remains small, but the numeric boundary is explicit.

## Qualification is not deployment approval

A positive net synthetic result is labelled CANDIDATE, never PASS or READY.
Other risk, statistical, operational and security checks would still be
required.
