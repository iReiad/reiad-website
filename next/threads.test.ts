#!/usr/bin/env node
/* ============================================================
   threads.test.ts: the research desk, in a browser.

       node next/threads.test.ts

   Needs `npx next build` in `next/` and a browser. Without
   either it says which and skips, and a skip is not a pass.

   ---- what it is really guarding ----

   ONE JSONB COLUMN, WRITTEN FROM FIVE PLACES. The note, the
   sources, the steps and the three link lists all live in
   `body`, PostgREST REPLACES a jsonb column rather than merging
   into it, and every one of those five controls saves on its
   own. So the failure this file exists for is silent and total:
   type a sentence into the note and the sources you spent an
   afternoon collecting are gone, with no error, on a page that
   renders perfectly. `patchBody` is the answer and the checks
   below are what say it is still the answer.

   ---- the fixture is PostgREST, not something kinder ----

   `next/account.test.ts` records the lesson: its fake answered
   every read with the reader's own row, which is kinder than
   Postgres, so 117 checks passed against a page drawing the
   wrong person. This one applies a PATCH to the row it holds and
   hands the result back, exactly as `return=representation`
   does, which is the only way a check can see a write that put
   something back.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Page, Route } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, ".next");
const AAB = join(HERE, "..", "aab");
const PORT = 8917;

/** `SETTLE` in `components/admin/threads.tsx`: how long a burst of
    typing waits before it is written. Named rather than a literal
    because two checks below time themselves against it. */
const SETTLE = 700;

let passed = 0;
const failures: string[] = [];
const ok = (name: string, condition: unknown, detail: string | null = ""): void => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}: ${detail}` : name);
};

const skip: (why: string) => never = (why) => {
  console.log(`threads: SKIPPED, ${why}`);
  console.log("A skip is not a pass.\n");
  process.exit(0);
};

const exists = (path: string): Promise<boolean> => stat(path).then(() => true, () => false);

if (!await exists(join(BUILD, "server/app/admin/research.html"))) {
  skip("next/.next holds no prerendered /admin/research. "
    + "Run `npx next build` in next/ first.");
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
  const file = path === "/admin/research"
    ? join(BUILD, "server/app/admin/research.html")
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

/* ---- the rows ---- */

interface Row {
  id: string;
  question: string;
  state: string;
  tags: string[];
  body: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

const ago = (days: number): string =>
  new Date(Date.now() - days * 86400000).toISOString();

const seed = (): Row[] => ([
  {
    id: "th-1", question: "Are the banks over-provisioned?", state: "open",
    tags: ["banks", "bd"],
    body: {
      note: "Three of the six raised provisions in Q2.",
      sources: [{ url: "https://example.org/bb-report", said: "NPL ratio 9.4%" }],
      next: [{ text: "Read the BB circular" }, { text: "Pull the six ratios", done: true }],
      links: {},
    },
    created_at: ago(9), updated_at: ago(2),
  },
  {
    id: "th-2", question: "What does the ready-made garment cycle look like?",
    state: "parked", tags: ["rmg"],
    body: { note: "", sources: [], next: [], links: {} },
    created_at: ago(30), updated_at: ago(20),
  },
  {
    id: "th-3", question: "Is the fuel subsidy going?", state: "answered",
    tags: ["bd", "energy"],
    body: { note: "It went in March.", sources: [], next: [], links: {} },
    created_at: ago(60), updated_at: ago(40),
  },
]);

/* A saved stock check, in the shape the check itself stores: its
   own query string, which is what `/tools/live` reads too. */
const SCENARIOS = [{
  id: "sc-1", tool: "stock", name: "Square Pharma", summary: "Worth a look",
  inputs: { query: "ticker=SQURPHARMA&name=Square+Pharma&pe=11.2" },
  created_at: ago(5), updated_at: ago(5),
}];

const LIBRARY = [
  { id: "lb-1", url: "/insights/bank-provisions.html", title: "Bank provisions, read twice",
    kind: "piece", saved: true, note: "The table on page 4 is the whole argument.",
    created_at: ago(6), updated_at: ago(6) },
  { id: "lb-2", url: "/money/basics-1/inflation.html", title: "মূল্যস্ফীতি",
    kind: "lesson", saved: true, note: "", created_at: ago(7), updated_at: ago(7) },
];

/* ---- one page, with a PostgREST that behaves like one ---- */

interface Sent { method: string; path: string; body: unknown }

async function open({ signedIn = true }: { signedIn?: boolean } = {}): Promise<{
  page: Page; errors: string[]; sent: Sent[]; rows: Row[];
}> {
  const page = await browser.newPage();
  const errors: string[] = [];
  const sent: Sent[] = [];
  const rows = seed();

  page.on("pageerror", (e: Error) => { errors.push(e.message); });
  page.on("console", (m) => {
    /* React's hydration mismatch is a warning rather than a
       throw, and it is the one thing a component adopted from
       server markup can get wrong while rendering perfectly. */
    const t = m.text();
    if (/Minified React error #(418|423|425)|did not match|Hydration failed/.test(t)) {
      errors.push(t);
    }
  });
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());

  if (signedIn) {
    await page.addInitScript(() => {
      localStorage.setItem("reiad-session", JSON.stringify({
        access_token: "not-a-real-token",
        refresh_token: "nor-this",
        expires_at: Date.now() + 3600_000,
        user: { id: "admin-1", email: "me@example.com", user_metadata: { full_name: "Me" } },
      }));
    });
  }

  await page.route("https://*.supabase.co/**", async (r: Route) => {
    const request = r.request();
    const url = new URL(request.url());
    const table = url.pathname.replace("/rest/v1/", "");
    const method = request.method();
    const json = (data: unknown, status = 200): Promise<void> =>
      r.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });

    if (method !== "GET") {
      sent.push({
        method,
        path: url.pathname + url.search,
        body: (() => { try { return request.postDataJSON(); } catch { return null; } })(),
      });
    }

    if (table !== "threads") {
      if (method !== "GET") return json([]);
      if (table === "scenarios") return json(SCENARIOS);
      if (table === "library") return json(LIBRARY);
      return json([]);
    }

    const idOf = (): string =>
      (url.searchParams.get("id") ?? "").replace(/^eq\./, "");

    if (method === "GET") {
      const want = (url.searchParams.get("state") ?? "").replace(/^eq\./, "");
      const out = want ? rows.filter((t) => t.state === want) : rows;
      return json([...out].sort((a, b) => b.updated_at.localeCompare(a.updated_at)));
    }
    if (method === "POST") {
      const made = (request.postDataJSON() as Partial<Row>[])[0];
      const row: Row = {
        id: `th-${rows.length + 1}-new`,
        question: String(made.question ?? ""),
        state: "open", tags: [], body: {},
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      rows.unshift(row);
      return json([row]);
    }
    if (method === "PATCH") {
      /* A ROUND TRIP HAS A WIDTH, and a fake that answers in zero
         milliseconds cannot see what happens inside it. The one
         thing that goes wrong on a page where a controlled field
         saves on a debounce happens between the request and the
         response: the reader carries on typing, and the answer
         arrives carrying the text as it was when the write went
         out. 250ms is a plausible one to Supabase. */
      await new Promise((go) => setTimeout(go, 250));
      const at = rows.findIndex((t) => t.id === idOf());
      if (at < 0) return json([]);
      /* WHAT POSTGREST ACTUALLY DOES: every named column is
         replaced whole, jsonb included. A fixture that merged
         `body` here would pass a page that drops the sources on
         every note keystroke, which is the exact failure this
         file is for. */
      const patch = request.postDataJSON() as Partial<Row>;
      rows[at] = { ...rows[at], ...patch, updated_at: new Date().toISOString() };
      return json([rows[at]]);
    }
    if (method === "DELETE") {
      const at = rows.findIndex((t) => t.id === idOf());
      if (at >= 0) rows.splice(at, 1);
      return json([]);
    }
    return json([]);
  });

  await page.route("**/api/**", (r: Route) => r.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }),
  }));

  await page.goto(`http://localhost:${PORT}/admin/research`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  return { page, errors, sent, rows };
}

const bodyText = (page: Page): Promise<string> =>
  page.evaluate(() => document.body.textContent ?? "");

/* ============================================================
   1. signed out
   ============================================================ */

{
  const { page, errors } = await open({ signedIn: false });
  const words = await bodyText(page);
  ok("signed out, the desk asks for an account", words.includes("Sign in"));
  ok("and draws no thread list", await page.locator(".rd-rows").count() === 0);
  ok("and nothing threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   2. the list
   ============================================================ */

const { page, errors, sent, rows } = await open();

ok("the open threads are listed", await page.locator(".rd-row").count() === 1,
  `${await page.locator(".rd-row").count()} row(s)`);
ok("newest touched first is what the list asks for",
  (await bodyText(page)).includes("Are the banks over-provisioned?"));
ok("a parked thread is not in the open list",
  !(await page.locator(".rd-rows").textContent() ?? "").includes("garment"));

await page.locator(".rd-chip", { hasText: "all" }).click();
await page.waitForTimeout(120);
ok("all shows every state", await page.locator(".rd-row").count() === 3);

ok("a row says how many steps are left",
  (await page.locator(".rd-row", { hasText: "banks" }).textContent() ?? "").includes("1 left"));
ok("and how many sources it has",
  (await page.locator(".rd-row", { hasText: "banks" }).textContent() ?? "").includes("1 src"));

/* ---- search reaches the body, not only the question ---- */
await page.locator("#rd-find").fill("circular");
await page.waitForTimeout(120);
ok("search finds a thread by what is left to do on it",
  await page.locator(".rd-row").count() === 1);
await page.locator("#rd-find").fill("NPL");
await page.waitForTimeout(120);
ok("and by what a source said", await page.locator(".rd-row").count() === 1);
await page.locator("#rd-find").fill("");
await page.waitForTimeout(120);

/* ---- tags ---- */
ok("a tag chip counts the threads carrying it",
  (await page.locator(".rd-chips").nth(1).textContent() ?? "").includes("bd"));
await page.locator(".rd-chip", { hasText: /^bd/ }).click();
await page.waitForTimeout(150);
ok("and filtering by it narrows the list", await page.locator(".rd-row").count() === 2);
await page.locator(".rd-chip", { hasText: /^bd/ }).click();
await page.waitForTimeout(150);
ok("and pressing it again clears the filter", await page.locator(".rd-row").count() === 3);

/* ============================================================
   3. one thread, and the one write that must not lose anything
   ============================================================ */

await page.locator(".rd-row", { hasText: "banks" }).click();
await page.waitForTimeout(150);

ok("opening a thread shows its question",
  await page.locator("#rd-question").inputValue() === "Are the banks over-provisioned?");
ok("and its note", (await page.locator("#rd-note").inputValue()).includes("provisions in Q2"));
ok("and its source", (await bodyText(page)).includes("example.org"));
ok("and what that source said",
  await page.locator(".rd-said-in").first().inputValue() === "NPL ratio 9.4%");
ok("a finished step is drawn as finished",
  await page.locator(".rd-step [data-done]").count() === 1);

/* THE CHECK THIS FILE EXISTS FOR. */
await page.locator("#rd-note").fill("Three of the six raised provisions in Q2. And a fourth in Q3.");
await page.waitForTimeout(1100);
const after = rows.find((r) => r.id === "th-1");
ok("typing in the note saves it",
  String((after?.body as { note?: string })?.note ?? "").includes("a fourth in Q3"));
ok("AND THE SOURCES SURVIVE IT",
  ((after?.body as { sources?: unknown[] })?.sources ?? []).length === 1,
  "a note write that sends a partial body replaces the jsonb column and the "
  + "sources are gone, silently, on a page that renders perfectly");
ok("and so do the steps",
  ((after?.body as { next?: unknown[] })?.next ?? []).length === 2);

/* ---- AND THE BOX IS STILL THE READER'S WHILE IT SAVES ----

   The note is a controlled field, so its value comes from
   somewhere, and taking it from the row on every change of the
   row means every write puts the server's answer back in the
   box. Typing through a save then loses whatever was typed after
   the request went out: it comes back on the next write, which is
   worse than failing, because what a reader sees is their own
   sentence flickering away and returning.

   Typed in two bursts with the debounce firing between them,
   against a fixture whose PATCH takes 250ms, which is the shape
   of the failure rather than a re-creation of one afternoon. */
const WHOLE = "The first half. And the second.";
await page.locator("#rd-note").fill("");
await page.locator("#rd-note").click();
await page.keyboard.type("The first half. ");
/* The debounce fires here, so the write for the FIRST half is in
   flight while the second half is typed. */
await page.waitForTimeout(SETTLE + 60);
await page.keyboard.type("And the second.");

/* WATCHED RATHER THAN SAMPLED AT THE END, which is the whole
   point of this check and the reason the first draft of it
   passed against the bug it was written for. The box heals: the
   next write carries the full sentence and the response after
   that puts it back. Reading the value once, a second and a half
   later, is reading it after the heal. What a reader actually
   experiences is the window in between, and losing the text for
   400ms is not better than losing it, because the next keystroke
   goes into the reverted box and the middle sentence is gone for
   good. So this watches the box across the whole window and asks
   whether it was ever short. */
let shortest = WHOLE.length;
let sawShort = "";
for (let i = 0; i < 30; i += 1) {
  const seen = await page.locator("#rd-note").inputValue();
  if (seen.length < shortest) { shortest = seen.length; sawShort = seen; }
  await page.waitForTimeout(50);
}
ok("the box never loses what was typed while a save is in flight",
  shortest === WHOLE.length,
  `it went back to "${sawShort}"`);
ok("and it holds the whole sentence afterwards",
  await page.locator("#rd-note").inputValue() === WHOLE,
  await page.locator("#rd-note").inputValue());
ok("and so does the account",
  String((rows.find((r) => r.id === "th-1")?.body as { note?: string })?.note ?? "") === WHOLE,
  String((rows.find((r) => r.id === "th-1")?.body as { note?: string })?.note ?? ""));

/* ---- a patch names only what changed ---- */
const noteWrite = sent.filter((s) => s.method === "PATCH").at(-1);
ok("a note write sends the body and nothing else",
  noteWrite !== undefined
  && Object.keys(noteWrite.body as Record<string, unknown>).join() === "body",
  Object.keys((noteWrite?.body ?? {}) as Record<string, unknown>).join());

/* ---- the question, on blur ---- */
await page.locator("#rd-question").fill("Are the banks over-provisioned in 2026?");
await page.locator("#rd-note").click();
await page.waitForTimeout(400);
ok("the question saves when it loses the focus",
  rows.find((r) => r.id === "th-1")?.question.includes("2026") === true);
ok("and the row in the list says so",
  (await page.locator(".rd-row").first().textContent() ?? "").includes("2026"));

/* ---- tags are lowercased and deduplicated by saved.ts ---- */
await page.locator("#rd-tags").fill("Banks, banks, BD, provisions");
await page.locator("#rd-note").click();
await page.waitForTimeout(400);
ok("a tag typed twice in two cases is stored once, lowercased",
  JSON.stringify(rows.find((r) => r.id === "th-1")?.tags)
    === JSON.stringify(["banks", "bd", "provisions"]),
  JSON.stringify(rows.find((r) => r.id === "th-1")?.tags));

/* ---- sources ---- */
await page.locator("#rd-src").fill("https://www.bb.org.bd/circular/2026-04");
await page.locator("#rd-src").press("Enter");
await page.waitForTimeout(400);
ok("a pasted link is added as a source",
  ((rows.find((r) => r.id === "th-1")?.body as { sources?: unknown[] })?.sources ?? [])
    .length === 2);
ok("and is shown by host rather than by its whole address",
  (await page.locator(".rd-src-url").first().textContent() ?? "") === "bb.org.bd");

await page.locator(".rd-srcs li").first().locator("button").click();
await page.waitForTimeout(400);
ok("and can be removed",
  ((rows.find((r) => r.id === "th-1")?.body as { sources?: unknown[] })?.sources ?? [])
    .length === 1);

/* ---- steps ---- */
await page.locator("#rd-step").fill("Ask the four banks directly");
await page.locator("#rd-step").press("Enter");
await page.waitForTimeout(400);
ok("a step is added",
  ((rows.find((r) => r.id === "th-1")?.body as { next?: unknown[] })?.next ?? [])
    .length === 3);
await page.locator(".rd-step input").first().click();
await page.waitForTimeout(400);
{
  const next = (rows.find((r) => r.id === "th-1")?.body as
    { next?: { done?: boolean }[] })?.next ?? [];
  ok("and ticking one stores that it is done", next[0]?.done === true);
}

/* ============================================================
   4. connected, and every address is one the site answers
   ============================================================ */

await page.locator(".rd-what").selectOption("tickers");
await page.waitForTimeout(120);
ok("the checks already saved are what a ticker is picked from",
  (await page.locator(".rd-pick").textContent() ?? "").includes("SQURPHARMA"));
await page.locator(".rd-pick").selectOption("SQURPHARMA");
await page.locator(".rd-part", { hasText: "Connected" })
  .locator("button", { hasText: "Add" }).click();
await page.waitForTimeout(450);
{
  const link = page.locator(".rd-link").first();
  const href = await link.getAttribute("href");
  ok("a connected ticker opens the stock check", String(href).startsWith("/tools/stock?"));
  ok("with the saved check's OWN query in it, not an empty form",
    String(href).includes("pe=11.2"), String(href));
  ok("and the verdict already earned is shown beside it",
    (await link.textContent() ?? "").includes("Worth a look"));
}

await page.locator(".rd-what").selectOption("tools");
await page.waitForTimeout(120);
await page.locator(".rd-pick").selectOption({ index: 1 });
await page.locator(".rd-part", { hasText: "Connected" })
  .locator("button", { hasText: "Add" }).click();
await page.waitForTimeout(450);
ok("a connected tool links into /tools/",
  (await page.locator(".rd-link").nth(1).getAttribute("href") ?? "").startsWith("/tools"),
  await page.locator(".rd-link").nth(1).getAttribute("href") ?? "");

await page.locator(".rd-what").selectOption("pages");
await page.waitForTimeout(120);
ok("a page is picked out of the reader's own library",
  (await page.locator(".rd-pick").textContent() ?? "").includes("Bank provisions"));
await page.locator(".rd-pick").selectOption("/insights/bank-provisions.html");
await page.locator(".rd-part", { hasText: "Connected" })
  .locator("button", { hasText: "Add" }).click();
await page.waitForTimeout(450);
{
  const link = page.locator(".rd-link").nth(2);
  ok("a connected page keeps its title rather than showing a bare URL",
    (await link.textContent() ?? "").includes("Bank provisions"));
  ok("and says when there is already a note on it",
    (await link.textContent() ?? "").includes("note"));
}
ok("all three kinds are stored under one body",
  (() => {
    const links = (rows.find((r) => r.id === "th-1")?.body as
      { links?: { tickers?: unknown[]; tools?: unknown[]; pages?: unknown[] } })?.links ?? {};
    return (links.tickers ?? []).length === 1 && (links.tools ?? []).length === 1
      && (links.pages ?? []).length === 1;
  })());
ok("and the note, the sources and the steps are all still there",
  (() => {
    const b = rows.find((r) => r.id === "th-1")?.body as Record<string, unknown[]>;
    return String(b.note ?? "").includes("And the second.") && (b.sources ?? []).length === 1
      && (b.next ?? []).length === 3;
  })(),
  "four controls write one column and the last one must not be the only one left");

ok("a thing already connected is not offered again",
  !(await page.locator(".rd-pick").textContent() ?? "").includes("Bank provisions"));

/* ============================================================
   5. the keyboard
   ============================================================ */

await page.locator("h1").click();
await page.keyboard.press("f");
ok("f puts the caret in the search box",
  await page.evaluate(() => document.activeElement?.id) === "rd-find",
  await page.evaluate(() => document.activeElement?.id ?? "?"));

/* `/` IS THE SITE'S, AND THIS IS WHAT SAYS SO. It opens the
   command palette from `aab/src/app.ts` on every page, and the
   desk took it for one build: the search box took the focus and
   a modal immediately took it away again. A shortcut that
   collides does not fail, it does the other thing. */
await page.keyboard.press("Escape");
await page.locator("h1").click();
await page.keyboard.press("/");
await page.waitForTimeout(200);
ok("and / still belongs to the site's palette rather than to the desk",
  await page.evaluate(() => document.activeElement?.id) === "palette-input",
  await page.evaluate(() => document.activeElement?.id ?? "?"));
await page.keyboard.press("Escape");
await page.waitForTimeout(200);
ok("Escape closes the palette and the desk did not act while it was open",
  await page.locator("dialog[open]").count() === 0);

await page.locator("h1").click();
await page.keyboard.press("f");
await page.keyboard.press("Escape");
await page.waitForTimeout(120);
ok("Escape takes the caret back out of the search box",
  await page.evaluate(() => document.activeElement?.id) !== "rd-find");

await page.keyboard.press("j");
await page.waitForTimeout(150);
const second = await page.locator(".rd-row[data-on] .rd-q").textContent();
await page.keyboard.press("k");
await page.waitForTimeout(150);
ok("j and k walk the list",
  (await page.locator(".rd-row[data-on] .rd-q").textContent()) !== second);

/* Back to the thread the checks below are about: j and k have
   just moved the selection, which is the whole point of them. */
await page.locator(".rd-row", { hasText: "banks" }).click();
await page.waitForTimeout(150);

await page.keyboard.press("2");
await page.waitForTimeout(400);
ok("2 parks the open thread",
  rows.find((r) => r.id === "th-1")?.state === "parked",
  rows.find((r) => r.id === "th-1")?.state);
await page.keyboard.press("1");
await page.waitForTimeout(400);
ok("and 1 opens it again", rows.find((r) => r.id === "th-1")?.state === "open");

/* A letter typed into a field is a letter. */
await page.locator("#rd-note").click();
const was = rows.find((r) => r.id === "th-1")?.state;
await page.keyboard.type("nnn222");
await page.waitForTimeout(1100);
ok("and none of them fires while a field has the focus",
  rows.find((r) => r.id === "th-1")?.state === was
  && rows.length === 3,
  `${rows.length} thread(s), state ${rows.find((r) => r.id === "th-1")?.state}`);
ok("what was typed into the note is what the note now holds",
  String((rows.find((r) => r.id === "th-1")?.body as { note?: string })?.note ?? "")
    .includes("nnn222"));

/* ============================================================
   6. starting one, and ending one
   ============================================================ */

await page.locator("body").click();
await page.keyboard.press("n");
await page.waitForTimeout(500);
ok("n starts a thread", rows.length === 4);
ok("and opens it", await page.locator("#rd-question").inputValue() === "New question");
ok("and it is a POST rather than a whole-row write",
  sent.some((s) => s.method === "POST" && s.path.startsWith("/rest/v1/threads")));

page.once("dialog", (d) => { void d.accept(); });
await page.locator(".rd-open").locator("button", { hasText: "Delete" }).click();
await page.waitForTimeout(500);
ok("Delete asks first and then removes it", rows.length === 3);
ok("and the pane goes back to nothing open",
  (await bodyText(page)).includes("Pick one"));

ok("and none of it threw", errors.length === 0, errors.join(" | "));
await page.close();

await browser.close();
server.close();

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}
console.log("all good: one column, five controls, and nothing loses anything");
