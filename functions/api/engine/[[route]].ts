/* ============================================================
   /api/engine/<package>/<version>/<file>: the lab's engine, served
   from this origin. RESEARCH.md section 14.

   DuckDB's WASM is 35 MB and a Worker's static asset may be 25 MiB
   at most, so the engine cannot be a chunk of the Next build: the
   deploy of the first attempt failed on exactly that. It is a
   public file on a public CDN, and the browser may not fetch it
   there because `connect-src` is 'self', so the Worker fetches it
   once and answers from the edge cache from then on, immutable,
   under this origin. Two files, one pinned version, nothing else:
   a path that is not on the list is a 404, not a proxy.

   No bearer, on purpose: `new Worker(url)` and the worker's own
   fetch of the module cannot carry one, and the file is public
   code that anybody can read at its source.
   ============================================================ */

import { fail } from "../../_lib/http.ts";
import type { RouteContext } from "../../_lib/http.ts";

/** The version the lab was built against: next/package.json pins
    the same one, and lib/duck.ts asks for it by name, so a bump
    is a change in two places that lands together. */
const ENGINE: Record<string, { version: string; files: Record<string, string> }> = {
  "duckdb-wasm": {
    version: "1.29.0",
    files: { "duckdb-eh.wasm": "application/wasm", "duckdb-browser-eh.worker.js": "text/javascript; charset=utf-8" },
  },
};

const SOURCE = "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@";

export async function onRequest(context: RouteContext<Record<string, unknown>, { route?: string[] }>): Promise<Response> {
  const { request, params } = context;
  if (request.method !== "GET" && request.method !== "HEAD") return fail("method", 405);
  const [pkg = "", version = "", file = ""] = params.route ?? [];
  const known = ENGINE[pkg];
  if (!known || known.version !== version || !known.files[file]) return fail("not-found", 404);
  const upstream = await fetch(`${SOURCE}${version}/dist/${file}`, {
    cf: { cacheEverything: true, cacheTtl: 30 * 24 * 3600 },
  } as RequestInit);
  if (!upstream.ok || !upstream.body) return fail("upstream", 502);
  return new Response(request.method === "HEAD" ? null : upstream.body, {
    status: 200,
    headers: {
      "Content-Type": known.files[file],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
