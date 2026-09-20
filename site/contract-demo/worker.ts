import { compare } from './compare.js';
// A fresh worker handles exactly one comparison; the UI terminates it afterwards.
self.onmessage = async ({ data }) => {
  try { self.postMessage(await compare(data.baseline, data.candidate)); }
  catch { self.postMessage({ exitCode: 3, errorCode: 'INTERNAL_ERROR' }); }
};
