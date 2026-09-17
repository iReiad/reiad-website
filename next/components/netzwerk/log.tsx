"use client";

/* The daily log and the weekly practice tracker: one line per
   session, thirty seconds at the end of block five, and one row per
   week of targets against actuals with the sheet's score. */

import { useState, type FormEvent } from "react";
import {
  addDays, logSummary, planFor, practiceAverage, practiceScore, runOfDays, today,
  weekStart, weeklyTargets, type Learner, type LogEntry, type PracticeWeek,
} from "@reiad/shared/netzwerk";
import { uid } from "../../lib/netzwerk-store";
import { Field, Select, TextArea } from "../ui/field";
import { Button } from "../ui/button";
import { Chip, ChipButton } from "../ui/chip";
import { StatRow, StatTile } from "../ui/stat";
import { Head, LevelChip, Sheet, Td, Tick, accentOf, dateWord, dayWord } from "./bits";
import { Bars, HeatStrip } from "./charts";

const TYPES = ["Chapter session", "Bridge A", "Bridge B", "Bridge skim", "Plattform", "Review + speaking lab",
  "Weak-spot drill", "Mock exam", "Bridge test", "Consolidation", "Buffer", "Minimum day (15 min)"];

export function LogPanel({ learner, update }: {
  learner: Learner;
  update: (fn: (l: Learner) => Learner) => void;
}) {
  const on = today();
  const s = logSummary(learner.log, on);
  const run = runOfDays(learner.log, on);
  const [energy, setEnergy] = useState(0);
  const [reviews, setReviews] = useState(true);
  const [writing, setWriting] = useState(false);
  const id = (k: string) => `nw-log-${k}`;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const num = (k: string) => Number(f.get(k) || 0);
    const entry: LogEntry = {
      id: uid(),
      date: String(f.get("date") || on),
      level: String(f.get("level") || ""),
      chapter: String(f.get("chapter") || ""),
      type: String(f.get("type") || TYPES[0]),
      minutes: num("minutes"), cards: num("cards"), reviews,
      speaking: num("speaking"), listening: num("listening"), writing,
      energy, hard: String(f.get("hard") || ""),
    };
    update((l) => ({ ...l, log: [entry, ...l.log] }));
    e.currentTarget.reset();
    setEnergy(0); setWriting(false); setReviews(true);
  };

  /* Twelve weeks of days for the heat strip, Monday first, ending
     on the Saturday of this week. */
  const monday = (() => {
    const d = new Date(`${on}T00:00:00Z`).getUTCDay();
    return addDays(on, d === 0 ? -6 : 1 - d);
  })();
  const first = addDays(monday, -77);
  const byDay = new Map<string, number>();
  for (const e of learner.log) byDay.set(e.date, (byDay.get(e.date) ?? 0) + (e.minutes || 0));
  const days = Array.from({ length: 84 }, (_, i) => {
    const date = addDays(first, i);
    return { date, minutes: byDay.get(date) ?? 0, today: date === on };
  });
  const max = Math.max(65, ...days.map((d) => d.minutes));

  return (
    <section id="log" aria-labelledby="nw-log-h">
      <Head en="Daily log" bn="দিনলিপি"
            note="One line per session, thirty seconds at the end of the last block. Never miss two days in a row: a fifteen-minute minimum, Anki and one recording, still counts and still gets logged." />

      <StatRow>
        <StatTile label="Sessions" value={String(s.sessions)} note={`${s.minutes} minutes in all`} />
        <StatTile label="Average" value={`${s.average} min`} note="per session" />
        <StatTile label="Last 7 days" value={String(s.last7)} note="sessions" tone={s.last7 >= 6 ? "good" : undefined} />
        <StatTile label="Speaking, 7 days" value={`${s.speaking7} min`} note={`target ${learner.settings.speaking}`} />
        <StatTile label="Listening, 7 days" value={`${s.listening7} min`} note={`target ${learner.settings.listening}`} />
        <StatTile label="Energy" value={s.energy === null ? "–" : String(s.energy)} note="average of 1 to 5" />
      </StatRow>

      <div className="mb-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="rounded-card border border-hairline bg-panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-code text-t1 uppercase tracking-wider text-accent">Last twelve weeks</span>
            <Chip tone={run >= 2 ? "accent" : "quiet"}>{run} day{run === 1 ? "" : "s"} in a row</Chip>
          </div>
          <HeatStrip days={days} max={max} />
        </div>

        <form onSubmit={submit} className="grid gap-3 rounded-card border border-hairline bg-panel p-4 sm:grid-cols-2">
          <Field id={id("date")} name="date" label="Date" type="date" defaultValue={on} required />
          <Select id={id("level")} name="level" label="Level" defaultValue={learner.route === "B" ? "Bridge" : "A1"}>
            {["A1", "A2", "B1", "B2", "Bridge"].map((lv) => <option key={lv} value={lv}>{lv}</option>)}
          </Select>
          <Field id={id("chapter")} name="chapter" label="Chapter" placeholder="K1" />
          <Select id={id("type")} name="type" label="Session type">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Field id={id("minutes")} name="minutes" label="Minutes" type="number" min={0} defaultValue={learner.settings.weekday} />
          <Field id={id("cards")} name="cards" label="New Anki cards" type="number" min={0} defaultValue={learner.settings.cards} />
          <Field id={id("speaking")} name="speaking" label="Speaking minutes (recorded, partner, tutor)" type="number" min={0} defaultValue={0} />
          <Field id={id("listening")} name="listening" label="Listening minutes outside the session" type="number" min={0} defaultValue={0} />
          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
            <Tick on={reviews} onToggle={() => setReviews(!reviews)}>Anki reviews done</Tick>
            <Tick on={writing} onToggle={() => setWriting(!writing)}>Writing done</Tick>
            <span className="ml-2 text-t2 text-ink-soft">Energy</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <ChipButton key={n} pressed={energy === n} onClick={() => setEnergy(n)}>{n}</ChipButton>
            ))}
          </div>
          <div className="sm:col-span-2">
            <TextArea id={id("hard")} name="hard" label="What was hard, or the error-log line" rows={2}
                      placeholder="weil → verb at the end" />
          </div>
          <div className="sm:col-span-2">
            <Button kind="solid" type="submit">Log this session</Button>
          </div>
        </form>
      </div>

      {learner.log.length ? (
        <Sheet label="Sessions logged" head={["Date", "Level", "Chapter", "Type", "Min", "Cards", "Reviews", "Speak", "Listen", "Writing", "Energy", "What was hard", ""]}>
          {learner.log.map((e) => (
            <tr key={e.id} style={accentOf(e.level)}>
              <Td className="whitespace-nowrap font-code">{dayWord(e.date)}</Td>
              <Td><LevelChip level={e.level} /></Td>
              <Td className="font-code">{e.chapter}</Td>
              <Td>{e.type}</Td>
              <Td className="font-code">{e.minutes}</Td>
              <Td className="font-code">{e.cards}</Td>
              <Td>{e.reviews ? "Y" : "N"}</Td>
              <Td className="font-code">{e.speaking}</Td>
              <Td className="font-code">{e.listening}</Td>
              <Td>{e.writing ? "Y" : "N"}</Td>
              <Td className="font-code">{e.energy || "–"}</Td>
              <Td className="min-w-[14rem] text-ink-soft">{e.hard}</Td>
              <Td>
                <Button kind="quiet" size="sm" aria-label={`Remove the session on ${e.date}`}
                        onClick={() => update((l) => ({ ...l, log: l.log.filter((x) => x.id !== e.id) }))}>✕</Button>
              </Td>
            </tr>
          ))}
        </Sheet>
      ) : (
        <p className="rounded-card border border-dashed border-hairline p-5 text-t4 text-ink-soft">
          Nothing logged yet. The first line goes in tonight, after block five.
        </p>
      )}
    </section>
  );
}

export function PracticePanel({ learner, update }: {
  learner: Learner;
  update: (fn: (l: Learner) => Learner) => void;
}) {
  const weeks = planFor(learner.route);
  const t = weeklyTargets(learner.settings);
  const average = practiceAverage(learner);
  const set = (n: number, patch: Partial<PracticeWeek>) =>
    update((l) => ({ ...l, practice: { ...l.practice, [String(n)]: { ...(l.practice[String(n)] ?? {}), ...patch } } }));
  const num = (v: string): number | null => (v === "" ? null : Number(v));
  const scored = weeks
    .map((w) => ({ w, score: practiceScore(learner.practice[String(w.n)], learner.settings) }))
    .filter((x): x is { w: typeof x.w; score: number } => x.score !== null);

  return (
    <section id="practice" aria-labelledby="nw-practice-h">
      <Head en="Weekly score" bn="সাপ্তাহিক হিসাব"
            note={`Targets come from your settings: ${t.speaking} min speaking, ${t.listening} min listening, ${t.writing} pieces of writing and ${t.cards} cards a week. Type the actuals; the score is the average of actual over target, each capped at 100%.`} />

      <div className="mb-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <StatTile label="Average score" value={average === null ? "–" : `${average}%`}
                  note={`${scored.length} week${scored.length === 1 ? "" : "s"} logged`}
                  tone={average !== null && average >= 80 ? "good" : average !== null && average < 50 ? "warn" : undefined} />
        <div className="rounded-card border border-hairline bg-panel p-4">
          {scored.length ? (
            <Bars unit="%" rows={scored.slice(-10).map(({ w, score }) => ({
              label: `Week ${w.n} · ${w.level}`, value: score, max: 100,
            }))} />
          ) : (
            <p className="text-t4 text-ink-soft">Fill in a week below and its bar appears here.</p>
          )}
        </div>
      </div>

      <Sheet label="Weekly targets against actuals"
             head={["Wk", "Starts", "Level", "Planned", "Speaking", "Listening", "Writing", "Cards", "Finished", "Score", "Note"]}>
        {weeks.map((w) => {
          const p = learner.practice[String(w.n)] ?? {};
          const score = practiceScore(p, learner.settings);
          const cell = (key: keyof PracticeWeek, target: number, label: string) => (
            <Td>
              <label className="grid gap-0.5">
                <span className="sr-only">{label}, week {w.n}, target {target}</span>
                <input type="number" min={0} aria-labelledby={`nw-pr-${String(key)}`}
                       value={(p[key] as number | null | undefined) ?? ""}
                       onChange={(e) => set(w.n, { [key]: num(e.target.value) })}
                       className="w-20 rounded-tight border border-hairline bg-paper px-2 py-1 font-code text-t3" />
                <span className="font-code text-t0 text-ink-soft">of {target}</span>
              </label>
            </Td>
          );
          return (
            <tr key={w.n} style={accentOf(w.level)}>
              <Td className="font-code">{w.n}</Td>
              <Td className="whitespace-nowrap font-code">{dateWord(weekStart(learner.start, w.n))}</Td>
              <Td><LevelChip level={w.level} /></Td>
              <Td className="min-w-[8rem] text-t2">{w.planned}</Td>
              {cell("speaking", t.speaking, "Speaking minutes")}
              {cell("listening", t.listening, "Listening minutes")}
              {cell("writing", t.writing, "Writing pieces")}
              {cell("cards", t.cards, "Vocabulary cards")}
              <Td>
                <input type="number" min={0} aria-labelledby="nw-pr-finished"
                       aria-label={`Chapters finished, week ${w.n}`}
                       value={p.finished ?? ""} onChange={(e) => set(w.n, { finished: num(e.target.value) })}
                       className="w-16 rounded-tight border border-hairline bg-paper px-2 py-1 font-code text-t3" />
              </Td>
              <Td>
                {score === null ? <span className="text-ink-soft">–</span>
                  : <Chip tone={score >= 80 ? "accent" : score < 50 ? "warn" : "quiet"}>{score}%</Chip>}
              </Td>
              <Td>
                <input type="text" aria-labelledby="nw-pr-note"
                       aria-label={`Note, week ${w.n}`} value={p.note ?? ""}
                       onChange={(e) => set(w.n, { note: e.target.value })}
                       className="w-40 rounded-tight border border-hairline bg-paper px-2 py-1 text-t3" />
              </Td>
            </tr>
          );
        })}
      </Sheet>
      <p className="sr-only" id="nw-pr-speaking">Speaking minutes this week</p>
      <p className="sr-only" id="nw-pr-listening">Listening minutes this week</p>
      <p className="sr-only" id="nw-pr-writing">Writing pieces this week</p>
      <p className="sr-only" id="nw-pr-cards">Vocabulary cards this week</p>
      <p className="sr-only" id="nw-pr-finished">Chapters finished this week</p>
      <p className="sr-only" id="nw-pr-note">Note for the week</p>
    </section>
  );
}
