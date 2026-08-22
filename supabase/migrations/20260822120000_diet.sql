-- ============================================================
-- The diet tool: six tables, all private to one person.
--
-- DIET.md is the plan and the reasoning. What matters here is
-- what the SCHEMA has to enforce, as opposed to what a component
-- can be trusted to.
--
-- ---- the floors are in the database as well as in the code ----
--
-- `shared/diet.ts` will not compute a target below resting burn
-- or below 1200 and 1500, and that is where the real work
-- happens. The ceiling on `goal_rate` is here as well because it
-- is the one number a person could otherwise put a wild value in
-- and have every downstream figure inherit it. A rate above 1% a
-- week is refused by a constraint, not by a component, and the
-- reason is medical rather than motivational: loss faster than
-- about 1.5kg a week measurably raises the risk of gallstones,
-- and the people most likely to try it are already the people
-- most at risk.
--
-- ---- why the names carry a prefix ----
--
-- This database already holds `progress`, `library`, `targets`,
-- `scenarios` and the routine's four. A bare `entries`, `foods`
-- or `days` is a name the next feature will want, and the day
-- two features want one name is the day one of them loses.
--
-- ---- and why there is no local mirror ----
--
-- `progress` has one because four schools have read localStorage
-- since before there were accounts, and a reader with no account
-- still gets all of it. Nothing here has that history and nothing
-- here works signed out, so a second copy would be a second
-- record to keep in step for nobody's benefit. `scenarios` and
-- `targets` already made this call, and the routine's entries
-- made it again.
--
-- What the browser DOES hold is a queue of writes that have not
-- gone yet, which is a request rather than a record: it is never
-- read back as data and it is gone the moment the write lands.
-- DIET.md section 25 is why that distinction matters.
--
-- ---- the two most sensitive columns in this database ----
--
-- `diet_profile.meds` and `diet_profile.cycle_tracking` are
-- facts about somebody's health that nothing else here holds.
-- They are optional, the whole tool works without either, they
-- carry the same row level security as everything else, and they
-- go into the account's export like every other column, because
-- a person leaving takes all of it.
-- ============================================================

-- ---------- one row per person ----------
create table if not exists public.diet_profile (
  user_id       uuid primary key references auth.users (id) on delete cascade,

  -- Stored because Mifflin-St Jeor and the Navy tape method both
  -- need it and there is no honest way around that. Asked for as
  -- "which formula should this use", with both answers explained,
  -- and used for nothing else.
  sex           text,
  birth_year    smallint,
  height_cm     numeric(5,1),

  -- WHERE somebody eats, which picks the portion library, the
  -- currency and the food search's ranking.
  place         text not null default 'uk',
  -- WHICH BMI CUT-OFFS APPLY, which is a different question and
  -- deliberately a separate column. The WHO's 2004 consultation
  -- recommends lower action points for Asian populations, and a
  -- Bangladeshi reader in Manchester needs the lower set while
  -- `place` would give them the higher one. Defaulting this from
  -- `place` would be the bug this column exists to prevent.
  ancestry      text not null default 'general',
  units         text not null default 'metric',

  activity      text not null default 'sedentary',
  goal_kind     text not null default 'maintain',
  -- Percent of bodyweight per week, because half a kilo a week
  -- is gentle at 110kg and severe at 55kg.
  goal_rate     numeric(4,2) not null default 0.5,
  goal_waist_cm numeric(5,1),
  goal_weight_kg numeric(5,1),
  -- Maintenance is a BAND rather than a number, and the tool
  -- says nothing at all while the trend is inside it.
  band_low_kg   numeric(5,1),
  band_high_kg  numeric(5,1),

  cycle_tracking boolean not null default false,
  meds          text[] not null default '{}',

  food_budget     numeric(10,2),
  budget_currency text,

  -- The household's oil bottle, which is routinely the largest
  -- unlogged item in a week of home cooking. Calibrated per
  -- household rather than per dish, because oil is poured.
  oil_ml_week   integer,
  oil_people    smallint,
  oil_meals     smallint,

  -- Which widgets, in what order. A keto reader wants ketones at
  -- the top and a maintaining reader wants the trend and almost
  -- nothing else.
  board         jsonb not null default '[]',

  onboarded_at  timestamptz,
  updated_at    timestamptz not null default now()
);

alter table public.diet_profile
  drop constraint if exists diet_profile_sex_known;
alter table public.diet_profile
  add constraint diet_profile_sex_known
  check (sex is null or sex in ('male', 'female'));

alter table public.diet_profile
  drop constraint if exists diet_profile_place_known;
alter table public.diet_profile
  add constraint diet_profile_place_known check (place in ('bd', 'uk'));

alter table public.diet_profile
  drop constraint if exists diet_profile_ancestry_known;
alter table public.diet_profile
  add constraint diet_profile_ancestry_known
  check (ancestry in ('general', 'asian'));

alter table public.diet_profile
  drop constraint if exists diet_profile_units_known;
alter table public.diet_profile
  add constraint diet_profile_units_known check (units in ('metric', 'imperial'));

alter table public.diet_profile
  drop constraint if exists diet_profile_goal_known;
alter table public.diet_profile
  add constraint diet_profile_goal_known
  check (goal_kind in ('lose', 'maintain', 'gain'));

-- THE CEILING, IN THE DATABASE. A rate above 1% of bodyweight a
-- week is not offered, and a gain above 0.5% adds fat faster than
-- any body adds muscle, whatever the training.
alter table public.diet_profile
  drop constraint if exists diet_profile_rate_sane;
alter table public.diet_profile
  add constraint diet_profile_rate_sane
  check (goal_rate >= 0
         and goal_rate <= 1.0
         and (goal_kind <> 'gain' or goal_rate <= 0.5));

alter table public.diet_profile
  drop constraint if exists diet_profile_body_sane;
alter table public.diet_profile
  add constraint diet_profile_body_sane
  check ((height_cm is null or height_cm between 50 and 250)
         and (birth_year is null or birth_year between 1900 and 2100));

alter table public.diet_profile
  drop constraint if exists diet_profile_band_ordered;
alter table public.diet_profile
  add constraint diet_profile_band_ordered
  check (band_low_kg is null or band_high_kg is null or band_low_kg <= band_high_kg);

alter table public.diet_profile enable row level security;

drop policy if exists "a person reads their own diet profile" on public.diet_profile;
create policy "a person reads their own diet profile"
  on public.diet_profile for select using (user_id = (select auth.uid()));

drop policy if exists "a person writes their own diet profile" on public.diet_profile;
create policy "a person writes their own diet profile"
  on public.diet_profile for insert with check (user_id = (select auth.uid()));

drop policy if exists "a person edits their own diet profile" on public.diet_profile;
create policy "a person edits their own diet profile"
  on public.diet_profile for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "a person deletes their own diet profile" on public.diet_profile;
create policy "a person deletes their own diet profile"
  on public.diet_profile for delete using (user_id = (select auth.uid()));

-- ---------- one row per person per day ----------
-- The tape lives here rather than in a table of its own. It is
-- taken weekly rather than daily, so most of these columns are
-- null on most rows, and that is the right trade: a measurement
-- IS a fact about a day, the unique key already exists, and a
-- seventh table would need the same key, the same policies and
-- the same date arithmetic to say so.
create table if not exists public.diet_days (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  entry_date  date not null,

  weight_kg   numeric(5,2),
  kcal        integer,
  protein_g   numeric(6,1),
  carbs_g     numeric(6,1),
  fat_g       numeric(6,1),
  fibre_g     numeric(6,1),
  sodium_mg   integer,

  ketones_mmol numeric(4,2),
  steps        integer,
  sleep_hours  numeric(4,2),
  water_ml     integer,
  -- One to five. The only LEADING indicator in the whole tool: a
  -- hunger score climbing for three weeks says a target is too
  -- aggressive before the trend does and before adherence breaks.
  hunger       smallint,

  waist_cm    numeric(5,1),
  hip_cm      numeric(5,1),
  neck_cm     numeric(5,1),
  chest_cm    numeric(5,1),
  thigh_cm    numeric(5,1),
  arm_cm      numeric(5,1),

  -- 'ill', 'travel', 'refeed', 'off-protocol'. A marked day is
  -- drawn and excluded from the slope: a fever puts water on and
  -- a week of it produces trend data that means nothing. There is
  -- no penalty and no catch-up target the following week.
  marks       text[] not null default '{}',
  -- The fixed journal set. Fixed because free text cannot be
  -- counted, and short because a list of forty tags is a list
  -- nobody uses.
  tags        text[] not null default '{}',
  note        text,
  -- 'logged', or 'import:<what>', so an imported year and a
  -- logged year can be told apart and a bad import is undone as
  -- one operation rather than three hundred.
  origin      text not null default 'logged',

  updated_at  timestamptz not null default now(),
  unique (user_id, entry_date)
);

alter table public.diet_days
  drop constraint if exists diet_days_hunger_scale;
alter table public.diet_days
  add constraint diet_days_hunger_scale
  check (hunger is null or hunger between 1 and 5);

alter table public.diet_days
  drop constraint if exists diet_days_numbers_sane;
alter table public.diet_days
  add constraint diet_days_numbers_sane
  check ((weight_kg is null or weight_kg between 20 and 400)
         and (kcal is null or kcal between 0 and 20000)
         and (ketones_mmol is null or ketones_mmol between 0 and 20)
         and (steps is null or steps between 0 and 200000)
         and (sleep_hours is null or sleep_hours between 0 and 24)
         and (water_ml is null or water_ml between 0 and 20000));

-- Newest first, because every read here is "the last n days".
create index if not exists diet_days_user_date_idx
  on public.diet_days (user_id, entry_date desc);

alter table public.diet_days enable row level security;

drop policy if exists "a person reads their own diet days" on public.diet_days;
create policy "a person reads their own diet days"
  on public.diet_days for select using (user_id = (select auth.uid()));

drop policy if exists "a person writes their own diet days" on public.diet_days;
create policy "a person writes their own diet days"
  on public.diet_days for insert with check (user_id = (select auth.uid()));

drop policy if exists "a person edits their own diet days" on public.diet_days;
create policy "a person edits their own diet days"
  on public.diet_days for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "a person deletes their own diet days" on public.diet_days;
create policy "a person deletes their own diet days"
  on public.diet_days for delete using (user_id = (select auth.uid()));

-- ---------- one row per food logged, and per food planned ----------
-- A PLANNED MEAL IS NOT A SEVENTH TABLE. It is a row with a
-- future date and `planned` set, which means the week's plan, the
-- shopping list and the planned-against-eaten reading all come
-- out of rows that already exist, and a plan becomes a log by
-- clearing one flag.
create table if not exists public.diet_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  entry_date  date not null,
  meal        text,
  at_time     time,

  label       text not null,
  label_bn    text,
  qty         numeric(9,2),
  unit        text,
  kcal        numeric(8,1),
  macros      jsonb not null default '{}',
  micros      jsonb not null default '{}',

  -- A restaurant plate is not knowable. A plate of kacchi biryani
  -- is somewhere between 700 and 1100, and anybody who says 863
  -- is reading a number invented by a website. The midpoint goes
  -- into the total and the width goes into the day's confidence.
  est_low     numeric(8,1),
  est_high    numeric(8,1),

  planned     boolean not null default false,

  -- WHERE THE NUMBER CAME FROM, on every row. A reader has to be
  -- able to tell a figure this site checked from one a stranger
  -- typed into a public database from one out of a government
  -- laboratory, and almost no app shows this.
  source      text not null default 'free',
  -- What it was copied FROM. The numbers above are a snapshot,
  -- not a reference: the log must not depend on a third party
  -- still being there next year, and a history that changed
  -- because somebody edited a public entry would be worse than
  -- one that went missing, because nothing would announce it.
  source_id   text,
  fetched_on  date,
  origin      text not null default 'logged',
  created_at  timestamptz not null default now()
);

alter table public.diet_entries
  drop constraint if exists diet_entries_source_known;
alter table public.diet_entries
  add constraint diet_entries_source_known
  check (source in ('library', 'own', 'off', 'fdc', 'label', 'free', 'recipe', 'pot'));

alter table public.diet_entries
  drop constraint if exists diet_entries_range_ordered;
alter table public.diet_entries
  add constraint diet_entries_range_ordered
  check (est_low is null or est_high is null or est_low <= est_high);

create index if not exists diet_entries_user_date_idx
  on public.diet_entries (user_id, entry_date desc);

alter table public.diet_entries enable row level security;

drop policy if exists "a person reads their own diet entries" on public.diet_entries;
create policy "a person reads their own diet entries"
  on public.diet_entries for select using (user_id = (select auth.uid()));

drop policy if exists "a person writes their own diet entries" on public.diet_entries;
create policy "a person writes their own diet entries"
  on public.diet_entries for insert with check (user_id = (select auth.uid()));

drop policy if exists "a person edits their own diet entries" on public.diet_entries;
create policy "a person edits their own diet entries"
  on public.diet_entries for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "a person deletes their own diet entries" on public.diet_entries;
create policy "a person deletes their own diet entries"
  on public.diet_entries for delete using (user_id = (select auth.uid()));

-- ---------- the reader's own items, pots, recipes and meals ----------
create table if not exists public.diet_foods (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  label       text not null,
  label_bn    text,
  qty         numeric(9,2),
  unit        text,
  kcal        numeric(8,1),
  macros      jsonb not null default '{}',
  micros      jsonb not null default '{}',

  -- A price is a fact with a date on it. An undated price is
  -- worse than none, so out of date by more than a few months and
  -- the figure is shown greyed with its date rather than silently.
  price       numeric(10,2),
  currency    text,
  priced_on   date,

  -- A pot is a dish cooked for a household and taken as a share.
  -- A recipe is a pot with a yield on it, so a portion is a
  -- fraction forever after. A meal is several items under one
  -- name: "my breakfast" is one tap for four things.
  kind        text not null default 'item',
  parts       jsonb,
  serves      numeric(6,2),

  -- What makes something one of "your usuals": logged three
  -- times, worked out rather than asked for.
  uses        integer not null default 0,
  last_used   date,

  source      text,
  source_id   text,
  fetched_on  date,
  updated_at  timestamptz not null default now()
);

alter table public.diet_foods
  drop constraint if exists diet_foods_kind_known;
alter table public.diet_foods
  add constraint diet_foods_kind_known
  check (kind in ('item', 'pot', 'recipe', 'meal'));

-- A recipe without a yield cannot produce a portion, which is
-- the whole of what a recipe is for.
alter table public.diet_foods
  drop constraint if exists diet_foods_recipe_has_yield;
alter table public.diet_foods
  add constraint diet_foods_recipe_has_yield
  check (kind <> 'recipe' or (serves is not null and serves > 0));

alter table public.diet_foods
  drop constraint if exists diet_foods_priced_with_a_date;
alter table public.diet_foods
  add constraint diet_foods_priced_with_a_date
  check (price is null or (priced_on is not null and currency is not null));

create index if not exists diet_foods_user_used_idx
  on public.diet_foods (user_id, last_used desc);

alter table public.diet_foods enable row level security;

drop policy if exists "a person reads their own diet foods" on public.diet_foods;
create policy "a person reads their own diet foods"
  on public.diet_foods for select using (user_id = (select auth.uid()));

drop policy if exists "a person writes their own diet foods" on public.diet_foods;
create policy "a person writes their own diet foods"
  on public.diet_foods for insert with check (user_id = (select auth.uid()));

drop policy if exists "a person edits their own diet foods" on public.diet_foods;
create policy "a person edits their own diet foods"
  on public.diet_foods for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "a person deletes their own diet foods" on public.diet_foods;
create policy "a person deletes their own diet foods"
  on public.diet_foods for delete using (user_id = (select auth.uid()));

-- ---------- what protocol was running, and when ----------
-- A span rather than a column on the profile, because the whole
-- point is the history: the first fourteen days of a keto phase
-- are excluded from the trend's slope, and answering "was this
-- day inside an adaptation window" needs the phase that was
-- running THEN rather than the one running now.
create table if not exists public.diet_phases (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  started_on  date not null,
  ended_on    date,
  style       text not null,
  note        text,
  created_at  timestamptz not null default now()
);

alter table public.diet_phases
  drop constraint if exists diet_phases_ordered;
alter table public.diet_phases
  add constraint diet_phases_ordered
  check (ended_on is null or ended_on >= started_on);

create index if not exists diet_phases_user_start_idx
  on public.diet_phases (user_id, started_on desc);

alter table public.diet_phases enable row level security;

drop policy if exists "a person reads their own diet phases" on public.diet_phases;
create policy "a person reads their own diet phases"
  on public.diet_phases for select using (user_id = (select auth.uid()));

drop policy if exists "a person writes their own diet phases" on public.diet_phases;
create policy "a person writes their own diet phases"
  on public.diet_phases for insert with check (user_id = (select auth.uid()));

drop policy if exists "a person edits their own diet phases" on public.diet_phases;
create policy "a person edits their own diet phases"
  on public.diet_phases for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "a person deletes their own diet phases" on public.diet_phases;
create policy "a person deletes their own diet phases"
  on public.diet_phases for delete using (user_id = (select auth.uid()));

-- ---------- the clinic numbers, and their units ----------
-- UNITS ARE STORED, NEVER ASSUMED. Glucose and cholesterol are
-- reported in mmol/L in the UK and commonly in mg/dL on a
-- Bangladeshi lab report, and the two differ by a factor of
-- eighteen for glucose. This is the one place in the tool where
-- an assumed unit would be wrong exactly once, catastrophically.
--
-- The reference range comes from the lab that produced the
-- number, because a range is a property of an assay rather than
-- of a person. The tool prints it and interprets nothing.
create table if not exists public.diet_labs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  taken_on   date not null,
  marker     text not null,
  value      numeric(10,3) not null,
  unit       text not null,
  ref_low    numeric(10,3),
  ref_high   numeric(10,3),
  note       text,
  created_at timestamptz not null default now()
);

alter table public.diet_labs
  drop constraint if exists diet_labs_range_ordered;
alter table public.diet_labs
  add constraint diet_labs_range_ordered
  check (ref_low is null or ref_high is null or ref_low <= ref_high);

create index if not exists diet_labs_user_taken_idx
  on public.diet_labs (user_id, taken_on desc);

alter table public.diet_labs enable row level security;

drop policy if exists "a person reads their own diet labs" on public.diet_labs;
create policy "a person reads their own diet labs"
  on public.diet_labs for select using (user_id = (select auth.uid()));

drop policy if exists "a person writes their own diet labs" on public.diet_labs;
create policy "a person writes their own diet labs"
  on public.diet_labs for insert with check (user_id = (select auth.uid()));

drop policy if exists "a person edits their own diet labs" on public.diet_labs;
create policy "a person edits their own diet labs"
  on public.diet_labs for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "a person deletes their own diet labs" on public.diet_labs;
create policy "a person deletes their own diet labs"
  on public.diet_labs for delete using (user_id = (select auth.uid()));
