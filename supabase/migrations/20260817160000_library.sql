-- ============================================================
-- A reader's library: what they kept, and what they wrote in the
-- margin of it.
--
-- ONE TABLE FOR BOTH, and that is the decision worth explaining,
-- because two would have been the obvious shape. A bookmark and a
-- note look like different things: one is a boolean and the other
-- is prose. They are not different THINGS, they are two facts
-- about the same one, which is a page this reader has a
-- relationship with. Somebody who annotates a piece has almost
-- always saved it, the page shows both controls in one row, and
-- the account page lists them as one library.
--
-- Two tables would have meant two round trips to draw that row,
-- two inserts when somebody uses both controls, and a state where
-- a note exists for a page with no bookmark row to hang it on.
-- One row per person per page answers all of it, and `saved` and
-- `note` are simply columns that can each be empty.
--
--   url      the page, and the identity. A row per person per
--            page, held by a unique index rather than by the
--            browser remembering not to insert twice.
--   title    what it was called when it was kept, so a list can
--            be drawn without fetching every page in it.
--   kind     `piece` or `lesson`. Only for the icon and the
--            grouping: nothing here joins to either table, and it
--            deliberately does not, because a lesson lives in D1
--            and this lives in Postgres and a foreign key across
--            two databases is a foreign key that is a lie.
--   saved    on the reading list.
--   note     what they wrote. Empty is the normal case.
--
-- Row-level security exactly as `progress` and `scenarios` have
-- it: your own rows, all four verbs, nobody else's ever. A note
-- is the most private thing this site stores and it is the
-- easiest to leak, so it gets no select policy anybody else can
-- satisfy and it is never rendered anywhere public.
-- ============================================================

create table if not exists public.library (
  id         uuid primary key default gen_random_uuid(),
  -- Defaulted rather than sent by the client, as everywhere else
  -- here: the browser never names whose row it is writing.
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  url        text not null check (char_length(url) between 1 and 400),
  title      text not null default '' check (char_length(title) <= 200),
  kind       text not null default 'piece' check (kind in ('piece', 'lesson')),
  saved      boolean not null default false,
  -- 20,000 characters is about eight pages of typing, which is
  -- far past a margin note and far short of anything that costs
  -- this project money. The browser stops at the same number, and
  -- this is the copy that is actually enforced.
  note       text not null default '' check (char_length(note) <= 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per person per page. The browser upserts on to this
-- rather than reading first and deciding, which is one round trip
-- instead of two and cannot race with the same reader's phone.
create unique index if not exists idx_library_one_per_page
  on public.library (user_id, url);

create index if not exists idx_library_saved
  on public.library (user_id, saved, updated_at desc);

alter table public.library enable row level security;

drop policy if exists "read your own library" on public.library;
create policy "read your own library"
  on public.library for select
  using ((select auth.uid()) = user_id);

drop policy if exists "add to your own library" on public.library;
create policy "add to your own library"
  on public.library for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "change your own library" on public.library;
create policy "change your own library"
  on public.library for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "delete from your own library" on public.library;
create policy "delete from your own library"
  on public.library for delete
  using ((select auth.uid()) = user_id);

-- touch_updated_at() came with the profiles migration.
drop trigger if exists library_touch_updated_at on public.library;
create trigger library_touch_updated_at
  before update on public.library
  for each row execute function public.touch_updated_at();

-- cap_rows() came with the scenarios migration. Two thousand
-- pages is a decade of reading this site and is still a table
-- nobody can fill on purpose.
drop trigger if exists library_cap on public.library;
create trigger library_cap
  before insert on public.library
  for each row execute function public.cap_rows('2000');

-- ---------- a row that empties itself is a row that goes ----------
--
-- Unsaving a page you never annotated should not leave a row
-- behind saying nothing. Without this, a reader who taps Save and
-- taps it again has a row for that page for ever, and the reading
-- list is drawn by filtering rather than by reading, which is
-- slower and, worse, means "how many pages have I kept" cannot be
-- answered by counting.
create or replace function public.drop_empty_library_row()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.saved = false and coalesce(new.note, '') = '' then
    delete from public.library where id = new.id;
  end if;
  return null;
end;
$$;

drop trigger if exists library_drop_empty on public.library;
create trigger library_drop_empty
  after update on public.library
  for each row execute function public.drop_empty_library_row();
