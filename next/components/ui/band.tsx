/* ============================================================
   ui/band.tsx: the block at the end of a page that asks for
   something.

   Eleven routes write `<div className="band">` with a label, a
   heading, a paragraph and a pair of buttons inside it, and the
   school hubs write the same thing again as an HTML string. It is
   the most repeated shape on the site after a card.

   ---- what was wrong with it ----

   Two things, and the second is why this is a component rather
   than a tidier rule.

   It named its colours. A green fill, white headings, a
   green-tinted paragraph and a GOLD label, so a German page drew
   a green band with a gold label at the bottom of it. It is the
   accent and `--accent-ink` now, which is the token for text on
   an accent fill: near-white in the light theme, near-black in
   the dark one where the accent is the light thing.

   And `.band.soft` turned the ground back to paper without
   undoing the button rules the dark band had set, so a ghost
   button inside a soft band was white text on a near-white fill
   and could not be read at all. A `tone` prop cannot forget: the
   two grounds are two values of one thing rather than a class and
   a class that overrides half of it.

   ---- the buttons are given, not built ----

   `actions` takes whatever the page wants there, because a band
   is sometimes one button, sometimes two and sometimes a row of
   links. What the band decides is that they sit in a row that
   wraps, with the air above them the same everywhere.
   ============================================================ */

import type { ReactNode } from "react";

export type BandTone = "solid" | "soft";

export function Band({
  label, title, children, actions, footer, tone = "solid", id,
}: {
  /** The small line above the heading. */
  label?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  /** Buttons, links, a chip row: whatever ends the block. */
  actions?: ReactNode;
  /** What comes AFTER the buttons. The About page puts a row of
      social links there, and passing it as a child put it above
      them, which reorders the page for a screen reader as well as
      for an eye. A slot says where it goes. */
  footer?: ReactNode;
  /** `solid` is the accent fill. `soft` is the quiet one, on the
      page's own sunk ground, for a band that is a note rather
      than an ask. */
  tone?: BandTone;
  id?: string;
}) {
  const solid = tone === "solid";

  return (
    <div
      id={id}
      className={[
        "grid gap-3 rounded-card my-10 mb-2.5",
        "p-[clamp(26px,4vw,42px)]",
        solid
          ? "bg-accent-strong text-accent-ink"
          : "bg-paper-sunk bg-weave text-ink border border-hairline",
      ].join(" ")}
    >
      {label ? (
        <span
          className={`font-code text-t1 uppercase tracking-[0.07em] ${
            solid ? "text-accent-ink/70" : "text-ink-soft"}`}
        >
          {label}
        </span>
      ) : null}

      {title ? (
        <h2 className={`max-w-[22ch] text-t6 leading-tight ${
          solid ? "text-accent-ink" : "text-ink"}`}>
          {title}
        </h2>
      ) : null}

      {children ? (
        <div className={`max-w-[58ch] text-t4 leading-relaxed ${
          solid ? "text-accent-ink/85" : "text-ink-soft"} [&>p+p]:mt-3`}>
          {children}
        </div>
      ) : null}

      {actions ? (
        <div className="mt-1 flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}

      {footer ? <div className="mt-2">{footer}</div> : null}
    </div>
  );
}
