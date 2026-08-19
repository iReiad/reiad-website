/* ============================================================
   pieces.ts: what has been written, wherever it is kept.

   THE SPLIT THIS CLOSES

   A piece of writing on this site exists as a committed HTML file
   with an entry in content.js, or as a row in D1 written by the
   Studio, or both. At its own URL that is settled: the worker
   serves the row if there is one and falls back to the file.

   The lists that point AT the URL were another matter. The
   Insights page merged the database in; the kitchen and travel
   hubs did not, so a piece published through the Studio into the
   kitchen was readable at its address and invisible on the one
   page a reader would use to find it. The counts came from
   content.js, so a hub could say one number and show another. And
   three separate places built the link as `/insights/<slug>.html`
   whatever section the piece was actually in, which is a card
   pointing at a 404.

   One question, one answer, one place. Everything that lists
   writing calls this file, and the shape it returns is the same
   whichever store the piece came from.

   archive/TRANSITION.md, Stage 1.
   ============================================================ */
import { SECTIONS, findSection, livePieces, pieceUrl } from "/content.js";
import { getArticles } from "/api.js";
const fromRow = (row) => ({
    slug: row.slug,
    title: row.title,
    dek: row.dek ?? "",
    tag: row.tag ?? "",
    topics: row.topics ?? [],
    lang: row.lang ?? "en",
    minutes: row.minutes ?? 1,
    status: row.status ?? "live",
    section: findSection(row.section).id,
    date: (row.published_at ?? row.updated_at ?? "").slice(0, 10),
    cover: row.cover ?? "",
    from: "database",
});
const fromFile = (entry, section) => ({
    ...entry,
    topics: entry.topics ?? [],
    lang: entry.lang ?? section.lang,
    section: section.id,
    date: entry.date ?? "",
    from: "file",
});
/** Newest first. Anything without a date sorts last, which is
    where a piece with no date belongs on a page about writing. */
const newestFirst = (a, b) => String(b.date ?? "").localeCompare(String(a.date ?? ""));
/* ---------- the list ----------

   Fetched once per page load. `getArticles()` in api.js already
   caches its promise, so several lists on one page share a single
   request, and a page with no lists makes none. */
let merged;
/**
 * Every live piece the site has, database first.
 *
 * A slug in the database wins: publishing through the Studio is
 * how a file piece gets taken over, and the row is the newer of
 * the two by definition.
 *
 * The database being unreachable is not an error here. It is a
 * site that falls back to exactly what it did before any of this
 * existed, which is the whole reason content.js still holds the
 * pieces at all.
 */
export function allPieces() {
    merged ??= (async () => {
        const rows = ((await getArticles()) ?? []);
        const live = rows.filter((row) => (row.status ?? "live") === "live").map(fromRow);
        const known = new Set(live.map((p) => p.slug));
        const files = SECTIONS.flatMap((section) => livePieces(section)
            .map((entry) => fromFile(entry, section))
            .filter((p) => !known.has(p.slug)));
        return [...live, ...files].sort(newestFirst);
    })();
    return merged;
}
/** Where a piece can be read. Never build this by hand: the whole
    point of carrying `section` around is that this is the only
    line that turns a piece into an address. */
export const pieceHref = (piece) => pieceUrl(findSection(piece.section), piece.slug);
/* `piecesIn()` and `filePieces()` were here and are gone with
   `#article-cards`, which was the only caller of either. Every
   list of writing on this site is rendered on the server now:
   `next/lib/hub.ts` for the three hubs, `next/lib/pieces.ts` for
   the home page. What is left here is the two things a BROWSER
   still needs, and both are the palette's: every live piece, and
   the one line that turns a piece into an address. */
