/* ============================================================
   lib/research-tools.ts: the workshop's table. RESEARCH.md 19.

   Thirty small tools, one card each, each a page under
   /tools/research/tools/<slug>. A tool that belongs to a room
   names it, so the room can open the tool with its data and the
   card can say where the answer goes. The components are in
   components/research/workshop.tsx, keyed by slug; this file is
   what the hub, the routes and the sitemap read.
   ============================================================ */

import type { Tone } from "@reiad/shared/research";

export interface ResearchTool {
  slug: string;
  name: { en: string; bn: string };
  dek: { en: string; bn: string };
  tone: Tone;
  /** The room it belongs to, by the pages table's key. */
  room?: string;
  /** Needs an account: it reads the library or calls the Worker. */
  needsAccount?: boolean;
}

export const RESEARCH_TOOLS: ResearchTool[] = [
  { slug: "cite-this", name: { en: "Cite this", bn: "এটা উদ্ধৃত করুন" }, dek: { en: "A DOI, ISBN or link to a citation in any style, and into the library in one press.", bn: "DOI, ISBN বা লিংক থেকে যেকোনো শৈলীতে উদ্ধৃতি, আর এক চাপে লাইব্রেরিতে।" }, tone: "teal", room: "library", needsAccount: true },
  { slug: "parse-reference", name: { en: "Parse a reference", bn: "রেফারেন্স পড়ুন" }, dek: { en: "A messy pasted reference to a record, by asking Crossref and showing the match's confidence.", bn: "এলোমেলো পেস্ট করা রেফারেন্স থেকে রেকর্ড, Crossref-কে জিজ্ঞেস করে, মিলের আস্থাসহ।" }, tone: "teal", room: "library", needsAccount: true },
  { slug: "resolve-id", name: { en: "Resolve an id", bn: "আইডি চিনুন" }, dek: { en: "DOI, arXiv, PMID, SSRN, OpenAlex, ISBN or ORCID: what it is and where it lives.", bn: "DOI, arXiv, PMID, SSRN, OpenAlex, ISBN বা ORCID: এটা কী আর কোথায় থাকে।" }, tone: "teal", room: "library", needsAccount: true },
  { slug: "free-copy", name: { en: "Find a free copy", bn: "বিনামূল্যের কপি খুঁজুন" }, dek: { en: "Unpaywall's answer for a DOI, with the version it is.", bn: "একটা DOI-এর জন্য Unpaywall-এর উত্তর, কোন সংস্করণ তাসহ।" }, tone: "teal", room: "find", needsAccount: true },
  { slug: "retracted", name: { en: "Is it retracted", bn: "প্রত্যাহৃত কি" }, dek: { en: "Crossref's own record for a DOI, or for the whole library at once.", bn: "একটা DOI-এর জন্য Crossref-এর নিজের রেকর্ড, বা একসাথে পুরো লাইব্রেরির।" }, tone: "rose", room: "library", needsAccount: true },
  { slug: "journal-finder", name: { en: "Journal finder", bn: "জার্নাল খুঁজুন" }, dek: { en: "Journals in OpenAlex by name or concept, with open access, the fee and whether DOAJ lists them.", bn: "নাম বা ধারণা ধরে OpenAlex-এ জার্নাল, উন্মুক্ত প্রবেশ, ফি আর DOAJ-এ আছে কি না।" }, tone: "blue", needsAccount: true },
  { slug: "journal-check", name: { en: "Predatory check", bn: "শিকারি যাচাই" }, dek: { en: "DOAJ membership, the publisher, and the questions to ask. Never a blacklist.", bn: "DOAJ সদস্যপদ, প্রকাশক, আর যে প্রশ্নগুলো করতে হয়। কখনো কালো তালিকা নয়।" }, tone: "rose", needsAccount: true },
  { slug: "boolean-builder", name: { en: "Boolean builder", bn: "বুলিয়ান বিল্ডার" }, dek: { en: "A search string from fields and operators, in each database's syntax, kept as a search.", bn: "ক্ষেত্র আর অপারেটর থেকে খোঁজার শব্দ, প্রতিটা ডেটাবেসের নিয়মে, খোঁজ হিসেবে রাখা।" }, tone: "violet", room: "review" },
  { slug: "question-builder", name: { en: "Question builder", bn: "প্রশ্ন বিল্ডার" }, dek: { en: "PICO, SPIDER and PEO frames into a question and criteria, into a review in one press.", bn: "PICO, SPIDER আর PEO কাঠামো থেকে প্রশ্ন আর মানদণ্ড, এক চাপে পর্যালোচনায়।" }, tone: "violet", room: "review" },
  { slug: "sample-size", name: { en: "Sample size and power", bn: "নমুনার আকার ও শক্তি" }, dek: { en: "For a proportion, a mean, two groups, a correlation and a regression, with the assumptions written out.", bn: "অনুপাত, গড়, দুই দল, সহসম্পর্ক আর রিগ্রেশনের জন্য, অনুমানগুলো লেখা।" }, tone: "blue", room: "lab" },
  { slug: "effect-size", name: { en: "Effect size converter", bn: "প্রভাবের আকার রূপান্তর" }, dek: { en: "d, r, eta squared, f and odds ratio, with confidence intervals.", bn: "d, r, ইটা-বর্গ, f আর অডস রেশিও, আস্থার ব্যবধানসহ।" }, tone: "blue", room: "lab" },
  { slug: "p-and-ci", name: { en: "p to CI, CI to p", bn: "p থেকে CI, CI থেকে p" }, dek: { en: "The conversions a reader does on the back of a paper.", bn: "যে রূপান্তর একজন পাঠক কাগজের পেছনে করে।" }, tone: "blue", room: "lab" },
  { slug: "which-test", name: { en: "Which test", bn: "কোন পরীক্ষা" }, dek: { en: "From the data's shape to a test, and to the lab's own method where it has one.", bn: "তথ্যের আকার থেকে পরীক্ষা, আর ল্যাবের নিজের পদ্ধতিতে যেখানে আছে।" }, tone: "blue", room: "lab" },
  { slug: "returns", name: { en: "Returns", bn: "রিটার্ন" }, dek: { en: "Prices to simple and log returns, with a chart.", bn: "দাম থেকে সরল আর লগ রিটার্ন, চার্টসহ।" }, tone: "gold", room: "lab" },
  { slug: "calculators", name: { en: "Currency and inflation", bn: "মুদ্রা ও মুদ্রাস্ফীতি" }, dek: { en: "The site's own calculators, opened with the studio's numbers.", bn: "সাইটের নিজের ক্যালকুলেটর, স্টুডিওর সংখ্যা দিয়ে খোলা।" }, tone: "gold" },
  { slug: "hijri", name: { en: "Hijri and Gregorian", bn: "হিজরি ও গ্রেগরিয়ান" }, dek: { en: "Dates both ways, for sources dated in the Islamic calendar.", bn: "দুই দিকেই তারিখ, ইসলামি বর্ষপঞ্জিতে তারিখ দেওয়া উৎসের জন্য।" }, tone: "green" },
  { slug: "dates", name: { en: "Date arithmetic", bn: "তারিখের হিসাব" }, dek: { en: "Days between, working days between, a deadline minus a buffer.", bn: "মাঝের দিন, কাজের দিন, বাফার বাদে সময়সীমা।" }, tone: "green", room: "plan" },
  { slug: "words", name: { en: "Word counter", bn: "শব্দ গণনা" }, dek: { en: "Words, characters and reading time, in both scripts, on any pasted text.", bn: "শব্দ, অক্ষর আর পড়ার সময়, দুই লিপিতে, যেকোনো পেস্ট করা লেখায়।" }, tone: "plum" },
  { slug: "abbreviations", name: { en: "Abbreviations", bn: "সংক্ষেপ" }, dek: { en: "A text's abbreviations as a list, and the ones used before they were defined.", bn: "লেখার সংক্ষেপগুলোর তালিকা, আর যেগুলো সংজ্ঞার আগে ব্যবহার হয়েছে।" }, tone: "plum", room: "write" },
  { slug: "readability", name: { en: "Readability", bn: "পাঠযোগ্যতা" }, dek: { en: "Sentence length and passive voice on a text, as facts, no grade.", bn: "লেখায় বাক্যের দৈর্ঘ্য আর কর্মবাচ্য, তথ্য হিসেবে, কোনো গ্রেড নয়।" }, tone: "plum", room: "write" },
  { slug: "self-overlap", name: { en: "Self-overlap", bn: "নিজের সাথে মিল" }, dek: { en: "Runs of words a pasted text shares with your own documents.", bn: "পেস্ট করা লেখার সাথে আপনার নিজের নথির মিলে যাওয়া শব্দের ধারা।" }, tone: "plum", room: "write", needsAccount: true },
  { slug: "table-maker", name: { en: "Table maker", bn: "টেবিল বানান" }, dek: { en: "A grid to Markdown, HTML and LaTeX.", bn: "একটা ছক থেকে Markdown, HTML আর LaTeX।" }, tone: "plum", room: "write" },
  { slug: "equation", name: { en: "Equation editor", bn: "সমীকরণ সম্পাদক" }, dek: { en: "LaTeX in, kept as source, copied for the desk.", bn: "LaTeX লিখুন, সোর্স হিসেবে রাখা, ডেস্কের জন্য কপি।" }, tone: "plum", room: "write" },
  { slug: "prisma-drawer", name: { en: "PRISMA drawer", bn: "PRISMA আঁকুন" }, dek: { en: "The flow diagram from typed counts, for a review not run here.", bn: "টাইপ করা সংখ্যা থেকে প্রবাহ চিত্র, এখানে না করা পর্যালোচনার জন্য।" }, tone: "violet", room: "review" },
  { slug: "quiz-me", name: { en: "Quiz me", bn: "আমাকে প্রশ্ন করুন" }, dek: { en: "Flashcards with spaced repetition, for the viva and for a new field's vocabulary.", bn: "ব্যবধান দিয়ে পুনরাবৃত্তির ফ্ল্যাশকার্ড, মৌখিক পরীক্ষা আর নতুন ক্ষেত্রের শব্দভাণ্ডারের জন্য।" }, tone: "gold", needsAccount: true },
  { slug: "viva-bank", name: { en: "Viva bank", bn: "মৌখিকের ভাণ্ডার" }, dek: { en: "The questions an examiner asks, with your own answers kept beside each.", bn: "পরীক্ষক যা জিজ্ঞেস করেন, পাশে আপনার নিজের উত্তরসহ।" }, tone: "gold", needsAccount: true },
  { slug: "ethics-helper", name: { en: "Ethics helper", bn: "নীতিশাস্ত্র সহায়" }, dek: { en: "A data statement and a consent form from a template, in both languages.", bn: "ছক থেকে তথ্য বিবৃতি আর সম্মতিপত্র, দুই ভাষায়।" }, tone: "green", room: "field" },
  { slug: "email-templates", name: { en: "Email templates", bn: "ইমেইল ছক" }, dek: { en: "A request to an author, a note to a supervisor, a cover letter, with your details from Settings.", bn: "লেখকের কাছে অনুরোধ, তত্ত্বাবধায়ককে নোট, কভার লেটার, Settings থেকে আপনার তথ্যসহ।" }, tone: "gold", needsAccount: true },
  { slug: "cv", name: { en: "CV and publications", bn: "সিভি ও প্রকাশনা" }, dek: { en: "A publications section built from your own sources where you are an author.", bn: "আপনার নিজের উৎস থেকে গড়া প্রকাশনার অংশ, যেখানে আপনি লেখক।" }, tone: "gold", room: "library", needsAccount: true },
  { slug: "random", name: { en: "Random and sampling", bn: "এলোমেলো ও নমুনা" }, dek: { en: "Random numbers, a random sample of rows, a random order, with the seed shown.", bn: "এলোমেলো সংখ্যা, সারির এলোমেলো নমুনা, এলোমেলো ক্রম, বীজ দেখানো।" }, tone: "green", room: "lab" },
];

export const researchTool = (slug: string): ResearchTool | undefined => RESEARCH_TOOLS.find((t) => t.slug === slug);
