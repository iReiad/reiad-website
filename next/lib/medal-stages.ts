/* ============================================================
   medal-stages.ts: every stage's live lesson ids, per school,
   out of the four committed ladders.

   The medal shelf needs to know when a stage is FINISHED, which
   is every one of its ids ticked, and the ids are the ones the
   ticks are filed under. Read from `shared/curricula/` rather
   than from D1 because a hub is drawn for a reader with no
   database in front of the page (the three written hubs, and
   every test), and `scripts/check-schools.ts` holds these four
   files to the rows, id for id.

   Server-side only: four ladders are a lot of bytes to hand a
   browser for a list of strings, so the hub computes this and
   passes the strings down as a prop.
   ============================================================ */

import { STAGES, stageLessons } from "@reiad/shared/curricula/money";
import { STUFEN, stufeTeile } from "@reiad/shared/curricula/deutsch";
import { TERMS, termParts } from "@reiad/shared/curricula/english";
import { DHAPS, dhapLessons } from "@reiad/shared/curricula/quran";

const live = <T extends { id: string; status: string }>(rows: T[]): string[] =>
  rows.filter((r) => r.status === "live").map((r) => r.id);

/** One list of ids per stage, in ladder order. A school this site
    does not have is an empty ladder, and a medal for a stage of
    it cannot be earned. */
export function stageIdsOf(school: string): string[][] {
  switch (school) {
    case "money":   return STAGES.map((s) => live(stageLessons(s)));
    case "deutsch": return STUFEN.map((s) => live(stufeTeile(s)));
    case "english": return TERMS.map((t) => live(termParts(t)));
    case "quran":   return DHAPS.map((d) => live(dhapLessons(d)));
    default:        return [];
  }
}
