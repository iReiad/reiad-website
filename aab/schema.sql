-- ============================================================
-- schema.sql: the whole database.
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
--   · Article bodies are sanitised HTML: the same sanitiser the
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
  section      TEXT NOT NULL DEFAULT 'insights', -- insights | cooking | travel
  published_at TEXT,                          -- ISO date, set when it goes live
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  cover            TEXT NOT NULL DEFAULT '',  -- /media/... lead image, also the og:image
  notion_page_id   TEXT,                      -- set when the piece came from Notion
  notion_synced_at TEXT                       -- when it was last pulled from there
);
CREATE INDEX IF NOT EXISTS idx_articles_live
  ON articles (status, published_at DESC);

-- The body before the last overwrite, and the nineteen before that.
-- Publishing replaces an article in place, which until this existed
-- meant a republish you regretted had nothing to go back to.
CREATE TABLE IF NOT EXISTS article_versions (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  slug     TEXT NOT NULL,
  title    TEXT NOT NULL DEFAULT '',
  dek      TEXT NOT NULL DEFAULT '',
  tag      TEXT NOT NULL DEFAULT '',
  lang     TEXT NOT NULL DEFAULT 'en',
  body     TEXT NOT NULL DEFAULT '',
  cover    TEXT NOT NULL DEFAULT '',
  saved_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_versions_slug
  ON article_versions (slug, saved_at DESC);

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
-- of the caller, where the salt rotates daily, so it can slow an
-- abuser down without the table ever holding an IP address.
CREATE TABLE IF NOT EXISTS throttle (
  bucket  TEXT PRIMARY KEY,
  count   INTEGER NOT NULL DEFAULT 0,
  resets  TEXT NOT NULL
);

-- Comments, moderated exactly like questions and with an author
-- attached. TRANSITION.md, Stage 7.
--
-- `author_id` is a Supabase user id, written only after the Worker
-- has verified the signature on the reader's access token; see
-- functions/_lib/reader.js. `author_name` is a COPY of the display
-- name at the time of writing, which is the seam in TRANSITION.md
-- section 1 doing its job: D1 holds what a signed-out reader needs
-- to render the page, Supabase holds who people are, and the two
-- never join. A thread renders for a stranger with Supabase down.
--
-- `body` is text and stays text. A comment is never HTML, so there
-- is no sanitiser here to get wrong.
CREATE TABLE IF NOT EXISTS comments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL,
  section     TEXT NOT NULL DEFAULT 'insights',
  parent_id   INTEGER,
  author_id   TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending',
  created_at  TEXT NOT NULL,
  approved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_comments_thread
  ON comments (slug, status, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_queue
  ON comments (status, created_at DESC);

-- ============================================================
-- The schools: four curricula, 251 generated pages, one shape.
--
-- TRANSITION.md Stage 8. The goal is that a lesson can be
-- corrected without a rebuild and edited from the Studio, and the
-- reason these are in D1 rather than in Supabase is the rule in
-- section 1 of that document: a lesson is read by people who have
-- never signed in, so it renders at the edge. What a reader DID
-- with a lesson is a person's, and stays in Supabase.
--
-- ---- why there is a `meta` column, and what is not in it ----
--
-- The four schools are genuinely different and were written that
-- way on purpose. /learn/ has stages and sections; /deutsch/ has
-- Stufen, Teile and a 30 day Arbeitsbuch; /quran/ makes the day
-- itself the lesson and carries Arabic beside every Bangla line;
-- /english/ has terms and parts and its own workbook. Flattening
-- that into one wide table of nullable columns would either lose
-- fields or invent forty of them.
--
-- So the columns are what every school has and what anything
-- actually queries on, and `meta` is that school's own fields as
-- JSON, round-tripped exactly. `scripts/schools.test.mjs` fails
-- if a single field goes missing on the way in or out, which is
-- the guarantee that makes a JSON column safe rather than lazy.
--
-- What is deliberately NOT in `meta`: anything that decides a URL
-- or a layout. That is code, it lives in `curriculum.js` and the
-- builders, and section 2b of TRANSITION.md is about exactly this
-- line.
-- ============================================================

CREATE TABLE IF NOT EXISTS school_stages (
  school     TEXT NOT NULL,          -- learn, deutsch, quran, english
  slug       TEXT NOT NULL,          -- stufe-1, dhap-2, term-1, basics-3
  position   INTEGER NOT NULL,       -- ladder order, as the file has it
  title      TEXT NOT NULL DEFAULT '',
  status     TEXT NOT NULL DEFAULT 'live',
  meta       TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL,
  PRIMARY KEY (school, slug)
);

CREATE TABLE IF NOT EXISTS school_sections (
  school     TEXT NOT NULL,
  stage      TEXT NOT NULL,
  ident      TEXT NOT NULL,          -- the section's own id in the file
  position   INTEGER NOT NULL,
  title      TEXT NOT NULL DEFAULT '',
  meta       TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL,
  PRIMARY KEY (school, stage, ident)
);

-- `body` is the lesson's HTML, the thing content/<stage>.js holds
-- today. It is written by the same sanitiser an article goes
-- through when it comes from the Studio, and it is empty for a
-- lesson that has not been written yet: the builders already draw
-- a "coming soon" page for those and must keep doing so.
CREATE TABLE IF NOT EXISTS school_lessons (
  school     TEXT NOT NULL,
  stage      TEXT NOT NULL,
  slug       TEXT NOT NULL,
  section    TEXT NOT NULL DEFAULT '',
  position   INTEGER NOT NULL,
  title      TEXT NOT NULL DEFAULT '',
  minutes    INTEGER NOT NULL DEFAULT 0,
  status     TEXT NOT NULL DEFAULT 'live',
  meta       TEXT NOT NULL DEFAULT '{}',
  body       TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL,
  PRIMARY KEY (school, stage, slug)
);

CREATE INDEX IF NOT EXISTS idx_school_lessons_order
  ON school_lessons (school, stage, position);
