/* ============================================================
   seen.ts: what arrived since you last looked.

   A queue of forty questions where three are new is a different
   thing from a queue of forty. The desk stamps the clock when the
   page is closed and marks anything newer than that stamp on the
   next visit, which costs one number in localStorage and is the
   whole feature.

   Deliberately not per-item: nothing is recorded about which
   question was read, only when the desk was last open. There is
   one person using this page.
   ============================================================ */

const KEY = "desk-last-seen";

/* Read once, at load. Reading it per row would mean the stamp
   written on the way out could change what is marked new on the
   way in, which is exactly backwards. */
let lastSeen = 0;
try {
  lastSeen = Number(localStorage.getItem(KEY)) || 0;
} catch {
  /* private mode: nothing is new, which is the safe way to be wrong */
  lastSeen = Date.now();
}

export const isNew = (iso: string | null | undefined): boolean =>
  Boolean(iso) && Date.parse(iso as string) > lastSeen;

export const markSeen = (): void => {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* fine: the badge is a nicety, not a record */
  }
};
