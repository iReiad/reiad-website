/* ============================================================
   account/standing.ts: how far through a school somebody is.

   One school, one ladder, one answer: how many of its lessons are
   ticked, what fraction that is, and which lesson to send them
   to next. Two components ask it, the bars in `paths.tsx` and a
   course target in `targets.tsx`, and they have to agree: a page
   saying "31 of 60" in one card and "52%" in another, computed
   two ways, is two answers to one question.

   ---- the ladder is the server's and the ticks are the
   browser's ----

   The rule `next/lib/progress.ts` states, and this is the account
   page's half of it. The ladder arrives as a PROP, out of
   `next/lib/school-ladders.ts`, which is generated from the same
   rows the school pages render from. Nothing here loads a
   `curriculum.js`.

   That is a change worth stating plainly, because the version
   this replaces broke the rule in exactly the shape that file
   warns about: `account-page.ts` imported all four schools'
   `curriculum.js` in the browser, 150 KB of them, to find out
   what the denominator was.
   ============================================================ */

import type { LadderLesson } from "../../lib/school-ladders";
import { getLast, readSet } from "../../lib/progress";
import { runtimeModule } from "./runtime";
import type { CheckpointStats } from "/checkpoints.js";

type CheckpointsModule = typeof import("/checkpoints.js");

export const checkpointsModule = () =>
  runtimeModule<CheckpointsModule>("/checkpoints.js");

export interface Standing {
  done: number;
  total: number;
  pct: number;
  /** Where to send them, or null once every written lesson is
      ticked. */
  next: LadderLesson | null;
  checks: CheckpointStats;
  /** Whether this school has been opened at all, which decides
      "Carry on" against "Start" and the order the bars sit in. */
  touched: boolean;
}

/**
 * @param school the school id, `money` and not `learn`.
 * @param ladder its live lessons in order, from the route.
 * @param checks what `/checkpoints.js` says, read by the caller
 *        once rather than per school, since the module is one
 *        import for all four.
 */
export function standing(
  school: string,
  ladder: LadderLesson[],
  checks: CheckpointStats,
): Standing {
  const read = readSet(school);
  const done = ladder.filter((l) => read.has(l.id));

  /* Where they were, and where to go, which are the same thing
     only until the lesson they were on is finished. Same rule the
     school hubs use, and for the same reason: a resume card that
     sends you back to something you have already ticked is a card
     nobody presses twice. */
  const mark = getLast(school);
  const at = mark?.id ? ladder.findIndex((l) => l.id === mark.id) : -1;
  const next = at === -1
    ? ladder.find((l) => !read.has(l.id))
    : ladder.slice(at).find((l) => !read.has(l.id)) ?? ladder.find((l) => !read.has(l.id));

  return {
    done: done.length,
    total: ladder.length,
    pct: ladder.length ? (done.length / ladder.length) * 100 : 0,
    next: next ?? null,
    checks,
    touched: done.length > 0 || Boolean(mark?.id),
  };
}

/** Nothing ticked and nothing loaded, which is what every school
    reads as until `/checkpoints.js` has answered. It is a real
    state rather than a placeholder: a reader with no checkpoints
    has exactly these numbers. */
export const NO_CHECKS: CheckpointStats = { done: 0, lessons: 0 };
