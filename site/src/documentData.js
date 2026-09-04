export const DOCUMENTS = [
  {
    id: "cv",
    shortLabel: "CV",
    index: "01",
    eyebrow: "Public CV · English",
    title: "A factual view of my work so far.",
    summary:
      "Projects, working tools, education and experience — with AI assistance and current limits stated plainly.",
    pdfPath: "/documents/Ardian_Mehaj_Public_CV_EN.pdf",
    fileName: "Ardian_Mehaj_Public_CV_EN.pdf",
  },
  {
    id: "letter",
    shortLabel: "Letter",
    index: "02",
    eyebrow: "General motivation · English",
    title: "Why I want to join a real engineering team.",
    summary:
      "A general letter for junior software, backend and applied AI roles — direct, honest and ready to adapt.",
    pdfPath: "/documents/Ardian_Mehaj_General_Motivation_Letter_EN.pdf",
    fileName: "Ardian_Mehaj_General_Motivation_Letter_EN.pdf",
  },
];

export const CV_CONTENT = {
  role: "AI-assisted builder · Junior software candidate",
  location: "Brussels, Belgium",
  profile:
    "Junior software candidate moving from business studies into software and applied AI. I use coding assistants to turn a clear brief into working prototypes, then inspect the result, run tests, reproduce failures and document the limits. I understand the code I deliver while continuing to strengthen my independent coding and computer-science foundations. I am looking for a first professional team where I can contribute and learn through review.",
  projects: [
    {
      name: "API Contract Guard",
      meta: "TypeScript · Node.js · OpenAPI · 102 local tests",
      detail:
        "A bounded command-line tool for comparing a defined OpenAPI subset. I set the supported change categories, expected reports and failure boundaries, then reviewed the AI-assisted implementation and test cases. It covers five documented breaking-change categories and fails closed outside scope.",
    },
    {
      name: "EvidenceDesk",
      meta: "React · FastAPI · PostgreSQL · Redis · Synthetic data",
      detail:
        "A document-review prototype that links answers to supporting pages and can abstain when evidence is missing. Recall@5 reached 100% on 25 of 25 answerable synthetic cases; the wider answer evaluation did not pass (36% accuracy and 45.67% extraction F1), so the limit remains visible.",
    },
    {
      name: "PostgreSQL Migration Rehearsal",
      meta: "PostgreSQL · Docker · Python · Local synthetic rehearsal",
      detail:
        "A local practice project for migration planning, rollback checks and data-integrity checks. It uses synthetic data and is presented as a rehearsal, not as proof of production experience.",
    },
  ],
  experience: [
    {
      name: "Volunteer tutor",
      meta: "Brussels · 2020–present",
      detail:
        "Mathematics, science and business. I break unfamiliar topics into clear steps and adapt explanations to the learner.",
    },
    {
      name: "Student retail assistant · Delhaize",
      meta: "Brussels · 2020–2022",
      detail:
        "Worked reliably with customers, procedures and a team during busy shifts while studying.",
    },
  ],
  education: [
    {
      name: "OPIT · BSc (Hons) Computer Science",
      detail:
        "Admitted for the September 2026 intake; enrolment pending. Online study planned alongside full-time work.",
    },
    {
      name: "ICHEC Brussels · Business Management",
      detail:
        "Completed part of first year in 2025–2026 before changing direction toward software.",
    },
  ],
  certification: "Google AI Professional Certificate · Coursera · May 2026",
  languages: "French native · Albanian native/bilingual · English B2 (self-assessed)",
  tools:
    "Python · JavaScript · TypeScript · SQL · HTML/CSS · FastAPI · React · REST/OpenAPI · PostgreSQL · Redis · pytest · Vitest · Playwright · Ruff · mypy · Git/GitHub Actions · Docker · Linux · debugging · documentation",
};

export const LETTER_CONTENT = {
  subject: "Open application · Junior software / backend / applied AI",
  salutation: "Dear Hiring Team,",
  paragraphs: [
    "I am looking for my first professional opportunity in software, backend development or applied AI. My route into the field is not traditional: I began in business studies and learned software by turning real ideas into small, testable projects. That route has made me comfortable admitting what I do not know, asking precise questions and improving from evidence.",
    "AI coding assistants are an important part of how I work, and I do not hide that. I define the objective and constraints, direct the work, inspect the resulting code, run the product, reproduce failures and keep limits visible. I am still strengthening my independent coding and computer-science foundations, but I can already help turn an unclear brief into a reviewable working path.",
    "My public projects show that process. API Contract Guard is a deliberately bounded TypeScript tool backed by 102 local tests. EvidenceDesk links answers to supporting passages and also publishes the evaluation that did not pass. PostgreSQL Migration Rehearsal lets me practise migrations, rollback and integrity checks locally on synthetic data. These are learning projects, not substitutes for professional experience, but they show how I approach responsibility and verification.",
    "I have been admitted to OPIT's online BSc (Hons) in Computer Science for the September 2026 intake; enrolment is still pending. I plan to study alongside full-time work so that formal foundations and practical experience can grow together. I would value a team where code review is normal, expectations are clear and a junior is trusted to learn while contributing.",
    "If that matches how your team works, I would be glad to discuss a real problem, complete a fair practical assessment and explain exactly how I reached my answer.",
  ],
  closing: "Thank you for your time,",
};

export function documentById(id) {
  return DOCUMENTS.find((document) => document.id === id) ?? DOCUMENTS[0];
}
