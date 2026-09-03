/* ============================================================
   offline-files.ts: a source's file kept on THIS device.

   RESEARCH.md section 11, "kept offline, by choice". The bytes go
   into IndexedDB rather than the Cache API because a cache entry
   is keyed by a URL and the reader fetches these through a
   thirty-minute ticket, so the same file has a new URL every half
   hour; the R2 key is the stable name and IndexedDB can be keyed
   by it. The service worker precaches nothing of the studio's.

   What is here is a fact about this machine and must not sync:
   `shared/storage.ts` says so on the `research-files` row. Every
   call is wrapped, and a throw anywhere (private window, storage
   blocked, quota) is answered as "not available" rather than as
   an error, because the reader's page has to draw either way.
   ============================================================ */

/** The database name is the row in `shared/storage.ts`. */
const DB = "research-files";
const STORE = "files";

export interface KeptFile { key: string; size: number; name: string; type: string; at: string }

interface KeptRow extends KeptFile { bytes: ArrayBuffer }

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      if (typeof indexedDB === "undefined") { resolve(null); return; }
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => { req.result.createObjectStore(STORE, { keyPath: "key" }); };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch { resolve(null); }
  });
}

function done<T>(req: IDBRequest<T>): Promise<T | null> {
  return new Promise((resolve) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

/** Whether this browser can keep a file at all. */
export const canKeep = (): boolean => { try { return typeof indexedDB !== "undefined"; } catch { return false; } };

/** The bytes kept under a key, or null. */
export async function readKept(key: string): Promise<Blob | null> {
  const db = await openDb();
  if (!db) return null;
  try {
    const row = await done(db.transaction(STORE, "readonly").objectStore(STORE).get(key)) as KeptRow | null | undefined;
    db.close();
    return row?.bytes ? new Blob([row.bytes], { type: row.type }) : null;
  } catch { return null; }
}

/** The file stored, whole. False where it could not be. */
export async function keepFile(file: Omit<KeptFile, "at" | "size">, bytes: ArrayBuffer): Promise<boolean> {
  const db = await openDb();
  if (!db) return false;
  try {
    const row: KeptRow = { ...file, size: bytes.byteLength, at: new Date().toISOString(), bytes };
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(row);
    const ok = await new Promise<boolean>((resolve) => { tx.oncomplete = () => resolve(true); tx.onerror = () => resolve(false); tx.onabort = () => resolve(false); });
    db.close();
    return ok;
  } catch { return false; }
}

export async function forgetFile(key: string): Promise<boolean> {
  const db = await openDb();
  if (!db) return false;
  try {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    const ok = await new Promise<boolean>((resolve) => { tx.oncomplete = () => resolve(true); tx.onerror = () => resolve(false); tx.onabort = () => resolve(false); });
    db.close();
    return ok;
  } catch { return false; }
}

/** Every file kept here, without its bytes, newest first. */
export async function listKept(): Promise<KeptFile[]> {
  const db = await openDb();
  if (!db) return [];
  try {
    const all = await done(db.transaction(STORE, "readonly").objectStore(STORE).getAll()) as KeptRow[] | null;
    db.close();
    return (all ?? []).map(({ bytes: _bytes, ...rest }) => rest).sort((a, b) => b.at.localeCompare(a.at));
  } catch { return []; }
}
