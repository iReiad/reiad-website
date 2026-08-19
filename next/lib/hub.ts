/* ============================================================
   hub.ts: what a reading section's index page says about itself,
   and the prose around the list.

   ---- why this is a table and not three pages ----

   The kitchen and the travel desk are the same page with
   different words in it: a hero, a list of pieces, four cells
   saying how the pieces are written, and a closing note. They
   were two files, and the two drifted; `aab/reads.js` already
   exists because the cards inside them had drifted twice.

   ---- and why the words are here rather than in a database ----

   The rule in archive/TRANSITION.md 2b: a thing that changes because
   somebody wrote something belongs in a database, and a thing
   that changes because somebody changed the code belongs in the
   repository. A hub's hero is the second kind. It is the page's
   own furniture, it changes when the section is redesigned, and
   putting it in D1 would mean a reader waits on a query to find
   out what the heading is.

   The pieces themselves are the first kind, and they come out of
   D1 in `pieces.ts`. The line above the list counts what that
   query returned, never what somebody typed here.
   ============================================================ */

import { lookFor } from "@reiad/shared/look";

/** Everything the head of a hub states about itself, taken
    verbatim from the page it replaces. Byte-faithful on purpose:
    `scripts/check-preview.ts` compares these tags against the
    live site's, so a rewritten description is a failed check
    rather than a silent change to a search result. */
export type HubMeta = {
  lang: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  /** Insights states one and the two Bangla hubs never have. */
  locale?: string;
};

export const HUB_META: Record<string, HubMeta> = {
  insights: {
    lang: "en",
    title: "Insights · Reiad's Library",
    description: "Market notes and explainers on Bangladesh and global finance, "
      + "plus an auto-updating pulse of important market news.",
    ogTitle: "Insights",
    ogDescription: "Market notes and explainers on Bangladesh and global finance, "
      + "plus an auto-updating pulse of important market news.",
    locale: "en_GB",
  },
  cooking: {
    lang: "bn",
    title: "রান্নাঘর: উপকরণ ধরে ধরে রান্না বোঝা, Reiad's Library",
    description: "রেসিপি মুখস্থ নয়, রান্নাটা বোঝা। একেকটা উপকরণ নিয়ে পুরো একটা লেখা: কেন "
      + "এভাবে কাটে, কেন এত সময় লাগে, আর কোন ধাপটা বাদ দিলে স্বাদ ফাঁকা লাগে।",
    ogTitle: "রান্নাঘর · Cooking",
    ogDescription: "রেসিপি মুখস্থ নয়, রান্নাটা বোঝা। একেকটা উপকরণ নিয়ে পুরো একটা লেখা, বাংলায়।",
  },
  travel: {
    lang: "bn",
    title: "ভ্রমণ: ভিসা, কাগজপত্র আর দেশের বাইরে যাওয়ার পথ, Reiad's Library",
    description: "ভিসা আর কাগজপত্রের আসল কথা, বাংলায়। কোন ডকুমেন্টে সবচেয়ে বেশি নজর দেওয়া "
      + "হয়, কেন প্রথম আবেদনটাই সবচেয়ে গুরুত্বপূর্ণ, আর রিফিউজ হলে কী করার আছে।",
    ogTitle: "ভ্রমণ · Travel",
    ogDescription: "ভিসা, কাগজপত্র আর প্রথমবার দেশের বাইরে যাওয়ার পুরো ধাপ, বাংলায়।",
  },
};

/** The prose of a Bangla reading hub. Insights is not in here: it
    carries the market pulse, the reading habits and the subscribe
    box, none of which the other two have, so it is written out as
    its own component rather than squeezed into this shape. */
export type ReadHubCopy = {
  /** The little drawing on every card in this section. */
  icon: string;
  eyebrow: { bn: string; en: string };
  heading: string;
  lede: string;
  /** The first button. Rendered only while the piece it names is
      actually live: it says which piece to read first, so pointing
      it at a different one would make the label a lie, and leaving
      it pointing at an unpublished piece is a button that 404s. */
  first: { slug: string; label: string };
  more: string;
  list: { bn: string; en: string };
  /** Around the count. `intro` + the number + `outro`, so the
      number is the one thing in the sentence that came from the
      data. */
  intro: string;
  outro: string;
  how: { bn: string; en: string };
  cells: { heading: string; body: string }[];
  note: string;
  /** What stands where the list would be when the database did not
      answer. "There is nothing here yet" would be a lie, and it is
      the lie a reader would believe. */
  unavailable: string;
};

export const READ_HUB: Record<string, ReadHubCopy> = {
  cooking: {
    icon: "cart",
    eyebrow: { bn: "রান্নাঘর", en: "Cooking" },
    heading: "রেসিপি নয়, রান্নাটা।",
    lede: "রেসিপি বলে দেয় কী করতে হবে। কিন্তু কেন আঁচ কমাতে হয়, কেন ভিনেগার একদম শেষে, "
      + "কেন একই জিনিস কারো হাতে দশ মিনিটে আর কারো হাতে চল্লিশ মিনিটে হয়, সেটা বলে না। "
      + "এখানে একেকটা উপকরণ নিয়ে পুরো একটা লেখা থাকে, যাতে পড়ার পর রেসিপিটা আর মুখস্থ "
      + "করতে না হয়।",
    first: { slug: "onions", label: "পেঁয়াজের লেখাটা পড়ুন →" },
    more: "আর কী কী আছে",
    list: { bn: "যা যা লেখা আছে", en: "The pieces" },
    intro: "এখন পর্যন্ত ",
    outro: "টি লেখা। ধাপে ধাপে কোর্স নয়, তাই ক্রম মেনে পড়ার দরকার নেই: যেটা আজ রান্না "
      + "করছেন, সেটাই আগে পড়ুন।",
    how: { bn: "কীভাবে লেখা", en: "How these are written" },
    cells: [
      {
        heading: "একটা করে উপকরণ",
        body: "পদ ধরে নয়, উপকরণ ধরে। একটা উপকরণ ভালোভাবে বুঝলে সেটা দিয়ে বানানো সব কটা "
          + "পদই সহজ হয়ে যায়, আর নতুন পদ দেখলেও ভয় লাগে না।",
      },
      {
        heading: "কেন, শুধু কীভাবে নয়",
        body: "তাপে কী ঘটছে, পানি কোথায় যাচ্ছে, মিষ্টি স্বাদটা কোথা থেকে আসছে। কারণটা "
          + "জানা থাকলে রেসিপির বাইরে গিয়েও ঠিক সিদ্ধান্ত নেওয়া যায়।",
      },
      {
        heading: "সময়ের সৎ হিসাব",
        body: "\"একটু ক্যারামেলাইজ করে নিন\" পাঁচ মিনিটের কাজ নয়। কোন ধাপে কতক্ষণ সত্যিই "
          + "লাগে, সেটা লেখা থাকে, যাতে রাত আটটায় শুরু করে হতাশ হতে না হয়।",
      },
      {
        heading: "কোনো ধাপ নেই, কোনো টিক নেই",
        body: "এটা কোর্স নয়। কিছু শেষ করার নেই, কোনো অগ্রগতির হিসাব রাখা হয় না। পড়ুন, "
          + "রান্না করুন, দরকার হলে ছয় মাস পরে আবার এসে পড়ুন।",
      },
    ],
    unavailable: "লেখাগুলোর তালিকা এই মুহূর্তে আনা যাচ্ছে না। একটু পরে আবার দেখুন।",
    note: "রান্নাঘরের এই অংশটা ধীরে বাড়বে। পরের লেখাগুলো একই ধাঁচে: একটা উপকরণ, তার আসল "
      + "কথাগুলো, আর যতটা সম্ভব কম গালভরা শব্দ।",
  },
  travel: {
    icon: "compass",
    eyebrow: { bn: "ভ্রমণ", en: "Travel" },
    heading: "কাগজেই বেশিরভাগ সিদ্ধান্ত হয়।",
    lede: "ভিসা পাওয়া ভাগ্যের ব্যাপার নয়, আর দালালের ব্যাপারও নয়। বেশিরভাগ আবেদন আটকায় "
      + "এমন জায়গায়, যেটা আগে থেকে জানা থাকলে ঠিক করে নেওয়া যেত। এখানে একেকটা বিষয় নিয়ে "
      + "পুরো একটা লেখা থাকে: কোন কাগজ কেন চাওয়া হয়, কোথায় মিসম্যাচ ধরা পড়ে, আর ভুল হয়ে "
      + "গেলে কী করার আছে।",
    first: { slug: "uk-visit-visa", label: "ইউকে ভিজিট ভিসার লেখাটা পড়ুন →" },
    more: "আর কী কী আছে",
    list: { bn: "যা যা লেখা আছে", en: "The pieces" },
    intro: "এখন পর্যন্ত ",
    outro: "টি লেখা। ধাপে ধাপে কোর্স নয়, তাই ক্রম মেনে পড়ার দরকার নেই: যে কাগজটা এখন হাতে "
      + "নিয়ে বসে আছেন, সেটার লেখাটাই আগে পড়ুন।",
    how: { bn: "কীভাবে লেখা", en: "How these are written" },
    cells: [
      {
        heading: "একটা করে বিষয়",
        body: "দেশ ধরে নয়, বিষয় ধরে। একটা ভিসার কাগজপত্র ভালোভাবে বুঝলে পরের দেশটার "
          + "আবেদনেও কাজে লাগে, কারণ প্রশ্নগুলো মোটামুটি একই থাকে।",
      },
      {
        heading: "কেন চাওয়া হয়, শুধু কী চাওয়া হয় না",
        body: "ব্যাংক স্টেটমেন্ট কেন দেখা হয়, কান্ট্রি টাই দিয়ে আসলে কী মাপা হচ্ছে। কারণটা "
          + "জানা থাকলে নিজের ফাইলটা নিজেই যাচাই করা যায়।",
      },
      {
        heading: "কোনো এজেন্সির বিজ্ঞাপন নয়",
        body: "কারো নাম নেই, কারো লিংক নেই, কোনো গ্যারান্টি নেই। যা লেখা আছে সেটা কাগজপত্র "
          + "নিয়ে, কারণ সিদ্ধান্তটা কাগজের উপরেই হয়।",
      },
      {
        heading: "ভুল হলে কী করার আছে",
        body: "রিফিউজাল শেষ কথা নয়। প্রতিটা লেখায় থাকে, ভুল হয়ে গেলে সেখান থেকে ফেরার "
          + "পথটা কী, আর কোন জায়গায় ফেরার পথ সত্যিই নেই।",
      },
    ],
    unavailable: "লেখাগুলোর তালিকা এই মুহূর্তে আনা যাচ্ছে না। একটু পরে আবার দেখুন।",
    note: "এই অংশটা ধীরে বাড়বে। পরের লেখাগুলো একই ধাঁচে: একটা বিষয়, তার আসল কথাগুলো, আর "
      + "যতটা সম্ভব কম গালভরা শব্দ। এখানে কোনো আইনি পরামর্শ নেই: নিয়ম বদলায়, তাই আবেদনের "
      + "আগে সবসময় অফিসিয়াল গাইডেন্সটা একবার দেখে নিন।",
  },
};

/** The pieces this site has promised and not written. Teaser
    cards, on the Insights hub only.

    They are here rather than in the database because there is
    nothing to put in a row: no body, no date, no address. They
    were in the ARTICLES list in `content.js`, which is where
    `aab/app.js` still reads them from for as long as the
    hand-written `insights.html` is the page being served. The two
    copies are held together by `aab/check-content.mjs` until that
    file is archived and this becomes the only one. */
export const SOON = [
  {
    title: "Sanchayapatra vs. bank FDR: where does a saver's taka work harder?",
    dek: "Rates, tax at source, purchase limits and early-encashment rules, compared properly.",
  },
  {
    title: "Why do Bangladesh's closed-end funds trade below NAV?",
    dek: "The discount puzzle, and what it says about fees and trust.",
  },
  {
    title: "Islamic funds and risk: what my dissertation found",
    dek: "A readable summary of the research: systematic risk, drawdowns, and the pre/post-COVID comparison.",
  },
];

/** Everything a hub's head needs, with the addresses taken from
    the same table the article pages read, so that a hub and the
    "back to the index" link under a piece cannot disagree about
    where the index is. */
export function hubFacts(section: string, origin: string) {
  const look = lookFor(section);
  const meta = HUB_META[section];
  return {
    look,
    meta,
    url: `${origin}${look.hub}`,
    image: `${origin}${look.og}`,
  };
}
