import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = new URL("../public/projects/postgres-migration-rehearsal/index.html", import.meta.url);

test("keeps the unavailable historical browser image pinned and names the separate V2 image", async () => {
  const html = await readFile(page, "utf8");

  assert.match(html, /sha256:e4155efc/);
  assert.match(html, /sha256:1a5aa9ff/);
  assert.match(html, /these are different identities/i);
  assert.match(html, /never starts Docker or executes SQL/);
  assert.match(html, /LOW02 also remains open/);
});

test("publishes the exact V2 setup, image checks, run and return commands", async () => {
  const html = await readFile(page, "utf8");

  assert.match(html, /PMR-DEMO-20261022-v2/);
  assert.match(html, /626072c0eac87f0b05c287c51f9cc5f150299c9e/);
  assert.match(html, /uv sync --frozen/);
  assert.match(html, /docker-ce-cli=5:29\.8\.2-1~ubuntu\.24\.04~noble/);
  assert.match(html, /verify_docker_repository_provenance\.py/);
  assert.match(html, /verify_demo_baseline_v2_build\.py/);
  assert.match(html, /rehearse_baseline_v2\.py --preflight-only/);
  assert.match(html, /rehearse_baseline_v2\.py --scenario small-shop/);
  assert.match(html, /tee \/tmp\/pmr-demo-v2-result\.json/);
  assert.match(html, /docker ps -a --filter name=pmr-demo-v2-/);
  assert.match(html, /docker network ls --filter name=pmr-demo-v2-/);
});

test("explains the expected rejection and successful rollback result", async () => {
  const html = await readFile(page, "utf8");

  assert.match(html, /invalid-negative-amount/);
  assert.match(html, /Amount must be a positive whole number of cents/);
  assert.match(html, /before preflight or resource creation/);
  assert.match(html, /LOCAL_REHEARSAL_PASSED/);
  assert.match(html, /cleanup_state: complete/);
  assert.match(html, /owned_resources_remaining: 0/);
  assert.match(html, /historical_phase_b_replayed: false/);
});
