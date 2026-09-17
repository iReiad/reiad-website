"use client";

/* ============================================================
   netzwerk/charts.tsx: the planner's drawings.

   A donut, a row of bars, a stacked bar and a heat strip, each
   drawn from the numbers beside it and coloured by the tone it
   is handed. Nothing here names a colour: `lib/netzwerk-store.ts`
   hands one per level and the status drawings use the accent's
   own family, so the charts follow the page.
   ============================================================ */

export interface Slice { label: string; value: number; tone: string }

/* A tone is painted straight on to the stroke or the fill, never
   written into `--accent`: an element given an inline `--accent`
   re-derives `--hairline` and `--accent-line` from it, so a tone
   that IS one of those would be a cycle and paint nothing. */

/** A ring of slices with a figure in the middle. */
export function Donut({ slices, centre, sub, size = 132 }: {
  slices: Slice[];
  centre: string;
  sub?: string;
  size?: number;
}) {
  const total = slices.reduce((n, s) => n + s.value, 0);
  const r = 40;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" width={size} height={size} role="img"
           aria-label={slices.map((s) => `${s.label} ${s.value}`).join(", ")}>
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="12" className="stroke-hairline" />
        {total > 0 ? slices.filter((s) => s.value > 0).map((s) => {
          const len = (s.value / total) * c;
          const el = (
            <circle key={s.label} cx="50" cy="50" r={r} fill="none" strokeWidth="12"
                    strokeLinecap="butt"
                    strokeDasharray={`${len} ${c - len}`}
                    strokeDashoffset={-offset}
                    transform="rotate(-90 50 50)"
                    style={{ stroke: s.tone }} />
          );
          offset += len;
          return el;
        }) : null}
        <text x="50" y="47" textAnchor="middle" className="fill-ink font-code"
              style={{ fontSize: "17px", fontWeight: 600 }}>{centre}</text>
        {sub ? (
          <text x="50" y="62" textAnchor="middle" className="fill-ink-soft font-code"
                style={{ fontSize: "8px", letterSpacing: "0.08em" }}>{sub}</text>
        ) : null}
      </svg>
      <ul className="grid gap-1.5 text-t3 text-ink-soft">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <i className="inline-block size-2.5 rounded-full" style={{ backgroundColor: s.tone }} />
            <span className="font-code tabular-nums text-ink">{s.value}</span>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Horizontal bars, one per row, each against its own maximum. */
export function Bars({ rows, unit }: {
  rows: Array<{ label: string; value: number; max: number; tone?: string; note?: string }>;
  unit?: string;
}) {
  return (
    <ul className="grid gap-2">
      {rows.map((row) => {
        const pct = row.max > 0 ? Math.min(100, Math.round((row.value / row.max) * 100)) : 0;
        return (
          <li key={row.label} className="grid gap-1">
            <div className="flex items-baseline justify-between gap-3 text-t3">
              <span className="text-ink">{row.label}</span>
              <span className="font-code tabular-nums text-ink-soft">
                {row.value}{unit ? ` ${unit}` : ""}{row.note ? ` · ${row.note}` : ""}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-round bg-paper-sunk border border-hairline">
              <i className="block h-full rounded-round bg-accent"
                 style={{ width: `${pct}%`, ...(row.tone ? { backgroundColor: row.tone } : {}) }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** One bar in parts, for "how much of each level is done". */
export function Stacked({ parts, label }: { parts: Slice[]; label: string }) {
  const total = parts.reduce((n, p) => n + p.value, 0);
  return (
    <div className="grid gap-1.5" role="img" aria-label={label}>
      <div className="flex h-3 overflow-hidden rounded-round bg-paper-sunk border border-hairline">
        {parts.map((p) => (
          p.value > 0 ? (
            <i key={p.label} className="block h-full"
               style={{ width: `${(p.value / Math.max(1, total)) * 100}%`, backgroundColor: p.tone }} />
          ) : null
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-t2 text-ink-soft">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-1.5">
            <i className="inline-block size-2 rounded-full" style={{ backgroundColor: p.tone }} />
            {p.label} <span className="font-code text-ink">{p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Twelve weeks of days, one square each, darker for more
    minutes. Newest week at the bottom, Monday first. */
export function HeatStrip({ days, max }: {
  days: Array<{ date: string; minutes: number; today?: boolean }>;
  max: number;
}) {
  return (
    <div className="grid grid-cols-7 gap-1" role="img"
         aria-label={`${days.filter((d) => d.minutes > 0).length} days with a session in the last twelve weeks`}>
      {days.map((d) => {
        const level = d.minutes <= 0 ? 0 : Math.max(0.28, Math.min(1, d.minutes / Math.max(1, max)));
        return (
          <span key={d.date}
                title={`${d.date}: ${d.minutes} min`}
                className={[
                  "aspect-square rounded-tight border",
                  d.minutes > 0 ? "bg-accent border-transparent" : "bg-paper-sunk border-hairline",
                  d.today ? "outline outline-2 outline-accent outline-offset-1" : "",
                ].join(" ")}
                style={d.minutes > 0 ? { opacity: level } : undefined} />
        );
      })}
    </div>
  );
}
