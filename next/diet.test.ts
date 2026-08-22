/* ============================================================
   diet.test.ts: the diet tool, in a real browser.

       cd next && npx next build
       node next/diet.test.ts

   `scripts/diet.test.ts` is the arithmetic and needs nothing.
   This is the half that can only be answered by rendering: a
   panel that renders and computes nothing looks exactly like one
   that works, which is what `next/interactive.test.ts` exists
   for and what this tool will be the largest surface on the site
   for.

   ---- the three things only a browser can say ----

   1. THE NUMBERS ARE COMPUTED. Typing a height, a weight and an
      age has to produce a BMI, a body fat RANGE and a resting
      burn, and the range has to be two numbers rather than one.

   2. THE CUT-OFF FOLLOWS THE READER. The same body reads
      "healthy" on the general set and "above" on the Asian set,
      and the page says which set it is using. That is the single
      most important honest detail in the tool and it is one
      `<select>` away from being silently wrong.

   3. THE LANGUAGE SWITCH CHANGES EVERY STRING. Both languages
      are in the markup and the stylesheet shows one, so the
      failure mode is not a missing translation, it is BOTH
      showing at once or NEITHER. Counting visible text is the
      only way to see that.

   ---- and one it exists to prevent ----

   Hydration. The pages render on the server; a component that
   read the language preference in the browser would render
   English on the server and Bangla on the client, and React
   would discard the difference with error #418. Every load here
   fails on a console error, which is what catches it.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { ConsoleMessage, Page, Request } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, ".next");
const AAB = join(HERE, "..", "aab");
const PORT = 8993;

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};

/** Says why, and does not come back. The annotation is on the
    VARIABLE rather than on the arrow, which is what makes
    TypeScript narrow after a call to it: with the return type on
    the arrow alone, `playwright` stays possibly-null for the
    rest of the file. */
const skip: (why: string) => never = (why) => {
  console.log(`diet: SKIPPED, ${why}`);
  process.exit(0);
};

const exists = (path: string): Promise<boolean> => stat(path).then(() => true, () => false);

if (!await exists(join(BUILD, "server/app/tools/diet.html"))) {
  skip("next/.next holds no prerendered diet pages. Run `npx next build` in next/ first.");
}

const browserPath = process.env.CHROMIUM_PATH
  || (await exists("/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
    : null);

const PLAYWRIGHT = "../app/node_modules/playwright/index.mjs";
const playwright = await import(PLAYWRIGHT)
  .then((m) => m as typeof import("playwright"), () => null);
if (!playwright) {
  skip("playwright is not installed. It is a devDependency of app/: `cd app && npm install`.");
}
const { chromium } = playwright;
if (!browserPath && !process.env.CHROMIUM_PATH) {
  try { chromium.executablePath(); } catch {
    skip("no browser. Point CHROMIUM_PATH at one, or `npx playwright install chromium`.");
  }
}

/* ---- the site, served the way Cloudflare serves it ---- */

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const PRERENDERED: Record<string, string> = {
  "/tools/diet": "tools/diet.html",
  "/tools/diet/you": "tools/diet/you.html",
  "/tools/diet/glossary": "tools/diet/glossary.html",
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

/** A page, loaded, with anything the console complained about.

    Hydration is the reason the errors are collected rather than
    ignored: React reports #418 there and nowhere else, and a
    page that has silently thrown away the server's markup looks
    identical to one that has not. */
async function load(path: string): Promise<{ page: Page; errors: string[] }> {
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() !== "error") return;
    /* A failed resource is not this test's subject and is
       reported separately below, same-origin only. The one that
       always fails here is Google Fonts, which this container
       cannot reach: counting it would make every assertion in
       this file depend on outbound network. */
    if (m.text().startsWith("Failed to load resource")) return;
    errors.push(m.text());
  });
  page.on("pageerror", (e: Error) => errors.push(String(e)));
  /* Same-origin only, for the reason above. A chunk that 404s
     here means hydration never ran, and every "the number is
     computed" assertion below would then be testing the server's
     markup rather than the component. */
  page.on("requestfailed", (r: Request) => {
    if (r.url().startsWith(`http://localhost:${PORT}`)) {
      errors.push(`${r.url()} ${r.failure()?.errorText ?? ""}`);
    }
  });
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "load" });
  return { page, errors };
}

/** Every string a reader can actually see, joined. `innerText`
    rather than `textContent`, because the whole language
    arrangement is `display: none` and `textContent` would return
    both halves and prove nothing. */
const seen = (page: Page): Promise<string> =>
  page.evaluate(() => (document.querySelector("main") as HTMLElement).innerText);

/* ---- 1. the three pages render, with the shell ---- */

for (const path of Object.keys(PRERENDERED)) {
  const { page, errors } = await load(path);
  const main = await page.$("main#main");
  ok(`${path}: renders a main`, main !== null);
  const styled = await page.evaluate(() =>
    getComputedStyle(document.body).backgroundColor);
  ok(`${path}: the stylesheet reached it`,
    styled !== "" && styled !== "rgba(0, 0, 0, 0)",
    `body background is ${styled}, so no stylesheet is linked`);
  const rail = await page.$(".rail, .topbar");
  ok(`${path}: the shell's chrome is there`, rail !== null);
  ok(`${path}: nothing thrown, and nothing hydrated wrongly`,
    errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ---- 2. the language switch, both ways ---- */
{
  const { page, errors } = await load("/tools/diet/you");

  const english = await seen(page);
  ok("you: opens in English", english.includes("Your body"), english.slice(0, 80));
  ok("you: and the Bangla half is not also on screen",
    !english.includes("আপনার শরীর"),
    "both languages visible at once, so the stylesheet rule did not apply");

  await page.click('.dt-lang-btn[lang="bn"]');
  const bangla = await seen(page);
  ok("you: the switch turns the page Bangla", bangla.includes("আপনার শরীর"));
  ok("you: and takes the English away", !bangla.includes("Your body"));

  /* Every string, not the heading only. This is the check that
     catches a retrofit: a page whose chrome switches and whose
     explanations do not. */
  const englishLeft = await page.evaluate(() =>
    [...document.querySelectorAll("main .t-en")]
      .filter((el) => (el as HTMLElement).offsetParent !== null).length);
  ok("you: no English half is left showing", englishLeft === 0, `${englishLeft} still visible`);

  const attr = await page.getAttribute("html", "data-tool-lang");
  ok("you: the attribute is the state", attr === "bn");
  const stored = await page.evaluate(() => localStorage.getItem("tool-lang"));
  ok("you: and it is stored under the key the calculators use", stored === "bn",
    `tool-lang is ${stored}; renaming this key loses the choice, it does not move it`);

  await page.click('.dt-lang-btn:not([lang])');
  ok("you: and back", (await seen(page)).includes("Your body"));
  ok("you: switching threw nothing", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ---- 3. the numbers are computed, not placeholders ---- */

const fill = async (page: Page, vals: Record<string, string>): Promise<void> => {
  for (const [id, v] of Object.entries(vals)) await page.fill(`#${id}`, v);
};

{
  const { page, errors } = await load("/tools/diet/you");

  const before = await seen(page);
  ok("you: says what it needs before it has it",
    before.includes("Height, weight and age"), before.slice(0, 120));

  await fill(page, { "dt-height": "180", "dt-weight": "80", "dt-age": "30" });
  const out = await page.$$eval(".dt-figure .dt-value", (els) =>
    els.map((e) => (e as HTMLElement).innerText.trim()));

  ok("you: BMI is computed", out.some((v) => v.startsWith("24.7")), out.join(" / "));
  ok("you: body fat is a RANGE, not a point",
    out.some((v) => /^\d+ to \d+%$/.test(v)),
    `${out.join(" / ")}: a single percentage here would be a number the method cannot support`);
  ok("you: lean mass is computed", out.some((v) => /kg$/.test(v)));
  ok("you: the resting burn is computed and rounded to ten",
    out.some((v) => /^\d+ kcal$/.test(v) && Number(v.replace(/\D/g, "")) % 10 === 0),
    out.join(" / "));

  /* THE CUT-OFF. BMI 24.7 is inside the healthy range on the
     general set and above it on the Asian one, and this is the
     one control that changes that. */
  const general = await seen(page);
  ok("you: 24.7 is healthy on the general cut-offs",
    general.includes("in the healthy range"), "24.7 on 25 and 30");
  ok("you: and the page says which set it is using",
    general.includes("general cut-offs: 25 and 30"), general.slice(-160));

  await page.selectOption("#dt-ancestry", "asian");
  const asian = await seen(page);
  ok("you: the same body is above the range on the Asian cut-offs",
    asian.includes("above the healthy range"),
    "24.7 against 23 and 27.5: this is the detail the whole tool turns on");
  ok("you: and it says so",
    asian.includes("Asian cut-offs: 23 and 27.5"), asian.slice(-160));

  /* The tape upgrades the estimate, and the page has to say
     which method produced the number rather than printing the
     same range from a different source. */
  await fill(page, { "dt-waist": "90", "dt-neck": "38" });
  const taped = await seen(page);
  ok("you: the tape switches the method and says so",
    taped.includes("From the tape"), "still reading from BMI with a waist and neck entered");
  ok("you: and the waist to height figure appears with it",
    taped.includes("0.50"), "90 over 180");
  ok("you: which is the number that leads",
    await page.evaluate(() => {
      const lead = document.querySelector(".dt-figure-lead");
      const figures = [...document.querySelectorAll(".dt-figure")];
      return lead !== null && figures.indexOf(lead) === 0;
    }),
    "BMI cannot be the first figure on this page");

  ok("you: the disclaimer is beside the numbers",
    taped.includes("not medical advice"),
    "no page here prints a figure about a body without it");
  ok("you: computing threw nothing", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ---- 4. it stores nothing it did not say it would ---- */
{
  const { page } = await load("/tools/diet/you");
  await fill(page, { "dt-height": "170", "dt-weight": "70", "dt-age": "40" });
  const keys = await page.evaluate(() => Object.keys(localStorage).sort());
  ok("you: a measurement is not written to storage",
    !keys.some((k) => /diet|weight|waist|height/i.test(k)),
    `localStorage holds ${keys.join(", ") || "nothing"}`);
  await page.close();
}

/* ---- 5. the glossary defines what the tool says ---- */
{
  const { page } = await load("/tools/diet/glossary");
  const terms = await page.$$eval(".dt-term", (els) => els.map((e) => e.id));
  ok("glossary: every term has an anchor of its own",
    terms.length >= 10 && terms.every(Boolean), terms.join(" "));
  for (const id of ["bmr", "tdee", "neat", "glycogen", "ketosis", "adaptation", "whtr"]) {
    ok(`glossary: defines ${id}`, terms.includes(id), terms.join(" "));
  }
  const text = await seen(page);
  ok("glossary: no transliterated initialism in the Bangla",
    !text.includes("টিডিইই") && !text.includes("বিএমআর"),
    "four English letters in Bangla script is not a Bangla word");
  await page.close();
}

/* ---- 6. the front door promises nothing it cannot keep ---- */
{
  const { page } = await load("/tools/diet");
  const soon = await page.$$eval('[data-kind="soon"]', (els) => els.length);
  const go = await page.$$eval('[data-kind="go"]', (els) =>
    els.map((e) => e.getAttribute("href")));
  ok("diet: what is not built is a soon card, not an empty panel", soon >= 2);
  ok("diet: and every card that takes you somewhere goes somewhere real",
    go.length >= 2 && go.every((h) => h !== null && PRERENDERED[h] !== undefined),
    go.join(" "));
  await page.close();
}

await browser.close();
server.close();

if (failures.length) {
  console.error(`\ndiet: ${failures.length} of ${passed + failures.length} failed\n`);
  failures.forEach((line) => console.error(`  x ${line}`));
  process.exit(1);
}
console.log(`diet: ${passed} checks passed in a real browser`);
