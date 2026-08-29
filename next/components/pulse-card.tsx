"use client";

/* ============================================================
   pulse-card.tsx: the writing, one piece at a time.

   A card on the front page that cycles through the latest live
   pieces: title, a line of the dek, which desk it came from, and
   the whole card is a link to the piece it is showing. Every few
   seconds it moves to the next one, with the dots underneath
   saying where in the list it is.

   ---- the picture is the piece's own ----

   A piece that has a cover carries it here as the tile's whole
   ground, behind a scrim that keeps the title legible. The cover
   is the share card the Studio already draws from the piece's
   lead photo, so nothing is borrowed and nothing needs crediting:
   the row in D1 is the source, exactly as it is for the title.
   `coverOf` accepts only the two path shapes `safeCover` on the
   server writes, because a background URL is a fetch and this
   card should never be the thing that makes an odd one.

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
  cover?: string | null;
};

const SECTION_WORDS: Record<string, string> = {
  insights: "Insights", cooking: "রান্না", travel: "ভ্রমণ",
};

const SWAP_MS = 7000;

/* The same shape the server enforces before a cover is stored.
   Checked again here because the value goes into a url() in an
   inline style, where a stray quote or scheme would be a request
   this site never meant to make. */
const coverOf = (piece: Piece | null | undefined): string | null => {
  const path = piece?.cover ?? "";
  return /^\/(media|og)\/[A-Za-z0-9._/-]+$/.test(path) ? path : null;
};

/** The desk's own picture, for a piece that has no cover of its
    own, drawn by `scripts/build-card-art.ts`.

    A piece without a cover used to leave a tinted card and, in
    the row beside it, an icon in a grey box: two full photographs
    and one empty square reads as a picture that failed to load
    rather than as a quieter card. Now the DESK has a picture, so
    the shelf is always full and a cover is what makes a piece its
    own rather than what makes it visible at all.

    Written out in full, both sizes, because
    `build-card-art.ts --check` reads this file for the literal
    and fails on a drawing that is not on disk. */
const DESK_ART: Record<string, { wide: string; tall: string; thumb: string }> = {
  insights: {
    wide: "/art/insights.webp",
    tall: "/art/insights-tall.webp",
    thumb: "/art/insights-thumb.webp",
  },
  cooking: {
    wide: "/art/cooking.webp",
    tall: "/art/cooking-tall.webp",
    thumb: "/art/cooking-thumb.webp",
  },
  travel: {
    wide: "/art/travel.webp",
    tall: "/art/travel-tall.webp",
    thumb: "/art/travel-thumb.webp",
  },
};

/** What a card shows: the piece's own cover first, the desk's
    drawing second, and null only where the section is one this
    site has no desk for. */
const groundOf = (
  piece: Piece | null | undefined, size: "wide" | "tall" | "thumb",
): string | null =>
  coverOf(piece) ?? (piece ? DESK_ART[piece.section]?.[size] ?? null : null);

/** The rotating tile, and beside it, at the board's `tall` size,
    the next few pieces as small cards of their own.

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
      /* The tall widget is the tile BESIDE the list on a laptop,
         which is what earns the size its name: the piece showing
         gets the picture and the room, and the next few sit in a
         column at its shoulder. On a phone the column moves back
         underneath.

         The second column exists only once there are pieces to
         fill it. The server renders none, and wherever the fetch
         never answers there are never any, so the fallback tile
         keeps the whole row rather than sitting beside a dead
         column. */
      <div className={`grid gap-2.5${
        pieces.length > 1 ? " lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)]" : ""}`}>
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
  /* Which of the two it is decides how the frame is held: see
     `.gate-art` in the stylesheet. A photographer centred their
     picture and the crop should stay even; ours puts its subject
     off to one side on purpose. */
  const own = coverOf(piece);
  const cover = own ?? groundOf(piece, "wide");
  /* The colour of whichever piece is showing, not a fixed one.
     This tile cycles between the three reading sections, so a
     cooking piece makes it rose and a travel piece plum, out
     of the one table in shared/nav.ts. It named a colour once and
     so a kitchen piece arrived wearing Insights' colour.

     `accentStyle` returns undefined for a section the rail
     does not list, which leaves the attribute off and lets the
     page's own accent through, rather than writing a colour
     that was already going to apply.

     The cover travels the same way, as a custom property the
     stylesheet composes into `--surface-image` under the scrim,
     rather than as a background written here: an inline
     background-image would replace the material's whole stack. */
  const small = own ? null : groundOf(piece, "tall");
  const style: Record<string, string> | undefined = cover
    ? {
      ...accentStyle(piece?.section),
      "--gate-photo": `url("${cover}")`,
      /* Only where the ground is one of ours: a piece's own
         photograph has no second crop, and the stylesheet's
         fallback keeps it. */
      ...(small ? { "--gate-photo-sm": `url("${small}")` } : {}),
    }
    : accentStyle(piece?.section);

  return (
    <a className={`gate-tile min-h-[150px]${cover ? " gate-photo" : ""}${
        cover && !own ? " gate-art" : ""}`}
      data-glow="card" href={href}
      style={style}
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
   showing, each a small card of its own with the piece's cover
   as a thumbnail, and under them one quiet line to the whole
   hub. Split from the tile so the wide board renders no list
   markup at all rather than a hidden one. */
function PulseRows({ pieces, skip }: { pieces: Piece[]; skip: number }) {
  const rest = pieces.filter((_, i) => i !== skip);
  if (!rest.length) return null;
  return (
    <ul className="gp-rows">
      {rest.map((p) => {
        const cover = groundOf(p, "thumb");
        return (
          <li key={p.slug}>
            <a className="gp-row" data-glow="card"
              href={`/${p.section}/${p.slug}.html`}
              lang={p.lang === "bn" ? "bn" : undefined}
              style={accentStyle(p.section)}>
              <span className="min-w-0 grid gap-1 content-center justify-items-start">
                <span className="gt-chip mono">{SECTION_WORDS[p.section] ?? p.section}</span>
                <span className="gp-row-title line-clamp-2">{p.title}</span>
              </span>
              {/* The piece's own cover, or its desk's drawing.
                  `alt` is empty because the title beside it is
                  already the link's accessible name, and the
                  picture says the same thing again. */}
              <span className="gp-thumb" aria-hidden="true">
                {cover
                  ? <img src={cover} alt="" loading="lazy" decoding="async" />
                  : <Icon name="pen" size={18} />}
              </span>
            </a>
          </li>
        );
      })}
      <li>
        <a className="gp-all mono" href="/insights" lang="bn">
          সবগুলো দেখুন <Icon name="arrow" size={13} />
        </a>
      </li>
    </ul>
  );
}
