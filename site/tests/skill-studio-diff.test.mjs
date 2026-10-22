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
