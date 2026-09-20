import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { bundle } from '../scripts/build-contract-demo.mjs';
import { examplePair } from '../public/projects/api-contract-guard/examples.js';

test('browser comparison matches the original engine on fresh documents', async t => {
  const temp = await mkdtemp(join(tmpdir(), 'acg-browser-parity-'));
  try {
    await bundle('contract-demo/compare.ts', join(temp, 'browser.mjs'));
    await build({ entryPoints: [fileURLToPath(new URL('../contract-demo/vendor/engine.ts', import.meta.url))],
      bundle: true, platform: 'node', format: 'esm', outfile: join(temp, 'original.mjs'),
      banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" } });
    const browser = await import(pathToFileURL(join(temp, 'browser.mjs')));
    const original = await import(pathToFileURL(join(temp, 'original.mjs')));
    let n = 0;
    async function parity(pair, expected, rule) {
      const root = join(temp, String(n++)); await mkdir(root);
      await writeFile(join(root, 'baseline.yaml'), pair.baseline);
      await writeFile(join(root, 'candidate.yaml'), pair.candidate);
      const real = await original.compareWithFileSystem({ root, baseline: 'baseline.yaml', candidate: 'candidate.yaml', outDir: 'report' },
        await import('node:fs/promises'));
      const actual = await browser.compare(pair.baseline, pair.candidate);
      // Compare all fields, warnings, pointers and exact input fingerprints.
      assert.deepEqual(actual, real);
      assert.equal(actual.exitCode, expected);
      if (rule) assert.ok(actual.report.findings.some(f => f.ruleId === rule));
      return actual;
    }
    for (const [name, rule] of Object.entries({ removed:'OPERATION_REMOVED', parameter:'REQUIRED_PARAMETER_ADDED', response:'RESPONSE_REQUIRED_PROPERTY_REMOVED', request:'REQUEST_REQUIRED_PROPERTY_ADDED', enum:'ENUM_VALUE_REMOVED' })) {
      await t.test(name, () => parity(examplePair(name), 2, rule));
    }
    await t.test('no supported change', () => parity(examplePair('same'), 0));
    await t.test('new input changes paths and pointers, not just a prepared report', async () => {
      const pair = examplePair('removed'); pair.baseline = pair.baseline.replaceAll('/orders', '/invoices~2026');
      const result = await parity(pair, 2);
      assert.equal(result.report.findings[0].path, '/invoices~2026');
      assert.match(result.report.findings[0].pointer, /invoices~02026/);
    });
    await t.test('invalid YAML fails closed', () => parity({ ...examplePair('same'), candidate: '[broken' }, 3));
    await t.test('duplicate YAML keys fail closed', () => parity({ ...examplePair('same'), candidate: 'openapi: 3.0.3\npaths: {}\npaths: {}' }, 3));
    await t.test('unsupported schema does not become a clean result', async () => {
      const pair = examplePair('response'); pair.candidate = pair.candidate.replace('"type": "object"', '"oneOf": [{"type":"string"}]');
      await parity(pair, 3);
    });
    await t.test('malicious HTML remains text in the report', async () => {
      const pair = examplePair('parameter'); pair.candidate = pair.candidate.replace('region', '<img src=x onerror=alert(1)>');
      const result = await parity(pair, 2); assert.match(result.report.findings[0].message, /<img/);
      const ui = await readFile(new URL('../public/projects/api-contract-guard/interactive.js', import.meta.url), 'utf8');
      assert.doesNotMatch(ui, /innerHTML|insertAdjacentHTML/);
    });
    await t.test('internal references preserve upstream behavior', async () => {
      const pair = examplePair('response');
      for (const key of ['baseline', 'candidate']) {
        const doc = JSON.parse(pair[key]); const response = doc.paths['/orders'].get.responses['200'];
        doc.components = { schemas: { Order: response.content['application/json'].schema } };
        response.content['application/json'].schema = { $ref: '#/components/schemas/Order' };
        pair[key] = JSON.stringify(doc);
      }
      await parity(pair, 2);
    });
    await t.test('network references refused without fetch', async () => {
      const pair = examplePair('response'); const doc = JSON.parse(pair.candidate);
      doc.paths['/orders'].get.responses['200'].content['application/json'].schema = { $ref: 'https://example.com/schema.json' };
      await parity({ ...pair, candidate: JSON.stringify(doc) }, 3);
    });
    await t.test('browser input limit is explicit', async () => {
      const result = await browser.compare(' '.repeat(200001), '{}');
      assert.deepEqual(result, { exitCode: 3, errorCode: 'INPUT_LIMIT' });
    });
    await t.test('source files are byte-identical to the pinned upstream snapshot', async () => {
      const manifest = JSON.parse(await readFile(new URL('../contract-demo/upstream.json', import.meta.url), 'utf8'));
      for (const [name, hash] of Object.entries(manifest.files)) {
        const bytes = await readFile(new URL(`../contract-demo/vendor/${name}`, import.meta.url));
        assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, name);
      }
    });
  } finally { await rm(temp, { recursive: true, force: true }); }
});
