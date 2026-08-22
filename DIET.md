# The diet tool

`/tools/diet`. A calculator and a log, for one person eating in
Bangladesh or in the UK, who wants to know what their body is
made of, how much it costs to run, and whether the last three
weeks meant anything.

This file is the plan. It is prose, and a `check-diet` script under `scripts/`
is what will hold the parts of it that can be broken silently,
the way `scripts/admin.test.ts` holds `ADMIN.md`.

---

## 1. What it is, and the four things it refuses to be

It is a **tracker with arithmetic in it**. It takes a body, an
intake and a run of weights, and it says three things: what your
body probably is, what it probably costs, and whether the trend
is moving. Everything else is a consequence of those three.

**It is not medical advice, and it says so on every page that
gives a number.** The site already carries that sentence about
money and this is a stronger case: somebody can hurt themselves
with a calorie target in a way they cannot with a compound
interest curve.

**It is not a food database.** Building one is a decade of
someone else's work and a licence fee. What it has instead is a
portion library, `§7`, and free entry for everything else.

**It has no streak, no flame and nothing counting down.** That is
already written down for the routine tool and it matters more
here. A missed day on a diet tracker that shames you is a tool
somebody deletes on the day they most need it.

**It will not produce a target below the floors in `§5`.** Not
with a warning, not behind a confirmation. The number does not
get calculated.

---

## 2. The body: what this site can actually know

### BMI is nearly useless on its own, and the site should say so

BMI is mass over height squared. It cannot tell muscle from fat,
it reads a lean 180cm rower as overweight, and it says nothing
about where the fat is, which is the part that matters.

It is in the tool for one reason: everybody has been given one by
a doctor and will look for it. So it is shown, and shown with its
limits next to it rather than in a footnote.

### The cut-offs are not the same for everyone, and this matters here

The 25 and 30 thresholds were derived from European populations.
South Asians carry more visceral fat and develop insulin
resistance at a lower BMI, and the WHO's 2004 expert consultation
recommends lower action points for Asian populations:

| | general | Asian cut-offs |
| --- | --- | --- |
| increased risk | 25.0 | **23.0** |
| high risk | 30.0 | **27.5** |

A tool serving Bangladesh that quietly used 25 would tell a large
number of its readers they are fine when their own health service
would not. **The threshold follows the `place` in the profile,
and the page says which set it is using and why.** This is the
single most important honest detail in the whole tool and it
costs one table.

### Waist to height is the better single number

WHtR is waist divided by height, same units. Under 0.5 is the
rule of thumb, and it needs one tape measure and no assumptions
about population. It predicts cardiometabolic risk better than
BMI across ethnicities, which is exactly the property BMI lacks.

**It leads. BMI is shown beside it.**

### Body fat, with its error bars visible

Two estimates, in order of preference:

1. **The Navy tape method**, which needs neck and waist for men,
   plus hips for women, and height.

   - men: `%fat = 495 / (1.0324 − 0.19077·log10(waist − neck) + 0.15456·log10(height)) − 450`
   - women: `%fat = 495 / (1.29579 − 0.35004·log10(waist + hip − neck) + 0.22100·log10(height)) − 450`

   Standard error is around 3 to 4 percentage points against DXA,
   and it is worse at the extremes. The tool prints a range, not
   a point: "26 to 33%", never "29.4%".

2. **Deurenberg from BMI**, when there is no tape:
   `%fat = 1.20·BMI + 0.23·age − 10.8·sex − 5.4` (sex: 1 male, 0
   female). Worse, roughly ±5 points, and it inherits every
   problem BMI has. It is offered with that said, and there is a
   documented ethnic correction: at the same BMI, South Asians sit
   several points higher in body fat than white Europeans, so the
   estimate is adjusted by `place` and the adjustment is named on
   screen.

From body fat comes **lean mass**, which is what the protein
floor and the Katch-McArdle BMR are computed from, and **FFMI**,
which is the number that tells a lifter their BMI is lying.

### What it will not estimate

Visceral fat specifically, bone density, and anything requiring a
scanner. A tool that prints a visceral fat number from a tape
measure is making it up.

---

## 3. Energy: and why the tool learns rather than believes

### The starting estimate

**Mifflin-St Jeor** is the default, being the best validated
equation for the general population:

- men: `BMR = 10·kg + 6.25·cm − 5·age + 5`
- women: `BMR = 10·kg + 6.25·cm − 5·age − 161`

**Katch-McArdle** replaces it the moment body fat is known,
because it works from lean mass and therefore does not need to
guess at composition:

`BMR = 370 + 21.6 × lean kg`

TDEE is BMR times an activity factor, 1.2 sedentary through 1.9
very active.

### The estimate is wrong, and the tool knows by how much

Self-reported activity is optimistic and self-reported intake is
under-recorded, commonly by 20 to 30 percent, and both errors push
the same way. An activity multiplier is a starting guess and
nothing more.

**So after fourteen days of logs, the tool stops believing the
multiplier and starts measuring.**

```
TDEE_observed = mean daily intake + (trend weight change in kg × 7700) / days
```

7700 kcal per kilogram of body tissue is the standard
approximation, right for fat and wrong for water, which is
precisely why it is computed against the **trend** weight from
`§4` rather than against two scale readings.

This one calculation is the tool's best feature. It absorbs
metabolic adaptation, an inaccurate activity guess and consistent
under-logging into a single honest number: not what you should
burn, what you appear to burn given what you appear to eat.

It is shown with a confidence that widens when logging is sparse,
and it is never shown before fourteen days.

### Adaptive thermogenesis, said plainly

As weight falls, maintenance falls further than the loss of mass
alone predicts, on the order of 10 to 15 percent in a sustained
deficit. This is normal, it is not damage, and it is the reason a
target set in week one is wrong by week ten. The learned TDEE
picks it up without the reader having to know the word.

---

## 4. Weight is noisy, and the trend is the only signal

A scale reading is real weight plus a large error term. Daily
swings of one to two kilos come from sodium, carbohydrate and its
glycogen water, gut contents, the luteal phase of the menstrual
cycle (commonly half a kilo to two kilos), unaccustomed training,
alcohol, illness and travel.

**Nothing in this tool ever reacts to a single reading.** The
trend is an exponentially weighted moving average with a half
life of about a week, `α ≈ 0.1`, seeded from the first reading.
Every target, every projection and every stall check reads the
trend.

The scale reading is still drawn, faintly, behind the trend line,
because hiding it would make the tool look like it was flattering
the reader.

### Stalls, and telling the three kinds apart

A stall is **a flat trend over three weeks or more while the log
says the deficit is being held**. One flat week is not a stall,
it is a Tuesday.

When one is detected the tool asks which of three it is, because
they have different answers and only the reader has the
information to choose:

| | what it looks like | what it usually is |
| --- | --- | --- |
| **water masking** | trend flat, then a sudden drop | fat was lost, water replaced it. Common on keto after a refeed, when starting creatine, or with new training |
| **the target has drifted** | trend flat, learned TDEE has fallen | maintenance moved. Recalculate from the trend |
| **the log has drifted** | trend flat, intake unchanged on paper | portions crept, or something is not being logged. The most common of the three, and the tool says so without accusing anybody |

The "whoosh" belongs here. Fat cells that have given up their
triglyceride hold water for a while and then release it, which
looks like nothing for ten days and then a kilo overnight. A
reader who does not know that quits on day nine.

---

## 5. The goal engine, and the floors it will not cross

**Rate is a percentage of bodyweight per week**, not a fixed
number of kilos, because half a kilo a week is gentle at 110kg
and severe at 55kg.

| | per week | for |
| --- | --- | --- |
| gentle | 0.25 to 0.5% | most people, most of the time |
| standard | 0.5 to 0.75% | a clear goal with time to reach it |
| hard | up to 1.0% | higher body fat only, and time limited |

The deficit follows from the rate against the **learned** TDEE
once there is one, and against the estimate before that.

### The floors

- **Never below BMR.** A target under resting metabolic rate is
  not a diet plan.
- **Absolute stop at 1200 kcal for women and 1500 for men.** Below
  that the tool declines and says why.
- **Protein floor of 1.6 g per kg of lean mass**, up to about 2.2
  in a large deficit, because protein is what decides whether the
  weight lost is fat or muscle.
- **Fibre and micronutrients get a mention**, not a target. This
  is not a nutrition planner.
- **No loss goal at all below BMI 18.5**, on either set of
  cut-offs. The tool offers maintenance and says nothing else.

### Diet breaks

After eight to twelve continuous weeks in a deficit, the tool
suggests one to two weeks at maintenance. Not as a reward: as the
thing that makes the next block work.

---

## 6. Keto, since it was asked for by name

Keto gets its own handling because its first three weeks lie to
you, and a tracker that does not say so is worse than no tracker.

### Week one is water, and the tool says it before it happens

Full glycogen stores are roughly 400 to 500 g, and each gram is
held with about 3 g of water. Empty them and one and a half to
two kilos leave in the first week and **none of it is fat**.

This produces the classic arc: a triumphant week one, a
disappointing week two, and a quit in week three by somebody who
thinks it stopped working. It never started; the first number was
mostly water.

**So the tool marks the first fourteen days of a keto phase as an
adaptation window, excludes them from the trend's slope, and
says on screen what is happening.** That is the single most
useful thing it does for a keto reader.

### And it comes back, which is not a failure

Eat a large carbohydrate meal and the glycogen and its water
return, one to two kilos overnight. **A refeed spike is annotated
rather than counted**, and the tool refuses to call it a gain.

### Electrolytes and the keto flu

The lost water takes sodium with it, and most of what people call
keto flu is that. Sodium roughly 3 to 5 g a day, potassium 3 to 4
g, magnesium 300 to 400 mg, all as a note rather than a
prescription, and all with a line saying that anybody on blood
pressure medication or with kidney disease must ask a doctor
first, because for those two groups this advice is actively
wrong.

### Carbs, protein and ketones

- Net carbs typically under 20 to 50 g. Individual, so it is a
  setting.
- The claim that protein kicks you out of ketosis is mostly
  wrong: gluconeogenesis is demand driven, not supply driven. The
  protein floor stands.
- Optional blood ketone log, 0.5 to 3.0 mmol/L. Urine strips get
  unreliable after adaptation, and the tool says that rather than
  letting somebody chase a fading colour.

### The honest sentence about Bangladesh

Rice and roti are the staples. Keto in Dhaka is a much larger
behavioural change than keto in Manchester, and it is more
expensive per calorie. The tool says this once, plainly, on the
diet-style page, and then helps either way. Pretending otherwise
would be the same failure as using the European BMI cut-off.

### Other styles, same machinery

Standard deficit, higher protein, Mediterranean-ish, 16:8, and
Ramadan. All of them are the same engine with different macro
splits and different eating windows. Only keto gets the
adaptation window, because only keto has that water artefact.

---

## 7. Two countries, one tool

**Units.** Kilograms and centimetres by default. The UK also uses
stone and pounds, and feet and inches, so both are offered and
the choice is stored. Stone is displayed as `12 st 4 lb`, never
as a decimal.

**Food.** No database. A **portion library** instead: a short list
per place of the things people actually eat, each with energy and
macros for a stated portion.

- Bangladesh: cooked rice by cup, roti, dal, hilsa, chicken
  curry, egg, sugared tea, muri, khichuri.
- UK: a slice of bread, a supermarket chicken breast, semi
  skimmed milk, porridge oats, a banana, a supermarket meal deal.

Every figure carries a source note, and everything else is free
entry: kcal, and macros if the reader wants them.

**Ramadan** changes the eating window rather than the arithmetic.
The tool must not nag during fasting hours and must not read an
empty afternoon as a missed day.

---

## 8. What gets stored, and where

Two tables in Supabase, behind the same row level security
everything else uses, and **no local copy**. The precedent is
exact and deliberate: `public.routine_entries` is one row per
person per day with `unique (user_id, entry_date)`, read by the
browser as the reader.

This shape does not belong in `aab/src/sync.ts`. Every key in
that table is a `set`, a `mark` or a `count`, and a daily log is
none of the three: merging two devices means union by date with
the newer row winning per day, which is a table's job and not a
merge rule's. Progress has a local copy for a historical reason
that does not apply here, and `targets` and `scenarios` already
show what account-only storage looks like.

```sql
public.diet_profile   -- one row per person
  user_id, sex, birth_year, height_cm, place ('bd' | 'uk'),
  units ('metric' | 'imperial'), style, activity, goal_rate,
  neck_cm, waist_cm, hip_cm, updated_at

public.diet_days      -- one row per person per day
  user_id, entry_date, weight_kg, kcal,
  protein_g, carbs_g, fat_g, ketones_mmol, note,
  unique (user_id, entry_date)
```

Sex is stored because the equations need it and there is no
honest way around that. It is asked for as "which formula should
this use", with both answers explained, and it is not used for
anything else.

---

## 9. The pages

| | |
| --- | --- |
| `/tools/diet` | today. Weight in, food in, the trend, today's target, what the tool has learned |
| `/tools/diet/you` | the body: measurements, composition, the cut-offs and which set is in use |
| `/tools/diet/goal` | rate, style, macros, the floors, and what the projection actually says |
| `/tools/diet/trend` | the long view: trend against scale, learned TDEE over time, stalls and phases |
| `/tools/diet/foods` | the portion library for this place, and free entry |

All Next routes under `next/app/(site)/tools/diet/`, components in
`next/components/diet/`, arithmetic in the shared arithmetic module so the
Worker and the browser cannot disagree about a formula. A nav
entry in `next/lib/nav.ts` under Tools, which is what puts it in
the rail, the footer and the palette at once.

---

## 10. Safety, written before the code

- Every page that prints a target prints, next to it, that this
  is general education and not medical advice.
- No loss goal under BMI 18.5.
- Under 18: the equations are for adults and the tool says so and
  stops.
- Pregnancy or breastfeeding: not supported, said plainly.
- Diabetes, kidney disease, blood pressure medication, or a
  history of disordered eating: a visible line saying to speak to
  a clinician first, particularly before keto and particularly
  before the electrolyte note in `§6`.
- No shame language anywhere. Not "you failed", not "over
  budget", not red. The routine tool's rule, and it holds here.

---

## 11. Stages

1. the shared arithmetic module: the arithmetic, with a unit test per formula.
   BMI both ways, WHtR, Navy, Deurenberg, Mifflin, Katch, the EMA
   and the learned TDEE. Nothing renders yet.
2. The migration, the two tables and their policies.
3. `/tools/diet/you`: measurements in, composition out. The first
   page that shows a number, and the first that shows a range.
4. `/tools/diet`: log a weight, log an intake, draw the trend.
5. `/tools/diet/goal`: the engine, the floors, the projection.
6. `/tools/diet/trend`: learned TDEE, stalls, the three kinds.
7. Keto: the adaptation window, refeed annotation, electrolytes,
   ketones.
8. The portion library for both places.
9. Ramadan and the eating window.

Each stage ships. None of them ships a placeholder: an empty
panel that will one day hold something reads exactly like a
broken one, which is the rule `/admin` already exists under.

---

## 12. What must be checked

- a `check-diet` script under `scripts/`: every formula in the shared arithmetic module has a
  test; no page prints a target without the disclaimer beside it;
  the floors in `§5` cannot be crossed by any input; the Asian
  cut-off table is used whenever `place` is `bd`.
- a `diet.test` under `next/`: the pages in a real browser, the way
  `next/admin.test.ts` drives `/admin`. A panel that renders and
  computes nothing looks exactly like one that works.
- `COUNTS` in `shared/content.ts` if any page says how many tools
  this site has, because a sentence that counts must count.
