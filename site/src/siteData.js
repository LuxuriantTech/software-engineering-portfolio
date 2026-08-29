export const ROOT_REPOSITORY_URL =
  "https://github.com/LuxuriantTech/software-engineering-portfolio";

export const EVIDENCE_ITEMS = [
  {
    kind: "test-metric",
    label: "33 focused Python tests",
    detail: "Verified 21 August 2026 · four selected public Python samples only",
    evidenceLinks: [
      { label: "Synthevia", url: ROOT_REPOSITORY_URL + "/tree/main/projects/synthevia#testing-and-evidence" },
      { label: "Gargantua", url: ROOT_REPOSITORY_URL + "/tree/main/projects/gargantua#evidence" },
      { label: "Strategy Lab", url: ROOT_REPOSITORY_URL + "/tree/main/projects/strategy-lab#verified-checks" },
      { label: "MyTradingBot", url: ROOT_REPOSITORY_URL + "/tree/main/projects/mytradingbot#targeted-checks" },
    ],
  },
  {
    kind: "test-metric",
    label: "4 focused frontend tests",
    detail: "Verified 21 August 2026 · selected public Synthevia frontend sample only",
    evidenceLinks: [
      { label: "Synthevia evidence", url: ROOT_REPOSITORY_URL + "/tree/main/projects/synthevia#testing-and-evidence" },
    ],
  },
  {
    kind: "boundary",
    label: "Synthetic data only",
    detail: "No real user, community, market or operational data is included.",
  },
];

export const PROJECTS = [
  {
    id: "evidencedesk",
    name: "EvidenceDesk",
    status: "Experimental · HONEST_NEGATIVE",
    tone: "amber",
    architecture: ["React + FastAPI", "Redis + ARQ", "PostgreSQL + pgvector"],
    architectureLabel:
      "React and FastAPI through Redis and ARQ to PostgreSQL and pgvector",
    highlights: [
      "Asynchronous ingestion of allowlisted synthetic documents",
      "Hybrid retrieval reached 100% Recall@5 on 25/25 answerable v7 cases",
      "Answers link to page-level evidence or explicitly abstain",
    ],
    limitation:
      "blind v7 reached 36% answerable-case accuracy and 45.67% extraction F1, so it is not validated for production or real documents.",
    url: "https://github.com/LuxuriantTech/evidencedesk",
  },
  {
    id: "api-contract-guard",
    name: "API Contract Guard",
    status: "Local CLI · bounded scope",
    tone: "blue",
    architecture: ["OpenAPI", "TypeScript CLI", "JSON + HTML"],
    architectureLabel:
      "OpenAPI documents through a local TypeScript CLI to deterministic JSON and HTML reports",
    highlights: [
      "Five supported breaking-change categories with deterministic output",
      "Bounded local files and references; unsupported shapes fail closed",
      "102 tests and a reproducible synthetic operation-removal demo",
    ],
    limitation:
      "this is a local tool for a defined OpenAPI subset, not a hosted service, production-client validation or a general compatibility verdict.",
    url: "https://github.com/LuxuriantTech/api-contract-guard",
  },
  {
    id: "synthevia",
    name: "Synthevia",
    status: "Pre-launch",
    tone: "blue",
    architecture: ["React", "FastAPI", "in-memory SQLite"],
    architectureLabel: "React to local FastAPI to in-memory SQLite",
    highlights: [
      "Deterministic retrieval over fictional documents",
      "Synthetic workspace data generated locally",
      "Focused frontend and backend checks",
    ],
    limitation:
      "this is a selected public path, not the complete private product or proof of a current deployment.",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/synthevia",
  },
  {
    id: "gargantua",
    name: "Gargantua / GLXBot",
    status: "Historically deployed",
    navStatus: "Historically deployed · runtime unverified",
    statusDetail: "Current runtime unverified",
    tone: "amber",
    architecture: ["Async service", "role gate", "audit record"],
    architectureLabel: "Asynchronous service through role gate to in-memory audit record",
    highlights: [
      "Member actions fail before audit mutation",
      "Audit records deliberately exclude message content",
      "Fictional read-only FastAPI dashboard response",
    ],
    limitation:
      "the sample does not reproduce Discord OAuth, live permission refresh, persistence or current service availability.",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/gargantua",
  },
  {
    id: "strategy-lab",
    name: "Synthevia Strategy Lab",
    status: "Internal R&D",
    tone: "green",
    architecture: ["Synthetic input", "protocol gates", "verdict"],
    architectureLabel: "Synthetic inputs through protocol gates to a documented verdict",
    highlights: [
      "Benjamini–Hochberg and compact Newey–West checks",
      "One-use holdout and declared fill sanity gates",
      "Malformed LLM output becomes ABSTAIN",
    ],
    limitation:
      "these are generic synthetic controls, not a strategy, market result, complete statistics library or route to capital.",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/strategy-lab",
  },
  {
    id: "mytradingbot",
    name: "MyTradingBot",
    status: "Paper-only",
    tone: "slate",
    architecture: ["Risk gate", "paper exchange", "qualification"],
    architectureLabel: "Risk gate to paper exchange to qualification result",
    highlights: [
      "Live mode is rejected before execution",
      "Decimal-based absolute and equity-relative limits",
      "Synthetic qualification can return NO-GO",
    ],
    limitation:
      "paper fills do not prove live readiness, production safety, realistic execution quality or profitability.",
    url: ROOT_REPOSITORY_URL + "/tree/main/projects/mytradingbot",
  },
];

export function projectFromHash(hash) {
  const id = hash.replace(/^#/, "");
  return PROJECTS.find((project) => project.id === id) ?? PROJECTS[0];
}

export function skipToProjectDetails(event, documentRef) {
  event.preventDefault();
  const detail = documentRef.getElementById("project-detail");
  detail?.focus();
  detail?.scrollIntoView({ block: "start" });
}
