export const ROOT_REPOSITORY_URL =
  "https://github.com/LuxuriantTech/software-engineering-portfolio";

export const CONTACT = {
  email: "mehajardian@gmail.com",
  github: "https://github.com/LuxuriantTech",
  linkedin: "https://www.linkedin.com/in/ardian-mehaj-572b5a3b0/",
};

export const NAV_ITEMS = [
  { label: "Work", href: "#work" },
  { label: "Method", href: "#method" },
  { label: "Skills", href: "#skills" },
  { label: "Documents", href: "#documents" },
  { label: "About", href: "#about" },
];

export const PROJECTS = [
  {
    id: "evidencedesk",
    number: "04",
    name: "EvidenceDesk",
    category: "Document review",
    status: "Experimental",
    featured: false,
    summary:
      "Inspect a frozen v7 question that retrieved the right passage but confused an effective date with renewal. The public source keeps the failed evaluation visible.",
    example: "Ask about an annual fee, follow the answer to its source, then try a question the document cannot answer.",
    decision: "Keep the source beside the answer, and leave a question unanswered when evidence is missing.",
    shortLimit: "The answer evaluation did not pass. Finding a relevant passage was not enough to produce reliable answers.",
    intention:
      "Help a reviewer find source-backed answers without asking them to trust generated text on its own.",
    contribution:
      "I framed the review workflow, defined the evidence and abstention rules, and iterated on the implementation with coding assistants.",
    works:
      "The prototype retrieves supporting passages, links an answer to its page and can abstain when it does not find enough evidence.",
    proof: "Recall@5 reached 100% on 25 of 25 answerable synthetic v7 cases.",
    limit:
      "The wider answer evaluation did not pass: 36% answerable-case accuracy and 45.67% extraction F1. It remains experimental and uses synthetic data only.",
    stack: "React · FastAPI · Redis · PostgreSQL · pgvector",
    scope: "Experimental public project · Synthetic data only",
    url: "https://github.com/LuxuriantTech/evidencedesk",
    demoUrl: "/projects/evidencedesk/",
    linkLabel: "Inspect the repository",
    repositorySignals: ["25/25 RECALL@5", "PAGE-LINKED", "LIMITS VISIBLE"],
    repositoryEvidenceUrl:
      "https://github.com/LuxuriantTech/evidencedesk/blob/main/docs/release-validation.md",
  },
  {
    id: "api-contract-guard",
    number: "01",
    name: "API Contract Guard",
    category: "Developer tooling",
    status: "Reviewable sample",
    featured: true,
    summary:
      "Help a developer spot API changes that could break an existing integration before those changes are released.",
    example: "Add a required region parameter to an existing endpoint. A client that does not send it could stop working.",
    decision: "Report the exact change and its location, and reject inputs the tool cannot reliably compare.",
    shortLimit: "Covers five defined change categories. Other OpenAPI features are outside its scope.",
    intention:
      "Make a deliberately bounded set of API changes reviewable before they reach another system.",
    contribution:
      "I defined the supported change categories, expected reports and failure boundaries, then reviewed the implementation and test cases.",
    works:
      "The local CLI produces JSON and HTML reports. The browser demo now runs the same comparison rules on editable JSON/YAML inputs, with explicit input and reference limits.",
    proof: "102 local tests cover five supported breaking-change categories.",
    limit:
      "It does not claim complete OpenAPI compatibility. Unsupported shapes, references and oversized inputs fail closed instead of producing a guess.",
    stack: "TypeScript · Node.js · OpenAPI · JSON · HTML",
    scope: "Local CLI · Deliberately bounded compatibility checks",
    url: "https://github.com/LuxuriantTech/api-contract-guard",
    demoUrl: "/projects/api-contract-guard/",
    linkLabel: "Inspect the repository",
    repositorySignals: ["5 CHECKS", "102 TESTS", "FAILS CLOSED"],
    repositoryEvidenceUrl:
      "https://github.com/LuxuriantTech/api-contract-guard/blob/main/VALIDATION.md",
    repositorySourceUrl: "https://github.com/LuxuriantTech/api-contract-guard/blob/6ee1e569bbe751748a96e52aa0eee86864f20d69/src/engine.ts",
    repositoryTestUrl: "https://github.com/LuxuriantTech/api-contract-guard/blob/6ee1e569bbe751748a96e52aa0eee86864f20d69/tests/rules.test.ts",
    localCommand: "npm ci && npm run demo",
  },
  {
    id: "synthevia",
    number: "05",
    name: "Synthévia",
    category: "Full-stack product",
    status: "Public demo",
    featured: false,
    summary: "Inspect a public React view backed by local FastAPI and an in-memory SQLite synthetic record. The private PostgreSQL product is a separate system.",
    intention: "Make the product understandable through complete journeys rather than isolated screens.",
    example: "Explore a market overview, open the learning area and see how the product presents its different states.",
    decision: "Give visitors a separate demo with fictional data so they can explore the product without access to private accounts.",
    contribution: "I define the product needs and organise the AI-assisted implementation, reviews and follow-up changes.",
    works: "The public sample loads a synthetic record through React, local FastAPI and in-memory SQLite. A separate product demo shows fictional journeys.",
    proof: "The public code contains the React view, FastAPI route and focused tests. The private product's PostgreSQL, account and persistence paths are excluded.",
    limit: "The public sample does not demonstrate private authentication, durable storage, production use or trading profitability.",
    shortLimit: "Public code uses in-memory SQLite; private PostgreSQL and account flows are outside this sample.",
    stack: "React · TypeScript · FastAPI · in-memory SQLite",
    scope: "Public React/FastAPI/SQLite sample · Private product separate",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/synthevia",
    liveUrl: "https://xn--synthvia-f1a.com/project",
    demoUrl: "https://xn--synthvia-f1a.com/demo/",
  },
  {
    id: "gargantua",
    number: "06",
    name: "Gargantua / GLXBot",
    category: "Community operations",
    status: "Runtime unverified",
    featured: false,
    summary: "A member's moderation request is rejected at the async service boundary; an allowed action records identifiers and a synthetic reason. The separate FastAPI response shows fictional guild data.",
    stack: "Python · FastAPI · asyncio · In-memory records",
    scope: "Public sample · Current runtime unverified",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/gargantua",
  },
  {
    id: "strategy-lab",
    number: "09",
    name: "Synthevia Strategy Lab",
    category: "Research tooling",
    status: "In progress",
    featured: false,
    summary: "Python controls designed to reject weak market hypotheses before capital is involved.",
    stack: "Python · Statistics · Evaluation",
    scope: "Internal R&D · Synthetic research only",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/strategy-lab",
  },
  {
    id: "mytradingbot",
    number: "10",
    name: "MyTradingBot",
    category: "Risk automation",
    status: "In progress",
    featured: false,
    summary: "A paper-first automation prototype with explicit risk, execution and qualification gates.",
    stack: "Python · Async systems · Risk controls",
    scope: "Paper-only · No profitability claim",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/mytradingbot",
  },
  {
    id: "toolcall-replay",
    number: "02",
    name: "ToolCall Replay",
    category: "Workflow review",
    status: "Public source snapshot",
    featured: true,
    summary: "Follow an automated workflow step by step and understand why a tool call was accepted or rejected.",
    stack: "Synthetic trace · Versioned rules · Local evaluator",
    scope: "Public source snapshot · Prepared browser walkthrough · Local evaluator",
    url: "https://github.com/LuxuriantTech/toolcall-replay",
    demoUrl: "/projects/toolcall-replay/",
    example: "Select the risky update and inspect the expected FAIL: broad lookup, forbidden export and missing approval.",
    decision: "A rejected trace is a rule verdict. Invalid input is an error and produces no partial report.",
    shortLimit: "The browser trace is hand-authored. Run the public local evaluator to compute a verdict.",
    intention: "Make a tool-call trace explainable through explicit, versioned rules and visible failure paths.",
    contribution: "I frame the task and review AI-assisted implementation and tests while learning to write code independently.",
    works: "The public local evaluator applies deterministic rules to synthetic traces; this browser page only replays prepared data.",
    proof: "Rule code, selected runtime tests and synthetic trace fixtures are available in the public source snapshot.",
    limit: "The snapshot omits private Git history and some historical checks. No tool or model runs in the browser walkthrough.",
    repositorySourceUrl: "https://github.com/LuxuriantTech/toolcall-replay/blob/0c68b24f87992099c05249e27dc16f20d39c7c79/src/toolcall_replay/rules.py",
    repositoryTestUrl: "https://github.com/LuxuriantTech/toolcall-replay/blob/0c68b24f87992099c05249e27dc16f20d39c7c79/tests/test_rules.py",
    localCommand: "uv sync --frozen; scripts/lab.sh start",
  },
  {
    id: "entity-resolution-workbench",
    number: "03",
    name: "Entity Resolution Workbench",
    category: "Data quality",
    status: "Public source snapshot",
    featured: true,
    summary: "Compare two records, inspect their differences and decide whether they might describe the same entity.",
    stack: "Synthetic records · Comparison reasons · Review threshold",
    scope: "Public source snapshot · Prepared browser comparison · Local matcher",
    url: "https://github.com/LuxuriantTech/entity-resolution-workbench",
    demoUrl: "/projects/entity-resolution-workbench/",
    example: "Inspect the Harbor Desk Lamp pair: its score is shown, while conflicting SKU and a rival keep the engine outcome at REVIEW.",
    decision: "Keep similarity, deterministic engine decision and session-only human annotation separate.",
    shortLimit: "The browser threshold changes only the explanation; it does not rerun the matching engine.",
    intention: "Help a reviewer understand why two synthetic catalogue records match, differ or need review.",
    contribution: "I frame the task and review AI-assisted implementation and tests while learning to write code independently.",
    works: "The public local matcher computes decisions on synthetic catalogues; the browser comparison is prepared data.",
    proof: "Matcher code, decision tests and synthetic fixture catalogues are available in the public source snapshot.",
    limit: "The snapshot omits private Git history and some historical checks. Scores are not probabilities or business accuracy.",
    repositorySourceUrl: "https://github.com/LuxuriantTech/entity-resolution-workbench/blob/adb88a9f8daff82809b2c061b52b85b70fa531b1/src/entity_resolution_workbench/matcher.py",
    repositoryTestUrl: "https://github.com/LuxuriantTech/entity-resolution-workbench/blob/adb88a9f8daff82809b2c061b52b85b70fa531b1/tests/test_scoring_and_decisions.py",
    localCommand: "uv sync --frozen; .venv/bin/python scripts/workbench_control.py start --port 8765",
  },
  {
    id: "postgres-migration-rehearsal",
    number: "07",
    name: "PostgreSQL Migration Rehearsal",
    category: "Migration safety",
    status: "Public source snapshot",
    featured: false,
    summary: "Run a separate six-invoice local CLI rehearsal and inspect rollback; the browser shows prepared historical stages while its original runtime remains blocked.",
    stack: "PostgreSQL · Local CLI · Migration record",
    scope: "Public source snapshot · Six-invoice CLI · Prepared browser walkthrough",
    url: "https://github.com/LuxuriantTech/postgres-migration-rehearsal",
    demoUrl: "/projects/postgres-migration-rehearsal/",
  },
  {
  id: "skill-studio",
  number: "08",
  name: "Skill Studio",
  category: "Local developer tooling",
  status: "In development",
  featured: false,
  summary:
    "A prepared browser workshop for editing an AI instruction, viewing a text diff and exporting Markdown. Model execution stays private.",
  example:
    "In the public demo, edit a prepared instruction, inspect the text diff and export Markdown. The displayed response does not rerun.",
  decision:
    "Keep the response without additional instructions as the reference, and record the limits of each comparison.",
  shortLimit:
    "The public demo is static and synthetic. It does not run a model, API or private workshop.",
  intention:
    "Check whether additional instructions help on the supplied task.",
  contribution:
    "AI assistance contributed to implementation, tests and documentation.",
  contributionLabel: "AI assistance",
  works:
    "The public page lets a reviewer edit a prepared instruction, inspect the text diff and export Markdown. Its displayed response does not rerun.",
  proof:
    "The public sources support instruction editing, a text diff and Markdown export, with synthetic examples and recorded results clearly labelled.",
  limit:
    "The historical evaluation remains HONEST_NEGATIVE. A separate nine-case synthetic run scored 6/9 for the base, 5/9 for AI-assisted reference templates and 2/9 for Qwen-generated skills. No general benefit or production use is established.",
  stack: "Public demo: HTML · CSS · JavaScript",
  scope: "Local workshop · Prepared static public demo · Synthetic inputs",
  url: "/projects/skill-studio/",
  demoUrl: "/projects/skill-studio/",
  linkLabel: "Open the prepared demo",
  repositorySignals: ["LOCAL WORKSHOP", "STATIC DEMO", "LIMITS VISIBLE"],
  preview: {
    href: "/projects/skill-studio/",
    src: "/projects/skill-studio/assets/local-workshop.png",
    alt: "Scrubbed local Skill Studio workshop on synthetic delivery inputs",
    label: "Open the prepared Skill Studio demo",
  },
},
];

export const WORKFLOW_STEPS = [
  {
    number: "01",
    title: "Frame",
    detail: "Decide what good looks like, what can be proved and what stays out of scope.",
  },
  {
    number: "02",
    title: "Direct",
    detail: "Split the problem into useful tasks, provide context and iterate with coding assistants.",
  },
  {
    number: "03",
    title: "Verify",
    detail: "Run tests, inspect the actual behaviour and reproduce failures before calling anything done.",
  },
  {
    number: "04",
    title: "Explain",
    detail: "Leave the result, evidence and remaining limits understandable to the next person.",
  },
];

export const CAPABILITY_GROUPS = [
  {
    title: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "SQL", "HTML & CSS"],
  },
  {
    title: "Web & data",
    items: ["FastAPI", "React", "REST APIs", "PostgreSQL", "OpenAPI", "pgvector"],
  },
  {
    title: "Quality",
    items: ["pytest", "Vitest", "Playwright", "Ruff", "mypy", "GitHub Actions"],
  },
  {
    title: "Delivery",
    items: ["Git", "Docker", "Linux", "Debugging", "Documentation", "Technical review"],
  },
];

export function projectFromHash(hash) {
  const id = hash.replace(/^#/, "");
  return PROJECTS.find((project) => project.id === id) ?? PROJECTS[0];
}
