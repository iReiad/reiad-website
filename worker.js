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
import { onRequest as insight } from "./functions/insights/[slug].js";
import { onRequest as feeds } from "./functions/feeds/[kind].js";
import { db } from "./functions/_lib/db.js";
import { syncFromNotion } from "./functions/_lib/sync.js";

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
];

/** Photos published through the Studio. Served by the same handler
    that stores them, so there is one place that knows the key
    format, but on a short URL, because it ends up in the HTML of
    every article that has a picture in it. */
const MEDIA = /^\/media\/(.+)$/;

/** Published articles live in D1; the files in aab/insights/ are the
    ones written before the Studio existed. Both answer here. */
const ARTICLE = /^\/insights\/([a-z0-9-]+)(?:\.html)?$/i;

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

      const article = path.match(ARTICLE);
      if (article) return await insight(context({ slug: article[1] }));

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

  /* ---- the Cron trigger ----

     Notion is where the writing happens; this is what makes an edit
     there show up here without anyone pressing anything. It only
     touches articles that were already imported and published, and
     only when the Notion page says it is ready, see _lib/sync.js
     for why "as you type" is neither possible nor desirable.

     A throw here would be an unhandled rejection in a context with
     nobody to report it to, so the whole pass is caught and logged;
     the next run tries again. */
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        const d1 = await db(env);
        if (!d1) return;
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
