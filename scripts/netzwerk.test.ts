#!/usr/bin/env node
/* ============================================================
   netzwerk.test.ts: the study planner's plan is the workbook's.

       node scripts/netzwerk.test.ts

   `planFor()` in `shared/netzwerk.ts` writes 92 weeks out of a
   handful of rules. The workbook it replaces wrote them out by
   hand, and `scripts/fixtures/netzwerk-plan.json` is those rows,
   cell for cell, with its two named learners read as the two
   routes. Every Monday-to-Saturday cell, every level, every
   grammar focus, speaking goal and milestone has to match, and so
   do the chapter tracker's plan weeks and the practice tracker's
   planned chapters: a rule that drifts by one session moves every
   date after it and nothing on the page would look wrong.

   The rest is the arithmetic the sheets did in formulas: review
   dates, status, reviews due, the practice score, the forecast.
   No browser and no database.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CHAPTERS, GRAMMAR, LIBRARY, METHOD, TIPS, EXAMS, MILESTONES,
  addDays, chapterStatus, forecast, logSummary, mondayOnOrAfter, planFor,
  practiceScore, reviewDates, reviewsDue, runOfDays, sessionsFor,
  trackedChapters, weekAt, weekStart, DEFAULT_SETTINGS, newLearner, chapterSummary,
  type Route,
} from "../shared/netzwerk.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let bad = 0;
let passed = 0;
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  bad += 1;
  console.error(`FAIL  ${what}${detail ? `\n      ${detail}` : ""}`);
};

interface FixtureWeek {
  n: number; level: string; days: string[]; focus: string; speaking: string; milestone: string;
}
interface Fixture {
  A: FixtureWeek[];
  B: FixtureWeek[];
  tracker: Record<Route, Array<{ level: string; n: number; title: string; week: number }>>;
  practice: Record<Route, Array<{ n: number; level: string; planned: string }>>;
}

const fixture = JSON.parse(
  readFileSync(join(ROOT, "scripts", "fixtures", "netzwerk-plan.json"), "utf8"),
) as Fixture;

/* ---- the tables came through whole ---- */

ok("48 chapters", CHAPTERS.length === 48, String(CHAPTERS.length));
ok("40 grammar points", GRAMMAR.length === 40);
ok("28 resources", LIBRARY.length === 28);
ok("36 tips", TIPS.length === 36);
ok("8 method sections", METHOD.length === 8, METHOD.map((m) => m.id).join(","));
ok("4 exams and 7 milestones", EXAMS.length === 4 && MILESTONES.length === 7);
ok("every chapter has a focus line", CHAPTERS.every((c) => c.focus.length > 0));
ok("chapter hours are the workbook's", CHAPTERS.reduce((n, c) => n + c.hours, 0) > 250);

/* ---- the two routes, cell by cell ---- */

for (const route of ["A", "B"] as const) {
  const weeks = planFor(route);
  const want = fixture[route];
  ok(`route ${route}: ${want.length} weeks`, weeks.length === want.length,
    `${weeks.length} generated`);
  ok(`route ${route}: six sessions a week`, sessionsFor(route).length === want.length * 6,
    String(sessionsFor(route).length));

  want.forEach((w, i) => {
    const got = weeks[i];
    if (!got) return;
    ok(`route ${route} week ${w.n}: level`, got.level === w.level, `${got.level} vs ${w.level}`);
    w.days.forEach((text, d) => {
      ok(`route ${route} week ${w.n} day ${d + 1}`, got.days[d]?.text === text,
        `\n      got  ${got.days[d]?.text}\n      want ${text}`);
    });
    ok(`route ${route} week ${w.n}: focus`, got.focus === w.focus, `\n      got  ${got.focus}\n      want ${w.focus}`);
    ok(`route ${route} week ${w.n}: speaking`, got.speaking === w.speaking, `\n      got  ${got.speaking}\n      want ${w.speaking}`);
    ok(`route ${route} week ${w.n}: milestone`, got.milestone === w.milestone,
      `\n      got  ${JSON.stringify(got.milestone)}\n      want ${JSON.stringify(w.milestone)}`);
  });

  /* The tracker's plan week and the bridge mode beside a title. */
  const tracked = trackedChapters(route);
  fixture.tracker[route].forEach((row) => {
    const got = tracked.find((c) => c.level === row.level && c.n === row.n);
    const title = got?.mode ? `${got.title}  [${got.mode}]` : got?.title;
    ok(`route ${route} tracker ${row.level} K${row.n}: week`, got?.week === row.week,
      `${got?.week} vs ${row.week}`);
    ok(`route ${route} tracker ${row.level} K${row.n}: title`, title === row.title,
      `${title} vs ${row.title}`);
  });

  /* The practice tracker's planned chapters. */
  fixture.practice[route].forEach((row) => {
    const got = weeks[row.n - 1];
    ok(`route ${route} practice week ${row.n}: planned`, got?.planned === row.planned,
      `${got?.planned} vs ${row.planned}`);
    ok(`route ${route} practice week ${row.n}: level`, got?.level === row.level,
      `${got?.level} vs ${row.level}`);
  });
}

/* ---- the sheet's dates ---- */

ok("a Monday stays a Monday", mondayOnOrAfter("2026-09-21") === "2026-09-21");
ok("a Wednesday moves to the next Monday", mondayOnOrAfter("2026-09-23") === "2026-09-28");
ok("a Sunday moves one day", mondayOnOrAfter("2026-09-27") === "2026-09-28");
ok("week 1 starts on the start", weekStart("2026-09-21", 1) === "2026-09-21");
ok("week 11 is seventy days on", weekStart("2026-09-21", 11) === "2026-11-30");
ok("adding days crosses a year end", addDays("2026-12-30", 5) === "2027-01-04");
ok("the day before the start is no week", weekAt("2026-09-21", "2026-09-20", 52) === null);
ok("the start is week 1", weekAt("2026-09-21", "2026-09-21", 52) === 1);
ok("a Saturday is still its week", weekAt("2026-09-21", "2026-09-26", 52) === 1);
ok("the next Monday is week 2", weekAt("2026-09-21", "2026-09-28", 52) === 2);
ok("past the last week is null", weekAt("2026-09-21", "2028-01-01", 52) === null);

/* ---- the chapter tracker's formulas ---- */

ok("no completion, no reviews", reviewDates(null) === null);
ok("+2, +7, +30", JSON.stringify(reviewDates("2026-09-26")) === JSON.stringify(["2026-09-28", "2026-10-03", "2026-10-26"]));
ok("an empty chapter is not started", chapterStatus(undefined) === "Not started");
ok("completed is review 1 pending", chapterStatus({ completed: "2026-09-26" }) === "Review 1 pending");
ok("one review ticked is review 2 pending", chapterStatus({ completed: "2026-09-26", r1: true }) === "Review 2 pending");
ok("two ticked is review 3 pending", chapterStatus({ completed: "2026-09-26", r1: true, r2: true }) === "Review 3 pending");
ok("three ticked is mastered", chapterStatus({ completed: "2026-09-26", r1: true, r2: true, r3: true }) === "Mastered");
ok("the third tick alone still reads mastered, as the sheet did",
  chapterStatus({ completed: "2026-09-26", r3: true }) === "Mastered");
ok("nothing is due before the second day", reviewsDue({ completed: "2026-09-26" }, "2026-09-27") === 0);
ok("one is due on the second day", reviewsDue({ completed: "2026-09-26" }, "2026-09-28") === 1);
ok("two are due after a week", reviewsDue({ completed: "2026-09-26" }, "2026-10-03") === 2);
ok("a ticked review is not due", reviewsDue({ completed: "2026-09-26", r1: true }, "2026-10-03") === 1);
ok("all three overdue after a month", reviewsDue({ completed: "2026-09-26" }, "2026-11-01") === 3);

const learner = newLearner("x", "Test", "A", "2026-09-23");
ok("a learner starts on a Monday", learner.start === "2026-09-28");
learner.chapters["A1/1"] = { completed: "2026-09-26", r1: true, r2: true, r3: true };
learner.chapters["A1/2"] = { completed: "2026-09-30" };
const summary = chapterSummary(learner, "2026-10-08");
ok("two completed of 48", summary.completed === 2 && summary.total === 48);
ok("one mastered", summary.mastered === 1);
ok("two reviews due on K2 (+2 and +7)", summary.due === 2, String(summary.due));
ok("the pie adds up", Object.values(summary.byStatus).reduce((a, b) => a + b, 0) === 48);

/* ---- the practice tracker's score ---- */

ok("nothing typed is no score", practiceScore(undefined, DEFAULT_SETTINGS) === null);
ok("an empty week is no score", practiceScore({}, DEFAULT_SETTINGS) === null);
ok("every target met is 100", practiceScore({ speaking: 60, listening: 90, writing: 2, cards: 90 }, DEFAULT_SETTINGS) === 100);
ok("over target is capped", practiceScore({ speaking: 600, listening: 90, writing: 2, cards: 90 }, DEFAULT_SETTINGS) === 100);
ok("one of four met is 25, as the sheet scored it", practiceScore({ speaking: 60 }, DEFAULT_SETTINGS) === 25);
ok("half of everything is 50", practiceScore({ speaking: 30, listening: 45, writing: 1, cards: 45 }, DEFAULT_SETTINGS) === 50);

/* ---- the start sheet ---- */

const fa = forecast("A", "2026-09-21", DEFAULT_SETTINGS);
ok("hours a week: (5×65+75)/60", fa.hoursPerWeek === 6.67, String(fa.hoursPerWeek));
ok("cards a week: 15×6", fa.cardsPerWeek === 90);
ok("route A is 52 weeks, 68 realistic", fa.weeks === 52 && fa.weeksRealistic === 68, `${fa.weeks} ${fa.weeksRealistic}`);
ok("route A finishes 364 days on", fa.finish === "2027-09-20", fa.finish);
ok("route A has 312 sessions", fa.sessions === 312);
const fb = forecast("B", "2026-09-21", DEFAULT_SETTINGS);
ok("route B is 40 weeks, 52 realistic, 240 sessions", fb.weeks === 40 && fb.weeksRealistic === 52 && fb.sessions === 240);

/* ---- the daily log ---- */

const log = [
  { id: "1", date: "2026-09-21", level: "A1", chapter: "K1", type: "Chapter session", minutes: 65, cards: 15, reviews: true, speaking: 5, listening: 20, writing: true, energy: 4, hard: "" },
  { id: "2", date: "2026-09-22", level: "A1", chapter: "K1", type: "Chapter session", minutes: 45, cards: 15, reviews: true, speaking: 10, listening: 0, writing: false, energy: 0, hard: "" },
  { id: "3", date: "2026-09-10", level: "A1", chapter: "K1", type: "Chapter session", minutes: 70, cards: 15, reviews: true, speaking: 10, listening: 30, writing: false, energy: 2, hard: "" },
];
const s = logSummary(log, "2026-09-22");
ok("three sessions, 180 minutes, 60 average", s.sessions === 3 && s.minutes === 180 && s.average === 60);
ok("two in the last seven days", s.last7 === 2, String(s.last7));
ok("15 minutes speaking and 20 listening this week", s.speaking7 === 15 && s.listening7 === 20);
ok("energy averages the ones said", s.energy === 3, String(s.energy));
ok("a run of two days", runOfDays(log, "2026-09-22") === 2);
ok("no run on a day with nothing", runOfDays(log, "2026-09-23") === 0);

/* ---- nothing personal came through ---- */

const source = readFileSync(join(ROOT, "shared", "netzwerk.ts"), "utf8");
ok("no learner is named in the data", !/\b(Rony|wife|Wife)\b/.test(source));
ok("no em dash in the data", !source.includes(String.fromCharCode(0x2014)));

console.log(bad ? `\n${bad} failed, ${passed} passed` : `\nnetzwerk: ${passed} checks, both routes match the workbook cell for cell.`);
process.exit(bad ? 1 : 0);
