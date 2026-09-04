/* ============================================================
   interactive.test.ts: does what a page's own module writes into
   it survive the page being a route?

     node next/interactive.test.ts

   Needs `npx next build` in `next/` first, and a browser. Without
   either it says which one is missing and skips, and a skip is not
   a pass.

   ---- what it is for ----

   Every calculator on this site went blank on the day its page
   stopped being a file. `parity.test.ts` could not see it and
   neither could any other check here, because all of them read
   HTML: the markup was right, the module was right, the module ran
   and computed the right number, and then React's hydration put
   the empty markup back. Nothing but a browser can tell those two
   apart, which is the same argument `next/admin.test.ts` makes
   for the admin panel and is why this file looks like that one.

   So each case below names a page and something in it that ONLY
   that page's module can have written: a stat with a figure in it,
   a chart with an axis, a panel of drivers. If the module never
   ran, or ran and had its work undone, the element is empty and
   the check fails.

   The pages are served the way Cloudflare serves them: the HTML
   Next prerendered, the chunks it built beside it, and everything
   else out of `aab/`, which is exactly the split `wrangler.toml`
   describes. The dynamic routes are not here: they need the
   database, and `parity.test.ts` is where they are asked about.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Page, Route } from "playwright";
/* The SOURCE, not the package copy: node strips types from a
   file in the tree and refuses to from one inside
   `node_modules`, which is where `install-links` puts
   `@reiad/shared`. `next/lesson.test.ts` reaches for the same
   files the same way. */
import { compounding } from "../shared/calculators.ts";
import { fmtTk } from "../shared/tool-strings.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, ".next");
const AAB = join(HERE, "..", "aab");
const PORT = 8991;

/* A page, the file Next prerendered it into, and one thing in it
   that only its own module can have put there. Where the markup
   ships a placeholder for that thing, the placeholder is named
   too: an element that exists in the page either way proves
   nothing, and this is a check about whether anything filled it. */
type Case = [url: string, file: string, selector: string, what: string, placeholder?: string];
const CASES: Case[] = [
  /* The home page is not here any more. It carried `#kinetic`, a
     headline `/app.js` rebuilt one span per word, and the front
     door has no such thing since Stage 11.8: it renders three
     headlines and shows one, and the choosing is a stylesheet
     rule rather than a script. What holds the door now is the
     block at the foot of this file, which checks that it shows
     one introduction and fits one screen. */
  ["/tools", "tools.html", '[data-stat="final"] .v',
   "what a monthly habit becomes, computed by /tools/tools.js", "–"],
  ["/tools/stock", "tools/stock.html", "#pillars .pillar",
   "the six pillars, built by /tools/stock.js"],
  ["/portfolio/dcf", "portfolio/dcf.html", "#drivers *",
   "the valuation's drivers, built by /portfolio/dcf.js"],
  ["/portfolio/dsex", "portfolio/dsex.html", "#chart-index *",
   "the index chart, drawn by /portfolio/dsex.js"],
  ["/portfolio/stress", "portfolio/stress.html", "#drivers *",
   "the stress test's drivers, built by /portfolio/stress.js"],
  ["/portfolio/three-statement", "portfolio/three-statement.html", "#drivers *",
   "the model's drivers, built by /portfolio/three-statement.js"],
  ["/portfolio/dissertation", "portfolio/dissertation.html", "#chart-evidence *",
   "the evidence chart, drawn by /portfolio/dissertation.js"],
  ["/portfolio/frontier", "portfolio/frontier.html", "#frontier-chart *",
   "the frontier itself, drawn by /portfolio/frontier.js"],
  ["/portfolio/scorecard", "portfolio/scorecard.html", "#roc-chart *",
   "the ROC curve, drawn by /portfolio/scorecard.js"],
  /* Both of these were here for `/app.js`, which every page loads
     and no page's markup held any of: the hover panel it built
     under the Skills link was in neither file, so it was the one
     thing that proved the module had run.

     There is no panel. The menu is a rail rendered on the server
     and it is in both files, which is the improvement and also
     why it cannot be the witness here. `#app-toast` is app.js's
     now: the toast host is appended by the module and by nothing
     else, and it is on every page. */
  ["/portfolio", "portfolio.html", "#palette",
   "the Ctrl+K palette, built by /app.js"],
  ["/skills", "skills.html", "#palette",
   "the Ctrl+K palette, built by /app.js"],
];

/* The home page shows one of four introductions, chosen before the
   first paint from what the reader chose last time. All four at
   once is what shipped when the boot script that picks was left
   out of the port. */
/* Three answers, not four. The `track` axis went at Stage 11.8:
   it split a learner into "finance" and "skills" because the
   learning half had two front doors, money at /money/ and
   everything else at /skills/. The money school is one entry in
   the skills list now, so there is one door and nothing left to
   refine. Anything a browser still has stored under `track` is
   ignored. */
type Reader = [who: string, audience: string | null, track: string | null, expected: string];
const READERS: Reader[] = [
  ["a reader who has just arrived", null, null, "open"],
  ["a learner", "learn", null, "learn"],
  ["a reader here for work", "work", null, "work"],
];

let passed = 0;
const failures: string[] = [];
/** `detail` is whatever the page said, and a locator says null
    where there was nothing to say. */
const ok = (name: string, condition: unknown, detail: string | null = ""): void => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}: ${detail}` : name);
};

/** Says why, and does not come back: `never` rather than `void`,
    so the browser below is not optional once this line is past. */
const skip: (why: string) => never = (why) => {
  console.log(`interactive: SKIPPED, ${why}`);
  process.exit(0);
};

const exists = (path: string): Promise<boolean> => stat(path).then(() => true, () => false);

/* ---- the two things this cannot run without ---- */

if (!await exists(join(BUILD, "server/app/index.html"))) {
  skip("next/.next holds no prerendered pages. Run `npx next build` in next/ first.");
}

const browserPath = process.env.CHROMIUM_PATH
  || (await exists("/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
    : null);

/* The runtime import is the real path, because node resolves a
   file on disk; the types come from the same package through the
   `paths` entry in `tsconfig.json`. The specifier is a VARIABLE
   because a literal is analysed, and a relative path `paths`
   cannot map is a module with no declaration. */
const PLAYWRIGHT = "../app/node_modules/playwright/index.mjs";
const playwright = await import(PLAYWRIGHT)
  .then((m) => m as typeof import("playwright"), () => null);
if (!playwright) {
  skip("playwright is not installed. It is a devDependency of app/: `cd app && npm install`.");
}
const { chromium } = playwright;
if (!browserPath && !process.env.CHROMIUM_PATH) {
  try {
    chromium.executablePath();
  } catch {
    skip("no browser. Point CHROMIUM_PATH at one, or `npx playwright install chromium`.");
  }
}

/* ---- the site, served the way Cloudflare serves it ---- */

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
};

/* Which URL is answered by which of Next's prerendered files.
   Mostly the cases above; the front door is here as well and is
   not one of them, because what it proves is not "a module ran"
   but "one introduction shows and the page fits a screen", which
   is the block at the foot of this file. Leaving it out of both
   is how it silently started 404ing. */
const PRERENDERED: Record<string, string> = {
  ...Object.fromEntries(CASES.map(([url, file]) => [url, file])),
  "/": "index.html",
  /* Not one of the cases either: what the contact form proves is
     not "a module drew something" but "pressing Send reaches
     somebody", which is the block at the foot of this file. */
  "/contact": "contact.html",
};

const server = createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname;
  const prerendered = PRERENDERED[path];
  const file = prerendered
    ? join(BUILD, "server/app", prerendered)
    : path.startsWith("/_next/static/")
      ? join(BUILD, "static", path.slice("/_next/static/".length))
      : join(AAB, path.replace(/^\//, ""));
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("not found");
  }
});
await new Promise<void>((resolve) => { server.listen(PORT, () => resolve()); });

const browser = await chromium.launch(browserPath ? { executablePath: browserPath } : {});

/** What one load of a page leaves behind. */
interface Loaded {
  page: Page;
  errors: string[];
}

/** What a reader's browser remembers before the page opens: the
    audience they chose, and the track they chose before that axis
    went. */
type Remembers = [audience: string | null, track: string | null];

/** One page, loaded and left alone for a moment: a module that
    draws a chart is allowed to take longer than the load event. */
/** What a reader had already chosen before this page loaded.
    Separate from `remembers` because these are the calculators'
    own keys rather than the shell's. */
interface Prefs { toolLang?: string; toolDepth?: string }

const open = async (
  path: string,
  remembers?: Remembers,
  prefs?: Prefs,
): Promise<Loaded> => {
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => { errors.push(e.message); });
  /* The webfonts are the one thing here that is not this site's,
     and a test that needs Google to answer is a test that goes red
     on somebody else's afternoon. */
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());
  if (remembers) {
    await page.addInitScript(([a, k]: Remembers) => {
      if (a) localStorage.setItem("audience", a);
      if (k) localStorage.setItem("track", k);
    }, remembers);
  }
  /* The calculators read `tool-lang` at module scope, so it has
     to be in storage BEFORE the page loads rather than set and
     reloaded: that is what an init script is for. */
  if (prefs?.toolLang) {
    await page.addInitScript((v: string) => {
      localStorage.setItem("tool-lang", v);
    }, prefs.toolLang);
  }
  /* The same reason one field along: `stock.js` reads `tool-depth`
     at module scope to decide how much of its form to draw. */
  if (prefs?.toolDepth) {
    await page.addInitScript((v: string) => {
      localStorage.setItem("tool-depth", v);
    }, prefs.toolDepth);
  }
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  return { page, errors };
};

for (const [url, , selector, what, placeholder] of CASES) {
  const { page, errors } = await open(url);

  /* The argument is a TUPLE and is annotated as one on both
     sides: inferred, it is an array of the union of its two
     members, and the function then cannot say which is which. */
  const asked: [string, string | undefined] = [selector, placeholder];
  const found = await page.evaluate(([s, empty]: [string, string | undefined]) => {
    const nodes = [...document.querySelectorAll(s)];
    if (!nodes.length) return "nothing matches";
    if (empty === undefined) return null;
    const text = (nodes[0].textContent || "").trim();
    return text && text !== empty ? null : `still reads "${text}"`;
  }, asked);
  ok(`${url} has ${what}`, found === null, `${found} ${selector}`);

  /* React error #418 and its neighbours are what a hydration
     mismatch looks like once the build is minified, and a page
     that logs one has thrown away the markup the server sent. */
  const hydration = errors.filter((e) => /Minified React error #(418|423|425)/.test(e));
  ok(`${url} hydrates cleanly`, hydration.length === 0, hydration[0]);

  await page.close();
}

/* ============================================================
   THE FIVE CALCULATORS, all of them

   One case above drove `/tools` and asked whether the compounding
   calculator's first figure had stopped saying "–". That was the
   whole of it, and it was enough while each calculator held its
   own arithmetic: a bug reached one of them.

   They share a driver now. `shared/calculators.ts` produces
   numbers by name and the key of a sentence, and one loop in
   `tools.js` fills all five from that, so a fault in the loop hits
   every calculator at once and the old assertion would still pass
   on the one it happened to watch.

   And the split invents one new way to be wrong that no check
   reading HTML can see: a `{placeholder}` with no number behind
   it, or a phrase key that does not exist, both of which RENDER.
   What a reader gets is the characters `{gap}` or the word
   `calc.emi.shorter` in the middle of a sentence, on a page that
   is otherwise perfect. So the verdict is read as text and asked
   whether it is a sentence.
   ============================================================ */
{
  const { page } = await open("/tools");

  /* The figure names are the MODEL's, and the markup's
     `data-stat` has to match them or a figure is written into a
     box that is not there. `position`'s said `risk` while the
     model produced `riskTaka`, and `risk` is also the name of an
     input, so the two could not be reconciled by guessing.

     `sanchayapatra` names none, and that is not an omission: this
     site shows the comparison as two boxes with the working in
     them, gross, tax, kept and total, which is more than three
     figures can hold. It is asserted below on its own terms. */
  const TOOLS: Array<[id: string, figures: string[], chart: boolean]> = [
    ["compounding", ["final", "paid", "growth"], true],
    ["sanchayapatra", [], true],
    ["inflation", ["worth", "lost", "real"], true],
    ["emi", ["emi", "interest", "total"], true],
    /* Position sizing has never had one, and should not: its
       answer is a share count, and a chart of one number is
       decoration. */
    ["position", ["shares", "cost", "riskTaka"], false],
  ];

  for (const [id, figures, chart] of TOOLS) {
    /* Every calculator is a tab and only one is shown, so each
       has to be opened before it can be read. */
    await page.evaluate((tool: string) => { location.hash = tool; }, id);
    await page.waitForTimeout(120);

    const seen = await page.evaluate((tool: string) => {
      const root = document.getElementById(tool);
      if (!root) return null;
      const text = (sel: string) => (root.querySelector(sel)?.textContent ?? "").trim();
      return {
        stats: [...root.querySelectorAll("[data-stat]")].map((el) => ({
          key: el.getAttribute("data-stat") ?? "",
          value: (el.querySelector(".v")?.textContent ?? "").trim(),
          note: (el.querySelector(".n")?.textContent ?? "").trim(),
        })),
        verdict: text(".verdict"),
        chart: root.querySelector(".chart-box svg") !== null,
        /* The comparison's two boxes, for the one calculator
           that has them: four cells each, and a `winner` on
           whichever came out ahead. */
        sides: [...root.querySelectorAll("[data-side]")].map((box) => ({
          filled: [...box.querySelectorAll("[data-k]")]
            .map((cell) => (cell.textContent ?? "").trim())
            .filter((v) => v !== "" && v !== "–").length,
          cells: box.querySelectorAll("[data-k]").length,
          winner: box.classList.contains("winner"),
        })),
      };
    }, id);

    ok(`${id} is on the page`, seen !== null);
    if (!seen) continue;

    for (const key of figures) {
      const stat = seen.stats.find((s) => s.key === key);
      ok(`${id}.${key} was filled in`,
        stat !== undefined && stat.value !== "" && stat.value !== "–",
        `reads "${stat?.value ?? "no such figure"}"`);
      /* The note under a figure is chosen by the model, so an
         unfilled one is a branch that named a phrase nobody
         wrote. Empty is legal for two of them and says so by
         being empty rather than by holding a key. */
      ok(`${id}.${key}'s note is words rather than a key`,
        stat !== undefined && !/^calc\./.test(stat.note) && !/[{}]/.test(stat.note),
        `reads "${stat?.note}"`);
    }

    ok(`${id} says what it found`, seen.verdict.length > 20, `"${seen.verdict}"`);
    ok(`${id}'s verdict has no unfilled holes in it`,
      !/[{}]/.test(seen.verdict),
      `"${seen.verdict}"`);
    ok(`${id}'s verdict is a sentence rather than a phrase key`,
      !/^calc\./.test(seen.verdict),
      `"${seen.verdict}"`);
    ok(chart ? `${id} drew its chart` : `${id} draws no chart, as it should not`,
      seen.chart === chart);

    if (id === "sanchayapatra") {
      ok("the comparison has both boxes", seen.sides.length === 2,
        `${seen.sides.length} boxes`);
      for (const side of seen.sides) {
        ok("and every cell in it was filled",
          side.cells > 0 && side.filled === side.cells,
          `${side.filled} of ${side.cells}`);
      }
      /* Exactly one, always. Two winners is a comparison that has
         stopped comparing, and none is the class never being
         applied at all: both render perfectly. */
      ok("exactly one of the two is marked the winner",
        seen.sides.filter((x) => x.winner).length === 1);
    }
  }

  await page.close();
}

/* ============================================================
   THE STOCK CHECK ASKS FOR ELEVEN NUMBERS, NOT EIGHTY-FIVE

   The page reads the same eighty-five values either way: what
   changes is how many of them a reader is asked to type, and the
   note under the switch says which half of the answer is theirs
   and which is their sector's. Every way of getting this wrong
   renders a form that looks fine, so what is checked is the
   COUNT, what survives the switch, and whether the reader's own
   figures are still there afterwards.
   ============================================================ */
{
  const { page, errors } = await open("/tools/stock");

  const count = (): Promise<{ fields: number; groups: number }> =>
    page.evaluate(() => ({
      fields: document.querySelectorAll("#drivers .driver").length,
      groups: document.querySelectorAll("#drivers details[data-group]").length,
    }));

  const quick = await count();
  ok("it opens with the main numbers and nothing else",
    quick.fields === 13 && quick.groups === 5, JSON.stringify(quick));
  ok("and says what it is assuming for the rest",
    ((await page.textContent("#depth-note")) ?? "").includes("typical values"),
    (await page.textContent("#depth-note")) ?? "nothing");

  /* A figure typed in the short form, so the switch can be shown
     not to lose it. Reading it back off the URL is the honest
     check: that string IS the state of the page. */
  await page.fill("#in-price", "321");
  await page.waitForTimeout(200);

  await page.click('#depth-switch button[data-depth="all"]');
  await page.waitForTimeout(400);
  const all = await count();
  /* Against the short form rather than against a number typed
     here: the count moves whenever a field is added to the model,
     and a test that pins it is a test somebody edits to make it
     pass. What is being claimed is that Everything is several
     times the short form, which is the whole point of there being
     two. */
  ok("Everything opens the whole form",
    all.fields > quick.fields * 4, JSON.stringify({ quick, all }));
  ok("and every group of it", all.groups >= 7, JSON.stringify(all));
  ok("what was typed in the short form is still there",
    await page.inputValue("#in-price") === "321");

  await page.click('#depth-switch button[data-depth="quick"]');
  await page.waitForTimeout(400);
  ok("and going back does not lose it either",
    await page.inputValue("#in-price") === "321");
  ok("the short form is short again", (await count()).fields === 13);
  ok("nothing threw", errors.length === 0, errors[0] ?? "");
  await page.close();
}

/* ---- and a reader who wants all of it keeps it ---- */
{
  const { page } = await open("/tools/stock", undefined, { toolDepth: "all" });
  ok("a reader who chose Everything gets Everything on the next visit",
    await page.evaluate(() =>
      document.querySelectorAll("#drivers .driver").length) > 40);
  await page.close();
}

/* ============================================================
   AND IT KNOWS WHICH COMPANY IT IS ABOUT

   Two label fields nothing scores, which is exactly why they had
   to be added to `DEFAULTS`: that object is the list the URL
   encoder walks, so a field outside it is a field a shared link
   drops. The link a holding in the live portfolio makes is this
   URL, so what is checked here is the arrival.
   ============================================================ */
{
  const { page, errors } = await open("/tools/stock?name=Square+Pharma&ticker=SQURPHARMA&price=321");

  ok("the company arrives from the link",
    await page.inputValue("#in-name") === "Square Pharma");
  ok("so does its ticker", await page.inputValue("#in-ticker") === "SQURPHARMA");
  ok("and the price the holding was at",
    await page.inputValue("#in-price") === "321");
  ok("the verdict says which company it is about",
    ((await page.textContent("#verdict-who")) ?? "").includes("Square Pharma"),
    (await page.textContent("#verdict-who")) ?? "nothing");
  ok("and it is not hidden any more",
    await page.$eval("#verdict-who", (n: Element) => !(n as HTMLElement).hidden));

  /* The round trip, which is what makes a saved check findable
     from a holding: `/tools/live` reads the ticker back out of
     the query a scenario stored. */
  const url = await page.evaluate(() => location.search);
  ok("and the ticker survives into the address the save stores",
    new URLSearchParams(url).get("ticker") === "SQURPHARMA", url);
  ok("nothing threw", errors.length === 0, errors[0] ?? "");
  await page.close();
}

/* ============================================================
   And in Bangla, which they were not until they moved

   These five had English verdicts and English labels, not by
   anybody's decision but because the sentences were template
   literals inside the module that drew them: translating one
   meant editing code. They are phrases now, in both languages,
   and `tool-lang` decides, which is the same key the stock check
   next door has written since long before there were accounts.

   Asserted by SCRIPT, because the Bengali block is the only
   evidence that survives: a page that "looks translated" and a
   page whose labels are still English render identically to
   anything reading HTML. */
{
  const bengali = /[\u0980-\u09FF]/;
  const { page } = await open("/tools", undefined, { toolLang: "bn" });
  await page.evaluate(() => { location.hash = "emi"; });
  await page.waitForTimeout(200);

  const seen = await page.evaluate(() => {
    const root = document.getElementById("emi");
    return {
      labels: [...document.querySelectorAll("[data-i18n]")]
        .map((el) => (el.textContent ?? "").trim()),
      verdict: (root?.querySelector(".verdict")?.textContent ?? "").trim(),
      note: (root?.querySelector('[data-stat="emi"] .n')?.textContent ?? "").trim(),
    };
  });

  ok("every label on the tools page is translatable", seen.labels.length >= 30,
    `${seen.labels.length} carry data-i18n`);
  ok("and a reader who chose Bangla gets Bangla labels",
    seen.labels.filter((l) => bengali.test(l)).length >= 30,
    `${seen.labels.filter((l) => bengali.test(l)).length} of ${seen.labels.length} are Bangla`);
  ok("the verdict is in Bangla too", bengali.test(seen.verdict), `"${seen.verdict}"`);
  ok("and so is the line under a figure", bengali.test(seen.note), `"${seen.note}"`);
  /* The numbers inside it still arrived. A translated sentence
     with a hole in it is the one thing this move could break. */
  ok("with its numbers still in it", !/[{}]/.test(seen.verdict), `"${seen.verdict}"`);

  await page.close();
}

for (const [who, audience, track, expected] of READERS) {
  const { page } = await open("/", [audience, track]);

  const shown = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("[data-when]")]
      .filter((el) => getComputedStyle(el).display !== "none")
      .map((el) => el.dataset.when));

  ok(`the home page shows ${who} one introduction`,
    shown.length > 0 && new Set(shown).size === 1 && shown[0] === expected,
    `expected ${expected} only, got [${shown}]`);

  /* Under the hero the page is four bands and then the board,
     and the contract to hold is that it says a thing ONCE.

     It did not. There was a hand-written deck of eleven tiles
     above a board that draws the schools and the tools out of
     `shared/nav.ts`, and the two between them made 26 internal
     links to 17 places. That deck went; then the bands and the
     board drew the schools and the tools twice over, which is the
     same failure one rewrite later, and `DRAWABLE` in
     `home/board.tsx` is what settles it now: a widget the PAGE
     draws is not a widget this build renders.

     VISIBLE LINKS ONLY, and that is not a loosening. The door
     server-renders a pair of buttons for each of the three
     audiences and the stylesheet shows one, so counting the DOM
     counted two doors nobody can press and reported every
     destination three times on a page that shows it once. */
  const front = await page.evaluate(() => ({
    tiles: [...document.querySelectorAll(".card[href], .gate-tile[href], .work-card[href]")]
      .map((t) => t.getAttribute("href")).filter(Boolean),
    links: [...document.querySelectorAll<HTMLAnchorElement>("main a[href^='/']")]
      .filter((a) => a.getClientRects().length > 0)
      .map((a) => a.getAttribute("href")!),
    /* The door's own pair, in order, and only the pair this
       reader can see. */
    doors: [...document.querySelectorAll<HTMLElement>(".hero-actions")]
      .filter((el) => getComputedStyle(el).display !== "none")
      .flatMap((el) => [...el.querySelectorAll("a[href]")]
        .map((a) => a.getAttribute("href")!)),
    /* The ledger: a numeral, a word and a destination per row. */
    ledger: [...document.querySelectorAll(".ledger li")].map((li) => ({
      count: li.querySelector("[data-count]")?.getAttribute("data-count") ?? "",
      numeral: (li.querySelector("[data-count]")?.textContent ?? "").trim(),
      href: li.querySelector("a")?.getAttribute("href") ?? "",
    })),
    /* Every case study, on the front page, with its chart. */
    studies: [...document.querySelectorAll(".work-card[href]")]
      .map((a) => ({ href: a.getAttribute("href")!, chart: !!a.querySelector(".work-art") })),
  }));

  ok(`the front page still has cards for ${who}`, front.tiles.length >= 8,
    `${front.tiles.length} tiles`);

  const times = new Map<string, number>();
  for (const href of front.links) times.set(href, (times.get(href) ?? 0) + 1);
  const thrice = [...times].filter(([, n]) => n > 2);
  ok(`and says no destination three times over for ${who}`, thrice.length === 0,
    thrice.map(([h, n]) => `${h} x${n}`).join(", "));

  /* THE SWITCH MOVES A DOOR, not three sentences. It used to move
     the headline, the lede and one card two screens down, so the
     answer to "I am here to hire" was a paragraph. The pair of
     buttons under the lede is the answer now, and there is one
     pair on screen. */
  const doors: Record<string, string[]> = {
    open: ["/skills", "/portfolio"],
    learn: ["/money", "/skills"],
    work: ["/portfolio", "/contact"],
  };
  ok(`the door offers ${who} their own two ways in`,
    front.doors.join(",") === doors[expected].join(","),
    `got [${front.doors}], expected [${doors[expected]}]`);

  /* THE LEDGER COUNTS. Every row names a key of `COUNTS` and
     carries the number that key holds, so a course published
     tomorrow moves it and nobody edits the page. The rows point
     at five different places, because a list of five whose whole
     job is to be five ways in had two rows going to /skills. */
  ok(`the ledger states five counted facts for ${who}`,
    front.ledger.length === 5 && front.ledger.every((r) => r.count && r.numeral),
    JSON.stringify(front.ledger));
  ok(`and each of them is a different way in for ${who}`,
    new Set(front.ledger.map((r) => r.href)).size === front.ledger.length,
    front.ledger.map((r) => r.href).join(", "));

  /* THE WORK IS ON THE FRONT PAGE. Seven finished case studies
     were two clicks behind a card that said "See the work", so
     the strongest evidence this site has was invisible from the
     page a stranger meets. */
  ok(`the work is on the front page for ${who}`, front.studies.length === 7,
    `${front.studies.length} case studies`);
  ok(`and every one of them carries its chart for ${who}`,
    front.studies.every((s) => s.chart),
    front.studies.filter((s) => !s.chart).map((s) => s.href).join(", "));

  await page.close();
}

/* ============================================================
   The reckoner: the one thing on the front page a reader can use

   Five radios, five answers, and the stylesheet shows the one
   whose radio is checked. There is no JavaScript in it, which is
   the whole point: it answers before hydration and it answers
   with the site's own model rather than with a number somebody
   typed. So this checks two things a screenshot cannot: that
   exactly ONE answer is on screen at a time, and that the figure
   in it is what `compounding.run()` returns.
   ============================================================ */
{
  const { page, errors } = await open("/");

  const shown = () => page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".rk-a")]
      .filter((el) => getComputedStyle(el).display !== "none")
      .map((el) => ({ for: el.dataset.rk, fig: (el.querySelector(".rk-fig")?.textContent ?? "").trim() })));

  const first = await shown();
  ok("the reckoner shows one answer", first.length === 1, `${first.length} shown`);
  ok("and it is the middle amount before anything is pressed",
    first[0]?.for === "5000", first[0]?.for ?? "none");

  /* THE FIGURE IS THE MODEL'S. `compounding` is imported here and
     run with the same three arguments the component uses, so a
     change to the model that this page did not follow fails
     rather than shipping a wrong number under a heading about
     money. */
  const want = fmtTk(compounding.run({
    start: 0, monthly: 5000, rate: 10, years: 20,
  }).values.final ?? 0, "bn", 0);
  ok("and the figure is what the model returns", first[0]?.fig === want,
    `${first[0]?.fig} vs ${want}`);

  await page.click('label[for="rk-20000"]');
  const after = await shown();
  ok("pressing an amount answers with that amount",
    after.length === 1 && after[0]?.for === "20000",
    after.map((a) => a.for).join(", "));
  const want20 = fmtTk(compounding.run({
    start: 0, monthly: 20000, rate: 10, years: 20,
  }).values.final ?? 0, "bn", 0);
  ok("with the model's figure again", after[0]?.fig === want20,
    `${after[0]?.fig} vs ${want20}`);

  /* No JavaScript ran to do any of that. */
  ok("no page errors in the reckoner", errors.length === 0, errors[0]);
  await page.close();
}

/* ============================================================
   The board, which is the reader's and nobody else's

   A stranger got a section headed "আপনার বোর্ড · Your board" with
   an arrange button on it, and under it four rows reading ০টা
   পাঠ, on the first visit anybody ever made. A dashboard of
   somebody's progress shown to somebody who has none is worse
   than no dashboard, so there are two states and both are checked
   here: an invitation for a reader with nothing, and the board
   itself for a reader with something.

   Three of the widgets drew their own heading, in three different
   shapes, and three drew none: the market grid was eight of
   somebody else's headlines under nothing at all. The catalogue
   in `shared/widgets.ts` holds a name in both languages, the
   picker offers it under that name, and it is DATA, so the app
   says the same words. The board says it once, from there.
   ============================================================ */
{
  const { page, errors } = await open("/");

  const stranger = await page.evaluate(() => ({
    board: !!document.querySelector(".board"),
    arrange: !!document.querySelector(".board-bar button"),
    invite: (document.querySelector("main")?.textContent ?? "")
      .includes("এই পাতাটা আপনার হয়ে যাবে"),
    zeroes: (document.querySelector("main")?.textContent ?? "").includes("০টা পাঠ"),
  }));

  ok("a stranger gets no board", stranger.board === false);
  ok("and no button to arrange one", stranger.arrange === false);
  ok("and is told what a board is instead", stranger.invite);
  ok("and is never shown a row of noughts", stranger.zeroes === false);

  ok("no page errors", errors.length === 0, errors[0]);
  await page.close();
}

{
  /* A reader who has read something. `learn-read` and `learn-last`
     are the money school's keys, spelled the way they have been
     spelled since before the school moved to `/money`: renaming
     one does not move somebody's ticks, it loses them. */
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => { errors.push(e.message); });
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());
  await page.addInitScript(() => {
    localStorage.setItem("learn-read", JSON.stringify(["basics-1/why-invest"]));
    localStorage.setItem("learn-last", "/money/basics-1/why-invest");
  });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  const board = await page.evaluate(() => {
    const items = [...document.querySelectorAll<HTMLElement>(".board-item")];
    return {
      exists: !!document.querySelector(".board"),
      items: items.length,
      empty: items.filter((i) => !i.querySelector(".board-body")?.children.length).length,
      named: items.filter((i) => (i.querySelector(".board-item-label")
        ?.textContent ?? "").trim().length > 3).length,
      bar: (() => {
        const bar = document.querySelector<HTMLElement>(".board-bar");
        if (!bar) return null;
        const label = bar.querySelector<HTMLElement>(".section-label");
        const button = bar.querySelector<HTMLElement>("button");
        if (!label || !button) return null;
        const l = label.getBoundingClientRect(), t = button.getBoundingClientRect();
        return { label: (label.textContent ?? "").trim().length,
                 sameLine: Math.abs((l.top + l.height / 2) - (t.top + t.height / 2)) < 30 };
      })(),
      /* The meters name the schools this reader has started, and
         not the three they have not: four rows of nought under an
         apology is what the board used to open with. */
      meters: document.querySelectorAll(".meters-list li").length,
      meterText: (document.querySelector(".meters-list b")?.textContent ?? "").trim(),
    };
  });

  ok("a reader who has read something gets a board", board.exists);
  ok("with every widget on it drawing something", board.empty === 0,
    `${board.empty} of ${board.items} empty`);
  ok("and every widget on it named", board.named === board.items,
    `${board.named} of ${board.items} named`);
  ok("the board has a head of its own", board.bar !== null);
  ok("which says what it is", (board.bar?.label ?? 0) > 3);
  ok("with the arrange button on the same line", board.bar?.sameLine === true);
  ok("and the meters name only the school they have started",
    board.meters === 1, `${board.meters} rows`);
  /* A COUNT WITH NO DENOMINATOR SAYS LESS THAN THE PAGE IT LINKS
     TO: twenty of eighty-one and twenty of thirty read the same. */
  ok("and say it against the ladder's own total",
    /\/\s*\S/.test(board.meterText), board.meterText);

  ok("no page errors on a board", errors.length === 0, errors[0]);
  await page.close();
}

{
  /* A BOOKMARK IS WHERE YOU WERE, NOT WHERE TO GO. A reader who
     read a lesson, ticked it and closed the tab was offered that
     same lesson again by the one card on the page that is about
     them. This seeds exactly that state: the bookmark and the tick
     on the same lesson. */
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => { errors.push(e.message); });
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());
  await page.addInitScript(() => {
    localStorage.setItem("learn-read", JSON.stringify(["basics-1/why-invest"]));
    localStorage.setItem("learn-last", JSON.stringify({
      id: "basics-1/why-invest", title: "কেন বিনিয়োগ করবেন", stage: "basics-1",
      url: "/money/basics-1/why-invest", ts: Date.now(),
    }));
  });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  const carry = await page.evaluate(() => {
    const card = document.querySelector<HTMLAnchorElement>(".gate-slim");
    return card ? { href: card.getAttribute("href"), text: (card.textContent ?? "").trim() } : null;
  });

  ok("a finished lesson does not send the reader back to it",
    carry !== null && carry.href !== "/money/basics-1/why-invest",
    JSON.stringify(carry));
  ok("it offers the school, which knows what comes next",
    carry?.href === "/money", carry?.href ?? "no card");

  ok("no page errors on a finished lesson", errors.length === 0, errors[0]);
  await page.close();
}

/* ============================================================
   The drawer, on a phone.

   Three things, and all three were wrong at once in August 2026.

   1. The button that closes the menu was a 34px circle in the far
      corner of the drawer, 233px from the burger the reader had
      just pressed. Opening and closing are one gesture and it
      should not move, so the close button is laid out to land on
      the burger's exact pixels. That is asserted as a box, not as
      "roughly", because the whole point is that it is exact.

   2. `.audience-switch` carried `grid-column: 2`, which is right
      in the bar and wrong in the drawer, and this component is
      deliberately rendered in both. In the drawer it grew an
      implicit second column and sat in it, so the label "What
      brings you here" and the switch went side by side in a 275px
      drawer and the label was clipped to "What brings yo".

   3. The site's name was on screen twice with the menu open, once
      in the bar and once in the drawer's head.

   None of these is visible to a check that reads HTML. The markup
   was correct for all three.
   ============================================================ */
for (const width of [360, 390, 412]) {
  const page = await browser.newPage({ viewport: { width, height: 780 } });
  await page.route("https://fonts.googleapis.com/**", (r) => r.abort());
  await page.goto(`http://localhost:${PORT}/skills`, { waitUntil: "load" });
  await page.waitForTimeout(900);

  const box = (sel: string) => page.evaluate((s: string) => {
    const e = document.querySelector(s);
    if (!e || getComputedStyle(e).display === "none") return null;
    const r = e.getBoundingClientRect();
    return [r.left, r.top, r.width, r.height].map(Math.round).join(",");
  }, sel);

  const burger = await box(".drawer-btn");
  ok(`${width}px: the bar has a burger`, burger !== null);

  /* Open it by pressing the burger where a thumb would. There is
     nothing to press if the check above already failed, and it
     has recorded that; going on would report the same absence a
     second time as eight different failures. */
  const b = await page.locator(".drawer-btn").boundingBox();
  if (!b) { await page.close(); continue; }
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  await page.mouse.click(x, y);
  await page.waitForTimeout(700);

  ok(`${width}px: the burger opens the drawer`,
    await page.evaluate(() => document.documentElement.dataset.drawer) === "open");

  ok(`${width}px: the close button is exactly where the burger was`,
    await box(".drawer-close") === burger,
    `burger ${burger}, close ${await box(".drawer-close")}`);

  const thumb: [number, number] = [x, y];
  ok(`${width}px: that pixel now belongs to the close button`,
    await page.evaluate(([px, py]: [number, number]) =>
      !!document.elementFromPoint(px, py)?.closest(".drawer-close"), thumb));

  /* The drawer's column is built from the button, so everything
     that is not indented starts on its line. */
  const lefts = await page.evaluate(() => {
    const l = (s: string) => { const e = document.querySelector(s);
      return e ? Math.round(e.getBoundingClientRect().left) : null; };
    return { close: l(".drawer-close"), group: l(".rail-nav .rail-label"),
             askLabel: l(".rail-audience .rail-label"),
             ask: l(".rail-audience .audience-switch") };
  });
  ok(`${width}px: the drawer's column starts on the button's line`,
    new Set(Object.values(lefts)).size === 1, JSON.stringify(lefts));

  /* The question and its switch stack. Side by side is the bug. */
  const stacked = await page.evaluate(() => {
    const a = document.querySelector(".rail-audience .rail-label");
    const c = document.querySelector(".rail-audience .audience-switch");
    if (!a || !c) return null;
    return a.getBoundingClientRect().bottom <= c.getBoundingClientRect().top + 1;
  });
  ok(`${width}px: the audience question sits above its switch`, stacked === true);

  /* And the label is not cut off, which is what side by side did. */
  ok(`${width}px: the audience question is not clipped`,
    await page.evaluate(() => {
      const e = document.querySelector(".rail-audience .rail-label");
      return e && e.scrollWidth <= e.clientWidth + 1;
    }));

  /* One site name on screen, not two. */
  ok(`${width}px: the site is named once with the menu open`,
    await page.evaluate(() => [...document.querySelectorAll(".rail-mark, .topbar-mark")]
      .filter((e) => getComputedStyle(e).display !== "none").length) === 1);

  /* The foot is reachable rather than pushed off the bottom. */
  ok(`${width}px: the audience switch is inside the drawer`,
    await page.evaluate(() => {
      const f = document.querySelector(".rail-foot");
      return !!f && f.getBoundingClientRect().bottom <= innerHeight + 1;
    }));

  /* And the same pixel closes it again. */
  await page.mouse.click(x, y);
  await page.waitForTimeout(700);
  ok(`${width}px: the same pixel closes the drawer`,
    await page.evaluate(() => document.documentElement.dataset.drawer) === "shut");

  await page.close();
}

/* On a laptop the rail is a rail: no burger, no close button, the
   mark in the rail rather than the bar. The drawer rules must not
   leak up here.

   The switch is in the RAIL at every width now, which is a change
   and is what this used to assert the opposite of. It was in the
   bar on a laptop, so "what brings you here" sat across the top
   of every page somebody read; it is asked once and then never
   again, so it belongs with the menu.

   What the bar carries instead is the TRAIL, and that is asserted
   here too, because a bar with neither is what this change would
   look like if the component failed to render. It was the site
   tree until 19 August 2026: `TREE_IN_BAR` in `topbar.tsx` is
   false, the tree is still built and still passed in, and "where
   am I" is the question a reader arriving from a search result
   has. The rail down the left already answers "what else is
   there". */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route("https://fonts.googleapis.com/**", (r) => r.abort());
  await page.goto(`http://localhost:${PORT}/skills`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  const state = await page.evaluate(() => {
    const shown = (s: string) => { const e = document.querySelector(s);
      return !!e && getComputedStyle(e).display !== "none"; };
    return { burger: shown(".drawer-btn"), close: shown(".drawer-close"),
             railMark: shown(".rail-mark"), barMark: shown(".topbar-mark"),
             barSwitch: shown(".topbar > .audience-switch"),
             railSwitch: shown(".rail-audience"),
             tree: shown(".topbar .tree-btn"),
             trail: document.querySelectorAll(".topbar .crumbs-bar li").length };
  });
  ok("on a laptop the menu is a rail, not a drawer",
    !state.burger && !state.close && state.railMark && !state.barMark
    && !state.barSwitch && state.railSwitch && !state.tree && state.trail > 0,
    JSON.stringify(state));
  await page.close();
}

/* ============================================================
   The contact form, and the three ways sending it can go

   `components/contact-form.tsx` replaced `/contact-form.js` at
   Stage B, and the thing worth checking is not that it renders.
   It is that the fallbacks still fall back: this is the one page
   on the site where somebody with a broken script is trying to
   reach a person, so the form has to work three ways and say
   which happened.

   The third way is not driven here and cannot be: it is the
   browser posting the form itself with no JavaScript, and what
   makes it true is the `action` and the hidden fields being in
   the markup rather than in a handler. That IS checked, because
   the component could have swallowed them into state and the
   page would look identical.
   ============================================================ */
type Sending = [label: string, api: boolean, web3: boolean, expected: RegExp];
const SENDING: Sending[] = [
  ["the site's own endpoint answers", true, true, /^Sent/],
  ["it does not, and Web3Forms catches it", false, true, /^Sent/],
  ["neither does, and it says so", false, false, /^Couldn't send/],
];
for (const [label, api, web3, expected] of SENDING) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 900 } });
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => { errors.push(e.message); });
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());

  let posted = 0;
  await page.route("**/api/**", (r: Route) => r.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify({ ok: api }),
  }));
  await page.route("https://api.web3forms.com/**", (r: Route) => {
    posted += 1;
    return r.fulfill({ status: 200, contentType: "application/json",
      body: JSON.stringify({ success: web3, message: "x" }) });
  });

  await page.goto(`http://localhost:${PORT}/contact`, { waitUntil: "load" });
  await page.waitForTimeout(700);

  ok(`${label}: the form still posts on its own`,
    await page.locator("form").getAttribute("action") === "https://api.web3forms.com/submit");
  ok(`${label}: with its key and its honeypot in the markup`,
    await page.locator('input[name="access_key"]').count() === 1
    && await page.locator('input[name="botcheck"]').count() === 1);
  /* Empty until there is something to say, so a live region is
     not read out on load. */
  ok(`${label}: and says nothing before it is used`,
    (await page.locator("#form-status").textContent()) === "");

  await page.fill("#contact-name", "A Reader");
  await page.fill("#contact-email", "a@example.com");
  await page.fill("#contact-message", "Hello, this is a message.");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.waitForTimeout(1200);

  const said = await page.locator("#form-status").textContent();
  ok(`${label}: it says what happened`, expected.test(said ?? ""), said);
  ok(`${label}: and falls through only when it has to`,
    api ? posted === 0 : posted === 1, `web3 posts: ${posted}`);
  ok(`${label}: no page errors`, errors.length === 0, errors[0]);
  await page.close();
}

/* ============================================================
   The trail in the bar, and the arrows that open it.

   Three things this cannot be checked without a browser for. The
   arrow is a `<button>` and the panel is `[popover]`, so whether
   it OPENS is the browser's own behaviour and not this site's;
   whether Escape closes it is the same; and whether it needs any
   JavaScript of ours to do either is the whole design claim,
   which only a page with our scripts blocked can settle.

   Only prerendered pages here, because that is what this file's
   server can hold: the 251 school pages are dynamic and their
   trail is `next/parity.test.ts`'s to check.
   ============================================================ */
console.log("\nthe trail, and what its arrows open");
{
  const { page, errors } = await open("/skills");

  ok("the trail is in the bar", await page.locator(".topbar .crumbs-bar").count() === 1);

  /* The mark is the home crumb, so the first crumb the row draws
     is the second of the trail and still has a level in front of
     it. It lost its arrow for a while by being sliced off the
     front of the array instead of skipped. */
  const arrows = page.locator(".crumbs-bar .crumb-step");
  ok("and the crumb after the mark keeps its arrow", await arrows.count() >= 1,
    `${await arrows.count()} arrow(s)`);

  ok("which is a real button", await arrows.first().evaluate(
    (el: Element) => el.tagName === "BUTTON" && (el as HTMLButtonElement).type === "button"));
  ok("with a label a screen reader can read",
    ((await arrows.first().getAttribute("aria-label")) ?? "").length > 3);

  /* Nothing is open until something is pressed. A panel that
     renders open is a panel the reader has to dismiss. */
  ok("nothing is open to begin with",
    await page.locator(".crumb-menu:popover-open").count() === 0);

  await arrows.first().click();
  await page.waitForTimeout(300);
  const open1 = page.locator(".crumb-menu:popover-open");
  ok("pressing it opens the menu", await open1.count() === 1);

  const rows = await open1.locator("a").count();
  ok("which lists where else you could be", rows > 1, `${rows} row(s)`);
  ok("and marks the one you are on",
    await open1.locator('a[aria-current="page"]').count() === 1);

  /* On screen and inside the window. A panel positioned off the
     edge is a panel that opened and cannot be read, which looks
     identical in the DOM to one that worked. */
  const box = await open1.boundingBox();
  const view = page.viewportSize();
  ok("the panel is on screen", Boolean(box) && (box?.width ?? 0) > 80 && (box?.height ?? 0) > 40,
    JSON.stringify(box));
  ok("and inside the window",
    Boolean(box && view && box.x >= 0 && box.y >= 0 && box.x + box.width <= view.width + 1),
    JSON.stringify({ box, view }));

  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  ok("Escape closes it, which is the browser's job and not ours",
    await page.locator(".crumb-menu:popover-open").count() === 0);

  ok("no page errors", errors.length === 0, errors[0]);
  await page.close();
}

/* And the half that has to keep working with no JavaScript at
   all, because that is the reason it is a popover rather than a
   component: this is chrome on 251 pages. */
{
  const page = await browser.newPage();
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());
  await page.route("**/*.js", (r: Route) => r.abort());
  await page.goto(`http://localhost:${PORT}/skills`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);

  ok("with every script blocked, the trail is still drawn",
    await page.locator(".crumbs-bar li").count() >= 1);
  const arrow = page.locator(".crumbs-bar .crumb-step").first();
  await arrow.click();
  await page.waitForTimeout(300);
  ok("and the arrow still opens its menu",
    await page.locator(".crumb-menu:popover-open").count() === 1);
  await page.close();
}

/* ============================================================
   The same trail on a phone, which is where all of it was broken

   Three separate things shipped, and not one of them is visible
   to a check that reads HTML. Two are not visible to a check that
   reads CSS either: every selector involved is valid and matches
   something.

   1. THE PANEL OPENED OFF THE SCREEN. It is 21rem and it is
      anchored to an arrow a third of the way across a 412px bar,
      so its right edge landed 98px past the edge of the window.
      `position-try-fallbacks: flip-inline` is the fallback for
      exactly that and it makes it worse here: the flip hangs the
      panel off the arrow's other side, which is off the LEFT
      edge, so nothing fits and the browser keeps the position it
      started with. It is a sheet against the bottom edge now.

   2. THE TRAIL'S OWN RULES REACHED INSIDE THE PANEL, because a
      crumb's menu is markup inside the crumb. Three of them did:
      `max-inline-size: 4.5ch` capped every row at 34px, and
      `max-width: 22ch` and `46ch` capped the row of the level you
      are on, which is the row the panel exists to show you. The
      kicker wrapped down the side of a 34px box, the label
      clipped to four characters and the count and the chevron
      were pushed off the row entirely.

   3. THE TRAIL SQUASHED RATHER THAN SCROLLING. Four levels into
      a school on a 360px screen that was `› দ… › টা… › প…`.

   The panel and the sheet are asked about on the page's own
   trail. The scrolling needs a trail deeper than any prerendered
   page has, so the row here is built by CLONING the one the page
   rendered: the markup shape stays the component's, and the one
   thing changed per clone is what `<Crumbs>` itself changes, an
   `<a href>` for a crumb that is not the last one.
   ============================================================ */
console.log("\nthe trail on a phone");
for (const width of [360, 412]) {
  const page = await browser.newPage({ viewport: { width, height: 780 } });
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());
  await page.goto(`http://localhost:${PORT}/skills`, { waitUntil: "load" });
  await page.waitForTimeout(900);

  const arrow = page.locator(".crumbs-bar .crumb-step").first();
  await arrow.click();
  await page.waitForTimeout(400);

  const panel = await page.evaluate(() => {
    const m = document.querySelector<HTMLElement>(".crumb-menu:popover-open");
    if (!m) return null;
    const b = m.getBoundingClientRect();
    const rows = [...m.querySelectorAll<HTMLElement>("a")];
    const here = m.querySelector<HTMLElement>('a[aria-current="page"]');
    const head = m.querySelector<HTMLElement>(".crumb-menu-head");
    return {
      box: { x: b.x, y: b.y, right: b.right, bottom: b.bottom, w: b.width },
      vw: innerWidth, vh: innerHeight,
      rows: rows.length,
      narrowest: Math.min(...rows.map((r) => r.getBoundingClientRect().width)),
      hereMaxWidth: here ? getComputedStyle(here).maxWidth : null,
      /* The label is `text-overflow: ellipsis`, so a row too
         narrow for its own words does not look broken, it looks
         like a different lesson. */
      clipped: rows.filter((r) => {
        const l = r.querySelector<HTMLElement>(".crumb-menu-label");
        return !!l && l.scrollWidth > l.clientWidth + 1;
      }).length,
      named: !!head && getComputedStyle(head).display !== "none"
        && (head.textContent ?? "").length > 3,
    };
  });

  ok(`${width}px: the arrow opens a panel`, panel !== null);
  if (!panel) { await page.close(); continue; }

  ok(`${width}px: the panel is inside the window`,
    panel.box.x >= 0 && panel.box.right <= panel.vw + 1
    && panel.box.y >= 0 && panel.box.bottom <= panel.vh + 1,
    JSON.stringify(panel.box) + ` in ${panel.vw}x${panel.vh}`);

  /* The leak, measured rather than read: a row that has been
     capped is a small fraction of the panel it is in. */
  ok(`${width}px: every row is as wide as the panel`,
    panel.narrowest > panel.box.w - 40, `narrowest ${panel.narrowest} of ${panel.box.w}`);
  ok(`${width}px: nothing caps the row you are on`,
    panel.hereMaxWidth === "none", `max-width ${panel.hereMaxWidth}`);
  ok(`${width}px: and no row is clipped to an ellipsis`,
    panel.clipped === 0, `${panel.clipped} of ${panel.rows}`);
  ok(`${width}px: the sheet says what it is`, panel.named);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);

  /* ---- and the row itself, deep enough to overflow ---- */
  await page.evaluate(() => {
    const ol = document.querySelector<HTMLElement>(".crumbs-bar > ol");
    const first = ol?.firstElementChild as HTMLElement | undefined;
    if (!ol || !first) return;
    const names = ["টাকা ও শেয়ার", "পর্যায় ৫"];
    names.forEach((name, i) => {
      const li = first.cloneNode(true) as HTMLElement;
      /* Two ids, one document: `popovertarget` would otherwise
         open the first panel from every arrow. */
      const menu = li.querySelector<HTMLElement>(".crumb-menu");
      const button = li.querySelector<HTMLElement>(".crumb-step");
      if (menu && button) {
        menu.id = `cloned-${i}`;
        button.setAttribute("popovertarget", `cloned-${i}`);
      }
      const label = li.querySelector<HTMLElement>(":scope > span, :scope > a");
      if (label) label.textContent = name;
      ol.appendChild(li);
    });
    /* The last one is the page: exactly one crumb is, and it was
       the one this row started with. */
    for (const li of [...ol.children]) li.removeAttribute("aria-current");
    ol.lastElementChild?.setAttribute("aria-current", "page");
    /* And every crumb before it is a link, which is what
       `<Crumbs>` renders for one. */
    for (const li of [...ol.children].slice(0, -1)) {
      const span = li.querySelector(":scope > span");
      if (!span) continue;
      const a = document.createElement("a");
      a.href = "/skills";
      a.textContent = span.textContent;
      span.replaceWith(a);
    }
  });
  await page.waitForTimeout(300);

  const row = await page.evaluate(async () => {
    const sc = document.querySelector<HTMLElement>(".crumbs-bar");
    const ol = document.querySelector<HTMLElement>(".crumbs-bar > ol");
    if (!sc || !ol) return null;
    const kids = [...ol.children] as HTMLElement[];
    const seen = (e: HTMLElement) => {
      const b = e.getBoundingClientRect(), o = sc.getBoundingClientRect();
      return Math.min(b.right, o.right) - Math.max(b.left, o.left) >= b.width - 1;
    };
    const rest = { last: seen(kids[kids.length - 1]), first: seen(kids[0]) };
    /* The far end of the range, whichever sign it has: the row is
       an `rtl` scroller so that it opens at the end, which puts
       its scroll positions below zero rather than above. */
    sc.scrollLeft = -99999;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));
    const away = { first: seen(kids[0]), scrolled: sc.scrollLeft };
    return {
      overflows: sc.scrollWidth > sc.clientWidth + 1,
      rest, away,
      /* A crumb cut short by a cap rather than by the edge of the
         row: that is what the row did instead of scrolling. */
      capped: kids.filter((li) => {
        const t = li.querySelector<HTMLElement>(":scope > a, :scope > span");
        return !!t && t.scrollWidth > t.clientWidth + 1;
      }).length,
    };
  });

  ok(`${width}px: a deep trail overflows the bar rather than shrinking`,
    row?.overflows === true, JSON.stringify(row));
  ok(`${width}px: no crumb is cut short`, row?.capped === 0, `${row?.capped} capped`);
  ok(`${width}px: it rests showing the page you are on`, row?.rest.last === true);
  ok(`${width}px: with the levels above it scrolled off`, row?.rest.first === false);
  /* The one that shipped as a silent failure: `justify-content:
     flex-end` put the row's start outside its own scroll range,
     so it looked right and no gesture could reach the first two
     levels of the trail. */
  ok(`${width}px: and the start of it can be scrolled back to`,
    row?.away.first === true, `scrollLeft ${row?.away.scrolled}`);

  await page.close();
}

/* ============================================================
   The arrows themselves: one mark, one size, one line

   The fourth thing that was wrong with this row on a phone, and
   the only one a reader reports rather than measures. Every
   selector was valid, every crumb was in the right place, and
   the arrows between them were three different marks:

   1. THE MARK WAS A `›`, so where it sat came from whichever
      font in the stack had the glyph. The trail's stack opens
      with Noto Sans Bengali, which has no `›`.
   2. IT WAS SIZED AT `1.35em` OF THE CRUMB BESIDE IT, and the row
      deliberately sets the crumb you are ON one step larger than
      the ones behind it. Two crumb sizes, two arrow sizes.
   3. `line-height: 1` WAS MEANT TO HOLD IT AND COULD NOT.
      `.crumb-step` sets `font: inherit`, which is a shorthand, so
      the button form got the inherited 1.9 back and the span form
      kept 1. Two forms of one mark, on two lines.
   4. AND THERE WERE TWO OF THEM AFTER THE MARK. A `::before` on
      the first `<li>` drew one to join the trail to the wordmark,
      and the trail is drawn from its second crumb, which already
      carries one.

   Measured off the painted page rather than read off the CSS: the
   three marks sat at -0.5px, +2.5px and +3.1px from the middle of
   the bar, on marks five pixels tall.
   ============================================================ */
console.log("\nthe arrows in the trail");
for (const width of [412, 1280]) {
  const page = await browser.newPage({ viewport: { width, height: 780 } });
  await page.goto(`http://localhost:${PORT}/skills`, { waitUntil: "load" });
  await page.waitForTimeout(900);

  /* THE TAP TARGET IS ASKED OF THE PAGE'S OWN TRAIL, before the
     clone below deepens it. Hit-testing is a question about what
     a thumb lands on, and a synthetic row that overflows the bar
     answers it for arrows scrolled off the side. The arrow the
     page renders is the one a reader presses. */
  const targets = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".crumbs-bar .crumb-step")].map((s) => {
      const r = s.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let n = 0;
      for (; n < 40; n++) {
        const up = document.elementFromPoint(cx, cy - n);
        const down = document.elementFromPoint(cx, cy + n);
        if (!(up === s || s.contains(up)) || !(down === s || s.contains(down))) break;
      }
      return n * 2 - 1;
    }));

  ok(`${width}px: a thumb can hit an arrow`,
    targets.length > 0 && targets.every((t) => t >= 40),
    `${targets.join(", ") || "none"}px tall`);

  /* TWO ARROWS AT LEAST, OR HALF OF THIS ASKS NOTHING. `/skills`
     is one level deep, so the row it renders has a single
     separator and "they are all the same size" is true of any
     one thing. The row deliberately sets the crumb you are ON a
     step larger than the ones behind it, and THAT is what made
     two arrows two sizes, so the trail has to reach past the
     page you are on before it can be measured. Cloned from the
     row the page rendered, exactly as the block above does, so
     the markup shape stays the component's. */
  await page.evaluate(() => {
    const ol = document.querySelector<HTMLElement>(".crumbs-bar > ol");
    const first = ol?.firstElementChild as HTMLElement | undefined;
    if (!ol || !first) return;
    for (const [i, name] of ["টাকা ও শেয়ার", "পর্যায় ৫"].entries()) {
      const li = first.cloneNode(true) as HTMLElement;
      const menu = li.querySelector<HTMLElement>(".crumb-menu");
      const button = li.querySelector<HTMLElement>(".crumb-step");
      if (menu && button) {
        menu.id = `arrow-clone-${i}`;
        button.setAttribute("popovertarget", `arrow-clone-${i}`);
      }
      const label = li.querySelector<HTMLElement>(":scope > span, :scope > a");
      if (label) label.textContent = name;
      ol.appendChild(li);
    }
    for (const li of [...ol.children]) li.removeAttribute("aria-current");
    ol.lastElementChild?.setAttribute("aria-current", "page");
  });
  await page.waitForTimeout(300);

  const marks = await page.evaluate(() => {
    const bar = document.querySelector<HTMLElement>(".topbar");
    const seps = [...document.querySelectorAll<HTMLElement>(".crumbs-bar .crumb-sep")];
    if (!bar || !seps.length) return null;
    const mid = bar.getBoundingClientRect().top + bar.getBoundingClientRect().height / 2;
    return {
      /* The joiner that was drawn twice. `::before` on the first
         crumb is the one that went; `content` is `none` when no
         rule sets it. */
      joiner: getComputedStyle(
        document.querySelector(".crumbs-bar > ol > li")!, "::before").content,
      boxes: seps.map((s) => {
        const r = s.getBoundingClientRect();
        const art = s.querySelector("svg")?.getBoundingClientRect();
        return {
          w: Math.round(r.width), h: Math.round(r.height),
          off: +(r.top + r.height / 2 - mid).toFixed(2),
          /* THE MARK IS A DRAWING, NOT A GLYPH, and that is the
             whole of the alignment fix rather than a detail of it.
             Every box in this row was already centred to a
             hundredth of a pixel while the row read crooked,
             because what a reader sees is the INK and a `›` puts
             its ink wherever the font that answered for it puts
             it. An `<svg>` fills the box it is given and the
             chevron is drawn about the middle of its own viewBox,
             so its ink is centred by construction and no font is
             asked anything. */
          svg: s.querySelector("svg") ? 1 : 0,
          text: (s.textContent ?? "").trim().length,
          /* And nothing offsets the drawing inside its cell: a
             padding or a margin added here would move the mark
             off the line the words are on, which is the failure
             this block exists for, arriving a different way. */
          artOff: art
            ? +Math.hypot(
              (art.left + art.width / 2) - (r.left + r.width / 2),
              (art.top + art.height / 2) - (r.top + r.height / 2),
            ).toFixed(2)
            : null,
        };
      }),
    };
  });

  ok(`${width}px: the trail has arrows`, (marks?.boxes.length ?? 0) >= 1);
  if (!marks) { await page.close(); continue; }

  ok(`${width}px: one arrow joins the mark to the trail, not two`,
    marks.joiner === "none" || marks.joiner === "normal", `::before ${marks.joiner}`);

  ok(`${width}px: every arrow is drawn, not typed`,
    marks.boxes.every((b) => b.svg === 1 && b.text === 0),
    JSON.stringify(marks.boxes));

  const widths = new Set(marks.boxes.map((b) => `${b.w}x${b.h}`));
  ok(`${width}px: and every arrow is the same size`, widths.size === 1,
    [...widths].join(", "));

  ok(`${width}px: and its drawing is centred in its own box`,
    marks.boxes.every((b) => b.artOff !== null && b.artOff <= 0.5),
    marks.boxes.map((b) => b.artOff).join(", "));

  /* The boxes were always level, which is exactly why this was
     hard to see: the row read crooked while every rectangle in it
     was centred to a hundredth of a pixel. Asserted anyway,
     because the two checks above only guarantee the ink sits in
     the middle of ITS box. */
  const offs = marks.boxes.map((b) => b.off);
  ok(`${width}px: and every box is on the middle of the bar`,
    offs.every((o) => Math.abs(o) <= 1.5), offs.join(", "));

  await page.close();
}

await browser.close();
server.close();

if (failures.length) {
  console.error(`interactive: ${failures.length} failed of ${passed + failures.length}`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`interactive: ${passed} checks, every page's own module ran and its work survived.`);
