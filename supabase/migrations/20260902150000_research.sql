-- ============================================================
-- The Research Studio, stage 1: nine tables, all one person's.
--
-- RESEARCH.md is the plan and section 23 is the shape. What
-- matters here is what the SCHEMA enforces rather than what a
-- component can be trusted to: every vocabulary is a CHECK
-- constraint written once in `shared/research.ts` and once here,
-- and `scripts/check-research.ts` fails when the two disagree.
--
-- ---- every table is the reader's own ----
--
-- `user_id` carries `default auth.uid()` so a client that names
-- nobody writes its own row and a client that names somebody
-- else is refused by the insert policy. That is the shape the
-- 20260823124900 migration gave every older table and the reason
-- is written there at length. Row-level security on every one,
-- all four verbs, and `check-rls.ts` reads this file for it.
--
-- ---- and the research desk's threads come across ----
--
-- `public.threads` was the desk under /admin: a question, a
-- note, sources, steps and three link lists in one jsonb. The
-- studio's questions table is the same idea made bigger, so the
-- rows are copied into it here, in the same file that drops the
-- old table, so there is no commit on which both exist and
-- neither is the record. Nothing is lost: the note, the sources,
-- the steps and the links go into `body` under their own keys
-- and the questions room draws them as "carried from the desk".
-- ============================================================

-- ---------- projects ----------

create table if not exists public.research_projects (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 200),
  kind       text not null default 'other'
             check (kind in ('degree','paper','book','application','review','replication','other')),
  state      text not null default 'active'
             check (state in ('active','paused','done','archived')),
  -- One of the seven token names: green, teal, blue, violet,
  -- plum, rose, gold. A name rather than a value, so the same
  -- word is right in both themes.
  tone       text not null default 'gold'
             check (tone in ('green','teal','blue','violet','plum','rose','gold')),
  -- The aims, the institution's rules, the data statement, the
  -- brief the assistant reads. One jsonb, one write.
  body       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_projects_mine_idx
  on public.research_projects (user_id, state, updated_at desc);

alter table public.research_projects enable row level security;

create policy "a person reads their own research projects"
  on public.research_projects for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research projects"
  on public.research_projects for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research projects"
  on public.research_projects for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research projects"
  on public.research_projects for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_projects_touch on public.research_projects;
create trigger research_projects_touch
  before update on public.research_projects
  for each row execute function public.touch_updated_at();

-- ---------- collections: a tree somebody chose ----------

create table if not exists public.research_collections (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  parent_id  uuid references public.research_collections (id) on delete set null,
  name       text not null check (char_length(name) between 1 and 120),
  position   integer not null default 0,
  -- Where a Zotero pull filed it, so a second pull updates
  -- rather than duplicates.
  zotero_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_collections_mine_idx
  on public.research_collections (user_id, parent_id, position);

alter table public.research_collections enable row level security;

create policy "a person reads their own research collections"
  on public.research_collections for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research collections"
  on public.research_collections for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research collections"
  on public.research_collections for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research collections"
  on public.research_collections for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_collections_touch on public.research_collections;
create trigger research_collections_touch
  before update on public.research_collections
  for each row execute function public.touch_updated_at();

-- ---------- sources ----------

create table if not exists public.research_sources (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- The vocabulary in shared/research.ts, SOURCE_TYPES.
  type        text not null default 'article'
              check (type in ('article','preprint','book','chapter','thesis','report',
                'conference','case','statute','standard','fatwa','quran','hadith',
                'dataset','web','interview','software','video','speech','personal')),
  -- Copies of the record, for listing and searching. Filled from
  -- `csl` by fieldsOf() on every write and never edited alone.
  title       text not null,
  year        smallint,
  authors     text not null default '',
  doi         text,
  isbn        text,
  url         text,
  identifiers jsonb not null default '{}'::jsonb,
  -- The citation key, unique per reader, made once.
  key         text not null,
  -- The record itself, CSL-JSON, whole.
  csl         jsonb not null,
  status      text not null default 'unread'
              check (status in ('unread','skimmed','read','annotated','cited')),
  priority    smallint not null default 0 check (priority between 0 and 3),
  rating      smallint check (rating between 0 and 5),
  why         text,
  tags        text[] not null default '{}',
  projects    uuid[] not null default '{}',
  collections uuid[] not null default '{}',
  abstract    text,
  -- [{ key, kind, size, pages, page }], the reading room's, from
  -- stage 2. Empty until then.
  files       jsonb not null default '[]'::jsonb,
  oa          jsonb,
  retracted   jsonb,
  -- Set only when the record came from an index, a database
  -- export, or arrived with a file. RESEARCH.md section 36: a
  -- citation chip on an unverified source is marked.
  verified    boolean not null default false,
  hash        text not null,
  added_via   text not null default 'manual'
              check (added_via in ('doi','isbn','url','search','bibtex','ris','csl',
                'zotero','pdf','manual','review','desk')),
  deleted_at  timestamptz,
  fts         tsvector generated always as (
                to_tsvector('simple',
                  coalesce(title, '') || ' ' || coalesce(abstract, '') || ' '
                  || coalesce(authors, '') || ' ' || coalesce(why, '') || ' '
                  || array_to_string(tags, ' '))) stored,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, key)
);

create index if not exists research_sources_mine_idx
  on public.research_sources (user_id, status, priority desc, updated_at desc);
create index if not exists research_sources_tags_idx
  on public.research_sources using gin (tags);
create index if not exists research_sources_projects_idx
  on public.research_sources using gin (projects);
create index if not exists research_sources_fts_idx
  on public.research_sources using gin (fts);
create index if not exists research_sources_doi_idx
  on public.research_sources (user_id, doi) where doi is not null;
create index if not exists research_sources_hash_idx
  on public.research_sources (user_id, hash);

alter table public.research_sources enable row level security;

create policy "a person reads their own research sources"
  on public.research_sources for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research sources"
  on public.research_sources for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research sources"
  on public.research_sources for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research sources"
  on public.research_sources for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_sources_touch on public.research_sources;
create trigger research_sources_touch
  before update on public.research_sources
  for each row execute function public.touch_updated_at();

-- ---------- notes ----------

create table if not exists public.research_notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind        text not null default 'capture'
              check (kind in ('capture','literature','permanent','daily','meeting','memo',
                'transcript','prompt','assistant')),
  title       text not null default '',
  -- The site's article HTML, through the same sanitiser every
  -- piece goes through, and the plain text beside it for search
  -- and counts.
  body        text not null default '',
  text        text not null default '',
  source_id   uuid references public.research_sources (id) on delete set null,
  projects    uuid[] not null default '{}',
  collections uuid[] not null default '{}',
  tags        text[] not null default '{}',
  -- Outgoing links to notes, sources, questions and people. The
  -- backlinks are a query, never a second column.
  links       uuid[] not null default '{}',
  -- One per day for the daily log.
  day         date,
  -- A transcript's segments, a template's flag, a prompt's
  -- placeholders, an assistant note's model and cost.
  meta        jsonb not null default '{}'::jsonb,
  -- Filed, for a capture. Null means it is in the inbox.
  filed_at    timestamptz,
  deleted_at  timestamptz,
  fts         tsvector generated always as (
                to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(text, '')
                  || ' ' || array_to_string(tags, ' '))) stored,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_notes_mine_idx
  on public.research_notes (user_id, kind, updated_at desc);
create index if not exists research_notes_source_idx
  on public.research_notes (user_id, source_id) where source_id is not null;
create index if not exists research_notes_day_idx
  on public.research_notes (user_id, day) where day is not null;
create index if not exists research_notes_links_idx
  on public.research_notes using gin (links);
create index if not exists research_notes_fts_idx
  on public.research_notes using gin (fts);

alter table public.research_notes enable row level security;

create policy "a person reads their own research notes"
  on public.research_notes for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research notes"
  on public.research_notes for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research notes"
  on public.research_notes for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research notes"
  on public.research_notes for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_notes_touch on public.research_notes;
create trigger research_notes_touch
  before update on public.research_notes
  for each row execute function public.touch_updated_at();

-- ---------- versions ----------

create table if not exists public.research_versions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- 'note' or 'document'; an id rather than a foreign key because
  -- a version outlives the thirty-day bin on purpose.
  kind       text not null check (kind in ('note','document','sheet')),
  item_id    uuid not null,
  body       text not null,
  label      text,
  created_at timestamptz not null default now()
);

create index if not exists research_versions_item_idx
  on public.research_versions (user_id, item_id, created_at desc);

alter table public.research_versions enable row level security;

create policy "a person reads their own research versions"
  on public.research_versions for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research versions"
  on public.research_versions for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research versions"
  on public.research_versions for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research versions"
  on public.research_versions for delete
  using ((select auth.uid()) = user_id);

-- ---------- questions: the desk, made bigger ----------

create table if not exists public.research_questions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id uuid references public.research_projects (id) on delete set null,
  parent_id  uuid references public.research_questions (id) on delete set null,
  kind       text not null default 'question'
             check (kind in ('question','hypothesis','claim','variable')),
  text       text not null check (char_length(text) between 1 and 400),
  state      text not null default 'open' check (state in ('open','parked','answered')),
  tags       text[] not null default '{}',
  position   integer not null default 0,
  -- `note`, `evidence` [{ source_id, stance, page, quote, note }],
  -- and for a variable its `measure`, `source_id` and
  -- `dataset_id`. Plus what the desk carried: `sources`, `steps`
  -- and `links` under their own keys.
  body       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_questions_mine_idx
  on public.research_questions (user_id, state, updated_at desc);
create index if not exists research_questions_tree_idx
  on public.research_questions (user_id, parent_id, position);
create index if not exists research_questions_tags_idx
  on public.research_questions using gin (tags);

alter table public.research_questions enable row level security;

create policy "a person reads their own research questions"
  on public.research_questions for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research questions"
  on public.research_questions for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research questions"
  on public.research_questions for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research questions"
  on public.research_questions for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_questions_touch on public.research_questions;
create trigger research_questions_touch
  before update on public.research_questions
  for each row execute function public.touch_updated_at();

-- ---------- tasks ----------

create table if not exists public.research_tasks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id uuid references public.research_projects (id) on delete set null,
  title      text not null check (char_length(title) between 1 and 300),
  lane       text not null default 'week'
             check (lane in ('later','week','today','waiting','done')),
  position   integer not null default 0,
  -- A date and a fact, never a colour.
  due        date,
  done_at    timestamptz,
  -- When it entered `waiting`, so the oldest wait is visible.
  waiting_since timestamptz,
  -- [{ kind, id, title }]: what the task is about.
  links      jsonb not null default '[]'::jsonb,
  note       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_tasks_mine_idx
  on public.research_tasks (user_id, lane, position);

alter table public.research_tasks enable row level security;

create policy "a person reads their own research tasks"
  on public.research_tasks for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research tasks"
  on public.research_tasks for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research tasks"
  on public.research_tasks for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research tasks"
  on public.research_tasks for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_tasks_touch on public.research_tasks;
create trigger research_tasks_touch
  before update on public.research_tasks
  for each row execute function public.touch_updated_at();

-- ---------- reading lists ----------

create table if not exists public.research_lists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id uuid references public.research_projects (id) on delete set null,
  name       text not null check (char_length(name) between 1 and 200),
  -- [{ source_id, title, note, state }], state in
  -- 'to-find' | 'saved' | 'not-found'. A title with no source_id
  -- is a paper still to be found, which is the whole point of a
  -- list: it holds what is not in the library yet.
  items      jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_lists_mine_idx
  on public.research_lists (user_id, updated_at desc);

alter table public.research_lists enable row level security;

create policy "a person reads their own research lists"
  on public.research_lists for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research lists"
  on public.research_lists for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research lists"
  on public.research_lists for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research lists"
  on public.research_lists for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_lists_touch on public.research_lists;
create trigger research_lists_touch
  before update on public.research_lists
  for each row execute function public.touch_updated_at();

-- ---------- activity: every write, as one line ----------

create table if not exists public.research_activity (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind       text not null,
  item_id    uuid,
  action     text not null check (action in ('added','changed','removed','restored','imported')),
  summary    text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists research_activity_mine_idx
  on public.research_activity (user_id, created_at desc);

alter table public.research_activity enable row level security;

create policy "a person reads their own research activity"
  on public.research_activity for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research activity"
  on public.research_activity for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research activity"
  on public.research_activity for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research activity"
  on public.research_activity for delete
  using ((select auth.uid()) = user_id);

-- ---------- one column on profiles ----------

-- Facts about a person rather than about a project: the name on
-- exports, the default style, the dense mode, the assistant
-- switch. Prefixed for the reason the routine's columns are.
alter table public.profiles
  add column if not exists research_prefs jsonb not null default '{}'::jsonb;

-- ---------- the desk comes across, and goes ----------

insert into public.research_questions
  (user_id, kind, text, state, tags, body, created_at, updated_at)
select
  user_id, 'question', question, state, tags,
  jsonb_build_object(
    'note', coalesce(body->>'note', ''),
    'evidence', '[]'::jsonb,
    'carried', jsonb_build_object(
      'sources', coalesce(body->'sources', '[]'::jsonb),
      'steps', coalesce(body->'next', '[]'::jsonb),
      'links', coalesce(body->'links', '{}'::jsonb))),
  created_at, updated_at
from public.threads;

drop table public.threads;
