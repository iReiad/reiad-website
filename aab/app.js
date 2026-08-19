/* ============================================================
   app.ts, sitewide behaviour for reiad.co.uk  (ES module)

   1. Theme        tri-state (system / light / dark), swapped
                   inside a View Transition so it cross-fades.
   2. Palette      Ctrl/Cmd+K search, built at runtime as a
                   native <dialog>, pages don't need the markup,
                   and any legacy <div id="palette"> is upgraded.
   3. Shortcuts    "?" opens the sheet.
   4. Speculation  <script type="speculationrules"> prerenders the
                   link you're about to click, so navigation is
                   instant.
   What left, August 2026: the overlay menu, the Skills hover
   panel, the measured header height and the kinetic headline.
   All four belonged to a header bar this site no longer has; the
   menu is a rail rendered on the server by
   `next/components/sidebar.tsx`. See section 2b. The Insights
   card list went the same way and section 5 says where to.

   Loaded with <script type="module" src="/app.js">, so it defers
   automatically and never blocks paint.
   NOTE: root-absolute URLs need a web server, preview with
   `python3 -m http.server`, not file://
   ============================================================ */
import { searchIndex, SEARCH_GROUPS, COUNTS } from "/content.js";
import { countView } from "/api.js";
import { allPieces, pieceHref } from "/pieces.js";
import { initAudience, audienceBoost } from "/audience.js";
import { initTilt } from "/tilt.js";
import { initStreak } from "/streak.js";
/* Imported for its side effect, which is the point of it: reading
   `reader-prefs` and putting the type scale and the measure on
   <html>. Every Next.js route already does that before the first
   paint in the boot script in `next/components/shell.tsx`, so on
   a route this changes nothing and costs one no-op.

   The six pages that are NOT routes are why it is here: the four
   practice books, 404 and offline carry their own inline boot
   script, and none of them knows about preferences. Without this
   a reader who set Comfortable would find the four pages they
   read offline were the only ones that ignored it. */
import "/prefs.js";
/* ============================================================
   1. THEME
   ============================================================ */
const THEME_KEY = "theme";
const root = document.documentElement;
function applyTheme(mode) {
    if (mode === "system")
        root.removeAttribute("data-theme");
    else
        root.setAttribute("data-theme", mode);
    // keep the browser chrome (mobile address bar) in step
    const dark = mode === "dark" ||
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
        if (stored === "dark" || stored === "light" || stored === "system")
            return stored;
    }
    catch { /* private mode: fall back to what the page says */ }
    return root.getAttribute("data-theme") ?? "system";
}
/** Swap themes inside a view transition when the browser has them. */
function setTheme(mode) {
    localStorage.setItem(THEME_KEY, mode);
    const run = () => applyTheme(mode);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduce)
        document.startViewTransition(run);
    else
        run();
}
function initTheme() {
    applyTheme(currentTheme());
    document.getElementById("theme-toggle")?.addEventListener("click", () => {
        const dark = currentTheme() === "dark" ||
            (currentTheme() === "system" &&
                matchMedia("(prefers-color-scheme: dark)").matches);
        setTheme(dark ? "light" : "dark");
    });
    // a change made in another tab lands here too
    addEventListener("storage", (e) => {
        if (e.key === THEME_KEY && e.newValue)
            applyTheme(e.newValue);
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
    if (extra.length)
        INDEX = [...extra, ...INDEX];
}
/** Subsequence match with a light score: exact substring wins,
    then word-start, then scattered letters ("dsx" finds DSEX). */
function score(haystack, needle) {
    const h = haystack.toLowerCase();
    const n = needle.toLowerCase();
    if (!n)
        return 1;
    const at = h.indexOf(n);
    if (at === 0)
        return 1000;
    if (at > 0)
        return 600 - at;
    let i = 0;
    for (const ch of h)
        if (ch === n[i])
            i++;
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
    /* Non-null because `buildPalette()` above wrote all three into
       the markup this line is querying. */
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
            head.setAttribute("aria-hidden", "true"); // headings are not options
            list.append(head);
            for (const item of items) {
                const li = document.createElement("li");
                li.role = "option";
                if (n === 0)
                    li.className = "active";
                n++;
                const a = document.createElement("a");
                a.href = item.url;
                const t = document.createElement("span");
                t.textContent = item.title;
                const h = document.createElement("span");
                h.className = "hint";
                h.textContent = item.hint ?? "";
                a.append(t, h);
                li.append(a);
                list.append(li);
            }
        }
    };
    const move = (delta) => {
        const items = list.querySelectorAll("li:not(.palette-empty):not(.palette-group)");
        if (!items.length)
            return;
        items[active]?.classList.remove("active");
        active = (active + delta + items.length) % items.length;
        items[active].classList.add("active");
        items[active].scrollIntoView({ block: "nearest" });
    };
    const open = () => {
        if (dialog.open)
            return;
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
        /* "/" opens search, the way every good reading site does:
           unless you're already typing in a field. An event whose
           target is not an element answers "" and undefined here,
           which is the two falses this read off `undefined.tagName`
           before it was typed. */
        const target = e.target instanceof HTMLElement ? e.target : null;
        if (e.key === "/" && !dialog.open && !/^(input|textarea)$/i.test(target?.tagName ?? "")
            && !target?.isContentEditable) {
            e.preventDefault();
            open();
        }
    });
    input.addEventListener("input", () => render(input.value));
    dialog.addEventListener("keydown", (e) => {
        // An <input type="search"> swallows the first Escape to clear itself,
        // so the dialog would stay open. Close it ourselves instead.
        if (e.key === "Escape") {
            e.preventDefault();
            dialog.close();
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            move(1);
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            move(-1);
        }
        if (e.key === "Enter") {
            e.preventDefault();
            list.querySelector("li.active a")?.click();
        }
    });
    // click outside the panel closes it
    dialog.addEventListener("click", (e) => {
        if (e.target === dialog)
            dialog.close();
    });
}
/* ============================================================
   2b. THE `el` HELPER, and what used to be under it

   A full-screen overlay menu, built here in JavaScript from
   `content.js`, plus a hover panel under the header's "Skills"
   link. Both are gone, with the header that held them: the menu
   is a rail down the left of every page, rendered on the server
   by `next/components/sidebar.tsx` out of `next/lib/nav.ts`, and
   it is in the HTML before this file runs.

   That is not a tidier arrangement, it is a different one. The
   old menu did not exist for a reader with JavaScript off, did
   not exist for a crawler, and was built from a list that had to
   agree with the seven links written into every page's header.
   None of those three problems has anywhere left to happen.

   `el()` stays because the shortcuts sheet below still builds
   itself, and so does the palette.
   ============================================================ */
const el = (tag, props = {}, ...kids) => {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...kids.filter((k) => Boolean(k)));
    return node;
};
const isTyping = (node) => {
    const target = node instanceof HTMLElement ? node : null;
    return /^(input|textarea|select)$/i.test(target?.tagName ?? "")
        || !!target?.isContentEditable;
};
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
    dialog.append(el("div", { className: "pane-bar" }, el("span", { className: "mono", textContent: "Keyboard shortcuts" }), el("button", { className: "icon-btn push", textContent: "✕", ariaLabel: "Close",
        onclick: () => dialog.close() })), el("div", { className: "sheet-body" }, el("dl", { className: "shortcut-list" }, ...SHORTCUTS.flatMap(([keys, what]) => [
        el("dt", {}, ...keys.split("  ").map((k) => el("kbd", { textContent: k }))),
        el("dd", { textContent: what }),
    ]))));
    document.body.append(dialog);
    let goMode = false;
    const GO = {
        h: "/", l: "/money", d: "/deutsch",
        s: "/skills", i: "/insights", t: "/tools",
    };
    addEventListener("keydown", (e) => {
        if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey)
            return;
        if (goMode) {
            goMode = false;
            const url = GO[e.key.toLowerCase()];
            if (url) {
                e.preventDefault();
                location.href = url;
            }
            return;
        }
        if (e.key === "?") {
            e.preventDefault();
            dialog.open ? dialog.close() : dialog.showModal();
        }
        if (e.key.toLowerCase() === "g") {
            goMode = true;
            setTimeout(() => (goMode = false), 1200);
        }
        if (e.key.toLowerCase() === "t" && !document.querySelector("dialog[open]")) {
            e.preventDefault();
            document.getElementById("theme-toggle")?.click();
        }
    });
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
   rather than a gap, and check-content.ts fails the build if
   that fallback drifts too far from the truth.

   Bangla digits inside a [lang="bn"] element, Latin everywhere
   else: "৮টা ধাপ" in a Bangla sentence and "8 stages" in an
   English one are the same fact, and a Bangla sentence with a
   Latin numeral in the middle of it reads as a machine wrote it.
   ============================================================ */
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const toBangla = (n) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
/* COUNTS is deliberately not annotated in `shared/content.ts`, so
   its type is its keys and `COUNTS.stufens` does not compile.
   That is also why it cannot be indexed by a name read out of
   markup: this is the one place a `data-count` is looked up, and
   an unknown one answers undefined and is skipped below. */
const COUNT_VALUES = COUNTS;
function initCounts() {
    for (const node of document.querySelectorAll("[data-count]")) {
        const value = COUNT_VALUES[node.dataset.count ?? ""];
        if (value == null)
            continue;
        node.textContent = node.closest('[lang="bn"]') ? toBangla(value) : String(value);
    }
}
/* ============================================================
   4. SPECULATION RULES, prerender on hover, instant on click
   ============================================================ */
function initSpeculation() {
    if (!HTMLScriptElement.supports?.("speculationrules"))
        return;
    // Save-Data users don't want pages they might not read
    if (navigator.connection?.saveData)
        return;
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
   5. THE INSIGHTS CARDS ARE GONE, AND SO IS THEIR HOST

   `#article-cards` was filled here, from `pieces.js`, on the
   Insights index and on the home page. Neither exists as a file
   any more and neither route renders that id: the hub draws its
   own cards on the server from `next/lib/hub.ts`, and the home
   page has `<FeaturedCard>`, `<ContinueCard>` and `<PulseCard>`.
   `archive/insights.html` and `archive/index.html` are the last
   two documents on this site that carry the id, and nothing
   serves them.

   So this built cards into an element that is never on the page,
   which costs nothing and reads as a live feature. What it took
   with it: `piecesIn` and `pieceHref` off `pieces.js`, `tiltIn`
   off `tilt.js` and `formatDate` off `content.js`, none of which
   this file has another use for.

   `allPieces()` stays and is imported below. It feeds the
   palette, which is on every page.
   ============================================================ */
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
    }
    catch {
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
   6. SERVICE WORKER, offline reading, instant repeat visits
   ============================================================ */
function initServiceWorker() {
    if (!("serviceWorker" in navigator))
        return;
    if (location.protocol !== "https:" && location.hostname !== "localhost")
        return;
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
        if (pieces?.length)
            addToSearchIndex(pieces);
    });
    /* Reactions and reader questions are `next/components/engage.tsx`
       as of #149, rendered by the article route. The dynamic import
       that used to be here loaded a module whose top level called
       countView() a SECOND time, so an insights piece counted every
       view twice and a cooking or travel piece counted it once. */
}
/* ---------- go ---------- */
initTheme();
initAudience();
initPalette();
initShortcuts();
initCounts();
initTilt();
initSpeculation();
initStreak();
/* Reader accounts, before the service worker rather than after it.
   This import used to be the last line of the file, which put it
   behind a service worker installing and precaching sixty files:
   somebody returning from Google waited half a minute to stop
   looking signed out. It still blocks nothing and its failure is
   still caught, because signing in is optional and a page must not
   depend on it. */
import("/signin.js").then((m) => m.initSignIn()).catch(() => { });
initDynamic();
initServiceWorker();
