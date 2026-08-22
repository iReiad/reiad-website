/* ============================================================
   diet-pages.ts: the eleven addresses of the diet tool, once.

   THE SAME RULE AS `nav.ts`, one level down. The front door's
   deck said all ten in one place, the strip across the top of
   every page said none of them anywhere, and there was no route
   from any page of this tool to any other: from `/tools/diet/you`
   the only way to `/tools/diet/goal` was the Back button.

   Add a page here and it appears in the deck AND in the strip at
   once, which is the whole reason this is a table rather than
   two lists somebody keeps in step.

   `needsAccount` is what the strip draws quietly rather than
   hiding: a reader signed out can still read what a page would
   do, and a link that vanishes is a page that does not exist as
   far as they can tell.
   ============================================================ */

export interface DietPage {
  /** The path. `/tools/diet` itself is not in here: it is the
      page the strip sits on and a strip that links to the page
      it is on is a strip with a dead entry. */
  href: string;
  /** The strip's word. Short, because eleven of them share a
      line, and a strip that wraps to three rows is a menu. */
  tab: { en: string; bn: string };
  /** The card's heading, which has room to be a phrase. */
  title: { en: string; bn: string };
  /** The card's verb. */
  go: { en: string; bn: string };
  dek: { en: string; bn: string };
  /** Nothing on this page works signed out. */
  needsAccount?: true;
}

export const DIET_HOME = "/tools/diet";

export const DIET_PAGES: DietPage[] = [
  {
    href: "/tools/diet/you",
    tab: { en: "Your body", bn: "শরীর" },
    title: { en: "Your body", bn: "আপনার শরীর" },
    go: { en: "Work it out", bn: "হিসাব করুন" },
    dek: {
      en: "Waist to height first, BMI on the cut-offs that apply to you, body fat as a range, and what you burn at rest. Nothing is stored and no account is needed.",
      bn: "প্রথমে কোমর ও উচ্চতার অনুপাত, তারপর আপনার জন্য প্রযোজ্য সীমায় বিএমআই, একটা সীমার মধ্যে চর্বি, আর বিশ্রামে কত খরচ। কিছুই জমা থাকে না, অ্যাকাউন্টও লাগে না।",
    },
  },
  {
    href: "/tools/diet/goal",
    tab: { en: "Goal", bn: "লক্ষ্য" },
    title: { en: "Your goal", bn: "আপনার লক্ষ্য" },
    go: { en: "Set it", bn: "ঠিক করুন" },
    dek: {
      en: "A rate as a percentage of bodyweight, the floors the tool will not cross, and how long it will take as a band rather than a date.",
      bn: "শরীরের ওজনের শতাংশে একটা হার, যে সীমাগুলো পেরোনো হবে না, আর কত দিন লাগবে তা তারিখ নয়, একটা সীমা হিসেবে।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/diet/trend",
    tab: { en: "Trend", bn: "ধারা" },
    title: { en: "The long view", bn: "লম্বা হিসাব" },
    go: { en: "See it", bn: "দেখুন" },
    dek: {
      en: "The trend against the scale, the rate with its error bar, and what your own log says you burn rather than what an equation guesses.",
      bn: "দাঁড়িপাল্লার বিপরীতে ধারা, ভুলের সীমাসহ হার, আর সূত্রের আন্দাজ নয়, আপনার নিজের খাতা যা বলে সেই খরচ।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/diet/expect",
    tab: { en: "What to expect", bn: "কখন কী" },
    title: { en: "What to expect, and when", bn: "কখন কী হবে" },
    go: { en: "Read it", bn: "পড়ুন" },
    dek: {
      en: "The arc of a deficit hour by hour and week by week, said before the week. Almost everybody who quits does so at a point that was predictable a fortnight earlier.",
      bn: "ঘাটতির ধাপ ঘণ্টায় ঘণ্টায় আর সপ্তাহে সপ্তাহে, আগেই বলা। যাঁরা ছেড়ে দেন তাঁদের প্রায় সবাই এমন জায়গায় ছাড়েন যেটা দুই সপ্তাহ আগেই বলা যেত।",
    },
  },
  {
    href: "/tools/diet/nutrition",
    tab: { en: "Nutrients", bn: "পুষ্টি" },
    title: { en: "Beyond calories", bn: "ক্যালোরির বাইরে" },
    go: { en: "Look", bn: "দেখুন" },
    dek: {
      en: "Fibre, sodium, iron and the rest, each shown with how much of the day it was computed from. Under half and nothing is drawn at all.",
      bn: "আঁশ, সোডিয়াম, আয়রন আর বাকিগুলো, প্রতিটির সঙ্গে সেটা দিনের কতটুকু থেকে এসেছে। অর্ধেকের কম হলে কিছুই আঁকা হয় না।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/diet/journal",
    tab: { en: "How it is going", bn: "কেমন যাচ্ছে" },
    title: { en: "How it is going", bn: "কেমন যাচ্ছে" },
    go: { en: "Open it", bn: "খুলুন" },
    dek: {
      en: "Hunger, which climbs before the trend moves and before adherence breaks, and what people report on a deficit, described and never diagnosed.",
      bn: "ক্ষুধা, যেটা ধারা নড়ার আগেই আর নিয়ম ভাঙার আগেই বাড়ে, আর ঘাটতিতে মানুষ যা বলে, বর্ণনা করা, রোগ নির্ণয় নয়।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/diet/foods",
    tab: { en: "What it costs", bn: "খরচ" },
    title: { en: "What it costs to eat", bn: "খেতে কত খরচ" },
    go: { en: "Compare", bn: "তুলনা করুন" },
    dek: {
      en: "Cost per gram of protein, in taka and in pounds. This is a personal finance site, and a diet tool here that never priced a meal would be the one place the obvious question goes unasked.",
      bn: "প্রতি গ্রাম প্রোটিনের দাম, টাকায় আর পাউন্ডে। এটা টাকার সাইট, আর এখানকার খাদ্য যন্ত্র যদি কখনো দামের কথা না বলে, তবে এটাই একমাত্র জায়গা যেখানে সবচেয়ে স্পষ্ট প্রশ্নটা করা হয় না।",
    },
  },
  {
    href: "/tools/diet/health",
    tab: { en: "The clinic", bn: "ক্লিনিক" },
    title: { en: "The clinic's numbers", bn: "ক্লিনিকের সংখ্যা" },
    go: { en: "Read it", bn: "পড়ুন" },
    dek: {
      en: "Blood pressure, HbA1c, the lipid panel, and the ordinary medicines that change what these charts mean. The only objective measurements in the whole tool.",
      bn: "রক্তচাপ, এইচবিএ১সি, চর্বির পরীক্ষা, আর যে সাধারণ ওষুধগুলো এই চার্টের মানে বদলে দেয়। পুরো যন্ত্রের একমাত্র বস্তুনিষ্ঠ মাপ এগুলোই।",
    },
  },
  {
    href: "/tools/diet/summary",
    tab: { en: "For a doctor", bn: "ডাক্তারের জন্য" },
    title: { en: "One page for a doctor", bn: "ডাক্তারের জন্য এক পাতা" },
    go: { en: "Print it", bn: "প্রিন্ট করুন" },
    dek: {
      en: "A ten minute appointment, and most people arrive with a memory. This is the same thing with dates on it, and the width of every estimate beside it.",
      bn: "দশ মিনিটের সাক্ষাৎ, আর বেশিরভাগ মানুষ যান শুধু স্মৃতি নিয়ে। এটা সেই একই জিনিস, তারিখসহ, আর প্রতিটি আন্দাজের পাশে তার সীমা।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/diet/glossary",
    tab: { en: "The words", bn: "শব্দ" },
    title: { en: "What the words mean", bn: "শব্দগুলোর মানে" },
    go: { en: "Read it", bn: "পড়ুন" },
    dek: {
      en: "BMR, TDEE, glycogen, adaptive thermogenesis. A tool that uses these words without defining them is written for people who already know.",
      bn: "বিএমআর, মোট খরচ, গ্লাইকোজেন, খাপ খাওয়ানো বিপাক। যে যন্ত্র এই শব্দগুলো ব্যবহার করে অথচ মানে বলে না, সেটা যাঁরা আগে থেকেই জানেন তাঁদের জন্য লেখা।",
    },
  },
];
