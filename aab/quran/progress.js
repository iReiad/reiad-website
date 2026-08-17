/* ============================================================
   progress.js: the Quranic Arabic school's ticks and bookmark.

   The program is `schools/progress.js`, shared with the German
   and English schools because all three were running the same
   one. This file is this school's half of it: the two keys, the
   ladder, and the names the rest of the school imports.

   Two keys rather than four, because this school has no practice
   book: the sixty days ARE the lessons, so a day is ticked by
   reading it and there is nothing separate to tick.

   THESE STRINGS ARE IN REAL BROWSERS AND IN REAL ACCOUNTS.
   `aab/sync.js` maps them, and renaming one does not move
   somebody's ticks, it loses them.

     quran-done   ["dhap-1/day-1", "dhap-1/day-2", …]
                  Lessons that have been opened.

     quran-last   { id, url, bn, dhap, ts }
                  The last lesson opened. Powers the resume card.

   Nothing is sent anywhere, nothing needs an account, and
   clearing browser data clears it. It is a bookmark, not
   analytics.

   ---- and the one thing this school counts differently ----

   Sixty days across ninety-odd lessons: two of them cover two
   days each, so counting pages would tell a learner they were
   further along than they are. `weigh` is what makes the shared
   engine count in days here and in pages everywhere else, and
   `dhapStats().days` is where that number comes out.
   ============================================================ */

import { DHAPS, dhapLessons, allLessons, findDhap } from "/quran/curriculum.js";
import { createProgress } from "/schools/progress.js";

const P = createProgress({
  event: "quran:progress",
  keys: { read: "quran-done", last: "quran-last" },
  stages: DHAPS,
  lessonsOf: dhapLessons,
  allLessons,
  findStage: findDhap,
  stageKey: "dhap",
  weigh: (lesson) => lesson.days,
  attr: { id: "data-lesson-id", stage: "data-dhap", title: "data-lesson-title" },
  titleSplit: ":",
  defaultStage: "dhap-1",
});

/* This school says "done" where the other two say "read": a day
   of Arabic is finished, not merely read. Same set, same key. */
export const doneSet = P.readSet;
export const isDone = P.isRead;
export const markDone = P.markRead;
export const unmarkDone = P.unmarkRead;

export const { setLast, getLast, nextUp, resetAll, onProgress, recordVisit } = P;

/** Days, not pages. `weighted` is the shared engine's name for
    "counted in the unit this school counts in"; here that is
    days, so it comes out as `days`. */
const inDays = ({ weighted, weightedTotal, ...rest }) =>
  ({ ...rest, days: weighted, totalDays: weightedTotal });

export const dhapStats = (dhap) => inDays(P.stageStats(dhap));
export const overallStats = () => inDays(P.overallStats());
export const currentDhap = P.currentStage;
export const dhapState = P.stageState;
