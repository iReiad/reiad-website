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
  TEMPLATES, PRIVATE_TEMPLATES, FIRST_RUN, SCHEMA, done, hours, bandTasks,
  toExport, readImport, summarise, mergeDays, exportName,
  hoursDone, series, momentum, weekdays, bandRates, moodRibbon, runs,
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

/* Both lists, because `sadias-day` is not in `TEMPLATES` any
   more: it is one real person's day and it is served by
   `/api/routine/templates` behind `isAdmin()`. It stays in
   `shared/` and stays asserted here, because its hours are the
   arithmetic the whole tool is built on and a fixture would be a
   second copy of the numbers. */
const shapeOf = (slug: string): RoutineShape => {
  const t = [...TEMPLATES, ...PRIVATE_TEMPLATES].find((x) => x.slug === slug);
  if (!t) throw new Error(`no template ${slug}`);
  return t.data;
};

/** The day this whole file is written from. `day()` is a row on
    it, and every window in the dashboard sections below is
    measured back from it, so the two cannot drift apart. */
const TODAY = "2026-08-19";

const day = (marks: Record<string, number>): Entry =>
  ({ entry_date: TODAY, marks });

/* ============================================================
   1. The templates the site ships, and the one it does not
   ============================================================ */
console.log("\nthe templates");
{
  /* Two offered to everybody, and one that is not. Sadia's day
     is a real person's rather than a suggestion, so it lives in
     `PRIVATE_TEMPLATES` and reaches a browser only through
     `/api/routine/templates` behind `isAdmin()`. Counted
     separately here so that moving one between the lists fails
     this rather than passing quietly. */
  is("two offered to everybody", TEMPLATES.length, 2);
  is("and one that is not", PRIVATE_TEMPLATES.length, 1);
  ok("the private one is not in the public list",
    !TEMPLATES.some((t) => t.slug === "sadias-day"), "absent");
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

/* ============================================================
   The dashboard, and the two helpers the rest of it needs

   Everything above is one day's arithmetic. Everything below
   reads a stretch of days, so the window's edges are where the
   mistakes are, and every date under here is computed back from
   `TODAY` rather than typed out.
   ============================================================ */

/** `back(3)` is three days before `TODAY`, ISO and UTC. Pinned
    against a hand-checked date in section 10, so the windows
    asserted with it are not asserted against their own bug. */
const back = (n: number): string => {
  const d = new Date(`${TODAY}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};

/** One day of a history, `n` days ago. `day()` above is always
    today's, which is all the sections above it need. */
const on = (n: number, marks: Record<string, number>, mood: string | null = null): Entry =>
  ({ entry_date: back(n), marks, mood, note: null });

/* ============================================================
   9. Hours are hours, not ticks
   ============================================================ */
console.log("\nhours are hours, not ticks");
{
  const sadia = shapeOf("sadias-day");
  const plan = hoursDone(sadia, day({})).planned;

  /* Four hours of learning, four of the kitchen, two and a half
     of the house, seven asleep. The other four hours of the
     plan are the television, the story book and the hobby, and
     they are deliberately not in either half of this. */
  is("the counting half of Sadia's day is 17.5 hours", plan, 17.5);
  const leisure = sadia.tasks
    .filter((t) => !t.counts && !t.archived)
    .reduce((n, t) => n + (t.hours ?? 0), 0);
  /* Derived rather than typed, so the day somebody gives the
     hobby another half hour this still says what it means. */
  is("and the two halves are the whole of the plan",
    plan + leisure, hours(sadia).planned);

  /* An empty day has done no hours against a plan that was
     already true before anybody marked anything. This is the
     one pair in the tool that answers a number for an empty
     day, which is exactly why the page asks done() first and
     draws the sentence instead of a bar at nought. */
  is("an empty day has done nothing yet", hoursDone(sadia, day({})).done, 0);
  is("and the plan is still the plan", hoursDone(sadia, day({})).planned, 17.5);

  is("seven hours asleep is seven hours", hoursDone(sadia, day({ slp: 1 })).done, 7);
  /* A tick would have made this one thirteenth of a day. Half
     the two-hour dinner is an hour, which is the whole reason
     this function is not the tick count. */
  is("and half the dinner is an hour, not half a tick",
    hoursDone(sadia, day({ din: 0.5 })).done, 1);

  const all = day(Object.fromEntries(
    sadia.tasks.filter((t) => t.counts).map((t) => [t.id, 1])));
  is("a full day is the plan exactly", hoursDone(sadia, all).done, plan);

  /* Three and a half hours of leisure marked, and none of it
     reaches either half. In the numerator it would flatter a
     day spent watching television; in the denominator it is the
     day television becomes something a person can be short of. */
  const fun = hoursDone(sadia, day({ tv: 1, bok: 1, hob: 0.5, own: 1 }));
  is("leisure is no hours done", fun.done, 0);
  is("and no hours planned either", fun.planned, 17.5);

  /* Tidying the list moves today's plan. It cannot move the
     hours on a day already written, for the reason section 4
     gives about the percentage. */
  const tidied: RoutineShape = {
    bands: sadia.bands,
    tasks: sadia.tasks.map((t): Task => (t.id === "slp" ? { ...t, archived: true } : t)),
  };
  is("archiving the seven hours of sleep takes them out of the plan",
    hoursDone(tidied, day({})).planned, 10.5);
  is("and a mark on it is not hours done",
    hoursDone(tidied, day({ slp: 1 })).done, 0);
}

/* ============================================================
   10. A line with gaps in it, and a trend that cannot punish
   ============================================================ */
console.log("\na line with gaps in it, and a trend that cannot punish");
{
  const sadia = shapeOf("sadias-day");
  is("three days before today is the sixteenth", back(3), "2026-08-16");

  /* Four kinds of day in five: marked, a row with nothing
     ticked on it, a row with nothing but leisure, and no row at
     all. Only the first two of the five are days this tool has
     anything to say about. */
  const week: Entry[] = [
    on(0, { eng: 1 }),
    on(1, {}),
    on(2, { tv: 1, bok: 1 }),
    on(4, { eng: 1, art: 1 }),
  ];
  const line = series(sadia, week, TODAY, 5);
  is("one point per day", line.length, 5);
  is("oldest first, so the chart reads forwards",
    line.map((p) => p.date), [back(4), back(3), back(2), back(1), back(0)]);

  /* THE PROPERTY THE WHOLE PANEL RESTS ON. All three kinds of
     unmarked day are null, which a chart draws as a gap. A zero
     would be a cliff on the days somebody was busy, and a cliff
     is the picture this tool exists not to draw. */
  is("a row with nothing ticked is a gap", line[3].value, null);
  is("a row with nothing but leisure is a gap", line[2].value, null);
  is("and a day with no row at all is a gap", line[1].value, null);
  ok("no point on the line is a zero", line.every((p) => p.value !== 0),
    JSON.stringify(line.map((p) => p.value)));
  is("a marked day is its own fraction", line[4].value, 1 / 13);
  is("and a fuller day is fuller", line[0].value, 2 / 13);

  /* ---- the trend, which is two windows and no arrow ---- */

  const empty = momentum(sadia, [], TODAY);
  is("an empty history is not a division by zero", empty.now, 0);
  ok("and both numbers are numbers",
    Number.isFinite(empty.now) && Number.isFinite(empty.before), JSON.stringify(empty));
  is("with nothing marked, said out loud", empty.marked, 0);
  /* The window travels with the answer so a component can write
     "over 28 days" without keeping a second copy of the number,
     which is the failure check-content.ts exists for. */
  is("and the window travels beside them", empty.days, 28);

  const four = [on(0, { eng: 1 }), on(1, { eng: 1 }), on(20, { eng: 1 }), on(21, { eng: 1 })];
  const m = momentum(sadia, four, TODAY);
  is("the mean is over the days that were marked", m.now, 1 / 13);
  is("and it says how many those were", m.marked, 4);

  /* A fortnight of rows with nothing on them, which is what a
     page writes when somebody opens a day and closes it. A mean
     over calendar days would have fallen to a fifth of this, so
     somebody ill for two weeks would open the page and be shown
     a decline. */
  const padded = [...four, ...Array.from({ length: 14 }, (_, i) => on(i + 2, {}))];
  is("a fortnight of empty days moves nothing",
    momentum(sadia, padded, TODAY).now, m.now);
  is("and does not change how many were marked",
    momentum(sadia, padded, TODAY).marked, m.marked);

  /* The boundary between the two windows, exactly. Twenty-seven
     days back is the oldest day of the current 28; twenty-eight
     is the newest day of the one before it. Off by one here
     shows somebody the same fortnight twice and calls it a
     trend. */
  const edge = momentum(sadia, [on(27, { eng: 1 }), on(28, { eng: 1, art: 1 })], TODAY);
  is("the current window reaches 27 days back", edge.marked, 1);
  is("and the day before that is in the window before", edge.before, 2 / 13);
  is("which is not the same window counted twice", edge.now, 1 / 13);
  /* Both halves are the same length, which is what makes a
     quiet fortnight a smaller number rather than a broken
     anything. */
  is("and the two halves are the same length", edge.days, 28);

  const short = momentum(sadia, four, TODAY, 7);
  is("a shorter window says which one it is", short.days, 7);
  is("and holds only the days inside it", short.marked, 2);
}

/* ============================================================
   11. Seven weekdays, and a bar per band
   ============================================================ */
console.log("\nseven weekdays, and a bar per band");
{
  const sadia = shapeOf("sadias-day");

  const none = weekdays(sadia, [], TODAY);
  is("seven, whatever the history says", none.length, 7);
  is("in week order, Sunday first", none.map((x) => x.day), [0, 1, 2, 3, 4, 5, 6]);
  is("named in English",
    none.map((x) => x.en), ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  is("and Sunday is রবিবার, because the Bengali week starts there too",
    none[0].bn, "রবিবার");
  ok("all seven in Bangla", none.every((x) => x.bn.endsWith("বার")),
    none.map((x) => x.bn).join(" "));
  /* A weekday with nothing marked is still in the list. A chart
     with a missing bar has lost a day, and a reader cannot tell
     an absent Wednesday from a bad one. */
  ok("a week with nothing in it is still seven days",
    none.every((x) => x.marked === 0 && x.rate === 0));

  /* Derived from getUTCDay() rather than typed, because `day`
     IS that numbering: this is the assertion that Sunday's bar
     cannot draw Monday's figure. */
  const dow = new Date(`${TODAY}T12:00:00Z`).getUTCDay();
  const two = weekdays(sadia, [on(0, { eng: 1 }), on(7, { eng: 1, art: 1, mth: 1 })], TODAY);
  is("today and a week ago land on the same weekday", two[dow].marked, 2);
  is("whose rate is the mean of the two", two[dow].rate, (1 / 13 + 3 / 13) / 2);
  is("and the other six hold nothing",
    two.filter((x) => x.day !== dow).reduce((n, x) => n + x.marked, 0), 0);

  /* Twelve weeks by default, so thirteen weeks back is outside
     it and a caller can say otherwise. */
  is("the window is twelve weeks",
    weekdays(sadia, [on(91, { eng: 1 })], TODAY)[dow].marked, 0);
  is("and a wider one reaches further back",
    weekdays(sadia, [on(91, { eng: 1 })], TODAY, 120)[dow].marked, 1);

  /* ---- a bar per band ---- */

  const days = [on(0, { eng: 1, art: 1, din: 1 }), on(1, { eng: 1 })];
  const rates = bandRates(sadia, days, TODAY);
  is("one per band, in the band's own order",
    rates.map((r) => r.id), ["learn", "kitch", "home", "mine", "rest", "kind"]);
  is("each saying how many of its tasks are live",
    rates.find((r) => r.id === "learn")?.tasks, 4);
  /* Two of the four on one day, one of the four on the other. */
  is("a band's rate is its own tasks over its own days",
    rates.find((r) => r.id === "learn")?.rate, (0.5 + 0.25) / 2);
  is("counted over the days it was touched",
    rates.find((r) => r.id === "learn")?.marked, 2);
  is("the kitchen was cooked once, and that once was the dinner",
    rates.find((r) => r.id === "kitch")?.rate, 1 / 3);
  /* A band nobody has touched is nothing yet rather than
     nothing done, and the two are told apart by the count
     beside the rate rather than by the rate alone. */
  is("and a band nobody touched has no days rather than a bad rate",
    [rates.find((r) => r.id === "home")?.rate,
      rates.find((r) => r.id === "home")?.marked], [0, 0]);

  /* The gentle habit is one task. Archiving it takes the band
     off the chart rather than drawing an empty bar for a band
     that has nothing left in it. */
  const tidied: RoutineShape = {
    bands: sadia.bands,
    tasks: sadia.tasks.map((t): Task => (t.band === "kind" ? { ...t, archived: true } : t)),
  };
  const after = bandRates(tidied, days, TODAY);
  ok("a band whose tasks are all archived is not a bar",
    !after.some((r) => r.id === "kind"), after.map((r) => r.id).join(","));
  is("and every band that still has one is still there",
    after.length, rates.length - 1);
  ok("the band itself is untouched, the way an archived task is",
    tidied.bands.some((b) => b.id === "kind"));

  /* Leisure is a band like the others here, because this says
     where a day went rather than scoring it. What it cannot do
     is turn a day of nothing but leisure into anybody's mean:
     done() answers null for that day and done() is the gate. */
  const funOnly = bandRates(sadia, [on(0, { tv: 1, bok: 1 })], TODAY);
  is("a day of nothing but television is in no band's mean",
    funOnly.find((r) => r.id === "mine")?.marked, 0);
  const mixed = bandRates(sadia, [on(0, { eng: 1, tv: 1, bok: 1 })], TODAY);
  is("and on a day that counts, leisure is a band like the others",
    mixed.find((r) => r.id === "mine")?.rate, 0.5);
}

/* ============================================================
   12. The ribbon, and a run nothing is hung on
   ============================================================ */
console.log("\nthe ribbon, and a run nothing is hung on");
{
  const sadia = shapeOf("sadias-day");
  const week: Entry[] = [
    on(0, { eng: 1 }, "light"),
    on(1, {}, ""),
    on(3, { art: 1 }, "heavy"),
  ];
  const ribbon = moodRibbon(week, TODAY, 5);
  is("one square per day", ribbon.length, 5);
  /* The same walk as the line, so the two are drawn on one date
     axis. Two windows of different lengths stacked would line
     up wrongly and read as a pattern that is not there. */
  is("on the same date axis as the line",
    ribbon.map((r) => r.date), series(sadia, week, TODAY, 5).map((p) => p.date));
  is("a day with no row has no mood", ribbon[0].mood, null);
  is("nor does a day whose mood was never chosen", ribbon[3].mood, null);
  is("a day with one carries it", ribbon[4].mood, "light");
  is("and so does one further down the ribbon", ribbon[1].mood, "heavy");
  /* NO CORRELATION IS EVER PRINTED, which is ROUTINE.md §6.2. A
     number arriving in this shape is how that would start, so
     the shape itself is the assertion. */
  ok("and nothing on the ribbon is a number",
    ribbon.every((r) => Object.keys(r).join() === "date,mood"),
    JSON.stringify(ribbon[0]));

  /* ---- runs, which are a fact about the past ---- */

  const five = [0, 1, 2, 3, 4].map((n) => on(n, { eng: 1 }));
  is("five days in a row is a run of five", runs(five, TODAY), { now: 5, best: 5 });

  /* Five days, three days off, three days. Nothing was lost in
     the middle: the best of it is still the best of it, which
     is the difference between a fact and a thing to protect. */
  const broken = [10, 9, 8, 7, 6, 2, 1, 0].map((n) => on(n, { eng: 1 }));
  const r = runs(broken, TODAY);
  is("a break does not take the best run away", r.best, 5);
  is("and the current one is simply what it is", r.now, 3);
  ok("the best is never below the current", r.best >= r.now, JSON.stringify(r));

  /* TODAY IS NOT OVER. A run that ended yesterday is still the
     current one, because the alternative is a number that drops
     to nought at midnight and climbs back at nine in the
     morning, which is a thing to be broken however carefully it
     is worded. */
  is("a run that ended yesterday is still the current one",
    runs([1, 2, 3].map((n) => on(n, { eng: 1 })), TODAY).now, 3);
  is("one that ended the day before is not",
    runs([2, 3, 4].map((n) => on(n, { eng: 1 })), TODAY).now, 0);
  is("though the best of it is still there",
    runs([2, 3, 4].map((n) => on(n, { eng: 1 })), TODAY).best, 3);

  /* A row is not a mark. Unticking DELETES the key rather than
     writing a zero, so a row can hold nothing but a note, and a
     day like that is not a day somebody marked. */
  is("a row with nothing ticked on it is not a day marked",
    runs([on(0, {}), on(1, { eng: 1 }), on(2, { eng: 1 })], TODAY).now, 2);
  is("and neither is a row of zeroes",
    runs([on(0, { eng: 0, art: 0 }), on(1, { eng: 1 })], TODAY).now, 1);

  /* The ratchet again, for the one number here that could be
     mistaken for something to protect. A history only ever
     grows, and `best` only ever grows with it. */
  const growing: Entry[] = [];
  const bests: number[] = [];
  for (let i = 40; i >= 0; i -= 1) {
    if (i !== 20 && i !== 19) growing.push(on(i, { eng: 1 }));
    bests.push(runs(growing, TODAY).best);
  }
  ok("the best run only ever goes up",
    bests.every((n, i) => i === 0 || n >= bests[i - 1]), bests.join(","));
  /* Twenty days before the two off, nineteen after. Counted
     rather than assumed, for the reason section 5 gives. */
  is("and two days away cost nothing", bests[bests.length - 1], 20);
  is("which is the longer of the two stretches", runs(growing, TODAY).now, 19);
}

/* ============================================================
   13. An unmarked day is a gap in every one of them
   ============================================================ */
console.log("\nan unmarked day is a gap in every one of them");
{
  /* The property the whole dashboard rests on, asserted across
     all four windowed functions at once rather than one at a
     time: adding EMPTY rows to a history changes nothing
     anywhere. There are more of those in a real year than there
     are of any other kind of day, and the day one of these
     starts dividing by the calendar rather than by the days
     somebody marked, this is what fails. */
  const sadia = shapeOf("sadias-day");
  const sparse: Entry[] = [
    on(0, { eng: 1, brd: 1 }), on(6, { art: 1 }), on(13, { eng: 1, din: 1 }),
  ];
  const padded: Entry[] = [...sparse];
  for (let i = 1; i <= 60; i += 1) {
    if (!sparse.some((e) => e.entry_date === back(i))) padded.push(on(i, {}));
  }

  const whole = (entries: Entry[]): string => JSON.stringify([
    series(sadia, entries, TODAY, 30),
    momentum(sadia, entries, TODAY),
    weekdays(sadia, entries, TODAY),
    bandRates(sadia, entries, TODAY),
  ]);
  ok("sixty empty rows change nothing in any of them",
    whole(sparse) === whole(padded));
  /* The same again for a day with only leisure on it, which
     done() also answers null for, so there is one definition of
     empty here rather than two that have to agree. */
  ok("and neither does a day of nothing but television",
    whole(sparse) === whole([...sparse, on(3, { tv: 1, bok: 1, hob: 1 })]));

  /* Which is not the same as seeing nothing. The three real
     days are in all of it. */
  is("the days that were marked are all there",
    momentum(sadia, padded, TODAY).marked, 3);
  is("and the line still has a point for every day",
    series(sadia, padded, TODAY, 30).length, 30);
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
console.log("An unmarked day is a gap in every panel of the dashboard, never a nought.");
