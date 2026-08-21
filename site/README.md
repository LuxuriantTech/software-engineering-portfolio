# Project Atlas

Project Atlas is the static navigator for this portfolio. It keeps the four
projects in one interface: choose a project, read its current status, inspect
three reviewable boundaries and open the corresponding source directory.

The interface is deliberately smaller than the project README files. Claims,
limitations and test totals come from the verified public edition; the site
does not add product metrics, deployment claims or trading results.

## Run locally

~~~bash
npm ci --ignore-scripts
npm audit --audit-level=high
npm test
npm run build
npm run dev -- --host 127.0.0.1
~~~

The site does not require an environment file or credential. Fonts and icons
are packaged locally. There is no form, tracker, analytics script, backend call
or connection to one of the private projects.

## Deployment boundary

`vercel.json` publishes only `dist/client` and defines a restrictive content
security policy, framing protection, referrer policy and permissions policy.
The Vercel project must use `site` as its Root Directory. The production
deployment should use the Git integration for this repository, with no
environment variables. Preview deployments should remain protected until the
exact production candidate has passed local and fresh-clone checks.
