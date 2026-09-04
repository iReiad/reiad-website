"use client";

/* Build the dish once, then a portion of it is one tap for ever.
   `DIET.md` sections 13 and 14: a food diary is abandoned because of
   FRICTION rather than motivation.

   THE INGREDIENT PICKER IS THE FOOD PICKER. `loggedFrom()` returns the
   shape this list holds, so there is nothing to adapt and no second
   search to keep in step.

   THE TOTAL IS A FLOOR, NEVER A FIGURE: `next/lib/recipes.ts` is the
   arithmetic and what this file does is SAY it. An ingredient stating no
   energy is named, the totals it belongs to read "at least", and a reader
   is never shown a confident number for a pot missing a third of itself.

   A saved recipe is one `diet_foods` row with its ingredients in `parts`
   and its yield in `serves`. Logging it writes ONE `diet_entries` row
   carrying its own numbers, so editing the recipe later does not rewrite
   what was eaten last month.

   TWO SECTIONS AND ONE BUILDER, deliberately: the difference between a
   recipe and a pot is one field, one verb and how much you say you took.
   A recipe answers with a YIELD and hands out portions for ever; a pot
   answers with who ate, or with nothing, and hands out a SHARE. */

import { useEffect, useMemo, useState } from "react";
import type { Entry } from "@reiad/shared/diet";
import {
  DEFAULT_PLACE, portionWords, type FoundFood, type Place,
} from "@reiad/shared/foods";
import {
  SERVING, SHARES, daysOld, dishPrice, fractionOf, logRecipe, logShare, offTheHob,
  onTheHob, pot, priceRow, servingsOf, shareOf, shoppingList, toPot, toRecipe,
  type Dish, type Part, type PriceRow, type Recipe, type Share,
} from "../../lib/recipes";
import {
  addEntry, getOwnFoods, getProfile, isoDate, clockTime, saveOwnFood, who,
  type OwnFood, type Who,
} from "../../lib/diet-api";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field } from "../ui/field";
import { Note } from "../ui/note";
import { T, TBlock, digits, useToolLang } from "./lang";
import { FoodPicker } from "./food-picker";
import { Invite } from "./invite";

/** The four macros, in both languages, in the order a label
    prints them. A fifth would be a decision rather than a tweak:
    everything past these four is a micronutrient and section 15
    reads those through coverage. */
const MACROS = [
  { key: "protein", en: "protein", bn: "প্রোটিন" },
  { key: "carbs", en: "carbohydrate", bn: "শর্করা" },
  { key: "fat", en: "fat", bn: "চর্বি" },
  { key: "fibre", en: "fibre", bn: "আঁশ" },
] as const;

const num = (raw: string): number | undefined => {
  const n = Number(raw.trim());
  return raw.trim() !== "" && Number.isFinite(n) && n > 0 ? n : undefined;
};

/** "at least 384" against "384", which is the whole of what a
    floor means on the page. It is a word rather than a symbol
    because a reader who meets "≥" has to be told what it is. */
const said = (
  value: number, floor: boolean, lang: "en" | "bn",
): string => {
  const n = digits(value, lang);
  if (!floor) return n;
  return lang === "bn" ? `অন্তত ${n}` : `at least ${n}`;
};

/** What the reader called this ingredient, in the language they
    are reading. A part copied out of the library carries both;
    one out of a public database or typed by hand carries only
    the English, and showing that to a Bangla reader is better
    than showing a blank. */
const partName = (p: Part, lang: "en" | "bn"): string =>
  (lang === "bn" ? p.labelBn : undefined) ?? p.label;

const partAmount = (p: Part, lang: "en" | "bn"): string =>
  p.qty === undefined || !p.unit
    ? ""
    : portionWords(digits(p.qty, lang), p.unit, lang);

/** The pot's macros as the row stores them. Absent stays absent:
    a nought would read as "none of it", which is the one thing
    `shared/foods.ts` refuses to write for a figure nobody has. */
const potMacros = (food: FoundFood): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const m of MACROS) {
    const value = food[m.key];
    if (value !== undefined) out[m.key] = value;
  }
  return out;
};

/** What went in, under a fold. One component rather than the
    same eight lines in the recipe list and again in the pot
    list, which is the copy this file's header is about. */
function WhatIsInIt({ dish, lang }: { dish: Dish; lang: "en" | "bn" }) {
  return (
    <details className="dt-free">
      <summary><T en="What is in it" bn="এতে কী কী আছে" /></summary>
      <ul className="dt-eaten-list">
        {dish.parts.map((part, at) => (
          <li key={`${dish.id ?? dish.en}-${at}`}>
            <span>{partName(part, lang)}</span>
            <span className="dt-hit-por">{partAmount(part, lang)}</span>
            <span className="mono">
              {part.kcal === undefined ? "" : digits(Math.round(part.kcal), lang)}
            </span>
            <span className="dt-src">{part.source ?? ""}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** The share a pot offers before anybody has touched it: the
    household count where the reader gave one, because that IS
    this household's normal share, and a half otherwise. Already
    chosen, which is what makes the same dinner tomorrow one tap
    on Log this share. */
const firstShare = (dish: Dish): Share =>
  dish.serves ? { took: 1, outOf: dish.serves } : { took: 1, outOf: 2 };

/** Whether the last press landed. Said the same way under a
    portion and under a share, because it is the same write and a
    reader should not have to learn it twice. */
function Wrote({ state }: { state?: "going" | "done" | "failed" }) {
  if (state === "done") {
    return (
      <p className="dt-hint">
        <T en="In today's log." bn="আজকের খাতায় উঠেছে।" />
      </p>
    );
  }
  if (state === "failed") {
    return (
      <p className="dt-hint">
        <T
          en="That did not save. It will go up when the connection comes back."
          bn="এটা জমা হয়নি। সংযোগ ফিরলে চলে যাবে।"
        />
      </p>
    );
  }
  return null;
}

export function RecipePanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE);

  const [rows, setRows] = useState<OwnFood[]>([]);
  const [loaded, setLoaded] = useState(false);

  /* The dish being built. Nothing is written until Save, so a
     half-built recipe is never a row somebody has to tidy up.

     `kind` is the one question that makes this two builders: a
     recipe hands out portions for ever and a pot hands out a
     share of this week's dinner. */
  const [kind, setKind] = useState<"recipe" | "pot">("recipe");
  const [en, setEn] = useState("");
  const [bn, setBn] = useState("");
  const [serves, setServes] = useState("4");
  const [parts, setParts] = useState<Part[]>([]);
  const [saving, setSaving] = useState<"" | "saving" | "failed">("");

  /* How many portions of each saved recipe, keyed by its row id,
     and which recipes the shopping list is for. */
  const [portions, setPortions] = useState<Record<string, string>>({});
  const [logged, setLogged] = useState<Record<string, "going" | "done" | "failed">>({});
  const [shopping, setShopping] = useState<string[]>([]);

  /* How much of each pot was taken, keyed by its row id. Two
     numbers rather than a fraction: see `logShare()`, where two
     whole numbers are the only version that does not round a
     third down to 0.33 and log every pot one percent light. */
  const [shares, setShares] = useState<Record<string, Share>>({});
  /* Pots older than a week are still there and are not in the
     way. A list that only grows is the friction this page is
     against. */
  const [showOld, setShowOld] = useState(false);

  useEffect(() => {
    let live = true;
    const paint = (): void => {
      void (async () => {
        const me = await who();
        if (!live) return;
        setW(me);
        setAnswered(true);
        if (!me) return;
        const profile = await getProfile(me);
        if (live && profile?.place) setPlace(profile.place);
      })();
    };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { live = false; document.removeEventListener("account:changed", paint); };
  }, []);

  useEffect(() => {
    if (!w) return;
    let live = true;
    void getOwnFoods(w).then((found) => {
      if (!live) return;
      setRows(found);
      setLoaded(true);
    });
    return () => { live = false; };
  }, [w]);

  /** Every stored row that really is a recipe. `toRecipe` is
      what proves it: `parts` is a `jsonb` column, so what comes
      back is `unknown` and every field in it has to be checked
      rather than cast. */
  const recipes = useMemo(
    () => rows.map(toRecipe).filter((r): r is Recipe => r !== null),
    [rows],
  );

  /** And every row that is a pot. A pot needs no yield, so the
      two readers are two functions rather than one with a flag:
      `serves` on a pot is how many ate and the cook may never
      have counted. */
  const pots = useMemo(
    () => rows.map(toPot).filter((p): p is Dish => p !== null),
    [rows],
  );
  const today = isoDate();
  const hob = useMemo(() => onTheHob(pots, today), [pots, today]);
  const older = useMemo(() => offTheHob(pots, today), [pots, today]);

  const shareFor = (dish: Dish): Share => shares[dish.id ?? ""] ?? firstShare(dish);

  /** THE PATCH IS MERGED ON TO THIS POT'S OWN SHARE, not on to a
      fixed half. A pot cooked for five offers one of five before
      anybody touches it, and merging a typed `took` on to a
      half would have quietly moved the reader from a fifth to a
      half of the same pot: a doubled dinner nobody pressed. */
  const setShare = (dish: Dish, patch: Partial<Share>): void => {
    const id = dish.id ?? "";
    setShares((s) => ({ ...s, [id]: { ...(s[id] ?? firstShare(dish)), ...patch } }));
  };

  const draft: Dish = {
    en: en.trim(),
    bn: bn.trim() || undefined,
    /* A pot may be cooked for nobody in particular, and the
       builder's box is empty rather than nought in that case.
       `serves` of nought is not a yield and `pot()` refuses it,
       which is the right answer for a recipe and the wrong
       question for a pot. */
    serves: kind === "recipe" ? num(serves) ?? 0 : num(serves),
    parts,
  };
  const made = pot(draft);
  const each = servingsOf(draft, 1);
  /** The whole pot, for a dish that may state no yield at all.
      One of one is the whole of it, through the same `scaleTo`
      every other figure on this page goes through. */
  const whole = shareOf(draft, { took: 1, outOf: 1 });

  /** Whether the builder has enough to save. A recipe needs a
      yield, because a portion is the whole of what it is for; a
      pot needs only something in it that carries a figure. */
  const buildable = kind === "recipe" ? made.food !== null : whole !== null;

  /** What went in, priced. `cost` is the WHOLE pot, so it sits
      beside the whole pot's energy rather than beside a portion,
      and it is only kept on the row where every part carried a
      checked price: `priceRow()` says why. */
  const priced = dishPrice(draft);
  const keeps: PriceRow | null = priceRow(draft);

  const save = async (): Promise<void> => {
    if (!w || !buildable || !draft.en) return;
    setSaving("saving");
        /* THE ROW STATES ITS FIGURES FOR THE WHOLE POT, which is what
           `qty` and `unit` mean everywhere else in this tool, so anything
           reading the row later, the Android app included, scales it with
           the same `scaleTo()` a library row goes through. A recipe states
           them for its yield in portions and a pot for one pot. */
    const asRecipe = kind === "recipe" && made.food !== null;
    const figures = asRecipe ? made.food : whole;
    /* `OwnFood` does not name the three price columns yet, and
       `next/lib/diet-api.ts` is another change's file. They reach
       PostgREST either way, because that function sends the row
       it is handed. */
    const row: OwnFood & Partial<PriceRow> = {
      label: draft.en,
      label_bn: draft.bn,
      kind,
      parts: draft.parts,
      serves: draft.serves,
      qty: asRecipe ? draft.serves : 1,
      unit: asRecipe ? SERVING : "pot",
      kcal: figures?.kcal,
      macros: asRecipe && made.food
        ? potMacros(made.food)
        : whole?.macros ?? {},
      source: kind,
          /* Counted rather than remembered: what is on the page comes from
             the log, and these two are the row's own cache of it so
             something reading `diet_foods` alone can order by them.

             ON A POT `last_used` IS THE DAY IT WENT ON THE HOB, and then
             the day it was last taken from: both answer whether this is
             still somebody's dinner. */
      uses: 0,
      last_used: kind === "pot" ? today : undefined,
      /* ALL THREE OR NONE, and none wherever one part carried no
         checked price: a dish stored at a floor would read
         cheaper than it was and would buy the log the coverage it
         has not got. `priceRow()` is where that is decided. */
      ...(keeps ?? {}),
    };
    const ok = await saveOwnFood(w, row);
    if (!ok) { setSaving("failed"); return; }
    setSaving("");
    setEn(""); setBn(""); setServes(kind === "recipe" ? "4" : ""); setParts([]);
    setRows(await getOwnFoods(w));
  };

      /**
       * One entry, out of a dish, dated now. ONE WRITER FOR BOTH, because
       * a portion of a recipe and a share of a pot differ in the row they
       * produce and in nothing afterwards. `row` is null wherever the
       * arithmetic refused, and a refusal writes nothing rather than a
       * guess: the pot lists say why, above the button.
       */
  const write = async (dish: Dish, row: Omit<Entry, "date"> | null): Promise<void> => {
    const id = dish.id;
    if (!w || !id || !row) return;
    setLogged((state) => ({ ...state, [id]: "going" }));
    const wrote = await addEntry(w, {
      ...row, date: isoDate(), atTime: clockTime(),
    });
    setLogged((state) => ({ ...state, [id]: wrote ? "done" : "failed" }));
    if (!wrote) return;
    /* The row's own cache of what the log already says. A failure
       here changes nothing on any page, because nothing on any
       page reads it. */
    void saveOwnFood(w, {
      ...(rows.find((r) => r.id === id) ?? {}),
      id,
      label: dish.en,
      uses: (dish.uses ?? 0) + 1,
      last_used: isoDate(),
    });
  };

  const log = (recipe: Recipe): Promise<void> =>
    write(recipe, logRecipe(recipe, num(portions[recipe.id ?? ""] ?? "1") ?? 1));

  const take = (dish: Dish): Promise<void> =>
    write(dish, logShare(dish, shareFor(dish)));

  /* Pots and recipes both, because a pot is a dish you may well
     cook again and its ingredients are a shopping list either
     way. */
  const chosen = useMemo(
    () => [...recipes, ...pots].filter((d) => d.id && shopping.includes(d.id)),
    [recipes, pots, shopping],
  );
  const shop = useMemo(() => shoppingList(chosen), [chosen]);

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;

  if (!w) {
    return (
      <Invite
        en="A recipe belongs to an account, so the dish you built on this laptop is one tap on your phone."
        bn="রান্নার হিসাব অ্যাকাউন্টের সঙ্গে থাকে, তাই এই কম্পিউটারে বানানো রান্নাটা ফোনেও এক চাপে পাওয়া যায়।"
        shows={[
          { en: "A dish built once out of the library, and one portion of it logged in a tap after that.",
            bn: "একবার বানানো একটা রান্না, তারপর থেকে তার এক ভাগ এক চাপে খাতায় ওঠে।" },
          { en: "A pot for the week, shared out in whole ladles rather than fractions.",
            bn: "সপ্তাহের এক হাঁড়ি, ভগ্নাংশ নয়, গোটা হাতা হিসেবে ভাগ করা।" },
          { en: "The shopping list for it, with what each part costs where you are.",
            bn: "তার বাজারের তালিকা, আর আপনার জায়গায় প্রতিটা জিনিসের দাম।" },
        ]}
      />
    );
  }

  return (
    <div className="dt-recipes">
      {/* ONE LINE FOR BOTH LISTS. The dishes and the pots come
          out of the same fetch, so two waiting lines would be two
          sentences about one request. */}
      {!loaded ? (
        <p className="dt-intro">
          <T en="Fetching what you have built." bn="আপনি যা বানিয়েছেন তা আনা হচ্ছে।" />
        </p>
      ) : null}

      {/* ---- what is already built ---- */}
      <section className="dt-recipe-mine" aria-labelledby="dt-rec-mine-h">
        <h2 id="dt-rec-mine-h"><T en="Your dishes" bn="আপনার রান্না" /></h2>

        {loaded && !recipes.length ? (
          <p className="dt-hint">
            <T
              en="Nothing yet. Build a dish below, say how many it serves, and a portion of it becomes one tap from then on."
              bn="এখনো কিছু নেই। নিচে একটা রান্না বানান, কয় জনের জন্য বলুন, তারপর থেকে তার এক ভাগ এক চাপেই লেখা হবে।"
            />
          </p>
        ) : null}

        <ul className="dt-recipe-list">
          {recipes.map((recipe) => {
            const id = recipe.id as string;
            const one = servingsOf(recipe, 1);
            const which = pot(recipe);
            const state = logged[id];
            return (
              <li key={id} className="dt-recipe">
                <p className="dt-recipe-name">
                  <T en={recipe.en} bn={recipe.bn ?? recipe.en} />
                </p>
                <p className="dt-why">
                  <T
                    en={`Serves ${recipe.serves}. One portion is ${
                      one ? said(Math.round(one.kcal), which.floors.has("kcal"), "en") : "not a figure this can work out"
                    } kcal${
                      one && one.macros.protein !== undefined
                        ? `, ${said(one.macros.protein, which.floors.has("protein"), "en")} g protein` : ""
                    }.`}
                    bn={`${digits(recipe.serves, "bn")} ভাগ। এক ভাগে ${
                      one ? said(Math.round(one.kcal), which.floors.has("kcal"), "bn") : "হিসাব করা যাচ্ছে না এমন"
                    } ক্যালোরি${
                      one && one.macros.protein !== undefined
                        ? `, ${said(one.macros.protein, which.floors.has("protein"), "bn")} গ্রাম প্রোটিন` : ""
                    }।`}
                  />
                </p>

                <div className="dt-measure-row">
                  <Field
                    id={`dt-portions-${id}`}
                    type="number" inputMode="decimal" step="0.25" min={0}
                    label={<T en="Portions eaten" bn="কয় ভাগ খেয়েছেন" />}
                    value={portions[id] ?? "1"}
                    onChange={(e) => setPortions((p) => ({ ...p, [id]: e.target.value }))}
                  />
                  <Button
                    kind="solid"
                    disabled={state === "going" || !servingsOf(recipe, num(portions[id] ?? "1") ?? 0)}
                    onClick={() => void log(recipe)}
                  >
                    <T en="Log it" bn="লিখে ফেলুন" />
                  </Button>
                  <ChipButton
                    pressed={shopping.includes(id)}
                    onClick={() => setShopping((s) =>
                      s.includes(id) ? s.filter((x) => x !== id) : [...s, id])}
                  >
                    <T en="On the list" bn="বাজারের তালিকায়" />
                  </ChipButton>
                </div>

                <Wrote state={state} />
                <WhatIsInIt dish={recipe} lang={lang} />
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---- the pot on the hob ---- */}
      <section className="dt-recipe-pots" aria-labelledby="dt-rec-pots-h">
        <h2 id="dt-rec-pots-h"><T en="On the hob" bn="চুলায় যা আছে" /></h2>

        {loaded && !pots.length ? (
          <TBlock
            en={<p className="dt-hint">Nothing on the hob. A pot is a curry cooked for the
              house rather than a dish with a fixed yield: put in what went in it,
              then take a half, a third, two ladles out of ten. It stays here for a
              week, so the same dinner tomorrow is two taps, and four people eating
              one curry is four different intakes and one piece of typing.</p>}
            bn={<p className="dt-hint">চুলায় কিছু নেই। এক পাত্র মানে বাড়ির জন্য রান্না
              করা তরকারি, আগে থেকে ভাগ ঠিক করা কোনো রান্না নয়: পাত্রে যা যা গেছে দিন,
              তারপর অর্ধেক নিন, তিন ভাগের এক ভাগ নিন, বা দশ হাতার মধ্যে দুই হাতা।
              এটা এক সপ্তাহ এখানে থাকে, তাই কালকের একই রাতের খাবার দুই চাপ, আর এক
              তরকারি চারজন খেলে চার রকম হিসাব হয় আর লেখা হয় একবার।</p>}
          />
        ) : null}

        <ul className="dt-recipe-list">
          {(showOld ? [...hob, ...older] : hob).map((dish) => {
            const id = dish.id as string;
            const which = pot(dish);
            const share = shareFor(dish);
            const taken = shareOf(dish, share);
            const all = shareOf(dish, { took: 1, outOf: 1 });
            const state = logged[id];
            const fed = dish.serves;
            const age = daysOld(dish, today);
            /* A box somebody has just cleared is an unanswered
               question rather than a mistake, and it gets its own
               sentence: telling a reader they cannot take more
               than the pot held, because the box is empty, is the
               tool blaming them for its own state. */
            const unsaid = !Number.isFinite(share.took) || !Number.isFinite(share.outOf)
              || share.took <= 0 || share.outOf <= 0;
            return (
              <li key={id} className="dt-recipe">
                <p className="dt-recipe-name">
                  <T en={dish.en} bn={dish.bn ?? dish.en} />
                </p>
                <p className="dt-why">
                  <T
                    en={`${all ? `The whole pot is ${said(Math.round(all.kcal), which.floors.has("kcal"), "en")} kcal` : "Nothing in this pot carries a figure"}${
                      fed ? `, cooked for ${fed}` : ""
                    }${age === null ? "" : age === 0 ? ", from today"
                      : age === 1 ? ", from yesterday" : `, from ${age} days ago`}.`}
                    bn={`${all ? `পুরো পাত্রে ${said(Math.round(all.kcal), which.floors.has("kcal"), "bn")} ক্যালোরি` : "এই পাত্রের কোনো কিছুরই হিসাব নেই"}${
                      fed ? `, ${digits(fed, "bn")} জনের জন্য রান্না` : ""
                    }${age === null ? "" : age === 0 ? ", আজকের" : age === 1 ? ", গতকালের"
                      : `, ${digits(age, "bn")} দিন আগের`}।`}
                  />
                </p>

                {/* HOW MUCH OF IT YOU HAD, which is a fraction
                    rather than a portion. The chips fill the two
                    boxes and the boxes are the answer, so "two
                    ladles out of ten" needs no chip of its own. */}
                <div className="dt-tags" role="group"
                     aria-label={lang === "bn" ? "কতটা খেয়েছেন" : "How much of it you had"}>
                  {SHARES.map((s) => (
                    <ChipButton
                      key={s.id}
                      pressed={share.took === s.took && share.outOf === s.outOf}
                      onClick={() => setShare(dish, { took: s.took, outOf: s.outOf })}
                    >
                      <T en={s.en} bn={s.bn} />
                    </ChipButton>
                  ))}
                  {fed !== undefined && !SHARES.some((s) => s.outOf === fed) ? (
                    <ChipButton
                      pressed={share.took === 1 && share.outOf === fed}
                      onClick={() => setShare(dish, { took: 1, outOf: fed })}
                    >
                      <T
                        en={`one of ${fed}`}
                        bn={`${digits(fed, "bn")} ভাগের এক ভাগ`}
                      />
                    </ChipButton>
                  ) : null}
                </div>

                <div className="dt-measure-row">
                  <Field
                    id={`dt-took-${id}`}
                    type="number" inputMode="decimal" step="1" min={0}
                    label={<T en="Parts you took" bn="কয় ভাগ নিয়েছেন" />}
                    value={Number.isFinite(share.took) ? String(share.took) : ""}
                    onChange={(e) => setShare(dish, {
                      took: e.target.value === "" ? Number.NaN : Number(e.target.value),
                    })}
                  />
                  <Field
                    id={`dt-of-${id}`}
                    type="number" inputMode="decimal" step="1" min={0}
                    label={<T en="Out of" bn="মোট কয় ভাগের" />}
                    hint={<T
                      en="Ten if you counted ladles, five if five of you ate."
                      bn="হাতা গুনলে দশ, পাঁচজন খেলে পাঁচ।"
                    />}
                    value={Number.isFinite(share.outOf) ? String(share.outOf) : ""}
                    onChange={(e) => setShare(dish, {
                      outOf: e.target.value === "" ? Number.NaN : Number(e.target.value),
                    })}
                  />
                </div>

                <p className="dt-value">
                  {taken ? (
                    <T
                      en={`That share is ${said(Math.round(taken.kcal), which.floors.has("kcal"), "en")} kcal${
                        taken.macros.protein !== undefined
                          ? `, ${said(taken.macros.protein, which.floors.has("protein"), "en")} g protein` : ""
                      }.`}
                      bn={`ওই ভাগে ${said(Math.round(taken.kcal), which.floors.has("kcal"), "bn")} ক্যালোরি${
                        taken.macros.protein !== undefined
                          ? `, ${said(taken.macros.protein, which.floors.has("protein"), "bn")} গ্রাম প্রোটিন` : ""
                      }।`}
                    />
                  ) : unsaid ? (
                    <T
                      en="Say how much of it you had: press a part above, or count the ladles."
                      bn="কতটা খেয়েছেন লিখুন: উপরের কোনো ভাগে চাপুন, বা হাতা গুনে বলুন।"
                    />
                  ) : fractionOf(share) === null ? (
                    <T
                      en="Nobody can take more out of a pot than went into it. Say a smaller part, or say it was all of it, and nothing is logged until you do."
                      bn="পাত্রে যা আছে তার চেয়ে বেশি কেউ নিতে পারে না। ছোট কোনো ভাগ লিখুন, বা বলুন পুরোটাই খেয়েছেন; তার আগে কিছুই লেখা হবে না।"
                    />
                  ) : (
                    <T
                      en="Nothing in this pot carries a figure, so a share of it cannot be worked out and nothing is logged. Open it up and give one ingredient an amount."
                      bn="এই পাত্রের কোনো কিছুরই হিসাব নেই, তাই এর কোনো ভাগ বের করা যায় না আর কিছুই লেখা হবে না। খুলে অন্তত একটা উপকরণের পরিমাণ দিন।"
                    />
                  )}
                </p>

                <div className="dt-measure-row">
                  <Button
                    kind="solid"
                    disabled={state === "going" || !taken}
                    onClick={() => void take(dish)}
                  >
                    <T en="Log this share" bn="এই ভাগটা লিখুন" />
                  </Button>
                  <ChipButton
                    pressed={shopping.includes(id)}
                    onClick={() => setShopping((s) =>
                      s.includes(id) ? s.filter((x) => x !== id) : [...s, id])}
                  >
                    <T en="On the list" bn="বাজারের তালিকায়" />
                  </ChipButton>
                </div>

                <Wrote state={state} />
                <WhatIsInIt dish={dish} lang={lang} />
              </li>
            );
          })}
        </ul>

        {older.length ? (
          <div className="dt-measure-row">
            <ChipButton pressed={showOld} onClick={() => setShowOld(!showOld)}>
              <T
                en={`${older.length} older pot${older.length === 1 ? "" : "s"}`}
                bn={`${digits(older.length, "bn")}টা পুরোনো পাত্র`}
              />
            </ChipButton>
            <span className="dt-hint">
              <T
                en="A pot drops off this list after a week. Nothing is deleted: this tool cannot know when a pot is empty, and a list that only ever grows is the friction this page is against."
                bn="এক সপ্তাহ পর পট এই তালিকা থেকে সরে যায়। কিছু মুছে ফেলা হয় না: পাত্র কখন খালি হলো তা এই যন্ত্র জানে না, আর যে তালিকা কেবল বাড়ে সেটাই এই পাতার শত্রু।"
              />
            </span>
          </div>
        ) : null}
      </section>

      {/* ---- building one ---- */}
      <section className="dt-recipe-build" aria-labelledby="dt-rec-build-h">
        <h2 id="dt-rec-build-h"><T en="Build a dish" bn="একটা রান্না বানান" /></h2>
        <TBlock
          en={<p className="dt-intro">Put in what went in the pot. Then say either how
            many portions it makes, which keeps it for ever, or who ate from it
            tonight, which keeps it for a week and hands out shares.</p>}
          bn={<p className="dt-intro">পাত্রে যা যা গেছে সব দিন। তারপর বলুন হয় কয় ভাগ
            হয়, যাতে এটা চিরকাল থেকে যায়, নয়তো আজ কারা খেয়েছে, যাতে এটা এক সপ্তাহ
            থাকে আর ভাগ করে দেয়।</p>}
        />

        {/* THE ONE QUESTION THAT MAKES THIS TWO BUILDERS. A
            recipe is a yield and lasts; a pot is this week's
            dinner and is taken from in fractions. */}
        <div className="dt-tags" role="group"
             aria-label={lang === "bn" ? "এটা কী ধরনের" : "Which of the two this is"}>
          <ChipButton
            pressed={kind === "recipe"}
            onClick={() => { setKind("recipe"); setServes("4"); }}
          >
            <T en="A dish you will cook again" bn="যে রান্না আবার হবে" />
          </ChipButton>
          <ChipButton
            pressed={kind === "pot"}
            onClick={() => { setKind("pot"); setServes(""); }}
          >
            <T en="One pot, for this week" bn="এক পাত্র, এই সপ্তাহের" />
          </ChipButton>
        </div>

        <div className="dt-form">
          <Field
            id="dt-rec-en" type="text"
            label={<T en="What it is called" bn="নাম" />}
            value={en} onChange={(e) => setEn(e.target.value)}
          />
          <Field
            id="dt-rec-bn" type="text"
            label={<T en="The same name in Bangla" bn="বাংলায় একই নাম" />}
            hint={<T
              en="Not required. A dish with both is a dish that reads properly whichever language this tool is in."
              bn="না দিলেও চলে। দুটোই থাকলে যন্ত্র যে ভাষাতেই থাকুক, নামটা ঠিকভাবে পড়া যায়।"
            />}
            value={bn} onChange={(e) => setBn(e.target.value)}
          />
          <Field
            id="dt-rec-serves" type="number" inputMode="decimal" min={0.5} step="0.5"
            label={kind === "recipe"
              ? <T en="Portions it makes" bn="কয় ভাগ হয়" />
              : <T en="How many ate from it" bn="কয়জন খেয়েছে" />}
            hint={kind === "recipe" ? undefined : (
              <T
                en="Not required. It becomes the share this pot offers first, and a pot nobody counted can still be halved."
                bn="না দিলেও চলে। এটাই হবে এই পাত্র থেকে প্রথমে যে ভাগটা দেখানো হয়, আর কেউ না গুনলেও পাত্র অর্ধেক করা যায়।"
              />
            )}
            value={serves} onChange={(e) => setServes(e.target.value)}
          />
        </div>

        <FoodPicker
          onPick={(e: Omit<Entry, "date">) => setParts((p) => [...p, e])}
          place={place}
          ingredient
        />

        {parts.length ? (
          <ul className="dt-eaten-list">
            {parts.map((part, at) => (
              <li key={`${part.label}-${at}`}>
                <span>{partName(part, lang)}</span>
                <span className="dt-hit-por">{partAmount(part, lang)}</span>
                <span className="mono">
                  {part.kcal === undefined ? "" : digits(Math.round(part.kcal), lang)}
                </span>
                <button
                  type="button" className="dt-drop"
                  aria-label={lang === "bn" ? "এটা বাদ দিন" : "Take this out"}
                  onClick={() => setParts((p) => p.filter((_, i) => i !== at))}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dt-hint">
            <T
              en="Nothing in the pot yet. Search above for what went in, and say how much of each."
              bn="পাত্রে এখনো কিছু নেই। উপরে খুঁজে যা যা দিয়েছেন যোগ করুন, আর কতটা করে দিয়েছেন লিখুন।"
            />
          </p>
        )}

        {/* WHAT IT COMES TO, and what it does not.

            A recipe is shown per portion, because that is the
            unit it will hand out for ever. A pot is shown WHOLE,
            because the unit it hands out is a fraction the reader
            has not chosen yet, and dividing by a yield nobody
            gave would be this page inventing one. */}
        <div className="dt-recipe-sum">
          {kind === "recipe" && made.food && each ? (
            <>
              <p className="dt-value">
                <T
                  en={`${said(Math.round(each.kcal), made.floors.has("kcal"), "en")} kcal a portion`}
                  bn={`ভাগপ্রতি ${said(Math.round(each.kcal), made.floors.has("kcal"), "bn")} ক্যালোরি`}
                />
              </p>
              <ul className="dt-recipe-macros">
                {MACROS.map((m) => {
                  const value: number | undefined = each.macros[m.key];
                  if (value === undefined) return null;
                  return (
                    <li key={m.key}>
                      <T
                        en={`${said(value, made.floors.has(m.key), "en")} g ${m.en}`}
                        bn={`${said(value, made.floors.has(m.key), "bn")} গ্রাম ${m.bn}`}
                      />
                    </li>
                  );
                })}
              </ul>
              <p className="dt-why">
                <T
                  en={`The whole pot is ${said(Math.round(made.food.kcal), made.floors.has("kcal"), "en")} kcal, divided by ${draft.serves ?? 0}.`}
                  bn={`পুরো পাত্র ${said(Math.round(made.food.kcal), made.floors.has("kcal"), "bn")} ক্যালোরি, ${digits(draft.serves ?? 0, "bn")} দিয়ে ভাগ।`}
                />
              </p>
            </>
          ) : kind === "pot" && whole ? (
            <>
              <p className="dt-value">
                <T
                  en={`${said(Math.round(whole.kcal), made.floors.has("kcal"), "en")} kcal in the whole pot`}
                  bn={`পুরো পাত্রে ${said(Math.round(whole.kcal), made.floors.has("kcal"), "bn")} ক্যালোরি`}
                />
              </p>
              <ul className="dt-recipe-macros">
                {MACROS.map((m) => {
                  const value: number | undefined = whole.macros[m.key];
                  if (value === undefined) return null;
                  return (
                    <li key={m.key}>
                      <T
                        en={`${said(value, made.floors.has(m.key), "en")} g ${m.en}`}
                        bn={`${said(value, made.floors.has(m.key), "bn")} গ্রাম ${m.bn}`}
                      />
                    </li>
                  );
                })}
              </ul>
              <p className="dt-why">
                <T
                  en="Nothing is divided yet. Put the pot on, and then say how much of it you had: a half, a third, two ladles out of ten."
                  bn="এখনো কিছু ভাগ করা হয়নি। পাত্রটা চুলায় তুলে দিন, তারপর বলুন কতটা খেয়েছেন: অর্ধেক, তিন ভাগের এক ভাগ, বা দশ হাতার মধ্যে দুই হাতা।"
                />
              </p>
            </>
          ) : (
            <p className="dt-hint">
              {kind === "recipe" ? (
                <T
                  en="A portion needs two things: something in the pot that carries a figure, and how many portions it makes."
                  bn="এক ভাগ বের করতে দুটো জিনিস লাগে: পাত্রে এমন কিছু যার হিসাব আছে, আর কয় ভাগ হয়েছে।"
                />
              ) : (
                <T
                  en="A pot needs one thing: something in it that carries a figure. Who ate is optional."
                  bn="পাত্রের জন্য একটা জিনিসই লাগে: এর মধ্যে এমন কিছু যার হিসাব আছে। কারা খেয়েছে সেটা না বললেও চলে।"
                />
              )}
            </p>
          )}

          {made.silent.length ? (
            <Note tone="warn" title={<T en="Counted as nothing" bn="কিছুই ধরা হয়নি" />}>
              <TBlock
                en={<p>{made.silent.map((p) => p.label).join(", ")} carries no
                  figure, so it adds nothing to the totals above. They are the
                  least this dish can be, not what it is.</p>}
                bn={<p>{made.silent.map((p) => partName(p, "bn")).join(", ")} এর কোনো
                  হিসাব নেই, তাই উপরের যোগফলে এটা কিছুই যোগ করেনি। ওই সংখ্যাগুলো
                  এই রান্নার সবচেয়ে কম হিসাব, আসল হিসাব নয়।</p>}
              />
            </Note>
          ) : null}

          {/* ---- what it cost ---- */}
          {parts.length ? (
            <div className="dt-recipe-cost">
              <p className="dt-value">
                {priced ? (
                  <T
                    en={`${said(priced.cost, !priced.whole, "en")} ${priced.currency} for the whole pot`}
                    bn={`পুরো পাত্রের জন্য ${said(priced.cost, !priced.whole, "bn")} ${priced.currency}`}
                  />
                ) : (
                  <T en="No price for this dish" bn="এই রান্নার কোনো দাম নেই" />
                )}
              </p>

              {priced?.whole ? (
                <p className="dt-said">
                  <T
                    en={`Every part of it carries a checked price, so this is kept with the dish and what a portion of it costs is counted in what your food cost. Prices last checked ${priced.pricedOn}.`}
                    bn={`এর প্রতিটি অংশের যাচাই করা দাম আছে, তাই এটা রান্নাটার সঙ্গে রাখা হয় আর এর এক ভাগের খরচ আপনার খাবারের খরচে গোনা হয়। দাম শেষ যাচাই হয়েছে ${digits(priced.pricedOn ?? "", "bn")}।`}
                  />
                </p>
              ) : (
                <p className="dt-said">
                  {priced ? (
                    <T
                      en={`${priced.missing.map((l) => l.en).join(", ")} carries no checked price, so that figure is the least this dish can have cost rather than what it cost, and no price is kept with it. A dish stored cheaper than it was would make your food look cheaper than it was.`}
                      bn={`${priced.missing.map((l) => l.bn ?? l.en).join(", ")} এর যাচাই করা দাম নেই, তাই ওই সংখ্যাটা এই রান্নার সবচেয়ে কম সম্ভাব্য খরচ, আসল খরচ নয়, আর এর সঙ্গে কোনো দাম রাখা হয় না। আসলের চেয়ে কম দামে রাখা রান্না আপনার খাবারের খরচও কম দেখাবে।`}
                    />
                  ) : (
                    <T
                      en="Either nothing that went in carries a checked price, or what does is priced in two different currencies, and this tool never converts between them: an exchange rate is a fact with no date on it."
                      bn="হয় এতে যা গেছে তার কোনোটিরই যাচাই করা দাম নেই, নয়তো যেগুলোর আছে সেগুলো দুই রকম মুদ্রায়, আর এই যন্ত্র কখনো এক মুদ্রা থেকে আরেক মুদ্রায় হিসাব করে না: বিনিময় হার এমন একটা তথ্য যার সঙ্গে কোনো তারিখ থাকে না।"
                    />
                  )}
                </p>
              )}
            </div>
          ) : null}

          {(made.food || whole) && !made.micros.length ? (
            <p className="dt-why">
              <T
                en="Nutrients past the four above are carried only where every ingredient states one, so most pots with oil in them carry none. It is the safe way round: a dish claiming iron that only half of it stated would make the day look better read than it was."
                bn="উপরের চারটির বাইরের পুষ্টিগুলো তখনই ধরা হয়, যখন প্রতিটি উপকরণেই সেটার হিসাব থাকে, তাই তেল দেওয়া বেশিরভাগ রান্নাতেই সেগুলো থাকে না। এটাই নিরাপদ দিক: অর্ধেক উপকরণের হিসাব দিয়ে আয়রনের দাবি করলে দিনটা যতটা ভালো, তার চেয়ে ভালো দেখাত।"
              />
            </p>
          ) : null}

          <div className="dt-measure-row">
            <Button
              kind="solid"
              disabled={!buildable || !draft.en || saving === "saving"}
              onClick={() => void save()}
            >
              {kind === "recipe"
                ? <T en="Save this dish" bn="রান্নাটা রাখুন" />
                : <T en="Put the pot on" bn="পাত্রটা চুলায় তুলুন" />}
            </Button>
            {saving === "failed" ? (
              <span className="dt-hint">
                <T en="That did not save. Try again." bn="জমা হয়নি। আবার চেষ্টা করুন।" />
              </span>
            ) : null}
          </div>

          <p className="dt-why">
            <T
              en="A logged portion keeps its own numbers, so changing a dish later never rewrites what you ate last month."
              bn="খাতায় ওঠা এক ভাগ নিজের সংখ্যাগুলোই ধরে রাখে, তাই পরে রান্নাটা বদলালেও গত মাসে যা খেয়েছেন তা বদলায় না।"
            />
          </p>
        </div>
      </section>

      {/* ---- the shop ---- */}
      <section className="dt-shop" aria-labelledby="dt-shop-h">
        <h2 id="dt-shop-h"><T en="A list for the shop" bn="বাজারের তালিকা" /></h2>

        {!chosen.length ? (
          <p className="dt-intro">
            <T
              en="Press On the list against a dish above, or several, and what you need for them is added up here with a price where this site has checked one."
              bn="উপরের কোনো রান্নার পাশে বাজারের তালিকায় চাপুন, একটা বা কয়েকটা, তাহলে ওগুলোর জন্য যা লাগবে এখানে যোগ হয়ে যাবে, আর যেখানে এই সাইট দাম যাচাই করেছে সেখানে দামসহ।"
            />
          </p>
        ) : (
          <>
            <ul className="dt-shop-list">
              {shop.lines.map((line) => (
                <li key={line.key}>
                  <span>{lang === "bn" ? line.bn ?? line.en : line.en}</span>
                  <span className="dt-hit-por">
                    {line.unit ? portionWords(digits(line.qty, lang), line.unit, lang) : ""}
                  </span>
                  <span className="mono">
                    {line.cost === undefined
                      ? ""
                      : `${digits(line.cost, lang)} ${line.currency ?? ""}`}
                  </span>
                </li>
              ))}
            </ul>

            {shop.totals.map((total) => (
              <p className="dt-value" key={total.currency}>
                <T
                  en={`${said(total.cost, shop.unpriced.length > 0, "en")} ${total.currency}`}
                  bn={`${said(total.cost, shop.unpriced.length > 0, "bn")} ${total.currency}`}
                />
              </p>
            ))}

            {shop.unpriced.length ? (
              <p className="dt-why">
                <T
                  en={`${shop.unpriced.length} of these carry no checked price, so the figure above is the least the shop can cost rather than what it will cost. No shop is named and no link is offered, here or anywhere in this tool.`}
                  bn={`এর মধ্যে ${digits(shop.unpriced.length, "bn")}টির যাচাই করা দাম নেই, তাই উপরের সংখ্যাটা বাজারের সবচেয়ে কম খরচ, আসল খরচ নয়। কোনো দোকানের নাম বা লিঙ্ক এখানে বা এই যন্ত্রের কোথাও দেওয়া হয় না।`}
                />
              </p>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
