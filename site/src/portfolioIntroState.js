export const PORTFOLIO_INTRO_MIN_DURATION_MS = 2450;
export const PORTFOLIO_INTRO_MAX_DURATION_MS = 3300;
export const PORTFOLIO_INTRO_EXIT_DURATION_MS = 640;

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

export function shouldShowPortfolioIntro({
  reducedMotion = browserPrefersReducedMotion(),
  browserWindow = typeof window === "undefined" ? null : window,
} = {}) {
  return Boolean(browserWindow && !reducedMotion);
}
