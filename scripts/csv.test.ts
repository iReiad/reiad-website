#!/usr/bin/env node
/* ============================================================
   csv.test.ts: the importer, from the wrong side.

       node scripts/csv.test.ts

   `DIET.md` section 26: an importer that guesses silently is an
   importer that fills a year of somebody's history with the
   wrong column, and the reader finds out in March. So most of
   what is asserted here is that it REFUSES: an ambiguous date, a
   row whose width does not match its header, a loose match that
   should have lost to an exact one.
   ============================================================ */

import { parseCSV, guessColumns, readDate, preview, type Field } from "../shared/csv.ts";

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};

/* ---- the parser ---- */

const basic = parseCSV("Date,Weight\n2026-01-01,80.5\n2026-01-02,80.3\n");
ok("a header and two rows", basic.header.length === 2 && basic.rows.length === 2);
ok("and the trailing newline is not a third row", basic.rows.length === 2);

const quoted = parseCSV('Date,Note\n2026-01-01,"ate out, twice"\n');
ok("a comma inside quotes is not a separator", quoted.rows[0][1] === "ate out, twice");

const doubled = parseCSV('Date,Note\n2026-01-01,"she said ""fine"""\n');
ok("a doubled quote is one quote", doubled.rows[0][1] === 'she said "fine"');

const multi = parseCSV('Date,Note\n2026-01-01,"line one\nline two"\n');
ok("a newline inside quotes is not a row", multi.rows.length === 1);

const bom = parseCSV("﻿Date,Weight\n2026-01-01,80\n");
ok("a Windows BOM does not become part of the first column name",
  bom.header[0] === "Date", JSON.stringify(bom.header[0]));

const ragged = parseCSV("Date,Weight,Kcal\n2026-01-01,80\n2026-01-02,80,2000\n");
ok("a row narrower than its header is skipped rather than shifted",
  ragged.rows.length === 1 && ragged.skipped.length === 1);
ok("and the skip says which line", ragged.skipped[0].line === 2);

const unclosed = parseCSV('Date,Note\n2026-01-01,"never closed\n');
ok("an unclosed quote is reported", unclosed.skipped.some((s) => /quote/.test(s.why)));

/* ---- the guesses ---- */

const g = guessColumns(["Date", "Weight (kg)", "Calories", "Protein (g)", "Something"]);
ok("a date column is found exactly", g[0].field === "date" && g[0].how === "exact");
ok("weight in kilograms is found", g[1].field === "weightKg");
ok("calories are found", g[2].field === "kcal");
ok("protein is found", g[3].field === "proteinG");
ok("and a column nothing knows is ignored rather than guessed",
  g[4].field === "ignore" && g[4].how === "none");

/* The whole reason the two passes are separate. */
const goal = guessColumns(["Date", "Weight goal", "Weight"]);
ok("an exact weight beats a loose weight goal",
  goal[2].field === "weightKg" && goal[2].how === "exact", JSON.stringify(goal));
ok("and the goal column does not also claim to be the weight",
  goal[1].field !== "weightKg" || goal[1].how !== "exact", JSON.stringify(goal));

/* ---- dates ---- */

ok("ISO is read", "iso" in readDate("2026-03-04") );
ok("and padded", (readDate("2026-3-4") as { iso: string }).iso === "2026-03-04");
ok("a day over twelve settles the order",
  (readDate("13/04/2026") as { iso: string }).iso === "2026-04-13");
ok("in either position",
  (readDate("04/13/2026") as { iso: string }).iso === "2026-04-13");
/* The one that matters. */
ok("and 03/04/2026 is REFUSED, because nothing in the file says which it is",
  "why" in readDate("03/04/2026"));
ok("something that is not a date is refused rather than guessed",
  "why" in readDate("last Tuesday"));

/* ---- the preview commits nothing and says what it dropped ---- */

const sheet = parseCSV([
  "Date,Weight (kg),Calories,Notes",
  "2026-01-01,80.5,2100,fine",
  "2026-01-02,,,",
  "not a date,79,2000,",
  "2026-01-03,80.1,1900,",
].join("\n"));
const map = guessColumns(sheet.header).map((x) => x.field);
const p = preview(sheet, map);

ok("three rows in, two out", p.rows.length === 2, JSON.stringify(p.rows));
ok("a date with no values is skipped and says so",
  p.skipped.some((s) => /no values/.test(s.why)));
ok("an unreadable date is skipped and says so",
  p.skipped.some((s) => /not a date/.test(s.why)));
ok("the span is reported, so a file that reads as 1970 is visible",
  p.from === "2026-01-01" && p.to === "2026-01-03");
ok("and the values came through", p.rows[0].weightKg === 80.5 && p.rows[0].kcal === 2100);

const noDate = preview(parseCSV("A,B\n1,2\n"), ["ignore", "ignore"] as Field[]);
ok("no date column is a refusal rather than an empty import",
  noDate.rows.length === 0 && /no column/.test(noDate.skipped[0].why));

/* Pounds, because a lb column written into a kg field is the
   same class of error as a misread date and is likelier. */
const lbs = parseCSV("Date,Weight (lbs)\n2026-01-01,180\n");
const lp = preview(lbs, guessColumns(lbs.header).map((x) => x.field));
ok("a column labelled lbs is converted rather than believed",
  lp.rows[0].weightKg !== undefined && Math.abs(lp.rows[0].weightKg - 81.6) < 0.1,
  String(lp.rows[0].weightKg));

/* ------------------------------------------------------------ */

if (failures.length) {
  console.error(`\ncsv: ${failures.length} of ${passed + failures.length} failed\n`);
  failures.forEach((line) => console.error(`  x ${line}`));
  process.exit(1);
}
console.log(`csv: ${passed} checks passed`);
