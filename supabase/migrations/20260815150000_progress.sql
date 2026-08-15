-- ============================================================
-- Progress, so a person is one learner rather than one per
-- browser.
--
-- The site has kept progress in localStorage since the first
-- school, and still does: this table is a copy that follows the
-- account, not a replacement. Signed out, nothing here is touched
-- and nothing is sent anywhere. That is deliberate and it is the
-- rule in TRANSITION.md: no feature on this site requires an
-- account.
--
-- One row per key per person. The keys are the same localStorage
-- keys the four schools already write, which is what lets this
-- exist without editing any of them:
--
--   learn-read     ["share", "basics-2/sectors", …]   what you read
--   learn-last     { id, url, ts }                    where you were
--   deutsch-read   deutsch-days  deutsch-last  deutsch-tag
--   english-read   english-days  english-last  english-day
--   quran-done     quran-last
--
-- TRANSITION.md, Stage 6.
-- ============================================================

create table if not exists public.progress (
  -- Defaulted rather than sent by the client: the browser never
  -- names whose row it is writing, so it cannot get it wrong and
  -- cannot be talked into getting it wrong.
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  key        text not null check (char_length(key) between 1 and 60),
  value      jsonb not null default 'null'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.progress enable row level security;

-- Nobody reads anybody else's. Unlike profiles, none of this is
-- ever shown beside a comment or anywhere else public: what you
-- have read is your business.
drop policy if exists "read your own progress" on public.progress;
create policy "read your own progress"
  on public.progress for select
  using ((select auth.uid()) = user_id);

drop policy if exists "add your own progress" on public.progress;
create policy "add your own progress"
  on public.progress for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "change your own progress" on public.progress;
create policy "change your own progress"
  on public.progress for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Deleting is how "forget my progress" works, so it needs a policy
-- of its own. Still only your own rows.
drop policy if exists "forget your own progress" on public.progress;
create policy "forget your own progress"
  on public.progress for delete
  using ((select auth.uid()) = user_id);

-- touch_updated_at() came with the profiles migration.
drop trigger if exists progress_touch_updated_at on public.progress;
create trigger progress_touch_updated_at
  before update on public.progress
  for each row execute function public.touch_updated_at();
