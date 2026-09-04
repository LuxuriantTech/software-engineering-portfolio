import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  CAPABILITIES,
  CAPABILITY_GROUPS,
  CONTACT,
  NAV_ITEMS,
  PROJECTS,
  PROOF_LINE,
  ROOT_REPOSITORY_URL,
  WORKFLOW_STEPS,
  projectFromHash,
} from "../src/siteData.js";

test("publishes six bounded project stories", () => {
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

test("gives every featured project a complete decision dossier", () => {
  const fields = ["intention", "contribution", "works", "proof", "limit"];

  for (const project of PROJECTS.filter(({ featured }) => featured)) {
    for (const field of fields) {
      assert.equal(typeof project[field], "string");
      assert.ok(project[field].length > 55, `${project.name} is missing ${field}`);
    }
  }
});

test("uses dedicated public repositories for the featured projects", () => {
  const evidenceDesk = PROJECTS.find(({ id }) => id === "evidencedesk");
  const contractGuard = PROJECTS.find(({ id }) => id === "api-contract-guard");

  assert.equal(evidenceDesk.url, "https://github.com/LuxuriantTech/evidencedesk");
  assert.equal(contractGuard.url, "https://github.com/LuxuriantTech/api-contract-guard");
});

test("keeps EvidenceDesk's positive and negative evaluation together", () => {
  const project = PROJECTS.find(({ id }) => id === "evidencedesk");
  const publicCopy = JSON.stringify(project);

  assert.match(project.proof, /100%/);
  assert.match(project.proof, /Recall@5/);
  assert.match(project.proof, /25 of 25 answerable synthetic v7 cases/);
  assert.match(project.limit, /did not pass/i);
  assert.match(project.limit, /36% answerable-case accuracy/);
  assert.match(project.limit, /45\.67% extraction F1/);
  assert.match(publicCopy, /synthetic data only/i);
});

test("keeps API Contract Guard bounded and reproducible", () => {
  const project = PROJECTS.find(({ id }) => id === "api-contract-guard");
  const publicCopy = JSON.stringify(project);

  assert.match(publicCopy, /102 local tests/);
  assert.match(publicCopy, /five supported breaking-change categories/i);
  assert.match(publicCopy, /fail closed/i);
  assert.match(project.scope, /bounded compatibility checks/i);
  assert.match(project.limit, /does not claim complete OpenAPI compatibility/i);
});

test("keeps all secondary project limits visible", () => {
  const secondaryCopy = PROJECTS.filter(({ featured }) => !featured)
    .map(({ scope }) => scope)
    .join(" ");

  assert.match(secondaryCopy, /Pre-launch · Public sample only/);
  assert.match(secondaryCopy, /Current runtime unverified/);
  assert.match(secondaryCopy, /Internal R&D · Synthetic research only/);
  assert.match(secondaryCopy, /Paper-only · No profitability claim/);
});

test("describes AI-assisted work without pretending manual authorship", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

  assert.deepEqual(WORKFLOW_STEPS.map(({ title }) => title), [
    "Frame",
    "Direct",
    "Verify",
    "Explain",
  ]);
  assert.match(appSource, /AI speeds up the work\. It does not replace the judgment\./);
  assert.match(appSource, /use coding assistants to explore and build faster/i);
  assert.match(appSource, /define the constraints/i);
  assert.match(appSource, /reproduce failures/i);
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

test("uses the original evidence-workshop identity", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const visualSource = appSource + styleSource;

  assert.match(styleSource, /--porcelain:\s*#f4f1e8/);
  assert.match(styleSource, /--orange:\s*#ff5a36/);
  assert.match(styleSource, /--acid:\s*#f4ed53/);
  assert.match(styleSource, /--cobalt:\s*#2f5cff/);
  assert.match(styleSource, /"Archivo Variable"/);
  assert.match(styleSource, /"IBM Plex Mono"/);
  assert.match(appSource, /className="case-ledger"/);
  assert.match(appSource, /className="proof-line"/);

  for (const pattern of [
    /Newsreader/i,
    /Georgia/i,
    /--sky/i,
    /className="contents"/i,
    /celestial/i,
    /\bmoon\b/i,
    /\bnight\b/i,
    /\bday\/night\b/i,
    /Fable/i,
    /Mythos/i,
    /Anthropic/i,
    /benchmark tabs?/i,
    /box-shadow\s*:/i,
    /backdrop-filter\s*:/i,
    /linear-gradient|radial-gradient/i,
    /\.intro\s*\{[\s\S]*?min-height:\s*100s?vh/i,
  ]) {
    assert.doesNotMatch(visualSource, pattern);
  }
});

test("shows identity, target, contact and a real proof in the intro", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

  assert.match(appSource, /Ardian Mehaj/);
  assert.match(appSource, /Junior software developer/);
  assert.match(appSource, /Available for junior roles/);
  assert.match(appSource, /mailto:/);
  assert.equal(PROOF_LINE.value, "102 local tests");
  assert.match(PROOF_LINE.detail, /five supported breaking-change categories/i);
  assert.equal(PROOF_LINE.href, "#api-contract-guard");
  assert.ok(appSource.indexOf("<Intro />") < appSource.indexOf("<Capabilities />"));
});

test("keeps navigation and capability copy concise", () => {
  assert.deepEqual(NAV_ITEMS.map(({ label }) => label), ["Work", "Method", "Skills", "About"]);
  assert.deepEqual(CAPABILITIES.map(({ title }) => title), ["Frame", "Direct", "Verify"]);
  assert.equal(new Set(NAV_ITEMS.map(({ href }) => href)).size, 4);
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

test("renders semantic core sections, direct links and one h1", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

  for (const id of ["main-content", "work", "method", "skills", "about", "contact"]) {
    assert.match(appSource, new RegExp(`id="${id}"`));
  }
  assert.equal((appSource.match(/<h1/g) ?? []).length, 1);
  assert.match(appSource, /<main id="main-content" tabIndex="-1">/);
  assert.match(appSource, /className="skip-link" href="#main-content"/);
  assert.match(appSource, /label="Primary navigation"/);
  assert.match(appSource, /label="Mobile navigation"/);
  assert.match(appSource, /target="_blank"/);
  assert.match(appSource, /rel="noopener noreferrer"/);
});

test("keeps responsive, touch and keyboard-accessible rules", async () => {
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styleSource, /a:focus-visible/);
  assert.match(styleSource, /summary:focus-visible/);
  assert.match(styleSource, /outline:\s*3px solid var\(--focus\)/);
  assert.match(styleSource, /@media \(max-width: 900px\)/);
  assert.match(styleSource, /\.mobile-menu summary \{[\s\S]*?min-height:\s*44px/);
  assert.match(styleSource, /@media \(max-width: 680px\)/);
  assert.match(styleSource, /@media \(max-width: 380px\)/);
  assert.match(styleSource, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styleSource, /min-width:\s*320px/);
  assert.doesNotMatch(styleSource, /scrollbar[^\n]*display:\s*none/);
  assert.doesNotMatch(styleSource, /\.mobile-panel\s*\{[\s\S]*?position:\s*fixed/);
});

test("keeps long desktop project titles clear of their summaries", async () => {
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styleSource, /\.case-title\s*\{\s*grid-column:\s*2\s*\/\s*7;\s*min-width:\s*0;/);
  assert.match(styleSource, /\.case-summary\s*\{\s*grid-column:\s*7\s*\/\s*11;\s*min-width:\s*0;/);
  assert.match(styleSource, /\.case-meta\s*\{\s*grid-column:\s*11\s*\/\s*13;\s*min-width:\s*0;/);
});

test("bundles the two selected font families locally", async () => {
  const packageConfig = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const mainSource = await readFile(new URL("../src/main.jsx", import.meta.url), "utf8");

  assert.equal(packageConfig.dependencies["@fontsource-variable/archivo"], "5.3.0");
  assert.equal(packageConfig.dependencies["@fontsource/ibm-plex-mono"], "5.3.0");
  assert.equal(packageConfig.dependencies["@fontsource-variable/newsreader"], undefined);
  assert.match(mainSource, /@fontsource-variable\/archivo/);
  assert.match(mainSource, /@fontsource\/ibm-plex-mono\/latin-400\.css/);
  assert.match(mainSource, /@fontsource\/ibm-plex-mono\/latin-500\.css/);
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

test("publishes light-theme search and social metadata without tracking", async () => {
  const htmlSource = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(htmlSource, /Junior Software Developer/i);
  assert.match(htmlSource, /name="color-scheme" content="light"/);
  assert.match(htmlSource, /name="theme-color" content="#f4f1e8"/);
  assert.match(htmlSource, /property="og:title"/);
  assert.match(htmlSource, /rel="canonical"/);
  assert.match(htmlSource, /rel="icon" href="\/favicon\.svg"/);
  assert.doesNotMatch(htmlSource, /google-analytics|googletagmanager|segment\.com/i);
  assert.match(ROOT_REPOSITORY_URL, /software-engineering-portfolio$/);
});
