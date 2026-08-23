"use client";

/* ============================================================
   diet/usuals.tsx: the four things that decide whether anybody
   keeps a food log at all.

   `DIET.md` section 13. Copy yesterday is the most pressed
   button in any food diary and it is usually right. Your usuals
   is the other half: most people eat the same forty things, so
   anything logged three times should be one tap, and the ones
   eaten around this hour should be at the top, because
   breakfast at eight in the morning should offer breakfast.

   MEALS are the third. "My breakfast" is one tap for four
   things, saved out of a day that already happened rather than
   assembled in a builder, because a reader who has just logged
   their breakfast has already done the assembling.

   THE WEEK is the fourth and it is the same list with dates on
   it: plan on Sunday, tick through the week. A planned row is
   not a seventh table, it is `diet_entries` dated ahead with
   `planned` set, so the plan, the shopping list and section
   16's reading all come out of rows that already exist and a
   plan becomes a log by clearing one flag.

   ---- a meal is not a recipe, and the difference is the yield ----

   A recipe is a POT with a yield on it: `pot()` collapses its
   ingredients into one food stated for `serves` portions and
   `scaleTo()` cuts a portion out of it, which is one row in the
   log reading "chicken curry, one portion". A meal has no yield
   and nothing to divide. It is four rows: an egg, two rutis and
   a cup of tea, each keeping its own label, its own source and
   its own micronutrients.

   So NOTHING HERE SCALES ANYTHING, and there is no second copy
   of the arithmetic in `next/lib/recipes.ts`. Collapsing four
   foods into one row would also be dishonest twice over: three
   labels would leave `topSources()`, and `totalFor()` counts an
   entry's WHOLE energy as covered for any key it carries, so a
   summed meal would buy the day coverage that only two of its
   four items paid for.

   ---- worked out, never asked for ----

   Nothing in the usuals list asks the reader to curate one. The
   ranking is COUNTED out of the log, which is the rule at the
   top of `CLAUDE.md`: a page that says how many of something
   there are counts them rather than remembering them.
   `usualsFrom()` in `next/lib/recipes.ts` is that count and one
   sort, and `next/recipes.test.ts` asserts both.

   ---- a copy is a copy ----

   Every row written here carries its own numbers, exactly as it
   did the day it was first logged. Nothing points at anything,
   so correcting a portion size next week does not rewrite last
   week, and a public database changing its mind about a biscuit
   cannot reach into somebody's history. A saved meal is the
   same promise one level up: editing it does not rewrite what
   it has already written.

   ---- and the clock is read after the first paint ----

   The hour has to come from an effect. The server has no idea
   what time it is where the reader is, so reading it during
   render would put one order in the HTML and another in the
   browser, which is React error #418 and the day every
   calculator on this site went blank.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import {
  MEALS, byMeal, entriesFrom, mealAt, mealNamed, planKept, totalFor,
  type Entry,
} from "@reiad/shared/diet";
import { portionWords } from "@reiad/shared/foods";
import { USUAL_AT, copyOf, usualsFrom } from "../../lib/recipes";
import {
  addEntry, clockTime, getEntries, getOwnFoods, isoDate, markEaten,
  removeEntry, removeOwnFood, saveOwnFood, shiftDate, who,
  type OwnFood, type Who,
} from "../../lib/diet-api";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field } from "../ui/field";
import { T, TBlock, digits, useToolLang } from "./lang";
import { Invite } from "./invite";

/** How far back the count reads. Two months is enough for a
    pattern and short enough that a thing somebody stopped eating
    in the spring stops being offered. */
const WINDOW = 60;

/** The six at the top. Section 13's own number, and the reason
    it is six rather than everything: a one-tap list you have to
    read is not one tap. */
const OFFERED = 6;

/** How far ahead a plan runs. A week, because that is what
    section 13 asks for and because a plan longer than the shop
    it is made for is a list nobody keeps. */
const AHEAD = 7;

const amountOf = (e: Omit<Entry, "date">, lang: "en" | "bn"): string =>
  e.qty === undefined || !e.unit
    ? ""
    : portionWords(digits(e.qty, lang), e.unit, lang);

const nameOf = (e: Omit<Entry, "date">, lang: "en" | "bn"): string =>
  (lang === "bn" ? e.labelBn : undefined) ?? e.label;

/** A date as a weekday and a day of the month. `Intl` rather
    than a table, because it already knows both languages and
    `bn-BD` brings Bangla numerals with it. */
const dayWords = (iso: string, lang: "en" | "bn"): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(
    lang === "bn" ? "bn-BD" : "en-GB",
    { weekday: "short", day: "numeric", month: "short" },
  );
};

/** A stored row as a meal, or null. A row whose `kind` is not
    `meal`, or that carries nothing, is not one: a meal with no
    parts would be a button that logs nothing. */
interface Meal {
  id: string;
  label: string;
  labelBn?: string;
  parts: Array<Omit<Entry, "date">>;
}

const toMeal = (row: OwnFood): Meal | null => {
  if (row.kind !== "meal" || !row.id) return null;
  const parts = entriesFrom(row.parts);
  return parts.length ? {
    id: row.id, label: row.label, labelBn: row.label_bn, parts,
  } : null;
};

export function Usuals() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [foods, setFoods] = useState<OwnFood[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [going, setGoing] = useState<Record<string, "going" | "done" | "failed">>({});
  const [copying, setCopying] = useState<"" | "going" | "done" | "failed">("");

  /* The meal being assembled: which day it is taken out of,
     which meal of that day, and what it is to be called. */
  const [outOf, setOutOf] = useState("");
  const [takeMeal, setTakeMeal] = useState(MEALS[0].id);
  const [called, setCalled] = useState({ en: "", bn: "" });
  const [savingMeal, setSavingMeal] = useState<"" | "going" | "failed">("");

  /* And the plan: which day is open, and which meal of it new
     rows are being planned for. */
  const [planDay, setPlanDay] = useState("");
  const [planMeal, setPlanMeal] = useState(MEALS[0].id);

  /* Undefined until an effect has run. See the header: the hour
     cannot be read during render. */
  const [hour, setHour] = useState<number | undefined>(undefined);
  useEffect(() => { setHour(new Date().getHours()); }, []);

  const today = isoDate();
  const yesterday = shiftDate(today, -1);

  useEffect(() => {
    let live = true;
    const paint = (): void => {
      void who().then((me) => { if (live) { setW(me); setAnswered(true); } });
    };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { live = false; document.removeEventListener("account:changed", paint); };
  }, []);

  useEffect(() => {
    if (!w) return;
    let live = true;
    /* ONE QUERY for the log's half of this page. Yesterday, the
       meal being saved and the week ahead are all filters over
       the same rows rather than three requests: `getEntries`
       has no upper bound, so the rows dated ahead come back
       with the rest, and a second round trip for one day is a
       second thing that can fail. */
    void Promise.all([
      getEntries(w, shiftDate(today, -WINDOW)),
      getOwnFoods(w),
    ]).then(([found, own]) => {
      if (!live) return;
      setEntries(found);
      setFoods(own);
      setLoaded(true);
    });
    return () => { live = false; };
  }, [w, today]);

  const usuals = useMemo(
    () => usualsFrom(entries, hour).slice(0, OFFERED),
    [entries, hour],
  );
  const lastNight = useMemo(
    () => entries.filter((e) => e.date === yesterday && !e.planned),
    [entries, yesterday],
  );
  /* Yesterday under its meals, so one of them can be taken on
     its own. `byMeal` reads the row's own `meal` column and
     falls back to the hour, which is what makes this work on
     rows logged before anything wrote that column. */
  const lastMeals = useMemo(() => byMeal(lastNight), [lastNight]);

  const meals = useMemo(
    () => foods.map(toMeal).filter((m): m is Meal => m !== null),
    [foods],
  );

  /* The day a meal is being saved out of, which is today until
     the reader picks another, and its meals. */
  const source = outOf || today;
  const sourceMeals = useMemo(
    () => byMeal(entries.filter((e) => e.date === source)),
    [entries, source],
  );

  const days = useMemo(
    () => Array.from({ length: AHEAD }, (unused, at) => shiftDate(today, at)),
    [today],
  );
  const open = planDay || today;
  const plannedFor = useMemo(
    () => entries.filter((e) => e.date === open && e.planned),
    [entries, open],
  );
  const kept = useMemo(() => planKept(entries), [entries]);

  const again = async (row: Omit<Entry, "date">, key: string): Promise<void> => {
    if (!w) return;
    setGoing((state) => ({ ...state, [key]: "going" }));
    /* Copied on to today at THIS hour rather than at the hour it
       was eaten before, because the reader is logging it now. */
    const copy = { ...copyOf([{ ...row, date: today }], today)[0], atTime: clockTime() };
    const wrote = await addEntry(w, copy);
    setGoing((state) => ({ ...state, [key]: wrote ? "done" : "failed" }));
    if (wrote) setEntries((all) => [...all, { ...copy, id: wrote.id }]);
  };

  /** Several rows on to today, in one press. Sequential rather
      than parallel for the reason `importDays` gives: the reader
      this is for is on a bad connection, and four requests at
      once is how that connection gets worse. */
  const logMany = async (
    rows: Array<Omit<Entry, "date">>, key: string, meal?: string,
  ): Promise<void> => {
    if (!w || !rows.length) return;
    setGoing((state) => ({ ...state, [key]: "going" }));
    const at = clockTime();
    /* WHICH MEAL OF THE DAY, written out. The hour decides it
       unless the reader has said, which is what fills
       `diet_entries.meal` and what lets one meal of yesterday be
       taken on its own tomorrow. A saved meal does not carry
       one: "my breakfast" eaten at three in the afternoon is
       lunch, and the row should say what happened.

       The hour comes off THIS clock rather than out of `hour`,
       which is read once on mount and is wrong by however long
       the tab has been open. */
    const named = meal ?? mealAt(Number(at.slice(0, 2))).id;
    const landed: Entry[] = [];
    for (const row of rows) {
      const wrote = await addEntry(w, { ...row, date: today, atTime: at, meal: named });
      if (wrote) landed.push(wrote);
    }
    setEntries((all) => [...all, ...landed]);
    setGoing((state) => ({
      ...state, [key]: landed.length === rows.length ? "done" : "failed",
    }));
  };

  const copyYesterday = async (): Promise<void> => {
    if (!w || !lastNight.length) return;
    setCopying("going");
    const rows = copyOf(lastNight, today);
    const wrote = await Promise.all(rows.map((row) => addEntry(w, row)));
    const landed = wrote.filter((r): r is Entry => r !== null);
    setEntries((all) => [...all, ...landed]);
    setCopying(landed.length === rows.length ? "done" : "failed");
  };

  /* ---- meals ---- */

  /* WHICH MEAL OF THE SOURCE DAY, and it is its own state. It
     shared one with the planner's meal chips for a draft, which
     meant choosing Dinner in the week silently changed what the
     Save a meal form was about to save. */
  const taken = sourceMeals.find((g) => g.meal?.id === takeMeal);

  /** What the builder would save: the rows of the chosen meal of
      the chosen day, with the day stripped off them. A part is a
      description of something eaten rather than a row, so it
      carries no id and no date: giving it one would let a meal
      logged twice claim to be one entry. */
  const partsToSave = useMemo(
    () => (taken?.entries ?? []).map(({ id, date, planned, atTime, ...rest }) => rest),
    [taken],
  );

  const saveMeal = async (): Promise<void> => {
    if (!w || !partsToSave.length || !called.en.trim()) return;
    setSavingMeal("going");
    const ok = await saveOwnFood(w, {
      label: called.en.trim(),
      label_bn: called.bn.trim() || undefined,
      kind: "meal",
      parts: partsToSave,
      /* NO `qty`, NO `unit` AND NO `serves`. Everywhere else in
         this tool those three say what a row's figures are FOR,
         and a meal's figures are for itself: it is eaten whole
         or not at all, which is the whole difference between it
         and a recipe. A `serves` here would be a yield nothing
         divides by, and the migration's own constraint only
         demands one of a recipe. */
      source: "meal",
      uses: 0,
    });
    if (!ok) { setSavingMeal("failed"); return; }
    setSavingMeal("");
    setCalled({ en: "", bn: "" });
    setFoods(await getOwnFoods(w));
  };

  const forget = async (meal: Meal): Promise<void> => {
    if (!w) return;
    const ok = await removeOwnFood(w, meal.id);
    if (ok) setFoods((all) => all.filter((f) => f.id !== meal.id));
  };

  /* ---- the week ---- */

  /** One row, planned on to a day. Nothing about it is different
      from a logged row except the flag and the date, which is
      what makes ticking it one press rather than a write. */
  const planOne = async (
    row: Omit<Entry, "date">, key: string,
  ): Promise<void> => {
    if (!w) return;
    setGoing((state) => ({ ...state, [key]: "going" }));
    const wrote = await addEntry(w, {
      ...row, date: open, planned: true, meal: planMeal, atTime: undefined,
    });
    setGoing((state) => ({ ...state, [key]: wrote ? "done" : "failed" }));
    if (wrote) setEntries((all) => [...all, wrote]);
  };

  const planMany = async (
    rows: Array<Omit<Entry, "date">>, key: string,
  ): Promise<void> => {
    if (!w || !rows.length) return;
    setGoing((state) => ({ ...state, [key]: "going" }));
    const landed: Entry[] = [];
    for (const row of rows) {
      const wrote = await addEntry(w, {
        ...row, date: open, planned: true, meal: planMeal, atTime: undefined,
      });
      if (wrote) landed.push(wrote);
    }
    setEntries((all) => [...all, ...landed]);
    setGoing((state) => ({
      ...state, [key]: landed.length === rows.length ? "done" : "failed",
    }));
  };

  /** A plan kept. The row keeps its id and its figures and loses
      one flag, so nothing downstream can tell it from a dinner
      that was never planned, which is the point. */
  const hadIt = async (row: Entry): Promise<void> => {
    if (!w || !row.id) return;
    const key = `had-${row.id}`;
    setGoing((state) => ({ ...state, [key]: "going" }));
    const at = row.date === today ? clockTime() : "12:00";
    const ok = await markEaten(w, row.id, at);
    setGoing((state) => ({ ...state, [key]: ok ? "done" : "failed" }));
    if (!ok) return;
    setEntries((all) => all.map((e) =>
      (e.id === row.id ? { ...e, planned: false, atTime: at } : e)));
  };

  const dropPlan = async (row: Entry): Promise<void> => {
    if (!w || !row.id) return;
    const ok = await removeEntry(w, row.id);
    if (ok) setEntries((all) => all.filter((e) => e.id !== row.id));
  };

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;

  if (!w) {
    return (
      <Invite
        en="Your usuals are worked out from what you have logged, so they need an account to be worked out from."
        bn="আপনার নিয়মিত খাবারগুলো আপনার লেখা খাতা থেকেই বের করা হয়, তাই হিসাব করার জন্য একটা অ্যাকাউন্ট লাগে।"
      />
    );
  }

  return (
    <div className="dt-usuals">
      <section className="dt-usual-set" aria-labelledby="dt-usual-h">
        <h2 id="dt-usual-h"><T en="Your usuals" bn="আপনি যা নিয়মিত খান" /></h2>

        {!loaded ? (
          <p className="dt-intro">
            <T en="Counting what you log most." bn="আপনি সবচেয়ে বেশি যা লেখেন তা গোনা হচ্ছে।" />
          </p>
        ) : null}

        {loaded && !usuals.length ? (
          <p className="dt-hint">
            <T
              en={`Nothing yet. Anything logged ${USUAL_AT} times turns up here as one tap, and the ones you eat around this time of day come first.`}
              bn={`এখনো কিছু নেই। যা ${digits(USUAL_AT, "bn")} বার লেখা হয়েছে তা এখানে এক চাপে চলে আসে, আর দিনের এই সময়ে যেগুলো খান সেগুলো আগে থাকে।`}
            />
          </p>
        ) : null}

        <ul className="dt-usual-list">
          {usuals.map((u) => (
            <li key={u.key}>
              <button
                type="button" className="dt-hit"
                disabled={going[u.key] === "going"}
                onClick={() => void again(u.last, u.key)}
              >
                <span className="dt-hit-name">
                  {nameOf(u.last, lang)}
                  <span className="dt-hit-por">{amountOf(u.last, lang)}</span>
                </span>
                <span className="dt-hit-kcal mono">
                  {u.last.kcal === undefined ? "" : digits(Math.round(u.last.kcal), lang)}
                </span>
                <span className="dt-hit-src">
                  <T
                    en={`${u.times} times${u.atThisTime ? ", around now" : ""}`}
                    bn={`${digits(u.times, "bn")} বার${u.atThisTime ? ", এই সময়ে" : ""}`}
                  />
                </span>
              </button>
              {going[u.key] === "done" ? (
                <span className="dt-hint">
                  <T en="Logged." bn="লেখা হয়েছে।" />
                </span>
              ) : null}
              {going[u.key] === "failed" ? (
                <span className="dt-hint">
                  <T en="Not saved yet." bn="এখনো জমা হয়নি।" />
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        {usuals.length ? (
          <p className="dt-why">
            <T
              en="Counted out of your own log over the last two months, not a list you have to keep. One tap writes it again on to today, with its own numbers."
              bn="গত দুই মাসে আপনার নিজের খাতা থেকে গোনা, আপনার রাখা কোনো তালিকা নয়। এক চাপে সেটা আজকের দিনে আবার লেখা হয়, নিজের সংখ্যাগুলো নিয়েই।"
            />
          </p>
        ) : null}
      </section>

      {/* ---- MEALS. One tap for four things. ---- */}
      <section className="dt-usual-set" aria-labelledby="dt-meals-h">
        <h2 id="dt-meals-h"><T en="Your meals" bn="আপনার খাবারের সেট" /></h2>

        {loaded && !meals.length ? (
          <p className="dt-hint">
            <T
              en="Nothing saved yet. A meal is several things under one name, so logging it again is one tap instead of four."
              bn="এখনো কিছু রাখা হয়নি। এক নামের নিচে কয়েকটা জিনিস রাখলে পরেরবার চারবারের বদলে এক চাপেই লেখা হয়ে যায়।"
            />
          </p>
        ) : null}

        <ul className="dt-usual-list">
          {meals.map((meal) => {
            const sum = totalFor(meal.parts);
            const key = `meal-${meal.id}`;
            return (
              <li key={meal.id}>
                <button
                  type="button" className="dt-hit"
                  disabled={going[key] === "going"}
                  onClick={() => void logMany(meal.parts, key)}
                >
                  <span className="dt-hit-name">
                    {nameOf({ label: meal.label, labelBn: meal.labelBn }, lang)}
                    <span className="dt-hit-por">
                      <T
                        en={`${meal.parts.length} things`}
                        bn={`${digits(meal.parts.length, "bn")}টা জিনিস`}
                      />
                    </span>
                  </span>
                  <span className="dt-hit-kcal mono">
                    {digits(Math.round(sum.kcal), lang)}
                  </span>
                  <span className="dt-hit-src">
                    <T en="log all of it" bn="পুরোটা লিখুন" />
                  </span>
                </button>
                <div className="dt-measure-row">
                  <Button
                    size="sm"
                    disabled={going[`plan-${meal.id}`] === "going"}
                    onClick={() => void planMany(meal.parts, `plan-${meal.id}`)}
                  >
                    <T
                      en={`Plan it for ${dayWords(open, "en")}`}
                      bn={`${dayWords(open, "bn")} তারিখের জন্য রাখুন`}
                    />
                  </Button>
                  <Button size="sm" onClick={() => void forget(meal)}>
                    <T en="Forget it" bn="বাদ দিন" />
                  </Button>
                  {going[key] === "done" ? (
                    <span className="dt-hint"><T en="Logged." bn="লেখা হয়েছে।" /></span>
                  ) : null}
                  {going[key] === "failed" ? (
                    <span className="dt-hint">
                      <T
                        en="Some of it did not save. Press it again when the connection is back."
                        bn="কিছু অংশ জমা হয়নি। নেট ফিরলে আবার চাপুন।"
                      />
                    </span>
                  ) : null}
                </div>
                <ul className="dt-eaten-list">
                  {meal.parts.map((part, at) => (
                    <li key={`${meal.id}-${at}`}>
                      <span>{nameOf(part, lang)}</span>
                      <span className="dt-hit-por">{amountOf(part, lang)}</span>
                      <span className="mono">
                        {part.kcal === undefined ? "" : digits(Math.round(part.kcal), lang)}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        {/* SAVED OUT OF A DAY THAT HAPPENED, not built in a
            builder. A reader who has just logged their breakfast
            has already done the assembling, and asking them to
            do it again in a second form is the friction this
            whole page exists to remove. */}
        <div className="dt-meal-build">
          <h3><T en="Save a meal" bn="একটা খাবারের সেট রাখুন" /></h3>
          <div className="dt-when">
            <Field
              id="dt-meal-day" type="date" max={today}
              label={<T en="Out of which day" bn="কোন দিনের খাবার থেকে" />}
              value={source}
              onChange={(e) => { if (e.target.value) setOutOf(e.target.value); }}
            />
          </div>
          <div className="dt-tags" role="group"
               aria-label={lang === "bn" ? "কোন বেলার খাবার" : "Which meal of that day"}>
            {MEALS.map((m) => {
              const group = sourceMeals.find((g) => g.meal?.id === m.id);
              return (
                <ChipButton
                  key={m.id}
                  pressed={takeMeal === m.id}
                  disabled={!group}
                  onClick={() => setTakeMeal(m.id)}
                >
                  <T
                    en={group ? `${m.en}, ${group.entries.length}` : m.en}
                    bn={group ? `${m.bn}, ${digits(group.entries.length, "bn")}` : m.bn}
                  />
                </ChipButton>
              );
            })}
          </div>

          {loaded && !sourceMeals.length ? (
            <p className="dt-hint">
              <T
                en="Nothing was logged that day, so there is nothing to save."
                bn="ওই দিন কিছু লেখা হয়নি, তাই রাখার মতো কিছু নেই।"
              />
            </p>
          ) : null}

          {partsToSave.length ? (
            <>
              <ul className="dt-eaten-list">
                {partsToSave.map((part, at) => (
                  <li key={`take-${at}`}>
                    <span>{nameOf(part, lang)}</span>
                    <span className="dt-hit-por">{amountOf(part, lang)}</span>
                    <span className="mono">
                      {part.kcal === undefined ? "" : digits(Math.round(part.kcal), lang)}
                    </span>
                  </li>
                ))}
              </ul>
              <Field
                id="dt-meal-name" type="text"
                label={<T en="Call it" bn="নাম দিন" />}
                hint={(
                  <T
                    en="What you would say out loud. My breakfast, the office lunch, Friday night."
                    bn="মুখে যা বলবেন সেটাই। আমার সকালের খাবার, অফিসের দুপুর, শুক্রবারের রাত।"
                  />
                )}
                value={called.en}
                onChange={(e) => setCalled((c) => ({ ...c, en: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  void saveMeal();
                }}
              />
              <Field
                id="dt-meal-name-bn" type="text"
                label={<T en="And in Bangla, if you want" bn="ইচ্ছে হলে বাংলায়" />}
                value={called.bn}
                onChange={(e) => setCalled((c) => ({ ...c, bn: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  void saveMeal();
                }}
              />
              <div className="dt-measure-row">
                <Button
                  kind="solid"
                  disabled={!called.en.trim() || savingMeal === "going"}
                  onClick={() => void saveMeal()}
                >
                  <T en="Save it as a meal" bn="খাবারের সেট হিসেবে রাখুন" />
                </Button>
                {savingMeal === "failed" ? (
                  <span className="dt-hint">
                    <T en="Not saved. Try again." bn="জমা হয়নি। আবার চেষ্টা করুন।" />
                  </span>
                ) : null}
              </div>
            </>
          ) : null}

          <TBlock
            en={<p className="dt-why">A meal is not a recipe. A recipe is a pot with a
              yield on it, so a portion of it is a fraction and one row in the log; a
              meal has nothing to divide, so it stays four rows and each one keeps its
              own name, its own source and its own figures. Editing a meal does not
              rewrite what it has already written.</p>}
            bn={<p className="dt-why">খাবারের সেট আর রেসিপি এক জিনিস নয়। রেসিপি হলো
              একটা হাঁড়ি, তাতে কয় ভাগ হবে সেটা বলা থাকে, তাই তার এক ভাগ খাতায় এক
              সারিতে লেখা হয়। সেটে ভাগ করার কিছু নেই, তাই চারটা জিনিস চারটা সারিই
              থাকে, প্রত্যেকটার নিজের নাম, নিজের উৎস আর নিজের সংখ্যা নিয়ে। সেট বদলালে
              আগে যা লেখা হয়েছে তা বদলায় না।</p>}
          />
        </div>
      </section>

      <section className="dt-yesterday" aria-labelledby="dt-yest-h">
        <h2 id="dt-yest-h"><T en="Yesterday again" bn="গতকালেরটাই আবার" /></h2>

        {loaded && !lastNight.length ? (
          <p className="dt-intro">
            <T
              en="Nothing was logged yesterday, so there is nothing to copy. It is the most pressed button in any food diary once there is."
              bn="গতকাল কিছু লেখা হয়নি, তাই কপি করার কিছু নেই। একবার লেখা শুরু হলে যেকোনো খাবারের খাতায় এই বোতামটাই সবচেয়ে বেশি চাপা পড়ে।"
            />
          </p>
        ) : null}

        {lastNight.length ? (
          <>
            {/* ONE MEAL OF IT, which is the half of copy-yesterday
                that waited on `diet_entries.meal` being filled.
                `byMeal` names one out of the column, or out of
                the hour where nothing wrote the column. */}
            {lastMeals.map((group) => {
              /* Bound out of the group, because narrowing does
                 not survive into the callback below. */
              const named = group.meal;
              return (
              <div className="dt-meal" key={named?.id ?? "loose"}>
                <h3 className="dt-meal-h">
                  {named
                    ? <T en={named.en} bn={named.bn} />
                    : <T en="Not placed" bn="সময় লেখা নেই" />}
                  <span className="mono">{digits(Math.round(group.total.kcal), lang)}</span>
                </h3>
                <ul className="dt-eaten-list">
                  {group.entries.map((row, at) => {
                    const key = `y-${row.id ?? at}`;
                    return (
                      <li key={key}>
                        <span>{nameOf(row, lang)}</span>
                        <span className="dt-hit-por">{amountOf(row, lang)}</span>
                        <span className="mono">
                          {row.kcal === undefined ? "" : digits(Math.round(row.kcal), lang)}
                        </span>
                        <Button
                          size="sm"
                          disabled={going[key] === "going"}
                          onClick={() => void again(row, key)}
                        >
                          <T en="Just this" bn="শুধু এটা" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
                {named ? (
                  <Button
                    size="sm"
                    disabled={going[`ym-${named.id}`] === "going"}
                    onClick={() => void logMany(
                      group.entries.map(({ id, date, planned, atTime, ...rest }) => rest),
                      `ym-${named.id}`,
                      named.id,
                    )}
                  >
                    <T
                      en={`Just ${named.en.toLowerCase()}`}
                      bn={`শুধু ${named.bn}`}
                    />
                  </Button>
                ) : null}
              </div>
              );
            })}

            <div className="dt-measure-row">
              <Button
                kind="solid"
                disabled={copying === "going"}
                onClick={() => void copyYesterday()}
              >
                <T en="Copy the lot on to today" bn="পুরোটা আজকের দিনে তুলুন" />
              </Button>
              {copying === "done" ? (
                <span className="dt-hint">
                  <T en="Copied. Change anything that was different." bn="তোলা হয়েছে। যা আলাদা ছিল বদলে নিন।" />
                </span>
              ) : null}
              {copying === "failed" ? (
                <span className="dt-hint">
                  <T
                    en="Some of it did not save. The rest goes up when the connection comes back."
                    bn="কিছু অংশ জমা হয়নি। সংযোগ ফিরলে বাকিটা চলে যাবে।"
                  />
                </span>
              ) : null}
            </div>
          </>
        ) : null}

        <TBlock
          en={<p className="dt-why">Copying does not point at yesterday: each row
            is written again with its own figures, so correcting a portion today
            leaves yesterday alone.</p>}
          bn={<p className="dt-why">কপি করা মানে গতকালের দিকে দেখিয়ে দেওয়া নয়:
            প্রতিটা সারি নিজের সংখ্যাসহ আবার লেখা হয়, তাই আজ কোনো ভাগ ঠিক করলে
            গতকালেরটা যেমন ছিল তেমনই থাকে।</p>}
        />
      </section>

      {/* ---- THE WEEK. The same list, with dates on it. ---- */}
      <section className="dt-week" aria-labelledby="dt-week-h">
        <h2 id="dt-week-h"><T en="The week ahead" bn="সামনের সপ্তাহ" /></h2>

        <TBlock
          en={<p className="dt-intro">Optional, and it is a note to yourself rather
            than a target. Put down what you mean to eat, and logging it on the day
            becomes one press instead of remembering. What was planned and what was
            eaten sit side by side afterwards, and neither one is a pass mark.</p>}
          bn={<p className="dt-intro">এটা না করলেও চলে, আর এটা লক্ষ্য নয়, নিজের জন্য
            লিখে রাখা একটা কথা। কী খাবেন ভাবছেন লিখে রাখুন, তাহলে ওই দিন মনে করে
            লেখার বদলে এক চাপেই হয়ে যাবে। পরে কী ঠিক করা ছিল আর কী খাওয়া হয়েছে
            পাশাপাশি থাকে; এর কোনোটাই পাশ-ফেলের হিসাব নয়।</p>}
        />

        <div className="dt-tags" role="group"
             aria-label={lang === "bn" ? "কোন দিনের পরিকল্পনা" : "Which day to plan"}>
          {days.map((iso) => {
            const on = kept.find((k) => k.date === iso);
            return (
              <ChipButton key={iso} pressed={open === iso} onClick={() => setPlanDay(iso)}>
                <T
                  en={`${dayWords(iso, "en")}${on ? ` · ${Math.round(on.planned)}` : ""}`}
                  bn={`${dayWords(iso, "bn")}${on ? ` · ${digits(Math.round(on.planned), "bn")}` : ""}`}
                />
              </ChipButton>
            );
          })}
        </div>

        <div className="dt-week-day">
          <h3>
            <T en={dayWords(open, "en")} bn={dayWords(open, "bn")} />
          </h3>

          <div className="dt-tags" role="group"
               aria-label={lang === "bn" ? "কোন বেলার জন্য" : "For which meal"}>
            {MEALS.map((m) => (
              <ChipButton
                key={m.id} pressed={planMeal === m.id}
                onClick={() => setPlanMeal(m.id)}
              >
                <T en={m.en} bn={m.bn} />
              </ChipButton>
            ))}
          </div>

          {plannedFor.length ? (
            <ul className="dt-eaten-list">
              {plannedFor.map((row) => {
                const key = `had-${row.id ?? ""}`;
                return (
                  <li key={row.id}>
                    <span>{nameOf(row, lang)}</span>
                    <span className="dt-hit-por">
                      {mealNamed(row.meal)
                        ? <T en={mealNamed(row.meal)?.en ?? ""} bn={mealNamed(row.meal)?.bn ?? ""} />
                        : null}
                    </span>
                    <span className="mono">
                      {row.kcal === undefined ? "" : digits(Math.round(row.kcal), lang)}
                    </span>
                    {/* ONLY A DAY THAT HAS ARRIVED CAN BE TICKED.
                        A plan for Friday marked eaten on Tuesday
                        would put food in a day nobody has lived
                        yet, and the trend would read it. */}
                    {row.date <= today ? (
                      <Button
                        size="sm"
                        disabled={going[key] === "going"}
                        onClick={() => void hadIt(row)}
                      >
                        <T en="I had this" bn="এটা খেয়েছি" />
                      </Button>
                    ) : null}
                    <button
                      type="button" className="dt-drop"
                      onClick={() => void dropPlan(row)}
                      aria-label={lang === "bn"
                        ? `${nameOf(row, "bn")} পরিকল্পনা থেকে বাদ দিন`
                        : `Drop ${row.label} from the plan`}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="dt-hint">
              <T
                en="Nothing planned for this day yet. Put a meal or one of your usuals on it below."
                bn="এই দিনের জন্য এখনো কিছু ঠিক করা হয়নি। নিচ থেকে একটা সেট বা আপনার নিয়মিত কিছু এতে রাখুন।"
              />
            </p>
          )}

          {/* THE SAME LIST, WITH A DATE ON IT. Section 13's own
              words, and the reason there is no second search
              here: a plan is made of things somebody already
              eats, and the count that produced the usuals is the
              count that should produce the plan. */}
          {usuals.length ? (
            <>
              <h4><T en="Put one of your usuals on it" bn="নিয়মিত কিছু এতে রাখুন" /></h4>
              <ul className="dt-usual-list">
                {usuals.map((u) => {
                  const key = `plan-${open}-${u.key}`;
                  return (
                    <li key={key}>
                      <button
                        type="button" className="dt-hit"
                        disabled={going[key] === "going"}
                        onClick={() => void planOne(u.last, key)}
                      >
                        <span className="dt-hit-name">
                          {nameOf(u.last, lang)}
                          <span className="dt-hit-por">{amountOf(u.last, lang)}</span>
                        </span>
                        <span className="dt-hit-kcal mono">
                          {u.last.kcal === undefined ? "" : digits(Math.round(u.last.kcal), lang)}
                        </span>
                        <span className="dt-hit-src">
                          <T en="plan it" bn="রাখুন" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </div>

        {/* WHAT WAS PLANNED AGAINST WHAT WAS EATEN. Two numbers
            and no verdict: section 13 says the difference is a
            reading rather than a scolding, so there is no
            percentage kept, no tick and nothing that turns red.
            Only days something was planned for appear, because a
            day nobody planned is not a day a plan was broken
            on. */}
        {kept.length ? (
          <>
            <h3><T en="Planned, and eaten" bn="যা ঠিক ছিল, আর যা খাওয়া হয়েছে" /></h3>
            <table className="dt-table">
              <thead>
                <tr>
                  <th><T en="Day" bn="দিন" /></th>
                  <th><T en="Planned" bn="ঠিক ছিল" /></th>
                  <th><T en="Eaten" bn="খাওয়া হয়েছে" /></th>
                  <th><T en="Still on the plan" bn="এখনো বাকি" /></th>
                </tr>
              </thead>
              <tbody>
                {kept.map((row) => (
                  <tr key={row.date}>
                    <td><T en={dayWords(row.date, "en")} bn={dayWords(row.date, "bn")} /></td>
                    <td className="mono">{digits(Math.round(row.planned), lang)}</td>
                    <td className="mono">{digits(Math.round(row.eaten), lang)}</td>
                    <td className="mono">{digits(row.left, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}
      </section>
    </div>
  );
}
