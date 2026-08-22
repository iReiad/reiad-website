"use client";

/* ============================================================
   diet/nutrition-panel.tsx: beyond calories, and how honest it
   can be.

   `DIET.md` sections 15 and 16.

   ---- the honesty problem is the whole design ----

   Micronutrients cannot be estimated from a number of calories.
   They come from knowing what was actually eaten, and this tool
   has a curated portion library rather than a food database. So
   EVERY FIGURE IS SHOWN WITH ITS COVERAGE, and under about half
   the panel says the day is too sparse to read rather than
   drawing a bar.

   A confident number that is missing a third of the day is more
   dangerous than no number.

   ---- and no scores ----

   No RDA out of 100, no letter grades, no green ticks for
   "complete". Those imply a precision the data does not have and
   turn eating into a test. A figure, a range to aim for, and the
   coverage.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import {
  COVERAGE_FLOOR, byWeekday, topSources, totalFor,
  type Day, type Entry,
} from "@reiad/shared/diet";
import {
  who, getDays, getEntries, isoDate, shiftDate, type Who,
} from "../../lib/diet-api";
import { T, digits, useToolLang } from "./lang";

/** What is worth tracking, and the range to aim for. Each one is
    here because it actually goes wrong for this tool's two
    readerships, on the diets it supports. A list of forty
    nutrients is a list nobody reads. */
const WATCHED: Array<{
  key: string; unit: string; low: number; high: number;
  en: string; bn: string; whyEn: string; whyBn: string;
}> = [
  { key: "fibre", unit: "g", low: 25, high: 30, en: "Fibre", bn: "আঁশ",
    whyEn: "Low on almost every deficit and very low on keto, and it is the single thing most likely to make somebody feel unwell without knowing why.",
    whyBn: "প্রায় প্রতিটি ঘাটতিতেই কম, আর কিটোতে খুবই কম, আর কারণ না বুঝেই খারাপ লাগার পেছনে সবচেয়ে বড় কারণ এটাই।" },
  { key: "sodium", unit: "mg", low: 1500, high: 2300, en: "Sodium", bn: "সোডিয়াম",
    whyEn: "The one a very low carb diet strips fastest, and the one a Bangladeshi diet is most likely to be high in already.",
    whyBn: "খুব কম শর্করার খাবারে এটাই সবচেয়ে দ্রুত কমে, আবার বাংলাদেশি খাবারে এটাই বেশি থাকার সম্ভাবনা সবচেয়ে বেশি।" },
  { key: "iron", unit: "mg", low: 8, high: 18, en: "Iron", bn: "আয়রন",
    whyEn: "Anaemia is common among women in Bangladesh, and a deficit with less red meat makes it worse. Vitamin C alongside roughly doubles absorption from plants; tea with a meal works the other way.",
    whyBn: "বাংলাদেশে নারীদের মধ্যে রক্তস্বল্পতা সাধারণ, আর কম লাল মাংসসহ ঘাটতি সেটা বাড়ায়। সঙ্গে ভিটামিন সি থাকলে উদ্ভিদ থেকে শোষণ প্রায় দ্বিগুণ হয়; খাবারের সঙ্গে চা উল্টোটা করে।" },
  { key: "calcium", unit: "mg", low: 700, high: 1000, en: "Calcium", bn: "ক্যালসিয়াম",
    whyEn: "Worth watching on any restricted diet, and it travels with vitamin D.",
    whyBn: "যেকোনো সীমিত খাবারে খেয়াল রাখার মতো, আর এটা ভিটামিন ডির সঙ্গে চলে।" },
  { key: "potassium", unit: "mg", low: 3000, high: 4000, en: "Potassium", bn: "পটাশিয়াম",
    whyEn: "One of the keto three, and one of the first to go when carbohydrate does.",
    whyBn: "কিটোর তিনটির একটি, আর শর্করা কমলে সবার আগে যেগুলো কমে তার একটি।" },
];

export function NutritionPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
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
    const from = shiftDate(today, -30);
    void Promise.all([getDays(w, from), getEntries(w, from)])
      .then(([d, e]) => { if (alive) { setDays(d); setEntries(e); } });
    return () => { alive = false; };
  }, [w, today]);

  const todays = useMemo(() => totalFor(entries.filter((e) => e.date === today)), [entries, today]);
  const top = useMemo(() => topSources(entries), [entries]);
  const week = useMemo(() => byWeekday(days), [days]);

  const DAY_NAMES = lang === "bn"
    ? ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;
  if (!w) {
    return <p className="dt-invite"><T
      en="These readings come out of your own log, which lives on your account."
      bn="এই হিসাবগুলো আপনার নিজের খাতা থেকে আসে, যেটা আপনার অ্যাকাউন্টে থাকে।"
    /></p>;
  }

  const sparse = todays.coverage < COVERAGE_FLOOR;

  return (
    <div className="dt-nutrition">
      <section aria-labelledby="dt-nut-h">
        <h2 id="dt-nut-h"><T en="Today, and how much of it is known" bn="আজ, আর তার কতটুকু জানা" /></h2>
        {/* COVERAGE FIRST, and under half nothing is drawn at
            all. This is the most important sentence on the page. */}
        <p className="dt-coverage">
          <T
            en={todays.count === 0
              ? "Nothing logged today."
              : `Computed from ${Math.round(todays.coverage * 100)}% of today's food.`}
            bn={todays.count === 0
              ? "আজ কিছু লেখা হয়নি।"
              : `আজকের খাবারের ${digits(Math.round(todays.coverage * 100), "bn")}% থেকে হিসাব করা।`}
          />
        </p>
        {sparse ? (
          <p className="dt-hint">
            <T
              en="Too sparse to read. A confident number that is missing a third of the day is more dangerous than no number, so nothing is drawn until more of the day has composition attached. Free entry is what leaves the gap: an item from the search carries its numbers."
              bn="পড়ার মতো যথেষ্ট নয়। দিনের এক তৃতীয়াংশ বাদ দিয়ে দেওয়া আত্মবিশ্বাসী সংখ্যা কোনো সংখ্যা না থাকার চেয়ে বিপজ্জনক, তাই দিনের বেশি অংশে গঠন যুক্ত না হওয়া পর্যন্ত কিছুই আঁকা হয় না। নিজে লিখলে ফাঁকটা থেকে যায়: খুঁজে নেওয়া জিনিসের সঙ্গে সংখ্যা আসে।"
            />
          </p>
        ) : (
          <ul className="dt-nutrients">
            {WATCHED.map((n) => {
              const got = todays.micros[n.key];
              return (
                <li key={n.key} className="dt-figure">
                  <h3><T en={n.en} bn={n.bn} /></h3>
                  <p className="dt-value">
                    {got != null
                      ? <T en={`about ${Math.round(got)} ${n.unit}`}
                           bn={`প্রায় ${digits(Math.round(got), "bn")} ${n.unit}`} />
                      : <T en="not known" bn="জানা নেই" />}
                  </p>
                  <p className="dt-said">
                    <T en={`aim for ${n.low} to ${n.high} ${n.unit}`}
                       bn={`লক্ষ্য ${digits(n.low, "bn")} থেকে ${digits(n.high, "bn")} ${n.unit}`} />
                  </p>
                  <p className="dt-why"><T en={n.whyEn} bn={n.whyBn} /></p>
                </li>
              );
            })}
          </ul>
        )}
        <p className="dt-why">
          <T
            en="No score out of a hundred, no letter grade and no green tick for complete. Those imply a precision this data does not have, and they turn eating into a test."
            bn="একশোতে কোনো নম্বর নেই, কোনো গ্রেড নেই, সম্পূর্ণ হওয়ার সবুজ টিকও নেই। ওগুলো এমন নিখুঁততা দাবি করে যা এই তথ্যে নেই, আর খাওয়াকে পরীক্ষা বানিয়ে ফেলে।"
          />
        </p>
      </section>

      <section aria-labelledby="dt-top-h">
        <h2 id="dt-top-h"><T en="Where the calories actually are" bn="ক্যালোরি আসলে কোথায়" /></h2>
        {top.length ? (
          <ul className="dt-tag-counts">
            {top.map((t) => (
              <li key={t.label}>
                <span>{t.label}</span>
                <span className="mono">
                  {digits(Math.round(t.kcal), lang)}
                  {" "}({digits(Math.round(t.share * 100), lang)}%)
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dt-hint">
            <T en="A month of logging makes this the most useful thing here, and it is almost always three items."
               bn="এক মাস লিখলে এটাই এখানকার সবচেয়ে কাজের জিনিস হয়ে ওঠে, আর প্রায় সবসময়ই তিনটে জিনিস।" />
          </p>
        )}
      </section>

      <section aria-labelledby="dt-week-h">
        <h2 id="dt-week-h"><T en="Which days go over" bn="কোন দিনগুলো বেশি যায়" /></h2>
        <ul className="dt-weekdays">
          {week.map((d) => (
            <li key={d.day}>
              <span>{DAY_NAMES[d.day]}</span>
              <span className="mono">{d.n ? digits(Math.round(d.mean), lang) : "-"}</span>
            </li>
          ))}
        </ul>
        <p className="dt-why">
          <T
            en="A day that is consistently above the rest is a fact worth seeing rather than a failure worth hiding, and it is usually a routine rather than a lapse."
            bn="যে দিনটা বরাবরই বাকিদের চেয়ে উপরে, সেটা লুকানোর মতো ব্যর্থতা নয়, দেখার মতো একটা তথ্য, আর সেটা সাধারণত অনিয়ম নয়, একটা রুটিন।"
          />
        </p>
      </section>
    </div>
  );
}
