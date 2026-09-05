-- Work-Alpha (next/components/work-alpha/WORK-ALPHA.md): one row per
-- reader, the whole state of the month plan as JSON. The browser reads
-- and writes it with the reader's own bearer; the page is the owner's
-- alone, and this row-level security is the lock that holds even if
-- the route and the rail both fail.

create table if not exists public.work_alpha_state (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.work_alpha_state enable row level security;

create policy "a person reads their own work-alpha state"
  on public.work_alpha_state for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own work-alpha state"
  on public.work_alpha_state for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own work-alpha state"
  on public.work_alpha_state for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own work-alpha state"
  on public.work_alpha_state for delete
  using ((select auth.uid()) = user_id);
