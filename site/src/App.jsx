import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowRightIcon,
  DownloadIcon,
  FileIcon,
  MailIcon,
  MarkGithubIcon,
  XIcon,
} from "@primer/octicons-react";
import {
  CV_CONTENT,
  CV_FR_CONTENT,
  DOCUMENTS,
  LETTER_CONTENT,
  documentById,
} from "./documentData.js";
import {
  CAPABILITY_GROUPS,
  CONTACT,
  NAV_ITEMS,
  PROJECTS,
  ROOT_REPOSITORY_URL,
  WORKFLOW_STEPS,
} from "./siteData.js";
import {
  browserPrefersReducedMotion,
} from "./sessionIntroState.js";
import { PortfolioIntro } from "./PortfolioIntro.jsx";
import { usePortfolioIntro } from "./usePortfolioIntro.js";

const featuredProjects = PROJECTS.filter((project) => project.featured).sort((a, b) => a.number.localeCompare(b.number));
const additionalProjects = PROJECTS.filter((project) => !project.featured).sort((a, b) => a.number.localeCompare(b.number));
const browserProjects = PROJECTS.filter((project) => project.demoUrl?.startsWith("/projects/") || project.url.startsWith("/projects/")).sort((a, b) => a.number.localeCompare(b.number));

function repositoryHandoffProject() {
  if (typeof window === "undefined") return null;

  const projectId = new URLSearchParams(window.location.search).get("repository");
  return PROJECTS.find(({ id }) => id === projectId && ["evidencedesk", "api-contract-guard", "toolcall-replay", "entity-resolution-workbench", "postgres-migration-rehearsal"].includes(id)) ?? null;
}

function ProjectStatus({ status }) {
  return (
    <span className="project-status" data-status={status}>
      <i aria-hidden="true" />
      {status}
    </span>
  );
}

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



function HeroMotion() {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const section = stage?.closest(".intro");

    if (!stage || !section || typeof window.matchMedia !== "function") return undefined;

    let frame = null;
    let pointerMotionIsActive = false;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateTilt(event) {
      if (frame !== null) window.cancelAnimationFrame(frame);

      frame = window.requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));

        stage.style.setProperty("--motion-rotate-x", `${(0.5 - y) * 9}deg`);
        stage.style.setProperty("--motion-rotate-y", `${(x - 0.5) * 11}deg`);
        stage.style.setProperty("--motion-shift-x", `${(x - 0.5) * 18}px`);
        stage.style.setProperty("--motion-shift-y", `${(y - 0.5) * 14}px`);
      });
    }

    function resetTilt() {
      if (frame !== null) window.cancelAnimationFrame(frame);
      stage.style.removeProperty("--motion-rotate-x");
      stage.style.removeProperty("--motion-rotate-y");
      stage.style.removeProperty("--motion-shift-x");
      stage.style.removeProperty("--motion-shift-y");
    }

    function startPointerMotion() {
      if (pointerMotionIsActive) return;
      pointerMotionIsActive = true;
      section.addEventListener("pointermove", updateTilt);
      section.addEventListener("pointerleave", resetTilt);
    }

    function stopPointerMotion() {
      if (!pointerMotionIsActive) return;
      pointerMotionIsActive = false;
      section.removeEventListener("pointermove", updateTilt);
      section.removeEventListener("pointerleave", resetTilt);
      resetTilt();
    }

    function syncMotionPreference() {
      if (motionPreference.matches) stopPointerMotion();
      else startPointerMotion();
    }

    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      stopPointerMotion();
      motionPreference.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  return (
    <div className="hero-motion" ref={stageRef} aria-hidden="true">
      <span className="hero-motion-axis hero-motion-axis--horizontal" />
      <span className="hero-motion-axis hero-motion-axis--vertical" />
      <div className="hero-motion-stack">
        <span className="hero-motion-plane hero-motion-plane--cobalt" />
        <span className="hero-motion-plane hero-motion-plane--orange" />
        <span className="hero-motion-plane hero-motion-plane--paper">
          <i>IDEA</i>
          <i>SYSTEM</i>
        </span>
      </div>
    </div>
  );
}

function Intro({ onOpenDocument }) {
  return (
    <section className="intro" aria-labelledby="intro-title">
      <HeroMotion />
      <div className="intro-grid page-grid">
        <p className="intro-kicker"><span>Ardian Mehaj</span><span>Brussels, Belgium</span></p>
        <div className="intro-title">
          <p>Junior software developer · Python &amp; TypeScript</p>
          <h1 id="intro-title">Working software.<br />Visible proof.</h1>
          <p className="intro-description">I build developer tools for API changes, workflow rules and data quality. Try the examples, inspect the public code and see where each result stops. I use AI coding assistants and review the work they help implement.</p>
          <div className="intro-actions">
            <a className="primary-action" href="#work">Explore three projects <ArrowRightIcon size={18} aria-hidden="true" /></a>
            <button className="secondary-action" type="button" onClick={(event) => onOpenDocument("cv", event.currentTarget)}>
              <FileIcon size={18} aria-hidden="true" /> View my CV
            </button>
          </div>
        </div>
        <aside className="availability" aria-label="Role and availability">
          <p className="availability-status"><span aria-hidden="true" />Available for junior roles</p>
          <p>Developer tools · Backend · Data quality</p>
          <p>Seeking full-time work · Hours to discuss<br />OPIT online BSc · Began September 2026</p>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </aside>
      </div>
    </section>
  );
}

function RepositoryHandoff({ project }) {
  useEffect(() => { window.location.replace(project.url); }, [project.url]);
  return <main className="legacy-repository page-grid"><h1>{project.name}</h1><a href={project.url}>Open repository on GitHub</a></main>;
}

function usePageMotion(enabled) {
  useEffect(() => {
    const root = document.documentElement;
    const motionIsReduced = browserPrefersReducedMotion();
    let scrollFrame = null;
    let lastScrollY = window.scrollY;
    let scrollDirection = "down";

    function updateScrollProgress() {
      scrollFrame = null;
      const nextScrollY = window.scrollY;
      if (Math.abs(nextScrollY - lastScrollY) > 2) {
        scrollDirection = nextScrollY < lastScrollY ? "up" : "down";
        root.dataset.scrollDirection = scrollDirection;
      }
      lastScrollY = nextScrollY;
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollRange > 0 ? Math.min(1, nextScrollY / scrollRange) : 0;
      root.style.setProperty("--scroll-progress", String(progress));
    }

    function queueScrollProgress() {
      if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(updateScrollProgress);
    }

    updateScrollProgress();
    window.addEventListener("scroll", queueScrollProgress, { passive: true });
    window.addEventListener("resize", queueScrollProgress);

    if (!enabled || motionIsReduced || typeof window.IntersectionObserver !== "function") {
      return () => {
        if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
        window.removeEventListener("scroll", queueScrollProgress);
        window.removeEventListener("resize", queueScrollProgress);
        root.style.removeProperty("--scroll-progress");
      };
    }

    root.classList.add("motion-ready");
    const revealTargets = document.querySelectorAll(
      "[data-reveal], .intro-kicker, .intro-title, .availability, .proof-line, .section-heading, .case-file, .project-index, .method-intro, .skills-intro, .skills-list, .documents-copy, .document-deck, .about-copy, .about-facts, .contact-inner",
    );
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px" },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
      observer.disconnect();
      revealTargets.forEach((target) => {
        target.classList.remove("is-revealed");
        delete target.dataset.revealFrom;
      });
      window.removeEventListener("scroll", queueScrollProgress);
      window.removeEventListener("resize", queueScrollProgress);
      root.classList.remove("motion-ready");
      root.removeAttribute("data-scroll-direction");
      root.style.removeProperty("--scroll-progress");
    };
  }, [enabled]);
}

function useControlPressFeedback() {
  useEffect(() => {
    const timers = new Set();

    function registerPress(target) {
      target.classList.remove("is-pressing");
      void target.offsetWidth;
      target.classList.add("is-pressing");

      const timer = window.setTimeout(() => {
        target.classList.remove("is-pressing");
        timers.delete(timer);
      }, 320);
      timers.add(timer);
    }

    function findControl(event) {
      if (!(event.target instanceof Element)) return null;
      return event.target.closest("button:not(:disabled), a[href], summary");
    }

    function handlePointerDown(event) {
      if (event.button !== 0) return;
      const control = findControl(event);
      if (control) registerPress(control);
    }

    function handleKeyDown(event) {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      const control = findControl(event);
      if (control) registerPress(control);
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);
}

function DocumentDeck({ onOpenDocument }) {
  return (
    <button
      className="document-deck"
      type="button"
      onClick={(event) => onOpenDocument("cv", event.currentTarget)}
      aria-label="Open Ardian Mehaj's CV in the portfolio"
    >
      <span className="document-shadow" aria-hidden="true" />
      <span className="document-paper document-paper--letter" aria-hidden="true">
        <span>02</span>
        <strong>LETTER</strong>
        <i />
        <i />
        <i />
      </span>
      <span className="document-paper document-paper--cv" aria-hidden="true">
        <span>01 · PUBLIC EDITION</span>
        <strong>ARDIAN<br />MEHAJ</strong>
        <em>CV / 2026</em>
        <i />
        <i />
        <i />
      </span>
      <span className="document-deck-hint" aria-hidden="true">
        Open the file
        <ArrowRightIcon size={18} />
      </span>
    </button>
  );
}

function Documents({ onOpenDocument }) {
  return (
    <section className="documents-section" id="documents" aria-labelledby="documents-title">
      <div className="documents-layout page-grid">
        <div className="documents-copy">
          <p className="section-label">Documents</p>
          <h2 id="documents-title">My CV and motivation.</h2>
          <p className="documents-lead">
            A closer look at my projects, experience and plans. Read here or download a PDF.
          </p>

          <div className="document-list" aria-label="Career documents">
            {DOCUMENTS.map((document) => (
              <button
                type="button"
                key={document.id}
                onClick={(event) => onOpenDocument(document.id, event.currentTarget)}
              >
                <span>{document.index}</span>
                <span>
                  <small>{document.eyebrow}</small>
                  <strong>{document.title}</strong>
                </span>
                <ArrowRightIcon size={20} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <DocumentDeck onOpenDocument={onOpenDocument} />
      </div>
    </section>
  );
}

function CvDocument({ language = "en" }) {
  const cv = language === "fr" ? CV_FR_CONTENT : CV_CONTENT;
  const labels = language === "fr" ? { edition: "CV public · 2026", profile: "Profil", projects: "Projets sélectionnés", experience: "Expérience", education: "Formation et certification", tools: "Outils utilisés avec l’IA" } : { edition: "Public CV · 2026", profile: "Profile", projects: "Selected projects", experience: "Experience", education: "Education & certification", tools: "Tools used with AI assistance" };
  return (
    <article className="document-page document-page--cv" id="document-panel" role="tabpanel" lang={language} aria-labelledby={language === "fr" ? "document-tab-cv-fr" : "document-tab-cv"}>
      <header className="document-page-header">
        <div>
          <p className="document-page-kicker">{labels.edition}</p>
          <h2>Ardian Mehaj</h2>
          <p>{cv.role}</p>
        </div>
        <address>
          <span>{cv.location}</span>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
            github.com/LuxuriantTech
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn / Ardian Mehaj
          </a>
        </address>
      </header>

      <section className="document-block">
        <h3>{labels.profile}</h3>
        <p>{cv.profile}</p>
      </section>

      <section className="document-block">
        <h3>{labels.projects}</h3>
        <div className="document-projects">
          {cv.projects.map((project) => (
            <div key={project.name}>
              <h4><a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`${language === "fr" ? "Voir le code public de" : "View public source for"} ${project.name}`}>{project.name} <ArrowRightIcon size={14} aria-hidden="true" /></a></h4>
              <p className="document-meta">{project.meta}</p>
              <p>{project.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="document-block document-block--columns">
        <div>
          <h3>{labels.experience}</h3>
          {cv.experience.map((experience) => (
            <div className="document-compact-item" key={experience.name}>
              <h4>{experience.name}</h4>
              <p className="document-meta">{experience.meta}</p>
              <p>{experience.detail}</p>
            </div>
          ))}
        </div>
        <div>
          <h3>{labels.education}</h3>
          {cv.education.map((education) => (
            <div className="document-compact-item" key={education.name}>
              <h4>{education.name}</h4>
              <p>{education.detail}</p>
            </div>
          ))}
          <p className="document-certificate">{cv.certification}</p>
          <p className="document-languages">{cv.languages}</p>
        </div>
      </section>

      <section className="document-block document-block--tools">
        <h3>{labels.tools}</h3>
        <p>{cv.tools}</p>
      </section>
    </article>
  );
}

function LetterDocument() {
  return (
    <article className="document-page document-page--letter" id="document-panel" role="tabpanel" aria-labelledby="document-tab-letter">
      <header className="document-page-header">
        <div>
          <p className="document-page-kicker">General motivation · 2026</p>
          <h2>Ardian Mehaj</h2>
        </div>
        <address>
          <span>Brussels, Belgium</span>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
            github.com/LuxuriantTech
          </a>
        </address>
      </header>

      <div className="letter-copy">
        <p className="letter-subject">{LETTER_CONTENT.subject}</p>
        <p>{LETTER_CONTENT.salutation}</p>
        {LETTER_CONTENT.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>{LETTER_CONTENT.closing}</p>
        <p><strong>Ardian Mehaj</strong></p>
      </div>
    </article>
  );
}

function readDocumentOrigin(trigger) {
  if (!(trigger instanceof Element)) return null;

  const originElement = trigger.querySelector("svg") ?? trigger;
  const bounds = originElement.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return null;

  return {
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
  };
}

function DocumentViewer({ activeDocumentId, originRect, lastTriggerRef, onSelect, onDismiss }) {
  const dialogRef = useRef(null);
  const closeTimerRef = useRef(null);
  const tabRefs = useRef([]);
  const [slideDirection, setSlideDirection] = useState("forward");
  const activeDocument = documentById(activeDocumentId);

  function updateFlightGeometry(preferredOrigin = originRect) {
    const dialog = dialogRef.current;
    const page = dialog?.querySelector(".document-page");
    const canvas = dialog?.querySelector(".document-viewer-canvas");
    if (!dialog || !page || !canvas) return false;

    const liveOrigin = readDocumentOrigin(lastTriggerRef.current);
    const source = liveOrigin ?? preferredOrigin;
    if (!source) return false;

    const pageBounds = page.getBoundingClientRect();
    const canvasBounds = canvas.getBoundingClientRect();
    const targetLeft = Math.max(pageBounds.left, canvasBounds.left);
    const targetTop = Math.max(pageBounds.top, canvasBounds.top);
    const targetRight = Math.min(pageBounds.right, canvasBounds.right);
    const targetBottom = Math.min(pageBounds.bottom, canvasBounds.bottom);
    const targetWidth = Math.max(1, targetRight - targetLeft);
    const targetHeight = Math.max(1, targetBottom - targetTop);
    const sourceCenterX = source.left + source.width / 2;
    const sourceCenterY = source.top + source.height / 2;
    const targetCenterX = targetLeft + targetWidth / 2;
    const targetCenterY = targetTop + targetHeight / 2;
    const sourceSize = Math.max(40, source.width, source.height);
    const scale = Math.max(0.045, Math.min(0.16, sourceSize / Math.max(targetWidth, targetHeight)));
    const rotation = Math.max(-3.5, Math.min(3.5, (sourceCenterX / window.innerWidth - 0.5) * 7));

    dialog.style.setProperty("--document-flight-left", `${targetLeft}px`);
    dialog.style.setProperty("--document-flight-top", `${targetTop}px`);
    dialog.style.setProperty("--document-flight-width", `${targetWidth}px`);
    dialog.style.setProperty("--document-flight-height", `${targetHeight}px`);
    dialog.style.setProperty("--document-flight-x", `${sourceCenterX - targetCenterX}px`);
    dialog.style.setProperty("--document-flight-y", `${sourceCenterY - targetCenterY}px`);
    dialog.style.setProperty("--document-flight-scale", scale.toFixed(4));
    dialog.style.setProperty("--document-flight-rotate", `${rotation.toFixed(2)}deg`);
    return true;
  }

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!activeDocumentId || !dialog) return undefined;

    if (!dialog.open) dialog.showModal();
    document.body.classList.add("document-viewer-open");
    updateFlightGeometry(originRect);
    void dialog.offsetWidth;
    dialog.dataset.flightReady = "true";
    void dialog.offsetWidth;
    dialog
      .querySelector('.document-tabs [role="tab"][aria-selected="true"]')
      ?.focus({ preventScroll: true });
    return undefined;
  }, [Boolean(activeDocumentId)]);

  useEffect(() => {
    if (!activeDocumentId) return undefined;

    const syncGeometry = () => updateFlightGeometry(originRect);
    window.addEventListener("resize", syncGeometry);
    window.visualViewport?.addEventListener("resize", syncGeometry);

    return () => {
      window.removeEventListener("resize", syncGeometry);
      window.visualViewport?.removeEventListener("resize", syncGeometry);
    };
  }, [activeDocumentId, originRect]);

  useEffect(
    () => () => {
      document.body.classList.remove("document-viewer-open");
      window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  if (!activeDocumentId) return null;

  function finishClose() {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    document.body.classList.remove("document-viewer-open");
    onDismiss();
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }

  function requestClose() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.classList.contains("is-closing")) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }

    updateFlightGeometry(originRect);
    dialog.classList.add("is-closing");
    closeTimerRef.current = window.setTimeout(finishClose, 240);
  }

  function selectDocument(nextDocumentId) {
    if (nextDocumentId === activeDocumentId) return;

    const currentIndex = DOCUMENTS.findIndex(({ id }) => id === activeDocumentId);
    const nextIndex = DOCUMENTS.findIndex(({ id }) => id === nextDocumentId);
    setSlideDirection(nextIndex >= currentIndex ? "forward" : "back");
    onSelect(nextDocumentId);
  }

  function moveBetweenTabs(event, currentIndex) {
    const keyOffsets = { ArrowLeft: -1, ArrowRight: 1 };
    let nextIndex = currentIndex;

    if (event.key in keyOffsets) {
      nextIndex = (currentIndex + keyOffsets[event.key] + DOCUMENTS.length) % DOCUMENTS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = DOCUMENTS.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
    selectDocument(DOCUMENTS[nextIndex].id);
  }

  return (
    <dialog
      className="document-viewer"
      ref={dialogRef}
      data-direction={slideDirection}
      aria-labelledby="document-viewer-title"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div className="document-flight" aria-hidden="true">
        <span>{activeDocument.index} · PUBLIC FILE</span>
        <strong>{activeDocument.shortLabel}</strong>
        <i />
        <i />
        <i />
      </div>
      <div className="document-viewer-shell">
        <header className="document-viewer-toolbar">
          <div>
            <p>AM / FILES</p>
            <h2 id="document-viewer-title">{activeDocument.shortLabel}</h2>
          </div>

          <div className="document-tabs" role="tablist" aria-label="Choose a document">
            {DOCUMENTS.map((document, index) => (
              <button
                type="button"
                role="tab"
                id={"document-tab-" + document.id}
                aria-controls="document-panel"
                aria-selected={activeDocumentId === document.id}
                tabIndex={activeDocumentId === document.id ? 0 : -1}
                key={document.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                onClick={() => selectDocument(document.id)}
                onKeyDown={(event) => moveBetweenTabs(event, index)}
              >
                {document.shortLabel}
              </button>
            ))}
          </div>

          <div className="document-viewer-actions">
            <a href={activeDocument.pdfPath} download={activeDocument.fileName}>
              <DownloadIcon size={17} aria-hidden="true" />
              Download PDF
            </a>
            <button type="button" onClick={requestClose} aria-label="Close document viewer">
              <XIcon size={20} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="document-viewer-canvas">
          {activeDocumentId === "letter" ? (
            <LetterDocument key="letter" />
          ) : (
            <CvDocument key={activeDocumentId} language={activeDocumentId === "cv-fr" ? "fr" : "en"} />
          )}
        </div>
      </div>
    </dialog>
  );
}

function ProjectVisual({ project }) {
  if (project.id === "toolcall-replay") {
    return (
      <a href={project.demoUrl} className="case-visual case-visual--toolcall" aria-label="Open the prepared ToolCall Replay walkthrough">
        <span className="case-visual__eyebrow">PREPARED TRACE / EXPECTED REJECTION</span>
        <span className="trace-path"><span>01 / EXPORT</span><span>02 / LOOKUP</span><span>03 / UPDATE</span></span>
        <span className="trace-verdict"><strong>FAIL</strong><span>Three rule violations<br />No tools executed</span></span>
        <span className="case-visual__footer">Inspect the rejected trace <ArrowRightIcon size={19} aria-hidden="true" /></span>
      </a>
    );
  }

  if (project.id === "entity-resolution-workbench") {
    return (
      <a href={project.demoUrl} className="case-visual case-visual--entity" aria-label="Open the prepared Entity Resolution Workbench comparison">
        <span className="case-visual__eyebrow">RECORDED COMPARISON / SYNTHETIC DATA</span>
        <span className="record-pair"><span><small>CATALOGUE A</small><strong>Harbor Desk Lamp</strong><em>SKU / HBL8</em></span><span><small>CATALOGUE B</small><strong>Harbor Desk Lamp</strong><em>SKU / HBL9</em></span></span>
        <span className="record-verdict"><strong>REVIEW</strong><span>Same name. Conflicting identifier.</span></span>
        <span className="case-visual__footer">Inspect the decision reasons <ArrowRightIcon size={19} aria-hidden="true" /></span>
      </a>
    );
  }

  return (
    <a href={project.demoUrl} className="contract-workflow" aria-label="Try API Contract Guard: compare a change to an API contract">
      <span className="section-label">One change. An existing client.</span>
      <span className="contract-inputs"><span>Before<br /><strong>GET /invoices</strong><br />No query parameter</span><span>After<br /><strong>+ region</strong><br />Required parameter</span></span>
      <span className="contract-compare">Could an existing request break? <ArrowRightIcon size={22} aria-hidden="true" /></span>
      <span className="contract-outputs"><span>JSON report</span><span>HTML report</span></span>
      <span className="contract-footnote">Run the comparison and inspect the reported change.</span>
    </a>
  );
}

function ProjectCase({ project }) {
  return (
    <article className="case-file" id={project.id}>
      <div className="case-rule" aria-hidden="true"><span /><span /><span /></div>
      <header className="project-heading">
        <div><p className="section-label">{project.number} / {project.category}</p><h3>{project.name}</h3></div>
        <ProjectStatus status={project.status} />
      </header>
      <p className="project-summary">{project.summary}</p>
      <p className="project-stack">{project.stack}</p>
      <p className="project-demo-mode">{project.demoMode}</p>
      <div className="project-body">
        <ProjectVisual project={project} />
        <div className="project-notes">
          <dl>
            <div><dt>Start here</dt><dd>{project.example}</dd></div>
            <div><dt>Design choice</dt><dd>{project.decision}</dd></div>
            <div><dt>{project.contributionLabel ?? "My role, with AI assistance"}</dt><dd>{project.contribution}</dd></div>
            <div className="project-limit"><dt>Current limit</dt><dd>{project.shortLimit}</dd></div>
          </dl>
          <div className="project-proof"><strong>What you can inspect</strong><p>{project.proof}</p>{project.repositoryEvidenceUrl ? <a href={project.repositoryEvidenceUrl} target="_blank" rel="noopener noreferrer">{project.evidenceLinkLabel ?? "Read the validation record"} <ArrowRightIcon size={16} aria-hidden="true" /></a> : null}</div>
          <div className="project-links">
            <a className="primary-action" href={project.demoUrl} data-project-transition={project.name}>{project.actionLabel ?? `Try ${project.name}`} <ArrowRightIcon size={18} aria-hidden="true" /></a>
            <a href={project.url} target="_blank" rel="noopener noreferrer">View public source <MarkGithubIcon size={18} aria-hidden="true" /></a>
          </div>
          <details className="project-checks">
            <summary>What runs, and what remains unproven</summary>
            <p>{project.works}</p><p>{project.limit}</p>
            {project.repositorySourceUrl ? <p>Follow the <a href={project.repositorySourceUrl} target="_blank" rel="noopener noreferrer">decision code</a>, <a href={project.repositoryTestUrl} target="_blank" rel="noopener noreferrer">focused test</a>, then run <code>{project.localCommand}</code> from the public repository.</p> : null}
          </details>
        </div>
      </div>
    </article>
  );
}

function Work() {
  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="section-heading page-grid">
        <p className="section-label">Selected work</p>
        <h2 id="work-title">Three projects. Three ways to verify.</h2>
        <p>Run an API comparison, inspect a rejected workflow, then review an uncertain record match. Each case links to public source, tests and a stated limit.</p>
      </div>
      <nav className="selected-project-nav page-grid" aria-label="Selected projects">
        {featuredProjects.map(project => <a key={project.id} href={`#${project.id}`}><span>{project.number}</span>{project.name}<ArrowRightIcon size={18} aria-hidden="true" /></a>)}
      </nav>
      <p className="demo-context page-grid">API Contract Guard computes a report from editable contracts in the browser. ToolCall Replay and Entity Resolution show prepared synthetic outcomes; their source snapshots and local run instructions are public.</p>
      <div className="case-list page-grid">{featuredProjects.map((project) => <ProjectCase project={project} key={project.id} />)}</div>
      <nav className="demo-launchpad page-grid" aria-label="Try the engineering demos">
        <div className="demo-launchpad-heading"><strong>Explore more demonstrations</strong><a href="/projects/">All demo notes <ArrowRightIcon size={16} aria-hidden="true" /></a></div>
        <div className="demo-launchpad-links">
          {browserProjects.map(project => <a key={project.id} href={project.demoUrl || project.url}><span>{project.name}</span><ArrowRightIcon size={18} aria-hidden="true" /></a>)}
        </div>
      </nav>
      <div className="project-index page-grid" aria-labelledby="project-index-title">
        <div className="index-heading"><p className="section-label">Further work</p><h3 id="project-index-title">Seven more projects, with their limits.</h3></div>
        <div className="index-list">
          {additionalProjects.map((project) => (
            <article className="index-entry" key={project.id} id={project.id}>
              <span className="index-number">{project.number}</span>
              <span className="index-name"><a href={project.demoUrl || project.url} target={(project.demoUrl || project.url).startsWith("http") ? "_blank" : undefined} rel={(project.demoUrl || project.url).startsWith("http") ? "noopener noreferrer" : undefined}>{project.name} <ArrowRightIcon size={16} aria-hidden="true" /></a><small>{project.category}</small><ProjectStatus status={project.status} /></span>
              <span className="index-copy">{project.summary}<small>{project.scope}</small></span>
              <span className="index-actions"><a href={project.demoUrl || project.url} target={(project.demoUrl || project.url).startsWith("http") ? "_blank" : undefined} rel={(project.demoUrl || project.url).startsWith("http") ? "noopener noreferrer" : undefined}>{project.demoUrl ? "Open demo" : "Read case"}</a>{project.demoUrl && project.url !== project.demoUrl && project.url.startsWith("https://github.com/") ? <a href={project.url} target="_blank" rel="noopener noreferrer">View source</a> : null}</span>
            </article>
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
          <p className="section-label">How I work</p>
          <h2 id="method-title">Frame the problem. Check the result.</h2>
          <p>
            I use coding assistants for implementation. I define the expected behaviour,
            inspect what changed, run the result and record what remains uncertain.
          </p>
          <p>These are personal projects, not commercial deployments. I am continuing to develop independent programming skills and want code review and practical feedback in my first team.</p>

        </div>

        <ol className="method-steps" data-reveal>
          {WORKFLOW_STEPS.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
          <dl className="contribution-boundaries">
            <div><dt>My responsibility</dt><dd>Scope the task, state the expected result, inspect the behaviour and make the final publication decision.</dd></div>
            <div><dt>AI assistance</dt><dd>Implementation, test preparation, code review and investigation. Each case above explains my contribution and its limits.</dd></div>
            <div><dt>What I am learning</dt><dd>Writing more code independently and weighing technical options with feedback from experienced developers.</dd></div>
          </dl>
          <aside className="method-current">
            <span>A starting point in a team</span>
            <p>Give me a scoped issue, an expected result and code review. I can reproduce the problem, work through a fix and explain what I checked.</p>
          </aside>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="skills-section" id="skills" aria-labelledby="skills-title">
      <div className="section-heading page-grid">
        <p className="section-label">Working set</p>
        <h2 id="skills-title">Tools behind the work.</h2>
        <p>
          These are tools I have used in personal projects and can discuss through the examples above.
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
            My online BSc (Hons) Computer Science at OPIT began in September 2026. I study alongside my search for full-time work. I speak
            French and Albanian, with English certified at EF SET C2 overall (77/100, 18 September 2026). I&apos;m based in Brussels
            and looking for remote work from Belgium or an employer-funded move. I plan to combine my studies with full-time work and can discuss the exact working hours with the team.
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
          I&apos;m looking for a junior software development role building tools and web applications, with
          guidance and code review. Remote from Belgium or with employer-funded relocation.
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

function PortfolioExperience() {
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [documentOrigin, setDocumentOrigin] = useState(null);
  const lastDocumentTriggerRef = useRef(null);
  const intro = usePortfolioIntro();

  usePageMotion(true);
  useControlPressFeedback();

  function openDocument(documentId, trigger) {
    lastDocumentTriggerRef.current = trigger;
    setDocumentOrigin(readDocumentOrigin(trigger));
    setActiveDocumentId(documentId);
  }

  function dismissDocument() {
    setActiveDocumentId(null);
    setDocumentOrigin(null);
  }

  return (
    <div className="site-shell" id="top">
      <PortfolioIntro phase={intro.phase} introRef={intro.introRef} onSkip={intro.skip} />
      <div className="site-content site-content--ready" inert={intro.phase !== "done"}>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SiteHeader />
        <main id="main-content" tabIndex="-1">
          <Intro onOpenDocument={openDocument} />
          <Work />
          <Method />
          <Skills />
          <Documents onOpenDocument={openDocument} />
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
        <DocumentViewer
          activeDocumentId={activeDocumentId}
          originRect={documentOrigin}
          lastTriggerRef={lastDocumentTriggerRef}
          onSelect={setActiveDocumentId}
          onDismiss={dismissDocument}
        />
      </div>
    </div>
  );
}

export function App() {
  const handoffProject = repositoryHandoffProject();

  return handoffProject ? (
    <RepositoryHandoff project={handoffProject} />
  ) : (
    <PortfolioExperience />
  );
}
