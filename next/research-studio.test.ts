/* ============================================================
   research-studio.test.ts: the Research Studio, in a browser.

     node next/research-studio.test.ts

   Needs the Next build (`npx next build` in next/) and a browser.
   Without either it says which and skips, and a skip is not a
   pass.

   ---- what it holds ----

   The studio is seventeen rooms and this drives the two that
   stage 1 opens: the board, whose capture line decides what a
   pasted thing IS and files it, and the library, which lists the
   result. Every write goes to a PostgREST that behaves like one:
   it replaces a column whole, it answers a POST with the row and
   it records everything it was sent, so a check can say what was
   written rather than what the page says it wrote.

   ---- why a browser ----

   Everything here happens after React has hydrated, and the one
   thing a page like this can get wrong while rendering perfectly
   is the server's markup and the browser's disagreeing, which is
   a console warning and a full re-render. It is collected as an
   error here.

   ---- the desk's lesson, carried ----

   `archive/desk-research/threads.test.ts` drove the desk this
   studio replaced. Its fixture answered every GET with the
   reader's own rows, PostgREST-shaped, and the reason it was a
   real test is that it never merged a jsonb column: a page that
   dropped a source on every keystroke passed a kinder fake. The
   same fixture is here.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Page, Route } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, ".next");
const AAB = join(HERE, "..", "aab");
const PORT = 8921;

let passed = 0;
const failures: string[] = [];
const ok = (name: string, condition: unknown, detail: string | null = ""): void => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}: ${detail}` : name);
};

const skip: (why: string) => never = (why) => {
  console.log(`research-studio: SKIPPED, ${why}`);
  console.log("A skip is not a pass.\n");
  process.exit(0);
};

const exists = (path: string): Promise<boolean> => stat(path).then(() => true, () => false);

if (!await exists(join(BUILD, "server/app/tools/research.html"))) {
  skip("next/.next holds no prerendered /tools/research. Run `npx next build` in next/ first.");
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
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname;
  const file = /^\/tools\/research(\/[a-z]+)?$/.test(path)
    ? join(BUILD, `server/app${path}.html`)
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

interface Row { id: string; user_id: string; created_at: string; updated_at: string; [k: string]: unknown }

const ME = "reader-1";
const ago = (days: number): string => new Date(Date.now() - days * 86400000).toISOString();

const source = (
  id: string, title: string, year: number, authors: string, doi: string | null, tags: string[], days: number,
): Row => ({
  id, user_id: ME, type: "article-journal", title, year, authors, doi, isbn: null, url: null,
  identifiers: {}, key: `${authors.split(/\W/)[0].toLowerCase()}${year}${title.split(" ")[0].toLowerCase()}`,
  csl: { type: "article-journal", title, DOI: doi ?? undefined, author: [{ family: authors.split(/\W/)[0] }], issued: { "date-parts": [[year]] } },
  status: "unread", priority: 0, rating: null, why: null, tags, projects: [], collections: [],
  abstract: null, files: [], oa: null, retracted: null, verified: true, hash: `h-${id}`, added_via: "doi",
  deleted_at: null, created_at: ago(days), updated_at: ago(days),
});

const seed = (): Record<string, Row[]> => ({
  research_sources: [
    {
      ...source("s-1", "Weather shocks and farm incomes in Bangladesh", 2021, "Rahman and Khan", "10.1000/farm.2021", ["agriculture", "bd"], 3),
      files: [{ key: PDF_KEY, kind: "pdf", ext: "pdf", size: PDF.byteLength, name: "rahman2021.pdf" }],
    },
    source("s-2", "Bank provisioning over the cycle", 2019, "Ahmed", "10.1000/banks.2019", ["banks"], 9),
  ],
  research_notes: [],
  research_tasks: [],
  research_questions: [],
  research_activity: [],
  research_highlights: [],
  research_searches: [],
  research_projects: [],
  research_collections: [],
  research_lists: [],
});

/** What the Worker answers for a DOI it has looked up. */
const FOUND = {
  ok: true,
  found: {
    via: "crossref",
    csl: {
      type: "article-journal",
      title: "Climate risk and agricultural insurance uptake",
      author: [{ family: "Carter", given: "Michael" }, { family: "Janzen", given: "Sarah" }],
      issued: { "date-parts": [[2018]] },
      "container-title": "Journal of Development Economics",
      DOI: "10.1016/j.jdeveco.2018.03.001",
    },
    openalex: { id: "W123", oa: true, oaUrl: "https://example.org/oa.pdf" },
  },
};

/* ---- a PDF with a text layer, written by hand ----

   Two lines in Helvetica, one of the fourteen standard fonts, so
   nothing is embedded and pdf.js's text layer holds exactly these
   words. The cross-reference table is computed, because a PDF
   whose offsets are wrong is one a reader repairs silently and a
   test should not rely on that. */
const PDF_LINES = ["Weather shocks reduce farm income by 12 per cent.", "The effect is larger for rainfed plots."];
const PDF: Uint8Array = (() => {
  const content = `BT /F1 14 Tf 72 720 Td (${PDF_LINES[0]}) Tj 0 -20 Td (${PDF_LINES[1]}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  ];
  let out = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(out));
    out += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = Buffer.byteLength(out);
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const o of offsets) out += `${String(o).padStart(10, "0")} 00000 n \n`;
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new Uint8Array(Buffer.from(out, "latin1"));
})();
const PDF_KEY = `research/${"reader-1"}/${"c".repeat(64)}.pdf`;

/* ---- one page, with a PostgREST that behaves like one ---- */

interface Sent { method: string; path: string; body: unknown }

async function open(path: string, { signedIn = true }: { signedIn?: boolean } = {}): Promise<{
  page: Page; errors: string[]; sent: Sent[]; rows: Record<string, Row[]>; asked: string[];
}> {
  const page = await browser.newPage();
  const errors: string[] = [];
  const sent: Sent[] = [];
  const asked: string[] = [];
  const rows = seed();
  let made = 0;

  page.on("pageerror", (e: Error) => { errors.push(e.message); });
  page.on("console", (m) => {
    const t = m.text();
    if (/Minified React error #(418|423|425)|did not match|Hydration failed/.test(t)) errors.push(t);
    if (m.type() === "error" && process.env.DEBUG) console.log("console:", t.slice(0, 300));
  });
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());

  if (signedIn) {
    await page.addInitScript((id: string) => {
      localStorage.setItem("reiad-session", JSON.stringify({
        access_token: "not-a-real-token",
        refresh_token: "nor-this",
        expires_at: Date.now() + 3600_000,
        user: { id, email: "me@example.com", user_metadata: { full_name: "Me" } },
      }));
    }, ME);
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
        method, path: url.pathname + url.search,
        body: (() => { try { return request.postDataJSON(); } catch { return null; } })(),
      });
    }
    if (!(table in rows)) return json(table === "profiles" && method === "GET" ? [{ id: ME, research_prefs: {} }] : []);
    const held = rows[table];
    const eq = (k: string): string | null => {
      const v = url.searchParams.get(k);
      return v && v.startsWith("eq.") ? v.slice(3) : null;
    };

    if (method === "GET") {
      let out = held.filter((row) => row.user_id === ME);
      for (const k of ["id", "doi", "isbn", "kind", "lane", "status", "type", "source_id"]) {
        const want = eq(k);
        if (want !== null) out = out.filter((row) => String(row[k]) === want);
      }
      const nul = url.searchParams.get("deleted_at");
      if (nul === "is.null") out = out.filter((row) => !row.deleted_at);
      const like = url.searchParams.get("key");
      if (like?.startsWith("like.")) {
        const prefix = like.slice(5).replace(/\*$/, "");
        out = out.filter((row) => String(row.key).startsWith(prefix));
      }
      const fts = url.searchParams.get("fts");
      if (fts) {
        const q = fts.replace(/^wfts\(simple\)\./, "").toLowerCase();
        out = out.filter((row) => String(row.title).toLowerCase().includes(q));
      }
      asked.push(url.pathname.replace("/rest/v1/", "") + url.search);
      return json([...out].sort((a, b) => b.updated_at.localeCompare(a.updated_at)));
    }
    if (method === "POST") {
      const posted = request.postDataJSON() as Record<string, unknown>[];
      const out: Row[] = posted.map((p) => {
        made += 1;
        const now = new Date().toISOString();
        /* What Postgres fills in: the one default a page reads back. */
        const defaults = table === "research_sources" ? { status: "unread", priority: 0, files: [], tags: [], projects: [], collections: [] } : {};
        const row: Row = { ...defaults, ...p, id: `${table.replace("research_", "")}-${made}-new`, user_id: ME, created_at: now, updated_at: now };
        held.unshift(row);
        return row;
      });
      return json(out, 201);
    }
    if (method === "PATCH") {
      /* A ROUND TRIP HAS A WIDTH. 250ms is a plausible one. */
      await new Promise((go) => setTimeout(go, 250));
      const at = held.findIndex((row) => row.id === eq("id"));
      if (at < 0) return json([]);
      /* WHAT POSTGREST ACTUALLY DOES: every named column is
         replaced whole, jsonb included. */
      held[at] = { ...held[at], ...(request.postDataJSON() as Partial<Row>), updated_at: new Date().toISOString() };
      return json([held[at]]);
    }
    if (method === "DELETE") {
      const at = held.findIndex((row) => row.id === eq("id"));
      if (at >= 0) held.splice(at, 1);
      return json([]);
    }
    return json([]);
  });

  const looked: string[] = [];
  const searched: string[] = [];
  const alerts: string[] = [];
  await page.route("**/api/**", (r: Route) => {
    const u = new URL(r.request().url());
    const answer = (data: unknown, status = 200): Promise<void> =>
      r.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
    if (u.pathname.startsWith("/api/research/lookup/doi/")) {
      looked.push(decodeURIComponent(u.pathname.slice("/api/research/lookup/doi/".length)));
      return answer(FOUND);
    }
    if (u.pathname.startsWith("/api/research/ticket/")) {
      return answer({ ok: true, url: `/api/research/file/${u.pathname.slice("/api/research/ticket/".length)}?t=pass` });
    }
    if (u.pathname.startsWith("/api/research/file/")) {
      /* The bytes, as the Worker serves them: no bearer, a ticket
         in the query, and a PDF. */
      if (u.searchParams.get("t") !== "pass") return answer({ ok: false, reason: "no-ticket" }, 403);
      return r.fulfill({ status: 200, contentType: "application/pdf", body: Buffer.from(PDF) });
    }
    if (u.pathname === "/api/research/files") {
      return answer({ ok: true, bytes: PDF.byteLength, files: 1, cap: 100 * 1024 * 1024, quota: 5 * 1024 * 1024 * 1024 });
    }
    if (u.pathname === "/api/research/search") {
      searched.push(u.search);
      return answer({
        ok: true, ms: 312,
        asked: { openalex: "answered", crossref: "answered", semanticscholar: "failed", arxiv: "not-asked", europepmc: "not-asked", core: "no-key", doaj: "not-asked" },
        hits: [
          { csl: { type: "article-journal", title: "Weather shocks and farm incomes in Bangladesh", DOI: "10.1000/farm.2021", issued: { "date-parts": [[2021]] } },
            doi: "10.1000/farm.2021", title: "Weather shocks and farm incomes in Bangladesh", year: 2021, authors: "Rahman and Khan", venue: "J. Dev. Econ.",
            type: "article-journal", abstract: "", url: null, oa: { isOa: true, url: "https://example.org/oa.pdf" }, cited: 40, from: ["openalex", "crossref"], openalex: "W1", hash: "h-s-1" },
          { csl: { type: "article-journal", title: "Index insurance uptake among smallholders", DOI: "10.1000/ins.2020", issued: { "date-parts": [[2020]] },
              author: [{ family: "Jensen", given: "Nathaniel" }] },
            doi: "10.1000/ins.2020", title: "Index insurance uptake among smallholders", year: 2020, authors: "Jensen", venue: "World Dev.",
            type: "article-journal", abstract: "Uptake is low where basis risk is high.", url: null, oa: null, cited: 12, from: ["openalex"], openalex: "W2", hash: "h-ins" },
        ],
      });
    }
    if (u.pathname === "/api/research/alerts/hits") return answer({ ok: true, hits: [] });
    if (u.pathname.startsWith("/api/research/alerts")) { alerts.push(`${r.request().method()} ${u.pathname}`); return answer({ ok: true, id: "x" }); }
    if (u.pathname === "/api/research/status") {
      return answer({ ok: true, services: { crossref: "on", openalex: "off", openlibrary: "on" } });
    }
    return answer({ ok: true });
  });
  (rows as Record<string, unknown>).looked = looked as unknown as Row[];
  (rows as Record<string, unknown>).searched = searched as unknown as Row[];
  (rows as Record<string, unknown>).alerts = alerts as unknown as Row[];

  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  return { page, errors, sent, rows, asked };
}

const bodyText = (page: Page): Promise<string> =>
  page.evaluate(() => document.body.textContent ?? "");

const posts = (sent: Sent[], table: string): Sent[] =>
  sent.filter((s) => s.method === "POST" && s.path.startsWith(`/rest/v1/${table}`));

const firstOf = (s: Sent | undefined): Record<string, unknown> =>
  ((s?.body as Record<string, unknown>[] | null)?.[0]) ?? {};

/* ============================================================
   1. signed out, a room invites rather than blanks
   ============================================================ */

for (const path of ["/tools/research", "/tools/research/library", "/tools/research/read", "/tools/research/find"]) {
  const { page, errors } = await open(path, { signedIn: false });
  const words = await bodyText(page);
  ok(`${path} signed out says whose it is`, words.includes("This is yours"), words.slice(0, 200));
  ok(`${path} signed out offers a way in`, await page.locator('a[href="/account"]', { hasText: "Sign in" }).count() >= 1);
  ok(`${path} signed out draws no capture box or list`,
    await page.locator("#rs-capture, .rs-rows").count() === 0);
  ok(`${path} still carries the studio's strip of rooms`,
    await page.locator('a[href="/tools/research/library"]').count() >= 1);
  ok(`${path} signed out threw nothing`, errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   2. the board's capture line decides what a thing is
   ============================================================ */

{
  const { page, errors, sent, rows } = await open("/tools/research");
  ok("signed in, the board draws the capture line", await page.locator("#rs-capture").count() === 1);

  /* ---- a DOI is looked up and filed as a source ---- */
  await page.locator("#rs-capture").fill("10.1016/j.jdeveco.2018.03.001");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(700);

  const looked = rows.looked as unknown as string[];
  ok("a DOI is sent to the Worker's lookup, not to the browser's own fetch",
    looked.length === 1 && looked[0] === "10.1016/j.jdeveco.2018.03.001", looked.join(","));
  const added = posts(sent, "research_sources");
  ok("and the answer is filed as ONE source row", added.length === 1, `${added.length} POST(s)`);
  const row = firstOf(added[0]);
  ok("with the title the index answered", row.title === "Climate risk and agricultural insurance uptake");
  ok("the year, the authors and the DOI in their own columns",
    row.year === 2018 && String(row.authors).includes("Carter") && row.doi === "10.1016/j.jdeveco.2018.03.001",
    JSON.stringify({ year: row.year, authors: row.authors, doi: row.doi }));
  ok("a citation key made from the author, the year and the first real word",
    row.key === "carter2018climate", String(row.key));
  ok("the CSL record kept whole, carrying that key as its id",
    (row.csl as { id?: string; DOI?: string })?.id === row.key && (row.csl as { DOI?: string }).DOI === row.doi);
  ok("marked verified because an index answered for it", row.verified === true);
  ok("and saying it arrived as a DOI", row.added_via === "doi");
  ok("open access noted from OpenAlex", (row.oa as { isOa?: boolean } | null)?.isOa === true);
  ok("the row belongs to the reader", row.user_id === ME);

  const logged = posts(sent, "research_activity");
  ok("every write is a line in the activity log", logged.length >= 1, `${logged.length} line(s)`);
  const line = firstOf(logged[0]);
  ok("naming the table, the row and what happened",
    line.kind === "sources" && line.action === "added" && typeof line.item_id === "string" && line.item_id.endsWith("-new"),
    JSON.stringify(line));

  const said = await page.locator('[role="status"]').last().textContent() ?? "";
  ok("the board says what it decided", said.includes("A DOI"), said);
  ok("and links to the source it made",
    await page.locator('[role="status"] a[href^="/tools/research/library/"]').count() === 1);
  ok("and the line is cleared for the next thing", await page.locator("#rs-capture").inputValue() === "");

  /* ---- the same DOI again opens what is there ---- */
  await page.locator("#rs-capture").fill("10.1016/j.jdeveco.2018.03.001");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(700);
  ok("a DOI already in the library is not filed twice",
    posts(sent, "research_sources").length === 1, `${posts(sent, "research_sources").length} POST(s)`);
  ok("and the board says so", ((await page.locator('[role="status"]').last().textContent()) ?? "").includes("Already in the library"));

  /* ---- a todo is a task, a sentence is a capture ---- */
  await page.locator("#rs-capture").fill("todo: read the BB circular on provisioning");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  const task = firstOf(posts(sent, "research_tasks")[0]);
  ok("a line starting todo becomes a task", task.title === "read the BB circular on provisioning", JSON.stringify(task));
  ok("in the week lane", task.lane === "week");

  await page.locator("#rs-capture").fill("Farmers in Rangpur insure against flood, not drought");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  const note = firstOf(posts(sent, "research_notes")[0]);
  ok("a sentence becomes a capture in the inbox", note.kind === "capture" && String(note.text).startsWith("Farmers in Rangpur"), JSON.stringify(note));
  ok("with the sentence as its title", note.title === "Farmers in Rangpur insure against flood, not drought");

  /* ---- the keyboard ---- */
  await page.locator("h1").click();
  await page.keyboard.press("c");
  ok("c puts the caret in the capture line",
    await page.evaluate(() => document.activeElement?.id) === "rs-capture",
    await page.evaluate(() => document.activeElement?.id ?? "?"));
  await page.keyboard.type("hello");
  await page.keyboard.press("c");
  ok("and c typed INTO it is a letter rather than a shortcut",
    await page.locator("#rs-capture").inputValue() === "helloc");

  /* `/` IS THE SITE'S. It opens the command palette from
     `aab/src/app.ts` on every page; the desk took it for one build
     and the search box and the palette fought over the focus. */
  await page.keyboard.press("Escape");
  await page.locator("h1").click();
  await page.keyboard.press("/");
  await page.waitForTimeout(200);
  ok("/ still belongs to the site's palette rather than to the studio",
    await page.evaluate(() => document.activeElement?.id) === "palette-input",
    await page.evaluate(() => document.activeElement?.id ?? "?"));
  await page.keyboard.press("Escape");

  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   3. the library lists what the account holds
   ============================================================ */

{
  const { page, errors, asked } = await open("/tools/research/library");
  ok("the library lists every source", await page.locator(".rs-row").count() === 2,
    `${await page.locator(".rs-row").count()} row(s)`);
  ok("asking for the reader's rows and nobody else's",
    asked.some((a) => a.startsWith("research_sources?") && a.includes(`user_id=eq.${ME}`)), asked.join("\n"));
  ok("newest touched first", (await page.locator(".rs-row").first().textContent() ?? "").includes("Weather shocks"));
  ok("each row carries its author and year",
    (await page.locator(".rs-row").first().textContent() ?? "").includes("2021"));

  await page.locator("#rs-find").fill("banks");
  await page.waitForTimeout(150);
  ok("the find box narrows the list", await page.locator(".rs-row").count() === 1);
  ok("to the row whose tag matched", (await page.locator(".rs-row").first().textContent() ?? "").includes("Bank provisioning"));
  await page.locator("#rs-find").fill("");
  await page.waitForTimeout(150);

  await page.locator("h1").click();
  await page.keyboard.press("f");
  ok("f puts the caret in the find box",
    await page.evaluate(() => document.activeElement?.id) === "rs-find",
    await page.evaluate(() => document.activeElement?.id ?? "?"));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(120);
  ok("Escape takes it back out", await page.evaluate(() => document.activeElement?.id) !== "rs-find");

  await page.locator(".rs-row").first().click();
  await page.waitForTimeout(200);
  ok("opening a row shows the record beside the list",
    (await page.locator(".rs-main").textContent() ?? "").includes("10.1000/farm.2021"),
    (await page.locator(".rs-main").textContent() ?? "").slice(0, 200));
  await page.keyboard.press("j");
  await page.waitForTimeout(150);
  ok("j walks to the next row",
    (await page.locator('.rs-row[aria-current="true"]').textContent() ?? "").includes("Bank provisioning"));

  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   4. the reading room: the queue, and a highlight anchored to text
   ============================================================ */

{
  const { page, errors, sent } = await open("/tools/research/read");
  ok("the queue lists the source with a file and not the one without",
    await page.locator(".rs-row").count() === 1, `${await page.locator(".rs-row").count()} row(s)`);
  await page.locator("h1").click();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  ok("Enter opens the top of the queue", page.url().includes("source=s-1") && page.url().includes("file="), page.url());
  ok("and nothing threw on the way", errors.length === 0, errors.join(" | "));
  await page.close();
}

{
  const { page, errors, sent, rows } = await open(`/tools/research/read?source=s-1&file=${encodeURIComponent(PDF_KEY)}`);
  await page.waitForSelector(".rs-textlayer span", { timeout: 20000 }).catch(() => null);
  const spans = await page.locator(".rs-textlayer span").count();
  ok("pdf.js draws the page and lays the words over it, from a worker served by this origin", spans >= 2, `${spans} span(s)`);
  const words = await page.locator(".rs-textlayer").textContent() ?? "";
  ok("and the text layer holds the file's own words", words.includes("rainfed plots"), words.slice(0, 120));
  await page.waitForTimeout(400);
  ok("where the reader is goes on the row, with the page count",
    sent.some((x) => x.method === "PATCH" && x.path.includes("research_sources")
      && (x.body as { files?: { pages?: number }[] })?.files?.[0]?.pages === 1),
    JSON.stringify(sent.filter((x) => x.method === "PATCH").map((x) => x.body)));

  /* ---- select four words and press 2 ---- */
  const selected = await page.evaluate(() => {
    const span = [...document.querySelectorAll(".rs-textlayer span")].find((el) => (el.textContent ?? "").includes("rainfed"));
    const node = span?.firstChild as Text | null;
    if (!node) return null;
    const text = node.data;
    const range = document.createRange();
    range.setStart(node, text.indexOf("larger"));
    range.setEnd(node, text.indexOf("plots") + "plots".length);
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    return sel?.toString() ?? null;
  });
  ok("a selection over the text layer is the words under it", selected === "larger for rainfed plots", String(selected));
  await page.waitForTimeout(250);
  ok("and the five meanings appear under it", await page.locator(".rs-hl-bar").count() === 1);
  await page.keyboard.press("2");
  await page.waitForTimeout(500);
  const made = posts(sent, "research_highlights");
  ok("2 files ONE highlight", made.length === 1, `${made.length} POST(s)`);
  const h = firstOf(made[0]) as { meaning?: string; page?: number; quote?: string; prefix?: string; suffix?: string; rects?: number[][]; source_id?: string; file_key?: string };
  ok("as evidence, on page one, of this source and this file",
    h.meaning === "evidence" && h.page === 1 && h.source_id === "s-1" && h.file_key === PDF_KEY, JSON.stringify(h));
  ok("anchored to the words and their neighbours, not to pixels",
    h.quote === "larger for rainfed plots" && (h.prefix ?? "").endsWith("The effect is ") && (h.suffix ?? "").startsWith("."),
    JSON.stringify({ quote: h.quote, prefix: h.prefix, suffix: h.suffix }));
  ok("with the rectangles beside them as a cache, in the page's own units",
    Array.isArray(h.rects) && h.rects.length >= 1 && h.rects[0].length === 4 && h.rects[0][2] > 20 && h.rects[0][2] < 400,
    JSON.stringify(h.rects));
  ok("and the selection is cleared", await page.evaluate(() => getSelection()?.isCollapsed ?? true));
  ok("the highlight is drawn over the page", await page.locator(".rs-mark").count() >= 1);
  const card = await page.locator(".rs-hl-card").count() ? (await page.locator(".rs-hl-card").first().textContent() ?? "") : "";
  ok("and has a card with its page and its words", card.includes("larger for rainfed plots") && /Page|পাতা/.test(card), card.slice(0, 160));
  ok("and the activity log has a line for it",
    posts(sent, "research_activity").some((x) => (firstOf(x) as { kind?: string }).kind === "highlights"));

  /* ---- it survives a reload, and its rectangles going ---- */
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector(".rs-mark", { timeout: 20000 }).catch(() => null);
  ok("a highlight survives a reload", await page.locator(".rs-mark").count() >= 1);
  if (rows.research_highlights[0]) rows.research_highlights[0].rects = [];
  const before = sent.filter((x) => x.method === "PATCH" && x.path.includes("research_highlights")).length;
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector(".rs-mark", { timeout: 20000 }).catch(() => null);
  ok("AND IS FOUND BY ITS QUOTE WHEN ITS RECTANGLES ARE REMOVED", await page.locator(".rs-mark").count() >= 1,
    `${await page.locator(".rs-mark").count()} mark(s)`);
  await page.waitForTimeout(300);
  const wroteBack = sent.filter((x) => x.method === "PATCH" && x.path.includes("research_highlights")).slice(before);
  ok("and the rectangles found are written back as the cache",
    wroteBack.some((x) => Array.isArray((x.body as { rects?: unknown[] }).rects) && ((x.body as { rects: unknown[] }).rects).length >= 1),
    JSON.stringify(wroteBack.map((x) => x.body)));

  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   5. finding: one search, every index, and the library drawn on it
   ============================================================ */

{
  const { page, errors, sent, rows } = await open("/tools/research/find");
  await page.locator("#rs-fq").fill("weather shocks farm income");
  await page.locator("#rs-ff").fill("2018");
  await page.locator("#rs-fq").press("Enter");
  await page.waitForTimeout(600);
  const searched = rows.searched as unknown as string[];
  ok("the query goes to the Worker with its fields, never to an index",
    searched.length === 1 && searched[0].includes("q=weather+shocks+farm+income") && searched[0].includes("from=2018"), searched.join(" "));
  ok("two hits are drawn", await page.locator(".rs-main li").count() === 2, `${await page.locator(".rs-main li").count()} row(s)`);
  const first = await page.locator(".rs-main li").first().textContent() ?? "";
  ok("a hit says which indexes had it", first.includes("OpenAlex") && first.includes("Crossref"), first.slice(0, 200));
  ok("and that a free copy exists", /free copy|বিনামূল্যের কপি/.test(first));
  ok("a work already in the library says so with its status, not an Add",
    /unread|অপঠিত/i.test(first) && !/Add\b/.test(first), first.slice(0, 200));
  ok("and links to its record", await page.locator('.rs-main li a[href="/tools/research/library/s-1"]').count() === 1);
  const summary = await page.locator(".rs-main").textContent() ?? "";
  ok("an index that did not answer is said so, not shown as empty", /Semantic Scholar: (did not answer|উত্তর দেয়নি)/.test(summary), summary.slice(0, 300));

  const addBtn = page.locator(".rs-main li").nth(1).getByRole("button", { name: /Add|যোগ/ });
  if (await addBtn.count()) await addBtn.click(); else failures.push(`no Add on row two: ${(await page.locator(".rs-main").textContent() ?? "").slice(0, 300)}`);
  await page.waitForTimeout(400);
  const added = firstOf(posts(sent, "research_sources")[0]);
  ok("Add files the hit as a verified source that arrived by search",
    added.title === "Index insurance uptake among smallholders" && added.added_via === "search" && added.verified === true && added.key === "jensen2020index",
    JSON.stringify({ title: added.title, via: added.added_via, key: added.key }));
  await page.waitForTimeout(400);
  ok("and the row now says it is in the library", /unread|অপঠিত/i.test(await page.locator(".rs-main li").nth(1).textContent() ?? ""),
    (await page.locator(".rs-main li").nth(1).textContent() ?? "").slice(0, 200));

  const keepBtn = page.getByRole("button", { name: /Keep this search|এই খোঁজ রাখুন/ });
  if (await keepBtn.count()) await keepBtn.click();
  await page.waitForTimeout(400);
  const kept = firstOf(posts(sent, "research_searches")[0]);
  ok("keeping the search writes the search log's line: the string, the fields, the databases, the count",
    kept.query === "weather shocks farm income" && (kept.fields as { from?: number }).from === 2018 && Array.isArray(kept.databases) && kept.hits === 2,
    JSON.stringify(kept));
  const alertBtn = page.locator(".rs-list").getByRole("button", { name: /Alert off|সতর্কতা বন্ধ/ });
  if (await alertBtn.count()) await alertBtn.click();
  await page.waitForTimeout(400);
  const alerts = rows.alerts as unknown as string[];
  ok("switching the alert on copies the search to D1 for the cron", alerts.some((a) => a.startsWith("PUT /api/research/alerts")), alerts.join(","));
  ok("and the row carries the flag", sent.some((x) => x.method === "PATCH" && x.path.includes("research_searches") && (x.body as { alert?: boolean }).alert === true));
  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

await browser.close();
server.close();

console.log(`research-studio: ${passed} passed, ${failures.length} failed`);
if (failures.length) {
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}
