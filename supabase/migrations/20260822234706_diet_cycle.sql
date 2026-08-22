-- ============================================================
-- The two fields the cycle reading needs, and no more than two.
--
-- `DIET.md` section 18. Water retention in the luteal phase is
-- commonly half a kilo to two kilos, so the net effect on the
-- scale is an apparent stall in the second half of every cycle
-- followed by a drop that looks like a whoosh and is not. That
-- makes a large fraction of women quit on a schedule, and it is
-- invisible in every tracker that treats a month as four
-- identical weeks.
--
-- `cycle_tracking` has been on this table since it was created
-- and has never had anything to track WITH: a boolean saying
-- "yes, read my cycle" with no date to read it from. These are
-- that date and the length it repeats on.
--
-- ONE DATE, NOT A DIARY. The tool asks once and never again, and
-- it stores a start and a length rather than a log of periods,
-- because everything it does with this is arithmetic on a
-- repeating interval. A calendar of somebody's periods is not
-- something this site needs in order to read a weight chart, and
-- not collecting it is the only way to be sure it cannot leak.
--
-- Both are nullable and both are behind `cycle_tracking`, which
-- is off by default. `diet_profile` is already covered by the
-- four row level security policies below it, so these columns
-- are as private as `meds` on the same row.
-- ============================================================

alter table public.diet_profile
  add column if not exists cycle_start date;

alter table public.diet_profile
  add column if not exists cycle_days smallint;

-- A cycle shorter than three weeks or longer than five is
-- outside what this arithmetic can say anything useful about,
-- and a number outside it is far more likely to be a typo than a
-- body. The tool declines rather than drawing a phase that is
-- not there.
alter table public.diet_profile
  drop constraint if exists diet_profile_cycle_sane;
alter table public.diet_profile
  add constraint diet_profile_cycle_sane
  check (cycle_days is null or (cycle_days >= 21 and cycle_days <= 35));
