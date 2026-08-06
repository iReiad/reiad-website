/* ============================================================
   app.js — sitewide behaviour for reiad.co.uk  (ES module)

   1. Theme        tri-state (system / light / dark), swapped
                   inside a View Transition so it cross-fades.
   2. Palette      Ctrl/Cmd+K search, built at runtime as a
                   native <dialog> — pages don't need the markup,
                   and any legacy <div id="palette"> is upgraded.
   3. Kinetic      the homepage headline, word by word.
   4. Speculation  <script type="speculationrules"> prerenders the
                   link you're about to click, so navigation is
                   instant.
   5. Cards        the Insights list renders from content.js.

   Loaded with <script type="module" src="/app.js">, so it defers
   automatically and never blocks paint.
   NOTE: root-absolute URLs need a web server — preview with
   `python3 -m http.server`, not file://
   ============================================================ */

import { searchIndex, liveArticles, ARTICLES, formatDate } from "/content.js";

/* ============================================================
   1. THEME
   ============================================================ */
const THEME_KEY = "theme";
const root = document.documentElement;

function applyTheme(mode) {
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);

  // keep the browser chrome (mobile address bar) in step
  const dark =
    mode === "dark" ||
    (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark ? "#0E1512" : "#FBFBF7");
}

function currentTheme() {
  return root.getAttribute("data-theme") ?? "system";
}

/** Swap themes inside a view transition when the browser has them. */
function setTheme(mode) {
  localStorage.setItem(THEME_KEY, mode);
  const run = () => applyTheme(mode);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.startViewTransition && !reduce) document.startViewTransition(run);
  else run();
}

function initTheme() {
  applyTheme(currentTheme());

  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const dark =
      currentTheme() === "dark" ||
      (currentTheme() === "system" &&
        matchMedia("(prefers-color-scheme: dark)").matches);
    setTheme(dark ? "light" : "dark");
  });

  // a change made in another tab lands here too
  addEventListener("storage", (e) => {
    if (e.key === THEME_KEY && e.newValue) applyTheme(e.newValue);
  });
}

/* ============================================================
   2. COMMAND PALETTE
   ============================================================ */
const INDEX = searchIndex();

/** Subsequence match with a light score: exact substring wins,
    then word-start, then scattered letters ("dsx" finds DSEX). */
function score(haystack, needle) {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (!n) return 1;
  const at = h.indexOf(n);
  if (at === 0) return 1000;
  if (at > 0) return 600 - at;
  let i = 0;
  for (const ch of h) if (ch === n[i]) i++;
  return i === n.length ? 100 : 0;
}

function buildPalette() {
  // remove the pre-dialog markup older pages still ship
  document.querySelector("div#palette")?.remove();

  const dialog = document.createElement("dialog");
  dialog.id = "palette";
  dialog.setAttribute("aria-label", "Search this site");
  dialog.innerHTML = `
    <input id="palette-input" type="search" autocomplete="off" spellcheck="false"
           placeholder="Search pages, articles and Bangla terms…" aria-label="Search">
    <ul id="palette-list" role="listbox" aria-label="Results"></ul>
    <div class="palette-foot mono">
      <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
      <span><kbd>↵</kbd> open</span>
      <span><kbd>esc</kbd> close</span>
    </div>`;
  document.body.append(dialog);
  return dialog;
}

function initPalette() {
  const dialog = buildPalette();
  const input = dialog.querySelector("#palette-input");
  const list = dialog.querySelector("#palette-list");
  let active = 0;

  const render = (query) => {
    const results = INDEX.map((item) => ({ item, s: score(item.title, query.trim()) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((r) => r.item);

    active = 0;
    list.replaceChildren();

    if (!results.length) {
      const li = document.createElement("li");
      li.className = "palette-empty";
      li.textContent = "No matches — try a different word.";
      list.append(li);
      return;
    }

    results.forEach((item, i) => {
      const li = document.createElement("li");
      li.role = "option";
      if (i === 0) li.className = "active";
      const a = document.createElement("a");
      a.href = item.url;
      const t = document.createElement("span");
      t.textContent = item.title;
      const h = document.createElement("span");
      h.className = "hint";
      h.textContent = item.hint;
      a.append(t, h);
      li.append(a);
      list.append(li);
    });
  };

  const move = (delta) => {
    const items = list.querySelectorAll("li:not(.palette-empty)");
    if (!items.length) return;
    items[active]?.classList.remove("active");
    active = (active + delta + items.length) % items.length;
    items[active].classList.add("active");
    items[active].scrollIntoView({ block: "nearest" });
  };

  const open = () => {
    if (dialog.open) return;
    input.value = "";
    render("");
    dialog.showModal();
  };

  document.getElementById("open-palette")?.addEventListener("click", open);

  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      dialog.open ? dialog.close() : open();
      return;
    }
    // "/" opens search, the way every good reading site does —
    // unless you're already typing in a field.
    if (e.key === "/" && !dialog.open && !/^(input|textarea)$/i.test(e.target.tagName)
        && !e.target.isContentEditable) {
      e.preventDefault();
      open();
    }
  });

  input.addEventListener("input", () => render(input.value));

  dialog.addEventListener("keydown", (e) => {
    // An <input type="search"> swallows the first Escape to clear itself,
    // so the dialog would stay open. Close it ourselves instead.
    if (e.key === "Escape") { e.preventDefault(); dialog.close(); }
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    if (e.key === "Enter") {
      e.preventDefault();
      list.querySelector("li.active a")?.click();
    }
  });

  // click outside the panel closes it
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
}

/* ============================================================
   3. KINETIC HEADLINE
   ============================================================ */
function initKinetic() {
  const el = document.getElementById("kinetic");
  if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const words = el.textContent.trim().split(/\s+/);
  el.replaceChildren();
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "w";
    span.style.setProperty("--i", i);
    span.textContent = word;
    el.append(span);
    if (i < words.length - 1) el.append(" ");
  });
}

/* ============================================================
   4. SPECULATION RULES — prerender on hover, instant on click
   ============================================================ */
function initSpeculation() {
  if (!HTMLScriptElement.supports?.("speculationrules")) return;
  // Save-Data users don't want pages they might not read
  if (navigator.connection?.saveData) return;

  const rules = document.createElement("script");
  rules.type = "speculationrules";
  rules.textContent = JSON.stringify({
    prerender: [
      {
        where: {
          and: [
            { href_matches: "/*" },
            { not: { href_matches: "/studio.html" } },
            { not: { selector_matches: "[download], [data-no-prerender]" } },
          ],
        },
        eagerness: "moderate", // on hover / pointerdown
      },
    ],
  });
  document.head.append(rules);
}

/* ============================================================
   5. INSIGHTS CARDS — rendered from content.js
   ============================================================ */
function initArticleCards() {
  const host = document.getElementById("article-cards");
  if (!host) return;

  const live = liveArticles();
  const soon = ARTICLES.filter((a) => a.status === "soon");

  const card = (a) => {
    const el = document.createElement(a.status === "soon" ? "div" : "a");
    el.className = "cell sample-card" + (a.status === "soon" ? " placeholder" : "");
    if (a.status !== "soon") {
      el.href = `/insights/${a.slug}.html`;
      el.style.textDecoration = "none";
      el.style.color = "inherit";
    }

    const tag = document.createElement("span");
    tag.className = "tag mono";
    tag.textContent = a.status === "soon" ? "Coming soon" : a.tag;

    const h = document.createElement("h3");
    h.textContent = a.title;

    const p = document.createElement("p");
    if (a.status === "soon") {
      const em = document.createElement("em");
      em.textContent = a.dek;
      p.append(em);
    } else {
      p.textContent = a.dek;
    }

    el.append(tag, h, p);

    if (a.status !== "soon") {
      const foot = document.createElement("span");
      foot.className = "more";
      const bits = [formatDate(a.date, a.lang), a.minutes ? `${a.minutes} min read` : ""]
        .filter(Boolean)
        .join(" · ");
      foot.textContent = bits ? `${bits}  →` : "Read →";
      el.append(foot);
    }
    return el;
  };

  host.replaceChildren(...live.map(card), ...soon.map(card));
}

/* ============================================================
   Small shared helpers (the Studio imports these)
   ============================================================ */

/** Fire-and-forget toast using the popover API. */
export function toast(message) {
  let el = document.getElementById("app-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "app-toast";
    el.className = "toast";
    el.popover = "manual";
    el.setAttribute("role", "status");
    document.body.append(el);
  }
  el.textContent = message;
  el.showPopover?.();
  clearTimeout(el._t);
  el._t = setTimeout(() => el.hidePopover?.(), 2600);
}

/** Copy text, with a fallback for insecure contexts. */
export async function copyText(text, message = "Copied") {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.append(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  toast(message);
}

/** Download a Blob (or string) as a file. */
export function download(filename, data, type = "text/html;charset=utf-8") {
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- go ---------- */
initTheme();
initPalette();
initKinetic();
initSpeculation();
initArticleCards();
