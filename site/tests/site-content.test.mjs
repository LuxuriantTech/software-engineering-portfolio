import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stat } from "node:fs/promises";
import test from "node:test";
import {
  CV_CONTENT,
  DOCUMENTS,
  LETTER_CONTENT,
  documentById,
} from "../src/documentData.js";
import {
  CAPABILITY_GROUPS,
  CONTACT,
  NAV_ITEMS,
  PROJECTS,
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
  assert.match(appSource, /Building with AI\. Learning as I go\./);
  assert.match(appSource, /use coding assistants to build my projects/i);
  assert.match(appSource, /cannot yet write a complete application independently/i);
  assert.match(appSource, /check its behaviour/i);
});

test("avoids unconfirmed education and inflated claims", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const publicCopy = JSON.stringify({ PROJECTS, appSource });
  const rejectedLanguage = [
    /\bstudent\b/i,
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
  assert.match(appSource, /plan to study computer science online/i);
  assert.match(appSource, /self-assessed English at B2 level/i);
});



test("keeps navigation and capability copy concise", () => {
  assert.deepEqual(NAV_ITEMS.map(({ label }) => label), [
    "Work",
    "Method",
    "Skills",
    "Documents",
    "About",
  ]);
  assert.equal(new Set(NAV_ITEMS.map(({ href }) => href)).size, 5);
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

test("renders semantic core sections, direct links and one h1 per rendered branch", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

  for (const id of [
    "main-content",
    "work",
    "method",
    "skills",
    "documents",
    "about",
    "contact",
  ]) {
    assert.match(appSource, new RegExp(`id="${id}"`));
  }
  assert.equal((appSource.match(/<h1/g) ?? []).length, 2);
  assert.match(appSource, /handoffProject \? \([\s\S]*?<RepositoryHandoff[\s\S]*?: \([\s\S]*?<PortfolioExperience/);
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
  assert.match(styleSource, /button:focus-visible/);
  assert.match(styleSource, /summary:focus-visible/);
  assert.match(styleSource, /outline:\s*3px solid var\(--focus\)/);
  assert.match(styleSource, /@media \(max-width: 900px\)/);
  assert.match(styleSource, /\.mobile-menu summary \{[\s\S]*?min-height:\s*44px/);
  assert.match(styleSource, /@media \(max-width: 680px\)/);
  assert.match(styleSource, /@media \(max-width: 380px\)/);
  assert.match(styleSource, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styleSource, /animation:\s*none !important/);
  assert.doesNotMatch(styleSource, /min-width:\s*320px/);
  assert.doesNotMatch(styleSource, /scrollbar[^\n]*display:\s*none/);
  assert.doesNotMatch(styleSource, /\.mobile-panel\s*\{[\s\S]*?position:\s*fixed/);
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
  assert.equal(config.git.deploymentEnabled, true);

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

test("publishes two local, public-safe career documents", async () => {
  assert.deepEqual(DOCUMENTS.map(({ id }) => id), ["cv", "letter"]);
  assert.equal(documentById("letter").shortLabel, "Letter");
  assert.equal(documentById("unknown").shortLabel, "CV");

  const publicCopy = JSON.stringify({ DOCUMENTS, CV_CONTENT, LETTER_CONTENT });
  // Keep this list category-based. Never put a real address, benefit provider,
  // school, phone number or other private value in a test committed publicly.
  for (const pattern of [
    /\+32\s*\d/i,
    /\b(?:street|avenue|road|boulevard|lane|rue|chaussée)\b.{0,80}\b\d{1,5}\b/iu,
    /\b\d{1,5}\b.{0,80}\b(?:street|avenue|road|boulevard|lane|rue|chaussée)\b/iu,
    /\b(?:EUR|USD|GBP)\s?\d+(?:[.,]\d{2})?\b/i,
    /[€$£]\s?\d+(?:[.,]\d{2})?/u,
    /\b(?:benefit|allowance|welfare|social assistance|income|savings|debt)\b/i,
    /\b(?:citizen(?:ship)?|nationality|passport|national register)\b/i,
    /\b(?:currently enrolled|current student)\b/i,
    /\bfluent English\b/i,
  ]) {
    assert.doesNotMatch(publicCopy, pattern);
  }

  assert.match(CV_CONTENT.profile, /coding assistants/i);
  assert.match(CV_CONTENT.profile, /still need AI assistance to write it/i);
  assert.match(CV_CONTENT.education[0].detail, /institution not yet finalised/i);
  assert.match(CV_CONTENT.languages, /self-assessed/i);
  assert.match(LETTER_CONTENT.paragraphs.join(" "), /These personal projects/i);

  for (const document of DOCUMENTS) {
    assert.match(document.pdfPath, /^\/documents\/Ardian_Mehaj_.+\.pdf$/);
    const pdf = await stat(new URL(`../public${document.pdfPath}`, import.meta.url));
    assert.ok(pdf.size > 20_000, `${document.fileName} should be a real generated PDF`);
  }
});

test("renders documents inside the portfolio with native accessible controls", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

  assert.match(appSource, /<dialog/);
  assert.match(appSource, /aria-labelledby="document-viewer-title"/);
  assert.match(appSource, /role="tablist"/);
  assert.match(appSource, /role="tabpanel"/);
  assert.match(appSource, /aria-selected=/);
  assert.match(appSource, /download={activeDocument\.fileName}/);
  assert.match(appSource, /prefers-reduced-motion: reduce/);
  assert.match(appSource, /lastTriggerRef\.current\?\.focus/);
  assert.doesNotMatch(appSource, /<iframe|<embed|<object/i);
  assert.doesNotMatch(appSource, /adobe|docs\.google|drive\.google/i);
});

test("uses restrained CSS 3D and transform-only document motion", async () => {
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styleSource, /\.document-deck[\s\S]*?perspective:\s*1200px/);
  assert.match(styleSource, /transform-style:\s*preserve-3d/);
  assert.match(styleSource, /@keyframes letter-drift/);
  assert.match(styleSource, /@keyframes page-unfold/);
  assert.match(styleSource, /\.document-viewer-canvas[\s\S]*?overflow-y:\s*auto/);
  assert.match(styleSource, /@media \(max-width: 680px\)[\s\S]*?\.document-page-header[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.doesNotMatch(styleSource, /animation[^;]*(left|right|top|bottom|width|height)/i);
});








test("keeps project access immediate and retains native document controls", async () => {
  const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(app, /<Intro onOpenDocument={openDocument} \/>\s*<Work \/>/);
  assert.doesNotMatch(app, /SessionIntro|ProjectTransition|WorkPortal|onClickCapture/);
  assert.doesNotMatch(app, /href=\{`\?repository=/);
  assert.match(app, /href=\{project.url\}/);
  assert.match(app, /observer.unobserve\(entry.target\)/);
});

test("ships actual project previews in full and mobile sizes", async () => {
  for (const name of ["evidencedesk", "synthevia"]) {
    for (const suffix of ["", "-720"]) {
      const image = await readFile(new URL(`../public/images/${name}${suffix}.webp`, import.meta.url));
      assert.equal(image.toString("ascii", 0, 4), "RIFF");
      assert.equal(image.toString("ascii", 8, 12), "WEBP");
      assert.ok(image.length < 180_000);
    }
  }
});

test("PDF generator and reader share the same career content", async () => {
  const shared = JSON.parse(await readFile(new URL("../src/careerContent.json", import.meta.url), "utf8"));
  assert.deepEqual(CV_CONTENT, shared.cv);
  assert.deepEqual(LETTER_CONTENT, shared.letter);
  const generator = await readFile(new URL("../scripts/build_public_documents.py", import.meta.url), "utf8");
  assert.match(generator, /careerContent.json/);
  assert.doesNotMatch(JSON.stringify(shared), /admitted for the September|enrolment pending|OPIT/);
});
