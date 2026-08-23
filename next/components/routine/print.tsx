"use client";

/* ============================================================
   routine/print.tsx: the week on paper.

   TWO THINGS, ONE BOOLEAN APART, and that is the whole design:

     BLANK is the paper fallback. Seven columns, the tasks down
     the side, empty boxes. It is what somebody prints when they
     would rather have a pen than a phone, and it is the reason
     this page exists at all: a routine that only works on a
     screen is a routine that stops on the day the screen is flat.

     FILLED is a keepsake. The same grid with last week's marks
     in it, the counts that only go up, and a few lines out of
     the jar, in her own handwriting.

   ---- what it deliberately does not have ----

   No percentage on the page and no total. A sheet of paper is
   read once and kept, and a number on it can only ever be a
   verdict on a week that is already over.

   The chrome is hidden by `@media print` in the stylesheet,
   which already hides the rail, the bar and the footer, so this
   file draws a page and not a page-minus-a-site.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import {
  everMarked, written, bandTasks, seasonOf,
  type Band, type Task, type RoutineShape, type Entry,
  GROWN,
} from "@reiad/shared/routine";
import { runtimeModule } from "../account/runtime";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";

type AccountModule = typeof import("/account.js");
type RoutineModule = typeof import("/routine.js");
const accountModule = () => runtimeModule<AccountModule>("/account.js");
const routineModule = () => runtimeModule<RoutineModule>("/routine.js");

const BN = Array.from({ length: 10 }, (_, i) => String.fromCharCode(0x09e6 + i)).join("");
const bn = (n: number | string): string => String(n).replace(/\d/g, (d) => BN[Number(d)]);


/** The seven days ending on `to`, oldest first. */
function week(to: string): string[] {
  const out: string[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(`${to}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

const shortDay = (iso: string): string => new Intl.DateTimeFormat("en-GB", {
  weekday: "short", timeZone: "UTC",
}).format(new Date(`${iso}T12:00:00Z`));

const dayNum = (iso: string): string => String(Number(iso.slice(8, 10)));

export function RoutinePrint() {
  const [ready, setReady] = useState(false);
  const [shape, setShape] = useState<RoutineShape | null>(null);
  const [name, setName] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [today, setToday] = useState("");
  /* Blank first, because the blank sheet is the one somebody
     prints in a hurry and the keepsake is the one they choose. */
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [acc, rt] = await Promise.all([accountModule(), routineModule()]);
        if (!acc.current()) return;
        const mine = await rt.activeRoutine();
        if (!live || !mine) return;
        const day = rt.todayFor(4);
        const all = await rt.daysBetween("1970-01-01", "2999-12-31");
        if (!live) return;
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

  const days = useMemo(() => (today ? week(today) : []), [today]);
  const by = useMemo(() => new Map(entries.map((e) => [e.entry_date, e])), [entries]);

  if (!ready) return <p className="rt-quiet" role="status">এক মুহূর্ত…</p>;
  if (!shape || !today) {
    return <p className="rt-quiet">Sign in on the routine page and this fills in.</p>;
  }

  const live = shape.tasks.filter((t) => !t.archived).sort((a, b) => a.order - b.order);
  const notes = written(entries).slice(0, 4);
  const birds = everMarked(entries, GROWN.birds);
  const plants = everMarked(entries, GROWN.plants);
  const season = seasonOf(today);

  return (
    <>
      {/* The controls, and they are the one thing that is not on
          the paper: `@media print` takes them away. */}
      <div className="rt-print-controls">
        <ChipButton pressed={!filled} onClick={() => setFilled(false)}>blank</ChipButton>
        <ChipButton pressed={filled} onClick={() => setFilled(true)}>this week</ChipButton>
        <Button kind="ghost" size="sm" onClick={() => window.print()}>print</Button>
      </div>

      <article className="rt-sheet" data-filled={filled ? "" : undefined}>
        <header className="rt-sheet-head">
          <h2>{name}</h2>
          <p className="rt-quiet">
            <span lang="bn">{season.bn}</span>
            {filled ? ` · ${days[0]} to ${days[6]}` : null}
          </p>
        </header>

        <table className="rt-grid">
          <thead>
            <tr>
              <th scope="col" className="rt-grid-task"> </th>
              {days.map((d) => (
                <th scope="col" key={d}>
                  <span className="rt-grid-dow">{shortDay(d)}</span>
                  {/* The date only on a filled sheet. A blank one
                      is for any week, which is what makes it worth
                      printing more than once. */}
                  {filled ? <span className="rt-grid-num">{dayNum(d)}</span> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...shape.bands].sort((a, b) => a.order - b.order).flatMap((band) => {
              const tasks = bandTasks(shape, band.id);
              if (tasks.length === 0) return [];
              return [
                <tr className="rt-grid-band" key={`b-${band.id}`}>
                  <th scope="rowgroup" colSpan={8}>{band.bn} · {band.en}</th>
                </tr>,
                ...tasks.map((task) => (
                  <tr key={task.id}>
                    <th scope="row" className="rt-grid-task">
                      {task.bn}
                      {task.counts ? null : <span className="rt-quiet"> ·</span>}
                    </th>
                    {days.map((d) => {
                      const m = by.get(d)?.marks[task.id] ?? 0;
                      return (
                        <td key={d}>
                          {/* A pen mark on paper, drawn: a full
                              tick or a half one. On a blank sheet
                              every box is empty and that is the
                              point of it. */}
                          {filled && m > 0 ? (
                            <span className="rt-grid-mark" data-half={m < 1 ? "" : undefined}>
                              {m >= 1 ? "✓" : "/"}
                            </span>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                )),
              ];
            })}
            {/* One row with nothing printed in it, on both sheets.
                A week always has something the list did not know
                about, and a grid with no room for it is a grid
                that says the list is the whole of a life. */}
            <tr className="rt-grid-spare">
              <th scope="row" className="rt-grid-task">
                {live.length > 0 ? "…" : "…"}
              </th>
              {days.map((d) => <td key={d} />)}
            </tr>
          </tbody>
        </table>

        {/* THE KEEPSAKE HALF. Never on a blank sheet, because a
            blank sheet is for a week that has not happened. */}
        {filled ? (
          <footer className="rt-sheet-foot">
            {notes.length > 0 ? (
              <ul className="rt-sheet-notes">
                {notes.map((e) => (
                  <li key={e.entry_date}>
                    <span className="rt-hand">{e.note}</span>
                    <cite>{e.entry_date}</cite>
                  </li>
                ))}
              </ul>
            ) : null}
            {/* The counts that only go up, and they are the only
                numbers on the paper. Nothing here is out of
                anything: they are a total, not a score. */}
            {birds + plants > 0 ? (
              <p className="rt-sheet-count mono">
                {birds > 0 ? `পাখি ${bn(birds)}` : ""}
                {birds > 0 && plants > 0 ? " · " : ""}
                {plants > 0 ? `গাছ ${bn(plants)}` : ""}
              </p>
            ) : null}
          </footer>
        ) : null}
      </article>
    </>
  );
}
