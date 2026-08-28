/* ============================================================
   diet/words.ts: the tool's vocabulary, said once.

   Three files were printing the same facts in three spellings.
   `body.tsx` had a BMI band as "above the healthy range";
   `summary-panel.tsx` printed the raw token `raised` on a page
   that gets handed to a clinician, in English even in Bangla,
   and did the same with `male form` and with the medicine ids
   `glp1, insulin, steroid`. `health-panel.tsx` held the only
   readable list of those.

   This is the same rule `check-rows.ts` already enforces for the
   database: one vocabulary, one place. A component that needs a
   word for a token reads it here.

   No JSX in this file. It is a table of strings so that a check,
   a test and a route can all read it, and so that adding a
   language later is one column rather than a sweep.
   ============================================================ */

export interface Words { en: string; bn: string }

/* ---- four of them live in `shared/` now ----

   They are re-exported here under the names every component on
   this page already uses, so nothing else changed. What moved is
   where the STRINGS are: the Android app draws the same figures,
   and a band printed in Kotlin would be a second copy of eight
   Bangla sentences with nothing holding the two together. Copy is
   DATA by the contract at the top of `CLAUDE.md`, so these reach
   a phone through `/api/site` and a reworded band arrives at the
   next fetch.

   `Phrase` and `Words` are the same shape, which is why the
   re-export needs no adapter. */
export {
  BMI_BANDS as BAND_WORDS,
  WHTR_BANDS as WHTR_WORDS,
  SEX_FORMS as SEX_WORDS,
  CUT_SETS as CUTS_WORDS,
} from "@reiad/shared/diet-words";

export interface Med {
  id: string;
  en: string; bn: string;
  /** What it does to what this tool draws. Never what to do
      about it: adjusting an equation for a drug would be
      practising medicine with arithmetic. */
  does: string; doesBn: string;
}

/** THE ID IS A STORED VALUE. `diet_profile.meds` holds these
    strings in real accounts, so an id is renamed the way a
    storage key is renamed, which is to say not at all. */
export const MEDS: Med[] = [
  { id: "glp1", en: "A GLP-1 (semaglutide, tirzepatide)", bn: "জিএলপি-১ (সেমাগ্লুটাইড, টির্জেপাটাইড)",
    does: "Intake falls a long way without effort, so the deficit gets large by itself. Two consequences: the protein floor matters MORE, not less, because loss on these carries a real muscle share, and the learned maintenance is the best available check that the deficit has not become extreme.",
    doesBn: "চেষ্টা ছাড়াই খাওয়া অনেক কমে যায়, তাই ঘাটতি নিজে থেকেই বড় হয়। দুটো ফল: প্রোটিনের সর্বনিম্নটা তখন কম নয়, বেশি জরুরি, কারণ এতে কমার একটা বড় অংশ পেশি হতে পারে; আর ঘাটতি অতিরিক্ত হয়ে গেছে কি না দেখার সবচেয়ে ভালো উপায় নিজের খরচের হিসাব।" },
  { id: "thyroid", en: "Thyroid replacement", bn: "থাইরয়েডের ওষুধ",
    does: "Changes resting burn directly. A dose change invalidates a learned maintenance, so the tool offers to restart the fourteen day window rather than averaging across it.",
    doesBn: "বিশ্রামের খরচ সরাসরি বদলায়। ডোজ বদলালে শেখা খরচের হিসাব আর খাটে না, তাই যন্ত্রটি গড় না করে চৌদ্দ দিনের হিসাব নতুন করে শুরু করার প্রস্তাব দেয়।" },
  { id: "steroid", en: "Corticosteroids", bn: "কর্টিকোস্টেরয়েড",
    does: "Appetite up, fluid retention up. The scale can rise several kilos in a week with no change in fat at all.",
    doesBn: "ক্ষুধা বাড়ে, পানি জমে। এক সপ্তাহে দাঁড়িপাল্লা কয়েক কেজি উঠতে পারে, অথচ চর্বি একটুও বদলায় না।" },
  { id: "insulin", en: "Insulin or a sulfonylurea", bn: "ইনসুলিন বা সালফোনাইলইউরিয়া",
    does: "A calorie deficit changes glucose control quickly, which is precisely why this row exists: the dose that was right last month may be too much this month. Speak to a clinician BEFORE starting, not after.",
    doesBn: "ক্যালোরির ঘাটতি রক্তের চিনি দ্রুত বদলায়, আর এই সারিটা ঠিক সেজন্যই আছে: গত মাসে যে ডোজ ঠিক ছিল, এই মাসে সেটা বেশি হয়ে যেতে পারে। শুরুর আগে চিকিৎসকের সঙ্গে কথা বলুন, পরে নয়।" },
  { id: "mood", en: "Some antidepressants and antipsychotics", bn: "কিছু বিষণ্নতা ও মানসিক রোগের ওষুধ",
    does: "Weight gain is a well documented effect of several. Naming it stops a reader concluding their metabolism has broken.",
    doesBn: "কয়েকটির ক্ষেত্রে ওজন বাড়া ভালোভাবে নথিভুক্ত। এটা বলে দিলে পাঠক ভাববেন না যে তাঁর বিপাক নষ্ট হয়ে গেছে।" },
  { id: "diuretic", en: "Diuretics", bn: "মূত্রবর্ধক",
    does: "Make weight readings and the electrolyte notes unreliable, in different directions.",
    doesBn: "ওজনের মাপ আর লবণের হিসাব দুটোকেই অনির্ভরযোগ্য করে, দুই দিকে।" },
  { id: "betablocker", en: "Beta blockers", bn: "বিটা ব্লকার",
    does: "Hold the heart rate down, including under effort, so a session that felt hard reads as easy on a watch and the calories it reports are wrong. They also lower resting burn slightly. The learned maintenance takes both in its stride; a fitness tracker's estimate does not.",
    doesBn: "হৃৎস্পন্দন কমিয়ে রাখে, পরিশ্রমের সময়ও, তাই যে ব্যায়ামটা কঠিন লেগেছে ঘড়িতে সেটা সহজ দেখায় আর ঘড়ির ক্যালোরির হিসাব ভুল হয়। বিশ্রামের খরচও সামান্য কমায়। নিজের খাতা থেকে মাপা খরচ দুটোই সামলে নেয়; ঘড়ির আন্দাজ নেয় না।" },
  { id: "contraception", en: "Hormonal contraception", bn: "হরমোনাল জন্মনিয়ন্ত্রণ",
    does: "Changes or removes the monthly pattern, which is worth knowing before a phase is drawn on a chart.",
    doesBn: "মাসিক ধরনটা বদলে দেয় বা সরিয়ে দেয়, আর চার্টে সেই পর্ব আঁকার আগে এটা জানা দরকার।" },
];

/** A stored id back to its readable name, for the sheet. An id
    the table does not know is printed as itself rather than
    dropped: a medicine that vanished off a clinical summary
    because this file fell behind would be worse than one spelled
    oddly. */
export const medWords = (id: string): Words => {
  const m = MEDS.find((x) => x.id === id);
  return m ? { en: m.en, bn: m.bn } : { en: id, bn: id };
};

/* ------------------------------------------------------------
   the clinic's own numbers

   `diet_labs` has had a table, four policies and an index since
   the migration was written, and no reader and no writer at all,
   while the front door's card calls these "the only objective
   measurements in the whole tool". A promise a page makes and a
   table cannot keep.

   A MARKER'S ID IS A STORED VALUE, exactly like a medicine's:
   `diet_labs.marker` holds these strings in real rows.

   AND THE RANGE IS THE READER'S LAB'S, NOT THIS FILE'S. A
   reference interval is a property of an assay and a population,
   it is printed on the report the reader is holding, and it
   varies between labs by more than the differences this tool
   would be drawing. `ref_low` and `ref_high` are columns on the
   row for that reason. What is below is a TYPICAL adult range,
   offered as a default and overwritten by whatever the report
   says, and every figure drawn against a default says so.
   ------------------------------------------------------------ */

export interface Marker {
  id: string;
  en: string; bn: string;
  /** The unit the default range is in. A reader whose report is
      in another unit changes it, and the row carries its own. */
  unit: string;
  /** A typical adult reference interval. Either end may be
      absent: a marker can have a floor, a ceiling or both. */
  low?: number;
  high?: number;
  /** Where the default came from, so a reader can tell it from
      their own lab's. */
  from: string;
  /** Whether a higher reading is the direction of concern. Used
      only to say which way a change went, never to grade it. */
  worseHigh: boolean;
  why: string; whyBn: string;
}

export const MARKERS: Marker[] = [
  { id: "sbp", en: "Blood pressure, upper", bn: "রক্তচাপ, উপরের",
    unit: "mmHg", high: 120, from: "NHS: under 120 over 80 is the ideal range for an adult",
    worseHigh: true,
    why: "The thing weight loss improves fastest and most reliably. Two numbers, a home cuff, and it responds within weeks.",
    whyBn: "ওজন কমালে যেটা সবচেয়ে দ্রুত আর নিশ্চিতভাবে ভালো হয়। দুটো সংখ্যা, ঘরের একটা যন্ত্র, আর কয়েক সপ্তাহেই সাড়া দেয়।" },
  { id: "dbp", en: "Blood pressure, lower", bn: "রক্তচাপ, নিচের",
    unit: "mmHg", high: 80, from: "NHS: under 120 over 80 is the ideal range for an adult",
    worseHigh: true,
    why: "The second of the two. A home cuff gives both at once and this is the one people forget to write down.",
    whyBn: "দুটোর মধ্যে দ্বিতীয়টা। ঘরের যন্ত্র দুটোই একসঙ্গে দেয়, আর এটাই মানুষ লিখতে ভুলে যায়।" },
  { id: "hba1c", en: "HbA1c", bn: "এইচবিএ১সি",
    unit: "mmol/mol", high: 42, from: "WHO and NICE: 42 to 47 is the range before diabetes, 48 and above is diabetes",
    worseHigh: true,
    why: "Bangladesh has one of the highest diabetes prevalences in the region and much of it is undiagnosed. It is a three month average, which is exactly the timescale this tool works on.",
    whyBn: "এই অঞ্চলে ডায়াবেটিসের হার বাংলাদেশে সবচেয়ে বেশির একটি, আর তার অনেকটাই ধরা পড়ে না। এটা তিন মাসের গড়, আর এই যন্ত্র ঠিক ওই সময়ের মাপেই কাজ করে।" },
  { id: "glucose", en: "Fasting glucose", bn: "খালি পেটে গ্লুকোজ",
    unit: "mmol/L", low: 3.9, high: 5.5, from: "WHO: 5.6 to 6.9 is impaired fasting glucose",
    worseHigh: true,
    why: "One morning's reading rather than three months of them, so it moves faster and means less on its own. Worth having beside the HbA1c rather than instead of it.",
    whyBn: "তিন মাসের গড় নয়, এক সকালের মাপ, তাই দ্রুত বদলায় আর একা এর মানে কম। এইচবিএ১সির বদলে নয়, পাশে রাখাই ভালো।" },
  { id: "chol", en: "Total cholesterol", bn: "মোট কোলেস্টেরল",
    unit: "mmol/L", high: 5, from: "NHS: 5 or below for a healthy adult",
    worseHigh: true,
    why: "The headline of the lipid panel and the least useful line on it by itself, because it adds together two things that move in opposite directions.",
    whyBn: "চর্বির পরীক্ষার প্রধান সংখ্যা, আর একা এটাই সবচেয়ে কম কাজের, কারণ এটা এমন দুটো জিনিস যোগ করে যারা উল্টো দিকে যায়।" },
  { id: "ldl", en: "LDL cholesterol", bn: "এলডিএল কোলেস্টেরল",
    unit: "mmol/L", high: 3, from: "NHS: 3 or below for a healthy adult",
    worseHigh: true,
    why: "The line the keto argument is actually about. It rises for some people on a very low carbohydrate diet and not for others, and this is the measurement that answers it for you rather than in general.",
    whyBn: "কিটো নিয়ে তর্কটা আসলে এই লাইনটা নিয়েই। খুব কম শর্করার খাবারে কারও এটা বাড়ে, কারও বাড়ে না, আর সাধারণভাবে নয়, আপনার বেলায় এই মাপটাই সেটার উত্তর দেয়।" },
  { id: "hdl", en: "HDL cholesterol", bn: "এইচডিএল কোলেস্টেরল",
    unit: "mmol/L", low: 1, from: "NHS: above 1 for men, above 1.2 for women",
    worseHigh: false,
    why: "The one where higher is better, which is why a total on its own tells you so little. It tends to rise with weight loss and with walking.",
    whyBn: "এখানে বেশি হওয়াই ভালো, আর সেজন্যই মোট সংখ্যাটা একা এত কম বলে। ওজন কমলে আর হাঁটলে সাধারণত এটা বাড়ে।" },
  { id: "trig", en: "Triglycerides", bn: "ট্রাইগ্লিসারাইড",
    unit: "mmol/L", high: 1.7, from: "NHS: 1.7 or below, fasting",
    worseHigh: true,
    why: "The fastest mover on the panel. It follows carbohydrate and weight within weeks rather than months, so it is the line most likely to have changed by the next test.",
    whyBn: "এই পরীক্ষার সবচেয়ে দ্রুত বদলানো সংখ্যা। মাস নয়, কয়েক সপ্তাহেই শর্করা আর ওজনের সঙ্গে চলে, তাই পরের পরীক্ষায় এটাই বদলে যাওয়ার সম্ভাবনা সবচেয়ে বেশি।" },
  { id: "alt", en: "ALT, a liver enzyme", bn: "এএলটি, যকৃতের এনজাইম",
    unit: "U/L", high: 40, from: "varies by laboratory more than most: use the range on your own report",
    worseHigh: true,
    why: "Fatty liver is extremely common at these body compositions and improves with loss. This is the number that shows it.",
    whyBn: "এই ধরনের শরীরে ফ্যাটি লিভার খুবই সাধারণ আর ওজন কমলে ভালো হয়। এই সংখ্যাটাই সেটা দেখায়।" },
  { id: "hb", en: "Haemoglobin", bn: "হিমোগ্লোবিন",
    unit: "g/L", low: 120, from: "WHO: below 120 for women and below 130 for men is anaemia",
    worseHigh: false,
    why: "Anaemia is common among women in Bangladesh, and a deficit with less red meat in it makes it worse. This says whether the iron on the nutrition page is a real problem for you.",
    whyBn: "বাংলাদেশে নারীদের রক্তস্বল্পতা সাধারণ, আর কম লাল মাংসের ঘাটতিতে সেটা আরও বাড়ে। পুষ্টির পাতার আয়রনটা আপনার জন্য সত্যিই সমস্যা কি না, এটাই বলে।" },
  { id: "ferritin", en: "Ferritin", bn: "ফেরিটিন",
    unit: "µg/L", low: 30, from: "below 30 suggests low iron stores even where haemoglobin is normal",
    worseHigh: false,
    why: "The other half of the iron question, and the one that turns it from a guess into a measurement: stores run down long before the haemoglobin moves.",
    whyBn: "আয়রনের প্রশ্নের বাকি অর্ধেক, আর এটাই সেটাকে আন্দাজ থেকে মাপে বদলে দেয়: হিমোগ্লোবিন নড়ার অনেক আগেই জমা আয়রন ফুরিয়ে যায়।" },
  { id: "tsh", en: "TSH, thyroid", bn: "টিএসএইচ, থাইরয়েড",
    unit: "mIU/L", low: 0.4, high: 4, from: "a common adult range: laboratories differ, use the one on your report",
    worseHigh: true,
    why: "An underactive thyroid is a real explanation for a real stall, and it is also the explanation people reach for when it is not the explanation. One logged reading settles it either way.",
    whyBn: "থাইরয়েড কম কাজ করা সত্যিই আটকে যাওয়ার একটা কারণ হতে পারে, আবার কারণ না হলেও মানুষ এটাকেই ধরে। একটা মাপ লিখে রাখলে দুদিকেই মীমাংসা হয়।" },
];

export const markerById = (id: string): Marker | undefined =>
  MARKERS.find((m) => m.id === id);
