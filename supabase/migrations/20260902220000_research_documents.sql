-- The writing desk (RESEARCH.md section 16): a document is a row.
-- The body is the site's article HTML with citation chips in it;
-- the plain text beside it is for search and counts; the outline
-- is what the body's headings are, kept as JSON so a budget can
-- sit on each. A thesis is a project's documents of kind chapter
-- in order; a paper is one document. Versions are section 12's
-- table with kind 'document', and a named one is a snapshot.

create table if not exists public.research_documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id  uuid references public.research_projects (id) on delete set null,
  kind        text not null default 'paper'
              check (kind in ('chapter','paper','proposal','abstract','letter','other')),
  position    integer not null default 0,
  title       text not null default '',
  outline     jsonb not null default '[]'::jsonb,
  body        text not null default '',
  text        text not null default '',
  budget      integer,
  style       text not null default 'apa',
  state       text not null default 'outline'
              check (state in ('outline','drafting','revising','done')),
  -- The reader's name and affiliation and the like, per document,
  -- where they differ from Settings.
  meta        jsonb not null default '{}'::jsonb,
  deleted_at  timestamptz,
  fts         tsvector generated always as (
                to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(text, ''))) stored,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_documents_mine_idx
  on public.research_documents (user_id, project_id, position, updated_at desc);
create index if not exists research_documents_fts_idx
  on public.research_documents using gin (fts);

alter table public.research_documents enable row level security;

create policy "a person reads their own research documents"
  on public.research_documents for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research documents"
  on public.research_documents for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research documents"
  on public.research_documents for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research documents"
  on public.research_documents for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_documents_touch on public.research_documents;
create trigger research_documents_touch
  before update on public.research_documents
  for each row execute function public.touch_updated_at();
