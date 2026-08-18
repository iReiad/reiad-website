#!/usr/bin/env node
/* ============================================================
   courses.test.mjs: the third-party course player, driven.

       node aab/courses.test.mjs

   The house rule in CLAUDE.md: a thing is finished when it does
   what it was asked to do, not when it renders, and those two
   look identical from the outside. This section was asked for
   six things, and each one is a heading below:

     · a sidebar with every module and lesson in it
     · a tick on the ones that are done
     · the current lesson marked
     · a percentage bar per module
     · "mark complete and continue", going to the next lesson,
       and to the module summary at the end of a module
     · the course index deep-linking to the first incomplete
       lesson

   And the one thing it must NOT do, which is the reason the
   section exists in the shape it does: no timer, no postMessage
   listener and no play/pause detection anywhere near the Drive
   player, because the Drive player exposes none of that and
   anything pretending otherwise would be marking lessons complete
   on a guess.

   No browser and no network. `linkedom` is a DOM, `/account.js`
   and `fetch` are stubbed, and the catalogue is a fixture built
   the same way `forBrowser()` builds the real one. It runs in
   about a second.

   Without linkedom installed it says so and skips, which is not a
   pass. `npm install` at the root is the whole of the fix.
   ============================================================ */

import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AAB = join(ROOT, "aab");

let parseHTML;
try {
  ({ parseHTML } = await import("linkedom"));
} catch {
  console.log("\nSKIPPED: linkedom is not installed, so there is no DOM to");
  console.log("draw these pages in. This is NOT a pass.\n");
  console.log("  npm install\n");
  process.exit(0);
}

/* `/courses.js` imports `/account.js`, and both are served paths
   rather than relative ones. The resolver maps them into aab/,
   and `/account.js` is then intercepted below: the real one talks
   to Supabase. */
const STUB = pathToFileURL(join(AAB, "courses.test.account.mjs")).href;

registerHooks({
  resolve(spec, ctx, next) {
    if (spec === "/account.js") return { url: STUB, shortCircuit: true };
    if (spec.startsWith("/") && !spec.startsWith(ROOT)) {
      const [path, query] = spec.split("?");
      const url = pathToFileURL(join(AAB, path)).href + (query ? `?${query}` : "");
      return { url, shortCircuit: true };
    }
    return next(spec, ctx);
  },
  load(url, ctx, next) {
    if (url === STUB) {
      return {
        format: "module",
        shortCircuit: true,
        source:
          "export const token = () => Promise.resolve(globalThis.__token);\n"
          + "export const current = () => globalThis.__reader;\n",
      };
    }
    return next(url, ctx);
  },
});

let bad = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "  ok " : "FAIL"}  ${name}${cond ? "" : `\n        ${detail}`}`);
  if (!cond) bad += 1;
};

/* ============================================================
   The fixture

   Two modules, one of them pending, so that every branch the page
   has is reachable: a video lesson, a reading, a lesson with an
   attachment, a module that ends, and a module with nothing in it.
   ============================================================ */

const COURSE = {
  slug: "foundations", n: 1, title: "Foundations",
  modules: [
    {
      slug: "week-one", n: 1, title: "Week one", pending: false,
      lessons: [
        {
          slug: "welcome", title: "Welcome", kind: "video", section: "Get started",
          position: 1, video: "vid-welcome-0000000000000000000000",
          reading: null, quiz: null, exam: null,
          transcript: "txt-welcome-0000000000000000000000", files: [],
        },
        {
          slug: "syllabus", title: "Syllabus", kind: "reading", section: "Get started",
          position: 2, video: null, reading: "doc-syllabus-000000000000000000000",
          quiz: null, exam: null, transcript: null,
          files: [{ name: "Learning log", ext: "docx", drive: "att-log-00000000000000000000000" }],
        },
        {
          slug: "insights", title: "Insights", kind: "video", section: "Second group",
          position: 3, video: "vid-insights-00000000000000000000",
          reading: null, quiz: null, exam: null, transcript: null, files: [],
        },
      ],
    },
    {
      slug: "week-two", n: 2, title: "Week two", pending: false,
      lessons: [
        {
          slug: "thinking", title: "Thinking", kind: "video", section: "Analytical",
          position: 1, video: "vid-thinking-00000000000000000000",
          reading: null, quiz: null, exam: null, transcript: null, files: [],
        },
      ],
    },
    { slug: "week-three", n: 3, title: "Week three", pending: true, lessons: [] },
  ],
};

const SUMMARIES = [
  { slug: "foundations", n: 1, title: "Foundations", modules: 3, lessons: 4, videos: 3, pending: 1 },
  { slug: "asking", n: 2, title: "Asking questions", modules: 2, lessons: 0, videos: 0, pending: 2 },
];

/* ============================================================
   A page
   ============================================================ */

const SHELL = '<!doctype html><html><body><div id="course-app"></div></body></html>';

/* What the Worker hands back for a reading: already sanitised, so
   the module renders it as it stands. */
const READING_HTML = '<h2>What you will do</h2><p>Read the syllabus.</p>';

/** Build a DOM at one address, run the module against it, and
    hand back the document. `store` persists across calls inside
    one scenario so that a tick made on one page is visible on the
    next, which is the whole point of the ticks. */
async function visit(
  path, store, { reader = { id: "admin" }, status = 200, ticketFails = null } = {},
) {
  const { window, document } = parseHTML(SHELL);
  const listeners = new Map();
  const asked = [];
  let gone = null;
  let opened = null;

  Object.assign(globalThis, {
    window, document,
    CustomEvent: window.CustomEvent,
    Node: window.Node,
    __reader: reader,
    __token: reader ? "a-token" : null,
    setTimeout,
    open: (to) => { opened = to; return null; },
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    },
    addEventListener: (t, f) => listeners.set(t, [...(listeners.get(t) ?? []), f]),
    dispatchEvent: (e) => { (listeners.get(e.type) ?? []).forEach((f) => f(e)); return true; },
    fetch: async (url) => {
      const path = String(url).replace(/^.*\/api\/courses/, "");
      asked.push(path);

      /* One route can be made to fail while the rest answer, which
         is the shape every real failure here has had: the page
         loads, the catalogue loads, and the one call that needed
         the Google credential is the one that did not. */
      if (path.startsWith("/ticket/") && ticketFails) {
        return {
          ok: false,
          status: ticketFails.status,
          json: async () => ({ ok: false, message: ticketFails.message }),
        };
      }

      let body = { ok: true, courses: SUMMARIES };
      if (path.startsWith("/ticket/")) {
        body = { ok: true, url: `/api/courses/file/${path.slice(8)}?t=1.sig` };
      } else if (path.startsWith("/reading/")) {
        body = { ok: true, title: "A reading", html: READING_HTML };
      } else if (path.length > 1) {
        body = { ok: true, course: COURSE };
      }

      return {
        ok: status === 200,
        status,
        json: async () => (status === 200
          ? body
          : { ok: false, message: "This section is not published." }),
      };
    },
  });

  /* `location.href = …` is how the continue button navigates, so
     the stub records it rather than following it. */
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: {
      pathname: path,
      set href(to) { gone = to; },
      get href() { return gone; },
    },
  });

  const mod = await import(`/courses.js?${Math.random()}`);
  await mod.start(document.getElementById("course-app"));

  /* The player and the reading are fetched, so the page is not
     finished when start() resolves. One turn of the microtask
     queue is enough here because every stub above resolves
     immediately. */
  await new Promise((go) => { setTimeout(go, 0); });

  return { document, went: () => gone, asked, opened: () => opened };
}

const text = (doc, sel) => doc.querySelector(sel)?.textContent?.trim() ?? "";
const all = (doc, sel) => [...doc.querySelectorAll(sel)];

/* ============================================================ */

console.log("\n--- the address decides the page ---");

const { whereAmI } = await import(`/courses.js?${Math.random()}`);

ok("/skills/courses/index.html is the catalogue",
  whereAmI("/skills/courses/index.html")?.view === "catalogue");
ok("/skills/courses/ is the catalogue too",
  whereAmI("/skills/courses/")?.view === "catalogue");
ok("a course address is a course", (() => {
  const w = whereAmI("/skills/courses/foundations/index.html");
  return w?.view === "course" && w.course === "foundations";
})());
ok("a module address is a module summary", (() => {
  const w = whereAmI("/skills/courses/foundations/week-one/index.html");
  return w?.view === "module" && w.module === "week-one";
})());
ok("a lesson address is a lesson, with .html stripped", (() => {
  const w = whereAmI("/skills/courses/foundations/week-one/welcome.html");
  return w?.view === "lesson" && w.lesson === "welcome";
})());
ok("a module summary is not read as a lesson called index",
  whereAmI("/skills/courses/a/b/index.html")?.view === "module");
ok("anything deeper is nothing", whereAmI("/skills/courses/a/b/c/d.html") === null);

/* ============================================================ */

console.log("\n--- the sidebar ---");

{
  const store = new Map();
  const { document: doc } = await visit(
    "/skills/courses/foundations/week-one/syllabus.html", store);

  ok("a rail is drawn", all(doc, ".course-rail").length === 1);
  ok("every module is in it", all(doc, ".course-mod").length === COURSE.modules.length,
    `saw ${all(doc, ".course-mod").length}`);
  ok("every lesson of every module is in it",
    all(doc, ".course-lesson").length === 4,
    `saw ${all(doc, ".course-lesson").length}`);
  ok("the rail links back to the course",
    doc.querySelector(".course-rail-top")?.getAttribute("href")
      === "/skills/courses/foundations/index.html");

  ok("the module being read is open",
    doc.querySelector(".course-mod")?.hasAttribute("open"));
  ok("the other modules are shut",
    !all(doc, ".course-mod")[1]?.hasAttribute("open"));

  ok("the current lesson is marked",
    all(doc, '.course-lesson[data-here]').length === 1);
  ok("and marked for assistive tech too",
    doc.querySelector('.course-lesson[data-here] a')?.getAttribute("aria-current") === "page");
  ok("the current lesson is the one in the address",
    text(doc, '.course-lesson[data-here] .course-lesson-name') === "Syllabus");

  ok("a lesson group becomes a heading",
    all(doc, ".course-section").map((n) => n.textContent.trim())
      .includes("Second group"));

  ok("every module has a bar", all(doc, ".course-mod .meter").length === 2,
    "the pending module has none, and should not");
  ok("a pending module says so",
    all(doc, ".course-mod-pct").some((n) => n.textContent.includes("not imported")));
  ok("a pending module draws no lessons",
    all(doc, ".course-mod")[2]?.querySelectorAll(".course-lesson").length === 0);

  ok("a lesson says what kind of thing it is",
    all(doc, ".course-lesson-kind").map((n) => n.textContent).includes("Reading"));
}

/* ============================================================ */

console.log("\n--- ticks, and the bar that counts them ---");

{
  const store = new Map();
  store.set("courses-read", JSON.stringify([
    "foundations/week-one/welcome",
    "foundations/week-one/syllabus",
  ]));

  const { document: doc } = await visit(
    "/skills/courses/foundations/week-one/insights.html", store);

  const ticked = all(doc, ".course-lesson a[data-done]");
  ok("a done lesson carries a tick", ticked.length === 2, `saw ${ticked.length}`);
  ok("and the tick is a visible mark",
    ticked.every((a) => a.querySelector(".course-tick")?.textContent === "✓"));
  ok("an undone lesson has no mark",
    all(doc, ".course-lesson a:not([data-done]) .course-tick")
      .every((n) => n.textContent === ""));

  const pcts = all(doc, ".course-mod-pct").map((n) => n.textContent.trim());
  ok("the first module is two thirds done", pcts[0] === "67%", `saw ${pcts[0]}`);
  ok("the second module is untouched", pcts[1] === "0%", `saw ${pcts[1]}`);

  const bar = doc.querySelector(".course-mod .meter");
  ok("the bar says the same number",
    bar?.getAttribute("aria-valuenow") === "67", `saw ${bar?.getAttribute("aria-valuenow")}`);
  ok("the bar is a progressbar", bar?.getAttribute("role") === "progressbar");

  /* A tick belongs to one course, one module and one lesson, so a
     lesson slug shared with another course is not the same tick. */
  ok("a tick is filed under all three parts",
    JSON.parse(store.get("courses-read")).every((id) => id.split("/").length === 3));
}

/* ============================================================ */

console.log("\n--- the lesson page ---");

{
  const store = new Map();
  const { document: doc } = await visit(
    "/skills/courses/foundations/week-one/welcome.html", store);

  const video = doc.querySelector(".course-video video");
  ok("a video lesson has a real player, not an iframe",
    Boolean(video) && !doc.querySelector(".course-video iframe"));
  ok("the player is served by this site, never by Drive",
    video?.getAttribute("src")?.startsWith("/api/courses/file/"),
    video?.getAttribute("src"));
  ok("and it carries a ticket, because <video> sends no header",
    video?.getAttribute("src")?.includes("?t="), video?.getAttribute("src"));
  ok("the player has controls", video?.hasAttribute("controls"));
  ok("it does not preload the whole file",
    video?.getAttribute("preload") === "metadata");
  ok("the player is titled for assistive tech",
    video?.getAttribute("title") === "Welcome");

  ok("a transcript is offered",
    all(doc, ".course-files a").some((a) => a.textContent === "Transcript"));

  /* ---- when the pass is refused ----

     The page said "that video could not be opened, if you have
     just signed in, reload" for every failure there is. One of
     them was a Worker with no Google credential, which was saying
     so in the response, in a sentence naming the secret to set.
     Reloading could never fix that, and the page recommended it,
     so the real reason went unread for an afternoon while the
     obvious suspects were checked instead.

     The rule this asserts: whatever the server said is what the
     reader is shown. */
  {
    const { document: sad } = await visit(
      "/skills/courses/foundations/week-one/welcome.html", new Map(),
      { ticketFails: { status: 503, message: "The Google credential is not set." } });

    const said = sad.querySelector(".course-video")?.textContent ?? "";
    ok("a refused pass shows the server's own reason", said.includes("credential"), said);
    ok("and does not tell the reader to reload instead", !/reload/i.test(said), said);
    ok("and there is no player pretending to work",
      !sad.querySelector(".course-video video"));
  }

  ok("opening moves the bookmark",
    JSON.parse(store.get("courses-last") ?? "{}").id === "foundations/week-one/welcome");
  ok("opening does NOT tick the lesson", !store.has("courses-read"),
    "arriving is not finishing");

  ok("there is a continue button", Boolean(doc.querySelector(".course-continue")));
  ok("and a separate tick that can be undone",
    Boolean(doc.querySelector(".tick-btn")));
  ok("the tick starts unpressed",
    doc.querySelector(".tick-btn")?.getAttribute("aria-pressed") === "false");
}

{
  const store = new Map();
  const { document: doc } = await visit(
    "/skills/courses/foundations/week-one/syllabus.html", store);

  ok("a reading lesson has no player", !doc.querySelector(".course-video"));
  ok("the reading is rendered ON the page", Boolean(doc.querySelector(".course-page")));
  ok("and it is the words, not a button out to Drive",
    text(doc, ".course-page h2") === "What you will do"
      && !doc.querySelector(".course-open"));
  ok("the original is still reachable, quietly",
    doc.querySelector(".course-original a")?.getAttribute("href")
      === "https://drive.google.com/file/d/doc-syllabus-000000000000000000000/view");
  ok("an attachment is listed",
    all(doc, ".course-files a").some((a) => a.textContent === "Learning log"));
}

/* ============================================================ */

console.log("\n--- mark complete and continue ---");

{
  const store = new Map();
  const { document: doc, went } = await visit(
    "/skills/courses/foundations/week-one/welcome.html", store);

  doc.querySelector(".course-continue").click();

  ok("the lesson is ticked",
    JSON.parse(store.get("courses-read")).includes("foundations/week-one/welcome"));
  ok("and it goes to the next lesson in the module",
    went() === "/skills/courses/foundations/week-one/syllabus.html", String(went()));
}

{
  const store = new Map();
  const { document: doc, went } = await visit(
    "/skills/courses/foundations/week-one/insights.html", store);

  ok("the last lesson of a module says so on the button",
    doc.querySelector(".course-continue").textContent.includes("finish the module"),
    doc.querySelector(".course-continue").textContent);

  doc.querySelector(".course-continue").click();

  ok("the last lesson of a module is ticked too",
    JSON.parse(store.get("courses-read")).includes("foundations/week-one/insights"));
  ok("and it goes to the module summary, not into the next module",
    went() === "/skills/courses/foundations/week-one/index.html", String(went()));
}

{
  const store = new Map();
  const { document: doc } = await visit(
    "/skills/courses/foundations/week-two/thinking.html", store);

  const tick = doc.querySelector(".tick-btn");
  tick.click();
  ok("the plain tick marks a lesson done",
    JSON.parse(store.get("courses-read")).includes("foundations/week-two/thinking"));
  ok("and says so", tick.getAttribute("aria-pressed") === "true");

  tick.click();
  ok("pressing it again un-ticks",
    !JSON.parse(store.get("courses-read")).includes("foundations/week-two/thinking"));
  ok("the rail redraws with it",
    all(doc, ".course-lesson a[data-done]").length === 0);
}

{
  /* A tick redraws the rail, and the redraw must not fold up a
     module the reader opened by hand to look ahead. */
  const store = new Map();
  const { document: doc } = await visit(
    "/skills/courses/foundations/week-two/thinking.html", store);

  const boxes = all(doc, ".course-mod");
  ok("only the module being read starts open",
    boxes.filter((b) => b.hasAttribute("open")).length === 1
      && boxes[1].hasAttribute("open"));

  boxes[0].setAttribute("open", "");             // the reader looks back
  doc.querySelector(".tick-btn").click();

  const after = all(doc, ".course-mod");
  ok("a module opened by hand stays open after a tick",
    after[0].hasAttribute("open"), "the rail folded up under the reader");
  ok("and the one being read stays open too", after[1].hasAttribute("open"));
  ok("and a shut one stays shut", !after[2].hasAttribute("open"));
}

/* ============================================================ */

console.log("\n--- the course page deep-links ---");

{
  const store = new Map();
  const { document: doc } = await visit("/skills/courses/foundations/index.html", store);

  ok("with nothing done it says start here",
    text(doc, ".resume .card-chip") === "Start here", text(doc, ".resume .card-chip"));
  ok("and points at the first lesson",
    doc.querySelector(".resume")?.getAttribute("href")
      === "/skills/courses/foundations/week-one/welcome.html");
}

{
  const store = new Map();
  store.set("courses-read", JSON.stringify([
    "foundations/week-one/welcome",
    "foundations/week-one/syllabus",
  ]));
  const { document: doc } = await visit("/skills/courses/foundations/index.html", store);

  ok("with some done it says carry on",
    text(doc, ".resume .card-chip").startsWith("Carry on"));
  ok("and points at the FIRST INCOMPLETE lesson",
    doc.querySelector(".resume")?.getAttribute("href")
      === "/skills/courses/foundations/week-one/insights.html",
    doc.querySelector(".resume")?.getAttribute("href"));
}

{
  /* A gap in the middle: the bookmark is past it, and the reader
     should still be sent back to the lesson they skipped rather
     than being told they have finished. */
  const store = new Map();
  store.set("courses-read", JSON.stringify([
    "foundations/week-one/welcome",
    "foundations/week-one/insights",
  ]));
  store.set("courses-last", JSON.stringify({
    id: "foundations/week-one/insights", title: "Insights",
    url: "/skills/courses/foundations/week-one/insights.html", ts: 1,
  }));
  const { document: doc } = await visit("/skills/courses/foundations/index.html", store);

  ok("a skipped lesson is not lost",
    doc.querySelector(".resume")?.getAttribute("href")
      === "/skills/courses/foundations/week-two/thinking.html",
    doc.querySelector(".resume")?.getAttribute("href"));
}

{
  const store = new Map();
  store.set("courses-read", JSON.stringify([
    "foundations/week-one/welcome", "foundations/week-one/syllabus",
    "foundations/week-one/insights", "foundations/week-two/thinking",
  ]));
  const { document: doc } = await visit("/skills/courses/foundations/index.html", store);

  ok("a finished course offers nothing to resume", !doc.querySelector(".resume"));
  ok("and says it is finished", Boolean(doc.querySelector(".course-finished")));
  ok("the whole-course bar is full",
    doc.querySelector(".hub-progress .meter")?.getAttribute("aria-valuenow") === "100");
}

/* ============================================================ */

console.log("\n--- the module summary and the catalogue ---");

{
  const store = new Map();
  const { document: doc } = await visit(
    "/skills/courses/foundations/week-one/index.html", store);

  ok("the summary lists the module's lessons",
    all(doc, ".course-summary-list > li > a").length === 3);
  ok("it carries the rail too", Boolean(doc.querySelector(".course-rail")));
  ok("no lesson in the rail is marked current",
    all(doc, ".course-lesson[data-here]").length === 0);
  ok("it offers the next module",
    all(doc, ".prev-next a").some((a) =>
      a.getAttribute("href") === "/skills/courses/foundations/week-two/index.html"));
}

{
  const store = new Map();
  const { document: doc } = await visit("/skills/courses/index.html", store);

  ok("the catalogue lists every course",
    all(doc, ".course-card").length === SUMMARIES.length);
  ok("a course card links to its course",
    doc.querySelector(".course-card")?.getAttribute("href")
      === "/skills/courses/foundations/index.html");
  ok("a course with nothing imported says so",
    all(doc, ".course-card .card-dek")[1]?.textContent.includes("not imported yet"));
  ok("the count comes from the list rather than a sentence",
    text(doc, ".hub-lede").includes(String(SUMMARIES.length)));
}

/* ============================================================ */

console.log("\n--- who may see any of this ---");

{
  const { document: doc } = await visit(
    "/skills/courses/index.html", new Map(), { reader: null });
  ok("signed out gets an explanation, not a catalogue",
    !doc.querySelector(".course-card") && Boolean(doc.querySelector(".course-note")));
  ok("and a way to sign in",
    doc.querySelector(".course-note a")?.getAttribute("href") === "/account.html");
}

{
  const { document: doc } = await visit(
    "/skills/courses/index.html", new Map(), { status: 403 });
  ok("a signed-in stranger is refused", Boolean(doc.querySelector(".course-note")));
  ok("and is not offered a sign-in button they do not need",
    !doc.querySelector(".course-note a"),
    "403 is not 401");
  ok("the refusal says the section is not published",
    text(doc, ".course-note").includes("not published"));
}

{
  const { document: doc } = await visit(
    "/skills/courses/foundations/nope/index.html", new Map());
  ok("an unknown module says so", text(doc, ".course-note h1") === "No such module");
}

/* ============================================================ */

console.log("\n--- what it must never do ---");

{
  const src = readFileSync(join(AAB, "courses.js"), "utf8");

  /* The Drive player exposes no events. Anything below would be a
     guess dressed as a measurement, and the button exists so that
     no guess is needed. */
  ok("no postMessage listener near the player", !/addEventListener\(\s*["']message["']/.test(src));
  ok("no timers pretending to watch", !/setInterval/.test(src));
  ok("nothing listens for play, pause or ended",
    !/["'](play|pause|ended|timeupdate)["']/.test(src),
    "a <video> WOULD report these now, and using them would still be a guess");
  ok("the browser never asks Drive for a lesson's bytes",
    !/drive\.google\.com\/file\/d\/\$\{[a-z]+\}\/preview/.test(src),
    "a private Drive file cannot be embedded cross-site");
  ok("progress is only ever written by a press", (() => {
    /* Every call that writes a tick is inside a click handler or
       the function one calls. `setLast` is the exception and is
       the bookmark, which is not a tick. */
    const writes = [...src.matchAll(/\b(markRead|toggleRead)\(/g)].length;
    return writes > 0 && writes <= 4;
  })(), "a write outside a handler is a lesson ticked by arriving");
}

/* ============================================================ */

console.log(bad ? `\n${bad} check(s) failed.\n` : "\nAll checks passed.\n");
process.exit(bad ? 1 : 0);
