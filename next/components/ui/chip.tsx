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
  AnchorHTMLAttributes, ButtonHTMLAttributes, LabelHTMLAttributes, ReactNode,
} from "react";

/* Four tones, named for what they say rather than for a colour.
   `accent` follows the page; the other three are fixed because
   "this went wrong" must not turn teal on the Qur'anic school. */
export type ChipTone = "accent" | "quiet" | "warn" | "danger";

/* ---- one chip, and the tones are its modifiers ----

   This was four strings of Tailwind utilities, which made a
   SECOND chip: the same idea as `.chip` in the stylesheet with
   different padding, a different font and a different size, near
   enough alike that nobody would call it a bug and far enough
   apart that a page holding both looked slightly wrong.

   `.chip` is the one chip now. What a chip DOES is decided by the
   element rather than by a class, which is why there are three
   exports below and not one component with a prop:

       <span class="chip">    a label
       <button class="chip">  a control
       <a class="chip">       a link

   The stylesheet keys `cursor` and the hover off `button` and
   `a`, so a label neither looks pressable nor answers a pointer
   that can do nothing with it. */
const TONES: Record<ChipTone, string> = {
  accent: "chip-accent",
  quiet: "",
  warn: "chip-warn",
  danger: "chip-danger",
};

const classes = (tone: ChipTone, extra?: string): string =>
  ["chip", TONES[tone], extra].filter(Boolean).join(" ");

export function Chip(
  { tone = "quiet", className, children }:
  { tone?: ChipTone; className?: string; children: ReactNode },
) {
  return (
    <span className={classes(tone, className)}>
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
            className={classes("quiet", className)}
            data-glow="chip"
            {...rest}>
      {children}
    </button>
  );
}

/** The same chip, when it really does take you somewhere. */
/** The same chip, when it is the LABEL of a control rather than
    the control.

    A `<label>`, so pressing it presses the input it names and a
    screen reader announces the two as one thing. It exists for a
    set of radios drawn as a row of chips: `<ChipButton>` would be
    a button, which is a second control beside the real one, and a
    bare `className="chip"` is the hand-written chip this library
    exists to stop.

    No `data-glow`: the input carries the state, and the material's
    light comes up on the label through the group's own rules
    rather than on hover, because a radio in a row of five is not
    a lone control asking to be pressed. */
export function ChipLabel({
  tone = "quiet", className, children, ...rest
}: { tone?: ChipTone; className?: string; children: ReactNode }
  & LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={classes(tone, className)} {...rest}>
      {children}
    </label>
  );
}

export function ChipLink({
  tone = "quiet", className, children, ...rest
}: { tone?: ChipTone; className?: string; children: ReactNode }
  & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={classes(tone, ["no-underline", className].filter(Boolean).join(" "))}
      data-glow="chip"
      {...rest}
    >
      {children}
    </a>
  );
}
