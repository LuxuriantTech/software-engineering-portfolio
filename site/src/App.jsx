import {
  ArrowRightIcon,
  CheckCircleFillIcon,
  MailIcon,
  MarkGithubIcon,
} from "@primer/octicons-react";
import {
  CAPABILITY_GROUPS,
  CONTACT,
  EVIDENCE_ITEMS,
  PROCESS_STEPS,
  PROJECTS,
  ROOT_REPOSITORY_URL,
} from "./siteData.js";

const featuredProjects = PROJECTS.filter((project) => project.featured);
const additionalProjects = PROJECTS.filter((project) => !project.featured);

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Ardian Mehaj, back to top">
        <span className="brand-mark" aria-hidden="true">AM</span>
        <span className="brand-copy">
          <strong>Ardian Mehaj</strong>
          <span>Junior developer · Brussels</span>
        </span>
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        <a href="#work">Work</a>
        <a href="#approach">Approach</a>
        <a href="#capabilities">Skills</a>
        <a href="#about">About</a>
      </nav>

      <a className="header-contact" href={`mailto:${CONTACT.email}`}>
        <MailIcon size={17} aria-hidden="true" />
        Let&apos;s talk
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section-shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span aria-hidden="true" /> Open to junior opportunities</p>
        <h1 id="hero-title">
          Building useful software,
          <em>with proof attached.</em>
        </h1>
        <p className="hero-intro">
          I&apos;m Ardian, a junior full-stack developer focused on backend systems and applied AI.
          I turn ideas into reviewable software, using AI to accelerate the work while owning the
          requirements, decisions, tests, debugging and final validation.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="#work">
            Explore selected work
            <ArrowRightIcon size={18} aria-hidden="true" />
          </a>
          <a className="button button-secondary" href={`mailto:${CONTACT.email}`}>
            Email me
          </a>
        </div>

        <ul className="hero-facts" aria-label="Location and availability">
          <li>Brussels, Belgium</li>
          <li>citizenship claim · EU work authorisation</li>
          <li>Backend · Full-stack · Applied AI</li>
        </ul>
      </div>

      <aside className="build-console" aria-label="Ardian's working model">
        <div className="console-header">
          <div className="console-dots" aria-hidden="true"><span /><span /><span /></div>
          <span>working-model.md</span>
          <span className="console-state">ACTIVE</span>
        </div>
        <div className="console-body">
          <div className="console-heading">
            <p>AI-assisted. Human-reviewed.</p>
            <strong>From idea to evidence.</strong>
          </div>
          <ol className="console-steps">
            <li><span>01</span><strong>Frame</strong><small>problem + acceptance criteria</small></li>
            <li><span>02</span><strong>Build</strong><small>direct + integrate implementation</small></li>
            <li><span>03</span><strong>Challenge</strong><small>test + reproduce + debug</small></li>
            <li><span>04</span><strong>Verify</strong><small>evidence + honest limits</small></li>
          </ol>
          <div className="console-footer">
            <span className="pulse-dot" aria-hidden="true" />
            Available for a team where I can contribute and keep learning
          </div>
        </div>
      </aside>
    </section>
  );
}

function EvidenceBand() {
  return (
    <section className="evidence-band" aria-label="Portfolio evidence at a glance">
      <div className="evidence-grid section-shell">
        {EVIDENCE_ITEMS.map((item) => (
          <div className="evidence-item" key={item.label}>
            <strong>{item.value}</strong>
            <div>
              <span>{item.label}</span>
              <p>{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Status({ project }) {
  return (
    <span className={`project-status status-${project.tone}`}>
      <span aria-hidden="true" />
      {project.status}
    </span>
  );
}

function StackList({ stack }) {
  return (
    <ul className="stack-list" aria-label="Technology used">
      {stack.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function FeaturedProject({ project }) {
  return (
    <article className="featured-project" id={project.id}>
      <div className="project-rail">
        <span className="project-number">{project.number}</span>
        <span className="rail-line" aria-hidden="true" />
        <span className="rail-label">CASE STUDY</span>
      </div>

      <div className="project-main">
        <header className="project-header">
          <div>
            <p className="project-category">{project.category}</p>
            <h3>{project.name}</h3>
          </div>
          <Status project={project} />
        </header>

        <p className="project-summary">{project.summary}</p>

        <div className="project-detail-grid">
          <div>
            <p className="detail-label">My responsibility</p>
            <p className="responsibility">{project.responsibility}</p>
            <StackList stack={project.stack} />
          </div>
          <div className="project-proof">
            <p className="detail-label">Reviewable evidence</p>
            <ul>
              {project.highlights.map((highlight) => (
                <li key={highlight}>
                  <CheckCircleFillIcon size={18} aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="project-outcome">
          <div>
            <span>Current result</span>
            <strong>{project.outcome}</strong>
            <small>{project.outcomeDetail}</small>
          </div>
          <div className="project-boundary">
            <span>Current boundary</span>
            <p>{project.limitation}</p>
          </div>
        </div>

        <a className="project-link" href={project.url} target="_blank" rel="noopener noreferrer">
          {project.linkLabel}
          <ArrowRightIcon size={18} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function CompactProject({ project }) {
  return (
    <article className="compact-project" id={project.id}>
      <header>
        <span className="project-number">{project.number}</span>
        <Status project={project} />
      </header>
      <p className="project-category">{project.category}</p>
      <h3>{project.name}</h3>
      <p className="compact-summary">{project.summary}</p>

      <div className="compact-proof">
        <p className="detail-label">What is reviewable</p>
        <ul>
          {project.highlights.slice(0, 2).map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>

      <StackList stack={project.stack} />

      <div className="compact-boundary">
        <span>Scope</span>
        <p>{project.limitation}</p>
      </div>

      <a className="project-link" href={project.url} target="_blank" rel="noopener noreferrer">
        {project.linkLabel}
        <ArrowRightIcon size={18} aria-hidden="true" />
      </a>
    </article>
  );
}

function WorkSection() {
  return (
    <section className="work-section section-shell" id="work" aria-labelledby="work-title">
      <div className="section-heading">
        <div>
          <p className="section-kicker">01 / Selected work</p>
          <h2 id="work-title">Built to be inspected,<br />not just presented.</h2>
        </div>
        <p>
          Each project includes the problem, my role, verifiable behaviour and the current limit.
          Strong results stay visible. Failed gates do too.
        </p>
      </div>

      <div className="featured-projects">
        {featuredProjects.map((project) => <FeaturedProject key={project.id} project={project} />)}
      </div>

      <div className="more-work-heading">
        <h3>More systems I&apos;ve directed and reviewed</h3>
        <p>Four bounded project stories spanning products, operations, research and safety.</p>
      </div>

      <div className="compact-project-grid">
        {additionalProjects.map((project) => <CompactProject key={project.id} project={project} />)}
      </div>
    </section>
  );
}

function ApproachSection() {
  return (
    <section className="approach-section" id="approach" aria-labelledby="approach-title">
      <div className="section-shell approach-layout">
        <div className="approach-intro">
          <p className="section-kicker">02 / How I work</p>
          <h2 id="approach-title">AI speeds up execution.<br />Responsibility stays with me.</h2>
          <p>
            I do not pretend to write every line without assistance. My value is turning an unclear
            goal into a controlled build: defining what matters, directing the tools, understanding
            the result and refusing to call it done until the evidence matches the claim.
          </p>
        </div>

        <ol className="process-list">
          {PROCESS_STEPS.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section className="capabilities-section section-shell" id="capabilities" aria-labelledby="capabilities-title">
      <div className="section-heading compact-heading">
        <div>
          <p className="section-kicker">03 / Capabilities</p>
          <h2 id="capabilities-title">What I can contribute.</h2>
        </div>
        <p>A practical toolkit for junior full-stack, backend and applied AI work.</p>
      </div>

      <div className="capability-grid">
        {CAPABILITY_GROUPS.map((group, index) => (
          <article key={group.title}>
            <span className="capability-number">0{index + 1}</span>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <ul>
              {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about-section section-shell" id="about" aria-labelledby="about-title">
      <div className="about-label">
        <p className="section-kicker">04 / About</p>
        <span className="about-monogram" aria-hidden="true">AM</span>
      </div>

      <div className="about-copy">
        <h2 id="about-title">An unconventional route into software, backed by serious work.</h2>
        <p className="about-lead">
          I learn by building: I break down goals, guide implementation, read and challenge the
          output, debug failures and improve the system until I understand why it works.
        </p>
        <p>
          My aim is to grow into software and artificial intelligence work where useful products,
          careful reasoning and honest validation matter. I&apos;m preparing to begin an online BSc in
          Computer Science alongside professional work.
        </p>
        <p>
          Previous experience in retail, automotive placements and volunteer tutoring taught me
          patience, structured problem-solving, teamwork and respect for technical procedures.
        </p>

        <dl className="about-facts">
          <div><dt>Based in</dt><dd>Brussels, Belgium</dd></div>
          <div><dt>Languages</dt><dd>French · Albanian · English B2</dd></div>
          <div><dt>Looking for</dt><dd>Junior software · Backend · Applied AI</dd></div>
          <div><dt>Work status</dt><dd>citizenship claim · No visa required in the EU</dd></div>
        </dl>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="section-shell contact-layout">
        <div>
          <p className="section-kicker">05 / Contact</p>
          <h2 id="contact-title">Let&apos;s build something<br />worth reviewing.</h2>
        </div>
        <div className="contact-copy">
          <p>
            I&apos;m looking for a junior role where I can contribute from day one, learn from experienced
            people and keep raising the quality of what I build.
          </p>
          <a className="contact-email" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
            <ArrowRightIcon size={24} aria-hidden="true" />
          </a>
          <div className="contact-links">
            <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
              <MarkGithubIcon size={19} aria-hidden="true" /> GitHub
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function App() {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#work">Skip to selected work</a>
      <SiteHeader />
      <main>
        <Hero />
        <EvidenceBand />
        <WorkSection />
        <ApproachSection />
        <CapabilitiesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <footer className="site-footer section-shell">
        <p>© 2026 Ardian Mehaj</p>
        <p>No trackers · No contact form · Explicit project limits</p>
        <a href={ROOT_REPOSITORY_URL} target="_blank" rel="noopener noreferrer">Portfolio source</a>
      </footer>
    </div>
  );
}
