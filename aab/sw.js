/* ============================================================
   sw.js: the service worker.

   Goal: the site keeps working on a bad connection or none at
   all, without ever showing anyone a stale article.

   Strategy, split by what the thing is:

     HTML       network first. You always get the live page when
                the network answers; the cached copy is the
                fallback, and /offline.html is the fallback's
                fallback.
     CSS/JS     stale-while-revalidate. Instant from cache, then
                quietly refreshed for next time.
     Fonts/img  cache first: they don't change, and when they
                do they change name.

   Bump VERSION to retire every old cache in one go.
   ============================================================ */

/* Bump VERSION whenever a precached file changes, with a line here
   saying what changed: this file is the only thing that retires a
   cache, so a returning reader keeps the old copy for ever until
   the number moves. `node scripts/check-sw.ts --update` records the
   new hashes.

   v250: a card's scene no longer turns where there is no pointer to
        turn it towards. /fallback.css carries the same stylesheet,
        so its bytes moved.

   v249: comments. Every precached module lost the essay at the top
        of it and this file lost 2,167 lines of changelog, so the
        bytes moved without a line of behaviour changing. */
const VERSION = "v250";
const SHELL = `shell-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;

/* Worth having before it's needed, so the first offline visit works.

   app.js is an ES module and its imports are separate requests, so
   each one has to be listed: a cached app.js whose imports 404 is
   worse than no app.js at all. Lesson pages are deliberately NOT
   precached: there are seventy of them, and the runtime cache
   picks up the ones a reader actually opens. */
const PRECACHE = [
  "/offline.html",
  /* The stylesheet, for the two pages that are files.

     It was `/styles.css` and `/tailwind.css` here, and both are
     gone: the stylesheet is `next/styles/` now and Next emits it
     under a content hash, which a service worker cannot precache
     because it cannot know the name. Every route links the hashed
     one and the runtime cache picks it up on the first visit,
     which is what stale-while-revalidate is for.

     `404.html` and `offline.html` cannot link a hashed name, and
     they are exactly the pages that have to answer when nothing
     else does, so they link this: the same stylesheet with its
     comments taken out, written by `scripts/build-fallback.ts`.
     248 KB against the 416 they were loading. */
  "/fallback.css",
  "/app.js",
  "/content.js",
  "/api.js",
  /* app.js imports this, so a shell without it is an app.js whose
     import resolves to nothing: the menu, the palette and every
     list of writing die together on the first offline visit. */
  "/pieces.js",
  /* Reader accounts. app.js imports signin.js lazily and catches a
     failure, so an offline visit without these is a page with no
     sign-in button rather than a broken one, but the button is
     cheap to keep. */
  "/signin.js",
  "/account.js",
  /* signin.js imports sync.js at the top, so a shell without it is
     a shell whose sign-in button never loads. */
  "/sync.js",
  "/account-page.js",
  /* app.js imports this one EAGERLY, at the top, unlike the three
     above: a shell without it is an app.js whose import 404s, and
     that takes the menu and the palette with it. */
  "/streak.js",
  /* studio.js and desk.js both import this, and a shell without it
     is an editor that cannot save a photo. */
  "/photo.js",
  /* Everything an account holds that is not a tick: saved
     scenarios, targets, and the library of kept pages and notes.
     account-page.js imports it at the top and the stock check
     imports it too, so a shell without it is an account page that
     does not load and a stock check with no Save button. */
  "/saved.js",
  /* How the reader wants to be read to. The boot script in the
     shell applies the same values before the first paint without
     this file, so a stale shell is a preferences panel that does
     not load rather than a page at the wrong size. */
  "/prefs.js",
  /* Every school lesson loads this, and a lesson body a reader
     has offline is exactly where a checklist they were working
     through is. Without it the ticks are gone and the list is
     back to being prose. */
  "/checkpoints.js",
  /* Loaded lazily by an article page. Precached so a thread still
     draws for somebody reading offline. */
  "/audience.js",
  "/activation.js",
  /* app.js imports this one directly, so a cached app.js without
     it is an app.js whose import 404s, which is worse than no
     app.js at all.

     /money/reader.js is the modal term reader, which is the one
     thing on those pages that really does need a browser. */
  "/tilt.js",
  "/money/reader.js",
  "/money/curriculum.js",
  "/money/icons.js",
  /* The German school. curriculum.js is not a nicety here: it is
     an import of content.js, which is an import of app.js and
     crumbs.js, so the shell is broken without it. The hub and the
     practice book are precached too: the book is the page a
     learner opens every evening, and a bus with no signal is
     exactly where they open it.

     Only Stufe 1's book, though, and that is a decision rather
     than an oversight. There are three now, of thirty, sixty and
     ninety days, and every day of every one of them ships as
     static HTML: together they are about 1.8 MB. Precaching all
     three would put a megabyte and a half on the very first visit
     of a reader who may never open Stufe 2. The other two are
     picked up by the runtime cache the first evening they are
     opened, which is the evening before the bus.
     (Keep double quotes out of this comment: check-sw.ts reads
     the list below by pulling quoted strings out of the block.) */
  /* The two modules all three of the schools below now run on.
     progress.js is the ticks, the days and the bookmark, and
     hub.js is the ring, the resume card and the bar: one copy
     each, where there used to be three. A school hub is broken
     without them, so they are precached beside the schools
     rather than left to the runtime cache. */
  "/schools/progress.js",
  "/schools/hub.js",
  /* And the practice books' one engine. Both schools' book
     scripts are four lines over this, so precaching one of them
     without it is the `pieces.js` mistake in the paragraph above:
     an offline visit gets the caller from the cache and its
     import resolves to nothing, and the book that comes back is a
     printed one with none of what was written in it. */
  "/schools/workbook.js",
  "/deutsch/curriculum.js",
  "/deutsch/hub.js",
  "/deutsch/progress.js",
  "/deutsch/icons.js",
  /* The practice book is a route now, so there is no file to
     precache: the runtime cache picks the page up on the first
     visit like every other rendered page. `arbeitsbuch.js` stays,
     because the route still loads it and a book that cannot
     restore what was written is the offline visit going wrong in
     the one place a reader would notice. */
  "/deutsch/arbeitsbuch.js",
  /* The Quranic Arabic school, on exactly the German rule.
     curriculum.js is an import of content.js, so the shell is
     broken without it, and the hub is the page the ladder lives
     on. The sixty day pages are not listed: the runtime cache
     picks up the ones a reader actually opens, and dars.js is the
     script every one of them loads, so it is worth having early. */
  "/quran/curriculum.js",
  "/quran/hub.js",
  "/quran/progress.js",
  "/quran/icons.js",
  "/quran/dars.js",
  "/quran/dhap.js",
  /* The English school, on exactly the same rule as the two
     above. curriculum.js is an import of content.js, so the shell
     is broken without it; the hub is the page the ladder lives
     on; part.js is the script every one of the thirty part pages
     loads. The part pages themselves and the workbook are left to
     the runtime cache: the workbook alone is a third of a
     megabyte of static days, and a reader who never opens it
     should not pay for it on their first visit. */
  "/english/curriculum.js",
  "/english/hub.js",
  "/english/progress.js",
  "/english/icons.js",
  "/english/part.js",
  "/english/term.js",
  /* Beside the German book's, and for the same reason. It was
     missing, which mattered less while it did not work: it keyed
     on a vocabulary the page has not had since the book became a
     route. */
  "/english/workbook.js",
  "/tools/stock.js",
  "/tools/stock.model.js",
  "/tools/stock.i18n.js",
  "/favicon.ico",
];

/* Addresses rather than files, precached the same way.

   Every one of these is a page a Worker
   builds out of the database, so there is nothing in aab/ to hash
   and check-sw.ts does not try: it checks that each one is a
   route worker.js actually forwards, which is the failure that
   would matter here (an address in this list that nothing serves
   is an install that fetches a 404 and caches it).

   Why they are precached at all, when the home page stopped being
   at v77: these are the schools, and the schools are what an
   offline reader is there for. A hub is the ladder and the ladder
   is how somebody finds their place on a train. The 233 lesson
   pages are not here and never were: the runtime cache picks up
   the ones a reader actually opens, which is the same arrangement
   they had as files. */
const RENDERED = [
  "/money",
  "/money/contents",
  "/deutsch",
  "/deutsch/stufe-1",
  "/quran",
  "/english",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL)
      /* One at a time, and one failure costs that entry rather
         than the shell.

         This was cache.addAll() for seventy-seven versions, under
         a comment saying a missing file should not stop the
         worker installing. addAll is atomic: it rejects on the
         first failure and caches NOTHING, so the comment
         described what was wanted and the opposite happened. It
         mattered little while every entry was a file sitting
         beside the request; six of them are pages a Worker builds
         now, and one slow deploy would have emptied the whole
         offline shell. */
      .then((cache) => Promise.allSettled(
        [...PRECACHE, ...RENDERED].map((url) => cache.add(url))
      ))
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

/* ---------- the one file whose name does not change ----------

   Everything else on this site is covered by one of two
   mechanisms and both key off the URL. A Next chunk carries a
   content hash, so a new build is a new address and the cache
   cannot answer for it. A served module is in PRECACHE, so
   `scripts/check-sw.ts` fails the moment its bytes change without
   VERSION moving, and the bump empties the shell.

   `/studio/app.js` is neither, on purpose: `app/vite.config.ts`
   builds it to ONE FILE AT A STABLE PATH so that this file and
   the route that loads it keep naming something real, and it is
   232 KB, so precaching it would put a quarter of a megabyte on
   the first visit of every reader who will never open the Studio.

   Which leaves it on the branch at the bottom of this file, where
   the cache answers first and the network refreshes for next
   time. For a file that changes name that is exactly right. For
   one that does not, it means the Studio is ALWAYS ONE LOAD
   BEHIND: publish a change, open the page, get the previous
   build; reload, get the new one. Every check passed, the deploy
   was correct, and the page was a build old.

   So it is network first, like HTML, with the cache as the
   fallback rather than the answer. The person on this page is the
   person who just changed it and is online; a request per load is
   the right price for an editor never being a version behind, and
   the fallback still opens it on a train. */
const STABLE_BUNDLE = /^\/studio\//;

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Never cache another origin, and never cache the news feed:
  // stale headlines are worse than no headlines.
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  /* A React Server Component payload is not a file, and the
     branch at the bottom of this file treats everything that is
     not HTML as one.

     Next asks for one on every client-side navigation and every
     prefetch, at the route's own address with `_rsc` on it. It is
     THIS BUILD's description of THAT route, it varies on four
     router headers, and a prefetch payload is deliberately
     partial. Served cache-first, one captured under an earlier
     build answers a navigation under the next: the chrome and the
     heading come from the new bundle and the body comes from
     whatever the old payload held.

     /admin lost thirteen panels to this and every check passed,
     because the HTML, the chunks and the stylesheet really were
     correct. Reproducing it needed the page driven in a browser
     with no worker in the way, which is the one thing a check
     that reads files cannot do. */
  if (url.searchParams.has("_rsc")
      || request.headers.has("RSC")
      || request.headers.has("Next-Router-Prefetch")) return;

  /* And the admin panel is one person's. Nothing about it belongs
     in a cache that a later reader at the same machine is handed,
     which is the argument `sync.js` makes about ticks one level
     up. */
  if (url.pathname === "/admin") return;

  if (isHTML(request) || STABLE_BUNDLE.test(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          /* Only a 200 is worth keeping, and this cached EVERY
             answer.

             `fetch` rejects on a network failure and on nothing
             else: a 500, a 404 and a 302 all RESOLVE, so all
             three were written into the runtime cache and served
             back later from the branch below. On 21 August 2026
             two Workers rolled out a minute apart and half a
             dozen pages answered 500 while they did; every reader
             who loaded one had that error page stored, and the
             next time their network failed the worker handed it
             back instead of offline.html. A cached error is worse
             than no cache, because it outlives the minute that
             caused it. */
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME).then((c) => c.put(request, copy));
          }
          return response;
        })
        .catch(async () =>
          (await caches.match(request)) ??
          /* `offline.html` only for something that was asking for
             a page. Handing it back for `/studio/app.js` is a
             script tag whose body is a document, which is a parse
             error in the console instead of an editor that says
             it is offline. */
          (isHTML(request) ? await caches.match("/offline.html") : undefined) ??
          new Response(
            isHTML(request) ? "Offline" : "/* offline */",
            { status: 503, headers: {
              "Content-Type": isHTML(request)
                ? "text/plain" : "text/javascript" } })
        )
    );
    return;
  }

  /* Everything else: serve what we have, refresh in the background.

     RUNTIME IS CHECKED FIRST, AND THAT ORDER IS THE WHOLE POINT.
     A bare caches.match(request) searches every cache in creation
     order, so the precached SHELL copy answers ahead of anything
     the background refresh has written, which means a precached
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
