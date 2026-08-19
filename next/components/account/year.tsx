"use client";

/* ============================================================
   account/year.tsx: the four numbers, and a year of days.

   A day a week for a year is 52 squares and a day every day is
   365, and the difference between those two is the only thing
   the drawing is for. It is `days-active`, which `streak.js` has
   written since long before accounts and which `sync.js` carries
   as a UNION, so it is the true set of days across every device
   rather than whichever one synced last.

   WHAT IT IS NOT. There is no flame, nothing turns red, no square
   is a reproach and nothing here counts down. `streak.js` says
   the same thing at greater length and means it: a count of days
   is a fact somebody asked for, and a count of days with a threat
   attached is a different product.

   ---- both halves redraw on the same signal ----

   Every number here is localStorage, and localStorage on this
   page is a mirror written by `aab/sync.js` after the page has
   loaded. `subscribe()` in `next/lib/progress.ts` is what says so,
   and it hears `sync:done` as well as the two tick events. A
   component reading these keys once on mount shows the last
   visit's numbers and never moves.
   ============================================================ */

import { useEffect, useState } from "react";
import { subscribe } from "../../lib/progress";
import { runtimeModule } from "./runtime";
import { useProfile } from "./profile";
import { KEPT, countOf } from "./mirror";

type StreakModule = typeof import("/streak.js");

const streakModule = () => runtimeModule<StreakModule>("/streak.js");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** How many days a week each pace is aiming for. `sometimes` is
    zero on purpose: "no particular rhythm" is an answer, and a
    target under it would be a number nobody asked for. */
const PACE_TARGET: Record<string, number> = { daily: 7, often: 5, sometimes: 0 };

interface Counted {
  days: string[];
  week: number;
  streak: number;
  read: number;
  checks: number;
}

/** Everything both halves need, in one read of the module and one
    pass over the keys. */
function count(m: StreakModule): Counted {
  return {
    days: m.activeDays(),
    week: m.daysIn(7),
    streak: m.run(),
    read: KEPT.filter((k) => !k.single && !k.key.endsWith("-checks"))
      .reduce((n, k) => n + countOf(k), 0),
    checks: KEPT.filter((k) => k.key.endsWith("-checks"))
      .reduce((n, k) => n + countOf(k), 0),
  };
}

/** One square per day, back to the Sunday before this date last
    year, so the grid is whole columns and today is in the last
    one. A partial first column is the thing that makes one of
    these look broken.

    Built here rather than in the component because it is a
    calendar walk rather than a render, and because the same walk
    produces the month labels: a label sits above the week that
    contains the first of its month, which is how the eye reads
    these. */
function weeksBack(days: Set<string>, today: (at?: Date) => string) {
  const end = new Date();
  end.setHours(12, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  const weeks: Array<{ month: string; cells: Array<{
    key: string; on: boolean; today: boolean; off: boolean; title: string;
  }> }> = [];

  let seen = -1;
  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 7)) {
    const month = cursor.getMonth();
    const shows = month !== seen;
    if (shows) seen = month;

    const cells = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(cursor);
      day.setDate(day.getDate() + d);
      if (day > end) {
        cells.push({ key: `off-${d}`, on: false, today: false, off: true, title: "" });
        continue;
      }
      const key = today(day);
      const on = days.has(key);
      cells.push({
        key, on, today: key === today(), off: false,
        title: `${day.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}: ${
          on ? "you were here" : "nothing"}`,
      });
    }
    weeks.push({ month: shows ? MONTHS[month] : "", cells });
  }
  return weeks;
}

/** The four numbers above the fold. Facts, and no more than
    facts: this line never turns red and never counts down. */
export function Tiles() {
  const [now, setNow] = useState<Counted | null>(null);

  useEffect(() => {
    let live = true;
    const recount = () => {
      streakModule().then((m) => { if (live) setNow(count(m)); }).catch(() => {});
    };
    recount();
    const off = subscribe(recount);
    return () => { live = false; off(); };
  }, []);

  if (!now) return null;

  const tile = (n: number, label: string) => (
    <div className="acct-tile" key={label}>
      <strong className="mono">{n}</strong>
      <span>{label}</span>
    </div>
  );

  return (
    <>
      {tile(now.read, now.read === 1 ? "chapter finished" : "chapters finished")}
      {tile(now.checks, now.checks === 1 ? "checkpoint ticked" : "checkpoints ticked")}
      {tile(now.days.length, "days here")}
      {tile(now.streak, now.streak === 1 ? "day in a row" : "days in a row")}
    </>
  );
}

/** The sentence under the year grid. Its own component because it
    sits in a different card from the tiles, and both are one
    reading of `days-active`. */
export function Week() {
  const [week, setWeek] = useState<number | null>(null);
  const profile = useProfile();

  useEffect(() => {
    let live = true;
    const recount = () => {
      streakModule().then((m) => { if (live) setWeek(m.daysIn(7)); }).catch(() => {});
    };
    recount();
    const off = subscribe(recount);
    return () => { live = false; off(); };
  }, []);

  if (week === null) return null;

  const pace = profile?.pace ?? "";
  const target = PACE_TARGET[pace] ?? 0;
  const bits = [week === 1
    ? "One of the last seven days had something on it."
    : `${week} of the last seven days had something on them.`];
  if (target && week >= target) bits.push("That is the pace you set.");
  else if (target) {
    bits.push(`You said you were aiming for ${
      pace === "daily" ? "every day" : "most days"}.`);
  }

  return <>{bits.join(" ")}</>;
}

export function Year() {
  const [weeks, setWeeks] = useState<ReturnType<typeof weeksBack> | null>(null);
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    let live = true;
    const draw = () => {
      streakModule().then((m) => {
        if (!live) return;
        const days = new Set(m.activeDays());
        setFilled(days.size);
        setWeeks(weeksBack(days, m.today));
      }).catch(() => {});
    };
    draw();
    const off = subscribe(draw);
    return () => { live = false; off(); };
  }, []);

  if (!weeks) return null;

  return (
    <>
      <div className="heat-months" aria-hidden="true">
        {weeks.map((week, n) => (
          <span className="heat-month" key={n}>{week.month}</span>
        ))}
      </div>
      <div className="heat-grid" role="img"
           aria-label={`${filled} days with something on them in the last year`}>
        {weeks.map((week, n) => (
          <div className="heat-week" key={n}>
            {week.cells.map((cell, d) => (
              <i key={`${n}-${d}-${cell.key}`} className="heat-cell"
                 data-on={cell.on ? "" : undefined}
                 data-off={cell.off ? "" : undefined}
                 data-today={cell.today ? "" : undefined}
                 title={cell.title || undefined} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
