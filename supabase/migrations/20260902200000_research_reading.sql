-- The reading room (RESEARCH.md section 11): a highlight is a row,
-- anchored to the text it marks rather than to pixels.
--
-- `quote`, `prefix` and `suffix` are the W3C Web Annotation model's
-- TextQuoteSelector: the words marked and thirty characters either
-- side. `rects` is a cache of where that was drawn, in the page's
-- own units at scale one, and the reader falls back to the quote
-- when the rectangles are missing or no longer fit (another
-- edition's PDF, a re-OCRed file). `fields` is the extraction card:
-- a number and its unit, a sample size, a method, a finding, each
-- a field rather than free text so the review room's table can be
-- filled from the reading. `position` is what a highlight is when
-- it is not a rectangle: a time range in an audio file, a typed
-- page in a book.
--
-- The same row-level security every research_ table has: every
-- row is the reader's own, user_id defaults to the caller, and
-- nothing here is readable by anybody else.

create table if not exists public.research_highlights (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  source_id  uuid not null references public.research_sources (id) on delete cascade,
  -- The R2 key of the file it was made in, or null for a book with
  -- no file, where the page and the quote were typed.
  file_key   text,
  page       integer,
  quote      text not null default '',
  prefix     text not null default '',
  suffix     text not null default '',
  rects      jsonb not null default '[]'::jsonb,
  meaning    text not null default 'quote'
             check (meaning in ('claim','evidence','method','quote','question')),
  note       text not null default '',
  fields     jsonb not null default '{}'::jsonb,
  position   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_highlights_mine_idx
  on public.research_highlights (user_id, source_id, page, created_at);

alter table public.research_highlights enable row level security;

create policy "a person reads their own research highlights"
  on public.research_highlights for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research highlights"
  on public.research_highlights for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research highlights"
  on public.research_highlights for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research highlights"
  on public.research_highlights for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_highlights_touch on public.research_highlights;
create trigger research_highlights_touch
  before update on public.research_highlights
  for each row execute function public.touch_updated_at();
