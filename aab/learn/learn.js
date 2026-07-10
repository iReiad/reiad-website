/* ============================================================
   learn.js — the Learn hub's interactive layer.  (v2, bugfix)
   1. MODAL READER: links with class="term" open in a pop-up.
      Terms clicked inside the pop-up load in place, with a back
      button — the rabbit hole. Esc / ✕ / backdrop closes.
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

  /* Resolve any href to a root-absolute pathname, against an
     explicit base URL (defaults to the current page). */
  function absPath(href, base) {
    return new URL(href, base || location.href).pathname;
  }

  function updateBackBtn() { backBtn.hidden = stack.length < 2; }

  /* Fetch a term page, pull out its <article>, show it in the modal */
  async function load(url, pushToStack) {
    body.innerHTML = '<p class="reader-loading mono">লোড হচ্ছে…</p>';
    fullLink.href = url;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const article = doc.querySelector("article.term-article");
      if (!article) throw new Error("no article");

      // Drop the "back to library" link — redundant inside the modal
      article.querySelector(".backlink")?.remove();

      // THE FIX: rewrite every term link inside the article to a
      // root-absolute path, resolved against the URL this article
      // was fetched from — so "dividend.html" inside
      // /learn/terms/share.html becomes /learn/terms/dividend.html
      // no matter which page is hosting the modal.
      const base = new URL(url, location.origin);
      article.querySelectorAll("a.term").forEach((a) => {
        a.setAttribute("href", absPath(a.getAttribute("href"), base));
      });

      body.innerHTML = "";
      body.appendChild(article);
      body.scrollTop = 0;

      if (pushToStack && stack[stack.length - 1] !== url) stack.push(url);
    } catch (err) {
      // Keep the escape hatches alive: the full-page link still points
      // at the requested URL, and back (if available) still works.
      body.innerHTML =
        '<p class="reader-loading">লেখাটা লোড করা গেল না। ' +
        '<a href="' + url + '">পুরো পেজে খুলে দেখুন</a>' +
        (stack.length >= 2 ? ' — অথবা "ফিরুন" চাপুন।' : '।') +
        '</p>';
    } finally {
      updateBackBtn();
    }
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

  /* ---------- Hub filter box ---------- */
  const filter = document.getElementById("term-filter");
  if (filter) {
    filter.addEventListener("input", () => {
      const q = filter.value.trim().toLowerCase();
      document.querySelectorAll(".term-card").forEach((card) => {
        card.style.display =
          card.textContent.toLowerCase().includes(q) ? "" : "none";
      });
      document.querySelectorAll(".term-grid").forEach((grid) => {
        const anyVisible = [...grid.children].some((c) => c.style.display !== "none");
        grid.closest("section").style.display = anyVisible ? "" : "none";
      });
    });
  }
})();
