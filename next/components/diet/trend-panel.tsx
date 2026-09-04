"use client";

/* The long view. `DIET.md` sections 4, 10 and 28.

   The chart is an SVG drawn from the rows: no library and no canvas, and
   a chart that needs a megabyte of JavaScript is blank in the second
   everybody judges a page in. Four rules, each a way charts lie:

   1. A TABLE UNDERNEATH, in a `<details>`, named by `aria-describedby`.
      A trend line that exists only as a path is a page a screen reader
      cannot read at all.
   2. NOTHING IS ENCODED IN COLOUR ALONE: the scale is thin and faint, the
      trend heavy, a settling window a hatch, and a marked day a ring with
      a column of its own in the table.
   3. THE Y AXIS DOES NOT START AT ZERO AND SAYS SO. Starting at zero is
      unreadable; a clipped axis with no label exaggerates every wobble.
   4. The scale readings are drawn behind the trend, because hiding them
      would make the tool look like it was flattering the reader. */

import { useEffect, useMemo, useState } from "react";
import {
  cycleOverCycle, cyclePlace, learnedHere, markNamed, protocolName,
  quietSeason, slopePerWeek, stall, STALL_DAYS,
  stretches, trend, weighings,
  type Day, type Phase, type Point, type Stall, type StallKind,
} from "@reiad/shared/diet";
import {
  who, getDays, getPhases, getProfile, dayNumber, isoDate, shiftDate,
  type Profile, type Who,
} from "../../lib/diet-api";
import { stepShift } from "@reiad/shared/activity";
import { DEFAULT_PLACE } from "@reiad/shared/foods";
import { ChipButton } from "../ui/chip";
import { SeasonNote } from "./season-note";
import { T, digits, useToolLang } from "./lang";
import { Invite } from "./invite";

const W = 720;
const H = 260;
const PAD = { l: 42, r: 12, t: 12, b: 26 };

export function TrendPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [span, setSpan] = useState(90);

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
    void Promise.all([getDays(w, shiftDate(today, -365)), getPhases(w), getProfile(w)])
      .then(([d, ph, pr]) => {
        if (!alive) return;
        setDays(d); setPhases(ph); setProfile(pr);
      });
    return () => { alive = false; };
  }, [w, today]);

  const inSpan = useMemo(
    () => days.filter((d) => d.date >= shiftDate(today, -span)), [days, today, span],
  );
  /* DRAWN AND FITTED ARE TWO LISTS, and `weighings()` is the one
     place that says which is which: a marked day and a settling
     window are both drawn and both left out of the slope. */
  const { drawn: points, fittable, marked } = useMemo(
    () => weighings({ days: inSpan, dayOf: dayNumber, phases, today: dayNumber(today) }),
    [inSpan, phases, today],
  );
  const line = useMemo(() => trend(points), [points]);
  const markedDays = useMemo(() => new Set(marked.map((p) => p.day)), [marked]);

  const rate = useMemo(() => slopePerWeek(fittable), [fittable]);
  const spans = useMemo(
    () => (phases.length ? stretches(phases, dayNumber(today)) : []),
    [phases, today],
  );

  /* PER PHASE, NEVER ACROSS ONE. The slope above already knew
     that and this did not: it was handed the raw run, so a
     window with a complete fast in the middle of it returned a
     maintenance built on an intake nobody ate.

     Every intake in the stretch is kept, marked days included: a
     big meal is energy that was really eaten and belongs in the
     mean. It is the WEIGHT on that day that means nothing. */
  const learned = useMemo(() => learnedHere({
    weights: fittable,
    intakes: inSpan.filter((d) => d.kcal != null)
      .map((d) => ({ day: dayNumber(d.date), kcal: d.kcal as number })),
    phases,
    today: dayNumber(today),
  }), [fittable, inSpan, phases, today]);

  /* THREE FLAT WEEKS WITH THE DEFICIT LOGGED, and which of the
     four it is. `stall()` returns null for every honest reason
     not to say anything, and null is the ordinary answer.

     The learned burn is measured at both ends of the window, so
     a maintenance that has fallen can be told from a log that has
     drifted. Both figures come from the same function, over two
     spans, rather than one figure and a guess. */
  /* WHERE THE READER IS IN A CYCLE, if they turned that on. Null
     for everybody else, which is the ordinary answer, and the
     stall reading takes null to mean "no reason not to speak". */
  const place = useMemo(() => (
    profile?.cycle_tracking && profile.cycle_start
      ? cyclePlace({
        day: dayNumber(today),
        startDay: dayNumber(profile.cycle_start),
        length: profile.cycle_days,
      })
      : null
  ), [profile, today]);

  const perCycle = useMemo(() => (
    profile?.cycle_tracking && profile.cycle_start
      ? cycleOverCycle({
        weights: fittable,
        startDay: dayNumber(profile.cycle_start),
        length: profile.cycle_days,
        today: dayNumber(today),
      })
      : null
  ), [profile, fittable, today]);

  /* WHAT TIME OF YEAR IT IS, in the place the reader eats. A
     monsoon, a British winter and a month of fasting all flatten
     three weeks on a schedule, exactly as the luteal phase does,
     and a stall reported inside one is the same false positive. */
  const where = profile?.place ?? DEFAULT_PLACE;
  const season = useMemo(() => quietSeason({ date: today, place: where }), [today, where]);

  /* THE FOURTH STALL NEEDS A FOURTH FACT. `stepShift()` already
     computes the middle day over a window and the window before
     it, so nothing here recomputes a median. */
  const walked = useMemo(() => stepShift(inSpan, today, STALL_DAYS), [inSpan, today]);

  const stalled = useMemo(() => {
    const now = dayNumber(today);
    const intakes = inSpan.filter((d) => d.kcal != null)
      .map((d) => ({ day: dayNumber(d.date), kcal: d.kcal as number }));
    const burnAt = (upTo: number): number | undefined => {
      const got = learnedHere({
        weights: fittable.filter((p) => p.day <= upTo),
        intakes: intakes.filter((d) => d.day <= upTo),
        phases,
        today: upTo,
      });
      return got?.kcal.mid;
    };
    return stall({
      weights: fittable,
      intakes,
      waists: inSpan.filter((d) => d.waistCm != null)
        .map((d) => ({ day: dayNumber(d.date), cm: d.waistCm as number })),
      today: now,
      burnThen: burnAt(now - STALL_DAYS),
      burnNow: burnAt(now),
      stepsThen: walked.before ?? undefined,
      stepsNow: walked.now ?? undefined,
      cycle: place,
      season,
    });
  }, [fittable, inSpan, phases, today, place, season, walked]);

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;
  if (!w) {
    return (
      <Invite
        en="A trend needs a run of weighings, and those live on your account."
        bn="ধারা দেখতে কয়েক দিনের ওজন লাগে, আর সেগুলো আপনার অ্যাকাউন্টে থাকে।"
        shows={[
          { en: "The trend drawn over every scale reading, because hiding the readings would flatter you.",
            bn: "প্রতিটা মাপের উপরে আঁকা ধারা, কারণ মাপগুলো লুকালে সেটা আপনাকে খুশি করার জন্য হতো।" },
          { en: "The rate in kilos a week with its error bar, and what your own log says you burn.",
            bn: "সপ্তাহে কত কেজি, তার ভুলের সীমা সহ, আর আপনার নিজের খাতা বলছে আপনি কত খরচ করেন।" },
          { en: "Whether three flat weeks are a stall, and which of the four kinds it is.",
            bn: "তিন সপ্তাহ স্থির থাকা সত্যিই আটকে যাওয়া কি না, আর হলে চারটার কোনটা।" },
          { en: "What time of year it is, and where you are in a month if you turned that on.",
            bn: "বছরের কোন সময় চলছে, আর চালু করে থাকলে মাসের কোথায় আছেন।" },
        ]}
      />
    );
  }

  if (points.length < 2) {
    return <p className="dt-hint"><T
      en="Two weighings draw a line. Nothing here reacts to one reading: a single weight is real weight plus a kilo or two of water, gut contents and salt."
      bn="দুই দিনের ওজনে রেখা আঁকা হয়। এখানে কিছুই একটামাত্র মাপে সাড়া দেয় না: একদিনের ওজন মানে আসল ওজনের সঙ্গে এক দুই কেজি পানি, পেটের খাবার আর লবণ।"
    /></p>;
  }

  const xs = points.map((p) => p.day);
  const ys = [...points.map((p) => p.kg), ...line.map((p) => p.kg)];
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const px = (d: number): number =>
    PAD.l + (x1 === x0 ? 0 : ((d - x0) / (x1 - x0)) * (W - PAD.l - PAD.r));
  const py = (kg: number): number =>
    PAD.t + (y1 === y0 ? 0 : (1 - (kg - y0) / (y1 - y0)) * (H - PAD.t - PAD.b));
  const path = (ps: Point[]): string =>
    ps.map((p, i) => `${i ? "L" : "M"}${px(p.day).toFixed(1)},${py(p.kg).toFixed(1)}`).join("");

  return (
    <div className="dt-trend">
      <div className="dt-tags" role="group"
           aria-label={lang === "bn" ? "কত দিন পেছনে" : "How far back"}>
        {[30, 90, 365].map((n) => (
          <ChipButton key={n} pressed={span === n} onClick={() => setSpan(n)}>
            <T en={`${n} days`} bn={`${digits(n, "bn")} দিন`} />
          </ChipButton>
        ))}
      </div>

      <figure className="dt-chart">
        <svg viewBox={`0 0 ${W} ${H}`} role="img"
             aria-describedby="dt-chart-table"
             aria-label={lang === "bn" ? "ওজনের ধারা" : "The weight trend"}>
          {/* The axis, labelled, because it does not start at
              zero and a clipped axis with no label exaggerates
              every wobble. */}
          <text className="dt-ax" x={4} y={py(y1) + 4}>{y1.toFixed(1)}</text>
          <text className="dt-ax" x={4} y={py(y0) + 4}>{y0.toFixed(1)}</text>
          <line className="dt-ax-line" x1={PAD.l} y1={py(y1)} x2={W - PAD.r} y2={py(y1)} />
          <line className="dt-ax-line" x1={PAD.l} y1={py(y0)} x2={W - PAD.r} y2={py(y0)} />

          {/* Days inside a settling window, drawn and not fitted.
              A hatch rather than a colour, because nothing here
              is encoded in colour alone. */}
          {spans.filter((s) => !s.readable).map((s) => (
            <rect key={`${s.protocol}-${s.from}`} className="dt-settling"
                  x={px(s.from)} y={PAD.t}
                  width={Math.max(px(s.to) - px(s.from), 1)} height={H - PAD.t - PAD.b} />
          ))}

          <path className="dt-scale-line" d={path(points)} />
          <path className="dt-trend-line" d={path(line)} />
          {/* A marked day is a ring and an ordinary one a dot: a
              shape rather than a colour, and it is still drawn.
              Left out of the slope is not hidden from the
              reader. */}
          {points.map((p) => (
            <circle key={p.day} className="dt-dot"
                    data-marked={markedDays.has(p.day) ? "" : undefined}
                    cx={px(p.day)} cy={py(p.kg)} r={markedDays.has(p.day) ? 3.2 : 1.8} />
          ))}
        </svg>
        <figcaption className="dt-why">
          <T
            en="The heavy line is the trend. The thin one behind it is what the scale actually said, drawn because hiding it would make this look like flattery. A ring instead of a dot is a day you marked: it is drawn and it is left out of the rate. The vertical axis does not start at zero."
            bn="মোটা রেখাটি ধারা। পেছনের সরু রেখাটি দাঁড়িপাল্লা আসলে যা বলেছে, দেখানো হয়েছে কারণ লুকালে এটাকে তোষামোদ মনে হতো। বিন্দুর বদলে বৃত্ত মানে আপনার চিহ্ন দেওয়া দিন: সেটা আঁকা হয়, কিন্তু হারের হিসাবে ধরা হয় না। উল্লম্ব অক্ষ শূন্য থেকে শুরু হয় না।"
          />
        </figcaption>
      </figure>

      {/* THE TABLE. A trend line that exists only as a path is a
          page a screen reader cannot read at all. */}
      <details className="dt-table-wrap">
        <summary><T en="The same thing as a table" bn="একই জিনিস, তালিকায়" /></summary>
        <table id="dt-chart-table" className="dt-table">
          <caption><T en="Every weighing in this range" bn="এই সময়ের সব ওজন" /></caption>
          <thead>
            <tr>
              <th scope="col"><T en="Date" bn="তারিখ" /></th>
              <th scope="col"><T en="Scale" bn="দাঁড়িপাল্লা" /></th>
              <th scope="col"><T en="Trend" bn="ধারা" /></th>
              {/* The chart's ring, in words. A reader who cannot
                  see the shape still has to be told which days
                  the rate was not fitted to. */}
              <th scope="col"><T en="Marked" bn="চিহ্ন" /></th>
            </tr>
          </thead>
          <tbody>
            {inSpan.filter((d) => d.weightKg != null).map((d, i) => (
              <tr key={d.date}>
                <td>{d.date}</td>
                <td className="mono">{digits((d.weightKg as number).toFixed(1), lang)}</td>
                <td className="mono">{digits((line[i]?.kg ?? 0).toFixed(1), lang)}</td>
                <td>
                  {(d.marks ?? []).map((id) => markNamed(id))
                    .filter((m) => !!m)
                    .map((m, n) => (
                      <span key={m.id}>{n ? ", " : ""}<T en={m.en} bn={m.bn} /></span>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <SeasonNote date={today} place={where} />

      {place ? (
        <section className="dt-cycle" aria-labelledby="dt-cycle-h">
          <h2 id="dt-cycle-h"><T en="Where you are in the month" bn="মাসের কোথায় আছেন" /></h2>
          <p className="dt-intro">
            <T
              en={`Day ${place.day + 1} of a ${place.length} day cycle`
                + `${profile?.cycle_days ? "" : ", assuming 28 because you have not said"}`
                + `. ${place.phase === "luteal"
                  ? "That is the second half, where water goes on: half a kilo to two, appetite up, and a scale that looks flat until it drops. Nothing here reads a flat trend as a stall while you are in it."
                  : "That is the first half, where the scale reads most honestly."}`}
              bn={`${place.length} দিনের চক্রের ${digits(place.day + 1, "bn")} নম্বর দিন`
                + `${profile?.cycle_days ? "" : ", আপনি বলেননি বলে ২৮ ধরে নেওয়া হয়েছে"}`
                + `। ${place.phase === "luteal"
                  ? "এটা দ্বিতীয় ভাগ, যখন শরীরে পানি জমে: আধা থেকে দুই কেজি, ক্ষুধা বাড়ে, আর দাঁড়িপাল্লা স্থির মনে হয় যতক্ষণ না হঠাৎ নামে। এই সময়ে স্থির ধারাকে এখানে কিছুই আটকে যাওয়া বলে ধরে না।"
                  : "এটা প্রথম ভাগ, যখন দাঁড়িপাল্লার মাপ সবচেয়ে সৎ।"}`}
            />
          </p>
          {perCycle ? (
            <div className="dt-figure dt-figure-lead">
              <h3><T en="Cycle to cycle" bn="চক্র থেকে চক্র" /></h3>
              <p className="dt-value">
                <T en={`${perCycle.kgPerCycle >= 0 ? "+" : ""}${perCycle.kgPerCycle.toFixed(2)} kg`}
                   bn={`${perCycle.kgPerCycle >= 0 ? "+" : ""}${digits(perCycle.kgPerCycle.toFixed(2), "bn")} কেজি`} />
              </p>
              <p className="dt-said">
                <T en={`a cycle, over ${perCycle.cycles} of them`}
                   bn={`প্রতি চক্রে, ${digits(perCycle.cycles, "bn")}টি চক্রের হিসাবে`} />
              </p>
              <p className="dt-why">
                <T
                  en="This is the comparison that actually removes the artefact: a week inside the second half is compared against a week that was also inside one, so the water sits on both sides of the subtraction and cancels. Week to week, it does not."
                  bn="এই তুলনাটাই আসলে ব্যাপারটা সরিয়ে দেয়: দ্বিতীয় ভাগের একটা সপ্তাহকে তুলনা করা হয় এমন আরেকটা সপ্তাহের সঙ্গে যেটাও দ্বিতীয় ভাগে ছিল, তাই পানি বিয়োগের দুই পাশেই থাকে আর কাটাকাটি হয়ে যায়। সপ্তাহে সপ্তাহে তুলনায় সেটা হয় না।"
                />
              </p>
            </div>
          ) : (
            <p className="dt-hint">
              <T
                en="Two full cycles of weighings give a cycle to cycle rate, which is the comparison that removes the water rather than averaging over it."
                bn="দুটি পূর্ণ চক্রের ওজন হলে চক্র থেকে চক্রের হার পাওয়া যায়, আর এই তুলনাটাই পানির প্রভাব গড় করে নয়, সরিয়ে দেয়।"
              />
            </p>
          )}
        </section>
      ) : null}

      {stalled ? <Stalled it={stalled} /> : null}

      <div className="dt-readout">
        <h2 className="dt-readout-h"><T en="What the weighings say" bn="ওজনগুলো যা বলছে" /></h2>
        <div className="dt-figure dt-figure-lead">
          <h3><T en="The rate" bn="হার" /></h3>
          <p className="dt-value">
            {rate
              ? <T en={`${rate.mid >= 0 ? "+" : ""}${rate.mid.toFixed(2)} kg a week`}
                   bn={`সপ্তাহে ${digits(rate.mid.toFixed(2), "bn")} কেজি`} />
              : <T en="Not readable yet" bn="এখনো পড়া যাচ্ছে না" />}
          </p>
          <p className="dt-why">
            {rate
              ? <T
                  en={`Between ${rate.low.toFixed(2)} and ${rate.high.toFixed(2)}. Fitted to the weighings rather than to the smoothed line, because an average lags and would understate a real loss.`}
                  bn={`${digits(rate.low.toFixed(2), "bn")} আর ${digits(rate.high.toFixed(2), "bn")} এর মধ্যে। মসৃণ রেখা নয়, আসল মাপগুলোর উপর বসানো, কারণ গড় পিছিয়ে থাকে আর আসল কমাটাকে কম দেখাত।`}
                />
              : <T
                  en="A week of weighings gives a rate, and a stretch shorter than that carries none: the noise is larger than the signal."
                  bn="এক সপ্তাহের মাপে একটা হার আসে, তার কম সময়ে কিছুই আসে না: ওঠানামা সংকেতের চেয়ে বড়।"
                />}
          </p>
        </div>

        <div className="dt-figure">
          <h3><T en="What you burn" bn="আপনার খরচ" /></h3>
          <p className="dt-value">
            {learned
              ? <T en={`${Math.round(learned.kcal.mid / 10) * 10}`}
                   bn={digits(Math.round(learned.kcal.mid / 10) * 10, "bn")} />
              : <T en="Day 14" bn="১৪তম দিন" />}
          </p>
          <p className="dt-why">
            {learned
              ? <T
                  en={`Between ${Math.round(learned.kcal.low)} and ${Math.round(learned.kcal.high)}, from ${learned.logged} logged days out of ${learned.days}. The fewer of those days carry a log, the wider that gets. Your log averages ${Math.round(learned.meanIntake)}: the gap between the two is the under-logging estimate, and it is normal.`}
                  bn={`${digits(Math.round(learned.kcal.low), "bn")} আর ${digits(Math.round(learned.kcal.high), "bn")} এর মধ্যে, ${digits(learned.days, "bn")} দিনের মধ্যে ${digits(learned.logged, "bn")} দিন লেখা থেকে। যত কম দিন লেখা থাকে, ফাঁকটা তত চওড়া হয়। আপনার খাতার গড় ${digits(Math.round(learned.meanIntake), "bn")}: দুটোর ফাঁকই কম লেখার হিসাব, আর এটা স্বাভাবিক।`}
                />
              : <T
                  en="After fourteen days the tool stops believing an activity multiplier and measures instead."
                  bn="চৌদ্দ দিন পর যন্ত্রটি চলাফেরার আন্দাজে বিশ্বাস করা বন্ধ করে নিজে মাপে।"
                />}
          </p>
          {/* WHICH STRETCH IT WAS MEASURED OVER. A maintenance
              figure fitted across a change of protocol is fitted
              across a step in body water, so this one never is,
              and the reader is told which run of days it came
              from rather than being left to assume all of them. */}
          {learned?.protocol ? (
            <p className="dt-why">
              <T
                en={`Measured inside one stretch of your log: ${protocolName(learned.protocol).en}. A maintenance figure never spans a change of protocol.`}
                bn={`আপনার খাতার একটি সময়ের ভেতরে মাপা: ${protocolName(learned.protocol).bn}। নিয়ম বদলের উপর দিয়ে খরচের হিসাব কখনো টানা হয় না।`}
              />
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

    /** THREE FLAT WEEKS, AND WHICH OF THE FOUR IT IS. Almost everything
        here is a reason not to worry, and that is the point: a reader who
        believes they have stalled and has not is the commonest reason
        people stop. One of the four is not a stall at all, one is the
        target having moved, one is a measurement problem said WITHOUT
        accusing anybody, and the last is that some flat months have no
        fix.

        A tool that always has an answer is making some of them up, so what
        is likeliest is offered as likeliest, everything else consistent is
        listed beside it, and water is always listed because it cannot be
        ruled out. */
function Stalled({ it }: { it: Stall }) {
  const WORDS: Record<StallKind, { en: string; bn: string; then: string; thenBn: string }> = {
    recomposition: {
      en: "This is not a stall",
      bn: "এটা আটকে যাওয়া নয়",
      then: "Your waist has come down while the scale has not, which is the one thing here the tool can settle on its own. Weight that stays the same while a waist falls is weight made of something different. Keep going and keep measuring the waist.",
      thenBn: "দাঁড়িপাল্লা না নামলেও আপনার কোমর কমেছে, আর এই একটা জিনিসই যন্ত্র নিজে থেকে মীমাংসা করতে পারে। কোমর কমলে ওজন এক থাকা মানে ওজনটা অন্য কিছু দিয়ে তৈরি হচ্ছে। চালিয়ে যান, আর কোমর মাপতে থাকুন।",
    },
    "target-drifted": {
      en: "The target has drifted",
      bn: "লক্ষ্যটা সরে গেছে",
      then: "What you burn has fallen since this window began, which happens to everybody as they get lighter and is not a failure of yours. The target on the goal page is worked out from the trend, so it has already moved with it: the thing to check is whether you are eating to the new one.",
      thenBn: "এই সময়টা শুরুর পর থেকে আপনার খরচ কমেছে, যেটা ওজন কমলে সবারই হয়, আর এতে আপনার কোনো ব্যর্থতা নেই। লক্ষ্যের পাতার হিসাব ধারা থেকেই আসে, তাই সেটা এমনিতেই সরে গেছে: দেখার বিষয় হলো আপনি নতুন লক্ষ্য অনুযায়ী খাচ্ছেন কি না।",
    },
    "log-drifted": {
      en: "The log and the scale disagree",
      bn: "খাতা আর দাঁড়িপাল্লা মিলছে না",
      then: "The intake you have written down has not changed and neither has the trend, which is the commonest of the four and is almost always portions rather than dishonesty. Oil, rice and anything eaten standing up are where it hides. A kitchen scale for one week settles it, and it is a measurement rather than a test.",
      thenBn: "আপনি যা লিখেছেন তা বদলায়নি, ধারাও বদলায়নি, আর চারটির মধ্যে এটাই সবচেয়ে সাধারণ, আর এটা প্রায় সবসময় পরিমাণের ব্যাপার, অসততার নয়। তেল, ভাত আর দাঁড়িয়ে খাওয়া জিনিস, এখানেই লুকিয়ে থাকে। এক সপ্তাহ রান্নাঘরের নিক্তি ব্যবহার করলেই মীমাংসা হয়, আর এটা পরীক্ষা নয়, একটা মাপ।",
    },
    water: {
      en: "It may be water, and there is no way to tell yet",
      bn: "এটা পানিও হতে পারে, আর এখনো বোঝার উপায় নেই",
      then: "Fat cells that have given up their contents hold water for a while and then release it, which looks like nothing for ten days and then a kilo overnight. A reader nine days into that looks exactly like a reader who has stopped losing. This is the one that cannot be ruled out and the one worth waiting a week for.",
      thenBn: "যে চর্বিকোষ তার ভেতরের জিনিস ছেড়ে দিয়েছে সেটা কিছুদিন পানি ধরে রাখে, তারপর ছাড়ে, যেটা দেখতে দশ দিন কিছুই না, তারপর এক রাতে এক কেজি। এমন নয় দিনের মাথায় থাকা একজনকে দেখতে ঠিক থেমে যাওয়া একজনের মতোই লাগে। এটাই বাদ দেওয়া যায় না, আর এটার জন্যই এক সপ্তাহ অপেক্ষা করা উচিত।",
    },
    "moved-less": {
      en: "You are walking less than you were",
      bn: "আগের চেয়ে কম হাঁটছেন",
      then: "The moving you do not plan is the largest variable in what anybody burns, it is hundreds of calories a day, and it falls quietly during a deficit. Your log has not changed and your trend has flattened, and the thing that moved is how much you walked. That is not a stall and it is the easiest of these to answer.",
      thenBn: "না ভেবে যে নড়াচড়া করেন সেটাই খরচের সবচেয়ে বড় ওঠানামা, দিনে কয়েকশো ক্যালোরির মতো, আর ঘাটতির সময় সেটা চুপচাপ কমে যায়। আপনার খাতা বদলায়নি, ধারা সমান হয়ে গেছে, আর যেটা বদলেছে সেটা আপনার হাঁটা। এটা আটকে যাওয়া নয়, আর এগুলোর মধ্যে এটার উত্তরই সবচেয়ে সহজ।",
    },
    "hard-part": {
      en: "This is a hard part, and it may have no fix",
      bn: "এটা কঠিন একটা সময়, আর এর হয়তো কোনো সমাধান নেই",
      then: "A body defends a weight it has held for a long time, and after a large loss the defence is real: appetite up, spontaneous movement down, maintenance below what any equation predicts. Not every flat month is a mistake to be corrected. A week or two at maintenance is a reasonable move here, and this tool has nothing cleverer to offer.",
      thenBn: "শরীর অনেক দিন ধরে রাখা ওজন আঁকড়ে ধরে, আর বড় রকম ওজন কমার পর সেই আঁকড়ে ধরাটা সত্যি: ক্ষুধা বাড়ে, না ভেবে করা নড়াচড়া কমে, খরচ যেকোনো সূত্রের হিসাবের নিচে নামে। প্রতিটা স্থির মাস কোনো ভুল নয় যেটা শোধরাতে হবে। এখানে এক দুই সপ্তাহ খরচের সমান খাওয়া যুক্তিসঙ্গত, আর এই যন্ত্রের এর চেয়ে চালাক কিছু বলার নেই।",
    },
  };

  const main = WORDS[it.kind];

  return (
    <section className="dt-stall" aria-labelledby="dt-stall-h">
      <h2 id="dt-stall-h">
        <T
          en={`Three weeks without a change on the scale`}
          bn={`তিন সপ্তাহ ধরে দাঁড়িপাল্লা নড়েনি`}
        />
      </h2>
      <p className="dt-intro">
        <T
          en={`Over ${it.days} days the trend has moved between ${it.rate.low.toFixed(2)} and ${it.rate.high.toFixed(2)} kg a week, which includes zero, and you logged what you ate on ${Math.round(it.coverage * it.days)} of them. One flat week is a Tuesday; three is worth a look.`}
          bn={`${digits(it.days, "bn")} দিনে ধারা সপ্তাহে ${digits(it.rate.low.toFixed(2), "bn")} থেকে ${digits(it.rate.high.toFixed(2), "bn")} কেজির মধ্যে নড়েছে, যার মধ্যে শূন্যও পড়ে, আর তার ${digits(Math.round(it.coverage * it.days), "bn")} দিনে আপনি খাওয়ার হিসাব লিখেছেন। এক সপ্তাহ স্থির থাকা কিছুই না; তিন সপ্তাহ দেখার মতো।`}
        />
      </p>

      <div className="dt-figure dt-figure-lead">
        <h3><T en={main.en} bn={main.bn} /></h3>
        <p className="dt-said"><T en={main.then} bn={main.thenBn} /></p>
        {it.kind === "recomposition" && it.waistCmChange != null ? (
          <p className="dt-why">
            <T en={`Your waist is ${Math.abs(it.waistCmChange).toFixed(1)} cm down over the same three weeks.`}
               bn={`একই তিন সপ্তাহে আপনার কোমর ${digits(Math.abs(it.waistCmChange).toFixed(1), "bn")} সেমি কমেছে।`} />
          </p>
        ) : null}
        {it.kind === "moved-less" && it.stepsThen != null && it.stepsNow != null ? (
          <p className="dt-why">
            <T
              en={`Your middle day has gone from about ${Math.round(it.stepsThen)} steps to about ${Math.round(it.stepsNow)} over the same three weeks.`}
              bn={`একই তিন সপ্তাহে আপনার মাঝারি দিন প্রায় ${digits(Math.round(it.stepsThen), "bn")} কদম থেকে প্রায় ${digits(Math.round(it.stepsNow), "bn")} কদমে নেমেছে।`}
            />
          </p>
        ) : null}
        {it.kind === "target-drifted" && it.burnKcalChange != null ? (
          <p className="dt-why">
            <T en={`Your measured burn is about ${Math.abs(Math.round(it.burnKcalChange))} kcal lower than it was three weeks ago.`}
               bn={`তিন সপ্তাহ আগের চেয়ে আপনার মাপা খরচ প্রায় ${digits(Math.abs(Math.round(it.burnKcalChange)), "bn")} ক্যালোরি কম।`} />
          </p>
        ) : null}
      </div>

      <p className="dt-intro">
        <T
          en="Everything else that fits, because only some of this information is the tool's:"
          bn="আর যা যা মেলে, কারণ এর সব তথ্য যন্ত্রের নয়:"
        />
      </p>
      <dl className="dt-defs">
        {it.also.map((k) => (
          <div key={k}>
            <dt><T en={WORDS[k].en} bn={WORDS[k].bn} /></dt>
            <dd><T en={WORDS[k].then} bn={WORDS[k].thenBn} /></dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
