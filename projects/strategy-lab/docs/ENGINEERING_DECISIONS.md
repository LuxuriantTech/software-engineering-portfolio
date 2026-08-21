# Engineering decisions

## Falsification is an output

The demo emits a structured FAIL rather than hiding an unattractive result.
This makes the method reviewable and prevents a negative experiment from being
mistaken for unfinished work.

## Protocol state before model sophistication

The holdout and position gates are small, but they encode decisions that a more
complex model cannot repair after the fact. Their simplicity also makes misuse
visible in tests.

## LLMs advise; deterministic code decides

The contract only accepts REJECT or ABSTAIN. Invalid output becomes ABSTAIN.
This cannot prove that a valid explanation is true, but it prevents an
unexpected PASS from silently crossing the boundary.
