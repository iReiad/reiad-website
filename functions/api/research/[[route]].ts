/* ============================================================
   /api/research/*: the Research Studio's Worker surface.

   GET  /api/research/status              which indexes are on
   GET  /api/research/lookup/doi/<doi>    one record, verified
   GET  /api/research/lookup/isbn/<isbn>  one book
   GET  /api/research/lookup/url?u=       a page's own tags (the clipper)
   POST /api/research/zotero/pull         a page of somebody's Zotero library

   `RESEARCH.md` sections 10 and 22. This is the WHOLE of the
   studio's Worker surface in stage 1, and the split is the diet
   tool's: the reader's own rows are the browser's, read and
   written as the reader through PostgREST, and somebody else's
   database is the Worker's. Nothing about a reader's rows passes
   through here.

   ---- public on purpose, but for the pull ----

   The lookups take no bearer: they read public indexes and
   answer with a record anybody could fetch, and they are what
   makes the capture box work on the one page of this tool that
   needs no account to be useful. `scripts/check-admin.ts` names
   this file as public with that reason. They are throttled,
   because an anonymous relay to somebody else's service is the
   thing the open internet abuses first.

   The Zotero pull is the exception: it carries the reader's own
   API key in the body for one request and never stores it, and
   it answers only a signed-in reader, because a relay that
   forwards any key it is handed to Zotero is a relay.
   ============================================================ */

import { body, fail, methods, ok, str } from "../../_lib/http.ts";
import type { RouteContext } from "../../_lib/http.ts";
import { throttle } from "../../_lib/auth.ts";
import { readerFrom } from "../../_lib/reader.ts";
import type { ReaderEnv } from "../../_lib/reader.ts";
import { byDoi, byIsbn, clip, status, zoteroPull } from "../../_lib/scholar.ts";
import type { ScholarEnv } from "../../_lib/scholar.ts";

interface ResearchEnv extends ScholarEnv, ReaderEnv {}

/** Generous for a capture box, tight for a relay: sixty lookups
    a minute from one address is a person pasting a reading list,
    six hundred is a script. */
const LOOKUPS_A_MINUTE = 60;

export async function onRequest(
  context: RouteContext<ResearchEnv, { route?: string[] }>,
): Promise<Response> {
  const { request, env, params } = context;
  const route = params.route ?? [];
  const url = new URL(request.url);
  const head = route[0] ?? "";

  if (head === "status") {
    return methods(request, { GET: () => ok({ services: status(env) }) });
  }

  if (head === "lookup") {
    return methods(request, {
      GET: async () => {
        /* `throttle` answers true when the caller is OVER the
           line, and only where D1 and a real origin exist: on a
           local dev server it answers false and nothing here
           needs to know. */
        if (await throttle({ request, env }, "research-lookup", LOOKUPS_A_MINUTE, 1)) {
          return fail("too-many", 429);
        }
        const kind = route[1] ?? "";
        if (kind === "doi") {
          const doi = decodeURIComponent(route.slice(2).join("/"));
          const found = await byDoi(env, doi);
          return found ? ok({ found }) : fail("not-found", 404);
        }
        if (kind === "isbn") {
          const found = await byIsbn(env, str(route[2], 40));
          return found ? ok({ found }) : fail("not-found", 404);
        }
        if (kind === "url") {
          const found = await clip(env, str(url.searchParams.get("u"), 2000));
          return found ? ok({ found }) : fail("not-found", 404);
        }
        return fail("not-found", 404);
      },
    });
  }

  if (head === "zotero" && route[1] === "pull") {
    return methods(request, {
      POST: async () => {
        let reader;
        try { reader = await readerFrom(request, env); } catch { return fail("bad-token", 401); }
        if (!reader) return fail("signed-out", 401);
        const sent = await body(request);
        const userId = str(sent.userId, 20).replace(/\D/g, "");
        const key = str(sent.key, 80);
        const start = Math.max(0, Number(sent.start ?? 0) || 0);
        if (!userId || !key) return fail("missing", 400);
        try {
          const page = await zoteroPull(userId, key, start);
          return ok({ page });
        } catch (e) {
          const reason = e instanceof Error ? e.message : "zotero";
          return fail(/403|401/.test(reason) ? "zotero-refused" : "zotero-failed", 502);
        }
      },
    });
  }

  return fail("not-found", 404);
}
