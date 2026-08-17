/* ============================================================
   progress.js: the German school's ticks, days and bookmark.

   The program is `schools/progress.js`, shared with the English
   and Quranic Arabic schools because all three were running the
   same one. This file is the German half of it: the four keys,
   the ladder, and the German names the rest of the school
   already imports.

   Four keys, all in localStorage on the reader's own device.
   THESE STRINGS ARE IN REAL BROWSERS AND IN REAL ACCOUNTS.
   `aab/sync.js` maps them, and renaming one does not move
   somebody's ticks, it loses them.

     deutsch-read   ["stufe-1/laute", "stufe-1/sein", …]
                    Teile that have been opened.

     deutsch-days   ["stufe-1/tag-1", "stufe-1/tag-2", …]
                    Days of the practice book ticked off. A day
                    is NOT ticked by opening it, you tick it
                    yourself, when you have actually spoken it
                    out loud. That is the one promise the book
                    makes, so the page cannot make it for you.

     deutsch-last   { id, url, bn, stufe, ts }
                    The last Teil opened. Powers the resume card.

     deutsch-tag    the day number the workbook was last left on,
                    so returning to it tomorrow opens tomorrow.

   Nothing is sent anywhere, nothing needs an account, and
   clearing browser data clears it. It is a bookmark, not
   analytics.
   ============================================================ */

import { STUFEN, stufeTeile, allTeile, findStufe, dayId } from "/deutsch/curriculum.js";
import { createProgress } from "/schools/progress.js";

const P = createProgress({
  event: "deutsch:progress",
  keys: {
    read: "deutsch-read",
    days: "deutsch-days",
    last: "deutsch-last",
    tag: "deutsch-tag",
  },
  stages: STUFEN,
  lessonsOf: stufeTeile,
  allLessons: allTeile,
  findStage: findStufe,
  dayId,
  stageKey: "stufe",
  attr: { id: "data-teil-id", stage: "data-stufe", title: "data-teil-title" },
  /* The German page titles read "Laute – Stufe 1", so the school
     name is cut off at the en dash. Not an em dash: this site
     does not have one. */
  titleSplit: "–",
  defaultStage: "stufe-1",
});

export const {
  readSet, daySet, isRead, markRead, unmarkRead,
  isDayDone, toggleDay, dayStats, allDayStats, nextBook,
  setLastDay, getLastDay,
  setLast, getLast,
  overallStats, nextUp,
  resetAll, onProgress, recordVisit,
} = P;

/* The three the school calls by its own nouns. A Stufe is a
   stage and a Teil is a lesson, and the ladder above is the
   only place that has to know it. */
export const stufeStats = P.stageStats;
export const currentStufe = P.currentStage;
export const stufeState = P.stageState;
