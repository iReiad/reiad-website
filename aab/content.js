/* ============================================================
   content.js: the site's content manifest.

   This is the ONE list you edit when you publish something.
   The Insights page, the overlay menu, the Ctrl+K palette, the
   sitemap and the RSS feed all read from here.

   Publishing a new article (the whole workflow):
     1. Write it in /studio.html, paste your text and photos.
     2. Download the .html it gives you into /insights/.
     3. Studio also gives you a ready-made entry for this file:
        paste it at the TOP of the ARTICLES array below. Done.

   Fields:
     slug      file name inside /insights/ (no .html)
     title     headline
     dek       one or two sentences of standfirst
     tag       small label above the headline
     topics    array of filter chips on the Insights page
     date      ISO date, YYYY-MM-DD, sorted newest first
     minutes   reading time; Studio counts it for you
     lang      "en" or "bn"
     status    "live" (default) or "soon" for a teaser card
   ============================================================ */

export const SITE = {
  name: "Reiad's Library",
  tagline: "Finance & Bangladesh markets",
  origin: "https://reiad.co.uk",
  email: "i@reiad.co.uk",
  linkedin: "https://www.linkedin.com/in/reiad",
};

export const ARTICLES = [
  {
    slug: "dse-basics",
    title: "How the Dhaka Stock Exchange actually works",
    dek: "What the DSEX index measures, how a BO account works, and the questions to ask before buying your first share.",
    tag: "Explainer · Equities",
    topics: ["Equities", "Beginner"],
    date: "2026-07-01",
    minutes: 5,
    lang: "en",
    status: "live",
  },
  {
    slug: "sanchayapatra-vs-fdr",
    title: "Sanchayapatra vs. bank FDR: where does a saver's taka work harder?",
    dek: "Rates, tax at source, purchase limits and early-encashment rules, compared properly.",
    tag: "Comparison · Savings",
    topics: ["Savings", "Beginner"],
    date: "",
    lang: "en",
    status: "soon",
  },
  {
    slug: "closed-end-discount",
    title: "Why do Bangladesh's closed-end funds trade below NAV?",
    dek: "The discount puzzle, and what it says about fees and trust.",
    tag: "Analysis · Funds",
    topics: ["Funds"],
    date: "",
    lang: "en",
    status: "soon",
  },
  {
    slug: "islamic-funds-risk",
    title: "Islamic funds and risk: what my dissertation found",
    dek: "A readable summary of the research: systematic risk, drawdowns, and the pre/post-COVID comparison.",
    tag: "Research · Funds",
    topics: ["Funds", "Research"],
    date: "",
    lang: "en",
    status: "soon",
  },
];

/* ============================================================
   The Learn area.

   The curriculum, every stage, section and lesson, lives in
   /learn/curriculum.js, which is the one file to edit when the
   Learn area changes. It is re-exported here so that the menu,
   the palette and build-meta.mjs have a single import as before.

   TERM_GROUPS below is the ORIGINAL eighteen-term grouping, kept
   because /learn/terms/*.html and the A–Z glossary were built
   around it and its URLs are published. It is now the same data
   as stage `basics-1` of the curriculum; curriculum.js is the
   source of truth for the structure, this for the term cards.

   NOTE the relative specifier below. content.js is imported two
   ways: by the browser from /content.js, and by build-meta.mjs
   from the filesystem. "./learn/curriculum.js" resolves correctly
   in both; "/learn/curriculum.js" would resolve to the filesystem
   root under Node and break the build scripts.
   ============================================================ */
import {
  STAGES, SCHOOLS, allLessons, stageLessons, stageUrl, lessonUrl, findStage,
} from "./learn/curriculum.js";

/* The second school. German has its own curriculum file for the
   same reason it has its own mount: nothing about ব্রোকার belongs
   in a file about Akkusativ. Both are imported here so the menu,
   the palette and build-meta.mjs still have a single import. */
import {
  STUFEN, SCHOOL as DEUTSCH, allTeile, stufeUrl, teilUrl, workbookUrl,
} from "./deutsch/curriculum.js";

// re-exported, because `export … from` alone would not give this
// file the local bindings that searchIndex() below needs
export { STAGES, SCHOOLS, allLessons, stageLessons, stageUrl, lessonUrl, findStage };
export { STUFEN, DEUTSCH, allTeile, stufeUrl, teilUrl, workbookUrl };

export const TERM_GROUPS = [
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
export const TERMS = TERM_GROUPS.flatMap((g) =>
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
     icon     a key in /learn/icons.js, see that file's rules
     status   "live" or "soon"
     blurb    one Bangla sentence: what you would actually get
     note     what still has to be written, for a "soon" one
   ============================================================ */
export const SKILLS = [
  {
    slug: "deutsch",
    bn: "জার্মান",
    en: "Deutsch · German",
    url: "/deutsch/index.html",
    icon: "book",
    status: "live",
    blurb: "চারটা স্তরে জার্মান, বাংলা দিয়ে বোঝানো, আর রোজ এক পাতার অনুশীলন খাতা।",
  },
  {
    slug: "quran",
    bn: "কুরআন",
    en: "Quran: reading and meaning",
    icon: "scroll",
    status: "soon",
    blurb: "হরফ থেকে শুরু করে শুদ্ধ উচ্চারণ, তারপর শব্দ ধরে ধরে অর্থ।",
    note: "বর্ণ ও উচ্চারণের অংশটা লেখা হচ্ছে।",
  },
  {
    slug: "english",
    bn: "ইংরেজি",
    en: "English for work",
    icon: "signpost",
    status: "soon",
    blurb: "ইমেইল, ইন্টারভিউ আর অফিসের ইংরেজি: মুখস্থ নয়, ব্যবহারের ছাঁচ।",
    note: "প্রথম স্তরের রূপরেখা তৈরি, লেখা বাকি।",
  },
  {
    slug: "cooking",
    bn: "রান্না",
    en: "Cooking",
    icon: "cart",
    status: "soon",
    blurb: "মাপ, তাপ আর সময়: রেসিপি মুখস্থ না করে রান্নাটা বোঝা।",
    note: "প্রথম দশটা পদের তালিকা হচ্ছে।",
  },
  {
    slug: "travel",
    bn: "ভ্রমণ",
    en: "Travel",
    icon: "compass",
    status: "soon",
    blurb: "ভিসা, টিকিট, বাজেট আর ব্যাগ: প্রথমবার দেশের বাইরে যাওয়ার পুরো ধাপ।",
    note: "ভিসার কাগজপত্রের অংশটা আগে আসবে।",
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
export const liveSkills = () => SKILLS.filter((s) => s.status === "live");

/** Where a skill points: its own school, or its slot on /skills/. */
export const skillUrl = (s) => s.url || `/skills/index.html#${s.slug}`;

/* ============================================================
   Calculators on /tools/
   ============================================================ */
export const TOOLS = [
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
   Pages: the menu, the palette and the sitemap read this.
   `private: true` keeps a page out of the sitemap and the menu.
   ============================================================ */
export const PAGES = [
  { title: "Home", url: "/index.html",
    hint: "Page", blurb: "The short version of everything here." },
  { title: "Learn hub: শেখার লাইব্রেরি", url: "/learn/index.html",
    hint: "Page", blurb: "Start-to-research investing course in plain Bangla, eight stages deep." },
  { title: "Learn: সব বিষয় এক নজরে", url: "/learn/contents.html",
    hint: "Page", group: "learn", blurb: "Every lesson in the Learn area on one page, plus the A–Z of terms." },
  { title: "Skills: দক্ষতা", url: "/skills/index.html",
    hint: "Page", blurb: "Everything here that isn't money: German, Quran, English, cooking, travel, reviews." },
  { title: "Deutsch: জার্মান, বাংলায়", url: "/deutsch/index.html",
    hint: "Page", blurb: "German from Bangla in four stages, with a thirty-day practice book for each." },
  { title: "৩০ দিনের অনুশীলন খাতা · Das 30-Tage-Arbeitsbuch", url: "/deutsch/stufe-1/arbeitsbuch.html",
    hint: "Workbook", group: "deutsch", blurb: "One page a day: a pattern, five models, eight of your own sentences, six translations, and one true paragraph." },
  { title: "Tools & calculators", url: "/tools/index.html",
    hint: "Page", blurb: "Compounding, sanchayapatra vs FDR, inflation, EMI, position sizing." },
  { title: "Stock check: buy, hold or sell", url: "/tools/stock.html",
    hint: "Tool", group: "tool", blurb: "Thirty-odd ratios across six pillars, a verdict that shows its own arithmetic, in English or Bangla." },
  { title: "Insights", url: "/insights.html",
    hint: "Page", blurb: "Longer pieces, plus an auto-updating pulse of market news." },
  { title: "Three-statement model: interactive case study", url: "/portfolio/three-statement.html",
    hint: "Case study", group: "case", blurb: "A live financial model: edit the assumptions, watch all three statements move." },
  { title: "DCF with sensitivity tables: interactive case study", url: "/portfolio/dcf.html",
    hint: "Case study", group: "case", blurb: "A live discounted cash flow: build the WACC, switch terminal value method, read the grid." },
  { title: "Index volatility & drawdowns: interactive case study", url: "/portfolio/dsex.html",
    hint: "Case study", group: "case", blurb: "Rolling volatility, drawdowns, tail risk and holding periods, with CSV import." },
  { title: "Portfolio construction: a screened FTSE 250 fund", url: "/portfolio/frontier.html",
    hint: "Case study", group: "case", blurb: "Ten FTSE 250 holdings past a Shariah and sustainability screen, weighted on 2015 and held to 2020, with the frontier and the optimised alternatives solved live alongside." },
  { title: "Probability of default: scorecard vs gradient boosting", url: "/portfolio/scorecard.html",
    hint: "Case study", group: "case", blurb: "A live PD model on a public dataset: logistic regression against gradient boosting, cross-validated, calibrated, and priced." },
  { title: "Portfolio stress testing: interactive case study", url: "/portfolio/stress.html",
    hint: "Case study", group: "case", blurb: "A live credit stress test: macro shocks to default rates through a Merton model and a vintage one, then provisions and capital." },
  { title: "Islamic vs conventional funds: MSc dissertation", url: "/portfolio/dissertation.html",
    hint: "Case study", group: "case", blurb: "220 UK funds, 19,577 fund-months, five-factor models, and what a sample of three could actually detect." },
  { title: "Portfolio & services", url: "/portfolio.html",
    hint: "Page", blurb: "Financial modeling, data analysis and finance writing." },
  { title: "About Rony", url: "/about.html",
    hint: "Page", blurb: "The route from Chittagong economics to Brighton risk management." },
  { title: "Contact / register interest", url: "/contact.html",
    hint: "Page", blurb: "For recruiters, clients and readers." },
  { title: "Colophon: how this site is built", url: "/colophon.html",
    hint: "Page", blurb: "Every technical decision behind the site, written down." },
  { title: "Article Studio: publish a new piece", url: "/studio.html",
    hint: "Tool", blurb: "Paste an article and its photos, get a finished page.", private: true },
];

/** Live articles, newest first. */
export const liveArticles = () =>
  ARTICLES.filter((a) => a.status !== "soon")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

/** Every topic chip in use, with counts. */
export const topics = () => {
  const counts = new Map();
  liveArticles().forEach((a) =>
    (a.topics ?? []).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
  );
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
};

/** Everything the command palette can jump to.

    Every lesson in every stage is in here, including the ones
    still marked "soon"– someone searching for "dissertation"
    should find the place it will be, not nothing. The hint names
    the stage, so a result reads as "মূল্যায়ন: মাঝারি · ধাপ ১"
    and the reader knows how deep they are about to go. */
export const searchIndex = () => [
  /* `private` pages are out. The Article Studio was appearing in
     public search results, an admin screen offered to every reader
     who typed a letter that happened to match it. `private` already
     kept it out of the menu and the sitemap; search was the one
     place that ignored the flag. */
  ...PAGES.filter((p) => !p.private).map((p) => ({
    title: p.title, url: p.url, hint: p.hint,
    kind: p.group === "case" ? "case" : p.group === "tool" ? "tool"
      : p.group === "learn" ? "learn"
      : p.group === "deutsch" || p.url.startsWith("/deutsch/") ? "deutsch" : "page",
  })),
  ...liveArticles().map((a) => ({
    title: a.title,
    url: `/insights/${a.slug}.html`,
    hint: "Article",
    kind: "writing",
  })),
  ...TOOLS.map((t) => ({
    title: `${t.en}: ${t.bn}`,
    url: `/tools/index.html#${t.id}`,
    hint: "Tool",
    kind: "tool",
  })),
  ...STAGES.map((s) => ({
    title: `${s.kicker} · ${s.bn}: ${s.en}`,
    url: s.inline ? "/learn/index.html#starter" : `/learn/${s.slug}/index.html`,
    hint: "Stage",
    kind: "learn",
  })),
  ...allLessons().map((l) => ({
    title: `${l.bn}: ${l.en}`,
    url: l.url,
    hint: `${l.stage.kicker}`,
    kind: "learn",
  })),

  /* German. Both the four Stufen and every Teil inside them,
     including the ones still marked "soon"– someone searching
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

  /* The other schools. A skill still being written is in here on
     purpose: someone typing "Quran" should be told where it will
     be, not handed "No matches". Deutsch is skipped because it
     already has a page entry and every Teil of its own above. */
  ...SKILLS.filter((s) => s.slug !== "deutsch").map((s) => ({
    title: `${s.bn}: ${s.en}`,
    url: skillUrl(s),
    hint: s.status === "soon" ? "Skill · আসছে" : "Skill",
    kind: "skill",
  })),
];

/** The order the palette shows groups in, and what it calls them. */
export const SEARCH_GROUPS = [
  ["page", "Pages"],
  ["tool", "Tools"],
  ["case", "Case studies"],
  ["learn", "শেখার লাইব্রেরি · Learn"],
  ["deutsch", "জার্মান · Deutsch"],
  ["skill", "দক্ষতা · Skills"],
  ["writing", "Writing"],
];

/** "1 August 2026"– or "" when a piece has no date yet. */
export function formatDate(iso, lang = "en") {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.valueOf())) return "";
  return new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(d);
}
