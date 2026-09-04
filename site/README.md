# Ardian Mehaj portfolio

This static React portfolio introduces Ardian as an early-career software
developer focused on backend systems, full-stack products and applied AI. Its
visual direction is **Atelier de preuves**: bright, square, direct and organised
around work that another person can inspect.

The page includes:

- an immediately accessible introduction with role, location, availability,
  project navigation and a CV button;
- two featured projects with contribution, evidence, limits and direct source links;
- real, expandable screenshots of EvidenceDesk and the Synthevia public demo;
- three additional project samples with their current scope kept visible;
- a plain account of how Ardian directs and checks AI-assisted work;
- skills, background and direct contact links;
- an in-page document reader for a public CV and general motivation letter,
  with direct same-origin PDF downloads and no external viewer or account.
- direct links to GitHub. Older `?repository=` links still resolve to the two
  allowlisted repositories, without a timed handoff.

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

The public documents can be regenerated from their reviewed source copy with:

~~~bash
python -m pip install -r scripts/requirements-docs.txt
python scripts/build_public_documents.py
~~~

`src/careerContent.json` is the shared source for the in-page reader and both PDFs.
Keep it factual: online computer science studies are planned, and the institution
is not finalised. The profile explicitly explains the current need for AI assistance
to write code. Project images are derived from the repository's original captures;
see `public/images/README.md` for provenance. `src/recruiter.css` contains the
current content and project layout, layered over the retained visual identity.

Keep private contact details, identity documents, financial information and
application-specific claims out of these public files. Anything under
`public/` is intentionally downloadable by every visitor.

The site does not require an environment file or credential. Archivo and IBM
Plex Mono are packaged locally under the OFL-1.1 licence, and Octicons remains
the only icon set. There is no form, tracker, analytics script, backend request
or connection to a private project.

The responsive layout is designed for 320px and wider viewports, includes a
keyboard-visible 3px focus treatment, uses 44px minimum interactive targets and
respects `prefers-reduced-motion`. The document reveal uses lightweight CSS 3D
and transform-based motion, while the reader remains semantic HTML that works
with keyboard navigation and assistive technology. Project access has no blocking
opening animation. Scroll reveals play once, and reduced-motion visitors see the
content immediately.

## Design provenance

The design was informed by a public reference study, then deliberately changed
in layout, typography, palette, navigation, project presentation, media and
motion. No reference code, copy, brand assets, images or composition are used.
The site contains original CSS graphics, project copy and screenshots belonging
to this portfolio.

## Deployment boundary

`vercel.json` publishes only `dist/client` and defines a restrictive content
security policy, framing protection, referrer policy and permissions policy.
Git deployments are enabled for the reviewed public portfolio. Production must
still be promoted only from the validated `main` branch, with the remote commit,
CI result and live response checked after release.
