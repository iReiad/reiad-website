/** What everything downstream reads, whichever store answered.

    Six fields are optional because a FILE entry may carry none of
    them: `fromFile` spreads a `FilePiece` and overrides four
    things, where `fromRow` fills every column with a default.
    Widening them to required here would be a claim about the
    manifest that the manifest does not make. */
export interface Piece {
    slug: string;
    title: string;
    /** A Bangla piece's English title, for the palette. Manifest
        entries only: the database has no such column. */
    en?: string;
    dek?: string;
    tag?: string;
    topics: string[];
    lang: string;
    minutes?: number;
    status?: string;
    note?: string;
    section: string;
    date: string;
    cover?: string;
    from: "database" | "file";
}
/**
 * Every live piece the site has, database first: a slug in the
 * database wins, because publishing through the Studio is how a
 * file piece gets taken over. An unreachable database is not an
 * error, it is a fallback to `content.js`.
 */
export declare function allPieces(): Promise<Piece[]>;
/** Where a piece can be read. Never build this by hand: the whole
    point of carrying `section` around is that this is the only
    line that turns a piece into an address. */
export declare const pieceHref: (piece: Piece) => string;
