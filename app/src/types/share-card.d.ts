/* `/share-card.js`, the picture a pasted link shows. See
   ./README.md.

   The card is drawn, not borrowed: a 1200x630 JPEG made from the
   piece's lead photo, cropped around the part the writer marked.
   It is a JPEG because the scrapers behind WhatsApp, Facebook and
   LinkedIn will not read the WebP every photo here is stored as. */

/** Which photo a card should be drawn from, and where to crop it.

    `own` is false when the piece has no photo of its own, in which
    case the section's standing card is the right answer and
    nothing should be drawn. `lead` says the photo was the marked
    lead rather than merely the first one found. */
export interface Cover {
  src: string;
  focus: string;
  own: boolean;
  lead: boolean;
}

export function shareCardBlob(cover: Cover): Promise<Blob>;
export function coverFromHTML(html: string): Cover;

/** Where a piece's drawn card lives in R2, derived from its slug. */
export function cardSlug(slug: string): string;

/** True for a card this site drew, false for a raw photo pointed
    at by `og:image`, which is the failure the desk flags. */
export function isDrawnCard(url: string): boolean;
