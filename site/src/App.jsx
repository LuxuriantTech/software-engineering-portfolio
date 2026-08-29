import { useEffect, useRef, useState } from "react";
import {
  ArrowRightIcon,
  CheckCircleFillIcon,
  MarkGithubIcon,
} from "@primer/octicons-react";
import {
  EVIDENCE_ITEMS,
  PROJECTS,
  ROOT_REPOSITORY_URL,
  projectFromHash,
  skipToProjectDetails,
} from "./siteData.js";

function ProjectNavigation({ activeId, onSelect }) {
  const buttonRefs = useRef(new Map());

  function moveSelection(currentIndex, direction) {
    const nextIndex = (currentIndex + direction + PROJECTS.length) % PROJECTS.length;
    const nextProject = PROJECTS[nextIndex];
    onSelect(nextProject.id);
    buttonRefs.current.get(nextProject.id)?.focus();
  }

  return (
    <nav className="project-navigation" aria-label="Selected projects">
      <p className="project-tabs-hint">Browse all six projects</p>
      <div className="project-tabs" role="tablist" aria-label="Portfolio projects">
        {PROJECTS.map((project, index) => {
          const isActive = project.id === activeId;
          return (
            <button
              className="project-tab"
              data-active={isActive ? "true" : "false"}
              id={"tab-" + project.id}
              key={project.id}
              onClick={() => onSelect(project.id)}
              onKeyDown={(event) => {
                if (["ArrowDown", "ArrowRight"].includes(event.key)) {
                  event.preventDefault();
                  moveSelection(index, 1);
                }
                if (["ArrowUp", "ArrowLeft"].includes(event.key)) {
                  event.preventDefault();
                  moveSelection(index, -1);
                }
                if (event.key === "Home") {
                  event.preventDefault();
                  onSelect(PROJECTS[0].id);
                  buttonRefs.current.get(PROJECTS[0].id)?.focus();
                }
                if (event.key === "End") {
                  event.preventDefault();
                  const lastProject = PROJECTS.at(-1);
                  onSelect(lastProject.id);
                  buttonRefs.current.get(lastProject.id)?.focus();
                }
              }}
              ref={(node) => {
                if (node) buttonRefs.current.set(project.id, node);
              }}
              role="tab"
              aria-controls="project-detail"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              <span className="project-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="project-tab-copy">
                <strong>{project.name}</strong>
                <span>{project.navStatus ?? project.status}</span>
              </span>
              <ArrowRightIcon className="project-arrow" size={20} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function ProjectDetail({ project }) {
  return (
    <div
      className="project-detail"
      id="project-detail"
      role="tabpanel"
      aria-labelledby={"tab-" + project.id}
      tabIndex="0"
    >
      <div className="project-heading">
        <h1>{project.name}</h1>
        <p className={"project-status status-" + project.tone}>{project.status}</p>
        {project.statusDetail ? <p className="status-detail">{project.statusDetail}</p> : null}
      </div>

      <div className="architecture-path" aria-label={project.architectureLabel}>
        {project.architecture.map((item, index) => (
          <span className="architecture-step" key={item}>
            <span>{item}</span>
            {index < project.architecture.length - 1 ? (
              <ArrowRightIcon size={18} aria-hidden="true" />
            ) : null}
          </span>
        ))}
      </div>

      <ul className="project-highlights">
        {project.highlights.map((highlight) => (
          <li key={highlight}>
            <CheckCircleFillIcon size={38} aria-hidden="true" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <div className="limitation-note">
        <strong>Current limitation:</strong> {project.limitation}
      </div>

      <div className="project-actions">
        <a className="primary-action" href={project.url} target="_blank" rel="noopener noreferrer">
          Read project
          <ArrowRightIcon size={18} aria-hidden="true" />
        </a>
        <a
          className="secondary-action"
          href={ROOT_REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MarkGithubIcon size={20} aria-hidden="true" />
          View GitHub repository
        </a>
      </div>
    </div>
  );
}

function EvidenceStrip() {
  return (
    <section className="evidence-strip" aria-labelledby="evidence-title">
      <h2 className="visually-hidden" id="evidence-title">Verified public evidence</h2>
      {EVIDENCE_ITEMS.map((item) => (
        <div className="evidence-item" key={item.label}>
          <CheckCircleFillIcon size={34} aria-hidden="true" />
          <div>
            <strong>{item.label}</strong>
            <span>{item.detail}</span>
            {item.evidenceLinks ? (
              <span className="evidence-links">
                {item.evidenceLinks.map((link) => (
                  <a href={link.url} key={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ))}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
}

export function App() {
  const [activeId, setActiveId] = useState(() => projectFromHash(window.location.hash).id);
  const activeProject = PROJECTS.find((project) => project.id === activeId) ?? PROJECTS[0];

  useEffect(() => {
    function syncFromHash() {
      setActiveId(projectFromHash(window.location.hash).id);
    }

    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function selectProject(projectId) {
    setActiveId(projectId);
    window.history.replaceState(null, "", "#" + projectId);
  }

  return (
    <div className="site-shell">
      <a
        className="skip-link"
        href="#project-detail"
        onClick={(event) => skipToProjectDetails(event, document)}
      >
        Skip to project details
      </a>

      <header className="site-header">
        <div className="identity">
          <a className="identity-name" href="#evidencedesk" onClick={() => selectProject("evidencedesk")}>Ardian Mehaj</a>
          <span>Junior software developer · Brussels</span>
        </div>
        <p>Selected engineering work, with the limits left in.</p>
      </header>

      <main>
        <section className="atlas-workspace" aria-label="Project Atlas">
          <ProjectNavigation activeId={activeId} onSelect={selectProject} />
          <ProjectDetail project={activeProject} />
        </section>

        <EvidenceStrip />
      </main>

      <footer className="site-footer">
        <p className="footer-group">
          <span>No trackers · No forms · No live services</span>
          <a
            href={ROOT_REPOSITORY_URL + "#development-process"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Development process
          </a>
        </p>
        <p className="footer-group footer-group-right">
          <span>Open to junior software, backend and applied AI roles</span>
          <a href="mailto:mehajardian@gmail.com">mehajardian@gmail.com</a>
        </p>
      </footer>
    </div>
  );
}
