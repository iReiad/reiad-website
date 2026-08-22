/* ============================================================
   recipes.ts: a dish built once, and a portion of it for ever
   after.

   `DIET.md` section 13. A food diary is abandoned because of
   FRICTION rather than motivation, and the fix is that most
   people eat the same forty things: a recipe is the pot in
   section 14 with a yield on it, so the tenth time it is cooked
   costs one tap instead of six searches.

   Nothing here renders. It is the arithmetic, in a `.ts` rather
   than beside the panel, because node runs a `.ts` with no build
   step and cannot import a `.tsx` at all: `next/recipes.test.ts`
   asserts every line below with no browser, which is what puts
   it in CI beside the other checks rather than in the list of
   things somebody has to remember to run.

   ---- one arithmetic, not a second copy ----

   `scaleTo()` and `loggedFrom()` in `shared/foods.ts` already
   take a row stated FOR something and an amount eaten and
   return what to store. A recipe is exactly that shape: the pot
   is a food whose stated portion is `serves` portions, so one
   serving is `scaleTo(pot, { n: 1, unit: "portion" })` and
   nothing here divides by anything.

   That also means the refusal comes free. `scaleTo` returns
   null for an amount it cannot turn into a factor honestly, so
   a recipe with no yield, or a request for nought servings,
   logs NOTHING rather than logging the pot.

   ---- and the total is a floor rather than a figure ----

   An error in the flattering direction is the failure this
   whole tool is built around. So a part that states no energy
   contributes NOTHING and is named on the page, the pot's
   energy is reported as "at least", and the same goes per
   macro: one ingredient with no protein figure makes the
   protein a floor for the whole dish.

   A MICRONUTRIENT IS ALL OR NOTHING, and that is a different
   rule for a reason. `totalFor()` in `shared/diet.ts` counts an
   entry's WHOLE energy as covered for any key that entry
   carries, so a pot carrying iron that only two of its three
   ingredients stated would buy the day iron coverage it does
   not have. There is no way to say "two thirds covered" inside
   one entry, so the honest options are all and none, and none
   is the conservative one.
   ============================================================ */

import { entryHour, type Entry } from "@reiad/shared/diet";
import {
  COVERAGE_KEYS, byId, loggedFrom, scaleTo,
  type CoverageKey, type FoundFood, type ScaledPortion,
} from "@reiad/shared/foods";

/** One ingredient, which is exactly what the food picker
    already produces: `loggedFrom()` returns this shape, so an
    ingredient and a logged item are one type and there is
    nothing to adapt between the picker and the pot. */
export type Part = Omit<Entry, "date">;

/** What a serving is measured in. `UNIT_WORDS` in
    `shared/foods.ts` already says it in both languages, so
    nothing here spells it out and nothing here invents a unit
    that file does not know. */
export const SERVING = "portion";

/** How many times something has to be logged before it is one
    of your usuals. Section 13's own number. */
export const USUAL_AT = 3;

export interface Recipe {
  /** The `diet_foods` row's id, absent until it has been
      saved. It becomes the entry's `sourceId`, which is what
      makes a logged portion traceable back to the dish. */
  id?: string;
  en: string;
  bn?: string;
  /** Portions the pot makes. The migration refuses a recipe row
      without one, because a recipe with no yield cannot produce
      a portion and a portion is the whole of what it is for. */
  serves: number;
  parts: Part[];
  uses?: number;
  lastUsed?: string;
}

const MACRO_KEYS = ["protein", "carbs", "fat", "fibre"] as const;
type MacroKey = (typeof MACRO_KEYS)[number];

const round = (value: number, places: number): number => {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
};

/** A figure, or nothing. A `jsonb` column and a public database
    both hand back values this has to refuse: a string, a NaN, a
    null. Absent is not zero, which is `shared/foods.ts`'s own
    rule and the reason a missing macro becomes a floor below
    rather than a nought. */
const num = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

export interface Pot {
  /** The whole pot as a food stated for `serves` portions, or
      null where it cannot be stated: no ingredients that carry
      energy, or no yield. Null is a refusal, and every caller
      here treats it as one. */
  food: FoundFood | null;
  /** Ingredients that state no energy at all. They contribute
      nothing, and the panel names them rather than letting them
      look counted. */
  silent: Part[];
  /** `kcal`, or a macro key, that at least one ingredient does
      not state. A figure in here is a FLOOR: the real total is
      that or more, never less. */
  floors: Set<string>;
  /** Ingredients that carry energy, which is the denominator
      the micronutrient rule above is about. */
  bearing: number;
  /** The micronutrients that survived the all-or-nothing rule,
      so a page can say WHICH rather than making a reader compare
      two lists. Usually empty, and the header says why. */
  micros: CoverageKey[];
}

/**
 * The pot: every ingredient added up, with what is missing kept
 * rather than rounded away.
 */
export function pot(recipe: Recipe): Pot {
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

  /* ALL OR NOTHING. See the header: a key every energy-bearing
     ingredient states survives, and one any of them is silent
     about is dropped whole, because an entry carrying a key
     buys the day coverage for the entry's WHOLE energy. */
  for (const key of COVERAGE_KEYS) {
    if (micros[key] !== undefined && stated[key] !== bearing) delete micros[key];
  }

  const carried = COVERAGE_KEYS.filter((key) => micros[key] !== undefined);

  if (!bearing || !(recipe.serves > 0)) {
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

/** `n` servings of it, or null. The refusal is `scaleTo`'s and
    is deliberately not softened: an amount that cannot be
    scaled honestly produces nothing. */
export function servingsOf(recipe: Recipe, n: number): ScaledPortion | null {
  const made = pot(recipe);
  return made.food ? scaleTo(made.food, { n, unit: SERVING }) : null;
}

/**
 * What logging `n` servings writes, or null.
 *
 * ONE ENTRY, CARRYING ITS OWN NUMBERS. Section 13: editing the
 * recipe does not rewrite history, and that is true because the
 * row holds the figures rather than a reference to the dish.
 * `sourceId` is the recipe, so a portion can still be traced
 * back to what it was a portion of.
 */
export function logRecipe(recipe: Recipe, n: number): Omit<Entry, "date"> | null {
  const made = pot(recipe);
  if (!made.food) return null;
  return loggedFrom(made.food, { n, unit: SERVING },
    { source: "recipe", sourceId: recipe.id });
}

/* ------------------------------------------------------------
   Reading a row back

   `parts` is `jsonb`, so it arrives as `unknown` and every field
   in it has to be proved rather than cast. A cast here would be
   the one place in this tool where a stranger's JSON becomes a
   number nobody checked, and the numbers are what the whole
   thing is for.
   ------------------------------------------------------------ */

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
      source: text(row.source),
      sourceId: text(row.sourceId),
    });
  }
  return out;
}

/** The shape a `diet_foods` row has, named structurally rather
    than imported, so this file needs nothing from the API layer
    and node can read it on its own. `OwnFood` in
    `next/lib/diet-api.ts` satisfies it. */
export interface StoredFood {
  id?: string;
  label: string;
  label_bn?: string;
  kind?: string;
  parts?: unknown;
  serves?: number;
  uses?: number;
  last_used?: string;
}

/** A stored row as a recipe, or null where the row is not one.
    A row whose `kind` is not `recipe`, or that lost its yield,
    is not a dish this can serve a portion of. */
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

/* ------------------------------------------------------------
   Your usuals, counted rather than remembered

   The single largest reduction in friction available, and it
   costs one sort. `uses` and `last_used` are columns on
   `diet_foods`, but the COUNT ON SCREEN is taken from the log,
   because the log is what actually happened: a number a page
   states about the site's own data is counted rather than
   remembered, which is the rule at the top of `CLAUDE.md` and
   the reason a stored counter is a cache here and never the
   source.
   ------------------------------------------------------------ */

export interface Usual {
  /** What identifies the same thing logged twice. */
  key: string;
  /** The most recent time it was logged, which is the row a tap
      copies: the numbers are its own, so a portion size the
      reader corrected last week is the one that comes back. */
  last: Entry;
  times: number;
  lastDate: string;
  /** It has been eaten within three hours of this time of day
      before. Breakfast at eight in the morning should offer
      breakfast. */
  atThisTime: boolean;
}

/** Two entries are the same thing when they came from the same
    place under the same name in the same unit. The label is
    folded to lower case because free entry is typed by hand and
    "Rice" and "rice" are one dinner. */
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
 * What this reader logs most, most likely first.
 *
 * Ranked rather than scored: the things eaten around this time
 * of day come first, and inside each group the most logged
 * comes first, ties broken by which was eaten most recently.
 * A score would need weights nobody can defend; two groups and
 * one sort can be read out loud.
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
 * Yesterday again, dated today.
 *
 * The most pressed button in any food log, and it is one query
 * and one loop. The numbers are COPIED rather than referenced,
 * exactly as they are everywhere else here, and the hour and
 * the meal come with them because the shape of a day is most of
 * what makes yesterday worth copying.
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
      source: e.source,
      sourceId: e.sourceId,
    }));
}

/* ------------------------------------------------------------
   The shopping list

   Ingredients out of the recipes that are already stored, added
   up, and priced where the row came from this site's own
   portion library, which is the one source with a price on it.

   NO NEW TABLE, and no shop. Section 13: a list of items and a
   figure, no links, no affiliate, ever. And the total is a
   FLOOR whenever anything on the list carries no price, because
   a shopping total that quietly leaves out the meat is the
   flattering error again wearing an apron.
   ------------------------------------------------------------ */

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
  /** One total per currency, because one number cannot be two.
      A currency here is a floor whenever `unpriced` is not
      empty. */
  totals: Array<{ currency: string; cost: number }>;
  /** Lines with no price on them, named rather than counted, so
      the reader can see WHICH part of the shop is missing. */
  unpriced: ShopLine[];
}

/** The library row a part was copied from, where it was copied
    from the library at all. The picker writes `library:<id>`,
    and nothing else on this site does. */
const libraryRow = (part: Part) =>
  part.source === "library" && part.sourceId?.startsWith("library:")
    ? byId(part.sourceId.slice("library:".length))
    : undefined;

export function shoppingList(recipes: Recipe[]): ShopList {
  /* Gathered first and priced afterwards, out of the TOTAL
     amount rather than per ingredient. Pricing each appearance
     and adding the money up rounds three times where this
     rounds once, and it is also the only version where a
     doubled ingredient reads as one line with twice the
     amount. */
  const by = new Map<string, { part: Part; qty: number; known: boolean }>();

  for (const recipe of recipes) {
    for (const part of recipe.parts) {
      const qty = num(part.qty);
      const key = `${part.sourceId ?? part.label.trim().toLowerCase()}|${part.unit ?? ""}`;
      const seen = by.get(key);
      if (seen) {
        seen.qty += qty ?? 0;
        /* An amount nobody stated cannot be added to an amount,
           so the line keeps what it has and stops claiming to be
           the whole of it. */
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
