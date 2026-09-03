/* ============================================================
   research-pages.ts: every room of the Research Studio, once.

   `RESEARCH.md` section 3 is the floor plan and this is the
   table it points at. The strip across every room and the deck
   on the board are both built from it, so a room added here
   appears in both at once and nowhere can name a different set.
   The same rule as `diet-pages.ts`, whose shape this is.

   `built` is what stage the room lands in. A room whose stage
   has not landed still has its address, its strip entry and its
   card, and the page says honestly that it is coming, because a
   link that vanishes is a room that does not exist as far as a
   reader can tell.
   ============================================================ */

import type { ArtSubject } from "@reiad/shared/art";
import type { Tone } from "@reiad/shared/research";

export interface ResearchPage {
  href: string;
  /** The rail key `Current` and the strip use. */
  key: string;
  tab: { en: string; bn: string };
  title: { en: string; bn: string };
  go: { en: string; bn: string };
  dek: { en: string; bn: string };
  /** One of the seven token names. */
  tone: Tone;
  art: ArtSubject;
  /** The stage that builds it. `1` is open now. */
  stage: number;
  /** Nothing on this room works signed out. */
  needsAccount?: true;
}

export const RESEARCH_HOME = "/tools/research";

/** The front door's own, which is the tools' gold: arriving
    from the rail is not a colour change. */
export const RESEARCH_TONE: Tone = "gold";

export const RESEARCH_PAGES: ResearchPage[] = [
  {
    href: "/tools/research/questions", key: "questions", tone: "violet", art: "arch", stage: 1,
    tab: { en: "Questions", bn: "প্রশ্ন" },
    title: { en: "The questions", bn: "প্রশ্নগুলো" },
    go: { en: "Open", bn: "খুলুন" },
    dek: {
      en: "The research question at the top, hypotheses under it, claims under those, and what in the library speaks to each.",
      bn: "উপরে গবেষণার প্রশ্ন, তার নিচে অনুমান, তার নিচে দাবি, আর লাইব্রেরির কোনটা কোনটার কথা বলে।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/library", key: "library", tone: "green", art: "book", stage: 1,
    tab: { en: "Library", bn: "লাইব্রেরি" },
    title: { en: "The library", bn: "লাইব্রেরি" },
    go: { en: "Open", bn: "খুলুন" },
    dek: {
      en: "Every source, by DOI, ISBN, link, file or Zotero, as one record each, in every citation style at once.",
      bn: "প্রতিটি উৎস, DOI, ISBN, লিংক, ফাইল বা Zotero থেকে, প্রতিটির একটা করে রেকর্ড, একসঙ্গে সব উদ্ধৃতি রীতিতে।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/find", key: "find", tone: "teal", art: "bubbles", stage: 3,
    tab: { en: "Find", bn: "খোঁজ" },
    title: { en: "Find", bn: "খোঁজ" },
    go: { en: "Search", bn: "খুঁজুন" },
    dek: {
      en: "One search over the world's indexes, saved searches, and a weekly alert for what is new.",
      bn: "দুনিয়ার সব সূচিতে এক খোঁজ, রাখা খোঁজ, আর নতুন কী এল তার সাপ্তাহিক খবর।",
    },
  },
  {
    href: "/tools/research/read", key: "read", tone: "blue", art: "sheets", stage: 2,
    tab: { en: "Reading", bn: "পড়া" },
    title: { en: "The reading room", bn: "পড়ার ঘর" },
    go: { en: "Read", bn: "পড়ুন" },
    dek: {
      en: "The queue, and the reader itself: a PDF with five kinds of highlight, notes anchored to the text, and one line at the end.",
      bn: "সারি, আর পাঠকটা নিজে: পাঁচ রকম হাইলাইটসহ PDF, লেখায় গাঁথা নোট, আর শেষে এক লাইন।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/notes", key: "notes", tone: "plum", art: "cards", stage: 1,
    tab: { en: "Notebook", bn: "খাতা" },
    title: { en: "The notebook", bn: "খাতা" },
    go: { en: "Write", bn: "লিখুন" },
    dek: {
      en: "Six kinds of note, the daily log, and the links between them, in the site's own editor.",
      bn: "ছয় রকম নোট, দৈনিক খাতা, আর তাদের মধ্যের যোগ, সাইটের নিজের এডিটরে।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/review", key: "review", tone: "rose", art: "sheets", stage: 7,
    tab: { en: "Review", bn: "রিভিউ" },
    title: { en: "The review room", bn: "রিভিউ ঘর" },
    go: { en: "Open", bn: "খুলুন" },
    dek: {
      en: "A systematic or scoping review from protocol to PRISMA: the search log, screening by keyboard, extraction as a sheet.",
      bn: "প্রোটোকল থেকে PRISMA পর্যন্ত সিস্টেমেটিক বা স্কোপিং রিভিউ: খোঁজের খাতা, কিবোর্ডে বাছাই, শিটে তথ্য তোলা।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/lab", key: "lab", tone: "blue", art: "chart", stage: 8,
    tab: { en: "Lab", bn: "ল্যাব" },
    title: { en: "The lab", bn: "ল্যাব" },
    go: { en: "Open", bn: "খুলুন" },
    dek: {
      en: "Datasets, a real spreadsheet, SQL, regressions, Python in the browser, charts, and every result as a run a draft can point at.",
      bn: "ডেটাসেট, আসল স্প্রেডশিট, SQL, রিগ্রেশন, ব্রাউজারে Python, চার্ট, আর প্রতিটি ফল একটা রান হিসেবে যেটা খসড়া দেখাতে পারে।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/field", key: "field", tone: "green", art: "ridge", stage: 9,
    tab: { en: "Field", bn: "মাঠ" },
    title: { en: "The field room", bn: "মাঠ" },
    go: { en: "Open", bn: "খুলুন" },
    dek: {
      en: "Participants by pseudonym, interviews, transcription, a codebook, coding, memos and surveys.",
      bn: "ছদ্মনামে অংশগ্রহণকারী, সাক্ষাৎকার, ট্রান্সক্রিপশন, কোডবুক, কোডিং, মেমো আর জরিপ।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/write", key: "write", tone: "violet", art: "book", stage: 4,
    tab: { en: "Writing", bn: "লেখা" },
    title: { en: "The writing desk", bn: "লেখার টেবিল" },
    go: { en: "Write", bn: "লিখুন" },
    dek: {
      en: "Chapters and papers with citations that render in any style, footnotes for law, figures that point at runs, and exports to Word.",
      bn: "অধ্যায় আর পেপার, যেকোনো রীতিতে উদ্ধৃতি, আইনের জন্য ফুটনোট, রান দেখানো ছবি, আর Word-এ এক্সপোর্ট।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/plan", key: "plan", tone: "gold", art: "calendar", stage: 5,
    tab: { en: "Planner", bn: "পরিকল্পনা" },
    title: { en: "The planner", bn: "পরিকল্পনা" },
    go: { en: "Plan", bn: "সাজান" },
    dek: {
      en: "Projects, milestones, the task board, meetings, deadlines as facts, and the timeline of the whole thing.",
      bn: "প্রজেক্ট, মাইলফলক, কাজের বোর্ড, মিটিং, তারিখ হিসেবে শেষ দিন, আর পুরোটার সময়রেখা।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/atlas", key: "atlas", tone: "teal", art: "bubbles", stage: 6,
    tab: { en: "Atlas", bn: "মানচিত্র" },
    title: { en: "The atlas", bn: "মানচিত্র" },
    go: { en: "Look", bn: "দেখুন" },
    dek: {
      en: "The graph of everything, the citation network two hops out, the literature on a year axis, a canvas, and the people.",
      bn: "সব কিছুর গ্রাফ, দুই ধাপ দূর পর্যন্ত উদ্ধৃতির জাল, সালের রেখায় সাহিত্য, একটা ক্যানভাস, আর মানুষগুলো।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/tools", key: "workshop", tone: "gold", art: "gauge", stage: 10,
    tab: { en: "Workshop", bn: "যন্ত্রপাতি" },
    title: { en: "The workshop", bn: "যন্ত্রপাতি" },
    go: { en: "Open", bn: "খুলুন" },
    dek: {
      en: "Thirty small tools, one card each: cite this, sample size, a Boolean builder, a Hijri date, a PRISMA drawer.",
      bn: "তিরিশটা ছোট যন্ত্র, প্রতিটির একটা কার্ড: উদ্ধৃতি, নমুনার আকার, বুলিয়ান বিল্ডার, হিজরি তারিখ, PRISMA আঁকা।",
    },
  },
  {
    href: "/tools/research/methods", key: "methods", tone: "plum", art: "cards", stage: 12,
    tab: { en: "Methods", bn: "পদ্ধতি" },
    title: { en: "The methods room", bn: "পদ্ধতি" },
    go: { en: "Learn", bn: "শিখুন" },
    dek: {
      en: "How to do a thing, as a lesson with a worked example, linked from wherever the thing is done.",
      bn: "কীভাবে একটা কাজ করতে হয়, উদাহরণসহ একটা পাঠ হিসেবে, যেখানে কাজটা হয় সেখান থেকে যুক্ত।",
    },
  },
  {
    href: "/tools/research/archive", key: "archive", tone: "rose", art: "plate", stage: 1,
    tab: { en: "Archive", bn: "আর্কাইভ" },
    title: { en: "The archive", bn: "আর্কাইভ" },
    go: { en: "Open", bn: "খুলুন" },
    dek: {
      en: "Everything that happened, every version, the bin, and the way out: a copy of all of it in open formats.",
      bn: "যা যা হয়েছে, প্রতিটি সংস্করণ, বিন, আর বেরোনোর পথ: খোলা ফরম্যাটে সবকিছুর একটা কপি।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/ask", key: "ask", tone: "teal", art: "bubbles", stage: 11,
    tab: { en: "Assistant", bn: "সহকারী" },
    title: { en: "The assistant", bn: "সহকারী" },
    go: { en: "Ask", bn: "জিজ্ঞেস করুন" },
    dek: {
      en: "Reads only what the studio holds, cites only what is there, never writes without a press, and can be sent a draft as a hostile reviewer.",
      bn: "শুধু স্টুডিওতে যা আছে তাই পড়ে, শুধু যা আছে তাই উদ্ধৃত করে, না চাপলে কিছু লেখে না, আর কঠোর পর্যালোচক হিসেবে খসড়া দেখতে পারে।",
    },
    needsAccount: true,
  },
  {
    href: "/tools/research/settings", key: "settings", tone: "gold", art: "gauge", stage: 1,
    tab: { en: "Settings", bn: "সেটিংস" },
    title: { en: "Settings", bn: "সেটিংস" },
    go: { en: "Open", bn: "খুলুন" },
    dek: {
      en: "Your projects, your name on exports, the citation style, the connections, and the bookmarklet.",
      bn: "আপনার প্রজেক্ট, এক্সপোর্টে আপনার নাম, উদ্ধৃতি রীতি, সংযোগ, আর বুকমার্কলেট।",
    },
    needsAccount: true,
  },
];

/** One room, by address. A trailing slash is the same address. */
export const researchPage = (href: string): ResearchPage | undefined =>
  RESEARCH_PAGES.find((p) => p.href === href || `${p.href}/` === href);

/** The rooms that are open today. */
export const OPEN_STAGE = 12;
export const isOpen = (page: ResearchPage): boolean => page.stage <= OPEN_STAGE;
