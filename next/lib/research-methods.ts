/* ============================================================
   lib/research-methods.ts: the methods room's table. RESEARCH.md 20.

   A method is a piece written in the Article Studio with the tag
   `method`, held in D1 like every piece. This table is the twelve
   the plan names first, by kind, with the tools and rooms each one
   is the "how to" for: the room lists the table and upgrades a
   card to a link when a live piece carries its slug, and a tool
   page or a room's head links here by slug. `check-research.ts`
   fails on a method naming a tool or a room that does not exist.
   ============================================================ */

import type { Tone } from "@reiad/shared/research";

export const METHOD_KINDS = ["finding", "reading", "quantitative", "qualitative", "writing", "citing"] as const;
export type MethodKind = typeof METHOD_KINDS[number];

export const KIND_TONE: Record<MethodKind, Tone> = { finding: "teal", reading: "blue", quantitative: "gold", qualitative: "green", writing: "violet", citing: "rose" };

export interface ResearchMethod {
  /** The piece's slug, which is also the card's anchor here. */
  slug: string;
  kind: MethodKind;
  title: { en: string; bn: string };
  dek: { en: string; bn: string };
  /** Workshop tools this is the method behind, by slug. */
  tools?: string[];
  /** Rooms whose head links it, by the pages table's key. */
  rooms?: string[];
}

/** A lesson written HERE, in the article vocabulary, for a method
    no piece covers yet. `next/lib/methods/<slug>.ts` is one each and
    `next/lib/methods/index.ts` is the list; a live piece with the
    same slug wins over it, so the room never shows two. */
export interface MethodLesson {
  slug: string;
  /** Reading time, whole minutes. */
  minutes: number;
  /** Article HTML: only classes `@layer article` styles. */
  en: string;
  bn: string;
}

export const RESEARCH_METHODS: ResearchMethod[] = [
  { slug: "reading-a-paper-in-an-hour", kind: "reading", title: { en: "Reading a paper in an hour", bn: "এক ঘণ্টায় একটা কাগজ পড়া" },
    dek: { en: "Three passes, what to write after each, and the one line that says whether it was worth the hour.", bn: "তিন বার পড়া, প্রতিবারের পরে কী লিখবেন, আর যে এক লাইন বলে ঘণ্টাটা সার্থক কি না।" }, rooms: ["read", "library"] },
  { slug: "a-literature-note-worth-keeping", kind: "reading", title: { en: "A literature note that is worth keeping", bn: "রাখার মতো পড়ার নোট" },
    dek: { en: "What goes in it, what stays in the highlight, and why a note in your own words outlives a quotation.", bn: "তাতে কী থাকে, হাইলাইটে কী থাকে, আর নিজের কথায় লেখা নোট কেন উদ্ধৃতির চেয়ে বেশি দিন টেকে।" }, rooms: ["notes", "read"] },
  { slug: "search-string-for-a-systematic-review", kind: "finding", title: { en: "A search string for a systematic review", bn: "সিস্টেম্যাটিক রিভিউয়ের খোঁজার শব্দ" },
    dek: { en: "Concepts ANDed, synonyms ORed, one string a database, and the log that lets somebody repeat it.", bn: "ধারণাগুলো AND, প্রতিশব্দগুলো OR, প্রতি ডেটাবেসে একটা শব্দমালা, আর যে লগ দিয়ে আরেকজন এটা আবার করতে পারে।" }, tools: ["boolean-builder", "question-builder"], rooms: ["find", "review"] },
  { slug: "screening-without-losing-your-mind", kind: "finding", title: { en: "Screening without losing your mind", bn: "মাথা ঠিক রেখে বাছাই" },
    dek: { en: "Title and abstract first, criteria written before the first record, a reason on every exclusion, and PRISMA out of the counts.", bn: "আগে শিরোনাম আর সারাংশ, প্রথম রেকর্ডের আগেই মানদণ্ড লেখা, প্রতিটি বাদে একটা কারণ, আর গণনা থেকে PRISMA।" }, tools: ["prisma-drawer"], rooms: ["review"] },
  { slug: "ols-and-robust-errors", kind: "quantitative", title: { en: "OLS and what the robust errors are for", bn: "OLS আর রোবাস্ট ত্রুটি কীসের জন্য" },
    dek: { en: "A regression you can change, the assumptions in plain words, and where the standard error comes from.", bn: "যে রিগ্রেশন আপনি বদলাতে পারেন, সহজ কথায় অনুমানগুলো, আর স্ট্যান্ডার্ড এরর কোথা থেকে আসে।" }, tools: ["which-test", "sample-size"], rooms: ["lab"] },
  { slug: "factor-regression-and-beta", kind: "quantitative", title: { en: "A factor regression and what a beta means", bn: "ফ্যাক্টর রিগ্রেশন আর বিটা মানে কী" },
    dek: { en: "Excess returns on the market, a beta as a slope, and why a beta of 1.3 is a sentence about risk.", bn: "বাজারের ওপর অতিরিক্ত রিটার্ন, ঢাল হিসেবে বিটা, আর ১.৩ বিটা কেন ঝুঁকি নিয়ে একটা বাক্য।" }, tools: ["returns"], rooms: ["lab"] },
  { slug: "csad-herding-step-by-step", kind: "quantitative", title: { en: "CSAD herding, step by step", bn: "CSAD হার্ডিং, ধাপে ধাপে" },
    dek: { en: "Cross-sectional absolute deviation from daily returns, the quadratic term, and what a negative coefficient says.", bn: "দৈনিক রিটার্ন থেকে ক্রস-সেকশনাল অ্যাবসোলিউট ডেভিয়েশন, বর্গ পদ, আর ঋণাত্মক সহগ কী বলে।" }, tools: ["returns"], rooms: ["lab"] },
  { slug: "event-study-by-hand", kind: "quantitative", title: { en: "An event study by hand", bn: "হাতে হাতে ইভেন্ট স্টাডি" },
    dek: { en: "The estimation window, the event window, abnormal returns and their cumulative sum, worked on one announcement.", bn: "এস্টিমেশন উইন্ডো, ইভেন্ট উইন্ডো, অস্বাভাবিক রিটার্ন আর তার সঞ্চিত যোগফল, একটা ঘোষণায় করে দেখানো।" }, rooms: ["lab"] },
  { slug: "thematic-analysis-in-six-steps", kind: "qualitative", title: { en: "Thematic analysis in six steps", bn: "ছয় ধাপে থিম্যাটিক বিশ্লেষণ" },
    dek: { en: "Braun and Clarke's six, on one transcript, with the memo written at each step.", bn: "ব্রাউন আর ক্লার্কের ছয় ধাপ, একটা ট্রান্সক্রিপ্টে, প্রতি ধাপে লেখা মেমোসহ।" }, rooms: ["field"] },
  { slug: "a-codebook-another-person-could-apply", kind: "qualitative", title: { en: "A codebook that another person could apply", bn: "অন্য কেউ প্রয়োগ করতে পারে এমন কোডবই" },
    dek: { en: "A definition, an example, a near-miss and a rule for the edge, for every code.", bn: "প্রতিটি কোডের জন্য একটা সংজ্ঞা, একটা উদাহরণ, একটা প্রায়-মিল আর সীমানার নিয়ম।" }, rooms: ["field"] },
  { slug: "a-citation-in-oscola", kind: "citing", title: { en: "A citation in OSCOLA", bn: "OSCOLA-য় একটা উদ্ধৃতি" },
    dek: { en: "A case, a statute, an article and a book, in a footnote and in the table, and what ibid is allowed to do.", bn: "একটা মামলা, একটা আইন, একটা নিবন্ধ আর একটা বই, ফুটনোটে আর তালিকায়, আর ibid কী করতে পারে।" }, tools: ["cite-this"], rooms: ["write", "library"] },
  { slug: "chapter-outline-from-a-question-tree", kind: "writing", title: { en: "A chapter outline from a question tree", bn: "প্রশ্নের গাছ থেকে অধ্যায়ের রূপরেখা" },
    dek: { en: "Each sub-question a section, each piece of evidence a paragraph, and the budget in words before the first sentence.", bn: "প্রতিটি উপ-প্রশ্ন একটা অংশ, প্রতিটি প্রমাণ একটা অনুচ্ছেদ, আর প্রথম বাক্যের আগেই শব্দের বাজেট।" }, rooms: ["write", "questions"] },
];

/** The methods behind a tool, or the ones a room's head links. */
export const researchMethod = (slug: string): ResearchMethod | undefined => RESEARCH_METHODS.find((m) => m.slug === slug);

export const methodsFor = (of: { tool?: string; room?: string }): ResearchMethod[] =>
  RESEARCH_METHODS.filter((m) => (of.tool ? m.tools?.includes(of.tool) : false) || (of.room ? m.rooms?.includes(of.room) : false));

/** A live piece is a method by its tag or a topic, either spelling
    the Studio might give it. */
export const isMethodPiece = (p: { tag?: string | null; topics?: string | string[] | null }): boolean =>
  String(p.tag ?? "").trim().toLowerCase() === "method"
  || (Array.isArray(p.topics) ? p.topics : String(p.topics ?? "").split("|")).map((t) => t.trim().toLowerCase()).includes("method");
