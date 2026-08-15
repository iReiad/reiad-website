-- ============================================================
-- Reader accounts: the one table they need.
--
-- Supabase keeps the account itself in auth.users, which this
-- project does not own and must not write to. A profile is the
-- part that belongs to this site: the name shown beside a comment,
-- and nothing else. Anything else a reader accumulates gets its
-- own table with its own policies, so that "who you are" and "what
-- you did" never live in one row.
--
-- TRANSITION.md, Stage 5.
-- ============================================================

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  -- Shown beside a comment. Seeded from the Google name or from the
  -- part of the email before the @, and editable by its owner.
  display_name text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Readable by anyone, on purpose: a comment shows its author's name
-- to people who are not signed in, and that name is the only thing
-- in this table. An email address is in auth.users, which nothing
-- here can read.
drop policy if exists "profiles are readable by anyone" on public.profiles;
create policy "profiles are readable by anyone"
  on public.profiles for select
  using (true);

drop policy if exists "a person writes their own profile" on public.profiles;
create policy "a person writes their own profile"
  on public.profiles for insert
  with check ((select auth.uid()) = id);

drop policy if exists "a person edits their own profile" on public.profiles;
create policy "a person edits their own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No delete policy, deliberately. Deleting the account in
-- auth.users takes the profile with it through the cascade above,
-- which is the only way a profile should ever disappear.

-- ---------- a profile appears with the person ----------
-- Without this, the first thing every new reader would meet is a
-- comment box that cannot say who they are.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(coalesce(new.email, 'reader'), '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- keep updated_at honest ----------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();
