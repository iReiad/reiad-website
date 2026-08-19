/* ============================================================
   ui/chip.tsx: a small label, and the one rule about it.

   `styles.css` has twenty rules for `.chip` and the routes write
   `className="tag mono"` twenty-six times. Between them they are
   the same object: a short word in a box, saying what kind of
   thing something is.

   ---- a chip that goes nowhere is not a link ----

   That is the whole reason there are three exports rather than
   one with an `href`. `<SoonCard>` in `deck.tsx` exists for the
   same reason and the note there is worth repeating: a reader
   finds out whether something is clickable by moving the mouse,
   and a design where half the chips are links and half are not
   teaches them to try every one.

   ---- and a chip you press is a third thing again ----

   `<ChipButton>` was the hole this file left, and it is why
   nothing had ever imported the two exports above. Every `.chip`
   on this site is a CONTROL: the topic filters, the Reset on
   five calculators, the copy-link on the tools hub, the figure
   toolbar in the editor. All of them are `<button>` elements,
   and both exports here render a `<span>` and an `<a>`, so the
   component that `check-components.ts` told thirty-four call
   sites to use could not replace a single one of them.

   `app/src/bits.tsx` says the same thing from the other side and
   names the condition for its own removal: "`.chip` on these two
   pages is a CONTROL you press ... so this one stays here until
   the library has a pressable chip."
   ============================================================ */

import type {
  AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode,
} from "react";

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

/** The same chip, when pressing it does something here.

    It writes `.chip` rather than the utilities above, because
    that is the class the stylesheet already styles as a control,
    the class four browser modules build by hand, and the class
    `aria-pressed` is already keyed on. A second look for a
    pressed chip is the drift this library exists to stop.

    `pressed` is `aria-pressed`, so what a screen reader
    announces and what a reader sees are one attribute. */
export function ChipButton({
  pressed, className, type = "button", children, ...rest
}: {
  /** Undefined for a chip that acts and does not latch: a Reset,
      a Copy link. `aria-pressed` on one of those would promise a
      state it does not have. */
  pressed?: boolean;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} aria-pressed={pressed}
            className={["chip", className].filter(Boolean).join(" ")}
            data-glow="chip"
            {...rest}>
      {children}
    </button>
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
