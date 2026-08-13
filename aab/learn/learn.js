/* ============================================================
   learn.js: the Learn hub's interactive layer.  (v2, bugfix)
   1. MODAL READER: links with class="term" open in a pop-up.
      Terms clicked inside the pop-up load in place, with a back
      button: the rabbit hole. Esc / ✕ / backdrop closes.
   2. FILTER BOX on the hub index.
   v2 fix: article pages live in /learn/terms/, so their internal
   links are RELATIVE (e.g. "dividend.html"). When shown in the
   modal on a different page, those links used to resolve against
   the host page's URL and 404. Now every term link inside the
   modal is rewritten to a root-absolute path resolved against
   the URL the article was fetched from.
   ============================================================ */

(function () {
  const reader = document.getElementById("reader");
  if (!reader) return;

  const body = document.getElementById("reader-body");
  const backBtn = document.getElementById("reader-back");
  const closeBtn = document.getElementById("reader-close");
  const fullLink = document.getElementById("reader-full");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let stack = [];        // absolute pathnames opened in this session
  let lastFocused = null;
  let token = 0;         // guards against a slow load landing after a newer one
  const warmed = new Set();

  /* Warm a term page the moment the reader looks like they might
     open it. The modal fetches the page on click, and on a cold
     cache over a phone connection that fetch is the whole delay,
     which is why the first tap felt broken and the second felt
     instant. A prefetch on hover, focus or pointerdown puts the
     page in the HTTP cache before the tap lands.

     This replaces a prerender: /app.js prerenders every same-origin
     link on hover, and for a term link that is pure waste, because
     clicking one never navigates anywhere. app.js now excludes
     a.term and this picks up the job far more cheaply. */
  function warm(url) {
    if (warmed.has(url)) return;
    warmed.add(url);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = url;
    document.head.append(link);
  }

  for (const ev of ["pointerenter", "focusin", "pointerdown"]) {
    document.addEventListener(ev, (e) => {
      const a = e.target.closest?.("a.term");
      if (a) warm(absPath(a.getAttribute("href")));
    }, { capture: true, passive: true });
  }

  /* Resolve any href to a root-absolute pathname, against an
     explicit base URL (defaults to the current page). */
  function absPath(href, base) {
    return new URL(href, base || location.href).pathname;
  }

  function updateBackBtn() { backBtn.hidden = stack.length < 2; }

  /* Fetch a term page, pull out its <article>, show it in the modal.

     `mine` is a token taken at the start and checked before any
     write. Two loads can be in flight at once, click a term, then
     click another inside the modal before the first arrives, and
     without this the slower one wins and the reader is left looking
     at an article they did not ask for. */
  async function load(url, pushToStack, attempt = 0) {
    const mine = ++token;
    body.innerHTML = skeleton();
    fullLink.href = url;
    try {
      const res = await fetch(url, { cache: "default" });
      if (!res.ok) throw new Error(res.status);
      const html = await res.text();
      if (mine !== token) return;              // a newer load has started
      const doc = new DOMParser().parseFromString(html, "text/html");
      const article = doc.querySelector("article.term-article");
      if (!article) throw new Error("no article");

      // Drop the "back to library" link, redundant inside the modal
      article.querySelector(".backlink")?.remove();

      // THE FIX: rewrite every term link inside the article to a
      // root-absolute path, resolved against the URL this article
      // was fetched from, so "dividend.html" inside
      // /learn/terms/share.html becomes /learn/terms/dividend.html
      // no matter which page is hosting the modal.
      const base = new URL(url, location.origin);
      article.querySelectorAll("a.term").forEach((a) => {
        a.setAttribute("href", absPath(a.getAttribute("href"), base));
      });

      if (mine !== token) return;
      body.innerHTML = "";
      body.appendChild(article);
      body.scrollTop = 0;

      // Reading it in the pop-up counts as reading it, same as the
      // full page does: the hub ticks it off either way.
      const slug = article.dataset.slug;
      if (slug) {
        try {
          const read = new Set(JSON.parse(localStorage.getItem("learn-read") || "[]"));
          read.add(slug);
          localStorage.setItem("learn-read", JSON.stringify([...read]));
        } catch { /* private mode: the tick is a nicety, not a feature */ }
      }

      if (pushToStack && stack[stack.length - 1] !== url) stack.push(url);
    } catch (err) {
      if (mine !== token) return;

      /* One silent retry. A single dropped request on a phone
         connection used to leave this message sitting there with no
         way out but closing the modal and opening it again, which
         is exactly what it looked like from outside: "it doesn't
         work the first time". */
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 350));
        if (mine !== token) return;
        return load(url, pushToStack, 1);
      }

      // Second failure: say so, and offer a button rather than
      // requiring the reader to work out that reopening fixes it.
      body.innerHTML =
        '<p class="reader-loading">লেখাটা লোড করা গেল না। ' +
        '<button type="button" class="btn btn-ghost" id="reader-retry">আবার চেষ্টা করুন</button> ' +
        '<a href="' + url + '">অথবা পুরো পেজে খুলুন</a></p>';
      body.querySelector("#reader-retry")?.addEventListener("click", () => load(url, false));
    } finally {
      updateBackBtn();
    }
  }

  /* A shaped placeholder rather than one line of text: a slow load
     then reads as loading rather than as an empty box. */
  function skeleton() {
    return '<div class="reader-skeleton" aria-label="লোড হচ্ছে" role="status">' +
      '<span class="sk sk-kicker"></span><span class="sk sk-title"></span>' +
      '<span class="sk sk-line"></span><span class="sk sk-line"></span>' +
      '<span class="sk sk-line short"></span><span class="sk sk-line"></span>' +
      '<span class="sk sk-line short"></span></div>';
  }

  function openReader(url) {
    lastFocused = document.activeElement;
    stack = [];
    reader.hidden = false;
    document.body.classList.add("reader-open");
    if (!reduceMotion) {
      reader.classList.add("entering");
      setTimeout(() => reader.classList.remove("entering"), 250);
    }
    load(url, true);
    closeBtn.focus();
  }

  function closeReader() {
    reader.hidden = true;
    document.body.classList.remove("reader-open");
    stack = [];
    if (lastFocused) lastFocused.focus();
  }

  function goBack() {
    if (stack.length < 2) return;
    stack.pop();                          // drop current
    load(stack[stack.length - 1], false); // reload previous
  }

  /* One listener for the whole document: catches term links on the
     page AND inside the modal. Links inside the modal are already
     absolute (rewritten in load), so resolving against location.href
     is always safe here. */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a.term");
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return; // allow open-in-new-tab
    e.preventDefault();
    const url = absPath(a.getAttribute("href"));
    if (reader.hidden) openReader(url);
    else load(url, true);
  });

  backBtn.addEventListener("click", goBack);
  closeBtn.addEventListener("click", closeReader);
  reader.addEventListener("click", (e) => { if (e.target === reader) closeReader(); });
  document.addEventListener("keydown", (e) => {
    if (reader.hidden) return;
    if (e.key === "Escape") closeReader();
  });

  /* The hub's filter box used to live here, matching .term-card
     elements. The hub now has steps, ladder rungs, a contents index
     and a glossary to search as well, so the filter moved to
     hub.js where it can see all four. Leaving a second listener on
     the same input would have been a silent no-op today and a
     confusing double-filter the next time someone touched it. */
})();
