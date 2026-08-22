"use client";

/* ============================================================
   diet/habits-panel.tsx: seven daily things, read off what is
   already logged.

   `DIET.md` sections 11 and 19.

   ---- there is no form on this page, and that is the point ----

   Section 30 sets the test for a target and it holds for a habit:
   if the site cannot measure a thing out of something it already
   holds, the bar would be a decoration. So none of these is a new
   field and none of them is a checklist to tick. Every one is a
   column of `diet_days` that the log form already writes, read
   back as a run of days, and an eighth habit has to name its
   column before it is an eighth habit.

   ---- it counts showing up ----

   `streak()` in `shared/diet.ts` carries the whole argument and
   `habits()` hands its days to that function rather than counting
   a run of its own. What follows from it here: `best` is drawn
   beside `current` on every row, because a number that can only
   fall is a number people stop looking at, and a missed day is
   never a break in something, it is one fewer day in a count.

   ---- and nothing here goes red ----

   Section 31. No flame, no countdown, no colour that means
   failure, and no sentence that praises anybody either: a status
   that praises you is a status people stop reading, which would
   take the honest half down with it.

   ---- a habit with no data is not a failed habit ----

   Every reading has three answers and the third one is why this
   page is legible on the day somebody arrives. A column nothing
   writes yet is a sentence saying what would fill it, never a
   fortnight of noughts. `sleep_hours` is that column today: the
   log form has no hours field, so the row says so and says what
   it would show.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import {
  fatEstimate, type Body, type Day, type Phase,
} from "@reiad/shared/diet";
import {
  GLASS_ML, habits, type Habit, type HabitId,
} from "@reiad/shared/activity";
import {
  who, getDays, getPhases, getProfile, isoDate, shiftDate,
  type Profile, type Who,
} from "../../lib/diet-api";
import { Meter } from "../deck";
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
    waitEn: "The log has no hours field yet, so there is nothing here to read.",
    waitBn: "খাতায় এখনো ঘণ্টার ঘর নেই, তাই এখানে পড়ার মতো কিছু নেই।",
  },
};

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

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;

  if (!w) {
    return (
      <p className="dt-invite">
        <T
          en="A run of days is a run of rows, and those live on your account. Nothing here asks you to do anything new: it is the log you already keep, read back."
          bn="কয়েক দিনের হিসাব মানে কয়েক দিনের সারি, আর সেগুলো আপনার অ্যাকাউন্টে থাকে। এখানে নতুন কিছু করতে বলা হচ্ছে না: আপনি যে খাতাটা এমনিতেই রাখেন, সেটাই পড়ে শোনানো হয়।"
        />
      </p>
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
