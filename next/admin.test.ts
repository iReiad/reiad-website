#!/usr/bin/env node
/* ============================================================
   next/admin.test.ts: /admin in a real browser.

     cd next && npx next build
     node next/admin.test.ts

   `scripts/admin.test.ts` asserts what the SOURCE says. This
   drives the page, and the two catch different things: a panel
   that renders perfectly and does nothing looks exactly like one
   that works, which is the failure
   `archive/desk-react/desk.test.ts` was written for and what this
   file inherited when the desk retired.

   ---- the one rule this exists to hold ----

   ADMIN.md §1, second rule: **a panel missing its credential says
   so, and never draws as an empty one.** An empty list where a
   credential is missing looks identical to a working panel with
   nothing in it, and the day it is wrong is the day somebody
   deletes a queue believing it is clear.

   So the first pass answers 401 to everything and reads what each
   panel says. The second answers rows and reads what it does with
   them. The third presses the buttons.

   ---- what it fakes, and what it does not ----

   Every `/api/*` answer is a fixture: there is no D1 here, no
   Supabase and no session, and a test that needed all three would
   be a test that runs nowhere. The PAGE is real: the built
   prerender, the real stylesheet, the real components, hydrating
   the way it hydrates on the site.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Page, Route } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, ".next");
const AAB = join(HERE, "..", "aab");
const PORT = 8913;

let passed = 0;
const failures: string[] = [];
const ok = (name: string, condition: unknown, detail: string | null = ""): void => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}: ${detail}` : name);
};

const skip: (why: string) => never = (why) => {
  console.log(`admin: SKIPPED, ${why}`);
  process.exit(0);
};

const exists = (path: string): Promise<boolean> => stat(path).then(() => true, () => false);

if (!await exists(join(BUILD, "server/app/admin.html"))) {
  skip("next/.next holds no prerendered /admin. Run `npx next build` in next/ first.");
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

const server = createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname;
  const file = path === "/admin"
    ? join(BUILD, "server/app/admin.html")
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

/* ---- the fixtures ---- */

const PIECES = [
  { slug: "a-live-piece", title: "A live piece", dek: "", tag: "Markets",
    topics: ["Equities"], lang: "en", minutes: 4, status: "live", section: "insights",
    cover: "/media/card-a-live-piece.jpg", published_at: "2026-08-01",
    updated_at: "2026-08-10", embedded: 0 },
  { slug: "onions", title: "The onion piece", dek: "", tag: "", topics: [],
    lang: "bn", minutes: 3, status: "live", section: "cooking",
    cover: "/media/photo-onions.webp", published_at: "2026-07-01",
    updated_at: "2026-07-02", embedded: 0 },
  { slug: "a-draft", title: "Not finished", dek: "", tag: "", topics: [],
    lang: "en", minutes: 1, status: "draft", section: "insights", cover: "",
    published_at: null, updated_at: "2026-08-19", embedded: 1 },
];

/* Two, and the second is a REPLY. A fixture of one top-level
   comment cannot prove that a reply says it is one, and the
   assertion would pass on a panel that had lost the word. */
const COMMENTS = [
  { id: 1, slug: "a-live-piece", section: "insights", parent_id: null,
    author_id: "u1", author_name: "Ayesha", body: "Useful, thank you.",
    status: "pending", created_at: "2026-08-18", approved_at: null },
  { id: 2, slug: "a-live-piece", section: "insights", parent_id: 1,
    author_id: "u2", author_name: "Karim", body: "Agreed.",
    status: "pending", created_at: "2026-08-18", approved_at: null },
];

/* The second asker left no name and no address, which is the
   normal case for a question asked from a phone: the panel has to
   name them as anonymous and offer no mailto rather than a broken
   one. */
const QUESTIONS = [
  { id: 7, slug: "a-live-piece", name: "Rahim", email: "r@example.com",
    body: "কত টাকা লাগবে?", answer: null, status: "pending",
    created_at: "2026-08-17", answered_at: null },
  { id: 8, slug: null, name: "", email: null,
    body: "Is the stock check free?", answer: null, status: "pending",
    created_at: "2026-08-15", answered_at: null },
];

/* One new and one closed, so the two directions of the status
   are both drawn: a new one can be closed and a closed one can be
   reopened. */
const ENQUIRIES = [
  { id: 3, name: "A client", email: "client@example.com", kind: "project",
    message: "Can you model this?", status: "new", notes: "", created_at: "2026-08-16" },
  { id: 4, name: "Somebody else", email: "old@example.com", kind: "general",
    message: "Answered a while ago.", status: "closed", notes: "dealt with",
    created_at: "2026-06-01" },
];

const SUBSCRIBERS = {
  subscribers: [
    { email: "one@example.com", status: "confirmed", lang: "bn", source: "/insights",
      created_at: "2026-06-01", confirmed_at: "2026-06-01" },
    { email: "two@example.com", status: "pending", lang: "en", source: "/",
      created_at: "2026-08-01", confirmed_at: null },
  ],
  counts: { total: 2, confirmed: 1, pending: 1 },
};

/* One key nothing points at and one that something does, plus the
   snapshots that share the bucket and are counted apart. The shape
   is `GET /api/media/usage`, which does the join in the Worker. */
const MEDIA_USAGE = {
  media: [
    { key: "a-piece/1111222233334444.webp",
      url: "/media/a-piece/1111222233334444.webp",
      size: 900_000, uploaded: "2026-07-01T00:00:00.000Z",
      refs: 0, where: [], removable: true },
    { key: "a-piece/aaaabbbbccccdddd.webp",
      url: "/media/a-piece/aaaabbbbccccdddd.webp",
      size: 40_000, uploaded: "2026-08-10T00:00:00.000Z",
      refs: 1, where: ["insights/a-live-piece"], removable: true },
  ],
  listed: 2, count: 2, bytes: 940_000,
  unreferenced: 1, unreferencedBytes: 900_000,
  snapshots: { count: 3, bytes: 3_000_000 },
  scanned: { articles: 3, versions: 1, lessons: 94 },
  truncated: false,
};

/* A live stage with a lesson nobody has written, a `soon` stage
   with none of them written, a row no section declares, and one
   link of each of the three kinds. */
const SCHOOLS_AUDIT = {
  schools: [
    {
      school: "money", total: 3, written: 1,
      stages: [
        { slug: "basics-1", title: "প্রথম ধাপ", status: "live", url: "/money/basics-1",
          total: 2, written: 1, empty: [{ slug: "share", title: "শেয়ার" }] },
        { slug: "advanced", title: "গবেষণা", status: "soon", url: "/money/advanced",
          total: 1, written: 0, empty: [{ slug: "asset-pricing", title: "Asset pricing" }] },
      ],
    },
  ],
  undeclared: [
    { school: "money", stage: "basics-1", slug: "stray", why: 'no section "old" in that stage' },
  ],
  undeclaredCount: 1,
  links: {
    checked: 4, alive: 1,
    dead: [{ school: "money", stage: "basics-1", slug: "share",
      href: "/money/basics-9/gone.html", to: "/money/basics-9/gone.html" }],
    deadCount: 1,
    redirected: [{ school: "money", stage: "basics-1", slug: "share",
      href: "/money/index.html", to: "/money/index.html" }],
    redirectedCount: 1,
    elsewhere: [{ school: "money", stage: "basics-1", slug: "share",
      href: "/tools/index.html#compounding", to: "/tools/index.html" }],
    elsewhereCount: 1,
  },
};

/* What `/api/signals/stats?days=` answers: a path, a day and a
   number, which is the whole record behind that endpoint.

   Four paths on purpose, and each is a different way of being
   named. `/portfolio` and `/tools/stock` are known to
   `shared/content.ts` and to nothing else; `/insights/a-live-piece.html`
   is a row, so only `/api/articles` can name it; `/nothing/here` is
   known to neither and has to be printed as it is. */
const VIEWS = [
  { path: "/portfolio", views: 400 },
  { path: "/tools/stock", views: 300 },
  { path: "/insights/a-live-piece.html", views: 200 },
  { path: "/nothing/here", views: 5 },
];

/* A gap on purpose. Nothing was read on the 12th or the 13th, and
   those are noughts rather than two days the line is drawn
   straight across. */
const DAILY = [
  { day: "2026-08-11", views: 120 },
  { day: "2026-08-14", views: 512 },
  { day: "2026-08-15", views: 300 },
];

/* No date column, which is why the panel says this list is all
   time rather than letting it read as the window's. */
const REACTIONS = [{ slug: "a-live-piece", kind: "helpful", count: 12 }];

/** The window is read off the query rather than ignored: three
    buttons that redraw the same figures look exactly like three
    that work. */
const stats = (days: string): Record<string, unknown> => ({
  days: Number(days),
  since: days === "7" ? "2026-08-08" : days === "90" ? "2026-05-17" : "2026-07-16",
  total: days === "7" ? 812 : 1234,
  top: VIEWS,
  daily: DAILY,
  reactions: REACTIONS,
});

const BACKUP_STATUS = {
  r2: true,
  snapshots: [
    { key: "backups/2026-08-20.json", bytes: 1_200_000, at: "2026-08-20T03:17:00.000Z" },
    { key: "backups/2026-08-19.json", bytes: 1_100_000, at: "2026-08-19T03:17:00.000Z" },
  ],
};

/** Every write the page made, so a check can say a button did
    something rather than that it looked pressable. */
interface Sent { method: string; url: string; body: unknown }

/**
 * One load of /admin, with the API answering however this pass
 * wants it to.
 *
 * `signedIn` is the passphrase half: `/api/auth/me` is what the
 * shell asks. `admin` is the account half, which the shell reads
 * off `/api/routine/templates` rather than keeping a second list.
 */
async function open(
  { signedIn, admin, nonsense = false }:
  { signedIn: boolean; admin: boolean; nonsense?: boolean },
): Promise<{ page: Page; errors: string[]; sent: Sent[]; asked: string[] }> {
  const page = await browser.newPage();
  const errors: string[] = [];
  const sent: Sent[] = [];
  /* Every GET the page made, so a check can say a search box
     reached the ENDPOINT rather than filtered what was already in
     hand. The two are different features and one of them cannot
     search a body it was never sent. */
  const asked: string[] = [];
  page.on("pageerror", (e: Error) => { errors.push(e.message); });
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());

  /* The shell asks `/account.js` whether there is a reader before
     it asks the Worker whether that reader is an admin, and
     `current()` reads a session this device kept. Seeding the key
     `aab/src/account.ts` actually uses is the only way to have one
     here: there is no Supabase to sign in to. Renaming that key
     would break real accounts, which is why it is safe to name. */
  if (admin) {
    await page.addInitScript(() => {
      localStorage.setItem("reiad-session", JSON.stringify({
        access_token: "not-a-real-token",
        refresh_token: "nor-this",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: { id: "admin-1", email: "me@example.com", user_metadata: { full_name: "Me" } },
      }));
    });
  }

  /* Supabase, answered rather than reached. A seeded session makes
     `sync.js` and the account menu talk to it, and a request that
     leaves this machine is a test that goes red on somebody else's
     afternoon. An empty list is a valid answer to all of it. */
  await page.route("https://*.supabase.co/**", (r: Route) => r.fulfill({
    status: 200, contentType: "application/json", body: "[]",
  }));

  await page.route("**/api/**", async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api\//, "");
    const method = request.method();
    if (method === "GET") asked.push(url.pathname + url.search);
    const json = (data: unknown, status = 200): Promise<void> =>
      route.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });

    if (method !== "GET") {
      sent.push({ method, url: url.pathname + url.search, body: request.postDataJSON?.() ?? null });
      if (!signedIn) return json({ ok: false, reason: "unauthorised" }, 401);
      return json({ ok: true });
    }

    /* Every GET answers `{ ok: true }` and nothing else: a body
       that is JSON, that is a success, and that carries none of
       the fields a panel reads. This is the shape an endpoint
       takes on the day somebody changes it. */
    if (nonsense) return json({ ok: true });

    if (path === "auth/me") return json({ ok: true, signedIn });
    if (path === "routine/templates") {
      return json({ ok: true, templates: admin ? [{ id: "t1", name: "A template", tasks: [] }] : [] });
    }
    /* The real shape, out of `functions/api/admin/[[route]].ts`.
       It was `{ ok: true, checks: [] }` here first, and that one
       line took the entire route down: `health.tsx` read
       `d.stores.d1` off it, a throw in a client component unmounts
       the whole tree, and the page said "This page couldn't load"
       with every panel gone. The panel narrows now, and this
       fixture is the shape it narrows to. */
    if (path === "admin/health") {
      return json({
        ok: true,
        commit: "abcdef1234567890",
        stores: {
          d1: { bound: true, ok: true, ms: 4 },
          supabase: { configured: true, ok: true, ms: 91 },
        },
        secrets: { drive: false, brokerSeal: false, adminReaders: 1 },
      });
    }

    if (!signedIn) return json({ ok: false, reason: "unauthorised" }, 401);

    if (path === "courses/status") {
      return json({
        ok: true, courses: 8, modules: 43, lessons: 794, ids: 1629,
        videos: 600, missingCaptions: 2,
        samples: [{ course: "One", lesson: "A lesson" }],
        drive: false, tickets: false,
      });
    }
    if (path === "broker/me") return json({ ok: true, admin: true, hasKey: false });
    if (path === "broker/site") return json({ ok: true, view: { holdings: true }, updated: null });

    if (path === "articles") return json({ ok: true, articles: PIECES });
    if (path.startsWith("articles/") && path.endsWith("/versions")) {
      return json({ ok: true, versions: [
        { id: 11, title: "An older headline", dek: "", tag: "", lang: "en",
          cover: "", saved_at: "2026-08-05", size: 4200 },
      ] });
    }
    if (path.startsWith("articles/")) {
      return json({ ok: true, article: { ...PIECES[0], body: "<p>hi</p>" } });
    }
    if (path === "comments") {
      const wanted = url.searchParams.get("status");
      return json({ ok: true, comments: wanted === "pending" ? COMMENTS : [] });
    }
    if (path === "questions") {
      /* The endpoint narrows on `q=`, so the fixture does too:
         a fake that answered the same rows whatever it was asked
         cannot tell a server search from a decorative box. */
      const needle = (url.searchParams.get("q") ?? "").toLowerCase();
      const rows = needle
        ? QUESTIONS.filter((q) => `${q.name} ${q.body} ${q.slug}`.toLowerCase().includes(needle))
        : QUESTIONS;
      return json({ ok: true, questions: rows, counts: { pending: 1, published: 4 } });
    }
    if (path === "enquiries") return json({ ok: true, enquiries: ENQUIRIES });
    if (path === "subscribers") return json({ ok: true, ...SUBSCRIBERS });
    if (path === "signals/stats") {
      return json({ ok: true, ...stats(url.searchParams.get("days") ?? "30") });
    }
    if (path === "media/usage") return json({ ok: true, ...MEDIA_USAGE });
    if (path === "schools/audit") return json({ ok: true, ...SCHOOLS_AUDIT });
    if (path === "backup/status") return json({ ok: true, ...BACKUP_STATUS });
    return json({ ok: true });
  });

  await page.goto(`http://localhost:${PORT}/admin`, { waitUntil: "load" });
  /* The shell asks two endpoints before it renders anything, and
     six panels ask their own after that. */
  await page.waitForTimeout(1200);
  return { page, errors, sent, asked };
}

/* `textContent`, never `innerText`. This site sets
   `text-transform: uppercase` on every panel heading, on the
   pills and on the buttons, and `innerText` returns what is
   RENDERED: sixteen checks here failed against "PUBLISHED"
   while the component said "Published". What a panel says is a
   fact about the markup; how it is drawn is the stylesheet's. */
const text = (page: Page, selector: string): Promise<string> =>
  page.locator(selector).first().textContent().then((t) => t ?? "", () => "");

const bodyText = (page: Page): Promise<string> =>
  page.evaluate(() => document.body.textContent ?? "");

/* ============================================================
   1. Nothing held. The rule this whole file is for.
   ============================================================ */
console.log("/admin with no credential");
{
  const { page, errors } = await open({ signedIn: false, admin: false });
  const body = await bodyText(page);

  ok("the page renders", body.length > 200, `${body.length} characters`);
  ok("and nothing threw", errors.length === 0, errors.join(" | "));

  for (const heading of [
    "Waiting", "Published", "Comments", "Questions", "Enquiries", "Subscribers",
    "What is read",
  ]) {
    ok(`${heading} is on the page`, body.includes(heading));
  }

  /* Every one of the six has to SAY the credential is missing.
     Counted rather than checked one at a time, because the number
     is the claim: six panels, six sentences. */
  const said = await page.locator("text=/passphrase is not held|not be counted/i").count();
  ok("every passphrase panel says the credential is missing", said >= 6, `${said} of 6`);

  /* And none of them may draw the empty-state sentence, which is
     what a working panel with nothing in it says.

     Scoped to the panel rather than searched for in the whole
     page: "Nothing here" also appears in the shell's own closing
     paragraph, about placeholders, and a page-wide search failed
     on that sentence rather than on anything being wrong. */
  for (const [panel, empty] of [
    ["#comments", "Nothing in this state"],
    ["#questions", "Nothing waiting"],
    ["#enquiries", "Nothing here."],
    ["#subscribers", "Nobody yet"],
    ["#stats", "Nothing recorded in this window yet"],
  ] as const) {
    ok(`${panel} does not draw "${empty}" to somebody signed out`,
      !(await text(page, panel)).includes(empty));
  }

  /* The two gates say what each credential opens and offer the
     one thing to press. */
  ok("both gates are shown", body.includes("The passphrase") && body.includes("Your account"));
  ok("the passphrase gate goes to the Studio, which is where it is set",
    await page.locator('.ad-gate a[href="/studio"]').count() === 1);

  /* The account gate is a BUTTON, and the assertion this replaced
     could not have caught the bug it shipped with: it asked
     whether `a[href="/account"]` existed anywhere on the page,
     and the footer carries one, so it passed without ever looking
     at the gate. Meanwhile the gate walked the reader to /account
     to sign in, `signInWithGoogle()` sent `location.pathname` as
     the return address, and they came back to /account and stayed
     there. The sign-in has to happen where the reader stands. */
  ok("the account gate opens the sign-in menu rather than navigating",
    await page.locator('.ad-gate button[popovertarget="account-menu"]').count() === 1);
  ok("and no gate sends the reader to /account to do it",
    await page.locator('.ad-gate a[href="/account"]').count() === 0);

  await page.close();
}

/* ============================================================
   2. The passphrase held. What the panels do with rows.
   ============================================================ */
console.log("\n/admin with the passphrase");
{
  const { page, errors } = await open({ signedIn: true, admin: false });
  const body = await bodyText(page);

  ok("nothing threw", errors.length === 0, errors.join(" | "));
  ok("no panel still claims the credential is missing",
    !/passphrase is not held/i.test(body));

  /* ---- Waiting ---- */
  const waiting = await text(page, "#waiting");
  ok("Waiting counts the comment queue", waiting.includes("1"), waiting);
  ok("and the questions queue", body.includes("Questions to answer"));
  ok("and says how many drafts there are", body.includes("Drafts"));

  /* ---- Published ---- */
  const published = page.locator("#published");
  const pieces = await text(page, "#published");
  ok("Published lists every piece", pieces.includes("A live piece")
    && pieces.includes("The onion piece") && pieces.includes("Not finished"));
  ok("and counts them rather than remembering", /3 pieces/.test(pieces), pieces.slice(0, 200));

  /* The two that would share as the site's default picture, and
     the pill that is the whole reason this panel flags anything. */
  ok("it flags the piece whose photo never reached R2",
    pieces.includes("photo not hosted"));
  ok("and the one whose card is a raw photo", pieces.includes("photo, not a card"));
  ok("and says how many cards there are to draw",
    /2 share cards to draw/.test(pieces), pieces.slice(0, 300));

  /* Draw card is offered only where there is something to fix. */
  ok("Draw card is offered twice, not three times",
    await published.locator("button", { hasText: "Draw card" }).count() === 2);

  /* ---- the filter and the search, which are the desk's ---- */
  await published.locator("button", { hasText: "Everywhere" }).click();
  await published.locator('button:has-text("রান্না"), button:has-text("Cooking")').first().click();
  await page.waitForTimeout(200);
  const cooking = await text(page, "#published");
  ok("the section filter narrows the list",
    cooking.includes("The onion piece") && !cooking.includes("A live piece"), cooking.slice(0, 200));
  ok("and the count follows it", /1 of 3 piece/.test(cooking), cooking.slice(0, 200));

  await published.locator("button", { hasText: "Everywhere" }).click();
  await published.locator("#published-search").fill("onion");
  await page.waitForTimeout(200);
  const searched = await text(page, "#published");
  ok("the search narrows the list",
    searched.includes("The onion piece") && !searched.includes("Not finished"));
  await published.locator("#published-search").fill("zzz");
  await page.waitForTimeout(200);
  ok("and says so when nothing matches",
    (await text(page, "#published")).includes("Nothing matches that"));
  await published.locator("#published-search").fill("");
  await page.waitForTimeout(200);

  /* ---- the three queues ---- */
  ok("the comment queue fills", (await text(page, "#comments")).includes("Useful, thank you."));
  ok("the question queue fills", (await text(page, "#questions")).includes("কত টাকা লাগবে?"));
  ok("the enquiry queue fills", (await text(page, "#enquiries")).includes("Can you model this?"));

  /* Counts on a filter, where the endpoint answers them. */
  ok("the question filters carry their counts",
    /Waiting\s*1/.test(await text(page, "#questions")));

  /* An answer box on questions, a note box on enquiries, and
     neither on comments: a comment is approved or it is not. */
  ok("questions offer an answer box, one per question",
    await page.locator("#questions textarea").count() === QUESTIONS.length);
  ok("enquiries offer a private note",
    await page.locator("#enquiries textarea").count() >= 1);
  ok("comments offer neither",
    await page.locator("#comments textarea").count() === 0);

  /* ---- Subscribers ---- */
  const subs = await text(page, "#subscribers");
  ok("Subscribers counts the confirmed", subs.includes("Confirmed"));
  ok("and offers an export", subs.includes("Export as CSV"));
  ok("and lists nobody's token", !subs.includes("token"));

  /* ---- the account half stays shut ---- */
  ok("the account panels are not drawn without the account",
    !body.includes("Routine templates"));

  await page.close();
}

/* ============================================================
   3. The buttons. A panel that renders and does nothing looks
      exactly like one that works.
   ============================================================ */
console.log("\n/admin, pressing things");
{
  const { page, sent, errors } = await open({ signedIn: true, admin: false });

  await page.locator("#comments").locator("button", { hasText: "Approve" }).first().click();
  await page.waitForTimeout(400);
  const approve = sent.find((s) => s.url.startsWith("/api/comments/"));
  ok("Approve sends a PATCH", approve?.method === "PATCH", JSON.stringify(approve));
  ok("and it sets the comment live",
    JSON.stringify(approve?.body ?? {}).includes('"live"'), JSON.stringify(approve?.body));

  await page.locator("#published").locator("button", { hasText: "Unpublish" }).first().click();
  await page.waitForTimeout(400);
  const unpublish = sent.find((s) => s.url.startsWith("/api/articles/"));
  ok("Unpublish sends a PATCH", unpublish?.method === "PATCH");
  ok("and it makes the piece a draft",
    JSON.stringify(unpublish?.body ?? {}).includes('"draft"'), JSON.stringify(unpublish?.body));

  /* Publishing an answer is one PATCH carrying both, because the
     endpoint stamps `answered_at` off the status: an answer sent
     without it is prose nobody sees. */
  await page.locator("#questions-compose-7").fill("It depends on the broker.");
  await page.locator("#questions li", { hasText: "কত টাকা লাগবে?" })
    .locator("button", { hasText: "Publish the answer" }).click();
  await page.waitForTimeout(400);
  const answer = sent.find((s) => s.url.startsWith("/api/questions/"));
  const answerBody = JSON.stringify(answer?.body ?? {});
  ok("Publish the answer sends the text", answerBody.includes("It depends on the broker."));
  ok("and the status in the same PATCH", answerBody.includes('"published"'), answerBody);

  /* The history dialog is a real dialog, which is the whole
     reason it is not a div: showModal() brings the backdrop, the
     focus trap and Escape for nothing. */
  /* Named, not `.first()`. The list is sorted by `updated_at`, so
     which row leads is a fact about the fixture rather than about
     the panel, and an assertion about the heading has to know
     whose history it opened. */
  await page.locator("#published li", { hasText: "A live piece" })
    .locator("button", { hasText: "History" }).click();
  await page.waitForTimeout(400);
  ok("History opens a modal dialog",
    await page.evaluate(() => document.querySelector("dialog")?.matches(":modal") ?? false));
  ok("and lists the version", (await text(page, "dialog")).includes("An older headline"));
  /* This asked whether the dialog said "can be undone", which it
     does not: that sentence is in the CONFIRM box, and the check
     was patched with `|| dialog.length > 0` to make it pass. A
     check that cannot fail is worse than no check, so it asks the
     two things that are actually true of the dialog instead. */
  ok("and names the piece it belongs to",
    (await text(page, "dialog")).includes("A live piece"));

  /* Going back is a POST to the versions endpoint, and it is the
     one action in this dialog. `confirm()` blocks a headless page
     for ever unless something answers it. */
  page.once("dialog", (d) => { void d.accept(); });
  await page.locator("dialog").locator("button", { hasText: "Put this back" }).click();
  await page.waitForTimeout(500);
  const restore = sent.find((x) => x.url.includes("/versions"));
  ok("and a version can be put back", restore?.method === "POST", JSON.stringify(restore));
  ok("naming which one", JSON.stringify(restore?.body ?? {}).includes("11"),
    JSON.stringify(restore?.body));

  await page.locator("#published li", { hasText: "A live piece" })
    .locator("button", { hasText: "History" }).click();
  await page.waitForTimeout(300);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  ok("Escape closes it",
    await page.evaluate(() => !document.querySelector("dialog")?.matches(":modal")));

  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   4. Both credentials
   ============================================================ */
console.log("\n/admin with both");
{
  const { page, errors } = await open({ signedIn: true, admin: true });
  const body = await bodyText(page);

  ok("the account half appears", body.includes("Routine templates"));
  ok("and the passphrase half is still there", body.includes("Published"));
  ok("and the panel that needs both says so", body.includes("Both"));
  ok("nothing threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   5. An endpoint that answers the wrong shape

   THE BUG THIS BLOCK EXISTS FOR. `health.tsx` read
   `d.stores.d1` off whatever came back and `courses-panel.tsx`
   read `data.samples.length`. A throw during render in a client
   component unmounts the WHOLE route, so one endpoint answering
   `{ ok: true }` took `/admin` to "This page couldn't load" with
   every panel gone, Health included: the one panel whose entire
   justification is working on the day something is broken was
   the one that could break everything.
   ============================================================ */
console.log("\n/admin when an endpoint answers something else");
{
  const { page, errors } = await open({ signedIn: true, admin: true, nonsense: true });
  const body = await bodyText(page);

  ok("the page still renders", !body.includes("This page couldn"), body.slice(0, 120));
  ok("and nothing threw", errors.length === 0, errors.join(" | "));

  /* Every panel is still there, each saying it could not read
     what it asked for rather than being absent. */
  for (const heading of [
    "Health", "Published", "Comments", "Subscribers", "What is read",
  ]) {
    ok(`${heading} is still on the page`, body.includes(heading));
  }
  ok("Health says the Worker gave no usable answer",
    /no usable answer/.test(body));

  await page.close();
}

/* ============================================================
   6. The three the desk never had

   ADMIN.md §6 stage 6. Media, Schools and Backups each read one
   endpoint and each is easy to ship as a panel that renders and
   says nothing, which is the failure this whole file exists for.
   ============================================================ */
console.log("\n/admin, the three the desk never had");
{
  const { page, sent, errors } = await open({ signedIn: true, admin: false });

  /* ---- Media ---- */
  const media = await text(page, "#media");
  ok("Media says what points at a key", media.includes("insights/a-live-piece"));
  ok("and says plainly when nothing does", media.includes("Nothing points at this"));
  ok("and counts the snapshots apart from the photos",
    media.includes("Nightly snapshots"), media.slice(0, 300));
  /* The one that matters: a delete offered on a key something
     points at is a delete that breaks a page. */
  ok("Delete is offered once, on the key nothing points at",
    await page.locator("#media").locator("button", { hasText: "Delete" }).count() === 1);

  page.on("dialog", (d) => void d.accept());
  await page.locator("#media").locator("button", { hasText: "Delete" }).click();
  await page.waitForTimeout(400);
  const deleted = sent.find((s) => s.url.startsWith("/api/media/"));
  ok("and pressing it sends a DELETE for that key",
    deleted?.method === "DELETE"
    && deleted.url === "/api/media/a-piece/1111222233334444.webp",
    JSON.stringify(deleted));

  /* ---- Schools ---- */
  const schools = await text(page, "#schools");
  ok("Schools names a link that answers nothing",
    schools.includes("/money/basics-9/gone.html"));
  ok("and keeps the old spelling apart from it",
    schools.includes("/money/index.html") && schools.includes("301"));
  ok("and says what it does not adjudicate",
    schools.includes("/tools/index.html") && schools.includes("check-routes.ts"));
  ok("it names the unwritten lesson of a LIVE stage", schools.includes("share"));
  ok("and the row no section declares", schools.includes("stray"));

  /* A `soon` stage with nothing written is the ladder keeping a
     promise, not a fault, so only the live stage and the
     undeclared row are painted as one. */
  ok("a soon stage is not painted as broken",
    await page.locator('#schools .ad-row[data-state="down"]').count() === 2,
    `${await page.locator('#schools .ad-row[data-state="down"]').count()} rows down`);

  /* ---- Backups ---- */
  const backups = await text(page, "#backups");
  ok("Backups says when the last snapshot ran", backups.includes("2026-08-20"));
  ok("and how big it was", /1\.1 MB/.test(backups), backups.slice(0, 400));
  ok("and names the half it cannot know",
    backups.includes("cannot see the repository"));
  ok("and offers no restore button",
    await page.locator("#backups").locator("button").count() === 0);
  ok("and writes nothing at all",
    !sent.some((s) => s.url.startsWith("/api/backup")), JSON.stringify(sent));

  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   6. What the desk did that a queue has to keep

   Each of these is a check in `archive/desk-react/desk.test.ts`,
   which is 76 of them and every one a feature the desk had. A
   panel that renders is not the same as a panel that does them,
   which is why they came here rather than retiring with it.
   ============================================================ */
console.log("\n/admin, the desk's own features");
{
  const { page, asked, errors } = await open({ signedIn: true, admin: false });

  /* ---- a queue is not a list ---- */
  ok("a recent comment is marked new",
    (await text(page, "#comments")).includes("new"));
  ok("and so is a recent enquiry",
    (await text(page, "#enquiries")).includes("new"));

  /* ---- reaching the person ---- */
  const asker = page.locator('#questions a[href^="mailto:"]').first();
  ok("a question offers a reply by email", await asker.count() === 1);
  const askerHref = await asker.getAttribute("href") ?? "";
  ok("addressed to the asker", askerHref.startsWith("mailto:r@example.com"), askerHref);
  ok("with a subject already written", askerHref.includes("subject="), askerHref);

  const client = page.locator('#enquiries a[href^="mailto:"]').first();
  ok("an enquiry offers one too", await client.count() === 1);
  ok("and its subject names the kind",
    (await client.getAttribute("href") ?? "").includes("project"));

  /* ---- and where a comment was written ---- */
  const where = await page.locator("#comments a").first().getAttribute("href") ?? "";
  ok("a comment links to the piece it is on",
    where.startsWith("/insights/a-live-piece"), where);

  /* ---- the filters say what is behind them ---- */
  ok("the enquiry filters count, though the endpoint sends no tally",
    /New\s*1/.test(await text(page, "#enquiries")));

  /* ---- searching, and the two kinds of it ---- */
  /* Counted from HERE, not from the page load: Waiting asks the
     same endpoint for the same status to count the queue, so the
     claim is that typing adds none, not that only one was ever
     made. */
  const commentsAsked = () => asked.filter((u) => u.startsWith("/api/comments?status=")).length;
  const beforeTyping = commentsAsked();
  await page.locator("#comments-search").fill("Ayesha");
  await page.waitForTimeout(250);
  ok("a comment search narrows in the browser",
    (await text(page, "#comments")).includes("Useful, thank you."));
  await page.locator("#comments-search").fill("zzz");
  await page.waitForTimeout(250);
  ok("and says so when nothing matches",
    (await text(page, "#comments")).includes("Nothing matches that"));
  ok("without asking the endpoint again", commentsAsked() === beforeTyping,
    `${commentsAsked() - beforeTyping} extra request(s)`);

  const before = asked.filter((u) => u.startsWith("/api/questions")).length;
  await page.locator("#questions-search").fill("টাকা");
  await page.waitForTimeout(700);
  const queries = asked.filter((u) => u.includes("/api/questions") && u.includes("q="));
  ok("a question search reaches the endpoint", queries.length >= 1, asked.join(", "));
  ok("and is debounced rather than asked per keystroke",
    asked.filter((u) => u.startsWith("/api/questions")).length - before <= 2,
    `${asked.filter((u) => u.startsWith("/api/questions")).length - before} requests`);

  await page.locator("#subscribers-search").fill("two@");
  await page.waitForTimeout(250);
  const subs = await text(page, "#subscribers");
  ok("addresses are searchable",
    subs.includes("two@example.com") && !subs.includes("one@example.com"));

  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   7. What is read

   The one panel the desk had and this page did not, ported out of
   its `Stats.tsx`. Every check below is one of the eight the
   desk's own `desk.test.ts` made under "what's read", plus the
   three it could not: it named a path out of one index and a piece
   out of another, and nothing said which of the two had answered.

   A port is finished when it does what the thing it replaced did,
   not when it renders, and those two look identical from here.
   ============================================================ */
console.log("\n/admin, what is read");
{
  const { page, errors } = await open({ signedIn: true, admin: false });
  const panel = page.locator("#stats");

  ok("the panel is on the page", await panel.count() === 1,
    "nothing carries #stats. panel.tsx is what mounts <StatsPanel/>");

  const read = await text(page, "#stats");

  ok("three windows to choose from",
    await panel.locator('[role="group"] button').count() === 3);
  ok("the line is drawn",
    await panel.locator(".chart-box svg polyline").count() === 1);
  ok("the busiest day is a figure of its own",
    (await text(page, "#stats .stat-row")).includes("512"),
    await text(page, "#stats .stat-row"));

  /* Three names, three sources, and the fourth path is the one
     nothing knows. A panel that named the first three by accident
     would name the fourth too. */
  ok("a path is named, not printed", read.includes("Portfolio & services"),
    read.slice(0, 300));
  ok("a tool is named too, and content.ts is the only thing that knows that",
    read.includes("Stock check"));
  ok("a piece is named out of the database, which is the only thing that knows that",
    read.includes("A live piece"));
  ok("and a path nothing knows is printed as it is", read.includes("/nothing/here"));

  ok("reactions are shown when there are any",
    (await panel.locator(".section-label").allTextContents()).includes("Reactions"));
  ok("and the reactions list says it cannot follow the window",
    read.includes("All time"));
  ok("and the page says what it does not know",
    (await text(page, "#stats .tool-note")).includes("No cookies"));

  /* The window has to REACH the endpoint. Three buttons that
     redraw one answer look exactly like three that work, and the
     endpoint takes `?days=`. */
  await panel.locator("button", { hasText: "7 days" }).click();
  await page.waitForTimeout(500);
  const week = await text(page, "#stats");
  ok("another window re-asks the endpoint and redraws",
    week.includes("2026-08-08") && !week.includes("2026-07-16"), week.slice(0, 200));

  /* ---- what a row says about itself ---- */
  /* Each of these is a `desk.test.ts` check with a subject on
     /admin and nothing asking it. The behaviour was there; the
     assertion was not, which is the same as not having it. */
  ok("an anonymous asker is named as one",
    (await text(page, "#questions")).includes("anonymous"));
  ok("and is offered no reply, rather than a broken one",
    await page.locator('#questions a[href^="mailto:"]').count() === 1,
    "one asker gave an address and one did not");
  ok("a reply says it is one", (await text(page, "#comments")).includes("a reply"));
  ok("a draft is shown as a draft", (await text(page, "#published")).includes("draft"));
  ok("and is offered Publish rather than Unpublish",
    await page.locator("#published li", { hasText: "Not finished" })
      .locator("button", { hasText: "Publish" }).count() === 1);
  await page.locator("#enquiries").locator("button", { hasText: "Everything" }).click();
  await page.waitForTimeout(250);
  ok("a closed enquiry can be reopened",
    await page.locator("#enquiries li", { hasText: "Answered a while ago." })
      .locator("button", { hasText: "Reopen" }).count() === 1);
  ok("and is not offered Close again",
    await page.locator("#enquiries li", { hasText: "Answered a while ago." })
      .locator("button", { hasText: "Close" }).count() === 0);

  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

await browser.close();
server.close();

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}
console.log("all good: every panel says what it can reach, and the buttons reach it");
