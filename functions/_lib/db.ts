/* ============================================================
   _lib/db.ts, D1 access, plus migrations that run themselves.

   The schema is applied on the first request that needs it, so a
   fresh database heals itself and there is no such thing as a
   half-migrated deploy. The check is one cheap query against
   sqlite_master, cached for the lifetime of the isolate.
   ============================================================ */

/* ---- what a D1 binding is, said once ----

   There is no `@cloudflare/workers-types` in this install and
   adding one to type six methods would be a dependency the
   Worker's own build does not need: wrangler's esbuild reads no
   tsconfig and strips these annotations without resolving
   anything. So the shape is declared structurally, here, and
   every other module in `functions/` imports it rather than
   describing D1 a second time. That is the rule `check-rows.ts`
   already enforces for the database's vocabulary. */

/** One row, as D1 hands it back: column names to values. */
export type Row = Record<string, unknown>;

export interface D1Result<T = Row> {
  results?: T[];
  success?: boolean;
  meta?: Record<string, unknown>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = Row>(): Promise<D1Result<T>>;
  first<T = Row>(): Promise<T | null>;
  run(): Promise<D1Result<never>>;
}

export interface D1Database {
  prepare(sql: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<unknown>;
}

/** Whatever this needs off the Worker's environment. Narrow on
    purpose: the binding may be absent, which is what "not
    configured yet" looks like and is not an error. */
export interface DbEnv {
  DB?: D1Database;
}

let ready = false;

/** The statements here must match aab/schema.sql exactly. */
const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS articles (
     slug TEXT PRIMARY KEY, title TEXT NOT NULL, dek TEXT NOT NULL DEFAULT '',
     tag TEXT NOT NULL DEFAULT '', topics TEXT NOT NULL DEFAULT '',
     lang TEXT NOT NULL DEFAULT 'en', body TEXT NOT NULL DEFAULT '',
     minutes INTEGER NOT NULL DEFAULT 1, status TEXT NOT NULL DEFAULT 'draft',
     published_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_articles_live ON articles (status, published_at DESC)`,
  `CREATE TABLE IF NOT EXISTS questions (
     id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT, name TEXT NOT NULL DEFAULT '',
     email TEXT, body TEXT NOT NULL, answer TEXT,
     status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL, answered_at TEXT)`,
  `CREATE INDEX IF NOT EXISTS idx_questions_slug ON questions (slug, status, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS subscribers (
     email TEXT PRIMARY KEY, token TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
     lang TEXT NOT NULL DEFAULT 'en', source TEXT NOT NULL DEFAULT '',
     created_at TEXT NOT NULL, confirmed_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS enquiries (
     id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL DEFAULT '',
     email TEXT NOT NULL DEFAULT '', kind TEXT NOT NULL DEFAULT 'general',
     message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new',
     notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS views (
     path TEXT NOT NULL, day TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 0,
     PRIMARY KEY (path, day))`,
  `CREATE TABLE IF NOT EXISTS reactions (
     slug TEXT NOT NULL, kind TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 0,
     PRIMARY KEY (slug, kind))`,
  `CREATE TABLE IF NOT EXISTS sessions (
     token TEXT PRIMARY KEY, label TEXT NOT NULL DEFAULT '',
     created_at TEXT NOT NULL, expires_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS article_versions (
     id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL,
     title TEXT NOT NULL DEFAULT '', dek TEXT NOT NULL DEFAULT '',
     tag TEXT NOT NULL DEFAULT '', lang TEXT NOT NULL DEFAULT 'en',
     body TEXT NOT NULL DEFAULT '', cover TEXT NOT NULL DEFAULT '',
     saved_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_versions_slug
     ON article_versions (slug, saved_at DESC)`,
  /* Comments. Grown from the questions queue rather than beside it:
     same moderation, same desk, an author attached.

     THE AUTHOR IS TWO COLUMNS ON PURPOSE. `author_id` is the
     Supabase user id, written only after the Worker has verified
     the signature on the reader's token (see _lib/reader.ts).
     `author_name` is a COPY of the display name as it was when the
     comment was posted.

     Copying it is not denormalisation for speed. It is the seam in
     archive/TRANSITION.md section 1: D1 holds what a signed-out reader
     needs to render the page, Supabase holds who people are, and
     the two never join in a query. A thread has to render for a
     stranger with Supabase unreachable, and it does, because every
     name it needs is already here.

     `body` is TEXT and stays text. A comment is never HTML: there
     is no sanitiser to get wrong if nothing is ever parsed. */
  `CREATE TABLE IF NOT EXISTS comments (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     slug TEXT NOT NULL, section TEXT NOT NULL DEFAULT 'insights',
     parent_id INTEGER,
     author_id TEXT NOT NULL, author_name TEXT NOT NULL DEFAULT '',
     body TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'pending',
     created_at TEXT NOT NULL, approved_at TEXT)`,
  `CREATE INDEX IF NOT EXISTS idx_comments_thread
     ON comments (slug, status, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_comments_queue
     ON comments (status, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
  /* The four schools, archive/TRANSITION.md Stage 8. Structure and prose
     both, because half of a lesson in a database and half in a
     file is two sources for whether a lesson exists. The `meta`
     column holds each school's own fields as JSON, and
     scripts/schools.test.ts fails if one goes missing: the long
     version of that reasoning is in aab/schema.sql. */
  `CREATE TABLE IF NOT EXISTS school_stages (
     school TEXT NOT NULL, slug TEXT NOT NULL, position INTEGER NOT NULL,
     title TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'live',
     meta TEXT NOT NULL DEFAULT '{}', updated_at TEXT NOT NULL,
     PRIMARY KEY (school, slug))`,
  `CREATE TABLE IF NOT EXISTS school_sections (
     school TEXT NOT NULL, stage TEXT NOT NULL, ident TEXT NOT NULL,
     position INTEGER NOT NULL, title TEXT NOT NULL DEFAULT '',
     meta TEXT NOT NULL DEFAULT '{}', updated_at TEXT NOT NULL,
     PRIMARY KEY (school, stage, ident))`,
  `CREATE TABLE IF NOT EXISTS school_lessons (
     school TEXT NOT NULL, stage TEXT NOT NULL, slug TEXT NOT NULL,
     section TEXT NOT NULL DEFAULT '', position INTEGER NOT NULL,
     title TEXT NOT NULL DEFAULT '', minutes INTEGER NOT NULL DEFAULT 0,
     status TEXT NOT NULL DEFAULT 'live', meta TEXT NOT NULL DEFAULT '{}',
     body TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL,
     PRIMARY KEY (school, stage, slug))`,
  `CREATE INDEX IF NOT EXISTS idx_school_lessons_order
     ON school_lessons (school, stage, position)`,
  `CREATE TABLE IF NOT EXISTS throttle (
     bucket TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0, resets TEXT NOT NULL)`,
];

/* Columns added after the first release.
   `CREATE TABLE IF NOT EXISTS` above only ever builds the original
   shape, so a database created before these existed would never grow
   them. SQLite has no ADD COLUMN IF NOT EXISTS, and a batch is
   atomic, one "duplicate column name" would roll the whole thing
   back, so each runs alone and its failure is the expected answer on
   every request after the first. */
const ADDITIONS = [
  `ALTER TABLE articles ADD COLUMN cover TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE articles ADD COLUMN section TEXT NOT NULL DEFAULT 'insights'`,
  `ALTER TABLE articles ADD COLUMN notion_page_id TEXT`,
  `ALTER TABLE articles ADD COLUMN notion_synced_at TEXT`,
];

/** Returns the D1 binding, or null when it hasn't been created yet. */
export async function db(env: DbEnv | undefined | null): Promise<D1Database | null> {
  const DB = env?.DB;
  if (!DB) return null;
  if (!ready) {
    try {
      await DB.batch(MIGRATIONS.map((sql) => DB.prepare(sql)));
      await Promise.all(
        ADDITIONS.map((sql) => DB.prepare(sql).run().catch(() => {}))
      );
      ready = true;
    } catch (err) {
      // A migration failure must not take the site down: the caller
      // treats a null database as "not configured" and falls back.
      console.error("migration failed", err);
      return null;
    }
  }
  return DB;
}

export const all = async <T = Row>(
  d1: D1Database, sql: string, ...args: unknown[]
): Promise<T[]> => (await d1.prepare(sql).bind(...args).all<T>()).results ?? [];

export const one = <T = Row>(
  d1: D1Database, sql: string, ...args: unknown[]
): Promise<T | null> => d1.prepare(sql).bind(...args).first<T>();

export const run = (
  d1: D1Database, sql: string, ...args: unknown[]
): Promise<D1Result<never>> => d1.prepare(sql).bind(...args).run();

/** A setting, with a default. Settings are the tiny bits of state
    that don't deserve their own table (admin hash, site toggles). */
export async function setting(
  d1: D1Database, key: string, fallback: string | null = null,
): Promise<string | null> {
  const row = await one<{ value?: string }>(
    d1, `SELECT value FROM settings WHERE key = ?`, key);
  return row?.value ?? fallback;
}

export const setSetting = (d1: D1Database, key: string, value: unknown) =>
  run(d1, `INSERT INTO settings (key, value) VALUES (?, ?)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value`, key, String(value));
