"use client";

/* ============================================================
   diet/keto-panel.tsx: keto, while it is happening.

   `DIET.md` section 7. Keto's first three weeks lie to you, and
   a tracker that does not say so is worse than no tracker: a
   triumphant week one, a disappointing week two, and a quit in
   week three by somebody who has decided it stopped working. It
   never started. The first number was mostly water.

   ---- the clock is a position on an arc that already existed ----

   `hourlyArc()`, `bandAt()` and `forecastChange()` in
   `shared/diet.ts` are the arc, and every figure below is one of
   their answers read at the hour this reader is actually at.
   Nothing here is a second model of the same thing, which is the
   rule this tool keeps being saved by.

   ---- and it must not imply a precision the model has not got ----

   `diet_phases.started_on` is a DATE, so a phase started today is
   somewhere between nought and twenty-four hours old. The hour is
   counted from the START of that day in the reader's own
   timezone, it is said as a stage with a mechanism attached
   rather than as a stopwatch, and every quantity is a range
   because `forecastChange()` returns one. The fat share is
   printed only where `fatShareKnown` allows it, for the reason
   written out beside that field.

   ---- the electrolytes are the part that can hurt somebody ----

   Section 7 puts three numbers on the page and one sentence
   beside them: anybody on blood pressure medication or with
   kidney disease asks a doctor first, because for those two
   groups the advice is actively wrong. That sentence sits next to
   the numbers rather than in a footer, and it is why this section
   renders signed out as well as signed in. `journal-panel.tsx`
   points a reader here from the symptom table.
   ============================================================ */

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  KETO_ADAPTATION_DAYS, KETO_WEEK_ONE_KG,
  activityFactor, bandAt, estimatedBurn, fatEstimate, forecastChange,
  learnedHere, outsideAdaptation, protocolName, readable, restingBurn,
  settlingDays, slopePerWeek, trend, weighings,
  type Body, type Day, type Phase, type Point, type Protocol,
} from "@reiad/shared/diet";
import {
  who, getDays, getPhases, getProfile, saveDay, startPhase,
  dayNumber, isoDate, shiftDate,
  type Profile, type Who,
} from "../../lib/diet-api";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field } from "../ui/field";
import { Note } from "../ui/note";
import { T, TBlock, digits, useToolLang } from "./lang";
import { Term } from "./glossary";
import { Spark } from "./widgets";

/** How far back the page reads. Long enough to hold a phase, its
    fortnight and the weeks either side of it, and short enough to
    be one request. */
const WINDOW = 180;

/** The figures used before a reader has logged anything, both
    named on screen as stand-ins every time they are used rather
    than only when the log is empty. `expect-panel.tsx` says the
    same thing at greater length. */
const STAND_IN_KG = 80;
const STAND_IN_BURN = 2500;

/** The deficit assumed on anything that is not a complete fast,
    and it is disclosed on the page. The reader has not told this
    panel what they intend to eat. */
const ASSUMED_DEFICIT = 500;

/** What this page offers as a phase, out of the one table in
    `shared/diet.ts` rather than a second copy of the names.

    Five rather than all thirteen, and the five are the ones a
    keto reader actually moves between: the diet itself, the fast
    people stack on top of it, ordinary eating either side, and
    the two ways of stopping without stopping. What a reader
    switches TO matters as much as what they were on, because a
    slope never crosses a boundary. */
const OFFERED: Protocol[] = ["keto", "fast", "standard", "maintain", "break"];

/** The two marks, and there are two on purpose.

    Section 7: "net carbs typically under 20 to 50 g. Individual,
    so it is a setting." There is no column for that setting yet,
    so rather than pick one end for everybody the page draws both
    and says which is which. A single invented limit would be a
    number the reader would then believe. */
const TIGHT = 20;
const LOOSE = 50;

/** The range a blood meter reads in ketosis. Not a target and
    never a score: the note under the field is the point of the
    field. */
const KETONE_LOW = 0.5;
const KETONE_HIGH = 3.0;

interface Salt {
  id: string;
  en: string; bn: string;
  /** Roughly how much a day, from section 7. A range, in words,
      because it is a note rather than a prescription. */
  muchEn: string; muchBn: string;
  /** What leaves, and why it leaves. The mechanism is the half a
      reader is missing: the feeling they already have. */
  whyEn: string; whyBn: string;
  /** Where it usually comes from, in both places. Food first,
      because this page sells nobody a supplement. */
  fromEn: string; fromBn: string;
}

const SALTS: Salt[] = [
  {
    id: "sodium", en: "Sodium", bn: "সোডিয়াম",
    muchEn: "3 to 5 g a day", muchBn: "দিনে ৩ থেকে ৫ গ্রাম",
    whyEn: "It goes out with the water the glycogen was holding, and the kidneys "
      + "stop holding on to it as insulin falls. Most of what gets called keto "
      + "flu is this and nothing else.",
    whyBn: "গ্লাইকোজেন যে পানি ধরে রেখেছিল তার সঙ্গে এটা বেরিয়ে যায়, আর ইনসুলিন "
      + "কমতে থাকলে কিডনি এটা ধরে রাখা ছেড়ে দেয়। কিটো ফ্লু বলে যা চেনা হয়, তার "
      + "বেশিরভাগটাই এটা, আর কিছু নয়।",
    fromEn: "The salt already in food, and a cup of clear broth or salted lemon "
      + "water on the days it bites.",
    fromBn: "খাবারে যে লবণ আছে সেটাই, আর যেদিন বেশি কষ্ট হয় সেদিন এক কাপ ঝোল বা "
      + "লবণ দেওয়া লেবু-পানি।",
  },
  {
    id: "potassium", en: "Potassium", bn: "পটাশিয়াম",
    muchEn: "3 to 4 g a day", muchBn: "দিনে ৩ থেকে ৪ গ্রাম",
    whyEn: "It follows the sodium out, and most of what was supplying it is what "
      + "a very low carbohydrate week removes: rice, roti, fruit and potato.",
    whyBn: "সোডিয়ামের পিছু পিছু এটাও বেরিয়ে যায়, আর যা থেকে এটা আসত তার বেশিরভাগই "
      + "খুব কম শর্করার সপ্তাহে বাদ পড়ে: ভাত, রুটি, ফল আর আলু।",
    fromEn: "Leafy greens, fish, meat and mushrooms, and avocado where it is sold.",
    fromBn: "শাক, মাছ, মাংস আর মাশরুম, আর যেখানে পাওয়া যায় সেখানে অ্যাভোকাডো।",
  },
  {
    id: "magnesium", en: "Magnesium", bn: "ম্যাগনেসিয়াম",
    muchEn: "300 to 400 mg a day", muchBn: "দিনে ৩০০ থেকে ৪০০ মিলিগ্রাম",
    whyEn: "Less lost with the water than simply no longer arriving: grains and "
      + "pulses were carrying most of it. Cramp at night is the usual complaint.",
    whyBn: "পানির সঙ্গে বেরিয়ে যাওয়ার চেয়ে বড় কারণ হলো এটা আর আসছে না: দানাশস্য "
      + "আর ডাল থেকেই বেশিরভাগটা আসত। রাতে পায়ে খিঁচুনি ধরাটাই সবচেয়ে চেনা অভিযোগ।",
    fromEn: "Nuts and seeds, dark green leaves, and fish.",
    fromBn: "বাদাম আর বীজ, গাঢ় সবুজ শাক, আর মাছ।",
  },
];

/** What a reader eats under a protocol, for the water model. A
    complete fast is nothing at all; maintaining and a break are
    the burn; everything else is the assumed deficit, which the
    page states. */
const intakeUnder = (p: Protocol, burn: number): number => {
  if (p === "fast") return 0;
  if (p === "maintain" || p === "break") return burn;
  return Math.max(burn - ASSUMED_DEFICIT, 0);
};

/** The reader's own midnight on a `Point.day`.

    `dayNumber()` reads an ISO date in UTC, which is arithmetic
    rather than a timezone decision, and this turns one back into
    the instant that calendar day BEGAN where the reader is. At
    UTC+6 the two are six hours apart, and six hours is a fifth of
    the first band. */
const startedAt = (day: number): number => {
  const at = new Date(day * 86400000);
  return new Date(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()).getTime();
};

/** An ISO date from a `Point.day`, for a sentence that names one. */
const isoOf = (day: number): string =>
  new Date(day * 86400000).toISOString().slice(0, 10);

/** A date a reader can read, in the language the page is in. The
    month by name, because `2026-09-05` and `05/09/2026` are the
    same six characters to somebody who has to work out which is
    the month. */
const DATE_EN = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" });
const DATE_BN = new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "long" });
const dateWords = (iso: string, lang: "en" | "bn"): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const at = new Date(Date.UTC(y, m - 1, d));
  return (lang === "bn" ? DATE_BN : DATE_EN).format(at);
};

export function KetoPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  /* THE ROWS HAVE TO BE BACK BEFORE ANYTHING MAY BE WRITTEN.
     `saveDay` is a merge-upsert of a whole row and `fromDay()`
     writes an explicit null for every field the object lacks, so
     a ketone reading saved on top of `undefined` would erase this
     morning's weight, the tags and the note. `board.tsx` learnt
     that the expensive way. */
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  /* NOW, AND IT IS NULL UNTIL AN EFFECT RUNS. The server has a
     different clock from the browser, so an hour count computed
     during render is a hydration mismatch on every load: React
     would discard the difference and the page would go back to
     what the server sent, which is exactly the failure
     `next/components/scripts.tsx` exists for. The clock says what
     it is waiting for in the meantime. */
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = (): void => setNow(Date.now());
    tick();
    /* A minute, because the smallest thing on screen is an hour
       and a band boundary is hours wide. A second would redraw
       sixty times for nothing. */
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  /* Today, from the ticking clock once there is one, so a tab
     left open across midnight stops calling yesterday today.
     Before that it is the same value the server rendered. */
  const today = now === null ? isoDate() : isoDate(new Date(now));

  useEffect(() => {
    let alive = true;
    const paint = (): void => {
      void who().then((f) => { if (alive) { setW(f); setAnswered(true); } });
    };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { alive = false; document.removeEventListener("account:changed", paint); };
  }, []);

  const load = useCallback((me: Who, from: string) => {
    void Promise.all([getDays(me, from), getPhases(me), getProfile(me)])
      .then(([d, p, pr]) => { setDays(d); setPhases(p); setProfile(pr); setLoaded(true); });
  }, []);

  useEffect(() => {
    if (!w) return;
    load(w, shiftDate(today, -WINDOW));
  }, [w, today, load]);

  const todayNo = dayNumber(today);

  /* Drawn and fittable are two lists, and the difference between
     them is most of what this page is about: a weighing inside a
     settling stretch is DRAWN and never fitted. */
  const { drawn: points, fittable } = useMemo(
    () => weighings({ days, dayOf: dayNumber, phases, today: todayNo }),
    [days, phases, todayNo],
  );
  const line = useMemo(() => trend(points), [points]);
  const rate = useMemo(() => slopePerWeek(fittable), [fittable]);

  /* THE TREND, NOT THE LAST READING, for the same reason
     `expect-panel.tsx` uses it: a scale reading is a real weight
     plus a kilo or two of water, and the size of the glycogen
     store underneath is computed from it. */
  const mine = line.length ? line[line.length - 1].kg : null;
  const kg = mine ?? STAND_IN_KG;

  const learned = useMemo(() => learnedHere({
    weights: fittable,
    intakes: days.filter((d) => d.kcal != null)
      .map((d) => ({ day: dayNumber(d.date), kcal: d.kcal as number })),
    phases,
    today: todayNo,
  }), [fittable, days, phases, todayNo]);

  const body: Body | null = useMemo(() => {
    if (!profile?.height_cm || !profile.birth_year || mine == null) return null;
    return {
      heightCm: profile.height_cm,
      weightKg: mine,
      ageYears: new Date().getUTCFullYear() - profile.birth_year,
      sex: profile.sex ?? "male",
      ancestry: profile.ancestry ?? "general",
      waistCm: [...days].reverse().find((d) => d.waistCm != null)?.waistCm,
      neckCm: [...days].reverse().find((d) => d.neckCm != null)?.neckCm,
      hipCm: [...days].reverse().find((d) => d.hipCm != null)?.hipCm,
    };
  }, [profile, mine, days]);

  const estimated = useMemo(() => {
    if (!body) return null;
    const fat = fatEstimate(body);
    const rest = restingBurn(body, fat.method === "navy" ? fat.leanKg : undefined);
    return estimatedBurn(rest.kcal, activityFactor(profile?.activity ?? "sedentary"));
  }, [body, profile]);

  const burnFrom: "learned" | "estimated" | "stand-in" =
    learned ? "learned" : estimated != null ? "estimated" : "stand-in";
  const burn = Math.round(learned?.kcal.mid ?? estimated ?? STAND_IN_BURN);

  /* WHAT IS RUNNING, which is the last phase that has started and
     has not been ended by a later one. `getPhases()` comes back
     in `started_on` order, and a phase with no `ended_on` runs
     until the next one begins, which is what `stretches()` reads
     too: two descriptions of an end would be one description too
     many. */
  const running: Phase | null = useMemo(() => {
    const started = phases.filter((p) => p.startDay <= todayNo);
    const last = started[started.length - 1] ?? null;
    if (!last) return null;
    if (last.endDay != null && last.endDay < todayNo) return null;
    return last;
  }, [phases, todayNo]);

  const todayRow = days.find((d) => d.date === today);

  const write = useCallback(async (patch: Partial<Day>) => {
    if (!w || !loaded) return;
    setSaving("saving");
    const next: Day = { ...(todayRow ?? { date: today }), ...patch, date: today };
    const ok = await saveDay(w, next);
    setDays((was) => [...was.filter((d) => d.date !== today), next]
      .sort((a, b) => a.date.localeCompare(b.date)));
    setSaving(ok ? "saved" : "failed");
  }, [w, loaded, todayRow, today]);

  const began = useCallback(async (row: { style: Protocol; started_on: string }) => {
    if (!w) return;
    setSaving("saving");
    const ok = await startPhase(w, row.style, row.started_on);
    if (ok) load(w, shiftDate(today, -WINDOW));
    setSaving(ok ? "saved" : "failed");
  }, [w, today, load]);

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;

  return (
    <div className="dt-keto">
      <section aria-labelledby="dt-keto-now-h">
        <h2 id="dt-keto-now-h"><T en="Where you are right now" bn="আপনি এখন কোথায়" /></h2>
        {w ? (
          <>
            <Clock
              running={running} now={now} kg={kg} mine={mine != null}
              burn={burn} from={burnFrom} lang={lang}
            />
            <Phases
              running={running} phases={phases} today={today}
              saving={saving} onStart={began}
            />
          </>
        ) : (
          <p className="dt-invite">
            <T
              en="A phase is a row in your account, so the clock can carry on while the tab is shut and be the same clock on your phone. Everything below this works signed out."
              bn="একটা পর্ব আপনার অ্যাকাউন্টে একটা সারি, তাই ট্যাব বন্ধ থাকলেও ঘড়ি চলতে থাকে আর ফোনেও একই ঘড়ি দেখায়। এর নিচের সবকিছু অ্যাকাউন্ট ছাড়াও কাজ করে।"
            />
          </p>
        )}
      </section>

      <section aria-labelledby="dt-keto-window-h">
        <h2 id="dt-keto-window-h">
          <T en="The adaptation window" bn="খাপ খাওয়ানোর সময়" />
        </h2>
        <Window
          running={running} today={todayNo} points={points} phases={phases}
          rate={rate} lang={lang}
        />
      </section>

      <section aria-labelledby="dt-keto-carbs-h">
        <h2 id="dt-keto-carbs-h"><T en="Net carbs" bn="কার্যকর শর্করা" /></h2>
        <NetCarbs day={todayRow} signedIn={!!w} lang={lang} />
      </section>

      <section aria-labelledby="dt-keto-salt-h">
        <h2 id="dt-keto-salt-h">
          <T en="The three that leave with the water" bn="পানির সঙ্গে যে তিনটে চলে যায়" />
        </h2>
        <Salts />
      </section>

      <section aria-labelledby="dt-keto-ketone-h">
        <h2 id="dt-keto-ketone-h"><T en="A ketone reading" bn="কিটোনের মাপ" /></h2>
        <Ketones
          days={days} line={line} rate={rate} today={today} todayRow={todayRow}
          signedIn={!!w} ready={loaded} saving={saving} onWrite={write} lang={lang}
        />
      </section>

      {/* THE LINE, BESIDE THE NUMBERS. Section 31, and this page
          needs a stronger one than most: the three amounts above
          are the ones that are actively wrong for two groups of
          people, and a very low carbohydrate week changes glucose
          control within days. The wording follows `MEDS` in
          `words.ts` and the note on the goal page, because a
          reader meeting the same warning twice in two spellings
          reads it as two different warnings. */}
      <Note tone="warn">
        <TBlock
          en={<p>This is general education and not medical advice. A very low
            carbohydrate week changes glucose control within days: if you take
            insulin or a sulfonylurea, speak to a clinician BEFORE you start
            rather than after, because the dose that was right last month may be
            too much this month and only they can change it. If you take blood
            pressure medicine, or have kidney disease, ask before you add any
            salt: the sodium note above is written for people who have
            neither.</p>}
          bn={<p>এটি সাধারণ তথ্য, চিকিৎসা পরামর্শ নয়। খুব কম শর্করার এক সপ্তাহ
            কয়েক দিনের মধ্যেই রক্তের চিনি বদলে দেয়: আপনি ইনসুলিন বা সালফোনাইলইউরিয়া
            নিলে শুরুর পরে নয়, শুরুর আগে চিকিৎসকের সঙ্গে কথা বলুন, কারণ গত মাসে যে
            ডোজ ঠিক ছিল এই মাসে সেটা বেশি হয়ে যেতে পারে, আর ডোজ কেবল তাঁরাই
            বদলাতে পারেন। রক্তচাপের ওষুধ নিলে বা কিডনির রোগ থাকলে লবণ বাড়ানোর আগে
            জিজ্ঞাসা করে নিন: উপরের সোডিয়ামের কথাটা তাঁদের জন্য লেখা যাঁদের এ দুটোর
            কোনোটাই নেই।</p>}
        />
      </Note>
    </div>
  );
}

/* ============================================================
   The clock.

   One question: what is happening RIGHT NOW, and what comes
   next. The band names a MECHANISM rather than a feeling,
   because the feeling is what the reader already has.

   Counted from the start of the day the phase names, in the
   reader's own timezone, and said so: a phase started today is
   between nought and twenty-four hours old and the page must not
   pretend to know which.
   ============================================================ */
function Clock({ running, now, kg, mine, burn, from, lang }: {
  running: Phase | null;
  now: number | null;
  kg: number;
  mine: boolean;
  burn: number;
  from: "learned" | "estimated" | "stand-in";
  lang: "en" | "bn";
}) {
  if (!running) {
    return (
      <p className="dt-intro">
        <T
          en="Nothing is running, so there is no clock yet. Start a phase below and this becomes the hour you are at, what the body is doing at that hour, and what the scale is doing because of it."
          bn="এখন কিছুই চলছে না, তাই ঘড়িও নেই। নিচে একটা পর্ব শুরু করলে এখানে দেখাবে আপনি কত ঘণ্টায় আছেন, সেই ঘণ্টায় শরীর কী করছে, আর সেজন্য দাঁড়িপাল্লা কী করছে।"
        />
      </p>
    );
  }

  if (now === null) {
    /* The one frame before the effect runs. A sentence rather
       than a spinner, and it is the truth: the server has a
       different clock and the hour is the browser's to compute. */
    return (
      <p className="dt-intro">
        <T en="Reading the clock." bn="ঘড়ি দেখা হচ্ছে।" />
      </p>
    );
  }

  const hoursIn = Math.max((now - startedAt(running.startDay)) / 3600000, 0);
  const hour = Math.floor(hoursIn);
  const daysIn = hoursIn / 24;
  const { now: band, next, intoNext } = bandAt(running.protocol, hoursIn);
  const name = protocolName(running.protocol);

  const cast = forecastChange({
    from: null,
    to: running.protocol,
    days: daysIn,
    weightKg: kg,
    burn,
    intake: intakeUnder(running.protocol, burn),
  });

  /* THE SMALLER MAGNITUDE FIRST, whichever way the scale went.
     `scale.low` is the most negative end of the band, so reading
     it as the small number prints "2.7 to 1.6 kg up" the moment a
     protocol that adds weight is picked. */
  const down = cast.scale.mid <= 0;
  const ends = [Math.abs(cast.scale.low), Math.abs(cast.scale.high)];
  const low = Math.min(...ends);
  const high = Math.max(...ends);
  const share = Math.round(cast.fatShare * 100);
  const settle = settlingDays(running.protocol);
  const readableOn = isoOf(running.startDay + settle);

  return (
    <div className="dt-clock">
      <p className="dt-clock-where">
        <T
          en={`${name.en}, hour ${hour}.`}
          bn={`${name.bn}, ${digits(hour, "bn")} ঘণ্টা।`}
        />
        {" "}
        <span className="dt-why">
          <T
            en="Counted from the start of the day you named, because a phase carries a date rather than a time. Every figure here is a band, and an hour is a stage rather than a stopwatch."
            bn="আপনি যে দিনটা বলেছেন সেই দিনের শুরু থেকে গোনা, কারণ পর্বের সঙ্গে তারিখ থাকে, ঘড়ির সময় নয়। এখানে প্রতিটি সংখ্যা একটা সীমা, আর ঘণ্টা মানে স্টপওয়াচ নয়, একটা ধাপ।"
          />
        </span>
      </p>

      <div className="dt-readout">
        <div className="dt-figure dt-figure-lead">
          <h3><T en="What the body is doing" bn="শরীর কী করছে" /></h3>
          <p className="dt-clock-band">
            {band
              ? <T en={band.en} bn={band.bn} />
              : (
                <T
                  en="The first week is over. What moves from here is mostly the real rate, and it is a great deal smaller than the first two days suggested."
                  bn="প্রথম সপ্তাহ শেষ। এখান থেকে যা নড়ে তার বেশিরভাগই আসল হার, আর সেটা প্রথম দুই দিন যা মনে হয়েছিল তার চেয়ে অনেক কম।"
                />
              )}
          </p>
        </div>

        <div className="dt-figure">
          <h3><T en="What the scale has done" bn="দাঁড়িপাল্লা যা করেছে" /></h3>
          <p className="dt-value">
            <T
              en={`${low.toFixed(1)} to ${high.toFixed(1)} kg ${down ? "down" : "up"}`}
              bn={`${digits(low.toFixed(1), "bn")} থেকে ${digits(high.toFixed(1), "bn")} কেজি ${down ? "নিচে" : "উপরে"}`}
            />
          </p>
          {/* The share is printed only where the model has a
              water term to divide by, for the reason written out
              on `Forecast.fatShareKnown`. */}
          <p className="dt-said">
            {cast.fatShareKnown
              ? (
                <T
                  en={`About ${share}% of that is fat so far.`}
                  bn={`এর মধ্যে এখন পর্যন্ত প্রায় ${digits(share, "bn")}% চর্বি।`}
                />
              )
              : (
                <T
                  en="How much of that is fat is not something this can say for what you are on."
                  bn="আপনি যেটাতে আছেন তার জন্য এর কতটা চর্বি, সেটা এখান থেকে বলা যায় না।"
                />
              )}
          </p>
          {cast.fatShareKnown ? (
            <span className="dt-hours-share">
              <span
                className="dt-hours-bar"
                style={{ "--share": `${share}%` } as CSSProperties}
              />
              <span className="mono">{digits(share, lang)}%</span>
            </span>
          ) : null}
          <p className="dt-why">
            <T
              en={`The rest is water and gut contents, and ${cast.rebound.low.toFixed(1)} to ${cast.rebound.high.toFixed(1)} kg of it comes back in the first days of ordinary eating. The tool will not call that a gain.`}
              bn={`বাকিটা পানি আর পেটের খাবার, আর তার ${digits(cast.rebound.low.toFixed(1), "bn")} থেকে ${digits(cast.rebound.high.toFixed(1), "bn")} কেজি স্বাভাবিক খাওয়া শুরুর প্রথম কয়েক দিনেই ফিরে আসে। যন্ত্রটি সেটাকে বাড়া বলবে না।`}
            />
          </p>
        </div>

        <div className="dt-figure">
          <h3><T en="What comes next" bn="এরপর কী" /></h3>
          {next ? (
            <>
              <p className="dt-value">
                <T
                  en={intoNext < 1
                    ? "Within the hour"
                    : `In about ${Math.round(intoNext)} hours`}
                  bn={intoNext < 1
                    ? "এই ঘণ্টার মধ্যেই"
                    : `প্রায় ${digits(Math.round(intoNext), "bn")} ঘণ্টা পরে`}
                />
              </p>
              <p className="dt-clock-next"><T en={next.en} bn={next.bn} /></p>
            </>
          ) : (
            <>
              <p className="dt-value">
                <T
                  en={settle === 0
                    ? "A readable rate"
                    : `Readable from ${dateWords(readableOn, "en")}`}
                  bn={settle === 0
                    ? "পড়ার মতো একটা হার"
                    : `${dateWords(readableOn, "bn")} থেকে পড়া যাবে`}
                />
              </p>
              <p className="dt-clock-next">
                <T
                  en="No slope is fitted across a change of protocol, and none is fitted inside a settling window either: both are a line drawn across a step in body water."
                  bn="নিয়ম বদলের উপর দিয়ে কোনো ঢাল বসানো হয় না, থিতু হওয়ার সময়ের ভেতরেও নয়: দুটোই শরীরের পানির একটা ধাপের উপর দিয়ে টানা রেখা।"
                />
              </p>
            </>
          )}
        </div>
      </div>

      {/* WHAT IT WAS COMPUTED AGAINST, every time and not only
          when the log is empty. A forecast is arithmetic on a
          deficit, so a stand-in maintenance produces a stand-in
          answer however real the kilograms beside it look. */}
      <p className="dt-why">
        {mine
          ? (
            <T
              en={`Computed against your trend weight of ${kg.toFixed(1)} kg.`}
              bn={`আপনার ধারার ওজন ${digits(kg.toFixed(1), "bn")} কেজি ধরে হিসাব করা।`}
            />
          )
          : (
            <T
              en={`Computed for an ${STAND_IN_KG} kg body, because you have not logged a weight yet.`}
              bn={`${digits(STAND_IN_KG, "bn")} কেজি শরীর ধরে হিসাব করা, কারণ আপনি এখনো ওজন লেখেননি।`}
            />
          )}
        {" "}
        {from === "learned" ? (
          <T
            en={`Maintenance is your own ${burn} a day, measured from your log.`}
            bn={`খরচ ধরা হয়েছে আপনার নিজের দিনে ${digits(burn, "bn")}, আপনার খাতা থেকে মাপা।`}
          />
        ) : from === "estimated" ? (
          <T
            en={`Maintenance is an estimated ${burn} a day, from your height, age and activity.`}
            bn={`খরচ ধরা হয়েছে আন্দাজে দিনে ${digits(burn, "bn")}, আপনার উচ্চতা, বয়স আর চলাফেরা থেকে।`}
          />
        ) : (
          <T
            en={`Maintenance is a stand-in ${burn} a day and is not yours: the tool measures your own after fourteen days of logs.`}
            bn={`খরচ ধরা হয়েছে দিনে ${digits(burn, "bn")}, যা আপনার নয়, শুধু ধরে নেওয়া একটা সংখ্যা: চৌদ্দ দিন লেখার পর যন্ত্রটি আপনার নিজেরটা মেপে নেয়।`}
          />
        )}
        {" "}
        {running.protocol === "fast"
          ? (
            <T
              en="A complete fast is nothing at all going in."
              bn="পূর্ণ উপবাস মানে ভেতরে কিছুই যাচ্ছে না।"
            />
          )
          : (
            <T
              en={`It assumes you are eating about ${intakeUnder(running.protocol, burn)} a day.`}
              bn={`ধরে নেওয়া হয়েছে আপনি দিনে প্রায় ${digits(intakeUnder(running.protocol, burn), "bn")} খাচ্ছেন।`}
            />
          )}
      </p>
    </div>
  );
}

/* ============================================================
   Starting one, and ending one.

   A phase is what makes every phase-aware reading in this tool
   real: the slope that will not cross a boundary, the learned
   maintenance that never spans one, the settling window, and the
   clock above. Without a row, all four are code nobody reaches.

   ENDING IS STARTING THE NEXT ONE, and that is the data model
   rather than a shortcut: `stretches()` reads a phase as running
   until the next one begins, so saying what you are doing now IS
   saying that the last thing stopped. `diet_phases.ended_on` is
   for a phase that ends without a successor, which needs a
   writer `diet-api.ts` has not got yet.
   ============================================================ */
function Phases({ running, phases, today, saving, onStart }: {
  running: Phase | null;
  phases: Phase[];
  today: string;
  saving: "idle" | "saving" | "saved" | "failed";
  onStart: (row: { style: Protocol; started_on: string }) => void;
}) {
  /* THE ROW A START WRITES, in the column names it lands under.
     `startPhase()` takes the style and the date positionally, so
     they are two strings in an order nothing checks; holding them
     in the shape of the row is what makes a swapped pair visible
     here rather than in the database. */
  const [row, setRow] = useState<{ style: Protocol; started_on: string }>(
    () => ({ style: "keto", started_on: today }),
  );

  const past = [...phases].sort((a, b) => b.startDay - a.startDay).slice(0, 6);

  return (
    <div className="dt-phase">
      <div className="dt-scale">
        <span className="dt-scale-label" id="dt-phase-what">
          {running
            ? <T en="What you are doing now" bn="আপনি এখন যা করছেন" />
            : <T en="What you are starting" bn="আপনি যা শুরু করছেন" />}
        </span>
        <div className="dt-tags" role="group" aria-labelledby="dt-phase-what">
          {OFFERED.map((id) => (
            <ChipButton
              key={id}
              pressed={row.style === id}
              onClick={() => setRow((was) => ({ ...was, style: id }))}
            >
              <T en={protocolName(id).en} bn={protocolName(id).bn} />
            </ChipButton>
          ))}
        </div>
      </div>

      <div className="dt-phase-when">
        <Field
          id="dt-phase-start"
          type="date"
          max={today}
          value={row.started_on}
          onChange={(e) => setRow((was) => ({ ...was, started_on: e.target.value }))}
          label={<T en="From when" bn="কবে থেকে" />}
          hint={(
            <T
              en="A date rather than a time, so the clock counts from the start of that day. Backdate it if you are already three days in."
              bn="ঘড়ির সময় নয়, তারিখ, তাই ঘড়ি ওই দিনের শুরু থেকে গোনে। আগেই তিন দিন হয়ে গেলে আগের তারিখ দিন।"
            />
          )}
        />
        <Button
          kind="solid"
          disabled={saving === "saving"}
          onClick={() => onStart(row)}
        >
          {running
            ? <T en="This is what I am doing now" bn="এখন আমি এটাই করছি" />
            : <T en="Start it" bn="শুরু করুন" />}
        </Button>
        <span className="dt-save" data-state={saving}>
          <T
            en={saving === "saving" ? "Saving" : saving === "saved" ? "Saved"
              : saving === "failed" ? "That did not save" : ""}
            bn={saving === "saving" ? "জমা হচ্ছে" : saving === "saved" ? "জমা হয়েছে"
              : saving === "failed" ? "জমা হয়নি" : ""}
          />
        </span>
      </div>

      <p className="dt-why">
        <T
          en="A phase ends where the next one begins, so telling the tool what you are doing now is how you stop the last thing. Nothing here is a promise to keep going: it is the boundary a slope must never cross."
          bn="একটা পর্ব শেষ হয় যেখানে পরেরটা শুরু হয়, তাই এখন কী করছেন সেটা বলাই আগেরটা থামানোর উপায়। এটা চালিয়ে যাওয়ার প্রতিশ্রুতি নয়: এটা সেই সীমা, যার উপর দিয়ে কোনো ঢাল বসানো যায় না।"
        />
      </p>

      {past.length ? (
        <ul className="dt-tag-counts">
          {past.map((p) => (
            <li key={`${p.protocol}-${p.startDay}`}>
              <T en={protocolName(p.protocol).en} bn={protocolName(p.protocol).bn} />
              <span className="mono dt-src">
                <T
                  en={dateWords(isoOf(p.startDay), "en")}
                  bn={dateWords(isoOf(p.startDay), "bn")}
                />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="dt-why">
          <T
            en="No phase has been recorded yet, so the trend is read as one long stretch of the same thing."
            bn="এখনো কোনো পর্ব লেখা হয়নি, তাই পুরো ধারাটাকে একই জিনিসের একটানা সময় ধরে পড়া হচ্ছে।"
          />
        </p>
      )}
    </div>
  );
}

/* ============================================================
   The adaptation window, drawn.

   Section 7: the first fourteen days of a keto phase are excluded
   from the trend's slope, and the tool says on screen what is
   happening. A reader in the first fortnight should be able to
   SEE that they are in it, and see what it means for their own
   numbers: which of their own weighings the slope is not allowed
   to look at, and the date the window closes.

   `outsideAdaptation()` and `readable()` are the two functions
   that decide it, so both are asked here rather than a third
   description of the same rule being written.
   ============================================================ */
function Window({ running, today, points, phases, rate, lang }: {
  running: Phase | null;
  today: number;
  points: Point[];
  phases: Phase[];
  rate: { low: number; mid: number; high: number } | null;
  lang: "en" | "bn";
}) {
  if (!running) {
    return (
      <p className="dt-intro">
        <T
          en="The first fourteen days of a keto phase are left out of the trend's slope, because what leaves in them is water. Start a phase and this fills in with your own days."
          bn="কিটো পর্বের প্রথম চৌদ্দ দিন ধারার ঢালের হিসাব থেকে বাদ থাকে, কারণ ওই সময়ে যা যায় তা পানি। একটা পর্ব শুরু করলে এখানে আপনার নিজের দিনগুলো বসবে।"
        />
      </p>
    );
  }

  const daysIn = today - running.startDay;
  const closesOn = isoOf(running.startDay + KETO_ADAPTATION_DAYS);
  const inside = running.protocol === "keto" && daysIn < KETO_ADAPTATION_DAYS;
  const held = points.length - outsideAdaptation(points, running.startDay).length;
  const fitted = readable(points, phases, today).length;
  const shown = Math.min(Math.max(daysIn, 0), KETO_ADAPTATION_DAYS);
  const share = Math.round((shown / KETO_ADAPTATION_DAYS) * 100);

  return (
    <div className="dt-window">
      {running.protocol === "keto" ? (
        <>
          <p className="dt-window-count">
            <T
              en={`Day ${Math.max(daysIn, 0)} of ${KETO_ADAPTATION_DAYS}`}
              bn={`${digits(Math.max(daysIn, 0), "bn")} দিন, ${digits(KETO_ADAPTATION_DAYS, "bn")} দিনের মধ্যে`}
            />
          </p>
          <span className="dt-hours-share dt-window-bar">
            <span
              className="dt-hours-bar"
              style={{ "--share": `${share}%` } as CSSProperties}
            />
            <span className="mono">{digits(share, lang)}%</span>
          </span>
          <p className="dt-said">
            {inside ? (
              <T
                en={`You are inside it. It closes on ${dateWords(closesOn, "en")}, and until then a rate fitted through these days would be a rate fitted through water.`}
                bn={`আপনি এর ভেতরেই আছেন। এটা শেষ হবে ${dateWords(closesOn, "bn")}, আর তার আগে এই দিনগুলোর ভেতর দিয়ে বসানো যেকোনো হার আসলে পানির ভেতর দিয়ে বসানো হার।`}
              />
            ) : (
              <T
                en={`It closed on ${dateWords(closesOn, "en")}. From there the slope is reading fat rather than water.`}
                bn={`এটা শেষ হয়েছে ${dateWords(closesOn, "bn")}। তারপর থেকে ঢাল পানি নয়, চর্বি পড়ছে।`}
              />
            )}
          </p>
          <p className="dt-why">
            <T
              en={`${held} of your weighings fall inside it. They are drawn on every chart in this tool and left out of the slope, which is not the same as hiding them: excluded from the fit is not hidden from the reader.`}
              bn={`আপনার ${digits(held, "bn")}টি মাপ এর ভেতরে পড়ে। এই যন্ত্রের সব ছকেই সেগুলো আঁকা থাকে, শুধু ঢালের হিসাবে ধরা হয় না, আর সেটা লুকিয়ে ফেলা নয়: হিসাব থেকে বাদ দেওয়া মানে পাঠকের কাছ থেকে লুকানো নয়।`}
            />
          </p>
        </>
      ) : (
        <p className="dt-said">
          <T
            en={`You are on ${protocolName(running.protocol).en.toLowerCase()} rather than keto, so the fourteen day window does not apply. What does apply is the settling window for what you are on, and the clock above names the date.`}
            bn={`আপনি কিটোতে নেই, আছেন ${protocolName(running.protocol).bn} অবস্থায়, তাই চৌদ্দ দিনের হিসাবটা এখানে খাটে না। যেটা খাটে সেটা আপনি যাতে আছেন তার থিতু হওয়ার সময়, আর উপরের ঘড়ি সেই তারিখটা বলে দিচ্ছে।`}
          />
        </p>
      )}

      <p className="dt-said">
        {fitted >= 2 && rate ? (
          <T
            en={`Your rate is ${Math.abs(rate.mid).toFixed(2)} kg a week over the ${fitted} weighings a slope is allowed to see.`}
            bn={`যে ${digits(fitted, "bn")}টি মাপ ঢাল দেখতে পারে, তা থেকে আপনার হার সপ্তাহে ${digits(Math.abs(rate.mid).toFixed(2), "bn")} কেজি।`}
          />
        ) : (
          <T
            en="There is no readable rate yet, and that is the honest answer rather than a missing one. A stretch shorter than a week carries none, whatever it is under, because the noise the trend exists to suppress is larger than a week of signal."
            bn="এখনো পড়ার মতো কোনো হার নেই, আর এটাই সৎ উত্তর, কিছু বাদ পড়া নয়। এক সপ্তাহের কম সময়ে কোনো হারই পড়া যায় না, যেটাই চলুক না কেন, কারণ ধারা যে ওঠানামা ঢাকতে চায় সেটা এক সপ্তাহের সংকেতের চেয়ে বড়।"
          />
        )}
      </p>

      <p className="dt-why">
        <T
          en={`Week one is ${KETO_WEEK_ONE_KG.low} to ${KETO_WEEK_ONE_KG.high} kg for most people and none of it is fat: `}
          bn={`বেশিরভাগ মানুষের প্রথম সপ্তাহে ${digits(KETO_WEEK_ONE_KG.low, "bn")} থেকে ${digits(KETO_WEEK_ONE_KG.high, "bn")} কেজি কমে আর তার কিছুই চর্বি নয়: `}
        />
        <Term id="glycogen" en="glycogen and its water" bn="গ্লাইকোজেন আর তার পানি" />
        <T
          en=" leaving, and it comes back the week it is eaten again."
          bn=" চলে যায়, আর আবার খাওয়া শুরু হলে সেই সপ্তাহেই ফিরে আসে।"
        />
      </p>
    </div>
  );
}

/* ============================================================
   Net carbs, against two marks rather than one.

   Total carbohydrate less fibre, because fibre is carbohydrate
   the body cannot break down. Section 7 puts the usual limit at
   under 20 to 50 g and calls it individual, so it is a SETTING:
   `diet_profile` has no column for one yet, and inventing a
   single number here would be a limit the reader would then
   believe. Both marks are drawn instead, and which one is yours
   is a decision this page does not make for you.
   ============================================================ */
function NetCarbs({ day, signedIn, lang }: {
  day: Day | undefined;
  signedIn: boolean;
  lang: "en" | "bn";
}) {
  const [aim, setAim] = useState<number>(TIGHT);
  const carbs = day?.carbsG;
  const fibre = day?.fibreG;
  const net = carbs == null ? null : Math.max(carbs - (fibre ?? 0), 0);
  const share = net == null ? 0 : Math.min(Math.round((net / LOOSE) * 100), 100);

  return (
    <div className="dt-netcarbs">
      <TBlock
        en={(
          <p className="dt-hint">
            What a keto limit is counted in is
            {" "}
            <Term id="netcarbs" en="net carbs" />
            , which is total carbohydrate less fibre. It is not on most labels in
            either country, so it is worked out from what you log rather than
            read off a packet.
          </p>
        )}
        bn={(
          <p className="dt-hint">
            কিটোর সীমা যাতে গোনা হয় সেটা হলো
            {" "}
            <Term id="netcarbs" en="net carbs" bn="কার্যকর শর্করা" />
            , অর্থাৎ মোট শর্করা থেকে আঁশ বাদ দিয়ে যা থাকে। দুই দেশের বেশিরভাগ মোড়কেই
            এটা লেখা থাকে না, তাই প্যাকেট থেকে পড়া হয় না, আপনি যা লেখেন তা থেকে
            হিসাব করা হয়।
          </p>
        )}
      />

      <div className="dt-scale">
        <span className="dt-scale-label" id="dt-carb-aim">
          <T en="Which mark you are aiming at" bn="আপনি কোন সীমা ধরে চলছেন" />
        </span>
        <div className="dt-tags" role="group" aria-labelledby="dt-carb-aim">
          {[TIGHT, LOOSE].map((n) => (
            <ChipButton key={n} pressed={aim === n} onClick={() => setAim(n)}>
              <T en={`under ${n} g`} bn={`${digits(n, "bn")} গ্রামের নিচে`} />
            </ChipButton>
          ))}
        </div>
      </div>

      <div className="dt-readout">
        <div className="dt-figure dt-figure-lead">
          <h3><T en="Today" bn="আজ" /></h3>
          {net == null ? (
            <p className="dt-said">
              {signedIn ? (
                <T
                  en="Nothing with carbohydrate on it has been logged today, so there is no figure to give. This fills in from the day's own total."
                  bn="আজ শর্করার হিসাবসহ কিছু লেখা হয়নি, তাই দেওয়ার মতো কোনো সংখ্যা নেই। দিনের নিজের হিসাব থেকেই এটা ভরে যাবে।"
                />
              ) : (
                <T
                  en="A day's total belongs to an account. The definition and the two marks are the same for everybody, and they are above."
                  bn="দিনের হিসাব অ্যাকাউন্টের সঙ্গে থাকে। মানে আর দুই সীমা সবার জন্য একই, আর সেগুলো উপরেই আছে।"
                />
              )}
            </p>
          ) : (
            <>
              <p className="dt-value">
                <T
                  en={`${net.toFixed(0)} g`}
                  bn={`${digits(net.toFixed(0), "bn")} গ্রাম`}
                />
              </p>
              <span className="dt-hours-share">
                <span
                  className="dt-hours-bar"
                  style={{ "--share": `${share}%` } as CSSProperties}
                />
                <span className="mono">
                  {digits(LOOSE, lang)}
                  {lang === "bn" ? " গ্রাম" : " g"}
                </span>
              </span>
              <p className="dt-said">
                <T
                  en={net <= aim
                    ? `Under the ${aim} g mark.`
                    : `Over the ${aim} g mark, by ${(net - aim).toFixed(0)} g.`}
                  bn={net <= aim
                    ? `${digits(aim, "bn")} গ্রামের সীমার নিচে।`
                    : `${digits(aim, "bn")} গ্রামের সীমার উপরে, ${digits((net - aim).toFixed(0), "bn")} গ্রাম বেশি।`}
                />
              </p>
              <p className="dt-why">
                <T
                  en={`${carbs?.toFixed(0)} g of carbohydrate less ${(fibre ?? 0).toFixed(0)} g of fibre. It is only as good as the day's log, and a day logged by halves gives a net carb figure logged by halves.`}
                  bn={`${digits(carbs?.toFixed(0) ?? "0", "bn")} গ্রাম শর্করা থেকে ${digits((fibre ?? 0).toFixed(0), "bn")} গ্রাম আঁশ বাদ। এটা দিনের খাতার মতোই ভালো বা খারাপ, আর অর্ধেক লেখা দিনের হিসাবও অর্ধেকই।`}
                />
              </p>
            </>
          )}
        </div>

        <div className="dt-figure">
          <h3><T en="Why there are two marks" bn="দুটো সীমা কেন" /></h3>
          <p className="dt-why">
            <T
              en={`Under ${TIGHT} g gets almost everybody into ketosis and under ${LOOSE} g is enough for many people, and which of the two is yours is individual. The tool draws both rather than picking one, because a limit invented here is a limit you would then believe.`}
              bn={`${digits(TIGHT, "bn")} গ্রামের নিচে থাকলে প্রায় সবাই কিটোসিসে যায়, আর অনেকের জন্য ${digits(LOOSE, "bn")} গ্রামের নিচে থাকাই যথেষ্ট, কোনটা আপনার তা ব্যক্তিভেদে আলাদা। যন্ত্রটি একটা বেছে না দিয়ে দুটোই আঁকে, কারণ এখানে বানানো সীমাটাই আপনি বিশ্বাস করে ফেলতেন।`}
            />
          </p>
          <p className="dt-why">
            <T
              en="Protein is a different question and the answer is mostly no: the claim that it knocks you out of ketosis is not what the evidence says, because gluconeogenesis is demand driven rather than supply driven. The protein floor on the goal page stands."
              bn="প্রোটিন আলাদা প্রশ্ন, আর তার উত্তর বেশিরভাগ ক্ষেত্রেই না: প্রোটিন খেলে কিটোসিস ভেঙে যায় বলে যে কথাটা চলে, প্রমাণ তা বলে না, কারণ শরীর চাহিদা অনুযায়ী চিনি বানায়, জোগান অনুযায়ী নয়। লক্ষ্যের পাতার প্রোটিনের সর্বনিম্ন সীমা তাই আগের মতোই থাকছে।"
            />
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   The three, and the sentence that has to be beside them.

   Section 7. This renders signed out as well as signed in,
   because it is the section a reader is sent here for: the
   symptom table on `/tools/diet/journal` says there is a note
   about this on the keto page, and for a while there was no keto
   page.
   ============================================================ */
function Salts() {
  return (
    <div className="dt-salts">
      <TBlock
        en={(
          <p className="dt-hint">
            The lost water takes sodium with it, and most of what gets called
            keto flu is that. These are notes rather than a prescription, and
            they are amounts a whole day of food usually holds rather than
            things to go out and buy.
          </p>
        )}
        bn={(
          <p className="dt-hint">
            যে পানি বেরিয়ে যায় সেটা সোডিয়াম নিয়ে যায়, আর কিটো ফ্লু বলে যা চেনা হয়
            তার বেশিরভাগই সেটাই। এগুলো পরামর্শ নয়, শুধু জানিয়ে রাখা, আর এই পরিমাণ
            সারা দিনের খাবারেই সাধারণত থাকে, আলাদা করে কিনতে হয় না।
          </p>
        )}
      />

      <div className="dt-table-wrap">
        <table className="dt-table">
          <thead>
            <tr>
              <th scope="col"><T en="What" bn="কী" /></th>
              <th scope="col"><T en="Roughly how much" bn="আন্দাজে কতটা" /></th>
              <th scope="col"><T en="Why it goes" bn="কেন যায়" /></th>
              <th scope="col"><T en="Where it comes from" bn="কোথা থেকে আসে" /></th>
            </tr>
          </thead>
          <tbody>
            {SALTS.map((s) => (
              <tr key={s.id}>
                <th scope="row"><T en={s.en} bn={s.bn} /></th>
                <td className="mono"><T en={s.muchEn} bn={s.muchBn} /></td>
                <td className="dt-why"><T en={s.whyEn} bn={s.whyBn} /></td>
                <td className="dt-why"><T en={s.fromEn} bn={s.fromBn} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* THE LINE THAT MAKES THE TABLE SAFE TO PRINT AT ALL, and
          it is beside the numbers rather than at the foot of the
          page, because a reader who acts on the sodium row acts
          on it here. */}
      <Note tone="danger">
        <TBlock
          en={(
            <p>
              If you take medicine for blood pressure, or have kidney disease,
              ask a doctor before you add salt. For those two groups this advice
              is not merely unnecessary, it is actively wrong, and no
              calculator can tell which group you are in.
            </p>
          )}
          bn={(
            <p>
              আপনি যদি রক্তচাপের ওষুধ নেন, বা কিডনির রোগ থাকে, তাহলে লবণ বাড়ানোর
              আগে ডাক্তারের সঙ্গে কথা বলুন। এই দুই দলের জন্য এই পরামর্শ শুধু অপ্রয়োজনীয়
              নয়, উল্টো ক্ষতিকর, আর আপনি কোন দলে আছেন তা কোনো ক্যালকুলেটর বলতে পারে না।
            </p>
          )}
        />
      </Note>

      <p className="dt-why">
        <T
          en="Fibre falls off a cliff when grains and most fruit go, and it is the single thing most likely to make somebody feel unwell without knowing why. The nutrients page tracks it with how much of the day it was computed from, which is the only honest way to show it."
          bn="দানাশস্য আর বেশিরভাগ ফল বাদ পড়লে আঁশ হঠাৎ অনেক কমে যায়, আর কারণ না বুঝেই খারাপ লাগার পেছনে এটাই সবচেয়ে বড় কারণ। পুষ্টির পাতায় এর হিসাব রাখা হয়, সঙ্গে দিনের কতটুকু থেকে হিসাব হয়েছে তাও, আর এটাই দেখানোর একমাত্র সৎ উপায়।"
        />
      </p>
    </div>
  );
}

/* ============================================================
   A ketone reading, and what it does not say.

   `diet_days.ketones_mmol` was a column nothing wrote. A number
   off a blood meter belongs in the log beside the weight, and it
   is worth having for one reason: it answers "am I in ketosis",
   which is a real question a reader cannot otherwise answer.

   IT IS NOT A SCORE, and the note is beside the field rather
   than in a help article. Deeper ketosis is not faster fat loss.
   The deficit is what decides the fat, and a reader chasing 3.0
   is chasing a measure of how much fuel is in the blood.
   ============================================================ */
function Ketones({
  days, line, rate, today, todayRow, signedIn, ready, saving, onWrite, lang,
}: {
  days: Day[];
  line: Point[];
  rate: { low: number; mid: number; high: number } | null;
  today: string;
  todayRow: Day | undefined;
  signedIn: boolean;
  ready: boolean;
  saving: "idle" | "saving" | "saved" | "failed";
  onWrite: (patch: Partial<Day>) => void;
  lang: "en" | "bn";
}) {
  const [typed, setTyped] = useState("");

  /* What the field shows: what was typed this session if
     anything, and what the row already holds otherwise. A
     controlled box seeded from a row that arrives late would
     otherwise clear itself the moment the fetch landed. */
  const held = todayRow?.ketonesMmol;
  const value = typed !== "" ? typed : held != null ? String(held) : "";

  const readings = useMemo(
    () => days.filter((d) => d.ketonesMmol != null)
      .map((d) => ({ date: d.date, mmol: d.ketonesMmol as number }))
      .slice(-20),
    [days],
  );

  const weightOn = useMemo(() => {
    const by = new Map<number, number>();
    for (const p of line) by.set(p.day, p.kg);
    return by;
  }, [line]);

  const save = (): void => {
    const n = Number(typed);
    if (typed === "" || !Number.isFinite(n) || n < 0 || n > 10) return;
    onWrite({ ketonesMmol: Math.round(n * 100) / 100 });
    setTyped("");
  };

  return (
    <div className="dt-ketones">
      <TBlock
        en={(
          <p className="dt-hint">
            A blood meter reads {KETONE_LOW} to {KETONE_HIGH} mmol/L in
            {" "}
            <Term id="ketosis" en="ketosis" />
            . Urine strips get unreliable after adaptation, because the body
            stops throwing away what it has learnt to use, so a fading colour is
            a fading colour rather than a fading diet.
          </p>
        )}
        bn={(
          <p className="dt-hint">
            রক্তের মিটারে
            {" "}
            <Term id="ketosis" en="ketosis" bn="কিটোসিসে" />
            {" "}
            {digits(KETONE_LOW, "bn")} থেকে {digits(KETONE_HIGH, "bn")} মিলিমোল/লিটার
            আসে। খাপ খাওয়ানোর পর প্রস্রাবের স্ট্রিপ আর নির্ভরযোগ্য থাকে না, কারণ শরীর
            যেটা কাজে লাগাতে শিখেছে সেটা আর ফেলে দেয় না, তাই রঙ ফিকে হওয়া মানে রঙ
            ফিকে হওয়া, ডায়েট ফিকে হওয়া নয়।
          </p>
        )}
      />

      {signedIn ? (
        <div className="dt-ketone-entry">
          <Field
            id="dt-ketone"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            max="10"
            value={value}
            onChange={(e) => setTyped(e.target.value)}
            label={<T en="Today, in mmol/L" bn="আজ, মিলিমোল/লিটারে" />}
            hint={(
              <T
                en="Off a blood meter. Filed with today's row, beside the weight."
                bn="রক্তের মিটার থেকে। আজকের সারিতে, ওজনের পাশে জমা হয়।"
              />
            )}
          />
          <Button kind="solid" disabled={!ready || saving === "saving"} onClick={save}>
            <T en="Save it" bn="জমা দিন" />
          </Button>
          <span className="dt-save" data-state={saving}>
            <T
              en={saving === "saving" ? "Saving" : saving === "saved" ? "Saved"
                : saving === "failed" ? "That did not save" : ""}
              bn={saving === "saving" ? "জমা হচ্ছে" : saving === "saved" ? "জমা হয়েছে"
                : saving === "failed" ? "জমা হয়নি" : ""}
            />
          </span>
        </div>
      ) : (
        <p className="dt-invite">
          <T
            en="A reading is a row in your account, like a weight. The note under this field is the part worth reading either way."
            bn="ওজনের মতোই, একটা মাপ আপনার অ্যাকাউন্টে একটা সারি। তবু এই ঘরের নিচের কথাটা দুই দিকেই পড়ার মতো।"
          />
        </p>
      )}

      {/* THE NOTE, WHERE THE FIELD IS. Section 7 asks for it here
          and not in a help article, because the reader who needs
          it is the one about to type a number in. */}
      <Note tone="quiet">
        <TBlock
          en={(
            <p>
              A ketone level says a body is in ketosis. It says nothing at all
              about how fast fat is being lost: that is the deficit, and it is
              measured on the trend page. Somebody at 3.0 mmol/L is not losing
              faster than somebody at 0.8, and chasing the number is chasing a
              measure of how much fuel is in the blood.
            </p>
          )}
          bn={(
            <p>
              কিটোনের মাপ বলে শরীর কিটোসিসে আছে। কত দ্রুত চর্বি যাচ্ছে সে বিষয়ে এটা
              কিচ্ছু বলে না: সেটা ঠিক করে ঘাটতি, আর সেটা ধারার পাতায় মাপা হয়।
              ৩.০ মিলিমোলে থাকা মানুষ ০.৮ মিলিমোলে থাকা মানুষের চেয়ে দ্রুত কমাচ্ছেন না,
              আর এই সংখ্যার পিছনে ছোটা মানে রক্তে কতটা জ্বালানি আছে তার পিছনে ছোটা।
            </p>
          )}
        />
      </Note>

      {readings.length ? (
        <>
          <Spark points={readings.map((r) => ({ x: dayNumber(r.date), y: r.mmol }))} />
          <div className="dt-table-wrap">
            <table className="dt-table">
              <caption>
                <T
                  en="Your readings, with the trend weight of the same day beside each. Two measurements of two different things, side by side, and neither predicts the other."
                  bn="আপনার মাপগুলো, প্রতিটির পাশে সেই দিনের ধারার ওজন। দুটো আলাদা জিনিসের দুটো মাপ, পাশাপাশি, আর একটা থেকে অন্যটা বলা যায় না।"
                />
              </caption>
              <thead>
                <tr>
                  <th scope="col"><T en="Day" bn="দিন" /></th>
                  <th scope="col"><T en="mmol/L" bn="মিলিমোল/লি" /></th>
                  <th scope="col"><T en="Trend weight" bn="ধারার ওজন" /></th>
                </tr>
              </thead>
              <tbody>
                {[...readings].reverse().slice(0, 10).map((r) => {
                  const kg = weightOn.get(dayNumber(r.date));
                  return (
                    <tr key={r.date}>
                      <th scope="row" className="mono">
                        <T
                          en={dateWords(r.date, "en")}
                          bn={dateWords(r.date, "bn")}
                        />
                      </th>
                      <td className="mono">{digits(r.mmol.toFixed(1), lang)}</td>
                      <td className="mono">
                        {kg == null
                          ? <T en="no weighing" bn="মাপ নেই" />
                          : (
                            <T
                              en={`${kg.toFixed(1)} kg`}
                              bn={`${digits(kg.toFixed(1), "bn")} কেজি`}
                            />
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="dt-why">
            {rate ? (
              <T
                en={`Over the days a slope is allowed to see, the trend is moving ${Math.abs(rate.mid).toFixed(2)} kg a week. That number and the column beside it are the two halves of the same honest sentence: one says you are in ketosis, the other says how fast fat is actually leaving.`}
                bn={`যে দিনগুলো ঢাল দেখতে পারে, তাতে ধারা সপ্তাহে ${digits(Math.abs(rate.mid).toFixed(2), "bn")} কেজি করে নড়ছে। ওই সংখ্যাটা আর তার পাশের কলামটা একই সৎ কথার দুই অর্ধেক: একটা বলে আপনি কিটোসিসে আছেন, অন্যটা বলে চর্বি আসলে কত দ্রুত যাচ্ছে।`}
              />
            ) : (
              <T
                en="There is no readable rate to put beside these yet. A stretch shorter than a week carries none, and a settling window carries none either."
                bn="এগুলোর পাশে বসানোর মতো পড়া যায় এমন কোনো হার এখনো নেই। এক সপ্তাহের কম সময়ে হার পড়া যায় না, থিতু হওয়ার সময়েও যায় না।"
              />
            )}
          </p>
        </>
      ) : (
        <p className="dt-why">
          <T
            en="Nothing has been read off a meter yet. One reading says whether you are in ketosis; a fortnight of them says how steady you are, which is the only thing a run of them adds."
            bn="এখনো কোনো মিটারের মাপ লেখা হয়নি। একটা মাপ বলে আপনি কিটোসিসে আছেন কি না; দুই সপ্তাহের মাপ বলে আপনি কতটা স্থির, আর একগুচ্ছ মাপ এর বেশি কিছু যোগ করে না।"
          />
        </p>
      )}
    </div>
  );
}
