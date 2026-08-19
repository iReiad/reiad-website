/* ============================================================
   ui/meter.tsx: how far through something a reader is.

   There are five of these on the site and they are five
   implementations: the school ladder's ring, the workbook's
   `.buch-fortschritt`, the course module's bar, the Studio's
   `.studio-meter` and the account page's. Each draws a track and
   a fill and each picked its own height.

   ---- it says the number as well as drawing it ----

   `<progress>` is not used, deliberately: it cannot be styled
   consistently across browsers and its implicit label is the
   thing that goes wrong most. This is a div with
   `role="progressbar"` and the three aria attributes that make it
   real, plus the figure written out beside it, because a bar
   nobody can read a number off is decoration.

   Bangla numerals inside a `[lang="bn"]` page are the site's
   rule, and `bn()` in `lib/workbook.ts` is where that lives.
   ============================================================ */

import type { ReactNode } from "react";

export function Meter({
  done, total, label, figure, size = "md",
}: {
  done: number;
  total: number;
  /** What the bar is counting, for anybody who cannot see it. */
  label: string;
  /** The figure drawn beside the bar. Given rather than computed,
      because a Bangla page writes its numerals differently and
      this component should not know that. */
  figure?: ReactNode;
  size?: "sm" | "md";
}) {
  /* Guard the divide rather than the display: a ladder with no
     rungs yet is a real state, and NaN% is a bar that vanishes. */
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={total}
        className={[
          "relative flex-1 overflow-hidden rounded-full",
          "bg-paper-sunk bg-weave border border-hairline",
          size === "sm" ? "h-1.5" : "h-2.5",
        ].join(" ")}
      >
        <i
          className={[
            "absolute inset-y-0 left-0 block rounded-full",
            "bg-accent-strong",
            "transition-[width] duration-[var(--slow)] ease-[var(--ease)]",
            "motion-reduce:transition-none",
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
      {figure ? (
        <span className="shrink-0 font-code text-t1 tabular-nums text-ink-soft">
          {figure}
        </span>
      ) : null}
    </div>
  );
}
