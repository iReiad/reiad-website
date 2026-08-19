/* ============================================================
   ui/button.tsx: every button on this site, once.

   There were four ways to make one: `.btn.btn-solid`,
   `.btn.btn-ghost`, `.icon-btn` and `.top-btn`, each with its own
   idea of padding, radius and what a focus ring looks like. A
   fifth kind appeared whenever somebody needed a size that was
   not in the list.

   ---- it writes class names and nothing else ----

   This was Tailwind utilities, and that made it a FIFTH way
   rather than the one: `.btn-solid` in the stylesheet is
   `--accent` with an 80%-ink border, the component was
   `--accent-strong` with a transparent one, and a page that had
   been converted grew visibly different buttons from the page
   beside it. Eighteen browser modules build `.btn .btn-ghost`
   nodes by hand, so until those are components a button has to
   mean one thing whichever half of the site made it.

   So `@layer components` owns the look, this owns the vocabulary,
   and the two cannot drift because there is only one of them.
   `ui/stat.tsx` makes the same argument at more length.

   ---- it wears the page's colour ----

   Nothing below names a colour. Every class it writes resolves
   `--accent`, which is set on <html> from the rail's own table,
   so the solid button on a German page is blue and on the
   calculators is gold without a variant per school.
   `next/lib/nav.ts` is where that comes from.

   ---- and it is a real button ----

   `type="button"` by default, because a bare <button> inside a
   form submits it, and that has been the cause of a page
   reloading itself on every design system that forgot.

   ---- a button that stays down ----

   `pressed` was the hole this file left, and it is the reason
   there are sixteen button shapes in the stylesheet rather than
   one. A control that has an on state could not be a `<Button>`,
   so every one of them invented a class: `.scenario` on the
   calculators, `.toggle` beside it, `.chip` on the filters,
   `.tick-btn`, `.keep-btn`, `.pref-chip`, `button.react`. Seven
   vocabularies for one idea, each with its own padding and its
   own idea of what "on" looks like.

   It writes `aria-pressed`, and `@layer components` styles
   `.btn[aria-pressed="true"]`, so the state a screen reader
   announces and the state a reader sees are the same attribute.
   Two ways of saying it is how they come apart.
   ============================================================ */

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonKind = "solid" | "soft" | "ghost" | "quiet";
export type ButtonSize = "sm" | "md" | "lg";

/* Four kinds, named for what a button IS rather than for how it
   looks, so "the primary action" stays the primary action when
   the design of one changes. The ladder between them is loudness
   rather than importance. */
const KIND: Record<ButtonKind, string> = {
  solid: "btn-solid",
  soft: "btn-soft",
  ghost: "btn-ghost",
  quiet: "btn-quiet",
};

/* `.btn` is the middle size, so `md` adds nothing. `sm` is
   `.btn-small`, which is the name eighteen browser modules
   already write. */
const SIZE: Record<ButtonSize, string> = {
  sm: "btn-small",
  md: "",
  lg: "btn-lg",
};

const classes = (
  kind: ButtonKind, size: ButtonSize, block: boolean,
  onAccent: boolean, className?: string,
) => ["btn", KIND[kind], SIZE[size],
      /* One prop sets the ground and the ink together, which is
         the whole reason this is not a `.band .btn-ghost`
         descendant rule: that ties the ink to where the button
         SITS, and it broke twice when a band changed its ground
         and the buttons inside it did not follow. */
      onAccent ? "btn-on-accent" : "",
      block ? "btn-block" : "", className].filter(Boolean).join(" ");

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: ButtonKind;
  size?: ButtonSize;
  /** Fills the width it is given, for a button that is the only
      thing on a row on a phone. */
  block?: boolean;
  /** This button stands on an accent fill: inside a `<Band>`, or
      anything else whose ground is `--accent-strong`. */
  onAccent?: boolean;
  /** A button that stays down: a filter, a mode, a setting.
      Writes `aria-pressed`, which is both what a screen reader
      announces and what the stylesheet draws, so the two cannot
      disagree.

      Leave it undefined for an ordinary button. `aria-pressed`
      on something that is not a toggle tells a reader it has a
      state it does not have. */
  pressed?: boolean;
  children: ReactNode;
}

export function Button({
  kind = "ghost", size = "md", block = false, onAccent = false,
  pressed, className, type = "button", children, ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classes(kind, size, block, onAccent, className)}
      aria-pressed={pressed}
      data-glow="control"
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * The same thing that navigates.
 *
 * A separate component rather than a prop, because the two are
 * different elements and swapping between them by prop is how a
 * link ends up with `type="button"` on it, or a button ends up
 * carrying an href nothing follows. If it goes somewhere it is an
 * anchor; if it does something it is a button.
 */
export function ButtonLink({
  kind = "ghost", size = "md", block = false, onAccent = false,
  className, children, ...rest
}: {
  kind?: ButtonKind; size?: ButtonSize; block?: boolean; onAccent?: boolean;
  className?: string; children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={classes(kind, size, block, onAccent, className)}
      data-glow="control"
      {...rest}
    >
      {children}
    </a>
  );
}
