/* ============================================================
   bits.tsx: the small shared pieces of the desk.

   Every one of these renders class names that already exist in
   `aab/styles.css`. Nothing here introduces a style, and that is
   the constraint archive/TRANSITION.md calls the most important one in
   Stage 9: the port has to be invisible, or it cannot be judged.

   The old desk had all of these too, as functions returning DOM
   nodes near the top of `desk.js`. They are components here for
   one reason that matters and one that does not: the one that
   matters is that a component keeps its own state across a
   redraw, which is what fixes the search box below.
   ============================================================ */

import { useEffect, useState, type ReactNode } from "react";

/** How long ago, in the words this site uses. */
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

/* ---------- buttons ---------- */

export const Chip = ({
  children, onClick, pressed, tone, title, disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  pressed?: boolean;
  tone?: "move";
  title?: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    className={tone === "move" ? "chip chip-move" : "chip"}
    aria-pressed={pressed === undefined ? undefined : String(pressed) as "true" | "false"}
    title={title}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

/** The bigger button, for the actions inside a card rather than
    the ones in a row: `btn btn-solid` is the one you meant, and
    `btn btn-ghost` is everything else it can also do. */
export const Btn = ({
  children, onClick, solid, disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  solid?: boolean;
  disabled?: boolean;
}) => (
  <button
    type="button"
    className={solid ? "btn btn-solid" : "btn btn-ghost"}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export const Actions = ({ children }: { children: ReactNode }) =>
  <div className="row-flex">{children}</div>;

/* ---------- filters ---------- */

/** The filter row above a panel: which slice, and how many.

    A count is only drawn when it is not zero, which is the old
    desk's rule and a good one: a row of noughts is noise, and the
    absence of a number already says the same thing. */
export function Filters<K extends string>({
  options, active, counts, onPick,
}: {
  options: readonly (readonly [K, string])[];
  active: K;
  counts?: Partial<Record<K, number>> | null;
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

/* ---------- searching, without the box eating what you typed ----------

   THE BUG THIS COMPONENT INHERITED AND THEN STOPPED HAVING

   In the old desk every panel redrew by replacing its whole
   contents, and the search box was part of those contents. A
   quarter of a second after the first letter, the box that letter
   was typed into was thrown away and a fresh, empty, unfocused one
   took its place. Searching worked exactly one character at a
   time. It was patched by handing the box its value back on every
   draw and restoring the caret afterwards, which worked and was a
   patch.

   React does not need the patch: this box owns the text, so a
   parent reloading its rows cannot take it away. The debounce is
   still here, because it was never about the caret. It is about
   not asking the database a question per keystroke. */
export function SearchBox({
  placeholder, onSearch, wait = 250,
}: {
  placeholder: string;
  onSearch: (value: string) => void;
  wait?: number;
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    const t = setTimeout(() => onSearch(text.trim()), wait);
    return () => clearTimeout(t);
    /* `onSearch` is recreated on every render of the parent by
       design, so watching it here would fire the timer on every
       render rather than on every keystroke. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, wait]);

  return (
    <input
      type="search"
      className="desk-search"
      placeholder={placeholder}
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

/* ---------- labels ---------- */

export const Pill = ({
  children, tone, title,
}: {
  children: ReactNode;
  tone?: "new" | "warn" | "section";
  title?: string;
}) => (
  <span
    className={tone ? `pill pill-${tone}` : "pill"}
    title={title}
  >
    {children}
  </span>
);

export const SectionLabel = ({ children }: { children: ReactNode }) =>
  <span className="mono section-label" style={{ marginTop: "22px" }}>{children}</span>;

/* ---------- figures ---------- */

export const Stat = ({ k, v, lead }: { k: string; v: ReactNode; lead?: boolean }) => (
  <div className={lead ? "stat stat-lead" : "stat"}>
    <span className="k">{k}</span>
    <span className="v">{v}</span>
  </div>
);

export const StatRow = ({ children }: { children: ReactNode }) =>
  <div className="stat-row">{children}</div>;

/** Views per day, as one line.

    Drawn as JSX rather than as a string of SVG handed to
    innerHTML, which is what the old desk did. Nothing about that
    was unsafe, the numbers are the site's own, but a page signed
    in as an administrator has no business parsing markup it could
    just as easily build. */
export function Sparkline({ daily }: { daily: { day: string; views: number }[] }) {
  if (!daily?.length) return null;
  const W = 600, H = 90;
  const max = Math.max(...daily.map((d) => d.views), 1);
  const points = daily
    .map((d, i) => `${(i / Math.max(1, daily.length - 1)) * W},${H - (d.views / max) * (H - 10)}`)
    .join(" ");

  return (
    <div className="chart-box">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img"
           aria-label={`Views per day, peaking at ${max}`}>
        <polyline points={points} fill="none" stroke="var(--green)"
                  strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ---------- what a panel says when it has nothing to show ---------- */

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
