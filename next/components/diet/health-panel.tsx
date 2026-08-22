"use client";

/* ============================================================
   diet/health-panel.tsx: the numbers a clinic gives you, and the
   medicines that change what a chart means.

   `DIET.md` sections 21 and 22.

   ---- units are stored, never assumed ----

   Glucose is reported in mmol/L in the UK and commonly in mg/dL
   on a Bangladeshi lab report, and the two differ by a factor of
   eighteen. This is the one place in the tool where an assumed
   unit would be wrong exactly once, catastrophically.

   ---- and the tool prints a range and nothing else ----

   No interpretation, no colour on an out of range value, no
   "your risk is". A reference range is a property of an ASSAY
   rather than of a person, so the range comes from the lab that
   produced the number and everything past that point is a
   clinician's job.

   ---- the medicines list adjusts nothing ----

   It says what a drug does to the numbers ON THESE PAGES and
   stops. Adjusting an equation for a medicine would be
   practising medicine with arithmetic; saying what the medicine
   does to a reading is explaining a chart.
   ============================================================ */

import { useEffect, useState } from "react";
import { getProfile, saveProfile, who, type Profile, type Who } from "../../lib/diet-api";
import { ChipButton } from "../ui/chip";
import { Note } from "../ui/note";
import { T, TBlock, useToolLang } from "./lang";
import { MEDS } from "./words";

const MARKERS: Array<{ en: string; bn: string; why: string; whyBn: string }> = [
  { en: "Blood pressure", bn: "রক্তচাপ",
    why: "The thing weight loss improves fastest and most reliably. Two numbers, a home cuff, and it responds within weeks.",
    whyBn: "ওজন কমালে যেটা সবচেয়ে দ্রুত আর নিশ্চিতভাবে ভালো হয়। দুটো সংখ্যা, ঘরের একটা যন্ত্র, আর কয়েক সপ্তাহেই সাড়া দেয়।" },
  { en: "HbA1c and fasting glucose", bn: "এইচবিএ১সি আর খালি পেটে গ্লুকোজ",
    why: "Bangladesh has one of the highest diabetes prevalences in the region and much of it is undiagnosed. HbA1c is a three month average, which is exactly the timescale this tool works on.",
    whyBn: "এই অঞ্চলে ডায়াবেটিসের হার বাংলাদেশে সবচেয়ে বেশির একটি, আর তার অনেকটাই ধরা পড়ে না। এইচবিএ১সি তিন মাসের গড়, আর এই যন্ত্র ঠিক ওই সময়ের মাপেই কাজ করে।" },
  { en: "The lipid panel", bn: "চর্বির পরীক্ষা",
    why: "Total, HDL, LDL and triglycerides. The panel that answers the keto argument for you in particular rather than in general, and triglycerides move fast with carbohydrate and with weight.",
    whyBn: "মোট, এইচডিএল, এলডিএল আর ট্রাইগ্লিসারাইড। কিটো নিয়ে তর্কটা সাধারণভাবে নয়, আপনার বেলায় এই পরীক্ষাই মেটায়, আর ট্রাইগ্লিসারাইড শর্করা আর ওজনের সঙ্গে দ্রুত বদলায়।" },
  { en: "Liver enzymes", bn: "যকৃতের এনজাইম",
    why: "Fatty liver is extremely common at these body compositions and improves with loss. ALT is the number that shows it.",
    whyBn: "এই ধরনের শরীরে ফ্যাটি লিভার খুবই সাধারণ আর ওজন কমলে ভালো হয়। এএলটি সংখ্যাটাই সেটা দেখায়।" },
  { en: "Haemoglobin and ferritin", bn: "হিমোগ্লোবিন আর ফেরিটিন",
    why: "The other half of the iron question, and the one that turns it from a guess into a measurement.",
    whyBn: "আয়রনের প্রশ্নের বাকি অর্ধেক, আর এটাই সেটাকে আন্দাজ থেকে মাপে বদলে দেয়।" },
  { en: "Thyroid", bn: "থাইরয়েড",
    why: "An underactive thyroid is a real explanation for a real stall, and it is also the explanation people reach for when it is not the explanation. A logged TSH settles it either way.",
    whyBn: "থাইরয়েড কম কাজ করা সত্যিই আটকে যাওয়ার একটা কারণ হতে পারে, আবার কারণ না হলেও মানুষ এটাকেই ধরে। একটা টিএসএইচ লিখে রাখলে দুদিকেই মীমাংসা হয়।" },
];


export function HealthPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

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
    void getProfile(w).then((p) => { if (alive) setProfile(p); });
    return () => { alive = false; };
  }, [w]);

  const taking = new Set(profile?.meds ?? []);
  const toggle = async (id: string): Promise<void> => {
    if (!w) return;
    const next = new Set(taking);
    if (next.has(id)) next.delete(id); else next.add(id);
    const meds = [...next];
    setProfile((p) => ({ ...(p ?? {}), meds }));
    await saveProfile(w, { ...(profile ?? {}), meds });
  };

  return (
    <div className="dt-health">
      <section aria-labelledby="dt-lab-h">
        <h2 id="dt-lab-h"><T en="The numbers a clinic gives you" bn="ক্লিনিক যে সংখ্যাগুলো দেয়" /></h2>
        <p className="dt-hint">
          <T
            en="Twice a year somebody has blood taken and is handed a sheet of numbers they cannot read, which then goes in a drawer. Those are the only objective measurements in this entire tool."
            bn="বছরে দুবার রক্ত পরীক্ষা হয়, একটা কাগজ হাতে আসে যেটা পড়া যায় না, তারপর সেটা ড্রয়ারে যায়। এই পুরো যন্ত্রের একমাত্র বস্তুনিষ্ঠ মাপ ওগুলোই।"
          />
        </p>
        <dl className="dt-defs">
          {MARKERS.map((m) => (
            <div key={m.en}>
              <dt><T en={m.en} bn={m.bn} /></dt>
              <dd><T en={m.why} bn={m.whyBn} /></dd>
            </div>
          ))}
        </dl>
        <Note tone="quiet">
          <TBlock
            en={(
              <p>
                The tool prints the reference range your lab gave and nothing
                else. No interpretation, no colour on an out of range value, no
                &quot;your risk is&quot;. A reference range is a property of an
                assay rather than of a person, and everything past that point is
                a clinician&apos;s job. Units are stored rather than assumed:
                glucose is mmol/L here and commonly mg/dL on a Bangladeshi
                report, and the two differ by a factor of eighteen.
              </p>
            )}
            bn={(
              <p>
                আপনার ল্যাব যে সীমা দিয়েছে যন্ত্রটি কেবল সেটাই দেখায়, আর কিছু নয়।
                কোনো ব্যাখ্যা নেই, সীমার বাইরের সংখ্যায় কোনো রং নেই, ঝুঁকির কথা নেই।
                সীমাটা পরীক্ষার নিজের বৈশিষ্ট্য, মানুষের নয়, আর তার পরের সবটাই
                চিকিৎসকের কাজ। এককও ধরে নেওয়া হয় না, লিখে রাখা হয়: এখানে গ্লুকোজ
                mmol/L, আর বাংলাদেশি রিপোর্টে সাধারণত mg/dL, আর দুটোর মধ্যে আঠারো
                গুণ পার্থক্য।
              </p>
            )}
          />
        </Note>
      </section>

      <section aria-labelledby="dt-med-h">
        <h2 id="dt-med-h"><T en="Medicine that changes the arithmetic" bn="যে ওষুধ হিসাব বদলে দেয়" /></h2>
        <p className="dt-hint">
          <T
            en="Several very ordinary medicines change what these equations mean, and a tracker that does not know about them silently produces wrong readings and lets the reader conclude something about themselves. This is not a drug database and it interacts with nothing."
            bn="খুব সাধারণ কয়েকটি ওষুধ এই হিসাবগুলোর মানে বদলে দেয়, আর যে খাতা সেটা জানে না সে চুপচাপ ভুল হিসাব দেয় আর পাঠককে নিজের সম্পর্কে ভুল সিদ্ধান্তে পৌঁছে দেয়। এটা ওষুধের ডেটাবেস নয় আর কিছুর সঙ্গে মেলায় না।"
          />
        </p>
        {answered && w ? (
          <div className="dt-tags" role="group"
               aria-label={lang === "bn" ? "আপনি কী নেন" : "What you take"}>
            {MEDS.map((m) => (
              <ChipButton key={m.id} pressed={taking.has(m.id)} onClick={() => void toggle(m.id)}>
                <T en={m.en} bn={m.bn} />
              </ChipButton>
            ))}
          </div>
        ) : null}
        {/* EVERY EXPLANATION, ALWAYS. This filtered to what the
            reader had ticked, so the list was complete until
            somebody ticked anything and then collapsed to their
            own: a reader on a diuretic could not read what
            insulin does to these charts before starting a
            deficit, and that sentence is the strongest warning
            in this tool. Ticking marks a row; it does not hide
            the others. */}
        <dl className="dt-defs">
          {MEDS.map((m) => (
            <div key={m.id} data-taking={taking.has(m.id) ? "yes" : undefined}>
              <dt>
                <T en={m.en} bn={m.bn} />
                {taking.has(m.id) ? (
                  <span className="dt-yours">
                    <T en="you take this" bn="আপনি এটি নেন" />
                  </span>
                ) : null}
              </dt>
              <dd><T en={m.does} bn={m.doesBn} /></dd>
            </div>
          ))}
        </dl>
        <Note tone="warn">
          <TBlock
            en={(
              <p>
                Nothing here is a reason to start, stop or change a dose, and the
                tool never adjusts a number because of a medicine. Adjusting an
                equation for a drug would be practising medicine with arithmetic;
                saying what the drug does to a reading is explaining a chart.
              </p>
            )}
            bn={(
              <p>
                এখানকার কিছুই ওষুধ শুরু, বন্ধ বা ডোজ বদলানোর কারণ নয়, আর ওষুধের
                জন্য যন্ত্রটি কোনো সংখ্যা বদলায় না। ওষুধের জন্য সূত্র বদলানো মানে
                হিসাব দিয়ে চিকিৎসা করা; ওষুধ একটা মাপে কী করে তা বলা মানে চার্ট
                বুঝিয়ে দেওয়া।
              </p>
            )}
          />
        </Note>
      </section>
    </div>
  );
}
