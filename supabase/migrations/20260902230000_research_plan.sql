-- The planner (RESEARCH.md section 17). A milestone, a deadline, a
-- meeting, a conference and a submission are all events: a kind, a
-- time, an optional end, a project, and a body shaped by the kind
-- (a meeting's agenda, minutes and actions; a submission's journal,
-- status and the reviewers' comments as a table). A session is the
-- time log: started, ended, in which room, on which project.

create table if not exists public.research_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id uuid references public.research_projects (id) on delete set null,
  kind       text not null default 'deadline'
             check (kind in ('milestone','deadline','meeting','conference','submission','other')),
  title      text not null check (char_length(title) between 1 and 300),
  starts     timestamptz not null,
  ends       timestamptz,
  all_day    boolean not null default true,
  place      text not null default '',
  body       jsonb not null default '{}'::jsonb,
  done       boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_events_mine_idx
  on public.research_events (user_id, starts);

alter table public.research_events enable row level security;

create policy "a person reads their own research events"
  on public.research_events for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research events"
  on public.research_events for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research events"
  on public.research_events for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research events"
  on public.research_events for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_events_touch on public.research_events;
create trigger research_events_touch
  before update on public.research_events
  for each row execute function public.touch_updated_at();

create table if not exists public.research_sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id uuid references public.research_projects (id) on delete set null,
  room       text not null default '',
  started    timestamptz not null default now(),
  ended      timestamptz,
  note       text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_sessions_mine_idx
  on public.research_sessions (user_id, started desc);

alter table public.research_sessions enable row level security;

create policy "a person reads their own research sessions"
  on public.research_sessions for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research sessions"
  on public.research_sessions for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research sessions"
  on public.research_sessions for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research sessions"
  on public.research_sessions for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_sessions_touch on public.research_sessions;
create trigger research_sessions_touch
  before update on public.research_sessions
  for each row execute function public.touch_updated_at();
