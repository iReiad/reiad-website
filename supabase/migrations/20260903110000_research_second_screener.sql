-- A second screener's column on the review room's records
-- (RESEARCH.md section 13). `decision2` is column B, in the SAME
-- vocabulary as `stage`: where screener B would have sent the
-- record. `reason2` is B's criterion id for an exclusion,
-- `decided2_at` when, `screener2` who. Agreement is computed from
-- `stage` against `decision2` per stage in shared/research-review.ts;
-- PRISMA reads `stage` only. Row-level security is the table's own
-- and is unchanged: a column on a reader's row is the reader's.

alter table public.research_review_records
  add column if not exists decision2 text
    check (decision2 in ('found','deduplicated','title','fulltext','included','excluded')),
  add column if not exists reason2 text,
  add column if not exists decided2_at timestamptz,
  add column if not exists screener2 text;
