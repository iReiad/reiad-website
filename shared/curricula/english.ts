/* ============================================================
   english.ts: the English school's ladder, in one file.

   THIS IS THE ONE FILE YOU EDIT to add, rename or reorder
   anything under /english/. Everything else reads from it: the
   hub, the part routes, the practice book, the breadcrumb, the
   palette, the menu and the sitemap.

   ---- and it is served as well as imported ----

   `scripts/build-modules.ts` compiles this file to
   `aab/english/curriculum.js`, which is the address the browser
   has always fetched it from and which `sw.js` precaches by name.
   Edit this file, never that one.

   ------------------------------------------------------------
   WHY THIS IS A FOURTH SCHOOL AND NOT A FOURTH STUFE

   /money/ is about money, /deutsch/ about German, /quran/ about
   reading the Quran. This is about speaking English, and it
   shares no vocabulary with any of them. It is mounted at
   /english/, built from the same parts as the German school so
   that anyone who has used one already knows how to use this
   one, and nothing here can break anything there.

   ------------------------------------------------------------
   WHAT IS DIFFERENT FROM THE OTHER THREE, AND WHY

   1. THE LEARNER ALREADY OWNS HALF OF IT. A Bangla speaker has
      met English at school, on signboards and in every form they
      have ever filled in. What they lack is not vocabulary, it
      is the courage and the shapes. So the course teaches
      patterns with slots in them, never word lists, and every
      part ends by asking for the learner's own true sentences.

   2. THE UNIT IS A PART, NOT A DAY. The two terms are thirteen
      and seventeen parts long. The DAYS live in the practice
      book, thirty of them, one page each, and the map inside
      part 13 lines those thirty days up against these parts.

   3. BANGLA IS THE LADDER, NOT THE FLOOR. Term One explains
      everything in Bangla because a beginner needs the ground
      under them. Term Two says so out loud on its own first
      slide and starts pulling the ladder up: the English
      examples get longer, and the Bangla stays only where it is
      doing work.

   4. EVERYTHING IS SPOKEN. The course's first rule is "say it
      out loud, always", and the workbook's own rule is that at
      least twenty-five of the sixty daily minutes must leave
      your mouth. So every part ends in a drill you say, not one
      you tick.

   ------------------------------------------------------------
   THE SHAPE

   TERMS[]               two terms, beginner and intermediate.
                         A term is a folder and a page of its own.

     .sections[]         a segment inside a term. Never a page.

       .parts[]          one page each. "Part" is what the course
                         itself calls them, so that is what they
                         are called here.

   ============================================================ */

/** Live, or promised and not yet written. */
export type Status = "live" | "soon";

/** One page. "Part" is what the course itself calls them, so that
    is what they are called here. */
export interface Part {
  slug: string;
  /** The part number the deck itself uses. It is on the card and
      in the eyebrow, because a learner with the deck open should
      be able to match the two without counting. */
  n: number;
  bn: string;
  en: string;
  /** A key in `aab/english/icons.js`. */
  icon: string;
  minutes: number;
  blurb: string;
  status?: Status;
}

/** A segment inside a term. Never a page. */
export interface Section {
  /** The anchor on the term page. */
  id: string;
  bn: string;
  en: string;
  parts: Part[];
}

/** A practice book: a page a day the learner writes into.

    `days` is DECLARED rather than counted because the browser
    draws a bar from it and must not download the whole book to do
    so. `scripts/check-next.ts` asserts it against the data. */
export interface Workbook {
  slug: string;
  days: number;
}

/** One rung of the ladder. A term has either a `workbook` or a
    `chorcha`, so the absence of a book reads as a decision. */
export interface Term {
  slug: string;
  /** The tiny label above the name, "টার্ম ১". */
  kicker: string;
  bn: string;
  /** The name in English, because this is an English course and
      the learner should meet the word. */
  en: string;
  /** A key in `aab/english/icons.js`. */
  icon: string;
  /** Who this term is for, in one line. */
  who: string;
  blurb: string;
  /** What you will be able to DO at the end of it. */
  can: string;
  /** The daily sitting this term asks for, [from, to]. */
  minutes: [number, number];
  status: Status;
  workbook?: Workbook;
  /** What the daily practice is for a term with no book. */
  chorcha?: string;
  sections: Section[];
}

/** The school itself: what it is called and where it is mounted. */
export interface School {
  id: string;
  mount: string;
  bn: string;
  en: string;
  tagline: string;
}

/** A part with the rung it hangs off attached, as every caller
    that walks the ladder wants it. */
export interface LadderPart extends Part {
  term: Term;
  section: Section;
  id: string;
  url: string;
  label: string;
  status: Status;
}

/* ------------------------------------------------------------
   টার্ম ১: the beginner course. Thirteen parts, thirty days.
   ------------------------------------------------------------ */
const TERM_1_SECTIONS: Section[] = [
  {
    id: "vitti",
    bn: "ভিত্তি",
    en: "The foundation",
    parts: [
      {
        slug: "word-order",
        n: 1,
        bn: "বাক্যের ইঞ্জিন: কে, কী করে, কী",
        en: "The Engine: word order",
        icon: "engine",
        minutes: 8,
        blurb:
          "বাংলায় ক্রিয়া বাক্যের শেষে বসে, ইংরেজিতে মাঝখানে। এই একটা অভ্যাস বদলালেই শুরুর অর্ধেক ভুল শেষ।",
      },
      {
        slug: "am-is-are",
        n: 2,
        bn: "am · is · are: যে শব্দটা বাংলায় লুকিয়ে থাকে",
        en: "Am · Is · Are",
        icon: "equals",
        minutes: 9,
        blurb:
          "'আমি ছাত্র' বলতে বাংলায় মাঝে কিছু লাগে না, ইংরেজিতে লাগে। বাংলাভাষীর সবচেয়ে বেশি করা ভুলটা এখানেই ঠিক হয়।",
      },
      {
        slug: "have-has",
        n: 3,
        bn: "have · has: আমার আছে",
        en: "Have · Has",
        icon: "hand",
        minutes: 8,
        blurb:
          "'আমার একটা বোন আছে' ইংরেজিতে উল্টো দিক থেকে বলা হয়: I have a sister. মালিকানা, অসুখ, সময়, সবই এক শব্দে।",
      },
    ],
  },
  {
    id: "kaj-o-kal",
    bn: "কাজ ও কাল",
    en: "Verbs and time",
    parts: [
      {
        slug: "verbs",
        n: 4,
        bn: "রোজকার ত্রিশটা ক্রিয়া, আর ছোট্ট -s",
        en: "Doing words",
        icon: "gears",
        minutes: 10,
        blurb:
          "ত্রিশটা ক্রিয়ায় দিনের নব্বই ভাগ কথা চলে। সাথে সেই টুপিটা: he, she, it হলে ক্রিয়ার শেষে একটা -s।",
      },
      {
        slug: "right-now",
        n: 5,
        bn: "এখন যা ঘটছে: am/is/are + -ing",
        en: "Right now",
        icon: "clock",
        minutes: 8,
        blurb:
          "এই কালটা বাংলাভাষীর জন্য উপহার, কারণ বাংলাও ঠিক একই কাজ করে: খাই আর খাচ্ছি।",
      },
      {
        slug: "yesterday",
        n: 6,
        bn: "কাল যা হয়েছে: was, -ed আর কুড়িটা রেবেল",
        en: "Yesterday",
        icon: "back",
        minutes: 11,
        blurb:
          "তোমার এতদিনের পুরো জীবন এই কালে বসে আছে। was/were, -ed, কুড়িটা অনিয়মী ক্রিয়া, আর did-এর জাদু।",
      },
      {
        slug: "tomorrow",
        n: 7,
        bn: "যা হবে: will আর going to",
        en: "Tomorrow",
        icon: "forward",
        minutes: 8,
        blurb:
          "will মানে এইমাত্র ঠিক করলাম বা কথা দিচ্ছি। going to মানে আগেই ঠিক করা ছিল। দুটোই সহজ।",
      },
    ],
  },
  {
    id: "hatiar",
    bn: "হাতিয়ার",
    en: "The tools",
    parts: [
      {
        slug: "helpers",
        n: 8,
        bn: "শক্তির সাহায্যকারী: can, want to, have to, should",
        en: "The power helpers",
        icon: "key",
        minutes: 9,
        blurb:
          "ছোট শব্দ, বিরাট শক্তি। এদের পরে ক্রিয়া সবসময় সাধারণ থাকে, আর ভদ্র বাক্যগুলো দরজা খুলে দেয়।",
      },
      {
        slug: "questions",
        n: 9,
        bn: "প্রশ্নের ছয়টা চাবি আর প্রশ্ন-মেশিন",
        en: "The question words",
        icon: "question",
        minutes: 8,
        blurb:
          "যে মানুষ প্রশ্ন করতে পারে, সে যেকোনো জায়গায় যেকোনো কিছু শিখে নিতে পারে। চারটা খোপ ভরলেই যেকোনো প্রশ্ন তৈরি।",
      },
      {
        slug: "glue",
        n: 10,
        bn: "আঠা-শব্দ: in · on · at আর a · an · the",
        en: "The glue words",
        icon: "glue",
        minutes: 9,
        blurb:
          "বাংলায় এগুলো নেই বলেই কঠিন লাগে। ছবি দিয়ে মনে রাখো, নিয়ম দিয়ে নয়, আর দ্বিধা হলেও থেমো না।",
      },
    ],
  },
  {
    id: "rojkar-jibon",
    bn: "রোজকার জীবন",
    en: "Real life",
    parts: [
      {
        slug: "sentence-bank",
        n: 11,
        bn: "বাক্যভাণ্ডার: ঘর, বাজার, ডাক্তার, ফোন, পথ, মানুষ",
        en: "The sentence bank",
        icon: "basket",
        minutes: 12,
        blurb:
          "এই সপ্তাহে যে বাক্যগুলো সত্যিই লাগবে, ছয় জায়গার জন্য বাছা। মুখস্থ নয়, ব্যবহার করার জন্য।",
      },
      {
        slug: "from-the-heart",
        n: 12,
        bn: "নিজের কথা: বর্ণনা, দিনের গল্প, মতামত",
        en: "Speak from the heart",
        icon: "heart",
        minutes: 10,
        blurb:
          "এবার নকল বন্ধ, নিজে বানানো শুরু। পাঁচ প্রশ্নে একটা অনুচ্ছেদ, আর রাতে নিজের দিনটা জোরে বলা।",
      },
      {
        slug: "the-plan",
        n: 13,
        bn: "রোজকার এক ঘণ্টা, ত্রিশ দিনের মানচিত্র, সাত ভুল",
        en: "The plan",
        icon: "map",
        minutes: 9,
        blurb:
          "দিনে এক ঘণ্টা কীভাবে ভাগ করবে, ত্রিশ দিনে কোথায় পৌঁছাবে, আর যে সাতটা ভুল সবাই করে।",
      },
    ],
  },
];

/* ------------------------------------------------------------
   টার্ম ২: the intermediate course. Seventeen parts, ninety days.
   ------------------------------------------------------------ */
const TERM_2_SECTIONS: Section[] = [
  {
    id: "vab-jora",
    bn: "ভাব জোড়া",
    en: "Joining ideas",
    parts: [
      {
        slug: "joining",
        n: 1,
        bn: "ভাব জোড়া: and থেকে although",
        en: "Joining ideas",
        icon: "link",
        minutes: 10,
        blurb:
          "ছোট বাক্য ভুল নয়, শুধু ছোট। জোড়া দিতে শিখলে তিন বাক্যের কথা এক বাক্যে বলা যায়, আর বক্তা বড় হয়ে যায়।",
      },
      {
        slug: "present-perfect",
        n: 2,
        bn: "সেতু-কাল: have done",
        en: "The bridge tense",
        icon: "bridge",
        minutes: 11,
        blurb:
          "যে অতীত এখনো ফুরায়নি। বাংলায় আলাদা রূপ নেই বলেই এটা সবচেয়ে বেশি এড়িয়ে যাওয়া কাল, আর সবচেয়ে বেশি কাজে লাগে।",
      },
      {
        slug: "time-layers",
        n: 3,
        bn: "সময়ের ভিতরে সময়: had done, used to",
        en: "Time inside time",
        icon: "layers",
        minutes: 10,
        blurb:
          "অতীতের আগের অতীত, কতক্ষণ ধরে চলছিল, আর আগে যা করতাম কিন্তু এখন করি না।",
      },
      {
        slug: "twelve-boxes",
        n: 4,
        bn: "বারোটা ঘর: এক ক্রিয়া, গোটা সময়",
        en: "The whole map",
        icon: "grid",
        minutes: 9,
        blurb:
          "তিন কাল, চার রূপ। এক পাতায় পুরো মানচিত্র, আর একই সন্ধ্যার গল্প বারো রকমে বলা।",
      },
    ],
  },
  {
    id: "kolpona",
    bn: "কল্পনা, নিশ্চয়তা, দৃষ্টি",
    en: "Imagining and hedging",
    parts: [
      {
        slug: "if",
        n: 5,
        bn: "চার রকম if",
        en: "If",
        icon: "fork",
        minutes: 11,
        blurb:
          "সত্যি, সম্ভব, অবাস্তব আর আফসোস। if-এর দূরত্বটাই বলে দেয় তুমি কতটা সত্যি ভাবছ।",
      },
      {
        slug: "certainty",
        n: 6,
        bn: "নিশ্চয়তার সিঁড়ি আর আফসোসের ব্যাকরণ",
        en: "Certainty and regret",
        icon: "gauge",
        minutes: 10,
        blurb:
          "must থেকে might থেকে can't: কতটা নিশ্চিত, সেটা একটা শব্দেই বলা যায়। আর পিছন ফিরে: should have।",
      },
      {
        slug: "passive",
        n: 7,
        bn: "কর্তা হারিয়ে গেলে: passive",
        en: "When the doer vanishes",
        icon: "flip",
        minutes: 10,
        blurb:
          "কে করল তা জানা নেই, বা জরুরি নয়। খবর, নিয়ম আর অফিসের ভাষা এখানেই থাকে।",
      },
      {
        slug: "reported",
        n: 8,
        bn: "কথা বহন করা: he said that…",
        en: "Carrying words",
        icon: "quote",
        minutes: 10,
        blurb:
          "অন্যের কথা নিজের মুখে আনা। কাল এক ধাপ পিছিয়ে যায়, আর say আর tell গুলিয়ে ফেলা বন্ধ হয়।",
      },
    ],
  },
  {
    id: "bakko-vitore",
    bn: "বাক্যের ভিতরে বাক্য",
    en: "Sentences inside sentences",
    parts: [
      {
        slug: "relatives",
        n: 9,
        bn: "who · which · that: এক বাক্যের ভিতরে আরেকটা",
        en: "Relative clauses",
        icon: "nest",
        minutes: 10,
        blurb:
          "দুটো বাক্য বলে থেমে যাওয়ার বদলে একটাকে অন্যটার ভিতরে বসানো। দুটো কমা পুরো মানে বদলে দেয়।",
      },
      {
        slug: "ing-or-to",
        n: 10,
        bn: "-ing নাকি to?",
        en: "-ing or to?",
        icon: "branch",
        minutes: 9,
        blurb:
          "কিছু ক্রিয়া -ing চায়, কিছু চায় to। হিসাব করে নয়, কানে শুনে ঠিক করার জিনিস।",
      },
      {
        slug: "phrasal-verbs",
        n: 11,
        bn: "রোজ শোনা ত্রিশটা phrasal verb",
        en: "Phrasal verbs",
        icon: "puzzle",
        minutes: 10,
        blurb:
          "give up, find out, look after: বইয়ের ইংরেজি আর মানুষের ইংরেজির মাঝের দূরত্বটা এখানেই।",
      },
      {
        slug: "collocation",
        n: 12,
        bn: "যে শব্দগুলো একসাথে থাকে",
        en: "Words that live together",
        icon: "pair",
        minutes: 9,
        blurb:
          "'do a mistake' ব্যাকরণে ভুল নয়, তবু কানে লাগে। জোড়াগুলো শিখলে ইংরেজি হঠাৎ স্বাভাবিক শোনায়।",
      },
    ],
  },
  {
    id: "sur-o-dorgho",
    bn: "সুর, দৈর্ঘ্য আর শব্দ",
    en: "Tone, length and sound",
    parts: [
      {
        slug: "register",
        n: 13,
        bn: "এক কথা, তিন সুর",
        en: "Tone and distance",
        icon: "tone",
        minutes: 9,
        blurb:
          "বন্ধু, অফিস, দরখাস্ত: একই কথা তিন রকম দূরত্বে। আর শিক্ষিত মানুষ কীভাবে নরম করে দ্বিমত করে।",
      },
      {
        slug: "holding-the-floor",
        n: 14,
        bn: "দুই মিনিট ধরে বলা",
        en: "Holding the floor",
        icon: "mouth",
        minutes: 9,
        blurb:
          "উত্তর ছোট হয়ে যাওয়া মানে ভাষা কম নয়, কাঠামো কম। দুই মিনিটের একটা আকার আছে, আর ভাবার সময় বলার শব্দও আছে।",
      },
      {
        slug: "big-ideas",
        n: 15,
        bn: "বড় ভাবনা বলা: তর্ক, তুলনা, গল্প",
        en: "Speaking complex ideas",
        icon: "star",
        minutes: 11,
        blurb:
          "যুক্তি দেওয়া আর মেনে নেওয়া, তুলনা আর অনুমান, আর একটা গল্প যেভাবে শোনার মতো হয়।",
      },
      {
        slug: "sound",
        n: 16,
        bn: "স্ট্রেস আর ফ্লো: কেন ওদের ইংরেজি এত দ্রুত শোনায়",
        en: "Sound and flow",
        icon: "wave",
        minutes: 9,
        blurb:
          "জোর কোথায় পড়ে সেটাই মানে বদলে দেয়। আর শব্দগুলো জোড়া লেগে যায় বলেই দ্রুত শোনায়, দ্রুত বলা হয় বলে নয়।",
      },
      {
        slug: "ninety-days",
        n: 17,
        bn: "নব্বই দিনের পরিকল্পনা আর সাতটা দেয়াল",
        en: "The 90-day plan",
        icon: "map",
        minutes: 10,
        blurb:
          "তিন পর্বে নব্বই দিন, কী শুনবে আর কী পড়বে, খাতা কীভাবে রাখবে, আর যে সাত জায়গায় সবাই আটকায়।",
      },
    ],
  },
];

/* ------------------------------------------------------------
   THE LADDER, two terms.

   Thirteen parts then seventeen. Term One is the whole of
   spoken survival English and carries the thirty-day book;
   Term Two is everything that turns survival into speech worth
   listening to, and carries no book at all. That absence is a
   decision, not a gap: by then the daily page stops being a form
   to fill in and becomes the two minutes you record and the
   article you read out loud. `chorcha` says so on the page.
   ------------------------------------------------------------ */
export const TERMS: Term[] = [
  {
    slug: "term-1",
    kicker: "টার্ম ১",
    bn: "শুরু থেকে",
    en: "Term One · From the beginning",
    icon: "seed",
    who: "যিনি ইংরেজি বোঝেন একটু, কিন্তু মুখ খুলতে পারেন না",
    blurb:
      "শব্দের ক্রম, am/is/are, have, তিন কাল, সাহায্যকারী শব্দ, প্রশ্ন আর রোজকার বাক্য। মুখস্থ নয়, কাঠামো।",
    can:
      "তেরোটা পর্ব শেষে: নিজের পরিচয়, পরিবার, রোজকার কাজ, কালকের গল্প আর আগামীকালের পরিকল্পনা ইংরেজিতে বলতে পারবেন, আর পাঁচ মিনিট কথা চালিয়ে নিতে পারবেন।",
    minutes: [45, 60],
    status: "live",
    workbook: { slug: "workbook", days: 30 },
    sections: TERM_1_SECTIONS,
  },

  {
    slug: "term-2",
    kicker: "টার্ম ২",
    bn: "ভাব বহন",
    en: "Term Two · Carrying ideas",
    icon: "ladder",
    who: "যিনি সহজ বাক্য বলতে পারেন, কিন্তু কথা ছোট হয়ে যায়",
    blurb:
      "জোড়া দেওয়া, perfect কাল, if, passive, reported speech, phrasal verb, সুর আর দুই মিনিট ধরে বলা।",
    can:
      "সতেরোটা পর্ব শেষে: দুই মিনিট একটানা বলতে পারবেন, যুক্তি দিয়ে দ্বিমত করতে পারবেন, আর অনুবাদ না করে সরাসরি ইংরেজিতে ভাবতে শুরু করবেন।",
    minutes: [60, 75],
    status: "live",
    chorcha:
      "এই টার্মে ভরাট করার খাতা নেই। রোজকার কাজ তিনটে: দুই মিনিট নিজেকে রেকর্ড করা, একটা সত্যিকারের লেখা জোরে পড়া, আর নতুন জোড়া-শব্দ নিজের খাতায় তোলা।",
    sections: TERM_2_SECTIONS,
  },
];

/* ------------------------------------------------------------
   THE SCHOOL
   ------------------------------------------------------------ */
export const SCHOOL: School = {
  id: "english",
  mount: "/english/",
  bn: "মন থেকে ইংরেজি",
  en: "English From The Heart",
  tagline: "মুখস্থ নয়, কাঠামো। একটা ছাঁচ শিখুন, তারপর নিজের হাজারটা বাক্য বানান।",
};

/* ------------------------------------------------------------
   URLs, ids and sums

   Nothing below assumes there are two terms or that a term has
   a workbook, so adding a third is a matter of adding it to the
   array above.
   ------------------------------------------------------------ */

/** A term's ladder URL. */
export const termUrl = (term: Term): string => `/english/${term.slug}`;

/** A part's page URL. */
export const partUrl = (term: Term, part: Part): string =>
  `/english/${term.slug}/${part.slug}.html`;

/** Progress is stored per part under a stable id. */
export const partId = (term: Term, part: Part): string => `${term.slug}/${part.slug}`;

/** And per workbook day, under one that cannot collide with it. */
export const dayId = (term: Term, n: number): string => `${term.slug}/day-${n}`;

/** The practice book's URL, or null for a term without one. */
export const workbookUrl = (term: Term): string | null =>
  term?.workbook ? `/english/${term.slug}/${term.workbook.slug}` : null;

/** Bangla numerals, for a page that is Bangla throughout. */
export const bnNum = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

/** "পর্ব ৫", the label on a card and in a page's eyebrow. */
export const partLabel = (part: Part): string => `পর্ব ${bnNum(part.n)}`;

/** Parts of one term, flattened, in order. */
export const termParts = (term: Term): LadderPart[] =>
  term.sections.flatMap((section) =>
    section.parts.map((part) => ({
      ...part,
      term,
      section,
      id: partId(term, part),
      url: partUrl(term, part),
      label: partLabel(part),
      status: part.status ?? "live",
    }))
  );

/** Flat list of every part in the school. */
export const allParts = (): LadderPart[] => TERMS.flatMap(termParts);

/** How many parts a term has, and how many are written. */
export const termCount = (term: Term): { total: number; live: number } => {
  const parts = termParts(term);
  return { total: parts.length, live: parts.filter((p) => p.status === "live").length };
};

/** Total reading time of a term, in minutes. */
export const termMinutes = (term: Term): number =>
  termParts(term).reduce((sum, p) => sum + (p.minutes ?? 0), 0);

/** Days of practice the school ships, counted from the terms
    that actually have a book rather than declared anywhere. */
export const totalDays = (): number =>
  TERMS.reduce((n, t) => n + (t.workbook?.days ?? 0), 0);

/** Find a term by slug. */
export const findTerm = (slug: string): Term | undefined =>
  TERMS.find((t) => t.slug === slug);

/** Find a part (and its term) from a URL path. */
export const findByPath = (path: string): LadderPart | undefined =>
  allParts().find((p) => p.url === path || p.url === `${path}.html`);
