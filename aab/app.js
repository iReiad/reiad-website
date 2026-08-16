/* ============================================================
   app.js, sitewide behaviour for reiad.co.uk  (ES module)

   1. Theme        tri-state (system / light / dark), swapped
                   inside a View Transition so it cross-fades.
   2. Palette      Ctrl/Cmd+K search, built at runtime as a
                   native <dialog>, pages don't need the markup,
                   and any legacy <div id="palette"> is upgraded.
   3. Kinetic      the homepage headline, word by word.
   4. Speculation  <script type="speculationrules"> prerenders the
                   link you're about to click, so navigation is
                   instant.
   5. Cards        the Insights list renders from content.js.

   Loaded with <script type="module" src="/app.js">, so it defers
   automatically and never blocks paint.
   NOTE: root-absolute URLs need a web server, preview with
   `python3 -m http.server`, not file://
   ============================================================ */

import {
  searchIndex, formatDate,
  PAGES, TOOLS, STAGES, STUFEN, stufeUrl, SITE, SEARCH_GROUPS,
  SKILLS, skillUrl, COUNTS,
} from "/content.js";
import { countView } from "/api.js";
import { allPieces, piecesIn, filePieces, pieceHref } from "/pieces.js";
import { initCrumbs } from "/crumbs.js";
import { initAudience, audienceBoost } from "/audience.js";
import { recordVisit } from "/learn/progress.js";
import { recordPage } from "/recent.js";
import { initTilt, tiltIn } from "/tilt.js";
import { initStreak } from "/streak.js";

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
    /* The light value is --paper, and it has to be kept in step
       with it by hand: a <meta> cannot read a custom property.
       It is the phone's address bar, so when it drifts, the
       browser chrome is a slightly different white from the page
       under it, which reads as a seam across the top of the
       screen. */
    ?.setAttribute("content", dark ? "#0E1512" : "#FCF9F4");
}

/* The stored choice first, the attribute second.

   The attribute is written before the first paint by the boot
   script at the top of every page and is the quicker of the two
   to read, but it is the one that can go missing. A page rendered
   by the Next.js Worker hydrates, and React restoring an element
   to the way it rendered it takes an attribute a script added
   with it. Reading the DOM then answered "system", which is not
   what anybody chose, and the line below applies it: a reader who
   had asked for light, on a laptop set to dark, watched the page
   go dark a moment after it loaded, every time. */
function currentTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light" || stored === "system") return stored;
  } catch { /* private mode: fall back to what the page says */ }
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

export function addToSearchIndex(pieces) {
  const known = new Set(INDEX.map((i) => i.url));
  const extra = pieces
    .map((piece) => ({
      title: piece.title,
      // Its own mount. This said /insights/ whatever the section
      // was, so the palette offered a kitchen piece at an address
      // that answers 404.
      url: pieceHref(piece),
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
       always eight lessons, a stage and whatever else squeezed in,
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

  /* Every control that opens the palette, not just the one in the
     header. The 404 page had a second "Search the site" button
     carrying id="open-palette-2", which nothing in this file has
     ever listened for: the one page a lost reader lands on offered
     them a search button that did nothing at all when clicked.
     A data attribute means the next page to want one cannot make
     the same mistake. */
  document.getElementById("open-palette")?.addEventListener("click", open);
  for (const node of document.querySelectorAll("[data-open-palette]")) {
    node.addEventListener("click", open);
  }

  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      dialog.open ? dialog.close() : open();
      return;
    }
    // "/" opens search, the way every good reading site does:
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
   A <dialog> built at runtime, so every page gets the same menu
   without carrying its markup, including the pages nobody has
   touched in a year.

   IT IS NOT MODAL, AND THAT IS THE WHOLE DESIGN

   It was modal, and a modal covers the header. So the menu grew
   a bar along its top holding a copy of the header's buttons: a
   ✕, a search button and a theme button, none of which did
   anything the real ones did not already do. Keeping that copy
   standing where the original stood took a measuring pass on
   open and again on resize, and it went wrong twice anyway,
   first when the header grew a fourth button and again after
   that. The fix each time was a better way of imitating the
   header.

   The header does not need imitating. It needs to stay
   clickable. So the menu opens under it and stops short of it:
   the real search and theme buttons are exactly where they
   were, still working, and the real Menu button turns into the
   close button, because the burger already draws itself as a ✕
   while the menu is open. One button, two states, nothing
   measured and nothing to drift.

   What showModal() was doing for free has to be done by hand,
   and it is, below: Escape closes, the page behind is made
   inert and stops scrolling, and focus moves in and comes back
   out to the button that opened it.
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
     column into thirteen paragraphs, taller than the viewport, so
     the last few pages were cut off entirely and the menu read as a
     wall of text rather than a way to get somewhere. The blurbs
     still do their job on the pages that list these properly; a
     menu is for aiming, not for reading. */
  /* `short` where a page has one, which in practice means the case
     studies. Their full titles end ": interactive case study",
     which is worth having in the Ctrl+K index, where someone may
     well type "case study", and is four repetitions of the column
     heading when the column is already called Case studies. Every
     one of them wrapped to two lines because of it. */
  const pageLink = (p) => {
    const a = el("a", { href: p.url }, el("strong", { textContent: p.short ?? p.title }));
    if (p.url === here) a.setAttribute("aria-current", "page");
    return el("li", {}, a);
  };

  const visible = PAGES.filter((p) => !p.private);
  const plainPages = visible.filter((p) => !p.group);
  const caseStudies = visible.filter((p) => p.group === "case");
  const learnPages = visible.filter((p) => p.group === "learn");
  const toolPages = visible.filter((p) => p.group === "tool");
  const deutschPages = visible.filter((p) => p.group === "deutsch");

  /* ============ WHAT THIS MENU LISTS ============

     What is written. Not what is planned.

     It used to list both, and the arithmetic of that was: four of
     the eight Learn stages, three of the four German Stufen and
     five of the six Skills schools are marked "soon", so twelve of
     its forty-two links opened a page whose content is the word
     আসছে. A menu where a quarter of the doors open onto a note
     saying "coming" is a menu people stop opening.

     Anything not yet written is one link to the hub that tracks
     it, and those hubs are built to show what is ready and what is
     not. That is their job and they are better at it than a list
     of dead ends is.

     The five calculator anchors went for a related reason: five
     links to five positions on ONE page, in a menu whose own note
     says it is for aiming rather than reading. The Tools page is
     the aim; the anchors are for when you are already on it. */
  const written = (xs) => xs.filter((x) => x.status !== "soon");
  const someSoon = (xs) => xs.some((x) => x.status === "soon");

  const liveStages = written(STAGES);
  const liveStufen = written(STUFEN);
  const otherSkills = SKILLS.filter((s) => s.slug !== "deutsch");

  /** The one link that stands in for everything not yet written. */
  const moreLink = (href, strong, small) =>
    el("li", { className: "menu-standout" },
      el("a", { href },
        el("strong", { className: "bn-h", textContent: strong }),
        el("small", { textContent: small })
      )
    );

  /* What content.js knows, drawn now, because the menu is built
     synchronously. The database is asked afterwards and the two
     entries are redrawn if it answers with something newer. */
  const articles = filePieces().slice(0, 2);

  /** One entry under "Latest writing". */
  const writingLink = (a) =>
    el("li", {},
      el("a", { href: a.slug ? pieceHref(a) : "/insights.html" },
        el("strong", { textContent: a.title }),
        el("small", {
          textContent: a.date
            ? `${formatDate(a.date, a.lang)} · ${a.minutes} min read`
            : a.dek,
        })
      )
    );

  const dialog = el("dialog", { id: "site-menu", className: "menu" });
  dialog.setAttribute("aria-label", "Site menu");

  dialog.append(
    /* tabindex so open() has somewhere to put focus that is not a
       link. A non-modal dialog focuses its first focusable child,
       and the first child here is "Home". */
    el("div", { className: "menu-grid", tabIndex: -1 },
      /* Pages, with the stock check standing out under them: it is
         a page rather than a calculator, and it was the one line
         worth keeping out of a column of six. */
      el("div", { className: "menu-col" },
        el("span", { className: "mono menu-col-title", textContent: "Pages" }),
        el("ul", { className: "menu-list" },
          ...plainPages.map(pageLink),
          ...toolPages.map((p) =>
            el("li", { className: "menu-standout" },
              el("a", { href: p.url }, el("strong", { textContent: p.short ?? p.title }))
            )
          )
        )
      ),

      /* Second, not last. This column was at the end of the grid,
         which put it below the fold on a 1280px laptop the moment
         the grid dropped to four columns: seven case studies,
         present in the menu and invisible in it. It is also the
         half of the site someone is paying for. */
      el("div", { className: "menu-col" },
        el("span", { className: "mono menu-col-title", textContent: "Case studies" }),
        el("ul", { className: "menu-list" }, ...caseStudies.map(pageLink)),
        el("span", {
          className: "mono menu-col-title menu-col-title-second",
          textContent: articles.length ? "Latest writing" : "Writing",
        }),
        el("ul", { className: "menu-list", id: "menu-writing" },
          ...(articles.length
            ? articles
            : [{ slug: "", title: "Nothing published yet", dek: "" }]
          ).map(writingLink)
        )
      ),

      // The ladder, as far as it is written.
      el("div", { className: "menu-col" },
        el("span", { className: "mono menu-col-title", textContent: "শেখার লাইব্রেরি · Learn" }),
        el("ul", { className: "menu-list" },
          ...liveStages.map((s) =>
            el("li", {},
              el("a", {
                href: s.inline ? "/learn/index.html#starter" : `/learn/${s.slug}/index.html`,
              },
                el("strong", { className: "bn-h", textContent: `${s.kicker} · ${s.bn}` }),
                el("small", { textContent: s.en })
              )
            )
          ),
          ...learnPages.map((p) =>
            el("li", { className: "menu-standout" },
              el("a", { href: p.url }, el("strong", { textContent: p.title }))
            )
          ),
          ...(someSoon(STAGES)
            ? [moreLink("/learn/index.html", "পরের ধাপগুলো",
                `${STAGES.length - liveStages.length} more stages, in progress`)]
            : [])
        )
      ),

      // German as far as it is written, then the rest of the
      // schools as one line rather than five coming-soon anchors.
      el("div", { className: "menu-col" },
        el("span", { className: "mono menu-col-title", textContent: "দক্ষতা · Skills" }),
        el("ul", { className: "menu-list" },
          ...liveStufen.map((s) =>
            el("li", {},
              el("a", { href: stufeUrl(s) },
                el("strong", { className: "bn-h", textContent: `${s.kicker} · ${s.bn}` }),
                el("small", { lang: "de", textContent: s.de })
              )
            )
          ),
          ...deutschPages.map((p) =>
            el("li", { className: "menu-standout" },
              el("a", { href: p.url }, el("strong", { textContent: p.title }))
            )
          ),
          moreLink("/skills/index.html", "আরও দক্ষতা · More schools",
            `${otherSkills.length} being written, plus the rest of German`)
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

  /* And now the database, which the menu could not wait for: it is
     built synchronously so that pressing M always opens something.
     If the database holds anything newer, the two entries under
     "Latest writing" are redrawn from it. If it holds nothing, or
     never answers, what is already on screen stays. */
  allPieces().then((pieces) => {
    const host = dialog.querySelector("#menu-writing");
    if (!host || !pieces.length) return;
    host.replaceChildren(...pieces.slice(0, 2).map(writingLink));
  });

  document.body.append(dialog);
  return dialog;
}

/* Everything on the page except the header, which is the part
   that has to stay usable while the menu is over the rest of it. */
const behindTheMenu = () =>
  [...document.body.children].filter((node) =>
    node.tagName !== "HEADER" && node.tagName !== "DIALOG"
    && node.tagName !== "SCRIPT" && node.tagName !== "STYLE");

function initMenu() {
  const dialog = buildMenu();

  /* A non-modal dialog does not take the page out of the tab order
     the way showModal() does, so it is done here. `inert` is one
     attribute and it does the lot: not focusable, not clickable,
     not read out. */
  const setAside = (yes) =>
    behindTheMenu().forEach((node) => { node.inert = yes; });

  const open = () => {
    if (dialog.open) return;
    dialog.show();
    setAside(true);
    document.body.dataset.menu = "open";
    /* Into the menu, not onto its first link: landing on "Home"
       reads as having pressed something. */
    dialog.querySelector(".menu-grid")?.focus?.();
  };

  const close = () => {
    if (!dialog.open) return;
    dialog.close();
    setAside(false);
    delete document.body.dataset.menu;
    // Back to the button that opened it, which is now Menu again.
    button.focus({ preventScroll: true });
  };

  const toggle = () => (dialog.open ? close() : open());

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

  /* The one button, in its two states. The burger draws itself as
     a ✕ from CSS; the word beside it has to change too, because a
     cross that still says "Menu" is worse than either on its own.

     Both words go in, stacked one on the other, and CSS shows one
     at a time. Swapping the text of a single node instead makes
     the button 15px narrower when it says Menu than when it says
     Close, and since the cluster is pushed to the right-hand end
     of the header, that 15px moves the button itself: press it,
     and it slides out from under the finger that pressed it. A
     grid with both words in one cell is as wide as the longer of
     them, always, in any font, at any size. */
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "site-menu");
  const word = [...button.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
  if (word) {
    word.replaceWith(el("span", { className: "menu-word", ariaHidden: "true" },
      el("span", { className: "menu-word-shut", textContent: "Menu" }),
      el("span", { className: "menu-word-open", textContent: "Close" })
    ));
  }

  const paintButton = () => {
    const shown = dialog.open;
    button.setAttribute("aria-expanded", String(shown));
    button.setAttribute("aria-label", shown ? "Close the menu" : "Open the menu");
  };
  dialog.addEventListener("close", paintButton);
  button.addEventListener("click", () => { toggle(); paintButton(); });

  /* Escape came free with showModal() and does not with show().
     Only when the menu is the frontmost thing: the palette is a
     modal above it and closes itself. */
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dialog.open && !document.querySelector("dialog[open]:modal")) {
      e.preventDefault();
      close();
      paintButton();
    }
  });

  /* Following a link out of the menu leaves it open behind the new
     page on a back-navigation restore, so it is shut on the way. */
  dialog.addEventListener("click", (e) => {
    if (e.target.closest("a")) { close(); paintButton(); }
  });

  addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "m" && !e.ctrlKey && !e.metaKey && !e.altKey
        && !isTyping(e.target)) {
      e.preventDefault();
      toggle();
      paintButton();
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
   built from the SKILLS list in content.js, add a school there
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
     the next, so activeElement is <body>– which read as "they've
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
   3b. HEADER HEIGHT: one number the whole site scrolls by

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

    /* --header-inset: how far the header's content starts from the
       edge of the window. The header lives in a .wrap, so that is
       the page's own left margin at this width, and because the
       wrap is centred it is the right margin too.

       The overlay menu uses it to line its bar, grid and footer up
       with the page underneath. Without it the menu was a
       full-width layout sitting on top of a 1080px one, and the
       visible cost was the close button: the ✕ that undoes the
       Menu button sat 90px to the right of it, because the two
       were measured from different edges. Measured rather than
       calculated, because the scrollbar takes a few pixels off the
       viewport and only the browser knows how many. */
    const wrap = header.querySelector(".wrap");
    if (wrap) {
      const left = Math.round(wrap.getBoundingClientRect().left)
        + parseFloat(getComputedStyle(wrap).paddingInlineStart || 0);
      if (left >= 0) root.style.setProperty("--header-inset", `${Math.round(left)}px`);
    }
  };
  publish();
  // fonts reflow the bar; a resize changes which layout applies
  document.fonts?.ready.then(publish).catch(() => {});
  addEventListener("resize", publish, { passive: true });
  if (typeof ResizeObserver === "function") new ResizeObserver(publish).observe(header);
}

/* ============================================================
   3c. THE NUMBERS THE SITE SAYS ABOUT ITSELF

   Every [data-count] on the page is filled from COUNTS in
   content.js, which counts the data rather than remembering it.

   THE BUG THIS EXISTS FOR

   The portfolio page said "four case studies" while seven
   existed. The stock check was described as thirty-eight ratios
   on one page, thirty-odd on four others and "more than
   thirty-six" in Bangla, for a model that scores forty-four.
   Every one of those was correct on the day it was typed. A
   number in a sentence is a copy of the data, and copies drift.

   The number in the markup stays as the fallback, so a reader
   with no JavaScript still gets a sentence with a number in it
   rather than a gap, and check-content.mjs fails the build if
   that fallback drifts too far from the truth.

   Bangla digits inside a [lang="bn"] element, Latin everywhere
   else: "৮টা ধাপ" in a Bangla sentence and "8 stages" in an
   English one are the same fact, and a Bangla sentence with a
   Latin numeral in the middle of it reads as a machine wrote it.
   ============================================================ */
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const toBangla = (n) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

function initCounts() {
  for (const node of document.querySelectorAll("[data-count]")) {
    const value = COUNTS[node.dataset.count];
    if (value == null) continue;
    node.textContent = node.closest('[lang="bn"]') ? toBangla(value) : String(value);
  }
}

/* ============================================================
   4. SPECULATION RULES, prerender on hover, instant on click
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
            { not: { href_matches: "/studio/*" } },
            { not: { href_matches: "/desk/*" } },
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
   5. INSIGHTS CARDS, rendered from content.js
   ============================================================ */
async function initArticleCards() {
  const host = document.getElementById("article-cards");
  if (!host) return;

  const limit = Number(host.dataset.limit) || Infinity;

  /* One list, whichever store each piece came from, and only the
     section this page is about: the merged list used to be every
     live row in the database, so a kitchen piece appeared on the
     Insights index. */
  /* Every card here is a published piece. The teasers for the
     ones still being written were the Insights index's, and that
     page is a Next.js route as of Stage 11.1: it renders its own,
     from `next/lib/hub.ts`, on the server. What is left is the
     home page's two-card strip, which only ever showed what
     exists. */
  const live = (await piecesIn(host.dataset.section ?? "insights")).slice(0, limit);

  const card = (a) => {
    const el = document.createElement("a");
    el.className = "cell sample-card";
    el.dataset.topics = (a.topics ?? []).join("|");
    el.href = pieceHref(a);
    el.style.textDecoration = "none";
    el.style.color = "inherit";

    const tag = document.createElement("span");
    tag.className = "tag mono";
    tag.textContent = a.tag;

    const h = document.createElement("h3");
    h.textContent = a.title;

    const p = document.createElement("p");
    p.textContent = a.dek;

    const foot = document.createElement("span");
    foot.className = "more";
    const bits = [formatDate(a.date, a.lang), a.minutes ? `${a.minutes} min read` : ""]
      .filter(Boolean)
      .join(" · ");
    foot.textContent = bits ? `${bits}  →` : "Read →";

    el.append(tag, h, p, foot);
    return el;
  };

  host.replaceChildren(...live.map(card));
  tiltIn(host);   // these arrive after initTilt has already run
}

/* The topic chips are not here any more.

   They belonged to the Insights index, which is a Next.js route
   as of Stage 11.1: the chips arrive in the HTML, counted from
   the cards on the server, and `/hub.js` binds the one listener
   they need. This built them in the browser, from a list, after a
   fetch, which is a row of nothing for a reader with no
   JavaScript and for every crawler that runs none. */

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
   resume from. Stored on the device only: it's a bookmark, not
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
  } catch { /* ditto, see /recent.js */ }
}

/* ============================================================
   6. SERVICE WORKER, offline reading, instant repeat visits
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
  allPieces().then((pieces) => {
    if (pieces?.length) addToSearchIndex(pieces);
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
initCounts();
initTilt();
initSpeculation();
initArticleCards();
markLessonRead();
initStreak();

/* Reader accounts, before the service worker rather than after it.
   This import used to be the last line of the file, which put it
   behind a service worker installing and precaching sixty files:
   somebody returning from Google waited half a minute to stop
   looking signed out. It still blocks nothing and its failure is
   still caught, because signing in is optional and a page must not
   depend on it. */
import("/signin.js").then((m) => m.initSignIn()).catch(() => {});

initDynamic();
initServiceWorker();
