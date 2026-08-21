import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  EDUCATION_STATEMENT,
  EVIDENCE_ITEMS,
  PROJECTS,
  ROOT_REPOSITORY_URL,
  projectFromHash,
  skipToProjectDetails,
} from "../src/siteData.js";

test("publishes four distinct, bounded project summaries", () => {
  assert.equal(PROJECTS.length, 4);
  assert.equal(new Set(PROJECTS.map(({ id }) => id)).size, 4);

  for (const project of PROJECTS) {
    assert.ok(project.limitation.length > 30);
    assert.equal(project.highlights.length, 3);
    assert.ok(project.url.startsWith(ROOT_REPOSITORY_URL + "/tree/main/projects/"));
  }
});

test("keeps education conditional and avoids rejected marketing claims", () => {
  assert.equal(
    EDUCATION_STATEMENT,
    "Planning to begin the University of London BSc Computer Science programme in October 2026.",
  );

  const publicCopy = JSON.stringify({ EDUCATION_STATEMENT, EVIDENCE_ITEMS, PROJECTS });
  const rejectedLanguage = [
    /University of London student/i,
    /production[- ]grade/i,
    /fully secure/i,
    /profitable trading system/i,
    /cutting-edge/i,
    /seamless/i,
    /revolutionary/i,
  ];

  for (const pattern of rejectedLanguage) assert.doesNotMatch(publicCopy, pattern);
});

test("resolves known hashes and falls back without creating a route", () => {
  assert.equal(projectFromHash("#strategy-lab").id, "strategy-lab");
  assert.equal(projectFromHash("#unknown").id, "synthevia");
  assert.equal(projectFromHash("").id, "synthevia");
});

test("skip link focuses the active detail without changing its project hash", () => {
  let prevented = false;
  let focused = false;
  let scrolled = false;
  const detail = {
    focus: () => {
      focused = true;
    },
    scrollIntoView: () => {
      scrolled = true;
    },
  };

  skipToProjectDetails(
    { preventDefault: () => { prevented = true; } },
    { getElementById: (id) => (id === "project-detail" ? detail : null) },
  );

  assert.equal(prevented, true);
  assert.equal(focused, true);
  assert.equal(scrolled, true);
});

test("labels focused test metrics with date, scope, and public evidence", () => {
  const focusedMetrics = EVIDENCE_ITEMS.filter((item) => item.kind === "test-metric");
  assert.equal(focusedMetrics.length, 2);

  for (const item of focusedMetrics) {
    assert.match(item.label, /^\d+ focused (Python|frontend) tests$/);
    assert.match(item.detail, /21 August 2026/);
    assert.match(item.detail, /selected public/i);
    assert.ok(item.evidenceLinks.length >= 1);
    for (const link of item.evidenceLinks) {
      assert.ok(link.url.startsWith(ROOT_REPOSITORY_URL));
      assert.match(link.url, /#(testing-and-evidence|evidence|verified-checks|targeted-checks)/);
    }
  }
});

test("visually separates each evidence label from its detail", async () => {
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styleSource, /\.evidence-item strong\s*\{\s*display:\s*block;/);
  assert.match(styleSource, /\.evidence-item strong[\s\S]*margin-bottom:\s*4px;/);
  assert.match(styleSource, /\.evidence-item > div\s*\{\s*min-width:\s*0;/);
});

test("keeps mobile project choices visibly discoverable", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(appSource, /Browse all four projects/);
  assert.match(styleSource, /\.project-tabs-hint/);
  assert.doesNotMatch(styleSource, /\.project-tabs::-webkit-scrollbar\s*\{\s*display:\s*none;/);
});

test("Vercel serves only the static client build with restrictive headers", async () => {
  const packageConfig = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(packageConfig.scripts.build, "vite build");
  assert.equal(packageConfig.scripts["test:sites"], undefined);
  assert.equal(config.outputDirectory, "dist/client");
  assert.equal(config.framework, "vite");
  assert.equal(config.headers.length, 1);

  const headers = Object.fromEntries(
    config.headers[0].headers.map(({ key, value }) => [key.toLowerCase(), value]),
  );
  assert.match(headers["content-security-policy"], /default-src 'self'/);
  assert.match(headers["content-security-policy"], /form-action 'none'/);
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.equal(headers["cross-origin-opener-policy"], "same-origin");
});
