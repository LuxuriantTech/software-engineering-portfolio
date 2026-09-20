import { build } from 'esbuild';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const adapters = { name: 'browser-io', setup(builder) {
  builder.onResolve({ filter: /(?:^node:crypto$|\/files\.js$)/ }, args => {
    if (args.path === 'node:crypto') return { path: resolve(root, 'contract-demo/adapters/crypto.ts') };
    if (args.importer.includes('contract-demo') && args.importer.includes('vendor')) return { path: resolve(root, 'contract-demo/adapters/files.ts') };
  });
} };
export async function bundle(entry, outfile, platform = 'browser') {
  return build({ entryPoints: [resolve(root, entry)], outfile: resolve(root, outfile), bundle: true,
    platform, format: 'esm', target: 'es2022', minify: platform === 'browser', plugins: [adapters],
    legalComments: 'eof' });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await bundle('contract-demo/worker.ts', 'public/projects/api-contract-guard/compare-worker.js');
}
