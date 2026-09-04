"use client";

/* What to expect, and when. `DIET.md` sections 10 and 11. Almost
   everybody who quits does so at a point that was predictable a fortnight
   earlier.

   SAID BEFORE THE WEEK, NOT EXPLAINED AFTER IT: the expectation is stated
   in advance and the reader's own number goes beside it afterwards, with
   NO VERDICT attached. A reader who sees "expected 0.2 to 0.6, saw 0.3"
   in week two does not quit in week two.

   AND STACKING IS THE PART NOTHING ELSE HANDLES: `forecastChange()` takes
   the PREVIOUS protocol and its days, because two water-losing protocols
   do not take the same water off twice. Three days of keto then a two day
   fast moves the scale about 3.6kg and under a quarter of it is fat. THE
   CONTROL FOR THAT IS ON THE PAGE, and it has to be: passing `from: null`
   leaves that arithmetic written, tested and never reached by a
   reader. */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  UNLOCKS, activityFactor, bandsFor, estimatedBurn, fatEstimate, forecastChange,
  hourlyArc, learnedHere, protocolName, restingBurn, settlingDays,
  slopePerWeek, trend, weighings,
  type Body, type Day, type Phase, type Protocol,
} from "@reiad/shared/diet";
import {
  who, getDays, getPhases, getProfile, dayNumber, isoDate, shiftDate,
  type Profile, type Who,
} from "../../lib/diet-api";
import { ChipButton } from "../ui/chip";
import { T, digits, useToolLang } from "./lang";

const ARC: Array<{ when: string; whenBn: string; what: string; whatBn: string; why: string; whyBn: string }> = [
  { when: "Days 1 to 7", whenBn: "১ থেকে ৭ দিন",
    what: "A fast drop, often 1 to 3 kg, and most of it is not fat",
    whatBn: "দ্রুত কমা, প্রায়ই ১ থেকে ৩ কেজি, যার বেশিরভাগই চর্বি নয়",
    why: "Glycogen and its water, less food in the gut, less sodium",
    whyBn: "গ্লাইকোজেন আর তার পানি, পেটে কম খাবার, কম লবণ" },
  { when: "Days 8 to 14", whenBn: "৮ থেকে ১৪ দিন",
    what: "Almost nothing, and this is the first place people quit",
    whatBn: "প্রায় কিছুই না, আর এখানেই মানুষ প্রথম ছেড়ে দেয়",
    why: "The water has gone and what is left is the real rate",
    whyBn: "পানি চলে গেছে, যা বাকি আছে সেটাই আসল হার" },
  { when: "Days 15 to 28", whenBn: "১৫ থেকে ২৮ দিন",
    what: "The first honest reading, and your learned maintenance appears",
    whatBn: "প্রথম সৎ হিসাব, আর আপনার নিজের খরচ বেরিয়ে আসে",
    why: "Enough trend to have a slope",
    whyBn: "ঢাল বের করার মতো যথেষ্ট ধারা" },
  { when: "Weeks 4 to 8", whenBn: "৪ থেকে ৮ সপ্তাহ",
    what: "Steady loss, and hunger rises somewhat",
    whatBn: "নিয়মিত কমা, আর ক্ষুধা কিছুটা বাড়ে",
    why: "Normal. The hunger score is where that gets watched",
    whyBn: "স্বাভাবিক। ক্ষুধার হিসাব সেখানেই নজরে রাখা হয়" },
  { when: "Weeks 6 to 10", whenBn: "৬ থেকে ১০ সপ্তাহ",
    what: "The target you set in week one is now wrong",
    whatBn: "প্রথম সপ্তাহে ঠিক করা লক্ষ্য এখন ভুল",
    why: "Maintenance falls further than the lost weight alone explains",
    whyBn: "শুধু ওজন কমার হিসাবের চেয়েও বেশি কমে যায় খরচ" },
  { when: "Weeks 8 to 12", whenBn: "৮ থেকে ১২ সপ্তাহ",
    what: "A break at maintenance is worth taking",
    whatBn: "খরচের সমান খেয়ে একটা বিরতি নেওয়ার মতো",
    why: "Not a reward: the thing that makes the next block work",
    whyBn: "পুরস্কার নয়: পরের ধাপটা যেটা কাজে লাগায়" },
  { when: "Month 3 and after", whenBn: "৩ মাস ও তার পরে",
    what: "The same percentage is fewer kilos every month",
    whatBn: "একই শতাংশ মানে প্রতি মাসে কম কেজি",
    why: "Arithmetic, not failure",
    whyBn: "হিসাব, ব্যর্থতা নয়" },
];

/** The three the panel offers, out of the one table in
    `shared/diet.ts` rather than a second copy of the names. */
const OFFERED: Protocol[] = ["keto", "fast", "standard"];

/** And what may have been running before this. `null` is
    ordinary eating, which is what a fresh start finds. */
const BEFORE: Array<Protocol | null> = [null, "keto", "standard", "fast"];

/** The figures used when the reader has logged nothing, so the
    tables are readable to somebody deciding whether to start.
    Both are named on screen as stand-ins wherever they are used,
    which is every time and not only when the log is empty. */
const STAND_IN_KG = 80;
const STAND_IN_BURN = 2500;

/** The deficit the forecast assumes on anything that is not a
    complete fast, and it is stated on the page. The reader has
    not told this panel what they intend to eat, so a number is
    assumed and disclosed rather than quietly chosen. */
const ASSUMED_DEFICIT = 500;

const intakeUnder = (p: Protocol, burn: number): number => {
  if (p === "fast") return 0;
  if (p === "maintain" || p === "break") return burn;
  return Math.max(burn - ASSUMED_DEFICIT, 0);
};

export function ExpectPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [what, setWhat] = useState<Protocol>("fast");
  const [howLong, setHowLong] = useState(2);
  const [before, setBefore] = useState<Protocol | null>(null);
  const [beforeDays, setBeforeDays] = useState(3);
  const today = isoDate();

  useEffect(() => {
    let alive = true;
    void who().then((f) => { if (alive) setW(f); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!w) return;
    let alive = true;
    void Promise.all([getDays(w, shiftDate(today, -120)), getPhases(w), getProfile(w)])
      .then(([d, p, pr]) => { if (alive) { setDays(d); setPhases(p); setProfile(pr); } });
    return () => { alive = false; };
  }, [w, today]);

  /* Drawn and fittable are two lists: a marked day is drawn and
     is not fitted, and neither is a stretch that is settling. */
  const { drawn: points, fittable } = useMemo(
    () => weighings({ days, dayOf: dayNumber, phases, today: dayNumber(today) }),
    [days, phases, today],
  );
  const rate = useMemo(() => slopePerWeek(fittable), [fittable]);
  const line = useMemo(() => trend(points), [points]);

  /* THE TREND, NOT THE LAST READING. A scale reading is a real
     weight plus a kilo or two of water, and it is the size of
     the glycogen store below that is computed from it. */
  const mine = line.length ? line[line.length - 1].kg : null;
  const kg = mine ?? STAND_IN_KG;

  const learned = useMemo(() => learnedHere({
    weights: fittable,
    intakes: days.filter((d) => d.kcal != null)
      .map((d) => ({ day: dayNumber(d.date), kcal: d.kcal as number })),
    phases,
    today: dayNumber(today),
  }), [fittable, days, phases, today]);

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

  /* THE READER'S OWN MAINTENANCE WHERE THERE IS ONE. Everything
     below is arithmetic on a deficit, so a stranger's 2,500
     produces a stranger's forecast: the learned figure first,
     the estimate from their own body second, and the stand-in
     last and labelled. */
  const burnFrom: "learned" | "estimated" | "stand-in" =
    learned ? "learned" : estimated != null ? "estimated" : "stand-in";
  const burn = Math.round(learned?.kcal.mid ?? estimated ?? STAND_IN_BURN);

  /* The previous protocol carries its own intake, because how
     much of the store it had already taken depends on how much
     less was being eaten under it. Without one, a deficit
     protocol is credited with no prior drain at all rather than
     with a guess, which errs wetter and never flatteringly. */
  const prior = useMemo(
    () => (before ? { protocol: before, days: beforeDays, intake: intakeUnder(before, burn) } : null),
    [before, beforeDays, burn],
  );

  const cast = useMemo(() => forecastChange({
    from: prior, to: what, days: howLong, weightKg: kg, burn,
    intake: intakeUnder(what, burn),
  }), [prior, what, howLong, kg, burn]);

  return (
    <div className="dt-expect">
      <section aria-labelledby="dt-arc-h">
        <h2 id="dt-arc-h"><T en="The arc of a deficit" bn="ঘাটতির ধাপগুলো" /></h2>
        <div className="dt-table-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                <th scope="col"><T en="When" bn="কখন" /></th>
                <th scope="col"><T en="What usually happens" bn="সাধারণত যা হয়" /></th>
                <th scope="col"><T en="Why" bn="কেন" /></th>
              </tr>
            </thead>
            <tbody>
              {ARC.map((r) => (
                <tr key={r.when}>
                  <th scope="row"><T en={r.when} bn={r.whenBn} /></th>
                  <td><T en={r.what} bn={r.whatBn} /></td>
                  <td className="dt-why"><T en={r.why} bn={r.whyBn} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rate && line.length > 1 ? (
          <p className="dt-said">
            <T
              en={`Yours is running at ${rate.mid.toFixed(2)} kg a week over the readings you have.`}
              bn={`আপনার যা আছে তা থেকে সপ্তাহে ${digits(rate.mid.toFixed(2), "bn")} কেজি চলছে।`}
            />
          </p>
        ) : null}
      </section>

      <section aria-labelledby="dt-cast-h">
        <h2 id="dt-cast-h"><T en="Before you change anything" bn="কিছু বদলানোর আগে" /></h2>
        <p className="dt-intro">
          <T
            en="Four facts and no advice. It does not say whether this is a good idea: it says what the scale will do and which part of it is real, which is the only thing this can honestly know and the thing nobody is told."
            bn="চারটে তথ্য, কোনো পরামর্শ নয়। এটা ভালো না মন্দ তা বলা হচ্ছে না: বলা হচ্ছে দাঁড়িপাল্লা কী করবে আর তার কোন অংশটা আসল, যেটাই এই যন্ত্র সৎভাবে জানতে পারে আর যেটা কেউ বলে না।"
          />
        </p>

        {/* Every group is named by something VISIBLE rather than
            by an `aria-label`, which is an attribute and can
            hold one language. A Bangla reader was getting the
            English one. */}
        <div className="dt-cast-controls">
          <div className="dt-scale">
            <span className="dt-scale-label" id="dt-cast-what">
              <T en="What you are about to do" bn="আপনি যা করতে যাচ্ছেন" />
            </span>
            <div className="dt-tags" role="group" aria-labelledby="dt-cast-what">
              {OFFERED.map((id) => (
                <ChipButton key={id} pressed={what === id} onClick={() => setWhat(id)}>
                  <T en={protocolName(id).en} bn={protocolName(id).bn} />
                </ChipButton>
              ))}
            </div>
          </div>
          <div className="dt-scale">
            <span className="dt-scale-label" id="dt-cast-long">
              <T en="For how long" bn="কত দিন ধরে" />
            </span>
            <div className="dt-tags" role="group" aria-labelledby="dt-cast-long">
              {[2, 3, 7, 14].map((n) => (
                <ChipButton key={n} pressed={howLong === n} onClick={() => setHowLong(n)}>
                  <T en={`${n} days`} bn={`${digits(n, "bn")} দিন`} />
                </ChipButton>
              ))}
            </div>
          </div>

          {/* WHAT WAS RUNNING BEFORE IT, which is the whole of the
              stacking arithmetic. Two water-losing protocols do
              not take the same water off twice: a fast starting on
              the third day of keto finds a third of the store
              left, so its drop is mostly gut contents instead. */}
          <div className="dt-scale">
            <span className="dt-scale-label" id="dt-cast-before">
              <T en="And before that you were doing" bn="আর তার আগে আপনি করছিলেন" />
            </span>
            <div className="dt-tags" role="group" aria-labelledby="dt-cast-before">
              {BEFORE.map((id) => (
                <ChipButton key={id ?? "none"} pressed={before === id}
                            onClick={() => setBefore(id)}>
                  {id
                    ? <T en={protocolName(id).en} bn={protocolName(id).bn} />
                    : <T en="Nothing in particular" bn="বিশেষ কিছু নয়" />}
                </ChipButton>
              ))}
            </div>
          </div>
          {before ? (
            <div className="dt-scale">
              <span className="dt-scale-label" id="dt-cast-before-long">
                <T en="For how long already" bn="এর মধ্যে কত দিন" />
              </span>
              <div className="dt-tags" role="group" aria-labelledby="dt-cast-before-long">
                {[2, 3, 7, 14].map((n) => (
                  <ChipButton key={n} pressed={beforeDays === n}
                              onClick={() => setBeforeDays(n)}>
                    <T en={`${n} days`} bn={`${digits(n, "bn")} দিন`} />
                  </ChipButton>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="dt-readout">
          <div className="dt-figure dt-figure-lead">
            <h3>
              {before
                ? <T en="What the scale will do next" bn="দাঁড়িপাল্লা এরপর যা করবে" />
                : <T en="What the scale will do" bn="দাঁড়িপাল্লা যা করবে" />}
            </h3>
            <p className="dt-value">
              <T en={`${cast.scale.high.toFixed(1)} to ${cast.scale.low.toFixed(1)} kg`}
                 bn={`${digits(cast.scale.high.toFixed(1), "bn")} থেকে ${digits(cast.scale.low.toFixed(1), "bn")} কেজি`} />
            </p>
            {/* THE SHARE IS PRINTED ONLY WHERE IT IS KNOWN. It
                read "about 100% is fat" for an ordinary deficit
                for as long as this panel existed, directly above
                the paragraph saying nothing that moves on the
                first day is fat, because the water model had no
                row for that protocol and an absent row read as a
                measured zero. */}
            <p className="dt-said">
              {cast.fatShareKnown
                ? <T en={`Of which about ${Math.round(cast.fatShare * 100)}% is fat.`}
                     bn={`যার প্রায় ${digits(Math.round(cast.fatShare * 100), "bn")}% চর্বি।`} />
                : <T en="How much of that is fat is not something this can say for what you have picked."
                     bn="আপনি যা বেছেছেন তার কতটা চর্বি, সেটা এখান থেকে বলা যায় না।" />}
            </p>
          </div>
          <div className="dt-figure">
            <h3><T en="What comes back" bn="যা ফিরে আসবে" /></h3>
            <p className="dt-value">
              <T en={`+${cast.rebound.low.toFixed(1)} to ${cast.rebound.high.toFixed(1)} kg`}
                 bn={`+${digits(cast.rebound.low.toFixed(1), "bn")} থেকে ${digits(cast.rebound.high.toFixed(1), "bn")} কেজি`} />
            </p>
            <p className="dt-why">
              <T en="In the first days of ordinary eating, and none of it is fat. The tool will not call it a gain."
                 bn="স্বাভাবিক খাওয়া শুরুর প্রথম কয়েক দিনে, আর এর এক ছটাকও চর্বি নয়। যন্ত্রটি একে বাড়া বলবে না।" />
            </p>
          </div>
          <div className="dt-figure">
            <h3><T en="Readable again" bn="আবার পড়া যাবে" /></h3>
            {/* Both halves say the same thing. The English read
                "no days after it ends" while the Bangla rendered
                a nought and the word for days, which is two
                different sentences on one page. */}
            <p className="dt-value">
              {settlingDays(what) === 0
                ? <T en="Straight away" bn="সঙ্গে সঙ্গেই" />
                : <T en={`${settlingDays(what)} days after it ends`}
                     bn={`শেষ হওয়ার ${digits(settlingDays(what), "bn")} দিন পর`} />}
            </p>
            <p className="dt-why">
              <T en="No slope is fitted across a change of protocol: that is a slope fitted across a step in body water, and it reports a rate nobody is running."
                 bn="নিয়ম বদলের উপর দিয়ে কোনো ঢাল বসানো হয় না: সেটা শরীরের পানির একটা ধাপের উপর দিয়ে ঢাল বসানো, আর তাতে এমন হার আসে যেটা কেউ চালাচ্ছে না।" />
            </p>
          </div>
        </div>
        {/* WHAT IT WAS COMPUTED AGAINST, EVERY TIME. The
            stand-in maintenance was disclosed only to a reader
            who had logged no weight at all, so anybody with a
            weight read their own kilos beside a stranger's
            2,500 with nothing saying so. */}
        <Basis kg={kg} mine={mine != null} burn={burn} from={burnFrom} what={what} />

        <HourByHour what={what} kg={kg} burn={burn} lang={lang} prior={prior} />
      </section>

      <section aria-labelledby="dt-unlock-h">
        <h2 id="dt-unlock-h"><T en="What arrives, and when" bn="কী কখন আসবে" /></h2>
        <p className="dt-intro">
          <T en="Nothing is held back as a reward. Each appears when there is enough data for it to be honest."
             bn="পুরস্কার হিসেবে কিছুই আটকে রাখা হয় না। যখন সৎ হওয়ার মতো যথেষ্ট তথ্য জমে, তখনই প্রতিটি আসে।" />
        </p>
        <ul className="dt-tag-counts">
          {UNLOCKS.map((u) => (
            <li key={u.day}>
              <span className="mono dt-src"><T en={`Day ${u.day}`} bn={`${digits(u.day, "bn")} দিন`} /></span>
              <span><T en={u.en} bn={u.bn} /></span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

    /* What the forecast was computed against: three facts, always, and
       none optional. Whose weight, whose maintenance, and what intake was
       assumed. A forecast is arithmetic on a deficit, so a stand-in
       maintenance produces a stand-in answer however real the kilograms
       beside it look, and the reader is the only person who can tell the
       difference if they are told. */
function Basis({ kg, mine, burn, from, what }: {
  kg: number; mine: boolean; burn: number;
  from: "learned" | "estimated" | "stand-in"; what: Protocol;
}) {
  const eats = intakeUnder(what, burn);
  return (
    <p className="dt-why">
      {mine
        ? <T en={`Computed against your trend weight of ${kg.toFixed(1)} kg.`}
             bn={`আপনার ধারার ওজন ${digits(kg.toFixed(1), "bn")} কেজি ধরে হিসাব করা।`} />
        : <T en={`Computed for an ${STAND_IN_KG} kg body, because you have not logged a weight yet.`}
             bn={`${digits(STAND_IN_KG, "bn")} কেজি শরীর ধরে হিসাব করা, কারণ আপনি এখনো ওজন লেখেননি।`} />}
      {" "}
      {from === "learned" ? (
        <T en={`Maintenance is your own ${burn} a day, measured from your log.`}
           bn={`খরচ ধরা হয়েছে আপনার নিজের দিনে ${digits(burn, "bn")}, আপনার খাতা থেকে মাপা।`} />
      ) : from === "estimated" ? (
        <T en={`Maintenance is an estimated ${burn} a day, from your height, age and activity. It becomes a measured figure after fourteen days of logs.`}
           bn={`খরচ ধরা হয়েছে আন্দাজে দিনে ${digits(burn, "bn")}, আপনার উচ্চতা, বয়স আর চলাফেরা থেকে। চৌদ্দ দিন লেখার পর এটা মাপা হিসাব হয়ে যায়।`} />
      ) : (
        <T en={`Maintenance is a stand-in ${burn} a day and is not yours: the tool measures your own after fourteen days of logs.`}
           bn={`খরচ ধরা হয়েছে দিনে ${digits(burn, "bn")}, যা আপনার নয়, শুধু একটা ধরে নেওয়া সংখ্যা: চৌদ্দ দিন লেখার পর যন্ত্রটি আপনার নিজেরটা মেপে নেয়।`} />
      )}
      {" "}
      {what === "fast"
        ? <T en="A complete fast is nothing at all going in."
             bn="পূর্ণ উপবাস মানে ভেতরে কিছুই যাচ্ছে না।" />
        : <T en={`It assumes you eat about ${eats} a day, which is ${ASSUMED_DEFICIT} under that.`}
             bn={`ধরে নেওয়া হয়েছে আপনি দিনে প্রায় ${digits(eats, "bn")} খাবেন, অর্থাৎ তার চেয়ে ${digits(ASSUMED_DEFICIT, "bn")} কম।`} />}
    </p>
  );
}

    /* The first week, hour by hour. The weekly table above is right and
       too coarse for the days that decide whether somebody carries on.

       The fat SHARE column is the point: it starts near nothing and climbs
       all week, and a reader who can see that at hour twelve does not read
       a two kilo drop as two kilos of fat, and does not read day four's
       much smaller movement as the diet having stopped working. A BAR
       rather than a bare percentage, because the shape of it climbing IS
       the message and a column of numbers hides a shape. */
function HourByHour({ what, kg, burn, lang, prior }: {
  what: Protocol; kg: number; burn: number; lang: "en" | "bn";
  prior: { protocol: Protocol; days: number; intake: number } | null;
}) {
  const [step, setStep] = useState(12);
  const arc = useMemo(() => hourlyArc({
    from: prior, to: what, days: 7, weightKg: kg, burn,
    intake: intakeUnder(what, burn),
  }, step), [prior, what, kg, burn, step]);

  const bands = bandsFor(what);
  /* The END of the week, not the smallest number in the column.
     `Math.min` over a signed series is the most negative one, so
     it printed "about -5.2 kg down": a minus sign inside a
     sentence that already says which way it went. */
  const end = arc[arc.length - 1];
  const endScale = end?.scale.mid ?? 0;
  const endShare = Math.round((end?.fatShare ?? 0) * 100);
  const down = endScale <= 0;

  return (
    <div className="dt-hours">
      <div className="dt-hours-head">
        {/* THE FULL WEEK, whatever duration was chosen above, and
            the heading says so. The card above answers "what if I
            do this for two days"; this answers "what does the
            first week of it look like", and a reader who picked
            two days and then read a seven day total as their own
            would be reading a number that is not about them. */}
        <h3>
          <T
            en="The first week, hour by hour, if you kept going"
            bn="প্রথম সপ্তাহ, ঘণ্টায় ঘণ্টায়, চালিয়ে গেলে"
          />
        </h3>
        <div className="dt-tags" role="group"
             aria-label={lang === "bn" ? "কত সূক্ষ্মভাবে" : "How fine"}>
          {[6, 12, 24].map((n) => (
            <ChipButton key={n} pressed={step === n} onClick={() => setStep(n)}>
              <T en={`every ${n}h`} bn={`প্রতি ${digits(n, "bn")} ঘণ্টা`} />
            </ChipButton>
          ))}
        </div>
      </div>

      <p className="dt-hint">
        <T
          en="Everything that makes week one confusing happens inside the first seventy-two hours. Watch the last column: it starts near nothing and climbs all week, which is the whole reason a big early drop and a small later one can mean the same thing."
          bn="প্রথম সপ্তাহকে যা কিছু বিভ্রান্তিকর করে তার সবই প্রথম বাহাত্তর ঘণ্টার মধ্যে ঘটে। শেষ কলামটা দেখুন: শুরুতে প্রায় শূন্য, তারপর সারা সপ্তাহ ধরে বাড়ে, আর এই কারণেই শুরুর বড় কমা আর পরের ছোট কমা একই কথা বলতে পারে।"
        />
      </p>

      <div className="dt-table-wrap">
        <table className="dt-table dt-hours-table">
          <thead>
            <tr>
              <th scope="col"><T en="Hour" bn="ঘণ্টা" /></th>
              <th scope="col"><T en="What is happening" bn="কী ঘটছে" /></th>
              <th scope="col"><T en="Scale" bn="দাঁড়িপাল্লা" /></th>
              <th scope="col"><T en="Fat" bn="চর্বি" /></th>
              <th scope="col"><T en="Of the drop, fat" bn="কমার মধ্যে চর্বি" /></th>
            </tr>
          </thead>
          <tbody>
            {arc.map((p) => {
              const band = bands.find((b) => p.hour >= b.from && p.hour < b.to);
              const opens = !!band && p.hour === band.from;
              return (
                <tr key={p.hour} data-opens={opens ? "" : undefined}>
                  {/* `Math.round` collided: hour 60 and hour 72 both
                      rendered "day 3", so half the table carried a
                      label that was already above it. Days and the
                      remainder, written out. */}
                  <th scope="row" className="mono">
                    {p.hour < 48
                      ? <T en={`${p.hour}h`} bn={`${digits(p.hour, "bn")} ঘ`} />
                      : (
                        <T
                          en={`day ${Math.floor(p.hour / 24)}${p.hour % 24 ? ` +${p.hour % 24}h` : ""}`}
                          bn={`${digits(Math.floor(p.hour / 24), "bn")} দিন${p.hour % 24 ? ` +${digits(p.hour % 24, "bn")} ঘ` : ""}`}
                        />
                      )}
                  </th>
                  <td className="dt-why">
                    {opens && band ? <T en={band.en} bn={band.bn} /> : null}
                  </td>
                  <td className="mono">{digits(p.scale.mid.toFixed(2), lang)}</td>
                  <td className="mono">{digits(p.fat.toFixed(2), lang)}</td>
                  {/* The column the whole table is for, so it
                      says "not known" rather than filling in a
                      hundred percent where the model has no
                      water term to divide by. */}
                  <td className="dt-hours-share">
                    {p.fatShareKnown ? (
                      <>
                        <span
                          className="dt-hours-bar"
                          style={{ "--share": `${Math.round(p.fatShare * 100)}%` } as CSSProperties}
                        />
                        <span className="mono">{digits(Math.round(p.fatShare * 100), lang)}%</span>
                      </>
                    ) : (
                      <span className="dt-why"><T en="not known" bn="জানা নেই" /></span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="dt-why">
        {end?.fatShareKnown ? (
          <T
            en={`Held for a full week, the scale would read about ${Math.abs(endScale).toFixed(1)} kg ${down ? "down" : "up"} and about ${endShare}% of that would be fat. The rest comes back when ordinary eating does, and the tool will not call that a gain.`}
            bn={`পুরো এক সপ্তাহ চললে দাঁড়িপাল্লা প্রায় ${digits(Math.abs(endScale).toFixed(1), "bn")} কেজি ${down ? "নিচে" : "উপরে"} দেখাত, আর তার প্রায় ${digits(endShare, "bn")}% হত চর্বি। বাকিটা স্বাভাবিক খাওয়া ফিরলেই ফিরে আসে, আর যন্ত্রটি সেটাকে বাড়া বলবে না।`}
          />
        ) : (
          <T
            en={`Held for a full week, the scale would read about ${Math.abs(endScale).toFixed(1)} kg ${down ? "down" : "up"}. How much of that is fat is not something this can say for what you have picked.`}
            bn={`পুরো এক সপ্তাহ চললে দাঁড়িপাল্লা প্রায় ${digits(Math.abs(endScale).toFixed(1), "bn")} কেজি ${down ? "নিচে" : "উপরে"} দেখাত। তার কতটা চর্বি, সেটা আপনি যা বেছেছেন তার জন্য এখান থেকে বলা যায় না।`}
          />
        )}
      </p>
    </div>
  );
}
