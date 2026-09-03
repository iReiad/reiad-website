#!/usr/bin/env node
/* ============================================================
   check-next.ts: the things `next/` has a second copy of.

       node scripts/check-next.ts

   The Next.js app is a package with its own root, and two things
   it renders live outside that root. Both are copied in,
   and a copy nobody checks is the failure this repository has
   written up more times than any other.

   1. THE SCHOOLS' DRAWINGS, all 103 of them, in
      `next/lib/school-icons.ts`. Same wall, four times the size,
      so it is generated rather than kept by hand:
      `scripts/build-school-icons.ts` writes it and this
      regenerates it and compares. Promoting four icon sets to
      `shared/` to draw a heading would be the larger mistake
      while forty files in `aab/` still import them; when the
      school pages stop being files, they move properly and both
      this and the generator go.

   2. THE PRACTICE BOOKS' LENGTH. `next/lib/workbooks/*.ts` holds
      the days a book is made of and the school's ladder DECLARES
      how many there are, in `workbook.days`, because the hub draws
      a progress bar from that number and must not pull five
      thousand lines of days down to count them.

      Nothing held the two together, and two comments said
      something did: `next/lib/workbook.ts` and
      `next/components/workbook.tsx` both named a
      `check-workbook.mjs` that has never existed under any
      extension. A declaration that drifts from its days is a
      learner told they are on day 30 of 60 in a book that has 90,
      which nothing else would report.

   There was a third copy here for the length of one commit, and
   it is worth saying why it went. Stage 11.7 lifted the four
   schools' hand-written hubs and the money school's full index
   into `next/lib/school-hubs.ts`, and while the pages they came
   from were still committed, a `build-school-hubs` generator
   regenerated them and this compared. Those pages are in
   `archive/schools-pages/` now: the copy is the original, there
   is nothing left to compare it to, and the generator is in
   `archive/schools-builders/` beside the two builders it
   outlived by one commit.

   There was a second copy here until Stage 11.2: the "coming
   soon" teasers on the Insights hub lived in both `content.js`
   and `next/lib/hub.ts` while both pages existed. The
   hand-written page is in `archive/` and the arrays in
   `content.js` are empty, so `next/lib/hub.ts` is the only place
   those three sentences are written and there is nothing left to
   compare. The drawings stay: they are about two runtimes rather
   than about a transition, and they do not go away.
   ============================================================ */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SCHOOL_ICONS } from "../next/lib/school-icons.ts";
import { NAV, LADDER_SCHOOLS } from "../shared/nav.ts";
import { SCHOOL_LADDERS } from "../next/lib/school-ladders.ts";
import { STAGES, allLessons } from "../shared/curricula/money.ts";
import { STUFEN } from "../shared/curricula/deutsch.ts";
import { TERMS } from "../shared/curricula/english.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

let failures = 0;
/** How many shared files the copy in next/node_modules matches, or
    0 where there is no copy to compare (every CI runner). */
let copiedShared = 0;
const fail = (line: string, ...detail: string[]): void => {
  failures += 1;
  console.error(`FAIL  ${line}`);
  detail.forEach((d) => console.error(`      ${d}`));
};

/* ------------------------------------------------------------
   1. The schools' 103 drawings, generated

   A section above this one held `next/components/cards.tsx` to
   the three drawings `aab/money/icons.js` writes, because a
   Bangla reading card carried a 30px icon copied across the wall
   by hand. That card is a `<GoCard>` now and wears a scene rather
   than an icon, so there is no copy left to check: the three
   strings went with the markup that used them.
   ------------------------------------------------------------ */

const { generate } = await import("./build-school-icons.ts");
const wanted = await generate();
const drawings = (wanted.match(/^\s{4}"/gm) ?? []).length;

if (read("next/lib/school-icons.ts") !== wanted) {
  fail("next/lib/school-icons.ts is not what aab/*/icons.js draws.",
    "Regenerate it and commit the result:",
    "  node scripts/build-school-icons.ts");
}

/* ------------------------------------------------------------
   2b. The four ladders, the two depths of them

   Same arrangement as the drawings above: generated out of
   `content/schools.backup.json`, committed, and compared here.

   The stages are the header's tree, so a school that gains one
   and is not regenerated shows a header one stage short of the
   hub it links to. The lessons are `/account`, so a school
   that gains one and is not regenerated draws a bar against a
   denominator nobody can reach: 60 of 59 finished.
   ------------------------------------------------------------ */

const { generate: stages, generateLadders } = await import("./build-school-tree.ts");

for (const [name, wanted] of [
  ["next/lib/school-stages.ts", stages()],
  ["next/lib/school-ladders.ts", await generateLadders()],
]) {
  if (read(name) !== wanted) {
    fail(`${name} is not what content/schools.backup.json holds.`,
      "Regenerate it and commit the result:",
      "  node scripts/build-school-tree.ts");
  }
}

/* And that the two agree about which schools have one.

   `ladder: true` in NAV is what `/account` reads to know
   there is a bar to draw, and the generated file is where the
   denominator comes from. A school that gains a ladder and not
   the flag never appears on that page; a flag with no ladder
   behind it draws 0 of 0. Neither looks broken. */

const flagged = LADDER_SCHOOLS.map((s) => s.key).sort();
const generated = Object.keys(SCHOOL_LADDERS).sort();

if (flagged.join() !== generated.join()) {
  fail("the schools flagged `ladder: true` in shared/nav.ts are not the"
    + " schools next/lib/school-ladders.ts holds a ladder for.",
    `nav.ts:            ${flagged.join(", ") || "(none)"}`,
    `school-ladders.ts: ${generated.join(", ") || "(none)"}`);
}

/* And that each one has lessons in it, because an empty array is
   what a snapshot refreshed against the wrong database looks
   like, and it draws a bar reading 0 of 0 rather than failing. */
for (const [school, lessons] of Object.entries(SCHOOL_LADDERS)) {
  if (!lessons.length) {
    fail(`next/lib/school-ladders.ts holds no lessons for ${school}.`,
      "Its bar on /account reads 0 of 0 and its resume card says"
      + " nothing is written.",
      "Refresh the snapshot and regenerate:",
      "  npx wrangler d1 export reiad --remote --output schools.db",
      "  node scripts/export-schools.ts --db schools.db",
      "  node scripts/build-school-tree.ts");
  }
}

/* ------------------------------------------------------------
   2c. The stylesheet the two file pages link

   `404.html` and `offline.html` cannot link the stylesheet Next
   emits, because its name carries a content hash. They link
   `aab/fallback.css`, which is the same file with its comments
   removed, written by `scripts/build-fallback.ts`. A stylesheet
   edited and not regenerated is those two pages drifting from the
   other 250, and they are the two nobody looks at.
   ------------------------------------------------------------ */

const { generate: fallback } = await import("./build-fallback.ts");

if (read("aab/fallback.css") !== fallback()) {
  fail("aab/fallback.css is not next/styles/site.css with its comments out.",
    "Regenerate it and commit the result:",
    "  node scripts/build-fallback.ts");
}

/* ------------------------------------------------------------
   2. And that the cards can actually find those drawings

   The check above proves `next/` holds the same drawings `aab/`
   does. It does not prove anything looks them up correctly,
   and for one commit nothing did.

   `SCHOOL_ICONS` is keyed by school id. The money school's id was
   `learn` until it moved to `/money/`, and `icons.tsx` went on
   saying `SCHOOL_ICONS.learn?.[name]` afterwards. Optional
   chaining answered `undefined` rather than throwing, the lookup
   fell through to the shell set, missed there too, and returned
   the empty string. `Icon` rendered a perfectly correct `<svg>`
   with nothing inside it: right box, right stroke, no drawing.

   Sixteen empty icons on the money hub, more on every lesson
   card and every contents row, and not one thing anywhere said
   so. Both checks above passed the whole time, because the
   drawings were all present and correct; it was the key that had
   gone.

   So this asks the question those two cannot: does the set
   `icons.tsx` reads actually exist, and does every name a card
   asks for come back with something in it.
   ------------------------------------------------------------ */

const iconsTsx = read("next/components/icons.tsx");

/** The school set `icons.tsx` draws its card icons from. */
const keyed = iconsTsx.match(/SCHOOL_ICONS\.(\w+)\s*\?\?/)
  ?? iconsTsx.match(/SCHOOL_ICONS\.(\w+)\?\.\[name\]/);

if (!keyed) {
  fail("cannot tell which set next/components/icons.tsx draws cards from.",
    "It should read SCHOOL_ICONS.<school> once, into CARD_ICONS.");
} else if (!wanted.includes(`  ${keyed[1]}: {`)) {
  fail(`next/components/icons.tsx reads SCHOOL_ICONS.${keyed[1]},`
    + " and no school is called that.",
    `The sets are: ${(wanted.match(/^  (\w+): \{/gm) ?? [])
      .map((m) => m.trim().replace(": {", "")).join(", ")}.`,
    "Every icon on every card is an empty <svg> until this matches.");
}

/* And the names themselves. The shell's own drawings are read out
   of the same file rather than listed here, so adding one does
   not mean editing this. */
const shellNames = new Set(
  [...iconsTsx.matchAll(/^  ([a-z]+):/gm)].map((m) => m[1]));

const cardIcons = keyed ? (SCHOOL_ICONS[keyed[1]] ?? {}) : {};

/* The icon names the money school's cards ask for. */
const asked = new Set<string>();
for (const stage of STAGES) if (stage.icon) asked.add(stage.icon);
for (const lesson of allLessons()) if (lesson.icon) asked.add(lesson.icon);
/* `group.items`, and it read `group.links` until 19 August 2026.

   A `NavGroup` has never had a `links` and has never had an
   `icon` of its own: it has a label, an accent and `items`. So
   `group.links ?? []` was an empty array on every group, the loop
   added nothing, and not one of the rail's seventeen icons was
   ever checked. The check went on reporting a number, which is
   what made it invisible: it was counting the money school's and
   saying "all N names a card asks for come back with a drawing".

   Nothing here found it. TypeScript did, on the day this file
   stopped being `.mjs`. */
for (const group of NAV) {
  for (const item of group.items) if (item.icon) asked.add(item.icon);
}

const empty = [...asked].filter(
  (name) => !cardIcons[name] && !shellNames.has(name));

if (empty.length) {
  fail(`${empty.length} icon name(s) a card asks for draw nothing.`,
    empty.join(", "),
    "Each renders as an <svg> with no path inside it, which looks"
    + " like a missing icon and reports as nothing at all.");
}

/* ------------------------------------------------------------
   3. A practice book is as long as its curriculum says
   ------------------------------------------------------------ */

/** A rung of a ladder that may carry a book. Both schools spell
    the rung differently and the book identically, which is why
    this takes the two arrays and not the two schools. */
interface Rung {
  slug: string;
  workbook?: { slug: string; days: number };
}

/** The file under `next/lib/workbooks/` a rung's book lives in.
    `next/lib/workbook.ts` maps the same four by hand; this reads
    them off disk because the point is to compare the two. */
const BOOK_FILE: Record<string, string> = {
  "stufe-1": "deutsch-stufe-1",
  "stufe-2": "deutsch-stufe-2",
  "stufe-3": "deutsch-stufe-3",
  "term-1": "english-term-1",
};

let books = 0;
for (const rung of [...STUFEN, ...TERMS] as Rung[]) {
  if (!rung.workbook) continue;               // Stufe 4 has none, on purpose
  const file = BOOK_FILE[rung.slug];
  if (!file) {
    fail(`${rung.slug} declares a workbook and next/lib/workbooks/ has no file for it.`,
      `Add it to BOOK_FILE in this check, or the hub draws a bar over nothing.`);
    continue;
  }
  const loaded = await import(join(ROOT, "next", "lib", "workbooks", `${file}.ts`)) as
    { default?: { days?: unknown[] } | unknown[] };
  const book = loaded.default;
  const days = Array.isArray(book) ? book : book?.days;
  if (!Array.isArray(days)) {
    fail(`next/lib/workbooks/${file}.ts does not export a list of days.`,
      "The default export is what next/lib/workbook.ts reads.");
    continue;
  }
  books += 1;
  if (days.length !== rung.workbook.days) {
    fail(`${rung.slug}: the book is ${days.length} days and the ladder says `
      + `${rung.workbook.days}.`,
      `next/lib/workbooks/${file}.ts is the days themselves; workbook.days is what`,
      "the hub draws its progress bar from. A reader would be told they are on day",
      `${rung.workbook.days} of a book that has ${days.length}.`);
  }
}

/* ============================================================
   The pre-paint boot, said three times

   `shell.tsx` writes it into every route. `404.html` and
   `offline.html` carry their own copy, and they have to: they are
   files, they answer when the Worker and the routes cannot, and
   there is nothing to render one for them.

   So the vocabulary is written out three times, and it drifted.
   The two file pages tested `a === "money"` where the stored
   value is `learn` or `work`, which is `AUDIENCES` in
   `shared/nav.ts`, what `shell.tsx` writes, and what
   `html[data-audience="learn"]` in the stylesheet answers to. The
   money school moved from `/learn/` to `/money/` on 17 August
   2026 and this comparison moved with it, which is the one thing
   that move was not supposed to touch.

   A reader who chose Learning therefore got no `data-audience` on
   those two pages, so the rail's groups came out in the other
   order, on exactly the two pages that answer when everything
   else is down. Nothing could see it: both pages render
   perfectly.

   This compares the ATTRIBUTE VALUES each copy tests for, not the
   text, because the two are written differently on purpose:
   `shell.tsx` minifies its copy into one line and the files
   space theirs out to be read. */
{
  const values = (src: string, attr: string): string[] => {
    /* Every `a === "x"` (or `t === "x"`) in the same statement as
       a `setAttribute` for this attribute. */
    const line = src.split("\n").find((l) => l.includes(`"${attr}"`) && l.includes("==="))
      ?? src.split(/;\s*/).find((l) => l.includes(`"${attr}"`) && l.includes("===")) ?? "";
    return [...line.matchAll(/===\s*"([a-z-]+)"/g)].map((m) => m[1]).sort();
  };

  const shell = read("next/components/shell.tsx");
  for (const attr of ["data-audience", "data-theme"]) {
    const want = values(shell, attr);
    if (!want.length) {
      fail(`check-next.ts cannot find the ${attr} test in shell.tsx any more.`,
        "This check compares the two file pages against it, so it is now",
        "comparing them against nothing. Point it at the boot script again.");
      continue;
    }
    for (const page of ["aab/404.html", "aab/offline.html"]) {
      const got = values(read(page), attr);
      if (got.join() === want.join()) continue;
      fail(`${page} tests ${attr} for ${got.join(", ") || "nothing"} and `
        + `shell.tsx tests ${want.join(", ")}.`,
        "The boot script is written three times because these two pages are",
        "files and cannot render one. A value only one of them knows is a",
        "reader whose choice is dropped on the two pages that answer when",
        "the Worker and the routes cannot.");
    }
  }
}

/* ------------------------------------------------------------
   3. `@reiad/shared`, copied into next/node_modules by npm

   `next/.npmrc` sets `install-links=true`, so a `file:`
   dependency is COPIED rather than symlinked, and npm keys that
   copy by VERSION: editing a file in `shared/` leaves the copy
   in place however much the contents changed, and `next build`
   compiles the old code without a word. CLAUDE.md writes this up
   under "What more than one runtime has to agree on" because it
   shipped Devanagari digits on a page whose source had been
   fixed.

   It costs an hour every time, because what it looks like is a
   function that is plainly exported reported as missing, or a
   fix that does not take. So it is a check now, and the fix is
   the one line in that section:

       rm -rf next/node_modules/@reiad/shared && (cd next && npm install)

   It SKIPS where the copy is absent, which is every CI runner
   and any clone that has not installed next/'s dependencies:
   there is no stale copy where there is no copy.
   ------------------------------------------------------------ */
{
  const copied = join(ROOT, "next", "node_modules", "@reiad", "shared");
  if (existsSync(copied)) {
    const source = join(ROOT, "shared");
    const walk = (dir: string, base: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.name === "node_modules" || e.name.startsWith(".")
          ? []
          : e.isDirectory()
            ? walk(join(dir, e.name), `${base}${e.name}/`)
            : e.name.endsWith(".ts")
              ? [`${base}${e.name}`]
              : []);
    const stale: string[] = [];
    for (const rel of walk(source, "")) {
      const there = join(copied, rel);
      if (!existsSync(there)) { stale.push(`${rel} (missing from the copy)`); continue; }
      if (readFileSync(join(source, rel), "utf8") !== readFileSync(there, "utf8")) stale.push(rel);
    }
    if (stale.length) {
      fail(`next/node_modules/@reiad/shared is ${stale.length} file(s) behind shared/.`,
        `The first is ${stale[0]}.`,
        "npm keys a file: dependency by its version, so it will not notice.",
        "Next compiles the copy, so a fix to shared/ has not taken and a",
        "function you can read in the source is reported as not exported.",
        "  rm -rf next/node_modules/@reiad/shared && (cd next && npm install)");
    } else {
      copiedShared = walk(source, "").length;
    }
  }
}

console.log(failures
  ? `\n${failures} copy(ies) in next/ have drifted from the original.\n`
  : `next/ holds 3 drawings copied out of aab/ by hand and ${drawings}\n`
    + `generated, every one still matches what icons.js draws, and all\n`
    + `${asked.size} names a card asks for come back with a drawing in them,\n`
    + `and ${books} practice book(s) are as long as their ladder says.\n`
    + (copiedShared
      ? `next/node_modules/@reiad/shared matches all ${copiedShared} of shared/.\n`
      : "next/ has no copy of @reiad/shared installed, so there is none to be stale.\n"));
process.exit(failures ? 1 : 0);
