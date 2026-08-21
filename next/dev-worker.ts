/* ============================================================
   dev-worker.ts: the built Worker, on workerd, with a database
   in it.

   Not a test. `parity.test.ts` and `article.test.ts` both need
   the same three things before they can ask anything at all: a
   temporary D1 with rows in it, `wrangler dev` running the
   OpenNext build against it, and an honest answer about whether
   that worked. This is those three things, once.

   ```js
   const worker = await startWorker({ port: 8787, seed: (db) => {
     db.exec(`CREATE TABLE ...`);
     db.exec(`INSERT ...`);
   }});
   if (!worker.ok) { console.log(worker.reason); process.exit(0); }
   await fetch(`${worker.origin}/insights/x.html`);
   ```

   ---- why a callback rather than a fixture ----

   The two callers want different rows and it is not a difference
   worth flattening: parity seeds seventy school rows because it
   compares a lesson page against the page it replaced, and a
   browser test wants one article and nothing else, because every
   row is a second of seeding and it is asking about a component.
   What they share is the boot, and the boot is the part that took
   three attempts to get right.

   ---- and why `exec` batches ----

   `wrangler d1 execute --command` is a whole node process per
   call. Seventy rows that way is four minutes of seeding for a
   test that runs in forty seconds, which is how parity's first
   version behaved. `db.exec()` collects statements and one
   `--file` run applies them.
   ============================================================ */

import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/** Is there anything to run? Both callers skip rather than fail
    when the build has not been made, and a skip is never silent. */
export const built = () => existsSync(join(here, ".open-next/worker.js"));

/** What `seed` is handed: a collector, not a database. Nothing is
    applied until every statement is in, because one
    `wrangler d1 execute --file` beats seventy processes. */
export interface Seeder {
  exec(sql: string): void;
}

/** A Worker that started, or the reason it did not. Both carry
    `log` and `stop`, because a caller that is about to skip still
    wants to print the last few lines and still has to clean up. */
export type Worker =
  | { ok: true; origin: string; log: () => string; stop: () => void }
  | { ok: false; reason: string; log: () => string; stop: () => void };

/**
 * Start the built Worker with a database under it.
 *
 * `seed` is called with a collector before the Worker starts;
 * everything it passes to `exec` is applied in one go.
 */
export async function startWorker(
  { port, seed }: { port: number; seed: (db: Seeder) => void },
): Promise<Worker> {
  const state = mkdtempSync(join(tmpdir(), "reiad-worker-"));

  const statements: string[] = [];
  seed({ exec: (sql: string) => { statements.push(sql.trim().replace(/;?$/, ";")); } });

  if (statements.length) {
    const file = join(state, "seed.sql");
    writeFileSync(file, `${statements.join("\n")}\n`);
    execFileSync("npx",
      ["wrangler", "d1", "execute", "reiad", "--local", "--persist-to", state,
       "--file", file],
      { cwd: here, stdio: "pipe" });
  }

  /* Its own process group, so that stopping it stops all of it.
     `wrangler dev` runs workerd as a child of its own, and a
     SIGTERM to wrangler alone leaves that grandchild holding the
     port: the next run then dies on "Address already in use",
     which reads like a broken test and is a leftover. */
  const dev = spawn(
    "npx",
    ["wrangler", "dev", "--local", "--port", String(port), "--persist-to", state],
    { cwd: here, stdio: ["ignore", "pipe", "pipe"], detached: true },
  );

  let out = "";
  dev.stdout.on("data", (d) => { out += d; });
  dev.stderr.on("data", (d) => { out += d; });

  let gone: number | string | null = null;
  dev.on("exit", (code, signal) => { gone = code ?? signal ?? "gone"; });

  const stop = () => {
    /* The GROUP, so that workerd goes with wrangler. `pid` is
       optional on a spawn that failed to start, and killing the
       group of `undefined` is killing this process's own group. */
    try {
      if (dev.pid) process.kill(-dev.pid, "SIGTERM");
      else dev.kill("SIGTERM");
    } catch { dev.kill("SIGTERM"); }
    try { rmSync(state, { recursive: true, force: true }); } catch { /* fine */ }
  };
  process.on("exit", stop);
  const log = () => out;

  /* Ready, or one of three ways of not being ready, told apart.

     THE BUG THIS SHAPE FIXES, and it is worse than the one it
     replaces because it was quiet. The old loop gave up on any
     line matching `Error: `, and `wrangler dev` prints exactly
     that, harmlessly, wherever there is no outbound network: it
     cannot fetch the `Request.cf` object, says so with a stack,
     and then starts perfectly forty seconds later. So in a
     container, and in any sandbox like one, the test printed "did
     not start", exited 0, and looked from the outside exactly
     like a full run of passing checks.

     A real failure is the process being gone, or wrangler's own
     `[ERROR]` marker, which it brackets and a thrown stack does
     not. Everything else is waited out. */
  for (let i = 0; i < 180; i++) {
    if (/Ready on http/.test(out)) {
      // The first request compiles the route; give it a moment.
      await new Promise((r) => setTimeout(r, 500));
      return { ok: true, origin: `http://127.0.0.1:${port}`, log, stop };
    }
    if (gone !== null) return { ok: false, reason: `wrangler dev exited (${gone})`, log, stop };
    if (/\[ERROR\]/.test(out)) {
      return { ok: false, reason: "wrangler dev reported an error", log, stop };
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return {
    ok: false,
    reason: "wrangler dev never said it was ready, after 90 seconds",
    log, stop,
  };
}

/** One INSERT, with the values quoted the way SQLite wants them.
    Shared because both callers build rows out of objects and
    getting the escaping wrong is a fixture that tests itself. */
export const insert = (
  table: string, columns: string[], row: Record<string, unknown>,
): string =>
  `INSERT OR REPLACE INTO ${table} (${columns.join(", ")}) VALUES (`
  + columns.map((c: string) => (typeof row[c] === "number"
    ? row[c]
    : `'${String(row[c] ?? "").replace(/'/g, "''")}'`)).join(", ")
  + ");";

/** The one table both callers need. Written here rather than in
    each, because a column added to `functions/_lib/db.ts` has to
    reach both or one of them tests a shape the site does not
    have. */
export const ARTICLES_TABLE = `CREATE TABLE IF NOT EXISTS articles (
  slug TEXT PRIMARY KEY, section TEXT, lang TEXT, title TEXT, dek TEXT, tag TEXT,
  topics TEXT, body TEXT, cover TEXT, minutes INTEGER, status TEXT,
  published_at TEXT, updated_at TEXT)`;
