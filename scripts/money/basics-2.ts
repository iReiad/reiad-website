/* ============================================================
   ভিত্তি, পর্যায় ২: বাজারটা পড়তে শিখুন. Twenty-five lessons.

   What seeded these rows. See `scripts/money/shape.ts` for why
   this file is kept and what it is not.
   ============================================================ */

import { mount, type Written } from "./shape.ts";

export const LESSONS: Written = {

/* ---------------------------------------------------------- */
"supply-demand": {
  bn: `
<p>শেয়ারের দাম কেন ওঠানামা করে, এই প্রশ্নের উত্তর মানুষ সাধারণত খবরে খোঁজেন। উত্তরটা আসলে অনেক সরল আর অনেক যান্ত্রিক: <strong>দাম ঠিক হয় এই মুহূর্তে কে কত দিতে রাজি আর কে কত নিতে রাজি, তার মিলনে।</strong> এর বাইরে আর কিছু নেই।</p>

<p><a class="term" href="/money/terms/dse.html">ডিএসইর</a> লেখায় অর্ডার বইয়ের ছবিটা দেখা হয়েছে। এই লেখাটা ওই ছবিটাকে গভীরে নিয়ে যায়, কারণ এটা বুঝলে বাজারের প্রায় প্রতিটা রহস্যজনক আচরণ ব্যাখ্যা হয়ে যায়: ভালো খবরে দাম পড়া, খারাপ খবরে দাম বাড়া, আর কোনো খবর ছাড়াই দাম নড়া।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>দাম একটা মতামত নয়, দুইজন মানুষের চুক্তি।</li>
<li>প্রতিটা লেনদেনে একজন কিনছেন আর একজন বেচছেন, দুইজনেই নিজেকে বুদ্ধিমান ভাবছেন।</li>
<li>খবর দাম বদলায় না; খবর মানুষের অর্ডার বদলায়, আর অর্ডার দাম বদলায়।</li>
<li>জোগানের দিকটা বাংলাদেশে বিশেষভাবে গুরুত্বপূর্ণ, কারণ ভাসমান শেয়ার কম।</li>
<li>বড় অর্ডার নিজেই দাম নাড়ায়, আর সেটাকে বলে মার্কেট ইমপ্যাক্ট।</li>
</ul>
</div>

<h2>প্রতিটা লেনদেনে দুইজন থাকেন</h2>

<p>এই সহজ সত্যটা প্রায়ই ভুলে যাওয়া হয়। আপনি যখন একটা শেয়ার কেনেন, কেউ একজন ঠিক সেই মুহূর্তে সেই দামে সেটা বেচছেন। আপনি ভাবছেন এটা সস্তা, তিনি ভাবছেন এটা যথেষ্ট দামি। দুইজনের একজন ভুল, আর কে ভুল সেটা কেবল পরে জানা যায়।</p>

<p>এই কথাটা মাথায় রাখলে একটা দরকারি অভ্যাস তৈরি হয়। কেনার আগে জিজ্ঞেস করুন: <strong>যিনি আমাকে এটা বেচছেন, তিনি কী জানেন?</strong> অনেক সময় উত্তরটা হলো তার টাকা দরকার বা তার সময়সীমা আলাদা, যা নিরীহ। কখনো উত্তরটা হলো তিনি এমন কিছু জানেন যা আপনি জানেন না।</p>

<h2>অর্ডার বই কীভাবে দাম বানায়</h2>

${mount("sd-callouts")}

<p>খেয়াল করুন কোনো কর্তৃপক্ষ কোথাও নেই। ডিএসই দাম ঠিক করে না, কোম্পানি দাম ঠিক করে না, ব্রোকার দাম ঠিক করে না। দাম হলো শেষ যে দুইজন একমত হয়েছিলেন তাদের চুক্তির সংখ্যা।</p>

<h2>খবর কীভাবে ঢোকে</h2>

<p>খবর সরাসরি দামে ঢোকে না। খবর মানুষের অর্ডারে ঢোকে, আর অর্ডার দামে।</p>

${mount("sd-flow")}

<p>একটা কোম্পানি ভালো ফলাফল ঘোষণা করল। যারা শেয়ারটা ধরে আছেন তাদের কেউ কেউ ভাবলেন এখন আরও দামি হওয়া উচিত, তাই তারা বেচার অর্ডার তুলে নিলেন বা দাম বাড়িয়ে দিলেন। যারা কিনতে চেয়েছিলেন তারা ভাবলেন দেরি হয়ে যাচ্ছে, তাই তারা বেশি দাম দিতে রাজি হলেন। জোগান কমল আর চাহিদা বাড়ল, তাই দাম উঠল।</p>

<p>এখন উল্টো ঘটনাটা: একই ভালো ফলাফলে দাম পড়ল। কেন? কারণ বাজার আরও ভালো ফলাফল আশা করেছিল, আর ওই আশাটা আগেই দামে ঢুকে গিয়েছিল। যারা আশা নিয়ে আগে থেকে কিনে রেখেছিলেন, তারা এখন বেচছেন। <a class="term" href="/money/basics-2/news-and-price.html">পরের লেখাটা</a> পুরোটাই এই নিয়ে।</p>

<h2>জোগানের দিকটা, আর বাংলাদেশে কেন গুরুত্বপূর্ণ</h2>

<p>চাহিদা নিয়ে সবাই কথা বলেন আর জোগান নিয়ে প্রায় কেউ না। অথচ বাংলাদেশের বাজারে জোগানের দিকটাই বেশি ব্যাখ্যা করে।</p>

<p><a class="term" href="/money/terms/market-cap.html">বাজারমূল্যের</a> লেখায় দেখা গেছে অনেক কোম্পানির বেশিরভাগ শেয়ার প্রতিষ্ঠাতা পরিবার বা প্রতিষ্ঠানের হাতে বন্ধ। মানে প্রতিদিন কেনাবেচার জন্য পাওয়া যায় খুব অল্প শেয়ার। এই অবস্থায় সামান্য চাহিদাও দাম অনেকটা তুলে দেয়, আর সামান্য বিক্রি অনেকটা নামিয়ে দেয়।</p>

<div class="ex"><b>উদাহরণ:</b> একটা কোম্পানির দৈনিক লেনদেন ২০ লাখ টাকার। এখন কেউ একজন ৫০ লাখ টাকার কেনার অর্ডার দিল। অর্ডার বইয়ের সবচেয়ে সস্তা বিক্রেতারা দ্রুত শেষ হয়ে যাবে, আর ক্রেতাকে উপরের দিকের দামগুলোতে উঠতে হবে। দাম হয়তো ৮% বেড়ে যাবে, কোম্পানির কিছু না ঘটেই। পরদিন ওই ক্রেতা থামলে দাম আবার নেমে আসবে। এই পুরো ঘটনার নাম মার্কেট ইমপ্যাক্ট, আর নতুন বিনিয়োগকারীরা এটাকে খবর ভেবে ভুল করেন।</div>

<h2>তাহলে দাম আর মূল্য</h2>

<p>এই লেখার শেষ কথাটা পুরো পর্যায় ৩-এর ভিত্তি। দাম হলো শেষ দুইজন যা একমত হয়েছেন। মূল্য হলো ব্যবসাটা আগামী বছরগুলোতে যা আনবে। দুইটা আলাদা জিনিস, আর দুইটা প্রায়ই আলাদা থাকে।</p>

<p>স্বল্পমেয়াদে দাম চলে মানুষের আচরণে; দীর্ঘমেয়াদে দাম মূল্যের দিকে হাঁটে, কারণ শেষ পর্যন্ত একটা ব্যবসা যা আনে সেটাই তার শেয়ারহোল্ডারদের হাতে যায়। এই দুইটার মধ্যে দূরত্বই বিনিয়োগের সুযোগ, আর ওই দূরত্ব মাপাই পর্যায় ৩-এর কাজ।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("sd-quiz")}
`,
  en: `
<p>Why do share prices move? People usually look for the answer in the news. The answer is much simpler and much more mechanical: <strong>a price is set by what somebody will pay right now meeting what somebody will accept right now.</strong> There is nothing else in it.</p>

<p>The <a class="term" href="/money/terms/dse.html">DSE</a> lesson showed the order book. This one goes deeper into that picture, because understanding it explains nearly every puzzling thing the market does: prices falling on good news, rising on bad news, and moving with no news at all.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A price is not an opinion, it is an agreement between two people.</li>
<li>Every trade has a buyer and a seller, both of whom think they are the clever one.</li>
<li>News does not change prices; it changes orders, and orders change prices.</li>
<li>The supply side matters particularly here, because free floats are small.</li>
<li>A large order moves the price by itself, which is called market impact.</li>
</ul>
</div>

<h2>Every trade has two people in it</h2>

<p>This simple truth gets forgotten constantly. When you buy a share, somebody is selling it to you at that exact moment at that exact price. You think it is cheap; they think it is dear enough. One of you is wrong, and which one is only knowable later.</p>

<p>Holding that in mind builds a useful habit. Before buying, ask: <strong>what does the person selling to me know?</strong> Often the answer is that they need the money or have a different horizon, which is harmless. Sometimes the answer is that they know something you do not.</p>

<h2>How the order book makes a price</h2>

${mount("sd-callouts")}

<p>Notice there is no authority anywhere. DSE does not set the price, the company does not set it, the broker does not set it. The price is the number two people last agreed on.</p>

<h2>How news gets in</h2>

<p>News does not enter the price directly. It enters people's orders, and the orders enter the price.</p>

${mount("sd-flow")}

<p>A company announces good results. Some holders decide it should be worth more now, so they withdraw their sell orders or raise their prices. People who wanted to buy decide they are running out of time, so they agree to pay more. Supply fell and demand rose, so the price went up.</p>

<p>Now the reverse: the same good results and the price falls. Why? Because the market expected better, and that expectation was already in the price. The people who bought in anticipation are now selling. The <a class="term" href="/money/basics-2/news-and-price.html">next lesson</a> is entirely about this.</p>

<h2>The supply side, and why it matters here</h2>

<p>Everybody talks about demand and almost nobody about supply. In this market the supply side explains more.</p>

<p>The <a class="term" href="/money/terms/market-cap.html">market cap</a> lesson showed that most shares in many companies are locked away with a founding family or institutions. So very few shares are available to trade on any given day. In that state a modest amount of demand lifts the price a long way, and a modest amount of selling drops it a long way.</p>

<div class="ex"><b>Example:</b> A company turns over 20 lakh taka a day. Somebody places a 50 lakh buy order. The cheapest sellers in the book run out quickly and the buyer has to climb the higher prices. The price might rise 8% with nothing whatever happening at the company. The next day, with that buyer gone, it drifts back down. The whole event is called market impact, and new investors routinely mistake it for news.</div>

<h2>Which brings you to price and value</h2>

<p>The closing point here is the foundation of the whole of stage 3. A price is what the last two people agreed. Value is what the business will produce in the years ahead. They are two different things and they are often apart.</p>

<p>In the short run prices follow behaviour; in the long run they walk towards value, because in the end what a business earns is what reaches its shareholders. The distance between the two is the opportunity, and measuring that distance is the work of stage 3.</p>

<h2>Check yourself</h2>

${mount("sd-quiz")}
`,
  blocks: {
    "sd-callouts": {
      kind: "figure",
      shape: "callouts",
      title: { bn: "একটা অর্ডার বই, আর দাম কোথা থেকে আসে", en: "An order book, and where the price comes from" },
      screen: {
        title: { bn: "কোম্পানি খ, সর্বশেষ ১১২.৩০", en: "Company B, last 112.30" },
        rows: [
          { label: { bn: "বিক্রেতা", en: "Seller" }, value: { bn: "১১৪.০০ × ৮,০০০", en: "114.00 x 8,000" } },
          { label: { bn: "বিক্রেতা", en: "Seller" }, value: { bn: "১১৩.২০ × ১,৫০০", en: "113.20 x 1,500" } },
          { label: { bn: "বিক্রেতা", en: "Seller" }, value: { bn: "১১২.৫০ × ২০০", en: "112.50 x 200" } },
          { label: { bn: "ক্রেতা", en: "Buyer" }, value: { bn: "১১২.১০ × ৬০০", en: "112.10 x 600" } },
          { label: { bn: "ক্রেতা", en: "Buyer" }, value: { bn: "১১১.৫০ × ৪,০০০", en: "111.50 x 4,000" } },
        ],
      },
      parts: [
        {
          at: 2,
          text: { bn: "এখানেই আপনি কিনবেন", en: "This is where you buy" },
          note: { bn: "মাত্র ২০০টা শেয়ার আছে এই দামে। ১,০০০ কিনতে চাইলে বাকিটা ১১৩.২০ আর ১১৪.০০ থেকে আসবে।", en: "Only 200 shares at this price. To buy 1,000 the rest comes from 113.20 and 114.00." },
          tone: "warn",
        },
        {
          at: 3,
          text: { bn: "এখানেই আপনি বেচবেন", en: "This is where you sell" },
          note: { bn: "সর্বশেষ দাম ১১২.৩০ হলেও এখন বেচলে পাবেন ১১২.১০।", en: "The last price says 112.30 and selling now gets you 112.10." },
        },
        {
          at: 0,
          text: { bn: "এই দামটা যদি ভরাট হয়, নতুন সর্বশেষ দাম ১১৪", en: "If this level fills, the new last price is 114" },
          note: { bn: "কোম্পানির কিছু না ঘটেই দাম দেড় শতাংশ উপরে, কেবল একজন ক্রেতা তাড়াহুড়ো করায়।", en: "A one and a half percent move with nothing happening at the company, because one buyer was in a hurry." },
          tone: "bad",
        },
      ],
      caption: {
        bn: "সর্বশেষ দাম একটা ইতিহাস। বর্তমান হলো সবচেয়ে দামি ক্রেতা আর সবচেয়ে সস্তা বিক্রেতার মাঝখানের ফাঁকটা।",
        en: "The last price is history. The present is the gap between the highest bidder and the cheapest seller.",
      },
    },
    "sd-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "খবর থেকে দাম, তিন ধাপে", en: "From news to price, in three steps" },
      parts: [
        { text: { bn: "খবর আসে", en: "News arrives" }, note: { bn: "ফলাফল, নীতি, গুজব, বা কিছুই না", en: "Results, policy, a rumour, or nothing at all" } },
        { text: { bn: "মানুষ অর্ডার বদলায়", en: "People change their orders" }, note: { bn: "কেউ দাম বাড়ায়, কেউ অর্ডার তুলে নেয়", en: "Some raise their price, some withdraw" }, tone: "lead" },
        { text: { bn: "অর্ডার বই বদলায়", en: "The book changes" }, note: { bn: "এক দিকে জোগান কমে বা চাহিদা বাড়ে", en: "Supply thins or demand thickens on one side" } },
        { text: { bn: "দাম নড়ে", en: "The price moves" }, note: { bn: "এটাই ফলাফল, কারণ নয়", en: "This is the result, not the cause" }, tone: "good" },
      ],
      caption: {
        bn: "মাঝখানের ধাপটাই সব ব্যাখ্যা করে। খবরটা কী তা নয়, মানুষ ওই খবরে কী করবে তা দাম ঠিক করে।",
        en: "The middle step explains everything. The price is set not by what the news is but by what people do about it.",
      },
    },
    "sd-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "কোনো খবর ছাড়াই একটা শেয়ারের দাম এক দিনে ৭% বেড়েছে, আর লেনদেনের পরিমাণ স্বাভাবিকের চার গুণ। সবচেয়ে সম্ভাব্য ব্যাখ্যা কী?",
            en: "A share rose 7% in a day with no news and four times the usual turnover. What is the likeliest explanation?",
          },
          options: [
            {
              text: { bn: "কোম্পানিটার সম্পর্কে কেউ কিছু জানে যা এখনো প্রকাশ হয়নি", en: "Somebody knows something not yet public" },
              why: {
                bn: "সম্ভব, আর এটা সাধারণত প্রথম ব্যাখ্যা নয়। পাতলা শেয়ারে একটা বড় ক্রেতাই এই কাজটা করতে পারেন, কোনো তথ্য ছাড়াই। ব্যাখ্যাটা যাচাই করার জায়গা হলো ডিএসইর মূল্য-সংবেদনশীল তথ্যের পাতা।",
                en: "Possible, and rarely the first explanation. In a thin share one large buyer does this without any information at all. The place to check is DSE's price sensitive information page.",
              },
            },
            {
              text: { bn: "একজন বড় ক্রেতা পাতলা অর্ডার বই খেয়ে ফেলেছেন", en: "One large buyer ate through a thin order book" },
              right: true,
              why: {
                bn: "ঠিক, আর লেনদেন চার গুণ হওয়াটাই এর সবচেয়ে বড় ইঙ্গিত। এটাকে বলে মার্কেট ইমপ্যাক্ট, আর এটা তথ্য নয়। ওই ক্রেতা থামলে দাম প্রায়ই ফিরে আসে, তাই এই দিনে কেনাটা সাধারণত সবচেয়ে খারাপ সময়ে কেনা।",
                en: "Right, and turnover at four times normal is the biggest hint. It is called market impact and it is not information. When the buyer stops the price often returns, so buying into that day is usually buying at the worst moment.",
              },
            },
            {
              text: { bn: "কোম্পানিটার মূল্য একদিনে ৭% বেড়েছে", en: "The company became 7% more valuable in a day" },
              why: {
                bn: "একটা ব্যবসার মূল্য একদিনে ৭% বাড়া প্রায় অসম্ভব, কোনো বড় ঘটনা ছাড়া। দাম আর মূল্য আলাদা, আর এই ফাঁকটাই এই লেখার শেষ কথা।",
                en: "A business becoming 7% more valuable in one day, with no event, is close to impossible. Price and value are different things, which is this lesson's closing point.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কেন এই লেখাটা বলছে যে বেচার আগে কেনার লোকটার কথা ভাবা উচিত?",
            en: "Why does this lesson say to think about the person on the other side of your trade?",
          },
          options: [
            {
              text: { bn: "কারণ তিনি সবসময় আপনার চেয়ে বেশি জানেন", en: "Because they always know more than you" },
              why: {
                bn: "সবসময় না, আর প্রায়ই তার সময়সীমা বা প্রয়োজন আলাদা, যা নিরীহ। প্রশ্নটা তাকে ভয় পাওয়ার জন্য না, নিজের যুক্তিটা পরীক্ষা করার জন্য।",
                en: "Not always, and often their horizon or their need simply differs, which is harmless. The question is not to fear them, it is to test your own reasoning.",
              },
            },
            {
              text: { bn: "কারণ প্রশ্নটা আপনার নিজের যুক্তিকে পরীক্ষা করে", en: "Because the question tests your own reasoning" },
              right: true,
              why: {
                bn: "ঠিক। যদি আপনার একমাত্র কারণ হয় দাম বাড়ছে, তাহলে অন্য পাশের মানুষটার প্রশ্নটার কোনো উত্তর আপনার কাছে নেই। যদি কারণটা হয় কোম্পানির আয় বাড়ছে আর বাজার সেটা এখনো ধরেনি, তাহলে একটা উত্তর আছে, আর সেটা যাচাইযোগ্য।",
                en: "Right. If your only reason is that the price is rising, you have no answer to the question. If your reason is that earnings are growing and the market has not caught up, you have an answer, and it is testable.",
              },
            },
            {
              text: { bn: "কারণ প্রতিটা লেনদেনে একজন জেতে আর একজন হারে", en: "Because one side wins and one loses in every trade" },
              why: {
                bn: "এতটা সরল নয়। দুইজনের সময়সীমা আর উদ্দেশ্য আলাদা হলে দুইজনেই তাদের নিজের লক্ষ্য অনুযায়ী ঠিক করতে পারেন। প্রশ্নটা জেতা-হারার নয়, কারণ জানার।",
                en: "Not that simple. With different horizons and purposes both sides can be right for their own goals. The question is not about winning, it is about knowing the reason.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"news-and-price": {
  bn: `
<p>একটা কোম্পানি রেকর্ড মুনাফার ঘোষণা দিল আর সেদিনই তার শেয়ারের দাম ৬% পড়ল। এটা বাজারের সবচেয়ে বিভ্রান্তিকর ঘটনা, আর এর ব্যাখ্যাটা একবার বুঝলে খবর পড়ার পুরো ধরনটাই বদলে যায়।</p>

<p>ব্যাখ্যাটা এই: <strong>বাজার খবরটা কেনে না, খবরটা আর যা আশা করা হয়েছিল তার পার্থক্যটা কেনে।</strong> আশার অংশটা আগেই দামে ঢুকে গেছে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>দামে ঢোকে বিস্ময়, খবর নয়।</li>
<li>প্রত্যাশা মানুষের মাথায় নয়, দামে থাকে, আর সেটা দেখা যায় না।</li>
<li>ভালো খবরেও দাম পড়ে যদি আরও ভালো আশা করা হয়ে থাকে।</li>
<li>গুজবে কিনে খবরে বেচা একটা প্রবাদ, আর যন্ত্রটা এটাই।</li>
<li>আপনি খবর পড়ার আগেই দাম নড়ে গেছে, আর তাতে সমস্যা নেই।</li>
</ul>
</div>

<h2>প্রত্যাশা কীভাবে দামে ঢোকে</h2>

${mount("news-figure")}

<p>ধরুন একটা কোম্পানির গত তিন প্রান্তিকে ইপিএস ছিল ২.১, ২.৩ আর ২.৫ টাকা। বিশ্লেষকরা চতুর্থ প্রান্তিকে ২.৮ আশা করছেন, আর সেই আশা নিয়েই মানুষ কিনছেন, তাই আজকের দামে ওই ২.৮ টাকা ইতিমধ্যেই ধরা আছে।</p>

<p>ফলাফল এল ২.৬ টাকা, যা গত প্রান্তিকের চেয়ে বেশি আর আশার চেয়ে কম। খবরের শিরোনাম হবে মুনাফা বেড়েছে, আর দাম পড়বে, কারণ যারা ২.৮ ধরে দাম দিয়েছিলেন তারা এখন সমন্বয় করছেন।</p>

<p>উল্টোটাও ঘটে আর ঠিক একই কারণে। একটা কোম্পানি লোকসানের ঘোষণা দিল, আর দাম ৯% বাড়ল, কারণ বাজার আরও বড় লোকসান আশা করেছিল।</p>

<h2>গুজবে কিনে খবরে বেচা</h2>

<p>এই প্রবাদটা বাজারে সবাই বলেন আর কম মানুষ ব্যাখ্যা করতে পারেন। যন্ত্রটা সরল।</p>

${mount("news-timeline")}

<p>যখন গুজব ছড়ায় যে একটা কোম্পানি বড় অর্ডার পেতে যাচ্ছে, কিছু মানুষ কেনেন আর দাম ধীরে ধীরে ওঠে। ঘোষণার দিন পর্যন্ত ওই সম্ভাবনার প্রায় পুরোটাই দামে ঢুকে যায়। তারপর ঘোষণাটা এল, আর যারা আগে কিনেছিলেন তাদের কাছে আর কিছু পাওয়ার নেই, তাই তারা বেচেন। দাম পড়ে যায় ঠিক সেই দিনে যেদিন খবরটা সবচেয়ে ভালো।</p>

<div class="ex"><b>উদাহরণ:</b> বাংলাদেশে এই প্যাটার্নটা আইপিওতে সবচেয়ে স্পষ্ট। তালিকাভুক্তির আগে উত্তেজনা তৈরি হয়, প্রথম দিনে দাম অনেক উপরে খোলে, আর তারপর সপ্তাহ ধরে নামতে থাকে। যারা লটারিতে পেয়েছিলেন তারা বেচছেন, আর যারা প্রথম দিনে উত্তেজনায় কিনেছিলেন তারা ধরা পড়েছেন।</div>

<h2>আপনি সবসময় দেরিতে</h2>

<p>এটা মেনে নেওয়া দরকার, আর মেনে নিলে অনেক দুশ্চিন্তা কমে। যখন আপনি পত্রিকায় বা ফেসবুকে একটা খবর পড়ছেন, দামটা ইতিমধ্যেই সেটা প্রতিফলিত করে ফেলেছে। প্রতিষ্ঠানের ডিলিং রুমে খবরটা সেকেন্ডে পৌঁছায়; আপনার কাছে ঘণ্টায়।</p>

<p>এর একটা মুক্তিদায়ক ফল আছে: <strong>খবরের ভিত্তিতে দ্রুত কেনাবেচা করার প্রতিযোগিতায় আপনি জিততে পারবেন না, আর জেতার দরকারও নেই।</strong> আপনার সুবিধা গতিতে নয়, সময়ে। একজন প্রতিষ্ঠানিক ব্যবস্থাপককে প্রতি প্রান্তিকে ফল দেখাতে হয়; আপনাকে হয় না। পাঁচ বছরের প্রশ্নের উত্তর খোঁজায় আপনার প্রতিযোগী অনেক কম।</p>

<h2>কোন খবরগুলো আসলে গুরুত্বপূর্ণ</h2>

<ul class="checklist">
<li><strong>মূল্য-সংবেদনশীল তথ্য, ডিএসইর নিজের পাতায়।</strong> এটাই একমাত্র সরকারি উৎস, আর কোম্পানি আইনত এখানে জানাতে বাধ্য। ফেসবুকের আগে এখানে দেখুন।</li>
<li><strong>ত্রৈমাসিক আর বার্ষিক ফলাফল।</strong> প্রকৃত সংখ্যা, প্রকৃত পরিবর্তন। বাকি সব খবরের চেয়ে এটার ওজন বেশি।</li>
<li><strong>নিয়ন্ত্রকের সিদ্ধান্ত।</strong> সুদের হার, কর, খাতভিত্তিক নীতি। এগুলো একসঙ্গে অনেক কোম্পানিকে নাড়ায়।</li>
<li><strong>ব্যবস্থাপনার পরিবর্তন আর নিরীক্ষকের মন্তব্য।</strong> কম আলোচিত আর প্রায়ই সবচেয়ে তথ্যবহুল।</li>
</ul>

<div class="note">যা গুরুত্বপূর্ণ নয়: দৈনিক দামের গতিবিধি নিয়ে লেখা, বিশেষজ্ঞদের দৈনিক পূর্বাভাস, আর হোয়াটসঅ্যাপের যেকোনো কিছু। এগুলো তথ্য নয়, আওয়াজ, আর এগুলো পড়ার প্রধান ফল হলো অপ্রয়োজনীয় লেনদেন।</div>

<h2>নিজে যাচাই করুন</h2>

${mount("news-quiz")}
`,
  en: `
<p>A company announces record profits and its share falls 6% the same day. It is the most confusing thing the market does, and once the explanation lands, the whole way you read news changes.</p>

<p>The explanation is this: <strong>the market does not buy the news, it buys the gap between the news and what was expected.</strong> The expected part was already in the price.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Surprise moves prices, news does not.</li>
<li>Expectations do not sit in people's heads, they sit in the price, invisibly.</li>
<li>Good news can drop a price if better news was expected.</li>
<li>Buy the rumour, sell the news is a proverb, and this is the mechanism.</li>
<li>The price moved before you read the story, and that is fine.</li>
</ul>
</div>

<h2>How expectations get into a price</h2>

${mount("news-figure")}

<p>Suppose a company's last three quarters showed EPS of 2.1, 2.3 and 2.5. Analysts expect 2.8 for the fourth, and people buy on that expectation, so today's price already contains the 2.8.</p>

<p>The result comes in at 2.6, higher than last quarter and lower than expected. The headline reads profits up, and the price falls, because the people who paid for 2.8 are adjusting.</p>

<p>The reverse happens for exactly the same reason. A company announces a loss and the price rises 9%, because the market feared a larger one.</p>

<h2>Buy the rumour, sell the news</h2>

<p>Everyone in the market says it and few can explain it. The mechanism is simple.</p>

${mount("news-timeline")}

<p>When a rumour spreads that a company is about to win a large order, some people buy and the price drifts up. By announcement day most of that possibility is already in the price. Then the announcement arrives, and the early buyers have nothing left to gain, so they sell. The price falls on the day the news is best.</p>

<div class="ex"><b>Example:</b> The pattern is clearest in IPOs here. Excitement builds before listing, the first day opens far above the issue price, and it drifts down for weeks afterwards. The allottees are selling, and the people who bought in the excitement of day one are the ones holding it.</div>

<h2>You are always late</h2>

<p>This is worth accepting, and accepting it removes a lot of anxiety. By the time you read a story in a paper or on Facebook, the price already reflects it. News reaches an institutional dealing room in seconds; it reaches you in hours.</p>

<p>There is a liberating consequence: <strong>you cannot win the race to trade on news, and you do not need to.</strong> Your advantage is not speed, it is time. An institutional manager has to show results every quarter; you do not. In the business of answering five year questions you have far fewer competitors.</p>

<h2>Which news actually matters</h2>

<ul class="checklist">
<li><strong>Price sensitive information, on DSE's own page.</strong> The only official source, and companies are legally obliged to file there. Look there before Facebook.</li>
<li><strong>Quarterly and annual results.</strong> Real numbers, real change. They outweigh every other kind of news.</li>
<li><strong>Regulatory decisions.</strong> Rates, taxes, sector policy. These move many companies at once.</li>
<li><strong>Management changes and auditor comments.</strong> Less discussed and often the most informative.</li>
</ul>

<div class="note">What does not matter: daily price commentary, daily expert predictions, and anything at all on WhatsApp. It is noise rather than information, and the main effect of reading it is trades you did not need to make.</div>

<h2>Check yourself</h2>

${mount("news-quiz")}
`,
  blocks: {
    "news-figure": {
      kind: "figure",
      shape: "matrix",
      title: { bn: "খবর আর প্রত্যাশা", en: "News against expectation" },
      axes: {
        x: [{ bn: "খবর খারাপ", en: "The news is bad" }, { bn: "খবর ভালো", en: "The news is good" }],
        y: [{ bn: "প্রত্যাশা ছিল কম", en: "Expectation was low" }, { bn: "প্রত্যাশা ছিল বেশি", en: "Expectation was high" }],
      },
      parts: [
        {
          text: { bn: "দাম পড়ে, অনেকটা", en: "The price falls, hard" },
          note: { bn: "আশা ছিল বেশি আর ফল খারাপ। সবচেয়ে বড় পতন এখানেই হয়।", en: "High hopes, bad result. The largest falls live here." },
          tone: "bad",
        },
        {
          text: { bn: "দাম প্রায় নড়ে না", en: "The price barely moves" },
          note: { bn: "ভালো খবর, আর ঠিক ততটাই ভালো যতটা আশা ছিল। বিস্ময় নেই।", en: "Good news, exactly as good as expected. No surprise." },
          tone: "plain",
        },
        {
          text: { bn: "দাম প্রায় নড়ে না", en: "The price barely moves" },
          note: { bn: "খারাপ খবর, আর সেটাই আশা করা হয়েছিল। আগেই দামে ছিল।", en: "Bad news that was expected. It was already in the price." },
          tone: "plain",
        },
        {
          text: { bn: "দাম বাড়ে, অনেকটা", en: "The price rises, hard" },
          note: { bn: "কেউ কিছু আশা করেনি আর ফল ভালো এল। সবচেয়ে বড় উত্থান এখানে।", en: "Nobody expected anything and the result was good. The largest rises live here." },
          tone: "good",
        },
      ],
      caption: {
        bn: "দাম নড়ে ওপরের বাঁ আর নিচের ডান ঘরে। মাঝের দুইটায় খবর থাকে আর বিস্ময় থাকে না।",
        en: "Prices move in the top left and bottom right. The other two have news in them and no surprise.",
      },
    },
    "news-timeline": {
      kind: "figure",
      shape: "timeline",
      title: { bn: "গুজব থেকে ঘোষণা", en: "From rumour to announcement" },
      parts: [
        { text: { bn: "কেউ কিছু শোনে, দাম ধীরে উঠতে শুরু করে", en: "Somebody hears something and the price starts drifting up" }, note: { bn: "ছয় সপ্তাহ আগে", en: "Six weeks before" } },
        { text: { bn: "গুজব ছড়ায়, লেনদেন বাড়ে, দাম আরও ওঠে", en: "The rumour spreads, turnover rises, the price climbs" }, note: { bn: "তিন সপ্তাহ আগে", en: "Three weeks before" }, tone: "warn" },
        { text: { bn: "সম্ভাবনার প্রায় পুরোটাই এখন দামে", en: "Nearly the whole possibility is now in the price" }, note: { bn: "এক সপ্তাহ আগে", en: "A week before" }, tone: "warn" },
        { text: { bn: "ঘোষণা আসে, আর আগে কেনা মানুষেরা বেচেন", en: "The announcement lands, and the early buyers sell" }, note: { bn: "ঘোষণার দিন", en: "The day itself" }, tone: "bad" },
        { text: { bn: "দাম পড়ে, ঠিক সবচেয়ে ভালো খবরের দিনে", en: "The price falls, on the day the news is best" }, note: { bn: "একই দিন", en: "Same day" }, tone: "bad" },
      ],
      caption: {
        bn: "যিনি ঘোষণার দিন খবর পড়ে কেনেন, তিনি ছয় সপ্তাহের উত্থানটা কিনছেন, ঘটনাটা নয়।",
        en: "Somebody buying on the announcement is buying six weeks of rise, not the event.",
      },
    },
    "news-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানি ৪০% মুনাফা বৃদ্ধির ঘোষণা দিল আর দাম ৫% পড়ল। কী ঘটেছে?",
            en: "A company announces a 40% rise in profit and the price falls 5%. What happened?",
          },
          options: [
            {
              text: { bn: "বাজার অযৌক্তিক আচরণ করছে", en: "The market is behaving irrationally" },
              why: {
                bn: "প্রায় সবসময় এটা ভুল ব্যাখ্যা। বাজার সম্ভবত ৫০% আশা করেছিল, আর ওই আশাটা আগের সপ্তাহগুলোতেই দামে ঢুকে গিয়েছিল।",
                en: "Nearly always the wrong reading. The market probably expected 50%, and that expectation went into the price over the preceding weeks.",
              },
            },
            {
              text: { bn: "বাজার এর চেয়ে বেশি আশা করেছিল, আর সেই আশা আগেই দামে ছিল", en: "More was expected, and the expectation was already in the price" },
              right: true,
              why: {
                bn: "ঠিক। যাচাই করার উপায় আছে: ঘোষণার আগের কয়েক সপ্তাহে দাম কী করেছিল দেখুন। যদি দাম আগেই অনেকটা উঠে থাকে, তাহলে ভালো খবরটা আগেই কেনা হয়ে গেছে।",
                en: "Right, and it is checkable: look at what the price did in the weeks before. If it had already climbed, the good news was bought in advance.",
              },
            },
            {
              text: { bn: "সংখ্যাটা মিথ্যা", en: "The number is fake" },
              why: {
                bn: "নিরীক্ষিত ফলাফলে সেটা বিরল, আর এই ঘটনার ব্যাখ্যায় সেটা লাগেও না। প্রত্যাশার ব্যাখ্যাটা সহজ আর যাচাইযোগ্য।",
                en: "Rare in audited results, and not needed to explain this. The expectations explanation is simpler and testable.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একজন ছোট বিনিয়োগকারীর আসল সুবিধা কোনটা?",
            en: "What is a small investor's actual advantage?",
          },
          options: [
            {
              text: { bn: "দ্রুত খবর পাওয়া", en: "Getting news quickly" },
              why: {
                bn: "এই প্রতিযোগিতায় আপনি কখনোই জিতবেন না। প্রতিষ্ঠানের কাছে খবর সেকেন্ডে পৌঁছায় আর তাদের ব্যবস্থা স্বয়ংক্রিয়ভাবে সাড়া দেয়।",
                en: "A race you will never win. Institutions get news in seconds and their systems respond automatically.",
              },
            },
            {
              text: { bn: "অপেক্ষা করতে পারা, কারণ কারো কাছে ত্রৈমাসিক জবাবদিহি নেই", en: "Being able to wait, with no quarterly report to anybody" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই একমাত্র সুবিধা যা আপনার। ফান্ড ম্যানেজারকে প্রতি প্রান্তিকে ফল দেখাতে হয়, তাই তিনি পাঁচ বছরের যুক্তিতে বিনিয়োগ করতে পারেন না যদি তিন বছর খারাপ যায়। আপনি পারেন, যদি টাকাটা সত্যিই দীর্ঘমেয়াদি হয়।",
                en: "Right, and it is the only advantage that is genuinely yours. A fund manager has to show results quarterly, so they cannot ride a five year thesis through three bad years. You can, provided the money is truly long term.",
              },
            },
            {
              text: { bn: "ছোট অঙ্ক, তাই কম ঝুঁকি", en: "Small amounts, so less risk" },
              why: {
                bn: "অঙ্ক ছোট হলে ক্ষতিও ছোট, কিন্তু শতাংশে ঝুঁকি একই। এটা সুবিধা নয়, স্কেল।",
                en: "A smaller amount means a smaller loss and the same risk in percentage terms. That is scale, not an advantage.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"interest-and-taka": {
  bn: `
<p>দুইটা সংখ্যা বাংলাদেশের প্রায় প্রতিটা কোম্পানির মুনাফাকে ছুঁয়ে যায়: সুদের হার, আর ডলারের বিপরীতে টাকার দাম। এই লেখাটা দেখায় কীভাবে, আর কোন খাত কোন দিকে যায়।</p>

<p>দুইটাই ঠিক করে বা প্রভাবিত করে <a class="term" href="/money/basics-2/bangladesh-bank.html">বাংলাদেশ ব্যাংক</a>, আর এইজন্যই কেন্দ্রীয় ব্যাংকের ঘোষণার দিনে বাজার নড়ে। এটা একটা যান্ত্রিক সম্পর্ক, রহস্য নয়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>সুদ বাড়লে শেয়ারের দাম দুই দিক থেকে চাপে পড়ে: বিকল্প আর সুদ খরচ।</li>
<li>ডলার বাড়লে আমদানিনির্ভর কোম্পানির মার্জিন কমে আর রপ্তানিকারকের আয় বাড়ে।</li>
<li>বাংলাদেশ অনেক কিছু আমদানি করে, তাই ডলারের দাম মূল্যস্ফীতিতেও যায়।</li>
<li>সব শেয়ার একই দিকে যায় না, আর সেটাই ছড়ানোর সুযোগ।</li>
<li>যে কোম্পানির ঋণ বেশি, সুদের হার তার জন্য দ্বিগুণ গুরুত্বপূর্ণ।</li>
</ul>
</div>

<h2>সুদের হার বাড়লে কী হয়</h2>

${mount("rates-lab")}

<p>দুইটা আলাদা পথে চাপটা আসে, আর দুইটা একসাথে কাজ করে।</p>

<p>প্রথম পথ: বিকল্প আকর্ষণীয় হয়ে যায়। <a class="term" href="/money/terms/treasury-bill.html">ট্রেজারি বিলে</a> যদি ৬% থেকে ১১% এ যায়, তাহলে ঝুঁকি নিয়ে শেয়ার ধরে রাখার যুক্তি দুর্বল হয়। মানুষ শেয়ার বেচে নিরাপদ জায়গায় যায়, আর দাম পড়ে। একই কারণে যুক্তিসঙ্গত <a class="term" href="/money/terms/pe-ratio.html">পিই</a> নেমে আসে।</p>

<p>দ্বিতীয় পথ: কোম্পানির সুদ খরচ বাড়ে। যে কোম্পানির ৩০০ কোটি টাকার ঋণ আছে, সুদ ২% বাড়লে তার বছরে ৬ কোটি টাকা বাড়তি খরচ, যা সরাসরি মুনাফা থেকে যায়। কোম্পানির লাভ যদি ৬০ কোটি হয়, সেটা ১০% কমে গেল, ব্যবসার কিছু না বদলেই।</p>

<h2>টাকার দাম কমলে কার কী</h2>

${mount("taka-lab")}

<p>এখানে সবাই একই দিকে যায় না, আর এটাই এই লেখার সবচেয়ে কাজের অংশ।</p>

<p>যে কোম্পানি ডলারে বিক্রি করে আর টাকায় খরচ দেয়, তার আয় বাড়ে। তৈরি পোশাক, চামড়া, ওষুধ রপ্তানি, আইটি সেবা, এই খাতগুলো এই দিকে।</p>

<p>যে কোম্পানি ডলারে কেনে আর টাকায় বেচে, তার খরচ বাড়ে আর দাম বাড়ানোর সুযোগ সীমিত। সিমেন্ট, ইস্পাত, জ্বালানি, ভোজ্যতেল, ওষুধের কাঁচামাল, এই খাতগুলো ওই দিকে।</p>

${mount("taka-figure")}

<div class="ex"><b>উদাহরণ:</b> ২০২২ থেকে ২০২৪ সালে টাকার দাম ডলারের বিপরীতে অনেকটা কমেছে। এই সময়ে রপ্তানিকারকদের টাকায় আয় বেড়েছে আর আমদানিনির্ভর উৎপাদকদের মার্জিন চেপে গেছে। একই ঘটনা, দুই দিকে দুই ফল। আপনার পোর্টফোলিওতে যদি দুই দিকেরই কোম্পানি থাকে, ধাক্কাটা অনেকটা কাটাকাটি হয়ে যায়, আর সেটাই <a class="term" href="/money/terms/diversification.html">ছড়ানোর</a> একটা বাস্তব রূপ।</div>

<h2>ব্যাংক আর বিমার ক্ষেত্রে আলাদা</h2>

<p>একটা ব্যতিক্রম জেনে রাখা দরকার, কারণ ডিএসইর বড় অংশ ব্যাংক আর বিমা।</p>

<p>ব্যাংকের ব্যবসাই হলো সুদ: কম সুদে আমানত নেওয়া আর বেশি সুদে ঋণ দেওয়া। তাই সুদের হার বাড়া তার জন্য সরাসরি খারাপ খবর নয়, বরং প্রশ্নটা হলো আমানতের খরচ আর ঋণের আয়ের মধ্যে ফাঁকটা, যাকে বলে নিট সুদ মার্জিন, সেটা বাড়ছে না কমছে। কিছু ব্যাংক দ্রুত ঋণের সুদ বাড়াতে পারে আর আমানতের সুদ ধীরে বাড়ায়, তাই তাদের মার্জিন বাড়ে।</p>

<p>তবে দ্বিতীয় একটা প্রভাব আছে যা প্রায়ই প্রথমটাকে ছাড়িয়ে যায়: উঁচু সুদে ঋণগ্রহীতাদের কিস্তি দিতে কষ্ট হয়, তাই খেলাপি ঋণ বাড়ে। বাংলাদেশে খেলাপি ঋণ এমনিতেই একটা বড় সমস্যা, তাই সুদ বাড়ার চক্রে ব্যাংকের শেয়ার মিশ্র আচরণ করে। বীমা কোম্পানির ক্ষেত্রে উঁচু সুদ সাধারণত ভালো, কারণ তাদের জমা তহবিল বেশি আয় করে।</p>

<h2>দুইটা একসাথে চলে</h2>

<p>একটা জিনিস মনে রাখা দরকার: সুদের হার আর টাকার দাম আলাদা ঘটনা নয়, প্রায়ই একই ঘটনার দুই দিক।</p>

<p>টাকার দাম পড়লে আমদানি দামি হয়, তাই মূল্যস্ফীতি বাড়ে। মূল্যস্ফীতি ঠেকাতে বাংলাদেশ ব্যাংক সুদের হার বাড়ায়। উঁচু সুদ টাকাকে কিছুটা শক্তিশালী করে আর অর্থনীতিকে ধীর করে। তাই খবরে যখন টাকার দাম পড়ার কথা পড়বেন, তার কয়েক মাসের মধ্যে সুদের হার বাড়ার আলোচনা আশা করুন।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("rates-quiz")}
`,
  en: `
<p>Two numbers touch the profit of nearly every company in Bangladesh: the interest rate, and the price of the taka against the dollar. This lesson shows how, and which sectors move which way.</p>

<p>Both are set or influenced by <a class="term" href="/money/basics-2/bangladesh-bank.html">Bangladesh Bank</a>, which is why the market moves on a central bank announcement. It is a mechanical relationship, not a mystery.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Rising rates squeeze share prices twice: through the alternative and through interest costs.</li>
<li>A rising dollar squeezes importers' margins and lifts exporters' revenue.</li>
<li>Bangladesh imports a great deal, so the dollar reaches inflation too.</li>
<li>Not all shares move the same way, which is a real diversification opportunity.</li>
<li>For a company carrying debt, rates matter twice over.</li>
</ul>
</div>

<h2>What a rate rise does</h2>

${mount("rates-lab")}

<p>The pressure arrives along two separate paths, and they work together.</p>

<p>The first: the alternative gets attractive. If <a class="term" href="/money/terms/treasury-bill.html">treasury bills</a> go from 6% to 11%, the case for holding risky shares weakens. People sell shares for safety and the price falls. For the same reason a reasonable <a class="term" href="/money/terms/pe-ratio.html">P/E</a> comes down.</p>

<p>The second: the company's interest bill rises. A company with 300 crore of debt paying 2% more owes an extra 6 crore a year, straight out of profit. If profit was 60 crore, that is a 10% cut with nothing about the business changing.</p>

<h2>Who wins and loses when the taka weakens</h2>

${mount("taka-lab")}

<p>Not everybody moves the same way here, and that is the most useful part of this lesson.</p>

<p>A company selling in dollars and paying costs in taka sees its revenue rise. Ready-made garments, leather, pharmaceutical exports and IT services sit on this side.</p>

<p>A company buying in dollars and selling in taka sees costs rise with limited room to raise prices. Cement, steel, fuel, edible oil and pharmaceutical raw materials sit on that side.</p>

${mount("taka-figure")}

<div class="ex"><b>Example:</b> Between 2022 and 2024 the taka fell substantially against the dollar. Exporters' taka revenue rose over that period while import-dependent producers had their margins squeezed. One event, two opposite results. A portfolio holding both sides absorbs much of the shock, which is a practical form of <a class="term" href="/money/terms/diversification.html">diversification</a>.</div>

<h2>Banks and insurers are different</h2>

<p>One exception is worth knowing, because banks and insurers are a large part of DSE.</p>

<p>Interest is a bank's business: taking deposits cheaply and lending dearly. So a rate rise is not straightforwardly bad news for one; the question is whether the gap between the cost of deposits and the income from loans, the net interest margin, is widening or narrowing. Some banks can reprice loans quickly and deposits slowly, so their margin widens.</p>

<p>There is a second effect that often outweighs the first: at higher rates borrowers struggle with instalments, so bad loans rise. Bad loans are already a large problem in Bangladesh, so bank shares behave inconsistently through a tightening cycle. For insurers, higher rates are usually good, because their invested float earns more.</p>

<h2>The two travel together</h2>

<p>One thing worth remembering: interest rates and the exchange rate are not separate events, they are usually two faces of one.</p>

<p>When the taka falls, imports get dearer and inflation rises. To fight inflation, Bangladesh Bank raises rates. Higher rates support the taka somewhat and slow the economy. So when you read that the taka has weakened, expect a discussion about rate rises within a few months.</p>

<h2>Check yourself</h2>

${mount("rates-quiz")}
`,
  blocks: {
    "rates-lab": {
      kind: "lab",
      model: "rates",
      title: { bn: "সুদ বাড়লে দুই দিকে কী হয়", en: "What a rate rise does, on both sides" },
      note: {
        bn: "ঋণের অঙ্ক বাড়িয়ে দেখুন। ঋণে চলা কোম্পানির জন্য দ্বিতীয় ধাক্কাটা কত বড় লক্ষ করুন।",
        en: "Raise the debt and see how large the second blow is for a leveraged company.",
      },
      preset: { rate: 9, change: 2, pe: 14, debt: 300, profit: 60 },
    },
    "taka-lab": {
      kind: "lab",
      model: "taka",
      title: { bn: "ডলার বাড়লে মুনাফার কী হয়", en: "What a rising dollar does to profit" },
      note: {
        bn: "রপ্তানির অংশটা শূন্য থেকে ৮০ শতাংশে নিয়ে দেখুন, ফলাফল উল্টে যায়।",
        en: "Take the export share from zero to eighty percent and watch the answer flip.",
      },
      preset: { sales: 400, imported: 60, costs: 78, move: 10, exports: 0 },
    },
    "taka-figure": {
      kind: "figure",
      shape: "scale",
      title: { bn: "টাকার দাম কমলে", en: "When the taka weakens" },
      parts: [
        {
          text: { bn: "রপ্তানিকারক", en: "Exporters" },
          note: { bn: "ডলারে বিক্রি, টাকায় খরচ। পোশাক, চামড়া, আইটি সেবা।", en: "Selling in dollars, paying in taka. Garments, leather, IT services." },
          value: 7,
          tone: "good",
        },
        {
          text: { bn: "আমদানিনির্ভর উৎপাদক", en: "Import-dependent producers" },
          note: { bn: "ডলারে কেনা, টাকায় বেচা। সিমেন্ট, ইস্পাত, জ্বালানি, ভোজ্যতেল।", en: "Buying in dollars, selling in taka. Cement, steel, fuel, edible oil." },
          value: 3,
          tone: "bad",
        },
      ],
      caption: {
        bn: "একই ঘটনা দুই দিকে দুই ফল দেয়, আর এইজন্যই পোর্টফোলিওতে দুই দিকের কোম্পানি রাখলে এই ধাক্কাটা অনেকটা কাটাকাটি হয়।",
        en: "One event, two opposite outcomes, which is why holding both sides cancels much of the shock.",
      },
    },
    "rates-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "বাংলাদেশ ব্যাংক নীতি সুদহার ২% বাড়াল। কোন কোম্পানিটা সবচেয়ে বেশি ক্ষতিগ্রস্ত হবে?",
            en: "Bangladesh Bank raises the policy rate by 2%. Which company suffers most?",
          },
          options: [
            {
              text: { bn: "যার কোনো ঋণ নেই আর নগদ জমা আছে", en: "One with no debt and cash in the bank" },
              why: {
                bn: "উল্টো, এই কোম্পানি বরং কিছুটা লাভবান: তার জমা টাকায় বেশি সুদ আসবে। উঁচু সুদ ঋণহীন কোম্পানিকে তুলনামূলকভাবে শক্তিশালী করে।",
                en: "The opposite: this one gains a little, since its deposits earn more. High rates make a debt-free company relatively stronger.",
              },
            },
            {
              text: { bn: "যার মুনাফার তুলনায় বড় ঋণ আছে", en: "One with large debt relative to its profit" },
              right: true,
              why: {
                bn: "ঠিক। উপরের হিসাবে ঋণটা বাড়িয়ে দেখুন: মুনাফায় কোপটা দ্রুত বড় হয়। আর দ্বিতীয় ধাক্কাটাও আসে, কারণ উঁচু সুদে বাজার তার শেয়ারের জন্য কম পিই দিতে রাজি হয়।",
                en: "Right. Raise the debt in the calculator above and the hit to profit grows fast. And the second blow lands too, because at higher rates the market pays a lower P/E.",
              },
            },
            {
              text: { bn: "রপ্তানিকারক", en: "An exporter" },
              why: {
                bn: "রপ্তানিকারকের প্রধান চিন্তা বিনিময় হার, সুদের হার নয়, যদি না তার ঋণ বেশি থাকে। দুইটা আলাদা প্রশ্ন।",
                en: "An exporter's main concern is the exchange rate rather than interest, unless it carries heavy debt. Two different questions.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "টাকার দাম ডলারের বিপরীতে ১২% কমল। একটা সিমেন্ট কোম্পানির কী হবে?",
            en: "The taka falls 12% against the dollar. What happens to a cement company?",
          },
          options: [
            {
              text: { bn: "লাভ বাড়বে, কারণ দেশে চাহিদা আছে", en: "Profits rise, because domestic demand is there" },
              why: {
                bn: "চাহিদা থাকা আর মার্জিন থাকা এক জিনিস না। সিমেন্টের ক্লিংকার আর জ্বালানির বড় অংশ আমদানি করা, তাই খরচ টাকায় বেড়ে যায় যখন দাম টাকাতেই থাকে।",
                en: "Demand and margin are different things. Clinker and much of the fuel are imported, so costs rise in taka while the selling price stays in taka.",
              },
            },
            {
              text: { bn: "মার্জিন চাপে পড়বে, কারণ কাঁচামাল আমদানি করা", en: "The margin gets squeezed, because the inputs are imported" },
              right: true,
              why: {
                bn: "ঠিক। উপরের হিসাবে রপ্তানির অংশ শূন্য রেখে আমদানির অংশ বাড়িয়ে দেখুন। কোম্পানিটা দাম বাড়াতে পারলে কিছুটা সামলাবে, আর প্রতিযোগিতামূলক বাজারে সেটা কঠিন।",
                en: "Right. In the calculator above, keep exports at zero and raise the imported share. If the company can raise prices it copes somewhat, and in a competitive market that is hard.",
              },
            },
            {
              text: { bn: "কিছুই হবে না, সিমেন্ট দেশি পণ্য", en: "Nothing: cement is a domestic product" },
              why: {
                bn: "পণ্যটা দেশি আর কাঁচামালটা নয়, আর সেটাই মূল কথা। কোম্পানি কোথায় বেচে তার চেয়ে কোথা থেকে কেনে সেটা এখানে বেশি গুরুত্বপূর্ণ।",
                en: "The product is domestic and the inputs are not, which is the point. Where a company buys matters more here than where it sells.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"war-and-shocks": {
  bn: `
<p>২০২২ সালের ফেব্রুয়ারিতে ইউক্রেনে যুদ্ধ শুরু হলো। ছয় মাসের মধ্যে ঢাকার একটা বেকারির আটার খরচ বেড়ে গেল, একটা সিমেন্ট কারখানার জ্বালানি বিল বাড়ল, আর ডিএসইতে বহু কোম্পানির মার্জিন চেপে গেল। এই লেখাটা ওই শৃঙ্খলটা নিয়ে।</p>

<p>দূরের একটা ঘটনা আপনার পোর্টফোলিওতে পৌঁছায় নির্দিষ্ট পথে, আর পথগুলো গোনা যায়। এটা রহস্য নয়, একটা মানচিত্র, আর মানচিত্রটা জানা থাকলে খবর দেখে আতঙ্কিত না হয়ে প্রশ্ন করা যায়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ধাক্কা পৌঁছায় চারটা পথে: পণ্যের দাম, ডলার, চাহিদা, আর টাকার প্রবাহ।</li>
<li>বাংলাদেশের জন্য সবচেয়ে বড় পথ পণ্যের দাম, কারণ জ্বালানি আর খাদ্য আমদানি হয়।</li>
<li>দ্বিতীয় বড় পথ রপ্তানির চাহিদা: ইউরোপে মন্দা মানে পোশাকের অর্ডার কম।</li>
<li>প্রতিটা ধাক্কায় কিছু খাত জেতে আর কিছু হারে, কখনো সবাই হারে না।</li>
<li>বেশিরভাগ ধাক্কার প্রভাব প্রথম প্রতিক্রিয়ার চেয়ে ছোট আর দীর্ঘস্থায়ী।</li>
</ul>
</div>

<h2>চারটা পথ</h2>

${mount("shock-flow")}

<p>প্রথম পথ পণ্যের দাম। বাংলাদেশ জ্বালানি, ভোজ্যতেল, গম, সার আর শিল্পের কাঁচামালের বড় অংশ আমদানি করে। বিশ্ববাজারে এগুলোর দাম বাড়লে প্রতিটা উৎপাদকের খরচ বাড়ে, আর দাম বাড়ানোর ক্ষমতা যাদের কম তাদের মার্জিন চেপে যায়।</p>

<p>দ্বিতীয় পথ ডলার। বৈশ্বিক অনিশ্চয়তায় বিনিয়োগকারীরা ডলারে ফেরেন, তাই উদীয়মান দেশগুলোর মুদ্রা দুর্বল হয়। টাকা দুর্বল হলে আমদানি আরও দামি হয়, আর প্রথম পথটার প্রভাব দ্বিগুণ হয়ে যায়।</p>

<p>তৃতীয় পথ চাহিদা। বাংলাদেশের রপ্তানির বড় অংশ যায় ইউরোপ আর যুক্তরাষ্ট্রে। ওখানে মন্দা হলে মানুষ কম পোশাক কেনে, তাই অর্ডার কমে, তাই কারখানা কম চলে, তাই কর্মসংস্থান আর আয় কমে।</p>

<p>চতুর্থ পথ টাকার প্রবাহ। বিদেশি বিনিয়োগকারীরা ঝুঁকি কমাতে চাইলে উদীয়মান বাজার থেকে টাকা তুলে নেন। বাংলাদেশে বিদেশি অংশগ্রহণ কম, তাই এই পথটা এখানে দুর্বল, আর ভারত বা ভিয়েতনামে অনেক শক্তিশালী।</p>

<h2>কে জেতে, কে হারে</h2>

${mount("shock-compare")}

<p>প্রতিটা বড় ধাক্কায় একটা পুনর্বণ্টন হয়। তেলের দাম বাড়লে জ্বালানি ও বিদ্যুৎ খাত জেতে আর পরিবহননির্ভর সবাই হারে। ডলার শক্তিশালী হলে রপ্তানিকারক জেতে আর আমদানিনির্ভর উৎপাদক হারে। খাদ্যের দাম বাড়লে কৃষিপণ্যের প্রক্রিয়াজাতকারী চাপে পড়ে আর কৃষি উপকরণের বিক্রেতা ভালো করে।</p>

<p>এই কথাটার একটা ব্যবহারিক ফল আছে: আতঙ্কে সবকিছু বেচে দেওয়া প্রায় সবসময় ভুল, কারণ আপনার পোর্টফোলিওর একটা অংশ সম্ভবত জিতছে।</p>

<h2>প্রথম প্রতিক্রিয়া প্রায়ই বাড়াবাড়ি</h2>

<p>বড় খবরের প্রথম দিন বা প্রথম সপ্তাহে বাজার অতিরিক্ত প্রতিক্রিয়া দেখায়, কারণ ওই সময় কেউ জানে না প্রভাবটা আসলে কত বড়। মানুষ সবচেয়ে খারাপটা ধরে নেন আর বেচেন।</p>

<p>পরের কয়েক মাসে সংখ্যা আসতে শুরু করে: আসল খরচ কত বাড়ল, আসল অর্ডার কত কমল। তখন দাম আরও যুক্তিসঙ্গত জায়গায় স্থির হয়। এইজন্য বড় খবরের দিনে কোনো সিদ্ধান্ত না নেওয়া প্রায় সবসময় ভালো নিয়ম।</p>

<div class="note">উল্টো ভুলটাও আছে আর সেটা কম আলোচিত: কিছু ধাক্কার প্রভাব দীর্ঘস্থায়ী আর বাজার সেটা যথেষ্ট গুরুত্ব দেয় না। জ্বালানির দামের একটা স্থায়ী উত্থান একটা কারখানার খরচকাঠামো স্থায়ীভাবে বদলে দেয়। প্রশ্নটা সবসময় একই: এই ঘটনাটা কি এই ব্যবসার আয় ক্ষমতাকে স্থায়ীভাবে বদলাল, নাকি এক-দুই প্রান্তিকের ব্যাপার?</div>

<h2>বাংলাদেশে যা দেখতে হবে</h2>

<ul class="checklist">
<li>বিশ্ববাজারে জ্বালানির দাম, কারণ সেটা প্রায় সবার খরচে ঢোকে।</li>
<li>রেমিট্যান্স আর রপ্তানির মাসিক সংখ্যা, কারণ দুইটাই ডলারের জোগান।</li>
<li>বৈদেশিক মুদ্রার রিজার্ভ, কারণ সেটা কমলে টাকার ওপর চাপ বাড়ে।</li>
<li>ইউরোপ আর যুক্তরাষ্ট্রের অর্থনীতির খবর, কারণ ওখানেই আপনার দেশের কারখানার ক্রেতা।</li>
<li>বন্দর আর জাহাজ ভাড়ার খবর, কারণ সরবরাহ শৃঙ্খলের ধাক্কা ওখান দিয়ে আসে।</li>
</ul>

<h2>নিজে যাচাই করুন</h2>

${mount("shock-quiz")}
`,
  en: `
<p>In February 2022 a war started in Ukraine. Within six months a bakery in Dhaka was paying more for flour, a cement plant's fuel bill had risen, and margins were squeezed at a great many companies on the DSE. This lesson is about that chain.</p>

<p>A distant event reaches your portfolio along specific routes, and the routes can be counted. It is not a mystery, it is a map, and knowing the map lets you ask questions instead of panicking at headlines.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Shocks travel four ways: commodity prices, the dollar, demand, and capital flows.</li>
<li>For Bangladesh the largest route is commodity prices, because fuel and food are imported.</li>
<li>The second is export demand: a recession in Europe means fewer garment orders.</li>
<li>Every shock has winners and losers; it is never everybody losing.</li>
<li>Most shocks matter less than the first reaction and for longer.</li>
</ul>
</div>

<h2>The four routes</h2>

${mount("shock-flow")}

<p>The first is commodity prices. Bangladesh imports most of its fuel, edible oil, wheat, fertiliser and industrial inputs. When world prices rise every producer's costs rise, and those with little pricing power have their margins squeezed.</p>

<p>The second is the dollar. In global uncertainty investors move to dollars, so emerging currencies weaken. A weaker taka makes imports dearer still, doubling the effect of the first route.</p>

<p>The third is demand. Much of Bangladesh's exports go to Europe and the United States. A recession there means fewer clothes bought, so fewer orders, so factories run below capacity, so employment and income fall.</p>

<p>The fourth is capital flows. When foreign investors cut risk they pull money out of emerging markets. Foreign participation here is small, so this route is weak in Bangladesh and much stronger in India or Vietnam.</p>

<h2>Who wins and who loses</h2>

${mount("shock-compare")}

<p>Every large shock redistributes. When oil rises, energy and power win and everything transport-dependent loses. When the dollar strengthens, exporters win and import-dependent producers lose. When food prices rise, agricultural processors are squeezed and input sellers do well.</p>

<p>That has a practical consequence: selling everything in a panic is nearly always wrong, because some part of your portfolio is probably winning.</p>

<h2>The first reaction usually overshoots</h2>

<p>On the first day or the first week of a large story the market overreacts, because nobody yet knows how big the effect actually is. People assume the worst and sell.</p>

<p>Over the following months the numbers arrive: how much costs actually rose, how many orders were actually lost. Then the price settles somewhere more reasonable. Which makes taking no decision on the day of a big story an almost always sensible rule.</p>

<div class="note">The opposite mistake exists too and is discussed less: some shocks are durable and the market underweights them. A permanent rise in energy prices permanently changes a factory's cost structure. The question is always the same: did this event permanently change the earning power of this business, or is it a quarter or two?</div>

<h2>What to watch in Bangladesh</h2>

<ul class="checklist">
<li>World energy prices, because they enter almost everyone's costs.</li>
<li>Monthly remittance and export figures, because both are the supply of dollars.</li>
<li>Foreign exchange reserves, because a fall there puts pressure on the taka.</li>
<li>The state of the European and American economies, because that is where your factories' customers live.</li>
<li>Port and freight news, because supply chain shocks arrive that way.</li>
</ul>

<h2>Check yourself</h2>

${mount("shock-quiz")}
`,
  blocks: {
    "shock-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "দূরের ঘটনা থেকে আপনার পোর্টফোলিও", en: "From a distant event to your portfolio" },
      parts: [
        { text: { bn: "দূরে একটা ঘটনা", en: "An event far away" }, note: { bn: "যুদ্ধ, দুর্যোগ, মন্দা, নীতি পরিবর্তন", en: "A war, a disaster, a recession, a policy change" } },
        { text: { bn: "বিশ্ববাজারে দাম বদলায়", en: "World prices move" }, note: { bn: "জ্বালানি, খাদ্যশস্য, সার, ধাতু", en: "Fuel, grain, fertiliser, metals" }, tone: "warn" },
        { text: { bn: "বাংলাদেশের আমদানি খরচ বাড়ে", en: "Bangladesh's import bill rises" }, note: { bn: "আর টাকার ওপর চাপ পড়ে", en: "And the taka comes under pressure" }, tone: "warn" },
        { text: { bn: "কোম্পানির খরচ বাড়ে", en: "Company costs rise" }, note: { bn: "যাদের দাম বাড়ানোর ক্ষমতা নেই তাদের মার্জিন যায়", en: "Those without pricing power lose margin" }, tone: "bad" },
        { text: { bn: "মুনাফা বদলায়, তারপর দাম", en: "Profits change, then prices" }, note: { bn: "এই ক্রমটাই আসল, আর এতে মাস লাগে", en: "That order is the real one, and it takes months" }, tone: "bad" },
      ],
      caption: {
        bn: "দাম সবার আগে নড়ে আর মুনাফা পরে বদলায়, তাই প্রথম প্রতিক্রিয়াটা অনুমান, তথ্য নয়।",
        en: "Prices move first and profits change later, so the first reaction is a guess rather than information.",
      },
    },
    "shock-compare": {
      kind: "compare",
      title: { bn: "একই ধাক্কা, তিন রকম ফল", en: "One shock, three different results" },
      columns: [
        { bn: "তেলের দাম বাড়ল", en: "Oil price rises" },
        { bn: "ডলার শক্তিশালী হলো", en: "The dollar strengthens" },
        { bn: "ইউরোপে মন্দা", en: "Europe goes into recession" },
      ],
      rows: [
        {
          label: { bn: "কারা জেতে", en: "Who wins" },
          cells: [
            { bn: "জ্বালানি ও বিদ্যুৎ খাত", en: "Energy and power" },
            { bn: "রপ্তানিকারক, রেমিট্যান্স নির্ভর পরিবার", en: "Exporters, households on remittances" },
            { bn: "প্রায় কেউ না, দেশি চাহিদানির্ভর কোম্পানি তুলনায় ভালো", en: "Almost nobody; domestic demand companies do relatively better" },
          ],
        },
        {
          label: { bn: "কারা হারে", en: "Who loses" },
          cells: [
            { bn: "পরিবহন, সিমেন্ট, ইস্পাত, প্লাস্টিক", en: "Transport, cement, steel, plastics" },
            { bn: "আমদানিনির্ভর উৎপাদক", en: "Import-dependent producers" },
            { bn: "তৈরি পোশাক আর তার সরবরাহকারীরা", en: "Garments and their suppliers" },
          ],
        },
        {
          label: { bn: "কত দ্রুত দেখা যায়", en: "How fast it shows" },
          cells: [
            { bn: "এক থেকে দুই প্রান্তিকে", en: "One to two quarters" },
            { bn: "সঙ্গে সঙ্গে, হিসাবে এক প্রান্তিকে", en: "Immediately, in the accounts a quarter later" },
            { bn: "দুই থেকে তিন প্রান্তিকে, অর্ডার বইয়ে", en: "Two to three quarters, through the order book" },
          ],
        },
      ],
    },
    "shock-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা বড় বৈশ্বিক ধাক্কার খবর এল আর বাজার প্রথম দিনে ৫% পড়ল। আপনার কী করা উচিত?",
            en: "A major global shock hits the news and the market falls 5% on day one. What should you do?",
          },
          options: [
            {
              text: { bn: "সব বেচে দেওয়া, আরও পড়ার আগেই", en: "Sell everything before it falls further" },
              why: {
                bn: "প্রথম দিনের প্রতিক্রিয়া প্রায় সবসময় বাড়াবাড়ি, আর আপনি ওই বাড়াবাড়ির সবচেয়ে খারাপ দামে বেচবেন। আর আপনার পোর্টফোলিওর কিছু অংশ সম্ভবত এই ধাক্কায় জিতছে।",
                en: "The day-one reaction almost always overshoots, and you would be selling into the worst of it. Some of your portfolio is probably winning from the shock as well.",
              },
            },
            {
              text: { bn: "কিছুই না, আর পরের কয়েক মাসে সংখ্যাগুলো দেখা", en: "Nothing, and watch the numbers over the coming months" },
              right: true,
              why: {
                bn: "ঠিক। প্রশ্নটা হলো এই ঘটনাটা আপনার কোম্পানিগুলোর আয় ক্ষমতা স্থায়ীভাবে বদলাল কি না, আর সেটার উত্তর প্রথম দিনে কেউ জানে না। পরের দুইটা ত্রৈমাসিক ফলাফলে সংখ্যাটা দেখা যাবে, আর তখন সিদ্ধান্ত নেওয়া যাবে তথ্যের ভিত্তিতে।",
                en: "Right. The question is whether the event permanently changed your companies' earning power, and nobody knows on day one. The next two quarterly results carry the number, and then the decision rests on evidence.",
              },
            },
            {
              text: { bn: "সব টাকা দিয়ে আরও কেনা, সস্তা হয়েছে", en: "Buy more with everything: it is cheap now" },
              why: {
                bn: "সস্তা হয়েছে নাকি ন্যায্য হয়েছে, সেটা এখনো জানা যায়নি। ধাক্কাটা যদি স্থায়ী হয়, দামটা যুক্তিসঙ্গতভাবেই নেমেছে। মাসিক নিয়ম চালিয়ে যাওয়া ভালো, একবারে সব ঢেলে দেওয়া নয়।",
                en: "Whether it is cheap or merely fair is not yet known. If the shock is durable the price fell for a reason. Continuing a monthly rule is fine; emptying the account in one go is not.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "বাংলাদেশের জন্য বৈশ্বিক ধাক্কার সবচেয়ে বড় পথ কোনটা?",
            en: "What is the largest route by which global shocks reach Bangladesh?",
          },
          options: [
            {
              text: { bn: "বিদেশি বিনিয়োগকারীদের টাকা তুলে নেওয়া", en: "Foreign investors pulling money out" },
              why: {
                bn: "ডিএসইতে বিদেশি অংশগ্রহণ তুলনামূলকভাবে কম, তাই এই পথটা এখানে দুর্বল। ভারত বা ভিয়েতনামে এটা অনেক শক্তিশালী।",
                en: "Foreign participation in DSE is relatively small, so this route is weak here. It is far stronger in India or Vietnam.",
              },
            },
            {
              text: { bn: "আমদানি করা পণ্যের দাম আর তার সঙ্গে জড়ানো ডলার", en: "Imported commodity prices, and the dollar attached to them" },
              right: true,
              why: {
                bn: "ঠিক। জ্বালানি, ভোজ্যতেল, গম, সার আর শিল্পের কাঁচামাল, সবই আমদানি হয়। বিশ্ববাজারে দাম বাড়া আর টাকার দাম কমা একসঙ্গে এলে খরচের ধাক্কাটা দ্বিগুণ হয়, আর সেটা পুরো অর্থনীতিতে ছড়ায়।",
                en: "Right. Fuel, edible oil, wheat, fertiliser and industrial inputs are all imported. A rise in world prices combined with a weaker taka doubles the cost shock, and it spreads through the whole economy.",
              },
            },
            {
              text: { bn: "পর্যটনের আয় কমে যাওয়া", en: "Lost tourism income" },
              why: {
                bn: "বাংলাদেশের অর্থনীতিতে পর্যটনের অংশ ছোট, তাই এই পথটা প্রায় অপ্রাসঙ্গিক। রপ্তানি আর রেমিট্যান্স অনেক বড় চ্যানেল।",
                en: "Tourism is a small part of this economy, so the route is nearly irrelevant. Exports and remittances are much larger channels.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"crowd-behaviour": {
  bn: `
<p>বাজারের সবচেয়ে বড় উত্থান আর সবচেয়ে বড় পতন, দুইটাই একই জিনিসের ফল: সবাই একসাথে একই দিকে দৌড়ানো। এই লেখাটা সেই দৌড়টা নিয়ে, কারণ এটা চেনা গেলে আপনি ওই দৌড়ে অন্তত সবার শেষে থাকবেন না।</p>

<p>গুরুত্বপূর্ণ কথাটা আগে: ভিড়ে যোগ দেওয়া মানুষ বোকা নন। প্রতিটা ধাপে তাদের সিদ্ধান্ত যুক্তিসঙ্গত মনে হয়, আর প্রায়ই স্বল্পমেয়াদে সঠিকও হয়। সমস্যাটা ব্যক্তির যুক্তিতে নয়, ব্যবস্থাটার গতিপথে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বাবল আর ধস একই চক্রের দুই পিঠ।</li>
<li>দাম বাড়া নিজেই কেনার কারণ হয়ে যায়, আর সেখানেই ব্যবস্থাটা ভাঙে।</li>
<li>ভিড়ের শেষ ধাপ হলো যখন যারা কখনো কেনেননি তারা কিনতে শুরু করেন।</li>
<li>ধারে কেনা চক্রটাকে দুই দিকেই দ্রুততর করে।</li>
<li>রক্ষা তিনটা: নিয়ম, লিখিত কারণ, আর ধার না করা।</li>
</ul>
</div>

<h2>চক্রটা</h2>

${mount("crowd-cycle")}

<p>চক্রটা শুরু হয় একটা সত্যিকারের কারণ দিয়ে: অর্থনীতি ভালো চলছে, সুদ কম, একটা খাতে সত্যিই ভালো ফলাফল আসছে। দাম ওঠে, আর ওই ওঠাটা ন্যায্য।</p>

<p>দ্বিতীয় ধাপে দাম ওঠাটা নিজেই খবর হয়ে যায়। মানুষ কেনেন কারণ দাম বাড়ছে, কারণ কোম্পানির কিছু নয়। এই মোড়টাই বাবলের শুরু, আর এটা বাইরে থেকে প্রায় দেখা যায় না, কারণ দুইটা ধাপেই দাম উপরের দিকেই যায়।</p>

<p>তৃতীয় ধাপে যারা কখনো শেয়ার কেনেননি তারা কিনতে শুরু করেন: প্রতিবেশী, সহকর্মী, রিকশাচালক, খবরে সাক্ষাৎকার। ভিড় সবচেয়ে বড় হয় ঠিক সবচেয়ে খারাপ সময়ে।</p>

<p>চতুর্থ ধাপে কিছু একটা ঘটে, প্রায়ই ছোট কিছু, আর দাম পড়তে শুরু করে। যারা ধারে কিনেছিলেন তারা <a class="term" href="/money/terms/margin-loan.html">মার্জিন কলে</a> পড়েন আর বেচতে বাধ্য হন, যা দাম আরও নামায়, যা আরও কল তৈরি করে। উত্থানের চক্রটাই উল্টো দিকে চলে।</p>

<h2>কেন বুদ্ধিমান মানুষও যোগ দেন</h2>

<p>এটা বোঝা দরকার, কারণ নিজেকে চিনতে না পারলে চেনা যায় না।</p>

${mount("crowd-compare")}

<p>প্রথম কারণটা তথ্যগত: অন্যরা কিনছে দেখে মনে হয় তারা হয়তো কিছু জানে। বেশিরভাগ ক্ষেত্রে তারা কিছুই জানে না, তারাও অন্যদের দেখে কিনছে।</p>

<p>দ্বিতীয় কারণটা সামাজিক: পাশের মানুষ টাকা বানাচ্ছে আর আপনি বসে আছেন, এই অনুভূতিটা যুক্তির চেয়ে শক্তিশালী। এটাকে ইংরেজিতে বলে FOMO, আর এর কোনো ভালো বাংলা নেই, কিন্তু অনুভূতিটা সবার চেনা।</p>

<p>তৃতীয় কারণটা পেশাগত: একজন ফান্ড ম্যানেজার ভিড়ের সঙ্গে হারলে চাকরি থাকে আর ভিড়ের বিপরীতে গিয়ে হারলে থাকে না। তাই প্রাতিষ্ঠানিক টাকাও প্রায়ই ভিড়ে যোগ দেয়।</p>

<h2>বাংলাদেশে দুইবার</h2>

<p>এখানে এই চক্রটা অন্তত দুইবার পুরোপুরি ঘটেছে, ১৯৯৬ আর ২০১০ সালে। দুইবারই প্যাটার্নটা একই ছিল: নতুন বিনিয়োগকারীদের ঢল, ধারের সহজলভ্যতা, এমন কোম্পানির দাম আকাশে ওঠা যাদের আয়ের সঙ্গে দামের কোনো সম্পর্ক ছিল না, তারপর পতন আর দীর্ঘ পুনরুদ্ধার।</p>

<p>দুইবারই সবচেয়ে বেশি ক্ষতিগ্রস্ত হয়েছেন যারা সবচেয়ে দেরিতে এসেছেন আর ধার নিয়ে এসেছেন। ইতিহাসটা মনে রাখার একমাত্র কারণ এই: পরেরবার এলে যেন চেনা লাগে।</p>

<div class="note">চক্র চেনা আর সময় ধরা এক জিনিস নয়। কেউই আগে থেকে বলতে পারে না বাবল কবে ফাটবে, আর অনেকে অনেক আগে থেকে বলে বলে ভুল প্রমাণিত হয়েছেন। কাজেই লক্ষ্য বাজারকে ফাঁকি দেওয়া নয়, লক্ষ্য হলো এমন অবস্থায় না থাকা যেখানে পতনটা আপনাকে বাধ্য করে।</div>

<h2>তিনটা রক্ষা</h2>

<ol class="step-list">
<li><strong>একটা লিখিত নিয়ম।</strong> মাসে নির্দিষ্ট টাকা, নির্দিষ্ট দিনে। এটা উত্তেজনার সময় বেশি কিনতে দেয় না আর আতঙ্কের সময় থামতে দেয় না।</li>
<li><strong>প্রতিটা কেনার কারণ লিখে রাখা।</strong> যদি কারণটা লিখতে গিয়ে দাঁড়ায় দাম বাড়ছে, তাহলে আপনি ভিড়ে আছেন, আর সেটা কাগজে দেখা যায়।</li>
<li><strong>ধার না করা।</strong> ভিড়ের চক্রে ধার আপনাকে বাধ্য বিক্রেতা বানায়, আর বাধ্য বিক্রেতা সবচেয়ে খারাপ দামে বেচেন।</li>
</ol>

<h2>নিজে যাচাই করুন</h2>

${mount("crowd-quiz")}
`,
  en: `
<p>The largest rises and the largest falls in a market are the same phenomenon: everybody running the same way at once. This lesson is about that run, because recognising it means at least not being at the back of it.</p>

<p>The important thing first: the people in a crowd are not fools. At every step their decision looks reasonable, and in the short run it is often right. The problem is not in any individual's logic, it is in where the system goes.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A bubble and a crash are two faces of one cycle.</li>
<li>A rising price becomes the reason to buy, and that is where the system breaks.</li>
<li>The last stage of a crowd is when people who never bought shares start buying.</li>
<li>Borrowing speeds the cycle up in both directions.</li>
<li>Three defences: a rule, a written reason, and no debt.</li>
</ul>
</div>

<h2>The cycle</h2>

${mount("crowd-cycle")}

<p>It starts with a genuine reason: the economy is doing well, rates are low, a sector really is producing good results. Prices rise, and the rise is deserved.</p>

<p>At the second stage the rise itself becomes the news. People buy because the price is going up, not because of anything at the company. That turn is where a bubble begins, and it is nearly invisible from outside, because in both stages prices simply go up.</p>

<p>At the third stage, people who have never bought a share begin buying: neighbours, colleagues, rickshaw drivers, interviews on the news. The crowd is largest at exactly the worst moment.</p>

<p>At the fourth something happens, often something small, and prices start falling. Those who borrowed hit a <a class="term" href="/money/terms/margin-loan.html">margin call</a> and are forced to sell, which drives prices lower, which triggers more calls. The rising loop runs backwards.</p>

<h2>Why sensible people join in</h2>

<p>Worth understanding, because you cannot recognise it in yourself without it.</p>

${mount("crowd-compare")}

<p>The first reason is informational: others buying looks like they might know something. Mostly they know nothing; they are watching others too.</p>

<p>The second is social: people around you are making money while you sit still, and that feeling is stronger than reasoning. English calls it FOMO, and there is no good Bangla word for it, and the feeling is familiar to everybody.</p>

<p>The third is professional: a fund manager who loses with the crowd keeps their job and one who loses against it does not. So institutional money often joins the crowd too.</p>

<h2>Twice in Bangladesh</h2>

<p>The cycle has run in full at least twice here, in 1996 and in 2010. Both times the pattern was the same: a flood of new investors, easy borrowing, prices on companies with no relationship to their earnings, then a fall and a long recovery.</p>

<p>Both times the worst damage fell on those who arrived last and those who arrived with borrowed money. The only reason to remember the history is so that the next one looks familiar.</p>

<div class="note">Recognising a cycle and timing it are different things. Nobody can say in advance when a bubble bursts, and plenty of people have been ruined being early. So the goal is not to outsmart the market, it is to never be in a position where a fall can force you.</div>

<h2>Three defences</h2>

<ol class="step-list">
<li><strong>A written rule.</strong> A fixed amount on a fixed day each month. It stops you buying more in the excitement and stops you stopping in the panic.</li>
<li><strong>A written reason for every purchase.</strong> If, when you write it, the reason turns out to be that the price is rising, you are in the crowd, and it is visible on paper.</li>
<li><strong>No borrowing.</strong> In a crowd cycle debt makes you a forced seller, and a forced seller sells at the worst price.</li>
</ol>

<h2>Check yourself</h2>

${mount("crowd-quiz")}
`,
  blocks: {
    "crowd-cycle": {
      kind: "figure",
      shape: "cycle",
      title: { bn: "ভিড়ের চক্র", en: "The crowd cycle" },
      parts: [
        { text: { bn: "একটা সত্যিকারের কারণ", en: "A genuine reason" }, note: { bn: "ভালো ফলাফল, কম সুদ, সংস্কার", en: "Good results, low rates, a reform" }, tone: "good" },
        { text: { bn: "দাম ওঠে, আর ওঠাটা ন্যায্য", en: "Prices rise, deservedly" }, note: { bn: "এই পর্যন্ত সব ঠিক আছে", en: "Everything is fine to here" } },
        { text: { bn: "ওঠাটাই কারণ হয়ে যায়", en: "The rise becomes the reason" }, note: { bn: "মানুষ কেনে কারণ দাম বাড়ছে। এখানেই মোড়।", en: "People buy because the price is rising. This is the turn." }, tone: "warn" },
        { text: { bn: "যারা কখনো কেনেননি তারা আসেন", en: "People who never bought arrive" }, note: { bn: "ভিড় সবচেয়ে বড়, দাম সবচেয়ে বেশি", en: "The crowd is largest and the price is highest" }, tone: "bad" },
        { text: { bn: "ছোট একটা ধাক্কা, তারপর জোরপূর্বক বিক্রি", en: "A small shock, then forced selling" }, note: { bn: "ধার করা টাকাই পতনটাকে ধস বানায়", en: "Borrowed money turns a fall into a crash" }, tone: "bad" },
      ],
      caption: {
        bn: "চক্রটা থামে না, কেবল নতুন করে শুরু হয়। যা বদলায় তা হলো কোন খাতে, আর কারা মনে রেখেছেন।",
        en: "The cycle does not stop, it restarts. What changes is which sector, and who remembers the last one.",
      },
    },
    "crowd-compare": {
      kind: "compare",
      title: { bn: "বিনিয়োগ আর ভিড় অনুসরণ", en: "Investing and following a crowd" },
      columns: [
        { bn: "বিনিয়োগ", en: "Investing" },
        { bn: "ভিড় অনুসরণ", en: "Following the crowd" },
      ],
      rows: [
        {
          label: { bn: "কেনার কারণ", en: "The reason to buy" },
          cells: [
            { bn: "ব্যবসাটা যা আনবে বলে মনে করছেন", en: "What you think the business will earn" },
            { bn: "দাম বাড়ছে, আর অন্যরা কিনছে", en: "The price is rising and others are buying" },
          ],
          best: 0,
        },
        {
          label: { bn: "কারণটা লেখা যায়?", en: "Can the reason be written down?" },
          cells: [{ bn: "হ্যাঁ, তিন বাক্যে", en: "Yes, in three sentences" }, { bn: "লিখতে গেলে ফাঁকা লাগে", en: "It comes out empty when you try" }],
          best: 0,
        },
        {
          label: { bn: "দাম পড়লে কী করবেন", en: "What you do in a fall" },
          cells: [
            { bn: "কারণটা এখনো সত্য কি না দেখবেন", en: "Check whether the reason still holds" },
            { bn: "জানেন না, কারণ কোনো কারণ ছিল না", en: "You do not know, because there was no reason" },
          ],
          best: 0,
        },
        {
          label: { bn: "সময়সীমা", en: "Horizon" },
          cells: [{ bn: "বছর", en: "Years" }, { bn: "যতদিন দাম বাড়ে", en: "As long as the price rises" }],
          best: 0,
        },
      ],
    },
    "crowd-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার পাড়ার তিনজন মানুষ, যারা কখনো শেয়ার কেনেননি, গত মাসে বিও অ্যাকাউন্ট খুলেছেন। এটা কী বলে?",
            en: "Three people in your neighbourhood who never bought shares opened BO accounts last month. What does that suggest?",
          },
          options: [
            {
              text: { bn: "বাজার ভালো, তাই আমারও কেনা উচিত", en: "The market is good, so I should buy too" },
              why: {
                bn: "এটাই ঠিক সেই প্রতিক্রিয়া যা চক্রটাকে এগিয়ে নেয়। নতুন মানুষের আসা বাজারের ভালো করার কারণ নয়, বাজারের ভালো করার ফল, আর সেটা প্রায়ই চক্রের শেষ ধাপ।",
                en: "That is precisely the reaction that carries the cycle along. New people arriving is not a cause of a good market, it is a result of one, and usually a late-stage one.",
              },
            },
            {
              text: { bn: "চক্রটা সম্ভবত শেষ ধাপে আছে, তাই সতর্ক হওয়া উচিত", en: "The cycle is probably late, so be careful" },
              right: true,
              why: {
                bn: "ঠিক, আর সতর্ক হওয়া মানে সব বেচে দেওয়া নয়। মানে হলো নতুন করে বড় অঙ্ক না ঢালা, ধার না নেওয়া, আর মাসিক নিয়মটা যেমন আছে তেমন চালানো। কবে শেষ হবে তা কেউ জানে না, তাই সময় ধরার চেষ্টা না করে অবস্থানটা নিরাপদ রাখাই কাজ।",
                en: "Right, and being careful does not mean selling everything. It means not committing large new sums, not borrowing, and keeping the monthly rule exactly as it is. Nobody knows when it ends, so the work is keeping the position safe rather than timing it.",
              },
            },
            {
              text: { bn: "কিছুই বলে না", en: "It says nothing at all" },
              why: {
                bn: "এটা একটা দুর্বল সংকেত, আর দুর্বল সংকেত শূন্য নয়। ১৯৯৬ আর ২০১০, দুইবারই নতুন অ্যাকাউন্টের ঢল চূড়ার কাছাকাছি এসেছিল, আর সেটা তথ্য।",
                en: "It is a weak signal, and a weak signal is not zero. In 1996 and in 2010 the surge in new accounts arrived near the peak, and that is information.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "ভিড়ের চক্র থেকে বাঁচার সবচেয়ে কার্যকর ব্যবস্থা কোনটা?",
            en: "What is the most effective protection against a crowd cycle?",
          },
          options: [
            {
              text: { bn: "চূড়া কোথায় হবে তা আগে থেকে বের করা", en: "Working out in advance where the peak will be" },
              why: {
                bn: "কেউ এটা ধারাবাহিকভাবে পারে না, আর যারা চেষ্টা করেন তারা প্রায়ই অনেক আগে বেরিয়ে গিয়ে বাকি উত্থানটা মিস করেন। সময় ধরা কৌশল নয়, আশা।",
                en: "Nobody does this consistently, and those who try usually exit early and miss the rest of the rise. Timing is not a strategy, it is a hope.",
              },
            },
            {
              text: { bn: "ধার না করা আর একটা লিখিত নিয়মে চলা", en: "Not borrowing, and running a written rule" },
              right: true,
              why: {
                bn: "ঠিক। ধার না থাকলে পতনটা আপনাকে বেচতে বাধ্য করতে পারে না, আর লিখিত নিয়ম উত্তেজনার সময় বেশি কেনা আর আতঙ্কের সময় থেমে যাওয়া, দুইটাই ঠেকায়। এই দুইটা আপনার নিয়ন্ত্রণে, আর বাজারের চূড়া নয়।",
                en: "Right. Without debt a fall cannot force you to sell, and a written rule prevents both buying more in the excitement and stopping in the panic. Both are in your control, and the peak is not.",
              },
            },
            {
              text: { bn: "কেবল বড় কোম্পানির শেয়ার কেনা", en: "Only buying large companies" },
              why: {
                bn: "সাহায্য করে আর যথেষ্ট নয়। বড় কোম্পানিও বাবলে অতিমূল্যায়িত হয়, আর ২০১০ সালে বাংলাদেশে বড় নামগুলোও অর্ধেক হয়েছিল।",
                en: "It helps and it is not enough. Large companies get overvalued in bubbles too, and the big names here halved in 2010 like everything else.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"market-cycles": {
  bn: `
<p>বাজার সরল রেখায় ওঠে না, আবার এলোমেলোভাবেও নড়ে না। এটা চলে চক্রে: কয়েক বছর ভালো, তারপর একটা পতন, তারপর দীর্ঘ নীরবতা, তারপর আবার শুরু। এই চক্রটা কখন মোড় নেবে তা কেউ আগে থেকে বলতে পারে না, কিন্তু এখন কোন পর্বে আছি সেটা বোঝা যায়, আর সেটুকু বোঝাই যথেষ্ট।</p>

<p><a class="term" href="/money/basics-2/crowd-behaviour.html">ভিড়ের আচরণের</a> লেখায় দেখা হয়েছে মানুষ কেন একসঙ্গে ছোটে। এই লেখাটা সেই ছোটাছুটিকে সময়ের মাপে বসায়, আর দেখায় কেন একজন সাধারণ বিনিয়োগকারীর জন্য চক্রের সবচেয়ে গুরুত্বপূর্ণ পাঠ হলো: চক্র থাকবেই, তাই এমনভাবে চলুন যাতে যেকোনো পর্বে টিকে থাকতে পারেন।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>চক্রের চারটা পর্ব: নীরবতা, বিশ্বাস, উত্তেজনা, ভাঙন।</li>
<li>বাংলাদেশে বড় দুইটা ভাঙন ১৯৯৬ আর ২০১০। দুইটারই গঠন প্রায় এক।</li>
<li>৫০% পড়লে আগের জায়গায় ফিরতে ১০০% উঠতে হয়। পতনের অঙ্ক নির্মম।</li>
<li>চক্রের সময় ধরা যায় না, কিন্তু চক্রের জন্য প্রস্তুত থাকা যায়।</li>
<li>প্রস্তুতি মানে: ধার নেই, মাসিক নিয়ম আছে, আর জরুরি তহবিল আলাদা।</li>
</ul>
</div>

<h2>চারটা পর্ব</h2>

<p>প্রতিটা বড় চক্রে একই চারটা পর্ব ঘুরে ফিরে আসে, আর প্রতিটা পর্বের নিজস্ব ভাষা আছে। পর্ব চিনতে শিখলে খবরের শিরোনাম পড়ে আপনি বুঝতে পারবেন এখন কোথায় দাঁড়িয়ে আছি।</p>

${mount("cyc-cycle")}

<p><strong>নীরবতা।</strong> গত পতনের পর কয়েক বছর। লেনদেন কম, খবরে বাজার নেই, আর যারা টাকা হারিয়েছিলেন তারা আর ফিরে আসেননি। দাম প্রায়ই সস্তা, আর ঠিক এই সময়েই কেনা সবচেয়ে লাভজনক হয়। কিন্তু এই সময়ে কেনা সবচেয়ে কঠিন, কারণ কেউ উৎসাহ দেয় না।</p>

<p><strong>বিশ্বাস।</strong> কোম্পানিগুলোর ফলাফল ভালো আসতে শুরু করে, দাম আস্তে আস্তে ওঠে, আর যারা এখনো আছেন তারা লাভ দেখতে পান। এই পর্বটা সাধারণত সবচেয়ে দীর্ঘ আর সবচেয়ে নিরাপদ। ওঠাটা ন্যায্য, কারণ এর পেছনে আসল আয় আছে।</p>

<p><strong>উত্তেজনা।</strong> এখানে সম্পর্কটা উল্টে যায়। দাম ওঠে কারণ দাম উঠছে। নতুন মানুষ আসেন, ধার করে কেনা বাড়ে, আর যে কোম্পানির কোনো আয় নেই তার শেয়ারও তিনগুণ হয়। এই পর্বে সবচেয়ে বেশি টাকা বাজারে ঢোকে, আর সবচেয়ে খারাপ দামে ঢোকে।</p>

<p><strong>ভাঙন।</strong> কোনো একটা ধাক্কা আসে। ধাক্কাটা সাধারণত ছোট, কিন্তু ধার করা টাকা সেটাকে বড় করে তোলে: দাম পড়লে মার্জিন কল আসে, বাধ্য হয়ে বেচতে হয়, বেচলে দাম আরও পড়ে। কয়েক মাসে যা তৈরি হয়েছিল কয়েক সপ্তাহে চলে যায়। তারপর আবার নীরবতা।</p>

<h2>বাংলাদেশের দুইটা ভাঙন</h2>

${mount("cyc-timeline")}

<p>১৯৯৬ সালের ধসটা ছিল ছোট একটা বাজারে হঠাৎ বিপুল টাকার ঢল। সূচক কয়েক মাসে কয়েকগুণ হয়ে গিয়েছিল, তারপর নেমে আসতে বছর লেগেছে। তখন কারসাজি ধরা পড়েছিল, নিয়মকানুন শক্ত হয়েছিল, আর সাধারণ মানুষ প্রায় এক দশক শেয়ারবাজার থেকে দূরে ছিলেন।</p>

<p>২০১০ সালেরটা বড় ছিল, কারণ বাজার ততদিনে বড় হয়েছিল আর ধারের ব্যবস্থা সহজ হয়েছিল। ব্যাংক আর ব্রোকারের টাকায় কেনা বেড়েছিল, নতুন বিও অ্যাকাউন্টের সংখ্যা রেকর্ড ছুঁয়েছিল, আর যেসব কোম্পানির আয় সামান্য তাদের দাম আকাশে উঠেছিল। ডিসেম্বরের শেষে মোড় ঘোরে, আর ২০১১ সালের প্রায় পুরোটা পতনে কেটেছে।</p>

<div class="note">
<p>দুইটা ভাঙনেরই গঠন এক: সহজ ধার, নতুন মানুষের ঢল, আয়ের সঙ্গে দামের সম্পর্ক ছিঁড়ে যাওয়া, তারপর একটা সাধারণ ধাক্কা। কারণগুলো আগে থেকেই দেখা যাচ্ছিল। যা দেখা যাচ্ছিল না তা হলো তারিখ।</p>
</div>

<h2>পতনের অঙ্কটা নির্মম</h2>

<p>একটা কথা বারবার ভুল বোঝা হয়। ৫০% পড়লে ৫০% উঠলেই আগের জায়গায় ফেরা যায় না। ১০০ টাকা ৫০ হলে, ৫০ থেকে ১০০ ফিরতে ১০০% উঠতে হবে। যত গভীর পতন, ফেরার পথ তত অসমান।</p>

${mount("cyc-lab")}

<p>এই কারণেই বড় পতন এড়ানো বড় উত্থান ধরার চেয়ে বেশি দামি। আর বড় পতন এড়ানোর সবচেয়ে কার্যকর উপায় জ্যোতিষ নয়, বরং তিনটা নিরস অভ্যাস: ধার না নেওয়া, একবারে সব টাকা না ঢালা, আর যে টাকা এক বছরের মধ্যে লাগবে সেটা বাজারে না রাখা।</p>

<h2>কোন পর্বে আছি, বোঝার কয়েকটা চিহ্ন</h2>

<p>নিখুঁত মাপকাঠি নেই, কিন্তু কয়েকটা জিনিস একসঙ্গে দেখা দিলে সতর্ক হওয়া যায়। এগুলো ভবিষ্যদ্বাণী নয়, তাপমাত্রা।</p>

${mount("cyc-spot")}

<p>খেয়াল করুন এর একটাও দাম নিয়ে নয়। দাম কত সেটা একা কিছু বলে না; দামের সঙ্গে আয়ের সম্পর্ক, ধারের পরিমাণ আর নতুন মানুষের ঢল, এই তিনটা মিলে ছবিটা তৈরি করে।</p>

<h2>চক্রের সময়ে কী করবেন</h2>

<p>উত্তরটা হতাশাজনকভাবে একঘেয়ে, আর সেটাই এর শক্তি। মাসে একটা নির্দিষ্ট অঙ্ক, একই দিনে, বাজার যাই বলুক। এতে উত্তেজনার সময় আপনি কম শেয়ার পান আর নীরবতার সময় বেশি পান, যা ঠিক উল্টো দিকে কাজ করে ভিড়ের।</p>

<div class="ex">
<p><strong>দুইজন, একই দশ বছর।</strong> রফিক প্রতি মাসে ৫,০০০ টাকা করে রাখেন, ভালো সময়েও, খারাপ সময়েও। সেলিম অপেক্ষা করেন, আর যখন সবাই বলে বাজার ভালো তখন এককালীন ৬ লাখ ঢালেন। দশ বছর পর রফিকের গড় কেনা দাম সেলিমের চেয়ে কম, কারণ রফিকের কেনার সবচেয়ে বড় অংশ পড়েছে সেই বছরগুলোতে যখন কেউ কিনতে চায়নি।</p>
</div>

<p>দ্বিতীয় কাজটা আরও সহজ: লিখে রাখা। এখন কোন পর্বে আছি বলে আপনি মনে করছেন, আর কেন। ছয় মাস পর ফিরে পড়লে দুইটা জিনিসের যেকোনো একটা শিখবেন, হয় আপনি ঠিক ছিলেন আর কারণটা কাজ করেছে, নয়তো আপনি ভুল ছিলেন আর কোন চিহ্নটা আপনাকে বিভ্রান্ত করেছে। দুইটাই দামি।</p>

<div class="checklist">
<ul>
<li>আপনার ধারণায় এখন বাজার কোন পর্বে আছে, এক বাক্যে লিখুন।</li>
<li>যে তিনটা চিহ্ন দেখে এটা বললেন, সেগুলো নাম ধরে লিখুন।</li>
<li>আপনার এখনকার বিনিয়োগে ধার করা টাকা আছে কি না দেখুন। থাকলে সেটাই প্রথম কাজ।</li>
<li>মাসিক অঙ্কটা এমন রাখুন যা টানা তিন বছর চালাতে পারবেন।</li>
</ul>
</div>

${mount("cyc-quiz")}
`,
  en: `
<p>Markets do not rise in a straight line, and they do not move at random either. They move in cycles: a few good years, then a fall, then a long quiet, then it starts again. Nobody can say in advance when the cycle will turn, but you can usually tell roughly which phase you are in, and that much is enough.</p>

<p>The lesson on <a class="term" href="/money/basics-2/crowd-behaviour.html">crowd behaviour</a> showed why people move together. This one puts that movement on a timescale, and shows why the most important lesson of cycles for an ordinary investor is this: cycles will happen, so arrange your money to survive any phase of one.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Four phases: quiet, belief, excitement, break.</li>
<li>Bangladesh has had two big breaks, 1996 and 2010, and their shape is nearly identical.</li>
<li>A 50% fall needs a 100% rise to get back. The arithmetic of losses is brutal.</li>
<li>You cannot time a cycle, but you can be ready for one.</li>
<li>Ready means: no borrowing, a monthly rule, and an emergency fund kept out of it.</li>
</ul>
</div>

<h2>The four phases</h2>

<p>Every large cycle runs through the same four phases, and each phase has its own language. Learn to recognise the phase and the headlines start telling you where you are standing.</p>

${mount("cyc-cycle")}

<p><strong>Quiet.</strong> The years after the last fall. Turnover is low, the market is not in the news, and the people who lost money never came back. Prices are often cheap, and buying now is what pays best. It is also the hardest time to buy, because nobody encourages you.</p>

<p><strong>Belief.</strong> Company results start improving, prices rise slowly, and those who stayed can see gains. This phase is usually the longest and the safest. The rise is deserved, because real earnings sit under it.</p>

<p><strong>Excitement.</strong> Here the relationship inverts. Prices rise because prices are rising. New people arrive, borrowed buying grows, and a company with no earnings at all triples. This is when the largest amount of money enters the market, at the worst prices.</p>

<p><strong>Break.</strong> Some shock arrives. The shock is usually small, but borrowed money magnifies it: a fall triggers margin calls, forced selling follows, and the selling pushes prices lower still. What took months to build goes in weeks. Then it is quiet again.</p>

<h2>Two breaks in Bangladesh</h2>

${mount("cyc-timeline")}

<p>The 1996 crash was a sudden flood of money into a small market. The index multiplied within months and then took years to come down. Manipulation was found, the rules were tightened, and ordinary people stayed away from shares for most of a decade.</p>

<p>The 2010 one was bigger, because by then the market was bigger and credit was easier. Bank and broker money funded buying, new BO account numbers hit records, and companies with modest earnings traded at extraordinary prices. The turn came at the end of December, and most of 2011 was spent falling.</p>

<div class="note">
<p>The shape of both is the same: easy credit, a flood of new participants, prices detaching from earnings, then an ordinary shock. The causes were visible in advance. What was not visible was the date.</p>
</div>

<h2>The arithmetic of a fall is brutal</h2>

<p>One thing is misunderstood again and again. A 50% fall is not undone by a 50% rise. If 100 becomes 50, getting from 50 back to 100 takes 100%. The deeper the fall, the more lopsided the road back.</p>

${mount("cyc-lab")}

<p>Which is why avoiding a large fall is worth more than catching a large rise. And the most effective way to avoid one is not prophecy but three dull habits: do not borrow, do not put everything in at once, and do not keep money you will need within a year in the market at all.</p>

<h2>Signs of which phase you are in</h2>

<p>There is no precise gauge, but a handful of things appearing together should raise your guard. These are not predictions, they are a temperature.</p>

${mount("cyc-spot")}

<p>Notice that not one of them is about the price level. A price on its own says nothing; the relationship between price and earnings, the amount of borrowed money, and the flow of new participants make the picture together.</p>

<h2>What to do inside a cycle</h2>

<p>The answer is disappointingly monotonous, and that is its strength. A fixed amount every month, on the same day, whatever the market says. That gets you fewer shares when there is excitement and more when it is quiet, which runs precisely opposite to the crowd.</p>

<div class="ex">
<p><strong>Two people, the same ten years.</strong> Rafiq puts in 5,000 taka a month, in good times and bad. Salim waits, and when everyone agrees the market is good he puts in 600,000 at once. Ten years later Rafiq's average purchase price is lower than Salim's, because the largest share of his buying fell in the years when nobody wanted to buy.</p>
</div>

<p>The second job is even simpler: write it down. Which phase you believe you are in, and why. Reading it back six months later teaches you one of two things: you were right and the reasoning worked, or you were wrong and you can see which sign misled you. Both are valuable.</p>

<div class="checklist">
<ul>
<li>Write, in one sentence, which phase you think the market is in.</li>
<li>Name the three signs that made you say it.</li>
<li>Check whether any borrowed money is in your current holdings. If it is, that is the first job.</li>
<li>Set the monthly amount at a level you could keep up for three years straight.</li>
</ul>
</div>

${mount("cyc-quiz")}
`,
  blocks: {
    "cyc-cycle": {
      kind: "figure",
      shape: "cycle",
      title: { bn: "চক্রের চারটা পর্ব", en: "The four phases of a cycle" },
      note: { bn: "প্রতিটা পর্বের নিজের ভাষা আছে। ভাষাটা চিনলে পর্বটা চেনা যায়।", en: "Each phase has its own language. Learn the language and you can name the phase." },
      parts: [
        { text: { bn: "নীরবতা", en: "Quiet" }, note: { bn: "কেউ কিনতে চায় না। দাম সবচেয়ে ভালো।", en: "Nobody wants to buy. Prices are at their best." }, tone: "good" },
        { text: { bn: "বিশ্বাস", en: "Belief" }, note: { bn: "আয় বাড়ছে, দাম বাড়ছে। ওঠাটা ন্যায্য।", en: "Earnings rise, prices rise. The move is deserved." } },
        { text: { bn: "উত্তেজনা", en: "Excitement" }, note: { bn: "দাম ওঠে কারণ দাম উঠছে। সবচেয়ে বেশি টাকা এখানে ঢোকে।", en: "Prices rise because prices are rising. Most money enters here." }, tone: "warn" },
        { text: { bn: "ভাঙন", en: "Break" }, note: { bn: "ছোট ধাক্কা, ধার করা টাকা, জোরপূর্বক বিক্রি।", en: "A small shock, borrowed money, forced selling." }, tone: "bad" },
      ],
      caption: {
        bn: "চক্রটা ঘড়ি নয়, তাই পর্বগুলোর দৈর্ঘ্য সমান নয়। নীরবতা বছরের পর বছর চলতে পারে, ভাঙন কয়েক সপ্তাহ।",
        en: "A cycle is not a clock, so the phases are not equal in length. Quiet can last years; a break takes weeks.",
      },
    },
    "cyc-timeline": {
      kind: "figure",
      shape: "timeline",
      title: { bn: "বাংলাদেশের বাজার, বড় ঘটনাগুলো", en: "The Bangladesh market, the big events" },
      parts: [
        { text: { bn: "১৯৯৪ থেকে ১৯৯৬", en: "1994 to 1996" }, note: { bn: "ছোট বাজারে হঠাৎ টাকার ঢল, সূচক কয়েকগুণ", en: "A flood of money into a small market, the index multiplies" }, tone: "warn" },
        { text: { bn: "১৯৯৬ শেষ", en: "Late 1996" }, note: { bn: "ধস। এরপর প্রায় এক দশক সাধারণ মানুষ দূরে", en: "The crash. Ordinary people stay away for most of a decade" }, tone: "bad" },
        { text: { bn: "২০০৯ থেকে ২০১০", en: "2009 to 2010" }, note: { bn: "সহজ ধার, নতুন বিও অ্যাকাউন্টের রেকর্ড", en: "Easy credit, record numbers of new BO accounts" }, tone: "warn" },
        { text: { bn: "২০১০ ডিসেম্বর", en: "December 2010" }, note: { bn: "মোড় ঘোরে, ২০১১ প্রায় পুরোটা পতনে", en: "The turn, and most of 2011 spent falling" }, tone: "bad" },
        { text: { bn: "২০১১ থেকে এখন", en: "2011 onwards" }, note: { bn: "নিয়মকানুন শক্ত, ধারের সীমা, ধীর পুনরুদ্ধার", en: "Tighter rules, limits on margin, a slow recovery" } },
      ],
      caption: {
        bn: "তারিখগুলো মনে রাখার জন্য নয়। গঠনটা মনে রাখার জন্য, কারণ গঠনটাই ফিরে আসে।",
        en: "The dates are not the point. The shape is, because the shape is what returns.",
      },
    },
    "cyc-lab": {
      kind: "lab",
      model: "drawdown",
      title: { bn: "পতনের পর ফিরতে কত লাগবে", en: "What it takes to get back" },
      note: { bn: "পতনের গভীরতা বাড়ান আর দেখুন ফেরার পথটা কীভাবে অসমান হয়ে যায়।", en: "Increase the depth of the fall and watch the road back become lopsided." },
      preset: { fall: 50, rate: 12 },
    },
    "cyc-spot": {
      kind: "spot",
      title: { bn: "কোনগুলো সতর্কবার্তা", en: "Which of these are warnings" },
      note: { bn: "একটা কাল্পনিক সপ্তাহের খবর। যেগুলো চক্রের শেষ পর্বের চিহ্ন, সেগুলোতে চাপুন।", en: "A week of imaginary news. Press the ones that are signs of a late-stage cycle." },
      source: { bn: "একটা কাল্পনিক সপ্তাহের বাজার সংবাদ", en: "An imaginary week of market news" },
      lines: [
        {
          text: { bn: "গত ছয় মাসে নতুন বিও অ্যাকাউন্ট খোলার হার তিনগুণ হয়েছে।", en: "New BO account openings have tripled over the past six months." },
          flag: { bn: "চিহ্ন। নতুন মানুষের ঢল প্রায় সবসময় দেরিতে আসে, কারণ তারা আসেন খবর দেখে, আর খবর হয় দাম উঠলে।", en: "A sign. New participants almost always arrive late, because they arrive from the news, and the news comes after the rise." },
        },
        {
          text: { bn: "একটি ব্যাংক তার প্রান্তিক ফলাফলে মুনাফা ১২% বাড়িয়েছে।", en: "A bank reported a 12% rise in quarterly profit." },
        },
        {
          text: { bn: "ব্রোকারেজ হাউসগুলোর মার্জিন ঋণের স্থিতি এক বছরে দ্বিগুণ হয়েছে।", en: "Margin lending balances at brokerage houses have doubled in a year." },
          flag: { bn: "সবচেয়ে বড় চিহ্ন। ধার করা টাকাই ছোট পতনকে ধস বানায়, কারণ মার্জিন কল বিক্রেতাকে বাছাই করতে দেয় না।", en: "The biggest sign. Borrowed money is what turns a small fall into a crash, because a margin call gives the seller no choice." },
        },
        {
          text: { bn: "বিএসইসি একটি কোম্পানির লেনদেন তদন্তের জন্য সাময়িক বন্ধ করেছে।", en: "The regulator suspended trading in one company pending an investigation." },
        },
        {
          text: { bn: "টানা তিন মাস ধরে লোকসানি কোম্পানির শেয়ারগুলোই সবচেয়ে বেশি বেড়েছে।", en: "For three months running, loss-making companies have been the biggest risers." },
          flag: { bn: "চিহ্ন। আয়ের সঙ্গে দামের সম্পর্ক ছিঁড়ে গেলে বোঝা যায় কেনার কারণ আর ব্যবসা নয়, কেবল দামের গতি।", en: "A sign. When price detaches from earnings, the reason to buy has stopped being the business and become the momentum." },
        },
        {
          text: { bn: "একটি বহুজাতিক কোম্পানি নগদ লভ্যাংশ ঘোষণা করেছে।", en: "A multinational declared a cash dividend." },
        },
        {
          text: { bn: "পরিচিত একজন বলছেন এবার আর আগের মতো হবে না, এবারেরটা আলাদা।", en: "Someone you know says this time is different." },
          flag: { bn: "প্রতিটা চক্রেই এই বাক্যটা শোনা যায়, আর প্রতিটা চক্রেই সেটা ভুল প্রমাণ হয়। বাক্যটা নিজেই একটা তাপমাত্রা।", en: "This sentence appears in every cycle and is wrong in every cycle. The sentence itself is a temperature reading." },
        },
      ],
    },
    "cyc-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার পোর্টফোলিও ৪০% পড়ে গেছে। আগের জায়গায় ফিরতে কত উঠতে হবে?",
            en: "Your portfolio has fallen 40%. How much does it need to rise to get back?",
          },
          options: [
            {
              text: { bn: "৪০%", en: "40%" },
              why: {
                bn: "না। ১০০ টাকা ৬০ হয়েছে। ৬০ থেকে ৪০% উঠলে হয় ৮৪, ১০০ নয়। শতাংশ যে ভিত্তির উপর বসে সেটাই বদলে গেছে।",
                en: "No. 100 became 60. A 40% rise on 60 is 84, not 100. The base the percentage sits on has changed.",
              },
            },
            {
              text: { bn: "প্রায় ৬৭%", en: "About 67%" },
              right: true,
              why: {
                bn: "ঠিক। ৬০ থেকে ১০০ মানে ৪০ টাকা বাড়া, আর ৪০ ভাগ ৬০ হলো ০.৬৭। এই অসমতাই কারণ যে বড় পতন এড়ানো বড় উত্থান ধরার চেয়ে বেশি দামি।",
                en: "Right. Going from 60 to 100 is a gain of 40, and 40 divided by 60 is 0.67. This asymmetry is exactly why avoiding a big fall is worth more than catching a big rise.",
              },
            },
            {
              text: { bn: "১০০%", en: "100%" },
              why: {
                bn: "১০০% লাগে ৫০% পতনে। ৪০% পতনে লাগে প্রায় ৬৭%। উপরের ল্যাবে সংখ্যাটা নাড়িয়ে দেখুন।",
                en: "100% is what a 50% fall needs. A 40% fall needs about 67%. Move the number in the lab above and watch it.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "চক্রের কোন পর্বে সাধারণ মানুষ সবচেয়ে বেশি টাকা বাজারে ঢালেন?",
            en: "In which phase of a cycle do ordinary people put in the most money?",
          },
          options: [
            {
              text: { bn: "নীরবতায়, যখন দাম সবচেয়ে সস্তা", en: "In the quiet, when prices are cheapest" },
              why: {
                bn: "যুক্তি বলে এটাই হওয়া উচিত, আর বাস্তবে ঠিক উল্টোটা হয়। নীরবতার সময় বাজার খবরে থাকে না, তাই কেউ জানতেও পারেন না যে সুযোগটা আছে।",
                en: "Logic says it should be, and reality is the opposite. In the quiet the market is not in the news, so nobody even learns the opportunity exists.",
              },
            },
            {
              text: { bn: "উত্তেজনায়, যখন দাম সবচেয়ে বেশি", en: "In the excitement, when prices are highest" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই চক্রের সবচেয়ে দুঃখজনক সত্য। সবচেয়ে বেশি টাকা ঢোকে সবচেয়ে খারাপ দামে, কারণ মানুষ আসেন খবর দেখে আর খবর হয় দাম ওঠার পরে। মাসিক নিয়ম এই ফাঁদটা কেটে দেয়।",
                en: "Right, and it is the saddest fact about cycles. The most money enters at the worst prices, because people arrive from the news and the news follows the rise. A monthly rule cuts straight through this trap.",
              },
            },
            {
              text: { bn: "ভাঙনের সময়, সস্তায় কেনার জন্য", en: "During the break, to buy cheap" },
              why: {
                bn: "কিছু মানুষ চেষ্টা করেন, কিন্তু ভাঙনের সময় বেশিরভাগ মানুষ বেচেন, কেনেন না। আতঙ্কে টাকা ঢালা মানুষের স্বভাব নয়।",
                en: "A few try, but during a break most people sell rather than buy. Committing money in a panic is not how people behave.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"order-types": {
  bn: `
<p>শেয়ার কেনা মানে ব্রোকারকে বলা নয় যে আমি অমুক শেয়ারটা চাই। এটা একটা নির্দিষ্ট নির্দেশ, আর নির্দেশটার ভেতরে অন্তত চারটা সিদ্ধান্ত থাকে: কোন শেয়ার, কতটা, কোন দামে, আর কতক্ষণ পর্যন্ত এই নির্দেশ কার্যকর থাকবে। এই চারটার মধ্যে তৃতীয়টাই নতুনরা সবচেয়ে বেশি ভুল করেন, আর সেই ভুলটা টাকায় গোনা যায়।</p>

<p><a class="term" href="/money/basics-2/supply-demand.html">চাহিদা আর জোগানের</a> লেখায় অর্ডার বইটা দেখা হয়েছে। এখানে দেখব আপনার নিজের অর্ডারটা সেই বইতে কীভাবে বসে, আর কোন ধরনের অর্ডার কখন ঠিক।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>মার্কেট অর্ডার: দাম যা হোক, এখনই। নিশ্চয়তা আছে দামে নেই।</li>
<li>লিমিট অর্ডার: এই দামে বা এর চেয়ে ভালো, নাহলে নয়। দামে নিশ্চয়তা আছে, হবেই এমন নয়।</li>
<li>কম লেনদেন হওয়া শেয়ারে মার্কেট অর্ডার বিপজ্জনক।</li>
<li>অর্ডারের মেয়াদ থাকে: দিন শেষে বাতিল, নাকি বাতিল না করা পর্যন্ত টিকে থাকে।</li>
<li>স্টপ অর্ডার একটা শর্ত, আর বাংলাদেশে সব ব্রোকার এটা দেয় না।</li>
</ul>
</div>

<h2>অর্ডারের কাগজটা দেখতে কেমন</h2>

<p>যেকোনো ব্রোকারের অ্যাপে বা ওয়েব টার্মিনালে অর্ডার দেওয়ার পর্দাটা প্রায় একরকম দেখতে। নামগুলো এদিক ওদিক হয়, ঘরগুলো এক।</p>

${mount("ord-screen")}

<p>এখানে লক্ষ করার মতো একটা জিনিস আছে: <strong>দামের ঘরটা ফাঁকা রাখা যায় না</strong>, অন্তত ভাবনার দিক থেকে। ফাঁকা রাখলে বা মার্কেট বাছলে আপনি বলছেন দাম যা হোক আমি রাজি, আর সেটা একটা সিদ্ধান্ত, অনুপস্থিতি নয়।</p>

<h2>মার্কেট অর্ডার: এখনই, দাম যা হোক</h2>

<p>মার্কেট অর্ডার বলে: বাজারে এই মুহূর্তে যে দামে পাওয়া যায়, সেই দামে কিনে ফেলো। বেশি লেনদেন হওয়া একটা শেয়ারে এটা প্রায় নিরীহ, কারণ কেনার আর বেচার দামের ফাঁকটা সরু।</p>

<p>কিন্তু কম লেনদেন হওয়া শেয়ারে এটা ফাঁদ। ধরুন সবচেয়ে ভালো বিক্রেতার দাম ৫০ টাকা, কিন্তু তার হাতে মাত্র ২০০টা শেয়ার। পরের বিক্রেতা ৫২ টাকা, তার পরেরজন ৫৫। আপনি যদি ১,০০০টা শেয়ারের মার্কেট অর্ডার দেন, আপনার অর্ডার এই তিনজনকেই খেয়ে ফেলবে আর আপনার গড় দাম হবে ৫০ নয়, বরং ৫৩ বা ৫৪। এটাকে বলে <strong>স্লিপেজ</strong>: যে দাম দেখে অর্ডার দিয়েছিলেন আর যে দামে হলো, তার পার্থক্য।</p>

<div class="note">
<p>স্লিপেজ কমিশনের মতো লাইনে লেখা থাকে না, তাই এটা প্রায়ই অদৃশ্য। কিন্তু কম লেনদেন হওয়া শেয়ারে এটা কমিশনের চেয়ে অনেক বড় হতে পারে। একটা ০.৪% কমিশন আর ৪% স্লিপেজ, দুইটার মধ্যে দ্বিতীয়টাই আপনার টাকা নিয়েছে।</p>
</div>

<h2>লিমিট অর্ডার: আমার দাম, নাহলে নয়</h2>

<p>লিমিট অর্ডারে আপনি একটা সর্বোচ্চ দাম বলে দেন। ৫০ টাকায় ১,০০০টা কেনার লিমিট অর্ডার মানে: ৫০ বা তার কমে পেলে নাও, ৫০-এর বেশি হলে অপেক্ষা করো। বেচার ক্ষেত্রে উল্টো, আপনি একটা সর্বনিম্ন দাম বলেন।</p>

${mount("ord-compare")}

<p>লিমিট অর্ডারের খরচ হলো অনিশ্চয়তা। দাম যদি আপনার সীমা ছুঁয়ে না আসে, আপনি কিছুই পাবেন না, আর শেয়ারটা আপনাকে ছাড়াই উপরে চলে যেতে পারে। নতুনদের একটা সাধারণ প্রবণতা হলো বাজার দামের অনেক নিচে লিমিট বসিয়ে রাখা, তারপর ছয় মাস অপেক্ষা করা, তারপর দ্বিগুণ দামে হতাশ হয়ে মার্কেট অর্ডারে কেনা। দুইবার ভুল।</p>

<div class="ex">
<p><strong>একটা বাস্তব হিসাব।</strong> শেয়ার ৫০ টাকা, আপনি ভাবছেন ৪৭ ভালো দাম হতো। ১,০০০টা কিনলে পার্থক্য ৩,০০০ টাকা। এখন প্রশ্ন: আপনার যুক্তি যদি বলে এই কোম্পানি পাঁচ বছরে দ্বিগুণ হবে, তাহলে ৩,০০০ টাকার জন্য পুরো অবস্থানটা মিস করা কি বুদ্ধিমানের কাজ? সাধারণত না। কিন্তু আপনার যুক্তি যদি বলে দাম ৪৭-এর উপরে গেলেই এটা আর সস্তা নয়, তাহলে লিমিটটাই ঠিক। <strong>লিমিটের সংখ্যাটা যুক্তি থেকে আসা উচিত, ইচ্ছা থেকে নয়।</strong></p>
</div>

<h2>অর্ডার কতক্ষণ বাঁচে</h2>

<p>প্রতিটা অর্ডারের একটা মেয়াদ আছে। বাংলাদেশে সবচেয়ে সাধারণ দুইটা হলো দিনের অর্ডার, যা বাজার বন্ধ হলে আপনাআপনি বাতিল হয়ে যায়, আর জিটিসি বা গুড টিল ক্যানসেলড, যা আপনি বাতিল না করা পর্যন্ত টিকে থাকে, সাধারণত একটা সর্বোচ্চ দিনসংখ্যা পর্যন্ত।</p>

<p>জিটিসি সুবিধাজনক আর বিপজ্জনক দুইটাই। সুবিধা হলো আপনাকে রোজ অর্ডার দিতে হয় না। বিপদ হলো আপনি ভুলে যেতে পারেন। তিন সপ্তাহ আগে বসানো একটা কেনার অর্ডার এমন একটা কোম্পানির, যার সম্পর্কে গত সপ্তাহে খারাপ খবর এসেছে, আপনার হয়ে কাজ করে যাবে যদিও আপনি আর কিনতে চান না।</p>

${mount("ord-match")}

<h2>স্টপ অর্ডার আর তার সীমা</h2>

<p>স্টপ অর্ডার একটা শর্তযুক্ত নির্দেশ: দাম যদি অমুক পর্যন্ত পড়ে, তাহলে বেচে দাও। উদ্দেশ্য হলো লোকসান একটা সীমার মধ্যে রাখা। যেসব ব্রোকার এটা দেয়, সেখানে এটা কাজে লাগে, বিশেষ করে যারা নিজের হিসাব রোজ দেখতে পারেন না তাদের জন্য।</p>

<p>তিনটা সীমা মনে রাখা দরকার। প্রথমত, বাংলাদেশের সব ব্রোকার এই সুবিধা দেয় না, তাই আপনার ব্রোকারের কাছে জিজ্ঞেস করে নিন। দ্বিতীয়ত, স্টপ ছুঁলে সেটা প্রায়ই একটা মার্কেট অর্ডারে পরিণত হয়, তাই দ্রুত পড়া বাজারে আপনি স্টপের দামের অনেক নিচে বিক্রি হতে পারেন। তৃতীয়ত, <a class="term" href="/money/terms/circuit-breaker.html">সার্কিট ব্রেকার</a> লাগলে লেনদেন থেমে যায় আর আপনার স্টপ অকেজো হয়ে বসে থাকে।</p>

<div class="note">
<p>স্টপ অর্ডার লোকসান বন্ধ করার যন্ত্র নয়, লোকসান সীমিত রাখার চেষ্টা। যে অবস্থান আপনি স্টপ ছাড়া রাখতে ভয় পান, সেই অবস্থানটা সম্ভবত আপনার জন্য অনেক বড়।</p>
</div>

<h2>নতুন হিসেবে কী করবেন</h2>

<p>সহজ একটা নিয়ম, যা প্রথম এক বছর নিরাপদে চালানো যায়: <strong>সবসময় লিমিট অর্ডার, আর লিমিটটা বাজার দামের খুব কাছে।</strong> এতে আপনি স্লিপেজ থেকে বাঁচেন কিন্তু অর্ডার না হওয়ার ঝুঁকিও প্রায় থাকে না। বেশি লেনদেন হওয়া শেয়ারে পার্থক্য সামান্য, কম লেনদেন হওয়া শেয়ারে এই অভ্যাসটাই আপনার সবচেয়ে বড় সুরক্ষা।</p>

${mount("ord-drill")}

<p>শেষ একটা কথা, যা কোনো অর্ডারের ঘরে লেখা থাকে না। অর্ডার দেওয়ার আগে নিজেকে জিজ্ঞেস করুন কেন আজ। যদি উত্তরটা হয় আজ সময় পেয়েছি, তাহলে সেটা ঠিক আছে, কারণ আপনার একটা মাসিক নিয়ম আছে। যদি উত্তরটা হয় দাম উঠছে বলে আজ না কিনলে মিস হয়ে যাবে, তাহলে অর্ডারের ধরন নয়, সিদ্ধান্তটাই ভুল।</p>
`,
  en: `
<p>Buying a share is not telling your broker that you would like some of a company. It is a specific instruction, and inside that instruction sit at least four decisions: which share, how many, at what price, and how long the instruction stays alive. Beginners get the third one wrong most often, and that mistake can be counted in money.</p>

<p>The lesson on <a class="term" href="/money/basics-2/supply-demand.html">supply and demand</a> showed you the order book. Here we look at how your own order sits in that book, and which kind of order is right when.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Market order: whatever the price, right now. Certain to fill, uncertain in price.</li>
<li>Limit order: this price or better, otherwise nothing. Certain in price, not certain to fill.</li>
<li>A market order in a thinly traded share is dangerous.</li>
<li>Orders have a life: cancelled at the close, or alive until you cancel.</li>
<li>A stop order is a condition, and not every broker here offers one.</li>
</ul>
</div>

<h2>What the order ticket looks like</h2>

<p>The order screen looks much the same in every broker's app or web terminal. The labels move around; the boxes do not.</p>

${mount("ord-screen")}

<p>One thing is worth noticing here: <strong>the price box cannot really be left empty</strong>, at least not in your head. Leaving it blank, or choosing market, says that you will accept whatever price is going, and that is a decision rather than the absence of one.</p>

<h2>Market order: now, at whatever it costs</h2>

<p>A market order says: buy at whatever price is available in the market this instant. In a heavily traded share this is close to harmless, because the gap between the best buy and the best sell price is narrow.</p>

<p>In a thinly traded share it is a trap. Suppose the best seller is at 50 taka but only has 200 shares. The next seller is at 52, and the one after that at 55. If you send a market order for 1,000 shares it eats through all three, and your average price is not 50 but 53 or 54. That difference is called <strong>slippage</strong>: the gap between the price you saw when you pressed the button and the price you actually paid.</p>

<div class="note">
<p>Slippage does not appear as a line on the contract note the way commission does, so it is usually invisible. In a thinly traded share it can be many times larger than the commission. A 0.4% commission and 4% of slippage: the second one took your money.</p>
</div>

<h2>Limit order: my price, or nothing</h2>

<p>With a limit order you name a maximum price. A limit order to buy 1,000 at 50 means: take it at 50 or less, wait if it is above 50. Selling is the mirror image, and you name a minimum.</p>

${mount("ord-compare")}

<p>The cost of a limit order is uncertainty. If the price never reaches your limit you get nothing, and the share can go up without you. A common beginner's habit is to leave a limit far below the market, wait six months, then buy in frustration at twice the price with a market order. Wrong twice.</p>

<div class="ex">
<p><strong>An actual calculation.</strong> The share is 50 and you think 47 would be a good price. On 1,000 shares that difference is 3,000 taka. Now the question: if your reasoning says this company doubles in five years, is missing the whole position over 3,000 taka sensible? Usually not. But if your reasoning says that above 47 it is no longer cheap, then the limit is exactly right. <strong>The number on a limit should come from your reasoning, not from your wishes.</strong></p>
</div>

<h2>How long an order lives</h2>

<p>Every order has a life. The two common ones here are the day order, which is cancelled automatically when the market closes, and good till cancelled, which stays alive until you cancel it, usually up to some maximum number of days.</p>

<p>Good till cancelled is convenient and dangerous at once. Convenient because you do not have to re-enter it every day. Dangerous because you can forget it. A buy order placed three weeks ago on a company that had bad news last week will go on working for you even though you no longer want to buy it.</p>

${mount("ord-match")}

<h2>Stop orders, and their limits</h2>

<p>A stop order is a conditional instruction: if the price falls to a given level, sell. The purpose is to keep a loss inside a boundary. Where a broker offers it, it is genuinely useful, especially for someone who cannot look at their account every day.</p>

<p>Three limits are worth remembering. First, not every broker in Bangladesh offers it, so ask yours. Second, once the stop is touched it usually becomes a market order, so in a fast-falling market you can be sold far below your stop price. Third, if a <a class="term" href="/money/terms/circuit-breaker.html">circuit breaker</a> halts trading, your stop simply sits there, unable to do anything.</p>

<div class="note">
<p>A stop order is not a device that stops losses; it is an attempt to bound them. A position you would be afraid to hold without a stop is probably a position that is too large for you.</p>
</div>

<h2>What to do as a beginner</h2>

<p>One simple rule that carries you safely through a first year: <strong>always use a limit order, and set the limit very close to the market price.</strong> That protects you from slippage while leaving almost no risk of not filling. In a heavily traded share the difference is small; in a thinly traded one this habit is your single biggest protection.</p>

${mount("ord-drill")}

<p>One last thing, which no order ticket has a box for. Before you send anything, ask yourself why today. If the answer is that today is when you had time, that is fine, because you have a monthly rule. If the answer is that the price is rising and you will miss it if you wait, then the problem is not the order type, it is the decision.</p>
`,
  blocks: {
    "ord-screen": {
      kind: "figure",
      shape: "callouts",
      title: { bn: "একটা অর্ডারের ঘরগুলো", en: "The boxes on an order ticket" },
      note: { bn: "প্রতিটা ঘরের পাশে কী সিদ্ধান্ত নিচ্ছেন সেটা লেখা।", en: "Beside each box, the decision you are actually making." },
      screen: {
        title: { bn: "নতুন অর্ডার", en: "New order" },
        rows: [
          { label: { bn: "শেয়ার", en: "Share" }, value: { bn: "GP", en: "GP" } },
          { label: { bn: "ধরন", en: "Side" }, value: { bn: "কেনা", en: "Buy" } },
          { label: { bn: "পরিমাণ", en: "Quantity" }, value: { bn: "১,০০০", en: "1,000" } },
          { label: { bn: "দামের ধরন", en: "Price type" }, value: { bn: "লিমিট", en: "Limit" } },
          { label: { bn: "দাম", en: "Price" }, value: { bn: "৩২০.৫০", en: "320.50" } },
          { label: { bn: "মেয়াদ", en: "Validity" }, value: { bn: "দিন", en: "Day" } },
        ],
      },
      parts: [
        { text: { bn: "কোন কোম্পানি", en: "Which company" }, note: { bn: "টিকার কোড, নাম নয়। একই নামের দুইটা কোম্পানি থাকতে পারে।", en: "The ticker, not the name. Two companies can share a name." }, at: 0 },
        { text: { bn: "কেনা নাকি বেচা", en: "Buy or sell" }, note: { bn: "সবচেয়ে ব্যয়বহুল ভুলটা এখানেই হয়, আর সবচেয়ে কম ধরা পড়ে।", en: "The most expensive slip happens here, and gets checked the least." }, at: 1 },
        { text: { bn: "কতগুলো", en: "How many" }, note: { bn: "লট নাকি একক শেয়ার, ব্রোকার ভেদে আলাদা। প্রথমবার ছোট রাখুন।", en: "Lots or single shares varies by broker. Keep the first one small." }, at: 2 },
        { text: { bn: "মার্কেট নাকি লিমিট", en: "Market or limit" }, note: { bn: "এই একটা ঘরই ঠিক করে আপনি দামে নিশ্চয়তা চান নাকি হওয়ায়।", en: "This one box decides whether you want certainty of price or of execution." }, tone: "lead", at: 3 },
        { text: { bn: "আপনার সর্বোচ্চ দাম", en: "Your maximum price" }, note: { bn: "সংখ্যাটা যুক্তি থেকে আসা উচিত, ইচ্ছা থেকে নয়।", en: "The number should come from reasoning, not from wishing." }, at: 4 },
        { text: { bn: "কতদিন বাঁচবে", en: "How long it lives" }, note: { bn: "জিটিসি রাখলে ক্যালেন্ডারে একটা মনে করানো দিন বসান।", en: "If you use good till cancelled, put a reminder in your calendar." }, at: 5 },
      ],
      caption: {
        bn: "পাঠানোর আগে ঘরগুলো উপর থেকে নিচে একবার পড়ে নেওয়া একটা অভ্যাস, আর এই অভ্যাসটা একদিন আপনাকে বাঁচাবে।",
        en: "Reading the boxes top to bottom before you send is a habit, and one day the habit will save you.",
      },
    },
    "ord-compare": {
      kind: "compare",
      title: { bn: "মার্কেট আর লিমিট", en: "Market and limit" },
      columns: [
        { bn: "মার্কেট অর্ডার", en: "Market order" },
        { bn: "লিমিট অর্ডার", en: "Limit order" },
      ],
      rows: [
        {
          label: { bn: "হবেই?", en: "Will it fill?" },
          cells: [{ bn: "প্রায় নিশ্চিত", en: "Almost certainly" }, { bn: "হতে পারে, নাও হতে পারে", en: "Maybe, maybe not" }],
          best: 0,
        },
        {
          label: { bn: "দাম জানেন?", en: "Do you know the price?" },
          cells: [{ bn: "না, পরে জানবেন", en: "No, you find out afterwards" }, { bn: "হ্যাঁ, সর্বোচ্চটা আপনি বলেছেন", en: "Yes, you named the worst case" }],
          best: 1,
        },
        {
          label: { bn: "কম লেনদেনের শেয়ারে", en: "In a thin share" },
          cells: [{ bn: "বিপজ্জনক, স্লিপেজ বড় হতে পারে", en: "Dangerous, slippage can be large" }, { bn: "নিরাপদ", en: "Safe" }],
          best: 1,
        },
        {
          label: { bn: "দ্রুত বেরোতে হলে", en: "If you must get out fast" },
          cells: [{ bn: "কাজের", en: "Useful" }, { bn: "আটকে যেতে পারেন", en: "You can be left stuck" }],
          best: 0,
        },
        {
          label: { bn: "নতুনদের জন্য", en: "For a beginner" },
          cells: [{ bn: "কেবল খুব বেশি লেনদেনের শেয়ারে", en: "Only in heavily traded shares" }, { bn: "ডিফল্ট হওয়া উচিত", en: "Should be the default" }],
          best: 1,
        },
      ],
    },
    "ord-match": {
      kind: "match",
      title: { bn: "কোন অর্ডার কোন কাজে", en: "Which order does which job" },
      note: { bn: "বাঁ দিকের পরিস্থিতির সঙ্গে ডান দিকের নির্দেশ মেলান।", en: "Match the situation on the left with the instruction on the right." },
      pairs: [
        {
          left: { bn: "কম লেনদেন হওয়া একটা শেয়ার কিনতে চান", en: "You want to buy a thinly traded share" },
          right: { bn: "লিমিট অর্ডার, বাজার দামের কাছাকাছি", en: "A limit order, close to the market price" },
        },
        {
          left: { bn: "আজকের মধ্যে না হলে আর দরকার নেই", en: "If it does not happen today you no longer want it" },
          right: { bn: "দিনের অর্ডার", en: "A day order" },
        },
        {
          left: { bn: "কয়েক সপ্তাহ ধরে একটা দামের অপেক্ষায় আছেন", en: "You are waiting weeks for a particular price" },
          right: { bn: "জিটিসি, আর ক্যালেন্ডারে মনে করানো", en: "Good till cancelled, plus a calendar reminder" },
        },
        {
          left: { bn: "লোকসান একটা সীমার মধ্যে রাখতে চান", en: "You want to bound a loss" },
          right: { bn: "স্টপ অর্ডার, যদি ব্রোকার দেয়", en: "A stop order, if your broker offers one" },
        },
        {
          left: { bn: "খুব বেশি লেনদেন হওয়া শেয়ার, এখনই দরকার", en: "A heavily traded share, and you need it now" },
          right: { bn: "মার্কেট অর্ডার", en: "A market order" },
        },
      ],
    },
    "ord-drill": {
      kind: "drill",
      title: { bn: "একবার নিজে করে দেখুন", en: "Do it once yourself" },
      note: { bn: "কিছু কেনার দরকার নেই। অর্ডারের পর্দাটা চিনে রাখাই কাজ।", en: "You do not have to buy anything. Getting to know the order screen is the job." },
      steps: [
        {
          text: { bn: "আপনার ব্রোকারের অ্যাপ বা টার্মিনালে অর্ডারের পর্দাটা খুলুন।", en: "Open the order screen in your broker's app or terminal." },
          hint: { bn: "অ্যাকাউন্ট না থাকলে ব্রোকারের ওয়েবসাইটে সাধারণত ছবি বা ভিডিও থাকে।", en: "Without an account, most brokers show a screenshot or video on their website." },
        },
        {
          text: { bn: "ছয়টা ঘর খুঁজে বের করুন: শেয়ার, কেনা বা বেচা, পরিমাণ, দামের ধরন, দাম, মেয়াদ।", en: "Find the six boxes: share, side, quantity, price type, price, validity." },
        },
        {
          text: { bn: "মার্কেট আর লিমিট বদলে দেখুন দামের ঘরটা কীভাবে বদলায়।", en: "Switch between market and limit and watch what happens to the price box." },
        },
        {
          text: { bn: "মেয়াদের তালিকায় কী কী আছে দেখুন, আর জিটিসি সর্বোচ্চ কত দিন সেটা লিখে রাখুন।", en: "Look at the validity list and note the maximum number of days for good till cancelled." },
        },
        {
          text: { bn: "ব্রোকারকে জিজ্ঞেস করুন স্টপ অর্ডার আছে কি না, আর থাকলে সেটা কীভাবে কাজ করে।", en: "Ask your broker whether stop orders exist, and if so exactly how they behave." },
          hint: { bn: "স্টপ ছুঁলে সেটা মার্কেট অর্ডার হয়ে যায় কি না, এই প্রশ্নটাই আসল।", en: "Whether a touched stop becomes a market order is the question that matters." },
        },
        {
          text: { bn: "একটা লিমিট অর্ডার লিখে ফেলুন, পাঠানোর ঠিক আগে বাতিল করে দিন।", en: "Type out a limit order and cancel it just before sending." },
          hint: { bn: "উদ্দেশ্য হলো হাতটা চিনে রাখা, যাতে আসল দিনে তাড়াহুড়ো না হয়।", en: "The point is muscle memory, so the real day is not the first time." },
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"when-to-buy": {
  bn: `
<p>কেনার সিদ্ধান্তটা প্রায় সবাই উল্টো দিক থেকে নেন। প্রথমে একটা শেয়ারের নাম শোনেন, তারপর কারণ খোঁজেন। ঠিক পথটা উল্টো: প্রথমে আপনার নিজের পরিস্থিতি, তারপর কোম্পানিটা, তারপর দাম, আর সবার শেষে অর্ডার।</p>

<p>এই লেখাটা পাঁচটা প্রশ্ন দেয়। প্রশ্নগুলো ক্রমানুসারে, আর ক্রমটাই আসল: কোনো একটাতে না হলে পরেরটাতে যাওয়ার দরকার নেই। এটা আপনাকে ভালো শেয়ার বেছে দেবে না, কিন্তু বেশিরভাগ খারাপ সিদ্ধান্ত আটকে দেবে, আর নতুন বিনিয়োগকারীর জন্য দ্বিতীয়টা বেশি দামি।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>প্রশ্ন এক: এই টাকাটা কি সত্যিই তিন বছর ফেলে রাখা যাবে?</li>
<li>প্রশ্ন দুই: কোম্পানিটা কী করে, তিন বাক্যে বলতে পারেন?</li>
<li>প্রশ্ন তিন: আয় দিয়ে দামটা ব্যাখ্যা হয়?</li>
<li>প্রশ্ন চার: ভুল হলে কত হারাবেন, আর সেটা সহ্য হবে?</li>
<li>প্রশ্ন পাঁচ: কেন আজ, আর কেন এই দামে?</li>
</ul>
</div>

<h2>ক্রমটা কেন গুরুত্বপূর্ণ</h2>

${mount("buy-steps")}

<p>খেয়াল করুন প্রথম দুইটা প্রশ্নে দামের কথা নেই। কারণ দাম দিয়ে শুরু করলে আপনি সবসময় একটা যুক্তি খুঁজে পাবেন। মানুষের মন আশ্চর্য রকম দক্ষ যে সিদ্ধান্ত সে নিয়েই ফেলেছে তার পক্ষে কারণ বানাতে। ক্রমটা সেই দক্ষতাকে কাজে লাগতে দেয় না।</p>

<h2>প্রশ্ন এক: টাকাটা কি সত্যিই মুক্ত</h2>

<p>এটা কোম্পানি নিয়ে প্রশ্ন নয়, আপনার জীবন নিয়ে। যে টাকা আগামী তিন বছরের মধ্যে লাগতে পারে, সেটা শেয়ারে গেলে আপনি ঠিক সেই সময়ে বেচতে বাধ্য হবেন যখন বাজার খারাপ, কারণ প্রয়োজন আর বাজার আলাদা ক্যালেন্ডারে চলে।</p>

<p><a class="term" href="/money/start/money-first.html">প্রথমে টাকার ঘর গোছান</a> লেখাটায় এই ক্রমটা বসানো আছে: জরুরি তহবিল আগে, বেশি সুদের ঋণ শোধ আগে, তারপর বিনিয়োগ। এই প্রশ্নে না হলে বাকি চারটা প্রশ্নের উত্তর জেনে লাভ নেই।</p>

<h2>প্রশ্ন দুই: কোম্পানিটা কী করে</h2>

<p>তিন বাক্যে লিখুন: কোম্পানিটা কী বেচে, কে কেনে, আর টাকাটা কোথা থেকে আসে। লিখতে না পারলে আপনি কোম্পানিটা বোঝেননি, আর যা বোঝেননি তাতে টাকা রাখা জুয়া, খারাপ জুয়া, কারণ ক্যাসিনো অন্তত নিয়মগুলো বলে দেয়।</p>

<div class="ex">
<p><strong>তিন বাক্য, একটা উদাহরণ।</strong> কোম্পানিটা সিমেন্ট বানায় আর দেশের ভেতরে বেচে। ক্রেতা মূলত ঠিকাদার আর ব্যক্তিগত বাড়ি নির্মাতারা। আয় আসে টনপ্রতি দাম আর বিক্রির পরিমাণ থেকে, আর সবচেয়ে বড় খরচ ক্লিংকার আর জ্বালানি, দুইটাই আমদানি। এখন আপনি জানেন এই কোম্পানির শত্রু কে: ডলারের দাম আর নির্মাণ খাতের মন্দা।</p>
</div>

<h2>প্রশ্ন তিন: দামটা কি আয় দিয়ে ব্যাখ্যা হয়</h2>

<p><a class="term" href="/money/terms/pe-ratio.html">পিই অনুপাত</a> এখানে প্রথম মোটা ছাঁকনি। কোম্পানির পিই ২০, আর একই খাতের বাকিদের ১০। এখন আপনার কাছে একটা প্রশ্ন আছে যার উত্তর দিতে হবে: এই কোম্পানি কি সত্যিই বাকিদের চেয়ে দ্বিগুণ ভালো, নাকি কেবল বেশি জনপ্রিয়?</p>

<p>এই প্রশ্নের উত্তর প্রায়ই না, আর মাঝেমধ্যে হ্যাঁ। যেসব ক্ষেত্রে হ্যাঁ, সেখানে কারণটা লিখে রাখা যায়: বেশি লাভের হার, বেশি বৃদ্ধি, কম ঋণ, শক্ত ব্র্যান্ড। কারণটা লিখতে না পারলে উত্তরটা না।</p>

<h2>প্রশ্ন চার: ভুল হলে কী হবে</h2>

<p>এই প্রশ্নটাই সবচেয়ে বেশি এড়িয়ে যাওয়া হয়। ধরে নিন আপনার যুক্তি ভুল, আর দামটা ৩০% পড়ে গেল। আপনার পুরো টাকার কত অংশ এই একটা শেয়ারে আছে? পুরো পোর্টফোলিওতে সেটা কত ক্ষতি?</p>

${mount("buy-lab")}

<p>একটা কাজের নিয়ম: <strong>একটা সিদ্ধান্ত ভুল হলে আপনার মোট টাকার ২% এর বেশি যাওয়া উচিত নয়।</strong> এতে টানা পাঁচটা ভুল করলেও আপনি খেলায় থাকেন। যারা সব টাকা একটা শেয়ারে ঢালেন তাদের একবার ভুল করার সুযোগও থাকে না, আর প্রথম বছরে ভুল হবেই।</p>

<h2>প্রশ্ন পাঁচ: কেন আজ</h2>

<p>উত্তরটা যদি হয় দাম উঠছে, সেটা কেনার কারণ নয়, সেটা <a class="term" href="/money/basics-2/crowd-behaviour.html">ভিড়ের আচরণ</a>। উত্তরটা যদি হয় কেউ বলেছে, তাহলে সেই কেউ কী জানেন আর কেন আপনাকে বলছেন, এই দুইটা প্রশ্ন আগে। উত্তরটা যদি হয় এই মাসের টাকা রাখার দিন আজ, তাহলে সেটাই সবচেয়ে ভালো উত্তর, কারণ সেটা একটা নিয়ম, একটা আবেগ নয়।</p>

${mount("buy-order")}

<h2>অর্ডারটা শেষে</h2>

<p>পাঁচটা প্রশ্নে হ্যাঁ হলে তবেই <a class="term" href="/money/basics-2/order-types.html">অর্ডারের</a> কথা। লিমিট অর্ডার, বাজার দামের কাছাকাছি, আর পুরো অঙ্কটা একবারে নয়। বিশেষ করে প্রথম কয়েকবার, অবস্থানটা দুই বা তিন কিস্তিতে বানানো ভালো: আপনি ভুল হলে কম হারাবেন, আর ঠিক হলে সামান্য কম পাবেন। এই বিনিময়টা নতুনদের জন্য প্রায় সবসময় লাভজনক।</p>

<div class="checklist">
<ul>
<li>পাঁচটা প্রশ্নের উত্তর লিখে ফেলুন, মাথায় নয়, কাগজে বা ফাইলে।</li>
<li>কোম্পানিটা কী করে, তিন বাক্যে লিখুন, দেখার জন্য নয়, নিজের জন্য।</li>
<li>এই একটা শেয়ারে সর্বোচ্চ কত টাকা রাখবেন সেটা আগে ঠিক করুন।</li>
<li>ভুল প্রমাণ হলে কোন তথ্যে বুঝবেন, সেটা এখনই লিখুন।</li>
</ul>
</div>

${mount("buy-quiz")}
`,
  en: `
<p>Almost everybody makes the buying decision backwards. First they hear a name, then they look for a reason. The right order is the reverse: your own situation first, then the company, then the price, and the order ticket last of all.</p>

<p>This lesson gives you five questions. They are in sequence, and the sequence is the point: if one of them fails there is no need to reach the next. This will not pick good shares for you, but it will stop most bad decisions, and for a new investor the second is worth more.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Question one: can this money really sit untouched for three years?</li>
<li>Question two: can you say what the company does in three sentences?</li>
<li>Question three: do the earnings explain the price?</li>
<li>Question four: if you are wrong, how much goes, and can you take it?</li>
<li>Question five: why today, and why at this price?</li>
</ul>
</div>

<h2>Why the sequence matters</h2>

${mount("buy-steps")}

<p>Notice that the first two questions do not mention price. Because if you start from the price you will always find a reason. The human mind is remarkably good at manufacturing arguments for decisions it has already made. The sequence denies that talent a place to work.</p>

<h2>Question one: is the money genuinely free</h2>

<p>This is not a question about the company, it is a question about your life. Money you might need within three years, put into shares, forces you to sell at exactly the wrong moment, because needs and markets run on separate calendars.</p>

<p>The lesson <a class="term" href="/money/start/money-first.html">get the money side in order first</a> sets out the sequence: emergency fund first, expensive debt cleared next, investing after that. If this question fails, knowing the answers to the other four buys you nothing.</p>

<h2>Question two: what does the company do</h2>

<p>Write three sentences: what it sells, who buys it, and where the money comes from. If you cannot write them, you have not understood the company, and putting money into what you do not understand is gambling, and worse gambling than a casino, because a casino at least tells you the rules.</p>

<div class="ex">
<p><strong>Three sentences, an example.</strong> The company makes cement and sells it inside the country. The buyers are mainly contractors and people building private houses. Revenue comes from price per tonne and volume sold, and the largest costs are clinker and fuel, both imported. Now you know who this company's enemies are: the dollar, and a slowdown in construction.</p>
</div>

<h2>Question three: do the earnings explain the price</h2>

<p>The <a class="term" href="/money/terms/pe-ratio.html">PE ratio</a> is the first coarse filter here. The company is on 20, the rest of its sector is on 10. You now have a question you must answer: is this company genuinely twice as good as the others, or merely more popular?</p>

<p>The answer is usually no and occasionally yes. Where it is yes, the reason can be written down: higher margins, faster growth, less debt, a stronger brand. If you cannot write the reason, the answer is no.</p>

<h2>Question four: what happens if you are wrong</h2>

<p>This is the question most often skipped. Assume your reasoning is wrong and the price falls 30%. What share of your total money is in this one holding? What does that do to the whole portfolio?</p>

${mount("buy-lab")}

<p>A workable rule: <strong>no single decision going wrong should cost more than about 2% of your total money.</strong> That way five consecutive mistakes still leave you in the game. Someone who puts everything into one share does not have room for even one mistake, and in a first year mistakes are certain.</p>

<h2>Question five: why today</h2>

<p>If the answer is that the price is rising, that is not a reason to buy, that is <a class="term" href="/money/basics-2/crowd-behaviour.html">crowd behaviour</a>. If the answer is that somebody told you, then two questions come first: what do they know, and why are they telling you. If the answer is that today is the day you put money in every month, that is the best answer of all, because it is a rule rather than a feeling.</p>

${mount("buy-order")}

<h2>The order comes last</h2>

<p>Only when all five questions pass do you think about the <a class="term" href="/money/basics-2/order-types.html">order</a>. A limit order, close to the market price, and not the whole amount at once. For the first few especially, building the position in two or three instalments is better: you lose less if you are wrong and gain slightly less if you are right. For a beginner that trade is almost always worth taking.</p>

<div class="checklist">
<ul>
<li>Write the five answers down, on paper or in a file, not in your head.</li>
<li>Write the three sentences about what the company does, for yourself rather than for show.</li>
<li>Decide the maximum you will ever hold in this one share, before you buy any.</li>
<li>Write down now what evidence would tell you that you were wrong.</li>
</ul>
</div>

${mount("buy-quiz")}
`,
  blocks: {
    "buy-steps": {
      kind: "figure",
      shape: "steps",
      title: { bn: "পাঁচটা প্রশ্ন, ক্রমানুসারে", en: "Five questions, in order" },
      note: { bn: "কোনো একটায় না হলে থামুন। পরের ধাপে যাওয়া মানে নিজেকে ফাঁকি দেওয়া।", en: "If one fails, stop. Going on to the next step is only fooling yourself." },
      parts: [
        { text: { bn: "টাকাটা কি মুক্ত", en: "Is the money free" }, note: { bn: "তিন বছর ছোঁয়ার দরকার হবে না, এটা নিশ্চিত?", en: "Certain you will not need to touch it for three years?" } },
        { text: { bn: "কোম্পানিটা কী করে", en: "What does it do" }, note: { bn: "কী বেচে, কে কেনে, টাকা কোথা থেকে আসে", en: "What it sells, who buys, where the money comes from" } },
        { text: { bn: "দামটা ব্যাখ্যা হয়", en: "Does the price add up" }, note: { bn: "আয়ের তুলনায় দাম, আর একই খাতের বাকিদের তুলনায়", en: "Price against earnings, and against the rest of the sector" } },
        { text: { bn: "ভুল হলে কী", en: "What if you are wrong" }, note: { bn: "মোট টাকার কত অংশ, আর ৩০% পড়লে কত", en: "What share of the total, and what a 30% fall costs" }, tone: "warn" },
        { text: { bn: "কেন আজ", en: "Why today" }, note: { bn: "নিয়ম নাকি আবেগ, এই একটাই আসল প্রশ্ন", en: "A rule or a feeling: that is the whole question" }, tone: "lead" },
      ],
      caption: {
        bn: "পাঁচটাই হ্যাঁ হলে তবেই অর্ডারের পর্দা খুলুন। ক্রমটা আপনাকে ধীর করে দেয়, আর ধীর হওয়াটাই এখানে সুবিধা।",
        en: "Only open the order screen when all five say yes. The sequence slows you down, and slow is the advantage here.",
      },
    },
    "buy-lab": {
      kind: "lab",
      model: "position-size",
      title: { bn: "কতটা কিনবেন", en: "How much to buy" },
      note: { bn: "মোট টাকা আর ঝুঁকির শতাংশ বসান। যন্ত্রটা বলে দেবে কতগুলো শেয়ার।", en: "Set your total money and the percentage you will risk. The tool works out the number of shares." },
      preset: { capital: 300000, risk: 2, entry: 60, stop: 42 },
    },
    "buy-order": {
      kind: "order",
      title: { bn: "কেনার আগের ক্রমটা সাজান", en: "Put the sequence before a purchase in order" },
      note: { bn: "প্রথম থেকে শেষ, যেভাবে হওয়া উচিত।", en: "First to last, as it ought to happen." },
      items: [
        {
          text: { bn: "জরুরি তহবিল আর বেশি সুদের ঋণের হিসাব মিলিয়ে নিন", en: "Settle the emergency fund and any expensive debt" },
          why: { bn: "এটা কোম্পানির প্রশ্নের আগে, কারণ এটা আপনার প্রশ্ন।", en: "This comes before any question about a company, because it is a question about you." },
        },
        {
          text: { bn: "কোম্পানিটা কী করে, তিন বাক্যে লিখুন", en: "Write three sentences on what the company does" },
          why: { bn: "লিখতে না পারলে বাকিটা অনুমান।", en: "If you cannot write them, everything after is guesswork." },
        },
        {
          text: { bn: "আয়ের সঙ্গে দাম মিলিয়ে দেখুন, আর একই খাতের বাকিদের সঙ্গেও", en: "Check the price against earnings, and against the sector" },
          why: { bn: "ভালো কোম্পানি আর ভালো কেনা এক জিনিস নয়।", en: "A good company and a good purchase are not the same thing." },
        },
        {
          text: { bn: "এই শেয়ারে সর্বোচ্চ কত টাকা, সেটা ঠিক করুন", en: "Decide the maximum amount for this one share" },
          why: { bn: "কেনার পরে এই সংখ্যাটা ঠিক করা মানে আবেগ দিয়ে ঠিক করা।", en: "Deciding this after you buy means deciding it with your feelings." },
        },
        {
          text: { bn: "ভুল প্রমাণ হলে কোন তথ্যে বুঝবেন, লিখুন", en: "Write down what evidence would prove you wrong" },
          why: { bn: "এটাই পরে বেচার সিদ্ধান্তটাকে সহজ করে দেবে।", en: "This is what makes the eventual selling decision easy." },
        },
        {
          text: { bn: "লিমিট অর্ডার দিন, পুরোটা একবারে নয়", en: "Send a limit order, and not the whole amount at once" },
          why: { bn: "অর্ডার শেষ ধাপ, প্রথম নয়।", en: "The order is the last step, not the first." },
        },
      ],
    },
    "buy-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা পরিস্থিতি", en: "Three situations" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানির পিই ৯, খাতের গড় ১৪। আপনি কোম্পানিটা সম্পর্কে কিছুই জানেন না। কী করবেন?",
            en: "A company trades on a PE of 9 while its sector averages 14. You know nothing else about it. What now?",
          },
          options: [
            {
              text: { bn: "সস্তা, তাই কিনে ফেলি", en: "It is cheap, so buy it" },
              why: {
                bn: "কম পিই সস্তা হওয়ার প্রমাণ নয়, একটা প্রশ্ন। বাজার এটাকে কম দাম দিচ্ছে কেন, তার কারণ থাকতে পারে: পড়তে থাকা আয়, ঋণের বোঝা, বা শাসনব্যবস্থা নিয়ে সন্দেহ।",
                en: "A low PE is not evidence of cheapness, it is a question. The market may be pricing it low for a reason: falling earnings, a debt load, or doubts about governance.",
              },
            },
            {
              text: { bn: "কোম্পানিটা কী করে সেটা আগে বের করি", en: "Find out what the company does first" },
              right: true,
              why: {
                bn: "ঠিক, আর ক্রমের কারণটাই এটা। প্রশ্ন দুই প্রশ্ন তিনের আগে। কম পিই তখনই সুযোগ যখন আপনি জানেন কেন বাজার ভুল করছে।",
                en: "Right, and this is exactly why the sequence exists. Question two comes before question three. A low PE is an opportunity only when you can say why the market is wrong.",
              },
            },
            {
              text: { bn: "খাতের গড়ের সঙ্গে মিলে গেলে কিনব", en: "Wait until it matches the sector average" },
              why: {
                bn: "এটা একটা নিয়ম বটে, কিন্তু ভিত্তিহীন। দাম উঠলেই কোম্পানিটা ভালো হয়ে যায় না, আর অপেক্ষা করাটা এখানে কোনো তথ্য যোগ করছে না।",
                en: "That is a rule, but a groundless one. A company does not become better because its price rose, and waiting adds no information here.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "আপনার মোট বিনিয়োগযোগ্য টাকা ৩ লাখ। একটা শেয়ারে সর্বোচ্চ কত রাখা যুক্তিসঙ্গত, যদি আপনি ৩০% পতনে ২% এর বেশি হারাতে না চান?",
            en: "You have 300,000 to invest in total. What is a sensible maximum in one share if a 30% fall must not cost you more than 2%?",
          },
          options: [
            {
              text: { bn: "প্রায় ২০,০০০ টাকা", en: "About 20,000 taka" },
              right: true,
              why: {
                bn: "ঠিক। ২% এর ৩ লাখ হলো ৬,০০০ টাকা, আর ৬,০০০ যদি ৩০% পতন হয়, তাহলে অবস্থানটা ২০,০০০। সংখ্যাটা ছোট মনে হয়, আর সেটাই এই হিসাবের কাজ।",
                en: "Right. 2% of 300,000 is 6,000, and if 6,000 is a 30% fall then the position is 20,000. The number feels small, and making it feel small is what the calculation is for.",
              },
            },
            {
              text: { bn: "৬০,০০০ টাকা", en: "60,000 taka" },
              why: {
                bn: "৬০,০০০ এর ৩০% হলো ১৮,০০০, যা ৩ লাখের ৬%। তিনটা এমন ভুল হলে আপনার প্রায় পঞ্চমাংশ চলে যায়, আর প্রথম বছরে তিনটা ভুল অস্বাভাবিক নয়।",
                en: "30% of 60,000 is 18,000, which is 6% of 300,000. Three such mistakes take nearly a fifth of your money, and three mistakes in a first year is not unusual.",
              },
            },
            {
              text: { bn: "যত খুশি, কারণ ভালো কোম্পানি পড়ে না", en: "As much as you like, because good companies do not fall" },
              why: {
                bn: "ভালো কোম্পানিও পড়ে, আর মাঝেমধ্যে অর্ধেক হয়ে যায়। ২০১০ সালে বাংলাদেশের সবচেয়ে বড় নামগুলোও পড়েছিল। অবস্থানের আকার কোম্পানির মান দিয়ে ঠিক হয় না, ভুল হওয়ার সম্ভাবনা দিয়ে হয়।",
                en: "Good companies fall too, and sometimes they halve. The largest names here fell in 2010 like everything else. Position size is set by the chance of being wrong, not by the quality of the company.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "পাঁচটা প্রশ্নের কোনটা সবচেয়ে বেশি এড়িয়ে যাওয়া হয়?",
            en: "Which of the five questions is skipped most often?",
          },
          options: [
            {
              text: { bn: "টাকাটা মুক্ত কি না", en: "Whether the money is free" },
              why: {
                bn: "এটা এড়ানো হয় বটে, কিন্তু মানুষ অন্তত জানেন যে তাদের টাকার দরকার পড়তে পারে। বাস্তবে চার নম্বর প্রশ্নটাই সবচেয়ে কম জিজ্ঞেস করা হয়।",
                en: "It gets skipped, but people at least know their money might be needed. In practice question four is the one asked least.",
              },
            },
            {
              text: { bn: "ভুল হলে কী হবে", en: "What happens if you are wrong" },
              right: true,
              why: {
                bn: "ঠিক। কেনার সময় মানুষ ঠিক হওয়ার ছবিটা দেখেন, ভুল হওয়ার ছবিটা নয়। এই একটা প্রশ্ন অবস্থানের আকার ঠিক করে দেয়, আর অবস্থানের আকারই প্রথম বছরে বেঁচে থাকা ঠিক করে।",
                en: "Right. When buying, people picture being right rather than being wrong. This single question sets the position size, and position size is what decides whether you survive a first year.",
              },
            },
            {
              text: { bn: "কেন আজ", en: "Why today" },
              why: {
                bn: "এটাও এড়ানো হয়, কিন্তু সাধারণত মানুষের কাছে একটা উত্তর থাকে, এমনকি সেটা দুর্বল হলেও। চার নম্বরে বেশিরভাগের কোনো উত্তরই থাকে না।",
                en: "Also skipped, but people usually have some answer, even a weak one. On question four most people have no answer at all.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"when-to-sell": {
  bn: `
<p>কেনার নিয়ম নিয়ে সবাই কথা বলে। বেচার নিয়ম নিয়ে প্রায় কেউ বলে না, অথচ বেশিরভাগ মানুষের টাকা এখানেই যায়। কারণটা সহজ: কেনার সময় কেবল আশা থাকে, আর বেচার সময় লাভ বা লোকসান থাকে, আর দুইটাই চিন্তাকে বিকৃত করে।</p>

<p>এই লেখাটা একটা কড়া অবস্থান নেয়: <strong>বেচার বৈধ কারণ তিনটা।</strong> এর বাইরে যা কিছু, দাম পড়ে গেছে, দাম বেড়ে গেছে, বিরক্ত লাগছে, কেউ বলেছে, সবই বৈধ কারণ নয়। তিনটা নিয়ম মনে রাখা যায়, আর মনে রাখা যায় বলেই এটা কাজ করে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>কারণ এক: যে যুক্তিতে কিনেছিলেন সেটা আর সত্য নয়।</li>
<li>কারণ দুই: আপনার টাকাটা এখন সত্যিই দরকার।</li>
<li>কারণ তিন: এই একটা শেয়ার পোর্টফোলিওতে বড্ড বড় হয়ে গেছে।</li>
<li>দাম পড়া নিজে বেচার কারণ নয়, আর দাম বাড়াও নয়।</li>
<li>বেচার শর্ত কেনার দিনে লিখে রাখলে সিদ্ধান্তটা সহজ হয়।</li>
</ul>
</div>

<h2>কারণ এক: যুক্তিটা ভেঙে গেছে</h2>

<p>কেনার দিন আপনি তিন বাক্যে লিখেছিলেন কেন কিনছেন। ওই তিন বাক্যের কোনোটা যদি আর সত্য না থাকে, তাহলে বেচার সময় হয়েছে, দাম যাই হোক।</p>

<p>উদাহরণ। আপনি কিনেছিলেন কারণ কোম্পানিটার ঋণ কম আর নগদ প্রবাহ শক্ত। দুই প্রান্তিক পরে দেখা গেল ঋণ দ্বিগুণ হয়েছে আর নগদ প্রবাহ ঋণাত্মক। আপনার যুক্তিটা আর নেই। দাম এখনো আপনার কেনা দামের উপরে থাকতে পারে, তাতে কিছু আসে যায় না: আপনি এখন যা ধরে আছেন সেটা আর সেই জিনিস নয় যা আপনি কিনেছিলেন।</p>

${mount("sell-matrix")}

<p>ছকটার দুইটা ঘর কঠিন, আর ওই দুইটাতেই বেশিরভাগ ভুল হয়। লোকসানে থাকা অথচ যুক্তি অক্ষত, এখানে মানুষ ভয় পেয়ে বেচে দেন। লাভে থাকা অথচ যুক্তি ভেঙে গেছে, এখানে মানুষ লাভের আনন্দে সমস্যাটা দেখতে চান না।</p>

<h2>কারণ দুই: টাকাটা দরকার</h2>

<p>এটা নিয়ে কোনো লজ্জা নেই আর কোনো তত্ত্বও নেই। মেয়ের ভর্তি, চিকিৎসা, বাড়ির কিস্তি, ব্যবসার প্রয়োজন। শেয়ার টাকার একটা রূপ, আর টাকার কাজ হলো দরকারে কাজে লাগা।</p>

<p>একটাই সতর্কতা: এই কারণটা যত কম আসে তত ভালো, আর সেটা নির্ভর করে <a class="term" href="/money/start/money-first.html">জরুরি তহবিলের</a> উপর। যার জরুরি তহবিল আছে তিনি বাজারের সবচেয়ে খারাপ সময়ে বেচতে বাধ্য হন না। যার নেই, তার জন্য বাজার আর জীবন একই সময়ে খারাপ হয়, প্রায় সবসময়।</p>

<h2>কারণ তিন: অবস্থানটা বড্ড বড় হয়ে গেছে</h2>

<p>এটা সবচেয়ে সুখের সমস্যা আর সবচেয়ে কম বোঝা কারণ। আপনি ২০,০০০ টাকার একটা শেয়ার কিনেছিলেন, চার বছরে সেটা ১,২০,০০০ হয়েছে, আর এখন আপনার মোট টাকার ৪০% ওই একটা কোম্পানিতে। কোম্পানিটা ভালোই আছে, আপনার যুক্তিও অক্ষত। তবু কিছু বেচা উচিত।</p>

<p>কারণ <a class="term" href="/money/terms/diversification.html">বৈচিত্র্য</a> একটা শতাংশের ব্যাপার, বিশ্বাসের নয়। ৪০% এক জায়গায় থাকা মানে ওই একটা কোম্পানির একটা দুর্ঘটনা আপনার পুরো পরিকল্পনা বদলে দিতে পারে। কতটা বেচবেন? যতটা বেচলে অবস্থানটা আপনার নিজের ঠিক করা সীমার ভেতর ফিরে আসে, এর বেশি নয়।</p>

${mount("sell-compare")}

<h2>যেগুলো বেচার কারণ নয়</h2>

<p>দাম ২০% পড়েছে। এটা তথ্য, কারণ নয়। প্রশ্নটা হলো কেন পড়েছে। পুরো বাজার পড়েছে, নাকি এই কোম্পানির কিছু হয়েছে? দ্বিতীয়টা হলে কারণ একে ফিরে যান। প্রথমটা হলে আপনার যুক্তির সঙ্গে এর কোনো সম্পর্ক নেই।</p>

<p>দাম ৫০% বেড়েছে। এটাও তথ্য। ভালো কোম্পানির দাম বাড়ে, এটাই তো চাওয়া ছিল। কেবল দাম বাড়ার কারণে বেচলে আপনি সেই একটা শেয়ার হারাবেন যেটা দশ বছরে দশগুণ হতো, আর সেই একটা শেয়ারই সাধারণত পুরো পোর্টফোলিওর ফলাফল ঠিক করে দেয়।</p>

<div class="note">
<p>একটা প্রচলিত ভুল হলো লাভে থাকা শেয়ার বেচে লোকসানে থাকা শেয়ার ধরে রাখা, যাতে হিসাবটা সুন্দর দেখায়। এতে হয় ঠিক উল্টো: ভালোগুলো চলে যায় আর খারাপগুলো থাকে। হিসাবের কাগজে যা সুন্দর দেখায় তা আপনার টাকার জন্য ভালো নাও হতে পারে।</p>
</div>

${mount("sell-reveal")}

<h2>কেনার দিনেই বেচার শর্ত লিখুন</h2>

<p>সবচেয়ে কার্যকর কৌশলটা নিরস: কেনার দিন লিখে রাখুন কোন তিনটা ঘটনা ঘটলে আপনি বেচবেন। ওই দিন আপনার মাথা ঠান্ডা, আপনার কোনো লাভ বা লোকসান নেই, আর আপনি নিজের সঙ্গে সৎ হতে পারেন। ছয় মাস পর, যখন সিদ্ধান্তটা নিতে হবে, তখন আপনার মাথা ঠান্ডা থাকবে না।</p>

<div class="ex">
<p><strong>একটা লেখা বেচার শর্ত।</strong> "আমি বেচব যদি: এক, টানা দুই প্রান্তিকে অপারেটিং নগদ প্রবাহ ঋণাত্মক হয়; দুই, ঋণ ইকুইটির দ্বিগুণ ছাড়ায়; তিন, এই অবস্থান আমার মোট টাকার ২৫% ছাড়িয়ে যায়, তখন কেবল অতিরিক্তটা বেচব।" তিনটাই মাপা যায়, তিনটাই দাম নিয়ে নয়।</p>
</div>

<div class="checklist">
<ul>
<li>আপনার এখনকার প্রতিটা শেয়ারের জন্য বেচার তিনটা শর্ত লিখে ফেলুন।</li>
<li>যেগুলোর যুক্তি আজ আর মনে করতে পারছেন না, সেগুলো আলাদা করুন।</li>
<li>কোনো অবস্থান আপনার সীমা ছাড়িয়ে গেছে কি না দেখুন।</li>
<li>শর্তগুলো ছয় মাস পরে আবার পড়ার জন্য একটা তারিখ ঠিক করুন।</li>
</ul>
</div>

${mount("sell-quiz")}
`,
  en: `
<p>Everybody talks about rules for buying. Almost nobody talks about rules for selling, and yet selling is where most people lose their money. The reason is simple: when you buy there is only hope, and when you sell there is a gain or a loss, and both distort thinking.</p>

<p>This lesson takes a firm position: <strong>there are three legitimate reasons to sell.</strong> Everything else, the price fell, the price rose, you are bored, somebody told you, is not one. Three rules can be remembered, and being memorable is why they work.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Reason one: the argument you bought on is no longer true.</li>
<li>Reason two: you genuinely need the money.</li>
<li>Reason three: this one holding has grown too large in the portfolio.</li>
<li>A falling price is not itself a reason, and neither is a rising one.</li>
<li>Writing the selling conditions on the day you buy makes the decision easy later.</li>
</ul>
</div>

<h2>Reason one: the argument has broken</h2>

<p>On the day you bought, you wrote three sentences saying why. If any of those sentences has stopped being true, it is time to sell, whatever the price is doing.</p>

<p>An example. You bought because the company had little debt and strong cash flow. Two quarters later debt has doubled and cash flow is negative. Your argument no longer exists. The price may still be above what you paid, and that changes nothing: what you now hold is not the thing you bought.</p>

${mount("sell-matrix")}

<p>Two cells of that grid are hard, and they are where most mistakes happen. Sitting on a loss with the argument intact is where people sell out of fear. Sitting on a gain with the argument broken is where the pleasure of the gain stops people looking at the problem.</p>

<h2>Reason two: you need the money</h2>

<p>There is no shame in this and no theory to it. School fees, medical bills, a housing instalment, a need in the business. Shares are a form of money, and the job of money is to be there when it is needed.</p>

<p>One caution only: the less often this reason arrives the better, and that depends on the <a class="term" href="/money/start/money-first.html">emergency fund</a>. Someone with one is not forced to sell at the market's worst moment. Someone without one finds that markets and lives go wrong at the same time, almost always.</p>

<h2>Reason three: the position has grown too large</h2>

<p>This is the happiest problem and the least understood reason. You bought 20,000 taka of a share, four years later it is worth 120,000, and it is now 40% of your total money. The company is fine and your argument is intact. You should still sell some.</p>

<p>Because <a class="term" href="/money/terms/diversification.html">diversification</a> is a matter of percentages, not of belief. Having 40% in one place means one accident at one company can rewrite your whole plan. How much do you sell? Enough to bring the position back inside the limit you set yourself, and no more.</p>

${mount("sell-compare")}

<h2>What is not a reason to sell</h2>

<p>The price is down 20%. That is information, not a reason. The question is why. Did the whole market fall, or did something happen at this company? If the second, go back to reason one. If the first, it has nothing to do with your argument.</p>

<p>The price is up 50%. Also information. Good companies go up; that was the whole idea. Selling merely because the price rose is how you lose the one share that would have gone up tenfold over a decade, and that one share is usually what decides the result of the entire portfolio.</p>

<div class="note">
<p>A common mistake is selling the winners and keeping the losers so that the statement looks tidy. The effect is exactly backwards: the good ones leave and the bad ones stay. What looks neat on a statement is not necessarily good for your money.</p>
</div>

${mount("sell-reveal")}

<h2>Write the selling conditions on the day you buy</h2>

<p>The most effective technique is a dull one: on the day you buy, write down the three events that would make you sell. That day your head is clear, you have no gain or loss, and you can be honest with yourself. Six months later, when the decision actually has to be made, your head will not be clear.</p>

<div class="ex">
<p><strong>A written set of conditions.</strong> "I will sell if: one, operating cash flow is negative for two quarters running; two, debt goes above twice equity; three, this position exceeds 25% of my total money, in which case I sell only the excess." All three are measurable, and none of them is about the price.</p>
</div>

<div class="checklist">
<ul>
<li>Write three selling conditions for every share you currently hold.</li>
<li>Set aside any holding whose original argument you can no longer remember.</li>
<li>Check whether any position has drifted past your own limit.</li>
<li>Pick a date, six months out, to read the conditions again.</li>
</ul>
</div>

${mount("sell-quiz")}
`,
  blocks: {
    "sell-matrix": {
      kind: "figure",
      shape: "matrix",
      title: { bn: "যুক্তি আর দাম, চারটা ঘর", en: "Argument and price, four cells" },
      note: { bn: "সিদ্ধান্তটা বাঁ থেকে ডানে নয়, উপর থেকে নিচে পড়ুন।", en: "Read the decision top to bottom, not left to right." },
      axes: {
        x: [{ bn: "লোকসানে", en: "At a loss" }, { bn: "লাভে", en: "At a gain" }],
        y: [{ bn: "যুক্তি অক্ষত", en: "Argument intact" }, { bn: "যুক্তি ভেঙে গেছে", en: "Argument broken" }],
      },
      parts: [
        { text: { bn: "ধরে রাখুন, বা আরও কিনুন", en: "Hold, or buy more" }, note: { bn: "সবচেয়ে কঠিন ঘর। এখানেই মানুষ ভয়ে বেচে দেন।", en: "The hardest cell. This is where fear makes people sell." }, tone: "good" },
        { text: { bn: "ধরে রাখুন", en: "Hold" }, note: { bn: "সবচেয়ে সহজ ঘর, আর এখানেই মানুষ তাড়াতাড়ি বেচে ফেলেন।", en: "The easiest cell, and where people sell far too early." }, tone: "good" },
        { text: { bn: "বেচুন", en: "Sell" }, note: { bn: "লোকসানে বেচা কষ্টকর, কিন্তু যুক্তি নেই মানে ধরে রাখার কারণও নেই।", en: "Selling at a loss hurts, but no argument means no reason to hold." }, tone: "bad" },
        { text: { bn: "বেচুন", en: "Sell" }, note: { bn: "লাভটা আপনাকে সমস্যাটা দেখতে দেয় না। এটাই সবচেয়ে দামি ফাঁদ।", en: "The gain stops you seeing the problem. This is the costliest trap." }, tone: "bad" },
      ],
      caption: {
        bn: "খেয়াল করুন, উপরের সারিতে দাম যাই হোক সিদ্ধান্ত এক, আর নিচের সারিতেও। দাম ঘরটা বদলায় না, যুক্তি বদলায়।",
        en: "Notice that the decision is the same across the top row whatever the price does, and the same across the bottom. The price does not move you between cells; the argument does.",
      },
    },
    "sell-compare": {
      kind: "compare",
      title: { bn: "তিনটা বৈধ কারণ, পাশাপাশি", en: "The three legitimate reasons, side by side" },
      columns: [
        { bn: "যুক্তি ভেঙেছে", en: "Argument broken" },
        { bn: "টাকা দরকার", en: "Money needed" },
        { bn: "অবস্থান বড়", en: "Position too large" },
      ],
      rows: [
        {
          label: { bn: "কতটা বেচবেন", en: "How much to sell" },
          cells: [{ bn: "পুরোটা", en: "All of it" }, { bn: "যতটা লাগবে", en: "As much as you need" }, { bn: "কেবল অতিরিক্তটা", en: "Only the excess" }],
        },
        {
          label: { bn: "দাম দেখে সিদ্ধান্ত?", en: "Does the price decide?" },
          cells: [{ bn: "না", en: "No" }, { bn: "না", en: "No" }, { bn: "না", en: "No" }],
        },
        {
          label: { bn: "আগে থেকে ঠেকানো যায়?", en: "Can it be prevented?" },
          cells: [
            { bn: "না, কিন্তু আগেই ধরা যায়", en: "No, but it can be spotted early" },
            { bn: "হ্যাঁ, জরুরি তহবিল দিয়ে", en: "Yes, with an emergency fund" },
            { bn: "হ্যাঁ, সীমা ঠিক করে", en: "Yes, by setting a limit" },
          ],
        },
        {
          label: { bn: "কত ঘন ঘন আসে", en: "How often it arises" },
          cells: [{ bn: "বছরে দুই একবার", en: "Once or twice a year" }, { bn: "যত কম তত ভালো", en: "The less the better" }, { bn: "ভালো চললে প্রতি বছর", en: "Yearly, if things go well" }],
        },
      ],
    },
    "sell-reveal": {
      kind: "reveal",
      title: { bn: "একটা সিদ্ধান্ত", en: "One decision" },
      ask: {
        bn: "আপনি একটা কোম্পানি কিনেছিলেন কারণ তার লভ্যাংশ স্থির আর ঋণ কম। দুই বছরে দাম ৭০% বেড়েছে, কোম্পানির ঋণ এখনো কম, লভ্যাংশ বেড়েছে। কিন্তু এই একটা শেয়ার এখন আপনার মোট টাকার ৩৫%। কী করবেন?",
        en: "You bought a company because its dividend was steady and its debt low. In two years the price is up 70%, debt is still low and the dividend has grown. But this one share is now 35% of your total money. What do you do?",
      },
      choices: [
        { bn: "পুরোটা বেচে দিই, ৭০% লাভ যথেষ্ট", en: "Sell it all, a 70% gain is enough" },
        { bn: "কিছুই করি না, কোম্পানিটা তো ভালোই আছে", en: "Do nothing, the company is fine" },
        { bn: "কিছু অংশ বেচে অবস্থানটা সীমার ভেতর আনি", en: "Sell part of it, back to my limit" },
      ],
      answer: {
        bn: "কিছু অংশ বেচুন, ঠিক যতটা বেচলে অবস্থানটা আপনার নিজের ঠিক করা সীমায় ফিরে আসে।",
        en: "Sell part of it, exactly enough to bring the position back to the limit you set yourself.",
      },
      why: {
        bn: "প্রথম উত্তরটা কারণ এক আর তিনকে গুলিয়ে ফেলে: যুক্তিটা অক্ষত, তাই পুরোটা বেচার কারণ নেই, আর লাভের পরিমাণ কখনোই বেচার কারণ নয়। দ্বিতীয় উত্তরটা কারণ তিনকে অস্বীকার করে: কোম্পানির মান যাই হোক, ৩৫% এক জায়গায় থাকা মানে একটা দুর্ঘটনা আপনার পুরো পরিকল্পনা বদলে দিতে পারে। তৃতীয়টা দুইটাকেই সম্মান করে। আর গুরুত্বপূর্ণ কথা: সীমাটা আজ ঠিক করা নয়, কেনার দিনেই ঠিক করা উচিত ছিল, তাহলে এখন এটা একটা হিসাব হতো, একটা সিদ্ধান্ত নয়।",
        en: "The first answer confuses reasons one and three: the argument is intact, so there is no case for selling all of it, and the size of a gain is never a reason. The second denies reason three: whatever the quality of the company, 35% in one place means one accident can rewrite your plan. The third respects both. And the important part: the limit should have been set on the day you bought, not today. Then this would be an arithmetic problem rather than a decision.",
      },
    },
    "sell-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার একটা শেয়ার ২৫% পড়েছে। পুরো বাজারও একই সময়ে ২৩% পড়েছে। কোম্পানির খবরে নতুন কিছু নেই। কী করবেন?",
            en: "One of your shares is down 25%. The whole market is down 23% over the same period. There is no new company news. What do you do?",
          },
          options: [
            {
              text: { bn: "বেচে দিই, আরও পড়ার আগে", en: "Sell, before it falls further" },
              why: {
                bn: "কোন যুক্তিতে? তিনটা কারণের একটাও এখানে নেই। যুক্তি অক্ষত, টাকার দরকার নেই, অবস্থান বড় হয়নি। দাম পড়া নিজে তথ্য, কারণ নয়, আর আরও পড়ার ভয় একটা অনুমান।",
                en: "On what grounds? None of the three reasons applies. The argument is intact, you do not need the money, the position has not grown. A falling price is information, not a reason, and the fear of a further fall is a guess.",
              },
            },
            {
              text: { bn: "কিছুই করি না, আর যুক্তিটা আরেকবার পড়ি", en: "Do nothing, and reread the argument" },
              right: true,
              why: {
                bn: "ঠিক। বাজারের সঙ্গে পড়া মানে আপনার কোম্পানির কিছু হয়নি, কেবল সবার দাম কমেছে। যুক্তিটা আরেকবার পড়া দরকার কারণ এই মুহূর্তগুলোতেই বোঝা যায় আপনি কারণটা জানেন নাকি কেবল দামটা দেখছিলেন।",
                en: "Right. Falling with the market means nothing happened at your company, only that everything is priced lower. Rereading the argument matters because moments like this reveal whether you knew your reason or were only watching the price.",
              },
            },
            {
              text: { bn: "আরও কিনি, কারণ সস্তা হয়েছে", en: "Buy more, because it is cheaper" },
              why: {
                bn: "এটা বৈধ হতে পারে, কিন্তু শর্তসহ। আপনার মাসিক নিয়মের ভেতরে হলে ঠিক আছে। কিন্তু কেবল পড়েছে বলে অতিরিক্ত টাকা ঢাললে আপনি অবস্থানটাকে সীমার বাইরে নিয়ে যেতে পারেন, আর তখন কারণ তিন তৈরি করে ফেলবেন।",
                en: "This can be legitimate, with conditions. Inside your monthly rule it is fine. But putting in extra money merely because it fell can push the position past your limit, and then you have manufactured reason three for yourself.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কোন অভ্যাসটা দীর্ঘমেয়াদে সবচেয়ে বেশি ক্ষতি করে?",
            en: "Which habit does the most long-term damage?",
          },
          options: [
            {
              text: { bn: "লাভে থাকা শেয়ার বেচে লোকসানে থাকাগুলো ধরে রাখা", en: "Selling the winners and holding the losers" },
              right: true,
              why: {
                bn: "ঠিক। এতে ভালো ব্যবসাগুলো পোর্টফোলিও ছেড়ে যায় আর খারাপগুলো থেকে যায়, বছরের পর বছর। দীর্ঘমেয়াদে একটা পোর্টফোলিওর প্রায় পুরো ফলাফল আসে অল্প কয়েকটা বড় বিজয়ী থেকে, আর এই অভ্যাসটা ঠিক সেগুলোকেই কেটে ফেলে।",
                en: "Right. It removes the good businesses from the portfolio and keeps the bad ones, year after year. Over a long period almost all of a portfolio's result comes from a few big winners, and this habit cuts exactly those out.",
              },
            },
            {
              text: { bn: "বছরে একবার পোর্টফোলিও দেখা", en: "Looking at the portfolio only once a year" },
              why: {
                bn: "এটা আসলে বেশিরভাগ মানুষের জন্য ভালো অভ্যাস। ঘন ঘন দেখলে ঘন ঘন নাড়াচাড়ার ইচ্ছা হয়, আর নাড়াচাড়ার খরচ আছে।",
                en: "For most people this is actually a good habit. Looking often creates the urge to act often, and acting has costs.",
              },
            },
            {
              text: { bn: "লভ্যাংশ আবার বিনিয়োগ করা", en: "Reinvesting dividends" },
              why: {
                bn: "এটা ক্ষতিকর নয়, বরং চক্রবৃদ্ধির অন্যতম প্রধান ইঞ্জিন। প্রশ্নটা কেবল কোথায় আবার বিনিয়োগ করছেন।",
                en: "Not damaging at all; it is one of the main engines of compounding. The only question is where you reinvest.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"why-hold": {
  bn: `
<p>বিনিয়োগের সবচেয়ে কম আলোচিত দক্ষতাটা হলো কিছু না করা। কেনা উত্তেজনাপূর্ণ, বেচা নাটকীয়, আর ধরে রাখা বিরক্তিকর। অথচ যে টাকাটা সত্যিই বড় হয়, সেটা বড় হয় ওই বিরক্তিকর বছরগুলোতে যখন আপনি কিছুই করেননি।</p>

<p>এই লেখাটা একটা কথা প্রমাণ করার চেষ্টা করে: <strong>ধরে রাখা নিষ্ক্রিয়তা নয়, এটা একটা সিদ্ধান্ত, আর প্রতিদিন নতুন করে নেওয়া সিদ্ধান্ত।</strong> পার্থক্যটা হলো, এই সিদ্ধান্তের কোনো বোতাম নেই, তাই এটা নিতে হয় ইচ্ছা করে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>চক্রবৃদ্ধি সময় চায়, আর সময় মানে হাত না দেওয়া।</li>
<li>বাজারের সবচেয়ে ভালো দিনগুলো সবচেয়ে খারাপ দিনগুলোর কাছাকাছি আসে।</li>
<li>ভালো দিন কয়েকটা মিস করলে দীর্ঘমেয়াদি ফল অনেকটা কমে যায়।</li>
<li>ধরে রাখা মানে চোখ বন্ধ রাখা নয়; বছরে একবার যাচাই করাই যথেষ্ট।</li>
<li>যে অবস্থান আপনাকে রোজ দেখতে বাধ্য করে, সেটা আপনার জন্য বড্ড বড়।</li>
</ul>
</div>

<h2>চক্রবৃদ্ধির শেষ বছরগুলোই আসল</h2>

<p><a class="term" href="/money/terms/compounding.html">চক্রবৃদ্ধির</a> সবচেয়ে অদ্ভুত বৈশিষ্ট্য হলো এর বেশিরভাগ কাজ শেষে হয়। প্রথম দশ বছরে যা জমে, বিশ বছরের মাথায় সেটাকে ছোট মনে হয়, কারণ শেষ কয়েক বছরে প্রতি বছরের বৃদ্ধিটা আগের পুরো জমার উপর বসে।</p>

${mount("hold-chart")}

<p>ছবিটা যা বলছে তা হলো: মাঝপথে বেরিয়ে যাওয়া মানে সবচেয়ে দামি অংশটা ছেড়ে দেওয়া। অনেকে দশ বছর ধৈর্য ধরেন আর তারপর ক্লান্ত হয়ে বেরিয়ে যান, ঠিক সেই সময়ে যখন অঙ্কটা কাজ করতে শুরু করেছে।</p>

<h2>ভালো দিনগুলো খারাপ দিনগুলোর পাশে বসে</h2>

<p>বাজারের সবচেয়ে বড় উত্থানের দিনগুলো সাধারণত বড় পতনের কয়েক দিনের মধ্যে আসে। এটা কাকতালীয় নয়: আতঙ্কের সময়েই দাম সবচেয়ে বেশি নড়ে, দুই দিকেই। তাই যে মানুষটা পতনের সময় ভয় পেয়ে বেরিয়ে যান, তিনি প্রায় নিশ্চিতভাবে ফেরার আগেই সবচেয়ে বড় দিনগুলো মিস করেন।</p>

${mount("hold-lab")}

<p>যন্ত্রটাতে বছরের সংখ্যাটা কমিয়ে দেখুন। কুড়ি বছর থেকে দশ বছরে নামালে ফলাফল অর্ধেক হয় না, তার চেয়ে অনেক বেশি কমে। এটাই সময়ের অসম শক্তি।</p>

<h2>ধরে রাখা মানে চোখ বন্ধ রাখা নয়</h2>

<p>একটা ভুল বোঝাবুঝি এড়ানো দরকার। ধরে রাখার পক্ষে যুক্তি মানে এই নয় যে আপনি কোম্পানিটার খবর রাখবেন না। মানে হলো আপনি দামের দৈনিক নড়াচড়া দেখে সিদ্ধান্ত নেবেন না।</p>

<p>ব্যবহারিক ছন্দটা এরকম: বছরে একবার, বার্ষিক প্রতিবেদন এলে, আপনার তিন বাক্যের যুক্তিটা মিলিয়ে দেখুন। আর প্রান্তিক ফলাফলে চোখ বুলান, দশ মিনিট। এর বেশি দেখা তথ্য বাড়ায় না, কেবল নাড়াচাড়ার ইচ্ছা বাড়ায়।</p>

<div class="note">
<p>একটা কাজের পরীক্ষা: যদি একটা অবস্থান আপনাকে দিনে একাধিকবার দাম দেখতে বাধ্য করে, তাহলে সমস্যাটা আপনার ধৈর্যে নয়, অবস্থানের আকারে। ছোট করে ফেলুন, তাহলে ঘুমও ফিরবে আর সিদ্ধান্তও ভালো হবে।</p>
</div>

<h2>কেন ধরে রাখা এত কঠিন</h2>

<p>তিনটা কারণ, আর তিনটাই মনস্তাত্ত্বিক। প্রথমত, কিছু না করা মানে দায়িত্ব না নেওয়া বলে মনে হয়, বিশেষ করে যখন দাম পড়ছে। দ্বিতীয়ত, চারপাশের সবাই কিছু না কিছু করছে বলে মনে হয়। তৃতীয়ত, একটা লাভ হাতে থাকলে সেটা হারানোর ভয় তৈরি হয়, আর ভয় ধৈর্যের চেয়ে জোরে কথা বলে।</p>

${mount("hold-reveal")}

<h2>যা ধরে রাখা উচিত নয়</h2>

<p>ধরে রাখার পক্ষে যুক্তি একটা শর্তে দাঁড়ানো: জিনিসটা ধরে রাখার মতো। যে কোম্পানির যুক্তি ভেঙে গেছে সেটা ধরে রাখা ধৈর্য নয়, জেদ। <a class="term" href="/money/basics-2/when-to-sell.html">বেচার তিনটা বৈধ কারণের</a> লেখাটা এই সীমারেখাটা টানে, আর দুইটা লেখা একসঙ্গে পড়া উচিত।</p>

<p>সবচেয়ে সাধারণ ভুলটা হলো ভালো আর খারাপকে উল্টো করে ফেলা: বিজয়ীগুলো তাড়াতাড়ি বেচে দেওয়া আর পরাজিতগুলো আশায় ধরে রাখা। ধরে রাখার শৃঙ্খলাটা যেন সেই পরাজিতগুলোর জন্য বরাদ্দ না হয়।</p>

<div class="ex">
<p><strong>একটা হিসাব।</strong> ধরুন আপনি দশটা শেয়ার কিনেছেন, প্রতিটাতে সমান টাকা। দশ বছর পরে তিনটা শূন্যের কাছাকাছি, পাঁচটা মোটামুটি জায়গায় দাঁড়িয়ে, আর দুইটা ছয়গুণ হয়েছে। এই দুইটাই আপনার পুরো ফলাফল। এখন প্রশ্ন: আপনি কি ওই দুইটা ধরে রাখতে পারতেন, যখন তারা তিনগুণে ছিল আর বেচে ফেলার লোভ হচ্ছিল?</p>
</div>

<div class="checklist">
<ul>
<li>আপনার প্রতিটা শেয়ারে গত এক বছরে কতবার হাত দিয়েছেন, গুনে ফেলুন।</li>
<li>বছরে একবার যাচাইয়ের জন্য একটা তারিখ ক্যালেন্ডারে বসান।</li>
<li>যে অবস্থানটা আপনাকে সবচেয়ে বেশি অস্থির করে, তার আকার কমানোর কথা ভাবুন।</li>
<li>দাম দেখার অ্যাপের নোটিফিকেশন বন্ধ করে দিন।</li>
</ul>
</div>

${mount("hold-quiz")}
`,
  en: `
<p>The least discussed skill in investing is doing nothing. Buying is exciting, selling is dramatic, and holding is boring. And yet the money that really grows does so in exactly those boring years when you did nothing at all.</p>

<p>This lesson tries to establish one thing: <strong>holding is not inactivity, it is a decision, and one you take again every day.</strong> The difference is that this decision has no button, so it has to be taken deliberately.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Compounding needs time, and time means keeping your hands off.</li>
<li>The market's best days arrive close to its worst days.</li>
<li>Missing a handful of the best days cuts the long-run result badly.</li>
<li>Holding does not mean closing your eyes; once a year is enough attention.</li>
<li>A position that forces you to look every day is too large for you.</li>
</ul>
</div>

<h2>The last years of compounding are the ones that matter</h2>

<p>The strangest property of <a class="term" href="/money/terms/compounding.html">compounding</a> is that most of its work happens at the end. What accumulates in the first ten years looks small by year twenty, because each year's growth then sits on top of everything already accumulated.</p>

${mount("hold-chart")}

<p>What the picture says is this: leaving halfway means giving up the most valuable part. Plenty of people are patient for ten years and then get tired and leave, at precisely the moment the arithmetic starts working.</p>

<h2>The good days sit beside the bad ones</h2>

<p>The market's largest up days usually arrive within a few days of its largest falls. That is not a coincidence: prices move most during panics, in both directions. So the person who takes fright in a fall and gets out almost certainly misses the biggest days before they return.</p>

${mount("hold-lab")}

<p>Try reducing the number of years in the tool. Going from twenty to ten does not halve the result, it cuts far more than half. That is the uneven power of time.</p>

<h2>Holding does not mean closing your eyes</h2>

<p>One misunderstanding is worth avoiding. The case for holding does not say you should ignore the company's news. It says you should not take decisions from the daily movement of the price.</p>

<p>The practical rhythm is this: once a year, when the annual report arrives, check your three-sentence argument against it. Glance at quarterly results, ten minutes. Looking more often adds no information; it only adds the urge to act.</p>

<div class="note">
<p>A useful test: if a position makes you check the price more than once a day, the problem is not your patience, it is the size of the position. Cut it down and both your sleep and your decisions improve.</p>
</div>

<h2>Why holding is so hard</h2>

<p>Three reasons, and all three are psychological. First, doing nothing feels like refusing responsibility, especially while the price is falling. Second, everybody around you appears to be doing something. Third, a gain in hand creates a fear of losing it, and fear speaks louder than patience.</p>

${mount("hold-reveal")}

<h2>What should not be held</h2>

<p>The case for holding stands on one condition: that the thing is worth holding. Holding a company whose argument has broken is not patience, it is stubbornness. The lesson on <a class="term" href="/money/basics-2/when-to-sell.html">the three legitimate reasons to sell</a> draws that boundary, and the two lessons should be read together.</p>

<p>The commonest mistake is getting good and bad the wrong way round: selling the winners early and holding the losers in hope. Do not let the discipline of holding get allocated to the losers.</p>

<div class="ex">
<p><strong>An arithmetic.</strong> Say you bought ten shares with equal money in each. Ten years later three are close to worthless, five are roughly where they started, and two are up sixfold. Those two are your entire result. Now the question: could you have held those two, back when they were up threefold and selling was tempting?</p>
</div>

<div class="checklist">
<ul>
<li>Count how many times you touched each holding in the past year.</li>
<li>Put one annual review date in your calendar.</li>
<li>Consider cutting the size of whichever position unsettles you most.</li>
<li>Turn off price notifications in your app.</li>
</ul>
</div>

${mount("hold-quiz")}
`,
  blocks: {
    "hold-chart": {
      kind: "chart",
      shape: "bar",
      title: { bn: "প্রতি পাঁচ বছরে কত যোগ হলো", en: "What each five years adds" },
      note: { bn: "একই ৫,০০০ টাকা মাসে, একই ১২% বার্ষিক। কেবল সময় বাড়ছে।", en: "The same 5,000 a month, the same 12% a year. Only the time is changing." },
      labels: ["1-5", "6-10", "11-15", "16-20"],
      series: [
        {
          name: { bn: "ওই পাঁচ বছরে যোগ হওয়া টাকা, লাখে", en: "Added in those five years, in lakh" },
          values: [4.1, 7.3, 13.0, 23.2],
          tone: "good",
        },
      ],
      unit: { bn: "লাখ টাকা", en: "lakh taka" },
      source: {
        bn: "মাসে ৫,০০০ টাকা, বার্ষিক ১২% ধরে হিসাব। ভবিষ্যতের হার অনিশ্চিত; সংখ্যাগুলো আকৃতিটা দেখানোর জন্য।",
        en: "5,000 a month at an assumed 12% a year. Future returns are uncertain; the numbers are here to show the shape.",
      },
    },
    "hold-lab": {
      kind: "lab",
      model: "compound",
      title: { bn: "সময় সরিয়ে দেখুন", en: "Move the time" },
      note: { bn: "বছরের সংখ্যাটা কমান আর দেখুন ফলাফল কতটা দ্রুত ছোট হয়ে যায়।", en: "Reduce the number of years and watch how fast the result shrinks." },
      preset: { start: 0, monthly: 5000, rate: 12, years: 20 },
    },
    "hold-reveal": {
      kind: "reveal",
      title: { bn: "একটা প্রশ্ন", en: "One question" },
      ask: {
        bn: "কুড়ি বছরের একটা বাজারে যদি আপনি সবচেয়ে ভালো দশটা দিন মিস করেন, আপনার ফলাফল কতটা কমবে বলে মনে হয়?",
        en: "Over a twenty-year market, if you miss just the ten best days, how much do you think your result falls?",
      },
      choices: [
        { bn: "সামান্য, দশ দিন তো কিছুই নয়", en: "Barely at all, ten days is nothing" },
        { bn: "প্রায় এক চতুর্থাংশ", en: "About a quarter" },
        { bn: "প্রায় অর্ধেক বা তারও বেশি", en: "Around half or more" },
      ],
      answer: {
        bn: "প্রায় অর্ধেক বা তারও বেশি। কুড়ি বছরে প্রায় পাঁচ হাজার লেনদেনের দিন থাকে, আর তার মধ্যে দশটা দিন ফলাফলের বড় অংশ ঠিক করে দেয়।",
        en: "Around half or more. There are roughly five thousand trading days in twenty years, and ten of them decide a large part of the result.",
      },
      why: {
        bn: "কারণ বড় দিনগুলো এলোমেলোভাবে ছড়ানো নয়, তারা গুচ্ছ হয়ে আসে, আর গুচ্ছগুলো বসে থাকে পতনের ঠিক পরে। যিনি ভয় পেয়ে বেরিয়ে যান তিনি সাধারণত পড়ার শেষে বেরোন আর ওঠার শেষে ফেরেন, তাই দুইবার ক্ষতিগ্রস্ত হন। এই কারণেই বাজারে থাকা বাজার ধরার চেয়ে বেশি কাজে দেয়। সংখ্যাটা বাজার আর সময়কাল ভেদে বদলায়, কিন্তু দিকটা সব বড় বাজারেই এক।",
        en: "Because the big days are not spread evenly, they come in clusters, and the clusters sit immediately after falls. Someone who takes fright usually exits near the bottom and returns near the top, so they are hurt twice. This is why being in the market beats trying to time it. The exact figure varies by market and period, but the direction is the same in every large market.",
      },
    },
    "hold-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার একটা শেয়ার দুই বছরে ৩ গুণ হয়েছে। যুক্তিটা অক্ষত, অবস্থানটা আপনার সীমার ভেতরেই আছে। বেচবেন?",
            en: "One of your shares has tripled in two years. The argument is intact and the position is still inside your limit. Do you sell?",
          },
          options: [
            {
              text: { bn: "হ্যাঁ, তিনগুণ লাভ যথেষ্ট", en: "Yes, tripling is enough" },
              why: {
                bn: "লাভের পরিমাণ কখনো বেচার কারণ নয়। যদি ব্যবসাটা এখনো একইভাবে ভালো চলে আর দামটা আয়ের তুলনায় অযৌক্তিক না হয়, তাহলে বেচার তিনটা কারণের একটাও উপস্থিত নেই।",
                en: "The size of a gain is never a reason. If the business is still doing what it was and the price is not absurd against earnings, none of the three reasons to sell is present.",
              },
            },
            {
              text: { bn: "না, শর্তগুলো আবার পড়ি আর ধরে রাখি", en: "No, reread the conditions and hold" },
              right: true,
              why: {
                bn: "ঠিক। দীর্ঘমেয়াদে পোর্টফোলিওর প্রায় পুরো ফলাফল আসে অল্প কয়েকটা বড় বিজয়ী থেকে, আর তিনগুণে বেচে দিলে ঠিক সেগুলোই হাতছাড়া হয়। তবে প্রতি বছর অবস্থানের আকারটা মিলিয়ে দেখুন, কারণ বাড়তে বাড়তে সেটা সীমা ছাড়িয়ে যেতে পারে।",
                en: "Right. Over the long run almost all of a portfolio's result comes from a few big winners, and selling at three times is exactly how you lose them. Do check the position size each year, though, because growth can carry it past your limit.",
              },
            },
            {
              text: { bn: "অর্ধেক বেচি, যাতে মূল টাকা উঠে আসে", en: "Sell half so the original stake comes back" },
              why: {
                bn: "এটা মনস্তাত্ত্বিকভাবে আরামদায়ক আর যুক্তিতে দুর্বল। বাজার জানে না আপনি কত দিয়ে কিনেছিলেন, আর আপনার কেনা দাম আজকের সিদ্ধান্তের সঙ্গে কোনো সম্পর্ক রাখে না। সীমা ছাড়ালে বেচুন, আরাম পেতে নয়।",
                en: "Psychologically comfortable and logically weak. The market does not know what you paid, and your purchase price has no bearing on today's decision. Sell when the limit is breached, not for comfort.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কোনটা ধরে রাখার সবচেয়ে ভালো ব্যবহারিক নিয়ম?",
            en: "Which is the best practical rule for holding?",
          },
          options: [
            {
              text: { bn: "রোজ দাম দেখুন, যাতে কিছু মিস না হয়", en: "Check the price daily so you miss nothing" },
              why: {
                bn: "রোজ দেখা তথ্য দেয় না, কারণ একদিনের নড়াচড়ায় ব্যবসার কোনো খবর থাকে না। যা দেয় তা হলো নাড়াচাড়ার ইচ্ছা, আর সেটাই খরচ।",
                en: "Daily checking gives no information, because a single day's move carries no news about the business. What it gives is the urge to act, and that is the cost.",
              },
            },
            {
              text: { bn: "বছরে একবার যুক্তি যাচাই, প্রান্তিকে দশ মিনিট", en: "Check the argument once a year, ten minutes each quarter" },
              right: true,
              why: {
                bn: "ঠিক। এতে কোম্পানির আসল খবরগুলো আপনার কাছে পৌঁছায় কিন্তু দৈনিক শব্দটা পৌঁছায় না। বার্ষিক প্রতিবেদনই সবচেয়ে বেশি তথ্য দেয়, আর সেটা বছরে একবারই আসে।",
                en: "Right. The company's real news reaches you while the daily noise does not. The annual report carries the most information, and it arrives once a year.",
              },
            },
            {
              text: { bn: "কখনো কিছু দেখবেন না, কিনে ভুলে যান", en: "Never look at anything, buy and forget" },
              why: {
                bn: "এটা ধৈর্য নয়, অবহেলা। যুক্তি ভেঙে গেলে ধরে রাখা টাকা হারানোর একটা ধীর উপায়, আর সেটা বুঝতে হলে অন্তত বছরে একবার দেখতে হবে।",
                en: "That is not patience, it is neglect. Holding after the argument breaks is a slow way to lose money, and noticing that requires looking at least once a year.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"cost-of-churn": {
  bn: `
<p>প্রতিটা লেনদেনের একটা দাম আছে, আর দামটা কেবল কমিশন নয়। একটা কেনাবেচার চক্রে অন্তত চারটা জায়গায় টাকা যায়, তার তিনটা কাগজে লেখা থাকে আর একটা থাকে না। বছরে বারোবার নাড়াচাড়া করলে এই খরচগুলো নিঃশব্দে আপনার রিটার্নের একটা বড় অংশ খেয়ে ফেলে।</p>

<p>এই লেখাটা সেই খরচগুলো গুনে দেখায়, আর দেখায় কেন সক্রিয় থাকা প্রায়ই নিষ্ক্রিয় থাকার চেয়ে খারাপ ফল দেয়, এমনকি যখন প্রতিটা সিদ্ধান্ত আলাদাভাবে যুক্তিসঙ্গত।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>এক চক্রে চারটা খরচ: কেনার কমিশন, বেচার কমিশন, স্প্রেড আর কর।</li>
<li>স্প্রেড কোথাও লেখা থাকে না, তাই এটাই সবচেয়ে বেশি ভুলে যাওয়া হয়।</li>
<li>খরচ নিশ্চিত, লাভ অনিশ্চিত। এই অসমতাই মূল যুক্তি।</li>
<li>বছরে বারোটা লেনদেন মানে বছরে প্রায় ২% এর মতো ক্ষয়, যা ২০ বছরে বিশাল।</li>
<li>কম নাড়াচাড়া করা সিদ্ধান্তের গুণ বাড়ায় না, কিন্তু খরচ কমায়, আর সেটা নিশ্চিত লাভ।</li>
</ul>
</div>

<h2>এক চক্রে কত জায়গায় টাকা যায়</h2>

${mount("churn-bins")}

<p>বাংলাদেশে ব্রোকারের কমিশন সাধারণত লেনদেনের মূল্যের একটা শতাংশ, দুই দিকেই। এর সঙ্গে যোগ হয় লেনদেন সংক্রান্ত কর, যা উৎসে কাটা হয়। এই দুইটা আপনার কনট্রাক্ট নোটে লেখা থাকে, তাই আপনি দেখতে পান।</p>

<p>তৃতীয়টা দেখা যায় না। <strong>স্প্রেড</strong> হলো কেনার সবচেয়ে ভালো দাম আর বেচার সবচেয়ে ভালো দামের ফাঁক। আপনি কেনেন উপরের দামে আর বেচেন নিচের দামে, তাই একটা চক্র সম্পূর্ণ করতে আপনাকে এই ফাঁকটা পার হতে হয়। কম লেনদেন হওয়া শেয়ারে এই ফাঁকটা ২ থেকে ৫% পর্যন্ত হতে পারে, যা কমিশনের কয়েকগুণ।</p>

<h2>একটা চক্রের হিসাব</h2>

${mount("churn-lab")}

<p>যন্ত্রটাতে বছরে লেনদেনের সংখ্যা বাড়িয়ে দেখুন। প্রতিটা লেনদেন আলাদাভাবে ছোট মনে হয়, আর পনেরো বছর পরে পার্থক্যটা এমন বড় হয় যে সেটাকে ভুল মনে হয়। এটা ভুল নয়, এটা চক্রবৃদ্ধি উল্টো দিকে কাজ করছে।</p>

<div class="ex">
<p><strong>দুইজন, একই সিদ্ধান্ত, আলাদা ছন্দ।</strong> দুইজনেরই ২ লাখ টাকা, দুইজনেই বছরে ১২% রিটার্ন পান খরচের আগে। প্রথমজন বছরে দুইবার কিছু বদলান, দ্বিতীয়জন বছরে চব্বিশবার। পনেরো বছর পরে প্রথমজনের টাকা দ্বিতীয়জনের চেয়ে অনেকটা বেশি, অথচ দুইজনের কেউই কোনো খারাপ সিদ্ধান্ত নেননি। পার্থক্যটা পুরোটাই খরচের।</p>
</div>

<h2>খরচ নিশ্চিত, লাভ নয়</h2>

<p>এটাই এই লেখার মূল যুক্তি, আর এটা একটা গভীর কথা। আপনি যখন একটা শেয়ার বেচে আরেকটা কেনেন, আপনি একটা বাজি ধরছেন যে নতুনটা পুরনোটার চেয়ে ভালো করবে। সেই বাজি জিততেও পারেন হারতেও পারেন। কিন্তু খরচটা আপনি নিশ্চিতভাবে দিয়েছেন, লেনদেনের মুহূর্তেই।</p>

<p>তাই একটা বদলের সিদ্ধান্ত ন্যায্য হতে হলে নতুন পছন্দটাকে পুরনোটার চেয়ে <strong>খরচের চেয়েও বেশি</strong> ভালো হতে হবে, কেবল ভালো হলে চলবে না। এই একটা বাক্য বেশিরভাগ অপ্রয়োজনীয় নাড়াচাড়া থামিয়ে দেয়।</p>

<h2>কর, আর কোথায় এটা আলাদা</h2>

<p>বাংলাদেশে ব্যক্তি বিনিয়োগকারীর তালিকাভুক্ত শেয়ারের মূলধনি মুনাফার উপর কর কাঠামো সময়ে সময়ে বদলেছে, আর লভ্যাংশের উপর উৎসে কর কাটা হয়। এই দুইটার বর্তমান হার জেনে নেওয়া দরকার, কারণ কর আপনার আসল রিটার্নের অংশ। <a class="term" href="/money/basics-2/costs-and-taxes.html">খরচ আর কর</a> লেখাটা এই দিকটা বিস্তারিত দেখে।</p>

<p>যা এখানে বলার তা হলো একটা কাঠামোগত কথা: যেখানে মূলধনি মুনাফায় কর আছে, সেখানে বেশি নাড়াচাড়া মানে সেই কর আগে দেওয়া, আর আগে দেওয়া মানে যে টাকাটা করে চলে গেল সেটা আর চক্রবৃদ্ধিতে অংশ নিতে পারে না।</p>

${mount("churn-chart")}

<h2>কম নাড়াচাড়ার ব্যবহারিক নিয়ম</h2>

<p>প্রথমত, একটা বদলের সিদ্ধান্ত লিখে ফেলুন কেন, আর তারপর এক সপ্তাহ অপেক্ষা করুন। বেশিরভাগ তাড়া এক সপ্তাহে মরে যায়, আর যেগুলো বাঁচে সেগুলো সাধারণত ভালো সিদ্ধান্ত।</p>

<p>দ্বিতীয়ত, নতুন টাকা দিয়ে সমন্বয় করুন, বেচে নয়। আপনার একটা খাতে ওজন বেশি হয়ে গেলে পরের কয়েক মাসের মাসিক টাকাটা অন্য খাতে দিন। এতে একটা দিকের খরচই লাগে, দুইটা নয়।</p>

<p>তৃতীয়ত, কম লেনদেন হওয়া শেয়ারে ঢোকার আগে <a class="term" href="/money/terms/liquidity.html">তারল্য</a> দেখে নিন। বেরোনোর খরচটা ঢোকার সময়েই হিসাব করা উচিত, কারণ বেরোনোর দিন আপনি সেটা নিয়ে দরাদরি করতে পারবেন না।</p>

<div class="checklist">
<ul>
<li>গত এক বছরের কনট্রাক্ট নোটগুলো বের করে মোট কমিশন যোগ করুন।</li>
<li>সেই যোগফলকে আপনার মোট বিনিয়োগ দিয়ে ভাগ করুন, শতাংশে।</li>
<li>আপনার সবচেয়ে বেশি নাড়াচাড়া করা শেয়ারটা কোনটা, দেখুন।</li>
<li>পরের তিন মাসের জন্য একটা নিয়ম করুন: বদলের আগে সাত দিন অপেক্ষা।</li>
</ul>
</div>

${mount("churn-quiz")}
`,
  en: `
<p>Every transaction has a price, and the price is not only the commission. A single buy-and-sell cycle loses money in at least four places, three of which appear on paper and one of which does not. Trade a dozen times a year and these costs quietly eat a large share of your return.</p>

<p>This lesson counts them, and shows why being active usually produces a worse result than being still, even when each individual decision is perfectly reasonable.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Four costs in one cycle: commission to buy, commission to sell, the spread and tax.</li>
<li>The spread is written down nowhere, which is why it is the one forgotten.</li>
<li>Costs are certain, gains are not. That asymmetry is the whole argument.</li>
<li>Twelve trades a year is roughly 2% of annual drag, which is enormous over twenty years.</li>
<li>Trading less does not improve your decisions, but it does cut costs, and that gain is certain.</li>
</ul>
</div>

<h2>Where the money goes in one cycle</h2>

${mount("churn-bins")}

<p>Broker commission in Bangladesh is usually a percentage of the value traded, charged on both sides. On top of that sits transaction tax, deducted at source. Both of these appear on your contract note, so you can see them.</p>

<p>The third one cannot be seen. The <strong>spread</strong> is the gap between the best price to buy and the best price to sell. You buy at the higher one and sell at the lower one, so completing a round trip means crossing that gap. In a thinly traded share the gap can be 2 to 5%, several times the commission.</p>

<h2>The arithmetic of a cycle</h2>

${mount("churn-lab")}

<p>Increase the number of trades per year in the tool. Each trade feels trivially small on its own, and after fifteen years the difference is so large it looks like an error. It is not an error. It is compounding running backwards.</p>

<div class="ex">
<p><strong>Two people, the same decisions, a different rhythm.</strong> Both have 200,000 taka and both earn 12% a year before costs. The first changes something twice a year, the second twenty-four times. Fifteen years later the first has considerably more, and neither made a bad decision. The whole difference is cost.</p>
</div>

<h2>Costs are certain, gains are not</h2>

<p>This is the central argument, and it runs deep. When you sell one share to buy another, you are making a bet that the new one will do better than the old. You may win that bet or lose it. But you paid the cost for certain, at the moment of the trade.</p>

<p>So for a switch to be justified, the new choice has to be better than the old by <strong>more than the cost</strong>, not merely better. That single sentence stops most unnecessary trading.</p>

<h2>Tax, and where it differs</h2>

<p>The tax treatment of capital gains on listed shares for individuals in Bangladesh has changed from time to time, and dividends are taxed at source. You need the current rates for both, because tax is part of your real return. The lesson on <a class="term" href="/money/basics-2/costs-and-taxes.html">costs and taxes</a> goes into this properly.</p>

<p>The structural point to make here is this: wherever capital gains are taxed, trading more means paying that tax sooner, and paying sooner means the money that went in tax can no longer take part in compounding.</p>

${mount("churn-chart")}

<h2>Practical rules for trading less</h2>

<p>First, write down why you want to make a change, then wait a week. Most urges die within a week, and the ones that survive are usually good decisions.</p>

<p>Second, rebalance with new money rather than by selling. If one sector has grown too heavy, direct the next few months of contributions elsewhere. That costs one side of a trade instead of two.</p>

<p>Third, check <a class="term" href="/money/terms/liquidity.html">liquidity</a> before entering a thinly traded share. The cost of leaving should be calculated on the way in, because on the day you leave you will not be in a position to negotiate it.</p>

<div class="checklist">
<ul>
<li>Dig out last year's contract notes and add up the commissions.</li>
<li>Divide that total by the size of your portfolio, as a percentage.</li>
<li>Find which single holding you traded most.</li>
<li>Adopt a rule for the next three months: seven days of waiting before any change.</li>
</ul>
</div>

${mount("churn-quiz")}
`,
  blocks: {
    "churn-bins": {
      kind: "bins",
      title: { bn: "কোনটা কনট্রাক্ট নোটে দেখা যায়", en: "Which of these appears on the contract note" },
      note: { bn: "প্রতিটা খরচকে ঠিক বাক্সে ফেলুন। যেটা দেখা যায় না সেটাই সবচেয়ে বড় হতে পারে।", en: "Drop each cost into the right box. The one you cannot see may be the largest." },
      bins: [
        { id: "seen", label: { bn: "কাগজে লেখা থাকে", en: "Written on paper" }, tone: "plain" },
        { id: "hidden", label: { bn: "কোথাও লেখা থাকে না", en: "Written down nowhere" }, tone: "warn" },
      ],
      items: [
        {
          text: { bn: "কেনার সময় ব্রোকারের কমিশন", en: "Broker commission on the buy" },
          bin: "seen",
          why: { bn: "কনট্রাক্ট নোটে আলাদা লাইনে থাকে, শতাংশে বা টাকায়।", en: "A separate line on the contract note, as a percentage or an amount." },
        },
        {
          text: { bn: "বেচার সময় ব্রোকারের কমিশন", en: "Broker commission on the sell" },
          bin: "seen",
          why: { bn: "একই জিনিস, উল্টো দিকে। একটা চক্রে দুইবার দিতে হয়, আর এটা প্রায়ই ভুলে যাওয়া হয়।", en: "The same thing in reverse. You pay it twice in a round trip, and that is easy to forget." },
        },
        {
          text: { bn: "উৎসে কাটা লেনদেন কর", en: "Transaction tax deducted at source" },
          bin: "seen",
          why: { bn: "নোটে থাকে, আর হার সময়ে সময়ে বদলায়, তাই বর্তমান হারটা জেনে নেওয়া দরকার।", en: "It is on the note, and the rate changes from time to time, so check the current one." },
        },
        {
          text: { bn: "কেনার আর বেচার দামের ফাঁক", en: "The gap between the buy and sell price" },
          bin: "hidden",
          why: { bn: "স্প্রেড। কোনো লাইনে নেই, কারণ এটা একটা ফি নয়, এটা দামের গঠন। কম লেনদেনের শেয়ারে এটাই সবচেয়ে বড় খরচ।", en: "The spread. It appears on no line because it is not a fee, it is the structure of the price. In a thin share it is the largest cost of all." },
        },
        {
          text: { bn: "বড় অর্ডারে দাম নিজে সরে যাওয়া", en: "A large order moving the price against you" },
          bin: "hidden",
          why: { bn: "মার্কেট ইমপ্যাক্ট। আপনার নিজের অর্ডারই অর্ডার বইয়ের ভালো দামগুলো খেয়ে ফেলে, আর গড় দামটা খারাপ হয়।", en: "Market impact. Your own order eats the good prices in the book and your average worsens." },
        },
        {
          text: { bn: "লভ্যাংশের উপর উৎসে কাটা কর", en: "Tax withheld on a dividend" },
          bin: "seen",
          why: { bn: "লভ্যাংশের কাগজে বা ব্যাংক বিবরণীতে দেখা যায়, আর এটা লেনদেনের খরচ নয়, ধরে রাখার খরচ।", en: "Visible on the dividend advice or bank statement, and it is a cost of holding rather than of trading." },
        },
      ],
    },
    "churn-lab": {
      kind: "lab",
      model: "fee-drag",
      title: { bn: "খরচ কত খায়", en: "What the costs eat" },
      note: { bn: "বছরে লেনদেনের সংখ্যা বাড়ান আর পনেরো বছরের ফলাফলটা দেখুন।", en: "Increase the number of trades a year and watch the fifteen-year result." },
      preset: { capital: 200000, commission: 0.4, trades: 12, rate: 12, years: 15 },
    },
    "churn-chart": {
      kind: "chart",
      shape: "line",
      title: { bn: "একই রিটার্ন, আলাদা ছন্দ", en: "The same return, a different rhythm" },
      note: { bn: "দুইজনেই খরচের আগে ১২% পান। কেবল নাড়াচাড়ার সংখ্যা আলাদা।", en: "Both earn 12% before costs. Only the amount of trading differs." },
      labels: ["0", "5", "10", "15", "20"],
      series: [
        { name: { bn: "বছরে ২ বার", en: "Two trades a year" }, values: [2.0, 3.4, 5.9, 10.1, 17.4], tone: "good" },
        { name: { bn: "বছরে ২৪ বার", en: "Twenty-four trades a year" }, values: [2.0, 2.9, 4.2, 6.1, 8.9], tone: "bad" },
      ],
      unit: { bn: "লাখ টাকা", en: "lakh taka" },
      source: {
        bn: "২ লাখ টাকা, খরচের আগে বার্ষিক ১২%, প্রতি লেনদেনে দুই দিক মিলিয়ে ০.৮% ধরে হিসাব। প্রকৃত হার ব্রোকার আর শেয়ার ভেদে আলাদা।",
        en: "200,000 taka, 12% a year before costs, 0.8% assumed per round trip across both sides. Actual rates differ by broker and by share.",
      },
    },
    "churn-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনি একটা শেয়ার বেচে আরেকটা কিনতে চান। দুই দিকের কমিশন আর স্প্রেড মিলিয়ে খরচ প্রায় ১.৫%। নতুন শেয়ারটা কত ভালো হলে বদলটা যুক্তিসঙ্গত?",
            en: "You want to sell one share and buy another. Commission on both sides plus the spread comes to about 1.5%. How much better must the new share be for the switch to make sense?",
          },
          options: [
            {
              text: { bn: "সামান্য ভালো হলেই চলবে", en: "Slightly better is enough" },
              why: {
                bn: "না, কারণ খরচটা নিশ্চিত আর সুবিধাটা অনিশ্চিত। সামান্য ভালো হওয়ার সম্ভাবনার বিপরীতে ১.৫% নিশ্চিত ক্ষতি একটা খারাপ বাজি।",
                en: "No, because the cost is certain and the benefit is not. Paying a certain 1.5% against a probability of being slightly better is a poor bet.",
              },
            },
            {
              text: { bn: "১.৫% এর চেয়ে যথেষ্ট বেশি, কারণ খরচ নিশ্চিত আর লাভ নয়", en: "Comfortably more than 1.5%, because the cost is certain and the gain is not" },
              right: true,
              why: {
                bn: "ঠিক। ১.৫% কেবল সমান হওয়ার সীমা, আর সমান হওয়ার জন্য কেউ ঝুঁকি নেয় না। আপনার নতুন যুক্তি ভুল হওয়ার সম্ভাবনাও আছে, তাই ব্যবধানটা যথেষ্ট বড় হওয়া দরকার যাতে ভুল হলেও ক্ষতিটা সহনীয় থাকে।",
                en: "Right. 1.5% is only the break-even line, and nobody takes risk to break even. Your new reasoning might also be wrong, so the margin has to be wide enough that being wrong is still bearable.",
              },
            },
            {
              text: { bn: "খরচের কথা ভাবার দরকার নেই, ভালো সিদ্ধান্তই যথেষ্ট", en: "Costs need not enter it; a good decision is enough" },
              why: {
                bn: "খরচ প্রতিটা সিদ্ধান্তে বসে, আর জমতে থাকে। বছরে বারোটা এরকম বদল মানে বছরে প্রায় ১৮% খরচ, যা যেকোনো ভালো সিদ্ধান্তের চেয়ে বড়।",
                en: "Costs attach to every decision and accumulate. Twelve such switches a year is roughly 18% a year in cost, which overwhelms any quality of decision.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "আপনার একটা খাতে ওজন বেশি হয়ে গেছে আর সমন্বয় করা দরকার। সবচেয়ে কম খরচের উপায় কোনটা?",
            en: "One sector has become too heavy and needs rebalancing. Which is the cheapest way?",
          },
          options: [
            {
              text: { bn: "ওই খাত থেকে বেচে অন্য খাতে কিনি", en: "Sell from that sector and buy in another" },
              why: {
                bn: "এতে দুই দিকের খরচ লাগে, আর যেখানে মূলধনি মুনাফায় কর আছে সেখানে করটাও আগে দিতে হয়। কাজটা হয়, কিন্তু সবচেয়ে দামি উপায়ে।",
                en: "That pays both sides of the trade, and where capital gains are taxed it brings the tax forward too. It works, at the highest price.",
              },
            },
            {
              text: { bn: "পরের কয়েক মাসের নতুন টাকা অন্য খাতে দিই", en: "Direct the next few months of new money elsewhere" },
              right: true,
              why: {
                bn: "ঠিক। এতে কেবল কেনার দিকের খরচ লাগে, বেচার দিকটা লাগে না, আর কোনো কর সামনে আসে না। ধীর, আর ধীর হওয়াটা এখানে দামে সস্তা।",
                en: "Right. Only the buying side is paid, the selling side is avoided, and no tax is brought forward. Slower, and slower is cheaper here.",
              },
            },
            {
              text: { bn: "কিছুই করি না, ওজন যেমন আছে থাক", en: "Do nothing and leave the weight as it is" },
              why: {
                bn: "খরচের দিক থেকে সস্তা, কিন্তু ঝুঁকির দিক থেকে না। ওজন বাড়তে বাড়তে একটা খাত পুরো পোর্টফোলিওর ভাগ্য ঠিক করে দিতে পারে, আর সেটাই সমন্বয়ের কারণ।",
                en: "Cheapest in cost terms and not in risk terms. Left alone, one sector can end up deciding the fate of the whole portfolio, which is the reason for rebalancing.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"sectors": {
  bn: `
<p>ডিএসইতে তালিকাভুক্ত কোম্পানিগুলো এলোমেলো একটা তালিকা নয়। এগুলো খাতে ভাগ করা, আর একই খাতের কোম্পানিগুলো একই কারণে ওঠে আর একই কারণে পড়ে। এই সরল সত্যটা জানা থাকলে আপনার পোর্টফোলিও দেখতে বৈচিত্র্যময় অথচ আসলে একই বাজি, এই ফাঁদটা এড়ানো যায়।</p>

<p>খাত চেনা মানে নাম মুখস্থ করা নয়। মানে হলো প্রতিটা খাতের <strong>চালিকাশক্তি</strong> জানা: কোন জিনিসটা বদলালে এই খাতের সব কোম্পানির আয় বদলে যায়। ব্যাংকের জন্য সেটা সুদের হার, সিমেন্টের জন্য নির্মাণ কাজ আর ডলার, ওষুধের জন্য নিয়ন্ত্রক আর রপ্তানি।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>একই খাতের কোম্পানিগুলো একই ধাক্কায় নড়ে, তাই পাঁচটা ব্যাংক মানে বৈচিত্র্য নয়।</li>
<li>প্রতিটা খাতের একটা প্রধান চালিকাশক্তি আছে, আর সেটাই আগে জানা দরকার।</li>
<li>চক্রীয় খাত অর্থনীতির সঙ্গে ওঠানামা করে, রক্ষণাত্মক খাত কম করে।</li>
<li>বাংলাদেশে ব্যাংক আর আর্থিক খাত বাজারের বড় অংশ, তাই সূচক নিজেই একটা বাজি।</li>
<li>খাত বাছাই কোম্পানি বাছাইয়ের আগে আসে, পরে নয়।</li>
</ul>
</div>

<h2>বাংলাদেশের বাজারে কী কী খাত আছে</h2>

${mount("sec-tree")}

<p>এটা পুরো তালিকা নয়, আর হওয়ার দরকারও নেই। যা দরকার তা হলো একটা মানচিত্র, যাতে আপনি জানেন আপনার টাকা কোথায় কোথায় আছে। ডিএসইর ওয়েবসাইটে পুরো তালিকা আর প্রতিটা খাতের কোম্পানিগুলো পাওয়া যায়, আর <a class="term" href="/money/basics-3/dse-website.html">ডিএসইর সাইট</a> লেখাটা সেটা কোথায় দেখাবে।</p>

<h2>প্রতিটা খাতের চালিকাশক্তি</h2>

<p>একটা খাত বোঝা মানে একটা প্রশ্নের উত্তর জানা: কী বদলালে এই খাতের সবার আয় একসঙ্গে বদলায়? উত্তরটা সাধারণত একটা বা দুইটা জিনিস।</p>

${mount("sec-match")}

<p>এই ছকটা যা দেখাচ্ছে তা হলো, খবর পড়ার সময় আপনার প্রশ্নটা বদলে যাওয়া উচিত। শিরোনাম যখন বলে সুদের হার বাড়ছে, আপনার মাথায় প্রথমে আসা উচিত ব্যাংক আর ঋণনির্ভর কোম্পানিগুলোর কথা, আর তারপর সেটা আপনার পোর্টফোলিওতে কতটা আছে সেই প্রশ্ন।</p>

<h2>চক্রীয় আর রক্ষণাত্মক</h2>

<p>খাতগুলোকে আরেকভাবে দুই ভাগে ভাগ করা যায়, আর এই ভাগটা ঝুঁকি বোঝার জন্য বেশি কাজের।</p>

${mount("sec-compare")}

<p>চক্রীয় খাতের কোম্পানি ভালো সময়ে দুর্দান্ত করে আর খারাপ সময়ে ভয়ঙ্কর। ইস্পাত, সিমেন্ট, ভ্রমণ, বিলাসদ্রব্য। রক্ষণাত্মক খাতের চাহিদা মন্দাতেও খুব একটা কমে না: ওষুধ, বিদ্যুৎ, খাদ্য, টেলিকম। মানুষ চাকরি হারালেও ওষুধ কেনে আর বিদ্যুৎ ব্যবহার করে।</p>

<div class="note">
<p>রক্ষণাত্মক মানে নিরাপদ নয়। একটা রক্ষণাত্মক খাতের কোম্পানিও অতিমূল্যায়িত হতে পারে, ঋণে ডুবতে পারে বা খারাপ ব্যবস্থাপনায় পড়তে পারে। রক্ষণাত্মক কেবল বলে চাহিদা স্থির, বাকি সব প্রশ্ন যেমন ছিল তেমনই আছে।</p>
</div>

<h2>সুদের হার প্রায় সব খাতে পৌঁছায়</h2>

<p><a class="term" href="/money/basics-2/interest-and-taka.html">সুদের হার আর টাকার মান</a> লেখাটা কারণটা দেখিয়েছে। এখানে ব্যবহারিক দিকটা: সুদের হার বাড়লে ঋণনির্ভর কোম্পানির খরচ বাড়ে, নির্মাণ কমে, আর বিনিয়োগকারীদের কাছে ঝুঁকিহীন বিকল্প আকর্ষণীয় হয়ে ওঠে।</p>

${mount("sec-lab")}

<p>যন্ত্রটাতে কোম্পানির ঋণ বাড়িয়ে দেখুন। একই সুদের পরিবর্তনে বেশি ঋণওয়ালা কোম্পানির মুনাফা যতটা কমে, কম ঋণওয়ালার ততটা কমে না। এই কারণেই সুদ বাড়ার সময়ে ঋণের পরিমাণটা প্রথমে দেখার জিনিস।</p>

<h2>বাংলাদেশের বাজারে একটা কাঠামোগত কথা</h2>

<p>ডিএসইর বাজার মূলধনের একটা বড় অংশ ব্যাংক, আর্থিক প্রতিষ্ঠান আর বিমা মিলে। এর মানে হলো সূচক যা বলে, সেটা অনেকটাই আর্থিক খাত যা বলে। একজন বিনিয়োগকারী যদি সূচকের মতো করে কেনেন, তিনি জেনে বা না জেনে আর্থিক খাতের উপর একটা বড় বাজি ধরছেন।</p>

<p>এটা ভালো বা খারাপ নয়, এটা একটা তথ্য যা জানা দরকার। যদি আপনার চাকরিও ব্যাংকে হয় আর আপনার সঞ্চয়ও ব্যাংকের শেয়ারে থাকে, তাহলে আপনার আয় আর সম্পদ একই ধাক্কায় নড়বে, আর সেটাই সবচেয়ে খারাপ ধরনের ঘনত্ব।</p>

<div class="ex">
<p><strong>একটা পোর্টফোলিও যা বৈচিত্র্যময় দেখায়।</strong> ছয়টা কোম্পানি: তিনটা ব্যাংক, একটা লিজিং কোম্পানি, একটা বিমা আর একটা মিউচুয়াল ফান্ড যার বেশিরভাগ বিনিয়োগ ব্যাংকে। ছয়টা নাম, একটা বাজি। সুদের হার বাড়লে বা খেলাপি ঋণ বাড়লে ছয়টাই একসঙ্গে পড়বে।</p>
</div>

<h2>খাত দিয়ে কীভাবে শুরু করবেন</h2>

<p>একটা সহজ ক্রম। প্রথমে দেখুন আপনার এখনকার টাকা কোন কোন খাতে আছে, শতাংশে। তারপর ঠিক করুন কোনো একটা খাতে সর্বোচ্চ কত রাখবেন, ২৫% বা ৩০% একটা কাজের সীমা। তারপর নতুন কেনার সময় খালি খাতগুলোর দিকে তাকান।</p>

<p>আর একটা কথা যা পরে অনেক সময় বাঁচায়: আপনার নিজের চাকরি বা ব্যবসা যে খাতে, সেই খাতে বিনিয়োগ কম রাখুন। আপনার বেতনই ওই খাতের উপর একটা বড় বাজি।</p>

<div class="checklist">
<ul>
<li>আপনার এখনকার প্রতিটা শেয়ার কোন খাতে, লিখে ফেলুন।</li>
<li>খাত অনুযায়ী শতাংশ বের করুন, আর সবচেয়ে বড়টা দেখুন।</li>
<li>এক খাতে সর্বোচ্চ কত রাখবেন, একটা সংখ্যা ঠিক করুন।</li>
<li>আপনার আয়ের উৎস কোন খাতে, সেটাও তালিকায় যোগ করুন।</li>
</ul>
</div>

${mount("sec-quiz")}
`,
  en: `
<p>The companies listed on the DSE are not a random list. They are grouped into sectors, and companies in the same sector rise for the same reasons and fall for the same reasons. Knowing this simple fact is what keeps you out of the trap of a portfolio that looks diversified and is really one bet.</p>

<p>Knowing sectors does not mean memorising names. It means knowing each sector's <strong>driver</strong>: the one thing that, when it changes, changes the earnings of every company in that sector. For banks it is interest rates, for cement it is construction and the dollar, for pharmaceuticals it is the regulator and exports.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Companies in one sector move on the same shock, so five banks is not diversification.</li>
<li>Each sector has a main driver, and that is the first thing to learn about it.</li>
<li>Cyclical sectors swing with the economy; defensive ones swing less.</li>
<li>Banks and financials are a large part of this market, so the index is itself a bet.</li>
<li>Choosing a sector comes before choosing a company, not after.</li>
</ul>
</div>

<h2>What sectors exist in this market</h2>

${mount("sec-tree")}

<p>This is not the complete list and does not need to be. What you need is a map, so that you know where your money actually sits. The DSE website carries the full list and the companies in each sector, and the lesson on <a class="term" href="/money/basics-3/dse-website.html">the DSE website</a> shows you where.</p>

<h2>The driver of each sector</h2>

<p>Understanding a sector means answering one question: what change moves everybody's earnings in it at once? The answer is usually one or two things.</p>

${mount("sec-match")}

<p>What that table really shows is that your question should change when you read the news. When a headline says rates are rising, the first thing in your head should be banks and heavily indebted companies, and the second should be how much of that you own.</p>

<h2>Cyclical and defensive</h2>

<p>There is another way to split sectors in two, and it is the more useful one for thinking about risk.</p>

${mount("sec-compare")}

<p>Cyclical companies do superbly in good times and terribly in bad. Steel, cement, travel, luxury goods. Demand in defensive sectors barely falls in a downturn: pharmaceuticals, power, food, telecoms. People buy medicine and use electricity even after losing a job.</p>

<div class="note">
<p>Defensive does not mean safe. A defensive company can be overvalued, drowning in debt, or badly run. Defensive says only that demand is steady; every other question stands exactly where it did.</p>
</div>

<h2>Interest rates reach almost every sector</h2>

<p>The lesson on <a class="term" href="/money/basics-2/interest-and-taka.html">interest rates and the taka</a> showed why. Here is the practical part: when rates rise, indebted companies pay more, construction slows, and risk-free alternatives become attractive to investors.</p>

${mount("sec-lab")}

<p>Try raising the company's debt in the tool. For the same change in rates, a heavily indebted company's profit falls much further than a lightly indebted one's. That is why the level of debt is the first thing to look at when rates are rising.</p>

<h2>A structural fact about this market</h2>

<p>A large share of DSE market capitalisation sits in banks, non-bank financials and insurance together. Which means that what the index says is largely what the financial sector says. An investor who buys like the index is making a large bet on financials, knowingly or otherwise.</p>

<p>That is neither good nor bad, it is a fact worth knowing. If your job is also at a bank and your savings are also in bank shares, then your income and your assets move on the same shock, and that is the worst kind of concentration there is.</p>

<div class="ex">
<p><strong>A portfolio that looks diversified.</strong> Six companies: three banks, a leasing company, an insurer, and a mutual fund holding mostly banks. Six names, one bet. If rates rise or bad loans grow, all six fall together.</p>
</div>

<h2>How to start using sectors</h2>

<p>A simple sequence. First find which sectors your current money sits in, as percentages. Then decide a maximum for any one sector; 25% or 30% is a workable limit. Then, when buying next, look towards the empty ones.</p>

<p>And one more thing that saves a great deal of trouble later: keep your investment low in whatever sector your own job or business is in. Your salary is already a large bet on it.</p>

<div class="checklist">
<ul>
<li>Write down which sector each of your holdings belongs to.</li>
<li>Work out the percentages by sector and look at the biggest one.</li>
<li>Decide a number for the maximum you will hold in any one sector.</li>
<li>Add your own source of income to the list as a sector too.</li>
</ul>
</div>

${mount("sec-quiz")}
`,
  blocks: {
    "sec-tree": {
      kind: "figure",
      shape: "tree",
      title: { bn: "বাজারের একটা মানচিত্র", en: "A map of the market" },
      note: { bn: "পুরো তালিকা নয়, একটা মানচিত্র। উদ্দেশ্য হলো আপনার টাকা কোথায় আছে সেটা জানা।", en: "Not the full list, a map. The point is knowing where your money sits." },
      screen: { title: { bn: "ডিএসইর তালিকাভুক্ত কোম্পানি", en: "Companies listed on the DSE" } },
      parts: [
        { text: { bn: "আর্থিক", en: "Financials" }, note: { bn: "ব্যাংক, আর্থিক প্রতিষ্ঠান, বিমা। বাজার মূলধনের বড় অংশ।", en: "Banks, non-bank financials, insurance. A large share of market cap." }, tone: "lead" },
        { text: { bn: "উৎপাদন", en: "Manufacturing" }, note: { bn: "সিমেন্ট, ইস্পাত, প্রকৌশল, সিরামিক, বস্ত্র।", en: "Cement, steel, engineering, ceramics, textiles." } },
        { text: { bn: "ভোগ্যপণ্য ও ওষুধ", en: "Consumer and pharma" }, note: { bn: "খাদ্য, পানীয়, ওষুধ ও রসায়ন।", en: "Food, drink, pharmaceuticals and chemicals." } },
        { text: { bn: "জ্বালানি ও বিদ্যুৎ", en: "Fuel and power" }, note: { bn: "বিদ্যুৎ উৎপাদন, গ্যাস, জ্বালানি বিতরণ।", en: "Power generation, gas, fuel distribution." } },
        { text: { bn: "সেবা ও যোগাযোগ", en: "Services and telecom" }, note: { bn: "টেলিকম, তথ্যপ্রযুক্তি, ভ্রমণ ও অবকাশ।", en: "Telecoms, IT, travel and leisure." } },
        { text: { bn: "তহবিল ও বন্ড", en: "Funds and bonds" }, note: { bn: "মিউচুয়াল ফান্ড, করপোরেট বন্ড, ট্রেজারি বন্ড।", en: "Mutual funds, corporate bonds, treasury bonds." } },
      ],
      caption: {
        bn: "পুরো আর হালনাগাদ তালিকা ডিএসইর নিজের সাইটে আছে। এই মানচিত্রটা কেবল ভাবার কাঠামো।",
        en: "The complete and current list lives on the DSE's own site. This map is only a frame for thinking.",
      },
    },
    "sec-match": {
      kind: "match",
      title: { bn: "খাত আর তার চালিকাশক্তি", en: "Sector and its driver" },
      note: { bn: "কোন খাতের আয় কীসের উপর সবচেয়ে বেশি নির্ভর করে, মেলান।", en: "Match each sector with what its earnings depend on most." },
      pairs: [
        { left: { bn: "ব্যাংক", en: "Banks" }, right: { bn: "সুদের হার আর খেলাপি ঋণ", en: "Interest rates and bad loans" } },
        { left: { bn: "সিমেন্ট আর ইস্পাত", en: "Cement and steel" }, right: { bn: "নির্মাণ কাজ আর আমদানি খরচ", en: "Construction activity and import costs" } },
        { left: { bn: "ওষুধ", en: "Pharmaceuticals" }, right: { bn: "নিয়ন্ত্রক অনুমোদন আর রপ্তানি বাজার", en: "Regulatory approvals and export markets" } },
        { left: { bn: "বিদ্যুৎ", en: "Power" }, right: { bn: "সরকারি চুক্তি আর জ্বালানির দাম", en: "Government contracts and fuel prices" } },
        { left: { bn: "বস্ত্র আর পোশাক", en: "Textiles and garments" }, right: { bn: "রপ্তানি চাহিদা আর ডলারের দাম", en: "Export demand and the dollar" } },
        { left: { bn: "টেলিকম", en: "Telecoms" }, right: { bn: "গ্রাহকপ্রতি আয় আর স্পেকট্রামের খরচ", en: "Revenue per user and the cost of spectrum" } },
      ],
    },
    "sec-compare": {
      kind: "compare",
      title: { bn: "চক্রীয় আর রক্ষণাত্মক", en: "Cyclical and defensive" },
      columns: [
        { bn: "চক্রীয়", en: "Cyclical" },
        { bn: "রক্ষণাত্মক", en: "Defensive" },
      ],
      rows: [
        {
          label: { bn: "উদাহরণ", en: "Examples" },
          cells: [
            { bn: "সিমেন্ট, ইস্পাত, ভ্রমণ, প্রকৌশল", en: "Cement, steel, travel, engineering" },
            { bn: "ওষুধ, বিদ্যুৎ, খাদ্য, টেলিকম", en: "Pharma, power, food, telecoms" },
          ],
        },
        {
          label: { bn: "মন্দায় চাহিদা", en: "Demand in a downturn" },
          cells: [{ bn: "অনেকটা পড়ে", en: "Falls a lot" }, { bn: "সামান্য পড়ে", en: "Falls a little" }],
          best: 1,
        },
        {
          label: { bn: "ভালো সময়ে মুনাফা", en: "Profit in good times" },
          cells: [{ bn: "খুব দ্রুত বাড়ে", en: "Rises very fast" }, { bn: "ধীরে বাড়ে", en: "Rises slowly" }],
          best: 0,
        },
        {
          label: { bn: "দামের ওঠানামা", en: "Price swings" },
          cells: [{ bn: "বড়", en: "Large" }, { bn: "ছোট", en: "Smaller" }],
        },
        {
          label: { bn: "কার জন্য কঠিন", en: "Who finds it hard" },
          cells: [
            { bn: "যাদের টাকা তিন বছরের কম সময়ের", en: "Anyone whose horizon is under three years" },
            { bn: "যারা দ্রুত বড় লাভ চান", en: "Anyone wanting fast large gains" },
          ],
        },
      ],
    },
    "sec-lab": {
      kind: "lab",
      model: "rates",
      title: { bn: "সুদ বাড়লে কার কী হয়", en: "What a rate rise does to whom" },
      note: { bn: "কোম্পানির ঋণ বাড়িয়ে দেখুন, একই সুদের পরিবর্তনে মুনাফায় কতটা তফাত হয়।", en: "Raise the company's debt and see how much more the same rate change costs it." },
      preset: { rate: 9, change: 2, pe: 14, debt: 300, profit: 60 },
    },
    "sec-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "আপনার পোর্টফোলিওতে দুইটা ব্যাংক, একটা বিমা আর একটা লিজিং কোম্পানি আছে। এটা কতটা বৈচিত্র্যময়?",
            en: "Your portfolio holds two banks, an insurer and a leasing company. How diversified is that?",
          },
          options: [
            {
              text: { bn: "চারটা কোম্পানি, তাই ভালোই বৈচিত্র্য", en: "Four companies, so reasonably diversified" },
              why: {
                bn: "সংখ্যা বৈচিত্র্য নয়। চারটাই আর্থিক খাতের, তাই সুদের হার, খেলাপি ঋণ বা নিয়ন্ত্রক সিদ্ধান্ত, যেকোনোটাই চারটাকে একসঙ্গে নাড়াবে।",
                en: "A count is not diversification. All four are financials, so interest rates, bad loans or a regulatory decision moves all four together.",
              },
            },
            {
              text: { bn: "প্রায় একটাই বাজি, কারণ চারটাই আর্থিক খাত", en: "Close to a single bet, because all four are financials" },
              right: true,
              why: {
                bn: "ঠিক। বৈচিত্র্যের প্রশ্নটা কতগুলো নাম নয়, কতগুলো আলাদা কারণ। এই চারটার কারণ প্রায় একটাই, তাই ঝুঁকির দিক থেকে এটা প্রায় একটা কোম্পানি।",
                en: "Right. Diversification is a question of how many separate causes, not how many names. These four share nearly one cause, so in risk terms this is close to a single holding.",
              },
            },
            {
              text: { bn: "নির্ভর করে কোম্পানিগুলো কত বড় তার উপর", en: "It depends on how large the companies are" },
              why: {
                bn: "আকার ওজন ঠিক করে, বৈচিত্র্য নয়। বড় আর ছোট, দুইটা ব্যাংকই একই ধাক্কায় নড়ে।",
                en: "Size sets the weight, not the diversification. A large bank and a small bank still move on the same shock.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "খবর এল যে বাংলাদেশ ব্যাংক নীতি সুদের হার বাড়িয়েছে। কোন কোম্পানির উপর এর সবচেয়ে বেশি চাপ পড়বে?",
            en: "The central bank has raised its policy rate. Which company feels it most?",
          },
          options: [
            {
              text: { bn: "যার প্রচুর ঋণ আছে আর মুনাফার হার কম", en: "One with a lot of debt and thin margins" },
              right: true,
              why: {
                bn: "ঠিক। সুদ খরচ সরাসরি বেড়ে যায়, আর মুনাফার হার কম হলে সেই বাড়তি খরচ শুষে নেওয়ার জায়গা থাকে না। উপরের যন্ত্রটাতে ঋণের সংখ্যা বাড়িয়ে এটা দেখা যায়।",
                en: "Right. The interest bill rises directly, and a thin margin leaves no room to absorb it. You can see this by raising the debt figure in the tool above.",
              },
            },
            {
              text: { bn: "যার হাতে প্রচুর নগদ আছে আর ঋণ নেই", en: "One with plenty of cash and no debt" },
              why: {
                bn: "উল্টো। নগদের উপর সুদ বাড়ে, তাই এই কোম্পানির বরং কিছুটা সুবিধা হয়। সুদ বাড়লে সবাই ক্ষতিগ্রস্ত হয় না।",
                en: "The opposite. Interest earned on cash rises, so this company is somewhat better off. Not everybody loses from a rate rise.",
              },
            },
            {
              text: { bn: "সব কোম্পানির উপর সমান চাপ পড়ে", en: "Every company is affected equally" },
              why: {
                bn: "না, আর এই পার্থক্যটাই কাজে লাগানোর জিনিস। ঋণের পরিমাণ, মুনাফার হার আর চাহিদা কতটা সুদের উপর নির্ভরশীল, তিনটাই আলাদা আলাদা কোম্পানিতে আলাদা।",
                en: "No, and that difference is precisely what is useful. Debt levels, margins and how far demand depends on credit all vary from company to company.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "আপনি একটা ওষুধ কোম্পানিতে চাকরি করেন। আপনার বিনিয়োগে ওষুধ খাত নিয়ে কী করা উচিত?",
            en: "You work at a pharmaceutical company. What should your investments do about the pharma sector?",
          },
          options: [
            {
              text: { bn: "বেশি রাখা উচিত, কারণ খাতটা আমি ভালো বুঝি", en: "Hold more of it, because I understand the sector" },
              why: {
                bn: "বোঝাটা সুবিধা, আর ঘনত্বটা ঝুঁকি, আর এখানে ঝুঁকিটা বড়। খাতটা খারাপ করলে আপনার চাকরি আর সঞ্চয় একই সময়ে চাপে পড়বে।",
                en: "The understanding is an advantage and the concentration is a risk, and here the risk is larger. If the sector struggles, your job and your savings come under pressure at the same time.",
              },
            },
            {
              text: { bn: "কম রাখা উচিত, কারণ আমার বেতনই ওই খাতের উপর বাজি", en: "Hold less, because my salary is already a bet on it" },
              right: true,
              why: {
                bn: "ঠিক। আপনার সবচেয়ে বড় সম্পদ আপনার আয়, আর সেটা ইতিমধ্যেই ওই খাতের সঙ্গে বাঁধা। বিনিয়োগের কাজ হলো সেই বাঁধনটা আলগা করা, শক্ত করা নয়।",
                en: "Right. Your largest asset is your income, and it is already tied to that sector. The job of your investments is to loosen that tie, not tighten it.",
              },
            },
            {
              text: { bn: "কোনো পার্থক্য নেই, খাত আর চাকরি আলাদা জিনিস", en: "It makes no difference; job and sector are separate things" },
              why: {
                bn: "আলাদা মনে হয়, কিন্তু একই ধাক্কায় নড়ে। খাতে সংকট এলে ছাঁটাই আর শেয়ারের পতন একই মাসে আসে, আর তখনই আপনার টাকার সবচেয়ে বেশি দরকার।",
                en: "They feel separate and they move on the same shock. When a sector runs into trouble, redundancies and falling share prices arrive in the same month, which is exactly when you need the money.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"share-categories": {
  bn: `
<p>ডিএসইতে প্রতিটা শেয়ারের পাশে একটা অক্ষর থাকে: A, B, N বা Z। অনেকে এটাকে কোম্পানির মানের রেটিং মনে করেন। সেটা ঠিক নয়। এই অক্ষরগুলো মূলত একটা জিনিস বলে: <strong>কোম্পানিটা সময়মতো তার বার্ষিক সাধারণ সভা করেছে কি না আর লভ্যাংশ দিয়েছে কি না।</strong></p>

<p>তবু অক্ষরটা গুরুত্বপূর্ণ, কারণ এটা আপনার লেনদেনের নিয়ম বদলে দেয়: কত টাকা মার্জিনে পাবেন, কত দিনে নিষ্পত্তি হবে, আর কোন শেয়ার আপনার ব্রোকার আদৌ ছোঁবেন কি না।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>A: নিয়মিত এজিএম করে আর অন্তত ১০% লভ্যাংশ দেয়।</li>
<li>B: এজিএম করে কিন্তু লভ্যাংশ ১০% এর কম।</li>
<li>N: নতুন তালিকাভুক্ত, এখনো প্রথম এজিএম হয়নি।</li>
<li>Z: এজিএম বা লভ্যাংশে পিছিয়ে, বা কার্যক্রম বন্ধ।</li>
<li>ক্যাটাগরি মান নয়, শৃঙ্খলার চিহ্ন, আর এটা নিয়ম বদলায়।</li>
</ul>
</div>

<h2>চারটা অক্ষর, চারটা অর্থ</h2>

${mount("cat-compare")}

<p>খেয়াল করুন সংজ্ঞাগুলোর একটাও কোম্পানির ব্যবসা নিয়ে নয়। একটা কোম্পানি চমৎকার ব্যবসা করেও Z-এ থাকতে পারে যদি সে লভ্যাংশ না দেয়, আর একটা দুর্বল কোম্পানি A-তে থাকতে পারে যদি সে নিয়ম মেনে সামান্য লভ্যাংশ দিয়ে যায়। অক্ষরটা শৃঙ্খলার চিহ্ন, মানের নয়।</p>

<div class="note">
<p>নির্দিষ্ট শতাংশ আর শর্তগুলো নিয়ন্ত্রক সময়ে সময়ে সংশোধন করে। তাই কোনো সিদ্ধান্ত নেওয়ার আগে ডিএসই বা বিএসইসির বর্তমান নির্দেশনা দেখে নিন। এখানে যা শেখার তা হলো কাঠামোটা, নির্দিষ্ট সংখ্যাটা নয়।</p>
</div>

<h2>ক্যাটাগরি কী বদলায়</h2>

<p>অক্ষরটা তিনটা ব্যবহারিক জিনিসে হাত দেয়, আর তিনটাই আপনার টাকার সঙ্গে সরাসরি সম্পর্কিত।</p>

${mount("cat-bins")}

<p>সবচেয়ে বড় পার্থক্যটা <a class="term" href="/money/terms/margin-loan.html">মার্জিন ঋণে</a>। A ক্যাটাগরির শেয়ারে ব্রোকার সাধারণত ঋণ দেয়, Z ক্যাটাগরিতে দেয় না। এর একটা পার্শ্বপ্রতিক্রিয়া আছে যা অনেকে দেখেন না: যখন কোনো শেয়ার A থেকে Z-এ নামে, তখন যারা মার্জিনে সেটা ধরে আছেন তাদের বাধ্য হয়ে বেচতে হয়, আর সেই জোরপূর্বক বিক্রি দামকে আরও নিচে নামায়।</p>

<h2>কোম্পানি কীভাবে এক ক্যাটাগরি থেকে আরেকটায় যায়</h2>

${mount("cat-flow")}

<p>বেশিরভাগ পতন এক বছরে ঘটে না। কোম্পানির নগদ প্রবাহ দুর্বল হতে থাকে, লভ্যাংশ কমে, তারপর বন্ধ হয়, তারপর এজিএম পিছিয়ে যায়। প্রতিটা ধাপ আগে থেকে দেখা যায় যদি আপনি <a class="term" href="/money/basics-3/cash-flow.html">নগদ প্রবাহ</a> দেখেন। ক্যাটাগরির অবনতি সাধারণত খবরের শেষ ধাপ, প্রথম ধাপ নয়।</p>

<div class="ex">
<p><strong>একটা সাধারণ ক্রম।</strong> বছর এক: মুনাফা আছে কিন্তু নগদ প্রবাহ ঋণাত্মক, লভ্যাংশ ১৫% থেকে ১০%। বছর দুই: লভ্যাংশ ৫%, ক্যাটাগরি A থেকে B। বছর তিন: লভ্যাংশ নেই, এজিএম পিছিয়ে যায়, ক্যাটাগরি Z। যিনি বছর একে নগদ প্রবাহ দেখেছিলেন তিনি দুই বছর আগে জানতেন।</p>
</div>

<h2>Z ক্যাটাগরি নিয়ে সাবধানতা</h2>

<p>Z ক্যাটাগরির শেয়ার প্রায়ই খুব সস্তা দেখায়, আর মাঝেমধ্যে খুব দ্রুত ওঠে। এই দুইটা মিলে নতুনদের জন্য একটা শক্তিশালী আকর্ষণ তৈরি করে। তিনটা কারণে এটা বিপজ্জনক।</p>

<p>প্রথমত, <a class="term" href="/money/terms/liquidity.html">তারল্য</a> কম, তাই বেরোনোর সময় ক্রেতা নাও থাকতে পারে। দ্বিতীয়ত, তথ্য কম আর পুরনো, কারণ কোম্পানি নিজেই নিয়ম মানছে না। তৃতীয়ত, দ্রুত ওঠাটা প্রায়ই আসল উন্নতির কারণে নয়, বরং কম তারল্যের কারণে: অল্প কেনাতেই দাম অনেক ওঠে, আর নামার সময়ও তাই।</p>

<p>একটা কাজের নিয়ম নতুনদের জন্য: প্রথম দুই বছর Z ক্যাটাগরি ছোঁবেন না। এতে আপনি কিছু সুযোগ মিস করবেন, আর অনেক বেশি ফাঁদ এড়াবেন।</p>

${mount("cat-quiz")}

<div class="checklist">
<ul>
<li>আপনার প্রতিটা শেয়ারের ক্যাটাগরি ডিএসইর সাইটে দেখে নিন।</li>
<li>কোনোটা গত এক বছরে ক্যাটাগরি বদলেছে কি না খোঁজ করুন।</li>
<li>যেগুলো B বা Z, সেগুলোর শেষ তিন বছরের লভ্যাংশ দেখুন।</li>
<li>আপনার ব্রোকারের কাছে জিজ্ঞেস করুন কোন ক্যাটাগরিতে তারা মার্জিন দেয়।</li>
</ul>
</div>
`,
  en: `
<p>Every share on the DSE carries a letter beside it: A, B, N or Z. Many people take it for a rating of company quality. It is not. These letters mainly say one thing: <strong>whether the company held its annual general meeting on time and whether it paid a dividend.</strong></p>

<p>The letter still matters, because it changes the rules of your transaction: how much margin you can get, how settlement works, and whether your broker will touch the share at all.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A: holds its AGM regularly and pays at least a 10% dividend.</li>
<li>B: holds its AGM but pays less than 10%.</li>
<li>N: newly listed, first AGM not yet held.</li>
<li>Z: behind on AGMs or dividends, or not operating.</li>
<li>The category is a mark of discipline rather than of quality, and it changes the rules.</li>
</ul>
</div>

<h2>Four letters, four meanings</h2>

${mount("cat-compare")}

<p>Notice that not one of those definitions is about the company's business. A company can run an excellent business and sit in Z because it pays no dividend, and a weak company can sit in A by paying a small dividend on schedule. The letter marks discipline, not quality.</p>

<div class="note">
<p>The specific percentages and conditions are revised by the regulator from time to time. So check the current DSE or BSEC guidance before acting on any of this. What is worth learning here is the structure, not the particular number.</p>
</div>

<h2>What the category changes</h2>

<p>The letter touches three practical things, and all three bear directly on your money.</p>

${mount("cat-bins")}

<p>The largest difference is in <a class="term" href="/money/terms/margin-loan.html">margin lending</a>. Brokers usually lend against A category shares and not against Z. That has a side effect many people miss: when a share drops from A to Z, everyone holding it on margin is forced to sell, and that forced selling pushes the price lower still.</p>

<h2>How a company moves between categories</h2>

${mount("cat-flow")}

<p>Most descents do not happen in one year. Cash flow weakens, the dividend shrinks, then stops, then the AGM slips. Every step is visible in advance if you look at <a class="term" href="/money/basics-3/cash-flow.html">cash flow</a>. A category downgrade is usually the last step of the news rather than the first.</p>

<div class="ex">
<p><strong>A common sequence.</strong> Year one: profit exists but cash flow is negative, and the dividend goes from 15% to 10%. Year two: dividend 5%, category A to B. Year three: no dividend, the AGM slips, category Z. Anyone who looked at cash flow in year one knew two years early.</p>
</div>

<h2>A caution about Z</h2>

<p>Z category shares often look very cheap and occasionally rise very fast. Together those two make a powerful attraction for beginners. It is dangerous for three reasons.</p>

<p>First, <a class="term" href="/money/terms/liquidity.html">liquidity</a> is thin, so there may be no buyer when you want out. Second, information is scarce and stale, because the company is by definition not keeping to the rules. Third, the fast rises are usually not caused by genuine improvement but by that same thin liquidity: small buying moves the price a lot, and so does small selling.</p>

<p>A workable rule for a beginner: do not touch Z for your first two years. You will miss a few opportunities and avoid many more traps.</p>

${mount("cat-quiz")}

<div class="checklist">
<ul>
<li>Look up the category of each of your holdings on the DSE site.</li>
<li>Find out whether any of them changed category in the past year.</li>
<li>For anything in B or Z, look at the last three years of dividends.</li>
<li>Ask your broker which categories they will lend against.</li>
</ul>
</div>
`,
  blocks: {
    "cat-compare": {
      kind: "compare",
      title: { bn: "চারটা ক্যাটাগরি", en: "The four categories" },
      note: { bn: "শর্তগুলো নিয়ন্ত্রক সময়ে সময়ে বদলায়। কাঠামোটা শিখুন, সংখ্যাটা যাচাই করুন।", en: "The conditions are revised from time to time. Learn the structure and verify the numbers." },
      columns: [
        { bn: "A", en: "A" },
        { bn: "B", en: "B" },
        { bn: "N", en: "N" },
        { bn: "Z", en: "Z" },
      ],
      rows: [
        {
          label: { bn: "মূল শর্ত", en: "Main condition" },
          cells: [
            { bn: "নিয়মিত এজিএম, অন্তত ১০% লভ্যাংশ", en: "Regular AGM, at least a 10% dividend" },
            { bn: "নিয়মিত এজিএম, ১০% এর কম লভ্যাংশ", en: "Regular AGM, dividend under 10%" },
            { bn: "নতুন তালিকাভুক্ত, প্রথম এজিএম বাকি", en: "Newly listed, first AGM pending" },
            { bn: "এজিএম বা লভ্যাংশে পিছিয়ে, বা বন্ধ", en: "Behind on AGM or dividend, or not operating" },
          ],
        },
        {
          label: { bn: "মার্জিন ঋণ", en: "Margin lending" },
          cells: [
            { bn: "সাধারণত পাওয়া যায়", en: "Usually available" },
            { bn: "সীমিত", en: "Limited" },
            { bn: "সাধারণত নয়", en: "Usually not" },
            { bn: "নয়", en: "No" },
          ],
          best: 0,
        },
        {
          label: { bn: "তারল্য", en: "Liquidity" },
          cells: [
            { bn: "সাধারণত ভালো", en: "Usually good" },
            { bn: "মাঝারি", en: "Moderate" },
            { bn: "শুরুতে বেশি, পরে কমে", en: "High at first, then falls" },
            { bn: "প্রায়ই খুব কম", en: "Often very thin" },
          ],
          best: 0,
        },
        {
          label: { bn: "এটা কি মানের চিহ্ন?", en: "Is it a mark of quality?" },
          cells: [
            { bn: "না, শৃঙ্খলার", en: "No, of discipline" },
            { bn: "না", en: "No" },
            { bn: "না, বয়সের", en: "No, of age" },
            { bn: "না, তবে সতর্কতার", en: "No, but a warning" },
          ],
        },
      ],
    },
    "cat-bins": {
      kind: "bins",
      title: { bn: "ক্যাটাগরি কী বদলায় আর কী বদলায় না", en: "What the category changes and what it does not" },
      note: { bn: "প্রতিটা বিবৃতি ঠিক বাক্সে ফেলুন।", en: "Drop each statement into the right box." },
      bins: [
        { id: "changes", label: { bn: "ক্যাটাগরি বদলায়", en: "The category changes this" }, tone: "pick" },
        { id: "same", label: { bn: "ক্যাটাগরির সঙ্গে সম্পর্ক নেই", en: "Nothing to do with the category" }, tone: "plain" },
      ],
      items: [
        {
          text: { bn: "আপনি এই শেয়ারে মার্জিন ঋণ পাবেন কি না", en: "Whether you can get margin against this share" },
          bin: "changes",
          why: { bn: "সবচেয়ে বড় ব্যবহারিক পার্থক্য, আর অবনতির সময় জোরপূর্বক বিক্রির কারণ।", en: "The biggest practical difference, and the cause of forced selling on a downgrade." },
        },
        {
          text: { bn: "কোম্পানির ব্যবসাটা ভালো কি না", en: "Whether the business itself is any good" },
          bin: "same",
          why: { bn: "ক্যাটাগরি ব্যবসার মান মাপে না। ভালো ব্যবসাও Z-এ থাকতে পারে যদি লভ্যাংশ না দেয়।", en: "The category does not measure the business. A good business can sit in Z if it pays nothing out." },
        },
        {
          text: { bn: "কোম্পানি সময়মতো এজিএম করেছে কি না", en: "Whether the AGM happened on time" },
          bin: "changes",
          why: { bn: "এটাই মূল শর্ত। ক্যাটাগরি মূলত এই একটা প্রশ্নের উত্তর।", en: "This is the main condition. The category is largely the answer to this one question." },
        },
        {
          text: { bn: "শেয়ারের দাম বাড়বে না কমবে", en: "Whether the price will rise or fall" },
          bin: "same",
          why: { bn: "কোনো ক্যাটাগরিই ভবিষ্যতের দাম বলে না। A ক্যাটাগরির শেয়ারও অর্ধেক হতে পারে।", en: "No category predicts a future price. An A category share can halve." },
        },
        {
          text: { bn: "নিষ্পত্তির নিয়ম আর লেনদেনের শর্ত", en: "Settlement rules and trading conditions" },
          bin: "changes",
          why: { bn: "ক্যাটাগরি ভেদে নিষ্পত্তির চক্র আলাদা হতে পারে, তাই টাকা বা শেয়ার কবে হাতে আসবে তা বদলায়।", en: "Settlement cycles can differ by category, so when the money or the shares reach you changes." },
        },
        {
          text: { bn: "কোম্পানির ঋণ কত", en: "How much debt the company carries" },
          bin: "same",
          why: { bn: "এটা স্থিতিপত্রের প্রশ্ন, ক্যাটাগরির নয়। দুইটা একসঙ্গে দেখা দরকার, কিন্তু একটা আরেকটা বলে না।", en: "That is a balance sheet question, not a category one. Look at both, but one does not tell you the other." },
        },
      ],
    },
    "cat-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "A থেকে Z, ধাপে ধাপে", en: "From A to Z, step by step" },
      note: { bn: "অবনতিটা এক দিনে হয় না। প্রতিটা ধাপ আগে থেকে দেখা যায়।", en: "The descent does not happen in a day. Every step is visible in advance." },
      parts: [
        { text: { bn: "নগদ প্রবাহ দুর্বল হয়", en: "Cash flow weakens" }, note: { bn: "মুনাফা তখনো দেখা যায়, নগদ যায় না", en: "Profit is still reported, cash is not" }, tone: "warn" },
        { text: { bn: "লভ্যাংশ কমে", en: "The dividend shrinks" }, note: { bn: "১৫% থেকে ১০%, তারপর ৫%", en: "15% to 10%, then 5%" }, tone: "warn" },
        { text: { bn: "A থেকে B", en: "A to B" }, note: { bn: "১০% এর নিচে নামলেই", en: "As soon as it falls below 10%" } },
        { text: { bn: "লভ্যাংশ বন্ধ, এজিএম পিছায়", en: "No dividend, the AGM slips" }, note: { bn: "এখানে সাধারণত ব্যাখ্যা আসে, তথ্য নয়", en: "This is where explanations arrive instead of information" }, tone: "bad" },
        { text: { bn: "Z", en: "Z" }, note: { bn: "মার্জিন বন্ধ, জোরপূর্বক বিক্রি, তারল্য শুকিয়ে যায়", en: "Margin withdrawn, forced selling, liquidity dries up" }, tone: "bad" },
      ],
      caption: {
        bn: "প্রথম ধাপটা নগদ প্রবাহের বিবরণীতে থাকে, শেষ ধাপটা খবরের শিরোনামে। যিনি প্রথমটা দেখেন তিনি দুই বছর আগে জানেন।",
        en: "The first step is in the cash flow statement and the last one is in the headlines. Whoever reads the first knows two years earlier.",
      },
    },
    "cat-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানি A থেকে Z ক্যাটাগরিতে নেমেছে। দাম দুই সপ্তাহে ৩৫% পড়েছে। পতনের একটা বড় কারণ কী হতে পারে?",
            en: "A company has moved from A to Z. The price has fallen 35% in two weeks. What is likely to be a big part of the cause?",
          },
          options: [
            {
              text: { bn: "মার্জিনে ধরে থাকা বিনিয়োগকারীদের জোরপূর্বক বিক্রি", en: "Forced selling by investors holding it on margin" },
              right: true,
              why: {
                bn: "ঠিক। Z ক্যাটাগরিতে মার্জিন সমর্থন থাকে না, তাই যারা ধার করে ধরে ছিলেন তাদের বেচতেই হয়, দাম যাই হোক। এই বিক্রেতারা দাম দেখে সিদ্ধান্ত নিচ্ছেন না, তাই পতনটা গভীর হয়।",
                en: "Right. Margin support is withdrawn in Z, so anyone holding on borrowed money has to sell whatever the price. Those sellers are not choosing on price, which is why the fall goes deep.",
              },
            },
            {
              text: { bn: "কোম্পানির ব্যবসা হঠাৎ দুই সপ্তাহে খারাপ হয়ে গেছে", en: "The business suddenly got worse over two weeks" },
              why: {
                bn: "ক্যাটাগরি অবনতি সাধারণত অনেক আগের সমস্যার ঘোষণা, নতুন সমস্যার নয়। ব্যবসাটা মাস কয়েক ধরেই খারাপ ছিল; কেবল অক্ষরটা এখন বদলেছে।",
                en: "A downgrade is usually the announcement of an old problem rather than a new one. The business had been weak for months; only the letter changed now.",
              },
            },
            {
              text: { bn: "সব Z ক্যাটাগরির শেয়ারই একসঙ্গে পড়েছে", en: "Every Z category share fell at the same time" },
              why: {
                bn: "ক্যাটাগরি একটা খাত নয়, তাই Z-এর কোম্পানিগুলো একসঙ্গে নড়ার কোনো কারণ নেই। এদের একসঙ্গে বাঁধে কেবল নিয়ম, ব্যবসা নয়।",
                en: "A category is not a sector, so there is no reason for Z companies to move together. What binds them is a rule, not a business.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানি A ক্যাটাগরিতে আছে আর প্রতি বছর ১২% লভ্যাংশ দেয়। এটা কী প্রমাণ করে?",
            en: "A company sits in A and pays a 12% dividend every year. What does that prove?",
          },
          options: [
            {
              text: { bn: "কোম্পানিটা ভালো বিনিয়োগ", en: "The company is a good investment" },
              why: {
                bn: "না। A ক্যাটাগরি বলে কোম্পানি নিয়ম মেনেছে আর লভ্যাংশ দিয়েছে। দামটা যুক্তিসঙ্গত কি না, ব্যবসাটা বাড়ছে কি না, ঋণ কত, এসব প্রশ্নের একটারও উত্তর এতে নেই।",
                en: "No. A category says the company followed the rules and paid out. It answers nothing about whether the price is reasonable, whether the business is growing, or how much debt it carries.",
              },
            },
            {
              text: { bn: "কোম্পানিটা নিয়ম মেনেছে আর কিছু নগদ বিতরণ করেছে", en: "It followed the rules and distributed some cash" },
              right: true,
              why: {
                bn: "ঠিক, আর এটুকুই। এটা একটা ভালো শুরু, কারণ যে কোম্পানি নিয়মিত নগদ দেয় তার নগদ প্রবাহ সাধারণত সত্যিকারের। কিন্তু এরপরই আসল কাজ শুরু: দাম, বৃদ্ধি, ঋণ আর ব্যবস্থাপনা।",
                en: "Right, and only that. It is a good start, because a company that pays cash regularly usually has real cash flow. But the actual work starts after it: price, growth, debt and management.",
              },
            },
            {
              text: { bn: "কোম্পানিটার শেয়ার পড়বে না", en: "Its share price will not fall" },
              why: {
                bn: "কোনো ক্যাটাগরি দামের সুরক্ষা দেয় না। A ক্যাটাগরির শেয়ারও ২০১১ সালে অর্ধেক হয়েছিল, আর নিয়ম মানা আর দাম, দুইটা আলাদা প্রশ্ন।",
                en: "No category protects a price. A category shares halved in 2011 like the rest, and following the rules and the price are two different questions.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"ipo-in-practice": {
  bn: `
<p><a class="term" href="/money/terms/ipo.html">আইপিও কী</a> সেটা আগের একটা লেখায় দেখা হয়েছে: একটা কোম্পানি প্রথমবার সাধারণ মানুষের কাছে শেয়ার বিক্রি করছে। এই লেখাটা তত্ত্ব নয়, হাতে কলমে: আবেদন কীভাবে করবেন, কত টাকা লাগবে, কীভাবে বরাদ্দ হয়, আর কবে কী হাতে আসে।</p>

<p>বাংলাদেশে আইপিও নিয়ে উৎসাহ বেশি, কারণ অনেক আইপিও তালিকাভুক্তির প্রথম দিনেই ভালো দাম পায়। এটা সত্যি হলেও পুরো ছবি নয়, আর এই লেখার শেষে আপনি জানবেন কেন।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>আবেদনের জন্য দরকার একটা বিও অ্যাকাউন্ট আর তাতে ন্যূনতম বিনিয়োগ।</li>
<li>আবেদন বেশি হলে লটারি বা আনুপাতিক বরাদ্দ হয়, তাই আবেদন মানে পাওয়া নয়।</li>
<li>টাকা কয়েক সপ্তাহ আটকে থাকে, আর না পেলে ফেরত আসে।</li>
<li>প্রসপেক্টাস পড়া উচিত, অন্তত তিনটা অংশ: ব্যবহার, ঝুঁকি আর আর্থিক বিবরণী।</li>
<li>প্রথম দিনের লাভ নিশ্চিত নয়, আর অনেক আইপিও এক বছরে ইস্যু দামের নিচে নামে।</li>
</ul>
</div>

<h2>শুরু থেকে শেষ, ধাপে ধাপে</h2>

${mount("ipo-steps")}

<p>খেয়াল করুন প্রথম ধাপটা আবেদন নয়। যোগ্যতার শর্ত আগে: বিও অ্যাকাউন্ট থাকতে হবে, আর সাধারণ বিনিয়োগকারীর ক্ষেত্রে নিয়ন্ত্রক একটা ন্যূনতম বাজারমূল্যের বিনিয়োগ থাকার শর্ত দিয়েছে। শর্তটা সময়ে সময়ে বদলায়, তাই আবেদনের আগে বর্তমান নিয়ম দেখে নিন।</p>

<h2>প্রসপেক্টাসে যে তিনটা জায়গা পড়তেই হবে</h2>

<p>প্রসপেক্টাস দুইশো পৃষ্ঠার হতে পারে, আর পুরোটা পড়ার দরকার নেই। তিনটা জায়গা পড়লে আপনি বেশিরভাগ মানুষের চেয়ে বেশি জানবেন।</p>

<p><strong>টাকাটা কোথায় যাবে।</strong> কোম্পানি এই টাকা দিয়ে কী করবে সেটা লেখা থাকে। নতুন যন্ত্রপাতি, নতুন কারখানা, ঋণ শোধ, নাকি কেবল পুরনো শেয়ারহোল্ডারদের বেরিয়ে যাওয়ার সুযোগ? প্রথম দুইটা ব্যবসা বাড়ায়, তৃতীয়টা ঝুঁকি কমায়, আর চতুর্থটা আপনার জন্য কিছুই করে না।</p>

<p><strong>ঝুঁকির অংশ।</strong> এই অংশটা আইনজীবীরা লেখেন আর তাই এটা নিরস, কিন্তু এখানেই কোম্পানি নিজের সমস্যাগুলো স্বীকার করে। একটা কাঁচামালের উপর নির্ভরতা, একটা বড় ক্রেতা, একটা চলমান মামলা: সব এখানে লেখা থাকে।</p>

<p><strong>গত তিন বছরের আর্থিক বিবরণী।</strong> বিশেষ করে দেখুন আয় আর মুনাফা তালিকাভুক্তির ঠিক আগের বছরে হঠাৎ বেড়েছে কি না। এটা একটা পরিচিত ধরন, আর সেটা সবসময় খারাপ নয়, কিন্তু প্রশ্ন করার মতো।</p>

<div class="note">
<p>একটা সাধারণ ভুল হলো ইস্যু দামকে সস্তা বা দামি বলা কেবল সংখ্যাটা দেখে। ১০ টাকার আইপিও সস্তা নয় আর ৫০ টাকারটা দামি নয়। যেটা দেখতে হবে তা হলো ইস্যু দাম আর প্রতি শেয়ার আয়ের সম্পর্ক, অর্থাৎ <a class="term" href="/money/terms/pe-ratio.html">পিই</a>, আর সেটা একই খাতের তালিকাভুক্ত কোম্পানিগুলোর তুলনায় কেমন।</p>
</div>

<h2>বরাদ্দের অঙ্ক</h2>

${mount("ipo-lab")}

<p>যন্ত্রটাতে আবেদনের সংখ্যা বাড়িয়ে দেখুন। বেশি জনপ্রিয় আইপিওতে আপনার পাওয়ার সম্ভাবনা কমে যায়, আর যেটুকু পান সেটা এত ছোট যে প্রথম দিনের ভালো লাভও টাকার অঙ্কে সামান্য দাঁড়ায়। এটা আইপিও নিয়ে সবচেয়ে বেশি ভুল বোঝা বিষয়।</p>

<div class="ex">
<p><strong>একটা বাস্তব হিসাব।</strong> ধরুন আপনি ১০,০০০ টাকার আবেদন করলেন আর বরাদ্দ পেলেন ৫,০০০ টাকার শেয়ার। প্রথম দিনে দাম ৬০% বাড়ল। আপনার লাভ ৩,০০০ টাকা। এর জন্য আপনার টাকা আটকে ছিল প্রায় ছয় সপ্তাহ, আর আপনি একটা ফরম পূরণ করেছেন। খারাপ নয়, কিন্তু এটা আপনার সম্পদ গড়ার পরিকল্পনা হতে পারে না।</p>
</div>

<h2>প্রথম দিনের লাফ, আর তারপর</h2>

<p>অনেক আইপিও প্রথম দিন ভালো করে, কারণ ইস্যু দাম প্রায়ই বাজার দামের চেয়ে কম রাখা হয় যাতে আবেদন ভালো হয়। এটা একটা নকশা, দৈব ঘটনা নয়।</p>

<p>প্রশ্নটা হলো তারপর কী। অনেক আইপিওর দাম প্রথম কয়েক মাসে ধীরে ধীরে নামে, আর কিছু ইস্যু দামের নিচেও চলে যায়। কারণ প্রথম দিনের দামটা উৎসাহ দিয়ে তৈরি আর পরের বছরের দামটা আয় দিয়ে।</p>

<p>তাই একটা সহজ শৃঙ্খলা: আইপিওতে আবেদন করাটা একটা আলাদা কাজ, আর কোম্পানিটাকে দীর্ঘমেয়াদে ধরে রাখাটা আরেকটা। দ্বিতীয়টার জন্য <a class="term" href="/money/basics-2/when-to-buy.html">কেনার পাঁচটা প্রশ্ন</a> সমানভাবে প্রযোজ্য, আর সেগুলোর উত্তর প্রসপেক্টাসেই আছে।</p>

${mount("ipo-drill")}

<h2>বাইরে থেকে কেনা</h2>

<p>একটা বিকল্প যা প্রায় কেউ বিবেচনা করে না: আবেদন না করে অপেক্ষা করা, আর তালিকাভুক্তির ছয় মাস পরে বাজার থেকে কেনা। তখন আপনার হাতে থাকবে অন্তত দুইটা প্রান্তিকের ফলাফল, তালিকাভুক্ত অবস্থায় কোম্পানির আচরণ আর একটা দাম যা উৎসাহ থেকে নয় বরং লেনদেন থেকে এসেছে।</p>

<p>আপনি প্রথম দিনের লাফটা মিস করবেন। বিনিময়ে আপনি একটা বাস্তব সিদ্ধান্ত নেবেন, একটা লটারি নয়।</p>

${mount("ipo-quiz")}
`,
  en: `
<p>An earlier lesson covered <a class="term" href="/money/terms/ipo.html">what an IPO is</a>: a company selling shares to the public for the first time. This lesson is not theory but practice: how to apply, what it costs, how allocation works, and when things actually arrive.</p>

<p>Enthusiasm for IPOs runs high here, because many list at a good premium on the first day. That is true and it is not the whole picture, and by the end of this lesson you will know why.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>To apply you need a BO account and a minimum investment held in it.</li>
<li>When applications exceed the issue, allocation is by lottery or pro rata, so applying is not receiving.</li>
<li>Your money is tied up for some weeks, and comes back if you get nothing.</li>
<li>Read the prospectus, at least three parts of it: use of funds, risks, and the accounts.</li>
<li>First-day gains are not guaranteed, and plenty of IPOs trade below the issue price within a year.</li>
</ul>
</div>

<h2>Start to finish, step by step</h2>

${mount("ipo-steps")}

<p>Notice that the first step is not applying. Eligibility comes first: you need a BO account, and general investors must hold a minimum market value of investments, a condition the regulator sets. That condition is revised from time to time, so check the current rule before you apply.</p>

<h2>The three parts of a prospectus you must read</h2>

<p>A prospectus can run to two hundred pages, and you do not need all of it. Three sections will put you ahead of most applicants.</p>

<p><strong>Where the money goes.</strong> The company states what it will do with the proceeds. New machinery, a new factory, repaying debt, or simply an exit for existing shareholders? The first two grow the business, the third reduces risk, and the fourth does nothing for you.</p>

<p><strong>The risk section.</strong> It is written by lawyers and it is dull, and it is where the company admits its own problems. Dependence on one raw material, one large customer, an ongoing case: all of it is there.</p>

<p><strong>Three years of accounts.</strong> Look in particular at whether revenue and profit jumped in the year immediately before listing. That is a recognisable pattern, and while it is not always bad, it is always worth a question.</p>

<div class="note">
<p>A common error is calling an issue price cheap or expensive from the number alone. A 10 taka IPO is not cheap and a 50 taka one is not expensive. What matters is the issue price against earnings per share, which is the <a class="term" href="/money/terms/pe-ratio.html">PE</a>, and how that compares with listed companies in the same sector.</p>
</div>

<h2>The arithmetic of allocation</h2>

${mount("ipo-lab")}

<p>Try raising the number of applications in the tool. In a popular IPO your chance of getting anything falls, and what you do get is so small that even a good first-day gain is modest in money terms. This is the single most misunderstood thing about IPOs.</p>

<div class="ex">
<p><strong>An actual calculation.</strong> Say you apply for 10,000 taka and are allotted 5,000 taka of shares. On the first day the price rises 60%. Your gain is 3,000 taka. For that, your money was tied up around six weeks and you filled in a form. Not bad, but it cannot be your plan for building wealth.</p>
</div>

<h2>The first-day pop, and afterwards</h2>

<p>Many IPOs do well on the first day, because the issue price is often set below the likely market price so that the offer is well subscribed. That is a design, not an accident.</p>

<p>The question is what comes next. Many IPO prices drift down over the following months, and some go below the issue price. Because the first day's price is made of enthusiasm and the following year's is made of earnings.</p>

<p>So a simple discipline: applying for an IPO is one activity, and holding the company for the long term is another. For the second, the <a class="term" href="/money/basics-2/when-to-buy.html">five questions before buying</a> apply exactly as they always do, and the answers are in the prospectus.</p>

${mount("ipo-drill")}

<h2>Buying from outside</h2>

<p>One option almost nobody considers: do not apply, and buy from the market six months after listing. By then you have at least two quarters of results, some evidence of how the company behaves as a listed company, and a price made by trading rather than by enthusiasm.</p>

<p>You give up the first-day pop. In exchange you make a real decision instead of entering a lottery.</p>

${mount("ipo-quiz")}
`,
  blocks: {
    "ipo-steps": {
      kind: "figure",
      shape: "steps",
      title: { bn: "আবেদন থেকে শেয়ার হাতে", en: "From application to shares in hand" },
      note: { bn: "সময় আর নিয়ম ইস্যু ভেদে আলাদা। ক্রমটা এক।", en: "Timings and rules vary by issue. The sequence does not." },
      parts: [
        { text: { bn: "যোগ্যতা যাচাই", en: "Check eligibility" }, note: { bn: "বিও অ্যাকাউন্ট, আর ন্যূনতম বিনিয়োগের শর্ত", en: "A BO account, and the minimum investment condition" } },
        { text: { bn: "প্রসপেক্টাস পড়া", en: "Read the prospectus" }, note: { bn: "টাকার ব্যবহার, ঝুঁকি, তিন বছরের হিসাব", en: "Use of funds, risks, three years of accounts" }, tone: "lead" },
        { text: { bn: "আবেদন আর টাকা জমা", en: "Apply and pay" }, note: { bn: "নির্দিষ্ট সময়সীমার ভেতর, ব্রোকার বা অ্যাপের মাধ্যমে", en: "Inside the window, through a broker or an app" } },
        { text: { bn: "বরাদ্দ", en: "Allocation" }, note: { bn: "আবেদন বেশি হলে লটারি বা আনুপাতিক ভাগ", en: "Lottery or pro rata if the issue is oversubscribed" }, tone: "warn" },
        { text: { bn: "টাকা ফেরত বা শেয়ার জমা", en: "Refund or credit" }, note: { bn: "না পেলে টাকা ফেরত, পেলে বিও অ্যাকাউন্টে শেয়ার", en: "Money back if you get nothing, shares into the BO account if you do" } },
        { text: { bn: "তালিকাভুক্তি আর প্রথম দিনের লেনদেন", en: "Listing and the first day" }, note: { bn: "এখান থেকে এটা আর আইপিও নয়, একটা সাধারণ শেয়ার", en: "From here it is no longer an IPO, it is an ordinary share" } },
      ],
      caption: {
        bn: "পুরো চক্রটা সাধারণত কয়েক সপ্তাহ। ওই সময়টা আপনার টাকা আটকে থাকে আর কিছু আয় করে না, যা একটা প্রকৃত খরচ।",
        en: "The whole cycle usually runs a few weeks. During it your money is locked and earning nothing, which is a real cost.",
      },
    },
    "ipo-lab": {
      kind: "lab",
      model: "ipo",
      title: { bn: "আবেদন করলে হাতে কত আসে", en: "What an application actually returns" },
      note: { bn: "আবেদনের সংখ্যা বাড়ান আর দেখুন বরাদ্দ আর সম্ভাব্য লাভ কীভাবে ছোট হয়ে যায়।", en: "Raise the number of applications and watch both the allocation and the possible gain shrink." },
      preset: { offer: 50, applications: 12, each: 10000, pop: 60 },
    },
    "ipo-drill": {
      kind: "drill",
      title: { bn: "একটা প্রসপেক্টাস খুলে দেখুন", en: "Open one prospectus" },
      note: { bn: "চলতি বা সদ্য শেষ হওয়া যেকোনো একটা আইপিও নিন। কিছু কেনার দরকার নেই।", en: "Take any current or recently closed IPO. You do not have to buy anything." },
      steps: [
        {
          text: { bn: "ডিএসইর সাইট বা ইস্যু ম্যানেজারের সাইট থেকে প্রসপেক্টাসটা নামান।", en: "Download the prospectus from the DSE site or the issue manager's site." },
        },
        {
          text: { bn: "টাকার ব্যবহারের অংশটা খুঁজে বের করুন আর তিনটা সবচেয়ে বড় খাত লিখে ফেলুন।", en: "Find the use of proceeds and write down the three largest items." },
          hint: { bn: "যদি বড় অংশটা পুরনো শেয়ারহোল্ডারদের কাছে যায়, সেটা একটা তথ্য।", en: "If a large share goes to existing shareholders, that is information." },
        },
        {
          text: { bn: "ঝুঁকির অংশ থেকে তিনটা ঝুঁকি বেছে নিন যেগুলো আপনার কাছে সত্যিকারের মনে হয়।", en: "Pick three risks from the risk section that strike you as genuine." },
        },
        {
          text: { bn: "গত তিন বছরের আয় আর মুনাফা লিখে ফেলুন, পাশাপাশি।", en: "Write down revenue and profit for the last three years, side by side." },
          hint: { bn: "শেষ বছরে হঠাৎ বড় লাফ থাকলে সেটা প্রশ্ন করার মতো।", en: "A sudden jump in the final year is worth a question." },
        },
        {
          text: { bn: "ইস্যু দাম ভাগ প্রতি শেয়ার আয় করুন, আর সেই পিই একই খাতের একটা তালিকাভুক্ত কোম্পানির সঙ্গে মেলান।", en: "Divide the issue price by earnings per share and compare that PE with a listed company in the same sector." },
        },
        {
          text: { bn: "নিজের জন্য এক বাক্যে লিখুন: আবেদন করব কি না, আর কেন।", en: "Write yourself one sentence: whether you would apply, and why." },
        },
      ],
    },
    "ipo-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা আইপিওর প্রসপেক্টাসে লেখা আছে যে সংগৃহীত টাকার বড় অংশ বর্তমান শেয়ারহোল্ডারদের শেয়ার বিক্রির টাকা। এটা কী বলে?",
            en: "A prospectus says most of the money raised goes to existing shareholders selling their shares. What does that tell you?",
          },
          options: [
            {
              text: { bn: "কোম্পানিতে নতুন টাকা ঢুকছে না, তাই ব্যবসাটা এতে বাড়ছে না", en: "No new money enters the company, so the business is not growing from this" },
              right: true,
              why: {
                bn: "ঠিক। এটাকে বলে অফার ফর সেল, আর এটা নিজে অবৈধ বা খারাপ নয়। কিন্তু আপনার টাকা কোম্পানির কারখানায় যাচ্ছে না, যাচ্ছে যিনি বেরিয়ে যাচ্ছেন তার পকেটে, তাই প্রশ্নটা হলো তিনি কেন এখন বেরোচ্ছেন।",
                en: "Right. This is an offer for sale, and it is neither illegal nor inherently bad. But your money is not going into the company's factory, it is going to whoever is leaving, so the question becomes why they are leaving now.",
              },
            },
            {
              text: { bn: "কোম্পানিটা খুব লাভজনক, তাই মালিকরা দাম পাচ্ছেন", en: "The company is very profitable, so the owners are getting a good price" },
              why: {
                bn: "হতে পারে, আর উল্টোটাও হতে পারে। বিক্রি করা নিজে কোনো তথ্য দেয় না; তথ্য দেয় বিক্রেতা কে, কত অংশ বেচছেন আর কেন। সেটা প্রসপেক্টাসেই খোঁজা দরকার।",
                en: "Possibly, and possibly the reverse. Selling on its own says nothing; who is selling, how much of their stake, and why is what says something. Look for that in the prospectus.",
              },
            },
            {
              text: { bn: "এটা বেআইনি, তাই আবেদন করা উচিত নয়", en: "It is illegal, so you should not apply" },
              why: {
                bn: "বেআইনি নয়, আর নিয়ন্ত্রক এটা অনুমোদন করে। এটা কেবল একটা ভিন্ন কাঠামো, আর সেটা জেনে সিদ্ধান্ত নেওয়াটাই কাজ।",
                en: "It is not illegal and the regulator approves it. It is simply a different structure, and knowing that before deciding is the job.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "আপনি একটা আইপিওতে ১০,০০০ টাকার আবেদন করেছিলেন, বরাদ্দ পাননি। টাকাটার কী হবে?",
            en: "You applied for 10,000 taka of an IPO and received no allocation. What happens to the money?",
          },
          options: [
            {
              text: { bn: "ফেরত আসে, তবে কয়েক সপ্তাহ পরে আর কোনো সুদ ছাড়া", en: "It comes back, some weeks later, with no interest" },
              right: true,
              why: {
                bn: "ঠিক, আর এই অপেক্ষাটাই আবেদনের আসল খরচ। ওই কয়েক সপ্তাহ টাকাটা কিছু আয় করেনি, আর সেটা ছোট হলেও শূন্য নয়। বছরে বারোটা আবেদন করলে সারা বছরের একটা বড় অংশ টাকা আটকে থাকে।",
                en: "Right, and that wait is the true cost of applying. For those weeks the money earned nothing, which is small but not zero. Twelve applications a year keeps money locked for a large part of it.",
              },
            },
            {
              text: { bn: "কোম্পানির কাছে থেকে যায়", en: "The company keeps it" },
              why: {
                bn: "না। বরাদ্দ না পেলে টাকা ফেরত দেওয়া হয়, আর এটাই নিয়ম। কোম্পানি কেবল যতটা শেয়ার ইস্যু করেছে ততটার টাকাই রাখে।",
                en: "No. Unallocated money is refunded, and that is the rule. The company keeps only the money for the shares it actually issued.",
              },
            },
            {
              text: { bn: "পরের আইপিওতে আপনাআপনি চলে যায়", en: "It rolls automatically into the next IPO" },
              why: {
                bn: "এমন কোনো ব্যবস্থা নেই। প্রতিটা আইপিও আলাদা আবেদন, আলাদা টাকা, আলাদা সময়সীমা।",
                en: "No such mechanism exists. Every IPO is a separate application, separate money and a separate window.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"commodities": {
  bn: `
<p>সোনা, তেল, গম, চাল, তুলা। এগুলোকে বলে কমোডিটি, আর এদের একটা বৈশিষ্ট্য শেয়ার থেকে একেবারে আলাদা: <strong>এরা কোনো আয় তৈরি করে না।</strong> এক ভরি সোনা এক বছর পরেও এক ভরি সোনাই থাকে। এটা কোনো লভ্যাংশ দেয় না, কোনো কারখানা চালায় না, কোনো কর্মী নিয়োগ করে না।</p>

<p>এই একটা পার্থক্য থেকেই কমোডিটি সম্পর্কে প্রায় সব দরকারি কথা বেরিয়ে আসে। এই লেখাটা সেটাই করে, আর বাংলাদেশে বসে একজন সাধারণ মানুষের জন্য এদের ভূমিকা কী হতে পারে সেটা দেখে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>কমোডিটি আয় তৈরি করে না, তাই এর দাম পুরোটাই চাহিদা আর জোগানের।</li>
<li>সোনার দাম মূলত ভয়, সুদের হার আর ডলারের সঙ্গে চলে।</li>
<li>তেলের দাম প্রায় সব খাতের খরচে ঢোকে, তাই এটা সবার সমস্যা।</li>
<li>বাংলাদেশে সরাসরি কমোডিটি বাজার নেই, তাই সংস্পর্শ পরোক্ষ।</li>
<li>গয়না বিনিয়োগ নয়: মজুরি আর অপচয় একটা বড় অংশ কেটে নেয়।</li>
</ul>
</div>

<h2>আয়হীন সম্পদের অর্থ কী</h2>

${mount("com-compare")}

<p>একটা কোম্পানির শেয়ারের দাম দীর্ঘমেয়াদে বাড়ে কারণ কোম্পানিটা প্রতি বছর কিছু আয় করে আর তার একটা অংশ ব্যবসায় ফেরত দেয়। এটাই <a class="term" href="/money/terms/compounding.html">চক্রবৃদ্ধির</a> ইঞ্জিন।</p>

<p>সোনার এই ইঞ্জিন নেই। সোনার দাম বাড়ে কেবল যদি ভবিষ্যতে কেউ আজকের চেয়ে বেশি দিতে রাজি হয়। এটাকে খারাপ বলা হচ্ছে না, কেবল আলাদা বলা হচ্ছে: সোনা একটা সঞ্চয়ের মাধ্যম, একটা উৎপাদনশীল সম্পদ নয়।</p>

<h2>সোনার দাম কীসের সঙ্গে চলে</h2>

<p>তিনটা জিনিস, আর তিনটাই বাংলাদেশের বাইরে ঠিক হয়।</p>

<p><strong>ভয়।</strong> যুদ্ধ, ব্যাংক সংকট, রাজনৈতিক অস্থিরতা: এসবে সোনার চাহিদা বাড়ে, কারণ এটা কারো দায় নয়। একটা ব্যাংক দেউলিয়া হতে পারে, একটা সরকার খেলাপি হতে পারে, সোনা কারো প্রতিশ্রুতির উপর দাঁড়িয়ে নেই।</p>

<p><strong>সুদের হার।</strong> সোনা কোনো সুদ দেয় না, তাই সুদের হার বাড়লে সোনা ধরে রাখার সুযোগ খরচ বাড়ে। এই কারণেই সুদ বাড়ার সময়ে সোনা প্রায়ই দুর্বল থাকে।</p>

<p><strong>ডলার।</strong> আন্তর্জাতিক বাজারে সোনার দাম ডলারে বলা হয়, তাই ডলার শক্তিশালী হলে অন্য মুদ্রায় সোনা দামি হয়ে যায়। বাংলাদেশে এর একটা সরাসরি ফল আছে: টাকা দুর্বল হলে দেশে সোনার দাম বাড়ে, এমনকি আন্তর্জাতিক দাম না বাড়লেও।</p>

${mount("com-chart")}

<h2>তেল সবার সমস্যা</h2>

<p>তেলের দাম শেয়ারবাজারে সোনার চেয়ে অনেক বেশি প্রভাব ফেলে, আর কারণটা সরল: তেল প্রায় সব ব্যবসার খরচের ভেতরে আছে। পরিবহন, বিদ্যুৎ, সার, প্লাস্টিক, এমনকি খাদ্যের দামও তেলের দামের সঙ্গে নড়ে।</p>

<p>বাংলাদেশের জন্য তেল একটা আমদানি, তাই দাম বাড়া মানে ডলার বেশি লাগা, বাণিজ্য ঘাটতি বাড়া আর টাকার উপর চাপ। <a class="term" href="/money/basics-2/interest-and-taka.html">সুদের হার আর টাকার মান</a> লেখাটা এই শৃঙ্খলটা দেখায়। শেয়ারবাজারে এর ফল হলো পরিবহন, সিমেন্ট আর প্লাস্টিকনির্ভর কোম্পানিগুলোর মুনাফার হার কমে যাওয়া।</p>

${mount("com-bins")}

<h2>বাংলাদেশে বসে সংস্পর্শ পাওয়ার উপায়</h2>

<p>এখানে একটা সংগঠিত কমোডিটি এক্সচেঞ্জ নেই যেখানে সাধারণ মানুষ সোনা বা তেলের চুক্তি কিনতে পারেন। তাই বাস্তবে সংস্পর্শ তিনভাবে আসে, আর তিনটাতেই সাবধানতা দরকার।</p>

<p><strong>গয়না।</strong> সবচেয়ে প্রচলিত, আর বিনিয়োগ হিসেবে সবচেয়ে দুর্বল। মজুরি, অপচয় আর দোকানের মুনাফা মিলিয়ে কেনার সময়েই একটা বড় অংশ চলে যায়, আর বেচার সময় সেটা ফেরত আসে না। গয়না একটা ব্যবহারের জিনিস আর একটা সাংস্কৃতিক জিনিস, আর সেটা ঠিক আছে, কিন্তু সেটাকে বিনিয়োগ বলে ধরলে হিসাব ভুল হবে।</p>

<p><strong>সোনার বার বা কয়েন।</strong> মজুরির অংশটা অনেক কম, তাই বিনিয়োগ হিসেবে বেশি সৎ। প্রশ্নগুলো তখন সংরক্ষণ, বিশুদ্ধতার প্রমাণ আর বেচার সময় ক্রেতা পাওয়া নিয়ে।</p>

<p><strong>কোম্পানির মাধ্যমে পরোক্ষ।</strong> আপনি সরাসরি তেল কিনতে পারবেন না, কিন্তু তেলের দাম যাদের ক্ষতি করে বা উপকার করে তাদের শেয়ার কিনতে পারেন। এটাকে বিনিয়োগ বলা যায়, কারণ এখানে একটা ব্যবসা আছে যা আয় করে।</p>

<div class="note">
<p>একটা কথা মনে রাখা দরকার: কমোডিটির দাম দীর্ঘ সময় ধরে এক জায়গায় বসে থাকতে পারে, বছরের পর বছর, আর মূল্যস্ফীতির হিসাবে পিছিয়েও যেতে পারে। যারা "সোনা সবসময় বাড়ে" শুনে কিনেছেন তাদের অনেকেই দশ বছর অপেক্ষা করেছেন। সোনার কাজ বীমা করা, বাড়ানো নয়।</p>
</div>

<h2>পোর্টফোলিওতে কতটা</h2>

<p>একজন সাধারণ বিনিয়োগকারীর জন্য একটা যুক্তিসঙ্গত অবস্থান হলো ছোট এবং উদ্দেশ্যসহ। সোনা যদি থাকে, সেটা থাকুক বীমা হিসেবে, বৃদ্ধির ইঞ্জিন হিসেবে নয়, আর মোট সম্পদের একটা ছোট অংশ হিসেবে। যা কিছু আয় করে না, তার ভাগ বড় হলে আপনার পুরো পরিকল্পনার বৃদ্ধির হার কমে যায়।</p>

<div class="checklist">
<ul>
<li>আপনার পরিবারের কাছে থাকা সোনার আনুমানিক বাজারমূল্য বের করুন।</li>
<li>সেটাকে আপনার মোট সঞ্চয় আর বিনিয়োগের সঙ্গে ভাগ করে শতাংশ দেখুন।</li>
<li>গয়না আর বার আলাদা করে লিখুন, কারণ দুইটার মূল্য ফেরত আলাদা।</li>
<li>ঠিক করুন সোনার কাজ আপনার পরিকল্পনায় কী: বীমা, নাকি বৃদ্ধি।</li>
</ul>
</div>

${mount("com-quiz")}
`,
  en: `
<p>Gold, oil, wheat, rice, cotton. These are commodities, and one of their properties is completely unlike a share: <strong>they produce no income.</strong> An ounce of gold is still an ounce of gold a year later. It pays no dividend, runs no factory and employs nobody.</p>

<p>Almost everything useful about commodities follows from that one fact. This lesson works through it, and looks at what role they can sensibly play for an ordinary person in Bangladesh.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Commodities produce no income, so the price is entirely supply and demand.</li>
<li>The gold price mostly moves with fear, interest rates and the dollar.</li>
<li>The oil price enters the costs of almost every sector, so it is everybody's problem.</li>
<li>There is no retail commodity exchange here, so exposure is indirect.</li>
<li>Jewellery is not an investment: making charges and wastage take a large slice.</li>
</ul>
</div>

<h2>What an income-free asset means</h2>

${mount("com-compare")}

<p>A share price rises over the long run because the company earns something every year and puts part of it back into the business. That is the engine of <a class="term" href="/money/terms/compounding.html">compounding</a>.</p>

<p>Gold has no such engine. The gold price rises only if somebody in the future is willing to pay more than today. This is not a criticism, only a distinction: gold is a store of value, not a productive asset.</p>

<h2>What the gold price moves with</h2>

<p>Three things, and all three are decided outside Bangladesh.</p>

<p><strong>Fear.</strong> War, banking trouble, political instability: demand for gold rises, because gold is nobody's liability. A bank can fail and a government can default; gold rests on no one's promise.</p>

<p><strong>Interest rates.</strong> Gold pays no interest, so when rates rise the opportunity cost of holding it rises. That is why gold is often weak while rates are climbing.</p>

<p><strong>The dollar.</strong> Gold is quoted internationally in dollars, so a strong dollar makes gold more expensive in other currencies. Here that has a direct consequence: when the taka weakens, the local gold price rises even if the international price has not.</p>

${mount("com-chart")}

<h2>Oil is everybody's problem</h2>

<p>The oil price affects the share market far more than gold does, for a simple reason: oil is inside the cost base of nearly every business. Transport, power, fertiliser, plastics, and even food prices move with it.</p>

<p>For Bangladesh oil is an import, so a higher price means more dollars needed, a wider trade deficit and pressure on the taka. The lesson on <a class="term" href="/money/basics-2/interest-and-taka.html">interest rates and the taka</a> traces that chain. In the share market the result is thinner margins at transport, cement and plastics-dependent companies.</p>

${mount("com-bins")}

<h2>Ways to get exposure from here</h2>

<p>There is no organised commodity exchange here where an ordinary person can buy a gold or oil contract. So in practice exposure arrives in three ways, and all three need care.</p>

<p><strong>Jewellery.</strong> The most common, and the weakest as an investment. Making charges, wastage and the shop's margin take a large slice at purchase, and none of it comes back on sale. Jewellery is something you wear and something cultural, and that is fine, but counting it as an investment makes the arithmetic wrong.</p>

<p><strong>Gold bars or coins.</strong> The making charge is much smaller, so they are more honest as an investment. The questions become storage, proof of purity, and finding a buyer when you sell.</p>

<p><strong>Indirectly, through companies.</strong> You cannot buy oil directly, but you can buy shares in companies that a rising oil price helps or hurts. That counts as investing, because there is a business earning something underneath.</p>

<div class="note">
<p>One thing worth remembering: commodity prices can sit in one place for long stretches, year after year, and lose ground against inflation. Plenty of people who bought after hearing that gold always rises then waited a decade. The job of gold is insurance, not growth.</p>
</div>

<h2>How much in a portfolio</h2>

<p>A reasonable position for an ordinary investor is small and purposeful. If gold is there at all, let it be there as insurance rather than as an engine of growth, and as a small share of total assets. Anything that earns nothing lowers the growth rate of the whole plan as its share rises.</p>

<div class="checklist">
<ul>
<li>Work out the approximate market value of the gold your household holds.</li>
<li>Divide it by your total savings and investments to get a percentage.</li>
<li>List jewellery and bars separately, because what comes back on sale differs.</li>
<li>Decide what job gold does in your plan: insurance, or growth.</li>
</ul>
</div>

${mount("com-quiz")}
`,
  blocks: {
    "com-compare": {
      kind: "compare",
      title: { bn: "শেয়ার, সোনা আর এফডিআর", en: "Shares, gold and a fixed deposit" },
      columns: [
        { bn: "শেয়ার", en: "Shares" },
        { bn: "সোনা", en: "Gold" },
        { bn: "এফডিআর", en: "Fixed deposit" },
      ],
      rows: [
        {
          label: { bn: "নিজে আয় করে?", en: "Does it earn on its own?" },
          cells: [{ bn: "হ্যাঁ, লভ্যাংশ আর বৃদ্ধি", en: "Yes, dividends and growth" }, { bn: "না", en: "No" }, { bn: "হ্যাঁ, সুদ", en: "Yes, interest" }],
        },
        {
          label: { bn: "মূল্যস্ফীতিতে", en: "Against inflation" },
          cells: [
            { bn: "দীর্ঘমেয়াদে সাধারণত ছাড়িয়ে যায়", en: "Usually beats it over the long run" },
            { bn: "কখনো ছাড়ায়, কখনো বহু বছর পিছিয়ে থাকে", en: "Sometimes beats it, sometimes lags for years" },
            { bn: "প্রায়ই পিছিয়ে থাকে", en: "Often lags" },
          ],
          best: 0,
        },
        {
          label: { bn: "সংকটে আচরণ", en: "Behaviour in a crisis" },
          cells: [{ bn: "পড়ে", en: "Falls" }, { bn: "প্রায়ই বাড়ে", en: "Often rises" }, { bn: "স্থির, ব্যাংকের উপর নির্ভর", en: "Stable, if the bank is" }],
          best: 1,
        },
        {
          label: { bn: "কেনাবেচার খরচ", en: "Cost of buying and selling" },
          cells: [
            { bn: "কম, কমিশন আর স্প্রেড", en: "Low, commission and spread" },
            { bn: "গয়নায় অনেক, বারে কম", en: "High for jewellery, lower for bars" },
            { bn: "নেই, তবে আগে ভাঙলে জরিমানা", en: "None, though early breaking has a penalty" },
          ],
        },
        {
          label: { bn: "কী কাজে", en: "What it is for" },
          cells: [{ bn: "বৃদ্ধি", en: "Growth" }, { bn: "বীমা", en: "Insurance" }, { bn: "নিরাপত্তা আর তারল্য", en: "Safety and liquidity" }],
        },
      ],
    },
    "com-chart": {
      kind: "chart",
      shape: "line",
      title: { bn: "একই সোনা, দুই মুদ্রায়", en: "The same gold, in two currencies" },
      note: { bn: "আন্তর্জাতিক দাম না বাড়লেও টাকা দুর্বল হলে দেশে দাম বাড়ে।", en: "Even when the international price is flat, a weaker taka raises the local price." },
      labels: ["1", "2", "3", "4", "5"],
      series: [
        { name: { bn: "ডলারে দাম, সূচক", en: "Price in dollars, indexed" }, values: [100, 104, 103, 108, 110], tone: "plain" },
        { name: { bn: "টাকায় দাম, সূচক", en: "Price in taka, indexed" }, values: [100, 112, 121, 138, 150], tone: "lead" },
      ],
      unit: { bn: "সূচক, শুরু = ১০০", en: "index, start = 100" },
      source: {
        bn: "একটা ব্যাখ্যামূলক উদাহরণ, প্রকৃত তথ্য নয়। উদ্দেশ্য হলো মুদ্রার প্রভাবটা আলাদা করে দেখানো।",
        en: "An illustrative example rather than actual data. The point is to isolate the currency effect.",
      },
    },
    "com-bins": {
      kind: "bins",
      title: { bn: "তেলের দাম বাড়লে কার কী", en: "When the oil price rises, who gains and who loses" },
      note: { bn: "প্রতিটা ব্যবসাকে ঠিক বাক্সে ফেলুন।", en: "Drop each business into the right box." },
      bins: [
        { id: "hurt", label: { bn: "খরচ বাড়ে", en: "Costs rise" }, tone: "bad" },
        { id: "help", label: { bn: "উপকার হয়", en: "Benefits" }, tone: "good" },
      ],
      items: [
        {
          text: { bn: "পরিবহন আর লজিস্টিকস কোম্পানি", en: "A transport and logistics company" },
          bin: "hurt",
          why: { bn: "জ্বালানি এদের সবচেয়ে বড় পরিবর্তনশীল খরচ, আর ভাড়া সঙ্গে সঙ্গে বাড়ানো যায় না।", en: "Fuel is their largest variable cost, and fares cannot be raised immediately." },
        },
        {
          text: { bn: "প্লাস্টিক পণ্য প্রস্তুতকারক", en: "A plastics manufacturer" },
          bin: "hurt",
          why: { bn: "প্লাস্টিকের কাঁচামাল তেল থেকে আসে, তাই তেলের দাম সরাসরি কাঁচামালের দাম।", en: "Plastic feedstock comes from oil, so the oil price is the raw material price." },
        },
        {
          text: { bn: "তেল ও গ্যাস উত্তোলনকারী কোম্পানি", en: "An oil and gas producer" },
          bin: "help",
          why: { bn: "যা বেচে তার দাম বাড়ে আর উত্তোলনের খরচ প্রায় একই থাকে, তাই মুনাফার হার বাড়ে।", en: "What it sells goes up while extraction costs stay broadly flat, so margins widen." },
        },
        {
          text: { bn: "সিমেন্ট কারখানা", en: "A cement plant" },
          bin: "hurt",
          why: { bn: "উৎপাদনে প্রচুর তাপ লাগে আর পরিবহনের ওজন বেশি, তাই দুই দিক থেকেই খরচ বাড়ে।", en: "Production needs a lot of heat and the product is heavy to move, so costs rise on both sides." },
        },
        {
          text: { bn: "সৌরবিদ্যুৎ সরঞ্জাম বিক্রেতা", en: "A solar equipment seller" },
          bin: "help",
          why: { bn: "জ্বালানির দাম বাড়লে বিকল্প শক্তির চাহিদা বাড়ে, তাই পরোক্ষভাবে উপকার।", en: "Expensive fuel raises demand for alternatives, so it benefits indirectly." },
        },
        {
          text: { bn: "সার উৎপাদনকারী", en: "A fertiliser producer" },
          bin: "hurt",
          why: { bn: "সার উৎপাদনে গ্যাস মূল উপকরণ, আর গ্যাসের দাম তেলের সঙ্গে চলে।", en: "Gas is the main input in fertiliser, and the gas price tracks oil." },
        },
      ],
    },
    "com-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আন্তর্জাতিক বাজারে সোনার দাম গত এক বছরে বদলায়নি, কিন্তু দেশে সোনার দাম ১৫% বেড়েছে। সবচেয়ে সম্ভাব্য কারণ কী?",
            en: "The international gold price is unchanged over a year, but the local price is up 15%. What is the most likely cause?",
          },
          options: [
            {
              text: { bn: "টাকা ডলারের বিপরীতে দুর্বল হয়েছে", en: "The taka has weakened against the dollar" },
              right: true,
              why: {
                bn: "ঠিক। সোনার দাম আন্তর্জাতিকভাবে ডলারে বলা হয়, তাই টাকার মান কমলে একই পরিমাণ সোনা কিনতে বেশি টাকা লাগে। দেশের সোনার দাম তাই দুইটা জিনিসের গুণফল: আন্তর্জাতিক দাম আর বিনিময় হার।",
                en: "Right. Gold is quoted internationally in dollars, so a weaker taka means more taka for the same gold. The local price is a product of two things: the international price and the exchange rate.",
              },
            },
            {
              text: { bn: "দেশে সোনার চাহিদা হঠাৎ অনেক বেড়েছে", en: "Local demand for gold suddenly jumped" },
              why: {
                bn: "স্থানীয় চাহিদা কিছুটা প্রভাব ফেলে, কিন্তু সোনা আন্তর্জাতিকভাবে লেনদেন হয়, তাই স্থানীয় চাহিদা দামকে বিশ্ববাজার থেকে বেশিদূর সরাতে পারে না। মুদ্রাই সাধারণত বড় কারণ।",
                en: "Local demand has some effect, but gold trades internationally, so local demand cannot move the price far from the world price. The currency is usually the larger cause.",
              },
            },
            {
              text: { bn: "স্বর্ণকারদের মজুরি বেড়েছে", en: "Goldsmiths raised their making charges" },
              why: {
                bn: "মজুরি গয়নার দামে যোগ হয়, কিন্তু ১৫% এর মতো বড় পরিবর্তন ব্যাখ্যা করে না, আর বারের দামেও একই পরিবর্তন দেখা যাবে, যেখানে মজুরি নগণ্য।",
                en: "Making charges add to jewellery prices but do not explain a move of 15%, and the same move would appear in bars, where making charges are negligible.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কেউ বলছেন সোনা দীর্ঘমেয়াদে শেয়ারের চেয়ে ভালো, কারণ এটা কখনো শূন্য হয় না। কী উত্তর দেবেন?",
            en: "Someone says gold beats shares over the long run because it can never go to zero. What is your answer?",
          },
          options: [
            {
              text: { bn: "কথাটা ঠিক, তাই সব টাকা সোনায় রাখা উচিত", en: "That is right, so keep everything in gold" },
              why: {
                bn: "শূন্য না হওয়া আর বাড়া এক জিনিস নয়। সোনা শূন্য হয় না ঠিকই, কিন্তু এটা কোনো আয়ও তৈরি করে না, তাই বহু বছর ধরে মূল্যস্ফীতির পিছনে পড়ে থাকতে পারে, আর থেকেছেও।",
                en: "Not going to zero and going up are different things. Gold does not go to zero, and it also earns nothing, so it can lag inflation for years, and has.",
              },
            },
            {
              text: { bn: "একটা কোম্পানি শূন্য হতে পারে, কিন্তু বিশটা কোম্পানির একটা ঝুড়ি নয়", en: "One company can go to zero, but a basket of twenty cannot" },
              right: true,
              why: {
                bn: "ঠিক। শূন্য হওয়ার ঝুঁকি একটা কোম্পানির ঝুঁকি, আর সেটার উত্তর বৈচিত্র্য। তুলনাটা সোনা আর একটা শেয়ারের মধ্যে নয়, সোনা আর একটা বৈচিত্র্যময় পোর্টফোলিওর মধ্যে হওয়া উচিত, আর তখন উৎপাদনশীল সম্পদের পাল্লা ভারী।",
                en: "Right. Going to zero is a single-company risk, and the answer to it is diversification. The comparison is not gold against one share but gold against a diversified portfolio, and then the productive assets weigh more.",
              },
            },
            {
              text: { bn: "সোনার কোনো কাজ নেই, তাই একেবারেই রাখা উচিত নয়", en: "Gold has no use at all, so hold none of it" },
              why: {
                bn: "এটাও বাড়াবাড়ি। সংকটের সময় সোনা প্রায়ই বাড়ে যখন শেয়ার পড়ে, আর সেই বৈশিষ্ট্যটার দাম আছে। প্রশ্নটা রাখব কি না নয়, কতটা রাখব আর কী কাজে।",
                en: "Also an overstatement. Gold often rises in a crisis while shares fall, and that property has value. The question is not whether to hold it but how much, and for what job.",
              },
            },
          ],
        },
      ],
    },
  },
},
};
