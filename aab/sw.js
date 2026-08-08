/* ============================================================
   sw.js — the service worker.

   Goal: the site keeps working on a bad connection or none at
   all, without ever showing anyone a stale article.

   Strategy, split by what the thing is:

     HTML       network first. You always get the live page when
                the network answers; the cached copy is the
                fallback, and /offline.html is the fallback's
                fallback.
     CSS/JS     stale-while-revalidate. Instant from cache, then
                quietly refreshed for next time.
     Fonts/img  cache first — they don't change, and when they
                do they change name.

   Bump VERSION to retire every old cache in one go.
   ============================================================ */

/* Bump this to retire every old cache. v2: a broken _redirects file
   briefly made several pages unreachable, so any client that cached
   an offline fallback during that window gets a clean slate.

   v3: this file is the only thing that retires a cache, and it did
   not change when the dynamic layer landed — so every returning
   visitor kept being served the shell-v2 copy of app.js, from before
   countView() existed, and kept being served it forever (a script is
   answered from the cache that has it, and only a new VERSION empties
   that cache). Page views went uncounted, and the fix to the Studio
   login could not have reached anyone either. Bump this whenever a
   precached file changes.

   v9: the stock check landed — a new page under /tools/ with its
   own engine, string table and stylesheet block, plus a changed
   crumbs.js. styles.css changed too, and a cached v8 copy would
   render the new page unstyled.

   v8: the index volatility & drawdown case study landed.

   v7: the DCF case study landed alongside the operating model.

   v6: the tools page became a tab set and the first interactive
   portfolio case study landed, so tools.js, styles.css and the new
   /portfolio/ modules all changed together.

   v5: added /activation.js (imported by app.js via api.js and
   progress.js) and the new /learn/contents.html. A cached v4
   app.js would fail to resolve the new import.

   v4: the Learn area was restructured — app.js gained three new
   imports (crumbs, audience, learn progress) and the hub is a
   different page. Without a bump, a returning reader would be
   served the v3 app.js forever and none of it would appear. */
const VERSION = "v9";
const SHELL = `shell-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;

/* Worth having before it's needed, so the first offline visit works.

   app.js is an ES module and its imports are separate requests, so
   each one has to be listed: a cached app.js whose imports 404 is
   worse than no app.js at all. Lesson pages are deliberately NOT
   precached — there are seventy of them, and the runtime cache
   picks up the ones a reader actually opens. */
const PRECACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/styles.css",
  "/app.js",
  "/content.js",
  "/api.js",
  "/crumbs.js",
  "/audience.js",
  "/activation.js",
  "/learn/index.html",
  "/learn/learn.js",
  "/learn/hub.js",
  "/learn/curriculum.js",
  "/learn/progress.js",
  "/learn/icons.js",
  "/learn/contents.html",
  "/learn/contents.js",
  "/tools/index.html",
  "/tools/stock.html",
  "/tools/stock.js",
  "/tools/stock.model.js",
  "/tools/stock.i18n.js",
  "/insights.html",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL)
      .then((cache) => cache.addAll(PRECACHE))
      // one missing file shouldn't stop the whole worker installing
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

const isHTML = (request) =>
  request.mode === "navigate" ||
  (request.headers.get("accept") ?? "").includes("text/html");

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Never cache another origin, and never cache the news feed —
  // stale headlines are worse than no headlines.
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (isHTML(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME).then((c) => c.put(request, copy));
          return response;
        })
        .catch(async () =>
          (await caches.match(request)) ??
          (await caches.match("/offline.html")) ??
          new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } })
        )
    );
    return;
  }

  // everything else: serve what we have, refresh in the background
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME).then((c) => c.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached ?? network;
    })
  );
});
