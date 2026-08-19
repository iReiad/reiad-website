# Routine

A daily routine at `/tools/routine`, one per signed-in person,
private to them.

**It is a gift.** That is not decoration on top of a tracker, it is
the specification, and it decides things a productivity tool would
decide the other way. The build spec's own sentence is the test:

> A handwritten daily list works, but only if it never becomes a
> thing to feel guilty about.

Where a feature and that sentence disagree, the sentence wins.
Section 9 of the spec is not a preference list, it is the product,
and it ships here as assertions rather than as prose.

---

## 0. The ratchet, which is the one rule under all of it

**Nothing this tool remembers about you ever goes down.**

Every counter accumulates. Every drawing grows. No plant wilts, no
bird leaves, no number resets at midnight, nothing is ever "lost".

That is the technical form of "never a thing to feel guilty about",
and it is a stronger rule than "no streaks" because it explains *why*
a streak is wrong: a streak is a number that punishes you for
living. A garden that only ever grows is the same idea with the
punishment taken out. **A feature that can decrease is a streak
wearing a costume**, and it does not go in however charming it looks.

Every surprise in §7 obeys it. Check any new one against it first.

---

## 1. What the spec assumed, and what is actually here

| the spec says | here | so |
| --- | --- | --- |
| Cloudflare Pages, deployed from GitHub | Cloudflare **Workers**: `worker.js` in front of a Next Worker | routes, not pages. Nothing new to set up |
| "**DECIDE WITH ME** if the repo already has an auth solution" | **Supabase Auth, already**, with RLS carrying `progress`, `library`, `targets`, `scenarios`, `profiles` | nothing to decide and nothing to bolt on. The spec's own argument for Supabase over D1 is the argument this site already took |
| React + Vite + TypeScript if greenfield | Next.js routes under `next/app/`, components under `next/components/` | a route and components, per the rule that nothing new is hand-written HTML |
| plain CSS modules | `next/styles/site.css`, Tailwind, a glass material system, a component library | no second styling system |
| `reference/sadias-day.html` as the visual reference | **it does not exist**, and the author has confirmed it never did | nothing is being ported. §6 of the spec describes the behaviour precisely and §11's look is superseded by §4 below |
| its own palette, `Baloo Da 2` and `Caveat` self-hosted | a settled type scale, two Bangla faces, and a CSP | superseded, with **one exception**, and the exception is the point. See §4 |
| `/settings/tools/routine` | there is no `/settings` tree; `/account` is the settings page | `/tools/routine/settings`. Two surfaces, as the spec insists, at addresses this site understands |

**The one thing marked DECIDE WITH ME is answered by the repository
rather than by me.** `aab/src/account.ts` is Supabase Auth, five
tables already sit behind row-level security, and `aab/sync.js`
already treats the account as the record and the browser as a mirror.

---

## 2. Where it lives

Two surfaces, and the spec is right that they must not merge.

**`/tools/routine`** is the daily driver: open it, mark three things,
write a line, close it, in under twenty seconds. It is the only page
most people ever see. Two tab panels, the day and the year, on
`components/ui/tab-panels.tsx`, which is the arrangement `/account`
already uses: the fragment chooses, `replaceState` rather than
assigning `location.hash`, arrows and Home and End on a roving
tabindex, and nothing hides until the first effect has run.

**`/tools/routine/settings`** is everything that shapes it: the
builder, templates, preferences, your data. Reached from the day and
from `/account`, never from the rail.

**`/tools/routine/print`** is the paper fallback, print stylesheet
only, no app chrome.

Signed out, `/tools/routine` is a short panel saying what it is and a
sign-in button. Not a redirect, which loses the address somebody was
sent, and not an empty shell, which looks broken.

---

## 3. The data model

```sql
-- three columns on the table that already exists
alter table public.profiles
  add column if not exists routine_locale     text     not null default 'both',
  add column if not exists routine_week_start smallint not null default 6,
  add column if not exists routine_day_roll   smallint not null default 4;
```

On `profiles` and not on a routine, because they are facts about a
person: somebody with two routines still has one week and one idea of
when a day ends. The `routine_` prefix is what stops the next feature
that wants a `locale` from finding one and assuming it means the
site's.

```sql
create table public.routine_templates (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references auth.users on delete cascade,  -- null = the site's
  name        text not null,
  description text,
  is_public   boolean not null default false,
  data        jsonb not null,                                -- { bands, tasks }
  created_at  timestamptz not null default now()
);

create table public.routines (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  name       text not null,
  bands      jsonb not null,
  tasks      jsonb not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.routine_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  routine_id uuid not null references public.routines on delete cascade,
  entry_date date not null,
  marks      jsonb not null default '{}',   -- { "<task id>": 1 | 0.5 }
  mood       text,
  note       text,
  chose      text,                          -- what "something I chose" was
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create index routine_entries_user_date_idx
  on public.routine_entries (user_id, entry_date desc);
```

**Prefixed `routine_`** because this database already holds
`progress`, `library`, `targets` and `scenarios` for the rest of the
site, and a bare `entries` or `templates` is a name the next feature
will want.

**`chose` is one column past the spec** and it earns its place: the
task `own`, "Something I chose", has no hours and does not count. A
line beside it turns one tick into a tiny diary, and it is the
cheapest warmth in the whole schema.

**`tasks` is jsonb and must stay jsonb.** Entries key marks by task
id. If tasks were rows, deleting one would break history or cascade
it away. **Deleting a task sets `archived: true`. Ids are never
reused and never removed.** An archived task leaves today's list and
still renders correctly on a day it was marked. Do not normalise
this.

```json
{ "id": "eng", "band": "learn", "en": "English + German",
  "bn": "ইংরেজি + জার্মান", "hours": 1, "counts": true,
  "order": 1, "archived": false }
```

`counts: false` means tracked and excluded from every piece of
arithmetic. **Leisure must never be able to fail.**

### Row-level security, on every table, no exceptions

`routines` and `routine_entries`: all four operations on
`user_id = auth.uid()`. `routine_templates`: select where
`owner_id is null or owner_id = auth.uid() or is_public`; insert,
update and delete only where `owner_id = auth.uid()`.

**The lesson from #159 applies to every read written here.**
`profiles` is the one table on this project whose select policy is
`using (true)`, so any read of it carries `id=eq.<me>`. Every table
above is owner-scoped, so an unfiltered read returns your own rows,
and the filter goes in anyway for the reason `saveProfile` already
gives at length.

**No local mirror**, deliberately. `progress` has one because four
schools have read localStorage since before there were accounts and a
reader with no account still gets all of it. Nothing here has that
history and nothing here works signed out, so a second copy would be
a second record to keep in step for nobody. `scenarios` and `targets`
already follow this.

---

## 4. What it looks like

**The site's design system, and that is not a compromise.** A new
tool arriving with its own palette is a redesign smuggled in as a
feature: `/account` and the calculators would be two looks and this a
third. `--accent` already does what the band colours are for. The
site sets it per section from one table and every card, chip, meter,
rule and focus ring derives from it, so **a band's colour becomes
`--accent` inside that band**, exactly as a school's colour already
does, and the six bands are six values in one place.

```
learn #6E52A8   kitch #C4711F   home #2F8A64
mine  #A2790B   rest  #4C61A8   kind #B45570
```

**One exception, and it is the emotional centre of the tool.**
`Caveat` is loaded for exactly one element: **what she wrote
herself.** The note, the "something I chose" line, and nothing else.
The CSP already allows `fonts.googleapis.com` and
`fonts.gstatic.com`, so this costs no policy change and one
stylesheet link. Handwriting everywhere is a theme; handwriting on
the one handwritten thing is the difference between a page that looks
like a notebook and a page that *has your handwriting in it*.

`Baloo Da 2` is **not** loaded. `--font-bn` is already Noto Sans
Bengali and carries the whole site's Bangla.

**The signature interaction stays, exactly.** The tick strokes itself
on in green like a pen: an SVG path animating `stroke-dashoffset` to
0 over about 380ms. It is the one piece of *interaction* motion on
the page. `prefers-reduced-motion: reduce` renders it instantly.

Everything else is `<Button>`, `<ChipButton>`, `<GoCard>`,
`<InfoCard>`, `<Field>`, `<Meter>`, `<Band>`. If a control this tool
needs does not exist, it goes in the library and not in the page.

---

## 5. The daily view

- Marks cycle on tap: empty, full, half, empty. Half is 0.5.
- Progress is the sum of marks on counting tasks over the count of
  counting tasks. Nothing else counts, ever.
- A week strip switches days; left and right arrows do the same.
- **A day before the account existed is openable and editable.**
  Backfilling is allowed and is not a special case.
- Mood chips, a free-text "one good thing today", and the `chose`
  line beside "something I chose".
- Autosave, debounced about 500ms, one row upserted on
  `(user_id, entry_date)`. A quiet "saved", never a modal, never a
  toast over content.
- **Optimistic, with real failure handling.** The mark appears at
  once. If the write fails it stays on screen, a retry is queued, and
  one plain line says *"not saved yet, we will keep trying"*. Never
  discard input silently, and never roll a tick back under somebody's
  finger.
- Language: Both, English, বাংলা, in `profiles.routine_locale`.
- `routine_day_roll` means marking at 1am is still yesterday.

**An empty day shows no percentage at all.** Not `0%`. It says
"আজ এখনো খালি", today is still empty, and the number appears once
there is something for it to describe. A zero is a judgement wearing
a number's clothes.

---

## 6. The year (the second tab)

Rich, useful, and never a scoreboard.

1. **Twelve-week heatmap**, one cell per day, opacity by completion,
   today ringed, click a cell to open that day. The hero. Empty cells
   are the paper colour, not a gap: an unmarked day is not a hole.
2. **Mood ribbon** on the same date axis under it, so a pattern is
   visible without being asserted. **No printed correlation between
   mood and completion, ever.**
3. **Per-task consistency**, last 28 days, bars sorted by frequency,
   coloured by band.
4. **Band balance**: how a typical day divides.
5. **Planned against marked hours**, last 4 weeks, labelled plainly
   as a rough guide.
6. **The jar** (§7.1) and **the reflection log**: notes newest first
   with date and mood, searchable.

Charts are hand-built SVG. No charting dependency for six panels.

Empty state is an invitation: *"Mark a few things and this page
starts filling in."*

---

## 7. The surprises

Each one had to pass three tests: **can the site measure it out of
something it already holds**, **can it make somebody feel behind**,
and **does it obey the ratchet in §0**. Anything failing the first is
a decoration. Anything failing the second or third does not go in
however charming it is.

### 7.1 The jar of good things · কাচের বয়াম

Every "one good thing today" drops into a jar drawn on the year page.
It fills as the year goes on. Press it and one line comes out at
random, with its date.

Over a year this is the best thing in the tool, and it is a `select`
with an `order by random() limit 1`. It can only ever get fuller.

### 7.2 A year ago today · এক বছর আগে আজ

Open a day, and if there is a note from that date a year ago, a month
ago, or the same weekday last season, it appears quietly at the
bottom in her own handwriting.

Nothing else in the tool will be as good as reading *"the birds ate
from my hand"* twelve months later on a Tuesday.

### 7.3 The birds · পাখিরা

`brd`, Feed the birds, is a task. Every time it is marked ever, the
flock grows: one bird, then two, then a row along the header. **They
never leave.** Not a reward and not a target, a *presence*. No number
is shown, no next milestone is named, and skipping a month changes
nothing at all.

### 7.4 The garden · বাগান

`pln`, Water the plants. Same ratchet, drawn in the corner: তুলসী
first, then জবা, বেলি, কামিনী, শিউলি as the total grows. **Nothing
wilts.** A plant that could die would be a streak with leaves on.

### 7.5 Six seasons · ষড়ঋতু

Bangladesh has six, not four, and almost no software knows it. The
page's ground, its illustration and one line of the header follow the
real calendar: গ্রীষ্ম, বর্ষা, শরৎ, হেমন্ত, শীত, বসন্ত.

Computed from the date, no data needed, and it means the page in
বর্ষা does not look like the page in শীত. Nobody expects a routine
tracker to know this.

### 7.6 It says her name, and it knows the hour

সুপ্রভাত, শুভ দুপুর, শুভ সন্ধ্যা, শুভ রাত্রি, with the name from
`profiles.display_name`. Bangla first, because that is what this site
is.

### 7.7 Milestones that can only go up

*"You have written 40 notes."* *"You have fed the birds 100 times."*
Stated when they happen and never as a target, never with a next one
named, never with a bar approaching it. The ratchet in one sentence.

### 7.8 Quick entry, in a sentence

"read an hour, watered the plants, skipped dinner" marks three tasks.
Parsed in the browser against the task list in both languages plus
synonyms she can add. No network, no model. **What it did not
understand it shows back as the words it did not understand**, rather
than guessing.

### 7.9 The day it already knows

A weekday has a shape and the tool has the history. Opening a Saturday
shows what Saturdays usually hold, as a ghost behind the empty ticks,
and one press fills it in to be edited. It exists for the person
backfilling four days at once, which is the exact moment a tracker
starts to feel like a chore. Pressing nothing leaves nothing marked.

### 7.10 What has changed, factually

In place of a streak: *"Art is marked on 11 of the last 14 days.
Before that it was 4 of 14."* Two numbers, no arrow, no colour, no
verdict. The honest version of what streaks are reaching for.

### 7.11 Tasks you have never marked

Listed plainly on the consistency panel, with an Archive beside each.
**The most important feature in the tool.** A routine full of
aspirational tasks is what makes a tracker feel bad, and the fix is
taking them out, not trying harder. Nothing nags; the list is simply
there.

### 7.12 Hours that are real, live in the builder

*"Planned to 19.5 hours of 24. 4.5 free."* Almost no routine builder
says this, and it is the most useful thing one can say while somebody
is adding a seventh task.

### 7.13 A routine is a fourth kind of target

`public.targets` has three kinds and `CLAUDE.md` sets the bar for a
fourth: *"if the site cannot measure it out of something it already
holds, the bar would be a decoration."* A routine is measurable out
of `routine_entries`, so `kind = 'routine'` passes honestly. It is
the first thing tying this tool to the rest of the site.

### 7.14 A starter built from what she already does

`profiles.following` says which schools somebody follows. "Build me
one" seeds a routine from that, so the first run is not a wall of
somebody else's life.

### 7.15 Her year, as a thing to keep

`/tools/routine/print` blank is the paper fallback. Filled, it is a
keepsake: the heatmap, the counts that only go up, and a handful of
lines out of the jar, on one page, in her handwriting face. One
boolean apart.

### 7.16 Keyboard first

Number keys mark the nth task, arrows move days, `/` opens quick
entry. Twenty seconds becomes five.

### 7.17 The welcome

The first open shows a short note in Bangla, written by the person
who made it, stored in `routine_templates` beside Sadia's day so it
travels with the seed. Shown once, and findable again from settings.
It is a gift and it should say so, once, and then get out of the way.

### 7.18 Erasing offers the copy first

"Erase everything" downloads the export before it asks the second
time. Nothing is ever lost by pressing the wrong thing quickly.

---

## 8. The hard constraints, as tests

`scripts/routine.test.ts`, and these are assertions rather than
intentions. In `scripts/` and not in `next/` because it needs neither
the Next build nor a browser: it is the arithmetic, the templates and
a grep, which is what makes it run in CI.

- **No streaks.** The test greps the built markup and the modules for
  `streak`, `chain`, `consecutive` and the flame emoji, and fails on
  any of them. Somebody must be able to skip four days and come back
  to an interface that has not reacted.
- **The ratchet.** Every counter the tool draws is fed a shrinking
  history and asserted not to decrease. This is §0 as a test and it
  is the one that catches a charming feature going wrong.
- **No red, no overdue, no failure state.** No element carries
  `--danger`, `--red`, or a `data-state` of `bad` or `late`.
- **No zero.** A day with nothing marked renders no percentage.
- **No comparison between people.** Nothing reads another person's
  row, which §8's isolation test proves at the database.
- **No guilt notification.** Nothing is sent.
- **No goal that can be failed.** Percentages describe; nothing
  congratulates and nothing scolds.
- **Leisure cannot fail**: a task with `counts: false` never enters
  any arithmetic, asserted directly.
- **Copy stays plain and kind.** A fourteen-year-old reads this.

Four of these are already true and tested, before there is anything
to look at, because they are properties of `done()` in
`shared/routine.ts` rather than of a page:

| | |
| --- | --- |
| leisure cannot fail | a day of nothing but television answers `null`, and adding one real task after it answers exactly one thirteenth. The five leisure marks reach neither the numerator nor the denominator |
| nobody is shown a zero | four different empty days, and no path through the arithmetic returns `0` |
| tidying does not rewrite the past | archiving a task takes it off today's list, leaves it in the routine, and does not move yesterday's figure |
| the ratchet | a counter is fed forty days with a dead fortnight in the middle and asserted never to fall. Coming back after two weeks away costs nothing |

The grep strips comments first, and that is not a loophole: the ban is
on the tool having a streak, not on the code explaining why it does
not. `shared/routine.ts` opens with the sentence the whole thing rests
on and would otherwise fail its own test, which is the trap `CLAUDE.md`
names for the em dash rule. Every string a reader can see still gets
scanned.

### Isolation, which gates everything

Proved against the real database with real JWT claims before a line
of interface was written. Two accounts, one routine and one entry
each, then read with **no filter in the query at all**, so the policy
is the only thing standing there:

| asked | answered |
| --- | --- |
| A reads `routines`, `routine_entries` | 1 and 1: `ISOLATION A`, `private to ISOLATION A` |
| B reads the same | 1 and 1: `ISOLATION B`, `private to ISOLATION B` |
| B asks whether A's routine exists | 0 rows. Not hidden from the result, hidden from the question |
| anon reads `routines`, `routine_entries` | 0 and 0 |
| B inserts a row owned by A | `ERROR 42501: new row violates row-level security policy` |

Reproduce it in the SQL editor, and the shape is worth keeping
because it is the honest one:

```sql
set local role authenticated;
set local request.jwt.claims =
  '{"sub":"<a user id>","role":"authenticated"}';
select count(*) from public.routine_entries;   -- their own rows, only
```

**And the standing guard is `scripts/check-rls.ts`**, because a proof
run by hand is not a guard. It reads `supabase/migrations/` with no
network and no credentials, so it runs on a laptop and in CI, and it
fails on three things: a `create table` with no
`enable row level security` after it, a table with RLS on and a verb
with no policy, and a **second** table whose select policy is
`using (true)`.

That third one is #159 turned into a check. `profiles` is the one
table that is public on purpose and it is named in the file with its
reason; the property that made a missing filter dangerous cannot now
be acquired by accident.

---

## 9. Build order

Each phase ships working, is a pull request, and is merged before the
next begins. Not all four and then integrate.

| phase | what | done when |
| --- | --- | --- |
| **1** | migration, RLS, the isolation proof, `shared/routine.ts` and the three templates | A cannot read B's rows, proven against the real database; leisure cannot fail and nobody is shown a zero, proven by 50 checks |
| **2** | the daily view: marks, note, autosave, language, the tick | the twenty-second path works one-handed on a phone |
| **3** | settings: builder, templates, seeds, export and import | Sadia's day loads in one press; export, erase, re-import lands exactly where you were. **Done.** |
| **4** | the year, the jar, the birds, the garden, the seasons | six panels drawn from the rows, and the page in বর্ষা does not look like the page in শীত. **Done**, print view included |

**All four have shipped.** What is left is in §10, and it is left on purpose.

---

## 10. Out of scope for v1, and said rather than built

Sharing routines between people, comments, anything social, mobile
apps, offline sync, reminder emails, suggestions about somebody's
routine, and integration with calendars or wearables.

`is_public` is built as a column with its UI left off, which is the
spec's own instruction and the right shape: the schema does not have
to change later and nothing ships that nobody can use.
