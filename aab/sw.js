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

   v21: the German school landed. This one is not optional in the
   way a styling change is: content.js now imports
   /deutsch/curriculum.js, and app.js and crumbs.js import
   content.js. A returning visitor holding the v20 shell would be
   served a cached content.js whose new import resolves to
   nothing — the menu, the palette and the breadcrumbs would all
   die together. So the German modules the shell depends on are
   precached alongside it, and the version moves.

   v20: app.js merges database articles into the Ctrl+K index,
   api.js caches the article list, and styles.css gained the folded
   file-publishing tools. All three are precached.

   v19: content.js lost a live article whose slug could never
   resolve, and the Studio learned to open the file-based pieces —
   content.js and styles.css both changed.

   v18: the preview grew a card view, a share-card view, width and
   theme switches, and the per-article social image that goes with
   them — styles.css again.

   v15–v17: the Studio rebuild, in three passes. api.js gained the
   media and Notion clients (v15); styles.css gained the slash menu,
   the figure toolbar and the pre-flight panel (v16); and the desk
   moved onto its own page, taking the dashboard's styles with it
   (v17). styles.css is precached and changed in all three, which is
   exactly the shape of the v3 and v10 mistakes — check-sw.mjs caught
   each one before it shipped.

   v12: the About page was rebuilt — new markup, a new `about`
   cascade layer in styles.css and a small about.js that counts the
   library from content.js rather than trusting a typed number.

   v11: a UI pass — the modal reader prefetches and retries, the
   menu and palette were restructured, the home page gained a
   Bangla half and a models section, and the learn hub's doors
   became buttons. styles.css, app.js, content.js, learn.js,
   hub.js and three precached pages all changed. check-sw.mjs
   caught this one before it shipped, which is what it is for.

   v10: THE SAME MISTAKE AS v3, MADE AGAIN. The stock check shipped
   at v9 and was then fixed three times — the valuation cap, the
   header and slider repairs, and the pillar contributions — each
   touching precached files, and VERSION was not bumped once. Every
   returning visitor kept being served the v9 copies and could not
   see any of it. The reader who reported it was quoting text from
   a string table two commits old.

   The structural fix is below in the fetch handler: the runtime
   cache is now consulted BEFORE the shell, so a background refresh
   actually takes effect. A missed bump now costs one stale load
   instead of freezing a file forever. check-sw.mjs guards the rest.

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
const VERSION = "v21";
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
  /* The German school. curriculum.js is not a nicety here: it is
     an import of content.js, which is an import of app.js and
     crumbs.js, so the shell is broken without it. The hub and the
     practice book are precached too — the book is the page a
     learner opens every evening, and a bus with no signal is
     exactly where they open it.
     (Keep double quotes out of this comment: check-sw.mjs reads
     the list below by pulling quoted strings out of the block.) */
  "/deutsch/curriculum.js",
  "/deutsch/index.html",
  "/deutsch/hub.js",
  "/deutsch/progress.js",
  "/deutsch/icons.js",
  "/deutsch/stufe-1/index.html",
  "/deutsch/stufe-1/arbeitsbuch.html",
  "/deutsch/arbeitsbuch.js",
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

  /* Everything else: serve what we have, refresh in the background.

     RUNTIME IS CHECKED FIRST, AND THAT ORDER IS THE WHOLE POINT.
     A bare caches.match(request) searches every cache in creation
     order, so the precached SHELL copy answers ahead of anything
     the background refresh has written — which means a precached
     file is frozen at whatever VERSION last installed it, and the
     revalidate half of stale-while-revalidate never reaches the
     reader. That is not a theory: styles.css and three stock check
     modules were pinned at v9 through three separate fixes.

     Looking in RUNTIME first makes the refresh mean something. The
     shell remains the fallback, which is all it was ever for: the
     first visit, and offline. */
  event.respondWith((async () => {
    const cached = (await caches.match(request, { cacheName: RUNTIME }))
      ?? (await caches.match(request, { cacheName: SHELL }));

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
  })());
});
