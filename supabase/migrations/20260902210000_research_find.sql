-- Finding (RESEARCH.md section 10): a saved search is a row, and
-- that row IS the search log a systematic review's methods section
-- has to print: the string, the fields, the databases, the date and
-- the hit count. `alert` is the flag the Monday cron reruns it for;
-- the copy of the string that cron reads lives in D1, written by
-- the browser when the flag is set, because the Worker holds no
-- key that could read this table.

create table if not exists public.research_searches (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  query      text not null check (char_length(query) between 1 and 1000),
  -- { author, from, to, oa, type }: the fielded half of the search.
  fields     jsonb not null default '{}'::jsonb,
  databases  text[] not null default '{}',
  hits       integer,
  alert      boolean not null default false,
  last_run   timestamptz,
  project_id uuid references public.research_projects (id) on delete set null,
  -- The review this search belongs to, once the review room exists
  -- (section 13). No foreign key yet: the table it points at is a
  -- later stage's.
  review_id  uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_searches_mine_idx
  on public.research_searches (user_id, updated_at desc);

alter table public.research_searches enable row level security;

create policy "a person reads their own research searches"
  on public.research_searches for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research searches"
  on public.research_searches for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research searches"
  on public.research_searches for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research searches"
  on public.research_searches for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_searches_touch on public.research_searches;
create trigger research_searches_touch
  before update on public.research_searches
  for each row execute function public.touch_updated_at();
