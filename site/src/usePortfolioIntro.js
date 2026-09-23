import { useEffect, useRef, useState } from "react";
import {
  PORTFOLIO_INTRO_EXIT_DURATION_MS,
  PORTFOLIO_INTRO_MAX_DURATION_MS,
  PORTFOLIO_INTRO_MIN_DURATION_MS,
  shouldShowPortfolioIntro,
} from "./portfolioIntroState.js";

export function usePortfolioIntro() {
  const [phase, setPhase] = useState(() => shouldShowPortfolioIntro() ? "active" : "done");
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
    }, PORTFOLIO_INTRO_MIN_DURATION_MS);
    const maximumTimer = window.setTimeout(() => setPhase("leaving"), PORTFOLIO_INTRO_MAX_DURATION_MS);

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
    const exitTimer = window.setTimeout(finishNow, PORTFOLIO_INTRO_EXIT_DURATION_MS);
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
