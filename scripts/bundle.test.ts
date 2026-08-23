#!/usr/bin/env node
/* ============================================================
   bundle.test.ts: reading back a copy this site wrote.

       node scripts/bundle.test.ts

   `DIET.md` section 26 makes one claim about leaving: "the
   importer reads the exporter's format, so this tool can be left
   and returned to, which is the only real test of whether an
   export is honest." This is that test, run against the shape
   `aab/src/account-page.ts` actually writes.

   ---- what it is really guarding ----

   THE IDS. A copy carries the `user_id` it was taken under and a
   row id per entry. Carried through, the first is refused by row
   level security and the page reports a successful import of
   nothing, and the second either collides with a live row or
   resurrects a deleted one. Both are asserted as ABSENT, which
   is the only way to assert a field that must not be there.

   WHAT IS NOT BROUGHT BACK, said out loud. Four of the six
   tables are named rather than written, and a reader has to be
   told which: a copy that silently restores five sixths of an
   account is worse than one that restores two and says so.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readBundle, type BundleRead } from "../shared/bundle.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(`${what}${detail ? `   ${detail}` : ""}`);
};

/** A copy in exactly the shape the exporter writes. */
const copy = (diet: Record<string, unknown[]>): string => JSON.stringify({
  what: "Everything Reiad's Library holds for this account.",
  taken: "2026-08-23T04:00:00.000Z",
  account: { name: "A Reader", email: "reader@example.com" },
  profile: {}, progress: {}, library: [], targets: [], scenarios: [],
  diet,
});

const held = (r: BundleRead | { why: string }): BundleRead => {
  if ("why" in r) throw new Error(`expected a read, got a refusal: ${r.why}`);
  return r;
};

/* ------------------------------------------------------------
   the refusals, which are most of this file
   ------------------------------------------------------------ */

ok("a file that is not JSON is refused rather than half read",
  "why" in readBundle("date,weight\n2026-01-01,80"));
ok("and the refusal says what a copy actually is",
  (readBundle("nonsense") as { why: string }).why.includes(".json"));
ok("a JSON array is not a copy", "why" in readBundle("[1,2,3]"));
ok("neither is null", "why" in readBundle("null"));
ok("JSON with no diet section is refused, naming what was missing",
  (readBundle(JSON.stringify({ what: "x", library: [] })) as { why: string }).why.includes("diet"));
ok("a diet section that is an array rather than an object is refused",
  "why" in readBundle(JSON.stringify({ diet: [] })));
ok("a copy whose diet holds nothing is refused rather than reported as an import of zero",
  "why" in readBundle(copy({})));
ok("and a copy holding ONLY tables this cannot bring back says so",
  (readBundle(copy({ diet_profile: [{ height_cm: 170 }] })) as { why: string })
    .why.includes("cannot bring back"));

/* ------------------------------------------------------------
   the ids, which are the reason this file exists
   ------------------------------------------------------------ */

const one = held(readBundle(copy({
  diet_days: [{
    entry_date: "2026-08-01", user_id: "somebody-else", weight_kg: 80.4,
    kcal: 2000, protein_g: 120, steps: 8000, sleep_hours: 7,
    marks: ["ill"], tags: ["hungry"], note: "a bad night",
  }],
  diet_entries: [{
    id: "11111111-1111-1111-1111-111111111111", user_id: "somebody-else",
    entry_date: "2026-08-01", label: "Rice", label_bn: "ভাত",
    qty: 150, unit: "g", kcal: 195, macros: { protein: 4, carbs: 44 },
    est_low: 170, est_high: 220, at_time: "13:05:00", source: "library",
  }],
})));

ok("the day comes back", one.days.length === 1 && one.days[0].date === "2026-08-01");
ok("with every column the schema holds",
  one.days[0].weightKg === 80.4 && one.days[0].kcal === 2000
  && one.days[0].steps === 8000 && one.days[0].sleepHours === 7
  && one.days[0].note === "a bad night");
ok("and its marks and tags, which are lists rather than numbers",
  one.days[0].marks?.[0] === "ill" && one.days[0].tags?.[0] === "hungry");

/* THE TWO ABSENCES. Written as `in` rather than as a comparison
   to undefined, because a key present and undefined would be
   sent as null by JSON.stringify and is a different bug. */
ok("THE FILE'S user_id IS NOT CARRIED, on a day",
  !("user_id" in one.days[0]) && !("userId" in one.days[0]));
ok("nor on an entry",
  !("user_id" in one.entries[0]) && !("userId" in one.entries[0]));
ok("AND NEITHER IS THE ROW ID, so the database mints a fresh one",
  one.entries[0].id === undefined);

ok("the entry comes back with its label in both languages",
  one.entries[0].label === "Rice" && one.entries[0].labelBn === "ভাত");
ok("its macros survive as numbers",
  one.entries[0].macros?.protein === 4 && one.entries[0].macros?.carbs === 44);
ok("its band survives, because a plate logged as a range must stay one",
  one.entries[0].estLow === 170 && one.entries[0].estHigh === 220);
ok("and a postgres time comes back as the HH:MM the column is read as",
  one.entries[0].atTime === "13:05");

/* ------------------------------------------------------------
   what is not brought back, and the reason each time
   ------------------------------------------------------------ */

const four = held(readBundle(copy({
  diet_days: [{ entry_date: "2026-08-01", weight_kg: 80 }],
  diet_profile: [{ height_cm: 170, meds: ["metformin"] }],
  diet_foods: [{ id: "a" }, { id: "b" }, { id: "c" }],
  diet_phases: [{ style: "keto" }],
  diet_labs: [{ marker: "hba1c" }],
})));

ok("all four are named, none is dropped silently", four.left.length === 4);
ok("each says how many rows it is leaving",
  four.left.find((l) => l.table === "diet_foods")?.rows === 3);
ok("the profile's reason is that overwriting it is invisible",
  four.left.find((l) => l.table === "diet_profile")?.why.includes("nothing on the page would look wrong"));
ok("and the other three give the reason the schema gives: no origin, so no undo",
  ["diet_foods", "diet_phases", "diet_labs"].every((t) =>
    four.left.find((l) => l.table === t)?.why.includes("no origin")));
ok("a table the copy does not hold is not named as left behind",
  held(readBundle(copy({ diet_days: [{ entry_date: "2026-08-01" }] }))).left.length === 0);
ok("and neither is one it holds empty",
  held(readBundle(copy({
    diet_days: [{ entry_date: "2026-08-01" }], diet_foods: [],
  }))).left.length === 0);

/* THE SCHEMA IS WHAT DECIDES THIS, so it is read rather than
   remembered. Exactly two diet tables carry an `origin` column,
   and those two are the two this brings back. The day a third
   gains one, this fails and somebody comes and widens the list
   deliberately. */
const SQL = readFileSync(join(ROOT, "supabase", "migrations", "20260822120000_diet.sql"), "utf8");
const withOrigin = [...SQL.matchAll(/create table if not exists public\.(diet_\w+)\s*\(([\s\S]*?)\n\);/g)]
  .filter(([, , body]) => /^\s*origin\s+text/m.test(body))
  .map(([, table]) => table);
ok("exactly the tables carrying an origin column are the ones brought back",
  withOrigin.length === 2
  && withOrigin.includes("diet_days") && withOrigin.includes("diet_entries"),
  `found: ${withOrigin.join(", ")}`);

/* ------------------------------------------------------------
   rows that cannot be read
   ------------------------------------------------------------ */

const rough = held(readBundle(copy({
  diet_days: [
    { entry_date: "2026-08-01", weight_kg: 80 },
    { weight_kg: 81 },
    { entry_date: "01/08/2026", weight_kg: 82 },
  ],
  diet_entries: [
    { entry_date: "2026-08-01", label: "Rice" },
    { entry_date: "2026-08-01" },
  ],
})));
ok("a day with no date is skipped, not written as today", rough.days.length === 1);
ok("a date that is not ISO is skipped, because this file is machine written",
  rough.skipped.some((s) => s.why.includes("entry_date")));
ok("an entry with no label is skipped, because the column is not null",
  rough.entries.length === 1
  && rough.skipped.some((s) => s.why.includes("no label")));
ok("and every skip is counted", rough.skipped.length === 3);

/* ------------------------------------------------------------
   the span, and who the copy belonged to
   ------------------------------------------------------------ */

const span = held(readBundle(copy({
  diet_days: [
    { entry_date: "2026-03-14" },
    { entry_date: "2026-01-02" },
    { entry_date: "2026-08-01" },
  ],
})));
ok("the span is the earliest and the latest, whatever order the file held them in",
  span.from === "2026-01-02" && span.to === "2026-08-01");
ok("an entry outside the days' range widens the span",
  held(readBundle(copy({
    diet_days: [{ entry_date: "2026-03-14" }],
    diet_entries: [{ entry_date: "2026-01-02", label: "Rice" }],
  }))).from === "2026-01-02");
ok("whose copy it is comes back, so the page can say before it writes",
  one.account?.email === "reader@example.com" && one.taken?.startsWith("2026-08-23"));

/* ------------------------------------------------------------
   the round trip, which is the whole claim
   ------------------------------------------------------------ */

/* THE EXPORTER'S OWN TABLE LIST, read out of the file that
   writes it. A copy that gained a seventh table and a reader
   that never heard of it is the drift this asserts against. */
const EXPORTER = readFileSync(join(ROOT, "aab", "src", "account-page.ts"), "utf8");
const listed = [...(EXPORTER.match(/const DIET_TABLES = \[([\s\S]*?)\]/)?.[1] ?? "")
  .matchAll(/"(diet_\w+)"/g)].map((m) => m[1]);
ok("the exporter writes six diet tables", listed.length === 6, listed.join(", "));

const readable = held(readBundle(copy(Object.fromEntries(
  listed.map((t) => [t, [t === "diet_days" || t === "diet_entries"
    ? { entry_date: "2026-08-01", label: "Rice" }
    : { id: "x" }]]),
))));
ok("every table the exporter writes is either brought back or named",
  readable.left.length + 2 === listed.length,
  `${readable.left.length} named, 2 brought back, ${listed.length} written`);

/* ------------------------------------------------------------ */

if (failures.length) {
  console.error(`\nbundle: ${failures.length} of ${passed + failures.length} failed\n`);
  failures.forEach((line) => console.error(`  x ${line}`));
  process.exit(1);
}
console.log(`bundle: ${passed} checks passed`);
