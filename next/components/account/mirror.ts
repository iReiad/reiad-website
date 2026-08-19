"use client";

/* ============================================================
   account/mirror.ts: every key this account keeps, counted.

   The account page is deliberately plain about what is stored.
   A page that says "we value your privacy" and lists nothing is
   worth less than a page that lists every key and a count, so
   this is the list, in the words a reader would use.

   ---- these strings are not identifiers ----

   They are STORAGE KEYS, in real browsers and in real accounts
   today, and `CLAUDE.md` says the plain truth about renaming one:
   it does not move somebody's ticks, it loses them. The money
   school moved from `/learn/` to `/money/` on 17 August 2026 and
   `learn-read` did not move with it. `aab/sync.js` maps the same
   names on to `learn:progress` in Supabase and needed no change
   either, and `next/lib/progress.ts` maps the school `money` on
   to the key `learn-read` for the same reason.

   ---- counted, never described ----

   The alternative was importing a number from each course, which
   is right on the day it is written. This reports what is
   actually stored, so a course that changes shape cannot make
   this page lie.
   ============================================================ */

/** One storage key, in the words a reader would use. */
export interface KeptKey {
  key: string;
  /** Which school's card it appears on. */
  course: string;
  one?: string;
  many?: string;
  /** The bookmark, which is one thing rather than a count of
      them. */
  single?: boolean;
}

export const KEPT: KeptKey[] = [
  { key: "learn-read", course: "money", one: "lesson read", many: "lessons read" },
  { key: "learn-checks", course: "money", one: "checkpoint ticked", many: "checkpoints ticked" },
  { key: "learn-last", course: "money", single: true },
  { key: "deutsch-read", course: "deutsch", one: "part read", many: "parts read" },
  { key: "deutsch-days", course: "deutsch", one: "practice day done", many: "practice days done" },
  { key: "deutsch-checks", course: "deutsch", one: "checkpoint ticked", many: "checkpoints ticked" },
  { key: "english-read", course: "english", one: "part read", many: "parts read" },
  { key: "english-days", course: "english", one: "practice day done", many: "practice days done" },
  { key: "english-checks", course: "english", one: "checkpoint ticked", many: "checkpoints ticked" },
  { key: "quran-done", course: "quran", one: "day done", many: "days done" },
  { key: "quran-checks", course: "quran", one: "checkpoint ticked", many: "checkpoints ticked" },
];

/** Whatever is under a key, or undefined. Never throws: private
    mode and a half-written value are both "nothing here". */
export const readLocal = <T = unknown>(key: string): T | undefined => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
};

export function countOf(entry: KeptKey): number {
  const value = readLocal<unknown>(entry.key);
  if (value === undefined || value === null) return 0;
  if (entry.single) return (value as { id?: string }).id ? 1 : 0;
  return Array.isArray(value) ? value.length : 0;
}

/** Which schools this reader has actually touched.

    Read out of the keys rather than out of the profile, because
    following a course and having started one are different facts:
    the settings form ticks both and says which is which. */
export const startedCourses = (): Set<string> =>
  new Set(KEPT.filter((entry) => countOf(entry) > 0).map((entry) => entry.course));

export const plural = (n: number, one: string, many: string): string =>
  `${n} ${n === 1 ? one : many}`;
