"use client";

/* ============================================================
   diet/goal-panel.tsx: the engine, the floors, and the estimate.

   `DIET.md` section 5. Three things here are not preferences.

   THE RATE IS A PERCENTAGE OF BODYWEIGHT, never a number of
   kilos: half a kilo a week is gentle at 110kg and severe at
   55kg.

   THE FLOORS CANNOT BE CROSSED. `target()` clamps and reports
   every bound it hit, and this page prints them. A silent clamp
   is a lie of omission: "we gave you 1500 instead of 1100" is a
   fact the reader needs.

   AND THE ESTIMATE IS A BAND. "You will reach 70kg on 4 March"
   is a lie with a date on it. `projection()` refuses outright
   when the rate's error bar contains zero, because a confident
   number of weeks out of data that cannot tell loss from gain is
   the single most dishonest thing a tool like this can print.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import {
  RATES, bmi, fatEstimate, restingBurn, estimatedBurn, activityFactor,
  learnedBurn, projection, proteinFloor, slopePerWeek, target, whtr,
  type Body, type Day, type FloorHit, type Point,
} from "@reiad/shared/diet";
import {
  who, getDays, getProfile, saveProfile, dayNumber, isoDate, shiftDate,
  type Profile, type Who,
} from "../../lib/diet-api";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field } from "../ui/field";
import { Note } from "../ui/note";
import { T, TBlock, digits, useToolLang } from "./lang";

const FLOOR_WORDS: Record<FloorHit, { en: string; bn: string }> = {
  rate: {
    en: "Your rate was capped at 1% of bodyweight a week. Faster than that raises the risk of gallstones measurably.",
    bn: "আপনার হার সপ্তাহে শরীরের ওজনের ১% এ আটকানো হয়েছে। এর চেয়ে দ্রুত হলে পিত্তথলির পাথরের ঝুঁকি মাপার মতো বাড়ে।",
  },
  resting: {
    en: "The target was raised to your resting burn. A target under what your body costs doing nothing is not a diet plan.",
    bn: "লক্ষ্যটা বাড়িয়ে আপনার বিশ্রামের খরচে আনা হয়েছে। কিছু না করেও শরীরের যা খরচ, তার নিচে লক্ষ্য কোনো পরিকল্পনা নয়।",
  },
  absolute: {
    en: "The target was raised to the absolute floor: 1200 for women, 1500 for men. Below that the tool declines.",
    bn: "লক্ষ্যটা বাড়িয়ে একেবারে সর্বনিম্নে আনা হয়েছে: নারীদের ১২০০, পুরুষদের ১৫০০। এর নিচে যন্ত্রটি রাজি নয়।",
  },
  underweight: {
    en: "No loss goal is offered below BMI 18.5, on either set of cut-offs. Maintenance is what this can do.",
    bn: "বিএমআই ১৮.৫ এর নিচে কোনো ওজন কমানোর লক্ষ্য দেওয়া হয় না, কোনো সীমাতেই। যা করা যায় তা হলো ওজন ধরে রাখা।",
  },
};

export function GoalPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [goalWaist, setGoalWaist] = useState("");
  const [said, setSaid] = useState("");

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
    void Promise.all([getProfile(w), getDays(w, shiftDate(today, -365))])
      .then(([p, d]) => {
        if (!alive) return;
        setProfile(p);
        setDays(d);
        setGoalWaist(p?.goal_waist_cm != null ? String(p.goal_waist_cm) : "");
      });
    return () => { alive = false; };
  }, [w, today]);

  const points: Point[] = useMemo(
    () => days.filter((d) => d.weightKg != null)
      .map((d) => ({ day: dayNumber(d.date), kg: d.weightKg as number })),
    [days],
  );

  const body: Body | null = useMemo(() => {
    const latest = [...points].sort((a, b) => b.day - a.day)[0];
    if (!profile?.height_cm || !profile.birth_year || !latest) return null;
    return {
      heightCm: profile.height_cm,
      weightKg: latest.kg,
      ageYears: new Date().getUTCFullYear() - profile.birth_year,
      sex: profile.sex ?? "male",
      ancestry: profile.ancestry ?? "general",
      waistCm: [...days].reverse().find((d) => d.waistCm != null)?.waistCm,
      neckCm: [...days].reverse().find((d) => d.neckCm != null)?.neckCm,
      hipCm: [...days].reverse().find((d) => d.hipCm != null)?.hipCm,
    };
  }, [profile, points, days]);

  const learned = useMemo(() => learnedBurn(
    points,
    days.filter((d) => d.kcal != null).map((d) => ({ day: dayNumber(d.date), kcal: d.kcal as number })),
  ), [points, days]);

  const engine = useMemo(() => {
    if (!body) return null;
    const fat = fatEstimate(body);
    const rest = restingBurn(body, fat.method === "navy" ? fat.leanKg : undefined);
    const maintenance = learned?.kcal.mid
      ?? estimatedBurn(rest.kcal, activityFactor(profile?.activity ?? "sedentary"));
    const t = target({
      body, maintenance, restingKcal: rest.kcal,
      kind: profile?.goal_kind ?? "maintain",
      ratePct: profile?.goal_rate ?? 0.5,
    });
    return { fat, rest, maintenance, t, learned: !!learned };
  }, [body, learned, profile]);

  const weeks = useMemo(() => {
    if (!body || !profile?.goal_weight_kg) return null;
    const rate = slopePerWeek(points);
    if (!rate) return null;
    return projection({ currentKg: body.weightKg, goalKg: profile.goal_weight_kg, weekly: rate });
  }, [body, profile, points]);

  const set = async (patch: Profile): Promise<void> => {
    if (!w) return;
    setProfile((p) => ({ ...(p ?? {}), ...patch }));
    const ok = await saveProfile(w, { ...(profile ?? {}), ...patch });
    setSaid(ok ? "saved" : "failed");
    window.setTimeout(() => setSaid(""), 1600);
  };

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;
  if (!w) {
    return (
      <p className="dt-invite">
        <T
          en="A goal belongs to an account, so it is there on your phone too. The body page needs none."
          bn="লক্ষ্য অ্যাকাউন্টের সঙ্গে থাকে, তাই ফোনেও পাবেন। শরীরের পাতাটির জন্য অ্যাকাউন্ট লাগে না।"
        />
      </p>
    );
  }

  return (
    <div className="dt-goal">
      <fieldset className="dt-set">
        <legend><T en="What you are doing" bn="আপনি কী করছেন" /></legend>
        <div className="dt-tags" role="group" aria-label="Direction">
          {(["lose", "maintain", "gain"] as const).map((k) => (
            <ChipButton key={k} pressed={(profile?.goal_kind ?? "maintain") === k}
                        onClick={() => void set({ goal_kind: k })}>
              <T
                en={k === "lose" ? "Losing" : k === "gain" ? "Gaining" : "Holding"}
                bn={k === "lose" ? "কমাচ্ছি" : k === "gain" ? "বাড়াচ্ছি" : "ধরে রাখছি"}
              />
            </ChipButton>
          ))}
        </div>

        {(profile?.goal_kind ?? "maintain") !== "maintain" ? (
          <div className="dt-tags" role="group" aria-label="Rate">
            {RATES.map((r) => (
              <ChipButton key={r.key} pressed={(profile?.goal_rate ?? 0.5) === r.high}
                          onClick={() => void set({ goal_rate: r.high })}>
                <T en={`${r.en}, ${r.low} to ${r.high}%`}
                   bn={`${r.bn}, ${digits(r.low, "bn")} থেকে ${digits(r.high, "bn")}%`} />
              </ChipButton>
            ))}
          </div>
        ) : null}
      </fieldset>

      {/* A GOAL WEIGHT IS A NUMBER SOMEBODY READ OFF A CHART, and
          section 2 has already said BMI is nearly useless on its
          own. So the waist is asked for first and the weight is
          offered underneath it. */}
      <fieldset className="dt-set">
        <legend><T en="What you are aiming at" bn="লক্ষ্য কী" /></legend>
        <Field
          id="dt-goal-waist" type="number" inputMode="decimal" step="0.5" min={30} max={250}
          label={<T en="A waist, cm" bn="একটা কোমরের মাপ, সেমি" />}
          hint={(
            <T
              en="Under half your height is the mark with evidence behind it. It moves when the thing you care about moves, and it is measurable weekly."
              bn="উচ্চতার অর্ধেকের কম, এটাই প্রমাণসহ লক্ষ্য। যেটা নিয়ে ভাবছেন সেটা নড়লে এটাও নড়ে, আর প্রতি সপ্তাহেই মাপা যায়।"
            />
          )}
          value={goalWaist}
          onChange={(e) => setGoalWaist(e.target.value)}
          onBlur={() => void set({ goal_waist_cm: Number(goalWaist) || undefined })}
        />
        {profile?.height_cm && Number(goalWaist) ? (
          <p className="dt-hint">
            <T
              en={`That is a waist to height of ${whtr(Number(goalWaist), profile.height_cm).toFixed(2)}.`}
              bn={`সেটা কোমর ও উচ্চতার অনুপাতে ${digits(whtr(Number(goalWaist), profile.height_cm).toFixed(2), "bn")}।`}
            />
          </p>
        ) : null}
        <span className="dt-save" data-state={said ? "saved" : "idle"}>
          <T en="Saved" bn="জমা হয়েছে" />
        </span>
      </fieldset>

      {engine ? (
        <div className="dt-readout">
          <div className="dt-figure dt-figure-lead">
            <h3><T en="Today's target" bn="আজকের লক্ষ্য" /></h3>
            <p className="dt-value">
              <T en={`${engine.t.kcal} kcal`}
                 bn={`${digits(engine.t.kcal, "bn")} ক্যালোরি`} />
            </p>
            <p className="dt-said">
              <T
                en={engine.t.offset === 0 ? "at maintenance"
                  : `${engine.t.offset < 0 ? "under" : "over"} your maintenance by ${Math.abs(engine.t.offset)}`}
                bn={engine.t.offset === 0 ? "খরচের সমান"
                  : `আপনার খরচের চেয়ে ${digits(Math.abs(engine.t.offset), "bn")} ${engine.t.offset < 0 ? "কম" : "বেশি"}`}
              />
            </p>
            <p className="dt-why">
              <T
                en={engine.learned
                  ? "Against what your own log says you burn, not against an equation."
                  : "Against an estimate. After fourteen days of logs this measures instead."}
                bn={engine.learned
                  ? "আপনার নিজের খাতা যা বলে তার বিপরীতে, কোনো সূত্রের বিপরীতে নয়।"
                  : "একটা আন্দাজের বিপরীতে। চৌদ্দ দিন লেখার পর এটি আন্দাজ না করে মাপবে।"}
              />
            </p>
          </div>

          <div className="dt-figure">
            <h3><T en="Protein, at least" bn="প্রোটিন, কমপক্ষে" /></h3>
            <p className="dt-value">
              <T en={`${Math.round(proteinFloor(engine.fat.leanKg, profile?.goal_rate ?? 0.5).low)} g`}
                 bn={`${digits(Math.round(proteinFloor(engine.fat.leanKg, profile?.goal_rate ?? 0.5).low), "bn")} গ্রাম`} />
            </p>
            <p className="dt-why">
              <T
                en="Protein is what decides whether the weight lost is fat or muscle. It is a floor, not a target."
                bn="যে ওজন কমছে তা চর্বি না পেশি, সেটা ঠিক করে প্রোটিন। এটা সর্বনিম্ন, লক্ষ্য নয়।"
              />
            </p>
          </div>

          <div className="dt-figure">
            <h3><T en="How long" bn="কত দিন" /></h3>
            <p className="dt-value">
              {weeks
                ? <T en={`${Math.round(weeks.low)} to ${Math.round(weeks.high)} weeks`}
                     bn={`${digits(Math.round(weeks.low), "bn")} থেকে ${digits(Math.round(weeks.high), "bn")} সপ্তাহ`} />
                : <T en="Not yet" bn="এখনো নয়" />}
            </p>
            <p className="dt-why">
              <T
                en={weeks
                  ? "A band rather than a date, from your own week to week variation, and it assumes nothing changes. Your maintenance will fall on the way, so this is recomputed every time it is drawn."
                  : "A goal weight and a few weeks of weighings give a range. There is no date here and there never will be: a date would be a lie with a number on it."}
                bn={weeks
                  ? "তারিখ নয়, একটা সীমা, আপনার নিজের সাপ্তাহিক ওঠানামা থেকে, আর ধরে নেওয়া হয়েছে কিছুই বদলাবে না। পথে আপনার খরচ কমবে, তাই প্রতিবার আঁকার সময় এটা নতুন করে হিসাব হয়।"
                  : "একটা লক্ষ্য ওজন আর কয়েক সপ্তাহের মাপ দিলে একটা সীমা আসবে। এখানে কোনো তারিখ নেই, থাকবেও না: তারিখ মানে সংখ্যা বসানো মিথ্যে।"}
              />
            </p>
          </div>
        </div>
      ) : (
        <p className="dt-hint">
          <T
            en="Your height, birth year and a weighing give a target. The body page is where the first two go."
            bn="উচ্চতা, জন্মসাল আর একটা ওজন দিলে লক্ষ্য আসবে। প্রথম দুটো শরীরের পাতায় দিতে হয়।"
          />
        </p>
      )}

      {/* Every bound that bound, in the order applied. A silent
          clamp is a lie of omission. */}
      {engine?.t.floors.length ? (
        <Note tone="warn" title={<T en="The tool changed your number" bn="যন্ত্রটি আপনার সংখ্যা বদলেছে" />}>
          <ul>
            {engine.t.floors.map((f) => (
              <li key={f}><T en={FLOOR_WORDS[f].en} bn={FLOOR_WORDS[f].bn} /></li>
            ))}
          </ul>
        </Note>
      ) : null}

      <Note tone="quiet">
        <TBlock
          en={<p>This is general education and not medical advice. If you take
            insulin or a sulfonylurea, speak to a clinician before starting a
            deficit: it changes glucose control quickly and only they can change
            a dose.</p>}
          bn={<p>এটি সাধারণ তথ্য, চিকিৎসা পরামর্শ নয়। আপনি ইনসুলিন বা সালফোনাইলইউরিয়া
            নিলে ঘাটতি শুরুর আগে চিকিৎসকের সঙ্গে কথা বলুন: এটি রক্তের চিনি দ্রুত
            বদলায়, আর ডোজ কেবল তাঁরাই বদলাতে পারেন।</p>}
        />
      </Note>
    </div>
  );
}
