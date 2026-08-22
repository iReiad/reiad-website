"use client";

/* ============================================================
   diet/widgets.tsx: the board on the upper right.

   `DIET.md` section 24. Each widget is a small self-contained
   panel and each one answers exactly one question. The rules
   below are the ones a dashboard breaks first, so they are here
   rather than in the plan alone.

   ---- every widget is legible with no data ----

   Not a spinner, not an empty box, not a zero. A sentence saying
   what it will show and WHEN, out of the unlock table. A board
   of empty panels reads exactly like a broken page, which is the
   rule `/admin` already exists under.

   ---- a widget is a link ----

   Whatever it summarises has a page, and pressing it goes there.
   A number with no way through to its working is a decoration,
   and the board is not the tool: nothing exists only as a widget.

   ---- and nothing on it goes red ----

   Over target is drawn in the same weight as under target. There
   is no countdown and no colour that means failure. The one
   number that counts up is the streak, and `streak()` says at
   length why it counts showing up rather than hitting a target.
   ============================================================ */

import Link from "next/link";
import type { ReactNode } from "react";
import { T } from "./lang";

/** The frame. `href` is required rather than optional, because
    the rule above is easier to keep when the type will not let
    you break it. */
export function Widget({ href, title, children, wide }: {
  href: string;
  title: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Link href={href} className="dt-w" data-wide={wide ? "" : undefined}>
      <span className="dt-w-title">{title}</span>
      <span className="dt-w-body">{children}</span>
    </Link>
  );
}

/** What a widget says before there is anything to say. A date
    rather than a shrug: a reader can see it coming. */
export function Waiting({ en, bn }: { en: string; bn: string }) {
  return <span className="dt-w-waiting"><T en={en} bn={bn} /></span>;
}

/** A ring, for how much of today is left.

    A RING RATHER THAN A BAR, and that is not decoration: a bar
    fills up and then overflows, and an overflowing bar wants to
    be red. A ring closes. Over the target simply completes it
    and the number underneath says by how much, in the same
    weight as any other number. */
export function Ring({ done, total, label }: {
  done: number; total: number; label: ReactNode;
}) {
  const share = total > 0 ? Math.min(done / total, 1) : 0;
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <span className="dt-ring">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle className="dt-ring-track" cx="32" cy="32" r={R} />
        <circle
          className="dt-ring-fill" cx="32" cy="32" r={R}
          strokeDasharray={`${C * share} ${C}`}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className="dt-ring-mid">{label}</span>
    </span>
  );
}

/** A sparkline of the trend with the scale faint behind it.

    Server-renderable SVG with no library: the data is small, the
    shape is a path, and a chart that needs JavaScript is a chart
    that is blank in the second everybody judges a page in. */
export function Spark({ points, scale }: {
  points: Array<{ x: number; y: number }>;
  scale?: Array<{ x: number; y: number }>;
}) {
  if (points.length < 2) return null;
  const xs = points.map((p) => p.x);
  const all = [...points, ...(scale ?? [])].map((p) => p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...all), y1 = Math.max(...all);
  const at = (p: { x: number; y: number }): string => {
    const x = x1 === x0 ? 0 : ((p.x - x0) / (x1 - x0)) * 100;
    /* The y axis does NOT start at zero, because a weight chart
       that did would be unreadable. Section 28 requires that to
       be said out loud wherever it is drawn full size; a
       sparkline carries no axis at all, which is the honest
       version of the same thing. */
    const y = y1 === y0 ? 15 : 28 - ((p.y - y0) / (y1 - y0)) * 26;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };
  return (
    <svg className="dt-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      {scale && scale.length > 1
        ? <polyline className="dt-spark-raw" points={scale.map(at).join(" ")} />
        : null}
      <polyline className="dt-spark-line" points={points.map(at).join(" ")} />
    </svg>
  );
}

/** The last fourteen days as fourteen small marks: logged,
    weighed, both, neither. The calendar at a glance, and the one
    place the board shows absence without making it a reproach:
    an unlogged day is a lighter mark, never a gap and never a
    cross. */
export function Strip({ days }: { days: Array<{ date: string; kind: string }> }) {
  return (
    <span className="dt-strip">
      {days.map((d) => (
        <span key={d.date} className="dt-strip-day" data-kind={d.kind}
              title={d.date} aria-hidden="true" />
      ))}
    </span>
  );
}
