/* One lesson of one school, out of D1, and the four schools' own words
   about themselves.

   ONE TABLE RATHER THAN FOUR ROUTES: all four schools draw the same page,
   and what differs is wording and four decisions, every one written down
   here rather than branched on in the component:

     · what the school calls a lesson (a পাঠ, a পর্ব, a দিন)
     · which language sits under the Bangla title
     · which of the school's own scripts the page loads
     · where the last lesson of the last stage points */

import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  isSchool, laddered, lessonOf, stageUrl, stagesOf, workbookUrl, bnNum,
  type LadderedLesson, type SchoolStage,
} from "@reiad/shared/schools";

/* ---------- what each school calls things ---------- */

export interface SchoolLook {
  /** The school's own name, as the third clause of a page title. */
  title: string;
  /** `<body class="...">`, and nothing for the money school,
      which is the site's own default styling. */
  bodyClass?: string;
  /** Which rail item is marked. Every school has one of its own
      now: the rail lists all six under one heading, so a page of
      the German school marks German rather than marking the
      Skills index it used to be reached through. */
  current: "money" | "deutsch" | "quran" | "english";
  /** The footer note. Three of the four say the same thing about
      being free and keeping progress in the reader's account, in
      the words of the language they teach; the money school
      carries the site's disclaimer instead. */
  footer: string;
  /** The prefix of the share card in `/og/`, before the stage's
      slug. `build-og.ts` both draws these and repoints the pages
      at them, so a value here that disagrees with its ASSIGN
      table is two generators taking turns. */
  og: string;
  /** A script every page of the school loads, whatever kind of
      page it is. Only the money school has one, `/money/reader.js`,
      and it is not progress: it is the modal term reader, which
      is why its eighteen glossary pages open one another in a
      panel instead of navigating away. The school's progress used
      to be here too and is `components/progress.tsx` now. */
  shellScript?: string;
  /** The script a LESSON page loads, which is never the script
      its stage's ladder loads. */
  script?: string;
  /** The heading of a page title: the money school names the
      stage, the other three name its kicker. */
  stageName: (stage: SchoolStage) => string;
  /** What goes in the `<span class="en-sub">` after the title,
      and in what language. Null for the Quranic Arabic school,
      which puts the Arabic there in its own element. */
  sub: (lesson: LadderedLesson) => { text: string; lang?: string; cls: string } | null;
  /** The data attributes a lesson page carries, which the
      school's progress script reads. Three names for one idea,
      and they are the names already stored in three browsers. */
  attr: { id: string; stage: string; title: string };
  /** The wording of the article: what a lesson is called, in the
      backlink, the prev/next labels and the "not written yet"
      note. */
  words: {
    backlink: (stage: SchoolStage) => string;
    navLabel: string;
    prev: string;
    next: string;
    soon: [string, string];
    minutes: (n: number) => string;
  };
  /** The second backlink, when the school has one. */
  alt?: (stage: SchoolStage) => { url: string; label: string } | null;
  /** Where the last lesson of a stage points when there is no
      next lesson: a practice book, the next stage, or the school.
      Reading a course through and being handed nothing is how
      somebody quietly stops. */
  tail: (
    stage: SchoolStage, stages: SchoolStage[]
  ) => { url: string; kicker: string; label: string } | null;

  /** What a stage's own contents page says, which is a different
      set of words again. Kept beside the lesson's rather than in
      a file of its own, because the two describe one school and
      the failure worth avoiding is a school whose lesson pages
      and ladder page disagree about what a lesson is called. */
  stage: StageLook;
}

export interface StageLook {
  /** The extra class on the hero, which each school's stylesheet
      layer hangs its own colour and spacing on. */
  hero: string;
  /** The progress bar and the "continue" button read these, and
      the names are already keys in somebody's browser. */
  progressAttr: string;
  continueAttr: string;
  /** The stage's own script, which is never the lesson's, and
      nothing at all for a school whose ladder is React. The money
      school's `/money/stage.js` drew a bar and moved a button
      from `localStorage`; `components/progress.tsx` does both,
      from the ids the route already rendered. */
  script?: string;
  /** Under the kicker in the eyebrow: the school's other
      language, in its own element. */
  sub: (stage: SchoolStage) => { text: string; lang?: string } | null;
  /** The line under the facts, in the schools that make a promise
      about what you will be able to do. The money school makes
      none, which is its own choice and is kept. */
  can?: (stage: SchoolStage) => { text: string; cls: string } | null;
  /** The definition list, which is where the four schools differ
      most: one counts days, one counts parts, two count minutes a
      night. Every number in it is counted from the lessons rather
      than declared. */
  facts: (
    stage: SchoolStage, counted: { total: number; live: number; minutes: number; days: number }
  ) => { dt: string; dd: string }[];
  /** The card the reader is sent back to the school by. */
  back: { url: string; label: string };
  /** The prev/next pair at the foot, in the school's word for a
      stage. */
  ladder: { label: string; prev: string; next: string };
  /** The paragraph at the very bottom, which every school ends
      with and no two of which say the same thing. */
  note: string;
  /** The practice book's band, above the cards, for the two
      schools that have one. */
  book?: {
    id: string;
    cls: string;
    artCls: string;
    textCls: string;
    label: string;
    lang?: string;
    blurb: string;
    cta: string;
    /** What a stage with no book says where the book would be. */
    instead?: (stage: SchoolStage) => string | null;
  };
}

const SOON = "আসছে";

/** The money school's ladder is not days or parts, so its meta
    line is the reading time alone; the other three prefix it with
    the lesson's own label where they have one. */
const minutes = (n: number) => `${bnNum(n)} মিনিটের পড়া`;

/** "৭–১০ মিনিট", the range two schools promise for an evening.

    An en dash, and it is the one thing the house rule on dashes
    keeps it for: a number range. */
const nightly = (stage: SchoolStage) => {
  const range = stage.minutes as number[] | undefined;
  if (!Array.isArray(range) || range.length < 2) return "";
  return `${bnNum(range[0])}–${bnNum(range[1])} মিনিট`;
};

/** The stage after this one, or nothing. */
const after = (stage: SchoolStage, stages: SchoolStage[]) =>
  stages[stages.findIndex((s) => s.slug === stage.slug) + 1] ?? null;

export const LOOKS: Record<string, SchoolLook> = {
  money: {
    /* "টাকা ও শেয়ার" since Stage 11.8, and it is the rename rather
       than a tidy-up: the school used to be the site's second half
       and be called "the learning library", which made the other
       six subjects the leftovers. It is one entry in a list of
       seven now and it is named for what it teaches. Its URLs did
       not move and neither did anybody's progress. */
    title: "টাকা ও শেয়ার",
    current: "money",
    footer: "এই সাইটের সবকিছু সাধারণ শিক্ষামূলক তথ্য: বিনিয়োগ পরামর্শ না। "
      + "টাকা কোথাও রাখার আগে নিজে যাচাই করুন।",
    og: "stage-",
    shellScript: "/money/reader.js",
    stageName: (stage) => String(stage.bn),
    sub: (lesson) => (lesson.en ? { text: String(lesson.en), cls: "en-sub" } : null),
    attr: { id: "data-lesson-id", stage: "data-stage", title: "data-lesson-title" },
    words: {
      backlink: (stage) => `← ${stage.bn}-এর সব লেখা`,
      navLabel: "এই ধাপের অন্য লেখা",
      prev: "← আগের লেখা",
      next: "পরের লেখা →",
      soon: [
        "এই লেখাটা এখনো লেখা হয়নি, কিন্তু জায়গাটা রাখা আছে, যাতে আপনি জানেন কী আসছে "
          + "এবং কোথায় ফিরে আসতে হবে।",
        "এই ধাপের যে লেখাগুলো তৈরি, সেগুলো ধাপের পাতায় চিহ্নিত করা আছে। আপাতত আগের "
          + "ধাপগুলো পুরো করে নিতে পারেন: ক্রম মেনে এগোলে এই লেখাটা এলে অনেক সহজ লাগবে।",
      ],
      minutes,
    },
    alt: () => ({ url: "/money/contents", label: "সব বিষয় এক নজরে →" }),
    /* The money school's lesson pages have never pointed anywhere
       past the end of a stage, and that is its own arrangement
       rather than an oversight: its stages are not a course you
       walk through in order, they are six ladders you pick from,
       and `/money/contents` is the page that shows all of them. */
    tail: () => null,
    stage: {
      hero: "",
      progressAttr: "data-stage-progress",
      continueAttr: "data-stage-continue",
      sub: (stage) => (stage.en ? { text: String(stage.en) } : null),
      facts: (stage, c) => [
        { dt: "কার জন্য", dd: String(stage.who ?? "") },
        { dt: "কতগুলো লেখা", dd: `${bnNum(c.total)}টি${c.live < c.total ? ` (${bnNum(c.live)}টি তৈরি)` : ""}` },
        { dt: "মোট সময়", dd: `প্রায় ${bnNum(c.minutes)} মিনিট` },
      ],
      back: { url: "/money", label: "সব ধাপ দেখুন" },
      ladder: { label: "ধাপের ক্রম", prev: "← আগের ধাপ", next: "পরের ধাপ →" },
      note: "এই লাইব্রেরির সবকিছু সাধারণ শিক্ষামূলক তথ্য: বিনিয়োগ পরামর্শ না। "
        + "নিয়ম, হার আর ফি সময়ে সময়ে বদলায়; সিদ্ধান্তের আগে সংশ্লিষ্ট প্রতিষ্ঠানের "
        + "সর্বশেষ তথ্য দেখে নিন।",
    },
  },

  deutsch: {
    title: "জার্মান বাংলায়",
    bodyClass: "deutsch",
    current: "deutsch",
    footer: "জার্মান অংশটা বিনামূল্যে, বাংলায়। "
      + "আপনার অগ্রগতি জমা থাকে আপনার অ্যাকাউন্টে।",
    og: "deutsch-",
    script: "/deutsch/teil.js",
    stageName: (stage) => String(stage.kicker),
    sub: (lesson) => (lesson.de ? { text: String(lesson.de), lang: "de", cls: "en-sub" } : null),
    attr: { id: "data-teil-id", stage: "data-stufe", title: "data-teil-title" },
    words: {
      backlink: (stage) => `← ${stage.kicker}-এর সব পাঠ`,
      navLabel: "এই স্তরের অন্য পাঠ",
      prev: "← আগের Teil",
      next: "পরের Teil →",
      soon: [
        "এই পাঠটা এখনো লেখা হয়নি, কিন্তু জায়গাটা রাখা আছে, যাতে আপনি জানেন "
          + "কী আসছে আর কোথায় ফিরে আসতে হবে।",
        "এই স্তরের যে পাঠগুলো তৈরি, সেগুলো স্তরের পাতায় চিহ্নিত করা আছে। আপাতত আগের "
          + "স্তরটা পুরো করে নিন, আর রোজকার অনুশীলন চালিয়ে যান: ক্রম মেনে এগোলে এই "
          + "পাঠটা এলে অনেক সহজ লাগবে।",
      ],
      minutes,
    },
    alt: (stage) => {
      const book = workbookUrl("deutsch", stage);
      return book
        ? { url: book, label: `${bnNum(Number(stage.workbook?.days))} দিনের খাতা →` }
        : null;
    },
    tail: (stage) => {
      const book = workbookUrl("deutsch", stage);
      return book
        ? {
            url: book,
            kicker: "এবার অনুশীলন →",
            label: `${bnNum(Number(stage.workbook?.days))} দিনের খাতা`,
          }
        : {
            url: "/deutsch",
            kicker: "শেষ Teil ✓",
            label: "চারটা স্তর একসাথে দেখুন",
          };
    },
    stage: {
      hero: "stufe-hero",
      progressAttr: "data-stufe-progress",
      continueAttr: "data-stufe-continue",
      script: "/deutsch/stufe.js",
      sub: (stage) => (stage.de ? { text: String(stage.de), lang: "de" } : null),
      can: (stage) => (stage.can ? { text: String(stage.can), cls: "stufe-can" } : null),
      facts: (stage, c) => [
        { dt: "কার জন্য", dd: String(stage.who ?? "") },
        { dt: "কতগুলো পাঠ", dd: `${bnNum(c.total)}টি${c.live < c.total ? ` (${bnNum(c.live)}টি তৈরি)` : ""}` },
        { dt: "মোট পড়ার সময়", dd: `প্রায় ${bnNum(c.minutes)} মিনিট` },
        ...(stage.workbook
          ? [{
              dt: "অনুশীলন",
              dd: `${bnNum(Number(stage.workbook.days))} দিন, রোজ একটা পাতা`
                + (workbookUrl("deutsch", stage) ? "" : " (আসছে)"),
            }]
          : stage.uebung
            ? [{ dt: "অনুশীলন", dd: String(stage.uebung) }]
            : []),
      ],
      back: { url: "/deutsch", label: "চারটা স্তর দেখুন" },
      ladder: { label: "স্তরের ক্রম", prev: "← আগের স্তর", next: "পরের স্তর →" },
      note: "এই কোর্সটা বাংলাভাষীদের জন্য লেখা, আর ধরে নেওয়া হয়েছে আপনি ইংরেজি একবার "
        + "শিখেছেন। কোনো পরীক্ষার প্রস্তুতি নয়, কোনো সার্টিফিকেট নয়: লক্ষ্য শুধু "
        + "একটাই, যেন আপনি মুখ খুলে বলতে পারেন।",
      book: {
        id: "uebung",
        cls: "buch-cta",
        artCls: "buch-art",
        textCls: "buch-text",
        label: "রোজকার অনুশীলন",
        lang: "de",
        blurb: "দিনে একটা পাতা, একটা ছাঁচ, নিজের জীবনের একটা সত্যি অনুচ্ছেদ। "
          + "যা লিখবেন সেটা আপনার নিজের ব্রাউজারেই জমা থাকবে।",
        cta: "খাতা খুলুন →",
        instead: (stage) => (stage.uebung ? String(stage.uebung) : null),
      },
    },
  },

  quran: {
    title: "কুরআনের আরবি",
    bodyClass: "quran",
    current: "quran",
    footer: "কুরআনের আরবির অংশটা বিনামূল্যে, বাংলায়। "
      + "আপনার অগ্রগতি জমা থাকে আপনার অ্যাকাউন্টে।",
    og: "quran-",
    script: "/quran/dars.js",
    stageName: (stage) => String(stage.kicker),
    /* Arabic, in its own element and its own direction. The
       school's own note about this is worth keeping in mind: the
       Arabic is the thing being learnt, not a translation of the
       Bangla beside it. */
    sub: (lesson) => (lesson.ar ? { text: String(lesson.ar), lang: "ar", cls: "ar-sub" } : null),
    attr: { id: "data-lesson-id", stage: "data-dhap", title: "data-lesson-title" },
    words: {
      backlink: (stage) => `← ${stage.kicker}-এর সব দিন`,
      navLabel: "এই ধাপের অন্য দিন",
      prev: "← আগের দিন",
      next: "পরের দিন →",
      soon: [
        "এই দিনটা এখনো লেখা হয়নি, কিন্তু জায়গাটা রাখা আছে, যাতে আপনি জানেন "
          + "কী আসছে আর কোথায় ফিরে আসতে হবে।",
        "এই ধাপের যে দিনগুলো তৈরি, সেগুলো ধাপের পাতায় চিহ্নিত করা আছে। আপাতত আগের "
          + "দিনগুলো আরেকবার জোরে পড়ুন: ক্রম মেনে এগোলে এই দিনটা এলে অনেক সহজ লাগবে।",
      ],
      minutes,
    },
    tail: (stage, stages) => {
      const next = after(stage, stages);
      return next
        ? {
            url: stageUrl("quran", next),
            kicker: "পরের ধাপ →",
            label: `${next.kicker} · ${next.bn}`,
          }
        : {
            url: "/quran",
            kicker: "ষাট দিন শেষ ✓",
            label: "তিনটা ধাপ একসাথে দেখুন",
          };
    },
    stage: {
      hero: "dhap-hero",
      progressAttr: "data-dhap-progress",
      continueAttr: "data-dhap-continue",
      script: "/quran/dhap.js",
      sub: (stage) => (stage.ar ? { text: String(stage.ar), lang: "ar" } : null),
      can: (stage) => (stage.can ? { text: String(stage.can), cls: "stufe-can" } : null),
      /* The only school whose ladder is measured in days rather
         than in lessons, because that is what it promises: sixty
         days, and a lesson can cover two of them. */
      facts: (stage, c) => [
        { dt: "কার জন্য", dd: String(stage.who ?? "") },
        {
          dt: "কত দিন",
          dd: `${bnNum(c.days)} দিন, ${bnNum(c.total)}টি পাঠে`
            + (c.live < c.total ? ` (${bnNum(c.live)}টি তৈরি)` : ""),
        },
        { dt: "রোজ কতক্ষণ", dd: nightly(stage) },
        { dt: "মোট পড়ার সময়", dd: `প্রায় ${bnNum(c.minutes)} মিনিট` },
      ],
      back: { url: "/quran", label: "তিনটা ধাপ দেখুন" },
      ladder: { label: "ধাপের ক্রম", prev: "← আগের ধাপ", next: "পরের ধাপ →" },
      note: "এই কোর্সটা তাঁদের জন্য যাঁরা আরবি পড়তে পারেন কিন্তু মানে বোঝেন না। "
        + "কোনো লেখা নেই, কোনো পরীক্ষা নেই: শুধু রোজ একটু করে চেনা, শোনা আর অনুভব করা।",
    },
  },

  english: {
    title: "ইংরেজি বাংলায়",
    bodyClass: "english",
    current: "english",
    footer: "ইংরেজির অংশটা বিনামূল্যে, বাংলায়। "
      + "আপনার অগ্রগতি জমা থাকে আপনার অ্যাকাউন্টে।",
    og: "english-",
    script: "/english/part.js",
    stageName: (stage) => String(stage.kicker),
    sub: (lesson) => (lesson.en ? { text: String(lesson.en), lang: "en", cls: "en-sub" } : null),
    attr: { id: "data-part-id", stage: "data-term", title: "data-part-title" },
    words: {
      backlink: (stage) => `← ${stage.kicker}-এর সব পর্ব`,
      navLabel: "এই টার্মের অন্য পর্ব",
      prev: "← আগের পর্ব",
      next: "পরের পর্ব →",
      soon: [
        "এই পর্বটা এখনো লেখা হয়নি, কিন্তু জায়গাটা রাখা আছে, যাতে আপনি জানেন "
          + "কী আসছে আর কোথায় ফিরে আসতে হবে।",
        "এই টার্মের যে পর্বগুলো তৈরি, সেগুলো টার্মের পাতায় চিহ্নিত করা আছে। আপাতত "
          + "আগের পর্বগুলো আরেকবার জোরে পড়ুন: ক্রম মেনে এগোলে এই পর্বটা এলে অনেক সহজ লাগবে।",
      ],
      minutes,
    },
    alt: (stage) => {
      const book = workbookUrl("english", stage);
      return book
        ? { url: book, label: `${bnNum(Number(stage.workbook?.days))} দিনের খাতা →` }
        : null;
    },
    tail: (stage, stages) => {
      const book = workbookUrl("english", stage);
      if (book) {
        return {
          url: book,
          kicker: "এবার অনুশীলন →",
          label: `${bnNum(Number(stage.workbook?.days))} দিনের খাতা`,
        };
      }
      const next = after(stage, stages);
      return next
        ? {
            url: stageUrl("english", next),
            kicker: "পরের টার্ম →",
            label: `${next.kicker} · ${next.bn}`,
          }
        : {
            url: "/english",
            kicker: "শেষ পর্ব ✓",
            label: "দুটো টার্ম একসাথে দেখুন",
          };
    },
    stage: {
      hero: "term-hero",
      progressAttr: "data-term-progress",
      continueAttr: "data-term-continue",
      script: "/english/term.js",
      sub: (stage) => (stage.en ? { text: String(stage.en), lang: "en" } : null),
      can: (stage) => (stage.can ? { text: String(stage.can), cls: "term-can" } : null),
      facts: (stage, c) => [
        { dt: "কার জন্য", dd: String(stage.who ?? "") },
        { dt: "কতগুলো পর্ব", dd: `${bnNum(c.total)}টি${c.live < c.total ? ` (${bnNum(c.live)}টি তৈরি)` : ""}` },
        { dt: "মোট পড়ার সময়", dd: `প্রায় ${bnNum(c.minutes)} মিনিট` },
        { dt: "রোজ কতক্ষণ", dd: `${nightly(stage)}, তার অন্তত অর্ধেক জোরে বলা` },
        ...(stage.workbook
          ? [{
              dt: "অনুশীলন",
              dd: `${bnNum(Number(stage.workbook.days))} দিন, রোজ একটা পাতা`
                + (workbookUrl("english", stage) ? "" : " (আসছে)"),
            }]
          : []),
      ],
      back: { url: "/english", label: "দুটো টার্ম দেখুন" },
      ladder: { label: "টার্মের ক্রম", prev: "← আগের টার্ম", next: "পরের টার্ম →" },
      note: "এই কোর্সটা বাংলাভাষীদের জন্য লেখা। কোনো পরীক্ষার প্রস্তুতি নয়, কোনো "
        + "সার্টিফিকেট নয়: লক্ষ্য একটাই, যেন আপনি মুখ খুলে বলতে পারেন। ভুল হলেও।",
      book: {
        id: "chorcha",
        cls: "wb-cta",
        artCls: "wb-cta-art",
        textCls: "wb-cta-text",
        label: "রোজকার অনুশীলন",
        lang: "en",
        blurb: "দিনে একটা পাতা, একটা কাঠামো, নিজের জীবনের একটা সত্যি অনুচ্ছেদ। "
          + "যা লিখবেন সেটা আপনার নিজের ব্রাউজারেই জমা থাকবে।",
        cta: "খাতা খুলুন →",
        instead: (stage) => (stage.chorcha ? String(stage.chorcha) : null),
      },
    },
  },
};

/* ---------- reading one ---------- */

/** Everything a lesson page states, gathered once.

    `cache()` is React's per-request memo and it earns its place
    here the same way it does in `article.ts`: the layout, the
    page and `generateMetadata` all want this, and without it that
    is three passes over the same two queries. */
export const getLesson = cache(async (
  school: string, stageSegment: string, lessonSegment: string
) => {
  if (!isSchool(school)) return null;

  const { env } = getCloudflareContext();
  const db = (env as { DB?: D1Database }).DB;
  if (!db) return null;

  const slug = decodeURIComponent(lessonSegment).replace(/\.html$/i, "");
  const segment = decodeURIComponent(stageSegment);
  const stages = await stagesOf(db, school);

  /* The URL's middle segment is USUALLY the stage's slug and is
     not always. `basics-1` in the money school answers at
     `/money/terms/`, because its eighteen term pages were
     published there for a year before that school had a builder
     and a URL somebody shared does not move. So the stage is
     found by the address its lessons actually have, not by
     assuming the segment names it. */
  const wanted = `/${school}/${segment}/${slug}.html`;
  let stage: SchoolStage | undefined;
  let siblings: LadderedLesson[] = [];
  let here = -1;

  for (const candidate of stages) {
    const ladder = laddered(school, candidate);
    const index = ladder.findIndex((l) => l.url === wanted);
    if (index >= 0) {
      stage = candidate;
      siblings = ladder;
      here = index;
      break;
    }
  }

  if (!stage || here < 0) return null;

  const row = await lessonOf(db, school, stage.slug, slug);
  const lesson = siblings[here];

  return {
    school,
    look: LOOKS[school],
    stage,
    stages,
    lesson,
    /* The ladder says whether a lesson is written; the row says
       what it says. A lesson marked live with an empty body is a
       real state and the builders draw the "coming soon" page for
       it, so the route does the same rather than an empty
       article. */
    body: row?.body ?? "",
    /* The other half of the pair, and the lesson's interactive
       parts. Both are columns rather than fields in `meta`, and
       the reason is the ladder query one function up: `stagesOf()`
       reads `meta` for every lesson of a school, so a second body
       in there would put a third of a megabyte of English on a
       page that shows titles. MONEY.md has the argument. */
    bodyEn: row?.bodyEn ?? "",
    blocks: row?.blocks ?? "{}",
    prev: siblings[here - 1] ?? null,
    next: siblings[here + 1] ?? null,
  };
});

export type Lesson = NonNullable<Awaited<ReturnType<typeof getLesson>>>;

/** A stage's contents page, out of the rows.

    Everything a ladder page states about itself is counted from
    the lessons rather than declared: how many there are, how many
    are written, how many minutes and how many days. That is the
    rule at the top of `CLAUDE.md` and it is the reason the
    builders were written; a route that read a number out of a
    stage's meta would be the same mistake in a newer file. */
export const getStage = cache(async (school: string, stageSegment: string) => {
  if (!isSchool(school)) return null;

  const { env } = getCloudflareContext();
  const db = (env as { DB?: D1Database }).DB;
  if (!db) return null;

  const segment = decodeURIComponent(stageSegment);
  const stages = await stagesOf(db, school);
  const stage = stages.find((s) => s.slug === segment);
  if (!stage) return null;

  const lessons = laddered(school, stage);
  /* A stage with no lessons has no contents page to draw and no
     first lesson to send anybody to. None exists today and the
     404 is honest if one ever does. */
  if (!lessons.length) return null;

  return {
    school,
    look: LOOKS[school],
    stage,
    stages,
    lessons,
    counted: {
      total: lessons.length,
      live: lessons.filter((l) => l.status === "live").length,
      minutes: lessons.reduce((sum, l) => sum + Number(l.minutes ?? 0), 0),
      days: lessons.reduce((sum, l) => sum + l.days, 0),
    },
    prev: stages[stages.findIndex((s) => s.slug === stage.slug) - 1] ?? null,
    next: stages[stages.findIndex((s) => s.slug === stage.slug) + 1] ?? null,
    book: workbookUrl(school, stage),
  };
});

export type Stage = NonNullable<Awaited<ReturnType<typeof getStage>>>;

    /** A whole school: its ladder, its lessons and what has been written
        of it.

        Every number here is counted from the rows, and nothing in `meta`
        is trusted to say how much of anything there is: a hub says how
        many stages a school has and how many lessons are in them, and a
        page that says that in prose stops being true the moment a lesson
        is added. */
export const getSchool = cache(async (school: string) => {
  if (!isSchool(school)) return null;

  const { env } = getCloudflareContext();
  const db = (env as { DB?: D1Database }).DB;
  if (!db) return null;

  const stages = await stagesOf(db, school);
  if (!stages.length) return null;

  const rungs = stages.map((stage) => {
    const lessons = laddered(school, stage);
    return {
      stage,
      lessons,
      url: stageUrl(school, stage),
      total: lessons.length,
      /* "Written" is the body, not the status. A lesson can be
         live and empty, which is the state the builders drew a
         "coming soon" page for, and counting it as written is how
         a school claims prose nobody has typed. */
      written: lessons.filter((l) => l.written === true).length,
      minutes: lessons.reduce((sum, l) => sum + Number(l.minutes ?? 0), 0),
    };
  });

  const lessons = rungs.flatMap((r) => r.lessons);

  return {
    school,
    look: LOOKS[school],
    stages,
    rungs,
    lessons,
    counts: {
      stages: stages.length,
      live: stages.filter((s) => s.status === "live").length,
      lessons: lessons.length,
      minutes: lessons.reduce((sum, l) => sum + Number(l.minutes ?? 0), 0),
    },
  };
});

export type School = NonNullable<Awaited<ReturnType<typeof getSchool>>>;
