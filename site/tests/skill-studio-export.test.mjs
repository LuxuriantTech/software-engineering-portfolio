import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const page = await readFile(new URL('../public/projects/skill-studio/index.html', import.meta.url), 'utf8');
const diffSource = await readFile(new URL('../public/projects/skill-studio/line-diff.js', import.meta.url), 'utf8');
const demoSource = await readFile(new URL('../public/projects/skill-studio/demo.js', import.meta.url), 'utf8');

function createHarness({ failDiff = false, failUrl = false, failClick = false } = {}) {
  const calls = { blobs: [], timers: [], revoked: [], createdLinks: [] };
  class Element {
    value = '';
    textContent = '';
    listeners = {};
    children = [];
    dataset = {};
    parentElement = null;
    hidden = false;
    classList = {
      toggle: (name, on) => on ? this.classes.add(name) : this.classes.delete(name),
    };
    classes = new Set();

    addEventListener(name, callback) { this.listeners[name] = callback; }
    focus() { this.focused = true; }
    append(child) {
      child.parentElement = this;
      this.children.push(child);
    }
    remove() {
      if (!this.parentElement) return;
      this.parentElement.children = this.parentElement.children.filter(child => child !== this);
      this.parentElement = null;
    }
    click() {
      if (this.tagName === 'A') {
        assert.ok(document.body.children.includes(this), 'download anchor is attached while clicked');
        if (failClick) throw new Error('Synthetic browser download failure');
      }
      this.clicked = true;
    }
  }

  const selectors = [
    '#skill-editor', '#diff-output', '#correspondence', '.prepared-output',
    '#load-example', '#export-example', '#editor-status',
  ];
  const elements = Object.fromEntries(selectors.map(selector => [selector, new Element()]));
  const document = {
    body: new Element(),
    querySelector: selector => elements[selector],
    createElement: tagName => {
      const element = new Element();
      element.tagName = tagName.toUpperCase();
      if (tagName.toLowerCase() === 'a') calls.createdLinks.push(element);
      return element;
    },
  };
  class CapturedBlob extends Blob {
    constructor(parts, options) {
      super(parts, options);
      calls.blobs.push(this);
    }
  }
  const URLApi = {
    createObjectURL(blob) {
      if (failUrl) throw new Error('Synthetic object URL failure');
      calls.urlBlob = blob;
      return 'blob:skill-studio-export';
    },
    revokeObjectURL(url) { calls.revoked.push(url); },
  };
  const window = {
    URL: URLApi,
    SkillStudioLineDiff: (before, after) => {
      if (failDiff) throw new Error('Synthetic diff failure');
      return diffContext.SkillStudioLineDiff(before, after);
    },
    setTimeout: (callback, delay) => calls.timers.push({ callback, delay }),
  };
  const diffContext = {};
  vm.runInNewContext(diffSource, diffContext);
  const context = { window, document, Blob: CapturedBlob, URL: URLApi };
  vm.runInNewContext(demoSource, context);
  return { calls, elements, document };
}

test('labels the editor status and exposes reset and Markdown export actions', () => {
  assert.match(page, /<textarea id="skill-editor" aria-describedby="editor-status"/);
  assert.match(page, /id="editor-status" class="editor-status" role="status" aria-live="polite"/);
  assert.match(page, /id="load-example"[^>]*>Reset to original/);
  assert.match(page, /id="export-example"[^>]*>Export Markdown/);
  assert.match(page, /this demo does not run a model/i);
});

test('exports current Unicode text as UTF-8 Markdown and releases the URL after the download click', async () => {
  const { calls, elements, document } = createHarness();
  const editor = elements['#skill-editor'];
  const status = elements['#editor-status'];
  const content = 'Résumé — café\r\n- Проверка\n';
  editor.value = content;
  editor.listeners.input();
  elements['#export-example'].listeners.click();

  assert.equal(calls.blobs.length, 1);
  assert.equal(calls.blobs[0].type, 'text/markdown;charset=utf-8');
  assert.equal(await calls.blobs[0].text(), content);
  assert.equal(calls.urlBlob, calls.blobs[0]);
  assert.equal(calls.createdLinks.length, 1);
  assert.equal(calls.createdLinks[0].download, 'delivery-note-SKILL.md');
  assert.equal(calls.createdLinks[0].hidden, true);
  assert.equal(calls.createdLinks[0].parentElement, null);
  assert.equal(document.body.children.length, 0);
  assert.match(status.textContent, /download started/i);
  assert.equal(calls.timers.length, 1);
  assert.equal(calls.timers[0].delay, 1000);
  calls.timers[0].callback();
  assert.deepEqual(calls.revoked, ['blob:skill-studio-export']);
});

test('empty text stays explicit in the diff and can be exported as an empty Markdown file', async () => {
  const { calls, elements } = createHarness();
  const editor = elements['#skill-editor'];
  editor.value = '';
  editor.listeners.input();

  assert.match(elements['#editor-status'].textContent, /instruction is empty/i);
  assert.match(elements['#diff-output'].textContent, /- ---/);
  elements['#export-example'].listeners.click();

  assert.equal(await calls.blobs[0].text(), '');
  assert.match(elements['#editor-status'].textContent, /empty markdown download started/i);
  assert.equal(calls.timers.length, 1);
});

test('reports diff and download setup failures without losing editor text', () => {
  const diff = createHarness({ failDiff: true });
  diff.elements['#skill-editor'].value = 'Keep this text';
  diff.elements['#skill-editor'].listeners.input();
  assert.equal(diff.elements['#skill-editor'].value, 'Keep this text');
  assert.equal(diff.elements['#diff-output'].textContent, 'Diff unavailable.');
  assert.match(diff.elements['#editor-status'].textContent, /could not be updated/i);

  const urlFailure = createHarness({ failUrl: true });
  const urlEditor = urlFailure.elements['#skill-editor'];
  urlEditor.value = 'Retain Unicode: café';
  urlEditor.listeners.input();
  urlFailure.elements['#export-example'].listeners.click();
  assert.equal(urlEditor.value, 'Retain Unicode: café');
  assert.match(urlFailure.elements['#editor-status'].textContent, /export could not start/i);
  assert.equal(urlFailure.document.body.children.length, 0);
  assert.equal(urlFailure.calls.timers.length, 0);

  const clickFailure = createHarness({ failClick: true });
  clickFailure.elements['#export-example'].listeners.click();
  assert.match(clickFailure.elements['#editor-status'].textContent, /export could not start/i);
  assert.equal(clickFailure.document.body.children.length, 0);
  assert.equal(clickFailure.calls.timers.length, 1);
});

test('reset restores the original instruction, diff, prepared state, and focus', () => {
  const { elements } = createHarness();
  const editor = elements['#skill-editor'];
  editor.value = 'A temporary edit';
  editor.listeners.input();
  assert.equal(elements['.prepared-output'].classes.has('invalid'), true);

  elements['#load-example'].listeners.click();
  assert.equal(editor.value, `---\nname: delivery-note\ndescription: Produce a factual delivery note from supplied validation results.\n---\n\n# Delivery note\n\n## Procedure\n\n1. Identify the supplied change without adding context.\n2. Preserve supplied outcomes and their stated limits.\n3. Separate completed checks from checks that have not been run.\n4. End with the exact sentence: Checks remain to be completed.\n`);
  assert.equal(elements['.prepared-output'].classes.has('invalid'), false);
  assert.equal(elements['#diff-output'].textContent, 'No local changes.');
  assert.equal(editor.focused, true);
  assert.equal(elements['#editor-status'].textContent, '');
});
