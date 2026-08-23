"use client";

/* ============================================================
   diet/nutrition-panel.tsx: beyond calories, and how honest it
   can be.

   `DIET.md` sections 15 and 16.

   ---- the honesty problem is the whole design ----

   Micronutrients cannot be estimated from a number of calories.
   They come from knowing what was actually eaten, and this tool
   has a curated portion library rather than a food database. So
   EVERY FIGURE IS SHOWN WITH ITS COVERAGE, and under about half
   the panel says the day is too sparse to read rather than
   drawing a bar.

   A confident number that is missing a third of the day is more
   dangerous than no number.

   ---- and no scores ----

   No RDA out of 100, no letter grades, no green ticks for
   "complete". Those imply a precision the data does not have and
   turn eating into a test. A figure, a range to aim for, and the
   coverage.

   ---- nineteen figures, in four groups, or nobody reads any ----

   A wall of nineteen is worse than a wall of five, because a
   reader came for ONE of them. `NUTRIENTS` in `shared/foods.ts`
   is the list, in the order it is drawn, grouped so the eye has
   somewhere to land. That table is not inline here on purpose:
   the Android app reads the same reference intakes, and a watch
   list said twice is a watch list that will disagree with
   itself.

   A NUTRIENT WITH NO DATA TODAY IS STILL DRAWN, saying it is
   not known. A list that hides what it cannot measure teaches a
   reader that the list is complete.

   TWO OF THEM CARRY NO RANGE and that is the honest shape.
   Carbohydrate and fat are the split the reader CHOSE, so
   printing a range beside them would tell somebody on keto they
   were failing at the thing they had decided to do.
   ============================================================ */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  COVERAGE_FLOOR, byHour, byWeekday, entryHour, topSources, totalFor,
  type Day, type DayTotal, type Entry,
} from "@reiad/shared/diet";
import { NUTRIENTS, NUTRIENT_GROUPS, type Nutrient } from "@reiad/shared/foods";
import {
  who, getDays, getEntries, getProfile, isoDate, shiftDate,
  type Profile, type Who,
} from "../../lib/diet-api";
import { T, digits, useToolLang } from "./lang";
import { Term } from "./glossary";
import { InsightsPanel } from "./insights-panel";

/** How far back this page reads.

    A MONTH FOR SECTION 16'S FIRST THREE READINGS and four months
    for the rest of them, out of ONE pair of requests. "The top
    handful of foods over the last month" is what the plan says
    and the window is part of the reading, but a deficit
    calibration wants a few months and a week against an average
    wants more than a fortnight to be an average of.

    Four months rather than a year because `getEntries` takes the
    OLDEST 2000 rows: a heavy logger asking for a year would lose
    the recent end of it and nothing about the page would look
    different. */
const WINDOW = 120;
const MONTH = 30;

/** The four a `DayTotal` totals at the top level rather than
    keeping in `micros`. Named rather than indexed, so a macro
    renamed in `shared/diet.ts` is a compile error here instead
    of a figure that quietly reads "not known". */
const TOTALS: Record<string, (d: DayTotal) => number> = {
  protein: (d) => d.protein,
  carbs: (d) => d.carbs,
  fat: (d) => d.fat,
  fibre: (d) => d.fibre,
};

/** A figure and how much of the day knows about it.

    `value` ABSENT is "not known" and is not the same thing as
    nought: nothing today carried the key at all. `seen` is the
    share of the day's ENERGY that did, which is the number
    printed under the figure and never the day's own. */
interface Reading { value?: number; seen: number }

function readingFor(n: Nutrient, day: DayTotal, drunk: number): Reading {
  if (n.reads === "total") {
    const at = TOTALS[n.key];
    return { value: at ? at(day) : undefined, seen: day.coverage };
  }
  if (n.reads === "micros") {
    return { value: day.micros[n.key], seen: day.microCoverage[n.key] ?? 0 };
  }
  /* WATER IS THE ONE THAT IS BOTH. The glasses are logged and
     exact; the water in the food is estimated from the library
     and is a fifth to a third of most days. Adding only the
     glasses is a figure wrong by that much every day, and
     adding only the food is a figure about somebody who does
     not drink. */
  const food = day.micros.water;
  const seen = day.microCoverage.water ?? 0;
  if (food === undefined && drunk === 0) return { value: undefined, seen };
  return { value: drunk + (food ?? 0), seen };
}

/** Rounded for reading rather than for arithmetic. A whole
    number above ten, one decimal below it: `Math.round` alone
    turns 1.4 µg of B12 into 1 and a fifth of the range into
    nothing. */
const show = (v: number): number => (v >= 10 ? Math.round(v) : Math.round(v * 10) / 10);

export function NutritionPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const today = isoDate();

  useEffect(() => {
    let alive = true;
    const paint = () => { void who().then((f) => { if (alive) { setW(f); setAnswered(true); } }); };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { alive = false; document.removeEventListener("account:changed", paint); };
  }, []);

  useEffect(() => {
    if (!w) return;
    let alive = true;
    const from = shiftDate(today, -WINDOW);
    void Promise.all([getDays(w, from), getEntries(w, from), getProfile(w)])
      .then(([d, e, p]) => { if (alive) { setDays(d); setEntries(e); setProfile(p); } });
    return () => { alive = false; };
  }, [w, today]);

  const todays = useMemo(() => totalFor(entries.filter((e) => e.date === today)), [entries, today]);

  /* The last month of it, which is the window section 16 states
     for the three readings below. The other four months are
     `insights-panel.tsx`'s, and both come out of the one fetch
     above. */
  const since = useMemo(() => shiftDate(today, -MONTH), [today]);
  const month = useMemo(() => entries.filter((e) => e.date >= since), [entries, since]);
  const top = useMemo(() => topSources(month), [month]);

  /* What was DRUNK, in millilitres, which is the one figure on
     this page that is logged rather than worked out: the board
     writes a glass at a time. It is half of the water reading
     and the food is the other half. */
  const drunk = useMemo(
    () => days.find((d) => d.date === today)?.waterMl ?? 0,
    [days, today],
  );

  /* WHEN the calories land. The claim that most over-target days
     are made in the evening is a general one, and this is the
     only reading that can confirm or contradict it from the
     reader's own log.

     THE HOUR IS `entryHour()` AND NOT A REGEX OVER `meal`. This
     read the meal label, which is where the board used to stamp
     the clock and is not where it stamps it now: `at_time` is
     the column, `meal` is a meal name, and a second copy of that
     rule here found nothing for every row written since the
     change. One function knows both spellings and it is in
     `shared/diet.ts` for exactly this reason. */
  const hours = useMemo(() => {
    const timed = month.filter((e) => !e.planned && entryHour(e) !== null)
      .map((e) => ({ hour: entryHour(e) as number, kcal: e.kcal ?? 0 }));
    return { buckets: byHour(timed), n: timed.length };
  }, [month]);
  const week = useMemo(
    () => byWeekday(days.filter((d) => d.date >= since)), [days, since],
  );

  const DAY_NAMES = lang === "bn"
    ? ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;
  /* SIGNED OUT, THE HALF THAT NEEDS NO ACCOUNT IS STILL WORTH
     READING. Only "how much of this you had today" comes out of a
     log; the nineteen figures themselves, what each is for and
     what an adult needs are facts about food, and a page that
     hides them behind a sign-in teaches nobody anything. */
  if (!w) {
    return (
      <div className="dt-nutrition">
        <WhatIsWatched />
        {/* Two of section 16's readings and one of section 17's
            are facts about the portion library rather than about
            a reader, and they draw with no account for the same
            reason the list above does. */}
        <InsightsPanel w={null} days={[]} entries={[]} profile={null} today={today} />
      </div>
    );
  }

  const sparse = todays.coverage < COVERAGE_FLOOR;

  return (
    <div className="dt-nutrition">
      <section aria-labelledby="dt-nut-h">
        <h2 id="dt-nut-h"><T en="Today, and how much of it is known" bn="আজ, আর তার কতটুকু জানা" /></h2>
        {/* COVERAGE FIRST, and under half nothing is drawn at
            all. This is the most important sentence on the page. */}
        <p className="dt-coverage">
          <T
            en={todays.count === 0
              ? "Nothing logged today."
              : `Computed from ${Math.round(todays.coverage * 100)}% of today's food.`}
            bn={todays.count === 0
              ? "আজ কিছু লেখা হয়নি।"
              : `আজকের খাবারের ${digits(Math.round(todays.coverage * 100), "bn")}% থেকে হিসাব করা।`}
          />
        </p>
        {sparse ? (
          <p className="dt-hint">
            <T
              en="Too sparse to read. A confident number that is missing a third of the day is more dangerous than no number, so nothing is drawn until more of the day has composition attached. Free entry is what leaves the gap: an item from the search carries its numbers."
              bn="পড়ার মতো যথেষ্ট নয়। দিনের এক তৃতীয়াংশ বাদ দিয়ে দেওয়া আত্মবিশ্বাসী সংখ্যা কোনো সংখ্যা না থাকার চেয়ে বিপজ্জনক, তাই দিনের বেশি অংশে গঠন যুক্ত না হওয়া পর্যন্ত কিছুই আঁকা হয় না। নিজে লিখলে ফাঁকটা থেকে যায়: খুঁজে নেওয়া জিনিসের সঙ্গে সংখ্যা আসে।"
            />
          </p>
        ) : (
          NUTRIENT_GROUPS.map((g) => (
            <div className="dt-nut-group" key={g.id}>
              <h3 className="dt-nut-group-h"><T en={g.en} bn={g.bn} /></h3>
              <ul className="dt-nutrients">
                {NUTRIENTS.filter((n) => n.group === g.id).map((n) => {
                  const { value, seen } = readingFor(n, todays, drunk);
                  /* THIS NUTRIENT'S OWN COVERAGE, not the day's.
                     A crowdsourced row may carry sodium and
                     nothing else, so the day read 100% while
                     four of the five said "not known"
                     underneath it. A figure drawn from a third
                     of the day says at least rather than about. */
                  const thin = value != null && seen < COVERAGE_FLOOR;
                  const n0 = value == null ? 0 : show(value);
                  return (
                    <li key={n.key} className="dt-figure">
                      <h4><T en={n.en} bn={n.bn} /></h4>
                      <p className="dt-value">
                        {value == null
                          ? <T en="not known" bn="জানা নেই" />
                          : thin
                            ? <T en={`at least ${n0} ${n.unit}`}
                                 bn={`কমপক্ষে ${digits(n0, "bn")} ${n.unitBn}`} />
                            : <T en={`about ${n0} ${n.unit}`}
                                 bn={`প্রায় ${digits(n0, "bn")} ${n.unitBn}`} />}
                      </p>
                      <Target n={n} />
                      {/* THE SHARE, which is the whole of what
                          section 15 promised about saturated
                          fat: not a verdict, the proportion. */}
                      {n.key === "satfat" && value != null && todays.fat > 0 ? (
                        <p className="dt-said">
                          <T
                            en={`${Math.round((value / todays.fat) * 100)}% of today's fat`}
                            bn={`আজকের চর্বির ${digits(Math.round((value / todays.fat) * 100), "bn")}%`}
                          />
                        </p>
                      ) : null}
                      {value == null ? null : n.reads === "both" ? (
                        /* Two halves and two different kinds of
                           knowing: the glasses are what somebody
                           tapped and the rest is estimated, so
                           one percentage over both would be a
                           lie about the exact half. */
                        <p className="dt-coverage">
                          <T
                            en={`${Math.round(drunk)} ml tapped as glasses, the rest from ${Math.round(seen * 100)}% of today's food`}
                            bn={`গ্লাস হিসেবে লেখা ${digits(Math.round(drunk), "bn")} মিলিলিটার, বাকিটা আজকের খাবারের ${digits(Math.round(seen * 100), "bn")}% থেকে`}
                          />
                        </p>
                      ) : (
                        <p className="dt-coverage">
                          <T
                            en={`from ${Math.round(seen * 100)}% of today's food`}
                            bn={`আজকের খাবারের ${digits(Math.round(seen * 100), "bn")}% থেকে`}
                          />
                        </p>
                      )}
                      <p className="dt-why"><T en={n.whyEn} bn={n.whyBn} /></p>
                      <p className="dt-ref"><T en={n.refEn} bn={n.refBn} /></p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
        <p className="dt-why">
          <T
            en="No score out of a hundred, no letter grade and no green tick for complete. Those imply a precision this data does not have, and they turn eating into a test."
            bn="একশোতে কোনো নম্বর নেই, কোনো গ্রেড নেই, সম্পূর্ণ হওয়ার সবুজ টিকও নেই। ওগুলো এমন নিখুঁততা দাবি করে যা এই তথ্যে নেই, আর খাওয়াকে পরীক্ষা বানিয়ে ফেলে।"
          />
        </p>
        {/* AND NO SUPPLEMENTS. Section 15 is explicit: this can
            say a figure has been under its range, which is a
            fact about the log, and what to do about it is
            somebody else's job. */}
        <p className="dt-why">
          <T
            en="Every range above is somebody's published reference intake, with whose it is written under it, and several of them disagree with each other by more than a rounding. None of it is a recommendation to take anything: a figure under its range for weeks is a fact about your log and what to do about it is a conversation with a clinician. This is general education and not medical advice."
            bn="উপরের প্রতিটি সীমা কোনো না কোনো সংস্থার প্রকাশিত হিসাব, আর কার হিসাব সেটা নিচে লেখা আছে, আর কয়েকটা একে অপরের সঙ্গে বেশ খানিকটা মেলে না। এর কোনোটাই কিছু খাওয়ার পরামর্শ নয়: সপ্তাহের পর সপ্তাহ সীমার নিচে থাকা একটা সংখ্যা আপনার খাতার তথ্য, আর তা নিয়ে কী করবেন সেটা ডাক্তারের সঙ্গে কথা। এটা সাধারণ শিক্ষা, চিকিৎসা পরামর্শ নয়।"
          />
        </p>

        {/* TWO THINGS ABOUT CARBOHYDRATE THAT CHANGE WHAT THE
            NUMBER ABOVE MEANS, and the second one matters more
            here than almost anywhere else. */}
        <p className="dt-why">
          <T
            en="Fibre is carbohydrate your body cannot break down, so a carbohydrate figure with the fibre taken off is a different number: "
            bn="আঁশ এমন শর্করা যা শরীর ভাঙতে পারে না, তাই মোট শর্করা থেকে আঁশ বাদ দিলে সংখ্যাটা আলাদা হয়ে যায়: "
          />
          <Term id="netcarbs" en="net carbs" bn="কার্যকর শর্করা" />
          <T
            en=". And rice that has been cooked and then cooled behaves partly like fibre rather than like sugar, which is "
            bn="। আর রান্নার পর ঠান্ডা হওয়া ভাত চিনির মতো নয়, আংশিক আঁশের মতো আচরণ করে, একে বলে "
          />
          <Term id="resistant" en="resistant starch" bn="প্রতিরোধী শ্বেতসার" />
          <T
            en=". Neither is on a label in either country, so both are worked out rather than read."
            bn="। দুই দেশের কোনো মোড়কেই এগুলো লেখা থাকে না, তাই দুটোই পড়া হয় না, হিসাব করা হয়।"
          />
        </p>
      </section>

      <section aria-labelledby="dt-top-h">
        <h2 id="dt-top-h"><T en="Where the calories actually are" bn="ক্যালোরি আসলে কোথায়" /></h2>
        {top.length ? (
          <ul className="dt-tag-counts">
            {top.map((t) => (
              <li key={t.label}>
                <span>{t.label}</span>
                <span className="mono">
                  {digits(Math.round(t.kcal), lang)}
                  {" "}({digits(Math.round(t.share * 100), lang)}%)
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dt-hint">
            <T en="A month of logging makes this the most useful thing here, and it is almost always three items."
               bn="এক মাস লিখলে এটাই এখানকার সবচেয়ে কাজের জিনিস হয়ে ওঠে, আর প্রায় সবসময়ই তিনটে জিনিস।" />
          </p>
        )}
      </section>

      <section aria-labelledby="dt-hour-h">
        <h2 id="dt-hour-h"><T en="When they land" bn="কখন আসে" /></h2>
        {hours.n >= 20
          ? (
            <>
              {/* A row of columns, one per hour, with the peak
                  named underneath. Nothing here is red and
                  nothing is a target: it is a shape, and the
                  shape is the reading. */}
              <div className="dt-hourbars" role="img"
                   aria-label={lang === "bn"
                     ? "দিনের কোন সময়ে কত ক্যালোরি"
                     : "How the day's calories fall across the hours"}>
                {hours.buckets.map((v, h) => {
                  const peak = Math.max(...hours.buckets, 1);
                  return (
                    <span key={h} className="dt-hourbar"
                          data-label={h % 6 === 0 ? String(h) : undefined}
                          style={{ "--h": `${Math.round((v / peak) * 100)}%` } as CSSProperties} />
                  );
                })}
              </div>
              <p className="dt-said">
                {(() => {
                  const peak = hours.buckets.indexOf(Math.max(...hours.buckets));
                  const evening = hours.buckets.slice(18).reduce((a, b) => a + b, 0);
                  const all = hours.buckets.reduce((a, b) => a + b, 0) || 1;
                  const share = Math.round((evening / all) * 100);
                  return (
                    <T
                      en={`Your biggest hour is around ${peak}:00, and ${share}% of what you log arrives after six in the evening.`}
                      bn={`আপনার সবচেয়ে বড় সময়টা প্রায় ${digits(peak, "bn")}টা, আর যা লেখেন তার ${digits(share, "bn")}% আসে সন্ধ্যা ছয়টার পরে।`}
                    />
                  );
                })()}
              </p>
              <p className="dt-why">
                <T
                  en="Described, not judged. Eating late is not a failure and this does not say it is: it is here because knowing the shape of your own day is what makes a target reachable rather than a surprise at nine in the evening."
                  bn="বর্ণনা, বিচার নয়। দেরিতে খাওয়া ব্যর্থতা নয় আর এটা সেটা বলছেও না: এটা এখানে আছে কারণ নিজের দিনের ধরনটা জানলেই লক্ষ্যটা রাতে নয়টার চমক না হয়ে নাগালের মধ্যে থাকে।"
                />
              </p>
            </>
          )
          : (
            <p className="dt-hint">
              <T
                en="Twenty logged items with a time on them, and this shows when your calories actually land. It is the one reading that can confirm or contradict the claim that most over-target days are made in the evening, from your own log rather than in general."
                bn="সময়সহ কুড়িটা জিনিস লিখলে এটা দেখাবে আপনার ক্যালোরি আসলে কখন আসে। সাধারণভাবে নয়, আপনার নিজের খাতা থেকেই এটাই একমাত্র হিসাব যা বলতে পারে সন্ধ্যাতেই বেশিরভাগ দিন লক্ষ্য ছাড়ায় কি না।"
              />
            </p>
          )}
      </section>

      <section aria-labelledby="dt-week-h">
        <h2 id="dt-week-h"><T en="Which days go over" bn="কোন দিনগুলো বেশি যায়" /></h2>
        <ul className="dt-weekdays">
          {week.map((d) => (
            <li key={d.day}>
              <span>{DAY_NAMES[d.day]}</span>
              <span className="mono">{d.n ? digits(Math.round(d.mean), lang) : "-"}</span>
            </li>
          ))}
        </ul>
        <p className="dt-why">
          <T
            en="A day that is consistently above the rest is a fact worth seeing rather than a failure worth hiding, and it is usually a routine rather than a lapse."
            bn="যে দিনটা বরাবরই বাকিদের চেয়ে উপরে, সেটা লুকানোর মতো ব্যর্থতা নয়, দেখার মতো একটা তথ্য, আর সেটা সাধারণত অনিয়ম নয়, একটা রুটিন।"
          />
        </p>
      </section>

      {/* The rest of section 16, and section 17's money. Handed
          the same fetch rather than making its own: four months
          of one reader's log is one pair of requests. */}
      <InsightsPanel
        w={w} days={days} entries={entries} profile={profile} today={today}
      />
    </div>
  );
}

/** The list, with no figures on it. What is watched, why, and
    roughly how much an adult needs, for a reader with no account
    and for one who has not logged anything yet. */
function WhatIsWatched() {
  return (
    <>
      <section aria-labelledby="dt-watch-h">
        <h2 id="dt-watch-h">
          <T en="What this page watches" bn="এই পাতা কী কী দেখে" />
        </h2>
        <p className="dt-intro">
          <T
            en="Nineteen of them, in four groups. Log what you eat and each fills in with your own day beside it, drawn from the share of that day this site actually knows the composition of. None of this needs an account to read."
            bn="উনিশটা, চারটা দলে। আপনি যা খান লিখলে প্রতিটির পাশে আপনার নিজের দিনটা বসবে, আর সেটা আঁকা হবে ওই দিনের যতটুকুর গঠন এই সাইট সত্যিই জানে তার ভিত্তিতে। এসব পড়তে কোনো অ্যাকাউন্ট লাগে না।"
          />
        </p>
        {NUTRIENT_GROUPS.map((g) => (
          <section key={g.id} aria-labelledby={`dt-watch-${g.id}`}>
            <h3 id={`dt-watch-${g.id}`} className="dt-readout-h">
              <T en={g.en} bn={g.bn} />
            </h3>
            <ul className="dt-nutrients">
              {NUTRIENTS.filter((n) => n.group === g.id).map((n) => (
                <li key={n.key} className="dt-figure dt-figure-empty">
                  <h4><T en={n.en} bn={n.bn} /></h4>
                  <Target n={n} />
                  <p className="dt-why"><T en={n.whyEn} bn={n.whyBn} /></p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>
    </>
  );
}

/** What to aim for, said once.

    Four shapes, because a nutrient can have a floor, a ceiling,
    both, or neither, and none of the four is the same sentence.
    It is a component rather than two copies of a ternary for the
    reason this whole tool keeps returning to: the signed-in
    panel and the signed-out list print the same fact, and two
    copies of a fact are two things to keep true. */
function Target({ n }: { n: Nutrient }) {
  return (
    <p className="dt-said">
      {n.low != null && n.high != null
        ? <T en={`aim for ${n.low} to ${n.high} ${n.unit}`}
             bn={`লক্ষ্য ${digits(n.low, "bn")} থেকে ${digits(n.high, "bn")} ${n.unitBn}`} />
        : n.low != null
          ? <T en={`at least ${n.low} ${n.unit} a day`}
               bn={`দিনে অন্তত ${digits(n.low, "bn")} ${n.unitBn}`} />
          : n.high != null
            ? <T en={`keep it under ${n.high} ${n.unit}`}
                 bn={`${digits(n.high, "bn")} ${n.unitBn} এর নিচে রাখুন`} />
            : <T en="no single figure to aim for"
                 bn="লক্ষ্য করার মতো একটাও নির্দিষ্ট সংখ্যা নেই" />}
    </p>
  );
}
