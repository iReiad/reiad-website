/* ============================================================
   diet/glossary.tsx: the words, in both languages.

   `DIET.md` section 22: a tool that uses "ketosis" and "adaptive
   thermogenesis" without defining them is written for people who
   already know, and this site is not for those people.

   ---- the Bangla rule this file exists to obey ----

   NO TRANSLITERATED JARGON WHERE A BANGLA WORD EXISTS.
   "ক্যালোরি" is a borrowed word genuinely in use and it stays.
   "টিডিইই" is not a word: it is four English letters written in
   Bangla script, and putting it on a page would be exactly the
   failure this rule prevents. So a term with no everyday Bangla
   word keeps its English name and gets a Bangla EXPLANATION, and
   the two halves of each row are not translations of each other
   so much as the same idea said properly twice.

   It is a table rather than prose because every entry is linked
   to from the first use of its term, and a definition somebody
   arrives at by anchor has to be findable on its own.
   ============================================================ */

import { T, TBlock } from "./lang";

interface Term {
  /** The anchor, so a first use elsewhere can link straight here. */
  id: string;
  en: string;
  /** The Bangla heading. English initialisms keep their Latin
      form, per the rule above. */
  bn: string;
  saysEn: string;
  saysBn: string;
}

export const TERMS: Term[] = [
  {
    id: "bmi", en: "BMI", bn: "বিএমআই",
    saysEn: "Weight divided by height squared. It cannot tell muscle from fat "
      + "and says nothing about where the fat is, which is the part that "
      + "matters. It is here because a doctor has given you one.",
    saysBn: "ওজনকে উচ্চতার বর্গ দিয়ে ভাগ। পেশি আর চর্বির পার্থক্য এটি বোঝে না, "
      + "আর চর্বি কোথায় জমেছে তা বলে না, যেটাই আসল ব্যাপার। এটা এখানে আছে "
      + "কারণ ডাক্তার আপনাকে একটা বিএমআই দিয়েছেন।",
  },
  {
    id: "whtr", en: "Waist to height", bn: "কোমর ও উচ্চতার অনুপাত",
    saysEn: "Waist divided by height, in the same units. Under 0.5 is the mark "
      + "to aim for. It needs one tape measure, makes no assumption about "
      + "population, and predicts risk better than BMI does.",
    saysBn: "কোমরের মাপকে উচ্চতা দিয়ে ভাগ, একই এককে। লক্ষ্য ০.৫ এর নিচে। লাগে "
      + "শুধু একটা ফিতা, কোন জনগোষ্ঠী তা ধরে নিতে হয় না, আর ঝুঁকির ইঙ্গিত "
      + "বিএমআইয়ের চেয়ে ভালো দেয়।",
  },
  {
    id: "bmr", en: "BMR, the resting burn", bn: "বিশ্রামে খরচ (BMR)",
    saysEn: "What your body costs doing nothing at all: breathing, a heartbeat, "
      + "a brain, a temperature. It is the largest part of what you burn in a "
      + "day, and no target here goes below it.",
    saysBn: "একেবারে কিছু না করেও শরীর যা খরচ করে: শ্বাস, হৃৎস্পন্দন, মস্তিষ্ক, "
      + "শরীরের তাপ। সারা দিনের খরচের সবচেয়ে বড় অংশ এটাই, আর এখানে কোনো "
      + "লক্ষ্যই এর নিচে নামে না।",
  },
  {
    id: "tdee", en: "TDEE, the daily burn", bn: "সারা দিনের খরচ (TDEE)",
    saysEn: "Everything you burn in a day: the resting burn, plus moving, plus "
      + "digesting what you ate. After a fortnight of logs this tool stops "
      + "estimating it and starts measuring it from your own trend.",
    saysBn: "সারা দিনে যা খরচ হয়: বিশ্রামের খরচ, চলাফেরা, আর যা খেয়েছেন তা হজম "
      + "করা মিলিয়ে। দুই সপ্তাহ লেখার পর এই যন্ত্র আন্দাজ করা বন্ধ করে আপনার "
      + "নিজের ধারা থেকে মেপে বলে।",
  },
  {
    id: "neat", en: "NEAT, the moving you do not plan", bn: "না ভেবে যে নড়াচড়া (NEAT)",
    saysEn: "Walking, standing, carrying, stairs, fidgeting. It varies by "
      + "hundreds of calories a day between two people of the same size, and it "
      + "quietly falls during a diet, which is most of what a stall is.",
    saysBn: "হাঁটা, দাঁড়ানো, বওয়া, সিঁড়ি, অস্থিরতা। একই আকারের দুজন মানুষের "
      + "মধ্যে দিনে কয়েকশো ক্যালোরির পার্থক্য হয়, আর ডায়েটের সময় চুপচাপ কমে "
      + "যায়, যেটাই বেশিরভাগ আটকে যাওয়ার আসল কারণ।",
  },
  {
    id: "glycogen", en: "Glycogen, and its water", bn: "গ্লাইকোজেন আর তার পানি",
    saysEn: "The body's store of carbohydrate, about 400 to 500 grams, and each "
      + "gram is held with roughly three grams of water. Empty it and one and a "
      + "half to two kilos leave in a week, and none of it is fat.",
    saysBn: "শরীরে জমানো শর্করা, প্রায় ৪০০ থেকে ৫০০ গ্রাম, আর প্রতি গ্রামের "
      + "সঙ্গে ধরে রাখা প্রায় তিন গ্রাম পানি। এটা খালি হলে সপ্তাহে দেড় থেকে দুই "
      + "কেজি নেমে যায়, যার এক ছটাকও চর্বি নয়।",
  },
  {
    id: "ketosis", en: "Ketosis", bn: "কিটোসিস",
    saysEn: "The state where the body runs largely on fat, having very little "
      + "carbohydrate to run on. Deeper ketosis is not faster fat loss: the "
      + "deficit is what decides that.",
    saysBn: "যে অবস্থায় শরীর মূলত চর্বি পুড়িয়ে চলে, কারণ শর্করা প্রায় নেই। "
      + "বেশি গভীর কিটোসিস মানে দ্রুত চর্বি কমা নয়: সেটা ঠিক করে ঘাটতি।",
  },
  {
    id: "adaptation", en: "Adaptive thermogenesis", bn: "খাপ খাওয়ানো বিপাক",
    saysEn: "As weight falls, the daily burn falls further than the lost weight "
      + "alone explains, often by ten to fifteen percent. It is normal, it is "
      + "not damage, and it is why a target set in week one is wrong by week ten.",
    saysBn: "ওজন কমার সঙ্গে সঙ্গে দিনের খরচ কেবল ওজন কমার হিসাবের চেয়েও বেশি "
      + "কমে, প্রায়ই দশ থেকে পনেরো শতাংশ। এটা স্বাভাবিক, কোনো ক্ষতি নয়, আর "
      + "এই কারণেই প্রথম সপ্তাহের লক্ষ্য দশম সপ্তাহে ভুল হয়ে যায়।",
  },
  {
    id: "lean", en: "Lean mass, and FFMI", bn: "চর্বি ছাড়া ভর আর এফএফএমআই",
    saysEn: "Everything you are made of that is not fat: muscle, bone, organs, "
      + "water. FFMI is that divided by height squared, and it is the number "
      + "that tells somebody who lifts that their BMI is lying about them.",
    saysBn: "চর্বি বাদে আপনি যা দিয়ে গড়া: পেশি, হাড়, অঙ্গ, পানি। এফএফএমআই "
      + "হলো সেটাকে উচ্চতার বর্গ দিয়ে ভাগ, আর যিনি ভার তোলেন তাঁকে এই সংখ্যাটাই "
      + "বলে দেয় বিএমআই তাঁর সম্পর্কে ভুল বলছে।",
  },
  {
    id: "trend", en: "The trend", bn: "ধারা",
    saysEn: "A smoothed line through your weighings. A single reading is real "
      + "weight plus a kilo or two of water, gut contents and salt, so nothing "
      + "in this tool ever reacts to one.",
    saysBn: "আপনার সব মাপের ভেতর দিয়ে টানা একটা মসৃণ রেখা। একদিনের মাপ মানে "
      + "আসল ওজনের সঙ্গে এক দুই কেজি পানি, পেটের খাবার আর লবণ, তাই এখানে "
      + "কিছুই একটামাত্র মাপে সাড়া দেয় না।",
  },
  {
    id: "deficit", en: "A deficit", bn: "ঘাটতি",
    saysEn: "Eating less than you burn. Roughly 7700 kcal is a kilogram of "
      + "body tissue, which is right for fat and wrong for water, and that is "
      + "why the arithmetic is done against the trend rather than the scale.",
    saysBn: "যা খরচ হয় তার চেয়ে কম খাওয়া। প্রায় ৭৭০০ ক্যালোরিতে এক কেজি শরীর, "
      + "যেটা চর্বির বেলায় ঠিক আর পানির বেলায় ভুল, আর সেজন্যই হিসাবটা "
      + "দাঁড়িপাল্লার নয়, ধারার বিপরীতে করা হয়।",
  },
  {
    id: "hba1c", en: "HbA1c", bn: "এইচবিএ১সি",
    saysEn: "The share of your haemoglobin that has sugar stuck to it. Because "
      + "a red blood cell lives about three months, it is an average of your "
      + "blood sugar over that time rather than a reading of this morning, "
      + "which is exactly the timescale this tool works on.",
    saysBn: "আপনার হিমোগ্লোবিনের যতটুকুতে চিনি লেগে আছে তার হার। লোহিত রক্তকণিকা "
      + "প্রায় তিন মাস বাঁচে, তাই এটা আজ সকালের মাপ নয়, ওই তিন মাসের রক্তের "
      + "চিনির গড়, আর এই যন্ত্র ঠিক ওই সময়ের মাপেই কাজ করে।",
  },
  {
    id: "netcarbs", en: "Net carbs", bn: "কার্যকর শর্করা (net carbs)",
    saysEn: "Total carbohydrate with the fibre taken off, because fibre is "
      + "carbohydrate your body cannot break down. It is the number a keto "
      + "limit is counted in, and it is not on most labels in either country, "
      + "so it is worked out rather than read.",
    saysBn: "মোট শর্করা থেকে আঁশ বাদ দিলে যা থাকে, কারণ আঁশ এমন শর্করা যা শরীর "
      + "ভাঙতে পারে না। কিটোর সীমা এই সংখ্যাতেই গোনা হয়, আর দুই দেশের "
      + "বেশিরভাগ মোড়কেই এটা লেখা থাকে না, তাই এটা পড়া হয় না, হিসাব করা হয়।",
  },
  {
    id: "resistant", en: "Resistant starch", bn: "প্রতিরোধী শ্বেতসার",
    saysEn: "Starch that has been cooked and then cooled, in rice or in "
      + "potatoes, and behaves partly like fibre instead of like sugar. It is "
      + "the one thing on this list that matters more here than in most "
      + "places, because cooled rice is an ordinary meal in Bangladesh.",
    saysBn: "রান্নার পর ঠান্ডা হওয়া শ্বেতসার, ভাতে বা আলুতে, যেটা চিনির মতো নয়, "
      + "আংশিক আঁশের মতো আচরণ করে। এই তালিকার একমাত্র জিনিস যেটা অন্য অনেক "
      + "জায়গার চেয়ে এখানে বেশি কাজে লাগে, কারণ বাংলাদেশে ঠান্ডা ভাত রোজকার খাবার।",
  },
  {
    id: "luteal", en: "The luteal phase", bn: "মাসিক চক্রের শেষ পর্ব",
    saysEn: "The roughly two weeks between ovulation and a period. Water "
      + "retention rises through it, so the scale can climb one to two "
      + "kilograms with no change in fat at all, and then drop it in a day. "
      + "A trend read across a whole cycle is the only honest reading.",
    saysBn: "ডিম্বস্ফোটন আর মাসিকের মাঝের প্রায় দুই সপ্তাহ। এই সময়ে শরীরে পানি "
      + "জমে, তাই চর্বি একটুও না বদলেও দাঁড়িপাল্লা এক দুই কেজি উঠতে পারে, আর "
      + "তারপর একদিনেই নেমে যায়। পুরো চক্র ধরে ধারা দেখাই একমাত্র সৎ পাঠ।",
  },
];

/** A first use, linked to its definition.

    The header above says every entry is linked to from the first
    use of its term, and for a while nothing anywhere linked to
    one: a grep for `diet/glossary#` across `next/` returned
    nothing at all, so eleven definitions sat at an address only
    reachable by scrolling the glossary itself.

    It renders the term in whichever language it was given, so a
    sentence keeps reading as a sentence, and `scripts/check-diet.ts`
    fails on a term used in these pages that this file does not
    define AND on an entry nothing links to. */
export function Term({ id, en, bn }: { id: string; en: string; bn?: string }) {
  return (
    <a className="dt-term-link" href={`/tools/diet/glossary#${id}`}>
      <T en={en} bn={bn ?? en} />
    </a>
  );
}

export function Glossary() {
  return (
    <dl className="dt-glossary">
      {TERMS.map((t) => (
        <div className="dt-term" key={t.id} id={t.id}>
          <dt><T en={t.en} bn={t.bn} /></dt>
          <dd><TBlock en={<p>{t.saysEn}</p>} bn={<p>{t.saysBn}</p>} /></dd>
        </div>
      ))}
    </dl>
  );
}
