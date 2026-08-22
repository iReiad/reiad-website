"use client";

/* ============================================================
   diet/trend-panel.tsx: the long view.

   `DIET.md` sections 4, 10 and 28.

   ---- the chart is an SVG, drawn from the rows ----

   No library and no canvas. The data is small, the shape is a
   path, and a chart that needs a megabyte of JavaScript is a
   chart that is blank in the second everybody judges a page in.

   Four rules it obeys, and each is a way charts lie:

   1. A TABLE UNDERNEATH, in a `<details>`, named by
      `aria-describedby`. That is the whole of chart
      accessibility and it takes ten lines. A trend line that
      exists only as a path is a page a screen reader cannot read
      at all.
   2. NOTHING IS ENCODED IN COLOUR ALONE. The scale is thin and
      faint, the trend is heavy, a settling window is a hatch,
      and a marked day is a ring rather than a dot, with a column
      of its own in the table.
   3. THE Y AXIS DOES NOT START AT ZERO AND SAYS SO. A weight
      chart starting at zero is unreadable; one with a clipped
      axis and no label exaggerates every wobble.
   4. The scale readings are drawn behind the trend, because
      hiding them would make the tool look like it was flattering
      the reader.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import {
  learnedHere, markNamed, protocolName, slopePerWeek, stretches, trend, weighings,
  type Day, type Phase, type Point,
} from "@reiad/shared/diet";
import {
  who, getDays, getPhases, dayNumber, isoDate, shiftDate, type Who,
} from "../../lib/diet-api";
import { ChipButton } from "../ui/chip";
import { T, digits, useToolLang } from "./lang";

const W = 720;
const H = 260;
const PAD = { l: 42, r: 12, t: 12, b: 26 };

export function TrendPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
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
    void Promise.all([getDays(w, shiftDate(today, -365)), getPhases(w)])
      .then(([d, p]) => { if (alive) { setDays(d); setPhases(p); } });
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

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;
  if (!w) {
    return <p className="dt-invite"><T
      en="A trend needs a run of weighings, and those live on your account."
      bn="ধারা দেখতে কয়েক দিনের ওজন লাগে, আর সেগুলো আপনার অ্যাকাউন্টে থাকে।"
    /></p>;
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

      <div className="dt-readout">
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
