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

     functions/api/auth/[[route]].js   →  /api/auth/*    params.route  (array)
     functions/insights/[slug].js      →  /insights/:slug params.slug  (string)

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

import { onRequest as auth } from "./functions/api/auth/[[route]].js";
import { onRequest as articles } from "./functions/api/articles/[[slug]].js";
import { onRequest as questions } from "./functions/api/questions/[[id]].js";
import { onRequest as subscribers } from "./functions/api/subscribers/[[route]].js";
import { onRequest as enquiries } from "./functions/api/enquiries/[[id]].js";
import { onRequest as signals } from "./functions/api/signals/[[kind]].js";
import { onRequest as search } from "./functions/api/search.js";
import { onRequestGet as news } from "./functions/api/news.js";
import { onRequest as media } from "./functions/api/media/[[key]].js";
import { onRequest as notion } from "./functions/api/notion/[[route]].js";
import { onRequest as backup } from "./functions/api/backup/[[route]].js";
import { onRequest as comments } from "./functions/api/comments/[[id]].js";
import { onRequest as insight } from "./functions/insights/[slug].js";
import { onRequest as feeds } from "./functions/feeds/[kind].js";
import { db } from "./functions/_lib/db.js";
import { syncFromNotion } from "./functions/_lib/sync.js";
import { writeSnapshot } from "./functions/_lib/backup.js";

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
  ["/api/news", news, null],
  ["/api/media", media, "key"],
  ["/api/notion", notion, "route"],
  ["/api/backup", backup, "route"],
  ["/api/comments", comments, "id"],
];

/* The Cron schedules, as strings, because `event.cron` hands back
   the exact text from wrangler.toml and there is no binding that
   names them. They are here rather than inline in scheduled() so
   that scripts/check-crons.mjs can compare these two against that
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
const ARTICLE = /^\/(insights|cooking|travel)\/([a-z0-9-]+)(?:\.html)?$/i;

/* ---------- the Next.js allowlist ----------

   TRANSITION.md, Stage 10. A second Worker renders these routes
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

   ---- why one section and not all three ----

   The plan says "exactly one entry: /insights/<slug>", and it is
   worth taking literally rather than generously. The first version
   of this line forwarded the ARTICLE regex, which is all three
   reading mounts, on the grounds that the Next route handles them
   identically and the parity test proves it. That is true and it
   is still the wrong first move: every piece in the kitchen and on
   the travel desk is a committed file today, so forwarding those
   two mounts would put a Worker hop in front of pieces the
   database has never heard of, for no gain and with a new way to
   fail.

   Stage 11 adds the other two, when there is a reason to.

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
const NEXT_ROUTES = [
  /^\/insights\/([a-z0-9-]+)(?:\.html)?$/i,
  /^\/_next\//,
];

/** Is this a path the Next.js Worker owns, and is it reachable? */
const goesToNext = (path, env) =>
  Boolean(env.NEXT) && NEXT_ROUTES.some((re) => re.test(path));

/** Ask the Next.js Worker, and fall back to a file if it has none.

    THE BUG THIS SHAPE EXISTS FOR, BEFORE IT HAPPENED

    Four articles on this site are still committed HTML rather than
    database rows: the two in aab/insights/, the one about onions
    and the one about visas. Today they are served by the asset
    router because `functions/insights/[slug].js` calls
    `context.next()` when D1 has no row.

    The Next.js Worker cannot do that. It is a different Worker with
    no ASSETS binding of its own, so all it can say is 404, and
    forwarding a whole prefix to it would have taken those four
    pieces off the site the moment the service binding was added.
    Every link to them, every share, every search result.

    So a 404 from there means the same thing `context.next()` means
    here, and is answered the same way. Anything else is the piece
    itself and goes straight back. */
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
                    it is ready. See _lib/sync.js for why "as you
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
