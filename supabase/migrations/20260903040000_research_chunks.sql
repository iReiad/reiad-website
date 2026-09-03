-- Semantic search (RESEARCH.md section 21). Every source's abstract
-- and highlights, every note and every document section as chunks
-- with an embedding from Workers AI's multilingual model (bge-m3,
-- 1024 dimensions, which reads Bangla), computed by the Worker when
-- the reader asks and stored by the browser AS THE READER, under the
-- same row-level security as everything else. The nearest chunks
-- come back through an RPC that runs as the caller, so it can only
-- ever see the caller's own rows. "Ask my library" is that search
-- with the assistant reading the top twenty.

create extension if not exists vector with schema extensions;

create table if not exists public.research_chunks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind        text not null check (kind in ('source','note','document','highlight')),
  -- the row the chunk came out of, and which part of it
  ref_id      uuid not null,
  part        integer not null default 0,
  title       text not null default '',
  text        text not null,
  embedding   extensions.vector(1024),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_chunks_mine_idx
  on public.research_chunks (user_id, kind, ref_id);
create index if not exists research_chunks_embedding_idx
  on public.research_chunks using hnsw (embedding extensions.vector_cosine_ops);

alter table public.research_chunks enable row level security;

create policy "a person reads their own research chunks"
  on public.research_chunks for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research chunks"
  on public.research_chunks for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research chunks"
  on public.research_chunks for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research chunks"
  on public.research_chunks for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_chunks_touch on public.research_chunks;
create trigger research_chunks_touch
  before update on public.research_chunks
  for each row execute function public.touch_updated_at();

-- The nearest chunks to a query embedding. SECURITY INVOKER, which
-- is the default and is written out because it is the whole point:
-- the function runs as the caller and row-level security applies,
-- so a reader's search reaches a reader's rows and nobody else's.
create or replace function public.match_research_chunks(query_embedding extensions.vector(1024), match_count integer default 20)
returns table (id uuid, kind text, ref_id uuid, part integer, title text, text text, similarity double precision)
language sql
security invoker
stable
set search_path = public, extensions
as $$
  select c.id, c.kind, c.ref_id, c.part, c.title, c.text,
         1 - (c.embedding <=> query_embedding) as similarity
  from public.research_chunks c
  where c.embedding is not null
  order by c.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 100);
$$;
