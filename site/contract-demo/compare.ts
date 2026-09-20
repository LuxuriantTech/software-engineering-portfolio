import { compareWithFileSystem } from './vendor/engine.js';
import { prepareHashes, clearHashes } from './adapters/crypto.js';

export async function compare(baseline: string, candidate: string) {
  if (typeof baseline !== 'string' || typeof candidate !== 'string') return { exitCode: 3, errorCode: 'DOCUMENT_INVALID' };
  if ([baseline, candidate].some(text => new TextEncoder().encode(text).length > 200_000)) {
    return { exitCode: 3, errorCode: 'INPUT_LIMIT' };
  }
  try {
    await prepareHashes([baseline, candidate]);
    const fs = { inputs: new Map([['baseline.yaml', baseline], ['candidate.yaml', candidate]]), outputs: new Map() };
    return await compareWithFileSystem({ root: '/browser', baseline: 'baseline.yaml', candidate: 'candidate.yaml', outDir: 'report' }, fs as never);
  } finally { clearHashes(); }
}
