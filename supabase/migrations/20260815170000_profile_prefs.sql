-- ============================================================
-- What a reader is here for.
--
-- The profile held a display name and nothing else, which was the
-- right size while an account only had to put a name beside a
-- comment. Three things are added here, and each one has to change
-- something the reader can see, or it does not belong in a table
-- somebody has to trust:
--
--   following   which courses this person is actually doing. The
--               home page's "pick up where you left off" band puts
--               these first, and offers the opening lesson of a
--               course that is followed but not started. Without
--               it the band can only react to what has already
--               been read, which is no use to somebody who has
--               just decided to start German.
--
--   pace        how often they mean to practise. The account page
--               measures the last seven days against it. It is a
--               statement of intent, not a target the site nags
--               about, and there is no notification anywhere on
--               this site to nag with.
--
--   setup_at    whether they have been asked any of this yet. Null
--               means the account page opens on a short setup card
--               instead of a settings page. Set once, and the same
--               fields become ordinary settings afterwards.
--
-- Columns rather than one jsonb blob, deliberately. Each of these
-- drives a specific behaviour, and a typo in a jsonb key is a
-- preference that silently does nothing, which is the failure this
-- codebase keeps writing checks against.
--
-- TRANSITION.md, Stage 5.
-- ============================================================

alter table public.profiles
  add column if not exists following text[] not null default '{}',
  add column if not exists pace text not null default '',
  add column if not exists setup_at timestamptz;

-- The four course ids the site knows, plus the empty array. A
-- constraint rather than a lookup table: these are four folders in
-- a static site, not data, and a foreign key to a table nobody
-- writes is a join for no reason.
alter table public.profiles
  drop constraint if exists profiles_following_known;
alter table public.profiles
  add constraint profiles_following_known
  check (following <@ array['learn', 'deutsch', 'quran', 'english']::text[]);

alter table public.profiles
  drop constraint if exists profiles_pace_known;
alter table public.profiles
  add constraint profiles_pace_known
  check (pace in ('', 'daily', 'often', 'sometimes'));

-- The policies from the first migration already cover these: a
-- person updates their own row and nobody else's. Nothing here
-- widens that, and the select policy is unchanged, so `following`
-- is world-readable in the same way `display_name` is. That is
-- fine for a name next to a comment and it is fine for "is
-- learning German"; anything that would not be fine to show does
-- not go in this table.
