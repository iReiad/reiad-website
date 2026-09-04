/* ============================================================
   look.ts: what a rendered piece looks like, per section. The
   three reading sections share a page shell and differ in a
   handful of small ways: the mount, the class on the body, the
   card a piece without a photo falls back to, how "8 min read" is
   written, and the line at the foot.

   ONE TABLE, because the Worker and the Next route have to render
   the same head tags and two copies drift. Nothing here touches a
   database or a request, so a test can read it too.
   ============================================================ */

export interface Look {
  mount: string;
  hub: string;
  bodyClass: string;
  og: string;
  minutes: (n: number) => string;
  skip: string;
  note: string;
  back: { url: string; kicker: string; label: string };
  side: { url: string; kicker: string; label: string };
  footer: string;
}

export interface Article {
  slug: string;
  section: string;
  lang: string;
  title: string;
  dek: string;
  tag: string;
  body: string;
  cover: string;
  topics: string;
  minutes: number;
  status: string;
  published_at: string;
  updated_at: string;
}

const HUB = {
  insights: "/insights",
  cooking: "/cooking",
  travel: "/travel",
};

export const LOOK: Record<string, Look> = {
  insights: {
    mount: "/insights/",
    hub: HUB.insights,
    bodyClass: "",
    og: "/og/insights.png",
    minutes: (n) => `${n} min read`,
    skip: "Skip to the article",
    note: "This piece is general education, not investment advice. Rules, rates and "
      + "fees change: confirm the current details with the relevant institution "
      + "before acting on anything here.",
    back: { url: HUB.insights, kicker: "All insights", label: "Back to the index →" },
    side: { url: "/money", kicker: "টাকা ও শেয়ার", label: "টাকার স্কুল, বাংলায় →" },
    footer: "Everything on this site is general education, not investment advice. "
      + "Do your own research before putting money anywhere.",
  },
  cooking: {
    mount: "/cooking/",
    hub: HUB.cooking,
    bodyClass: "cooking read",
    og: "/og/cooking.png",
    minutes: (n) => `${n} মিনিট পড়া`,
    skip: "মূল লেখায় যান",
    note: "রান্নাঘরের লেখাগুলো রেসিপি নয়, বোঝার জন্য। নিজের রান্নাঘর, নিজের চুলা আর নিজের "
      + "স্বাদ অনুযায়ী মাপ আর সময় একটু এদিক-ওদিক হবেই।",
    back: { url: HUB.cooking, kicker: "রান্নাঘর", label: "সব লেখা এক জায়গায় →" },
    side: { url: "/skills", kicker: "দক্ষতা", label: "আর কী কী শেখানো হয় →" },
    footer: "রান্নাঘরের লেখাগুলো বিনামূল্যে, বাংলায়।",
  },
  travel: {
    mount: "/travel/",
    hub: HUB.travel,
    bodyClass: "travel read",
    og: "/og/travel.png",
    minutes: (n) => `${n} মিনিট পড়া`,
    skip: "মূল লেখায় যান",
    note: "এই লেখাটা সাধারণ তথ্য, আইনি পরামর্শ নয়। ভিসার নিয়ম আর ফি বদলায়, তাই আবেদনের "
      + "আগে অফিসিয়াল গাইডেন্স একবার দেখে নিন।",
    back: { url: HUB.travel, kicker: "ভ্রমণ", label: "সব লেখা এক জায়গায় →" },
    side: { url: "/skills", kicker: "দক্ষতা", label: "আর কী কী শেখানো হয় →" },
    footer: "ভ্রমণের লেখাগুলো বিনামূল্যে, বাংলায়।",
  },
};

export const lookFor = (section: string): Look => LOOK[section] ?? LOOK.insights;

export const isSection = (name: string): boolean => Object.hasOwn(LOOK, String(name));

const IMAGE_TYPES: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  webp: "image/webp", avif: "image/avif", gif: "image/gif",
};

export const cardShape = (url: string | null | undefined): { type: string; sized: boolean } => {
  const ext = String(url ?? "").split(".").pop()?.toLowerCase() ?? "";
  return {
    type: IMAGE_TYPES[ext] ?? "image/png",
    sized: /^\/og\/[a-z0-9-]+\.png$/.test(url ?? "")
      || /^\/media\/[a-z0-9-]*-card\/[0-9a-f]+\.jpg$/.test(url ?? ""),
  };
};

export function coverFor(article: Partial<Article> | null | undefined): string {
  const body = article?.body ?? "";
  const lead = body.match(
    /<figure\b[^>]*class="[^"]*\blead-photo\b[^"]*"[^>]*>[\s\S]*?<img\b[^>]*\bsrc="(\/media\/[A-Za-z0-9._/-]+)"/i
  )?.[1];
  const first = body.match(/<img\b[^>]*\bsrc="(\/media\/[A-Za-z0-9._/-]+)"/i)?.[1];
  const section = article?.section ? String(article.section) : "insights";
  return article?.cover || lead || first || lookFor(section).og;
}

export const dateLabel = (article: Pick<Article, "lang" | "published_at">): string =>
  new Intl.DateTimeFormat(article.lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${article.published_at || "2026-01-01"}T00:00:00Z`));

/** One stylesheet, one request, every face this site uses.
 *
 * `Caveat` is loaded for exactly one thing: WHAT A READER WROTE
 * THEMSELVES, which is the note on a routine day and the line
 * beside "something I chose", and nothing else ever. One weight,
 * because a handwritten note has one, and the fallback in
 * `--font-hand` is the serif so a blocked webfont is a quieter
 * page rather than a broken one.
 */
export const FONTS =
  "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600"
  + "&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500"
  + "&family=Noto+Sans+Bengali:wght@400;500&family=Noto+Serif+Bengali:wght@500;600"
  + "&family=Caveat:wght@500"
  + "&display=swap";

export interface HeadFacts {
  look: Look;
  url: string;
  cover: string;
  image: string;
  sized: boolean;
  type: string;
  locale: string;
  title: string;
  jsonLd: string;
}

export function headFacts(article: Article, origin: string): HeadFacts {
  const look = lookFor(article.section);
  const cover = coverFor(article);
  const shape = cardShape(cover);
  const url = `${origin}${look.mount}${article.slug}.html`;

  return {
    look,
    url,
    cover,
    image: `${origin}${cover}`,
    sized: shape.sized,
    type: shape.type,
    locale: article.lang === "bn" ? "bn_BD" : "en_GB",
    title: `${article.title}, Reiad's Library`,
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.dek,
      datePublished: article.published_at,
      dateModified: article.updated_at,
      inLanguage: article.lang,
      author: { "@type": "Person", name: "Rony Reiad", url: `${origin}/about` },
      mainEntityOfPage: url,
      image: `${origin}${cover}`,
    }).replace(/</g, "\\u003c"),
  };
}
