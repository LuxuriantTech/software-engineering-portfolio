import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  CAPABILITY_GROUPS,
  CONTACT,
  EVIDENCE_ITEMS,
  PROCESS_STEPS,
  PROJECTS,
  ROOT_REPOSITORY_URL,
  projectFromHash,
} from "../src/siteData.js";

test("publishes six distinct and reviewable project stories", () => {
  assert.equal(PROJECTS.length, 6);
  assert.equal(new Set(PROJECTS.map(({ id }) => id)).size, 6);
  assert.equal(PROJECTS.filter(({ featured }) => featured).length, 2);

  for (const project of PROJECTS) {
    assert.match(project.number, /^0[1-6]$/);
    assert.ok(project.summary.length > 70);
    assert.ok(project.responsibility.length > 50);
    assert.equal(project.highlights.length, 3);
    assert.ok(project.limitation.length > 70);
    assert.ok(project.stack.length >= 4);
    assert.ok(project.url.startsWith("https://github.com/LuxuriantTech/"));
  }
});

test("uses dedicated repositories for the two featured public projects", () => {
  const evidenceDesk = PROJECTS.find(({ id }) => id === "evidencedesk");
  const contractGuard = PROJECTS.find(({ id }) => id === "api-contract-guard");

  assert.equal(evidenceDesk.url, "https://github.com/LuxuriantTech/evidencedesk");
  assert.equal(contractGuard.url, "https://github.com/LuxuriantTech/api-contract-guard");
  assert.equal(evidenceDesk.featured, true);
  assert.equal(contractGuard.featured, true);
});

test("keeps EvidenceDesk's positive and negative evaluation results together", () => {
  const project = PROJECTS.find(({ id }) => id === "evidencedesk");
  const publicCopy = JSON.stringify(project);

  assert.equal(project.outcome, "HONEST_NEGATIVE");
  assert.match(publicCopy, /100% Recall@5/);
  assert.match(publicCopy, /36% answerable-case accuracy/);
  assert.match(publicCopy, /45\.67% extraction F1/);
  assert.match(project.limitation, /not a production-ready/i);
});

test("keeps API Contract Guard local, bounded and reproducible", () => {
  const project = PROJECTS.find(({ id }) => id === "api-contract-guard");
  const publicCopy = JSON.stringify(project);

  assert.match(publicCopy, /five supported breaking-change categories/i);
  assert.match(publicCopy, /102-test suite/i);
  assert.match(project.limitation, /bounded OpenAPI subset/i);
  assert.match(project.limitation, /not a hosted service/i);
  assert.match(project.limitation, /not .*universal compatibility verdict/i);
});

test("avoids unconfirmed education and inflated career claims", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const publicCopy = JSON.stringify({ EVIDENCE_ITEMS, PROJECTS, appSource });
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
  assert.match(appSource, /English B2/);
});

test("explains AI-assisted work without outsourcing responsibility", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

  assert.match(appSource, /using AI to accelerate the work while owning/i);
  assert.match(appSource, /AI speeds up execution/);
  assert.match(appSource, /Responsibility stays with me/);
  assert.match(appSource, /I do not pretend to write every line without assistance/);
  assert.match(appSource, /defining what matters/i);
  assert.equal(PROCESS_STEPS.length, 4);
});

test("provides recruiter-ready identity, contact and role information", () => {
  assert.equal(CONTACT.email, "mehajardian@gmail.com");
  assert.match(CONTACT.github, /github\.com\/LuxuriantTech$/);
  assert.match(CONTACT.linkedin, /linkedin\.com\/in\/ardian-mehaj/);
  assert.equal(CAPABILITY_GROUPS.length, 4);
  assert.ok(CAPABILITY_GROUPS.some(({ title }) => title === "Applied AI"));
});

test("resolves known project hashes and safely falls back", () => {
  assert.equal(projectFromHash("#strategy-lab").id, "strategy-lab");
  assert.equal(projectFromHash("#api-contract-guard").id, "api-contract-guard");
  assert.equal(projectFromHash("#unknown").id, "evidencedesk");
  assert.equal(projectFromHash("").id, "evidencedesk");
});

test("renders all core recruiter sections and direct project anchors", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

  for (const id of ["work", "approach", "capabilities", "about", "contact"]) {
    assert.match(appSource, new RegExp(`id=\\"${id}\\"`));
  }
  assert.match(appSource, /Building useful software/);
  assert.match(appSource, /with proof attached/);
  assert.match(appSource, /mailto:/);
  assert.match(appSource, /target="_blank" rel="noopener noreferrer"/);
});

test("keeps responsive and keyboard-accessible presentation rules", async () => {
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styleSource, /a:focus-visible/);
  assert.match(styleSource, /outline:\s*3px solid var\(--focus\)/);
  assert.match(styleSource, /@media \(max-width: 680px\)/);
  assert.match(styleSource, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styleSource, /min-width:\s*320px/);
  assert.doesNotMatch(styleSource, /scrollbar[^\n]*display:\s*none/);
});

test("uses truthful evidence labels with matching detail", () => {
  assert.equal(EVIDENCE_ITEMS.length, 4);
  assert.deepEqual(EVIDENCE_ITEMS.map(({ value }) => value), ["6", "102", "100%", "6/6"]);
  assert.match(EVIDENCE_ITEMS[1].detail, /API Contract Guard/);
  assert.match(EVIDENCE_ITEMS[2].detail, /25 answerable synthetic v7 cases/);
  assert.match(EVIDENCE_ITEMS[3].detail, /scope and limits/);
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

test("publishes useful search and social metadata", async () => {
  const htmlSource = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(htmlSource, /Junior full-stack developer/i);
  assert.match(htmlSource, /property="og:title"/);
  assert.match(htmlSource, /property="og:description"/);
  assert.match(htmlSource, /rel="canonical"/);
  assert.match(htmlSource, /ardian-mehaj-portfolio\.vercel\.app/);
  assert.doesNotMatch(htmlSource, /google-analytics|googletagmanager|segment\.com/i);
  assert.match(ROOT_REPOSITORY_URL, /software-engineering-portfolio$/);
});
