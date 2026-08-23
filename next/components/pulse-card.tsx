"use client";

/* ============================================================
   pulse-card.tsx: the writing, one piece at a time.

   A card on the front page that cycles through the latest live
   pieces: title, a line of the dek, which desk it came from, and
   the whole card is a link to the piece it is showing. Every few
   seconds it moves to the next one, with the dots underneath
   saying where in the list it is.

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

import { useEffect, useRef, useState } from "react";
import { accentStyle } from "@reiad/shared/nav";
import { Icon } from "./icons";

type Piece = {
  slug: string; title: string; dek: string;
  section: string; lang: string; minutes: number;
};

const SECTION_WORDS: Record<string, string> = {
  insights: "Insights", cooking: "রান্না", travel: "ভ্রমণ",
};

const SWAP_MS = 7000;

/** The rotating tile, and under it, at the board's `tall` size,
    the next few pieces as rows.

    `limit` is how many pieces the widget SHOWS at once: 1 is the
    tile alone, rotating through six; more is the tile plus the
    list, which is what makes `tall` a different drawing rather
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
  const href = piece ? `/${piece.section}/${piece.slug}.html` : "/insights";

  if (limit > 1) {
    return (
      <div className="grid gap-2">
        <Tile piece={piece} pieces={pieces} at={at} href={href} paused={paused} />
        <PulseRows pieces={pieces.slice(0, limit)} skip={at} />
      </div>
    );
  }
  return (
    <Tile piece={piece} pieces={pieces} at={at} href={href} paused={paused} />
  );
}

/** The tile itself, shared by both sizes of the widget. */
function Tile({ piece, pieces, at, href, paused }: {
  piece: Piece | null; pieces: Piece[]; at: number; href: string;
  paused: { current: boolean };
}) {
  return (
    <a className="gate-tile min-h-[150px] col-span-2 lg:col-span-6" data-glow="card" href={href}
      /* The colour of whichever piece is showing, not a fixed one.
         This tile cycles between the three reading sections, so a
         cooking piece makes it rose and a travel piece plum, out
         of the one table in shared/nav.ts. It named a colour once and
         so a kitchen piece arrived wearing Insights' colour.

         `accentStyle` returns undefined for a section the rail
         does not list, which leaves the attribute off and lets the
         page's own accent through, rather than writing a colour
         that was already going to apply. */
      style={accentStyle(piece?.section)}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onFocus={() => { paused.current = true; }}
      onBlur={() => { paused.current = false; }}>
      <span className="flex items-center gap-2.5 min-w-0">
        <span className="gt-disc"><Icon name="pen" size={18} /></span>
        <span className="gt-chip mono">
          {piece ? `নতুন লেখা · ${SECTION_WORDS[piece.section] ?? piece.section}` : "Insights · পড়া"}
        </span>
      </span>

      {piece ? (
        /* Keyed on the slug so a swap replaces the block and the
           entry animation in the stylesheet runs again. */
        <span className="gp-piece grid gap-1.5" key={piece.slug}
          lang={piece.lang === "bn" ? "bn" : undefined}>
          <span className="gt-title">{piece.title}</span>
          <span className="gt-dek line-clamp-2">{piece.dek}</span>
        </span>
      ) : (
        <span className="gp-piece grid gap-1.5">
          <span className="gt-title">Insights, and a market pulse</span>
          <span className="gt-dek" lang="bn">লম্বা লেখাগুলো, সাথে বাজারের খবরের
            স্রোত: সবটা এক জায়গায়।</span>
        </span>
      )}

      <span className="mt-auto flex items-center justify-between gap-3">
        <span className="gt-go">{piece ? "পড়ুন" : "Open Insights"}
          <span className="gt-arrow"><Icon name="arrow" size={14} /></span>
        </span>
        {pieces.length > 1 ? (
          <span className="gp-dots" aria-hidden="true">
            {pieces.map((p, i) => (
              <i key={p.slug} data-on={i === at ? "" : undefined} />
            ))}
          </span>
        ) : null}
      </span>
    </a>
  );
}

/* The rest of the tall widget: the pieces the tile is NOT
   showing, as quiet rows. Split from the tile so the wide board
   renders no list markup at all rather than a hidden one. */
function PulseRows({ pieces, skip }: { pieces: Piece[]; skip: number }) {
  const rest = pieces.filter((_, i) => i !== skip);
  if (!rest.length) return null;
  return (
    <ul className="gp-rows">
      {rest.map((p) => (
        <li key={p.slug}>
          <a href={`/${p.section}/${p.slug}.html`}
            lang={p.lang === "bn" ? "bn" : undefined}>
            <span className="truncate">{p.title}</span>
            <Icon name="chevron" size={13} />
          </a>
        </li>
      ))}
    </ul>
  );
}
