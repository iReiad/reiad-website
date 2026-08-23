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
  /** THIS PAGE'S COLOUR, and it is the site's own token rather
      than a value: `--green`, `--blue`, `--teal`, `--violet`,
      `--rose`, `--plum` and `--gold` are the seven the rail
      already themes six schools with, and `check-contrast.ts`
      has measured every one of them against both grounds.

      Eleven pages that look identical are eleven pages a reader
      navigates by reading. A colour is what makes the strip
      scannable and what tells somebody which page they are on
      before they have read the heading. */
  tone: string;
  /** THE PAGES THIS ONE READS FROM. Not a "see also": a page
      that draws nothing until a height is on the account has to
      say where a height is set, and a reader who lands on it
      cold otherwise sees an empty panel and no way out of it.

      Only this direction is written. What a page FEEDS is the
      reverse lookup below, so there is one list to keep true
      rather than two that can come to disagree. */
  needs?: string[];
}

export const DIET_HOME = "/tools/diet";

/** The front door's own, which is the section's. Every other page
    of this tool borrows one of the seven from the rail; this one
    keeps the colour the rail already gives Diet, so arriving from
    the rail is not a colour change. */
export const DIET_TONE = "var(--green)";

/** One page, by address. A trailing slash is the same address:
    `bare()` in `worker.js` takes one off before the route table
    is consulted, so a reader who arrived at `/tools/diet/goal/`
    is on the goal page. */
export const dietPage = (href: string): DietPage | undefined =>
  DIET_PAGES.find((p) => p.href === href || `${p.href}/` === href);

export const DIET_PAGES: DietPage[] = [
  {
    href: "/tools/diet/you",
    tone: "var(--teal)",
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
    needs: ["/tools/diet/you"],
    tone: "var(--gold)",
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
    needs: ["/tools/diet/you", "/tools/diet/goal"],
    tone: "var(--blue)",
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
    needs: ["/tools/diet/you", "/tools/diet/trend"],
    tone: "var(--violet)",
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
    needs: ["/tools/diet/foods"],
    tone: "var(--green)",
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
    needs: ["/tools/diet/goal"],
    tone: "var(--rose)",
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
    href: "/tools/diet/recipes",
    tone: "var(--rose)",
    tab: { en: "Three taps", bn: "তিন চাপ" },
    title: { en: "Three taps, or it does not get logged", bn: "তিন চাপ, নইলে লেখাই হয় না" },
    go: { en: "Build one", bn: "একটা বানান" },
    dek: {
      en: "Food diaries are abandoned because of friction, not motivation, and most people eat the same forty things. Build a dish once and a portion of it is one tap; log something three times and it offers itself.",
      bn: "খাবারের খাতা লেখা বন্ধ হয় ঝামেলার কারণে, ইচ্ছার অভাবে নয়, আর বেশিরভাগ মানুষ ঘুরেফিরে সেই চল্লিশটা জিনিসই খান। একবার একটা রান্না বানিয়ে রাখলে তার এক ভাগ এক চাপ; কিছু তিনবার লিখলে সেটা নিজেই সামনে চলে আসে।",
    },
    needs: ["/tools/diet/foods"],
    needsAccount: true,
  },
  {
    href: "/tools/diet/keto",
    tone: "var(--violet)",
    tab: { en: "Keto", bn: "কিটো" },
    title: { en: "Keto, hour by hour", bn: "কিটো, ঘণ্টায় ঘণ্টায়" },
    go: { en: "Start the clock", bn: "ঘড়ি চালু করুন" },
    dek: {
      en: "The first three weeks of keto lie to you: the scale falls fast and almost none of it is fat. A clock on the phase you are in, what the body is doing at this hour, and the three salts that leave with the water.",
      bn: "কিটোর প্রথম তিন সপ্তাহ আপনাকে ভুল বোঝায়: দাঁড়িপাল্লা দ্রুত নামে আর তার প্রায় কিছুই চর্বি নয়। আপনি যে পর্বে আছেন তার একটা ঘড়ি, এই ঘণ্টায় শরীর কী করছে, আর পানির সঙ্গে যে তিনটে লবণ চলে যায়।",
    },
    needs: ["/tools/diet/nutrition", "/tools/diet/glossary"],
    needsAccount: true,
  },
  {
    href: "/tools/diet/habits",
    tone: "var(--green)",
    tab: { en: "What you kept up", bn: "যা ধরে রেখেছেন" },
    title: { en: "What you kept up", bn: "যা ধরে রেখেছেন" },
    go: { en: "See the runs", bn: "দিনগুলো দেখুন" },
    dek: {
      en: "Seven daily things read off the log you already keep, never a second checklist to tick, each as a run of days with your best beside it. And a weight forecast built from your own steps rather than an assumed activity level.",
      bn: "আপনি যে খাতা এমনিতেই রাখেন তা থেকে পড়া সাতটা দৈনিক জিনিস, টিক দেওয়ার দ্বিতীয় কোনো তালিকা নয়, প্রতিটি কয়েক দিনের ধারা হিসেবে, পাশে আপনার সেরাটা। আর ধরে নেওয়া কর্মচঞ্চলতা নয়, আপনার নিজের হাঁটা থেকে ওজনের একটা আন্দাজ।",
    },
    needs: ["/tools/diet/goal", "/tools/diet/trend"],
    needsAccount: true,
  },
  {
    href: "/tools/diet/foods",
    needs: ["/tools/diet/nutrition"],
    tone: "var(--plum)",
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
    needs: ["/tools/diet/glossary"],
    tone: "var(--teal)",
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
    needs: ["/tools/diet/you", "/tools/diet/trend", "/tools/diet/health"],
    tone: "var(--blue)",
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
    href: "/tools/diet/import",
    tone: "var(--plum)",
    tab: { en: "Bring your history", bn: "হিসাব নিয়ে আসুন" },
    title: { en: "Bring your history", bn: "আপনার হিসাব নিয়ে আসুন" },
    go: { en: "Bring a file", bn: "ফাইল আনুন" },
    dek: {
      en: "A CSV from MyFitnessPal, Cronometer, LoseIt or a scale, with a preview of exactly what would be written before anything is. An importer that guesses silently fills a year of your history with the wrong column and you find out in March.",
      bn: "মাইফিটনেসপাল, ক্রোনোমিটার, লুজইট বা দাঁড়িপাল্লার একটা সিএসভি, আর লেখার আগেই ঠিক কী লেখা হবে তার একটা ঝলক। যে আমদানি চুপচাপ আন্দাজ করে সে আপনার এক বছরের হিসাব ভুল কলাম দিয়ে ভরিয়ে দেয়, আর আপনি টের পান মার্চ মাসে।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/diet/glossary",
    tone: "var(--gold)",
    tab: { en: "The words", bn: "শব্দ" },
    title: { en: "What the words mean", bn: "শব্দগুলোর মানে" },
    go: { en: "Read it", bn: "পড়ুন" },
    dek: {
      en: "BMR, TDEE, glycogen, adaptive thermogenesis. A tool that uses these words without defining them is written for people who already know.",
      bn: "বিএমআর, মোট খরচ, গ্লাইকোজেন, খাপ খাওয়ানো বিপাক। যে যন্ত্র এই শব্দগুলো ব্যবহার করে অথচ মানে বলে না, সেটা যাঁরা আগে থেকেই জানেন তাঁদের জন্য লেখা।",
    },
  },
];

/** What a page FEEDS: every page that names it in `needs`.
    Derived, never written, for the reason on `needs`. */
export const dietFeeds = (href: string): DietPage[] =>
  DIET_PAGES.filter((p) => p.needs?.includes(href));

/** What a page NEEDS, resolved to entries and never to strings,
    so an href that names no page is a type error at the call
    site rather than a dead link on a page. */
export const dietNeeds = (href: string): DietPage[] =>
  (dietPage(href)?.needs ?? [])
    .map((h) => dietPage(h))
    .filter((p): p is DietPage => p !== undefined);
