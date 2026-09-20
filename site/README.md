# Ardian Mehaj portfolio

Static React portfolio for a junior software candidate working with AI coding assistants. It retains the existing Archivo typography, paper surfaces, orange and cobalt accents, keyboard navigation and restrained motion.

## Reading order

API Contract Guard, Synthévia and EvidenceDesk are the three primary examples. Each explains the user problem, an observable example, a design choice, the contribution with AI assistance and the current limitation. Technical validation details remain accessible in native disclosure controls.

All ten projects remain accessible. The five engineering demos use prepared fictional examples in the browser; full applications run locally with setup limits documented per project. Synthévia's public product demo is separate from its smaller React/FastAPI/SQLite code sample.

EvidenceDesk's failed answer evaluation remains visible. Historical metrics have not been changed or rerun. PMR's separate CLI baseline does not resolve its historical browser reproducibility limits. MyTradingBot has no demonstrated profitability.

Every demo and the collection link back to the author, the English and French CVs, and public contact. Preview images link to demos instead of raw image files.

## Career content

The profile states that Ardian uses AI for implementation and is developing programming independence. Implementation, review and testing use AI assistance. The suggested first team task is an aspiration with mentoring and review, not a newly verified claim of independent competence.

OPIT admission is confirmed for the online September 2026 BSc intake, starting 21 September. No completed degree is claimed. Studies are planned alongside work; the exact schedule needs to be agreed with the employer. Full-time work is sought remotely from Belgium or with employer-funded relocation; exact hours are to be agreed with the employer.

The English/French CVs and English motivation letter share src/careerContent.json with the HTML document reader. They omit private address, phone, finances and application-specific identifiers. Never replace previously submitted application evidence with these newer files.

A personal narrated demonstration still requires Ardian's own recording. No synthetic voice or unverified personal demonstration is displayed. The rejected promotional reel is not promoted; historical media assets are preserved.

## Run and verify

~~~sh
npm ci --ignore-scripts
npm run check
npm run dev -- --host 127.0.0.1
~~~

Regenerate all three documents with:

~~~sh
python -m pip install -r scripts/requirements-docs.txt
python scripts/build_public_documents.py
~~~

Review PDF text extraction and page rendering after edits. The reader supports English/French CV tabs, a letter tab, arrow keys, Escape, focus restoration and same-origin downloads. A no-JavaScript fallback links directly to the demo collection, CVs and contact.

## Delivery and provenance

vercel.json publishes only dist/client with restrictive headers. No environment file, credentials, analytics, remote font service or private backend connection is needed. Public code samples and demo engines are unchanged by the September 10 editorial update.

Publish through reviewed Git changes, verify CI, then verify actual public HTML, JavaScript, styles and PDFs. Local validation alone is not production verification.

See public/images/README.md for screenshot provenance. The design is original, without copying another site's code, branding or assets. Archivo and IBM Plex Mono are bundled under OFL-1.1; Octicons is the icon set.
