"use client";

/* ============================================================
   diet/forecast-panel.tsx: a weight forecast built out of what
   the reader actually did.

   `DIET.md` sections 19, 10 and 5.

   ---- why this is not `projection()` with a nicer face ----

   `target()` and `projection()` work from a maintenance figure,
   and before there are fourteen days of log that figure is a
   resting burn times an activity multiplier somebody chose off a
   list. Section 19 is blunt about what that multiplier is worth:
   the largest variable in what anybody burns is the moving they
   do not plan, it varies by hundreds of calories a day between
   two people of the same size, and it FALLS during a deficit.
   The tool records steps and, until this page, did nothing with
   them beyond one widget.

   So there are two readings here and they answer different
   questions. What the last fortnight implies, which is arithmetic
   on the reader's own weighings. And what a change in walking
   would do to that, which is arithmetic on the reader's own
   bodyweight.

   ---- three things it must not become ----

   NEVER A DATE. "You will weigh 74.2 kg on the 3rd of November"
   is a lie with a date on it. Every figure here is a band, the
   band widens with distance, and it refuses outright when the
   rate's own interval spans zero, which is `projection()`'s
   refusal and is the one input that makes this kind of sentence
   lie.

   NEVER AN ALLOWANCE. Section 19: exercise calories are never
   added to the target. What a walk is worth changes the
   FORECAST, and the page says that in those words, because
   eating back an overestimated burn is the most reliable way
   there is to erase a deficit while believing you are in one.

   AND NEVER A MEASUREMENT. A step count from a phone is an
   estimate with a stride length inside it, and the band on every
   figure here is mostly that. `STEPS_PER_KM` in
   `shared/activity.ts` is where it is written down.
   ============================================================ */

import { useMemo, useState } from "react";
import {
  slopePerWeek, weighings, type Day, type Phase,
} from "@reiad/shared/diet";
import {
  outlook, sooner, stepShift, stepsKcal, stepsKgPerWeek,
} from "@reiad/shared/activity";
import { dayNumber, shiftDate, type Profile } from "../../lib/diet-api";
import { ChipButton } from "../ui/chip";
import { T, TBlock, digits, useToolLang } from "./lang";
import { Waiting } from "./widgets";

/** How far out the forecast may be asked. Twelve weeks and no
    further: the band from a fortnight's weighings is already
    wider than the number by then, which is the honest end of
    what this arithmetic can say. */
const HORIZONS = [4, 8, 12];

/** The changes in walking a reader can ask about. Small on
    purpose: a chip offering ten thousand more steps a day is a
    chip offering a different life. */
const EXTRA_STEPS = [1000, 2000, 3000];

/** The window the rate is fitted to. A fortnight, which is what
    "if the last fortnight continues" means and is the shortest
    window section 3 will read anything out of. */
const FORTNIGHT = 14;

const one = (n: number): string => n.toFixed(1);
const two = (n: number): string => n.toFixed(2);

export function ForecastPanel({ days, profile, phases, todayISO }: {
  days: Day[];
  profile: Profile | null;
  phases: Phase[];
  todayISO: string;
}) {
  const lang = useToolLang();
  const [weeks, setWeeks] = useState(8);
  const [extra, setExtra] = useState(2000);

  /* DRAWN AND FITTED ARE TWO LISTS, and `weighings()` is the one
     place that says which is which: a day the reader marked and a
     stretch that is still settling are both real readings and
     neither may be fitted. Without the phases a forecast crosses
     a protocol boundary, which is a step in body water fitted as
     though it were a rate. */
  const fortnight = useMemo(
    () => days.filter((d) => d.date >= shiftDate(todayISO, -(FORTNIGHT - 1))),
    [days, todayISO],
  );
  const { fittable } = useMemo(() => weighings({
    days: fortnight, dayOf: dayNumber, phases, today: dayNumber(todayISO),
  }), [fortnight, phases, todayISO]);

  const ahead = useMemo(() => outlook({ points: fittable, weeks }), [fittable, weeks]);
  const rate = useMemo(() => slopePerWeek(fittable), [fittable]);
  const walked = useMemo(() => stepShift(days, todayISO), [days, todayISO]);

  /* The weight the step arithmetic is done against, which is the
     trend rather than this morning's reading, for the reason
     every other figure in this tool reads the trend. */
  const nowKg = ahead?.fromKg
    ?? [...days].reverse().find((d) => d.weightKg != null)?.weightKg
    ?? null;

  const kcal = nowKg == null ? null : stepsKcal(extra, nowKg);
  const perWeek = nowKg == null ? null : stepsKgPerWeek(extra, nowKg);

  const goalKg = profile?.goal_weight_kg ?? null;
  const quicker = useMemo(() => {
    if (nowKg == null || goalKg == null || !rate) return null;
    return sooner({
      currentKg: nowKg, goalKg, weekly: rate, steps: extra, weightKg: nowKg,
    });
  }, [nowKg, goalKg, rate, extra]);

  return (
    <>
      <section>
        <h2><T en="What you have been walking" bn="আপনি কতটা হাঁটছেন" /></h2>
        {walked.now == null && walked.before == null ? (
          <p className="dt-habit-said">
            <Waiting
              en="Steps go on the log by hand, or from whatever your phone already counts. A fortnight of them and this compares one fortnight against the one before it."
              bn="হাঁটার হিসাব হাতে লেখা যায়, বা ফোন যা গোনে সেখান থেকে নেওয়া যায়। দুই সপ্তাহ জমলে এটা এক পক্ষের সঙ্গে আগের পক্ষের তুলনা করবে।"
            />
          </p>
        ) : (
          <>
            <p className="dt-value">
              <T
                en={walked.now == null ? "Nothing this fortnight"
                  : `${Math.round(walked.now).toLocaleString("en-GB")} a day`}
                bn={walked.now == null ? "এই পক্ষে কিছু নেই"
                  : `দিনে ${digits(Math.round(walked.now), "bn")}`}
              />
            </p>
            <p className="dt-why">
              <T
                en={walked.before == null
                  ? `The middle day of the last ${walked.of}, out of ${walked.nowDays} days with a count on them. There is no fortnight before this one to compare it against yet.`
                  : `The middle day of the last ${walked.of}. The ${walked.of} before that were ${Math.round(walked.before).toLocaleString("en-GB")}. Two numbers and no verdict: both halves are the same length, so a quiet fortnight makes a smaller number rather than a broken chain.`}
                bn={walked.before == null
                  ? `শেষ ${digits(walked.of, "bn")} দিনের মাঝারি দিন, যার মধ্যে ${digits(walked.nowDays, "bn")} দিনে হিসাব লেখা আছে। তুলনা করার মতো আগের পক্ষ এখনো নেই।`
                  : `শেষ ${digits(walked.of, "bn")} দিনের মাঝারি দিন। তার আগের ${digits(walked.of, "bn")} দিনে ছিল ${digits(Math.round(walked.before), "bn")}। দুটো সংখ্যা, কোনো রায় নয়: দুই পাশই সমান লম্বা, তাই চুপচাপ একটা পক্ষে সংখ্যাটা ছোট হয়, ধারা ভাঙে না।`}
              />
            </p>
            {walked.now != null && walked.before != null && walked.now < walked.before * 0.8 ? (
              <TBlock
                en={(
                  <p className="dt-why">
                    A fall of this size is worth knowing about because it is
                    invisible otherwise: the trend flattens, the log has not
                    changed, and the thing that moved is how much you walked.
                    That is not a stall and it is the easiest of them to answer.
                  </p>
                )}
                bn={(
                  <p className="dt-why">
                    এতটা কমে যাওয়া জানা দরকার, কারণ এমনিতে এটা চোখে পড়ে না: ধারা
                    সমান হয়ে যায়, খাতায় কিছু বদলায়নি, আর যেটা বদলেছে সেটা হলো
                    আপনার হাঁটা। এটা আটকে যাওয়া নয়, আর সবগুলোর মধ্যে এটার উত্তর
                    সবচেয়ে সহজ।
                  </p>
                )}
              />
            ) : null}
          </>
        )}
      </section>

      <section>
        <h2><T en="If the last fortnight carries on" bn="শেষ দুই সপ্তাহ যেমন চলছে তেমন চললে" /></h2>

        <div className="dt-tags" role="group"
             aria-label={lang === "bn" ? "কত সপ্তাহ পরে" : "How far ahead"}>
          {HORIZONS.map((n) => (
            <ChipButton key={n} pressed={weeks === n} onClick={() => setWeeks(n)}>
              <T en={`${n} weeks`} bn={`${digits(n, "bn")} সপ্তাহ`} />
            </ChipButton>
          ))}
        </div>

        {ahead ? (
          <>
            <p className="dt-value">
              <T
                en={`${one(Math.min(ahead.kg.low, ahead.kg.high))} to ${one(Math.max(ahead.kg.low, ahead.kg.high))} kg`}
                bn={`${digits(one(Math.min(ahead.kg.low, ahead.kg.high)), "bn")} থেকে ${digits(one(Math.max(ahead.kg.low, ahead.kg.high)), "bn")} কেজি`}
              />
            </p>
            <p className="dt-why">
              <T
                en={`From ${one(ahead.fromKg)} kg today, at ${two(ahead.weekly.mid)} kg a week, fitted to ${ahead.readings} weighings over the last fortnight. The band is that rate's own error carried forward, so it widens the further out you ask: this arithmetic cannot be more certain about ${weeks} weeks away than about next week, and a single number here would be pretending otherwise.`}
                bn={`আজকের ${digits(one(ahead.fromKg), "bn")} কেজি থেকে, সপ্তাহে ${digits(two(ahead.weekly.mid), "bn")} কেজি হারে, শেষ দুই সপ্তাহের ${digits(ahead.readings, "bn")}টি ওজনের উপর বসানো। সীমাটা ওই হারের নিজের ভুল সামনে টেনে নেওয়া, তাই যত দূরের কথা জিজ্ঞেস করবেন সীমা তত চওড়া: ${digits(weeks, "bn")} সপ্তাহ পরের কথা এই হিসাব আগামী সপ্তাহের চেয়ে বেশি নিশ্চিত করে বলতে পারে না, আর একটামাত্র সংখ্যা দিলে সেটাই ভান করা হতো।`}
              />
            </p>
            <p className="dt-why">
              <T
                en="And there is no date on it on purpose. Maintenance falls on the way down, which section 3 measures rather than assumes, so the further half of any forecast is the half most likely to move."
                bn="আর ইচ্ছে করেই এর সঙ্গে কোনো তারিখ নেই। ওজন কমার পথে খরচও কমে, যেটা তৃতীয় অংশ আন্দাজ না করে মেপে দেখে, তাই সামনের হিসাবের দূরের অর্ধেকটাই সবচেয়ে বেশি বদলায়।"
              />
            </p>
          </>
        ) : (
          <p className="dt-habit-said">
            {fittable.length < 3 ? (
              <Waiting
                en="Three weighings inside a fortnight and a rate can be fitted. Fewer than that has no residual to measure, so there is no error bar and therefore nothing worth drawing."
                bn="দুই সপ্তাহের মধ্যে তিনটি ওজন হলে একটা হার বসানো যায়। তার কম হলে ভুলের মাপ বের করার কিছু থাকে না, তাই সীমাও থাকে না, আর সীমা ছাড়া আঁকার মতো কিছু নেই।"
              />
            ) : (
              <Waiting
                en="Your rate over this fortnight cannot tell a loss from a gain: its error bar runs through zero. Carrying that forward would produce a confident sentence out of data that does not support one, so nothing is drawn. Another week of weighings usually settles it."
                bn="এই দুই সপ্তাহে আপনার হার কমা আর বাড়ার তফাত বলতে পারছে না: ভুলের সীমাটা শূন্যের দুই পাশে। সেটা সামনে টানলে যে তথ্য এমন কিছু বলে না তার উপর জোর দিয়ে একটা বাক্য দাঁড়াত, তাই কিছুই আঁকা হয়নি। আরও এক সপ্তাহ ওজন নিলে সাধারণত এটা মিটে যায়।"
              />
            )}
          </p>
        )}
      </section>

      <section>
        <h2><T en="What more walking would do to it" bn="আরও হাঁটলে এতে কী হবে" /></h2>

        <div className="dt-tags" role="group"
             aria-label={lang === "bn" ? "দিনে কত কদম বেশি" : "How many more steps a day"}>
          {EXTRA_STEPS.map((n) => (
            <ChipButton key={n} pressed={extra === n} onClick={() => setExtra(n)}>
              <T en={`+${n.toLocaleString("en-GB")} a day`}
                 bn={`দিনে +${digits(n, "bn")}`} />
            </ChipButton>
          ))}
        </div>

        {kcal && perWeek ? (
          <>
            <p className="dt-value">
              <T
                en={`${Math.round(kcal.low)} to ${Math.round(kcal.high)} kcal a day`}
                bn={`দিনে ${digits(Math.round(kcal.low), "bn")} থেকে ${digits(Math.round(kcal.high), "bn")} ক্যালোরি`}
              />
            </p>
            <p className="dt-why">
              <T
                en={`Which is about ${two(perWeek.low)} to ${two(perWeek.high)} kg a week. The width is two estimates multiplied: what a kilometre of walking costs a body of your weight, and how many steps of yours make a kilometre. A step count from a phone is itself an estimate, and its own error sits on top of both.`}
                bn={`মানে সপ্তাহে মোটামুটি ${digits(two(perWeek.low), "bn")} থেকে ${digits(two(perWeek.high), "bn")} কেজি। সীমাটা চওড়া কারণ দুটো আন্দাজ গুণ করা হয়েছে: আপনার ওজনের শরীরে এক কিলোমিটার হাঁটার খরচ কত, আর আপনার কত কদমে এক কিলোমিটার হয়। ফোনের কদম গোনাটাও নিজেই একটা আন্দাজ, তার ভুলটা এই দুইয়ের উপরে বসে।`}
              />
            </p>

            {quicker ? (
              <p className="dt-why">
                <T
                  en={`Against your goal that is about ${one(Math.max(quicker.saved.low, 0))} to ${one(Math.max(quicker.saved.high, 0))} weeks off, from ${one(quicker.now.mid)} weeks to ${one(quicker.after.mid)} at the middle of your rate. The slower your current rate, the more a walk is worth, which is why that saving is a band rather than a number.`}
                  bn={`আপনার লক্ষ্যের হিসাবে এটা প্রায় ${digits(one(Math.max(quicker.saved.low, 0)), "bn")} থেকে ${digits(one(Math.max(quicker.saved.high, 0)), "bn")} সপ্তাহ কমায়, হারের মাঝামাঝি ধরলে ${digits(one(quicker.now.mid), "bn")} সপ্তাহ থেকে ${digits(one(quicker.after.mid), "bn")} সপ্তাহে। এখনকার হার যত ধীর, হাঁটার দাম তত বেশি, আর সেজন্যই এই কমাটা একটা সংখ্যা নয়, একটা সীমা।`}
                />
              </p>
            ) : (
              <p className="dt-why">
                <T
                  en="A goal weight on the goal page turns this into weeks. Without one it stays what it is: calories a day, and what those come to in a week."
                  bn="লক্ষ্যের পাতায় একটা ওজন দিলে এটা সপ্তাহে বদলে যায়। সেটা না থাকলে এটা যা আছে তাই থাকে: দিনে কত ক্যালোরি, আর সপ্তাহে তা কত।"
                />
              </p>
            )}

            {/* Section 19, and the one sentence on this page that
                is a rule rather than a reading. */}
            <TBlock
              en={(
                <p className="dt-why">
                  None of this is an allowance. Nothing here is added to what
                  you may eat, and no page in this tool will ever do that:
                  published figures for calories burned are routinely wrong by
                  a factor of two, and eating back an overestimated burn is the
                  single most reliable way to erase a deficit while believing
                  you are still in one. What a walk changes here is the
                  forecast.
                </p>
              )}
              bn={(
                <p className="dt-why">
                  এর কোনোটাই বাড়তি খাওয়ার অনুমতি নয়। এখানকার কিছুই আপনার খাওয়ার
                  পরিমাণে যোগ হয় না, আর এই যন্ত্রের কোনো পাতা কখনো তা করবেও না:
                  ব্যায়ামে কত পোড়ে বলে যে হিসাব ছাপা হয় তা প্রায়ই দ্বিগুণ ভুল হয়, আর
                  বেশি ধরা সেই খরচটুকু আবার খেয়ে ফেলাই ঘাটতি মুছে ফেলার সবচেয়ে নিশ্চিত
                  উপায়, অথচ মনে হয় ঘাটতিতেই আছেন। হাঁটা এখানে যা বদলায় তা হলো সামনের
                  হিসাব।
                </p>
              )}
            />
          </>
        ) : (
          <p className="dt-habit-said">
            <Waiting
              en="What a walk is worth depends on the body doing the walking, so this needs one weighing before it can say anything."
              bn="হাঁটার দাম নির্ভর করে কে হাঁটছে তার উপর, তাই কিছু বলার আগে অন্তত একটা ওজন দরকার।"
            />
          </p>
        )}
      </section>
    </>
  );
}
