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
    number: "01",
    name: "EvidenceDesk",
    category: "Document review",
    status: "Experimental",
    featured: true,
    summary:
      "A document review prototype that finds supporting passages, links answers to source pages and abstains when evidence is missing.",
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
    linkLabel: "Inspect the repository",
    repositorySignals: ["25/25 RECALL@5", "PAGE-LINKED", "LIMITS VISIBLE"],
    repositoryEvidenceUrl:
      "https://github.com/LuxuriantTech/evidencedesk/blob/main/docs/release-validation.md",
  },
  {
    id: "api-contract-guard",
    number: "02",
    name: "API Contract Guard",
    category: "Developer tooling",
    status: "Reviewable sample",
    featured: true,
    summary:
      "A TypeScript command-line tool that compares a defined OpenAPI subset and reports supported breaking changes in JSON and static HTML.",
    intention:
      "Make a deliberately bounded set of API changes reviewable before they reach another system.",
    contribution:
      "I defined the supported change categories, expected reports and failure boundaries, then reviewed the implementation and test cases.",
    works:
      "The local CLI compares its supported OpenAPI subset and produces machine-readable JSON plus a static HTML report.",
    proof: "102 local tests cover five supported breaking-change categories.",
    limit:
      "It does not claim complete OpenAPI compatibility. Unsupported shapes, references and oversized inputs fail closed instead of producing a guess.",
    stack: "TypeScript · Node.js · OpenAPI · JSON · HTML",
    scope: "Local CLI · Deliberately bounded compatibility checks",
    url: "https://github.com/LuxuriantTech/api-contract-guard",
    linkLabel: "Inspect the repository",
    repositorySignals: ["5 CHECKS", "102 TESTS", "FAILS CLOSED"],
    repositoryEvidenceUrl:
      "https://github.com/LuxuriantTech/api-contract-guard/blob/main/VALIDATION.md",
  },
  {
    id: "synthevia",
    number: "03",
    name: "Synthevia",
    category: "Full-stack product",
    status: "In progress",
    featured: false,
    summary: "A private learning and research product represented by a smaller runnable public path.",
    stack: "React · TypeScript · FastAPI · SQLite",
    scope: "Pre-launch · Public sample only",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/synthevia",
  },
  {
    id: "gargantua",
    number: "04",
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
    number: "05",
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
    number: "06",
    name: "MyTradingBot",
    category: "Risk automation",
    status: "In progress",
    featured: false,
    summary: "A paper-first automation prototype with explicit risk, execution and qualification gates.",
    stack: "Python · Async systems · Risk controls",
    scope: "Paper-only · No profitability claim",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/mytradingbot",
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
