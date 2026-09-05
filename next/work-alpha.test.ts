/* The owner's research control room, in two halves.
     node next/work-alpha.test.ts

   THE FIRST HALF NEEDS NO BROWSER: linkedom is the DOM, and it asks the
   engine what `WORK-ALPHA.md` says it does: every page renders, ticking
   a task persists, the detail sheet opens.

   THE SECOND NEEDS ONE, and without Playwright it says so and SKIPS,
   which is not a pass. It hydrates the rail and the route's mount against
   the server's own markup, exactly as `keep.test.ts` does, with the REAL
   `/account.js` served off disk and Supabase answered from memory. The
   three locks are what it asks about: a stranger and a signed-in reader
   who is not the owner get `notFound()` and no rail entry; the owner gets
   the app, and a tick goes to `work_alpha_state` and survives a reload.

   THE THIRD NEEDS THE BUILD as well, because it is about the STYLESHEET
   and the fixture above deliberately drops it. It measures the page in
   both themes, and it exists for two failures that shipped together and
   neither of which a check that reads files could see: a palette written
   in light-mode hex, which put dark ink on the dark ground at night, and
   a colour in the middle of a `background` shorthand, which is invalid
   at parse time, so the graph-paper ground never drew in either theme
   and what showed through was the body. */

import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load, open, skip } from "./hydrate-fixture.ts";
import type { BrowserContext, ConsoleMessage, Page, Route } from "playwright";
import type { Mounted, Plan, Storage, WorkAlphaState } from "./components/work-alpha/engine.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8794;
const SUPA = "https://wvjarqnnmkkuxyrndtya.supabase.co";
const JS = "text/javascript; charset=utf-8";
const WA = join(ROOT, "next", "components", "work-alpha");

const PLAN = JSON.parse(readFileSync(join(WA, "plan.json"), "utf8")) as Plan;

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};
const is = (what: string, got: unknown, want: unknown): void =>
  ok(what, JSON.stringify(got) === JSON.stringify(want),
    `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

/** The day the dashboard shows: today's, else the next planned one,
    else the last. The same rule the engine uses, so the test says
    what the page should say on whichever day it is run. */
const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const CURRENT = PLAN.days.find((d) => d.date === today)
  ?? PLAN.days.find((d) => d.date >= today)
  ?? PLAN.days[PLAN.days.length - 1];

const TABS = ["dashboard", "plan", "goals", "library", "gap", "data", "people",
  "prompts", "log", "decide", "review", "settings"] as const;

/* ============================================================
   1. The engine, with no browser
   ============================================================ */
{
  const dom = await import("linkedom").catch(() => null);
  if (!dom) skip("linkedom is not installed: `npm ci` at the repository root.");
  const { window, document } = dom.parseHTML(
    "<!doctype html><html><body><div id=\"app\"></div></body></html>");
  Object.assign(globalThis, { window, document });

  interface Engine {
    mount: (root: HTMLElement, plan: Plan, storage: Storage) => Promise<Mounted>;
    freshState: (plan: Plan) => WorkAlphaState;
  }
  const { mount, freshState } = await load<Engine>(
    "export { mount, freshState } from './components/work-alpha/engine';");

  /** One account, in memory, with what was saved kept as sent. */
  const memory = (): Storage & { saved: WorkAlphaState[] } => {
    const held = { saved: [] as WorkAlphaState[] };
    return {
      saved: held.saved,
      load: () => Promise.resolve(held.saved.at(-1) ?? null),
      save: (s) => { held.saved.push(JSON.parse(JSON.stringify(s)) as WorkAlphaState); return Promise.resolve(); },
    };
  };
  const press = (el: Element | null): void => {
    if (!el) throw new Error("nothing to press");
    el.dispatchEvent(new window.Event("click", { bubbles: true }));
  };
  const settle = (): Promise<void> => new Promise((r) => setTimeout(r, 320));

  console.log("the engine, with no browser");

  const fresh = freshState(PLAN);
  is("a fresh state seeds the library from both tracks",
    fresh.library.length, PLAN.tracks.A.seeds.length + PLAN.tracks.B.seeds.length);
  is("and fifteen empty supervisor rows", fresh.people.supervisors.length, 15);

  const root = document.getElementById("app") as unknown as HTMLElement;
  const store = memory();
  const app = await mount(root, PLAN, store);
  const count = (sel: string): number => root.querySelectorAll(sel).length;

  is("the head carries the plan's name", root.querySelector("h1")?.textContent, PLAN.name);
  is("seven flags on the goal track", count(".wa-flag"), PLAN.goals.length);
  is("twelve tabs", count(".wa-tab"), TABS.length);
  is("the dashboard lists the current day's tasks",
    count(".wa-main .wa-task:not(.wa-ritual)"), CURRENT.tasks.length);
  is("and the two rituals around them", count(".wa-main .wa-ritual"), 2);

  press(root.querySelector(".wa-main .wa-task:not(.wa-ritual) .wa-check"));
  await settle();
  const first = CURRENT.tasks[0].id;
  ok("ticking a task marks it done", Boolean(app.getState().done[first]));
  is("and it is drawn done", count(".wa-main .wa-task.is-done"), 1);
  is("and saved, once the debounce has passed", store.saved.length, 1);
  ok("with the tick in what was saved", Boolean(store.saved[0]?.done[first]));

  press(root.querySelector(".wa-main .wa-task:not(.wa-ritual) .wa-task-body"));
  const modal = root.querySelector(".wa-modal") as HTMLElement;
  is("opening a task shows the sheet", modal.hasAttribute("hidden"), false);
  ok("with the 'Do exactly this' list",
    [...modal.querySelectorAll("h3")].some((n) => n.textContent === "Do exactly this"));
  is("as one step per line", modal.querySelectorAll(".wa-steps li").length, CURRENT.tasks[0].steps.length);

  for (const tab of TABS) {
    app.setPage(tab);
    ok(`the ${tab} page renders`, count(".wa-main *") >= 5, `${count(".wa-main *")} node(s)`);
  }

  const again = document.createElement("div") as unknown as HTMLElement;
  const back = await mount(again, PLAN, store);
  ok("a second mount against the same account has the tick", Boolean(back.getState().done[first]));
  is("and draws it", again.querySelectorAll(".wa-main .wa-task.is-done").length, 1);

  for (const k of ["window", "document"]) delete (globalThis as Record<string, unknown>)[k];
}

/* ============================================================
   2. The three locks, in a browser
   ============================================================ */

/* ---------- the server's half, rendered here ---------- */

interface Server {
  renderToString: (node: unknown) => string;
  markup: () => unknown;
}

const { renderToString, markup } = await load<Server>(`
  import { createElement as h } from "react";
  import { Sidebar } from "./components/sidebar";
  import { WorkAlphaMount } from "./components/work-alpha/mount";
  import { OwnerMark } from "./components/work-alpha/owner-mark";
  export { renderToString } from "react-dom/server.browser";
  export const markup = () => h("div", null,
    h(Sidebar, { current: "work-alpha" }),
    h("main", { id: "main" }, h(WorkAlphaMount)),
    h(OwnerMark));
`);

const HYDRATE = `
  import { createElement as h } from "react";
  import { hydrateRoot } from "react-dom/client";
  import { Sidebar } from "./components/sidebar";
  import { WorkAlphaMount } from "./components/work-alpha/mount";
  import { OwnerMark } from "./components/work-alpha/owner-mark";
  hydrateRoot(document.getElementById("root"), h("div", null,
    h(Sidebar, { current: "work-alpha" }),
    h("main", { id: "main" }, h(WorkAlphaMount)),
    h(OwnerMark)));
`;

const served = renderToString(markup());

const fixture = await open({
  port: PORT,
  body: `<div id="root">${served}</div>`,
  entry: HYDRATE,
  files: {
    "/account.js": { type: JS, body: readFileSync(join(ROOT, "aab", "account.js"), "utf8") },
  },
});

const mismatches = (errors: string[]): string[] => errors.filter((e) =>
  /Minified React error #(418|423|425)|did not match|Hydration failed/i.test(e));
const notFound = (errors: string[]): boolean => errors.some((e) =>
  /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/.test(e));

const b64 = (o: unknown): string => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (sub: string): string => [
  b64({ alg: "HS256" }),
  b64({ sub, email: "i@reiad.co.uk", exp: Math.floor(Date.now() / 1000) + 3600,
    user_metadata: { full_name: "Rony Reiad" } }),
  "s",
].join(".");
const session = (sub: string): string => JSON.stringify({
  access_token: jwt(sub), refresh_token: "r", expires_at: Date.now() + 3600e3,
  user: { id: sub, email: "i@reiad.co.uk", name: "Rony Reiad" },
});

interface Row { user_id: string; state: Partial<WorkAlphaState>; updated_at: string }
interface Sent { method: string; path: string; prefer: string | null; body: Record<string, unknown> | null }

interface Account {
  row: Row | null;
  sent: Sent[];
  /** Every request that reached Supabase at all. */
  asked: string[];
  /** Every request for /api/work-alpha, with whether it carried a bearer. */
  gate: string[];
}

interface Opts {
  signedIn?: boolean;
  owner?: boolean;
  row?: Partial<WorkAlphaState>;
  mirror?: Partial<WorkAlphaState>;
}

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "access-control-allow-headers": "*",
};

interface Opened { page: Page; context: BrowserContext; account: Account; errors: string[] }

const openPage = async (o: Opts = {}): Promise<Opened> => {
  const context = await fixture.browser.newContext();
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() === "error" && !/favicon|Failed to load resource/i.test(m.text())) errors.push(m.text());
  });

  const account: Account = {
    row: o.row ? { user_id: "u-1", state: o.row, updated_at: o.row.updated_at ?? "2026-01-01T00:00:00.000Z" } : null,
    sent: [], asked: [], gate: [],
  };

  /* The gate, which is the Worker's, and the one place `isAdmin()`
     is asked: a 404 for everybody but the owner. */
  await context.route("**/api/work-alpha", (route: Route) => {
    const auth = route.request().headers()["authorization"] ?? "";
    account.gate.push(auth.startsWith("Bearer ") ? "with a bearer" : "no bearer");
    const owner = o.owner && auth.startsWith("Bearer ");
    return route.fulfill({
      status: owner ? 200 : 404, contentType: "application/json",
      body: JSON.stringify(owner ? { ok: true, owner: true } : { ok: false, reason: "not-found" }),
    });
  });

  await context.route(`${SUPA}/**`, async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    account.asked.push(`${request.method()} ${url.pathname}${url.search}`);
    const json = (body: unknown, status = 200): Promise<void> => route.fulfill({
      status, contentType: "application/json", headers: CORS, body: JSON.stringify(body),
    });
    if (request.method() === "OPTIONS") return route.fulfill({ status: 204, headers: CORS, body: "" });
    if (url.pathname.startsWith("/auth/")) return json({});
    if (!url.pathname.endsWith("/work_alpha_state")) return json({ message: "no such table" }, 404);

    if (request.method() === "GET") {
      const who = (url.searchParams.get("user_id") ?? "").replace(/^eq\./, "");
      return json(account.row && account.row.user_id === who ? [{ state: account.row.state }] : []);
    }
    const body = JSON.parse(request.postData() ?? "null") as Record<string, unknown> | null;
    account.sent.push({
      method: request.method(), path: url.pathname,
      prefer: request.headers()["prefer"] ?? null, body,
    });
    /* `resolution=merge-duplicates` on the primary key. */
    if (body) {
      account.row = {
        user_id: String(body.user_id), state: body.state as Partial<WorkAlphaState>,
        updated_at: String(body.updated_at),
      };
    }
    return json(null, 201);
  });

  await page.addInitScript(({ who, mirror }: { who: string | null; mirror: string | null }) => {
    if (who) localStorage.setItem("reiad-session", who);
    if (mirror) localStorage.setItem("work-alpha", mirror);
  }, {
    who: (o.signedIn ?? true) ? session("u-1") : null,
    mirror: o.mirror ? JSON.stringify(o.mirror) : null,
  });

  await page.goto(fixture.origin, { waitUntil: "load" });
  return { page, context, account, errors };
};

const settle = (page: Page, ms = 500): Promise<void> => page.waitForTimeout(ms);
const shows = (page: Page, selector: string, state: "visible" | "detached" = "visible"): Promise<boolean> =>
  page.waitForSelector(selector, { state, timeout: 5000 }).then(() => true, () => false);

const RAIL_ENTRY = ".rail a[href='/work-alpha']";

console.log("\nthe three locks, in a browser");

/* ---- what the server sends ---- */
{
  ok("the rail in the server's HTML has no Work-Alpha entry", !served.includes('href="/work-alpha"'),
    "a stranger's page must not carry the link, hidden or not");
  ok("nor does the page carry the plan", !served.includes("wa-flag") && !served.includes(PLAN.endGoal));
  ok("only an empty host", served.includes('class="wa-host"'));
  const gate = readFileSync(join(WA, "mount.tsx"), "utf8");
  ok("and a reader who is not the owner gets notFound(), not a message",
    /owner === false\)\s*notFound\(\)/.test(gate));
}

/* ---- a stranger ---- */
{
  const { page, context, account, errors } = await openPage({ signedIn: false });
  await settle(page, 1200);
  ok("signed out, the page is a 404", notFound(errors), errors.join(" | "));
  is("and nothing of the app is drawn", await page.locator(".wa").count(), 0);
  is("the rail has no entry", await page.locator(RAIL_ENTRY).count(), 0);
  is("the gate was never even asked, because there was nobody to ask for", account.gate, []);
  is("and Supabase was never touched", account.asked, []);
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ---- a signed-in reader who is not the owner ---- */
{
  const { page, context, account, errors } = await openPage({ owner: false });
  await settle(page, 1200);
  ok("signed in and not the owner, the page is a 404", notFound(errors), errors.join(" | "));
  is("and nothing of the app is drawn", await page.locator(".wa").count(), 0);
  is("the rail has no entry", await page.locator(RAIL_ENTRY).count(), 0);
  is("the gate was asked once, with the reader's own bearer", account.gate, ["with a bearer"]);
  is("the row was never read, because the gate said no first",
    account.asked.filter((a) => a.includes("work_alpha_state")), []);
  is("and the browser remembers the answer, so the rail need not ask again",
    await page.evaluate(() => localStorage.getItem("work-alpha-owner")), "no");
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ---- the owner ---- */
{
  const { page, context, account, errors } = await openPage({ owner: true });
  ok("the owner gets the app", await shows(page, ".wa .wa-flag"), errors.join(" | "));
  is("seven flags", await page.locator(".wa-flag").count(), PLAN.goals.length);
  is("twelve tabs", await page.locator(".wa-tab").count(), TABS.length);
  is("the current day's tasks", await page.locator(".wa-main .wa-task:not(.wa-ritual)").count(),
    CURRENT.tasks.length);
  ok("and the rail draws the entry", await shows(page, RAIL_ENTRY));
  is("marked as where they are", await page.evaluate((sel: string) =>
    document.querySelector(sel)?.getAttribute("aria-current") ?? null, RAIL_ENTRY), "page");
  is("with the answer kept for the next page",
    await page.evaluate(() => localStorage.getItem("work-alpha-owner")), "yes");
  is("the row was read once, as this reader, and only its state",
    account.asked.filter((a) => a.startsWith("GET")),
    ["GET /rest/v1/work_alpha_state?select=state&user_id=eq.u-1"]);

  await page.click(".wa-main .wa-task:not(.wa-ritual) .wa-check >> nth=0");
  await settle(page);
  const first = CURRENT.tasks[0].id;
  is("ticking a task writes the row once", account.sent.length, 1);
  const wrote = account.sent[0];
  is("as an upsert on the primary key", wrote.prefer?.includes("resolution=merge-duplicates"), true);
  is("under the reader's own id", wrote.body?.user_id, "u-1");
  const state = wrote.body?.state as Partial<WorkAlphaState> | undefined;
  ok("with the tick in the state", Boolean(state?.done?.[first]));
  ok("and a stamp on it", typeof state?.updated_at === "string");
  is("the same stamp is the row's", wrote.body?.updated_at, state?.updated_at);
  const mirror = await page.evaluate(() => JSON.parse(localStorage.getItem("work-alpha") ?? "null") as Partial<WorkAlphaState> | null);
  ok("and the browser keeps a mirror with the tick in it", Boolean(mirror?.done?.[first]));

  await page.reload({ waitUntil: "load" });
  ok("after a reload the app is back", await shows(page, ".wa .wa-flag"));
  is("with the tick still on it", await page.locator(".wa-main .wa-task.is-done").count(), 1);

  await page.click(".wa-main .wa-task:not(.wa-ritual) .wa-task-body >> nth=0");
  ok("opening a task shows the sheet", await shows(page, ".wa-sheet"));
  ok("with the 'Do exactly this' list",
    (await page.locator(".wa-sheet h3").allTextContents()).includes("Do exactly this"));
  await page.keyboard.press("Escape");
  await settle(page, 200);
  is("and Escape closes it", await page.locator(".wa-modal[hidden]").count(), 1);

  for (let i = 0; i < TABS.length; i++) {
    await page.click(`.wa-tab >> nth=${i}`);
    const nodes = await page.locator(".wa-main *").count();
    ok(`the ${TABS[i]} tab renders`, nodes >= 5, `${nodes} node(s)`);
  }
  is("nothing hydrated wrongly", mismatches(errors), []);
  is("and no error anywhere", errors, []);
  await context.close();
}

/* ---- the mirror and the row, whichever is newer ---- */
{
  const first = CURRENT.tasks[0].id;
  const older = "2026-01-01T00:00:00.000Z";
  const newer = "2026-02-01T00:00:00.000Z";
  {
    const { page, context } = await openPage({
      owner: true,
      row: { done: {}, updated_at: older },
      mirror: { done: { [first]: newer }, updated_at: newer },
    });
    await shows(page, ".wa .wa-flag");
    is("a mirror newer than the row wins", await page.locator(".wa-main .wa-task.is-done").count(), 1);
    await context.close();
  }
  {
    const { page, context } = await openPage({
      owner: true,
      row: { done: { [first]: newer }, updated_at: newer },
      mirror: { done: {}, updated_at: older },
    });
    await shows(page, ".wa .wa-flag");
    is("and a row newer than the mirror wins", await page.locator(".wa-main .wa-task.is-done").count(), 1);
    await context.close();
  }
}

/* ============================================================
   3. The two themes, on the built page

   The stylesheet is the subject, so this is the REAL route out of
   `.next/` with the site's own hashed stylesheet beside it, rather
   than the hydration fixture, which drops CSS on purpose.
   ============================================================ */
{
  const BUILT = join(ROOT, "next", ".next");
  const PAGE = join(BUILT, "server", "app", "work-alpha.html");
  if (!existsSync(PAGE)) {
    console.log("\nthe two themes: SKIPPED, next/.next holds no prerendered page."
      + "\nRun `npx next build` in next/ first. A skip is not a pass.");
  } else {
    console.log("\nthe two themes, on the built page");

    const TYPES: Record<string, string> = {
      ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8", ".json": "application/json",
      ".woff2": "font/woff2", ".svg": "image/svg+xml", ".ico": "image/x-icon",
      ".png": "image/png",
    };
    const server = createServer((req, res) => {
      const path = new URL(req.url ?? "/", "http://x").pathname;
      const file = path === "/work-alpha" ? PAGE
        : path.startsWith("/_next/static/")
          ? join(BUILT, "static", path.slice("/_next/static/".length))
          : join(ROOT, "aab", path);
      readFile(file).then(
        (body) => { res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" }); res.end(body); },
        () => { res.writeHead(404).end("not found"); });
    });
    await new Promise<void>((r) => server.listen(PORT + 2, r));

    /** What a colour actually paints as, in sRGB. A computed value
        comes back as `oklab(...)` or `color-mix(...)`, so it is
        painted rather than parsed: one pixel, read back. */
    const PIXEL = `(color) => {
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      const x = c.getContext("2d");
      x.clearRect(0, 0, 1, 1);
      x.fillStyle = color;
      x.fillRect(0, 0, 1, 1);
      return [...x.getImageData(0, 0, 1, 1).data];
    }`;

    /** WCAG relative luminance, and the ratio between two of them. */
    const lum = ([r, g, b]: number[]): number => {
      const f = (v: number): number => {
        const n = v / 255;
        return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a: number[], b: number[]): number => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
      return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
    };

    interface Painted {
      ground: number[];
      card: number[];
      ink: number[];
      cardInk: number[];
      kinds: number[][];
      image: string;
    }

    for (const theme of ["dark", "light"] as const) {
      const context = await fixture.browser.newContext({ colorScheme: theme });
      const page = await context.newPage();
      await context.route("**/api/**", (r: Route) =>
        r.fulfill({ status: 404, contentType: "application/json", body: "{}" }));
      await context.route("**/api/work-alpha", (r: Route) =>
        r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }));
      await context.route(`${SUPA}/**`, (r: Route) => r.fulfill({
        status: 200, contentType: "application/json", headers: CORS, body: "[]",
      }));
      /* The webfont stylesheet, answered empty: this measures colour,
         and a test that waits on fonts.googleapis.com is a test that
         fails where there is no network. */
      await context.route("https://fonts.googleapis.com/**", (r: Route) =>
        r.fulfill({ status: 200, contentType: "text/css", body: "" }));
      await page.addInitScript(({ t, who }: { t: string; who: string }) => {
        localStorage.setItem("theme", t);
        localStorage.setItem("reiad-session", who);
      }, { t: theme, who: session("u-1") });

      await page.goto(`http://localhost:${PORT + 2}/work-alpha`, { waitUntil: "load" });
      const drew = await page.waitForSelector(".wa .wa-flag", { timeout: 10000 })
        .then(() => true, () => false);
      ok(`${theme}: the owner's page draws`, drew);
      if (!drew) { await context.close(); continue; }

      const seen = await page.evaluate(`((pixel) => {
        const wa = document.querySelector(".wa");
        const card = document.querySelector(".wa-card");
        const cs = getComputedStyle(wa);
        return {
          ground: pixel(cs.backgroundColor),
          card: pixel(getComputedStyle(card).backgroundColor),
          ink: pixel(getComputedStyle(document.querySelector(".wa-title")).color),
          cardInk: pixel(getComputedStyle(card.querySelector("h2")).color),
          kinds: ["setup", "think", "read", "write", "data", "people", "review"]
            .map((k) => pixel(cs.getPropertyValue("--k-" + k).trim())),
          image: cs.backgroundImage,
        };
      })(${PIXEL})`) as Painted;

      /* THE SHORTHAND BUG. A transparent ground is what an invalid
         `background` declaration leaves behind, and the page still
         looks fine because the body is underneath it. */
      is(`${theme}: the app's own ground is painted rather than transparent`,
        seen.ground[3], 255);
      ok(`${theme}: and the graph paper is drawn on it`,
        seen.image.includes("gradient"), seen.image);

      /* THE PALETTE. Which way round it is, and that the words on it
         can be read. */
      const groundLum = lum(seen.ground);
      ok(`${theme}: the ground is ${theme}`,
        theme === "dark" ? groundLum < 0.2 : groundLum > 0.7,
        `luminance ${groundLum.toFixed(3)}`);
      ok(`${theme}: the heading is readable on it`,
        ratio(seen.ink, seen.ground) >= 4.5, `${ratio(seen.ink, seen.ground)}:1`);
      ok(`${theme}: and a card's heading on the card`,
        ratio(seen.cardInk, seen.card) >= 4.5, `${ratio(seen.cardInk, seen.card)}:1`);
      ok(`${theme}: a card is a surface rather than the ground again`,
        Math.abs(lum(seen.card) - groundLum) > 0.01,
        `card ${lum(seen.card).toFixed(3)} against ground ${groundLum.toFixed(3)}`);

      /* The seven kinds, which are the site's seven accents: a kind
         written in light-mode hex is the failure this whole block is
         about, one label at a time. */
      seen.kinds.forEach((kind, i) => {
        const name = ["setup", "think", "read", "write", "data", "people", "review"][i];
        ok(`${theme}: the ${name} label is readable on a card`,
          ratio(kind, seen.card) >= 4.5, `${ratio(kind, seen.card)}:1`);
      });

      await context.close();
    }
    await new Promise<void>((r) => server.close(() => r()));
  }
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  await fixture.close(1);
}
console.log("A stranger gets a 404 and no rail entry, so does a reader who is not\n"
  + "the owner, and the owner's tick goes to the account and comes back.\n");
await fixture.close(0);
