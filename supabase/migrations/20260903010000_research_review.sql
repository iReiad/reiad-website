-- The review room (RESEARCH.md section 13). A review is a row
-- holding the protocol: the question in a frame, the criteria with
-- an id each, the databases, the dates, the languages, and a flag
-- that turns the screening stages off for a narrative review. The
-- records a search returned are NOT sources: they sit here through
-- screening, and one becomes a library source only when it is
-- included, so four thousand screened abstracts stay out of the
-- library. PRISMA is counts of these rows by stage and reason,
-- never typed.

create table if not exists public.research_reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id  uuid references public.research_projects (id) on delete set null,
  title       text not null check (char_length(title) between 1 and 300),
  kind        text not null default 'systematic'
              check (kind in ('systematic','scoping','narrative')),
  -- { frame: 'pico'|'spider'|'plain', question: {...}, criteria:
  --   [{ id, kind: 'include'|'exclude', text }], databases: [],
  --   from, to, languages: [], screeners: [], columns: [] }
  protocol    jsonb not null default '{}'::jsonb,
  state       text not null default 'protocol'
              check (state in ('protocol','searching','screening','extracting','synthesis','done')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_reviews_mine_idx
  on public.research_reviews (user_id, updated_at desc);

alter table public.research_reviews enable row level security;

create policy "a person reads their own research reviews"
  on public.research_reviews for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research reviews"
  on public.research_reviews for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research reviews"
  on public.research_reviews for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research reviews"
  on public.research_reviews for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_reviews_touch on public.research_reviews;
create trigger research_reviews_touch
  before update on public.research_reviews
  for each row execute function public.touch_updated_at();

create table if not exists public.research_review_records (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  review_id   uuid not null references public.research_reviews (id) on delete cascade,
  -- Where it came from: the database, and the search log's row.
  database    text not null default '',
  search_id   uuid,
  -- The raw record as the index returned it, as a hit (CSL and
  -- the columns beside it), so nothing is retyped.
  record      jsonb not null default '{}'::jsonb,
  doi         text,
  hash        text not null default '',
  stage       text not null default 'found'
              check (stage in ('found','deduplicated','title','fulltext','included','excluded')),
  -- A criterion's id from the protocol, for an exclusion.
  reason      text,
  decided_at  timestamptz,
  -- The library source it became, once included.
  source_id   uuid references public.research_sources (id) on delete set null,
  -- Extraction and appraisal, once included: the sheet's row and
  -- the checklist's answers.
  extraction  jsonb not null default '{}'::jsonb,
  appraisal   jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_review_records_mine_idx
  on public.research_review_records (user_id, review_id, stage);

alter table public.research_review_records enable row level security;

create policy "a person reads their own research review records"
  on public.research_review_records for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research review records"
  on public.research_review_records for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research review records"
  on public.research_review_records for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research review records"
  on public.research_review_records for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_review_records_touch on public.research_review_records;
create trigger research_review_records_touch
  before update on public.research_review_records
  for each row execute function public.touch_updated_at();
