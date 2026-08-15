/* ============================================================
   bits.tsx: the small shared pieces of the desk.

   Every one of these renders class names that already exist in
   `aab/styles.css`. Nothing here introduces a style, and that is
   the constraint TRANSITION.md calls the most important one in
   Stage 9: the port has to be invisible, or it cannot be judged.
   ============================================================ */

import type { ReactNode } from "react";

/** How long ago, in the words the old desk used. */
export function when(iso: string | null | undefined): string {
  if (!iso) return "";
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return "";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(then).toLocaleDateString("en-GB",
    { day: "numeric", month: "short", year: "numeric" });
}

export const Chip = ({
  children, onClick, pressed, tone,
}: {
  children: ReactNode;
  onClick?: () => void;
  pressed?: boolean;
  tone?: "move";
}) => (
  <button
    type="button"
    className={tone === "move" ? "chip chip-move" : "chip"}
    aria-pressed={pressed === undefined ? undefined : String(pressed) as "true" | "false"}
    onClick={onClick}
  >
    {children}
  </button>
);

/** The filter row above a panel: which slice, and how many. */
export function Filters<K extends string>({
  options, active, counts, onPick,
}: {
  options: [K, string][];
  active: K;
  counts?: Partial<Record<K, number>>;
  onPick: (key: K) => void;
}) {
  return (
    <div className="chip-row desk-filters">
      {options.map(([key, label]) => (
        <button
          key={key}
          type="button"
          className="chip"
          aria-pressed={String(key === active) as "true" | "false"}
          onClick={() => onPick(key)}
        >
          {label}
          {counts?.[key] ? <span className="tab-count">{counts[key]}</span> : null}
        </button>
      ))}
    </div>
  );
}

export const Empty = ({ children }: { children: ReactNode }) =>
  <p className="muted">{children}</p>;

export const Loading = () =>
  <p className="muted mono">Loading…</p>;

/* A panel that could not load says so. The old desk showed an
   empty list instead, which reads as "nothing here" and is a
   different and much more alarming statement. */
export const Broken = ({ what }: { what: string }) => (
  <p className="muted">
    Could not load {what}. The database may not be reachable from here.
  </p>
);

export const Count = ({ children }: { children: ReactNode }) =>
  <p className="admin-count mono">{children}</p>;
