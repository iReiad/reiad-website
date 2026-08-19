"use client";

/* ============================================================
   routine/dashboard.tsx: the routine, as a tool.

   This replaced a checklist. The first version of `/tools/routine`
   was two tabs over a list of tickable rows, and beside the stock
   check and the scorecard it read as a note-taking app that had
   wandered into a toolbox. What a tool on this site looks like is
   settled: a hero that states the answer, dense panels of real
   numbers under it, charts drawn from the reader's own data, and
   the data downloadable.

   ---- what it draws, and where each number comes from ----

   Everything here is computed in `shared/routine.ts`, which is
   the same module the print sheet and the year view read, and
   which the Worker could read too. Nothing is computed in this
   file: a component that does its own arithmetic is a second
   answer to a question the engine already answers, and the two
   drift.

   | the ring        | done()      | today, out of the day's tasks |
   | the hours       | hoursDone() | a tick is not an hour         |
   | the sparkline   | series()    | 28 days, gaps kept as gaps    |
   | the trend       | momentum()  | this 28 against the last 28   |
   | the runs        | runs()      | offered, never counted down   |
   | the heatmap     | heat()      | twelve weeks                  |
   | the weekdays    | weekdays()  | which day actually carries    |
   | the bands       | bandRates() | which part of the day carries |
   | the tasks       | consistency() | ranked, best and worst      |
   | the ribbon      | moodRibbon() | how the days felt            |
   | the jar         | written()   | what was written in them      |
   | birds, plants   | flock(), garden() | the two that only grow  |

   ---- the one rule every chart here obeys ----

   AN UNMARKED DAY IS NOT A ZERO. `done()` returns null for a day
   nobody touched, and every mean in the engine skips it. A chart
   that drew it as zero would tell somebody who took a week off
   that they failed for a week, which is the opposite of what this
   is for. The sparkline draws a gap, the heatmap draws the empty
   cell, and neither is counted.

   ---- and it can be ticked from here ----

   The day is on the dashboard, not behind a tab, because the
   whole brief is that somebody can open this, mark three things
   and close it. A dashboard you have to navigate out of to use is
   a dashboard nobody opens twice.
   ============================================================ */

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  done, hours, hoursDone, series, momentum, runs, weekdays, bandRates,
  heat, consistency, balance, moodRibbon, written, neverMarked,
  everMarked, flock, garden, seasonOf, greeting, moodColour, bandTasks,
  exportName, toExport,
  type Band, type Task, type RoutineShape, type Entry,
} from "@reiad/shared/routine";
import { runtimeModule } from "../account/runtime";
import { Button, ButtonLink } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Surface } from "../ui/surface";

type AccountModule = typeof import("/account.js");
type RoutineModule = typeof import("/routine.js");
const accountModule = () => runtimeModule<AccountModule>("/account.js");
const routineModule = () => runtimeModule<RoutineModule>("/routine.js");

const BN = Array.from({ length: 10 }, (_, i) => String.fromCharCode(0x09e6 + i)).join("");
const bn = (n: number | string): string => String(n).replace(/\d/g, (d) => BN[Number(d)]);
const pct = (v: number): string => `${Math.round(v * 100)}%`;

const BIRDS = "brd";
const PLANTS = "pln";

/* ---------- the ring ----------

   An SVG rather than a conic-gradient, because the number goes in
   the middle and a gradient cannot carry a hole. 44 units square
   at any drawn size, so one component serves the hero and the
   band rows. */
function Ring({ value, size = 132 }: { value: number | null; size?: number }) {
  const r = 19;
  const c = 2 * Math.PI * r;
  const v = value ?? 0;
  return (
    <svg className="rt-ring" viewBox="0 0 44 44" width={size} height={size}
         role="img" aria-label={value === null ? "আজ এখনো খালি" : `${pct(v)} done today`}>
      <circle cx="22" cy="22" r={r} fill="none" strokeWidth="3.2" className="rt-ring-track" />
      <circle cx="22" cy="22" r={r} fill="none" strokeWidth="3.2" className="rt-ring-fill"
              strokeDasharray={`${c * v} ${c}`} strokeLinecap="round"
              transform="rotate(-90 22 22)" />
      <text x="22" y="23.6" textAnchor="middle" className="rt-ring-num">
        {value === null ? "·" : Math.round(v * 100)}
      </text>
      {value === null ? null : <text x="22" y="29" textAnchor="middle" className="rt-ring-unit">%</text>}
    </svg>
  );
}

/* ---------- the sparkline ----------

   A gap is a gap. The path is BROKEN at every unmarked day rather
   than joined across it, which is why this builds segments instead
   of one `d` string: a line drawn through a fortnight nobody
   marked is a line claiming something happened. */
function Spark({ points }: { points: Array<{ date: string; value: number | null }> }) {
  const w = 100;
  const h = 26;
  const step = points.length > 1 ? w / (points.length - 1) : w;
  const segs: string[] = [];
  let run: string[] = [];
  points.forEach((p, i) => {
    if (p.value === null) { if (run.length > 1) segs.push(run.join(" ")); run = []; return; }
    run.push(`${run.length ? "L" : "M"}${(i * step).toFixed(1)},${(h - p.value * h).toFixed(1)}`);
  });
  if (run.length > 1) segs.push(run.join(" "));

  return (
    <svg className="rt-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
         role="img" aria-label="The last four weeks">
      {segs.map((d) => <path key={d.slice(0, 24)} d={d} fill="none" strokeWidth="1.6" />)}
      {points.map((p, i) => (p.value === null ? null : (
        <circle key={p.date} cx={i * step} cy={h - p.value * h} r="0.9" className="rt-spark-dot" />
      )))}
    </svg>
  );
}

/** One row of a `<ul className="rt-bars">`, which is the bar the
    year view already draws: `.rt-bar` is the track, `.rt-bar i`
    the fill off `--of`, and the three columns are named, barred
    and numbered. Reused rather than rewritten, because a second
    bar with its own class is the drift the component library
    exists to stop. */
function Bar({ label, sub, value, marked }: {
  label: string; sub?: string; value: number; marked: number;
}) {
  return (
    <li>
      <span className="rt-bar-name" lang="bn">
        {label}{sub ? <em className="mono"> {sub}</em> : null}
      </span>
      <span className="rt-bar" style={{ "--of": value } as CSSProperties}><i /></span>
      {/* A dot rather than 0%, for the rule at the top of this
          file: nothing marked is not nothing done. */}
      <span className="rt-bar-n mono">{marked === 0 ? "\u00b7" : pct(value)}</span>
    </li>
  );
}

export function RoutineDashboard() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [routineId, setRoutineId] = useState("");
  const [name, setName] = useState("");
  const [shape, setShape] = useState<RoutineShape | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [today, setToday] = useState("");
  const [saving, setSaving] = useState(false);
  const [said, setSaid] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [acc, rt] = await Promise.all([accountModule(), routineModule()]);
        if (!acc.current()) return;
        if (live) setSignedIn(true);
        const mine = await rt.activeRoutine();
        if (!live || !mine) return;
        const day = rt.todayFor(4);
        const all = await rt.daysBetween("1970-01-01", "2999-12-31");
        if (!live) return;
        setRoutineId(mine.id);
        setName(mine.name);
        setShape({ bands: mine.bands as Band[], tasks: mine.tasks as Task[] });
        setEntries(all.map((e): Entry => ({
          entry_date: e.entry_date, marks: e.marks ?? {},
          mood: e.mood, note: e.note, chose: e.chose,
        })));
        setToday(day);
      } finally { if (live) setReady(true); }
    })();
    return () => { live = false; };
  }, []);

  const byDate = useMemo(() => new Map(entries.map((e) => [e.entry_date, e])), [entries]);
  const now = today ? byDate.get(today) ?? null : null;

  /** Ticking from the dashboard sends the WHOLE day, for the
      reason `saveDay()` gives: a partial upsert with
      merge-duplicates REPLACES the row, so a half-day would erase
      the note and the mood. */
  const mark = useCallback(async (taskId: string, to: number) => {
    if (!routineId || !today) return;
    const at = byDate.get(today);
    const marks = { ...(at?.marks ?? {}) };
    if (to > 0) marks[taskId] = to; else delete marks[taskId];
    const next: Entry = {
      entry_date: today, marks,
      mood: at?.mood ?? null, note: at?.note ?? null, chose: at?.chose ?? null,
    };
    setEntries((was) => [...was.filter((e) => e.entry_date !== today), next]);
    setSaving(true);
    try {
      const rt = await routineModule();
      await rt.saveDay(routineId, today, {
        marks, mood: next.mood, note: next.note, chose: next.chose,
      });
    } finally { setSaving(false); }
  }, [routineId, today, byDate]);

  const download = useCallback(() => {
    if (!shape || !today) return;
    const blob = new Blob(
      [JSON.stringify(toExport({ name, ...shape }, entries, today), null, 2)],
      { type: "application/json" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = exportName(today);
    a.click();
    URL.revokeObjectURL(a.href);
    setSaid("Saved to your device.");
  }, [shape, entries, name, today]);


  if (!ready) return <p className="rt-quiet" role="status">এক মুহূর্ত…</p>;

  if (!signedIn) {
    return (
      <Surface material="pane" className="rt-empty">
        <h2>রুটিন</h2>
        <p>এটা আপনার নিজের। সাইন ইন করলে এই ডিভাইসে আর আপনার ফোনে একই থাকবে।</p>
        <p className="rt-quiet">Your routine lives on your account, so it is the same on
          every device you sign in on. Nothing here is shared with anybody.</p>
        <ButtonLink kind="solid" href="/account">Sign in</ButtonLink>
      </Surface>
    );
  }

  if (!shape || !today) {
    return (
      <Surface material="pane" className="rt-empty">
        <h2>শুরু করা যাক</h2>
        <p>একটা টেমপ্লেট বেছে নিন, বা খালি থেকে নিজেরটা বানান।</p>
        <ButtonLink kind="solid" href="/tools/routine/settings">Build your routine</ButtonLink>
      </Surface>
    );
  }

  /* ---- everything the panels draw, all of it out of the engine ---- */
  const todayDone = done(shape, now);
  const todayHours = hoursDone(shape, now);
  const plan = hours(shape);
  const spark = series(shape, entries, today, 28);
  const mo = momentum(shape, entries, today, 28);
  const run = runs(entries, today);
  const cells = heat(shape, entries, today);
  const days = weekdays(shape, entries, today);
  const bands = bandRates(shape, entries, today);
  const tally = consistency(shape, entries, today);
  const shares = balance(shape, entries);
  const ribbon = moodRibbon(entries, today, 84);
  const notes = written(entries).slice(0, 5);
  const waiting = neverMarked(shape, entries);
  const birds = everMarked(entries, BIRDS);
  const plants = everMarked(entries, PLANTS);
  const season = seasonOf(today);
  const hi = greeting(new Date().getHours());
  const live = [...shape.bands].sort((a, b) => a.order - b.order);
  const trend = mo.now - mo.before;
  const marked = entries.filter((e) => done(shape, e) !== null).length;

  return (
    <div className="rt-dash">

      {/* ---------- the hero ---------- */}
      <Surface material="glass" className="rt-hero">
        <div className="rt-hero-ring">
          <Ring value={todayDone} />
          <p className="rt-hero-when mono">
            {saving ? "saving…" : todayDone === null ? "আজ এখনো খালি" : "আজ"}
          </p>
        </div>

        <div className="rt-hero-said">
          <p className="rt-hero-hi" lang="bn">{hi.bn}</p>
          <h2>{name}</h2>
          <p className="rt-quiet">
            <span lang="bn">{season.bn}</span> · {season.en}
          </p>
          <Spark points={spark} />
        </div>

        <dl className="rt-hero-stats">
          <div>
            <dt>আজকের ঘণ্টা</dt>
            <dd className="mono">{todayHours.done.toFixed(1)}<em>/{todayHours.planned.toFixed(1)}h</em></dd>
          </div>
          <div>
            <dt>শেষ ২৮ দিন</dt>
            <dd className="mono" data-trend={trend > 0.02 ? "up" : trend < -0.02 ? "down" : undefined}>
              {mo.marked ? pct(mo.now) : "·"}
              {mo.marked && mo.before ? <em>{trend >= 0 ? "▲" : "▼"} {pct(Math.abs(trend))}</em> : null}
            </dd>
          </div>
          <div>
            <dt>এখনকার ধারা</dt>
            {/* Offered, never counted down. `best` can be bigger
                than `now` and that is fine: nothing is lost by
                having broken one. */}
            <dd className="mono">{bn(run.now)}<em>best {bn(run.best)}</em></dd>
          </div>
          <div>
            <dt>যত দিন লেখা</dt>
            <dd className="mono">{bn(marked)}<em>days</em></dd>
          </div>
        </dl>
      </Surface>

      {/* ---------- today, tickable from here ---------- */}
      <Surface material="pane" className="rt-panel rt-full rt-today">
        <header className="rt-panel-head">
          <h3>আজকের দিন <span className="rt-quiet">· Today</span></h3>
          <ButtonLink kind="ghost" size="sm" href="/tools/routine/day">the full day</ButtonLink>
        </header>
        <div className="rt-today-bands">
          {live.map((band) => {
            const tasks = bandTasks(shape, band.id);
            if (!tasks.length) return null;
            return (
              <section className="rt-today-band" key={band.id}>
                <h4><span lang="bn">{band.bn}</span> <em className="mono">{band.en}</em></h4>
                <ul>
                  {tasks.map((t) => {
                    const m = now?.marks[t.id] ?? 0;
                    return (
                      <li key={t.id}>
                        <ChipButton pressed={m >= 1}
                                    onClick={() => mark(t.id, m >= 1 ? 0 : 1)}>
                          <span aria-hidden="true">{m >= 1 ? "✓" : "○"}</span>
                          <span lang="bn">{t.bn}</span>
                          {t.counts ? <em className="mono">{bn(everMarked(entries, t.id))}</em> : null}
                        </ChipButton>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </Surface>

      {/* ---------- twelve weeks ---------- */}
      <Surface material="pane" className="rt-panel rt-wide">
        <header className="rt-panel-head"><h3>শেষ বারো সপ্তাহ <span className="rt-quiet">· Twelve weeks</span></h3></header>
        {/* `heat()` returns a flat run of days, oldest first, and
            the weeks are the LAYOUT's business: seven to a column,
            so the grid reads down like a calendar. Slicing here
            rather than in the engine keeps one shape of answer for
            the print sheet and this to share. */}
        <div className="rt-heat" role="group" aria-label="The last twelve weeks">
          {Array.from({ length: Math.ceil(cells.length / 7) }, (_, w) => cells.slice(w * 7, w * 7 + 7))
            .map((week) => (
              <div className="rt-heat-week" key={week[0].date}>
                {week.map((cell) => (
                  <span key={cell.date} className="rt-heat-day"
                        /* `--fill` and not a level attribute: the
                           cell's rule mixes the accent into the
                           sunk paper at that fraction, which is
                           what makes an unmarked day the page
                           rather than a hole in it. */
                        style={{ "--fill": cell.fraction ?? 0 } as CSSProperties}
                        data-here={cell.date === today ? "" : undefined}
                        title={`${cell.date}${cell.fraction === null ? "" : ` \u00b7 ${pct(cell.fraction)}`}`} />
                ))}
              </div>
            ))}
        </div>
        <p className="rt-quiet rt-heat-key">
          A day nobody marked is left empty. It is not a nought.
        </p>
      </Surface>

      {/* ---------- which weekday actually carries ---------- */}
      <Surface material="pane" className="rt-panel">
        <header className="rt-panel-head"><h3>সপ্তাহের ছন্দ <span className="rt-quiet">· Your week</span></h3></header>
        <ul className="rt-bars">
          {days.map((d) => <Bar key={d.day} label={d.bn} sub={d.en} value={d.rate} marked={d.marked} />)}
        </ul>
      </Surface>

      {/* ---------- which part of the day carries ---------- */}
      <Surface material="pane" className="rt-panel">
        <header className="rt-panel-head"><h3>দিনের ভাগ <span className="rt-quiet">· By part of the day</span></h3></header>
        <ul className="rt-bars">
          {bands.map((b) => <Bar key={b.id} label={b.bn} sub={b.en} value={b.rate} marked={b.marked} />)}
        </ul>
        <div className="rt-balance" role="img"
             aria-label="Where a usual day goes">
          {shares.map((sh) => (
            <i key={sh.band.id} style={{ "--of": sh.share } as CSSProperties}
               title={`${sh.band.en} \u00b7 ${pct(sh.share)}`} />
          ))}
        </div>
        <p className="rt-quiet">
          {plan.planned.toFixed(1)} hours planned, {plan.free.toFixed(1)} left over.
        </p>
      </Surface>

      {/* ---------- every task, ranked ---------- */}
      <Surface material="pane" className="rt-panel rt-wide">
        <header className="rt-panel-head"><h3>কোনটা টিকেছে <span className="rt-quiet">· What has stuck</span></h3></header>
        <ul className="rt-bars">
          {tally.map((t) => (
            <Bar key={t.task.id} label={t.task.bn}
                 value={t.of ? t.marked / t.of : 0} marked={t.marked} />
          ))}
        </ul>
        {waiting.length ? (
          <p className="rt-quiet">
            {/* Never scolding. A task nobody has touched is a task
                still waiting, which is a different sentence from
                a task somebody failed. */}
            Still waiting: {waiting.map((t) => t.bn).join(", ")}
          </p>
        ) : null}
      </Surface>

      {/* ---------- how the days felt ---------- */}
      <Surface material="pane" className="rt-panel rt-half">
        <header className="rt-panel-head"><h3>কেমন গেল <span className="rt-quiet">· How it felt</span></h3></header>
        <div className="rt-ribbon" role="img" aria-label="Twelve weeks of moods">
          {ribbon.map((r) => (
            <i key={r.date} title={r.date}
               style={{ background: r.mood ? moodColour(r.mood) : undefined }}
               data-none={r.mood ? undefined : ""} />
          ))}
        </div>
      </Surface>

      {/* ---------- the two that only grow ---------- */}
      <Surface material="pane" className="rt-panel rt-half">
        <header className="rt-panel-head"><h3>যা শুধু বাড়ে <span className="rt-quiet">· These only go up</span></h3></header>
        <p className="rt-flock" aria-label={`${flock(birds)} birds`}>
          {Array.from({ length: flock(birds) }, (_, i) => <span key={i}>🕊</span>)}
        </p>
        <p className="rt-garden">
          {garden(plants).map((g) => <span key={g.en} title={g.en} lang="bn">{g.bn}</span>)}
        </p>
        <p className="rt-quiet mono">পাখি {bn(birds)} · গাছ {bn(plants)}</p>
      </Surface>

      {/* ---------- the jar ---------- */}
      <Surface material="pane" className="rt-panel rt-half">
        <header className="rt-panel-head"><h3>যা যা লিখেছি <span className="rt-quiet">· The jar</span></h3></header>
        {notes.length ? (
          <ul className="rt-jar-list">
            {notes.map((e) => (
              <li key={e.entry_date}>
                <span className="rt-hand">{e.note}</span>
                <cite className="mono">{e.entry_date}</cite>
              </li>
            ))}
          </ul>
        ) : <p className="rt-quiet">Nothing written yet. The day view has a line for it.</p>}
      </Surface>

      {/* ---------- and what you can do with all of it ---------- */}
      <Surface material="pane" className="rt-panel rt-half">
        <header className="rt-panel-head"><h3>আপনার নিজের <span className="rt-quiet">· It is yours</span></h3></header>
        <div className="rt-action-row">
          <ButtonLink kind="ghost" size="sm" href="/tools/routine/settings">Settings and templates</ButtonLink>
          <ButtonLink kind="ghost" size="sm" href="/tools/routine/print">Print a week</ButtonLink>
          <Button kind="ghost" size="sm" onClick={download}>Download everything</Button>
          {/* One importer, and it is on the settings page. Putting
              a second here would mean two places deciding what to
              do with a file that already holds days: keep both,
              keep mine, keep theirs. `mergeDays()` answers that
              once and the page that asks it is the one with the
              question on it. */}
          <ButtonLink kind="ghost" size="sm" href="/tools/routine/settings#data">
            Upload a saved one
          </ButtonLink>
        </div>
        {said ? <p className="rt-quiet" role="status">{said}</p> : null}
        <p className="rt-quiet">
          One JSON file with the shape of your routine and every day in it.
          Leaving should be as easy as arriving.
        </p>
      </Surface>
    </div>
  );
}
