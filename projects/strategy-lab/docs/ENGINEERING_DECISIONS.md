# Engineering decisions

## Falsification is an output

The demo emits a structured synthetic verdict rather than hiding the comparison.
Whether it is `FAIL` or `PASS` depends on the generated gross value and supplied
simulated cost; neither outcome is a market claim.

## Protocol state before model sophistication

The holdout and position gates are small, but they encode decisions that a more
complex model cannot repair after the fact. Their simplicity also makes misuse
visible in tests.

## LLMs advise; deterministic code decides

The contract only accepts REJECT or ABSTAIN. Invalid output becomes ABSTAIN.
This cannot prove that a valid explanation is true, but it prevents an
unexpected PASS from silently crossing the boundary.
