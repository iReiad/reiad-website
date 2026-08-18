/* ============================================================
   ui/stat.tsx: a figure, and what it is a figure of.

   `.tile` and `.tile-value` are written fifty times across the
   case studies, always as the same three lines: a label, a
   number, sometimes a note under it. Fifty copies is fifty
   chances for one of them to set its own font size, and several
   have.

   ---- the number is not the label ----

   `<StatTile>` takes them separately and renders the value in the
   mono face at a scale step, because a figure and its caption are
   different kinds of text and a component that took one string
   would leave that to whoever wrote it.

   ---- and a row of them is a component too ----

   `<StatRow>` rather than a div with a grid class repeated at
   every call site. It is auto-fit, so three tiles and five both
   lay out without being told how many there are, which is the
   same rule the collection page in the practice book follows.
   ============================================================ */

import type { ReactNode } from "react";
import { Surface } from "./surface";

export function StatTile({
  label, value, note, accent,
}: {
  label: ReactNode;
  value: ReactNode;
  /** One line under the figure: what it is measured over, what it
      excludes, why it is not the number somebody expected. */
  note?: ReactNode;
  /** A colour token, for a tile that belongs to a section rather
      than to the page it is on. */
  accent?: string;
}) {
  return (
    <Surface material="pane" accent={accent} className="flex flex-col gap-1.5 p-4">
      <span className="text-t1 font-medium tracking-wide uppercase text-ink-soft">
        {label}
      </span>
      <span className="font-mono text-t6 leading-none text-ink tabular-nums">
        {value}
      </span>
      {note ? <span className="text-t1 text-ink-soft">{note}</span> : null}
    </Surface>
  );
}

/** A row of tiles that wraps rather than scrolls.

    `auto-fit` with a floor, so a narrow screen gets one column
    and a wide one gets as many as fit, and neither is told a
    number. A grid with a fixed column count is how a row of three
    becomes a row of two and a widow. */
export function StatRow({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,11rem),1fr))]">
      {children}
    </div>
  );
}
