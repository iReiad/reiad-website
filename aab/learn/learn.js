/* ============================================================
   learn.js — the Learn hub's interactive layer.
   Two jobs:
   1. The MODAL READER: any link with class="term" opens in a
      pop-up instead of a page reload. Terms clicked *inside*
      the pop-up load into the same pop-up, with a back button —
      the rabbit hole. Esc / ✕ / backdrop click closes it and
      you're exactly where you left off.
   2. The FILTER BOX on the hub index (type to hide cards).
   Progressive enhancement: with JavaScript off, term links are
   normal links and everything still works as full pages.
   ============================================================ */

(function () {
  const reader = document.getElementById("reader");
  if (!reader) return; // page without the modal markup

  const body = document.getElementById("reader-body");
  const backBtn = document.getElementById("reader-back");
  const closeBtn = document.getElementById("reader-close");
  const fullLink = document.getElementById("reader-full");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let stack = [];        // URLs opened in this rabbit-hole session
  let lastFocused = null;

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
      body.innerHTML = "";
      body.appendChild(article);
      body.scrollTop = 0;
      if (pushToStack) stack.push(url);
      backBtn.hidden = stack.length < 2;
    } catch (err) {
      body.innerHTML =
        '<p class="reader-loading">লেখাটা লোড করা গেল না। ' +
        '<a href="' + url + '">পুরো পেজে পড়ুন</a>।</p>';
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
    stack.pop();                       // drop current
    load(stack[stack.length - 1], false); // reload previous
    backBtn.hidden = stack.length < 2;
  }

  /* One listener for the whole document: catches term links on the
     page AND inside the modal (event delegation). */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a.term");
    if (!a) return;
    // let power users open in a new tab as usual
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const url = a.getAttribute("href");
    if (reader.hidden) openReader(new URL(url, location.href).pathname);
    else load(new URL(url, location.href).pathname, true);
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
      // hide a category section entirely if all its cards are hidden
      document.querySelectorAll(".term-grid").forEach((grid) => {
        const anyVisible = [...grid.children].some((c) => c.style.display !== "none");
        grid.closest("section").style.display = anyVisible ? "" : "none";
      });
    });
  }
})();
