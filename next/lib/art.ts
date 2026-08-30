/* ============================================================
   art.ts: the site's half of the drawing resolver.

   THE RULE MOVED TO `shared/art-of.ts` and this is a re-export.
   It was here, and here is reachable only by the Next Worker,
   which was fine until the share card needed the same answer: a
   card is drawn in a browser, out of a Vite bundle that cannot
   import `shared/` at all, so `/api/admin/art` works it out and
   sends it. Two copies of "which picture does this wear" would
   have been two hubs drawing different cards for the same row.

   Kept as a file rather than deleted because thirty call sites
   name `artOf` at this path, and because the sentence that
   matters is here: everything on this site that draws a card for
   a ROW goes through `artOf`, and everything that draws one for a
   thing the rail LISTS reads `item.art` instead, because that one
   was chosen rather than derived.
   ============================================================ */

export { artOf, subjectOf } from "@reiad/shared/art-of";
export type { ArtSource, ArtSubject } from "@reiad/shared/art";
