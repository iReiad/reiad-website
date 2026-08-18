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
   plain door to /insights.html that says what Insights is. The
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
import { Icon } from "./icons";

type Piece = {
  slug: string; title: string; dek: string;
  section: string; lang: string; minutes: number;
};

const SECTION_WORDS: Record<string, string> = {
  insights: "Insights", cooking: "রান্না", travel: "ভ্রমণ",
};

const SWAP_MS = 7000;

export function PulseCard() {
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
  const href = piece ? `/${piece.section}/${piece.slug}.html` : "/insights.html";

  return (
    <a className="gate-tile min-h-[150px] col-span-2 lg:col-span-6" href={href}
      style={{ ["--accent" as string]: "var(--green)" }}
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
