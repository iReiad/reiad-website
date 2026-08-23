/* ============================================================
   functions/api/foods.ts, served at /api/foods.

   The portion library and the nutrient panel, as JSON.

   ---- which half of the contract this is ----

   `CLAUDE.md`'s table: a food row is DATA, so it reaches the
   phone the next time the app asks and never through a release.
   `shared/diet.ts` is the other half and stays behind: it is
   arithmetic, the app has its own port of it, and a change to a
   formula genuinely does need a release. The line between them
   is not "what is small" but "what would a second copy make
   stale": eighty-three bilingual rows carrying a source
   citation each is exactly the list that goes stale first.

   ---- why a route of its own ----

   `/api/site` is fetched on every cold start and this is 57 KB
   of it, needed by one screen. The reader who never opens the
   diet tool should not download the portion library to see the
   front page, and the reader who does opens it once and holds
   it. `/api/tools` next door drew the same line for the same
   reason and is the pattern being followed.

   ---- and it is a serialisation, never a second copy ----

   Every byte here is read out of `shared/foods.ts` at request
   time, spread rather than mapped field by field. A row gaining
   a `selenium` next year is published by this file without this
   file being edited, and picking fields by hand would look
   identical today and silently drop it. That is the failure at
   the top of `CLAUDE.md`, and `check-app-surface.ts` is what
   holds this file to it: `shared/foods.ts` is in its `SOURCES`,
   so a table added there is either imported here or named with
   a reason.

   ---- what a caller must not conclude from a missing figure ----

   An absent nutrient is absent because nobody looked it up for
   that dish, and `DIET.md` §15's coverage arithmetic counts
   exactly that. A client that filled a gap with a nought would
   turn "we do not know" into "there is none of it", which is
   the one thing the library refuses to say. The app's own
   `Foods.kt` carries this sentence again where a decoder could
   otherwise default.
   ============================================================ */

import { methods, ok, type RouteContext } from "../_lib/http.ts";
import {
  COVERAGE_KEYS,
  DEFAULT_PLACE,
  FOODS,
  MACRO_KEYS,
  NUTRIENT_GROUPS,
  NUTRIENTS,
  UNIT_WORDS,
} from "../../shared/foods.ts";

/** Half an hour, matching `/api/site` and `/api/tools`. The rows
    change when somebody deploys, so a stale answer is at worst
    one deploy behind, and the app holds its own copy anyway.

    The note on `/api/site` about something at the edge rewriting
    Cache-Control on `/api/*` applies here in full. The header is
    the true statement about this answer either way. */
const CACHE_SECONDS = 1800;

export function onRequest(context: RouteContext): Response | Promise<Response> {
  return methods(context.request, {
    GET: () =>
      ok({
        /* `place` is DEFAULT_PLACE and not a guess made here.
           Three callers with three defaults is three different
           libraries leading for one reader, which is the note in
           `foods.ts` beside that constant, and an app deciding
           for itself would be the fourth. */
        place: DEFAULT_PLACE,
        foods: [...FOODS],
        nutrients: [...NUTRIENTS],
        groups: [...NUTRIENT_GROUPS],
        units: { ...UNIT_WORDS },
        /* The coverage denominator. Sent rather than derived,
           because "which nutrients does this tool report the
           coverage of" is a decision the site has already made
           and an app working it out from `nutrients` would get a
           different answer the day a nutrient is drawn without
           being counted. */
        coverage: [...COVERAGE_KEYS],
        /* And its other half. A scaled row is split into macros
           and micros by these two lists, so both of them are
           sent: a client deriving the macro half from `nutrients`
           would agree today and scale a different set the day a
           fifth top-level nutrient is added. */
        macros: [...MACRO_KEYS],
      }, {
        "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
      }),
  });
}
