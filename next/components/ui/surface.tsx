/* ============================================================
   ui/surface.tsx: the material a thing is made of.

   `@layer deck` already answers "does this card take you
   somewhere", which is a question about MEANING and stays where
   it is: `<GoCard>` and `<InfoCard>` are two components rather
   than one with a prop precisely so neither can be the other by
   accident.

   This answers a different question: what is it made of. Four
   materials, and they differ in how much of the page's colour
   they carry and what texture they have, so two things at the
   same lightness still read as different objects.

     pane     a card. The panel tint, a lit top edge, a sheen.
     sunk     a well: a ground something sits IN rather than ON.
              Woven, and darker than the page.
     glass    an overlay with content moving under it. The only
              tier that pays for a backdrop blur, because it is
              the only one where the blur does anything.
     bare     no material. For a wrapper that only needs the
              accent scoping below.

   ---- and it can carry an accent of its own ----

   `accent` sets `--accent` on the element, so everything inside
   follows it: the buttons, the fields, the tint, the texture, the
   focus rings. That is how one card on the skills page can wear
   the German blue while the card beside it wears the Qur'anic
   teal, without either naming a colour twice.
   ============================================================ */

import type { CSSProperties, ElementType, ReactNode } from "react";

export type Material = "pane" | "sunk" | "glass" | "bare";

const MATERIALS: Record<Material, string> = {
  pane: [
    "bg-panel bg-sheen",
    "border border-pane-edge rounded-[var(--radius-card)]",
    "shadow-[inset_0_1px_0_var(--pane-top),var(--shadow)]",
  ].join(" "),

  sunk: [
    "bg-paper-sunk bg-weave",
    "border border-hairline rounded-[var(--radius-card)]",
    "shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)]",
  ].join(" "),

  glass: [
    "bg-glass bg-sheen",
    "backdrop-blur-[14px] backdrop-saturate-[1.7]",
    "border border-glass-edge rounded-[var(--radius-card)]",
    "shadow-[var(--shadow-lift)]",
    /* A browser with no backdrop-filter gets the solid surface
       instead. Without this it gets a 28% transparent pane over
       moving text, which is the one state glass must never be
       in. */
    "supports-[not_(backdrop-filter:blur(1px))]:bg-glass-solid",
  ].join(" "),

  bare: "",
};

export interface SurfaceProps {
  as?: ElementType;
  material?: Material;
  /** A colour token, `var(--blue)`. Everything inside follows it. */
  accent?: string;
  /** Lifts on hover, for a surface that is itself the target. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function Surface({
  as: Tag = "div", material = "pane", accent, interactive = false,
  className, style, children, ...rest
}: SurfaceProps & Record<string, unknown>) {
  return (
    <Tag
      className={[
        MATERIALS[material],
        interactive
          ? "transition-[transform,box-shadow,border-color] duration-[var(--fast)] "
            + "ease-[var(--ease)] hover:-translate-y-0.5 "
            + "hover:shadow-[var(--shadow-lift)] hover:border-accent-line"
          : "",
        className,
      ].filter(Boolean).join(" ")}
      /* Cast for the reason `footer.tsx` casts: React's
         CSSProperties cannot express a custom property. */
      style={accent
        ? ({ ...style, "--accent": accent } as CSSProperties)
        : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
