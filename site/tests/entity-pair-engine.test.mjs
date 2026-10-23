import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePair, DEFAULT_RECORDS, normalizeText, PairInputError } from '../public/projects/entity-resolution-workbench/entity-pair-engine.js';
import { mountEntityWorkbench } from '../public/projects/entity-resolution-workbench/workbench.js';

const pair = (left = DEFAULT_RECORDS.left, right = DEFAULT_RECORDS.right, threshold = '0.86') =>
  calculatePair(left, right, threshold);

test('the default pair exposes component scores and a weighted similarity separately from its threshold result', () => {
  const result = pair();
  assert.deepEqual(result.components.map(({ key }) => key), ['name', 'brand', 'sku', 'price']);
  assert.equal(result.components.find(({ key }) => key === 'name').score, 1);
  assert.equal(result.components.find(({ key }) => key === 'brand').score, 1);
  assert.equal(result.components.find(({ key }) => key === 'sku').score, 0);
  assert.ok(Math.abs(result.score - 0.735915) < 0.00002);
  assert.equal(result.aboveThreshold, false);
  assert.equal(result.threshold, 0.86);
  assert.equal('decision' in result, false);
  assert.ok(result.reasons.some((reason) => reason.includes('SKUs differ')));
});

test('changing the threshold changes only the threshold comparison, not field scores or SKU contradiction', () => {
  const lower = pair(undefined, undefined, '0.73');
  const higher = pair(undefined, undefined, '0.74');
  assert.equal(lower.aboveThreshold, true);
  assert.equal(higher.aboveThreshold, false);
  assert.equal(lower.score, higher.score);
  assert.deepEqual(lower.reasons, higher.reasons);
  assert.equal(lower.components.find(({ key }) => key === 'sku').score, 0);
});

test('a threshold equal to the score is reported as at or above', () => {
  const exact = { name: 'Harbor Desk Lamp', brand: 'Harbor', sku: 'HBL8', price: '69.00' };
  const result = pair(exact, exact, '1');
  assert.equal(result.score, 1);
  assert.equal(result.aboveThreshold, true);
});

test('missing fields are excluded and the remaining weights are renormalized', () => {
  const left = { name: 'Café table', brand: '', sku: '', price: '' };
  const right = { name: 'Cafe table', brand: '', sku: '', price: '' };
  const result = pair(left, right, '1');
  assert.equal(result.score, 1);
  assert.deepEqual(result.components.map(({ key }) => key), ['name']);
  assert.equal(result.skipped.length, 3);
  assert.equal(result.aboveThreshold, true);
});

test('normalization folds accents, case and punctuation into word tokens', () => {
  assert.equal(normalizeText('  CAFÉ—TABLE_02 '), 'cafe table 02');
});

test('the price distance score stays bounded and reaches zero outside its documented 20% range', () => {
  const left = { name: 'lamp', brand: '', sku: '', price: '100.00' };
  const samePrice = pair(left, { ...left, price: '100.00' });
  const distantPrice = pair(left, { ...left, price: '125.00' });
  assert.equal(samePrice.components.find(({ key }) => key === 'price').score, 1);
  assert.equal(distantPrice.components.find(({ key }) => key === 'price').score, 0);
  assert.ok(distantPrice.score >= 0 && distantPrice.score <= 1);
});

test('uncomparable records produce a recoverable input error instead of a fabricated zero score', () => {
  assert.throws(
    () => pair({ name: 'lamp', brand: '', sku: '', price: '' }, { name: '', brand: 'harbor', sku: '', price: '' }),
    (error) => error instanceof PairInputError && /at least one field on both sides/u.test(error.message),
  );
});

test('the uncomparable-pair error panel is visible when it receives keyboard focus', () => {
  class Element {
    constructor() {
      this.hidden = false;
      this.value = '';
      this.listeners = new Map();
      this.children = [];
      this.attributes = new Map();
    }
    addEventListener(type, handler) { this.listeners.set(type, handler); }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
    setAttribute(name, value) { this.attributes.set(name, value); }
    removeAttribute(name) { this.attributes.delete(name); }
    focus() { this.focusedWhileVisible = !this.hidden; }
  }

  const elements = new Map();
  const getElement = (id) => {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  };
  const document = {
    getElementById: getElement,
    createElement: () => new Element(),
  };

  getElement('entity-error').hidden = true;
  getElement('record-a-name').value = 'Lamp';
  getElement('record-b-sku').value = 'L-1';
  getElement('entity-threshold').value = '0.86';
  getElement('entity-live');
  mountEntityWorkbench(document);

  getElement('entity-workbench-form').listeners.get('submit')({ preventDefault() {} });

  assert.equal(getElement('entity-error').hidden, false);
  assert.equal(getElement('entity-error').focusedWhileVisible, true);
});

test('invalid prices identify the exact field for inline recovery', () => {
  for (const price of ['-1', '1,25', '$4.20', '1e2', '1.234', '12345678901']) {
    assert.throws(
      () => pair({ ...DEFAULT_RECORDS.left, price }, DEFAULT_RECORDS.right),
      (error) => error instanceof PairInputError && error.fields.some(({ field }) => field === 'record-a-price'),
      `expected ${price} to be rejected`,
    );
  }
});

test('blank, non-decimal, excess precision and out-of-range thresholds are rejected', () => {
  for (const threshold of ['', 'NaN', 'Infinity', '-0.01', '1.01', '0.001', '1.001']) {
    assert.throws(
      () => pair(undefined, undefined, threshold),
      (error) => error instanceof PairInputError && error.fields.some(({ field }) => field === 'entity-threshold'),
      `expected ${threshold || '<blank>'} to be rejected`,
    );
  }
});
