import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

class Element {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.attributes = {};
    this.dataset = {};
    this.hidden = false;
    this.value = '';
    this.listeners = {};
    this._text = '';
  }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  setAttribute(name, value) { this.attributes[name] = value; }
  setCustomValidity(value) { this.validationMessage = value; }
  focus() {}
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map((child) => typeof child === 'string' ? child : child.textContent).join(''); }
}

async function renderEntity(threshold) {
  const elements = new Map();
  for (const id of ['entity-select', 'entity-output', 'threshold', 'threshold-error', 'entity-live', 'entity-reset']) {
    elements.set(id, new Element(id));
  }
  elements.get('entity-select').value = 'review';
  elements.get('threshold').value = threshold;
  const document = {
    body: { dataset: { demo: 'entity' } },
    getElementById: (id) => elements.get(id),
    createElement: (tagName) => new Element(tagName),
    addEventListener: (name, callback) => { if (name === 'DOMContentLoaded') callback(); }
  };
  const source = await readFile(new URL('../public/projects/demo.js', import.meta.url), 'utf8');
  vm.runInNewContext(source, { document, Number, String });
  return { output: elements.get('entity-output'), input: elements.get('threshold'), live: elements.get('entity-live') };
}

test('review explanation follows the selected threshold without changing the prepared decision', async () => {
  for (const [threshold, expected] of [['0.50', 'at or above'], ['0.74', 'at or above'], ['0.75', 'below']]) {
    const { output, live } = await renderEntity(threshold);
    assert.match(output.textContent, new RegExp(`Illustrated similarity 0\\.74 is ${expected} the selected explanatory threshold ${Number(threshold).toFixed(2)}\\.`));
    assert.match(output.textContent, /REVIEW: Harbor Desk Lamp/);
    assert.match(live.textContent, /REVIEW/);
    assert.doesNotMatch(output.textContent, /Below the shown explanatory threshold/);
  }
});

test('invalid thresholds do not claim a comparison in either explanation', async () => {
  for (const threshold of ['-1', '1.2', '']) {
    const { output, input } = await renderEntity(threshold);
    assert.match(output.textContent, /No threshold comparison is shown because the selected threshold is invalid\./);
    assert.match(output.textContent, /The threshold is invalid, so no threshold comparison is shown\./);
    assert.equal(input.attributes['aria-invalid'], 'true');
    assert.match(output.textContent, /REVIEW: Harbor Desk Lamp/);
  }
});
