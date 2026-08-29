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
/** What the card is about, beside the photograph.

    All of it optional, because two callers built one from a
    `Cover` alone for a year and a card with no words on it is
    still a better card than a section's standing one. */
export interface CardWords {
    title?: string;
    /** The tag, in the mono face above the title. */
    kicker?: string;
    /** Which desk it is on: `insights`, `cooking`, `travel`. The
        card takes that section's own colour, so a kitchen piece
        shares as rose and a travel piece as plum.
  
        Resolved out of the RAIL rather than out of a table here,
        and that is the point. `shared/nav.ts` is the one place a
        section's colour is written down, the rail renders every
        section with that colour inline on the link, and this page
        has a rail on it: reading it is reading the one table
        through the markup it already produced. A copy of six
        colours in this file would be the failure CLAUDE.md opens
        with, and putting `nav.ts` on the wire as a served module to
        carry a hue would cost a module, a precache entry and a
        service worker bump.
  
        Falls back to the site's own green, which is what a piece on
        a desk the rail does not list should share as anyway. */
    section?: string;
    /** The token directly, for anything that already has it and
        for a caller with no rail to read. */
    accent?: string;
}
/**
 * Draw the card: a 1200x630 JPEG.
 *
 * `src` has to be a path this site serves. The bytes are read back
 * through fetch, so a `data:` URL works too and somebody else's
 * URL will not. An empty `src` is allowed and means a card with
 * no photograph on it, which is a card this site can now draw for
 * every piece rather than only for the illustrated ones.
 */
export declare function shareCardBlob({ src, focus }: {
    src: string;
    focus?: Focus;
}, words?: CardWords): Promise<Blob>;
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
