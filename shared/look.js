/* ============================================================
   look.js: what a rendered piece looks like, per section.

   The three reading sections share a page shell and differ in a
   handful of small ways: the mount they are served at, the class
   on the body, the card a piece without a photo falls back to, how
   "8 min read" is written, and the line at the foot.

   ---- why this is its own file ----

   It was written three times. `functions/insights/[slug].js` had
   it as `LOOK`, `aab/studio.js` had it as `PAGE_STYLE`, and the
   comment above each one said "change one, change both". That
   instruction is a promise a comment cannot keep: the two had
   already drifted once on the disclaimer's punctuation, which is
   invisible until you diff two rendered pages.

   Stage 10 of TRANSITION.md makes it worse by adding a fourth
   reader, the Next.js route, whose whole acceptance test is that
   it renders the same head tags as the Worker does. Two copies
   cannot pass that test for long, so there is one.

   Nothing in here touches a database or a request. It is a table
   and four functions over it, so the Worker, the Next route and a
   test can all read it.
   ============================================================ */

export const LOOK = {
  insights: {
    mount: "/insights/",
    bodyClass: "",
    og: "/og/insights.png",
    minutes: (n) => `${n} min read`,
    skip: "Skip to the article",
    note: "This piece is general education, not investment advice. Rules, rates and "
      + "fees change: confirm the current details with the relevant institution "
      + "before acting on anything here.",
    back: { url: "/insights.html", kicker: "All insights", label: "Back to the index →" },
    side: { url: "/learn/index.html", kicker: "শেখার লাইব্রেরি", label: "Learn hub, বাংলায় →" },
    footer: "Everything on this site is general education, not investment advice. "
      + "Do your own research before putting money anywhere.",
  },
  cooking: {
    mount: "/cooking/",
    bodyClass: "cooking read",
    og: "/og/cooking.png",
    minutes: (n) => `${n} মিনিট পড়া`,
    skip: "মূল লেখায় যান",
    note: "রান্নাঘরের লেখাগুলো রেসিপি নয়, বোঝার জন্য। নিজের রান্নাঘর, নিজের চুলা আর নিজের "
      + "স্বাদ অনুযায়ী মাপ আর সময় একটু এদিক-ওদিক হবেই।",
    back: { url: "/cooking/index.html", kicker: "রান্নাঘর", label: "সব লেখা এক জায়গায় →" },
    side: { url: "/skills/index.html", kicker: "দক্ষতা", label: "আর কী কী শেখানো হয় →" },
    footer: "রান্নাঘরের লেখাগুলো বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া।",
  },
  travel: {
    mount: "/travel/",
    bodyClass: "travel read",
    og: "/og/travel.png",
    minutes: (n) => `${n} মিনিট পড়া`,
    skip: "মূল লেখায় যান",
    note: "এই লেখাটা সাধারণ তথ্য, আইনি পরামর্শ নয়। ভিসার নিয়ম আর ফি বদলায়, তাই আবেদনের "
      + "আগে অফিসিয়াল গাইডেন্স একবার দেখে নিন।",
    back: { url: "/travel/index.html", kicker: "ভ্রমণ", label: "সব লেখা এক জায়গায় →" },
    side: { url: "/skills/index.html", kicker: "দক্ষতা", label: "আর কী কী শেখানো হয় →" },
    footer: "ভ্রমণের লেখাগুলো বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া।",
  },
};

/** The section a piece belongs to, falling back to Insights: an
    unknown value comes from an old row, and the honest answer is
    the default section rather than a crash. */
export const lookFor = (section) => LOOK[section] ?? LOOK.insights;

/** Is this a section anything is served at? Used to tell "the
    request came in at the wrong mount" from "we do not know that
    word at all". */
export const isSection = (name) => Object.hasOwn(LOOK, String(name));

/* ---------- the share image ----------

   A social scraper is not a browser: it decides whether to show a
   card at all from these three tags, and several of them refuse a
   WebP outright. The Studio draws a JPEG at 1200x630 on publish
   for exactly that reason, and this describes whatever it stored,
   so a piece published before that existed still gets an honest
   tag rather than a confident wrong one. Dimensions are declared
   only for the two kinds of image known to be 1200x630: a
   section's own card, and one the Studio drew. */

const IMAGE_TYPES = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  webp: "image/webp", avif: "image/avif", gif: "image/gif",
};

export const cardShape = (url) => ({
  type: IMAGE_TYPES[String(url ?? "").split(".").pop().toLowerCase()] ?? "image/png",
  sized: /^\/og\/[a-z0-9-]+\.png$/.test(url ?? "")
    || /^\/media\/[a-z0-9-]*-card\/[0-9a-f]+\.jpg$/.test(url ?? ""),
});

/** The picture a pasted link should show.

    Articles published before `cover` was a column have an empty
    one even when their body already holds a hosted photo. The lead
    photo, then the first photo, then the section's own card: that
    recovers the preview for those pieces without anybody having to
    re-save them. The Studio stores `cover` on every new publish;
    this is the backwards-compatible bridge. */
export function coverFor(article) {
  const body = article?.body ?? "";
  const lead = body.match(
    /<figure\b[^>]*class="[^"]*\blead-photo\b[^"]*"[^>]*>[\s\S]*?<img\b[^>]*\bsrc="(\/media\/[A-Za-z0-9._/-]+)"/i
  )?.[1];
  const first = body.match(/<img\b[^>]*\bsrc="(\/media\/[A-Za-z0-9._/-]+)"/i)?.[1];
  return article?.cover || lead || first || lookFor(article?.section).og;
}

/** The date under the headline, in the piece's own language. */
export const dateLabel = (article) =>
  new Intl.DateTimeFormat(article.lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${article.published_at || "2026-01-01"}T00:00:00Z`));

/** The webfonts every page of this site loads. One string, because
    a second copy of it with one weight missing is a page whose
    headings quietly render in the fallback face. */
export const FONTS =
  "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600"
  + "&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500"
  + "&family=Noto+Sans+Bengali:wght@400;500&family=Noto+Serif+Bengali:wght@500;600"
  + "&display=swap";

/** Everything the head of an article page says about itself.

    Both renderers build their tags from this, which is what makes
    "the Next route and the Worker agree" a thing a test can check
    rather than a thing a comment can ask for. */
export function headFacts(article, origin) {
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
      author: { "@type": "Person", name: "Rony Reiad", url: `${origin}/about.html` },
      /* The piece's own address. This said /insights/ whatever the
         section was, which pointed a kitchen piece's structured
         data at a URL that answers 404. */
      mainEntityOfPage: url,
      image: `${origin}${cover}`,
    }).replace(/</g, "\\u003c"),
  };
}
