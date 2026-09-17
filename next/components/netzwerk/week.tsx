"use client";

/* This week, and the whole plan. The week is the page a learner
   opens every evening: six days, the one that is today marked, the
   grammar focus, the speaking goal, the milestone and one tick. The
   plan is the same 52 or 40 rows as a sheet. */

import { useState } from "react";
import {
  planFor, today, weekAt, weekStart, type Learner, type Week,
} from "@reiad/shared/netzwerk";
import { Button } from "../ui/button";
import { Chip } from "../ui/chip";
import { Head, LevelChip, Sheet, Td, Tick, accentOf, dateWord, dayWord } from "./bits";

const DAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const KIND_WORD: Record<string, string> = {
  chapter: "chapter", plattform: "Plattform", review: "review", drill: "drill",
  mock: "mock exam", exam: "exam week", bridge: "bridge", bridgeTest: "bridge test",
  consolidation: "consolidation",
};

/** The week to open with: the one today falls in, else the first
    not ticked, else the last. */
export function currentWeek(learner: Learner, weeks: Week[]): number {
  const byDate = weekAt(learner.start, today(), weeks.length);
  if (byDate) return byDate;
  const first = weeks.find((w) => !learner.weeks[String(w.n)]);
  return first ? first.n : weeks.length;
}

export function WeekPanel({ learner, update }: {
  learner: Learner;
  update: (fn: (l: Learner) => Learner) => void;
}) {
  const weeks = planFor(learner.route);
  const [at, setAt] = useState<number | null>(null);
  const n = at ?? currentWeek(learner, weeks);
  const week = weeks[n - 1];
  const start = weekStart(learner.start, n);
  const on = today();
  const done = Boolean(learner.weeks[String(n)]);
  const before = today() < learner.start;

  return (
    <section id="week" aria-labelledby="nw-week-h">
      <Head en="This week" bn="এই সপ্তাহ"
            note={before
              ? `Your plan starts on ${dateWord(learner.start)}. This is week 1.`
              : "Six sessions. Tick the week on Saturday if all six happened, and never skip a session to catch up: move the start date instead."} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button kind="ghost" size="sm" disabled={n <= 1} onClick={() => setAt(n - 1)}>← Week {n - 1}</Button>
        <b className="text-t7">Week {n} of {weeks.length}</b>
        <span className="font-code text-t2 text-ink-soft">{dateWord(start)}</span>
        <LevelChip level={week.level} />
        <Button kind="ghost" size="sm" disabled={n >= weeks.length} onClick={() => setAt(n + 1)}>Week {n + 1} →</Button>
        {at !== null && at !== currentWeek(learner, weeks) ? (
          <Button kind="quiet" size="sm" onClick={() => setAt(null)}>Back to today</Button>
        ) : null}
      </div>

      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {week.days.map((s, i) => {
          const date = weekStart(learner.start, n).slice(0, 10);
          const iso = addDaysLocal(date, i);
          const isToday = iso === on;
          return (
            <li key={i}
                className={[
                  "grid gap-1.5 rounded-card border bg-panel p-4",
                  isToday ? "border-accent bg-accent-soft shadow-[var(--shadow-lift)]" : "border-hairline",
                ].join(" ")}
                style={s.chapter ? accentOf(s.chapter.level) : accentOf(week.level)}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-code text-t1 uppercase tracking-wider text-ink-soft">
                  {DAY[i]} · {dayWord(iso).replace(/^\w+\s/, "")}
                </span>
                {isToday ? <Chip tone="accent">today</Chip> : <Chip>{KIND_WORD[s.kind] ?? s.kind}</Chip>}
              </div>
              <p className="text-t5 leading-snug">{s.text}</p>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-card border border-hairline bg-panel p-4">
          <span className="font-code text-t1 uppercase tracking-wider text-accent">Grammar focus</span>
          <p className="mt-1 text-t5">{week.focus}</p>
        </div>
        <div className="rounded-card border border-hairline bg-panel p-4">
          <span className="font-code text-t1 uppercase tracking-wider text-accent">Speaking goal</span>
          <p className="mt-1 text-t5">{week.speaking}</p>
        </div>
        <div className="rounded-card border border-hairline bg-panel p-4">
          <span className="font-code text-t1 uppercase tracking-wider text-accent">Milestone</span>
          <p className="mt-1 text-t5">{week.milestone || "Keep the rhythm. Nothing to score this week."}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Tick on={done} onToggle={() => update((l) => ({ ...l, weeks: { ...l.weeks, [String(n)]: !done } }))}>
          {done ? "Week done" : "Mark this week done"}
        </Tick>
        <span className="text-t3 text-ink-soft">
          {Object.values(learner.weeks).filter(Boolean).length} of {weeks.length} weeks ticked
        </span>
      </div>
    </section>
  );
}

/* `addDays` lives in shared; a local copy for a day inside the
   week keeps this file's imports to what it draws. */
function addDaysLocal(iso: string, days: number): string {
  const t = Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
  return new Date(t + days * 86_400_000).toISOString().slice(0, 10);
}

export function PlanPanel({ learner, update }: {
  learner: Learner;
  update: (fn: (l: Learner) => Learner) => void;
}) {
  const weeks = planFor(learner.route);
  const now = currentWeek(learner, weeks);
  return (
    <section id="plan" aria-labelledby="nw-plan-h">
      <Head en="The whole plan" bn="পুরো পরিকল্পনা"
            note={`Route ${learner.route}: ${weeks.length} weeks from ${dateWord(learner.start)}. Slipped a week? Move the start date or accept the slip; never skip sessions to catch up.`} />
      <Sheet label="Week-by-week plan"
             head={["Wk", "Starts", "Level", ...DAY, "Grammar focus", "Milestone", "Done"]}>
        {weeks.map((w) => {
          const done = Boolean(learner.weeks[String(w.n)]);
          const here = w.n === now;
          return (
            <tr key={w.n} className={here ? "bg-accent-soft" : done ? "opacity-70" : undefined}
                style={accentOf(w.level)}>
              <Td className="font-code">{w.n}</Td>
              <Td className="whitespace-nowrap font-code">{dateWord(weekStart(learner.start, w.n))}</Td>
              <Td><LevelChip level={w.level} /></Td>
              {w.days.map((s, i) => (
                <Td key={i} className="min-w-[10rem] text-t2">{s.text}</Td>
              ))}
              <Td className="min-w-[14rem] text-t2">{w.focus}</Td>
              <Td className="min-w-[10rem] text-t2 text-ink-soft">{w.milestone}</Td>
              <Td>
                <input type="checkbox" checked={done} className="accent-accent size-4"
                       aria-label={`Week ${w.n} done`}
                       onChange={() => update((l) => ({ ...l, weeks: { ...l.weeks, [String(w.n)]: !done } }))} />
              </Td>
            </tr>
          );
        })}
      </Sheet>
    </section>
  );
}
