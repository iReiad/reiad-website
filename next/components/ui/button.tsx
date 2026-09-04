/* Every button on this site, once.

   IT WRITES CLASS NAMES AND NOTHING ELSE. `@layer components` owns the
   look, this owns the vocabulary, and the two cannot drift because there
   is only one of them. Utilities here would make it a fifth way rather
   than the one, and eighteen browser modules build `.btn .btn-ghost` nodes
   by hand, so a button has to mean one thing whichever half made it.

   Nothing below names a colour: every class resolves `--accent`, set on
   <html> from `shared/nav.ts`. `type="button"` by default, because a bare
   <button> inside a form submits it. And `pressed` writes `aria-pressed`,
   which `@layer components` styles, so the state a screen reader
   announces and the state a reader sees are one attribute. */

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonKind = "solid" | "soft" | "ghost" | "quiet";
export type ButtonSize = "sm" | "md" | "lg";

    /* Four kinds, named for what a button IS rather than for how it looks,
       so "the primary action" stays the primary action when the design of
       one changes. */
const KIND: Record<ButtonKind, string> = {
  solid: "btn-solid",
  soft: "btn-soft",
  ghost: "btn-ghost",
  quiet: "btn-quiet",
};

    /* `.btn` is the middle size, so `md` adds nothing. `sm` is
       `.btn-small`, the name eighteen browser modules already write. */
const SIZE: Record<ButtonSize, string> = {
  sm: "btn-small",
  md: "",
  lg: "btn-lg",
};

const classes = (
  kind: ButtonKind, size: ButtonSize, block: boolean,
  onAccent: boolean, className?: string,
) => ["btn", KIND[kind], SIZE[size],
          /* One prop sets the ground and the ink together, which is why
             this is not a `.band .btn-ghost` descendant rule: that ties
             the ink to where the button SITS, and it broke twice when a
             band changed its ground and the buttons did not follow. */
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
      /** A button that stays down: a filter, a mode, a setting. Writes
          `aria-pressed`, which is both what a screen reader announces and
          what the stylesheet draws.

          Leave it undefined for an ordinary button: `aria-pressed` on
          something that is not a toggle tells a reader it has a state it
          does not have. */
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
     * The same thing that navigates. A separate component rather than a
     * prop, because the two are different elements and swapping by prop is
     * how a link ends up with `type="button"` or a button carries an href
     * nothing follows. If it goes somewhere it is an anchor; if it does
     * something it is a button.
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
     * The same thing, when pressing it opens a file picker. A third
     * element rather than a prop, because a file input has to be INSIDE a
     * `<label>` for the label to open it, and neither a `<button>` nor an
     * `<a>` can be that label. Faking it ends in a click handler reaching
     * for a hidden input by id, which is one control said twice.
     *
     * The input goes in as `children` and carries `hidden`, so a keyboard
     * reaches it through the label.
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
     * `.icon-btn` and not `.btn`: a `.btn` is a pill with a word in it and
     * this is a 34px square holding one mark, and the two do not
     * substitute. The stylesheet draws a 44px tap box in `::before`, so
     * the visible square may be smaller than what a thumb has to hit.
     *
     * `label` is required rather than optional: a button whose whole
     * content is an arrow says nothing at all to a screen reader.
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
