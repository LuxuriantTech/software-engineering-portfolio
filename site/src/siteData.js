export const ROOT_REPOSITORY_URL =
  "https://github.com/LuxuriantTech/software-engineering-portfolio";

export const CONTACT = {
  email: "mehajardian@gmail.com",
  github: "https://github.com/LuxuriantTech",
  linkedin: "https://www.linkedin.com/in/ardian-mehaj-572b5a3b0/",
};

export const CONTENTS = [
  { number: "1", label: "Introduction", href: "#introduction" },
  { number: "2", label: "Selected work", href: "#work" },
  { number: "3", label: "Skills", href: "#skills" },
  { number: "4", label: "About & contact", href: "#about" },
];

export const EVIDENCE_ITEMS = [
  {
    value: "6",
    label: "selected systems",
    detail: "Each one has public code or bounded project notes.",
  },
  {
    value: "102",
    label: "local tests",
    detail: "The current API Contract Guard test suite.",
  },
  {
    value: "Brussels",
    label: "based in Belgium",
    detail: "citizenship claim with EU work authorisation.",
  },
];

export const PROJECTS = [
  {
    id: "evidencedesk",
    number: "01",
    name: "EvidenceDesk",
    category: "Document review",
    featured: true,
    summary:
      "A document review prototype that finds supporting passages, links answers to their source pages and abstains when the evidence is missing.",
    result: "100% Recall@5 on 25 of 25 answerable synthetic v7 cases.",
    context:
      "The wider answer evaluation did not pass: 36% answerable-case accuracy and 45.67% extraction F1.",
    stack: "React · FastAPI · Redis · PostgreSQL · pgvector",
    scope: "Experimental public project · Synthetic data only",
    url: "https://github.com/LuxuriantTech/evidencedesk",
    linkLabel: "Open EvidenceDesk",
    visual: "document",
  },
  {
    id: "api-contract-guard",
    number: "02",
    name: "API Contract Guard",
    category: "Developer tooling",
    featured: true,
    summary:
      "A TypeScript command-line tool that compares a defined OpenAPI subset and reports supported breaking changes in JSON and static HTML.",
    result: "102 tests across five supported breaking-change categories.",
    context:
      "Unsupported shapes, references and oversized inputs fail closed instead of producing a guess.",
    stack: "TypeScript · Node.js · OpenAPI · JSON · HTML",
    scope: "Local CLI · Deliberately bounded compatibility checks",
    url: "https://github.com/LuxuriantTech/api-contract-guard",
    linkLabel: "Open API Contract Guard",
    visual: "contract",
  },
  {
    id: "synthevia",
    number: "03",
    name: "Synthevia",
    category: "Full-stack product",
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
    featured: false,
    summary: "A paper-first automation prototype with explicit risk, execution and qualification gates.",
    stack: "Python · Async systems · Risk controls",
    scope: "Paper-only · No profitability claim",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/mytradingbot",
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
