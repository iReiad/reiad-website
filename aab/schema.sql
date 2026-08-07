-- ============================================================
-- schema.sql — the whole database.
--
--   npx wrangler d1 execute reiad --remote --file=aab/schema.sql
--
-- Every statement is IF NOT EXISTS, so running it again is safe.
-- The Functions also run this on first request (see _lib/db.js),
-- which means a fresh database heals itself and you never have a
-- half-migrated deploy.
--
-- Design notes worth knowing:
--   · No IP addresses, no cookies for readers, no visitor IDs.
--     Analytics are counters per path per day and nothing else.
--   · Emails are stored only where the person typed one in and
--     asked for a reply (questions, enquiries, subscribers).
--   · Article bodies are sanitised HTML — the same sanitiser the
--     Studio has always used, run again server-side on write.
-- ============================================================

-- ---------- content ----------
CREATE TABLE IF NOT EXISTS articles (
  slug         TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  dek          TEXT NOT NULL DEFAULT '',
  tag          TEXT NOT NULL DEFAULT '',
  topics       TEXT NOT NULL DEFAULT '',      -- pipe-separated: "Equities|Beginner"
  lang         TEXT NOT NULL DEFAULT 'en',
  body         TEXT NOT NULL DEFAULT '',      -- sanitised HTML
  minutes      INTEGER NOT NULL DEFAULT 1,
  status       TEXT NOT NULL DEFAULT 'draft', -- draft | live
  published_at TEXT,                          -- ISO date, set when it goes live
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_articles_live
  ON articles (status, published_at DESC);

-- ---------- reader questions (the content flywheel) ----------
CREATE TABLE IF NOT EXISTS questions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT,                            -- article it was asked on; NULL = general
  name        TEXT NOT NULL DEFAULT '',        -- shown if published
  email       TEXT,                            -- never shown; only so you can reply
  body        TEXT NOT NULL,
  answer      TEXT,
  status      TEXT NOT NULL DEFAULT 'pending', -- pending | published | spam | archived
  created_at  TEXT NOT NULL,
  answered_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_questions_slug
  ON questions (slug, status, created_at DESC);

-- ---------- subscribers (confirmed opt-in only) ----------
CREATE TABLE IF NOT EXISTS subscribers (
  email        TEXT PRIMARY KEY,
  token        TEXT NOT NULL,                  -- confirm + unsubscribe link
  status       TEXT NOT NULL DEFAULT 'pending',-- pending | confirmed | unsubscribed
  lang         TEXT NOT NULL DEFAULT 'en',
  source       TEXT NOT NULL DEFAULT '',       -- which page they signed up from
  created_at   TEXT NOT NULL,
  confirmed_at TEXT
);

-- ---------- client enquiries ----------
CREATE TABLE IF NOT EXISTS enquiries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  kind       TEXT NOT NULL DEFAULT 'general',  -- hiring | project | reader | general
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new',      -- new | replied | closed
  notes      TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_enquiries_status
  ON enquiries (status, created_at DESC);

-- ---------- signals ----------
-- Views: a counter per path per day. No identity of any kind.
CREATE TABLE IF NOT EXISTS views (
  path  TEXT NOT NULL,
  day   TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (path, day)
);

-- Reactions: "this helped" and friends, same shape.
CREATE TABLE IF NOT EXISTS reactions (
  slug  TEXT NOT NULL,
  kind  TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (slug, kind)
);

-- ---------- admin ----------
CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  label      TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Throttling for the public write endpoints. Keyed by a salted hash
-- of the caller, where the salt rotates daily — so it can slow an
-- abuser down without the table ever holding an IP address.
CREATE TABLE IF NOT EXISTS throttle (
  bucket  TEXT PRIMARY KEY,
  count   INTEGER NOT NULL DEFAULT 0,
  resets  TEXT NOT NULL
);
