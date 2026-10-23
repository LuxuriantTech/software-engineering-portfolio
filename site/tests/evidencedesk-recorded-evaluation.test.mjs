import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderEvaluation, validateEvaluation, loadRecordedEvaluation } from '../public/projects/evidencedesk/recorded-evaluation.js';

const page = await readFile(new URL('../public/projects/evidencedesk/index.html', import.meta.url), 'utf8');

// Synthetic test fixture only. These values are not measurements or public evaluation results.
function fixture() {
  const result = (status, answer, excerpt) => ({ status, answer, citations: excerpt ? [{ document_name: 'sample-contract.txt', page: 2, excerpt }] : [] });
  return {
    evaluation: {
      id: 'synthetic-test', scope: 'Synthetic test corpus', baseline_commit: '1234567', candidate_commit: 'abcdef0',
      verdict: 'test only', note: 'Fixture data for unit tests, not measured results.',
      links: [
        { label: 'Repository', url: 'https://github.com/LuxuriantTech/evidencedesk' },
        { label: 'Unsafe', url: 'javascript:alert(1)' },
      ],
    },
    metrics: {
      baseline: { answerable_correct: 1, answerable_total: 2, abstention_correct: 1, abstention_total: 2, citation_precision: 0.5, citation_recall: 0.25 },
      candidate: { answerable_correct: 2, answerable_total: 2, abstention_correct: 2, abstention_total: 2, citation_precision: 1, citation_recall: 0.75 },
    },
    cases: [
      { id: 'case-1', question: 'Which fee is recorded?', kind: 'answerable', baseline: result('wrong', 'The fee was €1.', 'The recorded fee was €2.'), candidate: result('correct', 'The fee was €2.', 'The recorded fee was €2.') },
      { id: 'case-2', question: 'What is the secret?', kind: 'unanswerable', baseline: result('answered', 'Not in the text.', ''), candidate: result('abstained', 'No supporting passage.', '') },
    ],
  };
}

class FakeElement {
  constructor(tag = 'div') { this.tagName = tag.toUpperCase(); this.children = []; this.listeners = {}; this.hidden = false; this.value = ''; }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return [this._text ?? '', ...this.children.map((child) => child.textContent ?? '')].join(''); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
}

function harness() {
  const selectors = ['#follow-up-status', '#follow-up-content', '#follow-up-summary', '#follow-up-metrics', '#follow-up-case', '#follow-up-case-output', '#follow-up-links'];
  const elements = Object.fromEntries(selectors.map((selector) => [selector, new FakeElement(selector === '#follow-up-case' ? 'select' : 'div')]));
  Object.assign(elements, {
    status: elements['#follow-up-status'], content: elements['#follow-up-content'], summary: elements['#follow-up-summary'],
    metrics: elements['#follow-up-metrics'], selector: elements['#follow-up-case'], caseOutput: elements['#follow-up-case-output'], links: elements['#follow-up-links'],
  });
  const document = {
    location: { href: 'https://portfolio.test/projects/evidencedesk/' },
    querySelector: (selector) => elements[selector],
    createElement: (tag) => new FakeElement(tag),
    createTextNode: (text) => ({ textContent: String(text), nodeType: 3 }),
  };
  return { document, elements };
}

test('places an explicitly pending recorded comparison before the unchanged historical v7 result', async () => {
  const section = page.indexOf('id="follow-up-evaluation"');
  const historic = page.indexOf('A concrete frozen v7 error');
  assert.ok(section >= 0 && section < historic);
  assert.match(page, /Recorded evaluation; no live model or backend call/i);
  assert.match(page, /synthetic corpus/i);
  assert.match(page, /36%/);
  assert.match(page, /9\/25 correct/);
  assert.doesNotMatch(page, /Recorded data format/);
  const source = await readFile(new URL('../public/projects/evidencedesk/recorded-evaluation.js', import.meta.url), 'utf8');
  assert.match(source, /\.\/evaluation-followup\.json/);
});

test('renders before/after metrics, selected case, citations and only approved links', () => {
  const { document, elements } = harness();
  assert.equal(renderEvaluation({ data: fixture(), document, elements }), true);
  assert.equal(elements['#follow-up-content'].hidden, false);
  assert.match(elements['#follow-up-metrics'].textContent, /Baseline: 1\/2 \(50%\)/);
  assert.match(elements['#follow-up-metrics'].textContent, /Candidate: 2\/2 \(100%\)/);
  assert.match(elements['#follow-up-case-output'].textContent, /Which fee is recorded\?/);
  assert.match(elements['#follow-up-case-output'].textContent, /The recorded fee was €2\./);
  assert.equal(elements['#follow-up-links'].children.length, 1);
  elements['#follow-up-case'].value = 'case-2';
  elements['#follow-up-case'].listeners.change();
  assert.match(elements['#follow-up-case-output'].textContent, /What is the secret\?/);
  assert.match(elements['#follow-up-case-output'].textContent, /No cited sources recorded/);
});

test('rejects missing or malformed structure without revealing a result', () => {
  assert.equal(validateEvaluation(null), false);
  const invalid = fixture();
  invalid.metrics.candidate.citation_precision = 1.5;
  assert.equal(validateEvaluation(invalid), false);
  const { document, elements } = harness();
  assert.equal(renderEvaluation({ data: null, document, elements }), false);
  assert.equal(elements['#follow-up-content'].hidden, true);
  assert.match(elements['#follow-up-status'].textContent, /invalid format/i);
});

test('missing JSON reports pending state with no synthetic fallback', async () => {
  const { document, elements } = harness();
  const result = await loadRecordedEvaluation({ document, fetchImpl: async () => ({ ok: false }) });
  assert.equal(result, false);
  assert.equal(elements['#follow-up-content'].hidden, true);
  assert.match(elements['#follow-up-status'].textContent, /not available yet/i);
  assert.equal(elements['#follow-up-metrics'].children.length, 0);
});

test('untrusted question and citation text remain literal text, not parsed markup', () => {
  const data = fixture();
  data.cases[0].question = '<img src=x onerror=alert(1)>';
  data.cases[0].candidate.answer = '<script>alert(1)</script>';
  data.cases[0].candidate.citations[0].excerpt = '<b>untrusted passage</b>';
  const { document, elements } = harness();
  renderEvaluation({ data, document, elements });
  const descendants = [];
  const visit = (element) => { descendants.push(element); for (const child of element.children ?? []) if (child instanceof FakeElement) visit(child); };
  visit(elements['#follow-up-case-output']);
  assert.equal(descendants.some((element) => ['IMG', 'SCRIPT', 'B'].includes(element.tagName)), false);
  assert.match(elements['#follow-up-case-output'].textContent, /<script>alert\(1\)<\/script>/);
});

test('empty cases render a clear state and citations can be empty', () => {
  const data = fixture();
  data.cases = [];
  const { document, elements } = harness();
  assert.equal(renderEvaluation({ data, document, elements }), true);
  assert.match(elements['#follow-up-case-output'].textContent, /No cases were included/);
});
