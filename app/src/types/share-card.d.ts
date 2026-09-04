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
    /** Which desk it is on. The card takes that section's colour,
        resolved out of the RAIL rather than a table here:
        `shared/nav.ts` is the one place a section's colour is
        written down and the rail renders it inline on every link.
        Falls back to the site's own green. */
    section?: string;
    /** The token directly, for anything that already has it and
        for a caller with no rail to read. */
    accent?: string;
    /** A stable identifier for this piece: a slug, a lesson id.
        What the composition is derived from, so the same piece is
        the same card every time it is drawn and two pieces are
        never the same card. */
    seed?: string;
}
/** The nine tokens the twelve drawings and six walls between them
    actually name. Asserted against the strings by
    `scripts/check-art.ts`, so a drawing that reaches for a tenth
    fails a check rather than rendering that shape in black. */
export declare const ART_TOKENS: readonly ["lit", "hot", "mid", "deep", "shade", "sink", "fore-hot", "fore-lit", "fore-mid"];
/**
 * Draw the card: a 1200x630 JPEG. `src` has to be a path this
 * site serves (a `data:` URL works, somebody else's URL will
 * not), and an empty one means a card with no photograph.
 */
export declare function shareCardBlob({ src, focus }: {
    src: string;
    focus?: Focus;
}, words?: CardWords, 
/** The drawing this piece wears, as the inside of an `<svg>`,
    and the wall behind it. Both optional: a card without them
    is the room with nothing standing in it, which is what a
    caller that cannot reach `/api/admin/art` gets and is still
    a card. `drawingFor()` below is what fetches them. */
drawing?: {
    subject?: string;
    motif?: string;
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
/** What the endpoint answers with. */
interface ArtTable {
    subjects: Record<string, string>;
    motifs: Record<string, string>;
    motifOf: Record<string, string>;
}
/** The drawings, once per page. Null on any failure, including
    not being an admin, and every caller treats null as "the room
    with nothing in it" rather than as an error: a card is worth
    having either way. */
export declare function artTable(): Promise<ArtTable | null>;
/** The subject and its wall, by name. */
export declare function drawingFor(subject: string): Promise<{
    subject?: string;
    motif?: string;
}>;
/** What a PIECE wears, in one request. The choice is
    `shared/art.ts`'s and is made in the WORKER: a browser bundle
    cannot import that file, and a second copy of the rule here
    would be two hubs drawing different cards for one row. Every
    failure is `{}`, which the card reads as an empty room.
    Not cached: a caller drawing forty cards should use
    `artTable()` and `drawingFor()` instead. */
export declare function drawingForPiece(src: {
    id?: string;
    section?: string;
    title?: string;
    tags?: Array<string | undefined>;
}): Promise<{
    subject?: string;
    motif?: string;
}>;
export {};
