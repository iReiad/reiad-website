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
import { MARKS, TAGS, markNamed, totalFor, type Day, type Entry } from "@reiad/shared/diet";
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

/** The date written out, for the heading when it is not today.
    `Intl` rather than a table of month names, because it already
    knows both, and `bn-BD` gives Bangla numerals with them. */
const dayWords = (iso: string, lang: "en" | "bn"): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(
    lang === "bn" ? "bn-BD" : "en-GB",
    { weekday: "long", day: "numeric", month: "long" },
  );
};

export function LogForm({
  day, entries, saving, place, date, today, ready,
  onDay, onEntry, onRemove, onDate,
}: {
  day?: Day;
  entries: Entry[];
  saving: "idle" | "saving" | "saved" | "queued";
  place?: "bd" | "uk";
  /** The day being written, which is `today` until the reader
      moves it back. Both are passed because the heading has to
      say WHICH day, and "Today" is only right for one of them. */
  date: string;
  today: string;
  /** The rows are back. Nothing may be written before they are:
      `saveDay` merges a whole row and would null what has not
      arrived yet. */
  ready: boolean;
  onDay: (patch: Partial<Day>) => void;
  onEntry: (e: Omit<Entry, "date">) => void;
  onRemove: (id: string) => void;
  onDate: (iso: string) => void;
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
        <h2>
          {date === today
            ? <T en="Today" bn="আজ" />
            : <T en={dayWords(date, "en")} bn={dayWords(date, "bn")} />}
        </h2>
        <span className="dt-save" data-state={saving}>
          <T
            en={saving === "saving" ? "Saving" : saving === "saved" ? "Saved"
              : saving === "queued" ? "Not sent yet, it will go when you are back online" : ""}
            bn={saving === "saving" ? "জমা হচ্ছে" : saving === "saved" ? "জমা হয়েছে"
              : saving === "queued" ? "এখনো যায়নি, নেট এলে চলে যাবে" : ""}
          />
        </span>
      </div>

      {/* A DAY THAT WAS MISSED CAN BE FILLED IN. This form wrote
          only ever to the current date, so a day away from a
          phone was a hole nothing could close, and a reader who
          weighed themselves before the app loaded had nowhere to
          put the number. Capped at today: a log of the future is
          a plan, and section 13 puts plans somewhere else. */}
      <div className="dt-when">
        <Field
          id="dt-log-date" type="date" max={today}
          label={<T en="Which day" bn="কোন দিনের" />}
          value={date}
          onChange={(e) => { if (e.target.value) onDate(e.target.value); }}
        />
        {date !== today ? (
          <Button size="sm" onClick={() => onDate(today)}>
            <T en="Back to today" bn="আজকে ফিরুন" />
          </Button>
        ) : null}
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

      <FoodPicker onPick={onEntry} place={place} />

      <div className="dt-eaten">
        <h3>
          <T en="Eaten today" bn="আজ যা খেয়েছেন" />
          <span className="mono"> {digits(Math.round(totals.kcal), lang)}</span>
        </h3>

        {/* HOW MUCH OF TODAY IS A GUESS. `DIET.md` section 14: a
            restaurant plate is not knowable, so its midpoint is
            in the figure above and its width is here, rather than
            hidden inside a decimal that reads as a measurement. A
            day with two of them is a wider band, the same way a
            sparse micronutrient day is drawn faintly.

            HALF THE SUMMED WIDTH IS THE WORST CASE, all the
            guesses wrong in the same direction. Two guesses that
            missed independently would be narrower than this, and
            claiming that narrower figure would be the tool being
            more certain than it has any right to be, which is the
            direction this whole tool is arranged against. */}
        {totals.spread > 0 ? (
          <p className="dt-hint">
            <T
              en={`Give or take ${Math.round(totals.spread / 2)}, because ${
                entries.filter((e) => !e.planned && e.estLow != null && e.estHigh != null).length
              } of these were not weighed by anybody.`}
              bn={`${digits(Math.round(totals.spread / 2), "bn")} এদিক-ওদিক হতে পারে, কারণ এর মধ্যে ${
                digits(entries.filter((e) => !e.planned && e.estLow != null && e.estHigh != null).length, "bn")
              }টা কেউ মেপে দেখেনি।`}
            />
          </p>
        ) : null}

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
                  {/* A MISTYPE HAS TO BE UNDOABLE. Without this
                      the list was a list that could only grow,
                      and one wrong 2,500 sat in the day's total
                      and in the learned maintenance for ever. */}
                  {e.id ? (
                    <button
                      type="button" className="dt-drop"
                      onClick={() => onRemove(e.id as string)}
                      disabled={!ready}
                      aria-label={lang === "bn"
                        ? `${e.labelBn ?? e.label} মুছুন`
                        : `Remove ${e.label}`}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  ) : null}
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
             aria-label={lang === "bn" ? "আজকের ক্ষুধা, এক থেকে পাঁচ" : "Hunger today, one to five"}>
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

        <div className="dt-tags" role="group" aria-label={lang === "bn" ? "আজকের ট্যাগ" : "Tags for today"}>
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
      <div className="dt-marks" role="group" aria-label={lang === "bn" ? "আজকের দিনটা চিহ্নিত করুন" : "Mark today"}>
        {/* PRESSED IS ASKED THROUGH `markNamed()`, because one
            mark has been stored under two spellings: this list
            wrote `off` for a while and the column has always
            said `off-protocol`. Asking `marks.has(m.id)`
            directly would show the chip unpressed on a day that
            really is marked, and pressing it would add a SECOND
            mark rather than clearing the first. */}
        {MARKS.map((m) => {
          const on = [...marks].some((id) => markNamed(id)?.id === m.id);
          return (
            <ChipButton
              key={m.id}
              pressed={on}
              onClick={() => onDay({
                marks: on
                  ? [...marks].filter((id) => markNamed(id)?.id !== m.id)
                  : [...marks, m.id],
              })}
            >
              <T en={m.en} bn={m.bn} />
            </ChipButton>
          );
        })}
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
