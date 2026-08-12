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

import {
  searchIndex, liveArticles, ARTICLES, formatDate, topics,
  PAGES, TOOLS, STAGES, STUFEN, stufeUrl, SITE, SEARCH_GROUPS,
  SKILLS, skillUrl,
} from "/content.js";
import { countView, getArticles } from "/api.js";
import { initCrumbs } from "/crumbs.js";
import { initAudience, audienceBoost } from "/audience.js";
import { recordVisit } from "/learn/progress.js";
import { recordPage } from "/recent.js";
import { initTilt, tiltIn } from "/tilt.js";

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
/* content.js can only list what is written as a file, so a piece
   published through the Studio was live, readable, and unfindable in
   Ctrl+K. The database is merged in once it answers; until then this
   is exactly the index it always was. */
let INDEX = searchIndex();

export function addToSearchIndex(articles) {
  const known = new Set(INDEX.map((i) => i.url));
  const extra = articles
    .map((a) => ({
      title: a.title,
      url: `/insights/${a.slug}.html`,
      hint: "Article",
      kind: "writing",
    }))
    .filter((i) => !known.has(i.url));
  if (extra.length) INDEX = [...extra, ...INDEX];
}

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
    <div class="palette-search">
      <span class="palette-search-mark" aria-hidden="true">⌕</span>
      <div class="palette-search-copy">
        <span class="palette-kicker mono">Search the library</span>
        <input id="palette-input" type="search" autocomplete="off" spellcheck="false"
               placeholder="Pages, articles and Bangla terms…" aria-label="Search">
      </div>
      <kbd class="palette-slash" aria-hidden="true">/</kbd>
    </div>
    <div class="palette-meta">
      <span id="palette-count" class="mono" aria-live="polite"></span>
      <span class="palette-active-hint mono"><kbd>↵</kbd> opens selection</span>
    </div>
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
  const count = dialog.querySelector("#palette-count");
  let active = 0;

  const render = (query) => {
    // Everyone sees every result; the half they came for sorts first.
    // See audience.js for why that is a ranking and never a filter.
    const scored = INDEX.map((item) => ({ item, s: score(item.title, query.trim()) }))
      .filter((r) => r.s > 0)
      .map((r) => ({ ...r, s: r.s + audienceBoost(r.item) }))
      .sort((a, b) => b.s - a.s);

    /* Grouped, not one flat run of twelve. The Learn area is 98 of
       the 117 things in the index, so an ungrouped list was almost
       always eight lessons, a stage and whatever else squeezed in —
       and a reader looking for the Tools page could not see it for
       the lessons. Each group gets a few slots and a heading, so
       every kind of thing on the site stays reachable. */
    const PER_GROUP = 4;
    const groups = SEARCH_GROUPS
      .map(([kind, label]) => [label, scored.filter((r) => r.item.kind === kind)
        .slice(0, PER_GROUP).map((r) => r.item)])
      .filter(([, items]) => items.length);

    active = 0;
    list.replaceChildren();

    if (!groups.length) {
      const li = document.createElement("li");
      li.className = "palette-empty";
      li.innerHTML = `<span aria-hidden="true">⌕</span><strong>No matches yet</strong><small>Try a different word, or search in Bangla.</small>`;
      list.append(li);
      count.textContent = "No results";
      return;
    }

    const total = groups.reduce((sum, [, items]) => sum + items.length, 0);
    count.textContent = query.trim()
      ? `${total} ${total === 1 ? "result" : "results"}`
      : "Start anywhere";

    let n = 0;
    for (const [label, items] of groups) {
      const head = document.createElement("li");
      head.className = "palette-group mono";
      head.textContent = label;
      head.setAttribute("aria-hidden", "true");   // headings are not options
      list.append(head);

      for (const item of items) {
        const li = document.createElement("li");
        li.role = "option";
        if (n === 0) li.className = "active";
        n++;
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
      }
    }
  };

  const move = (delta) => {
    const items = list.querySelectorAll("li:not(.palette-empty):not(.palette-group)");
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
   2b. THE MENU
   A full-screen <dialog> built at runtime, so every page gets
   the same menu without carrying its markup — including the
   pages nobody has touched in a year. showModal() handles the
   focus trap, the backdrop and Escape for free.
   ============================================================ */

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

function menuColumn(title, items, render) {
  return el("div", { className: "menu-col" },
    el("span", { className: "mono menu-col-title", textContent: title }),
    el("ul", { className: "menu-list" }, ...items.map(render))
  );
}

function buildMenu() {
  const here = location.pathname.replace(/\/$/, "/index.html");

  /* Titles only in the menu.

     Every page carried its full blurb here, which turned the first
     column into thirteen paragraphs — taller than the viewport, so
     the last few pages were cut off entirely and the menu read as a
     wall of text rather than a way to get somewhere. The blurbs
     still do their job on the pages that list these properly; a
     menu is for aiming, not for reading. */
  const pageLink = (p) => {
    const a = el("a", { href: p.url }, el("strong", { textContent: p.title }));
    if (p.url === here) a.setAttribute("aria-current", "page");
    return el("li", {}, a);
  };

  const visible = PAGES.filter((p) => !p.private);
  const plainPages = visible.filter((p) => !p.group);
  const caseStudies = visible.filter((p) => p.group === "case");
  const learnPages = visible.filter((p) => p.group === "learn");
  const toolPages = visible.filter((p) => p.group === "tool");
  const deutschPages = visible.filter((p) => p.group === "deutsch");

  const articles = liveArticles().slice(0, 3);

  const dialog = el("dialog", { id: "site-menu", className: "menu" });
  dialog.setAttribute("aria-label", "Site menu");

  dialog.append(
    el("div", { className: "menu-bar" },
      el("span", { className: "mono", textContent: `${SITE.name} · ${SITE.tagline}` }),
      el("button", {
        className: "icon-btn push", id: "menu-close",
        ariaLabel: "Close the menu", textContent: "✕ Esc",
      })
    ),
    el("div", { className: "menu-grid" },
      menuColumn("Pages", plainPages, pageLink),

      el("div", { className: "menu-col" },
        el("span", { className: "mono menu-col-title", textContent: "Tools & calculators" }),
        el("ul", { className: "menu-list" },
          ...TOOLS.map((t) =>
            el("li", {},
              el("a", { href: `/tools/index.html#${t.id}` },
                el("strong", { textContent: t.en }),
                el("small", { className: "bn-h", textContent: t.bn })
              )
            )
          ),
          // the advanced one has its own page, and is the reason
          // anyone would open this column twice
          ...toolPages.map((p) =>
            el("li", { className: "menu-standout" },
              el("a", { href: p.url }, el("strong", { textContent: p.title }))
            )
          )
        )
      ),

      // The whole ladder, in order, so the menu shows how deep the
      // Learn area goes without anyone having to open it first.
      el("div", { className: "menu-col" },
        el("span", { className: "mono menu-col-title", textContent: "শেখার লাইব্রেরি · Learn" }),
        el("ul", { className: "menu-list" },
          ...STAGES.map((s) =>
            el("li", {},
              el("a", {
                href: s.inline ? "/learn/index.html#starter" : `/learn/${s.slug}/index.html`,
              },
                el("strong", { className: "bn-h", textContent: `${s.kicker} · ${s.bn}` }),
                el("small", {
                  textContent: `${s.en}${s.status === "soon" ? " · আসছে" : ""}`,
                })
              )
            )
          ),
          ...learnPages.map((p) =>
            el("li", { className: "menu-standout" },
              el("a", { href: p.url }, el("strong", { textContent: p.title }))
            )
          )
        )
      ),

      /* The other schools get a column of their own rather than a
         line inside the Learn one. Someone who came for German
         is not browsing a finance site that happens to have
         German in it — and four Stufe names take less room than
         one line explaining where they are hiding.

         German is opened out in full because it is the one that
         exists; the rest are named so that a reader can see what
         is coming without opening another page to find out. */
      el("div", { className: "menu-col" },
        el("span", { className: "mono menu-col-title", textContent: "দক্ষতা · Skills" }),
        el("ul", { className: "menu-list" },
          ...STUFEN.map((s) =>
            el("li", {},
              el("a", { href: stufeUrl(s) },
                el("strong", { className: "bn-h", textContent: `${s.kicker} · ${s.bn}` }),
                el("small", {
                  lang: "de",
                  textContent: `${s.de}${s.status === "soon" ? " · আসছে" : ""}`,
                })
              )
            )
          ),
          ...deutschPages.map((p) =>
            el("li", { className: "menu-standout" },
              el("a", { href: p.url }, el("strong", { textContent: p.title }))
            )
          ),
          ...SKILLS.filter((s) => s.slug !== "deutsch").map((s) =>
            el("li", {},
              el("a", { href: skillUrl(s) },
                el("strong", { className: "bn-h", textContent: s.bn }),
                el("small", {
                  textContent: `${s.en}${s.status === "soon" ? " · আসছে" : ""}`,
                })
              )
            )
          )
        )
      ),

      /* The case studies and the newest writing share a column.
         Both are "things to look at" rather than places to go, and
         splitting them into two near-empty columns left the menu
         looking unbalanced — thirteen items beside two. */
      el("div", { className: "menu-col" },
        el("span", { className: "mono menu-col-title", textContent: "Case studies" }),
        el("ul", { className: "menu-list" }, ...caseStudies.map(pageLink)),
        el("span", {
          className: "mono menu-col-title menu-col-title-second",
          textContent: articles.length ? "Latest writing" : "Writing",
        }),
        el("ul", { className: "menu-list" },
          ...(articles.length
            ? articles
            : [{ slug: "", title: "Nothing published yet", dek: "" }]
          ).map((a) =>
            el("li", {},
              el("a", { href: a.slug ? `/insights/${a.slug}.html` : "/insights.html" },
                el("strong", { textContent: a.title }),
                el("small", {
                  textContent: a.date
                    ? `${formatDate(a.date, a.lang)} · ${a.minutes} min read`
                    : a.dek,
                })
              )
            )
          )
        )
      )
    ),
    el("div", { className: "menu-foot" },
      el("a", { className: "btn btn-solid", href: "/contact.html", textContent: "Get in touch" }),
      el("a", { className: "btn btn-ghost", href: `mailto:${SITE.email}`, textContent: SITE.email }),
      el("a", { className: "btn btn-ghost", href: SITE.linkedin, rel: "noopener", textContent: "LinkedIn" }),
      el("span", { className: "mono push menu-hint" },
        el("kbd", { textContent: "Ctrl K" }), " search  ",
        el("kbd", { textContent: "?" }), " shortcuts"
      )
    )
  );

  document.body.append(dialog);
  return dialog;
}

function initMenu() {
  const dialog = buildMenu();
  const open = () => !dialog.open && dialog.showModal();

  // The button lives in the header of every page; if a page predates
  // it, put one next to the search button rather than losing the menu.
  let button = document.getElementById("open-menu");
  if (!button) {
    button = el("button", {
      className: "icon-btn", id: "open-menu",
      ariaLabel: "Open the menu", innerHTML: '<span class="burger" aria-hidden="true"></span>Menu',
    });
    document.getElementById("open-palette")?.before(button);
  }
  button.addEventListener("click", open);
  dialog.querySelector("#menu-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "m" && !e.ctrlKey && !e.metaKey && !e.altKey
        && !isTyping(e.target)) {
      e.preventDefault();
      dialog.open ? dialog.close() : open();
    }
  });
}

const isTyping = (node) =>
  /^(input|textarea|select)$/i.test(node?.tagName) || node?.isContentEditable;

/* ============================================================
   2d. THE SKILLS DROPDOWN

   German used to have its own word in the header. That stopped
   working the moment there was going to be a second non-finance
   school, and a third: seven links was already the width at which
   the inline nav gives up (see the RESPONSIVE note in styles.css),
   and eleven is not a nav bar, it is a list.

   So one word, "Skills", and everything under it. The panel is
   built from the SKILLS list in content.js — add a school there
   and it appears here, on /skills/ and in the overlay menu at
   once, with no page's markup to edit.

   The <a href="/skills/"> that every page ships is what this
   replaces. With JavaScript off that link is still there and
   still goes somewhere useful, which is why the markup is a link
   and the upgrade is a button: a button that navigates nowhere
   would be a dead end without a script to run it.

   Opens on hover AND on click, because both were asked for and
   they want different things: hover opens after a beat so that a
   pointer travelling to Insights doesn't drag the panel open on
   the way past, and closes after a longer one so the diagonal
   trip down to the last item doesn't lose it. Click is instant
   and sticky, which is also what touch gets, since a tap fires
   both.
   ============================================================ */
const HOVER_IN = 90;
const HOVER_OUT = 260;

function skillsPanel() {
  const panel = el("div", { className: "nav-drop", id: "skills-drop", hidden: true });

  for (const s of SKILLS) {
    const link = el("a", { href: skillUrl(s) },
      el("strong", { textContent: s.bn }),
      s.status === "soon"
        ? el("span", { className: "soon mono", textContent: "আসছে" })
        : null,
      el("small", { textContent: s.en })
    );
    panel.append(link);
  }

  panel.append(
    el("a", { className: "nav-drop-all", href: "/skills/index.html" },
      el("strong", { textContent: "সব দক্ষতা · All skills →" })
    )
  );
  return panel;
}

function initSkillsNav() {
  const link = document.querySelector("body > header nav [data-nav-skills]");
  if (!link) return;

  const group = el("div", { className: "nav-group" });
  // carried across so the audience ordering and the responsive
  // rules keep treating this as the nav item it replaced
  if (link.hasAttribute("data-keep")) group.setAttribute("data-keep", "");

  const button = el("button", {
    type: "button", className: "nav-top", id: "skills-top",
    innerHTML: 'Skills <span class="caret" aria-hidden="true">▾</span>',
  });
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-haspopup", "true");
  button.setAttribute("aria-controls", "skills-drop");
  const current = link.getAttribute("aria-current");
  if (current) button.setAttribute("aria-current", current);

  const panel = skillsPanel();
  group.append(button, panel);
  link.replaceWith(group);

  let timer;
  const set = (open) => {
    clearTimeout(timer);
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  };
  const later = (open, delay) => {
    clearTimeout(timer);
    timer = setTimeout(() => set(open), delay);
  };

  group.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "touch") return;   // a tap is a click, not a hover
    later(true, HOVER_IN);
  });
  group.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "touch") return;
    later(false, HOVER_OUT);
  });

  button.addEventListener("click", () => set(panel.hidden));

  /* Tabbing out of the last item, or clicking anywhere else, closes
     it. `relatedTarget` and not document.activeElement: during a
     focusout the focus has left one element and not yet landed on
     the next, so activeElement is <body> — which read as "they've
     gone" for a keyboard user moving from the button INTO the panel,
     closed it under them, and left the .focus() call pointing at a
     display:none link. The deferred check is the fallback for the
     browsers that hand you a null relatedTarget. */
  group.addEventListener("focusout", (e) => {
    if (e.relatedTarget && group.contains(e.relatedTarget)) return;
    setTimeout(() => {
      if (!group.contains(document.activeElement)) set(false);
    });
  });
  addEventListener("click", (e) => {
    if (!group.contains(e.target)) set(false);
  });

  group.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      e.preventDefault();
      set(false);
      button.focus();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (panel.hidden) set(true);
    const items = [...panel.querySelectorAll("a")];
    const at = items.indexOf(document.activeElement);
    const next = e.key === "ArrowDown"
      ? (at + 1) % items.length
      : (at <= 0 ? items.length : at) - 1;
    items[next]?.focus();
  });
}

/* ============================================================
   2c. KEYBOARD SHORTCUTS  ("?")
   ============================================================ */
const SHORTCUTS = [
  ["Ctrl K  /  /", "Search everything"],
  ["M", "Open the menu"],
  ["T", "Light ↔ dark"],
  ["G then H", "Go home"],
  ["G then L", "Go to the Learn hub"],
  ["G then S", "Go to Skills"],
  ["G then D", "Go to Deutsch"],
  ["G then I", "Go to Insights"],
  ["G then T", "Go to Tools"],
  ["?", "This list"],
  ["Esc", "Close anything"],
];

function initShortcuts() {
  const dialog = el("dialog", { id: "shortcuts", className: "sheet" });
  dialog.setAttribute("aria-label", "Keyboard shortcuts");
  dialog.append(
    el("div", { className: "pane-bar" },
      el("span", { className: "mono", textContent: "Keyboard shortcuts" }),
      el("button", { className: "icon-btn push", textContent: "✕", ariaLabel: "Close",
        onclick: () => dialog.close() })
    ),
    el("div", { className: "sheet-body" },
      el("dl", { className: "shortcut-list" },
        ...SHORTCUTS.flatMap(([keys, what]) => [
          el("dt", {}, ...keys.split("  ").map((k) => el("kbd", { textContent: k }))),
          el("dd", { textContent: what }),
        ])
      )
    )
  );
  document.body.append(dialog);

  let goMode = false;
  const GO = {
    h: "/index.html", l: "/learn/index.html", d: "/deutsch/index.html",
    s: "/skills/index.html", i: "/insights.html", t: "/tools/index.html",
  };

  addEventListener("keydown", (e) => {
    if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;

    if (goMode) {
      goMode = false;
      const url = GO[e.key.toLowerCase()];
      if (url) { e.preventDefault(); location.href = url; }
      return;
    }
    if (e.key === "?") { e.preventDefault(); dialog.open ? dialog.close() : dialog.showModal(); }
    if (e.key.toLowerCase() === "g") { goMode = true; setTimeout(() => (goMode = false), 1200); }
    if (e.key.toLowerCase() === "t" && !document.querySelector("dialog[open]")) {
      e.preventDefault();
      document.getElementById("theme-toggle")?.click();
    }
  });
}

/* ============================================================
   3. KINETIC HEADLINE
   ============================================================ */
/* This reads the element's text and rebuilds it as one span per
   word, which means whatever is in #kinetic when this runs is what
   the reader ends up with. The home page carries four possible
   headlines; only ever ONE of them is in the element, because the
   other three are attributes and the swap happens inline next to
   the markup. See the note above the headline in index.html for
   what happened when they were all children of it. */
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
   3b. HEADER HEIGHT — one number the whole site scrolls by

   The header is sticky, so every in-page jump has to clear it.
   That clearance was a hard-coded 5rem, which is right on no
   viewport in particular: the bar is 67px on a desktop and 61px on
   a phone, and it changes again when the Bangla webfonts land and
   reflow it. Measuring it once and publishing it as --header-h
   lets scroll-padding-top be exact everywhere, and means a change
   to the header's padding cannot silently break scrolling on a
   page nobody thought to re-check.
   ============================================================ */
function initHeaderHeight() {
  const header = document.querySelector("header");
  if (!header) return;
  const publish = () => {
    const h = Math.round(header.getBoundingClientRect().height);
    if (h > 0) root.style.setProperty("--header-h", `${h}px`);
  };
  publish();
  // fonts reflow the bar; a resize changes which layout applies
  document.fonts?.ready.then(publish).catch(() => {});
  addEventListener("resize", publish, { passive: true });
  if (typeof ResizeObserver === "function") new ResizeObserver(publish).observe(header);
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
            /* a.term opens in the modal reader and never navigates,
               so prerendering its target is a whole page built for
               nothing. learn.js prefetches those instead, which is
               what the modal's own fetch actually needs. */
            { not: { selector_matches: "[download], [data-no-prerender], a.term" } },
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
async function initArticleCards() {
  const host = document.getElementById("article-cards");
  if (!host) return;

  const limit = Number(host.dataset.limit) || Infinity;

  // The database is the source of truth when it exists; content.js is
  // the fallback, so the page is identical either way.
  const fromApi = await getArticles();
  const source = fromApi?.length
    ? fromApi.map((a) => ({ ...a, status: "live" }))
    : liveArticles();
  const live = source.slice(0, limit);
  // the home page shows what exists; the Insights index also teases what's coming
  const soon = host.dataset.mode === "live" ? [] : ARTICLES.filter((a) => a.status === "soon");
  const liveSlugs = new Set(live.map((a) => a.slug));

  const card = (a) => {
    const el = document.createElement(a.status === "soon" ? "div" : "a");
    el.className = "cell sample-card" + (a.status === "soon" ? " placeholder" : "");
    el.dataset.topics = (a.topics ?? []).join("|");
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

  host.replaceChildren(
    ...live.map(card),
    ...soon.filter((a) => !liveSlugs.has(a.slug)).map(card)
  );
  tiltIn(host);   // these arrive after initTilt has already run
  initTopicFilter(host, live);
}

/** Chips that show/hide the cards by topic, built from what exists. */
function initTopicFilter(host, live = []) {
  const row = document.getElementById("topic-filter");
  if (!row) return;

  // Chips come from whatever is actually on the page right now.
  const counts = new Map();
  live.forEach((a) => (a.topics ?? []).forEach((t) =>
    counts.set(t, (counts.get(t) ?? 0) + 1)));
  const all = counts.size
    ? [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([name, count]) => ({ name, count }))
    : topics();
  const chip = (label, count, value) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.type = "button";
    b.textContent = count === undefined ? label : `${label} · ${count}`;
    b.dataset.topic = value;
    b.setAttribute("aria-pressed", value === "" ? "true" : "false");
    return b;
  };

  row.replaceChildren(
    chip("Everything", live.length || liveArticles().length, ""),
    ...all.map((t) => chip(t.name, t.count, t.name))
  );

  row.addEventListener("click", (e) => {
    const button = e.target.closest("[data-topic]");
    if (!button) return;
    const topic = button.dataset.topic;
    row.querySelectorAll("[data-topic]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b === button))
    );
    host.querySelectorAll("[data-topics]").forEach((c) => {
      c.hidden = topic !== "" && !c.dataset.topics.split("|").includes(topic);
    });
  });
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

/* ============================================================
   5b. READING PROGRESS in the Learn area
   Opening a lesson ticks it off and records it as the place to
   resume from. Stored on the device only — it's a bookmark, not
   analytics, and nothing leaves the browser. The logic lives in
   /learn/progress.js so that the hub, the stage pages and the
   lesson pages all agree on what "read" means.
   ============================================================ */
function markLessonRead() {
  try {
    recordVisit();
  } catch { /* private mode; the tick is a nicety */ }
  try {
    recordPage();
  } catch { /* ditto — see /recent.js */ }
}

/* ============================================================
   6. SERVICE WORKER — offline reading, instant repeat visits
   ============================================================ */
function initServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol !== "https:" && location.hostname !== "localhost") return;
  addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline support is a bonus, never a requirement */
    });
  });
}

/* ============================================================
   7. THE DYNAMIC LAYER
   Both of these no-op on a site whose database isn't set up.
   ============================================================ */
function initDynamic() {
  countView();

  // Every page, not just the ones showing cards: Ctrl+K works
  // everywhere, so the index has to be complete everywhere.
  getArticles().then((articles) => {
    if (articles?.length) addToSearchIndex(articles);
  });
  // Reactions and reader questions attach themselves to article pages,
  // so no article file has to know they exist.
  if (/^\/insights\/[a-z0-9-]+/i.test(location.pathname)) {
    import("/engage.js").catch(() => {});
  }
}

/* ---------- go ---------- */
initTheme();
initHeaderHeight();
initAudience();
initCrumbs();
initPalette();
initMenu();
initSkillsNav();
initShortcuts();
initKinetic();
initTilt();
initSpeculation();
initArticleCards();
markLessonRead();
initDynamic();
initServiceWorker();
