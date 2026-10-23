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
    this.hidden = false;
  }
  set textContent(value) { this.text = String(value); this.children = []; }
  get textContent() { return this.text + this.children.map((child) => typeof child === "string" ? child : child.textContent).join(""); }
  append(...children) { for (const child of children) if (child && typeof child === "object") child.parentNode = this; this.children.push(...children); }
  replaceChildren(...children) { this.text = ""; this.children = [...children]; }
  addEventListener(type, callback) {
    const callbacks = this.listeners.get(type) ?? [];
    callbacks.push(callback);
    this.listeners.set(type, callbacks);
  }
  dispatch(type) { for (const callback of this.listeners.get(type) ?? []) callback({ target: this }); }
  remove() {
    if (this.parentNode) this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
    this.parentNode = null;
  }
  click() { this.clickedParent = this.parentNode; }
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
globalThis.document.body = new FakeElement("body");
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

test("report download clicks an attached hidden link and delays object URL cleanup", () => {
  const run = elements.get("contract-run");
  const download = elements.get("contract-download");
  const baseline = elements.get("contract-baseline");
  const live = elements.get("contract-live");
  const originalURL = globalThis.URL;
  const originalWindow = globalThis.window;
  const originalCreateElement = globalThis.document.createElement;
  const links = [];
  const released = [];
  const deferred = [];
  globalThis.URL = {
    createObjectURL(blob) {
      assert.equal(blob.type, "application/json");
      return "blob:api-contract-report";
    },
    revokeObjectURL(url) { released.push(url); },
  };
  globalThis.window = { setTimeout(callback, delay) { deferred.push({ callback, delay }); return deferred.length; } };
  globalThis.document.createElement = (tag) => { const link = new FakeElement(tag); links.push(link); return link; };
  try {
    run.dispatch("click");
    workers.at(-1).onmessage({ data: resultFor("downloadable result") });
    download.dispatch("click");

    const [link] = links.filter((candidate) => candidate.download === "api-contract-report.json");
    assert.ok(link);
    assert.equal(link.hidden, true);
    assert.equal(link.download, "api-contract-report.json");
    assert.equal(link.clickedParent, globalThis.document.body);
    assert.equal(link.parentNode, null);
    assert.deepEqual(released, []);
    assert.equal(deferred.length, 1);
    assert.equal(deferred[0].delay, 60_000);
    assert.equal(live.textContent, "Supported breaking changes detected");

    deferred[0].callback();
    assert.deepEqual(released, ["blob:api-contract-report"]);

    baseline.value += " ";
    baseline.dispatch("input");
    download.dispatch("click");
    assert.equal(links.filter((candidate) => candidate.download === "api-contract-report.json").length, 1);
    assert.match(live.textContent, /Inputs changed/);

    run.dispatch("click");
    workers.at(-1).onmessage({ data: resultFor("fallback report") });
    globalThis.URL.createObjectURL = () => { throw new Error("blocked by browser"); };
    download.dispatch("click");
    assert.equal(live.textContent, "Could not start the JSON download. Open the computed JSON report below to copy it.");
    assert.match(elements.get("contract-output").textContent, /fallback report/);
    assert.equal(links.filter((candidate) => candidate.download === "api-contract-report.json").length, 1);
  } finally {
    globalThis.URL = originalURL;
    globalThis.window = originalWindow;
    globalThis.document.createElement = originalCreateElement;
  }
});
