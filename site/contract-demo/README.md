# Editable API Contract Guard demonstration

The portfolio runs the actual comparison engine, pinned to upstream commit
`6ee1e569bbe751748a96e52aa0eee86864f20d69`. The seven TypeScript files in
`vendor/` are unmodified; `upstream.json` records their SHA-256 hashes.

The build substitutes two browser-specific I/O adapters:

- `adapters/files.ts` supplies only the two pasted documents and memory-only
  reports. It rejects file references and never claims filesystem confinement,
  symlink protection, durable writes or disk access.
- `adapters/crypto.ts` precomputes real SHA-256 fingerprints with Web Crypto.
  It adapts the synchronous hash interface required by the upstream parser.

Comparison, schema validation, warnings, report construction, supported rules
and internal-reference resolution are upstream code. YAML uses the upstream
version, 2.9.0. No server, model, API key or remote inference is involved.

Each click creates an isolated worker, limited by the UI to five seconds and
200 KB per document. Editing either input cancels the worker and invalidates
the old report. The worker terminates after completion. There are no network
fetches, cookies, browser storage or analytics in this demonstration. As with
any website, page requests themselves reach the hosting provider.

## Reproduce

From `site/`, run `npm ci --ignore-scripts`, then `npm run check`.
`npm run dev` builds the worker and serves the page locally.

Tests bundle the original engine with its original Node filesystem code, then
compare its complete reports with the browser adapter's results on the same
fresh documents: five rules, identical contracts, a changed path, invalid YAML,
duplicate keys, unsupported schemas, internal/network references and HTML text.
This is parity evidence for those cases, not complete OpenAPI compatibility.

The original CLI remains the route for local multi-file inputs and consumer
manifests. The browser does not invoke the CLI or prove its filesystem safety.
