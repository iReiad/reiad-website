-- Five columns that should have carried `default auth.uid()` and
-- did not, and a day of somebody's routine that went nowhere
-- because of it.
--
-- ---- what happened ----
--
-- The Android app writes these tables with the reader's own
-- token and deliberately never names whose row it is writing.
-- That is the right design and it is what `progress`, `library`,
-- `scenarios`, `targets` and `admins` already allow: their
-- `user_id` carries `default auth.uid()`, so the column fills
-- itself in from the JWT and a client cannot get it wrong or be
-- talked into getting it wrong.
--
-- `routines`, `routine_entries`, `diet_days`, `diet_entries` and
-- `diet_profile` were written later and were given
-- `uuid not null` with NO default. The browser did not notice,
-- because `aab/src/routine.ts` sends `user_id: who.id` in the
-- body. The app does not, so every insert it made was a null in
-- a not-null column: a 400 back from PostgREST, a `false` the
-- caller dropped, and a whole day of marks that looked saved and
-- was never anywhere.
--
-- The comment "user_id is filled in by the column default" is
-- written in four places in that app. It was true where it was
-- first written and false where it was copied to, which is this
-- project's own opening failure happening to a column.
--
-- ---- what this changes, and what it does not ----
--
-- ONLY the default. Every one of these stays `not null`, every
-- row-level policy is untouched, and the insert policies are
-- still `with check (user_id = auth.uid())`, so a client naming
-- somebody else's id is refused exactly as before. The site goes
-- on naming the id explicitly and that keeps working: an
-- explicit value overrides a default.
--
-- What it buys is that a client which names nothing writes its
-- OWN row rather than failing, which is both the safer shape and
-- the one every other table here already has.

alter table public.routines        alter column user_id set default auth.uid();
alter table public.routine_entries alter column user_id set default auth.uid();
alter table public.diet_days       alter column user_id set default auth.uid();
alter table public.diet_entries    alter column user_id set default auth.uid();
alter table public.diet_profile    alter column user_id set default auth.uid();

-- And the four the check found that the report did not.
--
-- `check-rls.ts` grew a question the day this was written: is
-- there a `user_id` that is `not null` with no default? The
-- routine and the three tables above were what the report was
-- about; these four came back with it, and they are the same
-- shape waiting for the first client that writes them. Two of
-- them nothing writes yet, which is exactly when this is cheap to
-- fix.
--
-- `admins` is the one that stays as it is, and it is in that
-- check's `NO_DEFAULT_ON_PURPOSE` with the reason: admin is
-- granted only in SQL, the table has no write policy at all, and
-- a default naming `auth.uid()` would suggest a client could
-- insert into it.

alter table public.diet_foods  alter column user_id set default auth.uid();
alter table public.diet_phases alter column user_id set default auth.uid();
alter table public.diet_labs   alter column user_id set default auth.uid();
