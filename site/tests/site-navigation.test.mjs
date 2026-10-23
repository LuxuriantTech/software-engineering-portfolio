import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { build } from "esbuild";

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
const {
  closeMobileMenu,
  dismissMobileMenuOnEscape,
  finalizeDocumentViewerClose,
  nextDocumentTabIndex,
} = compiledModule.exports;

function menuFixture(href = "#work", open = true) {
  const calls = [];
  const summary = { focus: (options) => calls.push(["summary-focus", options]) };
  const details = {
    open,
    querySelector: (selector) => selector === "summary" ? summary : null,
  };
  const trigger = {
    closest: (selector) => selector === "details" ? details : null,
    getAttribute: (name) => name === "href" ? href : null,
  };
  return { calls, details, summary, trigger };
}

test("mobile anchor navigation closes disclosure and transfers focus to its destination", () => {
  const { calls, details, trigger } = menuFixture("#work");
  const section = { focus: (options) => calls.push(["destination-focus", options]) };
  const priorDocument = globalThis.document;
  globalThis.document = { getElementById: (id) => id === "work" ? section : null };
  try {
    assert.equal(closeMobileMenu({ currentTarget: trigger }), true);
  } finally {
    if (priorDocument === undefined) delete globalThis.document;
    else globalThis.document = priorDocument;
  }

  assert.equal(details.open, false);
  assert.deepEqual(calls, [["destination-focus", { preventScroll: true }]]);
});

test("non-navigation menu actions restore focus to the disclosure trigger", () => {
  const { calls, details, trigger } = menuFixture("mailto:person@example.test");

  assert.equal(closeMobileMenu({ currentTarget: trigger }), true);

  assert.equal(details.open, false);
  assert.deepEqual(calls, [["summary-focus", { preventScroll: true }]]);
});

test("Escape closes an open mobile menu and returns focus to its summary", () => {
  const { calls, details } = menuFixture("#work");
  let prevented = false;

  assert.equal(dismissMobileMenuOnEscape({
    currentTarget: details,
    key: "Escape",
    preventDefault: () => { prevented = true; },
  }), true);

  assert.equal(prevented, true);
  assert.equal(details.open, false);
  assert.deepEqual(calls, [["summary-focus", { preventScroll: true }]]);
});

test("unrelated keys leave the mobile disclosure unchanged", () => {
  const { calls, details } = menuFixture();
  let prevented = false;

  assert.equal(dismissMobileMenuOnEscape({
    currentTarget: details,
    key: "Tab",
    preventDefault: () => { prevented = true; },
  }), false);

  assert.equal(prevented, false);
  assert.equal(details.open, true);
  assert.deepEqual(calls, []);
});

test("document tabs wrap with arrows and support Home and End", () => {
  assert.equal(nextDocumentTabIndex("ArrowLeft", 0, 3), 2);
  assert.equal(nextDocumentTabIndex("ArrowRight", 2, 3), 0);
  assert.equal(nextDocumentTabIndex("Home", 2, 3), 0);
  assert.equal(nextDocumentTabIndex("End", 0, 3), 2);
  assert.equal(nextDocumentTabIndex("Tab", 1, 3), null);
  assert.equal(nextDocumentTabIndex("ArrowRight", 3, 3), null);
});

test("document viewer closes before dismissing and restores the opener without scrolling", () => {
  const calls = [];
  const dialog = {
    open: true,
    close() {
      calls.push("dialog-close");
      this.open = false;
    },
  };
  const trigger = { focus: (options) => calls.push(["trigger-focus", options]) };
  const body = { classList: { remove: (name) => calls.push(["body-class-remove", name]) } };

  finalizeDocumentViewerClose(dialog, trigger, () => calls.push("dismiss"), body);

  assert.deepEqual(calls, [
    "dialog-close",
    ["body-class-remove", "document-viewer-open"],
    "dismiss",
    ["trigger-focus", { preventScroll: true }],
  ]);
});
