"use client";

/* The left column. What you came here to do. `DIET.md` section 13: food
   diaries are abandoned because of FRICTION, not motivation, and the
   measure of this file is a stopwatch: a repeat dinner in three
   interactions, a new dish in under a minute.

   SAVING SAYS SO, AND SAYS WHEN IT HAS NOT. Every field writes on blur
   rather than behind a Save button, because a Save button is one more
   thing to forget and a forgotten one loses the day. So `saving` is
   shown, and `queued` is a real state with its own word rather than a lie
   about having saved.

   NOTHING HERE CAN BE FAILED: no red, no target line across the input, no
   message when a number is larger than another number.

   A PLANNED ROW IS NOT AN EATEN ONE. The week plan is these same rows
   dated ahead with `planned` set. `totalFor` has always excluded them, so
   a list that does not split them draws tonight's plan in the eaten list
   under a total that leaves it out.

   AND ENTER MEANS WHAT IT SAYS: a keyboard has no blur until something
   else is focused, so a reader who typed this morning's weight and
   pressed Enter would lose it. Enter commits and stays put rather than
   blurring, because a blur to the body sends the next Tab back to the top
   of the page. */

import { useEffect, useState, type KeyboardEvent } from "react";
import {
  MARKS, TAGS, byMeal, markNamed, totalFor,
  type Day, type Entry,
} from "@reiad/shared/diet";
import { clockTime, markEaten, who, type Who } from "../../lib/diet-api";
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
  const [slept, setSlept] = useState("");
  const [note, setNote] = useState("");

  /* Seeded from the row rather than held as the truth. The row
     is the record; these are what is in the boxes, and they are
     re-seeded when the day arrives from the account so a reader
     who logged on their phone this morning sees it here. */
  useEffect(() => {
    setWeight(day?.weightKg != null ? String(day.weightKg) : "");
    setSteps(day?.steps != null ? String(day.steps) : "");
    setSlept(day?.sleepHours != null ? String(day.sleepHours) : "");
    setNote(day?.note ?? "");
  }, [day?.date, day?.weightKg, day?.steps, day?.sleepHours, day?.note]);

  /* Who, for the one write this form makes on its own: ticking
     a planned row is a PATCH on that row rather than a new
     entry, so it cannot go through `onEntry`. Everything else
     here still goes up through the props. */
  const [w, setW] = useState<Who | null>(null);
  useEffect(() => {
    let live = true;
    const paint = (): void => {
      void who().then((me) => { if (live) setW(me); });
    };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { live = false; document.removeEventListener("account:changed", paint); };
  }, []);

  /* Which planned rows this page has already ticked. The record
     is the row and this is only what has not come back down yet:
     the props are re-read from the account on the next load, and
     nothing is drawn from here that is not also in `entries`. */
  const [had, setHad] = useState<Record<string, "going" | "done" | "failed">>({});

  /* ONE MAP, AND EVERY READING BELOW FOLLOWS IT. A row ticked a
     second ago is eaten, and the list, the total and the plan
     have to agree about that or the day shows a number that does
     not add up to the rows above it. */
  const rows = entries.map((e) =>
    (e.id && had[e.id] === "done" ? { ...e, planned: false } : e));
  const eaten = rows.filter((e) => !e.planned);
  const plan = rows.filter((e) => e.planned);
  const meals = byMeal(rows);

  const totals = totalFor(rows);
  const tags = new Set(day?.tags ?? []);
  const marks = new Set(day?.marks ?? []);

  const toggle = (set: Set<string>, id: string): string[] => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    return [...next];
  };

  /** Enter commits the box it was pressed in, and leaves the
      caret where it is. Not a blur: see the header. */
  const onEnter = (write: () => void) =>
    (e: KeyboardEvent<HTMLInputElement>): void => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      write();
    };

  /**
   * A planned row becomes an eaten one.
   *
   * The row keeps its id, its figures and the meal it was
   * planned for, and the day's rollup is recomputed from what is
   * on the page rather than added to, so a double press cannot
   * count a dinner twice.
   */
  const hadIt = async (row: Entry): Promise<void> => {
    const id = row.id;
    if (!w || !id || !ready) return;
    setHad((state) => ({ ...state, [id]: "going" }));
    /* The clock, or noon on a day being filled in afterwards,
       which is the rule the board already logs by: a Tuesday
       written up on Thursday must not put every meal at half
       past nine at night. */
    const at = date === today ? clockTime() : "12:00";
    const ok = await markEaten(w, id, at);
    setHad((state) => ({ ...state, [id]: ok ? "done" : "failed" }));
    if (!ok) return;
    const after = totalFor([...eaten, { ...row, planned: false }]);
    onDay({
      kcal: Math.round(after.kcal), proteinG: after.protein,
      carbsG: after.carbs, fatG: after.fat, fibreG: after.fibre,
    });
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
          onKeyDown={onEnter(() => onDay({ weightKg: num(weight) }))}
        />
        <Field
          id="dt-steps-today" type="number" inputMode="numeric" step="100" min={0}
          label={<T en="Steps" bn="পদক্ষেপ" />}
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          onBlur={() => onDay({ steps: num(steps) })}
          onKeyDown={onEnter(() => onDay({ steps: num(steps) }))}
        />
        {/* WHICH NIGHT, WRITTEN INTO THE LABEL, because it is
            invisible when it is wrong. A row's hours are the
            night that ENDED on this row's morning, which is the
            same night as this row's morning weighing and the
            same night Apple Health, Fitbit and Oura date to this
            row. `afterShortNights()` pairs it with this row's
            own intake for that reason. */}
        <Field
          id="dt-sleep-today" type="number" inputMode="decimal" step="0.5"
          min={0} max={24}
          label={<T en="Sleep last night, hours" bn="গত রাতে ঘুম, ঘণ্টা" />}
          hint={(
            <T
              en="The night that ended this morning, the same one this morning's weight came after. It is optional, it is never scored, and the only thing read out of it is what you ate on the days that followed a short one."
              bn="আজ সকালে যে রাতটা শেষ হয়েছে, আজকের ওজন যার পরে মাপা। এটা না দিলেও চলে, এতে কোনো নম্বর দেওয়া হয় না, আর এর থেকে কেবল একটা জিনিসই পড়া হয়: কম ঘুমের পরের দিনগুলোয় আপনি কী খেয়েছেন।"
            />
          )}
          value={slept}
          onChange={(e) => setSlept(e.target.value)}
          onBlur={() => onDay({ sleepHours: num(slept) })}
          onKeyDown={onEnter(() => onDay({ sleepHours: num(slept) }))}
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

            {/* HOW MUCH OF TODAY IS A GUESS. A restaurant plate is not
                knowable, so its midpoint is in the figure above and its
                width is here, rather than hidden inside a decimal that
                reads as a measurement.

                HALF THE SUMMED WIDTH IS THE WORST CASE, all the guesses
                wrong in the same direction. Two guesses that missed
                independently would be narrower, and claiming that narrower
                figure would be the tool being more certain than it has any
                right to be. */}
        {totals.spread > 0 ? (
          <p className="dt-hint">
            <T
              en={`Give or take ${Math.round(totals.spread / 2)}, because ${
                eaten.filter((e) => e.estLow != null && e.estHigh != null).length
              } of these were not weighed by anybody.`}
              bn={`${digits(Math.round(totals.spread / 2), "bn")} এদিক-ওদিক হতে পারে, কারণ এর মধ্যে ${
                digits(eaten.filter((e) => e.estLow != null && e.estHigh != null).length, "bn")
              }টা কেউ মেপে দেখেনি।`}
            />
          </p>
        ) : null}

        {eaten.length === 0
          ? (
            <p className="dt-hint">
              <T
                en="Nothing yet. A rough number now beats an exact one never."
                bn="এখনো কিছু নয়। এখনকার আন্দাজ পরে না লেখার চেয়ে ভালো।"
              />
            </p>
          )
          : meals.map((group) => (
            /* UNDER THE MEAL IT BELONGS TO. `byMeal` reads the
               row's own `meal` column and falls back to the hour
               it was eaten, so a day logged before that column
               was ever written still groups. A meal with nothing
               in it is not drawn, which is why this is a map
               rather than four headings. */
            <div className="dt-meal" key={group.meal?.id ?? "loose"}>
              <h4 className="dt-meal-h">
                {group.meal
                  ? <T en={group.meal.en} bn={group.meal.bn} />
                  : <T en="Not placed" bn="সময় লেখা নেই" />}
                <span className="mono">{digits(Math.round(group.total.kcal), lang)}</span>
              </h4>
              <ul className="dt-eaten-list">
                {group.entries.map((e, i) => (
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
            </div>
          ))}
      </div>

      {/* WHAT WAS PLANNED FOR THIS DAY, AND NOT YET EATEN.
          Section 13: plan on Sunday, tick through the week. The
          tick is the whole of what makes a plan worth writing,
          and it is one press: the row is already there, with its
          own numbers, and eating it clears a flag. Nothing here
          counts towards the day until it is pressed, and a plan
          nobody kept is left alone rather than marked. */}
      {plan.length ? (
        <div className="dt-plan">
          <h3>
            <T en="Planned, not yet eaten" bn="ঠিক করা ছিল, এখনো খাওয়া হয়নি" />
            <span className="mono"> {digits(Math.round(totalFor(rows, "planned").kcal), lang)}</span>
          </h3>
          <ul className="dt-eaten-list">
            {plan.map((e, i) => (
              <li key={e.id ?? `p-${i}`}>
                <span>{lang === "bn" && e.labelBn ? e.labelBn : e.label}</span>
                <span className="mono">{digits(Math.round(e.kcal ?? 0), lang)}</span>
                <Button
                  size="sm"
                  disabled={!ready || !e.id || had[e.id] === "going"}
                  onClick={() => void hadIt(e)}
                >
                  <T en="I had this" bn="এটা খেয়েছি" />
                </Button>
                {e.id ? (
                  <button
                    type="button" className="dt-drop"
                    onClick={() => onRemove(e.id as string)}
                    disabled={!ready}
                    aria-label={lang === "bn"
                      ? `${e.labelBn ?? e.label} পরিকল্পনা থেকে বাদ দিন`
                      : `Drop ${e.label} from the plan`}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          {Object.values(had).includes("failed") ? (
            <p className="dt-hint">
              <T
                en="One of those did not save. It is still on the plan, so press it again when the connection is back."
                bn="ওগুলোর একটা জমা হয়নি। সেটা পরিকল্পনাতেই আছে, নেট ফিরলে আবার চাপুন।"
              />
            </p>
          ) : null}
          <p className="dt-why">
            <T
              en="A plan is not a target. What was planned and what was eaten are two numbers side by side, and neither one is a pass mark."
              bn="পরিকল্পনা কোনো লক্ষ্য নয়। কী ঠিক করা ছিল আর কী খাওয়া হয়েছে, দুটো সংখ্যা পাশাপাশি থাকে; এর কোনোটাই পাশ-ফেলের হিসাব নয়।"
            />
          </p>
        </div>
      ) : null}

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
          onKeyDown={onEnter(() => onDay({ note: note.trim() || undefined }))}
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
