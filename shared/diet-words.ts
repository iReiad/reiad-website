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
