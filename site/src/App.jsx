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
  DOCUMENTS,
  LETTER_CONTENT,
  documentById,
} from "./documentData.js";
import {
  CAPABILITIES,
  CAPABILITY_GROUPS,
  CONTACT,
  EVIDENCE_LENS,
  EVIDENCE_SNAPSHOT,
  ITERATION_NOTE,
  NAV_ITEMS,
  PROJECTS,
  PROOF_LINE,
  ROOT_REPOSITORY_URL,
  WORKFLOW_STEPS,
} from "./siteData.js";
import {
  browserPrefersReducedMotion,
  SESSION_INTRO_MAX_DURATION_MS,
  shouldShowSessionIntro,
} from "./sessionIntroState.js";

const featuredProjects = PROJECTS.filter((project) => project.featured);
const additionalProjects = PROJECTS.filter((project) => !project.featured);

function repositoryHandoffProject() {
  if (typeof window === "undefined") return null;

  const projectId = new URLSearchParams(window.location.search).get("repository");
  return featuredProjects.find(({ id }) => id === projectId) ?? null;
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

function EvidenceMark() {
  return (
    <span className="evidence-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function SessionIntro({ onComplete }) {
  useEffect(() => {
    const fallbackTimer = window.setTimeout(onComplete, SESSION_INTRO_MAX_DURATION_MS);

    return () => window.clearTimeout(fallbackTimer);
  }, [onComplete]);

  return (
    <div
      className="session-intro"
      role="status"
      aria-label="Opening Ardian Mehaj's portfolio"
      aria-live="polite"
      onAnimationEnd={(event) => {
        if (
          event.target === event.currentTarget &&
          event.animationName === "session-intro-lifecycle"
        ) {
          onComplete();
        }
      }}
    >
      <div className="session-intro-meta session-intro-meta--top">
        <span>Ardian Mehaj</span>
        <span>Portfolio / 2026</span>
      </div>

      <button className="session-intro-skip" type="button" onClick={onComplete}>
        Skip intro
      </button>

      <div className="session-intro-stage">
        <span className="session-intro-rule" />
        <div className="session-intro-object">
          <span className="session-intro-sheet session-intro-sheet--cobalt" />
          <span className="session-intro-sheet session-intro-sheet--orange" />
          <span className="session-intro-sheet session-intro-sheet--paper">
            <span className="session-intro-sheet-label">AM</span>
            <span className="session-intro-sheet-folio">/ 26</span>
            <span className="session-intro-sheet-line" />
          </span>
        </div>
      </div>

      <div className="session-intro-meta session-intro-meta--bottom">
        <span>Junior software developer</span>
        <span>Brussels, Belgium</span>
      </div>

      <span className="session-intro-progress" aria-hidden="true" />
    </div>
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

function Intro({ onOpenDocument, onReplayIntro }) {
  return (
    <section className="intro" aria-labelledby="intro-title">
      <HeroMotion />
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
          <button
            className="availability-document"
            type="button"
            onClick={(event) => onOpenDocument("cv", event.currentTarget)}
          >
            <FileIcon size={15} aria-hidden="true" />
            View my CV
          </button>
          <button className="availability-replay" type="button" onClick={onReplayIntro}>
            Replay opening
          </button>
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

function WorkPortal() {
  return (
    <div className="work-portal page-grid" data-reveal aria-hidden="true">
      <div className="work-portal-stage">
        <div className="work-portal-copy">
          <span>Selected work</span>
          <div className="work-portal-range">
            <span className="work-portal-range-start">01</span>
            <i className="work-portal-range-dash">—</i>
            <span className="work-portal-range-end">06</span>
          </div>
        </div>
        <span className="work-portal-line work-portal-line--one" />
        <span className="work-portal-line work-portal-line--two" />
        <div className="work-portal-stack">
          <span className="work-portal-sheet work-portal-sheet--cobalt" />
          <span className="work-portal-sheet work-portal-sheet--orange" />
          <span className="work-portal-sheet work-portal-sheet--paper">WORK</span>
        </div>
      </div>
    </div>
  );
}

function ProjectTransition({ targetHash, onComplete }) {
  const hasTravelledRef = useRef(false);
  const skipTransitionRef = useRef(() => {});

  useEffect(() => {
    hasTravelledRef.current = false;

    function travel() {
      if (hasTravelledRef.current) return;
      hasTravelledRef.current = true;

      const target = document.getElementById(targetHash.slice(1));
      if (!target) return;

      window.history.pushState(null, "", targetHash);
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }

    const travelTimer = window.setTimeout(travel, 560);

    function finishTransition() {
      travel();
      onComplete(targetHash);
    }

    skipTransitionRef.current = finishTransition;
    const finishTimer = window.setTimeout(finishTransition, 1450);

    function skipTransition(event) {
      if (event.key !== "Escape") return;
      finishTransition();
    }

    window.addEventListener("keydown", skipTransition);

    return () => {
      window.clearTimeout(travelTimer);
      window.clearTimeout(finishTimer);
      window.removeEventListener("keydown", skipTransition);
    };
  }, [onComplete, targetHash]);

  return (
    <div className="project-transition" role="status" aria-label="Opening selected work">
      <span className="project-transition-panel project-transition-panel--ink" />
      <span className="project-transition-panel project-transition-panel--cobalt" />
      <span className="project-transition-panel project-transition-panel--orange" />
      <button
        className="project-transition-skip"
        type="button"
        onClick={() => skipTransitionRef.current()}
      >
        Skip transition
      </button>
      <div className="project-transition-copy" aria-hidden="true">
        <span>AM / PROJECT FILES</span>
        <strong>WORK</strong>
        <small>ESC TO SKIP</small>
      </div>
    </div>
  );
}

function RepositoryHandoff({ project }) {
  const hasNavigatedRef = useRef(false);
  const skipLinkRef = useRef(null);
  const repositoryPath = new URL(project.url).pathname.slice(1);

  useEffect(() => {
    const cleanUrl = `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", cleanUrl);
    skipLinkRef.current?.focus({ preventScroll: true });

    function openRepository() {
      if (hasNavigatedRef.current) return;
      hasNavigatedRef.current = true;
      window.location.replace(project.url);
    }

    const reducedMotion = browserPrefersReducedMotion();
    const navigationTimer = window.setTimeout(openRepository, reducedMotion ? 0 : 1700);

    function skipHandoff(event) {
      if (event.key === "Escape") openRepository();
    }

    window.addEventListener("keydown", skipHandoff);

    return () => {
      window.clearTimeout(navigationTimer);
      window.removeEventListener("keydown", skipHandoff);
    };
  }, [project.url]);

  return (
    <main
      className="repository-handoff"
      aria-label={`Opening ${project.name} on GitHub`}
    >
      <a className="repository-handoff-skip" href={project.url} ref={skipLinkRef}>
        Open GitHub now
        <ArrowRightIcon size={18} aria-hidden="true" />
      </a>

      <div className="repository-handoff-grid" role="status" aria-live="polite">
        <header className="repository-handoff-header">
          <p>
            <span>{project.number}</span>
            Public repository
          </p>
          <h1>{project.name}</h1>
          <span className="repository-handoff-status">Preparing the source handoff</span>
        </header>

        <div className="repository-handoff-rail">
          <span className="repository-handoff-rule" aria-hidden="true" />
          <div
            className="repository-handoff-signals"
            aria-label="Repository review signals"
          >
            {project.repositorySignals.map((signal) => (
              <span className="repository-handoff-signal" key={signal}>
                <i aria-hidden="true" />
                {signal}
              </span>
            ))}
          </div>
          <span className="repository-handoff-github" aria-hidden="true">
            <MarkGithubIcon size={30} />
          </span>
        </div>

        <footer className="repository-handoff-footer">
          <a className="repository-handoff-evidence" href={project.repositoryEvidenceUrl}>
            Validation evidence
            <ArrowRightIcon size={14} aria-hidden="true" />
          </a>
          <strong>{repositoryPath}</strong>
          <span>GitHub opens in this tab</span>
        </footer>
      </div>

      <span className="repository-handoff-scan" aria-hidden="true" />
    </main>
  );
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
          if (!entry.isIntersecting) {
            entry.target.dataset.revealFrom = scrollDirection === "down" ? "top" : "bottom";
          }
          entry.target.classList.toggle("is-revealed", entry.isIntersecting);
        });
      },
      { threshold: 0.08, rootMargin: "-6% 0px -6% 0px" },
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
          <h2 id="documents-title">The useful files, without leaving the portfolio.</h2>
          <p className="documents-lead">
            Read them here with one smooth transition, or download the same public PDF. No viewer,
            account or external service stands in the way.
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

function CvDocument() {
  return (
    <article className="document-page document-page--cv" id="document-panel" role="tabpanel">
      <header className="document-page-header">
        <div>
          <p className="document-page-kicker">Public CV · 2026</p>
          <h2>Ardian Mehaj</h2>
          <p>{CV_CONTENT.role}</p>
        </div>
        <address>
          <span>{CV_CONTENT.location}</span>
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
        <h3>Profile</h3>
        <p>{CV_CONTENT.profile}</p>
      </section>

      <section className="document-block">
        <h3>Selected projects</h3>
        <div className="document-projects">
          {CV_CONTENT.projects.map((project) => (
            <div key={project.name}>
              <h4>{project.name}</h4>
              <p className="document-meta">{project.meta}</p>
              <p>{project.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="document-block document-block--columns">
        <div>
          <h3>Experience</h3>
          {CV_CONTENT.experience.map((experience) => (
            <div className="document-compact-item" key={experience.name}>
              <h4>{experience.name}</h4>
              <p className="document-meta">{experience.meta}</p>
              <p>{experience.detail}</p>
            </div>
          ))}
        </div>
        <div>
          <h3>Education &amp; certification</h3>
          {CV_CONTENT.education.map((education) => (
            <div className="document-compact-item" key={education.name}>
              <h4>{education.name}</h4>
              <p>{education.detail}</p>
            </div>
          ))}
          <p className="document-certificate">{CV_CONTENT.certification}</p>
          <p className="document-languages">{CV_CONTENT.languages}</p>
        </div>
      </section>

      <section className="document-block document-block--tools">
        <h3>Working with</h3>
        <p>{CV_CONTENT.tools}</p>
      </section>
    </article>
  );
}

function LetterDocument() {
  return (
    <article className="document-page document-page--letter" id="document-panel" role="tabpanel">
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
    closeTimerRef.current = window.setTimeout(finishClose, 650);
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
            <CvDocument key="cv" />
          )}
        </div>
      </div>
    </dialog>
  );
}

function EvidenceLens() {
  const [activeLensId, setActiveLensId] = useState(EVIDENCE_LENS[0].id);
  const instrumentRef = useRef(null);
  const tabRefs = useRef([]);
  const activeIndex = EVIDENCE_LENS.findIndex(({ id }) => id === activeLensId);
  const activeLens = EVIDENCE_LENS[activeIndex] ?? EVIDENCE_LENS[0];

  useEffect(() => {
    const instrument = instrumentRef.current;
    if (!instrument || typeof window.matchMedia !== "function") return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = null;
    let pointerIsActive = false;

    function resetLens() {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      instrument.style.removeProperty("--lens-rotate-x");
      instrument.style.removeProperty("--lens-rotate-y");
    }

    function moveLens(event) {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const bounds = instrument.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        instrument.style.setProperty("--lens-rotate-x", `${(0.5 - y) * 2.4}deg`);
        instrument.style.setProperty("--lens-rotate-y", `${(x - 0.5) * 3.2}deg`);
      });
    }

    function syncPointerMotion() {
      const shouldMove = !reducedMotion.matches && finePointer.matches;
      if (shouldMove && !pointerIsActive) {
        pointerIsActive = true;
        instrument.addEventListener("pointermove", moveLens);
        instrument.addEventListener("pointerleave", resetLens);
      } else if (!shouldMove && pointerIsActive) {
        pointerIsActive = false;
        instrument.removeEventListener("pointermove", moveLens);
        instrument.removeEventListener("pointerleave", resetLens);
        resetLens();
      }
    }

    syncPointerMotion();
    reducedMotion.addEventListener("change", syncPointerMotion);
    finePointer.addEventListener("change", syncPointerMotion);

    return () => {
      reducedMotion.removeEventListener("change", syncPointerMotion);
      finePointer.removeEventListener("change", syncPointerMotion);
      instrument.removeEventListener("pointermove", moveLens);
      instrument.removeEventListener("pointerleave", resetLens);
      resetLens();
    };
  }, []);

  function moveLensTab(event, currentIndex) {
    const keyOffsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1, ArrowDown: 1 };
    let nextIndex = currentIndex;

    if (event.key in keyOffsets) {
      nextIndex = (currentIndex + keyOffsets[event.key] + EVIDENCE_LENS.length) % EVIDENCE_LENS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = EVIDENCE_LENS.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextLens = EVIDENCE_LENS[nextIndex];
    setActiveLensId(nextLens.id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section className="evidence-lens-section" aria-labelledby="evidence-lens-title">
      <div className="evidence-lens-frame page-grid" data-reveal>
        <header className="evidence-lens-intro">
          <p className="section-label">Evidence lens</p>
          <h2 id="evidence-lens-title">One claim. Three ways to inspect it.</h2>
          <p>
            Switch the same project from promise to proof to boundary. This is how I keep assisted
            work reviewable instead of asking you to trust the polished version.
          </p>
        </header>

        <div
          className="evidence-lens-instrument"
          data-state={activeLens.id}
          ref={instrumentRef}
        >
          <div className="evidence-lens-tabs" role="tablist" aria-label="Inspect the project claim">
            {EVIDENCE_LENS.map((lens, index) => (
              <button
                id={`evidence-lens-tab-${lens.id}`}
                type="button"
                role="tab"
                aria-controls="evidence-lens-panel"
                aria-selected={lens.id === activeLens.id}
                tabIndex={lens.id === activeLens.id ? 0 : -1}
                key={lens.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                onClick={() => setActiveLensId(lens.id)}
                onKeyDown={(event) => moveLensTab(event, index)}
              >
                <span>{lens.index}</span>
                {lens.label}
              </button>
            ))}
          </div>

          <div className="evidence-lens-artifact">
            <span className="evidence-lens-sheet evidence-lens-sheet--cobalt" aria-hidden="true" />
            <span className="evidence-lens-sheet evidence-lens-sheet--orange" aria-hidden="true" />
            <article
              className="evidence-lens-paper"
              id="evidence-lens-panel"
              role="tabpanel"
              aria-labelledby={`evidence-lens-tab-${activeLens.id}`}
              tabIndex="0"
              key={activeLens.id}
            >
              <header>
                <span>{activeLens.eyebrow}</span>
                <span>PROJECT 02 / API CONTRACT GUARD</span>
              </header>
              <div className="evidence-lens-paper-body">
                <p className="evidence-lens-metric">
                  <strong>{activeLens.metric}</strong>
                  <span>{activeLens.unit}</span>
                </p>
                <div>
                  <h3>{activeLens.title}</h3>
                  <p>{activeLens.detail}</p>
                </div>
              </div>
              <footer>
                <span>{activeLens.note}</span>
                <a href="#api-contract-guard">
                  Open the case
                  <ArrowRightIcon size={18} aria-hidden="true" />
                </a>
              </footer>
            </article>
          </div>

          <div className="evidence-lens-register" aria-hidden="true">
            {EVIDENCE_LENS.map((lens) => (
              <span key={lens.id} data-active={lens.id === activeLens.id ? "true" : "false"} />
            ))}
          </div>

          <a
            className="evidence-lens-source"
            href={EVIDENCE_SNAPSHOT.runUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Publication CI · commit {EVIDENCE_SNAPSHOT.commit}
            <ArrowRightIcon size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section
      className="capabilities-section capabilities-section--compact"
      aria-labelledby="capabilities-title"
    >
      <div className="section-heading page-grid">
        <p className="section-label">What I bring</p>
        <h2 id="capabilities-title">Clear direction. Visible checks. Honest limits.</h2>
        <p>
          I am early in my software career, but I already know how to make a complicated brief
          concrete and keep the result reviewable.
        </p>
      </div>

      <ol className="capability-list page-grid" data-reveal>
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
          <ProjectStatus status={project.status} />
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
        href={`?repository=${encodeURIComponent(project.id)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.linkLabel}: ${project.name}. Opens a short handoff, then GitHub in a new tab.`}
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
      <WorkPortal />
      <div className="section-heading page-grid">
        <p className="section-label">Selected work</p>
        <h2 id="work-title">Two case files. Four more projects at different stages.</h2>
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
              <span className="index-scope">
                <ProjectStatus status={project.status} />
                <small>{project.scope}</small>
              </span>
              <ArrowRightIcon size={20} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function EvidenceSnapshot() {
  const coverageLabel = EVIDENCE_SNAPSHOT.coverage
    .map((metric) => `${metric.label} ${metric.value}%`)
    .join(", ");

  return (
    <section className="evidence-section" aria-labelledby="evidence-title">
      <div className="evidence-layout page-grid">
        <div className="evidence-copy" data-reveal>
          <p className="section-label">Measured work</p>
          <h2 id="evidence-title">A number only matters when its boundary is visible.</h2>
          <p>
            This is one published CI snapshot from API Contract Guard. It is useful evidence for a
            deliberately narrow tool, not a score for everything I build.
          </p>
          <div className="evidence-total" aria-label={`${EVIDENCE_SNAPSHOT.tests} tests`}>
            <strong>{EVIDENCE_SNAPSHOT.tests}</strong>
            <span>tests</span>
          </div>
        </div>

        <figure className="evidence-chart" data-reveal aria-label={coverageLabel}>
          <figcaption>
            <span>{EVIDENCE_SNAPSHOT.label}</span>
            <span>commit {EVIDENCE_SNAPSHOT.commit}</span>
          </figcaption>
          <dl>
            {EVIDENCE_SNAPSHOT.coverage.map((metric) => (
              <div className="evidence-metric" key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>
                  <svg viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
                    <rect className="evidence-bar-track" x="0" y="0" width="100" height="4" />
                    <rect
                      className="evidence-bar-fill"
                      x="0"
                      y="0"
                      width={metric.value}
                      height="4"
                    />
                  </svg>
                  <strong>{metric.value}%</strong>
                </dd>
              </div>
            ))}
          </dl>
          <p>{EVIDENCE_SNAPSHOT.scope}</p>
        </figure>
      </div>

      <div className="iteration-note page-grid" data-reveal>
        <div className="iteration-copy">
          <p className="section-label">{ITERATION_NOTE.eyebrow}</p>
          <h3>{ITERATION_NOTE.title}</h3>
          <p>{ITERATION_NOTE.detail}</p>
          <small>{ITERATION_NOTE.caption}</small>
        </div>
        <ol className="iteration-projects" aria-label="Current status of portfolio projects">
          {PROJECTS.map((project) => (
            <li key={project.id}>
              <span>{project.number}</span>
              <strong>{project.name}</strong>
              <ProjectStatus status={project.status} />
            </li>
          ))}
        </ol>
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
          <aside className="method-current">
            <span>What I am improving now</span>
            <p>
              I am learning to write more of the code myself, ask sharper questions and make every
              check easier to reproduce.
            </p>
          </aside>
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
            French and Albanian, with self-assessed English at B2 level. I&apos;m based in Brussels
            and open to local, hybrid or remote junior opportunities.
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

function PortfolioExperience() {
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [documentOrigin, setDocumentOrigin] = useState(null);
  const [isSessionIntroVisible, setIsSessionIntroVisible] = useState(shouldShowSessionIntro);
  const [projectTransitionTarget, setProjectTransitionTarget] = useState(null);
  const lastDocumentTriggerRef = useRef(null);
  const pendingProjectFocusRef = useRef(null);

  usePageMotion(!isSessionIntroVisible);
  useControlPressFeedback();

  useEffect(() => {
    if (projectTransitionTarget || !pendingProjectFocusRef.current) return undefined;

    const targetHash = pendingProjectFocusRef.current;
    pendingProjectFocusRef.current = null;
    const focusFrame = window.requestAnimationFrame(() => {
      const target = document.getElementById(targetHash.slice(1));
      if (!target) return;

      const focusTarget = target.querySelector("h2, h3") ?? target;
      focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus({ preventScroll: true });
      focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), {
        once: true,
      });
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [projectTransitionTarget]);

  function openDocument(documentId, trigger) {
    lastDocumentTriggerRef.current = trigger;
    setDocumentOrigin(readDocumentOrigin(trigger));
    setActiveDocumentId(documentId);
  }

  function dismissDocument() {
    setActiveDocumentId(null);
    setDocumentOrigin(null);
  }

  function finishIntro() {
    setIsSessionIntroVisible(false);
  }

  function replayIntro() {
    if (browserPrefersReducedMotion()) return;
    window.scrollTo({ top: 0, behavior: "auto" });
    setIsSessionIntroVisible(true);
  }

  function handleCinematicNavigation(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      browserPrefersReducedMotion()
    ) {
      return;
    }

    const link = event.target.closest("a[href^='#']");
    const targetHash = link?.getAttribute("href");
    const projectHashes = new Set(["#work", ...PROJECTS.map(({ id }) => `#${id}`)]);

    if (!targetHash || !projectHashes.has(targetHash)) return;

    event.preventDefault();
    setProjectTransitionTarget(targetHash);
  }

  function finishProjectTransition(targetHash) {
    pendingProjectFocusRef.current = targetHash;
    setProjectTransitionTarget(null);
  }

  return (
    <div className="site-shell" id="top">
      {isSessionIntroVisible && (
        <SessionIntro onComplete={finishIntro} />
      )}
      {projectTransitionTarget && (
        <ProjectTransition
          targetHash={projectTransitionTarget}
          onComplete={finishProjectTransition}
        />
      )}
      <div
        className={`site-content${isSessionIntroVisible ? "" : " site-content--ready"}`}
        inert={isSessionIntroVisible || projectTransitionTarget ? true : undefined}
        onClickCapture={handleCinematicNavigation}
      >
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SiteHeader />
        <main id="main-content" tabIndex="-1">
          <Intro onOpenDocument={openDocument} onReplayIntro={replayIntro} />
          <Capabilities />
          <EvidenceLens />
          <Work />
          <EvidenceSnapshot />
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
