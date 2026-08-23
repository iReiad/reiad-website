"use client";

/* ============================================================
   diet/goal-panel.tsx: the engine, the floors, and the estimate.

   `DIET.md` sections 5 and 6. Four things here are not
   preferences.

   THE RATE IS A PERCENTAGE OF BODYWEIGHT, never a number of
   kilos: half a kilo a week is gentle at 110kg and severe at
   55kg.

   THE FLOORS CANNOT BE CROSSED. `target()` clamps and reports
   every bound it hit, and this page prints them. A silent clamp
   is a lie of omission: "we gave you 1500 instead of 1100" is a
   fact the reader needs. The surplus ceiling is one of them and
   binds going UP, which is section 6's refusal of a bulk.

   AND THE ESTIMATE IS A BAND. "You will reach 70kg on 4 March"
   is a lie with a date on it. `projection()` refuses outright
   when the rate's error bar contains zero, because a confident
   number of weeks out of data that cannot tell loss from gain is
   the single most dishonest thing a tool like this can print.

   HOLDING IS A PHASE AND ITS DEFAULT IS SILENCE. Section 6: a
   trend inside the band gets no message, no colour and no
   notification, and that silence is the feature rather than an
   unfinished state. Two weeks outside is one line; a full band's
   width outside offers the gentlest phase in `RATES`, and
   nothing else on this page ever raises its voice.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import {
  LOWEST_RATE_PCT, RATES, MAX_GAIN_PCT_PER_WEEK, MAX_LOSS_PCT_PER_WEEK,
  MAX_SURPLUS_KCAL,
  bandWatch, bmi, fatEstimate, gainWeekOne, restingBurn, estimatedBurn,
  activityFactor, learnedHere, projection, proteinFloor, slopePerWeek,
  suggestBand, target, trend, weighings, whtr,
  type Body, type Day, type FloorHit, type MaintenanceBand, type Phase,
  type Rate,
} from "@reiad/shared/diet";
import {
  who, getDays, getPhases, getProfile, saveProfile, dayNumber, isoDate, shiftDate,
  type Profile, type Who,
} from "../../lib/diet-api";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field } from "../ui/field";
import { Note } from "../ui/note";
import { Term } from "./glossary";
import { T, TBlock, digits, useToolLang } from "./lang";
import { Invite } from "./invite";

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
  /* THE ONE THAT BINDS GOING UP. A percentage of bodyweight is
     the proxy for it and drifts above it past about 100kg. */
  surplus: {
    en: `The surplus was held at ${MAX_SURPLUS_KCAL} kcal a day. Above roughly that, a surplus adds fat faster than any body adds muscle, so the extra is not the thing you are trying to gain.`,
    bn: `বাড়তি খাওয়া দিনে ${MAX_SURPLUS_KCAL} ক্যালোরিতে আটকানো হয়েছে। এর বেশি হলে পেশির চেয়ে চর্বি দ্রুত বাড়ে, তাই বাড়তিটুকু আপনি যা বাড়াতে চান তা নয়।`,
  },
};

/** Which band of `RATES` a stored rate is in, rather than which
    chip last wrote it. A chip writes the TOP of its band, and
    the maintenance offer writes `LOWEST_RATE_PCT`, which is
    inside gentle and equal to no chip's top: matching on
    equality alone left an accepted offer with no chip lit. */
const bandOf = (rate: number): Rate | null =>
  RATES.find((r, i) => rate <= r.high && (i === 0 || rate > RATES[i - 1].high)) ?? null;

const oneDp = (kg: number): number => Math.round(kg * 10) / 10;

export function GoalPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [goalWaist, setGoalWaist] = useState("");
  const [bandLow, setBandLow] = useState("");
  const [bandHigh, setBandHigh] = useState("");
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
    void Promise.all([getProfile(w), getDays(w, shiftDate(today, -365)), getPhases(w)])
      .then(([p, d, ph]) => {
        if (!alive) return;
        setProfile(p);
        setDays(d);
        setPhases(ph);
        setGoalWaist(p?.goal_waist_cm != null ? String(p.goal_waist_cm) : "");
        setBandLow(p?.band_low_kg != null ? String(p.band_low_kg) : "");
        setBandHigh(p?.band_high_kg != null ? String(p.band_high_kg) : "");
      });
    return () => { alive = false; };
  }, [w, today]);

  const now = dayNumber(today);

  /* DRAWN AND FITTED ARE TWO LISTS. This page fitted a rate
     through everything it had, so a fortnight of fever water and
     a settling window after a change of protocol both went into
     the slope the projection is built on. `weighings()` is the
     one place that says which is which. */
  const { drawn, fittable } = useMemo(
    () => weighings({ days, dayOf: dayNumber, phases, today: now }),
    [days, phases, now],
  );

  const line = useMemo(() => trend(drawn), [drawn]);
  const trendKg = line.length ? line[line.length - 1].kg : null;

  const body: Body | null = useMemo(() => {
    const latest = [...drawn].sort((a, b) => b.day - a.day)[0];
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
  }, [profile, drawn, days]);

  const intakes = useMemo(
    () => days.filter((d) => d.kcal != null)
      .map((d) => ({ day: dayNumber(d.date), kcal: d.kcal as number })),
    [days],
  );

  /* PER STRETCH, NEVER ACROSS ONE. This was `learnedBurn()` over
     the whole run, so a window with a complete fast in it
     returned a maintenance built on an intake nobody ate, and
     the day's target was computed from it. */
  const learned = useMemo(
    () => learnedHere({ weights: fittable, intakes, phases, today: now }),
    [fittable, intakes, phases, now],
  );

  const kind = profile?.goal_kind ?? "maintain";

  const engine = useMemo(() => {
    if (!body) return null;
    const fat = fatEstimate(body);
    const rest = restingBurn(body, fat.method === "navy" ? fat.leanKg : undefined);
    const maintenance = learned?.kcal.mid
      ?? estimatedBurn(rest.kcal, activityFactor(profile?.activity ?? "sedentary"));
    const t = target({
      body, maintenance, restingKcal: rest.kcal, kind,
      ratePct: profile?.goal_rate ?? 0.5,
    });
    return { fat, rest, maintenance: Math.round(maintenance), t, learned: !!learned };
  }, [body, learned, profile, kind]);

  /* THE RATES OFFERED ARE THE RATES THE DATABASE WILL TAKE.
     `MAX_GAIN_PCT_PER_WEEK` is 0.5 and there is a constraint on
     the column saying the same thing, so pressing Fast while
     gaining wrote 1.0, was refused, and reported Saved. Gaining
     is capped here and the reason is written under the chips
     rather than left to a rejected write. */
  const cap = kind === "gain" ? MAX_GAIN_PCT_PER_WEEK : MAX_LOSS_PCT_PER_WEEK;
  const offered = useMemo(() => RATES.filter((r) => r.high <= cap), [cap]);
  const inBand = bandOf(Math.min(profile?.goal_rate ?? 0.5, cap));

  const weeks = useMemo(() => {
    if (!body || !profile?.goal_weight_kg) return null;
    const rate = slopePerWeek(fittable);
    if (!rate) return null;
    return projection({ currentKg: body.weightKg, goalKg: profile.goal_weight_kg, weekly: rate });
  }, [body, profile, fittable]);

  /* THE BAND IS THE READER'S, and it is only ever read from the
     two columns. A band the tool invented and did not write down
     would be a band nobody agreed to. */
  const band: MaintenanceBand | null =
    profile?.band_low_kg != null && profile.band_high_kg != null
      ? { lowKg: profile.band_low_kg, highKg: profile.band_high_kg }
      : null;

  /* ONLY WHILE HOLDING. A reader who has deliberately started a
     deficit has left the band on purpose, and a line telling
     them so every week is the noise section 6 is against. */
  const watch = useMemo(
    () => (band && kind === "maintain"
      ? bandWatch({ band, weights: fittable, today: now })
      : null),
    [band, kind, fittable, now],
  );

  /* WEEK ONE LIES IN THE GAINING DIRECTION TOO. A carbohydrate
     increase refills the glycogen store and puts a kilo or two
     on the scale in a week containing no new tissue at all, and
     a reader who does not know that reads it as fat and stops.
     The phase that was running is handed over, because somebody
     arriving off keto has the whole store to put back. */
  const running = useMemo(() => {
    const last = [...phases].sort((a, b) => a.startDay - b.startDay).pop();
    if (!last || (last.endDay ?? now) < now) return null;
    const inside = intakes.filter((d) => d.day >= last.startDay);
    return {
      protocol: last.protocol,
      days: now - last.startDay,
      intake: inside.length
        ? inside.reduce((a, d) => a + d.kcal, 0) / inside.length
        : undefined,
    };
  }, [phases, intakes, now]);

  const firstWeek = useMemo(() => {
    if (kind !== "gain" || !body || !engine) return null;
    return gainWeekOne({
      weightKg: body.weightKg,
      burn: engine.maintenance,
      intake: engine.t.kcal,
      from: running,
    });
  }, [kind, body, engine, running]);

  const set = async (patch: Profile): Promise<void> => {
    if (!w) return;
    const before = profile;
    setProfile((p) => ({ ...(p ?? {}), ...patch }));
    const ok = await saveProfile(w, { ...(profile ?? {}), ...patch });
    /* PUT IT BACK IF IT DID NOT LAND. The optimistic update left
       the chip looking pressed until a reload, over a row the
       database had refused, so the page and the account
       disagreed and only the page was on screen. */
    if (!ok) setProfile(before);
    setSaid(ok ? "saved" : "failed");
    window.setTimeout(() => setSaid(""), ok ? 1600 : 4000);
  };

  const proposeBand = (): void => {
    if (trendKg == null) return;
    const b = suggestBand(trendKg);
    setBandLow(String(b.lowKg));
    setBandHigh(String(b.highKg));
    void set({ band_low_kg: b.lowKg, band_high_kg: b.highKg });
  };

  const takeOffer = (): void => {
    if (!watch?.offer) return;
    void set({ goal_kind: watch.offer.kind, goal_rate: watch.offer.ratePct });
  };

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;
  if (!w) {
    return (
      <Invite
        en="A goal belongs to an account, so it is there on your phone too. The body page needs none."
        bn="লক্ষ্য অ্যাকাউন্টের সঙ্গে থাকে, তাই ফোনেও পাবেন। শরীরের পাতাটির জন্য অ্যাকাউন্ট লাগে না।"
        shows={[
          { en: "A rate as a percentage of bodyweight, with the floors this tool will not cross named where they bind.",
            bn: "ওজনের শতকরা হিসেবে গতি, আর যে সীমাগুলো এই যন্ত্র পার হবে না সেগুলো যেখানে আটকায় সেখানেই বলা।" },
          { en: "How long it will take as a band rather than a date, because a date is a number nobody can know.",
            bn: "কত দিন লাগবে, তারিখ নয়, একটা সীমার মধ্যে, কারণ তারিখ এমন একটা সংখ্যা যা কেউ জানে না।" },
          { en: "A maintenance band once you get there, which says nothing at all while you are inside it.",
            bn: "লক্ষ্যে পৌঁছালে ধরে রাখার একটা সীমা, যার ভেতরে থাকলে কিছুই বলা হয় না।" },
          { en: "The same engine reversed if you are gaining, with a ceiling on the surplus and the protein floor that matters more there.",
            bn: "ওজন বাড়াতে চাইলে একই হিসাব উল্টো দিকে, বাড়তি খাওয়ার একটা ছাদ আর সেখানে বেশি জরুরি প্রোটিনের সীমা সহ।" },
        ]}
      />
    );
  }

  return (
    <div className="dt-goal">
      <fieldset className="dt-set">
        <legend><T en="What you are doing" bn="আপনি কী করছেন" /></legend>
        <div className="dt-tags" role="group"
             aria-label={lang === "bn" ? "দিক" : "Direction"}>
          {(["lose", "maintain", "gain"] as const).map((k) => (
            <ChipButton key={k} pressed={kind === k}
                        onClick={() => void set({ goal_kind: k })}>
              <T
                en={k === "lose" ? "Losing" : k === "gain" ? "Gaining" : "Holding"}
                bn={k === "lose" ? "কমাচ্ছি" : k === "gain" ? "বাড়াচ্ছি" : "ধরে রাখছি"}
              />
            </ChipButton>
          ))}
        </div>

        {kind !== "maintain" ? (
          <div className="dt-tags" role="group"
               aria-label={lang === "bn" ? "হার" : "Rate"}>
            {offered.map((r) => (
              <ChipButton key={r.key} pressed={inBand?.key === r.key}
                          onClick={() => void set({ goal_rate: r.high })}>
                <T en={`${r.en}, ${r.low} to ${r.high}%`}
                   bn={`${r.bn}, ${digits(r.low, "bn")} থেকে ${digits(r.high, "bn")}%`} />
              </ChipButton>
            ))}
          </div>
        ) : null}

        {kind === "gain" ? (
          <p className="dt-hint">
            <T
              en={`Half a percent a week is the ceiling for gaining, and it is not a motivation setting: above roughly ${MAX_SURPLUS_KCAL} kcal a day, a surplus adds fat faster than any body adds muscle, whatever the training. There is no bulk here for the same reason there is no crash diet.`}
              bn={`বাড়ানোর সর্বোচ্চ হার সপ্তাহে শূন্য দশমিক পাঁচ শতাংশ, আর এটা ইচ্ছার ব্যাপার নয়: দিনে ${digits(MAX_SURPLUS_KCAL, "bn")} ক্যালোরির বেশি বাড়তি খেলে যত অনুশীলনই হোক, পেশির চেয়ে চর্বি দ্রুত বাড়ে। যে কারণে এখানে হুট করে কমানোর ব্যবস্থা নেই, সেই একই কারণে হুট করে বাড়ানোরও নেই।`}
            />
          </p>
        ) : null}
      </fieldset>

      {/* HOLDING IS A BAND AND NOT A NUMBER. Section 6: a weight
          is a line the scale crosses twice a day, so a tool that
          holds somebody to one is a tool that is wrong most
          mornings. */}
      {kind === "maintain" ? (
        <fieldset className="dt-set">
          <legend><T en="The band you are holding" bn="যে সীমার মধ্যে থাকছেন" /></legend>
          <div className="dt-measure-row" role="group"
               aria-label={lang === "bn" ? "সীমা" : "The band"}>
            <Field
              id="dt-band-low" type="number" inputMode="decimal" step="0.1" min={25} max={300}
              label={<T en="Lower edge, kg" bn="নিচের সীমা, কেজি" />}
              value={bandLow}
              onChange={(e) => setBandLow(e.target.value)}
              onBlur={() => void set({ band_low_kg: Number(bandLow) || undefined })}
            />
            <Field
              id="dt-band-high" type="number" inputMode="decimal" step="0.1" min={25} max={300}
              label={<T en="Upper edge, kg" bn="উপরের সীমা, কেজি" />}
              value={bandHigh}
              onChange={(e) => setBandHigh(e.target.value)}
              onBlur={() => void set({ band_high_kg: Number(bandHigh) || undefined })}
            />
            {trendKg != null ? (
              <Button kind="soft" size="sm" onClick={proposeBand}>
                <T en="Set one around where I am" bn="আমি এখন যেখানে আছি, সেখানেই বসান" />
              </Button>
            ) : null}
          </div>
          <p className="dt-hint">
            <T
              en="Two to three kilos wide. Anything narrower is narrower than an ordinary day's swing, so it would be left every week and the tool would have something to say every week, which is the thing this phase exists to stop."
              bn="দুই থেকে তিন কেজি চওড়া। এর চেয়ে সরু হলে সেটা সাধারণ দিনের ওঠানামার চেয়েও সরু হয়ে যায়, ফলে প্রতি সপ্তাহেই সীমা পেরোবে আর প্রতি সপ্তাহেই যন্ত্রটির কিছু বলার থাকবে। এই ধাপটা তো ঠিক সেটাই থামানোর জন্য।"
            />
          </p>
        </fieldset>
      ) : null}

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
        {/* THE WORD FOLLOWS THE ANSWER. This rendered "Saved"
            for `said` of any kind, including "failed", so a
            write the database refused reported success. */}
        <span className="dt-save" data-state={said || "idle"}
              role="status" aria-live="polite">
          {said === "failed"
            ? <T en="Not saved. Nothing changed." bn="জমা হয়নি। কিছুই বদলায়নি।" />
            : said === "saved"
              ? <T en="Saved" bn="জমা হয়েছে" />
              : null}
        </span>
      </fieldset>

      {engine ? (
        <div className="dt-readout">
        <h2 className="dt-readout-h"><T en="What that gives you" bn="এতে আপনি যা পাচ্ছেন" /></h2>
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
              <T en={`${Math.round(proteinFloor(engine.fat.leanKg, engine.t.ratePct).low)} g`}
                 bn={`${digits(Math.round(proteinFloor(engine.fat.leanKg, engine.t.ratePct).low), "bn")} গ্রাম`} />
            </p>
            <p className="dt-why">
              <T
                en={kind === "gain"
                  ? "The same floor as in a deficit, and it matters more here: it is most of what decides whether the weight you add is muscle or fat."
                  : "Protein is what decides whether the weight lost is fat or muscle. It is a floor, not a target."}
                bn={kind === "gain"
                  ? "ঘাটতির সময় যে সর্বনিম্ন, এখানেও সেটাই, আর এখানে এটা আরও বেশি জরুরি: যে ওজন বাড়ছে তা পেশি না চর্বি, তার বেশির ভাগটাই এটা ঠিক করে।"
                  : "যে ওজন কমছে তা চর্বি না পেশি, সেটা ঠিক করে প্রোটিন। এটা সর্বনিম্ন, লক্ষ্য নয়।"}
              />
            </p>
          </div>

          {/* WHAT WEEK ONE OF A SURPLUS ACTUALLY DOES. Section 7
              run backwards, and the number a gainer needs before
              the week rather than after it. */}
          {kind === "gain" && firstWeek ? (
            <div className="dt-figure">
              <h3><T en="The first week" bn="প্রথম সপ্তাহ" /></h3>
              <p className="dt-value">
                <T
                  en={`+${oneDp(firstWeek.scale.low)} to ${oneDp(firstWeek.scale.high)} kg`}
                  bn={`+${digits(oneDp(firstWeek.scale.low), "bn")} থেকে ${digits(oneDp(firstWeek.scale.high), "bn")} কেজি`}
                />
              </p>
              <p className="dt-said">
                <T
                  en={`about ${oneDp(firstWeek.tissue)} kg of that is new tissue`}
                  bn={`তার মধ্যে নতুন শরীর মোটামুটি ${digits(oneDp(firstWeek.tissue), "bn")} কেজি`}
                />
              </p>
              <p className="dt-why">
                <T
                  en={`Roughly ${Math.round(firstWeek.refillShare * 100)}% of that first week is refilled `}
                  bn={`প্রথম সপ্তাহের মোটামুটি ${digits(Math.round(firstWeek.refillShare * 100), "bn")} শতাংশই আবার ভরে ওঠা `}
                />
                <Term id="glycogen" en="glycogen and its water" bn="গ্লাইকোজেন আর তার পানি" />
                <T
                  en=", plus a gut carrying more food than it was. It is not fat and it is not muscle, it comes back in the first few days whatever you do, and it is the reason week one of a gain reads as a failure to anybody who was not told."
                  bn=", আর তার সঙ্গে পেটে আগের চেয়ে বেশি খাবার। এটা চর্বিও নয়, পেশিও নয়, যা-ই করুন প্রথম কয়েক দিনেই ফিরে আসে, আর কাউকে আগে না বললে ওজন বাড়ানোর প্রথম সপ্তাহটা তার কাছে ব্যর্থতা মনে হয় এই কারণেই।"
                />
              </p>
            </div>
          ) : null}

          {/* WHERE THE TREND IS AGAINST THE BAND. Printed on the
              page a reader opened deliberately, and nowhere else:
              section 6's silence is about messages, colours and
              notifications, not about the figure being unavailable
              to somebody who came looking for it. */}
          {kind === "maintain" ? (
            watch ? (
              <div className="dt-figure">
                <h3><T en="Where the trend is" bn="ধারা কোথায় আছে" /></h3>
                <p className="dt-value">
                  <T en={`${oneDp(watch.trendKg)} kg`}
                     bn={`${digits(oneDp(watch.trendKg), "bn")} কেজি`} />
                </p>
                <p className="dt-said">
                  <T
                    en={watch.where === "inside"
                      ? "inside your band"
                      : `${oneDp(watch.outByKg)} kg ${watch.where} it`}
                    bn={watch.where === "inside"
                      ? "আপনার সীমার মধ্যে"
                      : `সীমার ${watch.where === "above" ? "উপরে" : "নিচে"} ${digits(oneDp(watch.outByKg), "bn")} কেজি`}
                  />
                </p>
                <p className="dt-why">
                  <T
                    en="The trend, not this morning's reading. Nothing here reacts to one weighing, and a band is exactly where that would go wrong most often."
                    bn="এটা ধারা, আজ সকালের মাপ নয়। এখানে কিছুই একটা মাপ দেখে সাড়া দেয় না, আর সীমার বেলায় সেটা করলেই সবচেয়ে বেশি ভুল হতো।"
                  />
                </p>
              </div>
            ) : (
              <div className="dt-figure dt-figure-empty">
                <h3><T en="Where the trend is" bn="ধারা কোথায় আছে" /></h3>
                <p className="dt-value dt-value-ghost" aria-hidden="true">&ndash;</p>
                <p className="dt-said">
                  <T
                    en={band
                      ? "Waiting for a weighing. Three a week is enough for this."
                      : "Waiting for a band. Set one above and this reads against it."}
                    bn={band
                      ? "একটা ওজনের অপেক্ষা। সপ্তাহে তিন দিন মাপলেই এর জন্য যথেষ্ট।"
                      : "একটা সীমার অপেক্ষা। উপরে বসিয়ে দিলে এটা তার বিপরীতে পড়বে।"}
                  />
                </p>
              </div>
            )
          ) : (
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
          )}

          {/* THE HONEST SENTENCE, ONCE, WHERE THE PROJECTION
              ENDS. Section 6 puts it here and nowhere else, and
              `check-diet.ts` fails on a second copy: said twice
              it is a slogan, and said where a reader is not
              already looking at how long this will take it is a
              scare. */}
          <p className="dt-readout-foot">
            <T
              en="Most people regain a meaningful part of what they lose, and the strongest predictor of not doing so is continuing to weigh and log after the goal is reached. That is why holding is a built phase here rather than an empty screen."
              bn="বেশির ভাগ মানুষ যা কমান তার একটা বড় অংশ আবার ফিরে পান। যাঁরা ফিরে পান না, তাঁদের বেলায় সবচেয়ে বড় মিল একটাই: লক্ষ্যে পৌঁছানোর পরেও তাঁরা ওজন মাপা আর খাতা লেখা চালিয়ে যান। এই কারণেই এখানে ধরে রাখাটা সত্যিকারের একটা ধাপ, খালি একটা পাতা নয়।"
            />
          </p>
        </div>
      ) : (
        <p className="dt-hint">
          <T
            en="Your height, birth year and a weighing give a target. The body page is where the first two go."
            bn="উচ্চতা, জন্মসাল আর একটা ওজন দিলে লক্ষ্য আসবে। প্রথম দুটো শরীরের পাতায় দিতে হয়।"
          />
        </p>
      )}

      {/* SECTION 6'S SECOND ROW. Two weeks outside the band, one
          line, with the maintenance figure beside it. No colour
          and no count of missed meals: what is being watched is
          the trend, and the log can be a weight three times a
          week without anything here complaining. */}
      {watch?.say === "line" && engine ? (
        <Note tone="quiet">
          <TBlock
            en={(
              <p>
                Your trend has been {watch.where} your band for {watch.daysOut} days
                now. Your maintenance currently reads about {engine.maintenance} kcal
                a day{engine.learned ? ", measured from your own log" : ", estimated, because there are not fourteen days of logs yet"}.
              </p>
            )}
            bn={(
              <p>
                আপনার ধারা {digits(watch.daysOut, "bn")} দিন ধরে সীমার
                {watch.where === "above" ? " উপরে" : " নিচে"} আছে। এখন আপনার
                খরচ দাঁড়াচ্ছে দিনে মোটামুটি {digits(engine.maintenance, "bn")} ক্যালোরি
                {engine.learned ? ", আপনার নিজের খাতা থেকে মাপা" : ", আন্দাজ করা, কারণ এখনো চৌদ্দ দিনের খাতা হয়নি"}।
              </p>
            )}
          />
        </Note>
      ) : null}

      {/* AND THE THIRD ROW, WHICH IS AN OFFER RATHER THAN AN
          ALARM. A full band's width outside is a real move, and
          what is offered is the gentlest rate in the table, in
          the direction that brings the trend back. Pressing it is
          the only way it happens. */}
      {watch?.say === "offer" && watch.offer ? (
        <Note tone="accent"
              title={<T en="Would a gentle phase help?" bn="ধীরে একটা ধাপ কি কাজে লাগবে?" />}>
          <TBlock
            en={(
              <p>
                Your trend is {oneDp(watch.outByKg)} kg {watch.where} the
                band, which is further than the band is wide. A gentle
                phase at {watch.offer.ratePct}% of bodyweight a week is the
                slowest thing this tool offers, and it is what it is for.
                Nothing changes unless you press it.
              </p>
            )}
            bn={(
              <p>
                আপনার ধারা সীমার {watch.where === "above" ? "উপরে" : "নিচে"} আছে
                {" "}{digits(oneDp(watch.outByKg), "bn")} কেজি, অর্থাৎ সীমাটা যত চওড়া
                তার চেয়েও বেশি। সপ্তাহে শরীরের ওজনের {digits(watch.offer.ratePct, "bn")}
                {" "}শতাংশ হারে ধীরে একটা ধাপ, এটাই এই যন্ত্রের সবচেয়ে ধীর ব্যবস্থা,
                আর এর জন্যই এটা আছে। আপনি না চাপলে কিছুই বদলাবে না।
              </p>
            )}
          />
          <div>
            <Button kind="solid" size="sm" onClick={takeOffer}>
              <T
                en={watch.offer.kind === "lose" ? "Start a gentle loss" : "Start a gentle gain"}
                bn={watch.offer.kind === "lose" ? "ধীরে কমানো শুরু করুন" : "ধীরে বাড়ানো শুরু করুন"}
              />
            </Button>
          </div>
        </Note>
      ) : null}

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
