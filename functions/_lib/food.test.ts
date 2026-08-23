#!/usr/bin/env node
/* ============================================================
   food.test.ts: two food databases, read into one shape.

       node functions/_lib/food.test.ts

   ---- no network, and that is enforced rather than intended ----

   `fetch` is replaced below by something that throws, so a
   function that reached upstream would fail here rather than
   pass on a good day and hang in CI. Both upstreams are free
   services this site is a guest of, and a test suite that
   searched them on every run would be a bad guest.

   That is also what makes the `canReachFdc()` guard testable:
   `searchFdc()` with no key has to answer before it fetches, and
   the only way to prove it does is for a fetch to be fatal.

   ---- and the arithmetic that turns a hit into a row ----

   A result is stated per 100 g or per cup and what was eaten is
   a different number, so `shared/foods.ts` scales one into the
   other and REFUSES where it cannot do it honestly. That half is
   asserted here rather than in a browser, because it is
   arithmetic: the component that calls it only has to pass a
   number.

   ---- why fixtures rather than the real answers ----

   Everything this file can get wrong is a shape problem: a unit
   read as the wrong unit, a field counted that is not there, a
   crowdsourced row that looks as complete as a laboratory one.
   The payloads below carry the real shapes with their own
   values, including the two that broke real parsers: a figure
   typed in as a STRING, and a European label with kilojoules and
   no kcal.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  NUTRIENT_FIELDS, canReachFdc, completenessOf, fdcHit, fdcHits, isBarcode,
  lookupFdc, merge, offHit, offHits, queryKind, searchFdc,
} from "./food.ts";
import type { FoodHit } from "./food.ts";
import {
  COVERAGE_KEYS, DEFAULT_PLACE, FOODS, UNIT_WORDS, barcodeOf, byId, loggedFrom,
  portionWords, scaleTo,
} from "../../shared/foods.ts";
import type { Stated } from "../../shared/foods.ts";

let bad = 0;
const ok = (name: string, cond: boolean, detail = ""): void => {
  console.log(`${cond ? "  ok " : "FAIL"}  ${name}${cond ? "" : `\n        ${detail}`}`);
  if (!cond) bad += 1;
};

/* The whole file runs with the network taken away. */
globalThis.fetch = (): Promise<Response> => {
  throw new Error("this test must not reach the network");
};

/* ---------- Open Food Facts, as it answers ---------- */

const OFF_SEARCH = {
  count: 6,
  page: 1,
  page_size: 20,
  products: [
    {
      code: "5000112637922",
      product_name: "Wholemeal loaf",
      brands: "A Bakery, Some Group",
      countries_tags: ["en:united-kingdom", "en:ireland"],
      nutriments: {
        "energy-kcal_100g": 247,
        proteins_100g: 9.4,
        carbohydrates_100g: 41.2,
        fat_100g: 2.7,
        fiber_100g: 6.8,
        sodium_100g: 0.42,
        iron_100g: 0.0042,
        calcium_100g: 0.132,
        "saturated-fat_100g": 0.6,
      },
    },
    {
      /* A crowdsourced row with a name, a barcode and a calorie
         count, which is what half of this database is. The
         figure is a STRING because somebody typed it. */
      code: "8901234567890",
      product_name: "Puffed rice",
      brands: "",
      countries_tags: ["en:bangladesh"],
      nutriments: { "energy-kcal_100g": "402" },
    },
    {
      /* A European label states kJ first. */
      code: "3017620422003",
      product_name: "Fizzy orange",
      countries_tags: ["en:france"],
      nutriments: { "energy-kj_100g": 823, proteins_100g: 0 },
    },
    { code: "1111111111111", nutriments: { "energy-kcal_100g": 100 } },
    { product_name: "No code at all", nutriments: { "energy-kcal_100g": 100 } },
    { code: "2222222222222", product_name: "No energy", nutriments: { proteins_100g: 3 } },
  ],
};

/* ---------- FoodData Central, as it answers ---------- */

const FDC_SEARCH = {
  totalHits: 4,
  foods: [
    {
      fdcId: 171705,
      description: "Chicken, broilers or fryers, breast, meat only, raw",
      dataType: "SR Legacy",
      foodNutrients: [
        { nutrientNumber: "208", nutrientName: "Energy", unitName: "KCAL", value: 114 },
        { nutrientNumber: "203", nutrientName: "Protein", unitName: "G", value: 21.23 },
        { nutrientNumber: "205", unitName: "G", value: 0 },
        { nutrientNumber: "204", unitName: "G", value: 2.59 },
        { nutrientNumber: "291", unitName: "G", value: 0 },
        { nutrientNumber: "307", unitName: "MG", value: 45 },
        { nutrientNumber: "303", unitName: "MG", value: 0.37 },
        { nutrientNumber: "301", unitName: "MG", value: 5 },
        { nutrientNumber: "606", unitName: "G", value: 0.68 },
      ],
    },
    {
      /* Branded, and the same jar the loaf above is: one barcode
         in two databases. Three units, and one of them is a unit
         this file deliberately does not read. */
      fdcId: 2003948,
      description: "PEANUT BUTTER",
      brandName: "A Brand",
      brandOwner: "A Group",
      gtinUpc: "5000112637922",
      foodNutrients: [
        { nutrientNumber: "208", unitName: "KCAL", value: 600 },
        { nutrientNumber: "303", unitName: "UG", value: 1800 },
        { nutrientNumber: "307", unitName: "G", value: 0.4 },
        { nutrientNumber: "301", unitName: "IU", value: 20 },
      ],
    },
    {
      fdcId: 9,
      description: "No energy here",
      foodNutrients: [{ nutrientNumber: "203", unitName: "G", value: 4 }],
    },
    {
      fdcId: 10,
      description: "Kilojoules only",
      foodNutrients: [{ nutrientNumber: "268", unitName: "KJ", value: 1000 }],
    },
  ],
};

const off = offHits(OFF_SEARCH, "uk");
const fdc = fdcHits(FDC_SEARCH);

const by = (hits: FoodHit[], label: string): FoodHit | undefined =>
  hits.find((hit) => hit.label === label);

const loaf = by(off, "Wholemeal loaf");
const rice = by(off, "Puffed rice");
const fizzy = by(off, "Fizzy orange");
const chicken = by(fdc, "Chicken, broilers or fryers, breast, meat only, raw");
const butter = by(fdc, "PEANUT BUTTER");
const kj = by(fdc, "Kilojoules only");

console.log("\n--- one shape, out of two databases ---");

ok("three of six Open Food Facts rows are usable", off.length === 3,
  off.map((h) => h.label).join(" | "));
ok("three of four FoodData Central rows are usable", fdc.length === 3,
  fdc.map((h) => h.label).join(" | "));

ok("every result names its source, always",
  [...off, ...fdc].every((h) => h.source === "off" || h.source === "fdc"));
ok("and the source survives the trip to JSON",
  [...off, ...fdc].every((h) => typeof JSON.parse(JSON.stringify(h)).source === "string"));

ok("an id carries the source and the upstream id",
  loaf?.id === "off:5000112637922" && chicken?.id === "fdc:171705",
  `${loaf?.id} / ${chicken?.id}`);

ok("every hit is per 100 g, said three ways",
  [...off, ...fdc].every((h) => h.qty === 100 && h.unit === "g" && h.grams === 100));

ok("the first brand is the brand, not the group that owns it",
  loaf?.brand === "A Bakery", String(loaf?.brand));
ok("an empty brands field is no brand rather than an empty one",
  rice?.brand === undefined, String(rice?.brand));
ok("FoodData Central's brand name wins over its brand owner",
  butter?.brand === "A Brand", String(butter?.brand));

ok("a barcode is kept where the code is one", loaf?.barcode === "5000112637922");
ok("and read off gtinUpc on the other side", butter?.barcode === "5000112637922");
ok("a laboratory row with no barcode has none", chicken?.barcode === undefined);

console.log("\n--- the numbers, and their units ---");

ok("kcal comes straight off the row", loaf?.kcal === 247);
ok("macros are grams", loaf?.protein === 9.4 && loaf?.carbs === 41.2 && loaf?.fat === 2.7);
ok("fibre too", loaf?.fibre === 6.8);
ok("saturated fat too", loaf?.satfat === 0.6);
ok("Open Food Facts states minerals in grams, so sodium becomes mg",
  loaf?.sodium === 420, String(loaf?.sodium));
ok("iron becomes mg", loaf?.iron === 4.2, String(loaf?.iron));
ok("calcium becomes mg", loaf?.calcium === 132, String(loaf?.calcium));

ok("a figure typed in as a string is a figure", rice?.kcal === 402, String(rice?.kcal));

ok("kilojoules become kcal where that is all there is",
  fizzy?.kcal === 196.7, String(fizzy?.kcal));
ok("on both sides of the wire", kj?.kcal === 239, String(kj?.kcal));

ok("FoodData Central's milligrams stay milligrams", chicken?.iron === 0.37);
ok("its grams become milligrams", butter?.sodium === 400, String(butter?.sodium));
ok("its micrograms become milligrams", butter?.iron === 1.8, String(butter?.iron));
ok("a unit this file does not read leaves a GAP, never a guess",
  butter?.calcium === undefined, String(butter?.calcium));

/* A float artefact printed on a page is what makes a tool look
   broken, and every conversion above is a division. */
ok("nothing comes back with a float artefact on it",
  [...off, ...fdc].every((h) => NUTRIENT_FIELDS.every((f) => {
    const v = h[f];
    return v === undefined || String(v).replace("-", "").replace(".", "").length <= 7;
  })),
  JSON.stringify([...off, ...fdc].map((h) => h.kcal)));

console.log("\n--- completeness, which is what tells them apart ---");

ok("nine fields are counted", NUTRIENT_FIELDS.length === 9);
ok("a laboratory row carries all nine", chicken?.completeness === 1,
  String(chicken?.completeness));
ok("a row with calories and nothing else scores one of nine",
  rice?.completeness === 0.11, String(rice?.completeness));
ok("calories and one macro scores two", fizzy?.completeness === 0.22,
  String(fizzy?.completeness));
ok("three of nine, with the unreadable unit not counted",
  butter?.completeness === 0.33, String(butter?.completeness));
ok("a crowdsourced row missing half its fields is visibly worse than a laboratory one",
  (rice?.completeness ?? 1) < (chicken?.completeness ?? 0));
ok("a complete crowdsourced row is not punished for being crowdsourced",
  loaf?.completeness === 1);

ok("completeness counts presence, not truth: a zero is a figure",
  completenessOf({
    id: "x", source: "fdc", label: "x", qty: 100, unit: "g",
    kcal: 0, protein: 0,
  }) === 0.22);

console.log("\n--- which source leads, and why ---");

ok("a generic query is a laboratory question", queryKind("chicken breast") === "generic");
ok("thirteen digits is a barcode", queryKind("5000112637922") === "barcode");
ok("and so is one typed with spaces in it", queryKind("5000112 637922") === "barcode");
ok("an ampersand is a brand", queryKind("Ben & Jerry's") === "packaged");
ok("so is a quantity off a packet", queryKind("cola 330ml") === "packaged");
ok("so is a capital after the first letter", queryKind("Walkers Ready Salted") === "packaged");
/* Written down as a fact rather than left as a surprise: this is
   the limit the heuristic has, and it costs an order and never a
   result. */
ok("a one-word brand reads as generic, which this cannot fix",
  queryKind("nutella") === "generic");

ok("seven digits is not a barcode", !isBarcode("1234567"));
ok("eight is", isBarcode("12345678"));
ok("fourteen is", isBarcode("12345678901234"));
ok("fifteen is not", !isBarcode("123456789012345"));

const generic = merge(off, fdc, "generic");
const scanned = merge(off, fdc, "barcode");
const branded = merge(off, fdc, "packaged");

ok("a generic query puts FoodData Central first",
  generic[0]?.source === "fdc", generic[0]?.id);
ok("a barcode puts Open Food Facts first",
  scanned[0]?.source === "off", scanned[0]?.id);
ok("so does a brand", branded[0]?.source === "off", branded[0]?.id);

ok("a block keeps its upstream's own order, which is its relevance",
  generic.filter((h) => h.source === "off").map((h) => h.id).join(",")
    === off.filter((h) => h.id !== "off:5000112637922").map((h) => h.id).join(","));

ok("one barcode in two databases is one result",
  generic.length === 5 && scanned.length === 5,
  `${generic.length} / ${scanned.length}`);
ok("and the leading source's copy is the one that survives",
  generic.some((h) => h.id === "fdc:2003948") && !generic.some((h) => h.id === "off:5000112637922"));
ok("the other way round when the query is a barcode",
  scanned.some((h) => h.id === "off:5000112637922") && !scanned.some((h) => h.id === "fdc:2003948"));
ok("nothing else is dropped",
  new Set(generic.map((h) => h.label)).size === 5);

console.log("\n--- the reader's country orders, and never filters ---");

const ukFirst = offHits(OFF_SEARCH, "uk");
const bdFirst = offHits(OFF_SEARCH, "bd");

ok("a British product leads for a British reader", ukFirst[0]?.label === "Wholemeal loaf");
ok("a Bangladeshi one leads for a Bangladeshi reader", bdFirst[0]?.label === "Puffed rice");
ok("and both readers get the same rows, in a different order",
  ukFirst.length === bdFirst.length
    && new Set(ukFirst.map((h) => h.id)).size === new Set(bdFirst.map((h) => h.id)).size
    && ukFirst.every((h) => bdFirst.some((o) => o.id === h.id)),
  `${ukFirst.map((h) => h.id)} vs ${bdFirst.map((h) => h.id)}`);
ok("a product tagged for nowhere in particular is still in the list",
  ukFirst.some((h) => h.label === "Fizzy orange"));

console.log("\n--- a bad row degrades, and never throws ---");

ok("no payload at all is no results", offHits(null, "uk").length === 0);
ok("an empty answer is no results", offHits({}, "bd").length === 0);
ok("products that are not a list is no results",
  offHits({ products: "nonsense" }, "bd").length === 0);
ok("the same on the other side",
  fdcHits(undefined).length === 0 && fdcHits({ foods: {} }).length === 0);

ok("a row with no name is dropped", offHit({ code: "1", nutriments: {} }) === null);
ok("a row with no id is dropped", offHit({ product_name: "x" }) === null);
ok("a row with no calories is dropped, because a food log cannot use it",
  offHit({ code: "1", product_name: "x", nutriments: { proteins_100g: 3 } }) === null);
ok("a food with no calories is not the same thing: zero is kept",
  offHit({ code: "1", product_name: "water", nutriments: { "energy-kcal_100g": 0 } })?.kcal === 0);
ok("a FoodData Central row with no energy is dropped",
  fdcHit({ fdcId: 1, description: "x", foodNutrients: [] }) === null);
ok("rubbish is not a row", fdcHit("nonsense") === null && offHit(42) === null);
ok("and merging nothing with nothing is nothing",
  merge([], [], "generic").length === 0);

console.log("\n--- the missing key degrades honestly ---");

ok("no key is not reachable", !canReachFdc({}));
ok("a key is", canReachFdc({ FDC_API_KEY: "not-a-real-key" }));

const unconfigured = await searchFdc({}, "chicken");
ok("a search with no key answers rather than throwing",
  unconfigured.state === "unconfigured" && unconfigured.hits.length === 0,
  unconfigured.state);
const noBarcode = await lookupFdc({}, "5000112637922");
ok("and so does a barcode lookup", noBarcode.state === "unconfigured");

/* The two above only mean something while this is true: both
   would have thrown rather than answered if the guard had let
   them through to a fetch. */
let network = false;
try {
  await (globalThis.fetch as () => Promise<Response>)();
} catch { network = true; }
ok("and a fetch in this file is fatal, which is what makes that a guard", network);


/* ============================================================
   the portion library's half: what a result becomes in a log
   ============================================================ */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const sourceOf = (path: string): string => readFileSync(join(ROOT, path), "utf8");

console.log("\n--- every unit says its portion in both languages ---");

const unpriced = [...new Set(FOODS.map((f) => f.unit))].filter((u) => !UNIT_WORDS[u]);
ok("every unit in the library has a word in both languages",
  unpriced.length === 0, unpriced.join(" | "));
ok("and neither half of one is empty",
  Object.values(UNIT_WORDS).every((w) => w.en && w.ens && w.bn));

/* A row measured in grams whose `qty` and `grams` disagreed
   would state two different weights for one portion, and
   `scaleTo` would answer differently depending on which unit the
   reader picked. */
const twoWeights = FOODS.filter(
  (f) => f.unit === "g" && f.grams !== undefined && f.grams !== f.qty,
);
ok("a row measured in grams states one weight and not two",
  twoWeights.length === 0, twoWeights.map((f) => f.id).join(" | "));

ok("a portion is said with its unit", portionWords(1, "cup", "en") === "1 cup");
ok("plurals are written out, not derived", portionWords(2, "cup", "en") === "2 cups"
  && portionWords(2, "g", "en") === "2 g",
  `${portionWords(2, "cup", "en")} / ${portionWords(2, "g", "en")}`);
ok("Bangla gets the Bangla word", portionWords("১", "cup", "bn") === "১ কাপ",
  portionWords("১", "cup", "bn"));
ok("and counts with the numeral attached", portionWords("২", "piece", "bn") === "২টা",
  portionWords("২", "piece", "bn"));
ok("a unit out of a database this library has never seen is still readable",
  portionWords(1, "sachet", "en") === "1 sachet");

console.log("\n--- what was found is not what was eaten ---");

const cupOfRice = byId("rice-white-cooked-cup");
const dal = byId("dal-masoor-raw-100g");
const weetabix = byId("weetabix-two");
ok("the fixtures for this section are real rows",
  Boolean(cupOfRice && dal && weetabix),
  `${cupOfRice?.id} / ${dal?.id} / ${weetabix?.id}`);

/* The failure this whole section exists for: a per 100 g
   laboratory row logged as one portion. 250 g of chicken breast
   is 285 kcal and the log used to gain 114. */
const ate250 = chicken ? scaleTo(chicken, { n: 250, unit: "g" }) : null;
ok("a per 100 g row at 250 g is two and a half times the energy",
  ate250?.kcal === 285, String(ate250?.kcal));
ok("EVERY nutrient is scaled by the same factor, not only the calories",
  ate250?.macros.protein === 53.08 && ate250?.micros.sodium === 112.5
    && ate250?.micros.iron === 0.93 && ate250?.micros.calcium === 12.5
    && ate250?.micros.satfat === 1.7,
  JSON.stringify(ate250));

ok("a row stating a portion scales from THAT portion",
  scaleTo(cupOfRice as Stated, { n: 2, unit: "cup" })?.kcal === 410,
  String(scaleTo(cupOfRice as Stated, { n: 2, unit: "cup" })?.kcal));
/* Two biscuits is the row, so four biscuits is twice it and not
   four times it. A row whose qty is not 1 is where an
   off-by-a-portion error hides. */
ok("and a row whose own portion is two scales from two",
  scaleTo(weetabix as Stated, { n: 4, unit: "biscuit" })?.factor === 2,
  String(scaleTo(weetabix as Stated, { n: 4, unit: "biscuit" })?.factor));

ok("grams asked of a row that says what it weighs uses the weight",
  scaleTo(cupOfRice as Stated, { n: 79, unit: "g" })?.factor === 0.5,
  String(scaleTo(cupOfRice as Stated, { n: 79, unit: "g" })?.factor));
ok("and the gram weight of what was eaten comes back with it",
  scaleTo(cupOfRice as Stated, { n: 2, unit: "cup" })?.grams === 316,
  String(scaleTo(cupOfRice as Stated, { n: 2, unit: "cup" })?.grams));

console.log("\n--- and where it cannot be scaled honestly, nothing is logged ---");

/* Three real rows carry no weight and they are the three nobody
   weighs: a restaurant plate, a meal deal and a pint. */
const plate = byId("biryani-plate");
ok("that row is real and says no weight",
  Boolean(plate) && plate?.grams === undefined);
ok("grams asked of a row that never says what it weighs is a refusal",
  scaleTo(plate as Stated, { n: 300, unit: "g" }) === null);
ok("but it still logs in its own unit",
  scaleTo(plate as Stated, { n: 1, unit: "plate" })?.factor === 1);
ok("a unit the row does not know is a refusal",
  scaleTo(cupOfRice as Stated, { n: 1, unit: "tin" }) === null);
ok("nothing eaten is not an entry",
  scaleTo(cupOfRice as Stated, { n: 0, unit: "cup" }) === null);
ok("nor is a negative amount",
  scaleTo(cupOfRice as Stated, { n: -2, unit: "cup" }) === null);
ok("nor is an empty box, which is what Number(\"\") gives",
  scaleTo(cupOfRice as Stated, { n: Number(""), unit: "cup" }) === null);
ok("nor is a NaN out of a half-typed number",
  scaleTo(cupOfRice as Stated, { n: Number("2."), unit: "cup" }) !== null
    && scaleTo(cupOfRice as Stated, { n: Number("x"), unit: "cup" }) === null);
ok("a refusal writes NO ROW, rather than the row's own portion",
  loggedFrom({ ...(cupOfRice as Stated), en: "x" }, { n: 0, unit: "cup" },
    { source: "library" }) === null);

console.log("\n--- absent is absent, and a zero is a figure ---");

const dalAte = scaleTo(dal as Stated, { n: 50, unit: "g" });
ok("the four nutrients this tool watches all arrive",
  dalAte?.micros.sodium === 3 && dalAte?.micros.potassium === 338.5
    && dalAte?.micros.calcium === 17.5 && dalAte?.micros.iron === 3.25,
  JSON.stringify(dalAte?.micros));
/* The bug this replaces wrote `{ fibre: 0 }` and nothing else,
   so one tap took the day's coverage to 100% and every one of
   the four above still read "not known". */
ok("a whole coverage list comes through, not one key of it",
  Object.keys(dalAte?.micros ?? {}).length >= 6,
  Object.keys(dalAte?.micros ?? {}).join(","));
ok("a nutrient the row does not state is ABSENT, never a nought",
  cupOfRice?.calcium === undefined
    && !("calcium" in (scaleTo(cupOfRice as Stated, { n: 1, unit: "cup" })?.micros ?? {})),
  JSON.stringify(scaleTo(cupOfRice as Stated, { n: 1, unit: "cup" })?.micros));
ok("a zero somebody measured is kept, because presence is the question",
  scaleTo({ qty: 100, unit: "g", grams: 100, kcal: 0, sodium: 0 },
    { n: 200, unit: "g" })?.micros.sodium === 0);
ok("fibre is a macro and never a micro, which is what §15 counts",
  !(COVERAGE_KEYS as readonly string[]).includes("fibre")
    && dalAte?.macros.fibre === 5.35, String(dalAte?.macros.fibre));
ok("a row carrying no coverage key at all gets no micros, so it buys no coverage",
  Object.keys(scaleTo({ qty: 100, unit: "g", kcal: 400 },
    { n: 100, unit: "g" })?.micros ?? { a: 1 }).length === 0);

console.log("\n--- a logged row says what it means ---");

const logged = loggedFrom(
  { ...(cupOfRice as Stated), en: cupOfRice?.en ?? "", bn: cupOfRice?.bn },
  { n: 1.5, unit: "cup" }, { source: "library", sourceId: "library:rice-white-cooked-cup" },
);
ok("the amount the reader said is what the row carries",
  logged?.qty === 1.5 && logged?.unit === "cup", JSON.stringify(logged));
ok("and the energy follows from it", logged?.kcal === 307.5, String(logged?.kcal));
ok("with the source and the id it was copied from",
  logged?.source === "library" && logged?.sourceId === "library:rice-white-cooked-cup");
/* `diet_entries.qty` is numeric(9,2), so a row that scaled by
   1.333 and stored 1.33 would be a row whose own numbers do not
   follow from each other. Scaling by the unrounded figure gives
   273.3 rather than 272.7, which is the drift being caught. */
const awkward = loggedFrom({ ...(cupOfRice as Stated), en: "x" },
  { n: 1.333, unit: "cup" }, { source: "library" });
ok("an amount is rounded to what the column holds BEFORE anything is scaled by it",
  awkward?.qty === 1.33 && awkward?.kcal === 272.7,
  `${String(awkward?.qty)} / ${String(awkward?.kcal)}`);

console.log("\n--- a log is kept in both languages, whichever one is on ---");

ok("English goes in the English column", logged?.label === cupOfRice?.en, logged?.label);
ok("and Bangla in the Bangla one", logged?.labelBn === cupOfRice?.bn, logged?.labelBn);
ok("so the two say the same row",
  logged?.label === "cooked white rice, 1 cup"
    && logged?.labelBn === "ভাত (রান্না করা), ১ কাপ");
/* A database that holds one language does not get a translation
   invented for it. The English is the label and the Bangla stays
   empty, which is what the log-form's fallback is for. */
const fromLab = chicken
  ? loggedFrom({ ...chicken, en: chicken.label }, { n: 100, unit: "g" },
    { source: "fdc", sourceId: chicken.id })
  : null;
ok("a source with one language writes that one and invents nothing",
  fromLab?.label === chicken?.label && fromLab?.labelBn === undefined,
  `${fromLab?.label} / ${String(fromLab?.labelBn)}`);

console.log("\n--- one place, and one shape of barcode ---");

ok("the default place is Bangladesh", DEFAULT_PLACE === "bd");

/* Three callers with three defaults is three different libraries
   leading for one reader: the Worker ranked Bangladesh first
   while the picker and the price table asked for the UK. */
const PLACE_CALLERS = [
  "next/components/diet/food-picker.tsx",
  "next/components/diet/foods-panel.tsx",
  "next/components/diet/board.tsx",
  "functions/api/diet/[[route]].ts",
];
const SECOND_DEFAULT = /(useState[^(\n]*\(\s*|\?\?\s*|place\s*=\s*)"(bd|uk)"/;
const PATCH = 'import { DEFAULT_PLACE } from "@reiad/shared/foods", then'
  + ' place={profile?.place ?? DEFAULT_PLACE}';
for (const path of PLACE_CALLERS) {
  const text = sourceOf(path);
  ok(`${path} takes the default place from shared/foods.ts`,
    text.includes("DEFAULT_PLACE"), PATCH);
  ok(`${path} keeps no second default of its own`,
    !SECOND_DEFAULT.test(text),
    `${SECOND_DEFAULT.exec(text)?.[0] ?? ""}: ${PATCH}`);
}

ok("a barcode typed with spaces in it is still a barcode",
  barcodeOf("5000112 637922") === "5000112637922");
ok("and one typed with hyphens", barcodeOf("5-000112-637922") === "5000112637922");
ok("seven digits is nothing", barcodeOf("1234567") === undefined);
ok("and neither is a word", barcodeOf("chicken") === undefined);
ok("the Worker and the browser ask the same question of a string",
  isBarcode("5000112637922") && barcodeOf("5000112637922") !== undefined);

/* `shared/README.md` describes every file in that directory and
   `check-types.ts` fails on one it does not. It cannot see a
   description that has stopped being true, and this file grew
   `scaleTo` and `loggedFrom`, so the sentence saying it holds no
   arithmetic is now the failure `CLAUDE.md` opens with. */
const readme = sourceOf("shared/README.md");
ok("shared/README.md still describes foods.ts truthfully",
  !readme.includes("no arithmetic at all"),
  'replace "Data and four lookups, and no arithmetic at all." with'
  + ' "Data, four lookups, and the arithmetic that scales a found'
  + ' food to the amount that was eaten."');

console.log("\n--- what the two panels have to draw ---");

const picker = sourceOf("next/components/diet/food-picker.tsx");
const panel = sourceOf("next/components/diet/foods-panel.tsx");

ok("the picker prints the portion every figure is for",
  picker.includes("portionWords"));
ok("and the completeness the Worker computes for every hit",
  /h\.completeness/.test(picker) && /chosen\.completeness/.test(picker));
ok("and it decides no nutrient of its own: the arithmetic is one function",
  !picker.includes("micros:") && picker.includes("loggedFrom"));
ok("the price table draws the month each price was checked",
  panel.includes("pricedOn"));
ok("and where each figure came from", panel.includes("{f.source}"));


/* ============================================================ */

console.log(bad ? `\n${bad} check(s) failed.\n` : "\nAll checks passed.\n");
process.exit(bad ? 1 : 0);
