/* The diet tool's arithmetic over recipes, pots, shares and prices.
   `DIET.md` sections 13, 14 and 17. Nothing here renders, and it is a
   `.ts` rather than beside the panel so `next/recipes.test.ts` can assert
   every line with no browser.

   ONE ARITHMETIC, NOT A SECOND COPY: `scaleTo()` and `loggedFrom()` in
   `shared/foods.ts` already take a row stated FOR something and an amount
   eaten. A pot is a food whose stated portion is `serves` portions, so
   nothing here divides by anything, and `scaleTo`'s refusal comes free:
   no yield, or nought servings, logs NOTHING.

   AND THE TOTAL IS A FLOOR, because an error in the flattering direction
   is what this tool is built against: a part stating no energy
   contributes nothing and is named, and one missing macro makes that
   macro a floor for the dish. A MICRONUTRIENT IS ALL OR NOTHING instead,
   because `totalFor()` in `shared/diet.ts` counts an entry's WHOLE energy
   as covered for any key it carries: there is no way to say "two thirds
   covered" inside one entry, so none is the conservative answer. */

import { entryHour, type Entry, type Range } from "@reiad/shared/diet";
import {
  COVERAGE_KEYS, byId, loggedFrom, scaleTo,
  type CoverageKey, type FoundFood, type Portion, type ScaledPortion,
} from "@reiad/shared/foods";
import type { Item, Resolve } from "@reiad/shared/insights";

    /** One ingredient, which is what the food picker already produces:
        `loggedFrom()` returns this shape, so there is nothing to adapt
        between the picker and the pot. */
export type Part = Omit<Entry, "date">;

    /** What a serving is measured in. `UNIT_WORDS` in `shared/foods.ts`
        says it in both languages; nothing here invents a unit. */
export const SERVING = "portion";

/** How many times something has to be logged before it is one
    of your usuals. Section 13's own number. */
export const USUAL_AT = 3;

    /** What went in. A recipe is this with a yield on it and a pot is this
        without one; the arithmetic is the same for both. */
export interface Dish {
      /** The `diet_foods` row's id, absent until saved. It becomes the
          entry's `sourceId`, which makes a logged portion traceable back
          to the dish. */
  id?: string;
  en: string;
  bn?: string;
      /** Portions the pot makes. A recipe carries one and the migration
          refuses a recipe row without one. On a POT it is how many people
          ate, which the cook may not have counted, and a pot nobody
          counted can still be halved. */
  serves?: number;
  parts: Part[];
  uses?: number;
  lastUsed?: string;
}

/** A dish that states its yield, which is what makes a portion
    of it a thing that exists. */
export interface Recipe extends Dish {
  serves: number;
}

const MACRO_KEYS = ["protein", "carbs", "fat", "fibre"] as const;
type MacroKey = (typeof MACRO_KEYS)[number];

const round = (value: number, places: number): number => {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
};

    /** A figure, or nothing. A `jsonb` column and a public database both
        hand back values this has to refuse. Absent is not zero, which is
        why a missing macro becomes a floor below rather than a nought. */
const num = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

export interface Pot {
      /** The whole pot as a food stated for `serves` portions, or null
          where it cannot be: no energy-bearing ingredients, or no yield.
          Null is a refusal and every caller treats it as one. */
  food: FoundFood | null;
      /** Ingredients that state no energy at all: they contribute nothing,
          and the panel names them rather than letting them look
          counted. */
  silent: Part[];
      /** `kcal`, or a macro key, that at least one ingredient does not
          state. A figure here is a FLOOR: the real total is that or
          more. */
  floors: Set<string>;
  /** Ingredients that carry energy, which is the denominator
      the micronutrient rule above is about. */
  bearing: number;
      /** The micronutrients that survived the all-or-nothing rule, so a
          page can say WHICH. Usually empty. */
  micros: CoverageKey[];
}

/**
 * The pot: every ingredient added up, with what is missing kept
 * rather than rounded away.
 */
export function pot(recipe: Dish): Pot {
  const silent: Part[] = [];
  const floors = new Set<string>();
  const macros: Partial<Record<MacroKey, number>> = {};
  const micros: Partial<Record<CoverageKey, number>> = {};
  const stated: Partial<Record<CoverageKey, number>> = {};
  let kcal = 0;
  let bearing = 0;

  for (const part of recipe.parts) {
    const energy = num(part.kcal);
    if (energy === undefined) {
      silent.push(part);
      floors.add("kcal");
      continue;
    }
    bearing += 1;
    kcal += energy;

    for (const key of MACRO_KEYS) {
      const value = num(part.macros?.[key]);
      if (value === undefined) { floors.add(key); continue; }
      macros[key] = (macros[key] ?? 0) + value;
    }

    for (const key of COVERAGE_KEYS) {
      const value = num(part.micros?.[key]);
      if (value === undefined) continue;
      micros[key] = (micros[key] ?? 0) + value;
      stated[key] = (stated[key] ?? 0) + 1;
    }
  }

      /* ALL OR NOTHING. See the header: an entry carrying a key buys the
         day coverage for the entry's WHOLE energy, so a key any
         energy-bearing ingredient is silent about is dropped whole. */
  for (const key of COVERAGE_KEYS) {
    if (micros[key] !== undefined && stated[key] !== bearing) delete micros[key];
  }

  const carried = COVERAGE_KEYS.filter((key) => micros[key] !== undefined);

  if (!bearing || !(recipe.serves !== undefined && recipe.serves > 0)) {
    return { food: null, silent, floors, bearing, micros: carried };
  }

  return {
    food: {
      ...micros,
      en: recipe.en,
      bn: recipe.bn,
      /* THE POT IS STATED FOR `serves` PORTIONS, which is what
         makes `scaleTo` the whole of the division. */
      qty: recipe.serves,
      unit: SERVING,
      kcal: round(kcal, 1),
      protein: macros.protein === undefined ? undefined : round(macros.protein, 2),
      carbs: macros.carbs === undefined ? undefined : round(macros.carbs, 2),
      fat: macros.fat === undefined ? undefined : round(macros.fat, 2),
      fibre: macros.fibre === undefined ? undefined : round(macros.fibre, 2),
    },
    silent,
    floors,
    bearing,
    micros: carried,
  };
}

    /** `n` servings of it, or null. The refusal is `scaleTo`'s and is
        deliberately not softened. */
export function servingsOf(recipe: Dish, n: number): ScaledPortion | null {
  const made = pot(recipe);
  return made.food ? scaleTo(made.food, { n, unit: SERVING }) : null;
}

    /**
     * What logging `n` servings writes, or null. ONE ENTRY, CARRYING ITS
     * OWN NUMBERS: editing the recipe does not rewrite history, because
     * the row holds the figures rather than a reference. `sourceId` is the
     * recipe, so a portion can still be traced back.
     */
export function logRecipe(
  recipe: Dish, n: number, source = "recipe",
): Omit<Entry, "date"> | null {
  const made = pot(recipe);
  if (!made.food) return null;
  return loggedFrom(made.food, { n, unit: SERVING },
    { source, sourceId: recipe.id });
}

    /* ---- the shared pot, and a share of it ----
       A pot of curry for five and "I had some" is not a plated portion,
       and forcing it into one is why people stop logging. A share is
       `took` out of `outOf`, and a pot stated for `outOf` portions is a
       recipe that serves `outOf`, so `servingsOf` does the division and
       there is no second one here.

       TWO WHOLE NUMBERS, because `diet_entries.qty` is `numeric(9,2)`: a
       third stored as a fraction is 0.33, so every third of a pot would be
       logged one per cent light, for ever, in the flattering direction. */

    /** How much of the pot was taken: `took` parts out of the `outOf` the
        reader has just cut it into. */
export interface Share {
  took: number;
  outOf: number;
}

    /**
     * The share as a fraction of the pot, or null. THE ONE REFUSAL HERE
     * THAT IS NOT `scaleTo`'s: that function would happily scale a pot by
     * 1.4, and 1.4 pots is not a share of one pot. Twelve ladles out of
     * ten is a slip; nothing is written and the panel says why.
     */
export function fractionOf(share: Share): number | null {
  const { took, outOf } = share;
  if (!Number.isFinite(took) || !Number.isFinite(outOf)) return null;
  if (!(outOf > 0) || !(took > 0) || took > outOf) return null;
  return took / outOf;
}

/** That share of the pot, or null. */
export function shareOf(dish: Dish, share: Share): ScaledPortion | null {
  if (fractionOf(share) === null) return null;
  return servingsOf({ ...dish, serves: share.outOf }, share.took);
}

    /**
     * What taking a share writes, or null. `source` is `pot` rather than
     * `recipe`, which `diet_entries_source_known` allows: a recipe's
     * portion is a yield somebody cooks to, a share is a fraction of one
     * evening's pot, and a month of rows should tell them apart.
     */
export function logShare(dish: Dish, share: Share): Omit<Entry, "date"> | null {
  if (fractionOf(share) === null) return null;
  return logRecipe({ ...dish, serves: share.outOf }, share.took, "pot");
}

    /** The ways a pot actually gets divided, in the words a reader would
        use: plain Bangla rather than the formal fractions. Ladles and the
        household count are asked for in numbers, because neither is a
        fixed word. */
export const SHARES: Array<Share & { id: string; en: string; bn: string }> = [
  { id: "half", en: "a half", bn: "অর্ধেক", took: 1, outOf: 2 },
  { id: "third", en: "a third", bn: "তিন ভাগের এক ভাগ", took: 1, outOf: 3 },
  { id: "quarter", en: "a quarter", bn: "চার ভাগের এক ভাগ", took: 1, outOf: 4 },
  { id: "fifth", en: "a fifth", bn: "পাঁচ ভাগের এক ভাগ", took: 1, outOf: 5 },
  { id: "all", en: "all of it", bn: "পুরোটা", took: 1, outOf: 1 },
];

    /** How long a pot stays on the hob. Seven days rather than "until it
        is finished", because nothing here can know when a pot is empty and
        a list that only ever grows is the friction this page removes. */
export const HOB_DAYS = 7;

    /** Whole days from one ISO date to another, positive where the second
        is later.

        `Date.UTC` on the three parts rather than `new Date(iso)`, which
        parses a bare date as UTC midnight and is read back in local time:
        west of Greenwich a pot cooked today would be a day old the moment
        it was saved. */
const daysBetween = (from: string, to: string): number | null => {
  const at = (iso: string): number | null => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    return m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
  };
  const a = at(from);
  const b = at(to);
  return a === null || b === null ? null : Math.round((b - a) / 86_400_000);
};

    /**
     * The pots still worth offering, freshest first. `lastUsed` is the day
     * it was cooked or last taken from, whichever is later, which is the
     * question "is this still on the hob". A pot with no date at all has
     * just been put on, so it leads rather than being dropped.
     */
const stillOn = (dish: Dish, today: string, days: number): boolean => {
  if (!dish.lastUsed) return true;
  const old = daysBetween(dish.lastUsed, today);
      /* A date this cannot read is a date this cannot judge, and hiding a
         pot over an unparseable string loses somebody's dinner to a regex.
         A date AHEAD of today is a device whose clock is out. */
  return old === null || old <= days;
};

/** Freshest first, and a pot with no date leads: `undefined` is
    the pot just put on and nothing has touched it since. */
const byFreshest = (a: Dish, b: Dish): number =>
  (b.lastUsed ?? "9999-99-99").localeCompare(a.lastUsed ?? "9999-99-99");

    /** Whole days since this pot was last somebody's dinner, or null where
        the row does not say. The panel prints it, because a date makes a
        reader work it out. */
export function daysOld(dish: Dish, today: string): number | null {
  if (!dish.lastUsed) return null;
  const old = daysBetween(dish.lastUsed, today);
  return old === null || old < 0 ? null : old;
}

export function onTheHob(dishes: Dish[], today: string, days = HOB_DAYS): Dish[] {
  return dishes.filter((d) => stillOn(d, today, days)).sort(byFreshest);
}

/** The pots this has stopped offering, so a page can say how
    many rather than making them disappear. */
export function offTheHob(dishes: Dish[], today: string, days = HOB_DAYS): Dish[] {
  return dishes.filter((d) => !stillOn(d, today, days)).sort(byFreshest);
}

    /* ---- a plate nobody can weigh ----
       A restaurant plate is not knowable, so eating out is logged as a
       RANGE: the midpoint goes into the day's total and the width into
       `est_low` and `est_high`, which `totalFor()` in `shared/diet.ts`
       adds up as the day's spread. More honest than a false decimal, and
       it costs the reader nothing. */

    /**
     * How wide a plate somebody else cooked is, either way. A fifth: the
     * kacchi biryani plate `shared/foods.ts` states as a midpoint is 900
     * give or take 22 per cent. A reader who knows better types the two
     * numbers instead, which is what `outRange()` is for.
     */
export const OUT_SPREAD = 0.2;

    /**
     * A figure with the width of a restaurant plate on it, or null.
     * SYMMETRIC ON PURPOSE, so the midpoint IS the library row's figure
     * and the entry's macros still follow from its energy. A band that
     * moved the middle would leave a row whose numbers disagree with
     * each other.
     */
export function widened(kcal: number, spread = OUT_SPREAD): Range | null {
  if (!Number.isFinite(kcal) || kcal <= 0) return null;
  if (!Number.isFinite(spread) || spread < 0 || spread >= 1) return null;
  return {
    low: round(kcal * (1 - spread), 1),
    mid: round(kcal, 1),
    high: round(kcal * (1 + spread), 1),
  };
}

    /**
     * Two figures a reader gave for a plate they did not cook, or null.
     * A pair the wrong way round is a slip rather than a range: nothing is
     * written and the page says so, because quietly swapping them would be
     * this tool deciding it knows what somebody meant.
     */
export function outRange(low: number, high: number): Range | null {
  if (!Number.isFinite(low) || !Number.isFinite(high)) return null;
  if (low <= 0 || high <= 0 || high < low) return null;
  return { low: round(low, 1), mid: round((low + high) / 2, 1), high: round(high, 1) };
}

    /**
     * The one-tap "small extras" for a day: the tea with sugar, the
     * biscuit, the mishti at somebody's house. A light day of it is 60 and
     * a heavy one 240. Not accurate, and FAR more accurate than the
     * nothing that would otherwise be recorded. Logged as a range, for the
     * same reason a restaurant plate is.
     */
export const EXTRAS: Range = { low: 60, mid: 150, high: 240 };

    /* ---- the honest option: do not weigh anything ----
       Weighing is the most accurate method and the one most people
       abandon, so a hand is a FIRST-CLASS input rather than a fallback: it
       scales with the person, and 20 per cent accurate every day for a
       year beats 5 per cent accurate for eleven days. */

export interface Hand {
  id: string;
  en: string;
  bn: string;
      /** What it is a portion OF. Four rows; a fifth would be a decision
          rather than a tweak. */
  enOf: string;
  bnOf: string;
      /** What one of them weighs on an adult, to the nearest five grams: a
          palm of meat or fish, a cupped hand of cooked rice or dal, a fist
          of vegetables, a thumb of oil. Every one is an estimate of an
          estimate and the page says so. */
  grams: number;
}

export const HANDS: Hand[] = [
  { id: "palm", en: "a palm", bn: "এক তালু", enOf: "protein", bnOf: "প্রোটিন", grams: 100 },
  { id: "cupped", en: "a cupped hand", bn: "এক আঁজলা", enOf: "carbohydrate", bnOf: "শর্করা", grams: 90 },
  { id: "fist", en: "a fist", bn: "এক মুঠো", enOf: "vegetables", bnOf: "সবজি", grams: 85 },
  { id: "thumb", en: "a thumb", bn: "এক বুড়ো আঙুল", enOf: "fat", bnOf: "চর্বি", grams: 15 },
];

    /* ---- reading a row back ----
       `parts` is `jsonb`, so it arrives as `unknown` and every field has to
       be proved rather than cast: a cast here is the one place a
       stranger's JSON would become a number nobody checked. */

const text = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

/** A `Record<string, number>` out of `unknown`, keeping only the
    keys whose value really is a finite number. */
const figures = (value: unknown): Record<string, number> | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const out: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const n = num(raw);
    if (n !== undefined) out[key] = n;
  }
  return Object.keys(out).length ? out : undefined;
};

export function partsOf(raw: unknown): Part[] {
  if (!Array.isArray(raw)) return [];
  const out: Part[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const label = text(row.label);
    if (!label) continue;
    out.push({
      label,
      labelBn: text(row.labelBn),
      qty: num(row.qty),
      unit: text(row.unit),
      kcal: num(row.kcal),
      macros: figures(row.macros),
      micros: figures(row.micros),
          /* A part read back out of `jsonb` may be a LOGGED row rather than
             an ingredient, and a logged row can be a plate nobody weighed.
             Dropping the band makes the day claim a precision it lacks. */
      estLow: num(row.estLow),
      estHigh: num(row.estHigh),
      source: text(row.source),
      sourceId: text(row.sourceId),
    });
  }
  return out;
}

    /** The shape a `diet_foods` row has, named structurally rather than
        imported, so this file needs nothing from the API layer and node
        can read it alone. `OwnFood` in `next/lib/diet-api.ts` satisfies
        it. */
export interface StoredFood {
  id?: string;
  label: string;
  label_bn?: string;
  kind?: string;
  parts?: unknown;
  serves?: number;
  uses?: number;
  last_used?: string;
      /* The row's figures and its price are both stated for the WHOLE pot,
         which is what makes the energy ratio in `portionsOf()` turn a
         logged share into its share of the money. `priced_on` is a `date`
         here and a `YYYY-MM` month everywhere else. */
  kcal?: number;
  macros?: Record<string, number>;
  price?: number;
  currency?: string;
  priced_on?: string;
}

    /** A stored row as a recipe, or null: a row whose `kind` is not
        `recipe`, or that lost its yield, is not a dish this can serve a
        portion of. */
export function toRecipe(row: StoredFood): Recipe | null {
  if (row.kind !== "recipe") return null;
  const serves = num(row.serves);
  if (serves === undefined || serves <= 0) return null;
  const label = text(row.label);
  if (!label) return null;
  return {
    id: row.id,
    en: label,
    bn: text(row.label_bn),
    serves,
    parts: partsOf(row.parts),
    uses: num(row.uses),
    lastUsed: text(row.last_used),
  };
}

    /** A stored row as a pot, or null.
     *
     * A POT NEEDS NO YIELD, which is the whole difference from `toRecipe`
     * and the reason there are two of these rather than one with a flag.
     * A `serves` of nought is dropped, because it would divide by nothing.
     */
export function toPot(row: StoredFood): Dish | null {
  if (row.kind !== "pot") return null;
  const label = text(row.label);
  if (!label) return null;
  const serves = num(row.serves);
  return {
    id: row.id,
    en: label,
    bn: text(row.label_bn),
    serves: serves !== undefined && serves > 0 ? serves : undefined,
    parts: partsOf(row.parts),
    uses: num(row.uses),
    lastUsed: text(row.last_used),
  };
}

    /* ---- your usuals, counted rather than remembered ----
       `uses` and `last_used` are columns on `diet_foods`, but the COUNT ON
       SCREEN is taken from the log, because the log is what actually
       happened: a stored counter is a cache here and never the source. */

export interface Usual {
  /** What identifies the same thing logged twice. */
  key: string;
      /** The most recent time it was logged, which is the row a tap
          copies: a portion size the reader corrected last week comes
          back. */
  last: Entry;
  times: number;
  lastDate: string;
      /** It has been eaten within three hours of this time of day before.
          Breakfast at eight should offer breakfast. */
  atThisTime: boolean;
}

    /** Two entries are the same thing when they came from the same place
        under the same name in the same unit. The label is folded to lower
        case because free entry is typed by hand. */
const sameThing = (e: Entry): string => [
  e.source ?? "free",
  e.sourceId ?? e.label.trim().toLowerCase(),
  e.unit ?? "",
].join("|");

/** Hours apart on a clock face, so 23:00 and 01:00 are two
    apart rather than twenty-two. */
const clockGap = (a: number, b: number): number => {
  const gap = Math.abs(a - b) % 24;
  return Math.min(gap, 24 - gap);
};

    /**
     * What this reader logs most, most likely first. Ranked rather than
     * scored: things eaten around this time of day first, then most
     * logged, ties broken by most recent. A score would need weights
     * nobody can defend.
     */
export function usualsFrom(
  entries: Entry[], hour?: number, least = USUAL_AT,
): Usual[] {
  const by = new Map<string, Usual>();

  for (const e of entries) {
    if (e.planned) continue;
    const key = sameThing(e);
    const at = entryHour(e);
    const near = hour !== undefined && at !== null && clockGap(at, hour) <= 3;
    const seen = by.get(key);
    if (!seen) {
      by.set(key, {
        key, last: e, times: 1, lastDate: e.date, atThisTime: near,
      });
      continue;
    }
    seen.times += 1;
    seen.atThisTime = seen.atThisTime || near;
    if (e.date >= seen.lastDate) { seen.last = e; seen.lastDate = e.date; }
  }

  return [...by.values()]
    .filter((u) => u.times >= least)
    .sort((a, b) =>
      Number(b.atThisTime) - Number(a.atThisTime)
      || b.times - a.times
      || (a.lastDate < b.lastDate ? 1 : a.lastDate > b.lastDate ? -1 : 0));
}

    /**
     * Yesterday again, dated today. The numbers are COPIED rather than
     * referenced, as everywhere else here, and the hour and the meal come
     * with them because the shape of a day is most of what makes
     * yesterday worth copying.
     */
export function copyOf(entries: Entry[], onto: string): Entry[] {
  return entries
    .filter((e) => !e.planned)
    .map((e) => ({
      date: onto,
      atTime: e.atTime,
      meal: e.meal,
      label: e.label,
      labelBn: e.labelBn,
      qty: e.qty,
      unit: e.unit,
      kcal: e.kcal,
      macros: e.macros,
      micros: e.micros,
          /* HOW MUCH OF IT WAS A GUESS COMES WITH IT. Without these two,
             copying yesterday turns a day that knew its own width into one
             claiming to be measured, and the "give or take" line stops
             being drawn: the error runs towards MORE certainty. */
      estLow: e.estLow,
      estHigh: e.estHigh,
      source: e.source,
      sourceId: e.sourceId,
    }));
}

    /* ---- the shopping list ----
       Ingredients out of the stored recipes, added up, and priced where
       the row came from this site's own portion library, which is the one
       source with a price on it. No new table and no shop: a list of items
       and a figure, no links, no affiliate. The total is a FLOOR whenever
       anything on the list carries no price. */

export interface ShopLine {
  key: string;
  en: string;
  bn?: string;
  qty: number;
  unit: string;
  /** In `currency`, checked in `pricedOn`. All three or none,
      which is the portion library's own rule. */
  cost?: number;
  currency?: string;
  pricedOn?: string;
}

export interface ShopList {
  lines: ShopLine[];
      /** One total per currency, because one number cannot be two. A
          currency here is a floor whenever `unpriced` is not empty. */
  totals: Array<{ currency: string; cost: number }>;
  /** Lines with no price on them, named rather than counted, so
      the reader can see WHICH part of the shop is missing. */
  unpriced: ShopLine[];
}

/** What the food picker puts in front of a library row's id, and
    nothing else on this site writes one. */
export const LIBRARY = "library:";

    /** The library row behind a logged entry's `sourceId`, or nothing.

        THE PREFIX IS THE WHOLE OF IT: `byId()` is keyed by the bare id, so
        a resolver that hands `sourceId` straight over matches no row at
        all, and every reading through it reads zero. */
export const libraryOf = (sourceId: string | undefined): Portion | undefined =>
  sourceId?.startsWith(LIBRARY) ? byId(sourceId.slice(LIBRARY.length)) : undefined;

/** The library row a part was copied from, where it was copied
    from the library at all. */
const libraryRow = (part: Part) =>
  part.source === "library" ? libraryOf(part.sourceId) : undefined;

export function shoppingList(dishes: Dish[]): ShopList {
      /* Gathered first and priced afterwards, out of the TOTAL amount
         rather than per ingredient: pricing each appearance rounds three
         times where this rounds once, and it is the only version where a
         doubled ingredient reads as one line with twice the amount. */
  const by = new Map<string, { part: Part; qty: number; known: boolean }>();

  for (const dish of dishes) {
    for (const part of dish.parts) {
      const qty = num(part.qty);
      const key = `${part.sourceId ?? part.label.trim().toLowerCase()}|${part.unit ?? ""}`;
      const seen = by.get(key);
      if (seen) {
        seen.qty += qty ?? 0;
            /* An amount nobody stated cannot be added to an amount, so the
               line keeps what it has and stops claiming to be the whole. */
        seen.known = seen.known && qty !== undefined;
        continue;
      }
      by.set(key, { part, qty: qty ?? 0, known: qty !== undefined });
    }
  }

  const lines: ShopLine[] = [...by].map(([key, { part, qty, known }]) => {
    const row = libraryRow(part);
    const scaled = known && row?.price !== undefined
      ? scaleTo(row, { n: qty, unit: part.unit ?? row.unit })
      : null;
    return {
      key,
      en: part.label,
      bn: part.labelBn,
      qty,
      unit: part.unit ?? "",
      cost: scaled && row?.price !== undefined
        ? round(row.price * scaled.factor, 2) : undefined,
      currency: scaled ? row?.currency : undefined,
      pricedOn: scaled ? row?.pricedOn : undefined,
    };
  });

  const totals = new Map<string, number>();
  for (const line of lines) {
    if (line.cost === undefined || !line.currency) continue;
    totals.set(line.currency, round((totals.get(line.currency) ?? 0) + line.cost, 2));
  }

  return {
    lines,
    totals: [...totals].map(([currency, cost]) => ({ currency, cost })),
    unpriced: lines.filter((l) => l.cost === undefined),
  };
}

    /* ---- what a dish you cooked yourself cost ----
       The shopping list above already prices the parts, so this adds no
       second arithmetic: it reads that list for ONE dish and decides
       whether the answer is a price or a floor.

       ALL OR NOTHING, the same rule as for a micronutrient and for the
       same reason: `spend()` counts a priced row's WHOLE energy as
       covered, so a dish stored at a floor would be cheaper than it was
       AND would buy the log coverage it has not got. A dish missing one
       part's price stores no price at all, and the panel names the
       part. */

export interface DishPrice {
      /** What the WHOLE pot cost, in `currency`, on the same footing as
          every other figure on the row. A floor wherever `missing` is not
          empty. */
  cost: number;
  currency: string;
  /** The OLDEST month any part was checked in: a total is only
      as fresh as its stalest part. */
  pricedOn?: string;
  /** Parts carrying no checked price, named rather than counted,
      so the panel can say WHICH part is missing. */
  missing: ShopLine[];
  /** Every part priced, in one currency, so `cost` is what the
      dish cost rather than the least it can have cost. */
  whole: boolean;
}

    /** What a dish cost, out of the library's own prices. Null where
        nothing carries a checked price, and null where two currencies do:
        one currency at a time, because an exchange rate is a fact with no
        date on it. */
export function dishPrice(dish: Dish): DishPrice | null {
  const list = shoppingList([dish]);
  if (list.totals.length !== 1) return null;
  const [{ currency, cost }] = list.totals;
  const months = list.lines
    .map((l) => l.pricedOn)
    .filter((m): m is string => Boolean(m))
    .sort();
  return {
    cost,
    currency,
    pricedOn: months[0],
    missing: list.unpriced,
    whole: list.unpriced.length === 0,
  };
}

    /** The three `diet_foods` columns a dish's price writes. Snake case
        because they are column names: the row goes to PostgREST as
        written. */
export interface PriceRow {
  price: number;
  currency: string;
  priced_on: string;
}

    /** Those three columns, or null where the dish has no price this site
        can stand behind. See the header: a floor is not stored. */
export function priceRow(dish: Dish): PriceRow | null {
  const priced = dishPrice(dish);
  if (!priced || !priced.whole || !priced.pricedOn) return null;
  return {
    price: priced.cost,
    currency: priced.currency,
        /* The column is a `date` and the library states a month, so the
           first of it. `diet_foods_priced_with_a_date` refuses a price
           with no date beside it. */
    priced_on: `${priced.pricedOn}-01`,
  };
}

    /** A stored dish as something `spend()` can price. The row states its
        figures FOR THE WHOLE POT and `price` is what that pot cost, so
        `portionsOf()`'s energy ratio turns a logged portion straight into
        its share of the money.

        Undefined where the row states no energy or no protein: a dish
        resolved without them would add nought to the protein the cost per
        gram is divided by. */
const pricedDish = (row: StoredFood): Item | undefined => {
  const protein = row.macros?.protein;
  if (!row.id || !(row.kcal !== undefined && row.kcal > 0)) return undefined;
  if (typeof protein !== "number" || !Number.isFinite(protein)) return undefined;
  return {
    id: row.id,
    en: row.label,
    bn: row.label_bn ?? row.label,
    kcal: row.kcal,
    protein,
    fibre: row.macros?.fibre ?? 0,
    price: row.price,
        /* The library's two, and nothing else: `spend()` counts a row only
           where the currency matches the one asked for, so an unknown
           spelling falls into the uncovered share rather than a total. */
    currency: row.currency === "BDT" || row.currency === "GBP" ? row.currency : undefined,
    pricedOn: row.priced_on?.slice(0, 7),
  };
};

    /** What resolves a logged entry to a row with a price on it: the
        portion library, and the reader's own dishes. Both halves are
        needed and the second is most of it: somebody who cooks logs
        portions of their own pots, and a resolver that knows only the
        library prices none of their dinners. */
export function foodResolver(own: StoredFood[]): Resolve {
  const dishes = new Map<string, Item>();
  for (const row of own) {
    const item = pricedDish(row);
    if (item) dishes.set(item.id, item);
  }
  return (sourceId: string): Item | undefined =>
    libraryOf(sourceId) ?? dishes.get(sourceId);
}
