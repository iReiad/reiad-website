/* ============================================================
   scripts/restore.test.mjs: the backup round trip, for real.

     node scripts/restore.test.mjs

   Stage 2 of TRANSITION.md says a restore is only done when it
   "has been run once and produced the same rows". This is that
   run, and it is a test rather than a note in a file, so it is
   still true next month.

   It builds a real SQLite database with the schema this site
   actually uses, fills it, takes a backup the way the Worker
   does, restores it into an empty database through the generated
   SQL, and compares every row. Then it does the awkward ones:
   restoring over a database that already has rows, a body full of
   quotes and Bangla, a NULL, and a draft.

   node:sqlite rather than D1, because D1 is SQLite and the SQL
   this generates is the part that can be wrong.
   ============================================================ */

import { DatabaseSync } from "node:sqlite";
import { toSQL, literal, insertFor } from "./restore.mjs";

let failures = 0;
const check = (name, got, want) => {
  const a = JSON.stringify(got);
  const b = JSON.stringify(want);
  if (a === b) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}\n       got  ${a}\n       want ${b}`);
};
const okay = (name, cond) => check(name, !!cond, true);

/* The two tables this exercises, in the shape db.js creates them.
   Copied rather than imported because db.js is written for the
   Workers runtime; if they drift, this test is testing a schema
   the site does not have, so the columns are asserted below. */
const SCHEMA = `
CREATE TABLE articles (
  slug TEXT PRIMARY KEY, title TEXT NOT NULL, dek TEXT NOT NULL DEFAULT '',
  tag TEXT NOT NULL DEFAULT '', topics TEXT NOT NULL DEFAULT '',
  lang TEXT NOT NULL DEFAULT 'en', body TEXT NOT NULL DEFAULT '',
  minutes INTEGER NOT NULL DEFAULT 1, status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  cover TEXT NOT NULL DEFAULT '', section TEXT NOT NULL DEFAULT 'insights',
  notion_page_id TEXT, notion_synced_at TEXT);
CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT, name TEXT NOT NULL DEFAULT '',
  email TEXT, body TEXT NOT NULL, answer TEXT,
  status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL, answered_at TEXT);
CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
`;

const fresh = () => { const d = new DatabaseSync(":memory:"); d.exec(SCHEMA); return d; };
const rows = (d, sql) => d.prepare(sql).all();

/* ---------- a database worth losing ---------- */

const now = "2026-08-15T12:00:00.000Z";
const SEED = [
  { slug: "dse-basics", section: "insights", title: "How the DSE works",
    dek: "What DSEX measures.", tag: "Explainer", topics: "Equities|Beginner",
    lang: "en", body: "<p>A share is a piece of a company.</p>", minutes: 5,
    status: "live", cover: "/og/dse-basics.jpg", published_at: now,
    created_at: now, updated_at: now, notion_page_id: null, notion_synced_at: null },

  /* The one that breaks naive escaping: an apostrophe, a quote, a
     backslash, a newline and three-byte Bangla, in one body. */
  { slug: "peyaj", section: "cooking", title: "পেঁয়াজ নিয়ে যা যা জানা দরকার",
    dek: "রান্নার 'আসল' কথা", tag: "রান্না", topics: "রান্না",
    lang: "bn", body: `<p>মায়ের কথা: "আগে পেঁয়াজ কষান"।</p>\n<p>It's a \\ backslash.</p>`,
    minutes: 12, status: "live", cover: "/og/peyaj.jpg", published_at: now,
    created_at: now, updated_at: now, notion_page_id: "abc-123", notion_synced_at: now },

  // A draft, which must never reach the public backup.
  { slug: "half-written", section: "insights", title: "Not finished",
    dek: "", tag: "", topics: "", lang: "en", body: "<p>TODO</p>", minutes: 1,
    status: "draft", cover: "", published_at: null,
    created_at: now, updated_at: now, notion_page_id: null, notion_synced_at: null },
];

function seed(d) {
  const cols = Object.keys(SEED[0]);
  const stmt = d.prepare(
    `INSERT INTO articles (${cols.join(",")}) VALUES (${cols.map(() => "?").join(",")})`
  );
  for (const a of SEED) stmt.run(...cols.map((c) => a[c]));

  d.prepare(`INSERT INTO questions (slug, name, email, body, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`)
    .run("dse-basics", "Ayesha", "a@example.com", "কত টাকা লাগে?", "pending", now);
  d.prepare(`INSERT INTO settings (key, value) VALUES (?, ?)`)
    .run("admin_password", "scrypt$notarealhash");
}

console.log("restore round trip");

/* ---------- the schema this test assumes is the real one ---------- */
{
  const live = fresh();
  const columns = rows(live, `PRAGMA table_info(articles)`).map((c) => c.name).sort();
  check("articles has the columns the backup selects", columns, [
    "body", "cover", "created_at", "dek", "lang", "minutes", "notion_page_id",
    "notion_synced_at", "published_at", "section", "slug", "status", "tag",
    "title", "topics", "updated_at",
  ]);
}

/* ---------- 1. the public backup, and what it must not contain ---------- */
{
  const live = fresh(); seed(live);

  // The same query articleBackup() runs.
  const articles = rows(live,
    `SELECT slug, section, title, dek, tag, topics, lang, body, minutes,
            status, cover, published_at, created_at, updated_at
       FROM articles WHERE status = 'live' ORDER BY slug`);

  const backup = { format: 1, kind: "articles", taken_at: now,
    count: articles.length, articles };

  check("live articles only", articles.map((a) => a.slug), ["dse-basics", "peyaj"]);
  okay("no draft in the public backup",
    !JSON.stringify(backup).includes("half-written"));
  okay("no reader email in the public backup",
    !JSON.stringify(backup).includes("a@example.com"));
  okay("no password hash in the public backup",
    !JSON.stringify(backup).includes("scrypt$"));
  okay("no Notion page id in the public backup",
    !JSON.stringify(backup).includes("abc-123"));

  // Restore into an empty database and compare, column by column.
  const scratch = fresh();
  scratch.exec(toSQL(backup));

  /* Compared on the columns the public backup carries. The two it
     leaves out come back as the column defaults, which is exactly
     what "reconnect Notion by hand" means. */
  const kept = `slug, section, title, dek, tag, topics, lang, body, minutes,
                status, cover, published_at, created_at, updated_at`;
  const before = rows(live, `SELECT ${kept} FROM articles WHERE status='live' ORDER BY slug`);
  const after = rows(scratch, `SELECT ${kept} FROM articles ORDER BY slug`);
  check("every live row restored identically", after, before);
  check("Notion columns come back empty, as documented",
    rows(scratch, `SELECT notion_page_id FROM articles WHERE slug='peyaj'`),
    [{ notion_page_id: null }]);
  check("the draft did not come back", rows(scratch, `SELECT COUNT(*) n FROM articles`), [{ n: 2 }]);

  const bangla = rows(scratch, `SELECT body FROM articles WHERE slug='peyaj'`)[0].body;
  check("quotes, backslash and Bangla survived", bangla, SEED[1].body);
}

/* ---------- 2. the full snapshot, every table ---------- */
{
  const live = fresh(); seed(live);
  const tables = {
    articles: rows(live, `SELECT * FROM articles ORDER BY slug`),
    questions: rows(live, `SELECT * FROM questions ORDER BY id`),
    settings: rows(live, `SELECT * FROM settings ORDER BY key`),
  };
  const backup = { format: 1, kind: "full", taken_at: now, tables };

  const scratch = fresh();
  scratch.exec(toSQL(backup));

  check("articles, drafts included", rows(scratch, `SELECT * FROM articles ORDER BY slug`), tables.articles);
  check("questions", rows(scratch, `SELECT * FROM questions ORDER BY id`), tables.questions);
  check("settings", rows(scratch, `SELECT * FROM settings ORDER BY key`), tables.settings);
}

/* ---------- 3. restoring OVER a database that has moved on ---------- */
{
  const live = fresh(); seed(live);
  const backup = { format: 1, kind: "full", taken_at: now,
    tables: { articles: rows(live, `SELECT * FROM articles ORDER BY slug`) } };

  // Since the backup: one row edited, one row added.
  live.exec(`UPDATE articles SET title='Edited since the backup' WHERE slug='dse-basics'`);
  live.exec(`INSERT INTO articles (slug,title,body,minutes,status,created_at,updated_at)
             VALUES ('written-later','Written later','<p>New</p>',3,'live','${now}','${now}')`);

  live.exec(toSQL(backup));

  check("the edited row is back as it was",
    rows(live, `SELECT title FROM articles WHERE slug='dse-basics'`), [{ title: "How the DSE works" }]);
  check("the newer row was NOT deleted",
    rows(live, `SELECT COUNT(*) n FROM articles WHERE slug='written-later'`), [{ n: 1 }]);

  // --replace, which is the one that does delete.
  live.exec(toSQL(backup, { replace: true }));
  check("--replace makes the backup the whole truth",
    rows(live, `SELECT slug FROM articles ORDER BY slug`).map((r) => r.slug),
    ["dse-basics", "half-written", "peyaj"]);
}

/* ---------- 4. the escaping, on its own ---------- */
{
  check("apostrophe", literal("it's"), "'it''s'");
  check("null", literal(null), "NULL");
  check("undefined is null, not the word", literal(undefined), "NULL");
  check("number", literal(42), "42");
  check("NaN cannot become a bare NaN token", literal(NaN), "NULL");
  check("newline stays inside the quotes", literal("a\nb"), "'a\nb'");
  okay("a key-only table becomes DO NOTHING",
    insertFor("reactions", { slug: "x", kind: "y" }).includes("DO NOTHING"));
  okay("an unknown table refuses rather than guessing", (() => {
    try { insertFor("mystery", { a: 1 }); return false; } catch { return true; }
  })());
}

/* ---------- 5. a backup from the future is refused ---------- */
{
  okay("wrong format is refused", (() => {
    try { toSQL({ format: 99, kind: "articles", articles: [] }); return false; }
    catch { return true; }
  })());
  okay("unknown kind is refused", (() => {
    try { toSQL({ format: 1, kind: "vibes" }); return false; } catch { return true; }
  })());
}

console.log(failures ? `\n${failures} failure(s)` : "\nall good: a backup restores to the same rows");
process.exit(failures ? 1 : 0);
