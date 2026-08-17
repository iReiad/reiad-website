/* ============================================================
   progress.js: the English school's ticks, days and bookmark.

   The program is `schools/progress.js`, shared with the German
   and Quranic Arabic schools because all three were running the
   same one. This file is the English half of it: the four keys,
   the ladder, and the names the rest of the school imports.

   Four keys, all in localStorage on the reader's own device.
   THESE STRINGS ARE IN REAL BROWSERS AND IN REAL ACCOUNTS.
   `aab/sync.js` maps them, and renaming one does not move
   somebody's ticks, it loses them.

     english-read   ["term-1/alphabet", "term-1/verbs", …]
                    Parts that have been opened.

     english-days   ["term-1/day-1", "term-1/day-2", …]
                    Days of the practice book ticked off. A day
                    is NOT ticked by opening it, you tick it
                    yourself, when you have actually said it out
                    loud. That is the one promise the book makes,
                    so the page cannot make it for you.

     english-last   { id, url, bn, term, ts }
                    The last part opened. Powers the resume card.

     english-day    the day number the workbook was last left on,
                    so returning to it tomorrow opens tomorrow.
                    Spelled `-day` rather than `-tag` because
                    that is what it has always been called here.

   Nothing is sent anywhere, nothing needs an account, and
   clearing browser data clears it. It is a bookmark, not
   analytics.
   ============================================================ */

import { TERMS, termParts, allParts, findTerm, dayId } from "/english/curriculum.js";
import { createProgress } from "/schools/progress.js";

const P = createProgress({
  event: "english:progress",
  keys: {
    read: "english-read",
    days: "english-days",
    last: "english-last",
    tag: "english-day",
  },
  stages: TERMS,
  lessonsOf: termParts,
  allLessons: allParts,
  findStage: findTerm,
  dayId,
  stageKey: "term",
  attr: { id: "data-part-id", stage: "data-term", title: "data-part-title" },
  titleSplit: ":",
  defaultStage: "term-1",
});

export const {
  readSet, daySet, isRead, markRead, unmarkRead,
  isDayDone, toggleDay, dayStats, allDayStats, nextBook,
  setLastDay, getLastDay,
  setLast, getLast,
  overallStats, nextUp,
  resetAll, onProgress, recordVisit,
} = P;

/* The three the school calls by its own nouns. */
export const termStats = P.stageStats;
export const currentTerm = P.currentStage;
export const termState = P.stageState;
