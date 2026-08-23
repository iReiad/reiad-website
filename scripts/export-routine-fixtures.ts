#!/usr/bin/env node
/* ============================================================
   export-routine-fixtures.ts: the routine's arithmetic, frozen.

       node scripts/export-routine-fixtures.ts          write
       node scripts/export-routine-fixtures.ts --check  fail on drift

   `shared/routine.ts` is the model and the Android app has a
   Kotlin port of it. `scripts/routine.test.ts` already asserts
   that the model is RIGHT; this asserts the two implementations
   agree, which is a different question and the only one a fixture
   can answer.

   ---- the history below is built to break things ----

   Not a plausible month. Every day in it is there because some
   obvious way of writing one of these functions gets it wrong:

     - a DEAD FORTNIGHT, because §0's whole promise is that
       nothing falls during one. A mean over calendar days drops
       through it; a mean over marked days does not.
     - a day with ONLY LEISURE marked, which is not empty and has
       nothing the arithmetic can describe, so `done` must answer
       null and not nought.
     - a day with a mark on an ARCHIVED task, which renders on the
       day it was made and must not move any figure.
     - a HALF mark, and a mark of 1.5, which is capped rather than
       counted.
     - a day with a note and NO marks, which is not a marked day
       and must not enter a run.
     - a run that ENDED YESTERDAY, because today is not over and a
       counter that drops at midnight is a thing to be broken.
     - the 31st of a month, because `echo` walks back in months
       and JavaScript OVERFLOWS rather than clamping: the 31st of
       March minus one month is the 3rd of March.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  balance, bandRates, changed, consistency, done, echo, everMarked,
  flock, garden, greeting, heat, hours, hoursDone, momentum, moodRibbon,
  neverMarked, runs, seasonOf, series, weekdays, written,
  type Entry, type RoutineShape,
} from "../shared/routine.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "content", "routine.fixtures.json");

/* ---------- an invented routine, and it has to be ----------

   NOT a shipped template. The interesting one is in
   `PRIVATE_TEMPLATES`, which is a real person's day and is kept
   out of the public bundle on purpose: putting it in a committed
   fixture would publish it by another road.

   It was `TEMPLATES.find("sadias-day")` for one run, which is not
   in that list, so it silently fell back to the six-task starter
   and every mark below referenced a task that did not exist.
   Every `done` came back null and the fixture asserted nothing at
   all, on a file that generated and committed cleanly.

   So this is built here, and built to be AWKWARD: a band whose
   tasks do not count, a task with no hours, a task that is
   archived, and one band with nothing live in it. */
const shape: RoutineShape = {
  bands: [
    { id: "learn", en: "Learning", bn: "পড়াশোনা", colour: "#6E52A8", order: 1 },
    { id: "home", en: "Home", bn: "ঘর", colour: "#2F8A64", order: 2 },
    { id: "mine", en: "Just for me", bn: "শুধু আমার জন্য", colour: "#A2790B", order: 3 },
    { id: "rest", en: "Rest", bn: "বিশ্রাম", colour: "#4C61A8", order: 4 },
    /* A band with nothing live in it, which `bandRates` must
       skip rather than divide by. */
    { id: "empty", en: "Nothing here", bn: "কিছু নেই", colour: "#B45570", order: 5 },
  ],
  tasks: [
    { id: "eng", band: "learn", en: "English", bn: "ইংরেজি", hours: 1, counts: true, order: 1 },
    { id: "art", band: "learn", en: "Art", bn: "আর্ট", hours: 1, counts: true, order: 2 },
    { id: "mth", band: "learn", en: "Maths", bn: "গণিত", hours: 1, counts: true, order: 3 },
    { id: "qur", band: "learn", en: "Quran", bn: "কুরআন", hours: 1, counts: true, order: 4 },
    { id: "brk", band: "home", en: "Breakfast", bn: "নাস্তা", hours: 1, counts: true, order: 5 },
    { id: "din", band: "home", en: "Dinner", bn: "রাতের রান্না", hours: 2, counts: true, order: 6 },
    { id: "sho", band: "home", en: "Shower", bn: "গোসল", hours: 0.5, counts: true, order: 7 },
    { id: "brd", band: "home", en: "Feed the birds", bn: "পাখির খাবার", hours: 0.25, counts: true, order: 8 },
    { id: "pln", band: "home", en: "Water the plants", bn: "গাছে পানি", hours: 0.25, counts: true, order: 9 },
    /* Leisure. Tracked and excluded, which is the shape of the
       whole tool: it must never be able to fail. */
    { id: "tv", band: "mine", en: "TV", bn: "টিভি", hours: 1.5, counts: false, order: 10 },
    { id: "bok", band: "mine", en: "Story book", bn: "গল্পের বই", hours: 1, counts: false, order: 11 },
    /* No hours, deliberately: whatever it was took as long as it
       took, and it must add nothing to either half of
       `hoursDone`. */
    { id: "own", band: "mine", en: "Something I chose", bn: "আমার পছন্দ", counts: false, order: 12 },
    { id: "slp", band: "rest", en: "Sleep", bn: "ঘুম", hours: 7, counts: true, order: 13 },
    /* NEVER MARKED, not once, which is the most important thing
       the tool can tell somebody: a routine full of aspirational
       tasks is what makes a tracker feel bad, and the fix is
       taking them out rather than trying harder. */
    { id: "run", band: "home", en: "Go for a run", bn: "দৌড়ানো", hours: 1, counts: true, order: 14 },
    /* Archived: a mark on it renders on the day it was made and
       moves no figure. No template ships with one. */
    { id: "gone", band: "learn", en: "Something I stopped", bn: "যেটা আর করি না",
      hours: 1, counts: true, order: 99, archived: true },
  ],
};

const TODAY = "2026-03-31";

/** A day, said briefly. */
const day = (
  date: string, marks: Record<string, number>,
  extra: Partial<Entry> = {},
): Entry => ({ entry_date: date, marks, ...extra });

const entries: Entry[] = [
  /* A year ago, with words on it, which is what `echo` reaches
     for first. The date is deliberately the 31st: a year before
     the 31st of March is a real date, and a MONTH before it is
     not, which is the overflow case. */
  day("2025-03-31", { eng: 1, qur: 1, sho: 1 }, {
    note: "The birds ate from my hand today.", mood: "light",
  }),
  /* Six months ago, also written, so the preference for the
     OLDEST reachable echo is actually tested. */
  day("2025-09-30", { eng: 1 }, { note: "Six months back.", mood: "steady" }),

  /* A month of ordinary days. */
  day("2026-02-20", { eng: 1, art: 1, mth: 1, qur: 1, brk: 1, din: 1, sho: 1, slp: 1 },
    { mood: "steady" }),
  day("2026-02-21", { eng: 1, qur: 1, brk: 1, sho: 1, slp: 1 }, { mood: "light" }),
  day("2026-02-22", { eng: 0.5, qur: 1, slp: 1 }, { mood: "full" }),

  /* THE DEAD FORTNIGHT: 23 February to 8 March, nothing at all.
     Every mean has to hold through it. */

  day("2026-03-09", { eng: 1, qur: 1, sho: 1, slp: 1 }, { mood: "heavy" }),
  /* Only leisure. Not an empty day, and nothing `done` can
     describe: it must answer null rather than nought. */
  day("2026-03-10", { tv: 1, bok: 1, own: 1 }, { chose: "Sat in the sun", mood: "light" }),
  /* A mark on an ARCHIVED task, and one on a task the shape does
     not have at all, which is what a row looks like after
     somebody deletes a task rather than archiving it. Both are
     skipped and neither throws. */
  day("2026-03-11", { gone: 1, vanished: 1 }),
  /* A note and no marks at all: not a marked day, and it must
     not enter a run. */
  day("2026-03-12", {}, { note: "Too tired to do anything.", mood: "heavy" }),
  /* A mark ABOVE one, which is capped rather than counted. */
  day("2026-03-13", { eng: 1.5, qur: 0.5, slp: 1 }),

  /* A week of them, so the weekday buckets have something in
     each. */
  day("2026-03-16", { eng: 1, art: 1, brk: 1, slp: 1 }, { mood: "steady" }),
  day("2026-03-17", { eng: 1, mth: 1, din: 1, sho: 1, slp: 1 }),
  day("2026-03-18", { qur: 1, brd: 1, pln: 1, slp: 1 }, { mood: "light" }),
  day("2026-03-19", { eng: 1, qur: 1, art: 1, mth: 1, brk: 1, din: 1, sho: 1,
    brd: 1, pln: 1, slp: 1, tv: 1 }, { note: "Everything, somehow.", mood: "full" }),
  day("2026-03-20", { eng: 1, slp: 1 }),
  day("2026-03-21", { qur: 1, brk: 1, slp: 1 }, { mood: "steady" }),

  /* THE RUN THAT ENDED YESTERDAY: four days to the 30th, and
     nothing today. `runs().now` must be 4 rather than 0, because
     today is not over. */
  day("2026-03-27", { eng: 1, qur: 1, slp: 1 }),
  day("2026-03-28", { eng: 1, brk: 1, slp: 1 }),
  day("2026-03-29", { eng: 1, qur: 1, sho: 1, slp: 1 }, { mood: "light" }),
  day("2026-03-30", { eng: 1, qur: 1, slp: 1 }, { note: "Steady week.", mood: "steady" }),
];

/** The days `done` is asked about one at a time, and why. */
const DAYS: Array<{ name: string; why: string; date: string | null }> = [
  { name: "full", why: "a day with almost everything on it", date: "2026-03-19" },
  { name: "half", why: "a half mark counts as a half rather than as a lesser nothing",
    date: "2026-02-22" },
  { name: "over-one", why: "a mark above one is CAPPED at one rather than counted, or a "
    + "single task could carry a whole day", date: "2026-03-13" },
  { name: "leisure-only", why: "not an empty day, and nothing this arithmetic can "
    + "describe: it must answer null and never nought", date: "2026-03-10" },
  { name: "archived-only", why: "a mark on an archived task renders on the day it was "
    + "made and moves no figure, so this day is null too", date: "2026-03-11" },
  { name: "note-only", why: "a row carrying words and no marks", date: "2026-03-12" },
  { name: "absent", why: "a date with no row at all, which is the ordinary empty day",
    date: "2026-03-25" },
  { name: "none", why: "no entry passed in at all", date: null },
];

const by = new Map(entries.map((e) => [e.entry_date, e]));

const built = {
  today: TODAY,
  shape,
  entries,

  /* One day at a time, which is where the null-not-nought rule
     is decided. */
  days: DAYS.map((d) => ({
    ...d,
    out: {
      done: d.date === null ? done(shape, null) : done(shape, by.get(d.date)),
      hours: d.date === null ? hoursDone(shape, null) : hoursDone(shape, by.get(d.date)),
    },
  })),

  /* And everything read over the whole history. */
  shapeHours: hours(shape),
  heat: heat(shape, entries, TODAY, 12),
  series: series(shape, entries, TODAY, 30),
  moodRibbon: moodRibbon(entries, TODAY, 30),
  consistency: consistency(shape, entries, TODAY, 28)
    .map((t) => ({ id: t.task.id, marked: t.marked, of: t.of })),
  neverMarked: neverMarked(shape, entries).map((t) => t.id),
  changed: {
    eng: changed(entries, "eng", TODAY, 14),
    tv: changed(entries, "tv", TODAY, 14),
  },
  balance: balance(shape, entries).map((b) => ({ band: b.band.id, share: b.share })),
  momentum: momentum(shape, entries, TODAY, 28),
  weekdays: weekdays(shape, entries, TODAY, 84),
  bandRates: bandRates(shape, entries, TODAY, 84),
  runs: runs(entries, TODAY, 365),
  written: written(entries).map((e) => e.entry_date),
  echo: echo(entries, TODAY),

  /* The counters that only ever grow, and the two drawings hung
     on them. */
  everMarked: { eng: everMarked(entries, "eng"), tv: everMarked(entries, "tv") },
  flock: [0, 1, 2, 3, 9, 10, 24, 25, 49, 50, 99, 100, 199, 200, 500]
    .map((n) => ({ times: n, birds: flock(n) })),
  garden: [0, 1, 4, 5, 19, 20, 59, 60, 149, 150, 400]
    .map((n) => ({ times: n, plants: garden(n) })),

  /* Six seasons, at every boundary and a day either side of it,
     because winter wraps the year and mid-January must not fall
     off the end of the list. */
  seasons: [
    "2026-01-01", "2026-02-14", "2026-02-15", "2026-04-14", "2026-04-15",
    "2026-06-14", "2026-06-15", "2026-08-14", "2026-08-15", "2026-10-14",
    "2026-10-15", "2026-12-14", "2026-12-15", "2026-12-31",
  ].map((date) => ({ date, season: seasonOf(date).id })),

  greeting: [0, 4, 5, 11, 12, 15, 16, 19, 20, 23]
    .map((hour) => ({ hour, ...greeting(hour) })),
};

const text = `${JSON.stringify(built, null, 2)}\n`;

if (process.argv.includes("--check")) {
  if (readFileSync(OUT, "utf8") === text) {
    console.log("routine fixtures: unchanged.");
    process.exit(0);
  }
  console.error("\n  x content/routine.fixtures.json is not what shared/routine.ts");
  console.error("        produces. Either it changed and the fixtures were not");
  console.error("        regenerated, or they were edited by hand. Run:");
  console.error("          node scripts/export-routine-fixtures.ts");
  console.error("        and read the diff: every line is a number the Android app is");
  console.error("        asserting, so a change here is a change there.\n");
  process.exit(1);
}

writeFileSync(OUT, text);
console.log(`routine fixtures: ${entries.length} days over a year, ${DAYS.length} days read`
  + " one at a time, and every counter.");
