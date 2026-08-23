#!/usr/bin/env node
/* ============================================================
   courses.test.ts: the third-party course player, driven.

       node aab/courses.test.ts

   The house rule in CLAUDE.md: a thing is finished when it does
   what it was asked to do, not when it renders, and those two
   look identical from the outside. This section was asked for
   seven things, and each one is a heading below:

     · a shelf of programmes, and one programme listing its own
       courses
     · a sidebar with every module and lesson in it
     · a tick on the ones that are done
     · the current lesson marked
     · a percentage bar per module
     · "mark complete and continue", going to the next lesson,
       and to the module summary at the end of a module
     · the course index deep-linking to the first incomplete
       lesson

   And the thing the programme must NOT do: appear in a tick.
   The address gained a segment and `courses-read` did not,
   because renaming a key does not move somebody's ticks, it
   loses them. Every id asserted below is `<course>/<module>/
   <lesson>`, the same string as before the programme existed.

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

   The fixture's shape is read out of `aab/src/courses.ts` rather
   than written out again, so a field the module gains is a field
   this file has to supply. `aab/tsconfig.test.json` is what
   typechecks that, and `scripts/check-types.ts` runs it.
   ============================================================ */

import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import type { Course, ProgrammeSummary } from "./src/courses.ts";

/** The module under test, fetched from the address the browser
    fetches it from, which is not a specifier tsc can resolve. Its
    source is, and it is the same file. */
type CoursesModule = typeof import("./src/courses.ts");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AAB = join(ROOT, "aab");

let parseHTML: typeof import("linkedom").parseHTML;
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
const ok = (name: string, cond: unknown, detail: unknown = ""): void => {
  console.log(`${cond ? "  ok " : "FAIL"}  ${name}${cond ? "" : `\n        ${detail}`}`);
  if (!cond) bad += 1;
};

/** An element this file has just asserted the page carries, or the
    window a document was built with. A missing one is a broken
    harness rather than a failing check, so it throws saying
    which. */
function need<T>(found: T | null | undefined, what: string): T {
  if (found == null) throw new Error(`no ${what}`);
  return found;
}

/* ============================================================
   The fixture

   Two modules, one of them pending, so that every branch the page
   has is reachable: a video lesson, a reading, a lesson with an
   attachment, a module that ends, and a module with nothing in it.

   Two programmes above them, because one programme cannot show
   that a card, a bar or an address belongs to the right one.
   ============================================================ */

/** The programme every deep address below sits in, written once:
    it is four segments to a lesson now and a typo in one of them
    is a 404 the fixture answers rather than a failing check. */
const AT = "/skills/courses/data-analytics/foundations";

const COURSE: Course = {
  slug: "foundations", n: 1, title: "Foundations",
  modules: [
    {
      slug: "week-one", n: 1, title: "Week one", pending: false,
      lessons: [
        {
          slug: "welcome", title: "Welcome", kind: "video", section: "Get started",
          position: 1, video: "vid-welcome-0000000000000000000000",
          reading: null, quiz: null, exam: null,
          transcript: "txt-welcome-0000000000000000000000",
          captions: "srt-welcome-0000000000000000000000", files: [],
        },
        {
          slug: "syllabus", title: "Syllabus", kind: "reading", section: "Get started",
          position: 2, video: null, reading: "doc-syllabus-000000000000000000000",
          quiz: null, exam: null, transcript: null, captions: null,
          files: [{ name: "Learning log", ext: "docx", drive: "att-log-00000000000000000000000" }],
        },
        {
          slug: "insights", title: "Insights", kind: "video", section: "Second group",
          position: 3, video: "vid-insights-00000000000000000000",
          reading: null, quiz: null, exam: null, transcript: null, captions: null, files: [],
        },
      ],
    },
    {
      slug: "week-two", n: 2, title: "Week two", pending: false,
      lessons: [
        {
          slug: "thinking", title: "Thinking", kind: "quiz", section: "Analytical",
          position: 1, video: "vid-thinking-00000000000000000000",
          reading: null, quiz: "qz-thinking-0000000000000000000", exam: null,
          transcript: null, captions: null, files: [],
        },
      ],
    },
    { slug: "week-three", n: 3, title: "Week three", pending: true, lessons: [] },
  ],
};

/** What `/api/courses` answers with: one row per programme, its
    own totals, and the courses in it.

    The first programme's totals are the sum of its courses', the
    way `programmeCounts()` computes them, so a page adding them
    up again is caught rather than agreeing with itself. */
const CATALOGUE: ProgrammeSummary[] = [
  {
    slug: "data-analytics", n: 1, title: "Data analytics",
    modules: 5, lessons: 4, videos: 3, pending: 3,
    courses: [
      { slug: "foundations", n: 1, title: "Foundations", modules: 3, lessons: 4, videos: 3, pending: 1 },
      { slug: "asking", n: 2, title: "Asking questions", modules: 2, lessons: 0, videos: 0, pending: 2 },
    ],
  },
  {
    slug: "spreadsheets", n: 2, title: "Spreadsheets",
    modules: 2, lessons: 6, videos: 4, pending: 0,
    courses: [
      { slug: "cells", n: 1, title: "Cells and formulas", modules: 2, lessons: 6, videos: 4, pending: 0 },
    ],
  },
];

/** Every course the Worker would answer for, at the address the
    page has to ask at. Anything else is a 404 below, so a link or
    a fetch that lost its programme fails here rather than being
    handed the course anyway. */
const COURSES_AT: Record<string, Course> = { "/data-analytics/foundations": COURSE };

/* ============================================================
   A page
   ============================================================ */

const SHELL = '<!doctype html><html><body><div id="course-app"></div></body></html>';

/* What the Worker hands back for a reading: already sanitised, so
   the module renders it as it stands. */
const READING_HTML = '<h2>What you will do</h2><p>Read the syllabus.</p>';

/** What the Worker answers for a quiz: questions, already parsed
    and sanitised. No markup of Coursera's own reaches the browser,
    which is why the options are strings rather than HTML. */
interface QuizAnswer {
  ok: boolean;
  title: string;
  parsed: boolean;
  html: string;
  questions: Array<{ n: number; prompt: string; multiple: boolean; options: string[] }>;
}

const QUIZ_BODY: QuizAnswer = {
  ok: true,
  title: "Checkup",
  parsed: true,
  html: "",
  questions: [
    {
      n: 1,
      prompt: "<p>Which one of these?</p>",
      multiple: false,
      options: ["The first", "The second", "The third"],
    },
    {
      n: 2,
      prompt: "<p>Which of these? Select all that apply.</p>",
      multiple: true,
      options: ["One of them", "Another"],
    },
  ],
};

/** How one visit differs from the plain one: who is asking, what
    the Worker answers with, and the one route that is made to
    fail. */
interface Scenario {
  reader?: { id: string } | null;
  status?: number;
  ticketFails?: { status: number; message: string } | null;
  quizBody?: QuizAnswer | null;
}

/** What a visit leaves behind: the page, where the continue button
    went, every endpoint that was asked for, and anything opened in
    a new tab. */
interface Visit {
  document: Document;
  went: () => string | null;
  asked: string[];
  opened: () => string | null;
}

/** Build a DOM at one address, run the module against it, and
    hand back the document. `store` persists across calls inside
    one scenario so that a tick made on one page is visible on the
    next, which is the whole point of the ticks. */
async function visit(
  path: string, store: Map<string, string>,
  { reader = { id: "admin" }, status = 200, ticketFails = null, quizBody = null }: Scenario = {},
): Promise<Visit> {
  const { window, document } = parseHTML(SHELL);
  const listeners = new Map<string, Array<(e: Event) => void>>();
  const asked: string[] = [];
  let gone: string | null = null;
  let opened: string | null = null;

  Object.assign(globalThis, {
    window, document,
    CustomEvent: window.CustomEvent,
    Node: window.Node,
    __reader: reader,
    __token: reader ? "a-token" : null,
    setTimeout,
    open: (to: string) => { opened = to; return null; },
    localStorage: {
      getItem: (k: string) => (store.has(k) ? store.get(k) : null),
      setItem: (k: string, v: unknown) => store.set(k, String(v)),
      removeItem: (k: string) => store.delete(k),
    },
    addEventListener: (t: string, f: (e: Event) => void) => listeners.set(t, [...(listeners.get(t) ?? []), f]),
    dispatchEvent: (e: Event) => { (listeners.get(e.type) ?? []).forEach((f) => f(e)); return true; },
    fetch: async (url: string) => {
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

      let body: unknown = null;
      if (path === "" || path === "/") {
        body = { ok: true, courses: CATALOGUE };
      } else if (path.startsWith("/ticket/")) {
        body = { ok: true, url: `/api/courses/file/${path.slice(8)}?t=1.sig` };
      } else if (path.startsWith("/reading/")) {
        body = { ok: true, title: "A reading", html: READING_HTML };
      } else if (path.startsWith("/quiz/")) {
        body = quizBody ?? QUIZ_BODY;
      } else if (COURSES_AT[path]) {
        body = { ok: true, course: COURSES_AT[path] };
      }

      /* An address the Worker would not route. Answered as one,
         the way it answers one: a page still asking for
         `/foundations` would otherwise be handed the course and
         every check below would pass on a section of dead links. */
      if (body === null) {
        return {
          ok: false,
          status: 404,
          json: async () => ({ ok: false, message: "no-such-course" }),
        };
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
      set href(to: string | null) { gone = to; },
      get href(): string | null { return gone; },
    },
  });

  const mod: CoursesModule = await import(`/courses.js?${Math.random()}`);
  await mod.start(need(document.getElementById("course-app"), "#course-app"));

  /* The player and the reading are fetched, so the page is not
     finished when start() resolves. One turn of the microtask
     queue is enough here because every stub above resolves
     immediately. */
  await new Promise<void>((go) => { setTimeout(go, 0); });

  return { document, went: () => gone, asked, opened: () => opened };
}

const text = (doc: ParentNode, sel: string): string =>
  doc.querySelector(sel)?.textContent?.trim() ?? "";
const all = <T extends Element = Element>(doc: ParentNode, sel: string): T[] =>
  [...doc.querySelectorAll<T>(sel)];

/* ============================================================ */

console.log("\n--- the address decides the page ---");

const { whereAmI }: CoursesModule = await import(`/courses.js?${Math.random()}`);

/* ---- the addresses as they are now ---- */
ok("/skills/courses is the shelf of programmes",
  whereAmI("/skills/courses")?.view === "catalogue");
ok("/skills/courses/ is the shelf too",
  whereAmI("/skills/courses/")?.view === "catalogue");
ok("one segment is a programme", (() => {
  const w = whereAmI("/skills/courses/data-analytics");
  return w?.view === "programme" && w.programme === "data-analytics";
})());
ok("two are a course", (() => {
  const w = whereAmI("/skills/courses/data-analytics/foundations");
  return w?.view === "course" && w.programme === "data-analytics"
    && w.course === "foundations";
})());
ok("three are a module summary", (() => {
  const w = whereAmI("/skills/courses/data-analytics/foundations/week-one");
  return w?.view === "module" && w.programme === "data-analytics"
    && w.course === "foundations" && w.module === "week-one";
})());
ok("four are a lesson", (() => {
  const w = whereAmI("/skills/courses/data-analytics/foundations/week-one/welcome");
  return w?.view === "lesson" && w.programme === "data-analytics"
    && w.course === "foundations" && w.module === "week-one" && w.lesson === "welcome";
})());
ok("anything deeper is nothing", whereAmI("/skills/courses/a/b/c/d/e") === null);

/* ---- and the addresses from before task #28, which this section
   TOLERATES rather than redirects.

   `shared/courses.ts` says why beside `lessonOf`: 845 addresses
   generated out of a Drive folder cannot be one redirect rule
   each without going stale the first time that folder changes,
   and the whole section is behind `isAdmin()` and unlisted, so
   there is no canonical to split and no crawler to confuse. ---- */
ok("the old catalogue address still answers",
  whereAmI("/skills/courses/index.html")?.view === "catalogue");
ok("the old programme address still answers", (() => {
  const w = whereAmI("/skills/courses/data-analytics/index.html");
  return w?.view === "programme" && w.programme === "data-analytics";
})());
ok("the old course address still answers", (() => {
  const w = whereAmI("/skills/courses/data-analytics/foundations/index.html");
  return w?.view === "course" && w.course === "foundations";
})());
ok("the old module address still answers", (() => {
  const w = whereAmI("/skills/courses/data-analytics/foundations/week-one/index.html");
  return w?.view === "module" && w.module === "week-one";
})());
ok("the old lesson address still answers, with .html stripped", (() => {
  const w = whereAmI("/skills/courses/data-analytics/foundations/week-one/welcome.html");
  return w?.view === "lesson" && w.lesson === "welcome";
})());
ok("and a module summary is still not read as a lesson called index",
  whereAmI("/skills/courses/a/b/c/index.html")?.view === "module");

/* An address from before the programme has one segment fewer and
   nothing saying so, so it reads as the shallower view. Asserted
   rather than left to be discovered: there is no suffix to tell
   these two apart, and the whole section is one reader's. */
ok("an address from before the programme reads as the level above",
  whereAmI("/skills/courses/foundations/week-one")?.view === "course");

/* ============================================================ */

console.log("\n--- the sidebar ---");

{
  const store = new Map<string, string>();
  const { document: doc, asked } = await visit(`${AT}/week-one/syllabus`, store);

  ok("the course is asked for inside its programme",
    asked.includes("/data-analytics/foundations"), asked.join(" "));

  ok("a rail is drawn", all(doc, ".course-rail").length === 1);
  ok("every module is in it", all(doc, ".course-mod").length === COURSE.modules.length,
    `saw ${all(doc, ".course-mod").length}`);
  ok("every lesson of every module is in it",
    all(doc, ".course-lesson").length === 4,
    `saw ${all(doc, ".course-lesson").length}`);
  ok("the rail links back to the course, inside its programme",
    doc.querySelector(".course-rail-top")?.getAttribute("href") === AT,
    doc.querySelector(".course-rail-top")?.getAttribute("href"));
  ok("and every lesson link carries the programme too",
    all(doc, ".course-lesson a").every((a) =>
      a.getAttribute("href")?.startsWith(`${AT}/`)),
    all(doc, ".course-lesson a")[0]?.getAttribute("href"));

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
    all(doc, ".course-section").map((n) => n.textContent?.trim())
      .includes("Second group"));

  ok("every module has a bar", all(doc, ".course-mod .meter").length === 2,
    "the pending module has none, and should not");
  ok("a pending module says so",
    all(doc, ".course-mod-pct").some((n) => n.textContent?.includes("not imported")));
  ok("a pending module draws no lessons",
    all(doc, ".course-mod")[2]?.querySelectorAll(".course-lesson").length === 0);

  ok("a lesson says what kind of thing it is",
    all(doc, ".course-lesson-kind").map((n) => n.textContent).includes("Reading"));
}

/* ============================================================ */

console.log("\n--- ticks, and the bar that counts them ---");

{
  const store = new Map<string, string>();
  store.set("courses-read", JSON.stringify([
    "foundations/week-one/welcome",
    "foundations/week-one/syllabus",
  ]));

  const { document: doc } = await visit(
    `${AT}/week-one/insights`, store);

  const ticked = all(doc, ".course-lesson a[data-done]");
  ok("a done lesson carries a tick", ticked.length === 2, `saw ${ticked.length}`);
  ok("and the tick is a visible mark",
    ticked.every((a) => a.querySelector(".course-tick")?.textContent === "✓"));
  ok("an undone lesson has no mark",
    all(doc, ".course-lesson a:not([data-done]) .course-tick")
      .every((n) => n.textContent === ""));

  const pcts = all(doc, ".course-mod-pct").map((n) => n.textContent?.trim());
  ok("the first module is two thirds done", pcts[0] === "67%", `saw ${pcts[0]}`);
  ok("the second module is untouched", pcts[1] === "0%", `saw ${pcts[1]}`);

  const bar = doc.querySelector(".course-mod .meter");
  ok("the bar says the same number",
    bar?.getAttribute("aria-valuenow") === "67", `saw ${bar?.getAttribute("aria-valuenow")}`);
  ok("the bar is a progressbar", bar?.getAttribute("role") === "progressbar");

  /* A tick belongs to one course, one module and one lesson, so a
     lesson slug shared with another course is not the same tick. */
  const filed: string[] = JSON.parse(String(store.get("courses-read")));
  ok("a tick is filed under all three parts",
    filed.every((id) => id.split("/").length === 3));
  /* THE ADDRESS GAINED A SEGMENT AND THE TICK DID NOT. A fourth
     part here would be every reader's progress lost, silently, on
     the deploy that added it. */
  ok("and the programme is not one of them",
    filed.every((id) => id.startsWith("foundations/")), JSON.stringify(filed));
}

/* ============================================================ */

console.log("\n--- the lesson page ---");

{
  const store = new Map<string, string>();
  const { document: doc } = await visit(
    `${AT}/week-one/welcome`, store);

  ok("the lesson's own trail carries the programme",
    all(doc, ".course-lesson-page .eyebrow a").length === 2
      && all(doc, ".course-lesson-page .eyebrow a").every((a) =>
        a.getAttribute("href")?.startsWith(`${AT}`)),
    all(doc, ".course-lesson-page .eyebrow a").map((a) => a.getAttribute("href")).join(" "));

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

  /* ---- captions ----

     Every video in this catalogue ships with two files beside it:
     a `.en.txt`, which is the transcript and is offered as a link,
     and a `.en.srt`, which is the same words with timings on them.
     Only the first was carried through the importer for a while,
     so the player had a captions button that turned nothing on.

     They are two things, not one thing twice, and the test says
     so: the transcript stays a link in the Files list and the
     captions become a track inside the player. */
  const track = doc.querySelector(".course-video video track");
  ok("a video carries a caption track", Boolean(track));
  ok("the track is captions, not chapters or metadata",
    track?.getAttribute("kind") === "captions", track?.getAttribute("kind"));
  ok("served by this site, converted from SubRip on the way",
    track?.getAttribute("src")?.startsWith("/api/courses/captions/"),
    track?.getAttribute("src"));
  ok("and it carries a pass of its own, because <track> sends no header",
    /[?&]t=/.test(track?.getAttribute("src") ?? ""), track?.getAttribute("src"));
  ok("the pass names the captions file, not the video",
    track?.getAttribute("src")?.includes("srt-welcome"), track?.getAttribute("src"));
  ok("captions are on without being asked for",
    track?.hasAttribute("default"));
  ok("the track is labelled, so the player's menu reads as a language",
    track?.getAttribute("srclang") === "en" && Boolean(track?.getAttribute("label")));
  ok("the transcript is still a link, not swallowed by the track",
    all(doc, ".course-files a").some((a) => a.textContent === "Transcript"));

  {
    /* `insights` has a video and no captions, which is what a
       lesson looks like when the export was missing its .srt. No
       track at all, rather than one pointing at nothing. */
    const { document: bare } = await visit(
      `${AT}/week-one/insights`, new Map());
    ok("a video with no captions gets no track",
      Boolean(bare.querySelector(".course-video video"))
      && !bare.querySelector(".course-video video track"));
  }

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
      `${AT}/week-one/welcome`, new Map(),
      { ticketFails: { status: 503, message: "The Google credential is not set." } });

    const said = sad.querySelector(".course-video")?.textContent ?? "";
    ok("a refused pass shows the server's own reason", said.includes("credential"), said);
    ok("and does not tell the reader to reload instead", !/reload/i.test(said), said);
    ok("and there is no player pretending to work",
      !sad.querySelector(".course-video video"));
  }

  const bookmark: { id?: string } = JSON.parse(store.get("courses-last") ?? "{}");
  ok("opening moves the bookmark", bookmark.id === "foundations/week-one/welcome");
  ok("opening does NOT tick the lesson", !store.has("courses-read"),
    "arriving is not finishing");

  ok("there is a continue button", Boolean(doc.querySelector(".course-continue")));
  ok("and a separate tick that can be undone",
    Boolean(doc.querySelector(".tick-btn")));
  ok("the tick starts unpressed",
    doc.querySelector(".tick-btn")?.getAttribute("aria-pressed") === "false");
}

{
  const store = new Map<string, string>();
  const { document: doc } = await visit(
    `${AT}/week-one/syllabus`, store);

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

/* ============================================================ */

console.log("\n--- a quiz a reader can answer ---");

{
  const store = new Map<string, string>();
  const { document: doc } = await visit(
    `${AT}/week-two/thinking`, store);
  const view = need(doc.defaultView, "the window this document was built with");

  const qs = all(doc, ".course-quiz .quiz-q");
  ok("every question is drawn", qs.length === 2, `saw ${qs.length}`);
  ok("each is a fieldset with a legend, not a bare div",
    qs.every((q) => q.tagName.toLowerCase() === "fieldset" && q.querySelector("legend")));
  ok("the question number is the export's own",
    qs[0]?.querySelector("legend")?.textContent?.includes("Question 1"));
  ok("the prompt is rendered",
    doc.querySelector(".course-quiz")?.textContent?.includes("Which one of these?"));

  /* The check this whole feature exists for. The page used to show
     the questions and none of the options, because the sanitiser
     drops <form> whole, and it looked finished. */
  const opts = all(doc, ".quiz-options .quiz-option");
  ok("THE OPTIONS ARE THERE", opts.length === 5, `saw ${opts.length}`);
  ok("and they carry their words",
    opts[0]?.textContent?.includes("The first"), opts[0]?.textContent);

  const inputs = all<HTMLInputElement>(doc, ".quiz-option input");
  ok("a pick-one question draws radios",
    all(doc, ".quiz-q")[0].querySelectorAll("input[type=radio]").length === 3);
  ok("a select-all question draws checkboxes",
    all(doc, ".quiz-q")[1].querySelectorAll("input[type=checkbox]").length === 2);
  /* `values` is a NodeList method every DOM has and linkedom's
      once did not, so the spread below is guarded rather than
      assumed. */
  ok("radios of one question share a name, so the browser enforces one",
    new Set(typeof all(doc, ".quiz-q")[0].querySelectorAll("input")
      .values === "function" ? [...all(doc, ".quiz-q")[0].querySelectorAll("input")].map(
        (i) => i.getAttribute("name")) : []).size === 1);
  ok("and the two questions do not share it",
    all(doc, ".quiz-q")[0].querySelector("input")?.getAttribute("name")
      !== all(doc, ".quiz-q")[1].querySelector("input")?.getAttribute("name"));

  ok("nothing is answered to begin with",
    inputs.every((i) => !i.checked) && !store.has("courses-answers"));

  ok("it says answers are kept",
    doc.querySelector(".course-quiz-note")?.textContent?.includes("save"));
  /* The honest half, and it is not decoration: the export carries
     no answer key, so a page implying a score would be lying. */
  ok("and says plainly that nothing is marked",
    /no answer key|not marked|right or wrong/i.test(
      doc.querySelector(".course-quiz-note")?.textContent ?? ""));
  ok("so there is no score anywhere on the page",
    !/\bscore\b|\bcorrect\b|\d+\s*\/\s*\d+\s*correct/i.test(
      doc.querySelector(".course-quiz")?.textContent ?? ""));
  ok("and no submit button, because there is nothing to submit to",
    !doc.querySelector(".course-quiz button[type=submit]")
    && !doc.querySelector(".course-quiz input[type=submit]"));

  console.log("\n--- answering, and remembering ---");

  const first = all(doc, ".quiz-q")[0].querySelectorAll<HTMLInputElement>("input")[1];
  first.checked = true;
  first.dispatchEvent(new view.Event("change"));

  const saved: string[] = JSON.parse(store.get("courses-answers") ?? "[]");
  ok("an answer is written down",
    saved.includes("foundations/week-two/thinking#1#1"), JSON.stringify(saved));
  ok("filed under the lesson, the question and the option",
    saved[0]?.split("#").length === 3, saved[0]);

  /* A radio that stored two answers would be a page saying the
     reader picked two things where it allowed one. */
  const other = all(doc, ".quiz-q")[0].querySelectorAll<HTMLInputElement>("input")[2];
  other.checked = true;
  other.dispatchEvent(new view.Event("change"));
  const after: string[] = JSON.parse(store.get("courses-answers") ?? "[]");
  ok("changing a pick-one answer replaces it rather than adding",
    after.filter((a) => a.startsWith("foundations/week-two/thinking#1#")).length === 1,
    JSON.stringify(after));

  /* Select-all is the opposite and must accumulate. */
  const multi = all(doc, ".quiz-q")[1].querySelectorAll<HTMLInputElement>("input");
  multi[0].checked = true;
  multi[0].dispatchEvent(new view.Event("change"));
  multi[1].checked = true;
  multi[1].dispatchEvent(new view.Event("change"));
  const both: string[] = JSON.parse(store.get("courses-answers") ?? "[]");
  ok("a select-all question keeps both answers",
    both.filter((a) => a.startsWith("foundations/week-two/thinking#2#")).length === 2,
    JSON.stringify(both));

  /* Coming back to the page is the point of saving at all. */
  const { document: again } = await visit(
    `${AT}/week-two/thinking`, store);
  const againView = need(again.defaultView, "the window that document was built with");
  const back = all(again, ".quiz-q")[0].querySelectorAll<HTMLInputElement>("input");
  ok("the answer is still ticked on the way back", back[2].checked === true);
  ok("and the ones not picked are not", !back[0].checked && !back[1].checked);

  console.log("\n--- clearing ---");

  const reset = again.querySelector(".quiz-reset");
  ok("there is a way to clear them", Boolean(reset));
  need(reset, ".quiz-reset").dispatchEvent(new againView.Event("click"));
  const cleared: string[] = JSON.parse(store.get("courses-answers") ?? "[]");
  ok("clearing removes this lesson's answers",
    !cleared.some((a) => a.startsWith("foundations/week-two/thinking#")),
    JSON.stringify(cleared));
  ok("and unticks the boxes on the page",
    [...again.querySelectorAll<HTMLInputElement>(".quiz-option input")].every((i) => !i.checked));

  console.log("\n--- answering is not finishing ---");

  /* The rule the whole section is built on. A quiz answered is
     not a lesson done: that is still a button the reader presses. */
  const read: string[] = JSON.parse(store.get("courses-read") ?? "[]");
  ok("answering does not tick the lesson",
    !read.includes("foundations/week-two/thinking"));
}

{
  /* A file the parser does not recognise is still readable. */
  const { document: doc } = await visit(
    `${AT}/week-two/thinking`, new Map(),
    { quizBody: { ok: true, title: "Not a quiz", parsed: false,
      questions: [], html: "<p>Just a page after all.</p>" } });

  ok("an unparseable quiz falls back to being a page",
    doc.querySelector(".course-page")?.textContent?.includes("Just a page after all"));
  ok("and draws no empty question boxes", !doc.querySelector(".quiz-q"));
}

console.log("\n--- mark complete and continue ---");

{
  const store = new Map<string, string>();
  const { document: doc, went } = await visit(
    `${AT}/week-one/welcome`, store);

  need(doc.querySelector<HTMLElement>(".course-continue"), ".course-continue").click();

  const read: string[] = JSON.parse(String(store.get("courses-read")));
  ok("the lesson is ticked", read.includes("foundations/week-one/welcome"));
  ok("and it goes to the next lesson in the module",
    went() === `${AT}/week-one/syllabus`, String(went()));
}

{
  const store = new Map<string, string>();
  const { document: doc, went } = await visit(
    `${AT}/week-one/insights`, store);

  const go = need(doc.querySelector<HTMLElement>(".course-continue"), ".course-continue");
  ok("the last lesson of a module says so on the button",
    go.textContent?.includes("finish the module"), go.textContent);

  go.click();

  const read: string[] = JSON.parse(String(store.get("courses-read")));
  ok("the last lesson of a module is ticked too",
    read.includes("foundations/week-one/insights"));
  ok("and it goes to the module summary, not into the next module",
    went() === `${AT}/week-one`, String(went()));
}

{
  const store = new Map<string, string>();
  const { document: doc } = await visit(
    `${AT}/week-two/thinking`, store);

  const tick = need(doc.querySelector<HTMLElement>(".tick-btn"), ".tick-btn");
  tick.click();
  const ticked: string[] = JSON.parse(String(store.get("courses-read")));
  ok("the plain tick marks a lesson done",
    ticked.includes("foundations/week-two/thinking"));
  ok("and says so", tick.getAttribute("aria-pressed") === "true");

  tick.click();
  const after: string[] = JSON.parse(String(store.get("courses-read")));
  ok("pressing it again un-ticks",
    !after.includes("foundations/week-two/thinking"));
  ok("the rail redraws with it",
    all(doc, ".course-lesson a[data-done]").length === 0);
}

{
  /* A tick redraws the rail, and the redraw must not fold up a
     module the reader opened by hand to look ahead. */
  const store = new Map<string, string>();
  const { document: doc } = await visit(
    `${AT}/week-two/thinking`, store);

  const boxes = all(doc, ".course-mod");
  ok("only the module being read starts open",
    boxes.filter((b) => b.hasAttribute("open")).length === 1
      && boxes[1].hasAttribute("open"));

  boxes[0].setAttribute("open", "");             // the reader looks back
  need(doc.querySelector<HTMLElement>(".tick-btn"), ".tick-btn").click();

  const after = all(doc, ".course-mod");
  ok("a module opened by hand stays open after a tick",
    after[0].hasAttribute("open"), "the rail folded up under the reader");
  ok("and the one being read stays open too", after[1].hasAttribute("open"));
  ok("and a shut one stays shut", !after[2].hasAttribute("open"));
}

/* ============================================================ */

console.log("\n--- the course page deep-links ---");

{
  const store = new Map<string, string>();
  const { document: doc } = await visit(AT, store);

  ok("with nothing done it says start here",
    text(doc, ".resume .card-chip") === "Start here", text(doc, ".resume .card-chip"));
  ok("and points at the first lesson",
    doc.querySelector(".resume")?.getAttribute("href")
      === `${AT}/week-one/welcome`);

  /* Up from a course is its programme. The title of it is on the
     shelf and this page fetched one course, so the crumb says the
     slug as words rather than fetching the shelf for one label. */
  ok("the way up is the programme, not the shelf",
    doc.querySelector(".hub-eyebrow a")?.getAttribute("href")
      === "/skills/courses/data-analytics",
    doc.querySelector(".hub-eyebrow a")?.getAttribute("href"));
  ok("and it is named rather than left as a slug",
    text(doc, ".hub-eyebrow a") === "Data analytics", text(doc, ".hub-eyebrow a"));

  ok("every module card links inside the programme",
    all(doc, ".course-modules a").every((a) =>
      a.getAttribute("href")?.startsWith(`${AT}/`)),
    all(doc, ".course-modules a")[0]?.getAttribute("href"));
}

{
  const store = new Map<string, string>();
  store.set("courses-read", JSON.stringify([
    "foundations/week-one/welcome",
    "foundations/week-one/syllabus",
  ]));
  const { document: doc } = await visit(AT, store);

  ok("with some done it says carry on",
    text(doc, ".resume .card-chip").startsWith("Carry on"));
  ok("and points at the FIRST INCOMPLETE lesson",
    doc.querySelector(".resume")?.getAttribute("href")
      === `${AT}/week-one/insights`,
    doc.querySelector(".resume")?.getAttribute("href"));
}

{
  /* A gap in the middle: the bookmark is past it, and the reader
     should still be sent back to the lesson they skipped rather
     than being told they have finished. */
  const store = new Map<string, string>();
  store.set("courses-read", JSON.stringify([
    "foundations/week-one/welcome",
    "foundations/week-one/insights",
  ]));
  store.set("courses-last", JSON.stringify({
    id: "foundations/week-one/insights", title: "Insights",
    url: `${AT}/week-one/insights`, ts: 1,
  }));
  const { document: doc } = await visit(AT, store);

  ok("a skipped lesson is not lost",
    doc.querySelector(".resume")?.getAttribute("href")
      === `${AT}/week-two/thinking`,
    doc.querySelector(".resume")?.getAttribute("href"));
}

{
  const store = new Map<string, string>();
  store.set("courses-read", JSON.stringify([
    "foundations/week-one/welcome", "foundations/week-one/syllabus",
    "foundations/week-one/insights", "foundations/week-two/thinking",
  ]));
  const { document: doc } = await visit(AT, store);

  ok("a finished course offers nothing to resume", !doc.querySelector(".resume"));
  ok("and says it is finished", Boolean(doc.querySelector(".course-finished")));
  ok("the whole-course bar is full",
    doc.querySelector(".hub-progress .meter")?.getAttribute("aria-valuenow") === "100");
}

/* ============================================================ */

console.log("\n--- the module summary ---");

{
  const store = new Map<string, string>();
  const { document: doc } = await visit(
    `${AT}/week-one`, store);

  ok("the summary lists the module's lessons",
    all(doc, ".course-summary-list > li > a").length === 3);
  ok("it carries the rail too", Boolean(doc.querySelector(".course-rail")));
  ok("no lesson in the rail is marked current",
    all(doc, ".course-lesson[data-here]").length === 0);
  ok("it offers the next module",
    all(doc, ".prev-next a").some((a) =>
      a.getAttribute("href") === `${AT}/week-two`));
}

/* ============================================================ */

console.log("\n--- the shelf of programmes ---");

{
  const store = new Map<string, string>();
  store.set("courses-read", JSON.stringify([
    "foundations/week-one/welcome",
    "foundations/week-one/syllabus",
  ]));
  const { document: doc } = await visit("/skills/courses", store);

  ok("the shelf lists every programme, not every course",
    all(doc, ".course-card").length === CATALOGUE.length,
    `saw ${all(doc, ".course-card").length}`);
  ok("a programme card links to its programme",
    doc.querySelector(".course-card")?.getAttribute("href")
      === "/skills/courses/data-analytics",
    doc.querySelector(".course-card")?.getAttribute("href"));
  ok("it says how many courses are in it",
    all(doc, ".course-card .card-dek")[0]?.textContent?.includes("2 courses"),
    all(doc, ".course-card .card-dek")[0]?.textContent);
  ok("and both counts come from the list rather than a sentence",
    text(doc, ".hub-lede").includes("2 programmes")
      && text(doc, ".hub-lede").includes("3 courses"),
    text(doc, ".hub-lede"));

  /* A tick is filed under a course and a programme is counted by
     the courses in it, so a bar that counted the whole of
     `courses-read` would fill the second certificate in too. */
  const bars = all(doc, ".course-card .meter");
  ok("a programme's bar counts its own courses' ticks",
    bars[0]?.getAttribute("aria-valuenow") === "50",
    bars[0]?.getAttribute("aria-valuenow"));
  ok("and another programme's is untouched by them",
    bars[1]?.getAttribute("aria-valuenow") === "0",
    bars[1]?.getAttribute("aria-valuenow"));
}

/* ============================================================ */

console.log("\n--- one programme ---");

{
  const store = new Map<string, string>();
  store.set("courses-read", JSON.stringify(["foundations/week-one/welcome"]));
  const { document: doc, asked } = await visit(
    "/skills/courses/data-analytics", store);

  /* The shelf carries every programme's courses and their totals,
     so this view asks for the list and nothing else. There is no
     endpoint for one programme and it does not need one. */
  ok("it is drawn from the shelf's own payload, with no course fetched",
    asked.length > 0 && asked.every((p) => p === ""), asked.join(" | "));
  ok("the programme is named", text(doc, "h1") === "Data analytics");
  ok("it lists its courses",
    all(doc, ".course-card").length === CATALOGUE[0].courses.length,
    `saw ${all(doc, ".course-card").length}`);
  ok("a course card links to the course inside this programme",
    doc.querySelector(".course-card")?.getAttribute("href") === AT,
    doc.querySelector(".course-card")?.getAttribute("href"));
  ok("a course with nothing imported says so",
    all(doc, ".course-card .card-dek")[1]?.textContent?.includes("not imported yet"),
    all(doc, ".course-card .card-dek")[1]?.textContent);
  ok("its totals are the row's, not counted again from the cards",
    text(doc, ".hub-lede").includes("5 modules")
      && text(doc, ".hub-lede").includes("4 lessons"),
    text(doc, ".hub-lede"));
  ok("the bar is the whole certificate's",
    doc.querySelector(".hub-progress .meter")?.getAttribute("aria-valuenow") === "25",
    doc.querySelector(".hub-progress .meter")?.getAttribute("aria-valuenow"));
  ok("and it offers the way back to the shelf",
    doc.querySelector(".hub-eyebrow a")?.getAttribute("href") === "/skills/courses");
}

{
  const { document: doc } = await visit("/skills/courses/nothing", new Map());
  ok("a programme nobody has says so",
    text(doc, ".course-note h1") === "No such programme");
}

/* ============================================================ */

console.log("\n--- who may see any of this ---");

{
  const { document: doc } = await visit(
    "/skills/courses", new Map(), { reader: null });
  ok("signed out gets an explanation, not a catalogue",
    !doc.querySelector(".course-card") && Boolean(doc.querySelector(".course-note")));
  ok("and a way to sign in",
    doc.querySelector(".course-note a")?.getAttribute("href") === "/account");
}

{
  const { document: doc } = await visit(
    "/skills/courses", new Map(), { status: 403 });
  ok("a signed-in stranger is refused", Boolean(doc.querySelector(".course-note")));
  ok("and is not offered a sign-in button they do not need",
    !doc.querySelector(".course-note a"),
    "403 is not 401");
  ok("the refusal says the section is not published",
    text(doc, ".course-note").includes("not published"));
}

{
  const { document: doc } = await visit(
    `${AT}/nope`, new Map());
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
