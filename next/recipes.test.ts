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
const bundled = await build({
  stdin: {
    contents: `export * from "./lib/recipes.ts";
               export { byId, loggedFrom } from "@reiad/shared/foods";`,
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

const M = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`
) as Recipes & Foods;

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

ok("the oil states only saturated fat, so the pot carries no iron",
  pot.food?.iron === undefined, String(pot.food?.iron));
ok("and it says which survived, which is none of them",
  pot.micros.length === 0, pot.micros.join(", "));

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

/* ------------------------------------------------------------ */
console.log(bad
  ? `\n${bad} problem(s). A recipe is somebody's real dinner: a total that\n`
    + "is wrong in the flattering direction is the failure this file exists for.\n"
  : "\nrecipes: the pot, the portion, the refusals, the floors, the micronutrient\n"
    + "         rule, your usuals, copy yesterday and the shopping list.\n");
process.exit(bad ? 1 : 0);
