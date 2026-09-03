# Ardian Mehaj portfolio

This static React portfolio introduces Ardian as an early-career full-stack
developer focused on backend systems and applied AI. It is designed for a fast
recruiter scan while keeping the project evidence and present limitations easy
to inspect.

The page includes:

- a direct role, location and availability statement;
- two detailed public case studies and four bounded project summaries;
- an explicit explanation of Ardian's AI-assisted, human-reviewed workflow;
- practical capability groups, background and direct contact links;
- visible evaluation results, including failed quality gates.

EvidenceDesk and API Contract Guard link to their dedicated public
repositories. The other four stories link to selected public paths in this
portfolio repository. Private source is not copied into the site.

Claims, limitations and test totals come from the current verified public
edition. The site does not add customer metrics, deployment claims, trading
results or unconfirmed education.

## Run locally

~~~bash
npm ci --ignore-scripts
npm audit --audit-level=high
npm test
npm run build
npm run dev -- --host 127.0.0.1
~~~

The site does not require an environment file or credential. Fonts and icons
are packaged locally. There is no form, tracker, analytics script, backend
request or connection to one of the private projects.

The responsive layout is designed for 320px and wider viewports, includes a
keyboard-visible focus treatment and respects `prefers-reduced-motion`.

## Deployment boundary

`vercel.json` publishes only `dist/client` and defines a restrictive content
security policy, framing protection, referrer policy and permissions policy.
Automatic Git deployments are disabled for this source-only publication. A
separate explicit approval is required before re-enabling or performing a Vercel
deployment.
