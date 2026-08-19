/* ============================================================
   routine-day.test.ts: the day, in a browser, signed in.

       node next/routine-day.test.ts

   Needs the Next build and a browser. Without either it says
   which and skips, and a skip is not a pass.

   `scripts/routine.test.ts` is the arithmetic and it runs
   everywhere. This is the half that only a browser can settle,
   and it is the half where the promises live:

     that pressing a task marks it AND reaches the database,
     that pressing three times is full, half, nothing,
     that an empty day says so in WORDS and never as a zero,
     and that nothing on the page is red.

   The last two are `ROUTINE.md` §8 as a rendered page rather
   than as a function, which is the only way to know: `done()`
   answering null is not the same claim as a reader never seeing
   a nought.

   ---- why the database is routed rather than mocked ----

   The component reaches Supabase through `/routine.js`, which is
   a real module resolved at run time against whatever origin the
   page came from. So the route below IS the database as far as
   the page is concerned: no injection, no stub passed in as a
   prop, and the component under test is the one the route ships.
   `next/account.test.ts` makes the same argument at more length.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import type { BrowserContext, Route } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BUILD = join(ROOT, "next", ".next");
const PORT = 8412;
const SUPA = "https://wvjarqnnmkkuxyrndtya.supabase.co";

/** Says why, and does not come back. */
const skip: (why: string) => never = (why) => {
  console.log(`routine-day: SKIPPED, ${why}`);
  process.exit(0);
};

const exists = (path: string): Promise<boolean> => stat(path).then(() => true, () => false);

if (!await exists(join(BUILD, "server/app/index.html"))) {
  skip("next/.next holds no prerendered pages. Run `npx next build` in next/ first.");
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
if (!browserPath) {
  try { chromium.executablePath(); } catch {
    skip("no browser. Point CHROMIUM_PATH at one, or `npx playwright install chromium`.");
  }
}

/* ---- a signed-in session ---- */

const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
const ME = "u-1";
const jwt = [b64({ alg: "HS256" }),
  b64({ sub: ME, email: "s@reiad.co.uk", exp: Math.floor(Date.now() / 1000) + 3600,
        user_metadata: { full_name: "Sadia" } }), "s"].join(".");
const session = JSON.stringify({
  access_token: jwt, refresh_token: "r", expires_at: Date.now() + 3600e3,
  user: { id: ME, email: "s@reiad.co.uk", name: "Sadia", avatar: "" },
});

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json",
  ".woff2": "font/woff2", ".svg": "image/svg+xml",
};
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  const tries = [
    join(BUILD, "server/app", `${path}.html`),
    join(BUILD, "server/app", path, "index.html"),
    join(BUILD, "../../aab", path.replace(/^\//, "")),
    join(BUILD, "static", path.replace(/^\/_next\/static\//, "")),
    join(BUILD, path.replace(/^\/_next\//, "")),
  ];
  for (const f of tries) {
    try {
      const data = await readFile(f);
      res.writeHead(200, { "Content-Type": TYPES[extname(f)] ?? "application/octet-stream" });
      res.end(data); return;
    } catch { /* next */ }
  }
  res.writeHead(404).end("nf");
});
await new Promise<void>((r) => { server.listen(PORT, () => r()); });

const browser = await chromium.launch({
  ...(browserPath ? { executablePath: browserPath } : {}),
});
const ctx: BrowserContext = await browser.newContext({ serviceWorkers: "block" });

/* The database, as the policies would answer it. */
let routine: Record<string, unknown> | null = null;
const entries = new Map<string, Record<string, unknown>>();
const sent: string[] = [];
await ctx.route(`${SUPA}/rest/v1/**`, async (route: Route) => {
  const req = route.request();
  const url = new URL(req.url());
  const table = url.pathname.split("/").pop() ?? "";
  const json = (p: unknown, status = 200) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify(p) });
  const body = req.postData() ? JSON.parse(req.postData() as string) : null;
  if (req.method() !== "GET") sent.push(`${req.method()} ${table}`);

  if (table === "profiles") return json([{ display_name: "Sadia", routine_locale: "both", routine_day_roll: 4 }]);
  if (table === "routines") {
    if (req.method() === "POST") {
      routine = { id: "r-1", ...(Array.isArray(body) ? body[0] : {}) };
      return json([routine], 201);
    }
    return json(routine ? [routine] : []);
  }
  if (table === "routine_entries") {
    if (req.method() === "POST") {
      const row = { id: "e-1", ...(Array.isArray(body) ? body[0] : {}) };
      entries.set(String(row.entry_date), row);
      return json([row], 201);
    }
    /* One day, or a range. The day view sends `entry_date=eq.X`
       and the year sends `gte.` and `lte.`, so the operator has
       to be read rather than stripped: taking "eq." off a `gte.`
       leaves a date nothing is filed under, and the year came
       back empty while every panel rendered perfectly. */
    const asked = url.searchParams.getAll("entry_date");
    const one = asked.find((v) => v.startsWith("eq."));
    if (one) {
      const row = entries.get(one.slice(3));
      return json(row ? [row] : []);
    }
    return json([...entries.values()]
      .sort((a, b) => String(a.entry_date).localeCompare(String(b.entry_date))));
  }
  return json([]);
});

await ctx.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());
const page = await ctx.newPage();
const errors: string[] = [];
page.on("pageerror", (e: Error) => errors.push(e.message));
await page.addInitScript((who: string) => localStorage.setItem("reiad-session", who), session);
await page.goto(`http://localhost:${PORT}/tools/routine`, { waitUntil: "load" });
await page.waitForTimeout(2500);

let pass = 0; const fail: string[] = [];
const ok = (n: string, c: unknown, d = "") => { if (c) pass++; else fail.push(d ? `${n}: ${d}` : n); };

ok("a routine was made on first visit", routine !== null);
const tasks = await page.locator(".rt-mark").count();
ok("the day lists the tasks", tasks === 6, String(tasks));
const figure = (await page.locator(".rt-figure").textContent()) ?? "";
ok("an empty day says so rather than showing a zero",
  figure.includes("খালি") && !figure.includes("0"), JSON.stringify(figure));

/* Mark one. */
await page.locator(".rt-mark").first().click();
await page.waitForTimeout(900);
ok("pressing marks it", await page.locator('.rt-mark[data-state="1"]').count() === 1);
ok("and it reaches the database", sent.some((s) => s.startsWith("POST routine_entries")), sent.join(","));
const after = (await page.locator(".rt-figure").textContent()) ?? "";
ok("and now there is a figure", /[0-9০-৯]/.test(after), JSON.stringify(after));

/* Press again: full to half. */
await page.locator(".rt-mark").first().click();
await page.waitForTimeout(700);
ok("pressing again is a half", await page.locator('.rt-mark[data-state="0.5"]').count() === 1);
await page.locator(".rt-mark").first().click();
await page.waitForTimeout(700);
ok("and again is nothing", await page.locator('.rt-mark[data-state="0"]').count() === 6);
const back = (await page.locator(".rt-figure").textContent()) ?? "";
ok("and the figure goes back to words, never to zero",
  back.includes("খালি"), JSON.stringify(back));

/* Nothing red anywhere. */
const reds = await page.evaluate(() => [...document.querySelectorAll(".rt-day *")]
  .filter((el) => {
    const c = getComputedStyle(el).color;
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c);
    return m ? Number(m[1]) > 150 && Number(m[2]) < 80 && Number(m[3]) < 80 : false;
  }).length);
ok("nothing on the page is red", reds === 0, String(reds));

ok("no page errors on the day", errors.length === 0, errors[0] ?? "");

/* ============================================================
   And the other surface: settings.
   ============================================================ */

await page.goto(`http://localhost:${PORT}/tools/routine/settings`, { waitUntil: "load" });
await page.waitForTimeout(2200);

ok("the settings page opens", await page.locator(".rt-builder, .rt-templates").count() > 0);

/* THE ONE USEFUL SENTENCE, and it has to be a real number rather
   than a placeholder: `A simple day` is 9.75 planned hours. */
const line = (await page.locator(".rt-hours-line").textContent()) ?? "";
ok("the builder says how full the day is", /Planned to [\d.]+ hours of 24/.test(line), line);
ok("and how much is left", /[\d.]+ free/.test(line), line);
/* Never a warning and never a negative: an over-planned day is a
   plan rather than a mistake. */
ok("and it is never a negative number", !line.includes("-"), line);

/* Taking something off the list archives it rather than deleting
   it, which is the visible half of "ids are never removed". */
const before = await page.locator(".rt-build-task").count();
await page.getByRole("button", { name: /Take .* off the list/ }).first().click();
await page.waitForTimeout(400);
ok("taking one off shortens the list",
  await page.locator(".rt-build-band:not(.rt-archived) .rt-build-task").count() === before - 1);
ok("and it is still there, under Off the list",
  await page.locator(".rt-archived .rt-build-task").count() === 1);
ok("with a way back", await page.getByRole("button", { name: "put it back" }).count() === 1);
await page.getByRole("button", { name: "put it back" }).click();
await page.waitForTimeout(400);
ok("which works", await page.locator(".rt-archived").count() === 0);

/* Templates: a preview before loading, because Sadia's day is
   eighteen tasks and somebody should see them before they
   arrive. */
await page.getByRole("tab", { name: "Templates" }).click();
await page.waitForTimeout(300);
ok("all three templates are offered", await page.locator(".rt-template").count() === 3);
ok("nothing is previewed until it is asked for",
  await page.locator(".rt-preview").count() === 0);
await page.getByRole("button", { name: "have a look" }).first().click();
await page.waitForTimeout(300);
const shown = await page.locator(".rt-preview li").count();
ok("a preview lists what is in it", shown === 18, String(shown));

/* Your data: the summary before anything is written. */
await page.getByRole("tab", { name: "Your data" }).click();
await page.waitForTimeout(300);
ok("there is a way to take a copy",
  await page.getByRole("button", { name: /Download/ }).count() === 1);
ok("and nothing offers to write until a file has been read",
  await page.getByRole("button", { name: /Replace everything/ }).count() === 0);

ok("no page errors on settings", errors.length === 0, errors[0] ?? "");

/* ============================================================
   The year.

   Seeded with a history that has a DEAD FORTNIGHT in the middle
   of it, because that is the case every one of these panels has
   to survive without saying anything unkind.
   ============================================================ */

{
  const iso = (back: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - back);
    return d.toISOString().slice(0, 10);
  };
  /* Forty days: marked for the first twelve, nothing for a
     fortnight, then marked again. Somebody who stopped and came
     back. */
  for (let i = 0; i < 40; i += 1) {
    const away = i >= 12 && i <= 26;
    entries.set(iso(i), {
      id: `e-${i}`, entry_date: iso(i), routine_id: "r-1",
      /* `brd` and `pln` are Sadia's ids and this routine is `A
         simple day`, which is the point: the flock and the
         garden are counted by TASK ID out of the marks, so they
         survive a routine being renamed, rebuilt or replaced.
         Birds do not leave because somebody edited a list. */
      marks: away ? {} : { move: 1, eat: 0.5, good: 1, brd: 1, pln: 1 },
      mood: away ? null : "light",
      note: i === 3 ? "the birds ate from my hand" : (away ? null : "a good day"),
      chose: null,
    });
  }
}

await page.goto(`http://localhost:${PORT}/tools/routine`, { waitUntil: "load" });
await page.waitForTimeout(1500);

/* THE DAY IS THE DEFAULT. A page that opens on a chart has
   forgotten what it is for. */
ok("the day is what opens", await page.locator(".rt-day").isVisible());

await page.getByRole("tab", { name: /The year/ }).click();
await page.waitForTimeout(2000);

ok("the year draws twelve weeks",
  await page.locator(".rt-heat-week").count() === 12);
const cells = await page.locator(".rt-heat-day").count();
ok("one cell per day", cells === 84, String(cells));

/* AN UNMARKED DAY IS NOT A HOLE. Every cell exists, including
   the fortnight nobody marked. */
ok("including the days nothing was marked on", cells === 84);
ok("and today is ringed rather than filled",
  await page.locator(".rt-heat-day[data-here]").count() === 1);

/* Six seasons. */
const season = (await page.locator(".rt-season").textContent()) ?? "";
ok("the page knows which of the six seasons it is",
  /গ্রীষ্ম|বর্ষা|শরৎ|হেমন্ত|শীত|বসন্ত/.test(season), season);

/* The things that only grow. `move` was marked 26 times, so the
   flock is there, and the fortnight away cost nothing. */
ok("the jar is there", await page.locator(".rt-jar").count() === 1);
await page.locator(".rt-jar").click();
await page.waitForTimeout(300);
ok("and pressing it hands one back", await page.locator(".rt-out p").count() === 1);

ok("a year ago, or a month ago, comes back if it was written",
  await page.locator(".rt-echo, .rt-log li").count() > 0);

/* The most important panel: things never marked, named plainly
   with permission rather than as failures. */
const waiting = await page.locator(".rt-waiting li").count();
ok("the tasks never marked are listed", waiting > 0, String(waiting));
const said = (await page.locator(".rt-panel:has(.rt-waiting) p").first().textContent()) ?? "";
ok("and the words are permission rather than a scolding",
  /allowed/.test(said), said);

/* And still nothing red, on the page with the most numbers. */
const redYear = await page.evaluate(() => [...document.querySelectorAll(".rt-year *")]
  .filter((el) => {
    const c = getComputedStyle(el).color;
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c);
    return m ? Number(m[1]) > 150 && Number(m[2]) < 80 && Number(m[3]) < 80 : false;
  }).length);
ok("nothing on the year is red either", redYear === 0, String(redYear));

/* THE RATCHET, rendered. The fortnight away must not have taken
   anything off the page. */
const birdsNow = await page.locator(".rt-bird").count();
ok("the flock is on the page", birdsNow > 0, String(birdsNow));
ok("and so is the garden", await page.locator(".rt-plant").count() > 0);
/* 26 marks, so four birds by the thresholds. The number is
   asserted rather than "more than none", because the failure
   worth catching is a flock that grows with the WINDOW rather
   than with the total: a fortnight away would make it three. */
ok("and the fortnight away cost it nothing", birdsNow === 4, String(birdsNow));

ok("no page errors on the year", errors.length === 0, errors[0] ?? "");

await browser.close();
server.close();

if (fail.length) {
  console.log(`\n${pass} checks passed\n${fail.length} failed:\n`);
  for (const f of fail) console.log(`  x ${f}`);
  process.exit(1);
}
console.log(`\nroutine-day: ${pass} checks, a day marks and saves, three presses are`);
console.log("full, half and nothing, an empty day says so in words, and nothing is red.");
