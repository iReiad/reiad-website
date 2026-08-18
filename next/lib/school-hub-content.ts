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
      "lede": "<span lang=\"de\">Wort für Wort? Nein. Muster für Muster.</span><br> শব্দ মুখস্থ নয়, কাঠামো। একটা জার্মান ছাঁচ শিখবেন, তারপর সেই ছাঁচে নিজের হাজারটা বাক্য ঢালবেন। ইংরেজিতে যেভাবে শিখেছেন, ঠিক সেই পথ, নতুন সুরে।",
      "progressId": "deutsch-progress",
      "resetId": "deutsch-reset",
      "resetLabel": "রিসেট",
      "actions": [
        {
          "href": "/deutsch/stufe-1/index.html",
          "label": "Stufe ১ শুরু করুন →",
          "kind": "solid"
        },
        {
          "href": "/deutsch/stufe-1/arbeitsbuch.html",
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
            "html": "<p>প্রতিটা পাঠে একটা করে <span lang=\"de\">Muster</span>: একটা কাঠামো, যার ফাঁকা ঘরে আপনি নিজের জীবনের শব্দ বসাবেন। <span lang=\"de\">Ich möchte ____</span> শিখলেই বিশটা বাক্য আপনার। বাক্য মুখস্থ করলে বিশটা বাক্যই থেকে যায়।</p>"
          },
          {
            "title": "বাংলা দিয়ে ব্যাখ্যা, জার্মান দিয়ে অভ্যাস",
            "html": "<p>ব্যাখ্যাটা আপনার ভাষায়, যাতে বুঝতে শক্তি খরচ না হয়। আর যা মুখে তুলবেন সেটা পুরোটাই জার্মান। ধরে নেওয়া হয়েছে আপনি ইংরেজি একবার শিখেছেন, তাই সেই অভিজ্ঞতাটাকে বারবার কাজে লাগানো হয়েছে।</p>"
          },
          {
            "title": "রোজ একটা পাতা",
            "html": "<p>প্রথম <span data-count=\"workbooks\">৩</span>টা স্তরের সঙ্গে একটা করে অনুশীলন খাতা, আর স্তর যত উপরে খাতা তত লম্বা। দিনে একটা পাতা: একটা ছাঁচ, পাঁচটা নমুনা, নিজের আটটা বাক্য, ছয়টা অনুবাদ, আর নিজের জীবনের একটা সত্যি অনুচ্ছেদ। যা লিখবেন সেটা আপনার ব্রাউজারেই থাকবে।</p>"
          },
          {
            "title": "কোনো লগইন নেই, কোনো দাম নেই",
            "html": "<p>অ্যাকাউন্ট লাগে না, ইমেইল লাগে না, অ্যাপ নামাতে হয় না। আপনার অগ্রগতি আর আপনার লেখা কথাগুলো এই ব্রাউজারেই জমা থাকে, কোথাও পাঠানো হয় না।</p>"
          }
        ],
        "rule": {
          "label": "<span lang=\"de\">Die eine Regel</span> · একটাই নিয়ম",
          "html": "<p><span lang=\"en\">If your mouth does not move, it is not language practice.</span> মুখ না নড়লে সেটা ভাষার অনুশীলন নয়, শুধু পড়া। সময়ের অন্তত অর্ধেকটা জোরে বলতে হবে। ভুল হলে চলবে, একা হলে চলবে: চুপ থাকলে চলবে না।</p>"
        }
      },
      {
        "id": "leiter",
        "label": "চারটা স্তর · <span lang=\"de\">Die vier Stufen</span>",
        "intro": "শূন্য থেকে মুক্তভাবে বলা পর্যন্ত, চার ধাপে। যেখান থেকে খুশি শুরু করতে পারেন, কিছুই বন্ধ করা নেই, তবে ক্রম মেনে গেলে প্রতিটা স্তর আগেরটার ওপর দাঁড়ায়। চারটা স্তরেরই সব পাঠ লেখা হয়ে গেছে।",
        "ladder": {
          "listId": "leiter-list",
          "fallback": [
            "<a href=\"/deutsch/stufe-1/index.html\"><b>Stufe 1 · একদম শুরু থেকে</b></a> ধ্বনি, বাক্যের ইঞ্জিন, <span lang=\"de\">sein</span> ও <span lang=\"de\">haben</span>, তিন টুপি, ক্রিয়ার মেশিন, না-বলা, প্রশ্ন, বন্ধনী, সংখ্যা।",
            "<a href=\"/deutsch/stufe-2/index.html\"><b>Stufe 2 · সেতু গড়া</b></a> <span lang=\"de\">Akkusativ</span> ও <span lang=\"de\">Dativ</span>, কাতাপল্ট-ক্রিয়া, আঠা-শব্দ, <span lang=\"de\">Perfekt</span> দিয়ে গতকালের কথা, আর <span lang=\"de\">weil</span>।",
            "<a href=\"/deutsch/stufe-3/index.html\"><b>Stufe 3 · নদীটা খুঁজে পাওয়া</b></a> <span lang=\"de\">Präteritum</span>, বিশেষণের লেজ, সম্বন্ধ-বাক্য, <span lang=\"de\">Konjunktiv II</span>, তুলনা, ভবিষ্যৎ আর তর্ক।",
            "<a href=\"/deutsch/stufe-4/index.html\"><b>Stufe 4 · সূক্ষ্ম সুর</b></a> কর্মবাচ্য, অতীতের-অতীত, আক্ষেপ, <span lang=\"de\">Modalpartikeln</span>, কূটনৈতিক সুর, আনুষ্ঠানিক লেখা।"
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
              "href": "/deutsch/stufe-1/arbeitsbuch.html",
              "label": "আজকের পাতা খুলুন →",
              "kind": "solid"
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
            "html": "<p>হ্যাঁ, এটা ঠিক সেই ধরনের মানুষের জন্যই লেখা। <a href=\"/deutsch/stufe-1/laute.html\">Stufe ১-এর ধ্বনির পাঠ</a> ধরে নেয় আপনি জার্মানের একটা অক্ষরও চেনেন না। শুধু একটা জিনিস ধরে নেওয়া হয়েছে: আপনি ইংরেজি একবার শিখেছেন, তাই সেই অভিজ্ঞতাটা বারবার কাজে লাগানো হয়েছে।</p>"
          },
          {
            "q": "কতদিনে কী হবে?",
            "html": "<p>Stufe ১-এর খাতা শেষে আপনি নিজের পরিচয় দিতে পারবেন, কিছু চাইতে পারবেন, প্রশ্ন করতে পারবেন, 'না' বলতে পারবেন, আর নিজের দিনটা জার্মানে বলতে পারবেন। এটা সাবলীলতা নয়, কিন্তু এটাই সেই জায়গা যেখান থেকে কথা বলা শুরু হয়।</p> <p>প্রতিটা স্তরের পাতায় লেখা আছে সেই স্তর শেষে ঠিক কী কী পারবেন, আর তার খাতাটা কত দিনের। উপরের দিকে খাতাগুলো লম্বা হয়, কারণ কারক, অতীত আর সাবলীলতা তাড়াহুড়ো মানে না।</p>"
          },
          {
            "q": "খাতায় যা লিখব, সেটা কোথায় জমা থাকে?",
            "html": "<p>আপনার নিজের ব্রাউজারে, আপনার ডিভাইসেই। কোথাও পাঠানো হয় না, কোনো অ্যাকাউন্ট লাগে না, কোনো লগইন নেই। অন্য ফোনে খুললে নতুন করে শুরু হবে, আর ব্রাউজারের ডেটা মুছলে লেখাগুলোও চলে যাবে, তাই গুরুত্বপূর্ণ কিছু লিখলে নিজের খাতাতেও লিখে রাখুন।</p>"
          },
          {
            "q": "বাংলা কেন? সবাই তো ইংরেজি দিয়ে জার্মান শেখায়।",
            "html": "<p>কারণ দুইটা বিদেশি ভাষা একসাথে সামলানো অহেতুক পরিশ্রম। ব্যাখ্যাটা মাতৃভাষায় হলে মাথার পুরো জায়গাটা জার্মানের জন্য খালি থাকে। আর বাংলায় এমন কিছু জিনিস আছে (তুমি-তোমরা-আপনি, ক্রিয়ার রূপবদল) যেগুলো জার্মানের সাথে মেলে কিন্তু ইংরেজির সাথে মেলে না, সেগুলো ব্যবহার না করাটা ক্ষতি।</p>"
          },
          {
            "q": "এটা কি কোনো পরীক্ষার প্রস্তুতি?",
            "html": "<p>না। লক্ষ্য একটাই: আপনি যেন মুখ খুলে বলতে পারেন। কোনো সার্টিফিকেট নেই, কোনো পরীক্ষার ছক নেই। তবে পথটা মোটামুটি A1 থেকে C1 পর্যন্ত যায়, তাই Goethe বা telc দিতে চাইলে <a href=\"/deutsch/stufe-4/index.html\">Stufe ৪</a> পর্যন্ত শেষ করার পরে আলাদা করে শুধু পরীক্ষার ধরনটা অভ্যাস করলেই চলবে।</p>"
          },
          {
            "q": "টাকা আর বাজারের লেখাগুলো কোথায় গেল?",
            "html": "<p>সেগুলো আলাদা জায়গায়, <a href=\"/money/index.html\">শেখার লাইব্রেরিতে</a>। দুইটা একদম আলাদা বিষয়, তাই আলাদা পথে রাখা হয়েছে: বিনিয়োগ খুঁজতে এসে <span lang=\"de\">Akkusativ</span> পেরোতে হবে না, আর জার্মান খুঁজতে এসে ব্রোকার পেরোতে হবে না।</p>"
          }
        ]
      }
    ],
    "closing": {
      "label": "পাশের ঘর",
      "title": "টাকার ভাষাও আছে, আপনার ভাষায়",
      "html": "এই সাইটের অন্য শেখার জায়গাটা বাংলাদেশে বিনিয়োগ নিয়ে: একদম শুরু থেকে গবেষণা পর্যন্ত আট ধাপ, সবটাই সহজ বাংলায়। দুটো জায়গা আলাদা, কিন্তু নিয়ম এক: ব্যাখ্যা আপনার ভাষায়, সিদ্ধান্ত আপনার।",
      "actions": [
        {
          "href": "/money/index.html",
          "label": "শেখার লাইব্রেরি →",
          "kind": "solid"
        },
        {
          "href": "/tools/index.html",
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
      "lede": "তুমি আরবি পড়তে পারো, কিন্তু কী পড়ছ তা বোঝো না। এই কোর্সটা ঠিক সেই জায়গার জন্য: ষাট দিনে কুরআনের শব্দগুলো চিনে ফেলা, যাতে পড়ার সময় মনে মনে বাংলা করতে না হয়, শুনলেই মানে অনুভব হয়।",
      "progressId": "quran-progress",
      "resetId": "quran-reset",
      "resetLabel": "রিসেট",
      "actions": [
        {
          "href": "/quran/dhap-1/tin-prokar.html",
          "label": "দিন ১ শুরু করুন →",
          "kind": "solid"
        },
        {
          "href": "/quran/dhap-1/index.html",
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
            "html": "<p>এই কোর্সে কিছু লিখতে হয় না। শুধু পড়া, জোরে বলা, আর অনুভব করা। খাতা-কলম লাগবে না, আর তাই যেকোনো জায়গায়, যেকোনো সময় এক দিনের পাঠ শেষ করা যায়।</p>"
          },
          {
            "title": "দিনে একটা পাতা",
            "html": "<p>একদিনে একটা দিন, তার বেশি নয়। প্রথম ধাপে ২০ থেকে ৩০ মিনিট, শেষ ধাপে ৩০ থেকে ৪০। তাড়াহুড়ো নেই, কারণ বারবার শুনলে আর বললে শব্দগুলো নিজেই মনে বসে যায়।</p>"
          },
          {
            "title": "অল্প শব্দ, বারবার",
            "html": "<p>কুরআনে অল্প কিছু শব্দই বারবার আসে। সবচেয়ে বেশি ব্যবহৃত প্রায় ৩০০টা শব্দ চিনলেই বেশির ভাগ শব্দ তোমার চেনা হয়ে যাবে। তাই ভয়ের কিছু নেই।</p>"
          },
          {
            "title": "কোনো লগইন নেই, কোনো দাম নেই",
            "html": "<p>অ্যাকাউন্ট লাগে না, ইমেইল লাগে না, অ্যাপ নামাতে হয় না। কোন দিনগুলো হয়েছে সেই হিসাব আপনার এই ব্রাউজারেই জমা থাকে, কোথাও পাঠানো হয় না।</p>"
          }
        ]
      },
      {
        "id": "ladder",
        "label": "তিনটি ধাপ · <span lang=\"ar\" dir=\"rtl\">ثَلَاثُ مَرَاحِلَ</span>",
        "intro": "শব্দ চেনা থেকে গোটা সূরা পড়া পর্যন্ত, তিন ধাপে ষাট দিন। যেখান থেকে খুশি শুরু করতে পারেন, কিছুই বন্ধ করা নেই, তবে ক্রম মেনে গেলে প্রতিটা ধাপ আগেরটার ওপর দাঁড়ায়। তিনটে ধাপেরই সব দিন লেখা হয়ে গেছে।",
        "ladder": {
          "listId": "dhap-list",
          "fallback": [
            "<a href=\"/quran/dhap-1/index.html\"><b>ধাপ ১ · ভিত্তি</b></a> ১০ দিন। নাম-শব্দ, সর্বনাম, পুরুষ ও স্ত্রী, ছোট জোড়া-শব্দ, <span lang=\"ar\" dir=\"rtl\">الـ</span>, আর প্রথম তিনটি আয়াত।",
            "<a href=\"/quran/dhap-2/index.html\"><b>ধাপ ২ · শব্দ থেকে বাক্য</b></a> ২০ দিন। মূল ও ছাঁচ, ক্রিয়ার তিন কাল, নাম-বাক্য ও কাজ-বাক্য, ইদাফা, শব্দের শেষের চিহ্ন, আর হারাকাত ছাড়া পড়া।",
            "<a href=\"/quran/dhap-3/index.html\"><b>ধাপ ৩ · বাক্য থেকে সূরা</b></a> ৩০ দিন। ক্রিয়ার রূপ, ভাঙা বহুবচন, কর্মবাচ্য, বাক্যের হাতিয়ার, আর চারটে সূরা শব্দ ধরে ধরে।"
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
            "html": "<p>না, এখনো নয়। এই কোর্স ধরে নেয় আপনি হরকত দেখে আরবি পড়তে পারেন, মানে বুঝতে পারেন না। যদি বর্ণ চেনা বা উচ্চারণটাই বাকি থাকে, আগে সেটা শিখে নিন, তারপর এখানে ফিরে আসুন। তখন এই ষাট দিন অনেক সহজ লাগবে।</p>"
          },
          {
            "q": "কতদিনে কী হবে?",
            "html": "<p>প্রথম ধাপের দশ দিন শেষে বিসমিল্লাহ, আলহামদু লিল্লাহ আর সূরা ইখলাসের প্রথম আয়াত শব্দ ধরে ধরে বুঝতে পারবেন। ষাট দিন শেষে চারটে ছোট সূরা পুরোটা বুঝবেন, আর যের-যবর ছাড়া লেখা চেনা লাইনও পড়তে পারবেন।</p> <p>প্রতিটা ধাপের পাতায় লেখা আছে সেই ধাপ শেষে ঠিক কী কী পারবেন।</p>"
          },
          {
            "q": "এটা কি ব্যাকরণের কোর্স?",
            "html": "<p>ঠিক তা নয়। নিয়ম আছে, কিন্তু নিয়মগুলো মুখস্থ করার জন্য নয়, চেনার জন্য। লক্ষ্য একটাই: কুরআন পড়ার সময় শব্দগুলো যেন অচেনা না লাগে। তাই প্রতিটা নিয়মের সাথে সাথেই দেখানো হয় সেটা কোন আয়াতে বসে আছে।</p>"
          },
          {
            "q": "কিছু লিখতে হবে না, সত্যি?",
            "html": "<p>সত্যি। কোর্সটার নিজের নিয়মই তাই: কোনো লেখা নয়, শুধু পড়া, জোরে বলা আর অনুভব করা। তাই এখানে কোনো ঘর ভরানোর জায়গা নেই, আর প্রতিটা দিনের শেষে একটাই নির্দেশ: মুখে বলো।</p>"
          },
          {
            "q": "আমার হিসাব কোথায় জমা থাকে?",
            "html": "<p>আপনার নিজের ব্রাউজারে, আপনার ডিভাইসেই। কোথাও পাঠানো হয় না, কোনো অ্যাকাউন্ট লাগে না। অন্য ফোনে খুললে নতুন করে শুরু হবে, আর ব্রাউজারের ডেটা মুছলে হিসাবটাও চলে যাবে।</p>"
          },
          {
            "q": "জার্মান শেখার অংশটা কোথায় গেল?",
            "html": "<p>সেটা আলাদা জায়গায়, <a href=\"/deutsch/index.html\">জার্মান স্কুলে</a>। দুটো একদম আলাদা বিষয়, তাই আলাদা পথে রাখা হয়েছে। দুটোরই পুরো তালিকা <a href=\"/skills/index.html\">দক্ষতার পাতায়</a>।</p>"
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
      "lede": "তুমি ইংরেজি বোঝো, স্কুলে পড়েছো, সাইনবোর্ড পড়তে পারো। তবু মুখ খুলতে গেলে বাক্য আসে না। সমস্যাটা শব্দভাণ্ডারের নয়: একটা বাক্য কোন ক্রমে বসে, সেটা জানা নেই। একটা কাঠামো শেখো, তারপর তার ভিতরে নিজের হাজারটা বাক্য বসাও।",
      "progressId": "english-progress",
      "resetId": "english-reset",
      "resetLabel": "রিসেট",
      "actions": [
        {
          "href": "/english/term-1/word-order.html",
          "label": "প্রথম পর্ব শুরু করুন →",
          "kind": "solid"
        },
        {
          "href": "/english/term-1/workbook.html",
          "label": "৩০ দিনের খাতা",
          "kind": "ghost"
        }
      ]
    },
    "sections": [
      {
        "id": "niyom",
        "label": "ছয়টা নিয়ম · <span lang=\"en\">The six rules</span>",
        "intro": "এই ছয়টা মানলে দ্রুত পারবে। না মানলে বছর যাবে, কিছু হবে না। কোর্সটার নিজের নিয়ম, আর এখানে কিছু বদলানো হয়নি।",
        "cells": [
          {
            "title": "জোরে বলো, সবসময়",
            "html": "<p>চুপচাপ পড়া মানে শূন্য। জোরে বলো, নিজের কানে শোনো। মুখ না নড়লে সেটা ভাষার অনুশীলন নয়, শুধু পড়া।</p>"
          },
          {
            "title": "একা শব্দ শিখো না",
            "html": "<p>শব্দ সবসময় বাক্যের ভিতরে শেখো। <span lang=\"en\">\"cook\"</span> নয়, <span lang=\"en\">\"I cook rice every evening\"</span>।</p>"
          },
          {
            "title": "বাক্য নয়, কাঠামো",
            "html": "<p>একটা বাক্য শিখলে একটা বাক্য পারবে। কাঠামো শিখলে হাজারটা। প্রতিটা পর্বের শুরুতেই তাই কাঠামোটা থাকে, ব্যাখ্যার আগে।</p>"
          },
          {
            "title": "এগোনোর আগে কুড়িবার বদলাও",
            "html": "<p>একই কাঠামোতে কুড়িটা আলাদা শব্দ বসাও। তখনই সেটা মনে বসে যায়, আর মুখেও আসে।</p>"
          },
          {
            "title": "ভুল রাস্তা, খানা নয়",
            "html": "<p>ভুল করা মানে শেখা হচ্ছে। ভুলের ভয়ে চুপ থাকা মানে শেখা বন্ধ। এই কোর্সে ভুল হওয়াটাই প্রত্যাশিত।</p>"
          },
          {
            "title": "আগে গতকাল, তারপর আজ",
            "html": "<p>নতুন কিছু শুরুর আগে গতকালেরটা একবার জোরে বলে নাও। এটাই পুরো পদ্ধতির সবচেয়ে সস্তা আর সবচেয়ে কার্যকর অংশ।</p>"
          }
        ]
      },
      {
        "id": "ladder",
        "label": "দুটো টার্ম · <span lang=\"en\">Two terms</span>",
        "intro": "প্রথম টার্ম শেখায় বাক্য বানাতে। দ্বিতীয় টার্ম শেখায় চিন্তা বহন করতে: যুক্তি দেওয়া, সন্দেহ করা, কল্পনা করা, ভদ্রভাবে দ্বিমত করা, আর না থেমে দুই মিনিট বলা। যেখান থেকে খুশি শুরু করতে পারেন, কিছুই বন্ধ করা নেই, তবে ক্রম মেনে গেলে দ্বিতীয়টা প্রথমটার উপর দাঁড়ায়।",
        "ladder": {
          "listId": "term-list",
          "fallback": [
            "<a href=\"/english/term-1/index.html\"><b>টার্ম ১ · শুরু থেকে</b></a> ১৩টি পর্ব। শব্দের ক্রম, <span lang=\"en\">am/is/are</span>, <span lang=\"en\">have</span>, তিন কাল, সাহায্যকারী শব্দ, প্রশ্ন, আঠা-শব্দ আর রোজকার বাক্যভাণ্ডার। সাথে ৩০ দিনের অনুশীলন খাতা।",
            "<a href=\"/english/term-2/index.html\"><b>টার্ম ২ · ভাব বহন</b></a> ১৭টি পর্ব। ভাব জোড়া দেওয়া, <span lang=\"en\">perfect</span> কাল, সময়ের স্তর, <span lang=\"en\">if</span>, নিশ্চয়তা, <span lang=\"en\">passive</span>, reported speech, phrasal verb, সুর আর দুই মিনিট ধরে বলা।"
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
              "href": "/english/term-1/workbook.html",
              "label": "আজকের পাতা খুলুন →",
              "kind": "solid"
            },
            {
              "href": "/english/term-2/holding-the-floor.html",
              "label": "শেষে কোথায় পৌঁছাবেন",
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
            "html": "<p>হ্যাঁ, যদি আপনি ইংরেজি বর্ণমালা পড়তে পারেন। প্রথম টার্ম ধরেই নেয় আপনি কিছু শব্দ চেনেন কিন্তু বাক্য বানাতে পারেন না, আর সেখান থেকেই শুরু করে: বাক্যের ক্রম, তারপর <span lang=\"en\">am/is/are</span>।</p> <p>যদি বর্ণমালা বা উচ্চারণটাই বাকি থাকে, খাতার শুরুতে ধ্বনির চাবিটা আগে নিন, তারপর প্রথম পর্বে ফিরে আসুন।</p>"
          },
          {
            "q": "কতদিনে কী হবে?",
            "html": "<p>প্রথম টার্মের ত্রিশ দিন শেষে নিজের পরিচয়, পরিবার, রোজকার কাজ, কালকের গল্প আর আগামীকালের পরিকল্পনা ইংরেজিতে বলতে পারবেন, আর পাঁচ মিনিট কথা চালিয়ে নিতে পারবেন।</p> <p>দ্বিতীয় টার্মের নব্বই দিন শেষে দুই মিনিট একটানা বলতে পারবেন, যুক্তি দিয়ে দ্বিমত করতে পারবেন, আর অনুবাদ না করে সরাসরি ইংরেজিতে ভাবতে শুরু করবেন।</p>"
          },
          {
            "q": "এটা কি পরীক্ষার প্রস্তুতি?",
            "html": "<p>না। কোনো সার্টিফিকেট নেই, কোনো পরীক্ষা নেই। লক্ষ্য একটাই: আপনি যেন মুখ খুলে বলতে পারেন। ব্যাকরণ আছে, কিন্তু নিয়ম মুখস্থ করার জন্য নয়, বাক্য বানানোর জন্য।</p>"
          },
          {
            "q": "খাতাটা কি ছাপাতে হবে?",
            "html": "<p>না। <a href=\"/english/term-1/workbook.html\">৩০ দিনের খাতা</a> ব্রাউজারেই ভরা যায়, আর যা লেখেন সেটা আপনার নিজের ডিভাইসেই জমা থাকে। চাইলে ছাপাতেও পারেন: পাতাটা ছাপার জন্যই বানানো, আর ছাপলে পুরো তিরিশ দিনই আসে।</p>"
          },
          {
            "q": "আমার হিসাব কোথায় জমা থাকে?",
            "html": "<p>আপনার নিজের ব্রাউজারে, আপনার ডিভাইসেই। কোথাও পাঠানো হয় না, কোনো অ্যাকাউন্ট লাগে না। অন্য ফোনে খুললে নতুন করে শুরু হবে, আর ব্রাউজারের ডেটা মুছলে হিসাবটাও চলে যাবে।</p>"
          },
          {
            "q": "অন্য ভাষাগুলো কোথায়?",
            "html": "<p>জার্মান আছে <a href=\"/deutsch/index.html\">জার্মান স্কুলে</a>, আর কুরআনের আরবি <a href=\"/quran/index.html\">এখানে</a>। সবগুলোর তালিকা <a href=\"/skills/index.html\">দক্ষতার পাতায়</a>।</p>"
          }
        ]
      }
    ],
    "note": "<span lang=\"en\">Speak badly. Speak today.</span> কাল নিখুঁত ইংরেজির চেয়ে আজকের ভাঙা ইংরেজি অনেক বেশি দামি।"
  }
};
