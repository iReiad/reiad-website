/* ============================================================
   scripts/site-api.test.ts: /api/site, the app's view of the
   site's own furniture.

     node scripts/site-api.test.ts

   Two different jobs, and the second is the one worth having.

   ---- 1. nothing private leaves ----

   This endpoint is public and it serialises whole tables, so the
   filters are the only thing between `PAGES` and a reader. A
   `private` page is the Studio, an `unlisted` nav item is the
   course section and `/admin`, and the third-party catalogue is
   somebody else's course and may never be published at all. Each
   is asserted by name.

   ---- 2. a field added to a table still reaches the app ----

   The endpoint spreads objects rather than mapping them field by
   field, and that is the whole reason a new school, a new count
   or a new flag reaches the app with no app release. Hand-picked
   fields would pass every test above and silently drop the field
   somebody adds next year.

   So this walks the SOURCE objects and asserts every key of each
   one survives the trip. It fails on the day somebody "tidies"
   the handler into a mapping, which is a change that looks
   correct and is not.

   The counts are checked against `COUNTS` itself for the same
   reason `check-content.ts` exists: a number this site states
   about itself is derived or it is wrong.
   ============================================================ */

import { onRequest } from "../functions/api/site.ts";
import {
  COUNTS, PAGES, SECTIONS, SITE, SKILLS, TERM_GROUPS, TOOLS,
} from "../shared/content.ts";
import { LADDER_SCHOOLS, NAV } from "../shared/nav.ts";

let failures = 0;
const check = (name: string, got: unknown, want: unknown): void => {
  if (JSON.stringify(got) === JSON.stringify(want)) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}\n       got  ${JSON.stringify(got)}\n       want ${JSON.stringify(want)}`);
};
const okay = (name: string, cond: unknown): void => check(name, !!cond, true);

/** The handler takes the Worker's context shape. Nothing here
    needs `env`: this endpoint reads tables, never a binding, which
    is also why it cannot answer "not configured". */
const call = async (method = "GET"): Promise<{ status: number; headers: Headers; body: any }> => {
  const res = await onRequest({
    request: new Request("https://reiad.co.uk/api/site", { method }),
  } as never);
  const text = await res.text();
  return { status: res.status, headers: res.headers, body: text ? JSON.parse(text) : null };
};

const { status, headers, body } = await call();

/* ---------- the answer itself ---------- */

console.log("\nthe answer");
check("200", status, 200);
check("ok: true", body.ok, true);
/* What this handler SETS, which is not what a reader gets: the
   edge rewrites Cache-Control on /api/* and answers no-store.
   The head of site.ts has the measurement. Asserted anyway, so
   the day somebody drops the header here it is a failure rather
   than a silent agreement with the edge. */
check("says half an hour", headers.get("Cache-Control"), "public, max-age=1800");
check("json", headers.get("Content-Type"), "application/json; charset=utf-8");
okay("nosniff", headers.get("X-Content-Type-Options") === "nosniff");

const post = await call("POST");
check("POST is refused", post.status, 405);
check("and says why", post.body.reason, "method-not-allowed");

/* ---------- 1. nothing private leaves ---------- */

console.log("\nnothing private leaves");
okay("no page marked private", !body.pages.some((page: any) => page.private));
check("and the count matches the public half",
  body.pages.length, PAGES.filter((page) => !page.private).length);
okay("at least one page IS private, so the filter is doing work",
  PAGES.some((page) => page.private));

const items = body.nav.flatMap((group: any) => group.items);
okay("no unlisted menu item", !items.some((item: any) => item.unlisted));
okay("at least one IS unlisted at source",
  NAV.flatMap((group) => group.items).some((item) => item.unlisted));
okay("the course section is not in the menu",
  !items.some((item: any) => String(item.href).startsWith("/skills/courses")));

const whole = JSON.stringify(body);
okay("no Drive id anywhere in the answer", !/[a-zA-Z0-9_-]{28,}/.test(whole));
okay("the catalogue is not named", !whole.includes("courses.data"));

/* ---------- 2. every field survives the trip ---------- */

console.log("\nevery field survives");

/** Every key of `want` is present on `got`. The point is the
    handler spreading rather than picking, so a table gaining a
    field needs no edit here and no app release. */
const carries = (name: string, got: any, want: object): void => {
  const missing = Object.keys(want).filter((key) => !(key in (got ?? {})));
  check(`${name} carries every field`, missing, []);
};

carries("site", body.site, SITE);
carries("a skill", body.skills[0], SKILLS[0]);
carries("a tool", body.tools[0], TOOLS[0]);
carries("a term group", body.termGroups[0], TERM_GROUPS[0]);
carries("a nav group", body.nav[0], { ...NAV[0], items: [] });
carries("a nav item", body.nav[0].items[0], NAV[0].items[0]);
carries("a ladder school", body.ladders[0], LADDER_SCHOOLS[0]);

/* A section's `pieces` is a function and is the one field taken
   out on purpose. Asserted both ways so a future spread cannot
   quietly start shipping it. */
const section = SECTIONS[0];
const sent = body.sections[0];
check("a section carries every field but pieces()",
  Object.keys(section).filter((key) => key !== "pieces" && !(key in sent)), []);
okay("and pieces() is gone", !("pieces" in sent));

/* ---------- the counts are the data's, not a sentence's ---------- */

console.log("\nthe counts");
check("every count agrees with COUNTS", body.counts, JSON.parse(JSON.stringify(COUNTS)));
okay("and there is more than one", Object.keys(body.counts).length > 1);
check("as many nav groups as the table has", body.nav.length, NAV.length);
check("as many skills", body.skills.length, SKILLS.length);
check("as many ladder schools", body.ladders.length, LADDER_SCHOOLS.length);

/* ---------- what is deliberately absent ---------- */

console.log("\nwhat is deliberately absent");
okay("no article bodies: /api/articles answers for those", !("articles" in body));
okay("no lessons: /api/schools answers for those", !("lessons" in body));

console.log(failures
  ? `\n${failures} failure(s).\n`
  : "\nsite api: the furniture serialises, nothing private leaves,"
    + " and every field survives.\n");
process.exit(failures ? 1 : 0);
