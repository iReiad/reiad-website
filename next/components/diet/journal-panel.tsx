"use client";

/* ============================================================
   diet/journal-panel.tsx: what you are facing.

   `DIET.md` section 11. The journal is the only record of what
   this actually FELT like, and hunger is the only leading
   indicator in the whole tool: it climbs before the trend moves,
   before adherence breaks, and before the reader concludes they
   have no willpower.

   ---- a correlation is described, never explained ----

   The symptom table says what gets REPORTED and what it is
   usually ASSOCIATED with, and points at the tool's own note. It
   never says "caused by" and it never diagnoses. And the line
   where the tool stops is printed on the panel itself rather
   than in a footer.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import { TAGS, hungerTrend, type Day } from "@reiad/shared/diet";
import { who, getDays, isoDate, shiftDate, type Who } from "../../lib/diet-api";
import { Note } from "../ui/note";
import { T, TBlock, digits, useToolLang } from "./lang";
import { Term } from "./glossary";

const SYMPTOMS: Array<{ en: string; bn: string; withEn: string; withBn: string }> = [
  { en: "Headache, fatigue or cramp in the first fortnight of keto",
    bn: "কিটোর প্রথম দুই সপ্তাহে মাথাব্যথা, ক্লান্তি বা খিঁচুনি",
    withEn: "the sodium and water that leave with the glycogen. There is a note about it on the keto page.",
    withBn: "গ্লাইকোজেনের সঙ্গে যে সোডিয়াম আর পানি বেরিয়ে যায়। কিটোর পাতায় এ নিয়ে একটা নোট আছে।" },
  { en: "Constipation",
    bn: "কোষ্ঠকাঠিন্য",
    withEn: "low fibre and low water. Both are tracked, with how much of the day they were computed from.",
    withBn: "কম আঁশ আর কম পানি। দুটোই হিসাব রাখা হয়, দিনের কতটুকু থেকে হিসাব হয়েছে তা সহ।" },
  { en: "Dizzy on standing",
    bn: "উঠে দাঁড়ালে মাথা ঘোরা",
    withEn: "low sodium, or a large deficit. Intake against your resting burn is on the goal page.",
    withBn: "কম সোডিয়াম, বা বড় ঘাটতি। খাওয়ার সঙ্গে বিশ্রামের খরচের তুলনা লক্ষ্যের পাতায়।" },
  { en: "Always cold, poor sleep, flat mood in a long deficit",
    bn: "সবসময় শীত, ঘুম খারাপ, মন খারাপ, লম্বা ঘাটতিতে",
    withEn: "a long deficit. After eight to twelve weeks a break at maintenance is what makes the next block work.",
    withBn: "লম্বা ঘাটতি। আট থেকে বারো সপ্তাহ পর খরচের সমান খেয়ে একটা বিরতিই পরের ধাপটা কাজে লাগায়।" },
  { en: "The scale up two kilos overnight",
    bn: "রাতারাতি দুই কেজি বেড়ে যাওয়া",
    withEn: "sodium, carbohydrate, the cycle or travel, almost always. Nothing here reacts to one reading.",
    withBn: "প্রায় সবসময়ই লবণ, শর্করা, চক্র বা ভ্রমণ। এখানে কিছুই একটামাত্র মাপে সাড়া দেয় না।" },
];

export function JournalPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
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
    void getDays(w, shiftDate(today, -90)).then((d) => { if (alive) setDays(d); });
    return () => { alive = false; };
  }, [w, today]);

  const hunger = useMemo(() => hungerTrend(days), [days]);
  const counts = useMemo(() => {
    const by = new Map<string, number>();
    for (const d of days) for (const t of d.tags ?? []) by.set(t, (by.get(t) ?? 0) + 1);
    return by;
  }, [days]);
  const written = useMemo(
    () => days.filter((d) => d.note).slice(-30).reverse(), [days],
  );

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;
  if (!w) {
    return <p className="dt-invite"><T
      en="A journal belongs to an account, so it is there on your phone too."
      bn="খাতা অ্যাকাউন্টের সঙ্গে থাকে, তাই ফোনেও পাবেন।"
    /></p>;
  }

  return (
    <div className="dt-journal">
      <div className="dt-readout">
        <div className="dt-figure dt-figure-lead">
          <h3><T en="Hunger" bn="ক্ষুধা" /></h3>
          <p className="dt-value">
            {hunger.n
              ? <T en={hunger.mean.toFixed(1)} bn={digits(hunger.mean.toFixed(1), "bn")} />
              : <T en="Not yet" bn="এখনো নয়" />}
          </p>
          <p className="dt-why">
            <T
              en={hunger.rising
                ? "This has been climbing. It is the earliest signal there is that a target is too aggressive: it moves before the trend does and before adherence breaks. A gentler rate or a week at maintenance is worth considering."
                : hunger.n >= 10
                  ? "Steady. This is the one leading indicator here: everything else in the tool is a lagging measure, so a rise in this is worth more than a flat week on the scale."
                  : "Ten days of it start saying something. It is the earliest signal there is that a target is too aggressive."}
              bn={hunger.rising
                ? "এটা বেড়ে চলেছে। লক্ষ্য বেশি কঠিন হয়ে গেছে কি না, তার সবচেয়ে আগের ইঙ্গিত এটাই: ধারা নড়ার আগেই আর নিয়ম ভাঙার আগেই এটা নড়ে। একটু ধীর হার বা এক সপ্তাহ খরচের সমান খাওয়া ভেবে দেখার মতো।"
                : hunger.n >= 10
                  ? "স্থির। এখানে এটাই একমাত্র আগাম ইঙ্গিত: বাকি সব পিছিয়ে আসা মাপ, তাই এর বেড়ে যাওয়া দাঁড়িপাল্লার এক সপ্তাহ স্থির থাকার চেয়ে বেশি মূল্যবান।"
                  : "দশ দিন হলে এটা কিছু বলতে শুরু করে। লক্ষ্য বেশি কঠিন কি না, তার সবচেয়ে আগের ইঙ্গিত এটাই।"}
            />
          </p>
        </div>

        <div className="dt-figure">
          <h3><T en="What you logged" bn="যা লিখেছেন" /></h3>
          <ul className="dt-tag-counts">
            {TAGS.filter((t) => counts.get(t.id)).map((t) => (
              <li key={t.id}>
                <T en={t.en} bn={t.bn} />
                <span className="mono"> {digits(counts.get(t.id) ?? 0, lang)}</span>
              </li>
            ))}
            {counts.size === 0
              ? <li className="dt-why"><T
                  en="Tags on the today page, over the last ninety days."
                  bn="আজকের পাতায় দেওয়া চিহ্ন, গত নব্বই দিনের।"
                /></li>
              : null}
          </ul>
        </div>
      </div>

      <section className="dt-symptoms" aria-labelledby="dt-sym-h">
        <h2 id="dt-sym-h"><T en="What gets reported" bn="মানুষ যা বলে" /></h2>
        <TBlock
          en={<p className="dt-hint">Described, and pointed at the tool&apos;s own
            note. Never explained, never diagnosed: these are things people
            report, and what they are usually associated with.</p>}
          bn={<p className="dt-hint">বর্ণনা করা হচ্ছে, আর যন্ত্রের নিজের নোটের দিকে
            দেখানো হচ্ছে। ব্যাখ্যা নয়, রোগ নির্ণয় তো নয়ই: এগুলো মানুষ যা বলে,
            আর সাধারণত কীসের সঙ্গে মিলে যায়।</p>}
        />
        <dl className="dt-defs">
          {SYMPTOMS.map((s) => (
            <div key={s.en}>
              <dt><T en={s.en} bn={s.bn} /></dt>
              <dd><T en={`Usually associated with ${s.withEn}`}
                     bn={`সাধারণত যার সঙ্গে মেলে: ${s.withBn}`} /></dd>
            </div>
          ))}
        </dl>
        {/* FOUR WORDS THAT EXPLAIN MOST OF THAT LIST, and the
            glossary is where each is written out. A tool that
            uses them without defining them is written for people
            who already know. */}
        <p className="dt-why">
          <T
            en="Most of the first week of any of this is "
            bn="এসবের প্রথম সপ্তাহের বেশিরভাগটাই "
          />
          <Term id="glycogen" en="glycogen and its water" bn="গ্লাইকোজেন আর তার পানি" />
          <T
            en=" leaving, not fat. A very low carbohydrate week puts a body into "
            bn=" চলে যাওয়া, চর্বি নয়। খুব কম শর্করার এক সপ্তাহ শরীরকে নিয়ে যায় "
          />
          <Term id="ketosis" en="ketosis" bn="কিটোসিসে" />
          <T
            en=", which takes about a fortnight to settle. A long deficit lowers "
            bn=", আর সেটা থিতু হতে প্রায় দুই সপ্তাহ লাগে। লম্বা ঘাটতি কমিয়ে দেয় "
          />
          <Term id="neat" en="the moving you do not plan" bn="না ভেবে যে নড়াচড়া" />
          <T
            en=" long before it shows anywhere else, and part of a slowing burn is "
            bn=" , অন্য কোথাও দেখা দেওয়ার অনেক আগেই, আর খরচ কমার একটা অংশ হলো "
          />
          <Term id="adaptation" en="adaptive thermogenesis" bn="খাপ খাওয়ানো বিপাক" />
          <T en="." bn="।" />
        </p>
        <Note tone="warn" title={<T en="Where this stops" bn="এখানে যন্ত্র থামে" />}>
          <TBlock
            en={<p>Chest pain, fainting, palpitations, anything severe, anything
              that persists, anything frightening: see a doctor, and do not
              consult a calculator.</p>}
            bn={<p>বুকে ব্যথা, জ্ঞান হারানো, বুক ধড়ফড়, তীব্র কিছু, দীর্ঘস্থায়ী কিছু,
              ভয় পাওয়ার মতো কিছু: ডাক্তার দেখান, ক্যালকুলেটর নয়।</p>}
          />
        </Note>
      </section>

      {written.length ? (
        <section className="dt-diary" aria-label={lang === "bn" ? "আপনার লেখা" : "Your lines"}>
          <h2><T en="Your lines" bn="আপনার লেখা" /></h2>
          <ul className="dt-diary-list">
            {written.map((d) => (
              <li key={d.date}>
                <span className="mono dt-src">{d.date}</span>
                <span>{d.note}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
