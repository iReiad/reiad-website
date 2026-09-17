#!/usr/bin/env node
/* ============================================================
   check-english.ts: is the grammar term still whole?

       node scripts/check-english.ts
       node scripts/check-english.ts --list

   The English school's copy of `check-money.ts`, over the prose
   in `scripts/english/`: every live part of a written term has
   prose, every mount has a block and every block a mount, every
   block is a kind that exists with the fields that kind needs, a
   mount is a top-level element, every class survives the server's
   sanitiser, and a part is longer than a stub. Asked once, in
   `problemsIn()` in `seed-english.ts`, because a seed that writes
   a broken part has already written it.

   And two things the practice book adds: the grammar book's
   thirty days each carry six gap items shaped as `blockProblems`
   would accept them, and the map at the end of part 25 covers
   every day of the book exactly once. A day with a hole nothing
   fills, or a map that skips a day, renders perfectly.
   ============================================================ */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TERMS, termParts } from "../shared/curricula/english.ts";
import { blockProblems } from "../shared/lesson.ts";
import { problemsIn, readWritten } from "./seed-english.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LIST = process.argv.includes("--list");

let failures = 0;
const fail = (line: string, ...detail: string[]): void => {
  failures += 1;
  console.error(`  x ${line}`);
  detail.forEach((d) => console.error(`        ${d}`));
};

const written = await readWritten();
for (const line of await problemsIn(written)) fail(line);

/* ---------- the book's gaps ----------

   The book is imported by its real filename, as `check-next.ts`
   imports the others, and every day's `gaps` is validated as a
   `gap` block would be: one hole, a right index that exists,
   a `why` in both languages. */
const book = (await import(join(ROOT, "next", "lib", "workbooks", "english-term-3.ts")))
  .default as { days: { n: number; gaps?: unknown[]; watch: unknown[]; say: unknown[] }[] };

for (const day of book.days) {
  if (!day.gaps?.length) {
    fail(`term-3 workbook day ${day.n} has no gaps`,
      "The grammar book drills a rule six times a day; a day with none is a day",
      "of Term One's book wearing Term Three's cover.");
    continue;
  }
  for (const line of blockProblems(`term-3 workbook day ${day.n}`,
    { kind: "gap", items: day.gaps })) fail(line);
}

/* ---------- the map in part 25 ----------

   Written as prose, read here as numbers: every day from 1 to
   the book's last appears in exactly one range. */
const map = written["term-3"]?.mistakes?.bn ?? "";
const BN = "০১২৩৪৫৬৭৮৯";
const toNum = (s: string): number => Number([...s].map((c) => BN.indexOf(c) >= 0 ? BN.indexOf(c) : c).join(""));
const seen = new Map<number, number>();
for (const m of map.matchAll(/<td>([০-৯]+)(?: থেকে ([০-৯]+))?<\/td><td>[০-৯, ]+<\/td>/g)) {
  const from = toNum(m[1]);
  const to = m[2] ? toNum(m[2]) : from;
  for (let d = from; d <= to; d += 1) seen.set(d, (seen.get(d) ?? 0) + 1);
}
if (!seen.size) {
  fail("part 25 no longer carries the day map this check reads",
    "The table rows read <td>১ থেকে ২</td><td>১, ২</td>. If the shape changed,",
    "change the pattern above with it.");
} else {
  for (let d = 1; d <= book.days.length; d += 1) {
    const n = seen.get(d) ?? 0;
    if (n !== 1) fail(`part 25 maps day ${d} of the book ${n} time(s)`);
  }
  for (const d of seen.keys()) {
    if (d > book.days.length) fail(`part 25 maps day ${d}, and the book has ${book.days.length}`);
  }
}

/* ---------- the listing ---------- */

if (LIST) {
  for (const term of TERMS) {
    const mine = written[term.slug];
    if (!mine) continue;
    console.log(`\n${term.kicker} · ${term.bn}  (${term.slug})`);
    for (const part of termParts(term)) {
      const content = mine[part.slug];
      const size = content ? `${String(Math.round(content.bn.length / 100) / 10)}k` : "NOT WRITTEN";
      const blocks = content ? `${Object.keys(content.blocks).length} block(s)` : "";
      console.log(`  ${part.slug.padEnd(16)} ${size.padEnd(12)} ${blocks}`);
    }
  }
}

if (failures) {
  console.error(`\nenglish: ${failures} problem(s).`);
  process.exit(1);
}

const parts = Object.values(written).flatMap((t) => Object.values(t));
const blocks = parts.reduce((n, p) => n + Object.keys(p.blocks).length, 0);
console.log(`english: ${parts.length} part(s) written with ${blocks} block(s), `
  + `and a ${book.days.length}-day book with ${book.days.length * 6} gaps.`);
