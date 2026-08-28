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
};
