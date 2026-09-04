/* functions/api/site.ts, served at /api/site.

   What this site contains, as JSON, for a client that cannot
   evaluate JavaScript. A browser imports `/content.js`; the
   Android app is not a browser, and an app that had to run an ES
   module to find out how many schools there are would be parsing
   JavaScript to read a table.

   So this is a second SERIALISATION of tables that already exist,
   never a second copy. Typing a number or a label into this file
   is the bug it was written to avoid.

   OBJECTS ARE SPREAD, NOT MAPPED FIELD BY FIELD, so a school
   gaining a field or a new key in `COUNTS` reaches the app the
   next time it asks, with no app release and no edit here.
   Hand-picking fields looks identical today and silently drops
   what somebody adds next year.

   What that costs is one obligation: anything added to those
   tables IS published here the moment it is added. Three things
   are taken out on the way, each because it must never be public:

     - a `Page` marked `private`, which is the Studio;
     - a `NavItem` marked `unlisted`, the course section and
       `/admin`;
     - the third-party course catalogue, which is not this site's
       to publish and is never named in this file at all.

   `pieces` on a section is a FUNCTION, stripped by name below
   rather than left to `JSON.stringify` dropping it quietly.

   Written pieces and school lessons are deliberately NOT here:
   they are rows, they change hourly, and `/api/articles` and
   `/api/schools` answer for them. This is the furniture. */

import { methods, ok, type RouteContext } from "../_lib/http.ts";
import {
  COUNTS, DOOR, PAGES, SECTIONS, SITE, SKILLS, TERM_GROUPS, TOOLS,
} from "../../shared/content.ts";
import { ACCENTS, AUDIENCES, LADDER_SCHOOLS, NAV, ORDER } from "../../shared/nav.ts";
import { bnNum } from "../../shared/schools.ts";
import { GARDEN, GROWN, MOODS, SEASONS } from "../../shared/routine.ts";
import { PACES, TARGET_KINDS } from "../../shared/profile.ts";
import { HEADS } from "../../shared/heads.ts";
import {
  DIET_WORDS, BMI_BANDS, WHTR_BANDS, SEX_FORMS, CUT_SETS,
} from "../../shared/diet-words.ts";
import { WIDGETS, HOME_DEFAULT } from "../../shared/widgets.ts";
import {
  TONES, SOURCE_TYPES, SOURCE_TYPE_IDS, SOURCE_STATUSES, SOURCE_VIAS, NOTE_KINDS,
  NOTE_KIND_NAMES, TASK_LANES, LANE_NAMES, QUESTION_KINDS, QUESTION_KIND_NAMES,
  QUESTION_STATES, EVIDENCE_STANCES, PROJECT_KINDS, PROJECT_KIND_NAMES, PROJECT_STATES,
  LIST_ITEM_STATES, HIGHLIGHT_MEANINGS, MEANING_NAMES, MEANING_TONES, FILE_TYPES, FILE_CAP, FILE_QUOTA,
} from "../../shared/research.ts";
import { RESEARCH_WORDS } from "../../shared/research-words.ts";

/** Half an hour, the same as the market board next door. The
    furniture changes when somebody deploys, so a stale answer is
    at worst one deploy behind.

    WHAT THE READER GETS TODAY IS `no-store`, AND THAT IS NOT THIS
    HANDLER. Something at the edge rewrites Cache-Control on
    `/api/*`, outside this repository: `/api/site` and
    `/api/backup/articles` both answer `no-store` live while
    setting a public max-age here, and `worker.js` returns a
    handler's Response verbatim. The header is set anyway, because
    it is the true statement about this answer. Do not read the
    test's assertion as proof the edge caches: it asserts what this
    file SETS. */
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

        /* The routine tool's own vocabulary: four moods, six
           seasons, five plants and the two task ids the drawings
           hang on, each an id, a name in each language and a
           colour, which is data by this file's own rule and was a
           second copy in Kotlin.

           `PRIVATE_TEMPLATES` is NOT here and never will be: it is
           one person's real day, and `check-courses.ts` already
           refuses it in a public bundle.

           `TEMPLATES`, `FIRST_RUN` and `SCHEMA` are not here
           either, and that will change: the app cannot CREATE a
           routine yet, and a field carried and never drawn is a
           field somebody later mistakes for a feature.
           `ManifestSurfaceTest` in the app fails on one. */
        routine: {
          moods: MOODS.map((mood) => ({ ...mood })),
          seasons: SEASONS.map((season) => ({ ...season })),
          garden: GARDEN.map((plant) => ({ ...plant })),
          grown: { ...GROWN },
        },
        /* The front door's own words, with the counts already
           resolved: `DOOR.facts` names a key of `COUNTS` so that
           nobody can type a number into a sentence, and a client
           should not have to know that indirection. The KEY is
           sent as well, so an app that wants to redraw a count on
           its own can. */
        door: {
          ...DOOR,
          facts: DOOR.facts.map((fact) => ({ ...fact, n: bnNum(COUNTS[fact.count]) })),
        },
        /* The two vocabularies an account answers with. Both are a
           CHECK constraint in Postgres, so a value the app offers
           that this list has not got is a 400 on the whole write:
           sending them is what stops the app spelling them a third
           time. `check-rows.ts` holds all three to the
           migration. */
        /* The Research Studio's vocabularies and words, spread for
           the reason everything above is. Every one is a CHECK
           constraint in the migration and check-research.ts holds
           the two to each other. */
        research: {
          tones: [...TONES],
          sourceTypes: SOURCE_TYPES.map((t) => ({ ...t })),
          sourceTypeIds: [...SOURCE_TYPE_IDS],
          sourceStatuses: [...SOURCE_STATUSES],
          sourceVias: [...SOURCE_VIAS],
          noteKinds: [...NOTE_KINDS],
          noteKindNames: { ...NOTE_KIND_NAMES },
          lanes: [...TASK_LANES],
          laneNames: { ...LANE_NAMES },
          questionKinds: [...QUESTION_KINDS],
          questionKindNames: { ...QUESTION_KIND_NAMES },
          questionStates: [...QUESTION_STATES],
          evidenceStances: [...EVIDENCE_STANCES],
          projectKinds: [...PROJECT_KINDS],
          projectKindNames: { ...PROJECT_KIND_NAMES },
          projectStates: [...PROJECT_STATES],
          listItemStates: [...LIST_ITEM_STATES],
          highlightMeanings: [...HIGHLIGHT_MEANINGS],
          meaningNames: { ...MEANING_NAMES },
          meaningTones: { ...MEANING_TONES },
          /* The extensions alone: the MIME map is the Worker's, and one of
             its values reads as a Drive id to the test that guards the
             course catalogue against leaking through this endpoint. */
          fileExts: Object.keys(FILE_TYPES),
          fileCap: FILE_CAP,
          fileQuota: FILE_QUOTA,
          words: { ...RESEARCH_WORDS },
        },
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
        dietWords: {
          phrases: { ...DIET_WORDS },
          /* The four keyed by a TOKEN the arithmetic returns
             rather than by a phrase id, so a band the app
             computes has a word without the app holding eight
             Bangla sentences of its own. */
          bmiBands: { ...BMI_BANDS },
          whtrBands: { ...WHTR_BANDS },
          sexForms: { ...SEX_FORMS },
          cutSets: { ...CUT_SETS },
        },
        /* What the front page can be made of, and what a reader
           who has arranged nothing gets. The CATALOGUE is data and
           the DRAWING is code: a widget renamed here is renamed on
           a phone at the next fetch, and one this build cannot
           draw is skipped rather than left as a blank rectangle
           with a title on it. */
        widgets: {
          kinds: WIDGETS.map((kind) => ({ ...kind })),
          home: [...HOME_DEFAULT],
        },
        heads: Object.fromEntries(
          Object.entries(HEADS).map(([key, { count, ...head }]) => [key, {
            ...head,
            /* Resolved, and the KEY is dropped rather than sent
               beside it. `DOOR.facts` sends both because there the
               number is its own field and a client can redraw it;
               here it is baked into a sentence, so a client could
               only use the key by re-implementing the slot. */
            lede: count ? head.lede.replace("{n}", bnNum(COUNTS[count])) : head.lede,
          }]),
        ),
      }, {
        "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
      }),
  });
}
