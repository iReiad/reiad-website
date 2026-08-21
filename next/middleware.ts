/* ============================================================
   middleware.ts: the headers a page from here must carry.

   Two things, and neither is optional.

   ---- the security headers ----

   `aab/_headers` is read by Cloudflare's static asset server. It
   sets the frame policy, the sniffing policy, HSTS and the whole
   Content-Security-Policy on every file in `aab/`. A response from
   a Worker is not a static asset, so none of it applies, and this
   is a different Worker again. Without this an article would move
   from a page with a CSP to a page with none, and look identical
   either way.

   `headers()` in next.config.ts is the documented place for this
   and does not survive the trip: under @opennextjs/cloudflare the
   response came back with none of them. Middleware runs in the
   Worker itself and does.

   ---- the caching ----

   Next's default for a dynamic route is
   `private, no-cache, no-store, max-age=0, must-revalidate`,
   which is right for a dashboard and wrong for an article: it
   means every reader of a popular piece rebuilds it. The Worker's
   own route says one minute at the edge and ten more while it
   revalidates, and a piece rendered here should not suddenly cost
   more to read than the same piece rendered there.
   ============================================================ */

import { NextResponse, type NextRequest } from "next/server";
import { SECURITY_HEADERS } from "@reiad/shared/headers";

/* Fresh enough that an edit shows up quickly, cached enough that a
   popular piece is not rebuilt for every reader. The same string
   functions/insights/[slug].ts sends. */
const ARTICLE_CACHE = "public, max-age=60, stale-while-revalidate=600";

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }

  /* Only the article itself. Next's own assets under /_next/ are
     content-hashed and already immutable, and overwriting their
     Cache-Control with a one-minute one would be a downgrade. */
  if (!request.nextUrl.pathname.startsWith("/_next/")) {
    res.headers.set("Cache-Control", ARTICLE_CACHE);
  }

  return res;
}

export const config = {
  /* Everything except Next's own static output, which needs
     neither the headers nor the cache line above. */
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
