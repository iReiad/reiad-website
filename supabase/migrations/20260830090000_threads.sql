-- ============================================================
-- `threads`: a question somebody is chasing, and everything
-- hanging off it.
--
-- The site already holds four kinds of row that belong to one
-- person: their progress, a saved calculator, a target, and a
-- page they kept. None of them is a place to work. A piece of
-- research is a QUESTION, and around it accumulate sources, a
-- note that grows for weeks, a list of what is left to do, and
-- the things on this site it touches. Kept in a text file, that
-- is a text file on one machine; kept here it is on every
-- machine and it is backed up with everything else.
--
-- ---- why one table and one jsonb ----
--
-- A source is not queried on its own, a task is not queried on
-- its own, and neither is ever read without the thread it belongs
-- to. Three tables and two joins would buy nothing and cost the
-- thing that matters most in a working surface, which is that a
-- save is one round trip and cannot half-succeed. `body` is that
-- shape, and it is checked in the browser rather than by the
-- database for the same reason `scenarios.inputs` is: the shape
-- belongs to the page that writes it.
--
-- The four columns OUTSIDE the body are the four things a list
-- has to show without opening a thread, and `state` is a check
-- constraint rather than free text because a typo there is a
-- thread that disappears from every filter.
--
-- ---- and it is the reader's own, like everything else ----
--
-- Row-level security, `auth.uid() = user_id`, all four verbs,
-- with `user_id` DEFAULTED rather than sent: the browser never
-- names whose row it is writing, so it cannot get it wrong.
-- `scenarios` says the same thing where it does it.
--
-- Nothing here is admin-only IN THE DATABASE, and that is
-- deliberate. The page is behind `isAdmin()` because that is who
-- it is built for today; the rows are behind the same policy
-- every other personal table has, so opening the page to more
-- people later is a change to a page rather than to a schema.
-- ============================================================

create table if not exists public.threads (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- The question itself. One line, and the only thing that is
  -- required: a thread with no question is a note, and there is
  -- already a place for those.
  question   text not null check (char_length(question) between 1 and 200),
  -- open: being worked on. parked: real, not now. answered: done,
  -- and kept, because the answer is the point.
  state      text not null default 'open' check (state in ('open', 'parked', 'answered')),
  -- Free, lowercased by the browser, and an array so a filter is
  -- a containment test rather than a LIKE over a string.
  tags       text[] not null default '{}',
  -- The note, the sources, what is next, and what on this site it
  -- touches. See the header.
  body       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The list's own order: mine, newest touched first, and the state
-- in the index because every view of the list filters on it.
create index if not exists idx_threads_mine
  on public.threads (user_id, state, updated_at desc);

-- Containment, for the tag filter.
create index if not exists idx_threads_tags
  on public.threads using gin (tags);

alter table public.threads enable row level security;

drop policy if exists "read your own threads" on public.threads;
create policy "read your own threads"
  on public.threads for select
  using ((select auth.uid()) = user_id);

drop policy if exists "add your own threads" on public.threads;
create policy "add your own threads"
  on public.threads for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "change your own threads" on public.threads;
create policy "change your own threads"
  on public.threads for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "delete your own threads" on public.threads;
create policy "delete your own threads"
  on public.threads for delete
  using ((select auth.uid()) = user_id);

-- `updated_at` is what the list sorts by, so it has to move on
-- every write rather than only on the ones that remember to send
-- it. The function is the one the other tables already share.
drop trigger if exists threads_touch on public.threads;
create trigger threads_touch
  before update on public.threads
  for each row execute function public.touch_updated_at();
