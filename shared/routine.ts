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
