import test from "node:test";
import assert from "node:assert/strict";

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.listeners = new Map();
    this.className = "";
    this.value = "";
    this.text = "";
    this.hidden = false;
    this.open = false;
    this.attributes = new Map();
  }
  set textContent(value) { this.text = String(value); this.children = []; }
  get textContent() { return this.text + this.children.map((child) => child.textContent).join(""); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.text = ""; this.children = [...children]; }
  addEventListener(type, callback) {
    const callbacks = this.listeners.get(type) ?? [];
    callbacks.push(callback);
    this.listeners.set(type, callbacks);
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  dispatch(type) { for (const callback of this.listeners.get(type) ?? []) callback({ target: this }); }
  focus() { this.focused = true; }
  queryAll(tagName) {
    const matches = this.tagName === tagName.toUpperCase() ? [this] : [];
    return matches.concat(...this.children.map((child) => child.queryAll(tagName)));
  }
}

const ids = ["rules-input", "baseline-input", "candidate-input", "tool-output", "tool-error", "tool-live", "event-filter", "toolcall-run", "toolcall-reset"];
const elements = new Map(ids.map((id) => [id, new FakeElement(id.includes("input") || id === "event-filter" ? "input" : "div")]));
globalThis.document = {
  getElementById: (id) => elements.get(id),
  createElement: (tagName) => new FakeElement(tagName),
};

await import("../public/projects/toolcall-replay/toolcall-replay.js?ux-test");

const output = elements.get("tool-output");
const live = elements.get("tool-live");
const error = elements.get("tool-error");
const ruleDetails = () => output.queryAll("details").filter((node) => node.className === "toolcall-rule-details");
const eventDetails = () => output.queryAll("details").filter((node) => node.className === "toolcall-event-details");

test("default render leads with the known verdicts and keeps JSON in disclosures", () => {
  const evaluations = output.children.filter((node) => node.className === "toolcall-result");
  assert.equal(evaluations.length, 2);
  assert.match(evaluations[0].textContent, /PASS · 7\/7 rules passed/);
  assert.match(evaluations[1].textContent, /FAIL · 4\/7 rules passed/);
  assert.match(evaluations[1].textContent, /lookup-scope/);
  assert.match(evaluations[1].textContent, /no-directory-export/);
  assert.match(evaluations[1].textContent, /update-needs-approval/);
  assert.equal(ruleDetails().length, 14);
  assert.equal(ruleDetails().filter((details) => details.open).length, 3);
  assert.equal(eventDetails().length, 10);
  assert.equal(eventDetails().filter((details) => details.open).length, 0);
  const scrollableEvidence = output.queryAll("pre").filter((node) => node.className === "toolcall-evidence");
  assert.equal(scrollableEvidence.length, 24);
  assert.ok(scrollableEvidence.every((node) => node.tabIndex === 0));
  assert.ok(scrollableEvidence.every((node) => node.getAttribute("role") === "region"));
  assert.ok(scrollableEvidence.every((node) => node.getAttribute("aria-label")?.length > 0));
  assert.ok(scrollableEvidence.some((node) => node.getAttribute("aria-label").includes("rule lookup-scope")));
  assert.ok(scrollableEvidence.some((node) => node.getAttribute("aria-label").includes("step 1, tool_call")));
  assert.match(live.textContent, /Baseline PASS; candidate FAIL; 10 matching events shown/);
});

test("filter updates visible trace rows and accessible event count without reevaluation", () => {
  const filter = elements.get("event-filter");
  filter.value = "request.update";
  filter.dispatch("input");
  assert.equal(eventDetails().length, 4);
  assert.match(live.textContent, /4 matching events shown/);
  filter.value = "no-such-event";
  filter.dispatch("input");
  assert.equal(eventDetails().length, 0);
  assert.equal(output.queryAll("p").filter((node) => node.className === "toolcall-empty").length, 2);
  assert.match(live.textContent, /0 matching events shown/);
});

test("editing clears stale results, invalid input exposes an error, and reset restores examples", () => {
  const candidate = elements.get("candidate-input");
  candidate.value = "{";
  candidate.dispatch("input");
  assert.equal(output.children.length, 0);
  assert.match(live.textContent, /Current results cleared/);

  elements.get("toolcall-run").dispatch("click");
  assert.equal(error.hidden, false);
  assert.match(error.textContent, /TRACE_JSON_INVALID/);
  assert.equal(output.children.length, 0);
  assert.match(live.textContent, /No partial result is shown/);

  elements.get("toolcall-reset").dispatch("click");
  assert.equal(elements.get("rules-input").focused, true);
  assert.equal(error.hidden, true);
  assert.equal(output.children.length, 0);
  elements.get("toolcall-run").dispatch("click");
  assert.match(output.textContent, /FAIL · 4\/7 rules passed/);
});
