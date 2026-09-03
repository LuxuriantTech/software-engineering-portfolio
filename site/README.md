# Ardian Mehaj portfolio

This static React portfolio introduces Ardian as an early-career software
developer focused on backend systems, full-stack products and applied AI. Its
visual direction is **Atelier de preuves**: bright, square, direct and organised
around work that another person can inspect.

The page includes:

- a short recruiter scan with role, location, availability, contact and one
  real project proof visible together;
- three practical capabilities: frame, direct and verify;
- two public project dossiers organised as intention, contribution, working
  path, evidence and limit;
- four smaller project samples with their current scope kept visible;
- a plain account of how Ardian directs and checks AI-assisted work;
- skills, background and direct contact links.

EvidenceDesk and API Contract Guard link to their dedicated public
repositories. The other four stories link to selected public paths in this
portfolio repository. Private source is not copied into the site.

Claims and test totals come from the current verified public edition. The site
does not add customer metrics, deployment claims, trading results or
unconfirmed education. EvidenceDesk's positive retrieval result stays beside
the wider evaluation that did not pass.

## Run locally

~~~bash
npm ci --ignore-scripts
npm audit --audit-level=high
npm test
npm run build
npm run dev -- --host 127.0.0.1
~~~

The site does not require an environment file or credential. Archivo and IBM
Plex Mono are packaged locally under the OFL-1.1 licence, and Octicons remains
the only icon set. There is no form, tracker, analytics script, backend request
or connection to a private project.

The responsive layout is designed for 320px and wider viewports, includes a
keyboard-visible 3px focus treatment, uses 44px minimum interactive targets and
respects `prefers-reduced-motion`.

## Design provenance

The design was informed by a public reference study, then deliberately changed
in layout, typography, palette, navigation, project presentation, media and
motion. No reference code, copy, brand assets, images or composition are used.
The site contains only original CSS graphics and project copy belonging to this
portfolio.

## Deployment boundary

`vercel.json` publishes only `dist/client` and defines a restrictive content
security policy, framing protection, referrer policy and permissions policy.
Automatic Git deployments are disabled for this source-only publication. A
separate explicit approval is required before re-enabling or performing a Vercel
deployment.
