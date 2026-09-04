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
  CAPABILITIES,
  CAPABILITY_GROUPS,
  CONTACT,
  EVIDENCE_LENS,
  EVIDENCE_SNAPSHOT,
  NAV_ITEMS,
  PROJECTS,
  PROOF_LINE,
  ROOT_REPOSITORY_URL,
  WORKFLOW_STEPS,
  projectFromHash,
} from "../src/siteData.js";
import {
  browserPrefersReducedMotion,
  SESSION_INTRO_MAX_DURATION_MS,
  shouldShowSessionIntro,
} from "../src/sessionIntroState.js";

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
    /University of London student/i,
    /OPIT student/i,
    /Open University student/i,
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
  assert.match(appSource, /self-assessed English at B2 level/i);
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
    /backdrop-filter\s*:/i,
    /linear-gradient|radial-gradient/i,
    /\.intro\s*\{[^}]*?min-height:\s*100s?vh/i,
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
  assert.ok(
    appSource.indexOf("<Intro onOpenDocument={openDocument} />") <
      appSource.indexOf("<Capabilities />"),
  );
});

test("keeps navigation and capability copy concise", () => {
  assert.deepEqual(NAV_ITEMS.map(({ label }) => label), [
    "Work",
    "Method",
    "Skills",
    "Documents",
    "About",
  ]);
  assert.deepEqual(CAPABILITIES.map(({ title }) => title), ["Frame", "Direct", "Verify"]);
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
  for (const pattern of [
    /\+32\s*\d/i,
    /Avenue Franz Guillaume/i,
    /\b1140\b/i,
    /Belgian citizen/i,
    /CPAS/i,
    /financial aid/i,
    /University of London student/i,
    /currently enrolled/i,
    /fluent English/i,
  ]) {
    assert.doesNotMatch(publicCopy, pattern);
  }

  assert.match(CV_CONTENT.profile, /coding assistants/i);
  assert.match(CV_CONTENT.profile, /strengthen.*independent coding/i);
  assert.match(CV_CONTENT.education[0].detail, /enrolment pending/i);
  assert.match(CV_CONTENT.languages, /self-assessed/i);
  assert.match(LETTER_CONTENT.paragraphs.join(" "), /not substitutes for professional experience/i);

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

test("plays the opening sequence on every full load unless motion is reduced", () => {
  assert.equal(shouldShowSessionIntro({ reducedMotion: false }), true);
  assert.equal(shouldShowSessionIntro({ reducedMotion: false }), true);
  assert.equal(shouldShowSessionIntro({ reducedMotion: true }), false);
  assert.equal(browserPrefersReducedMotion({}), true);
  assert.equal(
    browserPrefersReducedMotion({ matchMedia: () => ({ matches: false }) }),
    false,
  );
  assert.ok(SESSION_INTRO_MAX_DURATION_MS >= 2500);
  assert.ok(SESSION_INTRO_MAX_DURATION_MS <= 3000);
});

test("keeps the 3D opening sequence bounded, accessible and dependency-free", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const packageConfig = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.match(appSource, /function SessionIntro/);
  assert.match(appSource, /className="session-intro"/);
  assert.match(appSource, /role="status"/);
  assert.match(appSource, /aria-label="Opening Ardian Mehaj's portfolio"/);
  assert.match(appSource, />\s*Skip intro\s*</);
  assert.match(appSource, />\s*Replay opening\s*</);
  assert.match(appSource, /onAnimationEnd=/);
  assert.match(appSource, /SESSION_INTRO_MAX_DURATION_MS/);
  assert.match(styleSource, /perspective:\s*1100px/);
  assert.match(styleSource, /transform-style:\s*preserve-3d/);
  assert.match(styleSource, /@keyframes session-intro-register/);
  assert.match(styleSource, /\.session-intro\s*\{[\s\S]*?pointer-events:\s*auto/);
  assert.match(
    styleSource,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.session-intro\s*\{[\s\S]*?display:\s*none !important/,
  );
  assert.doesNotMatch(styleSource, /session-intro[^}]*animation:[^;}]*infinite/i);
  assert.equal(packageConfig.dependencies?.three, undefined);
  assert.equal(packageConfig.dependencies?.["@react-three/fiber"], undefined);
  assert.match(appSource, /className=\{`site-content[\s\S]{0,180}?inert=/);
  assert.doesNotMatch(appSource, /<main[^>]*(?:inert|aria-hidden)/i);
});

test("adds bounded cinematic motion for project navigation and scroll reveals", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(appSource, /function ProjectTransition/);
  assert.match(appSource, /function WorkPortal/);
  assert.match(appSource, /IntersectionObserver/);
  assert.match(appSource, /handleCinematicNavigation/);
  assert.match(appSource, /window\.history\.pushState/);
  assert.match(appSource, /focus\(\{ preventScroll: true \}\)/);
  assert.match(appSource, />\s*Skip transition\s*</);
  assert.match(appSource, /inert=\{isSessionIntroVisible \|\| projectTransitionTarget/);
  assert.match(appSource, /motionPreference\.addEventListener\("change"/);
  assert.match(appSource, /motionPreference\.removeEventListener\("change"/);
  assert.match(styleSource, /@keyframes project-camera-zoom/);
  assert.match(styleSource, /\.work-portal-stage\s*\{[\s\S]*?perspective:\s*1300px/);
  assert.match(styleSource, /\.project-transition\s*\{[\s\S]*?pointer-events:\s*auto/);
  assert.match(
    styleSource,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.project-transition\s*\{[\s\S]*?display:\s*none !important/,
  );
});

test("uses a distinct, skippable handoff before opening featured GitHub repositories", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  for (const project of PROJECTS.filter(({ featured }) => featured)) {
    assert.equal(project.repositorySignals.length, 3);
    assert.equal(new Set(project.repositorySignals).size, 3);
    assert.match(project.url, /^https:\/\/github\.com\/LuxuriantTech\//);
    assert.match(
      project.repositoryEvidenceUrl,
      new RegExp(`^${project.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/blob/main/`),
    );
  }

  assert.match(appSource, /function RepositoryHandoff/);
  assert.match(appSource, /\?repository=\$\{encodeURIComponent\(project\.id\)\}/);
  assert.match(appSource, /target="_blank"/);
  assert.match(appSource, /rel="noopener noreferrer"/);
  assert.match(appSource, /window\.location\.replace\(project\.url\)/);
  assert.match(appSource, /reducedMotion \? 0 : 1700/);
  assert.match(appSource, />\s*Open GitHub now\s*</);
  assert.match(appSource, /skipLinkRef\.current\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(appSource, /href=\{project\.url\} ref=\{skipLinkRef\}/);
  assert.match(appSource, /aria-label="Repository review signals"/);
  assert.match(appSource, /href=\{project\.repositoryEvidenceUrl\}/);
  assert.match(appSource, /event\.key === "Escape"/);
  assert.match(styleSource, /@keyframes repository-scan-cross/);
  assert.match(styleSource, /@keyframes repository-signal-lock/);
  assert.match(
    styleSource,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.repository-handoff[\s\S]*?animation:\s*none !important/,
  );
  assert.doesNotMatch(appSource, /<iframe|<video/i);
  assert.match(styleSource, /\.repository-handoff\s*\{[^}]*overflow-y:\s*auto/);
});

test("keeps the portfolio's evidence and motion honest as sections replay", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const dataSource = await readFile(new URL("../src/siteData.js", import.meta.url), "utf8");

  // A reveal must be reversible: visitors who scroll back through a section should
  // see its entrance motion again, rather than only seeing it on first arrival.
  assert.match(
    appSource,
    /classList\.toggle\("is-revealed",\s*entry\.isIntersecting\)/,
  );
  assert.doesNotMatch(appSource, /observer\.unobserve\(/);

  // Keep the range legible when the paper stack overlaps the portal: the two
  // numbers and separator need independent elements that CSS can position.
  assert.match(appSource, /className="work-portal-range"/);
  assert.match(appSource, /className="work-portal-range-start"[^>]*>\s*01\s*</);
  assert.match(appSource, /className="work-portal-range-dash"[^>]*>\s*[—-]\s*</);
  assert.match(appSource, /className="work-portal-range-end"[^>]*>\s*06\s*</);

  // The progress panel must make its status and its Contract Guard evidence
  // inspectable. The numbers are intentionally asserted as displayed values,
  // not converted into an inflated success claim.
  assert.match(dataSource, /In progress/);
  for (const value of ["102", "94.12", "88.72", "100", "98.67"]) {
    assert.ok(dataSource.includes(value), `missing visible evidence value ${value}`);
  }

  // The capabilities section should have its own compact rhythm and the portal
  // range needs an explicit small-screen treatment, rather than relying on
  // incidental overlap from the desktop composition.
  assert.match(styleSource, /\.capabilities-section--compact\s*\{[\s\S]*?padding:/);
  assert.match(styleSource, /\.work-portal-range\s*\{/);
  assert.match(styleSource, /\.work-portal-range-start\s*\{/);
  assert.match(styleSource, /\.work-portal-range-end\s*\{/);
  assert.match(
    styleSource,
    /@media \(max-width: 680px\)[\s\S]*?\.work-portal-range\s*\{/,
  );
});

test("turns one supported project claim into an accessible three-state evidence lens", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.deepEqual(EVIDENCE_LENS.map(({ id }) => id), ["claim", "check", "limit"]);
  assert.match(JSON.stringify(EVIDENCE_LENS), /102/);
  assert.match(JSON.stringify(EVIDENCE_LENS), /five rules/i);
  assert.match(JSON.stringify(EVIDENCE_LENS), /fail closed/i);
  assert.match(EVIDENCE_SNAPSHOT.runUrl, /actions\/runs\/33274063682$/);
  assert.match(appSource, /function EvidenceLens/);
  assert.match(appSource, /role="tablist" aria-label="Inspect the project claim"/);
  assert.match(appSource, /role="tabpanel"/);
  assert.match(appSource, /aria-selected=/);
  assert.match(appSource, /tabIndex=\{lens\.id === activeLens\.id \? 0 : -1\}/);
  assert.match(appSource, /ArrowLeft/);
  assert.match(appSource, /ArrowRight/);
  assert.match(appSource, /Home/);
  assert.match(appSource, /End/);
  assert.match(styleSource, /\.evidence-lens-artifact[\s\S]*?perspective:\s*1500px/);
  assert.match(styleSource, /@keyframes lens-paper-register/);
  assert.doesNotMatch(appSource + styleSource, /<canvas|\bWebGL\b|\bparticles?\b/i);
});

test("gives controls tactile feedback and returns documents to their trigger", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(appSource, /function useControlPressFeedback/);
  assert.match(appSource, /pointerdown/);
  assert.match(appSource, /event\.key !== "Enter" && event\.key !== " "/);
  assert.match(appSource, /classList\.add\("is-pressing"\)/);
  assert.match(styleSource, /@keyframes control-register/);
  assert.match(styleSource, /box-shadow:\s*inset 7px 0 0 var\(--press-color/);

  assert.match(appSource, /data-direction=\{slideDirection\}/);
  assert.match(appSource, /setSlideDirection\(nextIndex >= currentIndex \? "forward" : "back"\)/);
  assert.match(appSource, /moveBetweenTabs/);
  assert.match(appSource, /function readDocumentOrigin/);
  assert.match(appSource, /originElement = trigger\.querySelector\("svg"\) \?\? trigger/);
  assert.match(appSource, /--document-flight-x/);
  assert.match(appSource, /--document-flight-scale/);
  assert.match(appSource, /className="document-flight"/);
  assert.match(styleSource, /@keyframes document-flight-arrive/);
  assert.match(styleSource, /@keyframes document-flight-return/);
  assert.match(styleSource, /var\(--document-flight-x\)/);
  assert.match(styleSource, /scale\(var\(--document-flight-scale\)\)/);
  assert.match(styleSource, /@keyframes page-unfold-back/);
  assert.match(styleSource, /\.document-viewer-shell[\s\S]*?transform-origin:\s*center/);
  assert.doesNotMatch(styleSource, /translate3d\(102%, 0, 0\)/);
});
