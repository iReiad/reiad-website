#!/usr/bin/env node
/* The medals, which are arithmetic over the ticks.
     node next/medals.test.ts
   No browser and no build.

   WHAT IT GUARDS: a medal is earned by the ticks and by nothing
   else, the press that crosses a line earns exactly that line, a
   stage with no lessons cannot be "finished", and the shelf shows
   the next step of each kind rather than every step. */

export {};

/* The types come in by `import type`, which is erased; the values by
   a dynamic import, so this file has no static import for node to
   trip on. */
import type { Medal, Progress } from "./lib/medals.ts";
const M = await import("./lib/medals.ts");

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed++; console.log(`  ok   ${what}`); }
  else { failures.push(`${what}${detail ? `: ${detail}` : ""}`); console.log(`  FAIL ${what}   ${detail}`); }
};

const ids = (stage: string, n: number) => Array.from({ length: n }, (_, i) => `${stage}/l-${i + 1}`);
const stages = [ids("a", 3), ids("b", 4), []];
const at = (read: string[], extra: Partial<Progress> = {}): Progress =>
  ({ read: new Set(read), checks: new Set(), days: 0, stages, ...extra });

console.log("\nnothing yet");
{
  const m = M.medalsFor(at([]));
  ok("no medal is earned by a stranger", m.every((x) => !x.earned));
  ok("every rule is listed", m.length === M.RULES.length);
  ok("the shelf shows one next step per kind", M.shelf(m).length === 5,
    `${M.shelf(m).length}`);
  ok("and the first of them is the first lesson", M.shelf(m)[0].id === "first");
}

console.log("\nlessons");
{
  const one = M.medalsFor(at(["a/l-1"]));
  ok("one tick earns the first lesson", one.find((x) => x.id === "first")?.earned === true);
  ok("and not the fifth", one.find((x) => x.id === "five")?.earned === false);
  ok("the count is capped at the need", one.find((x) => x.id === "first")?.have === 1);
  const five = M.medalsFor(at([...ids("a", 3), "b/l-1", "b/l-2"]));
  ok("five ticks earn five lessons", five.find((x) => x.id === "five")?.earned === true);
  ok("the shelf keeps the earned ones and the next", M.shelf(five).map((x) => x.id).join(",")
    === "first,five,ten,checks,days-3,stage,school", M.shelf(five).map((x) => x.id).join(","));
}

console.log("\nthe press that crosses a line");
{
  const before = M.medalsFor(at(ids("a", 3).concat("b/l-1")));
  const after = M.medalsFor(at(ids("a", 3).concat("b/l-1", "b/l-2")));
  const won = M.newlyEarned(before, after);
  ok("earns exactly the line it crossed", won.map((x) => x.id).join(",") === "five",
    won.map((x) => x.id).join(","));
  ok("and undoing a tick earns nothing", M.newlyEarned(after, before).length === 0);
}

console.log("\nstages");
{
  const a = M.medalsFor(at(ids("a", 3)));
  ok("every lesson of a stage ticked finishes the stage", a.find((x) => x.id === "stage")?.earned === true);
  ok("but not the school", a.find((x) => x.id === "school")?.earned === false);
  const all = M.medalsFor(at([...ids("a", 3), ...ids("b", 4)]));
  ok("every real stage finished is the school", all.find((x) => x.id === "school")?.earned === true);
  const empty = M.medalsFor({ read: new Set(), checks: new Set(), days: 0, stages: [[]] });
  ok("a stage with no lessons is not a finished stage", empty.find((x) => x.id === "stage")?.earned === false);
  ok("and a school of such stages is not finished", empty.find((x) => x.id === "school")?.earned === false);
  ok("a stage counts once, however often it is read", a.find((x) => x.id === "stage")?.have === 1);
}

console.log("\ndays and checkpoints");
{
  const m = M.medalsFor(at([], { days: 7, checks: new Set(["a/l-1#1", "a/l-1#2"]) }));
  ok("seven days earn three and seven", m.filter((x) => x.kind === "days" && x.earned).length === 2);
  ok("and not thirty", m.find((x) => x.id === "days-30")?.earned === false);
  ok("two checkpoints do not earn ten", m.find((x) => x.id === "checks")?.earned === false);
  ok("the count under a medal is what there is", m.find((x) => x.id === "checks")?.have === 2);
}

console.log("\nhow far to go");
{
  const m = M.medalsFor(at(["a/l-1", "a/l-2"], { days: 2 }));
  const by = (id: string) => m.find((x) => x.id === id) as Medal;
  ok("three more lessons to five", M.toGo(by("five")) === "আর ৩টা পাঠ", M.toGo(by("five")));
  ok("one more day to three", M.toGo(by("days-3")) === "আর ১ দিন", M.toGo(by("days-3")));
  ok("a stage says what to do rather than a count", M.toGo(by("stage")).includes("ধাপ"));
}

console.log("\nnumerals");
ok("Bangla digits are Bengali, not Devanagari", M.bn(2026) === "২০২৬", M.bn(2026));

if (failures.length) {
  console.error(`\nmedals: ${failures.length} failed of ${passed + failures.length}`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`\nmedals: all ${passed} passed.\n`);
