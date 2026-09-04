"use client";

/* Seven daily things, read off what is already logged. `DIET.md`
   sections 11 and 19.

   THERE IS NO FORM ON THIS PAGE, and that is the point: if the site
   cannot measure a thing out of something it already holds, the bar would
   be a decoration. Every one of these is a column of `diet_days` that the
   log form already writes, read back as a run of days, and an eighth
   habit has to name its column before it is an eighth habit.

   `streak()` in `shared/diet.ts` carries the argument and `habits()`
   hands its days to it rather than counting a run of its own. `best` is
   drawn beside `current` on every row, because a number that can only
   fall is a number people stop looking at, and a missed day is one fewer
   day in a count rather than a break in something.

   NOTHING HERE GOES RED: no flame, no countdown, no colour that means
   failure, and no sentence that praises anybody either, because a status
   that praises you is a status people stop reading.

   A HABIT WITH NO DATA IS NOT A FAILED HABIT: a column nothing writes yet
   is a sentence saying what would fill it, never a fortnight of noughts.

   Two of these are not habits: `Moved` puts the walking, the trend and
   the log over one window beside each other, and `Taped` puts the tape
   beside the trend. Both are `shared/insights.ts` and neither is counted
   towards a run of days. */

import { useEffect, useMemo, useState } from "react";
import {
  STALL_DAYS, fatEstimate, trend, weighings,
  type Body, type Day, type Phase,
} from "@reiad/shared/diet";
import {
  GLASS_ML, STEP_BASE_LEAST, habits, type Habit, type HabitId,
} from "@reiad/shared/activity";
import {
  TAPE_LEAST_DAYS, TAPE_RESOLUTION_CM, TAPE_SPAN_DAYS, movement, tape,
  type MeasureId, type Movement, type Tape,
} from "@reiad/shared/insights";
import {
  who, dayNumber, getDays, getPhases, getProfile, isoDate, shiftDate,
  type Profile, type Who,
} from "../../lib/diet-api";
import { Meter } from "../deck";
import { Invite } from "./invite";
import { Note } from "../ui/note";
import { T, TBlock, digits, useToolLang } from "./lang";
import { Waiting } from "./widgets";
import { Term } from "./glossary";
import { ForecastPanel } from "./forecast-panel";

/** What each row is called, and the column it is read off.

    THE SECOND LINE IS NOT DECORATION. A reader who cannot see
    where a number came from has been asked to trust a website,
    which is what section 1 refuses to do anywhere else in this
    tool. Saying "read off the weight you logged" is also what
    makes it obvious that nothing here is a new thing to do. */
const ROWS: Record<HabitId, {
  en: string; bn: string;
  fromEn: string; fromBn: string;
  waitEn: string; waitBn: string;
}> = {
  weighed: {
    en: "Weighed in the morning", bn: "সকালে ওজন নেওয়া",
    fromEn: "Read off the weight on each day's row.",
    fromBn: "প্রতিদিনের সারিতে লেখা ওজন থেকে।",
    waitEn: "The first weighing starts this.",
    waitBn: "প্রথম ওজন দিয়েই এটা শুরু হবে।",
  },
  logged: {
    en: "Logged what you ate", bn: "যা খেয়েছেন লেখা",
    fromEn: "Read off the day's calorie total, however it got there.",
    fromBn: "দিনের মোট ক্যালোরি থেকে, সেটা যেভাবেই লেখা হোক।",
    waitEn: "The first day with food on it starts this.",
    waitBn: "প্রথম যেদিন খাবার লেখা হবে, সেদিন থেকে শুরু।",
  },
  protein: {
    en: "Protein over the floor", bn: "প্রোটিন সীমার উপরে",
    fromEn: "Read off the day's protein against the floor for your lean mass.",
    fromBn: "আপনার চর্বি ছাড়া ভরের জন্য যে সীমা, তার সঙ্গে দিনের প্রোটিন মিলিয়ে।",
    waitEn: "Logged food carries protein where the portion library knows it.",
    waitBn: "খাবারের তালিকায় প্রোটিন জানা থাকলে লেখা খাবারের সঙ্গে সেটা আসে।",
  },
  fibre: {
    en: "Fibre at its reference", bn: "আঁশ তার সীমায়",
    fromEn: "Read off the day's fibre, which the log carries where a food's is known.",
    fromBn: "দিনের আঁশ থেকে, যেটা কোনো খাবারের জানা থাকলে খাতায় আসে।",
    waitEn: "Fibre arrives with food logged from the portion library.",
    waitBn: "তালিকা থেকে খাবার লিখলে আঁশও সঙ্গে আসে।",
  },
  water: {
    en: "Water", bn: "পানি",
    fromEn: "Read off the glasses tapped in on the log.",
    fromBn: "খাতায় যতগুলো গ্লাস চাপা হয়েছে, সেখান থেকে।",
    waitEn: "A tap per glass on the log fills this.",
    waitBn: "খাতায় গ্লাসপ্রতি একটা চাপ দিলেই এটা ভরবে।",
  },
  steps: {
    en: "Moved as much as you usually do", bn: "চলাফেরা যতটা করেন ততটা",
    fromEn: "Read off the day's step count against your own middle day.",
    fromBn: "আপনার নিজের মাঝারি দিনের সঙ্গে ওই দিনের হাঁটার হিসাব মিলিয়ে।",
    waitEn: "Steps go on the log by hand or from whatever your phone already counts.",
    waitBn: "হাঁটার হিসাব হাতে লেখা যায়, বা ফোন যা গোনে সেখান থেকে নেওয়া যায়।",
  },
  sleep: {
    en: "Slept the night", bn: "রাতের ঘুম",
    fromEn: "Read off the hours on each day's row.",
    fromBn: "প্রতিদিনের সারিতে লেখা ঘণ্টা থেকে।",
    waitEn: "The log form has no hours field yet. A sheet brought in on the import page can carry them, and the nutrition page reads a night against what you ate on the day it ended.",
    waitBn: "খাতার ফর্মে এখনো ঘণ্টার ঘর নেই। আমদানির পাতায় আনা শিটে ঘণ্টা থাকতে পারে, আর পুষ্টির পাতায় একটা রাতের সঙ্গে মেলানো হয় যে দিনে সেটা শেষ হয়েছে সেই দিনের খাওয়া।",
  },
};

/** What each measurement site is called. The words are here
    because nothing else on this page prints them, and they are
    the words the tape guide on `/tools/diet/you` already uses. */
const SITES: Record<MeasureId, { en: string; bn: string }> = {
  waist: { en: "Waist", bn: "কোমর" },
  hip: { en: "Hip", bn: "নিতম্ব" },
  chest: { en: "Chest", bn: "বুক" },
  thigh: { en: "Thigh", bn: "ঊরু" },
  arm: { en: "Arm", bn: "বাহু" },
  neck: { en: "Neck", bn: "গলা" },
};

const round = (n: number): number => Math.round(n);
const one = (n: number): string => n.toFixed(1);
const two = (n: number): string => n.toFixed(2);

/** What a day had to reach, in that column's own unit.

    BOTH HALVES ARE BUILT HERE rather than one being chosen, for
    the reason `lang.tsx` opens with: the server cannot see the
    preference, so the markup carries both and the stylesheet
    shows one. */
function markSaid(h: Habit): { en: string; bn: string } | null {
  if (h.mark == null) return null;
  const en = (v: number): string => digits(Math.round(v), "en");
  const bn = (v: number): string => digits(Math.round(v), "bn");
  switch (h.id) {
    case "protein":
    case "fibre":
      return { en: `${en(h.mark)} g or more`, bn: `${bn(h.mark)} গ্রাম বা বেশি` };
    case "water":
      return {
        en: `${en(h.mark / GLASS_ML)} glasses or more`,
        bn: `${bn(h.mark / GLASS_ML)} গ্লাস বা বেশি`,
      };
    case "steps":
      return { en: `${en(h.mark)} steps or more`, bn: `${bn(h.mark)} কদম বা বেশি` };
    case "sleep":
      return { en: `${en(h.mark)} hours or more`, bn: `${bn(h.mark)} ঘণ্টা বা বেশি` };
    default:
      return null;
  }
}

export function HabitsPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);

  const today = isoDate();

  useEffect(() => {
    let alive = true;
    const paint = (): void => {
      void who().then((f) => { if (alive) { setW(f); setAnswered(true); } });
    };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { alive = false; document.removeEventListener("account:changed", paint); };
  }, []);

  useEffect(() => {
    if (!w) return;
    let alive = true;
    /* The phases as well, and they are not optional: a rate
       fitted across a change of protocol is a step in body water
       fitted as though it were a rate, which section 10 is the
       whole of. `weighings()` in the forecast takes them and
       leaves a settling stretch drawn rather than fitted. */
    void Promise.all([
      getProfile(w), getDays(w, shiftDate(today, -365)), getPhases(w),
    ]).then(([p, d, f]) => {
      if (alive) { setProfile(p); setDays(d); setPhases(f); }
    });
    return () => { alive = false; };
  }, [w, today]);

  /* THE PROTEIN FLOOR IS PER KILOGRAM OF LEAN MASS, so a row with
     no tape behind it says what it is waiting for rather than
     working a floor out of bodyweight. `fatEstimate()` falls back
     to Deurenberg off BMI, which is a wider band than the Navy
     method and is still an estimate of the right quantity. */
  const body: Body | null = useMemo(() => {
    const latest = [...days].reverse().find((d) => d.weightKg != null);
    if (!profile?.height_cm || !profile.birth_year || !latest?.weightKg) return null;
    return {
      heightCm: profile.height_cm,
      weightKg: latest.weightKg,
      ageYears: new Date().getUTCFullYear() - profile.birth_year,
      sex: profile.sex ?? "male",
      ancestry: profile.ancestry ?? "general",
      waistCm: [...days].reverse().find((d) => d.waistCm != null)?.waistCm,
      neckCm: [...days].reverse().find((d) => d.neckCm != null)?.neckCm,
      hipCm: [...days].reverse().find((d) => d.hipCm != null)?.hipCm,
    };
  }, [profile, days]);

  const rows = useMemo(() => habits({
    days,
    todayISO: today,
    leanKg: body ? fatEstimate(body).leanKg : undefined,
    ratePct: profile?.goal_rate ?? 0.5,
  }), [days, today, body, profile]);

  /* DRAWN AND FITTED ARE TWO LISTS, and `weighings()` is the one
     place that says which is which. A rate fitted across a
     marked day or a settling stretch is a step in body water
     fitted as though it were a rate. The tape reading takes the
     trend, because one weighing is real weight plus a kilo or
     two of water. */
  const { drawn, fittable } = useMemo(() => weighings({
    days, dayOf: dayNumber, phases, today: dayNumber(today),
  }), [days, phases, today]);

  const moved = useMemo(() => movement({
    days, todayISO: today, weights: fittable, dayOf: dayNumber,
    weightKg: body?.weightKg,
  }), [days, today, fittable, body]);

  const taped = useMemo(() => tape({
    days, trend: trend(drawn), dayOf: dayNumber, today: dayNumber(today),
  }), [days, drawn, today]);

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;

  if (!w) {
    return (
      <Invite
        en="A run of days is a run of rows, and those live on your account. Nothing here asks you to do anything new: it is the log you already keep, read back."
        bn="কয়েক দিনের হিসাব মানে কয়েক দিনের সারি, আর সেগুলো আপনার অ্যাকাউন্টে থাকে। এখানে নতুন কিছু করতে বলা হচ্ছে না: আপনি যে খাতাটা এমনিতেই রাখেন, সেটাই পড়ে শোনানো হয়।"
        shows={[
          { en: "Seven daily things read off columns your log already carries, each as a run of days with your best run beside it.",
            bn: "সাতটা রোজকার জিনিস, আপনার খাতায় আগে থেকেই থাকা ঘর থেকে পড়া, প্রতিটির সঙ্গে টানা কত দিন আর সবচেয়ে লম্বা ধারা কত।" },
          { en: "Your walking, your trend and your log over the same three weeks, which is the only way a quiet fall in walking is visible at all.",
            bn: "একই তিন সপ্তাহে আপনার হাঁটা, ওজনের ধারা আর খাতা, আর চুপচাপ হাঁটা কমে যাওয়া কেবল এভাবেই চোখে পড়ে।" },
          { en: "What the tape says beside what the scale did, which is the one kind of stall that is not a stall.",
            bn: "ফিতা কী বলছে আর দাঁড়িপাল্লা কী করেছে, পাশাপাশি, আর আটকে যাওয়ার যে ধরনটা আসলে আটকে যাওয়া নয় সেটা এটাই।" },
          { en: "Where the last fortnight points, as a band and never a date, and what more walking would do to it.",
            bn: "শেষ দুই সপ্তাহ কোন দিকে যাচ্ছে, একটা সীমা হিসেবে, কখনো তারিখ নয়, আর আরও হাঁটলে তাতে কী হবে।" },
        ]}
      />
    );
  }

  return (
    <div className="dt-habits">
      <section>
        <h2><T en="Seven things, and none of them is new" bn="সাতটা জিনিস, একটাও নতুন নয়" /></h2>
        <TBlock
          en={(
            <p className="dt-why">
              Each row is read off a column your log already carries. A day
              counts when it happened, never when a target was met, and a day
              you missed takes nothing away: the best run you have ever had
              stays where it is.
            </p>
          )}
          bn={(
            <p className="dt-why">
              প্রতিটি সারি আপনার খাতায় আগে থেকেই থাকা এক একটা ঘর থেকে পড়া। যেদিন
              কাজটা হয়েছে সেদিন গোনা হয়, লক্ষ্য ছোঁয়া হয়েছে কিনা তা দিয়ে নয়, আর যে
              দিনটা বাদ গেছে সেটা কিছু কেড়ে নেয় না: আপনার সবচেয়ে লম্বা ধারাটা যেখানে
              ছিল সেখানেই থাকে।
            </p>
          )}
        />

        <ul className="dt-habit-list">
          {rows.map((h) => {
            const row = ROWS[h.id];
            const mark = markSaid(h);
            return (
              <li key={h.id} className="dt-habit">
                <span className="dt-habit-name"><T en={row.en} bn={row.bn} /></span>

                {h.read === 0 ? (
                  <span className="dt-habit-said">
                    {h.needs === "lean" ? (
                      <Waiting
                        en="This needs a waist and a neck measurement, or a height and a weight, before there is a floor to be over."
                        bn="এর জন্য কোমর আর গলার মাপ লাগবে, নয়তো উচ্চতা আর ওজন, তবেই একটা সীমা পাওয়া যাবে।"
                      />
                    ) : h.needs === "history" ? (
                      <Waiting
                        en="Seven days with a step count in them and this reads your own middle day."
                        bn="সাত দিনের হাঁটার হিসাব জমলেই এটা আপনার নিজের মাঝারি দিনটা পড়তে পারবে।"
                      />
                    ) : (
                      <Waiting en={row.waitEn} bn={row.waitBn} />
                    )}
                  </span>
                ) : (
                  <>
                    <Meter
                      value={h.held}
                      total={h.of}
                      label={lang === "bn"
                        ? `${digits(h.held, "bn")} / ${digits(h.of, "bn")} দিন`
                        : `${h.held} of ${h.of} days`}
                    />
                    <span className="dt-habit-said">
                      <T
                        en={`${h.run.current} in a row now. Your best run is ${h.run.best}, and ${h.run.total} days in all.`}
                        bn={`এখন টানা ${digits(h.run.current, "bn")} দিন। সবচেয়ে লম্বা ধারা ${digits(h.run.best, "bn")} দিন, আর সব মিলিয়ে ${digits(h.run.total, "bn")} দিন।`}
                      />
                    </span>
                  </>
                )}

                <span className="dt-habit-from">
                  <T en={row.fromEn} bn={row.fromBn} />
                  {mark ? <T en={` ${mark.en}.`} bn={` ${mark.bn}।`} /> : null}
                  {h.read > 0 && h.read < h.of ? (
                    <T
                      en={` ${h.read} of the last ${h.of} days carry it at all.`}
                      bn={` শেষ ${digits(h.of, "bn")} দিনের ${digits(h.read, "bn")} দিনে এটা লেখা আছে।`}
                    />
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="dt-why">
          <T
            en="The step row's mark is your own middle day over the last eight weeks rather than a borrowed ten thousand, which was a number from a pedometer advertisement and has never been a clinical target. Half of any long run of days sits above your own middle by construction: what this row is really watching is a fortnight of walking less, which is the stall in "
            bn="হাঁটার সারির মাপকাঠি ধার করা দশ হাজার নয়, শেষ আট সপ্তাহে আপনার নিজের মাঝারি দিন। দশ হাজার এসেছিল একটা কদম-গোনা যন্ত্রের বিজ্ঞাপন থেকে, কোনো চিকিৎসার লক্ষ্য থেকে নয়। লম্বা সময়ের অর্ধেক দিন নিজের মাঝারির উপরে থাকবেই: এই সারিটা আসলে খেয়াল রাখে কম হাঁটার একটা পক্ষ, আর সেটাই "
          />
          <Term id="neat" en="NEAT" bn="না ভেবে যে নড়াচড়া" />
          <T en=" falling quietly during a deficit." bn=" ঘাটতির সময় চুপচাপ কমে যাওয়া।" />
        </p>
      </section>

      <Moved it={moved} />
      <Taped it={taped} />

      <ForecastPanel days={days} profile={profile} phases={phases} todayISO={today} />

      {/* Section 31's first bullet. This page prints a protein
          floor and a weight forecast, which are both somebody
          being told to aim at something. `check-diet.ts` does not
          see either, because both come through
          `shared/activity.ts` rather than being called here, so
          this line is here because the plan asks for it rather
          than because a check does. */}
      <Note tone="quiet">
        <TBlock
          en={(
            <p>
              This is general education and not medical advice. Nothing on this
              page is a plan: it is your own log read back to you, and a
              forecast is what the last fortnight implies rather than what will
              happen.
            </p>
          )}
          bn={(
            <p>
              এটি সাধারণ তথ্য, চিকিৎসা পরামর্শ নয়। এই পাতার কিছুই কোনো পরিকল্পনা নয়:
              এটা আপনার নিজের খাতা আপনাকেই পড়ে শোনানো, আর সামনের হিসাব মানে শেষ দুই
              সপ্তাহ যা বলছে, যা ঘটবেই তা নয়।
            </p>
          )}
        />
      </Note>
    </div>
  );
}

    /** SECTION 19'S FOURTH STALL, AS THREE FACTS AND NOT AS A VERDICT.
        Deliberate exercise is the small advertised part of what anybody
        burns; the large part is walking, standing and carrying, and it
        falls quietly during a deficit. Nothing else here can see that,
        because a trend that has flattened while a log has not changed
        looks identical either way.

        The window is the one a stall is read over, so the three readings
        are about the same three weeks. Nothing here is added to a target:
        what a walk changes is the forecast. */
function Moved({ it }: { it: Movement | null }) {
  const band = it?.kcal
    ? {
      low: round(Math.min(Math.abs(it.kcal.low), Math.abs(it.kcal.high))),
      high: round(Math.max(Math.abs(it.kcal.low), Math.abs(it.kcal.high))),
    }
    : null;

  return (
    <section aria-labelledby="dt-moved-h">
      <h2 id="dt-moved-h">
        <T
          en="Three things over the same three weeks"
          bn="একই তিন সপ্তাহে তিনটি জিনিস"
        />
      </h2>
      <p className="dt-why">
        <T
          en="Your walking, your trend and your log, read over one window and over the window before it. They are here together because that is the only way one of them is visible at all."
          bn="আপনার হাঁটা, ওজনের ধারা আর খাতা, একটা সময়ের হিসাব আর তার আগের সমান সময়ের হিসাব। একসঙ্গে রাখা হয়েছে কারণ এদের একটা কেবল এভাবেই চোখে পড়ে।"
        />
      </p>

      {it === null ? (
        <p className="dt-habit-said">
          <Waiting
            en={`${STEP_BASE_LEAST} days with a step count in the last ${STALL_DAYS}, and ${STEP_BASE_LEAST} in the ${STALL_DAYS} before them, and this fills in. Steps go on the log by hand, or from whatever your phone already counts.`}
            bn={`শেষ ${digits(STALL_DAYS, "bn")} দিনের মধ্যে ${digits(STEP_BASE_LEAST, "bn")} দিন আর তার আগের ${digits(STALL_DAYS, "bn")} দিনের মধ্যে ${digits(STEP_BASE_LEAST, "bn")} দিন হাঁটার হিসাব লেখা থাকলে এটা ভরে উঠবে। হাঁটার হিসাব হাতে লেখা যায়, বা ফোন যা গোনে সেখান থেকে নেওয়া যায়।`}
          />
        </p>
      ) : (
        <>
          <ul className="dt-tag-counts">
            {it.now != null && it.before != null ? (
              <li>
                <span>
                  <T en="Walking, your middle day" bn="হাঁটা, আপনার মাঝারি দিন" />
                  <span className="dt-row-src">
                    <T
                      en={`${it.nowDays} of the last ${it.days} days carry a count, and ${it.beforeDays} of the ${it.days} before`}
                      bn={`শেষ ${digits(it.days, "bn")} দিনের ${digits(it.nowDays, "bn")} দিনে হিসাব আছে, আর তার আগের ${digits(it.days, "bn")} দিনের ${digits(it.beforeDays, "bn")} দিনে`}
                    />
                  </span>
                </span>
                <span className="mono">
                  <T
                    en={`${round(it.now)} a day, from ${round(it.before)}`}
                    bn={`দিনে ${digits(round(it.now), "bn")}, আগে ছিল ${digits(round(it.before), "bn")}`}
                  />
                </span>
              </li>
            ) : null}

            <li>
              <span>
                <T en="The trend" bn="ওজনের ধারা" />
                <span className="dt-row-src">
                  <T
                    en={`fitted to ${it.weighings} weighings inside the window`}
                    bn={`এই সময়ের ${digits(it.weighings, "bn")}টি ওজনের উপর বসানো`}
                  />
                </span>
              </span>
              <span className="mono">
                {it.rate ? (
                  <T
                    en={`${it.rate.mid >= 0 ? "+" : ""}${two(it.rate.mid)} kg a week`}
                    bn={`সপ্তাহে ${it.rate.mid >= 0 ? "+" : ""}${digits(two(it.rate.mid), "bn")} কেজি`}
                  />
                ) : (
                  <T en="not readable yet" bn="এখনো পড়া যাচ্ছে না" />
                )}
              </span>
            </li>

            <li>
              <span>
                <T en="What you logged" bn="যা লিখেছেন" />
                <span className="dt-row-src">
                  <T
                    en={`${it.intakeDays} of the last ${it.days} days, and ${it.intakeBeforeDays} of the ${it.days} before`}
                    bn={`শেষ ${digits(it.days, "bn")} দিনের ${digits(it.intakeDays, "bn")} দিন, আর তার আগের ${digits(it.days, "bn")} দিনের ${digits(it.intakeBeforeDays, "bn")} দিন`}
                  />
                </span>
              </span>
              <span className="mono">
                {it.intakeNow != null && it.intakeBefore != null ? (
                  <T
                    en={`${round(it.intakeNow)} kcal a day, from ${round(it.intakeBefore)}`}
                    bn={`দিনে ${digits(round(it.intakeNow), "bn")} ক্যালোরি, আগে ছিল ${digits(round(it.intakeBefore), "bn")}`}
                  />
                ) : (
                  <T en="nothing written down" bn="কিছু লেখা নেই" />
                )}
              </span>
            </li>
          </ul>

          {it.change != null && it.changePct != null && band ? (
            <p className="dt-said">
              <T
                en={`That is about ${round(Math.abs(it.change))} steps a day ${it.change >= 0 ? "more" : "fewer"}, which is ${Math.abs(Math.round(it.changePct * 100))}% of what you were walking. At your weight it is worth roughly ${band.low} to ${band.high} kcal a day ${it.change >= 0 ? "more" : "less"}, and that is a change to the forecast rather than to what you may eat: nothing in this tool is ever added to a target.`}
                bn={`অর্থাৎ দিনে প্রায় ${digits(round(Math.abs(it.change)), "bn")} কদম ${it.change >= 0 ? "বেশি" : "কম"}, যা আগে যতটা হাঁটতেন তার ${digits(Math.abs(Math.round(it.changePct * 100)), "bn")}%। আপনার ওজনে এটার দাম মোটামুটি দিনে ${digits(band.low, "bn")} থেকে ${digits(band.high, "bn")} ক্যালোরি ${it.change >= 0 ? "বেশি" : "কম"}, আর এটা সামনের হিসাব বদলায়, আপনি কতটা খেতে পারেন তা নয়: এই যন্ত্রে কিছুই কখনো লক্ষ্যের সঙ্গে যোগ হয় না।`}
              />
            </p>
          ) : null}

          {it.rate ? (
            <p className="dt-said">
              <T
                en={`Over the same ${it.days} days the trend moved between ${two(it.rate.low)} and ${two(it.rate.high)} kg a week${it.flat ? ", which includes zero" : ""}.`}
                bn={`একই ${digits(it.days, "bn")} দিনে ধারা সপ্তাহে ${digits(two(it.rate.low), "bn")} থেকে ${digits(two(it.rate.high), "bn")} কেজির মধ্যে নড়েছে${it.flat ? ", যার মধ্যে শূন্যও পড়ে" : ""}।`}
              />
            </p>
          ) : (
            <p className="dt-habit-said">
              <Waiting
                en="Three weighings inside the window and a rate can be fitted to them. Fewer has no residual to measure, so there is no error bar and nothing worth drawing beside the walking."
                bn="এই সময়ের মধ্যে তিনটি ওজন হলে তার উপর একটা হার বসানো যায়। তার কম হলে ভুলের মাপ বের করার কিছু থাকে না, তাই সীমাও থাকে না, আর হাঁটার পাশে আঁকার মতো কিছু থাকে না।"
              />
            </p>
          )}

          <p className="dt-why">
            <T
              en="Three facts side by side, and no line drawn between them. Walking that falls during a deficit is the one of the three that is invisible without a step count, and it is the easiest of the four stalls to answer; it is also what a fortnight of rain, a new desk and a bad cold all look like from here, which is why this says what changed and never why."
              bn="তিনটি তথ্য পাশাপাশি, আর তাদের মধ্যে কোনো রেখা টানা হয়নি। ঘাটতির সময় হাঁটা কমে যাওয়াটাই তিনটির মধ্যে একমাত্র জিনিস যা কদমের হিসাব ছাড়া চোখে পড়ে না, আর আটকে যাওয়ার চারটি কারণের মধ্যে এটার উত্তরই সবচেয়ে সহজ; আবার দুই সপ্তাহের বৃষ্টি, নতুন একটা ডেস্ক বা একটা ঠান্ডা, এখান থেকে সবই দেখতে একরকম, তাই এখানে বলা হয় কী বদলেছে, কখনোই কেন নয়।"
            />
          </p>
        </>
      )}
    </section>
  );
}

    /** THE TAPE, BESIDE THE SCALE. Somebody starting resistance training
        in a deficit can add muscle while losing fat, and the scale barely
        moves for weeks: every tracker in the world calls that a stall and
        it is the opposite. `stall()` names it only inside a detected
        stall; this is the same two facts either way, because a reader who
        is not stalled still cannot read this out of a weight. */
function Taped({ it }: { it: Tape | null }) {
  return (
    <section aria-labelledby="dt-tape-said-h">
      <h2 id="dt-tape-said-h">
        <T en="What the tape says" bn="ফিতা কী বলছে" />
      </h2>
      <p className="dt-why">
        <T
          en={`A weight cannot tell you what the weight is made of. A tape can, slowly. This is every site your log carries over the last ${TAPE_SPAN_DAYS} days, first reading against last, beside what the trend did over the same days.`}
          bn={`ওজন দিয়ে বোঝা যায় না ওজনটা কী দিয়ে তৈরি। ফিতা দিয়ে ধীরে ধীরে বোঝা যায়। শেষ ${digits(TAPE_SPAN_DAYS, "bn")} দিনে আপনার খাতায় যত জায়গার মাপ আছে, তার প্রথম আর শেষ মাপ এখানে পাশাপাশি, আর তার পাশে একই দিনগুলোয় ওজনের ধারা কী করেছে।`}
        />
      </p>

      {it === null ? (
        <p className="dt-habit-said">
          <Waiting
            en={`Two measurements of one site, ${TAPE_LEAST_DAYS} days apart or more, and this fills in. The waist, the neck and the hip go on the body page. What matters is the same place each time rather than the exact place: a tape a centimetre high one month and a centimetre low the next invents a change that did not happen.`}
            bn={`একই জায়গার দুটি মাপ, অন্তত ${digits(TAPE_LEAST_DAYS, "bn")} দিনের ব্যবধানে, তাহলেই এটা ভরে উঠবে। কোমর, গলা আর নিতম্বের মাপ শরীরের পাতায় দেওয়া যায়। ঠিক কোন জায়গায় মাপছেন তার চেয়ে বড় কথা প্রতিবার একই জায়গায় মাপা: এক মাসে এক সেন্টিমিটার উপরে আর পরের মাসে এক সেন্টিমিটার নিচে ফিতা বসালে এমন একটা বদল তৈরি হয় যা আসলে ঘটেনি।`}
          />
        </p>
      ) : (
        <>
          <ul className="dt-tag-counts">
            {it.sites.map((s) => (
              <li key={s.id}>
                <span>
                  <T en={SITES[s.id].en} bn={SITES[s.id].bn} />
                  <span className="dt-row-src">
                    <T
                      en={`${one(s.first)} to ${one(s.last)} cm, ${s.readings} readings ${s.days} days apart${s.read ? "" : ", inside what a tape can resolve"}`}
                      bn={`${digits(one(s.first), "bn")} থেকে ${digits(one(s.last), "bn")} সেমি, ${digits(s.days, "bn")} দিনের ব্যবধানে ${digits(s.readings, "bn")}টি মাপ${s.read ? "" : ", ফিতা যতটুকু ধরতে পারে তার ভেতরে"}`}
                    />
                  </span>
                </span>
                <span className="mono">
                  <T
                    en={`${s.change >= 0 ? "+" : ""}${one(s.change)} cm`}
                    bn={`${s.change >= 0 ? "+" : ""}${digits(one(s.change), "bn")} সেমি`}
                  />
                </span>
              </li>
            ))}
          </ul>

          {it.kg === null ? (
            <p className="dt-said">
              <T
                en={`There are not two trend readings inside the same ${it.span} days, so the scale has nothing to put beside this.`}
                bn={`একই ${digits(it.span, "bn")} দিনের মধ্যে ধারার দুটি মাপ নেই, তাই এর পাশে রাখার মতো কিছু দাঁড়িপাল্লার নেই।`}
              />
            </p>
          ) : (
            <p className="dt-said">
              <T
                en={`Over the same ${it.span} days the trend moved ${it.kg >= 0 ? "+" : ""}${two(it.kg)} kg, across ${it.weighings} days of it.`}
                bn={`একই ${digits(it.span, "bn")} দিনে ধারা ${it.kg >= 0 ? "+" : ""}${digits(two(it.kg), "bn")} কেজি সরেছে, তার ${digits(it.weighings, "bn")} দিনের হিসাবে।`}
              />
            </p>
          )}

          <p className="dt-why">
            <T
              en={`A tape measure resolves about ${TAPE_RESOLUTION_CM} cm on one person, so a change smaller than that is the measuring rather than the body, and the rows above say which is which. A waist that comes down while the scale holds still is weight made of something different rather than a stall, and it is the one thing on these pages the tool can settle on its own.`}
              bn={`একজন মানুষের উপর ফিতা মোটামুটি ${digits(TAPE_RESOLUTION_CM, "bn")} সেমি পর্যন্ত ধরতে পারে, তাই তার চেয়ে ছোট বদল শরীরের নয়, মাপার, আর উপরের সারিগুলো বলে দেয় কোনটা কোনটা। দাঁড়িপাল্লা স্থির থাকা অবস্থায় কোমর কমা মানে আটকে যাওয়া নয়, ওজনটা অন্য কিছু দিয়ে তৈরি হচ্ছে, আর এই পাতাগুলোয় এই একটা জিনিসই যন্ত্র নিজে থেকে মীমাংসা করতে পারে।`}
            />
          </p>
        </>
      )}
    </section>
  );
}
