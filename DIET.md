# The diet tool

`/tools/diet`. A calculator, a log and a dashboard, for one
person eating in Bangladesh or in the UK, who wants to know what
their body is made of, how much it costs to run, how much it
costs to feed, what is likely to happen next, and whether the
last three weeks meant anything.

**One place, in two languages.** Not a calculator here and a food
log somewhere else: the body, the food, the money, the calendar,
the clinic numbers and the explanation of every one of them, on
one set of pages, with a switch at the top that turns the whole
thing into Bangla.

This file is the plan. It is prose, and a `check-diet` script under `scripts/`
is what will hold the parts of it that can be broken silently,
the way `scripts/admin.test.ts` holds `ADMIN.md`.

---

## 1. What it is, and the five things it refuses to be

It is a **tracker with arithmetic in it**. It takes a body, an
intake and a run of weights, and it says three things: what your
body probably is, what it probably costs, and whether the trend
is moving. Everything else in this file is a consequence of those
three, or an honest account of why one of them is harder than it
looks.

**It is not medical advice, and it says so on every page that
gives a number.** The site already carries that sentence about
money and this is a stronger case: somebody can hurt themselves
with a calorie target in a way they cannot with a compound
interest curve.

**It does not build a food database, and it does not pretend one
is unnecessary.** Building one is a decade of someone else's work
and a licence fee. What it has instead is a small curated portion
library, `§22`, two open databases searched through the Worker,
`§12`, the reader's own items, and free entry for everything else.
**Every figure says which of those it came from**, because the
difference between a checked number and a stranger's number is
the only thing that makes either usable.

**Its streak counts days LOGGED, never days on target.** That
distinction is the whole of whether the number is usable: a run
of days under a calorie ceiling punishes somebody for a birthday,
and a run of days RECORDED is a count of paying attention, which
is the entire ask. The best run sits beside the current one,
because a number that can only fall is a number people stop
looking at, and a best is a fact that never goes down once it has
happened.

**Nothing counts down, nothing turns red, and no missed day is
announced.** A tracker that shames you is one somebody deletes on
the day they most need it.

**It will not produce a target below the floors in `§5`.** Not
with a warning, not behind a confirmation. The number does not
get calculated.

**It will not print a number it cannot know.** Every estimate
carries the width of its own error, every micronutrient figure
carries the share of the day it was computed from, and anything
that would need a scanner is simply absent. A confident wrong
number is worse than a visible gap, and most of this file is that
sentence applied to one thing at a time.

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

The NHS says the same thing for the same reason, in its own
words, for people of South Asian, Chinese, Black African and
African-Caribbean background. So the setting is not "which
country are you in", it is asked as ancestry with the country as
the default, because a Bangladeshi reader in Manchester needs the
lower cut-off and the UK default would give them the higher one.

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
   estimate is adjusted by ancestry and the adjustment is named on
   screen.

From body fat comes **lean mass**, which is what the protein
floor and the Katch-McArdle BMR are computed from, and **FFMI**,
which is the number that tells a lifter their BMI is lying.

### The tape is a skill, and the tool teaches it once

Every number above is only as good as where the tape went, and
"waist" means four different places to four different people. So
the measurement page carries the definitions, plainly, once:

| | |
| --- | --- |
| waist | the narrowest point between the lowest rib and the top of the hip bone, or at the navel if there is no narrowest point. Standing, at the end of a normal breath out, tape level all the way round, snug without denting |
| neck | just below the larynx, tape sloping slightly down at the front |
| hip | the widest point of the buttocks, feet together |

**And it asks for the same conditions each time**, because the
error that matters is not accuracy, it is inconsistency: a tape
1cm high one month and 1cm low the next invents a 2cm change that
did not happen. Morning, before eating, same posture. The tool
records that it asked, and a measurement entered outside the
usual conditions can be marked as such and is drawn but not
trended.

### Photographs: the tool does not want them

The standard advice is to take a monthly photo, and the advice is
good, because a mirror adapts and a photograph does not. This
tool still does not collect them. Photographs of a body are the
single most sensitive thing a person could hand a website, this
site holds no service-role key and does not want the
responsibility, and a private R2 bucket is a promise about
somebody else's infrastructure.

**What it offers instead is a measurement set**: waist, hip,
neck, chest, thigh, upper arm, plotted over time. That is what
the photograph is actually being used for, it is four numbers
instead of an image, and it can sit in the same table as
everything else. The page says all of this rather than silently
lacking a feature every other tracker has.

### What it will not estimate

Visceral fat specifically, bone density, metabolic age, "body
water percentage", and anything else requiring a scanner. A tool
that prints a visceral fat number from a tape measure is making
it up, and the bathroom scales that print one are making it up
from a current passed through two feet.

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
burn = mean daily intake − (change in kg × 7700) / days
```

**Minus a signed change**, because a loss is a negative number
and a deficit is a positive addition to intake. Written as a plus
and meaning the magnitude, it reads correctly in prose and comes
out inverted in code for anybody gaining, which is a test rather
than a comment.

7700 kcal per kilogram of body tissue is the standard
approximation, right for fat and wrong for water, which is
precisely why it is never computed from two scale readings.

**And the change comes from a regression over the readings, not
from the trend's endpoints.** An exponentially weighted average
is the right estimator of a LEVEL and the wrong one for a RATE:
seeded from the first reading it lags the true line by about 1.44
half lives, so on a month of data its endpoints understate a real
loss by roughly a third, **in the flattering direction**. The
line looks right and the number is wrong. Ordinary least squares
over the readings has no lag, and the noise the trend exists to
suppress is exactly what its standard error should be measuring:
a reader who weighs erratically gets an honestly wide band and
one who weighs every morning gets an honestly narrow one. The
trend stays what the page draws and what "your weight today"
means.

This one calculation is the tool's best feature. It absorbs
metabolic adaptation, an inaccurate activity guess and consistent
under-logging into a single honest number: not what you should
burn, what you appear to burn given what you appear to eat.

It is shown with a confidence that widens when logging is sparse,
and it is never shown before fourteen days.

### The gap between the two is itself a reading

The starting estimate says what a body of this size should cost.
The learned figure says what this log implies. **The difference
between them is the under-logging estimate**, and naming it is
more useful than either number alone:

> Your log averages 1,850 a day. The trend says you are eating
> about 2,300. The gap is around 450 a day, which is normal and
> is almost always oil, drinks and the food eaten standing up.

That paragraph does not accuse anybody of lying, because nobody
is lying: under-recording is close to universal and it is mostly
the four things in `§14`. Naming the gap turns an invisible error
into a number the reader can decide to close or to simply subtract
from the target. Both are valid, and the tool supports the second
without moralising about it: if the log reads 20% low every week,
a target set against the log is still a working target.

### Adaptive thermogenesis, said plainly

As weight falls, maintenance falls further than the loss of mass
alone predicts, on the order of 10 to 15 percent in a sustained
deficit. This is normal, it is not damage, and it is the reason a
target set in week one is wrong by week ten. The learned TDEE
picks it up without the reader having to know the word.

Most of that adaptation is not the furnace burning cooler. It is
`§19`: the body moves less, unconsciously and all day. That
matters because it is the one part a reader can do something
about, and because it makes a step count a real input rather than
a vanity metric.

---

## 4. Weight is noisy, and the trend is the only signal

A scale reading is real weight plus a large error term. Daily
swings of one to two kilos come from sodium, carbohydrate and its
glycogen water, gut contents, the luteal phase of the menstrual
cycle (commonly half a kilo to two kilos), unaccustomed training,
alcohol, illness and travel. `§18` is the calendar all of those
sit on.

**Nothing in this tool ever reacts to a single reading.** The
trend is an exponentially weighted moving average with a half
life of about a week, `α ≈ 0.1`, seeded from the first reading.
Every target, every projection and every stall check reads the
trend.

The scale reading is still drawn, faintly, behind the trend line,
because hiding it would make the tool look like it was flattering
the reader.

### Weighing conditions, which decide how much of that noise there is

Most people's data is noisier than it needs to be, and the fix is
free: same time of day, after the toilet, before food or drink,
minimal clothing, same scale on the same hard floor. Daily is
better than weekly, because the average of seven noisy readings
beats one noisy reading, and because a weekly weigh-in has a
one-in-seven chance of landing on the worst day of the cycle.

**The tool asks for daily and is built for missed days.** The EMA
handles gaps by weighting on elapsed time rather than on the
number of rows, so a reader who weighs three times a week gets a
correct trend with a wider confidence band rather than a wrong
one.

### Stalls, and telling the four kinds apart

A stall is **a flat trend over three weeks or more while the log
says the deficit is being held**. One flat week is not a stall,
it is a Tuesday.

When one is detected the tool asks which of four it is, because
they have different answers and only some of the information is
the tool's:

| | what it looks like | what it usually is |
| --- | --- | --- |
| **water masking** | trend flat, then a sudden drop | fat was lost, water replaced it. Common on keto after a refeed, when starting creatine, or with new training |
| **the target has drifted** | trend flat, learned TDEE has fallen | maintenance moved. Recalculate from the trend |
| **the log has drifted** | trend flat, intake unchanged on paper | portions crept, or something is not being logged. The most common of the four, and the tool says so without accusing anybody |
| **it is not a stall** | trend flat, waist falling | recomposition. `§19`, and the tool can see this one on its own |

The "whoosh" belongs here. Fat cells that have given up their
triglyceride hold water for a while and then release it, which
looks like nothing for ten days and then a kilo overnight. A
reader who does not know that quits on day nine.

### And some stalls have no fix, which is worth saying

A body defends a weight it has held for a long time, and after a
large loss the defence is real: appetite up, spontaneous movement
down, maintenance below what the equations predict. Not every
flat month is a mistake to be corrected. Sometimes the honest
reading is that this is a hard part, that a diet break from `§5`
is the right move, and that the tool has nothing cleverer to
offer. **A tool that always has an answer is a tool that is
making some of them up.**

---

## 5. The goal engine, the floors, and why a goal weight is the wrong goal

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
- **A rate ceiling of about 1% per week**, and the reason is
  medical rather than motivational: rapid loss above roughly
  1.5kg a week measurably raises the risk of gallstones, and the
  people most likely to try it are the people at highest risk
  already. The ceiling is a floor by another name and it does not
  move.
- **No loss goal at all below BMI 18.5**, on either set of
  cut-offs. The tool offers maintenance and says nothing else.

### A goal weight is a number somebody read off a chart

Almost every goal weight in the world was picked by finding the
top of the healthy BMI band and rounding. `§2` has already said
that BMI is nearly useless on its own, so a tool that then asks
for a goal weight has quietly conceded the argument.

**So the goal is asked for in this order:**

1. **A waist**, or a waist-to-height ratio. Under 0.5 is the
   target that has evidence behind it, it is measurable weekly,
   and it moves when the thing you care about moves.
2. **A body fat band**, if there are tape measurements, shown as
   a band because `§2` will not print a point estimate.
3. **A weight**, last, and if it is chosen the tool shows what
   WHtR it implies at the current height so the reader can see
   what they have actually asked for.

The projection then runs in the reader's chosen unit. A waist
goal projects a waist, from the reader's own observed
centimetres-per-kilo, which is a personal number and not a
population one.

### Time to goal, with the interval on it

"You will reach 70kg on 4 March" is a lie with a date on it. The
projection is a **band that widens with distance**, drawn from
the observed variance of this reader's own trend, and it is
written as a range of weeks: "about 14 to 22 weeks at this rate,
if nothing changes". The "if nothing changes" is doing real work,
because `§3` guarantees that maintenance will fall on the way,
and the projection is recomputed against the learned TDEE every
time it is drawn.

### Diet breaks

After eight to twelve continuous weeks in a deficit, the tool
suggests one to two weeks at maintenance. Not as a reward: as the
thing that makes the next block work.

---

## 6. Gaining, and maintaining, which are the two phases nothing else has

Every tracker assumes you want to lose. Two other things happen
to people, and one of them is where every diet ends.

**Built, and it is `/tools/diet/goal`**, the same page as `§5`:
the direction is one chip on it, and a phase that comes after a
goal is not a different tool. `bandWatch()`, `suggestBand()` and
`gainWeekOne()` in `shared/diet.ts` are the arithmetic.

### Maintenance is a phase, with its own rules

The great majority of weight lost is regained, and it is regained
by people who reached their goal and then had no tool left to
use, because the app they used had exactly one mode.

**Maintenance here is a band, not a number.** The reader sets a
range, typically two to three kilos wide, and the tool watches
the trend against the band rather than against a target:

| | |
| --- | --- |
| trend inside the band | nothing. No message, no colour, no notification. This is the whole point |
| trend outside the band for two weeks | one line saying so, with the current learned TDEE beside it |
| trend outside by more than the band's width | offers a gentle phase from `§5`, at the lowest rate |

Logging in maintenance can be as thin as a weight, three times a
week, and the tool must work properly at that density rather than
scolding for missing meals. A tool that demands the same effort
at maintenance as in a deficit is a tool that gets abandoned at
exactly the point where abandoning it costs the most.
`bandWatch()` reads weighings and never intakes, which is what
makes that sentence true by construction rather than by care,
and it counts ELAPSED days rather than readings, because a count
of rows would ask for a month at three a week.

**The two weeks gate both of the last two rows**, which the table
does not say and which is the one way to read it wrongly. The
third row's own test is distance, and the trend's half life is a
week: a trend a full band's width outside has taken far longer
than a fortnight to get there unless something has gone wrong
with the water. An offer made off three days of that is an offer
made off noise, and this phase's whole argument is that it does
not speak off noise.

**And nothing is said off a trend nobody has fed.** Three weeks
without a weighing and `bandWatch()` returns null, on the same
grounds `stall()` refuses a flat month with nothing logged: a
tool that offers somebody a deficit off a month-old reading is
inventing a problem out of its own missing data.

### And gaining is a real goal, in both places

Underweight is not a rare edge case in Bangladesh, and it is a
normal case after illness, after surgery and in anybody trying to
add muscle deliberately. The engine reverses cleanly:

- rate **0.25 to 0.5% of bodyweight per week**, and the reason
  the ceiling is low is that a surplus above roughly 500 kcal
  adds fat faster than the body can add muscle, whatever the
  training. A faster gain is not a faster gain of the thing
  anybody wants.
- the protein floor is the same floor and matters more.
- **no maximum-surplus bravado.** The tool will not offer a
  "bulk" of 1,000 kcal over maintenance, for the same reason it
  will not offer 800 under it. `MAX_SURPLUS_KCAL` is that in the
  engine, and it is a SECOND ceiling rather than a restatement of
  the rate above: half a percent of 130kg is 715 kcal a day, so
  the percentage drifts above the mechanism it is a proxy for
  somewhere around 100kg, and a reader heavy enough to want to
  add muscle is exactly the reader it drifts for. `target()`
  applies both and names whichever one bound, because a silent
  clamp is a lie of omission going up as well as down.
- the trend rules are identical, and week one still lies: a
  carbohydrate increase refills glycogen and puts one to two
  kilos on the scale in a week that contains no new tissue at
  all. `§7` is that arithmetic run backwards, and the tool says
  so in the gaining direction too. `gainWeekOne()` is that
  arithmetic: the same store, the same three grams of water a
  gram, coming back rather than leaving, and a gut carrying more
  food than it was. `forecastChange()` deliberately declines the
  question, because `WATER.gain` is zeros and calling a rise all
  tissue would be a claim about the one thing that model cannot
  see. Do not "fix" that row.

### The honest sentence about what happens when you stop

On the goal page, once, where the projection ends: most people
regain a meaningful part of what they lose, and the single
strongest predictor of not doing so is continuing to weigh and
log after the goal is reached. That is not a scare and it is not
a sales pitch for the tool. It is the reason maintenance is a
built phase here rather than an empty screen.

**Once is part of the rule, and `check-diet.ts` holds it.** Said
twice it stops being a fact and becomes a slogan, and said away
from the projection it is a scare rather than a reason. It is
also the one sentence in this tool that argues for the tool,
which is what makes it the one most likely to get copied on to a
second panel by somebody who liked it.

---

## 7. Keto, since it was asked for by name

Keto gets its own handling because its first three weeks lie to
you, and a tracker that does not say so is worse than no tracker.

**Built, and it is `/tools/diet/keto`.**
`next/components/diet/keto-panel.tsx`. A live clock on the phase
that is running: which hour, what the body is doing at that
hour, what the scale has done and how much of that is real, and
what comes next, redrawn every minute the page is open. Starting
a phase and ending one are on it too, which is what makes every
phase-aware reading in this tool reach a reader at all: a phase
ends where the next one begins, and that is the end
`stretches()` already reads. The three amounts below sit beside
the sentence about blood pressure medicine and kidney disease,
net carbs are drawn against both marks rather than one invented
limit, the adaptation window is drawn rather than described, and
`diet_days.ketones_mmol` has a field at last. The clock's own
numbers are asserted in `scripts/diet.test.ts`, hour by hour,
against the amounts stated here.

**What is not built.** The carbohydrate limit is still not a
setting, because `diet_profile` has no column for one: the page
draws both ends of the range and says which is which rather than
picking. And `diet_phases.ended_on` is still unwritten, for the
reason above.

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
- **Ketone level is not a score.** Deeper ketosis is not faster
  fat loss; the deficit is. A reader chasing 3.0 mmol/L is
  chasing a number that measures how much fuel is in the blood
  and not how much fat left the body, and the page says so where
  the field is, not in a help article.

### The things keto is quietly hard on

- **Fibre**, which falls off a cliff when grains and most fruit
  go. `§15` tracks it and this is the main reason it does.
- **Uric acid** rises in the first weeks of both keto and rapid
  loss, which matters to anybody who has ever had gout. One line,
  once, on the diet-style page.
- **Cholesterol** moves in different directions in different
  people, sometimes sharply. That is a reason to log the panel in
  `§20` rather than a reason for this tool to have an opinion.
- **Long-term evidence is thinner than the internet suggests.**
  Keto works for weight loss because it produces a deficit, and
  the head-to-head trials against other diets at matched calories
  and protein mostly land in the same place. The tool supports it
  well and does not sell it.

### The honest sentence about Bangladesh

Rice and roti are the staples. Keto in Dhaka is a much larger
behavioural change than keto in Manchester, and it is more
expensive per calorie, which `§17` can now put a number on. The
tool says this once, plainly, on the diet-style page, and then
helps either way. Pretending otherwise would be the same failure
as using the European BMI cut-off.

---

## 8. The other ways of eating, and what is actually true about them

Same engine, different macro split and different eating window.
Each one gets a paragraph that says what it does and what it does
not do, because the reason people cycle through six diets in a
year is that each was sold to them as a mechanism rather than as
a way of eating less.

| | what it is | the honest line |
| --- | --- | --- |
| **standard deficit** | the default | the thing every other row is a way of achieving |
| **higher protein** | 1.6 to 2.2 g per kg lean | the best supported single change: more satiety per calorie, and it protects muscle |
| **Mediterranean-ish** | more fibre, more unsaturated fat, less refined | the strongest long-run health evidence of any pattern here, and the weakest short-run weight claim |
| **16:8 and other windows** | a shorter eating window | works by making it harder to eat as much. Trials against matched calories show little independent effect |
| **5:2** | two low days a week | the same, weekly. Suits people who prefer two hard days to seven medium ones |
| **OMAD** | one meal | hard to hit a protein floor in, so the tool warns rather than blocks |
| **low fat** | the 1990s answer | works, at matched calories, exactly as well as keto does |
| **Ramadan** | `§18` | a religious obligation that happens to be a fasting protocol, and the tool treats it as the former |

**Only keto gets the adaptation window**, because only keto has
that water artefact at the scale it has it. A 16:8 window does
not empty glycogen.

**The tool never ranks them.** It shows what each one does to the
macro split and the eating window, and it lets the reader's own
adherence data from `§16` be the argument. The best diet is the
one this particular person actually followed for six months, and
after six months the tool can say which one that was, from the
reader's own log, which is worth more than any table.

---

## 9. What to expect, and when

A tracker tells you what happened. Nobody tells you what is about
to happen, and almost everybody who quits does so at a point that
was entirely predictable a fortnight earlier.

**So the tool states the expectation before the week, and puts
the reader's own number beside it afterwards.** Not a promise and
not a target: a range, with the reason for it.

### The arc of an ordinary deficit

| | what usually happens | why |
| --- | --- | --- |
| **days 1 to 7** | a fast drop, often 1 to 3 kg, and most of it is not fat | glycogen and its water, less food in the gut, less sodium |
| **days 8 to 14** | almost nothing, and this is the first place people quit | the water has gone and what is left is the real rate |
| **days 15 to 28** | the first honest reading. The learned maintenance appears at day 14 | enough trend to have a slope |
| **weeks 4 to 8** | steady loss, and hunger rises somewhat | normal, and `§11` is where it gets watched |
| **weeks 6 to 10** | the target set in week one is now wrong | adaptive thermogenesis, `§3` |
| **weeks 8 to 12** | a diet break is worth taking | `§5` |
| **month 3 and after** | the same percentage is fewer kilos every month | arithmetic, not failure |

Keto's arc has the same shape with larger numbers in the first
fortnight, and `§7` is where that is set out.

**All of this assumes one protocol held steadily**, which almost
nobody does. `§10` is what happens when somebody starts keto,
adds a fast three days in, stops for a wedding and comes back,
and it is the section that stops this one being read as a
promise.

### Predicted against actual, which is the whole point

Each week, one line: what was expected, what happened, in the
same units, with no verdict attached.

> Week 2. Expected 0.2 to 0.6 kg. Trend fell 0.3 kg.

A reader who sees that in week two does not quit in week two, and
a reader who sees four weeks of actuals below the expected range
has evidence that something needs changing rather than a feeling
that they are failing. **The expectation is what turns a
disappointing number into information.**

### The shape of a day

The same idea one level down, and the same rule: what is typical,
then the reader's own pattern beside it.

- **Morning is the reliable reading.** `§4` has the conditions.
- **Hunger usually peaks in the late afternoon**, and after a
  short night, which is `§18`.
- **Protein early flattens the afternoon.** This is the one
  timing change with an evidence base worth the sentence.
- **Most over-target days are made in the evening**, and the
  reader's own weekday and mealtime data from `§16` will confirm
  that or contradict it.

### And what the tool itself unlocks, and when

Nothing is held back as a reward. Each of these appears when
there is enough data for it to be honest, and the page says the
date it will arrive, so a reader can see it coming.

| day | what appears |
| --- | --- |
| 1 | BMI, WHtR, composition, an estimated maintenance, a target |
| 7 | a trend with a slope worth drawing |
| 14 | the learned maintenance, the under-logging gap, the first predicted against actual |
| 21 | stall detection, `§4` |
| 28 | weekday patterns, the top calorie sources, how protein is spread |
| 60 | cycle to cycle comparison, `§18` |
| 90 | this reader's own calibration: what their deficit actually does, measured on the only body in question |
| 365 | the year page |

---
## 10. Changing what you are doing, and what that does to the forecast

`§9` is the arc of ONE protocol held steadily, and almost nobody
does that. People start keto, add a fast three days in, stop for
a wedding, come back, add training, take a week off ill. Every
one of those is a step in body water, and a tool that fits a line
straight through them reports a rate nobody is running.

**This is the section that stops the tool lying encouragingly.**

### The worked example, because it is the one people actually do

Three days of keto, then two days of a complete fast. An 80 kg
reader whose maintenance is about 2,500.

| | what the scale does | what is actually fat |
| --- | --- | --- |
| **keto, days 0 to 3** | down 1.3 to 2.3 kg | 0.19 kg. **About a tenth of it** |
| **the fast, days 3 to 5** | down another 1.4 to 2.5 kg | 0.65 kg. About a third of it |
| **five days together** | down about 3.6 kg | 0.84 kg. **Under a quarter of it** |
| **the first normal week after** | back up 1.8 to 3.9 kg | none of it. Not one gram |

A tool that projected from that scale would promise the goal
inside a month, and then spend the following fortnight watching a
reader "gain" three kilos from one meal and conclude they have
ruined it. Both halves of that are the same mistake.

### Two protocols do not take the same water off twice

This is the non-obvious part and it is why the arithmetic needs
to know **what was running before**, not only what is running
now.

Glycogen is about 0.55% of bodyweight, and each gram is held with
roughly three grams of water. Three days of very low carb has
already emptied most of that store, so **a fast starting on day
three finds a third of it left.** Its drop is mostly gut contents
and sodium water instead, which is a different quantity with a
different rebound.

So stacking two water-losing protocols produces a bigger apparent
loss ONCE and then one rebound, not two of either. The fat loss
is exactly the deficit and is entirely unaffected by the
stacking, which is the sentence the whole section exists to be
able to say.

`forecastChange()` in `shared/diet.ts` takes the previous
protocol and its days for that reason, and leaving it out is the
difference between a forecast and an encouragement.

### What the tool does about it

- **A slope never crosses a phase boundary.** `stretches()`
  splits the run at every change and `readable()` returns only
  the weighings a rate may honestly be fitted to. A regression
  across a change of protocol is a regression across a step in
  body water.
- **Every protocol has a settling window**, and the keto
  fortnight in `§7` is one case of it rather than a special rule.
  A fast is quick to act and slow to read: the rebound is what
  has to finish before a line means anything, so it settles in
  about ten days rather than two.
- **A stretch shorter than a week has no readable rate at all**,
  whatever it is under, because the noise the trend exists to
  suppress is larger than a week of signal. The honest answer
  during that time is that there is not one yet, and the tool
  says it in those words.
- **The learned maintenance is per phase and never spans a
  boundary.** Mean intake during a complete fast is zero, and
  `§3`'s formula fed a window containing one would return a
  number with no meaning at all.
- **The projection widens rather than sharpens.** A change of
  protocol makes the tool less certain for a fortnight, and the
  band it draws has to show that. Anything that gets more
  confident after a 4 kg week has the sign wrong.

### What the reader is told, before they do it

The same shape as `§9`: said in advance, not explained
afterwards.

> You are three days into keto. If you fast for two days from
> here, expect the scale to fall another 1.4 to 2.5 kg. About a
> third of that will be fat, and 1.8 to 3.9 kg will come back in
> the first few days of normal eating. The trend will not mean
> anything again until around the 15th.

Four facts and no advice. It does not say the fast is a good idea
or a bad one: it says what the number on the scale will do and
which part of it is real, which is the only thing this tool can
honestly know and exactly the thing nobody is told.

### And afterwards, the reconciliation

Once the settling window closes, the tool goes back and says what
actually happened: how much of that fortnight was fat, computed
from the deficit, against what the scale said at its lowest. That
is `§9`'s predicted-against-actual applied to a change rather
than to a week, and it is how a reader learns to read their own
scale rather than being managed by a tool that hides it.

---
## 11. Where you are right now, and what you are facing

### One card, at the top, in a sentence

Not a dashboard of eleven numbers. A status, in the language the
page is set in:

> Week 3 of a standard deficit. The trend is down 1.4 kg since
> you started. This week the tool expects 0.3 to 0.6 kg. Your
> learned maintenance is about 2,280, which is 180 below the
> estimate you began with. One thing worth doing: protein has
> been under the floor on nine of the last fourteen days.

Four parts and no more: **where you are, what has happened, what
is expected, and one next thing.** Never three next things. A
list of five improvements is a list nobody acts on, and the tool
picks the one with the largest effect rather than showing all of
them and calling it thorough.

### The journal, which is the only record of what this felt like

One line a day, free text, plus a short fixed set of tags:

`hungry` `tired` `headache` `craving` `low energy` `good day`
`ate out` `stressed` `slept badly` `unwell` `sore` `strong`

Fixed, because free text cannot be counted, and short, because a
list of forty tags is a list nobody uses. These are the ones that
recur.

**What they are for** is the one association the tool can honestly
make:

> You logged a headache on five of your first seven keto days.
> That is the most commonly reported effect of the sodium loss
> described in `§7`, and there is a note about it there.

Reported, associated, pointed at its own note. Never "caused by",
never a diagnosis, and `§16`'s rule about correlations governs
every sentence of it.

### Hunger is the early warning, and it arrives first

One number a day, 1 to 5.

A hunger score climbing steadily over three weeks is the best
available signal that a target is too aggressive, and it shows up
**before the trend does, before adherence breaks, and before the
reader concludes they have no willpower.** That ordering is why
this field is worth its friction: everything else in the tool is
a lagging indicator.

When it climbs for three weeks the tool says so once, and offers
the gentler rate from `§5` or the diet break. It does not insist,
it does not repeat itself weekly, and it never says the word
willpower.

### Symptoms, described and pointed at

| what gets reported | usually associated with | what the log can show |
| --- | --- | --- |
| headache, fatigue, cramp in the first fortnight of keto | sodium and water loss | the phase start date, sodium and its coverage |
| constipation | low fibre, low water | both, with their coverage, `§15` |
| dizzy on standing | low sodium, or a large deficit | intake against BMR, sodium |
| always cold, poor sleep, flat mood in a long deficit | a long deficit | weeks in deficit, and the rate |
| hair shedding two to three months after rapid loss | a known response to a stressor, and usually temporary | the rate over the preceding months |
| the scale up 2 kg overnight | `§4`, almost always | sodium, carbohydrate, the cycle, travel |

**And the line where the tool stops.** Chest pain, fainting,
palpitations, anything severe, anything that persists, anything
frightening: see a doctor, and do not consult a calculator. That
sentence is printed on the symptom panel itself and not in a
footer.

### What is not here

No "you are doing great". No encouragement written by a machine,
no badges, no celebration of a number. The stage card is a
status, and **a status that praises you is a status people stop
reading**, which would take the four honest sentences above down
with it.

---
## 12. Food found rather than typed

`§1` says this tool does not build a food database, and that
stays true: this repository will not hold one and this site will
not maintain one. But a tool that makes somebody type "chicken
curry, 380" from memory is a tool they use for four days.

**So food is searched, and the search reaches three places.**

| | what it is | good for | what is wrong with it |
| --- | --- | --- | --- |
| **the portion library** | this site's own, `§22` | Bangladeshi home cooking, both languages, real portions, and prices | small, on purpose |
| **Open Food Facts** | an open, crowdsourced database of packaged food with a public API and barcodes | UK supermarket products, packaged food in both countries, and the barcode path | crowdsourced, so an entry can be wrong, incomplete or duplicated. Bangladeshi coverage is thin |
| **USDA FoodData Central** | the US government's food composition database, public domain, free API | raw and generic foods, which is what home cooking is made of, and the only one of the three with dependable micronutrients | American names and American portions |

Ranked in that order, always, and **the source is printed on
every result**. A reader has to be able to tell a figure this
site checked from a figure a stranger typed into a public
database from a figure out of a government laboratory. Almost no
app shows this, and it is the difference between a number and a
rumour.

### Barcodes

A packaged product in Britain has one and Open Food Facts is
keyed on it. The browser's own `BarcodeDetector` reads it from
the camera where the browser has it, and where it does not, the
number is typed in, which is thirteen digits and still faster
than searching.

**No image leaves the device.** The frame is decoded in the
browser and only the digits are sent. There is no library, no
third-party SDK and no upload, which is the only version of a
camera feature this site would ship.

### The Worker is the only caller

The browser asks `/api/diet/food?q=` and
`/api/diet/food/<barcode>` and nothing else, exactly as
`/tools/live` asks `/api/broker/*` rather than talking to
Trading 212. Four reasons and all four are load bearing:

- **the CSP does not change.** `check-csp.ts` scans every string
  in `aab/` and `next/` and would rightly fail a third-party host
  written into a browser module.
- **one normaliser.** Three sources with three shapes become one
  shape in one place, rather than three parsers inside a
  component.
- **caching and rate limits.** A search for "chicken" is the same
  search for everybody, so it is cached at the edge and neither
  upstream sees this site's readers one at a time.
- **the FoodData Central key stays a wrangler secret**, and the
  section degrades honestly without it the way the Drive section
  already does: a page that says which sources are connected
  rather than one that fails oddly.

### A found food is copied, not referenced

The moment a result is used, its numbers are written into the
reader's own row, and a food used twice becomes their own item.

**The log must not depend on a third party still being there next
year.** A diet history that changed silently because somebody
edited a public database entry would be worse than one that went
missing, because nothing would announce it. The row keeps the
source, the upstream id and the date it was fetched, so a stale
figure can be found and refreshed deliberately rather than
drifting.

### Everything is editable, and free entry never goes away

A found food is a starting point. A reader whose portion is one
and a half times the label's says so, and the correction becomes
theirs from then on. **A search result that cannot be corrected
is worse than free entry, because it is wrong with authority.**

And a name and a number is always a valid entry. The coverage
rule in `§15` already says what that costs and says it on screen.

### No third-party account, ever

No signing into a food app, no OAuth to somebody's calorie
tracker, no importing a stranger's diary. The reader has one
account and it is this site's. Both databases above are read
anonymously, by the Worker, on this site's behalf.

---
## 13. Three taps, or it does not get logged

Everything above is worth nothing if logging dinner takes ninety
seconds. **The reason food diaries get abandoned is friction, not
motivation**, and the fix is that most people eat the same forty
things.

- ✓ **Copy yesterday**, whole or one meal of it. The most pressed
  button in any food log, and it is usually right. Whole, or one
  row of it; a meal of it waits on `diet_entries.meal` being
  filled, which is what names one.
- ✓ **Your usuals**, worked out rather than asked for: anything
  logged three times becomes a one-tap item, and the six most
  likely for this time of day sit at the top. Breakfast at eight
  in the morning should offer breakfast.
- ○ **Meals, not only foods.** "My breakfast" is one tap for four
  items, made by saving a day's meal as a template. `diet_foods`
  already carries the `meal` kind for it.
- ✓ **Recipes**, which are `§14`'s pot with a yield on it: build the
  dish once, say it serves five, and a portion is a fraction
  forever after. Editing the recipe does not rewrite history,
  because a logged entry holds its own numbers. Changing a saved
  dish and removing one are the two halves still to come: both
  need `diet_foods` to be writable a second time, which is an
  update in `next/lib/diet-api.ts` rather than a decision.
- ○ **A plan for the week**, optional: the same list with dates on
  it. Plan on Sunday, tick through the week, and the difference
  between planned and eaten becomes a reading in `§16` rather
  than a scolding.
- ✓ **A shopping list**, with the prices from `§17` giving a total
  before the shop rather than a shock after it. A list of items
  and a figure. **No links, no shop, no affiliate, ever.** It is
  built out of the recipes rather than out of a week's plan,
  which is the same list one stage early and needs no table of
  its own; a total is a floor the moment anything on it carries
  no checked price.
- ✓ **Quick add**, a bare number with no name, for the times when
  the honest choice is a rough figure now rather than an exact
  figure never. The food picker's own free entry is it.
- ○ **And a keyboard.** The whole log works without a mouse: type,
  arrow, enter. The account page's roving tabindex is already the
  pattern and there is no reason to invent a second one.

**Where it is.** `/tools/diet/recipes` is the page,
`next/components/diet/recipe-panel.tsx` and
`next/components/diet/usuals.tsx` are the two halves of it, and
`next/lib/recipes.ts` is the arithmetic under both. It divides
nothing itself: a pot is a food stated for `serves` portions, so
`scaleTo()` and `loggedFrom()` in `shared/foods.ts` do the
scaling that already scales a searched food to an amount eaten,
and their refusal comes with it. `next/recipes.test.ts` asserts
all of it with no browser.

**A recipe is somebody's real dinner, so a total refuses rather
than guesses.** An ingredient that states no energy contributes
NOTHING and is named on the page; the totals it belongs to read
"at least" rather than carrying a figure. A macro one ingredient
is silent about is a floor for the whole dish. And a
micronutrient is all or nothing, because `totalFor()` counts an
entry's WHOLE energy as covered for any key it carries: a pot
claiming iron that only two of its three ingredients stated
would buy the day coverage it does not have.

**The measure of this section is a stopwatch, and it belongs in
the test**: a repeat dinner in three interactions, a packaged
food by barcode in four, a completely new home-cooked dish in
under a minute. A target nobody measures is a wish.

---
## 14. The four things that make a log wrong, and what to do about each

`§3` said the gap between the estimate and the learned figure is
usually 20 to 30 percent. This is where that gap comes from, and
every one of these is worse in a Bangladeshi kitchen than in a
British one, which is exactly why no Western tracker handles
them.

### 1. The oil nobody measures

A curry's oil is poured, not weighed, and it is invisible in the
finished dish. Two tablespoons is about 240 kcal and it is
routine to use more. Across a week of home cooking this is
frequently the single largest unlogged item in the entire diet,
larger than any snack anybody feels guilty about.

**So the tool calibrates the household rather than the dish.**
One question, once a month: how much cooking oil did this
household get through this week, and how many people ate from it?
That divides into a per-meal figure that gets added
automatically, with the arithmetic shown:

> 750 ml of oil, four people, twenty-one meals. About 160 kcal of
> oil per meal, added to every home-cooked meal unless you say
> otherwise.

It is an estimate and it is labelled as one, and it is
enormously better than the zero that is there now. A bottle of
oil is the one thing in a kitchen that comes with its own scale
printed on the side.

### 2. The shared pot

Western trackers assume a plated portion. A pot of curry for five
and "I had some" is not a portion, and forcing it into one is why
people stop logging in week two.

**So a dish can be logged as a pot and a share.** Log what went
in (rice, oil, chicken, onion), which the portion library can
mostly price, then take a fraction: a half, a third, "two
ladles". The tool holds the pot for the rest of the week so the
same dish tomorrow is two taps. A household of four eating one
curry produces four different intakes and one piece of data
entry, which is the only version of this that anybody sustains.

### 3. Cooked, raw, and rice in particular

Rice roughly triples in weight when cooked, so 100 g of rice is
either 130 kcal or 350 depending on which 100 g was meant, and
this is the most common single error in the whole of calorie
counting. **Every rice, pasta, dal and grain entry in the library
states which state it is in, in the name, in both languages.** A
field that could be either is a field that will be both.

Two smaller true things go here, both worth one line and neither
worth a feature:

- **Parboiled rice** (siddho chal), which is most of what is
  eaten in Bangladesh, has a lower glycaemic response than
  polished white rice and much the same energy. Relevant to
  someone managing blood sugar, irrelevant to the calorie total.
- **Rice cooled and reheated** forms resistant starch, which
  lowers available energy slightly. Slightly. It is a real effect
  and it is not a strategy, and the tool says the second half of
  that sentence as loudly as the first.

### 4. Food eaten out, and food eaten standing up

A restaurant plate is not knowable. A plate of kacchi biryani is
somewhere between 700 and 1,100 kcal and anybody who tells you it
is 863 is reading a number invented by a website.

**So eating out is logged as a range**, the midpoint goes into
the total, and the width goes into the day's confidence. A day
with two restaurant meals is drawn with a wider band, the same
way a sparse micronutrient day is drawn faintly. That is more
honest than a false precision and it costs the reader nothing.

The same applies to the things eaten without sitting down: the
tea with sugar, the biscuit with it, the mishti at somebody's
house, the handful of something while cooking. **The tool offers
a one-tap "small extras" for a day**, a modest flat figure, which
is not accurate and is far more accurate than the nothing that
would otherwise be recorded.

### And the honest option: do not weigh anything

Kitchen scales are rare in most Bangladeshi kitchens and
unpopular in most British ones. Weighing food is the most
accurate method and it is the method most people abandon.

**So hand portions are a first-class input**, not a fallback:

| | |
| --- | --- |
| a palm | a protein portion |
| a cupped hand | a carbohydrate portion |
| a fist | vegetables |
| a thumb | fat |

The hand scales with the person, which is the property that makes
it work. It is roughly 20% accurate rather than roughly 5%
accurate, and 20% accurate every day for a year beats 5% accurate
for eleven days. The tool says that in one sentence and then gets
out of the way.

### Where each of these is, now that they are built

All four are live. This table is here because a section
describing four features without saying which of them exist is
the failure at the top of `CLAUDE.md` wearing a plan's hat.

| | |
| --- | --- |
| the oil calibration | `oilPerMeal()` in `shared/diet.ts`, asked once a month on `/tools/diet/foods`, three columns on `diet_profile` |
| the shared pot | `next/lib/recipes.ts` and the second half of `/tools/diet/recipes`. `diet_foods.kind` is `pot`, `parts` is what went in it, `serves` is how many ate |
| a share of it | two whole numbers, `took` out of `outOf`, so a third is an exact third. A FRACTION would have had to reach `diet_entries.qty`, which is `numeric(9,2)`, and 0.33 of every pot is one percent light for ever, in the flattering direction |
| cooked against raw | in the name of every rice, dal and grain row in `shared/foods.ts`, in both languages, with `raw` on the row |
| eating out | `widened()` and `outRange()` in `next/lib/recipes.ts`, offered in the food picker, written to `diet_entries.est_low` and `est_high`. The width is a fifth either way, which is this section's own 700 to 1,100 generalised |
| small extras | one tap in the food picker, 150 kcal with 60 to 240 on it, logged as a range for the same reason a plate is |
| hand portions | four chips beside the amount box, wherever the row states what its own portion weighs. A row that does not say refuses a hand rather than guessing one |

`next/recipes.test.ts` is the guard for the pot, the share, the
range and the hands: 136 checks, no browser.

**The one thing still to draw is the day's own width.**
`DayTotal.spread` in `shared/diet.ts` adds up every entry's
`est_high` minus its `est_low`, and it has been able to since the
day it was written. A day with two restaurant meals in it should
be drawn with a wider band, the same way a sparse micronutrient
day is drawn faintly, and until something reads that field the
honest half of eating out is stored and never shown.

---

## 15. Nutrition beyond calories, and how honest it can be

Calories decide the weight. Everything in this section decides
whether the weight you keep is muscle, whether you feel well
enough to carry on, and whether a year of this leaves you short
of something.

### The honesty problem, first

Micronutrients cannot be estimated from a number of calories.
They come from knowing what was actually eaten, and this tool has
a curated portion library rather than a food database, `§22`. So:

**Every micronutrient figure is shown with its coverage.** "Iron:
about 9 mg, from 62% of today's food." The other 38% was free
entry with no composition attached, and pretending otherwise
would be the worst thing this tool could do, because a confident
number that is missing a third of the day is more dangerous than
no number.

Coverage under about half, and the panel says the day is too
sparse to read rather than drawing a bar.

### What is worth tracking, and why each one is on the list

Not everything. A list of forty nutrients is a list nobody reads.
These earn their place because they are the ones that actually go
wrong for this tool's two readerships, on the diets it supports.

| | why it is here |
| --- | --- |
| **protein** | already a floor in `§5`. Tracked per meal as well as per day, because distribution matters for keeping muscle |
| **fibre** | 25 to 30 g. Low on almost every deficit and very low on keto, and it is the single thing most likely to make somebody feel unwell without knowing why |
| **sodium, potassium, magnesium** | the keto three from `§7`. Also the ones a very low carb diet strips fastest, and sodium is the one a Bangladeshi diet is most likely to be high in already |
| **iron** | anaemia is common among women in Bangladesh, and a deficit plus less red meat makes it worse. Tracked with vitamin C alongside, because non-haem iron absorption roughly doubles with it and that is an actionable pairing rather than a fact. Tea with a meal works the other way, which is worth knowing in a country that drinks tea with meals |
| **calcium and vitamin D** | UK winter genuinely runs short: the NHS advises supplementing October to March. In Bangladesh the sun is not the problem, but indoor work and covering clothing can be, so the tool asks rather than assumes |
| **B12** | vegetarian and vegan diets, which are common in both places for different reasons |
| **iodine** | Bangladesh's salt is iodised and that is the main source, so a low sodium push can quietly take iodine with it. Worth one line rather than a bar |
| **zinc and folate** | both fall on restricted diets, both cheap to mention |
| **water** | logged, not calculated. On keto it matters more, and the reason is in `§7` |

### Saturated fat, and the one place the tool takes a position

Keto raises saturated fat intake for most people who try it, and
what that does to a lipid panel varies enormously between
individuals. The tool does not tell anybody what to eat. It does
two smaller things: it tracks saturated fat as a share of total
fat where the portion library knows it, and it puts a lipid panel
in `§20` so that the answer for **this** reader can be a
measurement rather than an argument on the internet.

That is the pattern for every contested nutrition question here.
Where the evidence is genuinely split, the tool logs the thing
that would settle it for this person and declines to settle it in
general.

### What it will not do

No RDA scoring out of 100, no letter grades, no green ticks for
"complete". Those imply a precision the data does not have and
turn eating into a test. Each nutrient shows a figure, a range to
aim for, and its coverage.

No supplement recommendations. It can say "this has been under
the range most days for three weeks", which is a fact about the
log. What to do about it is a conversation with a clinician, and
the page says that.

---

## 16. Food insights, which are patterns and never diagnoses

The log is worth more than the running total. These are the
readings that come out of it, all of them descriptive.

**Where the calories actually are.** The top handful of foods by
contribution over the last month, which is almost always a
surprise, and almost always three items. This is the most
actionable thing in the tool and it costs one sort.

**Which days go over.** Grouped by weekday. A Friday that is
consistently 700 kcal above the rest is a fact worth seeing
rather than a failure worth hiding, and it is usually a routine
rather than a lapse.

**How protein is spread.** Total protein hit with 80% of it at
dinner is not the same as the same total spread over three meals.
The tool shows the split.

**What a swap would do.** From the portion library only, and
arithmetic only: "half the rice for the same dal is about 140
kcal". It never suggests a different cuisine, never says a food
is bad, and never proposes anything not already in the reader's
own log.

**How full a hundred calories is.** For every item in the portion
library, protein and fibre per 100 kcal, sorted. That is a
descriptive property that ranks foods by how long they hold you
without ever calling one of them bad, and it is the honest form
of every "good food, bad food" list ever written.

**How this week compares to the reader's own average**, never to
anybody else's. There is no leaderboard and no cohort.

**Adherence against the trend.** The one place the log and the
weight meet: weeks where the target was held plotted against what
the trend did. That is the evidence for whether the target is
right, and it feeds the stall reading in `§4`.

**What this reader's own deficit actually does.** After a few
months there is enough data to say: the last time you held about
500 under, the trend fell 0.4 kg a week, not the 0.5 the
arithmetic predicted. That is a personal calibration constant,
and it is better than any equation in `§3` because it is measured
on the only body in question.

**A year in one page.** Twelve months of trend, phases marked,
the seasons from `§18` visible, weight at the start and the end,
and the total logged days. Once a year, and it is the thing
somebody actually keeps.

### The rule these all obey

**A correlation is described, never explained.** "Your heavier
days are usually Fridays" is a fact. "Fridays are ruining your
progress" is a judgement, and this tool does not make them. The
routine tool's no-shame rule from `§1` applies to every sentence
generated here, and it is worth a check of its own: the generated
sentences come from a small, listed set of templates, and the
check reads that list.

### What is built

`shared/insights.ts` is the arithmetic and
`next/components/diet/insights-panel.tsx` draws it, on
`/tools/diet/nutrition` beside `§15`, out of the same fetch that
page already makes. That file holds `§17`'s money, `§18`'s one
sleep reading and `§19`'s two about movement as well: they are
all readings out of a log and they all obey the rule below. Eight of the nine readings above are there:
where the calories are and which days go over were already on
that page, and the protein split, the swap, protein and fibre per
100 kcal, this week against the reader's own average, adherence
against the trend and the deficit calibration landed with the
panel. Every one of them prints the span it was measured over and
how many days of that span were written down, and every one has a
sentence for having too little data rather than a zero.

**A year in one page is `/tools/diet/year`**, and it is the one
of the nine that is a page rather than a panel, because it wants
the phases from `§10` and the seasons from `§18` on one trend and
neither fits beside a nutrient table. `next/components/diet/year-panel.tsx`
draws it, out of the same three fetches the long view makes.

**The axis is always a year, and that is the empty state rather
than a fallback.** Until the log reaches back a year the axis
starts at the first weighing and runs a year forward, so a reader
three months in sees three months of line, nine months of shaded
year to the right of today, and the seasons already drawn across
the part they have not lived. It is one expression and there is
no threshold in it. The deferral was right that this page can
only draw its own empty state for most of its first year, and
wrong that this is a reason to wait: what a reader needs at three
months is to see the shape of the thing they are filling in, and
a page that will not draw until it is full teaches nobody that
they are on their way.

**It states no rate across the year.** A year almost always
crosses a change of protocol, and `§10`'s rule is that a slope
never does, so the lead figure is the DIFFERENCE between the
trend at each end, said as a difference, and the rates are one
per stretch in a table beneath. Where no protocol has ever been
declared there is no boundary to cross, the year is one window,
and one rate over it is the honest answer rather than a missing
one.

Two things the building of it turned up, both of them the reason
a templated sentence has to be checked rather than written:

- **The deficit calibration is a circle unless the burn it is
  compared against comes out of the equations.** `learnedBurn()`
  derives maintenance FROM the trend, so a prediction made with
  that figure and then checked against the trend comes back at a
  hundred percent, for everybody, every time, and nothing about
  the page would look wrong. It is compared against Mifflin plus
  the activity answer, which knows nothing about the weighings.
- **A swap finder offers raw rice for cooked rice.** Both are
  staples, both are weighed, and one is 365 kcal per 100 g
  against the other's 130, so it is the largest saving in any
  Bangladeshi log and it is the cooking water printed as advice.
  `swaps()` refuses a pair whose `raw` flags differ.

---

## 17. What food costs, which is the one question this site is already for

This is a personal finance site. It teaches money in Bangla, it
has a school called টাকা ও শেয়ার, and it holds a portfolio tool
and a stock model. **A diet tool here that never mentions money
would be the one place on the site where the obvious question
does not get asked**, and it is a question almost no diet app
answers because almost no diet app is on a site like this one.

### Cost per calorie, and cost per gram of protein

Two numbers, and the second is the one that changes behaviour.
Protein is the expensive macronutrient and the one with a floor
in `§5`, so "what is the cheapest protein I will actually eat" is
a real optimisation with a real answer, and the answer is
different in Dhaka and in Manchester:

- **Bangladesh**: eggs, dal, small fish, chicken, milk powder,
  compared per 100 g of protein in ৳.
- **UK**: eggs, milk, tinned fish, chicken thigh, own-brand
  yoghurt, dried lentils, compared per 100 g of protein in £.

The library carries a price per portion for each place, marked
with the month it was last checked, because **a price is a fact
with a date on it** and an undated price is worse than none. Out
of date by more than a few months and the figure is shown greyed
with its date, not silently.

### A food budget, which is a budget like any other

The reader can set a weekly food budget. The tool then does one
thing with it that no diet app does: **it plots spend against
intake**, and the interesting reading is not the total but the
ratio. Whether a change in what you eat cost money or saved it is
a fact people are simply never shown.

Two of this tool's own recommendations have a price attached and
should be honest about it:

- **Keto costs more per calorie**, in both countries, and
  substantially more in Bangladesh where the staple carbohydrate
  is the cheapest food available. `§7` says this in words and this
  section can put a figure on it from the reader's own prices.
- **A higher protein target costs more**, unless it is met from
  dal, eggs and small fish, which is precisely why the cost per
  gram of protein table exists.

### The thing this connects to

`targets` in the account already holds a goal with a number on
it, of three kinds, and `scenarios` already holds a filled-in
calculator under a name. A food budget is a spending target and a
weight goal is a metric target, and `§30` is where those wires
get connected rather than duplicated.

**No affiliate links, no product recommendations, no shopping
list that resolves to a shop.** Prices are reference figures for
arithmetic. The moment this tool recommends where to buy
something it stops being a calculator and starts being an
advertisement, and it will not.

### What is built

The price table on `/tools/diet/foods` was the first half of this
and was there before the second. The second is on
`/tools/diet/nutrition`: a weekly budget written to
`diet_profile.food_budget` and `budget_currency`, the spend
plotted against the intake, and the three ratios, a day, a
thousand calories and a hundred grams of protein. All of them are
over the share of the log this site has a price for, that share
is printed beside them, and under `§15`'s coverage floor nothing
is drawn at all. A row priced in the other currency is not
converted, because an exchange rate is a fact with no date on it.
A price older than six months is drawn greyed with its own date.

**One of the two priced recommendations holds and the other does
not, in the shape it is written in above.** `costByTag()` over
the committed prices puts the middle staple row at ৳66 per 1000
kcal against ৳200 for the middle protein row in Bangladesh, and
£1.03 against £3.59 in Britain. So keto really does cost about
three times as much per calorie, and the page says so with the
two figures beside it. But the multiple is 3.0 in Bangladesh and
3.5 in Britain, so "substantially more in Bangladesh" is not what
these prices say, and it is either that sentence or the prices
that needs correcting.

"A higher protein target costs more" is not a fact about the
protein rows either, and the assertion written for it failed the
first time it ran. Dal is tagged as both a staple and a protein
and rice carries protein, so the middle protein row and the
middle staple row are within a rounding of each other per gram of
protein in both tables. What is true is the SPREAD inside the
group, which is what the page prints instead: ৳59 per 100 g of
protein at the cheap end, which is mug dal, against ৳455 for the
middle of the priced rows that carry protein, about eight times.
That spread is the whole reason a cost per gram of protein table
is worth having.

**Still not built**: the wire to `targets` in `§30`, so that a
food budget is a spending target of the account's rather than a
column of its own; and `diet_foods.price`, which is what a dish
somebody cooked themselves cost.

---

## 18. The body has a calendar, and ignoring it makes the tool wrong

Every number in `§4` assumes the reader is the same person from
week to week. They are not, and the ways they are not are
predictable, which means they can be handled rather than absorbed
as noise.

### The menstrual cycle

Water retention in the luteal phase is commonly half a kilo to
two kilos, appetite rises, and resting metabolic rate is modestly
higher, on the order of 5 to 10 percent. **The net effect on the
scale is an apparent stall in the second half of every cycle,
followed by a drop that looks like a whoosh and is not.**

This makes a large fraction of women quit a diet on a schedule,
and it is invisible in every tracker that treats a month as four
identical weeks.

So, optionally and only if the reader turns it on: a cycle start
date, and then

- the trend is compared **cycle to cycle** as well as week to
  week, which is the comparison that actually removes the
  artefact,
- a flat trend inside the luteal phase is not reported as a
  stall,
- and the phase is drawn on the chart, faintly, so the pattern
  becomes visible rather than mysterious.

It is off by default, it is one field, and it is stored like
everything else in `§27`. The tool asks once and never again.

### Sleep

Short sleep raises ghrelin and lowers leptin, which is the
mechanism behind the entirely real experience of being hungrier
all day after a bad night. It also affects the morning weight
directly through hydration and cortisol.

One optional field, hours. The insight it earns is a plain
observation of the kind `§16` allows: on this reader's own data,
days after short nights average so much above target. Described,
not explained, and never turned into a sleep score.

**A ROW'S HOURS ARE THE NIGHT THAT ENDED ON THAT ROW'S MORNING**,
and they pair with that row's OWN intake. It is a decision rather
than an implementation detail, so it is settled here rather than
in three comments, and three things point the same way.

A row is a day and the whole row hangs off one morning:
`weightKg` is that morning's weighing, and this section already
says short sleep "affects the morning weight directly through
hydration and cortisol", which is the same night. Sleep and
weight on one row have to mean one night or the row means two
things at once.

Every importer agrees. Apple Health, Fitbit and Oura all date a
night to the morning it ended, and `shared/csv.ts` maps `sleep`,
`hours slept` and `time asleep` out of exactly those. Pair a
night with the following row and an imported log is a day out
with nothing on the page looking wrong.

And a field on the log form reads "last night", which is that
same night again, so a typed row and an imported row agree by
construction rather than by anybody remembering.

"Days after short nights" still holds and is not a third
convention: the day after the night IS that row, because the
night ended that morning.

`afterShortNights()` in `shared/insights.ts` is the arithmetic
and it is drawn on `/tools/diet/nutrition`, beside `§16`'s other
readings, because what it is a reading ABOUT is intake. It says
two averages with the days each was drawn from, both against the
reader's own target where there is one, and it refuses under five
days on either side of the line. There is no score, no grade for
a night and no target for one. `scripts/insights.test.ts` builds
an alternating fixture and asserts that pairing a row with the
day before or the day after comes out with the OPPOSITE sign, so
a drift in either direction fails loudly rather than looking
correct.

**No form offers hours yet.** The column is fillable only through
the CSV import on `/tools/diet/import`. A field on the log form,
labelled "last night", is the one thing between this reading and
most readers.

### Illness, and the pause that is not a failure

A fever puts water on, an infection takes appetite away, and a
week of either produces trend data that means nothing. **A day
can be marked as ill, and marked days are drawn but excluded from
the slope**, exactly like the keto adaptation window in `§7`.

There is no penalty, no broken anything, and no catch-up target
the following week. The tool's position on a bad fortnight is
that it happened.

### Travel

Long flights cause fluid retention of one to two kilos that
resolves in a few days, a time zone shift moves the weighing
conditions from `§4`, and a fortnight in another country is a
fortnight of food this library does not price. Dhaka to London
and back is a normal journey for this site's reader, not an edge
case. A travel mark does what the illness mark does.

### The seasons, which are different seasons in the two places

| | |
| --- | --- |
| **Ramadan** | the eating window moves to suhoor and iftar. The tool must not nag during fasting hours, must not read an empty afternoon as a missed day, and must not treat the pre-dawn meal as a midnight binge. Morning weight during a fast is largely a dehydration reading and is trended with that said |
| **Eid** | two of them, and the week after each is a refeed in the sense of `§7` rather than a failure. Annotated, not counted |
| **UK winter** | weight rises on average from late autumn, vitamin D falls (`§15`), and daylight ends the outdoor half of `§19`. A December rise is the norm and a tool that treats it as an emergency is wrong about a whole country |
| **Christmas and New Year** | the single most annotated fortnight in the British year |
| **the monsoon and the summer heat** | appetite falls in extreme heat, activity falls in heavy rain, and both move the numbers in Dhaka in a way no Northern European app has ever modelled |
| **Durga Puja, Pohela Boishakh** | food-centred, annotated the same way |

None of these change the arithmetic. They change what a flat
month means, which is what `§4` is deciding, so they belong in
the tool rather than in the reader's head.

---

## 19. Movement, and the stall that is not a stall

### NEAT is the biggest variable in the whole equation

Deliberate exercise is a small and well-advertised part of daily
energy use. The large, variable part is everything else: walking,
standing, carrying, fidgeting, going up stairs. It varies by
hundreds of calories a day between two people of the same size,
and, crucially, **it falls quietly during a deficit**. That is
most of what adaptive thermogenesis is in practice.

So a **step count is an input**, typed in or read from whatever
the reader's phone already counts, and it earns its place by
answering a question nothing else can:

> Your trend is flat and your log has not changed. Your steps
> have fallen from about 8,000 a day to about 4,500 over the same
> three weeks.

That is the fourth stall from `§4`, it is entirely invisible
without the step field, and it has the easiest fix of any of
them.

### Training, and the case where the scale is simply the wrong instrument

Somebody starting resistance training in a deficit, especially at
a higher starting body fat, can add muscle while losing fat. The
scale barely moves for weeks. Every tracker in the world calls
that a stall, and it is the opposite.

**This tool can see it, because it has the tape from `§2`.** A
flat weight with a falling waist is recomposition, and it gets
said in those words:

> Weight has not moved in four weeks. Your waist has fallen 3 cm
> over the same period. That is very likely a change in what the
> weight is made of rather than a stall.

That single reading justifies the whole measurement set on its
own.

### What it will not do

**No exercise calorie database, and exercise calories are never
added to the target.** Two reasons, both firm. The published
figures for calories burned in an activity are wildly optimistic,
routinely by a factor of two. And eating back an overestimated
burn is the single most reliable way to erase a deficit while
believing you are in one. The learned TDEE in `§3` already
contains this reader's real activity, whatever it is, without
anybody having to estimate a burn.

Training is logged as **what was done**, not as calories: type,
duration, and how hard it felt. That is enough to draw the
association in `§16` and it does not pretend to an accuracy that
does not exist.

**No heart rate, no VO2 max, no recovery score.** Those need a
device this tool does not talk to and produce numbers this tool
could not check.

### What is built

`shared/activity.ts` is what a step is worth: `stepsKcal()` and
`stepsKgPerWeek()`, the two ranges kept apart until the last
multiplication, `stepBase()` for the reader's own middle day and
`stepShift()` for one window against the one before it.
`next/components/diet/forecast-panel.tsx` draws the fortnight and
what more walking would do to the forecast.

**The fourth stall is a KIND**, not only a reading. `stall()`
takes `stepsThen` and `stepsNow`, both medians out of
`stepShift()`, and reports `moved-less` where the walking has
fallen. It sits second in the order, behind a falling waist and
ahead of a drifted target, because the order is confidence rather
than likelihood: a waist is measured on the reader, a fall in
walking is two medians off the log, and a drifted target is a
burn this tool inferred.

**Both tests have to pass or neither counts**, and that is the
part worth not undoing. A fifth off 2,000 steps is 400 steps and
about ten kilocalories, which is not why anybody stalled; a
thousand off 20,000 is not a change of habit. Medians and never
means, because one 25,000 step day in a month of 4,000s is a
wedding.

Two readings in `shared/insights.ts` finish the section, both on
`/tools/diet/habits`:

- **`movement()`** is the same three facts as a reading rather
  than a verdict: the walking, the trend and the logged intake
  over ONE window and the window before it. The window is
  `STALL_DAYS`, the same three weeks `§4` reads a stall over, so
  the three readings are about the same days. `flat` is a
  statement about the rate's interval spanning zero and nothing
  else. It refuses under seven days with a step count in either
  half.
- **`tape()`** is the reading that justifies the measurement set:
  every site the log carries, first reading against last over four
  weeks, beside what the trend did over the same four weeks. It
  needs two readings of one site a fortnight or more apart, it
  says which changes are larger than the centimetre a tape can
  resolve, and it draws whether or not a stall was detected,
  because a reader who is not stalled still cannot read this out
  of a weight.

`TAPE_RESOLUTION_CM` is that centimetre, exported from
`shared/diet.ts` and read by both `stall()` and `tape()`. Two of
them is a page saying a waist has moved beside a page saying it
has not.

**One thing in this section is still not built**, and it is
deliberate: training, as type, duration and how hard it felt.
There is no column for any of the three, so it is a migration, a
form and a release rather than a reading, and a reading built on
a column nothing writes is a decoration.

---

## 20. The numbers a clinic gives you

Twice a year somebody has blood taken and is handed a sheet of
numbers they cannot read, which then goes in a drawer. Those
numbers are the only objective measurements in this entire tool,
and putting them on the same axis as the trend is close to free.

| | why it is worth a row |
| --- | --- |
| **blood pressure** | the thing weight loss improves fastest and most reliably. Two numbers, a home cuff, and it responds within weeks |
| **fasting glucose and HbA1c** | Bangladesh has one of the highest diabetes prevalences in the region and much of it is undiagnosed. HbA1c is a three-month average, which is exactly the timescale this tool works on |
| **lipid panel** | total, HDL, LDL, triglycerides. The panel that answers the keto argument in `§7` for this particular reader rather than in general. Triglycerides in particular move fast with carbohydrate and with weight |
| **liver enzymes** | fatty liver is extremely common at these body compositions and improves with loss, and ALT is the number that shows it |
| **haemoglobin and ferritin** | the other half of the iron paragraph in `§15`, and the one that turns "am I short of iron" from a guess into a measurement |
| **thyroid** | because an underactive thyroid is a real explanation for a real stall, and because it is the explanation people reach for when it is not the explanation. A logged TSH settles it either way |
| **vitamin D** | UK winter, `§15` |

**The tool prints reference ranges and nothing else.** No
interpretation, no colour coding of an out-of-range value, no
"your risk is". It plots the number against the trend and against
the date, and it labels the range the lab gave. Everything past
that point is a clinician's job and the page says so in the same
sentence that offers the field.

Units differ between the two countries for glucose and
cholesterol (mmol/L in the UK, and mg/dL is common on
Bangladeshi lab reports), so both are accepted and both are
stored with the unit they were entered in, converted for display
only. **A number stored without its unit is a number that will be
wrong exactly once, catastrophically**, and this is the one place
in the tool where that could happen.

---

## 21. Medicine that changes the arithmetic

Several very ordinary medicines change what this tool's equations
mean, and a tracker that does not know about them silently
produces wrong readings and lets the reader conclude something
about themselves.

This is not a drug database and it does not interact with
anything. It is a short list, each with a plain sentence about
what it does to the numbers **on this page**, and a line saying
that nothing here is a reason to start, stop or change a dose.

| | what it does to what this tool shows |
| --- | --- |
| **GLP-1 agonists** (semaglutide, tirzepatide, liraglutide) | intake falls a long way without effort, so the log stays honest while the deficit gets large by itself. Two consequences: the protein floor in `§5` matters more, not less, because loss on these drugs carries a real muscle share; and the learned TDEE in `§3` still works and is the best available check that the deficit has not become extreme |
| **thyroid replacement** | changes BMR directly. A dose change invalidates a learned TDEE, and the tool offers to restart the fourteen day window rather than averaging across it |
| **corticosteroids** | appetite up, fluid retention up. The scale can rise several kilos in a week with no change in fat, which is a `§4` water artefact with a cause worth naming |
| **some antidepressants and antipsychotics** | weight gain is a well documented effect of several. Naming it stops a reader concluding their metabolism has broken |
| **beta blockers** | slightly lower resting energy expenditure and blunted exercise heart rate, which matters mostly because it makes perceived effort a better guide than a heart rate anyway (`§19`) |
| **insulin and sulfonylureas** | a calorie deficit changes glucose control quickly, which is precisely why this row exists: the dose that was right last month may be too much this month. **This is the strongest "speak to your doctor first" in the whole file** and it is printed before any target is offered to somebody who has ticked this box |
| **diuretics** | make weight readings and the electrolyte notes in `§7` unreliable in different directions |
| **hormonal contraception** | changes or removes the cycle pattern in `§18`, which is worth knowing before drawing a phase on a chart |

It is one optional set of checkboxes, stored like everything else,
and its only effects are the sentences above and the warnings in
`§31`. **The tool never adjusts a number because of a medicine.**
Adjusting an equation for a drug would be practising medicine
with arithmetic; saying what the drug does to a reading is
explaining a chart.

---

## 22. Two countries, one tool

**Units.** Kilograms and centimetres by default. The UK also uses
stone and pounds, and feet and inches, so both are offered and
the choice is stored. Stone is displayed as `12 st 4 lb`, never
as a decimal, because `12.3 st` is a number no British person has
ever said out loud.

**Energy** is kcal in both places, which is what everyone
actually uses, with kJ available because UK labels carry it.

**Food.** No database. A **portion library** instead: a short list
per place of the things people actually eat, each with energy,
macros, the micronutrients in `§15` where they are known, and a
price with a date on it from `§17`.

- Bangladesh: cooked rice by cup, roti, dal, hilsa and other
  small fish, chicken curry, egg, sugared tea, muri, khichuri,
  mishti, cooking oil by tablespoon.
- UK: a slice of bread, a supermarket chicken breast, semi
  skimmed milk, porridge oats, a banana, tinned tuna, a
  supermarket meal deal, a pint.

Every figure carries a source note, and everything else is free
entry: kcal, and macros if the reader wants them.

**Two libraries, and only one gets downloaded.** The place is
known before the page renders, so the other country's library is
a dynamic import that never happens. A reader in Dhaka should not
pay for a list of British supermarket sandwiches to look up a
plate of rice.

**Both languages, on every item.** The site's rule is that a
Bangla reader should never have to read English to find out that
something exists in their own language, and a food list is the
most literal possible case of that: `ভাত (রান্না করা), ১ কাপ`
and `cooked rice, 1 cup` are the same row.

**A label reader, because labels are the one reliable source.**
UK packaging is per 100 g and per portion by law, so a small
form that takes per-100 g figures and a weight and returns the
portion is the fastest accurate entry path that exists, and it
requires no database at all. Bangladeshi packaging is less
consistent and often absent, which is the reason the portion
library leans local and the label reader leans British.

**The reader's own foods outrank both.** Anything entered twice
is offered as a saved item, with the reader's own numbers, and a
reader's own item always sorts above the library's. After a
month, most logging is three taps on things the reader defined.

**Ramadan** changes the eating window rather than the arithmetic,
and `§18` is where it is handled.

---

## 23. Two languages, one switch

The site's rule is that a Bangla reader should never have to read
English to find out that something exists in their own language.
This tool will be the largest body of explanatory prose on the
site outside its schools, so the rule bites hardest here.

**One switch, at the top of every page in the tool, and it
changes everything on the page**: the labels, the food names, the
explanations, the sentences generated in `§16`, the numerals, and
the names of the units.

**It is `tool-lang`**, the key the calculators have used since
long before there were accounts, carried between devices by
`sync.ts` under `reader-prefs`. Not a second key, not a second
switch, not a second copy of that logic. One choice, one key, and
a reader who set the stock check to Bangla arrives here already
in Bangla.

**Bangla numerals inside `[lang="bn"]`**, out of the one `bnNum`
in `shared/`, which had a Devanagari bug once and does not need a
second implementation to have it again.

**No transliterated jargon where a Bangla word exists.**
"ক্যালোরি" is a borrowed word genuinely in use and it stays.
"টিডিইই" is not a word: it is four English letters written in
Bangla script, and putting it on a page would be exactly the
failure this rule exists to prevent. Where a concept has no
everyday Bangla word, it is explained in a phrase rather than
spelled out phonetically.

**A glossary, in both, linked from the first use of each term.**
BMR, TDEE, NEAT, glycogen, ketosis, adaptive thermogenesis,
WHtR, FFMI, net carbs, resistant starch, the luteal phase,
HbA1c. A tool that uses those words without defining them is
written for people who already know, and this site is not for
those people.

### Every number can explain itself

Any figure, on any page, opens a short panel: the formula, the
inputs it was given, where those came from, and how wide its
error is.

That is the stock check's personality applied here, and it is the
only honest way to show somebody a number about their own body
that they did not compute. **The alternative is asking a reader
to trust a website**, which is precisely what `§1` refuses to do
anywhere else in this file.

---
## 24. The dashboard, and the widgets on it

`/tools/diet` is the page somebody opens once or five times a
day, and it has two jobs that pull in opposite directions:
**doing** (log a weight, log a meal) and **reading** (how is this
going). One column cannot serve both.

**On a wide screen, two columns.** The log is on the left,
because it is what the reader came to do. The dashboard is a rail
on the **upper right**, because it is what they came to see and
it is the first thing in the eye's path on the way to the log.

**On a phone, three bands**: a compact strip of the three numbers
that matter today, then the log, then the widgets. Nothing is
hidden behind a tab that the wide layout shows, because a phone
reader is not a lesser reader.

### The widgets

Each one is a small self-contained panel and each one answers
exactly one question.

| | answers |
| --- | --- |
| **today** | how much is left, drawn as a ring rather than a bar that can fill up and go red |
| **trend** | the trend as a sparkline with the scale faint behind it, and this week's number |
| **stage** | `§11`'s card: which week, what is expected, one next thing |
| **learned maintenance** | `§3`, with its confidence, and how far it has moved since the start |
| **protein** | against the floor, because it is the one macro with a floor |
| **the body** | waist and WHtR, and when they were last measured |
| **nutrients** | `§15`, with coverage, showing only what is currently short |
| **cost** | this week against the budget, `§17` |
| **movement** | steps, and the seven-day average `§19` reads |
| **water** | a tap per glass |
| **the window** | for anybody fasting: where you are in it, as a clock face. A display, never an alarm |
| **the strip** | the last fourteen days as fourteen small marks: logged, weighed, both, neither |
| **quick add** | copy yesterday, your usuals, barcode, search. `§13` |
| **ketones and electrolytes** | only on a keto phase, `§7` |

**The reader arranges them**, and the arrangement is stored with
everything else. Somebody on keto wants ketones and electrolytes
at the top; somebody lifting wants protein and the waist;
somebody in maintenance wants the trend and almost nothing else.

### The rules for the board, because this is where discipline dies

- **Every widget is legible with no data.** Not a spinner, not an
  empty box, not a zero: a sentence saying what it will show and
  when, out of `§9`'s unlock table.
- **Nothing on it goes red and nothing counts down.** `§31`.
- **A widget is a link.** Whatever it summarises has a page, and
  pressing it goes there. A number with no way through to its
  working is a decoration.
- **The board renders on the server**, and the interactive parts
  hydrate on top of something that was already correct. `§28`,
  and the reason is the day every calculator on this site was
  blank.
- **A widget with nothing to say hides itself.** Ketones off
  keto, cost with no budget, the fasting clock outside a fasting
  protocol. A board of empty panels reads exactly like a broken
  page, which is the rule `/admin` already exists under.
- **The board is not the tool.** Everything on it is a summary of
  a page that says it properly, and no reading exists only as a
  widget.

---
## 25. The page you take to a doctor

A GP appointment in the UK is ten minutes. A consultation in
Dhaka is often shorter and frequently the first time anybody has
seen this person's numbers over time. In both cases the patient
arrives with a memory and leaves with a guess.

**One page, printable, on A4, with no chrome on it:**

- who and when: age, sex, height, the date range it covers.
- the trend: start, current, the slope, drawn once, in black.
- the tape: waist, WHtR, and the composition estimate with its
  range and the name of the method that produced it.
- intake: mean, and the learned TDEE with its confidence.
- the clinic numbers from `§20`, each against its own reference
  range and the date it was taken.
- medicines ticked in `§21`, listed plainly.
- and a single line at the top saying this was produced by a
  calculator from self-reported data, so that nobody reads it as
  a clinical record.

It is the least glamorous feature in this file and it is
plausibly the most useful one. It is also nearly free: every
number on it already exists, and the whole page is a print
stylesheet and a layout.

**It never leaves the reader's control.** No email, no share
link, no upload. A print dialogue and a page, and if they want a
file, the export in `§30` already exists.

---

## 26. Getting in, and getting out

### The first ninety seconds

A first screen of thirty fields is a tool nobody finishes setting
up. **Four questions, and then a number**: height, weight, age
and which formula to use. That is enough for a BMI, a BMR, an
estimated maintenance and a first target, and the reader has
something true before they have decided to trust anything.

Everything else is asked **when it would change an answer**, and
never before:

| asked | when |
| --- | --- |
| the tape | when body fat is first offered, not at sign-up |
| ancestry | at the first BMI, because it changes the cut-off, and the page says so there |
| the place | at the first food search or the first price |
| a goal and a rate | on the goal page, once there is a maintenance figure worth setting a rate against |
| medicines, the cycle, clinic numbers | never asked. They are offered on their own pages and the whole tool works without any of them |

**And the weight half can be skipped entirely.** A reader who
wants to log food and nothing else gets `§15` and `§16` with no
weight field at all. That is the same mode `§31` requires for a
completely different reason, and building it once serves both.

### Arriving from another app

"Leaving should be as easy as arriving" is already this site's
rule about accounts. **The reverse is what stops somebody
arriving at all**: a reader with three years of data elsewhere is
being asked to abandon it.

A CSV importer with column mapping, which is all this needs.
MyFitnessPal, Cronometer and LoseIt all export CSV; Apple Health
and Google Fit export weight; a Withings, Renpho or Xiaomi scale
exports a file of readings. Anything else is a file, a preview of
the first rows, and a screen that maps columns to fields.

**The preview screen is the whole feature.** An importer that
guesses silently is an importer that fills a year of somebody's
history with the wrong column, and the reader finds out in March.

Imported rows are marked with their origin, so an imported year
and a logged year can be told apart, and a bad import is undone
as one operation rather than three hundred.

### Leaving

The site's rule, unchanged: one JSON file with all of it, and an
erase that removes all of it. `§30`. **The importer reads the
exporter's format**, so this tool can be left and returned to,
which is the only real test of whether an export is honest.

**Built, and the test had been failing quietly.**
`aab/src/account-page.ts` has written all six diet tables into
that file since the day those tables existed, and the importer
read CSV and nothing else, so a reader could take their whole
account away and bring none of it back. Both halves worked
perfectly on their own, which is exactly why nothing said so.
`shared/bundle.ts` reads it now and `/tools/diet/import` takes a
`.json` beside a `.csv`.

**Two of the six come back, and the schema is what decides
which.** `diet_days` and `diet_entries` are the tables carrying
an `origin` column, and `origin` is the only thing that makes
"undone as one operation" above possible. A table this cannot
offer to undo is a table it does not write, so the other four are
NAMED on the preview screen with the reason rather than dropped
silently: a copy that quietly restores two thirds of an account
is worse than one that restores a third and says which.

`diet_profile` would be refused even if it grew the column, and
it is the one worth writing down. It is a single row holding a
reader's height, their medicines and whether they track a cycle.
A file written over it is destructive in the one direction nobody
notices: every page still renders, with somebody else's body in
it.

**Neither the file's `user_id` nor its row ids are carried**, and
`scripts/bundle.test.ts` asserts both as ABSENCES, which is the
only way to assert one. A foreign `user_id` is refused by row
level security silently, so the page would report a successful
import of nothing; a carried row id either collides with a live
row or resurrects a deleted one. The same test reads the origin
column list out of the migration and the table list out of the
exporter rather than repeating either, so a seventh table cannot
appear at one end and go unnoticed at the other.

### And offline, because Dhaka

The network is not dependable everywhere this will be used, and a
log that fails silently when the connection drops is a log that
loses somebody's dinner.

**A queued write is not a local copy.** `§27` says the account is
the record and there is no mirror, and that stands: what is held
here is a **request that has not gone yet**. It is shown to the
reader as pending, retried when the connection returns, and gone
the moment it succeeds. It is never read back as data, it never
answers a query, and nothing renders from it except its own
pending state. That distinction is the whole reason this does not
reopen the argument `sync.ts` settled.

---
## 27. What gets stored, and where

In Supabase, behind the same row level security everything else
uses, and **no local copy**. The precedent is exact and
deliberate: `public.routine_entries` is one row per person per
day with `unique (user_id, entry_date)`, read by the browser as
the reader.

This shape does not belong in `aab/src/sync.ts`. Every key in
that table is a `set`, a `mark` or a `count`, and a daily log is
none of the three: merging two devices means union by date with
the newer row winning per day, which is a table's job and not a
merge rule's. Progress has a local copy for a historical reason
that does not apply here, and `targets` and `scenarios` already
show what account-only storage looks like.

```sql
public.diet_profile   -- one row per person
  user_id, sex, birth_year, height_cm,
  place ('bd' | 'uk'), ancestry, units ('metric' | 'imperial'),
  activity, goal_kind ('lose' | 'maintain' | 'gain'), goal_rate,
  goal_waist_cm, goal_weight_kg, band_low_kg, band_high_kg,
  cycle_tracking, meds text[], food_budget, budget_currency,
  oil_ml_week, oil_people, oil_meals,
  board jsonb,          -- which widgets, in what order (§24)
  onboarded_at, updated_at

public.diet_days      -- one row per person per day
  user_id, entry_date, weight_kg, kcal,
  protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ketones_mmol, steps, sleep_hours, water_ml, hunger,
  waist_cm, hip_cm, neck_cm, chest_cm, thigh_cm, arm_cm,
  marks text[],   -- 'ill', 'travel', 'refeed', 'off-protocol'
  tags  text[],   -- the fixed journal set (§11)
  note, origin,   -- 'logged' | 'import:<what>', for §26
  unique (user_id, entry_date)

public.diet_entries   -- one row per food logged, and per food planned
  user_id, entry_date, meal, at_time, label, label_bn,
  qty, unit, kcal, macros jsonb, micros jsonb,
  est_low, est_high,        -- a range, for food eaten out (§14)
  planned bool,             -- a week's plan is the same rows, dated ahead
  source ('library' | 'own' | 'off' | 'fdc' | 'label' | 'free' | 'recipe'),
  source_id, fetched_on,    -- what it was copied from, and when (§12)
  origin

public.diet_foods     -- the reader's own items, pots and recipes
  user_id, label, label_bn, qty, unit, kcal, macros jsonb,
  micros jsonb, price, currency, priced_on,
  kind ('item' | 'pot' | 'recipe' | 'meal'),
  parts jsonb, serves,      -- a recipe is parts and a yield (§13)
  uses, last_used,          -- what makes something one of "your usuals"
  source, source_id, fetched_on, updated_at

public.diet_phases    -- what protocol was running, and when
  user_id, started_on, ended_on, style, note

public.diet_labs      -- the clinic numbers, and their units
  user_id, taken_on, marker, value, unit, ref_low, ref_high
```

Six tables and every one of them earns it: a day is a day, a
meal is a list, a food is reusable, a phase is a span, a lab
result has a unit and a reference range, and a profile is one
row. Folding any pair together would mean nulls in most columns
of most rows, which is the shape that makes a query lie.

**A plan is not a seventh table.** A planned meal is an entry
with a future date and `planned` set, which means the week's plan,
the shopping list and the planned-against-eaten reading in `§16`
all come out of rows that already exist, and a plan becomes a log
by clearing one flag.

**None of the reader's data goes through a Worker.** The browser
reads and writes as the reader, with the reader's own bearer,
exactly as the routine tool does. This project holds no
service-role key and this tool is not a reason to start.

**The one thing that does is food search**, and only food search:
`/api/diet/food` in `functions/api/diet/`, for the four reasons
in `§12`. It is a read-only proxy over two public databases. It
never sees a reader's log, it takes no bearer, it writes nothing,
and if it is unavailable the tool still works with the portion
library, the reader's own items and free entry. That split is the
whole of the API surface: **the reader's rows are the browser's,
somebody else's database is the Worker's.**

**The arithmetic is in `shared/`,** so a formula cannot say one
thing in a route and another in a check. The portion library is
data beside it, one file per place.

**Sex** is stored because the equations need it and there is no
honest way around that. It is asked for as "which formula should
this use", with both answers explained, and it is not used for
anything else.

**`meds` and the cycle field are the most sensitive rows in this
database.** They are optional, they are never required to use the
tool, they are covered by the same row level security, and they
appear in the export in `§30` like everything else, because a
person leaving should take all of it.

---

## 28. How a number is written, and how a chart is read

The site already has rules about counting things. This tool
generates more numbers per screen than anything else on it, so
the rules need saying once here.

**Precision follows the measurement, never the float.** Weight to
0.1 kg, because that is what a scale reads. Calories to the
nearest 10 above 1,000, because nothing about a calorie estimate
justifies a units digit. Body fat as a range of whole
percentages. A tool that prints `2143.7 kcal` is claiming an
accuracy of one part in twenty thousand for a number that is
plus or minus twenty percent.

**A range is written as a range**, "26 to 33%", not "29.4% ±
3.5". The first is read correctly by everybody and the second is
read as 29.4 by almost everybody.

**Bangla digits inside `[lang="bn"]`**, from the same `bnNum` the
rest of the site uses. Not a second copy of that function: the
one in `shared/` that already had a Devanagari bug once.

**Nothing is red and nothing is a grade.** Over target is drawn
in the same weight as under target. `§31`.

### Charts

The trend chart is the only genuinely new drawing on this site,
and there are four rules for it.

- **It renders on the server**, as an SVG built from the rows,
  with no client library and no canvas. The data is small (a year
  is 365 points), the shape is a path, and a chart that needs
  JavaScript is a chart that is blank in the one second everybody
  judges a page in. The interactive parts, a hover readout and a
  range selector, hydrate on top of a picture that was already
  correct.
- **It has a table underneath it**, in a `<details>`, and the
  chart carries the table's id in `aria-describedby`. That is the
  whole of chart accessibility and it takes ten lines. A trend
  line that only exists as a path is a page a screen reader
  cannot read at all.
- **Nothing is encoded in colour alone.** The scale readings, the
  trend, the phases and the marked days are distinguished by
  weight, dash and shape first, and by colour second.
- **The y axis does not start at zero and says so.** A weight
  chart starting at zero is unreadable, and a weight chart with a
  clipped axis and no label is a chart that exaggerates every
  wobble. It gets a label.

---

## 29. The pages

| | |
| --- | --- |
| `/tools/diet` | today. The log on the left, the dashboard on the upper right, `§24`. Weight, food, the stage card, the widgets |
| `/tools/diet/you` | the body: measurements, composition, the cut-offs and which set is in use, the tape guide |
| `/tools/diet/goal` | rate, style, macros, the floors, the goal in waist first, and what the projection actually says |
| `/tools/diet/trend` | the long view: trend against scale, learned maintenance over time, stalls, phases, and the calendar from `§18` |
| `/tools/diet/year` | a year in one page: one trend with the phases from `§10` banded across it, the seasons from `§18` along its foot, the days you marked, and what the log holds. The axis is a year wide whatever the log holds |
| `/tools/diet/expect` | `§9`: the arc, this week's expectation against what happened, the shape of a day, and what unlocks when |
| `/tools/diet/log` | the food log in full: search, barcode, recipes, your usuals, the week's plan and the shopping list. `§12` and `§13` |
| `/tools/diet/foods` | the portion library for this place, the reader's own items, and the price table from `§17` |
| `/tools/diet/nutrition` | `§15` and `§16`: the nutrients with their coverage, and the readings out of the log |
| `/tools/diet/journal` | `§11`: the line a day, the tags, hunger, and the symptom table |
| `/tools/diet/health` | `§20` and `§21`: the clinic numbers and the medicines list |
| `/tools/diet/summary` | `§25`, the printable page |

All Next routes under `next/app/(site)/tools/diet/`, components in
`next/components/diet/`, arithmetic in `shared/`. A nav entry in
`shared/nav.ts` under Tools, which is what puts it in the rail,
the footer and the palette at once.

**This many pages is too many to scroll and exactly right to tab
through**, which is a solved problem here:

The number is deliberately not replaced with fifteen. `§29`'s own
table is the list, `DIET_PAGES` is what the strip and the deck
count, and a sentence that states a total beside a table is the
failure at the top of `CLAUDE.md`. Say "this many", or say
nothing.
`next/components/ui/tab-panels.tsx` is the account page's
arrangement, the fragment chooses the panel, and the panels are
built on the server and handed over as a prop. This tool uses it
rather than inventing a second one.

**The dashboard is not one of them and never becomes one.** `§24`
says every widget links to the page that says the thing properly.
The moment a reading exists only on the board, the board has
become the tool and the pages have become decoration.

---

## 30. Where this meets the rest of the site

Nothing in this tool is allowed to be a second copy of something
the site already has.

| | |
| --- | --- |
| **`targets`** | already holds a goal with a number on it, of three kinds: a `course` reads ticks, a `habit` reads `days-active`, a `metric` is typed in because the site cannot see it. **A weight goal is a `metric` today and stops being one the moment `diet_days` exists.** That is not a fourth kind, it is the third kind gaining a source, which is exactly the test the existing rule sets: if the site can measure it, the bar is not a decoration |
| **`scenarios`** | already holds a filled-in calculator under a name. A saved plan here is a scenario, encoded the way the stock check encodes its own, so there is one encoder and a saved plan is a link |
| **the routine tool** | logs `days-active`, which is the same calendar this tool draws on. A day logged here should count as an active day there rather than being counted twice |
| **the export** | "take a copy of everything" is one JSON file with progress, library, targets, scenarios and profile in it. The six tables in `§27` go in it, in the same commit that creates them. An export that silently omits the newest feature is the failure this site keeps a check for |
| **erase everything** | the same, in the same commit, and it is the more important half |
| **`COUNTS`** | if any page says how many tools this site has, it counts them |
| **the money school** | this tool prices food; `/money/` teaches budgeting. A link each way, and no duplicated arithmetic |
| **`tool-lang`** | the calculators' language switch, already carried between devices by `sync.ts` under `reader-prefs`. `§23` uses that key and does not add a second one |
| **the routine tool's mood ribbon** | `moodRibbon()` already exists in `shared/routine.ts` and draws a run of days as a band. `§11`'s hunger and tags are the same shape and use the same drawing |
| **`/tools/live`'s Worker pattern** | one proxy, one credential, one place that meters. `§12`'s food search is that pattern a second time and deliberately not a second design |
| **`bnNum`, `GoCard`, `InfoCard`, `SoonCard`, the tab panels, the chip, the crumbs, the ring** | all of it already exists. This tool writes no new chrome, and `§24`'s widgets are those components arranged, not new ones |

---

## 31. Safety, written before the code

- Every page that prints a target prints, next to it, that this
  is general education and not medical advice.
- No loss goal under BMI 18.5, on either set of cut-offs.
- Under 18: the equations are for adults and the tool says so and
  stops. This is not a soft warning; there is no child mode.
- Pregnancy or breastfeeding: not supported, said plainly.
- Diabetes on insulin or sulfonylureas: the line from `§21`,
  before any target is offered, because a deficit changes a dose
  and only a clinician can change a dose.
- Kidney disease, blood pressure medication, or a history of
  gout: a visible line before keto and before the electrolyte
  note in `§7`, where the general advice is actively wrong for
  those groups.
- A history of disordered eating: the most careful case in the
  file. A calorie tracker is a known trigger. There is a plain
  line offering the weight-free mode below, and the tool does not
  argue with anybody who takes it.
- **A weight-free mode**, which is the honest answer to the line
  above: the log, the nutrition panel and the tape, with no
  weight field, no trend and no projection. Everything in `§15`,
  `§16` and `§19` still works. A tool that can only be used one
  way is a tool that some people should not use at all.
- No shame language anywhere. Not "you failed", not "over
  budget", not red, not a flame, not a notification that a day
  was missed. The streak is the one count and it counts showing
  up: `streak()` says why at length, and it can be read as a
  record rather than as a demand precisely because it never asks
  whether a target was met. The routine tool's rule,
  and it holds here.
- The generated sentences in `§16` come from a listed set of
  templates, and that list is what a check reads. A tool that
  writes free prose about somebody's eating will eventually write
  something cruel.

---

## 32. Stages

Each stage ships. None of them ships a placeholder: an empty
panel that will one day hold something reads exactly like a
broken one, which is the rule `/admin` already exists under.

**The order is chosen so the tool is usable at stage 6 and every
stage after it adds a reason to come back**, rather than so that
the architecture is tidy. A plan that puts every foundation
first is a plan that has nothing to show for four weeks.

| | | |
| --- | --- | --- |
| 1 | **the arithmetic** | `shared/`, a unit test per formula. BMI both ways, WHtR, Navy, Deurenberg, Mifflin, Katch, the time-weighted EMA and the learned maintenance. Nothing renders |
| 2 | **the migration** | the six tables and their policies |
| 3 | **the shell and the switch** | the routes, the tab panels, the language switch on `tool-lang`, and the glossary. `§23`. Everything after this is bilingual by construction rather than by retrofit |
| 4 | **`/tools/diet/you`** | measurements in, composition out. The first page that shows a number, and the first that shows a range |
| 5 | **`/tools/diet`, first pass** | log a weight, log an intake by hand, draw the trend. The server-rendered chart from `§28` |
| 6 | **`/tools/diet/goal`** | the engine, the floors, the waist-first goal, the projection with its interval. **The tool is worth using from here** |
| 7 | **the food log** | `§12` and `§13`: search across the three sources, the source label on every result, snapshot on use, barcode, your usuals, copy yesterday |
| 8 | **`/tools/diet/trend`** | learned maintenance, the under-logging gap, stalls, the four kinds |
| 9 | **`/tools/diet/expect`** | `§9`: the arc, the expectation before the week, the actual beside it afterwards, the unlock table |
| 10 | **phases and settling** | `§10`: a slope that never crosses a boundary, the stacking arithmetic, and the sentence said before a fast rather than after it. The arithmetic landed with stage 1; this is the page half |
| 11 | **the stage card and the journal** | `§11`: where you are, one next thing, the tags, hunger, and the symptom table |
| 12 | **the dashboard** | `§24`: the widgets, the arrangement, and the empty state of every one of them |
| 13 | **the portion library** | both places, both languages, the reader's own items, recipes, meals, and the label reader |
| 14 | **the log corrections** | `§14`: the oil calibration, the shared pot, cooked against raw, ranges for eating out, hand portions |
| 15 | **nutrition and insights** | `§15` and `§16`, coverage first, and nothing drawn under half |
| 16 | **cost** | `§17`: prices with dates, cost per gram of protein, the budget plot |
| 17 | **the calendar** | `§18`: marks, the cycle, the seasons, Ramadan |
| 18 | **movement** | `§19`: steps, and the recomposition reading that needs the tape |
| 19 | **health** | `§20` and `§21`: the clinic numbers, the units question, the medicines list |
| 20 | **the plan and the shopping list** | `§13`, which needs the library and the prices to exist first |
| 21 | **getting in and out** | `§26`: onboarding, the CSV importer with its preview, the export wiring in `§30`, and the offline queue |
| 22 | **maintenance and gaining** | `§6`, last only because it is the phase that comes after all of the above |
| 23 | **the doctor's page** | `§25`, which is a print stylesheet over numbers that all already exist |

**Two things are deliberately not staged at the end**: the
language switch, because retrofitting a second language is twice
the work and never finishes, and the empty states, because they
are what every stage before the last one actually looks like.

---

## 33. What must be checked

A check for every place in this file where a rule could be
quietly broken and the page would still render. That list is
long because most of this file is about numbers that look fine
when they are wrong.

**`scripts/diet.test.ts`**, the arithmetic, needing no browser
and no database, so it runs in CI: every formula in
`shared/diet.ts`, every floor in `§5` asserted from the wrong
side including the gaining direction in `§6`, the sign of the
learned burn from both directions, **no slope ever fitted across
a phase boundary and a stacked protocol shedding less water than
a fresh one** (`§10`, which a naive implementation gets wrong in
the flattering direction), and the cut-off table read back out of
this file so the prose and the code cannot drift.

**`scripts/check-diet.ts`**, for the rules that are about pages
rather than about numbers. It is in `check-all.ts` beside every
other check. Each line below carries its own mark, and the last
two are ones this list did not ask for: a check that turns up a
rule nobody had written down belongs beside the ones that were
asked for.

- ✓ the floors are the ones `scripts/diet.test.ts` asserts, and
  no route recomputes a formula rather than importing it. The
  floors are read out of `target()`'s own body rather than
  listed, so a sixth bound is asked about with nobody coming
  here, and the formulas are compared by SHAPE, with the names
  taken out and the numbers left in. It found three sentences on
  the goal page writing a constant out as a number: the rate cap
  as 1%, the absolute floor as 1200 and 1500, and the
  underweight cut-off as 18.5. Those are the sentences whose
  whole job is to say the tool changed your number, which makes
  them the worst place in the tool for a figure that cannot
  change with it.
- ✓ the Asian cut-off table is used whenever ancestry says so.
  Four shapes of not using it, and none of them looks wrong on
  the page: a fixed ancestry handed to `bmiBand()`, `BMI_CUTS`
  read by name, a body built with a literal ancestry, and a
  cut-off written into a comparison, which is `bmiBand()`
  retyped with one of the two tables missing. And `§2`'s other
  half, that the page says which set it used: a band on its own
  is one word for two readers who are owed different ones.
- ✓ every food in both libraries carries a source and a price
  date, and every rice, grain and pasta row names its state. The
  nouns come out of `§14`'s own sentence, the price is three
  columns that arrive together or not at all, a row in both
  kitchens carries none of them because one number cannot be two
  currencies, and the state has to be in the NAME in both
  languages rather than only in the flag the arithmetic reads. A
  row with no second weight to be confused with, `muri`, is
  named in the check with the reason, and that exemption fails
  when it goes stale.
- ✓ the generated sentences in `§16` and the stage card in `§11`
  come only from the listed templates, and the list contains no
  second person judgement. **The list is derived, never kept.**
  Hundreds of the tool's own sentences written out again inside
  a check would be right on the day they were typed and wrong at
  the next commit, so a template here is what the compiler calls
  one: a template literal with an interpolation and prose in it,
  plus a sentence a condition chooses between two written-out
  ones. `node scripts/check-diet.ts --templates` prints the
  list. What IS written down in the check is the vocabulary of
  judgement, with the section naming each: that is a rule rather
  than a copy of anything. The stage card is not built yet and
  will need no second rule when it is, because the corpus is
  every generated sentence in the tool.
- ✓ the fixed journal tag set is the one in `§11` and has not
  grown a forty-first tag, and the day marks are the ones the
  migration names. Neither column has a CHECK constraint, so the
  check IS the constraint.
- ✓ **no widget in `§24` is defined without an empty state.**
- ✓ **no page prints a target without the disclaimer beside it**,
  in both languages.
- ✓ both language files cover the same keys, so a Bangla reader
  never meets an English fallback string. `§23`. Every `<T>` has
  both halves, and no `aria-label`, `title` or `placeholder` is
  an English string literal.
- ✓ the glossary defines every term the pages use, and every
  entry is linked to from somewhere.
- ✓ and one the list did not ask for: every `diet_*` column in
  `§27` is either filled by the tool or named as not built yet
  with the section that will build it. A column nothing can fill
  breaks nothing, which is why it needed a check rather than a
  paragraph.
- ✓ and a second the list did not ask for: what happens after a
  goal is reached is said ONCE, on the goal page. `§6` puts it
  there and only there, and it is the one sentence in the tool
  that argues for the tool.
- ✓ and a third: `shared/insights.ts` holds no prose. It opens
  by saying that no function in it returns a verdict, which is
  what makes every reading checkable: it hands back the figures
  and a panel chooses the words, in both languages, where the
  template check above can read them. A sentence built in the
  arithmetic is a sentence in one language, on no list, that
  neither the check nor the language switch can reach.

**A `diet.test` under `next/`**, in a real browser, the way
`next/admin.test.ts` drives `/admin`:

- every page renders and every number is computed rather than
  placeholder. A panel that renders and computes nothing looks
  exactly like one that works, which is what
  `next/interactive.test.ts` exists for and this tool is the
  largest surface on the site for it.
- **the language switch changes every string on the page**, not
  the headings only. This is the check that catches the retrofit
  the stage list is ordered to avoid.
- the chart's table alternative and its `aria-describedby`,
  because `§28` is only true if something says so.
- **the stopwatch from `§13`**: a repeat dinner in three
  interactions, a barcode in four, a new dish in under a minute.
- a searched food is copied into the reader's own row rather than
  referenced, and the row keeps its source and fetch date. `§12`.
- the importer shows its preview before it writes anything, and
  an import can be undone as one operation. `§26`.
- the offline queue is never read back as data. `§26`.

**And two that belong to the site rather than the tool:**

- ✓ the export in `§30` contains all six tables and the erase
  removes all six. `aab/src/account-page.ts` does both, and the
  confirm text names the diet log, the medicines and the cycle
  rather than folding them into "everything": a confirm that
  lists five of six things is a reader agreeing to something
  else.
- `COUNTS` in `shared/content.ts` if any page says how many tools
  this site has, because a sentence that counts must count.
