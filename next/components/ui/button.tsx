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
   `shared/nav.ts` is where that comes from.

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

/**
 * The same thing, when pressing it opens a file picker.
 *
 * A third element rather than a prop on the other two, for the
 * reason `<ButtonLink>` is a third: a file input has to be INSIDE
 * a `<label>` for the label to open it, and neither a `<button>`
 * nor an `<a>` can be that label. Every attempt to fake it ends
 * in a click handler reaching for a hidden input by id, which is
 * the same control said in two places.
 *
 * The input goes in as `children` and carries `hidden`, so the
 * label is the whole of what a reader sees and a keyboard reaches
 * the input through it.
 */
export function ButtonLabel({
  kind = "ghost", size = "md", block = false, onAccent = false,
  className, children, ...rest
}: {
  kind?: ButtonKind; size?: ButtonSize; block?: boolean; onAccent?: boolean;
  className?: string; children: ReactNode;
} & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={classes(kind, size, block, onAccent, className)}
      data-glow="control"
      {...rest}
    >
      {children}
    </label>
  );
}

/**
 * A control that is one glyph, and is square.
 *
 * `.icon-btn` and not `.btn`: they are different shapes on
 * purpose. A `.btn` is a pill with uppercase mono, twenty pixels
 * of padding either side and a word in it; this is a 34px square
 * holding a single mark, and the two do not substitute for each
 * other. The stylesheet draws a 44px tap box in `::before`, which
 * is why the visible square may be smaller than the thing a
 * thumb has to hit.
 *
 * `label` is required rather than optional. A button whose whole
 * content is an arrow or a cross says nothing at all to a screen
 * reader, and every one of the ten hand-written call sites this
 * replaces had to remember `aria-label` on its own.
 */
export function IconButton({
  label, className, type = "button", children, ...rest
}: {
  /** What it does, in words. Becomes `aria-label`. */
  label: string;
  className?: string;
  children: ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">) {
  return (
    <button
      type={type}
      className={["icon-btn", className].filter(Boolean).join(" ")}
      aria-label={label}
      data-glow="control"
      {...rest}
    >
      {children}
    </button>
  );
}
