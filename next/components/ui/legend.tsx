/* ============================================================
   ui/legend.tsx: what the lines on a chart mean.

   Every calculator draws one and every one of them wrote its own:
   a `div.chart-legend`, two spans, and an `<i>` with a background
   colour set inline. Six of those on one page, each naming a
   colour, which is how three charts on a gold page came to draw
   themselves Insights green.

   ---- the swatch does not choose a colour ----

   It takes a SERIES NUMBER, and `--series-1` and `--series-2` in
   the stylesheet decide what that looks like. The first is the
   page's own accent and the second is neutral, so a chart follows
   its section the way everything else does and the legend cannot
   drift from the chart: `aab/tools/tools.js` draws with the same
   two tokens.

   `danger` is the third and it is not a series: it is the colour
   the site uses for a quantity that is bad news, which is what
   interest paid is.
   ============================================================ */

import type { ReactNode } from "react";

export type Series = 1 | 2 | "danger";

const INK: Record<string, string> = {
  1: "var(--series-1)",
  2: "var(--series-2)",
  danger: "var(--danger)",
};

/** One key: a mark, and the words for it. */
export function Key({ series, children }: { series: Series; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-t1
      uppercase tracking-[0.06em] text-ink-soft">
      <i
        aria-hidden="true"
        className="size-2.5 shrink-0 rounded-[3px]"
        style={{ background: INK[String(series)] }}
      />
      {children}
    </span>
  );
}

/** The row of them under a chart.

    A `<ul>` would be right if this were a list a reader walks;
    it is a caption for the drawing above it, and the drawing is
    already `aria-hidden`, so it is a plain row that wraps. */
export function Legend({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1">
      {children}
    </div>
  );
}
