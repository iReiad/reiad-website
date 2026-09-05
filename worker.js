/* worker.js: the entry point.

   This site is a Worker with static assets, not a Pages project.
   Everything in `aab/` is uploaded as assets and served by
   Cloudflare directly; this script puts the handlers in
   `functions/` in front of a few paths.

   Those handlers keep the Pages Functions shape, `onRequest(context)`,
   `context.params`, `context.next()`. What Pages did implicitly from
   the directory layout, the table below does explicitly:

     functions/api/auth/[[route]].ts   ->  /api/auth/*    params.route  (array)
     functions/insights/[slug].ts      ->  /insights/:slug params.slug  (string)

   A double-bracket segment is a catch-all and hands the handler an
   array of path segments; a single-bracket one hands it a string.
   `context.next()` means "not mine" and falls through to the
   ASSETS binding.

   ROUTING. Workers serve a matching static asset BEFORE running
   this script, so every prefix this file claims has to be listed
   under `run_worker_first` in wrangler.toml or it is never
   reached. */

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
import { onRequest as research } from "./functions/api/research/[[route]].ts";
import { onRequest as engine } from "./functions/api/engine/[[route]].ts";
import { onRequest as survey } from "./functions/api/survey/[[route]].ts";
import { runAlerts } from "./functions/_lib/scholar-search.ts";
import { onRequest as admin } from "./functions/api/admin/[[route]].ts";
import { onRequest as workAlpha } from "./functions/api/work-alpha.ts";
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
     importing `shared/foods.ts` and a phone cannot. NOT the same
     thing as `/api/diet/food`, which is a LOOKUP against two
     third-party databases, rate limited and cached per query. */
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
  ["/api/research", research, "route"],
  ["/api/engine", engine, "route"],
  ["/api/survey", survey, "route"],
  ["/api/admin", admin, "route"],
  /* Is this reader the owner of /work-alpha. The state itself
     never passes through here. */
  ["/api/work-alpha", workAlpha, null],
];

/* The Cron schedules, as strings, because `event.cron` hands back
   the exact text from wrangler.toml and there is no binding that
   names them. Here rather than inline in scheduled() so that
   scripts/check-crons.ts can compare these against that file:
   drift is silent, and the job simply stops running. */
export const CRON = {
  notion: "*/15 * * * *",
  backup: "17 3 * * *",
  /* The Research Studio's alerts, Monday at six: every flagged
     search rerun. functions/_lib/scholar-search.ts. */
  alerts: "0 6 * * 1",
};

/** Photos published through the Studio. Served by the same handler
    that stores them, so one place knows the key format, but on a
    short URL, because it ends up in the HTML of every article that
    has a picture in it. */
const MEDIA = /^\/media\/(.+)$/;

/** Published articles live in D1; the files in aab/insights/,
    aab/cooking/ and aab/travel/ are the ones written by hand. Both
    answer here, and the section decides which mount a database
    piece is served at: the handler falls through when they
    disagree. */
export const ARTICLE = /^\/(insights|cooking|travel)\/([a-z0-9-]+)(?:\.html)?$/i;

/* ---------- the Next.js allowlist ----------

   A second Worker renders these routes through Next.js; this one
   stays in front and keeps everything else. The allowlist is the
   whole of the switch, and it is also the rollback. Nothing is
   forwarded until a path is in here AND the NEXT service binding
   exists, so this file can be deployed before the second Worker
   and change nothing.

   THREE FILES HAVE TO AGREE OR THE ADDRESS IS DEAD. A path listed
   here must also be in `run_worker_first` in wrangler.toml, or the
   asset router answers first and this is never reached; and its
   OLD `.html` spelling must be ABSENT from `run_worker_first`, or
   the 301 for it in `aab/_redirects` never fires.

   No address here ends in `.html`. An article and a school lesson
   are the exception, because their suffix is part of a slug rather
   than part of a route: it is in the rows, in every link inside a
   lesson body, and in the `public.library` row of everybody who
   has saved a piece.

   ---- and /_next/, which is not a page ----

   The second entry is where the Next.js Worker keeps its own
   JavaScript. IT HAS TO STAY FORWARDED: without it those requests
   get this site's 404 page back, 404 and `text/html`, and the
   article still reads because it is server-rendered, so the only
   symptom is a React that never hydrates. `run_worker_first` has
   the matching entry. */
export const NEXT_ROUTES = [
  /* All three mounts, which is the same regex ARTICLE is: the Next
     route reads the section out of the URL and answers whichever
     of the three the row belongs to, and the parity test holds it
     to refusing a piece asked for at the wrong one. */
  ARTICLE,
  /^\/(insights|cooking|travel)$/i,
  /* The hand-written pages, one at a time. Each is here the moment
     its route exists, which is the same moment its file leaves
     aab/: run_worker_first takes the address away from the asset
     router in the same commit, so there is no window in which both
     answer. */
  /^\/(about|contact|account|skills|tools|portfolio)$/i,
  /^\/tools\/(stock|live|routine|diet)$/i,
  /^\/tools\/routine\/(settings|print|day|year)$/i,
  /^\/tools\/diet\/(you|glossary|goal|trend|year|journal|nutrition|expect|foods|health|summary|habits|keto|recipes|import)$/i,
  /* The Research Studio, RESEARCH.md: the board, seventeen rooms
     and their children, as one prefix, so a room added to the
     table gets this without knowing about it. */
  /^\/tools\/research(\/.*)?$/i,
  /* The admin panel. ADMIN.md is the plan; it is `unlisted` in
     shared/nav.ts for the reason the course section is. */
  /^\/admin$/i,
  /* The owner's research control room. `ownerOnly` in
     shared/nav.ts; answers 404 to everybody else. */
  /^\/work-alpha$/i,
  /* The Studio's shell. Its bundle is NOT here: that is a file in
     aab/studio/, and the asset router answers it. `/desk` is a 301
     to /admin in aab/_redirects, which only works because this
     list and run_worker_first both let it fall through to the
     rules file. */
  /^\/studio$/i,
  /^\/portfolio\/[a-z-]+$/i,
  /* The home page, at the address its canonical link has always
     named. `/index.html` is not here: it 301s to this one. */
  /^\/$/,
  /* The third-party course section, /skills/courses/. Its five
     shapes are built a second time in `aab/src/courses.ts`, which
     reads `location.pathname` to decide which of them it is on,
     and `check-courses.ts` fails if the two disagree. Move both
     or neither.

     THE PROGRAMME IS THE FIRST SEGMENT and is why there are five
     rather than four. The tick's id did not gain it, deliberately,
     and `shared/courses.ts` says why beside `lessonId`.

     The `.html` forms are the one place that suffix is TOLERATED
     rather than redirected, and `shared/courses.ts` says why
     beside `lessonOf`: 845 addresses generated out of a Drive
     folder cannot each be a redirect rule without going stale the
     first time the folder changes, and the whole section is behind
     `isAdmin()` and unlisted.

     Longest first in each pair, because the lesson pattern would
     otherwise read `<programme>/<course>/<module>/index.html` as a
     lesson called `index` and 404 it.

     Every one of these serves an EMPTY page: the catalogue is
     admin-only and arrives from /api/courses. */
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
  /* The four schools. A hub, then one pattern covering a stage's
     ladder AND the money school's full index, then a lesson twice.
     A dot cannot get into `[a-z0-9-]+`, which is what keeps every
     school's own modules out of all four: `/money/reader.js`
     matches none of them and falls through to the file. */
  /^\/(money|deutsch|quran|english)$/i,
  /^\/(money|deutsch|quran|english)\/[a-z0-9-]+$/i,
  /^\/(money|deutsch|quran|english)\/[a-z0-9-]+\/[a-z0-9-]+\.html$/i,
  /* The lesson without its suffix, which nothing on this site
     links but the asset router used to answer, so a reader who
     saved that form would have found it dead the day the file
     left. The route strips the suffix before it looks anything up,
     so both forms find the same row. It is also the shape the two
     practice books have. */
  /^\/(money|deutsch|quran|english)\/[a-z0-9-]+\/[a-z0-9-]+$/i,
  /^\/_next\//,

  /* ---- the one /api/ path this Worker does not answer ----

     `/api/book/` is Next's. The practice books are 450KB of
     TypeScript in `next/lib/workbooks/`, read on the server and
     never sent to a browser as data, because every prompt has its
     answer beside it; the Android app needs the book without the
     key. Importing them into `functions/` would bundle all of it
     into THIS Worker, parsed on every request to every endpoint.

     This entry is what makes it reachable: `API_ROUTES` is
     consulted FIRST and `/api/book/...` matches no prefix in it,
     so it falls through to here, and `/api/*` is in
     `run_worker_first` so the request reaches this Worker at all.
     Both halves are needed and neither is obvious. */
  /^\/api\/book\//,
];

/** A trailing slash off the path, so the table above is written
    once rather than twice.

    Cloudflare's `html_handling` served `deutsch/index.html` at
    `/deutsch/`, WITH the slash, so the directory form was the
    canonical address of all 21 school hubs and stage ladders: what
    the sitemap resolved to, what a crawler indexed, what a
    bookmark holds. Dropping `.html` from every address left it
    matching no pattern above, and 21 addresses 404ed on a site
    where every internal link still worked.

    Stripping it here rather than writing `\/?` into twenty regexes
    is the difference between a rule and a habit: a route added
    next week cannot be the twenty-first that forgot. The request
    is forwarded UNCHANGED, so Next answers with its own 308 to the
    canonical form.

    `/` is left alone, because "" is not a path. */
const bare = (path) => (path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path);

/** Is this an address a Next.js route renders?

    Exported because four checks ask exactly this, and each used to
    keep its own copy of `NEXT_ROUTES.some(...)`. A copy is fine
    while the answer is one line, and stops being fine the moment
    the line grows a `bare()`: the Worker starts forwarding
    `/deutsch/` and four checks go on reporting on a site that does
    not exist. */
export const nextOwns = (path) => NEXT_ROUTES.some((re) => re.test(bare(path)));

/** Is this a path the Next.js Worker owns, and is it reachable? */
const goesToNext = (path, env) => Boolean(env.NEXT) && nextOwns(path);

/** Ask the Next.js Worker, and answer from the assets if it
    declines.

    A 404 from there means what `context.next()` means here: the
    Next.js Worker has no ASSETS binding of its own, so 404 is the
    only way it can say "not mine".

    Two things still rest on that. `_redirects` holds a 301 for
    `/insights/dsex`, a term that moved to `/money/terms/`, and
    that rule fires only because the route declines the slug. And a
    slug nobody has written gets this site's own 404 page rather
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
         call into the other Worker: no DNS, no TLS, and it never
         leaves Cloudflare. */
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

     Two schedules, told apart by `event.cron`, the exact string
     from wrangler.toml. Matching on the string rather than on the
     time is what stops a change to one schedule silently firing
     the other job: change the cron and this stops matching,
     loudly, on the next run.

     Every quarter hour   Notion is where the writing happens, and
                    this is what makes an edit there show up here.
                    Only articles already imported and published,
                    and only when the Notion page says it is ready.

     Nightly at 03:17     The snapshot into R2. Seventeen past
                    rather than on the hour because every cron in
                    the world fires on the hour.

     The quarter-hour schedule is NOT written out here in cron
     syntax: the first two characters of it would close this
     comment, and did, and the Worker stopped parsing. The strings
     are in wrangler.toml and in the comparison below.

     A throw here would be an unhandled rejection with nobody to
     report it to, so each pass is caught and logged. */
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      const d1 = await db(env);
      if (!d1) return;

      if (event.cron === CRON.alerts) {
        try {
          const report = await runAlerts(env, d1);
          console.log("research alerts", JSON.stringify(report));
        } catch (err) {
          console.error("research alerts failed", err?.stack ?? err);
        }
        return;
      }

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
