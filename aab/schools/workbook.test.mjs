#!/usr/bin/env node
/* ============================================================
   workbook.test.mjs: both practice books, against the markup a
   learner actually gets.

       node aab/schools/workbook.test.mjs

   `hub.test.mjs` next door exists because a hub that renders and
   is not finished looks exactly like one that is. This is the
   same test for the books, and it was written after both of them
   turned out to be exactly that.

   ---- what it caught, once ----

   The English module keyed on a vocabulary the page does not
   have. It looked for `.wb-day`, `[data-wb-write]` and
   `[data-wb-done]`; `components/workbook.tsx` renders both books
   with the German one. Nothing saved, nothing revealed an answer,
   nothing ticked.

   And the German module did not run. Both files opened with
   `document.getElementById("tage")` and dereferenced it on the
   next line, and the route that replaced the generated page had
   no element with that id.

   Every check below is one of those: a thing the book must do
   that neither book did, and that no other check on this site
   would have noticed, because both pages rendered perfectly.

   ---- how ----

   `hub.test.mjs`'s harness, verbatim in shape: the component
   bundled with esbuild, rendered in process, and driven in
   `linkedom` with the twenty lines of storage and events the
   modules touch stubbed. No browser, no network, about a second.

   Without linkedom it says so and skips, which is not a pass.
   ============================================================ */

import { registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const AAB = join(ROOT, "aab");

let parseHTML;
try {
  ({ parseHTML } = await import("linkedom"));
} catch {
  console.log("\nSKIPPED: linkedom is not installed, so there is no DOM to");
  console.log("open these books in. This is NOT a pass.\n");
  console.log("  npm install\n");
  process.exit(0);
}

registerHooks({
  resolve(spec, ctx, next) {
    if (spec.startsWith("/") && !spec.startsWith(ROOT)) {
      const [path, query] = spec.split("?");
      const url = pathToFileURL(join(AAB, path)).href + (query ? `?${query}` : "");
      return { url, shortCircuit: true };
    }
    return next(spec, ctx);
  },
});

const { build } = await import("esbuild");

/* Bundled WITH the renderer, because the result is imported as a
   `data:` URL and a data module cannot resolve a bare specifier.
   `hub.test.mjs` says the rest. */
const bundled = await build({
  stdin: {
    contents: `export { WorkbookBody } from "./components/workbook-page";
               export { renderToStaticMarkup } from "react-dom/server.browser";`,
    resolveDir: join(ROOT, "next"),
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "esm",
  platform: "neutral",
  mainFields: ["module", "main"],
  conditions: ["import", "default"],
  jsx: "automatic",
  logLevel: "silent",
});

const mod = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);

/* The two books, and the two storage keys they must write. Those
   strings are in real browsers: the rule at the top of "What a
   reader has read" in CLAUDE.md is why renaming one loses
   somebody's work rather than moving it. */
const BOOKS = [
  { school: "deutsch", slug: "stufe-1", script: "/deutsch/arbeitsbuch.js", writeKey: "deutsch-schrift" },
  { school: "english", slug: "term-1", script: "/english/workbook.js", writeKey: "english-write" },
];

let bad = 0;
const ok = (n, c, d = "") => {
  console.log(`${c ? "  ok " : "FAIL"}  ${n}${c ? "" : "   " + d}`);
  if (!c) bad++;
};

for (const book of BOOKS) {
  console.log(`\n--- ${book.school}/${book.slug} ---`);

  const body = mod.renderToStaticMarkup(
    mod.WorkbookBody({ section: book.school, slug: book.slug }));

  const { window, document } = parseHTML(
    `<!doctype html><html><body>${body}</body></html>`);

  const store = new Map();
  const listeners = new Map();
  const timers = [];
  Object.assign(globalThis, {
    window, document,
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    },
    addEventListener: (t, f) => listeners.set(t, [...(listeners.get(t) ?? []), f]),
    dispatchEvent: (e) => { (listeners.get(e.type) ?? []).forEach((f) => f(e)); return true; },
    CustomEvent: window.CustomEvent,
    location: { pathname: `/${book.school}/${book.slug}/workbook.html`, hash: "" },
    history: { replaceState: () => {} },
    setTimeout: (f, ms) => { timers.push(f); return timers.length; },
    clearTimeout: () => {},
  });

  /* ---------- the markup the module needs ----------

     Asserted before the module runs, because these are what it
     dereferences at its top level: with them missing it throws
     and every check below fails for one reason rather than for
     the reason each names. */
  ok(`${book.school}: the days have a container the module can find`,
    !!document.getElementById("tage"));
  ok(`${book.school}: there is a day walker to fill in`,
    !!document.querySelector("[data-tag-nav]"));

  const cards = document.querySelectorAll(".buch-tag[data-tag]");
  ok(`${book.school}: the book has day cards (${cards.length})`, cards.length > 0);

  const areas = document.querySelectorAll("textarea[data-schrift]");
  ok(`${book.school}: the day cards have boxes to write in (${areas.length})`, areas.length > 0);

  /* linkedom gives `<select>` a `value` getter and no setter, so
     `select.value = "3"`, which every browser accepts, throws
     here. That is the DOM stub's gap and not the site's, so it is
     filled rather than worked around: the module has to be able
     to move the picker, and a test that made it stop trying
     would be testing a different program. */
  const Select = window.HTMLSelectElement;
  if (Select && !Object.getOwnPropertyDescriptor(Select.prototype, "value")?.set) {
    Object.defineProperty(Select.prototype, "value", {
      configurable: true,
      get() {
        return [...this.options].find((o) => o.selected)?.value
          ?? this.options[0]?.value ?? "";
      },
      set(v) {
        [...this.options].forEach((o) => { o.selected = String(o.value) === String(v); });
      },
    });
  }

  const errors = [];
  try {
    await import(`${book.script}?${Math.random()}`);
  } catch (e) { errors.push(String(e) + "\n" + (e.stack || "").split("\n").slice(1, 4).join("\n")); }
  ok(`${book.school}: its module ran without throwing`, errors.length === 0, errors[0]);
  if (errors.length) continue;

  /* ---------- one day at a time ---------- */
  const shown = [...cards].filter((c) => !c.hasAttribute("hidden"));
  ok(`${book.school}: exactly one day is on screen`, shown.length === 1,
    `${shown.length} of ${cards.length}`);

  const nav = document.querySelector("[data-tag-nav]");
  ok(`${book.school}: the walker was filled in`, !nav.hidden && !!nav.querySelector("select"));
  ok(`${book.school}: the picker names every day`,
    nav.querySelectorAll("option").length === cards.length);

  /* ---------- what is typed is kept, under the right key ---------- */
  const area = document.querySelector("textarea[data-schrift]");
  area.value = "eine Katze";
  area.dispatchEvent(new window.Event("input", { bubbles: true }));
  timers.splice(0).forEach((f) => f());     // the debounce

  const written = JSON.parse(store.get(book.writeKey) || "{}");
  ok(`${book.school}: what was typed went to localStorage`,
    Object.keys(written).length > 0, JSON.stringify([...store.keys()]));
  ok(`${book.school}: under "${book.writeKey}" and no other key`,
    [...store.keys()].filter((k) => k.endsWith("-schrift") || k.endsWith("-write"))
      .every((k) => k === book.writeKey), [...store.keys()].join(","));
  ok(`${book.school}: filed under the box's own name`,
    written[area.dataset.schrift] === "eine Katze");

  /* ---------- the answers stay shut until asked for ---------- */
  const reveal = document.querySelector("[data-antwort]");
  ok(`${book.school}: there is a button to show the answers`, !!reveal);
  if (reveal) {
    const card = reveal.closest(".buch-tag");
    ok(`${book.school}: the answers start hidden`, !card.hasAttribute("data-antworten"));
    reveal.dispatchEvent(new window.Event("click", { bubbles: true }));
    ok(`${book.school}: pressing it opens them`, card.hasAttribute("data-antworten"));
    ok(`${book.school}: and it says so`, reveal.getAttribute("aria-expanded") === "true");
    reveal.dispatchEvent(new window.Event("click", { bubbles: true }));
    ok(`${book.school}: pressing it again shuts them`, !card.hasAttribute("data-antworten"));
  }

  /* ---------- a day can be ticked off ---------- */
  const tick = document.querySelector("[data-fertig]");
  ok(`${book.school}: a day has a tick button`, !!tick);
  if (tick) {
    const before = tick.getAttribute("aria-pressed");
    tick.dispatchEvent(new window.Event("click", { bubbles: true }));
    ok(`${book.school}: pressing it ticks the day`,
      tick.getAttribute("aria-pressed") === "true", `was ${before}`);

    const chip = document.querySelector(`[data-tracker="${tick.dataset.fertig}"]`);
    ok(`${book.school}: the tracker square filled in too`,
      !!chip && chip.hasAttribute("data-done"));

    const bar = document.querySelector("[data-buch-fortschritt] .count");
    ok(`${book.school}: the bar counts it`, !!bar && /[০-৯]/.test(bar.textContent),
      bar?.textContent);
  }
}

console.log(bad
  ? `\n${bad} failed. A book that renders and does nothing looks finished.`
  : "\nBoth books open a day, keep what is written, show their answers and tick.");
process.exit(bad ? 1 : 0);
