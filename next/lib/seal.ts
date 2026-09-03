/* ============================================================
   lib/seal.ts: a participant's name and contact, sealed in the
   browser. RESEARCH.md section 15.

   AES-GCM under a key derived from a passphrase the reader holds
   and the site never sees (PBKDF2, 200 000 rounds, a fresh salt and
   nonce each time), so a leaked database is a list of pseudonyms.
   The same shape the broker key uses on the Worker, one floor
   down: `functions/_lib/broker.ts`. What is stored is
   `v1.<salt>.<iv>.<ciphertext>`, each base64.
   ============================================================ */

const enc = new TextEncoder();
const dec = new TextDecoder();

const b64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes));
const unb64 = (s: string): Uint8Array => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function keyOf(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 200000, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"],
  );
}

export async function seal(passphrase: string, plain: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyOf(passphrase, salt);
  const bytes = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, enc.encode(plain)));
  return `v1.${b64(salt)}.${b64(iv)}.${b64(bytes)}`;
}

/** The text back, or null for the wrong passphrase: a wrong key
    fails the tag check, which is the whole point of GCM. */
export async function unseal(passphrase: string, sealed: string): Promise<string | null> {
  const [v, salt, iv, bytes] = sealed.split(".");
  if (v !== "v1" || !salt || !iv || !bytes) return null;
  try {
    const key = await keyOf(passphrase, unb64(salt));
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(iv) as BufferSource }, key, unb64(bytes) as BufferSource);
    return dec.decode(plain);
  } catch { return null; }
}
