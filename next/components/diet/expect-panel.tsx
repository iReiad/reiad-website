"use client";

/* ============================================================
   diet/expect-panel.tsx: what to expect, and when.

   `DIET.md` sections 10 and 11. A tracker tells you what
   happened; nobody tells you what is ABOUT to happen, and almost
   everybody who quits does so at a point that was predictable a
   fortnight earlier.

   ---- said before the week, not explained after it ----

   The expectation is stated in advance and the reader's own
   number goes beside it afterwards, with NO VERDICT attached.
   That is what turns a disappointing number into information: a
   reader who sees "expected 0.2 to 0.6, saw 0.3" in week two
   does not quit in week two.

   ---- and stacking is the part nothing else handles ----

   `forecastChange()` takes the PREVIOUS protocol and its days,
   because two water-losing protocols do not take the same water
   off twice. Three days of keto then a two day fast moves the
   scale about 3.6kg and under a quarter of it is fat.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import {
  UNLOCKS, forecastChange, settlingDays, slopePerWeek, trend,
  type Day, type Point, type Protocol,
} from "@reiad/shared/diet";
import { who, getDays, dayNumber, isoDate, shiftDate, type Who } from "../../lib/diet-api";
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

const PROTOCOLS: Array<{ id: Protocol; en: string; bn: string }> = [
  { id: "keto", en: "Keto", bn: "কিটো" },
  { id: "fast", en: "A complete fast", bn: "পূর্ণ উপবাস" },
  { id: "standard", en: "An ordinary deficit", bn: "সাধারণ ঘাটতি" },
];

export function ExpectPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [what, setWhat] = useState<Protocol>("fast");
  const [howLong, setHowLong] = useState(2);
  const today = isoDate();

  useEffect(() => {
    let alive = true;
    void who().then((f) => { if (alive) setW(f); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!w) return;
    let alive = true;
    void getDays(w, shiftDate(today, -120)).then((d) => { if (alive) setDays(d); });
    return () => { alive = false; };
  }, [w, today]);

  const points: Point[] = useMemo(
    () => days.filter((d) => d.weightKg != null)
      .map((d) => ({ day: dayNumber(d.date), kg: d.weightKg as number })),
    [days],
  );
  const latest = [...points].sort((a, b) => b.day - a.day)[0];
  const rate = useMemo(() => slopePerWeek(points), [points]);
  const line = useMemo(() => trend(points), [points]);

  /* Eighty kilos and 2500 are the figures used when there is
     nothing logged yet, so the table below is readable to
     somebody deciding whether to start. Both are labelled as
     stand-ins on screen rather than passed off as the reader's. */
  const kg = latest?.kg ?? 80;
  const burn = 2500;
  const cast = useMemo(() => forecastChange({
    from: null, to: what, days: howLong, weightKg: kg, burn,
    intake: what === "fast" ? 0 : burn - 500,
  }), [what, howLong, kg]);

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
        <p className="dt-hint">
          <T
            en="Four facts and no advice. It does not say whether this is a good idea: it says what the scale will do and which part of it is real, which is the only thing this can honestly know and the thing nobody is told."
            bn="চারটে তথ্য, কোনো পরামর্শ নয়। এটা ভালো না মন্দ তা বলা হচ্ছে না: বলা হচ্ছে দাঁড়িপাল্লা কী করবে আর তার কোন অংশটা আসল, যেটাই এই যন্ত্র সৎভাবে জানতে পারে আর যেটা কেউ বলে না।"
          />
        </p>

        <div className="dt-tags" role="group" aria-label="What you are about to do">
          {PROTOCOLS.map((p) => (
            <ChipButton key={p.id} pressed={what === p.id} onClick={() => setWhat(p.id)}>
              <T en={p.en} bn={p.bn} />
            </ChipButton>
          ))}
        </div>
        <div className="dt-tags" role="group" aria-label="For how long">
          {[2, 3, 7, 14].map((n) => (
            <ChipButton key={n} pressed={howLong === n} onClick={() => setHowLong(n)}>
              <T en={`${n} days`} bn={`${digits(n, "bn")} দিন`} />
            </ChipButton>
          ))}
        </div>

        <div className="dt-readout">
          <div className="dt-figure dt-figure-lead">
            <h3><T en="What the scale will do" bn="দাঁড়িপাল্লা যা করবে" /></h3>
            <p className="dt-value">
              <T en={`${cast.scale.high.toFixed(1)} to ${cast.scale.low.toFixed(1)} kg`}
                 bn={`${digits(cast.scale.high.toFixed(1), "bn")} থেকে ${digits(cast.scale.low.toFixed(1), "bn")} কেজি`} />
            </p>
            <p className="dt-said">
              <T en={`Of which about ${Math.round(cast.fatShare * 100)}% is fat.`}
                 bn={`যার প্রায় ${digits(Math.round(cast.fatShare * 100), "bn")}% চর্বি।`} />
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
            <p className="dt-value">
              <T en={`${settlingDays(what) || "no"} days after it ends`}
                 bn={`শেষ হওয়ার ${digits(settlingDays(what), "bn")} দিন পর`} />
            </p>
            <p className="dt-why">
              <T en="No slope is fitted across a change of protocol: that is a slope fitted across a step in body water, and it reports a rate nobody is running."
                 bn="নিয়ম বদলের উপর দিয়ে কোনো ঢাল বসানো হয় না: সেটা শরীরের পানির একটা ধাপের উপর দিয়ে ঢাল বসানো, আর তাতে এমন হার আসে যেটা কেউ চালাচ্ছে না।" />
            </p>
          </div>
        </div>
        {!latest ? (
          <p className="dt-why">
            <T en="Computed for an 80 kg body at 2,500 a day, because you have not logged a weight yet. Log one and this becomes yours."
               bn="৮০ কেজি শরীর আর দিনে ২,৫০০ ধরে হিসাব করা, কারণ আপনি এখনো ওজন লেখেননি। একটা লিখলেই এটা আপনার হয়ে যাবে।" />
          </p>
        ) : null}
      </section>

      <section aria-labelledby="dt-unlock-h">
        <h2 id="dt-unlock-h"><T en="What arrives, and when" bn="কী কখন আসবে" /></h2>
        <p className="dt-hint">
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
