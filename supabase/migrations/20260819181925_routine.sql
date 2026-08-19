-- ============================================================
-- Routine: a daily list, one per person, private to them.
--
-- THE NUMBER IN THIS FILENAME IS THE VERSION THE DATABASE
-- RECORDED, not a tidy timestamp. It was applied through the
-- Supabase MCP and stamped 20260819181925, so that is what it is
-- called. CLAUDE.md says why at length: renaming an applied
-- migration tells the GitHub integration that a migration it has
-- never seen has appeared, and two hand-rounded names took the
-- Supabase branch to MIGRATIONS_FAILED for four days while every
-- table stayed correct and the site never noticed.
--
-- ROUTINE.md is the plan and the reasoning. What matters here is
-- the one rule the schema itself has to enforce, and it is not a
-- product preference, it is why `tasks` is jsonb:
--
--   NOTHING THIS TOOL REMEMBERS ABOUT SOMEBODY EVER GOES DOWN.
--
-- An entry stores marks keyed by task id. If tasks were rows,
-- deleting one would either break every day it was marked on or
-- cascade those marks away, and a person would lose a fortnight
-- of their own history by tidying a list. So the task list is a
-- SNAPSHOT on the routine, marks are keyed by id, and a deleted
-- task is `archived: true` rather than gone. Ids are never
-- reused and never removed. An archived task leaves today's list
-- and still renders correctly on a day it was marked.
--
-- Do not "helpfully" normalise this. It is the difference between
-- a tool somebody keeps for a year and one they abandon in March.
--
-- ---- why the names carry a prefix ----
--
-- This database already holds `progress`, `library`, `targets`
-- and `scenarios` for the rest of the site. A bare `entries` or
-- `templates` is a name the next feature will want, and the day
-- two features want one name is the day one of them loses.
--
-- ---- and why there is no local mirror ----
--
-- `progress` has one because four schools have read localStorage
-- since before there were accounts, and a reader with no account
-- still gets all of it. Nothing here has that history and nothing
-- here works signed out, so a second copy would be a second
-- record to keep in step for nobody's benefit. `scenarios` and
-- `targets` already made this call.
-- ============================================================

-- ---------- three settings on the table that already exists ----------
-- They are facts about a PERSON rather than about a routine:
-- somebody with two routines still has one week and one idea of
-- when a day ends. The `routine_` prefix is what stops the next
-- feature that wants a `locale` from finding this one and
-- assuming it means the site's.
--
-- `routine_day_roll` is the hour a day ENDS, not the hour it
-- starts. Marking something at 1am belongs to yesterday, because
-- that is what the person doing it means.
alter table public.profiles
  add column if not exists routine_locale     text     not null default 'both',
  add column if not exists routine_week_start smallint not null default 6,
  add column if not exists routine_day_roll   smallint not null default 4;

alter table public.profiles
  drop constraint if exists profiles_routine_locale_known;
alter table public.profiles
  add constraint profiles_routine_locale_known
  check (routine_locale in ('both', 'en', 'bn'));

alter table public.profiles
  drop constraint if exists profiles_routine_week_start_real;
alter table public.profiles
  add constraint profiles_routine_week_start_real
  check (routine_week_start between 0 and 6);

-- Any hour of the day is a legitimate answer. Somebody who works
-- nights genuinely does end their day at 11am.
alter table public.profiles
  drop constraint if exists profiles_routine_day_roll_real;
alter table public.profiles
  add constraint profiles_routine_day_roll_real
  check (routine_day_roll between 0 and 23);

-- ---------- starter routines ----------
-- `owner_id is null` is a template the site ships. Everything
-- else belongs to the person who saved it.
create table if not exists public.routine_templates (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references auth.users (id) on delete cascade,
  name        text not null,
  description text,
  -- Built as a column with no interface, which is the plan's
  -- instruction and the right shape: the schema does not have to
  -- change the day sharing is wanted, and nothing ships that
  -- nobody can use.
  is_public   boolean not null default false,
  data        jsonb not null,
  created_at  timestamptz not null default now()
);

alter table public.routine_templates enable row level security;

-- The site's own, your own, and anything published. Three
-- conditions and the third does nothing yet, deliberately.
drop policy if exists "a template is the site's, yours, or published"
  on public.routine_templates;
create policy "a template is the site's, yours, or published"
  on public.routine_templates for select
  using (owner_id is null
         or owner_id = (select auth.uid())
         or is_public);

-- Writing is yours alone, and `owner_id is null` is deliberately
-- unreachable from a browser: a site template is inserted by a
-- migration, so no combination of tokens can mint one.
drop policy if exists "a person saves their own template"
  on public.routine_templates;
create policy "a person saves their own template"
  on public.routine_templates for insert
  with check (owner_id = (select auth.uid()));

drop policy if exists "a person edits their own template"
  on public.routine_templates;
create policy "a person edits their own template"
  on public.routine_templates for update
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists "a person deletes their own template"
  on public.routine_templates;
create policy "a person deletes their own template"
  on public.routine_templates for delete
  using (owner_id = (select auth.uid()));

-- ---------- a person's own editable routine ----------
create table if not exists public.routines (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  -- A band is { id, en, bn, colour, order }. A task is
  -- { id, band, en, bn, hours, counts, order, archived }, and
  -- `counts: false` means tracked and excluded from every piece
  -- of arithmetic: leisure must never be able to fail.
  bands      jsonb not null,
  tasks      jsonb not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists routines_user_idx on public.routines (user_id);

alter table public.routines enable row level security;

drop policy if exists "a person reads their own routines" on public.routines;
create policy "a person reads their own routines"
  on public.routines for select using (user_id = (select auth.uid()));

drop policy if exists "a person writes their own routines" on public.routines;
create policy "a person writes their own routines"
  on public.routines for insert with check (user_id = (select auth.uid()));

drop policy if exists "a person edits their own routines" on public.routines;
create policy "a person edits their own routines"
  on public.routines for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "a person deletes their own routines" on public.routines;
create policy "a person deletes their own routines"
  on public.routines for delete using (user_id = (select auth.uid()));

-- ---------- one row per person per day ----------
create table if not exists public.routine_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  routine_id uuid not null references public.routines (id) on delete cascade,
  entry_date date not null,
  -- { "<task id>": 1 | 0.5 }. Half is half, and it counts as 0.5
  -- rather than as a lesser kind of nothing.
  marks      jsonb not null default '{}',
  mood       text,
  note       text,
  -- What "something I chose" actually was. One column past the
  -- spec, and it earns the room: that task has no hours and does
  -- not count, so a line beside it turns one tick into a diary.
  chose      text,
  updated_at timestamptz not null default now(),
  -- One row per person per day, which is what makes an upsert on
  -- (user_id, entry_date) the whole of saving.
  unique (user_id, entry_date)
);

-- Newest first, because every read here is "the last n days".
create index if not exists routine_entries_user_date_idx
  on public.routine_entries (user_id, entry_date desc);

alter table public.routine_entries enable row level security;

drop policy if exists "a person reads their own days" on public.routine_entries;
create policy "a person reads their own days"
  on public.routine_entries for select using (user_id = (select auth.uid()));

drop policy if exists "a person writes their own days" on public.routine_entries;
create policy "a person writes their own days"
  on public.routine_entries for insert with check (user_id = (select auth.uid()));

drop policy if exists "a person edits their own days" on public.routine_entries;
create policy "a person edits their own days"
  on public.routine_entries for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "a person deletes their own days" on public.routine_entries;
create policy "a person deletes their own days"
  on public.routine_entries for delete using (user_id = (select auth.uid()));

-- ---------- keep updated_at honest ----------
-- touch_updated_at() came with the profiles migration.
drop trigger if exists routines_touch_updated_at on public.routines;
create trigger routines_touch_updated_at
  before update on public.routines
  for each row execute function public.touch_updated_at();

drop trigger if exists routine_entries_touch_updated_at on public.routine_entries;
create trigger routine_entries_touch_updated_at
  before update on public.routine_entries
  for each row execute function public.touch_updated_at();
