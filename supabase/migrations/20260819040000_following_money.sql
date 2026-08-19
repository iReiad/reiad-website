-- ============================================================
-- The money school is `money`, and this constraint still said
-- `learn`.
--
-- WHAT WAS BROKEN. Saving anything on /account.html answered
-- "Could not save that (400)." The settings form sends the whole
-- patch at once, `following` included, and `following` holds
-- school ids: the ids in `next/lib/nav.ts`, which are `money`,
-- `deutsch`, `quran` and `english`. This constraint has allowed
-- `learn` since 15 August and the school stopped being called
-- that on the 17th, when it moved to /money/. PostgREST refuses
-- the row, the whole PATCH fails, and a reader who ticks the
-- biggest school on the site cannot save their name either.
--
-- It ticks by default, too. The form unions what somebody
-- follows with what they have already started, so anyone who has
-- read one money lesson had `money` in the patch whether or not
-- they chose it. Two rows in `profiles`, neither carrying a
-- single preference, is what that looks like from here.
--
-- `learn` is REPLACED rather than joined, and that is safe to
-- check rather than assume: no row holds it. Nothing has been
-- able to write it since the rename, and nothing wrote it before,
-- because the save has been failing the whole time.
--
--   select count(*) from public.profiles where 'learn' = any(following);  -- 0
--
-- THE STORAGE KEYS ARE NOT THIS, and must not be dragged along.
-- Progress is still filed under `learn-read` and `learn-last`, in
-- real browsers and in `public.progress`, and the note at the top
-- of 20260815150000_progress.sql and the rule in CLAUDE.md both
-- say why: renaming a key does not move somebody's ticks, it
-- loses them. This column holds a school ID, which is a different
-- thing that happened to share a spelling.
--
-- And `scripts/check-rows.ts` now holds this list against
-- `LADDER_SCHOOLS`, so the next school to be added or renamed
-- fails a check rather than a reader's Save button.
-- ============================================================

alter table public.profiles
  drop constraint if exists profiles_following_known;

alter table public.profiles
  add constraint profiles_following_known
  check (following <@ array['money', 'deutsch', 'quran', 'english']::text[]);
