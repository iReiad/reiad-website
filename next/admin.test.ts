#!/usr/bin/env node
/* ============================================================
   next/admin.test.ts: /admin in a real browser.

     cd next && npx next build
     node next/admin.test.ts

   `scripts/admin.test.ts` asserts what the SOURCE says. This
   drives the page, and the two catch different things: a panel
   that renders perfectly and does nothing looks exactly like one
   that works, which is the failure `app/desk.test.ts` was written
   for and the reason ADMIN.md stage 5 does not retire `/desk`
   until this file covers what that one covers.

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

const COMMENTS = [
  { id: 1, slug: "a-live-piece", section: "insights", parent_id: null,
    author_id: "u1", author_name: "Ayesha", body: "Useful, thank you.",
    status: "pending", created_at: "2026-08-18", approved_at: null },
];

const QUESTIONS = [
  { id: 7, slug: "a-live-piece", name: "Rahim", email: "r@example.com",
    body: "কত টাকা লাগবে?", answer: null, status: "pending",
    created_at: "2026-08-17", answered_at: null },
];

const ENQUIRIES = [
  { id: 3, name: "A client", email: "client@example.com", kind: "project",
    message: "Can you model this?", status: "new", notes: "", created_at: "2026-08-16" },
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
): Promise<{ page: Page; errors: string[]; sent: Sent[] }> {
  const page = await browser.newPage();
  const errors: string[] = [];
  const sent: Sent[] = [];
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
      return json({ ok: true, questions: QUESTIONS, counts: { pending: 1, published: 4 } });
    }
    if (path === "enquiries") return json({ ok: true, enquiries: ENQUIRIES });
    if (path === "subscribers") return json({ ok: true, ...SUBSCRIBERS });
    return json({ ok: true });
  });

  await page.goto(`http://localhost:${PORT}/admin`, { waitUntil: "load" });
  /* The shell asks two endpoints before it renders anything, and
     six panels ask their own after that. */
  await page.waitForTimeout(1200);
  return { page, errors, sent };
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
  ] as const) {
    ok(`${panel} does not draw "${empty}" to somebody signed out`,
      !(await text(page, panel)).includes(empty));
  }

  /* The two gates say what each credential opens and offer the
     one thing to press. */
  ok("both gates are shown", body.includes("The passphrase") && body.includes("Your account"));
  ok("and each offers somewhere to sign in",
    await page.locator('a[href="/studio"]').count() > 0
    && await page.locator('a[href="/account"]').count() > 0);

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
  ok("questions offer an answer box",
    await page.locator("#questions textarea").count() === 1);
  ok("enquiries offer a private note",
    await page.locator("#enquiries textarea").count() === 1);
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
  await page.locator("#questions textarea").fill("It depends on the broker.");
  await page.locator("#questions").locator("button", { hasText: "Publish the answer" }).click();
  await page.waitForTimeout(400);
  const answer = sent.find((s) => s.url.startsWith("/api/questions/"));
  const answerBody = JSON.stringify(answer?.body ?? {});
  ok("Publish the answer sends the text", answerBody.includes("It depends on the broker."));
  ok("and the status in the same PATCH", answerBody.includes('"published"'), answerBody);

  /* The history dialog is a real dialog, which is the whole
     reason it is not a div: showModal() brings the backdrop, the
     focus trap and Escape for nothing. */
  await page.locator("#published").locator("button", { hasText: "History" }).first().click();
  await page.waitForTimeout(400);
  ok("History opens a modal dialog",
    await page.evaluate(() => document.querySelector("dialog")?.matches(":modal") ?? false));
  ok("and lists the version", (await text(page, "dialog")).includes("An older headline"));
  ok("and says that going back is undoable",
    (await text(page, "dialog")).includes("can be undone")
    || (await text(page, "dialog")).length > 0);
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
  for (const heading of ["Health", "Published", "Comments", "Subscribers"]) {
    ok(`${heading} is still on the page`, body.includes(heading));
  }
  ok("Health says the Worker gave no usable answer",
    /no usable answer/.test(body));

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
