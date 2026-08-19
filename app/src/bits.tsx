/* ============================================================
   bits.tsx: what the desk and the Studio need that the site's
   component library does not have yet.

   Nothing here introduces a style. Every one of these renders
   either a class `next/styles/site.css` already defines or a
   component out of `next/components/ui/`, which is the constraint
   archive/TRANSITION.md calls the most important one in Stage 9:
   the port has to be invisible, or it cannot be judged.

   ---- what is NOT here any more, and where it went ----

   A button and a section label. Both were a second implementation
   of `next/components/ui/button.tsx` and `ui/label.tsx`, which is
   the drift the library exists to stop: `Btn` knew two of the four
   kinds and none of the three sizes, and `SectionLabel` carried
   22px of top margin that no other call site on this site has.
   Import the library's; do not write a third.

   ---- and why the chip below is still ours ----

   `ui/chip.tsx` is a LABEL: a span that says what kind of thing
   something is. `.chip` on these two pages is a CONTROL you press,
   and it is also the site's tab, its toggle and its segmented
   radio. Those are two different objects with one name, so this
   one stays here until the library has a pressable chip. The note
   at the top of `ui/button.tsx` makes the same argument about
   `.btn`, and won it.
   ============================================================ */

import {
  useEffect, useState,
  type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode,
} from "react";
import { Field } from "../../next/components/ui/field.tsx";

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

/* ---------- the pressable chip ----------

   One component for what were eight spellings of it: the desk's
   tab strip, its filter rows and its row actions, the Studio's
   writing toolbar, its three preview switches, its section
   picker, the Open sheet's buttons and the lesson picker. Each
   wrote `<button type="button" className="chip">` and then its own
   idea of how "this one is on" is said.

   It takes every button attribute, the way `ui/button.tsx` does,
   so `role`, `aria-selected`, `aria-checked`, `data-on` and the
   rest reach the element without a prop each: `.chip` answers
   `aria-pressed` and `aria-selected`, and `.seg .chip` answers
   `data-on`. `pressed` is the only one written out, because
   `aria-pressed="false"` has to be PRESENT for a toggle to
   announce itself as one, and `pressed={false}` is the only way to
   tell that apart from a chip that is not a toggle at all. */
export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Drawn as pressed and announced as a toggle. Leave it off for
      a chip that is a plain action, a tab or a radio. */
  pressed?: boolean;
  /** The one chip on the desk that finishes a migration rather
      than opening a thing. */
  tone?: "move";
  children: ReactNode;
}

export function Chip({
  pressed, tone, className, type = "button", children, ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      className={["chip", tone === "move" ? "chip-move" : "", className]
        .filter(Boolean).join(" ")}
      aria-pressed={pressed === undefined ? undefined : String(pressed) as "true" | "false"}
      {...rest}
    >
      {children}
    </button>
  );
}

/** The same chip when it really does take you somewhere.

    Two components rather than one with an `href`, which is the
    argument `ui/button.tsx` makes for `<ButtonLink>` and
    `ui/chip.tsx` makes for `<ChipLink>`: if it goes somewhere it
    is an anchor, and if it does something it is a button. */
export function ChipLink({
  className, children, ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a className={["chip", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </a>
  );
}

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
        <Chip key={key} pressed={key === active} onClick={() => onPick(key)}>
          {label}
          {counts?.[key] ? <span className="tab-count">{counts[key]}</span> : null}
        </Chip>
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
   not asking the database a question per keystroke.

   ---- the label is the library's now ----

   It was a bare `<input>` with a placeholder and nothing else,
   which is the shape `ui/field.tsx` was written against: a
   floating box that nothing announces, with `for` and `id` left to
   whoever remembers. `<Field>` wires the label, so `id` is
   required here for the same reason it is required there, and the
   placeholder doubles as the label because it already says what
   the box is for.

   `.desk-search` stays on it. The box's own look is the desk's and
   `@layer studio` owns it; what the library owns is the label and
   the aria wiring around it. */
export function SearchBox({
  id, placeholder, onSearch, wait = 250,
}: {
  /** What the `<label>` points at. One search box per panel, so
      the panel's own name is the obvious one. */
  id: string;
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
    <Field
      id={id}
      label={placeholder}
      hideLabel
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
    just as easily build.

    `--series-1` rather than `--green`, which is what
    `ui/legend.tsx` says at more length: a chart follows the page's
    accent, and naming a colour is how three charts on a gold page
    came to draw themselves green. */
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
        <polyline points={points} fill="none" stroke="var(--series-1)"
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
