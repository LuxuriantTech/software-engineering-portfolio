import { ArrowRightIcon, MailIcon, MarkGithubIcon } from "@primer/octicons-react";
import {
  CAPABILITIES,
  CAPABILITY_GROUPS,
  CONTACT,
  NAV_ITEMS,
  PROJECTS,
  PROOF_LINE,
  ROOT_REPOSITORY_URL,
  WORKFLOW_STEPS,
} from "./siteData.js";

const featuredProjects = PROJECTS.filter((project) => project.featured);
const additionalProjects = PROJECTS.filter((project) => !project.featured);

function HeaderLinks({ className = "", label, onNavigate }) {
  return (
    <nav className={className} aria-label={label}>
      {NAV_ITEMS.map((item) => (
        <a href={item.href} key={item.href} onClick={onNavigate}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function SiteHeader() {
  function closeMenu(event) {
    event.currentTarget.closest("details")?.removeAttribute("open");
  }

  return (
    <header className="site-header">
      <a className="wordmark" href="#top">
        <span>AM</span>
        <span aria-hidden="true">/</span>
        <span>26</span>
        <span className="sr-only">Ardian Mehaj, back to top</span>
      </a>

      <HeaderLinks className="desktop-nav" label="Primary navigation" />

      <a className="header-contact" href={`mailto:${CONTACT.email}`}>
        Email me
        <ArrowRightIcon size={16} aria-hidden="true" />
      </a>

      <details className="mobile-menu">
        <summary>Menu</summary>
        <div className="mobile-panel">
          <HeaderLinks
            className="mobile-nav"
            label="Mobile navigation"
            onNavigate={closeMenu}
          />
          <a className="mobile-email" href={`mailto:${CONTACT.email}`} onClick={closeMenu}>
            Email me
            <ArrowRightIcon size={16} aria-hidden="true" />
          </a>
        </div>
      </details>
    </header>
  );
}

function EvidenceMark() {
  return (
    <span className="evidence-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function Intro() {
  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="intro-grid page-grid">
        <p className="intro-kicker">
          <span>Ardian Mehaj</span>
          <span>Brussels, Belgium</span>
        </p>

        <div className="intro-title">
          <p>Junior software developer</p>
          <h1 id="intro-title">I turn unclear ideas into software you can inspect.</h1>
        </div>

        <aside className="availability" aria-label="Role and availability">
          <p className="availability-status">
            <span aria-hidden="true" />
            Available for junior roles
          </p>
          <p>Backend · Full-stack · Applied AI</p>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </aside>

        <a className="proof-line" href={PROOF_LINE.href}>
          <EvidenceMark />
          <span className="proof-label">{PROOF_LINE.label}</span>
          <strong>{PROOF_LINE.value}</strong>
          <span className="proof-detail">{PROOF_LINE.detail}</span>
          <ArrowRightIcon size={22} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="capabilities-section" aria-labelledby="capabilities-title">
      <div className="section-heading page-grid">
        <p className="section-label">What I bring</p>
        <h2 id="capabilities-title">Clear direction. Visible checks. Honest limits.</h2>
        <p>
          I am early in my software career, but I already know how to make a complicated brief
          concrete and keep the result reviewable.
        </p>
      </div>

      <ol className="capability-list page-grid">
        {CAPABILITIES.map((capability) => (
          <li key={capability.number}>
            <span>{capability.number}</span>
            <h3>{capability.title}</h3>
            <p>{capability.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const caseRows = [
  ["intention", "Intention"],
  ["contribution", "Contribution"],
  ["works", "What works"],
  ["proof", "Evidence"],
  ["limit", "Limit / next"],
];

function ProjectCase({ project }) {
  return (
    <article className="case-file" id={project.id}>
      <div className="case-rule" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className="case-header">
        <p className="case-number">{project.number}</p>
        <div className="case-title">
          <p>{project.category}</p>
          <h3>{project.name}</h3>
        </div>
        <p className="case-summary">{project.summary}</p>
        <div className="case-meta">
          <p>{project.scope}</p>
          <p>{project.stack}</p>
        </div>
      </header>

      <dl className="case-ledger">
        {caseRows.map(([key, label], index) => (
          <div
            className={`case-row case-row--${key}`}
            key={key}
          >
            <span className="case-row-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <dt>{label}</dt>
            <dd>{project[key]}</dd>
          </div>
        ))}
      </dl>

      <a
        className="case-link"
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {project.linkLabel}
        <ArrowRightIcon size={20} aria-hidden="true" />
      </a>
    </article>
  );
}

function Work() {
  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="section-heading page-grid">
        <p className="section-label">Selected work</p>
        <h2 id="work-title">Two projects, opened up for review.</h2>
        <p>
          The result and the uncomfortable part sit together. That makes the work easier to judge
          and easier to improve.
        </p>
      </div>

      <div className="case-list page-grid">
        {featuredProjects.map((project) => (
          <ProjectCase project={project} key={project.id} />
        ))}
      </div>

      <div className="project-index page-grid" aria-labelledby="project-index-title">
        <div className="index-heading">
          <p className="section-label">Project index</p>
          <h3 id="project-index-title">Four more bounded samples.</h3>
        </div>

        <div className="index-list">
          {additionalProjects.map((project) => (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              key={project.id}
              id={project.id}
            >
              <span className="index-number">{project.number}</span>
              <span className="index-name">
                <strong>{project.name}</strong>
                <small>{project.category}</small>
              </span>
              <span className="index-copy">{project.summary}</span>
              <span className="index-scope">{project.scope}</span>
              <ArrowRightIcon size={20} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section className="method-section" id="method" aria-labelledby="method-title">
      <div className="method-layout page-grid">
        <div className="method-intro">
          <p className="section-label">How I work with AI</p>
          <h2 id="method-title">AI speeds up the work. It does not replace the judgment.</h2>
          <p>
            I use coding assistants to explore and build faster. I still define the constraints,
            direct the work, reproduce failures, check the evidence and explain what is actually
            working.
          </p>
        </div>

        <ol className="method-steps">
          {WORKFLOW_STEPS.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="skills-section" id="skills" aria-labelledby="skills-title">
      <div className="section-heading page-grid">
        <p className="section-label">Working set</p>
        <h2 id="skills-title">Tools I can work with and keep learning.</h2>
        <p>
          My strength is connecting the pieces: a useful brief, a working path, a testable result
          and clear documentation.
        </p>
      </div>

      <dl className="skills-list page-grid">
        {CAPABILITY_GROUPS.map((group, index) => (
          <div key={group.title}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <dt>{group.title}</dt>
            <dd>{group.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-layout page-grid">
        <p className="section-label">About</p>
        <div>
          <h2 id="about-title">An unconventional route into software.</h2>
          <p className="about-lead">
            I learn fastest by building something real, understanding why it works and fixing what
            does not.
          </p>
        </div>
        <div className="about-copy">
          <p>
            Earlier work in retail, automotive placements and volunteer tutoring taught me to
            communicate clearly, follow technical procedures and stay patient when a problem is
            unfamiliar.
          </p>
          <p>
            I&apos;m preparing to begin an online BSc in Computer Science alongside work. I speak
            French and Albanian, with professional English at B2 level. I&apos;m a Belgian citizen
            and do not require a visa to work in the European Union.
          </p>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-layout page-grid">
        <p className="section-label">Next step</p>
        <h2 id="contact-title">Have a junior role with real problems to solve?</h2>
        <p>
          I&apos;m open to software, backend, full-stack and applied AI opportunities in Brussels,
          hybrid or remote.
        </p>
        <a className="contact-email" href={`mailto:${CONTACT.email}`}>
          <MailIcon size={22} aria-hidden="true" />
          <span>{CONTACT.email}</span>
          <ArrowRightIcon size={22} aria-hidden="true" />
        </a>
        <div className="contact-links" aria-label="Profile links">
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
            <MarkGithubIcon size={18} aria-hidden="true" />
            GitHub
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

export function App() {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />
      <main id="main-content" tabIndex="-1">
        <Intro />
        <Capabilities />
        <Work />
        <Method />
        <Skills />
        <About />
        <Contact />
      </main>
      <footer className="site-footer page-grid">
        <p>© 2026 Ardian Mehaj</p>
        <p>Brussels, Belgium</p>
        <a href={ROOT_REPOSITORY_URL} target="_blank" rel="noopener noreferrer">
          Portfolio source
        </a>
      </footer>
    </div>
  );
}
