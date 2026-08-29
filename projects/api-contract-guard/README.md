# API Contract Guard

API Contract Guard is a local TypeScript CLI that compares two OpenAPI documents
and produces deterministic JSON and static HTML reports for a defined subset of
breaking changes. The complete source lives in
[LuxuriantTech/api-contract-guard](https://github.com/LuxuriantTech/api-contract-guard);
it is linked here rather than copied into this portfolio.

## What is implemented

- comparison of five supported breaking-change categories: removed operations,
  added required parameters, added required request properties, removed required
  response properties and removed enum values;
- bounded local-file input and local-reference handling, with unsupported
  document shapes rejected rather than guessed;
- deterministic JSON and static HTML reports, plus a reproducible synthetic
  operation-removal demo;
- 102 tests, coverage checks and a GitHub Actions workflow.

## Reproduce the checks

Clone the dedicated repository, then use its pinned Node dependencies:

```bash
git clone https://github.com/LuxuriantTech/api-contract-guard.git
cd api-contract-guard
npm ci
npm run ci
```

The [publication CI run](https://github.com/LuxuriantTech/api-contract-guard/actions/runs/33274063682)
completed successfully at commit
[`9ea2eea`](https://github.com/LuxuriantTech/api-contract-guard/commit/9ea2eead433052309f4e7e43dabbc65e5c6a9c19).
It ran all 102 tests and reported 94.12% statement coverage, 88.72% branch
coverage, 100% function coverage and 98.67% line coverage.

## Limits

- local CLI only; no hosted API, service or public runtime is provided;
- five bounded rules are implemented, not a general OpenAPI compatibility
  verdict;
- input, consumer and demonstration data are synthetic; no client system or
  production contract is claimed;
- local references are handled within documented bounds, while unsupported
  shapes fail closed.
