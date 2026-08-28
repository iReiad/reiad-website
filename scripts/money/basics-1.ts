/* ============================================================
   ভিত্তি, পর্যায় ১: শব্দগুলো শিখুন. Twenty-eight terms.

   What seeded these rows. See `scripts/money/shape.ts` for why
   this file is kept and what it is not.

   These lessons live at `/money/terms/`, not `/money/basics-1/`,
   and their progress ids are bare slugs. Both are facts about
   where the glossary was published for a year before this stage
   existed, and neither may change: the addresses are in the
   wild and the ids are in real accounts.
   ============================================================ */

import { mount, type Written } from "./shape.ts";

export const LESSONS: Written = {

/* ---------------------------------------------------------- */
"share": {
  bn: `
<p>ধরুন আপনার বন্ধু একটা রেস্টুরেন্ট খুলবে। পুরো টাকা তার নেই, তাই সে বলল: তুমি বিশ শতাংশ টাকা দাও, লাভের বিশ শতাংশ তোমার। আপনি রাজি হলে আপনি ওই রেস্টুরেন্টের এক-পঞ্চমাংশ মালিক। শেয়ার ঠিক এই জিনিসটাই, কেবল অনেক বড় স্কেলে আর অনেক ছোট টুকরায়।</p>

<p>একটা কোম্পানি তার মালিকানাকে লাখ লাখ সমান টুকরায় ভাগ করে। প্রতিটা টুকরার নাম শেয়ার। আপনি একশোটা শেয়ার কিনলে ওই কোম্পানির একশো টুকরার মালিক, আর আপনার অধিকারগুলো ওই ভাগ অনুযায়ী।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>শেয়ার একটা কোম্পানির মালিকানার সমান একটা টুকরা।</li>
<li>মালিক হিসেবে দুইটা জিনিস পান: লাভের ভাগ, আর ভোট দেওয়ার অধিকার।</li>
<li>দুইভাবে লাভ হতে পারে: ডিভিডেন্ড, আর দাম বাড়া।</li>
<li>দাম কমলে লস, আর কোম্পানি বন্ধ হলে শেয়ারহোল্ডাররা টাকা পান সবার শেষে।</li>
<li>শেয়ারের দাম কোম্পানির আকার বলে না। দাম গুণ শেয়ার সংখ্যাই আকার।</li>
</ul>
</div>

<h2>মালিক হিসেবে আপনি আসলে কী পান</h2>

${mount("share-figure")}

<p>প্রথমটা হলো লাভের ভাগ। কোম্পানি বছর শেষে লাভ করলে তার একটা অংশ শেয়ারহোল্ডারদের দিতে পারে, আর সেটাকে বলে <a class="term" href="/money/terms/dividend.html">ডিভিডেন্ড</a>। "পারে" শব্দটা গুরুত্বপূর্ণ: দিতে বাধ্য নয়। অনেক কোম্পানি লাভের পুরোটাই ব্যবসায় ফিরিয়ে দেয় যাতে ব্যবসাটা বড় হয়, আর সেটা খারাপ কিছু নয়।</p>

<p>দ্বিতীয়টা হলো ভোট। বার্ষিক সাধারণ সভায় শেয়ারহোল্ডাররা পরিচালক নির্বাচন আর কিছু বড় সিদ্ধান্তে ভোট দিতে পারেন, এক শেয়ারে এক ভোট। একশো শেয়ার নিয়ে আপনার ভোট কিছুই বদলাবে না, তবু অধিকারটা আছে, আর বাংলাদেশে অনেক কোম্পানির সভায় ছোট বিনিয়োগকারীরা যান আর প্রশ্ন করেন।</p>

<p>তৃতীয়টা মানুষ কম ভাবেন: কোম্পানি বন্ধ হয়ে গেলে সম্পদ বেচে টাকা বিলি করার সময় শেয়ারহোল্ডাররা লাইনের সবার শেষে। আগে কর্মীরা, তারপর সরকার, তারপর ব্যাংক আর <a class="term" href="/money/terms/bond.html">বন্ডধারীরা</a>, তারপর যদি কিছু থাকে তবে মালিকরা। প্রায়ই কিছু থাকে না। এইজন্যই শেয়ার ধার দেওয়ার চেয়ে ঝুঁকিপূর্ণ, আর এইজন্যই দীর্ঘমেয়াদে শেয়ারে রিটার্ন বেশি।</p>

<h2>টাকা আসে কোথা থেকে</h2>

<p>শেয়ার থেকে দুইভাবে টাকা আসতে পারে, আর দুইটা আলাদা জিনিস।</p>

${mount("share-compare")}

<p>দাম বাড়ার ব্যাপারটা একটু সূক্ষ্ম। দাম বাড়ে কারণ অন্য কেউ আগের চেয়ে বেশি দিতে রাজি হয়, আর সাধারণত রাজি হয় কারণ কোম্পানির আয় বেড়েছে বা বাড়বে বলে মনে হচ্ছে। মানে লম্বা সময়ে দামটা আয়ের পেছনেই হাঁটে। অল্প সময়ে দাম আয়ের সঙ্গে প্রায় কোনো সম্পর্ক ছাড়াই নড়তে পারে, আর সেটা <a class="term" href="/money/basics-2/supply-demand.html">চাহিদা আর জোগানের</a> বিষয়।</p>

<div class="ex"><b>উদাহরণ:</b> একটা কোম্পানির মোট ১০ কোটি শেয়ার আছে আর আপনি কিনলেন ১০০টা। আপনি এখন কোম্পানিটার ০.০০০০১% মালিক। ছোট শোনায়, আর সেটাই সঠিক: আপনি ছোট একটা অংশের মালিক, কিন্তু অংশটা আসল। কোম্পানি বছরে ৫০ কোটি টাকা লাভ করলে তার ০.০০০০১% হলো ৫০ টাকা, আর ডিভিডেন্ড দিলে সেটাই আপনার ভাগ।</div>

<h2>দাম দিয়ে আকার বোঝা যায় না</h2>

<p>এই ভুলটা নতুনরা প্রায় সবাই করেন: ১০ টাকার শেয়ারকে ৫০০ টাকার শেয়ারের চেয়ে "সস্তা" ভাবা। দাম কেবল বলে একটা টুকরার দাম কত, টুকরাগুলো কত ছোট করে কাটা হয়েছে তা নয়।</p>

${mount("share-reveal")}

<p>কোম্পানির আসল আকার হলো দাম গুণ মোট শেয়ার সংখ্যা, আর তার নাম <a class="term" href="/money/terms/market-cap.html">বাজারমূল্য</a>। ওটাই পরের লেখাগুলোর একটার বিষয়।</p>

<h2>বাংলাদেশে শেয়ার কেনা</h2>

<p>এখানে শেয়ার কেনাবেচা হয় <a class="term" href="/money/terms/dse.html">ঢাকা স্টক এক্সচেঞ্জে</a> আর চট্টগ্রাম স্টক এক্সচেঞ্জে। কিনতে হলে একটা <a class="term" href="/money/terms/bo-account.html">বিও অ্যাকাউন্ট</a> লাগবে, আর অর্ডারটা যাবে একজন <a class="term" href="/money/terms/broker.html">ব্রোকারের</a> মাধ্যমে। শেয়ারগুলো কাগজ হিসেবে আপনার কাছে আসে না, ইলেকট্রনিকভাবে জমা থাকে।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("share-quiz")}
`,
  en: `
<p>Suppose a friend is opening a restaurant. They do not have all the money, so they say: put in twenty percent and twenty percent of the profit is yours. Agree and you own a fifth of that restaurant. A share is exactly that, at a much larger scale and cut into much smaller pieces.</p>

<p>A company divides its ownership into millions of equal pieces. Each piece is a share. Buy a hundred and you own a hundred pieces of that company, with rights in proportion.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A share is an equal slice of a company's ownership.</li>
<li>As an owner you get two things: a share of profits and a vote.</li>
<li>Money can come two ways: dividends, and the price rising.</li>
<li>If the price falls you lose, and if the company winds up, shareholders are paid last.</li>
<li>The price does not tell you the company's size. Price times share count does.</li>
</ul>
</div>

<h2>What being an owner actually gets you</h2>

${mount("share-figure")}

<p>First, a share of the profit. If the company profits it may pay part of that out to shareholders, which is a <a class="term" href="/money/terms/dividend.html">dividend</a>. The word "may" is doing work: there is no obligation. Plenty of companies plough all of it back into the business so the business grows, and that is not a bad thing.</p>

<p>Second, a vote. At the annual general meeting shareholders elect directors and vote on some large decisions, one vote per share. A hundred shares will change nothing, and the right exists, and small investors do attend meetings and ask questions in Bangladesh.</p>

<p>Third, the one people think about least: if the company winds up and its assets are sold, shareholders are at the back of the queue. Staff first, then the government, then banks and <a class="term" href="/money/terms/bond.html">bondholders</a>, then the owners if anything is left. Often nothing is. That is why owning is riskier than lending, and why over long stretches owning pays more.</p>

<h2>Where the money comes from</h2>

<p>There are two ways a share pays, and they are different things.</p>

${mount("share-compare")}

<p>The price part is subtler. The price rises because somebody else will pay more than before, and usually they will because earnings have risen or look like they will. So over long stretches the price walks behind the earnings. Over short stretches the price can move with almost no relation to earnings, which is a matter of <a class="term" href="/money/basics-2/supply-demand.html">supply and demand</a>.</p>

<div class="ex"><b>Example:</b> A company has 10 crore shares and you buy 100. You now own 0.00001% of it. That sounds tiny, and it is correct: you own a small part, and the part is real. If the company profits 50 crore taka in a year, 0.00001% of that is 50 taka, and if it pays a dividend, that is your slice.</div>

<h2>The price does not tell you the size</h2>

<p>Nearly every beginner makes this mistake: treating a 10 taka share as "cheaper" than a 500 taka one. The price only says what one piece costs, not how finely the pie was cut.</p>

${mount("share-reveal")}

<p>The real size is price times total share count, which is called <a class="term" href="/money/terms/market-cap.html">market capitalisation</a>, and it has a lesson of its own.</p>

<h2>Buying shares in Bangladesh</h2>

<p>Shares here trade on the <a class="term" href="/money/terms/dse.html">Dhaka Stock Exchange</a> and the Chittagong Stock Exchange. To buy you need a <a class="term" href="/money/terms/bo-account.html">BO account</a>, and the order goes through a <a class="term" href="/money/terms/broker.html">broker</a>. The shares never reach you as certificates; they sit electronically.</p>

<h2>Check yourself</h2>

${mount("share-quiz")}
`,
  blocks: {
    "share-figure": {
      kind: "figure",
      shape: "stack",
      title: { bn: "কোম্পানির লাভ কোথায় যায়", en: "Where a company's profit goes" },
      parts: [
        { text: { bn: "কর", en: "Tax" }, note: { bn: "সরকারের ভাগ, শেয়ারহোল্ডারের আগে", en: "The government's share, before the owners" }, value: 25, tone: "plain" },
        { text: { bn: "ব্যবসায় ফিরে যায়", en: "Reinvested in the business" }, note: { bn: "নতুন কারখানা, নতুন বাজার, ঋণ শোধ", en: "New plant, new markets, paying down debt" }, value: 45, tone: "good" },
        { text: { bn: "ডিভিডেন্ড", en: "Dividend" }, note: { bn: "শেয়ারহোল্ডারদের হাতে যা আসে", en: "What reaches shareholders' hands" }, value: 30, tone: "lead" },
      ],
      caption: {
        bn: "ব্যবসায় ফেরানো অংশটা হারিয়ে যায় না: ওটা ভবিষ্যতের লাভ কেনে, আর সেটাই দাম বাড়ার কারণ।",
        en: "The reinvested slice is not lost: it buys future profit, and that is what makes the price rise.",
      },
    },
    "share-compare": {
      kind: "compare",
      title: { bn: "দুইভাবে টাকা আসে", en: "Two ways it pays" },
      columns: [
        { bn: "ডিভিডেন্ড", en: "Dividend" },
        { bn: "দাম বাড়া", en: "Price rising" },
      ],
      rows: [
        {
          label: { bn: "টাকা কোথা থেকে", en: "Where the money comes from" },
          cells: [
            { bn: "কোম্পানির নিজের লাভ থেকে", en: "The company's own profit" },
            { bn: "অন্য একজন ক্রেতার কাছ থেকে", en: "Another buyer" },
          ],
        },
        {
          label: { bn: "কবে পান", en: "When you get it" },
          cells: [
            { bn: "সাধারণত বছরে একবার", en: "Usually once a year" },
            { bn: "যেদিন বেচবেন", en: "The day you sell" },
          ],
        },
        {
          label: { bn: "নিশ্চিত?", en: "Is it certain?" },
          cells: [
            { bn: "না, কোম্পানি ঠিক করে", en: "No: the company decides" },
            { bn: "না, বাজার ঠিক করে", en: "No: the market decides" },
          ],
        },
        {
          label: { bn: "কর", en: "Tax" },
          cells: [
            { bn: "উৎসেই কাটা হয়", en: "Withheld at source" },
            { bn: "বেচার সময়ে, হার আলাদা", en: "On sale, at a different rate" },
          ],
        },
      ],
    },
    "share-reveal": {
      kind: "reveal",
      title: { bn: "কোনটা বড় কোম্পানি", en: "Which is the bigger company" },
      ask: {
        bn: "কোম্পানি ক-এর শেয়ারের দাম ১২ টাকা আর মোট শেয়ার ৫০ কোটি। কোম্পানি খ-এর দাম ৮০০ টাকা আর মোট শেয়ার ২০ লাখ। কোনটা বড়?",
        en: "Company A trades at 12 taka with 50 crore shares. Company B trades at 800 taka with 20 lakh shares. Which is bigger?",
      },
      choices: [
        { bn: "কোম্পানি ক", en: "Company A" },
        { bn: "কোম্পানি খ", en: "Company B" },
        { bn: "দাম দিয়ে বলা যায় না", en: "The price cannot tell you" },
      ],
      answer: {
        bn: "কোম্পানি ক, আর অনেক গুণ বড়: ৬০০ কোটি বনাম ১৬ কোটি টাকা।",
        en: "Company A, and by a long way: 600 crore against 16 crore taka.",
      },
      why: {
        bn: "১২ গুণ ৫০ কোটি হলো ৬০০ কোটি টাকা। ৮০০ গুণ ২০ লাখ হলো ১৬ কোটি টাকা। মানে ক প্রায় সাঁইত্রিশ গুণ বড়, যদিও তার শেয়ারের দাম খ-এর ষাট ভাগের এক ভাগ। শেয়ারের দাম কেবল বলে পাইটা কত টুকরায় কাটা হয়েছে। একটা পিৎজা দশ টুকরা করলে প্রতি টুকরার দাম কম হয়, পিৎজাটা ছোট হয় না। এই ভুলটার কারণেই বাংলাদেশে বহু মানুষ কম দামের শেয়ারকে সস্তা ভেবে কেনেন, আর ওগুলোর অনেকগুলোই আসলে ছোট আর দুর্বল কোম্পানি।",
        en: "12 times 50 crore is 600 crore taka. 800 times 20 lakh is 16 crore taka. So A is about thirty-seven times bigger while its share price is a sixtieth of B's. A price only tells you how finely the pie was cut. Slice a pizza into ten and each slice costs less; the pizza is not smaller. This confusion is why so many people here buy low-priced shares believing they are cheap, when many of them are simply small, weak companies.",
      },
    },
    "share-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানি দেউলিয়া হয়ে গেল আর সম্পদ বেচে টাকা পাওয়া গেল। শেয়ারহোল্ডাররা কখন পান?",
            en: "A company fails and its assets are sold. When do shareholders get paid?",
          },
          options: [
            {
              text: { bn: "সবার আগে, কারণ তারাই মালিক", en: "First, because they are the owners" },
              why: {
                bn: "উল্টো। মালিক হওয়া মানে ঝুঁকির শেষ ভাগটা নেওয়া। পাওনাদাররা আগে, মালিকরা পরে।",
                en: "The reverse. Being the owner means taking the last slice of the risk. Creditors come first, owners last.",
              },
            },
            {
              text: { bn: "সবার শেষে, আর প্রায়ই কিছুই থাকে না", en: "Last, and often there is nothing left" },
              right: true,
              why: {
                bn: "ঠিক। কর্মী, সরকার, ব্যাংক আর বন্ডধারীরা আগে। এই ঝুঁকিটাই কারণ দীর্ঘমেয়াদে শেয়ারে রিটার্ন ধারের চেয়ে বেশি: আপনাকে শেষে দাঁড়ানোর জন্য বাড়তি কিছু দিতে হয়।",
                en: "Right. Staff, the government, banks and bondholders come first. That risk is exactly why shares pay more than lending over long stretches: standing at the back has to be compensated.",
              },
            },
            {
              text: { bn: "বন্ডধারীদের সঙ্গে সমানভাবে", en: "Equally with bondholders" },
              why: {
                bn: "না। বন্ডধারীরা পাওনাদার, শেয়ারহোল্ডাররা মালিক, আর আইনে পাওনাদার আগে। এই পার্থক্যটাই বন্ড আর শেয়ারের পুরো পার্থক্য।",
                en: "No. Bondholders are creditors and shareholders are owners, and the law pays creditors first. That difference is the whole difference between a bond and a share.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানি এই বছর ভালো লাভ করেছে কিন্তু কোনো ডিভিডেন্ড দেয়নি। এতে কী বোঝা যায়? একাধিক উত্তর ঠিক।",
            en: "A company had a good profit this year and paid no dividend. What can that mean? More than one is right.",
          },
          options: [
            {
              text: { bn: "লাভটা ব্যবসা বড় করতে ব্যবহার হচ্ছে", en: "The profit is being used to grow the business" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর দ্রুত বাড়ন্ত কোম্পানির ক্ষেত্রে এটাই সবচেয়ে সাধারণ কারণ। টাকাটা হারায় না, ভবিষ্যতের লাভ কেনে।",
                en: "Yes, and for a fast-growing company this is the usual reason. The money is not lost, it buys future profit.",
              },
            },
            {
              text: { bn: "ঋণ শোধ করা হচ্ছে", en: "Debt is being paid down" },
              right: true,
              why: {
                bn: "হ্যাঁ। ঋণ কমানো শেয়ারহোল্ডারের জন্য ভালো, যদিও নগদ হাতে আসে না।",
                en: "Yes. Lowering debt is good for shareholders even though no cash reaches them.",
              },
            },
            {
              text: { bn: "কোম্পানিটা খারাপ", en: "The company is bad" },
              why: {
                bn: "নাও হতে পারে। পৃথিবীর অনেক সফল কোম্পানি বছরের পর বছর ডিভিডেন্ড দেয়নি। খারাপ কি না তা বোঝা যায় লাভটা কোথায় যাচ্ছে দেখে, দিচ্ছে কি না দেখে নয়।",
                en: "Not necessarily. Many of the most successful companies in the world paid nothing for years. Whether it is bad is answered by where the profit goes, not by whether it is handed out.",
              },
            },
            {
              text: { bn: "কাগজের লাভটা নগদে আসেনি", en: "The paper profit never arrived as cash" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর এটাই সবচেয়ে সতর্ক হওয়ার মতো কারণ। লাভ দেখানো যায়, নগদ দেখানো যায় না, আর পর্যায় ৩-এর নগদ প্রবাহের লেখাটা পুরোটাই এই নিয়ে।",
                en: "Yes, and this is the one to be careful about. Profit can be shown, cash cannot, and stage 3's cash flow lesson is entirely about it.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"dse": {
  bn: `
<p>ঢাকা স্টক এক্সচেঞ্জ, সংক্ষেপে ডিএসই, বাংলাদেশের সবচেয়ে বড় শেয়ারবাজার। ১৯৫৪ সালে নারায়ণগঞ্জে শুরু, এখন মতিঝিলে, আর দেশের প্রায় সব বড় কোম্পানির শেয়ার এখানেই কেনাবেচা হয়।</p>

<p>কিন্তু "শেয়ারবাজার" শব্দটা একটা ভুল ছবি তৈরি করে। এটা কোনো দোকান নয় যেখানে ডিএসই আপনার কাছে শেয়ার বেচে। ডিএসই নিজে কিছু কেনে না, বেচেও না। এটা একটা মিলিয়ে দেওয়ার যন্ত্র: হাজার হাজার মানুষের কেনার অর্ডার আর বেচার অর্ডার আসে, আর সফটওয়্যার সেগুলো দাম আর সময় অনুযায়ী মিলিয়ে দেয়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ডিএসই ক্রেতা আর বিক্রেতার অর্ডার মিলিয়ে দেয়, নিজে কিছু বেচে না।</li>
<li>আপনি সরাসরি অর্ডার দিতে পারেন না; ব্রোকারের মাধ্যমে দিতে হয়।</li>
<li>বাজার খোলে সকাল ১০টায়, বন্ধ হয় দুপুর ২টা ২০ মিনিটে, রবি থেকে বৃহস্পতি।</li>
<li>দাম ঠিক করে দাম আর সময়ের অগ্রাধিকার, কোনো কর্তৃপক্ষ নয়।</li>
<li>চট্টগ্রামে দ্বিতীয় একটা এক্সচেঞ্জ আছে, সিএসই, অনেক ছোট।</li>
</ul>
</div>

<h2>একটা অর্ডার কীভাবে মেলে</h2>

<p>এটাই ডিএসইর পুরো কাজ, আর এটা বোঝা গেলে দাম কেন যেভাবে নড়ে তা অনেকটা পরিষ্কার হয়ে যায়।</p>

${mount("dse-callouts")}

<p>প্রতিটা শেয়ারের জন্য একটা তালিকা থাকে: কারা কিনতে চান আর কত দামে, আর কারা বেচতে চান আর কত দামে। কেনার সর্বোচ্চ দাম আর বেচার সর্বনিম্ন দামের মাঝখানের ফাঁকটাকে বলে স্প্রেড। যখন কেউ এসে ওই ফাঁকটা পেরিয়ে যান, লেনদেন হয়, আর ওই দামটাই হয়ে যায় সর্বশেষ দাম।</p>

<div class="ex"><b>উদাহরণ:</b> কেউ ৪৫.৫০ টাকায় ৫০০ শেয়ার কিনতে চান, আর কেউ ৪৬.০০ টাকায় ৩০০ বেচতে চান। কোনো লেনদেন হচ্ছে না, দুইজন দুই দামে দাঁড়িয়ে আছেন। এখন তৃতীয় একজন এসে বললেন "৪৬.০০ টাকায় ৩০০ কিনব"। সঙ্গে সঙ্গে মিলে গেল, আর সর্বশেষ দাম হলো ৪৬.০০। দাম বাড়ল না কারণ কোম্পানির কিছু হয়েছে, দাম বাড়ল কারণ একজন ক্রেতা অপেক্ষা করতে রাজি ছিলেন না।</div>

<h2>বাজার কখন খোলা</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>সময়</th><th>কী হয়</th></tr>
</thead>
<tbody>
<tr><td>সকাল ৯:৩০ থেকে ১০:০০</td><td>প্রি-ওপেনিং, অর্ডার জমা হয় কিন্তু মেলে না</td></tr>
<tr><td>সকাল ১০:০০</td><td>বাজার খোলে, লেনদেন শুরু</td></tr>
<tr><td>দুপুর ২:২০</td><td>বাজার বন্ধ</td></tr>
<tr><td>দুপুর ২:২০ থেকে ২:৩০</td><td>পোস্ট-ক্লোজিং, বন্ধের দামে কিছু লেনদেন</td></tr>
<tr><td>শুক্র ও শনি</td><td>বন্ধ। সরকারি ছুটিতেও বন্ধ।</td></tr>
</tbody>
</table>
</div>

<div class="note">সময়সূচি মাঝে মাঝে বদলায়, বিশেষ করে রমজানে। ব্রোকারের অ্যাপ বা ডিএসইর সাইট থেকে মিলিয়ে নেবেন। এই লেখার সংখ্যাগুলো সাধারণ সময়ের।</div>

<h2>ডিএসই আর সিএসই</h2>

<p>বাংলাদেশে দুইটা এক্সচেঞ্জ আছে। ডিএসই বড়, আর দেশের প্রায় পুরো লেনদেন এখানেই হয়। চট্টগ্রাম স্টক এক্সচেঞ্জ, সিএসই, ১৯৯৫ সালে চালু হয়েছে আর অনেক ছোট। বেশিরভাগ কোম্পানি দুই জায়গাতেই তালিকাভুক্ত, আর দাম প্রায় একই থাকে কারণ পার্থক্য হলেই কেউ একদিকে কিনে অন্যদিকে বেচে দেয়।</p>

<p>নতুন বিনিয়োগকারীর জন্য ব্যবহারিক পরামর্শ: ডিএসইর দামটাই দেখুন। সিএসইতে অনেক শেয়ারে এত কম লেনদেন হয় যে ওখানকার সর্বশেষ দাম পুরনো হতে পারে।</p>

<h2>তালিকাভুক্ত হওয়া মানে কী</h2>

<p>একটা কোম্পানি ডিএসইতে তালিকাভুক্ত হলে সে কিছু সুবিধা পায় আর কিছু দায় নেয়। সুবিধাটা হলো সে জনসাধারণের কাছ থেকে মূলধন তুলতে পারে, যা ব্যাংকঋণের চেয়ে সস্তা এবং ফেরত দিতে হয় না। দায়টা হলো স্বচ্ছতা: প্রতি তিন মাসে হিসাব প্রকাশ করতে হবে, বছরে একবার নিরীক্ষিত প্রতিবেদন দিতে হবে, আর দাম-সংবেদনশীল যেকোনো খবর সঙ্গে সঙ্গে জানাতে হবে।</p>

<p>এই দায়টাই আপনার সবচেয়ে বড় সুবিধা, আর সেটা অনেকে খেয়াল করেন না। একটা তালিকাভুক্ত কোম্পানির বিক্রি, লাভ, ঋণ আর নগদ, সবকিছু আপনি বিনামূল্যে পড়তে পারেন। পাশের গলির যে দোকানটা ভালো চলছে বলে মনে হয়, তার হিসাব আপনি কখনো দেখতে পাবেন না। পর্যায় ৩ পুরোটাই এই কাগজগুলো পড়া নিয়ে।</p>

<h2>ডিএসই কী করে না</h2>

<p>এটা জানা যতটা দরকার, ততটাই মানুষ জানেন না।</p>

${mount("dse-bins")}

<h2>নিজে যাচাই করুন</h2>

${mount("dse-quiz")}

<p>পরের ধাপ হলো পুরো বাজারটা একটা সংখ্যায় দেখা: <a class="term" href="/money/terms/dsex.html">সূচক</a>।</p>
`,
  en: `
<p>The Dhaka Stock Exchange, DSE, is Bangladesh's main share market. It began in Narayanganj in 1954, sits in Motijheel now, and nearly every large company in the country trades here.</p>

<p>But the phrase "stock market" plants the wrong picture. It is not a shop where DSE sells you shares. DSE buys nothing and sells nothing. It is a matching machine: thousands of buy orders and sell orders arrive, and software pairs them off by price and time.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>DSE matches buyers to sellers; it does not sell anything itself.</li>
<li>You cannot place an order directly: it goes through a broker.</li>
<li>Trading runs 10:00 to 14:20, Sunday to Thursday.</li>
<li>Price and time priority decide what fills, not any authority.</li>
<li>There is a second exchange in Chittagong, CSE, much smaller.</li>
</ul>
</div>

<h2>How an order matches</h2>

<p>This is the whole of what DSE does, and understanding it explains a great deal about why prices move the way they do.</p>

${mount("dse-callouts")}

<p>Every share has a list: who wants to buy and at what price, who wants to sell and at what price. The gap between the highest bid and the lowest offer is the spread. When somebody crosses that gap a trade happens, and that price becomes the last traded price.</p>

<div class="ex"><b>Example:</b> Somebody wants 500 shares at 45.50 and somebody else offers 300 at 46.00. Nothing trades: two people are standing at two prices. Now a third arrives saying "I will buy 300 at 46.00". It matches instantly and the last price becomes 46.00. The price did not rise because anything happened to the company. It rose because one buyer was unwilling to wait.</div>

<h2>When the market is open</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>Time</th><th>What happens</th></tr>
</thead>
<tbody>
<tr><td>09:30 to 10:00</td><td>Pre-opening: orders collect but do not match</td></tr>
<tr><td>10:00</td><td>The market opens and trading starts</td></tr>
<tr><td>14:20</td><td>The market closes</td></tr>
<tr><td>14:20 to 14:30</td><td>Post-closing: some trading at the closing price</td></tr>
<tr><td>Friday and Saturday</td><td>Closed, and closed on public holidays</td></tr>
</tbody>
</table>
</div>

<div class="note">The schedule changes now and then, particularly during Ramadan. Check the broker's app or the DSE site. The times here are the ordinary ones.</div>

<h2>DSE and CSE</h2>

<p>Bangladesh has two exchanges. DSE is the large one and carries nearly all the turnover. The Chittagong Stock Exchange, CSE, opened in 1995 and is much smaller. Most companies are listed on both, and the prices stay close because any real gap gets arbitraged away.</p>

<p>The practical advice for a beginner: read DSE's price. Many shares trade so thinly on CSE that its last price can be stale.</p>

<h2>What being listed means</h2>

<p>A company that lists on DSE gains something and takes on something. The gain is that it can raise capital from the public, which is cheaper than a bank loan and never has to be repaid. The obligation is disclosure: quarterly accounts, an audited annual report, and immediate publication of anything price sensitive.</p>

<p>That obligation is your biggest advantage, and people rarely notice it. A listed company's sales, profit, debt and cash are all yours to read for free. The shop down the road that looks like it is doing well will never show you its books. The whole of stage 3 is about reading those documents.</p>

<h2>What DSE does not do</h2>

<p>This is worth knowing precisely because so few people do.</p>

${mount("dse-bins")}

<h2>Check yourself</h2>

${mount("dse-quiz")}

<p>The next step is reading the whole market as one number: the <a class="term" href="/money/terms/dsex.html">index</a>.</p>
`,
  blocks: {
    "dse-callouts": {
      kind: "figure",
      shape: "callouts",
      title: { bn: "একটা শেয়ারের অর্ডার বই", en: "One share's order book" },
      screen: {
        title: { bn: "কোম্পানি ক, সর্বশেষ ৪৫.৮০", en: "Company A, last 45.80" },
        rows: [
          { label: { bn: "বিক্রেতা চান", en: "Sellers want" }, value: { bn: "৪৬.৫০ × ১,২০০", en: "46.50 x 1,200" } },
          { label: { bn: "বিক্রেতা চান", en: "Sellers want" }, value: { bn: "৪৬.০০ × ৩০০", en: "46.00 x 300" } },
          { label: { bn: "ফাঁক, স্প্রেড", en: "The gap, the spread" }, value: { bn: "০.৫০ টাকা", en: "0.50 taka" } },
          { label: { bn: "ক্রেতা দিতে রাজি", en: "Buyers will pay" }, value: { bn: "৪৫.৫০ × ৫০০", en: "45.50 x 500" } },
          { label: { bn: "ক্রেতা দিতে রাজি", en: "Buyers will pay" }, value: { bn: "৪৫.০০ × ২,০০০", en: "45.00 x 2,000" } },
        ],
      },
      parts: [
        {
          at: 1,
          text: { bn: "সবচেয়ে সস্তা বিক্রেতা", en: "The cheapest seller" },
          note: { bn: "আপনি এখনই কিনতে চাইলে এই দামটাই দিতে হবে।", en: "If you want it now, this is the price you pay." },
        },
        {
          at: 2,
          text: { bn: "স্প্রেড: কেনা আর বেচার মাঝখানের দূরত্ব", en: "The spread: the distance between buying and selling" },
          tone: "warn",
          note: { bn: "কিনে সঙ্গে সঙ্গে বেচলে এতটুকু আপনি হারান। পাতলা শেয়ারে এই ফাঁক অনেক বড় হয়।", en: "Buy and sell instantly and you lose this much. In thin shares the gap gets wide." },
        },
        {
          at: 3,
          text: { bn: "সবচেয়ে দামি ক্রেতা", en: "The highest bidder" },
          note: { bn: "আপনি এখনই বেচতে চাইলে এই দামটাই পাবেন।", en: "If you want out now, this is what you get." },
        },
      ],
      caption: {
        bn: "সর্বশেষ দাম ৪৫.৮০, আর এই মুহূর্তে ওই দামে কেউ কিনছেনও না বেচছেনও না। সর্বশেষ দাম একটা ইতিহাস, বর্তমান নয়।",
        en: "The last price is 45.80, and right now nobody is buying or selling there. A last price is history, not the present.",
      },
    },
    "dse-bins": {
      kind: "bins",
      title: { bn: "ডিএসইর কাজ কোনটা", en: "Which of these is DSE's job" },
      bins: [
        { id: "yes", label: { bn: "ডিএসই করে", en: "DSE does this" }, tone: "good" },
        { id: "no", label: { bn: "ডিএসই করে না", en: "DSE does not" }, tone: "bad" },
      ],
      items: [
        {
          text: { bn: "ক্রেতা আর বিক্রেতার অর্ডার মিলিয়ে দেওয়া", en: "Matching buy and sell orders" },
          bin: "yes",
          why: { bn: "এটাই তার মূল কাজ, আর প্রায় পুরো কাজ।", en: "This is its core job and nearly all of it." },
        },
        {
          text: { bn: "কোন কোম্পানি তালিকাভুক্ত হবে তা যাচাই করা", en: "Vetting which companies may list" },
          bin: "yes",
          why: { bn: "শর্ত ঠিক করা আর যাচাই করা এক্সচেঞ্জের কাজ, বিএসইসির অনুমোদনসহ।", en: "Setting and checking listing conditions is the exchange's job, with BSEC's approval." },
        },
        {
          text: { bn: "দাম কত হওয়া উচিত তা ঠিক করা", en: "Deciding what a price should be" },
          bin: "no",
          why: { bn: "দাম ঠিক করে ক্রেতা আর বিক্রেতা। এক্সচেঞ্জ কেবল সীমা বসায়, দৈনিক সর্বোচ্চ ওঠানামার।", en: "Buyers and sellers set the price. The exchange only caps how far it may move in a day." },
        },
        {
          text: { bn: "আপনার শেয়ার জমা রাখা", en: "Holding your shares" },
          bin: "no",
          why: { bn: "ওটা সিডিবিএলের কাজ। কেনাবেচা আর জমা রাখা দুইটা আলাদা প্রতিষ্ঠানের, আর সেটা একটা সুরক্ষা।", en: "That is CDBL's job. Trading and custody are separate institutions, which is a protection." },
        },
        {
          text: { bn: "আপনাকে ক্ষতিপূরণ দেওয়া, শেয়ারের দাম পড়লে", en: "Compensating you when a price falls" },
          bin: "no",
          why: { bn: "কেউ দেয় না, কোথাও দেয় না। দাম পড়া বিনিয়োগের অংশ, দুর্ঘটনা নয়।", en: "Nobody does, anywhere. A falling price is part of investing, not an accident." },
        },
        {
          text: { bn: "প্রতিটা লেনদেনের নিষ্পত্তি নিশ্চিত করা", en: "Guaranteeing that trades settle" },
          bin: "yes",
          why: { bn: "এক্সচেঞ্জ আর সিডিবিএল মিলে নিশ্চিত করে যে কেনা শেয়ার আপনার অ্যাকাউন্টে পৌঁছাবে।", en: "The exchange and CDBL together make sure a bought share reaches your account." },
        },
      ],
    },
    "dse-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা শেয়ারের সর্বশেষ দাম ৪৫.৮০। এটা কী বোঝায়?",
            en: "A share's last price is 45.80. What does that mean?",
          },
          options: [
            {
              text: { bn: "আপনি এখন ৪৫.৮০ টাকায় কিনতে পারবেন", en: "You can buy it now at 45.80" },
              why: {
                bn: "না, আর এটাই সবচেয়ে দরকারি সংশোধন। ৪৫.৮০ হলো শেষ যে লেনদেনটা হয়েছিল তার দাম। এখন কিনতে হলে সবচেয়ে সস্তা বিক্রেতার দামটা দিতে হবে, যা বেশি হতে পারে।",
                en: "No, and this is the most useful correction here. 45.80 is what the last trade happened at. To buy now you pay the cheapest seller's price, which may be higher.",
              },
            },
            {
              text: { bn: "শেষ লেনদেনটা এই দামে হয়েছিল, আর এখন কেউ ওখানে থাকতেও পারেন না", en: "The last trade happened there, and there may be nobody at that price now" },
              right: true,
              why: {
                bn: "ঠিক। এইজন্যই মার্কেট অর্ডার বিপজ্জনক আর লিমিট অর্ডার নিরাপদ: সর্বশেষ দাম দেখে অর্ডার দিলে ভরাট হয় অন্য দামে।",
                en: "Right. That is why a market order is dangerous and a limit order is not: order from the last price and it fills at a different one.",
              },
            },
            {
              text: { bn: "কোম্পানিটার প্রতিটা শেয়ারের মূল্য ৪৫.৮০", en: "Each share of the company is worth 45.80" },
              why: {
                bn: "দাম আর মূল্য এক জিনিস না, আর ওই পার্থক্যটাই পর্যায় ৩-এর পুরো বিষয়। দাম হলো শেষ কেউ যা দিয়েছে; মূল্য হলো ব্যবসাটা যা আনবে।",
                en: "Price and value are not the same thing, and that difference is the whole of stage 3. A price is what the last person paid; value is what the business will bring in.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কেন একজন সাধারণ মানুষ সরাসরি ডিএসইতে অর্ডার দিতে পারেন না?",
            en: "Why can an ordinary person not place an order directly with DSE?",
          },
          options: [
            {
              text: { bn: "কারণ ডিএসই কেবল লাইসেন্সধারী সদস্যদের সঙ্গে কাজ করে", en: "Because DSE deals only with licensed members" },
              right: true,
              why: {
                bn: "ঠিক। ব্রোকারেজ হাউসগুলো এক্সচেঞ্জের সদস্য, আর তাদের ওপর নিয়মকানুন আর জামানতের দায় আছে। এই ব্যবস্থার কারণেই আপনি কেনা শেয়ার সত্যিই পান।",
                en: "Right. Brokerage houses are members of the exchange and carry rules and collateral obligations. That structure is why a bought share actually reaches you.",
              },
            },
            {
              text: { bn: "কারণ সাধারণ মানুষ ভুল অর্ডার দিয়ে ফেলবে", en: "Because ordinary people would place wrong orders" },
              why: {
                bn: "নিয়মটা এই কারণে নয়। ব্রোকারের মাধ্যমে দিলেও ভুল অর্ডার দেওয়া যায়, আর অনেকে দেন।",
                en: "That is not the reason. You can place a wrong order through a broker too, and plenty of people do.",
              },
            },
            {
              text: { bn: "কারণ সরাসরি দিলে কমিশন লাগত না", en: "Because direct orders would avoid commission" },
              why: {
                bn: "কমিশন এর ফল, কারণ নয়। ব্যবস্থাটা সদস্যভিত্তিক কারণ কেউ একজনকে নিষ্পত্তির দায় নিতে হয়।",
                en: "Commission is a consequence, not the cause. The structure is membership-based because somebody has to carry settlement responsibility.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"dsex": {
  bn: `
<p>খবরে শুনবেন "আজ সূচক ৪৮ পয়েন্ট বেড়েছে"। সূচক জিনিসটা কী, আর ৪৮ পয়েন্ট মানে কী?</p>

<p>সূচক হলো পুরো বাজারের হালচাল একটা সংখ্যায় প্রকাশ করার চেষ্টা। ডিএসইতে তিনশোর বেশি কোম্পানি তালিকাভুক্ত। প্রতিদিন কারো দাম বাড়ে, কারো কমে। "আজ বাজার কেমন গেল" প্রশ্নের উত্তর দিতে হলে সবগুলোকে এক করে একটা গড় বের করতে হয়, আর সূচক ঠিক সেটাই।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>DSEX প্রধান সূচক, ডিএসইর প্রায় সব কোম্পানি নিয়ে।</li>
<li>এটা সাধারণ গড় নয়: বড় কোম্পানির ওজন বেশি।</li>
<li>পয়েন্ট নিজে কিছু বোঝায় না; শতাংশে বদলটাই অর্থবহ।</li>
<li>DS30 হলো ত্রিশটা বড় কোম্পানির সূচক, DSES শরিয়াহ মানা কোম্পানির।</li>
<li>সূচক বাড়া মানে আপনার শেয়ার বেড়েছে তা নয়।</li>
</ul>
</div>

<h2>ওজন কেন লাগে</h2>

<p>যদি সবগুলো কোম্পানিকে সমান ধরা হতো, তাহলে একটা ছোট কোম্পানির দাম ২০% বাড়লে সূচকে ততটাই প্রভাব পড়ত যতটা পড়ত গ্রামীণফোনের ২০% বাড়ায়। কিন্তু গ্রামীণফোন বাজারের অনেক বড় অংশ, তাই ওটা আসলেই "বাজার কেমন গেল" প্রশ্নের বেশি বড় অংশ।</p>

<p>তাই DSEX ওজন দেয় <a class="term" href="/money/terms/market-cap.html">বাজারমূল্য</a> অনুযায়ী, আর ভাসমান শেয়ারের হিসাব ধরে: যতটা শেয়ার সাধারণ বিনিয়োগকারীর হাতে আছে, ততটাই গোনা হয়। যে শেয়ারগুলো সরকার বা প্রতিষ্ঠাতা পরিবারের হাতে বন্ধ, সেগুলো বাদ।</p>

${mount("index-stack")}

<h2>পয়েন্ট বনাম শতাংশ</h2>

<p>এই জায়গায় খবরের ভাষা বিভ্রান্তিকর। "সূচক ১০০ পয়েন্ট পড়েছে" শুনলে ভয়ংকর মনে হয়, কিন্তু সূচক ৬,৫০০ হলে ১০০ পয়েন্ট মানে ১.৫%, যা একটা সাধারণ দিন। আবার সূচক ১,৫০০ হলে ১০০ পয়েন্ট মানে ৬.৭%, যা একটা ধস।</p>

${mount("index-reveal")}

<p>তাই সবসময় শতাংশে ভাবুন। পয়েন্টের সংখ্যাটা কেবল তখনই অর্থবহ যখন আপনি জানেন সূচকটা কোথায় দাঁড়িয়ে।</p>

<h2>বাংলাদেশের সূচকগুলো</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>সূচক</th><th>কী মাপে</th><th>কখন কাজে লাগে</th></tr>
</thead>
<tbody>
<tr><td>DSEX</td><td>ডিএসইর প্রায় সব কোম্পানি, ওজনসহ</td><td>পুরো বাজারের হালচাল</td></tr>
<tr><td>DS30</td><td>ত্রিশটা বড় ও তরল কোম্পানি</td><td>বড় কোম্পানিগুলো কেমন করছে</td></tr>
<tr><td>DSES</td><td>শরিয়াহ পরিপালনকারী কোম্পানি</td><td>সুদমুক্ত বিনিয়োগ খুঁজলে</td></tr>
<tr><td>CSCX, CASPI</td><td>চট্টগ্রাম এক্সচেঞ্জের নিজস্ব</td><td>খুব কম ব্যবহৃত হয়</td></tr>
</tbody>
</table>
</div>

<div class="note">DSEX ২০১৩ সালে চালু হয়েছে, আর তার আগে DGEN নামে আরেকটা সূচক ছিল। তাই ২০১০ সালের ধসের সংখ্যাগুলো DGEN-এর, DSEX-এর নয়। দুইটাকে এক লাইনে বসিয়ে তুলনা করলে ভুল ছবি পাবেন, আর অনেক লেখায় সেই ভুলটা হয়।</div>

<h2>সূচক দিয়ে কী বোঝা যায়, কী যায় না</h2>

<p>সূচক একটা ভালো তাপমাত্রামাপক আর একটা খারাপ রোগনির্ণয়। এটা বলতে পারে বাজারে গড়ে কী হচ্ছে, বলতে পারে না কেন হচ্ছে বা কোথায় হচ্ছে।</p>

<p>একটা উদাহরণ দিলে পরিষ্কার হবে। ধরুন এক সপ্তাহে DSEX ৩% বাড়ল। এর পেছনে অন্তত তিনটা আলাদা গল্প থাকতে পারে, আর তিনটার মানে তিন রকম। এক, ব্যাংক খাতের বড় কোম্পানিগুলোর সুদের আয় বেড়েছে বলে ওগুলোর দাম উঠেছে, আর ওগুলোর ওজন বেশি বলে সূচকও উঠেছে; এখানে বাকি বাজার হয়তো নড়েইনি। দুই, বিদেশি বিনিয়োগ এসেছে বলে বড় আর তরল কোম্পানিগুলোতে চাহিদা বেড়েছে। তিন, দুই-তিনটা কোম্পানির শেয়ারে গুজব ছড়িয়ে দাম টেনে তোলা হয়েছে, যা বাংলাদেশে অচেনা ঘটনা নয়।</p>

<p>তিনটা ক্ষেত্রেই সূচকের সংখ্যাটা একই দেখাবে। এইজন্য সূচকের সঙ্গে সবসময় দুইটা জিনিস দেখতে হয়: লেনদেনের মোট পরিমাণ, আর কতগুলো কোম্পানির দাম বেড়েছে বনাম কতগুলোর কমেছে। যদি সূচক বাড়ে কিন্তু বেশিরভাগ কোম্পানির দাম কমে, তাহলে উত্থানটা কয়েকটা বড় নামের, বাজারের নয়। এই দুইটা সংখ্যাই ডিএসইর নিজের সাইটে প্রতিদিন থাকে।</p>

<h2>সূচক বাড়লেই আপনি লাভে নন</h2>

<p>এটা মনে রাখা জরুরি। DSEX যদি ২% বাড়ে আর আপনার পাঁচটা শেয়ারের চারটাই ছোট কোম্পানির হয়, আপনার পোর্টফোলিও পড়তেও পারে। সূচক বাজারের গড়, আর গড়ের ভেতরে সবাই থাকে না।</p>

<p>এইজন্যই সূচক দুইটা কাজে লাগে: এক, নিজের ফলাফল তুলনা করার মাপকাঠি হিসেবে, আর দুই, বাজারের মেজাজ বোঝার জন্য। বছরে যদি DSEX ১২% বাড়ে আর আপনার পোর্টফোলিও ৬%, তাহলে আপনার শেয়ার বাছাই আপনার ক্ষতি করেছে, লাভ নয়, যদিও সংখ্যাটা সবুজ।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("index-quiz")}

<p>পরের লেখাটা সেই দরজা নিয়ে যা দিয়ে আপনি এই বাজারে ঢোকেন: <a class="term" href="/money/terms/bo-account.html">বিও অ্যাকাউন্ট</a>।</p>
`,
  en: `
<p>The news says "the index rose 48 points today". What is an index, and what does 48 points mean?</p>

<p>An index is an attempt to say how the whole market did in one number. Over three hundred companies are listed on DSE. Every day some rise and some fall. To answer "how did the market do" you have to combine them into an average, and that is what an index is.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>DSEX is the headline index, covering nearly all of DSE.</li>
<li>It is not a simple average: bigger companies weigh more.</li>
<li>Points mean nothing on their own; the percentage change does.</li>
<li>DS30 covers thirty large companies; DSES covers Shariah-compliant ones.</li>
<li>The index rising does not mean your shares rose.</li>
</ul>
</div>

<h2>Why weighting exists</h2>

<p>If every company counted equally, a small company rising 20% would move the index as much as Grameenphone rising 20%. But Grameenphone is a much larger part of the market, so it genuinely is a larger part of the answer to "how did the market do".</p>

<p>So DSEX weights by <a class="term" href="/money/terms/market-cap.html">market capitalisation</a>, using the free float: only the shares actually in public hands are counted. Shares locked away with the government or a founding family are excluded.</p>

${mount("index-stack")}

<h2>Points against percent</h2>

<p>This is where news language misleads. "The index fell 100 points" sounds alarming, and if the index is at 6,500 that is 1.5%, an ordinary day. If the index is at 1,500, a hundred points is 6.7%, which is a crash.</p>

${mount("index-reveal")}

<p>So always think in percent. The point figure means something only when you know where the index stands.</p>

<h2>Bangladesh's indices</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>Index</th><th>What it measures</th><th>When it is useful</th></tr>
</thead>
<tbody>
<tr><td>DSEX</td><td>Nearly all of DSE, weighted</td><td>How the whole market went</td></tr>
<tr><td>DS30</td><td>Thirty large, liquid companies</td><td>How the big companies are doing</td></tr>
<tr><td>DSES</td><td>Shariah-compliant companies</td><td>Looking for interest-free investment</td></tr>
<tr><td>CSCX, CASPI</td><td>Chittagong exchange's own</td><td>Rarely used</td></tr>
</tbody>
</table>
</div>

<div class="note">DSEX started in 2013; before it there was an index called DGEN. So the numbers quoted for the 2010 crash are DGEN's, not DSEX's. Putting the two on one line gives a false picture, and a lot of writing does exactly that.</div>

<h2>What an index can and cannot tell you</h2>

<p>An index is a good thermometer and a poor diagnosis. It says what is happening on average; it does not say why, or where.</p>

<p>An example makes it clear. Suppose DSEX rises 3% in a week. At least three different stories could sit behind that, and they mean three different things. One: interest income at the large banks rose, their prices went up, and because they carry weight the index went up with them, while the rest of the market did not move at all. Two: foreign money arrived and pushed demand into the large, liquid names. Three: rumours were spread around two or three shares and their prices were pulled up, which is not an unfamiliar event here.</p>

<p>In all three the index number looks identical. So the index is always read next to two other things: total turnover, and how many companies rose against how many fell. If the index rises while most companies fall, the rise belongs to a few large names rather than to the market. Both numbers are on DSE's own site every day.</p>

<h2>The index rising does not mean you gained</h2>

<p>Worth remembering. If DSEX rises 2% and four of your five holdings are small companies, your portfolio can still fall. The index is the market's average, and not everybody lives inside an average.</p>

<p>Which leaves the index two real uses: as a yardstick for your own result, and as a read on the market's mood. If DSEX rose 12% in a year and your portfolio rose 6%, your share picking cost you money rather than making it, however green the number looks.</p>

<h2>Check yourself</h2>

${mount("index-quiz")}

<p>Next, the door you walk through to get into this market: the <a class="term" href="/money/terms/bo-account.html">BO account</a>.</p>
`,
  blocks: {
    "index-stack": {
      kind: "figure",
      shape: "stack",
      title: { bn: "ওজন দেওয়া সূচক কেমন দেখতে", en: "What a weighted index looks like" },
      parts: [
        { text: { bn: "সবচেয়ে বড় দশটা কোম্পানি", en: "The ten largest companies" }, note: { bn: "সংখ্যায় ৩%, ওজনে প্রায় অর্ধেক", en: "3% of the names, near half the weight" }, value: 48, tone: "lead" },
        { text: { bn: "পরের চল্লিশটা", en: "The next forty" }, value: 30, tone: "plain" },
        { text: { bn: "বাকি আড়াইশোর বেশি", en: "The remaining 250 plus" }, note: { bn: "সংখ্যায় বেশিরভাগ, ওজনে সামান্য", en: "Most of the names, little of the weight" }, value: 22, tone: "warn" },
      ],
      caption: {
        bn: "এইজন্যই একটা বড় কোম্পানির খবর গোটা সূচক নাড়িয়ে দিতে পারে, আর একশোটা ছোট কোম্পানির ভালো দিন সূচকে প্রায় দেখাই যায় না।",
        en: "This is why news about one large company can move the whole index, while a good day for a hundred small ones barely shows.",
      },
    },
    "index-reveal": {
      kind: "reveal",
      title: { bn: "কোন দিনটা খারাপ", en: "Which day was worse" },
      ask: {
        bn: "দিন ক: সূচক ৬,৪০০ থেকে ৬,৩০০ এ নামল, ১০০ পয়েন্ট। দিন খ: সূচক ১,৪০০ থেকে ১,৩৪০ এ নামল, ৬০ পয়েন্ট। কোন দিনটা বাজারের জন্য খারাপ?",
        en: "Day A: the index goes from 6,400 to 6,300, down 100 points. Day B: from 1,400 to 1,340, down 60 points. Which was the worse day?",
      },
      choices: [
        { bn: "দিন ক, কারণ ১০০ পয়েন্ট বেশি", en: "Day A, because 100 points is more" },
        { bn: "দিন খ", en: "Day B" },
        { bn: "দুইটা সমান", en: "The same" },
      ],
      answer: {
        bn: "দিন খ, প্রায় তিন গুণ খারাপ: ৪.৩% বনাম ১.৬%।",
        en: "Day B, and by nearly three times: 4.3% against 1.6%.",
      },
      why: {
        bn: "৬,৪০০ এর ১০০ পয়েন্ট হলো ১.৬%, যা একটা সাধারণ দিন। ১,৪০০ এর ৬০ পয়েন্ট হলো ৪.৩%, যা একটা বড় পতন। সূচকের পয়েন্ট নিজে কোনো একক নয়, এটা কেবল একটা শুরুর তারিখের সাপেক্ষে হিসাব করা সংখ্যা। DSEX এর ভিত্তি ছিল ২০১৩ সালের একটা দিনে ৪,০০০, আর ওই সংখ্যাটা কেউ বেছে নিয়েছিলেন, ওটার আলাদা কোনো অর্থ নেই। এইজন্যই দুইটা দেশের সূচক পয়েন্টে তুলনা করা অর্থহীন: ভারতের সেনসেক্স আর ডিএসইএক্স আলাদা ভিত্তি থেকে শুরু হয়েছে।",
        en: "A hundred points on 6,400 is 1.6%, an ordinary day. Sixty points on 1,400 is 4.3%, a large fall. Index points are not a unit; they are a number computed against a chosen start date. DSEX was set at 4,000 on a day in 2013, and somebody picked that figure: it has no meaning of its own. Which is also why comparing two countries' indices in points is meaningless: India's Sensex and DSEX started from different bases.",
      },
    },
    "index-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "DSEX এই বছর ১৪% বেড়েছে আর আপনার পোর্টফোলিও ৭%। কীভাবে দেখবেন?",
            en: "DSEX rose 14% this year and your portfolio rose 7%. How should you read that?",
          },
          options: [
            {
              text: { bn: "ভালো বছর, ৭% তো লাভ", en: "A good year: 7% is a gain" },
              why: {
                bn: "সংখ্যাটা সবুজ, ঠিক। কিন্তু আপনি যদি কেবল একটা সূচক ফান্ড কিনে বসে থাকতেন, ১৪% পেতেন। মানে আপনার বাছাই আপনার ৭% খরচ করেছে।",
                en: "The number is green, yes. But had you simply bought an index fund and done nothing you would have had 14%. Your picking cost you seven points.",
              },
            },
            {
              text: { bn: "বাজারের চেয়ে খারাপ করেছেন, আর তার কারণ খোঁজা উচিত", en: "You did worse than the market, and it is worth finding out why" },
              right: true,
              why: {
                bn: "ঠিক। কারণটা তিনটার একটা হতে পারে: বাছাই খারাপ, খরচ বেশি, বা অনেক টাকা নগদে বসে ছিল। তিনটাই ঠিক করা যায়, কিন্তু আগে জানতে হবে কোনটা।",
                en: "Right. The cause is usually one of three: poor picks, high costs, or a lot of cash sitting idle. All three are fixable once you know which it was.",
              },
            },
            {
              text: { bn: "সূচকের সঙ্গে তুলনা করা অন্যায্য", en: "Comparing to the index is unfair" },
              why: {
                bn: "উল্টো, ওটাই একমাত্র ন্যায্য তুলনা। বিকল্পটা সত্যিকারের: আপনি চাইলেই একটা সূচক ফান্ড কিনতে পারতেন, তাই সূচকই আপনার প্রকৃত প্রতিদ্বন্দ্বী।",
                en: "The opposite: it is the only fair comparison. The alternative is real, since you could simply have bought an index fund, so the index is your actual competitor.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "সূচকে বড় কোম্পানিগুলোর ওজন বেশি কেন?",
            en: "Why do large companies weigh more in the index?",
          },
          options: [
            {
              text: { bn: "কারণ ওগুলো ভালো কোম্পানি", en: "Because they are better companies" },
              why: {
                bn: "ওজনের সঙ্গে মানের কোনো সম্পর্ক নেই। একটা বড় খারাপ কোম্পানিরও ওজন বেশি হবে।",
                en: "Weight has nothing to do with quality. A large bad company still carries a large weight.",
              },
            },
            {
              text: { bn: "কারণ বাজারের টাকার বেশি অংশ ওগুলোতে আছে", en: "Because more of the market's money sits in them" },
              right: true,
              why: {
                bn: "ঠিক। সূচকের কাজ হলো বলা 'বাজারে থাকা টাকার কী হলো', আর যেখানে বেশি টাকা সেখানকার বদল বেশি গুরুত্বপূর্ণ। এইজন্যই ভাসমান শেয়ারের ওজন ধরা হয়, মোট শেয়ারের নয়।",
                en: "Right. The index answers the question of what happened to the money in the market, and a change where more money sits matters more. That is also why the free float is used rather than total shares.",
              },
            },
            {
              text: { bn: "কারণ ওগুলোর দাম বেশি", en: "Because their share prices are higher" },
              why: {
                bn: "দাম আর আকার এক জিনিস না, আর শেয়ারের লেখাটায় সেটা দেখা গেছে। ওজন হয় বাজারমূল্যে, দামে নয়।",
                en: "Price and size are different things, as the share lesson showed. The weight comes from market capitalisation, not price.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"bo-account": {
  bn: `
<p>বিও অ্যাকাউন্ট, পুরো নাম বেনিফিশিয়ারি ওনার্স অ্যাকাউন্ট, হলো সেই জায়গা যেখানে আপনার শেয়ার জমা থাকে। ব্যাংক অ্যাকাউন্টে যেভাবে টাকা থাকে, ঠিক সেভাবেই।</p>

<p>শব্দটার মধ্যেই সবচেয়ে গুরুত্বপূর্ণ তথ্যটা আছে, আর সেটা মানুষ খেয়াল করেন না: বেনিফিশিয়ারি ওনার, অর্থাৎ প্রকৃত মালিক। আইনগতভাবে শেয়ারগুলোর নিবন্ধন থাকে সিডিবিএলের নামে, কিন্তু প্রকৃত মালিক আপনি, আর সেই মালিকানার রেকর্ডটাই এই অ্যাকাউন্ট। ব্রোকারেজ হাউস এই অ্যাকাউন্টের দেখাশোনা করে, কিন্তু শেয়ারগুলো তার নয়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>শেয়ার জমা থাকে সিডিবিএলে, ব্রোকারের কাছে নয়।</li>
<li>ব্রোকারেজ হাউস বন্ধ হলে শেয়ার হারায় না, অন্য হাউসে সরানো যায়।</li>
<li>একটা মানুষ একাধিক বিও অ্যাকাউন্ট রাখতে পারেন, তবে আইপিওতে সীমা আছে।</li>
<li>বছরে একবার রক্ষণাবেক্ষণ ফি দিতে হয়, না দিলে অ্যাকাউন্ট নিষ্ক্রিয় হয়।</li>
<li>নমিনি ছাড়া অ্যাকাউন্ট খোলা যায়, আর কখনো খোলা উচিত নয়।</li>
</ul>
</div>

<h2>কোথায় কী থাকে</h2>

<p>এই ছবিটা একবার মাথায় ঢুকে গেলে অনেক দুশ্চিন্তা কমে যায়, কারণ বাংলাদেশে ব্রোকারেজ হাউস নিয়ে দুঃসংবাদ আসে।</p>

${mount("bo-figure")}

<p>সিডিবিএল, সেন্ট্রাল ডিপোজিটরি বাংলাদেশ লিমিটেড, ২০০৩ সাল থেকে দেশের সব তালিকাভুক্ত শেয়ারের ইলেকট্রনিক রেকর্ড রাখে। তার আগে শেয়ার ছিল কাগজের সার্টিফিকেট, যা হারাত, নকল হতো আর হস্তান্তরে মাস লাগত। ওই দিনগুলো ফিরিয়ে আনার কোনো কারণ নেই।</p>

<p>ব্রোকারেজ হাউস আপনার হয়ে তিনটা কাজ করে: অর্ডার পাঠায়, টাকা রাখে আর নিষ্পত্তি সামলায়, আর আপনার অ্যাকাউন্টের বিবরণী দেয়। শেয়ার রাখার কাজটা তার নয়, আর এই বিভাজনটাই আপনার সুরক্ষা।</p>

<div class="ex"><b>উদাহরণ:</b> ধরুন আপনার ব্রোকারেজ হাউস লাইসেন্স হারাল বা ব্যবসা বন্ধ করে দিল। আপনার শেয়ারগুলো সিডিবিএলের খাতায় আপনার বিও নম্বরের নিচে ঠিক যেমন ছিল তেমনই থাকবে। আপনি অন্য একটা হাউসে গিয়ে হস্তান্তরের আবেদন করবেন, প্রক্রিয়াটায় কয়েক সপ্তাহ লাগতে পারে, আর শেয়ারগুলো আপনারই থাকবে। যা ঝুঁকিতে থাকে তা হলো ব্রোকারের কাছে ফেলে রাখা নগদ টাকা, শেয়ার নয়। এইজন্যই বড় অঙ্কের নগদ ব্রোকারের কাছে না রাখাই ভালো অভ্যাস।</div>

<h2>খরচ কী কী</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>খরচ</th><th>কত</th><th>কখন</th></tr>
</thead>
<tbody>
<tr><td>অ্যাকাউন্ট খোলা</td><td>সাধারণত ৪০০ থেকে ৮০০ টাকা</td><td>একবার</td></tr>
<tr><td>বার্ষিক রক্ষণাবেক্ষণ</td><td>সাধারণত ৪৫০ টাকার মতো</td><td>প্রতি বছর</td></tr>
<tr><td>লেনদেনে কমিশন</td><td>০.৩% থেকে ০.৫%, প্রতি দিকে</td><td>প্রতিবার কেনা ও বেচায়</td></tr>
<tr><td>শেয়ার হস্তান্তর</td><td>সিডিবিএলের নিজস্ব ফি</td><td>অন্য অ্যাকাউন্টে সরালে</td></tr>
</tbody>
</table>
</div>

<p>স্থির খরচ দুইটা ছোট, আর কমিশনটাই আসল। বছরে দুইবার কেনাবেচা করলে কমিশন প্রায় অদৃশ্য; মাসে দুইবার করলে কমিশনই আপনার প্রধান খরচ হয়ে দাঁড়ায়। এই একটা সংখ্যাই আপনার নিয়ন্ত্রণে, আর এটাই সবচেয়ে বেশি অবহেলিত।</p>

<h2>একাধিক অ্যাকাউন্ট</h2>

<p>একজন মানুষ একাধিক বিও অ্যাকাউন্ট খুলতে পারেন, ভিন্ন ভিন্ন ব্রোকারেজ হাউসে। কেউ কেউ করেন, কারণ এক হাউসের অ্যাপ ভালো আর আরেক হাউসের গবেষণা ভালো।</p>

<p>তবে একটা জিনিস মনে রাখা দরকার। আইপিওতে আবেদনের ক্ষেত্রে নিয়ম আছে যে একই এনআইডির বিপরীতে একাধিক আবেদন করা যায় না, তাই দশটা অ্যাকাউন্ট খুলে দশটা আবেদন করার কোনো উপায় নেই। ২০১০ সালের আগে এই ফাঁকটা ছিল আর অনেকে ব্যবহার করতেন; এখন সিডিবিএল এনআইডি ধরে মিলিয়ে দেখে।</p>

<div class="note">নিষ্ক্রিয় অ্যাকাউন্ট সমস্যা তৈরি করে। বার্ষিক ফি না দিলে অ্যাকাউন্ট বন্ধ হয়ে যেতে পারে আর তাতে শেয়ার আটকে থাকে। যে অ্যাকাউন্টটা ব্যবহার করছেন না, সেটা আনুষ্ঠানিকভাবে বন্ধ করে দিন বা শেয়ার সরিয়ে নিন। একাধিক খোলার আগে ভাবুন প্রতিটার জন্য বছরে সাড়ে চারশো টাকা করে দিতে হবে, চিরকাল।</div>

<h2>নিজের হিসাব মিলিয়ে দেখা</h2>

<p>এই অভ্যাসটা বাংলাদেশে বিশেষভাবে গুরুত্বপূর্ণ। ব্রোকারের অ্যাপ যা দেখায় আর সিডিবিএলের খাতায় যা আছে, দুইটা মেলা উচিত, আর মাঝে মাঝে মেলে না।</p>

<p>সিডিবিএল বিনিয়োগকারীদের জন্য নিজস্ব সুবিধা রাখে যেখানে আপনি নিজের বিও নম্বর দিয়ে নিজের শেয়ারের হিসাব দেখতে পারেন। বছরে অন্তত দুইবার দেখুন। বাংলাদেশে যত অনিয়মের ঘটনা ধরা পড়েছে, তার একটা বড় অংশ ধরা পড়েছে ঠিক এভাবেই: একজন বিনিয়োগকারী নিজের হিসাব মিলিয়ে দেখে বুঝেছেন সংখ্যা মিলছে না।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("bo-quiz")}

<p>অ্যাকাউন্টটা খোলা হয় যার মাধ্যমে, পরের লেখাটা তাকে নিয়ে: <a class="term" href="/money/terms/broker.html">ব্রোকার</a>।</p>
`,
  en: `
<p>A BO account, a Beneficiary Owner's account, is where your shares are held, in the same sense that a bank account is where your money is held.</p>

<p>The most important fact is inside the name and people miss it: beneficiary owner, the real owner. Legally the shares are registered to CDBL, and the beneficial owner is you, and this account is the record of that ownership. The brokerage house services the account; the shares are not its.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Shares are held at CDBL, not by the broker.</li>
<li>If a brokerage closes the shares are not lost; they move to another house.</li>
<li>One person may hold several BO accounts, though IPO applications are capped.</li>
<li>An annual maintenance fee is due, and an unpaid account goes dormant.</li>
<li>You can open one without a nominee, and you never should.</li>
</ul>
</div>

<h2>What sits where</h2>

<p>Getting this picture straight removes a lot of worry, because bad news about brokerage houses does arrive in Bangladesh.</p>

${mount("bo-figure")}

<p>CDBL, Central Depository Bangladesh Limited, has kept the electronic record of every listed share since 2003. Before that shares were paper certificates that got lost, got forged, and took months to transfer. There is no case for going back.</p>

<p>The brokerage house does three things for you: it routes orders, it holds cash and handles settlement, and it gives you statements. Holding the shares is not one of them, and that division is your protection.</p>

<div class="ex"><b>Example:</b> Suppose your brokerage loses its licence or shuts down. Your shares sit in CDBL's books under your BO number exactly as they did. You go to another house and apply for a transfer; it may take some weeks; the shares stay yours throughout. What is at risk is cash left with the broker, not shares. Which is why not leaving large cash balances with a broker is a good habit.</div>

<h2>What it costs</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>Cost</th><th>How much</th><th>When</th></tr>
</thead>
<tbody>
<tr><td>Opening the account</td><td>Usually 400 to 800 taka</td><td>Once</td></tr>
<tr><td>Annual maintenance</td><td>Around 450 taka</td><td>Every year</td></tr>
<tr><td>Trading commission</td><td>0.3% to 0.5%, each way</td><td>Every buy and every sell</td></tr>
<tr><td>Share transfer</td><td>CDBL's own fee</td><td>Moving to another account</td></tr>
</tbody>
</table>
</div>

<p>The two fixed costs are small; commission is the real one. Trade twice a year and it nearly disappears; trade twice a month and it becomes your largest expense. It is the one number you control and the one most often ignored.</p>

<h2>More than one account</h2>

<p>A person may hold several BO accounts at different brokerage houses, and some do, because one house has the better app and another the better research.</p>

<p>One thing to know: IPO rules prevent multiple applications against the same NID, so there is no way to open ten accounts and file ten applications. That loophole existed before 2010 and was widely used; CDBL matches on NID now.</p>

<div class="note">Dormant accounts cause trouble. Skip the annual fee and an account can be closed with shares stuck inside it. Formally close what you are not using, or move the shares out. Before opening a second one, remember it costs about 450 taka a year, forever.</div>

<h2>Reconciling your own holdings</h2>

<p>This habit matters particularly here. What the broker's app shows and what CDBL's books say should agree, and occasionally they do not.</p>

<p>CDBL runs its own investor service where you can look up your holdings against your BO number. Check it at least twice a year. A good share of the irregularities ever uncovered in this market were uncovered exactly this way, by an investor reconciling and finding the numbers did not match.</p>

<h2>Check yourself</h2>

${mount("bo-quiz")}

<p>The account is opened through somebody, and the next lesson is about them: the <a class="term" href="/money/terms/broker.html">broker</a>.</p>
`,
  blocks: {
    "bo-figure": {
      kind: "figure",
      shape: "tree",
      title: { bn: "কে কী রাখে", en: "Who holds what" },
      screen: { title: { bn: "আপনার শেয়ার", en: "Your shares" } },
      parts: [
        {
          text: { bn: "সিডিবিএল", en: "CDBL" },
          note: { bn: "শেয়ারের ইলেকট্রনিক রেকর্ড, আপনার বিও নম্বরের নিচে। ব্রোকার বদলালেও এটা বদলায় না।", en: "The electronic record, under your BO number. Changing broker does not move it." },
          tone: "good",
        },
        {
          text: { bn: "ব্রোকারেজ হাউস", en: "The brokerage house" },
          note: { bn: "অর্ডার পাঠায়, নগদ রাখে, বিবরণী দেয়। শেয়ার তার কাছে নেই।", en: "Routes orders, holds cash, issues statements. Does not hold shares." },
          tone: "plain",
        },
        {
          text: { bn: "ডিএসই", en: "DSE" },
          note: { bn: "কেবল মিলিয়ে দেয়, কিছু রাখে না।", en: "Matches only, holds nothing." },
          tone: "plain",
        },
        {
          text: { bn: "আপনার ব্যাংক", en: "Your bank" },
          note: { bn: "টাকা, শেয়ার নয়। বিক্রির টাকা এখানেই ফেরত আসে।", en: "The money, not the shares. Sale proceeds come back here." },
          tone: "plain",
        },
      ],
      caption: {
        bn: "চারটা আলাদা প্রতিষ্ঠান, আর সেই আলাদা থাকাটাই ব্যবস্থার সুরক্ষা।",
        en: "Four separate institutions, and their separateness is the safety in the system.",
      },
    },
    "bo-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "বিও অ্যাকাউন্টে কী থাকে?",
            en: "What does a BO account hold?",
          },
          options: [
            {
              text: { bn: "আপনার শেয়ারের ইলেকট্রনিক রেকর্ড", en: "The electronic record of your shares" },
              right: true,
              why: {
                bn: "ঠিক। রেকর্ডটা সিডিবিএলের খাতায় থাকে আর আপনার বিও নম্বর সেটার চাবি। কাগজের সার্টিফিকেট ২০০৩ সালের পর আর নেই।",
                en: "Right. The record lives in CDBL's books and your BO number is the key to it. Paper certificates ended in 2003.",
              },
            },
            {
              text: { bn: "আপনার নগদ টাকা", en: "Your cash" },
              why: {
                bn: "নগদ ব্রোকারের কাছে একটা আলাদা হিসাবে থাকে, বিও অ্যাকাউন্টে নয়। এই পার্থক্যটা গুরুত্বপূর্ণ: ব্রোকার বিপদে পড়লে ঝুঁকিতে থাকে ওই নগদটাই।",
                en: "Cash sits in a separate ledger at the broker, not in the BO account. The difference matters: if a broker gets into trouble it is the cash that is exposed.",
              },
            },
            {
              text: { bn: "শেয়ারের কাগজের সার্টিফিকেট", en: "Paper share certificates" },
              why: {
                bn: "না, আর সেটাই এই ব্যবস্থার পুরো উদ্দেশ্য। কাগজ হারাত, নকল হতো, আর হস্তান্তরে মাস লাগত।",
                en: "No, and avoiding those is the entire point of the system. Paper got lost, got forged, and took months to transfer.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "নিষ্ক্রিয় বিও অ্যাকাউন্টে কী সমস্যা?",
            en: "What is the problem with a dormant BO account?",
          },
          options: [
            {
              text: { bn: "কোনো সমস্যা নেই, ফেলে রাখলেই হয়", en: "None: just leave it there" },
              why: {
                bn: "বার্ষিক ফি চলতে থাকে, আর না দিলে অ্যাকাউন্ট বন্ধ হয়ে ভেতরের শেয়ার আটকে যেতে পারে। ফেলে রাখা বিনামূল্যে নয়।",
                en: "The annual fee keeps running, and unpaid it can close the account with shares stuck inside. Leaving it is not free.",
              },
            },
            {
              text: { bn: "ফি জমতে থাকে আর অ্যাকাউন্ট বন্ধ হয়ে শেয়ার আটকে যেতে পারে", en: "Fees accumulate and the account can close with shares trapped" },
              right: true,
              why: {
                bn: "ঠিক। ব্যবহার না করলে আনুষ্ঠানিকভাবে বন্ধ করুন বা শেয়ারগুলো অন্য অ্যাকাউন্টে সরান। দুইটাই কয়েক দিনের কাজ, আর পরে ঠিক করার চেয়ে সহজ।",
                en: "Right. If you are not using it, close it formally or move the shares to another account. Either takes a few days and beats sorting it out later.",
              },
            },
            {
              text: { bn: "সিডিবিএল শেয়ারগুলো বেচে দেয়", en: "CDBL sells the shares" },
              why: {
                bn: "না, কেউ আপনার শেয়ার বেচে না। শেয়ার আপনারই থাকে, কেবল পৌঁছানো কঠিন হয়ে যায়।",
                en: "No: nobody sells your shares. They stay yours, they simply become hard to reach.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"broker": {
  bn: `
<p>ব্রোকার হলো আপনার আর শেয়ারবাজারের মাঝখানের লাইসেন্সধারী মধ্যস্থতাকারী। আপনি সরাসরি <a class="term" href="/money/terms/dse.html">ডিএসইতে</a> অর্ডার দিতে পারেন না; অর্ডারটা যায় একটা ব্রোকারেজ হাউসের মাধ্যমে, যারা এক্সচেঞ্জের সদস্য।</p>

<p>কেন এই মধ্যস্থতাকারী দরকার, সেটা বোঝা জরুরি, কারণ অনেকে ভাবেন এটা কেবল একটা অতিরিক্ত খরচের স্তর। কারণটা হলো নিষ্পত্তির দায়। আপনি যখন একটা শেয়ার কেনেন, কেউ একজনকে নিশ্চিত করতে হয় যে আপনার টাকা বিক্রেতার কাছে পৌঁছাবে আর তার শেয়ার আপনার কাছে পৌঁছাবে, দুই দিনের ভেতর, দুইজনের কেউ পালিয়ে গেলেও। এক্সচেঞ্জের সদস্য হাউসগুলো জামানত রাখে আর ওই দায়টা নেয়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ব্রোকার এক্সচেঞ্জের সদস্য আর বিএসইসির লাইসেন্সধারী।</li>
<li>আয় করে কমিশন থেকে, আর অনেকে মার্জিন ঋণের সুদ থেকেও।</li>
<li>মার্জিন ঋণে ব্রোকারের স্বার্থ আছে, আর সেটা মনে রাখা দরকার।</li>
<li>ব্রোকার আপনার শেয়ার রাখে না, সিডিবিএল রাখে।</li>
<li>ব্রোকার বদলানো যায়, আর বদলানোর প্রক্রিয়া কয়েক সপ্তাহের।</li>
</ul>
</div>

<h2>ব্রোকার আয় করে কীভাবে</h2>

<p>এটা জেনে রাখা দরকার, কারণ কে কোথা থেকে আয় করে তা জানলে তার পরামর্শ কোন দিকে ঝুঁকবে সেটাও বোঝা যায়।</p>

${mount("broker-stack")}

<p>প্রথম উৎসটা কমিশন, আর এখানে ব্রোকারের স্বার্থ হলো আপনি যত বেশি কেনাবেচা করেন। আপনার স্বার্থ ঠিক উল্টো: <a class="term" href="/money/basics-2/cost-of-churn.html">ঘন ঘন কেনাবেচা</a> আপনার রিটার্ন খায়। এই দ্বন্দ্বটা অসৎ নয়, এটা কেবল বাস্তব, আর জেনে রাখলে "এই শেয়ারটা বেচে ওইটা কিনুন" জাতীয় পরামর্শ শুনে আপনি একটা প্রশ্ন বেশি করবেন।</p>

<p>দ্বিতীয় উৎসটা <a class="term" href="/money/terms/margin-loan.html">মার্জিন ঋণের</a> সুদ, আর এখানে দ্বন্দ্বটা আরও তীব্র। ঋণ দিলে ব্রোকার সুদ পায় এবং আপনার লেনদেনও বাড়ে, তাই দুই দিক থেকেই লাভ। আপনার দিক থেকে ঋণ মানে ঝুঁকি দ্বিগুণ আর অপেক্ষা করার ক্ষমতা শূন্য।</p>

<div class="note">এর মানে এই নয় যে ব্রোকাররা প্রতারক। বেশিরভাগই নিয়ম মেনে কাজ করেন আর তাদের ছাড়া বাজারে ঢোকাই যায় না। কথাটা কেবল এই: যে আপনাকে পরামর্শ দিচ্ছে তার আয় কোথা থেকে আসে সেটা জানা থাকলে পরামর্শটা আরও ভালোভাবে ওজন করা যায়। এই একই নিয়ম ব্যাংকের বিনিয়োগ পরামর্শ আর বিমার এজেন্টের ক্ষেত্রেও খাটে।</div>

<h2>বাছাই করার সময় যা দেখবেন</h2>

${mount("broker-compare")}

<h2>যেসব কথায় সতর্ক হবেন</h2>

<p>নিচের বাক্যগুলো ব্রোকারেজ হাউসের অফিসে সত্যিই শোনা যায়। প্রতিটার পাশে কী ভাবা উচিত সেটা লেখা।</p>

<ul class="checklist">
<li>"আপনার হয়ে আমরাই কেনাবেচা করে দেব, আপনাকে কিছু দেখতে হবে না।" এটাকে বলে ডিসক্রিশনারি অ্যাকাউন্ট, আর নতুন বিনিয়োগকারীর জন্য এটা প্রায় সবসময়ই খারাপ। যিনি কমিশন থেকে আয় করেন তাকে কেনাবেচার সিদ্ধান্ত দিয়ে দেওয়া মানে গরুকে ক্ষেত পাহারা দিতে বলা।</li>
<li>"লিংক অ্যাকাউন্ট খুলে নিন, তাহলে দ্বিগুণ কিনতে পারবেন।" এটা মার্জিন ঋণ। প্রথম বছরে দরকার নেই, আর দরকার হলে পরেও খোলা যায়।</li>
<li>"এই শেয়ারটা এই সপ্তাহেই উঠবে, ভেতরের খবর আছে।" ভেতরের খবরের ভিত্তিতে লেনদেন বাংলাদেশে আইনত অপরাধ। আর যদি খবরটা সত্যিই থাকত, তিনি আপনাকে বলতেন না।</li>
<li>"আপনার পোর্টফোলিওটা একটু নাড়াচাড়া করা দরকার, অনেকদিন কিছু করেননি।" কিছু না করা প্রায়ই সঠিক সিদ্ধান্ত। নাড়াচাড়ার প্রয়োজন কোম্পানির খবর থেকে আসে, সময় পেরোনো থেকে নয়।</li>
<li>"আজকের মধ্যে সিদ্ধান্ত নিতে হবে।" শেয়ারবাজারে আজকের মধ্যে কিছুই নিতে হয় না। তাড়া নিজেই একটা সংকেত।</li>
</ul>

<h2>অভিযোগ কোথায় করবেন</h2>

<p>ব্রোকারের সঙ্গে সমস্যা হলে ধাপগুলো এই: প্রথমে হাউসের নিজের অভিযোগ কর্মকর্তার কাছে লিখিতভাবে, তারপর ডিএসইর কাছে, তারপর <a class="term" href="/money/basics-2/bsec.html">বিএসইসির</a> কাছে। লিখিত রাখা গুরুত্বপূর্ণ: ফোনের কথোপকথন প্রমাণ হয় না, আর প্রতিটা ধাপে আগের ধাপের কাগজ চাওয়া হয়।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("broker-quiz")}

<p>পরের লেখাটা সেই সংখ্যাটা নিয়ে যা দিয়ে কোম্পানির আসল আকার মাপা হয়: <a class="term" href="/money/terms/market-cap.html">বাজারমূল্য</a>।</p>
`,
  en: `
<p>A broker is the licensed intermediary between you and the market. You cannot place an order directly with the <a class="term" href="/money/terms/dse.html">DSE</a>; it goes through a brokerage house, which is a member of the exchange.</p>

<p>It is worth understanding why the intermediary exists, because many people see it as a layer of cost and nothing else. The reason is settlement. When you buy a share, somebody has to guarantee that your money reaches the seller and their share reaches you, within two days, even if one of you disappears. Member houses post collateral and carry that obligation.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A broker is a member of the exchange and licensed by BSEC.</li>
<li>They earn from commission, and many also from margin loan interest.</li>
<li>A broker has an interest in margin lending, which is worth remembering.</li>
<li>Brokers do not hold your shares; CDBL does.</li>
<li>You can change brokers, and it takes a few weeks.</li>
</ul>
</div>

<h2>How a broker earns</h2>

<p>Worth knowing, because knowing where somebody's income comes from tells you which way their advice will lean.</p>

${mount("broker-stack")}

<p>The first source is commission, and here the broker's interest is that you trade more. Yours is the opposite: <a class="term" href="/money/basics-2/cost-of-churn.html">frequent trading</a> eats your return. That conflict is not dishonest, it is simply real, and knowing it makes you ask one more question when you hear "sell this one and buy that one".</p>

<p>The second is interest on <a class="term" href="/money/terms/margin-loan.html">margin loans</a>, where the conflict is sharper. Lending earns interest and raises turnover, so it pays twice. From your side a loan doubles the risk and removes your ability to wait.</p>

<div class="note">None of this means brokers are crooks. Most work within the rules and you cannot reach the market without one. The point is only this: knowing where somebody's income comes from lets you weigh their advice properly. The same rule applies to a bank's investment advice and an insurance agent's.</div>

<h2>What to look at when choosing</h2>

${mount("broker-compare")}

<h2>Sentences to be careful about</h2>

<p>These are things genuinely said in brokerage offices, with what to think beside each.</p>

<ul class="checklist">
<li>"We will trade on your behalf so you do not have to watch anything." That is a discretionary account, and for a new investor it is almost always wrong. Handing trading decisions to somebody paid by commission is asking the fox to mind the hens.</li>
<li>"Open a linked account and you can buy twice as much." That is a margin loan. Not needed in a first year, and it can be opened later if it is ever wanted.</li>
<li>"This one will move this week, there is inside information." Trading on inside information is a criminal offence here. And if the information were real, they would not be telling you.</li>
<li>"Your portfolio needs some churn, you have not done anything for a while." Doing nothing is often correct. The need to act comes from company news, not from time passing.</li>
<li>"You have to decide today." Nothing in this market has to be decided today. Urgency is itself the signal.</li>
</ul>

<h2>Where complaints go</h2>

<p>If something goes wrong with a broker the steps are: in writing to the house's own compliance officer, then to DSE, then to <a class="term" href="/money/basics-2/bsec.html">BSEC</a>. Keeping it in writing matters: a phone call is not evidence, and each stage asks for the paperwork from the last one.</p>

<h2>Check yourself</h2>

${mount("broker-quiz")}

<p>Next, the number that actually measures a company's size: <a class="term" href="/money/terms/market-cap.html">market capitalisation</a>.</p>
`,
  blocks: {
    "broker-stack": {
      kind: "figure",
      shape: "stack",
      title: { bn: "একটা ব্রোকারেজ হাউসের আয়", en: "Where a brokerage house's income comes from" },
      parts: [
        { text: { bn: "লেনদেনের কমিশন", en: "Trading commission" }, note: { bn: "আপনি যত বেশি কেনাবেচা করেন, তত বেশি", en: "The more you trade, the more of it there is" }, value: 55, tone: "warn" },
        { text: { bn: "মার্জিন ঋণের সুদ", en: "Interest on margin loans" }, note: { bn: "আপনি ধার নিলে, আর ধারটা যত বড়", en: "If you borrow, and in proportion to how much" }, value: 30, tone: "bad" },
        { text: { bn: "অন্যান্য ফি ও সেবা", en: "Fees and other services" }, note: { bn: "অ্যাকাউন্ট ফি, আইপিও সেবা, গবেষণা", en: "Account fees, IPO services, research" }, value: 15, tone: "plain" },
      ],
      caption: {
        bn: "উপরের দুইটাই আপনার আচরণের সঙ্গে জড়িত, আর দুইটাতেই আপনার স্বার্থ উল্টো দিকে। এটা জেনে রাখা পরামর্শ ওজন করার সবচেয়ে সহজ উপায়।",
        en: "The top two both depend on how you behave, and in both your interest runs the other way. Knowing that is the simplest way to weigh the advice.",
      },
    },
    "broker-compare": {
      kind: "compare",
      title: { bn: "ব্রোকার বাছাই: কী দেখবেন", en: "Choosing a broker: what to weigh" },
      columns: [
        { bn: "যা দেখা হয়", en: "What people check" },
        { bn: "যা আসলে দেখা উচিত", en: "What actually matters" },
      ],
      rows: [
        {
          label: { bn: "কমিশন", en: "Commission" },
          cells: [
            { bn: "সবচেয়ে কম কে দেয়", en: "Who is cheapest" },
            { bn: "আপনি বছরে কতবার কেনাবেচা করবেন। দুইবার হলে পার্থক্য অর্থহীন।", en: "How often you will trade. At twice a year the difference is meaningless." },
          ],
          best: 1,
        },
        {
          label: { bn: "অ্যাপ", en: "The app" },
          cells: [
            { bn: "দেখতে কেমন", en: "How it looks" },
            { bn: "নিজে লিমিট অর্ডার দেওয়া যায় কি না, আর ব্যস্ত দিনে চলে কি না", en: "Whether you can place your own limit orders, and whether it works on a busy day" },
          ],
          best: 1,
        },
        {
          label: { bn: "গবেষণা প্রতিবেদন", en: "Research reports" },
          cells: [
            { bn: "কতগুলো দেয়", en: "How many they publish" },
            { bn: "কখনো বেচার সুপারিশ করে কি না", en: "Whether they ever say sell" },
          ],
          best: 1,
        },
        {
          label: { bn: "মার্জিন", en: "Margin" },
          cells: [
            { bn: "কত ঋণ দেয়", en: "How much they will lend" },
            { bn: "প্রথম দিনেই ঠেলে কি না, যা নিজেই একটা সতর্কতা", en: "Whether they push it on day one, which is itself a warning" },
          ],
          best: 1,
        },
        {
          label: { bn: "অভিযোগ", en: "Complaints" },
          cells: [
            { bn: "কেউ দেখে না", en: "Nobody checks" },
            { bn: "বিএসইসির প্রয়োগ আদেশে নামটা আছে কি না", en: "Whether the name appears in BSEC's enforcement orders" },
          ],
          best: 1,
        },
      ],
    },
    "broker-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার ব্রোকার প্রতি মাসে ফোন করে বলেন কোনটা বেচে কোনটা কিনতে। এতে কী ভাবা উচিত?",
            en: "Your broker phones every month suggesting what to sell and what to buy. What should you think?",
          },
          options: [
            {
              text: { bn: "ভালো সেবা, তিনি খেয়াল রাখছেন", en: "Good service: they are paying attention" },
              why: {
                bn: "হতে পারে, আর প্রতিটা পরামর্শে তার কমিশন আয় হয়। খেয়াল রাখা আর কমিশন আয় করা এখানে আলাদা করা কঠিন, আর সেটাই সমস্যা।",
                en: "Possibly, and every suggestion earns commission. Attention and income are hard to separate here, and that is the problem.",
              },
            },
            {
              text: { bn: "প্রতিটা পরামর্শে তার আয় হয়, তাই কারণটা জিজ্ঞেস করা দরকার", en: "Each suggestion pays them, so ask for the reason" },
              right: true,
              why: {
                bn: "ঠিক। প্রশ্নটা সহজ: এই বদলটা কেন? কোম্পানির কী বদলেছে? উত্তরটা যদি কোম্পানির খবর হয়, শোনার মতো। উত্তরটা যদি 'বাজারের অবস্থা' বা 'সুযোগ আছে' হয়, তাহলে সেটা কমিশন।",
                en: "Right. The question is simple: why this change, and what changed at the company? If the answer is company news, listen. If it is about market conditions in general, or a passing opportunity, it is commission.",
              },
            },
            {
              text: { bn: "সব পরামর্শ উপেক্ষা করা উচিত", en: "Ignore all of it" },
              why: {
                bn: "এতটাও না। অনেক হাউসের গবেষণা দল ভালো কাজ করে। কথাটা উপেক্ষা করার নয়, কারণ জিজ্ঞেস করার।",
                en: "Not that far. Plenty of houses have research teams doing real work. The point is not to ignore, it is to ask why.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "ব্রোকারের বিরুদ্ধে অভিযোগের প্রথম ধাপ কোনটা?",
            en: "What is the first step in a complaint against a broker?",
          },
          options: [
            {
              text: { bn: "সরাসরি বিএসইসিতে যাওয়া", en: "Go straight to BSEC" },
              why: {
                bn: "বিএসইসি সাধারণত জানতে চাইবে আপনি হাউসে আর ডিএসইতে অভিযোগ করেছেন কি না। ধাপ এড়িয়ে গেলে ফাইলটা ফেরত আসে।",
                en: "BSEC will normally ask whether you complained to the house and to DSE first. Skipping steps sends the file back.",
              },
            },
            {
              text: { bn: "হাউসের অভিযোগ কর্মকর্তার কাছে লিখিতভাবে", en: "In writing to the house's compliance officer" },
              right: true,
              why: {
                bn: "ঠিক, আর লিখিত হওয়াটাই মূল কথা। প্রতিটা পরের ধাপে আগের ধাপের কাগজ চাওয়া হয়, আর ফোনের কথোপকথন কোনো কাগজ নয়।",
                en: "Right, and in writing is the operative part. Every later stage asks for the paperwork from the earlier one, and a phone call is not paperwork.",
              },
            },
            {
              text: { bn: "ফেসবুকে পোস্ট করা", en: "Post about it on Facebook" },
              why: {
                bn: "মনোযোগ পেতে পারে, কিন্তু কোনো আনুষ্ঠানিক প্রক্রিয়া শুরু হয় না, আর মীমাংসার সময় লিখিত অভিযোগটাই লাগে।",
                en: "It may get attention and it starts no formal process, and a written complaint is what a resolution needs.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"market-cap": {
  bn: `
<p><a class="term" href="/money/terms/share.html">শেয়ারের</a> লেখায় একটা প্রশ্ন উঠেছিল: ১০ টাকার শেয়ার কি ৫০০ টাকার শেয়ারের চেয়ে সস্তা? উত্তর ছিল না, আর এই লেখাটা ব্যাখ্যা করে কেন, আর কোন সংখ্যাটা আসলে দেখতে হয়।</p>

<p>বাজারমূল্য, ইংরেজিতে market capitalisation বা সংক্ষেপে market cap, হলো একটা কোম্পানির সব শেয়ারের মোট দাম। হিসাবটা এক লাইনের: শেয়ারের দাম গুণ মোট শেয়ার সংখ্যা।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বাজারমূল্য = দাম × মোট শেয়ার সংখ্যা। কোম্পানির আকারের একমাত্র সৎ মাপ।</li>
<li>শেয়ারের দাম একা কিছুই বলে না, কেবল টুকরাগুলো কত ছোট তা বলে।</li>
<li>ভাসমান শেয়ার আলাদা: যতটা সাধারণ বিনিয়োগকারীর হাতে আছে।</li>
<li>বাজারমূল্য বাজারের মতামত, কোম্পানির নিজস্ব মূল্য নয়।</li>
<li>বড় কোম্পানি নিরাপদ নয়, কেবল বেশি পরিচিত আর বেশি তরল।</li>
</ul>
</div>

<h2>নিজে হিসাব করে দেখুন</h2>

${mount("cap-lab")}

<p>স্লাইডারগুলো নাড়ালে একটা জিনিস চোখে পড়বে: দাম অর্ধেক করে শেয়ার সংখ্যা দ্বিগুণ করলে বাজারমূল্য বদলায় না। এটাই বোনাস শেয়ার বা শেয়ার বিভাজনের পুরো ব্যাপারটা, আর <a class="term" href="/money/terms/bonus-rights.html">বোনাস ও রাইট শেয়ারের</a> লেখায় এটা আরও বিস্তারিত আছে।</p>

<h2>ভাসমান শেয়ার</h2>

<p>বাংলাদেশে এই অংশটা বিশেষভাবে গুরুত্বপূর্ণ। অনেক তালিকাভুক্ত কোম্পানিতে মোট শেয়ারের বেশিরভাগ থাকে প্রতিষ্ঠাতা পরিবার, সরকার বা বিদেশি মূল কোম্পানির হাতে, আর সেগুলো কেনাবেচা হয় না। যা বাকি থাকে, সেটাই ভাসমান শেয়ার, ইংরেজিতে free float।</p>

${mount("float-figure")}

<p>ভাসমান অংশ ছোট হলে দুইটা জিনিস হয়, আর দুইটাই আপনার জন্য খারাপ। এক, অল্প টাকার লেনদেনেই দাম অনেক নড়ে, তাই দামের গতিবিধি কোম্পানির খবরের চেয়ে ক্রেতা-বিক্রেতার ভিড়ের খবর বেশি বলে। দুই, দাম নিয়ন্ত্রণ করা সহজ হয়ে যায়: দশ কোটি টাকা দিয়ে একটা পাতলা শেয়ারের দাম টেনে তোলা যায়, একই টাকায় গ্রামীণফোনের দামে কিছুই হয় না।</p>

<div class="ex"><b>উদাহরণ:</b> ধরুন একটা কোম্পানির বাজারমূল্য ৬০০ কোটি টাকা শোনাচ্ছে, বেশ বড়। কিন্তু ৮৫% শেয়ার প্রতিষ্ঠাতা পরিবারের হাতে বন্ধ, তাই ভাসমান মাত্র ৯০ কোটি টাকার। দৈনিক লেনদেন হয়তো ৫০ লাখ টাকার। আপনি যদি ২০ লাখ টাকার পজিশন নেন, বেরোতে চাইলে আপনি একাই কয়েক দিনের লেনদেন, আর সেই দিনগুলোতে দাম আপনার বিরুদ্ধে যাবে। বাজারমূল্য বড় দেখলেও তারল্য ছোট।</div>

<h2>আকার দিয়ে ভাগ করা</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>শ্রেণি</th><th>বাংলাদেশে মোটামুটি</th><th>বৈশিষ্ট্য</th></tr>
</thead>
<tbody>
<tr><td>বড় (লার্জ ক্যাপ)</td><td>৫,০০০ কোটি টাকার বেশি</td><td>তরল, বেশি অনুসরণ করা, ধীরে বাড়ে</td></tr>
<tr><td>মাঝারি (মিড ক্যাপ)</td><td>৫০০ থেকে ৫,০০০ কোটি</td><td>কম অনুসরণ করা, বেশি ওঠানামা</td></tr>
<tr><td>ছোট (স্মল ক্যাপ)</td><td>৫০০ কোটির নিচে</td><td>পাতলা, দাম নিয়ন্ত্রণের ঝুঁকি বেশি</td></tr>
</tbody>
</table>
</div>

<div class="note">সীমারেখাগুলো আন্তর্জাতিক মানের নয়, বাংলাদেশের বাজারের আকারের সাপেক্ষে। যুক্তরাষ্ট্রে যা স্মল ক্যাপ, তা এখানে বাজারের বৃহত্তম কোম্পানির চেয়েও বড় হতে পারে। তুলনা করতে হলে একই বাজারের ভেতরে করুন।</div>

<h2>বড় মানে নিরাপদ নয়</h2>

<p>এই ভুল ধারণাটা সাধারণ। বড় কোম্পানি সাধারণত বেশি তরল, বেশি বিশ্লেষক অনুসরণ করেন, আর তার হিসাব বেশি মানুষ পড়েন, তাই বড় চমক কম আসে। কিন্তু বড় কোম্পানিও পড়ে, আর পড়লে অনেকটাই পড়ে। ২০১০ সালের পর বাংলাদেশের কিছু বৃহত্তম কোম্পানির শেয়ার বছরের পর বছর নিচে ছিল।</p>

<p>বাজারমূল্য একটা মাপ, রায় নয়। এটা বলে বাজার কোম্পানিটাকে কত দাম দিচ্ছে, বলে না কোম্পানিটা কত দাম পাওয়ার যোগ্য। ওই দ্বিতীয় প্রশ্নটাই <a class="term" href="/money/terms/pe-ratio.html">পিই রেশিও</a> আর পর্যায় ৩-এর বিষয়।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("cap-quiz")}
`,
  en: `
<p>The <a class="term" href="/money/terms/share.html">share</a> lesson raised a question: is a 10 taka share cheaper than a 500 taka one? The answer was no, and this lesson explains why, and which number you should be reading instead.</p>

<p>Market capitalisation, market cap, is the total price of all a company's shares. The arithmetic is one line: share price times the number of shares.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Market cap is price times share count. It is the only honest measure of size.</li>
<li>A share price on its own says nothing except how finely the pie was cut.</li>
<li>Free float is different: only what is actually in public hands.</li>
<li>Market cap is the market's opinion, not the company's own worth.</li>
<li>Big does not mean safe; it means better known and more liquid.</li>
</ul>
</div>

<h2>Work it out yourself</h2>

${mount("cap-lab")}

<p>Move the sliders and one thing stands out: halve the price and double the share count and the market cap does not change. That is the whole of a bonus share or a share split, and the <a class="term" href="/money/terms/bonus-rights.html">bonus and rights</a> lesson goes further into it.</p>

<h2>Free float</h2>

<p>This part matters particularly in Bangladesh. In many listed companies most of the shares sit with a founding family, the government or a foreign parent, and never trade. What is left is the free float.</p>

${mount("float-figure")}

<p>A small float does two things and both are bad for you. First, small amounts of money move the price a lot, so price movement tells you more about the crowd of buyers and sellers than about the company. Second, the price becomes easy to manipulate: ten crore taka can push a thin share around, while the same money does nothing to Grameenphone.</p>

<div class="ex"><b>Example:</b> A company shows a market cap of 600 crore taka, which sounds substantial. But 85% of the shares are locked up with the founding family, so the float is only 90 crore. Daily turnover might be 50 lakh taka. Take a 20 lakh position and getting out makes you several days of trading all by yourself, and the price moves against you on every one of them. Large market cap, small liquidity.</div>

<h2>Sorting by size</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>Class</th><th>Roughly, in Bangladesh</th><th>Character</th></tr>
</thead>
<tbody>
<tr><td>Large cap</td><td>Above 5,000 crore taka</td><td>Liquid, well followed, slower growing</td></tr>
<tr><td>Mid cap</td><td>500 to 5,000 crore</td><td>Less followed, more volatile</td></tr>
<tr><td>Small cap</td><td>Under 500 crore</td><td>Thin, more exposed to manipulation</td></tr>
</tbody>
</table>
</div>

<div class="note">These boundaries are not international standards; they are relative to the size of this market. What counts as small cap in the United States can be larger than the biggest company listed here. Compare within one market.</div>

<h2>Big does not mean safe</h2>

<p>The misconception is common. Large companies are usually more liquid, followed by more analysts and read by more people, so they spring fewer surprises. Large companies still fall, and when they fall they fall a long way. Several of Bangladesh's largest listed companies spent years below their 2010 prices.</p>

<p>Market cap is a measurement, not a verdict. It says what the market is paying for a company; it does not say what the company is worth. That second question belongs to the <a class="term" href="/money/terms/pe-ratio.html">P/E ratio</a> and to stage 3.</p>

<h2>Check yourself</h2>

${mount("cap-quiz")}
`,
  blocks: {
    "cap-lab": {
      kind: "lab",
      model: "market-cap",
      title: { bn: "দাম, শেয়ার সংখ্যা আর আকার", en: "Price, count and size" },
      note: {
        bn: "দাম অর্ধেক করে শেয়ার সংখ্যা দ্বিগুণ করে দেখুন। বাজারমূল্য নড়ে না।",
        en: "Halve the price and double the count. The market cap does not move.",
      },
      preset: { price: 45, shares: 12, float: 30 },
    },
    "float-figure": {
      kind: "figure",
      shape: "stack",
      title: { bn: "একটা সাধারণ বাংলাদেশি কোম্পানির শেয়ার কার হাতে", en: "Who holds a typical Bangladeshi company's shares" },
      parts: [
        { text: { bn: "প্রতিষ্ঠাতা ও পরিচালকরা", en: "Sponsors and directors" }, note: { bn: "নিয়ম অনুযায়ী একটা অংশ ধরে রাখতেই হয়", en: "The rules require them to hold a slab" }, value: 45, tone: "plain" },
        { text: { bn: "প্রাতিষ্ঠানিক বিনিয়োগকারী", en: "Institutions" }, note: { bn: "ফান্ড, বিমা, আইসিবি। কমই বেচে।", en: "Funds, insurers, ICB. They rarely sell." }, value: 25, tone: "plain" },
        { text: { bn: "সাধারণ বিনিয়োগকারী, ভাসমান", en: "The public, the free float" }, note: { bn: "প্রতিদিনের দাম যা দিয়ে ঠিক হয়", en: "The part that sets the price every day" }, value: 30, tone: "lead" },
      ],
      caption: {
        bn: "দৈনিক দাম ঠিক হয় কেবল শেষ ভাগটা দিয়ে। ভাগটা যত ছোট, দাম তত সহজে নড়ে।",
        en: "The daily price is set by that last slice alone. The smaller it is, the more easily the price moves.",
      },
    },
    "cap-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানি প্রতিটা শেয়ারের বিপরীতে একটা বোনাস শেয়ার দিল। শেয়ারের দাম ১০০ থেকে ৫০ হয়ে গেল। আপনার সম্পদের কী হলো?",
            en: "A company issues one bonus share for each share held, and the price goes from 100 to 50. What happened to your wealth?",
          },
          options: [
            {
              text: { bn: "অর্ধেক হয়ে গেল", en: "It halved" },
              why: {
                bn: "না। আপনার শেয়ার সংখ্যা দ্বিগুণ হয়েছে আর দাম অর্ধেক, তাই মোট মূল্য একই। ১০০টা শেয়ার ১০০ টাকায় হলো ১০,০০০; ২০০টা শেয়ার ৫০ টাকায়ও ১০,০০০।",
                en: "No. Your share count doubled and the price halved, so the total is unchanged. 100 shares at 100 is 10,000; 200 shares at 50 is also 10,000.",
              },
            },
            {
              text: { bn: "কিছুই হয়নি, কেবল টুকরার সংখ্যা বেড়েছে", en: "Nothing: only the number of pieces changed" },
              right: true,
              why: {
                bn: "ঠিক। বাজারমূল্য একই থেকেছে, আর সেটাই আসল সংখ্যা। বোনাস শেয়ার সম্পদ তৈরি করে না, কেবল পাইটা আরও ছোট টুকরায় কাটে। তবু বাংলাদেশে বোনাস ঘোষণার দিনে দাম বাড়ে, আর সেটা মানুষের ভুল বোঝার ফল।",
                en: "Right. The market cap did not move, and that is the real number. A bonus share creates no wealth, it cuts the pie into smaller slices. Prices still rise on bonus announcements here, and that is a misunderstanding at work.",
              },
            },
            {
              text: { bn: "দ্বিগুণ হয়ে গেল", en: "It doubled" },
              why: {
                bn: "না। দ্বিগুণ হতো যদি দাম ১০০ টাকাই থাকত, আর সেটা হয় না: বাজার দাম সমন্বয় করে দেয় ঠিক সেদিনই।",
                en: "No. It would have doubled if the price stayed at 100, and it does not: the market adjusts the price on the day.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "দুইটা কোম্পানির বাজারমূল্য একই, ৮০০ কোটি টাকা। প্রথমটার ভাসমান ৬০%, দ্বিতীয়টার ১২%। নতুন বিনিয়োগকারীর জন্য কোনটা বেশি ঝুঁকিপূর্ণ?",
            en: "Two companies both have an 800 crore market cap. One has a 60% float, the other 12%. Which carries more risk for a new investor?",
          },
          options: [
            {
              text: { bn: "প্রথমটা, কারণ বেশি শেয়ার বাজারে আছে", en: "The first, because more shares are out there" },
              why: {
                bn: "উল্টো। বেশি শেয়ার বাজারে থাকা মানে বেশি ক্রেতা-বিক্রেতা, তাই দাম বেশি স্থিতিশীল আর বেরোনো সহজ।",
                en: "The reverse. More shares in the market means more buyers and sellers, so the price is steadier and getting out is easier.",
              },
            },
            {
              text: { bn: "দ্বিতীয়টা, কারণ অল্প টাকাতেই দাম নড়ে আর বেরোনো কঠিন", en: "The second, because small money moves the price and exit is hard" },
              right: true,
              why: {
                bn: "ঠিক। ১২% ভাসমান মানে বাস্তবে কেনাবেচার যোগ্য শেয়ার ৯৬ কোটি টাকার। এই আকারে অল্প কয়েকজনের সিদ্ধান্তই দাম ঠিক করে দেয়, আর খারাপ খবরের দিনে ক্রেতা পাওয়া যায় না।",
                en: "Right. A 12% float means only 96 crore taka of shares actually trade. At that size a handful of people set the price, and on a bad news day there are no buyers.",
              },
            },
            {
              text: { bn: "দুইটা সমান, কারণ বাজারমূল্য একই", en: "The same, since the market cap is equal" },
              why: {
                bn: "বাজারমূল্য এক আর তারল্য আলাদা, আর ঝুঁকির দিক থেকে দ্বিতীয়টাই বেশি গুরুত্বপূর্ণ। এইজন্যই ভাসমান শেয়ারের সংখ্যাটা আলাদা করে দেখতে হয়।",
                en: "The cap is equal and the liquidity is not, and for risk the second matters more. Which is why the float is worth looking up separately.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"liquidity": {
  bn: `
<p>তারল্য একটা শব্দ যা মানুষ শোনে আর পাশ কাটিয়ে যায়, আর বাংলাদেশের বাজারে এটাই সম্ভবত সবচেয়ে অবহেলিত ঝুঁকি। সংজ্ঞাটা সহজ: <strong>দাম বেশি না নাড়িয়ে কত দ্রুত কিনতে বা বেচতে পারবেন, তার নাম তারল্য।</strong></p>

<p>কেনার সময় এটা প্রায় কখনো সমস্যা মনে হয় না, আর সেটাই ফাঁদ। কিনতে চাইলে আপনি বেশি দাম দিয়ে দিলেই কেউ না কেউ বেচবে। বেচার সময় আপনি বেশি দাম দিতে পারেন না, আপনি কেবল কম দাম নিতে পারেন, আর কম দাম নেওয়ার নাম ক্ষতি।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>তারল্য মাপা হয় দৈনিক লেনদেনের পরিমাণ দিয়ে, শেয়ার সংখ্যা দিয়ে নয়।</li>
<li>কেনা সবসময় সহজ, বেচা সবসময় না। ঝুঁকিটা দ্বিতীয় দিকে।</li>
<li>স্প্রেড, মানে কেনা আর বেচার দামের ফাঁক, তারল্যের সবচেয়ে দ্রুত পরিমাপ।</li>
<li>খারাপ খবরের দিনে তারল্য শুকিয়ে যায়, ঠিক যখন আপনার সবচেয়ে বেশি দরকার।</li>
<li>কেনার আগে দেখা এই সংখ্যাটা, কারণ বেচার দিনে দেখার সময় নেই।</li>
</ul>
</div>

<h2>বেরোতে কত দিন লাগবে</h2>

${mount("liq-lab")}

<p>এই সংখ্যাটা কেনার আগে একবার দেখে নেওয়ার অভ্যাসটাই এই লেখার আসল কাজ। ডিএসইর সাইটে প্রতিটা কোম্পানির পাতায় দৈনিক লেনদেনের পরিমাণ থাকে, আর গত এক মাসের গড়টা নেওয়াই ভালো: একদিনের সংখ্যা বিভ্রান্তিকর হতে পারে।</p>

<h2>স্প্রেডই সবচেয়ে দ্রুত পরিমাপ</h2>

<p>অ্যাপে যেকোনো শেয়ার খুললে সর্বোচ্চ ক্রেতার দাম আর সর্বনিম্ন বিক্রেতার দাম দেখা যায়। এই দুইটার ফাঁকটাই স্প্রেড, আর ফাঁকটা তারল্যের সরাসরি ছবি।</p>

${mount("liq-compare")}

<p>একটা তরল শেয়ারে স্প্রেড দামের ০.১% এর মতো, প্রায় অদৃশ্য। একটা পাতলা শেয়ারে সেটা ২% থেকে ৫% হতে পারে, মানে কিনে সঙ্গে সঙ্গে বেচলেই আপনি ৫% পিছিয়ে। কোনো কমিশন যোগ করার আগেই।</p>

<div class="ex"><b>উদাহরণ:</b> একটা শেয়ারের সর্বোচ্চ ক্রেতা দিচ্ছেন ৪২ টাকা আর সর্বনিম্ন বিক্রেতা চাইছেন ৪৪ টাকা। সর্বশেষ লেনদেন হয়েছিল ৪৩ টাকায়, আর অ্যাপ ওই ৪৩ টাকাই দেখাচ্ছে। আপনি যদি এখন কেনেন, দিতে হবে ৪৪; সঙ্গে সঙ্গে বেচতে চাইলে পাবেন ৪২। মানে আপনার পোর্টফোলিও ৪৩ দেখাবে, বাস্তবে আপনি ৪২ পাবেন, আর কেনার সময়ই ৪.৫% হারিয়েছেন। অ্যাপের সংখ্যাটা এই ক্ষতিটা কখনো দেখায় না।</div>

<h2>খারাপ দিনে তারল্য উবে যায়</h2>

<p>এটাই সবচেয়ে বিপজ্জনক অংশ, আর এটা স্বাভাবিক সময়ে দেখা যায় না। যেদিন একটা কোম্পানি নিয়ে খারাপ খবর আসে, সেদিন সবাই একসাথে বেচতে চায় আর কেউ কিনতে চায় না। যে শেয়ারে গতকাল ৫০ লাখ টাকার লেনদেন হয়েছিল, আজ হতে পারে ২ লাখ টাকার, আর দাম নিচের সার্কিটে আটকে থাকে।</p>

<p>মানে যখন আপনার সবচেয়ে বেশি বেরোনো দরকার, ঠিক তখনই বেরোনো সবচেয়ে কঠিন। এইজন্য তারল্য এমন একটা ঝুঁকি যা ভালো সময়ে মাপতে হয়, খারাপ সময়ে নয়।</p>

<div class="note">২০১০ সালের ধসের সময় বহু শেয়ার টানা কয়েক দিন নিচের সার্কিটে বসে ছিল, আর ক্রেতা ছিল না। মানুষ বেচতে চেয়েছেন আর পারেননি, দাম প্রতিদিন নেমেছে। যাদের কাছে তরল শেয়ার ছিল তারা বেরোতে পেরেছেন; যাদের কাছে পাতলা শেয়ার ছিল তারা কেবল দেখেছেন। <a class="term" href="/money/terms/circuit-breaker.html">সার্কিট ব্রেকারের</a> লেখায় এই ব্যবস্থাটা আছে।</div>

<h2>তারল্য দেখে কী সিদ্ধান্ত নেবেন</h2>

<p>নিয়মটা সরল: <strong>আপনার পজিশন যেন দৈনিক গড় লেনদেনের একটা ছোট ভগ্নাংশ হয়।</strong> কেউ কেউ বলেন এক দিনের লেনদেনের ১০% এর বেশি নয়, কেউ বলেন পাঁচ দিনে বেরোনো গেলেই যথেষ্ট। সংখ্যাটা যাই হোক, কেনার আগে হিসাবটা করা আর হিসাবটা লিখে রাখাই আসল কথা।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("liq-quiz")}
`,
  en: `
<p>Liquidity is a word people hear and move past, and in this market it is probably the most ignored risk of all. The definition is simple: <strong>how fast you can buy or sell without moving the price much.</strong></p>

<p>Buying almost never feels like a problem, and that is the trap. If you want to buy you can simply pay more and somebody will sell. When you sell you cannot pay more, you can only accept less, and accepting less is called a loss.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Liquidity is measured in daily turnover, not in the number of shares.</li>
<li>Buying is always easy; selling is not. The risk lives on the second side.</li>
<li>The spread, the gap between bid and offer, is the fastest read on it.</li>
<li>Liquidity dries up on bad news days, exactly when you need it.</li>
<li>Check the number before buying, because on the day you sell there is no time.</li>
</ul>
</div>

<h2>How many days to get out</h2>

${mount("liq-lab")}

<p>Making a habit of checking that number before buying is the real work of this lesson. DSE's site carries daily turnover on every company's page, and the last month's average is the better figure: a single day can mislead.</p>

<h2>The spread is the quickest read</h2>

<p>Open any share in the app and you see the highest bid and the lowest offer. The gap between them is the spread, and it is a direct picture of liquidity.</p>

${mount("liq-compare")}

<p>In a liquid share the spread is about 0.1% of the price, near invisible. In a thin one it can be 2% to 5%, meaning buy and sell instantly and you are 5% behind. Before any commission is added.</p>

<div class="ex"><b>Example:</b> The highest bid is 42 and the lowest offer is 44. The last trade was at 43 and the app shows 43. Buy now and you pay 44; sell straight away and you get 42. Your portfolio shows 43, you would actually receive 42, and you lost 4.5% in the act of buying. The app's number never shows you that loss.</div>

<h2>On a bad day liquidity evaporates</h2>

<p>This is the dangerous part, and it is invisible in normal times. On the day bad news lands about a company everybody wants to sell and nobody wants to buy. A share that turned over 50 lakh taka yesterday may turn over 2 lakh today, with the price stuck on the lower circuit.</p>

<p>So exactly when you most need to get out, getting out is hardest. Liquidity is a risk you have to measure in the good times, because you cannot measure it in the bad ones.</p>

<div class="note">In the 2010 crash a great many shares sat on the lower circuit for days with no buyers. People wanted to sell and could not, while the price fell every day. Those holding liquid shares got out; those holding thin ones only watched. The <a class="term" href="/money/terms/circuit-breaker.html">circuit breaker</a> lesson covers that mechanism.</div>

<h2>What to do with the number</h2>

<p>The rule is plain: <strong>your position should be a small fraction of average daily turnover.</strong> Some say no more than 10% of one day's volume; others say being able to exit within five days is enough. Whatever number you choose, doing the sum before buying and writing it down is the point.</p>

<h2>Check yourself</h2>

${mount("liq-quiz")}
`,
  blocks: {
    "liq-lab": {
      kind: "lab",
      model: "liquidity",
      title: { bn: "আপনার পজিশন থেকে বেরোতে কত দিন", en: "Days to exit your position" },
      note: {
        bn: "পজিশনের আকার বাড়িয়ে দেখুন। ছোট কোম্পানিতে সংখ্যাটা কত দ্রুত বাড়ে লক্ষ করুন।",
        en: "Raise the position and watch how fast the number climbs in a small company.",
      },
      preset: { holding: 200000, turnover: 30, share: 10 },
    },
    "liq-compare": {
      kind: "compare",
      title: { bn: "তরল আর পাতলা", en: "Liquid and thin" },
      columns: [
        { bn: "তরল শেয়ার", en: "A liquid share" },
        { bn: "পাতলা শেয়ার", en: "A thin share" },
      ],
      rows: [
        {
          label: { bn: "দৈনিক লেনদেন", en: "Daily turnover" },
          cells: [{ bn: "কয়েক কোটি টাকা", en: "Crores of taka" }, { bn: "কয়েক লাখ টাকা", en: "Lakhs of taka" }],
          best: 0,
        },
        {
          label: { bn: "স্প্রেড", en: "The spread" },
          cells: [{ bn: "দামের ০.১% এর মতো", en: "About 0.1% of the price" }, { bn: "২% থেকে ৫%", en: "2% to 5%" }],
          best: 0,
        },
        {
          label: { bn: "১০ লাখ টাকার অর্ডার দিলে", en: "A 10 lakh taka order" },
          cells: [{ bn: "দামে প্রায় কিছুই হয় না", en: "Barely touches the price" }, { bn: "দাম কয়েক শতাংশ নড়ে", en: "Moves the price several percent" }],
          best: 0,
        },
        {
          label: { bn: "খারাপ খবরের দিনে", en: "On a bad news day" },
          cells: [{ bn: "কম দামে হলেও বেচা যায়", en: "You can still sell, at a worse price" }, { bn: "ক্রেতাই থাকে না", en: "There are no buyers at all" }],
          best: 0,
        },
        {
          label: { bn: "দাম নিয়ন্ত্রণের ঝুঁকি", en: "Manipulation risk" },
          cells: [{ bn: "কম, কারণ অনেক টাকা লাগবে", en: "Low: it would take a great deal of money" }, { bn: "বেশি, অল্প টাকাতেই হয়", en: "High: small money is enough" }],
          best: 0,
        },
      ],
    },
    "liq-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা শেয়ারের দৈনিক গড় লেনদেন ৮ লাখ টাকা, আর আপনি ৪ লাখ টাকার পজিশন নিতে চান। সমস্যা কোথায়?",
            en: "A share turns over 8 lakh taka a day on average and you want a 4 lakh position. What is the problem?",
          },
          options: [
            {
              text: { bn: "কোনো সমস্যা নেই, কেনা তো যাবে", en: "No problem: you can buy it" },
              why: {
                bn: "কেনা যাবে, ঠিক। প্রশ্নটা কেনার নয়, বেরোনোর। আপনার পজিশন দৈনিক লেনদেনের অর্ধেক, তাই বেচতে গেলে আপনি একাই বাজারের অর্ধেক হবেন আর দাম আপনার বিরুদ্ধে যাবে।",
                en: "You can buy it, yes. The question is not buying, it is leaving. Your position is half a day's turnover, so selling makes you half the market and the price moves against you.",
              },
            },
            {
              text: { bn: "বেরোতে অনেক দিন লাগবে আর সেই দিনগুলোতে দাম পড়বে", en: "Getting out takes many days, and the price falls on each of them" },
              right: true,
              why: {
                bn: "ঠিক। যদি আপনি দিনের লেনদেনের ১০% হতে পারেন, বেরোতে লাগবে পাঁচ দিন, আর খারাপ খবরের দিনে ওই ৮ লাখ হয়তো ১ লাখে নেমে যাবে। উপরের হিসাবটায় সংখ্যাগুলো বসিয়ে দেখুন।",
                en: "Right. At 10% of a day's volume that is five days, and on a bad news day the 8 lakh might become 1 lakh. Put the numbers into the calculator above.",
              },
            },
            {
              text: { bn: "লেনদেন কম মানে দাম বাড়বে", en: "Low turnover means the price will rise" },
              why: {
                bn: "এমন কোনো সম্পর্ক নেই। কম লেনদেন মানে দাম যেকোনো দিকে সহজে নড়ে, আর সেটা সুবিধা নয়, অনিশ্চয়তা।",
                en: "No such relationship exists. Low turnover means the price moves easily in either direction, which is not an advantage, it is uncertainty.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কোন সময়ে তারল্য মাপা উচিত?",
            en: "When should liquidity be measured?",
          },
          options: [
            {
              text: { bn: "কেনার আগে, স্বাভাবিক সময়ে", en: "Before buying, in normal times" },
              right: true,
              why: {
                bn: "ঠিক। খারাপ দিনে সংখ্যাটা এমনিতেই খারাপ থাকবে আর তখন সিদ্ধান্ত নেওয়ার সময়ও থাকবে না। এই একটা সংখ্যা কেনার তালিকায় যোগ করাই এই লেখার পুরো অনুরোধ।",
                en: "Right. On a bad day the number is already bad and there is no time to decide. Adding this one number to your buying checklist is the whole request of this lesson.",
              },
            },
            {
              text: { bn: "বেচার দিনে", en: "On the day you sell" },
              why: {
                bn: "ওই দিনে জেনে কিছু করার নেই। তারল্য এমন একটা ঝুঁকি যা আগে থেকে না জানলে জানার কোনো মূল্য থাকে না।",
                en: "Knowing it that day changes nothing. Liquidity is a risk with no value in hindsight.",
              },
            },
            {
              text: { bn: "মাপার দরকার নেই, ব্রোকার দেখে নেবে", en: "No need: the broker will look after it" },
              why: {
                bn: "ব্রোকার আপনার অর্ডার পাঠায়, আপনার পজিশনের আকার নিয়ে ভাবে না। আর তার আয় লেনদেন থেকে, তাই বেশি কেনায় তার আপত্তি নেই।",
                en: "A broker routes your order and does not think about the size of your position. Their income comes from turnover, so a larger purchase suits them fine.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"circuit-breaker": {
  bn: `
<p>ঢাকা স্টক এক্সচেঞ্জে একটা শেয়ারের দাম এক দিনে যত খুশি ওঠানামা করতে পারে না। একটা সীমা বেঁধে দেওয়া আছে, আর তার নাম সার্কিট ব্রেকার। দাম ওই সীমায় পৌঁছালে ওইদিন আর ওই দিকে যেতে পারে না।</p>

<p>ব্যবস্থাটা বসানো হয়েছিল আতঙ্ক ঠেকাতে: এক দিনে ৪০% পতন মানুষকে যা করায়, ১০% পতন তা করায় না। যুক্তিটা সৎ। কিন্তু এই ব্যবস্থাটা যা করে আর যা করে না, তার মধ্যে একটা বড় ফারাক আছে, আর সেই ফারাকটাই এই লেখার বিষয়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>সার্কিট সীমা দামের ওপর, দিনে দুই দিকেই।</li>
<li>সীমাটা শতাংশে, আর শেয়ারের দামের স্তর অনুযায়ী আলাদা হয়।</li>
<li>নিচের সার্কিটে আটকে থাকা মানে বেচা যাচ্ছে না, দাম থেমেছে তা নয়।</li>
<li>টানা কয়েক দিন সার্কিটে বসে থাকলে মোট পতন বিশাল হতে পারে।</li>
<li>সীমা বিপদ কমায় না, ধীরে করে। দুইটা এক জিনিস নয়।</li>
</ul>
</div>

<h2>টানা পতনের অঙ্ক</h2>

${mount("circuit-lab")}

<p>এই হিসাবটাই সার্কিট ব্রেকার নিয়ে সবচেয়ে ভুল বোঝাবুঝিটা সারায়। ১০% দৈনিক সীমা মানে এই না যে আপনি সর্বোচ্চ ১০% হারাবেন। মানে হলো আপনি দিনে সর্বোচ্চ ১০% হারাবেন, আর পাঁচ দিনে সেটা ৪১%।</p>

<h2>নিচের সার্কিট আর বেরোতে না পারা</h2>

<p>এখানেই আসল বিপদটা, আর এটা <a class="term" href="/money/terms/liquidity.html">তারল্যের</a> সঙ্গে জড়ানো। যখন একটা শেয়ার নিচের সার্কিটে আটকে যায়, তার মানে ওই দামে বেচতে চাওয়া মানুষের সংখ্যা কিনতে চাওয়া মানুষের চেয়ে অনেক বেশি। অর্ডার বইয়ে বেচার লাইনটা লম্বা আর কেনার দিকটা প্রায় খালি।</p>

<p>আপনি বেচার অর্ডার দিলেন, আর ওটা লাইনে দাঁড়াল। ওই দিন হয়তো লাইনের প্রথম দশ শতাংশ ভরাট হলো, বাকিটা হলো না। পরের দিন বাজার আবার খুলল ১০% নিচে, আর আপনার অর্ডার এখনো ভরাট হয়নি। এভাবে দাম নামতে থাকে আর আপনি দেখতে থাকেন।</p>

${mount("circuit-figure")}

<h2>সীমা কেন সবসময় সাহায্য করে না</h2>

<p>যুক্তিতে দুইটা দিক আছে, আর দুইটাই সত্য।</p>

<p>পক্ষে: এক দিনে হঠাৎ ৩০% পতন আতঙ্ক তৈরি করে, আর আতঙ্কে মানুষ যা করে তা প্রায়ই ভুল। সীমা একটা বিরতি দেয়, আর ওই বিরতিতে খবরটা যাচাই করার সুযোগ হয়।</p>

<p>বিপক্ষে: সীমা তথ্যকে দাম পর্যন্ত পৌঁছাতে দেয় না। যদি একটা কোম্পানির সম্পর্কে সত্যিই খারাপ খবর আসে আর তার সঠিক দাম ৩৫% নিচে হয়, সীমা কেবল ওই সমন্বয়টাকে চার দিনে ছড়িয়ে দেয়। এর মধ্যে যারা জানেন তারা বেরিয়ে যান আর যারা জানেন না তারা আটকে থাকেন। কিছু গবেষণা বলে সীমা আসলে আতঙ্ক বাড়ায়: মানুষ ভয় পায় যে কাল বেচতে পারবে না, তাই আজই লাইনে দাঁড়ায়।</p>

<div class="note">সীমার সংখ্যাগুলো বিএসইসি আর ডিএসই সময়ে সময়ে বদলায়, আর সাধারণত কম দামের শেয়ারে সীমা বেশি শতাংশ আর বেশি দামের শেয়ারে কম। বিশেষ ক্ষেত্রে সীমা তুলে দেওয়াও হয়েছে, যেমন তালিকাভুক্তির প্রথম দিনে। চলতি নিয়মটা ডিএসইর সাইট থেকে মিলিয়ে নেবেন, কারণ এই সংখ্যাগুলো এই লেখার চেয়ে দ্রুত বদলায়।</div>

<h2>এটা জেনে কী করবেন</h2>

<p>দুইটা ব্যবহারিক ফল আছে। এক, উপরের সার্কিটে আটকে থাকা শেয়ার দেখে কেনার তাড়া অনুভব করবেন না: সীমা দাম আটকে রেখেছে বলে সেটা সস্তা নয়, বরং ওখানে কেনার লাইনটাই আপনার প্রতিযোগী। দুই, নিচের সার্কিটে আটকে থাকা শেয়ারে "একটু উঠলেই বেচে দেব" পরিকল্পনা কাজ করে না, কারণ ওঠার আগে অনেক লাইন আপনার আগে আছে।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("circuit-quiz")}
`,
  en: `
<p>A share on the Dhaka exchange cannot move as far as it likes in one day. There is a cap, called the circuit breaker, and once the price hits it, it goes no further that way for the rest of the session.</p>

<p>The mechanism exists to slow panic: a 40% fall in a day makes people do things a 10% fall does not. The reasoning is honest. But there is a wide gap between what this does and what people think it does, and that gap is the lesson.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>The limit caps the price, in both directions, each day.</li>
<li>It is a percentage, and it differs by the share's price band.</li>
<li>Stuck on the lower circuit means you cannot sell, not that the price has stopped.</li>
<li>Several days on the circuit compounds into an enormous fall.</li>
<li>A limit does not reduce the damage, it slows it. Those are different things.</li>
</ul>
</div>

<h2>The arithmetic of consecutive limit days</h2>

${mount("circuit-lab")}

<p>This is the calculation that clears up the biggest misunderstanding. A 10% daily limit does not mean you can lose at most 10%. It means you can lose at most 10% in a day, and over five days that is 41%.</p>

<h2>The lower circuit, and being unable to leave</h2>

<p>Here is the real danger, and it is tangled up with <a class="term" href="/money/terms/liquidity.html">liquidity</a>. When a share is stuck on the lower circuit, far more people want to sell at that price than want to buy. The sell queue is long and the buy side is nearly empty.</p>

<p>You place a sell order and it joins the queue. That day maybe the first tenth of the queue fills and the rest does not. The next morning the market opens 10% lower and your order is still unfilled. The price keeps stepping down and you keep watching.</p>

${mount("circuit-figure")}

<h2>Why a limit does not always help</h2>

<p>There are two sides to this and both are true.</p>

<p>For: a sudden 30% fall in one session creates panic, and what people do in panic is usually wrong. The limit buys a pause, and in that pause the news can be checked.</p>

<p>Against: the limit stops information from reaching the price. If genuinely bad news arrives and the correct price is 35% lower, the limit only spreads that adjustment across four days. In the meantime the people who know get out and the people who do not stay in. Some research argues limits actually increase panic: people fear they will not be able to sell tomorrow, so they queue today.</p>

<div class="note">BSEC and DSE change the limit percentages from time to time, and typically lower-priced shares get a wider percentage band and higher-priced ones a narrower one. Limits have also been suspended in particular cases, such as a first day of listing. Check the current rule on DSE's site, because these numbers change faster than this lesson does.</div>

<h2>What to do with this</h2>

<p>Two practical consequences. First, do not feel hurried into buying a share stuck on the upper circuit: a price held by a limit is not cheap, and the queue standing there is your competition. Second, a plan of "I will sell as soon as it recovers a bit" does not work on a share stuck on the lower circuit, because a long queue stands in front of you before it recovers.</p>

<h2>Check yourself</h2>

${mount("circuit-quiz")}
`,
  blocks: {
    "circuit-lab": {
      kind: "lab",
      model: "circuit",
      title: { bn: "টানা সার্কিটে কত পড়ে", en: "How far consecutive limit days go" },
      note: {
        bn: "দিন সংখ্যা বাড়িয়ে দেখুন। মোট পতনটা দৈনিক সীমার গুণিতক নয়।",
        en: "Raise the day count. The total is not the daily limit multiplied.",
      },
      preset: { close: 100, limit: 10, days: 3 },
    },
    "circuit-figure": {
      kind: "figure",
      shape: "flow",
      title: { bn: "নিচের সার্কিটে একটা দিন", en: "A day on the lower circuit" },
      parts: [
        { text: { bn: "খারাপ খবর আসে", en: "Bad news arrives" }, note: { bn: "ফলাফল খারাপ, নিরীক্ষকের আপত্তি, বা গুজব", en: "Weak results, an audit qualification, or a rumour" }, tone: "warn" },
        { text: { bn: "সবাই বেচতে চায়", en: "Everybody wants to sell" }, note: { bn: "বেচার লাইন লম্বা, কেনার দিক খালি", en: "The sell queue is long, the buy side is empty" }, tone: "bad" },
        { text: { bn: "দাম সীমায় পৌঁছে থামে", en: "The price hits the limit and stops" }, note: { bn: "লেনদেন চলে, কিন্তু কেবল ওই দামেই", en: "Trading continues, but only at that price" } },
        { text: { bn: "বেশিরভাগ অর্ডার ভরাট হয় না", en: "Most orders do not fill" }, note: { bn: "আপনি লাইনে আছেন, বেরোননি", en: "You are in the queue, not out" }, tone: "bad" },
        { text: { bn: "পরদিন আবার নিচ থেকে শুরু", en: "The next day opens lower again" }, note: { bn: "আর আপনার অর্ডার এখনো অপেক্ষায়", en: "And your order is still waiting" }, tone: "bad" },
      ],
      caption: {
        bn: "সীমা দাম আটকায়, বেরোনোর পথ খোলে না। বেরোনোর পথ খোলে তারল্য।",
        en: "A limit caps the price; it does not open an exit. Liquidity opens an exit.",
      },
    },
    "circuit-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "দৈনিক সীমা ১০%। একটা শেয়ার টানা চার দিন নিচের সার্কিটে বসে থাকল। মোট কত পড়ল?",
            en: "The daily limit is 10% and a share sits on the lower circuit for four days. How far has it fallen?",
          },
          options: [
            {
              text: { bn: "১০%, কারণ সীমা তো ১০%", en: "10%, because the limit is 10%" },
              why: {
                bn: "সীমাটা প্রতিদিনের, মোটের নয়। প্রতিটা দিন আগের দিনের বন্ধ দাম থেকে হিসাব হয়, তাই পতনগুলো একটার ওপর আরেকটা বসে।",
                en: "The limit is per day, not in total. Each day is computed from the previous close, so the falls compound.",
              },
            },
            {
              text: { bn: "৪০%", en: "40%" },
              why: {
                bn: "কাছাকাছি, আর ঠিক না। যোগ করলে ৪০ হয়, কিন্তু গুণ করলে হয় কম: প্রতিদিন ছোট ভিত্তির ওপর ১০%।",
                en: "Close, and not right. Adding gives 40; multiplying gives less, because each 10% is on a smaller base.",
              },
            },
            {
              text: { bn: "প্রায় ৩৪%", en: "About 34%" },
              right: true,
              why: {
                bn: "ঠিক। ১০০ থেকে ৯০, ৮১, ৭২.৯, ৬৫.৬। উপরের হিসাবে সংখ্যাগুলো বসিয়ে দেখুন। আর এই চার দিনের বেশিরভাগ সময় আপনি বেচতেই পারবেন না, তাই বাস্তবে অভিজ্ঞতাটা আরও খারাপ।",
                en: "Right: 100 to 90, 81, 72.9, 65.6. Put it into the calculator above. And for most of those four days you cannot sell, so the lived experience is worse than the number.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা শেয়ার উপরের সার্কিটে আটকে আছে আর কেনার লাইন লম্বা। এতে কী বোঝায়?",
            en: "A share is locked on the upper circuit with a long buy queue. What does that tell you?",
          },
          options: [
            {
              text: { bn: "শেয়ারটা ভালো, তাই কিনে ফেলা উচিত", en: "It is a good share, so buy it" },
              why: {
                bn: "চাহিদা আর মান এক জিনিস না। উপরের সার্কিটে লাইন মানে এই মুহূর্তে অনেকে কিনতে চান, আর তার কারণ ভালো খবরও হতে পারে, গুজবও হতে পারে। বাংলাদেশে পাতলা শেয়ারে দ্বিতীয়টা অচেনা নয়।",
                en: "Demand and quality are different things. A queue on the upper circuit means many people want in right now, and the reason can be good news or a rumour. In thin shares here the second is not unfamiliar.",
              },
            },
            {
              text: { bn: "এই দামে কেনা যাচ্ছে না, আর কেন চাহিদা তা এখনো জানা হয়নি", en: "You cannot buy at this price, and you still do not know why the demand is there" },
              right: true,
              why: {
                bn: "ঠিক। দুইটা আলাদা তথ্য: এক, আপনার অর্ডার সম্ভবত ভরাট হবে না; দুই, কারণটা যাচাই না করে কেনার সিদ্ধান্ত নেওয়া মানে ভিড়কে অনুসরণ করা। কারণ খোঁজার জায়গা হলো ডিএসইর মূল্য-সংবেদনশীল তথ্যের পাতা।",
                en: "Right. Two separate facts: your order probably will not fill, and buying without checking the reason is following a crowd. The place to look for the reason is DSE's price sensitive information page.",
              },
            },
            {
              text: { bn: "কাল আরও বাড়বে", en: "It will rise again tomorrow" },
              why: {
                bn: "কেউ জানে না। উপরের সার্কিটে আজ থাকা কাল কী হবে তা বলে না, আর টানা সার্কিটের পর হঠাৎ উল্টো দিকে যাওয়াও সাধারণ ঘটনা।",
                en: "Nobody knows. Being on the upper circuit today says nothing about tomorrow, and a sharp reversal after a run of limit days is entirely ordinary.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"ipo": {
  bn: `
<p>আইপিও, ইনিশিয়াল পাবলিক অফারিং, মানে একটা কোম্পানি প্রথমবারের মতো সাধারণ মানুষের কাছে নিজের শেয়ার বেচে আর <a class="term" href="/money/terms/dse.html">স্টক এক্সচেঞ্জে</a> তালিকাভুক্ত হয়।</p>

<p>এর আগ পর্যন্ত কোম্পানিটার মালিক ছিলেন হাতে গোনা কয়েকজন: প্রতিষ্ঠাতা, তার পরিবার, হয়তো একজন বিনিয়োগকারী। আইপিওর পর মালিক হন হাজার হাজার মানুষ, আর যে কেউ চাইলে শেয়ার কিনতে পারেন। এই এক ঘটনায় কোম্পানিটার জীবন বদলে যায়, দুই দিক থেকেই।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>কোম্পানি আইপিও করে টাকা তুলতে, আর সেই টাকা ফেরত দিতে হয় না।</li>
<li>বিনিময়ে সে স্বচ্ছতার দায় নেয়: প্রতি তিন মাসে হিসাব প্রকাশ।</li>
<li>বাংলাদেশে বরাদ্দ হয় লটারিতে, তাই আবেদন করলেই পাওয়া যায় না।</li>
<li>প্রসপেক্টাস পড়ার অভ্যাসটাই এখানে সবচেয়ে দামি।</li>
<li>প্রথম দিনে দাম বাড়া নিয়ম নয়, প্রবণতা, আর প্রবণতা বদলায়।</li>
</ul>
</div>

<h2>কোম্পানি কেন আইপিও করে</h2>

<p>একটা কোম্পানির টাকা দরকার হলে তিনটা পথ আছে: নিজের লাভ ব্যবহার করা, ব্যাংক থেকে ধার নেওয়া, বা মালিকানার একটা অংশ বেচে দেওয়া। আইপিও তৃতীয়টা।</p>

${mount("ipo-compare")}

<p>তৃতীয়টার সুবিধা হলো টাকাটা ফেরত দিতে হয় না আর কোনো সুদ নেই। অসুবিধা হলো মালিকানা ভাগ হয়ে যায়, আর ভবিষ্যতের সব লাভও ভাগ হয়। এইজন্য একজন প্রতিষ্ঠাতা তখনই আইপিও করেন যখন হয় টাকাটা খুব দরকার, নয়তো তিনি মনে করেন এখন দাম ভালো পাওয়া যাবে।</p>

<p>ওই দ্বিতীয় কারণটা আপনার মনে রাখা দরকার। যিনি বেচছেন তিনি কোম্পানিটাকে আপনার চেয়ে ভালো চেনেন, আর তিনি সময়টা বেছে নিচ্ছেন। এটা আইপিওকে খারাপ বানায় না, কিন্তু এটা বলে দেয় কেন প্রসপেক্টাস পড়া বাধ্যতামূলক।</p>

<h2>প্রসপেক্টাস: যে কাগজটা কেউ পড়ে না</h2>

<p>প্রতিটা আইপিওর সঙ্গে একটা প্রসপেক্টাস প্রকাশিত হয়, দুইশো থেকে চারশো পাতার একটা দলিল, বিনামূল্যে, ডিএসইর সাইটে। এতে কোম্পানির ইতিহাস, হিসাব, ঝুঁকি আর টাকাটা কোথায় খরচ হবে সব লেখা থাকে।</p>

<p>পুরোটা পড়তে হবে না। পাঁচটা জায়গা পড়লেই ৮০% কাজ হয়ে যায়।</p>

<ol class="step-list">
<li><strong>টাকাটা কোথায় যাচ্ছে।</strong> নতুন কারখানা, নতুন যন্ত্রপাতি, ঋণ শোধ, নাকি প্রতিষ্ঠাতার হাতে? শেষটা হলে সেটা কোম্পানিতে টাকা আসা নয়, প্রতিষ্ঠাতার বেরিয়ে যাওয়া।</li>
<li><strong>ঝুঁকির অধ্যায়।</strong> আইনত এখানে সব খারাপ সম্ভাবনা লিখতে হয়, তাই এই অধ্যায়টাই কোম্পানির সবচেয়ে সৎ অংশ। বেশিরভাগ মানুষ এটাই বাদ দেন।</li>
<li><strong>গত পাঁচ বছরের বিক্রি আর লাভ।</strong> আইপিওর আগের বছরে হঠাৎ লাফ দেওয়া লাভ একটা পরিচিত প্যাটার্ন, আর তালিকাভুক্তির পর সেটা প্রায়ই নেমে আসে।</li>
<li><strong>নিরীক্ষকের মতামত।</strong> কোনো আপত্তি বা শর্ত আছে কি না। থাকলে সেটা পড়ুন, বাদ দেবেন না।</li>
<li><strong>দাম কীভাবে ঠিক হলো।</strong> নির্ধারিত মূল্য না বুক বিল্ডিং, আর কোন কোম্পানিগুলোর সঙ্গে তুলনা করে দাম বসানো হয়েছে।</li>
</ol>

<h2>লটারির অঙ্ক</h2>

${mount("ipo-lab")}

<p>বাংলাদেশে আইপিওতে চাহিদা প্রায় সবসময় জোগানের অনেক গুণ, তাই বরাদ্দ হয় লটারিতে। মানে আবেদন করা আর পাওয়া দুইটা আলাদা ঘটনা, আর প্রথম দিনের লাভের গল্পগুলো যারা পেয়েছেন তাদের।</p>

<div class="ex"><b>উদাহরণ:</b> একটা ৫০ কোটি টাকার ইস্যুতে ১২ লাখ আবেদন এল, প্রতিটা ১০,০০০ টাকার, মোট ১,২০০ কোটি টাকা। মানে চাহিদা জোগানের চব্বিশ গুণ, আর আপনার পাওয়ার সম্ভাবনা প্রায় ৪%। পঁচিশজনের একজন পাবেন। যিনি পেলেন আর প্রথম দিনে ৬০% লাভে বেচলেন, তিনি ৬,০০০ টাকা পেলেন। বাকি চব্বিশজনের টাকা এক মাস আটকে ছিল আর কিছুই হয়নি।</div>

<h2>তালিকাভুক্তির পর কী হয়</h2>

<p>এখানে একটা প্যাটার্ন আছে যা বাংলাদেশে বারবার দেখা যায়। প্রথম দিনে দাম প্রায়ই ইস্যু মূল্যের অনেক উপরে খোলে, কারণ যারা লটারিতে পাননি তারা কিনতে চান আর জোগান সীমিত। তারপর কয়েক সপ্তাহ বা কয়েক মাস ধরে দাম ধীরে নামতে থাকে, কারণ যারা পেয়েছিলেন তারা বেচতে থাকেন।</p>

<p>এটা নিয়ম নয়, প্রবণতা, আর ব্যতিক্রম আছে। কিন্তু এটা জানা থাকলে একটা ভুল এড়ানো যায়: তালিকাভুক্তির প্রথম দিনে উত্তেজনার মধ্যে বাজার থেকে কেনা প্রায় সবসময়ই খারাপ সময়ে কেনা।</p>

<div class="note">আইপিওর নিয়ম, আবেদনের পদ্ধতি আর সীমা বিএসইসি সময়ে সময়ে বদলায়। এক সময় আবেদনের সঙ্গে টাকা জমা দিতে হতো, পরে সেটা বদলেছে। বর্তমান পদ্ধতি ব্রোকারের কাছ থেকে বা বিএসইসির সাইট থেকে জেনে নেবেন। <a class="term" href="/money/basics-2/ipo-in-practice.html">আইপিও হাতে কলমে</a> লেখাটায় ধাপগুলো আছে।</div>

<h2>নিজে যাচাই করুন</h2>

${mount("ipo-quiz")}
`,
  en: `
<p>An IPO, an initial public offering, is a company selling shares to the public for the first time and listing on the <a class="term" href="/money/terms/dse.html">exchange</a>.</p>

<p>Until then the owners were a handful of people: a founder, their family, perhaps an investor. After the IPO the owners are thousands, and anybody can buy in. That single event changes the company's life, in both directions.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A company does an IPO to raise money it never has to repay.</li>
<li>In exchange it accepts disclosure: accounts every three months.</li>
<li>Allotment here is by lottery, so applying is not the same as getting.</li>
<li>Reading the prospectus is the most valuable habit available here.</li>
<li>A first-day rise is a tendency, not a rule, and tendencies change.</li>
</ul>
</div>

<h2>Why a company lists</h2>

<p>A company needing money has three routes: use its own profit, borrow from a bank, or sell part of its ownership. An IPO is the third.</p>

${mount("ipo-compare")}

<p>The advantage of the third is that the money never comes back and carries no interest. The disadvantage is that ownership is divided, and so is every future profit. So a founder does an IPO either because the money is genuinely needed, or because they think the price is good right now.</p>

<p>Hold on to that second reason. The seller knows the company better than you do, and they are choosing the moment. That does not make IPOs bad, and it does explain why reading the prospectus is not optional.</p>

<h2>The prospectus: the document nobody reads</h2>

<p>Every IPO publishes a prospectus, two to four hundred pages, free, on DSE's site. It carries the company's history, its accounts, its risks and where the money will go.</p>

<p>You do not have to read all of it. Five places get you 80% of the way.</p>

<ol class="step-list">
<li><strong>Where the money goes.</strong> A new plant, machinery, paying down debt, or into the founder's pocket? If it is the last, that is not money coming into the company, it is a founder leaving.</li>
<li><strong>The risk factors chapter.</strong> The law requires every bad possibility to be listed here, which makes it the most honest part of the document. It is also the part most people skip.</li>
<li><strong>Five years of sales and profit.</strong> A profit that jumps in the year before an IPO is a familiar pattern, and it often subsides after listing.</li>
<li><strong>The auditor's opinion.</strong> Any qualification or emphasis? If there is one, read it rather than skipping it.</li>
<li><strong>How the price was set.</strong> Fixed price or book building, and which companies it was benchmarked against.</li>
</ol>

<h2>The lottery arithmetic</h2>

${mount("ipo-lab")}

<p>Demand in Bangladeshi IPOs almost always runs at many times the offer, so allotment is by lottery. Applying and receiving are two different events, and the first-day profit stories belong to the people who received.</p>

<div class="ex"><b>Example:</b> A 50 crore issue attracts 12 lakh applications of 10,000 taka each, which is 1,200 crore. Demand is twenty-four times the offer and your chance is about 4%. One in twenty-five gets one. The one who does and sells at a 60% first-day gain makes 6,000 taka. The other twenty-four had money locked up for a month and nothing happened.</div>

<h2>What happens after listing</h2>

<p>There is a pattern here that repeats in Bangladesh. The first day often opens far above the issue price, because everybody who missed the lottery wants in and supply is limited. Then over the following weeks or months the price drifts down as the allottees sell.</p>

<p>Not a rule, a tendency, and there are exceptions. Knowing it avoids one mistake though: buying from the market in the excitement of a listing day is almost always buying at a bad moment.</p>

<div class="note">BSEC changes IPO rules, application mechanics and caps from time to time. Applications once required money up front and that has changed. Check the current process with your broker or on BSEC's site. The <a class="term" href="/money/basics-2/ipo-in-practice.html">applying for an IPO</a> lesson walks the steps.</div>

<h2>Check yourself</h2>

${mount("ipo-quiz")}
`,
  blocks: {
    "ipo-compare": {
      kind: "compare",
      title: { bn: "টাকা তোলার তিনটা পথ", en: "Three ways to raise money" },
      columns: [
        { bn: "নিজের লাভ", en: "Own profit" },
        { bn: "ব্যাংক ঋণ", en: "A bank loan" },
        { bn: "আইপিও", en: "An IPO" },
      ],
      rows: [
        {
          label: { bn: "ফেরত দিতে হয়?", en: "Repayable?" },
          cells: [{ bn: "না", en: "No" }, { bn: "হ্যাঁ, সুদসহ", en: "Yes, with interest" }, { bn: "না", en: "No" }],
        },
        {
          label: { bn: "মালিকানা ভাগ হয়?", en: "Ownership diluted?" },
          cells: [{ bn: "না", en: "No" }, { bn: "না", en: "No" }, { bn: "হ্যাঁ", en: "Yes" }],
        },
        {
          label: { bn: "কত টাকা পাওয়া যায়", en: "How much it raises" },
          cells: [{ bn: "যত লাভ আছে, তত", en: "As much as there is profit" }, { bn: "জামানত যত, তত", en: "As much as the collateral allows" }, { bn: "অনেক বেশি", en: "A great deal more" }],
          best: 2,
        },
        {
          label: { bn: "সঙ্গে যে দায় আসে", en: "The obligation it brings" },
          cells: [{ bn: "কিছু না", en: "None" }, { bn: "প্রতি মাসে কিস্তি", en: "A monthly instalment" }, { bn: "চিরকালের স্বচ্ছতা", en: "Permanent disclosure" }],
        },
      ],
    },
    "ipo-lab": {
      kind: "lab",
      model: "ipo",
      title: { bn: "লটারিতে পাওয়ার সম্ভাবনা", en: "Your odds in the lottery" },
      note: {
        bn: "আবেদনের সংখ্যা বাড়িয়ে দেখুন, আর সম্ভাবনার সংখ্যাটা লক্ষ করুন।",
        en: "Raise the number of applications and watch what happens to the odds.",
      },
      preset: { offer: 50, applications: 12, each: 10000, pop: 60 },
    },
    "ipo-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "প্রসপেক্টাসে লেখা আছে যে তোলা টাকার ৭০% যাবে প্রতিষ্ঠাতা পরিচালকদের কাছ থেকে শেয়ার কিনে নিতে। এতে কী বোঝায়?",
            en: "The prospectus says 70% of the money raised will buy shares from the sponsor directors. What does that tell you?",
          },
          options: [
            {
              text: { bn: "কোম্পানিতে ৭০% নতুন টাকা আসছে", en: "70% of new money is entering the company" },
              why: {
                bn: "উল্টো। ওই টাকাটা কোম্পানিতে ঢোকে না, প্রতিষ্ঠাতাদের হাতে যায়। কোম্পানির কারখানা, যন্ত্র বা কর্মীদের কিছুই বদলায় না।",
                en: "The opposite. That money does not enter the company, it goes to the founders. Nothing changes in the plant, the machinery or the staff.",
              },
            },
            {
              text: { bn: "প্রতিষ্ঠাতারা বেরিয়ে যাচ্ছেন, আর টাকাটা কোম্পানির কাজে লাগছে না", en: "The founders are cashing out and the money does not fund the business" },
              right: true,
              why: {
                bn: "ঠিক, আর প্রসপেক্টাসে এই তথ্যটা খোঁজার কারণ এটাই। যিনি ব্যবসাটা সবচেয়ে ভালো চেনেন তিনি বেরোচ্ছেন, এটা নিজে থেকেই একটা তথ্য। বিপরীতে যে আইপিওর টাকা নতুন কারখানায় যাচ্ছে, সেখানে প্রতিষ্ঠাতা থাকছেন আর ঝুঁকিটা ভাগ করছেন।",
                en: "Right, and this is why you look for it in the prospectus. The person who knows the business best is leaving, which is information on its own. Contrast an issue where the money builds a new plant: the founder stays and shares the risk.",
              },
            },
            {
              text: { bn: "এটা স্বাভাবিক, সব আইপিওতেই হয়", en: "Normal: every IPO does this" },
              why: {
                bn: "সব আইপিওতে হয় না, আর কতটা হচ্ছে সেটাই প্রশ্ন। কিছু অংশ প্রতিষ্ঠাতাদের কাছে যাওয়া অস্বাভাবিক নয়; ৭০% যাওয়া অন্য জিনিস।",
                en: "Not every IPO, and the size is the question. Some going to founders is not unusual; 70% is a different thing.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা আইপিওতে চাহিদা জোগানের ২৫ গুণ। আপনি ১০,০০০ টাকার আবেদন করলেন। গড়ে কত টাকার শেয়ার পাবেন?",
            en: "An IPO is twenty-five times oversubscribed and you apply for 10,000 taka. What do you get on average?",
          },
          options: [
            {
              text: { bn: "১০,০০০ টাকার", en: "10,000 taka worth" },
              why: {
                bn: "না, কারণ পঁচিশজনের জন্য একজনের জোগান আছে। চাহিদা বেশি হলে বরাদ্দ কমে, আর বাংলাদেশে সেটা লটারিতে হয়: হয় পুরোটা পাবেন, নয় কিছুই না।",
                en: "No: there is supply for one in twenty-five. Oversubscription cuts allotment, and here it is done by lottery: either the full lot or nothing.",
              },
            },
            {
              text: { bn: "গড়ে ৪০০ টাকার, কারণ পাওয়ার সম্ভাবনা ৪%", en: "400 taka on average, since the odds are 4%" },
              right: true,
              why: {
                bn: "ঠিক, গড় হিসেবে। বাস্তবে আপনি হয় পুরো লটটা পাবেন নয় কিছুই পাবেন না, আর গড়টা ওই দুইটার মাঝামাঝি। এই কারণেই আইপিওকে একটা কৌশল হিসেবে ধরা যায় না: বেশিরভাগ বার কিছুই হয় না।",
                en: "Right, as an average. In practice you get the whole lot or nothing, and the average sits between. Which is why an IPO is not a strategy: most times nothing happens.",
              },
            },
            {
              text: { bn: "কিছুই না, ২৫ গুণ চাহিদায় কেউ পায় না", en: "Nothing: at twenty-five times nobody gets any" },
              why: {
                bn: "না, পঁচিশজনের একজন পান। জোগানটা বিলি হয়ই, কেবল সবার মধ্যে নয়।",
                en: "No: one in twenty-five does. The supply is distributed, just not to everybody.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"mutual-fund": {
  bn: `
<p>মিউচুয়াল ফান্ড হলো অনেক মানুষের টাকা এক করে একজন পেশাদার ম্যানেজারের হাতে দেওয়া, যিনি সেটা অনেকগুলো কোম্পানিতে ছড়িয়ে বিনিয়োগ করেন। আপনি ফান্ডের একটা ইউনিট কেনেন, আর ওই ইউনিটটা ফান্ডের সব বিনিয়োগের একটা ছোট অংশের প্রতিনিধিত্ব করে।</p>

<p>নতুন বিনিয়োগকারীর জন্য এটাই কেন প্রথম পছন্দ, তার কারণটা রিটার্ন নয়। কারণ হলো ছড়িয়ে দেওয়া। ২০,০০০ টাকা দিয়ে আপনি তিনটার বেশি কোম্পানির শেয়ার কিনতে পারবেন না; ওই একই ২০,০০০ টাকা একটা ফান্ডে দিলে আপনি ত্রিশটা কোম্পানির অংশীদার।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>একটা ফান্ড মানে একসঙ্গে অনেক কোম্পানি, তাই একটার দুর্ঘটনা আপনার সামান্য অংশ।</li>
<li>বাংলাদেশে দুই রকম: ক্লোজড-এন্ড, যা এক্সচেঞ্জে কেনাবেচা হয়, আর ওপেন-এন্ড।</li>
<li>খরচ আছে, আর সেটা প্রতি বছর আপনার রিটার্ন থেকে যায়।</li>
<li>ক্লোজড-এন্ড ফান্ড প্রায়ই <a class="term" href="/money/terms/nav.html">এনএভির</a> নিচে বিক্রি হয়, আর সেটা সুযোগও হতে পারে ফাঁদও।</li>
<li>ফান্ড বাজারের ঝুঁকি সরায় না, একটা কোম্পানির ঝুঁকি সরায়।</li>
</ul>
</div>

<h2>দুই রকম ফান্ড</h2>

${mount("fund-compare")}

<p>ক্লোজড-এন্ড ফান্ড একবার টাকা তোলে, নির্দিষ্ট সংখ্যক ইউনিট ইস্যু করে, আর তারপর ওই ইউনিটগুলো ডিএসইতে শেয়ারের মতোই কেনাবেচা হয়। মেয়াদ থাকে, সাধারণত দশ বছর, আর মেয়াদ শেষে হয় অবসায়ন হয় নয়তো মেয়াদ বাড়ে।</p>

<p>ওপেন-এন্ড ফান্ড যেকোনো সময় নতুন ইউনিট বেচে আর ফেরত কেনে, সরাসরি অ্যাসেট ম্যানেজমেন্ট কোম্পানির কাছ থেকে। দাম হয় ঘোষিত এনএভি অনুযায়ী, তাই বাজারের মেজাজ এখানে দামে ঢোকে না।</p>

<h2>ছাড়ের রহস্য</h2>

<p>বাংলাদেশে ক্লোজড-এন্ড ফান্ডের একটা বৈশিষ্ট্য আছে যা নতুনদের অবাক করে: ইউনিটের বাজারদর প্রায়ই এনএভির অনেক নিচে থাকে। মানে ফান্ডের হাতে থাকা সম্পদের প্রতি ইউনিট মূল্য যদি ১২ টাকা হয়, বাজারে ইউনিটটা হয়তো ৮ টাকায় কেনা যাচ্ছে।</p>

<p>শুনতে বিনামূল্যে টাকার মতো লাগে, আর সবসময় তা নয়। ছাড় থাকার কয়েকটা বাস্তব কারণ আছে: ফান্ডের খরচ ভবিষ্যতের রিটার্ন খাবে, ম্যানেজারের ওপর আস্থা কম, মেয়াদ শেষ হতে অনেক দেরি, আর ইউনিটটা পাতলা বলে বেরোনো কঠিন। ছাড় দেখে কেনার আগে জিজ্ঞেস করুন ছাড়টা কমার কোনো কারণ আছে কি না; না থাকলে আপনি কেবল একটা সস্তা জিনিস কিনে বসে থাকবেন, চিরকাল।</p>

<h2>খরচ, আর সেটা কেন বড় ব্যাপার</h2>

<p>ফান্ড ম্যানেজমেন্ট বিনামূল্যে নয়। বার্ষিক ব্যবস্থাপনা ফি, ট্রাস্টি ফি, কাস্টোডিয়ান ফি আর নিরীক্ষা খরচ মিলিয়ে মোট খরচের অনুপাত বছরে ২% থেকে ৩% হতে পারে। এই সংখ্যাটা প্রতি বছর, বাজার ভালো যাক আর খারাপ যাক।</p>

${mount("fund-lab")}

<p>উপরের হিসাবে কমিশনের জায়গায় ফান্ডের খরচটা বসিয়ে দেখুন কুড়ি বছরে কত যায়। এটা ফান্ডকে খারাপ বানায় না, কিন্তু এটা বলে দেয় কেন খরচের অনুপাতটা বাছাইয়ের সময় দেখতে হয়, আর কেন দুইটা প্রায় একরকম ফান্ডের মধ্যে সস্তাটাই ভালো।</p>

<div class="note">বাংলাদেশে অনেক মিউচুয়াল ফান্ডের দীর্ঘমেয়াদি কর্মক্ষমতা <a class="term" href="/money/terms/dsex.html">সূচকের</a> চেয়ে খারাপ হয়েছে। এটা একটা সৎ কথা আর এটা লুকানোর কিছু নেই। তবু নতুন বিনিয়োগকারীর জন্য ফান্ড দিয়ে শুরু করার যুক্তি টেকে, কারণ প্রশ্নটা সবচেয়ে ভালো কী তা নয়, প্রশ্নটা সবচেয়ে খারাপ যা হতে পারে তা কত খারাপ।</div>

<h2>কোন ফান্ড বাছবেন</h2>

<ul class="checklist">
<li>খরচের অনুপাত দেখুন, আর কম খরচেরটা বেছে নিন যদি বাকি সব প্রায় সমান হয়।</li>
<li>গত পাঁচ বছরে সূচকের সঙ্গে তুলনা করে দেখুন, এক বছর দিয়ে বিচার করবেন না।</li>
<li>ফান্ডের পোর্টফোলিও দেখুন: কয়টা কোম্পানি, কোন খাত, আর সবচেয়ে বড় তিনটার ওজন কত।</li>
<li>অ্যাসেট ম্যানেজমেন্ট কোম্পানিটা কে আর তারা কতদিন ধরে আছে।</li>
<li>ক্লোজড-এন্ড হলে ছাড় কত আর মেয়াদ শেষ কবে।</li>
</ul>

<h2>নিজে যাচাই করুন</h2>

${mount("fund-quiz")}
`,
  en: `
<p>A mutual fund pools many people's money under a professional manager who spreads it across many companies. You buy a unit of the fund, and that unit represents a small slice of everything the fund holds.</p>

<p>Why this is the first choice for a new investor has nothing to do with returns. It is about spreading. With 20,000 taka you cannot buy more than three companies; the same 20,000 in a fund makes you part-owner of thirty.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>One fund is many companies, so one company's disaster is a small slice of you.</li>
<li>Two kinds here: closed-end, traded on the exchange, and open-end.</li>
<li>There are costs, and they come out of your return every year.</li>
<li>Closed-end funds often trade below <a class="term" href="/money/terms/nav.html">NAV</a>, which can be an opportunity or a trap.</li>
<li>A fund removes single-company risk, not market risk.</li>
</ul>
</div>

<h2>Two kinds</h2>

${mount("fund-compare")}

<p>A closed-end fund raises money once, issues a fixed number of units, and those units then trade on DSE like shares. It has a life, usually ten years, and at the end it either winds up or is extended.</p>

<p>An open-end fund sells and buys back units at any time, directly with the asset management company. The price follows the declared NAV, so market mood does not enter the price.</p>

<h2>The discount puzzle</h2>

<p>Closed-end funds here have a feature that surprises beginners: the market price of a unit often sits well below NAV. If the assets are worth 12 taka a unit, the unit might be buyable at 8.</p>

<p>That sounds like free money and it is not always. There are real reasons for a discount: the fund's costs will eat future returns, confidence in the manager is low, the maturity date is far away, and the units are thin so exiting is hard. Before buying a discount, ask whether anything will make the discount close; if nothing will, you have simply bought a cheap thing and will hold it, forever.</p>

<h2>Costs, and why they matter</h2>

<p>Managing a fund is not free. Management fee, trustee fee, custodian fee and audit together can put the total expense ratio at 2% to 3% a year. That number applies every year, whether the market rises or falls.</p>

${mount("fund-lab")}

<p>Put the fund's expense ratio where the commission goes in the calculator above and see what twenty years of it costs. This does not make funds bad; it explains why the expense ratio is a thing to check when choosing, and why between two similar funds the cheaper one wins.</p>

<div class="note">Plenty of Bangladeshi mutual funds have underperformed the <a class="term" href="/money/terms/dsex.html">index</a> over long stretches. That is an honest fact and there is no point hiding it. The case for starting with funds still holds, because the question for a beginner is not what is best, it is how bad the worst case is.</div>

<h2>Choosing one</h2>

<ul class="checklist">
<li>Look up the expense ratio and prefer the cheaper one when everything else is near equal.</li>
<li>Compare five years against the index, not one year.</li>
<li>Read the fund's portfolio: how many companies, which sectors, and the weight of the largest three.</li>
<li>Find out who the asset management company is and how long they have been running.</li>
<li>If closed-end, check the discount and the maturity date.</li>
</ul>

<h2>Check yourself</h2>

${mount("fund-quiz")}
`,
  blocks: {
    "fund-compare": {
      kind: "compare",
      title: { bn: "ক্লোজড-এন্ড আর ওপেন-এন্ড", en: "Closed-end and open-end" },
      columns: [
        { bn: "ক্লোজড-এন্ড", en: "Closed-end" },
        { bn: "ওপেন-এন্ড", en: "Open-end" },
      ],
      rows: [
        {
          label: { bn: "কোথায় কেনেন", en: "Where you buy" },
          cells: [{ bn: "ডিএসইতে, শেয়ারের মতো", en: "On DSE, like a share" }, { bn: "সরাসরি ফান্ড কোম্পানির কাছ থেকে", en: "Directly from the fund company" }],
        },
        {
          label: { bn: "দাম কীভাবে ঠিক হয়", en: "How the price is set" },
          cells: [{ bn: "বাজারে চাহিদা ও জোগানে", en: "By supply and demand" }, { bn: "ঘোষিত এনএভি অনুযায়ী", en: "By the declared NAV" }],
        },
        {
          label: { bn: "এনএভির সঙ্গে সম্পর্ক", en: "Relation to NAV" },
          cells: [{ bn: "প্রায়ই অনেক নিচে", en: "Often well below it" }, { bn: "এনএভিতেই", en: "At NAV" }],
        },
        {
          label: { bn: "বেরোনো", en: "Getting out" },
          cells: [{ bn: "বাজারে বেচে, ক্রেতা থাকলে", en: "Sell in the market, if there is a buyer" }, { bn: "ফান্ডকে ফেরত দিয়ে", en: "Redeem with the fund" }],
          best: 1,
        },
        {
          label: { bn: "মেয়াদ", en: "Life" },
          cells: [{ bn: "নির্দিষ্ট, সাধারণত দশ বছর", en: "Fixed, usually ten years" }, { bn: "অনির্দিষ্ট", en: "Open-ended" }],
        },
      ],
    },
    "fund-lab": {
      kind: "lab",
      model: "fee-drag",
      title: { bn: "বার্ষিক খরচ কুড়ি বছরে কী করে", en: "What an annual cost does over twenty years" },
      note: {
        bn: "কমিশনের ঘরে ফান্ডের খরচের অর্ধেক বসান আর বছরে একবার ধরুন: ফলাফলটা একই আকারের।",
        en: "Put half the fund's expense ratio in the commission box and set trades to one a year: the shape of the answer is the same.",
      },
      preset: { capital: 200000, commission: 1.25, trades: 1, rate: 12, years: 20 },
    },
    "fund-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা ক্লোজড-এন্ড ফান্ডের এনএভি ১৪ টাকা আর বাজারদর ৯ টাকা। এটা কী?",
            en: "A closed-end fund has a NAV of 14 and trades at 9. What is that?",
          },
          options: [
            {
              text: { bn: "নিশ্চিত লাভ, ৫ টাকা প্রতি ইউনিট", en: "A certain 5 taka a unit" },
              why: {
                bn: "না, কারণ ছাড়টা বন্ধ হওয়ার কোনো নিশ্চয়তা নেই। বাংলাদেশে অনেক ফান্ড বছরের পর বছর একই ছাড়ে বসে থাকে, আর মেয়াদ শেষ না হলে এনএভি আর দামের মিল হওয়ার কোনো বাধ্যবাধকতা নেই।",
                en: "No, because nothing guarantees the discount closes. Plenty of funds here sit at the same discount for years, and unless the fund matures nothing forces price and NAV together.",
              },
            },
            {
              text: { bn: "একটা ছাড়, আর সেটা কমার কারণ আছে কি না সেটাই প্রশ্ন", en: "A discount, and the question is whether anything will close it" },
              right: true,
              why: {
                bn: "ঠিক। কারণ থাকতে পারে: মেয়াদ শেষ কাছে এলে দাম এনএভির দিকে যায়, বা ফান্ড ইউনিট ফেরত কিনলে। কারণ না থাকলে ছাড়টা কেবল বাজারের মতামত, আর মতামত বদলানোর কোনো সময়সূচি নেই।",
                en: "Right. There can be a reason: as maturity approaches the price converges, or the fund buys units back. Without one the discount is just the market's opinion, and opinions have no timetable.",
              },
            },
            {
              text: { bn: "ফান্ডটা খারাপ", en: "The fund is bad" },
              why: {
                bn: "ছাড় নিজে থেকে মান বলে না। ভালো ফান্ডও ছাড়ে বসে থাকে, আর খারাপ ফান্ডও। মান বোঝা যায় পোর্টফোলিও আর খরচ দেখে।",
                en: "A discount says nothing about quality on its own. Good funds sit at discounts and so do bad ones. Quality is read from the portfolio and the costs.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা ফান্ড ত্রিশটা কোম্পানিতে বিনিয়োগ করে, কিন্তু ত্রিশটাই ব্যাংক। এতে কী সমস্যা?",
            en: "A fund holds thirty companies, and all thirty are banks. What is the problem?",
          },
          options: [
            {
              text: { bn: "কোনো সমস্যা নেই, ত্রিশটা তো ত্রিশটাই", en: "None: thirty is thirty" },
              why: {
                bn: "সংখ্যা গোনা ডাইভারসিফিকেশন নয়। একই খাতের ত্রিশটা কোম্পানি একই সুদের হার, একই খেলাপি ঋণ আর একই নিয়ন্ত্রক পরিবর্তনের মুখোমুখি হয়।",
                en: "Counting names is not diversification. Thirty companies in one sector face the same interest rates, the same bad loans and the same regulatory change.",
              },
            },
            {
              text: { bn: "ঝুঁকিগুলো আলাদা নয়, তাই ছড়ানোটা কম", en: "The risks are not different, so the spreading is thinner than it looks" },
              right: true,
              why: {
                bn: "ঠিক। ডাইভারসিফিকেশনের কাজ হলো এমন জিনিস একসঙ্গে রাখা যেগুলো একসঙ্গে পড়ে না। ত্রিশটা ব্যাংক একসঙ্গেই পড়ে। <a class=\"term\" href=\"/money/terms/diversification.html\">ডাইভারসিফিকেশনের</a> লেখাটায় এটাই মূল কথা।",
                en: "Right. Diversification means holding things that do not fall together, and thirty banks fall together. The <a class=\"term\" href=\"/money/terms/diversification.html\">diversification</a> lesson is built on this point.",
              },
            },
            {
              text: { bn: "ব্যাংক খারাপ বিনিয়োগ", en: "Banks are bad investments" },
              why: {
                bn: "ব্যাংক ভালোও হতে পারে খারাপও হতে পারে, আর সেটা এই প্রশ্নের বিষয় না। সমস্যাটা কেন্দ্রীভবনের, খাতটার নয়।",
                en: "Banks can be good or bad and that is not the question here. The problem is concentration, not the sector.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"etf": {
  bn: `
<p>ইটিএফ, এক্সচেঞ্জ ট্রেডেড ফান্ড, হলো এমন একটা ফান্ড যা একটা <a class="term" href="/money/terms/dsex.html">সূচকের</a> অনুকরণ করে, আর যার ইউনিট শেয়ারের মতোই এক্সচেঞ্জে কেনাবেচা হয়।</p>

<p>মূল ধারণাটা একটা প্রশ্ন থেকে এসেছে যা ১৯৭০-এর দশকে কেউ জোরে জিজ্ঞেস করেছিলেন: ফান্ড ম্যানেজাররা যদি গড়ে সূচকের চেয়ে ভালো করতে না পারেন, তাহলে তাদের ফি দিচ্ছি কেন? সূচকটাই কিনে ফেললেই তো হয়। সেই প্রশ্ন থেকে জন্ম নেওয়া তহবিলগুলো এখন পৃথিবীর সবচেয়ে বড় বিনিয়োগ মাধ্যম।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ইটিএফ কোনো বাছাই করে না; সে সূচকে যা আছে তাই কেনে, একই ওজনে।</li>
<li>বাছাই না করায় খরচ অনেক কম, আর কম খরচ দীর্ঘমেয়াদে সবচেয়ে নির্ভরযোগ্য সুবিধা।</li>
<li>শেয়ারের মতো দিনে যেকোনো সময় কেনাবেচা করা যায়।</li>
<li>বাংলাদেশে ইটিএফ বাজার এখনো ছোট আর তারল্য কম।</li>
<li>ইটিএফ বাজারের সঙ্গে পড়ে, আর সেটাই তার নকশা।</li>
</ul>
</div>

<h2>সক্রিয় আর নিষ্ক্রিয়</h2>

${mount("etf-compare")}

<p>একটা সাধারণ <a class="term" href="/money/terms/mutual-fund.html">মিউচুয়াল ফান্ডের</a> ম্যানেজার সিদ্ধান্ত নেন: এই কোম্পানিটা ভালো, ওইটা না, এই খাতে বেশি রাখব। একে বলে সক্রিয় ব্যবস্থাপনা, আর এর জন্য গবেষণা দল লাগে, বিশ্লেষক লাগে, আর ওই খরচটা আপনার রিটার্ন থেকে যায়।</p>

<p>ইটিএফের ম্যানেজার কোনো সিদ্ধান্ত নেন না। সূচকে যে কোম্পানিগুলো যে ওজনে আছে, তিনি ঠিক সেগুলোই সেই ওজনে কেনেন। কোনো গবেষণা লাগে না, তাই ফি অনেক কম। একে বলে নিষ্ক্রিয় ব্যবস্থাপনা।</p>

<h2>কম খরচ কেন এত বড় কথা</h2>

<p>এটা এই লেখার আসল যুক্তি, আর অঙ্কটা নির্মম।</p>

${mount("etf-lab")}

<p>একটা সক্রিয় ফান্ডের খরচ যদি বছরে ২.৫% হয় আর একটা ইটিএফের ০.৫%, পার্থক্য মাত্র ২%। কিন্তু ওই ২% প্রতি বছর, চক্রবৃদ্ধিসহ। বিশ বছরে সেটা মোট ফলাফলের এক-তৃতীয়াংশের কাছাকাছি খেয়ে ফেলতে পারে। আর এই খরচটা নিশ্চিত: বাজার ভালো যাক বা খারাপ, ফি কাটা যাবেই।</p>

<p>সক্রিয় ফান্ডের হয়ে যুক্তিটা হলো ম্যানেজার এই বাড়তি ২% এর চেয়ে বেশি এনে দেবেন। কেউ কেউ দেন। কিন্তু কে দেবেন সেটা আগে থেকে জানা যায় না, আর দীর্ঘমেয়াদে বেশিরভাগ পারেন না, পৃথিবীর প্রায় সব বাজারেই।</p>

<h2>ইটিএফ কীভাবে সূচকের সঙ্গে থাকে</h2>

<p>একটা প্রশ্ন সঙ্গত: ইটিএফের ইউনিট এক্সচেঞ্জে কেনাবেচা হয় বলে তার দাম তো চাহিদা-জোগানে ঠিক হওয়ার কথা, তাহলে সেটা সূচকের সঙ্গে মিলে থাকে কীভাবে? <a class="term" href="/money/terms/mutual-fund.html">ক্লোজড-এন্ড ফান্ড</a> তো এনএভির অনেক নিচে বসে থাকে।</p>

<p>উত্তরটা একটা ব্যবস্থার মধ্যে, আর এটাই ইটিএফকে ক্লোজড-এন্ড ফান্ড থেকে আলাদা করে। ইটিএফের সঙ্গে কিছু বড় প্রতিষ্ঠান যুক্ত থাকে যারা ইচ্ছেমতো নতুন ইউনিট তৈরি করতে বা ইউনিট ভেঙে ভেতরের শেয়ারগুলো বের করে নিতে পারে। ইউনিটের দাম যদি এনএভির নিচে নামে, তারা সস্তায় ইউনিট কিনে ভেঙে ভেতরের শেয়ার বেচে দেয় আর লাভ করে; দাম উপরে গেলে উল্টোটা করে। এই কেনাবেচাটাই দামকে এনএভির কাছে টেনে রাখে।</p>

<p>এই ব্যবস্থাটার নাম creation and redemption, আর এটা কাজ করার জন্য যথেষ্ট বড় আর সক্রিয় অংশগ্রহণকারী দরকার। বাংলাদেশে বাজারটা এখনো ছোট বলে এই টানাটা দুর্বল, আর সেটাই নিচের অংশের বিষয়।</p>

<h2>বাংলাদেশে ইটিএফ</h2>

<p>এখানে সৎ থাকা দরকার: বাংলাদেশে ইটিএফ এখনো খুব ছোট একটা জগৎ। কয়েকটা ইটিএফ তালিকাভুক্ত হয়েছে, আর তাদের দৈনিক লেনদেন প্রায়ই এত কম যে <a class="term" href="/money/terms/liquidity.html">তারল্য</a> নিজেই একটা ঝুঁকি হয়ে দাঁড়ায়।</p>

<p>তাই বাস্তব পরামর্শটা এই: ধারণাটা জেনে রাখুন কারণ এটা বিনিয়োগের সবচেয়ে গুরুত্বপূর্ণ ধারণাগুলোর একটা, আর কেনার আগে দৈনিক লেনদেন দেখে নিন। যে ইটিএফে দিনে দুই লাখ টাকার লেনদেন হয়, সেটা তত্ত্বে সস্তা আর বাস্তবে বেরোনোর অযোগ্য।</p>

<div class="note">একটা জিনিস মনে রাখা দরকার। ইটিএফ কম খরচে বাজারের গড় দেয়, আর বাজারের গড় খারাপ হলে সেটাও দেয়। ২০১১ থেকে ২০১৩ পর্যন্ত ডিএসইএক্স যেভাবে ছিল, একটা ইটিএফ ঠিক সেভাবেই থাকত। ইটিএফ নিরাপত্তা নয়, দক্ষতা।</div>

<h2>নিজে যাচাই করুন</h2>

${mount("etf-quiz")}
`,
  en: `
<p>An ETF, an exchange traded fund, is a fund that copies an <a class="term" href="/money/terms/dsex.html">index</a>, and whose units trade on the exchange like a share.</p>

<p>The idea began with a question somebody asked out loud in the 1970s: if fund managers on average do not beat the index, why are we paying their fees? Why not just buy the index? The funds born from that question are now the largest investment vehicles on earth.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>An ETF makes no selections; it buys what the index holds, at the index's weights.</li>
<li>Making no selections makes it cheap, and low cost is the most reliable long-run advantage there is.</li>
<li>Units trade any time during the session, like a share.</li>
<li>The ETF market in Bangladesh is still small and thinly traded.</li>
<li>An ETF falls with the market, and that is its design.</li>
</ul>
</div>

<h2>Active and passive</h2>

${mount("etf-compare")}

<p>An ordinary <a class="term" href="/money/terms/mutual-fund.html">mutual fund</a> manager decides: this company is good, that one is not, I will overweight this sector. That is active management, and it needs research staff and analysts, and their cost comes out of your return.</p>

<p>An ETF manager decides nothing. Whatever companies the index holds at whatever weights, they buy exactly that. No research is needed, so the fee is far lower. That is passive management.</p>

<h2>Why low cost matters this much</h2>

<p>This is the real argument, and the arithmetic is unforgiving.</p>

${mount("etf-lab")}

<p>If an active fund costs 2.5% a year and an ETF 0.5%, the gap is only 2%. But that 2% recurs every year and compounds. Over twenty years it can eat close to a third of the total outcome. And the cost is certain: good market or bad, the fee is taken.</p>

<p>The case for active management is that the manager earns back more than that 2%. Some do. Which ones cannot be known in advance, and over long stretches most do not, in nearly every market on earth.</p>

<h2>How an ETF stays with its index</h2>

<p>A fair question: if ETF units trade on an exchange, their price is set by supply and demand, so how do they stay near the index? <a class="term" href="/money/terms/mutual-fund.html">Closed-end funds</a> sit well below NAV for years.</p>

<p>The answer is a mechanism, and it is what separates an ETF from a closed-end fund. Large institutions are attached to an ETF and may create new units at will, or break units apart and take the underlying shares out. If the unit price drops below NAV they buy units cheaply, break them, sell the shares inside and pocket the difference; above NAV they do the reverse. That trading is what pulls the price back to NAV.</p>

<p>The mechanism is called creation and redemption, and it needs participants large and active enough to bother. Bangladesh's market is still small, so the pull is weak, which is the subject of the next section.</p>

<h2>ETFs in Bangladesh</h2>

<p>Honesty is required here: the ETF world in Bangladesh is still very small. A handful are listed and their daily turnover is often low enough that <a class="term" href="/money/terms/liquidity.html">liquidity</a> becomes a risk of its own.</p>

<p>So the practical advice is this: learn the idea, because it is one of the most important ideas in investing, and check daily turnover before buying. An ETF that trades two lakh taka a day is cheap in theory and impossible to leave in practice.</p>

<div class="note">One thing to hold on to. An ETF gives you the market's average cheaply, and when the average is bad it gives you that too. Whatever DSEX did from 2011 to 2013, an ETF would have done the same. An ETF is not safety, it is efficiency.</div>

<h2>Check yourself</h2>

${mount("etf-quiz")}
`,
  blocks: {
    "etf-compare": {
      kind: "compare",
      title: { bn: "সক্রিয় ফান্ড আর ইটিএফ", en: "An active fund and an ETF" },
      columns: [
        { bn: "সক্রিয় ফান্ড", en: "Active fund" },
        { bn: "ইটিএফ", en: "ETF" },
      ],
      rows: [
        {
          label: { bn: "কী কেনে", en: "What it buys" },
          cells: [{ bn: "ম্যানেজার যা বাছেন", en: "Whatever the manager picks" }, { bn: "সূচকে যা আছে", en: "Whatever the index holds" }],
        },
        {
          label: { bn: "বার্ষিক খরচ", en: "Annual cost" },
          cells: [{ bn: "সাধারণত ২% থেকে ৩%", en: "Usually 2% to 3%" }, { bn: "অনেক কম", en: "Much lower" }],
          best: 1,
        },
        {
          label: { bn: "সূচককে হারাতে পারে?", en: "Can it beat the index?" },
          cells: [{ bn: "পারে, আর বেশিরভাগ পারে না", en: "It can, and most do not" }, { bn: "না, নকশাতেই না", en: "No, by design" }],
        },
        {
          label: { bn: "কী জানা থাকে", en: "What you know in advance" },
          cells: [{ bn: "কেবল অতীত", en: "Only the past" }, { bn: "ঠিক কী কিনছেন", en: "Exactly what you are buying" }],
          best: 1,
        },
        {
          label: { bn: "বাংলাদেশে তারল্য", en: "Liquidity in Bangladesh" },
          cells: [{ bn: "ভালোগুলোতে মোটামুটি", en: "Reasonable in the larger ones" }, { bn: "এখনো কম", en: "Still thin" }],
          best: 0,
        },
      ],
    },
    "etf-lab": {
      kind: "lab",
      model: "fee-drag",
      title: { bn: "খরচের পার্থক্য বিশ বছরে", en: "A cost gap over twenty years" },
      note: {
        bn: "কমিশনের ঘরে ফান্ডের বার্ষিক খরচ বসান, লেনদেন একবার ধরুন, আর দুইটা খরচের হারে চালিয়ে তুলনা করুন।",
        en: "Put the annual expense ratio in the commission box, set trades to one, and run it at two different costs.",
      },
      preset: { capital: 500000, commission: 1.25, trades: 1, rate: 12, years: 20 },
    },
    "etf-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "সূচক এক বছরে ২০% পড়েছে। ওই সূচক অনুসরণকারী ইটিএফের কী হয়েছে?",
            en: "The index fell 20% in a year. What happened to an ETF tracking it?",
          },
          options: [
            {
              text: { bn: "কম পড়েছে, কারণ ম্যানেজার রক্ষা করেছেন", en: "It fell less, because the manager protected it" },
              why: {
                bn: "ইটিএফের ম্যানেজার কিছুই করেন না, আর সেটাই তার সংজ্ঞা। রক্ষা করার কোনো ব্যবস্থা এখানে নেই।",
                en: "An ETF manager does nothing, which is the definition. There is no protective mechanism here.",
              },
            },
            {
              text: { bn: "প্রায় ২০% পড়েছে, খরচটুকু বাদে", en: "It fell about 20%, plus its costs" },
              right: true,
              why: {
                bn: "ঠিক। ইটিএফ সূচকের সঙ্গে ওঠে আর পড়ে, এবং খরচের কারণে সামান্য পিছিয়ে থাকে। এটাই নকশা, ব্যর্থতা নয়, আর এটা জেনে কেনাটাই আসল কথা।",
                en: "Right. An ETF rises and falls with the index and trails it slightly because of costs. That is the design rather than a failure, and buying it knowing that is the point.",
              },
            },
            {
              text: { bn: "বেড়েছে, কারণ ইটিএফ নিরাপদ", en: "It rose, because ETFs are safe" },
              why: {
                bn: "ইটিএফ একটা কোম্পানির ঝুঁকি সরায়, বাজারের ঝুঁকি নয়। বাজার পড়লে ইটিএফ পড়ে, প্রতিবার।",
                en: "An ETF removes single-company risk, not market risk. When the market falls it falls, every time.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা ইটিএফের খরচ ০.৫% আর একটা সক্রিয় ফান্ডের ২.৫%। সক্রিয় ফান্ডটা বেছে নেওয়ার যুক্তি কী হতে পারে?",
            en: "An ETF costs 0.5% and an active fund 2.5%. What could justify the active fund?",
          },
          options: [
            {
              text: { bn: "ম্যানেজার ধারাবাহিকভাবে ২% এর বেশি বাড়তি রিটার্ন আনতে পারলে", en: "The manager consistently earning back more than 2%" },
              right: true,
              why: {
                bn: "ঠিক, আর সেটাই একমাত্র যুক্তি। প্রশ্নটা হলো কে পারবেন তা আগে থেকে কীভাবে জানবেন, আর অতীতের ভালো ফল ভবিষ্যতের প্রতিশ্রুতি নয়। অন্তত পাঁচ বছরের তুলনা দেখুন, এক বছরের নয়।",
                en: "Right, and it is the only justification. The question is how you identify that manager in advance, and past performance is not a promise. Look at five years against the index, not one.",
              },
            },
            {
              text: { bn: "সক্রিয় ফান্ড বেশি নিরাপদ", en: "Active funds are safer" },
              why: {
                bn: "খরচ বেশি হওয়া নিরাপত্তা কেনে না। সক্রিয় ফান্ডের ঝুঁকি প্রায়ই বেশি, কারণ ম্যানেজার কিছু কোম্পানিতে বেশি ওজন রাখেন।",
                en: "Paying more does not buy safety. Active funds often carry more risk, because a manager concentrates into particular names.",
              },
            },
            {
              text: { bn: "বাংলাদেশে ইটিএফের তারল্য কম", en: "ETF liquidity is thin in Bangladesh" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর এটা এখানে সত্যিকারের ব্যবহারিক কারণ। যে জিনিস বেচা যায় না, সেটার কম খরচ কোনো কাজে আসে না। দৈনিক লেনদেন দেখে সিদ্ধান্ত নিন।",
                en: "Yes, and here that is a genuine practical reason. Low cost is worthless in something you cannot sell. Let daily turnover decide.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"sanchayapatra": {
  bn: `
<p>সঞ্চয়পত্র হলো সরকারের কাছে টাকা ধার দেওয়া। আপনি টাকা দেন, সরকার নির্দিষ্ট মেয়াদে নির্দিষ্ট হারে মুনাফা দেয়, আর মেয়াদ শেষে আসল ফেরত দেয়। বাংলাদেশে এটাই সবচেয়ে জনপ্রিয় নিরাপদ সঞ্চয়ের মাধ্যম, আর ব্যাংকের এফডিআরের চেয়ে সাধারণত বেশি হার দেয়।</p>

<p>জনপ্রিয়তার কারণ তিনটা: হার বেশি, ঝুঁকি প্রায় শূন্য, আর প্রক্রিয়াটা পরিচিত। ডাকঘর বা ব্যাংকে গিয়ে কেনা যায়, কোনো <a class="term" href="/money/terms/bo-account.html">বিও অ্যাকাউন্ট</a> লাগে না, কোনো দাম ওঠানামা করে না।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>সরকারের ঋণ, তাই ফেরত না পাওয়ার ঝুঁকি কার্যত নেই।</li>
<li>কয়েকটা ধরন আছে, আর প্রতিটার আলাদা যোগ্যতা, মেয়াদ আর হার।</li>
<li>কেনার সীমা আছে, ব্যক্তি ও যৌথ নামে আলাদা।</li>
<li>মুনাফায় উৎসে কর কাটা হয়, আর মেয়াদের আগে ভাঙলে হার কমে।</li>
<li>নিরাপদ, আর মূল্যস্ফীতির পর আসল রিটার্ন প্রায়ই এক শতাংশের কাছাকাছি।</li>
</ul>
</div>

<h2>ধরনগুলো</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>ধরন</th><th>কার জন্য</th><th>মেয়াদ</th><th>মুনাফা কীভাবে</th></tr>
</thead>
<tbody>
<tr><td>পাঁচ বছর মেয়াদি</td><td>যে কেউ</td><td>৫ বছর</td><td>মেয়াদ শেষে বা কিস্তিতে</td></tr>
<tr><td>তিন মাস অন্তর মুনাফাভিত্তিক</td><td>যে কেউ</td><td>৩ বছর</td><td>প্রতি তিন মাসে</td></tr>
<tr><td>পরিবার সঞ্চয়পত্র</td><td>নারী, প্রতিবন্ধী ও ৬৫ ঊর্ধ্ব</td><td>৫ বছর</td><td>প্রতি মাসে</td></tr>
<tr><td>পেনশনার সঞ্চয়পত্র</td><td>অবসরপ্রাপ্ত সরকারি কর্মচারী</td><td>৫ বছর</td><td>প্রতি তিন মাসে</td></tr>
</tbody>
</table>
</div>

<div class="note">হার, সীমা আর যোগ্যতার শর্ত সরকার বাজেটে বদলায়, আর গত কয়েক বছরে বেশ কয়েকবার বদলেছে। কেনার আগে জাতীয় সঞ্চয় অধিদপ্তরের সাইট থেকে চলতি সংখ্যা মিলিয়ে নিন। এই লেখায় কোনো নির্দিষ্ট হার লেখা নেই, ইচ্ছাকৃতভাবে: একটা লেখা যে সংখ্যা ধরে রাখতে পারে না, সে সংখ্যা লিখলে সেটা পরের বছরেই ভুল হয়ে যায়।</div>

<h2>আসল রিটার্নটা মেপে দেখুন</h2>

<p>এই হিসাবটা এই লেখার সবচেয়ে গুরুত্বপূর্ণ অংশ, আর অনেকের কাছে অস্বস্তিকর।</p>

${mount("sp-lab")}

<p>ঘোষিত হার ১১.৫% শুনলে ভালো লাগে। কর কাটার পর সেটা প্রায় ১০.৪%, আর মূল্যস্ফীতি ৯.৫% হলে হাতে থাকে প্রায় ০.৮%। মানে আপনার সম্পদ প্রায় একই জায়গায় দাঁড়িয়ে থাকে, নড়ে না।</p>

<p>এটা সঞ্চয়পত্রকে খারাপ বানায় না। এটা বলে দেয় সঞ্চয়পত্র কী কাজের জন্য: টাকা ধরে রাখার জন্য, বাড়ানোর জন্য নয়। তিন থেকে পাঁচ বছরের লক্ষ্যের জন্য এটাই ঠিক জায়গা, আর ত্রিশ বছরের লক্ষ্যের জন্য নয়।</p>

<h2>যেখানে বেশিরভাগ পরিবার ভুল করে</h2>

<p>বাংলাদেশে একটা প্যাটার্ন আছে যা প্রজন্মের পর প্রজন্ম চলছে: পুরো সঞ্চয়টাই সঞ্চয়পত্রে। যুক্তিটা বোঝা যায়, কারণ ১৯৯০-এর দশকে হার ছিল অনেক বেশি আর মূল্যস্ফীতি কম, তাই তখন এটা সত্যিই ভালো কাজ করত।</p>

<p>পরিস্থিতি বদলেছে আর অভ্যাসটা বদলায়নি। আজ যে পরিবার তাদের পুরো সম্পদ সঞ্চয়পত্রে রাখেন, তারা মূল্যস্ফীতির সমান দৌড়াচ্ছেন, এগোচ্ছেন না। ত্রিশ বছরে এই পার্থক্যটা বিশাল হয়ে দাঁড়ায়।</p>

${mount("sp-figure")}

<h2>একটা সৎ সুবিধা</h2>

<p>তবু সঞ্চয়পত্রের একটা জিনিস আছে যা কোনো শেয়ার বা ফান্ড দিতে পারে না: নিশ্চয়তা। আপনি জানেন কত পাবেন আর কবে পাবেন। যে পরিবার প্রতি মাসের মুনাফা দিয়ে সংসার চালান, তাদের জন্য এই নিশ্চয়তাটাই পুরো জিনিস, আর ওই ক্ষেত্রে বেশি রিটার্নের কথা তোলা অপ্রাসঙ্গিক।</p>

<p>তাই প্রশ্নটা সঞ্চয়পত্র ভালো না খারাপ তা না। প্রশ্নটা হলো আপনার কোন টাকাটা এখানে থাকা উচিত। উত্তরটা <a class="term" href="/money/start/your-goal.html">লক্ষ্যের</a> লেখাটায় আছে: যে টাকা তিন থেকে পাঁচ বছরে লাগবে আর যার নড়চড় সহ্য হবে না।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("sp-quiz")}
`,
  en: `
<p>A savings certificate is a loan to the government. You pay in, the government pays a fixed rate over a fixed term, and returns the principal at the end. It is the most popular safe saving in Bangladesh and usually pays more than a bank deposit.</p>

<p>Three reasons for the popularity: the rate is higher, the risk is near zero, and the process is familiar. You buy at a post office or a bank, no <a class="term" href="/money/terms/bo-account.html">BO account</a> is needed, and no price moves.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>It is government debt, so the risk of not being repaid is effectively nil.</li>
<li>Several kinds exist, each with its own eligibility, term and rate.</li>
<li>There are purchase limits, different for single and joint holdings.</li>
<li>Tax is withheld on the profit, and breaking the term early cuts the rate.</li>
<li>Safe, and the real return after inflation is often close to one percent.</li>
</ul>
</div>

<h2>The kinds</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>Kind</th><th>Who can buy</th><th>Term</th><th>How profit is paid</th></tr>
</thead>
<tbody>
<tr><td>Five year certificate</td><td>Anybody</td><td>5 years</td><td>At maturity or in instalments</td></tr>
<tr><td>Three-monthly profit bearing</td><td>Anybody</td><td>3 years</td><td>Every three months</td></tr>
<tr><td>Family savings certificate</td><td>Women, people with disabilities, over 65</td><td>5 years</td><td>Monthly</td></tr>
<tr><td>Pensioner savings certificate</td><td>Retired government employees</td><td>5 years</td><td>Every three months</td></tr>
</tbody>
</table>
</div>

<div class="note">Rates, limits and eligibility change with the budget, and have changed several times in recent years. Check the Directorate of National Savings site for current numbers before buying. No specific rate appears in this lesson, deliberately: a number a lesson cannot keep true is a number that is wrong by next year.</div>

<h2>Measure the real return</h2>

<p>This calculator is the most important part of the lesson, and uncomfortable for a lot of people.</p>

${mount("sp-lab")}

<p>An advertised 11.5% sounds good. After tax it is about 10.4%, and with inflation at 9.5% what you keep is about 0.8%. Your wealth stands roughly where it was; it does not move.</p>

<p>That does not make savings certificates bad. It tells you what they are for: holding money rather than growing it. Right for a three to five year goal, wrong for a thirty year one.</p>

<h2>Where most families go wrong</h2>

<p>There is a pattern here running through generations: the entire savings in savings certificates. The logic is understandable, because in the 1990s the rates were much higher and inflation lower, so it genuinely worked.</p>

<p>The conditions changed and the habit did not. A family holding all its wealth in certificates today is running level with inflation rather than gaining on it. Over thirty years that difference becomes enormous.</p>

${mount("sp-figure")}

<h2>One honest advantage</h2>

<p>Still, savings certificates have something no share or fund can offer: certainty. You know how much and you know when. For a family living on the monthly profit that certainty is the entire point, and talking about higher returns to them is beside it.</p>

<p>So the question is not whether savings certificates are good or bad. It is which of your money belongs here. The <a class="term" href="/money/start/your-goal.html">goals</a> lesson answers it: the money you need in three to five years, that cannot take a wobble.</p>

<h2>Check yourself</h2>

${mount("sp-quiz")}
`,
  blocks: {
    "sp-lab": {
      kind: "lab",
      model: "fdr-real",
      title: { bn: "ঘোষিত হার, আর যা হাতে থাকে", en: "The advertised rate and what you keep" },
      note: {
        bn: "চলতি হার বসিয়ে নিন, আর মূল্যস্ফীতি নাড়িয়ে দেখুন কত সহজে সংখ্যাটা শূন্যের নিচে যায়।",
        en: "Put in the current rate and move inflation to see how easily the number goes below zero.",
      },
      preset: { rate: 11.5, tax: 10, inflation: 9.5 },
    },
    "sp-figure": {
      kind: "figure",
      shape: "timeline",
      title: { bn: "সঞ্চয়পত্র কেন একদিন যথেষ্ট ছিল আর এখন নয়", en: "Why certificates were once enough and are not now" },
      parts: [
        {
          text: { bn: "হার অনেক উঁচু, মূল্যস্ফীতি মাঝারি। শুধু সঞ্চয়পত্রেই সম্পদ সত্যিই বাড়ত।", en: "Rates high, inflation moderate. Wealth genuinely grew on certificates alone." },
          note: { bn: "নব্বইয়ের দশক", en: "The 1990s" },
          tone: "good",
        },
        {
          text: { bn: "হার নামতে শুরু করে, আর সীমা বসে।", en: "Rates begin to fall and caps arrive." },
          note: { bn: "২০১০ এর দশক", en: "The 2010s" },
          tone: "warn",
        },
        {
          text: { bn: "উৎসে কর বাড়ে, মূল্যস্ফীতি উঁচু থাকে। আসল রিটার্ন শূন্যের কাছে নেমে আসে।", en: "Withholding rises and inflation stays high. The real return lands near zero." },
          note: { bn: "২০২০ এর দশক", en: "The 2020s" },
          tone: "bad",
        },
        {
          text: { bn: "অভ্যাসটা রয়ে গেছে, আর অভ্যাসটা এখন আর অঙ্কটা মেলায় না।", en: "The habit remains, and the habit no longer matches the arithmetic." },
          note: { bn: "আজ", en: "Today" },
          tone: "bad",
        },
      ],
      caption: {
        bn: "কেউ ভুল করেনি। পরিস্থিতি বদলেছে আর সিদ্ধান্তটা বদলায়নি, যা সঞ্চয় নিয়ে সবচেয়ে সাধারণ ভুল।",
        en: "Nobody made a mistake. The conditions changed and the decision did not, which is the commonest error in saving.",
      },
    },
    "sp-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একজন ৩২ বছর বয়সী মানুষ তার পুরো সঞ্চয় সঞ্চয়পত্রে রাখছেন, অবসরের জন্য। কী সমস্যা?",
            en: "Someone of 32 keeps all their savings in certificates, for retirement. What is wrong?",
          },
          options: [
            {
              text: { bn: "কোনো সমস্যা নেই, নিরাপদ তো", en: "Nothing: it is safe" },
              why: {
                bn: "নিরাপদ শোনায় আর নিরাপদ নয়। ত্রিশ বছরে মূল্যস্ফীতির পর প্রায় শূন্য রিটার্ন মানে সম্পদ একই জায়গায় দাঁড়িয়ে থাকা, আর ওই সময়ে তার সবচেয়ে বেশি বাড়ার সুযোগ ছিল।",
                en: "It sounds safe and is not. A near-zero real return over thirty years means wealth standing still, in the one period when it had the most room to grow.",
              },
            },
            {
              text: { bn: "ত্রিশ বছরের টাকা এমন জায়গায় আছে যেখানে মূল্যস্ফীতির পর কিছুই বাড়ে না", en: "Thirty year money is somewhere it does not grow after inflation" },
              right: true,
              why: {
                bn: "ঠিক। সময় যত লম্বা, ওঠানামা তত কম গুরুত্বপূর্ণ আর মূল্যস্ফীতি তত বেশি গুরুত্বপূর্ণ। এই বয়সে ঝুঁকি নেওয়ার সামর্থ্য সবচেয়ে বেশি, আর সেটা ব্যবহার না করাটাই এখানে ঝুঁকি।",
                en: "Right. The longer the horizon, the less volatility matters and the more inflation does. Capacity for risk is at its highest at that age, and not using it is the risk here.",
              },
            },
            {
              text: { bn: "সঞ্চয়পত্র বেআইনি", en: "Savings certificates are illegal" },
              why: {
                bn: "একেবারেই না, সরকার নিজেই বিক্রি করে। প্রশ্নটা বৈধতার না, উপযুক্ততার।",
                en: "Not at all: the government sells them. The question is suitability, not legality.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কোন টাকাটা সঞ্চয়পত্রে থাকা উচিত? একাধিক উত্তর ঠিক।",
            en: "Which money belongs in savings certificates? More than one is right.",
          },
          options: [
            {
              text: { bn: "তিন বছর পর সন্তানের ভর্তির জন্য রাখা টাকা", en: "Money for a child's admission in three years" },
              right: true,
              why: {
                bn: "হ্যাঁ। তারিখ নির্দিষ্ট আর অঙ্কটা নিশ্চিত থাকা দরকার, তাই নিশ্চয়তাই এখানে বেশি দামি।",
                en: "Yes. The date is fixed and the amount has to be certain, so certainty is worth more here than growth.",
              },
            },
            {
              text: { bn: "অবসরপ্রাপ্ত বাবা-মায়ের মাসিক খরচের উৎস", en: "A retired parent's monthly income" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর এই ক্ষেত্রে পরিবার সঞ্চয়পত্র বা তিন মাস অন্তর মুনাফাভিত্তিকটাই নকশা করা হয়েছে। নিয়মিত নিশ্চিত আয়ের বিকল্প কম।",
                en: "Yes, and the family and quarterly-profit certificates were designed for exactly this. There are few alternatives for reliable regular income.",
              },
            },
            {
              text: { bn: "পঁচিশ বছর বয়সীর অবসরের তহবিল", en: "A 25 year old's retirement savings" },
              why: {
                bn: "না। এই সময়ের দৈর্ঘ্যে মূল্যস্ফীতিই প্রধান শত্রু, আর সঞ্চয়পত্র ঠিক ওই শত্রুর বিরুদ্ধে কিছুই করে না।",
                en: "No. Over that horizon inflation is the enemy, and this is the one thing certificates do nothing about.",
              },
            },
            {
              text: { bn: "জরুরি তহবিল", en: "The emergency fund" },
              why: {
                bn: "না, আর কারণটা মেয়াদ। জরুরি অবস্থা মেয়াদ শেষ হওয়ার অপেক্ষা করে না, আর আগে ভাঙলে হার কমে যায়। জরুরি তহবিল সেভিংস অ্যাকাউন্টে।",
                en: "No, and the reason is the term. An emergency does not wait for maturity, and breaking early cuts the rate. The emergency fund belongs in a savings account.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"fdr": {
  bn: `
<p>এফডিআর, ফিক্সড ডিপোজিট রিসিট, হলো ব্যাংকে নির্দিষ্ট মেয়াদে টাকা রেখে নির্দিষ্ট হারে মুনাফা নেওয়া। বাংলাদেশে প্রায় প্রতিটা পরিবার এটা চেনে, আর অনেকের কাছে সঞ্চয় মানেই এফডিআর।</p>

<p>জিনিসটা যা মনে হয় তার চেয়ে একটু আলাদা, আর পার্থক্যটা বোঝা দরকার। এফডিআরে আপনি ব্যাংককে টাকা ধার দিচ্ছেন। ব্যাংক ওই টাকা অন্য কাউকে বেশি সুদে ধার দেয়, আর পার্থক্যটা তার আয়। আপনি একজন পাওনাদার, মালিক নন, আর এইজন্যই আপনার রিটার্ন নির্দিষ্ট: ব্যাংক ভালো করুক বা খারাপ, আপনি ওই চুক্তির হারটাই পাবেন।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ব্যাংককে ধার দেওয়া, নির্দিষ্ট মেয়াদে নির্দিষ্ট হারে।</li>
<li>মুনাফায় উৎসে কর কাটা হয়, আর টিআইএন না থাকলে বেশি।</li>
<li>মেয়াদের আগে ভাঙলে হার কমে, প্রায়ই অনেকটাই।</li>
<li>ব্যাংক ডুবলে আমানত বিমার একটা সীমা আছে, আর সেটা জেনে রাখা দরকার।</li>
<li>মূল্যস্ফীতির পর আসল রিটার্ন প্রায়ই শূন্যের কাছাকাছি বা নিচে।</li>
</ul>
</div>

<h2>হারটা কীভাবে ঠিক হয়</h2>

<p>ব্যাংক আপনাকে যে হার দেয় সেটা আকাশ থেকে আসে না। তিনটা জিনিস সেটা ঠিক করে: বাংলাদেশ ব্যাংকের নীতি সুদহার, ব্যাংকের নিজের টাকার প্রয়োজন, আর প্রতিযোগিতা।</p>

<p>নীতি সুদহার বাড়লে সব ব্যাংকের আমানতের হার বাড়ে, কারণ সরকারের ট্রেজারি বিলেই তখন বেশি পাওয়া যায় আর ব্যাংকগুলোকে তার সঙ্গে প্রতিযোগিতা করতে হয়। এইজন্যই <a class="term" href="/money/basics-2/bangladesh-bank.html">বাংলাদেশ ব্যাংকের</a> সিদ্ধান্ত আপনার এফডিআরের হারে গিয়ে ঠেকে, আর এইজন্যই ওই খবরগুলো পড়া কাজের।</p>

<div class="ex"><b>উদাহরণ:</b> একই দিনে দুইটা ব্যাংক দুই রকম হার দিতে পারে, আর প্রায়ই দেয়। যে ব্যাংকের টাকার টান বেশি সে বেশি হার দেয়, আর টাকার টান থাকার একটা কারণ খেলাপি ঋণ। মানে সবচেয়ে বেশি হার দেওয়া ব্যাংকটাই সবচেয়ে নিরাপদ নাও হতে পারে। হার তুলনা করার সময় ব্যাংকটার নাম আর অবস্থাও দেখুন, কেবল সংখ্যাটা নয়।</div>

<h2>আসল রিটার্ন</h2>

${mount("fdr-lab")}

<p>উপরের হিসাবটা এই পাঠশালায় বারবার ফিরে আসে, কারণ এটাই সেই সংখ্যা যা মানুষ কখনো হিসাব করেন না। ঘোষিত হার একটা বিজ্ঞাপন; কর কাটার পর আর মূল্যস্ফীতির পর যা থাকে সেটাই আপনার।</p>

<h2>ভাঙার শাস্তি</h2>

<p>এফডিআরের একটা বৈশিষ্ট্য যা কেনার সময় কেউ পড়েন না: মেয়াদের আগে ভাঙলে সুদের হার নাটকীয়ভাবে কমে যায়। একটা তিন বছরের এফডিআর এগারো মাসে ভাঙলে আপনি হয়তো তিন বছরের হার নয়, সেভিংস অ্যাকাউন্টের হার পাবেন, আর কিছু ক্ষেত্রে জরিমানাও।</p>

<p>এইজন্যই <a class="term" href="/money/start/money-first.html">জরুরি তহবিল</a> এফডিআরে রাখা উচিত নয়। জরুরি অবস্থা মেয়াদ শেষ হওয়ার অপেক্ষা করে না, আর যেদিন টাকা লাগবে সেদিন এফডিআর ভাঙা মানে বছরের পুরো সুদটা হারানো।</p>

${mount("fdr-figure")}

<h2>ব্যাংক ডুবলে</h2>

<p>বাংলাদেশে আমানত বিমা ব্যবস্থা আছে: একটা ব্যাংক অবসায়িত হলে প্রতি আমানতকারীকে একটা নির্দিষ্ট সীমা পর্যন্ত ফেরত দেওয়ার ব্যবস্থা। সীমার সংখ্যাটা সরকার বদলায়, তাই এখানে লেখা নেই, আর বাংলাদেশ ব্যাংকের সাইট থেকে জেনে নেওয়া যায়।</p>

<p>বাস্তবে বাংলাদেশে বড় ব্যাংক ডুবতে দেওয়া হয় না, একীভূত করা হয় বা সহায়তা দেওয়া হয়। তবু বিষয়টা জানা থাকা ভালো, আর তার একটা ব্যবহারিক ফল আছে: বড় অঙ্কের আমানত একটা ব্যাংকে না রেখে দুই-তিনটায় ভাগ করা একটা যুক্তিসঙ্গত সতর্কতা।</p>

<h2>এফডিআর কার জন্য</h2>

<p>উত্তরটা <a class="term" href="/money/start/your-goal.html">লক্ষ্যের</a> লেখাটার সঙ্গে মেলে: যে টাকা এক থেকে তিন বছরে লাগবে আর যার অঙ্কটা নিশ্চিত থাকা দরকার। বিয়ের খরচ, ভর্তির ফি, ব্যবসার একটা নির্দিষ্ট কিস্তি। এই টাকা শেয়ারে রাখা ভুল, আর এফডিআরে রাখা ঠিক।</p>

<p>যে টাকা দশ বছরে লাগবে, সেটা এফডিআরে রাখা মানে দশ বছর মূল্যস্ফীতির সঙ্গে সমানে দৌড়ে জায়গায় দাঁড়িয়ে থাকা।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("fdr-quiz")}
`,
  en: `
<p>A fixed deposit, an FDR, is money placed with a bank for a fixed term at a fixed rate. Nearly every family in Bangladesh knows it, and for many people saving simply means an FDR.</p>

<p>It is slightly different from what it seems, and the difference is worth understanding. In an FDR you are lending to the bank. The bank lends that money on at a higher rate and keeps the difference. You are a creditor, not an owner, and that is why your return is fixed: whether the bank does well or badly, you get the contracted rate.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Lending to a bank, at a fixed rate for a fixed term.</li>
<li>Tax is withheld on the profit, and more of it without a TIN.</li>
<li>Breaking it early cuts the rate, often sharply.</li>
<li>Deposit insurance exists with a cap, and the cap is worth knowing.</li>
<li>After inflation the real return is usually near zero or below it.</li>
</ul>
</div>

<h2>How the rate is set</h2>

<p>The rate a bank offers does not come from nowhere. Three things set it: Bangladesh Bank's policy rate, the bank's own need for money, and competition.</p>

<p>When the policy rate rises, deposit rates rise across banks, because government treasury bills now pay more and banks have to compete with them. That is why a <a class="term" href="/money/basics-2/bangladesh-bank.html">Bangladesh Bank</a> decision reaches your FDR rate, and why those news items are worth reading.</p>

<div class="ex"><b>Example:</b> Two banks can offer different rates on the same day, and often do. A bank short of funds offers more, and one reason for being short of funds is bad loans. So the bank offering the highest rate is not necessarily the safest. When comparing rates, look at the bank as well as the number.</div>

<h2>The real return</h2>

${mount("fdr-lab")}

<p>This calculation recurs throughout this school, because it is the sum nobody performs. The advertised rate is an advertisement; what survives tax and inflation is yours.</p>

<h2>The penalty for breaking</h2>

<p>One feature of an FDR that nobody reads at the counter: break it early and the rate falls dramatically. Break a three year deposit at eleven months and you may get the savings account rate instead of the three year rate, and in some cases a penalty on top.</p>

<p>Which is exactly why an <a class="term" href="/money/start/money-first.html">emergency fund</a> does not belong in an FDR. An emergency does not wait for maturity, and breaking one on the day you need the money means losing the year's interest.</p>

${mount("fdr-figure")}

<h2>If a bank fails</h2>

<p>Bangladesh has deposit insurance: if a bank is wound up, each depositor is covered up to a set limit. The government changes the limit, so it is not written here, and Bangladesh Bank's site has it.</p>

<p>In practice large banks here are not allowed to fail; they are merged or supported. It is still worth knowing, and there is a practical consequence: splitting a large deposit across two or three banks rather than one is a reasonable precaution.</p>

<h2>Who a fixed deposit is for</h2>

<p>The answer matches the <a class="term" href="/money/start/your-goal.html">goals</a> lesson: money needed in one to three years whose amount has to be certain. A wedding, an admission fee, a known business instalment. That money is wrong in shares and right in a deposit.</p>

<p>Money needed in ten years, left in a deposit, spends ten years running level with inflation and standing still.</p>

<h2>Check yourself</h2>

${mount("fdr-quiz")}
`,
  blocks: {
    "fdr-lab": {
      kind: "lab",
      model: "fdr-real",
      title: { bn: "এফডিআরের আসল রিটার্ন", en: "What a fixed deposit really returns" },
      preset: { rate: 8.5, tax: 10, inflation: 9 },
    },
    "fdr-figure": {
      kind: "figure",
      shape: "matrix",
      title: { bn: "কোন টাকা কোথায়", en: "Which money goes where" },
      axes: {
        x: [{ bn: "টাকা লাগতে পারে যেকোনো দিন", en: "Might be needed any day" }, { bn: "তারিখটা জানা", en: "The date is known" }],
        y: [{ bn: "১ বছরের কম", en: "Under a year" }, { bn: "১ থেকে ৩ বছর", en: "One to three years" }],
      },
      parts: [
        { text: { bn: "সেভিংস অ্যাকাউন্ট", en: "A savings account" }, note: { bn: "জরুরি তহবিল এখানে, এফডিআরে নয়", en: "The emergency fund lives here, not in a deposit" }, tone: "good" },
        { text: { bn: "এক থেকে তিন বছরের এফডিআর", en: "A one to three year deposit" }, note: { bn: "এখানেই এফডিআর সবচেয়ে ভালো কাজ করে", en: "This is where a deposit does its best work" }, tone: "lead" },
        { text: { bn: "সেভিংস, বা খুব ছোট মেয়াদের এফডিআর", en: "Savings, or a very short deposit" }, note: { bn: "ভাঙার শাস্তির চেয়ে কম সুদ ভালো", en: "Less interest beats a breakage penalty" }, tone: "plain" },
        { text: { bn: "তিন মাস বা ছয় মাসের এফডিআর", en: "A three or six month deposit" }, note: { bn: "তারিখ জানা থাকলে মেয়াদটাও মিলিয়ে নিন", en: "If the date is known, match the term to it" }, tone: "plain" },
      ],
      caption: {
        bn: "এফডিআরের মেয়াদটা টাকার দরকারের তারিখের সঙ্গে মেলানোই পুরো কৌশল।",
        en: "Matching the term to the date you need the money is the whole technique.",
      },
    },
    "fdr-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা ব্যাংক অন্যদের চেয়ে ২% বেশি হার দিচ্ছে। এতে কী ভাবা উচিত?",
            en: "A bank is offering 2% more than the others. What should you think?",
          },
          options: [
            {
              text: { bn: "সুযোগ, সবচেয়ে বেশি হার নেওয়া উচিত", en: "An opportunity: take the highest rate" },
              why: {
                bn: "হতে পারে, আর প্রশ্নটা আগে করা দরকার: বেশি দিচ্ছে কেন? যে ব্যাংকের হাতে টাকা কম তাকে বেশি দিতে হয়, আর টাকা কম থাকার একটা সাধারণ কারণ খেলাপি ঋণ।",
                en: "Possibly, and one question comes first: why more? A bank short of funds has to pay more, and a common reason for being short is bad loans.",
              },
            },
            {
              text: { bn: "কেন বেশি দিচ্ছে সেটা খোঁজা উচিত", en: "Find out why they are paying more" },
              right: true,
              why: {
                bn: "ঠিক। ব্যাংকটার খেলাপি ঋণের হার আর মূলধন পর্যাপ্ততা বাংলাদেশ ব্যাংকের প্রকাশিত তথ্যে থাকে। ২% বাড়তি সুদের বিপরীতে যদি আমানত ফেরত পাওয়া নিয়ে প্রশ্ন থাকে, বিনিময়টা ভালো না।",
                en: "Right. A bank's bad loan ratio and capital adequacy are in Bangladesh Bank's published data. Two extra points of interest against a question over getting your money back is not a good trade.",
              },
            },
            {
              text: { bn: "এড়িয়ে যাওয়া উচিত, বেশি হার মানেই বিপদ", en: "Avoid it: a high rate always means danger" },
              why: {
                bn: "এতটাও না। নতুন ব্যাংক বাজারে ঢুকতে বেশি দেয়, আর সেটা স্বাভাবিক প্রতিযোগিতা। কথাটা এড়িয়ে যাওয়ার নয়, কারণ জানার।",
                en: "Not that far. New banks pay up to win business, which is ordinary competition. The point is not avoidance, it is knowing the reason.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "তিন বছরের এফডিআর দশ মাসে ভাঙলে কী হয়?",
            en: "What happens if you break a three year deposit at ten months?",
          },
          options: [
            {
              text: { bn: "দশ মাসের সুদটা পাবেন, তিন বছরের হারে", en: "You get ten months of interest at the three year rate" },
              why: {
                bn: "না, আর এটাই সবচেয়ে সাধারণ ভুল ধারণা। মেয়াদপূর্ব ভাঙায় ব্যাংক অনেক কম হার প্রয়োগ করে, প্রায়ই সেভিংস অ্যাকাউন্টের হার।",
                en: "No, and this is the commonest misunderstanding. On early encashment the bank applies a far lower rate, often the savings account rate.",
              },
            },
            {
              text: { bn: "অনেক কম হার পাবেন, আর কখনো জরিমানাও", en: "A much lower rate, and sometimes a penalty" },
              right: true,
              why: {
                bn: "ঠিক, আর এইজন্যই মেয়াদটা টাকার দরকারের তারিখের সঙ্গে মেলাতে হয়। যে টাকা কখন লাগবে জানা নেই, সেটা এফডিআরে নয়, সেভিংসে।",
                en: "Right, and this is why the term has to match the date. Money whose date you do not know belongs in savings, not in a deposit.",
              },
            },
            {
              text: { bn: "আসল টাকাও কমে যায়", en: "You lose part of the principal" },
              why: {
                bn: "সাধারণত না, আসল ফেরত পাওয়া যায়। যা হারান তা হলো সুদ, আর কখনো একটা ছোট ফি।",
                en: "Usually not: the principal comes back. What you lose is interest, and sometimes a small fee.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"bond": {
  bn: `
<p>বন্ড হলো ধার দেওয়ার দলিল। একটা কোম্পানি বা সরকার টাকা ধার নেয় আর বিনিময়ে একটা কাগজ দেয় যাতে লেখা থাকে: আমি আপনাকে বছরে এত টাকা সুদ দেব, আর এত বছর পর মূল টাকাটা ফেরত দেব।</p>

<p>এই এক লাইনেই <a class="term" href="/money/terms/share.html">শেয়ারের</a> সঙ্গে পুরো পার্থক্যটা আছে। শেয়ার মালিকানা, বন্ড পাওনাদারি। মালিক হিসেবে আপনি লাভের ভাগ পান আর লোকসানও, আর পাওনাদার হিসেবে আপনি নির্দিষ্ট টাকা পান, কোম্পানি যত ভালোই করুক।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বন্ডে আপনি পাওনাদার, তাই লাইনে শেয়ারহোল্ডারদের আগে।</li>
<li>কুপন হলো বার্ষিক সুদ, আর সেটা অভিহিত মূল্যের ওপর হিসাব হয়।</li>
<li>বাজারদর অভিহিত মূল্যের উপরে বা নিচে হতে পারে, আর তখন আসল ইল্ড বদলায়।</li>
<li>দাম আর ইল্ড উল্টো দিকে চলে, সবসময়।</li>
<li>বাংলাদেশে কর্পোরেট বন্ডের বাজার এখনো ছোট, আর বেশিরভাগ সুকুক ও সরকারি।</li>
</ul>
</div>

<h2>তিনটা সংখ্যা</h2>

<p>একটা বন্ড বুঝতে তিনটা সংখ্যা লাগে, আর মানুষ প্রথম দুইটাই দেখেন।</p>

${mount("bond-figure")}

<p>অভিহিত মূল্য হলো মেয়াদ শেষে যা ফেরত আসবে। কুপন হলো বার্ষিক সুদের হার, আর সেটা সবসময় অভিহিত মূল্যের ওপর হিসাব হয়, বাজারদরের ওপর নয়। বাজারদর হলো আজ কেউ ওই বন্ডটার জন্য যত দিতে রাজি।</p>

<h2>দাম আর ইল্ড উল্টো দিকে চলে</h2>

<p>এটা বন্ড বোঝার একমাত্র জিনিস যা সত্যিই বুঝতে হয়, আর একবার বুঝলে আর ভুল হয় না।</p>

<p>ধরুন একটা বন্ডের অভিহিত মূল্য ১,০০০ টাকা আর কুপন ৮%, মানে বছরে ৮০ টাকা। এখন বাজারে নতুন বন্ডে ১০% দেওয়া শুরু হলো। আপনার ৮% বন্ডটা কেউ ১,০০০ টাকায় কিনবে কেন, যখন একই টাকায় ১০০ টাকা পাওয়া যায়? কিনবে না। তাই আপনার বন্ডটার দাম নেমে যাবে, প্রায় ৮০০ টাকায়, যাতে ৮০ টাকা সুদটা নতুন ক্রেতার জন্য ১০% হয়।</p>

<p>উল্টোটাও তাই। সুদের হার কমলে আপনার পুরনো ৮% বন্ডটা হঠাৎ আকর্ষণীয় হয়ে ওঠে, আর তার দাম উপরে যায়। এইজন্যই বলা হয় সুদের হার আর বন্ডের দাম উল্টো দিকে চলে, আর এইজন্যই বন্ডধারীরা সুদের হারের খবর গভীরভাবে দেখেন।</p>

${mount("bond-lab")}

<h2>ঝুঁকি কোথায়</h2>

<p>বন্ডে দুই রকম ঝুঁকি আছে, আর মানুষ প্রথমটাকেই একমাত্র ঝুঁকি ভাবেন।</p>

<p>প্রথমটা হলো খেলাপির ঝুঁকি: যে ধার নিয়েছে সে ফেরত দিতে না পারা। সরকারের ক্ষেত্রে এটা কার্যত শূন্য, কারণ সরকার নিজের মুদ্রায় ধার নিলে সে সবসময় শোধ করতে পারে। কোম্পানির ক্ষেত্রে এটা আসল, আর এইজন্যই কর্পোরেট বন্ডে ইল্ড বেশি: বাড়তি ইল্ডটা ওই ঝুঁকির দাম।</p>

<p>দ্বিতীয়টা হলো সুদের হারের ঝুঁকি, আর এটাই বেশি অবহেলিত। সরকারি বন্ডেও এটা পুরোপুরি থাকে। আপনি যদি ৮% কুপনের দশ বছরের বন্ড কিনে থাকেন আর তিন বছর পর বাজারে ১২% পাওয়া যেতে থাকে, আপনার বন্ডটার দাম অনেক নিচে নেমে যাবে। মেয়াদ পর্যন্ত ধরে রাখলে আপনি ১,০০০ টাকাই ফেরত পাবেন, তাই ক্ষতিটা কেবল কাগজে; কিন্তু ওই সাত বছর আপনি বাজারের চেয়ে কম হারে আটকে থাকবেন।</p>

<p>এই দুইটার ফল একটাই ব্যবহারিক নিয়মে দাঁড়ায়: <strong>বন্ডের মেয়াদটা আপনার নিজের সময়ের সঙ্গে মেলান।</strong> পাঁচ বছর পর টাকা লাগলে পাঁচ বছরের বন্ড কিনুন, দশ বছরেরটা নয়।</p>

<h2>কর্পোরেট আর সরকারি</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th></th><th>সরকারি বন্ড</th><th>কর্পোরেট বন্ড</th></tr>
</thead>
<tbody>
<tr><td>ধার নিচ্ছে</td><td>সরকার</td><td>একটা কোম্পানি</td></tr>
<tr><td>ফেরত না পাওয়ার ঝুঁকি</td><td>কার্যত নেই</td><td>আছে, কোম্পানিভেদে</td></tr>
<tr><td>ইল্ড</td><td>কম</td><td>বেশি, ঝুঁকির বিনিময়ে</td></tr>
<tr><td>বাংলাদেশে বাজার</td><td>বড়, তবে বেশিরভাগ ব্যাংকের হাতে</td><td>ছোট, ব্যক্তির জন্য কম সুযোগ</td></tr>
</tbody>
</table>
</div>

<p>বাংলাদেশে ব্যক্তিগত বিনিয়োগকারীর জন্য বন্ড এখনো সহজলভ্য নয়। সরকারি বন্ডের বেশিরভাগ ব্যাংক আর বিমা কোম্পানির হাতে যায়, আর কর্পোরেট বন্ডের সংখ্যা কম। কিছু সুকুক তালিকাভুক্ত হয়েছে আর সেগুলো ডিএসইতে কেনা যায়। <a class="term" href="/money/terms/treasury-bill.html">ট্রেজারি বিল ও বন্ডের</a> লেখায় সরকারি দিকটা আছে।</p>

<div class="note">বন্ড নিরাপদ শব্দটা সাবধানে ব্যবহার করা দরকার। সরকারি বন্ডে ফেরত না পাওয়ার ঝুঁকি প্রায় নেই, আর দামের ঝুঁকি আছে: সুদের হার বাড়লে আপনার বন্ডের বাজারদর পড়ে, আর মেয়াদের আগে বেচলে সেই ক্ষতিটা আসল। মেয়াদ পর্যন্ত ধরে রাখলে ওই ক্ষতি হয় না, তাই বন্ডে মেয়াদটা আপনার সময়ের সঙ্গে মেলানো জরুরি।</div>

<h2>নিজে যাচাই করুন</h2>

${mount("bond-quiz")}
`,
  en: `
<p>A bond is a lending document. A company or a government borrows money and hands back a paper saying: I will pay you this much interest a year, and return the principal in this many years.</p>

<p>That one line contains the whole difference from a <a class="term" href="/money/terms/share.html">share</a>. A share is ownership; a bond is a debt owed to you. As an owner you take a share of the profit and of the loss; as a creditor you take a fixed amount however well the company does.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A bondholder is a creditor and stands ahead of shareholders in the queue.</li>
<li>The coupon is the annual interest, computed on the face value.</li>
<li>The market price can be above or below face, which changes the real yield.</li>
<li>Price and yield move in opposite directions, always.</li>
<li>Bangladesh's corporate bond market is still small, and most issues are government or sukuk.</li>
</ul>
</div>

<h2>Three numbers</h2>

<p>Understanding a bond takes three numbers, and people look at the first two.</p>

${mount("bond-figure")}

<p>Face value is what comes back at maturity. The coupon is the annual interest rate, always computed on face value and never on the market price. The market price is what somebody will pay for the bond today.</p>

<h2>Price and yield move opposite ways</h2>

<p>This is the one thing about bonds you genuinely have to understand, and once you do it never confuses you again.</p>

<p>Say a bond has a face value of 1,000 and an 8% coupon, so 80 taka a year. Now new bonds start paying 10%. Why would anybody pay 1,000 for your 8% bond when the same money buys 100 a year? They would not. So your bond's price falls, to about 800, so that the 80 taka works out to 10% for a new buyer.</p>

<p>The reverse holds too. When rates fall your old 8% bond suddenly looks attractive and its price rises. That is why interest rates and bond prices move in opposite directions, and why bondholders watch rate news closely.</p>

${mount("bond-lab")}

<h2>Where the risk is</h2>

<p>Bonds carry two risks, and people treat the first as if it were the only one.</p>

<p>The first is default: the borrower being unable to repay. For a government borrowing in its own currency this is effectively zero, because it can always pay. For a company it is real, and it is why corporate bonds yield more: the extra yield is the price of that risk.</p>

<p>The second is interest rate risk, and it is the neglected one. Government bonds carry it in full. Buy a ten year bond with an 8% coupon and three years later the market pays 12%, and your bond's price is far below where you bought it. Held to maturity you still get the 1,000 back, so the loss stays on paper; you spend seven years locked into a below-market rate all the same.</p>

<p>Both come down to one practical rule: <strong>match the bond's term to your own horizon.</strong> If the money is needed in five years, buy the five year bond, not the ten.</p>

<h2>Corporate and government</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th></th><th>Government bond</th><th>Corporate bond</th></tr>
</thead>
<tbody>
<tr><td>Who is borrowing</td><td>The government</td><td>A company</td></tr>
<tr><td>Risk of not being repaid</td><td>Effectively none</td><td>Real, and varies by company</td></tr>
<tr><td>Yield</td><td>Lower</td><td>Higher, in exchange for the risk</td></tr>
<tr><td>The market here</td><td>Large, mostly held by banks</td><td>Small, little access for individuals</td></tr>
</tbody>
</table>
</div>

<p>Bonds are still not easy for individual investors to reach in Bangladesh. Most government issues go to banks and insurers, and corporate issues are few. Some sukuk have listed and can be bought on DSE. The <a class="term" href="/money/terms/treasury-bill.html">treasury bills and bonds</a> lesson covers the government side.</p>

<div class="note">The word safe needs care here. A government bond carries almost no risk of not being repaid, and it does carry price risk: when rates rise its market price falls, and selling before maturity makes that loss real. Held to maturity the loss does not occur, so matching the term to your horizon is what matters in bonds.</div>

<h2>Check yourself</h2>

${mount("bond-quiz")}
`,
  blocks: {
    "bond-figure": {
      kind: "figure",
      shape: "flow",
      title: { bn: "একটা বন্ডের তিনটা সংখ্যা", en: "The three numbers on a bond" },
      parts: [
        { text: { bn: "অভিহিত মূল্য", en: "Face value" }, note: { bn: "মেয়াদ শেষে যা ফেরত আসবে, ধরুন ১,০০০ টাকা", en: "What comes back at maturity, say 1,000 taka" } },
        { text: { bn: "কুপন", en: "Coupon" }, note: { bn: "বছরে কত সুদ, অভিহিত মূল্যের ওপর হিসাব", en: "The yearly interest, computed on face value" }, tone: "lead" },
        { text: { bn: "বাজারদর", en: "Market price" }, note: { bn: "আজ কেউ যত দিতে রাজি, আর এটাই নড়ে", en: "What somebody will pay today, and this is what moves" }, tone: "warn" },
      ],
      caption: {
        bn: "প্রথম দুইটা চুক্তিতে লেখা আর বদলায় না। তৃতীয়টা প্রতিদিন বদলায়, আর ওটাই ইল্ড ঠিক করে।",
        en: "The first two are written into the contract and never change. The third changes daily, and it sets the yield.",
      },
    },
    "bond-lab": {
      kind: "lab",
      model: "bond",
      title: { bn: "কুপন, দাম আর আসল ইল্ড", en: "Coupon, price and the real yield" },
      note: {
        bn: "বাজারদরটা অভিহিত মূল্যের নিচে আর উপরে নিয়ে দেখুন ইল্ড কীভাবে উল্টো দিকে যায়।",
        en: "Push the market price below and above face value and watch the yield move the other way.",
      },
      preset: { face: 1000, coupon: 8, price: 950, years: 5 },
    },
    "bond-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "বাংলাদেশ ব্যাংক নীতি সুদহার বাড়াল। আপনার হাতে থাকা পুরনো বন্ডের বাজারদরের কী হবে?",
            en: "Bangladesh Bank raises the policy rate. What happens to the market price of the old bond you hold?",
          },
          options: [
            {
              text: { bn: "বাড়বে, কারণ সুদ বেড়েছে", en: "It rises, because rates rose" },
              why: {
                bn: "উল্টো। আপনার বন্ডের কুপন চুক্তিতে বাঁধা, তাই সেটা বাড়ে না। নতুন বন্ড বেশি দিলে পুরনোটার আকর্ষণ কমে, আর আকর্ষণ কমা মানে দাম কমা।",
                en: "The opposite. Your coupon is fixed in the contract, so it does not rise. If new bonds pay more, the old one is less attractive, and less attractive means a lower price.",
              },
            },
            {
              text: { bn: "কমবে, যাতে একই কুপন নতুন ক্রেতার জন্য বেশি ইল্ড হয়", en: "It falls, so the same coupon becomes a higher yield for a new buyer" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই বন্ডের সবচেয়ে গুরুত্বপূর্ণ নিয়ম। মেয়াদ পর্যন্ত ধরে রাখলে আপনি অভিহিত মূল্য ফেরত পাবেন আর এই দাম কমাটা কেবল কাগজে থাকবে; মেয়াদের আগে বেচলে ক্ষতিটা আসল হয়ে যাবে।",
                en: "Right, and it is the most important rule in bonds. Hold to maturity and you get face value back and the fall stays on paper; sell early and the loss becomes real.",
              },
            },
            {
              text: { bn: "কিছুই হবে না, বন্ডের দাম নড়ে না", en: "Nothing: bond prices do not move" },
              why: {
                bn: "বন্ডের দাম প্রতিদিন নড়ে, আর সুদের হারই তার প্রধান চালক। কুপনটা স্থির, দামটা নয়।",
                en: "Bond prices move daily and interest rates are the main driver. The coupon is fixed; the price is not.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানি বন্ধ হয়ে গেল। বন্ডধারী আর শেয়ারহোল্ডার, কে আগে টাকা পাবেন?",
            en: "A company winds up. Who is paid first, the bondholder or the shareholder?",
          },
          options: [
            {
              text: { bn: "বন্ডধারী", en: "The bondholder" },
              right: true,
              why: {
                bn: "ঠিক। বন্ডধারী পাওনাদার আর শেয়ারহোল্ডার মালিক, আর আইনে পাওনাদার আগে। এই একটা পার্থক্যই ব্যাখ্যা করে কেন বন্ডে রিটার্ন কম আর নিশ্চয়তা বেশি।",
                en: "Right. A bondholder is a creditor and a shareholder is an owner, and the law pays creditors first. That single difference explains why bonds return less and promise more.",
              },
            },
            {
              text: { bn: "শেয়ারহোল্ডার, কারণ তারা মালিক", en: "The shareholder, because they are the owner" },
              why: {
                bn: "মালিকানা মানে শেষে দাঁড়ানো। মালিক ঝুঁকির শেষ ভাগটা নেন, আর সেইজন্যই লাভের অসীম অংশটাও তারই।",
                en: "Ownership means standing at the back. The owner takes the last slice of risk, which is also why the unlimited upside is theirs.",
              },
            },
            {
              text: { bn: "দুইজন সমানভাবে", en: "Both equally" },
              why: {
                bn: "না, আর এই ক্রমটাই বন্ড আর শেয়ারের ঝুঁকির পার্থক্য তৈরি করে। ক্রম ছাড়া দুইটা একই জিনিস হয়ে যেত।",
                en: "No, and that ordering is what creates the difference in risk between them. Without it the two would be the same instrument.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"treasury-bill": {
  bn: `
<p>সরকারেরও টাকা ধার করতে হয়, আর সেটা করে দুইভাবে: সাধারণ মানুষের কাছ থেকে <a class="term" href="/money/terms/sanchayapatra.html">সঞ্চয়পত্রের</a> মাধ্যমে, আর ব্যাংক ও প্রাতিষ্ঠানিক বিনিয়োগকারীদের কাছ থেকে ট্রেজারি বিল ও বন্ডের মাধ্যমে।</p>

<p>এই লেখাটা এই কারণে গুরুত্বপূর্ণ নয় যে আপনি ট্রেজারি বিল কিনবেন, কারণ ব্যক্তি বিনিয়োগকারীর জন্য এটা সহজলভ্য নয়। এটা গুরুত্বপূর্ণ কারণ <strong>দেশের সব সুদের হার এখান থেকে মাপা শুরু হয়।</strong> আপনার এফডিআরের হার, ব্যাংকের ঋণের সুদ, কোম্পানির ধারের খরচ, এমনকি শেয়ারের যুক্তিসঙ্গত দাম, সবকিছুর ভিত্তিতে এই একটা সংখ্যা।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বিল এক বছরের কম মেয়াদের, বন্ড এক বছরের বেশি।</li>
<li>বিল কেনা হয় ছাড়ে আর মেয়াদ শেষে অভিহিত মূল্য ফেরত আসে, আলাদা সুদ নেই।</li>
<li>নিলামে দাম ঠিক হয়, বাংলাদেশ ব্যাংক প্রতি সপ্তাহে নিলাম ডাকে।</li>
<li>এই হারই ঝুঁকিহীন হার, আর বাকি সব হার এর ওপরে বসে।</li>
<li>ইল্ড কার্ভ, মানে বিভিন্ন মেয়াদের হারের রেখাটা, অর্থনীতির একটা পাঠ।</li>
</ul>
</div>

<h2>বিল আর বন্ডের পার্থক্য</h2>

<p>দুইটার মধ্যে পার্থক্য মেয়াদ আর সুদ দেওয়ার ধরনে।</p>

<div class="table-scroll">
<table>
<thead>
<tr><th></th><th>ট্রেজারি বিল</th><th>ট্রেজারি বন্ড</th></tr>
</thead>
<tbody>
<tr><td>মেয়াদ</td><td>৯১, ১৮২ বা ৩৬৪ দিন</td><td>২, ৫, ১০, ১৫ বা ২০ বছর</td></tr>
<tr><td>সুদ কীভাবে</td><td>ছাড়ে কেনা, অভিহিত মূল্যে ফেরত</td><td>প্রতি ছয় মাসে কুপন</td></tr>
<tr><td>কে কেনে</td><td>মূলত ব্যাংক</td><td>ব্যাংক, বিমা, পেনশন তহবিল</td></tr>
<tr><td>কী বোঝায়</td><td>স্বল্পমেয়াদি সুদের হার</td><td>দীর্ঘমেয়াদি প্রত্যাশা</td></tr>
</tbody>
</table>
</div>

<p>বিলে আলাদা কোনো সুদ দেওয়া হয় না। আপনি ৯,৫০০ টাকায় একটা ১০,০০০ টাকার বিল কেনেন, আর এক বছর পর ১০,০০০ পান। ৫০০ টাকাই আপনার আয়, আর সেটা প্রায় ৫.৩% ইল্ড। এই কাঠামোকে বলে জিরো কুপন।</p>

<h2>ঝুঁকিহীন হার কেন সবকিছুর ভিত্তি</h2>

<p>এই ধারণাটা এই পাঠশালার সবচেয়ে দরকারি ধারণাগুলোর একটা, আর এটা সহজ। সরকারকে টাকা ধার দিলে ফেরত না পাওয়ার ঝুঁকি প্রায় নেই। তাই ওই হারটা হলো সেই ন্যূনতম, যার চেয়ে কম পেলে কেউ কোনো ঝুঁকি নেবে না।</p>

${mount("tbill-figure")}

<p>ধরুন সরকারের এক বছরের বিলে ৯% পাওয়া যাচ্ছে। এখন একটা কোম্পানি আপনার কাছে বন্ড নিয়ে এল ৯.৫% এ। আপনি নেবেন না, কারণ মাত্র ০.৫% বাড়তির জন্য একটা কোম্পানির খেলাপি হওয়ার ঝুঁকি নেওয়া অর্থহীন। কোম্পানিকে হয়তো ১৪% দিতে হবে। ওই পার্থক্যটাকে বলে ঝুঁকি প্রিমিয়াম।</p>

<p>শেয়ারের ক্ষেত্রেও একই যুক্তি, কেবল সংখ্যাটা অনিশ্চিত। যদি ঝুঁকিহীন হার ৯% হয়, শেয়ার থেকে দীর্ঘমেয়াদে অন্তত ১৪% থেকে ১৬% আশা না করলে শেয়ারে টাকা রাখার কোনো কারণ নেই। এইজন্যই সুদের হার বাড়লে শেয়ারের দাম পড়ে: ঝুঁকিহীন বিকল্পটা আকর্ষণীয় হয়ে ওঠে।</p>

<h2>ইল্ড কার্ভ, আর সেটা কী বলে</h2>

<p>বিভিন্ন মেয়াদের সরকারি ঋণের হার একটা রেখায় বসালে যা পাওয়া যায় তার নাম ইল্ড কার্ভ। স্বাভাবিক অবস্থায় এই রেখাটা উপরের দিকে ওঠে: বিশ বছরের বন্ডে তিন মাসের বিলের চেয়ে বেশি হার, কারণ বেশি সময়ের জন্য টাকা আটকে রাখার বাড়তি দাম আছে।</p>

<p>রেখাটা যখন উল্টে যায়, মানে স্বল্পমেয়াদি হার দীর্ঘমেয়াদির চেয়ে বেশি হয়ে যায়, তখন সেটা একটা সংকেত: বাজার মনে করছে ভবিষ্যতে সুদ কমবে, আর সাধারণত সুদ কমে মন্দার সময়। উন্নত বাজারে এই সংকেতটা মন্দার পূর্বাভাস হিসেবে বেশ নির্ভরযোগ্য প্রমাণিত হয়েছে।</p>

<div class="note">বাংলাদেশে ইল্ড কার্ভের সংকেতটা উন্নত বাজারের মতো নির্ভরযোগ্য নয়, কারণ বাজারটা ছোট আর সরকারি ঋণের চাহিদা প্রায়ই নীতিগত কারণে চালিত। তবু হারগুলোর দিক দেখা কাজের: বাংলাদেশ ব্যাংক প্রতি সপ্তাহের নিলামের ফল প্রকাশ করে, আর সেটা বিনামূল্যে পড়া যায়।</div>

<h2>এটা আপনার কী কাজে লাগে</h2>

<p>তিনটা কাজে। এক, আপনার এফডিআরের হারটা যুক্তিসঙ্গত কি না তা মাপার একটা মাপকাঠি পান: ট্রেজারি হারের চেয়ে অনেক নিচে হলে ব্যাংক আপনাকে কম দিচ্ছে। দুই, শেয়ার থেকে কতটা রিটার্ন আশা করা যুক্তিসঙ্গত তার একটা ভিত্তি পান। তিন, সুদের হারের খবরগুলো হঠাৎ অর্থবহ হয়ে ওঠে, কারণ আপনি জানেন সেগুলো কোথায় গিয়ে ঠেকে।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("tbill-quiz")}
`,
  en: `
<p>The government has to borrow too, and it does so two ways: from the public through <a class="term" href="/money/terms/sanchayapatra.html">savings certificates</a>, and from banks and institutions through treasury bills and bonds.</p>

<p>This lesson is not important because you will buy a treasury bill, which is not readily available to individuals. It is important because <strong>every interest rate in the country is measured from here.</strong> Your deposit rate, a bank's lending rate, a company's cost of debt, even a reasonable price for a share, all rest on this one number.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Bills run under a year, bonds over a year.</li>
<li>Bills are bought at a discount and repay face value; there is no separate interest.</li>
<li>Prices are set at auction, and Bangladesh Bank auctions weekly.</li>
<li>This rate is the risk-free rate, and everything else sits above it.</li>
<li>The yield curve, the line of rates across maturities, is a reading of the economy.</li>
</ul>
</div>

<h2>Bills against bonds</h2>

<p>The difference is the term and the way interest is paid.</p>

<div class="table-scroll">
<table>
<thead>
<tr><th></th><th>Treasury bill</th><th>Treasury bond</th></tr>
</thead>
<tbody>
<tr><td>Term</td><td>91, 182 or 364 days</td><td>2, 5, 10, 15 or 20 years</td></tr>
<tr><td>How interest works</td><td>Bought at a discount, repaid at face</td><td>A coupon every six months</td></tr>
<tr><td>Who buys</td><td>Mostly banks</td><td>Banks, insurers, pension funds</td></tr>
<tr><td>What it tells you</td><td>Short-term rates</td><td>Long-term expectations</td></tr>
</tbody>
</table>
</div>

<p>A bill pays no separate interest. You buy a 10,000 taka bill for 9,500 and receive 10,000 a year later. The 500 is your income and it works out to about 5.3%. That structure is called zero coupon.</p>

<h2>Why the risk-free rate underpins everything</h2>

<p>This is one of the most useful ideas in the whole school, and it is simple. Lending to the government carries almost no risk of not being repaid. So that rate is the floor below which nobody will take any risk at all.</p>

${mount("tbill-figure")}

<p>Say a one year government bill pays 9%. Now a company offers you a bond at 9.5%. You decline, because taking a company's default risk for half a point is pointless. That company may have to offer 14%. The difference is the risk premium.</p>

<p>The same logic holds for shares, only the number is uncertain. If the risk-free rate is 9%, there is no reason to hold shares unless you expect at least 14% to 16% over the long run. Which is why share prices fall when rates rise: the risk-free alternative has become attractive.</p>

<h2>The yield curve, and what it says</h2>

<p>Plot the rates on government debt across maturities and you get the yield curve. Normally it slopes upward: a twenty year bond pays more than a three month bill, because tying money up for longer has a price.</p>

<p>When the line inverts, when short rates exceed long ones, it is a signal: the market expects rates to fall, and rates usually fall in a recession. In developed markets this has been a fairly reliable warning.</p>

<div class="note">The signal is less reliable in Bangladesh than in developed markets, because the market is small and demand for government debt is often policy driven. Watching the direction is still useful: Bangladesh Bank publishes each week's auction results, free to read.</div>

<h2>What this does for you</h2>

<p>Three things. It gives you a yardstick for whether your deposit rate is reasonable: far below the treasury rate and the bank is short-changing you. It gives you a base for what to expect from shares. And interest rate news suddenly means something, because you know where it lands.</p>

<h2>Check yourself</h2>

${mount("tbill-quiz")}
`,
  blocks: {
    "tbill-figure": {
      kind: "figure",
      shape: "steps",
      title: { bn: "প্রতিটা হার তার আগেরটার ওপরে বসে", en: "Every rate sits on the one below it" },
      parts: [
        { text: { bn: "ট্রেজারি বিল", en: "Treasury bill" }, note: { bn: "ঝুঁকিহীন হার, বাকি সবার ভিত্তি", en: "The risk-free rate, the base of everything" }, tone: "good" },
        { text: { bn: "ব্যাংক আমানত", en: "Bank deposit" }, note: { bn: "ব্যাংকের ঝুঁকির জন্য সামান্য বেশি", en: "Slightly more, for the bank's own risk" } },
        { text: { bn: "কর্পোরেট বন্ড", en: "Corporate bond" }, note: { bn: "কোম্পানি খেলাপি হওয়ার ঝুঁকির দাম", en: "The price of a company's default risk" }, tone: "warn" },
        { text: { bn: "শেয়ার", en: "Shares" }, note: { bn: "সবচেয়ে বেশি প্রত্যাশা, আর কোনো নিশ্চয়তা নেই", en: "The highest expectation, and no guarantee at all" }, tone: "bad" },
      ],
      caption: {
        bn: "নিচের ধাপটা নড়লে উপরের সবগুলো নড়ে। এইজন্যই বাংলাদেশ ব্যাংকের সিদ্ধান্তের দিনে শেয়ারবাজার নড়ে।",
        en: "Move the bottom step and every step above it moves. That is why the market reacts on a Bangladesh Bank decision day.",
      },
    },
    "tbill-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "এক বছরের ট্রেজারি বিলে ১০% পাওয়া যাচ্ছে। একটা কোম্পানি তার বন্ডে ১০.৫% দিচ্ছে। এতে কী ভাবা উচিত?",
            en: "A one year treasury bill pays 10%. A company offers 10.5% on its bond. What should you think?",
          },
          options: [
            {
              text: { bn: "ভালো, ০.৫% বেশি পাওয়া যাচ্ছে", en: "Good: half a point more" },
              why: {
                bn: "০.৫% একটা কোম্পানির খেলাপি হওয়ার ঝুঁকির অনেক কম দাম। সরকার শোধ করবেই, কোম্পানি নাও করতে পারে, আর ওই পার্থক্যটার দাম আধা শতাংশ নয়।",
                en: "Half a point is far too little for a company's default risk. The government will pay; the company might not, and the price of that difference is not 0.5%.",
              },
            },
            {
              text: { bn: "ঝুঁকির তুলনায় বাড়তি রিটার্নটা খুব কম", en: "The extra return is far too small for the risk" },
              right: true,
              why: {
                bn: "ঠিক। এই তুলনাটাই ঝুঁকিহীন হার জানার আসল কাজ। বাড়তি ঝুঁকির জন্য বাড়তি কত পাচ্ছেন, সেই প্রশ্নটা প্রতিটা বিনিয়োগে করা যায়, আর ঝুঁকিহীন হারটা না জানলে প্রশ্নটাই করা যায় না।",
                en: "Right. That comparison is the real use of knowing the risk-free rate. How much extra am I paid for the extra risk is a question you can ask of any investment, and you cannot ask it without the base.",
              },
            },
            {
              text: { bn: "কোম্পানির বন্ড সবসময় খারাপ", en: "Corporate bonds are always bad" },
              why: {
                bn: "না। ওই একই কোম্পানি ১৫% দিলে হিসাবটা অন্যরকম হতো। প্রশ্নটা যন্ত্রের নয়, দামের।",
                en: "No. At 15% from the same company the sum looks different. The question is not the instrument, it is the price.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "ট্রেজারি বিলের হার ৬% থেকে ১১% এ উঠল। শেয়ারবাজারে সাধারণত কী হয়?",
            en: "The treasury bill rate goes from 6% to 11%. What usually happens in the share market?",
          },
          options: [
            {
              text: { bn: "দাম পড়ে, কারণ ঝুঁকিহীন বিকল্পটা আকর্ষণীয় হয়ে ওঠে", en: "Prices fall, because the risk-free alternative got attractive" },
              right: true,
              why: {
                bn: "ঠিক, আর দুই দিক থেকেই। এক, ব্যাংকে নিশ্চিত ১১% পাওয়া গেলে মানুষ শেয়ারের জন্য কম দাম দিতে রাজি হয়। দুই, ঋণে চলা কোম্পানিগুলোর সুদ খরচ বেড়ে লাভ কমে।",
                en: "Right, and from both directions. A guaranteed 11% at the bank makes people pay less for shares, and companies carrying debt see their interest bill rise and their profit fall.",
              },
            },
            {
              text: { bn: "দাম বাড়ে, কারণ অর্থনীতি ভালো চলছে", en: "Prices rise, because the economy is doing well" },
              why: {
                bn: "সুদ বাড়ানো হয় সাধারণত মূল্যস্ফীতি ঠেকাতে, আর সেটা অর্থনীতিকে ধীর করার জন্যই করা হয়। উঁচু সুদ শেয়ারের জন্য প্রায় কখনোই ভালো খবর নয়।",
                en: "Rates are usually raised to fight inflation, which is done precisely to slow the economy. High rates are almost never good news for shares.",
              },
            },
            {
              text: { bn: "কিছুই হয় না, দুইটা আলাদা বাজার", en: "Nothing: they are separate markets" },
              why: {
                bn: "একই টাকা দুই জায়গায় যেতে পারে, তাই বাজার দুইটা আলাদা নয়, প্রতিদ্বন্দ্বী। উপরের ছবিটাই এই কথাটা বলে।",
                en: "The same money can go to either, so they are not separate markets, they are competitors. The figure above is that point.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"dividend": {
  bn: `
<p>ডিভিডেন্ড হলো কোম্পানির লাভ থেকে শেয়ারহোল্ডারদের দেওয়া ভাগ। বছরের হিসাব শেষ হলে পরিচালনা পর্ষদ সিদ্ধান্ত নেন লাভের কতটা ব্যবসায় রাখা হবে আর কতটা মালিকদের হাতে দেওয়া হবে, আর দ্বিতীয় অংশটাই ডিভিডেন্ড।</p>

<p>বাংলাদেশে এই বিষয়টা নিয়ে সবচেয়ে বেশি ভুল বোঝাবুঝি হয়, আর তার কারণ ঘোষণার ভাষা। কোম্পানি বলে ২৫% ডিভিডেন্ড, আর নতুন বিনিয়োগকারী ভাবেন তার বিনিয়োগের ২৫%। আসলে সংখ্যাটা অভিহিত মূল্যের ওপর, আর অভিহিত মূল্য প্রায় সব কোম্পানিতেই ১০ টাকা।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ঘোষিত শতাংশ অভিহিত মূল্যের ওপর, বাজারদরের ওপর নয়।</li>
<li>নগদ ডিভিডেন্ড টাকা, বোনাস ডিভিডেন্ড কেবল বেশি শেয়ার।</li>
<li>রেকর্ড ডেটের আগে কিনলে ডিভিডেন্ড পাবেন, পরে কিনলে না।</li>
<li>ডিভিডেন্ড দেওয়ার দিন দাম প্রায় ততটাই কমে, আর সেটা স্বাভাবিক।</li>
<li>উচ্চ ইল্ড আকর্ষণীয়, আর প্রায়ই সেটা দাম পড়ে যাওয়ার ফল।</li>
</ul>
</div>

<h2>২৫% ডিভিডেন্ড মানে কত টাকা</h2>

${mount("div-reveal")}

<h2>নগদ আর বোনাস</h2>

<p>বাংলাদেশে কোম্পানি দুই রকম ডিভিডেন্ড দেয়, আর দুইটা সম্পূর্ণ আলাদা জিনিস।</p>

${mount("div-compare")}

<p>নগদ ডিভিডেন্ডে আপনার ব্যাংক অ্যাকাউন্টে টাকা আসে। বোনাস ডিভিডেন্ডে আপনি বেশি শেয়ার পান, আর দাম আনুপাতিকভাবে কমে যায়, তাই আপনার মোট সম্পদ একই থাকে। বোনাস কেবল পাইটাকে আরও ছোট টুকরায় কাটে।</p>

<p>তবু বাংলাদেশে বোনাস ঘোষণার দিনে প্রায়ই দাম বাড়ে, আর সেটা ভুল বোঝার ফল। বিএসইসি সময়ে সময়ে বোনাস ডিভিডেন্ডের ওপর নিয়ন্ত্রণ আরোপ করেছে ঠিক এই কারণেই: বোনাস দিয়ে কোম্পানি নগদ ধরে রাখে আর শেয়ারহোল্ডাররা মনে করেন কিছু পেয়েছেন।</p>

<h2>রেকর্ড ডেট আর দামের সমন্বয়</h2>

<p>ডিভিডেন্ড কে পাবেন তা ঠিক হয় একটা নির্দিষ্ট দিনে, যার নাম রেকর্ড ডেট। ওই দিনে যার নামে শেয়ার আছে, ডিভিডেন্ড তার। এর একদিন আগে থেকে শেয়ারটা এক্স-ডিভিডেন্ড হিসেবে লেনদেন হয়, মানে যিনি এখন কিনবেন তিনি এই ডিভিডেন্ডটা পাবেন না।</p>

<p>আর ঠিক সেদিন দাম কমে যায়, প্রায় ডিভিডেন্ডের সমান। এটা কোনো পতন নয়, এটা হিসাব: কোম্পানির ভেতর থেকে ওই টাকাটা বেরিয়ে গেছে, তাই কোম্পানিটা ততটাই কম দামি। নতুন বিনিয়োগকারীরা এই দিনটাকে দাম পড়ার দিন ভেবে আতঙ্কিত হন।</p>

${mount("div-flow")}

<div class="note">ডিভিডেন্ড ধরার জন্য রেকর্ড ডেটের ঠিক আগে কেনা একটা পুরনো কৌশল, আর সেটা কাজ করে না। আপনি ডিভিডেন্ডটা পাবেন আর পরদিন দাম ততটাই কমবে, তাই আপনার হাতে একই টাকা থাকবে। এর ওপর ডিভিডেন্ডে উৎসে কর কাটা হবে আর কমিশনও দিতে হবে, তাই কৌশলটা আসলে ক্ষতিকর।</div>

<h2>ডিভিডেন্ড দেওয়া কি ভালো লক্ষণ</h2>

<p>এই প্রশ্নটার সহজ উত্তর নেই, আর দুইটা দিকই বোঝা দরকার।</p>

<p>পক্ষে: নগদ ডিভিডেন্ড দিতে হলে সত্যিকারের নগদ লাগে, আর কাগজে লাভ দেখানো যায় যেখানে নগদ দেখানো যায় না। যে কোম্পানি বছরের পর বছর নগদ ডিভিডেন্ড দিয়ে যাচ্ছে, তার হিসাবে বড় ধরনের কারচুপি থাকা কঠিন। এইজন্য ডিভিডেন্ডের ইতিহাস একটা ভালো স্বাস্থ্য পরীক্ষা, বিশেষ করে এমন বাজারে যেখানে হিসাবের মান সব কোম্পানিতে সমান নয়।</p>

<p>বিপক্ষে: যে টাকা মালিকদের দিয়ে দেওয়া হলো, সেটা আর ব্যবসায় খাটল না। একটা দ্রুত বাড়ন্ত কোম্পানির উচিত টাকাটা নতুন কারখানায় লাগানো, কারণ সেখানে সেটা বছরে ২০% আনতে পারে, আর আপনি ওই টাকা হাতে পেয়ে হয়তো ব্যাংকে ৮% পাবেন। তাই সব ভালো কোম্পানি ডিভিডেন্ড দেয় না, আর না দেওয়াটা দোষ নয়।</p>

<p>ব্যবহারিক নিয়মটা এই: <strong>ডিভিডেন্ডের সংখ্যা দেখে বিচার করবেন না, ডিভিডেন্ডের ইতিহাস আর কারণ দেখে করুন।</strong> পাঁচ বছর ধরে নিয়মিত নগদ ডিভিডেন্ড একটা তথ্য; এক বছরের বড় ডিভিডেন্ড প্রায়ই কিছুই না, আর কখনো কখনো সেটা প্রতিষ্ঠাতাদের টাকা বের করে নেওয়ার পথ।</p>

<h2>ইল্ড, আর উঁচু ইল্ডের ফাঁদ</h2>

${mount("div-lab")}

<p>ডিভিডেন্ড ইল্ড হলো বার্ষিক নগদ ডিভিডেন্ড ভাগ বাজারদর। ১৪% ইল্ড দেখতে দারুণ লাগে, আর একটা প্রশ্ন সবসময় করা দরকার: ইল্ডটা উঁচু কেন? দুইটাই কারণ হতে পারে। ডিভিডেন্ড বেড়েছে, যা ভালো। বা দাম পড়েছে, যা সাধারণত মানে বাজার ধরে নিয়েছে ডিভিডেন্ডটা কাটা পড়বে।</p>

<p>দ্বিতীয়টা বেশি সাধারণ। ইল্ড একটা ভগ্নাংশ, আর ভগ্নাংশের নিচের সংখ্যাটা পড়লে ভগ্নাংশ বাড়ে, উপরের সংখ্যাটা না বেড়েই।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("div-quiz")}
`,
  en: `
<p>A dividend is the share of profit a company hands to its shareholders. When the year's accounts close, the board decides how much stays in the business and how much goes to the owners, and the second part is the dividend.</p>

<p>This is the most misunderstood topic in the Bangladeshi market, and the cause is the language of the announcement. A company declares a 25% dividend and a new investor hears 25% of their investment. The percentage is on the face value, and face value in almost every listed company here is 10 taka.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>The declared percentage is on face value, not on the market price.</li>
<li>A cash dividend is money; a bonus dividend is only more shares.</li>
<li>Buy before the record date and you receive it; buy after and you do not.</li>
<li>The price drops by about the dividend on the ex date, and that is normal.</li>
<li>A high yield is attractive, and it is often the result of a falling price.</li>
</ul>
</div>

<h2>How much money is a 25% dividend</h2>

${mount("div-reveal")}

<h2>Cash and bonus</h2>

<p>Companies here declare two kinds of dividend, and they are entirely different things.</p>

${mount("div-compare")}

<p>A cash dividend puts money in your bank account. A bonus dividend gives you more shares while the price falls proportionally, so your total wealth is unchanged. A bonus simply cuts the pie into smaller slices.</p>

<p>Prices still often rise on bonus announcements here, and that is a misunderstanding at work. BSEC has restricted bonus dividends from time to time for exactly this reason: a bonus lets a company keep its cash while shareholders feel they received something.</p>

<h2>The record date and the price adjustment</h2>

<p>Who receives a dividend is settled on a particular day, the record date. Whoever holds the share that day gets it. From the day before, the share trades ex-dividend, meaning a buyer from now on does not receive this one.</p>

<p>And on that day the price falls by roughly the dividend. That is not a decline, it is arithmetic: the money has left the company, so the company is worth that much less. New investors see the day as a crash.</p>

${mount("div-flow")}

<div class="note">Buying just before the record date to catch the dividend is an old idea and it does not work. You receive the dividend and the price falls by the same amount the next day, so you hold the same value. On top of that, tax is withheld from the dividend and you paid commission, so the manoeuvre actually loses money.</div>

<h2>Is paying a dividend a good sign</h2>

<p>There is no simple answer, and both sides are worth understanding.</p>

<p>For: paying a cash dividend requires actual cash, and profit can be shown on paper where cash cannot. A company paying cash year after year is a hard place to hide large accounting problems. So a dividend history is a decent health check, particularly in a market where accounting quality varies between companies.</p>

<p>Against: money handed to owners is money not working in the business. A fast growing company should be putting it into a new plant, where it might return 20% a year, while you receive it and put it in a bank at 8%. So not every good company pays a dividend, and not paying is not a failing.</p>

<p>The practical rule: <strong>judge by the history and the reason, not by the size of the number.</strong> Five years of steady cash dividends is information; one large dividend in one year is often nothing, and occasionally it is a route for founders to take money out.</p>

<h2>Yield, and the high-yield trap</h2>

${mount("div-lab")}

<p>Dividend yield is the annual cash dividend divided by the price. A 14% yield looks marvellous, and one question always follows: why is it high? Two causes are possible. The dividend rose, which is good. Or the price fell, which usually means the market expects the dividend to be cut.</p>

<p>The second is more common. A yield is a fraction, and when the bottom of a fraction falls the fraction rises without the top going anywhere.</p>

<h2>Check yourself</h2>

${mount("div-quiz")}
`,
  blocks: {
    "div-reveal": {
      kind: "reveal",
      title: { bn: "ঘোষণাটা পড়ুন", en: "Read the announcement" },
      ask: {
        bn: "একটা কোম্পানি ২৫% নগদ ডিভিডেন্ড ঘোষণা করল। আপনার কাছে ৫০০টা শেয়ার আছে, যেগুলো আপনি ৮০ টাকা করে কিনেছেন। আপনি কত টাকা পাবেন?",
        en: "A company declares a 25% cash dividend. You hold 500 shares bought at 80 taka each. How much money do you get?",
      },
      choices: [
        { bn: "১০,০০০ টাকা, বিনিয়োগের ২৫%", en: "10,000 taka: 25% of what I invested" },
        { bn: "১,২৫০ টাকা", en: "1,250 taka" },
        { bn: "জানা যাবে না, আরও তথ্য লাগবে", en: "Cannot tell without more information" },
      ],
      answer: {
        bn: "১,২৫০ টাকা। অভিহিত মূল্য ১০ টাকা, তাই শেয়ারপ্রতি ২.৫০ টাকা, গুণ ৫০০।",
        en: "1,250 taka. Face value is 10 taka, so 2.50 a share, times 500.",
      },
      why: {
        bn: "বাংলাদেশে প্রায় প্রতিটা তালিকাভুক্ত কোম্পানির অভিহিত মূল্য ১০ টাকা, আর ডিভিডেন্ডের শতাংশ সবসময় ওই সংখ্যার ওপর। ২৫% মানে ১০ টাকার ২৫%, অর্থাৎ শেয়ারপ্রতি ২.৫০ টাকা। আপনার ৫০০টা শেয়ারে ১,২৫০ টাকা, উৎসে কর কাটার আগে। আপনার বিনিয়োগ ছিল ৪০,০০০ টাকা, তাই আপনার প্রকৃত ইল্ড ৩.১%, ২৫% নয়। এই একটা ভুল বোঝাবুঝির কারণে বহু মানুষ ডিভিডেন্ড ঘোষণার খবরে শেয়ার কেনেন আর পরে হতাশ হন। আসল সংখ্যাটা সবসময় হিসাব করে নিন: ঘোষিত শতাংশ গুণ ১০, ভাগ আপনার কেনা দাম।",
        en: "Almost every listed company here has a face value of 10 taka, and the dividend percentage is always on that number. 25% means 25% of 10, so 2.50 a share. On 500 shares that is 1,250 taka before withholding. You invested 40,000, so your actual yield is 3.1%, not 25%. This single misunderstanding is why so many people buy on a dividend announcement and are disappointed later. Always convert: the declared percentage times 10, divided by the price you paid.",
      },
    },
    "div-compare": {
      kind: "compare",
      title: { bn: "নগদ আর বোনাস", en: "Cash and bonus" },
      columns: [
        { bn: "নগদ ডিভিডেন্ড", en: "Cash dividend" },
        { bn: "বোনাস ডিভিডেন্ড", en: "Bonus dividend" },
      ],
      rows: [
        {
          label: { bn: "আপনি কী পান", en: "What you receive" },
          cells: [{ bn: "ব্যাংক অ্যাকাউন্টে টাকা", en: "Money in your bank account" }, { bn: "বেশি সংখ্যক শেয়ার", en: "More shares" }],
        },
        {
          label: { bn: "আপনার মোট সম্পদ", en: "Your total wealth" },
          cells: [{ bn: "বাড়ে, নগদ হাতে আসে", en: "Rises: cash arrives" }, { bn: "একই থাকে", en: "Unchanged" }],
          best: 0,
        },
        {
          label: { bn: "কোম্পানির নগদ", en: "The company's cash" },
          cells: [{ bn: "কমে", en: "Falls" }, { bn: "একই থাকে", en: "Unchanged" }],
        },
        {
          label: { bn: "দামে প্রভাব", en: "Effect on the price" },
          cells: [{ bn: "ডিভিডেন্ডের সমান কমে", en: "Falls by the dividend" }, { bn: "আনুপাতিকভাবে কমে", en: "Falls proportionally" }],
        },
        {
          label: { bn: "কর", en: "Tax" },
          cells: [{ bn: "উৎসে কাটা হয়", en: "Withheld at source" }, { bn: "নগদ নেই, তাই তখন নেই", en: "No cash, so none then" }],
        },
      ],
    },
    "div-flow": {
      kind: "figure",
      shape: "timeline",
      title: { bn: "ঘোষণা থেকে টাকা পর্যন্ত", en: "From announcement to money" },
      parts: [
        { text: { bn: "পরিচালনা পর্ষদ ডিভিডেন্ড সুপারিশ করে", en: "The board recommends a dividend" }, note: { bn: "ঘোষণার দিন", en: "Declaration" } },
        { text: { bn: "এই দিন থেকে যিনি কিনবেন তিনি এই ডিভিডেন্ড পাবেন না", en: "Buyers from this day do not receive it" }, note: { bn: "এক্স-ডিভিডেন্ড", en: "Ex-dividend" }, tone: "warn" },
        { text: { bn: "দাম প্রায় ডিভিডেন্ডের সমান কমে, আর এটা পতন নয়", en: "The price falls by about the dividend, and this is not a crash" }, note: { bn: "একই দিন", en: "Same day" }, tone: "warn" },
        { text: { bn: "যার নামে শেয়ার আছে, ডিভিডেন্ড তার", en: "Whoever holds the share receives it" }, note: { bn: "রেকর্ড ডেট", en: "Record date" } },
        { text: { bn: "বার্ষিক সাধারণ সভায় শেয়ারহোল্ডাররা অনুমোদন দেন", en: "Shareholders approve it at the AGM" }, note: { bn: "এজিএম", en: "AGM" } },
        { text: { bn: "ব্যাংক অ্যাকাউন্টে টাকা আসে, কর কেটে", en: "The money arrives, net of tax" }, note: { bn: "কয়েক সপ্তাহ পর", en: "Weeks later" }, tone: "good" },
      ],
    },
    "div-lab": {
      kind: "lab",
      model: "dividend",
      title: { bn: "ইল্ড কত, আর কার ওপর", en: "The yield, and on what" },
      note: {
        bn: "এখনকার দাম কমিয়ে দেখুন। ডিভিডেন্ড না বাড়লেও ইল্ড কীভাবে বাড়ে লক্ষ করুন।",
        en: "Lower the current price and watch the yield rise without the dividend changing.",
      },
      preset: { price: 50, bought: 30, dividend: 3, shares: 500 },
    },
    "div-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা শেয়ারের ডিভিডেন্ড ইল্ড ১৫%, যেখানে খাতের গড় ৫%। প্রথমে কী জিজ্ঞেস করবেন?",
            en: "A share yields 15% where the sector average is 5%. What do you ask first?",
          },
          options: [
            {
              text: { bn: "কখন কিনব", en: "When do I buy" },
              why: {
                bn: "এটাই সবচেয়ে সাধারণ প্রতিক্রিয়া আর এটাই ফাঁদ। এত বেশি ইল্ড সাধারণত একটা সমস্যার সংকেত, পুরস্কার নয়।",
                en: "The commonest reaction and the trap. A yield that far above the sector is usually a signal of a problem rather than a reward.",
              },
            },
            {
              text: { bn: "ইল্ডটা উঁচু কেন, ডিভিডেন্ড বেড়েছে না দাম পড়েছে", en: "Why is it high: did the dividend rise or did the price fall" },
              right: true,
              why: {
                bn: "ঠিক, আর উত্তরটা খুঁজতে গত তিন বছরের ডিভিডেন্ড আর দাম দুইটাই দেখতে হবে। দাম পড়ে ইল্ড উঠলে বাজার সম্ভবত ধরে নিয়েছে পরের বছর ডিভিডেন্ড কাটা পড়বে, আর কাটা পড়লে ইল্ডটা কাগজেই থেকে যাবে।",
                en: "Right, and answering it means looking at three years of dividends and of price. If the price fell, the market is probably pricing a cut next year, and if it is cut the yield was never real.",
              },
            },
            {
              text: { bn: "কিছুই না, ১৫% তো ভালো", en: "Nothing: 15% is good" },
              why: {
                bn: "১৫% ভালো যদি সেটা পরের বছরও থাকে। ডিভিডেন্ড কোম্পানির সিদ্ধান্ত, চুক্তি নয়, আর যে কোম্পানি চাপে আছে সে প্রথমে ডিভিডেন্ডই কাটে।",
                en: "It is good if it is there next year. A dividend is a decision, not a contract, and a company under pressure cuts the dividend first.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "এক্স-ডিভিডেন্ড দিনে শেয়ারের দাম ২.৫০ টাকা কমল, আর ডিভিডেন্ড ছিল ২.৫০ টাকা। এতে কী বোঝায়?",
            en: "On the ex-dividend day the price falls 2.50 and the dividend was 2.50. What does that mean?",
          },
          options: [
            {
              text: { bn: "শেয়ারটা খারাপ করছে", en: "The share is performing badly" },
              why: {
                bn: "না, এটা স্বাভাবিক আর প্রত্যাশিত। টাকাটা কোম্পানি থেকে বেরিয়ে গেছে, তাই কোম্পানিটা ঠিক ততটাই কম দামি। আপনার হাতে দাম কমেছে আর নগদ এসেছে, মোট একই।",
                en: "No, this is normal and expected. The money left the company, so the company is worth that much less. You lost price and gained cash; the total is the same.",
              },
            },
            {
              text: { bn: "কিছুই হয়নি, টাকাটা কেবল দাম থেকে নগদে সরেছে", en: "Nothing: the value moved from price into cash" },
              right: true,
              why: {
                bn: "ঠিক, আর এটা জানা থাকলে ওই দিনের লাল সংখ্যাটা দেখে ভয় পাওয়ার কিছু থাকে না। এটাই কারণ রেকর্ড ডেটের আগে ডিভিডেন্ড ধরার জন্য কেনা কাজ করে না।",
                en: "Right, and knowing it removes the fright of the red number that day. It is also why buying just before the record date to catch a dividend does not work.",
              },
            },
            {
              text: { bn: "কোম্পানি ভুল হিসাব করেছে", en: "The company made an accounting error" },
              why: {
                bn: "না, এটা এক্সচেঞ্জের একটা স্বাভাবিক সমন্বয়, আর প্রতিটা ডিভিডেন্ডেই হয়, পৃথিবীর সব বাজারে।",
                en: "No, it is a routine exchange adjustment and it happens on every dividend, in every market in the world.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"bonus-rights": {
  bn: `
<p>বাংলাদেশের বাজারে দুইটা ঘোষণা নিয়মিত আসে যেগুলো নতুন বিনিয়োগকারীদের সবচেয়ে বেশি বিভ্রান্ত করে: বোনাস শেয়ার আর রাইট শেয়ার। দুইটাই শেয়ার সংখ্যা বাড়ায়, আর দুইটার অর্থ সম্পূর্ণ আলাদা।</p>

<p>এক লাইনে পার্থক্যটা এই: <strong>বোনাস শেয়ারে আপনার কাছ থেকে কিছু চাওয়া হয় না, আর রাইট শেয়ারে আরও টাকা চাওয়া হয়।</strong> এই এক পার্থক্য থেকেই বাকি সবকিছু বেরিয়ে আসে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বোনাস শেয়ারে আপনার সম্পদ বাড়ে না, কেবল টুকরার সংখ্যা বাড়ে।</li>
<li>রাইট শেয়ার মানে কোম্পানি আপনার কাছে নতুন করে টাকা চাইছে।</li>
<li>রাইটে অংশ না নিলে আপনার মালিকানার অনুপাত কমে যায়।</li>
<li>দুইটার পরই দাম আনুপাতিকভাবে সমন্বয় হয়, আর সেটা পতন নয়।</li>
<li>বারবার রাইট ইস্যু করা কোম্পানি একটা সতর্ক সংকেত।</li>
</ul>
</div>

<h2>বোনাস শেয়ার: পিৎজা আরও ছোট টুকরায়</h2>

<p>কোম্পানি বলল, প্রতি দশটা শেয়ারের বিপরীতে দুইটা বোনাস শেয়ার। আপনার ১০০টা শেয়ার ছিল, এখন ১২০টা। শুনতে উপহারের মতো, আর নয়।</p>

<p>কারণটা সহজ। কোম্পানির ভেতরে কিছুই বদলায়নি: একই কারখানা, একই বিক্রি, একই লাভ, একই নগদ। কেবল মালিকানাটা এখন বেশি টুকরায় ভাগ করা। তাই প্রতিটা টুকরার দাম আনুপাতিকভাবে কমে যায়, আর <a class="term" href="/money/terms/market-cap.html">বাজারমূল্য</a> ঠিক আগের জায়গায় থাকে।</p>

${mount("bonus-figure")}

<p>তাহলে কোম্পানি বোনাস দেয় কেন? দুইটা কারণ। প্রথমটা সৎ: শেয়ারের দাম খুব বেশি হয়ে গেলে ছোট বিনিয়োগকারীদের জন্য কেনা কঠিন হয়, তাই টুকরাগুলো ছোট করলে বাজার তরল হয়। দ্বিতীয়টা কম সৎ: নগদ ডিভিডেন্ড দিলে কোম্পানি থেকে টাকা বেরিয়ে যায়, বোনাস দিলে যায় না, আর শেয়ারহোল্ডাররা মনে করেন কিছু পেয়েছেন। বিএসইসি এই কারণেই বোনাস ডিভিডেন্ডের ওপর নিয়ন্ত্রণ আরোপ করেছে সময়ে সময়ে।</p>

<h2>রাইট শেয়ার: কোম্পানি টাকা চাইছে</h2>

<p>রাইট ইস্যু সম্পূর্ণ আলাদা জিনিস। কোম্পানির নতুন টাকা দরকার, আর সে নতুন শেয়ার ইস্যু করছে, বাজারদরের চেয়ে কম দামে, আর আগে বিদ্যমান শেয়ারহোল্ডারদের কেনার সুযোগ দিচ্ছে।</p>

<p>ধরুন দুইটা শেয়ারের বিপরীতে একটা রাইট শেয়ার, ২০ টাকা দরে, যেখানে বাজারদর ৪০ টাকা। আপনার ২০০টা শেয়ার আছে, তাই আপনি ১০০টা নতুন শেয়ার ২০ টাকায় কিনতে পারবেন, মানে ২,০০০ টাকা লাগবে।</p>

${mount("rights-flow")}

<p>এখানে সিদ্ধান্তটা আসলে দুইটা প্রশ্নের: কোম্পানিটা এই টাকা দিয়ে কী করবে, আর আপনার কাছে টাকাটা আছে কি না। প্রথম প্রশ্নটা বেশি গুরুত্বপূর্ণ, আর উত্তরটা রাইট ইস্যুর নথিতে লেখা থাকে।</p>

<h2>অংশ না নিলে কী হয়</h2>

<p>এটাই রাইট ইস্যুর সবচেয়ে গুরুত্বপূর্ণ অংশ। আপনি যদি রাইটে অংশ না নেন, নতুন শেয়ারগুলো অন্যরা কিনে নেবে, আর কোম্পানিতে আপনার মালিকানার অনুপাত কমে যাবে। একে বলে ডাইলিউশন।</p>

<p>বাংলাদেশে অনেক ক্ষেত্রে রাইট এনটাইটেলমেন্ট বিক্রি করার সুযোগও থাকে না, যা উন্নত বাজারে থাকে। মানে অংশ না নেওয়ার খরচটা এখানে সরাসরি: আপনার অংশটা ছোট হয়ে যায় আর তার বিনিময়ে আপনি কিছুই পান না।</p>

<div class="note">বারবার রাইট ইস্যু করা একটা সতর্ক সংকেত। যে কোম্পানি প্রতি দুই-তিন বছরে শেয়ারহোল্ডারদের কাছে হাত পাতে, সে সম্ভবত নিজের ব্যবসা থেকে যথেষ্ট নগদ তৈরি করতে পারছে না। একটা কোম্পানির রাইট ইস্যুর ইতিহাস দেখা তার নগদ প্রবাহ দেখার একটা সহজ প্রক্সি, আর সেটা ডিএসইর সাইটেই পাওয়া যায়।</div>

<h2>দাম কেন সমন্বয় হয়</h2>

<p>দুইটার পরই দাম কমে, আর দুইটাতেই সেটা গণিত। বোনাসে টুকরা বাড়ে বলে দাম কমে। রাইটে সস্তায় নতুন শেয়ার ইস্যু হয় বলে গড় দাম কমে: পুরনো ২০০টা ৪০ টাকায় আর নতুন ১০০টা ২০ টাকায় মিলে গড় দাঁড়ায় প্রায় ৩৩.৩৩ টাকা।</p>

<p>এই সমন্বিত দামকে বলে থিওরেটিক্যাল এক্স-রাইটস প্রাইস। বাজার সবসময় ঠিক ওই দামে খোলে না, কিন্তু সেটাই হিসাবের ভিত্তি। যিনি এই অঙ্কটা জানেন না, তিনি এক্স-রাইটস দিনে দাম দেখে ভাবেন কোম্পানিটার কিছু হয়েছে।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("bonus-quiz")}
`,
  en: `
<p>Two announcements arrive regularly in this market and confuse new investors more than anything else: bonus shares and rights shares. Both increase the share count, and they mean completely different things.</p>

<p>In one line: <strong>a bonus share asks nothing of you, and a rights share asks for more money.</strong> Everything else follows from that difference.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A bonus share does not increase your wealth, only the number of pieces.</li>
<li>A rights issue is the company asking you for fresh money.</li>
<li>Not taking up a rights issue shrinks your share of the company.</li>
<li>The price adjusts proportionally after both, and that is not a fall.</li>
<li>Repeated rights issues are a warning sign.</li>
</ul>
</div>

<h2>Bonus shares: the same pizza, more slices</h2>

<p>The company announces two bonus shares for every ten held. You had 100 shares and now you have 120. It sounds like a gift and it is not.</p>

<p>The reason is simple. Nothing inside the company changed: the same plant, the same sales, the same profit, the same cash. Only the ownership is now cut into more pieces. So each piece falls proportionally in price and the <a class="term" href="/money/terms/market-cap.html">market cap</a> sits exactly where it was.</p>

${mount("bonus-figure")}

<p>Why do it then? Two reasons. The honest one: when a share price gets very high it becomes hard for small investors to buy, and smaller pieces make the market more liquid. The less honest one: a cash dividend takes money out of the company and a bonus does not, while shareholders feel they received something. This is exactly why BSEC has restricted bonus dividends from time to time.</p>

<h2>Rights shares: the company is asking for money</h2>

<p>A rights issue is a different thing entirely. The company needs new money, so it issues new shares below the market price and offers existing shareholders the first chance to buy them.</p>

<p>Say one rights share for every two held, priced at 20 against a market price of 40. You hold 200 shares, so you may buy 100 new ones at 20, which needs 2,000 taka.</p>

${mount("rights-flow")}

<p>The decision is really two questions: what will the company do with the money, and do you have it. The first matters more, and the answer is in the rights issue document.</p>

<h2>What happens if you do not take it up</h2>

<p>This is the important part. If you do not take up the rights, others buy the new shares and your proportional ownership of the company shrinks. That is dilution.</p>

<p>In Bangladesh there is often no way to sell a rights entitlement, which developed markets allow. So the cost of not participating is direct: your slice gets smaller and you receive nothing for it.</p>

<div class="note">Repeated rights issues are a warning. A company that comes back to its shareholders every two or three years probably cannot generate enough cash from its own business. Looking up a company's rights issue history is a cheap proxy for looking at its cash flow, and it is on DSE's site.</div>

<h2>Why the price adjusts</h2>

<p>The price falls after both, and both times it is arithmetic. After a bonus there are more pieces so each is worth less. After a rights issue new shares were sold cheaply, so the average cost falls: 200 old at 40 and 100 new at 20 averages to about 33.33.</p>

<p>That adjusted price is called the theoretical ex-rights price. The market does not always open exactly there, and it is the basis of the calculation. Somebody who does not know this sum looks at the ex-rights day and assumes something happened to the company.</p>

<h2>Check yourself</h2>

${mount("bonus-quiz")}
`,
  blocks: {
    "bonus-figure": {
      kind: "figure",
      shape: "scale",
      title: { bn: "বোনাসের আগে আর পরে", en: "Before a bonus and after" },
      parts: [
        {
          text: { bn: "আগে: ১০০ শেয়ার, ৬০ টাকা করে", en: "Before: 100 shares at 60" },
          note: { bn: "মোট ৬,০০০ টাকা", en: "6,000 taka in total" },
          value: 6000,
          tone: "plain",
        },
        {
          text: { bn: "পরে: ১২০ শেয়ার, ৫০ টাকা করে", en: "After: 120 shares at 50" },
          note: { bn: "মোট ৬,০০০ টাকা", en: "6,000 taka in total" },
          value: 6000,
          tone: "plain",
        },
      ],
      caption: {
        bn: "পাল্লা সমান, আর এটাই পুরো কথা। বোনাস শেয়ার সম্পদ তৈরি করে না, ভাগ করে।",
        en: "The beam is level, which is the whole point. A bonus does not create wealth, it divides it.",
      },
    },
    "rights-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "একটা রাইট ইস্যু, ধাপে ধাপে", en: "A rights issue, step by step" },
      parts: [
        { text: { bn: "কোম্পানির নতুন টাকা দরকার", en: "The company needs new money" }, note: { bn: "নতুন কারখানা, ঋণ শোধ, বা মূলধন ঘাটতি", en: "A new plant, paying down debt, or a capital shortfall" } },
        { text: { bn: "বিএসইসির অনুমোদন", en: "BSEC approval" }, note: { bn: "কেন টাকা দরকার তা নথিতে লিখতে হয়", en: "The reason has to be written into the document" } },
        { text: { bn: "শেয়ারহোল্ডারদের প্রস্তাব", en: "The offer to shareholders" }, note: { bn: "বাজারদরের নিচে, নির্দিষ্ট অনুপাতে", en: "Below market price, at a set ratio" }, tone: "lead" },
        { text: { bn: "আপনি টাকা দেন বা দেন না", en: "You pay or you do not" }, note: { bn: "না দিলে আপনার অংশ ছোট হয়ে যায়", en: "If you do not, your slice shrinks" }, tone: "warn" },
        { text: { bn: "দাম সমন্বয় হয়", en: "The price adjusts" }, note: { bn: "পুরনো আর নতুনের গড়ে", en: "To the average of old and new" } },
      ],
    },
    "bonus-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানি গত ছয় বছরে তিনবার রাইট ইস্যু করেছে। এতে কী ভাবা উচিত?",
            en: "A company has done three rights issues in six years. What should you make of that?",
          },
          options: [
            {
              text: { bn: "ভালো, কোম্পানিটা বাড়ছে", en: "Good: the company is growing" },
              why: {
                bn: "বাড়তেও পারে, আর প্রশ্নটা হলো টাকাটা কোথায় যাচ্ছে। প্রতিটা রাইট ইস্যুর নথিতে লেখা থাকে, আর তিনবারের তিনটা কারণ পড়লে ছবিটা পরিষ্কার হয়ে যায়।",
                en: "It might be, and the question is where the money goes. Each rights document says, and reading all three makes the picture clear.",
              },
            },
            {
              text: { bn: "কোম্পানিটা নিজের ব্যবসা থেকে যথেষ্ট নগদ তৈরি করতে পারছে না", en: "The business is not generating enough cash on its own" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই সবচেয়ে সম্ভাব্য ব্যাখ্যা। একটা সুস্থ কোম্পানি বৃদ্ধির টাকা মূলত নিজের লাভ থেকে দেয়। বারবার শেয়ারহোল্ডারদের কাছে হাত পাতা মানে ব্যবসাটা নিজের খরচ মেটাচ্ছে না, আর সেটা পর্যায় ৩-এর নগদ প্রবাহের পাতায় গিয়ে যাচাই করা যায়।",
                en: "Right, and it is the likeliest explanation. A healthy company funds growth mostly from its own profit. Coming back repeatedly means the business is not paying for itself, and that can be verified on the cash flow page in stage 3.",
              },
            },
            {
              text: { bn: "রাইট ইস্যু বেআইনি", en: "Rights issues are not allowed" },
              why: {
                bn: "একেবারেই বৈধ আর বিএসইসির অনুমোদন লাগে। প্রশ্নটা বৈধতার নয়, ফ্রিকোয়েন্সির।",
                en: "They are entirely legal and require BSEC approval. The question is not legality, it is frequency.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "আপনার ২০০টা শেয়ার আছে, দাম ৪০ টাকা। কোম্পানি দুইটার বিপরীতে একটা রাইট দিচ্ছে ২০ টাকায়। আপনি অংশ নিলে আপনার গড় খরচ কত দাঁড়াবে?",
            en: "You hold 200 shares at 40. The company offers one rights share for every two at 20. If you take it up, what is your average cost?",
          },
          options: [
            {
              text: { bn: "৪০ টাকাই থাকবে", en: "It stays at 40" },
              why: {
                bn: "না, কারণ আপনি ১০০টা নতুন শেয়ার ২০ টাকায় কিনছেন, যা গড়টা নামিয়ে দেয়। মোট খরচ ৮,০০০ যোগ ২,০০০ সমান ১০,০০০, শেয়ার ৩০০টা।",
                en: "No: you bought 100 new shares at 20, which pulls the average down. Total cost is 8,000 plus 2,000, over 300 shares.",
              },
            },
            {
              text: { bn: "প্রায় ৩৩.৩৩ টাকা", en: "About 33.33" },
              right: true,
              why: {
                bn: "ঠিক। ১০,০০০ ভাগ ৩০০ সমান ৩৩.৩৩। বাজারও প্রায় এই দামেই খুলবে, আর সেটাকে থিওরেটিক্যাল এক্স-রাইটস প্রাইস বলে। মানে দাম ৪০ থেকে ৩৩-এ নামা কোনো ক্ষতি নয়, কেবল হিসাব।",
                en: "Right: 10,000 divided by 300 is 33.33. The market opens near there too, which is the theoretical ex-rights price. So a move from 40 to 33 is not a loss, it is arithmetic.",
              },
            },
            {
              text: { bn: "২০ টাকা", en: "20" },
              why: {
                bn: "না, ওটা কেবল নতুন শেয়ারগুলোর দাম। আপনার পুরনো ২০০টা এখনো ৪০ টাকায় কেনা, তাই গড়টা দুইটার মাঝখানে বসবে, শেয়ার সংখ্যা অনুযায়ী ওজন দিয়ে।",
                en: "No, that is only the price of the new ones. Your old 200 still cost 40, so the average sits between the two, weighted by counts.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"eps": {
  bn: `
<p>ইপিএস, আর্নিংস পার শেয়ার, হলো প্রতি শেয়ারে কোম্পানির আয়। হিসাবটা এক লাইনের: বছরের নিট মুনাফা ভাগ মোট শেয়ার সংখ্যা।</p>

<p>এই একটা সংখ্যা কেন এত গুরুত্বপূর্ণ, তার কারণটা তুলনা। একটা কোম্পানি ৫০ কোটি টাকা লাভ করেছে আর আরেকটা ৮ কোটি, এই তথ্যটা প্রায় অকেজো, কারণ কোম্পানি দুইটার আকার আলাদা আর শেয়ার সংখ্যাও আলাদা। কিন্তু প্রথমটার ইপিএস ৩ টাকা আর দ্বিতীয়টার ৯ টাকা, এই তথ্যটা একটা প্রকৃত তুলনা: আপনার হাতের একটা শেয়ার কতটা আয় করছে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ইপিএস = নিট মুনাফা ভাগ শেয়ার সংখ্যা। প্রতি শেয়ারে কত আয়।</li>
<li>ইপিএস বাড়া মানে ব্যবসা ভালো, বা শেয়ার সংখ্যা কমেছে, বা একবারের কোনো লাভ এসেছে।</li>
<li>একটা বছরের ইপিএস দিয়ে কিছু বোঝা যায় না, পাঁচ বছরের ধারাটা বোঝা যায়।</li>
<li>ডাইলুটেড ইপিএস ধরে নেয় সব সম্ভাব্য শেয়ার ইস্যু হয়ে গেছে, আর সেটাই বেশি সৎ।</li>
<li><a class="term" href="/money/terms/pe-ratio.html">পিই রেশিওর</a> নিচের অর্ধেকটাই ইপিএস।</li>
</ul>
</div>

<h2>কোথায় পাবেন</h2>

<p>বাংলাদেশে তালিকাভুক্ত কোম্পানিগুলো প্রতি তিন মাসে হিসাব প্রকাশ করে, আর ইপিএস সেই বিবৃতির নিচের দিকে থাকে। ডিএসইর সাইটে প্রতিটা কোম্পানির পাতায় সর্বশেষ ইপিএস থাকে, আর বার্ষিক প্রতিবেদনে গত পাঁচ বছরেরটা থাকে।</p>

<p>একটা জিনিস খেয়াল রাখতে হয়: ত্রৈমাসিক ইপিএস আর বার্ষিক ইপিএস এক জিনিস নয়। কোম্পানি তিন মাসের ইপিএস প্রকাশ করলে সেটাকে চার দিয়ে গুণ করে বার্ষিক ভাবা বিপজ্জনক, কারণ অনেক ব্যবসা মৌসুমি: বস্ত্র খাতে ক্রিসমাসের অর্ডার, খাদ্য খাতে রমজান, সিমেন্টে শুকনো মৌসুম।</p>

<h2>ধারাটা দেখুন, একটা সংখ্যা নয়</h2>

${mount("eps-chart")}

<p>উপরের দুইটা কোম্পানির সর্বশেষ ইপিএস প্রায় সমান, আর তাদের গল্প একেবারে আলাদা। প্রথমটার আয় প্রতি বছর বেড়েছে, যা একটা ব্যবসার শক্তির চিহ্ন। দ্বিতীয়টার আয় ওঠানামা করেছে আর সর্বশেষ বছরে হঠাৎ লাফ দিয়েছে, যা প্রায়ই একবারের কোনো ঘটনার ফল: একটা জমি বিক্রি, একটা মামলার নিষ্পত্তি, বা একটা কর ছাড়।</p>

<p>এইজন্য ইপিএস দেখার নিয়ম একটাই: <strong>অন্তত পাঁচ বছরের ধারা দেখুন, আর যে বছরটা অস্বাভাবিক সেটার কারণ খুঁজুন।</strong> কারণটা বার্ষিক প্রতিবেদনের নোটে থাকে।</p>

<h2>ইপিএস বাড়ার তিনটা কারণ</h2>

<p>এটা জানা দরকার, কারণ তিনটা তিন রকম খবর।</p>

<ol class="step-list">
<li><strong>ব্যবসা ভালো চলছে।</strong> বিক্রি বেড়েছে বা খরচ কমেছে, তাই লাভ বেড়েছে। এটাই একমাত্র টেকসই কারণ, আর এটাই খোঁজার জিনিস।</li>
<li><strong>শেয়ার সংখ্যা কমেছে।</strong> কোম্পানি নিজের শেয়ার কিনে বাতিল করলে ভাগফলের নিচের সংখ্যাটা ছোট হয়, তাই ইপিএস বাড়ে যদিও লাভ একই। বাংলাদেশে এটা বিরল, উন্নত বাজারে সাধারণ।</li>
<li><strong>একবারের কোনো লাভ।</strong> সম্পদ বিক্রি, বিনিময় হারের লাভ, বা কোনো এককালীন প্রাপ্তি। পরের বছর এটা থাকবে না, তাই এই ইপিএসের ওপর ভিত্তি করে দাম বসানো ভুল।</li>
</ol>

<div class="note">উল্টো দিকটাও সত্য: ইপিএস কমা সবসময় খারাপ খবর নয়। একটা কোম্পানি যদি নতুন কারখানায় বিনিয়োগ করে আর সেই বছরের অবচয় বেশি হয়, ইপিএস কমবে যদিও ব্যবসাটা আসলে শক্তিশালী হচ্ছে। সংখ্যাটার পেছনের কারণটাই আসল খবর।</div>

<h2>ডাইলুটেড ইপিএস</h2>

<p>কিছু কোম্পানির এমন যন্ত্র থাকে যা ভবিষ্যতে নতুন শেয়ারে রূপান্তরিত হতে পারে: রূপান্তরযোগ্য বন্ড, কর্মীদের শেয়ার অপশন। ডাইলুটেড ইপিএস ধরে নেয় ওই সবগুলো রূপান্তরিত হয়ে গেছে, তাই শেয়ার সংখ্যা বেশি আর ইপিএস কম।</p>

<p>দুইটার মধ্যে ডাইলুটেড সংখ্যাটাই বেশি সৎ, কারণ ওটা সবচেয়ে খারাপ সম্ভাব্য অবস্থাটা দেখায়। যেখানে দুইটার মধ্যে বড় পার্থক্য, সেখানে কারণটা খুঁজে দেখা দরকার।</p>

<h2>নিজে যাচাই করুন</h2>

${mount("eps-quiz")}
`,
  en: `
<p>EPS, earnings per share, is a company's profit divided by its share count. The arithmetic is one line: net profit for the year over the number of shares.</p>

<p>Why that one number matters is comparison. Knowing one company made 50 crore and another 8 crore is nearly useless, because the companies are different sizes with different share counts. Knowing the first has an EPS of 3 and the second 9 is a real comparison: how much one share in your hand is earning.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>EPS is net profit divided by share count: earnings per share you hold.</li>
<li>EPS rises when the business improves, when the share count falls, or on a one-off gain.</li>
<li>One year of EPS tells you nothing; five years of it tells you a lot.</li>
<li>Diluted EPS assumes every possible share has been issued, and it is the honest one.</li>
<li>EPS is the bottom half of the <a class="term" href="/money/terms/pe-ratio.html">P/E ratio</a>.</li>
</ul>
</div>

<h2>Where to find it</h2>

<p>Listed companies here publish accounts every three months, and EPS sits near the bottom of the statement. DSE's site carries the latest EPS on each company's page, and the annual report carries five years of it.</p>

<p>One thing to watch: quarterly EPS and annual EPS are not the same thing. Multiplying a quarter by four is dangerous, because many businesses are seasonal: Christmas orders in garments, Ramadan in food, the dry season in cement.</p>

<h2>Read the trend, not the number</h2>

${mount("eps-chart")}

<p>The two companies above have nearly the same latest EPS and completely different stories. The first grew its earnings every year, which is a sign of strength in the business. The second wandered and then jumped in the final year, which is usually a one-off: land sold, a case settled, a tax break.</p>

<p>So there is one rule for reading EPS: <strong>look at five years, and find out why the odd year is odd.</strong> The reason is in the notes to the annual report.</p>

<h2>Three reasons EPS rises</h2>

<p>Worth knowing, because they are three different kinds of news.</p>

<ol class="step-list">
<li><strong>The business improved.</strong> Sales rose or costs fell, so profit rose. The only durable reason, and the one to look for.</li>
<li><strong>The share count fell.</strong> A company buying back and cancelling its own shares shrinks the bottom of the fraction, so EPS rises with profit unchanged. Rare here, common in developed markets.</li>
<li><strong>A one-off gain.</strong> An asset sold, an exchange gain, a windfall. It will not be there next year, so pricing the share off this EPS is a mistake.</li>
</ol>

<div class="note">The reverse holds too: falling EPS is not always bad news. If a company invests in a new plant and the depreciation that year is heavy, EPS falls while the business is actually getting stronger. The reason behind the number is the news.</div>

<h2>Diluted EPS</h2>

<p>Some companies carry instruments that could become new shares later: convertible bonds, employee share options. Diluted EPS assumes all of them converted, so the share count is higher and the EPS lower.</p>

<p>Of the two, the diluted number is the honest one, because it shows the worst plausible case. Where the two differ a lot, the reason is worth finding.</p>

<h2>Check yourself</h2>

${mount("eps-quiz")}
`,
  blocks: {
    "eps-chart": {
      kind: "chart",
      shape: "line",
      title: { bn: "একই ইপিএস, দুইটা আলাদা গল্প", en: "The same EPS, two different stories" },
      note: {
        bn: "শেষ বছরে দুইটার ইপিএস প্রায় সমান। আগের চার বছর দেখুন।",
        en: "Both end at nearly the same EPS. Look at the four years before.",
      },
      labels: ["2020", "2021", "2022", "2023", "2024"],
      series: [
        { name: { bn: "কোম্পানি ক", en: "Company A" }, values: [2.1, 2.8, 3.5, 4.4, 5.2], tone: "good" },
        { name: { bn: "কোম্পানি খ", en: "Company B" }, values: [3.9, 2.2, 1.8, 2.4, 5.0], tone: "warn" },
      ],
      unit: { bn: "টাকা, প্রতি শেয়ারে", en: "taka per share" },
      source: {
        bn: "কাল্পনিক সংখ্যা, ধারাটা দেখানোর জন্য।",
        en: "Illustrative figures, to show the shape.",
      },
    },
    "eps-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানির ইপিএস গত বছর ছিল ২.১ টাকা, এই বছর ৭.৮ টাকা। প্রথমে কী দেখবেন?",
            en: "A company's EPS went from 2.1 to 7.8. What do you look at first?",
          },
          options: [
            {
              text: { bn: "শেয়ারটা কিনে ফেলব, আয় প্রায় চার গুণ", en: "Buy it: earnings almost quadrupled" },
              why: {
                bn: "এত বড় লাফ প্রায় কখনোই কেবল ব্যবসা থেকে আসে না। কারণটা না জেনে কেনা মানে একবারের একটা ঘটনার ওপর দাম দেওয়া, যা পরের বছর থাকবে না।",
                en: "A jump that size almost never comes from the business alone. Buying without the reason means paying for a one-off that will not repeat.",
              },
            },
            {
              text: { bn: "বার্ষিক প্রতিবেদনের নোটে কারণটা খুঁজব", en: "Find the reason in the notes to the accounts" },
              right: true,
              why: {
                bn: "ঠিক। সম্ভাব্য কারণ কয়েকটা: জমি বা কারখানা বিক্রি, বৈদেশিক মুদ্রার লাভ, একটা মামলার নিষ্পত্তি, বা একটা কর সুবিধা। এর কোনোটাই পরের বছর ফিরবে না। ব্যবসা থেকে আসা বৃদ্ধি চিনতে হলে বিক্রির সংখ্যাটাও একই হারে বেড়েছে কি না দেখুন।",
                en: "Right. The usual candidates: land or plant sold, a foreign exchange gain, a settled case, a tax concession. None repeats. To tell whether the growth came from the business, check whether sales grew at a similar rate.",
              },
            },
            {
              text: { bn: "কিছুই দেখার নেই, ইপিএস বাড়া ভালো", en: "Nothing to check: rising EPS is good" },
              why: {
                bn: "ইপিএস বাড়া ভালো যদি সেটা টেকসই হয়। তিনটা কারণে ইপিএস বাড়ে আর কেবল একটাই পরের বছর থাকে, যা এই লেখার মূল কথা।",
                en: "Rising EPS is good if it lasts. Three things raise EPS and only one of them is there next year, which is the point of this lesson.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানির তিন মাসের ইপিএস ১.৫ টাকা। বার্ষিক ইপিএস কত হবে?",
            en: "A company reports a quarterly EPS of 1.5. What will the annual EPS be?",
          },
          options: [
            {
              text: { bn: "৬ টাকা, চার দিয়ে গুণ", en: "6, multiplied by four" },
              why: {
                bn: "অনেক ক্ষেত্রেই না। ব্যবসা মৌসুমি হলে চারটা প্রান্তিক সমান হয় না। বস্ত্র খাতে বছরের একটা অংশে অর্ডার বেশি, খাদ্য খাতে রমজানের আগে বিক্রি বেশি, সিমেন্টে বর্ষায় নির্মাণ কম।",
                en: "Often not. If the business is seasonal the four quarters differ. Garments have order-heavy periods, food peaks before Ramadan, cement slows in the monsoon.",
              },
            },
            {
              text: { bn: "জানা যাবে না, ব্যবসা মৌসুমি কি না দেখতে হবে", en: "Cannot tell: check whether the business is seasonal" },
              right: true,
              why: {
                bn: "ঠিক। সবচেয়ে সহজ যাচাই হলো গত দুই বছরের প্রান্তিক সংখ্যাগুলো পাশাপাশি রাখা। যদি প্রতি বছর একই প্রান্তিকে বেশি হয়, ব্যবসাটা মৌসুমি, আর তখন গুণ করার বদলে গত বারো মাসের যোগফল নিতে হয়।",
                en: "Right. The easiest check is to lay the last two years of quarters side by side. If the same quarter is strong every year the business is seasonal, and then you sum the trailing twelve months instead of multiplying.",
              },
            },
            {
              text: { bn: "১.৫ টাকাই, প্রান্তিক আর বার্ষিক এক", en: "1.5: quarterly and annual are the same" },
              why: {
                bn: "না, প্রান্তিক ইপিএস তিন মাসের আয়। বার্ষিকটা বারো মাসের, আর সেটা সবসময় বেশি, কেবল ঠিক চার গুণ না।",
                en: "No: a quarterly EPS is three months of earnings. The annual figure covers twelve and is always larger, just not exactly four times.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"pe-ratio": {
  bn: `
<p>পিই রেশিও, প্রাইস টু আর্নিংস, হলো শেয়ারের দাম ভাগ প্রতি শেয়ারে আয়। দাম ৬০ টাকা আর <a class="term" href="/money/terms/eps.html">ইপিএস</a> ৪ টাকা হলে পিই ১৫।</p>

<p>এই সংখ্যাটার সবচেয়ে সহজ ব্যাখ্যাটা সবচেয়ে কাজেরও: <strong>পিই বলে, আজকের আয়ের হারে কোম্পানিটার দাম উঠতে কত বছর লাগবে।</strong> পিই ১৫ মানে পনেরো বছরের লাভ দিয়ে আজকের দামটা শোধ হবে, যদি আয় ঠিক একই থাকে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>পিই = দাম ভাগ ইপিএস। আজকের আয়ে দাম উঠতে কত বছর।</li>
<li>কম পিই সস্তা নয় আর বেশি পিই দামি নয়; পিই একটা প্রত্যাশা।</li>
<li>তুলনা কেবল একই খাতের ভেতরে অর্থবহ।</li>
<li>ইপিএস শূন্য বা ঋণাত্মক হলে পিই অর্থহীন হয়ে যায়।</li>
<li>পিইর উল্টোটা, আয়ের ইল্ড, ব্যাংকের সুদের সঙ্গে সরাসরি তুলনীয়।</li>
</ul>
</div>

<h2>নিজে নাড়িয়ে দেখুন</h2>

${mount("pe-lab")}

<h2>কম পিই মানে সস্তা নয়</h2>

<p>এটাই এই লেখার সবচেয়ে গুরুত্বপূর্ণ কথা, আর এটা বুঝতে একটু সময় লাগে।</p>

<p>একটা কোম্পানির পিই ৫ হলে তার মানে বাজার তাকে সস্তা দাম দিচ্ছে। প্রশ্নটা হলো কেন। সম্ভাব্য কারণ তিনটা। এক, বাজার ভুল করছে আর আপনি একটা সুযোগ পেয়েছেন। দুই, বাজার মনে করে আগামী বছরগুলোতে এই আয় থাকবে না। তিন, কোম্পানিটার সঙ্গে এমন কিছু আছে যা আপনি জানেন না: বড় ঋণ, একটা মামলা, একজন প্রধান ক্রেতা চলে যাওয়া।</p>

<p>বাংলাদেশে দ্বিতীয় আর তৃতীয় কারণটাই বেশি সাধারণ। বস্ত্র খাতের অনেক কোম্পানির পিই দীর্ঘদিন ধরে খুব কম, আর সেটা সুযোগ নয়: বাজার ধরে নিয়েছে ওই আয় টেকসই নয়, আর অনেক ক্ষেত্রেই বাজার ঠিক ছিল।</p>

<p>উল্টোটাও সত্য। পিই ৩৫ মানে বাজার প্রত্যাশা করছে আয় দ্রুত বাড়বে। প্রত্যাশাটা সত্যি হলে আজকের ৩৫ পিছিয়ে গিয়ে সস্তা মনে হবে; মিথ্যা হলে দাম অনেকটা পড়বে। উঁচু পিই মানে বেশি ঝুঁকি, দামি হওয়া নয়।</p>

${mount("pe-matrix")}

<h2>আয়ের ইল্ড: পিইর উল্টোটা</h2>

<p>পিইর একটা উল্টো রূপ আছে যা প্রায় কেউ ব্যবহার করেন না আর যেটা অনেক বেশি স্বজ্ঞাত: আয়ের ইল্ড, মানে ইপিএস ভাগ দাম, শতাংশে।</p>

<p>পিই ২০ মানে আয়ের ইল্ড ৫%। পিই ১০ মানে ১০%। এখন সংখ্যাটা সরাসরি ব্যাংকের সুদের হার বা <a class="term" href="/money/terms/treasury-bill.html">ট্রেজারি বিলের</a> সঙ্গে তুলনীয়। যদি ঝুঁকিহীন হার ৯% হয় আর একটা শেয়ারের আয়ের ইল্ড ৫%, আপনি প্রশ্ন করবেন: কম পাওয়ার বিনিময়ে ঝুঁকি নিচ্ছি কেন? উত্তর একটাই হতে পারে: আয়টা বাড়বে বলে আশা করছি। আর ওই আশাটাই যাচাই করার জিনিস।</p>

<h2>কখন পিই কাজ করে না</h2>

<ul class="checklist">
<li>কোম্পানি লোকসানে থাকলে পিই ঋণাত্মক হয়, আর ঋণাত্মক পিইর কোনো ব্যাখ্যা নেই। ওই ক্ষেত্রে অন্য মাপ লাগে, যেমন <a class="term" href="/money/terms/book-value.html">পিবি</a> বা বিক্রির অনুপাত।</li>
<li>আয়ে একবারের বড় কোনো লাভ থাকলে পিই কৃত্রিমভাবে কম দেখায়। ওই লাভটা বাদ দিয়ে হিসাব করুন।</li>
<li>ব্যাংক আর বিমার পিই অন্য খাতের সঙ্গে তুলনীয় নয়, কারণ তাদের ব্যবসার কাঠামোই আলাদা।</li>
<li>খুব চক্রাকার ব্যবসায়, যেমন সিমেন্ট বা ইস্পাত, চক্রের শীর্ষে পিই সবচেয়ে কম দেখায় আর তখনই কেনা সবচেয়ে বিপজ্জনক।</li>
</ul>

<div class="note">শেষ পয়েন্টটা সূক্ষ্ম আর দামি। একটা চক্রাকার কোম্পানির আয় শীর্ষে থাকলে ইপিএস বড়, তাই পিই ছোট, তাই সস্তা মনে হয়। কিন্তু ওই আয়টাই চক্রের নিচে গেলে অর্ধেক হয়ে যাবে আর পিই হঠাৎ দ্বিগুণ হয়ে যাবে, দাম না নড়েই। এইজন্য চক্রাকার ব্যবসায় গড় আয় দিয়ে হিসাব করাই ভালো।</div>

<h2>নিজে যাচাই করুন</h2>

${mount("pe-quiz")}
`,
  en: `
<p>The P/E ratio, price to earnings, is the share price divided by <a class="term" href="/money/terms/eps.html">earnings per share</a>. A price of 60 and an EPS of 4 gives a P/E of 15.</p>

<p>The simplest reading is also the most useful: <strong>a P/E says how many years of today's earnings it takes to repay today's price.</strong> A P/E of 15 means fifteen years of profit pays for the price, if earnings never change.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>P/E is price over EPS: years of today's profit to repay the price.</li>
<li>Low is not cheap and high is not dear; a P/E is an expectation.</li>
<li>Comparison only means something inside a sector.</li>
<li>With zero or negative earnings the ratio stops meaning anything.</li>
<li>Its inverse, the earnings yield, compares directly with a bank rate.</li>
</ul>
</div>

<h2>Move it yourself</h2>

${mount("pe-lab")}

<h2>A low P/E does not mean cheap</h2>

<p>This is the most important sentence in the lesson and it takes a moment to sink in.</p>

<p>A P/E of 5 means the market is pricing the company cheaply. The question is why. Three possibilities. The market is wrong and you have found an opportunity. The market thinks those earnings will not be there in the coming years. Or there is something about the company you do not know: heavy debt, a lawsuit, a departing major customer.</p>

<p>In Bangladesh the second and third are the common ones. Many garment companies have carried very low P/Es for years, and it was not an opportunity: the market assumed the earnings were not durable, and it was often right.</p>

<p>The reverse holds too. A P/E of 35 means the market expects earnings to grow fast. If the expectation is met, today's 35 will look cheap in hindsight; if it is not, the price falls a long way. A high P/E means more risk, not simply an expensive share.</p>

${mount("pe-matrix")}

<h2>Earnings yield: the P/E upside down</h2>

<p>The ratio has an inverse almost nobody uses and it is far more intuitive: the earnings yield, EPS divided by price, as a percentage.</p>

<p>A P/E of 20 is a 5% earnings yield. A P/E of 10 is 10%. Now the number compares directly with a bank rate or a <a class="term" href="/money/terms/treasury-bill.html">treasury bill</a>. If the risk-free rate is 9% and a share yields 5% on earnings, you ask: why am I taking risk to be paid less? Only one answer works: because I expect the earnings to grow. And that expectation is the thing to test.</p>

<h2>When a P/E does not work</h2>

<ul class="checklist">
<li>A loss-making company gives a negative P/E, and a negative P/E has no interpretation. Use another measure there, like <a class="term" href="/money/terms/book-value.html">P/B</a> or a sales multiple.</li>
<li>A big one-off gain in the earnings makes the P/E look artificially low. Strip the gain out and recompute.</li>
<li>Bank and insurance P/Es are not comparable with other sectors, because the structure of the business is different.</li>
<li>In a highly cyclical business such as cement or steel, the P/E looks lowest at the top of the cycle, which is exactly when buying is most dangerous.</li>
</ul>

<div class="note">That last point is subtle and expensive. A cyclical company at the top of its cycle has high earnings, so a small P/E, so it looks cheap. When the cycle turns, those earnings halve and the P/E doubles without the price moving at all. Which is why cyclical businesses are better valued on an average of several years' earnings.</div>

<h2>Check yourself</h2>

${mount("pe-quiz")}
`,
  blocks: {
    "pe-lab": {
      kind: "lab",
      model: "pe",
      title: { bn: "দাম, আয় আর প্রত্যাশা", en: "Price, earnings and expectation" },
      note: {
        bn: "আয়ের বৃদ্ধির হার বদলে দেখুন। উঁচু পিই কেবল তখনই যুক্তিসঙ্গত যখন ওই বৃদ্ধিটা সত্যিই ঘটে।",
        en: "Change the growth rate. A high P/E is only reasonable if that growth actually arrives.",
      },
      preset: { price: 60, eps: 4, growth: 10 },
    },
    "pe-matrix": {
      kind: "figure",
      shape: "matrix",
      title: { bn: "পিই আর যা আসলে ঘটে", en: "The P/E and what actually happens" },
      axes: {
        x: [{ bn: "আয় কমল", en: "Earnings fell" }, { bn: "আয় বাড়ল", en: "Earnings grew" }],
        y: [{ bn: "কম পিইতে কেনা", en: "Bought at a low P/E" }, { bn: "উঁচু পিইতে কেনা", en: "Bought at a high P/E" }],
      },
      parts: [
        {
          text: { bn: "সবচেয়ে খারাপ ফলাফল", en: "The worst outcome" },
          note: { bn: "প্রত্যাশা উঁচু ছিল আর ব্যবসা মেলেনি। দাম দুই দিক থেকে পড়ে।", en: "High expectation, business missed. The price falls from both sides." },
          tone: "bad",
        },
        {
          text: { bn: "প্রত্যাশা মিলল", en: "The expectation was met" },
          note: { bn: "উঁচু পিই যুক্তিসঙ্গত ছিল, আর ভবিষ্যতেও থাকতে হবে।", en: "The high P/E was justified, and has to stay justified." },
          tone: "plain",
        },
        {
          text: { bn: "সস্তা ছিল কারণ ছিল", en: "Cheap for a reason" },
          note: { bn: "বাজার আগেই জানত। এটাকে বলে ভ্যালু ট্র্যাপ।", en: "The market already knew. This is the value trap." },
          tone: "warn",
        },
        {
          text: { bn: "সবচেয়ে ভালো ফলাফল", en: "The best outcome" },
          note: { bn: "কম দামে কিনে ব্যবসা ভালো হলো। পর্যায় ৩ এই ঘরটা খোঁজার পদ্ধতি।", en: "Bought cheap and the business improved. Stage 3 is a method for finding this square." },
          tone: "good",
        },
      ],
      caption: {
        bn: "পিই একা কোনো ঘর বলে দেয় না। কোন ঘরে আছেন সেটা ঠিক করে আয়ের ভবিষ্যৎ, আর সেটাই খুঁজে বের করার কাজ।",
        en: "A P/E does not name a square by itself. Which square you are in is decided by future earnings, and finding that out is the work.",
      },
    },
    "pe-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "একটা সিমেন্ট কোম্পানির পিই ৪, আর খাতের গড় ১৪। প্রথমে কী ভাববেন?",
            en: "A cement company trades at a P/E of 4 against a sector average of 14. What is your first thought?",
          },
          options: [
            {
              text: { bn: "সস্তা, কিনে ফেলা উচিত", en: "Cheap: buy it" },
              why: {
                bn: "সিমেন্ট একটা চক্রাকার ব্যবসা, আর চক্রের শীর্ষে পিই সবচেয়ে কম দেখায়। ওই আয়টা টেকসই কি না না জেনে কেনা মানে শীর্ষে কেনা।",
                en: "Cement is cyclical, and a P/E looks lowest at the top of the cycle. Buying without asking whether those earnings last is buying at the peak.",
              },
            },
            {
              text: { bn: "আয়টা চক্রের শীর্ষের কি না দেখব", en: "Check whether the earnings are at a cycle peak" },
              right: true,
              why: {
                bn: "ঠিক। গত পাঁচ থেকে সাত বছরের ইপিএস পাশাপাশি বসান। যদি এই বছরেরটা গড়ের চেয়ে অনেক বেশি হয়, তাহলে গড় দিয়ে পিই হিসাব করুন; সংখ্যাটা হয়তো ৪ নয়, ১১ হবে, আর তখন সস্তা ব্যাপারটা উবে যায়।",
                en: "Right. Lay five to seven years of EPS side by side. If this year is far above the average, recompute the P/E on the average; the number may be 11 rather than 4, and the bargain evaporates.",
              },
            },
            {
              text: { bn: "খাতের গড়ই সঠিক, তাই কোম্পানিটা খারাপ", en: "The sector average is right, so the company is bad" },
              why: {
                bn: "খাতের গড় একটা প্রসঙ্গ, রায় নয়। কোম্পানিটা সত্যিই সস্তা হতে পারে। প্রশ্নটা কেন, আর উত্তরটা সংখ্যায় খুঁজতে হয়।",
                en: "A sector average is context, not a verdict. The company might genuinely be cheap. The question is why, and the answer is found in the numbers.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "পিই ২৫ মানে আয়ের ইল্ড কত?",
            en: "A P/E of 25 is an earnings yield of what?",
          },
          options: [
            {
              text: { bn: "৪%", en: "4%" },
              right: true,
              why: {
                bn: "ঠিক, ১ ভাগ ২৫। এই রূপান্তরটা কাজের কারণ সংখ্যাটা এখন ব্যাংকের সুদের সঙ্গে সরাসরি তুলনীয়। ঝুঁকিহীন হার ৯% হলে ৪% আয়ের ইল্ডে শেয়ার কেনার একমাত্র যুক্তি হলো আয়টা দ্রুত বাড়বে।",
                en: "Right: 1 divided by 25. The conversion is useful because the number now compares with a bank rate. With a risk-free rate of 9%, buying at a 4% earnings yield only makes sense if earnings will grow fast.",
              },
            },
            {
              text: { bn: "২৫%", en: "25%" },
              why: {
                bn: "না, ওটা পিই নিজেই। আয়ের ইল্ড হলো পিইর উল্টোটা: ১ ভাগ পিই, শতাংশে।",
                en: "No, that is the P/E itself. The earnings yield is its inverse: one divided by the P/E, as a percentage.",
              },
            },
            {
              text: { bn: "১২.৫%", en: "12.5%" },
              why: {
                bn: "ওটা পিই ৮-এর ইল্ড। ২৫-এর ক্ষেত্রে ১ ভাগ ২৫ সমান ০.০৪, অর্থাৎ ৪%।",
                en: "That would be a P/E of 8. For 25, one over 25 is 0.04, so 4%.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানি লোকসানে, তাই তার পিই ঋণাত্মক। কী করবেন?",
            en: "A company is loss-making so its P/E is negative. What now?",
          },
          options: [
            {
              text: { bn: "ঋণাত্মক পিই মানে খুব সস্তা", en: "A negative P/E means very cheap" },
              why: {
                bn: "ঋণাত্মক পিইর কোনো ব্যাখ্যা নেই। সংখ্যাটা গণিতগতভাবে হিসাব হয় আর অর্থগতভাবে কিছুই বোঝায় না।",
                en: "A negative P/E has no interpretation. The number computes and means nothing.",
              },
            },
            {
              text: { bn: "অন্য মাপ ব্যবহার করব, যেমন পিবি বা বিক্রির অনুপাত", en: "Use another measure, such as P/B or a sales multiple" },
              right: true,
              why: {
                bn: "ঠিক। লোকসানে থাকা কোম্পানির ক্ষেত্রে বইমূল্য বা বিক্রির তুলনায় দাম বেশি কাজের, আর সবচেয়ে বেশি কাজের প্রশ্নটা হলো লোকসানটা সাময়িক না কাঠামোগত। উত্তরটা নগদ প্রবাহে থাকে।",
                en: "Right. For a loss-maker, price against book value or against sales works better, and the most useful question is whether the loss is temporary or structural. The answer is in the cash flow.",
              },
            },
            {
              text: { bn: "কোম্পানিটা সম্পূর্ণ এড়িয়ে যাব", en: "Avoid the company entirely" },
              why: {
                bn: "একটা যুক্তিসঙ্গত সতর্কতা, বিশেষ করে নতুনদের জন্য। কিন্তু নিয়ম হিসেবে এটা খুব কড়া: অনেক ভালো কোম্পানির এক-দুইটা লোকসানের বছর থাকে, আর কারণটাই সব বলে দেয়।",
                en: "A reasonable caution, especially early on. As a rule it is too strict: plenty of good companies have a loss year or two, and the reason tells you everything.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"nav": {
  bn: `
<p>এনএভি, নেট অ্যাসেট ভ্যালু, হলো সম্পদ থেকে দায় বাদ দিলে যা থাকে, ভাগ ইউনিট বা শেয়ার সংখ্যা। শব্দটা সবচেয়ে বেশি ব্যবহৃত হয় <a class="term" href="/money/terms/mutual-fund.html">মিউচুয়াল ফান্ডের</a> ক্ষেত্রে, আর সেখানেই এটা সবচেয়ে অর্থবহ।</p>

<p>একটা ফান্ডের ক্ষেত্রে হিসাবটা সরাসরি। ফান্ডের হাতে যত শেয়ার আছে তার আজকের বাজারদর, যোগ নগদ, বিয়োগ যা কিছু বাকি দেনা আছে, ভাগ মোট ইউনিট সংখ্যা। ফলাফলটা বলে দেয় আজ ফান্ডটা ভেঙে ফেললে প্রতি ইউনিটে কত পাওয়া যেত।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>এনএভি = (সম্পদ বিয়োগ দায়) ভাগ ইউনিট সংখ্যা।</li>
<li>ফান্ড প্রতি সপ্তাহে বা মাসে এনএভি প্রকাশ করে, আর তা প্রকাশ্য।</li>
<li>ক্লোজড-এন্ড ফান্ডের বাজারদর এনএভির চেয়ে আলাদা হতে পারে, আর প্রায়ই কম হয়।</li>
<li>দুই রকম এনএভি প্রকাশ হয়: বাজারদরে আর ক্রয়মূল্যে, আর প্রথমটাই আসল।</li>
<li>কোম্পানির ক্ষেত্রে একই ধারণার নাম <a class="term" href="/money/terms/book-value.html">বইমূল্য</a>।</li>
</ul>
</div>

<h2>দুইটা এনএভি, আর কোনটা দেখবেন</h2>

<p>বাংলাদেশে ফান্ডগুলো সাধারণত দুইটা সংখ্যা প্রকাশ করে, আর পার্থক্যটা জানা দরকার।</p>

${mount("nav-compare")}

<p>বাজারদরে হিসাব করা এনএভি বলে আজ ফান্ডের সম্পদ বেচলে কত পাওয়া যেত। ক্রয়মূল্যে হিসাব করাটা বলে ফান্ড ওই সম্পদগুলো কিনতে কত খরচ করেছিল। বাজার পড়ে গেলে দ্বিতীয়টা প্রথমটার চেয়ে বেশি দেখায়, আর সেটা কোনো সান্ত্বনা নয়: আপনি বেচলে বাজারদরই পাবেন।</p>

<p>তাই সিদ্ধান্ত নেওয়ার সময় বাজারদরে হিসাব করা এনএভিটাই দেখুন। কোনো ফান্ড কেবল ক্রয়মূল্যের সংখ্যাটা প্রকাশ করলে সেটা নিজেই একটা তথ্য।</p>

<h2>বাজারদর আর এনএভির দূরত্ব</h2>

<p>ওপেন-এন্ড ফান্ডে এই দূরত্ব থাকে না: আপনি এনএভিতেই কেনেন আর এনএভিতেই ফেরত দেন। ক্লোজড-এন্ড ফান্ডে দূরত্বটা থাকে, কারণ ইউনিটগুলো এক্সচেঞ্জে কেনাবেচা হয় আর দাম ঠিক হয় চাহিদা-জোগানে।</p>

${mount("nav-figure")}

<p>বাংলাদেশে ক্লোজড-এন্ড ফান্ড প্রায় সবসময় এনএভির নিচে থাকে, কখনো ৩০% থেকে ৪০% নিচে। কারণগুলো বাস্তব: ফান্ডের বার্ষিক খরচ ভবিষ্যতের রিটার্ন খাবে, ইউনিটগুলো পাতলা, আর মেয়াদ শেষ হতে অনেক দেরি বলে ছাড়টা বন্ধ হওয়ার কোনো নির্দিষ্ট দিন নেই।</p>

<h2>কোম্পানির এনএভি</h2>

<p>শব্দটা কোম্পানির ক্ষেত্রেও ব্যবহার হয়, আর তখন এটার মানে একটু আলাদা। একটা ফান্ডের সম্পদ হলো শেয়ার, যেগুলোর প্রতিদিনের বাজারদর আছে, তাই এনএভি একটা বাস্তব সংখ্যা। একটা কারখানার সম্পদ হলো জমি, ভবন, যন্ত্র আর মজুদ, যেগুলোর হিসাব বইতে লেখা থাকে ক্রয়মূল্য বিয়োগ অবচয় হিসেবে, আর সেটা আজকের বাজারদর নয়।</p>

<p>এর ফলে দুইটা বিপরীত সমস্যা হয়। জমি অনেক আগে কেনা হলে বইতে যা লেখা তার চেয়ে আজ তার দাম অনেক বেশি, তাই এনএভি কম দেখায়। আবার পুরনো যন্ত্রপাতি বা অচল মজুদ বইতে যা লেখা তার চেয়ে কম দামি, তাই এনএভি বেশি দেখায়। বাংলাদেশে বস্ত্র আর প্রকৌশল খাতে দ্বিতীয়টা বেশি সাধারণ।</p>

<p>তাই কোম্পানির ক্ষেত্রে এনএভি একটা সূচনা, উত্তর নয়। <a class="term" href="/money/terms/book-value.html">বইমূল্যের</a> লেখাটায় এই নিয়ে আরও আছে, আর পর্যায় ৩-এর স্থিতিপত্রের লেখাটায় সম্পদগুলো কীভাবে যাচাই করতে হয় তা আছে।</p>

<h2>এনএভি দিয়ে যা করা যায়</h2>

<p>তিনটা কাজ। এক, ফান্ডের কর্মক্ষমতা মাপা: এনএভি সময়ের সঙ্গে কেমন বেড়েছে সেটাই ফান্ড ম্যানেজারের আসল স্কোরকার্ড, বাজারদর নয়। দুই, ছাড় মাপা: বাজারদর আর এনএভির অনুপাত। তিন, ফান্ডের ভেতরে কী আছে বোঝা: এনএভির সঙ্গে ফান্ডগুলো তাদের পোর্টফোলিওর তালিকাও প্রকাশ করে।</p>

<div class="note">এনএভি একটা হিসাব, একটা প্রতিশ্রুতি নয়। ফান্ডের হাতে যদি পাতলা শেয়ার থাকে, ওই শেয়ারগুলোর সর্বশেষ দাম ধরে হিসাব করা এনএভি বাস্তবে অর্জনযোগ্য নাও হতে পারে: বেচতে গেলে দাম পড়ে যাবে। তাই ফান্ডের পোর্টফোলিওতে কতটা তরল শেয়ার আছে সেটাও দেখার জিনিস।</div>

<h2>নিজে যাচাই করুন</h2>

${mount("nav-quiz")}
`,
  en: `
<p>NAV, net asset value, is assets minus liabilities divided by the number of units or shares. The term is used most about <a class="term" href="/money/terms/mutual-fund.html">mutual funds</a>, and that is where it means most.</p>

<p>For a fund the calculation is direct. Today's market value of everything the fund holds, plus cash, minus whatever it owes, divided by the units in issue. The result says what one unit would fetch if the fund were wound up today.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>NAV is assets minus liabilities, over units.</li>
<li>Funds publish it weekly or monthly, and it is public.</li>
<li>A closed-end fund's market price can differ from NAV, and usually sits below it.</li>
<li>Two NAVs get published, at market and at cost, and the first is the real one.</li>
<li>The same idea for a company is called <a class="term" href="/money/terms/book-value.html">book value</a>.</li>
</ul>
</div>

<h2>Two NAVs, and which to read</h2>

<p>Funds here usually publish two numbers, and the difference is worth knowing.</p>

${mount("nav-compare")}

<p>NAV at market value says what the fund's holdings would fetch today. NAV at cost says what the fund paid for them. After a market fall the second is higher than the first, and that is no consolation: if you sell you receive market value.</p>

<p>So read the market-value NAV when deciding anything. A fund publishing only the cost figure is itself telling you something.</p>

<h2>The gap between price and NAV</h2>

<p>Open-end funds have no gap: you buy at NAV and redeem at NAV. Closed-end funds do, because the units trade on the exchange and the price is set by supply and demand.</p>

${mount("nav-figure")}

<p>Closed-end funds in Bangladesh sit below NAV almost always, sometimes 30% to 40% below. The reasons are real: annual costs will eat future returns, the units are thin, and with maturity far away there is no particular day on which the discount has to close.</p>

<h2>A company's NAV</h2>

<p>The term is used for companies too, and there it means something slightly different. A fund's assets are shares with a daily market price, so its NAV is a real number. A factory's assets are land, buildings, machines and stock, carried in the books at cost less depreciation, which is not today's market value.</p>

<p>That produces two opposite problems. Land bought long ago is worth far more today than the books say, so NAV understates. Old machinery or obsolete stock is worth less than the books say, so NAV overstates. In garments and engineering here the second is the common one.</p>

<p>So for a company NAV is a starting point rather than an answer. The <a class="term" href="/money/terms/book-value.html">book value</a> lesson goes further, and stage 3's balance sheet lesson covers how to test the assets themselves.</p>

<h2>What you can do with NAV</h2>

<p>Three things. Measure the fund's performance: how NAV grew over time is the manager's actual scorecard, not the market price. Measure the discount: market price against NAV. And understand what is inside: funds publish their portfolio alongside the NAV.</p>

<div class="note">NAV is a calculation, not a promise. If a fund holds thin shares, a NAV computed from their last traded prices may not be achievable: selling would push those prices down. So how much of the portfolio is liquid is worth looking at too.</div>

<h2>Check yourself</h2>

${mount("nav-quiz")}
`,
  blocks: {
    "nav-compare": {
      kind: "compare",
      title: { bn: "বাজারদরে আর ক্রয়মূল্যে", en: "At market and at cost" },
      columns: [
        { bn: "বাজারদরে এনএভি", en: "NAV at market" },
        { bn: "ক্রয়মূল্যে এনএভি", en: "NAV at cost" },
      ],
      rows: [
        {
          label: { bn: "কী মাপে", en: "What it measures" },
          cells: [
            { bn: "আজ বেচলে কত পাওয়া যাবে", en: "What selling today would fetch" },
            { bn: "ফান্ড কত খরচ করেছিল", en: "What the fund paid" },
          ],
          best: 0,
        },
        {
          label: { bn: "বাজার পড়লে", en: "After a market fall" },
          cells: [{ bn: "কমে যায়", en: "Falls" }, { bn: "একই থাকে", en: "Stays put" }],
        },
        {
          label: { bn: "সিদ্ধান্তে কাজে লাগে?", en: "Useful for a decision?" },
          cells: [{ bn: "হ্যাঁ", en: "Yes" }, { bn: "প্রায় না", en: "Barely" }],
          best: 0,
        },
      ],
    },
    "nav-figure": {
      kind: "figure",
      shape: "scale",
      title: { bn: "এনএভি আর বাজারদর", en: "NAV against market price" },
      parts: [
        {
          text: { bn: "প্রতি ইউনিটে এনএভি", en: "NAV per unit" },
          note: { bn: "ফান্ডের হাতে যা আছে তার হিসাব", en: "What the fund actually holds" },
          value: 14,
          tone: "good",
        },
        {
          text: { bn: "বাজারদর", en: "Market price" },
          note: { bn: "আজ কেউ যত দিতে রাজি, আর ছাড়টা প্রায় ৩৬%", en: "What somebody will pay today: a 36% discount" },
          value: 9,
          tone: "warn",
        },
      ],
      caption: {
        bn: "ছাড়টা সুযোগ হতে পারে, আবার ভবিষ্যতের খরচ আর তারল্যের ঝুঁকির সৎ মূল্যায়নও হতে পারে। কোনটা, সেটা ফান্ডের নথিতে খুঁজতে হয়।",
        en: "The discount can be an opportunity, or an honest verdict on future costs and thin liquidity. Which one is a question for the fund's own documents.",
      },
    },
    "nav-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা ক্লোজড-এন্ড ফান্ডের বাজারদর এক বছরে ৮ টাকা থেকে ৯ টাকা হয়েছে, আর এনএভি ১৪ থেকে ১৩ টাকায় নেমেছে। ফান্ড ম্যানেজার কেমন করলেন?",
            en: "A closed-end fund's market price went from 8 to 9 in a year while NAV went from 14 to 13. How did the manager do?",
          },
          options: [
            {
              text: { bn: "ভালো, দাম বেড়েছে", en: "Well: the price rose" },
              why: {
                bn: "দাম বেড়েছে ছাড় কমার কারণে, ম্যানেজারের কাজের কারণে নয়। ম্যানেজারের হাতে যা ছিল সেটা কমেছে।",
                en: "The price rose because the discount narrowed, not because of the manager's work. What the manager holds fell in value.",
              },
            },
            {
              text: { bn: "খারাপ, কারণ এনএভি কমেছে আর সেটাই তার স্কোরকার্ড", en: "Badly: NAV fell, and NAV is the scorecard" },
              right: true,
              why: {
                bn: "ঠিক। বাজারদর বদলায় বিনিয়োগকারীদের মেজাজে; এনএভি বদলায় ম্যানেজার যা কিনেছেন তার মূল্যে। ফান্ড ম্যানেজারের কাজ বিচার করতে হলে এনএভির ধারাটা দেখতে হয়, আর সেটাকে সূচকের সঙ্গে মিলিয়ে দেখতে হয়।",
                en: "Right. The market price moves with investor mood; NAV moves with the value of what the manager bought. To judge a manager, read the NAV series and compare it to the index.",
              },
            },
            {
              text: { bn: "বলা যাবে না", en: "Cannot say" },
              why: {
                bn: "বলা যাবে, আর সংখ্যাটা এখানেই আছে: এনএভি ১৪ থেকে ১৩, মানে ৭% ক্ষতি। প্রশ্নটা কেবল কোন সংখ্যাটা দেখতে হবে।",
                en: "You can say, and the number is right here: NAV from 14 to 13 is a 7% loss. The only question was which number to read.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা ওপেন-এন্ড ফান্ডের এনএভি ২৫ টাকা। আপনি কত দামে কিনবেন?",
            en: "An open-end fund has a NAV of 25. What do you pay?",
          },
          options: [
            {
              text: { bn: "প্রায় ২৫ টাকা, ফান্ডের ফি যোগ করে", en: "About 25, plus the fund's own charge" },
              right: true,
              why: {
                bn: "ঠিক। ওপেন-এন্ড ফান্ড এনএভি ধরে বেচে আর কেনে, তাই ছাড় বা প্রিমিয়াম হয় না। কিছু ফান্ড ঢোকা বা বেরোনোর সময় ছোট একটা ফি নেয়, আর সেটা নথিতে লেখা থাকে।",
                en: "Right. An open-end fund transacts at NAV, so no discount or premium arises. Some charge a small entry or exit fee, which is set out in the documents.",
              },
            },
            {
              text: { bn: "যা বাজারে চলছে, চাহিদা অনুযায়ী", en: "Whatever the market says, by demand" },
              why: {
                bn: "ওটা ক্লোজড-এন্ড ফান্ডের ব্যাপার, যেগুলো এক্সচেঞ্জে কেনাবেচা হয়। ওপেন-এন্ড ফান্ডে বাজার বলে কিছু নেই, সরাসরি ফান্ডের সঙ্গে লেনদেন।",
                en: "That is a closed-end fund, which trades on the exchange. An open-end fund has no market: you transact with the fund itself.",
              },
            },
            {
              text: { bn: "এনএভির ৩০% ছাড়ে", en: "At a 30% discount to NAV" },
              why: {
                bn: "ছাড় ক্লোজড-এন্ড ফান্ডে হয়, আর সেটার কারণ ইউনিটগুলো বাজারে হাত বদলায়। ওপেন-এন্ডে ছাড়ের কোনো জায়গা নেই।",
                en: "Discounts happen in closed-end funds because their units change hands in a market. There is no room for one in an open-end fund.",
              },
            },
          ],
        },
      ],
    },
  },
},
};
