/* ============================================================
   sync.test.ts: progress belongs to the account.

     node aab/sync.test.ts

   THE SENTENCE THIS HOLDS `aab/src/sync.ts` TO:

     THE ACCOUNT IS THE RECORD, AND NOTHING IS EVER PULLED OUT OF
     THE BROWSER INTO IT.

   Everything below follows from it. `CLAUDE.md` states the same
   thing as four states, and this file is one section per state
   plus the three edges that turned out to matter.

   ---- why it starts its own server ----

   It did not. It asked for one on :8899, printed
   `cd aab && python3 -m http.server 8899` and exited 0 when there
   was none, which is every run nobody had read that line before.
   A test that needs a server somebody starts by hand is a test
   that does not run, and this one did not run for long enough to
   miss a real regression: `refreshUser()` began writing a null
   user over a live session on 19 August 2026, and the four
   failures and the uncaught throw that followed sat unseen
   because the file skipped.

   The same went for Playwright. It asked for the bare specifier,
   which resolves from the root, and Playwright is a devDependency
   of `app/`. Both are found now, and a skip names which of the
   two ways it failed to start.

   ---- and why the policy is real ----

   The page is served with the Content-Security-Policy read out of
   `aab/_headers` rather than a copy of it. A harness that drops
   the policy cannot tell you whether a request was made or
   refused, and every exchange here is a `fetch` to Supabase under
   `connect-src`.

   ---- /404.html, and not the home page ----

   The home page has not been a file in `aab/` since Stage 11.5, so
   a static server over this directory answers it 404. `404.html`
   is one of the two pages that are not routes and cannot be, it
   loads `/app.js` like every other page, and `app.js` imports
   `signin.js`, which imports `sync.js` and starts it. That is the
   whole of what these checks need a page for.

   `aab/tsconfig.test.json` typechecks the annotations below and
   `scripts/check-types.ts` runs it.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import type { AddressInfo } from "node:net";
import type { BrowserContext, Page, Route } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------
   1. the two things this needs, found where they actually are
   ------------------------------------------------------------ */

/** Either shape of the module is accepted, so both are described. */
interface PlaywrightModule {
  chromium?: typeof import("playwright").chromium;
  default?: { chromium?: typeof import("playwright").chromium };
}

/* Playwright is a devDependency of `app/`: it is a browser driver
   and the root install is what CI runs. Every browser test here
   reaches it by that path. */
const WHERE = [
  process.env.PLAYWRIGHT,
  "playwright",
  "../app/node_modules/playwright/index.mjs",
].filter((s): s is string => Boolean(s));

let chromium: typeof import("playwright").chromium | undefined;
for (const spec of WHERE) {
  try {
    const mod: PlaywrightModule = await import(spec);
    chromium = mod.chromium ?? mod.default?.chromium;
    if (chromium) break;
  } catch { /* try the next place */ }
}
if (!chromium) {
  console.log("SKIPPED: no Playwright, so there is no browser to drive.");
  console.log("  cd app && npm install");
  console.log("A skip is not a pass.");
  process.exit(0);
}

/* ------------------------------------------------------------
   2. the site, served the way Cloudflare serves it
   ------------------------------------------------------------ */

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml", ".webmanifest": "application/manifest+json",
};

/* The real policy, read rather than copied: a second copy of a
   list is the failure the top of CLAUDE.md is about, and this one
   decides whether a request leaves the page at all. */
const CSP = (await readFile(join(HERE, "_headers"), "utf8"))
  .match(/Content-Security-Policy: (.+)/)?.[1].trim() ?? "";
if (!CSP) {
  console.log("SKIPPED: no Content-Security-Policy line in aab/_headers to serve.");
  console.log("A skip is not a pass.");
  process.exit(0);
}

const server = createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname;
  /* `normalize` before joining, so a request cannot walk out of
     the served directory. It is a test, and it is also two lines. */
  const file = join(HERE, normalize(path).replace(/^(\.\.[/\\])+/, ""));
  try {
    if (!(await stat(file)).isFile()) throw new Error("not a file");
    const type = TYPES[extname(file)] ?? "application/octet-stream";
    res.writeHead(200, type.startsWith("text/html")
      ? { "Content-Type": type, "Content-Security-Policy": CSP }
      : { "Content-Type": type });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("not found");
  }
});
await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
const PORT = (server.address() as AddressInfo).port;
const PAGE = `http://127.0.0.1:${PORT}/404.html`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});

/* ------------------------------------------------------------
   3. an account, and a browser that talks to it
   ------------------------------------------------------------ */

const SUPA = "https://wvjarqnnmkkuxyrndtya.supabase.co";

let fails = 0;
let ran = 0;
const check = (name: string, got: unknown, want: unknown): void => {
  ran += 1;
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fails += 1;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${name}`
    + (ok ? "" : `\n        got  ${JSON.stringify(got)}\n        want ${JSON.stringify(want)}`));
};

/** One row of `public.progress`, as PostgREST answers with it. */
interface Row {
  key: string;
  value: unknown;
  updated_at?: string;
}

/** The columns of `public.profiles` this file reads and writes.
    They are the COLUMNS, spelled as Supabase returns them. */
interface Profile {
  display_name?: string;
  following?: string[];
  pace?: string;
  setup_at?: string;
}

/** What `GET /auth/v1/user` answers with. The real endpoint sends
    a whole user record; only the three fields this site reads are
    described, and `id` is the one that matters. */
interface UserRecord {
  id?: string;
  email?: string;
  user_metadata?: { full_name?: string; avatar_url?: string };
}

/** The account, as the routed Supabase below holds it. */
interface Account {
  rows: Map<string, Row>;
  profile: Profile | null;
  patches: Profile[];
  deletes: number;
  /** Every Supabase path this browser asked for, so a section can
      assert that a signed-out reader asked for nothing at all. */
  asked: string[];
}

interface Fixture {
  ctx: BrowserContext;
  p: Page;
  state: Account;
  errs: string[];
}

const b64 = (o: unknown): string => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (sub: string): string => [
  b64({ alg: "HS256" }),
  b64({
    sub, email: "i@reiad.co.uk", exp: Math.floor(Date.now() / 1000) + 3600,
    user_metadata: { full_name: "Rony Reiad" },
  }),
  "s",
].join(".");

/* A session as a browser that signed in BEFORE 19 August 2026
   holds it: no `avatar` on the user. That is deliberate and it is
   the shape most real sessions are in, so `initAccount()` calls
   `refreshUser()` on load and the answer below is on the path of
   every section in this file. */
const session = (sub: string): string => JSON.stringify({
  access_token: jwt(sub), refresh_token: "r", expires_at: Date.now() + 3600e3,
  user: { id: sub, email: "i@reiad.co.uk", name: "Rony Reiad" },
});

/** What a healthy `/auth/v1/user` sends back. */
const REAL_USER = (sub: string): UserRecord => ({
  id: sub,
  email: "i@reiad.co.uk",
  user_metadata: { full_name: "Rony Reiad" },
});

async function make(
  { accountRows = [], profile = null, device = {}, user = REAL_USER("u") }:
  {
    accountRows?: Row[];
    profile?: Profile | null;
    device?: Record<string, string>;
    /** What `GET /auth/v1/user` answers. One section deliberately
        sends something unusable. */
    user?: UserRecord;
  },
): Promise<Fixture> {
  const ctx = await browser.newContext({
    viewport: { width: 1100, height: 1000 },
    serviceWorkers: "block",
  });
  const p = await ctx.newPage();
  const errs: string[] = [];
  p.on("pageerror", (e) => errs.push(e.message));
  const state: Account = {
    rows: new Map(accountRows.map((r) => [r.key, r])),
    profile, patches: [], deletes: 0, asked: [],
  };

  const json = (route: Route, body: unknown, status = 200) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

  await ctx.route(`${SUPA}/rest/v1/**`, async (route) => {
    const req = route.request();
    const u = new URL(req.url());
    state.asked.push(`${req.method()} ${u.pathname}`);

    if (u.pathname.endsWith("/profiles")) {
      if (req.method() === "PATCH") {
        const patch = JSON.parse(String(req.postData())) as Profile;
        state.patches.push(patch);
        state.profile = { ...state.profile, ...patch };
        return route.fulfill({ status: 204, body: "" });
      }
      return json(route, state.profile ? [state.profile] : []);
    }

    if (u.pathname.endsWith("/progress")) {
      if (req.method() === "DELETE") {
        state.deletes += 1;
        state.rows.clear();
        return route.fulfill({ status: 204, body: "" });
      }
      if (req.method() === "POST") {
        const sent = JSON.parse(String(req.postData())) as Row[];
        for (const r of sent) state.rows.set(r.key, { ...r, updated_at: new Date().toISOString() });
        return route.fulfill({ status: 201, body: "" });
      }
      return json(route, [...state.rows.values()]);
    }

    /* Scenarios and targets: empty, and answered rather than left
       to fail, because a rejected fetch is a console error this
       file counts. */
    return json(route, []);
  });

  await ctx.route(`${SUPA}/auth/v1/**`, (route) => {
    const u = new URL(route.request().url());
    state.asked.push(`${route.request().method()} ${u.pathname}`);
    if (u.pathname.endsWith("/user")) return json(route, user);
    return json(route, {});
  });

  await ctx.route("**/api/**", (route) =>
    json(route, { ok: true, articles: [] }));

  await p.addInitScript((d: Record<string, string>) => {
    for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v);
  }, device);
  return { ctx, p, state, errs };
}

const old = new Date(Date.now() - 600_000).toISOString();
const local = (p: Page, key: string): Promise<unknown> =>
  p.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), key);
const sorted = (v: unknown): unknown => (Array.isArray(v) ? [...v].sort() : v);
const settled = (p: Page, ms: number): Promise<void> => p.waitForTimeout(ms);

/** Every section opens the page the same way. */
async function open(f: Fixture, ms = 2000): Promise<void> {
  await f.p.goto(PAGE, { waitUntil: "domcontentloaded" });
  await settled(f.p, ms);
}

const noErrors = (f: Fixture): void =>
  check("no page errors", f.errs.length ? f.errs[0] : "none", "none");

/* ============================================================
   4. signed out: nothing at all

   The first row of the table in CLAUDE.md, and the one the old
   version of this file never asked. A reader with no account gets
   every page and every feature, and the site must not so much as
   open a socket on their behalf.
   ============================================================ */
console.log("signed out, with progress of this browser's own");
{
  const f = await make({
    device: {
      "learn-read": JSON.stringify(["b", "c"]),
      "deutsch-read": JSON.stringify(["stufe-1/anfang"]),
    },
  });
  await open(f);

  check("nothing was asked of the account", f.state.asked, []);
  check("this browser's progress is untouched",
    sorted(await local(f.p, "learn-read")), ["b", "c"]);
  check("and so is the other school's",
    await local(f.p, "deutsch-read"), ["stufe-1/anfang"]);
  noErrors(f);
  await f.ctx.close();
}

/* ============================================================
   5. signing in adopts, and uploads nothing

   The account's rows are written on to the device, and any synced
   key the account does not have is removed. What the browser held
   first is not merged and not uploaded, because a browser may be
   a library machine or a phone handed over for five minutes and
   the site cannot tell.
   ============================================================ */
console.log("\nsigning in on a browser that already has progress");
{
  const f = await make({
    accountRows: [{ key: "learn-read", value: ["a"], updated_at: old }],
    device: {
      "reiad-session": session("u-adopt"),
      "learn-read": JSON.stringify(["b", "c"]),
      "deutsch-read": JSON.stringify(["stufe-1/anfang"]),
    },
    user: REAL_USER("u-adopt"),
  });
  await open(f, 2500);

  check("the device holds the account's", sorted(await local(f.p, "learn-read")), ["a"]);
  check("a key the account does not have is dropped", await local(f.p, "deutsch-read"), null);
  check("and nothing of the browser's went up",
    sorted(f.state.rows.get("learn-read")?.value ?? []), ["a"]);
  /* The key the BROWSER held and the account did not. `days-active`
     is not that: it is a set `/streak.js` writes on a visit, so it
     goes up like any other tick made while signed in, which is the
     section below. Asserting "no second key at all" was asserting
     that a signed-in reader's visit is not recorded, and it went
     red the first time this file was run against a page that
     records one. */
  check("nothing the browser already held went up",
    [...f.state.rows.keys()].includes("deutsch-read"), false);
  /* `archive/first-sync.js` is the dialog this replaced. It had to
     ask, once per account per browser, because it treated the two
     as equal copies. Nothing has to be asked now. */
  check("nothing was asked of the reader", await f.p.locator("dialog.first-sync").count(), 0);
  noErrors(f);
  await f.ctx.close();
}

/* ============================================================
   6. a tick made while signed in goes up

   Adoption is not read-only. Everything done after signing in is
   the account's.
   ============================================================ */
console.log("\nticking a lesson while signed in");
{
  const f = await make({
    accountRows: [{ key: "learn-read", value: ["a"], updated_at: old }],
    device: { "reiad-session": session("u-tick") },
    user: REAL_USER("u-tick"),
  });
  await open(f);

  /* Exactly what a tick button does: write the key, announce it. */
  await f.p.evaluate(() => {
    localStorage.setItem("learn-read", JSON.stringify(["a", "share"]));
    dispatchEvent(new CustomEvent("learn:progress"));
  });
  await settled(f.p, 4000);

  check("the account has both", sorted(f.state.rows.get("learn-read")?.value ?? []), ["a", "share"]);
  noErrors(f);
  await f.ctx.close();
}

/* ============================================================
   7. resetting clears the account

   Every school's `resetAll()` REMOVES its key rather than
   emptying it. The guard this replaced recognised only an empty
   array, so `undefined` fell through a union and the account's
   copy came straight back, every time. There is no guard now: an
   absent key is an empty set and subtraction does the rest.
   ============================================================ */
console.log("\nresetting progress while signed in");
{
  const f = await make({
    accountRows: [
      { key: "learn-read", value: ["share", "dse"], updated_at: old },
      { key: "learn-last", value: { id: "share", ts: Date.now() - 600_000 }, updated_at: old },
    ],
    device: { "reiad-session": session("u-reset") },
    user: REAL_USER("u-reset"),
  });
  await open(f);

  check("the device adopted the account's", sorted(await local(f.p, "learn-read")), ["dse", "share"]);

  await f.p.evaluate(() => {
    for (const key of ["learn-read", "learn-last"]) localStorage.removeItem(key);
    dispatchEvent(new CustomEvent("learn:progress"));
  });
  await settled(f.p, 4000);

  check("the device stays cleared", (await local(f.p, "learn-read")) ?? [], []);
  check("the bookmark stays cleared", await local(f.p, "learn-last"), null);
  check("and the account is cleared too", f.state.rows.get("learn-read")?.value ?? null, []);
  noErrors(f);
  await f.ctx.close();
}

/* ============================================================
   8. a tick from another device arrives

   Two signed-in devices is the one merge left, and it is between
   two states that both came from the account: `base` is what the
   account said at the last exchange, so `local \ base` is what
   this reader did and `base \ local` is what they undid.
   ============================================================ */
console.log("\na tick made on another device");
{
  const f = await make({
    accountRows: [{ key: "learn-read", value: ["a"], updated_at: old }],
    device: { "reiad-session": session("u-two") },
    user: REAL_USER("u-two"),
  });
  await open(f);

  /* The phone, which this browser knows nothing about, and one
     tick here at the same time. Neither may lose the other. */
  f.state.rows.set("learn-read", {
    key: "learn-read", value: ["a", "phone"], updated_at: new Date().toISOString(),
  });
  await f.p.evaluate(() => {
    localStorage.setItem("learn-read", JSON.stringify(["a", "laptop"]));
    dispatchEvent(new CustomEvent("learn:progress"));
  });
  await settled(f.p, 4000);

  check("the account holds both",
    sorted(f.state.rows.get("learn-read")?.value ?? []), ["a", "laptop", "phone"]);
  check("and so does this device",
    sorted(await local(f.p, "learn-read")), ["a", "laptop", "phone"]);
  noErrors(f);
  await f.ctx.close();
}

/* ============================================================
   7b. a MAP is reconciled entry by entry, not taken whole

   `where-read`, `tools-used` and the two practice books are maps
   rather than one value, and a `mark` would take the newer whole
   object: a phone that read one article would throw away every
   position a laptop had, and the sentences somebody typed into
   the German book on one machine would be gone the first time
   they opened it on another. Nothing would look broken. They
   would simply find themselves back at the top of pieces they
   were half way through, and an empty box where they had
   written.

   Both halves are checked here: the union, and the tiebreak when
   the SAME entry was written on both. The practice book is the
   one where the entry carries no stamp of its own, so the map's
   own `ts` dates it: see `stamp()` in `aab/src/sync.ts`.
   ============================================================ */
console.log("\na piece read on one device and a page written on another");
{
  const f = await make({
    accountRows: [
      { key: "where-read",
        value: { "/insights/a.html": { i: 12, of: 40, sig: "one", ts: 5000 } , ts: 5000 },
        updated_at: old },
      { key: "deutsch-schrift",
        value: { "stufe-1/tag-1": "vom Handy", ts: 5000 }, updated_at: old },
    ],
    device: { "reiad-session": session("u-map") },
    user: REAL_USER("u-map"),
  });
  await open(f);

  /* NOW THE PHONE READS A THIRD PIECE while this device reads a
     second, and neither has seen the other's. That is the shape
     that separates the two rules, and the first draft of this
     test did not have it: after the first exchange both sides
     already knew about `a`, so a `mark` taking the device's whole
     map kept everything and passed. A test that passes under the
     rule it was written to rule out is not a test.

     The account's stamp is deliberately OLDER, so a `mark` would
     take this device's map whole and drop `c` and `tag-3`. */
  f.state.rows.set("where-read", {
    key: "where-read",
    value: {
      "/insights/a.html": { i: 12, of: 40, sig: "one", ts: 5000 },
      "/insights/c.html": { i: 7, of: 25, sig: "three", ts: 6000 },
      ts: 6000,
    },
    updated_at: new Date().toISOString(),
  });
  f.state.rows.set("deutsch-schrift", {
    key: "deutsch-schrift",
    value: { "stufe-1/tag-1": "vom Handy", "stufe-1/tag-3": "auch vom Handy", ts: 6000 },
    updated_at: new Date().toISOString(),
  });

  /* And this device ADDS to what it has rather than replacing it,
     which is what `markWhere` and the practice book both do. The
     rule reads an entry that was in `base` and is gone from the
     device as a removal, correctly, so a replacement here would
     be asking it to un-remove something. */
  await f.p.evaluate(() => {
    const add = (key: string, id: string, value: unknown): void => {
      const had = JSON.parse(localStorage.getItem(key) || "{}");
      localStorage.setItem(key, JSON.stringify({ ...had, [id]: value, ts: 9000 }));
    };
    add("where-read", "/insights/b.html", { i: 3, of: 20, sig: "two", ts: 9000 });
    add("deutsch-schrift", "stufe-1/tag-2", "vom Laptop");
    dispatchEvent(new CustomEvent("deutsch:progress"));
  });
  await settled(f.p, 4000);

  const where = (await local(f.p, "where-read")) as Record<string, { i: number }>;
  check("the position the phone had just recorded arrives", where["/insights/c.html"]?.i, 7);
  check("the one both already knew about is still right", where["/insights/a.html"]?.i, 12);
  check("and this device's own survives the exchange", where["/insights/b.html"]?.i, 3);

  const wrote = (await local(f.p, "deutsch-schrift")) as Record<string, string>;
  check("the day typed on the phone arrives", wrote["stufe-1/tag-3"], "auch vom Handy");
  check("what was typed here is still here", wrote["stufe-1/tag-2"], "vom Laptop");

  const up = f.state.rows.get("deutsch-schrift")?.value as Record<string, string>;
  check("and the account holds this device's day", up?.["stufe-1/tag-2"], "vom Laptop");
  check("without losing the phone's", up?.["stufe-1/tag-3"], "auch vom Handy");
  noErrors(f);
  await f.ctx.close();
}

/* ---- and the same entry, written on both ---- */
console.log("\nthe same page, written on two devices");
{
  const f = await make({
    accountRows: [
      { key: "where-read",
        value: { "/insights/a.html": { i: 30, of: 40, sig: "one", ts: 9000 }, ts: 9000 },
        updated_at: old },
    ],
    device: {
      "reiad-session": session("u-clash"),
      /* Older, so the account's is the one that should stand. */
      "where-read": JSON.stringify({
        "/insights/a.html": { i: 4, of: 40, sig: "one", ts: 2000 }, ts: 2000,
      }),
    },
    user: REAL_USER("u-clash"),
  });
  await open(f);
  await settled(f.p, 4000);

  const where = (await local(f.p, "where-read")) as Record<string, { i: number }>;
  check("the newer of the two wins, by the entry's own stamp",
    where["/insights/a.html"]?.i, 30);
  noErrors(f);
  await f.ctx.close();
}

/* ============================================================
   8b. a reload does not eat what the reader just did

   The Android app shipped this bug and a person met it as
   "settings and cards rearranging are NOT working": `base` lived
   only in memory, so the first exchange after every fresh start
   ADOPTED, and adopt writes the account's copy of every mark
   over the device's. The site had the same window, one page-load
   wide. `base` is stored now ("sync-base", keyed to the account),
   so a reload resumes the conversation instead of starting one,
   and the board a reader arranged a moment before reloading is
   theirs, locally and on the account.
   ============================================================ */
console.log("\na reload right after arranging the board");
{
  const f = await make({
    accountRows: [{
      key: "home-board",
      value: { board: ["continue:wide"], ts: 1000 },
      updated_at: old,
    }],
    device: { "reiad-session": session("u-reload") },
    user: REAL_USER("u-reload"),
  });
  await open(f);

  /* The reader arranges the board, and reloads before thinking
     about it: a fresh page, a fresh module, no in-memory base. */
  await f.p.evaluate(() => {
    localStorage.setItem(
      "home-board",
      JSON.stringify({ board: ["pulse:tall", "continue:wide"], ts: Date.now() }),
    );
  });
  await open(f);

  check("the arrangement survives the reload",
    ((await local(f.p, "home-board")) as { board?: string[] } | null)?.board ?? [],
    ["pulse:tall", "continue:wide"]);
  check("and the account was brought up to it",
    (f.state.rows.get("home-board")?.value as { board?: string[] } | undefined)?.board ?? [],
    ["pulse:tall", "continue:wide"]);
  check("the conversation is recorded for the next load",
    await f.p.evaluate(() => JSON.parse(localStorage.getItem("sync-base") ?? "{}").who ?? null),
    "u-reload");
  noErrors(f);
  await f.ctx.close();
}

/* ============================================================
   9. what came down is announced

   `sync.js` writes the account's rows straight into localStorage,
   which fires neither the same-tab event nor `storage`, because
   `storage` only fires in OTHER tabs. `sync:done` is the third
   thing `subscribe()` listens for and the one that is easy to
   leave out: without it every meter on the page is drawn against
   what storage held BEFORE the exchange and stays there.

   `/account.html` drew a course target at "0 of 60" beside a bar
   of the same school reading "9 of 60" for exactly this reason.
   ============================================================ */
console.log("\nwhat arrives is announced");
{
  const f = await make({
    accountRows: [{ key: "learn-read", value: ["a", "b"], updated_at: old }],
    device: { "reiad-session": session("u-event") },
    user: REAL_USER("u-event"),
  });
  /* The listener has to be in place before the exchange, so it is
     installed on the document before anything on the page runs. */
  await f.p.addInitScript(() => {
    const seen: string[] = [];
    (window as unknown as { heard: string[] }).heard = seen;
    document.addEventListener("sync:done", () => seen.push("sync:done"));
    addEventListener("learn:progress", () => seen.push("learn:progress"));
  });
  await open(f, 3000);

  const heard = await f.p.evaluate(() => (window as unknown as { heard: string[] }).heard);
  check("sync:done fired, so a meter redraws",
    Array.isArray(heard) && heard.includes("sync:done"), true);
  check("and the device really did take the rows",
    sorted(await local(f.p, "learn-read")), ["a", "b"]);
  noErrors(f);
  await f.ctx.close();
}

/* ============================================================
   10. a refresh it cannot read does not sign anybody out

   THE REGRESSION THIS SECTION EXISTS FOR, 19 August 2026.

   `refreshUser()` built a reader field by field until that day,
   so an answer with nothing usable in it produced an object with
   undefined fields: wrong, but truthy. Factoring the three copies
   of that mapping into one `person()` made the same answer
   produce null, and the null was written straight over a live
   session.

   What that costs is not a wrong name in a corner. `current()`
   goes null, so `saveProfile` throws "Not signed in.", `sync.js`
   stops pushing, and a reader who is signed in watches their
   ticks stop reaching the account with nothing on screen to say
   so. Four sections of this file went red at once and it was
   still shipped, because the file was skipping.

   There is exactly one thing that ends a session on purpose and
   it is `signOut()`.
   ============================================================ */
console.log("\na refresh that cannot be read");
{
  const f = await make({
    accountRows: [{ key: "learn-read", value: ["a"], updated_at: old }],
    device: { "reiad-session": session("u-odd") },
    /* 200, and nothing usable in it. */
    user: {},
  });
  await open(f, 2500);

  check("the reader is still signed in", await f.p.evaluate(async () => {
    const m = await import("/account.js");
    return m.current()?.id ?? null;
  }), "u-odd");
  check("their name survived", await f.p.evaluate(async () => {
    const m = await import("/account.js");
    return m.current()?.name ?? null;
  }), "Rony Reiad");

  /* And the consequence, rather than only the cause: a tick still
     reaches the account. */
  await f.p.evaluate(() => {
    localStorage.setItem("learn-read", JSON.stringify(["a", "still"]));
    dispatchEvent(new CustomEvent("learn:progress"));
  });
  await settled(f.p, 4000);
  check("and a tick still goes up",
    sorted(f.state.rows.get("learn-read")?.value ?? []), ["a", "still"]);
  noErrors(f);
  await f.ctx.close();
}

/* ============================================================
   11. signing out takes the mirror off

   The next person at the same machine must not inherit the last
   one's ticks, and the account must not lose anything by it.
   ============================================================ */
console.log("\nsigning out");
{
  const f = await make({
    accountRows: [{ key: "learn-read", value: ["a", "b"], updated_at: old }],
    device: { "reiad-session": session("u-out") },
    user: REAL_USER("u-out"),
  });
  await open(f);
  check("the mirror is on the device", sorted(await local(f.p, "learn-read")), ["a", "b"]);

  await f.p.evaluate(async () => {
    const m = await import("/account.js");
    await m.signOut();
  });
  await settled(f.p, 1500);

  check("and it comes off again", await local(f.p, "learn-read"), null);
  check("the account is untouched", sorted(f.state.rows.get("learn-read")?.value ?? []), ["a", "b"]);
  noErrors(f);
  await f.ctx.close();
}

/* ============================================================
   12. changing the name

   Driven through `/account.js` rather than through the account
   page's form, and that is deliberate rather than a shortcut:
   this harness is a static server over `aab/`, and
   `/account.html` has not been a file here since Stage 11.5. What
   this is really testing is the profile path the whole file
   shares, and that is a module. `next/admin.test.ts` is the
   pattern for driving a rendered page and needs a build this file
   does not.
   ============================================================ */
console.log("\nchanging the display name");
{
  const f = await make({
    profile: {
      display_name: "Rony", following: ["deutsch"], pace: "often",
      setup_at: new Date().toISOString(),
    },
    device: { "reiad-session": session("u-name") },
    user: REAL_USER("u-name"),
  });
  await open(f, 1500);

  check("the profile row is read", await f.p.evaluate(async () => {
    const m = await import("/account.js");
    return (await m.getProfile())?.display_name ?? null;
  }), "Rony");

  await f.p.evaluate(async () => {
    const m = await import("/account.js");
    await m.setDisplayName("Rony Reiad");
  });
  await settled(f.p, 800);

  check("it PATCHed the new name", f.state.patches.at(-1)?.display_name, "Rony Reiad");
  check("the session carries it", await f.p.evaluate(async () => {
    const m = await import("/account.js");
    return m.current()?.name ?? null;
  }), "Rony Reiad");
  check("the header button updated",
    (await f.p.locator(".account-btn").textContent())?.trim(), "R");
  noErrors(f);
  await f.ctx.close();
}

await browser.close();
server.close();
console.log(fails
  ? `\n${fails} of ${ran} failed.`
  : `\nsync: ${ran} checks, the account is the record and the browser is a mirror.`);
process.exit(fails ? 1 : 0);
