/* ============================================================
   english.ts: THE ONE COPY of the English school's ladder.
   Everything reads from it: the hub, the part routes, the
   practice book, the breadcrumb, the palette, the menu and the
   sitemap.

   `scripts/build-modules.ts` compiles it to
   `aab/english/curriculum.js`, which `sw.js` precaches by name.
   Edit this file, never that one.

   THE SHAPE: `TERMS[]`, three terms, a folder and a page each;
   `.sections[]`, segments and never pages; `.parts[]`, one page
   each. THE UNIT IS A PART, NOT A DAY: the days live in the
   practice book, and the map inside part 13 lines them up against
   these parts.

   A SLUG IS HALF OF A STORED PROGRESS ID and may never be
   renamed.
   ============================================================ */
/* ------------------------------------------------------------
   টার্ম ১: the beginner course. Thirteen parts, thirty days.
   ------------------------------------------------------------ */
const TERM_1_SECTIONS = [
    {
        id: "vitti",
        bn: "ভিত্তি",
        en: "The foundation",
        parts: [
            {
                slug: "word-order",
                n: 1,
                bn: "বাক্যের ইঞ্জিন: কে, কী করে, কী",
                en: "The Engine: word order",
                icon: "engine",
                minutes: 8,
                blurb: "বাংলায় ক্রিয়া বাক্যের শেষে বসে, ইংরেজিতে মাঝখানে। এই একটা অভ্যাস বদলালেই শুরুর অর্ধেক ভুল শেষ।",
            },
            {
                slug: "am-is-are",
                n: 2,
                bn: "am · is · are: যে শব্দটা বাংলায় লুকিয়ে থাকে",
                en: "Am · Is · Are",
                icon: "equals",
                minutes: 9,
                blurb: "'আমি ছাত্র' বলতে বাংলায় মাঝে কিছু লাগে না, ইংরেজিতে লাগে। বাংলাভাষীর সবচেয়ে বেশি করা ভুলটা এখানেই ঠিক হয়।",
            },
            {
                slug: "have-has",
                n: 3,
                bn: "have · has: আমার আছে",
                en: "Have · Has",
                icon: "hand",
                minutes: 8,
                blurb: "'আমার একটা বোন আছে' ইংরেজিতে উল্টো দিক থেকে বলা হয়: I have a sister. মালিকানা, অসুখ, সময়, সবই এক শব্দে।",
            },
        ],
    },
    {
        id: "kaj-o-kal",
        bn: "কাজ ও কাল",
        en: "Verbs and time",
        parts: [
            {
                slug: "verbs",
                n: 4,
                bn: "রোজকার ত্রিশটা ক্রিয়া, আর ছোট্ট -s",
                en: "Doing words",
                icon: "gears",
                minutes: 10,
                blurb: "ত্রিশটা ক্রিয়ায় দিনের নব্বই ভাগ কথা চলে। সাথে সেই টুপিটা: he, she, it হলে ক্রিয়ার শেষে একটা -s।",
            },
            {
                slug: "right-now",
                n: 5,
                bn: "এখন যা ঘটছে: am/is/are + -ing",
                en: "Right now",
                icon: "clock",
                minutes: 8,
                blurb: "এই কালটা বাংলাভাষীর জন্য উপহার, কারণ বাংলাও ঠিক একই কাজ করে: খাই আর খাচ্ছি।",
            },
            {
                slug: "yesterday",
                n: 6,
                bn: "কাল যা হয়েছে: was, -ed আর কুড়িটা রেবেল",
                en: "Yesterday",
                icon: "back",
                minutes: 11,
                blurb: "তোমার এতদিনের পুরো জীবন এই কালে বসে আছে। was/were, -ed, কুড়িটা অনিয়মী ক্রিয়া, আর did-এর জাদু।",
            },
            {
                slug: "tomorrow",
                n: 7,
                bn: "যা হবে: will আর going to",
                en: "Tomorrow",
                icon: "forward",
                minutes: 8,
                blurb: "will মানে এইমাত্র ঠিক করলাম বা কথা দিচ্ছি। going to মানে আগেই ঠিক করা ছিল। দুটোই সহজ।",
            },
        ],
    },
    {
        id: "hatiar",
        bn: "হাতিয়ার",
        en: "The tools",
        parts: [
            {
                slug: "helpers",
                n: 8,
                bn: "শক্তির সাহায্যকারী: can, want to, have to, should",
                en: "The power helpers",
                icon: "key",
                minutes: 9,
                blurb: "ছোট শব্দ, বিরাট শক্তি। এদের পরে ক্রিয়া সবসময় সাধারণ থাকে, আর ভদ্র বাক্যগুলো দরজা খুলে দেয়।",
            },
            {
                slug: "questions",
                n: 9,
                bn: "প্রশ্নের ছয়টা চাবি আর প্রশ্ন-মেশিন",
                en: "The question words",
                icon: "question",
                minutes: 8,
                blurb: "যে মানুষ প্রশ্ন করতে পারে, সে যেকোনো জায়গায় যেকোনো কিছু শিখে নিতে পারে। চারটা খোপ ভরলেই যেকোনো প্রশ্ন তৈরি।",
            },
            {
                slug: "glue",
                n: 10,
                bn: "আঠা-শব্দ: in · on · at আর a · an · the",
                en: "The glue words",
                icon: "glue",
                minutes: 9,
                blurb: "বাংলায় এগুলো নেই বলেই কঠিন লাগে। ছবি দিয়ে মনে রাখো, নিয়ম দিয়ে নয়, আর দ্বিধা হলেও থেমো না।",
            },
        ],
    },
    {
        id: "rojkar-jibon",
        bn: "রোজকার জীবন",
        en: "Real life",
        parts: [
            {
                slug: "sentence-bank",
                n: 11,
                bn: "বাক্যভাণ্ডার: ঘর, বাজার, ডাক্তার, ফোন, পথ, মানুষ",
                en: "The sentence bank",
                icon: "basket",
                minutes: 12,
                blurb: "এই সপ্তাহে যে বাক্যগুলো সত্যিই লাগবে, ছয় জায়গার জন্য বাছা। মুখস্থ নয়, ব্যবহার করার জন্য।",
            },
            {
                slug: "from-the-heart",
                n: 12,
                bn: "নিজের কথা: বর্ণনা, দিনের গল্প, মতামত",
                en: "Speak from the heart",
                icon: "heart",
                minutes: 10,
                blurb: "এবার নকল বন্ধ, নিজে বানানো শুরু। পাঁচ প্রশ্নে একটা অনুচ্ছেদ, আর রাতে নিজের দিনটা জোরে বলা।",
            },
            {
                slug: "the-plan",
                n: 13,
                bn: "রোজকার এক ঘণ্টা, ত্রিশ দিনের মানচিত্র, সাত ভুল",
                en: "The plan",
                icon: "map",
                minutes: 9,
                blurb: "দিনে এক ঘণ্টা কীভাবে ভাগ করবে, ত্রিশ দিনে কোথায় পৌঁছাবে, আর যে সাতটা ভুল সবাই করে।",
            },
        ],
    },
];
/* ------------------------------------------------------------
   টার্ম ২: the intermediate course. Seventeen parts, ninety days.
   ------------------------------------------------------------ */
const TERM_2_SECTIONS = [
    {
        id: "vab-jora",
        bn: "ভাব জোড়া",
        en: "Joining ideas",
        parts: [
            {
                slug: "joining",
                n: 1,
                bn: "ভাব জোড়া: and থেকে although",
                en: "Joining ideas",
                icon: "link",
                minutes: 10,
                blurb: "ছোট বাক্য ভুল নয়, শুধু ছোট। জোড়া দিতে শিখলে তিন বাক্যের কথা এক বাক্যে বলা যায়, আর বক্তা বড় হয়ে যায়।",
            },
            {
                slug: "present-perfect",
                n: 2,
                bn: "সেতু-কাল: have done",
                en: "The bridge tense",
                icon: "bridge",
                minutes: 11,
                blurb: "যে অতীত এখনো ফুরায়নি। বাংলায় আলাদা রূপ নেই বলেই এটা সবচেয়ে বেশি এড়িয়ে যাওয়া কাল, আর সবচেয়ে বেশি কাজে লাগে।",
            },
            {
                slug: "time-layers",
                n: 3,
                bn: "সময়ের ভিতরে সময়: had done, used to",
                en: "Time inside time",
                icon: "layers",
                minutes: 10,
                blurb: "অতীতের আগের অতীত, কতক্ষণ ধরে চলছিল, আর আগে যা করতাম কিন্তু এখন করি না।",
            },
            {
                slug: "twelve-boxes",
                n: 4,
                bn: "বারোটা ঘর: এক ক্রিয়া, গোটা সময়",
                en: "The whole map",
                icon: "grid",
                minutes: 9,
                blurb: "তিন কাল, চার রূপ। এক পাতায় পুরো মানচিত্র, আর একই সন্ধ্যার গল্প বারো রকমে বলা।",
            },
        ],
    },
    {
        id: "kolpona",
        bn: "কল্পনা, নিশ্চয়তা, দৃষ্টি",
        en: "Imagining and hedging",
        parts: [
            {
                slug: "if",
                n: 5,
                bn: "চার রকম if",
                en: "If",
                icon: "fork",
                minutes: 11,
                blurb: "সত্যি, সম্ভব, অবাস্তব আর আফসোস। if-এর দূরত্বটাই বলে দেয় তুমি কতটা সত্যি ভাবছ।",
            },
            {
                slug: "certainty",
                n: 6,
                bn: "নিশ্চয়তার সিঁড়ি আর আফসোসের ব্যাকরণ",
                en: "Certainty and regret",
                icon: "gauge",
                minutes: 10,
                blurb: "must থেকে might থেকে can't: কতটা নিশ্চিত, সেটা একটা শব্দেই বলা যায়। আর পিছন ফিরে: should have।",
            },
            {
                slug: "passive",
                n: 7,
                bn: "কর্তা হারিয়ে গেলে: passive",
                en: "When the doer vanishes",
                icon: "flip",
                minutes: 10,
                blurb: "কে করল তা জানা নেই, বা জরুরি নয়। খবর, নিয়ম আর অফিসের ভাষা এখানেই থাকে।",
            },
            {
                slug: "reported",
                n: 8,
                bn: "কথা বহন করা: he said that…",
                en: "Carrying words",
                icon: "quote",
                minutes: 10,
                blurb: "অন্যের কথা নিজের মুখে আনা। কাল এক ধাপ পিছিয়ে যায়, আর say আর tell গুলিয়ে ফেলা বন্ধ হয়।",
            },
        ],
    },
    {
        id: "bakko-vitore",
        bn: "বাক্যের ভিতরে বাক্য",
        en: "Sentences inside sentences",
        parts: [
            {
                slug: "relatives",
                n: 9,
                bn: "who · which · that: এক বাক্যের ভিতরে আরেকটা",
                en: "Relative clauses",
                icon: "nest",
                minutes: 10,
                blurb: "দুটো বাক্য বলে থেমে যাওয়ার বদলে একটাকে অন্যটার ভিতরে বসানো। দুটো কমা পুরো মানে বদলে দেয়।",
            },
            {
                slug: "ing-or-to",
                n: 10,
                bn: "-ing নাকি to?",
                en: "-ing or to?",
                icon: "branch",
                minutes: 9,
                blurb: "কিছু ক্রিয়া -ing চায়, কিছু চায় to। হিসাব করে নয়, কানে শুনে ঠিক করার জিনিস।",
            },
            {
                slug: "phrasal-verbs",
                n: 11,
                bn: "রোজ শোনা ত্রিশটা phrasal verb",
                en: "Phrasal verbs",
                icon: "puzzle",
                minutes: 10,
                blurb: "give up, find out, look after: বইয়ের ইংরেজি আর মানুষের ইংরেজির মাঝের দূরত্বটা এখানেই।",
            },
            {
                slug: "collocation",
                n: 12,
                bn: "যে শব্দগুলো একসাথে থাকে",
                en: "Words that live together",
                icon: "pair",
                minutes: 9,
                blurb: "'do a mistake' ব্যাকরণে ভুল নয়, তবু কানে লাগে। জোড়াগুলো শিখলে ইংরেজি হঠাৎ স্বাভাবিক শোনায়।",
            },
        ],
    },
    {
        id: "sur-o-dorgho",
        bn: "সুর, দৈর্ঘ্য আর শব্দ",
        en: "Tone, length and sound",
        parts: [
            {
                slug: "register",
                n: 13,
                bn: "এক কথা, তিন সুর",
                en: "Tone and distance",
                icon: "tone",
                minutes: 9,
                blurb: "বন্ধু, অফিস, দরখাস্ত: একই কথা তিন রকম দূরত্বে। আর শিক্ষিত মানুষ কীভাবে নরম করে দ্বিমত করে।",
            },
            {
                slug: "holding-the-floor",
                n: 14,
                bn: "দুই মিনিট ধরে বলা",
                en: "Holding the floor",
                icon: "mouth",
                minutes: 9,
                blurb: "উত্তর ছোট হয়ে যাওয়া মানে ভাষা কম নয়, কাঠামো কম। দুই মিনিটের একটা আকার আছে, আর ভাবার সময় বলার শব্দও আছে।",
            },
            {
                slug: "big-ideas",
                n: 15,
                bn: "বড় ভাবনা বলা: তর্ক, তুলনা, গল্প",
                en: "Speaking complex ideas",
                icon: "star",
                minutes: 11,
                blurb: "যুক্তি দেওয়া আর মেনে নেওয়া, তুলনা আর অনুমান, আর একটা গল্প যেভাবে শোনার মতো হয়।",
            },
            {
                slug: "sound",
                n: 16,
                bn: "স্ট্রেস আর ফ্লো: কেন ওদের ইংরেজি এত দ্রুত শোনায়",
                en: "Sound and flow",
                icon: "wave",
                minutes: 9,
                blurb: "জোর কোথায় পড়ে সেটাই মানে বদলে দেয়। আর শব্দগুলো জোড়া লেগে যায় বলেই দ্রুত শোনায়, দ্রুত বলা হয় বলে নয়।",
            },
            {
                slug: "ninety-days",
                n: 17,
                bn: "নব্বই দিনের পরিকল্পনা আর সাতটা দেয়াল",
                en: "The 90-day plan",
                icon: "map",
                minutes: 10,
                blurb: "তিন পর্বে নব্বই দিন, কী শুনবে আর কী পড়বে, খাতা কীভাবে রাখবে, আর যে সাত জায়গায় সবাই আটকায়।",
            },
        ],
    },
];
/* ------------------------------------------------------------
   টার্ম ৩: the grammar course. Twenty-five parts in three rungs,
   basic, intermediate and advanced, and a thirty-day book of its
   own. The prose and the blocks are in `scripts/english/term-3/`,
   one file per part, seeded by `scripts/seed-english.ts`; the
   book is `next/lib/workbooks/english-term-3.ts`. Each part takes
   its topic end to end, so `minutes` runs to twenty-odd and a
   part carries a dozen blocks of several kinds rather than five.

   The intermediate and advanced sections EXPAND the basic ones
   rather than starting again: the tense machine of part 7 is
   what the perfect tenses of part 11 are bolted on to, and the
   sentence kinds of part 10 are what the exam room of part 24
   transforms. A part's `n` is the number the pages print.
   ------------------------------------------------------------ */
const TERM_3_SECTIONS = [
    {
        id: "basic",
        bn: "বেসিক: খেলার নিয়ম",
        en: "Basic: the rules of the game",
        parts: [
            {
                slug: "players",
                n: 1,
                bn: "আটজন খেলোয়াড়: parts of speech",
                en: "The eight players",
                icon: "pair",
                minutes: 25,
                blurb: "একটা দলে ব্যাটার, বোলার, কিপার। ইংরেজি বাক্যেও আটটা পজিশন, আর প্রত্যেকের কাজ আলাদা। আজ পুরো দলটা চিনে নাও।",
            },
            {
                slug: "nouns",
                n: 2,
                bn: "নাম-শব্দ: noun, একটা না অনেক",
                en: "Nouns: one or many",
                icon: "basket",
                minutes: 27,
                blurb: "cat থেকে cats সহজ, child থেকে children নয়, আর water কখনো waters হয় না। গোনা যায় কি যায় না, সেটাই আসল প্রশ্ন।",
            },
            {
                slug: "pronouns",
                n: 3,
                bn: "বদলি খেলোয়াড়: pronoun",
                en: "Pronouns: the substitutes",
                icon: "hand",
                minutes: 23,
                blurb: "একই নাম বারবার না বলে মাঠে বদলি নামাও: he, she, it, they। কিন্তু I আর me, they আর them এক নয়, আর সেটাই সবাই গুলিয়ে ফেলে।",
            },
            {
                slug: "articles",
                n: 4,
                bn: "a, an, the: তিনটা ছোট শব্দের বড় কাজ",
                en: "Articles",
                icon: "glue",
                minutes: 23,
                blurb: "বাংলায় এদের কোনো ভাই নেই, তাই বাংলাভাষীর কানে এরা ধরা পড়ে না। কখন কোনটা, আর কখন কিছুই না: তিনটা প্রশ্নে পুরো নিয়ম।",
            },
            {
                slug: "adjectives",
                n: 5,
                bn: "রং লাগানো: adjective আর তুলনা",
                en: "Adjectives and comparison",
                icon: "star",
                minutes: 23,
                blurb: "big, bigger, biggest; good, better, best। কোন শব্দে -er বসে আর কোনটায় more, তার একটা সহজ কান-নিয়ম আছে।",
            },
            {
                slug: "agreement",
                n: 6,
                bn: "কর্তা আর ক্রিয়ার মিল: -s এর নিয়ম",
                en: "Subject and verb agree",
                icon: "equals",
                minutes: 20,
                blurb: "She play cricket, নাকি She plays? একজন হলে ক্রিয়ায় একটা টুপি। পরীক্ষায় সবচেয়ে বেশি নম্বর কাটা যায় এই এক অক্ষরে।",
            },
            {
                slug: "tenses",
                n: 7,
                bn: "টাইম মেশিন: তিন কাল, চার রূপ",
                en: "The tense machine",
                icon: "clock",
                minutes: 26,
                blurb: "কাল, আজ, আগামীকাল; আর প্রতিটার চার রকম রূপ। বারোটা ঘরের মানচিত্রটা একবার মাথায় বসলে tense আর ভয় লাগে না।",
            },
            {
                slug: "adverbs",
                n: 8,
                bn: "কীভাবে, কখন, কোথায়: adverb",
                en: "Adverbs",
                icon: "wave",
                minutes: 23,
                blurb: "Mustafiz bowls fast: fast শব্দটা বোলিংকে বর্ণনা করছে, বোলারকে নয়। -ly লাগে কোথায়, always বসে কোথায়, আজ সেটা।",
            },
            {
                slug: "prepositions",
                n: 9,
                bn: "in, on, at, under: জায়গা আর সময়ের ছোট শব্দ",
                en: "Prepositions",
                icon: "map",
                minutes: 27,
                blurb: "বাংলায় একটা 'এ' দিয়ে যা হয়, ইংরেজিতে তিনটা শব্দে ভাগ করা: in the box, on the box, at the box। ছবি দিয়ে মনে রাখো।",
            },
            {
                slug: "sentences",
                n: 10,
                bn: "বাক্যের চার রকম, আর বড় হাতের অক্ষর",
                en: "Kinds of sentence",
                icon: "engine",
                minutes: 26,
                blurb: "বলা, জিজ্ঞেস করা, আদেশ করা, চমকে ওঠা। প্রতিটার শুরু আর শেষ আলাদা, আর একটা কমা কোথায় বসল তাতে মানে বদলে যায়।",
            },
        ],
    },
    {
        id: "middle",
        bn: "মাঝারি: খেলা গড়া",
        en: "Intermediate: building the game",
        parts: [
            {
                slug: "perfect",
                n: 11,
                bn: "have + V3: সেতু-কাল আর অতীতের আগের অতীত",
                en: "The perfect tenses",
                icon: "bridge",
                minutes: 23,
                blurb: "I have eaten, I had eaten, I will have eaten: একই ক্রিয়ার তিন রূপ, আর প্রতিটা একটা সেতু। পরীক্ষার right form-এর অর্ধেক এখানে।",
            },
            {
                slug: "modals",
                n: 12,
                bn: "can, must, should: শক্তির শব্দ",
                en: "Modal verbs",
                icon: "key",
                minutes: 25,
                blurb: "পারা, লাগা, উচিত, হতে পারে। এদের পরে ক্রিয়া কখনো বদলায় না, আর একটা শব্দ বদলালেই ভদ্রতা থেকে হুকুম।",
            },
            {
                slug: "questions",
                n: 13,
                bn: "প্রশ্ন বানানোর মেশিন, আর tag question",
                en: "Questions and tags",
                icon: "question",
                minutes: 25,
                blurb: "do/does/did কোথায় বসে, wh-শব্দ কোথায়, আর বাক্যের শেষে সেই ছোট্ট লেজ: isn't it? পরীক্ষায় প্রতি বছর আসে, জীবনে রোজ।",
            },
            {
                slug: "joining",
                n: 14,
                bn: "and, but, because, although: বাক্য জোড়া",
                en: "Conjunctions and clauses",
                icon: "link",
                minutes: 25,
                blurb: "ছোট বাক্য ভুল নয়, শুধু ছোট। জোড়ার শব্দগুলো শিখলে তিন বাক্যের কথা এক বাক্যে বলা যায়, আর কমাটা কোথায় বসবে সেটাও।",
            },
            {
                slug: "passive",
                n: 15,
                bn: "কে করল জানা নেই: passive voice",
                en: "The passive",
                icon: "flip",
                minutes: 22,
                blurb: "The match was won. কে জিতল বলা নেই, তবু বাক্য পূর্ণ। be + V3 এর মেশিন, আর voice change-এর পরীক্ষার কৌশল।",
            },
            {
                slug: "reported",
                n: 16,
                bn: "সে বলল যে…: reported speech",
                en: "Reported speech",
                icon: "quote",
                minutes: 24,
                blurb: "অন্যের কথা নিজের মুখে। কাল এক ধাপ পিছিয়ে যায়, today হয়ে যায় that day, আর narration-এর নম্বর পুরোটা তোলা যায়।",
            },
            {
                slug: "conditionals",
                n: 17,
                bn: "if-এর চার সিঁড়ি",
                en: "Conditionals",
                icon: "fork",
                minutes: 22,
                blurb: "If it rains, if it rained, if it had rained: যত পিছনের কাল, তত কম সত্যি। চার সিঁড়ি চিনলে ইংরেজিতে কল্পনা করা যায়।",
            },
            {
                slug: "ing-to",
                n: 18,
                bn: "-ing নাকি to: gerund আর infinitive",
                en: "Gerund or infinitive",
                icon: "branch",
                minutes: 23,
                blurb: "enjoy playing কিন্তু want to play। কোন ক্রিয়ার পরে কোনটা বসে, তার একটা ছোট তালিকা আছে, আর বাকিটা কান।",
            },
        ],
    },
    {
        id: "advanced",
        bn: "উচ্চতর: ম্যাচ জেতা",
        en: "Advanced: winning the match",
        parts: [
            {
                slug: "relatives",
                n: 19,
                bn: "who, which, that: বাক্যের ভিতরে বাক্য",
                en: "Relative clauses",
                icon: "nest",
                minutes: 24,
                blurb: "The boy who scored the century: দুটো বাক্য একটার ভিতরে। কমা বসলে মানে বদলায়, আর that কখন বাদ দেওয়া যায় সেটাও।",
            },
            {
                slug: "determiners",
                n: 20,
                bn: "some, any, much, many, few: পরিমাণের শব্দ",
                en: "Determiners and quantity",
                icon: "layers",
                minutes: 23,
                blurb: "কতটুকু, কয়টা, কোনটা। some আর any-র ভিতরের নিয়ম, few আর a few-র বিরাট পার্থক্য, আর each আর every-র মাঝের সরু রেখা।",
            },
            {
                slug: "causatives",
                n: 21,
                bn: "make, let, have, get: অন্যকে দিয়ে করানো",
                en: "Causatives and verb patterns",
                icon: "hand",
                minutes: 22,
                blurb: "I had my phone repaired: নিজে সারাইনি, সারিয়ে নিয়েছি। কাউকে দিয়ে কিছু করানোর চারটা ক্রিয়া, আর প্রতিটার নিজের ছাঁচ।",
            },
            {
                slug: "emphasis",
                n: 22,
                bn: "জোর দেওয়ার ব্যাকরণ: inversion, cleft, so আর such",
                en: "Emphasis and inversion",
                icon: "tone",
                minutes: 23,
                blurb: "Never have I seen such a catch! সাধারণ কথাটাকে উল্টে দিলেই জোর। It was Shakib who…: বাক্য ভেঙে আলো ফেলা।",
            },
            {
                slug: "punctuation",
                n: 23,
                bn: "কমা, অ্যাপস্ট্রফি, সেমিকোলন: যতিচিহ্নের খেলা",
                en: "Punctuation",
                icon: "pen",
                minutes: 23,
                blurb: "Let's eat, Nanu আর Let's eat Nanu-র মাঝে একটা কমার দূরত্ব। its আর it's, কোলন আর সেমিকোলন: লেখায় নম্বর ওঠে এখানেই।",
            },
            {
                slug: "transformation",
                n: 24,
                bn: "পরীক্ষার হল: transformation, right form, narration",
                en: "The exam room",
                icon: "check",
                minutes: 24,
                blurb: "SSC আর HSC-র প্রশ্নপত্রে যে পাঁচটা ব্যাকরণের প্রশ্ন বছরের পর বছর আসে, তার প্রতিটার নিয়ম আর প্রতিটার ফাঁদ, একসাথে।",
            },
            {
                slug: "mistakes",
                n: 25,
                bn: "বাংলাভাষীর পঁচিশটা ফাঁদ, আর ত্রিশ দিনের মানচিত্র",
                en: "Twenty-five traps and the map",
                icon: "map",
                minutes: 22,
                blurb: "যে ভুলগুলো বাংলা থেকে ইংরেজিতে আসার পথে সবাই করে, একটা তালিকায়। আর খাতার ত্রিশ দিন কোন পর্বের সাথে মেলে, সেই মানচিত্র।",
            },
        ],
    },
];
/* ------------------------------------------------------------
   THE LADDER, three terms: thirteen parts, seventeen, then
   twenty-five. Term One carries the thirty-day book; Term Two
   carries NO book, which is a decision rather than a gap, and its
   `chorcha` line says what the daily practice is instead; Term
   Three carries a book of its own, thirty days again, because a
   grammar point is learnt by being used thirty times.
   ------------------------------------------------------------ */
export const TERMS = [
    {
        slug: "term-1",
        kicker: "টার্ম ১",
        bn: "শুরু থেকে",
        en: "Term One · From the beginning",
        icon: "seed",
        who: "যিনি ইংরেজি বোঝেন একটু, কিন্তু মুখ খুলতে পারেন না",
        blurb: "শব্দের ক্রম, am/is/are, have, তিন কাল, সাহায্যকারী শব্দ, প্রশ্ন আর রোজকার বাক্য। মুখস্থ নয়, কাঠামো।",
        can: "তেরোটা পর্ব শেষে: নিজের পরিচয়, পরিবার, রোজকার কাজ, কালকের গল্প আর আগামীকালের পরিকল্পনা ইংরেজিতে বলতে পারবেন, আর পাঁচ মিনিট কথা চালিয়ে নিতে পারবেন।",
        minutes: [45, 60],
        status: "live",
        workbook: { slug: "workbook", days: 30 },
        sections: TERM_1_SECTIONS,
    },
    {
        slug: "term-2",
        kicker: "টার্ম ২",
        bn: "ভাব বহন",
        en: "Term Two · Carrying ideas",
        icon: "ladder",
        who: "যিনি সহজ বাক্য বলতে পারেন, কিন্তু কথা ছোট হয়ে যায়",
        blurb: "জোড়া দেওয়া, perfect কাল, if, passive, reported speech, phrasal verb, সুর আর দুই মিনিট ধরে বলা।",
        can: "সতেরোটা পর্ব শেষে: দুই মিনিট একটানা বলতে পারবেন, যুক্তি দিয়ে দ্বিমত করতে পারবেন, আর অনুবাদ না করে সরাসরি ইংরেজিতে ভাবতে শুরু করবেন।",
        minutes: [60, 75],
        status: "live",
        chorcha: "এই টার্মে ভরাট করার খাতা নেই। রোজকার কাজ তিনটে: দুই মিনিট নিজেকে রেকর্ড করা, একটা সত্যিকারের লেখা জোরে পড়া, আর নতুন জোড়া-শব্দ নিজের খাতায় তোলা।",
        sections: TERM_2_SECTIONS,
    },
    {
        slug: "term-3",
        kicker: "টার্ম ৩",
        bn: "ইংরেজি ব্যাকরণ",
        en: "Term Three · English Grammar",
        icon: "gears",
        who: "স্কুল-কলেজের শিক্ষার্থী, আর যে কেউ যাঁর ইংরেজিটা চলে কিন্তু নিয়মটা জানা নেই",
        blurb: "শব্দের আট জাত থেকে passive, narration আর if পর্যন্ত: পুরো ব্যাকরণ তিন ধাপে, বেসিক থেকে উচ্চতর। প্রতিটা নিয়মের সাথে শোনার বোতাম, খেলা আর পরীক্ষার কৌশল।",
        can: "পঁচিশটা পর্ব শেষে: যেকোনো বাক্য দেখে বলতে পারবে কোন শব্দটা কী কাজ করছে, নিজের বাক্যের ভুল নিজে ধরতে পারবে, আর পরীক্ষার ব্যাকরণ অংশে আন্দাজে নয়, নিয়ম জেনে উত্তর দিতে পারবে।",
        /* A part is twenty-odd minutes of reading and games now, and
           the day's workbook page another fifteen, so the sitting is
           longer than it was when a part was five blocks. */
        minutes: [40, 60],
        status: "live",
        workbook: { slug: "workbook", days: 30 },
        sections: TERM_3_SECTIONS,
    },
];
/* ------------------------------------------------------------
   THE SCHOOL
   ------------------------------------------------------------ */
export const SCHOOL = {
    id: "english",
    mount: "/english/",
    bn: "মন থেকে ইংরেজি",
    en: "English From The Heart",
    tagline: "মুখস্থ নয়, কাঠামো। একটা ছাঁচ শিখুন, তারপর নিজের হাজারটা বাক্য বানান।",
};
/* ------------------------------------------------------------
   URLs, ids and sums. Nothing below assumes how many terms there
   are or that a term has a workbook.
   ------------------------------------------------------------ */
/** A term's ladder URL. */
export const termUrl = (term) => `/english/${term.slug}`;
/** A part's page URL. */
export const partUrl = (term, part) => `/english/${term.slug}/${part.slug}.html`;
/** Progress is stored per part under a stable id. */
export const partId = (term, part) => `${term.slug}/${part.slug}`;
/** And per workbook day, under one that cannot collide with it. */
export const dayId = (term, n) => `${term.slug}/day-${n}`;
/** The practice book's URL, or null for a term without one. */
export const workbookUrl = (term) => term?.workbook ? `/english/${term.slug}/${term.workbook.slug}` : null;
/** Bangla numerals, for a page that is Bangla throughout. */
export const bnNum = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
/** "পর্ব ৫", the label on a card and in a page's eyebrow. */
export const partLabel = (part) => `পর্ব ${bnNum(part.n)}`;
/** Parts of one term, flattened, in order. */
export const termParts = (term) => term.sections.flatMap((section) => section.parts.map((part) => ({
    ...part,
    term,
    section,
    id: partId(term, part),
    url: partUrl(term, part),
    label: partLabel(part),
    status: part.status ?? "live",
})));
/** Flat list of every part in the school. */
export const allParts = () => TERMS.flatMap(termParts);
/** How many parts a term has, and how many are written. */
export const termCount = (term) => {
    const parts = termParts(term);
    return { total: parts.length, live: parts.filter((p) => p.status === "live").length };
};
/** Total reading time of a term, in minutes. */
export const termMinutes = (term) => termParts(term).reduce((sum, p) => sum + (p.minutes ?? 0), 0);
/** Days of practice the school ships, counted from the terms
    that actually have a book rather than declared anywhere. */
export const totalDays = () => TERMS.reduce((n, t) => n + (t.workbook?.days ?? 0), 0);
/** Find a term by slug. */
export const findTerm = (slug) => TERMS.find((t) => t.slug === slug);
/** Find a part (and its term) from a URL path. */
export const findByPath = (path) => allParts().find((p) => p.url === path || p.url === `${path}.html`);
