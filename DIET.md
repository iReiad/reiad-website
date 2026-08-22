# The diet tool

`/tools/diet`. A calculator and a log, for one person eating in
Bangladesh or in the UK, who wants to know what their body is
made of, how much it costs to run, how much it costs to feed, and
whether the last three weeks meant anything.

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

**It is not a food database.** Building one is a decade of
someone else's work and a licence fee. What it has instead is a
portion library, `§17`, and free entry for everything else.

**It has no streak, no flame and nothing counting down.** That is
already written down for the routine tool and it matters more
here. A missed day on a diet tracker that shames you is a tool
somebody deletes on the day they most need it.

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
the four things in `§11`. Naming the gap turns an invisible error
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
`§14`: the body moves less, unconsciously and all day. That
matters because it is the one part a reader can do something
about, and because it makes a step count a real input rather than
a vanity metric.

---

## 4. Weight is noisy, and the trend is the only signal

A scale reading is real weight plus a large error term. Daily
swings of one to two kilos come from sodium, carbohydrate and its
glycogen water, gut contents, the luteal phase of the menstrual
cycle (commonly half a kilo to two kilos), unaccustomed training,
alcohol, illness and travel. `§13` is the calendar all of those
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
| **it is not a stall** | trend flat, waist falling | recomposition. `§14`, and the tool can see this one on its own |

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
  will not offer 800 under it.
- the trend rules are identical, and week one still lies: a
  carbohydrate increase refills glycogen and puts one to two
  kilos on the scale in a week that contains no new tissue at
  all. `§7` is that arithmetic run backwards, and the tool says
  so in the gaining direction too.

### The honest sentence about what happens when you stop

On the goal page, once, where the projection ends: most people
regain a meaningful part of what they lose, and the single
strongest predictor of not doing so is continuing to weigh and
log after the goal is reached. That is not a scare and it is not
a sales pitch for the tool. It is the reason maintenance is a
built phase here rather than an empty screen.

---

## 7. Keto, since it was asked for by name

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
- **Ketone level is not a score.** Deeper ketosis is not faster
  fat loss; the deficit is. A reader chasing 3.0 mmol/L is
  chasing a number that measures how much fuel is in the blood
  and not how much fat left the body, and the page says so where
  the field is, not in a help article.

### The things keto is quietly hard on

- **Fibre**, which falls off a cliff when grains and most fruit
  go. `§9` tracks it and this is the main reason it does.
- **Uric acid** rises in the first weeks of both keto and rapid
  loss, which matters to anybody who has ever had gout. One line,
  once, on the diet-style page.
- **Cholesterol** moves in different directions in different
  people, sometimes sharply. That is a reason to log the panel in
  `§15` rather than a reason for this tool to have an opinion.
- **Long-term evidence is thinner than the internet suggests.**
  Keto works for weight loss because it produces a deficit, and
  the head-to-head trials against other diets at matched calories
  and protein mostly land in the same place. The tool supports it
  well and does not sell it.

### The honest sentence about Bangladesh

Rice and roti are the staples. Keto in Dhaka is a much larger
behavioural change than keto in Manchester, and it is more
expensive per calorie, which `§12` can now put a number on. The
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
| **Ramadan** | `§13` | a religious obligation that happens to be a fasting protocol, and the tool treats it as the former |

**Only keto gets the adaptation window**, because only keto has
that water artefact at the scale it has it. A 16:8 window does
not empty glycogen.

**The tool never ranks them.** It shows what each one does to the
macro split and the eating window, and it lets the reader's own
adherence data from `§10` be the argument. The best diet is the
one this particular person actually followed for six months, and
after six months the tool can say which one that was, from the
reader's own log, which is worth more than any table.

---

## 9. Nutrition beyond calories, and how honest it can be

Calories decide the weight. Everything in this section decides
whether the weight you keep is muscle, whether you feel well
enough to carry on, and whether a year of this leaves you short
of something.

### The honesty problem, first

Micronutrients cannot be estimated from a number of calories.
They come from knowing what was actually eaten, and this tool has
a curated portion library rather than a food database, `§17`. So:

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
in `§15` so that the answer for **this** reader can be a
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

## 10. Food insights, which are patterns and never diagnoses

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
the seasons from `§13` visible, weight at the start and the end,
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

---

## 11. The four things that make a log wrong, and what to do about each

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

---

## 12. What food costs, which is the one question this site is already for

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
weight goal is a metric target, and `§22` is where those wires
get connected rather than duplicated.

**No affiliate links, no product recommendations, no shopping
list that resolves to a shop.** Prices are reference figures for
arithmetic. The moment this tool recommends where to buy
something it stops being a calculator and starts being an
advertisement, and it will not.

---

## 13. The body has a calendar, and ignoring it makes the tool wrong

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
everything else in `§19`. The tool asks once and never again.

### Sleep

Short sleep raises ghrelin and lowers leptin, which is the
mechanism behind the entirely real experience of being hungrier
all day after a bad night. It also affects the morning weight
directly through hydration and cortisol.

One optional field, hours. The insight it earns is a plain
observation of the kind `§10` allows: on this reader's own data,
days after short nights average so much above target. Described,
not explained, and never turned into a sleep score.

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
| **UK winter** | weight rises on average from late autumn, vitamin D falls (`§9`), and daylight ends the outdoor half of `§14`. A December rise is the norm and a tool that treats it as an emergency is wrong about a whole country |
| **Christmas and New Year** | the single most annotated fortnight in the British year |
| **the monsoon and the summer heat** | appetite falls in extreme heat, activity falls in heavy rain, and both move the numbers in Dhaka in a way no Northern European app has ever modelled |
| **Durga Puja, Pohela Boishakh** | food-centred, annotated the same way |

None of these change the arithmetic. They change what a flat
month means, which is what `§4` is deciding, so they belong in
the tool rather than in the reader's head.

---

## 14. Movement, and the stall that is not a stall

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
association in `§10` and it does not pretend to an accuracy that
does not exist.

**No heart rate, no VO2 max, no recovery score.** Those need a
device this tool does not talk to and produce numbers this tool
could not check.

---

## 15. The numbers a clinic gives you

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
| **haemoglobin and ferritin** | the other half of the iron paragraph in `§9`, and the one that turns "am I short of iron" from a guess into a measurement |
| **thyroid** | because an underactive thyroid is a real explanation for a real stall, and because it is the explanation people reach for when it is not the explanation. A logged TSH settles it either way |
| **vitamin D** | UK winter, `§9` |

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

## 16. Medicine that changes the arithmetic

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
| **beta blockers** | slightly lower resting energy expenditure and blunted exercise heart rate, which matters mostly because it makes perceived effort a better guide than a heart rate anyway (`§14`) |
| **insulin and sulfonylureas** | a calorie deficit changes glucose control quickly, which is precisely why this row exists: the dose that was right last month may be too much this month. **This is the strongest "speak to your doctor first" in the whole file** and it is printed before any target is offered to somebody who has ticked this box |
| **diuretics** | make weight readings and the electrolyte notes in `§7` unreliable in different directions |
| **hormonal contraception** | changes or removes the cycle pattern in `§13`, which is worth knowing before drawing a phase on a chart |

It is one optional set of checkboxes, stored like everything else,
and its only effects are the sentences above and the warnings in
`§23`. **The tool never adjusts a number because of a medicine.**
Adjusting an equation for a drug would be practising medicine
with arithmetic; saying what the drug does to a reading is
explaining a chart.

---

## 17. Two countries, one tool

**Units.** Kilograms and centimetres by default. The UK also uses
stone and pounds, and feet and inches, so both are offered and
the choice is stored. Stone is displayed as `12 st 4 lb`, never
as a decimal, because `12.3 st` is a number no British person has
ever said out loud.

**Energy** is kcal in both places, which is what everyone
actually uses, with kJ available because UK labels carry it.

**Food.** No database. A **portion library** instead: a short list
per place of the things people actually eat, each with energy,
macros, the micronutrients in `§9` where they are known, and a
price with a date on it from `§12`.

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
and `§13` is where it is handled.

---

## 18. The page you take to a doctor

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
- the clinic numbers from `§15`, each against its own reference
  range and the date it was taken.
- medicines ticked in `§16`, listed plainly.
- and a single line at the top saying this was produced by a
  calculator from self-reported data, so that nobody reads it as
  a clinical record.

It is the least glamorous feature in this file and it is
plausibly the most useful one. It is also nearly free: every
number on it already exists, and the whole page is a print
stylesheet and a layout.

**It never leaves the reader's control.** No email, no share
link, no upload. A print dialogue and a page, and if they want a
file, the export in `§22` already exists.

---

## 19. What gets stored, and where

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
  oil_ml_week, oil_people, oil_meals, updated_at

public.diet_days      -- one row per person per day
  user_id, entry_date, weight_kg, kcal,
  protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ketones_mmol, steps, sleep_hours, water_ml,
  waist_cm, hip_cm, neck_cm, chest_cm, thigh_cm, arm_cm,
  marks text[],   -- 'ill', 'travel', 'refeed', 'off-protocol'
  note,
  unique (user_id, entry_date)

public.diet_entries   -- one row per food logged
  user_id, entry_date, meal, item_ref, label,
  qty, unit, kcal, macros jsonb, micros jsonb,
  est_low, est_high,        -- a range, for food eaten out
  source ('library' | 'own' | 'free' | 'label' | 'pot')

public.diet_foods     -- the reader's own items and pots
  user_id, label, label_bn, qty, unit, kcal, macros jsonb,
  price, currency, is_pot, pot_of jsonb, updated_at

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

**Nothing here goes through a Worker.** The browser reads and
writes as the reader, with the reader's own bearer, exactly as
the routine tool does. This project holds no service-role key
and this tool is not a reason to start. There is therefore no
`functions/api/diet/`, and that absence is a design decision
rather than an omission.

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
appear in the export in `§22` like everything else, because a
person leaving should take all of it.

---

## 20. How a number is written, and how a chart is read

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
in the same weight as under target. `§23`.

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

## 21. The pages

| | |
| --- | --- |
| `/tools/diet` | today. Weight in, food in, the trend, today's target, what the tool has learned |
| `/tools/diet/you` | the body: measurements, composition, the cut-offs and which set is in use, the tape guide |
| `/tools/diet/goal` | rate, style, macros, the floors, the goal in waist first, and what the projection actually says |
| `/tools/diet/trend` | the long view: trend against scale, learned TDEE over time, stalls, phases, the calendar from `§13` |
| `/tools/diet/foods` | the portion library for this place, the reader's own items and pots, the label reader, and the price table from `§12` |
| `/tools/diet/nutrition` | `§9` and `§10`: the nutrients with their coverage, and the readings out of the log |
| `/tools/diet/health` | `§15` and `§16`: the clinic numbers and the medicines list |
| `/tools/diet/summary` | `§18`, the printable page |

All Next routes under `next/app/(site)/tools/diet/`, components in
`next/components/diet/`, arithmetic in `shared/`. A nav entry in
`shared/nav.ts` under Tools, which is what puts it in the rail,
the footer and the palette at once.

**Eight pages is too many to scroll and exactly right to tab
through**, which is a solved problem here: `next/components/ui/tab-panels.tsx`
is the account page's arrangement, the fragment chooses the
panel, and the panels are built on the server and handed over as
a prop. This tool uses it rather than inventing a second one.

---

## 22. Where this meets the rest of the site

Nothing in this tool is allowed to be a second copy of something
the site already has.

| | |
| --- | --- |
| **`targets`** | already holds a goal with a number on it, of three kinds: a `course` reads ticks, a `habit` reads `days-active`, a `metric` is typed in because the site cannot see it. **A weight goal is a `metric` today and stops being one the moment `diet_days` exists.** That is not a fourth kind, it is the third kind gaining a source, which is exactly the test the existing rule sets: if the site can measure it, the bar is not a decoration |
| **`scenarios`** | already holds a filled-in calculator under a name. A saved plan here is a scenario, encoded the way the stock check encodes its own, so there is one encoder and a saved plan is a link |
| **the routine tool** | logs `days-active`, which is the same calendar this tool draws on. A day logged here should count as an active day there rather than being counted twice |
| **the export** | "take a copy of everything" is one JSON file with progress, library, targets, scenarios and profile in it. The six tables in `§19` go in it, in the same commit that creates them. An export that silently omits the newest feature is the failure this site keeps a check for |
| **erase everything** | the same, in the same commit, and it is the more important half |
| **`COUNTS`** | if any page says how many tools this site has, it counts them |
| **the money school** | this tool prices food; `/money/` teaches budgeting. A link each way, and no duplicated arithmetic |
| **`bnNum`, `GoCard`, `InfoCard`, the tab panels, the chip, the crumbs** | all of it already exists. This tool writes no new chrome |

---

## 23. Safety, written before the code

- Every page that prints a target prints, next to it, that this
  is general education and not medical advice.
- No loss goal under BMI 18.5, on either set of cut-offs.
- Under 18: the equations are for adults and the tool says so and
  stops. This is not a soft warning; there is no child mode.
- Pregnancy or breastfeeding: not supported, said plainly.
- Diabetes on insulin or sulfonylureas: the line from `§16`,
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
  weight field, no trend and no projection. Everything in `§9`,
  `§10` and `§14` still works. A tool that can only be used one
  way is a tool that some people should not use at all.
- No shame language anywhere. Not "you failed", not "over
  budget", not red, not a streak, not a flame, not a
  notification that a day was missed. The routine tool's rule,
  and it holds here.
- The generated sentences in `§10` come from a listed set of
  templates, and that list is what a check reads. A tool that
  writes free prose about somebody's eating will eventually write
  something cruel.

---

## 24. Stages

Each stage ships. None of them ships a placeholder: an empty
panel that will one day hold something reads exactly like a
broken one, which is the rule `/admin` already exists under.

1. **The arithmetic**, in `shared/`, with a unit test per formula.
   BMI both ways, WHtR, Navy, Deurenberg, Mifflin, Katch, the EMA
   and the learned TDEE. Nothing renders yet.
2. **The migration**: the six tables and their policies.
3. **`/tools/diet/you`**: measurements in, composition out. The
   first page that shows a number, and the first that shows a
   range.
4. **`/tools/diet`**: log a weight, log an intake, draw the trend.
   The server-rendered chart from `§20` lands here.
5. **`/tools/diet/goal`**: the engine, the floors, the waist-first
   goal, the projection with its interval.
6. **`/tools/diet/trend`**: learned TDEE, the under-logging gap,
   stalls, the four kinds.
7. **Keto**: the adaptation window, refeed annotation,
   electrolytes, ketones.
8. **The portion library** for both places, the reader's own
   items, and the label reader.
9. **The four log corrections** from `§11`: the oil calibration,
   the shared pot, cooked-versus-raw naming, ranges for food
   eaten out, and hand portions.
10. **Nutrition and insights**: `§9` and `§10`, coverage first.
11. **Cost**: `§12`, prices in the library and the budget plot.
12. **The calendar**: `§13`, marks, cycle, seasons, and Ramadan.
13. **Movement**: `§14`, steps and the recomposition reading.
14. **Health**: `§15` and `§16`.
15. **Maintenance and gaining**: `§6`, which is last only because
   it is the phase that comes after everything above.
16. **The doctor's page** and the export wiring in `§22`.

---

## 25. What must be checked

- a `check-diet` script under `scripts/`: every formula in
  `shared/` has a test; no page prints a target without the
  disclaimer beside it; the floors in `§5` cannot be crossed by
  any input, including the gaining direction in `§6`; the Asian
  cut-off table is used whenever ancestry says so; every food in
  both libraries carries a source and a price date; every rice,
  grain and pasta row names its state; and the generated
  sentences in `§10` come only from the listed templates.
- a `diet.test` under `next/`: the pages in a real browser, the
  way `next/admin.test.ts` drives `/admin`. A panel that renders
  and computes nothing looks exactly like one that works, which
  is the failure `next/interactive.test.ts` exists for and this
  tool is the largest surface on the site for it.
- the chart's table alternative and its `aria-describedby`, in
  that same test, because `§20` is only true if something says
  so.
- the export in `§22` contains all six tables, and the erase
  removes all six. This is a check rather than a paragraph
  because it is the one that will rot first.
- `COUNTS` in `shared/content.ts` if any page says how many tools
  this site has, because a sentence that counts must count.
