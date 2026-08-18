/* ============================================================
   ui/button.tsx: every button on this site, once.

   There were four ways to make one: `.btn.btn-solid`,
   `.btn.btn-ghost`, `.icon-btn` and `.top-btn`, each with its own
   rules in `styles.css` and its own idea of padding, radius and
   what a focus ring looks like. A fifth kind appeared whenever
   somebody needed a size that was not in the list.

   This is one component with variants, in Tailwind utilities, and
   it is the shape every other control here follows: the variants
   are named for what the button IS rather than for how it looks,
   so "the primary action" stays the primary action when the
   design of one changes.

   ---- it wears the page's colour ----

   Nothing below names a colour. `accent-*` resolves to whatever
   `--accent` is on the nearest container, which is set on <html>
   from the rail's own table, so the solid button on a German page
   is blue and on the calculators is gold without a variant per
   school. `next/lib/nav.ts` is where that comes from.

   ---- and it is a real button ----

   `type="button"` by default, because a bare <button> inside a
   form submits it, and that has been the cause of a page
   reloading itself on every design system that forgot.
   ============================================================ */

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonKind = "solid" | "soft" | "ghost" | "quiet";
export type ButtonSize = "sm" | "md" | "lg";

/* Shared by every kind. The focus ring is here rather than in the
   variants because a control whose focus ring depends on its
   colour is a control somebody will ship without one. */
const BASE = [
  "inline-flex items-center justify-center gap-2",
  "font-medium leading-none whitespace-nowrap",
  "rounded-[var(--radius-sm)] border",
  "transition-[background-color,border-color,color,box-shadow,transform]",
  "duration-[var(--fast)] ease-[var(--ease)]",
  "cursor-pointer select-none",
  "focus-visible:outline-2 focus-visible:outline-offset-2",
  "focus-visible:outline-accent",
  "disabled:cursor-not-allowed disabled:opacity-55",
  "active:translate-y-px",
].join(" ");

/* Four kinds, and the ladder between them is loudness rather than
   importance: solid for the one action a page is for, soft for
   the ones beside it, ghost for a choice that is not an action,
   quiet for something that should not draw the eye until looked
   for. */
const KINDS: Record<ButtonKind, string> = {
  solid: [
    "bg-accent-strong text-accent-ink border-transparent",
    "shadow-[var(--shadow)]",
    "hover:brightness-110 hover:shadow-[var(--shadow-lift)]",
  ].join(" "),

  soft: [
    "bg-accent-soft text-accent border-accent-line",
    "bg-sheen",
    "hover:bg-panel-hover hover:border-accent",
  ].join(" "),

  ghost: [
    "bg-panel text-ink border-pane-edge",
    "bg-sheen",
    "hover:bg-panel-hover hover:border-accent-line",
  ].join(" "),

  quiet: [
    "bg-transparent text-ink-soft border-transparent",
    "hover:bg-panel hover:text-ink hover:border-pane-edge",
  ].join(" "),
};

/* Three sizes, on the site's own type scale rather than on
   Tailwind's, so a button is never the fifty-first font size.
   `check-scale.mjs` is why. */
const SIZES: Record<ButtonSize, string> = {
  sm: "text-t1 px-3 py-1.5 min-h-8",
  md: "text-t2 px-4 py-2.5 min-h-10",
  lg: "text-t3 px-5 py-3 min-h-12",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: ButtonKind;
  size?: ButtonSize;
  /** Fills the width it is given, for a button that is the only
      thing on a row on a phone. */
  block?: boolean;
  children: ReactNode;
}

export function Button({
  kind = "ghost", size = "md", block = false,
  className, type = "button", children, ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[BASE, KINDS[kind], SIZES[size], block ? "w-full" : "", className]
        .filter(Boolean).join(" ")}
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
  kind = "ghost", size = "md", block = false,
  className, children, ...rest
}: {
  kind?: ButtonKind; size?: ButtonSize; block?: boolean;
  className?: string; children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={[BASE, KINDS[kind], SIZES[size], block ? "w-full" : "",
        "no-underline", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </a>
  );
}
