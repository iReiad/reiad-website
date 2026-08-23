/* ============================================================
   functions/api/tools.ts, served at /api/tools.

   Every word the calculators say, in both languages, as JSON.

   ---- why it exists ----

   The Android app has the stock check's MODEL: forty-four
   metrics, six pillars, the vetoes and the bands, ported to
   Kotlin and locked to `content/stock.fixtures.json` so the two
   implementations cannot drift.

   The model is CODE and needed a release. The words are DATA and
   must not, which is the contract at the top of CLAUDE.md: an
   edited Bangla sentence, a reworded flag, a new metric label all
   reach the app the next time it asks, with nothing to publish.
   Bundling a second copy of 366 bilingual phrases in the app
   would have made every one of those a release, and the two
   copies would have parted company the first week.

   So this is a second SERIALISATION of a table that already
   exists, and never a second copy of it. Every string here is
   read out of `shared/tool-strings.ts` at request time, which is
   the same file the browser gets compiled at
   `/tools/stock.i18n.js`. If you find yourself typing a phrase
   into this file, that is the bug it was written to avoid.

   ---- what is NOT here ----

   The formatters that live at the foot of that file. `fmtLakh`
   and its four neighbours are arithmetic and `Intl`, so they are
   code on both sides: the app has its own and a change to one
   needs a release. Serialising a function is not a thing, and
   pretending otherwise by sending a format STRING would be
   inventing a second little language to avoid admitting that.

   ---- and why the whole table rather than one tool's ----

   `STRINGS` is one flat table with prefixed keys, and the tools
   share the keys under `t.`. Slicing it by prefix here would make
   this file hold an opinion about which prefixes belong to which
   tool, which is a copy of a fact that lives in the keys, and it
   would silently drop a prefix somebody adds next year. It is
   22KB gzipped whole, and it is cached.
   ============================================================ */

import { methods, ok, type RouteContext } from "../_lib/http.ts";
import { LANGS, STRINGS } from "../../shared/tool-strings.ts";

/** Half an hour, matching `/api/site` next door. The words change
    when somebody deploys, so a stale answer is at worst one
    deploy behind, and the app holds its own copy anyway.

    The note on `/api/site` about something at the edge rewriting
    Cache-Control on `/api/*` applies here in full. The header is
    the true statement about this answer either way. */
const CACHE_SECONDS = 1800;

export function onRequest(context: RouteContext): Response | Promise<Response> {
  return methods(context.request, {
    /* Spread rather than mapped key by key, for the reason
       `/api/site` spreads its tables: a phrase added to that file
       is published here the moment it is added, and hand-picking
       would look identical today and drop it a year from now. */
    GET: () =>
      ok({
        langs: [...LANGS],
        strings: { ...STRINGS },
      }, {
        "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
      }),
  });
}
