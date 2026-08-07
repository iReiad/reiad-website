/* ============================================================
   _lib/db.js — D1 access, plus migrations that run themselves.

   The schema is applied on the first request that needs it, so a
   fresh database heals itself and there is no such thing as a
   half-migrated deploy. The check is one cheap query against
   sqlite_master, cached for the lifetime of the isolate.
   ============================================================ */

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
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS throttle (
     bucket TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0, resets TEXT NOT NULL)`,
];

/** Returns the D1 binding, or null when it hasn't been created yet. */
export async function db(env) {
  if (!env?.DB) return null;
  if (!ready) {
    try {
      await env.DB.batch(MIGRATIONS.map((sql) => env.DB.prepare(sql)));
      ready = true;
    } catch (err) {
      // A migration failure must not take the site down: the caller
      // treats a null database as "not configured" and falls back.
      console.error("migration failed", err);
      return null;
    }
  }
  return env.DB;
}

export const all = async (d1, sql, ...args) =>
  (await d1.prepare(sql).bind(...args).all()).results ?? [];

export const one = (d1, sql, ...args) => d1.prepare(sql).bind(...args).first();

export const run = (d1, sql, ...args) => d1.prepare(sql).bind(...args).run();

/** A setting, with a default. Settings are the tiny bits of state
    that don't deserve their own table (admin hash, site toggles). */
export async function setting(d1, key, fallback = null) {
  const row = await one(d1, `SELECT value FROM settings WHERE key = ?`, key);
  return row?.value ?? fallback;
}

export const setSetting = (d1, key, value) =>
  run(d1, `INSERT INTO settings (key, value) VALUES (?, ?)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value`, key, String(value));
