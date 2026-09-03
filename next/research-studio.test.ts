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
  ".wasm": "application/wasm",
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
  research_questions: [
    { id: "q-1", user_id: ME, project_id: null, parent_id: null, kind: "question", text: "Do weather shocks lower farm income?", state: "open", tags: [], position: 0,
      body: { evidence: [{ source_id: "s-1", stance: "supports", page: "3" }, { source_id: "s-2", stance: "context" }] }, created_at: ago(4), updated_at: ago(4) },
  ],
  research_activity: [],
  research_highlights: [],
  research_searches: [],
  research_documents: [],
  research_versions: [],
  research_events: [],
  research_sessions: [],
  research_people: [],
  research_reviews: [],
  research_review_records: [],
  research_datasets: [],
  research_transforms: [],
  research_runs: [],
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
    if ((m.type() === "error" || m.type() === "warning") && process.env.DEBUG && !/fonts|ERR_FAILED|404|view-transition/.test(t)) console.log("console:", t.slice(0, 400));
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
      for (const k of ["id", "doi", "isbn", "hash", "kind", "lane", "status", "type", "source_id", "review_id", "day"]) {
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
        const defaults = table === "research_sources" ? { status: "unread", priority: 0, files: [], tags: [], projects: [], collections: [] }
          : table === "research_documents" ? { position: 0, outline: [], body: "<p></p>", text: "", budget: null, style: "apa", state: "outline", meta: {}, deleted_at: null }
          : table === "research_reviews" ? { project_id: null, protocol: {}, state: "protocol" }
          : table === "research_review_records" ? { database: "", search_id: null, stage: "found", reason: null, decided_at: null, source_id: null, extraction: {}, appraisal: {} }
          : table === "research_datasets" ? { project_id: null, source_id: null, files: [], dictionary: [], provenance: {}, licence: null, notes: null, rows: null, columns: null, hash: "", raw: false }
          : table === "research_transforms" ? { position: 0 }
          : table === "research_runs" ? { dataset_id: null, project_id: null, label: "", input: {}, code: "", data_hash: "", output: {}, figure: null, ms: null } : {};
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
  const stored = new Map<string, { bytes: Buffer; type: string }>();
  const searched: string[] = [];
  const alerts: string[] = [];
  const calendar: { ics: string }[] = [];
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
    if (u.pathname === "/api/research/file" && r.request().method() === "PUT") {
      /* An upload: the bytes kept by key, so the lab can read them
         back on a ticket exactly as R2 would serve them. */
      const name = u.searchParams.get("name") ?? "file";
      const ext = name.split(".").pop() ?? "bin";
      const bytes = r.request().postDataBuffer() ?? Buffer.alloc(0);
      const key = `research/${ME}/up-${stored.size + 1}.${ext}`;
      stored.set(key, { bytes, type: r.request().headers()["content-type"] ?? "application/octet-stream" });
      return answer({ ok: true, key, ext, size: bytes.byteLength, already: false });
    }
    if (u.pathname.startsWith("/api/research/file/")) {
      /* The bytes, as the Worker serves them: no bearer, a ticket
         in the query, and a PDF, or whatever was uploaded. */
      if (u.searchParams.get("t") !== "pass") return answer({ ok: false, reason: "no-ticket" }, 403);
      const key = decodeURIComponent(u.pathname.slice("/api/research/file/".length));
      const held = stored.get(key);
      if (held) return r.fulfill({ status: 200, contentType: held.type, body: held.bytes });
      return r.fulfill({ status: 200, contentType: "application/pdf", body: Buffer.from(PDF) });
    }
    if (u.pathname.startsWith("/api/research/market/")) {
      const symbol = decodeURIComponent(u.pathname.slice("/api/research/market/".length));
      const bars = [101, 102.5, 101.8, 103.2, 104, 103.1].map((close, i) => ({ date: `2024-02-0${i + 1}`, open: close - 0.5, high: close + 1, low: close - 1, close, volume: 1000 + i }));
      return answer({ ok: true, series: { symbol, source: "Alpha Vantage", fetched: "2024-02-07T00:00:00.000Z", bars } });
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
    if (u.pathname === "/api/research/calendar") { calendar.push(r.request().postDataJSON() as { ics: string }); return answer({ ok: true, token: "t".repeat(48), url: `/api/research/ics/${"t".repeat(48)}` }); }
    if (u.pathname.startsWith("/api/research/alerts")) { alerts.push(`${r.request().method()} ${u.pathname}`); return answer({ ok: true, id: "x" }); }
    if (u.pathname.startsWith("/api/research/orcid/")) {
      return answer({ ok: true, works: [{ csl: { type: "article-journal", title: "Drought and credit", DOI: "10.1000/orcid.1", issued: { "date-parts": [[2024]] } }, doi: "10.1000/orcid.1", title: "Drought and credit", year: 2024, authors: "Carter", venue: "", type: "article-journal", abstract: "", url: null, oa: null, cited: 3, from: ["orcid"], openalex: null, hash: "h-orcid" }] });
    }
    if (u.pathname === "/api/research/status") {
      return answer({ ok: true, services: { crossref: "on", openalex: "off", openlibrary: "on" } });
    }
    return answer({ ok: true });
  });
  (rows as Record<string, unknown>).looked = looked as unknown as Row[];
  (rows as Record<string, unknown>).searched = searched as unknown as Row[];
  (rows as Record<string, unknown>).alerts = alerts as unknown as Row[];
  (rows as Record<string, unknown>).calendar = calendar as unknown as Row[];

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

for (const path of ["/tools/research", "/tools/research/library", "/tools/research/read", "/tools/research/find", "/tools/research/write", "/tools/research/plan", "/tools/research/atlas"]) {
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

/* ============================================================
   6. the writing desk: a chip, a style, a footnote, an export
   ============================================================ */

{
  const { page, errors, sent, rows } = await open("/tools/research/write");
  await page.locator("#rs-d-new").fill("Chapter 3: weather shocks");
  await page.locator("#rs-d-new").press("Enter");
  await page.waitForTimeout(900);
  const made = firstOf(posts(sent, "research_documents")[0]);
  ok("a document is a row: kind, style and an empty body", made.title === "Chapter 3: weather shocks" && made.kind === "chapter" && made.style === "apa", JSON.stringify(made));
  await page.waitForSelector(".rs-editor", { timeout: 10000 }).catch(() => null);
  ok("the site's editor is mounted for it", await page.locator(".rs-editor[contenteditable]").count() === 1);

  /* ---- type, cite, and read the chip back ---- */
  await page.locator(".rs-editor").click();
  await page.keyboard.type("Farm incomes fall after a shock ");
  await page.keyboard.press("@");
  await page.waitForTimeout(400);
  const byKey = await page.locator("#rs-c-q").count() === 1;
  ok("@ in the text opens the picker over the library", byKey);
  if (!byKey) { await page.getByRole("button", { name: /Cite|উদ্ধৃত করুন/ }).first().click(); await page.waitForTimeout(300); }
  if (!await page.locator("#rs-c-q").count()) { failures.push("no picker at all"); await page.close(); await browser.close(); server.close(); process.exit(1); }
  await page.locator("#rs-c-q").fill("weather");
  await page.locator("#rs-c-loc").fill("14");
  await page.locator("#rs-c-loc").press("Enter");
  await page.waitForTimeout(2500);
  const chips = await page.locator(".rs-editor a.cite").count();
  ok("a chip lands in the text", chips === 1, `${chips} chip(s)`);
  if (!chips) { failures.push(`no chip: ${(await page.locator(".rs-editor").innerHTML()).slice(0, 300)}`); await page.close(); await browser.close(); server.close(); console.log(failures.join("\n")); process.exit(1); }
  const href = await page.locator(".rs-editor a.cite").first().getAttribute("href") ?? "";
  ok("carrying the key and the locator in its href", href.startsWith("#cite=rahman2021weather") && href.includes("loc=14"), href);
  const apa = (await page.locator(".rs-editor a.cite").first().textContent() ?? "").trim();
  ok("and rendered by citeproc in APA", /Rahman.*2021.*p\. ?14/.test(apa), apa);
  await page.waitForTimeout(800);
  const bibText = await page.locator(".bib").count() ? await page.locator(".bib").first().textContent() ?? "" : "";
  ok("the bibliography is made from the chips, never typed", bibText.includes("Rahman") && bibText.includes("Weather shocks"), bibText.slice(0, 160));
  ok("a cited source moves to status cited",
    sent.some((x) => x.method === "PATCH" && x.path.includes("research_sources") && x.path.includes("s-1") && (x.body as { status?: string }).status === "cited"));
  const saved = sent.filter((x) => x.method === "PATCH" && x.path.includes("research_documents")).map((x) => x.body as { body?: string });
  ok("the body is saved with the chip in it", saved.some((b) => (b.body ?? "").includes("#cite=rahman2021weather")), `${saved.length} save(s)`);

  /* ---- the same chip in OSCOLA is a different rendering ---- */
  await page.locator("#rs-d-style").selectOption("oscola");
  await page.waitForTimeout(2500);
  const oscola = (await page.locator(".rs-editor a.cite").first().textContent() ?? "").trim();
  ok("changing the style renders every chip again out of the same href", oscola !== apa && oscola.length > 0, `apa=${apa} oscola=${oscola}`);
  ok("and the row remembers the style", sent.some((x) => x.method === "PATCH" && x.path.includes("research_documents") && (x.body as { style?: string }).style === "oscola"));

  /* ---- a footnote ---- */
  await page.locator(".rs-editor").click();
  await page.keyboard.press("End");
  await page.getByRole("button", { name: /Footnote|পাদটীকা/ }).click();
  await page.waitForTimeout(400);
  ok("a footnote is a marker in the text and a note at the foot, numbered by position",
    await page.locator(".rs-editor sup a.fn-ref").count() === 1 && await page.locator(".rs-editor ol.fn li").count() === 1
      && (await page.locator(".rs-editor sup a.fn-ref").first().textContent()) === "1",
    (await page.locator(".rs-editor").innerHTML()).slice(-400));

  /* ---- exports ---- */
  await page.getByRole("button", { name: /^Export$|^রপ্তানি$/ }).click();
  await page.waitForTimeout(1500);
  ok("the exports are offered as files: Word, Markdown, LaTeX and BibTeX",
    await page.locator('a[download$=".docx"]').count() === 1 && await page.locator('a[download$=".md"]').count() === 1
      && await page.locator('a[download$=".tex"]').count() === 1 && await page.locator('a[download$=".bib"]').count() === 1);
  const md = await page.evaluate(async () => {
    const a = document.querySelector<HTMLAnchorElement>('a[download$=".md"]');
    return a ? fetch(a.href).then((r) => r.text()) : "";
  });
  ok("and the Markdown carries the Pandoc citation with its page", md.includes("[@rahman2021weather, p. 14]"), md.slice(0, 200));

  ok("the outline pane lists no heading yet and the counts are derived",
    /words|শব্দ/.test(await page.locator(".rs-main").textContent() ?? ""));
  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  void rows;
  await page.close();
}

/* ============================================================
   7. the planner: a date, the calendar out, and a session logged
   ============================================================ */

{
  const { page, errors, sent, rows } = await open("/tools/research/plan");
  await page.getByRole("button", { name: /2 Dates|2 তারিখ/ }).click();
  await page.waitForTimeout(400);
  await page.locator("#rs-e-title").fill("Proposal due");
  await page.locator("#rs-e-kind").selectOption("deadline");
  await page.locator("#rs-e-when").fill("2026-10-01");
  await page.locator("#rs-e-place").fill("Lincoln");
  await page.locator("#rs-e-title").press("Enter");
  await page.waitForTimeout(500);
  const ev = firstOf(posts(sent, "research_events")[0]);
  ok("a date is a row with its kind, its day and its place", ev.title === "Proposal due" && ev.kind === "deadline" && String(ev.starts).startsWith("2026-10-01") && ev.all_day === true && ev.place === "Lincoln", JSON.stringify(ev));
  ok("and is listed with the days to go", /Proposal due/.test(await page.locator(".rs-main").textContent() ?? ""));

  await page.getByRole("button", { name: /Make the address|ঠিকানা তৈরি করুন/ }).click();
  await page.waitForTimeout(500);
  const cal = rows.calendar as unknown as { ics: string }[];
  ok("the calendar goes out as one iCalendar file the browser wrote", cal.length === 1 && cal[0].ics.startsWith("BEGIN:VCALENDAR") && cal[0].ics.includes("SUMMARY:Proposal due (deadline)"), cal[0]?.ics.slice(0, 120));
  ok("and the subscription address is shown", /\/api\/research\/ics\/t{48}/.test(await page.locator(".rs-list").textContent() ?? ""));

  await page.getByRole("button", { name: /4 Sessions|4 সেশন/ }).click();
  await page.waitForTimeout(400);
  await page.locator("#rs-ss-room").fill("Lab");
  await page.getByRole("button", { name: /Start a session|সেশন শুরু/ }).click();
  await page.waitForTimeout(500);
  const ss = firstOf(posts(sent, "research_sessions")[0]);
  ok("a session starts as a row with the room and no end", ss.room === "Lab" && ss.ended === null, JSON.stringify(ss));
  ok("and a timer is shown", await page.locator('[role="timer"]').count() === 1);
  await page.locator("#rs-ss-note").fill("Reproduced table 3");
  await page.getByRole("button", { name: /^Stop$|^থামুন$/ }).click();
  await page.waitForTimeout(700);
  ok("stopping ends the row with the note", sent.some((x) => x.method === "PATCH" && x.path.includes("research_sessions") && (x.body as { ended?: string; note?: string }).ended && (x.body as { note?: string }).note === "Reproduced table 3"));
  const day = firstOf(posts(sent, "research_notes").slice(-1)[0]) as { kind?: string; text?: string; day?: string };
  ok("and writes a line to today's daily note, made if there was none", day.kind === "daily" && /Reproduced table 3/.test(day.text ?? "") && day.day === new Date().toISOString().slice(0, 10), JSON.stringify(day));
  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   8. questions and the atlas: the map, the gaps, a graph, a person
   ============================================================ */

{
  const { page, errors, sent } = await open("/tools/research/questions");
  await page.getByRole("button", { name: /Argument map|যুক্তির মানচিত্র/ }).click();
  await page.waitForTimeout(300);
  ok("the argument map is questions by sources with a mark for each stance",
    await page.locator('[data-testid="rs-argmap"] tbody tr').count() === 1 && await page.locator('[data-testid="rs-argmap"] tbody .rs-row-dot').count() === 2,
    `${await page.locator('[data-testid="rs-argmap"] tbody .rs-row-dot').count()} mark(s)`);
  await page.getByRole("button", { name: /Gap matrix|ফাঁকের ছক/ }).click();
  await page.waitForTimeout(300);
  const gapsText = await page.locator(".rs-page").textContent() ?? "";
  ok("the gap matrix is tags by sources and counts the empty cells", await page.locator('[data-testid="rs-gaps"] tbody tr').count() === 3 && /3 (gaps|ফাঁক)/.test(gapsText), gapsText.slice(0, 200));
  await page.getByRole("button", { name: /Variables|চলক/ }).first().click();
  await page.waitForTimeout(300);
  await page.locator("#rs-v-name").fill("Herding");
  await page.locator("#rs-v-measure").fill("CSAD");
  await page.locator("#rs-v-name").press("Enter");
  await page.waitForTimeout(600);
  const v = firstOf(posts(sent, "research_questions")[0]);
  ok("a variable is a question row of kind variable", v.kind === "variable" && v.text === "Herding", JSON.stringify(v));
  ok("and its measure is written into the body", sent.some((x) => x.method === "PATCH" && x.path.includes("research_questions") && (x.body as { body?: { measure?: string } }).body?.measure === "CSAD"));
  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

{
  const { page, errors, sent } = await open("/tools/research/atlas");
  await page.waitForTimeout(600);
  const dots = await page.locator(".rs-graph circle").count();
  ok("the graph draws a dot for every source and question and a line for each evidence row", dots === 3 && await page.locator(".rs-graph line").count() === 2, `${dots} dot(s), ${await page.locator(".rs-graph line").count()} line(s)`);
  const first = await page.locator(".rs-graph a").first().getAttribute("href") ?? "";
  ok("and a dot is a press away from its page", first.startsWith("/tools/research/"), first);
  await page.getByRole("button", { name: /3 Literature timeline|3 সাহিত্যের সময়রেখা/ }).click();
  await page.waitForTimeout(300);
  ok("the literature timeline is one dot a dated source", await page.locator(".rs-graph circle").count() === 2);
  await page.getByRole("button", { name: /4 People|4 মানুষ/ }).click();
  await page.waitForTimeout(300);
  await page.locator("#rs-pp-name").fill("Michael Carter");
  await page.locator("#rs-pp-orcid").fill("0000-0001-2345-6789");
  await page.locator("#rs-pp-inst").fill("UC Davis");
  await page.locator("#rs-pp-name").press("Enter");
  await page.waitForTimeout(500);
  const p = firstOf(posts(sent, "research_people")[0]);
  ok("a person is a row with a role, an ORCID and an institution", p.name === "Michael Carter" && p.role === "supervisor" && p.orcid === "0000-0001-2345-6789" && p.institution === "UC Davis", JSON.stringify(p));
  await page.locator(".rs-row", { hasText: "Michael Carter" }).click();
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: /Published, by ORCID|প্রকাশিত, ORCID/ }).click();
  await page.waitForTimeout(500);
  ok("an ORCID brings what they have published, through the Worker", (await page.locator(".rs-main").textContent() ?? "").includes("Drought and credit"));
  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   9. the review room: a protocol with numbered criteria, a search
      kept as the log and imported as records, screening by
      keyboard, a record the library already holds linked rather
      than added twice, and PRISMA out of the rows
   ============================================================ */

{
  const { page, errors, sent } = await open("/tools/research/review");
  await page.waitForTimeout(500);
  ok("a signed-in reader with no review is invited to start one", ((await page.locator(".rs-list").textContent()) ?? "").includes("No review yet"));
  await page.locator("#rs-rev-title").fill("Weather risk and farm credit");
  await page.locator("#rs-rev-title").press("Enter");
  await page.waitForTimeout(600);
  const rv = firstOf(posts(sent, "research_reviews")[0]);
  ok("a review is a row with a kind and an empty protocol", rv.title === "Weather risk and farm credit" && rv.kind === "systematic" && rv.state === "protocol", JSON.stringify(rv));
  await page.locator("#rs-rev-criteria").fill("Empirical, farm-level data\n- Not about weather or climate risk\n- No English full text");
  await page.getByRole("button", { name: /Save the protocol|প্রোটোকল রাখুন/ }).click();
  await page.waitForTimeout(700);
  const protoPatches = sent.filter((x) => x.method === "PATCH" && x.path.includes("research_reviews"));
  const proto = (protoPatches[protoPatches.length - 1]?.body as { protocol?: { criteria?: { id: string; kind: string; text: string }[] } } | undefined)?.protocol;
  ok("criteria get an id each and a line starting with minus is an exclusion",
    proto?.criteria?.length === 3 && proto.criteria[0].id === "I1" && proto.criteria[1].id === "E1" && proto.criteria[1].kind === "exclude" && proto.criteria[2].id === "E2", JSON.stringify(proto));
  await page.getByRole("button", { name: /2 Search log|2 খোঁজের লগ/ }).click();
  await page.waitForTimeout(300);
  await page.locator("#rs-rev-q").fill("weather shocks credit");
  await page.locator("#rs-rev-q").press("Enter");
  await page.waitForTimeout(1200);
  const kept = firstOf(posts(sent, "research_searches")[0]);
  ok("a search run here is kept with the review's id on it, which is the search log", typeof kept.review_id === "string" && String(kept.review_id).startsWith("reviews-") && kept.query === "weather shocks credit", JSON.stringify(kept));
  const imported = posts(sent, "research_review_records").flatMap((x) => x.body as Record<string, unknown>[]);
  ok("and its hits are records rather than sources, filed under the database that returned them",
    imported.length === 2 && imported.every((r) => r.stage === "found" && r.database === "openalex") && posts(sent, "research_sources").length === 0,
    `${imported.length} record(s): ${JSON.stringify(imported.map((r) => r.database))}`);
  ok("the log lists the search with its date and hits", await page.locator('[data-testid="rs-rev-searches"] tbody tr').count() === 1 && ((await page.locator('[data-testid="rs-rev-searches"]').textContent()) ?? "").includes("weather shocks credit"));
  await page.getByRole("button", { name: /3 Screen|3 যাচাই/ }).click();
  await page.waitForTimeout(300);
  ok("screening shows the first record with its abstract, or says there is none", ((await page.locator('[data-testid="rs-rev-record"]').textContent()) ?? "").includes("Weather shocks and farm incomes"));
  await page.keyboard.press("y");
  await page.waitForTimeout(500);
  await page.keyboard.press("x");
  await page.waitForTimeout(200);
  ok("x opens the exclusion reasons, numbered", await page.locator('[data-testid="rs-rev-reasons"] li').count() === 2);
  await page.keyboard.press("2");
  await page.waitForTimeout(500);
  const decided = sent.filter((x) => x.method === "PATCH" && x.path.includes("research_review_records")).map((x) => x.body as { stage?: string; reason?: string | null; decided_at?: string });
  ok("y sends a record on to full text and x excludes one with the reason's id and a date",
    decided.some((d) => d.stage === "fulltext" && d.decided_at) && decided.some((d) => d.stage === "excluded" && d.reason === "E2"), JSON.stringify(decided));
  const meter = (await page.locator('[data-testid="rs-rev-meter"]').textContent()) ?? "";
  ok("and the meter says two of two decided", /^2 \D+ 2 /.test(meter), meter);
  await page.getByRole("button", { name: /Full text \/ পূর্ণ লেখা/ }).click();
  await page.waitForTimeout(300);
  ok("full text screening holds the record y sent on", ((await page.locator('[data-testid="rs-rev-record"]').textContent()) ?? "").includes("Weather shocks and farm incomes"));
  await page.keyboard.press("y");
  await page.waitForTimeout(1000);
  const inc = sent.filter((x) => x.method === "PATCH" && x.path.includes("research_review_records")).map((x) => x.body as { stage?: string; source_id?: string | null; record?: { fullText?: boolean } }).find((d) => d.stage === "included");
  ok("including at full text links the library's own row rather than adding the paper twice", inc?.source_id === "s-1" && inc.record?.fullText === true && posts(sent, "research_sources").length === 0, JSON.stringify(inc));
  await page.getByRole("button", { name: /4 PRISMA/ }).click();
  await page.waitForTimeout(300);
  const prismaText = (await page.locator('[data-testid="rs-prisma"]').textContent()) ?? "";
  ok("PRISMA is drawn from the rows: two identified, one excluded at title, one included",
    /identified \(n = 2\)|চিহ্নিত রেকর্ড \(n = 2\)/.test(prismaText) && /Records excluded \(n = 1\)|বাদ দেওয়া রেকর্ড \(n = 1\)/.test(prismaText) && /Studies included \(n = 1\)|অন্তর্ভুক্ত গবেষণা \(n = 1\)/.test(prismaText),
    prismaText.slice(0, 300));
  await page.getByRole("button", { name: /5 Extraction|5 নিষ্কাশন/ }).click();
  await page.waitForTimeout(300);
  const cell = page.locator('[data-testid="rs-rev-extract"] input').first();
  await cell.fill("120 farms");
  await cell.press("Tab");
  await page.waitForTimeout(600);
  const ext = sent.filter((x) => x.method === "PATCH" && x.path.includes("research_review_records")).map((x) => x.body as { extraction?: Record<string, string> }).find((d) => d.extraction);
  ok("an extraction cell is one column of the record's own row", ext?.extraction?.sample === "120 farms", JSON.stringify(ext));
  await page.getByRole("button", { name: /6 Appraisal|6 মূল্যায়ন/ }).click();
  await page.waitForTimeout(300);
  await page.locator('[data-testid="rs-rev-appraisal"] button', { hasText: /^Yes/ }).first().click();
  await page.waitForTimeout(600);
  const app = sent.filter((x) => x.method === "PATCH" && x.path.includes("research_review_records")).map((x) => x.body as { appraisal?: Record<string, string> }).find((d) => d.appraisal);
  const summary = (await page.locator('[data-testid="rs-rev-appraisal"] summary').first().textContent()) ?? "";
  ok("an appraisal answer is kept and the score derived", app?.appraisal?.["0"] === "yes" && /1 \/ 6/.test(summary), `${JSON.stringify(app)} ${summary}`);
  await page.getByRole("button", { name: /7 Synthesis|7 সংশ্লেষ/ }).click();
  await page.waitForTimeout(300);
  ok("synthesis is the gap matrix of the included sources' tags", await page.locator('[data-testid="rs-rev-gaps"] tbody tr').count() === 2);
  ok("and none of it threw", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* ============================================================
   10. the lab: a DSE export read by its column names, loaded into
       DuckDB in the browser, the four checks as a run, a column
       bound in the dictionary, OLS with an APA table saved as a
       run with its figure, SQL kept as a transform, a chart, and a
       market series saved as a dataset with its source
   ============================================================ */

{
  const { page, errors, sent } = await open("/tools/research/lab");
  await page.waitForTimeout(500);
  ok("a lab with no dataset says so", ((await page.locator(".rs-list").textContent()) ?? "").includes("No dataset yet"));
  const CSV = ["DATE,TRADING CODE,LTP*,HIGH,LOW,OPENP*,CLOSEP*,YCP*,TRADE,VALUE (mn),VOLUME",
    ...Array.from({ length: 12 }, (_v, i) => {
      const open = 300 + i * 2, close = open + (i % 3) - 1;
      return `2024-01-${String(i + 2).padStart(2, "0")},GP,${close},${close + 3},${open - 2},${open},${close},${open - 1},${1000 + i},${(40 + i).toFixed(1)},${150000 + i * 10}`;
    })].join("\n");
  await page.setInputFiles('[data-testid="rs-lab-file"]', { name: "dse-export.csv", mimeType: "text/csv", buffer: Buffer.from(CSV) });
  await page.waitForTimeout(1500);
  const src = firstOf(posts(sent, "research_sources")[0]);
  ok("an upload is a library source of type dataset first", src.type === "dataset" && src.title === "dse-export", JSON.stringify(src).slice(0, 200));
  const ds = firstOf(posts(sent, "research_datasets")[0]) as { dictionary?: { name: string; type: string }[]; provenance?: { importer?: string; kind?: string }; rows?: number; hash?: string; files?: { key: string }[] };
  ok("and a dataset row whose columns the DSE importer renamed, typed, counted and hashed",
    ds.provenance?.importer === "dse" && ds.provenance.kind === "upload" && ds.rows === 12 && ds.hash?.length === 16 && ds.files?.[0]?.key.startsWith("research/")
    && ds.dictionary?.map((c) => c.name).join(",") === "date,symbol,last,high,low,open,close,previous_close,trades,value_mn,volume"
    && ds.dictionary[0].type === "date" && ds.dictionary[1].type === "text" && ds.dictionary[6].type === "number",
    JSON.stringify(ds ?? null).slice(0, 300));
  await page.getByRole("button", { name: /Load into the engine|ইঞ্জিনে লোড করুন/ }).click();
  const preview = page.locator('.rs-main div:has(> p:has-text("First rows")) table');
  await preview.waitFor({ timeout: 120000 }).catch(() => undefined);
  ok("DuckDB in the browser reads the file back on its ticket and shows the first rows", await preview.locator("tbody tr").count() === 12, `${await preview.count()} preview table(s); status: ${await page.locator('[role="status"]').count() ? await page.locator('[role="status"]').first().textContent() : ""}`);
  await page.locator("#rs-lab-n").fill("12");
  await page.getByRole("button", { name: /Run the checks|যাচাই চালান/ }).click();
  await page.locator('[data-testid="rs-lab-sanity"]').waitFor({ timeout: 20000 }).catch(() => undefined);
  await page.waitForTimeout(800);
  const sane = await page.locator('[data-testid="rs-lab-sanity"]').count() ? (await page.locator('[data-testid="rs-lab-sanity"]').textContent()) ?? "" : "";
  const status = await page.locator('[role="status"]').count() ? (await page.locator('[role="status"]').first().textContent()) ?? "" : "";
  ok("the four checks read the shape against the stated N and the date coverage", /N matches|N মিলেছে/.test(sane) && sane.includes("2024-01-02") && sane.includes("2024-01-13"), `${sane.slice(0, 200)} status: ${status}`);
  const check = posts(sent, "research_runs").map(firstOf).find((r) => r.kind === "check") as { output?: { rows?: number } } | undefined;
  ok("and the result is a run of kind check", check?.output?.rows === 12, JSON.stringify(check ?? null).slice(0, 200));
  await page.locator("#rs-dc-unit-6").fill("BDT");
  await page.locator("#rs-dc-unit-6").press("Tab");
  await page.waitForTimeout(800);
  const dict = sent.filter((x) => x.method === "PATCH" && x.path.includes("research_datasets")).map((x) => x.body as { dictionary?: { name: string; unit?: string }[] }).find((b) => b.dictionary?.some((c) => c.unit === "BDT"));
  ok("a unit typed into the dictionary is one column of the dataset's own row", dict?.dictionary?.[6]?.name === "close" && dict.dictionary[6].unit === "BDT", JSON.stringify(dict ?? null).slice(0, 200));
  await page.getByRole("button", { name: /3 Statistics|3 পরিসংখ্যান/ }).click();
  await page.waitForTimeout(300);
  await page.locator("#rs-lab-method").selectOption("ols");
  await page.locator("#rs-role-y").selectOption("close");
  await page.locator('[data-testid="rs-role-x"] button', { hasText: /^open$/ }).click();
  await page.getByRole("button", { name: /^Run\b/ }).click();
  await page.waitForTimeout(2000);
  const apa = await page.locator('[data-testid="rs-lab-apa"]').count() ? (await page.locator('[data-testid="rs-lab-apa"]').textContent()) ?? "" : "";
  const alert = await page.locator('[role="alert"]').count() ? (await page.locator('[role="alert"]').first().textContent()) ?? "" : "";
  ok("OLS runs in the browser and prints an APA table with the intercept, the slope and R squared", apa.includes("(Intercept)") && apa.includes("| open |") && apa.includes("R²") && apa.includes("N | 12"), `${apa.slice(0, 300)} alert: ${alert} main: ${((await page.locator("main").textContent()) ?? "").slice(0, 400)}`);
  await page.getByRole("button", { name: /Save as a run|রান হিসেবে রাখুন/ }).click();
  await page.waitForTimeout(800);
  const stat = posts(sent, "research_runs").map(firstOf).find((r) => r.kind === "stat") as { output?: { fit?: { names: string[]; coef: number[] }; apa?: string }; figure?: string; data_hash?: string; input?: { method?: string } } | undefined;
  ok("and the run holds the fit whole, the APA text, the data hash and the figure as SVG",
    stat?.output?.fit?.names.join(",") === "(Intercept),open" && stat.output.fit.coef.length === 2 && typeof stat.output.apa === "string" && stat.figure?.startsWith("<svg") && stat.data_hash?.length === 16 && stat.input?.method === "ols",
    JSON.stringify(stat ?? null).slice(0, 200));
  await page.getByRole("button", { name: /2 SQL/ }).click();
  await page.waitForTimeout(300);
  ok("the SQL box opens on the dataset's own table", ((await page.locator("#rs-lab-sql").inputValue()) ?? "").startsWith("SELECT * FROM"));
  await page.getByRole("button", { name: /^Run\b/ }).click();
  await page.waitForTimeout(2000);
  ok("and DuckDB answers it", await page.locator("table tbody tr").count() === 12);
  await page.locator("#rs-lab-tname").fill("closes");
  await page.getByRole("button", { name: /Save as a transform|ট্রান্সফর্ম হিসেবে রাখুন/ }).click();
  await page.waitForTimeout(800);
  const tr = firstOf(posts(sent, "research_transforms")[0]);
  ok("a transform is SQL kept as a row", tr.name === "closes" && String(tr.sql).startsWith("SELECT"), JSON.stringify(tr).slice(0, 200));
  await page.getByRole("button", { name: /4 Charts|4 চার্ট/ }).click();
  await page.waitForTimeout(300);
  await page.locator("#rs-chart-x").selectOption("date");
  await page.locator("button", { hasText: /^close$/ }).first().click();
  await page.getByRole("button", { name: /Draw|আঁকুন/ }).click();
  await page.waitForTimeout(2000);
  ok("a chart is drawn as SVG", await page.locator('[data-testid="rs-lab-chart"]').count() === 1);
  await page.getByRole("button", { name: /Save as a run|রান হিসেবে রাখুন/ }).click();
  await page.waitForTimeout(800);
  ok("and saved as a run with the figure", posts(sent, "research_runs").map(firstOf).some((r) => r.kind === "chart" && String(r.figure).startsWith("<svg")));
  await page.getByRole("button", { name: /6 Market data|6 বাজারের তথ্য/ }).click();
  await page.waitForTimeout(300);
  await page.locator("#rs-lab-symbol").fill("AAPL");
  await page.locator("#rs-lab-symbol").press("Enter");
  await page.waitForTimeout(1000);
  const ser = await page.locator('[data-testid="rs-lab-series"]').count() ? (await page.locator('[data-testid="rs-lab-series"]').textContent()) ?? "" : "";
  ok("a market series comes through the Worker with its dates", ser.includes("AAPL") && ser.includes("2024-02-01") && ser.includes("2024-02-06"), ser.slice(0, 200));
  await page.getByRole("button", { name: /Save as a dataset|ডেটাসেট হিসেবে রাখুন/ }).click();
  await page.waitForTimeout(2000);
  const market = posts(sent, "research_datasets").map(firstOf).find((d) => (d.provenance as { kind?: string })?.kind === "market") as { provenance?: { symbol?: string; importer?: string }; rows?: number; dictionary?: { name: string }[] } | undefined;
  ok("and saved it is a dataset with its provenance, its rows and canonical columns", market?.provenance?.symbol === "AAPL" && market.rows === 6 && market.dictionary?.map((c) => c.name).join(",") === "date,open,high,low,close,volume", JSON.stringify(market ?? null).slice(0, 200));
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
