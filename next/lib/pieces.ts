/* ============================================================
   pieces.ts: what a reading section has in it, out of D1.

   This is `aab/pieces.js` asked on the server instead of in the
   browser. The browser's copy merges the database with the list
   in `content.js`, because for a year some pieces were committed
   files with no row. That half is gone: every live piece is a row
   as of 15 August 2026 (TRANSITION.md Stage 3), so a hub rendered
   here asks the database and nothing else.

   ---- what happens when the database is not there ----

   `piecesIn()` returns null rather than an empty array, and the
   two are drawn differently on purpose. Empty means "this section
   has nothing in it yet", which is a true sentence. Null means
   "the list could not be read", which is a different true
   sentence, and printing the first one for the second is how a
   page quietly tells a reader that the writing was deleted.

   Rule 8 of TRANSITION.md, one level down: the hub still renders,
   with its hero, its prose and its links. It is a smaller page,
   not a broken one.
   ============================================================ */

import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isSection, lookFor, type Article } from "@reiad/shared/look";

/** One card's worth of a piece. The same shape `aab/pieces.js`
    hands its callers, minus the `from` field, which said which of
    the two stores answered and now has only one answer. */
export type Piece = {
  slug: string;
  title: string;
  dek: string;
  tag: string;
  topics: string[];
  lang: string;
  minutes: number;
  section: string;
  date: string;
  url: string;
};

type Row = Pick<Article,
  "slug" | "title" | "dek" | "tag" | "topics" | "lang" | "minutes"
  | "section" | "published_at" | "updated_at">;

/* Newest first, and anything undated last: "" sorts below every
   real date under a descending compare, which is where a piece
   with no published_at belongs on a page about writing. */
const newestFirst = (a: Piece, b: Piece) => b.date.localeCompare(a.date);

/** Which mount a row is served at. An unknown section comes from a
    row written before sections existed, and Insights is where
    those pieces went, which is what `findSection()` says in the
    browser and what the article route already assumes. */
const sectionOf = (row: Row) =>
  isSection(row.section) ? row.section : "insights";

const asPiece = (row: Row): Piece => {
  const section = sectionOf(row);
  return {
    slug: row.slug,
    title: row.title,
    dek: row.dek ?? "",
    tag: row.tag ?? "",
    topics: (row.topics ?? "").split("|").filter(Boolean),
    lang: row.lang || "en",
    minutes: row.minutes ?? 1,
    section,
    date: (row.published_at || row.updated_at || "").slice(0, 10),
    /* Never built by hand. The whole reason a piece carries its
       section around is that this is the only line that turns one
       into an address, which is the bug `pieceUrl()` exists for:
       three places built `/insights/<slug>.html` whatever section
       the piece was in, and a kitchen piece got a card pointing at
       a 404. */
    url: `${lookFor(section).mount}${row.slug}.html`,
  };
};

/** Every live piece, newest first, or null if the database could
    not be asked. Memoised per request: the page needs the list and
    so does its metadata, and that would otherwise be two queries. */
const livePieces = cache(async (): Promise<Piece[] | null> => {
  try {
    const { env } = getCloudflareContext();
    const db = (env as { DB?: D1Database }).DB;
    if (!db) return null;

    const { results } = await db
      .prepare(
        `SELECT slug, title, dek, tag, topics, lang, minutes, section,
                published_at, updated_at
           FROM articles WHERE status = 'live'`
      )
      .all<Row>();

    return (results ?? []).map(asPiece).sort(newestFirst);
  } catch {
    return null;
  }
});

/** The live pieces of one section, newest first, or null when the
    database did not answer. */
export async function piecesIn(section: string): Promise<Piece[] | null> {
  const all = await livePieces();
  return all && all.filter((piece) => piece.section === section);
}
