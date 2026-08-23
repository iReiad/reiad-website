/* ============================================================
   functions/api/site.ts, served at /api/site.

   What this site contains, as JSON, for a client that cannot
   evaluate JavaScript.

   ---- why it exists ----

   The browser learns the site's own furniture by importing
   `/content.js`, which `scripts/build-modules.ts` compiles out of
   `shared/content.ts`. That works because the reader of it is a
   browser. The Android app is not, and an app that had to run an
   ES module to find out how many schools there are would be
   parsing JavaScript to read a table.

   So this is a second SERIALISATION of tables that already exist,
   and never a second copy of them. Every value here is read out
   of `shared/content.ts` and `shared/nav.ts` at request time. If
   you find yourself typing a number or a label into this file,
   that is the bug this endpoint was written to avoid.

   ---- the rule that makes new work reach the app on its own ----

   **Objects are spread, not mapped field by field.** A school
   gaining a field, a nav item gaining a flag, a new key in
   `COUNTS`: all of it reaches the app the next time it asks,
   with no app release and no edit here. Hand-picking fields
   would look identical today and would silently drop the field
   somebody adds next year, which is the failure this repository
   keeps returning to.

   What that costs is one obligation: anything added to those
   tables IS published here the moment it is added. Three things
   are therefore taken out on the way, and each is taken out
   because it must never be public rather than because it is
   untidy:

     - a `Page` marked `private`, which is the Studio. The same
       flag keeps it out of the sitemap, the menu and the palette.
     - a `NavItem` marked `unlisted`, which is the course section
       and `/admin`. The rail and the footer skip them for the
       same reason.
     - the third-party course catalogue, which is not this site's
       to publish and is never named in this file at all. It is
       served by `functions/api/courses/[[route]].ts`, behind an
       admin reader, and `scripts/check-courses.ts` is what stops
       it reaching a public bundle.

   `pieces` on a section is a FUNCTION, and it is stripped by
   name below rather than left to `JSON.stringify` dropping it
   quietly. A reader of this file should be able to see what
   crosses the wire without knowing that rule.

   Written pieces and school lessons are deliberately NOT here:
   they are rows, they change hourly, and `/api/articles` and
   `/api/schools` already answer for them. This is the furniture.
   ============================================================ */

import { methods, ok, type RouteContext } from "../_lib/http.ts";
import {
  COUNTS, DOOR, PAGES, SECTIONS, SITE, SKILLS, TERM_GROUPS, TOOLS,
} from "../../shared/content.ts";
import { ACCENTS, AUDIENCES, LADDER_SCHOOLS, NAV, ORDER } from "../../shared/nav.ts";
import { bnNum } from "../../shared/schools.ts";
import { GARDEN, GROWN, MOODS, SEASONS } from "../../shared/routine.ts";
import { PACES, TARGET_KINDS } from "../../shared/profile.ts";
import { HEADS } from "../../shared/heads.ts";
import { DIET_WORDS } from "../../shared/diet-words.ts";

/** Half an hour, the same as the market board next door. The
    furniture changes when somebody deploys, so a stale answer is
    at worst one deploy behind.

    **What the reader actually gets today is `no-store`, and that
    is not this handler.** Something at the edge rewrites
    Cache-Control on `/api/*`, outside this repository: measured
    22 August 2026, `/api/site` and `/api/backup/articles` both
    answer `no-store` live while setting a public max-age here,
    and `/api/news`, which returns a `caches.default` hit rather
    than a fresh Response, keeps its own. `worker.js` returns a
    handler's Response verbatim, so nothing in the tree does it.

    The header is set anyway, because it is the true statement
    about this answer and the day that rule changes it starts
    working. Do not read the test's assertion as proof the edge
    caches: it asserts what this file SETS. An app holds its own
    copy regardless, which is why this is a note and not a bug. */
const CACHE_SECONDS = 1800;

/** A section without its `pieces()` reader. The function cannot
    cross a wire and the app has `/api/articles` for what it would
    have returned. Named rather than left to JSON to drop. */
const sections = (): unknown[] =>
  SECTIONS.map(({ pieces: _pieces, ...rest }) => ({ ...rest }));

/** The menu, minus what the menus themselves skip. `unlisted` is
    one flag with one meaning, and this is a third reader of it
    beside the rail and the footer. */
const nav = (): unknown[] =>
  NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.unlisted).map((item) => ({ ...item })),
  }));

export function onRequest(context: RouteContext): Response | Promise<Response> {
  return methods(context.request, {
    GET: () =>
      ok({
        site: { ...SITE },
        nav: nav(),
        accents: { ...ACCENTS },
        audiences: AUDIENCES.map((audience) => ({ ...audience })),
        ladders: [...LADDER_SCHOOLS],
        order: { ...ORDER },
        sections: sections(),
        tools: TOOLS.map((tool) => ({ ...tool })),
        skills: SKILLS.map((skill) => ({ ...skill })),
        termGroups: TERM_GROUPS.map((group) => ({ ...group })),
        pages: PAGES.filter((page) => !page.private).map((page) => ({ ...page })),
        counts: { ...COUNTS },

        /* The routine tool's own vocabulary.

           Four moods, six seasons, five plants and the two task
           ids the drawings hang on: every one of them an id, a
           name in each language and a colour, which is data by
           this file's own rule and was a second copy in Kotlin.
           A fifth mood or a sixth plant reaches a phone on the
           next fetch now.

           `PRIVATE_TEMPLATES` is NOT here and never will be: it
           is one person's real day, and `check-courses.ts`
           already refuses it in a public bundle for the same
           reason it refuses the course catalogue.

           `TEMPLATES`, `FIRST_RUN` and `SCHEMA` are not here
           either, and that is a smaller decision that will
           change: the app cannot CREATE a routine yet, it sends
           the reader to the site for that, and a field carried
           and never drawn is a field somebody later mistakes for
           a feature. `ManifestSurfaceTest` in the app fails on
           one, which is how this was noticed. */
        routine: {
          moods: MOODS.map((mood) => ({ ...mood })),
          seasons: SEASONS.map((season) => ({ ...season })),
          garden: GARDEN.map((plant) => ({ ...plant })),
          grown: { ...GROWN },
        },
        /* The front door's own words, with the counts already
           resolved: `DOOR.facts` names a key of `COUNTS` so that
           nobody can type a number into a sentence, and a client
           should not have to know that indirection to draw a
           strip of three figures. The KEY is sent as well, so an
           app that wants to redraw a count on its own can. */
        door: {
          ...DOOR,
          facts: DOOR.facts.map((fact) => ({ ...fact, n: bnNum(COUNTS[fact.count]) })),
        },
        /* The two vocabularies an account answers with. Both are
           a CHECK constraint in Postgres, so a value the app
           offers that this list has not got is a 400 on the whole
           write: sending them is what stops the app spelling them
           a third time. `check-rows.ts` holds all three to the
           migration. */
        profile: {
          paces: PACES.map((pace) => ({ ...pace })),
          targetKinds: TARGET_KINDS.map((kind) => ({ ...kind })),
        },
        /* What each hub page SAYS, with the counts already
           resolved: a lede names a `COUNTS` key so that nobody
           can type a number into a sentence, and a client should
           not have to know that indirection to print one. The
           same arrangement `door` uses one field up. */
        /* The diet tool's own readouts, in both languages. The
           app draws the same figures and would otherwise carry a
           second copy of every sentence in Kotlin, which is what
           `shared/` exists to prevent. */
        dietWords: { ...DIET_WORDS },
        heads: Object.fromEntries(
          Object.entries(HEADS).map(([key, { count, ...head }]) => [key, {
            ...head,
            /* Resolved, and the KEY is dropped rather than sent
               beside it. `DOOR.facts` sends both because there
               the number is its own field and a client can
               redraw it; here it is baked into a sentence, so a
               client could only use the key by re-implementing
               the slot. A field carried and never drawn is a
               field somebody later mistakes for a feature, which
               is what the app's own `ManifestSurfaceTest` fails
               on and is how this was noticed. */
            lede: count ? head.lede.replace("{n}", bnNum(COUNTS[count])) : head.lede,
          }]),
        ),
      }, {
        "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
      }),
  });
}
