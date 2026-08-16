export declare const SHARE_W = 1200;
export declare const SHARE_H = 630;
/** Where to crop a photo that does not fit, in the writer's own
    words. The same three values the figure toolbar sets as a
    class on the figure. */
export type Focus = "top" | "bottom" | "centre";
/** Which photo a card should be drawn from, and where to crop it.

    `own` is false when the piece has no photo of its own, in which
    case the section's standing card is the right answer and
    nothing should be drawn. `lead` says the photo was the marked
    lead rather than merely the first one found. */
export interface Cover {
    src: string;
    focus: Focus;
    own: boolean;
    lead: boolean;
}
/**
 * Draw the card: a 1200x630 JPEG.
 *
 * `src` has to be a path this site serves. The bytes are read back
 * through fetch, so a `data:` URL works too and somebody else's
 * URL will not.
 */
export declare function shareCardBlob({ src, focus }: {
    src: string;
    focus?: Focus;
}): Promise<Blob>;
/**
 * The photo a card should be made from, out of an article body.
 *
 * The lead photo if one is marked, otherwise the first photo,
 * otherwise nothing, and the caller decides what nothing means: in
 * the Studio it means the section's own card.
 */
export declare function coverFromDocument(doc: Document): Cover;
export declare const coverFromHTML: (html: unknown) => Cover;
/** Where a drawn card is kept, so one can be told from a raw photo
    long after it was made. uploadMedia() puts it under this slug. */
export declare const cardSlug: (slug: string) => string;
/** Is this cover a card this code drew? Anything else is a photo
    of unknown shape, in a format half the scrapers refuse. */
export declare const isDrawnCard: (url: string | null | undefined) => boolean;
export declare const cardShape: (url: string | null | undefined) => {
    type: string;
    sized: boolean;
};
