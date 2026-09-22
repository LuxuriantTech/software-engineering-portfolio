export const SESSION_INTRO_MIN_DURATION_MS = 1250;
export const SESSION_INTRO_MAX_DURATION_MS = 2400;
export const SESSION_INTRO_EXIT_DURATION_MS = 480;

const SESSION_INTRO_KEY = "ardian-portfolio-intro-seen";

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
  browserWindow = typeof window === "undefined" ? null : window,
} = {}) {
  if (reducedMotion || !browserWindow || browserWindow.location.hash || browserWindow.location.search) {
    return false;
  }

  try {
    return browserWindow.sessionStorage.getItem(SESSION_INTRO_KEY) !== "yes";
  } catch {
    return true;
  }
}

export function markSessionIntroSeen(browserWindow = typeof window === "undefined" ? null : window) {
  try {
    browserWindow?.sessionStorage.setItem(SESSION_INTRO_KEY, "yes");
  } catch {
    // An unavailable storage API should not prevent the portfolio from opening.
  }
}
