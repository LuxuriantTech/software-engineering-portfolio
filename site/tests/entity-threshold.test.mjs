import test from 'node:test';
import assert from 'node:assert/strict';
import { mountEntityWorkbench } from '../public/projects/entity-resolution-workbench/workbench.js';

class Element {
  constructor(id = '') {
    this.id = id;
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.hidden = false;
    this.value = '';
    this.className = '';
    this._text = '';
  }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = [...children]; this._text = ''; }
  addEventListener(type, callback) { this.listeners[type] = callback; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; }
  focus() { this.focused = true; }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() {
    return this._text + this.children.map((child) => typeof child === 'string' ? child : child.textContent).join('');
  }
  dispatch(type, event = {}) { this.listeners[type]?.({ preventDefault() {}, ...event }); }
}

function createWorkbench() {
  const ids = [
    'entity-workbench-form', 'entity-reset', 'entity-results', 'entity-error', 'entity-live', 'entity-output',
    'record-a-name', 'record-a-brand', 'record-a-sku', 'record-a-price',
    'record-b-name', 'record-b-brand', 'record-b-sku', 'record-b-price', 'entity-threshold',
  ];
  const elements = new Map(ids.map((id) => [id, new Element(id)]));
  const values = {
    'record-a-name': 'Harbor Desk Lamp', 'record-a-brand': 'Harbor', 'record-a-sku': 'HBL8', 'record-a-price': '69.00',
    'record-b-name': 'Harbor Desk Lamp', 'record-b-brand': 'Harbor', 'record-b-sku': 'HBL9', 'record-b-price': '71.00',
    'entity-threshold': '0.86',
  };
  for (const [id, value] of Object.entries(values)) elements.get(id).value = value;
  const document = {
    getElementById: (id) => elements.get(id),
    createElement: (tag) => new Element(tag),
  };
  mountEntityWorkbench(document);
  const submit = () => elements.get('entity-workbench-form').dispatch('submit');
  const edit = (id, value) => {
    elements.get(id).value = value;
    elements.get('entity-workbench-form').dispatch('input');
  };
  return { elements, submit, edit };
}

test('browser result exposes similarity separately and never assigns a Python decision label', () => {
  const { elements, submit } = createWorkbench();
  submit();
  assert.equal(elements.get('entity-results').hidden, false);
  assert.match(elements.get('entity-output').textContent, /Similarity score: 0\.736 of 1\.000/u);
  assert.match(elements.get('entity-output').textContent, /below the selected demonstration threshold/u);
  assert.match(elements.get('entity-output').textContent, /SKUs differ/u);
  assert.doesNotMatch(elements.get('entity-output').textContent, /\bMATCH\b|\bREVIEW\b|\bNO_MATCH\b/u);
});

test('empty and out-of-range thresholds show an error and suppress results', () => {
  for (const threshold of ['', '-0.01', '1.01']) {
    const { elements, edit, submit } = createWorkbench();
    edit('entity-threshold', threshold);
    submit();
    assert.equal(elements.get('entity-results').hidden, true, `results should be hidden for ${threshold || '<blank>'}`);
    assert.equal(elements.get('entity-error').hidden, false);
    assert.equal(elements.get('entity-threshold').attributes['aria-invalid'], 'true');
    assert.match(elements.get('entity-error').textContent, /threshold from 0\.00 to 1\.00 using up to two decimal places/u);
  }
});

test('changing the threshold removes stale output and recalculates only the threshold explanation', () => {
  const { elements, edit, submit } = createWorkbench();
  edit('entity-threshold', '0.73');
  submit();
  const first = elements.get('entity-output').textContent;
  assert.match(first, /Similarity score: 0\.736 of 1\.000/u);
  assert.match(first, /at or above the selected demonstration threshold/u);
  assert.match(first, /SKUs differ/u);

  edit('entity-threshold', '0.74');
  assert.equal(elements.get('entity-results').hidden, true);
  assert.equal(elements.get('entity-output').textContent, '');
  assert.match(elements.get('entity-live').textContent, /previous result or input message was cleared/u);
  submit();
  const second = elements.get('entity-output').textContent;
  assert.match(second, /Similarity score: 0\.736 of 1\.000/u);
  assert.match(second, /below the selected demonstration threshold/u);
  assert.match(second, /SKUs differ/u);
});

test('invalid field is identified and reset restores the example without leaving stale results', () => {
  const { elements, edit, submit } = createWorkbench();
  edit('record-a-price', '$69');
  submit();
  assert.equal(elements.get('entity-results').hidden, true);
  assert.equal(elements.get('record-a-price').attributes['aria-invalid'], 'true');
  assert.match(elements.get('entity-error').textContent, /non-negative price/u);

  edit('record-a-price', '69.00');
  assert.equal(elements.get('entity-error').hidden, true);
  assert.equal(elements.get('record-a-price').attributes['aria-invalid'], undefined);
  assert.match(elements.get('entity-live').textContent, /input message was cleared/u);

  elements.get('entity-reset').dispatch('click');
  assert.equal(elements.get('record-a-price').value, '69.00');
  assert.equal(elements.get('entity-threshold').value, '0.86');
  assert.equal(elements.get('record-a-price').attributes['aria-invalid'], undefined);
  assert.equal(elements.get('entity-error').hidden, true);
  assert.equal(elements.get('entity-results').hidden, true);
  assert.match(elements.get('entity-live').textContent, /Example restored/u);
});
