/* ============================================================
   school.ts: one lesson of one school, out of D1, and the four
   schools' own words about themselves.

   TRANSITION.md Stage 11.7. The prose moved into the database at
   Stage 8 and `shared/schools.js` has read it since; what did not
   move is the 251 pages, which are still generated files. This is
   the source half of the route that replaces them.

   ---- why a table rather than four routes ----

   The four builders write the same page. Compare `lessonPage()`
   in `aab/learn/build-lessons.mjs` with `teilPage()`,
   `partPage()` and the Quran school's `lessonPage()`: one
   article, one eyebrow, one heading with a drawing in it, one
   blurb, one meta line, the body, a backlink and a prev/next
   pair. What differs is entirely wording and four decisions, and
   every one of those is written down here rather than branched on
   in the component:

     · what the school calls a lesson (a পাঠ, a পর্ব, a দিন)
     · which language sits under the Bangla title
     · which of the school's own scripts the page loads
     · where the last lesson of the last stage points

   Four templates that say the same thing in four files is exactly
   the drift `build-lessons.mjs` was written to stop happening
   between forty hand-copied pages, one level up.
   ============================================================ */

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
  /** Which nav link is marked. The money school has its own
      top-level link; the three language schools are reached
      through Skills, and every generated page of theirs says so. */
  current: "learn" | "in-skills";
  /** The footer note. Three of the four say the same thing about
      being free and keeping progress in your own browser, in the
      words of the language they teach; the money school carries
      the site's disclaimer instead. */
  footer: string;
  /** The prefix of the share card in `/og/`, before the stage's
      slug. `build-og.mjs` both draws these and repoints the pages
      at them, so a value here that disagrees with its ASSIGN
      table is two generators taking turns. */
  og: string;
  /** The school's own script, loaded after `/app.js`. */
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
}

const SOON = "আসছে";

/** The money school's ladder is not days or parts, so its meta
    line is the reading time alone; the other three prefix it with
    the lesson's own label where they have one. */
const minutes = (n: number) => `${bnNum(n)} মিনিটের পড়া`;

/** The stage after this one, or nothing. */
const after = (stage: SchoolStage, stages: SchoolStage[]) =>
  stages[stages.findIndex((s) => s.slug === stage.slug) + 1] ?? null;

export const LOOKS: Record<string, SchoolLook> = {
  learn: {
    title: "শেখার লাইব্রেরি",
    current: "learn",
    footer: "এই সাইটের সবকিছু সাধারণ শিক্ষামূলক তথ্য: বিনিয়োগ পরামর্শ না। "
      + "টাকা কোথাও রাখার আগে নিজে যাচাই করুন।",
    og: "stage-",
    script: "/learn/learn.js",
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
    alt: () => ({ url: "/learn/contents.html", label: "সব বিষয় এক নজরে →" }),
    /* The money school's lesson pages have never pointed anywhere
       past the end of a stage, and that is its own arrangement
       rather than an oversight: its stages are not a course you
       walk through in order, they are six ladders you pick from,
       and `contents.html` is the page that shows all of them. */
    tail: () => null,
  },

  deutsch: {
    title: "জার্মান বাংলায়",
    bodyClass: "deutsch",
    current: "in-skills",
    footer: "জার্মান অংশটা বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া। "
      + "আপনার অগ্রগতি আপনার নিজের ব্রাউজারেই থাকে।",
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
            url: "/deutsch/index.html",
            kicker: "শেষ Teil ✓",
            label: "চারটা স্তর একসাথে দেখুন",
          };
    },
  },

  quran: {
    title: "কুরআনের আরবি",
    bodyClass: "quran",
    current: "in-skills",
    footer: "কুরআনের আরবির অংশটা বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া। "
      + "আপনার অগ্রগতি আপনার নিজের ব্রাউজারেই থাকে।",
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
            url: "/quran/index.html",
            kicker: "ষাট দিন শেষ ✓",
            label: "তিনটা ধাপ একসাথে দেখুন",
          };
    },
  },

  english: {
    title: "ইংরেজি বাংলায়",
    bodyClass: "english",
    current: "in-skills",
    footer: "ইংরেজির অংশটা বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া। "
      + "আপনার অগ্রগতি আপনার নিজের ব্রাউজারেই থাকে।",
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
            url: "/english/index.html",
            kicker: "শেষ পর্ব ✓",
            label: "দুটো টার্ম একসাথে দেখুন",
          };
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
     `/learn/terms/`, because its eighteen term pages were
     published there for a year before that school had a builder
     and a URL somebody shared does not move. So the stage is
     found by the address its lessons actually have, not by
     assuming the segment names it. */
  const wanted = `/${school}/${segment}/${slug}.html`;
  let stage: SchoolStage | undefined;
  let siblings: LadderedLesson[] = [];
  let here = -1;

  for (const candidate of stages) {
    /* An inline stage has no lesson pages at all: its lessons are
       anchors in a hand-written hub. Asking for one as a page is
       a 404 rather than a page that half exists. */
    if (candidate.inline) continue;
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
    prev: siblings[here - 1] ?? null,
    next: siblings[here + 1] ?? null,
  };
});

export type Lesson = NonNullable<Awaited<ReturnType<typeof getLesson>>>;
