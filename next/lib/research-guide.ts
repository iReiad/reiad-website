/* ============================================================
   research-guide.ts: what the "i" in every room opens.

   `RESEARCH.md` is the plan and this is the reader's half of
   it: what a room is for, what to press, and the three rules
   under all of it. One table, so the guide cannot say a room
   the studio does not have and cannot miss one it does:
   `scripts/check-research.ts` fails on either.

   Keyed by `key` in `research-pages.ts`, plus `board` for the
   front door, which is a room without a row there.

   It is not in `shared/`. The Android app draws its own rooms
   from `research-words.ts`; this is chrome for the web page,
   and putting it beside the pages table is what keeps the two
   in step.
   ============================================================ */

import type { Word } from "@reiad/shared/research";

/** A key a reader presses, and what it does. `press` is the key
    itself and is never translated. */
export interface GuideKey { press: string; does: Word }

export interface RoomGuide {
  /** `key` in `research-pages.ts`, or `board`. */
  key: string;
  /** One sentence: what the room is for. */
  does: Word;
  /** What to do, in order. */
  steps: Word[];
  keys?: GuideKey[];
  /** The one thing that is worth knowing before it bites. */
  note?: Word;
}

/* ---------- the three rules ---------- */

export const GUIDE_LAWS: { title: Word; body: Word }[] = [
  {
    title: {
      en: "Nothing typed that could have been picked",
      bn: "যা বেছে নেওয়া যায়, তা টাইপ করা হয় না",
    },
    body: {
      en: "A source arrives by DOI, ISBN, link, search result, file or a pasted reference. A citation points at a source row rather than being a string, and a figure in a draft points at the run that made it.",
      bn: "উৎস আসে DOI, ISBN, লিংক, খোঁজের ফল, ফাইল বা পেস্ট করা রেফারেন্স থেকে। উদ্ধৃতি একটা উৎসের সারির দিকে দেখায়, স্ট্রিং নয়, আর খসড়ার একটা সংখ্যা যে রান থেকে এসেছে সেটাই দেখায়।",
    },
  },
  {
    title: {
      en: "Nothing counts down and nothing turns red",
      bn: "কিছু গুনে কমে না, কিছু লাল হয় না",
    },
    body: {
      en: "No streak, no missed day announced. A deadline is a date with the distance to it written as a fact, and a word budget is a meter that fills. Nothing here can be failed.",
      bn: "কোনো স্ট্রিক নেই, মিস করা দিনের কোনো ঘোষণা নেই। শেষ তারিখ একটা তথ্য, আর শব্দের বাজেট একটা মিটার যেটা ভরে। এখানে কিছুই ব্যর্থ করা যায় না।",
    },
  },
  {
    title: {
      en: "The account is the record, the browser is a mirror",
      bn: "রেকর্ড অ্যাকাউন্টের, ব্রাউজার শুধু আয়না",
    },
    body: {
      en: "Every row is yours alone and reaches every device you sign in on. There is no Save button anywhere: a write lands as it is made, and the archive keeps a line for each one.",
      bn: "প্রতিটা সারি শুধু আপনার, আর যে ডিভাইসে সাইন ইন করবেন সেখানেই পৌঁছায়। কোথাও কোনো Save বোতাম নেই: লেখামাত্র রাখা হয়, আর আর্কাইভে তার এক লাইন থাকে।",
    },
  },
];

/* ---------- the first day ---------- */

export const GUIDE_START: Word[] = [
  {
    en: "Sign in, then open the board. Nothing can be kept signed out.",
    bn: "সাইন ইন করুন, তারপর বোর্ড খুলুন। সাইন ইন ছাড়া কিছু রাখা যায় না।",
  },
  {
    en: "In Settings, make a project: a degree, a paper, a book, an application, a review or a replication.",
    bn: "সেটিংসে একটা প্রজেক্ট বানান: ডিগ্রি, পেপার, বই, আবেদন, রিভিউ বা রেপ্লিকেশন।",
  },
  {
    en: "Set your name for exports, your affiliation, your ORCID and the citation style. APA, Harvard, Chicago, MLA, IEEE and OSCOLA are all here.",
    bn: "এক্সপোর্টে আপনার নাম, প্রতিষ্ঠান, ORCID আর উদ্ধৃতি রীতি ঠিক করুন। APA, Harvard, Chicago, MLA, IEEE আর OSCOLA সবই আছে।",
  },
  {
    en: "Bring in the first source: paste a DOI, pull your Zotero library, or drop a .bib file on the list.",
    bn: "প্রথম উৎসটা আনুন: একটা DOI পেস্ট করুন, Zotero লাইব্রেরি টানুন, বা তালিকার উপর একটা .bib ফাইল ছেড়ে দিন।",
  },
  {
    en: "Write the research question in the questions room, hypotheses under it, claims under those. After that every source is evidence for one of them.",
    bn: "প্রশ্নের ঘরে গবেষণার প্রশ্নটা লিখুন, তার নিচে অনুমান, তার নিচে দাবি। এরপর থেকে প্রতিটা উৎস তার কোনো একটার প্রমাণ।",
  },
];

/* ---------- the rooms ---------- */

export const GUIDE_ROOMS: RoomGuide[] = [
  {
    key: "board",
    does: {
      en: "The front door: today's lane, the inbox, what you last opened, and one search over everything.",
      bn: "সামনের দরজা: আজকের লেন, ইনবক্স, শেষ যা খুলেছিলেন, আর সব কিছুর উপর এক খোঁজ।",
    },
    steps: [
      {
        en: "Put anything into the capture line. It decides what it is: a DOI or ISBN is looked up and filed as a source, a link is clipped, a pasted reference is parsed, a line starting with todo is a task in this week's lane, and anything else is a capture in the inbox.",
        bn: "টুকে রাখার লাইনে যা খুশি লিখুন। সে নিজেই বোঝে সেটা কী: DOI বা ISBN খুঁজে উৎস হিসেবে রাখে, লিংক ক্লিপ করে, পেস্ট করা রেফারেন্স পড়ে নেয়, todo দিয়ে শুরু লাইন এই সপ্তাহের কাজ, আর বাকি সব ইনবক্সে একটা টুকরো।",
      },
      {
        en: "It says which of those it decided, so a wrong guess is visible rather than silent.",
        bn: "সে কোনটা ঠিক করল তা বলে দেয়, তাই ভুল আন্দাজ চোখের আড়ালে থাকে না।",
      },
      {
        en: "The inbox's job is to become empty: send each capture on to a note, a question or a source.",
        bn: "ইনবক্সের কাজ খালি হয়ে যাওয়া: প্রতিটা টুকরো নোট, প্রশ্ন বা উৎসে পাঠিয়ে দিন।",
      },
      {
        en: "The search box reaches sources, notes, questions and tasks by any word inside them.",
        bn: "খোঁজের বাক্স উৎস, নোট, প্রশ্ন আর কাজের ভেতরের যেকোনো শব্দ ধরে খোঁজে।",
      },
    ],
    keys: [{ press: "c", does: { en: "the capture line", bn: "টুকে রাখার লাইনে কার্সর" } }],
  },
  {
    key: "questions",
    does: {
      en: "The research question at the top, hypotheses under it, claims under those, and what in the library speaks to each.",
      bn: "উপরে গবেষণার প্রশ্ন, তার নিচে অনুমান, তার নিচে দাবি, আর লাইব্রেরির কোনটা কার কথা বলে।",
    },
    steps: [
      {
        en: "The tree holds four kinds: a question, a hypothesis, a claim and a variable, each open, parked or answered.",
        bn: "গাছে চার রকম: প্রশ্ন, অনুমান, দাবি আর চলক, প্রতিটার অবস্থা চলছে, থামানো বা উত্তর পাওয়া।",
      },
      {
        en: "Add evidence by picking a source and saying what it does: supports, contradicts, gives a method, or gives context.",
        bn: "প্রমাণ যোগ করতে একটা উৎস বেছে বলুন সেটা কী করে: সমর্থন করে, খণ্ডন করে, পদ্ধতি দেয়, না প্রেক্ষাপট দেয়।",
      },
      {
        en: "The argument map is those marks as a grid: questions down the side, sources across the top.",
        bn: "যুক্তির মানচিত্র সেই চিহ্নগুলোরই ছক: পাশে প্রশ্ন, উপরে উৎস।",
      },
      {
        en: "The gap matrix is derived from the library and never maintained: the empty cells are the gaps.",
        bn: "ফাঁকের ছক লাইব্রেরি থেকেই গড়া, আলাদা করে রাখতে হয় না: খালি ঘরগুলোই ফাঁক।",
      },
      {
        en: "Variables name every construct and how it is measured, and the lab offers those names when a column is described.",
        bn: "চলকের তালিকা বলে কোন ধারণা কীভাবে মাপা হয়, আর ল্যাবে কলাম বর্ণনার সময় সেই নামগুলোই আসে।",
      },
    ],
    keys: [
      { press: "n", does: { en: "a new question", bn: "নতুন প্রশ্ন" } },
      { press: "f", does: { en: "filter", bn: "ছাঁকুন" } },
      { press: "j k", does: { en: "down and up the list", bn: "তালিকায় ওঠানামা" } },
    ],
  },
  {
    key: "library",
    does: {
      en: "Every source as one record, kept whole as CSL-JSON, so every citation style is a rendering rather than a retyping.",
      bn: "প্রতিটা উৎসের একটা রেকর্ড, CSL-JSON হিসেবে পুরোটা রাখা, তাই প্রতিটা উদ্ধৃতি রীতি নতুন করে লেখা নয়, শুধু আঁকা।",
    },
    steps: [
      {
        en: "Six ways in: a DOI or ISBN, a link, a pasted BibTeX, RIS or CSL record, a .bib, .ris or .json file dropped on the list, a Zotero pull from Settings, or the bookmarklet on a paper's own page.",
        bn: "ছয়টা পথ: DOI বা ISBN, একটা লিংক, পেস্ট করা BibTeX, RIS বা CSL রেকর্ড, তালিকার উপর ছেড়ে দেওয়া .bib, .ris বা .json ফাইল, সেটিংস থেকে Zotero টানা, বা কোনো পেপারের পাতায় বুকমার্কলেট।",
      },
      {
        en: "A source page holds its reading status, its priority, your rating, why you saved it, and where the record came from.",
        bn: "উৎসের পাতায় থাকে পড়ার অবস্থা, অগ্রাধিকার, আপনার মূল্যায়ন, কেন রাখলেন, আর রেকর্ডটা কোন পথে এসেছে।",
      },
      {
        en: "Twenty types, including the ones with no DOI: a case, a statute, a standard, a fatwa, the Qur'an, a hadith, an interview, a dataset.",
        bn: "বিশ রকম ধরন, যেগুলোর DOI নেই সেগুলোসহ: মামলা, আইন, স্ট্যান্ডার্ড, ফতোয়া, কুরআন, হাদিস, সাক্ষাৎকার, ডেটাসেট।",
      },
      {
        en: "Add a PDF to a source and it joins the reading queue. Copy the record as BibTeX or RIS at any time.",
        bn: "কোনো উৎসে PDF যোগ করলে সেটা পড়ার সারিতে চলে আসে। রেকর্ডটা যেকোনো সময় BibTeX বা RIS হিসেবে কপি করা যায়।",
      },
    ],
    keys: [
      { press: "f", does: { en: "filter", bn: "ছাঁকুন" } },
      { press: "j k", does: { en: "down and up the list", bn: "তালিকায় ওঠানামা" } },
    ],
    note: {
      en: "A citation key is made once and never regenerated, because a draft's citations hold it. Removed sources sit in the bin for thirty days.",
      bn: "উদ্ধৃতি কী একবারই তৈরি হয় আর বদলায় না, কারণ খসড়ার উদ্ধৃতিগুলো সেটাই ধরে রাখে। সরানো উৎস তিরিশ দিন বিনে থাকে।",
    },
  },
  {
    key: "find",
    does: {
      en: "One search over the world's indexes, with the answers merged, plus saved searches and a weekly alert.",
      bn: "দুনিয়ার সূচিগুলোতে এক খোঁজ, উত্তরগুলো মিলিয়ে দেওয়া, সঙ্গে রাখা খোঁজ আর সাপ্তাহিক খবর।",
    },
    steps: [
      {
        en: "Type words from the title, the abstract or the topic. Narrow by author, by year, by type, or to free copies only.",
        bn: "শিরোনাম, সারাংশ বা বিষয়ের শব্দ লিখুন। লেখক, সাল, ধরন, বা শুধু বিনামূল্যের কপি দিয়ে ছাঁকুন।",
      },
      {
        en: "A row already in your library says so with its status. Press Add on the rest.",
        bn: "যে সারি আগেই লাইব্রেরিতে আছে সে নিজেই তা বলে, অবস্থাসহ। বাকিগুলোতে Add চাপুন।",
      },
      {
        en: "An index that did not answer says so rather than looking like an empty result.",
        bn: "যে সূচি উত্তর দেয়নি সে তা বলে দেয়, ফাঁকা ফলাফলের মতো দেখায় না।",
      },
      {
        en: "Keep a search and it becomes a line of a review's search log. Switch its alert on and it reruns every Monday, with what is new landing in the inbox.",
        bn: "খোঁজটা রেখে দিলে সেটা রিভিউয়ের খোঁজের লগের এক লাইন হয়। খবর চালু করলে প্রতি সোমবার আবার চলে, আর নতুন যা আসে ইনবক্সে জমা হয়।",
      },
      {
        en: "Beside a result: related work, who cited it, and what it cites.",
        bn: "একটা ফলের পাশে: সম্পর্কিত কাজ, কারা উদ্ধৃত করেছে, আর সে কাদের উদ্ধৃত করেছে।",
      },
    ],
    keys: [{ press: "f", does: { en: "the search box", bn: "খোঁজের বাক্সে কার্সর" } }],
  },
  {
    key: "read",
    does: {
      en: "The queue, and the reader itself: five kinds of highlight, notes anchored to the text, and one line at the end.",
      bn: "সারি, আর পাঠকটা নিজে: পাঁচ রকম হাইলাইট, লেখায় গাঁথা নোট, আর শেষে এক লাইন।",
    },
    steps: [
      {
        en: "The queue holds every source with something to read, the important ones first. Enter opens the top one.",
        bn: "সারিতে পড়ার মতো কিছু আছে এমন প্রতিটা উৎস, জরুরিগুলো আগে। Enter চাপলে প্রথমটা খোলে।",
      },
      {
        en: "Select text and press 1 to 5: a claim, evidence, a method, a quote, a question. Each has its own colour.",
        bn: "লেখা বাছাই করে ১ থেকে ৫ চাপুন: দাবি, প্রমাণ, পদ্ধতি, উদ্ধৃতি, প্রশ্ন। প্রতিটার নিজের রং।",
      },
      {
        en: "Beside a highlight, write a note or fill an extraction card: the number, its unit, the sample size, the method, and the finding in one line.",
        bn: "হাইলাইটের পাশে নোট লিখুন, বা নিষ্কাশন কার্ড ভরুন: সংখ্যা, একক, নমুনার আকার, পদ্ধতি, আর ফলাফল এক লাইনে।",
      },
      {
        en: "A book is typed from the page and marked as typed. A recording is marked from one time to another.",
        bn: "বই থেকে পাতা আর অনুচ্ছেদ টাইপ করলে সেটা টাইপ করা হিসেবে চিহ্নিত হয়। রেকর্ডিংয়ে হাইলাইট এক সময় থেকে আরেক সময় পর্যন্ত।",
      },
      {
        en: "At the end it asks once what this said, in one line. Your answer becomes the first line of the literature note.",
        bn: "শেষে একবার জিজ্ঞেস করে এটা কী বলল, এক লাইনে। আপনার উত্তরটাই পড়ার নোটের প্রথম লাইন।",
      },
    ],
    keys: [
      { press: "1 2 3 4 5", does: { en: "claim, evidence, method, quote, question", bn: "দাবি, প্রমাণ, পদ্ধতি, উদ্ধৃতি, প্রশ্ন" } },
      { press: "j k", does: { en: "next and previous page", bn: "পরের আর আগের পাতা" } },
    ],
    note: {
      en: "A highlight is anchored to the words and not to the pixels, so it survives a new copy of the file. A scanned PDF with no text layer cannot be selected, and the page says so.",
      bn: "হাইলাইট পিক্সেলে নয়, শব্দে গাঁথা, তাই ফাইলের নতুন কপিতেও থেকে যায়। লেখার স্তর নেই এমন স্ক্যান করা PDF-এ বাছাই করা যায় না, আর পাতাটা সেটা বলে দেয়।",
    },
  },
  {
    key: "notes",
    does: {
      en: "Nine kinds of note, the daily log, and the links between them, in the site's own editor.",
      bn: "নয় রকম নোট, দৈনিক খাতা, আর তাদের মধ্যেকার যোগ, সাইটের নিজের এডিটরে।",
    },
    steps: [
      {
        en: "The kinds: a capture, a literature note, a permanent note, the daily log, a meeting, a memo, a transcript, a prompt, and an assistant's answer.",
        bn: "ধরনগুলো: টুকরো, পড়ার নোট, স্থায়ী নোট, দৈনিক খাতা, মিটিং, মেমো, ট্রান্সক্রিপ্ট, প্রম্পট, আর সহকারীর উত্তর।",
      },
      {
        en: "A note can say which source it is about, and both what it links to and what links to it are shown.",
        bn: "একটা নোট কোন উৎস নিয়ে তা বলা যায়, আর সে কোথায় যুক্ত ও কোথা থেকে যুক্ত, দুটোই দেখানো হয়।",
      },
      {
        en: "The daily log opens on a template: time spent, what I did, what I learned, what is blocking me, tomorrow's first task.",
        bn: "দৈনিক খাতা একটা ছক নিয়ে খোলে: কত সময়, কী করলাম, কী শিখলাম, কোথায় আটকে আছি, কালকের প্রথম কাজ।",
      },
      {
        en: "A version is kept every ten minutes of typing, and the archive lists them.",
        bn: "টাইপ করার প্রতি দশ মিনিটে একটা সংস্করণ রাখা হয়, আর আর্কাইভে সেগুলো তালিকাভুক্ত।",
      },
    ],
    keys: [
      { press: "n", does: { en: "a new note", bn: "নতুন নোট" } },
      { press: "f", does: { en: "filter", bn: "ছাঁকুন" } },
      { press: "j k", does: { en: "down and up the list", bn: "তালিকায় ওঠানামা" } },
    ],
  },
  {
    key: "review",
    does: {
      en: "A systematic, scoping or narrative review from protocol to PRISMA, in seven steps left to right.",
      bn: "প্রোটোকল থেকে PRISMA পর্যন্ত সিস্টেম্যাটিক, স্কোপিং বা বর্ণনামূলক রিভিউ, বাঁ থেকে ডানে সাত ধাপে।",
    },
    steps: [
      {
        en: "Protocol: the question in a frame (PICO, SPIDER or PEO), the criteria with an id each, the databases, the dates and the languages. A line starting with a minus is an exclusion. A protocol that changed says when.",
        bn: "প্রোটোকল: কাঠামোয় প্রশ্ন (PICO, SPIDER বা PEO), প্রতিটার আইডিসহ মানদণ্ড, ডেটাবেস, তারিখ আর ভাষা। মাইনাস দিয়ে শুরু লাইন মানে বাদ দেওয়ার মানদণ্ড। প্রোটোকল বদলালে কবে বদলেছে বলে দেয়।",
      },
      {
        en: "Search log: every kept search with this review on it. Import its hits as records, then mark the duplicates.",
        bn: "খোঁজের লগ: এই রিভিউয়ে রাখা প্রতিটা খোঁজ। ফলগুলো রেকর্ড হিসেবে আনুন, তারপর দ্বিত্ব চিহ্নিত করুন।",
      },
      {
        en: "Screening is by keyboard: y to include, x to exclude with a reason by number, m for maybe. Title and abstract first, then full text with the reader beside it.",
        bn: "যাচাই কিবোর্ডে: y অন্তর্ভুক্ত, x কারণ-নম্বরসহ বাদ, m হয়তো। আগে শিরোনাম ও সারাংশ, তারপর পূর্ণ লেখা, পাশে পাঠক খোলা।",
      },
      {
        en: "PRISMA is drawn from the rows and never typed. Change a decision and the diagram changes.",
        bn: "PRISMA সারি থেকে আঁকা, কখনো টাইপ করা নয়। সিদ্ধান্ত বদলালে চিত্রও বদলায়।",
      },
      {
        en: "Extraction is one row per included source with your own columns, prefilled from the extraction cards made while reading, and it exports as CSV. Appraisal is a checklist per source and the score is derived.",
        bn: "নিষ্কাশনে প্রতিটা অন্তর্ভুক্ত উৎসে এক সারি, কলাম আপনার, পড়ার সময়ের নিষ্কাশন কার্ড থেকে আগেই ভরা, আর CSV হিসেবে বেরোয়। মূল্যায়ন প্রতিটা উৎসে একটা চেকলিস্ট, নম্বর গণনা করা।",
      },
    ],
    keys: [
      { press: "y x m", does: { en: "include, exclude, maybe", bn: "অন্তর্ভুক্ত, বাদ, হয়তো" } },
      { press: "j k", does: { en: "through the queue", bn: "সারিতে চলাফেরা" } },
    ],
  },
  {
    key: "lab",
    does: {
      en: "Datasets, SQL, statistics, charts and market series, with every result kept as a run a draft can point at.",
      bn: "ডেটাসেট, SQL, পরিসংখ্যান, চার্ট আর বাজারের সারি, আর প্রতিটা ফল একটা রান, যেটা খসড়া দেখাতে পারে।",
    },
    steps: [
      {
        en: "Add a CSV, TSV, Parquet or JSON file. It becomes a source of type dataset, so the thesis can cite it, and its columns are read into the dictionary. The raw file is never edited.",
        bn: "CSV, TSV, Parquet বা JSON ফাইল যোগ করুন। সেটা ডেটাসেট-ধরনের একটা উৎস হয়ে যায়, তাই থিসিস তাকে উদ্ধৃত করতে পারে, আর কলামগুলো ডিকশনারিতে পড়া হয়। কাঁচা ফাইল কখনো বদলানো হয় না।",
      },
      {
        en: "Load it into the engine, which is DuckDB in this browser: about thirty megabytes the first time, cached after, and nothing of the data leaves the page.",
        bn: "ইঞ্জিনে লোড করুন, সেটা এই ব্রাউজারেই DuckDB: প্রথমবার প্রায় তিরিশ মেগাবাইট, তারপর জমা থাকে, আর ডেটার কিছুই পাতা ছেড়ে যায় না।",
      },
      {
        en: "The four checks: rows and columns against the paper's stated N, missing values a column, anything far from its median, and the date and country coverage.",
        bn: "চারটা পরীক্ষা: সারি ও কলাম কাগজের বলা N-এর সঙ্গে মেলে কি না, কোন কলামে কত ফাঁকা, মধ্যক থেকে অনেক দূরের মান, আর তারিখ ও দেশের বিস্তার।",
      },
      {
        en: "Run SQL, and keep a query as a transform so a dataset's lineage stays readable and re-runnable. Twenty-three methods are here, from descriptives and t tests to panel fixed effects, CSAD herding, Fama-MacBeth and event studies.",
        bn: "SQL চালান, আর কোনো কোয়েরি transform হিসেবে রাখুন যাতে ডেটার ধারাটা পড়া যায় ও আবার চালানো যায়। তেইশটা পদ্ধতি আছে, বর্ণনামূলক ও t পরীক্ষা থেকে প্যানেল স্থির প্রভাব, CSAD হার্ডিং, Fama-MacBeth আর ঘটনা অধ্যয়ন পর্যন্ত।",
      },
      {
        en: "A run is a page: what was asked, the code, the answer and the figure. It can be run again, compared with another run, or set beside the paper's own printed coefficient.",
        bn: "একটা রান একটা পাতা: কী জিজ্ঞেস করা হলো, কোড, উত্তর আর ছবি। সেটা আবার চালানো যায়, অন্য রানের সঙ্গে মেলানো যায়, বা কাগজের ছাপা সহগের পাশে রাখা যায়।",
      },
      {
        en: "Market data comes by symbol through the Worker; the Dhaka exchange is a CSV you download and drop on Datasets, whose columns are recognised. Climate is daily temperature and rainfall at a point, from 1940.",
        bn: "বাজারের সারি সিম্বল দিয়ে Worker হয়ে আসে; ঢাকার এক্সচেঞ্জের CSV নামিয়ে ডেটাসেটে ছেড়ে দিন, তার কলাম চেনা আছে। জলবায়ু হলো একটা বিন্দুর দৈনিক তাপমাত্রা আর বৃষ্টি, ১৯৪০ থেকে।",
      },
    ],
    keys: [{ press: "1 to 7", does: { en: "datasets, SQL, statistics, charts, runs, market, climate", bn: "ডেটাসেট, SQL, পরিসংখ্যান, চার্ট, রান, বাজার, জলবায়ু" } }],
  },
  {
    key: "field",
    does: {
      en: "Participants by pseudonym, interviews, transcripts, a codebook, coding, matrices and surveys.",
      bn: "ছদ্মনামে অংশগ্রহণকারী, সাক্ষাৎকার, ট্রান্সক্রিপ্ট, কোডবুক, কোডিং, ছক আর জরিপ।",
    },
    steps: [
      {
        en: "A participant is a pseudonym first, and everything in the room refers to that. Consent is kept separately: its status, its date, what was consented to, and whether quotes may be used.",
        bn: "অংশগ্রহণকারী আগে একটা ছদ্মনাম, আর এই ঘরের সব কিছু সেটাকেই ধরে চলে। সম্মতি আলাদা করে রাখা: অবস্থা, তারিখ, কীসে সম্মতি, আর উদ্ধৃতি ব্যবহার করা যাবে কি না।",
      },
      {
        en: "A real name and contact, if kept at all, are encrypted in this browser under your passphrase. The site holds only the ciphertext.",
        bn: "আসল নাম আর যোগাযোগ যদি রাখতেই হয়, সেটা এই ব্রাউজারেই আপনার পাসফ্রেজ দিয়ে সিল করা হয়। সাইটের কাছে থাকে শুধু সাইফারটেক্সট।",
      },
      {
        en: "An interview is a library source of type interview: the participant is its author and the audio is its file. In the player, [ and ] nudge five seconds and a time in the margin seeks to it.",
        bn: "একটা সাক্ষাৎকার আসলে interview-ধরনের লাইব্রেরি উৎস: অংশগ্রহণকারীই লেখক, অডিওই ফাইল। প্লেয়ারে [ আর ] পাঁচ সেকেন্ড নাড়ায়, আর মার্জিনের সময় চাপলে সেখানে যায়।",
      },
      {
        en: "A transcript arrives from the model where transcription is connected, or pasted. Either way it is a draft until you check it against the audio.",
        bn: "ট্রান্সক্রিপশন সংযুক্ত থাকলে মডেল থেকে ট্রান্সক্রিপ্ট আসে, নইলে পেস্ট করে। যেভাবেই আসুক, অডিওর সঙ্গে না মেলানো পর্যন্ত সেটা খসড়া।",
      },
      {
        en: "Write the codebook first, with a definition for each code, then select words in a segment and press a code. Retrieval gathers every coded segment of a code across the project, with the participant and the time beside each.",
        bn: "আগে কোডবুক লিখুন, প্রতিটা কোডের সংজ্ঞাসহ, তারপর খণ্ডের ভেতর শব্দ বাছাই করে কোড চাপুন। সংগ্রহে একটা কোডের সব খণ্ড এক জায়গায় আসে, পাশে অংশগ্রহণকারী আর সময়।",
      },
      {
        en: "The matrices are counted from the codings. A survey is questions as lines with a public link, and its answers can be saved as a dataset in the lab.",
        bn: "ছকগুলো কোডিং থেকেই গোনা। জরিপ হলো লাইন ধরে প্রশ্ন আর একটা পাবলিক লিংক, আর তার উত্তরগুলো ল্যাবে ডেটাসেট হিসেবে রাখা যায়।",
      },
    ],
    keys: [{ press: "1 to 7", does: { en: "participants, interviews, codebook, retrieval, matrices, surveys, guide", bn: "অংশগ্রহণকারী, সাক্ষাৎকার, কোডবুক, সংগ্রহ, ছক, জরিপ, নির্দেশিকা" } }],
  },
  {
    key: "write",
    does: {
      en: "Chapters and papers, citations in any style, footnotes for law, figures that point at runs, and exports to Word.",
      bn: "অধ্যায় আর পেপার, যেকোনো রীতিতে উদ্ধৃতি, আইনের জন্য ফুটনোট, রান দেখানো ছবি, আর Word-এ এক্সপোর্ট।",
    },
    steps: [
      {
        en: "Start a chapter, a paper or a proposal. Each carries its own citation style and its own word budget.",
        bn: "একটা অধ্যায়, পেপার বা প্রস্তাব শুরু করুন। প্রতিটার নিজের উদ্ধৃতি রীতি আর নিজের শব্দের বাজেট।",
      },
      {
        en: "Cite by typing @ in the text: pick a source, add a page, press Enter. A footnote puts a marker where the caret is and a note at the foot, numbered by position, which is what OSCOLA and Chicago notes need.",
        bn: "উদ্ধৃত করতে লেখার মধ্যে @ টাইপ করুন: উৎস বাছুন, পাতা দিন, Enter চাপুন। ফুটনোট কার্সরের জায়গায় চিহ্ন আর নিচে নোট বসায়, অবস্থান অনুযায়ী নম্বর, যা OSCOLA আর Chicago notes-এর দরকার।",
      },
      {
        en: "Quote a highlight straight out of the reading room, and point a figure at the run that made it.",
        bn: "পড়ার ঘরের হাইলাইট সরাসরি উদ্ধৃত করুন, আর কোনো ছবি যে রান থেকে এসেছে সেটাই দেখান।",
      },
      {
        en: "The outline is the headings with the words under each; a budget on a heading fills a meter.",
        bn: "রূপরেখা হলো শিরোনামগুলো আর প্রতিটার নিচে কত শব্দ; শিরোনামে বাজেট দিলে একটা মিটার ভরে।",
      },
      {
        en: "The claims audit lists every sentence with a number or a claim word and no citation in it. The overlap check finds runs of eight or more words shared with anything the studio holds.",
        bn: "দাবির অডিট সেই বাক্যগুলো দেখায় যাতে সংখ্যা বা দাবির শব্দ আছে অথচ উদ্ধৃতি নেই। মিলের যাচাই দেখে স্টুডিওতে থাকা কিছুর সঙ্গে আট বা তার বেশি শব্দ টানা মিলে গেছে কি না।",
      },
      {
        en: "Name a snapshot before a rewrite, and export to Word, Markdown, LaTeX with BibTeX, or print.",
        bn: "নতুন করে লেখার আগে একটা সংস্করণের নাম দিন, আর Word, Markdown, LaTeX ও BibTeX, বা প্রিন্ট হিসেবে বের করুন।",
      },
    ],
    keys: [
      { press: "n", does: { en: "a new document", bn: "নতুন নথি" } },
      { press: "@", does: { en: "cite, inside the text", bn: "লেখার মধ্যে উদ্ধৃতি" } },
    ],
  },
  {
    key: "plan",
    does: {
      en: "Projects, tasks, dates, the timeline and the sitting timer. A deadline is a fact, not a countdown.",
      bn: "প্রজেক্ট, কাজ, তারিখ, সময়রেখা আর বসার ঘড়ি। শেষ তারিখ একটা তথ্য, উল্টো গোনা নয়।",
    },
    steps: [
      {
        en: "The board has five lanes: later, this week, today, waiting on, and done. Drag between them, or use Move to. The reading queue sits beside them.",
        bn: "বোর্ডে পাঁচটা লেন: পরে, এই সপ্তাহে, আজ, অপেক্ষায়, আর হয়ে গেছে। টেনে সরান বা সরান ব্যবহার করুন। পাশেই পড়ার সারি।",
      },
      {
        en: "Dates hold deadlines, meetings, conferences and submissions. A meeting has an agenda, minutes and decisions, and each action line becomes a task. A submission holds the reviewers' comments, your response and the change you made.",
        bn: "তারিখে থাকে শেষ দিন, মিটিং, কনফারেন্স আর জমা দেওয়া। মিটিংয়ের আলোচ্যসূচি, কার্যবিবরণী আর সিদ্ধান্ত আছে, আর প্রতিটা করণীয় লাইন একটা কাজ হয়ে যায়। জমা দেওয়ার নিচে পর্যালোচকের মন্তব্য, আপনার উত্তর আর কী বদলালেন, তিনটাই।",
      },
      {
        en: "A session is twenty-five minutes by default, with a bell at the end and a line in the daily log when it stops. No count and no chart.",
        bn: "একটা বসা ডিফল্ট পঁচিশ মিনিট, শেষে একটা ঘণ্টা, আর থামলে দৈনিক খাতায় এক লাইন। কোনো গণনা নেই, কোনো চার্ট নেই।",
      },
      {
        en: "The timeline is the year's dates and documents with the present as a line; the Gantt draws tasks with a due date as bars by project.",
        bn: "সময়রেখা বছরের তারিখ আর নথি, বর্তমান একটা রেখা; Gantt-এ শেষ তারিখ থাকা কাজগুলো প্রজেক্ট অনুযায়ী দণ্ড।",
      },
      {
        en: "The week's page gathers what was done, what is next, what is waiting and for how long, what was read, and the week's own note. A calendar address puts your dates in Google Calendar, Outlook or a phone.",
        bn: "সপ্তাহের পাতায় এক জায়গায়: কী হলো, এরপর কী, কীসের অপেক্ষায় আর কত দিন, কী পড়া হলো, আর সপ্তাহের নোট। ক্যালেন্ডারের ঠিকানা বানালে তারিখগুলো Google Calendar, Outlook বা ফোনে চলে যায়।",
      },
    ],
    keys: [{ press: "1 to 6", does: { en: "board, dates, timeline, sessions, Gantt, project", bn: "বোর্ড, তারিখ, সময়রেখা, বসা, Gantt, প্রজেক্ট" } }],
  },
  {
    key: "atlas",
    does: {
      en: "The graph of everything, the citation network, the literature on a year axis, and the people.",
      bn: "সব কিছুর গ্রাফ, উদ্ধৃতির জাল, সালের রেখায় সাহিত্য, আর মানুষগুলো।",
    },
    steps: [
      {
        en: "The graph draws sources, notes, questions and documents with the links between them, and you choose which kinds to show.",
        bn: "গ্রাফে উৎস, নোট, প্রশ্ন আর নথি তাদের যোগসহ আঁকা হয়, আর কোন ধরনগুলো দেখাবেন তা আপনি বাছেন।",
      },
      {
        en: "The network is citations two hops out, so a cluster you have half read is visible as a cluster.",
        bn: "জালটা দুই ধাপ দূর পর্যন্ত উদ্ধৃতি, তাই অর্ধেক পড়া কোনো গুচ্ছ গুচ্ছ হিসেবেই চোখে পড়ে।",
      },
      {
        en: "The timeline puts the literature on a year axis, which is where an empty decade shows.",
        bn: "সময়রেখা সাহিত্যকে সালের অক্ষে বসায়, যেখানে ফাঁকা দশকটা চোখে পড়ে।",
      },
      {
        en: "People are prospective supervisors, examiners and co-authors, with their institution, the fit, your notes, and their published work by ORCID.",
        bn: "মানুষ মানে সম্ভাব্য তত্ত্বাবধায়ক, পরীক্ষক আর সহলেখক, তাদের প্রতিষ্ঠান, মিল, আপনার নোট, আর ORCID ধরে তাদের প্রকাশনা।",
      },
    ],
    keys: [{ press: "1 to 4", does: { en: "graph, network, timeline, people", bn: "গ্রাফ, জাল, সময়রেখা, মানুষ" } }],
  },
  {
    key: "workshop",
    does: {
      en: "Thirty small tools, one card each, for the questions that do not need a whole room.",
      bn: "তিরিশটা ছোট যন্ত্র, প্রতিটার একটা কার্ড, যেসব প্রশ্নের জন্য পুরো একটা ঘর লাগে না।",
    },
    steps: [
      {
        en: "Sources and citing: cite this, parse a reference, resolve an id, find a free copy, is it retracted, journal finder, predatory check.",
        bn: "উৎস আর উদ্ধৃতি: এটা উদ্ধৃত করুন, রেফারেন্স পড়ুন, আইডি চিনুন, বিনামূল্যের কপি খুঁজুন, প্রত্যাহৃত কি না, জার্নাল খুঁজুন, শিকারি যাচাই।",
      },
      {
        en: "Questions and searching: a Boolean builder, a question builder, a PRISMA drawer.",
        bn: "প্রশ্ন আর খোঁজ: বুলিয়ান বিল্ডার, প্রশ্ন বিল্ডার, PRISMA আঁকা।",
      },
      {
        en: "Numbers: sample size and power, an effect size converter, p to CI, which test, returns, currency and inflation, random and sampling.",
        bn: "সংখ্যা: নমুনার আকার ও শক্তি, প্রভাবের আকার রূপান্তর, p থেকে CI, কোন পরীক্ষা, রিটার্ন, মুদ্রা ও মুদ্রাস্ফীতি, এলোমেলো ও নমুনা।",
      },
      {
        en: "Writing and the day: a word counter, abbreviations, readability, self-overlap, a table maker, an equation editor, Hijri and Gregorian dates, date arithmetic, email templates, a CV, an ethics helper, quiz me, and a viva bank.",
        bn: "লেখা আর দৈনন্দিন: শব্দ গণনা, সংক্ষেপ, পাঠযোগ্যতা, নিজের সাথে মিল, টেবিল বানান, সমীকরণ সম্পাদক, হিজরি ও গ্রেগরিয়ান, তারিখের হিসাব, ইমেইল ছক, সিভি, নীতিশাস্ত্র সহায়, আমাকে প্রশ্ন করুন, আর মৌখিকের ভাণ্ডার।",
      },
    ],
  },
  {
    key: "methods",
    does: {
      en: "How to do a thing, as a lesson with a worked example, linked from the room where the thing is done.",
      bn: "কীভাবে একটা কাজ করতে হয়, উদাহরণসহ একটা পাঠ, আর যেখানে কাজটা হয় সেই ঘর থেকেই তার লিংক।",
    },
    steps: [
      {
        en: "Reading: a paper in an hour, and a literature note that is worth keeping.",
        bn: "পড়া: এক ঘণ্টায় একটা কাগজ, আর রাখার মতো একটা পড়ার নোট।",
      },
      {
        en: "Finding: a search string for a systematic review, and screening without losing your mind.",
        bn: "খোঁজা: সিস্টেম্যাটিক রিভিউয়ের খোঁজের স্ট্রিং, আর মাথা ঠিক রেখে বাছাই।",
      },
      {
        en: "Numbers: OLS and what the robust errors are for, a factor regression and what a beta means, CSAD herding step by step, and an event study by hand.",
        bn: "সংখ্যা: OLS আর রোবাস্ট ত্রুটি কীসের জন্য, ফ্যাক্টর রিগ্রেশন আর বিটার মানে, ধাপে ধাপে CSAD হার্ডিং, আর হাতে হাতে ইভেন্ট স্টাডি।",
      },
      {
        en: "People and prose: thematic analysis in six steps, a codebook another person could apply, a citation in OSCOLA, and a chapter outline from a question tree.",
        bn: "মানুষ আর লেখা: ছয় ধাপে থিম্যাটিক বিশ্লেষণ, অন্য কেউ প্রয়োগ করতে পারে এমন কোডবুক, OSCOLA-য় একটা উদ্ধৃতি, আর প্রশ্নের গাছ থেকে অধ্যায়ের রূপরেখা।",
      },
    ],
  },
  {
    key: "archive",
    does: {
      en: "Everything that happened, every version, the bin, and the way out.",
      bn: "যা যা হয়েছে, প্রতিটা সংস্করণ, বিন, আর বেরোনোর পথ।",
    },
    steps: [
      {
        en: "Take a copy: every row of the studio as JSON, with the library as BibTeX and RIS beside it. Open formats, so it can be read somewhere else.",
        bn: "একটা কপি নিন: স্টুডিওর প্রতিটা সারি JSON হিসেবে, পাশে লাইব্রেরি BibTeX আর RIS হিসেবে। খোলা ফরম্যাট, তাই অন্য কোথাও পড়া যায়।",
      },
      {
        en: "Every write the studio makes is a line in the activity list, so nothing is lost and anything can be found again.",
        bn: "স্টুডিও যা যা লেখে তার প্রতিটা কাজের তালিকায় এক লাইন, তাই কিছু হারায় না আর সব আবার খুঁজে পাওয়া যায়।",
      },
      {
        en: "The bin keeps a removed thing for thirty days and can put it back.",
        bn: "বিন সরানো জিনিস তিরিশ দিন রাখে আর ফিরিয়ে আনতে পারে।",
      },
    ],
  },
  {
    key: "ask",
    does: {
      en: "An assistant that reads only what the studio holds, cites only what is there, and never writes into a draft without a press.",
      bn: "এমন একজন সহকারী যে শুধু স্টুডিওতে যা আছে তাই পড়ে, শুধু যা আছে তাই উদ্ধৃত করে, আর না চাপলে খসড়ায় কিছু লেখে না।",
    },
    steps: [
      {
        en: "Pick a task, give it what it needs, and press Ask. Every answer is kept as a note with the prompt and the model on it.",
        bn: "একটা কাজ বাছুন, তার যা দরকার দিন, আর Ask চাপুন। প্রতিটা উত্তর প্রম্পট আর মডেলের নামসহ নোট হিসেবে রাখা হয়।",
      },
      {
        en: "The tasks: summarise a source, pull out its method and sample, read your highlights in order, find which sources speak to a question, suggest codes from your codebook, draft a paragraph, read a draft as an examiner would, turn a question into search strings, translate a quotation, explain a regression table, write the PRISMA paragraph, and tidy a reference list.",
        bn: "কাজগুলো: উৎসের সারসংক্ষেপ, তার পদ্ধতি ও নমুনা বের করা, আপনার হাইলাইট ক্রমে পড়া, কোন উৎসগুলো একটা প্রশ্ন নিয়ে বলে তা বের করা, কোডবুক থেকে কোড প্রস্তাব, অনুচ্ছেদের খসড়া, পরীক্ষকের চোখে খসড়া পড়া, প্রশ্ন থেকে খোঁজের স্ট্রিং, উদ্ধৃতির অনুবাদ, রিগ্রেশন টেবিলের ব্যাখ্যা, PRISMA-র অনুচ্ছেদ, আর রেফারেন্স তালিকা গোছানো।",
      },
      {
        en: "Two modes: with the studio's rows, or fresh, where nothing of yours goes with it and a pasted draft is read cold by a hostile reviewer.",
        bn: "দুটো মোড: স্টুডিওর সারি নিয়ে, অথবা টাটকা, যেখানে আপনার কিছুই সঙ্গে যায় না আর পেস্ট করা খসড়া একজন কঠোর পর্যালোচক ঠান্ডা চোখে পড়ে।",
      },
      {
        en: "Index your library first and it can be asked by meaning rather than by word.",
        bn: "আগে লাইব্রেরি ইনডেক্স করলে শব্দ ধরে নয়, অর্থ ধরে জিজ্ঞেস করা যায়।",
      },
    ],
    note: {
      en: "A struck-through citation key is one the library does not hold. Search before you trust it. The cost of each call and of the month is on the page.",
      bn: "কাটা দাগ দেওয়া উদ্ধৃতি কী মানে সেটা লাইব্রেরিতে নেই। বিশ্বাস করার আগে খুঁজে নিন। প্রতিটা কলের আর এই মাসের খরচ পাতাতেই দেখা যায়।",
    },
  },
  {
    key: "settings",
    does: {
      en: "Your projects, your name on exports, the citation style, the connections, and the bookmarklet.",
      bn: "আপনার প্রজেক্ট, এক্সপোর্টে আপনার নাম, উদ্ধৃতি রীতি, সংযোগ, আর বুকমার্কলেট।",
    },
    steps: [
      {
        en: "Make a project and give it a kind. One source or note can belong to several.",
        bn: "একটা প্রজেক্ট বানান আর তার ধরন দিন। একটা উৎস বা নোট কয়েকটার হতে পারে।",
      },
      {
        en: "Pull from Zotero with your numeric user id and a read-only API key. Neither is stored: they are used for that one pull and forgotten.",
        bn: "Zotero থেকে টানতে আপনার সংখ্যার ইউজার আইডি আর শুধু-পড়ার API কী দিন। কোনোটাই রাখা হয় না: ওই একবার টানার জন্যই ব্যবহার হয়।",
      },
      {
        en: "Drag the bookmarklet to your bookmarks bar. On a paper's page, press it and the paper is filed here; a page with nothing to read is kept as a capture holding the address, so the press is never lost.",
        bn: "বুকমার্কলেটটা বুকমার্ক বারে টেনে নিন। কোনো পেপারের পাতায় চাপলে সেটা এখানে জমা হয়; পড়ার মতো কিছু না থাকলে ঠিকানাটা টুকরো হিসেবে থেকে যায়, তাই চাপাটা নষ্ট হয় না।",
      },
      {
        en: "Dense mode takes some of the air out of the studio, and it is the one place on this site a reader may ask for less.",
        bn: "ঘন সাজানো স্টুডিওর ফাঁকা জায়গা কমায়, আর এই সাইটে এটাই একমাত্র জায়গা যেখানে কম চাওয়া যায়।",
      },
      {
        en: "Connections say what the studio can reach. A service that is off is a sentence on the page rather than an error.",
        bn: "সংযোগ বলে স্টুডিও কোথায় পৌঁছাতে পারে। যে সেবা বন্ধ, পাতায় সেটা একটা বাক্য, কোনো ভুল নয়।",
      },
    ],
  },
];

/* ---------- the whole keyboard ---------- */

export const GUIDE_KEYS: { where: Word; press: string; does: Word }[] = [
  { where: { en: "The board", bn: "বোর্ড" }, press: "c", does: { en: "the capture line", bn: "টুকে রাখার লাইনে কার্সর" } },
  { where: { en: "Library, notebook, questions", bn: "লাইব্রেরি, খাতা, প্রশ্ন" }, press: "f", does: { en: "the filter box", bn: "ছাঁকার বাক্সে কার্সর" } },
  { where: { en: "Notebook, questions, writing desk", bn: "খাতা, প্রশ্ন, লেখার টেবিল" }, press: "n", does: { en: "a new one", bn: "নতুন একটা" } },
  { where: { en: "Any list", bn: "যেকোনো তালিকা" }, press: "j k", does: { en: "down and up", bn: "নিচে আর উপরে" } },
  { where: { en: "The reading queue", bn: "পড়ার সারি" }, press: "Enter", does: { en: "open the top one", bn: "উপরেরটা খুলুন" } },
  { where: { en: "The reader", bn: "পাঠক" }, press: "1 2 3 4 5", does: { en: "claim, evidence, method, quote, question", bn: "দাবি, প্রমাণ, পদ্ধতি, উদ্ধৃতি, প্রশ্ন" } },
  { where: { en: "The reader", bn: "পাঠক" }, press: "j k", does: { en: "next and previous page", bn: "পরের আর আগের পাতা" } },
  { where: { en: "Find", bn: "খোঁজ" }, press: "f", does: { en: "the search box", bn: "খোঁজের বাক্সে কার্সর" } },
  { where: { en: "Screening a review", bn: "রিভিউয়ের যাচাই" }, press: "y x m", does: { en: "include, exclude, maybe", bn: "অন্তর্ভুক্ত, বাদ, হয়তো" } },
  { where: { en: "Lab, field, planner, atlas", bn: "ল্যাব, মাঠ, পরিকল্পনা, মানচিত্র" }, press: "1 to 7", does: { en: "change the view", bn: "দৃশ্য বদলান" } },
  { where: { en: "An interview's player", bn: "সাক্ষাৎকারের প্লেয়ার" }, press: "[ ]", does: { en: "five seconds back and on", bn: "পাঁচ সেকেন্ড পিছনে আর সামনে" } },
  { where: { en: "The writing desk", bn: "লেখার টেবিল" }, press: "@", does: { en: "insert a citation", bn: "উদ্ধৃতি বসান" } },
  { where: { en: "Anywhere on the site", bn: "সাইটের যেকোনো জায়গায়" }, press: "/ Ctrl+K ?", does: { en: "search, the palette, help", bn: "খোঁজ, প্যালেট, সাহায্য" } },
];

/* ---------- three ways through ---------- */

export const GUIDE_FLOWS: { title: Word; steps: Word[] }[] = [
  {
    title: { en: "From a paper to a citation", bn: "কাগজ থেকে উদ্ধৃতি" },
    steps: [
      { en: "Paste the DOI into the board, or add it from Find.", bn: "বোর্ডে DOI পেস্ট করুন, বা খোঁজ থেকে যোগ করুন।" },
      { en: "Add the PDF to the source, which puts it in the reading queue.", bn: "উৎসে PDF যোগ করুন, তাতে সেটা পড়ার সারিতে চলে আসে।" },
      { en: "Highlight with 1 to 5 and fill an extraction card for the numbers you will use.", bn: "১ থেকে ৫ দিয়ে হাইলাইট করুন, আর যে সংখ্যাগুলো লাগবে তা নিষ্কাশন কার্ডে তুলুন।" },
      { en: "Answer the one line at the end: it becomes the literature note.", bn: "শেষের এক লাইনের প্রশ্নটার উত্তর দিন: সেটাই পড়ার নোট হয়।" },
      { en: "In the questions room, set the source as evidence for a question.", bn: "প্রশ্নের ঘরে উৎসটাকে কোনো প্রশ্নের প্রমাণ হিসেবে বসান।" },
      { en: "On the writing desk, cite it with @, or quote the highlight itself.", bn: "লেখার টেবিলে @ দিয়ে উদ্ধৃত করুন, বা হাইলাইটটাই উদ্ধৃত করুন।" },
    ],
  },
  {
    title: { en: "A systematic review", bn: "একটা সিস্টেম্যাটিক রিভিউ" },
    steps: [
      { en: "Write the protocol: frame, criteria, databases, dates, languages.", bn: "প্রোটোকল লিখুন: কাঠামো, মানদণ্ড, ডেটাবেস, তারিখ, ভাষা।" },
      { en: "Run the strings in Find and keep each search on this review.", bn: "খোঁজে স্ট্রিংগুলো চালান আর প্রতিটা খোঁজ এই রিভিউয়ে রাখুন।" },
      { en: "Import the hits as records and mark the duplicates.", bn: "ফলগুলো রেকর্ড হিসেবে আনুন আর দ্বিত্ব চিহ্নিত করুন।" },
      { en: "Screen by keyboard: y, x with a reason, m.", bn: "কিবোর্ডে যাচাই করুন: y, কারণসহ x, m।" },
      { en: "PRISMA draws itself, because the counts come from the rows.", bn: "PRISMA নিজেই আঁকে, কারণ সংখ্যাগুলো সারি থেকেই গোনা।" },
      { en: "Fill the extraction sheet, appraise each source, and export the CSV.", bn: "নিষ্কাশনের শিট ভরুন, প্রতিটা উৎসের মূল্যায়ন করুন, আর CSV নামান।" },
    ],
  },
  {
    title: { en: "From data to a table in the thesis", bn: "ডেটা থেকে থিসিসের টেবিল" },
    steps: [
      { en: "Add the CSV in the lab. It becomes a source too, so the thesis can cite it.", bn: "ল্যাবে CSV যোগ করুন। সেটা একটা উৎসও হয়, তাই থিসিস তাকে উদ্ধৃত করতে পারে।" },
      { en: "Load it into the engine, run the four checks, and describe the columns in the dictionary.", bn: "ইঞ্জিনে লোড করুন, চারটা পরীক্ষা চালান, আর ডিকশনারিতে কলামগুলো বর্ণনা করুন।" },
      { en: "Build the sample in SQL and keep it as a transform, so the lineage is readable.", bn: "SQL দিয়ে নমুনাটা বানান আর transform হিসেবে রাখুন, যাতে ধারাটা পড়া যায়।" },
      { en: "Pick the method, give it its columns, and run it. The result is a run.", bn: "পদ্ধতি বাছুন, কলাম দিন, চালান। ফলটা একটা রান।" },
      { en: "Copy the APA table, or set several runs side by side as one table.", bn: "APA টেবিল কপি করুন, বা কয়েকটা রান পাশাপাশি এক টেবিলে মেলান।" },
      { en: "In the draft, point the figure at the run's id, so the number has an answer behind it.", bn: "খসড়ায় সংখ্যাটা রানের আইডি দিয়ে দেখান, যাতে তার পেছনে একটা উত্তর থাকে।" },
    ],
  },
];

/** One room's guide, by the key the pages table uses. */
export const guideFor = (key: string): RoomGuide | undefined =>
  GUIDE_ROOMS.find((r) => r.key === key);
