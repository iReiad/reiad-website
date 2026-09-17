"use client";

/* The Start sheet: who this learner is, which route, when they
   start, and the eight inputs every date and target follows. Every
   computed cell the workbook had is a tile here, and the level
   table and the ten-line method sit under it. */

import {
  DEFAULT_SETTINGS, LEGEND, LEVELS, METHOD_LINES, ROUTES_TABLE, chapterSummary, forecast,
  mondayOnOrAfter, today, type Learner, type Route, type Settings,
} from "@reiad/shared/netzwerk";
import { Field } from "../ui/field";
import { Button } from "../ui/button";
import { StatRow, StatTile } from "../ui/stat";
import { Ring } from "../deck";
import { Head, LevelChip, Sheet, Td, dateWord } from "./bits";
import { Donut } from "./charts";
import { LEVEL_TONE } from "../../lib/netzwerk-store";

const INPUT_WORDS: Array<{ key: keyof Settings; label: string; note: string; step?: number; min?: number }> = [
  { key: "weekday", label: "Weekday session, Mon to Fri (minutes)", note: "High effort but short. 65 min = 10 warm-up + 20 input + 10 grammar + 15 output + 10 listening.", min: 15 },
  { key: "saturday", label: "Saturday session (minutes)", note: "Saturday is self-check, Plattform or exam training, and partner speaking.", min: 15 },
  { key: "days", label: "Study days a week", note: "Sunday is rest or passive listening only.", min: 1 },
  { key: "speaking", label: "Weekly speaking target outside sessions (minutes)", note: "Recorded monologues, partner talk, tutor or tandem.", min: 0 },
  { key: "listening", label: "Weekly listening target outside sessions (minutes)", note: "Podcasts, Nicos Weg, Easy German: passive time on commutes.", min: 0 },
  { key: "writing", label: "Weekly writing pieces", note: "A1 to A2: 60 to 100 words each. B1: 120 to 150. B2: 200 and up.", min: 0 },
  { key: "cards", label: "New vocabulary cards a day (Anki)", note: "From the Übungsbuch Lernwortschatz list only. 15 a day is about 90 a week, every chapter list covered.", min: 0 },
  { key: "buffer", label: "Realistic-plan multiplier", note: "Real life slips about 30 per cent. Both finish dates are shown so you can plan around the honest one.", step: 0.05, min: 1 },
];

export function StartPanel({ learner, update, onRemove }: {
  learner: Learner;
  update: (fn: (l: Learner) => Learner) => void;
  onRemove: () => void;
}) {
  const f = forecast(learner.route, learner.start, learner.settings);
  const on = today();
  const done = chapterSummary(learner, on);
  const weeksDone = Object.values(learner.weeks).filter(Boolean).length;
  const id = (k: string) => `nw-${learner.id}-${k}`;

  const setSetting = (key: keyof Settings, raw: string) => {
    const v = Number(raw);
    if (!Number.isFinite(v)) return;
    update((l) => ({ ...l, settings: { ...l.settings, [key]: v } }));
  };

  return (
    <section id="start" aria-labelledby="nw-start-h">
      <Head en="Start here" bn="শুরু"
            note="Every date in the planner follows the start date. Weeks run Monday to Saturday, so any date you type snaps to the next Monday." />

      {/* ---- who, which way, when ---- */}
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid gap-4 rounded-card border border-hairline bg-panel p-5">
          <Field id={id("name")} label="Learner" value={learner.name}
                 onChange={(e) => update((l) => ({ ...l, name: e.target.value }))} />
          <Field id={id("start")} label="Start date" type="date" value={learner.start}
                 hint="A Monday. Any other day moves to the Monday after it."
                 onChange={(e) => {
                   const v = e.target.value;
                   if (/^\d{4}-\d{2}-\d{2}$/.test(v)) update((l) => ({ ...l, start: mondayOnOrAfter(v) }));
                 }} />
          <fieldset className="grid gap-2">
            <legend className="font-code text-t1 uppercase tracking-wide text-ink-soft">Route</legend>
            {ROUTES_TABLE.map((r) => (
              <label key={r.route}
                     className={[
                       "grid cursor-pointer gap-1 rounded-tight border p-3",
                       learner.route === r.route ? "border-accent bg-accent-soft" : "border-hairline",
                     ].join(" ")}>
                <span className="flex items-center gap-2">
                  <input type="radio" name={id("route")} value={r.route}
                         checked={learner.route === r.route}
                         onChange={() => update((l) => ({ ...l, route: r.route as Route }))}
                         className="accent-accent" />
                  <b>{r.name}</b>
                  <span className="font-code text-t1 text-ink-soft">{r.weeks} weeks · {r.sessions} sessions</span>
                </span>
                <span className="pl-6 text-t3 text-ink-soft">{r.path}</span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="grid content-start gap-4 rounded-card border border-hairline bg-panel p-5">
          <div className="flex items-center gap-5">
            <Ring value={done.completed} total={done.total} label={`${done.pct}%`} />
            <div className="grid gap-0.5">
              <b className="text-t7">{done.completed} of {done.total} chapters</b>
              <span className="text-t3 text-ink-soft">{done.mastered} mastered · {weeksDone} of {f.weeks} weeks ticked</span>
              <span className="text-t3 text-ink-soft">
                {done.due > 0 ? `${done.due} review${done.due === 1 ? "" : "s"} due today` : "No reviews due today"}
              </span>
            </div>
          </div>
          <Donut
            centre={String(done.completed)}
            sub="of 48"
            slices={LEVELS.map((lv) => ({
              label: `${lv.level} done`,
              tone: LEVEL_TONE[lv.level],
              value: Object.entries(learner.chapters)
                .filter(([k, m]) => k.startsWith(`${lv.level}/`) && m.completed).length,
            }))}
          />
        </div>
      </div>

      {/* ---- the computed cells ---- */}
      <div className="mt-6">
        <StatRow>
          <StatTile label="Hours a week" value={String(f.hoursPerWeek)} note="(5 × weekday + Saturday) ÷ 60" />
          <StatTile label="Cards a week" value={String(f.cardsPerWeek)} note="new cards × study days" />
          <StatTile label="Finish, aggressive" value={dateWord(f.finish)} note={`${f.weeks} weeks`} tone="good" />
          <StatTile label="Finish, realistic" value={dateWord(f.finishRealistic)} note={`${f.weeksRealistic} weeks, with the buffer`} />
          <StatTile label="Sessions" value={String(f.sessions)} note="six a week, every one on the plan" />
        </StatRow>
      </div>

      {/* ---- the inputs ---- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INPUT_WORDS.map((w) => (
          <Field key={w.key} id={id(w.key)} label={w.label} type="number"
                 min={w.min} step={w.step ?? 1}
                 value={String(learner.settings[w.key])}
                 hint={w.note}
                 onChange={(e) => setSetting(w.key, e.target.value)} />
        ))}
      </div>
      <p className="mt-2 text-t2 text-ink-soft">
        Defaults: {DEFAULT_SETTINGS.weekday} and {DEFAULT_SETTINGS.saturday} minutes, {DEFAULT_SETTINGS.days} days,
        {" "}{DEFAULT_SETTINGS.speaking} / {DEFAULT_SETTINGS.listening} minutes, {DEFAULT_SETTINGS.writing} pieces,
        {" "}{DEFAULT_SETTINGS.cards} cards, ×{DEFAULT_SETTINGS.buffer}.
      </p>

      {/* ---- the levels ---- */}
      <div className="mt-8">
        <Head en="The four levels" bn="চারটা স্তর" />
        <Sheet label="The four levels" head={["Level", "Book", "Route A", "Route B", "Per chapter", "Chapters", "Certify?"]}>
          {LEVELS.map((lv) => (
            <tr key={lv.level}>
              <Td><LevelChip level={lv.level} /></Td>
              <Td>{lv.book}</Td>
              <Td className="font-code">{lv.weeksA} weeks</Td>
              <Td className="font-code">{lv.weeksB} {/^\d+$/.test(lv.weeksB) ? "weeks" : ""}</Td>
              <Td className="font-code">{lv.sessionsPerChapter} sessions</Td>
              <Td className="font-code">{lv.chapters}</Td>
              <Td className="text-ink-soft">{lv.certify}</Td>
            </tr>
          ))}
        </Sheet>
      </div>

      {/* ---- the method ---- */}
      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <Head en="The method in ten lines" bn="দশ লাইনে পুরো নিয়ম" />
          <ol className="grid gap-2 text-t5">
            {METHOD_LINES.map((line) => (
              <li key={line} className="rounded-tight border border-hairline bg-panel px-4 py-3">{line.replace(/^\d+\.\s*/, "")}</li>
            ))}
          </ol>
        </div>
        <div>
          <Head en="Reading the sheets" bn="ছকগুলো পড়ার নিয়ম" />
          <ul className="grid gap-2 text-t3 text-ink-soft">
            {LEGEND.map((line) => <li key={line}>{line}</li>)}
          </ul>
          <div className="mt-8 rounded-card border border-danger/40 p-4">
            <p className="mb-3 text-t3 text-ink-soft">
              Remove this learner and everything they ticked and typed. There is no undo.
            </p>
            <Button kind="ghost" size="sm" onClick={onRemove}>Remove {learner.name}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
