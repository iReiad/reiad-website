-- ============================================================
-- The two things an account holds that are not a tick.
--
-- `progress` is a set of ids per person per key, and that shape
-- is right for "what have I read": every entry is the same size,
-- the only operations are add and remove, and the whole of it
-- fits in one round trip. Neither of the things below is that
-- shape, and putting them in there as another jsonb blob would
-- have meant one row per person growing without limit, no way to
-- delete one item, and no way for the database to say what a
-- valid one looks like.
--
--   scenarios   a filled-in calculator, saved under a name. The
--               stock check has forty-odd inputs and already
--               encodes all of them in its own query string, so
--               what is stored is that string plus enough of the
--               answer to list it: "Square Pharma, 71.4, Buy".
--               Somebody comparing two companies has two of
--               these; somebody revisiting last quarter's numbers
--               has one per quarter.
--
--   targets     a goal with a number on it. Three kinds, and each
--               one has a source for its progress that already
--               exists, which is the test a fourth kind would
--               have to pass:
--
--                 course   finish a ladder. Progress is the
--                          reader's own ticks over the lessons
--                          that ladder holds.
--                 habit    turn up n days a week. Progress is
--                          `days-active`, which streak.js has
--                          written since long before this.
--                 metric   a number the reader is tracking that
--                          this site cannot see: a portfolio
--                          yield, a savings balance. They type
--                          the current value in, and that is
--                          honest about where it came from.
--
-- Row-level security on both, and it is the same shape as
-- `progress`: your own rows, all four verbs, and nobody else's
-- ever. Neither table is world-readable the way `profiles` is.
-- What you are aiming for is nobody's business, and a saved
-- scenario is a statement about a company you may not want
-- attached to your name.
--
-- CLAUDE.md, "Fully redo sync", 17 August 2026.
-- ============================================================

-- ---------- saved scenarios ----------

create table if not exists public.scenarios (
  id         uuid primary key default gen_random_uuid(),
  -- Defaulted rather than sent by the client, exactly as
  -- `progress` does it: the browser never names whose row it is
  -- writing, so it cannot get it wrong.
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- Which calculator this belongs to. `stock` today.
  tool       text not null check (char_length(tool) between 1 and 40),
  name       text not null default '' check (char_length(name) <= 80),
  -- The inputs, in whatever shape the tool already had for them.
  -- The stock check stores its own query string, which is the
  -- format it has shared analyses in since it was written and the
  -- only one that cannot drift from what the page reads.
  inputs     jsonb not null default '{}'::jsonb,
  -- One line of the answer, so the account page can list a
  -- scenario without loading the model that produced it.
  summary    text not null default '' check (char_length(summary) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_scenarios_mine
  on public.scenarios (user_id, tool, updated_at desc);

alter table public.scenarios enable row level security;

drop policy if exists "read your own scenarios" on public.scenarios;
create policy "read your own scenarios"
  on public.scenarios for select
  using ((select auth.uid()) = user_id);

drop policy if exists "add your own scenarios" on public.scenarios;
create policy "add your own scenarios"
  on public.scenarios for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "change your own scenarios" on public.scenarios;
create policy "change your own scenarios"
  on public.scenarios for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "delete your own scenarios" on public.scenarios;
create policy "delete your own scenarios"
  on public.scenarios for delete
  using ((select auth.uid()) = user_id);

-- ---------- targets ----------

create table if not exists public.targets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind       text not null check (kind in ('course', 'habit', 'metric')),
  -- What the kind is about: a course id for `course`, a unit of
  -- time for `habit`, and free text naming the number for
  -- `metric`. Checked against the course list for the one kind
  -- where a typo would mean a bar that never moves.
  subject    text not null default '' check (char_length(subject) <= 60),
  label      text not null check (char_length(label) between 1 and 80),
  -- The number being aimed at, and the number reached. `reached`
  -- is only written for `metric`: the other two are computed from
  -- what the reader has actually done, and a stored copy of a
  -- derived number is a copy that goes stale.
  target     numeric not null default 0 check (target >= 0),
  -- `reached` rather than `current`, because `current` is a
  -- keyword in enough dialects and enough client libraries that a
  -- column named it is a column somebody has to quote for ever.
  reached    numeric not null default 0 check (reached >= 0),
  unit       text not null default '' check (char_length(unit) <= 20),
  -- Set when the reader says it is finished, which is not the
  -- same as the bar reaching the end: somebody may decide a goal
  -- is done at eighty per cent, and somebody else may pass a
  -- number and want to keep going.
  done_at    timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_targets_mine
  on public.targets (user_id, created_at desc);

alter table public.targets
  drop constraint if exists targets_course_known;
alter table public.targets
  add constraint targets_course_known
  check (kind <> 'course'
         or subject in ('money', 'deutsch', 'quran', 'english'));

alter table public.targets enable row level security;

drop policy if exists "read your own targets" on public.targets;
create policy "read your own targets"
  on public.targets for select
  using ((select auth.uid()) = user_id);

drop policy if exists "add your own targets" on public.targets;
create policy "add your own targets"
  on public.targets for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "change your own targets" on public.targets;
create policy "change your own targets"
  on public.targets for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "delete your own targets" on public.targets;
create policy "delete your own targets"
  on public.targets for delete
  using ((select auth.uid()) = user_id);

-- ---------- updated_at, and a ceiling ----------

-- touch_updated_at() came with the profiles migration.
drop trigger if exists scenarios_touch_updated_at on public.scenarios;
create trigger scenarios_touch_updated_at
  before update on public.scenarios
  for each row execute function public.touch_updated_at();

drop trigger if exists targets_touch_updated_at on public.targets;
create trigger targets_touch_updated_at
  before update on public.targets
  for each row execute function public.touch_updated_at();

-- Neither of these is a table a person should be able to fill.
-- The browser will not ask to, but a policy that permits an
-- insert permits an unlimited number of them, and "the client
-- would not do that" is not a rule the database is keeping. Two
-- hundred saved scenarios and fifty targets are both far past
-- anything a reader would have and far short of anything that
-- costs this project money.
create or replace function public.cap_rows()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  n integer;
  ceiling integer := (tg_argv[0])::integer;
begin
  execute format('select count(*) from %I.%I where user_id = $1', tg_table_schema, tg_table_name)
    into n using new.user_id;
  if n >= ceiling then
    raise exception 'too many rows for one account (limit %)', ceiling
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists scenarios_cap on public.scenarios;
create trigger scenarios_cap
  before insert on public.scenarios
  for each row execute function public.cap_rows('200');

drop trigger if exists targets_cap on public.targets;
create trigger targets_cap
  before insert on public.targets
  for each row execute function public.cap_rows('50');
