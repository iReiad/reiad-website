/* ============================================================
   money.ts: THE ONE COPY of the money school's ladder. Everything
   reads from it: the hub, the lesson routes, the breadcrumb, the
   palette, the menu and the sitemap.

   `scripts/build-modules.ts` compiles it to
   `aab/money/curriculum.js`, which `sw.js` precaches by name.
   Edit this file, never that one.

   THE SHAPE: a school holds `.stages[]`, a পর্যায় each; a stage
   holds `.sections[]`, which are headings and never pages; a
   section holds `.lessons[]`, one page each. A ধাপ is a STEP
   INSIDE A LESSON and never a stage: stage 0 is eight steps, so
   "ধাপ ৩" would name two things one click apart. MONEY.md.

   A lesson's URL is `${stage.base}${lesson.slug}.html`, `base`
   defaulting to `/money/${stage.slug}/`. Stage `basics-1`
   overrides it to `/money/terms/`, where those eighteen pages
   were published first: a URL that already works may not change,
   and a SLUG IS HALF OF A STORED PROGRESS ID.
   ============================================================ */
/* ------------------------------------------------------------
   STAGE 0, হাতেখড়ি

   Eight lessons at /money/start/. The ids below are the ones they
   carried as accordion sections of the hub: progress is filed
   under `start/<slug>`, and a restructure may not move somebody's
   ticks. The hub still carries an anchor per step so a saved link
   to /money#step-papers lands where it named.
   ------------------------------------------------------------ */
const STARTER_STEPS = [
    {
        slug: "money-first",
        bn: "টাকাটা আগে ঠিক করুন",
        en: "Get your money ready first",
        blurb: "বিনিয়োগ শুরুর আগে যে তিনটা জিনিস ঠিক থাকতে হয়, জরুরি তহবিল, ধার, আর কত টাকা আটকে রাখতে পারবেন।",
        minutes: 13,
        risk: "low",
        icon: "wallet",
        stars: 5,
        needs: ["start/how-much-risk"],
    },
    {
        slug: "papers",
        bn: "কাগজপত্র গুছিয়ে নিন",
        en: "Get your papers in order",
        blurb: "এনআইডি, টিআইএন, ব্যাংক অ্যাকাউন্ট, ছবি, নমিনি, একবার গুছিয়ে রাখলে বাকি সব ধাপ দ্রুত হয়।",
        minutes: 11,
        risk: "low",
        icon: "id",
        stars: 4,
        needs: ["start/money-first"],
    },
    {
        slug: "safest-first",
        bn: "সবচেয়ে নিরাপদটা দিয়ে শুরু",
        en: "Start with the safest thing",
        blurb: "ডিপিএস, সঞ্চয়পত্র, এফডিআর, শেয়ার ছোঁয়ার আগেই যেগুলোতে হাত পাকানো যায়।",
        minutes: 14,
        risk: "low",
        icon: "shield",
        stars: 4,
        needs: ["start/money-first"],
    },
    {
        slug: "bo-account",
        bn: "বিও অ্যাকাউন্ট খুলুন",
        en: "Open a BO account",
        blurb: "শেয়ারবাজারে ঢোকার দরজা। ব্রোকার কীভাবে বাছবেন, খরচ কত, আর কোন কাজটা ওরাই করে দেবে।",
        minutes: 14,
        risk: "low",
        icon: "door",
        stars: 5,
        needs: ["start/papers", "start/safest-first"],
    },
    {
        slug: "first-buy",
        bn: "প্রথম কেনাকাটা",
        en: "Your first purchase",
        blurb: "প্রথমেই একক শেয়ার না: কেন মিউচুয়াল ফান্ড দিয়ে শুরু করা বুদ্ধিমানের কাজ, আর অর্ডারটা আসলে কীভাবে দেয়।",
        minutes: 15,
        risk: "mid",
        icon: "cart",
        stars: 5,
        needs: ["start/bo-account"],
    },
    {
        slug: "make-a-rule",
        bn: "নিয়ম বানান, তারপর ধৈর্য",
        en: "Make a rule, then wait",
        blurb: "প্রতি মাসে একই দিনে একই টাকা। কখন হিসাব দেখবেন, আর কখন দেখবেন না।",
        minutes: 12,
        risk: "low",
        icon: "calendar",
        stars: 5,
        needs: ["start/first-buy"],
    },
    {
        slug: "dont-get-cheated",
        bn: "ঠকবেন না",
        en: "Don't get cheated",
        blurb: "গ্যারান্টেড রিটার্ন, ফেসবুকের টিপস, অনিবন্ধিত স্কিম, বাংলাদেশে যেভাবে মানুষ টাকা হারায়।",
        minutes: 15,
        risk: "high",
        icon: "warning",
        stars: 5,
        needs: ["start/make-a-rule"],
    },
    {
        slug: "where-next",
        bn: "এরপর কোথায়",
        en: "Where to go next",
        blurb: "হাতেখড়ি শেষ। এখন শব্দগুলো শিখে নেওয়ার পালা, আর সেটা কোথা থেকে।",
        minutes: 8,
        risk: "low",
        icon: "signpost",
        stars: 2,
        needs: ["start/dont-get-cheated"],
    },
];
/* Three lessons BEFORE the eight. The eight answer HOW, and a
   reader who has not answered WHY stops at the first red week. */
const STARTER_WHY = [
    {
        slug: "why-invest",
        bn: "কেন বিনিয়োগ করবেন",
        en: "Why invest at all",
        blurb: "ব্যাংকে টাকা রাখলে অঙ্ক বাড়ে আর ক্রয়ক্ষমতা কমে। এই একটা সত্য দিয়েই পুরো পাঠশালাটা শুরু।",
        minutes: 13, risk: "low", icon: "seed", stars: 5,
    },
    {
        slug: "your-goal",
        bn: "লক্ষ্য ঠিক করুন, তারপর টাকা",
        en: "Decide the goal before the money",
        blurb: "কত টাকা, কবে, কীসের জন্য। এই তিনটার উত্তর লিখে ফেললে কোন মাধ্যমটা আপনার, সেটা নিজেই বেরিয়ে আসে।",
        minutes: 12, risk: "low", icon: "target", stars: 4,
        needs: ["start/why-invest"],
    },
    {
        slug: "how-much-risk",
        bn: "কতটা ঝুঁকি আপনার জন্য",
        en: "How much risk is yours to take",
        blurb: "ঝুঁকি সহ্য করার মানসিক ক্ষমতা আর ঝুঁকি নেওয়ার আর্থিক সামর্থ্য দুইটা আলাদা জিনিস, আর দুইটাই মাপা যায়।",
        minutes: 14, risk: "mid", icon: "scale", stars: 5,
        needs: ["start/your-goal"],
    },
];
/* ------------------------------------------------------------
   THE LADDER
   ------------------------------------------------------------ */
const MONEY_STAGES = [
    {
        slug: "start",
        kicker: "পর্যায় ০",
        bn: "হাতেখড়ি",
        en: "Starter Guide",
        icon: "seed",
        who: "যিনি কখনো বিনিয়োগ করেননি, এবং কোথা থেকে ধরবেন বুঝতে পারছেন না",
        blurb: "প্রথমে কেন, কীসের জন্য আর কতটা ঝুঁকি। তারপর আট ধাপে বাংলাদেশে বিনিয়োগ শুরু করার পুরো পথ, কোন কাজটা আপনার আর কোনটা অন্যরা করে দেবে।",
        needs: [],
        status: "live",
        sections: [
            {
                id: "why",
                bn: "কেন, কীসের জন্য",
                en: "Why, and what for",
                lessons: STARTER_WHY.map((s) => ({ ...s, status: "live" })),
            },
            {
                id: "steps",
                bn: "আটটা ধাপ",
                en: "The eight steps",
                lessons: STARTER_STEPS.map((s) => ({ ...s, status: "live" })),
            },
        ],
    },
    {
        slug: "basics-1",
        kicker: "ভিত্তি · পর্যায় ১",
        bn: "শব্দগুলো শিখুন",
        en: "Basics: Stage 1",
        icon: "book",
        base: "/money/terms/", // published here first; the URLs stay
        who: "হাতেখড়ি শেষ, এখন কথাগুলোর মানে জানা দরকার",
        blurb: "বাজারের ছাব্বিশটা শব্দ, প্রতিটার আলাদা লেখা, বন্ধুকে বোঝানোর ভঙ্গিতে, হিসাব করে দেখার সুযোগসহ। একটার ভেতরে আরেকটার লিংক।",
        needs: ["start"],
        status: "live",
        sections: [
            {
                id: "basics",
                bn: "বাজারের মূল কথা",
                en: "Market basics",
                lessons: [
                    { slug: "share", bn: "শেয়ার", en: "Share / Stock", minutes: 11, stars: 5,
                        needs: ["start/where-next"],
                        blurb: "কোম্পানির মালিকানার ছোট্ট একটা টুকরা: শেয়ার কিনলে আপনি ওই ব্যবসার আংশিক মালিক।" },
                    { slug: "dse", bn: "ঢাকা স্টক এক্সচেঞ্জ", en: "DSE", minutes: 11, stars: 4,
                        needs: ["share"],
                        blurb: "বাংলাদেশের সবচেয়ে বড় শেয়ারবাজার: যেখানে ক্রেতা আর বিক্রেতার অর্ডার মিলিয়ে দেওয়া হয়।" },
                    { slug: "dsex", bn: "সূচক", en: "Index / DSEX", minutes: 10, stars: 4,
                        needs: ["dse"],
                        blurb: "পুরো বাজারের হালচাল এক নম্বরে: DSEX বাড়লে বোঝায় বড় কোম্পানিগুলোর দাম মোটের ওপর বেড়েছে।" },
                    { slug: "bo-account", bn: "বিও অ্যাকাউন্ট", en: "BO Account", minutes: 10, stars: 4,
                        needs: ["dse"],
                        blurb: "শেয়ারবাজারে ঢোকার টিকিট: আপনার শেয়ার ইলেকট্রনিকভাবে জমা থাকে এই অ্যাকাউন্টে।" },
                    { slug: "broker", bn: "ব্রোকার", en: "Broker", minutes: 11, stars: 4,
                        needs: ["bo-account"],
                        blurb: "আপনার আর শেয়ারবাজারের মাঝখানের লাইসেন্সধারী মধ্যস্থতাকারী, অর্ডার যায় এদের মাধ্যমে।" },
                    { slug: "market-cap", bn: "বাজারমূল্য", en: "Market capitalisation", minutes: 11, stars: 4,
                        needs: ["share"],
                        blurb: "কোম্পানিটা কত বড়, সেটা দামে না, দাম গুণ শেয়ার সংখ্যায়। দশ টাকার শেয়ার পাঁচশো টাকার শেয়ারের চেয়ে সস্তা নয়।" },
                    { slug: "liquidity", bn: "তারল্য", en: "Liquidity", minutes: 11, stars: 4,
                        needs: ["dse"],
                        blurb: "কেনা সহজ, বেচা কঠিন, এই ফাঁকটার নাম তারল্য। যেদিন বেচতে হবে সেদিন ক্রেতা থাকবে তো?" },
                    { slug: "circuit-breaker", bn: "সার্কিট ব্রেকার", en: "Circuit breaker", minutes: 10, stars: 3,
                        needs: ["dse"],
                        blurb: "একদিনে দাম কতটা উঠতে বা নামতে পারে তার সীমা। বিপদ আটকায় না, ধীরে নামায়।" },
                    { slug: "ipo", bn: "আইপিও", en: "IPO", minutes: 12, stars: 3,
                        needs: ["share", "dse"],
                        blurb: "কোনো কোম্পানি প্রথমবারের মতো সাধারণ মানুষের কাছে শেয়ার বেচে বাজারে তালিকাভুক্ত হওয়া।" },
                ],
            },
            {
                id: "instruments",
                bn: "বিনিয়োগের মাধ্যম",
                en: "Ways to invest",
                lessons: [
                    { slug: "mutual-fund", bn: "মিউচুয়াল ফান্ড", en: "Mutual Fund", minutes: 12, stars: 5,
                        needs: ["share"],
                        blurb: "অনেকের টাকা এক করে পেশাদার ম্যানেজারের হাতে বিনিয়োগ, ছোট টাকায় বড় পোর্টফোলিওর স্বাদ।" },
                    { slug: "etf", bn: "ইটিএফ", en: "ETF", minutes: 10, stars: 3,
                        needs: ["mutual-fund", "dsex"],
                        blurb: "সূচকটাই কিনে ফেলা: কোনো ম্যানেজার বাছাই করেন না, খরচ কম, আর বাংলাদেশে এখনো ছোট বাজার।" },
                    { slug: "sanchayapatra", bn: "সঞ্চয়পত্র", en: "Savings Certificate", minutes: 12, stars: 4,
                        blurb: "সরকারের কাছে টাকা ধার দেওয়া: বাংলাদেশের সবচেয়ে জনপ্রিয় নিরাপদ সঞ্চয়ের মাধ্যম।" },
                    { slug: "fdr", bn: "এফডিআর", en: "Fixed Deposit (FDR)", minutes: 11, stars: 4,
                        blurb: "ব্যাংকে নির্দিষ্ট মেয়াদে টাকা রেখে নির্দিষ্ট হারে মুনাফা, সহজ, পরিচিত, কিন্তু সীমিত।" },
                    { slug: "bond", bn: "বন্ড", en: "Bond", minutes: 12, stars: 3,
                        needs: ["fdr"],
                        blurb: "কোম্পানি বা সরকারকে ধার দেওয়ার দলিল: মালিকানা না, পাওনাদারি।" },
                    { slug: "treasury-bill", bn: "ট্রেজারি বিল ও বন্ড", en: "Treasury bills & bonds", minutes: 10, stars: 2,
                        needs: ["bond"],
                        blurb: "সরকারের নিজের ধার, আর দেশের সব সুদের হার যেখান থেকে মাপা শুরু হয়।" },
                ],
            },
            {
                id: "analysis",
                bn: "কোম্পানি বিশ্লেষণ",
                en: "Company analysis",
                lessons: [
                    { slug: "dividend", bn: "ডিভিডেন্ড", en: "Dividend", minutes: 12, stars: 5,
                        needs: ["share"],
                        blurb: "কোম্পানির লাভ থেকে শেয়ারহোল্ডারদের দেওয়া ভাগ, নগদ টাকায় বা বোনাস শেয়ারে।" },
                    { slug: "bonus-rights", bn: "বোনাস ও রাইট শেয়ার", en: "Bonus & rights shares", minutes: 11, stars: 3,
                        needs: ["dividend", "market-cap"],
                        blurb: "বোনাস শেয়ারে আপনার সম্পদ বাড়ে না, কেবল টুকরা বাড়ে। রাইট শেয়ার আরও টাকা চায়।" },
                    { slug: "eps", bn: "ইপিএস", en: "EPS", minutes: 11, stars: 5,
                        needs: ["share"],
                        blurb: "প্রতি শেয়ারে কোম্পানির আয়: কোম্পানির লাভকে শেয়ার সংখ্যা দিয়ে ভাগ করলে যা পাওয়া যায়।" },
                    { slug: "pe-ratio", bn: "পিই রেশিও", en: "P/E Ratio", minutes: 13, stars: 5,
                        needs: ["eps", "market-cap"],
                        blurb: "শেয়ারের দাম তার আয়ের কত গুণ: দামটা সস্তা না চড়া, তার প্রথম আন্দাজ।" },
                    { slug: "nav", bn: "এনএভি", en: "NAV", minutes: 11, stars: 3,
                        needs: ["mutual-fund"],
                        blurb: "ফান্ড বা কোম্পানির সম্পদ থেকে দায় বাদ দিলে প্রতি ইউনিটে যা থাকে, 'আসল' মূল্যের হিসাব।" },
                    { slug: "book-value", bn: "বইমূল্য ও পিবি", en: "Book value & P/B", minutes: 12, stars: 4,
                        needs: ["nav", "pe-ratio"],
                        blurb: "কোম্পানিটা আজ বন্ধ করে দিলে কাগজে কত থাকত, আর বাজার তার কত গুণ দাম দিচ্ছে।" },
                    { slug: "roe", bn: "আরওই", en: "ROE", minutes: 13, stars: 4,
                        needs: ["book-value", "eps"],
                        blurb: "মালিকদের টাকায় কোম্পানি বছরে কত আনে। একই আরওই তিনভাবে আসতে পারে, আর তিনটা তিন রকম ব্যবসা।" },
                ],
            },
            {
                id: "risk",
                bn: "ঝুঁকি ও কৌশল",
                en: "Risk & strategy",
                lessons: [
                    { slug: "risk-return", bn: "ঝুঁকি ও রিটার্ন", en: "Risk & Return", minutes: 13, stars: 5,
                        needs: ["share", "fdr"],
                        blurb: "বেশি লাভের আশা মানেই বেশি লসের সম্ভাবনা: বিনিয়োগের সবচেয়ে সৎ নিয়ম।" },
                    { slug: "portfolio", bn: "পোর্টফোলিও", en: "Portfolio", minutes: 11, stars: 4,
                        needs: ["risk-return"],
                        blurb: "আলাদা আলাদা শেয়ার না, একটা গোটা জিনিস। যা মাপতে হয় তা প্রতিটা শেয়ার না, পুরোটা।" },
                    { slug: "diversification", bn: "ডাইভারসিফিকেশন", en: "Diversification", minutes: 13, stars: 5,
                        needs: ["portfolio"],
                        blurb: "সব ডিম এক ঝুড়িতে না রাখা: এক জায়গার লস যেন অন্য জায়গার লাভে সামাল দেওয়া যায়।" },
                    { slug: "inflation", bn: "মূল্যস্ফীতি", en: "Inflation", minutes: 12, stars: 5,
                        needs: ["fdr"],
                        blurb: "টাকার নীরব ক্ষয়: অঙ্ক একই থাকলেও কেনার ক্ষমতা প্রতি বছর একটু করে কমে।" },
                    { slug: "compounding", bn: "চক্রবৃদ্ধি", en: "Compounding", minutes: 13, stars: 5,
                        needs: ["inflation"],
                        blurb: "মুনাফার ওপর মুনাফা: সময় যত লম্বা, টাকার বাড়া তত দ্রুত। ধৈর্যের পুরস্কার।" },
                    { slug: "margin-loan", bn: "মার্জিন ঋণ", en: "Margin loan", minutes: 13, stars: 5,
                        needs: ["risk-return", "broker"],
                        blurb: "ধার করে শেয়ার কেনা। লাভ বাড়ে, লস বাড়ে, আর অপেক্ষা করার ক্ষমতাটা বিক্রি হয়ে যায়।" },
                ],
            },
        ],
    },
    {
        slug: "basics-2",
        kicker: "ভিত্তি · পর্যায় ২",
        bn: "বাজারটা পড়তে শিখুন",
        en: "Basics: Stage 2",
        icon: "compass",
        who: "শব্দগুলো জানা হয়ে গেছে, এখন বাজারটা কীভাবে চলে বুঝতে চান",
        blurb: "দাম কেন ওঠানামা করে, কখন কিনবেন-বেচবেন-ধরে রাখবেন, কোন খাত কী, কারা নিয়ন্ত্রণ করে, আর লাইভ অ্যাপে কী দেখবেন।",
        needs: ["basics-1"],
        status: "live",
        sections: [
            {
                id: "why-move",
                bn: "বাজার কেন ওঠানামা করে",
                en: "Why markets move",
                lessons: [
                    { slug: "supply-demand", bn: "চাহিদা আর জোগান", en: "Supply & demand", minutes: 13, stars: 5,
                        needs: ["dse", "liquidity"],
                        blurb: "দাম আসলে একটাই জিনিসে ঠিক হয়: এই মুহূর্তে কে কত দিতে রাজি আর কে কত নিতে রাজি।" },
                    { slug: "news-and-price", bn: "খবর কীভাবে দামে ঢোকে", en: "How news gets into the price", minutes: 13, stars: 4,
                        needs: ["basics-2/supply-demand"],
                        blurb: "ভালো খবরেও দাম পড়তে পারে। কারণ বাজার খবরটা নয়, খবরটা কতটা আশা করা হয়েছিল সেটা কেনে।" },
                    { slug: "interest-and-taka", bn: "সুদের হার আর টাকার মান", en: "Interest rates & the taka", minutes: 15, stars: 4,
                        needs: ["basics-2/news-and-price", "treasury-bill"],
                        blurb: "বাংলাদেশ ব্যাংক সুদ বাড়ালে শেয়ারবাজারে কী হয়, আর ডলারের দাম বাড়লে কোন কোম্পানি চাপে পড়ে।" },
                    { slug: "war-and-shocks", bn: "যুদ্ধ, দুর্যোগ আর বড় ধাক্কা", en: "War, disaster & big shocks", minutes: 13, stars: 3,
                        needs: ["basics-2/interest-and-taka"],
                        blurb: "দূরের একটা যুদ্ধ কীভাবে চট্টগ্রাম বন্দর হয়ে আপনার পোর্টফোলিওতে পৌঁছায়।" },
                    { slug: "crowd-behaviour", bn: "ভিড়ের আচরণ", en: "How crowds behave", minutes: 13, stars: 4,
                        needs: ["basics-2/supply-demand"],
                        blurb: "বাবল আর ধস: দুটোই একই জিনিসের দুই পিঠ, সবাই একসাথে একই দিকে দৌড়ানো।" },
                    { slug: "market-cycles", bn: "বাজারের চক্র", en: "Market cycles", minutes: 14, stars: 4,
                        needs: ["basics-2/crowd-behaviour"],
                        blurb: "বাজার সোজা লাইনে চলে না, চক্রে চলে। ২০১০ আর ২০২০ চিনে রাখলে পরেরটা এলে চেনা লাগবে।" },
                ],
            },
            {
                id: "buy-sell-hold",
                bn: "কখন কিনবেন, কখন বেচবেন",
                en: "Buy, sell or hold",
                lessons: [
                    { slug: "order-types", bn: "অর্ডার কত রকম", en: "The kinds of order", minutes: 12, stars: 4,
                        needs: ["basics-2/supply-demand", "broker"],
                        blurb: "মার্কেট, লিমিট, আর কেন নতুনদের সবসময় লিমিট অর্ডার দেওয়া উচিত।" },
                    { slug: "when-to-buy", bn: "কেনার আগে যে পাঁচটা প্রশ্ন", en: "Five questions before buying", minutes: 14, stars: 5,
                        needs: ["basics-2/order-types", "pe-ratio"],
                        blurb: "দাম কম দেখলেই কেনা নয়। কেনার আগে নিজেকে যা জিজ্ঞেস করতেই হবে।" },
                    { slug: "when-to-sell", bn: "বেচার তিনটা বৈধ কারণ", en: "Three good reasons to sell", minutes: 14, stars: 5,
                        needs: ["basics-2/when-to-buy"],
                        blurb: "ভয় পাওয়া এর মধ্যে নেই। বেচার কারণ আগে থেকে লিখে রাখলে হাত কাঁপে না।" },
                    { slug: "why-hold", bn: "ধরে রাখাও একটা সিদ্ধান্ত", en: "Holding is a decision too", minutes: 11, stars: 4,
                        needs: ["basics-2/when-to-sell"],
                        blurb: "কিছু না করা মানে অলসতা না, কিন্তু সেটা যেন সিদ্ধান্ত হয়, এড়িয়ে যাওয়া না হয়।" },
                    { slug: "cost-of-churn", bn: "বারবার কেনাবেচার দাম", en: "What churning costs you", minutes: 12, stars: 4,
                        needs: ["basics-2/why-hold"],
                        blurb: "কমিশন, স্প্রেড আর ভুলের সময়, ঘন ঘন হাত বদলালে যে তিনটা জায়গায় টাকা গলে।" },
                ],
            },
            {
                id: "what-exists",
                bn: "কী কী কেনা যায়",
                en: "What you can actually buy",
                lessons: [
                    { slug: "sectors", bn: "খাত চিনুন", en: "Sectors explained", minutes: 16, stars: 4,
                        needs: ["basics-2/interest-and-taka"],
                        blurb: "ব্যাংক, বিমা, ওষুধ, বস্ত্র, সিমেন্ট, জ্বালানি, খাদ্য, কোন খাত কীসে ভালো করে, কীসে মার খায়।" },
                    { slug: "share-categories", bn: "A, B, N, Z: ক্যাটাগরি", en: "Share categories", minutes: 12, stars: 4,
                        needs: ["dividend", "circuit-breaker"],
                        blurb: "ডিএসই প্রতিটা শেয়ারকে একটা অক্ষর দেয়। Z মানে কী, আর কেন নতুনদের ওদিকে না যাওয়াই ভালো।" },
                    { slug: "ipo-in-practice", bn: "আইপিও হাতে কলমে", en: "Applying for an IPO", minutes: 12, stars: 3,
                        needs: ["ipo", "bo-account"],
                        blurb: "আবেদন কীভাবে, লটারিতে পাওয়ার সম্ভাবনা কত, আর প্রথম দিনে বেচে দেওয়া বুদ্ধিমানের কাজ কি না।" },
                    { slug: "commodities", bn: "কমোডিটি: সোনা, তেল, খাদ্যশস্য", en: "Commodities", minutes: 13, stars: 2,
                        needs: ["basics-2/war-and-shocks"],
                        blurb: "সোনা কেন 'নিরাপদ আশ্রয়', তেলের দাম কাদের ভালো আর কাদের খারাপ করে।" },
                    { slug: "complements-substitutes", bn: "পরিপূরক আর বিকল্প", en: "Complements & substitutes", minutes: 12, stars: 2,
                        needs: ["basics-2/sectors"],
                        blurb: "চা আর চিনি একসাথে চলে; চা আর কফি একে অন্যকে খায়। এই একটা ধারণা দিয়ে অনেক দাম ব্যাখ্যা করা যায়।" },
                ],
            },
            {
                id: "institutions",
                bn: "কারা কী করে",
                en: "Who runs what",
                lessons: [
                    { slug: "bsec", bn: "বিএসইসি: নিয়ন্ত্রক", en: "BSEC, the regulator", minutes: 12, stars: 3,
                        needs: ["dse"],
                        blurb: "বাজারের পুলিশ। কী করতে পারে, কী পারে না, আর অভিযোগ করলে কোথায় করবেন।" },
                    { slug: "exchanges-cdbl", bn: "ডিএসই, সিএসই আর সিডিবিএল", en: "DSE, CSE & CDBL", minutes: 12, stars: 3,
                        needs: ["bo-account", "basics-2/bsec"],
                        blurb: "কেনাবেচা হয় এক জায়গায়, শেয়ার জমা থাকে আরেক জায়গায়, কে কোন কাজটা করে।" },
                    { slug: "bangladesh-bank", bn: "বাংলাদেশ ব্যাংক", en: "Bangladesh Bank", minutes: 13, stars: 3,
                        needs: ["basics-2/interest-and-taka"],
                        blurb: "সুদের হার, টাকার জোগান আর ডলার, কেন্দ্রীয় ব্যাংকের সিদ্ধান্ত সবার আগে বাজারে লাগে।" },
                    { slug: "amcs-icb", bn: "অ্যাসেট ম্যানেজার আর আইসিবি", en: "Asset managers & ICB", minutes: 12, stars: 2,
                        needs: ["mutual-fund"],
                        blurb: "আপনার ফান্ডের টাকা আসলে কারা চালায়, আর আইসিবি বাজারে ঠিক কী ভূমিকা রাখে।" },
                    { slug: "choosing-a-broker", bn: "ব্রোকারেজ হাউস বাছাই", en: "Choosing a brokerage", minutes: 13, stars: 4,
                        needs: ["broker", "margin-loan"],
                        blurb: "কমিশন, অ্যাপের মান, মার্জিন ঋণের চাপ, কোন জিনিসগুলো আসলে দেখা দরকার।" },
                ],
            },
            {
                id: "live-market",
                bn: "লাইভ বাজার দেখা",
                en: "Reading the live market",
                lessons: [
                    { slug: "reading-a-quote", bn: "একটা কোট পড়তে শিখুন", en: "How to read a quote", minutes: 14, stars: 5,
                        needs: ["basics-2/order-types", "circuit-breaker"],
                        blurb: "LTP, YCP, ভলিউম, সার্কিট, অ্যাপের ওই সংখ্যাগুলোর মানে এক এক করে।" },
                    { slug: "apps-and-sites", bn: "কোন অ্যাপ, কোন সাইট", en: "Which apps & sites", minutes: 12, stars: 3,
                        needs: ["basics-2/reading-a-quote"],
                        blurb: "ডিএসইর নিজের সাইট থেকে ব্রোকারের অ্যাপ: কোনটা কীসের জন্য, আর কোনটায় ভরসা করবেন না।" },
                    { slug: "watchlist", bn: "নিজের ওয়াচলিস্ট বানান", en: "Build a watchlist", minutes: 12, stars: 3,
                        needs: ["basics-2/apps-and-sites"],
                        blurb: "সারাদিন দাম দেখা নয়: সপ্তাহে একবার দেখার মতো একটা ছোট তালিকা কীভাবে বানাবেন।" },
                    { slug: "costs-and-taxes", bn: "খরচ আর কর", en: "Costs and taxes", minutes: 13, stars: 4,
                        needs: ["basics-2/cost-of-churn", "dividend"],
                        blurb: "কমিশন, লাগা, উৎসে কর, আর ডিভিডেন্ডে কর, রিটার্ন সবসময় এগুলো কাটার পরের সংখ্যাটা।" },
                ],
            },
        ],
    },
    {
        slug: "basics-3",
        kicker: "ভিত্তি · পর্যায় ৩",
        bn: "নিজে যাচাই করুন",
        en: "Basics: Stage 3",
        icon: "magnifier",
        who: "যিনি অন্যের কথায় না চলে নিজে একটা শেয়ার বিচার করতে চান",
        blurb: "বাংলাদেশে তথ্য কোথায় পাওয়া যায়, রিপোর্ট কীভাবে পড়তে হয়, দাম বসানোর পদ্ধতি, আর একটা কোম্পানি নিয়ে সৎভাবে সিদ্ধান্তে আসার পুরো প্রক্রিয়া।",
        needs: ["basics-2"],
        status: "live",
        sections: [
            {
                id: "finding-data",
                bn: "তথ্য কোথায়",
                en: "Where the data is",
                lessons: [
                    { slug: "dse-website", bn: "ডিএসইর সাইট থেকে যা পাবেন", en: "Mining the DSE website", minutes: 13, stars: 4,
                        needs: ["basics-2/apps-and-sites"],
                        blurb: "কোম্পানির পাতা, মূল্য-সংবেদনশীল তথ্য, আর্কাইভ, বিনামূল্যে যা যা আছে।" },
                    { slug: "annual-report", bn: "বার্ষিক প্রতিবেদন কোথায়, কীভাবে", en: "Finding the annual report", minutes: 13, stars: 4,
                        needs: ["basics-3/dse-website"],
                        blurb: "কোথায় নামাবেন, আর দুইশো পাতার মধ্যে আসলে কোন পাঁচটা পাতা পড়বেন।" },
                    { slug: "official-sources", bn: "সরকারি সূত্র", en: "Official sources", minutes: 12, stars: 3,
                        needs: ["basics-2/bangladesh-bank"],
                        blurb: "বাংলাদেশ ব্যাংক, বিবিএস, এনবিআর, মূল্যস্ফীতি থেকে রপ্তানি, আসল সংখ্যাগুলো যেখানে থাকে।" },
                    { slug: "keeping-records", bn: "নিজের খাতা রাখুন", en: "Keep your own records", minutes: 12, stars: 4,
                        needs: ["basics-2/watchlist"],
                        blurb: "একটা সাধারণ স্প্রেডশিট: কী কিনলেন, কেন কিনলেন, কত দামে। পরে এটাই সবচেয়ে দামি।" },
                ],
            },
            {
                id: "reading-statements",
                bn: "হিসাব পড়া",
                en: "Reading the numbers",
                lessons: [
                    { slug: "income-statement", bn: "আয়-ব্যয়ের হিসাব", en: "The income statement", minutes: 15, stars: 5,
                        needs: ["basics-3/annual-report", "eps"],
                        blurb: "উপরে বিক্রি, নিচে লাভ, মাঝখানে যা যা কেটে নেয়, লাইন ধরে ধরে।" },
                    { slug: "balance-sheet", bn: "স্থিতিপত্র", en: "The balance sheet", minutes: 15, stars: 5,
                        needs: ["basics-3/income-statement", "book-value"],
                        blurb: "কোম্পানির কী আছে, কার কাছে কত দেনা, আর মালিকদের হাতে আসলে কী থাকে।" },
                    { slug: "cash-flow", bn: "নগদ প্রবাহ", en: "Cash flow", minutes: 15, stars: 5,
                        needs: ["basics-3/balance-sheet"],
                        blurb: "লাভ দেখানো যায়, নগদ দেখানো যায় না। এইজন্যই এই পাতাটা সবচেয়ে সৎ।" },
                    { slug: "ratios", bn: "অনুপাত দিয়ে যাচাই", en: "Checking with ratios", minutes: 16, stars: 5,
                        needs: ["basics-3/cash-flow", "roe"],
                        blurb: "ROE, ঋণ-মূলধন, চলতি অনুপাত, মার্জিন, অল্প কয়েকটা ভাগ করেই অনেকটা বোঝা যায়।" },
                    { slug: "comparing-peers", bn: "একই খাতের সঙ্গে মেলান", en: "Comparing with the peers", minutes: 13, stars: 4,
                        needs: ["basics-3/ratios", "basics-2/sectors"],
                        blurb: "একটা সংখ্যা একা কিছু বলে না। ব্যাংকের পিই ওষুধ কোম্পানির সঙ্গে মেলানো মানে আমের সঙ্গে কমলা।" },
                    { slug: "valuation-basics", bn: "দাম বসানোর প্রথম পাঠ", en: "First steps in valuation", minutes: 16, stars: 4,
                        needs: ["basics-3/comparing-peers", "compounding"],
                        blurb: "দুইটা পদ্ধতি: তুলনা করে, আর ভবিষ্যতের নগদ আজকের টাকায় নামিয়ে। দুইটাই অনুমান, আর সেটা লুকানো যায় না।" },
                    { slug: "red-flags", bn: "বিপদের চিহ্ন", en: "Red flags", minutes: 15, stars: 5,
                        needs: ["basics-3/cash-flow", "basics-2/share-categories"],
                        blurb: "নিরীক্ষকের আপত্তি, হঠাৎ পাল্টানো হিসাব-পদ্ধতি, উধাও নগদ, যা দেখলে সরে আসবেন।" },
                ],
            },
            {
                id: "thinking",
                bn: "সিদ্ধান্তে আসা",
                en: "Coming to a decision",
                lessons: [
                    { slug: "a-thesis", bn: "নিজের যুক্তি লিখে ফেলুন", en: "Write your thesis down", minutes: 13, stars: 5,
                        needs: ["basics-3/valuation-basics", "basics-3/keeping-records"],
                        blurb: "তিন বাক্যে লিখুন কেন কিনছেন আর কী হলে ভুল প্রমাণিত হবেন। এটাই আপনাকে বাঁচাবে।" },
                    { slug: "news-vs-rumour", bn: "খবর নাকি গুজব", en: "News or rumour?", minutes: 13, stars: 4,
                        needs: ["basics-2/news-and-price", "basics-3/official-sources"],
                        blurb: "হোয়াটসঅ্যাপের 'ইনসাইড নিউজ' যাচাই করার তিনটা ধাপ, প্রতিবারই।" },
                    { slug: "your-own-biases", bn: "নিজের মনের ফাঁদ", en: "Your own biases", minutes: 14, stars: 4,
                        needs: ["basics-3/a-thesis", "basics-2/crowd-behaviour"],
                        blurb: "যে দামে কিনেছেন সেটা আঁকড়ে ধরা, লস মানতে না চাওয়া, সবচেয়ে দামি ভুলগুলো নিজের ভেতরেই।" },
                    { slug: "case-study", bn: "একটা কোম্পানি, শুরু থেকে শেষ", en: "One company, end to end", minutes: 20, stars: 5,
                        needs: ["basics-3/red-flags", "basics-3/a-thesis"],
                        blurb: "উপরের সবকিছু একসাথে বসিয়ে একটা কাল্পনিক কোম্পানিকে যাচাই করে দেখা।" },
                    { slug: "build-a-portfolio", bn: "পোর্টফোলিও দাঁড় করান", en: "Build the portfolio", minutes: 16, stars: 4,
                        needs: ["basics-3/case-study", "diversification"],
                        blurb: "একটা ভালো শেয়ার আর একটা ভালো পোর্টফোলিও এক জিনিস না। ওজন, খাত আর নগদ কীভাবে ঠিক করবেন।" },
                    { slug: "your-first-review", bn: "প্রথম পর্যালোচনা", en: "Your first review", minutes: 14, stars: 4,
                        needs: ["basics-3/build-a-portfolio", "basics-3/keeping-records"],
                        blurb: "ছয় মাস পর কী দেখবেন, কী বদলাবেন, আর কোন প্রশ্নটা প্রতিবার একইভাবে করবেন।" },
                ],
            },
        ],
    },
    {
        slug: "inter-1",
        kicker: "মাঝারি · পর্যায় ১",
        bn: "বিশ্ববিদ্যালয়ের পড়া",
        en: "Intermediate 1: Coursework",
        icon: "cap",
        who: "ফিন্যান্স, অ্যাকাউন্টিং বা অর্থনীতির স্নাতক শিক্ষার্থী",
        blurb: "কোর্সের বিষয়গুলো ধরে ধরে, আর অ্যাসাইনমেন্টের অঙ্ক কীভাবে ধাপে ধাপে দাঁড় করাতে হয়।",
        needs: ["basics-3"],
        status: "soon",
        sections: [
            {
                id: "core-papers",
                bn: "কোর কোর্সগুলো",
                en: "The core papers",
                lessons: [
                    { slug: "corporate-finance", bn: "কর্পোরেট ফিন্যান্স", en: "Corporate finance", minutes: 12, status: "soon",
                        blurb: "মূলধন কাঠামো, বাজেটিং, লভ্যাংশ নীতি, যা প্রতিটা সিলেবাসে থাকে।" },
                    { slug: "valuation", bn: "মূল্যায়ন: DCF ও তুলনা", en: "Valuation: DCF & multiples", minutes: 14, status: "soon",
                        blurb: "একটা কোম্পানির দাম বসানোর দুই পদ্ধতি, ধাপে ধাপে।" },
                    { slug: "portfolio-theory", bn: "পোর্টফোলিও তত্ত্ব", en: "Portfolio theory", minutes: 12, status: "soon",
                        blurb: "ঝুঁকি-রিটার্নের সীমানা, CAPM, বিটা, পরীক্ষায় যেভাবে আসে।" },
                    { slug: "econometrics", bn: "ইকোনোমেট্রিক্স হাতেকলমে", en: "Econometrics in practice", minutes: 14, status: "soon",
                        blurb: "রিগ্রেশন চালানো এক জিনিস, ফলাফল বিশ্বাস করা আরেক জিনিস।" },
                ],
            },
            {
                id: "solving",
                bn: "সমস্যা সমাধানের পদ্ধতি",
                en: "How to solve a problem",
                lessons: [
                    { slug: "problem-method", bn: "যেকোনো অঙ্কের সাত ধাপ", en: "Seven steps for any problem", minutes: 10, status: "soon",
                        blurb: "প্রশ্ন পড়ার পর কলম ধরার আগে যা যা করবেন।" },
                    { slug: "worked-example", bn: "একটা অ্যাসাইনমেন্ট, পুরোটা", en: "A full worked assignment", minutes: 16, status: "soon",
                        blurb: "একটা সত্যিকারের প্রশ্ন, শুরু থেকে জমা দেওয়া পর্যন্ত।" },
                    { slug: "excel-for-coursework", bn: "কোর্সওয়ার্কের জন্য এক্সেল", en: "Excel for coursework", minutes: 12, status: "soon",
                        blurb: "যে দশটা ফাংশন জানলে বাকি সব সহজ হয়ে যায়।" },
                    { slug: "citing", bn: "রেফারেন্স আর নকল এড়ানো", en: "Citing & avoiding plagiarism", minutes: 8, status: "soon",
                        blurb: "কোনটা উদ্ধৃতি, কোনটা নকল, সীমানাটা পরিষ্কার করে।" },
                ],
            },
        ],
    },
    {
        slug: "inter-2",
        kicker: "মাঝারি · পর্যায় ২",
        bn: "গবেষণা ও অভিসন্দর্ভ",
        en: "Intermediate 2: Dissertation",
        icon: "scroll",
        who: "যিনি থিসিস বা ডিসার্টেশন লিখছেন, বা লিখবেন",
        blurb: "বিষয় বাছাই থেকে জমা দেওয়া, আর স্কলারলি আর্টিকেল পড়ে কাজে লাগানোর অভ্যাস।",
        needs: ["inter-1"],
        status: "soon",
        sections: [
            {
                id: "doing-research",
                bn: "গবেষণা করা",
                en: "Doing the research",
                lessons: [
                    { slug: "choosing-a-topic", bn: "বিষয় বাছাই", en: "Choosing a topic", minutes: 10, status: "soon",
                        blurb: "যে প্রশ্নের উত্তর আসলে দেওয়া যায়, এবং যেটার ডেটা আছে।" },
                    { slug: "literature-review", bn: "সাহিত্য পর্যালোচনা", en: "The literature review", minutes: 12, status: "soon",
                        blurb: "পঞ্চাশটা পেপার পড়া নয়: একটা তর্ক দাঁড় করানো।" },
                    { slug: "finding-papers", bn: "পেপার খোঁজা ও পড়া", en: "Finding & reading papers", minutes: 10, status: "soon",
                        blurb: "কোথায় খুঁজবেন, কীভাবে দ্রুত পড়বেন, কীভাবে নোট রাখবেন।" },
                    { slug: "methodology", bn: "পদ্ধতি নির্বাচন", en: "Methodology", minutes: 12, status: "soon",
                        blurb: "প্রশ্নটাই ঠিক করে দেয় পদ্ধতি কী হবে: উল্টোটা নয়।" },
                    { slug: "bd-data-for-research", bn: "বাংলাদেশের ডেটা নিয়ে কাজ", en: "Working with Bangladeshi data", minutes: 12, status: "soon",
                        blurb: "ফাঁক, অসঙ্গতি আর হাতে তোলা সংখ্যা, বাস্তবে যা মোকাবিলা করতে হয়।" },
                ],
            },
            {
                id: "writing-up",
                bn: "লেখা ও জমা",
                en: "Writing it up",
                lessons: [
                    { slug: "structure", bn: "কাঠামো", en: "Structure", minutes: 10, status: "soon",
                        blurb: "অধ্যায় ধরে ধরে, কোনটায় কী থাকবে।" },
                    { slug: "defending", bn: "ভাইভা ও প্রতিরক্ষা", en: "The viva", minutes: 8, status: "soon",
                        blurb: "যে প্রশ্নগুলো আসবেই, আর সৎ উত্তর কেমন দেখায়।" },
                    { slug: "publishing", bn: "প্রকাশের পথ", en: "Getting published", minutes: 10, status: "soon",
                        blurb: "জার্নাল বাছাই, জমা, রিভিউ, আর প্রেডেটরি জার্নাল চেনা।" },
                ],
            },
        ],
    },
    {
        slug: "inter-3",
        kicker: "মাঝারি · পর্যায় ৩",
        bn: "চাকরি ও বাস্তব কাজ",
        en: "Intermediate 3: On the job",
        icon: "briefcase",
        who: "যিনি এই খাতে চাকরি খুঁজছেন বা সবে ঢুকেছেন",
        blurb: "বাজারের চাকরিগুলো আসলে কী করে, দিনটা কেমন কাটে, কী দিয়ে যাচাই করা হয়, আর কীভাবে ঢোকা যায়।",
        needs: ["inter-2"],
        status: "soon",
        sections: [
            {
                id: "the-roles",
                bn: "কাজগুলো কী",
                en: "What the jobs are",
                lessons: [
                    { slug: "research-analyst", bn: "রিসার্চ অ্যানালিস্ট", en: "Research analyst", minutes: 10, status: "soon",
                        blurb: "মডেল, রিপোর্ট, কল, দিনটা আসলে কীভাবে কাটে।" },
                    { slug: "credit-risk", bn: "ক্রেডিট ও রিস্ক", en: "Credit & risk", minutes: 10, status: "soon",
                        blurb: "ব্যাংকে ঝুঁকি মাপার কাজটা ঠিক কী।" },
                    { slug: "treasury", bn: "ট্রেজারি", en: "Treasury", minutes: 10, status: "soon",
                        blurb: "টাকা, ডলার আর সুদ, প্রতিষ্ঠানের ভেতর থেকে।" },
                    { slug: "asset-management", bn: "অ্যাসেট ম্যানেজমেন্ট", en: "Asset management", minutes: 10, status: "soon",
                        blurb: "অন্যের টাকা চালানোর দায়িত্ব কেমন।" },
                ],
            },
            {
                id: "getting-in",
                bn: "ঢোকার পথ",
                en: "Getting in",
                lessons: [
                    { slug: "cv-and-interview", bn: "সিভি ও ইন্টারভিউ", en: "CV & interview", minutes: 12, status: "soon",
                        blurb: "কী দেখা হয়, আর কোন উত্তরগুলো আসলে কাজ করে।" },
                    { slug: "certifications", bn: "সার্টিফিকেশন: কোনটা কাজে লাগে", en: "Which certifications matter", minutes: 10, status: "soon",
                        blurb: "CFA, FRM, ACCA, কার জন্য কোনটা, আর কোনটা না।" },
                    { slug: "first-90-days", bn: "প্রথম তিন মাস", en: "The first 90 days", minutes: 10, status: "soon",
                        blurb: "নতুন হিসেবে কী করবেন, কী করবেন না।" },
                ],
            },
        ],
    },
    {
        slug: "advanced",
        kicker: "সর্বোচ্চ পর্যায়",
        bn: "গবেষণা স্তর",
        en: "Advanced: Research level",
        icon: "microscope",
        who: "গবেষক, পিএইচডি শিক্ষার্থী, এবং যিনি নিজেই প্রশ্ন তৈরি করেন",
        blurb: "ফ্রন্টিয়ার মার্কেট হিসেবে বাংলাদেশ: সম্পদমূল্যায়ন তত্ত্ব, বাজারের গঠন, আর মৌলিক গবেষণার কাজ।",
        needs: ["inter-3"],
        status: "soon",
        sections: [
            {
                id: "theory",
                bn: "তত্ত্ব",
                en: "Theory",
                lessons: [
                    { slug: "asset-pricing", bn: "সম্পদমূল্যায়ন তত্ত্ব", en: "Asset pricing", minutes: 16, status: "soon",
                        blurb: "ফ্যাক্টর মডেল থেকে শর্তসাপেক্ষ মূল্যায়ন।" },
                    { slug: "market-efficiency", bn: "বাজার দক্ষতা: ফ্রন্টিয়ার প্রেক্ষাপট", en: "Efficiency in frontier markets", minutes: 14, status: "soon",
                        blurb: "যে তত্ত্ব উন্নত বাজারের জন্য বানানো, সেটা এখানে কতটা খাটে।" },
                    { slug: "microstructure", bn: "বাজারের গঠন", en: "Market microstructure", minutes: 14, status: "soon",
                        blurb: "তারল্য, স্প্রেড আর দাম গঠনের প্রক্রিয়া।" },
                ],
            },
            {
                id: "doing-it",
                bn: "কাজটা করা",
                en: "Doing the work",
                lessons: [
                    { slug: "research-design", bn: "গবেষণা নকশা", en: "Research design", minutes: 14, status: "soon",
                        blurb: "পরিচয়করণ, শনাক্তকরণ কৌশল, আর দৃঢ়তা যাচাই।" },
                    { slug: "replication", bn: "পুনরাবৃত্তি ও স্বচ্ছতা", en: "Replication & transparency", minutes: 12, status: "soon",
                        blurb: "কোড আর ডেটা এমনভাবে রাখা, যাতে অন্যে যাচাই করতে পারে।" },
                    { slug: "islamic-funds", bn: "কেস: ইসলামিক ফান্ডের ঝুঁকি", en: "Case: Islamic fund risk", minutes: 18, status: "soon",
                        blurb: "একটা সত্যিকারের গবেষণা, প্রশ্ন থেকে ফলাফল পর্যন্ত।" },
                ],
            },
        ],
    },
];
/* ------------------------------------------------------------
   SCHOOLS. One here, and nothing below assumes there is only one.
   ------------------------------------------------------------ */
export const SCHOOLS = [
    {
        id: "money",
        mount: "/money/",
        bn: "টাকার পাঠশালা",
        en: "Money & markets",
        tagline: "বাংলাদেশে বিনিয়োগ: একদম শুরু থেকে গবেষণা পর্যন্ত",
        stages: MONEY_STAGES,
    },
];
/** The school a path belongs to (defaults to the first). */
export const schoolFor = (path = "/money/") => SCHOOLS.find((s) => path.startsWith(s.mount)) ?? SCHOOLS[0];
/** Every stage of the money school, in ladder order. */
export const STAGES = MONEY_STAGES;
/** A stage's ladder URL. */
export const stageUrl = (stage) => `/money/${stage.slug}`;
/** Where a stage's lessons live, `base` wins, so basics-1 keeps /money/terms/. */
export const lessonBase = (stage) => stage.base ?? `/money/${stage.slug}/`;
/** A lesson's URL. */
export const lessonUrl = (stage, lesson) => `${lessonBase(stage)}${lesson.slug}.html`;
/** Progress is stored per lesson under a stable id. */
export const lessonId = (stage, lesson) => stage.slug === "basics-1" ? lesson.slug : `${stage.slug}/${lesson.slug}`;
/** Flat list of every lesson, with its stage and section attached. */
export const allLessons = () => STAGES.flatMap((stage) => stage.sections.flatMap((section) => section.lessons.map((lesson) => ({
    ...lesson,
    stage,
    section,
    id: lessonId(stage, lesson),
    url: lessonUrl(stage, lesson),
    status: lesson.status ?? "live",
}))));
/** Lessons of one stage, flattened, in order. */
export const stageLessons = (stage) => stage.sections.flatMap((section) => section.lessons.map((lesson) => ({
    ...lesson,
    stage,
    section,
    id: lessonId(stage, lesson),
    url: lessonUrl(stage, lesson),
    status: lesson.status ?? "live",
})));
/** How many lessons a stage has, and how many are written. */
export const stageCount = (stage) => {
    const lessons = stageLessons(stage);
    return { total: lessons.length, live: lessons.filter((l) => l.status === "live").length };
};
/** Total reading time of a stage, in minutes. */
export const stageMinutes = (stage) => stageLessons(stage).reduce((sum, l) => sum + (l.minutes ?? 0), 0);
/** Find a stage by slug. */
export const findStage = (slug) => STAGES.find((s) => s.slug === slug);
/** Find a lesson (and its stage) from a URL path. */
export const findByPath = (path) => allLessons().find((l) => l.url === path || l.url === `${path}.html`);
