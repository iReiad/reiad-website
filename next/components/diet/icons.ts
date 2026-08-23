/* ============================================================
   diet/icons.ts: one drawing per page of the diet tool.

   Fourteen cards on the front door were fourteen paragraphs in
   one typeface, and the only thing telling them apart was the
   accent rail down the left edge. A reader looking for the
   clinic's numbers read all fourteen titles.

   ---- why this is not in `lib/diet-pages.ts` ----

   It nearly should be, and the house rule about saying the menu
   once is the reason it is worth explaining. `diet-pages.ts` is
   the table the strip, the deck and the sitemap read: it is
   about what a page IS. A glyph is about how a card looks, the
   same way the tone map in `season-note.tsx` is, and the icon
   set itself lives in `components/`.

   THE DRIFT THAT WOULD OTHERWISE FOLLOW IS A CHECK.
   `scripts/check-icons.ts` fails on a page in that table with no
   entry here, and on an entry here naming a drawing that does
   not exist. The second half matters more than it sounds:
   `iconInner()` answers the empty string for a name it does not
   know and `<Icon>` renders a correctly sized `<svg>` with
   nothing inside it, which is not an error and is not visible in
   a diff. Sixteen of those shipped on the money hub once.
   ============================================================ */

/** Keyed by the page's own href, which is what `DIET_PAGES`
    holds and what the deck maps over. */
export const DIET_ICONS: Record<string, string> = {
  "/tools/diet/you": "person",
  "/tools/diet/goal": "signpost",
  "/tools/diet/trend": "compass",
  "/tools/diet/expect": "gauge",
  "/tools/diet/nutrition": "seed",
  "/tools/diet/journal": "book",
  "/tools/diet/recipes": "hand",
  "/tools/diet/keto": "clock",
  "/tools/diet/habits": "check",
  "/tools/diet/foods": "coins",
  "/tools/diet/health": "microscope",
  "/tools/diet/summary": "scroll",
  "/tools/diet/import": "door",
  "/tools/diet/glossary": "magnifier",
  "/tools/diet/year": "calendar",
};

/** Undefined rather than a fallback drawing, because a card with
    no icon is a card with no tile and reads correctly, where a
    wrong icon reads as a different page. */
export const dietIcon = (href: string): string | undefined => DIET_ICONS[href];
