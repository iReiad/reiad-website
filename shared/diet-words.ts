/* ============================================================
   The diet tool's own words.

   Its own table rather than a corner of `tool-strings.ts`, and
   the reason is that file's own fixture: `stringKeys` there is
   "every phrase the stock check can render", and the app's stock
   test uses it to assert that every id it draws has a sentence.
   A diet phrase in that list makes the assertion weaker for both
   tools.

   ---- why they are in `shared/` at all ----

   The Android app draws the same figures. Copy is DATA by the
   contract at the top of `CLAUDE.md`, so a line reworded here is
   reworded on a phone at the next fetch, and the alternative is
   a second copy of every sentence in Kotlin.

   `<T k="...">` in `next/components/diet/lang.tsx` reads this and
   still renders BOTH languages into the DOM, which is the diet
   pages' own arrangement and what makes them work with no
   JavaScript: the stylesheet picks. Nothing about that changed
   when the strings moved.

   Both languages are REQUIRED and the type is what says so. A
   Bangla reader should never have to read English to find out
   that something exists in their own language, and
   `check-diet.ts` fails on a half that is missing.
   ============================================================ */

import type { Phrase } from "./tool-strings.ts";

export const DIET_WORDS: Record<string, Phrase> = {
/* ---- the body page's readout ---- */
"dt.body.head": {
  en: "What that says about you",
  bn: "এতে আপনার সম্পর্কে যা বোঝা যায়",
},
"dt.whtr.head": { en: "Waist to height", bn: "কোমর ও উচ্চতার অনুপাত" },
"dt.whtr.empty": {
  en: "A waist measurement gives you this, and it is the better of the two.",
  bn: "কোমরের মাপ দিলেই এটা পাওয়া যাবে, আর দুটোর মধ্যে এটাই ভালো।",
},
"dt.whtr.why": {
  en: "Predicts cardiometabolic risk better than BMI across ethnicities, and "
    + "needs one tape measure.",
  bn: "বিভিন্ন জাতিগোষ্ঠীর ক্ষেত্রে বিএমআইয়ের চেয়ে ভালো ইঙ্গিত দেয়, আর লাগে শুধু একটা ফিতা।",
},
"dt.bmi.head": { en: "BMI", bn: "বিএমআই" },
"dt.bmi.why": {
  en: "Mass over height squared. It cannot tell muscle from fat and says "
    + "nothing about where the fat is, which is the part that matters.",
  bn: "ওজনকে উচ্চতার বর্গ দিয়ে ভাগ। এটি পেশি আর চর্বির পার্থক্য বোঝে না, আর চর্বি "
    + "কোথায় জমেছে তা বলে না, যেটাই আসল ব্যাপার।",
},
"dt.fat.head": { en: "Body fat", bn: "শরীরের চর্বি" },
"dt.fat.navy": {
  en: "From the tape, plus or minus about 3 to 4 points",
  bn: "ফিতার মাপ থেকে, প্রায় ৩ থেকে ৪ পয়েন্ট এদিক ওদিক",
},
"dt.fat.bmi": {
  en: "From BMI, plus or minus about 5 points",
  bn: "বিএমআই থেকে, প্রায় ৫ পয়েন্ট এদিক ওদিক",
},
"dt.fat.why": {
  en: "A range rather than a number, because that is what the method can "
    + "support. Anything printing one decimal place here is making it up.",
  bn: "একটা সংখ্যা নয়, একটা সীমা, কারণ পদ্ধতিটা এর বেশি বলতে পারে না। এখানে "
    + "দশমিকের ঘর দেখালে সেটা বানানো।",
},
"dt.lean.head": { en: "Lean mass", bn: "চর্বি ছাড়া ভর" },
"dt.lean.why": {
  en: "What the protein floor is worked out from, and the number that tells "
    + "a lifter their BMI is lying.",
  bn: "প্রোটিনের সর্বনিম্ন হিসাব এখান থেকেই আসে, আর যিনি ভার তোলেন তাঁকে এটাই "
    + "বলে দেয় বিএমআই ভুল বলছে।",
},

/* ---- and the fields it is worked out from ---- */
"dt.f.height": { en: "Height, cm", bn: "উচ্চতা, সেমি" },
"dt.f.weight": { en: "Weight, kg", bn: "ওজন, কেজি" },
"dt.f.age": { en: "Age, years", bn: "বয়স, বছর" },
"dt.f.waist": { en: "Waist, cm", bn: "কোমর, সেমি" },
"dt.f.neck": { en: "Neck, cm", bn: "গলা, সেমি" },
"dt.f.hip": { en: "Hip, cm", bn: "নিতম্ব, সেমি" },
"dt.f.cuts": { en: "Which BMI cut-offs", bn: "কোন বিএমআই সীমা" },
};

/* ============================================================
   The four tables keyed by a TOKEN rather than by a phrase id.

   `next/components/diet/words.ts` held these and re-exports them
   now. They moved for the reason everything else in this file
   did: the Android app draws the same figures, so a band printed
   in Kotlin would be a second copy of eight Bangla sentences that
   nothing holds to these.

   Keyed by the token the arithmetic in `shared/diet.ts` returns,
   which is what makes them checkable: `check-diet.ts` asserts
   that every token those functions can produce has a word here,
   in both directions, so a fifth band added to `bmiBand()` fails
   rather than printing `raised` at a reader.
   ============================================================ */

/** What a BMI band means, in words. The tokens are `bmiBand()`'s. */
export const BMI_BANDS: Record<string, Phrase> = {
  under:   { en: "under the healthy range", bn: "স্বাস্থ্যকর সীমার নিচে" },
  healthy: { en: "in the healthy range", bn: "স্বাস্থ্যকর সীমার মধ্যে" },
  raised:  { en: "above the healthy range", bn: "স্বাস্থ্যকর সীমার উপরে" },
  high:    { en: "well above the healthy range", bn: "অনেকটাই উপরে" },
};

/** The same for waist to height, whose tokens are `whtrBand()`'s. */
export const WHTR_BANDS: Record<string, Phrase> = {
  low:     { en: "below 0.4", bn: "০.৪ এর নিচে" },
  healthy: { en: "under 0.5, which is the mark to aim for", bn: "০.৫ এর নিচে, যেটাই লক্ষ্য" },
  raised:  { en: "0.5 or above", bn: "০.৫ বা তার বেশি" },
  high:    { en: "0.6 or above", bn: "০.৬ বা তার বেশি" },
};

/** Which form of the two equations was used. Not a statement
    about the reader: `sex` on this site is which fitted constant
    Mifflin-St Jeor and the tape method take, and the sheet says
    so rather than printing the token. */
export const SEX_FORMS: Record<string, Phrase> = {
  male:   { en: "the male form of the equations", bn: "সূত্রের পুরুষ রূপ" },
  female: { en: "the female form of the equations", bn: "সূত্রের নারী রূপ" },
};

/** Which BMI action points are in use, with the numbers in them,
    because a clinician reading the sheet needs the numbers. */
export const CUT_SETS: Record<string, Phrase> = {
  general: { en: "25 and 30, the general cut-offs", bn: "২৫ আর ৩০, সাধারণ সীমা" },
  asian:   { en: "23 and 27.5, the WHO Asian cut-offs", bn: "২৩ আর ২৭.৫, বিশ্ব স্বাস্থ্য সংস্থার এশীয় সীমা" },
};
