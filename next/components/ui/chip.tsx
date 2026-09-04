/* A small label, and the one rule about it.

   A CHIP THAT GOES NOWHERE IS NOT A LINK. That is why there are three
   exports rather than one with an `href`: a reader finds out whether
   something is clickable by moving the mouse, and a design where half the
   chips are links and half are not teaches them to try every one.

   AND A CHIP YOU PRESS IS A THIRD THING AGAIN. Almost every `.chip` on
   this site is a CONTROL, and a library offering only a `<span>` and an
   `<a>` can replace none of them. */

import type {
  AnchorHTMLAttributes, ButtonHTMLAttributes, LabelHTMLAttributes, ReactNode,
} from "react";

/* Four tones, named for what they say rather than for a colour.
   `accent` follows the page; the other three are fixed because
   "this went wrong" must not turn teal on the Qur'anic school. */
export type ChipTone = "accent" | "quiet" | "warn" | "danger";

    /* ---- one chip, and the tones are its modifiers ----
       Tailwind utilities here make a SECOND chip: the same idea as `.chip`
       in the stylesheet with different padding, a different font and a
       different size, near enough alike that nobody calls it a bug and far
       enough apart that a page holding both looks slightly wrong.

       `.chip` is the one chip. What a chip DOES is decided by the element
       rather than by a class, which is why there are three exports:

           <span class="chip">    a label
           <button class="chip">  a control
           <a class="chip">       a link

       The stylesheet keys `cursor` and the hover off `button` and `a`, so
       a label neither looks pressable nor answers a pointer. */
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

    /** The same chip, when pressing it does something here. It writes
        `.chip` rather than utilities, because that is the class the
        stylesheet already styles as a control, the class four browser
        modules build by hand, and the class `aria-pressed` is keyed on.

        `pressed` is `aria-pressed`, so what a screen reader announces and
        what a reader sees are one attribute. */
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
    /** The same chip, when it is the LABEL of a control rather than the
        control. A `<label>`, so pressing it presses the input it names and
        a screen reader announces the two as one thing: `<ChipButton>`
        would be a second control beside the real one.

        No `data-glow`: the input carries the state, and the material's
        light comes up on the label through the group's own rules rather
        than on hover, because a radio in a row of five is not a lone
        control asking to be pressed. */
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
