// Browser-only I/O boundary. No disk access or claim of filesystem confinement.
import { Fail } from '../vendor/model.js';
export interface FileSystem { inputs: Map<string, string>; outputs: Map<string, string> }
export interface ReservedDirectory { path: string }
const allowed = new Set(['baseline.yaml', 'candidate.yaml']);
export async function prepareRoot(_fs: FileSystem, root: string) {
  if (root !== '/browser') throw new Fail('PATH_INVALID');
  return root;
}
export async function reserveOutputDirectory(_fs: FileSystem, _root: string, out: string) {
  if (out !== 'report') throw new Fail('OUTPUT_INVALID');
  return { path: out };
}
export function inputCacheKey(_root: string, name: string) {
  if (!allowed.has(name)) throw new Fail('REF_INVALID');
  return name;
}
export async function readConfinedFile(fs: FileSystem, root: string, name: string) {
  inputCacheKey(root, name);
  const text = fs.inputs.get(name);
  if (text === undefined) throw new Fail('PATH_INVALID');
  const size = new TextEncoder().encode(text).length;
  if (size > 200_000) throw new Fail('INPUT_LIMIT');
  return { path: name, text, size };
}
export function referenceRelative(): never { throw new Fail('REF_INVALID'); }
export async function publishFile(fs: FileSystem, _output: ReservedDirectory, name: string, content: string) {
  fs.outputs.set(name, content);
}
export async function cleanupReservedOutput(fs: FileSystem) { fs.outputs.clear(); }
