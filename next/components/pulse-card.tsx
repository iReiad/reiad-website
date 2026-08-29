"use client";

/* ============================================================
   pulse-card.tsx: the writing, one piece at a time.

   A card on the front page that cycles through the latest live
   pieces: title, a line of the dek, which desk it came from, and
   the whole card is a link to the piece it is showing. Every few
   seconds it moves to the next one, with the dots underneath
   saying where in the list it is.

   ---- it is the site's own card, not a card of its own ----

   This was `.gate-tile` wearing a photograph as its whole ground,
   with light text over it: a form nothing else on the site used,
   for a thing (a piece of writing) that `/insights` already draws
   as a `<GoCard>`. It is a `<GoCard>` here too now, with its
   picture across the top, so a piece looks like itself on the
   front page, on the reading hub and anywhere else it is listed.

   ---- and the picture is the piece's own where there is one ----

   A cover is the share card the Studio draws from the piece's
   lead photo, so nothing is borrowed and nothing needs crediting:
   the row in D1 is the source, exactly as it is for the title.
   `coverOf` accepts only the two path shapes `safeCover` on the
   server writes, because that value becomes a request and this
   card should never be the thing that makes an odd one.

   Where a piece has no cover it wears its DESK's drawing, which
   is the same drawing that desk's own card wears everywhere else.

   ---- what it does when it cannot ----

   The list comes from /api/articles after hydration. Until it
   arrives, and wherever it never does (the database not bound, a
   bad connection, a test rig with no Worker), the card is a
   plain door to /insights that says what Insights is. The
   server renders exactly that fallback, so a reader with no
   JavaScript keeps a working card and hydration adopts it
   unchanged.

   ---- and when it should not ----

   The cycle pauses while the pointer is over the card (nobody
   wants a link that changes under their finger), stops entirely
   for a reader who asked for reduced motion, and does not tick
   in a hidden tab.
   ============================================================ */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { NAV, accentFor } from "@reiad/shared/nav";
import type { ArtSubject } from "./card-art";
import { GoCard } from "./deck";
import { Icon } from "./icons";

type Piece = {
  slug: string; title: string; dek: string;
  section: string; lang: string; minutes: number;
  cover?: string | null;
};

const SECTION_WORDS: Record<string, string> = {
  insights: "Insights", cooking: "রান্না", travel: "ভ্রমণ",
};

const SWAP_MS = 7000;

/* The same shape the server enforces before a cover is stored.
   Checked again here because the value becomes a request. */
const coverOf = (piece: Piece | null | undefined): string | undefined => {
  const path = piece?.cover ?? "";
  return /^\/(media|og)\/[A-Za-z0-9._/-]+$/.test(path) ? path : undefined;
};

/** The desk's own drawing, out of `shared/nav.ts` by section
    rather than a table here: a piece on the kitchen desk gets the
    kitchen's pan, which is the drawing the kitchen's own card
    wears on the board and on `/skills`. */
const deskArt = (section: string | undefined): ArtSubject | undefined =>
  NAV.flatMap((g) => g.items).find((i) => i.key === section)?.art;

/** The rotating card, and beside it, at the board's `tall` size,
    the next few pieces as cards of the same kind.

    `limit` is how many pieces the widget SHOWS at once: 1 is the
    card alone, rotating through six; more is the card plus the
    others, which is what makes `tall` a different drawing rather
    than the same one stretched. */
export function PulseCard({ limit = 1 }: { limit?: number } = {}) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [at, setAt] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/articles", {
          signal: AbortSignal.timeout(8000),
        });
        const data = await res.json() as { ok?: boolean; articles?: Piece[] };
        if (!alive || !data?.ok || !Array.isArray(data.articles)) return;
        setPieces(data.articles.slice(0, 6));
      } catch { /* the fallback card stays, and it is a real door */ }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (pieces.length < 2) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tick = setInterval(() => {
      if (paused.current || document.hidden) return;
      setAt((n) => (n + 1) % pieces.length);
    }, SWAP_MS);
    return () => clearInterval(tick);
  }, [pieces.length]);

  const piece = pieces[at] ?? null;
  const rest = pieces.slice(0, limit).filter((_, i) => i !== at);

  if (limit > 1) {
    return (
      /* The showing piece BESIDE the others on a laptop, which is
         what earns the size its name. The second column exists
         only once there are pieces to fill it: the server renders
         none, so the fallback card keeps the whole row rather
         than sitting beside a dead one. */
      <div className={`grid gap-[var(--gap)]${
        pieces.length > 1 ? " lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)]" : ""}`}>
        <Showing piece={piece} pieces={pieces} at={at} paused={paused} />
        {rest.length ? (
          <div className="deck pulse-rest">
            {rest.map((p) => <PieceCard key={p.slug} piece={p} compact />)}
            <a className="gp-all mono" href="/insights" lang="bn">
              সবগুলো দেখুন <Icon name="arrow" size={13} />
            </a>
          </div>
        ) : null}
      </div>
    );
  }
  return <Showing piece={piece} pieces={pieces} at={at} paused={paused} />;
}

/** One piece, as the card this site draws a piece with. */
function PieceCard({ piece, compact, children }: {
  piece: Piece | null; compact?: boolean; children?: ReactNode;
}) {
  if (!piece) {
    return (
      <GoCard
        href="/insights" icon="pen" art="book"
        accent={accentFor("insights") ?? undefined}
        chip="Insights · পড়া"
        title="Insights, and a market pulse"
        dek={<span lang="bn">লম্বা লেখাগুলো, সাথে বাজারের খবরের স্রোত: সবটা এক জায়গায়।</span>}
        go="Open Insights"
      >{children}</GoCard>
    );
  }
  return (
    <GoCard
      className={compact ? "card-compact" : undefined}
      href={`/${piece.section}/${piece.slug}.html`}
      /* The piece's own photograph first, its desk's drawing
         second. Never both: two pictures on one card is two
         answers to the same question. */
      cover={coverOf(piece)}
      art={coverOf(piece) ? undefined : deskArt(piece.section)}
      icon={compact ? undefined : "pen"}
      /* The colour of whichever piece is showing, out of the one
         table in `shared/nav.ts`: a cooking piece is rose and a
         travel piece plum. It named a colour once, and a kitchen
         piece arrived wearing Insights' colour. */
      accent={accentFor(piece.section) ?? undefined}
      chip={SECTION_WORDS[piece.section] ?? piece.section}
      title={piece.title}
      lang={piece.lang === "bn" ? "bn" : undefined}
      dek={compact ? undefined : piece.dek}
      go="পড়ুন"
    >{children}</GoCard>
  );
}

/** The piece the widget is showing, with the dots under it.

    Keyed on the slug so a swap replaces the card and the entry
    animation in the stylesheet runs again. */
function Showing({ piece, pieces, at, paused }: {
  piece: Piece | null; pieces: Piece[]; at: number; paused: { current: boolean };
}) {
  return (
    <div className="gp-showing"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onFocus={() => { paused.current = true; }}
      onBlur={() => { paused.current = false; }}>
      <div className="gp-piece" key={piece?.slug ?? "none"}>
        <PieceCard piece={piece}>
          {pieces.length > 1 ? (
            <span className="gp-dots" aria-hidden="true">
              {pieces.map((p, i) => (
                <i key={p.slug} data-on={i === at ? "" : undefined} />
              ))}
            </span>
          ) : null}
        </PieceCard>
      </div>
    </div>
  );
}
