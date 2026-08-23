/* ============================================================
   content.ts: the site's content manifest.

   The menu, the Ctrl+K palette, the sitemap, the RSS feed and
   every number this site says about itself read from here.

   ---- where it is served from ----

   `scripts/build-modules.ts` compiles this file to
   `aab/content.js`, which is the address the browser has always
   fetched it from and which `sw.js` precaches by name. Edit this
   file, never that one.

   ---- and the four specifiers that are rewritten ----

   A ladder is `./curricula/<school>.ts` here and
   `/money/curriculum.js` or one of its three siblings in the
   browser, which is the address each has been fetched from for a
   year. The generator rebases the one on to the other, so
   `aab/content.js` names what both the browser and node resolve.
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

   Empty, and that is the finished state rather than a gap.

   A piece of writing on this site is a row in D1, written in the
   Studio, rendered by the Next.js route at its own address, and
   listed on its hub by a query. These three arrays were the other
   half of that: a manifest entry beside a committed HTML file,
   which is how every piece worked before the Studio existed and
   how none of them has worked since 15 August 2026. The files
   went to `archive/` with Stage 11.2 and the entries went with
   them, because a manifest entry pointing at a file that is not
   there is a card and a search result pointing at a 404, which is
   the exact bug `pieces.js` was written to end.

   They are still exported, and `SECTIONS` still names them, for
   two reasons. `pieces.js` merges them with the database and
   would need a shape either way. And a section is a real thing
   with a mount, a language and a hub whether or not anything is
   written in it; this file describes the site's structure, and
   that is the part of it that was never about articles.

   Nothing needs adding here to publish. That is the point.
   ============================================================ */

export const ARTICLES: FilePiece[] = [];

/* ============================================================
   The Learn area.

   The curriculum, every stage, section and lesson, lives in
   shared/curricula/money.ts, which is the one file to edit when
   the money school changes. It is re-exported here so that the
   menu, the palette and build-meta.ts have a single import.

   TERM_GROUPS below is the ORIGINAL eighteen-term grouping, kept
   because /money/terms/*.html and the A–Z glossary were built
   around it and its URLs are published. It is now the same data
   as stage `basics-1` of the ladder; the ladder is the source of
   truth for the structure, this for the term cards.
   ============================================================ */
import {
  STAGES, SCHOOLS, allLessons, stageLessons, stageUrl, lessonUrl, findStage,
} from "./curricula/money.ts";

/* The second school. German has its own ladder for the same
   reason it has its own mount: nothing about ব্রোকার belongs in a
   file about Akkusativ. Both are imported here so the menu, the
   palette and build-meta.ts still have a single import. */
import {
  STUFEN, SCHOOL as DEUTSCH, allTeile, stufeUrl, teilUrl, workbookUrl,
} from "./curricula/deutsch.ts";

/* The third school, and the same argument a third time: nothing
   about ইদাফা belongs in a file about Akkusativ either. The
   aliases are not decoration: /money/ already exports a
   `lessonUrl` and an `allLessons`, and importing this school's
   under the same names would silently shadow them. */
import {
  DHAPS, SCHOOL as QURAN, allLessons as allDars,
  dhapUrl, lessonUrl as darsUrl, totalDays as quranDays,
} from "./curricula/quran.ts";

/* The fourth school, and the same argument a fourth time:
   nothing about phrasal verbs belongs in a file about Akkusativ
   either. The aliases matter for the same reason as the Quranic
   ones: /deutsch/ already exports a `workbookUrl`, and importing
   this school's under that name would silently shadow it, which
   is how the German practice books would have started pointing
   at the English one. */
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
   SKILLS: the second thing this site teaches.

   German was the first non-finance school here, and it went into
   the header as its own link. That does not scale: the next four
   subjects would each want a link too, and a nav bar cannot hold
   eleven. So the header carries one word, "Skills", and this list
   is what sits under it, in the dropdown, on /skills/, and in
   the overlay menu.

   Everything about a school is described HERE, once. Add one
   entry and it appears in all three places plus the sitemap; no
   HTML anywhere has to be edited.

   Fields:
     slug     stable id, used for the anchor on /skills/
     bn / en  the name, in both languages
     url      where it lives, for a school that has been built
     icon     a key in /money/icons.js, see that file's rules
     status   "live" or "soon"
     blurb    one Bangla sentence: what you would actually get
     note     what still has to be written, for a "soon" one
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
   The courses, as opposed to everything else here.

   A course is a ladder: it has stages, it keeps what you have
   read, and it can tell you what comes next. The money ladder at
   /money/ is one, and so are the three schools carrying
   `course: true` above. The kitchen and the travel desk are not:
   they hold pieces, and a piece has no next.

   The distinction already existed in four places (which schools
   the home page's band asks, which keys sync.js carries, which
   rows the account page counts, and which options a reader is
   offered when they set up an account), and in all four it was
   the same four ids written out by hand. This is that list, once.

   `id` is the same word the progress store and sync.js use as a
   key prefix, deliberately: `learn-read`, `deutsch-days`,
   `english-last`, `quran-done`. One name for one course, from
   localStorage through to the `following` column in Postgres.
   ============================================================ */
/* The four schools with a ladder, derived from SKILLS.

   The money school was WRITTEN OUT here as well until 18 August
   2026, under "টাকা ও বিনিয়োগ · The money ladder", a name it
   stopped using when it moved to /money/. SKILLS had gained its
   own entry by then, so this array held money twice: two
   checkboxes carrying one `id` on the account page, two identical
   options in the target form's select, and a bar labelled with
   the old name. Nobody typed a wrong name. The list simply grew
   past the copy, which is the failure at the top of CLAUDE.md. */

/** A course is a ladder: it has stages, it keeps what you have
    read, and it can tell you what comes next. `id` is the same
    word the progress store and `sync.js` use as a key prefix. */
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
   THE READING SECTIONS: Insights, the kitchen, and travel.

   Three places on this site hold PIECES rather than lessons:
   /insights/ in English about money, /cooking/ and /travel/ in
   Bangla about everything else. They are deliberately NOT schools.
   German, Quranic Arabic and English are ladders: stages, lessons,
   a progress store, a resume card. A piece about onions is not a
   rung, and inventing a curriculum for it would mean shipping
   furniture nobody asked for.

   All three hold the SAME SHAPE of thing, so they are described
   once, here, and everything else reads SECTIONS rather than
   knowing the three names: the hub pages, the Ctrl+K palette, the
   sitemap, the Studio's destination picker, and the desk's "move
   it somewhere else" control. Adding a fourth section is an entry
   in SECTIONS and a hub page, and nothing in the Studio or the
   desk has to be edited at all.

   A piece:
     slug     file name inside the section's folder (no .html)
     title    the headline, in whatever language it is written in
     en       the English title of a Bangla piece, for the palette
              and for anyone searching in the other language
     dek      one or two sentences of standfirst
     tag      the small label above the headline
     topics   the chips it can be filtered by. Several, on purpose:
              a piece about visa paperwork is about travel AND
              about money, and one label cannot say that
     date     ISO date, newest first
     minutes  reading time
     lang     "en" or "bn"
     status   "live" or "soon"
     note     what is still being written, for a "soon" one
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

/* The sections themselves. `pieces` is a function rather than the
   array, because ARTICLES is declared at the top of this file and
   these two are declared just above: a direct reference would be
   fine here and would break the day someone moves one of them. */
export const SECTIONS: Section[] = [
  {
    id: "insights",
    en: "Insights",
    bn: "ইনসাইটস",
    mount: "/insights/",
    hub: "/insights",
    /* The name of the array in THIS file. The Studio prints it into
       the index entry it hands you, so the paste has somewhere to
       go without you having to know which list is which. */
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

/** A section, or the id of one. Both are handed in: a caller
    holding a row has the id, a caller holding a picker has the
    section, and neither should have to know which the other wants. */
export type SectionRef = Section | string | null | undefined;

const idOf = (ref: SectionRef): string | null | undefined =>
  typeof ref === "string" ? ref : ref?.id;

/** A section by id, falling back to Insights rather than to
    undefined: an unknown id comes from an old draft or a hand-typed
    URL, and the honest answer is the default section, not a crash. */
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
    cascade layer and a page shape. Insights is the odd one out: it
    is in English, it has its own filtering page and its own feed. */
export const READS = SECTIONS.filter((s) => s.id !== "insights");

/* ============================================================
   Pages: the menu, the palette and the sitemap read this.
   `private: true` keeps a page out of the sitemap and the menu.

   Two fields exist for the case studies, and only for them:

     kind    "model", "analysis" or "research". The home page's
             services cell links a live model beside each service
             it names, and this is how it knows which case study
             belongs beside which line.
     short   a title for a list that already says what these are.
             The full title ends ": interactive case study",
             which reads as a stutter under a heading that says
             "open one and take it apart".

   Both are optional and both are read by home.js. They exist so
   that a case study is described ONCE, here, rather than once
   here and again inside index.html, which is how the home page
   came to be listing three of seven with a trailing line naming
   two of the four it had left out.
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
  /* "/" rather than "/index.html" as of Stage 11.5. That is what
     the canonical link has always said, and it is now the address
     that answers: the file it used to name is a Next.js route and
     `_redirects` sends the old spelling here. */
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
     than typed. There used to be exactly one of these, written out
     by hand, because there used to be exactly one book. Stufe 2
     and 3 then arrived with sixty and ninety days and the hand
     written line would have gone on advertising thirty. */
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

  /* One entry per practice book, built from the curriculum the
     same way the German ones are, and for the same reason: the
     day count belongs to the data, not to a line of markup that
     was right on the day it was typed. */
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
     SECTIONS rather than typed, so a new piece reaches the menu,
     the palette and the sitemap by being written and nothing else. */
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
  /* THE OTHER TWO TOOLS WERE IN NO SITEMAP AND NO PALETTE. Both
     are in `nav.ts`, so the rail and the footer reached them and
     nothing else did: `build-meta.ts` builds the sitemap out of
     this table, and Ctrl+K reads it too. The eleven diet pages
     and the four routine pages are one entry each, the way
     `/tools/stock` is, because a palette is a way in rather than
     a table of contents. */
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

   WHY THIS EXISTS

   A page said "four case studies" while seven existed, another
   said "thirty-eight ratios" where a third said "thirty-odd" and
   a fourth, in Bangla, said "more than thirty-six". All three
   were describing the same file. Nobody wrote a wrong number:
   each was right when it was typed, and then the thing it counted
   grew.

   A number typed into a sentence is a copy of the data, and every
   copy drifts. So the sentence gets a slot instead:

       <span data-count="stages">৮</span>টা ধাপ

   app.js fills every [data-count] on the page from this object,
   in Bangla digits inside a [lang="bn"] element and Latin ones
   everywhere else. The number in the markup is the fallback for
   a reader with no JavaScript, so it should be kept roughly
   right, but it can no longer be the thing that goes stale
   unnoticed: check-content.ts fails the build when it disagrees
   with the value here.

   TWO OF THESE ARE TYPED, and deliberately. `ratios` and
   `pillars` belong to /tools/stock.model.js, and importing that
   whole model here would pull a thousand lines of scoring maths
   into every page on the site to print one number. They are
   asserted against the model by check-content.ts instead, which
   is the same guarantee without the payload.
   ============================================================ */

/* Deliberately not annotated. The type of this object IS its keys,
   so `COUNTS.stufen` is checked and `COUNTS.stufens` does not
   compile, and check-content.ts holds every value to being a
   number where it reads one by a key out of markup. */
export const COUNTS = {
  /** Case studies you can open and drive. */
  caseStudies: PAGES.filter((p) => p.group === "case" && !p.private).length,
  /** Everything you can open and drive: the case studies plus the
      calculators that are pages of their own. Tagged `case` or
      `tool` in PAGES, which is the same tagging the menu and the
      palette group by, so publishing another one moves this
      without anybody editing it. */
  models: PAGES.filter((p) => !p.private
    && (p.group === "case" || p.group === "tool")).length,
  /** Calculators on the Tools hub, not counting the stock check. */
  calculators: TOOLS.length,
  /** Stages in the money ladder, starter to research. */
  stages: STAGES.length,
  /** Lessons actually written, not the ones still marked "soon".

      It used to be 8 higher than the number of lesson PAGES,
      because the starter guide's eight steps were anchors on the
      hub rather than pages of their own. They are pages, the
      stage is no longer `inline`, and the two numbers are the
      same number again. */
  lessons: allLessons().filter((l) => l.status === "live").length,
  /** Terms in the A-Z glossary. */
  terms: TERM_GROUPS.reduce((n, g) => n + g.terms.length, 0),
  /** German Stufen. */
  stufen: STUFEN.length,
  /** Steps in the Quranic Arabic ladder. */
  dhaps: DHAPS.length,
  /** Days that ladder covers, counted from the lessons rather
      than declared. The course promises sixty on its own first
      slide, so a lesson added without a day range moves this. */
  quranDays: quranDays(),
  /** Terms in the English ladder.

      NOT `terms`: that key is already the A-Z glossary's, and
      404.html prints it. Two different things called the same
      word in one object is how a page ends up telling a reader
      there are two entries in the glossary. */
  englishTerms: ENGLISH_TERMS.length,
  /** Parts of the English course actually written. */
  englishParts: allParts().filter((p) => p.status === "live").length,
  /** Stufen that come with a practice book.

      Not the same as `stufen`, and that is the point: Stufe 4
      deliberately has none, because at B2 the daily page stops
      being a form to fill in and becomes the news you read. */
  workbooks: STUFEN.filter((s) => s.workbook).length,
  /** Schools in the Skills hub, German included. */
  skills: SKILLS.length,
  /* No count of pieces here, deliberately, since Stage 11.2.

     There were three: `articles`, `cooking` and `travel`, each
     counting an array in this file. Those arrays are empty now
     and a piece is a row, so every one of them would have
     answered 0 while the site had five. A number that counts the
     wrong thing is worse than no number, and this whole table
     exists because that went wrong twice.

     Anything that needs the real count asks `pieces.js`, which
     asks the database, and prints what it drew. */
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

/** Everything the command palette can jump to.

    Every lesson in every stage is in here, including the ones
    still marked "soon": someone searching for "dissertation"
    should find the place it will be, not nothing. The hint names
    the stage, so a result reads as "মূল্যায়ন: মাঝারি · ধাপ ১"
    and the reader knows how deep they are about to go. */

/** One result in the Ctrl+K palette. `kind` is what SEARCH_GROUPS
    below sorts and names them by. */
export interface SearchEntry {
  title: string;
  url: string;
  hint?: string;
  kind: string;
}

export const searchIndex = (): SearchEntry[] => [
  /* `private` pages are out. The Article Studio was appearing in
     public search results, an admin screen offered to every reader
     who typed a letter that happened to match it. `private` already
     kept it out of the menu and the sitemap; search was the one
     place that ignored the flag. */
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
  /* `stageUrl()` rather than a second spelling of it. This branched
     on `stage.inline` for the starter guide, whose eight steps were
     anchors on the hub; no stage is `inline` since 17 August 2026
     and the branch could not fire. Typing this file is what said so. */
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

  /* German. Both the four Stufen and every Teil inside them,
     including the ones still marked "soon": someone searching
     for "Dativ" should find the place it will be, not nothing.
     The German name is in the title as well as the Bangla one,
     because a learner halfway through the course will reach for
     "Klammer" or "sein" long before they reach for "বন্ধনী". */
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

  /* Qur'anic Arabic. Three ধাপ and every day inside them. The
     Arabic name rides in the title beside the Bangla for the
     same reason the German one does: someone looking for
     "Akkusativ" or "إضافة" is looking for the word they met in
     the lesson, not for its translation. */
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

  /* English. Both terms and every part inside them. The English
     title rides beside the Bangla one because a learner halfway
     through will reach for "present perfect" or "phrasal verbs"
     long before they reach for "সেতু-কাল". */
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
     purpose: someone typing "রান্না" should be told where it will
     be, not handed "No matches". The three schools that exist are
     skipped because each already has a page entry and every
     lesson of its own above. */
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
