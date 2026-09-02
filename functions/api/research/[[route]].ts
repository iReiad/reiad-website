/* ============================================================
   /api/research/*: the Research Studio's Worker surface.

   GET  /api/research/status              which indexes are on
   GET  /api/research/lookup/doi/<doi>    one record, verified
   GET  /api/research/lookup/isbn/<isbn>  one book
   GET  /api/research/lookup/url?u=       a page's own tags (the clipper)
   POST /api/research/zotero/pull         a page of somebody's Zotero library

   And the reading room's files, RESEARCH.md section 23, every one
   of them the signed-in reader's own and under their prefix:

   GET    /api/research/files            what the reader holds, against the quota
   PUT    /api/research/file?name=       store one file, answer its key
   GET    /api/research/ticket/<key>     a thirty-minute pass for one file
   GET    /api/research/file/<key>?t=    the bytes, whole or a Range, on that pass
   DELETE /api/research/files            everything under the prefix (the erase)
   POST   /api/research/capture          a web page, fetched, cleaned and stored

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
import { canTicket, checkTicket, mintTicket } from "../../_lib/ticket.ts";
import {
  RESEARCH_TICKET, capturePage, keyIsMine, readFile, removeAll, storeFile, usage,
} from "../../_lib/files.ts";
import type { FilesEnv } from "../../_lib/files.ts";
import type { Reader } from "../../_lib/reader.ts";
import { FILE_CAP, FILE_QUOTA, extOfName } from "../../../shared/research.ts";

interface ResearchEnv extends ScholarEnv, ReaderEnv, FilesEnv {}

/** A page a minute is a person reading; more is a crawler with a
    bearer, which is still somebody else's server being asked. */
const CAPTURES_A_MINUTE = 20;

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
    return methods(request, {
      GET: () => ok({ services: { ...status(env), files: env.MEDIA && canTicket(env) ? "on" : "off" } }),
    });
  }

  /* ---- the files: every branch reads the reader first ---- */
  const whoAsks = async (): Promise<Reader | Response> => {
    let reader: Reader | null;
    try { reader = await readerFrom(request, env); } catch { return fail("bad-token", 401); }
    return reader ?? fail("signed-out", 401);
  };

  if (head === "files") {
    if (!env.MEDIA) return fail("not-configured", 503);
    const bucket = env.MEDIA;
    return methods(request, {
      GET: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        return ok({ ...(await usage(bucket, reader.id)), cap: FILE_CAP, quota: FILE_QUOTA });
      },
      DELETE: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        return ok({ removed: await removeAll(bucket, reader.id) });
      },
    });
  }

  if (head === "file" && route.length === 1) {
    if (!env.MEDIA) return fail("not-configured", 503);
    const bucket = env.MEDIA;
    return methods(request, {
      PUT: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        const buffer = await request.arrayBuffer();
        const name = url.searchParams.get("name") ?? "";
        const stored = await storeFile(bucket, reader.id, buffer, request.headers.get("Content-Type") ?? "", extOfName(name));
        if (!stored.ok) return fail(stored.reason, stored.status, stored.extra ?? {});
        return ok({ key: stored.key, ext: stored.ext, size: stored.size, already: stored.already });
      },
    });
  }

  if (head === "file" && route.length > 1) {
    if (!env.MEDIA) return fail("not-configured", 503);
    const bucket = env.MEDIA;
    const key = route.slice(1).join("/");
    return methods(request, {
      GET: async () => {
        /* The ticket is the whole of the proof here: a <audio> and
           pdf.js's own fetch carry no bearer. It names one key. */
        if (!await checkTicket(env, key, url.searchParams.get("t"), RESEARCH_TICKET)) {
          return fail("no-ticket", 403);
        }
        return readFile(bucket, key, request.headers.get("Range"));
      },
    });
  }

  if (head === "ticket") {
    const key = route.slice(1).join("/");
    return methods(request, {
      GET: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        if (!keyIsMine(reader.id, key)) return fail("not-yours", 403);
        if (!canTicket(env)) return fail("not-configured", 503);
        const t = await mintTicket(env, key, RESEARCH_TICKET);
        return ok({ url: `/api/research/file/${key}?t=${t}` });
      },
    });
  }

  if (head === "capture") {
    if (!env.MEDIA) return fail("not-configured", 503);
    const bucket = env.MEDIA;
    return methods(request, {
      POST: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        if (await throttle({ request, env }, "research-capture", CAPTURES_A_MINUTE, 1)) {
          return fail("too-many", 429);
        }
        const sent = await body(request);
        const address = str(sent.url, 2000);
        if (!address) return fail("missing", 400);
        const got = await capturePage(bucket, reader.id, address);
        if (!got.ok) return fail(got.reason, got.status);
        return ok({ key: got.key, size: got.size, title: got.title, words: got.words, already: got.already });
      },
    });
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
