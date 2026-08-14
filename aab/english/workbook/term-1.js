/* ============================================================
   workbook/term-1.js: the thirty days of Term One.

   Straight out of "English From The Heart, the 30-day workbook",
   one object per day, in order. See ../workbook.data.js for what
   a day holds and why the workbook is one page and not thirty.

   The days line up with the parts, not one to one: parts 1 to 10
   of Term One are spread across these thirty pages, roughly
   three days to a part, because a pattern needs three evenings
   in the mouth before it is yours. Part 13's map is the same
   thirty days seen from above.

   House rules for the text here:

     · the learner is তুমি, as they are in the deck and in the
       other two language schools
     · every English string is the thing being taught; every
       Bangla string is what it means or why it works. Never the
       other way round
     · the answers are answers, not the only answer. The book
       says so on its own page: if the shape is right, you are
       right
   ============================================================ */

export default {
  /* The second line of every day's footer tick. */
  foot: "গতকালের পাতা আগে পড়েছি",

  /* The two lines under the title. */
  lede: {
    en: "One page a day. One pattern a day. One honest paragraph a day.",
    bn: "দিনে একটা পাতা। একটা কাঠামো। নিজের জীবনের একটা সত্যি অনুচ্ছেদ।",
  },

  /* The sounds Bangla does not have. Four pairs and one line
     about handwriting, which is what the printed book opens
     with, before day 1. */
  sounds: [
    {
      pair: "V বনাম W",
      words: "very / west · van / one · vine / wine",
      how: "V: উপরের দাঁত নিচের ঠোঁটে ছোঁয়াও। W: ঠোঁট গোল করো, দাঁত লাগবে না।",
    },
    {
      pair: "S · SH · Z",
      words: "see / she · sip / ship · zoo / sue",
      how: "বাংলায় 'শ' প্রাধান্য পায়, তাই S-ও 'শ' হয়ে যায়। S-এ জিভ সামনে, বাতাস সরু।",
    },
    {
      pair: "TH",
      words: "think · thank · this · mother",
      how: "জিভের ডগা উপর-নিচ দাঁতের মাঝে হালকা রাখো। এটা 'ট' নয়, 'দ'ও নয়।",
    },
    {
      pair: "F বনাম P",
      words: "fan / pan · fine / pine · four / poor",
      how: "F: ঠোঁটে দাঁত, বাতাস বেরোতে থাকে। P: দুই ঠোঁট বন্ধ করে হঠাৎ ছাড়ো।",
    },
    {
      pair: "হাতের লেখা",
      words: "r · d · g · a · e",
      how: "ধীরে লেখো, শুরু কোথায় আর শেষ কোথায় খেয়াল করো। তাড়াহুড়োর লেখা নিজেই পরে পড়তে পারবে না।",
    },
  ],

  /* What this book asks the learner to collect as they go. The
     rebels because they are the twenty words that will trip
     every past-tense sentence for a month, and their own lines
     because a learner who never looks back cannot see that they
     have moved. `key` prefixes the storage keys of the boxes, so
     it must never change once the book has shipped. */
  collect: {
    en: "The collection",
    bn: "সংগ্রহ",
    key: "collect",
    blurb:
      "যে ক্রিয়াগুলো পুরো বদলে যায়, সেগুলো এখানে জমাও, আর নিজের যে বাক্যটা আজ সবচেয়ে ভালো লেগেছে সেটাও। সপ্তাহে একবার পুরোটা জোরে পড়ো।",
    columns: [
      {
        key: "rebels",
        head: "Rebels · go → went",
        placeholder: "go → went\neat → ate\nsee → saw\n…",
      },
      {
        key: "mine",
        head: "My own lines · নিজের বাক্য",
        placeholder: "I woke up at six.\nI didn't give up.\n…",
      },
    ],
  },

  /* The band after the last day. */
  end: {
    en: "Day 31 is the day you stop needing this book.",
    bn:
      "৩১তম দিন হলো সেই দিন, যেদিন অভ্যাসগুলো খাতা ছাড়াই চলে: সারাদিন যা করছ তা ইংরেজিতে বলা, " +
      "রোজ রাতে দিনটা জোরে বলা, দিনে একটা সত্যিকারের জিনিস পড়া, সপ্তাহে অন্তত একজন মানুষের সাথে " +
      "ইংরেজিতে কথা বলা, আর না বুঝলে চুপ না থেকে বলা: \"Sorry, I didn't understand.\"",
  },

  /* The last line on the page. */
  motto: {
    en: "Speak badly. Speak today.",
    bn: "কাল নিখুঁত ইংরেজির চেয়ে আজকের ভাঙা ইংরেজি অনেক বেশি দামি।",
  },

  days: [
    {
      n: 1,
      en: "WHO + DOES + WHAT",
      bn: "কে, কী করে, কী",
      pattern: {
        shape: "WHO + DOES + WHAT",
        why: "বাংলায় ক্রিয়া বাক্যের শেষে বসে, ইংরেজিতে দুই নম্বরে। আজ শুধু এই একটা জিনিস মুখে বসাও।",
        examples: "I eat rice. · She reads a book. · We drink tea.",
        tip: "কাজের শব্দটা শেষে নয়, মাঝখানে। এই একটা অভ্যাসেই শুরুর অর্ধেক ভুল শেষ।",
      },
      watch: [
        { en: "I eat rice.", bn: "আমি ভাত খাই।" },
        { en: "She reads a book.", bn: "সে বই পড়ে।" },
        { en: "We drink tea.", bn: "আমরা চা খাই।" },
        { en: "They play cricket.", bn: "তারা ক্রিকেট খেলে।" },
        { en: "I love my mother.", bn: "আমি আমার মাকে ভালোবাসি।" },
      ],
      say: [
        { q: "আমি পানি খাই।", a: "I drink water." },
        { q: "সে ভাত রান্না করে।", a: "She cooks rice." },
        { q: "আমরা স্কুলে যাই।", a: "We go to school." },
        { q: "তারা গান গায়।", a: "They sing songs." },
        { q: "আমি তোমাকে বুঝি।", a: "I understand you." },
        { q: "বাচ্চাটা কাঁদে।", a: "The baby cries." },
      ],
      heart: {
        en: "Write 3 true sentences about what you do every day.",
        bn: "তুমি রোজ যা করো, তার তিনটা সত্যি বাক্য লেখো।",
      },
    },
    {
      n: 2,
      en: "I am ______",
      bn: "আমি ___ (হই)",
      pattern: {
        shape: "I + am + ______",
        why: "বাংলায় বলি 'আমি ছাত্রী', মাঝে কিছু লাগে না। ইংরেজিতে 'am' বসাতেই হবে।",
        examples: "I am happy. · I am a student. · I am from Bangladesh.",
        tip: "\"I student\" ভাঙা ইংরেজি। বাংলাভাষীর সবচেয়ে বেশি করা ভুলটা আজই শেষ করো।",
      },
      watch: [
        { en: "I am happy.", bn: "আমি খুশি।" },
        { en: "I am tired.", bn: "আমি ক্লান্ত।" },
        { en: "I am a student.", bn: "আমি ছাত্রী।" },
        { en: "I am from Bangladesh.", bn: "আমি বাংলাদেশের।" },
        { en: "I am not alone.", bn: "আমি একা নই।" },
      ],
      say: [
        { q: "আমি ক্ষুধার্ত।", a: "I am hungry." },
        { q: "আমি প্রস্তুত।", a: "I am ready." },
        { q: "আমি বাসায়।", a: "I am at home." },
        { q: "আমি ভয় পাচ্ছি।", a: "I am afraid." },
        { q: "আমার বয়স ষোলো।", a: "I am sixteen years old." },
        { q: "আমি গর্বিত।", a: "I am proud." },
      ],
      heart: {
        en: "Write 3 true sentences beginning with 'I am'.",
        bn: "'I am' দিয়ে নিজের তিনটা সত্যি বাক্য লেখো।",
      },
    },
    {
      n: 3,
      en: "He is · She is · It is · You are · We are · They are",
      bn: "is নাকি are?",
      pattern: {
        shape: "He / She / It → is        You / We / They → are",
        why: "একজন হলে is, একাধিক বা 'তুমি' হলে are। I হলে সবসময় am।",
        examples: "She is my sister. · They are at school. · You are right.",
        tip: "তিনটা মাত্র শব্দ: am, is, are। এক মিনিটের নিয়ম, সারাজীবনের কাজ।",
      },
      watch: [
        { en: "She is my sister.", bn: "সে আমার বোন।" },
        { en: "He is busy.", bn: "সে ব্যস্ত।" },
        { en: "It is cold today.", bn: "আজ ঠান্ডা।" },
        { en: "You are right.", bn: "তুমি ঠিক বলেছো।" },
        { en: "They are at school.", bn: "তারা স্কুলে।" },
      ],
      say: [
        { q: "সে আমার বাবা।", a: "He is my father." },
        { q: "আমরা বন্ধু।", a: "We are friends." },
        { q: "তারা প্রস্তুত।", a: "They are ready." },
        { q: "এটা সহজ।", a: "It is easy." },
        { q: "তুমি খুব ভালো।", a: "You are very kind." },
        { q: "সে ব্যস্ত নয়।", a: "She is not busy." },
      ],
      heart: {
        en: "Write 3 sentences about people in your family.",
        bn: "তোমার পরিবারের মানুষদের নিয়ে তিনটা বাক্য লেখো।",
      },
    },
    {
      n: 4,
      en: "NO and QUESTION with am / is / are",
      bn: "না বলা ও প্রশ্ন করা",
      pattern: {
        shape: "NO: He is NOT here.        QUESTION: IS he here?",
        why: "না বলতে be-এর পরেই not। প্রশ্ন করতে be-কে সামনে নিয়ে এসো।",
        examples: "I'm not hungry. · Are you ready? · Is she your friend?",
        tip: "প্রশ্ন করতে শুধু প্রথম দুই শব্দ উল্টে দাও। নতুন কিছু শিখতে হবে না।",
      },
      watch: [
        { en: "I'm not hungry.", bn: "আমার খিদে নেই।" },
        { en: "He isn't at home.", bn: "সে বাসায় নেই।" },
        { en: "Are you okay?", bn: "তুমি ঠিক আছো?" },
        { en: "Is she your friend?", bn: "সে কি তোমার বন্ধু?" },
        { en: "Yes, I am. / No, I'm not.", bn: "হ্যাঁ। / না।" },
      ],
      say: [
        { q: "আমি ক্লান্ত নই।", a: "I am not tired." },
        { q: "তারা বাসায় নেই।", a: "They aren't at home." },
        { q: "তুমি কি ছাত্রী?", a: "Are you a student?" },
        { q: "এটা কি দূরে?", a: "Is it far?" },
        { q: "সে কি রেগে আছে?", a: "Is he angry?" },
        { q: "আমরা কি দেরি করেছি?", a: "Are we late?" },
      ],
      heart: {
        en: "Write 3 questions you could ask a new friend.",
        bn: "নতুন বন্ধুকে করতে পারো, এমন তিনটা প্রশ্ন লেখো।",
      },
    },
    {
      n: 5,
      en: "I have ______",
      bn: "আমার ___ আছে",
      pattern: {
        shape: "I / You / We / They + have + ______",
        why: "বাংলা জিনিসটাকে আগে রাখে: 'আমার বোন আছে'। ইংরেজি মানুষকে আগে রাখে: I have a sister.",
        examples: "I have two brothers. · We have time. · I have an idea.",
        tip: "'আছে' মানেই 'is' নয়। মালিকানা বোঝালে have।",
      },
      watch: [
        { en: "I have two brothers.", bn: "আমার দুই ভাই আছে।" },
        { en: "I have a phone.", bn: "আমার ফোন আছে।" },
        { en: "We have time.", bn: "আমাদের সময় আছে।" },
        { en: "They have a garden.", bn: "তাদের বাগান আছে।" },
        { en: "I have an idea.", bn: "আমার একটা বুদ্ধি আছে।" },
      ],
      say: [
        { q: "আমার একটা ছোট বোন আছে।", a: "I have a little sister." },
        { q: "আমাদের আজ ক্লাস আছে।", a: "We have class today." },
        { q: "তাদের তিনটা গরু আছে।", a: "They have three cows." },
        { q: "আমার একটা স্বপ্ন আছে।", a: "I have a dream." },
        { q: "তোমার বড় মন।", a: "You have a big heart." },
        { q: "আমার একটা প্রশ্ন আছে।", a: "I have a question." },
      ],
      heart: {
        en: "Write 3 sentences about what you have.",
        bn: "তোমার কী কী আছে, তিনটা বাক্য লেখো।",
      },
    },
    {
      n: 6,
      en: "He has · She has · It has",
      bn: "তার ___ আছে",
      pattern: {
        shape: "He / She / It + has + ______",
        why: "একজন হলে have বদলে has হয়। ব্যস, এটুকুই।",
        examples: "She has long hair. · He has a bicycle. · It has four legs.",
        tip: "সেই একই এক সেকেন্ডের নিয়ম: he, she, it হলে has, বাকি সবাই have।",
      },
      watch: [
        { en: "She has long hair.", bn: "তার লম্বা চুল।" },
        { en: "He has a bicycle.", bn: "তার সাইকেল আছে।" },
        { en: "My mother has a shop.", bn: "মায়ের একটা দোকান আছে।" },
        { en: "She has a headache.", bn: "তার মাথাব্যথা করছে।" },
        { en: "It has four legs.", bn: "এটার চারটা পা।" },
      ],
      say: [
        { q: "তার জ্বর আছে।", a: "She has a fever." },
        { q: "তার ভালো চাকরি আছে।", a: "He has a good job." },
        { q: "আমার বোনের চশমা আছে।", a: "My sister has glasses." },
        { q: "তার দুটো সন্তান আছে।", a: "She has two children." },
        { q: "বাড়িটার একটা বড় দরজা আছে।", a: "The house has a big door." },
        { q: "তার অনেক বন্ধু আছে।", a: "He has many friends." },
      ],
      heart: {
        en: "Write 3 sentences about what someone else has.",
        bn: "অন্য কারো কী আছে, তিনটা বাক্য লেখো।",
      },
    },
    {
      n: 7,
      en: "I don't have · She doesn't have",
      bn: "আমার নেই",
      pattern: {
        shape: "I don't have ______        She doesn't have ______",
        why: "নেই বোঝাতে don't have বা doesn't have। বাংলার 'নেই' এক শব্দ, ইংরেজির দুই।",
        examples: "I don't have money. · She doesn't have time.",
        tip: "doesn't এলে has আবার have হয়ে যায়। টুপি একজনই পরবে।",
      },
      watch: [
        { en: "I don't have money.", bn: "আমার টাকা নেই।" },
        { en: "She doesn't have time.", bn: "তার সময় নেই।" },
        { en: "We don't have class today.", bn: "আজ আমাদের ক্লাস নেই।" },
        { en: "He doesn't have a car.", bn: "তার গাড়ি নেই।" },
        { en: "They don't have children.", bn: "তাদের সন্তান নেই।" },
      ],
      say: [
        { q: "আমার আজ সময় নেই।", a: "I don't have time today." },
        { q: "তার ফোন নেই।", a: "She doesn't have a phone." },
        { q: "আমাদের চাল নেই।", a: "We don't have rice." },
        { q: "তার ভাই নেই।", a: "He doesn't have a brother." },
        { q: "তাদের বাড়ি নেই।", a: "They don't have a house." },
        { q: "আমার কোনো প্রশ্ন নেই।", a: "I don't have any questions." },
      ],
      heart: {
        en: "Write 3 sentences about what you do not have, and want.",
        bn: "তোমার যা নেই কিন্তু চাও, তিনটা বাক্য লেখো।",
      },
    },
    {
      n: 8,
      en: "Do you have…? · Does she have…?",
      bn: "তোমার কি ___ আছে?",
      pattern: {
        shape: "DO you have ______ ?        DOES he have ______ ?",
        why: "প্রশ্নে Do বা Does সামনে বসে, আর তারপর have সাধারণ থাকে।",
        examples: "Do you have a pen? · Does he have a job?",
        tip: "\"Does she has\" কখনো নয়। Does এলে have সাধারণ।",
      },
      watch: [
        { en: "Do you have a pen?", bn: "তোমার কলম আছে?" },
        { en: "Does he have a job?", bn: "তার চাকরি আছে?" },
        { en: "Do they have children?", bn: "তাদের সন্তান আছে?" },
        { en: "Do you have change?", bn: "আপনার খুচরা আছে?" },
        { en: "Does it have a name?", bn: "এটার কি নাম আছে?" },
      ],
      say: [
        { q: "তোমার কি ভাই আছে?", a: "Do you have a brother?" },
        { q: "তার কি সময় আছে?", a: "Does she have time?" },
        { q: "আপনাদের কি ছোট সাইজ আছে?", a: "Do you have a smaller size?" },
        { q: "তার কি জ্বর আছে?", a: "Does he have a fever?" },
        { q: "তোমাদের কি আজ ক্লাস আছে?", a: "Do you have class today?" },
        { q: "এটার কি দাম আছে?", a: "Does it have a price?" },
      ],
      heart: {
        en: "Write 3 questions to ask a shopkeeper.",
        bn: "দোকানদারকে করবে, এমন তিনটা প্রশ্ন লেখো।",
      },
    },
    {
      n: 9,
      en: "I / You / We / They + VERB",
      bn: "রোজকার কাজের কথা",
      pattern: {
        shape: "I + go / eat / work / study + ______",
        why: "রোজ যা করো, তার জন্য সাধারণ ক্রিয়া। কোনো বদল নেই।",
        examples: "I go to school every day. · We study English.",
        tip: "ক্রিয়া একা বোলো না। সবসময় বাক্যের ভিতরে বলো: \"I cook rice\", শুধু \"cook\" নয়।",
      },
      watch: [
        { en: "I go to school every day.", bn: "আমি রোজ স্কুলে যাই।" },
        { en: "We study English.", bn: "আমরা ইংরেজি পড়ি।" },
        { en: "They live in Dhaka.", bn: "তারা ঢাকায় থাকে।" },
        { en: "I help my mother.", bn: "আমি মাকে সাহায্য করি।" },
        { en: "You speak very well.", bn: "তুমি খুব ভালো বলো।" },
      ],
      say: [
        { q: "আমি সকালে চা খাই।", a: "I drink tea in the morning." },
        { q: "আমরা রোজ ইংরেজি পড়ি।", a: "We study English every day." },
        { q: "তারা মাঠে খেলে।", a: "They play in the field." },
        { q: "আমি বাজারে যাই।", a: "I go to the market." },
        { q: "আমি রাতে বই পড়ি।", a: "I read a book at night." },
        { q: "আমরা একসাথে খাই।", a: "We eat together." },
      ],
      heart: {
        en: "Write 3 things you do every single day.",
        bn: "তুমি প্রতিদিন যা করো, তিনটা লেখো।",
      },
    },
    {
      n: 10,
      en: "He / She / It + VERB + s",
      bn: "ছোট্ট -s",
      pattern: {
        shape: "He / She / It + VERB + s",
        why: "একজন অন্য কেউ কাজ করলে ক্রিয়ার মাথায় ছোট্ট টুপি বসে: -s।",
        examples: "go → goes · do → does · watch → watches · study → studies",
        tip: "বাংলায় এমন কিছু নেই, তাই মুখ বারবার ভুলবে। দুই সপ্তাহ ধীরে বলো, তারপর নিজে থেকেই ঠিক হয়ে যাবে।",
      },
      watch: [
        { en: "He works in a shop.", bn: "সে দোকানে কাজ করে।" },
        { en: "She goes to school.", bn: "সে স্কুলে যায়।" },
        { en: "My mother cooks well.", bn: "মা ভালো রান্না করে।" },
        { en: "The shop opens at nine.", bn: "দোকান নয়টায় খোলে।" },
        { en: "She studies every night.", bn: "সে রোজ রাতে পড়ে।" },
      ],
      say: [
        { q: "সে ভাত খায়।", a: "She eats rice." },
        { q: "সে গান গায়।", a: "He sings songs." },
        { q: "বাচ্চাটা কাঁদে।", a: "The baby cries." },
        { q: "আমার ভাই গাড়ি চালায়।", a: "My brother drives a car." },
        { q: "সে টিভি দেখে।", a: "She watches TV." },
        { q: "সে চেষ্টা করে।", a: "He tries." },
      ],
      heart: {
        en: "Write 3 sentences about your mother's or your friend's day.",
        bn: "তোমার মা বা বন্ধুর দিন নিয়ে তিনটা বাক্য লেখো।",
      },
    },
    {
      n: 11,
      en: "I don't + VERB",
      bn: "আমি ___ করি না",
      pattern: {
        shape: "I / You / We / They + don't + VERB",
        why: "কাজে 'না' বলতে don't, আর তার পরে সাধারণ ক্রিয়া।",
        examples: "I don't understand. · We don't eat fish.",
        tip: "'not' একা বসে না। \"I not understand\" ভাঙা, \"I don't understand\" ঠিক।",
      },
      watch: [
        { en: "I don't understand.", bn: "আমি বুঝি না।" },
        { en: "We don't eat fish.", bn: "আমরা মাছ খাই না।" },
        { en: "They don't live here.", bn: "তারা এখানে থাকে না।" },
        { en: "I don't know him.", bn: "আমি তাকে চিনি না।" },
        { en: "I don't want to go.", bn: "আমি যেতে চাই না।" },
      ],
      say: [
        { q: "আমি ইংরেজি বলি না (এখনো)।", a: "I don't speak English (yet)." },
        { q: "আমরা মাংস খাই না।", a: "We don't eat meat." },
        { q: "আমি তাকে চিনি না।", a: "I don't know her." },
        { q: "তারা এখানে কাজ করে না।", a: "They don't work here." },
        { q: "আমি টিভি দেখি না।", a: "I don't watch TV." },
        { q: "আমি হাল ছাড়ি না।", a: "I don't give up." },
      ],
      heart: {
        en: "Write 3 things you do NOT do.",
        bn: "তুমি যা করো না, তিনটা লেখো।",
      },
    },
    {
      n: 12,
      en: "He doesn't + VERB",
      bn: "সে ___ করে না",
      pattern: {
        shape: "He / She / It + doesn't + VERB",
        why: "doesn't এলে ক্রিয়ার -s চলে যায়। এক বাক্যে টুপি একটাই।",
        examples: "She doesn't eat fish. · It doesn't work.",
        tip: "\"She doesn't eats\" ভুল। সোনালি নিয়ম: doesn't থাকলে ক্রিয়া সাধারণ।",
      },
      watch: [
        { en: "She doesn't eat fish.", bn: "সে মাছ খায় না।" },
        { en: "He doesn't know me.", bn: "সে আমাকে চেনে না।" },
        { en: "It doesn't work.", bn: "এটা কাজ করে না।" },
        { en: "My father doesn't smoke.", bn: "বাবা ধূমপান করেন না।" },
        { en: "She doesn't like tea.", bn: "সে চা পছন্দ করে না।" },
      ],
      say: [
        { q: "সে সকালে ওঠে না।", a: "She doesn't wake up early." },
        { q: "সে ইংরেজি বলে না।", a: "He doesn't speak English." },
        { q: "এটা খোলে না।", a: "It doesn't open." },
        { q: "আমার বোন মিথ্যা বলে না।", a: "My sister doesn't lie." },
        { q: "সে আমাকে সাহায্য করে না।", a: "He doesn't help me." },
        { q: "দোকানটা শুক্রবারে খোলে না।", a: "The shop doesn't open on Friday." },
      ],
      heart: {
        en: "Write 3 sentences: what someone in your house does not do.",
        bn: "তোমার বাড়ির কেউ যা করে না, তিনটা বাক্য লেখো।",
      },
    },
    {
      n: 13,
      en: "Do you…? · Does she…?",
      bn: "কাজ নিয়ে প্রশ্ন",
      pattern: {
        shape: "DO / DOES + WHO + VERB ?",
        why: "কাজ নিয়ে প্রশ্নের চাবি Do আর Does। তারপর ক্রিয়া সাধারণ।",
        examples: "Do you speak English? · Does she live in Dhaka?",
        tip: "\"Does she lives here?\" ভুল। Does-এর পরে ক্রিয়ায় -s বসে না।",
      },
      watch: [
        { en: "Do you speak English?", bn: "তুমি ইংরেজি বলো?" },
        { en: "Does she live in Dhaka?", bn: "সে কি ঢাকায় থাকে?" },
        { en: "Do they know you?", bn: "তারা কি তোমাকে চেনে?" },
        { en: "Do you understand me?", bn: "তুমি আমাকে বুঝতে পারছো?" },
        { en: "Does it hurt?", bn: "ব্যথা করছে?" },
      ],
      say: [
        { q: "তুমি কি রোজ পড়ো?", a: "Do you study every day?" },
        { q: "সে কি এখানে কাজ করে?", a: "Does he work here?" },
        { q: "তুমি কি চা খাও?", a: "Do you drink tea?" },
        { q: "তারা কি বাংলা বোঝে?", a: "Do they understand Bangla?" },
        { q: "সে কি রান্না করে?", a: "Does she cook?" },
        { q: "তুমি কি আমাকে চেনো?", a: "Do you know me?" },
      ],
      heart: {
        en: "Write 3 questions to ask your teacher.",
        bn: "শিক্ষককে করবে, এমন তিনটা প্রশ্ন লেখো।",
      },
    },
    {
      n: 14,
      en: "I am + VERB-ing",
      bn: "আমি ___ করছি",
      pattern: {
        shape: "I + am + VERB + ing",
        why: "এই মুহূর্তে যা ঘটছে। বাংলার 'করছি'-র মতোই, শুধু দুই টুকরায়।",
        examples: "I am cooking now. · I am learning English.",
        tip: "\"I eating\" ভাঙা। -ing এর আগে am, is বা are বসাতেই হবে।",
      },
      watch: [
        { en: "I am cooking now.", bn: "আমি এখন রান্না করছি।" },
        { en: "I am learning English.", bn: "আমি ইংরেজি শিখছি।" },
        { en: "I am trying my best.", bn: "আমি সর্বোচ্চ চেষ্টা করছি।" },
        { en: "I am waiting for you.", bn: "আমি তোমার জন্য অপেক্ষা করছি।" },
        { en: "I am not sleeping.", bn: "আমি ঘুমাচ্ছি না।" },
      ],
      say: [
        { q: "আমি এখন লিখছি।", a: "I am writing now." },
        { q: "আমি ভাত খাচ্ছি।", a: "I am eating rice." },
        { q: "আমি তোমার কথা শুনছি।", a: "I am listening to you." },
        { q: "আমি কাজ করছি না।", a: "I am not working." },
        { q: "আমি এখন পড়ছি।", a: "I am studying now." },
        { q: "আমি শিখছি, তাই ভুল করছি।", a: "I am learning, so I am making mistakes." },
      ],
      heart: {
        en: "Look around you. Write 3 things happening right now.",
        bn: "চারপাশে তাকাও। এখন যা ঘটছে, তিনটা লেখো।",
      },
    },
    {
      n: 15,
      en: "He is / They are + VERB-ing",
      bn: "সে বা তারা ___ করছে",
      pattern: {
        shape: "He is ______ing        They are ______ing",
        why: "একই কাঠামো, শুধু be বদলায়। কাজটা একই থাকে।",
        examples: "She is studying. · It is raining. · They are laughing.",
        tip: "তিন টুকরাই লাগবে: be + ক্রিয়া + ing। \"He is work\" নয়, \"He is working\"।",
      },
      watch: [
        { en: "She is studying.", bn: "সে পড়ছে।" },
        { en: "He is talking on the phone.", bn: "সে ফোনে কথা বলছে।" },
        { en: "It is raining.", bn: "বৃষ্টি হচ্ছে।" },
        { en: "They are laughing.", bn: "তারা হাসছে।" },
        { en: "We are waiting.", bn: "আমরা অপেক্ষা করছি।" },
      ],
      say: [
        { q: "মা রান্নাঘরে রান্না করছেন।", a: "Mother is cooking in the kitchen." },
        { q: "বাচ্চারা বাইরে খেলছে।", a: "The children are playing outside." },
        { q: "সে ঘুমাচ্ছে।", a: "She is sleeping." },
        { q: "বৃষ্টি পড়ছে না।", a: "It isn't raining." },
        { q: "তারা কথা বলছে না।", a: "They aren't talking." },
        { q: "আমরা ইংরেজি শিখছি।", a: "We are learning English." },
      ],
      heart: {
        en: "Describe a photo, or the room around you, in 3 sentences.",
        bn: "একটা ছবি বা তোমার ঘরটা তিন বাক্যে বর্ণনা করো।",
      },
    },
    {
      n: 16,
      en: "Every day vs Right now",
      bn: "রোজ বনাম এখন",
      pattern: {
        shape: "EVERY DAY: I eat rice.        RIGHT NOW: I am eating rice.",
        why: "অভ্যাস হলে সাধারণ ক্রিয়া, এই মুহূর্তে হলে be + ing।",
        examples: "She works. / She is working now. · It rains in June. / It is raining.",
        tip: "নিজেকে জিজ্ঞেস করো: এটা কি রোজকার, নাকি এখনকার? উত্তরটাই কাল ঠিক করে দেয়।",
      },
      watch: [
        { en: "I eat rice. / I am eating rice.", bn: "খাই / খাচ্ছি" },
        { en: "She works. / She is working now.", bn: "কাজ করে / করছে" },
        { en: "It rains in June. / It is raining.", bn: "হয় / হচ্ছে" },
        { en: "We speak Bangla. / We are speaking English.", bn: "বলি / বলছি" },
        { en: "Are you listening?", bn: "তুমি কি শুনছো?" },
      ],
      say: [
        { q: "আমি রোজ সকালে হাঁটি।", a: "I walk every morning." },
        { q: "আমি এখন হাঁটছি।", a: "I am walking now." },
        { q: "সে দোকানে কাজ করে।", a: "She works in a shop." },
        { q: "সে এখন কাজ করছে।", a: "She is working now." },
        { q: "তুমি কি এখন পড়ছো?", a: "Are you studying now?" },
        { q: "আমরা রোজ ইংরেজি পড়ি।", a: "We study English every day." },
      ],
      heart: {
        en: "Write 2 habit sentences and 2 'right now' sentences.",
        bn: "দুটো অভ্যাসের বাক্য আর দুটো 'এখন'-এর বাক্য লেখো।",
      },
    },
    {
      n: 17,
      en: "I was · She was · They were",
      bn: "ছিলাম, ছিল",
      pattern: {
        shape: "I / He / She / It → WAS        You / We / They → WERE",
        why: "am আর is অতীতে গিয়ে was, are গিয়ে were। নতুন কিছু নয়।",
        examples: "I was tired last night. · We were at my aunt's house.",
        tip: "এটা am/is/are-এরই কালকের পোশাক। দুটো শব্দ, ব্যস।",
      },
      watch: [
        { en: "I was tired last night.", bn: "কাল রাতে আমি ক্লান্ত ছিলাম।" },
        { en: "She was very kind.", bn: "সে খুব ভালো ছিল।" },
        { en: "It was a good day.", bn: "দিনটা ভালো ছিল।" },
        { en: "We were at my aunt's house.", bn: "আমরা খালার বাসায় ছিলাম।" },
        { en: "They were happy.", bn: "তারা খুশি ছিল।" },
      ],
      say: [
        { q: "আমি কাল অসুস্থ ছিলাম।", a: "I was sick yesterday." },
        { q: "সে বাসায় ছিল।", a: "He was at home." },
        { q: "আমরা স্কুলে ছিলাম।", a: "We were at school." },
        { q: "দিনটা কঠিন ছিল।", a: "The day was difficult." },
        { q: "তুমি ঠিক ছিলে।", a: "You were right." },
        { q: "তারা ভয় পেয়েছিল।", a: "They were afraid." },
      ],
      heart: {
        en: "Write 3 sentences about how you felt yesterday.",
        bn: "কাল তোমার কেমন লেগেছিল, তিনটা বাক্য লেখো।",
      },
    },
    {
      n: 18,
      en: "wasn't · weren't · Were you…?",
      bn: "ছিলাম না, ছিলে কি?",
      pattern: {
        shape: "He wasn't here.        WERE you there?",
        why: "না বলতে was বা were-এর পরে not। প্রশ্ন করতে সেটাকে সামনে নাও।",
        examples: "I wasn't ready. · Were you there? · Why were you late?",
        tip: "চতুর্থ দিনের সেই একই কৌশল, শুধু অতীতে। প্রথম দুই শব্দ উল্টে দাও।",
      },
      watch: [
        { en: "I wasn't ready.", bn: "আমি প্রস্তুত ছিলাম না।" },
        { en: "He wasn't at home.", bn: "সে বাসায় ছিল না।" },
        { en: "They weren't angry.", bn: "তারা রাগ করেনি।" },
        { en: "Were you there?", bn: "তুমি কি ওখানে ছিলে?" },
        { en: "Why were you late?", bn: "তুমি দেরি করলে কেন?" },
      ],
      say: [
        { q: "আমি ভয় পাইনি।", a: "I wasn't afraid." },
        { q: "সে ওখানে ছিল না।", a: "She wasn't there." },
        { q: "আমরা প্রস্তুত ছিলাম না।", a: "We weren't ready." },
        { q: "তুমি কি কাল বাসায় ছিলে?", a: "Were you at home yesterday?" },
        { q: "এটা কি কঠিন ছিল?", a: "Was it difficult?" },
        { q: "তারা কি খুশি ছিল?", a: "Were they happy?" },
      ],
      heart: {
        en: "Write 3 sentences: what you were NOT yesterday.",
        bn: "কাল তুমি যা ছিলে না, তিনটা বাক্য লেখো।",
      },
    },
    {
      n: 19,
      en: "Regular past: VERB + ed",
      bn: "সাধারণ অতীত: -ed",
      pattern: {
        shape: "WHO + VERB + ed + ______",
        why: "বেশিরভাগ ক্রিয়ার শেষে শুধু -ed বসে, আর অতীত হয়ে যায়।",
        examples: "study → studied · try → tried · stop → stopped",
        tip: "y-এর আগে ব্যঞ্জন থাকলে ied। ছোট শব্দ এক ব্যঞ্জনে শেষ হলে সেটা দ্বিগুণ।",
      },
      watch: [
        { en: "I worked all day.", bn: "সারাদিন কাজ করেছি।" },
        { en: "She cooked fish.", bn: "সে মাছ রান্না করেছে।" },
        { en: "He helped me.", bn: "সে আমাকে সাহায্য করেছে।" },
        { en: "We watched a movie.", bn: "আমরা সিনেমা দেখেছি।" },
        { en: "I tried my best.", bn: "আমি চেষ্টা করেছিলাম।" },
      ],
      say: [
        { q: "আমি কাল ইংরেজি পড়েছি।", a: "I studied English yesterday." },
        { q: "সে দরজা খুলেছে।", a: "She opened the door." },
        { q: "আমরা অপেক্ষা করেছিলাম।", a: "We waited." },
        { q: "বৃষ্টি থেমে গেছে।", a: "The rain stopped." },
        { q: "আমি তোমাকে ফোন করেছিলাম।", a: "I called you." },
        { q: "সে আমাকে সাহায্য করেছিল।", a: "He helped me." },
      ],
      heart: {
        en: "Write 3 things you did yesterday (regular verbs).",
        bn: "কাল যা যা করেছো, তিনটা লেখো।",
      },
    },
    {
      n: 20,
      en: "The 20 rebels",
      bn: "যারা -ed নেয় না",
      pattern: {
        shape: "go → went · eat → ate · see → saw · take → took · come → came",
        why: "এই ক্রিয়াগুলো পুরো বদলে যায়, আর এগুলোই সবচেয়ে বেশি লাগে।",
        examples:
          "give → gave · make → made · say → said · tell → told · do → did · get → got · " +
          "buy → bought · think → thought · know → knew · find → found · speak → spoke · " +
          "write → wrote · read → read · sleep → slept · run → ran",
        tip: "লিস্ট মুখস্থ কোরো না। প্রতিটা দিয়ে নিজের জীবনের একটা সত্যি বাক্য বানাও।",
      },
      watch: [
        { en: "I went to the market.", bn: "আমি বাজারে গিয়েছিলাম।" },
        { en: "She said nothing.", bn: "সে কিছু বলেনি।" },
        { en: "We ate together.", bn: "আমরা একসাথে খেয়েছি।" },
        { en: "He bought a shirt.", bn: "সে একটা শার্ট কিনেছে।" },
        { en: "I slept early.", bn: "আমি তাড়াতাড়ি ঘুমিয়েছি।" },
      ],
      say: [
        { q: "আমি সকাল ৭টায় উঠেছি।", a: "I woke up at seven." },
        { q: "মা মাছ রান্না করেছিলেন।", a: "Mother cooked fish." },
        { q: "সে আমাকে একটা বই দিয়েছে।", a: "He gave me a book." },
        { q: "আমি তোমাকে দেখেছি।", a: "I saw you." },
        { q: "আমরা অনেক কথা বলেছি।", a: "We spoke a lot." },
        { q: "সে সত্যি বলেছে।", a: "She told the truth." },
      ],
      heart: {
        en: "Use 3 rebels in true sentences about your life.",
        bn: "তিনটা রেবেল দিয়ে নিজের জীবনের সত্যি বাক্য লেখো।",
      },
    },
    {
      n: 21,
      en: "didn't · Did you…?",
      bn: "করিনি, করেছিলে কি?",
      pattern: {
        shape: "I didn't GO.        DID you GO?",
        why: "did নিজেই অতীত বহন করে, তাই ক্রিয়া আবার সাধারণ রূপে ফিরে যায়।",
        examples: "I didn't go. · Did you see him? · Why did he leave?",
        tip: "\"Did you went?\" ভুল। এক বাক্যে অতীত একবারই, দুবার নয়।",
      },
      watch: [
        { en: "I didn't go.", bn: "আমি যাইনি।" },
        { en: "She didn't eat.", bn: "সে খায়নি।" },
        { en: "Did you see him?", bn: "তুমি কি তাকে দেখেছো?" },
        { en: "Did she call you?", bn: "সে কি ফোন করেছিল?" },
        { en: "Why did he leave?", bn: "সে চলে গেল কেন?" },
      ],
      say: [
        { q: "আমি কাল পড়িনি।", a: "I didn't study yesterday." },
        { q: "সে কিছু বলেনি।", a: "He didn't say anything." },
        { q: "আমরা যাইনি।", a: "We didn't go." },
        { q: "তুমি কি কাল আমাকে ফোন করেছিলে?", a: "Did you call me yesterday?" },
        { q: "সে কি খেয়েছে?", a: "Did she eat?" },
        { q: "তুমি কী করেছিলে?", a: "What did you do?" },
      ],
      heart: {
        en: "Write 3 things you did NOT do yesterday.",
        bn: "কাল যা করোনি, তিনটা লেখো।",
      },
    },
    {
      n: 22,
      en: "will + VERB",
      bn: "করবো, হবে",
      pattern: {
        shape: "WHO + will + VERB (plain)",
        why: "সিদ্ধান্ত, প্রতিশ্রুতি আর অনুমান, তিনটাই will দিয়ে।",
        examples: "I will call you tonight. · She will come tomorrow.",
        tip: "will-এর শেষে কখনো -s বসে না, আর পরে কখনো 'to' বসে না।",
      },
      watch: [
        { en: "I will call you tonight.", bn: "আজ রাতে ফোন করবো।" },
        { en: "She will come tomorrow.", bn: "সে কাল আসবে।" },
        { en: "I'll help you.", bn: "আমি সাহায্য করবো।" },
        { en: "It will rain, I think.", bn: "মনে হয় বৃষ্টি হবে।" },
        { en: "I will never give up.", bn: "আমি কখনো হাল ছাড়বো না।" },
      ],
      say: [
        { q: "কাল আমি সকালে উঠবো।", a: "I will wake up early tomorrow." },
        { q: "আমি এক ঘণ্টা পড়বো।", a: "I will study for one hour." },
        { q: "সে তোমাকে সাহায্য করবে।", a: "He will help you." },
        { q: "আমরা ঠিক থাকবো।", a: "We will be fine." },
        { q: "আমি একদিন ভালো ইংরেজি বলবো।", a: "One day I will speak English well." },
        { q: "আমি ভুলবো না।", a: "I won't forget." },
      ],
      heart: {
        en: "Write 3 promises to yourself.",
        bn: "নিজেকে দেওয়া তিনটা প্রতিশ্রুতি লেখো।",
      },
    },
    {
      n: 23,
      en: "won't · Will you…?",
      bn: "করবো না, করবে কি?",
      pattern: {
        shape: "I won't ______        WILL you ______ ?",
        why: "will not মুখে এসে হয় won't। প্রশ্নে will সামনে চলে আসে।",
        examples: "I won't be late. · Will you help me? · When will you come?",
        tip: "\"Will you…?\" শুধু প্রশ্ন নয়, ভদ্র অনুরোধও। রোজ কাজে লাগবে।",
      },
      watch: [
        { en: "I won't be late.", bn: "আমি দেরি করবো না।" },
        { en: "She won't come today.", bn: "সে আজ আসবে না।" },
        { en: "Will you help me?", bn: "তুমি কি সাহায্য করবে?" },
        { en: "When will you come?", bn: "তুমি কখন আসবে?" },
        { en: "What will happen?", bn: "কী হবে?" },
      ],
      say: [
        { q: "আমি হাল ছাড়বো না।", a: "I won't give up." },
        { q: "সে কাল আসবে না।", a: "He won't come tomorrow." },
        { q: "তুমি কি কাল স্কুলে যাবে?", a: "Will you go to school tomorrow?" },
        { q: "এটা কি যথেষ্ট হবে?", a: "Will it be enough?" },
        { q: "আমরা কখন খাবো?", a: "When will we eat?" },
        { q: "তুমি কি আমাকে ভুলে যাবে?", a: "Will you forget me?" },
      ],
      heart: {
        en: "Write 3 things you will NOT do again.",
        bn: "যা আর কখনো করবে না, তিনটা লেখো।",
      },
    },
    {
      n: 24,
      en: "going to (a plan already made)",
      bn: "করতে যাচ্ছি",
      pattern: {
        shape: "I am / She is + going to + VERB",
        why: "আগেই ঠিক করা পরিকল্পনা হলে going to।",
        examples: "I am going to study tonight. · We are going to move house.",
        tip: "বলতে বলতে ঠিক করলে will, আগে থেকে ঠিক থাকলে going to। গুলিয়ে ফেললেও কেউ ভুল বুঝবে না।",
      },
      watch: [
        { en: "I am going to study tonight.", bn: "আজ রাতে পড়বো।" },
        { en: "She is going to get married.", bn: "তার বিয়ে হতে যাচ্ছে।" },
        { en: "We are going to move house.", bn: "আমরা বাসা বদলাবো।" },
        { en: "It is going to rain.", bn: "বৃষ্টি হবে।" },
        { en: "I'm going to try again.", bn: "আমি আবার চেষ্টা করবো।" },
      ],
      say: [
        { q: "আমি বাজারে যেতে যাচ্ছি।", a: "I am going to go to the market." },
        { q: "সে ডাক্তার দেখাতে যাচ্ছে।", a: "She is going to see a doctor." },
        { q: "আমরা কাল দেখা করবো।", a: "We are going to meet tomorrow." },
        { q: "তুমি কি খাবে?", a: "Are you going to eat?" },
        { q: "আমি ইংরেজি শিখতে যাচ্ছি।", a: "I am going to learn English." },
        { q: "সে আসবে না।", a: "She isn't going to come." },
      ],
      heart: {
        en: "Write 3 real plans for this week.",
        bn: "এই সপ্তাহের তিনটা সত্যিকারের পরিকল্পনা লেখো।",
      },
    },
    {
      n: 25,
      en: "can · can't",
      bn: "পারি, পারি না",
      pattern: {
        shape: "WHO + can / can't + VERB (plain)",
        why: "can মানে পারা, আর তার পরে ক্রিয়া সবসময় সাধারণ।",
        examples: "I can speak a little English. · She can't come today.",
        tip: "\"She cans\" নয়, \"He can to swim\" নয়। can-এর পরে কখনো 'to' বসে না।",
      },
      watch: [
        { en: "I can speak a little English.", bn: "আমি একটু ইংরেজি বলতে পারি।" },
        { en: "She can't come today.", bn: "সে আজ আসতে পারবে না।" },
        { en: "Can you help me, please?", bn: "একটু সাহায্য করবেন?" },
        { en: "Can I ask you something?", bn: "একটা কথা জিজ্ঞেস করতে পারি?" },
        { en: "You can do this.", bn: "তুমি এটা পারবে।" },
      ],
      say: [
        { q: "আমি সাঁতার কাটতে পারি না।", a: "I can't swim." },
        { q: "সে রান্না করতে পারে।", a: "She can cook." },
        { q: "আমি তোমাকে শুনতে পাচ্ছি না।", a: "I can't hear you." },
        { q: "তুমি কি আস্তে বলতে পারবে?", a: "Can you speak slowly?" },
        { q: "আমি কি ভিতরে আসতে পারি?", a: "Can I come in?" },
        { q: "আমি এটা পারবো।", a: "I can do this." },
      ],
      heart: {
        en: "Write 3 things you can do, and 1 you can't do yet.",
        bn: "যা পারো তিনটা, আর যা এখনো পারো না, একটা।",
      },
    },
    {
      n: 26,
      en: "want to · need to · have to",
      bn: "চাই, দরকার, করতেই হবে",
      pattern: {
        shape: "WHO + want / need / have + TO + VERB",
        why: "তিনটার পরেই TO, আর তারপর সাধারণ ক্রিয়া। একটা কাঠামো, অসংখ্য বাক্য।",
        examples: "I want to learn English. · I need to rest. · I have to go now.",
        tip: "-s শুধু প্রথম শব্দে বসে: He wants to go, He want to goes নয়।",
      },
      watch: [
        { en: "I want to learn English.", bn: "আমি ইংরেজি শিখতে চাই।" },
        { en: "I need to rest.", bn: "আমার বিশ্রাম দরকার।" },
        { en: "I have to go now.", bn: "আমাকে এখন যেতেই হবে।" },
        { en: "She needs to see a doctor.", bn: "তার ডাক্তার দেখানো দরকার।" },
        { en: "He has to work tomorrow.", bn: "তাকে কাল কাজ করতে হবে।" },
      ],
      say: [
        { q: "আমি ঘুমাতে চাই।", a: "I want to sleep." },
        { q: "আমার চাল কিনতে হবে।", a: "I need to buy rice." },
        { q: "আমাকে পড়তেই হবে।", a: "I have to study." },
        { q: "সে বাড়ি যেতে চায়।", a: "She wants to go home." },
        { q: "আমাদের তাড়াতাড়ি করতে হবে।", a: "We need to hurry." },
        { q: "তোমাকে চেষ্টা করতেই হবে।", a: "You have to try." },
      ],
      heart: {
        en: "Write 1 thing you want to do, 1 you need to, 1 you have to.",
        bn: "একটা 'চাই', একটা 'দরকার', একটা 'করতেই হবে' লেখো।",
      },
    },
    {
      n: 27,
      en: "Polite English",
      bn: "ভদ্র ভাষা",
      pattern: {
        shape: "Could you…? · May I…? · You should… · I think…",
        why: "এই কয়েকটা বাক্যই যেকোনো মানুষের সাথে কথা বলার দরজা খুলে দেয়।",
        examples: "Could you help me, please? · May I come in? · You should rest.",
        tip: "\"Sorry, I didn't understand. Could you repeat, please?\" এই একটা বাক্য মুখস্থ রাখো। না বুঝলে চুপ থেকো না।",
      },
      watch: [
        { en: "Could you help me, please?", bn: "একটু সাহায্য করবেন?" },
        { en: "May I come in?", bn: "আসতে পারি?" },
        { en: "Sorry, I didn't understand.", bn: "দুঃখিত, বুঝিনি।" },
        { en: "You should rest.", bn: "তোমার বিশ্রাম নেওয়া উচিত।" },
        { en: "I think you are right.", bn: "আমার মনে হয় তুমি ঠিক।" },
      ],
      say: [
        { q: "আরেকবার বলবেন?", a: "Could you repeat that, please?" },
        { q: "একটু আস্তে বলবেন?", a: "Could you speak slowly, please?" },
        { q: "মাফ করবেন, টয়লেট কোথায়?", a: "Excuse me, where is the toilet?" },
        { q: "তোমার ডাক্তার দেখানো উচিত।", a: "You should see a doctor." },
        { q: "চিন্তা করা উচিত নয়।", a: "You shouldn't worry." },
        { q: "অনেক ধন্যবাদ।", a: "Thank you so much." },
      ],
      heart: {
        en: "Write 3 polite sentences you will use this week.",
        bn: "এই সপ্তাহে ব্যবহার করবে, এমন তিনটা ভদ্র বাক্য লেখো।",
      },
    },
    {
      n: 28,
      en: "What · Where · When · Who · Why · How",
      bn: "প্রশ্নের ছয় চাবি",
      pattern: {
        shape: "Q-WORD + HELPER + WHO + VERB ?",
        why: "কী বা কোথায়, তারপর is/do/did/will/can, তারপর কে, তারপর ক্রিয়া।",
        examples: "Where do you live? · What is she doing? · Why did he leave?",
        tip: "'কে' নিজেই কর্তা হলে helper লাগে না: \"Who wants tea?\"",
      },
      watch: [
        { en: "What is your name?", bn: "তোমার নাম কী?" },
        { en: "Where do you live?", bn: "তুমি কোথায় থাকো?" },
        { en: "When does it start?", bn: "এটা কখন শুরু হয়?" },
        { en: "Why are you sad?", bn: "তুমি মন খারাপ কেন?" },
        { en: "How can I help you?", bn: "আমি কীভাবে সাহায্য করবো?" },
      ],
      say: [
        { q: "তুমি কী করছো?", a: "What are you doing?" },
        { q: "সে কোথায় থাকে?", a: "Where does she live?" },
        { q: "ক্লাস কখন শুরু হয়?", a: "When does the class start?" },
        { q: "ওই লোকটা কে?", a: "Who is that man?" },
        { q: "তুমি কেন কাঁদছো?", a: "Why are you crying?" },
        { q: "সে কাল কী বলেছিল?", a: "What did he say yesterday?" },
      ],
      heart: {
        en: "Write 5 questions. Then ask a real person today.",
        bn: "পাঁচটা প্রশ্ন লেখো। আজই একজনকে জিজ্ঞেস করো।",
      },
    },
    {
      n: 29,
      en: "How much · How many · How long · How far",
      bn: "কত? কয়টা? কতক্ষণ?",
      pattern: {
        shape: "How much (দাম) · How many (সংখ্যা) · How long (সময়) · How far (দূরত্ব)",
        why: "গোনা যায় এমন জিনিসে how many, গোনা যায় না এমন জিনিসে how much।",
        examples: "How much rice? · How many eggs? · How long does it take?",
        tip: "চাল গোনা যায় না, তাই how much rice। ডিম গোনা যায়, তাই how many eggs।",
      },
      watch: [
        { en: "How much is this?", bn: "এটার দাম কত?" },
        { en: "How many brothers do you have?", bn: "তোমার কয় ভাই?" },
        { en: "How long does it take?", bn: "কতক্ষণ লাগে?" },
        { en: "How far is the school?", bn: "স্কুল কত দূর?" },
        { en: "Which one do you want?", bn: "তুমি কোনটা চাও?" },
      ],
      say: [
        { q: "এটার দাম কত?", a: "How much is it?" },
        { q: "তোমার কয়টা বই আছে?", a: "How many books do you have?" },
        { q: "কতক্ষণ অপেক্ষা করতে হবে?", a: "How long do I have to wait?" },
        { q: "বাজার কত দূর?", a: "How far is the market?" },
        { q: "তুমি কয়টায় ঘুমাও?", a: "What time do you sleep?" },
        { q: "তুমি কোনটা পছন্দ করো?", a: "Which one do you like?" },
      ],
      heart: {
        en: "Write 5 questions you would ask in a shop.",
        bn: "দোকানে করবে, এমন পাঁচটা প্রশ্ন লেখো।",
      },
    },
    {
      n: 30,
      en: "Free speaking, from your heart",
      bn: "এবার নিজের কথা, নিজের ভাষায়",
      pattern: {
        shape: "I think ______ , because ______ . For example ______ . So ______ .",
        why: "মতামতের কাঠামো। এটা পারলে তুমি আর শিক্ষার্থী নও, বক্তা।",
        examples: "আজ সব একসাথে: বর্তমান, অতীত, ভবিষ্যৎ, প্রশ্ন আর অনুভূতি।",
        tip: "ত্রিশ দিন আগে এই পাতাটা তুমি ভরতে পারতে না। সেটাই আজকের সবচেয়ে বড় কথা।",
      },
      watch: [
        { en: "I think English is important, because it opens many doors.", bn: "কারণ এটা অনেক দরজা খুলে দেয়।" },
        { en: "For example, I can read and work.", bn: "যেমন, আমি পড়তে ও কাজ করতে পারি।" },
        { en: "So I study every day, even when it is hard.", bn: "তাই আমি রোজ পড়ি, কঠিন হলেও।" },
        { en: "Thirty days ago I could not say this.", bn: "ত্রিশ দিন আগে আমি এটা বলতে পারতাম না।" },
        { en: "I am not finished. I am just beginning.", bn: "আমি শেষ করিনি, সবে শুরু করেছি।" },
      ],
      say: [
        { q: "আমার মনে হয় ইংরেজি শেখা জরুরি।", a: "I think learning English is important." },
        { q: "আমি রোজ পড়ি, কারণ আমি ভালো করতে চাই।", a: "I study every day, because I want to do well." },
        { q: "কাল আমি ভুল করেছি, কিন্তু আমি থামিনি।", a: "Yesterday I made mistakes, but I didn't stop." },
        { q: "আমি একদিন সবার সাথে ইংরেজিতে কথা বলবো।", a: "One day I will speak English with everyone." },
        { q: "আমি আর ভয় পাই না।", a: "I am not afraid anymore." },
        { q: "এটা আমার শুরু, শেষ নয়।", a: "This is my beginning, not my end." },
      ],
      heart: {
        en: "Write your own story: yesterday, today, and tomorrow. 6+ sentences, then read it aloud.",
        bn: "নিজের গল্প লেখো: কাল, আজ, আগামীকাল। অন্তত ছয় বাক্য, তারপর জোরে পড়ো।",
      },
    },
  ],
};
