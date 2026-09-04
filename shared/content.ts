/* ============================================================
   content.ts: the site's content manifest. The menu, the Ctrl+K
   palette, the sitemap, the RSS feed and every number this site
   says about itself read from here.

   `scripts/build-modules.ts` compiles this file to
   `aab/content.js`, which `sw.js` precaches by name. Edit this
   file, never that one. It also rebases the four ladder imports
   from `./curricula/<school>.ts` on to `/money/curriculum.js` and
   its three siblings, which is where the browser fetches them.
   ============================================================ */

/** The site's own facts, stated once. */
export interface Site {
  name: string;
  tagline: string;
  origin: string;
  email: string;
  linkedin: string;
}

export const SITE: Site = {
  name: "Reiad's Library",
  tagline: "Finance & Bangladesh markets",
  origin: "https://reiad.co.uk",
  email: "i@reiad.co.uk",
  linkedin: "https://www.linkedin.com/in/reiad",
};

/* ---------- the three reading sections ----------

   Empty, and that is the finished state rather than a gap: a
   piece is a row in D1, written in the Studio and rendered by its
   route. Nothing needs adding here to publish.

   Still exported because `pieces.js` merges them with the
   database and needs a shape either way, and because a section is
   a real thing with a mount, a language and a hub whether or not
   anything is written in it.
   ============================================================ */

export const ARTICLES: FilePiece[] = [];

/* ============================================================
   The Learn area. The money curriculum lives in
   shared/curricula/money.ts and is re-exported here so the menu,
   the palette and build-meta.ts have a single import.

   TERM_GROUPS below is the eighteen-term grouping the published
   /money/terms/ URLs were built around. It is the same data as
   stage `basics-1`: THE LADDER IS THE SOURCE OF TRUTH for the
   structure, this for the term cards.
   ============================================================ */
import {
  STAGES, SCHOOLS, allLessons, stageLessons, stageUrl, lessonUrl, findStage,
} from "./curricula/money.ts";

/* The second school, imported here so the menu, the palette and
   build-meta.ts still have a single import. */
import {
  STUFEN, SCHOOL as DEUTSCH, allTeile, stufeUrl, teilUrl, workbookUrl,
} from "./curricula/deutsch.ts";

/* The third school. THE ALIASES ARE LOAD-BEARING: /money/ already
   exports a `lessonUrl` and an `allLessons`, and importing this
   school's under those names would silently shadow them. */
import {
  DHAPS, SCHOOL as QURAN, allLessons as allDars,
  dhapUrl, lessonUrl as darsUrl, totalDays as quranDays,
} from "./curricula/quran.ts";

/* The fourth school. Same reason for the alias: /deutsch/ already
   exports a `workbookUrl`, and shadowing it would point the
   German practice books at the English one. */
import {
  TERMS as ENGLISH_TERMS, SCHOOL as ENGLISH, allParts,
  termUrl, partUrl, workbookUrl as englishBookUrl,
} from "./curricula/english.ts";

// re-exported, because `export … from` alone would not give this
// file the local bindings that searchIndex() below needs
export { STAGES, SCHOOLS, allLessons, stageLessons, stageUrl, lessonUrl, findStage };
export { STUFEN, DEUTSCH, allTeile, stufeUrl, teilUrl, workbookUrl };
export { DHAPS, QURAN, allDars, dhapUrl, darsUrl, quranDays };
export { ENGLISH_TERMS, ENGLISH, allParts, termUrl, partUrl, englishBookUrl };

/** One entry of the A-Z glossary, as the term cards draw it. */
export interface Term {
  slug: string;
  bn: string;
  en: string;
  blurb: string;
}

export interface TermGroup {
  id: string;
  bn: string;
  en: string;
  terms: Term[];
}

/** A term with the group it came out of, for a flat list. */
export interface FlatTerm extends Term {
  group: string;
  title: string;
}

export const TERM_GROUPS: TermGroup[] = [
  {
    id: "basics",
    bn: "বাজারের মূল কথা",
    en: "Market basics",
    terms: [
      { slug: "share", bn: "শেয়ার", en: "Share / Stock",
        blurb: "কোম্পানির মালিকানার ছোট্ট একটা টুকরা: শেয়ার কিনলে আপনি ওই ব্যবসার আংশিক মালিক।" },
      { slug: "dse", bn: "ঢাকা স্টক এক্সচেঞ্জ", en: "DSE",
        blurb: "বাংলাদেশের সবচেয়ে বড় শেয়ারবাজার: যেখানে ক্রেতা আর বিক্রেতার অর্ডার মিলিয়ে দেওয়া হয়।" },
      { slug: "dsex", bn: "সূচক", en: "Index / DSEX",
        blurb: "পুরো বাজারের হালচাল এক নম্বরে: DSEX বাড়লে বোঝায় বড় কোম্পানিগুলোর দাম মোটের ওপর বেড়েছে।" },
      { slug: "bo-account", bn: "বিও অ্যাকাউন্ট", en: "BO Account",
        blurb: "শেয়ারবাজারে ঢোকার টিকিট: আপনার শেয়ার ইলেকট্রনিকভাবে জমা থাকে এই অ্যাকাউন্টে।" },
      { slug: "broker", bn: "ব্রোকার", en: "Broker",
        blurb: "আপনার আর শেয়ারবাজারের মাঝখানের লাইসেন্সধারী মধ্যস্থতাকারী, অর্ডার যায় এদের মাধ্যমে।" },
      { slug: "ipo", bn: "আইপিও", en: "IPO",
        blurb: "কোনো কোম্পানি প্রথমবারের মতো সাধারণ মানুষের কাছে শেয়ার বেচে বাজারে তালিকাভুক্ত হওয়া।" },
    ],
  },
  {
    id: "instruments",
    bn: "বিনিয়োগের মাধ্যম",
    en: "Ways to invest",
    terms: [
      { slug: "mutual-fund", bn: "মিউচুয়াল ফান্ড", en: "Mutual Fund",
        blurb: "অনেকের টাকা এক করে পেশাদার ম্যানেজারের হাতে বিনিয়োগ, ছোট টাকায় বড় পোর্টফোলিওর স্বাদ।" },
      { slug: "sanchayapatra", bn: "সঞ্চয়পত্র", en: "Savings Certificate",
        blurb: "সরকারের কাছে টাকা ধার দেওয়া: বাংলাদেশের সবচেয়ে জনপ্রিয় নিরাপদ সঞ্চয়ের মাধ্যম।" },
      { slug: "bond", bn: "বন্ড", en: "Bond",
        blurb: "কোম্পানি বা সরকারকে ধার দেওয়ার দলিল: মালিকানা না, পাওনাদারি।" },
      { slug: "fdr", bn: "এফডিআর", en: "Fixed Deposit (FDR)",
        blurb: "ব্যাংকে নির্দিষ্ট মেয়াদে টাকা রেখে নির্দিষ্ট হারে মুনাফা, সহজ, পরিচিত, কিন্তু সীমিত।" },
    ],
  },
  {
    id: "analysis",
    bn: "কোম্পানি বিশ্লেষণ",
    en: "Company analysis",
    terms: [
      { slug: "dividend", bn: "ডিভিডেন্ড", en: "Dividend",
        blurb: "কোম্পানির লাভ থেকে শেয়ারহোল্ডারদের দেওয়া ভাগ, নগদ টাকায় বা বোনাস শেয়ারে।" },
      { slug: "eps", bn: "ইপিএস", en: "EPS",
        blurb: "প্রতি শেয়ারে কোম্পানির আয়: কোম্পানির লাভকে শেয়ার সংখ্যা দিয়ে ভাগ করলে যা পাওয়া যায়।" },
      { slug: "pe-ratio", bn: "পিই রেশিও", en: "P/E Ratio",
        blurb: "শেয়ারের দাম তার আয়ের কত গুণ: দামটা সস্তা না চড়া, তার প্রথম আন্দাজ।" },
      { slug: "nav", bn: "এনএভি", en: "NAV",
        blurb: "ফান্ড বা কোম্পানির সম্পদ থেকে দায় বাদ দিলে প্রতি ইউনিটে যা থাকে, 'আসল' মূল্যের হিসাব।" },
    ],
  },
  {
    id: "risk",
    bn: "ঝুঁকি ও কৌশল",
    en: "Risk & strategy",
    terms: [
      { slug: "risk-return", bn: "ঝুঁকি ও রিটার্ন", en: "Risk & Return",
        blurb: "বেশি লাভের আশা মানেই বেশি লসের সম্ভাবনা: বিনিয়োগের সবচেয়ে সৎ নিয়ম।" },
      { slug: "diversification", bn: "ডাইভারসিফিকেশন", en: "Diversification",
        blurb: "সব ডিম এক ঝুড়িতে না রাখা: এক জায়গার লস যেন অন্য জায়গার লাভে সামাল দেওয়া যায়।" },
      { slug: "inflation", bn: "মূল্যস্ফীতি", en: "Inflation",
        blurb: "টাকার নীরব ক্ষয়: অঙ্ক একই থাকলেও কেনার ক্ষমতা প্রতি বছর একটু করে কমে।" },
      { slug: "compounding", bn: "চক্রবৃদ্ধি", en: "Compounding",
        blurb: "মুনাফার ওপর মুনাফা: সময় যত লম্বা, টাকার বাড়া তত দ্রুত। ধৈর্যের পুরস্কার।" },
    ],
  },
];

/** Flat list of every term. */
export const TERMS: FlatTerm[] = TERM_GROUPS.flatMap((g) =>
  g.terms.map((t) => ({ ...t, group: g.id, title: `${t.bn} (${t.en})` }))
);

/* ============================================================
   SKILLS: the schools under the header's one "Skills" word.

   Everything about a school is described HERE, once. Add one
   entry and it appears in the dropdown, on /skills/, in the
   overlay menu and in the sitemap; no HTML has to be edited.

   `slug` is the anchor on /skills/, `icon` is a key in
   /money/icons.js, `note` is what still has to be written for a
   school marked "soon".
   ============================================================ */

/** A school on /skills/. `course` marks the ones with a ladder. */
export interface Skill {
  slug: string;
  bn: string;
  en: string;
  icon: string;
  status: "live" | "soon";
  blurb: string;
  /** Absent for a school that has not been built: `skillUrl()`
      sends it to its slot on /skills/ instead. */
  url?: string;
  note?: string;
  course?: boolean;
}

export const SKILLS: Skill[] = [
  {
    slug: "money",
    course: true,
    bn: "টাকা ও শেয়ার",
    en: "Money",
    url: "/money",
    icon: "coins",
    status: "live",
    blurb: "বিও অ্যাকাউন্ট খোলা থেকে নিজে একটা কোম্পানি যাচাই করা পর্যন্ত, ধাপে ধাপে সাজানো। "
      + "সবচেয়ে বড় স্কুল, আর শুরুটা একদম শূন্য থেকে।",
  },
  {
    slug: "deutsch",
    course: true,
    bn: "জার্মান",
    en: "Deutsch · German",
    url: "/deutsch",
    icon: "book",
    status: "live",
    blurb: "চারটা স্তরে জার্মান, বাংলা দিয়ে বোঝানো, আর রোজ এক পাতার অনুশীলন খাতা।",
  },
  {
    slug: "quran",
    course: true,
    bn: "কুরআনের আরবি",
    en: "Qur'anic Arabic",
    url: "/quran",
    icon: "scroll",
    status: "live",
    blurb: "তিন ধাপে ষাট দিন: শব্দ চেনা, বাক্য বোঝা, তারপর গোটা সূরা খুলে পড়া।",
  },
  {
    slug: "english",
    course: true,
    bn: "মন থেকে ইংরেজি",
    en: "English From The Heart",
    url: "/english",
    icon: "signpost",
    status: "live",
    blurb: "দুই টার্মে ইংরেজি: শব্দের ক্রম থেকে দুই মিনিট টানা বলা পর্যন্ত, সাথে ৩০ দিনের খাতা।",
  },
  {
    slug: "cooking",
    bn: "রান্না",
    en: "Cooking",
    url: "/cooking",
    icon: "cart",
    status: "live",
    blurb: "মাপ, তাপ আর সময়: রেসিপি মুখস্থ না করে রান্নাটা বোঝা। ধাপে ধাপে কোর্স নয়, একেকটা উপকরণ নিয়ে পুরো একটা লেখা।",
  },
  {
    slug: "travel",
    bn: "ভ্রমণ",
    en: "Travel",
    url: "/travel",
    icon: "compass",
    status: "live",
    blurb: "ভিসা, কাগজপত্র আর প্রথমবার দেশের বাইরে যাওয়ার পুরো ধাপ। কোর্স নয়, একেকটা বিষয় নিয়ে পুরো একটা লেখা।",
  },
  {
    slug: "reviews",
    bn: "রিভিউ",
    en: "Reviews",
    icon: "magnifier",
    status: "soon",
    blurb: "বই, কোর্স, অ্যাপ আর যন্ত্রপাতি: কেনার আগে সৎ একটা মতামত।",
    note: "প্রথম কয়েকটা রিভিউ লেখা হচ্ছে।",
  },
];

/** The schools that actually exist, for anything that links out. */
export const liveSkills = (): Skill[] => SKILLS.filter((s) => s.status === "live");

/* ============================================================
   The courses. A course is a ladder: stages, a record of what you
   have read, and a next. The kitchen and the travel desk are not
   ladders, because a piece has no next.

   DERIVED FROM `SKILLS`, never written out again: this list is
   read by the home page's band, the keys `sync.js` carries, the
   rows the account page counts and the options in the account
   setup form, and a second copy is money listed twice.

   `id` is the same word the progress store and `sync.js` use as a
   key prefix: `learn-read`, `deutsch-days`, `english-last`,
   `quran-done`. One name from localStorage through to the
   `following` column in Postgres.
   ============================================================ */

/** A course is a ladder: it has stages, it keeps what you have
    read, and it can tell you what comes next. */
export interface Course {
  id: string;
  bn: string;
  en: string;
  url?: string;
  icon: string;
  blurb: string;
}

export const COURSES: Course[] = [
  ...SKILLS.filter((s) => s.course).map((s) => ({
    id: s.slug,
    bn: s.bn,
    en: s.en,
    url: s.url,
    icon: s.icon,
    blurb: s.blurb,
  })),
];

export const findCourse = (id: string): Course | null =>
  COURSES.find((c) => c.id === id) ?? null;

/** Where a skill points: its own school, or its slot on /skills/. */
export const skillUrl = (s: Skill): string =>
  s.url || `/skills#${s.slug}`;

/* ============================================================
   Calculators on /tools/
   ============================================================ */

/** One calculator on the Tools hub, by the id its section carries. */
export interface Tool {
  id: string;
  bn: string;
  en: string;
  blurb: string;
}

export const TOOLS: Tool[] = [
  { id: "compounding", bn: "চক্রবৃদ্ধি ক্যালকুলেটর", en: "Compounding & monthly saving",
    blurb: "What a monthly habit becomes over years, and how much of it is growth rather than your own money." },
  { id: "sanchayapatra", bn: "সঞ্চয়পত্র বনাম এফডিআর", en: "Sanchayapatra vs. FDR",
    blurb: "Two safe options, side by side, after tax at source." },
  { id: "inflation", bn: "মূল্যস্ফীতির হিসাব", en: "Inflation & real return",
    blurb: "What your money is actually worth later, and whether a return beats inflation at all." },
  { id: "emi", bn: "কিস্তির হিসাব", en: "Loan EMI",
    blurb: "Monthly instalment, total interest, and what a shorter term saves you." },
  { id: "position", bn: "ঝুঁকি ও পজিশন সাইজ", en: "Position sizing",
    blurb: "How many shares a rule about maximum loss actually allows you to buy." },
];

/* ============================================================
   THE READING SECTIONS: Insights, the kitchen, and travel. Three
   places holding PIECES rather than lessons, and deliberately NOT
   schools: a piece about onions is not a rung on a ladder.

   All three hold the same shape, so everything else reads
   `SECTIONS` rather than the three names: the hub pages, the
   palette, the sitemap, the Studio's destination picker and the
   desk's "move it somewhere else". A fourth section is an entry
   here and a hub page, and nothing else.

   `topics` is several on purpose: a piece about visa paperwork is
   about travel AND about money, and one label cannot say that.
   ============================================================ */

/** A piece published as a committed file rather than a row. */
export interface FilePiece {
  slug: string;
  title: string;
  en?: string;
  dek?: string;
  tag?: string;
  topics?: string[];
  date?: string;
  minutes?: number;
  lang?: string;
  status?: string;
  note?: string;
}

/** A place a piece can live: /insights/, /cooking/, /travel/. */
export interface Section {
  id: string;
  en: string;
  bn: string;
  /** The URL prefix its pieces are served at, with both slashes. */
  mount: string;
  /** The page that lists them. */
  hub: string;
  /** The name of the array in THIS file that holds them. */
  list: string;
  lang: string;
  /** One line saying what goes here, shown under the picker. */
  blurb: string;
  pieces: () => FilePiece[];
}

export const COOKING: FilePiece[] = [];

export const TRAVEL: FilePiece[] = [];

/* `pieces` is a FUNCTION rather than the array, because ARTICLES
   is declared at the top of this file and these two just above:
   a direct reference breaks the day one of them moves. */
export const SECTIONS: Section[] = [
  {
    id: "insights",
    en: "Insights",
    bn: "ইনসাইটস",
    mount: "/insights/",
    hub: "/insights",
    /* The Studio prints this into the index entry it hands you,
       so the paste has somewhere to go. */
    list: "ARTICLES",
    lang: "en",
    blurb: "Longer pieces on money, markets and Bangladesh.",
    pieces: () => ARTICLES,
  },
  {
    id: "cooking",
    en: "Cooking",
    bn: "রান্নাঘর",
    mount: "/cooking/",
    hub: "/cooking",
    list: "COOKING",
    lang: "bn",
    blurb: "রেসিপি নয়, রান্নাটা: একেকটা উপকরণ নিয়ে পুরো একটা লেখা।",
    pieces: () => COOKING,
  },
  {
    id: "travel",
    en: "Travel",
    bn: "ভ্রমণ",
    mount: "/travel/",
    hub: "/travel",
    list: "TRAVEL",
    lang: "bn",
    blurb: "ভিসা, কাগজপত্র আর প্রথমবার দেশের বাইরে যাওয়ার পুরো ধাপ।",
    pieces: () => TRAVEL,
  },
];

/** A section, or the id of one: a caller holding a row has the
    id, a caller holding a picker has the section. */
export type SectionRef = Section | string | null | undefined;

const idOf = (ref: SectionRef): string | null | undefined =>
  typeof ref === "string" ? ref : ref?.id;

/** A section by id, falling back to Insights rather than to
    undefined: an unknown id comes from an old draft or a
    hand-typed URL. */
export const findSection = (id: SectionRef): Section =>
  SECTIONS.find((s) => s.id === idOf(id)) ?? SECTIONS[0];

/** Where a piece lives, whichever section it is in. */
export const pieceUrl = (section: SectionRef, slug: string): string =>
  `${findSection(section).mount}${slug}.html`;

/** The written pieces of a section, newest first. */
export const livePieces = (section: SectionRef): FilePiece[] =>
  findSection(section).pieces()
    .filter((p) => p.status !== "soon")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

/** The two Bangla reading sections, which share a hub layout, a
    cascade layer and a page shape. Insights is in English with
    its own filtering page and feed. */
export const READS = SECTIONS.filter((s) => s.id !== "insights");

/* ============================================================
   Pages: the menu, the palette and the sitemap read this.
   `private: true` keeps a page out of all three.

   `kind` and `short` exist for the case studies and only for
   them, so a case study is described ONCE here rather than in
   every list that draws one. `kind` is read by
   `next/lib/work.ts`, which joins these rows with the drawing and
   the checkable facts a row cannot hold; `short` is the title for
   a list whose heading already says what these are.
   ============================================================ */

/** One entry of the menu, the palette and the sitemap. */
export interface Page {
  title: string;
  url: string;
  hint?: string;
  blurb?: string;
  group?: string;
  /** Kept out of the sitemap, the menu and the palette. */
  private?: boolean;
  kind?: "model" | "analysis" | "research";
  short?: string;
}

export const PAGES: Page[] = [
  { title: "Home", url: "/",
    hint: "Page", blurb: "The short version of everything here." },
  { title: "Money: টাকা ও শেয়ার", url: "/money",
    hint: "Page", blurb: "Start-to-research investing course in plain Bangla, eight stages deep." },
  { title: "Money: সব লেখা এক নজরে", url: "/money/contents",
    hint: "Page", group: "money", blurb: "Every lesson of the money school on one page, plus the A–Z of terms." },
  { title: "Skills: দক্ষতা", url: "/skills",
    hint: "Page", blurb: "Every course here: money, German, Quran, English, cooking and travel." },
  { title: "Deutsch: জার্মান, বাংলায়", url: "/deutsch",
    hint: "Page", blurb: "German from Bangla in four stages, with a daily practice book for the first three." },

  /* One entry per practice book, built from the curriculum rather
     than typed: a hand-written line goes on advertising thirty
     days after a book grows to ninety. */
  ...STUFEN.flatMap((s) => {
    const url = workbookUrl(s);
    return url && s.workbook ? [{
      title: `${s.workbook.days} দিনের অনুশীলন খাতা · Das ${s.workbook.days}-Tage-Arbeitsbuch (${s.kicker})`,
      url,
      hint: "Workbook",
      group: "deutsch",
      blurb: `One page a day for ${s.workbook.days} days: a pattern, five models, eight of your own sentences, six translations, and one true paragraph.`,
    }] : [];
  }),
  { title: "English: মন থেকে ইংরেজি", url: "/english",
    hint: "Page", blurb: "English from Bangla in two terms, from word order to holding the floor for two minutes." },

  /* One entry per practice book, built from the curriculum, for
     the reason the German ones are. */
  ...ENGLISH_TERMS.flatMap((t) => {
    const url = englishBookUrl(t);
    return url && t.workbook ? [{
      title: `${t.workbook.days} দিনের অনুশীলন খাতা · The ${t.workbook.days}-day workbook (${t.kicker})`,
      url,
      hint: "Workbook",
      group: "english",
      blurb: `One page a day for ${t.workbook.days} days: a pattern, five model lines, eight sentences of your own, six to translate, and one true paragraph.`,
    }] : [];
  }),
  { title: "Cooking: রান্নাঘর", url: "/cooking",
    hint: "Page", blurb: "Kitchen writing in Bangla: one ingredient at a time, explained rather than listed." },
  { title: "Travel: ভ্রমণ", url: "/travel",
    hint: "Page", blurb: "Visas, paperwork and the whole route out, in Bangla." },

  /* One entry per piece in both Bangla sections, built from
     SECTIONS, so a new piece reaches the menu, the palette and the
     sitemap by being written and nothing else. */
  ...READS.flatMap((section) =>
    livePieces(section).map((p) => ({
      title: `${p.title} · ${p.en ?? section.en}`,
      url: pieceUrl(section, p.slug),
      hint: section.en,
      group: section.id,
      blurb: p.dek,
    }))),
  { title: "Tools & calculators", url: "/tools",
    hint: "Page", blurb: "Compounding, sanchayapatra vs FDR, inflation, EMI, position sizing." },
  { title: "Stock check: buy, hold or sell", url: "/tools/stock",
    hint: "Tool", group: "tool", blurb: "Forty-odd ratios across six pillars, a verdict that shows its own arithmetic, in English or Bangla." },
  { title: "Live portfolio: a real account, live", url: "/tools/live",
    hint: "Tool", group: "tool", blurb: "The site's own Trading 212 portfolio in percentages, live from the broker, and the full dashboard for your own account when you connect a key." },
  /* A TOOL IN `nav.ts` AND NOT HERE IS IN NO SITEMAP AND NO
     PALETTE: `build-meta.ts` builds the sitemap out of this table
     and Ctrl+K reads it too. The eleven diet pages and the four
     routine pages are one entry each, as `/tools/stock` is,
     because a palette is a way in rather than a contents page. */
  { title: "Diet: what your body is, and what it costs", url: "/tools/diet",
    hint: "Tool", group: "tool", blurb: "Waist to height, BMI on the cut-offs that apply to you, body fat with its error bars, a food log priced in taka and in pounds, and what to expect at each hour of a change." },
  { title: "Routine: the day, and the year behind it", url: "/tools/routine",
    hint: "Tool", group: "tool", blurb: "One day at a time, with the year drawn behind it, so a habit is read off what happened rather than off a streak that only falls." },
  { title: "Insights", url: "/insights",
    hint: "Page", blurb: "Longer pieces, plus an auto-updating pulse of market news." },
  { title: "Three-statement model: interactive case study", url: "/portfolio/three-statement",
    hint: "Case study", group: "case", kind: "model",
    short: "Three-statement model: a listed manufacturer",
    blurb: "A live financial model: edit the assumptions, watch all three statements move." },
  { title: "DCF with sensitivity tables: interactive case study", url: "/portfolio/dcf",
    hint: "Case study", group: "case", kind: "model",
    short: "DCF with two-way sensitivity tables",
    blurb: "A live discounted cash flow: build the WACC, switch terminal value method, read the grid." },
  { title: "Index volatility & drawdowns: interactive case study", url: "/portfolio/dsex",
    hint: "Case study", group: "case", kind: "analysis",
    short: "Index volatility and drawdowns, in Python",
    blurb: "Rolling volatility, drawdowns, tail risk and holding periods, with CSV import." },
  { title: "Portfolio construction: a screened FTSE 250 fund", url: "/portfolio/frontier",
    hint: "Case study", group: "case", kind: "analysis",
    short: "A screened FTSE 250 fund, built and held",
    blurb: "Ten FTSE 250 holdings past a Shariah and sustainability screen, weighted on 2015 and held to 2020, with the frontier and the optimised alternatives solved live alongside." },
  { title: "Probability of default: scorecard vs gradient boosting", url: "/portfolio/scorecard",
    hint: "Case study", group: "case", kind: "analysis",
    short: "Probability of default: scorecard vs boosting",
    blurb: "A live PD model on a public dataset: logistic regression against gradient boosting, cross-validated, calibrated, and priced." },
  { title: "Portfolio stress testing: interactive case study", url: "/portfolio/stress",
    hint: "Case study", group: "case", kind: "model",
    short: "Portfolio stress testing: shocks to capital",
    blurb: "A live credit stress test: macro shocks to default rates through a Merton model and a vintage one, then provisions and capital." },
  { title: "Islamic vs conventional funds: MSc dissertation", url: "/portfolio/dissertation",
    hint: "Case study", group: "case", kind: "research",
    short: "Islamic vs conventional funds: the research",
    blurb: "220 UK funds, 19,577 fund-months, five-factor models, and what a sample of three could actually detect." },
  { title: "Portfolio & services", url: "/portfolio",
    hint: "Page", blurb: "Financial modeling, data analysis and finance writing." },
  { title: "About Rony", url: "/about",
    hint: "Page", blurb: "The route from Chittagong economics to Brighton risk management." },
  { title: "Contact / register interest", url: "/contact",
    hint: "Page", blurb: "For recruiters, clients and readers." },
  { title: "Article Studio: publish a new piece", url: "/studio",
    hint: "Tool", blurb: "Paste an article and its photos, get a finished page.", private: true },
];

/* ============================================================
   COUNTS: every number this site says about itself.

   A number typed into a sentence is a copy of the data and every
   copy drifts, so the sentence gets a slot instead:

       <span data-count="stages">৮</span>টা ধাপ

   app.js fills every [data-count] from this object, in Bangla
   digits inside a [lang="bn"] element. The number in the markup
   is the no-JavaScript fallback, and `check-content.ts` fails the
   build when it disagrees with the value here.

   TWO ARE TYPED: `ratios` and `pillars` belong to
   /tools/stock.model.js, and importing that model here would pull
   a thousand lines of scoring maths into every page to print one
   number. `check-content.ts` asserts them against it instead.

   Deliberately not annotated: the type of this object IS its
   keys, so `COUNTS.stufens` does not compile.
   ============================================================ */
export const COUNTS = {
  /** Case studies you can open and drive. */
  caseStudies: PAGES.filter((p) => p.group === "case" && !p.private).length,
  /** Everything you can open and drive: the case studies plus the
      calculators that are pages of their own, tagged `case` or
      `tool` in PAGES. */
  models: PAGES.filter((p) => !p.private
    && (p.group === "case" || p.group === "tool")).length,
  /** Calculators on the Tools hub, not counting the stock check. */
  calculators: TOOLS.length,
  /** Stages in the money ladder, starter to research. */
  stages: STAGES.length,
  /** Lessons actually written, not the ones still marked
      "soon". */
  lessons: allLessons().filter((l) => l.status === "live").length,
  /* AND THE WHOLE LIBRARY'S, which is NOT `lessons`: that key is
     the money school's alone and understates all four ladders by
     144. Counted rather than added up, so a Stufe written next
     month moves it. */
  libraryLessons: [
    ...allLessons(), ...allTeile(), ...allDars(), ...allParts(),
  ].filter((l) => l.status === "live").length,
  /** Terms in the A-Z glossary. */
  terms: TERM_GROUPS.reduce((n, g) => n + g.terms.length, 0),
  /** German Stufen. */
  stufen: STUFEN.length,
  /** Steps in the Quranic Arabic ladder. */
  dhaps: DHAPS.length,
  /** Days that ladder covers, counted from the lessons rather
      than declared, so a lesson added without a day range moves
      this. */
  quranDays: quranDays(),
  /** Terms in the English ladder. NOT `terms`, which is the A-Z
      glossary's and is printed by 404.html. */
  englishTerms: ENGLISH_TERMS.length,
  /** Parts of the English course actually written. */
  englishParts: allParts().filter((p) => p.status === "live").length,
  /** Stufen that come with a practice book. Not `stufen`: Stufe
      4 deliberately has none. */
  workbooks: STUFEN.filter((s) => s.workbook).length,
  /** Schools in the Skills hub, German included. */
  skills: SKILLS.length,
  /** And the ones a reader can start today. NOT `skills`, which
      counts the one still marked `soon`: a course nobody can open
      is not one. */
  courses: liveSkills().length,
  /* NO COUNT OF PIECES HERE, deliberately: the three arrays in
     this file are empty and a piece is a row, so a key counting
     them would answer 0 on a site with five. Anything needing the
     real count asks `pieces.js`, which asks the database. */
  /** Scored ratios in the stock check. Asserted against METRICS. */
  ratios: 44,
  /** The groups it sorts them into. Asserted against PILLARS. */
  pillars: 6,
};

/** Live articles, newest first. */
export const liveArticles = (): FilePiece[] =>
  ARTICLES.filter((a) => a.status !== "soon")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

/** Every topic chip in use, with counts. */
export const topics = (): Array<{ name: string; count: number }> => {
  const counts = new Map<string, number>();
  liveArticles().forEach((a) =>
    (a.topics ?? []).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
  );
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
};

/** One result in the Ctrl+K palette. `kind` is what SEARCH_GROUPS
    below sorts and names them by.

    Every lesson is in the index, including the ones still marked
    "soon": someone searching for "dissertation" should find the
    place it will be, not nothing. */
export interface SearchEntry {
  title: string;
  url: string;
  hint?: string;
  kind: string;
}

export const searchIndex = (): SearchEntry[] => [
  /* `private` pages are out: search was the one place that
     ignored the flag, and the Article Studio was being offered to
     every reader who typed a matching letter. */
  ...PAGES.filter((p) => !p.private).map((p) => ({
    title: p.title, url: p.url, hint: p.hint,
    kind: p.group === "case" ? "case" : p.group === "tool" ? "tool"
      : p.group === "money" ? "money"
      : p.group === "deutsch" || p.url.startsWith("/deutsch/") ? "deutsch"
      : p.group === "english" || p.url.startsWith("/english/") ? "english"
      : p.group === "cooking" || p.url.startsWith("/cooking/") ? "cooking"
      : p.group === "travel" || p.url.startsWith("/travel/") ? "travel" : "page",
  })),
  ...liveArticles().map((a) => ({
    title: a.title,
    url: `/insights/${a.slug}.html`,
    hint: "Article",
    kind: "writing",
  })),
  ...TOOLS.map((t) => ({
    title: `${t.en}: ${t.bn}`,
    url: `/tools#${t.id}`,
    hint: "Tool",
    kind: "tool",
  })),
  /* `stageUrl()` rather than a second spelling of it. */
  ...STAGES.map((s) => ({
    title: `${s.kicker} · ${s.bn}: ${s.en}`,
    url: stageUrl(s),
    hint: "Stage",
    kind: "money",
  })),
  ...allLessons().map((l) => ({
    title: `${l.bn}: ${l.en}`,
    url: l.url,
    hint: `${l.stage.kicker}`,
    kind: "money",
  })),

  /* German. The German name rides in the title beside the Bangla:
     a learner halfway through reaches for "Klammer" long before
     "বন্ধনী". */
  ...STUFEN.map((s) => ({
    title: `${s.kicker} · ${s.bn}: ${s.de}`,
    url: stufeUrl(s),
    hint: "Stufe",
    kind: "deutsch",
  })),
  ...allTeile().map((t) => ({
    title: `${t.bn} · ${t.de}`,
    url: t.url,
    hint: `${t.stufe.kicker}`,
    kind: "deutsch",
  })),

  /* Qur'anic Arabic. The Arabic name rides beside the Bangla for
     the reason the German one does. */
  ...DHAPS.map((d) => ({
    title: `${d.kicker} · ${d.bn}: ${d.ar}`,
    url: dhapUrl(d),
    hint: "ধাপ",
    kind: "quran",
  })),
  ...allDars().map((l) => ({
    title: `${l.bn} · ${l.ar}`,
    url: l.url,
    hint: `${l.dhap.kicker} · ${l.label}`,
    kind: "quran",
  })),

  /* English, and the English title rides beside the Bangla for
     the same reason. */
  ...ENGLISH_TERMS.map((t) => ({
    title: `${t.kicker} · ${t.bn}: ${t.en}`,
    url: termUrl(t),
    hint: "Term",
    kind: "english",
  })),
  ...allParts().map((p) => ({
    title: `${p.bn} · ${p.en}`,
    url: p.url,
    hint: `${p.term.kicker} · ${p.label}`,
    kind: "english",
  })),

  /* The other schools. A skill still being written is in here on
     purpose. The three that exist are skipped: each already has a
     page entry and every lesson of its own above. */
  ...SKILLS.filter((s) => !["deutsch", "quran", "english", "cooking", "travel"].includes(s.slug)).map((s) => ({
    title: `${s.bn}: ${s.en}`,
    url: skillUrl(s),
    hint: s.status === "soon" ? "Skill · আসছে" : "Skill",
    kind: "skill",
  })),
];

/** The order the palette shows groups in, and what it calls them. */
export const SEARCH_GROUPS: Array<[kind: string, label: string]> = [
  ["page", "Pages"],
  ["tool", "Tools"],
  ["case", "Case studies"],
  ["money", "শেখার লাইব্রেরি · Learn"],
  ["deutsch", "জার্মান · Deutsch"],
  ["quran", "কুরআনের আরবি · Qur'anic Arabic"],
  ["english", "ইংরেজি · English"],
  ["cooking", "রান্না · Cooking"],
  ["travel", "ভ্রমণ · Travel"],
  ["skill", "দক্ষতা · Skills"],
  ["writing", "Writing"],
];

/** "1 August 2026", or "" when a piece has no date yet. */
export function formatDate(iso: string | null | undefined, lang = "en"): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.valueOf())) return "";
  return new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(d);
}

/* ============================================================
   The door: what the front page SAYS. Three headlines, three
   ledes, an eyebrow and the strip of counts under them: `open` is
   a reader who has not answered the audience switch, `learn` and
   `work` are the two that have.

   HERE RATHER THAN IN THE PAGE because a sentence is DATA, and
   data reaches the Android app on its next fetch. In JSX it was
   the one thing on this site the app could not have.

   `mark` is a SUBSTRING of `headline` rather than a second
   string, so the two cannot drift into a sentence that marks
   words it does not contain. `check-content.ts` asserts it, and
   asserts that every count is a key of `COUNTS`.
   ============================================================ */

export interface DoorFact {
  /** A key of `COUNTS`. The number is looked up, never typed. */
  count: keyof typeof COUNTS;
  /** What it counts, in Bangla. */
  label: string;
  /** And in English, which is what `check-content.ts` keys on. */
  en: string;
  /** Where the things it counts actually are: every row of the
      ledger is a link, because a figure a reader cannot follow is
      a boast. */
  href: string;
}

/** One audience's pair of buttons on the front door. All three
    audiences are server-rendered and chosen by `data-hl` before
    the first paint, as the headline is, so nothing waits on
    JavaScript and nothing moves after it. */
export interface DoorWay {
  /** `open`, `learn` or `work`: a key of `DOOR.copy`. */
  when: string;
  go: DoorAction;
  also: DoorAction;
}

export interface DoorAction {
  label: string;
  href: string;
  /** The language of the label, where it is not the page's. */
  lang?: "bn" | "en";
}

export interface DoorCopy {
  headline: string;
  /** The marked words, which must appear inside `headline`. */
  mark: string;
  lede: string;
  /** The language both are written in, for the face. */
  lang: "bn" | "en";
}

export interface Door {
  /** Who is talking. One line, mono, in the accent. */
  eyebrow: string;
  /** Keyed by audience id, plus `open` for nobody in particular. */
  copy: Record<string, DoorCopy>;
  /** What is here, counted and linked. The front page draws these
      as the door's second column. */
  facts: DoorFact[];
  /** One entry per audience, in the same order `copy` is keyed. */
  ways: DoorWay[];
}

export const DOOR: Door = {
  eyebrow: "Rony Reiad · Dhaka / Brighton · CFA L1 candidate",
  copy: {
    open: {
      headline: "টাকা, ভাষা, রান্না আর ভ্রমণ, সবটা বাংলায়।",
      mark: "সবটা বাংলায়",
      /* NOT "উপরের সুইচটা ঘুরিয়ে দিন": the audience switch is at
         the FOOT of the rail, and below 900px the rail is a drawer
         behind a burger, so on a phone it is not on screen. The
         English door is a button under this sentence. */
      lede: "প্রতিটা বিষয় ধরে ধরে বোঝানো, আগে থেকে কিছু জানা লাগে না। কোম্পানি যাচাই "
        + "করা বা কিস্তির হিসাব কষার ব্যবস্থাও আছে। সব ফ্রি, আর পড়তে বা টিক দিতে "
        + "অ্যাকাউন্ট লাগে না।",
      lang: "bn",
    },
    learn: {
      headline: "প্রতিটা কোর্স একদম শুরু থেকে, ব্যাখ্যা বাংলায়।",
      mark: "একদম শুরু থেকে",
      /* No count in the sentence: the ledger states them and the
         library band draws one card per course. */
      lede: "টাকা ও শেয়ার, জার্মান, ইংরেজি আর কুরআনের আরবি: পাঠগুলো একটার পর একটা "
        + "সাজানো। রান্না আর ভ্রমণ নিয়ে আলাদা লেখা আছে। কোন পাঠটা পড়া হয়েছে টিক "
        + "দিয়ে রাখা যায়, অ্যাকাউন্ট ছাড়াই।",
      lang: "bn",
    },
    work: {
      headline: "Financial models, data analysis and finance writing.",
      mark: "Financial models",
      /* No case study is named: this lede sits directly above all
         seven, and naming any is a list to keep in step with a
         list. */
      lede: "The case studies below are working models rather than screenshots: "
        + "open one, change an assumption, and every number downstream of it "
        + "moves. The arithmetic in each is covered by tests.",
      lang: "en",
    },
  },
  /* Five, and each one a WAY IN rather than a numeral. */
  facts: [
    { count: "libraryLessons", label: "পাঠ", en: "lessons written", href: "/skills" },
    /* NOT `courses`, which points at `/skills` and so does the row
       above: five ways in cannot have two going to one place. The
       library band's six cards say it where it can be seen. */
    { count: "terms", label: "শব্দ", en: "terms, A to Z", href: "/money/contents" },
    { count: "caseStudies", label: "কেস স্টাডি", en: "case studies you can drive",
      href: "/portfolio" },
    { count: "calculators", label: "ক্যালকুলেটর", en: "calculators", href: "/tools" },
    { count: "ratios", label: "অনুপাত", en: "ratios in the stock check",
      href: "/tools/stock" },
  ],
  ways: [
    {
      when: "open",
      go: { label: "শেখা শুরু করুন", href: "/skills", lang: "bn" },
      also: { label: "See the work", href: "/portfolio", lang: "en" },
    },
    {
      when: "learn",
      go: { label: "টাকা ও শেয়ার", href: "/money", lang: "bn" },
      also: { label: "সব কোর্স", href: "/skills", lang: "bn" },
    },
    {
      when: "work",
      go: { label: "See the work", href: "/portfolio", lang: "en" },
      also: { label: "Start a project", href: "/contact", lang: "en" },
    },
  ],
};
