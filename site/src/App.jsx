import { ArrowRightIcon, MailIcon, MarkGithubIcon } from "@primer/octicons-react";
import {
  CAPABILITY_GROUPS,
  CONTACT,
  CONTENTS,
  EVIDENCE_ITEMS,
  PROJECTS,
  ROOT_REPOSITORY_URL,
} from "./siteData.js";

const featuredProjects = PROJECTS.filter((project) => project.featured);
const additionalProjects = PROJECTS.filter((project) => !project.featured);

function HeaderLinks({ className = "" }) {
  return (
    <nav className={className} aria-label="Main navigation">
      <a href="#work">Work</a>
      <a href="#skills">Skills</a>
      <a href="#about">About</a>
      <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub</a>
    </nav>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Ardian Mehaj, back to top">
        Ardian Mehaj
      </a>

      <HeaderLinks className="desktop-nav" />

      <a className="header-contact" href={`mailto:${CONTACT.email}`}>
        Contact
        <ArrowRightIcon size={16} aria-hidden="true" />
      </a>

      <details className="mobile-menu">
        <summary>Menu</summary>
        <HeaderLinks className="mobile-nav" />
        <a className="mobile-email" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </details>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-shape hero-shape-one" aria-hidden="true" />
      <div className="hero-shape hero-shape-two" aria-hidden="true" />
      <div className="hero-shape hero-shape-three" aria-hidden="true" />

      <div className="hero-content page-grid">
        <p className="hero-date">Portfolio · Brussels · 2026</p>

        <div className="hero-title-block">
          <p>Junior software developer</p>
          <h1 id="hero-title">Ardian Mehaj</h1>
        </div>

        <nav className="contents" aria-label="Portfolio contents">
          {CONTENTS.map((item) => (
            <a href={item.href} key={item.number}>
              <span>[{item.number}]</span>
              <i aria-hidden="true" />
              <strong>{item.label}</strong>
            </a>
          ))}
        </nav>

        <div className="hero-footer">
          <p>Backend · Full-stack · Applied AI</p>
          <a href={`mailto:${CONTACT.email}`}>Available for junior roles</a>
        </div>
      </div>
    </section>
  );
}

function Introduction() {
  return (
    <section className="introduction editorial-grid" id="introduction" aria-labelledby="introduction-title">
      <p className="section-index">01 / Introduction</p>
      <div className="introduction-copy">
        <h2 id="introduction-title">
          I build web products, backend systems and applied AI prototypes that people can actually
          open, understand and test.
        </h2>
        <div className="introduction-columns">
          <p>
            I&apos;m an early-career developer based in Brussels. My approach is practical: understand
            the problem, organise the work, review what is built, reproduce failures and keep
            improving the result.
          </p>
          <p>
            I&apos;m looking for a junior role where I can contribute while learning from experienced
            people. I&apos;m also preparing to begin an online BSc in Computer Science alongside work.
          </p>
        </div>

        <div className="facts" aria-label="Key facts">
          {EVIDENCE_ITEMS.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocumentVisual() {
  return (
    <div className="project-visual document-visual" aria-hidden="true">
      <div className="paper-sheet">
        <div className="paper-heading"><span>EvidenceDesk</span><span>01</span></div>
        <p>Review note</p>
        <strong>Every answer should point back to its source.</strong>
        <div className="paper-lines"><span /><span /><span /></div>
        <div className="citation-row"><span>Source found</span><span>p. 04</span></div>
      </div>
      <span className="visual-caption">Document / evidence / citation</span>
    </div>
  );
}

function ContractVisual() {
  return (
    <div className="project-visual contract-visual" aria-hidden="true">
      <div className="contract-sheet">
        <div className="contract-heading"><span>API change report</span><span>02</span></div>
        <p>GET /records</p>
        <div className="contract-columns">
          <div><span>Current</span><i /><i /><i /></div>
          <div><span>Proposed</span><i /><i /><i className="removed" /></div>
        </div>
        <div className="contract-result"><span>1 breaking change</span><span>Review required</span></div>
      </div>
      <span className="visual-caption">Contract / comparison / report</span>
    </div>
  );
}

function ProjectVisual({ type }) {
  return type === "document" ? <DocumentVisual /> : <ContractVisual />;
}

function FeaturedProject({ project, index }) {
  return (
    <article className={`featured-project ${index % 2 === 1 ? "project-reverse" : ""}`} id={project.id}>
      <ProjectVisual type={project.visual} />

      <div className="featured-copy">
        <p className="project-eyebrow">{project.number} / {project.category}</p>
        <h3>{project.name}</h3>
        <p className="project-summary">{project.summary}</p>

        <dl className="project-details">
          <div><dt>Result</dt><dd>{project.result}</dd></div>
          <div><dt>Context</dt><dd>{project.context}</dd></div>
          <div><dt>Built with</dt><dd>{project.stack}</dd></div>
          <div><dt>Scope</dt><dd>{project.scope}</dd></div>
        </dl>

        <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">
          {project.linkLabel}
          <ArrowRightIcon size={18} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function Work() {
  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="work-heading editorial-grid">
        <p className="section-index">02 / Selected work</p>
        <div>
          <h2 id="work-title">A small selection of<br />real project work.</h2>
          <p>Two public repositories in detail, followed by four smaller project notes.</p>
        </div>
      </div>

      <div className="featured-list page-grid">
        {featuredProjects.map((project, index) => (
          <FeaturedProject key={project.id} project={project} index={index} />
        ))}
      </div>

      <div className="additional-work editorial-grid">
        <div>
          <p className="section-index">Also in the portfolio</p>
        </div>
        <div className="project-rows">
          {additionalProjects.map((project) => (
            <a href={project.url} target="_blank" rel="noopener noreferrer" key={project.id} id={project.id}>
              <span className="row-number">{project.number}</span>
              <span className="row-title">
                <strong>{project.name}</strong>
                <small>{project.category}</small>
              </span>
              <span className="row-summary">{project.summary}</span>
              <ArrowRightIcon size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="skills-section editorial-grid" id="skills" aria-labelledby="skills-title">
      <p className="section-index">03 / Skills</p>
      <div>
        <h2 id="skills-title">What I work with.</h2>
        <div className="skills-grid">
          {CAPABILITY_GROUPS.map((group) => (
            <section key={group.title}>
              <h3>{group.title}</h3>
              <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-inner editorial-grid">
        <p className="section-index">04 / About</p>
        <div className="about-content">
          <h2 id="about-title">Curious, direct and still learning.</h2>
          <div className="about-columns">
            <p className="about-lead">
              My route into software is unconventional. I learn fastest by building something real,
              understanding why it works and fixing what does not.
            </p>
            <div>
              <p>
                Earlier work in retail, automotive placements and volunteer tutoring taught me to
                communicate clearly, follow technical procedures and stay patient when a problem is
                unfamiliar.
              </p>
              <p>
                I speak French and Albanian, with professional English at B2 level. I&apos;m a Belgian
                citizen and do not require a visa to work in the European Union.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-inner page-grid">
        <p>Open to junior software, backend and applied AI roles.</p>
        <h2 id="contact-title">Let&apos;s talk.</h2>
        <a className="contact-email" href={`mailto:${CONTACT.email}`}>
          <MailIcon size={24} aria-hidden="true" />
          {CONTACT.email}
          <ArrowRightIcon size={24} aria-hidden="true" />
        </a>
        <div className="contact-links">
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
            <MarkGithubIcon size={18} aria-hidden="true" /> GitHub
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </section>
  );
}

export function App() {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#introduction">Skip to main content</a>
      <SiteHeader />
      <main>
        <Hero />
        <Introduction />
        <Work />
        <Skills />
        <About />
        <Contact />
      </main>
      <footer className="site-footer page-grid">
        <p>© 2026 Ardian Mehaj</p>
        <p>Brussels, Belgium</p>
        <a href={ROOT_REPOSITORY_URL} target="_blank" rel="noopener noreferrer">Portfolio source</a>
      </footer>
    </div>
  );
}
