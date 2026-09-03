export const ROOT_REPOSITORY_URL =
  "https://github.com/LuxuriantTech/software-engineering-portfolio";

export const CONTACT = {
  email: "mehajardian@gmail.com",
  github: "https://github.com/LuxuriantTech",
  linkedin: "https://www.linkedin.com/in/ardian-mehaj-572b5a3b0/",
};

export const EVIDENCE_ITEMS = [
  {
    value: "6",
    label: "documented systems",
    detail: "Public code or bounded project notes for every case study.",
  },
  {
    value: "102",
    label: "local tests",
    detail: "API Contract Guard's current deterministic test suite.",
  },
  {
    value: "100%",
    label: "Recall@5",
    detail: "EvidenceDesk retrieval on 25 answerable synthetic v7 cases.",
  },
  {
    value: "6/6",
    label: "scope notes",
    detail: "Every project publishes its present scope and limits.",
  },
];

export const PROJECTS = [
  {
    id: "evidencedesk",
    number: "01",
    name: "EvidenceDesk",
    category: "Applied AI · Document review",
    status: "Experimental",
    tone: "amber",
    featured: true,
    summary:
      "A research-oriented document review system that retrieves evidence, produces cited answers and abstains when support is missing.",
    responsibility:
      "Product framing, evaluation criteria, AI-agent direction, integration review, testing and final acceptance.",
    highlights: [
      "Hybrid retrieval reached 100% Recall@5 on 25/25 answerable synthetic v7 cases.",
      "Answers connect to page-level evidence or return an explicit abstention.",
      "Allowlisted ingestion, role checks and audit-oriented workflows are built into the public project.",
    ],
    outcome: "HONEST_NEGATIVE",
    outcomeDetail: "36% answerable-case accuracy · 45.67% extraction F1",
    limitation:
      "The blind v7 evaluation did not meet the quality bar. This is evidence of a disciplined experiment, not a production-ready document service.",
    stack: ["React", "FastAPI", "Redis", "PostgreSQL", "pgvector"],
    url: "https://github.com/LuxuriantTech/evidencedesk",
    linkLabel: "View public repository",
  },
  {
    id: "api-contract-guard",
    number: "02",
    name: "API Contract Guard",
    category: "Developer tooling · API reliability",
    status: "Public CLI",
    tone: "blue",
    featured: true,
    summary:
      "A local TypeScript CLI that compares a defined OpenAPI subset and turns breaking changes into deterministic JSON and HTML reports.",
    responsibility:
      "Scope definition, failure policy, AI-assisted implementation review, test design, adversarial checks and release validation.",
    highlights: [
      "Detects five supported breaking-change categories with deterministic output.",
      "Unsupported shapes, references and oversized inputs fail closed instead of guessing.",
      "A 102-test suite and synthetic operation-removal demo make the behaviour reproducible.",
    ],
    outcome: "102 tests",
    outcomeDetail: "98.67% lines · 88.72% branches in the current local suite",
    limitation:
      "It covers a deliberately bounded OpenAPI subset. It is not a hosted service, production-client validation or a universal compatibility verdict.",
    stack: ["TypeScript", "OpenAPI", "Node.js", "JSON", "HTML reports"],
    url: "https://github.com/LuxuriantTech/api-contract-guard",
    linkLabel: "View public repository",
  },
  {
    id: "synthevia",
    number: "03",
    name: "Synthevia",
    category: "Full-stack product · Learning platform",
    status: "Pre-launch",
    tone: "blue",
    featured: false,
    summary:
      "A private learning and research product, represented publicly by a smaller React-to-FastAPI path over fictional workspace data.",
    responsibility:
      "Product requirements, AI-agent workflows, integration, review, debugging and acceptance.",
    highlights: [
      "Deterministic retrieval over fictional documents.",
      "A focused frontend and backend flow that can be run locally.",
      "Synthetic workspace data keeps the public edition reviewable and private by design.",
    ],
    limitation:
      "The public sample is not the complete private product and does not prove a current deployment.",
    stack: ["React", "TypeScript", "FastAPI", "SQLite"],
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/synthevia",
    linkLabel: "Read project notes",
  },
  {
    id: "gargantua",
    number: "04",
    name: "Gargantua / GLXBot",
    category: "Backend systems · Community operations",
    status: "Runtime unverified",
    tone: "amber",
    featured: false,
    summary:
      "A private Discord administration platform represented by a bounded public moderation and audit sample.",
    responsibility:
      "Workflow design, permission boundaries, AI-assisted implementation direction, review and operational documentation.",
    highlights: [
      "Member actions fail before audit mutation.",
      "Audit records deliberately exclude message content.",
      "The public sample includes a fictional, read-only FastAPI dashboard response.",
    ],
    limitation:
      "The sample does not reproduce Discord OAuth, persistence, live permission refresh or current service availability.",
    stack: ["Python", "FastAPI", "React", "PostgreSQL"],
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/gargantua",
    linkLabel: "Read project notes",
  },
  {
    id: "strategy-lab",
    number: "05",
    name: "Synthevia Strategy Lab",
    category: "Research tooling · Falsification",
    status: "Internal R&D",
    tone: "green",
    featured: false,
    summary:
      "Python research tooling designed to reject weak market hypotheses before they can reach capital.",
    responsibility:
      "Protocol definition, evidence requirements, AI-agent coordination, review and no-go decisions.",
    highlights: [
      "Benjamini-Hochberg and compact Newey-West checks.",
      "One-use holdout, declared fill sanity and position controls.",
      "Malformed AI output becomes ABSTAIN rather than an invented result.",
    ],
    limitation:
      "These are synthetic research controls, not a trading strategy, market result or claim of profitability.",
    stack: ["Python", "Statistics", "Evaluation", "AI guardrails"],
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/strategy-lab",
    linkLabel: "Read project notes",
  },
  {
    id: "mytradingbot",
    number: "06",
    name: "MyTradingBot",
    category: "Automation · Risk controls",
    status: "Paper-only",
    tone: "slate",
    featured: false,
    summary:
      "A paper-first Python automation prototype with explicit strategy, risk, execution and qualification gates.",
    responsibility:
      "System requirements, risk boundaries, AI-assisted delivery, test review and operational handoffs.",
    highlights: [
      "Live mode is rejected before execution.",
      "Decimal-based absolute and equity-relative notional limits.",
      "Synthetic qualification can return NO-GO when the evidence is insufficient.",
    ],
    limitation:
      "Paper fills do not prove live readiness, realistic execution quality, production safety or profitability.",
    stack: ["Python", "Async systems", "Risk gates", "Testing"],
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/mytradingbot",
    linkLabel: "Read project notes",
  },
];

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Frame the real problem",
    body: "Define the user, outcome, boundaries and evidence before implementation starts.",
  },
  {
    number: "02",
    title: "Direct the build",
    body: "Use AI tools to accelerate implementation while keeping the architecture and acceptance criteria explicit.",
  },
  {
    number: "03",
    title: "Challenge the output",
    body: "Read the result, reproduce failures, test edge cases and ask what could still be wrong.",
  },
  {
    number: "04",
    title: "Ship the evidence",
    body: "Document what passed, what failed and where the current boundary really is.",
  },
];

export const CAPABILITY_GROUPS = [
  {
    title: "Backend & APIs",
    description: "Building clear service boundaries and data flows.",
    skills: ["Python", "FastAPI", "REST APIs", "PostgreSQL", "SQLAlchemy", "OpenAPI"],
  },
  {
    title: "Frontend & product",
    description: "Turning requirements into usable, reviewable interfaces.",
    skills: ["TypeScript", "JavaScript", "React", "HTML/CSS", "Responsive UI", "Accessibility"],
  },
  {
    title: "Quality & delivery",
    description: "Making behaviour reproducible instead of relying on screenshots.",
    skills: ["pytest", "Vitest", "Playwright", "Ruff", "mypy", "GitHub Actions", "Docker", "Linux"],
  },
  {
    title: "Applied AI",
    description: "Using models inside systems with evaluation and traceability.",
    skills: ["RAG", "pgvector", "Agent workflows", "Evaluation", "Abstention", "Audit trails"],
  },
];

export function projectFromHash(hash) {
  const id = hash.replace(/^#/, "");
  return PROJECTS.find((project) => project.id === id) ?? PROJECTS[0];
}
