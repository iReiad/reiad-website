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

/* ---------------------------------------------------------- */
"complements-substitutes": {
  bn: `
<p>দুইটা কোম্পানির মধ্যে সম্পর্ক দুই রকম হতে পারে, আর সম্পর্কটা জানা থাকলে একটা খবর পড়ে আপনি দুইটা কোম্পানির কথা ভাবতে পারবেন। <strong>পরিপূরক</strong> মানে একটার চাহিদা বাড়লে অন্যটারও বাড়ে। <strong>বিকল্প</strong> মানে একটার চাহিদা বাড়লে অন্যটার কমে।</p>

<p>এটা অর্থনীতির একটা সাধারণ ধারণা, আর বিনিয়োগে এর ব্যবহারটা খুব বাস্তব: আপনার পোর্টফোলিও যদি অজান্তে পরিপূরক কোম্পানিতে ভরা থাকে, তাহলে আপনার বৈচিত্র্য কাগজে আছে আর বাস্তবে নেই।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>পরিপূরক একসঙ্গে চলে, বিকল্প উল্টো দিকে চলে।</li>
<li>একই খাতে না থেকেও দুইটা কোম্পানি পরিপূরক হতে পারে।</li>
<li>বিকল্প থাকা মানে কোম্পানির দাম বাড়ানোর ক্ষমতা কম।</li>
<li>একটা খবর পড়ে সবসময় জিজ্ঞেস করুন: এতে কার উপকার হলো।</li>
<li>পোর্টফোলিওতে পরিপূরকের ভিড় ছদ্মবেশী ঘনত্ব।</li>
</ul>
</div>

<h2>দুইটা সম্পর্ক, একটা ছবিতে</h2>

${mount("cs-venn")}

<p>সিমেন্ট আর রড পরিপূরক: বাড়ি বানাতে দুইটাই লাগে, তাই নির্মাণ বাড়লে দুইটার চাহিদাই বাড়ে। চা আর কফি বিকল্প: একটার দাম বাড়লে কিছু মানুষ অন্যটায় সরে যান।</p>

<p>ব্যাপারটা কেবল পণ্যে সীমাবদ্ধ নয়। একটা এফডিআরের সুদের হার আর শেয়ারবাজারও একধরনের বিকল্প: <a class="term" href="/money/terms/fdr.html">এফডিআরে</a> ভালো রিটার্ন পাওয়া গেলে কিছু টাকা শেয়ার থেকে সরে যায়। এই কারণেই সুদের হার বাড়লে শেয়ারের দাম চাপে পড়ে।</p>

<h2>খবর পড়ার নতুন অভ্যাস</h2>

<p>একটা খবর পড়ে একটা কোম্পানির কথা ভাবা সহজ। দুইটা বা তিনটার কথা ভাবা অভ্যাসের ব্যাপার, আর সেই অভ্যাসটাই আপনাকে অন্যদের চেয়ে এগিয়ে রাখে।</p>

${mount("cs-match")}

<p>ধরুন খবর এল যে সরকার একটা বড় সেতু প্রকল্প অনুমোদন করেছে। সরাসরি উপকার সিমেন্ট আর রডের। এক ধাপ দূরে পরিবহন আর ভারী যন্ত্রপাতি। আরেক ধাপ দূরে ওই অঞ্চলের জমি আর দোকান। আর যাদের ক্ষতি? যারা ওই টাকাটা অন্য খাতে যাওয়ার আশা করছিলেন।</p>

<h2>বিকল্প থাকা মানে দাম বাড়ানোর ক্ষমতা কম</h2>

<p>এটা বিনিয়োগের জন্য সবচেয়ে দরকারি সিদ্ধান্ত এই ধারণা থেকে। একটা কোম্পানির পণ্যের যদি সহজ বিকল্প থাকে, তাহলে সে দাম বাড়াতে পারে না, কারণ ক্রেতা সরে যাবে। যদি সহজ বিকল্প না থাকে, তাহলে সে দাম বাড়াতে পারে, আর সেটাই দীর্ঘমেয়াদে মুনাফার সবচেয়ে বড় উৎস।</p>

<div class="ex">
<p><strong>দুইটা কোম্পানি, একই মূল্যস্ফীতি।</strong> প্রথমটা সাধারণ সাবান বানায়, যার বাজারে দশটা বিকল্প আছে। কাঁচামালের দাম ১০% বাড়লে সে দাম বাড়াতে গেলে ক্রেতা হারায়, তাই মুনাফার হার কমে। দ্বিতীয়টা একটা বিশেষায়িত ওষুধ বানায় যার বিকল্প নেই। সে দাম বাড়ায় আর ক্রেতা থাকে। দশ বছরে দুইটার ফলাফল আকাশ পাতাল।</p>
</div>

<p>তাই একটা কোম্পানি বিশ্লেষণ করার সময় একটা প্রশ্ন যোগ করুন: <strong>এই পণ্যের বিকল্প কতটা সহজ?</strong> উত্তরটা যত কঠিন, কোম্পানিটা তত শক্ত অবস্থানে।</p>

<h2>পোর্টফোলিওতে ছদ্মবেশী ঘনত্ব</h2>

<p><a class="term" href="/money/basics-2/sectors.html">খাত চিনুন</a> লেখায় দেখা হয়েছে একই খাতের কোম্পানি একসঙ্গে নড়ে। পরিপূরক সম্পর্ক এই সমস্যাটাকে খাতের সীমানা পার করিয়ে দেয়: দুইটা কোম্পানি আলাদা খাতে থেকেও একই ধাক্কায় নড়তে পারে।</p>

${mount("cs-spot")}

<p>এর সমাধান জটিল নয়। আপনার প্রতিটা শেয়ারের পাশে লিখুন এই কোম্পানির আয় কীসের উপর নির্ভর করে, এক বাক্যে। তারপর দেখুন কতগুলোর বাক্যে একই শব্দ আছে। যদি ছয়টার মধ্যে চারটাতে "নির্মাণ" থাকে, তাহলে আপনার চারটা শেয়ার নয়, একটা বাজি আছে।</p>

<h2>বিকল্প আপনার নিজের সিদ্ধান্তেও আছে</h2>

<p>শেষ একটা কথা, যা প্রায়ই ভুলে যাওয়া হয়। আপনার টাকা রাখার জায়গাগুলোও একে অন্যের বিকল্প। শেয়ার, এফডিআর, সঞ্চয়পত্র, সোনা, নিজের ব্যবসা: প্রতিটাতে টাকা রাখা মানে বাকিগুলোতে না রাখা।</p>

<p>তাই একটা বিনিয়োগ ভালো কি না, এই প্রশ্নের সম্পূর্ণ রূপ হলো: এই মুহূর্তে আমার কাছে থাকা বিকল্পগুলোর তুলনায় এটা ভালো কি না। একটা ১০% রিটার্ন চমৎকার শোনায় যতক্ষণ না জানা যায় যে একই ঝুঁকিতে অন্য কোথাও ১৪% পাওয়া যাচ্ছিল।</p>

<div class="checklist">
<ul>
<li>আপনার প্রতিটা শেয়ারের আয় কীসের উপর নির্ভর করে, এক বাক্যে লিখুন।</li>
<li>একই শব্দ কতবার এসেছে গুনে দেখুন।</li>
<li>প্রতিটা কোম্পানির পণ্যের সহজ বিকল্প আছে কি না লিখুন।</li>
<li>আজকের এফডিআরের হার দেখে নিন, কারণ সেটাই আপনার সবচেয়ে কাছের বিকল্প।</li>
</ul>
</div>

${mount("cs-quiz")}
`,
  en: `
<p>Two companies can be related in one of two ways, and knowing which lets you read one headline and think about two companies. <strong>Complements</strong> means demand for one rises when demand for the other does. <strong>Substitutes</strong> means demand for one falls when demand for the other rises.</p>

<p>It is an ordinary idea from economics, and its use in investing is very practical: if your portfolio is unknowingly full of complements, your diversification exists on paper and not in reality.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Complements move together; substitutes move against each other.</li>
<li>Two companies can be complements without being in the same sector.</li>
<li>Having substitutes means a company cannot easily raise prices.</li>
<li>On reading any piece of news, always ask: who does this help?</li>
<li>A crowd of complements in a portfolio is concentration in disguise.</li>
</ul>
</div>

<h2>Two relationships, one picture</h2>

${mount("cs-venn")}

<p>Cement and steel rod are complements: building needs both, so construction activity lifts demand for both. Tea and coffee are substitutes: when one gets dearer, some people move to the other.</p>

<p>It is not confined to goods. Deposit rates and the share market are a kind of substitute too: when <a class="term" href="/money/terms/fdr.html">fixed deposits</a> pay well, some money leaves shares. That is why rising rates put pressure on share prices.</p>

<h2>A new habit for reading news</h2>

<p>Reading a headline and thinking of one company is easy. Thinking of two or three is a habit, and that habit is what keeps you ahead of the room.</p>

${mount("cs-match")}

<p>Suppose the government approves a large bridge project. The direct beneficiaries are cement and steel. One step away sit transport and heavy machinery. Another step away sit land and shops in that district. And who loses? Anyone hoping that money would go to a different sector.</p>

<h2>Substitutes mean weak pricing power</h2>

<p>This is the most useful investing conclusion from the idea. If a company's product has easy substitutes, it cannot raise prices, because buyers move away. If it does not, it can raise prices, and that is the single largest source of long-run profit.</p>

<div class="ex">
<p><strong>Two companies, the same inflation.</strong> The first makes ordinary soap with ten alternatives on the shelf. When raw materials rise 10%, raising the price loses customers, so margins fall. The second makes a specialised medicine with no alternative. It raises the price and keeps its customers. Over ten years the two results are worlds apart.</p>
</div>

<p>So add one question when analysing a company: <strong>how easy is it to substitute this product?</strong> The harder the answer, the stronger the company's position.</p>

<h2>Concentration in disguise</h2>

<p>The lesson on <a class="term" href="/money/basics-2/sectors.html">sectors</a> showed that companies in one sector move together. Complementary relationships carry that problem across sector boundaries: two companies in different sectors can still move on the same shock.</p>

${mount("cs-spot")}

<p>The fix is not complicated. Beside each holding, write one sentence saying what its earnings depend on. Then look at how many sentences share a word. If four of six say "construction", you do not have four shares, you have one bet.</p>

<h2>Substitutes exist in your own decisions too</h2>

<p>One last thing, easily forgotten. The places you can put money are substitutes for one another. Shares, deposits, savings certificates, gold, your own business: putting money in one means not putting it in the others.</p>

<p>So the complete form of the question "is this a good investment" is: is it better than the alternatives available to me right now? A 10% return sounds excellent until you learn that 14% was available at the same risk somewhere else.</p>

<div class="checklist">
<ul>
<li>Write one sentence per holding on what its earnings depend on.</li>
<li>Count how many times the same word appears.</li>
<li>Note for each company whether its product has easy substitutes.</li>
<li>Look up today's deposit rate, because that is your nearest alternative.</li>
</ul>
</div>

${mount("cs-quiz")}
`,
  blocks: {
    "cs-venn": {
      kind: "figure",
      shape: "venn",
      title: { bn: "একসঙ্গে চলে, নাকি উল্টো দিকে", en: "Moving together, or against" },
      note: { bn: "মাঝখানে যা আছে তা সময় আর প্রযুক্তির উপর নির্ভর করে দুইভাবেই কাজ করে।", en: "What sits in the middle works both ways, depending on the horizon and on technology." },
      axes: {
        x: [{ bn: "পরিপূরক", en: "Complements" }, { bn: "বিকল্প", en: "Substitutes" }],
      },
      parts: [
        {
          text: { bn: "সিমেন্ট আর রড, গাড়ি আর জ্বালানি", en: "Cement and rod, cars and fuel" },
          note: { bn: "একটার চাহিদা বাড়লে অন্যটারও বাড়ে, কারণ একটা ছাড়া অন্যটা অর্থহীন।", en: "Demand for one lifts the other, because one is meaningless without the other." },
          tone: "good",
        },
        {
          text: { bn: "বিদ্যুৎ আর সৌর প্যানেল", en: "Grid power and solar panels" },
          note: { bn: "স্বল্পমেয়াদে পরিপূরক, দীর্ঘমেয়াদে বিকল্প। প্রযুক্তি বদলালে সম্পর্কটাও বদলায়।", en: "Complements in the short run and substitutes in the long run. Technology changes the relationship." },
          tone: "warn",
        },
        {
          text: { bn: "চা আর কফি, এফডিআর আর শেয়ার", en: "Tea and coffee, deposits and shares" },
          note: { bn: "একটার দাম বা রিটার্ন বাড়লে কিছু মানুষ অন্যটায় সরে যান।", en: "When one gets dearer or pays better, some people move to the other." },
          tone: "bad",
        },
      ],
      caption: {
        bn: "সম্পর্কটা চিরস্থায়ী নয়। প্রযুক্তি বদলালে পরিপূরক বিকল্প হয়ে যেতে পারে, আর সেটাই একটা খাত ধ্বংস হওয়ার চেহারা।",
        en: "The relationship is not permanent. Technology can turn a complement into a substitute, and that is what the destruction of a sector looks like.",
      },
    },
    "cs-match": {
      kind: "match",
      title: { bn: "একটা খবর, কার উপকার", en: "One headline, who benefits" },
      note: { bn: "বাঁ দিকের খবরের সঙ্গে ডান দিকের সবচেয়ে সরাসরি উপকারভোগী মেলান।", en: "Match each headline with the most direct beneficiary." },
      pairs: [
        { left: { bn: "বড় সেতু প্রকল্প অনুমোদন", en: "A large bridge project is approved" }, right: { bn: "সিমেন্ট আর ইস্পাত", en: "Cement and steel" } },
        { left: { bn: "নীতি সুদের হার কমল", en: "The policy rate is cut" }, right: { bn: "ঋণনির্ভর কোম্পানি আর আবাসন", en: "Indebted companies and housing" } },
        { left: { bn: "আন্তর্জাতিক বাজারে তেলের দাম পড়ল", en: "The world oil price falls" }, right: { bn: "পরিবহন আর প্লাস্টিক", en: "Transport and plastics" } },
        { left: { bn: "টাকা ডলারের বিপরীতে দুর্বল হলো", en: "The taka weakens against the dollar" }, right: { bn: "রপ্তানিমুখী পোশাক কোম্পানি", en: "Export-facing garment companies" } },
        { left: { bn: "এফডিআরের সুদ ১১% এ উঠল", en: "Deposit rates reach 11%" }, right: { bn: "শেয়ারের দামে চাপ", en: "Pressure on share prices" } },
        { left: { bn: "সরকার ওষুধের দাম বেঁধে দিল", en: "Medicine prices are capped" }, right: { bn: "ওষুধ কোম্পানির মুনাফার হারে চাপ", en: "Pressure on pharmaceutical margins" } },
      ],
    },
    "cs-spot": {
      kind: "spot",
      title: { bn: "এই পোর্টফোলিওতে ছদ্মবেশী ঘনত্ব কোথায়", en: "Where is the hidden concentration here" },
      note: { bn: "ছয়টা কোম্পানি, ছয়টা আলাদা খাত। যেগুলো আসলে একই ধাক্কায় নড়ে, সেগুলোতে চাপুন।", en: "Six companies in six different sectors. Press the ones that really move on the same shock." },
      source: { bn: "একজন পাঠকের কাল্পনিক পোর্টফোলিও", en: "An imaginary reader's portfolio" },
      lines: [
        {
          text: { bn: "একটা সিমেন্ট কোম্পানি, ২০%", en: "A cement company, 20%" },
          flag: { bn: "নির্মাণের উপর নির্ভরশীল। এই তালিকার তিনটা কোম্পানির আয়ের মূল চালিকাশক্তি এক।", en: "Depends on construction. Three companies in this list share one driver." },
        },
        {
          text: { bn: "একটা ইস্পাত ও রড উৎপাদনকারী, ১৮%", en: "A steel and rod producer, 18%" },
          flag: { bn: "সিমেন্টের পরিপূরক। নির্মাণ থামলে দুইটাই একসঙ্গে থামে, খাত আলাদা হলেও।", en: "A complement to cement. If construction stops, both stop together, different sectors or not." },
        },
        {
          text: { bn: "একটা ওষুধ কোম্পানি, ১৫%", en: "A pharmaceutical company, 15%" },
        },
        {
          text: { bn: "একটা রঙ ও নির্মাণ রাসায়নিক কোম্পানি, ১৭%", en: "A paints and construction chemicals company, 17%" },
          flag: { bn: "তৃতীয়টা। রসায়ন খাতে লেখা থাকলেও এর ক্রেতা নির্মাণ, তাই এটাও একই বাজি।", en: "The third one. Filed under chemicals, but its customer is construction, so it is the same bet." },
        },
        {
          text: { bn: "একটা টেলিকম কোম্পানি, ১৫%", en: "A telecoms company, 15%" },
        },
        {
          text: { bn: "একটা খাদ্য ও ভোগ্যপণ্য কোম্পানি, ১৫%", en: "A food and consumer goods company, 15%" },
        },
      ],
    },
    "cs-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "দুইটা কোম্পানি, একই মুনাফা আর একই দাম। প্রথমটার পণ্যের দশটা সহজ বিকল্প আছে, দ্বিতীয়টার নেই। দীর্ঘমেয়াদে কোনটা ভালো করার সম্ভাবনা বেশি?",
            en: "Two companies with the same profit and the same price. The first has ten easy substitutes for its product, the second has none. Which is more likely to do better over the long run?",
          },
          options: [
            {
              text: { bn: "দ্বিতীয়টা, কারণ সে দাম বাড়াতে পারে", en: "The second, because it can raise prices" },
              right: true,
              why: {
                bn: "ঠিক। বিকল্প না থাকা মানে ক্রেতার যাওয়ার জায়গা নেই, তাই খরচ বাড়লে কোম্পানি সেটা দামে চাপিয়ে দিতে পারে আর মুনাফার হার ধরে রাখতে পারে। দশ বছরের মূল্যস্ফীতির পরে এই একটা পার্থক্যই বিশাল হয়ে দাঁড়ায়।",
                en: "Right. No substitutes means the buyer has nowhere to go, so a rise in costs can be passed into the price and the margin holds. After a decade of inflation that single difference becomes enormous.",
              },
            },
            {
              text: { bn: "প্রথমটা, কারণ প্রতিযোগিতা কোম্পানিকে দক্ষ করে", en: "The first, because competition makes a company efficient" },
              why: {
                bn: "প্রতিযোগিতা দক্ষতা বাড়ায় ঠিকই, কিন্তু দক্ষতার লাভটা প্রতিযোগিতার কারণেই ক্রেতার কাছে চলে যায়, শেয়ারহোল্ডারের কাছে নয়। ভালো ব্যবসা আর ভালো বিনিয়োগ এক জিনিস নয়।",
                en: "Competition does drive efficiency, and competition also passes the benefit of that efficiency to customers rather than shareholders. A good business and a good investment are not the same thing.",
              },
            },
            {
              text: { bn: "দুইটাই সমান, কারণ মুনাফা আর দাম এক", en: "Equally, since profit and price are the same" },
              why: {
                bn: "আজকের মুনাফা এক, আগামী দশ বছরেরটা নয়। বিনিয়োগে আপনি আজকের সংখ্যা কেনেন না, ভবিষ্যতের ধারা কেনেন, আর দাম বাড়ানোর ক্ষমতা সেই ধারার সবচেয়ে বড় নির্ধারক।",
                en: "Today's profit is the same; the next ten years are not. In investing you are not buying today's number but a future stream, and pricing power is the largest determinant of that stream.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "আপনার পোর্টফোলিওতে একটা সিমেন্ট, একটা ইস্পাত আর একটা নির্মাণ রাসায়নিক কোম্পানি আছে, তিনটা আলাদা খাতে। এটা কেমন বৈচিত্র্য?",
            en: "Your portfolio holds a cement company, a steel company and a construction chemicals company, in three different sectors. How diversified is that?",
          },
          options: [
            {
              text: { bn: "ভালো, কারণ তিনটা আলাদা খাত", en: "Good, because they are three different sectors" },
              why: {
                bn: "খাতের তালিকা একটা শ্রেণিবিন্যাস, আর ঝুঁকি সেটা মানে না। তিনটারই ক্রেতা নির্মাণ খাত, তাই নির্মাণ থামলে তিনটাই একসঙ্গে থামবে, তালিকায় যাই লেখা থাক।",
                en: "A sector list is a classification, and risk does not respect it. All three sell into construction, so if construction stops all three stop together, whatever the list says.",
              },
            },
            {
              text: { bn: "দুর্বল, কারণ তিনটারই আয় নির্মাণের উপর নির্ভরশীল", en: "Weak, because all three depend on construction" },
              right: true,
              why: {
                bn: "ঠিক। এরা পরস্পরের পরিপূরক, তাই একই ধাক্কায় নড়ে। পরীক্ষাটা খাতের নাম নয়: প্রতিটার আয় কীসের উপর নির্ভর করে সেটা এক বাক্যে লিখুন, আর দেখুন বাক্যগুলোতে একই শব্দ আছে কি না।",
                en: "Right. They are complements, so they move on the same shock. The test is not the sector label: write one sentence per holding on what its earnings depend on and see whether the sentences share a word.",
              },
            },
            {
              text: { bn: "নির্ভর করে তিনটার আকার কেমন তার উপর", en: "It depends on how big the three companies are" },
              why: {
                bn: "আকার ঠিক করে ধাক্কাটা কতটা লাগবে, ধাক্কাটা একসঙ্গে লাগবে কি না সেটা নয়। বৈচিত্র্যের প্রশ্নটা কারণ নিয়ে, আকার নিয়ে নয়।",
                en: "Size decides how hard the shock lands, not whether it lands on all three at once. Diversification is a question about causes, not about size.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"bsec": {
  bn: `
<p>বাংলাদেশ সিকিউরিটিজ অ্যান্ড এক্সচেঞ্জ কমিশন, সংক্ষেপে বিএসইসি, দেশের পুঁজিবাজারের নিয়ন্ত্রক। এর কাজটা এক বাক্যে বলা যায়: <strong>বাজারে যারা টাকা রাখেন তাদের সুরক্ষা দেওয়া, নিয়ম বানিয়ে আর সেই নিয়ম প্রয়োগ করে।</strong></p>

<p>একজন সাধারণ বিনিয়োগকারীর জন্য বিএসইসি জানা দরকার তিনটা কারণে: কোন তথ্য কোম্পানিকে দিতেই হবে সেটা এরা ঠিক করে, কোন আচরণ অবৈধ সেটা এরা ঠিক করে, আর কিছু ভুল হলে অভিযোগ কোথায় যাবে সেটাও এরাই।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বিএসইসি নিয়ম বানায়, ডিএসই সেই নিয়মে বাজার চালায়।</li>
<li>কোম্পানিকে যা জানাতে হবে, তার তালিকা বিএসইসির।</li>
<li>কারসাজি আর ভেতরের খবরে লেনদেন, দুইটাই অবৈধ।</li>
<li>নিয়ন্ত্রক দামের নিশ্চয়তা দেয় না, প্রক্রিয়ার নিশ্চয়তা দেয়।</li>
<li>অভিযোগের একটা পথ আছে, আর সেটা ব্রোকার দিয়ে শুরু হয়।</li>
</ul>
</div>

<h2>কে কী করে</h2>

${mount("bsec-compare")}

<p>বিভাজনটা এভাবে মনে রাখা সহজ: বিএসইসি আইন লেখে, ডিএসই খেলাটা চালায়, আর সিডিবিএল হিসাব রাখে কার কী আছে। তিনটা আলাদা প্রতিষ্ঠান, আর তিনটার কাছে অভিযোগ করার বিষয়ও আলাদা।</p>

<h2>তথ্য প্রকাশের নিয়ম, যা আপনার সবচেয়ে বড় সুরক্ষা</h2>

<p>বিএসইসির সবচেয়ে গুরুত্বপূর্ণ কাজটা নাটকীয় নয়: এটা ঠিক করে দেয় একটা তালিকাভুক্ত কোম্পানিকে কী কী জানাতেই হবে, আর কখন।</p>

<p>প্রান্তিক আর বার্ষিক আর্থিক বিবরণী, লভ্যাংশের ঘোষণা, পরিচালকদের শেয়ার কেনাবেচা, বড় চুক্তি, কারখানায় অগ্নিকাণ্ড, মামলার রায়: এগুলো ঘোষণা করতে হয়, আর এই ঘোষণাগুলো সবার জন্য একসঙ্গে প্রকাশ পায়। এই একটা নিয়মই আপনাকে আর একজন প্রতিষ্ঠানিক বিনিয়োগকারীকে প্রায় একই তথ্যের সামনে দাঁড় করায়।</p>

<div class="note">
<p>এই কারণেই "আমার একজন লোক আছে যে আগে খবর পায়" শুনলে সন্দেহ করা উচিত। যদি খবরটা সত্যিই মূল্য সংবেদনশীল হয় আর প্রকাশের আগে জানা যায়, তাহলে সেটার উপর লেনদেন করা অবৈধ। আর যদি খবরটা সবাই জানে, তাহলে সেটা দামে ঢুকে গেছে।</p>
</div>

<h2>যা অবৈধ, আর কেন</h2>

${mount("bsec-flow")}

<p><strong>কারসাজি</strong> মানে কৃত্রিমভাবে দাম বা লেনদেনের পরিমাণ বাড়ানো: নিজেদের মধ্যে কেনাবেচা করে ব্যস্ততার ভুয়া চেহারা তৈরি করা, বা একসঙ্গে কিনে দাম তুলে তারপর সাধারণ মানুষের কাছে বেচে দেওয়া। বাংলাদেশে ১৯৯৬ আর ২০১০ দুইবারই তদন্তে এই ধরনের আচরণ পাওয়া গেছে।</p>

<p><strong>ভেতরের খবরে লেনদেন</strong> মানে প্রকাশিত হয়নি এমন মূল্য সংবেদনশীল তথ্য জেনে কেনাবেচা করা। এটা অবৈধ কারণ এটা বাজারকে অসম করে দেয়, আর অসম বাজারে সাধারণ মানুষ টাকা রাখা বন্ধ করে দেন, যা শেষমেশ সবার ক্ষতি।</p>

<h2>নিয়ন্ত্রক কী দেয় আর কী দেয় না</h2>

<p>এটা পরিষ্কার থাকা দরকার, কারণ ভুল প্রত্যাশা থেকেই সবচেয়ে বেশি হতাশা আসে।</p>

<p>নিয়ন্ত্রক <strong>দেয়</strong>: তথ্য প্রকাশের বাধ্যবাধকতা, ব্রোকার আর অ্যাসেট ম্যানেজারদের লাইসেন্স আর তদারকি, অসদাচরণের তদন্ত আর শাস্তি, আর অভিযোগের একটা পথ।</p>

<p>নিয়ন্ত্রক <strong>দেয় না</strong>: আপনার লোকসানের ক্ষতিপূরণ, একটা কোম্পানির ব্যবসা ভালো চলার নিশ্চয়তা, বা দাম পড়বে না এমন প্রতিশ্রুতি। একটা কোম্পানি নিয়ম মেনে চলেও দেউলিয়া হতে পারে, আর সেটা নিয়ন্ত্রকের ব্যর্থতা নয়।</p>

<h2>কিছু ভুল হলে কোথায় যাবেন</h2>

<p>ক্রমটা জানা থাকলে সময় বাঁচে। প্রথমে ব্রোকারেজ হাউসের কাছে লিখিত অভিযোগ, আর অবশ্যই লিখিত: ফোনে বলা কথার কোনো প্রমাণ থাকে না। সন্তুষ্ট না হলে ডিএসইর বিনিয়োগকারী অভিযোগ বিভাগ। তাতেও না হলে বিএসইসি।</p>

${mount("bsec-drill")}

<p>একটা কথা যা অনেকে দেরিতে শেখেন: কাগজ রাখুন। প্রতিটা কনট্রাক্ট নোট, প্রতিটা বিবৃতি, প্রতিটা ইমেইল। অভিযোগের সময় আপনার হাতে কী প্রমাণ আছে সেটাই ঠিক করে দেয় ফলাফল, আর প্রমাণ তৈরি করতে হয় ঘটনার আগে, পরে নয়।</p>

${mount("bsec-quiz")}
`,
  en: `
<p>The Bangladesh Securities and Exchange Commission, or BSEC, is the regulator of this country's capital market. Its job can be put in one sentence: <strong>to protect the people who put money into the market, by making rules and enforcing them.</strong></p>

<p>An ordinary investor needs to know about BSEC for three reasons: it decides what information a company must publish, it decides which behaviour is illegal, and it is where a complaint eventually goes when something is wrong.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>BSEC makes the rules; the DSE runs the market under them.</li>
<li>The list of what a company must disclose is BSEC's.</li>
<li>Manipulation and insider dealing are both illegal.</li>
<li>A regulator guarantees process, not prices.</li>
<li>There is a route for complaints, and it starts with your broker.</li>
</ul>
</div>

<h2>Who does what</h2>

${mount("bsec-compare")}

<p>An easy way to hold the division in your head: BSEC writes the law, the DSE runs the game, and CDBL keeps the record of who owns what. Three separate institutions, and three different kinds of complaint.</p>

<h2>Disclosure rules, your largest protection</h2>

<p>BSEC's most important work is not dramatic: it sets out what a listed company must tell the public, and when.</p>

<p>Quarterly and annual accounts, dividend declarations, directors buying or selling their own shares, large contracts, a fire at a factory, the outcome of a case: all of it must be announced, and announcements reach everybody at once. That single rule puts you and an institutional investor in front of substantially the same information.</p>

<div class="note">
<p>Which is why "I have someone who hears things early" should raise suspicion. If the news really is price sensitive and known before publication, trading on it is illegal. And if everybody knows it, it is already in the price.</p>
</div>

<h2>What is illegal, and why</h2>

${mount("bsec-flow")}

<p><strong>Manipulation</strong> means artificially inflating a price or a volume: trading between related accounts to fake activity, or buying together to push a price up and then selling into the public. Investigations into both 1996 and 2010 found behaviour of this kind.</p>

<p><strong>Insider dealing</strong> means trading on price-sensitive information that has not been published. It is illegal because it makes the market unequal, and in an unequal market ordinary people stop putting money in, which harms everybody in the end.</p>

<h2>What a regulator gives, and what it does not</h2>

<p>Being clear about this matters, because most disappointment comes from the wrong expectation.</p>

<p>A regulator <strong>gives</strong>: mandatory disclosure, licensing and supervision of brokers and asset managers, investigation and punishment of misconduct, and a route for complaints.</p>

<p>A regulator <strong>does not give</strong>: compensation for your losses, a guarantee that a company's business goes well, or a promise that prices will not fall. A company can follow every rule and still fail, and that is not a regulatory failure.</p>

<h2>Where to go when something goes wrong</h2>

<p>Knowing the sequence saves time. First a written complaint to the brokerage house, and written matters: a telephone conversation leaves no evidence. If that fails, the DSE's investor complaint department. If that fails, BSEC.</p>

${mount("bsec-drill")}

<p>One thing many people learn late: keep the paperwork. Every contract note, every statement, every email. What decides the outcome of a complaint is what evidence you hold, and evidence has to be created before the event rather than after it.</p>

${mount("bsec-quiz")}
`,
  blocks: {
    "bsec-compare": {
      kind: "compare",
      title: { bn: "তিনটা প্রতিষ্ঠান, তিনটা কাজ", en: "Three institutions, three jobs" },
      columns: [
        { bn: "বিএসইসি", en: "BSEC" },
        { bn: "ডিএসই", en: "DSE" },
        { bn: "সিডিবিএল", en: "CDBL" },
      ],
      rows: [
        {
          label: { bn: "মূল কাজ", en: "Main job" },
          cells: [
            { bn: "নিয়ম বানানো আর প্রয়োগ", en: "Making and enforcing rules" },
            { bn: "লেনদেনের জায়গা চালানো", en: "Running the place where trading happens" },
            { bn: "কার কী শেয়ার আছে, তার হিসাব", en: "The record of who owns which shares" },
          ],
        },
        {
          label: { bn: "লাইসেন্স দেয়?", en: "Does it license?" },
          cells: [{ bn: "হ্যাঁ, ব্রোকার আর ম্যানেজারদের", en: "Yes, brokers and managers" }, { bn: "সদস্যপদ দেয়", en: "It grants membership" }, { bn: "না", en: "No" }],
        },
        {
          label: { bn: "কোম্পানি তালিকাভুক্তি", en: "Listing a company" },
          cells: [{ bn: "অনুমোদন দেয়", en: "Approves it" }, { bn: "তালিকাভুক্ত করে", en: "Lists it" }, { bn: "শেয়ার ডিম্যাট করে", en: "Dematerialises the shares" }],
        },
        {
          label: { bn: "অভিযোগ করার ক্রম", en: "Order for complaints" },
          cells: [{ bn: "তৃতীয়", en: "Third" }, { bn: "দ্বিতীয়", en: "Second" }, { bn: "শেয়ার হস্তান্তরের ব্যাপারে", en: "For share transfer matters" }],
        },
      ],
    },
    "bsec-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "একটা মূল্য সংবেদনশীল খবরের পথ", en: "The path of a price-sensitive piece of news" },
      note: { bn: "কোন ধাপে জেনে লেনদেন করলে সেটা অবৈধ, সেটাই মূল প্রশ্ন।", en: "The question is at which step trading on it becomes illegal." },
      parts: [
        { text: { bn: "ঘটনাটা ঘটে", en: "The event happens" }, note: { bn: "একটা বড় চুক্তি, একটা ক্ষতি, একটা লভ্যাংশ সিদ্ধান্ত", en: "A large contract, a loss, a dividend decision" } },
        { text: { bn: "কোম্পানির ভেতরে কয়েকজন জানেন", en: "A few people inside know" }, note: { bn: "এখানে জেনে লেনদেন করা অবৈধ", en: "Trading on it here is illegal" }, tone: "bad" },
        { text: { bn: "কোম্পানি ঘোষণা পাঠায়", en: "The company files the announcement" }, note: { bn: "ডিএসইর মাধ্যমে, সবার জন্য একসঙ্গে", en: "Through the exchange, to everybody at once" } },
        { text: { bn: "সবাই জানেন", en: "Everybody knows" }, note: { bn: "এখান থেকে লেনদেন বৈধ, আর খবরটা দামে ঢুকতে শুরু করেছে", en: "From here trading is legal, and the news is already entering the price" }, tone: "good" },
        { text: { bn: "দাম নতুন জায়গায় বসে", en: "The price settles at a new level" }, note: { bn: "সাধারণত মিনিট বা ঘণ্টার মধ্যে, দিনের মধ্যে নয়", en: "Usually within minutes or hours, not days" } },
      ],
      caption: {
        bn: "দ্বিতীয় ধাপে যিনি কেনেন তিনি তৃতীয় ধাপে যিনি বেচেন তার কাছ থেকে কেনেন, যিনি জানেন না। এই অসমতাই আইনটা যা ঠেকাতে চায়।",
        en: "Whoever buys at the second step buys from someone at the third who does not know. That inequality is what the law exists to prevent.",
      },
    },
    "bsec-drill": {
      kind: "drill",
      title: { bn: "অভিযোগের পথটা আগে থেকে চিনে রাখুন", en: "Learn the complaint route before you need it" },
      note: { bn: "সমস্যা হওয়ার আগে করলে দশ মিনিট, পরে করলে দশ দিন।", en: "Ten minutes if you do it before a problem, ten days if you do it after." },
      steps: [
        {
          text: { bn: "বিএসইসির ওয়েবসাইট খুলুন আর বিনিয়োগকারী অভিযোগের পাতাটা খুঁজে বের করুন।", en: "Open the BSEC website and find the investor complaint page." },
        },
        {
          text: { bn: "ডিএসইর সাইটে বিনিয়োগকারী অভিযোগ বিভাগের যোগাযোগের তথ্য বের করুন।", en: "Find the contact details for the DSE's investor complaint department." },
        },
        {
          text: { bn: "আপনার ব্রোকারের অভিযোগ কর্মকর্তার নাম আর ইমেইল জেনে নিন।", en: "Get the name and email of your broker's complaints officer." },
          hint: { bn: "প্রতিটা লাইসেন্সপ্রাপ্ত ব্রোকারের এই তথ্য দেওয়ার কথা। না দিলে সেটাও একটা তথ্য।", en: "Every licensed broker is meant to provide this. If yours will not, that is information too." },
        },
        {
          text: { bn: "তিনটা যোগাযোগের তথ্য এক জায়গায় লিখে রাখুন।", en: "Write all three sets of contact details in one place." },
        },
        {
          text: { bn: "আপনার শেষ তিনটা কনট্রাক্ট নোট খুঁজে বের করুন আর নিরাপদে রাখুন।", en: "Find your last three contract notes and store them safely." },
          hint: { bn: "কাগজ বা পিডিএফ, দুইটাই চলে। যা চলে না তা হলো স্মৃতি।", en: "Paper or PDF, either works. What does not work is memory." },
        },
        {
          text: { bn: "আপনার ব্রোকারের লাইসেন্স নম্বর বিএসইসির তালিকায় মিলিয়ে দেখুন।", en: "Check your broker's licence number against the BSEC list." },
        },
      ],
    },
    "bsec-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার একটা শেয়ারের দাম ৪০% পড়েছে কারণ কোম্পানির মুনাফা কমেছে। বিএসইসি কি আপনাকে ক্ষতিপূরণ দেবে?",
            en: "One of your shares is down 40% because the company's profit fell. Will BSEC compensate you?",
          },
          options: [
            {
              text: { bn: "না, কারণ ব্যবসার ঝুঁকি নিয়ন্ত্রকের দায় নয়", en: "No, because business risk is not the regulator's responsibility" },
              right: true,
              why: {
                bn: "ঠিক। নিয়ন্ত্রক নিশ্চিত করে যে তথ্য ঠিকমতো প্রকাশ হয়েছে আর কেউ প্রতারণা করেনি। কোম্পানির মুনাফা কমা একটা ব্যবসায়িক ঘটনা, আর সেই ঝুঁকি নেওয়াই বিনিয়োগ। ক্ষতিপূরণ তখনই প্রশ্ন যখন প্রতারণা বা নিয়ম ভঙ্গ প্রমাণিত হয়।",
                en: "Right. The regulator ensures information was disclosed properly and nobody cheated. A fall in profit is a business event, and taking that risk is what investing is. Compensation only becomes a question where fraud or a breach is established.",
              },
            },
            {
              text: { bn: "হ্যাঁ, বিনিয়োগকারী সুরক্ষা তহবিল থেকে", en: "Yes, from an investor protection fund" },
              why: {
                bn: "এমন তহবিল কিছু ক্ষেত্রে থাকে, কিন্তু সেগুলো ব্রোকারের ব্যর্থতা বা প্রতারণার মতো নির্দিষ্ট পরিস্থিতির জন্য, বাজারের স্বাভাবিক লোকসানের জন্য নয়। কোনো ব্যবস্থাই দাম পড়ার বিরুদ্ধে বীমা দেয় না।",
                en: "Such funds exist in some jurisdictions, and they cover specific situations like broker failure or fraud, not ordinary market losses. No system insures against prices falling.",
              },
            },
            {
              text: { bn: "হ্যাঁ, যদি আপনি ৩০ দিনের মধ্যে অভিযোগ করেন", en: "Yes, if you complain within 30 days" },
              why: {
                bn: "সময়সীমার সঙ্গে এর সম্পর্ক নেই। অভিযোগ করা যায় নিয়ম ভঙ্গ হলে, লোকসান হলে নয়। এই দুইটা আলাদা জিনিস, আর পার্থক্যটাই সবচেয়ে গুরুত্বপূর্ণ।",
                en: "Deadlines have nothing to do with it. A complaint is about a breach of rules, not about a loss. Those are different things, and the difference is the whole point.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "আপনার এক পরিচিত বলছেন একটা কোম্পানির প্রান্তিক ফলাফল দুর্দান্ত আসবে, তিনি ভেতর থেকে জানেন, আর এখনো ঘোষণা হয়নি। কী করবেন?",
            en: "An acquaintance says a company's quarterly results will be excellent, that they know from inside, and that nothing has been announced. What do you do?",
          },
          options: [
            {
              text: { bn: "দ্রুত কিনে ফেলি, ঘোষণার আগে", en: "Buy quickly, before the announcement" },
              why: {
                bn: "এটা ভেতরের খবরে লেনদেন, আর সেটা অবৈধ। আইনি ঝুঁকির বাইরেও একটা ব্যবহারিক কথা আছে: এই ধরনের বেশিরভাগ তথ্য ভুল, অতিরঞ্জিত বা ইতিমধ্যে দামে ঢুকে যাওয়া, তাই ঝুঁকিটা যতটা বড় সুবিধাটা ততটা নয়।",
                en: "That is insider dealing and it is illegal. Beyond the legal risk there is a practical point: most such information is wrong, exaggerated or already in the price, so the risk is large and the edge is not.",
              },
            },
            {
              text: { bn: "কিছু করি না, আর ঘোষণার পর নিজের যুক্তিতে সিদ্ধান্ত নিই", en: "Do nothing, and decide on my own reasoning after the announcement" },
              right: true,
              why: {
                bn: "ঠিক। ঘোষণার পর তথ্যটা সবার, আর তখন সিদ্ধান্তটা আপনার নিজের বিশ্লেষণ থেকে আসে। আরেকটা কথা মনে রাখুন: যিনি সত্যিই ভেতরের খবর জানেন তিনি সাধারণত সেটা বলে বেড়ান না।",
                en: "Right. After the announcement the information belongs to everybody, and the decision comes from your own analysis. And remember: someone who genuinely has inside information does not usually go around sharing it.",
              },
            },
            {
              text: { bn: "অন্যদের বলে দিই, যাতে তারাও লাভ করতে পারেন", en: "Pass it on so others can benefit too" },
              why: {
                bn: "প্রকাশিত হয়নি এমন মূল্য সংবেদনশীল তথ্য ছড়ানো নিজেও একটা সমস্যা, আর আপনি এমন কিছু ছড়াচ্ছেন যার সত্যতা আপনি যাচাই করতে পারেননি। যদি তথ্যটা ভুল হয়, ক্ষতি হবে যারা আপনাকে বিশ্বাস করেছেন তাদের।",
                en: "Passing on unpublished price-sensitive information is itself a problem, and you would be spreading something you cannot verify. If it is wrong, the people who trusted you are the ones who lose.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"exchanges-cdbl": {
  bn: `
<p>আপনি অ্যাপে কেনার বোতামে চাপ দিলেন। কয়েক সেকেন্ড পরে লেখা এল, হয়ে গেছে। এর মাঝখানে অন্তত চারটা প্রতিষ্ঠান কাজ করেছে, আর তাদের কে কী করল সেটা জানা থাকলে দুইটা জিনিস সহজ হয়: টাকা বা শেয়ার দেরিতে এলে কোথায় জিজ্ঞেস করবেন, আর কোনটা কার দোষ।</p>

<p>এই লেখাটা একটা লেনদেনের পুরো যাত্রাটা দেখায়, শুরু থেকে শেষ পর্যন্ত।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ডিএসই আর সিএসই দুইটা এক্সচেঞ্জ, ঢাকা আর চট্টগ্রাম।</li>
<li>এক্সচেঞ্জ কেবল মেলায়; শেয়ারের মালিকানার হিসাব রাখে সিডিবিএল।</li>
<li>আপনার শেয়ার বিও অ্যাকাউন্টে থাকে, ব্রোকারের কাছে নয়।</li>
<li>লেনদেন আর নিষ্পত্তি দুইটা আলাদা ধাপ, আর সময়ও আলাদা।</li>
<li>সমস্যা হলে কোন ধাপে হয়েছে সেটাই প্রথম প্রশ্ন।</li>
</ul>
</div>

<h2>একটা কেনার পুরো যাত্রা</h2>

${mount("exch-flow")}

<p>খেয়াল করুন ব্রোকার দুইবার আসেন: একবার আপনার অর্ডার এক্সচেঞ্জে পাঠাতে, আরেকবার নিষ্পত্তির সময় টাকা আর শেয়ারের হিসাব মেলাতে। এই কারণেই বেশিরভাগ সমস্যার প্রথম গন্তব্য ব্রোকার।</p>

<h2>এক্সচেঞ্জ কী করে আর কী করে না</h2>

<p>একটা এক্সচেঞ্জ একটা মেলানোর যন্ত্র। এটা সব ক্রেতার অর্ডার আর সব বিক্রেতার অর্ডার এক জায়গায় জড়ো করে আর নিয়ম মেনে মেলায়: সবচেয়ে ভালো দাম আগে, একই দামে হলে যে আগে এসেছে সে আগে।</p>

<p>এক্সচেঞ্জ দাম ঠিক করে না, কোম্পানির মান যাচাই করে না, আর আপনার লাভ লোকসানের সঙ্গে এর কোনো সম্পর্ক নেই। যা করে তা হলো: একটা স্বচ্ছ, নিয়মমাফিক জায়গা দেওয়া যেখানে দাম প্রকাশ্যে তৈরি হয়। <a class="term" href="/money/terms/dse.html">ডিএসই</a> লেখাটা এই যন্ত্রটার ভেতরটা দেখায়।</p>

${mount("exch-compare")}

<p>সিএসই চট্টগ্রামের এক্সচেঞ্জ, আর এটা ডিএসইর চেয়ে ছোট। বেশিরভাগ কোম্পানি দুইটাতেই তালিকাভুক্ত, আর দাম দুই জায়গায় সামান্য আলাদা হতে পারে, কারণ দুইটার অর্ডার বই আলাদা। বেশিরভাগ ব্যক্তি বিনিয়োগকারীর লেনদেন ডিএসইতে হয়, কারণ সেখানেই তারল্য বেশি।</p>

<h2>সিডিবিএল, যেখানে আপনার শেয়ার আসলে থাকে</h2>

<p>এটা সবচেয়ে কম বোঝা প্রতিষ্ঠান, অথচ আপনার মালিকানার প্রমাণ এখানেই। সেন্ট্রাল ডিপোজিটরি বাংলাদেশ লিমিটেড ইলেকট্রনিক আকারে রাখে কার কোন শেয়ার কতটা আছে।</p>

<p>এর মানে একটা গুরুত্বপূর্ণ কথা: <strong>আপনার শেয়ার ব্রোকারের সম্পত্তি নয়।</strong> সেগুলো আপনার <a class="term" href="/money/terms/bo-account.html">বিও অ্যাকাউন্টে</a> আছে, যা আপনার নামে। ব্রোকার আপনার প্রতিনিধি, রক্ষক নন। এই কাঠামোটাই কারণ যে একটা ব্রোকারেজ হাউস বন্ধ হয়ে গেলেও আপনার শেয়ারগুলো আপনারই থাকে, যদিও প্রক্রিয়াটা ঝামেলার হতে পারে।</p>

<div class="note">
<p>সিডিবিএল থেকে আপনি নিজের অ্যাকাউন্টের বিবরণী নিতে পারেন, ব্রোকারের দেওয়া কাগজের উপর নির্ভর না করেই। বছরে একবার এটা মিলিয়ে দেখা একটা ভালো অভ্যাস, বিশেষ করে যদি আপনার ব্রোকার আপনার হয়ে সিদ্ধান্ত নেওয়ার সুযোগ পান।</p>
</div>

<h2>নিষ্পত্তি: লেনদেন আর হাতে পাওয়া এক নয়</h2>

<p>আপনি আজ কিনলেন। শেয়ারগুলো আজই আপনার বিও অ্যাকাউন্টে ঢোকে না, আর বেচলে টাকাও আজ হাতে আসে না। এর মাঝে একটা নিষ্পত্তি চক্র আছে, যা কয়েক কার্যদিবস, আর <a class="term" href="/money/basics-2/share-categories.html">ক্যাটাগরি</a> ভেদে আলাদা হতে পারে।</p>

<p>এটা নিয়ে দুইটা ব্যবহারিক কথা। প্রথমত, বেচার টাকা দিয়ে একই দিনে আবার কেনা যায় কি না, সেটা ব্রোকারের নিয়ম আর নিষ্পত্তির শর্তের উপর নির্ভর করে, তাই আগে জেনে নিন। দ্বিতীয়ত, যদি আপনার একটা নির্দিষ্ট তারিখে টাকা দরকার হয়, তাহলে নিষ্পত্তির দিন গুনে অন্তত এক সপ্তাহ আগে বেচুন।</p>

${mount("exch-order")}

<h2>কোথায় কোন অভিযোগ</h2>

<p>সমস্যাটা কোন ধাপে, সেটাই ঠিক করে কার কাছে যাবেন। অর্ডার ঠিকমতো যায়নি, ভুল দামে হয়েছে, বা কমিশন বেশি কাটা হয়েছে: এগুলো ব্রোকারের। শেয়ার বিও অ্যাকাউন্টে ঢোকেনি বা মালিকানার হিসাবে গরমিল: এটা সিডিবিএলের দিক, তবে অভিযোগ ব্রোকারের মাধ্যমেই শুরু হয়। বাজারের নিয়ম নিয়ে অভিযোগ: ডিএসই, আর তারপর <a class="term" href="/money/basics-2/bsec.html">বিএসইসি</a>।</p>

${mount("exch-quiz")}

<div class="checklist">
<ul>
<li>আপনার বিও অ্যাকাউন্ট নম্বরটা লিখে নিরাপদে রাখুন।</li>
<li>আপনার শেষ কনট্রাক্ট নোটে নিষ্পত্তির তারিখটা খুঁজে বের করুন।</li>
<li>ব্রোকারকে জিজ্ঞেস করুন বেচার টাকা কবে তোলা যায়।</li>
<li>সিডিবিএলের বিবরণী কীভাবে পাওয়া যায়, জেনে রাখুন।</li>
</ul>
</div>
`,
  en: `
<p>You press buy in the app. A few seconds later it says done. In between, at least four institutions did something, and knowing who did what makes two things easier: where to ask when money or shares arrive late, and whose fault it is.</p>

<p>This lesson follows one transaction the whole way through.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>The DSE and CSE are two exchanges, in Dhaka and Chittagong.</li>
<li>An exchange only matches; the record of ownership is kept by CDBL.</li>
<li>Your shares sit in your BO account, not with your broker.</li>
<li>Trading and settlement are two separate steps, on different clocks.</li>
<li>When something goes wrong, the first question is which step it went wrong at.</li>
</ul>
</div>

<h2>The whole journey of one purchase</h2>

${mount("exch-flow")}

<p>Notice the broker appears twice: once to send your order to the exchange, and again at settlement to reconcile money and shares. Which is why most problems begin at the broker.</p>

<h2>What an exchange does and does not do</h2>

<p>An exchange is a matching machine. It gathers every buyer's order and every seller's order in one place and matches them by rule: best price first, and among equal prices, whoever arrived first.</p>

<p>An exchange does not set prices, does not judge the quality of a company, and has nothing to do with your gains or losses. What it does is provide a transparent, rule-bound place where prices are made in the open. The lesson on <a class="term" href="/money/terms/dse.html">the DSE</a> looks inside that machine.</p>

${mount("exch-compare")}

<p>The CSE is Chittagong's exchange and it is smaller than the DSE. Most companies are listed on both, and prices can differ slightly between them, because the two order books are separate. Most individual trading happens on the DSE, because that is where the liquidity is.</p>

<h2>CDBL, where your shares actually sit</h2>

<p>This is the least understood institution, and yet the proof of your ownership lives there. Central Depository Bangladesh Limited holds, electronically, the record of who owns how much of what.</p>

<p>Which means something important: <strong>your shares are not your broker's property.</strong> They sit in your <a class="term" href="/money/terms/bo-account.html">BO account</a>, in your name. The broker is your agent, not your custodian. That structure is why your shares remain yours even if a brokerage house closes, though the process can be troublesome.</p>

<div class="note">
<p>You can obtain a statement of your account from CDBL rather than relying on the paperwork your broker sends. Reconciling the two once a year is a good habit, especially if your broker has any discretion over your account.</p>
</div>

<h2>Settlement: trading and receiving are not the same</h2>

<p>You buy today. The shares do not arrive in your BO account today, and if you sell, the money does not arrive today either. In between is a settlement cycle, a few working days, and it can differ by <a class="term" href="/money/basics-2/share-categories.html">category</a>.</p>

<p>Two practical points follow. First, whether you can buy again the same day with the proceeds of a sale depends on your broker's rules and settlement terms, so ask beforehand. Second, if you need money on a particular date, count the settlement days and sell at least a week early.</p>

${mount("exch-order")}

<h2>Which complaint goes where</h2>

<p>Which step went wrong decides where you go. The order was not sent, was filled at the wrong price, or the commission was overcharged: those are the broker's. Shares did not arrive in the BO account, or the ownership record disagrees: that is the CDBL side, though the complaint still starts with your broker. A complaint about market rules: the DSE, and then <a class="term" href="/money/basics-2/bsec.html">BSEC</a>.</p>

${mount("exch-quiz")}

<div class="checklist">
<ul>
<li>Write down your BO account number and store it safely.</li>
<li>Find the settlement date on your most recent contract note.</li>
<li>Ask your broker when the proceeds of a sale can be withdrawn.</li>
<li>Learn how to obtain a CDBL statement.</li>
</ul>
</div>
`,
  blocks: {
    "exch-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "বোতাম থেকে বিও অ্যাকাউন্ট", en: "From the button to the BO account" },
      note: { bn: "প্রতিটা ধাপে আলাদা একটা প্রতিষ্ঠান, আর আলাদা একটা সম্ভাব্য সমস্যা।", en: "A different institution at each step, and a different thing that can go wrong." },
      parts: [
        { text: { bn: "আপনি অর্ডার দিলেন", en: "You place the order" }, note: { bn: "অ্যাপ বা টার্মিনালে, ব্রোকারের কাছে", en: "In an app or terminal, to your broker" } },
        { text: { bn: "ব্রোকার এক্সচেঞ্জে পাঠালেন", en: "The broker routes it to the exchange" }, note: { bn: "এখানে দেরি হলে দাম বদলে যেতে পারে", en: "A delay here can change the price you get" } },
        { text: { bn: "এক্সচেঞ্জ মেলাল", en: "The exchange matches it" }, note: { bn: "সেরা দাম আগে, একই দামে আগে আসা আগে", en: "Best price first, and among equals whoever arrived first" }, tone: "lead" },
        { text: { bn: "নিষ্পত্তি", en: "Settlement" }, note: { bn: "কয়েক কার্যদিবস। টাকা যায়, শেয়ার আসে।", en: "A few working days. Money goes out, shares come in." }, tone: "warn" },
        { text: { bn: "সিডিবিএলে মালিকানা বদলাল", en: "CDBL updates the ownership record" }, note: { bn: "এখান থেকে শেয়ারগুলো আপনার নামে, আপনার বিও অ্যাকাউন্টে", en: "From here the shares are in your name, in your BO account" }, tone: "good" },
      ],
      caption: {
        bn: "লেনদেন হয় সেকেন্ডে, মালিকানা বদলায় দিনে। এই দুইটার পার্থক্যই বেশিরভাগ বিভ্রান্তির উৎস।",
        en: "The trade takes seconds and the ownership takes days. The gap between the two causes most of the confusion.",
      },
    },
    "exch-compare": {
      kind: "compare",
      title: { bn: "তিনটা প্রতিষ্ঠান, তিনটা ভূমিকা", en: "Three institutions, three roles" },
      columns: [
        { bn: "ডিএসই", en: "DSE" },
        { bn: "সিএসই", en: "CSE" },
        { bn: "সিডিবিএল", en: "CDBL" },
      ],
      rows: [
        {
          label: { bn: "কী করে", en: "What it does" },
          cells: [
            { bn: "ঢাকার এক্সচেঞ্জ, অর্ডার মেলায়", en: "Dhaka's exchange, matches orders" },
            { bn: "চট্টগ্রামের এক্সচেঞ্জ, একই কাজ", en: "Chittagong's exchange, the same job" },
            { bn: "মালিকানার ইলেকট্রনিক হিসাব রাখে", en: "Keeps the electronic ownership record" },
          ],
        },
        {
          label: { bn: "তারল্য", en: "Liquidity" },
          cells: [{ bn: "বেশি", en: "Higher" }, { bn: "কম", en: "Lower" }, { bn: "প্রযোজ্য নয়", en: "Not applicable" }],
          best: 0,
        },
        {
          label: { bn: "আপনার শেয়ার কি এখানে থাকে?", en: "Do your shares sit here?" },
          cells: [{ bn: "না", en: "No" }, { bn: "না", en: "No" }, { bn: "হ্যাঁ, আপনার বিও অ্যাকাউন্টে", en: "Yes, in your BO account" }],
        },
        {
          label: { bn: "দাম ঠিক করে?", en: "Does it set the price?" },
          cells: [{ bn: "না, মেলায় মাত্র", en: "No, it only matches" }, { bn: "না", en: "No" }, { bn: "না", en: "No" }],
        },
      ],
    },
    "exch-order": {
      kind: "order",
      title: { bn: "একটা লেনদেনের ক্রম সাজান", en: "Put the steps of a trade in order" },
      note: { bn: "বোতাম চাপা থেকে শেয়ার হাতে আসা পর্যন্ত।", en: "From pressing the button to the shares arriving." },
      items: [
        { text: { bn: "আপনি অ্যাপে লিমিট অর্ডার দিলেন", en: "You place a limit order in the app" } },
        { text: { bn: "ব্রোকার অর্ডারটা এক্সচেঞ্জের বইতে পাঠালেন", en: "The broker sends it to the exchange's book" } },
        { text: { bn: "একজন বিক্রেতার দামের সঙ্গে মিলে গেল", en: "It matches a seller's price" } },
        { text: { bn: "কনট্রাক্ট নোট তৈরি হলো", en: "A contract note is produced" }, why: { bn: "এটাই আপনার প্রমাণ, তাই সংরক্ষণ করুন।", en: "This is your evidence; keep it." } },
        { text: { bn: "নিষ্পত্তির দিনে টাকা কাটা হলো", en: "The money is taken on the settlement day" } },
        { text: { bn: "সিডিবিএলে শেয়ার আপনার বিও অ্যাকাউন্টে জমা হলো", en: "CDBL credits the shares to your BO account" }, why: { bn: "এখান থেকে আপনি আইনত মালিক।", en: "From here you are the legal owner." } },
      ],
    },
    "exch-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার ব্রোকারেজ হাউস হঠাৎ বন্ধ হয়ে গেল। আপনার শেয়ারগুলোর কী হবে?",
            en: "Your brokerage house suddenly shuts down. What happens to your shares?",
          },
          options: [
            {
              text: { bn: "সেগুলো আপনার বিও অ্যাকাউন্টেই থাকে, কারণ মালিকানা সিডিবিএলের হিসাবে", en: "They stay in your BO account, because the ownership record is at CDBL" },
              right: true,
              why: {
                bn: "ঠিক। এই কাঠামোটাই ডিম্যাট ব্যবস্থার সবচেয়ে বড় সুবিধা: শেয়ার ব্রোকারের ব্যালান্স শিটে নেই, আপনার নামের অ্যাকাউন্টে আছে। প্রক্রিয়াটা ঝামেলার হতে পারে আর সময় লাগতে পারে, কিন্তু মালিকানা নিয়ে প্রশ্ন থাকে না।",
                en: "Right. That structure is the largest benefit of the dematerialised system: the shares are not on the broker's balance sheet, they are in an account in your name. The process can be slow and troublesome, but the ownership is not in question.",
              },
            },
            {
              text: { bn: "শেয়ারগুলো ব্রোকারের সম্পত্তি হিসেবে বিক্রি হয়ে যাবে", en: "They are sold as the broker's assets" },
              why: {
                bn: "না, আর এই ভুল ধারণাটা অনেকের আছে। ব্রোকার আপনার প্রতিনিধি, মালিক নন। তবে ব্রোকারের কাছে থাকা আপনার নগদ টাকা আলাদা প্রশ্ন, আর সেটাই বেশি ঝুঁকির।",
                en: "No, and this misconception is common. The broker is your agent, not your owner. Cash held with the broker is a separate question, and it is the riskier one.",
              },
            },
            {
              text: { bn: "ডিএসই আপনার শেয়ার ধরে রাখে", en: "The DSE holds your shares" },
              why: {
                bn: "এক্সচেঞ্জ কোনো শেয়ার ধরে রাখে না। এটা কেবল অর্ডার মেলায়। হিসাব রাখার কাজটা সিডিবিএলের, আর দুইটা আলাদা প্রতিষ্ঠান।",
                en: "An exchange holds no shares. It only matches orders. Record keeping belongs to CDBL, and they are separate institutions.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "আপনার ২০ তারিখে একটা নির্দিষ্ট অঙ্কের টাকা দরকার, আর সেটা শেয়ার বেচে আসবে। কবে বেচা উচিত?",
            en: "You need a specific sum on the 20th, and it will come from selling shares. When should you sell?",
          },
          options: [
            {
              text: { bn: "১৯ তারিখে, তাহলে বাজারের সর্বশেষ দাম পাব", en: "On the 19th, to get the latest price" },
              why: {
                bn: "নিষ্পত্তি কয়েক কার্যদিবস নেয়, তাই ১৯ তারিখে বেচলে ২০ তারিখে টাকা হাতে থাকার সম্ভাবনা কম। ছুটি পড়লে আরও দেরি।",
                en: "Settlement takes a few working days, so selling on the 19th is unlikely to put money in your hand on the 20th. A holiday makes it later still.",
              },
            },
            {
              text: { bn: "অন্তত এক সপ্তাহ আগে, নিষ্পত্তি আর ছুটির দিন হিসাব করে", en: "At least a week early, counting settlement and holidays" },
              right: true,
              why: {
                bn: "ঠিক। নিষ্পত্তির দিন, ব্যাংকে টাকা পৌঁছানোর সময় আর সাপ্তাহিক ছুটি, তিনটাই যোগ হয়। আর একটা বাড়তি সুবিধা আছে: তাড়াহুড়ো না থাকলে আপনি খারাপ দামে বেচতে বাধ্য হন না।",
                en: "Right. Settlement days, the time for money to reach the bank and weekends all add up. There is a second benefit too: without a rush you are not forced to sell at a bad price.",
              },
            },
            {
              text: { bn: "২০ তারিখ সকালে, বাজার খোলার সঙ্গে সঙ্গে", en: "On the morning of the 20th, at the open" },
              why: {
                bn: "লেনদেন হবে সেই দিনই, কিন্তু টাকা আসবে না। লেনদেন আর নিষ্পত্তি দুইটা আলাদা ঘড়িতে চলে, আর এই পার্থক্যটাই এখানে গুরুত্বপূর্ণ।",
                en: "The trade happens that day and the money does not arrive. Trading and settlement run on separate clocks, and that difference is the whole point here.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"bangladesh-bank": {
  bn: `
<p>বাংলাদেশ ব্যাংক দেশের কেন্দ্রীয় ব্যাংক, আর একজন বিনিয়োগকারীর দৃষ্টিতে এর গুরুত্ব একটা কারণে: <strong>এই একটা প্রতিষ্ঠান টাকার দাম ঠিক করে, আর টাকার দাম বদলালে বাজারের প্রায় সবকিছু বদলায়।</strong></p>

<p>এই লেখাটা কেন্দ্রীয় ব্যাংকের কাজগুলোর তালিকা নয়। এটা দেখায় কেন্দ্রীয় ব্যাংকের একটা সিদ্ধান্ত কীভাবে ধাপে ধাপে আপনার শেয়ারের দামে গিয়ে পৌঁছায়, আর খবরে কী দেখলে সতর্ক হতে হয়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>নীতি সুদের হার বাড়ানো মানে অর্থনীতিতে টাকার দাম বাড়ানো।</li>
<li>সুদ বাড়লে ঋণনির্ভর কোম্পানির মুনাফা কমে আর এফডিআর আকর্ষণীয় হয়।</li>
<li>মুদ্রাস্ফীতি বেশি হলে কেন্দ্রীয় ব্যাংক সুদ বাড়ায়, এটাই স্বাভাবিক প্রতিক্রিয়া।</li>
<li>রিজার্ভ আর বিনিময় হারও এদের এখতিয়ারে, আর সেটা আমদানিনির্ভর কোম্পানির খরচে ঢোকে।</li>
<li>মুদ্রানীতি বিবৃতি বছরে কয়েকবার আসে আর পড়ার মতো।</li>
</ul>
</div>

<h2>একটা সিদ্ধান্ত, আর তার যাত্রা</h2>

${mount("bb-flow")}

<p>শৃঙ্খলটা লম্বা, আর প্রতিটা ধাপে কিছু সময় লাগে। এই কারণেই সুদের হারের সিদ্ধান্তের প্রভাব সঙ্গে সঙ্গে দেখা যায় না, আর যখন দেখা যায় তখন অনেকে অন্য কারণ খোঁজেন।</p>

<h2>কেন্দ্রীয় ব্যাংকের হাতের যন্ত্রগুলো</h2>

${mount("bb-match")}

<p>প্রতিটা যন্ত্রের একটা উদ্দেশ্য আছে, আর প্রায় প্রতিটার একটা পার্শ্বপ্রতিক্রিয়া। সুদ বাড়ালে মুদ্রাস্ফীতি কমতে পারে আর প্রবৃদ্ধিও কমে। রিজার্ভ থেকে ডলার বিক্রি করলে টাকার মান ধরে রাখা যায় আর রিজার্ভ কমে। ঝুঁকিহীন সিদ্ধান্ত কেন্দ্রীয় ব্যাংকের হাতে নেই, কেবল ঝুঁকির বিনিময় আছে।</p>

<h2>সুদের হার আর শেয়ারের দাম</h2>

<p>সম্পর্কটা দুইভাবে কাজ করে, আর দুইটাই একই দিকে ঠেলে।</p>

<p><strong>কোম্পানির দিক।</strong> যাদের ঋণ আছে তাদের সুদ খরচ বাড়ে, তাই মুনাফা কমে। নির্মাণ আর ভোগ্যপণ্যের চাহিদাও কমে, কারণ মানুষ কম ধার করে। এটা আয়ের দিক থেকে চাপ।</p>

<p><strong>বিনিয়োগকারীর দিক।</strong> <a class="term" href="/money/terms/fdr.html">এফডিআর</a> বা <a class="term" href="/money/terms/treasury-bill.html">ট্রেজারি বিলে</a> ভালো রিটার্ন পাওয়া গেলে শেয়ারের ঝুঁকি নেওয়ার প্রয়োজন কমে যায়, তাই কিছু টাকা বাজার থেকে সরে যায়। এটা চাহিদার দিক থেকে চাপ।</p>

${mount("bb-lab")}

<p>যন্ত্রটাতে দুইটা জিনিস আলাদা করে নাড়িয়ে দেখুন: কোম্পানির ঋণ, আর সুদের হারের পরিবর্তন। বেশি ঋণওয়ালা কোম্পানিতে একই পরিবর্তন অনেক বেশি ক্ষতি করে, আর এটাই সুদ বাড়ার সময় প্রথমে দেখার জিনিস।</p>

<h2>বিনিময় হার আর রিজার্ভ</h2>

<p>বাংলাদেশ ব্যাংক বিনিময় হারের ব্যবস্থাপনায় ভূমিকা রাখে, আর এটা সরাসরি কোম্পানির খরচে যায়। <a class="term" href="/money/basics-2/interest-and-taka.html">সুদের হার আর টাকার মান</a> লেখাটা সেই শৃঙ্খলটা দেখিয়েছে। এখানে যোগ করার মতো একটা কথা: রিজার্ভ কমতে থাকলে আমদানির উপর বিধিনিষেধ আসতে পারে, আর সেটা যেসব কোম্পানি কাঁচামাল আমদানি করে তাদের উৎপাদনে সরাসরি আঘাত করে।</p>

<div class="ex">
<p><strong>একটা শৃঙ্খল, শুরু থেকে শেষ।</strong> রিজার্ভ চাপে পড়ল, তাই এলসি খোলা কঠিন হলো। একটা ইস্পাত কোম্পানি সময়মতো কাঁচামাল আনতে পারল না, তাই উৎপাদন কমল। বিক্রি কমল, কিন্তু স্থায়ী খরচ একই থাকল, তাই মুনাফার হার পড়ল। তিন মাস পরের প্রান্তিক ফলাফলে এটা দেখা গেল, আর তখন শেয়ারের দাম পড়ল। যিনি প্রথম ধাপটা দেখেছিলেন তিনি তিন মাস আগে জানতেন।</p>
</div>

<h2>মুদ্রানীতি বিবৃতি পড়া</h2>

<p>বাংলাদেশ ব্যাংক নিয়মিত মুদ্রানীতি বিবৃতি প্রকাশ করে, আর এটা একজন বিনিয়োগকারীর জন্য বিনামূল্যের একটা ভালো তথ্যসূত্র। পুরোটা পড়ার দরকার নেই। তিনটা জিনিস খুঁজুন: নীতি সুদের হার নিয়ে কী বলা হয়েছে, মুদ্রাস্ফীতির লক্ষ্য কত, আর ঋণ প্রবৃদ্ধির লক্ষ্য কী।</p>

<p>এই তিনটা থেকেই আপনি আগামী কয়েক মাসের দিকটা আন্দাজ করতে পারবেন, আর সেটা আপনার পোর্টফোলিওতে ঋণনির্ভর কোম্পানির ওজন কত হওয়া উচিত সেই সিদ্ধান্তে কাজে লাগবে।</p>

<div class="checklist">
<ul>
<li>বাংলাদেশ ব্যাংকের সাইটে সর্বশেষ মুদ্রানীতি বিবৃতিটা খুঁজে বের করুন।</li>
<li>বর্তমান নীতি সুদের হার লিখে রাখুন।</li>
<li>আপনার প্রতিটা শেয়ারের ঋণ ইকুইটির তুলনায় কত, দেখুন।</li>
<li>যেগুলোর ঋণ বেশি, সেগুলোর সুদ খরচ গত বছরের তুলনায় কত বেড়েছে দেখুন।</li>
</ul>
</div>

${mount("bb-quiz")}
`,
  en: `
<p>Bangladesh Bank is the country's central bank, and from an investor's point of view it matters for one reason: <strong>this single institution sets the price of money, and when the price of money changes, almost everything in the market changes.</strong></p>

<p>This lesson is not a list of a central bank's functions. It traces how one decision there travels, step by step, to the price of your shares, and what to watch for in the news.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Raising the policy rate means raising the price of money in the economy.</li>
<li>Higher rates cut the profits of indebted companies and make deposits attractive.</li>
<li>When inflation is high a central bank raises rates; that is the normal response.</li>
<li>Reserves and the exchange rate are also theirs, and they enter the costs of importers.</li>
<li>The monetary policy statement comes out several times a year and is worth reading.</li>
</ul>
</div>

<h2>One decision, and its journey</h2>

${mount("bb-flow")}

<p>The chain is long and each step takes time. That is why the effect of a rate decision is not visible immediately, and why, when it does become visible, many people go looking for a different explanation.</p>

<h2>The tools in a central bank's hands</h2>

${mount("bb-match")}

<p>Each tool has a purpose and nearly every one has a side effect. Raising rates may lower inflation and it lowers growth too. Selling dollars from reserves supports the taka and depletes the reserves. A central bank has no risk-free decisions available, only exchanges of one risk for another.</p>

<h2>Interest rates and share prices</h2>

<p>The relationship works in two directions, and both push the same way.</p>

<p><strong>The company side.</strong> Anyone with debt pays more interest, so profits fall. Demand for construction and consumer goods also falls, because people borrow less. That is pressure on earnings.</p>

<p><strong>The investor side.</strong> When <a class="term" href="/money/terms/fdr.html">fixed deposits</a> or <a class="term" href="/money/terms/treasury-bill.html">treasury bills</a> pay well, there is less need to take share risk, so some money leaves the market. That is pressure on demand.</p>

${mount("bb-lab")}

<p>Move two things separately in the tool: the company's debt, and the change in rates. The same change hurts a heavily indebted company far more, and that is the first thing to look at when rates are rising.</p>

<h2>The exchange rate and reserves</h2>

<p>Bangladesh Bank plays a role in managing the exchange rate, and that goes straight into company costs. The lesson on <a class="term" href="/money/basics-2/interest-and-taka.html">interest rates and the taka</a> traced that chain. One thing to add here: when reserves come under pressure, restrictions on imports can follow, and those hit production directly at any company that imports its raw materials.</p>

<div class="ex">
<p><strong>One chain, start to finish.</strong> Reserves came under pressure, so opening letters of credit became difficult. A steel company could not bring in raw material on time, so output fell. Sales fell while fixed costs stayed the same, so margins dropped. It showed up in the quarterly results three months later, and the share price fell then. Anyone watching the first step knew three months earlier.</p>
</div>

<h2>Reading the monetary policy statement</h2>

<p>Bangladesh Bank publishes a monetary policy statement regularly, and it is a good free source for an investor. You do not have to read all of it. Look for three things: what is said about the policy rate, what the inflation target is, and what the target is for credit growth.</p>

<p>Those three give you a direction for the next few months, and that feeds directly into how much weight indebted companies should have in your portfolio.</p>

<div class="checklist">
<ul>
<li>Find the latest monetary policy statement on the Bangladesh Bank site.</li>
<li>Write down the current policy rate.</li>
<li>Check the debt against equity for each of your holdings.</li>
<li>For the indebted ones, see how much their interest bill grew against last year.</li>
</ul>
</div>

${mount("bb-quiz")}
`,
  blocks: {
    "bb-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "নীতি সুদের হার থেকে আপনার শেয়ার", en: "From the policy rate to your shares" },
      note: { bn: "প্রতিটা তীরে কয়েক সপ্তাহ থেকে কয়েক মাস সময় লাগে।", en: "Each arrow takes weeks or months." },
      parts: [
        { text: { bn: "নীতি সুদের হার বাড়ল", en: "The policy rate rises" }, note: { bn: "কেন্দ্রীয় ব্যাংক ব্যাংকগুলোকে যে দামে টাকা ধার দেয়", en: "The price at which the central bank lends to banks" }, tone: "lead" },
        { text: { bn: "ব্যাংকের ঋণের সুদ বাড়ল", en: "Bank lending rates rise" }, note: { bn: "নতুন ঋণে আগে, চলতি ঋণে পরে", en: "New loans first, existing ones later" } },
        { text: { bn: "কোম্পানির সুদ খরচ বাড়ল", en: "Company interest bills rise" }, note: { bn: "যাদের ঋণ বেশি তাদের বেশি", en: "Most for those with the most debt" }, tone: "warn" },
        { text: { bn: "মুনাফা কমল, চাহিদাও কমল", en: "Profits fall, and so does demand" }, note: { bn: "মানুষও কম ধার করে, তাই বিক্রি কমে", en: "People borrow less too, so sales fall" }, tone: "bad" },
        { text: { bn: "শেয়ারের দামে চাপ", en: "Pressure on share prices" }, note: { bn: "একই সঙ্গে এফডিআর আকর্ষণীয় হওয়ায় টাকাও সরে যায়", en: "And money leaves as deposits become attractive" }, tone: "bad" },
      ],
      caption: {
        bn: "উল্টো দিকেও একইভাবে কাজ করে। সুদ কমলে এই শৃঙ্খলের প্রতিটা ধাপ বিপরীত দিকে চলে, আর সেটাও কয়েক মাস সময় নেয়।",
        en: "It works the same way in reverse. When rates fall every step runs the other way, and that also takes months.",
      },
    },
    "bb-match": {
      kind: "match",
      title: { bn: "যন্ত্র আর তার কাজ", en: "Tool and purpose" },
      note: { bn: "কেন্দ্রীয় ব্যাংকের হাতিয়ারগুলোর সঙ্গে সেগুলোর মূল উদ্দেশ্য মেলান।", en: "Match each central bank tool with what it is mainly for." },
      pairs: [
        { left: { bn: "নীতি সুদের হার", en: "The policy rate" }, right: { bn: "অর্থনীতিতে টাকার দাম ঠিক করা", en: "Setting the price of money in the economy" } },
        { left: { bn: "নগদ জমার অনুপাত", en: "The cash reserve ratio" }, right: { bn: "ব্যাংক কতটা ঋণ দিতে পারবে তার সীমা", en: "Limiting how much banks can lend" } },
        { left: { bn: "রিজার্ভ থেকে ডলার বিক্রি", en: "Selling dollars from reserves" }, right: { bn: "টাকার মান ধরে রাখা", en: "Supporting the taka" } },
        { left: { bn: "ব্যাংক তদারকি আর পরিদর্শন", en: "Bank supervision and inspection" }, right: { bn: "আমানতকারীদের সুরক্ষা", en: "Protecting depositors" } },
        { left: { bn: "মুদ্রানীতি বিবৃতি", en: "The monetary policy statement" }, right: { bn: "আগামী কয়েক মাসের দিক জানানো", en: "Signalling the direction of the coming months" } },
      ],
    },
    "bb-lab": {
      kind: "lab",
      model: "rates",
      title: { bn: "সুদ বাড়লে মুনাফার কী হয়", en: "What a rate rise does to profit" },
      note: { bn: "ঋণের অঙ্কটা বাড়ান আর দেখুন একই সুদের পরিবর্তন কতটা বেশি ক্ষতি করে।", en: "Raise the debt figure and see how much more the same rate change costs." },
      preset: { rate: 9, change: 3, pe: 14, debt: 600, profit: 60 },
    },
    "bb-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "মুদ্রাস্ফীতি ১১%, আর কেন্দ্রীয় ব্যাংক নীতি সুদের হার বাড়িয়েছে। আপনার পোর্টফোলিওতে প্রথমে কী দেখা উচিত?",
            en: "Inflation is 11% and the central bank has raised the policy rate. What should you look at first in your portfolio?",
          },
          options: [
            {
              text: { bn: "কোন কোম্পানিগুলোর ঋণ সবচেয়ে বেশি", en: "Which companies carry the most debt" },
              right: true,
              why: {
                bn: "ঠিক। সুদের হার বাড়ার প্রথম আর সবচেয়ে সরাসরি প্রভাব সুদ খরচে, আর সেটা ঋণের পরিমাণের সঙ্গে সরাসরি সমানুপাতিক। ঋণ ইকুইটির তুলনায় কত, আর সুদ খরচ পরিচালন মুনাফার কত অংশ খাচ্ছে, এই দুইটাই দেখার জিনিস।",
                en: "Right. The first and most direct effect of a rate rise is on interest expense, and that scales directly with debt. Debt against equity, and what share of operating profit the interest bill eats, are the two things to look at.",
              },
            },
            {
              text: { bn: "কোন কোম্পানিগুলোর দাম সবচেয়ে বেশি পড়েছে", en: "Which companies have fallen the most" },
              why: {
                bn: "দামের পতন একটা ফলাফল, কারণ নয়। যা দেখা দরকার তা হলো কার আয় সত্যিই ক্ষতিগ্রস্ত হবে, কারণ সেটাই ঠিক করবে পতনটা সাময়িক নাকি স্থায়ী।",
                en: "A fall is a result, not a cause. What you need is which earnings will actually be hurt, because that decides whether a fall is temporary or permanent.",
              },
            },
            {
              text: { bn: "কোন কোম্পানিগুলো সবচেয়ে বেশি লভ্যাংশ দেয়", en: "Which companies pay the biggest dividends" },
              why: {
                bn: "লভ্যাংশ গুরুত্বপূর্ণ, কিন্তু সুদের হারের প্রশ্নে এটা দ্বিতীয় সারির। উঁচু সুদের সময়ে লভ্যাংশের আকর্ষণ কমে যায়, কারণ এফডিআরও তখন ভালো দেয়, তাই এটা সুরক্ষা নয়।",
                en: "Dividends matter, and on a rate question they are second order. High rates reduce the attraction of a dividend, because deposits pay well too, so it is not a shelter.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানির হাতে প্রচুর নগদ আছে আর কোনো ঋণ নেই। সুদের হার বাড়লে এর কী হবে?",
            en: "A company holds plenty of cash and has no debt. What happens to it when rates rise?",
          },
          options: [
            {
              text: { bn: "নগদের উপর সুদ বাড়ে, তাই কিছুটা উপকার হয়", en: "It earns more interest on the cash, so it benefits somewhat" },
              right: true,
              why: {
                bn: "ঠিক, আর এটা প্রায়ই ভুলে যাওয়া দিক। সুদের হার বাড়া মানে সবার ক্ষতি নয়: যাদের নগদ আছে তারা বেশি আয় করে, আর ঋণে ডুবে থাকা প্রতিযোগীদের তুলনায় তাদের অবস্থান শক্ত হয়। মন্দার সময় নগদওয়ালা কোম্পানি সস্তায় প্রতিযোগী কিনতেও পারে।",
                en: "Right, and it is the side people forget. A rate rise does not hurt everyone: cash-rich companies earn more, and their position relative to indebted competitors improves. In a downturn a cash-rich company can even buy a competitor cheaply.",
              },
            },
            {
              text: { bn: "কিছুই হয় না, কারণ ঋণ নেই", en: "Nothing happens, because it has no debt" },
              why: {
                bn: "ঋণের দিক থেকে কিছু হয় না ঠিকই, কিন্তু নগদের দিক থেকে হয়। আর চাহিদার দিকটাও আছে: সুদ বাড়লে সাধারণ চাহিদা কমে, তাই বিক্রি কমতে পারে, ঋণ থাকুক বা না থাকুক।",
                en: "Nothing on the debt side, and something on the cash side. There is also the demand side: higher rates reduce general demand, so sales can fall whether or not there is debt.",
              },
            },
            {
              text: { bn: "নগদের মান কমে যায়, তাই ক্ষতি হয়", en: "The cash loses value, so it is worse off" },
              why: {
                bn: "মুদ্রাস্ফীতিতে নগদের ক্রয়ক্ষমতা কমে, এটা সত্যি, কিন্তু সুদের হার বাড়ার সরাসরি প্রভাব উল্টো: নগদের উপর আয় বাড়ে। দুইটা আলাদা প্রশ্ন, আর গুলিয়ে ফেললে সিদ্ধান্ত ভুল হয়।",
                en: "Cash does lose purchasing power to inflation, and the direct effect of a rate rise is the opposite: the cash earns more. Two separate questions, and confusing them leads to a wrong decision.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"amcs-icb": {
  bn: `
<p><a class="term" href="/money/terms/mutual-fund.html">মিউচুয়াল ফান্ড</a> কী সেটা আগে দেখা হয়েছে: অনেকের টাকা এক জায়গায় করে একজন পেশাদার সেটা বিনিয়োগ করেন। এই লেখাটা সেই পেশাদারদের নিয়ে: তারা কারা, কীভাবে টাকা পান, আর তাদের স্বার্থ আপনার স্বার্থের সঙ্গে কোথায় মেলে আর কোথায় মেলে না।</p>

<p>বাংলাদেশে এই জগতের কেন্দ্রে একটা বিশেষ প্রতিষ্ঠান আছে, ইনভেস্টমেন্ট করপোরেশন অব বাংলাদেশ বা আইসিবি, আর এটা একটা সাধারণ অ্যাসেট ম্যানেজার নয়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>অ্যাসেট ম্যানেজমেন্ট কোম্পানি তহবিল চালায় আর তার জন্য বার্ষিক ফি নেয়।</li>
<li>ফি সম্পদের শতাংশে হয়, তাই তহবিল বড় হলে ম্যানেজারের আয় বাড়ে।</li>
<li>ট্রাস্টি আর কাস্টোডিয়ান আলাদা, আর এটাই বিনিয়োগকারীর সুরক্ষা।</li>
<li>আইসিবি রাষ্ট্রায়ত্ত, আর তহবিল ব্যবস্থাপনার বাইরেও এর ভূমিকা আছে।</li>
<li>বন্ধ তহবিলের বাজারদর প্রায়ই এনএভির নিচে থাকে, আর তার কারণ আছে।</li>
</ul>
</div>

<h2>একটা তহবিল কীভাবে সাজানো</h2>

${mount("amc-flow")}

<p>কাঠামোটার মূল কথা হলো ভাগ করা দায়িত্ব। অ্যাসেট ম্যানেজার সিদ্ধান্ত নেন কী কিনবেন, ট্রাস্টি দেখেন সিদ্ধান্তগুলো নিয়ম আর তহবিলের ঘোষিত উদ্দেশ্য মেনে হচ্ছে কি না, আর কাস্টোডিয়ান সম্পদগুলো আলাদা করে রাখেন।</p>

<p>এই ভাগটা কেন গুরুত্বপূর্ণ: যিনি সিদ্ধান্ত নেন তিনি যদি সম্পদও নিজের কাছে রাখতেন, তাহলে অপব্যবহারের সুযোগ থাকত। আলাদা রাখা মানে একজনের ভুল বা অসততা অন্যজনের কাছে ধরা পড়ার সম্ভাবনা থাকে।</p>

<h2>ফি, আর স্বার্থের প্রশ্ন</h2>

<p>অ্যাসেট ম্যানেজার সাধারণত ব্যবস্থাপনার অধীনে থাকা সম্পদের একটা শতাংশ বার্ষিক ফি হিসেবে নেন। এর সঙ্গে ট্রাস্টি ফি, কাস্টোডিয়ান ফি আর অন্যান্য খরচ যোগ হয়। সব মিলিয়ে যেটা দাঁড়ায় সেটাকে বলে মোট ব্যয় অনুপাত।</p>

${mount("amc-lab")}

<p>যন্ত্রটাতে বার্ষিক খরচের শতাংশটা বাড়িয়ে দেখুন। ১% আর ২.৫% এর পার্থক্য এক বছরে সামান্য আর বিশ বছরে বিশাল, কারণ যে টাকাটা ফি হিসেবে গেল সেটা আর চক্রবৃদ্ধিতে অংশ নেয় না।</p>

<div class="note">
<p>একটা কথা পরিষ্কার থাকা দরকার: ফি নিজে খারাপ নয়। পেশাদার ব্যবস্থাপনার একটা দাম আছে, আর যিনি নিজে গবেষণা করার সময় বা আগ্রহ পান না তার জন্য সেটা যুক্তিসঙ্গত হতে পারে। প্রশ্নটা হলো ফি কত, আর তার বিনিময়ে কী পাচ্ছেন।</p>
</div>

<p>স্বার্থের একটা কাঠামোগত পার্থক্যও আছে। ম্যানেজারের আয় নির্ভর করে তহবিল কত বড় তার উপর, আর আপনার আয় নির্ভর করে তহবিল কত ভালো করে তার উপর। বেশিরভাগ সময় দুইটা একসঙ্গে চলে, কারণ ভালো করলে তহবিল বড় হয়। কিন্তু সবসময় নয়, আর এই ফাঁকটা জানা থাকা দরকার।</p>

<h2>খোলা আর বন্ধ তহবিল</h2>

${mount("amc-compare")}

<p>বাংলাদেশে অনেক বন্ধ তহবিল স্টক এক্সচেঞ্জে লেনদেন হয়, আর সেগুলোর বাজারদর প্রায়ই <a class="term" href="/money/terms/nav.html">এনএভির</a> নিচে থাকে। এটাকে বলে ডিসকাউন্ট।</p>

<p>ডিসকাউন্ট দেখে অনেকে ভাবেন এটা সুযোগ: এক টাকার সম্পদ আশি পয়সায় কিনছি। কখনো তাই, আর কখনো নয়। ডিসকাউন্টের কারণ হতে পারে কম তারল্য, উঁচু ফি, দুর্বল অতীত ফল, বা বাজারের সন্দেহ যে ঘোষিত এনএভি অতিরঞ্জিত। কেনার আগে জিজ্ঞেস করুন ডিসকাউন্টটা কেন আছে, আর সেটা কমার কোনো কারণ আছে কি না।</p>

<h2>আইসিবি, আর কেন এটা আলাদা</h2>

<p>ইনভেস্টমেন্ট করপোরেশন অব বাংলাদেশ একটা রাষ্ট্রায়ত্ত প্রতিষ্ঠান, আর এটা কেবল তহবিল চালায় না। এর ঐতিহাসিক ভূমিকা পুঁজিবাজারের বিকাশে সহায়তা করা, আর এই ভূমিকার একটা দিক প্রায়ই খবরে আসে: বাজার খারাপ সময়ে আইসিবি কেনে এমন প্রত্যাশা।</p>

<p>এই প্রত্যাশাটা নিয়ে সতর্ক থাকা দরকার, দুই কারণে। প্রথমত, একটা প্রতিষ্ঠানের কেনার ক্ষমতার একটা সীমা আছে, আর একটা পুরো বাজারের পতন থামানোর মতো ক্ষমতা কারো নেই। দ্বিতীয়ত, কোনো প্রতিষ্ঠান কিনবে এই আশায় একটা শেয়ার কেনা আর সেই কোম্পানির ব্যবসা ভালো বলে কেনা, দুইটা সম্পূর্ণ আলাদা সিদ্ধান্ত, আর প্রথমটা বিনিয়োগ নয়।</p>

<h2>তহবিল বাছাইয়ের সময় যা দেখবেন</h2>

<p>চারটা জিনিস, আর সবগুলো তহবিলের নিজের প্রকাশিত কাগজেই পাওয়া যায়। মোট ব্যয় অনুপাত কত। তহবিলটা কী কী ধরে আছে, আর সেটা আপনার ইতিমধ্যে থাকা শেয়ারগুলোর সঙ্গে কতটা মেলে। গত তিন থেকে পাঁচ বছরের ফল, আর সেটা বাজারের সূচকের তুলনায় কেমন। আর ম্যানেজার কতদিন ধরে একই আছেন।</p>

<div class="ex">
<p><strong>একটা ভুল যা প্রায়ই হয়।</strong> একজন পাঠক পাঁচটা শেয়ার কিনেছেন, তিনটা ব্যাংক। তারপর বৈচিত্র্যের জন্য একটা মিউচুয়াল ফান্ড কিনেছেন। ফান্ডের বিবরণী দেখলে দেখা যায় তার সবচেয়ে বড় বিনিয়োগও ব্যাংকে। বৈচিত্র্য বাড়েনি, কেবল একটা ফি যোগ হয়েছে।</p>
</div>

<div class="checklist">
<ul>
<li>আপনার কাছে থাকা কোনো তহবিলের সর্বশেষ পোর্টফোলিও বিবরণী বের করুন।</li>
<li>তার সবচেয়ে বড় পাঁচটা বিনিয়োগ আপনার নিজের শেয়ারের সঙ্গে মেলান।</li>
<li>মোট ব্যয় অনুপাতটা খুঁজে বের করুন আর লিখে রাখুন।</li>
<li>বন্ধ তহবিল হলে বাজারদর আর এনএভির পার্থক্য বের করুন।</li>
</ul>
</div>

${mount("amc-quiz")}
`,
  en: `
<p>An earlier lesson covered <a class="term" href="/money/terms/mutual-fund.html">what a mutual fund is</a>: many people's money pooled and invested by a professional. This lesson is about those professionals: who they are, how they get paid, and where their interests line up with yours and where they do not.</p>

<p>At the centre of this world in Bangladesh sits a particular institution, the Investment Corporation of Bangladesh, and it is not an ordinary asset manager.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>An asset management company runs funds and charges an annual fee for it.</li>
<li>The fee is a percentage of assets, so a bigger fund pays the manager more.</li>
<li>The trustee and the custodian are separate, and that separation is your protection.</li>
<li>ICB is state owned and does more than manage funds.</li>
<li>Closed-end funds often trade below NAV, and there are reasons for that.</li>
</ul>
</div>

<h2>How a fund is arranged</h2>

${mount("amc-flow")}

<p>The point of the structure is divided responsibility. The asset manager decides what to buy, the trustee checks that those decisions follow the rules and the fund's stated purpose, and the custodian holds the assets separately.</p>

<p>Why that division matters: if the person taking decisions also held the assets, there would be room for abuse. Keeping them apart means one party's error or dishonesty has a chance of being caught by another.</p>

<h2>Fees, and the question of interests</h2>

<p>An asset manager usually takes an annual fee as a percentage of assets under management. Trustee fees, custodian fees and other costs sit on top. What all of them come to together is the total expense ratio.</p>

${mount("amc-lab")}

<p>Raise the annual cost percentage in the tool. The difference between 1% and 2.5% is small over one year and enormous over twenty, because money paid as a fee no longer takes part in compounding.</p>

<div class="note">
<p>One thing should be clear: a fee is not bad in itself. Professional management has a price, and for someone with neither the time nor the interest to do their own research it can be entirely reasonable. The question is how much, and what you get for it.</p>
</div>

<p>There is also a structural difference in interests. The manager's income depends on how large the fund is; yours depends on how well it does. Most of the time those run together, because doing well attracts money. Not always, though, and the gap is worth knowing about.</p>

<h2>Open-ended and closed-end funds</h2>

${mount("amc-compare")}

<p>Many closed-end funds here trade on the exchange, and their market price is often below <a class="term" href="/money/terms/nav.html">NAV</a>. That is called a discount.</p>

<p>Seeing a discount, plenty of people think it is an opportunity: buying a taka of assets for eighty poisha. Sometimes it is, and sometimes it is not. A discount can be caused by thin liquidity, high fees, a poor record, or the market doubting that the stated NAV is realistic. Before buying, ask why the discount exists and whether there is any reason for it to narrow.</p>

<h2>ICB, and why it is different</h2>

<p>The Investment Corporation of Bangladesh is a state-owned institution, and it does more than run funds. Its historical role is supporting the development of the capital market, and one aspect of that role appears regularly in the news: the expectation that ICB buys when the market is weak.</p>

<p>That expectation deserves caution for two reasons. First, any institution's capacity to buy has a limit, and nobody has the capacity to stop a whole market falling. Second, buying a share because you expect an institution to buy it, and buying it because the business is good, are two entirely different decisions, and the first is not investing.</p>

<h2>What to look at when choosing a fund</h2>

<p>Four things, all of them in the fund's own published documents. What the total expense ratio is. What the fund actually holds, and how much that overlaps with the shares you already own. Three to five years of results, and how those compare with the market index. And how long the same manager has been in place.</p>

<div class="ex">
<p><strong>A common mistake.</strong> A reader owns five shares, three of them banks. Then, for diversification, they buy a mutual fund. Reading the fund's statement shows its largest holdings are banks too. Diversification did not increase; only a fee was added.</p>
</div>

<div class="checklist">
<ul>
<li>Find the latest portfolio statement of any fund you hold.</li>
<li>Compare its five largest holdings with your own shares.</li>
<li>Find the total expense ratio and write it down.</li>
<li>For a closed-end fund, work out the gap between market price and NAV.</li>
</ul>
</div>

${mount("amc-quiz")}
`,
  blocks: {
    "amc-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "একটা তহবিলের কাঠামো", en: "The structure of a fund" },
      note: { bn: "চারটা আলাদা ভূমিকা, আর আলাদা থাকাটাই সুরক্ষা।", en: "Four separate roles, and the separation is the protection." },
      parts: [
        { text: { bn: "বিনিয়োগকারীরা", en: "Investors" }, note: { bn: "টাকা দেন, ইউনিট পান", en: "Put money in, receive units" } },
        { text: { bn: "অ্যাসেট ম্যানেজার", en: "The asset manager" }, note: { bn: "কী কেনা হবে ঠিক করেন, আর বার্ষিক ফি নেন", en: "Decides what to buy, and takes an annual fee" }, tone: "lead" },
        { text: { bn: "ট্রাস্টি", en: "The trustee" }, note: { bn: "দেখেন সিদ্ধান্তগুলো নিয়ম আর ঘোষিত উদ্দেশ্য মানছে কি না", en: "Checks the decisions against the rules and the stated purpose" } },
        { text: { bn: "কাস্টোডিয়ান", en: "The custodian" }, note: { bn: "সম্পদগুলো আলাদা করে রাখেন, ম্যানেজারের কাছে নয়", en: "Holds the assets separately, not with the manager" }, tone: "good" },
        { text: { bn: "তহবিলের সম্পদ", en: "The fund's assets" }, note: { bn: "শেয়ার, বন্ড আর নগদ। এনএভি এদের মোট মূল্য ভাগ ইউনিট।", en: "Shares, bonds and cash. NAV is their total value divided by units." } },
      ],
      caption: {
        bn: "যিনি সিদ্ধান্ত নেন আর যিনি সম্পদ রাখেন, দুইজন আলাদা হওয়াই বিনিয়োগকারীর সবচেয়ে বড় কাঠামোগত সুরক্ষা।",
        en: "That the person deciding and the person holding are different people is the investor's largest structural protection.",
      },
    },
    "amc-lab": {
      kind: "lab",
      model: "fee-drag",
      title: { bn: "বার্ষিক ফি কুড়ি বছরে কত", en: "What an annual fee costs over twenty years" },
      note: { bn: "খরচের হার সামান্য বাড়িয়ে দেখুন শেষের সংখ্যাটা কতটা বদলায়।", en: "Nudge the cost rate up and watch how much the final number changes." },
      preset: { capital: 500000, commission: 1.2, trades: 1, rate: 12, years: 20 },
    },
    "amc-compare": {
      kind: "compare",
      title: { bn: "খোলা আর বন্ধ তহবিল", en: "Open-ended and closed-end funds" },
      columns: [
        { bn: "খোলা তহবিল", en: "Open-ended" },
        { bn: "বন্ধ তহবিল", en: "Closed-end" },
      ],
      rows: [
        {
          label: { bn: "কীভাবে কেনেন", en: "How you buy" },
          cells: [
            { bn: "সরাসরি তহবিলের কাছ থেকে, এনএভিতে", en: "From the fund itself, at NAV" },
            { bn: "স্টক এক্সচেঞ্জে, বাজারদরে", en: "On the exchange, at the market price" },
          ],
        },
        {
          label: { bn: "দাম কত হবে", en: "What the price will be" },
          cells: [{ bn: "এনএভি অনুযায়ী", en: "The NAV" }, { bn: "এনএভির উপরে বা নিচে, বাজার যা বলে", en: "Above or below NAV, whatever the market says" }],
        },
        {
          label: { bn: "কখন বেরোতে পারেন", en: "When you can leave" },
          cells: [
            { bn: "তহবিলের নিয়ম অনুযায়ী, সাধারণত যেকোনো সময়", en: "Per the fund's rules, usually any time" },
            { bn: "ক্রেতা পেলে, তাই তারল্যের উপর নির্ভর", en: "When a buyer exists, so it depends on liquidity" },
          ],
          best: 0,
        },
        {
          label: { bn: "ডিসকাউন্টের সুযোগ", en: "Chance of a discount" },
          cells: [{ bn: "নেই", en: "None" }, { bn: "থাকে, আর কারণ খোঁজা দরকার", en: "Yes, and the reason needs finding" }],
        },
        {
          label: { bn: "ম্যানেজারের চাপ", en: "Pressure on the manager" },
          cells: [
            { bn: "টাকা তুলে নিলে বেচতে হয়, এমনকি খারাপ সময়ে", en: "Redemptions force selling, even at bad times" },
            { bn: "নেই, তাই দীর্ঘমেয়াদি সিদ্ধান্ত সহজ", en: "None, so long-term decisions are easier" },
          ],
          best: 1,
        },
      ],
    },
    "amc-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা বন্ধ তহবিলের এনএভি ১২ টাকা, কিন্তু বাজারে এটা ৮ টাকায় লেনদেন হচ্ছে। প্রথমে কী করবেন?",
            en: "A closed-end fund has a NAV of 12 taka but trades at 8. What do you do first?",
          },
          options: [
            {
              text: { bn: "কিনে ফেলি, কারণ এক টাকার সম্পদ ৬৭ পয়সায় পাচ্ছি", en: "Buy, because I am getting a taka of assets for 67 poisha" },
              why: {
                bn: "ডিসকাউন্ট একটা প্রশ্ন, উত্তর নয়। ডিসকাউন্ট বছরের পর বছর একই থাকতে পারে বা বাড়তে পারে, আর তখন আপনার লাভ কেবল তহবিলের সম্পদ বাড়া থেকে আসে, ডিসকাউন্ট কমা থেকে নয়।",
                en: "A discount is a question, not an answer. Discounts can persist for years or widen, and then your return comes only from the assets growing, not from the discount closing.",
              },
            },
            {
              text: { bn: "ডিসকাউন্টটা কেন আছে সেটা বের করি", en: "Find out why the discount exists" },
              right: true,
              why: {
                bn: "ঠিক। সম্ভাব্য কারণ কয়েকটা: তারল্য কম, ফি বেশি, অতীত ফল দুর্বল, বা বাজার মনে করে ঘোষিত এনএভি বাস্তবসম্মত নয়। কারণটা জানলে তবেই বোঝা যায় ডিসকাউন্ট কমার কোনো সম্ভাবনা আছে কি না।",
                en: "Right. The candidates are few: thin liquidity, high fees, a weak record, or a market that doubts the stated NAV. Only knowing the cause tells you whether the discount has any reason to narrow.",
              },
            },
            {
              text: { bn: "এড়িয়ে যাই, ডিসকাউন্ট মানেই খারাপ", en: "Avoid it; a discount always means something is wrong" },
              why: {
                bn: "এটাও অতিসরলীকরণ। কিছু ভালো তহবিল কেবল কম তারল্যের কারণে ডিসকাউন্টে থাকে, আর সেখানে দীর্ঘমেয়াদি ধারকের জন্য এটা সত্যিই সুবিধা। কাজটা যাচাই করা, ধরে নেওয়া নয়।",
                en: "Also an oversimplification. Some good funds sit at a discount purely because of thin liquidity, and there it genuinely benefits a long-term holder. The job is to check rather than to assume.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "দুইটা তহবিল প্রায় একই শেয়ার ধরে আছে। একটার বার্ষিক খরচ ১%, অন্যটার ২.৫%। কুড়ি বছরে এর প্রভাব কী?",
            en: "Two funds hold nearly the same shares. One costs 1% a year, the other 2.5%. What does that do over twenty years?",
          },
          options: [
            {
              text: { bn: "সামান্য, কারণ পার্থক্যটা মাত্র ১.৫%", en: "Very little, because the difference is only 1.5%" },
              why: {
                bn: "এটা বছরে ১.৫% নয়, এটা প্রতি বছর ১.৫% করে কুড়ি বছর, আর প্রতিটা বছরের ক্ষতি পরের বছরগুলোর ভিত্তিও ছোট করে দেয়। উপরের যন্ত্রটাতে সংখ্যাটা বদলে দেখুন।",
                en: "It is not 1.5% once, it is 1.5% every year for twenty years, and each year's loss also shrinks the base for the following years. Change the number in the tool above and look.",
              },
            },
            {
              text: { bn: "বড়, কারণ ফি চক্রবৃদ্ধিতে অংশ নেওয়া টাকাটাই কমিয়ে দেয়", en: "Large, because the fee removes money that would have compounded" },
              right: true,
              why: {
                bn: "ঠিক। ফি বছরে একবার কেটে নেওয়া একটা সংখ্যা নয়, এটা চক্রবৃদ্ধির হার থেকে সরাসরি বিয়োগ। ১২% এর জায়গায় ১০.৫% পাওয়া কুড়ি বছরে চূড়ান্ত অঙ্কের একটা বড় অংশ কেটে নেয়, আর সেটাই সবচেয়ে নিশ্চিত পার্থক্য।",
                en: "Right. A fee is not a number taken once a year, it is a subtraction from the compounding rate itself. Getting 10.5% instead of 12% removes a large part of the final sum over twenty years, and it is the most certain difference of all.",
              },
            },
            {
              text: { bn: "কিছুই না, কারণ বেশি ফি মানে ভালো ব্যবস্থাপনা", en: "Nothing, because a higher fee means better management" },
              why: {
                bn: "ফি আর ফলাফলের মধ্যে এমন কোনো সম্পর্ক নেই। ফি নিশ্চিত আর ফলাফল অনিশ্চিত, আর প্রশ্নটার ভেতরেই লেখা আছে যে দুইটা তহবিল প্রায় একই শেয়ার ধরে আছে।",
                en: "There is no such relationship between fee and result. The fee is certain and the result is not, and the question itself says the two funds hold nearly the same shares.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"choosing-a-broker": {
  bn: `
<p>ব্রোকার বাছাই একবার করা হয় আর তারপর বছরের পর বছর তার সঙ্গে থাকা হয়। এই কারণেই এটা এমন একটা সিদ্ধান্ত যা তাড়াহুড়ো করে নেওয়া উচিত নয়, অথচ বেশিরভাগ মানুষ নেন পরিচিত কারো সুপারিশে, একদিনে।</p>

<p>এই লেখাটা একটা তালিকা দেয়: কী কী জিজ্ঞেস করবেন, কোন উত্তরগুলো সতর্কবার্তা, আর কোনটা আসলে গুরুত্বপূর্ণ আর কোনটা কেবল বিজ্ঞাপন।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>কমিশনের হার গুরুত্বপূর্ণ, আর একমাত্র প্রশ্ন নয়।</li>
<li>ব্রোকারের কাছে আপনার নগদ টাকা কীভাবে রাখা হয়, এটাই সবচেয়ে বড় প্রশ্ন।</li>
<li>মার্জিন ঋণ বেচার চেষ্টা একটা সতর্কবার্তা, সুবিধা নয়।</li>
<li>অ্যাপ কেমন কাজ করে সেটা রোজকার অভিজ্ঞতা, তাই আগে দেখে নিন।</li>
<li>লাইসেন্স নম্বর বিএসইসির তালিকায় মিলিয়ে দেখা পাঁচ মিনিটের কাজ।</li>
</ul>
</div>

<h2>আসল প্রশ্নগুলো</h2>

${mount("brk-compare")}

<p>ছকটার তৃতীয় সারিটা সবচেয়ে গুরুত্বপূর্ণ আর সবচেয়ে কম জিজ্ঞেস করা হয়। আপনার <a class="term" href="/money/terms/bo-account.html">বিও অ্যাকাউন্টে</a> থাকা শেয়ার সিডিবিএলের হিসাবে আপনার নামে, তাই সেটা তুলনামূলক নিরাপদ। কিন্তু ব্রোকারের কাছে যে নগদ টাকা পড়ে থাকে, সেটার সুরক্ষা আলাদা প্রশ্ন। জিজ্ঞেস করুন সেটা কোথায় রাখা হয়, আর গ্রাহকের টাকা প্রতিষ্ঠানের নিজের টাকা থেকে আলাদা রাখা হয় কি না।</p>

<div class="note">
<p>একটা সহজ অভ্যাস যা এই ঝুঁকিটা প্রায় শূন্যে নামিয়ে আনে: ব্রোকারের অ্যাকাউন্টে অপ্রয়োজনীয় নগদ রাখবেন না। কেনার আগে টাকা পাঠান, বেচার পরে টাকা তুলে নিন। যে টাকা কাজে লাগছে না সেটা আপনার ব্যাংক অ্যাকাউন্টে থাকুক।</p>
</div>

<h2>কমিশন, আর যা কমিশনের চেয়ে বড়</h2>

<p>কমিশনের হার সহজে তুলনা করা যায়, তাই মানুষ সেটাই তুলনা করেন। কিন্তু <a class="term" href="/money/basics-2/cost-of-churn.html">বারবার কেনাবেচার দাম</a> লেখায় দেখা গেছে, একটা লেনদেনের খরচের একটা বড় অংশ স্প্রেড, আর সেটা ব্রোকার ঠিক করেন না।</p>

<p>তাহলে ব্রোকার বাছাইয়ে কমিশনের ওজন কতটা? যিনি বছরে দুই তিনবার কেনেন তার জন্য ০.৩% আর ০.৪৫% এর পার্থক্য প্রায় কিছুই না। যিনি বছরে ত্রিশবার কেনেন তার জন্য এটা বড়, কিন্তু তার আসল সমস্যা কমিশন নয়, ত্রিশবার কেনা।</p>

<h2>যেগুলো সতর্কবার্তা</h2>

${mount("brk-spot")}

<p>সবচেয়ে বড় সতর্কবার্তাটা হলো <a class="term" href="/money/terms/margin-loan.html">মার্জিন ঋণ</a> নিয়ে আগ্রহ। ব্রোকার মার্জিনে সুদ পান, তাই আপনাকে ধার নিতে উৎসাহিত করার একটা সরাসরি স্বার্থ তাদের আছে। এটা অসততা নয়, এটা কাঠামো, আর কাঠামোটা জানা থাকলে কথাগুলো অন্যভাবে শোনায়।</p>

<h2>অ্যাপ আর সেবা</h2>

<p>এটা তুচ্ছ মনে হয় যতক্ষণ না একদিন অ্যাপটা কাজ করে না আর আপনার একটা অর্ডার দেওয়ার দরকার। খোলার আগে দেখে নিন: অ্যাপটা কি সত্যিই কাজ করে, লাইভ দাম দেখা যায় কি না, অর্ডারের ইতিহাস পাওয়া যায় কি না, আর কনট্রাক্ট নোট নিজে নামানো যায় কি না।</p>

<p>আর একটা প্রশ্ন যা কেউ করে না: অ্যাপ কাজ না করলে বিকল্প কী? একটা ফোন নম্বর যেখানে সত্যিই কেউ ধরেন, নাকি একটা ইমেইল যার উত্তর তিন দিনে আসে?</p>

${mount("brk-drill")}

<h2>বদলানো কি সম্ভব</h2>

<p>হ্যাঁ, আর এটা জানা থাকা দরকার, কারণ এই জ্ঞানটাই আপনাকে খারাপ সেবা সহ্য করা থেকে বাঁচায়। শেয়ার এক ব্রোকার থেকে আরেক ব্রোকারে স্থানান্তর করা যায়, কারণ শেয়ারগুলো আসলে সিডিবিএলের হিসাবে আপনার নামেই আছে। প্রক্রিয়াটায় কাগজপত্র আর কিছু ফি লাগে, আর সময় লাগে।</p>

<p>এই সম্ভাবনাটা মাথায় রাখলে একটা জিনিস সহজ হয়ে যায়: আপনি প্রথম ব্রোকারটা নিয়ে নিখুঁত সিদ্ধান্ত নেওয়ার চাপ থেকে মুক্তি পান। ছোট অঙ্ক দিয়ে শুরু করুন, ছয় মাস দেখুন, তারপর সিদ্ধান্ত নিন।</p>

${mount("brk-quiz")}
`,
  en: `
<p>You choose a broker once and then stay with them for years. Which is why it deserves more than a hurried decision, and yet most people make it in a day, on the recommendation of somebody they know.</p>

<p>This lesson gives you a list: what to ask, which answers are warnings, and which things genuinely matter as against which are only advertising.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>The commission rate matters, and it is not the only question.</li>
<li>How your cash is held at the broker is the biggest question of all.</li>
<li>Being sold a margin loan is a warning sign, not a benefit.</li>
<li>How the app works is your daily experience, so look at it beforehand.</li>
<li>Checking the licence number against the BSEC list takes five minutes.</li>
</ul>
</div>

<h2>The questions that matter</h2>

${mount("brk-compare")}

<p>The third row of that table is the most important and the least asked. Shares in your <a class="term" href="/money/terms/bo-account.html">BO account</a> are recorded at CDBL in your name, so they are comparatively safe. But cash sitting with the broker is a separate question. Ask where it is held, and whether client money is kept apart from the firm's own.</p>

<div class="note">
<p>One simple habit reduces this risk to nearly nothing: do not leave idle cash in a broker's account. Send money before buying, withdraw it after selling. Money that is not working should sit in your bank account.</p>
</div>

<h2>Commission, and what is larger than commission</h2>

<p>Commission rates are easy to compare, so that is what people compare. But as the lesson on <a class="term" href="/money/basics-2/cost-of-churn.html">the cost of churn</a> showed, a large part of the cost of a trade is the spread, and the broker does not set that.</p>

<p>So how much weight should commission carry? For someone buying two or three times a year, the difference between 0.3% and 0.45% is next to nothing. For someone buying thirty times a year it is large, and their real problem is not the commission, it is the thirty times.</p>

<h2>What counts as a warning</h2>

${mount("brk-spot")}

<p>The largest warning is enthusiasm about <a class="term" href="/money/terms/margin-loan.html">margin lending</a>. Brokers earn interest on margin, so they have a direct interest in encouraging you to borrow. That is not dishonesty, it is structure, and knowing the structure makes the conversation sound different.</p>

<h2>The app and the service</h2>

<p>This feels trivial until the day the app does not work and you need to place an order. Look before you open: does the app actually work, are live prices visible, is order history available, and can you download your own contract notes?</p>

<p>And one question nobody asks: what is the fallback when the app fails? A phone number where somebody genuinely answers, or an email that gets a reply in three days?</p>

${mount("brk-drill")}

<h2>Can you change later</h2>

<p>Yes, and knowing it matters, because that knowledge is what stops you tolerating bad service. Shares can be transferred from one broker to another, precisely because they are recorded at CDBL in your name. The process involves paperwork, some fees and some time.</p>

<p>Keeping that possibility in mind makes one thing much easier: you are released from the pressure of getting the first choice perfect. Start with a small amount, watch for six months, then decide.</p>

${mount("brk-quiz")}
`,
  blocks: {
    "brk-compare": {
      kind: "compare",
      title: { bn: "যা জিজ্ঞেস করবেন, আর কেন", en: "What to ask, and why" },
      note: { bn: "সব উত্তর লিখে রাখুন। মুখের কথা ছয় মাস পরে কেউ মনে রাখে না।", en: "Write every answer down. Nobody remembers a spoken answer six months later." },
      columns: [
        { bn: "প্রশ্ন", en: "The question" },
        { bn: "কেন গুরুত্বপূর্ণ", en: "Why it matters" },
      ],
      rows: [
        {
          label: { bn: "কমিশনের হার কত", en: "What is the commission rate" },
          cells: [
            { bn: "দুই দিকেই, আর ন্যূনতম কত", en: "On both sides, and what the minimum is" },
            { bn: "কম লেনদেন করলে ছোট, বেশি করলে বড়", en: "Small if you trade rarely, large if you trade often" },
          ],
        },
        {
          label: { bn: "আমার নগদ টাকা কোথায় থাকে", en: "Where is my cash held" },
          cells: [
            { bn: "গ্রাহকের টাকা কি আলাদা রাখা হয়", en: "Is client money kept separate" },
            { bn: "সবচেয়ে বড় প্রশ্ন, আর সবচেয়ে কম জিজ্ঞেস করা", en: "The biggest question, and the least asked" },
          ],
          best: 1,
        },
        {
          label: { bn: "বেচার টাকা কবে তোলা যায়", en: "When can sale proceeds be withdrawn" },
          cells: [
            { bn: "নিষ্পত্তির কত দিন পরে", en: "How many days after settlement" },
            { bn: "টাকার দরকারের দিন গোনার জন্য", en: "So you can count back from the day you need money" },
          ],
        },
        {
          label: { bn: "কনট্রাক্ট নোট কীভাবে পাব", en: "How do I get contract notes" },
          cells: [
            { bn: "নিজে নামানো যায়, নাকি চাইতে হয়", en: "Can I download them, or must I ask" },
            { bn: "অভিযোগের সময় এটাই আপনার প্রমাণ", en: "This is your evidence if you ever complain" },
          ],
        },
        {
          label: { bn: "লাইসেন্স নম্বর কত", en: "What is the licence number" },
          cells: [
            { bn: "বিএসইসির তালিকায় মিলিয়ে দেখার জন্য", en: "So you can check it against the BSEC list" },
            { bn: "পাঁচ মিনিটের কাজ, আর একবারই করতে হয়", en: "Five minutes, and only once" },
          ],
        },
      ],
    },
    "brk-spot": {
      kind: "spot",
      title: { bn: "একটা কথোপকথন, কোনগুলো সতর্কবার্তা", en: "A conversation: which lines are warnings" },
      note: { bn: "একটা ব্রোকারেজ হাউসে প্রথম দিনের কথোপকথন। যেগুলোতে সতর্ক হওয়া দরকার সেগুলোতে চাপুন।", en: "A first conversation at a brokerage house. Press the lines that should raise your guard." },
      source: { bn: "একটা কাল্পনিক প্রথম সাক্ষাৎ", en: "An imaginary first meeting" },
      lines: [
        {
          text: { bn: "আমাদের কমিশন ০.৩৫%, দুই দিকেই, ন্যূনতম নেই।", en: "Our commission is 0.35%, both sides, with no minimum." },
        },
        {
          text: { bn: "আপনি ১ লাখ দিলে আমরা আরও ১ লাখ মার্জিন দেব, তাহলে লাভ দ্বিগুণ হবে।", en: "Put in one lakh and we will lend you another, so your profit doubles." },
          flag: { bn: "সতর্কবার্তা। লাভ দ্বিগুণ হলে লোকসানও দ্বিগুণ হয়, আর সেই কথাটা বলা হয়নি। ব্রোকার মার্জিনে সুদ পান, তাই এই পরামর্শে তার নিজের স্বার্থ আছে।", en: "A warning. If the profit doubles so does the loss, and that half was not said. The broker earns interest on margin, so there is an interest behind the advice." },
        },
        {
          text: { bn: "কনট্রাক্ট নোট প্রতিটা লেনদেনের পর অ্যাপে চলে আসে, নামানো যায়।", en: "Contract notes appear in the app after every trade and can be downloaded." },
        },
        {
          text: { bn: "আমাদের একজন বিশেষজ্ঞ আছেন, তিনি বলে দেন কোনটা কিনতে হবে, প্রায় সবসময় ঠিক হয়।", en: "We have an expert who tells you what to buy, and he is right nearly every time" },
          flag: { bn: "সতর্কবার্তা। কেউ প্রায় সবসময় ঠিক হয় না, আর যে দাবি করে তার হয় হিসাব নেই নয়তো সততা নেই। আর সুপারিশ যত বেশি, লেনদেন তত বেশি, কমিশনও তত বেশি।", en: "A warning. Nobody is right nearly every time, and whoever claims it either keeps no record or is not being honest. And more recommendations means more trades, which means more commission." },
        },
        {
          text: { bn: "গ্রাহকের টাকা আমাদের নিজের হিসাব থেকে আলাদা ব্যাংক অ্যাকাউন্টে রাখা হয়।", en: "Client money is held in a bank account separate from our own." },
        },
        {
          text: { bn: "আপনি শুধু টাকাটা দিয়ে দিন, বাকিটা আমরা দেখব, আপনাকে কিছু দেখতে হবে না।", en: "Just give us the money and we will handle everything; you need not look at anything." },
          flag: { bn: "সতর্কবার্তা। আপনার হয়ে কে সিদ্ধান্ত নিচ্ছেন আর কোন কর্তৃত্বে, সেটা লিখিতভাবে পরিষ্কার থাকা দরকার। মুখের কথায় দেওয়া কর্তৃত্ব পরে প্রমাণ করা যায় না।", en: "A warning. Who is deciding on your behalf and under what authority has to be clear in writing. Authority given verbally cannot be proved later." },
        },
        {
          text: { bn: "আমাদের লাইসেন্স নম্বর এটা, বিএসইসির সাইটে মিলিয়ে দেখতে পারেন।", en: "Here is our licence number; you can check it on the BSEC site." },
        },
      ],
    },
    "brk-drill": {
      kind: "drill",
      title: { bn: "খোলার আগে ছয়টা কাজ", en: "Six things before you open an account" },
      note: { bn: "সব মিলিয়ে এক ঘণ্টা, আর এটা আপনি বছরের পর বছর ব্যবহার করবেন।", en: "An hour in total, for something you will use for years." },
      steps: [
        {
          text: { bn: "অন্তত তিনটা ব্রোকারেজ হাউসের কমিশন আর ন্যূনতম চার্জ লিখে ফেলুন।", en: "Write down the commission and minimum charges at three brokerage houses." },
        },
        {
          text: { bn: "প্রত্যেককে জিজ্ঞেস করুন গ্রাহকের নগদ টাকা কীভাবে রাখা হয়, আর উত্তরটা লিখুন।", en: "Ask each how client cash is held, and write the answer down." },
          hint: { bn: "যিনি স্পষ্ট উত্তর দিতে পারেন না, সেটাই একটা উত্তর।", en: "Whoever cannot give a clear answer has answered." },
        },
        {
          text: { bn: "প্রত্যেকের লাইসেন্স নম্বর বিএসইসির তালিকায় মিলিয়ে দেখুন।", en: "Check each licence number against the BSEC list." },
        },
        {
          text: { bn: "অ্যাপ বা ওয়েব টার্মিনালটা খুলে দেখুন, অন্তত দাম আর অর্ডারের পর্দা।", en: "Open the app or web terminal, at least the price and order screens." },
        },
        {
          text: { bn: "গ্রাহক সেবার নম্বরে একবার ফোন করুন, আর দেখুন কতক্ষণে কেউ ধরেন।", en: "Call the customer service number once and see how long it takes for someone to answer." },
          hint: { bn: "খোলার আগে যে সেবা, খোলার পরে সেটা সাধারণত এর চেয়ে ভালো হয় না।", en: "The service before you open is usually the best it will ever be." },
        },
        {
          text: { bn: "একটা বাছুন, আর প্রথম ছয় মাস ছোট অঙ্ক দিয়ে চালান।", en: "Pick one, and run a small amount through it for six months." },
        },
      ],
    },
    "brk-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "দুইটা ব্রোকারেজ হাউস। প্রথমটার কমিশন ০.৩%, দ্বিতীয়টার ০.৪৫%। কিন্তু দ্বিতীয়টা গ্রাহকের টাকা আলাদা অ্যাকাউন্টে রাখে আর প্রথমটা এই প্রশ্নের স্পষ্ট উত্তর দেয়নি। কোনটা বাছবেন?",
            en: "Two brokers. The first charges 0.3%, the second 0.45%. But the second keeps client money in a separate account and the first gave no clear answer to that question. Which do you choose?",
          },
          options: [
            {
              text: { bn: "দ্বিতীয়টা, কারণ টাকার সুরক্ষা কমিশনের চেয়ে বড়", en: "The second, because protecting the money matters more than the commission" },
              right: true,
              why: {
                bn: "ঠিক। ০.১৫% পার্থক্য মানে ১ লাখ টাকার লেনদেনে ১৫০ টাকা। আর গ্রাহকের টাকা আলাদা না রাখার ঝুঁকি হলো পুরো অঙ্কটা। ছোট নিশ্চিত সাশ্রয়ের বিনিময়ে বড় অনিশ্চিত ঝুঁকি নেওয়া খারাপ বিনিময়। আর স্পষ্ট উত্তর না দেওয়াটা নিজেই একটা উত্তর।",
                en: "Right. A 0.15% difference is 150 taka on a one lakh trade. The risk of client money not being segregated is the whole sum. Trading a small certain saving for a large uncertain risk is a poor exchange. And the refusal to answer clearly is itself an answer.",
              },
            },
            {
              text: { bn: "প্রথমটা, কারণ কমিশন কম মানে দীর্ঘমেয়াদে বেশি টাকা", en: "The first, because a lower commission means more money over time" },
              why: {
                bn: "কমিশন গুরুত্বপূর্ণ, আর এটা তখনই তুলনীয় যখন বাকি সব সমান। এখানে বাকি সব সমান নয়: একটা প্রতিষ্ঠান একটা মৌলিক প্রশ্নের উত্তর দিতে পারেনি, আর সেটা প্রথম সারির তথ্য।",
                en: "Commission matters, and it is comparable only when everything else is equal. Here it is not: one firm could not answer a basic question, and that is first-order information.",
              },
            },
            {
              text: { bn: "প্রথমটা, আর নগদ টাকা কম রাখব", en: "The first, and I will keep little cash there" },
              why: {
                bn: "নগদ কম রাখা ভালো অভ্যাস, আর সেটা এই সমস্যাটার পুরো সমাধান নয়। যে প্রতিষ্ঠান একটা মৌলিক প্রশ্নের স্পষ্ট উত্তর দেয় না, তার অন্য প্রক্রিয়াগুলোও সাধারণত একই রকম হয়।",
                en: "Keeping little cash there is a good habit and it is not a complete answer. A firm that will not answer a basic question clearly usually runs its other processes the same way.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "আপনার ব্রোকার প্রায় প্রতি সপ্তাহে ফোন করে বলেন কোন শেয়ার কিনতে হবে। এটা কেমন লক্ষণ?",
            en: "Your broker calls almost every week to tell you what to buy. What kind of sign is that?",
          },
          options: [
            {
              text: { bn: "ভালো সেবা, তারা আমার জন্য কাজ করছেন", en: "Good service; they are working for me" },
              why: {
                bn: "প্রতিটা সুপারিশ একটা লেনদেন, আর প্রতিটা লেনদেন একটা কমিশন। সপ্তাহে একটা সুপারিশ মানে বছরে বায়ান্নটা, আর কোনো যুক্তিসঙ্গত বিনিয়োগ পরিকল্পনায় বছরে বায়ান্নটা ভালো সিদ্ধান্ত থাকে না।",
                en: "Every recommendation is a trade and every trade is a commission. One a week is fifty-two a year, and no sensible investment plan contains fifty-two good decisions a year.",
              },
            },
            {
              text: { bn: "সতর্কবার্তা, কারণ ঘন ঘন সুপারিশ মানে ঘন ঘন কমিশন", en: "A warning, because frequent recommendations mean frequent commissions" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাকে বলে চার্নিং। এটা অসততা না হলেও কাঠামোগত স্বার্থের সংঘাত: তারা আয় করেন লেনদেন থেকে, আপনি আয় করেন ধরে রাখা থেকে। উত্তরটা সহজ: সুপারিশ শুনুন, নিজে যাচাই করুন, আর নিজের নিয়মে চলুন।",
                en: "Right, and it has a name: churning. Even without dishonesty it is a structural conflict: they earn from transactions and you earn from holding. The answer is simple: listen, verify for yourself, and keep to your own rule.",
              },
            },
            {
              text: { bn: "নিরপেক্ষ, নির্ভর করে সুপারিশগুলো ভালো কি না তার উপর", en: "Neutral; it depends on whether the recommendations are good" },
              why: {
                bn: "সুপারিশের মান আলাদা প্রশ্ন, আর সংখ্যাটাই নিজে একটা সমস্যা। বায়ান্নটা লেনদেনের খরচ যেকোনো সুপারিশের সম্ভাব্য সুবিধার চেয়ে বড় হয়ে দাঁড়ায়, তাই মান যাই হোক ফলাফলটা খারাপ।",
                en: "The quality of the recommendations is a separate question, and the frequency is a problem on its own. The cost of fifty-two trades outweighs the likely benefit of any recommendation, so the result is poor whatever the quality.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"reading-a-quote": {
  bn: `
<p>একটা শেয়ারের পাতা খুললে দশ বারোটা সংখ্যা একসঙ্গে দেখা যায়, আর নতুন অবস্থায় বেশিরভাগ মানুষ কেবল একটাই দেখেন: শেষ দাম। বাকিগুলো ওখানে আছে কারণ প্রতিটার একটা প্রশ্নের উত্তর আছে, আর একসঙ্গে পড়লে এরা একটা গল্প বলে।</p>

<p>এই লেখাটা একটা কোটের প্রতিটা সংখ্যা ধরে ধরে দেখে, আর দেখায় কোন সংখ্যাটা কোন প্রশ্নের উত্তর। এটা পড়া শেষে আপনি একটা পর্দা দেখে বলতে পারবেন শেয়ারটার আজকের দিনটা কেমন গেছে আর সেখানে কিছু অস্বাভাবিক আছে কি না।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>শেষ দাম একটা লেনদেনের দাম, বাজারের মূল্য নয়।</li>
<li>বিড আর আস্ক বলে এই মুহূর্তে আপনি কত পাবেন বা দেবেন।</li>
<li>লেনদেনের পরিমাণ ছাড়া দামের পরিবর্তনের কোনো ওজন নেই।</li>
<li>সার্কিটের সীমা বলে আজ দাম সর্বোচ্চ কতদূর যেতে পারে।</li>
<li>৫২ সপ্তাহের সর্বোচ্চ আর সর্বনিম্ন প্রেক্ষাপট দেয়, সংকেত নয়।</li>
</ul>
</div>

<h2>একটা কোট, সংখ্যা ধরে ধরে</h2>

${mount("quote-screen")}

<p>মনে রাখুন সংখ্যাগুলো একে অন্যকে ব্যাখ্যা করে। দাম ৫% বেড়েছে, এটা একা কিছু বলে না। ৫% বেড়েছে গড়ের দশগুণ লেনদেনে, এটা একটা ঘটনা। ৫% বেড়েছে মাত্র বারোটা লেনদেনে, এটা প্রায় কিছুই নয়।</p>

<h2>শেষ দাম আর যে দামে আপনি কিনবেন</h2>

<p>শেষ দাম মানে সবচেয়ে শেষ যে লেনদেনটা হয়েছে তার দাম। এটা অতীত। আপনি যে দামে কিনবেন সেটা হলো আস্ক, অর্থাৎ এই মুহূর্তে সবচেয়ে কম দামে কেউ বেচতে রাজি সেই দাম। আর আপনি যে দামে বেচবেন সেটা বিড।</p>

<p>এই তিনটার পার্থক্য বেশি লেনদেনের শেয়ারে সামান্য, আর কম লেনদেনের শেয়ারে বড়। <a class="term" href="/money/terms/liquidity.html">তারল্য</a> লেখাটা এই ফাঁকটা কেন গুরুত্বপূর্ণ তা দেখিয়েছে, আর <a class="term" href="/money/basics-2/order-types.html">অর্ডারের ধরন</a> লেখাটা দেখিয়েছে কীভাবে এই ফাঁকটা আপনার বিরুদ্ধে কাজ করে।</p>

<div class="ex">
<p><strong>একটা পর্দা, তিনটা সংখ্যা।</strong> শেষ দাম ৫০.২০। বিড ৪৯.৮০, আস্ক ৫০.৬০। আপনি এখন কিনলে দেবেন ৫০.৬০, আর সঙ্গে সঙ্গে বেচলে পাবেন ৪৯.৮০। অর্থাৎ কেনার মুহূর্তেই আপনি ০.৮০ টাকা, বা ১.৬% পিছিয়ে আছেন, কমিশনের আগেই। এই সংখ্যাটাই স্প্রেড, আর কোথাও লেখা থাকে না।</p>
</div>

<h2>লেনদেনের পরিমাণ, যা দামকে ওজন দেয়</h2>

<p>একটা দামের পরিবর্তন কতটা গুরুত্বপূর্ণ, সেটা ঠিক করে কত টাকার লেনদেনে সেটা হয়েছে। ভলিউম মানে কতগুলো শেয়ার হাত বদলেছে, আর ভ্যালু মানে কত টাকার।</p>

<p>দুইটাই দেখা দরকার, কারণ ৫ টাকার শেয়ারে দশ লাখ শেয়ার আর ৫০০ টাকার শেয়ারে দশ হাজার শেয়ার, দুইটাই ৫০ লাখ টাকা। ভলিউম দিয়ে বোঝা যায় কতজন মানুষ জড়িত, ভ্যালু দিয়ে বোঝা যায় কত টাকা নড়েছে।</p>

<p>একটা কাজের অভ্যাস: আজকের ভলিউমকে গত এক মাসের গড় ভলিউমের সঙ্গে তুলনা করুন। গড়ের দ্বিগুণের বেশি হলে কিছু একটা ঘটেছে, আর সেটা খুঁজে বের করা উচিত।</p>

<h2>সার্কিটের সীমা</h2>

${mount("quote-lab")}

<p><a class="term" href="/money/terms/circuit-breaker.html">সার্কিট ব্রেকার</a> ঠিক করে দেয় একদিনে দাম সর্বোচ্চ কতটা উপরে বা নিচে যেতে পারে। কোটের পাতায় এই দুইটা সীমা লেখা থাকে, আর দাম সীমার কাছাকাছি থাকলে সেটা জানা জরুরি।</p>

<p>কেন জরুরি: দাম উপরের সীমায় আটকে থাকলে সেখানে কোনো বিক্রেতা নেই, তাই আপনি কিনতে পারবেন না, কেবল লাইনে দাঁড়াতে পারবেন। নিচের সীমায় আটকে থাকলে কোনো ক্রেতা নেই, তাই বেরোতে পারবেন না। যন্ত্রটাতে দেখুন টানা কয়েকদিন সীমায় আটকে থাকলে দাম কোথায় পৌঁছাতে পারে।</p>

<h2>বাকি সংখ্যাগুলো</h2>

${mount("quote-match")}

<p>৫২ সপ্তাহের সর্বোচ্চ আর সর্বনিম্ন প্রেক্ষাপট দেয়। একটা শেয়ার তার সর্বনিম্নের কাছাকাছি আছে মানে এটা সস্তা নয়, মানে এটা এক বছরে পড়েছে, আর কেন পড়েছে সেটাই প্রশ্ন। একইভাবে সর্বোচ্চের কাছাকাছি থাকা মানে দামি নয়।</p>

<p><a class="term" href="/money/terms/pe-ratio.html">পিই</a> আর <a class="term" href="/money/terms/eps.html">ইপিএস</a> কোটের পাতায় থাকে, আর এই দুইটাই দামকে ব্যবসার সঙ্গে যুক্ত করে। মনে রাখবেন এগুলো সাধারণত গত বারো মাসের হিসাবে, তাই সাম্প্রতিক কোনো পরিবর্তন এতে নেই।</p>

<div class="note">
<p>একটা জিনিস যা কোটে নেই আর সবচেয়ে গুরুত্বপূর্ণ: কোম্পানিটা কী করে। কোটের পাতা আপনাকে দাম আর লেনদেনের ছবি দেয়, ব্যবসার নয়। সিদ্ধান্তটা ওই পাতা থেকে আসতে পারে না।</p>
</div>

${mount("quote-drill")}

${mount("quote-quiz")}
`,
  en: `
<p>Open a share's page and a dozen numbers appear at once, and at first most people look at exactly one of them: the last price. The others are there because each answers a question, and read together they tell a story.</p>

<p>This lesson goes through a quote number by number, and shows which number answers which question. By the end you will be able to look at a screen and say how the share's day went and whether anything about it is unusual.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>The last price is the price of one trade, not the value of the market.</li>
<li>Bid and ask tell you what you would get or pay right now.</li>
<li>A price change carries no weight without the volume behind it.</li>
<li>The circuit limits say how far the price can go today.</li>
<li>The 52-week high and low give context, not a signal.</li>
</ul>
</div>

<h2>A quote, number by number</h2>

${mount("quote-screen")}

<p>Remember that the numbers explain one another. The price is up 5%: on its own that says nothing. Up 5% on ten times the average volume is an event. Up 5% on twelve trades is close to nothing.</p>

<h2>The last price and the price you will pay</h2>

<p>The last price is the price of the most recent trade. That is the past. What you will pay is the ask, the lowest price at which somebody is willing to sell right now. What you would receive is the bid.</p>

<p>The gap between these three is small in a heavily traded share and large in a thin one. The lesson on <a class="term" href="/money/terms/liquidity.html">liquidity</a> showed why the gap matters, and the lesson on <a class="term" href="/money/basics-2/order-types.html">order types</a> showed how it works against you.</p>

<div class="ex">
<p><strong>One screen, three numbers.</strong> Last price 50.20. Bid 49.80, ask 50.60. Buying now costs you 50.60, and selling immediately gets you 49.80. So at the moment of buying you are already 0.80 taka, or 1.6%, behind, before commission. That number is the spread, and it appears nowhere.</p>
</div>

<h2>Volume, which gives a price its weight</h2>

<p>How important a price change is depends on how much trading produced it. Volume means how many shares changed hands; value means how much money did.</p>

<p>You need both, because a million shares of a 5 taka share and ten thousand of a 500 taka share are both fifty lakh taka. Volume tells you how many people are involved; value tells you how much money moved.</p>

<p>A useful habit: compare today's volume with the average of the past month. More than double the average means something happened, and it is worth finding out what.</p>

<h2>The circuit limits</h2>

${mount("quote-lab")}

<p>A <a class="term" href="/money/terms/circuit-breaker.html">circuit breaker</a> sets how far a price may move up or down in one day. Both limits appear on the quote page, and when the price is near one of them, that matters.</p>

<p>Why it matters: if the price is stuck at the upper limit there is no seller there, so you cannot buy, only queue. If it is stuck at the lower limit there is no buyer, so you cannot get out. Use the tool to see where a price can reach after several consecutive days at the limit.</p>

<h2>The rest of the numbers</h2>

${mount("quote-match")}

<p>The 52-week high and low give context. A share near its low is not therefore cheap; it means it has fallen over a year, and why is the question. Equally, being near the high does not make it expensive.</p>

<p><a class="term" href="/money/terms/pe-ratio.html">PE</a> and <a class="term" href="/money/terms/eps.html">EPS</a> appear on the quote page, and both connect the price to the business. Remember they are usually computed on the last twelve months, so any recent change is not in them.</p>

<div class="note">
<p>One thing is missing from the quote and it is the most important: what the company does. A quote page gives you a picture of price and trading, not of a business. The decision cannot come from that page.</p>
</div>

${mount("quote-drill")}

${mount("quote-quiz")}
`,
  blocks: {
    "quote-screen": {
      kind: "figure",
      shape: "callouts",
      title: { bn: "একটা কোটের পাতা", en: "A quote page" },
      note: { bn: "প্রতিটা সংখ্যার পাশে সেটা কোন প্রশ্নের উত্তর।", en: "Beside each number, the question it answers." },
      screen: {
        title: { bn: "একটা কাল্পনিক শেয়ার", en: "An imaginary share" },
        rows: [
          { label: { bn: "শেষ দাম", en: "Last price" }, value: { bn: "৫০.২০", en: "50.20" } },
          { label: { bn: "পরিবর্তন", en: "Change" }, value: { bn: "+১.২০ (+২.৪৫%)", en: "+1.20 (+2.45%)" } },
          { label: { bn: "বিড / আস্ক", en: "Bid / ask" }, value: { bn: "৪৯.৮০ / ৫০.৬০", en: "49.80 / 50.60" } },
          { label: { bn: "ভলিউম", en: "Volume" }, value: { bn: "৪,২০,০০০ শেয়ার", en: "420,000 shares" } },
          { label: { bn: "সার্কিটের সীমা", en: "Circuit limits" }, value: { bn: "৪৪.১০ / ৫৩.৯০", en: "44.10 / 53.90" } },
          { label: { bn: "৫২ সপ্তাহ", en: "52 weeks" }, value: { bn: "৩৮.৫০ / ৬৭.৩০", en: "38.50 / 67.30" } },
        ],
      },
      parts: [
        { text: { bn: "সবচেয়ে শেষ লেনদেনটা কত দামে হলো", en: "What the most recent trade happened at" }, note: { bn: "এটা অতীত। আপনি এই দামে কিনতে পারবেন এমন নয়।", en: "This is the past. It is not necessarily a price you can get." }, at: 0 },
        { text: { bn: "গতকালের শেষ দামের তুলনায় কতটা", en: "How far from yesterday's close" }, note: { bn: "শতাংশটা দেখুন, টাকার অঙ্ক নয়। ১ টাকা ৫ টাকার শেয়ারে বিশাল আর ৫০০ টাকারটায় সামান্য।", en: "Read the percentage rather than the amount. One taka is huge on a 5 taka share and trivial on a 500 taka one." }, at: 1 },
        { text: { bn: "এখন বেচলে কত, এখন কিনলে কত", en: "What you get now, what you pay now" }, note: { bn: "এই দুইটার ফাঁকটাই স্প্রেড, আর এটাই আপনার অদৃশ্য খরচ।", en: "The gap between the two is the spread, and it is your invisible cost." }, tone: "lead", at: 2 },
        { text: { bn: "আজ কতগুলো শেয়ার হাত বদলেছে", en: "How many shares changed hands today" }, note: { bn: "গত এক মাসের গড়ের সঙ্গে তুলনা করুন। দ্বিগুণের বেশি মানে কিছু ঘটেছে।", en: "Compare with the past month's average. More than double means something happened." }, at: 3 },
        { text: { bn: "আজ দাম সর্বোচ্চ কতদূর যেতে পারে", en: "How far the price may move today" }, note: { bn: "সীমায় আটকে গেলে লেনদেন প্রায় থেমে যায়, আর তখন বেরোনো যায় না।", en: "Stuck at a limit, trading nearly stops, and then you cannot get out." }, tone: "warn", at: 4 },
        { text: { bn: "এক বছরে কোথায় ছিল", en: "Where it has been over a year" }, note: { bn: "প্রেক্ষাপট, সংকেত নয়। সর্বনিম্নের কাছে থাকা সস্তা হওয়ার প্রমাণ নয়।", en: "Context, not a signal. Being near the low is not evidence of being cheap." }, at: 5 },
      ],
      caption: {
        bn: "সংখ্যাগুলো একা পড়লে বিভ্রান্তিকর, একসঙ্গে পড়লে একটা দিনের গল্প।",
        en: "Read alone these numbers mislead; read together they are the story of a day.",
      },
    },
    "quote-lab": {
      kind: "lab",
      model: "circuit",
      title: { bn: "সার্কিটের সীমা কীভাবে জমা হয়", en: "How circuit limits accumulate" },
      note: { bn: "দিন সংখ্যা বাড়িয়ে দেখুন টানা সীমায় আটকে থাকলে দাম কোথায় যায়।", en: "Increase the number of days to see where a price ends up after consecutive limit moves." },
      preset: { close: 100, limit: 10, days: 3 },
    },
    "quote-match": {
      kind: "match",
      title: { bn: "সংখ্যা আর প্রশ্ন", en: "Number and question" },
      note: { bn: "কোটের প্রতিটা সংখ্যা কোন প্রশ্নের উত্তর দেয়, মেলান।", en: "Match each number on a quote with the question it answers." },
      pairs: [
        { left: { bn: "শেষ দাম", en: "Last price" }, right: { bn: "সবচেয়ে শেষ লেনদেনটা কত দামে হলো", en: "What did the most recent trade happen at" } },
        { left: { bn: "বিড আর আস্ক", en: "Bid and ask" }, right: { bn: "এখন বেচলে কত, কিনলে কত", en: "What would I get now, what would I pay now" } },
        { left: { bn: "ভলিউম", en: "Volume" }, right: { bn: "আজকের নড়াচড়ার পেছনে কতটা ওজন", en: "How much weight is behind today's move" } },
        { left: { bn: "সার্কিটের সীমা", en: "Circuit limits" }, right: { bn: "আজ সর্বোচ্চ কতদূর যেতে পারে", en: "How far can it go today" } },
        { left: { bn: "৫২ সপ্তাহের সর্বোচ্চ ও সর্বনিম্ন", en: "52-week high and low" }, right: { bn: "এক বছরে কোথায় কোথায় ছিল", en: "Where has it been over a year" } },
        { left: { bn: "পিই", en: "PE" }, right: { bn: "আয়ের তুলনায় দামটা কেমন", en: "How does the price compare with earnings" } },
      ],
    },
    "quote-drill": {
      kind: "drill",
      title: { bn: "একটা কোট নিজে পড়ুন", en: "Read one quote yourself" },
      note: { bn: "যেকোনো একটা শেয়ার নিন, বিশেষ করে যেটা আপনার নেই। দশ মিনিট।", en: "Take any share, ideally one you do not own. Ten minutes." },
      steps: [
        { text: { bn: "ডিএসইর সাইটে একটা শেয়ারের কোটের পাতা খুলুন।", en: "Open a share's quote page on the DSE site." } },
        {
          text: { bn: "শেষ দাম, বিড আর আস্ক লিখে ফেলুন, আর স্প্রেডটা শতাংশে বের করুন।", en: "Write down last price, bid and ask, and work out the spread as a percentage." },
          hint: { bn: "স্প্রেড ভাগ শেষ দাম, গুণ একশো।", en: "Spread divided by last price, times a hundred." },
        },
        { text: { bn: "আজকের ভলিউম আর গত এক মাসের গড় ভলিউম তুলনা করুন।", en: "Compare today's volume with the average over the past month." } },
        {
          text: { bn: "সার্কিটের দুইটা সীমা লিখুন, আর দেখুন দাম কোনটার কতটা কাছে।", en: "Write down both circuit limits and see how close the price is to each." },
        },
        {
          text: { bn: "৫২ সপ্তাহের সর্বোচ্চ থেকে দাম কত শতাংশ নিচে, বের করুন।", en: "Work out how far below the 52-week high the price is, as a percentage." },
        },
        {
          text: { bn: "এবার একটা কম লেনদেন হওয়া শেয়ারে একই কাজ করুন আর স্প্রেড দুইটা মিলিয়ে দেখুন।", en: "Now do the same on a thinly traded share and compare the two spreads." },
          hint: { bn: "পার্থক্যটাই এই লেখার সবচেয়ে ব্যবহারিক পাঠ।", en: "That difference is the most practical lesson here." },
        },
      ],
    },
    "quote-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "একটা শেয়ারের শেষ দাম ১০০, বিড ৯৬ আর আস্ক ১০৪। এটা কী বলে?",
            en: "A share's last price is 100, the bid is 96 and the ask is 104. What does that say?",
          },
          options: [
            {
              text: { bn: "শেয়ারটা কম লেনদেন হয়, আর কেনার সঙ্গে সঙ্গে আপনি ৮% পিছিয়ে থাকবেন", en: "It is thinly traded, and buying puts you 8% behind immediately" },
              right: true,
              why: {
                bn: "ঠিক। ১০৪ এ কিনে ৯৬ এ বেচতে পারবেন, তাই একটা চক্রেই ৮% চলে যায়, কমিশনের আগে। এত বড় স্প্রেড প্রায় সবসময় কম তারল্যের চিহ্ন, আর এমন শেয়ারে ঢোকার আগে বেরোনোর খরচটা হিসাব করা দরকার।",
                en: "Right. You buy at 104 and could sell at 96, so a round trip costs 8% before commission. A spread that wide is nearly always a sign of thin liquidity, and the cost of leaving should be calculated before entering.",
              },
            },
            {
              text: { bn: "শেয়ারটার দাম ১০০, তাই ১০০ টাকায় কেনা যাবে", en: "The price is 100, so it can be bought at 100" },
              why: {
                bn: "শেষ দাম একটা অতীত লেনদেনের দাম। এখন কেনার দাম আস্ক, অর্থাৎ ১০৪। এই পার্থক্যটা না বোঝাই নতুনদের সবচেয়ে ব্যয়বহুল ভুলগুলোর একটা।",
                en: "The last price is the price of a past trade. What you pay now is the ask, 104. Not understanding this difference is one of the more expensive beginner mistakes.",
              },
            },
            {
              text: { bn: "শেয়ারটা খুব জনপ্রিয়, তাই দামের ফাঁক বেশি", en: "It is very popular, hence the wide gap" },
              why: {
                bn: "উল্টো। জনপ্রিয় আর বেশি লেনদেনের শেয়ারে স্প্রেড সরু হয়, কারণ দুই দিকেই অনেক অর্ডার থাকে। চওড়া স্প্রেড মানে অর্ডার কম।",
                en: "The opposite. Popular, heavily traded shares have narrow spreads, because there are many orders on both sides. A wide spread means few orders.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা শেয়ার আজ ৯% বেড়েছে, আর ভলিউম গত এক মাসের গড়ের বারো গুণ। প্রথমে কী করবেন?",
            en: "A share is up 9% today on twelve times its average monthly volume. What do you do first?",
          },
          options: [
            {
              text: { bn: "কিনে ফেলি, স্পষ্টতই কিছু ভালো ঘটেছে", en: "Buy; clearly something good has happened" },
              why: {
                bn: "কিছু ঘটেছে ঠিকই, কিন্তু কী সেটা না জেনে কেনা মানে অনুমানে টাকা রাখা। আর যদি খবরটা প্রকাশ হয়ে থাকে, তাহলে সেটা ইতিমধ্যে দামে ঢুকে গেছে, তাই তাড়াহুড়োর কোনো সুবিধা নেই।",
                en: "Something did happen, and buying without knowing what is putting money on a guess. And if the news is public it is already in the price, so hurrying buys you nothing.",
              },
            },
            {
              text: { bn: "ডিএসইর ঘোষণার পাতায় দেখি আজ এই কোম্পানির কী খবর এসেছে", en: "Check the DSE announcements page for today's news on this company" },
              right: true,
              why: {
                bn: "ঠিক। বড় ভলিউমে বড় নড়াচড়া মানে সাধারণত একটা ঘোষণা: ফলাফল, লভ্যাংশ, একটা চুক্তি, একটা মামলার রায়। ঘোষণাটা পড়লে আপনি জানবেন নড়াচড়াটা যুক্তিসঙ্গত কি না, আর তখনই সিদ্ধান্ত নেওয়া যায়।",
                en: "Right. A large move on large volume usually means an announcement: results, a dividend, a contract, the outcome of a case. Reading it tells you whether the move is justified, and only then can you decide.",
              },
            },
            {
              text: { bn: "অপেক্ষা করি, কারণ যা বাড়ে তা পড়ে", en: "Wait, because what goes up comes down" },
              why: {
                bn: "এটা একটা প্রবাদ, কৌশল নয়। কিছু শেয়ার ভালো খবরের পর নতুন উঁচু জায়গায় বসে যায় আর কখনো ফেরে না। প্রশ্নটা সবসময় একই: কী ঘটেছে, আর সেটা কোম্পানির ভবিষ্যৎ আয় বদলায় কি না।",
                en: "That is a proverb, not a method. Some shares settle at a new higher level after good news and never come back. The question is always the same: what happened, and does it change the company's future earnings.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা শেয়ার তার ৫২ সপ্তাহের সর্বনিম্নের খুব কাছে আছে। এটা কী বোঝায়?",
            en: "A share is very close to its 52-week low. What does that mean?",
          },
          options: [
            {
              text: { bn: "এটা সস্তা, তাই কেনার ভালো সময়", en: "It is cheap, so it is a good time to buy" },
              why: {
                bn: "সর্বনিম্নের কাছে থাকা কেবল বলে দাম পড়েছে, সস্তা হওয়ার কথা বলে না। একটা কোম্পানির আয় যদি অর্ধেক হয়ে যায়, তাহলে দাম অর্ধেক হয়েও সেটা আগের মতোই দামি থাকে।",
                en: "Being near a low says only that the price has fallen, not that it is cheap. If a company's earnings have halved, the price halving leaves it exactly as expensive as before.",
              },
            },
            {
              text: { bn: "এক বছরে দাম পড়েছে, আর কেন পড়েছে সেটাই এখন প্রশ্ন", en: "It has fallen over a year, and why is now the question" },
              right: true,
              why: {
                bn: "ঠিক। সর্বনিম্ন একটা প্রেক্ষাপট, একটা সংকেত নয়। পতনের কারণ যদি সাময়িক হয় তাহলে সুযোগ, আর যদি ব্যবসার স্থায়ী অবনতি হয় তাহলে ফাঁদ। দুইটার চেহারা একই, আর পার্থক্যটা কেবল কোম্পানির হিসাব পড়ে বোঝা যায়।",
                en: "Right. A low is context, not a signal. If the cause of the fall is temporary it is an opportunity; if the business has permanently deteriorated it is a trap. They look identical, and only the accounts tell them apart.",
              },
            },
            {
              text: { bn: "এটা আরও পড়বে, তাই দূরে থাকা উচিত", en: "It will fall further, so stay away" },
              why: {
                bn: "সর্বনিম্নের কাছে থাকা ভবিষ্যতের দিক সম্পর্কে কিছু বলে না। অনেক শেয়ার সর্বনিম্ন ছুঁয়ে ঘুরে দাঁড়ায় আর অনেকগুলো আরও পড়ে। উত্তরটা ছকে নেই, কোম্পানির হিসাবে আছে।",
                en: "Being near a low says nothing about direction. Plenty of shares turn at a low and plenty fall further. The answer is not in the chart, it is in the accounts.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"apps-and-sites": {
  bn: `
<p>তথ্য খোঁজার জায়গা এখন অনেক, আর সেটাই সমস্যা। একটা শেয়ারের নাম লিখে খুঁজলে যা আসে তার মধ্যে থাকে অফিসিয়াল তথ্য, সংবাদমাধ্যমের প্রতিবেদন, ব্লগ, ইউটিউব, আর অসংখ্য মেসেজিং গ্রুপ। এদের নির্ভরযোগ্যতা এক নয়, আর পার্থক্যটা জানা না থাকলে গুজব আর ঘোষণা একই রকম দেখায়।</p>

<p>এই লেখাটা একটা ক্রম দেয়: কোন তথ্য কোথা থেকে নেবেন, আর কোন উৎসকে কতটা ওজন দেবেন।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>মূল উৎস সবসময় ডিএসইর নিজের সাইট আর কোম্পানির নিজের কাগজ।</li>
<li>সংবাদমাধ্যম দ্রুত, আর দ্রুত মানে মাঝেমধ্যে ভুল।</li>
<li>যে উৎস দাম ছাড়া কিছু বলে না, সেটা সিদ্ধান্তের ভিত্তি নয়।</li>
<li>মেসেজিং গ্রুপে সুপারিশ আসে, আর সেখানে কেউ দায় নেয় না।</li>
<li>একটা তথ্য দুই জায়গায় মিলিয়ে দেখা এক মিনিটের অভ্যাস।</li>
</ul>
</div>

<h2>উৎসের সিঁড়ি</h2>

${mount("app-bins")}

<p>নিয়মটা সরল: <strong>যে তথ্যের উপর টাকা রাখছেন, সেটা মূল উৎসে মিলিয়ে নিন।</strong> মূল উৎস মানে যেখানে তথ্যটা প্রথম প্রকাশিত হয়েছে: ডিএসইর ঘোষণার পাতা, কোম্পানির নিজের ওয়েবসাইট, বাংলাদেশ ব্যাংক বা বিএসইসির নিজের প্রকাশনা।</p>

<h2>কোথায় কী পাবেন</h2>

${mount("app-compare")}

<p>ডিএসইর সাইট দেখতে পুরনো ধাঁচের, আর এটাই সবচেয়ে নির্ভরযোগ্য জায়গা। এখানে প্রতিটা তালিকাভুক্ত কোম্পানির পাতা আছে যেখানে থাকে বর্তমান দাম, আর্থিক সারসংক্ষেপ, লভ্যাংশের ইতিহাস, শেয়ারহোল্ডিংয়ের বিন্যাস আর প্রতিটা ঘোষণা। <a class="term" href="/money/basics-3/dse-website.html">ডিএসইর সাইট থেকে যা পাবেন</a> লেখাটা এটার ভেতরটা ধরে ধরে দেখায়।</p>

<div class="note">
<p>ব্রোকারের অ্যাপ লেনদেনের জন্য, গবেষণার জন্য নয়। অনেক অ্যাপে সুপারিশ আর সংকেত থাকে, আর সেগুলোর পেছনে কোনো পদ্ধতি প্রকাশ করা হয় না। একটা সংকেত যার পদ্ধতি জানা নেই সেটা একটা মতামত, আর অন্যের মতামতের উপর নিজের টাকা রাখা যায় না।</p>
</div>

<h2>মেসেজিং গ্রুপ নিয়ে</h2>

<p>এটা আলাদা করে বলা দরকার, কারণ বাংলাদেশে শেয়ারবাজারের অনেক আলোচনা হোয়াটসঅ্যাপ, টেলিগ্রাম আর ফেসবুক গ্রুপে হয়। এদের মধ্যে কিছু সত্যিই কাজের, যেখানে মানুষ হিসাব নিয়ে আলোচনা করেন। আর অনেকগুলো নয়।</p>

<p>একটা সহজ পরীক্ষা: গ্রুপে যিনি একটা শেয়ার সুপারিশ করছেন, তিনি কি তার যুক্তিটা লিখছেন, নাকি কেবল নাম আর একটা লক্ষ্য দাম দিচ্ছেন? যুক্তি ছাড়া লক্ষ্য দাম একটা সংখ্যা যার পেছনে কিছু নেই। আর দ্বিতীয় প্রশ্ন: তিনি কি নিজে ওই শেয়ার ধরে আছেন, আর সেটা বলছেন?</p>

${mount("app-quiz")}

<h2>নিজের একটা ব্যবস্থা বানান</h2>

<p>দিনে দশটা উৎস দেখার দরকার নেই। যা দরকার তা হলো একটা ছোট, নির্ভরযোগ্য ব্যবস্থা যা আপনি সত্যিই চালাতে পারবেন।</p>

<p>একটা কাজের ব্যবস্থা এরকম হতে পারে। দৈনিক কিছুই না। সপ্তাহে একবার ডিএসইর ঘোষণার পাতায় আপনার শেয়ারগুলোর নাম খুঁজে দেখা, দশ মিনিট। প্রান্তিক ফলাফলের মৌসুমে কোম্পানির প্রতিবেদন পড়া। আর বছরে একবার বার্ষিক প্রতিবেদন।</p>

<p>এটুকুই যথেষ্ট, আর এটুকু চালানো সম্ভব। যে ব্যবস্থা চালানো যায় না সেটা কোনো ব্যবস্থা নয়।</p>

${mount("app-drill")}

<div class="checklist">
<ul>
<li>ডিএসইর ঘোষণার পাতাটা বুকমার্ক করুন।</li>
<li>আপনার প্রতিটা কোম্পানির নিজের ওয়েবসাইটের ঠিকানা এক জায়গায় লিখুন।</li>
<li>সপ্তাহে একটা নির্দিষ্ট দিন ঠিক করুন দশ মিনিটের জন্য।</li>
<li>যে গ্রুপগুলো কেবল নাম আর লক্ষ্য দাম দেয়, সেগুলোর নোটিফিকেশন বন্ধ করুন।</li>
</ul>
</div>
`,
  en: `
<p>There are many places to find information now, and that is the problem. Search a share's name and you get official filings, press reports, blogs, videos and any number of messaging groups. They are not equally reliable, and without knowing the difference a rumour and an announcement look the same.</p>

<p>This lesson gives you an order of precedence: where to take which information from, and how much weight each source deserves.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>The primary source is always the DSE's own site and the company's own documents.</li>
<li>The press is fast, and fast sometimes means wrong.</li>
<li>A source that talks about nothing but price is not a basis for a decision.</li>
<li>Messaging groups produce recommendations, and nobody there carries responsibility.</li>
<li>Checking one fact in two places is a one-minute habit.</li>
</ul>
</div>

<h2>The ladder of sources</h2>

${mount("app-bins")}

<p>The rule is simple: <strong>whatever you are putting money on, verify at the primary source.</strong> Primary means where it was first published: the DSE announcements page, the company's own website, or a Bangladesh Bank or BSEC publication.</p>

<h2>Where to find what</h2>

${mount("app-compare")}

<p>The DSE site looks dated, and it is the most reliable place there is. It carries a page for each listed company with the current price, a financial summary, dividend history, the shareholding pattern and every announcement. The lesson on <a class="term" href="/money/basics-3/dse-website.html">what you can get from the DSE site</a> goes through it in detail.</p>

<div class="note">
<p>A broker's app is for trading, not for research. Many carry recommendations and signals with no published method behind them. A signal whose method you do not know is an opinion, and you cannot rest your own money on somebody else's opinion.</p>
</div>

<h2>About messaging groups</h2>

<p>This deserves its own section, because a great deal of share market discussion here happens in WhatsApp, Telegram and Facebook groups. Some of them are genuinely useful, with people discussing accounts. Many are not.</p>

<p>One easy test: when somebody recommends a share, do they write out their reasoning, or only give a name and a target price? A target price without reasoning is a number with nothing behind it. And the second question: do they hold the share themselves, and do they say so?</p>

${mount("app-quiz")}

<h2>Build yourself a routine</h2>

<p>You do not need ten sources a day. What you need is a small, reliable routine you will actually keep to.</p>

<p>A workable one looks like this. Nothing daily. Once a week, search your holdings' names on the DSE announcements page, ten minutes. During results season, read the company's report. And once a year, the annual report.</p>

<p>That is enough, and it is sustainable. A routine you cannot keep to is not a routine.</p>

${mount("app-drill")}

<div class="checklist">
<ul>
<li>Bookmark the DSE announcements page.</li>
<li>Write down each of your companies' own website addresses in one place.</li>
<li>Pick one fixed day of the week for the ten minutes.</li>
<li>Turn off notifications from groups that only give names and target prices.</li>
</ul>
</div>
`,
  blocks: {
    "app-bins": {
      kind: "bins",
      title: { bn: "মূল উৎস আর দ্বিতীয় হাতের উৎস", en: "Primary sources and second-hand ones" },
      note: { bn: "প্রতিটা উৎসকে ঠিক বাক্সে ফেলুন। মূল উৎস মানে যেখানে তথ্যটা প্রথম প্রকাশিত হয়েছে।", en: "Drop each source into the right box. Primary means where it was first published." },
      bins: [
        { id: "primary", label: { bn: "মূল উৎস", en: "Primary" }, tone: "good" },
        { id: "secondary", label: { bn: "দ্বিতীয় হাতের", en: "Second-hand" }, tone: "warn" },
      ],
      items: [
        {
          text: { bn: "ডিএসইর ঘোষণার পাতা", en: "The DSE announcements page" },
          bin: "primary",
          why: { bn: "কোম্পানি এখানেই আনুষ্ঠানিকভাবে জানায়, আর সবাই একসঙ্গে দেখে।", en: "This is where a company files officially, and everybody sees it at once." },
        },
        {
          text: { bn: "কোম্পানির বার্ষিক প্রতিবেদন", en: "The company's annual report" },
          bin: "primary",
          why: { bn: "নিরীক্ষিত হিসাব আর ব্যবস্থাপনার নিজের ভাষ্য, এক জায়গায়।", en: "Audited accounts and management's own account of the year, in one place." },
        },
        {
          text: { bn: "একটা দৈনিক পত্রিকার বাজার প্রতিবেদন", en: "A daily newspaper's market report" },
          bin: "secondary",
          why: { bn: "দ্রুত আর কাজের, তবে সংক্ষিপ্ত করা আর ব্যাখ্যা করা। সংখ্যাটা মূল উৎসে মিলিয়ে নিন।", en: "Fast and useful, and both condensed and interpreted. Check the number at source." },
        },
        {
          text: { bn: "বাংলাদেশ ব্যাংকের মুদ্রানীতি বিবৃতি", en: "A Bangladesh Bank monetary policy statement" },
          bin: "primary",
          why: { bn: "কেন্দ্রীয় ব্যাংক নিজের সিদ্ধান্ত নিজের ভাষায় বলছে।", en: "The central bank stating its own decision in its own words." },
        },
        {
          text: { bn: "একটা ইউটিউব ভিডিও যেখানে বলা হচ্ছে কোনটা কিনতে হবে", en: "A video telling you what to buy" },
          bin: "secondary",
          why: { bn: "এটা কেবল দ্বিতীয় হাতের নয়, এটার একটা স্বার্থও থাকতে পারে। বক্তা নিজে ওই শেয়ার ধরে আছেন কি না, সেটা প্রায়ই বলা হয় না।", en: "Not merely second-hand: it can carry an interest too. Whether the speaker holds the share is usually not stated." },
        },
        {
          text: { bn: "ব্রোকারের অ্যাপের কোটের পাতা", en: "The quote page in a broker's app" },
          bin: "primary",
          why: { bn: "দামের জন্য এটা মূল উৎসের সমান, কারণ এটা সরাসরি এক্সচেঞ্জ থেকে আসছে। তবে অ্যাপের সুপারিশ আলাদা জিনিস।", en: "For prices this counts as primary, because it comes straight from the exchange. Recommendations in the same app are a different thing." },
        },
      ],
    },
    "app-compare": {
      kind: "compare",
      title: { bn: "কোন প্রশ্নের উত্তর কোথায়", en: "Which question, which place" },
      note: { bn: "বাঁ দিকে প্রশ্ন, তারপর কোথায় খুঁজবেন আর কেন সেখানেই।", en: "The question on the left, then where to look and why there." },
      columns: [
        { bn: "প্রথমে কোথায়", en: "Where to look first" },
        { bn: "কেন সেখানেই", en: "Why there" },
      ],
      rows: [
        {
          label: { bn: "আজকের দাম কত", en: "What is today's price" },
          cells: [
            { bn: "ডিএসইর সাইট বা ব্রোকারের অ্যাপ", en: "The DSE site or your broker's app" },
            { bn: "দুইটাই সরাসরি এক্সচেঞ্জ থেকে আসে", en: "Both come straight from the exchange" },
          ],
        },
        {
          label: { bn: "কোম্পানির নতুন ঘোষণা আছে কি", en: "Is there a new announcement" },
          cells: [
            { bn: "ডিএসইর ঘোষণার পাতা", en: "The DSE announcements page" },
            { bn: "কোম্পানি এখানেই প্রথম জানায়, আর সবাই একসঙ্গে দেখে", en: "This is where a company files first, and everybody sees it at once" },
          ],
        },
        {
          label: { bn: "গত বছর কেমন গেল", en: "How was last year" },
          cells: [
            { bn: "কোম্পানির বার্ষিক প্রতিবেদন", en: "The company's annual report" },
            { bn: "নিরীক্ষিত হিসাব, আর ব্যবস্থাপনার নিজের ব্যাখ্যা", en: "Audited accounts, plus management's own explanation" },
          ],
        },
        {
          label: { bn: "সুদের হার কোন দিকে যাচ্ছে", en: "Which way are rates going" },
          cells: [
            { bn: "বাংলাদেশ ব্যাংকের প্রকাশনা", en: "Bangladesh Bank publications" },
            { bn: "সিদ্ধান্তটা যারা নেন তাদের নিজের কথা", en: "The words of the people taking the decision" },
          ],
        },
        {
          label: { bn: "একটা নিয়ম বদলেছে কি", en: "Has a rule changed" },
          cells: [
            { bn: "বিএসইসির নির্দেশনা", en: "BSEC directives" },
            { bn: "সংবাদে সারাংশ আসে, শর্তগুলো আসে না", en: "The press carries a summary; the conditions it does not" },
          ],
        },
      ],
    },
    "app-drill": {
      kind: "drill",
      title: { bn: "আপনার সাপ্তাহিক দশ মিনিট", en: "Your weekly ten minutes" },
      note: { bn: "একবার সাজিয়ে নিলে প্রতি সপ্তাহে দশ মিনিটেই চলে।", en: "Set it up once and ten minutes a week is enough." },
      steps: [
        { text: { bn: "ডিএসইর ঘোষণার পাতাটা বুকমার্ক করুন।", en: "Bookmark the DSE announcements page." } },
        {
          text: { bn: "আপনার প্রতিটা কোম্পানির নিজের ওয়েবসাইটের বিনিয়োগকারী সম্পর্কিত পাতাটা খুঁজে বের করুন।", en: "Find the investor relations page on each of your companies' own websites." },
          hint: { bn: "বেশিরভাগ কোম্পানি সেখানেই প্রতিবেদন আর নোটিশ রাখে।", en: "That is where most companies keep reports and notices." },
        },
        { text: { bn: "সপ্তাহের একটা নির্দিষ্ট দিন আর সময় ঠিক করুন, আর ক্যালেন্ডারে বসান।", en: "Fix one day and time each week and put it in your calendar." } },
        {
          text: { bn: "এই সপ্তাহে একবার করুন: প্রতিটা কোম্পানির নাম ঘোষণার পাতায় খুঁজুন।", en: "Do it once this week: search each company's name on the announcements page." },
        },
        {
          text: { bn: "যেকোনো একটা ঘোষণা খুলে পুরোটা পড়ুন, শিরোনাম নয়।", en: "Open one announcement and read it in full rather than the headline." },
        },
        {
          text: { bn: "যেসব গ্রুপ বা চ্যানেল কেবল নাম আর লক্ষ্য দাম দেয়, সেগুলোর নোটিফিকেশন বন্ধ করুন।", en: "Turn off notifications from any group or channel that only gives names and target prices." },
        },
      ],
    },
    "app-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা গ্রুপে কেউ লিখেছেন: এই শেয়ারটা কিনুন, টার্গেট ৮০ টাকা। কী প্রশ্ন করবেন?",
            en: "Somebody in a group writes: buy this share, target 80 taka. What do you ask?",
          },
          options: [
            {
              text: { bn: "৮০ কেন, আর তিনি নিজে ধরে আছেন কি না", en: "Why 80, and whether they hold it themselves" },
              right: true,
              why: {
                bn: "ঠিক, আর দুইটা প্রশ্নই দরকার। প্রথমটা যুক্তির খোঁজ: ৮০ কি আয়ের কোনো হিসাব থেকে এসেছে, নাকি কেবল একটা সংখ্যা? দ্বিতীয়টা স্বার্থের খোঁজ: যিনি ইতিমধ্যে কিনে রেখেছেন তার আপনাকে কেনাতে উৎসাহ থাকতে পারে, আর সেটা বলা না হলে তথ্যটা অসম্পূর্ণ।",
                en: "Right, and both questions are needed. The first looks for reasoning: does 80 come from any calculation on earnings, or is it just a number? The second looks for interest: somebody already holding has a reason to want you buying, and if that is unstated the information is incomplete.",
              },
            },
            {
              text: { bn: "কিছু জিজ্ঞেস করি না, ছোট অঙ্কে কিনে দেখি", en: "Ask nothing and try a small amount" },
              why: {
                bn: "ছোট অঙ্ক ক্ষতি কমায়, আর অভ্যাসটা তৈরি করে দেয়। যুক্তি ছাড়া কেনা যদি ছোট অঙ্কে ঠিক হয়, তাহলে বড় অঙ্কেও একদিন হবে। অভ্যাসটাই আসল ঝুঁকি।",
                en: "A small amount limits the damage and builds the habit. If buying without reasoning is acceptable when small, one day it will be acceptable when large. The habit is the real risk.",
              },
            },
            {
              text: { bn: "গ্রুপের বাকিরা কী বলছেন সেটা দেখি", en: "See what the rest of the group says" },
              why: {
                bn: "একটা গ্রুপে দশজনের একমত হওয়া কোনো প্রমাণ নয়, কারণ দশজনের উৎস সাধারণত একই। এটাই ভিড়ের আচরণ, কেবল ছোট আকারে।",
                en: "Ten people in a group agreeing is not evidence, because their source is usually the same one. That is crowd behaviour, at small scale.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা পত্রিকায় পড়লেন যে একটা কোম্পানি ২৫% লভ্যাংশ ঘোষণা করেছে। পরের কাজ কী?",
            en: "A newspaper says a company has declared a 25% dividend. What next?",
          },
          options: [
            {
              text: { bn: "ডিএসইর ঘোষণার পাতায় মূল ঘোষণাটা পড়ি", en: "Read the original filing on the DSE announcements page" },
              right: true,
              why: {
                bn: "ঠিক, আর এক মিনিটের কাজ। মূল ঘোষণায় থাকে শর্তগুলো: নগদ নাকি বোনাস, কোন শ্রেণির শেয়ারহোল্ডারদের জন্য, রেকর্ড ডেট কবে, আর এজিএমে অনুমোদনের শর্ত আছে কি না। এই বিবরণগুলো সংক্ষিপ্ত প্রতিবেদনে প্রায়ই থাকে না।",
                en: "Right, and it takes a minute. The filing carries the conditions: cash or bonus, for which class of shareholder, the record date, and whether it is subject to approval at the AGM. Those details are usually missing from a short report.",
              },
            },
            {
              text: { bn: "সঙ্গে সঙ্গে কিনি, লভ্যাংশ পাওয়ার জন্য", en: "Buy immediately to get the dividend" },
              why: {
                bn: "রেকর্ড ডেট পেরিয়ে গেলে কিনে লাভ নেই, আর দামও সাধারণত লভ্যাংশের সমান কমে যায় ওই তারিখে। শুধু লভ্যাংশের জন্য কেনা একটা পরিচিত ভুল, কারণ যা পান তা দামের পতনেই ফিরে যায়।",
                en: "Buying after the record date gets you nothing, and the price normally falls by roughly the dividend on that date anyway. Buying just for a dividend is a familiar mistake, because what you receive comes back out of the price.",
              },
            },
            {
              text: { bn: "কিছুই না, ২৫% তো ভালোই", en: "Nothing; 25% sounds good anyway" },
              why: {
                bn: "২৫% অভিহিত মূল্যের শতাংশ, বাজারদরের নয়। ১০ টাকা অভিহিত মূল্যে ২৫% মানে ২.৫০ টাকা, আর শেয়ারটা যদি ১০০ টাকা হয় তাহলে সেটা ২.৫% ইল্ড। এই পার্থক্যটাই সবচেয়ে বেশি ভুল বোঝা হয়।",
                en: "25% is a percentage of face value, not of the market price. On a 10 taka face value that is 2.50 taka, and if the share is 100 taka the yield is 2.5%. This is the most misunderstood distinction in dividends.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"watchlist": {
  bn: `
<p>ওয়াচলিস্ট মানে যেসব শেয়ার আপনি নজরে রাখছেন। বেশিরভাগ মানুষের ওয়াচলিস্টে বিশ পঁচিশটা নাম থাকে যেগুলোর কোনোটার সম্পর্কেই তারা কিছু জানেন না, আর সেই তালিকা দেখে তারা রোজ দাম দেখেন। এটা ওয়াচলিস্ট নয়, এটা একটা স্কোরবোর্ড।</p>

<p>একটা কাজের ওয়াচলিস্ট আলাদা জিনিস: ছোট, কারণসহ, আর প্রতিটা নামের পাশে একটা শর্ত লেখা। এই লেখাটা দেখায় কীভাবে সেটা বানাতে হয়, আর কেন এটাই সবচেয়ে কম আলোচিত অথচ সবচেয়ে কার্যকর অভ্যাসগুলোর একটা।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ওয়াচলিস্ট নামের তালিকা নয়, শর্তের তালিকা।</li>
<li>প্রতিটা নামের পাশে থাকবে: কেন আছে, আর কী হলে কিনবেন।</li>
<li>আট থেকে বারোটার বেশি হলে আপনি আর নজর রাখছেন না।</li>
<li>শর্তটা কেনার আগে লেখা হলে সিদ্ধান্তের সময় আবেগ কম থাকে।</li>
<li>তিন মাস পর তালিকাটা কেটেছেঁটে ছোট করুন।</li>
</ul>
</div>

<h2>একটা সারিতে কী কী থাকবে</h2>

${mount("wl-steps")}

<p>খেয়াল করুন প্রতিটা ঘরই একটা সিদ্ধান্তকে আগেভাগে নিয়ে ফেলার চেষ্টা। কেনার দিন আপনার মাথা ঠান্ডা থাকবে না, কারণ ওই দিন দাম নড়ছে আর সময় কম মনে হচ্ছে। তাই সিদ্ধান্তগুলো আগে নেওয়া, শান্ত অবস্থায়।</p>

<div class="ex">
<p><strong>একটা সারি, লেখা।</strong> কোম্পানি: একটা সিমেন্ট কোম্পানি। কেন আছে: দেশের নির্মাণ বাড়ছে আর এদের ঋণ কম। কী দেখছি: ডলারের দাম, কারণ ক্লিংকার আমদানি। কিনব যদি: পিই ১২ এর নিচে নামে অথবা দুই প্রান্তিকে নগদ প্রবাহ ইতিবাচক থাকে। কিনব না যদি: ঋণ ইকুইটির সমান হয়ে যায়। সর্বোচ্চ অঙ্ক: ২৫,০০০ টাকা।</p>
</div>

<h2>কেন তালিকাটা ছোট হতে হবে</h2>

<p>একটা কোম্পানি সত্যিই নজরে রাখা মানে তার প্রান্তিক ফলাফল পড়া, ঘোষণাগুলো দেখা আর খাতের খবর রাখা। এটা প্রতি কোম্পানিতে বছরে কয়েক ঘণ্টার কাজ। বিশটা কোম্পানিতে এটা একটা খণ্ডকালীন চাকরি।</p>

<p>বাস্তবে যা হয়: বিশটা নামের তালিকা মানে বিশটা নামের কোনোটাই সত্যিই দেখা হয় না, আর সিদ্ধান্তটা শেষে দাম দেখেই নেওয়া হয়। ছোট তালিকা আপনাকে বাধ্য করে বাছতে, আর বাছাই করাটাই বিনিয়োগের আসল কাজ।</p>

${mount("wl-order")}

<h2>শর্তটা দাম নিয়ে হবে না, ঘটনা নিয়ে</h2>

<p>একটা সাধারণ ভুল হলো শর্ত লেখা এভাবে: "৪৫ টাকায় নামলে কিনব"। এটা একটা শর্ত বটে, আর এর পেছনে কিছু নেই। কেন ৪৫? কারণ সংখ্যাটা গোল, নাকি কারণ ৪৫ টাকায় পিই ১১ হয় যা খাতের গড়ের নিচে?</p>

<p>ভালো শর্তগুলো সাধারণত ব্যবসা নিয়ে: দুই প্রান্তিকে নগদ প্রবাহ ইতিবাচক হলে, ঋণ কমতে শুরু করলে, নতুন কারখানা চালু হলে, বা মুনাফার হার আবার ১৫% এ ফিরলে। এগুলো মাপা যায়, আর এগুলোর পেছনে একটা যুক্তি আছে।</p>

<div class="note">
<p>দামের শর্ত ব্যবহার করা যায়, তবে সেটা যেন একটা হিসাব থেকে আসে। "পিই ১২ এর নিচে" একটা দামের শর্ত যার পেছনে যুক্তি আছে। "৪৫ টাকা" একটা ইচ্ছা।</p>
</div>

<h2>তালিকাটা কীভাবে ব্যবহার করবেন</h2>

<p>সপ্তাহে একবার, দশ মিনিট। প্রতিটা নামের ঘোষণার পাতা দেখুন, আর শর্তটা পূরণ হয়েছে কি না দেখুন। বেশিরভাগ সপ্তাহে কিছুই হবে না, আর সেটাই স্বাভাবিক। যে সপ্তাহে একটা শর্ত পূরণ হবে, সেই সপ্তাহে আপনার কাছে ইতিমধ্যে একটা সিদ্ধান্ত লেখা আছে।</p>

<p>প্রান্তিক ফলাফলের মৌসুমে একটু বেশি সময় লাগবে, কারণ তখন আপনার শর্তগুলোর বেশিরভাগ ওখানেই যাচাই হয়।</p>

${mount("wl-drill")}

<h2>তিন মাস পর কাটাছাঁট</h2>

<p>প্রতি তিন মাসে তালিকাটা খুলে তিনটা প্রশ্ন করুন। এই কোম্পানিটা কেন তালিকায় আছে, আমি কি এখনো মনে করতে পারছি? গত তিন মাসে আমি কি এর কোনো খবর পড়েছি? শর্তটা কি এখনো অর্থবহ, নাকি পরিস্থিতি বদলে গেছে?</p>

<p>তিনটার কোনোটার উত্তর না হলে নামটা কেটে দিন। কেটে দেওয়া মানে কোম্পানিটা খারাপ নয়, মানে এটা আপনার নজরের যোগ্য নয় এই মুহূর্তে, আর সেটা সৎ স্বীকারোক্তি।</p>

<div class="checklist">
<ul>
<li>আপনার এখনকার ওয়াচলিস্টে কতগুলো নাম আছে গুনুন।</li>
<li>প্রতিটার পাশে এক বাক্যে লিখুন কেন সেটা ওখানে আছে।</li>
<li>যেগুলোর জন্য বাক্যটা লিখতে পারলেন না, সেগুলো কেটে দিন।</li>
<li>বাকিগুলোর জন্য একটা করে কেনার শর্ত লিখুন, দাম নিয়ে নয়, ঘটনা নিয়ে।</li>
</ul>
</div>

${mount("wl-quiz")}
`,
  en: `
<p>A watchlist is the shares you are keeping an eye on. Most people's watchlists carry twenty or twenty-five names they know nothing about, and they look at the prices every day. That is not a watchlist, it is a scoreboard.</p>

<p>A useful watchlist is a different object: short, with reasons, and a condition written beside every name. This lesson shows how to build one, and why it is among the least discussed and most effective habits there is.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A watchlist is a list of conditions, not a list of names.</li>
<li>Beside each name: why it is there, and what would make you buy.</li>
<li>Past eight to twelve names you are no longer watching anything.</li>
<li>A condition written before you buy means less emotion when you decide.</li>
<li>Every three months, cut the list down.</li>
</ul>
</div>

<h2>What one row contains</h2>

${mount("wl-steps")}

<p>Notice that every field is an attempt to take a decision in advance. On the day you buy your head will not be clear, because the price is moving and time feels short. So the decisions get taken beforehand, calmly.</p>

<div class="ex">
<p><strong>One written row.</strong> Company: a cement producer. Why it is here: construction is growing and it has little debt. What I am watching: the dollar, because clinker is imported. I will buy if: the PE falls below 12, or cash flow is positive for two quarters. I will not buy if: debt reaches the level of equity. Maximum amount: 25,000 taka.</p>
</div>

<h2>Why the list has to be short</h2>

<p>Genuinely watching a company means reading its quarterly results, following its announcements and keeping up with its sector. That is a few hours a year per company. Across twenty companies it is a part-time job.</p>

<p>What actually happens: a list of twenty names means none of the twenty is really watched, and the decision ends up being made on the price. A short list forces you to choose, and choosing is the real work of investing.</p>

${mount("wl-order")}

<h2>The condition should be about an event, not a price</h2>

<p>A common mistake is writing the condition as "buy if it falls to 45". That is a condition, and there is nothing behind it. Why 45? Because the number is round, or because at 45 the PE is 11, which is below the sector average?</p>

<p>Good conditions are usually about the business: cash flow positive for two quarters, debt starting to fall, a new plant coming on line, margins back at 15%. Those are measurable, and there is reasoning behind them.</p>

<div class="note">
<p>A price condition is fine, as long as it comes out of a calculation. "PE below 12" is a price condition with reasoning behind it. "45 taka" is a wish.</p>
</div>

<h2>How to use the list</h2>

<p>Once a week, ten minutes. Check the announcements page for each name and see whether a condition has been met. In most weeks nothing will have happened, and that is normal. In the week when a condition is met, you already have a decision written down.</p>

<p>Results season takes a little longer, because most of your conditions are verified there.</p>

${mount("wl-drill")}

<h2>Pruning every three months</h2>

<p>Every three months, open the list and ask three questions. Why is this company here, and can I still remember? Have I read anything about it in the past three months? Is the condition still meaningful, or has the situation changed?</p>

<p>If any answer is no, cut the name. Cutting does not mean the company is bad; it means it does not deserve your attention right now, and that is an honest admission.</p>

<div class="checklist">
<ul>
<li>Count how many names are on your current watchlist.</li>
<li>Write one sentence beside each saying why it is there.</li>
<li>Cut the ones where you could not write the sentence.</li>
<li>For the rest, write one buying condition each, about an event rather than a price.</li>
</ul>
</div>

${mount("wl-quiz")}
`,
  blocks: {
    "wl-steps": {
      kind: "figure",
      shape: "steps",
      title: { bn: "একটা ওয়াচলিস্টের সারি", en: "One row of a watchlist" },
      note: { bn: "ছয়টা ঘর, আর প্রতিটাই একটা সিদ্ধান্ত আগেভাগে নেওয়া।", en: "Six fields, each of them a decision taken in advance." },
      parts: [
        { text: { bn: "কোম্পানি", en: "The company" }, note: { bn: "নাম আর টিকার কোড", en: "The name and the ticker" } },
        { text: { bn: "কেন তালিকায়", en: "Why it is on the list" }, note: { bn: "এক বাক্য। লিখতে না পারলে সারিটা তৈরি হবে না।", en: "One sentence. If you cannot write it, the row does not get made." }, tone: "lead" },
        { text: { bn: "কী নজরে রাখছি", en: "What I am watching" }, note: { bn: "যে একটা জিনিস বদলালে এই কোম্পানির আয় বদলায়", en: "The one thing that, when it changes, changes the earnings" } },
        { text: { bn: "কিনব যদি", en: "I buy if" }, note: { bn: "একটা মাপা যায় এমন ঘটনা, একটা ইচ্ছা নয়", en: "A measurable event, not a wish" }, tone: "good" },
        { text: { bn: "কিনব না যদি", en: "I do not buy if" }, note: { bn: "এই ঘরটা প্রায় কেউ লেখে না, আর এটাই সবচেয়ে বেশি বাঁচায়", en: "Almost nobody writes this field, and it saves the most" }, tone: "warn" },
        { text: { bn: "সর্বোচ্চ অঙ্ক", en: "Maximum amount" }, note: { bn: "কেনার আগেই ঠিক করা, যাতে উত্তেজনায় বাড়ে না", en: "Set before buying, so excitement cannot raise it" } },
      ],
      caption: {
        bn: "সারিটা এক জায়গায় থাকলেই হলো: একটা খাতা, একটা স্প্রেডশিট বা একটা নোট। যন্ত্রটা গুরুত্বপূর্ণ নয়, লেখাটা গুরুত্বপূর্ণ।",
        en: "It only needs to live somewhere: a notebook, a spreadsheet, a note. The tool does not matter; the writing does.",
      },
    },
    "wl-order": {
      kind: "order",
      title: { bn: "একটা নাম তালিকায় আসার ক্রম", en: "How a name gets on to the list" },
      note: { bn: "নাম শোনা থেকে সারি লেখা পর্যন্ত।", en: "From hearing a name to writing the row." },
      items: [
        {
          text: { bn: "কোথাও কোম্পানিটার নাম শুনলেন বা পড়লেন", en: "You hear or read the company's name somewhere" },
          why: { bn: "এখানে কিছুই সিদ্ধান্ত নয়। নাম শোনা তথ্য নয়।", en: "Nothing is decided here. Hearing a name is not information." },
        },
        {
          text: { bn: "কোম্পানিটা কী করে, তিন বাক্যে লিখুন", en: "Write three sentences on what it does" },
          why: { bn: "লিখতে না পারলে এখানেই থামুন। এটাই সবচেয়ে বড় ছাঁকনি।", en: "If you cannot, stop here. This is the largest filter." },
        },
        {
          text: { bn: "শেষ দুইটা প্রান্তিক ফলাফল পড়ুন", en: "Read the last two quarterly results" },
          why: { bn: "আয়, মুনাফা আর নগদ প্রবাহ। এতেই বেশিরভাগ প্রশ্নের উত্তর থাকে।", en: "Revenue, profit and cash flow. Most questions are answered there." },
        },
        {
          text: { bn: "এই কোম্পানির আয় কীসের উপর নির্ভর করে, বের করুন", en: "Work out what its earnings depend on" },
          why: { bn: "এটাই পরে আপনার নজরে রাখার জিনিস হবে।", en: "This becomes the thing you watch." },
        },
        {
          text: { bn: "কিনব যদি আর কিনব না যদি, দুইটাই লিখুন", en: "Write both the buy condition and the do-not-buy condition" },
          why: { bn: "দ্বিতীয়টা ছাড়া প্রথমটার কোনো সীমা থাকে না।", en: "Without the second, the first has no boundary." },
        },
        {
          text: { bn: "সর্বোচ্চ অঙ্ক ঠিক করে সারিটা তালিকায় বসান", en: "Set the maximum amount and add the row" },
          why: { bn: "এখন এটা একটা ওয়াচলিস্টের সারি, একটা নাম নয়।", en: "Now it is a watchlist row rather than a name." },
        },
      ],
    },
    "wl-drill": {
      kind: "drill",
      title: { bn: "আজই একটা সারি লিখুন", en: "Write one row today" },
      note: { bn: "একটা কোম্পানি, একটা সারি। বিশটা নয়।", en: "One company, one row. Not twenty." },
      steps: [
        {
          text: { bn: "একটা কোম্পানি বাছুন যেটার নাম আপনি চেনেন কিন্তু হিসাব দেখেননি।", en: "Pick a company whose name you know but whose accounts you have not read." },
        },
        {
          text: { bn: "তিন বাক্যে লিখুন সে কী বেচে, কে কেনে, আর টাকা কোথা থেকে আসে।", en: "Write three sentences: what it sells, who buys, where the money comes from." },
        },
        {
          text: { bn: "ডিএসইর সাইটে তার শেষ দুইটা প্রান্তিক ফলাফল খুলে আয় আর মুনাফা লিখুন।", en: "Open its last two quarterly results on the DSE site and note revenue and profit." },
        },
        {
          text: { bn: "এক বাক্যে লিখুন কী বদলালে এই কোম্পানির আয় বদলাবে।", en: "Write one sentence on what change would change its earnings." },
          hint: { bn: "ডলার, সুদের হার, একটা কাঁচামালের দাম, একটা সরকারি সিদ্ধান্ত। সাধারণত একটা বা দুইটা।", en: "The dollar, rates, one raw material, a government decision. Usually one or two." },
        },
        {
          text: { bn: "কিনব যদি আর কিনব না যদি, দুইটা শর্ত লিখুন।", en: "Write a buy condition and a do-not-buy condition." },
        },
        {
          text: { bn: "সারিটা এমন জায়গায় রাখুন যেখানে আপনি সপ্তাহে একবার খুলবেন।", en: "Put the row somewhere you will open once a week." },
        },
      ],
    },
    "wl-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার ওয়াচলিস্টে একটা কোম্পানি আছে ছয় মাস ধরে, আর আপনি মনে করতে পারছেন না কেন যোগ করেছিলেন। কী করবেন?",
            en: "A company has been on your watchlist for six months and you cannot remember why you added it. What do you do?",
          },
          options: [
            {
              text: { bn: "রেখে দিই, হয়তো কোনো কারণ ছিল", en: "Leave it; there was probably a reason" },
              why: {
                bn: "যে কারণ মনে নেই সেটা সিদ্ধান্তে কাজে লাগবে না। আর তালিকায় অকারণে থাকা নামগুলোই তালিকাটাকে বড় করে, আর বড় তালিকা মানে কোনোটাই আসলে দেখা হয় না।",
                en: "A reason you cannot remember cannot help a decision. And names sitting there for no reason are what make a list long, and a long list means nothing is really watched.",
              },
            },
            {
              text: { bn: "কেটে দিই, আর দরকার হলে আবার যাচাই করে যোগ করি", en: "Cut it, and add it again after checking if it matters" },
              right: true,
              why: {
                bn: "ঠিক। কেটে দেওয়া বিনামূল্যে, আর আবার যোগ করাও বিনামূল্যে। যা বিনামূল্যে নয় তা হলো একটা লম্বা তালিকা নিয়ে ঘোরা, কারণ সেটা আপনার প্রতিটা নামের জন্য বরাদ্দ মনোযোগ কমিয়ে দেয়।",
                en: "Right. Cutting is free and re-adding is free. What is not free is carrying a long list, because it reduces the attention available for every name on it.",
              },
            },
            {
              text: { bn: "দাম দেখি, বেড়ে থাকলে রাখি", en: "Look at the price and keep it if it has risen" },
              why: {
                bn: "দাম বাড়া কোনো কারণ তৈরি করে না, এটা কেবল আপনাকে বলে যে অন্যরা কিনেছেন। ওয়াচলিস্টের পুরো উদ্দেশ্য হলো দাম নয় বরং যুক্তি দিয়ে চলা।",
                en: "A rising price creates no reason; it only tells you others have bought. The whole purpose of a watchlist is to run on reasoning rather than on price.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কোন কেনার শর্তটা বেশি কাজের?",
            en: "Which buying condition is more useful?",
          },
          options: [
            {
              text: { bn: "দাম ৪০ টাকায় নামলে কিনব", en: "Buy if the price falls to 40" },
              why: {
                bn: "সংখ্যাটা কোথা থেকে এল? যদি একটা হিসাব থেকে আসে তাহলে ঠিক আছে, আর যদি কেবল আজকের দামের চেয়ে কম বলে বাছা হয়, তাহলে এটা একটা ইচ্ছা। আর একটা বিপদ আছে: দাম ৪০ এ নামতে পারে ঠিক সেই কারণে যা কোম্পানিটাকে আর কেনার যোগ্য রাখে না।",
                en: "Where did the number come from? If it came from a calculation, fine; if it was picked because it is below today's price, it is a wish. And there is a danger: the price may reach 40 for exactly the reason that makes the company no longer worth buying.",
              },
            },
            {
              text: { bn: "টানা দুই প্রান্তিকে পরিচালন নগদ প্রবাহ ইতিবাচক হলে কিনব", en: "Buy if operating cash flow is positive for two consecutive quarters" },
              right: true,
              why: {
                bn: "ঠিক। এটা ব্যবসার একটা মাপা যায় এমন উন্নতি, আর এটা পূরণ হলে কোম্পানিটা সত্যিই বদলেছে। দামের শর্ত কেবল বলে বাজার কী ভাবছে; ঘটনার শর্ত বলে ব্যবসাটা কী করছে। আর নগদ প্রবাহ বেছে নেওয়ার কারণ আছে: মুনাফার চেয়ে এটা সাজানো কঠিন।",
                en: "Right. It is a measurable improvement in the business, and when it is met the company really has changed. A price condition tells you what the market thinks; an event condition tells you what the business is doing. And cash flow is chosen for a reason: it is harder to dress up than profit.",
              },
            },
            {
              text: { bn: "দুইটাই সমান, কারণ দুইটাই শর্ত", en: "Equally useful, since both are conditions" },
              why: {
                bn: "গঠনে দুইটাই শর্ত, আর তথ্যের দিক থেকে নয়। প্রথমটার পূরণ হওয়া কোম্পানি সম্পর্কে কিছুই বলে না, দ্বিতীয়টার পূরণ হওয়া একটা নির্দিষ্ট উন্নতির প্রমাণ।",
                en: "Both are conditions in form and not in information. The first being met says nothing about the company; the second being met is evidence of a specific improvement.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"costs-and-taxes": {
  bn: `
<p>আপনার হাতে যা আসে তা হলো রিটার্ন মাইনাস খরচ মাইনাস কর। প্রথম সংখ্যাটা নিয়ে সবাই কথা বলেন, আর পরের দুইটা নিয়ে প্রায় কেউ না, যদিও পরের দুইটাই সবচেয়ে নিশ্চিত।</p>

<p><a class="term" href="/money/basics-2/cost-of-churn.html">বারবার কেনাবেচার দাম</a> লেখাটা খরচের চক্রবৃদ্ধি প্রভাবটা দেখিয়েছে। এই লেখাটা তালিকাটা সম্পূর্ণ করে: বাংলাদেশে একজন ব্যক্তি বিনিয়োগকারীর জন্য কোথায় কোথায় টাকা কাটা হয়, আর কোনটা কমানো যায় আর কোনটা যায় না।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>খরচ তিন ধরনের: লেনদেনের, ধরে রাখার আর কর।</li>
<li>লভ্যাংশে উৎসে কর কাটা হয়, আর হার নির্ভর করে টিআইএন আছে কি না তার উপর।</li>
<li>মূলধনি মুনাফার কর কাঠামো সময়ে সময়ে বদলেছে, তাই বর্তমান নিয়ম দেখে নিন।</li>
<li>ব্রেক ইভেন দাম কেনার দামের চেয়ে বেশি, আর সেটা হিসাব করা যায়।</li>
<li>যা কমানো যায় তা হলো লেনদেনের সংখ্যা, আর সেটাই সবচেয়ে বড় লিভার।</li>
</ul>
</div>

<h2>খরচের তিনটা স্তর</h2>

${mount("cost-stack")}

<p>স্তরগুলোর ক্রম গুরুত্বপূর্ণ। লেনদেনের খরচ আপনি নিয়ন্ত্রণ করেন, কারণ আপনি ঠিক করেন কতবার কিনবেন। ধরে রাখার খরচ আংশিক নিয়ন্ত্রণে, কারণ আপনি ঠিক করেন কোন তহবিল বা কোন ব্রোকার। কর আপনার নিয়ন্ত্রণে নয়, কেবল কখন দেবেন সেটা কিছুটা।</p>

<h2>ব্রেক ইভেন: আসলে কত দামে বেচলে সমান হয়</h2>

${mount("cost-break")}

<p>এই হিসাবটা প্রায় কেউ করেন না, আর এটাই সবচেয়ে দরকারি হিসাবগুলোর একটা। আপনি ৫০ টাকায় কিনলেন। ৫০ টাকায় বেচলে আপনার লোকসান হবে, কারণ দুই দিকের কমিশন আর কর দিতে হয়েছে। সমান হতে হলে দামটা একটু বেশি হতে হবে, আর যন্ত্রটা সেই সংখ্যাটা বলে দেয়।</p>

<p>কেন এটা কাজের: এটা আপনাকে দেখায় কম লেনদেন হওয়া শেয়ারে ঢোকা কতটা ব্যয়বহুল, আর ছোট লাভে বেরিয়ে আসার কোনো মানে হয় না কেন।</p>

<h2>লভ্যাংশের উপর কর</h2>

<p><a class="term" href="/money/terms/dividend.html">লভ্যাংশ</a> আপনার ব্যাংকে ঢোকার আগেই কর কেটে নেওয়া হয়, উৎসে। হারটা নির্ভর করে আপনার টিআইএন আছে কি না তার উপর, আর সাধারণত টিআইএন থাকলে হার কম।</p>

<p>এখানে একটা ব্যবহারিক পরামর্শ: টিআইএন করিয়ে নিন। এটা বিনামূল্যে বা প্রায় বিনামূল্যে, অনলাইনে হয়, আর এটা লভ্যাংশে কাটা করের হার কমায়। যারা করেননি তারা প্রতিটা লভ্যাংশে বেশি কর দেন, বছরের পর বছর।</p>

${mount("cost-tax")}

<div class="note">
<p>কর হার আর ছাড়ের নিয়ম প্রতি অর্থবছরে বদলাতে পারে। এই লেখাটা কাঠামোটা শেখায়, নির্দিষ্ট হারটা নয়। বর্তমান হার জাতীয় রাজস্ব বোর্ডের প্রকাশনায় বা একজন কর পেশাদারের কাছে যাচাই করে নিন, বিশেষ করে যদি অঙ্ক বড় হয়।</p>
</div>

<h2>মূলধনি মুনাফা</h2>

<p>শেয়ার কিনে বেশি দামে বেচলে যে লাভ, সেটা মূলধনি মুনাফা। বাংলাদেশে ব্যক্তি বিনিয়োগকারীর তালিকাভুক্ত শেয়ারের মূলধনি মুনাফার কর কাঠামো সময়ে সময়ে বদলেছে, আর নির্দিষ্ট সীমা আর হারের শর্ত থেকেছে।</p>

<p>কাঠামোগত কথাটা যা কখনো বদলায় না: যেখানে মূলধনি মুনাফায় কর আছে, সেখানে বেশি নাড়াচাড়া মানে সেই কর আগে দেওয়া, আর আগে দেওয়া টাকা আর চক্রবৃদ্ধিতে অংশ নেয় না। এটা <a class="term" href="/money/basics-2/why-hold.html">ধরে রাখার</a> পক্ষে আরেকটা যুক্তি, আর এটা সম্পূর্ণ পরিমাপযোগ্য।</p>

<h2>যেগুলো কমানো যায়</h2>

${mount("cost-bins")}

<p>তালিকাটা দেখলে একটা জিনিস স্পষ্ট হয়: আপনার হাতে যা আছে তা হলো <strong>কতবার</strong>, আর <strong>কার মাধ্যমে</strong>। এই দুইটাই আপনি ঠিক করেন, আর এই দুইটা মিলেই খরচের সিংহভাগ ঠিক হয়ে যায়।</p>

<div class="ex">
<p><strong>দুইটা বছর, একই পোর্টফোলিও।</strong> প্রথম বছর: ২৪টা লেনদেন, প্রতিটাতে দুই দিকের কমিশন আর কর, মোট খরচ পোর্টফোলিওর প্রায় ২%। দ্বিতীয় বছর: ৪টা লেনদেন, মোট খরচ প্রায় ০.৩৫%। রিটার্ন দুই বছরেই একই ছিল ধরে নিলে, দ্বিতীয় বছরে আপনার হাতে ১.৬৫% বেশি থেকেছে, কোনো ভালো সিদ্ধান্ত ছাড়াই।</p>
</div>

<div class="checklist">
<ul>
<li>আপনার টিআইএন আছে কি না দেখুন, না থাকলে করিয়ে নিন।</li>
<li>গত এক বছরে কতগুলো লেনদেন করেছেন গুনুন।</li>
<li>একটা লেনদেনের ব্রেক ইভেন দাম হিসাব করুন।</li>
<li>এই বছরের লক্ষ্য ঠিক করুন: কতগুলো লেনদেনের বেশি নয়।</li>
</ul>
</div>

${mount("cost-quiz")}
`,
  en: `
<p>What reaches you is return minus costs minus tax. Everybody talks about the first number and almost nobody about the other two, even though the other two are the certain ones.</p>

<p>The lesson on <a class="term" href="/money/basics-2/cost-of-churn.html">the cost of churn</a> showed the compounding effect of costs. This one completes the list: where money is taken from an individual investor in Bangladesh, and which parts can be reduced and which cannot.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Costs come in three layers: transaction, holding and tax.</li>
<li>Dividends are taxed at source, and the rate depends on whether you have a TIN.</li>
<li>Capital gains treatment has changed from time to time, so check the current rule.</li>
<li>Your break-even price is above your purchase price, and it can be calculated.</li>
<li>What you can reduce is the number of transactions, and that is the biggest lever.</li>
</ul>
</div>

<h2>Three layers of cost</h2>

${mount("cost-stack")}

<p>The order of the layers matters. Transaction costs are yours to control, because you decide how often you trade. Holding costs are partly yours, because you decide which fund and which broker. Tax is not yours to control, only partly a question of when you pay it.</p>

<h2>Break-even: the price at which you are actually level</h2>

${mount("cost-break")}

<p>Almost nobody does this calculation, and it is among the most useful. You bought at 50. Selling at 50 leaves you with a loss, because commission was paid on both sides along with tax. To be level the price has to be a little higher, and the tool gives you that number.</p>

<p>Why it is useful: it shows how expensive entering a thinly traded share really is, and why exiting on a small gain makes no sense.</p>

<h2>Tax on dividends</h2>

<p>A <a class="term" href="/money/terms/dividend.html">dividend</a> is taxed at source before it reaches your bank. The rate depends on whether you have a TIN, and the rate is generally lower with one.</p>

<p>Which gives a practical piece of advice: get a TIN. It is free or nearly free, it is done online, and it lowers the tax withheld on your dividends. Anyone without one pays more on every dividend, year after year.</p>

${mount("cost-tax")}

<div class="note">
<p>Tax rates and exemption rules can change with each fiscal year. This lesson teaches the structure rather than the particular rate. Verify the current rates in National Board of Revenue publications or with a tax professional, especially where the amounts are large.</p>
</div>

<h2>Capital gains</h2>

<p>The profit from buying a share and selling it higher is a capital gain. In Bangladesh the treatment of capital gains on listed shares for individuals has changed from time to time, with thresholds and rate conditions attached.</p>

<p>The structural point never changes: where capital gains are taxed, more trading means paying that tax sooner, and money paid sooner no longer compounds. That is another argument for <a class="term" href="/money/basics-2/why-hold.html">holding</a>, and it is entirely measurable.</p>

<h2>What can be reduced</h2>

${mount("cost-bins")}

<p>Reading the list makes one thing plain: what is in your hands is <strong>how often</strong>, and <strong>through whom</strong>. Both are yours to decide, and between them they set the great majority of your costs.</p>

<div class="ex">
<p><strong>Two years, the same portfolio.</strong> Year one: 24 trades, commission and tax on both sides of each, total costs around 2% of the portfolio. Year two: 4 trades, total costs around 0.35%. Assume the same return both years and you kept 1.65% more in the second, without a single better decision.</p>
</div>

<div class="checklist">
<ul>
<li>Check whether you have a TIN, and get one if not.</li>
<li>Count how many trades you made in the past year.</li>
<li>Work out the break-even price on one of them.</li>
<li>Set a target for this year: no more than a certain number of trades.</li>
</ul>
</div>

${mount("cost-quiz")}
`,
  blocks: {
    "cost-stack": {
      kind: "figure",
      shape: "stack",
      title: { bn: "খরচের তিনটা স্তর", en: "Three layers of cost" },
      note: { bn: "প্রতিটা স্তরের পাশে আপনার নিয়ন্ত্রণ কতটা।", en: "Beside each layer, how much of it is in your control." },
      parts: [
        {
          text: { bn: "লেনদেনের খরচ", en: "Transaction costs" },
          note: { bn: "দুই দিকের কমিশন, লেনদেন কর, আর স্প্রেড। পুরোপুরি আপনার নিয়ন্ত্রণে, কারণ আপনি কতবার করবেন সেটা ঠিক করেন।", en: "Commission on both sides, transaction tax and the spread. Entirely in your control, because you decide how often." },
          value: 55,
          tone: "bad",
        },
        {
          text: { bn: "ধরে রাখার খরচ", en: "Holding costs" },
          note: { bn: "তহবিলের বার্ষিক ফি, বিও অ্যাকাউন্টের রক্ষণাবেক্ষণ ফি। আংশিক নিয়ন্ত্রণে: কোন তহবিল, কোন ব্রোকার।", en: "Annual fund fees and BO account maintenance. Partly in your control: which fund, which broker." },
          value: 20,
          tone: "warn",
        },
        {
          text: { bn: "কর", en: "Tax" },
          note: { bn: "লভ্যাংশে উৎসে কর, আর মূলধনি মুনাফায় প্রযোজ্য কর। নিয়ন্ত্রণে নেই, কেবল কখন দেবেন সেটা কিছুটা।", en: "Withholding on dividends and any tax on capital gains. Not in your control, except partly when you pay it." },
          value: 25,
          tone: "plain",
        },
      ],
      caption: {
        bn: "অনুপাতটা ব্যাখ্যামূলক, প্রকৃত নয়। যা প্রকৃত তা হলো ক্রম: সবচেয়ে বড় স্তরটাই সবচেয়ে বেশি আপনার নিয়ন্ত্রণে।",
        en: "The proportions are illustrative rather than actual. What is real is the order: the largest layer is the one most in your control.",
      },
    },
    "cost-break": {
      kind: "lab",
      model: "break-even",
      title: { bn: "সমান হতে কত দাম লাগবে", en: "The price at which you break even" },
      note: { bn: "কেনার দাম আর কমিশন বসান। যন্ত্রটা বলে দেবে বেচার দামটা কত হতে হবে।", en: "Set the purchase price and the commission. The tool gives you the selling price you need." },
      preset: { buy: 50, commission: 0.4, tax: 0.05 },
    },
    "cost-tax": {
      kind: "lab",
      model: "tax",
      title: { bn: "লভ্যাংশ আর মুনাফায় কর", en: "Tax on dividends and gains" },
      note: { bn: "হারগুলো বদলায়, তাই বর্তমান হার বসিয়ে নিজের হিসাবটা দেখুন।", en: "The rates change, so put in the current ones and look at your own arithmetic." },
      preset: { dividend: 20000, dividendTax: 10, gain: 100000, gainTax: 0 },
    },
    "cost-bins": {
      kind: "bins",
      title: { bn: "কোনটা কমানো যায়", en: "Which of these can be reduced" },
      note: { bn: "প্রতিটা খরচকে ঠিক বাক্সে ফেলুন।", en: "Drop each cost into the right box." },
      bins: [
        { id: "yours", label: { bn: "আপনার হাতে", en: "In your hands" }, tone: "good" },
        { id: "fixed", label: { bn: "আপনার হাতে নেই", en: "Not in your hands" }, tone: "plain" },
      ],
      items: [
        {
          text: { bn: "বছরে কতগুলো লেনদেন করবেন", en: "How many trades you make in a year" },
          bin: "yours",
          why: { bn: "সবচেয়ে বড় লিভার, আর সম্পূর্ণ আপনার সিদ্ধান্ত। চব্বিশ থেকে চারে নামালে খরচ প্রায় ছয় ভাগের এক ভাগ।", en: "The biggest lever, and entirely your decision. Going from twenty-four to four cuts costs to about a sixth." },
        },
        {
          text: { bn: "কোন ব্রোকারের কমিশনের হার", en: "Which broker's commission rate" },
          bin: "yours",
          why: { bn: "বাছাই আপনার, আর বদলানোও যায়। তবে কমিশন সাধারণত স্প্রেডের চেয়ে ছোট, তাই এটা দ্বিতীয় লিভার।", en: "The choice is yours and it can be changed. Commission is usually smaller than the spread, so it is the second lever." },
        },
        {
          text: { bn: "লভ্যাংশে উৎসে কাটা করের হার", en: "The rate withheld on a dividend" },
          bin: "fixed",
          why: { bn: "হারটা নিয়ন্ত্রকের, আর টিআইএন থাকলে হারটা কম, তাই এটুকু আপনার হাতে আছে।", en: "The rate is set by the authorities, and having a TIN lowers it, so that much is yours." },
        },
        {
          text: { bn: "কম লেনদেনের শেয়ারে বড় স্প্রেড", en: "A wide spread in a thin share" },
          bin: "yours",
          why: { bn: "স্প্রেডের আকার আপনার হাতে নেই, কিন্তু কোন শেয়ার কিনবেন সেটা আছে। কম তারল্যের শেয়ার এড়ানোই এখানে নিয়ন্ত্রণ।", en: "The width is not yours, and which share you buy is. Avoiding thin shares is the control here." },
        },
        {
          text: { bn: "বিও অ্যাকাউন্টের বার্ষিক ফি", en: "The annual BO account fee" },
          bin: "fixed",
          why: { bn: "একটা নির্দিষ্ট অঙ্ক, আর একাধিক বিও অ্যাকাউন্ট না রাখলে এটা কমানোর কিছু নেই।", en: "A fixed amount, and beyond not keeping several BO accounts there is nothing to reduce." },
        },
        {
          text: { bn: "একটা তহবিলের বার্ষিক ব্যবস্থাপনা ফি", en: "A fund's annual management fee" },
          bin: "yours",
          why: { bn: "কোন তহবিল বাছবেন সেটা আপনার, আর মোট ব্যয় অনুপাত তহবিলে তহবিলে অনেক আলাদা।", en: "Which fund you choose is yours, and total expense ratios vary widely between funds." },
        },
      ],
    },
    "cost-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনি ৫০ টাকায় কিনে ৫০.৫০ টাকায় বেচলেন। দুই দিকের কমিশন ০.৪% করে। ফলাফল কী?",
            en: "You buy at 50 and sell at 50.50, with 0.4% commission on each side. What is the result?",
          },
          options: [
            {
              text: { bn: "সামান্য লোকসান, কারণ কমিশন লাভের চেয়ে বেশি", en: "A small loss, because the commission exceeds the gain" },
              right: true,
              why: {
                bn: "ঠিক। ০.৫০ টাকা লাভ মানে ১% এর সামান্য কম, আর দুই দিকের কমিশন মিলিয়ে ০.৮% এর বেশি, তার সঙ্গে লেনদেন কর। ছোট লাভে বেরিয়ে আসা প্রায়ই খরচেই খেয়ে ফেলে, আর এই হিসাবটা কেনার আগে করা উচিত।",
                en: "Right. A 0.50 gain is a little under 1%, while commission across both sides is over 0.8%, plus transaction tax. Exiting on a small gain is usually eaten by costs, and this is the calculation to do before buying.",
              },
            },
            {
              text: { bn: "০.৫০ টাকা লাভ", en: "A gain of 0.50 taka" },
              why: {
                bn: "এটা কমিশনের আগের হিসাব। কনট্রাক্ট নোটে যা থাকে তা হলো কমিশনের পরের অঙ্ক, আর সেখানে ছবিটা উল্টো। উপরের ব্রেক ইভেন যন্ত্রটাতে সংখ্যাগুলো বসিয়ে দেখুন।",
                en: "That is the figure before commission. What is on the contract note is the figure after it, and there the picture reverses. Put the numbers into the break-even tool above.",
              },
            },
            {
              text: { bn: "ঠিক সমান, কারণ কমিশন দুই দিকে সমান", en: "Exactly level, because commission is the same on both sides" },
              why: {
                bn: "দুই দিকে সমান হার মানে দুইবার দিতে হয়েছে, তাই মোট খরচ দ্বিগুণ। সমান হতে হলে বেচার দামটা কেনার দামের চেয়ে যথেষ্ট বেশি হতে হবে, আর সেটাই ব্রেক ইভেন দাম।",
                en: "Equal rates on both sides means paying twice, so the total cost doubles. To be level the selling price has to be meaningfully above the buying price, which is the break-even price.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "খরচ কমানোর সবচেয়ে বড় লিভার কোনটা?",
            en: "What is the biggest lever for reducing costs?",
          },
          options: [
            {
              text: { bn: "সবচেয়ে কম কমিশনের ব্রোকার খোঁজা", en: "Finding the broker with the lowest commission" },
              why: {
                bn: "সাহায্য করে, আর ছোট লিভার। ০.৪৫% থেকে ০.৩% এ নামা মানে প্রতি লেনদেনে ০.১৫% সাশ্রয়। বছরে চব্বিশ থেকে চারটা লেনদেনে নামা মানে অনেক বেশি সাশ্রয়, আর সেটা করতে ব্রোকার বদলাতেও হয় না।",
                en: "It helps, and it is the small lever. Going from 0.45% to 0.3% saves 0.15% per trade. Going from twenty-four trades to four saves far more, and requires no change of broker.",
              },
            },
            {
              text: { bn: "বছরে লেনদেনের সংখ্যা কমানো", en: "Making fewer trades a year" },
              right: true,
              why: {
                bn: "ঠিক। খরচ প্রতি লেনদেনে বসে, তাই সংখ্যাটাই গুণক। আর একটা বাড়তি সুবিধা আছে: কম লেনদেন মানে কম তাড়াহুড়োর সিদ্ধান্ত, তাই খরচ কমার সঙ্গে সিদ্ধান্তের মানও সাধারণত ভালো হয়। একটা পরিবর্তন, দুইটা উপকার।",
                en: "Right. Costs attach per trade, so the count is the multiplier. And there is a second benefit: fewer trades means fewer hurried decisions, so cutting costs usually improves the decisions too. One change, two benefits.",
              },
            },
            {
              text: { bn: "কর এড়ানোর উপায় খোঁজা", en: "Looking for ways to avoid tax" },
              why: {
                bn: "কর আইন মেনে পরিকল্পনা করা বৈধ আর যুক্তিসঙ্গত, যেমন টিআইএন করানো। কিন্তু কর সাধারণত লাভের উপর বসে, তাই কর দেওয়া মানে লাভ হয়েছে। লেনদেনের খরচ লাভ হোক বা না হোক দিতে হয়, আর সেটাই বেশি জরুরি সমস্যা।",
                en: "Planning within the law is legitimate and sensible, such as getting a TIN. But tax generally applies to gains, so paying it means you made one. Transaction costs are paid whether or not you gain, which makes them the more urgent problem.",
              },
            },
          ],
        },
      ],
    },
  },
},
};
