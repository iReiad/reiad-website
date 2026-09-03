-- The field room (RESEARCH.md section 15). Participants are
-- pseudonyms: everything else in the room refers to the pseudonym,
-- and a real name, if kept at all, is `sealed`, encrypted IN THE
-- BROWSER under a passphrase the site never sees, so a leaked
-- database is a list of pseudonyms. An interview is a source of
-- type interview and its transcript a note of kind transcript, both
-- tables already here; a code is a row of the codebook tree with
-- its definition written when it is made; a coding is a code on a
-- span of a transcript segment; a survey is questions as JSON with
-- a public token, and its answers live in D1 because the Worker
-- cannot write here as nobody.

create table if not exists public.research_participants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id  uuid references public.research_projects (id) on delete set null,
  pseudonym   text not null check (char_length(pseudonym) between 1 and 80),
  role        text not null default '',
  -- { status: 'pending'|'given'|'withdrawn', date, file_key, scope,
  --   quotes: boolean, withdrawn }
  consent     jsonb not null default '{}'::jsonb,
  -- name and contact, AES-GCM under the reader's passphrase, made
  -- and opened in the browser only
  sealed      text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_participants_mine_idx
  on public.research_participants (user_id, pseudonym);

alter table public.research_participants enable row level security;

create policy "a person reads their own research participants"
  on public.research_participants for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research participants"
  on public.research_participants for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research participants"
  on public.research_participants for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research participants"
  on public.research_participants for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_participants_touch on public.research_participants;
create trigger research_participants_touch
  before update on public.research_participants
  for each row execute function public.touch_updated_at();

create table if not exists public.research_codes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id  uuid references public.research_projects (id) on delete set null,
  parent_id   uuid references public.research_codes (id) on delete set null,
  name        text not null check (char_length(name) between 1 and 120),
  definition  text not null default '',
  colour      text not null default 'green'
              check (colour in ('green','teal','blue','violet','plum','rose','gold')),
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_codes_mine_idx
  on public.research_codes (user_id, project_id, position);

alter table public.research_codes enable row level security;

create policy "a person reads their own research codes"
  on public.research_codes for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research codes"
  on public.research_codes for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research codes"
  on public.research_codes for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research codes"
  on public.research_codes for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_codes_touch on public.research_codes;
create trigger research_codes_touch
  before update on public.research_codes
  for each row execute function public.touch_updated_at();

create table if not exists public.research_codings (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  code_id         uuid not null references public.research_codes (id) on delete cascade,
  -- the transcript, and the interview and participant it is of,
  -- copied here so retrieval and the matrices are one read
  note_id         uuid not null references public.research_notes (id) on delete cascade,
  source_id       uuid references public.research_sources (id) on delete set null,
  participant_id  uuid references public.research_participants (id) on delete set null,
  segment         integer not null default 0,
  start_at        integer not null default 0,
  end_at          integer not null default 0,
  text            text not null default '',
  translation     text,
  memo            text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists research_codings_mine_idx
  on public.research_codings (user_id, code_id);
create index if not exists research_codings_note_idx
  on public.research_codings (user_id, note_id, segment);

alter table public.research_codings enable row level security;

create policy "a person reads their own research codings"
  on public.research_codings for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research codings"
  on public.research_codings for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research codings"
  on public.research_codings for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research codings"
  on public.research_codings for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_codings_touch on public.research_codings;
create trigger research_codings_touch
  before update on public.research_codings
  for each row execute function public.touch_updated_at();

create table if not exists public.research_surveys (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id  uuid references public.research_projects (id) on delete set null,
  title       text not null check (char_length(title) between 1 and 200),
  -- [{ id, type: 'likert'|'choice'|'multi'|'text'|'number', en, bn,
  --   options: [{ en, bn }], required }], with a consent gate the
  --   form page always draws first
  questions   jsonb not null default '[]'::jsonb,
  intro       text not null default '',
  token       text not null unique,
  open        boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists research_surveys_mine_idx
  on public.research_surveys (user_id, updated_at desc);

alter table public.research_surveys enable row level security;

create policy "a person reads their own research surveys"
  on public.research_surveys for select
  using ((select auth.uid()) = user_id);
create policy "a person adds their own research surveys"
  on public.research_surveys for insert
  with check ((select auth.uid()) = user_id);
create policy "a person changes their own research surveys"
  on public.research_surveys for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "a person deletes their own research surveys"
  on public.research_surveys for delete
  using ((select auth.uid()) = user_id);

drop trigger if exists research_surveys_touch on public.research_surveys;
create trigger research_surveys_touch
  before update on public.research_surveys
  for each row execute function public.touch_updated_at();
