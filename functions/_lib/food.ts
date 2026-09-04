/* _lib/food.ts: two public food databases, read as one shape.
   DIET.md section 12. Open Food Facts for packaged products and
   barcodes, FoodData Central for the raw and generic foods.

   THE BROWSER NEVER CALLS EITHER ONE. Four reasons, all load
   bearing: the CSP does not change, and `scripts/check-csp.ts`
   would rightly fail either hostname written into a browser
   module; two shapes become one in one place; a search for
   "chicken" is the same search for everybody, so it is cached at
   the edge and neither upstream sees this site's readers one at a
   time; and the FoodData Central key stays a wrangler secret, with
   `canReachFdc()` degrading honestly without it.

   EVERYTHING IS PER 100 GRAMS. Neither upstream states a portion
   this site could trust: Open Food Facts' `serving_size` is free
   text somebody typed, and mixing a per-serving row into a
   per-100 g list is how a log silently doubles. So `qty` is 100,
   `unit` is "g" and `grams` is 100 on every hit, and the portion
   is the reader's to say.

   Macros are grams, minerals are MILLIGRAMS, energy is kcal. An
   upstream unit this file does not recognise leaves a GAP rather
   than a guess: a number in the wrong unit is worse than no
   number, because nothing about the page looks different.

   `source` is printed on every result and `completeness` says how
   much of the record is there, because one upstream is
   crowdsourced and the other is a laboratory and a reader has to
   tell them apart at a glance.

   NO READER'S DATA, EVER. This holds no bearer, writes nothing and
   reads nothing belonging to an account, which is what makes its
   answers safe to keep in a cache everybody shares. */

import { barcodeOf, isBarcode } from "../../shared/foods.ts";
import type { Place } from "../../shared/diet.ts";

/* What a barcode IS lives in `shared/foods.ts`, because the
   browser decides the same thing before it asks and cannot
   import this file: both hostnames below are written out here
   and `check-csp.ts` scans every string under `next/`. */
export { isBarcode };

/** Which database a row came from. Printed on every result and
    never omitted: the difference between a figure out of a
    government laboratory and one a stranger typed into a public
    database is the only thing that makes either usable. */
export type FoodSource = "off" | "fdc";

/** One food, as both upstreams are read into it. `id` is
    `<source>:<upstream id>` so a row copied into a reader's log
    can be traced back to where it came from. */
export interface FoodHit {
  id: string;
  source: FoodSource;
  label: string;
  brand?: string;
  /** The portion the numbers are for. Always 100 g here: see the
      banner. */
  qty: number;
  unit: string;
  grams?: number;
  kcal: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fibre?: number;
  /** Milligrams, these three. Both databases state a mineral in
      grams and both are converted here, once. */
  sodium?: number;
  iron?: number;
  calcium?: number;
  /** Grams: a share of `fat` rather than a mineral. */
  satfat?: number;
  barcode?: string;
  /** How complete the upstream record is, 0 to 1. A crowdsourced
      row missing half its fields must be visibly worse than a
      laboratory one. */
  completeness: number;
}

/** What one upstream came back with. Four answers because they are
    four different sentences on the page, and collapsing any pair
    tells a reader something untrue: `ok` with no hits is "this
    database does not have it"; `failed` is "could not ask";
    `unconfigured` is "there is no key for this one"; `skipped` is
    "the other one answered". */
export type SourceState = "ok" | "failed" | "unconfigured" | "skipped";

export interface UpstreamAnswer {
  state: SourceState;
  hits: FoodHit[];
}

/** The FoodData Central key, and its absence is a working state
    rather than a broken one: every caller checks this first and
    the section says it is not connected. */
export interface FdcEnv {
  FDC_API_KEY?: string;
}

export const canReachFdc = (env: FdcEnv): boolean => Boolean(env.FDC_API_KEY);

/* ---------- the two upstreams ----------

   Written out here and nowhere else. Neither hostname may appear
   under `aab/` or `next/`: see the banner. */

const OFF_SEARCH = "https://world.openfoodfacts.org/cgi/search.pl";
const OFF_PRODUCT = "https://world.openfoodfacts.org/api/v2/product";
const FDC_SEARCH = "https://api.nal.usda.gov/fdc/v1/foods/search";

/** Open Food Facts asks every API caller to identify itself, and
    throttles the ones that do not. */
const AGENT = "reiad.co.uk diet-tool (personal site)";

/** Twenty from each, which is what fits a list somebody reads.
    The merged answer is at most forty, one source's block after
    the other's. */
const PAGE = 20;

/** The basis every number here is on. */
const PER = 100;

const TIMEOUT_MS = 8000;

/* ---------- reading somebody else's JSON ---------- */

const obj = (value: unknown): Record<string, unknown> =>
  (value && typeof value === "object" && !Array.isArray(value))
    ? value as Record<string, unknown>
    : {};

const text = (value: unknown): string =>
  (typeof value === "string" ? value.trim() : "");

/** A finite number, or nothing. Numeric STRINGS are accepted
    because Open Food Facts is typed in by hand and a field that
    came back as "12.5" is a real figure a stricter reader would
    drop. Anything else, an empty string and a NaN included, is a
    gap. */
const num = (value: unknown): number | undefined => {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

/** Rounded on the way out, because a float artefact printed on a
    page ("0.21000000000000002 mg") makes a tool look broken. */
const round = (value: number, places: number): number => {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
};

const maybeRound = (value: number | undefined, places: number): number | undefined =>
  (value === undefined ? undefined : round(value, places));

/* ---------- completeness ---------- */

/** The nine fields a complete record carries. Exported because
    `food.test.ts` asserts the arithmetic against it, and because a
    tenth field added to `FoodHit` without being added here would
    quietly stop counting.

    `kcal` is one of the nine even though every hit has one: a row
    with calories and nothing else scores 1 of 9 rather than 0,
    because it is the one number the log needs. */
export const NUTRIENT_FIELDS = [
  "kcal", "protein", "carbs", "fat", "fibre",
  "sodium", "iron", "calcium", "satfat",
] as const;

type Unscored = Omit<FoodHit, "completeness">;

export const completenessOf = (hit: Unscored): number =>
  round(
    NUTRIENT_FIELDS.filter((field) => hit[field] !== undefined).length
      / NUTRIENT_FIELDS.length,
    2,
  );

/** Everything a source reads off its own row. The portion, the
    rounding and the completeness are added once, below, so the
    two parsers cannot disagree about any of the three. */
interface Draft {
  id: string;
  source: FoodSource;
  label: string;
  brand?: string;
  barcode?: string;
  kcal: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fibre?: number;
  sodium?: number;
  iron?: number;
  calcium?: number;
  satfat?: number;
}

function finish(draft: Draft): FoodHit {
  const hit: Unscored = {
    id: draft.id,
    source: draft.source,
    label: draft.label,
    brand: draft.brand,
    qty: PER,
    unit: "g",
    grams: PER,
    kcal: round(draft.kcal, 1),
    protein: maybeRound(draft.protein, 2),
    carbs: maybeRound(draft.carbs, 2),
    fat: maybeRound(draft.fat, 2),
    fibre: maybeRound(draft.fibre, 2),
    sodium: maybeRound(draft.sodium, 1),
    iron: maybeRound(draft.iron, 2),
    calcium: maybeRound(draft.calcium, 1),
    satfat: maybeRound(draft.satfat, 2),
    barcode: draft.barcode,
  };
  return { ...hit, completeness: completenessOf(hit) };
}

/* ---------- Open Food Facts ----------

   Nutriments are per 100 g under `nutriments`, and the minerals
   are in GRAMS there, which is the one conversion in this half:
   `sodium_100g: 0.42` is 420 mg. */

const kcalFromKj = (kj: number | undefined): number | undefined =>
  (kj === undefined ? undefined : kj / 4.184);

const mgFromG = (grams: number | undefined): number | undefined =>
  (grams === undefined ? undefined : grams * 1000);

/** One Open Food Facts product, or nothing. Three ways a row is
    dropped and each is a row a reader could not use: no id to
    trace it by, no name to read, no calories to log. A row with
    `energy-kcal_100g: 0` is kept: water is a real food. */
export function offHit(product: unknown): FoodHit | null {
  const p = obj(product);
  const n = obj(p.nutriments);

  const code = text(p.code) || text(p._id);
  const label = text(p.product_name) || text(p.product_name_en) || text(p.generic_name);
  if (!code || !label) return null;

  /* A European label states kJ first, so a row with kilojoules
     and no kcal is common rather than exotic. */
  const kcal = num(n["energy-kcal_100g"])
    ?? kcalFromKj(num(n["energy-kj_100g"]) ?? num(n.energy_100g));
  if (kcal === undefined) return null;

  /* `brands` is a comma separated list somebody typed. The first
     one is the brand; the rest are the group that owns it. */
  const brand = text(p.brands).split(",")[0].trim();

  return finish({
    id: `off:${code}`,
    source: "off",
    label,
    brand: brand || undefined,
    barcode: barcodeOf(code),
    kcal,
    protein: num(n.proteins_100g),
    carbs: num(n.carbohydrates_100g),
    fat: num(n.fat_100g),
    fibre: num(n.fiber_100g),
    sodium: mgFromG(num(n.sodium_100g)),
    iron: mgFromG(num(n.iron_100g)),
    calcium: mgFromG(num(n.calcium_100g)),
    satfat: num(n["saturated-fat_100g"]),
  });
}

/** Which country's shelf a product is on, as Open Food Facts
    tags it: `["en:united-kingdom", "en:bangladesh"]`. */
const PLACE_TAG: Record<Place, string> = {
  bd: "bangladesh",
  uk: "united-kingdom",
};

const soldIn = (product: unknown, place: Place): boolean => {
  const tags = obj(product).countries_tags;
  if (!Array.isArray(tags)) return false;
  const want = PLACE_TAG[place];
  return tags.some((tag) => typeof tag === "string" && tag.toLowerCase().endsWith(want));
};

/**
 * A search answer, read into hits, the reader's own country first.
 *
 * `place` ORDERS and never filters. Open Food Facts' Bangladeshi
 * coverage is thin, so filtering to a country would empty the list
 * for exactly the reader who most needs a result.
 */
export function offHits(payload: unknown, place: Place): FoodHit[] {
  const products = obj(payload).products;
  if (!Array.isArray(products)) return [];

  const here: FoodHit[] = [];
  const away: FoodHit[] = [];
  for (const product of products) {
    const hit = offHit(product);
    if (!hit) continue;
    (soldIn(product, place) ? here : away).push(hit);
  }
  return [...here, ...away];
}

/* ---------- FoodData Central ----------

   A nutrient is named by NUMBER rather than by name, because the
   names carry their own commentary and are the half most likely to
   be reworded. `unitName` is read beside every one: the same
   nutrient comes back in G on one row and MG on the next. */

const FDC = {
  kcal: "208",
  kj: "268",
  protein: "203",
  carbs: "205",
  fat: "204",
  fibre: "291",
  sodium: "307",
  iron: "303",
  calcium: "301",
  satfat: "606",
} as const;

interface Measured {
  value: number;
  unit: string;
}

function measurements(food: Record<string, unknown>): Map<string, Measured> {
  const out = new Map<string, Measured>();
  const list = food.foodNutrients;
  if (!Array.isArray(list)) return out;

  for (const raw of list) {
    const n = obj(raw);
    const number = text(n.nutrientNumber);
    const value = num(n.value);
    if (!number || value === undefined) continue;
    /* First wins. A search row carries one entry per nutrient;
       where it carries two, the second is a recalculation and
       taking it would change a figure between two identical
       requests. */
    if (!out.has(number)) out.set(number, { value, unit: text(n.unitName).toUpperCase() });
  }
  return out;
}

/* An unrecognised unit is a GAP, never a guess: a milligram
   figure printed as grams is a thousandfold error that nothing
   on the page would look different for. */

const asGrams = (m: Measured | undefined): number | undefined => {
  if (!m) return undefined;
  if (m.unit === "G") return m.value;
  if (m.unit === "MG") return m.value / 1000;
  if (m.unit === "UG") return m.value / 1_000_000;
  return undefined;
};

const asMg = (m: Measured | undefined): number | undefined => {
  if (!m) return undefined;
  if (m.unit === "MG") return m.value;
  if (m.unit === "G") return m.value * 1000;
  if (m.unit === "UG") return m.value / 1000;
  return undefined;
};

const asKcal = (m: Measured | undefined): number | undefined => {
  if (!m) return undefined;
  if (m.unit === "KCAL") return m.value;
  if (m.unit === "KJ") return m.value / 4.184;
  return undefined;
};

/** One FoodData Central food, or nothing. Dropped on the same
    three grounds as an Open Food Facts row. */
export function fdcHit(food: unknown): FoodHit | null {
  const f = obj(food);
  const id = text(f.fdcId) || String(num(f.fdcId) ?? "");
  const label = text(f.description);
  if (!id || !label) return null;

  const m = measurements(f);
  const kcal = asKcal(m.get(FDC.kcal)) ?? asKcal(m.get(FDC.kj));
  if (kcal === undefined) return null;

  return finish({
    id: `fdc:${id}`,
    source: "fdc",
    label,
    brand: text(f.brandName) || text(f.brandOwner) || undefined,
    barcode: barcodeOf(text(f.gtinUpc)),
    kcal,
    protein: asGrams(m.get(FDC.protein)),
    carbs: asGrams(m.get(FDC.carbs)),
    fat: asGrams(m.get(FDC.fat)),
    fibre: asGrams(m.get(FDC.fibre)),
    sodium: asMg(m.get(FDC.sodium)),
    iron: asMg(m.get(FDC.iron)),
    calcium: asMg(m.get(FDC.calcium)),
    satfat: asGrams(m.get(FDC.satfat)),
  });
}

export function fdcHits(payload: unknown): FoodHit[] {
  const foods = obj(payload).foods;
  if (!Array.isArray(foods)) return [];
  const out: FoodHit[] = [];
  for (const food of foods) {
    const hit = fdcHit(food);
    if (hit) out.push(hit);
  }
  return out;
}

/* ---------- which source leads ---------- */

export type QueryKind = "barcode" | "packaged" | "generic";

/**
 * What the reader appears to be looking for.
 *
 * A one-word brand ("Nutella") cannot be told from a one-word food
 * ("chicken") by looking at the string, and this does not try.
 * What it reads are the marks a generic food name does not carry:
 * a trademark sign, an ampersand, a possessive, a quantity off a
 * packet. A capital letter after the first character catches the
 * multi-word brands and survives a phone that capitalises the
 * first letter of everything.
 *
 * It decides an ORDER and never a filter, so a keyboard that
 * capitalises every word costs nothing: both sources are in the
 * answer either way, each with its own name on it.
 */
export function queryKind(query: string): QueryKind {
  const q = query.trim();
  if (isBarcode(q)) return "barcode";
  if (/[&®™]/.test(q)) return "packaged";
  if (/'s\b/i.test(q)) return "packaged";
  if (/\d+\s?(g|kg|mg|ml|cl|l|oz|lb)\b/i.test(q)) return "packaged";
  if (/[A-Z]/.test(q.slice(1))) return "packaged";
  return "generic";
}

/**
 * The two blocks, in the order this query deserves.
 *
 * FoodData Central leads a generic query because it is a
 * government laboratory. Open Food Facts leads a barcode or a
 * brand because it is the one keyed on barcodes and the one that
 * holds British supermarket products at all.
 *
 * Inside a block the upstream's own order is kept: that order is
 * its relevance ranking, and re-sorting by completeness would put
 * a well filled irrelevant row above the thing the reader typed.
 */
export function merge(off: FoodHit[], fdc: FoodHit[], kind: QueryKind): FoodHit[] {
  const [first, second] = kind === "generic" ? [fdc, off] : [off, fdc];

  /* One jar of the same thing. Deduped by BARCODE, which is the
     same number in both databases, and never by name, because
     two different products share a name all the time. The
     leading source's copy is the one that survives. */
  const seen = new Set<string>();
  const out: FoodHit[] = [];
  for (const hit of [...first, ...second]) {
    const key = hit.barcode ?? hit.id;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(hit);
  }
  return out;
}

/* ---------- asking ----------

   `{ status, data }` and never a throw, the same shape
   `_lib/broker.ts` answers with and for the same reason: a 404 and
   a timeout are answers a caller has to tell apart, not
   exceptions. Status 0 is "did not answer at all". */

interface Answer {
  status: number;
  data: unknown;
}

async function ask(url: string, headers: Record<string, string> = {}): Promise<Answer> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "User-Agent": AGENT, Accept: "application/json", ...headers },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return { status: 0, data: null };
  }
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

export async function searchOff(query: string, place: Place): Promise<UpstreamAnswer> {
  const url = `${OFF_SEARCH}?search_terms=${encodeURIComponent(query)}`
    + `&json=1&page_size=${PAGE}`;
  const answer = await ask(url);
  if (answer.status !== 200) return { state: "failed", hits: [] };
  return { state: "ok", hits: offHits(answer.data, place) };
}

/**
 * One product by barcode.
 *
 * A 404 here is an ANSWER and not a failure: Open Food Facts says
 * 404 for a barcode it has never seen, and reporting that as a
 * dead upstream would hide a working database behind the wrong
 * sentence.
 */
export async function lookupOff(code: string): Promise<UpstreamAnswer> {
  const answer = await ask(`${OFF_PRODUCT}/${encodeURIComponent(code)}.json`);
  if (answer.status === 404) return { state: "ok", hits: [] };
  if (answer.status !== 200) return { state: "failed", hits: [] };

  /* v2 answers `status: 1` for a product it holds and `status: 0`
     for one it does not, sometimes with a 200 either way. */
  const body = obj(answer.data);
  if (num(body.status) !== 1) return { state: "ok", hits: [] };

  const hit = offHit(body.product);
  return { state: "ok", hits: hit ? [hit] : [] };
}

/**
 * FoodData Central's search.
 *
 * The key rides in the `X-Api-Key` HEADER. The documented
 * `&api_key=` query parameter works too and is deliberately not
 * used: a credential in a query string is a credential in every
 * proxy log and in every cache key built out of a URL.
 */
export async function searchFdc(env: FdcEnv, query: string): Promise<UpstreamAnswer> {
  if (!canReachFdc(env)) return { state: "unconfigured", hits: [] };

  const url = `${FDC_SEARCH}?query=${encodeURIComponent(query)}&pageSize=${PAGE}`;
  const answer = await ask(url, { "X-Api-Key": env.FDC_API_KEY as string });
  if (answer.status !== 200) return { state: "failed", hits: [] };
  return { state: "ok", hits: fdcHits(answer.data) };
}

/**
 * A barcode in FoodData Central, which keys on `gtinUpc` rather
 * than answering a lookup: the search endpoint matches it, so this
 * is a search with the digits as the query and the rows that do
 * not carry that exact barcode dropped.
 */
export async function lookupFdc(env: FdcEnv, code: string): Promise<UpstreamAnswer> {
  const answer = await searchFdc(env, code);
  if (answer.state !== "ok") return answer;
  return { state: "ok", hits: answer.hits.filter((hit) => hit.barcode === code) };
}
