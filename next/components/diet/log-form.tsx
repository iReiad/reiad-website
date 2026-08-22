"use client";

/* ============================================================
   diet/log-form.tsx: the left column. What you came here to do.

   `DIET.md` section 13: the reason food diaries get abandoned is
   FRICTION, not motivation, and the fix is that most people eat
   the same forty things. The measure of this file is a
   stopwatch, and it belongs in the test: a repeat dinner in
   three interactions, a new dish in under a minute.

   ---- saving says so, and says when it has not ----

   Every field here writes on blur rather than behind a Save
   button, because a Save button is one more thing to forget and
   a forgotten one loses the day. That makes the STATE the
   important part: a page that silently drops a write on a bad
   connection is worse than one that refuses, so `saving` is
   shown, and `queued` is a real state with its own word rather
   than a lie about having saved.

   ---- and nothing here can be failed ----

   No red, no target line across the input, no message when a
   number is larger than another number. The tool's job at this
   moment is to accept what happened.
   ============================================================ */

import { useEffect, useState } from "react";
import { MARKS, TAGS, totalFor, type Day, type Entry } from "@reiad/shared/diet";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field } from "../ui/field";
import { T, digits, useToolLang } from "./lang";
import { FoodPicker } from "./food-picker";

/** A number typed into a box, which is a string until it is not.
    Empty is ABSENT rather than zero: a weight of 0 is not a
    reading anybody took, and writing one would put a point on
    the trend that never happened. */
const num = (raw: string): number | undefined => {
  const n = Number(raw.trim());
  return raw.trim() !== "" && Number.isFinite(n) && n > 0 ? n : undefined;
};

export function LogForm({ day, entries, saving, onDay, onEntry }: {
  day?: Day;
  entries: Entry[];
  saving: "idle" | "saving" | "saved" | "queued";
  onDay: (patch: Partial<Day>) => void;
  onEntry: (e: Omit<Entry, "date">) => void;
}) {
  const lang = useToolLang();
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [note, setNote] = useState("");

  /* Seeded from the row rather than held as the truth. The row
     is the record; these are what is in the boxes, and they are
     re-seeded when the day arrives from the account so a reader
     who logged on their phone this morning sees it here. */
  useEffect(() => {
    setWeight(day?.weightKg != null ? String(day.weightKg) : "");
    setSteps(day?.steps != null ? String(day.steps) : "");
    setNote(day?.note ?? "");
  }, [day?.date, day?.weightKg, day?.steps, day?.note]);

  const totals = totalFor(entries);
  const tags = new Set(day?.tags ?? []);
  const marks = new Set(day?.marks ?? []);

  const toggle = (set: Set<string>, id: string): string[] => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    return [...next];
  };

  return (
    <div className="dt-log">
      <div className="dt-log-head">
        <h2><T en="Today" bn="আজ" /></h2>
        <span className="dt-save" data-state={saving}>
          <T
            en={saving === "saving" ? "Saving" : saving === "saved" ? "Saved"
              : saving === "queued" ? "Not sent yet, it will go when you are back online" : ""}
            bn={saving === "saving" ? "জমা হচ্ছে" : saving === "saved" ? "জমা হয়েছে"
              : saving === "queued" ? "এখনো যায়নি, নেট এলে চলে যাবে" : ""}
          />
        </span>
      </div>

      <div className="dt-quick">
        <Field
          id="dt-weight-today" type="number" inputMode="decimal" step="0.1"
          min={20} max={400}
          label={<T en="Weight this morning, kg" bn="আজ সকালের ওজন, কেজি" />}
          hint={(
            <T
              en="Same time, after the toilet, before food. That is what makes a run of them mean something."
              bn="একই সময়ে, টয়লেটের পরে, খাওয়ার আগে। এভাবেই কয়েক দিনের মাপের মানে দাঁড়ায়।"
            />
          )}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onBlur={() => onDay({ weightKg: num(weight) })}
        />
        <Field
          id="dt-steps-today" type="number" inputMode="numeric" step="100" min={0}
          label={<T en="Steps" bn="পদক্ষেপ" />}
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          onBlur={() => onDay({ steps: num(steps) })}
        />
      </div>

      {/* Water is a tap per glass rather than a number to type:
          it is the one thing here somebody logs eight times a
          day, and a keyboard for it is friction eight times. */}
      <div className="dt-water">
        <span className="dt-water-label">
          <T en="Water" bn="পানি" />
          <span className="mono"> {digits(((day?.waterMl ?? 0) / 250) | 0, lang)}</span>
        </span>
        <Button onClick={() => onDay({ waterMl: (day?.waterMl ?? 0) + 250 })}>
          <T en="A glass" bn="এক গ্লাস" />
        </Button>
        {(day?.waterMl ?? 0) > 0 ? (
          <Button onClick={() => onDay({ waterMl: Math.max((day?.waterMl ?? 0) - 250, 0) })}>
            <T en="Undo" bn="ফেরত" />
          </Button>
        ) : null}
      </div>

      <FoodPicker onPick={onEntry} />

      <div className="dt-eaten">
        <h3>
          <T en="Eaten today" bn="আজ যা খেয়েছেন" />
          <span className="mono"> {digits(Math.round(totals.kcal), lang)}</span>
        </h3>
        {entries.length === 0
          ? (
            <p className="dt-hint">
              <T
                en="Nothing yet. A rough number now beats an exact one never."
                bn="এখনো কিছু নয়। এখনকার আন্দাজ পরে না লেখার চেয়ে ভালো।"
              />
            </p>
          )
          : (
            <ul className="dt-eaten-list">
              {entries.map((e, i) => (
                <li key={e.id ?? i}>
                  <span>{lang === "bn" && e.labelBn ? e.labelBn : e.label}</span>
                  <span className="mono">{digits(Math.round(e.kcal ?? 0), lang)}</span>
                  {/* Where the number came from, on every row. A
                      reader has to be able to tell a figure this
                      site checked from a stranger's. */}
                  {e.source && e.source !== "free"
                    ? <span className="dt-src">{e.source}</span> : null}
                </li>
              ))}
            </ul>
          )}
      </div>

      <fieldset className="dt-set">
        <legend><T en="How today was" bn="আজকের দিনটা কেমন" /></legend>
        {/* Hunger is the only LEADING indicator in the tool: it
            rises before the trend moves and before adherence
            breaks. One tap, five choices. */}
        <div className="dt-scale" role="group"
             aria-label="Hunger today, one to five">
          <span className="dt-scale-label"><T en="Hunger" bn="ক্ষুধা" /></span>
          {[1, 2, 3, 4, 5].map((n) => (
            <ChipButton
              key={n}
              pressed={day?.hunger === n}
              onClick={() => onDay({ hunger: day?.hunger === n ? undefined : n })}
            >
              {digits(n, lang)}
            </ChipButton>
          ))}
        </div>

        <div className="dt-tags" role="group" aria-label="Tags for today">
          {TAGS.map((t) => (
            <ChipButton
              key={t.id}
              pressed={tags.has(t.id)}
              onClick={() => onDay({ tags: toggle(tags, t.id) })}
            >
              <T en={t.en} bn={t.bn} />
            </ChipButton>
          ))}
        </div>

        <Field
          id="dt-note-today" type="text"
          label={<T en="One line, if you want one" bn="ইচ্ছে হলে এক লাইন" />}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => onDay({ note: note.trim() || undefined })}
        />
      </fieldset>

      {/* A marked day is drawn and left out of the slope. There
          is no penalty, no broken anything, and no catch-up
          target the following week: the tool's position on a bad
          fortnight is that it happened. */}
      <div className="dt-marks" role="group" aria-label="Mark today">
        {MARKS.map((m) => (
          <ChipButton
            key={m.id}
            pressed={marks.has(m.id)}
            onClick={() => onDay({ marks: toggle(marks, m.id) })}
          >
            <T en={m.en} bn={m.bn} />
          </ChipButton>
        ))}
      </div>
      <p className="dt-hint">
        <T
          en="A marked day is still drawn and is left out of the trend's slope. Nothing is lost and nothing is broken."
          bn="চিহ্ন দেওয়া দিন আঁকা হয়, শুধু ধারার ঢালে ধরা হয় না। কিছু হারায় না, কিছু ভাঙেও না।"
        />
      </p>
    </div>
  );
}
