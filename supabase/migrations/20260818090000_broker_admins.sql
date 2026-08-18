-- ============================================================
-- The live portfolio's two tables: a sealed broker key per
-- person, and who may run the public side of the dashboard.
--
--   broker_tokens   one row per person, holding their Trading 212
--                   API key SEALED by the site's Worker (AES-GCM
--                   under a wrangler secret) before the row is
--                   ever written. The browser can read its own
--                   row back and learns nothing: the label, the
--                   environment, and ciphertext only this
--                   site's Worker can open. The Worker reads and
--                   writes the row AS THE READER, forwarding
--                   their bearer token, because this project
--                   holds no service-role key anywhere and this
--                   table is not a reason to start.
--
--   admins          who the site trusts with the admin half of
--                   /api/broker: the unsanitised site portfolio,
--                   the public view's settings, the site key.
--                   Granted HERE, in SQL, never through the API:
--                   there is no insert, update or delete policy
--                   on purpose, so no combination of tokens can
--                   mint an admin. The select policy shows a
--                   reader their own row and nobody else's,
--                   which is exactly the one question the Worker
--                   asks with a reader's own bearer: am I one?
--
-- Why a table and not a role column on profiles: profiles is
-- world-readable by design and self-writable by design, and a
-- role a person can read on anyone and write on themselves is
-- not a role. A separate table with no write policies is.
--
-- CLAUDE.md, "The live portfolio", 18 August 2026.
-- ============================================================

-- ---------- sealed broker keys ----------

create table if not exists public.broker_tokens (
  -- One broker key per person is the shape today, so the person
  -- IS the key. Defaulted rather than sent, exactly as progress
  -- and scenarios do it: the writer never names whose row it is.
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  broker     text not null default 'trading212' check (broker in ('trading212')),
  -- AES-GCM ciphertext, base64, IV in front. Sealed and unsealed
  -- only by functions/_lib/broker.js. If this column ever holds
  -- something a human can read, that is the bug.
  cipher     text not null check (char_length(cipher) between 20 and 2000),
  label      text not null default '' check (char_length(label) <= 40),
  -- Trading 212's paper account answers the same API at a
  -- different host, and somebody learning deserves to point the
  -- dashboard at it.
  env        text not null default 'live' check (env in ('live', 'demo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.broker_tokens enable row level security;

drop policy if exists "read your own broker key" on public.broker_tokens;
create policy "read your own broker key"
  on public.broker_tokens for select
  using ((select auth.uid()) = user_id);

drop policy if exists "add your own broker key" on public.broker_tokens;
create policy "add your own broker key"
  on public.broker_tokens for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "change your own broker key" on public.broker_tokens;
create policy "change your own broker key"
  on public.broker_tokens for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "delete your own broker key" on public.broker_tokens;
create policy "delete your own broker key"
  on public.broker_tokens for delete
  using ((select auth.uid()) = user_id);

-- touch_updated_at() came with the profiles migration.
drop trigger if exists broker_tokens_touch_updated_at on public.broker_tokens;
create trigger broker_tokens_touch_updated_at
  before update on public.broker_tokens
  for each row execute function public.touch_updated_at();

-- No cap_rows trigger: the primary key already caps this table
-- at one row per person.

-- ---------- admins ----------

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  note       text not null default '',
  granted_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "see your own admin row" on public.admins;
create policy "see your own admin row"
  on public.admins for select
  using ((select auth.uid()) = user_id);

-- Deliberately no insert, update or delete policy. Rows in this
-- table are written the way this one is, by a migration or by
-- somebody at the SQL editor, and never by anything holding a
-- browser's kind of token.

-- The site's owner. Guarded, so the migration also applies
-- cleanly to a fresh project where this account does not exist
-- yet; run the insert again once it does.
insert into public.admins (user_id, note)
select id, 'site owner'
  from auth.users
 where id = 'f8278696-caa3-4321-938c-ead22d86d144'
on conflict (user_id) do nothing;
