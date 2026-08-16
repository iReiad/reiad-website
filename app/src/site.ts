/* ============================================================
   site.ts: what this app borrows from the site.

   One import list, so that "what does the desk depend on outside
   itself" is a question with a file for an answer rather than
   something you find out by grepping nine components. The shapes
   are in `site-modules.d.ts` next door; this is only the door.

   Nothing is re-implemented here and nothing should be. Every one
   of these is loaded by other pages of this site already, is in
   the service worker's precache list already, and is left external
   by `vite.config.ts` so the browser resolves it at runtime. A
   copy inside this bundle would be a second answer to the same
   question, and the two would drift.
   ============================================================ */

export { toast, copyText } from "/app.js";
export { uploadMedia } from "/api.js";
export { SECTIONS, findSection, pieceUrl, livePieces, searchIndex } from "/content.js";
export type { Section, FilePiece } from "/content.js";
export { shareCardBlob, coverFromHTML, cardSlug, isDrawnCard } from "/share-card.js";
export type { Cover } from "/share-card.js";
export { hostPhotosIn, isHosted } from "/photo.js";
