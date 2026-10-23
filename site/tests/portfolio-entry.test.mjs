import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { build } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const compiled = await build({
  entryPoints: [fileURLToPath(new URL("../src/App.jsx", import.meta.url))],
  bundle: true,
  packages: "external",
  platform: "node",
  format: "cjs",
  jsx: "automatic",
  write: false,
});
const compiledModule = { exports: {} };
new Function("require", "module", "exports", compiled.outputFiles[0].text)(
  createRequire(import.meta.url), compiledModule, compiledModule.exports,
);
const html = renderToStaticMarkup(React.createElement(compiledModule.exports.App));

test("initial page exposes content and actions without an intro gate", () => {
  assert.match(html, /Working software\./);
  assert.match(html, /View my CV/);
  assert.match(html, /mailto:mehajardian@gmail.com/);
  assert.doesNotMatch(html, /\binert(?:=|\s|>)/);
  assert.doesNotMatch(html, /role="dialog"|portfolio-intro/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
});

test("project shortcuts lead to demos while implementation detail stays optional", () => {
  const shortcuts = html.match(/<nav[^>]+aria-label="Selected projects"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(shortcuts);
  for (const slug of ["api-contract-guard", "toolcall-replay", "entity-resolution-workbench"]) {
    assert.ok(shortcuts.includes(`href="/projects/${slug}/"`));
  }
  assert.equal((html.match(/<details class="project-checks">/g) ?? []).length, 3);
  assert.equal((html.match(/<summary>Design, role and validation<\/summary>/g) ?? []).length, 3);
  assert.match(html, /AI assistance/);
  assert.match(html, /Entity Resolution calculates a simple pair score/);
  assert.doesNotMatch(html, /ToolCall Replay and Entity Resolution show prepared/);
});
