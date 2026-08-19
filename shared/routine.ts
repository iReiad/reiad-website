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
    slug: "sadias-day",
    name: "Sadia's day",
    description: "A full home day: study, kitchen, plants and birds, "
      + "time that's yours, and rest.",
    data: { bands: BANDS, tasks: SADIA },
  },
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
