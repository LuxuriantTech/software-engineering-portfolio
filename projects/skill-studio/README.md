# Skill Studio

The public Skill Studio page is a prepared instruction editor. You can edit the
instruction, inspect a text diff, reset it and export Markdown. The displayed
synthetic response does not rerun after an edit; the page does not call a model,
save versions or build a ZIP package.

The broader private workshop is still in development. Its model execution,
saved versions and package workflows are outside this public edition. The
[recorded evaluation and limits](../../site/public/projects/skill-studio/evaluation.html)
do not show a systematic gain over using no additional instructions.

## Inspect and verify

The [public HTML, CSS and JavaScript](../../site/public/projects/skill-studio/)
use synthetic examples. From `site/`, run `npm ci --ignore-scripts`, then
`npm run check` for the site checks. Use `npm run dev` to open
`/projects/skill-studio/` locally. The [guide](../../site/public/projects/skill-studio/guide.html)
explains the public controls and private boundary.

AI assistance contributed to the code, tests and documentation. No custom
training of a model or general quality improvement is claimed.
