/* ============================================================
   worker.js: the entry point, and the reason CI can build this.

   This site is a Worker with static assets, not a Pages project.
   Everything in `aab/` is uploaded as assets and served by
   Cloudflare directly; this script exists to put the handlers in
   `functions/` in front of a few paths.

   Those handlers are still written to the Pages Functions shape,
   `onRequest(context)`, `context.params`, `context.next()`– because
   that shape is a perfectly good convention and rewriting eight
   files to change nothing would be churn. What Pages did implicitly
   from the directory layout, the table below does explicitly:

     functions/api/auth/[[route]].ts   →  /api/auth/*    params.route  (array)
     functions/insights/[slug].ts      →  /insights/:slug params.slug  (string)

   A double-bracket segment is a catch-all and hands the handler an
   array of path segments; a single-bracket one hands it a string.
   That is the whole of the naming convention, and it is why the
   table carries a parameter name and the routes carry a shape.

   `context.next()` means "I don't want this one"– under Pages that
   fell through to the static file, and here it does the same thing
   by way of the ASSETS binding.

   ---- Routing, and why run_worker_first matters ----

   Workers serve a matching static asset *before* running this
   script. For /api/* that is harmless, since no such file exists.
   For /insights/* it would be wrong: aab/insights/dse-basics.html
   is a real file, so a published-from-the-Studio version of the
   same slug in D1 would never get a look in. wrangler.toml lists
   both prefixes under run_worker_first so this script decides.
   ============================================================ */

import { onRequest as auth } from "./functions/api/auth/[[route]].ts";
import { onRequest as articles } from "./functions/api/articles/[[slug]].ts";
import { onRequest as questions } from "./functions/api/questions/[[id]].ts";
import { onRequest as subscribers } from "./functions/api/subscribers/[[route]].ts";
import { onRequest as enquiries } from "./functions/api/enquiries/[[id]].ts";
import { onRequest as signals } from "./functions/api/signals/[[kind]].ts";
import { onRequest as search } from "./functions/api/search.ts";
import { onRequest as site } from "./functions/api/site.ts";
import { onRequest as tools } from "./functions/api/tools.ts";
import { onRequestGet as news } from "./functions/api/news.ts";
import { onRequestGet as weather } from "./functions/api/weather.ts";
import { onRequest as foods } from "./functions/api/foods.ts";
import { onRequest as media } from "./functions/api/media/[[key]].ts";
import { onRequest as notion } from "./functions/api/notion/[[route]].ts";
import { onRequest as backup } from "./functions/api/backup/[[route]].ts";
import { onRequest as comments } from "./functions/api/comments/[[id]].ts";
import { onRequest as broker } from "./functions/api/broker/[[route]].ts";
import { onRequest as schools } from "./functions/api/schools/[[route]].ts";
import { onRequest as courses } from "./functions/api/courses/[[route]].ts";
import { onRequest as routine } from "./functions/api/routine/[[route]].ts";
import { onRequest as diet } from "./functions/api/diet/[[route]].ts";
import { onRequest as admin } from "./functions/api/admin/[[route]].ts";
import { onRequest as insight } from "./functions/insights/[slug].ts";
import { onRequest as feeds } from "./functions/feeds/[kind].ts";
import { db } from "./functions/_lib/db.ts";
import { syncFromNotion } from "./functions/_lib/sync.ts";
import { writeSnapshot } from "./functions/_lib/backup.ts";

/** prefix → handler, and the name of the catch-all parameter it
    expects (null where the route takes none). */
const API_ROUTES = [
  ["/api/auth", auth, "route"],
  ["/api/articles", articles, "slug"],
  ["/api/questions", questions, "id"],
  ["/api/subscribers", subscribers, "route"],
  ["/api/enquiries", enquiries, "id"],
  ["/api/signals", signals, "kind"],
  ["/api/search", search, null],
  ["/api/site", site, null],
  ["/api/tools", tools, null],
  ["/api/news", news, null],
  ["/api/weather", weather, null],
  /* The portion library itself, which the browser gets by
     importing `shared/foods.ts` and a phone cannot. NOT the
     same thing as `/api/diet/food`, which is a LOOKUP against
     two third-party databases and is rate limited and cached
     per query: this is eighty-three of this site's own rows,
     static, and cached for half an hour like its neighbours. */
  ["/api/foods", foods, null],
  ["/api/media", media, "key"],
  ["/api/notion", notion, "route"],
  ["/api/backup", backup, "route"],
  ["/api/comments", comments, "id"],
  ["/api/broker", broker, "route"],
  ["/api/schools", schools, "route"],
  ["/api/courses", courses, "route"],
  ["/api/routine", routine, "route"],
  ["/api/diet", diet, "route"],
  ["/api/admin", admin, "route"],
];

/* The Cron schedules, as strings, because `event.cron` hands back
   the exact text from wrangler.toml and there is no binding that
   names them. They are here rather than inline in scheduled() so
   that scripts/check-crons.ts can compare these two against that
   file and fail the build when they drift. Drift here is silent:
   the job simply stops running, and nothing anywhere says so. */
export const CRON = {
  notion: "*/15 * * * *",
  backup: "17 3 * * *",
};

/** Photos published through the Studio. Served by the same handler
    that stores them, so there is one place that knows the key
    format, but on a short URL, because it ends up in the HTML of
    every article that has a picture in it. */
const MEDIA = /^\/media\/(.+)$/;

/** Published articles live in D1; the files in aab/insights/,
    aab/cooking/ and aab/travel/ are the ones written by hand. Both
    answer here, and the section decides which mount a database piece
    is served at: the handler falls through when they disagree. */
export const ARTICLE = /^\/(insights|cooking|travel)\/([a-z0-9-]+)(?:\.html)?$/i;

/* ---------- the Next.js allowlist ----------

   archive/TRANSITION.md, Stage 10. A second Worker renders these routes
   through Next.js, and this one stays in front and keeps
   everything else. The allowlist is the whole of the switch:
   adding a path moves it, removing the path moves it back, and
   that is the rollback.

   Nothing is forwarded until a path is in here AND the NEXT
   service binding exists. Both halves are checked below, so this
   file can be deployed before the second Worker exists and change
   nothing at all: `env.NEXT` is undefined, every path is answered
   exactly as it is today, and the route turns on by itself the
   moment the binding is added.

   ---- no address here ends in .html ----

   Task #28. A page of this site is `/about`, `/skills`,
   `/money/basics-1`, and every `.html` spelling of one is a 301
   in `aab/_redirects`. The suffix was never a fact about a route:
   it was a fact about a file, and there are two files left.

   An article and a school lesson are the exception and stay as
   they are, because their `.html` is part of a slug rather than
   part of a route: it is in the rows, in every link inside a
   lesson body, and in the `public.library` row of everybody who
   has saved a piece.

   A path listed in `run_worker_first` never reaches the asset
   router, so a redirect for its old spelling only fires because
   that spelling is NOT listed. Keep the two halves in step:
   `wrangler.toml` names the new address and `_redirects` answers
   for the old one.

   ---- and /_next/, which is not a page ----

   The second entry is not a route anybody visits. It is where the
   Next.js Worker keeps its own JavaScript, and it has to be
   forwarded or the pages that ask for it get this site's 404 page
   back instead.

   That is not hypothetical: with only the article route forwarded,
   an article rendered by Next asked for six scripts under
   /_next/static/ and received six copies of aab/404.html, 404 and
   `text/html`, about 45 KB of waste per page view. The article
   still read, because it is server-rendered and the HTML is
   complete, which is exactly why nobody would have noticed: the
   only symptom is a console full of errors and a React that never
   hydrates, and neither of those shows on a page of prose. The
   first interactive route added in Stage 11 would have been the
   thing that broke, a long way from the cause.

   `run_worker_first` in wrangler.toml has the matching entry.
   Without it the asset router answers first and this is never
   reached. */
export const NEXT_ROUTES = [
  /* All three mounts as of Stage 11.2, which is the same regex
     ARTICLE is: the Next route reads the section out of the URL
     and answers whichever of the three the row belongs to, and
     the parity test holds it to refusing a piece asked for at the
     wrong one. */
  ARTICLE,
  /^\/(insights|cooking|travel)$/i,
  /* The hand-written pages, one at a time, Stage 11.5. Each one
     is here the moment its route exists, which is the same
     moment its file leaves aab/: there is no window in which
     both answer, because run_worker_first takes the address away
     from the asset router in the same commit. */
  /^\/(about|contact|account|skills|tools|portfolio)$/i,
  /^\/tools\/(stock|live|routine|diet)$/i,
  /^\/tools\/routine\/(settings|print|day|year)$/i,
  /^\/tools\/diet\/(you|glossary|goal|trend|year|journal|nutrition|expect|foods|health|summary|habits|keto|recipes|import)$/i,
  /* The admin panel. ADMIN.md is the plan; it is `unlisted` in
     shared/nav.ts for the reason the course section is. */
  /^\/admin$/i,
  /* The Studio's shell. Its bundle is NOT here: that is a file in
     aab/studio/, and the asset router answers it as it always
     has. `/desk` was the other one and is a 301 to /admin in
     aab/_redirects now, which only works because this list and
     run_worker_first both let it fall through to the rules file. */
  /^\/studio$/i,
  /^\/portfolio\/[a-z-]+$/i,
  /* The home page, at the address its canonical link has always
     named. `/index.html` is not here: it 301s to this one, which
     is what the asset router did for it before. */
  /^\/$/,
  /* The third-party course section, /skills/courses/. Its five
     shapes are built a second time in `aab/src/courses.ts`, which
     reads `location.pathname` to decide which of them it is on,
     and `check-courses.ts` fails if the two disagree. Move both
     or neither.

     THE PROGRAMME IS THE FIRST SEGMENT and is why there are five
     rather than four: a certificate holds the courses, so the
     shelf, a programme, a course, a module and a lesson are five
     depths. The tick's id did not gain it, deliberately, and
     `shared/courses.ts` says why beside `lessonId`.

     The `.html` forms are still here, after task #28 took that
     suffix off every address on the site, and they are the one
     place it is TOLERATED rather than redirected.
     `shared/courses.ts` says why beside `lessonOf`: 845 addresses
     generated out of a Drive folder cannot be one redirect rule
     each without going stale the first time that folder changes,
     and the whole section is behind `isAdmin()` and unlisted, so
     there is no canonical to split and no crawler to confuse.

     Longest first in each pair, because the lesson pattern would
     otherwise read `<programme>/<course>/<module>/index.html` as
     a lesson called `index` and 404 it.

     Every one of these serves an EMPTY page: the catalogue is
     admin-only and arrives from /api/courses. See
     `next/components/course-shell.tsx`. */
  /^\/skills\/courses\/?$/i,
  /^\/skills\/courses\/[a-z0-9-]+$/i,
  /^\/skills\/courses\/[a-z0-9-]+\/[a-z0-9-]+$/i,
  /^\/skills\/courses\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/i,
  /^\/skills\/courses\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/i,
  /* and the addresses from before #28 */
  /^\/skills\/courses\/index\.html$/i,
  /^\/skills\/courses\/[a-z0-9-]+\/index\.html$/i,
  /^\/skills\/courses\/[a-z0-9-]+\/[a-z0-9-]+\/index\.html$/i,
  /^\/skills\/courses\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/index\.html$/i,
  /^\/skills\/courses\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\.html$/i,
  /* The four schools, Stage 11.7, and the largest of these by a
     long way: 251 committed pages left `aab/` in the same commit
     that added them.

     A hub, then one pattern covering a stage's ladder AND the
     money school's full index, then a lesson twice. A dot cannot
     get into `[a-z0-9-]+`, which is what keeps every school's own
     modules out of all four: `/money/reader.js` matches none of
     them and falls through to the file. */
  /^\/(money|deutsch|quran|english)$/i,
  /^\/(money|deutsch|quran|english)\/[a-z0-9-]+$/i,
  /^\/(money|deutsch|quran|english)\/[a-z0-9-]+\/[a-z0-9-]+\.html$/i,
  /* The lesson without its suffix, which nothing on this site
     links but the asset router used to answer: while these were
     files, `html_handling` served `dsex.html` for
     `/money/terms/dsex`, and a reader who saved that form would
     have found it dead the day the file left. The route strips
     the suffix before it looks anything up, so both forms find
     the same row. It is also the shape the two practice books
     now have. */
  /^\/(money|deutsch|quran|english)\/[a-z0-9-]+\/[a-z0-9-]+$/i,
  /^\/_next\//,

  /* ---- the one /api/ path this Worker does not answer ----

     Every other `/api/` prefix is in `API_ROUTES` above and is
     handled here. `/api/book/` is Next's, and it is an exception
     with a reason rather than an oversight.

     The practice books are 450KB of TypeScript in
     `next/lib/workbooks/`, and they are read on the server and
     deliberately never sent to a browser as data, because every
     prompt in them has its answer beside it. The Android app
     needs the book without the key, so there is a route for it,
     and the question was only where to put the route.

     Importing the books into `functions/` would bundle all of it
     into THIS Worker, parsed on every request to every endpoint
     on the site. Putting them in D1 would be a migration, an
     import script and a file-and-database pair to keep in step.
     They already live in the Next Worker, which already renders
     them, so the route lives where the data is and nothing is
     copied.

     This entry is what makes it reachable: the API table above is
     consulted FIRST, and `/api/book/...` matches no prefix in it,
     so it falls through to here. `/api/*` is already in
     `run_worker_first`, so the request reaches this Worker at
     all. Both halves are needed and neither is obvious. */
  /^\/api\/book\//,
];

/** A trailing slash off the path, so that the table above is
    written once rather than twice.

    THE BUG. Every one of these pages was a file called
    `index.html`, and Cloudflare's `html_handling` serves
    `deutsch/index.html` at `/deutsch/`, WITH the slash. So the
    directory form was the canonical address of all 21 school hubs
    and stage ladders for as long as they existed: it is what the
    sitemap resolved to, what a crawler indexed, and what anybody
    who bookmarked one has.

    Task #28 dropped `.html` from every address and added a 301
    for `/deutsch/index.html`, which is the OTHER spelling of the
    same page. Nothing covered `/deutsch/`. It matches no pattern
    above, so it fell to the asset router, whose copy of the file
    had left in the same commit, and 21 addresses 404ed on a site
    where every internal link still worked perfectly.

    Stripping it here rather than writing `\/?` into twenty
    regexes is the difference between a rule and a habit: a route
    added next week gets this for free, and cannot be the
    twenty-first that forgot. The request is forwarded UNCHANGED, so
    Next sees the slash and answers with its own 308 to the
    canonical form. One address, one page, one spelling in the
    bar.

    `/` is left alone, because "" is not a path. */
const bare = (path) => (path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path);

/** Is this an address a Next.js route renders?

    Exported because four checks ask exactly this question, and
    each one used to answer it with its own copy of
    `NEXT_ROUTES.some(...)`. Two of the four also wrote
    `ARTICLE.test(path) ||` in front of it, which has been
    redundant since ARTICLE became the first entry of the table.

    A copy is fine while the answer is one line. It stops being
    fine the moment the line grows a `bare()`: the Worker starts
    forwarding `/deutsch/` and four checks go on reporting on a
    site that does not exist. One vocabulary, one place, which is
    the rule `check-rows.ts` already applies to the database. */
export const nextOwns = (path) => NEXT_ROUTES.some((re) => re.test(bare(path)));

/** Is this a path the Next.js Worker owns, and is it reachable? */
const goesToNext = (path, env) => Boolean(env.NEXT) && nextOwns(path);

/** Ask the Next.js Worker, and answer from the assets if it
    declines.

    A 404 from there means what `context.next()` means here. The
    Next.js Worker is a different Worker with no ASSETS binding of
    its own, so 404 is the only way it can say "not mine", and
    this is what turns that into the fall-through it means.

    THE BUG THIS SHAPE EXISTED FOR. Four articles were committed
    HTML rather than rows when this was written, served by the
    asset router because the Worker's own renderer declined a slug
    with no row. Forwarding a whole prefix to a Worker that can
    only 404 would have taken all four off the site the moment the
    service binding was added: every link, every share, every
    search result.

    None of them is a file any more (Stage 11.2), and this shape
    is still what two things rest on. `_redirects` holds a 301 for
    `/insights/dsex`, a term that moved to `/money/terms/`, and
    that rule fires only because the route declines the slug. And
    a slug nobody has written gets this site's own 404 page rather
    than a framework one. */
async function fromNext(request, env) {
  const answer = await env.NEXT.fetch(request);
  if (answer.status !== 404) return answer;
  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request, env, ctx) {
    const path = new URL(request.url).pathname;

    // The Pages Functions context, rebuilt. next() is the fall-through
    // to a static file, which is what these handlers expect it to be.
    const context = (params = {}) => ({
      request,
      env,
      params,
      waitUntil: ctx.waitUntil.bind(ctx),
      passThroughOnException: ctx.passThroughOnException.bind(ctx),
      next: () => env.ASSETS.fetch(request),
      data: {},
    });

    try {
      for (const [prefix, handler, paramName] of API_ROUTES) {
        if (path !== prefix && !path.startsWith(`${prefix}/`)) continue;
        const rest = path.slice(prefix.length).replace(/^\//, "");
        const params = paramName
          ? { [paramName]: rest ? rest.split("/").filter(Boolean) : [] }
          : {};
        return await handler(context(params));
      }

      const image = path.match(MEDIA);
      if (image) return await media(context({ key: image[1].split("/") }));

      // The generated feed and sitemap, with the database merged in.
      if (path === "/feed.xml" || path === "/sitemap.xml") {
        return await feeds(context({ kind: path.slice(1) }));
      }

      /* Before the article route, because the point of the
         allowlist is to take a path away from the handler below
         rather than to race it. `fetch` on a service binding is a
         call into the other Worker, not a network request: no DNS,
         no TLS, and it never leaves Cloudflare. */
      if (goesToNext(path, env)) return await fromNext(request, env);

      const article = path.match(ARTICLE);
      if (article) {
        return await insight(context({
          section: article[1].toLowerCase(),
          slug: article[2],
        }));
      }

      return await env.ASSETS.fetch(request);
    } catch (err) {
      // A thrown handler must not take the site down. The API says so
      // in JSON, because that is what api.js knows how to read; every
      // other path falls back to the file that would have been served.
      console.error("worker error", path, err?.stack ?? err);
      if (path.startsWith("/api/")) {
        return Response.json(
          { ok: false, reason: "server-error" },
          { status: 500, headers: { "Cache-Control": "no-store" } },
        );
      }
      return env.ASSETS.fetch(request);
    }
  },

  /* ---- the Cron triggers ----

     Two schedules, told apart by `event.cron`, which is the exact
     string from wrangler.toml. Matching on the string rather than
     on the time is what stops a change to one schedule silently
     firing the other job: change the cron in wrangler.toml and
     this stops matching, loudly, on the next run.

     Every quarter hour   Notion is where the writing happens, and
                    this is what makes an edit there show up here
                    without anyone pressing anything. It only
                    touches articles that were already imported and
                    published, and only when the Notion page says
                    it is ready. See _lib/sync.ts for why "as you
                    type" is neither possible nor desirable.

     Nightly at 03:17     The snapshot into R2. Seventeen past
                    rather than on the hour because every cron in
                    the world fires on the hour.

     (The quarter-hour schedule is not written out here in cron
     syntax, because the first two characters of it would close
     this comment. That is not a hypothetical: it did, and the
     Worker stopped parsing. The strings themselves are in
     wrangler.toml and in the comparison below, which are the two
     places they have to agree.)

     A throw here would be an unhandled rejection in a context with
     nobody to report it to, so each pass is caught and logged; the
     next run tries again. */
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      const d1 = await db(env);
      if (!d1) return;

      if (event.cron === CRON.backup) {
        try {
          const report = await writeSnapshot(env, d1);
          console.log("backup", JSON.stringify(report));
        } catch (err) {
          console.error("backup failed", err?.stack ?? err);
        }
        return;
      }

      try {
        const report = await syncFromNotion(env, d1, { origin: env.SITE_ORIGIN });
        if (report?.updated?.length || report?.failed?.length) {
          console.log("notion sync", JSON.stringify(report));
        }
      } catch (err) {
        console.error("notion sync failed", err?.stack ?? err);
      }
    })());
  },
};
