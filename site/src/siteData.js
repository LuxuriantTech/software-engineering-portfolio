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
      "Find an answer in a document, then check the passage it came from. Built for someone reviewing contracts and supplier records.",
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
    demoMode: "Computed in your browser",
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
  },
  {
    id: "synthevia",
    number: "05",
    name: "Synthévia",
    category: "Full-stack product",
    status: "Public demo",
    featured: false,
    summary: "Bring market information, risk tools and learning into one web workspace, with a demo visitors can explore without an account.",
    intention: "Make the product understandable through complete journeys rather than isolated screens.",
    example: "Explore a market overview, open the learning area and see how the product presents its different states.",
    decision: "Give visitors a separate demo with fictional data so they can explore the product without access to private accounts.",
    contribution: "I define the product needs and organise the AI-assisted implementation, reviews and follow-up changes.",
    works: "The public demo presents the product journeys without an account; a separate local code sample is available for inspection.",
    proof: "The public demo and project page are accessible. The local sample connects React, FastAPI and SQLite using fictional data.",
    limit: "The demo uses synthetic data. The full product uses PostgreSQL; the smaller code sample uses SQLite. No trading profitability is established.",
    shortLimit: "The demo uses fictional data. It does not demonstrate trading profitability.",
    stack: "React · TypeScript · FastAPI · PostgreSQL",
    scope: "Public sample only · Separate from the product site",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/synthevia",
    liveUrl: "https://xn--synthvia-f1a.com/project",
    demoUrl: "https://xn--synthvia-f1a.com/demo/",
  },
  {
    id: "gargantua",
    number: "07",
    name: "Gargantua / GLXBot",
    category: "Community operations",
    status: "Runtime unverified",
    featured: false,
    summary: "A bounded moderation and audit sample from a private Discord administration platform.",
    stack: "Python · FastAPI · React · PostgreSQL",
    scope: "Public sample · Current runtime unverified",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/gargantua",
  },
  {
    id: "strategy-lab",
    number: "08",
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
    number: "09",
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
    category: "Workflow safety",
    status: "Public source",
    featured: true,
    demoMode: "Prepared synthetic walkthrough",
    actionLabel: "Inspect ToolCall Replay",
    summary: "Inspect an automated tool-call trace and see why three risky actions are rejected in a replay that executes no tools.",
    example: "Select ‘Risky directory update’ in the browser demo. Its forbidden export, over-broad lookup and missing approval produce an expected failure.",
    decision: "Keep an expected rule rejection separate from invalid input, so a FAIL is not mistaken for an application crash.",
    shortLimit: "The browser shows prepared synthetic results; it does not run the evaluator or prove production agent safety.",
    intention: "Make risky tool calls understandable through a deterministic comparison of a baseline and a candidate trace.",
    contribution: "I framed the rule questions and review cases, then inspected the AI-assisted implementation, tests and public explanation.",
    works: "The local Python evaluator compares traces without executing tools. The public browser page explains prepared outcomes.",
    proof: "The public source snapshot includes evaluator code, synthetic examples and selected runtime tests with a local quick start.",
    limit: "Only seven supported rule types are evaluated. The browser walkthrough is static and does not establish production safety.",
    stack: "Python · Deterministic rules · pytest",
    scope: "Public source snapshot · Prepared browser walkthrough",
    url: "https://github.com/LuxuriantTech/toolcall-replay",
    demoUrl: "/projects/toolcall-replay/",
    repositoryEvidenceUrl: "https://github.com/LuxuriantTech/toolcall-replay/tree/main/tests",
    evidenceLinkLabel: "Inspect the public tests",
  },
  {
    id: "entity-resolution-workbench",
    number: "03",
    name: "Entity Resolution Workbench",
    category: "Data quality",
    status: "Public source",
    featured: true,
    demoMode: "Recorded synthetic walkthrough",
    actionLabel: "Review the record match",
    summary: "Compare supplier records and see why a matching name can still need human review when identifiers disagree.",
    example: "Inspect a prepared pair with matching names and brands but conflicting SKUs; the outcome remains REVIEW.",
    decision: "Expose the component similarities and decision reasons instead of forcing an uncertain pair into a match.",
    shortLimit: "The browser shows a recorded result. Similarity scores are not probabilities or measured business accuracy.",
    intention: "Help a reviewer understand an uncertain catalogue match without hiding disagreement between important fields.",
    contribution: "I scoped the review questions and expected explanations, then checked the AI-assisted implementation and tests.",
    works: "The local matcher returns MATCH, REVIEW or NO_MATCH with reasons; the public browser page displays synthetic results.",
    proof: "The public source snapshot includes the matcher, synthetic catalogues and selected tests with a local quick start.",
    limit: "Thresholds are project-specific. A browser annotation does not rerun the matcher or establish business accuracy.",
    stack: "Python · Record matching · pytest",
    scope: "Public source snapshot · Prepared browser walkthrough",
    url: "https://github.com/LuxuriantTech/entity-resolution-workbench",
    demoUrl: "/projects/entity-resolution-workbench/",
    repositoryEvidenceUrl: "https://github.com/LuxuriantTech/entity-resolution-workbench/tree/main/tests",
    evidenceLinkLabel: "Inspect the public tests",
  },
  {
    id: "postgres-migration-rehearsal",
    number: "06",
    name: "PostgreSQL Migration Rehearsal",
    category: "Migration safety",
    status: "Prepared browser demo",
    featured: false,
    summary: "Follow a database change through five stages, inspect the checks and understand the route back if something goes wrong.",
    stack: "PostgreSQL · Local CLI · Migration record",
    scope: "Synthetic browser walkthrough · Local application",
    url: "https://github.com/LuxuriantTech/postgres-migration-rehearsal",
    demoUrl: "/projects/postgres-migration-rehearsal/",
  },
  {
  id: "skill-studio",
  number: "10",
  name: "Skill Studio",
  category: "Local developer tooling",
  status: "In development",
  featured: false,
  summary:
    "A workshop for writing and editing AI instructions, keeping versions and comparing responses. Model execution remains in the private workshop.",
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
    "The private workshop supports file editing, saved versions, response comparison and ZIP export or re-import. Automatic generation remains experimental and can be rejected.",
  proof:
    "The public sources support instruction editing, a text diff and Markdown export, with synthetic examples and recorded results clearly labelled.",
  limit:
    "The historical evaluation remains HONEST_NEGATIVE. A separate nine-case synthetic run scored 6/9 for the base, 5/9 for AI-assisted reference templates and 2/9 for Qwen-generated skills. No general benefit or production use is established.",
  stack: "React · TypeScript · FastAPI · SQLite",
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
  return PROJECTS.find((project) => project.id === id) ?? PROJECTS.find((project) => project.id === "api-contract-guard");
}
