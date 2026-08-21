# Security

This repository contains selected portfolio examples, not the complete private
products. The included code is intended to run locally with synthetic data and
mocked or deterministic responses. It contains no real credentials, production
access, live trading route or private customer or community dataset.

The Project Atlas navigator is a static client build. It has no form, analytics,
authentication, backend route or private-service call. Its Vercel configuration
restricts the published output to `site/dist/client` and defines a content
security policy and browser security headers. Deployed headers must still be
verified against the real public response before a deployment is described as
validated.

If you believe you found a security issue in the material published here,
please email `mehajardian@gmail.com`. Do not disclose the issue in a public
GitHub issue or discussion before it has been reviewed.

Reports about systems, endpoints or code not present in this repository cannot
be assessed through the public showcase. This repository does not currently
accept external contributions.
