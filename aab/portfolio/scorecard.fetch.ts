#!/usr/bin/env node
/* ============================================================
   scorecard.fetch.ts, the file that makes scorecard.data.js.

       node aab/portfolio/scorecard.fetch.ts

   Downloads the Statlog German Credit data from the UCI Machine
   Learning Repository, checks it is the file it is supposed to
   be, and writes it out as a JavaScript module the browser can
   import.

   ------------------------------------------------------------
   WHY THIS SCRIPT EXISTS RATHER THAN A PASTED FILE

   The case study's whole claim is that it fits real models to a
   real, public dataset. That claim is worth nothing if the data
   in this repository cannot be traced back to the source, so
   this script is the trace: it names the URL, it records the
   checksum of exactly what it downloaded, and it recomputes
   column-level totals that scorecard.test.ts checks the shipped
   file against. If a conversion ever mangles a column, the sums
   move and the tests fail.

   It needs the network, so it is not part of any build. Run it
   if the source ever changes, and commit what it writes, the
   same arrangement as build-lessons.mjs and build-og.ts.

   ------------------------------------------------------------
   THE DATA

     Hofmann, H. (1994). Statlog (German Credit Data).
     UCI Machine Learning Repository.
     https://doi.org/10.24432/C5NC77

   1,000 loan applications, 20 attributes, and a label saying
   whether the loan turned out good or bad. 300 of them are bad,
   which is a default rate no real book has, and one of several
   reasons the page says out loud that this dataset is a teaching
   set rather than a production one.

   Licence: CC BY 4.0, which permits redistribution with
   attribution. The attribution is in SOURCE below, on the page
   itself, and here.
   ============================================================ */

import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "scorecard.data.js");
const URL_DATA = "https://archive.ics.uci.edu/ml/machine-learning-databases/statlog/german/german.data";

/* The checksum of the file as it stood when this was written. A
   mismatch is not automatically an error, the repository may have
   been re-published, but it is something a human should look at
   before committing a data file that changed underneath them. */
const KNOWN_MD5 = "6b94c2e35480e671545e52a808a8a549";

/* ------------------------------------------------------------
   The schema, transcribed from the dataset's own documentation
   (german.doc at the same URL). Codes are the source's; the
   labels are its wording, shortened where it does not fit a
   chart axis and left alone where it does.
   `type` is the discriminant: a `num` column has no levels and a
   `cat` column always has them, which is what lets the conversion
   below read a cell without asking twice.
   ------------------------------------------------------------ */

interface NumericColumn {
  key: string;
  name: string;
  short: string;
  type: "num";
  unit?: string;
  protected?: true;
}

interface CategoricalColumn {
  key: string;
  name: string;
  short: string;
  type: "cat";
  protected?: true;
  /** `[code, label]`, the source's own codes in the source's order.
      The index into this array is what a converted row carries. */
  levels: Array<[string, string]>;
}

type Column = NumericColumn | CategoricalColumn;

const SCHEMA: Column[] = [
  { key: "checking", name: "Checking account status", type: "cat", short: "Checking",
    levels: [
      ["A11", "below 0 DM"], ["A12", "0 to 200 DM"],
      ["A13", "200 DM or more"], ["A14", "no checking account"],
    ] },
  { key: "duration", name: "Duration of the loan", type: "num", short: "Duration", unit: "months" },
  { key: "history", name: "Credit history", type: "cat", short: "History",
    levels: [
      ["A30", "none taken, or all paid duly"], ["A31", "all paid duly at this bank"],
      ["A32", "existing credits paid duly"], ["A33", "delay in paying in the past"],
      ["A34", "critical account, or credits elsewhere"],
    ] },
  { key: "purpose", name: "Purpose", type: "cat", short: "Purpose",
    levels: [
      ["A40", "car (new)"], ["A41", "car (used)"], ["A42", "furniture or equipment"],
      ["A43", "radio or television"], ["A44", "domestic appliances"], ["A45", "repairs"],
      ["A46", "education"], ["A47", "vacation"], ["A48", "retraining"],
      ["A49", "business"], ["A410", "other"],
    ] },
  { key: "amount", name: "Credit amount", type: "num", short: "Amount", unit: "DM" },
  { key: "savings", name: "Savings account or bonds", type: "cat", short: "Savings",
    levels: [
      ["A61", "below 100 DM"], ["A62", "100 to 500 DM"], ["A63", "500 to 1,000 DM"],
      ["A64", "1,000 DM or more"], ["A65", "unknown, or none"],
    ] },
  { key: "employment", name: "Present employment since", type: "cat", short: "Employment",
    levels: [
      ["A71", "unemployed"], ["A72", "under 1 year"], ["A73", "1 to 4 years"],
      ["A74", "4 to 7 years"], ["A75", "7 years or more"],
    ] },
  { key: "instalment", name: "Instalment as % of disposable income", type: "num",
    short: "Instalment rate", unit: "%" },
  { key: "personal", name: "Personal status and sex", type: "cat", short: "Personal status",
    protected: true,
    levels: [
      ["A91", "male, divorced or separated"], ["A92", "female, divorced, separated or married"],
      ["A93", "male, single"], ["A94", "male, married or widowed"], ["A95", "female, single"],
    ] },
  { key: "guarantors", name: "Other debtors or guarantors", type: "cat", short: "Guarantors",
    levels: [["A101", "none"], ["A102", "co-applicant"], ["A103", "guarantor"]] },
  { key: "residence", name: "Present residence since", type: "num", short: "Residence", unit: "years" },
  { key: "property", name: "Property", type: "cat", short: "Property",
    levels: [
      ["A121", "real estate"], ["A122", "savings agreement or life insurance"],
      ["A123", "car or other"], ["A124", "unknown, or none"],
    ] },
  { key: "age", name: "Age", type: "num", short: "Age", unit: "years", protected: true },
  { key: "otherPlans", name: "Other instalment plans", type: "cat", short: "Other plans",
    levels: [["A141", "bank"], ["A142", "stores"], ["A143", "none"]] },
  { key: "housing", name: "Housing", type: "cat", short: "Housing",
    levels: [["A151", "rent"], ["A152", "own"], ["A153", "for free"]] },
  { key: "nCredits", name: "Existing credits at this bank", type: "num", short: "Credits held" },
  { key: "job", name: "Job", type: "cat", short: "Job",
    levels: [
      ["A171", "unemployed or unskilled, non-resident"], ["A172", "unskilled, resident"],
      ["A173", "skilled employee or official"], ["A174", "management or self-employed"],
    ] },
  { key: "dependents", name: "People liable to maintain", type: "num", short: "Dependents" },
  { key: "phone", name: "Telephone", type: "cat", short: "Telephone",
    levels: [["A191", "none"], ["A192", "registered in the customer's name"]] },
  { key: "foreign", name: "Foreign worker", type: "cat", short: "Foreign worker",
    protected: true,
    levels: [["A201", "yes"], ["A202", "no"]] },
];

/* ------------------------------------------------------------
   Fetch, verify, convert
   ------------------------------------------------------------ */
const res = await fetch(URL_DATA);
if (!res.ok) {
  console.error(`${URL_DATA}\n  responded ${res.status}. Nothing written.`);
  process.exit(1);
}
const text = await res.text();
const md5 = createHash("md5").update(text).digest("hex");
console.log(`downloaded ${text.length} bytes, md5 ${md5}`);
if (md5 !== KNOWN_MD5) {
  console.warn(`\n  the checksum is not the one this script was written against`);
  console.warn(`  expected ${KNOWN_MD5}`);
  console.warn(`  look at what changed before committing the result\n`);
}

const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
if (lines.length !== 1000) {
  console.error(`expected 1,000 rows, found ${lines.length}. Nothing written.`);
  process.exit(1);
}

/** Twenty attributes in SCHEMA order, then the label. */
const rows: number[][] = [];
const unseen = new Map<string, number>();
lines.forEach((line, i) => {
  const cells = line.split(/\s+/);
  if (cells.length !== 21) throw new Error(`line ${i + 1}: ${cells.length} columns, expected 21`);
  const out = SCHEMA.map((col, j) => {
    const raw = cells[j];
    if (col.type === "num") {
      const n = Number(raw);
      if (!Number.isFinite(n)) throw new Error(`line ${i + 1}: "${raw}" is not a number`);
      return n;
    }
    const idx = col.levels.findIndex(([code]) => code === raw);
    if (idx < 0) throw new Error(`line ${i + 1}: "${raw}" is not a level of ${col.key}`);
    return idx;
  });
  /* The target arrives as 1 for good and 2 for bad. It is stored
     as 1 for BAD, because the thing being modelled is the
     probability of default and a model whose positive class is
     "nothing happened" is a model everybody misreads. */
  const label = cells[20];
  if (label !== "1" && label !== "2") throw new Error(`line ${i + 1}: label "${label}"`);
  out.push(label === "2" ? 1 : 0);
  rows.push(out);
  SCHEMA.forEach((col, j) => {
    if (col.type !== "cat") return;
    const key = `${col.key}:${out[j]}`;
    unseen.set(key, (unseen.get(key) ?? 0) + 1);
  });
});

/* ------------------------------------------------------------
   The integrity block: what the test file checks the shipped
   rows against. Computed here, from the downloaded file, so it
   is an attestation by the conversion rather than a restatement
   of it.
   ------------------------------------------------------------ */
const numericSums: Record<string, number> = {};
const numericRanges: Record<string, [number, number]> = {};
SCHEMA.forEach((col, j) => {
  if (col.type !== "num") return;
  const v = rows.map((r) => r[j]);
  numericSums[col.key] = v.reduce((a, b) => a + b, 0);
  numericRanges[col.key] = [Math.min(...v), Math.max(...v)];
});
const levelCounts: Record<string, number[]> = {};
SCHEMA.forEach((col, j) => {
  if (col.type !== "cat") return;
  levelCounts[col.key] = col.levels.map((_, k) => rows.filter((r) => r[j] === k).length);
});
const bad = rows.filter((r) => r[r.length - 1] === 1).length;

/* Levels the documentation lists and the data never uses. The
   source itself is unsure about one of them, its note on the
   vacation code reads "(vacation - does not exist?)", and it is
   right: it does not. Kept in the schema so the codes line up
   with the published documentation, and flagged so the model
   does not spend a column on a category with no rows in it. */
const emptyLevels: string[] = [];
SCHEMA.forEach((col) => {
  if (col.type !== "cat") return;
  col.levels.forEach(([code], k) => {
    if (levelCounts[col.key][k] === 0) emptyLevels.push(`${col.key}:${code}`);
  });
});
console.log(`levels present in the documentation but not in the data: ${emptyLevels.join(", ") || "none"}`);

const j = (v: unknown): string => JSON.stringify(v);
const schemaOut = SCHEMA.map((c) => {
  const parts = [`key: ${j(c.key)}`, `name: ${j(c.name)}`, `short: ${j(c.short)}`, `type: ${j(c.type)}`];
  if (c.type === "num" && c.unit) parts.push(`unit: ${j(c.unit)}`);
  if (c.protected) parts.push("protected: true");
  if (c.type === "cat") {
    parts.push(`levels: [${c.levels.map(([code, label]) => `[${j(code)}, ${j(label)}]`).join(", ")}]`);
  }
  return `  { ${parts.join(", ")} },`;
}).join("\n");

const file = `/* ============================================================
   scorecard.data.js: the Statlog German Credit data.

   GENERATED by scorecard.fetch.ts. Do not edit by hand: run
   that script and commit what it writes.

     Hofmann, H. (1994). Statlog (German Credit Data).
     UCI Machine Learning Repository.
     https://doi.org/10.24432/C5NC77
     Licence: CC BY 4.0

   1,000 loan applications from a German bank, 20 attributes
   each, labelled good or bad. Downloaded from

     ${URL_DATA}

   with md5 ${md5}.

   Two things about the coding are worth knowing before reading
   anything off this file.

   The target is stored as 1 for BAD, not as the source's 1 for
   good and 2 for bad. What is being modelled is the probability
   of default, and a model whose positive class is "nothing
   happened" is a model everybody misreads at least once.

   Categorical values are stored as the INDEX of the level in the
   schema below, not as the source's A-codes, so the rows stay
   small. The codes are all still here, in order, so any row can
   be read back into the published documentation.
   ============================================================ */

/** Where the data comes from, carried to the page so it can say so. */
export const SOURCE = {
  name: "Statlog (German Credit Data)",
  author: "Hofmann, H.",
  year: 1994,
  publisher: "UCI Machine Learning Repository",
  doi: "https://doi.org/10.24432/C5NC77",
  url: ${j(URL_DATA)},
  licence: "CC BY 4.0",
  md5: ${j(md5)},
  fetched: ${j(new Date().toISOString().slice(0, 10))},
  /* The dataset ships its own cost matrix, and it is the reason
     this page has an economics section rather than only a
     statistics one: lending to a bad applicant is stated to be
     five times as costly as turning away a good one. */
  costMatrix: { falseGood: 5, falseBad: 1 },
};

/** One entry per column of ROWS, in order. The 21st is the label. */
export const SCHEMA = [
${schemaOut}
];

/** What the conversion saw, for scorecard.test.ts to check the rows against. */
export const CHECKS = {
  rows: ${rows.length},
  bad: ${bad},
  good: ${rows.length - bad},
  numericSums: ${j(numericSums)},
  numericRanges: ${j(numericRanges)},
  levelCounts: ${j(levelCounts)},
  emptyLevels: ${j(emptyLevels)},
};

/**
 * 1,000 rows. Twenty attributes in SCHEMA order, then the label:
 * 1 if the loan went bad, 0 if it did not.
 */
export const ROWS = [
${rows.map((r) => `  [${r.join(",")}],`).join("\n")}
];
`;

await writeFile(OUT, file);
console.log(`wrote scorecard.data.js: ${rows.length} rows, ${bad} bad (${((bad / rows.length) * 100).toFixed(1)}%), ${(file.length / 1024).toFixed(0)} KB`);
