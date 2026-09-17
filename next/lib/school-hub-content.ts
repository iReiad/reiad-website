/* ============================================================
   school-hub-content.ts: what the three hand-written school hubs
   say, as data.

   The German, Qur'anic Arabic and English hubs were one HTML
   string each, 8 to 12 KB of it, inside `school-hubs.ts`. The page
   around them was React and everything inside them was not: the
   four explainer cards were `.cell`, the card this site replaced
   with `<GoCard>` and `<InfoCard>` months ago, and the closing
   block was `.band`, which is `<Band>` now. So three pages went on
   wearing the old furniture, and a change to a card reached every
   page except the three that a learner opens first.

   ---- why it is data and not JSX ----

   The file this replaces said, correctly, that hand-converting
   eight hundred lines of Bangla into JSX is eight hundred chances
   to change a word that nobody reviewing the diff would catch, and
   that the reader who would catch it is the one this site is
   written for. Every string below was lifted out of that markup by
   a script and checked back against it: all three hubs came out
   with an identical word multiset, so no sentence was retyped and
   none can have drifted.

   What changed is the SHAPE. The structure is a type now, so a
   card is a component and the prose is what it holds, which is the
   same division the article route has: the body is HTML out of a
   row and the page around it is components.

   ---- the prose keeps its markup ----

   A lede carries `<span lang="de">`, a rung carries `<b>` and an
   answer carries a link. Those are inline and they are the
   writing, so they stay as HTML and are rendered with
   `dangerouslySetInnerHTML`. Nothing here comes from a reader or
   from a database: it is this file, and this file is the original.

   ---- three ids are load-bearing ----

   `progressId`, `resetId` and `ladder.listId` are read by
   `aab/<school>/hub.js`, which replaces the ladder with one built
   from the reader\'s own progress. They are spelled the way that
   file spells them and must not be tidied.
   ============================================================ */

export interface HubAction {
  href: string;
  /** HTML: a label can carry an arrow or a `<span lang>`. */
  label: string;
  kind: "solid" | "ghost";
}

export interface HubCell { title: string; html: string }
export interface HubStep { n: string; html: string }
export interface HubQuestion { q: string; html: string }

export interface HubSection {
  id: string;
  label: string;
  intro?: string;
  cells?: HubCell[];
  rule?: { label: string; html: string };
  ladder?: { listId: string; fallback: string[] };
  routine?: {
    title?: string;
    intro?: string;
    steps: HubStep[];
    actions: HubAction[];
  };
  questions?: HubQuestion[];
}

export interface HubContent {
  hero: {
    eyebrow: string;
    title: string;
    lede: string;
    progressId: string;
    resetId: string;
    resetLabel: string;
    /** What the progress line says before `hub.js` has counted:
        one line of text, so the row is already a line high. */
    countFallback: string;
    /** A round door beside the buttons, for a page of the school
        that is not a stage. The German hub has one: the planner
        for learners on the Netzwerk neu books. */
    round?: { href: string; label: string; sub: string };
    actions: HubAction[];
  };
  sections: HubSection[];
  closing?: { label: string; title: string; html: string; actions: HubAction[] };
  note: string;
}

export const HUB_CONTENT: Record<string, HubContent> = {
  "deutsch": {
    "hero": {
      "eyebrow": "জার্মান, বাংলায় · <span lang=\"de\">Deutsch von Herzen</span>",
      "title": "মন থেকে জার্মান।",
      "lede": "<span lang=\"de\">Wort für Wort? Nein. Muster für Muster.</span><br> শব্দ নয়, ছাঁচ। একটা ছাঁচ শেখো, তাতে নিজের হাজারটা বাক্য ঢালো।",
      "progressId": "deutsch-progress",
      "resetId": "deutsch-reset",
      "resetLabel": "রিসেট",
      "countFallback": "পাঠ আর অনুশীলন, এক নজরে",
      "round": { "href": "/deutsch/advanced", "label": "Advanced learners", "sub": "Netzwerk neu, A1 থেকে B2" },
      "actions": [
        {
          "href": "/deutsch/stufe-1",
          "label": "Stufe ১ শুরু করুন →",
          "kind": "solid"
        },
        {
          "href": "/deutsch/stufe-1/arbeitsbuch",
          "label": "রোজকার খাতা",
          "kind": "ghost"
        }
      ]
    },
    "sections": [
      {
        "id": "wie",
        "label": "কীভাবে চলে · <span lang=\"de\">Wie es funktioniert</span>",
        "cells": [
          {
            "title": "এক ছাঁচ, হাজার বাক্য",
            "html": "<p>প্রতিটা পাঠে একটা ছাঁচ। <span lang=\"de\">Ich möchte ____</span> শিখলে বিশটা বাক্য তোমার। মুখস্থ করলে একটাই।</p>"
          },
          {
            "title": "বাংলায় বোঝো, জার্মানে বলো",
            "html": "<p>ব্যাখ্যা বাংলায়। যা মুখে তুলবে, সব জার্মান। ইংরেজি একবার শিখেছ, সেই অভিজ্ঞতাই কাজে লাগবে।</p>"
          },
          {
            "title": "রোজ একটা পাতা",
            "html": "<p>প্রথম <span data-count=\"workbooks\">৩</span>টা স্তরে একটা করে খাতা। দিনে এক পাতা: একটা ছাঁচ, নিজের আটটা বাক্য, একটা সত্যি অনুচ্ছেদ। সাথে বাক্য সাজানোর খেলা।</p>"
          },
          {
            "title": "সব ফ্রি",
            "html": "<p>সব পাঠ ফ্রি, বাংলায়। কোথায় থামলে সেটা অ্যাকাউন্টে থাকে: ফোনে থামো, ল্যাপটপে চালাও।</p>"
          }
        ],
        "rule": {
          "label": "<span lang=\"de\">Die eine Regel</span> · একটাই নিয়ম",
          "html": "<p><span lang=\"en\">If your mouth does not move, it is not language practice.</span> মুখ না নড়লে সেটা অনুশীলন নয়। সময়ের অর্ধেক জোরে বলো। ভুল হোক, একা হোক: চুপ নয়।</p>"
        }
      },
      {
        "id": "leiter",
        "label": "চারটা স্তর · <span lang=\"de\">Die vier Stufen</span>",
        "intro": "শূন্য থেকে মুক্তভাবে বলা পর্যন্ত, চার স্তর। কোথাও তালা নেই, তবে ক্রমে গেলে প্রতিটা স্তর আগেরটার উপর দাঁড়ায়।",
        "ladder": {
          "listId": "leiter-list",
          "fallback": [
            "<a href=\"/deutsch/stufe-1\"><b>Stufe 1 · একদম শুরু থেকে</b></a> ধ্বনি, বাক্যের ইঞ্জিন, <span lang=\"de\">sein</span> ও <span lang=\"de\">haben</span>, তিন টুপি, ক্রিয়ার মেশিন, না-বলা, প্রশ্ন, বন্ধনী, সংখ্যা।",
            "<a href=\"/deutsch/stufe-2\"><b>Stufe 2 · সেতু গড়া</b></a> <span lang=\"de\">Akkusativ</span> ও <span lang=\"de\">Dativ</span>, কাতাপল্ট-ক্রিয়া, আঠা-শব্দ, <span lang=\"de\">Perfekt</span> দিয়ে গতকালের কথা, আর <span lang=\"de\">weil</span>।",
            "<a href=\"/deutsch/stufe-3\"><b>Stufe 3 · নদীটা খুঁজে পাওয়া</b></a> <span lang=\"de\">Präteritum</span>, বিশেষণের লেজ, সম্বন্ধ-বাক্য, <span lang=\"de\">Konjunktiv II</span>, তুলনা, ভবিষ্যৎ আর তর্ক।",
            "<a href=\"/deutsch/stufe-4\"><b>Stufe 4 · সূক্ষ্ম সুর</b></a> কর্মবাচ্য, অতীতের-অতীত, আক্ষেপ, <span lang=\"de\">Modalpartikeln</span>, কূটনৈতিক সুর, আনুষ্ঠানিক লেখা।"
          ]
        }
      },
      {
        "id": "stunde",
        "label": "রোজকার এক ঘণ্টা · <span lang=\"de\">Die tägliche Stunde</span>",
        "routine": {
          "title": "দিনে এক ঘণ্টা, পাঁচ ভাগে",
          "steps": [
            {
              "n": "১০ মি",
              "html": "<b lang=\"de\">Warm-up</b>: গতকালের পাতাটা একবার জোরে পড়ুন। এটা বাদ দিলে বাকি পুরোটা আলগা হয়ে যায়।"
            },
            {
              "n": "১৫ মি",
              "html": "<b>নতুন ছাঁচ</b>: দিনের <span lang=\"de\">Muster</span>, তারপর সেই ছাঁচে নিজের দশটা বাক্য।"
            },
            {
              "n": "১৫ মি",
              "html": "<b lang=\"de\">Sprechen</b>: ছবি বর্ণনা, <span lang=\"de\">Mein Tag</span>, বা আয়নার সামনে। এটাই আসল কাজ।"
            },
            {
              "n": "১০ মি",
              "html": "<b lang=\"de\">Hören</b>: ধীর জার্মান শুনে প্রতিটা লাইন থামিয়ে হুবহু বলুন।"
            },
            {
              "n": "১০ মি",
              "html": "<b>টুপি-কার্ড</b>: দশটা নতুন বিশেষ্য, <span lang=\"de\">der·die·das</span> সহ, তিন রঙে।"
            }
          ],
          "actions": [
            {
              "href": "/deutsch/stufe-1/arbeitsbuch",
              "label": "আজকের পাতা খুলুন →",
              "kind": "solid"
            },
            {
              "href": "/deutsch/stufe-1/arbeitsbuch#spiel",
              "label": "বাক্য সাজানোর খেলা",
              "kind": "ghost"
            },
            {
              "href": "/deutsch/stufe-1/plan.html",
              "label": "Stufe ১-এর পুরো মানচিত্র",
              "kind": "ghost"
            }
          ]
        }
      },
      {
        "id": "prosno",
        "label": "প্রশ্ন · <span lang=\"de\">Fragen</span>",
        "questions": [
          {
            "q": "আমি জার্মানের কিছুই জানি না। এখান থেকে শুরু করা যাবে?",
            "html": "<p>হ্যাঁ। <a href=\"/deutsch/stufe-1/laute.html\">Stufe ১-এর ধ্বনির পাঠ</a> ধরে নেয় তুমি একটা অক্ষরও চেনো না। শুধু ইংরেজি একবার শিখে থাকলেই হবে।</p>"
          },
          {
            "q": "কতদিনে কী হবে?",
            "html": "<p>Stufe ১ শেষে: নিজের পরিচয়, কিছু চাওয়া, প্রশ্ন, 'না' বলা, আর নিজের দিনটা জার্মানে বলা। প্রতিটা স্তরের পাতায় লেখা আছে শেষে ঠিক কী কী পারবে।</p>"
          },
          {
            "q": "খাতায় যা লিখব, সেটা কোথায় জমা থাকে?",
            "html": "<p>তোমার ব্রাউজারে, আর সাইন ইন করা থাকলে অ্যাকাউন্টেও, তাই অন্য ফোনেও পাবে। ব্রাউজারের ডেটা মুছলে সাইন ইন ছাড়া লেখা চলে যায়।</p>"
          },
          {
            "q": "বাংলা কেন? সবাই তো ইংরেজি দিয়ে জার্মান শেখায়।",
            "html": "<p>দুটো বিদেশি ভাষা একসাথে সামলানো বাড়তি কাজ। আর বাংলার তুমি-তোমরা-আপনি জার্মানের সাথে মেলে, ইংরেজির সাথে মেলে না।</p>"
          },
          {
            "q": "এটা কি কোনো পরীক্ষার প্রস্তুতি?",
            "html": "<p>না, লক্ষ্য মুখ খোলা। তবে পথটা A1 থেকে C1 যায়। Goethe বা telc দিতে চাইলে <a href=\"/deutsch/stufe-4\">Stufe ৪</a>-এর পরে শুধু পরীক্ষার ধরনটা অভ্যাস করো, আর Netzwerk neu বই ধরে পড়লে <a href=\"/deutsch/advanced\">পরিকল্পনাটা</a> নাও।</p>"
          },
          {
            "q": "টাকা আর বাজারের লেখাগুলো কোথায় গেল?",
            "html": "<p><a href=\"/money\">টাকার স্কুলে</a>, আলাদা পথে। জার্মান খুঁজতে এসে ব্রোকার পেরোতে হবে না।</p>"
          }
        ]
      }
    ],
    "closing": {
      "label": "পাশের ঘর",
      "title": "টাকার ভাষাও আছে, আপনার ভাষায়",
      "html": "বাংলাদেশে বিনিয়োগ, শূন্য থেকে গবেষণা পর্যন্ত, সহজ বাংলায়। নিয়ম এক: ব্যাখ্যা তোমার ভাষায়, সিদ্ধান্ত তোমার।",
      "actions": [
        {
          "href": "/money",
          "label": "শেখার লাইব্রেরি →",
          "kind": "solid"
        },
        {
          "href": "/tools",
          "label": "ক্যালকুলেটর",
          "kind": "ghost"
        }
      ]
    },
    "note": "এই কোর্সটা একজন শিক্ষার্থীর জন্য লেখা হয়েছিল, আর তারপর সবার জন্য খুলে দেওয়া হয়েছে। কোনো সার্টিফিকেট নেই, কোনো ক্লাস নেই, কোনো খরচ নেই। ভুল পেলে <a href=\"mailto:i@reiad.co.uk\">লিখে জানান</a>, ঠিক করে দেওয়া হবে।"
  },
  "quran": {
    "hero": {
      "eyebrow": "কুরআনের আরবি · <span lang=\"ar\" dir=\"rtl\">القُرْآنُ مِنَ القَلْبِ</span>",
      "title": "অন্তর থেকে।",
      "lede": "আরবি পড়তে পারো, মানে বোঝো না? ষাট দিনে কুরআনের শব্দগুলো চিনে ফেলো, যাতে শুনলেই মানে অনুভব হয়।",
      "progressId": "quran-progress",
      "resetId": "quran-reset",
      "resetLabel": "রিসেট",
      "countFallback": "দারস আর দিন, এক নজরে",
      "actions": [
        {
          "href": "/quran/dhap-1/tin-prokar.html",
          "label": "দিন ১ শুরু করুন →",
          "kind": "solid"
        },
        {
          "href": "/quran/dhap-1",
          "label": "ধাপ ১ দেখুন",
          "kind": "ghost"
        }
      ]
    },
    "sections": [
      {
        "id": "kivabe",
        "label": "কীভাবে চলে · <span lang=\"ar\" dir=\"rtl\">كَيْفَ يَسِيرُ</span>",
        "cells": [
          {
            "title": "কোনো লেখা নেই",
            "html": "<p>শুধু পড়া, জোরে বলা, অনুভব করা। খাতা-কলম লাগে না, তাই বাসে বসেও এক দিনের পাঠ শেষ হয়।</p>"
          },
          {
            "title": "দিনে একটা পাতা",
            "html": "<p>একদিনে একটা দিন। শুরুতে ২০ মিনিট, শেষে ৪০। বারবার বললে শব্দ নিজেই মনে বসে।</p>"
          },
          {
            "title": "অল্প শব্দ, বারবার",
            "html": "<p>প্রায় ৩০০টা শব্দ চিনলেই কুরআনের বেশির ভাগ শব্দ চেনা। ভয়ের কিছু নেই।</p>"
          },
          {
            "title": "পড়তে কোনো টাকা লাগে না",
            "html": "<p>সব পাঠ ফ্রি, বাংলায়। কোন দিন হয়েছে সেটা অ্যাকাউন্টে থাকে: ফোনে থামো, ল্যাপটপে চালাও।</p>"
          }
        ]
      },
      {
        "id": "ladder",
        "label": "তিনটি ধাপ · <span lang=\"ar\" dir=\"rtl\">ثَلَاثُ مَرَاحِلَ</span>",
        "intro": "শব্দ চেনা থেকে গোটা সূরা পর্যন্ত, তিন ধাপে ষাট দিন। কোথাও তালা নেই, তবে ক্রমে গেলে প্রতিটা ধাপ আগেরটার উপর দাঁড়ায়।",
        "ladder": {
          "listId": "dhap-list",
          "fallback": [
            "<a href=\"/quran/dhap-1\"><b>ধাপ ১ · ভিত্তি</b></a> ১০ দিন। নাম-শব্দ, সর্বনাম, পুরুষ ও স্ত্রী, ছোট জোড়া-শব্দ, <span lang=\"ar\" dir=\"rtl\">الـ</span>, আর প্রথম তিনটি আয়াত।",
            "<a href=\"/quran/dhap-2\"><b>ধাপ ২ · শব্দ থেকে বাক্য</b></a> ২০ দিন। মূল ও ছাঁচ, ক্রিয়ার তিন কাল, নাম-বাক্য ও কাজ-বাক্য, ইদাফা, শব্দের শেষের চিহ্ন, আর হারাকাত ছাড়া পড়া।",
            "<a href=\"/quran/dhap-3\"><b>ধাপ ৩ · বাক্য থেকে সূরা</b></a> ৩০ দিন। ক্রিয়ার রূপ, ভাঙা বহুবচন, কর্মবাচ্য, বাক্যের হাতিয়ার, আর চারটে সূরা শব্দ ধরে ধরে।"
          ]
        }
      },
      {
        "id": "rutin",
        "label": "রোজকার রুটিন · <span lang=\"ar\" dir=\"rtl\">كُلَّ يَوْمٍ</span>",
        "routine": {
          "intro": "চার ধাপ, আধ ঘণ্টা। কোনোটাই লেখার কাজ নয়.",
          "steps": [
            {
              "n": "১",
              "html": "আগের দিনের অংশটা একবার জোরে পড়ুন।"
            },
            {
              "n": "২",
              "html": "আজকের নতুন শব্দ তিনবার মুখে বলুন, নিজের কানে শুনুন।"
            },
            {
              "n": "৩",
              "html": "চোখ বন্ধ করে প্রতিটি শব্দের মানে মনে করুন।"
            },
            {
              "n": "৪",
              "html": "একটা ছোট আয়াতে আজকের শব্দগুলো খুঁজে বের করুন।"
            }
          ],
          "actions": [
            {
              "href": "/quran/dhap-1/tin-prokar.html",
              "label": "আজকের দিন খুলুন →",
              "kind": "solid"
            },
            {
              "href": "/quran/dhap-3/fatiha.html",
              "label": "শেষে কোথায় পৌঁছাবেন",
              "kind": "ghost"
            }
          ]
        }
      },
      {
        "id": "prosno",
        "label": "প্রশ্ন · <span lang=\"ar\" dir=\"rtl\">أَسْئِلَة</span>",
        "questions": [
          {
            "q": "আমি তো আরবি পড়তেই পারি না। এটা কি আমার জন্য?",
            "html": "<p>এখনো নয়। কোর্সটা ধরে নেয় তুমি হরকত দেখে পড়তে পারো, মানে বোঝো না। আগে বর্ণ আর উচ্চারণ, তারপর এখানে।</p>"
          },
          {
            "q": "কতদিনে কী হবে?",
            "html": "<p>দশ দিনে বিসমিল্লাহ, আলহামদু লিল্লাহ আর সূরা ইখলাসের প্রথম আয়াত শব্দ ধরে ধরে। ষাট দিনে চারটে ছোট সূরা পুরোটা, হরকত ছাড়াও।</p>"
          },
          {
            "q": "এটা কি ব্যাকরণের কোর্স?",
            "html": "<p>নিয়ম আছে, মুখস্থ করতে নয়, চিনতে। প্রতিটা নিয়মের সাথেই দেখানো হয় সেটা কোন আয়াতে বসে আছে।</p>"
          },
          {
            "q": "কিছু লিখতে হবে না, সত্যি?",
            "html": "<p>সত্যি। কোনো ঘর ভরানো নেই। প্রতিটা দিনের শেষে একটাই নির্দেশ: মুখে বলো।</p>"
          },
          {
            "q": "আমার হিসাব কোথায় জমা থাকে?",
            "html": "<p>আপনার অ্যাকাউন্টে। যে ডিভাইস থেকেই খুলুন হিসাবটা এক থাকে: ফোনে টিক দিলে ল্যাপটপেও দেখাবে।</p>"
          },
          {
            "q": "জার্মান শেখার অংশটা কোথায় গেল?",
            "html": "<p><a href=\"/deutsch\">জার্মান স্কুলে</a>, আলাদা পথে। সব স্কুলের তালিকা <a href=\"/skills\">দক্ষতার পাতায়</a>।</p>"
          }
        ]
      }
    ],
    "note": "<span lang=\"ar\" dir=\"rtl\">رَبِّ زِدْنِي عِلْمًا</span> হে আমার রব, আমার জ্ঞান বাড়িয়ে দাও। একটু একটু করে, অন্তর থেকে।"
  },
  "english": {
    "hero": {
      "eyebrow": "মন থেকে ইংরেজি · <span lang=\"en\">English From The Heart</span>",
      "title": "মুখস্থ নয়। কাঠামো।",
      "lede": "ইংরেজি বোঝো, তবু মুখ খুললে বাক্য আসে না? সমস্যা শব্দের নয়, ক্রমের। একটা কাঠামো শেখো, তাতে নিজের হাজারটা বাক্য বসাও।",
      "progressId": "english-progress",
      "resetId": "english-reset",
      "resetLabel": "রিসেট",
      "countFallback": "পর্ব আর দিন, এক নজরে",
      "actions": [
        {
          "href": "/english/term-1/word-order.html",
          "label": "প্রথম পর্ব শুরু করুন →",
          "kind": "solid"
        },
        {
          "href": "/english/term-1/workbook",
          "label": "৩০ দিনের খাতা",
          "kind": "ghost"
        }
      ]
    },
    "sections": [
      {
        "id": "niyom",
        "label": "ছয়টা নিয়ম · <span lang=\"en\">The six rules</span>",
        "intro": "এই ছয়টা মানলে দ্রুত পারবে। না মানলে বছর যাবে।",
        "cells": [
          {
            "title": "জোরে বলো, সবসময়",
            "html": "<p>চুপচাপ পড়া মানে শূন্য। মুখ না নড়লে সেটা অনুশীলন নয়।</p>"
          },
          {
            "title": "একা শব্দ শিখো না",
            "html": "<p>শব্দ সবসময় বাক্যের ভিতরে শেখো। <span lang=\"en\">\"cook\"</span> নয়, <span lang=\"en\">\"I cook rice every evening\"</span>।</p>"
          },
          {
            "title": "বাক্য নয়, কাঠামো",
            "html": "<p>একটা বাক্য শিখলে একটা পারবে। কাঠামো শিখলে হাজারটা।</p>"
          },
          {
            "title": "এগোনোর আগে কুড়িবার বদলাও",
            "html": "<p>একই কাঠামোতে কুড়িটা আলাদা শব্দ বসাও। তখনই মুখে আসে।</p>"
          },
          {
            "title": "ভুল রাস্তা, খানা নয়",
            "html": "<p>ভুল মানে শেখা হচ্ছে। ভুলের ভয়ে চুপ মানে শেখা বন্ধ।</p>"
          },
          {
            "title": "আগে গতকাল, তারপর আজ",
            "html": "<p>নতুন কিছুর আগে গতকালেরটা একবার জোরে। সবচেয়ে সস্তা, সবচেয়ে কাজের অভ্যাস।</p>"
          }
        ]
      },
      {
        "id": "ladder",
        "label": "দুটো টার্ম · <span lang=\"en\">Two terms</span>",
        "intro": "প্রথম টার্মে বাক্য বানানো। দ্বিতীয়তে ভাব বহন: যুক্তি, সন্দেহ, কল্পনা, ভদ্র দ্বিমত, আর না থেমে দুই মিনিট বলা।",
        "ladder": {
          "listId": "term-list",
          "fallback": [
            "<a href=\"/english/term-1\"><b>টার্ম ১ · শুরু থেকে</b></a> ১৩টি পর্ব। শব্দের ক্রম, <span lang=\"en\">am/is/are</span>, <span lang=\"en\">have</span>, তিন কাল, সাহায্যকারী শব্দ, প্রশ্ন, আঠা-শব্দ আর রোজকার বাক্যভাণ্ডার। সাথে ৩০ দিনের অনুশীলন খাতা।",
            "<a href=\"/english/term-2\"><b>টার্ম ২ · ভাব বহন</b></a> ১৭টি পর্ব। ভাব জোড়া দেওয়া, <span lang=\"en\">perfect</span> কাল, সময়ের স্তর, <span lang=\"en\">if</span>, নিশ্চয়তা, <span lang=\"en\">passive</span>, reported speech, phrasal verb, সুর আর দুই মিনিট ধরে বলা।"
          ]
        }
      },
      {
        "id": "rutin",
        "label": "রোজকার এক ঘণ্টা · <span lang=\"en\">Every day</span>",
        "routine": {
          "intro": "পাঁচ ভাগ, এক ঘণ্টা। কম সময় পেলে অনুপাতটা একই রাখুন, আর অন্তত অর্ধেকটা মুখে বলুন।",
          "steps": [
            {
              "n": "১০",
              "html": "গতকালের বাক্যগুলো জোরে পড়ুন।"
            },
            {
              "n": "১৫",
              "html": "নতুন কাঠামো শিখুন, নিজে দশটা বাক্য বানান।"
            },
            {
              "n": "১৫",
              "html": "বলুন: একটা ছবি বর্ণনা করুন, বা দিনের গল্প বলুন।"
            },
            {
              "n": "১০",
              "html": "শুনুন: ধীর ইংরেজি, আর প্রতিটা লাইন নকল করুন।"
            },
            {
              "n": "১০",
              "html": "খাতা: শব্দগুচ্ছ, একা শব্দ নয়।"
            }
          ],
          "actions": [
            {
              "href": "/english/term-1/workbook",
              "label": "আজকের পাতা খুলুন →",
              "kind": "solid"
            },
            {
              "href": "/english/term-1/workbook#spiel",
              "label": "বাক্য সাজানোর খেলা",
              "kind": "ghost"
            },
            {
              "href": "/english/term-2/holding-the-floor.html",
              "label": "শেষে কোথায় পৌঁছাবে",
              "kind": "ghost"
            }
          ]
        }
      },
      {
        "id": "prosno",
        "label": "প্রশ্ন · <span lang=\"en\">Questions</span>",
        "questions": [
          {
            "q": "আমি তো ইংরেজি একদমই পারি না। এটা কি আমার জন্য?",
            "html": "<p>হ্যাঁ, বর্ণমালা পড়তে পারলেই। প্রথম টার্ম শুরু করে বাক্যের ক্রম থেকে, তারপর <span lang=\"en\">am/is/are</span>। উচ্চারণ বাকি থাকলে খাতার শুরুর ধ্বনির চাবিটা আগে।</p>"
          },
          {
            "q": "কতদিনে কী হবে?",
            "html": "<p>ত্রিশ দিনে: নিজের পরিচয়, পরিবার, রোজকার কাজ, কালকের গল্প, আর পাঁচ মিনিট কথা। নব্বই দিনে: দুই মিনিট একটানা, যুক্তি দিয়ে দ্বিমত, আর অনুবাদ না করে ভাবা।</p>"
          },
          {
            "q": "এটা কি পরীক্ষার প্রস্তুতি?",
            "html": "<p>না। লক্ষ্য মুখ খোলা। ব্যাকরণ আছে, মুখস্থ করতে নয়, বাক্য বানাতে।</p>"
          },
          {
            "q": "খাতাটা কি ছাপাতে হবে?",
            "html": "<p>না। <a href=\"/english/term-1/workbook\">৩০ দিনের খাতা</a> ব্রাউজারেই ভরা যায়। ছাপতে চাইলে পুরো তিরিশ দিন এক পাতায় আসে।</p>"
          },
          {
            "q": "আমার হিসাব কোথায় জমা থাকে?",
            "html": "<p>আপনার অ্যাকাউন্টে। যে ডিভাইস থেকেই খুলুন হিসাবটা এক থাকে: ফোনে টিক দিলে ল্যাপটপেও দেখাবে।</p>"
          },
          {
            "q": "অন্য ভাষাগুলো কোথায়?",
            "html": "<p>জার্মান আছে <a href=\"/deutsch\">জার্মান স্কুলে</a>, আর কুরআনের আরবি <a href=\"/quran\">এখানে</a>। সবগুলোর তালিকা <a href=\"/skills\">দক্ষতার পাতায়</a>।</p>"
          }
        ]
      }
    ],
    "note": "<span lang=\"en\">Speak badly. Speak today.</span> কাল নিখুঁত ইংরেজির চেয়ে আজকের ভাঙা ইংরেজি অনেক বেশি দামি।"
  }
};
