/* The headers a page from here must carry. Two things, neither optional.

   THE SECURITY HEADERS. `aab/_headers` is read by Cloudflare's static
   asset server and applies to files in `aab/`; a response from a Worker
   is not a static asset, and this is a different Worker again. Without
   this an article moves from a page with a CSP to a page with none and
   looks identical either way. `headers()` in next.config.ts is the
   documented place and does not survive the trip: under
   @opennextjs/cloudflare the response comes back with none of them.
   Middleware runs in the Worker itself and does.

   THE CACHING. Next's default for a dynamic route is
   `private, no-cache, no-store, max-age=0, must-revalidate`, which is
   right for a dashboard and wrong for an article: it means every reader
   of a popular piece rebuilds it. The Worker's own route says one minute
   at the edge and ten more while it revalidates. */

import { NextResponse, type NextRequest } from "next/server";
import { SECURITY_HEADERS } from "@reiad/shared/headers";

/* Fresh enough that an edit shows up quickly, cached enough that a
   popular piece is not rebuilt for every reader. The same string
   functions/insights/[slug].ts sends. */
const ARTICLE_CACHE = "public, max-age=60, stale-while-revalidate=600";

    /* ---- and the pages that are one person's ----
       `public` invites every shared cache between here and the reader to
       keep a copy and hand it to the next request for the same address,
       and `stale-while-revalidate` lets one serve a copy up to ten minutes
       past its own expiry.

       THE FAILURE THIS EXISTS FOR: /admin rendered its heading and its two
       credential cards and none of the panels, for days, in one browser
       and not another. Clearing every byte of site data did not fix it,
       which is what ruled out the service worker: what a shared cache
       holds is not the browser's to clear.

       A page whose whole content depends on who is asking cannot be cached
       by anything that does not know who is asking. */
const PRIVATE_CACHE = "private, no-store";

/* Matched on the path so that a route added under one of these
   gets it without knowing this file exists. `/skills/courses` is
   here for the reason at the top of its own section in CLAUDE.md:
   it is somebody else's course, behind `isAdmin()`, and a shared
   copy of it is a redistribution. */
const PRIVATE = [/^\/admin(\/|$)/, /^\/account(\/|$)/, /^\/studio(\/|$)/,
  /^\/skills\/courses(\/|$)/, /^\/work-alpha(\/|$)/];

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }

      /* ---- whose Cache-Control this is ----
         Only a PAGE's. Two kinds of response set their own and must keep
         it. Next's assets under `/_next/` are content-hashed and already
         immutable, so a one-minute line would be a downgrade.

         And a route handler under `/api/` has an opinion about caching
         that this file cannot have: one endpoint wants half an hour at the
         edge and the next wants nothing kept at all. Overwriting it here
         would make a handler's own `no-store` publicly cacheable for a
         minute, silently, on a response that looks exactly right. */
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/_next/") && !path.startsWith("/api/")) {
    res.headers.set("Cache-Control",
      PRIVATE.some((re) => re.test(path)) ? PRIVATE_CACHE : ARTICLE_CACHE);
  }

  return res;
}

export const config = {
  /* Everything except Next's own static output, which needs
     neither the headers nor the cache line above. */
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
