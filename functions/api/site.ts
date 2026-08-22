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
  COUNTS, PAGES, SECTIONS, SITE, SKILLS, TERM_GROUPS, TOOLS,
} from "../../shared/content.ts";
import { ACCENTS, AUDIENCES, LADDER_SCHOOLS, NAV, ORDER } from "../../shared/nav.ts";

/** Half an hour, the same as the market board next door. The
    furniture changes when somebody deploys, so a stale answer is
    at worst one deploy behind, and the app holds its own copy
    anyway. */
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
      }, {
        "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
      }),
  });
}
