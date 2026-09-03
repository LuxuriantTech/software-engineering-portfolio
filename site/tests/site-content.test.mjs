import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  CAPABILITY_GROUPS,
  CONTACT,
  CONTENTS,
  EVIDENCE_ITEMS,
  PROJECTS,
  ROOT_REPOSITORY_URL,
  projectFromHash,
} from "../src/siteData.js";

test("publishes six concise project stories", () => {
  assert.equal(PROJECTS.length, 6);
  assert.equal(new Set(PROJECTS.map(({ id }) => id)).size, 6);
  assert.equal(PROJECTS.filter(({ featured }) => featured).length, 2);

  for (const project of PROJECTS) {
    assert.match(project.number, /^0[1-6]$/);
    assert.ok(project.summary.length > 70);
    assert.ok(project.stack.length > 15);
    assert.ok(project.scope.length > 15);
    assert.ok(project.url.startsWith("https://github.com/LuxuriantTech/"));
  }
});

test("uses dedicated public repositories for the featured projects", () => {
  const evidenceDesk = PROJECTS.find(({ id }) => id === "evidencedesk");
  const contractGuard = PROJECTS.find(({ id }) => id === "api-contract-guard");

  assert.equal(evidenceDesk.url, "https://github.com/LuxuriantTech/evidencedesk");
  assert.equal(contractGuard.url, "https://github.com/LuxuriantTech/api-contract-guard");
  assert.equal(evidenceDesk.visual, "document");
  assert.equal(contractGuard.visual, "contract");
});

test("keeps EvidenceDesk's result in its full evaluation context", () => {
  const project = PROJECTS.find(({ id }) => id === "evidencedesk");

  assert.match(project.result, /100% Recall@5/);
  assert.match(project.result, /25 of 25 answerable synthetic v7 cases/);
  assert.match(project.context, /did not pass/i);
  assert.match(project.context, /36% answerable-case accuracy/);
  assert.match(project.context, /45\.67% extraction F1/);
});

test("keeps API Contract Guard bounded and reproducible", () => {
  const project = PROJECTS.find(({ id }) => id === "api-contract-guard");
  const publicCopy = JSON.stringify(project);

  assert.match(publicCopy, /102 tests/);
  assert.match(publicCopy, /five supported breaking-change categories/i);
  assert.match(publicCopy, /fail closed/i);
  assert.match(project.scope, /bounded compatibility checks/i);
});

test("avoids unconfirmed education and inflated claims", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const publicCopy = JSON.stringify({ PROJECTS, appSource });
  const rejectedLanguage = [
    /unconfirmed student claim/i,
    /unconfirmed student claim/i,
    /unconfirmed student claim/i,
    /currently enrolled/i,
    /production[- ]grade/i,
    /fully secure/i,
    /profitable trading system/i,
    /fluent English/i,
    /cutting-edge/i,
    /seamless/i,
    /revolutionary/i,
  ];

  for (const pattern of rejectedLanguage) assert.doesNotMatch(publicCopy, pattern);
  assert.match(appSource, /preparing to begin an online BSc/i);
  assert.match(appSource, /professional English at B2 level/i);
});

test("removes the terminal and AI-dashboard presentation", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const visualSource = appSource + styleSource;

  for (const pattern of [
    /working-model\.md/i,
    /console-steps/i,
    /AI-assisted\. Human-reviewed/i,
    /Responsibility stays with me/i,
    /box-shadow:/i,
    /backdrop-filter:/i,
    /linear-gradient|radial-gradient/i,
  ]) {
    assert.doesNotMatch(visualSource, pattern);
  }

  assert.match(styleSource, /--paper:\s*#f6f4ee/);
  assert.match(styleSource, /--sky:\s*#7f9ec6/);
  assert.match(styleSource, /"Newsreader Variable"/);
});

test("provides a short editorial contents index", () => {
  assert.deepEqual(CONTENTS.map(({ label }) => label), [
    "Introduction",
    "Selected work",
    "Skills",
    "About & contact",
  ]);
  assert.equal(new Set(CONTENTS.map(({ href }) => href)).size, 4);
});

test("keeps recruiter-ready contact and skill information", () => {
  assert.equal(CONTACT.email, "mehajardian@gmail.com");
  assert.match(CONTACT.github, /github\.com\/LuxuriantTech$/);
  assert.match(CONTACT.linkedin, /linkedin\.com\/in\/ardian-mehaj/);
  assert.equal(CAPABILITY_GROUPS.length, 4);
  assert.ok(CAPABILITY_GROUPS.some(({ items }) => items.includes("Python")));
  assert.ok(CAPABILITY_GROUPS.some(({ items }) => items.includes("FastAPI")));
  assert.ok(CAPABILITY_GROUPS.some(({ items }) => items.includes("Playwright")));
});

test("resolves known hashes and safely falls back", () => {
  assert.equal(projectFromHash("#strategy-lab").id, "strategy-lab");
  assert.equal(projectFromHash("#api-contract-guard").id, "api-contract-guard");
  assert.equal(projectFromHash("#unknown").id, "evidencedesk");
  assert.equal(projectFromHash("").id, "evidencedesk");
});

test("renders core sections, direct project links and one h1", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

  for (const id of ["introduction", "work", "skills", "about", "contact"]) {
    assert.match(appSource, new RegExp(`id=\\"${id}\\"`));
  }
  assert.equal((appSource.match(/<h1/g) ?? []).length, 1);
  assert.match(appSource, /Junior software developer/);
  assert.match(appSource, /mailto:/);
  assert.match(appSource, /target="_blank" rel="noopener noreferrer"/);
});

test("keeps responsive and keyboard-accessible rules", async () => {
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styleSource, /a:focus-visible/);
  assert.match(styleSource, /summary:focus-visible/);
  assert.match(styleSource, /outline:\s*3px solid var\(--focus\)/);
  assert.match(styleSource, /@media \(max-width: 820px\)/);
  assert.match(styleSource, /\.mobile-menu summary \{[\s\S]*?min-height:\s*44px/);
  assert.match(styleSource, /@media \(max-width: 400px\)/);
  assert.match(styleSource, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styleSource, /min-width:\s*320px/);
  assert.doesNotMatch(styleSource, /scrollbar[^\n]*display:\s*none/);
});

test("uses three useful facts without invented product success", () => {
  assert.equal(EVIDENCE_ITEMS.length, 3);
  assert.deepEqual(EVIDENCE_ITEMS.map(({ value }) => value), ["6", "102", "Brussels"]);
  assert.match(EVIDENCE_ITEMS[0].detail, /public code or bounded project notes/i);
  assert.match(EVIDENCE_ITEMS[1].detail, /API Contract Guard/);
  assert.match(EVIDENCE_ITEMS[2].detail, /EU work authorisation/);
});

test("bundles the editorial font locally", async () => {
  const packageConfig = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const mainSource = await readFile(new URL("../src/main.jsx", import.meta.url), "utf8");

  assert.equal(packageConfig.dependencies["@fontsource-variable/newsreader"], "5.3.0");
  assert.match(mainSource, /@fontsource-variable\/newsreader/);
});

test("Vercel serves only the static build with restrictive headers", async () => {
  const packageConfig = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));

  assert.equal(packageConfig.scripts.build, "vite build");
  assert.equal(config.outputDirectory, "dist/client");
  assert.equal(config.framework, "vite");
  assert.equal(config.git.deploymentEnabled, false);

  const headers = Object.fromEntries(
    config.headers[0].headers.map(({ key, value }) => [key.toLowerCase(), value]),
  );
  assert.match(headers["content-security-policy"], /default-src 'self'/);
  assert.match(headers["content-security-policy"], /form-action 'none'/);
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.equal(headers["cross-origin-opener-policy"], "same-origin");
});

test("publishes light-theme search and social metadata", async () => {
  const htmlSource = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(htmlSource, /Junior full-stack developer/i);
  assert.match(htmlSource, /name="color-scheme" content="light"/);
  assert.match(htmlSource, /name="theme-color" content="#f6f4ee"/);
  assert.match(htmlSource, /property="og:title"/);
  assert.match(htmlSource, /rel="canonical"/);
  assert.match(htmlSource, /rel="icon" href="\/favicon\.svg"/);
  assert.doesNotMatch(htmlSource, /google-analytics|googletagmanager|segment\.com/i);
  assert.match(ROOT_REPOSITORY_URL, /software-engineering-portfolio$/);
});
