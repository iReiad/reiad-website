/* ============================================================
   ui/surface.tsx: what a thing is made of.

   `@layer deck` answers "does this card take you somewhere",
   which is a question about MEANING and stays where it is:
   `<GoCard>` and `<InfoCard>` are two components rather than one
   with a prop precisely so neither can be the other by accident.

   This answers a different question, and the answer is plain.
   Three materials, and they differ only in the ground:

     pane     a card: the panel colour, a hairline, a corner.
     sunk     a well: a ground something sits IN rather than ON,
              darker than the page.
     glass    an overlay with content moving under it: the same
              panel, with the one shadow this site has for a
              thing that floats.
     bare     no material. For a wrapper that only needs the
              accent scoping below.

   No blur, no texture, no lit edge: a surface is a colour and a
   line, and `scripts/check-plain.ts` fails a blur coming back.

   ---- and it can carry an accent of its own ----

   `accent` sets `--accent` on the element, so everything inside
   follows it: the buttons, the fields, the tint, the focus rings.
   That is how one card on the skills page can wear the German
   blue while the card beside it wears the Qur'anic teal, without
   either naming a colour twice.
   ============================================================ */

import type { CSSProperties, ElementType, ReactNode } from "react";

export type Material = "pane" | "sunk" | "glass" | "bare";

const MATERIALS: Record<Material, string> = {
  pane: "bg-panel border border-hairline rounded-[var(--radius-card)]",
  sunk: "bg-paper-sunk border border-hairline rounded-[var(--radius-card)]",
  glass: "bg-panel border border-hairline rounded-[var(--radius-card)] shadow-[var(--shadow-lift)]",
  bare: "",
};

export interface SurfaceProps {
  as?: ElementType;
  material?: Material;
  /** A colour token, `var(--blue)`. Everything inside follows it. */
  accent?: string;
  /** Changes its edge on hover, for a surface that is itself the
      target. Nothing moves. */
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
          ? "transition-[border-color] duration-[var(--fast)] "
            + "ease-[var(--ease)] hover:border-accent-line"
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
