#!/usr/bin/env node
/* ============================================================
   recipes.test.ts: a dish built once, and the three-tap log it
   unlocks.

       node next/recipes.test.ts

   No browser and no build. `next/lib/recipes.ts` is arithmetic
   over plain objects, so this asserts it beside the other checks
   rather than in the list of things somebody has to remember to
   run: `DIET.md` section 33 asks for exactly that split, the
   numbers here and the pages in a browser.

   ---- why it is bundled rather than imported ----

   Node strips TypeScript with no build step, and refuses to do
   it for anything under `node_modules`. `@reiad/shared` resolves
   INTO `next/node_modules` by design, because Turbopack will not
   resolve above its own root, so a plain import of the module
   under test dies on `shared/foods.ts` rather than on anything
   this file is about. esbuild resolves it from `next/` and
   inlines it, and the result is imported as a `data:` URL.
   `aab/schools/hub.test.ts` does the same thing for the same
   reason and says so at more length.

   ---- what it is really guarding ----

   ONE THING ABOVE ALL: A TOTAL IS NEVER FLATTERING. A recipe is
   somebody's real dinner, and a pot that quietly counts a
   missing ingredient as nought is a day that reads better than
   it was. So every assertion below about a missing figure is
   written from the wrong side: what the arithmetic must REFUSE
   to claim.
   ============================================================ */

/* A module, said out loud, because the top-level `await` below
   is only legal in one and `next/package.json` has no
   `"type": "module"` to say so. It survives type stripping,
   which an `import type` would not. `next/progress.test.ts` is
   written the same way. */
export {};

const { join, dirname } = await import("node:path");
const { fileURLToPath } = await import("node:url");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let build: typeof import("esbuild").build;
try {
  ({ build } = await import("esbuild"));
} catch {
  console.log("SKIP  esbuild is not installed, so the module under test cannot be");
  console.log("      bundled. `npm ci` at the repository root installs it. THIS IS");
  console.log("      NOT A PASS.");
  process.exit(0);
}

/* The module under test, plus the two `shared/foods.ts` exports
   the fixtures need: an ingredient in this test has to be built
   the way the food picker builds one, which is `loggedFrom()`
   over a real library row. A hand-written ingredient would prove
   the arithmetic against a shape nothing produces. */
/* CI HAS NO `next/node_modules`, so `@reiad/shared` does not
   resolve there and esbuild dies on the import rather than on
   anything this file is about. That package IS a copy of
   `shared/`, so the aliases point at the source instead: the
   test runs everywhere, and it runs against the file somebody
   edited rather than against a copy npm may have left stale.

   Built out of the package's own `exports`, so a new module in
   `shared/` needs no line here. */
const { readFileSync } = await import("node:fs");
const EXPORTS = JSON.parse(
  readFileSync(join(ROOT, "shared", "package.json"), "utf8"),
).exports as Record<string, string>;
const alias = Object.fromEntries(
  Object.entries(EXPORTS).map(([sub, file]) => [
    `@reiad/shared${sub.slice(1)}`,
    join(ROOT, "shared", file.replace(/^\.\//, "")),
  ]),
);

const bundled = await build({
  alias,
  stdin: {
    contents: `export * from "./lib/recipes.ts";
               export { byId, loggedFrom } from "@reiad/shared/foods";
               export { spend } from "@reiad/shared/insights";`,
    resolveDir: join(ROOT, "next"),
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "esm",
  platform: "neutral",
  mainFields: ["module", "main"],
  conditions: ["import", "default"],
  logLevel: "silent",
});

/** What that bundle carries. It is imported from a `data:` URL,
    which is not a specifier tsc can resolve, so this is the
    file's own claim about it. */
type Recipes = typeof import("./lib/recipes.ts");
type Foods = Pick<typeof import("@reiad/shared/foods"), "byId" | "loggedFrom">;
type Money = Pick<typeof import("@reiad/shared/insights"), "spend">;

const M = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`
) as Recipes & Foods & Money;

let bad = 0;
const ok = (name: string, cond: unknown, detail = ""): void => {
  console.log(`${cond ? "  ok " : "FAIL"}  ${name}${cond ? "" : `   ${detail}`}`);
  if (!cond) bad += 1;
};

/** One ingredient. A type-only import, which is erased before
    node ever sees it, so this costs the bundle above nothing. */
type Part = import("./lib/recipes.ts").Part;

/** An ingredient exactly as the food picker writes one: a real
    library row, scaled to an amount, with its source kept. */
const part = (id: string, n: number, unit: string): Part => {
  const row = M.byId(id);
  if (!row) throw new Error(`no library row ${id}`);
  const made = M.loggedFrom(row, { n, unit },
    { source: "library", sourceId: `library:${id}` });
  if (!made) throw new Error(`${id} would not scale to ${n} ${unit}`);
  return made;
};

const near = (a: number | undefined, b: number): boolean =>
  a !== undefined && Math.abs(a - b) < 0.005;

/* ------------------------------------------------------------
   1. The pot adds up, and one portion is the pot divided

   Three real ingredients at four servings, which is the worked
   example: 200 g of dry masoor dal, three pieces of chicken
   curry and two tablespoons of soyabean oil.
   ------------------------------------------------------------ */

console.log("\n-- the pot, and a portion of it --");

const khichuri = {
  id: "r-khichuri",
  en: "Chicken khichuri",
  bn: "মুরগির খিচুড়ি",
  serves: 4,
  parts: [
    part("dal-masoor-raw-100g", 200, "g"),
    part("chicken-curry-piece", 3, "piece"),
    part("oil-soyabean-tbsp", 2, "tablespoon"),
  ],
};

const pot = M.pot(khichuri);

ok("the pot is stated for its own yield, in portions",
  pot.food?.qty === 4 && pot.food?.unit === "portion",
  `qty ${String(pot.food?.qty)} unit ${String(pot.food?.unit)}`);
ok("704 + 585 + 248 is 1537 kcal in the pot",
  near(pot.food?.kcal, 1537), String(pot.food?.kcal));
ok("49.2 + 54 + 0 is 103.2 g of protein in the pot",
  near(pot.food?.protein, 103.2), String(pot.food?.protein));
ok("2.2 + 37.5 + 28 is 67.7 g of fat in the pot",
  near(pot.food?.fat, 67.7), String(pot.food?.fat));
ok("nothing in it is a floor", pot.floors.size === 0, [...pot.floors].join(", "));
ok("nothing in it is silent", pot.silent.length === 0);

const one = M.servingsOf(khichuri, 1);
ok("one portion of four is 384.3 kcal", near(one?.kcal, 384.3), String(one?.kcal));
ok("one portion is 25.8 g of protein",
  near(one?.macros.protein, 25.8), String(one?.macros.protein));
ok("one portion is 16.93 g of fat",
  near(one?.macros.fat, 16.93), String(one?.macros.fat));
ok("the factor really is a quarter", one?.factor === 0.25, String(one?.factor));

const two = M.servingsOf(khichuri, 2);
ok("two portions are twice one", near(two?.kcal, 768.5), String(two?.kcal));

/* ------------------------------------------------------------
   2. What it refuses

   `scaleTo()` returns null for an amount it cannot turn into a
   factor honestly, and every caller here has to pass that
   refusal on rather than softening it into the pot's own
   figures.
   ------------------------------------------------------------ */

console.log("\n-- what it refuses --");

ok("a yield of nought is not a recipe",
  M.pot({ ...khichuri, serves: 0 }).food === null);
ok("and it logs nothing", M.logRecipe({ ...khichuri, serves: 0 }, 1) === null);
ok("nought portions eaten logs nothing", M.logRecipe(khichuri, 0) === null);
ok("a negative amount logs nothing", M.logRecipe(khichuri, -2) === null);
ok("an empty pot is not a recipe",
  M.pot({ ...khichuri, parts: [] }).food === null);

/* ------------------------------------------------------------
   3. A missing figure is a floor, never a nought

   The one this file exists for. An ingredient that states no
   energy contributes NOTHING, is named, and turns the total into
   "at least". A macro one ingredient is silent about does the
   same to that macro alone.
   ------------------------------------------------------------ */

console.log("\n-- a floor, never a figure --");

const withGhost = {
  ...khichuri,
  parts: [...khichuri.parts,
    { label: "a handful of coriander", qty: 1, unit: "portion" }],
};
const ghosted = M.pot(withGhost);

ok("an ingredient with no energy is named as silent",
  ghosted.silent.length === 1 && ghosted.silent[0].label === "a handful of coriander");
ok("it adds nothing at all to the energy",
  near(ghosted.food?.kcal, 1537), String(ghosted.food?.kcal));
ok("and the energy becomes a floor", ghosted.floors.has("kcal"));
ok("the pot still knows how many ingredients carried a figure",
  ghosted.bearing === 3, String(ghosted.bearing));

const typedIn = {
  ...khichuri,
  parts: [...khichuri.parts, { label: "two spoons of sugar", kcal: 60 }],
};
const partial = M.pot(typedIn);

ok("a typed ingredient with energy and no macros is counted for its energy",
  near(partial.food?.kcal, 1597), String(partial.food?.kcal));
ok("it is not silent", partial.silent.length === 0);
ok("but the protein becomes a floor", partial.floors.has("protein"));
ok("and so does every other macro it did not state",
  partial.floors.has("carbs") && partial.floors.has("fat") && partial.floors.has("fibre"));
ok("the energy is NOT a floor, because every part stated one",
  !partial.floors.has("kcal"));
ok("the protein figure itself is unchanged, so a floor is a claim about the WORD",
  near(partial.food?.protein, 103.2), String(partial.food?.protein));

/* ------------------------------------------------------------
   4. A micronutrient is all or nothing

   `totalFor()` in `shared/diet.ts` counts an entry's WHOLE
   energy as covered for any key it carries, so a pot claiming
   iron that only two of three ingredients stated would buy the
   day coverage it does not have.
   ------------------------------------------------------------ */

console.log("\n-- all or nothing, for a micronutrient --");

ok("the oil states no iron, so neither does the pot the oil went in",
  pot.food?.iron === undefined, String(pot.food?.iron));
ok("nor sodium, which two of the three do state",
  pot.food?.sodium === undefined, String(pot.food?.sodium));
/* The three that DO survive are the three every one of these
   rows carries, and naming them is the point of `micros`: a page
   that had to compare two lists to find out would print the
   wrong one. */
ok("and it names the ones that did survive rather than leaving a reader to compare",
  pot.micros.join(",") === "magnesium,sugar,water", pot.micros.join(", "));

const allThree = {
  ...khichuri,
  parts: [part("dal-masoor-raw-100g", 100, "g"), part("rice-white-cooked-cup", 2, "cup")],
};
const both = M.pot(allThree);
ok("two rows that both state iron do carry it",
  near(both.food?.iron, 10.3), String(both.food?.iron));
ok("and the pot names it as carried", both.micros.includes("iron"));
ok("a key only one of them states is dropped whole",
  both.food?.calcium === undefined, String(both.food?.calcium));

/* ------------------------------------------------------------
   5. A logged portion carries its own numbers

   Section 13: editing a recipe does not rewrite history. That is
   true because the entry holds the figures rather than a
   reference to the dish, and `sourceId` is the only thread back.
   ------------------------------------------------------------ */

console.log("\n-- what logging one writes --");

const logged = M.logRecipe(khichuri, 1.5);
ok("it is written under the dish's own name",
  logged?.label === "Chicken khichuri");
ok("in both languages, always in that order",
  logged?.labelBn === "মুরগির খিচুড়ি");
ok("the amount is portions", logged?.qty === 1.5 && logged?.unit === "portion");
ok("the energy is one and a half portions", near(logged?.kcal, 576.4), String(logged?.kcal));
ok("the macros are scaled by the same factor, not left at one portion",
  near(logged?.macros?.protein, 38.7), String(logged?.macros?.protein));
ok("it says it came from a recipe", logged?.source === "recipe");
ok("and it points back at which one", logged?.sourceId === "r-khichuri");

/* ------------------------------------------------------------
   6. Reading a row back out of jsonb

   `parts` is a `jsonb` column, so what arrives is `unknown` and
   every field has to be proved. A cast here would be the one
   place a stranger's JSON becomes a number nobody checked.
   ------------------------------------------------------------ */

console.log("\n-- a row is proved, never cast --");

const messy = M.partsOf([
  { label: "rice", qty: 1, unit: "cup", kcal: 205, macros: { protein: 4.3 } },
  { label: "", kcal: 100 },
  { qty: 2, kcal: 100 },
  "a string",
  null,
  { label: "sugar", kcal: "120", qty: Number.NaN },
]);
ok("a row with no label is dropped", messy.length === 2, String(messy.length));
ok("a string figure is refused rather than coerced",
  messy[1]?.kcal === undefined, String(messy[1]?.kcal));
ok("a NaN amount is refused too", messy[1]?.qty === undefined);
ok("what is good survives whole",
  messy[0].label === "rice" && messy[0].macros?.protein === 4.3);
ok("parts that are not an array are no parts at all",
  M.partsOf({ label: "rice" }).length === 0 && M.partsOf(null).length === 0);

ok("a row that is not a recipe is not read as one",
  M.toRecipe({ label: "rice", kind: "item", serves: 4 }) === null);
ok("a recipe that lost its yield is not read as one",
  M.toRecipe({ label: "khichuri", kind: "recipe" }) === null);
ok("a recipe row becomes a recipe",
  M.toRecipe({
    id: "r1", label: "khichuri", label_bn: "খিচুড়ি", kind: "recipe",
    serves: 4, parts: [{ label: "rice", kcal: 205 }], uses: 9, last_used: "2026-08-21",
  })?.bn === "খিচুড়ি");

/* ------------------------------------------------------------
   7. Your usuals, counted rather than remembered

   Anything logged three times is one tap, and the ones eaten
   around this hour come first.
   ------------------------------------------------------------ */

console.log("\n-- your usuals --");

const entry = (
  label: string, date: string, atTime: string, kcal = 100,
): { label: string; date: string; atTime: string; kcal: number; source: string } =>
  ({ label, date, atTime, kcal, source: "free" });

const log = [
  entry("porridge", "2026-08-18", "08:10"),
  entry("porridge", "2026-08-19", "08:20"),
  entry("porridge", "2026-08-20", "07:55"),
  entry("biryani", "2026-08-15", "20:30"),
  entry("biryani", "2026-08-16", "20:40"),
  entry("biryani", "2026-08-17", "21:00"),
  entry("biryani", "2026-08-18", "20:15"),
  entry("a one-off", "2026-08-18", "13:00"),
];

const morning = M.usualsFrom(log, 8);
ok("a thing logged once is not a usual",
  !morning.some((u) => u.last.label === "a one-off"));
ok("at eight in the morning, breakfast leads",
  morning[0]?.last.label === "porridge", morning[0]?.last.label);
ok("even though dinner has been logged more often",
  morning[1]?.last.label === "biryani" && morning[1].times === 4);

const evening = M.usualsFrom(log, 20);
ok("at eight at night, dinner leads", evening[0]?.last.label === "biryani");

const noClock = M.usualsFrom(log);
ok("with no hour to go on it is the most logged first",
  noClock[0]?.last.label === "biryani", noClock[0]?.last.label);
ok("the row it offers is the most recent one, so a corrected portion sticks",
  morning[0]?.lastDate === "2026-08-20", morning[0]?.lastDate);
ok("the count is the count", morning[0]?.times === 3, String(morning[0]?.times));
ok("a planned row is not something that was eaten",
  M.usualsFrom([...log, { ...entry("porridge", "2026-08-21", "08:00"), planned: true }], 8)[0]
    ?.times === 3);
ok("the same food in a different unit is a different thing",
  M.usualsFrom([
    ...log.slice(0, 3).map((e) => ({ ...e, unit: "cup", qty: 1 })),
    ...log.slice(0, 3).map((e) => ({ ...e, unit: "g", qty: 40, date: `${e.date}x` })),
  ], 8).length === 2);

/* ------------------------------------------------------------
   8. Copy yesterday
   ------------------------------------------------------------ */

console.log("\n-- yesterday again --");

const yesterday = [
  { ...entry("porridge", "2026-08-21", "08:00", 210), id: "e1", macros: { protein: 8 } },
  { ...entry("biryani", "2026-08-21", "20:30", 900), id: "e2" },
  { ...entry("a plan", "2026-08-21", "12:00", 500), id: "e3", planned: true },
];
const copied = M.copyOf(yesterday, "2026-08-22");

ok("the planned row is not copied", copied.length === 2, String(copied.length));
ok("everything lands on the new day",
  copied.every((e) => e.date === "2026-08-22"));
ok("the hour comes with it, because the shape of a day is the point",
  copied[0].atTime === "08:00");
ok("the numbers are copied rather than pointed at",
  copied[0].kcal === 210 && copied[0].macros?.protein === 8);
ok("nothing carries yesterday's row id",
  copied.every((e) => !("id" in e && e.id)));

/* HOW MUCH OF YESTERDAY WAS A GUESS COMES WITH IT.

   `copyOf()` built its rows field by field and named twelve of
   them; `estLow` and `estHigh` were not among the twelve, so
   copying a day that knew its own width produced a day claiming
   to be measured, and the "give or take" line simply stopped
   being drawn. Nothing announced it: the copied row has a
   plausible number in it. The error runs towards MORE certainty
   than the tool has, which is the one direction this whole tool
   is arranged against, so it is asserted from that side. */
const banded = M.copyOf([
  { ...entry("a plate nobody weighed", "2026-08-21", "13:00", 900),
    id: "e9", estLow: 700, estHigh: 1100 },
], "2026-08-22");
ok("a plate logged as a range is still a range tomorrow",
  banded[0].estLow === 700 && banded[0].estHigh === 1100);
/* And the same two fields read back out of `jsonb`, which is
   where a saved meal's rows live. Harmless while a recipe's
   ingredients cannot carry a band, and not harmless the moment
   anything reads a LOGGED row back out of that column, which a
   saved meal now does. */
const readBack = M.partsOf([
  { label: "a plate nobody weighed", kcal: 900, estLow: 700, estHigh: 1100 },
]);
ok("a part read back out of jsonb keeps its band too",
  readBack[0].estLow === 700 && readBack[0].estHigh === 1100);

/* ------------------------------------------------------------
   9. The shopping list

   No new table and no shop. A total is a FLOOR the moment
   anything on the list carries no checked price.
   ------------------------------------------------------------ */

console.log("\n-- a list for the shop --");

const shop = M.shoppingList([khichuri]);
ok("one line per ingredient", shop.lines.length === 3, String(shop.lines.length));
ok("the chicken is priced from the library",
  near(shop.lines.find((l) => l.key.includes("chicken"))?.cost, 210));
ok("with the currency and the month it was checked",
  shop.lines.find((l) => l.key.includes("chicken"))?.currency === "BDT"
  && shop.lines.find((l) => l.key.includes("chicken"))?.pricedOn === "2026-08");
ok("a row carrying no price is named rather than counted as free",
  shop.unpriced.length === 1 && shop.unpriced[0].key.includes("dal"));
ok("the total is per currency", shop.totals.length === 1
  && shop.totals[0].currency === "BDT" && near(shop.totals[0].cost, 216));

const twice = M.shoppingList([khichuri, { ...khichuri, id: "r2" }]);
ok("the same ingredient in two dishes is one line with twice the amount",
  twice.lines.length === 3
  && twice.lines.find((l) => l.key.includes("chicken"))?.qty === 6);
ok("and it is priced off the total rather than added up twice",
  near(twice.lines.find((l) => l.key.includes("chicken"))?.cost, 420));

/* ------------------------------------------------------------
   9b. What a dish you cooked yourself cost

   Section 17. The shopping list already prices the parts; what
   is new is whether the answer may be STORED on the dish, and
   the answer is only where every part carried a checked price.
   A dish kept at a floor is cheaper than it was AND buys the
   log the coverage it has not got, which is the flattering
   error twice over.
   ------------------------------------------------------------ */

console.log("\n-- what the dish cost --");

/** The same three ingredients with the dal swapped for one the
    library has a price for, so every part of it is priced. */
const pricedKhichuri = {
  id: "r-priced",
  en: "Chicken khichuri",
  bn: "মুরগির খিচুড়ি",
  serves: 4,
  parts: [
    part("dal-mug-raw-100g", 200, "g"),
    part("chicken-curry-piece", 3, "piece"),
    part("oil-soyabean-tbsp", 2, "tablespoon"),
  ],
};

const floor = M.dishPrice(khichuri);
ok("a dish with one unpriced part still states a figure",
  near(floor?.cost, 216), String(floor?.cost));
ok("and says it is not the whole of it", floor?.whole === false);
ok("naming the part rather than counting it",
  floor?.missing.length === 1 && Boolean(floor?.missing[0].key.includes("dal")));
ok("SO NOTHING IS STORED: a floor kept on the row would read as a price",
  M.priceRow(khichuri) === null);

const full = M.dishPrice(pricedKhichuri);
ok("28 + 210 + 6 is 244 taka for the whole pot", near(full?.cost, 244), String(full?.cost));
ok("every part priced is a price rather than a floor", full?.whole === true);
ok("and it carries the month it was checked", full?.pricedOn === "2026-08");

const kept = M.priceRow(pricedKhichuri);
ok("which is what the three columns hold",
  kept?.price === 244 && kept?.currency === "BDT",
  `${String(kept?.price)} ${String(kept?.currency)}`);
ok("dated to the first of that month, because the column is a date",
  kept?.priced_on === "2026-08-01", String(kept?.priced_on));

/* ONE CURRENCY AT A TIME. An exchange rate is a fact with no
   date on it, so a pot half priced in taka and half in pounds
   has no total to state at all. */
const twoMoneys = {
  id: "r-mixed",
  en: "half here and half there",
  parts: [part("chicken-curry-piece", 1, "piece"), part("oats-raw-40g", 40, "g")],
};
ok("a pot priced in two currencies has no price, rather than a converted one",
  M.dishPrice(twoMoneys) === null && M.priceRow(twoMoneys) === null);
ok("and neither has a pot nothing in which carries one",
  M.dishPrice({ en: "guesswork", parts: [{ label: "a plate", kcal: 600 }] }) === null);

/* ------------------------------------------------------------
   9c. A logged portion of it reaches what the food cost

   The wire, and the half of it that was broken: the picker
   writes `library:<id>` and `byId()` is keyed by the bare id, so
   a resolver that hands the id straight over prices nothing at
   all on a log full of library food.
   ------------------------------------------------------------ */

console.log("\n-- and it reaches the bill --");

ok("the library id a log carries is not the library's own key",
  M.byId("library:dal-mug-cooked-bowl") === undefined);
ok("so the prefix comes off first",
  M.libraryOf("library:dal-mug-cooked-bowl")?.id === "dal-mug-cooked-bowl");
ok("and anything else resolves to nothing rather than to a wrong row",
  M.libraryOf("dal-mug-cooked-bowl") === undefined
  && M.libraryOf(undefined) === undefined);

/** The dish as `diet_foods` holds it: figures and price both
    stated for the WHOLE pot, which is what makes the energy
    ratio in `portionsOf()` a share of the money. */
const storedDish = {
  id: "r-priced",
  label: "Chicken khichuri",
  kind: "recipe",
  serves: 4,
  kcal: 1527,
  macros: { protein: 101.8, fibre: 39.6 },
  price: 244,
  currency: "BDT",
  priced_on: "2026-08-01",
};

const resolve = M.foodResolver([storedDish]);
ok("a stored dish resolves to something with a price on it",
  resolve("r-priced")?.price === 244);
ok("and a library row still resolves beside it",
  resolve("library:dal-mug-cooked-bowl")?.price === 18);
ok("a dish that lost its energy figure resolves to nothing rather than to a divide",
  M.foodResolver([{ ...storedDish, kcal: undefined }])("r-priced") === undefined);
ok("and one that lost its protein does too, because nought would flatter the ratio",
  M.foodResolver([{ ...storedDish, macros: {} }])("r-priced") === undefined);

const bill = M.spend({
  entries: [
    { date: "2026-08-20", label: "Chicken khichuri", kcal: 381.75,
      source: "recipe", sourceId: "r-priced" },
    { date: "2026-08-20", label: "cooked mug dal, 1 bowl", kcal: 150,
      source: "library", sourceId: "library:dal-mug-cooked-bowl" },
  ],
  resolve,
  currency: "BDT",
  now: "2026-08",
});
ok("one portion of four is a quarter of the pot, so 61 taka of the 244",
  near(bill.cost, 79), String(bill.cost));
ok("with the dal's own 18 beside it, and the whole day priced",
  bill.coverage === 1, String(bill.coverage));
ok("and a quarter of the pot's protein counted against it",
  near(bill.proteinPriced, 25.45 + 8.5), String(bill.proteinPriced));

/* ------------------------------------------------------------
   10. The shared pot, and a share of it

   `DIET.md` section 14. A pot of curry for five and "I had some"
   is not a portion. The share is two whole numbers rather than a
   fraction, and this section is mostly about why: a third stored
   as 0.33 would log every pot one percent light, for ever, in
   the flattering direction.
   ------------------------------------------------------------ */

console.log("\n-- the pot, and a share of it --");

/** The same three ingredients with no yield on them at all,
    which is what a pot is: cooked for the house, cut when
    somebody takes from it. */
const potOfCurry = {
  id: "p-curry",
  en: "Friday chicken curry",
  bn: "শুক্রবারের মুরগির ঝোল",
  parts: khichuri.parts,
};

ok("a pot with no yield is still a pot, and the whole of it is the whole of it",
  near(M.shareOf(potOfCurry, { took: 1, outOf: 1 })?.kcal, 1537),
  String(M.shareOf(potOfCurry, { took: 1, outOf: 1 })?.kcal));
ok("a half of it is half of it",
  near(M.shareOf(potOfCurry, { took: 1, outOf: 2 })?.kcal, 768.5),
  String(M.shareOf(potOfCurry, { took: 1, outOf: 2 })?.kcal));

/* THE ONE THIS SECTION EXISTS FOR. A third of 1537 is 512.3 to
   the tenth `diet_entries.kcal` holds. A FRACTION would have had
   to go through `diet_entries.qty`, which is two places, so a
   third would be 0.33 of the pot: 507.2, five kilocalories light
   per meal, every meal, in the direction that flatters. */
const third = M.shareOf(potOfCurry, { took: 1, outOf: 3 });
ok("a third is an exact third of the pot",
  near(third?.kcal, 512.3), String(third?.kcal));
ok("and it is NOT the 507.2 a fraction stored to two places would have given",
  near(third?.kcal, 512.3) && !near(third?.kcal, 507.2), String(third?.kcal));

const ladles = M.shareOf(potOfCurry, { took: 2, outOf: 10 });
ok("two ladles out of ten is a fifth", near(ladles?.kcal, 307.4), String(ladles?.kcal));
ok("the macros are scaled by the same fifth, never just the energy",
  near(ladles?.macros.protein, 20.64), String(ladles?.macros.protein));

const share = M.logShare(potOfCurry, { took: 2, outOf: 10 });
ok("a share is written under the pot's own name in both languages",
  share?.label === "Friday chicken curry" && share?.labelBn === "শুক্রবারের মুরগির ঝোল");
ok("the amount is what was taken, in whole parts",
  share?.qty === 2 && share?.unit === "portion",
  `${String(share?.qty)} ${String(share?.unit)}`);
ok("it says it came from a pot rather than from a recipe",
  share?.source === "pot", String(share?.source));
ok("and it points back at which pot", share?.sourceId === "p-curry");
ok("a recipe's own portion still says recipe, so a month of rows can tell them apart",
  M.logRecipe(khichuri, 1)?.source === "recipe");

/* ------------------------------------------------------------
   11. What a share refuses

   `scaleTo` would happily scale a pot by 1.4. A pot cannot be
   1.4 of itself, so this is the one refusal in the file that
   `shared/foods.ts` does not already make.
   ------------------------------------------------------------ */

console.log("\n-- what a share refuses --");

ok("more than the pot held is not a share of it",
  M.fractionOf({ took: 12, outOf: 10 }) === null);
ok("and it logs nothing at all",
  M.logShare(potOfCurry, { took: 12, outOf: 10 }) === null);
ok("all of it is a share, and the last one that is",
  M.fractionOf({ took: 10, outOf: 10 }) === 1);
ok("nought parts taken is nothing eaten",
  M.fractionOf({ took: 0, outOf: 4 }) === null
  && M.logShare(potOfCurry, { took: 0, outOf: 4 }) === null);
ok("a pot cut into no parts cannot be shared",
  M.fractionOf({ took: 1, outOf: 0 }) === null);
ok("a negative share is not a share",
  M.fractionOf({ took: -1, outOf: 4 }) === null);
ok("and neither is one out of a box somebody left half typed",
  M.fractionOf({ took: Number.NaN, outOf: 4 }) === null
  && M.fractionOf({ took: 1, outOf: Number.NaN }) === null);
ok("a share of a pot with nothing in it that carries a figure logs nothing",
  M.logShare({ en: "an empty pan", parts: [] }, { took: 1, outOf: 2 }) === null);

/* ------------------------------------------------------------
   12. A household of four, one curry, four intakes

   Section 14's own sentence, asserted: four different shares of
   one pot are four different figures and one piece of data
   entry, and they add up to the pot.
   ------------------------------------------------------------ */

console.log("\n-- one curry, four intakes --");

const four = [
  M.shareOf(potOfCurry, { took: 2, outOf: 8 }),
  M.shareOf(potOfCurry, { took: 3, outOf: 8 }),
  M.shareOf(potOfCurry, { took: 2, outOf: 8 }),
  M.shareOf(potOfCurry, { took: 1, outOf: 8 }),
];
ok("four shares of one pot, and none of them is a portion nobody ate",
  four.every((s) => s !== null));
/* To within the tenth of a kilocalorie each row is rounded to,
   which is what `diet_entries.kcal` holds and is the only drift
   there is: no share is computed from another share. */
const eaten = four.reduce((sum, s) => sum + (s?.kcal ?? 0), 0);
ok("they add up to the pot they came out of",
  Math.abs(eaten - 1537) <= 0.4, String(eaten));
ok("and the biggest eater's share really is the biggest",
  (four[1]?.kcal ?? 0) > (four[0]?.kcal ?? 0));

/* ------------------------------------------------------------
   13. The hob, which is a week

   A pot is held for the rest of the week so the same dish
   tomorrow is two taps. Nothing is deleted: this cannot know
   when a pot is empty.
   ------------------------------------------------------------ */

console.log("\n-- what is still on the hob --");

const hobPots = [
  { en: "tonight", parts: [], lastUsed: "2026-08-22" },
  { en: "a week ago", parts: [], lastUsed: "2026-08-15" },
  { en: "eight days ago", parts: [], lastUsed: "2026-08-14" },
  { en: "just put on", parts: [] },
];
const on = M.onTheHob(hobPots, "2026-08-22");
const off = M.offTheHob(hobPots, "2026-08-22");

ok("a pot from a week ago is still on the hob", on.some((d) => d.en === "a week ago"));
ok("one from eight days ago is not", !on.some((d) => d.en === "eight days ago"));
ok("and it is not lost either, it is named as older",
  off.length === 1 && off[0].en === "eight days ago");
ok("a pot nothing has touched yet leads, because it was just put on",
  on[0]?.en === "just put on", on[0]?.en);
ok("and the rest are freshest first",
  on[1]?.en === "tonight" && on[2]?.en === "a week ago",
  on.map((d) => d.en).join(", "));
ok("a row that lost its stored kind is not read as a pot",
  M.toPot({ label: "curry", kind: "recipe", serves: 4 }) === null);
ok("a pot needs no yield to be read back",
  M.toPot({ id: "p1", label: "curry", kind: "pot" })?.serves === undefined);
ok("and a yield of nought on one is dropped rather than kept as a divisor",
  M.toPot({ id: "p1", label: "curry", kind: "pot", serves: 0 })?.serves === undefined);
ok("a real household count survives",
  M.toPot({ id: "p1", label: "curry", kind: "pot", serves: 5 })?.serves === 5);

/* ------------------------------------------------------------
   14. A plate nobody can weigh

   Section 14: a restaurant plate is not knowable, so the
   midpoint goes into the total and the width goes into the day's
   confidence. `totalFor()` in `shared/diet.ts` is what adds the
   widths up, and it has been able to since the day it was
   written.
   ------------------------------------------------------------ */

console.log("\n-- eating out is a range --");

const plate = M.widened(900);
ok("a fifth either way around a 900 kcal plate is 720 to 1080",
  near(plate?.low, 720) && near(plate?.high, 1080),
  `${String(plate?.low)} to ${String(plate?.high)}`);
/* Section 14 puts the kacchi biryani plate between 700 and
   1,100, which is where that fifth comes from. */
ok("which is section 14's own 700 to 1,100 to within 3 percent",
  Math.abs((plate?.low ?? 0) - 700) / 700 < 0.03
  && Math.abs((plate?.high ?? 0) - 1100) / 1100 < 0.03);
ok("THE MIDDLE IS THE FIGURE, so the macros still follow from the energy",
  plate?.mid === 900, String(plate?.mid));
ok("a figure nobody has cannot be widened", M.widened(0) === null
  && M.widened(Number.NaN) === null);

const typed = M.outRange(700, 1100);
ok("two numbers become a range with its own midpoint",
  typed?.low === 700 && typed?.mid === 900 && typed?.high === 1100);
ok("the wrong way round is a slip, and nothing is written",
  M.outRange(1100, 700) === null);
ok("a single figure with no width is still a range of no width",
  M.outRange(500, 500)?.mid === 500);
ok("nought is not a plate", M.outRange(0, 900) === null);

ok("the small extras figure is the middle of its own range",
  M.EXTRAS.mid === (M.EXTRAS.low + M.EXTRAS.high) / 2,
  `${M.EXTRAS.low} ${M.EXTRAS.mid} ${M.EXTRAS.high}`);
ok("and it is modest rather than a number that would swallow a day",
  M.EXTRAS.high < 400 && M.EXTRAS.low > 0);

/* ------------------------------------------------------------
   15. The hand, which is not a fallback

   Section 14: weighing is the most accurate method and it is the
   method most people abandon. A hand is about 20 percent out and
   20 percent out every day for a year beats 5 percent out for
   eleven days.
   ------------------------------------------------------------ */

console.log("\n-- a hand, rather than a scale --");

ok("the four are section 14's four",
  M.HANDS.map((h) => h.id).join(",") === "palm,cupped,fist,thumb",
  M.HANDS.map((h) => h.id).join(", "));
ok("every one says what it is a portion of, in both languages",
  M.HANDS.every((h) => h.en && h.bn && h.enOf && h.bnOf));
ok("and every one weighs something a person could hold",
  M.HANDS.every((h) => h.grams > 0 && h.grams <= 250));
ok("the thumb is the smallest of them, because it is oil",
  Math.min(...M.HANDS.map((h) => h.grams)) === 15);

/* A hand is an amount in GRAMS, so it goes through the same
   `scaleTo` a typed weight does, and a row that never says what
   its portion weighs rightly refuses one. */
const palm = M.HANDS[0].grams;
const breast = M.byId("chicken-curry-piece");
ok("a palm of chicken curry scales like any other weight in grams",
  breast !== undefined
  && near(M.loggedFrom(breast, { n: palm, unit: "g" }, { source: "library" })?.kcal, 195));
const plateRow = M.byId("biryani-plate");
ok("and a restaurant plate, which says no weight, refuses a hand rather than guessing",
  plateRow !== undefined
  && M.loggedFrom(plateRow, { n: palm, unit: "g" }, { source: "library" }) === null);

/* ------------------------------------------------------------ */
console.log(bad
  ? `\n${bad} problem(s). A recipe is somebody's real dinner: a total that\n`
    + "is wrong in the flattering direction is the failure this file exists for.\n"
  : "\nrecipes: the pot, the portion, the refusals, the floors, the micronutrient\n"
    + "         rule, your usuals, copy yesterday, the shopping list, what the dish\n"
    + "         cost and what is not stored, a shared pot cut four ways, the hob,\n"
    + "         a plate logged as a range and a hand.\n");
process.exit(bad ? 1 : 0);
