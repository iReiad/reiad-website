/* ============================================================
   routine.ts: what a routine is, and the one calculation.

   `ROUTINE.md` is the plan. This is the half more than one
   runtime has to agree about: the shapes, the three templates
   the site ships, and `done()`, which is the only arithmetic in
   the tool and therefore the only thing that can disagree with
   itself.

   ---- the rule under all of it ----

   NOTHING THIS TOOL REMEMBERS ABOUT SOMEBODY EVER GOES DOWN.

   It is a gift rather than a productivity tool, and that is not
   decoration: it is why there is no streak here, no target, and
   nothing that can be failed. A feature that can decrease is a
   streak wearing a costume. Check any new one against that
   sentence before writing it.

   ---- why the arithmetic is here and not in a component ----

   Four places want it: the day, the year's heatmap, the print
   view and the account's one-line summary. Four copies of "sum
   the marks on counting tasks over the number of counting tasks"
   is four chances for one of them to include leisure, and the
   day leisure enters the arithmetic is the day a person can fail
   at watching television.

   `counts: false` means TRACKED AND EXCLUDED. Not lesser, not
   optional: excluded. `done()` is where that is true, once.
   ============================================================ */

/** A group of tasks: a heading, a colour, an order.

    The colour becomes `--accent` on the elements inside the band,
    which is how a school's colour already works on this site, so
    the cards, chips, meters and focus rings inside a band follow
    it without one of them naming a colour. */
export interface Band {
  id: string;
  en: string;
  bn: string;
  /** A hex value, because it is data rather than a token: a
      reader can change it in the builder and there is no
      stylesheet to edit when they do. */
  colour: string;
  order: number;
}

/** One thing you might do in a day. */
export interface Task {
  id: string;
  band: string;
  en: string;
  bn: string;
  /** Roughly how long, for the planned-hours line in the builder.
      Absent for a task that has no sensible length: "something I
      chose" and "went easy on my knuckles" are both real and
      neither is an hour. */
  hours?: number;
  /** Whether it enters the arithmetic at all. `false` means
      tracked and excluded: leisure must never be able to fail. */
  counts: boolean;
  order: number;
  /** Deleted, and kept. Ids are never reused and never removed,
      because an entry keys its marks by id and a person tidying
      their list must not lose the days they marked it on. */
  archived?: boolean;
}

export interface RoutineShape {
  bands: Band[];
  tasks: Task[];
}

/** A day. `marks` is `{ [task id]: 1 | 0.5 }` and an absent key
    is not a zero, it is a day that has nothing to say about that
    task. The difference matters: a zero is a judgement wearing a
    number's clothes. */
export interface Entry {
  entry_date: string;
  marks: Record<string, number>;
  mood?: string | null;
  note?: string | null;
  /** What "something I chose" actually was. */
  chose?: string | null;
}

/**
 * How much of a day was marked, as a fraction from 0 to 1, or
 * `null` for a day with nothing on it.
 *
 * NULL RATHER THAN ZERO, and that is the whole reason this
 * returns a union. An empty day must render as "today is still
 * empty" and not as "0%": the number describes what happened, and
 * on a day where nothing happened there is nothing to describe.
 * Somebody opening yesterday should not be told they scored
 * nothing.
 *
 * Half counts as a half rather than as a lesser kind of nothing.
 */
export function done(shape: RoutineShape, entry: Entry | null | undefined): number | null {
  const counting = shape.tasks.filter((t) => t.counts && !t.archived);
  if (counting.length === 0) return null;

  const marks = entry?.marks ?? {};
  /* Only the counting ones, and only the ones still on the list.
     A mark on an ARCHIVED task stays in the row for ever and
     renders on the day it was made, and it does not move today's
     figure: a person who tidied their list should not find
     yesterday's percentage changed. */
  let sum = 0;
  let any = false;
  for (const t of counting) {
    const m = marks[t.id];
    if (typeof m !== "number" || m <= 0) continue;
    any = true;
    sum += Math.min(1, m);
  }
  /* A day with only leisure marked is not empty, but it has
     nothing this arithmetic can describe, so it answers null too
     and the page says so in words. Both roads lead to null on
     purpose: there is no state in which somebody is shown a zero.
     Writing that as one branch rather than two, because a
     ternary whose arms agree reads as a decision that was made
     and it is the opposite. */
  if (!any) return null;
  return sum / counting.length;
}

/** The tasks of one band, in order, archived ones left out. */
export const bandTasks = (shape: RoutineShape, band: string): Task[] =>
  shape.tasks
    .filter((t) => t.band === band && !t.archived)
    .sort((a, b) => a.order - b.order);

/** Hours the routine plans for, and what is left of a day.

    Live in the builder, and the most useful thing one can say
    while somebody is adding a seventh task. Leisure is counted
    here even though it never counts towards progress: an hour of
    television is an hour of the day whatever else is true. */
export function hours(shape: RoutineShape): { planned: number; free: number } {
  const planned = shape.tasks
    .filter((t) => !t.archived)
    .reduce((n, t) => n + (t.hours ?? 0), 0);
  return { planned, free: Math.max(0, 24 - planned) };
}

/* ============================================================
   The three the site ships
   ============================================================ */

const BANDS: Band[] = [
  { id: "learn", en: "Learning", bn: "পড়াশোনা", colour: "#6E52A8", order: 1 },
  { id: "kitch", en: "Kitchen", bn: "রান্নাঘর", colour: "#C4711F", order: 2 },
  { id: "home", en: "Home & me", bn: "ঘর ও নিজের যত্ন", colour: "#2F8A64", order: 3 },
  { id: "mine", en: "Just for me", bn: "শুধু আমার জন্য", colour: "#A2790B", order: 4 },
  { id: "rest", en: "Rest", bn: "বিশ্রাম", colour: "#4C61A8", order: 5 },
  { id: "kind", en: "Gentle habit", bn: "ছোট্ট অভ্যাস", colour: "#B45570", order: 6 },
];

/** Sadia's day: six bands, eighteen tasks, thirteen that count.

    The five under "Just for me" and the one gentle habit do not
    count, which is the shape of the whole thing: a third of this
    list exists to be enjoyed rather than achieved. */
const SADIA: Task[] = [
  { id: "eng", band: "learn", en: "English + German", bn: "ইংরেজি + জার্মান", hours: 1, counts: true, order: 1 },
  { id: "art", band: "learn", en: "Art + Music", bn: "আর্ট + গান", hours: 1, counts: true, order: 2 },
  { id: "mth", band: "learn", en: "Maths or Programming", bn: "গণিত অথবা প্রোগ্রামিং", hours: 1, counts: true, order: 3 },
  { id: "qur", band: "learn", en: "Quran, revise and new", bn: "কুরআন, রিভিশন ও নতুন", hours: 1, counts: true, order: 4 },

  { id: "brk", band: "kitch", en: "Morning snack", bn: "সকালের নাস্তা", hours: 1, counts: true, order: 5 },
  { id: "eve", band: "kitch", en: "Evening snack", bn: "সন্ধ্যার নাস্তা", hours: 1, counts: true, order: 6 },
  { id: "din", band: "kitch", en: "Dinner", bn: "রাতের রান্না", hours: 2, counts: true, order: 7 },

  { id: "sho", band: "home", en: "Shower", bn: "গোসল", hours: 0.5, counts: true, order: 8 },
  { id: "lau", band: "home", en: "Laundry", bn: "কাপড় ধোয়া", hours: 0.75, counts: true, order: 9 },
  { id: "tid", band: "home", en: "Tidy my room", bn: "ঘর গুছানো", hours: 0.75, counts: true, order: 10 },
  { id: "brd", band: "home", en: "Feed the birds", bn: "পাখির খাবার", hours: 0.25, counts: true, order: 11 },
  { id: "pln", band: "home", en: "Water the plants", bn: "গাছে পানি দেওয়া", hours: 0.25, counts: true, order: 12 },

  { id: "tv", band: "mine", en: "TV", bn: "টিভি", hours: 1.5, counts: false, order: 13 },
  { id: "bok", band: "mine", en: "Story book", bn: "গল্পের বই", hours: 1, counts: false, order: 14 },
  { id: "hob", band: "mine", en: "Hobby", bn: "হবি", hours: 1.5, counts: false, order: 15 },
  /* No hours, deliberately. Whatever she chose took as long as it
     took, and `chose` on the entry is where she says what it was. */
  { id: "own", band: "mine", en: "Something I chose", bn: "আমার নিজের পছন্দ", counts: false, order: 16 },

  { id: "slp", band: "rest", en: "Sleep and day nap", bn: "ঘুম ও দিনের ঘুম", hours: 7, counts: true, order: 17 },

  /* A gentle habit is the one thing here that is about NOT doing
     something, so it has no hours and does not count. On the days
     it is not marked the page says nothing at all. */
  { id: "knk", band: "kind", en: "Went easy on my knuckles", bn: "আঙুল ফোটানো হয়নি", counts: false, order: 18 },
];

/** Six generic things, for a first run that is not a wall of
    somebody else's life. */
const SIMPLE: Task[] = [
  { id: "move", band: "day", en: "Moved my body", bn: "শরীরটা নাড়ালাম", hours: 0.5, counts: true, order: 1 },
  { id: "eat", band: "day", en: "Ate something good", bn: "ভালো কিছু খেলাম", hours: 1, counts: true, order: 2 },
  { id: "sleep", band: "day", en: "Slept enough", bn: "ঠিকমতো ঘুমালাম", hours: 7, counts: true, order: 3 },
  { id: "learn", band: "day", en: "Learned something", bn: "নতুন কিছু শিখলাম", hours: 1, counts: true, order: 4 },
  { id: "tidy", band: "day", en: "Tidied one thing", bn: "একটা জিনিস গুছালাম", hours: 0.25, counts: true, order: 5 },
  { id: "good", band: "day", en: "One good thing", bn: "একটা ভালো কিছু", counts: false, order: 6 },
];

export interface Template {
  slug: string;
  name: string;
  description: string;
  data: RoutineShape;
}

/**
 * What the site ships, as `owner_id is null` rows.
 *
 * Loading one always COPIES it. Editing your routine must never
 * reach back into the template, which is the whole reason
 * `routines` and `routine_templates` are two tables holding the
 * same shape.
 */
export const TEMPLATES: Template[] = [
  {
    slug: "a-simple-day",
    name: "A simple day",
    description: "Six things, and none of them anybody else's idea of a good day.",
    data: {
      bands: [{ id: "day", en: "My day", bn: "আমার দিন", colour: "#2F8A64", order: 1 }],
      tasks: SIMPLE,
    },
  },
  {
    slug: "blank",
    name: "Blank",
    description: "One band, no tasks. Start from nothing.",
    data: {
      bands: [{ id: "day", en: "My day", bn: "আমার দিন", colour: "#2F8A64", order: 1 }],
      tasks: [],
    },
  },
];

/**
 * The one that is somebody's, and is not the site's to hand out.
 *
 * It is a real person's day rather than a suggestion, so it is
 * offered to an admin and to nobody else. It is NOT in `TEMPLATES`
 * above, which is the list every reader is shown, and the gate is
 * not a filter in a component: `GET /api/routine/templates` in
 * the Worker answers this list when `isAdmin()` says yes and an
 * empty one otherwise, so a reader who is not an admin is never
 * told there is something they cannot have.
 *
 * `check-courses.ts` fails on anything under `next/` importing
 * this by value, for the reason it already fails on the course
 * catalogue: an import would put it in a bundle anybody can
 * fetch and the page would look identical.
 */
export const PRIVATE_TEMPLATES: Template[] = [
  {
    slug: "sadias-day",
    name: "Sadia's day",
    description: "A full home day: study, kitchen, plants and birds, "
      + "time that's yours, and rest.",
    data: { bands: BANDS, tasks: SADIA },
  },
];

/** What a new account gets on its first visit, copied in.

    `A simple day` and not Sadia's, deliberately: a first run
    should not be a wall of somebody else's life, which is the
    spec's own phrase and the right one. */
export const FIRST_RUN = "a-simple-day";

/* ============================================================
   Taking a copy, and putting it back
   ============================================================ */

/** The one version this site writes and the only one it reads.

    A file with anything else in this field is REFUSED rather than
    guessed at. That is the whole point of the field: a format
    that tries its best with a file it does not understand is a
    format that silently loses half of somebody's year. */
export const SCHEMA = "reiad.routine/1";

export interface ExportFile {
  schema: string;
  exported_at: string;
  routine: { name: string } & RoutineShape;
  entries: Entry[];
}

/** Everything, as one file.

    `exported_at` is passed in rather than read from the clock,
    because a function that reads the clock cannot be tested
    against a fixed string and this is the file somebody's whole
    year comes back out of. */
export function toExport(
  routine: { name: string } & RoutineShape,
  entries: Entry[],
  when: string,
): ExportFile {
  return {
    schema: SCHEMA,
    exported_at: when,
    routine: { name: routine.name, bands: routine.bands, tasks: routine.tasks },
    /* Oldest first, so the file reads like a diary rather than
       like a database. Nobody will ever open it, and if they do
       it should make sense. */
    entries: [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date)),
  };
}

export type ReadResult =
  | { ok: true; file: ExportFile }
  | { ok: false; why: string };

/**
 * A file somebody chose, read carefully.
 *
 * NEVER TRUST IT, and say why rather than throwing: this is the
 * one place a reader hands the site something and the site has to
 * explain itself in words they can act on. "That did not work" is
 * not an error message.
 *
 * Every failure below is a sentence somebody could fix.
 */
export function readImport(text: string): ReadResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, why: "That file is not JSON. A routine export is a .json file." };
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, why: "That file does not hold a routine." };
  }

  const file = raw as Record<string, unknown>;
  if (typeof file.schema !== "string") {
    return { ok: false, why: "That file does not say what it is, so it is not a routine export." };
  }
  if (file.schema !== SCHEMA) {
    return {
      ok: false,
      why: `That file says it is "${file.schema}" and this reads "${SCHEMA}". `
        + "Nothing was changed.",
    };
  }

  const routine = file.routine as Record<string, unknown> | undefined;
  if (!routine || !Array.isArray(routine.tasks) || !Array.isArray(routine.bands)) {
    return { ok: false, why: "That file has no routine in it." };
  }

  const entries = Array.isArray(file.entries) ? file.entries : [];
  /* A date that is not a date would land in the database as one
     and come back as an empty day for ever. Checked here, where
     it can still be explained. */
  const bad = (entries as Entry[]).find(
    (e) => !e || typeof e.entry_date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e.entry_date),
  );
  if (bad) {
    return { ok: false, why: "One of the days in that file has no date on it." };
  }

  return {
    ok: true,
    file: {
      schema: SCHEMA,
      exported_at: String(file.exported_at ?? ""),
      routine: {
        name: String(routine.name ?? "Imported routine"),
        bands: routine.bands as Band[],
        tasks: routine.tasks as Task[],
      },
      entries: (entries as Entry[]).map((e) => ({
        entry_date: e.entry_date,
        marks: (e.marks && typeof e.marks === "object") ? e.marks : {},
        mood: e.mood ?? null,
        note: e.note ?? null,
        chose: e.chose ?? null,
      })),
    },
  };
}

/**
 * What is in a file, in one sentence, BEFORE anything is written.
 *
 * The spec asks for this and it is the difference between an
 * import and a leap: nobody should press Replace everything
 * without being told what everything is about to become.
 */
export function summarise(file: ExportFile): string {
  const n = file.entries.length;
  if (n === 0) return `This file has 1 routine and no days in it.`;
  const dates = file.entries.map((e) => e.entry_date).sort();
  const day = (iso: string) => new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "long", timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
  const from = day(dates[0]);
  const to = day(dates[dates.length - 1]);
  const days = n === 1 ? "1 day" : `${n} days`;
  return from === to
    ? `This file has 1 routine and ${days}, on ${from}.`
    : `This file has 1 routine and ${days}, from ${from} to ${to}.`;
}

/**
 * Two sets of days, one answer.
 *
 * `replace` is what it says. `merge` keeps everything and lets
 * the imported day win where both have one, which is the spec's
 * rule and the right way round: somebody importing is restoring,
 * and a restore that loses to what is already there is not one.
 *
 * NOTHING IS EVER DROPPED SILENTLY in either mode. Replace is
 * destructive and the interface says so twice before it happens;
 * merge cannot lose a day at all.
 */
export function mergeDays(
  mine: Entry[], theirs: Entry[], how: "merge" | "replace",
): Entry[] {
  if (how === "replace") {
    return [...theirs].sort((a, b) => a.entry_date.localeCompare(b.entry_date));
  }
  const by = new Map<string, Entry>();
  for (const e of mine) by.set(e.entry_date, e);
  for (const e of theirs) by.set(e.entry_date, e);
  return [...by.values()].sort((a, b) => a.entry_date.localeCompare(b.entry_date));
}

/** `routine-2026-08-19.json`. */
export const exportName = (day: string): string => `routine-${day}.json`;

/* ============================================================
   The year: what a stretch of days has to say

   Every function below obeys ROUTINE.md §0. None of them has a
   "current" anything, none resets, and none can go down when the
   history grows. If a `since` argument ever appears in the three
   counters, that is the moment this stopped being a gift.
   ============================================================ */

/** One cell of the heatmap.

    `fraction` is `null` for a day with nothing on it, which the
    drawing renders as PAPER rather than as an empty slot: an
    unmarked day is not a hole and must not read as one. */
export interface Cell {
  date: string;
  fraction: number | null;
  mood: string | null;
}

/** The last `weeks` weeks, oldest first, one cell per day.

    `today` is passed in rather than read from the clock, for the
    reason `toExport` gives: a function that reads the clock
    cannot be tested. */
export function heat(
  shape: RoutineShape, entries: Entry[], today: string, weeks = 12,
): Cell[] {
  const by = new Map(entries.map((e) => [e.entry_date, e]));
  const out: Cell[] = [];
  const end = new Date(`${today}T12:00:00Z`);
  for (let i = weeks * 7 - 1; i >= 0; i -= 1) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    const date = d.toISOString().slice(0, 10);
    const entry = by.get(date);
    out.push({ date, fraction: done(shape, entry), mood: entry?.mood ?? null });
  }
  return out;
}

export interface TaskTally {
  task: Task;
  marked: number;
  of: number;
}

/**
 * How often each task was marked over the last `days` days.
 *
 * The most actionable panel in the tool: it shows which parts of
 * a routine are real and which were aspirational. Sorted by
 * frequency, and the tasks at the BOTTOM are the point.
 */
export function consistency(
  shape: RoutineShape, entries: Entry[], today: string, days = 28,
): TaskTally[] {
  const from = new Date(`${today}T12:00:00Z`);
  from.setUTCDate(from.getUTCDate() - (days - 1));
  const since = from.toISOString().slice(0, 10);
  const window = entries.filter((e) => e.entry_date >= since && e.entry_date <= today);

  return shape.tasks
    .filter((t) => !t.archived)
    .map((task) => ({
      task,
      marked: window.filter((e) => (e.marks[task.id] ?? 0) > 0).length,
      of: days,
    }))
    .sort((a, b) => b.marked - a.marked || a.task.order - b.task.order);
}

/**
 * The tasks never marked, ever.
 *
 * THE MOST IMPORTANT FEATURE IN THE TOOL, and it is four lines. A
 * routine full of aspirational tasks is what makes a tracker feel
 * bad, and the fix is taking them out rather than trying harder.
 * The interface lists them with an Archive beside each and says
 * nothing else: no nagging, no count, no suggestion that they
 * ought to have been done.
 */
export function neverMarked(shape: RoutineShape, entries: Entry[]): Task[] {
  const seen = new Set<string>();
  for (const e of entries) {
    for (const [id, m] of Object.entries(e.marks)) if (m > 0) seen.add(id);
  }
  return shape.tasks.filter((t) => !t.archived && !seen.has(t.id));
}

/**
 * What has changed, factually.
 *
 * In place of a streak: "marked on 11 of the last 14 days, and 4
 * of the 14 before that". Two numbers, no arrow, no colour, no
 * verdict. It is the honest version of what streaks reach for,
 * and it CANNOT punish anybody: both halves are the same length,
 * so a quiet fortnight makes a smaller number rather than a
 * broken chain.
 */
export function changed(
  entries: Entry[], taskId: string, today: string, window = 14,
): { now: number; before: number; of: number } {
  const at = (back: number): string => {
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - back);
    return d.toISOString().slice(0, 10);
  };
  const count = (from: string, to: string): number => entries.filter(
    (e) => e.entry_date >= from && e.entry_date <= to && (e.marks[taskId] ?? 0) > 0,
  ).length;
  return {
    now: count(at(window - 1), today),
    before: count(at(window * 2 - 1), at(window)),
    of: window,
  };
}

/** How a typical day divides across the bands, as fractions that
    sum to 1. Empty where there is nothing yet. */
export function balance(
  shape: RoutineShape, entries: Entry[],
): Array<{ band: Band; share: number }> {
  const per = new Map<string, number>();
  let all = 0;
  for (const e of entries) {
    for (const [id, m] of Object.entries(e.marks)) {
      if (!(m > 0)) continue;
      const task = shape.tasks.find((t) => t.id === id);
      if (!task) continue;
      per.set(task.band, (per.get(task.band) ?? 0) + m);
      all += m;
    }
  }
  if (all === 0) return [];
  return [...shape.bands]
    .sort((a, b) => a.order - b.order)
    .map((band) => ({ band, share: (per.get(band.id) ?? 0) / all }))
    .filter((x) => x.share > 0);
}

/* ============================================================
   The things that only ever grow
   ============================================================ */

/**
 * How many times a task has been marked, ever.
 *
 * The birds and the garden are this number. No window, no
 * "recently", no reset: a person who stops for a fortnight and
 * comes back finds the flock exactly as they left it. That is
 * §0, and `scripts/routine.test.ts` feeds this a history with a
 * dead fortnight in it and asserts it never falls.
 */
export const everMarked = (entries: Entry[], taskId: string): number =>
  entries.filter((e) => (e.marks[taskId] ?? 0) > 0).length;

/**
 * The two task ids the drawings hang on.
 *
 * `brd` and `pln` are rows of the shipped template, and an id is
 * never reused and never removed, so these are as stable as any
 * key in this file. They are HERE rather than in the components
 * because there were three copies of them, one in
 * `dashboard.tsx`, one in `year.tsx` and one in `print.tsx`, and
 * a fourth was about to be written into the Android app from a
 * guess: `birds` and `plants`, which are not the ids and would
 * have drawn an empty sky on every phone while every check
 * passed.
 *
 * A routine that does not carry these tasks draws neither, which
 * is right: the flock belongs to a person who feeds birds.
 */
export const GROWN = { birds: "brd", plants: "pln" } as const;

/** How many birds are on the page.

    Thresholds rather than a ratio, so the flock grows in visible
    steps and then stops growing rather than becoming a crowd.
    Nothing announces the next one: a named threshold is a target,
    and there are none of those here. */
export const flock = (times: number): number =>
  (times >= 200 ? 7 : times >= 100 ? 6 : times >= 50 ? 5
    : times >= 25 ? 4 : times >= 10 ? 3 : times >= 3 ? 2 : times >= 1 ? 1 : 0);

/** The garden, in the order things arrive in it.

    Bangladeshi plants, because this is a Bangladeshi garden.
    NOTHING WILTS: the list only ever gets longer, and a plant
    that could die would be a streak with leaves on. */
export const GARDEN = [
  { at: 1, bn: "তুলসী", en: "Tulsi" },
  { at: 5, bn: "জবা", en: "Hibiscus" },
  { at: 20, bn: "বেলি", en: "Beli" },
  { at: 60, bn: "কামিনী", en: "Kamini" },
  { at: 150, bn: "শিউলি", en: "Shiuli" },
] as const;

export const garden = (times: number): Array<{ bn: string; en: string }> =>
  GARDEN.filter((p) => times >= p.at).map((p) => ({ bn: p.bn, en: p.en }));

/* ============================================================
   Six seasons, because Bangladesh has six
   ============================================================ */

/** ষড়ঋতু. Almost no software knows there are six rather than
    four, and the page in বর্ষা should not look like the page in
    শীত.

    Each is two Bengali months and each begins around the middle
    of a Gregorian one, which is close enough for a colour and a
    word and is not pretending to be a calendar conversion. */
export const SEASONS = [
  { id: "grishmo", bn: "গ্রীষ্ম", en: "Summer", from: [4, 15], colour: "#C4711F" },
  { id: "barsha", bn: "বর্ষা", en: "Monsoon", from: [6, 15], colour: "#4C61A8" },
  { id: "sharat", bn: "শরৎ", en: "Autumn", from: [8, 15], colour: "#2F8A64" },
  { id: "hemanta", bn: "হেমন্ত", en: "Late autumn", from: [10, 15], colour: "#A2790B" },
  { id: "sheet", bn: "শীত", en: "Winter", from: [12, 15], colour: "#6E52A8" },
  { id: "bosonto", bn: "বসন্ত", en: "Spring", from: [2, 15], colour: "#B45570" },
] as const;

export type Season = (typeof SEASONS)[number];

/** Which of the six a date falls in. */
export function seasonOf(iso: string): Season {
  const [, m, d] = iso.split("-").map(Number);
  const after = (month: number, day: number): boolean =>
    m > month || (m === month && d >= day);
  /* Newest boundary first, and winter wraps the year: mid
     December to mid February is one season with January inside
     it, so anything before mid February is winter rather than
     falling off the end of the list. */
  if (after(12, 15)) return SEASONS[4];
  if (after(10, 15)) return SEASONS[3];
  if (after(8, 15)) return SEASONS[2];
  if (after(6, 15)) return SEASONS[1];
  if (after(4, 15)) return SEASONS[0];
  if (after(2, 15)) return SEASONS[5];
  return SEASONS[4];
}

/** সুপ্রভাত, শুভ দুপুর, শুভ সন্ধ্যা, শুভ রাত্রি. */
export const greeting = (hour: number): { bn: string; en: string } =>
  (hour < 5 ? { bn: "শুভ রাত্রি", en: "Good night" }
    : hour < 12 ? { bn: "সুপ্রভাত", en: "Good morning" }
      : hour < 16 ? { bn: "শুভ দুপুর", en: "Good afternoon" }
        : hour < 20 ? { bn: "শুভ সন্ধ্যা", en: "Good evening" }
          : { bn: "শুভ রাত্রি", en: "Good night" });

/* ============================================================
   A year ago today
   ============================================================ */

export interface Echo {
  entry: Entry;
  /** "এক বছর আগে আজ" and its English. */
  bn: string;
  en: string;
}

/**
 * Something written on this date before.
 *
 * Nothing else in this tool will be as good as reading "the birds
 * ate from my hand" twelve months later on a Tuesday, and it
 * costs one lookup.
 *
 * A year first, then six months, then a month: the further back
 * it reaches the more it is worth, so it prefers the oldest it
 * can find rather than the nearest.
 */
export function echo(entries: Entry[], today: string): Echo | null {
  const by = new Map(entries.map((e) => [e.entry_date, e]));
  const shift = (years: number, months: number): string => {
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCFullYear(d.getUTCFullYear() - years);
    d.setUTCMonth(d.getUTCMonth() - months);
    return d.toISOString().slice(0, 10);
  };
  const tries: Array<[string, string, string]> = [
    [shift(1, 0), "এক বছর আগে আজ", "A year ago today"],
    [shift(0, 6), "ছয় মাস আগে আজ", "Six months ago today"],
    [shift(0, 1), "এক মাস আগে আজ", "A month ago today"],
  ];
  for (const [date, bn, en] of tries) {
    const entry = by.get(date);
    /* Only where something was WRITTEN. A day with ticks and no
       words has nothing to say back. */
    if (entry && String(entry.note ?? "").trim()) return { entry, bn, en };
  }
  return null;
}

/** The four moods, and there are deliberately no more.

    NONE OF THEM IS BAD. "Heavy" is the honest bottom of this
    scale and it is a description rather than a failure, which is
    the difference between this and every mood tracker that
    offers a frowning face. So none of the four is red, and heavy
    is the quiet violet rather than a warning.

    The colours are DATA and travel with the mood, the same way a
    band's colour does. A stylesheet naming them would be naming
    section tokens, which `check-accents.ts` rightly refuses: a
    rule that says `--green` paints green on a page wearing blue. */
export const MOODS = [
  { id: "light", bn: "হালকা", en: "Light", colour: "#2F8A64" },
  { id: "steady", bn: "শান্ত", en: "Steady", colour: "#4C61A8" },
  { id: "full", bn: "ভরা", en: "Full", colour: "#A2790B" },
  { id: "heavy", bn: "ভারী", en: "Heavy", colour: "#6E52A8" },
] as const;

export const moodColour = (id: string | null | undefined): string =>
  MOODS.find((m) => m.id === id)?.colour ?? "";

/** Every line she has written, newest first, for the jar and the
    reflection log. */
export const written = (entries: Entry[]): Entry[] => entries
  .filter((e) => String(e.note ?? "").trim())
  .sort((a, b) => b.entry_date.localeCompare(a.entry_date));

/* ============================================================
   The dashboard: the same days, said more ways

   `hoursDone`, `series`, `momentum`, `weekdays`, `bandRates`,
   `moodRibbon` and `runs` are what a real dashboard draws, and
   every one of them walks the same window of days through the
   same gate.

   THE GATE IS `done()`, AND A DAY IT ANSWERS NULL FOR IS LEFT
   OUT RATHER THAN COUNTED AS A ZERO. A day with no row at all
   and a day with nothing but television on it both answer null,
   so "empty" is one test here rather than a second definition
   that has to be kept in step with the first, and neither kind
   of day can reach a mean.

   That is the property that stops any of this punishing
   anybody, and it is one line in each function. A mean over the
   days somebody MARKED stays where it was through a quiet
   fortnight. A mean over CALENDAR days falls towards nought
   while somebody is ill, which is not a description of a
   routine: it is a chart of a life, scored.

   Every mean below therefore carries the count of the days it
   was taken over. 0 out of nothing and 0 out of thirty are the
   same number and the drawing has to tell them apart: the first
   is "nothing yet" and only the second is a fact.
   ============================================================ */

/** `back` days before `today`, as ISO and in UTC.

    Midday rather than midnight, as every other date in this
    file: the walk is `setUTCDate` and the answer comes back out
    of `toISOString`, so starting halfway through the day means
    no arithmetic here can land on the far side of a boundary. */
const dayBefore = (today: string, back: number): string => {
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - back);
  return d.toISOString().slice(0, 10);
};

/** The `days` days ending on `today`, oldest first.

    Oldest first everywhere, because these arrays are drawn left
    to right and a reversed one is a chart that reads backwards
    without ever looking broken. */
const walkBack = (today: string, days: number): string[] => {
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i -= 1) out.push(dayBefore(today, i));
  return out;
};

/** A day in the window that `done()` has something to say about.

    The one place the gate above is written, so `momentum`,
    `weekdays` and `bandRates` cannot come to disagree about
    which days they are means over. */
interface MarkedDay {
  date: string;
  entry: Entry;
  fraction: number;
}

const markedDays = (
  shape: RoutineShape, entries: Entry[], today: string, days: number,
): MarkedDay[] => {
  const by = new Map(entries.map((e) => [e.entry_date, e]));
  const out: MarkedDay[] = [];
  for (const date of walkBack(today, days)) {
    const entry = by.get(date);
    if (!entry) continue;
    const fraction = done(shape, entry);
    if (fraction === null) continue;
    out.push({ date, entry, fraction });
  }
  return out;
};

/** A day's work in hours rather than in ticks, because a
    fourteen-minute task and a two-hour one are not one tick each.

    THE SAME FILTER `done()` USES, on both halves. `hours()` in
    the builder counts television, because an hour of television
    is an hour of the day whatever else is true; this pair is
    what somebody did against what the counting half of their
    routine asks for, and leisure in either half is the day
    watching television becomes something a person can be short
    of.

    A task with no `hours` adds nothing to either side, so
    nothing is scored against a length nobody gave it. Half a
    mark on the two-hour dinner is an hour: `Math.min(1, m)` is
    the cap `done()` applies, applied once more here.

    Two numbers rather than a union, and that is not a hole in
    the rule above: `planned` is a fact about the routine and is
    true before anybody has marked anything. THE CALLER STILL
    ASKS `done()` FIRST. An empty day gets the sentence, never a
    bar drawn at nought. */
export function hoursDone(
  shape: RoutineShape, entry: Entry | null | undefined,
): { done: number; planned: number } {
  const counting = shape.tasks.filter((t) => t.counts && !t.archived);
  const marks = entry?.marks ?? {};
  let did = 0;
  let planned = 0;
  for (const t of counting) {
    const h = t.hours ?? 0;
    planned += h;
    const m = marks[t.id];
    if (typeof m !== "number" || m <= 0) continue;
    did += Math.min(1, m) * h;
  }
  return { done: did, planned };
}

/** The last `days` days, oldest first, for a sparkline.

    `value` is 0..1, or null for a day that was never marked,
    WHICH A CHART MUST DRAW AS A GAP RATHER THAN AS A ZERO. A
    line plotted through nought on the days somebody was busy
    draws a cliff, and a cliff is the picture this tool exists
    not to draw.

    Every day in the window is here, including the ones with
    nothing on them, so the axis is dates rather than "days I
    turned up" and two of these line up with each other and with
    `moodRibbon`.

    `heat()` is this same walk in weeks with the mood attached.
    Both go through `done()`, which is where the arithmetic
    lives and the only place it may live. */
export function series(
  shape: RoutineShape, entries: Entry[], today: string, days: number,
): Array<{ date: string; value: number | null }> {
  const by = new Map(entries.map((e) => [e.entry_date, e]));
  return walkBack(today, days).map((date) => ({
    date,
    value: done(shape, by.get(date)),
  }));
}

export interface Momentum {
  /** Mean completion over the window, 0..1, counting only marked days. */
  now: number;
  /** The same for the window before it, for a trend. */
  before: number;
  /** How many days each window is. */
  days: number;
  /** How many days in the current window were marked at all. */
  marked: number;
}

/**
 * Two windows of the same length, which is `changed()` one level
 * up: that one counts a single task, this one reads whole days.
 *
 * BOTH HALVES ARE THE SAME LENGTH and neither is "since". A
 * quiet fortnight makes a smaller number rather than a broken
 * anything, and there is no arrow, no colour and no verdict in
 * the shape for a component to reach for.
 *
 * `marked` is beside the mean because an empty history has no
 * mean at all: `now` is 0 there for want of any other number,
 * and `marked` is how a caller tells that apart from a month
 * somebody genuinely marked nothing in. Draw the figure only
 * where `marked` is above nought.
 *
 * `days` travels back with the answer so a component can write
 * "over 28 days" without keeping a second copy of the default.
 * A sentence holding a number the data already knows is the
 * failure `scripts/check-content.ts` exists for.
 */
export function momentum(
  shape: RoutineShape, entries: Entry[], today: string, days = 28,
): Momentum {
  const mean = (window: MarkedDay[]): number => (window.length === 0
    ? 0
    : window.reduce((n, d) => n + d.fraction, 0) / window.length);
  const now = markedDays(shape, entries, today, days);
  /* The window BEFORE this one, ending the day before this one
     starts, so the two never share a day and the pair is a
     comparison rather than an overlap. */
  const before = markedDays(shape, entries, dayBefore(today, days), days);
  return { now: mean(now), before: mean(before), days, marked: now.length };
}

export interface Weekday {
  /** 0 = Sunday, matching Date.getUTCDay(). */
  day: number;
  en: string;
  bn: string;
  /** Mean completion on this weekday, 0..1. 0 when nothing is marked. */
  rate: number;
  marked: number;
}

/** Indexed by `Date.getUTCDay()`, which is why this is an array
    and not a table keyed by name: the index IS the day number,
    so there is no arrangement in which Sunday's bar can draw
    Monday's figure. Sunday first in both languages, because the
    Bengali week starts there too. */
const WEEKDAY_NAMES: ReadonlyArray<{ en: string; bn: string }> = [
  { en: "Sun", bn: "রবিবার" },
  { en: "Mon", bn: "সোমবার" },
  { en: "Tue", bn: "মঙ্গলবার" },
  { en: "Wed", bn: "বুধবার" },
  { en: "Thu", bn: "বৃহস্পতিবার" },
  { en: "Fri", bn: "শুক্রবার" },
  { en: "Sat", bn: "শনিবার" },
];

/**
 * Seven, always, in week order starting Sunday.
 *
 * A weekday with no marked days is still in the list with
 * `marked: 0`, BECAUSE A CHART WITH A MISSING BAR IS A CHART
 * THAT HAS LOST A DAY: a reader cannot tell an absent Wednesday
 * from a bad one, and the tool would be asserting the second
 * while meaning the first.
 *
 * Twelve weeks by default, so seven buckets hold a dozen days
 * each rather than four.
 *
 * NOTHING HERE NAMES A BEST DAY and nothing built on it should:
 * a best day names a worst one, and a worst one is a thing to
 * feel behind on every time it comes round.
 */
export function weekdays(
  shape: RoutineShape, entries: Entry[], today: string, days = 84,
): Weekday[] {
  const sum = new Array<number>(7).fill(0);
  const seen = new Array<number>(7).fill(0);
  for (const d of markedDays(shape, entries, today, days)) {
    const i = new Date(`${d.date}T12:00:00Z`).getUTCDay();
    sum[i] += d.fraction;
    seen[i] += 1;
  }
  return WEEKDAY_NAMES.map((name, day) => ({
    day,
    en: name.en,
    bn: name.bn,
    rate: seen[day] === 0 ? 0 : sum[day] / seen[day],
    marked: seen[day],
  }));
}

export interface BandRate {
  id: string;
  bn: string;
  en: string;
  /** Mean completion of this band's tasks, 0..1. */
  rate: number;
  marked: number;
  /** How many of this band's tasks are live (not archived). */
  tasks: number;
}

/**
 * One per band that has at least one live task, in the band's
 * own order.
 *
 * The denominator inside a day is the band's LIVE tasks,
 * leisure included, which is what `balance()` already does and
 * for the same reason: this describes where a day went rather
 * than scoring it, and "Just for me" is a band like the others.
 * What it must never grow is a target over the bar.
 *
 * A day reaches a band's mean only where that band was touched,
 * so `marked` says how many days somebody cooked and `rate`
 * says how much of the kitchen they did on those days. A band
 * nobody has touched is `rate: 0, marked: 0`, which the drawing
 * says in words rather than as an empty bar next to full ones.
 *
 * The window is still gated on `done()`, so a day with nothing
 * but television on it is in no band's mean. That is the one
 * test everywhere rather than a second definition of empty, and
 * all it can do is leave leisure out of a picture. It can never
 * put somebody down in one.
 */
export function bandRates(
  shape: RoutineShape, entries: Entry[], today: string, days = 84,
): BandRate[] {
  const window = markedDays(shape, entries, today, days);
  const out: BandRate[] = [];
  for (const band of [...shape.bands].sort((a, b) => a.order - b.order)) {
    const tasks = bandTasks(shape, band.id);
    if (tasks.length === 0) continue;
    let sum = 0;
    let seen = 0;
    for (const d of window) {
      let did = 0;
      for (const t of tasks) {
        const m = d.entry.marks[t.id];
        if (typeof m !== "number" || m <= 0) continue;
        did += Math.min(1, m);
      }
      if (did === 0) continue;
      sum += did / tasks.length;
      seen += 1;
    }
    out.push({
      id: band.id,
      bn: band.bn,
      en: band.en,
      rate: seen === 0 ? 0 : sum / seen,
      marked: seen,
      tasks: tasks.length,
    });
  }
  return out;
}

/**
 * One entry per day, oldest first, for a colour ribbon. `mood`
 * is null for a day with no mood recorded.
 *
 * NO SHAPE, AND IT MUST NEVER TAKE ONE. A mood is not scored
 * here and enters no arithmetic anywhere: the ribbon sits on the
 * same date axis as `series` so a pattern is VISIBLE, and the
 * tool never says one is there, because it does not know. The
 * day a number joins this shape is the day it starts asserting
 * a correlation.
 *
 * `days` is an argument rather than a default for the same
 * reason: a caller hands the ribbon and the line the one number,
 * and two windows of different lengths drawn one above the other
 * line up wrongly and read as a pattern that is not there.
 *
 * An empty string is a mood nobody chose and comes back as null,
 * so the drawing has one test to make rather than two.
 */
export function moodRibbon(
  entries: Entry[], today: string, days: number,
): Array<{ date: string; mood: string | null }> {
  const by = new Map(entries.map((e) => [e.entry_date, e]));
  return walkBack(today, days).map((date) => ({
    date,
    mood: by.get(date)?.mood || null,
  }));
}

/**
 * The best run of marked days inside the window, and the current
 * one.
 *
 * WHAT IT IS NOT: nothing is lost by breaking it, nothing counts
 * down, nothing names the number after this one, and no drawing
 * is hung on it. It is a fact about the past in the way "marked
 * on 11 of the last 14 days" is a fact, and `best` standing
 * above `now` is the ordinary case rather than a fall from
 * grace.
 *
 * A RUN THAT ENDED YESTERDAY IS STILL THE CURRENT ONE. Without
 * that line this number drops to nought at midnight and climbs
 * back when somebody marks their first task at nine, which is a
 * thing to be broken however carefully it is worded. Today is
 * not over.
 *
 * No shape, deliberately, so this cannot quietly become a
 * completion figure. A day counts when its row holds a mark
 * above nought: unticking DELETES the key rather than writing a
 * zero (`next/components/routine/day.tsx`), and a row carrying
 * nothing but a note is not a day somebody marked.
 *
 * Both numbers are measured inside the window, so `best` over a
 * year is a fact about a year and is not a lifetime record.
 * `everMarked` above is the counter that only ever grows, and it
 * is the one a drawing may be hung on.
 */
export function runs(
  entries: Entry[], today: string, days = 365,
): { now: number; best: number } {
  const marked = new Set(
    entries
      .filter((e) => Object.values(e.marks).some((m) => m > 0))
      .map((e) => e.entry_date),
  );
  const window = walkBack(today, days);

  let best = 0;
  let run = 0;
  for (const date of window) {
    run = marked.has(date) ? run + 1 : 0;
    if (run > best) best = run;
  }

  let now = 0;
  let i = window.length - 1;
  /* The line the whole paragraph above is about: today unmarked
     steps back one day rather than answering nought. Removing it
     looks like a simplification and is the punishing version. */
  if (i >= 0 && !marked.has(window[i])) i -= 1;
  for (; i >= 0 && marked.has(window[i]); i -= 1) now += 1;

  return { now, best };
}
