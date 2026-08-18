/* ============================================================
   ui/chip.tsx: a small label, and the one rule about it.

   `styles.css` has twenty rules for `.chip` and the routes write
   `className="tag mono"` twenty-six times. Between them they are
   the same object: a short word in a box, saying what kind of
   thing something is.

   ---- a chip that goes nowhere is not a link ----

   That is the whole reason there are two exports rather than one
   with an `href`. `<SoonCard>` in `deck.tsx` exists for the same
   reason and the note there is worth repeating: a reader finds
   out whether something is clickable by moving the mouse, and a
   design where half the chips are links and half are not teaches
   them to try every one.
   ============================================================ */

import type { AnchorHTMLAttributes, ReactNode } from "react";

/* Four tones, named for what they say rather than for a colour.
   `accent` follows the page; the other three are fixed because
   "this went wrong" must not turn teal on the Qur'anic school. */
export type ChipTone = "accent" | "quiet" | "warn" | "danger";

const BASE = [
  "inline-flex items-center gap-1.5",
  "rounded-full border px-2.5 py-1",
  "text-t1 font-medium tracking-wide uppercase leading-none",
  "whitespace-nowrap",
].join(" ");

const TONES: Record<ChipTone, string> = {
  accent: "bg-accent-soft text-accent border-accent-line",
  quiet: "bg-paper-sunk text-ink-soft border-hairline",
  warn: "bg-panel text-gold border-gold/35",
  danger: "bg-panel text-danger border-danger/35",
};

export function Chip(
  { tone = "quiet", className, children }:
  { tone?: ChipTone; className?: string; children: ReactNode },
) {
  return (
    <span className={[BASE, TONES[tone], className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}

/** The same chip, when it really does take you somewhere. */
export function ChipLink({
  tone = "quiet", className, children, ...rest
}: { tone?: ChipTone; className?: string; children: ReactNode }
  & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={[BASE, TONES[tone], "no-underline",
        "transition-colors duration-[var(--fast)] ease-[var(--ease)]",
        "hover:border-accent hover:text-accent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </a>
  );
}
