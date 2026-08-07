/* ============================================================
   worker.js — the entry point for the whole site.

   reiad.co.uk is a Cloudflare **Worker** with static assets, not a
   Pages project. That distinction matters more than it sounds:
   Pages routes requests to files under functions/ by their path,
   and Workers do not. There is no file-based routing here — this
   file is the router, and it dispatches to the same handlers.

   How a request flows:

     1. Static assets are matched first. /index.html, /styles.css,
        /insights/dse-basics.html and friends never reach this code.
     2. Anything under /api/ comes here (run_worker_first in
        wrangler.toml guarantees it, whatever the asset layout).
     3. /insights/<slug> comes here only when no file matched, so a
        piece published through the Studio renders from the database
        while every committed article keeps being served from disk.
     4. Everything else falls through to the assets binding.

   The handlers themselves are unchanged and still live under
   functions/. They take a Pages-shaped context — { request, env,
   params, next, waitUntil } — and this file builds one. Keeping
   that shape means the same code runs under `wrangler dev` here and
   would still work on Pages, and there is one implementation of
   each endpoint rather than two.
   ============================================================ */

import { onRequest as authRoute } from "./functions/api/auth/[[route]].js";
import { onRequest as articlesRoute } from "./functions/api/articles/[[slug]].js";
import { onRequest as questionsRoute } from "./functions/api/questions/[[id]].js";
import { onRequest as subscribersRoute } from "./functions/api/subscribers/[[route]].js";
import { onRequest as enquiriesRoute } from "./functions/api/enquiries/[[id]].js";
import { onRequest as signalsRoute } from "./functions/api/signals/[[kind]].js";
import { onRequest as searchRoute } from "./functions/api/search.js";
import { onRequestGet as newsRoute } from "./functions/api/news.js";
import { onRequest as articlePage } from "./functions/insights/[slug].js";

/* Each entry: the prefix, the handler, and the name the handler
   expects its trailing path segments under. */
const API_ROUTES = [
  ["/api/auth", authRoute, "route"],
  ["/api/articles", articlesRoute, "slug"],
  ["/api/questions", questionsRoute, "id"],
  ["/api/subscribers", subscribersRoute, "route"],
  ["/api/enquiries", enquiriesRoute, "id"],
  ["/api/signals", signalsRoute, "kind"],
  ["/api/search", searchRoute, null],
  ["/api/news", newsRoute, null],
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    /* The context a Pages Function is handed. `next()` is what a
       handler calls to say "not mine" — under Pages that means the
       static asset, and it means the same thing here. */
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
      /* ---------- the API ---------- */
      for (const [prefix, handler, paramName] of API_ROUTES) {
        if (path !== prefix && !path.startsWith(`${prefix}/`)) continue;

        const rest = path.slice(prefix.length).replace(/^\//, "");
        const params = paramName
          ? { [paramName]: rest ? rest.split("/").filter(Boolean) : [] }
          : {};
        return await handler(context(params));
      }

      /* ---------- articles that live in the database ----------
         Only reached when no file matched, so committed articles
         are untouched. The handler calls next() itself if the slug
         isn't in the database, which lands on the 404 page. */
      const article = path.match(/^\/insights\/([a-z0-9-]+)(?:\.html)?$/i);
      if (article) {
        return await articlePage(context({ slug: article[1] }));
      }

      /* ---------- everything else is a file ---------- */
      return await env.ASSETS.fetch(request);
    } catch (err) {
      // A broken endpoint must never take the site down: log it and
      // let the reader have the page they asked for.
      console.error("worker error", path, err?.stack ?? err);
      if (path.startsWith("/api/")) {
        return Response.json(
          { ok: false, reason: "server-error" },
          { status: 500, headers: { "Cache-Control": "no-store" } }
        );
      }
      return env.ASSETS.fetch(request);
    }
  },
};
