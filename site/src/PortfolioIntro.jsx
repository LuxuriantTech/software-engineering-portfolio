import { useEffect, useRef, useState } from "react";
import {
  markSessionIntroSeen,
  SESSION_INTRO_EXIT_DURATION_MS,
  SESSION_INTRO_MAX_DURATION_MS,
  SESSION_INTRO_MIN_DURATION_MS,
  shouldShowSessionIntro,
} from "./sessionIntroState.js";

export function usePortfolioIntro() {
  const [phase, setPhase] = useState(() => shouldShowSessionIntro() ? "active" : "done");
  const introRef = useRef(null);
  const restoreFocusRef = useRef(false);
  const introVisible = phase !== "done";

  const finishNow = () => {
    restoreFocusRef.current = introRef.current?.contains(document.activeElement) ?? false;
    setPhase("done");
  };

  useEffect(() => {
    if (!introVisible) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [introVisible]);

  useEffect(() => {
    if (phase !== "active") return undefined;

    markSessionIntroSeen();
    introRef.current?.querySelector("button")?.focus({ preventScroll: true });

    let active = true;
    let minimumDone = false;
    let fontsDone = false;
    const finishWhenReady = () => {
      if (active && minimumDone && fontsDone) setPhase("leaving");
    };
    const minimumTimer = window.setTimeout(() => {
      minimumDone = true;
      finishWhenReady();
    }, SESSION_INTRO_MIN_DURATION_MS);
    const maximumTimer = window.setTimeout(() => setPhase("leaving"), SESSION_INTRO_MAX_DURATION_MS);

    Promise.resolve(document.fonts?.ready).catch(() => undefined).then(() => {
      fontsDone = true;
      finishWhenReady();
    });

    const onKeyDown = (event) => {
      if (event.key === "Escape") finishNow();
    };
    const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      if (motionPreference.matches) finishNow();
    };
    window.addEventListener("keydown", onKeyDown);
    motionPreference?.addEventListener("change", onMotionChange);

    return () => {
      active = false;
      window.clearTimeout(minimumTimer);
      window.clearTimeout(maximumTimer);
      window.removeEventListener("keydown", onKeyDown);
      motionPreference?.removeEventListener("change", onMotionChange);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return undefined;
    const exitTimer = window.setTimeout(finishNow, SESSION_INTRO_EXIT_DURATION_MS);
    return () => window.clearTimeout(exitTimer);
  }, [phase]);

  useEffect(() => {
    if (phase === "done" && restoreFocusRef.current) {
      document.getElementById("main-content")?.focus({ preventScroll: true });
      restoreFocusRef.current = false;
    }
  }, [phase]);

  return {
    phase,
    introRef,
    skip: finishNow,
  };
}

export function PortfolioIntro({ phase, introRef, onSkip }) {
  if (phase === "done") return null;

  return (
    <div className={`portfolio-intro portfolio-intro--${phase}`} ref={introRef} role="dialog" aria-modal="true" aria-label="Portfolio introduction">
      <div className="portfolio-intro__top">
        <div className="portfolio-intro__mark"><strong>AM</strong><span>/</span><span>26</span></div>
        <span className="portfolio-intro__edition">ARDIAN MEHAJ · PORTFOLIO</span>
        <button className="portfolio-intro__skip" type="button" onClick={onSkip}>Skip intro <span aria-hidden="true">↗</span></button>
      </div>

      <div className="portfolio-intro__center">
        <div className="portfolio-intro__copy">
          <p className="portfolio-intro__eyebrow">FROM IDEA TO WORKING SOFTWARE</p>
          <p className="portfolio-intro__headline"><span>Frame.</span><span>Build.</span><span>Verify.</span></p>
        </div>
        <div className="portfolio-intro__art" aria-hidden="true">
          <div className="portfolio-intro__axis portfolio-intro__axis--horizontal" />
          <div className="portfolio-intro__axis portfolio-intro__axis--vertical" />
          <div className="portfolio-intro__plane portfolio-intro__plane--blue" />
          <div className="portfolio-intro__plane portfolio-intro__plane--orange" />
          <div className="portfolio-intro__plane portfolio-intro__plane--paper"><span>IDEA</span><span>SOFTWARE</span></div>
        </div>
      </div>

      <div className="portfolio-intro__bottom">
        <div className="portfolio-intro__progress"><span /></div>
        <p role="status">Opening portfolio</p>
        <span>BRUSSELS, BELGIUM</span>
      </div>
    </div>
  );
}
