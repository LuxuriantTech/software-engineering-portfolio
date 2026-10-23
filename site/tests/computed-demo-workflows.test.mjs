import test from "node:test";
import assert from "node:assert/strict";

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.listeners = new Map();
    this.value = "";
    this.text = "";
    this.disabled = false;
  }
  set textContent(value) { this.text = String(value); this.children = []; }
  get textContent() { return this.text + this.children.map((child) => typeof child === "string" ? child : child.textContent).join(""); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.text = ""; this.children = [...children]; }
  addEventListener(type, callback) {
    const callbacks = this.listeners.get(type) ?? [];
    callbacks.push(callback);
    this.listeners.set(type, callbacks);
  }
  dispatch(type) { for (const callback of this.listeners.get(type) ?? []) callback({ target: this }); }
}

const elements = new Map([
  "contract-output", "contract-live", "contract-run", "contract-download", "contract-select", "contract-reset", "contract-baseline", "contract-candidate",
].map((id) => [id, new FakeElement(id.endsWith("baseline") || id.endsWith("candidate") ? "textarea" : "div")]));
elements.get("contract-select").value = "parameter";
const workers = [];
class FakeWorker {
  constructor(url, options) { this.url = url; this.options = options; this.terminated = false; workers.push(this); }
  postMessage(message) { this.message = message; }
  terminate() { this.terminated = true; }
}
globalThis.document = { getElementById: (id) => elements.get(id), createElement: (tag) => new FakeElement(tag) };
globalThis.Worker = FakeWorker;

await import("../public/projects/api-contract-guard/interactive.js?workflow-test");

const resultFor = (message) => ({
  exitCode: 2,
  report: {
    findings: [{ ruleId: "OPERATION_REMOVED", method: "get", path: "/orders", message, pointer: "/paths/~1orders/get" }],
    warnings: [],
    supportedRules: [],
    summary: {},
    disclaimer: "Synthetic browser result.",
  },
});

test("API Contract Guard ignores a response from an earlier worker after inputs change", () => {
  const baseline = elements.get("contract-baseline");
  const candidate = elements.get("contract-candidate");
  const run = elements.get("contract-run");
  const output = elements.get("contract-output");
  const live = elements.get("contract-live");
  const download = elements.get("contract-download");

  run.dispatch("click");
  const staleWorker = workers.at(-1);
  assert.equal(staleWorker.message.baseline, baseline.value);
  assert.equal(staleWorker.message.candidate, candidate.value);
  assert.equal(run.disabled, true);

  candidate.value += "\n ";
  candidate.dispatch("input");
  assert.equal(staleWorker.terminated, true);
  assert.equal(output.children.length, 0);
  assert.equal(download.disabled, true);
  assert.match(live.textContent, /Inputs changed/);

  run.dispatch("click");
  const currentWorker = workers.at(-1);
  staleWorker.onmessage({ data: resultFor("STALE result") });
  assert.equal(output.children.length, 0);
  assert.equal(currentWorker.terminated, false);
  assert.equal(run.disabled, true);

  currentWorker.onmessage({ data: resultFor("CURRENT result") });
  assert.match(output.textContent, /CURRENT result/);
  assert.doesNotMatch(output.textContent, /STALE result/);
  assert.equal(download.disabled, false);
  assert.equal(run.disabled, false);
  assert.match(live.textContent, /Supported breaking changes detected/);

  baseline.value += "\n ";
  baseline.dispatch("input");
  assert.equal(output.children.length, 0);
  assert.equal(download.disabled, true);
  assert.match(live.textContent, /Inputs changed/);
});

test("unsupported outcomes remain explicit and never enable report download", () => {
  const selector = elements.get("contract-select");
  const run = elements.get("contract-run");
  const output = elements.get("contract-output");
  const download = elements.get("contract-download");
  selector.value = "unsupported";
  selector.dispatch("change");
  run.dispatch("click");
  const worker = workers.at(-1);
  worker.onmessage({ data: { exitCode: 3, errorCode: "CAPABILITY_UNSUPPORTED" } });
  assert.match(output.textContent, /Input refused: CAPABILITY_UNSUPPORTED/);
  assert.match(output.textContent, /No report is available/);
  assert.equal(download.disabled, true);
  assert.equal(run.disabled, false);
});

test("worker errors leave a visible refusal and reset reloads the default example", () => {
  const selector = elements.get("contract-select");
  const reset = elements.get("contract-reset");
  const run = elements.get("contract-run");
  const output = elements.get("contract-output");
  const live = elements.get("contract-live");
  const download = elements.get("contract-download");

  run.dispatch("click");
  workers.at(-1).onerror(new Error("worker failed"));
  assert.match(output.textContent, /Input refused: WORKER_UNAVAILABLE/);
  assert.equal(download.disabled, true);
  assert.equal(run.disabled, false);

  selector.value = "removed";
  selector.dispatch("change");
  assert.match(live.textContent, /Example loaded/);
  assert.equal(output.children.length, 0);
  reset.dispatch("click");
  assert.equal(selector.value, "parameter");
  assert.match(live.textContent, /Example loaded/);
  assert.equal(output.children.length, 0);
  assert.equal(download.disabled, true);
});
