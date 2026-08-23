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

/** What a BMI band means, in words. The tokens are `bmiBand()`'s
    in `shared/diet.ts` and must stay in step with it. */
export const BAND_WORDS: Record<string, Words> = {
  under:   { en: "under the healthy range", bn: "স্বাস্থ্যকর সীমার নিচে" },
  healthy: { en: "in the healthy range", bn: "স্বাস্থ্যকর সীমার মধ্যে" },
  raised:  { en: "above the healthy range", bn: "স্বাস্থ্যকর সীমার উপরে" },
  high:    { en: "well above the healthy range", bn: "অনেকটাই উপরে" },
};

/** The same for waist to height, whose tokens are `whtrBand()`'s. */
export const WHTR_WORDS: Record<string, Words> = {
  low:     { en: "below 0.4", bn: "০.৪ এর নিচে" },
  healthy: { en: "under 0.5, which is the mark to aim for", bn: "০.৫ এর নিচে, যেটাই লক্ষ্য" },
  raised:  { en: "0.5 or above", bn: "০.৫ বা তার বেশি" },
  high:    { en: "0.6 or above", bn: "০.৬ বা তার বেশি" },
};

/** Which form of the two equations was used. Not a statement
    about the reader: `sex` on this site is which fitted constant
    Mifflin-St Jeor and the tape method take, and the sheet says
    so rather than printing the token. */
export const SEX_WORDS: Record<string, Words> = {
  male:   { en: "the male form of the equations", bn: "সূত্রের পুরুষ রূপ" },
  female: { en: "the female form of the equations", bn: "সূত্রের নারী রূপ" },
};

/** Which BMI action points are in use, with the numbers in them,
    because a clinician reading the sheet needs the numbers. */
export const CUTS_WORDS: Record<string, Words> = {
  general: { en: "25 and 30, the general cut-offs", bn: "২৫ আর ৩০, সাধারণ সীমা" },
  asian:   { en: "23 and 27.5, the WHO Asian cut-offs", bn: "২৩ আর ২৭.৫, বিশ্ব স্বাস্থ্য সংস্থার এশীয় সীমা" },
};

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
