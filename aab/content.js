/* ============================================================
   content.js — the site's little content manifest.

   This is the ONE list you edit when you publish something.
   The Insights page renders its cards from ARTICLES, and the
   Ctrl+K palette searches ARTICLES + TERMS + PAGES.

   Publishing a new article (the whole workflow):
     1. Write it in /studio.html — paste your text and photos.
     2. Download the .html it gives you into /insights/.
     3. Studio also gives you a ready-made entry for this file:
        paste it at the TOP of the ARTICLES array below. Done.

   Fields:
     slug      file name inside /insights/ (no .html)
     title     headline
     dek       one or two sentences of standfirst
     tag       small label above the headline
     date      ISO date, YYYY-MM-DD — sorted newest first
     minutes   reading time; Studio counts it for you
     lang      "en" or "bn"
     status    "live" (default) or "soon" for a teaser card
   ============================================================ */

export const ARTICLES = [
  {
    slug: "dse-basics",
    title: "How the Dhaka Stock Exchange actually works",
    dek: "What the DSEX index measures, how a BO account works, and the questions to ask before buying your first share.",
    tag: "Explainer · Equities",
    date: "2026-07-01",
    minutes: 5,
    lang: "en",
    status: "live",
  },
  {
    slug: "sanchayapatra-vs-fdr",
    title: "Sanchayapatra vs. bank FDR: where does a saver's taka work harder?",
    dek: "Rates, tax at source, purchase limits and early-encashment rules — compared properly.",
    tag: "Comparison · Savings",
    date: "",
    lang: "en",
    status: "soon",
  },
  {
    slug: "closed-end-discount",
    title: "Why do Bangladesh's closed-end funds trade below NAV?",
    dek: "The discount puzzle, and what it says about fees and trust.",
    tag: "Analysis · Funds",
    date: "",
    lang: "en",
    status: "soon",
  },
  {
    slug: "islamic-funds-risk",
    title: "Islamic funds and risk: what my dissertation found",
    dek: "A readable summary of the research — systematic risk, drawdowns, and the pre/post-COVID comparison.",
    tag: "Research · Funds",
    date: "",
    lang: "en",
    status: "soon",
  },
];

/* Bangla Learn-hub terms — used by the command palette. */
export const TERMS = [
  { slug: "share",           title: "শেয়ার (Share / Stock)" },
  { slug: "dse",             title: "ঢাকা স্টক এক্সচেঞ্জ (DSE)" },
  { slug: "dsex",            title: "সূচক (Index / DSEX)" },
  { slug: "bo-account",      title: "বিও অ্যাকাউন্ট (BO Account)" },
  { slug: "broker",          title: "ব্রোকার (Broker)" },
  { slug: "ipo",             title: "আইপিও (IPO)" },
  { slug: "mutual-fund",     title: "মিউচুয়াল ফান্ড (Mutual Fund)" },
  { slug: "sanchayapatra",   title: "সঞ্চয়পত্র (Savings Certificate)" },
  { slug: "bond",            title: "বন্ড (Bond)" },
  { slug: "fdr",             title: "এফডিআর (Fixed Deposit / FDR)" },
  { slug: "dividend",        title: "ডিভিডেন্ড (Dividend)" },
  { slug: "eps",             title: "ইপিএস (EPS)" },
  { slug: "pe-ratio",        title: "পিই রেশিও (P/E Ratio)" },
  { slug: "nav",             title: "এনএভি (NAV)" },
  { slug: "risk-return",     title: "ঝুঁকি ও রিটার্ন (Risk & Return)" },
  { slug: "diversification", title: "ডাইভারসিফিকেশন (Diversification)" },
  { slug: "inflation",       title: "মূল্যস্ফীতি (Inflation)" },
  { slug: "compounding",     title: "চক্রবৃদ্ধি (Compounding)" },
];

export const PAGES = [
  { title: "Home",                        url: "/index.html" },
  { title: "Learn hub — শেখার লাইব্রেরি",   url: "/learn/index.html" },
  { title: "Insights",                    url: "/insights.html" },
  { title: "Portfolio & services",        url: "/portfolio.html" },
  { title: "About Rony",                  url: "/about.html" },
  { title: "Contact / register interest", url: "/contact.html" },
  { title: "Article Studio — publish a new piece", url: "/studio.html" },
];

/** Live articles, newest first. */
export const liveArticles = () =>
  ARTICLES.filter((a) => a.status !== "soon")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

/** Everything the command palette can jump to. */
export const searchIndex = () => [
  ...PAGES.map((p) => ({ ...p, hint: "Page" })),
  ...liveArticles().map((a) => ({
    title: a.title,
    url: `/insights/${a.slug}.html`,
    hint: "Article",
  })),
  ...TERMS.map((t) => ({
    title: t.title,
    url: `/learn/terms/${t.slug}.html`,
    hint: "Learn",
  })),
];

/** "1 August 2026" — or "" when a piece has no date yet. */
export function formatDate(iso, lang = "en") {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.valueOf())) return "";
  return new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(d);
}
