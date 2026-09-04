/* pieces.ts: what has been written, wherever it is kept. A piece
   is a row in D1 or an entry in `content.js`, and everything that
   LISTS writing asks here rather than merging its own: three
   places used to build the link as `/insights/<slug>.html`
   whatever section the piece was in, which is a card pointing at
   a 404. The shape returned is the same whichever store answered. */
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
 * Every live piece the site has, database first: a slug in the
 * database wins, because publishing through the Studio is how a
 * file piece gets taken over. An unreachable database is not an
 * error, it is a fallback to `content.js`.
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
