import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const diffSource = await readFile(new URL('../public/projects/skill-studio/line-diff.js', import.meta.url), 'utf8');
const diffContext = {};
vm.runInNewContext(diffSource, diffContext);
const createLineDiff = diffContext.SkillStudioLineDiff;

test('aligns a single inserted line without reporting unchanged neighbors', () => {
  assert.equal(createLineDiff('alpha\nbeta\ngamma', 'alpha\ninserted\nbeta\ngamma'), '+ inserted');
});

test('aligns a deletion and repeated lines', () => {
  assert.equal(createLineDiff('a\nx\na\nb', 'a\na\nb'), '- x');
  assert.equal(createLineDiff('same\nsame\nend', 'same\nnew\nsame\nend'), '+ new');
});

test('shows replacements and bounds oversized inputs', () => {
  assert.equal(createLineDiff('before\nkeep\nafter', 'afterward\nkeep\nafter'), '- before\n+ afterward');
  assert.match(createLineDiff('a'.repeat(100001), 'b'.repeat(100001)), /200,000 character limit/);
  assert.match(createLineDiff(Array(2001).fill('a').join('\n'), Array(2001).fill('b').join('\n')), /4,000 line limit/);
  const largeMiddle = Array.from({ length: 600 }, (_, i) => `old-${i}`).join('\n');
  const largeReplacement = Array.from({ length: 600 }, (_, i) => `new-${i}`).join('\n');
  assert.ok(createLineDiff(largeMiddle, largeReplacement).length < 20000);
});

test('bounds large diffs while preserving both replacement sides and exact omitted counts', () => {
  const countLines = output => output.split('\n');
  const count = (lines, prefix) => lines.filter(line => line.startsWith(prefix)).length;

  const old600 = Array.from({ length: 600 }, (_, i) => `old-${i}`);
  const new600 = Array.from({ length: 600 }, (_, i) => `new-${i}`);
  const fallback = countLines(createLineDiff(old600.join('\n'), new600.join('\n')));
  assert.equal(count(fallback, '- '), 250);
  assert.equal(count(fallback, '+ '), 250);
  assert.equal(fallback.at(-1), '… 700 more diff lines omitted.');
  assert.equal(fallback.length, 501);

  const oneAdded = countLines(createLineDiff(old600.join('\n'), 'new-only'));
  assert.equal(count(oneAdded, '- '), 499);
  assert.equal(count(oneAdded, '+ '), 1);
  assert.equal(oneAdded.at(-1), '… 101 more diff lines omitted.');
  assert.equal(oneAdded.length, 501);

  const deletionOnly = countLines(createLineDiff(`${old600.join('\n')}\n`, ''));
  assert.equal(count(deletionOnly, '- '), 500);
  assert.equal(count(deletionOnly, '+ '), 0);
  assert.equal(deletionOnly.at(-1), '… 100 more diff lines omitted.');

  const additionOnly = countLines(createLineDiff('', `${new600.join('\n')}\n`));
  assert.equal(count(additionOnly, '- '), 0);
  assert.equal(count(additionOnly, '+ '), 500);
  assert.equal(additionOnly.at(-1), '… 100 more diff lines omitted.');
});

test('any edit withdraws the prepared response and reload restores the original state', async () => {
  class Element {
    value = ''; textContent = ''; listeners = {}; classes = new Set();
    classList = { toggle: (name, on) => on ? this.classes.add(name) : this.classes.delete(name) };
    addEventListener(name, cb) { this.listeners[name] = cb; }
    focus() {}
    click() { this.clicked = true; }
  }
  const elements = Object.fromEntries(['#skill-editor', '#diff-output', '#correspondence', '.prepared-output', '#load-example', '#export-example'].map(key => [key, new Element()]));
  const ctx = { window: { SkillStudioLineDiff: createLineDiff, setTimeout() {} }, document: { querySelector: selector => elements[selector], createElement: () => new Element() }, Blob, URL: { createObjectURL: () => '', revokeObjectURL() {} } };
  const source = await readFile(new URL('../public/projects/skill-studio/demo.js', import.meta.url), 'utf8');
  vm.runInNewContext(source, ctx);
  const prepared = elements['.prepared-output'];
  assert.equal(prepared.classes.has('invalid'), false);
  elements['#skill-editor'].value += '\nNew line';
  elements['#skill-editor'].listeners.input();
  assert.equal(prepared.classes.has('invalid'), true);
  assert.match(elements['#correspondence'].textContent, /withdrawn/);
  elements['#load-example'].listeners.click();
  assert.equal(prepared.classes.has('invalid'), false);
  assert.match(elements['#diff-output'].textContent, /No local changes/);
});
