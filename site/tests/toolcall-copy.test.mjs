import assert from "node:assert/strict";
import test from "node:test";
import { PROJECTS } from "../src/siteData.js";

test("ToolCall Replay project copy describes the bounded browser demo and separate Python evaluator", () => {
  const project = PROJECTS.find(({ id }) => id === "toolcall-replay");
  assert.ok(project);
  assert.match(project.example, /JSONL/);
  assert.match(project.example, /seven rules/);
  assert.match(project.shortLimit, /The browser evaluates bounded synthetic JSON/);
  assert.match(project.shortLimit, /never executes tools/);
  assert.match(project.works, /separate local Python evaluator/);
  assert.doesNotMatch(project.works, /prepared results/i);
});
