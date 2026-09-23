import assert from "node:assert/strict";
import test from "node:test";
import {
  PORTFOLIO_INTRO_MIN_DURATION_MS,
  shouldShowPortfolioIntro,
} from "../src/portfolioIntroState.js";

test("shows the introduction on every full load, even after a prior session view", () => {
  const browserWindow = {
    location: { hash: "#work", search: "?from=contact" },
    get sessionStorage() { throw new Error("storage should not control replay"); },
  };

  assert.equal(shouldShowPortfolioIntro({ browserWindow, reducedMotion: false }), true);
  assert.ok(PORTFOLIO_INTRO_MIN_DURATION_MS >= 2000);
});

test("skips the introduction for reduced motion and server rendering", () => {
  assert.equal(shouldShowPortfolioIntro({ browserWindow: {}, reducedMotion: true }), false);
  assert.equal(shouldShowPortfolioIntro({ browserWindow: null, reducedMotion: false }), false);
});
