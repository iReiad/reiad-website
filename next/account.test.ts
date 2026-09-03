/* ============================================================
   account.test.ts: what an account actually gets you, driven in
   a real browser.

     node next/account.test.ts

   Needs `npx next build` in `next/` first, and a browser. Without
   either it says which one is missing and skips, and a skip is
   not a pass.

   ---- why this file exists ----

   Five features landed on the account at once: a reading list,
   notes, reading preferences, a year of days and a way to take a
   copy of all of it. Every one of them is drawn by a script into
   markup a route rendered, which is the exact shape of thing that
   `parity.test.ts` cannot see and `interactive.test.ts` was
   written for: the HTML is right whether or not a single one of
   them worked.

   And the account menu is the other half. It stopped being a
   modal dialog and became a `popover`, which moved four
   behaviours out of `aab/signin.js` and into the browser. That is
   a good trade and it is only a good trade if the browser
   actually does them, so the light dismiss, the Escape key and
   the focus return are checked here rather than assumed.

   The pages are served the way Cloudflare serves them, which is
   the same three-line split `interactive.test.ts` uses: the HTML
   Next prerendered, the chunks beside it, and everything else out
   of `aab/`. Supabase is routed, so nothing here reaches the real
   project and the test needs no network.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { BrowserContext, Dialog, Page, Route } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, ".next");
const AAB = join(HERE, "..", "aab");
const PORT = 8993;

let passed = 0;
const failures: string[] = [];
const ok = (name: string, condition: unknown, detail: string | null = ""): void => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}: ${detail}` : name);
};
const is = (name: string, got: unknown, want: unknown): void =>
  ok(name, JSON.stringify(got) === JSON.stringify(want),
    `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

/** Says why, and does not come back. `never` rather than `void`
    so that everything after a skip knows what the skip ruled out:
    the browser below is not optional once this line is past. */
const skip: (why: string) => never = (why) => {
  console.log(`account: SKIPPED, ${why}`);
  process.exit(0);
};

const exists = (path: string): Promise<boolean> => stat(path).then(() => true, () => false);

if (!await exists(join(BUILD, "server/app/account.html"))) {
  skip("next/.next holds no prerendered account page. Run `npx next build` in next/ first.");
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
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const PRERENDERED: Record<string, string> = { "/account": "account.html" };

/* The real policy, read out of `aab/_headers` rather than copied,
   because a copy is a second list and this repository has been
   bitten by one of those more than once.

   It is here because a harness that drops the CSP cannot tell you
   whether an image, a font or a fetch is allowed: the page looks
   identical either way, which is exactly the shape of the bug
   `scripts/check-csp.ts` was written for. */
/* Thrown rather than defaulted to nothing: a harness that served
   the page with an empty policy would answer every check in this
   file and none of them would be about the policy. */
const policy = (await readFile(join(AAB, "_headers"), "utf8"))
  .match(/Content-Security-Policy: (.+)/)?.[1];
if (!policy) throw new Error("aab/_headers carries no Content-Security-Policy");
const CSP = policy.trim();

/* The one Worker endpoint the erase calls: the reading room's
   files live in R2 under the reader's prefix, not in a table, so
   the page asks the Worker to clear them after the rows. Counted,
   because "erased" with the files left behind is the failure
   `scripts/check-account.ts` reads the source for and this is
   the half that says the button really sends it. */
let filesErased = 0;

const server = createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname;
  if (path === "/api/research/files" && req.method === "DELETE") {
    filesErased += 1;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, removed: 3 }));
    return;
  }
  const prerendered = PRERENDERED[path];
  const file = prerendered
    ? join(BUILD, "server/app", prerendered)
    : path.startsWith("/_next/static/")
      ? join(BUILD, "static", path.slice("/_next/static/".length))
      : join(AAB, path.replace(/^\//, ""));
  try {
    const body = await readFile(file);
    const type = TYPES[extname(file)] || "application/octet-stream";
    res.writeHead(200, type.startsWith("text/html")
      ? { "Content-Type": type, "Content-Security-Policy": CSP }
      : { "Content-Type": type });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("not found");
  }
});
await new Promise<void>((resolve) => { server.listen(PORT, () => resolve()); });

const browser = await chromium.launch(browserPath ? { executablePath: browserPath } : {});

/* ---- a signed-in session, and an account with things in it ---- */

const SUPA = "https://wvjarqnnmkkuxyrndtya.supabase.co";
const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
/* The picture a Google sign-in brings with it. Routed below to a
   1x1 image, so the check is about the markup and the policy
   rather than about Google being up. */
const AVATAR = "https://lh3.googleusercontent.com/a/A-PICTURE";
const jwt = (sub: string) => [b64({ alg: "HS256" }),
  b64({ sub, email: "i@reiad.co.uk", exp: Math.floor(Date.now() / 1000) + 3600,
        user_metadata: { full_name: "Rony Reiad", avatar_url: AVATAR } }), "s"].join(".");
const session = (sub: string) => JSON.stringify({
  access_token: jwt(sub), refresh_token: "r", expires_at: Date.now() + 3600e3,
  user: { id: sub, email: "i@reiad.co.uk", name: "Rony Reiad", avatar: AVATAR },
});

/** Who this test signs in as. */
const ME = "u-1";
const NOW = new Date().toISOString();

/** The Research Studio's tables, spelled as `aab/src/account-page.ts`
    spells them: the copy and the erase both spread this list. */
const RESEARCH_TABLES = [
  "research_projects", "research_collections", "research_sources", "research_notes",
  "research_versions", "research_questions", "research_tasks", "research_lists",
  "research_activity", "research_highlights", "research_searches", "research_documents",
  "research_events", "research_sessions", "research_people", "research_reviews", "research_review_records",
  "research_datasets", "research_transforms", "research_runs",
] as const;

/** SOMEBODY ELSE'S PROFILE, and the reason it is here.
    `profiles` is the one table whose select policy is
    `using (true)`, so a read with no `id=eq.` filter returns
    whichever row the planner reaches first out of the WHOLE
    table. This fixture used to answer every GET with the
    reader's own row, which made it kinder than Postgres and
    therefore blind: `getProfile()` shipped with no filter, and
    all 117 checks here passed while the live account page drew a
    stranger's answers.
    It is deliberately the row a fresh account has, because that
    is what made the bug so hard to read from the outside: no
    pace, no `setup_at`, so the setup form came back after every
    single save. */
const STRANGER = {
  display_name: "somebody else", following: [], pace: "", setup_at: null,
};

/* A real 1x1 PNG. `naturalWidth` is the only thing that separates
   an image that loaded from an `<img>` the policy refused, and a
   refused one looks identical in the DOM. */
const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64");

const DAYS = ((): string[] => {
  /* Ten of the last fourteen, so the heatmap has something to
     draw and the week line has a number that is not zero. */
  const out: string[] = [];
  for (let i = 0; i < 14; i += (i % 4 === 2 ? 2 : 1)) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const pad = (n: number) => String(n).padStart(2, "0");
    out.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }
  return out;
})();

/** Anything that came up the wire, as an object. A narrowing
    function rather than a cast, because what the page posts is
    the thing being checked and a cast would decide it here. */
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** The same, for a POST body: PostgREST takes an array of rows
    even when there is one of them. */
const asRows = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? value.filter(isObject) : [];

/** One row of `library`, `targets` or `scenarios`. The three
    tables hold different columns and this harness treats them
    alike: an id, plus whatever the check seeded or the page
    posted. Which columns matter is said where each is seeded. */
type ListRow = { id: string } & Record<string, unknown>;

/** One row of `progress`: a synced key and whatever is filed
    under it. */
interface ProgressRow {
  key: string;
  value: unknown;
  updated_at: string;
}

/** What the browser sent, so a check can say a press wrote
    something rather than only that a row left the page. */
interface Sent {
  table: string;
  method: string;
  body: unknown;
}

/** What an account holds before the page is opened. Absent means
    the default below, not empty. */
interface Seeded {
  progress?: Record<string, string[]>;
  library?: ListRow[];
  targets?: ListRow[];
  scenarios?: ListRow[];
  profile?: Record<string, unknown>;
}

interface Account {
  progress: Map<string, ProgressRow>;
  library: ListRow[];
  targets: ListRow[];
  scenarios: ListRow[];
  profile: Record<string, unknown>;
  sent: Sent[];
  /** The five tables this page reads whole and nothing else on it
      draws. Keyed by table so a copy that stopped carrying one is
      an empty list where a row was. */
  others: Map<string, Record<string, unknown>[]>;
  /** Every REST GET, whole URL. `sent` records the writes; a read
      has no body, so the only thing worth keeping about one is
      what it asked for, which is exactly where the bug was. */
  reads: string[];
}

/** One load of the account page, and everything it left behind. */
interface Opened {
  page: Page;
  context: BrowserContext;
  state: Account;
  errors: string[];
}

/**
 * A browser talking to an account that holds `state`.
 *
 * Every Supabase table is answered from memory, and what the
 * browser sent is kept, so a check can assert that pressing a
 * button actually wrote something rather than only that the row
 * disappeared from the page.
 */
async function open(
  path: string,
  { signedIn = true, rows = {}, seed = {} }:
    { signedIn?: boolean; rows?: Seeded; seed?: Record<string, string> } = {},
): Promise<Opened> {
  const context = await browser.newContext({ viewport: { width: 1180, height: 1000 } });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => { errors.push(e.message); });
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());

  const state: Account = {
    progress: new Map(Object.entries({
      "learn-read": ["share", "dse"],
      "learn-checks": ["share#0", "share#1"],
      "days-active": DAYS,
      ...(rows.progress ?? {}),
    }).map(([key, value]): [string, ProgressRow] =>
      [key, { key, value, updated_at: new Date().toISOString() }])),
    library: rows.library ?? [],
    targets: rows.targets ?? [],
    scenarios: rows.scenarios ?? [],
    reads: [],
    profile: rows.profile ?? {
      display_name: "Rony Reiad", following: ["money"], pace: "often",
      setup_at: new Date().toISOString(),
    },
    sent: [],
    /* One row each, so a copy that stopped carrying one is a
       copy with an empty list where a row was. */
    others: new Map<string, Record<string, unknown>[]>([
      /* The Research Studio's nine, one row each, and the row
         that matters is the question the old desk's thread became:
         a copy that dropped the studio would drop a year's reading. */
      ...RESEARCH_TABLES.map((table): [string, Record<string, unknown>[]] => [table, [{
        id: `${table}-1`, user_id: ME, created_at: NOW, updated_at: NOW,
        ...(table === "research_questions"
          ? { text: "Are the banks over-provisioned?", state: "open", body: { carried: true } }
          : table === "research_sources"
            ? { type: "article-journal", title: "Weather shocks and farm incomes", key: "rahman2021weather", csl: {} }
            : {}),
      }]]),
      ["routines", [{ id: "rt-1", name: "A week", bands: [], tasks: [], is_active: true,
        created_at: NOW, updated_at: NOW }]],
      ["routine_entries", [{ id: "re-1", routine_id: "rt-1", entry_date: "2026-08-01",
        marks: {}, mood: null, note: null, chose: null, updated_at: NOW }]],
      ["routine_templates", [{ id: "tp-1", name: "Mine", description: "",
        is_public: false, data: {}, created_at: NOW }]],
      /* WITH its ciphertext, because the assertion below is that
         the copy leaves it behind. */
      ["broker_tokens", [{ user_id: ME, broker: "trading212",
        cipher: "AAAAAAAAAAAAAAAAAAAAAAAA", label: "Main", env: "live",
        created_at: NOW, updated_at: NOW }]],
    ]),
  };

  await context.route(`${SUPA}/rest/v1/**`, async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    const table = url.pathname.split("/").pop() ?? "";
    const json = (payload: unknown, status = 200) =>
      route.fulfill({ status, contentType: "application/json", body: JSON.stringify(payload) });

    const posted = req.postData();
    const body: unknown = posted ? JSON.parse(posted) : null;
    if (req.method() === "GET") state.reads.push(url.pathname + url.search);
    else state.sent.push({ table, method: req.method(), body });

    if (table === "profiles") {
      if (req.method() === "PATCH") {
        state.profile = { ...state.profile, ...(isObject(body) ? body : {}) };
        return route.fulfill({ status: 204, body: "" });
      }
      /* Every other table here is owner-scoped by its own policy,
         so an unfiltered read returns your rows and this fixture
         can ignore the question. Not this one. `id=eq.<me>` is
         the only thing separating a reader from a stranger, so
         the fake answers exactly as the database would: filtered,
         your row; unfiltered, the heap, and the stranger is at
         the front of it because saving yours moved it to the
         back. */
      const want = url.searchParams.get("id");
      if (!want) return json([STRANGER, state.profile]);
      if (want !== `eq.${ME}`) return json([STRANGER]);
      return json([state.profile]);
    }
    if (table === "progress") {
      if (req.method() === "DELETE") { state.progress.clear(); return route.fulfill({ status: 204, body: "" }); }
      if (req.method() === "POST") {
        for (const r of asRows(body)) {
          state.progress.set(String(r.key), {
            ...r, key: String(r.key), value: r.value,
            updated_at: new Date().toISOString(),
          });
        }
        return route.fulfill({ status: 201, body: "" });
      }
      return json([...state.progress.values()]);
    }
    if (table === "library" || table === "targets" || table === "scenarios") {
      if (req.method() === "DELETE") {
        state[table] = [];
        return route.fulfill({ status: 204, body: "" });
      }
      if (req.method() === "POST") {
        const made = asRows(body).map((r): ListRow => ({
          id: `id-${state[table].length + 1}`, created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(), saved: false, note: "", ...r,
        }));
        state[table] = [...made, ...state[table]];
        return json(made, 201);
      }
      if (req.method() === "PATCH") return route.fulfill({ status: 204, body: "" });
      return json(state[table]);
    }

    /* ---- the five the page reads whole ----

       The studio's nine, the three routine tables and `broker_tokens`
       have no module on this page: it asks for all of each,
       once, which is what an export is. They fell through to
       `[]` here until 30 August 2026, so the copy could have
       stopped carrying any of them and this file would have said
       nothing.

       `select=` IS HONOURED, and that is the point of the
       branch rather than a detail. PostgREST returns the columns
       asked for and no others; a fake that answered whole rows
       would be kinder than the database, which is this file's
       own lesson from the day its `profiles` fixture was. The
       one thing the copy narrows is the broker key, and a
       forgiving fake is what would let the ciphertext back into
       a downloaded file unnoticed. */
    if (state.others.has(table)) {
      if (req.method() === "DELETE") {
        state.others.set(table, []);
        return route.fulfill({ status: 204, body: "" });
      }
      const want = (url.searchParams.get("select") ?? "*").split(",");
      const rowsOut = (state.others.get(table) ?? []).map((row) =>
        want.includes("*") ? row
          : Object.fromEntries(Object.entries(row).filter(([k]) => want.includes(k))));
      return json(rowsOut);
    }
    return json([]);
  });

  await context.route(`${SUPA}/auth/v1/**`, (r: Route) =>
    r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));

  /* The avatar, served from here rather than from Google. The
     request still leaves as `https://lh3.googleusercontent.com`,
     so the page's policy decides whether it is made at all, which
     is the half of this worth checking. */
  await context.route("https://lh3.googleusercontent.com/**", (r: Route) =>
    r.fulfill({ status: 200, contentType: "image/png", body: PIXEL }));

  const start: [boolean, string, Record<string, string>] = [signedIn, session(ME), seed];
  await page.addInitScript(([on, who, extra]: [boolean, string, Record<string, string>]) => {
    if (on) localStorage.setItem("reiad-session", who);
    for (const [k, v] of Object.entries(extra)) localStorage.setItem(k, v);
  }, start);

  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "load" });
  await page.waitForTimeout(2200);
  return { page, context, state, errors };
}

/* ============================================================
   1. The account menu, which is a popover now
   ============================================================ */

console.log("the account menu");
{
  const { page, context, errors } = await open("/account");

  const button = page.locator(".account-btn");
  is("the button says who is signed in", await button.textContent(), "R");
  is("and says it is a menu", await button.getAttribute("aria-haspopup"), "menu");
  is("which is shut", await button.getAttribute("aria-expanded"), "false");

  await button.click();
  await page.waitForTimeout(300);

  const menu = page.locator(".acc-menu");
  ok("it opens", await menu.count() === 1);
  is("in the top layer, as a popover", await menu.getAttribute("popover"), "auto");
  is("and the button says so", await button.getAttribute("aria-expanded"), "true");
  is("it names the account", await menu.locator(".acc-who-text strong").textContent(), "Rony Reiad");
  is("six places to go", await menu.locator(".acc-item[href]").count(), 6);
  /* The menu is `aab/src/signin.ts`, which still writes the
     `.html` spelling: the browser modules were not part of task
     #28 and `_redirects` answers for it. Asserted as the module
     writes it, so this fails the day the two part company. */
  ok("including the reading list",
    (await menu.locator('.acc-item[href="/account.html#reading-list"]').count()) === 1);
  ok("and a way out", (await menu.locator(".acc-out").count()) === 1);

  /* The four behaviours that moved out of signin.js and into the
     browser when this became a popover. If any of them is not
     actually free, the trade was a bad one. */
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  is("Escape closes it", await page.locator(".acc-menu").count(), 0);
  is("and says so on the button", await button.getAttribute("aria-expanded"), "false");
  is("and gives the focus back",
    await page.evaluate(() => document.activeElement?.className.includes("account-btn")), true);

  await button.click();
  await page.waitForTimeout(300);
  await page.mouse.click(600, 700);
  await page.waitForTimeout(300);
  is("a click elsewhere closes it too", await page.locator(".acc-menu").count(), 0);

  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

console.log("\nthe menu when nobody is signed in");
{
  const { page, context, errors } = await open("/account", { signedIn: false });

  is("the button asks", await page.locator(".account-btn").textContent(), "Sign in");
  await page.locator(".account-btn").click();
  await page.waitForTimeout(300);

  ok("it offers a way in", (await page.locator(".acc-menu .signin-form").count()) === 1);
  ok("and Google", (await page.locator(".signin-google").count()) === 1);
  is("and no account destinations", await page.locator(".acc-item").count(), 0);
  ok("the page says nobody is signed in",
    await page.locator("#account-out").isVisible());
  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

/* ============================================================
   2. The page itself
   ============================================================ */

console.log("\nthe account page");
{
  const { page, context, errors } = await open("/account", {
    rows: {
      library: [
        { id: "l1", url: "/insights/dse-basics", title: "How the DSE works",
          kind: "piece", saved: true, note: "", updated_at: new Date().toISOString() },
        { id: "l2", url: "/money/basics-2/supply-demand.html", title: "চাহিদা ও জোগান",
          kind: "lesson", saved: false, note: "Read this again before the exam.",
          updated_at: new Date().toISOString() },
      ],
      targets: [
        { id: "t1", kind: "habit", subject: "week", label: "Read on 4 days a week",
          target: 4, reached: 0, unit: "days", done_at: null,
          created_at: new Date().toISOString() },
        /* `target: 0` is what the form saves for a course: the
           denominator is the ladder rather than a number somebody
           typed, and it has to still be the ladder here. */
        { id: "t2", kind: "course", subject: "money", label: "Finish Money",
          target: 0, reached: 0, unit: "chapters", done_at: null,
          created_at: new Date().toISOString() },
      ],
      scenarios: [{ id: "s1", tool: "stock", name: "Square Pharma",
        inputs: { query: "price=210" }, summary: "71.4 · Buy",
        updated_at: new Date().toISOString() }],
    },
  });

  ok("it greets the reader",
    (await page.locator("#account-hello").textContent())?.includes("Rony Reiad"));

  /* ---- the picture a Google sign-in brings with it ----

     Three facts, and the third is the one worth a browser: the
     tag is there, the letter is still under it, and the image
     actually LOADED. `img-src` in `_headers` had to be widened
     for this one host, and a policy that refuses it leaves an
     `<img>` in the DOM with `naturalWidth` of 0 and nothing in
     the console a test reads. */
  const faceImg = page.locator("#account-face img");
  is("the account's face carries the picture", await faceImg.count(), 1);
  is("and it is the one the session names", await faceImg.getAttribute("src"), AVATAR);
  ok("and the browser was allowed to fetch it",
    await faceImg.evaluate((el: HTMLImageElement) => el.naturalWidth > 0));
  ok("the initial is still under it, for a picture that will not load",
    (await page.locator("#account-face").textContent())?.trim() === "R");
  is("and the host is not told which page it is on",
    await faceImg.getAttribute("referrerpolicy"), "no-referrer");
  /* By id and by role rather than by class. Every section here
     already needs an id, because the account menu in the header
     links straight into them by fragment. A class hook would be a
     third name for a thing that has two. */
  /* Named, not counted. This asserted 8 and the page has held 9
     since the routine became a section in #168: three checks red
     on main for as long as that, saying "got 9, want 8", which is
     a number that was right on the day it was typed. What is
     actually load bearing is that the strip and the panels are
     the SAME set, because the account menu in the header links
     into them by fragment and a section with no tab is a section
     nothing can reach. */
  const SECTIONS = [
    "you", "ladders", "reading-list", "notes", "targets",
    "routine", "scenarios", "preferences", "data",
  ];
  const panelIds = await page.locator("#account-in section[id]")
    .evaluateAll((els: Element[]) => els.map((el) => el.id));
  is("every section is there, and no more", panelIds.sort().join(","),
    [...SECTIONS].sort().join(","));
  is("and the strip offers one tab each",
    await page.getByRole("tablist", { name: "This page" }).getByRole("tab").count(),
    SECTIONS.length);
  /* `role="tablist"` is only true while something is hiding the
     other panels, which is the argument at the top of
     `components/ui/tabs.tsx`. This is what says it is true. */
  is("one panel on screen",
    await page.locator('[role="tabpanel"]:not([hidden])').count(), 1);
  is("and the rest are not", await page.locator('[role="tabpanel"][hidden]').count(),
    SECTIONS.length - 1);
  is("four numbers above the fold", await page.locator(".acct-tile").count(), 4);

  /* The tiles and the greeting are above the strip and belong to
     no panel: they are who you are, not a section of the page. */
  ok("the tiles are not inside a panel",
    await page.locator('[role="tabpanel"] .acct-tile').count() === 0);

  /* A year of days, drawn from `days-active`. 53 weeks of seven
     is the grid; what matters is that the days in the account are
     the ones filled in. */
  const cells = await page.locator(".heat-cell[data-on]").count();
  ok("the year shows the days that had something on them", cells === DAYS.length,
    `${cells} filled, ${DAYS.length} in the account`);
  ok("and says how the week went",
    (await page.locator("#account-week").textContent())?.includes("of the last seven days"));

  await page.getByRole("tab", { name: "Courses" }).click();
  await page.waitForTimeout(250);

  /* The ladders. The denominator comes down from the ROUTE, out
     of `next/lib/school-ladders.ts`, and the ticks are read here,
     which is the rule `next/lib/progress.ts` states. Until 18
     August 2026 this section imported all four schools'
     `curriculum.js` in the browser to find the denominator. */
  ok("every course has a bar", (await page.locator(".ladder-row .meter").count()) === 4);
  ok("and the money school is not at nought",
    (await page.locator(".ladder-row").first().locator(".ladder-pct").textContent()) !== "0%");

  const money = page.locator(".ladder-row").first();

  /* The account holds two money ticks, `share` and `dse`, and the
     school's key is `learn-read` rather than `money-read`: the
     school moved to /money/ and the key deliberately did not. A
     bar reading "0 of ..." here is that rename having happened by
     accident, and it loses somebody a year of ticks. */
  /* Checkpoints are localStorage too, and the clause beside the
     count is drawn from them: same key, same mirror, same race. */
  ok("and names the checkpoints ticked inside them",
    (await money.locator(".ladder-line").first().textContent())
      ?.includes("2 checkpoints ticked in 1 lesson"),
    await money.locator(".ladder-line").first().textContent());

  is("the money bar counts the ticks the account holds",
    (await money.locator(".ladder-line").first().textContent())?.split(" of ")[0], "2");
  ok("out of the whole ladder, which the route counted",
    Number((await money.locator(".ladder-line").first().textContent())?.match(/of (\d+)/)?.[1]) > 50);

  /* It is followed, so it sorts first, and the resume card knows
     it has been started. */
  is("a started school says carry on rather than start",
    await money.locator(".ladder-go .mono").textContent(), "Carry on");
  ok("and points at a lesson that has not been ticked",
    !["/money/terms/share.html", "/money/terms/dse.html"]
      .includes(await money.locator(".ladder-go").getAttribute("href") ?? ""),
    await money.locator(".ladder-go").getAttribute("href"));

  /* A school nobody has opened is quieter, and says so rather
     than being dressed as a failure. */
  const untouched = page.locator(".ladder-row:not([data-started])");
  ok("a school never opened is not marked started", (await untouched.count()) === 3);
  is("and its card says Start", await untouched.first().locator(".ladder-go .mono").textContent(),
    "Start");

  /* Each row wears its own school's colour, from the one table
     the menu comes from. */
  is("every bar wears its school's own accent",
    await page.locator(".ladder-row").evaluateAll((rows: HTMLElement[]) =>
      [...new Set(rows.map((r) => r.style.getPropertyValue("--accent")))].length), 4);

  await page.getByRole("tab", { name: "Reading list" }).click();
  await page.waitForTimeout(200);
  is("the reading list holds what was kept",
    await page.locator("#account-kept-list .kept-row").count(), 1);
  is("and names it",
    await page.locator("#account-kept-list .kept-body h3 a").textContent(),
    "How the DSE works");
  await page.getByRole("tab", { name: "Notes" }).click();
  await page.waitForTimeout(200);
  is("the notes hold what was written",
    await page.locator("#account-notes .kept-row").count(), 1);
  is("as typed, and not as markup",
    await page.locator("#account-notes .kept-note").textContent(),
    "Read this again before the exam.");

  await page.getByRole("tab", { name: "Targets" }).click();
  await page.waitForTimeout(200);
  is("both targets are drawn", await page.locator(".target").count(), 2);
  /* A habit reads `days-active`; a course reads the reader's own
     ticks against the ladder the route handed down. Neither is a
     number anybody typed, which is the test a fourth kind would
     have to pass. */
  /* Not zero, which is the whole check. `days-active` is a synced
     key, so a habit read once on mount is measured against
     whatever this device held BEFORE the account's rows landed:
     "0 of 4 days this week" for somebody who was here on ten of
     the last fourteen. It looks like an honest number. */
  ok("a habit target counts the days the account holds",
    /^[1-9]\d* of 4 days this week/.test(
      (await page.locator(".target").first().locator(".target-line").textContent()) ?? ""),
    await page.locator(".target").first().locator(".target-line").textContent());
  ok("a course target counts chapters against the whole ladder",
    /^2 of \d\d+ chapters$/.test(
      (await page.locator(".target").nth(1).locator(".target-line").textContent()) ?? ""),
    await page.locator(".target").nth(1).locator(".target-line").textContent());

  await page.getByRole("tab", { name: "Scenarios" }).click();
  await page.waitForTimeout(200);
  is("the scenario is listed", await page.locator(".saved-row").count(), 1);

  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

/* ============================================================
   3. Reading preferences, which have to act on the page at once
   ============================================================ */

console.log("\nreading preferences");
{
  const { page, context, errors } = await open("/account");

  await page.getByRole("tab", { name: "Preferences" }).click();
  await page.waitForTimeout(200);
  /* The list rather than the count, so a row that arrives says
     which one it is instead of moving a number. */
  is("every row is labelled, and these are the rows",
    await page.locator("#account-prefs .pref-label").allTextContents(),
    ["Type size", "Line width", "Theme", "Calculators open in",
    "Calculators open with",
     "Finish", "Texture", "Blur", "Transparency", "Sound",
     "Your place", "Weather"]);
  is("normal is the one chosen",
    await page.locator('.pref-chips .pref-chip[data-on] strong').first().textContent(),
    "Normal");

  const scaleNow = () => page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--read-scale").trim());

  /** One field of the stored preferences. Read out of the browser
      as text and narrowed here, because a function handed to
      `page.evaluate` is serialised and cannot close over one. */
  const stored = async (field: string): Promise<unknown> => {
    const raw = await page.evaluate(() => localStorage.getItem("reader-prefs"));
    const prefs: unknown = raw === null ? null : JSON.parse(raw);
    return isObject(prefs) ? prefs[field] : undefined;
  };

  await page.getByRole("button", { name: /Comfortable/ }).click();
  await page.waitForTimeout(300);

  is("pressing Comfortable moves the type", await scaleNow(), "1.12");
  is("and is remembered", await stored("text"), "large");

  await page.getByRole("button", { name: /Narrow/ }).click();
  await page.waitForTimeout(300);
  is("and the measure with it", await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--read-wide").trim()), "0.85");

  /* The language chip writes the key the calculators have read
     since long before there were accounts. One choice, one key. */
  await page.getByRole("button", { name: /English/ }).click();
  await page.waitForTimeout(300);
  is("the language chip writes the tools' own key",
    await page.evaluate(() => localStorage.getItem("tool-lang")), "en");

  /* ---- what the glass is made of ----

     Three settings under one heading, and the reason they are
     checked here rather than in `interactive.test.ts` is the
     same reason the four above are: the markup is right whether
     or not a press reaches `<html>`, and `<html>` is the whole
     mechanism. `data-glass` names the material and the two custom
     properties are what every radius and every tint is derived
     from, so a chip that writes storage and not those three is a
     chip that changes nothing until the next load.

     SCOPED TO THE ROW, not to the panel.

     It was scoped to the panel, which was enough while there were
     three finishes and every option in it had a different first
     word. There are twelve now and "Deep flute" is one of them,
     so `{ name: /Deep/ }` matched a finish and a blur and the
     test died on a strict-mode violation rather than on anything
     being wrong. Naming the row is what makes that impossible
     again: every one of these rows is a `role="group"` with its
     own label, because a group of chips that changes one setting
     is one control. */
  const prefs = page.locator("#account-prefs");
  /** One row of the appearance panel, by the label it announces
      itself with. */
  const row = (label: string) =>
    prefs.locator(`[role=group][aria-label="${label}"]`);
  const onHtml = (name: string) => page.evaluate(
    (n: string) => document.documentElement.getAttribute(n), name);
  const propNow = (name: string) => page.evaluate(
    (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);

  is("the glass has its own heading",
    await page.locator("#prefs-glass").textContent(), "What the glass is made of");
  is("frost is what a reader starts on", await onHtml("data-glass"), "frost");

  await row("Finish").getByRole("button", { name: /Paper/ }).click();
  await page.waitForTimeout(300);
  is("pressing Paper changes the material", await onHtml("data-glass"), "paper");
  is("and the material is remembered", await stored("glass"), "paper");

  /* One of the nine cast patterns, because three finishes was the
     whole of what this ever pressed and the nine are the reason
     the row is a shelf rather than a line of chips. */
  await row("Finish").getByRole("button", { name: /Deep flute/ }).click();
  await page.waitForTimeout(300);
  is("a cast pattern is chosen the same way", await onHtml("data-glass"), "deep-flute");
  is("and it is remembered", await stored("glass"), "deep-flute");

  await row("Blur").getByRole("button", { name: /Deep/ }).click();
  await page.waitForTimeout(300);
  is("pressing Deep moves every blur at once", await propNow("--glass-amount"), "1.7");
  is("and the blur is remembered", await stored("blur"), "deep");

  /* The fourth knob. It rode on `--depth` for one draft and
     resolved to the same number on every surface, so what is
     asserted here is the property the stylesheet actually reads
     rather than the storage key, which was right either way. */
  await row("Texture").getByRole("button", { name: /Strong/ }).click();
  await page.waitForTimeout(300);
  is("pressing Strong deepens the pattern", await propNow("--tex-strength"), "1.6");
  is("and the strength is remembered", await stored("texture"), "strong");

  await row("Transparency").getByRole("button", { name: /Clear/ }).click();
  await page.waitForTimeout(300);
  is("pressing Clear thins the tint", await propNow("--glass-veil"), "0.54");
  is("and the tint is remembered", await stored("veil"), "clear");

  /* AND EVERY OPTION DRAWS ITSELF. A row of chips reading "Frost",
     "Paper", "Thin reed" is a reader imagining eleven materials
     from their names; the swatch is the whole point of the panel
     and it is made of the same tokens the site is, so a swatch
     that renders empty is a preview that lies. */
  is("every finish carries a picture of itself",
    await row("Finish").locator(".pref-chip > .pref-swatch").count(), 12);
  is("and the picture is the material rather than a colour",
    await row("Finish").locator('.pref-swatch-face[data-finish="aquatex"]').count(), 1);
  const grained = await page.evaluate(() => {
    const el = document.querySelector('.pref-swatch-face[data-finish="callisto"]');
    return el ? getComputedStyle(el).backgroundImage.slice(0, 40) : "missing";
  });
  /* `ok` rather than `is`, so the message can say what the value
     was AND why it matters: `@layer glow` sets
     `--glass-grain: none` on every descendant of a surface, and
     a chip is a surface, so a swatch inside one paints nothing
     unless that rule makes an exception for it. */
  ok("and it really paints a grain, inside a chip that is a surface",
    grained.startsWith("repeating-radial-gradient"),
    `got ${grained}`);

  /* Plain is a finish with its own solid grounds rather than the
     other two switched off, so it is chosen the same way and the
     panel says which one is on. */
  await row("Finish").getByRole("button", { name: /Plain/ }).click();
  await page.waitForTimeout(300);
  is("Plain is chosen like any other finish", await onHtml("data-glass"), "plain");
  is("and the Finish row says so",
    await row("Finish").locator(".pref-chip[data-on] strong").textContent(),
    "Plain");

  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

/* ============================================================
   4. Adding a target, and taking a copy of everything
   ============================================================ */

console.log("\nadding a target");
{
  const { page, context, state, errors } = await open("/account");

  await page.getByRole("tab", { name: "Targets" }).click();
  await page.waitForTimeout(200);
  await page.locator("#target-more summary").click();
  await page.getByLabel("Turn up n days a week").check();
  await page.waitForTimeout(200);
  await page.fill("#target-number", "5");
  await page.locator("#target-form button[type=submit]").click();
  await page.waitForTimeout(900);

  const sent = state.sent.find((s) => s.table === "targets" && s.method === "POST");
  ok("it was sent to the account", Boolean(sent));
  const row = asRows(sent?.body)[0] ?? {};
  is("as a habit", row.kind, "habit");
  is("with the number on it", row.target, 5);
  is("and a sentence a person would write", row.label, "Read on 5 days a week");
  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

/* ============================================================
   4a. The strip, which is what makes `role="tablist"` true

   A section per screen of scrolling became one on screen. There
   were eight when this was written and there are nine, which is
   why nothing here counts them. The four decisions that took, from
   `components/ui/tab-panels.tsx`, are the four checked here: the
   fragment chooses, the address follows, a link from elsewhere on
   the site opens the panel rather than scrolling to it, and the
   arrows move within the strip.
   ============================================================ */

console.log("\nthe strip, and what it switches");
{
  const { page, context, errors } = await open("/account#notes");

  /* A deep link is the case this has to get right: the account
     menu in the header links straight to `#reading-list` and
     `#data`, and before the strip switched anything those were
     scroll targets on one long page. */
  is("a link straight to a section opens that panel",
    await page.locator('[role="tabpanel"]:not([hidden])').getAttribute("id"), "panel-notes");
  is("and the strip says which", await page.locator('[role="tab"][aria-selected="true"]')
    .textContent(), "Notes");

  /* The section keeps its own id, because that is what the menu
     links to and what `:target` answers, and the panel wrapper
     carries its own: two elements cannot share one. */
  is("the section inside still owns the fragment",
    await page.locator("#panel-notes section").getAttribute("id"), "notes");

  await page.getByRole("tab", { name: "Scenarios" }).click();
  await page.waitForTimeout(250);
  is("pressing one shows it",
    await page.locator('[role="tabpanel"]:not([hidden])').getAttribute("id"), "panel-scenarios");
  is("and the address carries which, so it can be shared",
    await page.evaluate(() => location.hash), "#scenarios");
  is("still one panel on screen",
    await page.locator('[role="tabpanel"]:not([hidden])').count(), 1);

  /* replaceState, never a hash assignment: assigning would push an
     entry per press, so Back would walk the strip instead of
     leaving the page, and it would scroll the panel under the
     sticky bar every time. */
  const before = await page.evaluate(() => history.length);
  for (const name of ["Targets", "Notes", "Courses"]) {
    await page.getByRole("tab", { name }).click();
    await page.waitForTimeout(120);
  }
  is("without piling up history", await page.evaluate(() => history.length), before);

  /* One tab stop for the whole strip, and the arrows move within
     it. That is what a tablist owes a keyboard. */
  await page.locator('[role="tab"][aria-selected="true"]').press("ArrowRight");
  await page.waitForTimeout(250);
  is("an arrow moves to the next", await page.locator('[role="tab"][aria-selected="true"]')
    .textContent(), "Reading list");
  await page.locator('[role="tab"][aria-selected="true"]').press("Home");
  await page.waitForTimeout(250);
  is("and Home goes back to the first",
    await page.locator('[role="tab"][aria-selected="true"]').textContent(), "Overview");
  is("only the chosen tab is a tab stop",
    await page.locator('[role="tab"][tabindex="0"]').count(), 1);

  /* The identity above the strip belongs to no panel: who you are
     is not a section of the page. */
  ok("the greeting stays whichever panel is open",
    await page.locator("#account-hello").isVisible());
  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

/* ============================================================
   4b. The three settings questions, and the two framings

   One form serves setup and settings, decided by whether the
   profile carries a `setup_at`. Two forms would be two save
   handlers and two places for a label to drift, and this is what
   says the one form really does both.
   ============================================================ */

console.log("\nsetting the account up, then changing it");
{
  const { page, context, state, errors } = await open("/account", {
    rows: {
      profile: { display_name: "", following: [], pace: "", setup_at: null },
      progress: { "learn-read": ["share"] },
    },
  });

  await page.getByRole("tab", { name: "Preferences" }).click();
  await page.waitForTimeout(200);

  /* THE READ NAMES THE READER. Everything below this line reads
     the reader's own answers back, and every one of them passed
     for a fortnight against a profile that was somebody else's,
     because the fixture answered any GET with the right row and
     the real database does not. Said out loud and first, so that
     a missing filter fails as itself rather than as eleven
     confusing assertions about a name. */
  const asked = state.reads.filter((u) => u.includes("/profiles?"));
  ok("the profile is read at all", asked.length > 0);
  ok("and every read of it names the reader",
    asked.every((u) => u.includes(`id=eq.${ME}`)),
    asked.find((u) => !u.includes(`id=eq.${ME}`)) ?? "");

  is("a reader who has never answered is asked",
    await page.locator("#settings-label").textContent(), "Set up your account");
  ok("and is offered a way out of being asked",
    await page.getByRole("button", { name: "Not now" }).isVisible());

  /* Started is not the same as followed, and the box says which.
     A course with ticks in it arrives ticked, because a reader who
     has read a lesson of it has answered this question already. */
  ok("a course already started arrives ticked",
    await page.locator("#course-money").isChecked());
  is("and says why", await page.locator('label[for="course-money"] small').textContent(),
    "you have already started this");
  ok("a course never opened does not", !await page.locator("#course-quran").isChecked());

  /* Four boxes, not five. `COURSES` in content.js held the money
     school twice until 18 August 2026, once by hand under a name
     it stopped using when it moved to /money/, so this rendered
     two checkboxes carrying one id. */
  is("one box per school with a ladder",
    await page.locator("#account-courses input").count(), 4);

  await page.locator('label[for="course-deutsch"]').click();
  await page.locator('label[for="pace-often"]').click();
  await page.fill("#account-name", "Rony");
  await page.locator("#settings-form button[type=submit]").click();
  await page.waitForTimeout(700);

  const sent = state.sent.find((x) => x.table === "profiles" && x.method === "PATCH");
  ok("the answers reach the account", Boolean(sent));
  const body = sent?.body;
  const patch: Record<string, unknown> = isObject(body) ? body : {};
  is("the name", patch.display_name, "Rony");
  is("the pace", patch.pace, "often");
  /* Union, not replacement: the school they follow and the school
     they have already started, both. */
  const following = patch.following;
  is("and both courses",
    (Array.isArray(following) ? following.filter((c): c is string => typeof c === "string") : [])
      .sort(),
    ["deutsch", "money"]);
  ok("answered, so it stops asking", Boolean(patch.setup_at));

  is("and the form reframes at once, without a reload",
    await page.locator("#settings-label").textContent(), "Your settings");
  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

/* ============================================================
   4c. Erasing everything, which has to empty the page too

   `forgetOnAccount()` clears the mirror, and until 19 August 2026
   `clearMirror()` fired the school events and not `sync:done`.
   Every React meter on this page is behind `subscribe()` in
   `next/lib/progress.ts`, which hears the second, so the numbers
   of the account that had just been erased stayed on screen.
   ============================================================ */

console.log("\nerasing everything");
{
  const { page, context, state, errors } = await open("/account", {
    rows: {
      targets: [{ id: "t1", kind: "habit", subject: "week", label: "Read on 4 days a week",
        target: 4, reached: 0, unit: "days", done_at: null,
        created_at: new Date().toISOString() }],
    },
  });

  ok("there is something to erase", (await page.locator(".acct-tile strong").first()
    .textContent()) !== "0");
  is("and a target", await page.locator(".target").count(), 1);

  await page.getByRole("tab", { name: "Your data" }).click();
  await page.waitForTimeout(200);
  page.on("dialog", (d: Dialog) => d.accept());
  await page.locator("#account-forget").click();
  await page.waitForTimeout(1400);

  ok("it says so", (await page.locator("#exit-note").textContent())?.startsWith("Erased"),
    await page.locator("#exit-note").textContent());
  is("the chapters read go back to nothing",
    await page.locator(".acct-tile strong").first().textContent(), "0");
  await page.getByRole("tab", { name: "Overview" }).click();
  await page.waitForTimeout(200);
  /* At most today, and today is not a leak: `streak.js` marks the
     day on the first interaction with the page, and the click that
     erased everything is one. Being here now is not something an
     erase can undo. */
  ok("the year is emptied down to today",
    (await page.locator(".heat-cell[data-on]").count()) <= 1,
    String(await page.locator(".heat-cell[data-on]").count()));
  is("nothing is listed as kept",
    await page.locator("#data .cell").count(), 0);
  is("and the targets are gone", await page.locator(".target").count(), 0);

  /* ---- the five nothing on this page draws ----

     There is no element to count for these, which is exactly why
     they were left behind: the only evidence an erase reached
     them is the request. All five reported success without ever
     being asked for until 30 August 2026. */
  for (const table of [
    ...RESEARCH_TABLES, "routines", "routine_entries", "routine_templates", "broker_tokens",
  ]) {
    ok(`${table} was erased too`,
      state.sent.some((x) => x.table === table && x.method === "DELETE"),
      state.sent.filter((x) => x.method === "DELETE").map((x) => x.table).join(", "));
  }
  ok("and the account really is empty of them",
    [...state.others.values()].every((list) => list.length === 0));
  ok("and the reading room's files went too, through the Worker, after the rows",
    filesErased === 1, `${filesErased} call(s)`);

  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

console.log("\ntaking a copy of everything");
{
  const { page, context, errors } = await open("/account", {
    rows: {
      library: [{ id: "l1", url: "/insights/x", title: "X", kind: "piece",
        saved: true, note: "", updated_at: new Date().toISOString() }],
    },
  });

  await page.getByRole("tab", { name: "Your data" }).click();
  await page.waitForTimeout(400);

  /* WHAT THIS BROWSER IS HOLDING, drawn from `shared/storage.ts`
     rather than written out on the page. The panel above it
     counts what the reader has done per school; this is the list
     that had no answer anywhere, which is what ALL of it is and
     which parts leave the machine.

     Asserted by its words rather than by a count, because the
     count is the point: it grows on its own when a key is added
     anywhere on the site, and a test that pinned it would have to
     be edited by whoever adds one. */
  const held = await page.locator(".held").innerText();
  ok("the data panel says what this browser is holding",
    held.includes("What you have done"), held.slice(0, 120));
  ok("in a reader's words rather than in key names",
    held.includes("lessons you have ticked") && !held.includes("learn-read"),
    held.slice(0, 200));
  ok("and marks what travels to the account",
    (await page.locator(".held-mark").count()) > 0);

  const download = page.waitForEvent("download", { timeout: 10000 });
  await page.locator("#account-export").click();
  const file = await download;

  ok("it downloads a file", Boolean(file));
  ok("named for the day it was taken", /^reiad-library-\d{4}-\d{2}-\d{2}\.json$/.test(file.suggestedFilename()),
    file.suggestedFilename());

  const stream = await file.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  /* Narrowed rather than trusted: the whole claim of this block is
     that the file holds five things, so reading it as a shape
     already agreed on would be checking the shape and not the
     file. */
  const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString());
  const took: Record<string, unknown> = isObject(parsed) ? parsed : {};

  ok("it holds the progress",
    isObject(took.progress) && Array.isArray(took.progress["learn-read"]));
  ok("the reading list", Array.isArray(took.library) && took.library.length === 1);
  ok("the profile", isObject(took.profile) && took.profile.display_name === "Rony Reiad");
  ok("and says what it is", typeof took.what === "string" && took.what.length > 10);

  /* ---- and the five that nothing on this page draws ----

     Every one of these was in neither this file nor the button
     until 30 August 2026: the copy downloaded, reported success,
     and carried five sixths of an account.
     `scripts/check-account.ts` reads the migrations and fails on
     a table nothing carries; this is the other half of that,
     which is whether the file it actually writes holds one. */
  for (const [table, what] of [
    ["research_projects", "the studio's projects"],
    ["research_collections", "its collections"],
    ["research_sources", "its library"],
    ["research_notes", "its notes"],
    ["research_versions", "the versions of them"],
    ["research_questions", "its questions, the old desk's threads among them"],
    ["research_tasks", "its tasks"],
    ["research_lists", "its lists"],
    ["research_activity", "everything that happened in it"],
    ["research_highlights", "every highlight made in the reader"],
    ["research_searches", "every search worth keeping, which is the search log"],
    ["research_documents", "every chapter, paper and proposal on the writing desk"],
    ["research_events", "every deadline, meeting and submission"],
    ["research_sessions", "the time log"],
    ["research_people", "the supervisors, authors and examiners"],
    ["research_reviews", "every review's protocol"],
    ["research_review_records", "every record screened for one"],
    ["research_datasets", "a dataset in the lab"],
    ["research_transforms", "a transform kept as SQL"],
    ["research_runs", "a run, which is every result"],
    ["routines", "the shape of the week"],
    ["routine_entries", "every day marked on it"],
    ["routine_templates", "the templates this reader made"],
  ] as const) {
    const held = took[table];
    ok(`it holds ${what}`, Array.isArray(held) && held.length === 1,
      JSON.stringify(held));
  }

  /* THE BROKER KEY, AND WHAT IT LEAVES BEHIND. The row is useful:
     which broker, what it was called, live or demo. `cipher` is
     AES-GCM under a Worker secret, so it is bytes nobody holding
     the file can open, and a credential in a downloaded file is
     one more place it exists. */
  const keys = Array.isArray(took.broker_tokens) ? took.broker_tokens : [];
  ok("it holds the broker key's row", keys.length === 1);
  ok("with what a person would want off it",
    isObject(keys[0]) && keys[0].label === "Main" && keys[0].env === "live");
  ok("AND NOT THE SEALED KEY ITSELF",
    isObject(keys[0]) && !("cipher" in keys[0]),
    JSON.stringify(keys[0]));
  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

await browser.close();
server.close();

if (failures.length) {
  console.log(`\n${failures.length} failure(s):`);
  failures.forEach((f) => console.log(`  ${f}`));
  process.exit(1);
}
console.log(`\naccount: ${passed} checks, everything an account holds is drawn, `
  + `written and taken away again.`);
