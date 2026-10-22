import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const content = JSON.parse(readFileSync(new URL("../src/careerContent.json", import.meta.url), "utf8"));

test("English and French CV descriptions match the bounded ToolCall browser demo", () => {
  for (const cv of [content.cv, content.cv_fr]) {
    const detail = cv.projects.find(({ name }) => name === "ToolCall Replay")?.detail;
    assert.ok(detail, "ToolCall Replay project is present");
    const project = cv.projects.find(({ name }) => name === "ToolCall Replay");
    assert.match(project.meta, /JavaScript/);
    assert.match(project.meta, /Python/);
    assert.match(detail, /JSONL/i);
    assert.match(detail, /seven|sept/i);
    assert.match(detail, /browser|web/i);
    assert.match(detail, /no tools or models|aucun outil ni modèle/i);
    assert.match(detail, /local Python|Python local/i);
    assert.doesNotMatch(detail, /prepared results|résultats préparés/i);
  }
});
