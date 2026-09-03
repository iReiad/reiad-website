/* ============================================================
   lib/duck.ts: DuckDB in the browser, loaded once. RESEARCH.md
   section 14.

   The engine and its worker are served by the Worker at
   /api/engine/duckdb-wasm/<version>/<file>, fetched once from their
   CDN and cached at the edge, because DuckDB's WASM is 35 MB and a
   Worker's static asset may be 25 MiB at most: as a chunk of this
   build it deployed nowhere. `script-src` is 'self' and the WASM
   needs 'wasm-unsafe-eval', which both header lists carry. Nothing
   of the data passes through the Worker after the upload: a file is
   fetched on its ticket and registered as a buffer here. The first
   open costs the engine's download, cached by the browser after;
   the lab says so before it asks. The version here and in
   functions/api/engine/[[route]].ts move together.
   ============================================================ */

import type { AsyncDuckDB, AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

export interface Duck { db: AsyncDuckDB; conn: AsyncDuckDBConnection }

const ENGINE = "/api/engine/duckdb-wasm/1.29.0";

let once: Promise<Duck> | null = null;

export function duck(): Promise<Duck> {
  once ??= (async () => {
    const lib = await import("@duckdb/duckdb-wasm");
    const worker = new Worker(`${ENGINE}/duckdb-browser-eh.worker.js`);
    const db = new lib.AsyncDuckDB(new lib.ConsoleLogger(lib.LogLevel.WARNING), worker);
    await db.instantiate(new URL(`${ENGINE}/duckdb-eh.wasm`, location.origin).href);
    const conn = await db.connect();
    return { db, conn };
  })();
  return once;
}

/** A table name that is safe to say in SQL. */
export const ident = (name: string): string => `"${name.replace(/"/g, "\"\"")}"`;

/** The bytes of one file as a table of that name, replacing any
    table already there under it. Given `columns`, the file's own
    headings are aliased to them by position in the one SELECT
    that makes the table, so a regression written as "close" runs
    on a DSE export whose heading is "CLOSEP*". Aliased at
    creation rather than renamed after: a run of ALTER TABLE
    RENAME COLUMN statements lost the second column's name in the
    binder, and one projection cannot. */
export async function loadTable(name: string, bytes: Uint8Array, ext: string, columns: string[] = []): Promise<void> {
  const { db, conn } = await duck();
  const file = `${name}.${ext}`;
  await db.registerFileBuffer(file, bytes);
  const reader = ext === "parquet" ? `read_parquet('${file}')`
    : ext === "json" ? `read_json_auto('${file}')`
      : `read_csv_auto('${file}', header=true, sample_size=-1${ext === "tsv" ? ", delim='\\t'" : ""})`;
  let select = "*";
  if (columns.length) {
    const desc = await conn.query(`DESCRIBE SELECT * FROM ${reader}`);
    const have = desc.toArray().map((r) => String((r.toJSON() as Record<string, unknown>).column_name));
    if (have.length === columns.length) select = have.map((h, i) => (h === columns[i] ? ident(h) : `${ident(h)} AS ${ident(columns[i])}`)).join(", ");
  }
  await conn.query(`CREATE OR REPLACE TABLE ${ident(name)} AS SELECT ${select} FROM ${reader}`);
}

export interface Answer { columns: string[]; rows: (string | number | boolean | null)[][]; ms: number }

const plain = (v: unknown): string | number | boolean | null => {
  if (v === null || v === undefined) return null;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number" || typeof v === "string" || typeof v === "boolean") return v;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "object" && "toString" in v) return String(v);
  return String(v);
};

/** One statement, answered as plain columns and rows. Dates come
    back as ISO days and big integers as numbers, because a table
    a chart reads has no use for either as an object. */
export async function query(sql: string): Promise<Answer> {
  const { conn } = await duck();
  const t0 = performance.now();
  const res = await conn.query(sql);
  const columns = res.schema.fields.map((f) => f.name);
  /* Arrow hands a DATE back as epoch milliseconds, which a chart
     or a coverage check cannot tell from a price, so the schema
     decides: a date column is an ISO day, a timestamp an ISO
     string, and nothing else is touched. */
  const kinds = res.schema.fields.map((f) => { const t = String(f.type); return t.startsWith("Date") ? "date" : t.startsWith("Timestamp") ? "timestamp" : "plain"; });
  const when = (v: unknown, kind: string): string | number | boolean | null => {
    const p = plain(v);
    if (kind === "plain" || p === null || typeof p === "boolean") return p;
    const ms = typeof p === "number" ? p : Date.parse(String(p));
    if (!Number.isFinite(ms)) return p;
    return kind === "date" ? new Date(ms).toISOString().slice(0, 10) : new Date(ms).toISOString();
  };
  const rows = res.toArray().map((r) => {
    const o = r.toJSON() as Record<string, unknown>;
    return columns.map((c, i) => when(o[c], kinds[i]));
  });
  return { columns, rows, ms: Math.round(performance.now() - t0) };
}

/** The tables loaded so far. */
export async function tables(): Promise<string[]> {
  const a = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'main' ORDER BY 1");
  return a.rows.map((r) => String(r[0]));
}
