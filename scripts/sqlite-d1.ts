/* ============================================================
   sqlite-d1.ts: the D1 binding, over node:sqlite.

   `shared/schools.ts`, `functions/_lib/db.ts` and every endpoint
   under `functions/` are written against the binding the Worker
   hands them: `prepare(sql).bind(...).all()`, `.first()`,
   `.run()`, and `batch()` for a list of statements. A builder or
   a check runs on a laptop with no binding and no network, so it
   gets the same interface over `node:sqlite` and the code under
   test stays the code that ships.

   There were four copies of this, and they had already drifted in
   the way copies do: `schools-snapshot.ts` and `school-source.ts`
   narrowed what they bound, `comments.test.ts` and
   `schools-api.test.ts` handed values straight through, and
   node:sqlite throws on an `undefined` where D1 stores NULL. So a
   handler that binds an absent field failed in a test and worked
   in production, which is the wrong way round.
   ============================================================ */

import type { DatabaseSync } from "node:sqlite";
import type { D1Database } from "../shared/schools.ts";

/** What node:sqlite takes as a bound parameter.

    D1 is more forgiving than SQLite is, and the gap is the whole
    reason this narrowing exists rather than a cast: `undefined`
    becomes NULL, a boolean becomes 1 or 0, and everything that is
    not already a number is bound as text. Getting that wrong
    shows up as a test failing on a value the live site stores
    without complaint. */
export type Bindable = string | number | null;

export const bindable = (v: unknown): Bindable =>
  v === null || v === undefined ? null
    : typeof v === "number" ? v
    : typeof v === "boolean" ? (v ? 1 : 0)
    : String(v);

/** One prepared statement, bound or not.

    `bind()` and the three answers sit on the same object because
    both spellings are in use: `functions/_lib/db.ts` always binds
    before it reads, and a query with no parameters is read
    directly. */
export interface SqliteStatement {
  bind(...args: unknown[]): SqliteStatement;
  all(): Promise<{ results: unknown[] }>;
  first(): Promise<unknown>;
  run(): Promise<{ success: boolean }>;
}

/** The binding, plus the handle behind it.

    A real D1 binding has no handle and needs none; a caller here
    opened a database and has to close it. That is why the extra
    is stated on this interface rather than added to `D1Database`
    in `shared/`, which describes what the Worker passes. */
export interface SqliteD1 extends D1Database {
  handle: DatabaseSync;
  prepare(query: string): SqliteStatement;
  batch(statements: Array<{ run(): Promise<unknown> }>): Promise<unknown[]>;
}

/** The binding over a database somebody else opened. */
export function d1Over(db: DatabaseSync): SqliteD1 {
  return {
    handle: db,
    prepare(sql: string): SqliteStatement {
      const make = (args: unknown[]): SqliteStatement => {
        const bound = args.map(bindable);
        return {
          bind: (...more: unknown[]) => make(more),
          all: async () => ({ results: db.prepare(sql).all(...bound) }),
          first: async () => db.prepare(sql).get(...bound) ?? null,
          run: async () => { db.prepare(sql).run(...bound); return { success: true }; },
        };
      };
      return make([]);
    },
    /* `db()` in `functions/_lib/db.ts` applies the schema through
       batch() the first time it is used, so a test that hands this
       over is running the real migrations. Sequential rather than
       in a transaction, which is what D1's batch does too. */
    batch: async (statements) => {
      for (const st of statements) await st.run();
      return [];
    },
  };
}

/** The binding over a new database: a file, or `:memory:`. */
export async function d1Open(path = ":memory:"): Promise<SqliteD1> {
  const { DatabaseSync } = await import("node:sqlite");
  return d1Over(new DatabaseSync(path));
}
