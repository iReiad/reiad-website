/* ============================================================
   drafts.ts: what is on this device.

   IndexedDB, because photos blow past localStorage's 5 MB before
   the second one is pasted. Every call is wrapped so that a
   browser in private mode, or one with storage disabled, or one
   that has run out of quota, returns undefined rather than
   throwing: a draft that cannot be saved is a shame, and a Studio
   that will not open is a catastrophe.

   Drafts used to share one record under the literal key
   "current", which meant exactly one piece could be in progress
   at a time and starting a second silently destroyed the first.
   They are keyed by id now, and the id travels with the piece.
   ============================================================ */

import type { Fields } from "./piece.ts";

const DB_NAME = "reiad-studio";
const STORE = "drafts";

export interface Draft {
  id: string;
  savedAt: number;
  slug: string | null;
  section: string | null;
  notionPageId: string | null;
  topics: string[];
  html: string;
  fields: Partial<Fields> & { tag?: string };
}

function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idb<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | undefined> {
  try {
    const conn = await db();
    return await new Promise<T | undefined>((resolve, reject) => {
      const tx = conn.transaction(STORE, mode);
      const req = fn(tx.objectStore(STORE));
      tx.oncomplete = () => resolve((req as IDBRequest<T>)?.result);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return undefined;   // private mode, quota, disabled storage: never fatal
  }
}

export const newDraftId = () =>
  `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const putDraft = (draft: Draft) =>
  idb("readwrite", (store) => store.put(draft, draft.id));

export const dropDraft = (id: string) =>
  idb("readwrite", (store) => store.delete(id));

export async function listDrafts(): Promise<Draft[]> {
  const rows = await idb<Draft[]>("readonly", (store) => store.getAll());
  return (rows ?? [])
    .filter((d) => d?.id)
    .sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
}

/** The most recent draft, and a one-time move of the old single
    "current" record into the new keyed shape. */
export async function latestDraft(): Promise<Draft | null> {
  const legacy = await idb<Draft>("readonly", (store) => store.get("current"));
  if (legacy && !legacy.id) {
    legacy.id = newDraftId();
    await idb("readwrite", (store) => store.put(legacy, legacy.id));
    await idb("readwrite", (store) => store.delete("current"));
  }
  const [latest] = await listDrafts();
  return latest ?? null;
}
