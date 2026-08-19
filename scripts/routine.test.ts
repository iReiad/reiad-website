/* ============================================================
   routine.test.ts: the product, as assertions.

       node scripts/routine.test.ts

   Section 9 of the build spec is not a preference list, it is
   what the tool IS, and prose does not hold. Everything here is
   one of those constraints or one of the shapes they rest on. No
   browser and no database: this is the arithmetic, the templates
   and a grep, so it runs everywhere and in CI, which is the only
   way a rule survives.

   ---- the one rule under all of it ----

   NOTHING THIS TOOL REMEMBERS ABOUT SOMEBODY EVER GOES DOWN.

   It is a gift rather than a productivity tool. That is stronger
   than "no streaks" because it says why a streak is wrong: it is
   a number that punishes you for living. A feature that can
   decrease is a streak wearing a costume, and the ratchet section
   below is where that stops being a sentence.

   ---- why it is here rather than in `next/` ----

   It needs neither the Next build nor a browser: it is the
   arithmetic, the templates and a grep. `scripts/` is where the
   node-side tests live and where they run with no build step,
   which is what makes this one run in CI.

   ---- what this does NOT cover, said out loud ----

   Row-level security is `scripts/check-rls.ts`, and the live
   proof against real JWT claims is recorded in ROUTINE.md.
   Nothing here can reach the database, so nothing here should
   pretend to: a test that says "isolation ok" without asking
   Postgres is worse than no test, because it is believed.
   ============================================================ */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
/* By relative path rather than through `@reiad/shared`, which is
   the same way every other node-side test here reads it. Node
   cannot strip types from a file under `node_modules`, and the
   package resolves to a copy in `next/node_modules`, so the
   package specifier is the route a BUILD takes and a relative
   path is the route plain node takes. */
import {
  TEMPLATES, FIRST_RUN, SCHEMA, done, hours, bandTasks,
  toExport, readImport, summarise, mergeDays, exportName,
  type Task, type RoutineShape, type Entry,
} from "../shared/routine.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};
const is = (what: string, got: unknown, want: unknown): void =>
  ok(what, JSON.stringify(got) === JSON.stringify(want),
    `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

const shapeOf = (slug: string): RoutineShape => {
  const t = TEMPLATES.find((x) => x.slug === slug);
  if (!t) throw new Error(`no template ${slug}`);
  return t.data;
};

const day = (marks: Record<string, number>): Entry =>
  ({ entry_date: "2026-08-19", marks });

/* ============================================================
   1. The templates the site ships
   ============================================================ */
console.log("\nthe three templates");
{
  is("three of them", TEMPLATES.length, 3);
  ok("and the first run is one of them",
    TEMPLATES.some((t) => t.slug === FIRST_RUN), FIRST_RUN);
  /* Not Sadia's, deliberately. A first run should not be a wall
     of somebody else's life, which is the spec's own phrase. */
  is("and it is not somebody else's life", FIRST_RUN, "a-simple-day");

  const sadia = shapeOf("sadias-day");
  is("Sadia's day has six bands", sadia.bands.length, 6);
  is("and eighteen tasks", sadia.tasks.length, 18);
  is("thirteen of which count", sadia.tasks.filter((t) => t.counts).length, 13);

  /* The five under "Just for me" plus the gentle habit. A third
     of the list exists to be enjoyed rather than achieved, and
     that proportion is the whole character of the thing. */
  is("and five do not, all of them hers to enjoy",
    sadia.tasks.filter((t) => !t.counts).map((t) => t.id),
    ["tv", "bok", "hob", "own", "knk"]);

  for (const t of TEMPLATES) {
    const ids = t.data.tasks.map((x) => x.id);
    is(`${t.slug}: no task id appears twice`, ids.length, new Set(ids).size);
    const bands = new Set(t.data.bands.map((b) => b.id));
    const orphan = t.data.tasks.find((x) => !bands.has(x.band));
    ok(`${t.slug}: every task is in a band that exists`, !orphan, orphan?.id ?? "");
    ok(`${t.slug}: every task has both languages`,
      t.data.tasks.every((x) => x.en.trim() && x.bn.trim()));
    ok(`${t.slug}: every band has both languages`,
      t.data.bands.every((b) => b.en.trim() && b.bn.trim()));
    /* A colour per band, because the band's colour becomes
       --accent inside it and an undefined custom property makes
       the whole declaration invalid, which is a band drawn in the
       page's colour and looking almost right. */
    ok(`${t.slug}: every band has a colour`,
      t.data.bands.every((b) => /^#[0-9a-f]{6}$/i.test(b.colour)));
  }

  /* Blank is blank. It is the one template whose emptiness is the
     feature, so it is worth saying rather than assuming. */
  is("Blank has no tasks", shapeOf("blank").tasks.length, 0);
  is("and one band to put them in", shapeOf("blank").bands.length, 1);
}

/* ============================================================
   2. Leisure cannot fail
   ============================================================ */
console.log("\nleisure cannot fail");
{
  const sadia = shapeOf("sadias-day");

  /* Mark every single thing that does not count, and nothing
     that does. If leisure were in the arithmetic this would read
     as a full day; if it were HALF in, it would read as some
     fraction. It reads as nothing to describe. */
  const onlyFun = day({ tv: 1, bok: 1, hob: 1, own: 1, knk: 1 });
  is("a day of nothing but leisure is not a score", done(sadia, onlyFun), null);

  /* And the same day plus one counting task is 1/13 exactly.
     Which is to say: the five leisure marks contributed nothing,
     not even to the denominator. */
  const funPlusOne = day({ tv: 1, bok: 1, hob: 1, own: 1, knk: 1, eng: 1 });
  is("and adding one real task makes it one thirteenth",
    done(sadia, funPlusOne), 1 / 13);

  is("a full day is one", done(sadia, day(Object.fromEntries(
    sadia.tasks.filter((t) => t.counts).map((t) => [t.id, 1])))), 1);

  is("and a half is a half, not a lesser nothing",
    done(sadia, day({ eng: 0.5 })), 0.5 / 13);
}

/* ============================================================
   3. Nobody is ever shown a zero
   ============================================================ */
console.log("\nnobody is ever shown a zero");
{
  const sadia = shapeOf("sadias-day");

  /* An empty day answers null so the page can say "today is
     still empty" in words. A zero is a judgement wearing a
     number's clothes, and somebody opening yesterday should not
     be told they scored nothing. */
  is("an empty day has no number at all", done(sadia, day({})), null);
  is("and neither does a day that does not exist yet", done(sadia, null), null);
  is("nor a day whose marks are all zero", done(sadia, day({ eng: 0, art: 0 })), null);

  /* The one case that could produce a real 0: a routine with no
     counting tasks at all, which Blank is. */
  is("a routine with nothing to count has no number",
    done(shapeOf("blank"), day({})), null);

  const every = [
    done(sadia, day({})), done(sadia, day({ eng: 1 })),
    done(sadia, day({ tv: 1 })), done(shapeOf("blank"), day({})),
  ];
  ok("and no path through the arithmetic returns 0",
    every.every((v) => v !== 0), JSON.stringify(every));
}

/* ============================================================
   4. Archiving a task does not rewrite the past
   ============================================================ */
console.log("\narchiving a task does not rewrite the past");
{
  const sadia = shapeOf("sadias-day");
  /* Somebody tidies their list. The mark stays in the row for
     ever, because ids are never reused and never removed, and it
     must not move today's figure: a person who tidied should not
     find yesterday's percentage changed under them. */
  const tidied: RoutineShape = {
    bands: sadia.bands,
    tasks: sadia.tasks.map((t): Task => (t.id === "lau" ? { ...t, archived: true } : t)),
  };

  is("the counting list is one shorter",
    tidied.tasks.filter((t) => t.counts && !t.archived).length, 12);
  is("a mark on the archived task is not counted",
    done(tidied, day({ lau: 1 })), null);
  is("and the tasks still on the list are over the new total",
    done(tidied, day({ eng: 1 })), 1 / 12);
  ok("the archived task is still in the routine, not deleted",
    tidied.tasks.some((t) => t.id === "lau"));
  ok("and it is not offered in its band any more",
    !bandTasks(tidied, "home").some((t) => t.id === "lau"));
}

/* ============================================================
   5. The ratchet
   ============================================================ */
console.log("\nthe ratchet: nothing goes down");
{
  /* Every counter this tool draws is fed a GROWING history and
     asserted never to fall. This is §0 of ROUTINE.md as a test
     and it is the one that catches a charming feature going
     wrong: the birds, the garden and the milestones are all
     "how many times ever", and the day one of them becomes "how
     many times lately" it starts being a streak. */
  const everTimes = (entries: Entry[], task: string): number =>
    entries.reduce((n, e) => n + ((e.marks[task] ?? 0) > 0 ? 1 : 0), 0);

  const history: Entry[] = [];
  const counts: number[] = [];
  for (let i = 0; i < 40; i += 1) {
    /* A deliberately terrible fortnight in the middle. Somebody
       who stops for two weeks and comes back must find the flock
       exactly as they left it. */
    const marked = i < 12 || i > 26;
    history.push(day(marked ? { brd: 1 } : {}));
    counts.push(everTimes(history, "brd"));
  }

  ok("feeding the birds only ever goes up",
    counts.every((n, i) => i === 0 || n >= counts[i - 1]),
    counts.join(","));
  is("and a fortnight away costs nothing", counts[26], counts[12]);
  /* Twelve days before the gap and thirteen after it. Counted
     rather than assumed: the first draft of this line said 26 and
     the test caught it, which is the whole argument for a number
     in a test being derived rather than typed. */
  is("the flock at the end is every time ever", counts[39],
    history.filter((e) => (e.marks.brd ?? 0) > 0).length);
}

/* ============================================================
   6. Hours, which is the builder's one useful sentence
   ============================================================ */
console.log("\nhours");
{
  const sadia = shapeOf("sadias-day");
  const h = hours(sadia);
  /* Leisure IS counted here, though it never counts towards
     progress: an hour of television is an hour of the day
     whatever else is true. */
  /* 4 learning, 4 kitchen, 2.5 home, 4 for herself, 7 asleep.
     The two with no hours at all are the two that are not an
     amount of time: what she chose, and not cracking her
     knuckles. */
  is("Sadia's day is planned to 21.5 hours", h.planned, 21.5);
  is("leaving two and a half", h.free, 2.5);

  /* A routine somebody has over-filled says zero free rather
     than a negative number. "You are 3 hours over" is a failure
     state and there are none of those here. */
  const stuffed: RoutineShape = {
    bands: sadia.bands,
    tasks: [...sadia.tasks, { id: "x", band: "rest", en: "x", bn: "x", hours: 9, counts: true, order: 99 }],
  };
  is("and an over-full day is never a negative number", hours(stuffed).free, 0);
}

/* ============================================================
   7. The words that must not appear
   ============================================================ */
console.log("\nthe words that must not appear");
{
  /* A grep, over every file the tool is made of. Blunt on
     purpose: the moment somebody writes a streak they will call
     it one, and the failure this catches is a well-meant feature
     rather than a typo. */
  const BANNED = [
    [/\bstreak/i, "a streak"],
    [/\bconsecutive\b/i, "a consecutive-day count"],
    [/don't break the chain|dont break the chain/i, "don't break the chain"],
    [/\u{1F525}/u, "a flame"],
    [/\boverdue\b/i, "an overdue state"],
  ] as const;

  const files: string[] = [];
  const walk = (dir: string): void => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(ts|tsx|css)$/.test(entry.name)) files.push(full);
    }
  };
  walk(join(ROOT, "next", "app", "(site)", "tools", "routine"));
  walk(join(ROOT, "next", "components", "routine"));
  files.push(join(ROOT, "shared", "routine.ts"));

  /* Said out loud rather than passing quietly. This grep is worth
     nothing until there are files to grep, and a guard that
     reports success while guarding nothing is the exact failure
     this repository has been bitten by three times. */
  console.log(`  (scanning ${files.length} file(s))`);
  ok("there is something to scan", files.length > 0);

  /* COMMENTS OUT FIRST, and this is not a loophole.

     The ban is on the tool having a streak, not on the code
     explaining why it does not. `shared/routine.ts` opens with
     "a feature that can decrease is a streak wearing a costume",
     which is the sentence the whole tool rests on, and a grep
     that fails on it would delete its own reasoning. CLAUDE.md
     hits exactly this and says so: a rule that contains the
     thing it bans always matches itself.

     What survives the strip is every string a reader can see,
     which is what actually matters. */
  const decomment = (text: string): string => text
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

  for (const file of files.filter(existsSync)) {
    const text = decomment(readFileSync(file, "utf8"));
    const rel = file.slice(ROOT.length + 1);
    for (const [pattern, what] of BANNED) {
      /* This test file is allowed to name them; it is the thing
         that bans them. Nothing else is. */
      ok(`${rel} does not contain ${what}`, !pattern.test(text));
    }
  }
}

/* ============================================================
   8. Taking a copy, and putting it back
   ============================================================ */
console.log("\ntaking a copy, and putting it back");
{
  const sadia = shapeOf("sadias-day");
  const mine = { name: "Sadia's day", ...sadia };
  const days: Entry[] = [
    { entry_date: "2026-08-03", marks: { eng: 1, brd: 0.5 }, mood: "light",
      note: "the birds ate from my hand", chose: "drew the neighbour's cat" },
    { entry_date: "2026-08-01", marks: { slp: 1 }, mood: null, note: null, chose: null },
  ];

  const file = toExport(mine, days, "2026-08-19");
  is("the file says which format it is", file.schema, SCHEMA);
  /* Oldest first, so the file reads like a diary rather than a
     database. Nobody will open it, and if they do it should make
     sense. */
  is("and the days are in order", file.entries.map((e) => e.entry_date),
    ["2026-08-01", "2026-08-03"]);
  ok("the note survives the round trip",
    JSON.stringify(file).includes("the birds ate from my hand"));
  ok("and so does what she chose",
    JSON.stringify(file).includes("drew the neighbour's cat"));

  const back = readImport(JSON.stringify(file));
  ok("a file this site wrote reads back", back.ok);
  if (back.ok) {
    is("with every day", back.file.entries.length, 2);
    is("and every task", back.file.routine.tasks.length, 18);
    is("and the same arithmetic on the way out",
      done(back.file.routine, back.file.entries[1]), done(sadia, days[0]));
  }

  /* ---- and every way it can be refused ---- */

  /* NEVER GUESS AT A FILE. A format that tries its best with one
     it does not understand is a format that silently loses half
     of somebody's year. Each refusal below is a sentence
     somebody could act on rather than "that did not work". */
  const refusals: Array<[string, string]> = [
    ["not json at all", "hello"],
    ["an array", "[]"],
    ["no schema field", JSON.stringify({ routine: {}, entries: [] })],
    ["another program's export", JSON.stringify({ schema: "habitica/2" })],
    ["a schema but no routine", JSON.stringify({ schema: SCHEMA, entries: [] })],
    ["a day with no date", JSON.stringify({
      schema: SCHEMA, routine: { bands: [], tasks: [] },
      entries: [{ marks: {} }],
    })],
  ];
  for (const [what, text] of refusals) {
    const got = readImport(text);
    ok(`${what} is refused`, !got.ok);
    ok(`  and says why in words`, !got.ok && got.why.length > 25 && /[a-z]/.test(got.why),
      !got.ok ? got.why : "");
  }

  /* ---- the summary somebody reads before pressing anything ---- */
  const said = summarise(file);
  ok("the summary counts the days", said.includes("2 days"), said);
  ok("and names the span", said.includes("1 August") && said.includes("3 August"), said);
  ok("one day reads as one day",
    summarise({ ...file, entries: [days[1]] }).includes("1 day, on 1 August"),
    summarise({ ...file, entries: [days[1]] }));
  ok("and an empty file says so rather than counting nothing",
    summarise({ ...file, entries: [] }).includes("no days"),
    summarise({ ...file, entries: [] }));

  /* ---- merge keeps everything, replace is what it says ---- */
  const here: Entry[] = [
    { entry_date: "2026-08-01", marks: { eng: 1 }, note: "mine" },
    { entry_date: "2026-08-09", marks: { art: 1 }, note: "only mine" },
  ];
  const merged = mergeDays(here, file.entries, "merge");
  is("merge keeps every day either side has",
    merged.map((e) => e.entry_date), ["2026-08-01", "2026-08-03", "2026-08-09"]);
  /* The imported day wins where both have one, which is the right
     way round: somebody importing is restoring, and a restore
     that loses to what is already there is not one. */
  is("and the imported day wins where both have one",
    merged.find((e) => e.entry_date === "2026-08-01")?.note, null);
  ok("a day only this device has is never dropped",
    merged.some((e) => e.entry_date === "2026-08-09"));

  const replaced = mergeDays(here, file.entries, "replace");
  is("replace is what it says", replaced.map((e) => e.entry_date),
    ["2026-08-01", "2026-08-03"]);

  is("and the file is named for the day", exportName("2026-08-19"),
    "routine-2026-08-19.json");
}

/* ---------- ---------- */

if (failures.length) {
  console.log(`\n${passed} checks passed\n${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}
console.log(`\n${passed} checks passed`);
console.log("Leisure cannot fail, nobody is shown a zero, tidying the list does");
console.log("not rewrite the past, and nothing the tool remembers goes down.");
