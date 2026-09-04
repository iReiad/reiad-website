/* Is a piece of writing actually readable. `node next/reading.test.ts`.
   Needs Playwright and a browser; without either it says which and SKIPS,
   and a skip is not a pass.

   Every number this site states about its own typography is MEASURED
   here. `ch` is the advance width of the "0" glyph, a fact about a font
   rather than about a script, and this site is written in two: `66ch`
   delivered 78 characters of English and 116 of Bangla while the panel
   stated a third number, and every check passed. The unit is WORDS,
   because a line the eye can sweep is nine to twelve words in any script
   and no character count is true in two.

   Three more things about a reading page cannot be seen in HTML and can
   be seen here: whether the column is centred or hiding against one edge,
   whether anything makes the page scroll sideways, and whether the chrome
   that goes quiet while somebody reads is still legible while it is
   quiet. */

import { Buffer } from "node:buffer";
import { createServer, type Server } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Browser, Page } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8996;

/* The annotation is on the VARIABLE and not on the arrow, which
   is the half that matters: TypeScript narrows on a call to
   something that returns `never` only when the binding itself is
   typed that way. `hydrate-fixture.ts` says the same thing where
   it does it. */
const skip: (why: string) => never = (why) => {
  console.log(`SKIPPED: ${why}`);
  console.log("A skip is not a pass.\n");
  process.exit(0);
};

/** The three steps the settings panel offers, READ AS TEXT.

    `aab/src/prefs.ts` reaches for `document` and `addEventListener`
    at its top level, which is right for a browser module and
    means node cannot import it. `scripts/check-glass.ts` parses
    that file for the same reason and says so where it does it. */
interface Step { label: string; note: string; wide: string }
const MEASURES: Step[] = (() => {
  const src = readFileSync(join(ROOT, "aab", "src", "prefs.ts"), "utf8");
  const block = /export const MEASURES = \[([\s\S]*?)\] as const/.exec(src)?.[1];
  if (!block) skip("could not find MEASURES in aab/src/prefs.ts");
  const rows = [...block.matchAll(
    /label:\s*"([^"]+)",\s*note:\s*"([^"]+)",\s*wide:\s*"([^"]+)"/g)];
  if (!rows.length) skip("MEASURES in aab/src/prefs.ts is not in the shape this reads.");
  return rows.map((m) => ({ label: m[1], note: m[2], wide: m[3] }));
})();

/* ---------- the prose, which is the site's own ----------

   Lorem would prove nothing: what is being measured is how many
   of THIS SITE'S words fit on a line, in the two scripts it is
   written in, set in the faces it sets them in. */
const strip = (html: string): string =>
  html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();

const articles = (() => {
  const at = join(ROOT, "content", "articles.backup.json");
  if (!existsSync(at)) skip("content/articles.backup.json is not here.");
  const raw = JSON.parse(readFileSync(at, "utf8")) as
    { articles?: Row[] } | Row[];
  return (Array.isArray(raw) ? raw : raw.articles ?? []);
})();
interface Row { slug: string; lang: string; body: string }

interface Lesson { school?: string; status?: string; body?: string; body_en?: string }
const lessons = (() => {
  const at = join(ROOT, "content", "schools.backup.json");
  if (!existsSync(at)) return [] as Lesson[];
  const raw = JSON.parse(readFileSync(at, "utf8")) as { lessons?: Lesson[] };
  return raw.lessons ?? [];
})();

const BANGLA = strip(articles.filter((r) => r.lang === "bn")
  .map((r) => r.body).join(" ")).slice(0, 12000);
/* English is thinner on this site than Bangla, so the pool is the
   one English piece plus every lesson somebody has written an
   English half for. */
const ENGLISH = strip([
  ...articles.filter((r) => r.lang !== "bn").map((r) => r.body),
  ...lessons.map((l) => l.body_en ?? ""),
].join(" ")).slice(0, 12000);

if (BANGLA.split(" ").length < 900) skip("too little Bangla prose to measure.");
if (ENGLISH.split(" ").length < 900) skip("too little English prose to measure.");

    /* ---------- the page ----------
       The classes are the ones the two reading routes render, and both are
       asserted against those routes at the bottom of this file, so a
       rename cannot leave this fixture quietly measuring a page that no
       longer exists.

       The rail is four elements deep rather than the whole of
       `components/sidebar.tsx`, because what is measured is the colour
       relationship: a mark, a label, and the panel they sit on. */
const IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'"
  + " width='1600' height='900'%3E%3Crect width='1600' height='900'"
  + " fill='%23888'/%3E%3C/svg%3E";

const page = (lang: string, prose: string): string =>
  `<!DOCTYPE html><html lang="${lang}" data-rail="open"><head>`
  + `<meta charset="utf-8"><title>reading</title>`
  + `<link rel="stylesheet" href="/fallback.css"></head><body>`
  + `<aside class="rail" id="rail" aria-label="Site menu">`
  + `<nav class="rail-nav"><span class="rail-label mono">Learning</span>`
  + `<a class="rail-item" href="/money"><span class="rail-ico">`
  + `<svg width="19" height="19" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"`
  + ` fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span>`
  + `<span class="rail-text"><span class="rail-item-label">Money</span>`
  + `<span class="rail-item-sub" lang="bn">টাকা ও শেয়ার</span></span></a>`
  + `</nav></aside>`
  + `<div class="shell-col"><header class="topbar"><span class="topbar-mark">`
  + `<span>Reiad's Library</span></span></header>`
  + `<div class="read-progress" aria-hidden="true"></div>`
  + `<main id="main"><article class="wrap article" data-slug="a-piece">`
  + `<h1>A heading</h1><p class="byline mono"><span>Rony Reiad</span>`
  + `<time>9 August, 2026</time><span>11 min read</span></p><div>`
  + `<p id="prose">${prose}</p>`
  + `<h2 id="a-heading">A part of it</h2>`
  + `<p id="second">${prose.slice(0, 900)}</p>`
  + `<figure class="full" id="bleed"><img src="${IMG}" alt=""></figure>`
  + `<div class="table-scroll" id="tbl"><table><tr><th>a</th><th>b</th></tr>`
  + `<tr><td>1</td><td>2</td></tr></table></div>`
  + `<p>${prose.slice(0, 3000)}</p><p>${prose.slice(0, 3000)}</p>`
  + `</div></article></main></div></body></html>`;

    /* ---------- and a lesson, which is the other reading route ----------
       Two shapes: a money lesson is written twice and `.ls-body` carries
       `data-langs="both"`, and a lesson of the other three schools is
       Bangla and carries `data-langs="bn"`. `lesson/body.tsx` decides, and
       the markup below is that component's. */
const LESSON_BN = (lessons.find((l) =>
  l.school !== "money" && (l.body ?? "").trim() && !(l.body_en ?? "").trim())
  ?.body ?? "").slice(0, 4000);
const LESSON_PAIR = lessons.find((l) =>
  (l.body ?? "").trim() && (l.body_en ?? "").trim());

const lessonPage = (langs: "bn" | "both"): string =>
  `<!DOCTYPE html><html lang="bn" data-rail="open"><head>`
  + `<meta charset="utf-8"><title>a lesson</title>`
  + `<link rel="stylesheet" href="/fallback.css"></head><body>`
  + `<div class="shell-col"><main id="main"><div class="wrap">`
  + `<article class="term-article lesson teil" data-school="deutsch">`
  + `<h1 class="bn-h">একটা পাঠ</h1>`
  + `<div class="ls-body" data-langs="${langs}"><div class="ls-slice">`
  + `<div class="ls-bn" id="ls-bn" lang="bn">`
  + `${langs === "both" ? LESSON_PAIR?.body ?? "" : LESSON_BN}</div>`
  + (langs === "both"
      ? `<div class="ls-en" id="ls-en" lang="en">${LESSON_PAIR?.body_en ?? ""}</div>`
      : "")
  + `</div></div></article></div></main></div></body></html>`;

/* ---------- serve it ---------- */

const css = (() => {
  const at = join(ROOT, "aab", "fallback.css");
  if (!existsSync(at)) skip("aab/fallback.css is not built. Run scripts/build-fallback.ts.");
  return readFileSync(at, "utf8");
})();

const server: Server = createServer((req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname;
  if (path === "/fallback.css") {
    res.writeHead(200, { "Content-Type": "text/css" }).end(css);
    return;
  }
  if (path.startsWith("/lesson")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
      .end(lessonPage(path.endsWith("/both") ? "both" : "bn"));
    return;
  }
  const lang = path.startsWith("/en") ? "en" : "bn";
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
    .end(page(lang, lang === "bn" ? BANGLA : ENGLISH));
});
await new Promise<void>((resolve) => server.listen(PORT, resolve));

const PLAYWRIGHT = "../app/node_modules/playwright/index.mjs";
const playwright = await import(PLAYWRIGHT)
  .then((m) => m as typeof import("playwright"), () => null);
if (!playwright) {
  server.close();
  skip("playwright is not installed. It is a devDependency of app/: `cd app && npm install`.");
}
/* `skip()` returns `never`, and TypeScript narrows on that only
   through a definite reference: naming it once here is what tells
   the compiler the rest of this file has a Playwright. */
const pw = playwright;
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browserPath = process.env.CHROMIUM_PATH
  || (existsSync(CHROME) ? CHROME : null);
if (!browserPath) {
  try { pw.chromium.executablePath(); } catch {
    server.close();
    skip("no browser. Point CHROMIUM_PATH at one, or `npx playwright install chromium`.");
  }
}
const browser: Browser = await pw.chromium.launch(
  browserPath ? { executablePath: browserPath } : {});

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};

console.log("a piece of writing, read");

/* ============================================================
   1. THE MEASURE KEEPS ITS PROMISE, in both scripts

   Every note in `MEASURES` states a number of words. Six
   combinations, and each one is measured off the line boxes
   themselves rather than divided out of a width.
   ============================================================ */

/** Words per line, counted from where the browser actually put
    them: a Range round each word, grouped by the top of its box.
    Script-neutral, which a character count is not, and immune to
    a hyphenation or shaping change that a width calculation would
    miss entirely. */
const WORDS_PER_LINE = `(() => {
  const el = document.getElementById("prose");
  const node = el.firstChild, text = node.textContent;
  const r = document.createRange();
  const tops = new Map();
  let i = 0;
  while (i < text.length) {
    while (i < text.length && /\\s/.test(text[i])) i += 1;
    const s = i;
    while (i < text.length && !/\\s/.test(text[i])) i += 1;
    if (i === s) break;
    r.setStart(node, s); r.setEnd(node, i);
    const top = Math.round(r.getBoundingClientRect().top);
    tops.set(top, (tops.get(top) ?? 0) + 1);
  }
  /* The LAST line of a paragraph is short by definition and there
     is one of them; every other line is full. Dropping the
     shortest one keeps a median honest on a short sample. */
  const counts = [...tops.values()].sort((a, b) => a - b).slice(1);
  return {
    lines: counts.length,
    median: counts[Math.floor(counts.length / 2)],
    p90: counts[Math.floor(counts.length * 0.9)],
    max: counts[counts.length - 1],
  };
})()`;

const said = (note: string): number => Number(/(\d+)/.exec(note)?.[1] ?? 0);

for (const script of ["bn", "en"] as const) {
  const p: Page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`http://localhost:${PORT}/${script === "en" ? "en" : ""}`,
    { waitUntil: "load" });
  /* The Bangla face is a webfont in the real page and a system
     fallback here; either way the measurement has to be taken
     after the browser has settled on one. */
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(200);

  for (const step of MEASURES) {
    await p.evaluate((w: string) =>
      document.documentElement.style.setProperty("--read-wide", w), step.wide);
    await p.waitForTimeout(60);
    const got = await p.evaluate(WORDS_PER_LINE) as
      { lines: number; median: number; p90: number; max: number };
    const claim = said(step.note ?? "");

    ok(`${script}: "${step.label}" really is about ${claim} words a line`,
      Math.abs(got.median - claim) <= 2,
      `measured ${got.median} over ${got.lines} lines. The note in MEASURES `
      + `says ${claim}. Move --measure-base for this script, or the note.`);

    /* AND THE LINES ARE EVEN. A median can be right while the
       page still has lines half again as long, which is what a
       reader actually trips over: the eye learns a sweep and then
       a line breaks the habit. Three words over the claim is the
       most a full line should be, and it is the p90 rather than
       the max because one long line in a piece is a long word
       rather than a design. */
    ok(`${script}: "${step.label}" has no long lines to trip over`,
      got.p90 <= claim + 3,
      `p90 was ${got.p90} against a claim of ${claim}, longest ${got.max}`);
  }
  await p.close();
}

    /* ---- 2. the column is a column ----
       Centred in the space the page actually has, which is the window
       minus the rail, and nothing in it makes the document scroll
       sideways. `width: 100vw` with a `50% - 50vw` margin is the WINDOW:
       it runs under the rail and pushes 143px of horizontal scroll on to
       every article with a full-bleed figure. */
{
  for (const width of [1440, 1180, 1000, 760, 390]) {
    const p: Page = await browser.newPage({ viewport: { width, height: 900 } });
    await p.goto(`http://localhost:${PORT}/`, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(150);
    const m = await p.evaluate(() => {
      const box = (sel: string): { l: number; r: number } | null => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { l: Math.round(b.left), r: Math.round(b.right) };
      };
      const rail = box(".rail");
      const railTakesRoom = rail !== null && rail.r > 0 && rail.l >= 0;
      return {
        col: box(".article"), bleed: box("#bleed"), table: box("#tbl"),
        railRight: railTakesRoom ? rail.r : 0,
        /* `body`, not `documentElement`: Chromium reports the
           root's clientWidth as the WINDOW here, scrollbar
           included, and what everything below is measured against
           is the page. Body is a block filling the layout
           viewport, so its width is the answer. */
        view: document.body.clientWidth,
        overflow: document.documentElement.scrollWidth
          - document.documentElement.clientWidth,
      };
    });

    ok(`${width}px: nothing makes the page scroll sideways`,
      m.overflow <= 0, `${m.overflow}px of it, and a full-bleed figure is why`);

    const area = { l: m.railRight, r: m.view };
    const off = Math.abs(((m.col!.l + m.col!.r) / 2) - ((area.l + area.r) / 2));
    ok(`${width}px: the column is centred in the page, not pinned to one edge`,
      off <= 24, `its centre is ${Math.round(off)}px off the reading area's`);

        /* A FULL-BLEED FIGURE REACHES BOTH EDGES OF THE PAGE AND NEITHER
           EDGE OF THE WINDOW, which on a desktop are 268px apart.

           The tolerance is a scrollbar's width, because `100vw` includes
           one and the page does not. That overhang is clipped rather than
           scrolled (`overflow-x: clip` in @layer article), so a box
           measured here can end a few pixels outside the page while
           nothing outside it is painted. The check above proves the
           clip. */
    const SLACK = 18;
    ok(`${width}px: a full-bleed figure reaches the page's left edge`,
      m.bleed!.l <= m.railRight + 1 && m.bleed!.l >= m.railRight - SLACK,
      `it starts at ${m.bleed!.l} and the page starts at ${m.railRight}`);
    ok(`${width}px: and its right edge`,
      m.bleed!.r >= m.view - 1 && m.bleed!.r <= m.view + SLACK,
      `it ends at ${m.bleed!.r} and the page ends at ${m.view}`);

    ok(`${width}px: a table is allowed to be wider than a line of prose`,
      m.table!.r - m.table!.l >= m.col!.r - m.col!.l - 44,
      "six columns of figures held to the measure is a scroller nobody can read");
    await p.close();
  }
}

/* ============================================================
   3. A PARAGRAPH BREAK HAS TO BE VISIBLE

   The gap was 15px under a Bangla line-height of 1.9, which is
   0.49 of a line: LESS space than there is between two lines of
   the same paragraph, so the page read as one block.
   ============================================================ */
{
  const p: Page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`http://localhost:${PORT}/`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const m = await p.evaluate(() => {
    const el = document.getElementById("prose")!;
    const cs = getComputedStyle(el);
    return { lead: parseFloat(cs.lineHeight), gap: parseFloat(cs.marginBottom) };
  });
  ok("the space between two paragraphs is more than the space between two lines",
    m.gap > m.lead * 0.6,
    `gap ${m.gap}px against a leading of ${m.lead}px`);
  ok("and not so much that they stop being one piece",
    m.gap < m.lead * 1.2, `gap ${m.gap}px against a leading of ${m.lead}px`);
  await p.close();
}

    /* ---- 4. the reading hush ----
       The rail and the bar go quiet once the reader is past the heading.
       Each of these is a way of shipping a hush that looks right and is
       wrong: one that never comes back, one that cannot be woken from a
       keyboard, and one that leaves the navigation below the contrast a
       reader can use. */
{
  const p: Page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`http://localhost:${PORT}/`, { waitUntil: "load" });
  await p.waitForTimeout(200);
  const hush = (): Promise<number> => p.evaluate(() =>
    Number(getComputedStyle(document.body).getPropertyValue("--hush")));
  const railOpacity = (): Promise<number> => p.evaluate(() =>
    Number(getComputedStyle(document.querySelector(".rail")!).opacity));
  const settle = async (y: number): Promise<void> => {
    await p.evaluate((to: number) => window.scrollTo(0, to), y);
    await p.waitForTimeout(900);
  };

  await settle(0);
  ok("at the top of a piece nothing is hushed", await hush() === 0);
  await settle(1200);
  ok("once the reader is into it, the furniture is", await hush() === 1);
  const quiet = await railOpacity();
  ok("and the rail is quieter than it was", quiet < 1, String(quiet));

  await p.hover(".rail");
  await p.waitForTimeout(700);
  ok("reaching for the rail wakes it", await railOpacity() === 1);
  await p.mouse.move(1000, 500);
  await p.waitForTimeout(1100);
  ok("and it goes quiet again when the pointer leaves", await railOpacity() < 1);

  /* THE KEYBOARD PATH, which is the one that is easy to leave
     out: nothing here can be reached by hovering a pointer that
     is not there, and a rail that stayed dim under a focus ring
     would be unreadable to somebody tabbing through the site. */
  await p.evaluate(() => (document.querySelector(".rail a") as HTMLElement).focus());
  await p.waitForTimeout(700);
  ok("and a tab key wakes it too", await railOpacity() === 1);
  await p.evaluate(() => (document.activeElement as HTMLElement).blur());
  await p.waitForTimeout(1100);

  await settle(0);
  ok("scrolling back to the top brings it all back", await hush() === 0);
  await p.close();
}

/* ---- and it is still readable while it is quiet ---- */
{
  const ratio = async (p: Page, clip: { x: number; y: number; width: number; height: number }):
  Promise<number> => {
    const shot = Buffer.from(await p.screenshot({ clip })).toString("base64");
    return await p.evaluate(async (b64: string) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const x = c.getContext("2d", { willReadFrequently: true })!;
      x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      const f = (v: number): number => {
        const n = v / 255;
        return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      };
      const ls: number[] = [];
      for (let i = 0; i < d.length; i += 4) {
        ls.push(0.2126 * f(d[i]) + 0.7152 * f(d[i + 1]) + 0.0722 * f(d[i + 2]));
      }
      ls.sort((a, b) => a - b);
      /* Second and ninety-eighth percentile rather than the two
         extremes, so one antialiased pixel cannot decide it, and
         either way round so the same code answers for both
         themes: on paper the ink is the low end and at night it
         is the high one. */
      const lo = ls[Math.floor(ls.length * 0.02)];
      const hi = ls[Math.floor(ls.length * 0.98)];
      return (hi + 0.05) / (lo + 0.05);
    }, shot);
  };

  for (const theme of ["light", "dark"] as const) {
    const p: Page = await browser.newPage({
      viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    await p.goto(`http://localhost:${PORT}/`, { waitUntil: "load" });
    await p.evaluate((t: string) =>
      document.documentElement.setAttribute("data-theme", t), theme);
    /* Held at the hushed end rather than scrolled to it, so the
       measurement cannot depend on an animation settling. */
    await p.evaluate(() => {
      document.body.style.animation = "none";
      document.body.style.setProperty("--hush", "1");
    });
    await p.waitForTimeout(600);
    const clip = await p.evaluate(() => {
      const b = document.querySelector(".rail-item-label")!.getBoundingClientRect();
      return { x: Math.round(b.x), y: Math.round(b.y),
               width: Math.max(40, Math.round(b.width)),
               height: Math.max(12, Math.round(b.height)) };
    });
    const got = await ratio(p, clip);
    ok(`${theme}: the hushed rail is still above the contrast a reader needs`,
      got >= 4.5, `measured ${got.toFixed(2)}:1, and 4.5:1 is the line for `
      + "normal text. Take the multiplier in @layer shell down.");
    await p.close();
  }
}

    /* ---- 5. a lesson's only language is on the screen ----
       `@layer lesson` puts both bodies in the markup and hides one, keyed
       on `data-read-lang`, which the boot script sets from `tool-lang`.
       144 of the 225 written lessons have no second body, so hiding the
       Bangla on those hides the LESSON, and the page renders no switch to
       undo it because there is nothing to switch to.

       Nothing else can see it: the row is right, the route renders every
       word, and `parity.test.ts` finds the server's HTML correct. What is
       missing is one `display` value. */
{
  if (!LESSON_BN.trim()) {
    ok("there is a Bangla-only lesson to measure", false,
      "content/schools.backup.json has none. Refresh it with "
      + "`node scripts/export-schools.ts`.");
  } else {
    /** Is the element on the screen, or is it `display: none`.
        Read off the box rather than off the declaration, because
        what a reader loses is the height. */
    const seen = async (pg: Page, id: string): Promise<boolean> =>
      await pg.evaluate((at: string) => {
        const el = document.getElementById(at);
        return !!el && el.getBoundingClientRect().height > 0;
      }, id);

    for (const read of ["bn", "en"] as const) {
      const p: Page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await p.goto(`http://localhost:${PORT}/lesson/bn`, { waitUntil: "load" });
      await p.evaluate((r: string) =>
        document.documentElement.setAttribute("data-read-lang", r), read);
      await p.waitForTimeout(60);

      ok(`a lesson with only Bangla in it is on the screen with data-read-lang="${read}"`,
        await seen(p, "ls-bn"),
        "the whole lesson is display:none. `.ls-body` carries `data-langs`, "
        + "and @layer lesson may only hide a half that has a counterpart.");
      await p.close();
    }

    /* AND THE CHOICE STILL WORKS WHERE THERE IS ONE. A guard
       written too wide would show both languages at once on the
       81 money lessons, which is the other way to get this
       wrong and looks nothing like a bug in a screenshot. */
    if (!LESSON_PAIR) {
      ok("there is a two-language lesson to measure", false,
        "content/schools.backup.json has none.");
    } else {
      for (const read of ["bn", "en"] as const) {
        const p: Page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await p.goto(`http://localhost:${PORT}/lesson/both`, { waitUntil: "load" });
        await p.evaluate((r: string) =>
          document.documentElement.setAttribute("data-read-lang", r), read);
        await p.waitForTimeout(60);

        ok(`a lesson written twice shows ${read} and only ${read}`,
          await seen(p, `ls-${read}`) && !await seen(p, `ls-${read === "bn" ? "en" : "bn"}`),
          "both halves are on the screen, or neither is. The reader asked for one.");
        await p.close();
      }
    }
  }
}

    /* ---- 6. the fixture is the routes' own markup ----
       Everything above is measured on the page written at the top of this
       file. If a route renames the class its column carries, that page
       goes on measuring beautifully and stops describing the site. */
{
  const route = (...at: string[]): string =>
    readFileSync(join(ROOT, "next", "app", ...at), "utf8");
  const piece = route("[section]", "[slug]", "page.tsx");
  const lesson = route("[section]", "[slug]", "[lesson]", "page.tsx");

  ok("a piece is still a `wrap article`", piece.includes('"wrap article"'),
    "the fixture above measures that class");
  ok("a lesson is still a `term-article`", lesson.includes("term-article"),
    "the fixture above measures the wrap that holds one");
  ok("a piece still names its byline", piece.includes('"byline mono"'));
  ok("and the tools are still one row rather than two bands",
    piece.includes('"piece-tools"'),
    "`<Keep>` and `<ReadAloud>` each drew a band of their own");

  /* Section 5 measures a `.ls-body` carrying `data-langs`, and
     that attribute is the whole of the guard: if the component
     stops writing it, every rule keyed on it stops matching and
     nothing here fails. */
  const body = readFileSync(
    join(ROOT, "next", "components", "lesson", "body.tsx"), "utf8");
  ok("a lesson body still says which languages it carries",
    /className="ls-body"\s+data-langs=/.test(body),
    "section 5 above measures that attribute, and @layer lesson keys on it");
  ok("and it still says `both` only when there is an English half",
    /data-langs=\{english \? "both" : "bn"\}/.test(body),
    "the value is what decides whether a language may be hidden");
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  await browser.close();
  server.close();
  process.exit(1);
}
console.log("Every number this site states about its own typography was\n"
  + "measured against its own prose, in both scripts.\n");
await browser.close();
server.close();
