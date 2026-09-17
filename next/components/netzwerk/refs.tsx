"use client";

/* The four reference sheets: the daily method, the content
   library, the exams with their milestones, and the tips. Read
   rather than filled in, so they are cards and tables and nothing
   here writes to the learner. */

import { useState } from "react";
import {
  EXAMS, LIBRARY, METHOD, MILESTONES, TIPS, type Learner,
} from "@reiad/shared/netzwerk";
import { Chip, ChipButton } from "../ui/chip";
import { Head, LevelChip, Sheet, Td, accentOf } from "./bits";

export function MethodPanel({ learner }: { learner: Learner }) {
  const scale = learner.settings.weekday / 65;
  return (
    <section id="method" aria-labelledby="nw-method-h">
      <Head en="The daily method" bn="রোজকার নিয়ম"
            note={scale === 1
              ? "Minutes are for a 65-minute weekday session. Change the session length on the Start sheet and they scale."
              : `Minutes are scaled to your ${learner.settings.weekday}-minute weekday session; the workbook's figures are for 65.`} />
      <div className="grid gap-6">
        {METHOD.map((sec) => (
          <div key={sec.id} className="grid gap-3">
            <h3 className="text-t6 font-semibold">{sec.title}</h3>
            <Sheet label={sec.title} head={sec.columns}>
              {sec.rows.map((row) => (
                <tr key={row.block}>
                  <Td className="whitespace-nowrap font-medium">{row.block}</Td>
                  <Td className="whitespace-nowrap font-code">
                    {/^\d+$/.test(row.minutes) && scale !== 1
                      ? Math.round(Number(row.minutes) * scale) : row.minutes}
                  </Td>
                  <Td className="min-w-[12rem]">{row.what}</Td>
                  <Td className="min-w-[18rem]">{row.how}</Td>
                  <Td className="min-w-[12rem] text-ink-soft">{row.why}</Td>
                </tr>
              ))}
            </Sheet>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LibraryPanel() {
  const [skill, setSkill] = useState("all");
  const skills = [...new Set(LIBRARY.map((r) => r.skill))];
  const rows = LIBRARY.filter((r) => skill === "all" || r.skill === skill);
  return (
    <section id="library" aria-labelledby="nw-library-h">
      <Head en="What to listen to, read and speak with" bn="উপকরণ"
            note="Free unless marked. Minutes a week are outside the book sessions. Pick one per skill per level: more sources is not more German." />
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by skill">
        <ChipButton pressed={skill === "all"} onClick={() => setSkill("all")}>All</ChipButton>
        {skills.map((s) => <ChipButton key={s} pressed={skill === s} onClick={() => setSkill(s)}>{s}</ChipButton>)}
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {rows.map((r) => (
          <li key={r.name} className="grid gap-2 rounded-card border border-hairline bg-panel p-4"
              style={accentOf(r.level.split("–")[0].trim())}>
            <div className="flex flex-wrap items-center gap-2">
              <LevelChip level={r.level} />
              <Chip>{r.skill}</Chip>
              <span className="ml-auto font-code text-t1 text-ink-soft">{r.minutes} min/wk · {r.cost}</span>
            </div>
            <b className="text-t6">{r.name}</b>
            <p className="text-t3 text-ink-soft">{r.what}</p>
            <p className="text-t4">{r.how}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ExamsPanel() {
  return (
    <section id="exams" aria-labelledby="nw-exams-h">
      <Head en="Exams and milestones" bn="পরীক্ষা"
            note="Netzwerk neu prepares for Goethe, ÖSD and telc A1 to B1; Kontext B2 for Goethe B2. Dates and fees change: confirm on goethe.de or with Goethe-Institut Bangladesh before booking." />
      <div className="grid gap-3 md:grid-cols-2">
        {EXAMS.map((e) => (
          <div key={e.level} className="grid gap-2 rounded-card border border-hairline bg-panel p-5" style={accentOf(e.level)}>
            <div className="flex items-center gap-2"><LevelChip level={e.level} /><b className="text-t6">{e.options}</b></div>
            <p className="text-t3"><b className="text-accent">Format.</b> {e.format}</p>
            <p className="text-t3"><b className="text-accent">Pass rule.</b> {e.pass}</p>
            <p className="text-t3"><b className="text-accent">When.</b> {e.when}</p>
            <p className="text-t3"><b className="text-accent">Where.</b> {e.where}</p>
            <p className="text-t3"><b className="text-accent">Free preparation.</b> {e.prep}</p>
            <p className="rounded-tight bg-accent-soft p-3 text-t4">{e.recommendation}</p>
          </div>
        ))}
      </div>
      <h3 className="mb-3 mt-8 text-t6 font-semibold">Milestones</h3>
      <ol className="grid gap-2">
        {MILESTONES.map((m) => (
          <li key={m.when} className="grid gap-1 rounded-tight border border-hairline bg-panel px-4 py-3 sm:grid-cols-[14rem_minmax(0,1fr)]">
            <span className="font-code text-t2 text-accent">{m.when}</span>
            <span className="text-t4">{m.what}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function TipsPanel() {
  const [cat, setCat] = useState("all");
  const cats = [...new Set(TIPS.map((t) => t.category))];
  const rows = TIPS.filter((t) => cat === "all" || t.category === cat);
  return (
    <section id="tips" aria-labelledby="nw-tips-h">
      <Head en="Tips and traps" bn="কৌশল আর ফাঁদ"
            note="Where to give more, where to give less, the partner protocol and the traps everybody falls into once." />
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter tips">
        <ChipButton pressed={cat === "all"} onClick={() => setCat("all")}>All</ChipButton>
        {cats.map((c) => <ChipButton key={c} pressed={cat === c} onClick={() => setCat(c)}>{c}</ChipButton>)}
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {rows.map((t) => (
          <li key={t.tip} className="grid gap-2 rounded-card border border-hairline bg-panel p-4">
            <Chip tone={t.category === "Trap" || t.category === "Don't waste time" ? "warn" : "accent"}>{t.category}</Chip>
            <p className="text-t5">{t.tip}</p>
            <p className="text-t3 text-ink-soft">{t.why}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
