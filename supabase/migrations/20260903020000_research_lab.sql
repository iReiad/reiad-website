-- The lab (RESEARCH.md section 14). A dataset is a row naming files
-- in R2 and the dictionary of its columns, and it is ALSO a library
-- source of type dataset so the thesis can cite it: `source_id` is
-- that row. A transform is SQL kept as a row so a dataset's lineage
-- is readable and re-runnable. A run is every result: the kind, the
-- inputs, the code, the hash of the data it read, the output as
-- JSON and the figure as SVG. A table in the thesis that cannot be
-- traced to a run is what this room exists to prevent, so a run is
-- read whole or not at all.

create table if not exists public.research_datasets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id  uuid references public.research_projects (id) on delete set null,
  source_id   uuid references public.research_sources (id) on delete set null,
  name        text not null check (char_length(name) between 1 and 200),
  -- [{ key, ext, size, name }], the file in R2 under the reader's prefix
  files       jsonb not null default '[]'::jsonb,
  -- one row per column: { name, type: number|text|date|boolean,
  --   unit, definition, variable_id }, the variables registry's
  --   own ids in the last field
  dictionary  jsonb not null default '[]'::jsonb,
  -- { kind: 'upload'|'market'|'sheet'|'transform'|'adapter', url,
  --   symbol, date, filters, importer }
  provenance  jsonb not null default '{}'::jsonb,
  licence     text,
  notes       text,
  rows        integer,
  columns     integer,
  -- the hash of the bytes, so a run can say which data it read
  hash        text not null default '',
  -- a raw file in a replication is never edited; a transform writes
  -- a new dataset
  raw         boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_datasets_mine_idx
  on public.research_datasets (user_id, updated_at desc);

alter table public.research_datasets enable row level security;

create policy "a person reads their own research datasets"
  on public.research_datasets for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research datasets"
  on public.research_datasets for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research datasets"
  on public.research_datasets for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research datasets"
  on public.research_datasets for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_datasets_touch on public.research_datasets;
create trigger research_datasets_touch
  before update on public.research_datasets
  for each row execute function public.touch_updated_at();

create table if not exists public.research_transforms (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  dataset_id  uuid not null references public.research_datasets (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 120),
  sql         text not null default '',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_transforms_mine_idx
  on public.research_transforms (user_id, dataset_id, position);

alter table public.research_transforms enable row level security;

create policy "a person reads their own research transforms"
  on public.research_transforms for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research transforms"
  on public.research_transforms for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research transforms"
  on public.research_transforms for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research transforms"
  on public.research_transforms for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_transforms_touch on public.research_transforms;
create trigger research_transforms_touch
  before update on public.research_transforms
  for each row execute function public.touch_updated_at();

create table if not exists public.research_runs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  dataset_id  uuid references public.research_datasets (id) on delete set null,
  project_id  uuid references public.research_projects (id) on delete set null,
  kind        text not null default 'stat'
              check (kind in ('sql','stat','chart','python','check')),
  label       text not null default '',
  -- what was asked: the method, the columns, the options, the range
  input       jsonb not null default '{}'::jsonb,
  code        text not null default '',
  data_hash   text not null default '',
  -- the answer, whole: a fit, a table, a series
  output      jsonb not null default '{}'::jsonb,
  -- the figure, as SVG text, so it is a file
  figure      text,
  ms          integer,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_runs_mine_idx
  on public.research_runs (user_id, created_at desc);

alter table public.research_runs enable row level security;

create policy "a person reads their own research runs"
  on public.research_runs for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research runs"
  on public.research_runs for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research runs"
  on public.research_runs for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research runs"
  on public.research_runs for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_runs_touch on public.research_runs;
create trigger research_runs_touch
  before update on public.research_runs
  for each row execute function public.touch_updated_at();
