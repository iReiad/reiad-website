"use client";

/* ============================================================
   The newest writing, on the front page.

   ---- why this is not a server read ----

   It was, for about an hour, and the hour was worth it. Reading
   D1 here means `export const dynamic = "force-dynamic"` on `/`,
   and `/` is the one page on this site that was a prerendered
   file: every visit became a Worker render and a query for the
   sake of four card titles being inside the HTML rather than
   arriving 200ms later. It also took `next/interactive.test.ts`
   down with it, silently: that harness serves
   `.next/server/app/index.html` from disk and SKIPS when the file
   is not there, so 217 checks covering every calculator on the
   site reported nothing at all. A test that skips is not a pass.

   So the band fetches, and what it renders before the answer
   arrives is a real door rather than a skeleton: `/insights` is
   where all of this lives, and a reader with no JavaScript keeps
   a working card instead of an empty grid. The server renders
   exactly that door, so hydration adopts it unchanged.

   ---- and it is the site's own card ----

   `<PieceCard>` , which is what `/insights`, `/cooking` and
   `/travel` draw a piece with. A piece looks like itself
   wherever it is listed, which is the rule that made `<GoCard>`
   one component rather than three.
   ============================================================ */

import { useEffect, useState } from "react";
import { PieceCard } from "../cards";
import { GoCard } from "../deck";
import { isSection, lookFor } from "@reiad/shared/look";
import type { Piece } from "../../lib/pieces";

/* What `/api/articles` answers with, which is a row minus its
   body. `Piece` in `next/lib/pieces.ts` is the shape a card
   wants, and the two differ in one field: the endpoint sends
   `published_at` and the card wants `url` and `date`. */
type Row = {
  slug: string; title: string; dek: string; tag: string;
  topics?: string[] | string; lang: string; minutes: number;
  section: string; cover?: string | null;
  published_at?: string; updated_at?: string;
};

/** A row as the card wants it.

    THE ADDRESS IS NEVER BUILT HERE. `lookFor(section).mount` is
    the one line on this site that turns a piece into an address,
    and the comment beside it in `next/lib/pieces.ts` says why:
    three places once built `/insights/<slug>.html` whatever
    section a piece was in, so a kitchen piece got a card pointing
    at a 404. An unknown section is Insights, which is where a
    piece written before sections existed lives.

    `topics` arrives pipe-joined from D1 and as an array from
    anything that has parsed it already, so both are read. */
function asPiece(row: Row): Piece | null {
  if (!row.slug) return null;
  const section = isSection(row.section) ? row.section : "insights";
  const topics = Array.isArray(row.topics)
    ? row.topics
    : String(row.topics ?? "").split("|").filter(Boolean);
  return {
    slug: row.slug, title: row.title, dek: row.dek ?? "", tag: row.tag ?? "",
    topics, lang: row.lang || "en", minutes: row.minutes ?? 1,
    section,
    date: (row.published_at || row.updated_at || "").slice(0, 10),
    url: `${lookFor(section).mount}${row.slug}.html`,
    cover: typeof row.cover === "string" ? row.cover : "",
  };
}

export function LatestWriting({ limit = 4 }: { limit?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/articles", { signal: AbortSignal.timeout(8000) });
        const data = await res.json() as { ok?: boolean; articles?: Row[] };
        if (!alive || !data?.ok || !Array.isArray(data.articles)) return;
        const rows = data.articles.map(asPiece).filter((p): p is Piece => Boolean(p));
        /* Newest first, here rather than trusted from the wire:
           the endpoint's order is its own and this band's whole
           claim is the word "newest". */
        rows.sort((a, b) => b.date.localeCompare(a.date));
        setPieces(rows.slice(0, limit));
      } catch { /* the door stays, and it is a real one */ }
    })();
    return () => { alive = false; };
  }, [limit]);

  if (!pieces.length) {
    return (
      /* ONE CARD IS NOT A ROW OF FOUR, so the grid is one column
         wide here rather than four with three empty. */
      <div className="deck read-deck read-deck-one">
        <GoCard
          href="/insights" art="book" icon="pen" accent="var(--green)"
          chip="Insights" title="Insights, and a market pulse"
          dek="লম্বা লেখাগুলো, সাথে বাজারের খবরের স্রোত: সবটা এক জায়গায়।"
          go="Open Insights"
        />
      </div>
    );
  }

  return (
    <>
      <div className="deck read-deck">
        {pieces.map((piece) => <PieceCard key={piece.slug} piece={piece} />)}
      </div>
      <p className="band-more">
        <a href="/insights">সব লেখা · <span lang="en">Everything written</span> →</a>
      </p>
    </>
  );
}
