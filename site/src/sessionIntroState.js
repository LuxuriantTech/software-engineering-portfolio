export const SESSION_INTRO_MAX_DURATION_MS = 2900;

export function browserPrefersReducedMotion(
  browserWindow = typeof window === "undefined" ? null : window,
) {
  if (!browserWindow || typeof browserWindow.matchMedia !== "function") return true;

  try {
    return browserWindow.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

export function shouldShowSessionIntro({
  reducedMotion = browserPrefersReducedMotion(),
} = {}) {
  return !reducedMotion;
}
