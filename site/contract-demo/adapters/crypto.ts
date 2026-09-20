// The upstream parser expects synchronous hashing. Hash the two inputs with
// Web Crypto before entering it; never substitute a placeholder digest.
let hashes = new Map<string, string>();
export async function prepareHashes(texts: string[]) {
  hashes = new Map(await Promise.all(texts.map(async text => {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [text, Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('')] as const;
  })));
}
export function clearHashes() { hashes.clear(); }
export function createHash(algorithm: string) {
  if (algorithm !== 'sha256') throw new Error('Unsupported hash');
  return { update(text: string) {
    return { digest(format: string) {
      const hash = hashes.get(text);
      if (format !== 'hex' || hash === undefined) throw new Error('Input not hashed');
      return hash;
    } };
  } };
}
