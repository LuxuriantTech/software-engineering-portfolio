# Browser adapter validation — 20 September 2026

- `npm run check`: 40 Node test results passed, including the existing 24 site
  tests and the parity test with 15 subcases. Production build passed.
- Local Markdown-link checker passed.
- Chrome, compiled static site: required-parameter detection; a newly pasted
  `/invoices` operation removal; invalid YAML refused; identical contracts
  reported as no supported breaking change. Editing invalidated the old report.
- Keyboard Enter triggered comparison. At a 390px viewport, editors stacked
  into one column and the document had no horizontal overflow.
- These checks are not a full accessibility audit or proof of all OpenAPI
  behavior. Source-engine filesystem guarantees do not apply to browser memory.
- Local checks ran with Node 25.9.0; repository CI uses Node 24. The original
  CLI's historical validation remains separately documented in its repository.

The initial parity-test harness failed because it bundled a Node CommonJS
dependency without its runtime adapter. The harness now tests the actual
browser bundle against the original Node engine; this failure was not a
comparison-engine defect.
