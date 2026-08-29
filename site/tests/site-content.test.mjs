import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  EVIDENCE_ITEMS,
  PROJECTS,
  ROOT_REPOSITORY_URL,
  projectFromHash,
  skipToProjectDetails,
} from "../src/siteData.js";

test("publishes six distinct, bounded project summaries", () => {
  assert.equal(PROJECTS.length, 6);
  assert.equal(new Set(PROJECTS.map(({ id }) => id)).size, 6);

  for (const project of PROJECTS) {
    assert.ok(project.limitation.length > 30);
    assert.equal(project.highlights.length, 3);
    if (project.id === "evidencedesk") {
      assert.equal(project.url, "https://github.com/LuxuriantTech/evidencedesk");
    } else if (project.id === "api-contract-guard") {
      assert.equal(project.url, "https://github.com/LuxuriantTech/api-contract-guard");
    } else {
      assert.ok(project.url.startsWith(ROOT_REPOSITORY_URL + "/tree/main/projects/"));
    }
  }
});

test("avoids unconfirmed education and rejected marketing claims", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const publicCopy = JSON.stringify({ EVIDENCE_ITEMS, PROJECTS, appSource });
  const rejectedLanguage = [
    /unconfirmed student claim/i,
    /Planning to begin the University of London/i,
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
  assert.equal(projectFromHash("#evidencedesk").id, "evidencedesk");
  assert.equal(projectFromHash("#api-contract-guard").id, "api-contract-guard");
  assert.equal(projectFromHash("#unknown").id, "evidencedesk");
  assert.equal(projectFromHash("").id, "evidencedesk");
});

test("keeps EvidenceDesk's dedicated URL, HONEST_NEGATIVE status, and v7 answerable limit", () => {
  const evidencedesk = PROJECTS.find((project) => project.id === "evidencedesk");
  assert.ok(evidencedesk);
  assert.match(evidencedesk.status, /HONEST_NEGATIVE/);
  assert.equal(evidencedesk.url, "https://github.com/LuxuriantTech/evidencedesk");
  assert.match(evidencedesk.limitation, /36%/);
});

test("keeps API Contract Guard local, bounded, and linked to its dedicated repository", () => {
  const guard = PROJECTS.find((project) => project.id === "api-contract-guard");
  assert.ok(guard);
  assert.equal(guard.url, "https://github.com/LuxuriantTech/api-contract-guard");
  assert.equal(guard.highlights.length, 3);
  assert.match(guard.highlights.join(" "), /five supported/i);
  assert.match(guard.limitation, /local tool/i);
  assert.match(guard.limitation, /not .*general compatibility verdict/i);
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

  assert.match(appSource, /Browse all six projects/);
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
  assert.equal(config.git.deploymentEnabled, false);
  assert.equal(config.headers.length, 1);

  const headers = Object.fromEntries(
    config.headers[0].headers.map(({ key, value }) => [key.toLowerCase(), value]),
  );
  assert.match(headers["content-security-policy"], /default-src 'self'/);
  assert.match(headers["content-security-policy"], /form-action 'none'/);
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.equal(headers["cross-origin-opener-policy"], "same-origin");
});
