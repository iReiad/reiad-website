/* ============================================================
   medals.ts: what a learner has earned, out of ticks they have.

   A reward for a child working through a school, and it is
   ARITHMETIC OVER KEYS THAT ALREADY EXIST: the school's ticks,
   its checkpoints, and `days-active`. No new storage key, so
   nothing for `shared/storage.ts` to describe, nothing for
   `sync.ts` to carry and nothing an account can lose. Two devices
   agree about a medal because they agree about the ticks.

   Nothing counts down, nothing is lost and nothing is red. A
   medal, once the ticks are there, is there; a missed day takes
   nothing away. `aab/src/streak.ts` says the same about the days.

   `components/medals.tsx` draws the shelf on a school hub, and
   `LessonTick` in `components/progress.tsx` says which medal a
   tick just earned, on the page where the tick was pressed.
   ============================================================ */

export type MedalKind = "lessons" | "checks" | "days" | "stage" | "school";

export interface MedalRule {
  id: string;
  kind: MedalKind;
  /** How many of the kind earns it. For `stage` and `school`, 1. */
  need: number;
  /** The name a child reads, and the line under it. */
  bn: string;
  en: string;
}

export interface Medal extends MedalRule {
  have: number;
  earned: boolean;
}

/** The rules, in the order the shelf shows them. Small steps
    first, because the first medal has to be within one evening's
    reach or the shelf is a list of things a child has not done. */
export const RULES: readonly MedalRule[] = [
  { id: "first",   kind: "lessons", need: 1,  bn: "প্রথম পাঠ",        en: "First lesson" },
  { id: "five",    kind: "lessons", need: 5,  bn: "পাঁচটা পাঠ",       en: "Five lessons" },
  { id: "ten",     kind: "lessons", need: 10, bn: "দশটা পাঠ",         en: "Ten lessons" },
  { id: "twenty",  kind: "lessons", need: 20, bn: "কুড়িটা পাঠ",       en: "Twenty lessons" },
  { id: "fifty",   kind: "lessons", need: 50, bn: "পঞ্চাশটা পাঠ",     en: "Fifty lessons" },
  { id: "checks",  kind: "checks",  need: 10, bn: "দশটা কাজ",         en: "Ten checkpoints" },
  { id: "days-3",  kind: "days",    need: 3,  bn: "তিন দিন",          en: "Three days" },
  { id: "days-7",  kind: "days",    need: 7,  bn: "সাত দিন",          en: "Seven days" },
  { id: "days-30", kind: "days",    need: 30, bn: "ত্রিশ দিন",        en: "Thirty days" },
  { id: "stage",   kind: "stage",   need: 1,  bn: "একটা ধাপ শেষ",     en: "A stage finished" },
  { id: "school",  kind: "school",  need: 1,  bn: "পুরো স্কুল শেষ",   en: "The whole school" },
];

export interface Progress {
  /** The school's ticks: `<school>-read`. */
  read: ReadonlySet<string>;
  /** The school's checkpoints: `<school>-checks`. */
  checks: ReadonlySet<string>;
  /** How many days this person has turned up, across the site. */
  days: number;
  /** Every stage's LIVE lesson ids. A stage with no lessons is not
      a stage a reader can finish and is left out of the count. */
  stages: ReadonlyArray<ReadonlyArray<string>>;
}

/** Bangla numerals, for the shelf's own labels. */
export const bn = (n: number): string =>
  String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

const finished = (p: Progress): number =>
  p.stages.filter((ids) => ids.length > 0 && ids.every((id) => p.read.has(id))).length;

function have(rule: MedalRule, p: Progress): number {
  switch (rule.kind) {
    case "lessons": return p.read.size;
    case "checks":  return p.checks.size;
    case "days":    return p.days;
    case "stage":   return finished(p);
    case "school": {
      const real = p.stages.filter((ids) => ids.length > 0);
      return real.length > 0 && finished(p) === real.length ? 1 : 0;
    }
  }
}

/** Every medal, earned or not, with the count it is measured on. */
export function medalsFor(p: Progress): Medal[] {
  return RULES.map((rule) => {
    const got = have(rule, p);
    return { ...rule, have: Math.min(got, rule.need), earned: got >= rule.need };
  });
}

/** How far a medal still is, in the words a child reads. A stage
    and the school are not a count, so they say what to do. */
export function toGo(m: Medal): string {
  const n = bn(m.need - m.have);
  switch (m.kind) {
    case "lessons": return `আর ${n}টা পাঠ`;
    case "checks":  return `আর ${n}টা কাজ`;
    case "days":    return `আর ${n} দিন`;
    case "stage":   return "একটা ধাপের সব পাঠ শেষ করুন";
    case "school":  return "সব ধাপ শেষ করুন";
  }
}

/** What became earned between two readings. The press that took
    a reader from four ticks to five earns "five lessons" and
    nothing else, however many the shelf holds. */
export function newlyEarned(before: readonly Medal[], after: readonly Medal[]): Medal[] {
  const had = new Set(before.filter((m) => m.earned).map((m) => m.id));
  return after.filter((m) => m.earned && !had.has(m.id));
}

/** What the shelf shows: everything earned, and the NEXT one of
    each kind, so the shelf is never a row of ten dashed tiles. */
export function shelf(medals: readonly Medal[]): Medal[] {
  const next = new Set<MedalKind>();
  return medals.filter((m) => {
    if (m.earned) return true;
    if (next.has(m.kind)) return false;
    next.add(m.kind);
    return true;
  });
}
