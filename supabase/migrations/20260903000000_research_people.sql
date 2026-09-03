-- People (RESEARCH.md section 18): supervisors, authors the reader
-- corresponds with, examiners, gatekeepers. A name, a role, an
-- ORCID, an email, an institution, notes, and links to sources.
-- The supervisor shortlist is fifteen of these rows with a fit
-- note each. The same row-level security as every research_ table.

create table if not exists public.research_people (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 200),
  role        text not null default 'author'
              check (role in ('supervisor','author','examiner','gatekeeper','colleague','other')),
  orcid       text,
  email       text,
  institution text not null default '',
  note        text not null default '',
  projects    uuid[] not null default '{}',
  sources     uuid[] not null default '{}',
  body        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_people_mine_idx
  on public.research_people (user_id, role, name);

alter table public.research_people enable row level security;

create policy "a person reads their own research people"
  on public.research_people for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research people"
  on public.research_people for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research people"
  on public.research_people for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research people"
  on public.research_people for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_people_touch on public.research_people;
create trigger research_people_touch
  before update on public.research_people
  for each row execute function public.touch_updated_at();
