# Engineering decisions

## Rebuild rather than copy

I rebuilt the sample around public contracts instead of copying directories
from the private repository. This removes historical secrets, operational
configuration and accidental dependencies. The cost is that this is evidence
of selected design choices, not a source mirror.

## Prefer an explicit demo status

Both the API and React component say that the activity is simulated. I would
rather repeat that boundary than let a paper-only screen be read as a live
result.

## Keep retrieval inspectable

The example ranking is a small pure function. Its deterministic behaviour makes
the test meaningful, while the documentation states clearly that it cannot
stand in for semantic-retrieval evaluation.
