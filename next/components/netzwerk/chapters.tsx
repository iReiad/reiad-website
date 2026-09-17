"use client";

/* The chapter map and the chapter tracker, as one list: every
   chapter opens to show what the map says about it and to take the
   tracker's ticks, score, completion date and three reviews. The
   grammar priority list is beside it. */

import { useState } from "react";
import {
  CHAPTERS, GRAMMAR, LEVELS, LEVEL_ORDER, chapterKey, chapterStatus, chapterSummary,
  reviewDates, reviewsDue, today, trackedChapters,
  type ChapterMark, type ChapterStatus, type Learner, type Level,
} from "@reiad/shared/netzwerk";
import { LEVEL_TONE } from "../../lib/netzwerk-store";
import { Field, TextArea } from "../ui/field";
import { Chip, ChipButton } from "../ui/chip";
import { StatRow, StatTile } from "../ui/stat";
import { Dots, Head, LevelChip, Sheet, Td, Tick, accentOf, dayWord } from "./bits";
import { Donut, Stacked } from "./charts";

const TICKS: Array<{ key: keyof ChapterMark; label: string }> = [
  { key: "kb", label: "Kursbuch" },
  { key: "ub", label: "Übungsbuch" },
  { key: "anki", label: "Lernwortschatz in Anki" },
  { key: "kk", label: "Kurz und klar mastered" },
  { key: "spoken", label: "Speaking recorded" },
];

/* Painted directly by the charts, never set as `--accent`: see the
   note at the top of `charts.tsx`. */
const STATUS_TONE: Record<ChapterStatus, string> = {
  "Not started": "var(--hairline)",
  "Review 1 pending": "var(--accent-line)",
  "Review 2 pending": "var(--accent-line)",
  "Review 3 pending": "var(--accent-line)",
  Mastered: "var(--accent-strong)",
};

export function ChaptersPanel({ learner, update }: {
  learner: Learner;
  update: (fn: (l: Learner) => Learner) => void;
}) {
  const [level, setLevel] = useState<Level | "all">("all");
  const [open, setOpen] = useState<string | null>(null);
  const on = today();
  const summary = chapterSummary(learner, on);
  const rows = trackedChapters(learner.route).filter((c) => level === "all" || c.level === level);

  const mark = (key: string, patch: Partial<ChapterMark>) =>
    update((l) => ({ ...l, chapters: { ...l.chapters, [key]: { ...(l.chapters[key] ?? {}), ...patch } } }));

  return (
    <section id="chapters" aria-labelledby="nw-chapters-h">
      <Head en="Chapters" bn="অধ্যায়"
            note="All 48, with what each one teaches and what to skip. Open a chapter to tick it off; enter the date it was completed and the three review dates appear, two, seven and thirty days on." />

      <StatRow>
        <StatTile label="Completed" value={`${summary.completed} / ${summary.total}`} note={`${summary.pct}% of the book`} />
        <StatTile label="Mastered" value={String(summary.mastered)} note="all three reviews done" tone="good" />
        <StatTile label="Reviews due" value={String(summary.due)} note="today or overdue" tone={summary.due ? "warn" : undefined} />
        <StatTile label="In review" value={String(summary.total - summary.byStatus["Not started"] - summary.mastered)} note="completed, reviews pending" />
      </StatRow>

      <div className="mb-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-card border border-hairline bg-panel p-4">
          <Donut centre={`${summary.pct}%`} sub="chapters"
                 slices={[
                   { label: "not started", value: summary.byStatus["Not started"], tone: STATUS_TONE["Not started"] },
                   { label: "in review", value: summary.total - summary.byStatus["Not started"] - summary.mastered, tone: STATUS_TONE["Review 1 pending"] },
                   { label: "mastered", value: summary.mastered, tone: STATUS_TONE.Mastered },
                 ]} />
        </div>
        <div className="grid gap-3 rounded-card border border-hairline bg-panel p-4">
          {LEVELS.map((lv) => {
            const of = CHAPTERS.filter((c) => c.level === lv.level);
            const done = of.filter((c) => learner.chapters[chapterKey(c)]?.completed).length;
            const mastered = of.filter((c) => chapterStatus(learner.chapters[chapterKey(c)]) === "Mastered").length;
            return (
              <div key={lv.level} className="grid gap-1" style={accentOf(lv.level)}>
                <div className="flex items-center justify-between text-t3">
                  <span className="flex items-center gap-2"><LevelChip level={lv.level} /> {lv.book.split(" (")[0]}</span>
                  <span className="font-code text-ink-soft">{done} / {of.length}</span>
                </div>
                <Stacked label={`${lv.level} chapters`} parts={[
                  { label: "mastered", value: mastered, tone: LEVEL_TONE[lv.level] },
                  { label: "in review", value: done - mastered, tone: "var(--accent-line)" },
                  { label: "to do", value: of.length - done, tone: "var(--hairline)" },
                ]} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by level">
        <ChipButton pressed={level === "all"} onClick={() => setLevel("all")}>All levels</ChipButton>
        {LEVEL_ORDER.map((lv) => (
          <ChipButton key={lv} pressed={level === lv} onClick={() => setLevel(lv)}>{lv}</ChipButton>
        ))}
      </div>

      <ol className="grid gap-2">
        {rows.map((c) => {
          const key = chapterKey(c);
          const m = learner.chapters[key] ?? {};
          const status = chapterStatus(m);
          const due = reviewsDue(m, on);
          const dates = reviewDates(m.completed);
          const isOpen = open === key;
          const ticks = TICKS.filter((t) => m[t.key]).length;
          return (
            <li key={key} className="rounded-card border border-hairline bg-panel" style={accentOf(c.level)}>
              <button type="button" onClick={() => setOpen(isOpen ? null : key)}
                      aria-expanded={isOpen}
                      className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left">
                <LevelChip level={c.level} />
                <span className="font-code text-t2 text-ink-soft">K{c.n}</span>
                <b className="text-t6">{c.title}</b>
                <Chip tone={c.priority === "Core" ? "accent" : "quiet"}>{c.priority}</Chip>
                {c.mode ? <Chip>{c.mode}</Chip> : null}
                <span className="ml-auto flex flex-wrap items-center gap-2 text-t2 text-ink-soft">
                  {c.week ? <span className="font-code">week {c.week}</span> : null}
                  <span className="font-code">{ticks}/5</span>
                  <Chip tone={status === "Mastered" ? "accent" : due ? "warn" : "quiet"}>
                    {due ? `${due} review${due === 1 ? "" : "s"} due` : status}
                  </Chip>
                </span>
              </button>
              {isOpen ? (
                <div className="grid gap-4 border-t border-hairline px-4 py-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                  <div className="grid gap-3 text-t4">
                    <p><b className="text-accent">Themes.</b> {c.themes}</p>
                    <p><b className="text-accent">Grammar.</b> {c.grammar}</p>
                    <p lang="de"><b className="text-accent" lang="en">Redemittel.</b> {c.phrases}</p>
                    <p className="rounded-tight bg-accent-soft p-3"><b>Speed tip.</b> {c.tip}</p>
                    <p className="text-t3 text-ink-soft">
                      Route A: {c.sessions} sessions, about {c.hours} h. Route B: {c.bridge}, {c.bridgeSessions} session{c.bridgeSessions === 1 ? "" : "s"}. {c.book}.
                    </p>
                  </div>
                  <div className="grid content-start gap-3">
                    <div className="flex flex-wrap gap-2">
                      {TICKS.map((t) => (
                        <Tick key={String(t.key)} small on={Boolean(m[t.key])}
                              onToggle={() => mark(key, { [t.key]: !m[t.key] })}>{t.label}</Tick>
                      ))}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field id={`nw-score-${key}`} label="'Das kann ich' score %" type="number" min={0} max={100}
                             value={m.score ?? ""} onChange={(e) => mark(key, { score: e.target.value === "" ? null : Number(e.target.value) })} />
                      <Field id={`nw-done-${key}`} label="Date completed" type="date" value={m.completed ?? ""}
                             hint="Sets the three review dates."
                             onChange={(e) => mark(key, { completed: e.target.value || null })} />
                    </div>
                    {dates ? (
                      <ol className="grid gap-1.5">
                        {dates.map((d, i) => {
                          const rk = (["r1", "r2", "r3"] as const)[i];
                          const late = d <= on && !m[rk];
                          return (
                            <li key={rk} className="flex flex-wrap items-center gap-2 text-t3">
                              <Tick small on={Boolean(m[rk])} onToggle={() => mark(key, { [rk]: !m[rk] })}>Review {i + 1}</Tick>
                              <span className={late ? "font-code text-danger" : "font-code text-ink-soft"}>{dayWord(d)}</span>
                              <span className="text-ink-soft">+{[2, 7, 30][i]} days{late ? " · due" : ""}</span>
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <p className="text-t3 text-ink-soft">Enter the date completed and the reviews appear.</p>
                    )}
                    <TextArea id={`nw-notes-${key}`} label="Notes and weak spots" rows={2}
                              value={m.notes ?? ""} onChange={(e) => mark(key, { notes: e.target.value })} />
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function GrammarPanel() {
  const [level, setLevel] = useState<string>("all");
  const [minPriority, setMinPriority] = useState<number>(1);
  const rows = GRAMMAR.filter((g) => (level === "all" || g.level.includes(level)) && g.priority >= minPriority);
  return (
    <section id="grammar" aria-labelledby="nw-grammar-h">
      <Head en="Grammar priority" bn="ব্যাকরণ: কোথায় সময় দেবেন"
            note="Priority 5 must be automatic in speech before moving up a level. 1 and 2: recognise it when reading; produce it later, or never in speech." />
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter grammar points">
        <ChipButton pressed={level === "all"} onClick={() => setLevel("all")}>All levels</ChipButton>
        {LEVEL_ORDER.map((lv) => (
          <ChipButton key={lv} pressed={level === lv} onClick={() => setLevel(lv)}>{lv}</ChipButton>
        ))}
        <span className="mx-2 self-center text-t2 text-ink-soft">at least</span>
        {[1, 3, 4, 5].map((p) => (
          <ChipButton key={p} pressed={minPriority === p} onClick={() => setMinPriority(p)}>{p === 1 ? "any" : `${p} dots`}</ChipButton>
        ))}
      </div>
      <Sheet label="Grammar priority" head={["#", "Grammar point", "Level", "Chapters", "Priority", "Payoff", "Time", "The one rule to remember", "Do not waste time on"]}>
        {rows.map((g) => (
          <tr key={g.n} style={accentOf(g.level.split("/")[0])}>
            <Td className="font-code text-ink-soft">{g.n}</Td>
            <Td className="min-w-[14rem] font-medium">{g.point}</Td>
            <Td className="whitespace-nowrap"><LevelChip level={g.level} /></Td>
            <Td className="whitespace-nowrap font-code text-t2">{g.chapters}</Td>
            <Td><Dots n={g.priority} /></Td>
            <Td className="whitespace-nowrap">{g.payoff}</Td>
            <Td className="whitespace-nowrap font-code text-t2">{g.budget}</Td>
            <Td className="min-w-[16rem]">{g.rule}</Td>
            <Td className="min-w-[14rem] text-ink-soft">{g.skip}</Td>
          </tr>
        ))}
      </Sheet>
    </section>
  );
}
