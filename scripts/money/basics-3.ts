/* ============================================================
   ভিত্তি, পর্যায় ৩: নিজে যাচাই করুন. Seventeen lessons.

   What seeded these rows. See `scripts/money/shape.ts` for why
   this file is kept and what it is not.
   ============================================================ */

import { mount, type Written } from "./shape.ts";

export const LESSONS: Written = {

/* ---------------------------------------------------------- */
"dse-website": {
  bn: `
<p>এই পর্যায়টা একটা কথার উপর দাঁড়িয়ে: <strong>নিজে যাচাই করুন।</strong> আর যাচাই করতে হলে জানতে হবে তথ্যটা কোথায় আছে। বাংলাদেশে একজন ব্যক্তি বিনিয়োগকারীর জন্য সবচেয়ে বড় বিনামূল্যের তথ্যভাণ্ডার একটাই: ডিএসইর নিজের ওয়েবসাইট।</p>

<p>সাইটটা দেখতে পুরনো ধাঁচের, আর সেটা কোনো সমস্যা নয়। এখানে যা আছে তার জন্য কোনো সাবস্ক্রিপশন লাগে না, কোনো অ্যাকাউন্ট লাগে না, আর এটাই প্রতিটা তালিকাভুক্ত কোম্পানির আনুষ্ঠানিক তথ্যের মূল উৎস।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>প্রতিটা কোম্পানির নিজের একটা পাতা আছে, আর সেটাই শুরুর জায়গা।</li>
<li>ঘোষণার পাতা হলো যেখানে কোম্পানি প্রথম কথা বলে।</li>
<li>শেয়ারহোল্ডিংয়ের বিন্যাস বলে কে কতটা ধরে আছেন।</li>
<li>আর্থিক সারসংক্ষেপে কয়েক বছরের সংখ্যা এক জায়গায় থাকে।</li>
<li>যা এখানে নেই তা হলো বিশ্লেষণ, আর সেটা আপনার কাজ।</li>
</ul>
</div>

<h2>একটা কোম্পানির পাতায় কী কী থাকে</h2>

${mount("dse-screen")}

<p>খেয়াল করুন এখানে কোনো মতামত নেই। কোনো তারকা রেটিং নেই, কোনো কিনুন বা বেচুন নেই, কোনো লক্ষ্য দাম নেই। যা আছে তা হলো সংখ্যা আর নথি, আর সেটাই এই সাইটটার সবচেয়ে বড় গুণ।</p>

<h2>ঘোষণার পাতা, যা রোজকার কাজের জায়গা</h2>

<p>একটা কোম্পানি যখন কিছু জানায়, সেটা এখানে আসে। প্রান্তিক ফলাফল, লভ্যাংশের সিদ্ধান্ত, এজিএমের তারিখ, পরিচালকদের শেয়ার লেনদেন, বড় চুক্তি, উৎপাদন বন্ধ থাকা, নিয়ন্ত্রকের কোনো নির্দেশ।</p>

<p>এই পাতাটার একটা বৈশিষ্ট্য আছে যা মূল্যবান: এখানে ঘোষণাটা যেমন লেখা হয়েছিল তেমনই থাকে, সংবাদমাধ্যমের সংক্ষিপ্তকরণ ছাড়া। <a class="term" href="/money/basics-2/apps-and-sites.html">কোন অ্যাপ, কোন সাইট</a> লেখায় দেখা হয়েছে কেন মূল উৎসে মিলিয়ে নেওয়া দরকার, আর এটাই সেই মূল উৎস।</p>

<div class="ex">
<p><strong>একটা শিরোনাম আর একটা ঘোষণা।</strong> পত্রিকা লিখল: কোম্পানি ২০% লভ্যাংশ ঘোষণা করেছে। মূল ঘোষণায় লেখা: ২০% স্টক ডিভিডেন্ড, নগদ নয়, আর এটা এজিএমে শেয়ারহোল্ডারদের অনুমোদনের সাপেক্ষে। দুইটা বাক্য একই ঘটনার, আর সিদ্ধান্তের জন্য দ্বিতীয়টা সম্পূর্ণ আলাদা তথ্য।</p>
</div>

<h2>শেয়ারহোল্ডিংয়ের বিন্যাস</h2>

<p>এই তথ্যটা কম দেখা হয় আর অনেক কিছু বলে। এটা দেখায় শেয়ারগুলোর কত অংশ উদ্যোক্তা বা পরিচালকদের কাছে, কত অংশ প্রাতিষ্ঠানিক বিনিয়োগকারীদের কাছে, আর কত অংশ সাধারণ মানুষের কাছে।</p>

<p>দুইটা কারণে এটা কাজের। প্রথমত, উদ্যোক্তাদের অংশ বেশি মানে তাদের নিজেদের টাকাও এখানে আছে, আর সেটা সাধারণত ভালো লক্ষণ। দ্বিতীয়ত, সাধারণ মানুষের হাতে থাকা অংশ কম মানে <a class="term" href="/money/terms/liquidity.html">ভাসমান শেয়ার</a> কম, আর কম ভাসমান শেয়ার মানে দাম অল্প লেনদেনেই অনেক নড়ে।</p>

${mount("dse-match")}

<h2>আর্থিক সারসংক্ষেপ</h2>

<p>প্রতিটা কোম্পানির পাতায় কয়েক বছরের প্রধান সংখ্যাগুলো এক জায়গায় থাকে: আয়, মুনাফা, প্রতি শেয়ার আয়, প্রতি শেয়ার নিট সম্পদ মূল্য আর লভ্যাংশের ইতিহাস।</p>

<p>এটা বার্ষিক প্রতিবেদনের বিকল্প নয়, কিন্তু এটা একটা দ্রুত ছাঁকনি। পাঁচ বছরের ইপিএস পাশাপাশি দেখলেই বোঝা যায় কোম্পানিটা বাড়ছে, স্থির আছে, নাকি কমছে, আর সেটুকু জানার পরেই ঠিক করা যায় বার্ষিক প্রতিবেদনটা খোলার মতো কি না।</p>

<div class="note">
<p>একটা সতর্কতা: সারসংক্ষেপের সংখ্যাগুলো নিরীক্ষিত হিসাব থেকে আসে, কিন্তু সংক্ষিপ্ত। কোনো সংখ্যা যদি সিদ্ধান্তের কেন্দ্রে থাকে, তাহলে সেটা মূল প্রতিবেদনে মিলিয়ে নিন। <a class="term" href="/money/basics-3/annual-report.html">বার্ষিক প্রতিবেদন</a> লেখাটা সেটা কীভাবে করতে হয় দেখায়।</p>
</div>

<h2>বাজারের সামগ্রিক ছবি</h2>

<p>কোম্পানির পাতার বাইরে সাইটটায় বাজারের সারসংক্ষেপও আছে: সূচকের অবস্থান, দিনের মোট লেনদেন, খাতভিত্তিক পরিসংখ্যান, আর সবচেয়ে বেশি বাড়া আর কমা শেয়ারের তালিকা।</p>

<p>খাতভিত্তিক পরিসংখ্যানটা একটা অবমূল্যায়িত পাতা। এটা দেখলে বোঝা যায় আজকের নড়াচড়াটা পুরো বাজারের, নাকি একটা খাতের, নাকি একটা কোম্পানির। এই তিনটার পার্থক্য জানা থাকলে <a class="term" href="/money/basics-2/when-to-sell.html">বেচার সিদ্ধান্ত</a> অনেক সহজ হয়ে যায়।</p>

${mount("dse-drill")}

${mount("dse-quiz")}
`,
  en: `
<p>This stage rests on one idea: <strong>check it yourself.</strong> And checking means knowing where the information lives. For an individual investor in Bangladesh there is one largest free source of it: the DSE's own website.</p>

<p>The site looks dated, and that is not a problem. Nothing on it needs a subscription or an account, and it is the primary source of official information for every listed company.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Every company has its own page, and that is where you start.</li>
<li>The announcements page is where a company speaks first.</li>
<li>The shareholding pattern tells you who holds how much.</li>
<li>The financial summary puts several years of numbers in one place.</li>
<li>What is not there is analysis, and that is your job.</li>
</ul>
</div>

<h2>What a company's page holds</h2>

${mount("dse-screen")}

<p>Notice there are no opinions here. No star ratings, no buy or sell, no target prices. There are numbers and documents, and that is the site's greatest virtue.</p>

<h2>The announcements page, where the daily work happens</h2>

<p>When a company tells the public something, it appears here. Quarterly results, dividend decisions, AGM dates, directors trading their own shares, large contracts, production halts, a regulatory directive.</p>

<p>This page has one valuable property: the announcement appears as it was written, without a newspaper's condensation. The lesson on <a class="term" href="/money/basics-2/apps-and-sites.html">apps and sites</a> explained why verifying at the primary source matters, and this is that source.</p>

<div class="ex">
<p><strong>One headline and one filing.</strong> The paper says: the company has declared a 20% dividend. The filing says: 20% stock dividend, not cash, subject to shareholder approval at the AGM. Two sentences about the same event, and for a decision the second is entirely different information.</p>
</div>

<h2>The shareholding pattern</h2>

<p>This is looked at rarely and says a great deal. It shows what share of the company sits with sponsors and directors, what share with institutions, and what share with the general public.</p>

<p>It is useful for two reasons. First, a large sponsor holding means their own money is in it too, which is usually a good sign. Second, a small public holding means a small <a class="term" href="/money/terms/liquidity.html">free float</a>, and a small free float means the price moves a long way on little trading.</p>

${mount("dse-match")}

<h2>The financial summary</h2>

<p>Every company page carries several years of headline numbers in one place: revenue, profit, earnings per share, net asset value per share and the dividend history.</p>

<p>It is not a substitute for the annual report, and it is a fast filter. Five years of EPS side by side tells you at once whether the company is growing, flat or shrinking, and only after knowing that is it worth deciding whether to open the annual report.</p>

<div class="note">
<p>A caution: the summary figures come from audited accounts, in condensed form. If a number sits at the centre of a decision, check it in the original report. The lesson on <a class="term" href="/money/basics-3/annual-report.html">the annual report</a> shows how.</p>
</div>

<h2>The whole-market picture</h2>

<p>Beyond company pages the site carries a market summary: where the index stands, total turnover for the day, sector statistics, and lists of the biggest risers and fallers.</p>

<p>The sector statistics page is underrated. Reading it tells you whether today's move belongs to the whole market, to one sector, or to one company. Knowing which of the three makes a <a class="term" href="/money/basics-2/when-to-sell.html">selling decision</a> far easier.</p>

${mount("dse-drill")}

${mount("dse-quiz")}
`,
  blocks: {
    "dse-screen": {
      kind: "figure",
      shape: "callouts",
      title: { bn: "একটা কোম্পানির পাতা", en: "A company page" },
      note: { bn: "প্রতিটা অংশের পাশে সেটা কী প্রশ্নের উত্তর দেয়।", en: "Beside each section, the question it answers." },
      screen: {
        title: { bn: "কোম্পানির পাতা", en: "Company page" },
        rows: [
          { label: { bn: "বাজার তথ্য", en: "Market information" }, value: { bn: "দাম, ভলিউম, সার্কিট", en: "Price, volume, circuit" } },
          { label: { bn: "মৌলিক তথ্য", en: "Basic information" }, value: { bn: "খাত, তালিকাভুক্তির বছর, ক্যাটাগরি", en: "Sector, year listed, category" } },
          { label: { bn: "আর্থিক সারসংক্ষেপ", en: "Financial summary" }, value: { bn: "কয়েক বছরের ইপিএস, এনএভি", en: "Several years of EPS and NAV" } },
          { label: { bn: "লভ্যাংশের ইতিহাস", en: "Dividend history" }, value: { bn: "বছরওয়ারি, নগদ আর বোনাস", en: "Year by year, cash and bonus" } },
          { label: { bn: "শেয়ারহোল্ডিংয়ের বিন্যাস", en: "Shareholding pattern" }, value: { bn: "উদ্যোক্তা, প্রাতিষ্ঠানিক, সাধারণ", en: "Sponsor, institutional, public" } },
          { label: { bn: "ঘোষণা ও প্রতিবেদন", en: "Announcements and reports" }, value: { bn: "সব ফাইলিং, তারিখসহ", en: "Every filing, with dates" } },
        ],
      },
      parts: [
        { text: { bn: "আজ কী হচ্ছে", en: "What is happening today" }, note: { bn: "এটা সবচেয়ে কম গুরুত্বপূর্ণ অংশ, আর সবাই এখানেই থামেন।", en: "The least important part, and where most people stop." }, at: 0 },
        { text: { bn: "এটা কী ধরনের কোম্পানি", en: "What kind of company this is" }, note: { bn: "খাতটা জানলে চালিকাশক্তি জানা যায়।", en: "Knowing the sector tells you the driver." }, at: 1 },
        { text: { bn: "ব্যবসাটা বাড়ছে না কমছে", en: "Is the business growing or shrinking" }, note: { bn: "পাঁচ বছরের ইপিএস পাশাপাশি, ত্রিশ সেকেন্ডের ছাঁকনি।", en: "Five years of EPS side by side: a thirty-second filter." }, tone: "lead", at: 2 },
        { text: { bn: "নগদ সত্যিই বেরোয় কি না", en: "Does cash actually come out" }, note: { bn: "টানা লভ্যাংশ দেওয়া কোম্পানির নগদ প্রবাহ সাধারণত সত্যিকারের।", en: "A company paying dividends year after year usually has real cash flow." }, tone: "good", at: 3 },
        { text: { bn: "কে ধরে আছেন, আর ভাসমান শেয়ার কত", en: "Who holds it, and how big the float is" }, note: { bn: "ভাসমান কম মানে দাম অল্প লেনদেনেই বেশি নড়ে।", en: "A small float means the price moves a lot on little trading." }, at: 4 },
        { text: { bn: "কোম্পানি নিজে কী বলেছে", en: "What the company itself said" }, note: { bn: "মূল উৎস। সংবাদমাধ্যমের সংক্ষিপ্তকরণ এখানে নেই।", en: "The primary source. No newspaper condensation here." }, tone: "lead", at: 5 },
      ],
      caption: {
        bn: "উপর থেকে নিচে যত নামবেন, তথ্য তত বেশি কাজের হবে। বেশিরভাগ মানুষ প্রথম সারিতেই থেমে যান।",
        en: "The further down you read, the more useful the information becomes. Most people stop at the first row.",
      },
    },
    "dse-match": {
      kind: "match",
      title: { bn: "প্রশ্ন আর পাতা", en: "Question and page" },
      note: { bn: "কোন প্রশ্নের উত্তর ডিএসইর সাইটের কোন অংশে, মেলান।", en: "Match each question with the part of the DSE site that answers it." },
      pairs: [
        { left: { bn: "কোম্পানি কি নতুন কিছু জানিয়েছে", en: "Has the company announced anything" }, right: { bn: "ঘোষণার পাতা", en: "The announcements page" } },
        { left: { bn: "উদ্যোক্তারা কত অংশ ধরে আছেন", en: "How much do the sponsors hold" }, right: { bn: "শেয়ারহোল্ডিংয়ের বিন্যাস", en: "The shareholding pattern" } },
        { left: { bn: "গত পাঁচ বছরে আয় বেড়েছে কি", en: "Has profit grown over five years" }, right: { bn: "আর্থিক সারসংক্ষেপ", en: "The financial summary" } },
        { left: { bn: "আজকের নড়াচড়াটা কি পুরো বাজারের", en: "Is today's move market-wide" }, right: { bn: "খাতভিত্তিক পরিসংখ্যান", en: "The sector statistics" } },
        { left: { bn: "শেয়ারটা কোন ক্যাটাগরিতে", en: "Which category is the share in" }, right: { bn: "মৌলিক তথ্য", en: "The basic information block" } },
        { left: { bn: "এই মুহূর্তে কত দামে কেনা যাবে", en: "What would it cost to buy right now" }, right: { bn: "বাজার তথ্য, বিড আর আস্ক", en: "Market information, bid and ask" } },
      ],
    },
    "dse-drill": {
      kind: "drill",
      title: { bn: "একটা কোম্পানির পাতা খুলে বসুন", en: "Sit down with one company page" },
      note: { bn: "পনেরো মিনিট, একটা কোম্পানি। কিছু কেনার প্রশ্ন নেই।", en: "Fifteen minutes, one company. Buying does not come into it." },
      steps: [
        { text: { bn: "ডিএসইর সাইটে একটা কোম্পানির পাতা খুলুন।", en: "Open one company's page on the DSE site." } },
        {
          text: { bn: "আর্থিক সারসংক্ষেপ থেকে গত পাঁচ বছরের ইপিএস লিখে ফেলুন।", en: "Write down five years of EPS from the financial summary." },
          hint: { bn: "সংখ্যাগুলো পাশাপাশি লিখলে ধারাটা চোখে পড়ে।", en: "Writing them side by side makes the trend visible." },
        },
        { text: { bn: "লভ্যাংশের ইতিহাস দেখুন: কোন বছর কত, নগদ নাকি বোনাস।", en: "Look at the dividend history: how much each year, cash or bonus." } },
        {
          text: { bn: "শেয়ারহোল্ডিংয়ের বিন্যাসে সাধারণ মানুষের হাতে কত শতাংশ আছে দেখুন।", en: "In the shareholding pattern, find what percentage the public holds." },
          hint: { bn: "এটাই মোটামুটি ভাসমান শেয়ার, আর তারল্যের প্রথম ইঙ্গিত।", en: "That is roughly the free float, and the first hint about liquidity." },
        },
        { text: { bn: "ঘোষণার তালিকায় গত ছয় মাসের ঘোষণাগুলো দেখুন।", en: "Look at the last six months of announcements." } },
        {
          text: { bn: "যেকোনো একটা ঘোষণা পুরোটা পড়ুন, আর এক বাক্যে লিখুন এটা কী বলছে।", en: "Read one announcement in full and write one sentence saying what it says." },
        },
      ],
    },
    "dse-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানির শেয়ারহোল্ডিংয়ে দেখা যাচ্ছে সাধারণ মানুষের হাতে মাত্র ৮%। এটা কী বোঝায়?",
            en: "A company's shareholding pattern shows only 8% held by the public. What does that mean?",
          },
          options: [
            {
              text: { bn: "ভাসমান শেয়ার কম, তাই দাম অল্প লেনদেনেই অনেক নড়বে", en: "The float is small, so the price will move a lot on little trading" },
              right: true,
              why: {
                bn: "ঠিক, আর এটা দুই দিকেই কাজ করে। অল্প কেনাতেই দাম অনেক ওঠে, আর অল্প বিক্রিতেই অনেক পড়ে। এমন শেয়ারে ঢোকার আগে বেরোনোর খরচটা হিসাব করা দরকার, কারণ যেদিন বেরোতে চাইবেন সেদিন ক্রেতা কম থাকতে পারে।",
                en: "Right, and it works both ways. A little buying lifts the price a long way and a little selling drops it a long way. Before entering such a share, calculate the cost of leaving, because on the day you want out there may be few buyers.",
              },
            },
            {
              text: { bn: "কোম্পানিটা খারাপ, তাই কেউ কিনছে না", en: "The company is bad, so nobody buys it" },
              why: {
                bn: "কম ভাসমান শেয়ার মানে কম শেয়ার ছাড়া হয়েছে, চাহিদা কম নয়। অনেক ভালো কোম্পানির ভাসমান শেয়ার কম, কারণ উদ্যোক্তারা বেশিরভাগটা ধরে রেখেছেন। এটা তারল্যের তথ্য, মানের নয়।",
                en: "A small float means few shares were released, not that demand is low. Plenty of good companies have small floats because the sponsors kept most of it. This is information about liquidity, not quality.",
              },
            },
            {
              text: { bn: "শেয়ারটা সস্তা হবে, কারণ কম মানুষ কিনতে পারেন", en: "The share will be cheap, because few people can buy it" },
              why: {
                bn: "প্রায়ই উল্টোটা ঘটে। কম জোগান মানে দাম বেশি হওয়ার প্রবণতা, কারণ যারা কিনতে চান তারা সীমিত শেয়ারের জন্য প্রতিযোগিতা করেন।",
                en: "Usually the opposite happens. Less supply tends to mean a higher price, because buyers compete for a limited number of shares.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা শেয়ার আজ ৭% পড়েছে। ডিএসইর সাইটে প্রথমে কোথায় দেখবেন?",
            en: "A share is down 7% today. Where on the DSE site do you look first?",
          },
          options: [
            {
              text: { bn: "ঘোষণার পাতায়, আর তারপর খাতভিত্তিক পরিসংখ্যানে", en: "The announcements page, then the sector statistics" },
              right: true,
              why: {
                bn: "ঠিক, আর ক্রমটাও ঠিক। প্রথমে দেখুন কোম্পানির নিজের কোনো খবর আছে কি না। না থাকলে দেখুন পুরো খাত পড়েছে কি না, আর তারপর পুরো বাজার। এই তিনটার মধ্যে কোনটা, সেটাই ঠিক করে এটা আপনার সমস্যা নাকি বাজারের।",
                en: "Right, and in that order. First see whether the company itself announced anything. If not, see whether the whole sector fell, and then the whole market. Which of the three it is decides whether this is your problem or the market's.",
              },
            },
            {
              text: { bn: "সবচেয়ে বেশি কমা শেয়ারের তালিকায়", en: "The list of biggest fallers" },
              why: {
                bn: "এই তালিকায় থাকা কেবল বলে যে শেয়ারটা বেশি পড়েছে, যা আপনি ইতিমধ্যে জানেন। কারণটা এখানে নেই।",
                en: "Appearing on that list only says the share fell a lot, which you already know. The cause is not there.",
              },
            },
            {
              text: { bn: "আর্থিক সারসংক্ষেপে", en: "The financial summary" },
              why: {
                bn: "সারসংক্ষেপ কয়েক মাস বা এক বছরের পুরনো তথ্য, তাই আজকের একটা পতনের ব্যাখ্যা সেখানে থাকবে না। এটা পরের ধাপ, যদি ঘোষণাটা সত্যিই ব্যবসার কিছু বদলে দেয়।",
                en: "The summary is months or a year old, so it will not explain a fall today. It is the next step, if the announcement really changes something about the business.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"annual-report": {
  bn: `
<p>বার্ষিক প্রতিবেদন একটা কোম্পানির সবচেয়ে সম্পূর্ণ আত্মপরিচয়। এটা দুইশো পৃষ্ঠার হতে পারে, তার বেশিরভাগ ছবি আর আইনি ভাষা, আর তার ভেতরে ত্রিশ পৃষ্ঠা আছে যা সত্যিই গুরুত্বপূর্ণ।</p>

<p>এই লেখাটা সেই ত্রিশ পৃষ্ঠা খুঁজে বের করতে শেখায়, আর কোন ক্রমে পড়লে সবচেয়ে কম সময়ে সবচেয়ে বেশি বোঝা যায় সেটা দেখায়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>প্রতিবেদনটা পাওয়া যায় কোম্পানির সাইটে আর ডিএসইর পাতায়।</li>
<li>পড়ার ক্রম: নিরীক্ষকের মতামত, তারপর হিসাব, তারপর ব্যবস্থাপনার আলোচনা।</li>
<li>নিরীক্ষকের মতামতে শর্ত থাকলে সেটাই সবচেয়ে বড় তথ্য।</li>
<li>নোটগুলোতে আসল বিবরণ থাকে, আর সেগুলো পড়া হয় সবচেয়ে কম।</li>
<li>টানা তিন বছরের প্রতিবেদন পড়লে একটা বছরের চেয়ে অনেক বেশি বোঝা যায়।</li>
</ul>
</div>

<h2>কোথায় পাবেন</h2>

<p>দুইটা জায়গা। কোম্পানির নিজের ওয়েবসাইটে সাধারণত একটা বিনিয়োগকারী সম্পর্কিত পাতা থাকে যেখানে কয়েক বছরের প্রতিবেদন রাখা হয়। আর <a class="term" href="/money/basics-3/dse-website.html">ডিএসইর</a> কোম্পানি পাতায় প্রতিবেদনের সংযোগ থাকে।</p>

<p>একটা পরামর্শ যা পরে কাজে লাগবে: শেষ তিন বছরের প্রতিবেদন একসঙ্গে নামিয়ে রাখুন। তিনটা পাশাপাশি রাখলে যা দেখা যায় তা একটা দিয়ে দেখা যায় না, কারণ ধারা একটা সংখ্যার চেয়ে বেশি বলে।</p>

<h2>পড়ার ক্রম</h2>

${mount("ar-steps")}

<p>ক্রমটা উল্টো মনে হতে পারে, কারণ প্রতিবেদনের শুরুতে থাকে চেয়ারম্যানের বাণী আর ছবি, আর শেষে থাকে হিসাব আর নোট। উল্টো দিক থেকে পড়া ইচ্ছাকৃত: আপনি সংখ্যাগুলো দেখতে চান তার আগে যে ব্যাখ্যাগুলো আপনার মনকে প্রভাবিত করবে সেগুলো পড়ার আগে।</p>

<h2>নিরীক্ষকের মতামত, যা সবচেয়ে ছোট আর সবচেয়ে গুরুত্বপূর্ণ</h2>

<p>এটা এক বা দুই পৃষ্ঠা, আর এটাই প্রথমে পড়া উচিত। একজন স্বাধীন নিরীক্ষক বলছেন হিসাবগুলো কোম্পানির অবস্থার সত্য আর ন্যায্য চিত্র দেয় কি না।</p>

<p>বেশিরভাগ ক্ষেত্রে মতামতটা শর্তহীন, আর তখন এটা পড়তে দশ সেকেন্ড লাগে। কিন্তু যদি সেখানে শর্ত থাকে, বা কোনো বিষয়ের উপর জোর দেওয়া হয়, বা চলমান প্রতিষ্ঠান হিসেবে টিকে থাকা নিয়ে সন্দেহ প্রকাশ করা হয়, তাহলে সেটাই পুরো প্রতিবেদনের সবচেয়ে গুরুত্বপূর্ণ বাক্য।</p>

<div class="note">
<p>শব্দগুলো নিরস আর সেটাই তাদের শক্তি। "উপরোক্ত বিষয়টি ছাড়া" বা "চলমান প্রতিষ্ঠান হিসেবে টিকে থাকার সক্ষমতা নিয়ে উল্লেখযোগ্য অনিশ্চয়তা" এই ধরনের বাক্য পেলে থামুন আর পুরো অনুচ্ছেদটা পড়ুন। এগুলো কখনো আকস্মিক নয়।</p>
</div>

<h2>নোটগুলোই আসল প্রতিবেদন</h2>

<p>মূল হিসাবের পাতাগুলো সংক্ষিপ্ত: কয়েকটা লাইন, কয়েকটা সংখ্যা। প্রতিটা লাইনের পাশে একটা নোট নম্বর থাকে, আর সেই নোটে বিবরণটা থাকে।</p>

<p>উদাহরণ। স্থিতিপত্রে লেখা "প্রাপ্য হিসাব: ৪২ কোটি"। নোটে থাকে সেই ৪২ কোটির কত অংশ ছয় মাসের বেশি পুরনো, আর কত অংশ একজন ক্রেতার কাছে। এই দুইটা তথ্য সংখ্যাটাকে পুরোপুরি অন্য অর্থ দিতে পারে।</p>

${mount("ar-spot")}

<h2>ব্যবস্থাপনার আলোচনা</h2>

<p>এই অংশে ব্যবস্থাপনা বছরটা ব্যাখ্যা করেন। এটা পড়া দরকার, আর একটা নির্দিষ্ট প্রশ্ন মাথায় রেখে: <strong>খারাপ খবরগুলো কীভাবে বলা হয়েছে?</strong></p>

<p>একটা ভালো ব্যবস্থাপনা খারাপ বছরের কারণ পরিষ্কার করে বলেন, সংখ্যাসহ, আর কী করা হচ্ছে সেটাও বলেন। একটা দুর্বল ব্যবস্থাপনা কেবল বাইরের কারণ দেখান: বাজার খারাপ, ডলার বেড়েছে, নীতি বদলেছে। বাইরের কারণগুলো সত্যি হতে পারে, আর তবু প্রশ্নটা থেকে যায়: একই পরিস্থিতিতে প্রতিযোগীরা কেমন করেছে?</p>

<p>গত বছরের প্রতিবেদনে দেওয়া প্রতিশ্রুতিগুলো এই বছরের সঙ্গে মিলিয়ে দেখা একটা শক্তিশালী পরীক্ষা। যে ব্যবস্থাপনা যা বলে তা করে, তার পরের বছরের কথাও বেশি ওজন পাওয়ার যোগ্য।</p>

${mount("ar-order")}

<h2>একটা বাস্তবসম্মত সময়সূচি</h2>

<p>পুরো প্রতিবেদন এক বসায় পড়ার দরকার নেই আর কেউ পড়েনও না। একটা কাজের ভাগ: প্রথম দিন নিরীক্ষকের মতামত আর তিনটা মূল হিসাব, চল্লিশ মিনিট। দ্বিতীয় দিন গুরুত্বপূর্ণ নোটগুলো, চল্লিশ মিনিট। তৃতীয় দিন ব্যবস্থাপনার আলোচনা আর গত বছরের সঙ্গে মেলানো, ত্রিশ মিনিট।</p>

<p>দুই ঘণ্টায় আপনি একটা কোম্পানি সম্পর্কে বেশিরভাগ বিনিয়োগকারীর চেয়ে বেশি জানবেন। এটা অতিরঞ্জন নয়: বেশিরভাগ মানুষ একটা বার্ষিক প্রতিবেদনও খোলেন না।</p>

${mount("ar-quiz")}
`,
  en: `
<p>An annual report is a company's fullest account of itself. It can run to two hundred pages, most of them photographs and legal language, and inside there are thirty pages that genuinely matter.</p>

<p>This lesson teaches you to find those thirty pages, and shows the order to read them in so you understand the most in the least time.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>The report is on the company's site and linked from its DSE page.</li>
<li>Reading order: the auditor's opinion, then the accounts, then management's discussion.</li>
<li>A qualification in the auditor's opinion is the single biggest piece of information.</li>
<li>The notes hold the actual detail, and they are the least read part.</li>
<li>Three consecutive years teach you far more than one.</li>
</ul>
</div>

<h2>Where to find it</h2>

<p>Two places. A company's own website usually has an investor relations page with several years of reports. And the <a class="term" href="/money/basics-3/dse-website.html">DSE</a> company page links to them.</p>

<p>One piece of advice that pays off later: download the last three years at once. Three side by side show you things one cannot, because a trend says more than a number.</p>

<h2>The order to read in</h2>

${mount("ar-steps")}

<p>The order can feel backwards, because a report opens with the chairman's message and photographs and ends with the accounts and notes. Reading from the back is deliberate: you want to see the numbers before you read the explanations that will colour how you see them.</p>

<h2>The auditor's opinion, the shortest and most important part</h2>

<p>It is one or two pages and it should be read first. An independent auditor stating whether the accounts give a true and fair view of the company's position.</p>

<p>In most cases the opinion is unqualified, and then reading it takes ten seconds. But if there is a qualification, or an emphasis of matter, or a doubt expressed about the company continuing as a going concern, then that is the most important sentence in the whole report.</p>

<div class="note">
<p>The wording is dull and that is its strength. "Except for the matter described above" or "material uncertainty related to going concern" should stop you and make you read the whole paragraph. Sentences like these are never accidental.</p>
</div>

<h2>The notes are the real report</h2>

<p>The primary statements are short: a few lines, a few numbers. Beside each line is a note reference, and the note holds the detail.</p>

<p>An example. The balance sheet says "trade receivables: 420 million". The note says how much of that is more than six months old, and how much of it is owed by a single customer. Those two facts can change the meaning of the number completely.</p>

${mount("ar-spot")}

<h2>Management's discussion</h2>

<p>Here management explains the year. It should be read, with one specific question in mind: <strong>how is the bad news told?</strong></p>

<p>Good management states the reasons for a bad year clearly, with numbers, and says what is being done. Weak management points only at external causes: a weak market, the dollar, a policy change. External causes can be perfectly true, and the question remains: how did the competitors do in the same conditions?</p>

<p>Comparing last year's report against this one is a powerful test. Management that does what it says deserves more weight when it says something about next year.</p>

${mount("ar-order")}

<h2>A realistic schedule</h2>

<p>Nobody reads a whole annual report in one sitting and you do not have to. A workable split: day one, the auditor's opinion and the three primary statements, forty minutes. Day two, the important notes, forty minutes. Day three, management's discussion and a comparison with last year, thirty minutes.</p>

<p>In two hours you will know more about that company than most investors do. That is not an exaggeration: most people never open an annual report at all.</p>

${mount("ar-quiz")}
`,
  blocks: {
    "ar-steps": {
      kind: "figure",
      shape: "steps",
      title: { bn: "কোন ক্রমে পড়বেন", en: "The order to read in" },
      note: { bn: "প্রতিবেদনের ক্রম নয়, পড়ার ক্রম। দুইটা আলাদা।", en: "Not the report's order but the reading order. They are different." },
      parts: [
        { text: { bn: "নিরীক্ষকের মতামত", en: "The auditor's opinion" }, note: { bn: "এক পৃষ্ঠা। শর্ত আছে কি না, এটাই প্রথম প্রশ্ন।", en: "One page. Is it qualified: that is the first question." }, tone: "lead" },
        { text: { bn: "তিনটা মূল হিসাব", en: "The three primary statements" }, note: { bn: "আয়-ব্যয়, স্থিতিপত্র, নগদ প্রবাহ। সংখ্যাগুলো আগে দেখুন।", en: "Income, balance sheet, cash flow. See the numbers first." } },
        { text: { bn: "গুরুত্বপূর্ণ নোটগুলো", en: "The important notes" }, note: { bn: "প্রাপ্য, মজুদ, ঋণ, সম্পর্কিত পক্ষের লেনদেন।", en: "Receivables, inventory, borrowings, related party transactions." }, tone: "good" },
        { text: { bn: "ব্যবস্থাপনার আলোচনা", en: "Management's discussion" }, note: { bn: "খারাপ খবরগুলো কীভাবে বলা হয়েছে, সেটাই দেখার জিনিস।", en: "How the bad news is told is what you are reading for." } },
        { text: { bn: "গত বছরের প্রতিবেদন", en: "Last year's report" }, note: { bn: "গত বছর যা বলা হয়েছিল, এ বছর তা হয়েছে কি না।", en: "Whether what was promised last year happened this year." }, tone: "warn" },
      ],
      caption: {
        bn: "প্রথম দুইটা ধাপে বেশিরভাগ সিদ্ধান্ত হয়ে যায়। বাকি তিনটা সেই সিদ্ধান্তকে যাচাই করে।",
        en: "The first two steps settle most decisions. The last three test them.",
      },
    },
    "ar-spot": {
      kind: "spot",
      title: { bn: "নোটে কোন বাক্যগুলো থামায়", en: "Which lines in the notes should stop you" },
      note: { bn: "একটা কাল্পনিক প্রতিবেদনের নোট থেকে ছয়টা বাক্য। যেগুলো প্রশ্ন তোলে সেগুলোতে চাপুন।", en: "Six lines from the notes of an imaginary report. Press the ones that raise a question." },
      source: { bn: "একটা কাল্পনিক কোম্পানির বার্ষিক প্রতিবেদনের নোট", en: "Notes from an imaginary company's annual report" },
      lines: [
        {
          text: { bn: "প্রাপ্য হিসাবের ৫৮% এক বছরের বেশি পুরনো।", en: "58% of trade receivables are more than one year old." },
          flag: { bn: "খুব পুরনো প্রাপ্য মানে টাকাটা হয়তো কখনো আসবে না, অথচ সেটা আয় হিসেবে গোনা হয়ে গেছে। এই একটা লাইন মুনাফার সংখ্যাটাকেই সন্দেহে ফেলে দেয়।", en: "Very old receivables may never be collected, and yet they were counted as revenue. This one line puts the profit figure itself in doubt." },
        },
        {
          text: { bn: "বছরে অবচয় ধরা হয়েছে সরলরৈখিক পদ্ধতিতে।", en: "Depreciation is charged on a straight line basis." },
        },
        {
          text: { bn: "মোট বিক্রির ৭১% একজন ক্রেতার কাছে।", en: "71% of sales are to a single customer." },
          flag: { bn: "একটা ক্রেতা হারালে ব্যবসার তিন চতুর্থাংশ চলে যায়। এটা নিজে অবৈধ বা অস্বাভাবিক নয়, কিন্তু এটা একটা বড় ঝুঁকি যা দামের হিসাবে থাকা উচিত।", en: "Losing one customer removes three quarters of the business. Neither illegal nor unusual on its own, but a large risk that ought to be in the price." },
        },
        {
          text: { bn: "কোম্পানি পরিচালকদের সঙ্গে সম্পর্কিত একটি প্রতিষ্ঠানকে ৯০ কোটি টাকা অগ্রিম দিয়েছে।", en: "The company advanced 900 million to an entity related to its directors." },
          flag: { bn: "সম্পর্কিত পক্ষের লেনদেন সবচেয়ে সাবধানে পড়ার নোট। টাকাটা কোম্পানি থেকে বেরিয়ে গেছে, শর্ত কী, ফেরত কবে, আর সুদ আছে কি না, সব প্রশ্ন এখানে।", en: "Related party transactions are the notes to read most carefully. Money has left the company; on what terms, repayable when, at what interest are all live questions." },
        },
        {
          text: { bn: "মজুদ পণ্যের মূল্যায়ন ক্রয়মূল্য বা নিট বিক্রয়মূল্যের মধ্যে যেটা কম সেই ভিত্তিতে।", en: "Inventory is valued at the lower of cost and net realisable value." },
        },
        {
          text: { bn: "স্বল্পমেয়াদি ঋণ এক বছরে ২১০ কোটি থেকে ৪৯০ কোটিতে উঠেছে।", en: "Short-term borrowings rose from 2.1 billion to 4.9 billion in one year." },
          flag: { bn: "স্বল্পমেয়াদি ঋণের দ্বিগুণেরও বেশি বাড়া মানে কোম্পানির নগদের টান পড়েছে। নগদ প্রবাহের বিবরণীর সঙ্গে মিলিয়ে দেখলে সাধারণত কারণটা পাওয়া যায়।", en: "More than doubling short-term borrowings means cash is tight. Reading it against the cash flow statement usually reveals why." },
        },
      ],
    },
    "ar-order": {
      kind: "order",
      title: { bn: "একটা প্রতিবেদন পড়ার ক্রম সাজান", en: "Put the reading of a report in order" },
      note: { bn: "সবচেয়ে বেশি তথ্য সবচেয়ে কম সময়ে, এই ক্রমে।", en: "Most information in least time, in this order." },
      items: [
        {
          text: { bn: "নিরীক্ষকের মতামতে শর্ত আছে কি না দেখুন", en: "Check whether the auditor's opinion is qualified" },
          why: { bn: "শর্ত থাকলে বাকি সব সংখ্যা কম বিশ্বাসযোগ্য, তাই এটাই প্রথমে।", en: "If it is, every other number is less trustworthy, so this comes first." },
        },
        {
          text: { bn: "নগদ প্রবাহের বিবরণীতে পরিচালন নগদ প্রবাহ দেখুন", en: "Look at operating cash flow in the cash flow statement" },
          why: { bn: "মুনাফা সাজানো যায়, নগদ কঠিন। তাই সংখ্যাগুলোর মধ্যে এটা আগে।", en: "Profit can be dressed up; cash is harder. So among the numbers this comes first." },
        },
        {
          text: { bn: "আয়-ব্যয়ের হিসাবে আয় আর মুনাফার হার দেখুন", en: "Look at revenue and margin in the income statement" },
        },
        {
          text: { bn: "স্থিতিপত্রে ঋণ আর প্রাপ্য দেখুন", en: "Look at borrowings and receivables in the balance sheet" },
        },
        {
          text: { bn: "সংশ্লিষ্ট নোটগুলো খুলে বিবরণ পড়ুন", en: "Open the relevant notes and read the detail" },
          why: { bn: "প্রতিটা সন্দেহজনক সংখ্যার ব্যাখ্যা নোটে আছে।", en: "The explanation of every doubtful number is in the notes." },
        },
        {
          text: { bn: "ব্যবস্থাপনার আলোচনা পড়ুন, খারাপ খবরের ভাষার দিকে নজর রেখে", en: "Read management's discussion, watching how bad news is worded" },
        },
        {
          text: { bn: "গত বছরের প্রতিবেদনের প্রতিশ্রুতিগুলোর সঙ্গে মেলান", en: "Compare against the promises in last year's report" },
          why: { bn: "এটাই ব্যবস্থাপনার বিশ্বাসযোগ্যতার সবচেয়ে সরাসরি পরীক্ষা।", en: "The most direct test there is of management's credibility." },
        },
      ],
    },
    "ar-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা বার্ষিক প্রতিবেদনের নিরীক্ষকের মতামতে লেখা আছে চলমান প্রতিষ্ঠান হিসেবে টিকে থাকা নিয়ে উল্লেখযোগ্য অনিশ্চয়তা রয়েছে। এটা কী বলে?",
            en: "An auditor's opinion states a material uncertainty related to going concern. What does that say?",
          },
          options: [
            {
              text: { bn: "নিরীক্ষক সন্দেহ প্রকাশ করছেন যে কোম্পানিটা আগামী বছর টিকবে কি না", en: "The auditor is expressing doubt about whether the company survives the coming year" },
              right: true,
              why: {
                bn: "ঠিক, আর এটা নিরীক্ষকের ভাষায় সবচেয়ে কড়া কথাগুলোর একটা। এই বাক্যটা থাকা মানে বাকি সব হিসাব এই ধারণায় তৈরি যে কোম্পানিটা চলতে থাকবে, আর সেই ধারণাটাই প্রশ্নবিদ্ধ। সম্পদের মূল্যায়নসহ প্রায় সবকিছু বদলে যেতে পারে।",
                en: "Right, and in an auditor's vocabulary it is among the strongest things said. Its presence means every other figure was prepared on the assumption that the company continues, and that assumption is in question. Almost everything, asset valuations included, could change.",
              },
            },
            {
              text: { bn: "এটা একটা রুটিন আইনি বাক্য, প্রায় সব প্রতিবেদনে থাকে", en: "It is a routine legal sentence found in most reports" },
              why: {
                bn: "একেবারেই নয়। বেশিরভাগ প্রতিবেদনে নিরীক্ষকের মতামত শর্তহীন আর এই বাক্যটা থাকে না। এটা যখন থাকে তখন এটা ইচ্ছাকৃত আর নির্দিষ্ট।",
                en: "Not at all. In most reports the opinion is unqualified and this sentence is absent. When it appears it is deliberate and specific.",
              },
            },
            {
              text: { bn: "কোম্পানির মুনাফা কমেছে, তার বেশি কিছু নয়", en: "The company's profit fell, and nothing more" },
              why: {
                bn: "মুনাফা কমা আর টিকে থাকা নিয়ে সন্দেহ, দুইটা সম্পূর্ণ আলাদা। বহু কোম্পানির মুনাফা কমে আর নিরীক্ষক কিছুই বলেন না। এই বাক্যটা আসে যখন নগদ, ঋণ বা দায় এমন জায়গায় পৌঁছায় যেখানে চলা কঠিন।",
                en: "A fall in profit and doubt about survival are entirely different. Plenty of companies report lower profit and the auditor says nothing. This sentence appears when cash, debt or liabilities reach a point where continuing is difficult.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "ব্যবস্থাপনার আলোচনায় খারাপ বছরের কারণ হিসেবে কেবল ডলারের দাম আর সরকারি নীতির কথা বলা হয়েছে। পরের কাজ কী?",
            en: "Management's discussion blames a bad year entirely on the dollar and government policy. What next?",
          },
          options: [
            {
              text: { bn: "একই খাতের দুইটা প্রতিযোগীর ফলাফল দেখি", en: "Look at the results of two competitors in the same sector" },
              right: true,
              why: {
                bn: "ঠিক। বাইরের কারণগুলো সবার উপরেই পড়েছে, তাই প্রশ্নটা হলো একই ঝড়ে অন্যরা কেমন করেছে। প্রতিযোগীরা যদি ভালো করে থাকে, তাহলে কারণটা বাইরের নয়, ভেতরের। এই তুলনাটাই ব্যবস্থাপনার ব্যাখ্যা যাচাইয়ের একমাত্র সৎ উপায়।",
                en: "Right. External causes fell on everybody, so the question is how others did in the same storm. If competitors did well, the cause is internal rather than external. That comparison is the only honest way to test management's explanation.",
              },
            },
            {
              text: { bn: "মেনে নিই, কারণ কারণগুলো সত্যিই ছিল", en: "Accept it, because those things really did happen" },
              why: {
                bn: "কারণগুলো সত্যি হতে পারে আর তবু অসম্পূর্ণ। প্রশ্নটা কখনোই এই নয় যে ঝড় হয়েছে কি না, প্রশ্নটা হলো এই নৌকাটা অন্যদের চেয়ে বেশি দুলল কেন।",
                en: "The causes can be true and still incomplete. The question is never whether there was a storm, it is why this boat rocked more than the others.",
              },
            },
            {
              text: { bn: "বেচে দিই, কারণ ব্যবস্থাপনা দায় নিচ্ছে না", en: "Sell, because management is not taking responsibility" },
              why: {
                bn: "এটা একটা সংকেত, প্রমাণ নয়। বেচার সিদ্ধান্ত আসা উচিত যুক্তি ভেঙে গেছে কি না তার উপর, আর সেটা জানতে হলে আগে প্রতিযোগীদের সঙ্গে তুলনাটা করতে হবে।",
                en: "It is a signal, not proof. A selling decision should come from whether the argument has broken, and to know that you first have to make the comparison with competitors.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"official-sources": {
  bn: `
<p>একটা কোম্পানি সম্পর্কে জানতে হলে কোম্পানির কাগজ লাগে। কিন্তু একটা কোম্পানি একটা অর্থনীতির ভেতরে বসে, আর সেই অর্থনীতির সংখ্যাগুলোও বিনামূল্যে পাওয়া যায়, সরকারি সূত্রে। মূল্যস্ফীতি কত, রপ্তানি বাড়ছে না কমছে, রেমিট্যান্স কেমন, সুদের হার কোন দিকে যাচ্ছে: এই সবগুলোর আনুষ্ঠানিক উত্তর আছে।</p>

<p>এই লেখাটা দেখায় কোন সংখ্যাটা কোথায়, আর কেন সংবাদমাধ্যমের প্রতিবেদন পড়ার চেয়ে মূল প্রকাশনা দেখা ভালো, এমনকি যখন দুইটা একই কথা বলছে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বাংলাদেশ ব্যাংক: সুদের হার, রিজার্ভ, রেমিট্যান্স, মুদ্রানীতি।</li>
<li>বিবিএস: মূল্যস্ফীতি, জিডিপি, জনসংখ্যা আর শ্রমশক্তি।</li>
<li>ইপিবি: রপ্তানির মাসিক পরিসংখ্যান, খাতভিত্তিক।</li>
<li>এনবিআর: করের হার আর প্রজ্ঞাপন।</li>
<li>মূল প্রকাশনায় শর্ত আর পাদটীকা থাকে, প্রতিবেদনে থাকে না।</li>
</ul>
</div>

<h2>কোন সংখ্যা কোথায়</h2>

${mount("os-compare")}

<p>এই তালিকাটা মুখস্থ করার দরকার নেই। যা দরকার তা হলো অভ্যাসটা: একটা সংখ্যা যদি আপনার সিদ্ধান্তে ঢোকে, তাহলে সেটা কোথা থেকে এসেছে সেটা জানুন, আর সম্ভব হলে সেখান থেকেই নিন।</p>

<h2>কেন মূল প্রকাশনা</h2>

<p>একটা সংবাদ প্রতিবেদন একটা সংখ্যা তুলে ধরে আর প্রসঙ্গটা ফেলে দেয়, কারণ প্রসঙ্গ জায়গা নেয়। মূল প্রকাশনায় সেই প্রসঙ্গটা থাকে: সংখ্যাটা কোন সময়ের, কীভাবে মাপা হয়েছে, কোনটার সঙ্গে তুলনা করা হচ্ছে, আর কোনো সংশোধন হয়েছে কি না।</p>

<div class="ex">
<p><strong>একই সংখ্যা, দুই রকম অর্থ।</strong> শিরোনাম: রপ্তানি ৮% বেড়েছে। মূল পরিসংখ্যানে দেখা যায় তুলনাটা গত বছরের একই মাসের সঙ্গে, আর গত বছরের ওই মাসে একটা দীর্ঘ ছুটি পড়েছিল বলে ভিত্তিটা অস্বাভাবিক কম ছিল। ৮% বৃদ্ধিটা সত্যি, আর এটা যা মনে করায় সেটা সত্যি নয়।</p>
</div>

<h2>কোনটা কতটা নির্ভরযোগ্য</h2>

${mount("os-bins")}

<p>একটা কথা সততার সঙ্গে বলা দরকার: সরকারি পরিসংখ্যান নিখুঁত নয়, কোনো দেশেই নয়। পদ্ধতি বদলায়, নমুনা সীমিত হয়, আর কিছু সংখ্যা পরে সংশোধিত হয়। এটা এগুলো বাদ দেওয়ার কারণ নয়, কারণ বিকল্প হলো অনুমান। এটা কারণ যে একটা সংখ্যার উপর পুরো সিদ্ধান্ত না দাঁড় করানো ভালো।</p>

<p>একটা ব্যবহারিক নিয়ম: <strong>একটা সংখ্যার ধারা দেখুন, একটা সংখ্যা নয়।</strong> মূল্যস্ফীতি এই মাসে ৯.২% নাকি ৯.৫% সেটা প্রায় গুরুত্বহীন। গত বারো মাসে এটা ৬ থেকে ৯ এ উঠেছে নাকি ১১ থেকে ৯ এ নেমেছে, সেটাই আসল তথ্য।</p>

<h2>একটা সংখ্যা কীভাবে আপনার সিদ্ধান্তে ঢোকে</h2>

<p>উদাহরণ দিয়ে দেখা যাক। ধরুন আপনি একটা পোশাক রপ্তানিকারক কোম্পানি দেখছেন। ইপিবির মাসিক পরিসংখ্যান থেকে জানতে পারবেন পুরো খাতের রপ্তানি বাড়ছে না কমছে। এবার কোম্পানির প্রান্তিক ফলাফলে দেখুন তার নিজের বিক্রি কেমন।</p>

<p>দুইটা মিলিয়ে চারটা সম্ভাবনা। খাত বাড়ছে আর কোম্পানিও বাড়ছে: স্বাভাবিক। খাত বাড়ছে আর কোম্পানি বাড়ছে না: প্রশ্ন, কারণ কোম্পানিটা বাজার হারাচ্ছে। খাত কমছে আর কোম্পানি বাড়ছে: এটা আগ্রহোদ্দীপক, কারণ কোম্পানিটা প্রতিযোগীদের কাছ থেকে বাজার নিচ্ছে। খাত কমছে আর কোম্পানিও কমছে: বাইরের কারণ, আর তখন প্রশ্নটা হলো কতদিন।</p>

<p>এই চারটা ঘরের পার্থক্য একটা কোম্পানির প্রতিবেদন পড়ে বোঝা যায় না। খাতের সংখ্যাটা লাগে, আর সেটা সরকারি সূত্রে বিনামূল্যে আছে।</p>

${mount("os-drill")}

<h2>যা এই সূত্রগুলো দেয় না</h2>

<p>ভবিষ্যদ্বাণী দেয় না, আর সেটাই ভালো। সরকারি পরিসংখ্যান বলে কী ঘটেছে, কী ঘটবে তা নয়। যে প্রতিবেদন বলে আগামী বছর জিডিপি কত হবে, সেটা একটা প্রক্ষেপণ, আর প্রক্ষেপণ একটা ধারণার উপর দাঁড়ানো অনুমান।</p>

<p>আর একটা কথা: এই সংখ্যাগুলো আপনাকে কোন শেয়ার কিনতে হবে বলবে না। এরা প্রেক্ষাপট দেয়, আর প্রেক্ষাপট একটা কোম্পানির সংখ্যার অর্থ বদলে দিতে পারে। এই দুইটার পার্থক্য মনে রাখা দরকার, নাহলে সামষ্টিক অর্থনীতির খবর পড়া একটা সময়ের অপচয় হয়ে দাঁড়ায়।</p>

${mount("os-quiz")}
`,
  en: `
<p>To understand a company you need the company's documents. But a company sits inside an economy, and that economy's numbers are also free, from official sources. What inflation is, whether exports are rising, how remittances are doing, which way rates are going: all of these have official answers.</p>

<p>This lesson shows which number lives where, and why reading the original publication beats reading a press report about it, even when the two say the same thing.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Bangladesh Bank: rates, reserves, remittances, monetary policy.</li>
<li>BBS: inflation, GDP, population and the labour force.</li>
<li>EPB: monthly export statistics, by sector.</li>
<li>NBR: tax rates and notifications.</li>
<li>The original carries the conditions and footnotes; a report does not.</li>
</ul>
</div>

<h2>Which number lives where</h2>

${mount("os-compare")}

<p>You do not have to memorise that table. What matters is the habit: if a number is entering your decision, know where it came from, and take it from there where you can.</p>

<h2>Why the original</h2>

<p>A news report lifts a number and drops the context, because context takes space. The original carries that context: which period the number covers, how it was measured, what it is being compared against, and whether anything was revised.</p>

<div class="ex">
<p><strong>The same number, two meanings.</strong> Headline: exports up 8%. The original statistics show the comparison is against the same month last year, and that month contained a long holiday, so the base was unusually low. The 8% is true, and what it suggests is not.</p>
</div>

<h2>How much to trust each</h2>

${mount("os-bins")}

<p>One thing should be said honestly: official statistics are not perfect, in any country. Methods change, samples are limited, and some figures are revised later. That is not a reason to discard them, because the alternative is guessing. It is a reason not to rest an entire decision on one number.</p>

<p>A practical rule: <strong>read the trend, not the number.</strong> Whether inflation is 9.2% or 9.5% this month is nearly irrelevant. Whether it went from 6 to 9 over twelve months or from 11 down to 9 is the actual information.</p>

<h2>How a number enters your decision</h2>

<p>Take an example. Suppose you are looking at a garment exporter. The EPB's monthly statistics tell you whether the sector's exports are rising or falling. Now look at the company's quarterly results for its own sales.</p>

<p>Combining the two gives four cases. Sector up and company up: ordinary. Sector up and company flat: a question, because it is losing share. Sector down and company up: interesting, because it is taking share from competitors. Sector down and company down: an external cause, and the question becomes how long.</p>

<p>You cannot tell those four apart from one company's report. You need the sector number, and it is free from an official source.</p>

${mount("os-drill")}

<h2>What these sources do not give</h2>

<p>They do not give predictions, and that is a virtue. Official statistics say what happened, not what will happen. A report saying what GDP will be next year is a projection, and a projection is a guess resting on assumptions.</p>

<p>And one more thing: these numbers will not tell you which share to buy. They give context, and context can change the meaning of a company's numbers. Keeping the difference in mind matters, or reading macroeconomic news becomes a way of spending time.</p>

${mount("os-quiz")}
`,
  blocks: {
    "os-compare": {
      kind: "compare",
      title: { bn: "সূত্র আর যা সেখানে আছে", en: "Source and what is in it" },
      note: { bn: "চারটা প্রতিষ্ঠান, আর একজন বিনিয়োগকারীর দরকারি প্রায় সব সংখ্যা।", en: "Four institutions, and nearly every number an investor needs." },
      columns: [
        { bn: "কী পাবেন", en: "What you find" },
        { bn: "কখন কাজে লাগে", en: "When it matters" },
      ],
      rows: [
        {
          label: { bn: "বাংলাদেশ ব্যাংক", en: "Bangladesh Bank" },
          cells: [
            { bn: "নীতি সুদের হার, রিজার্ভ, রেমিট্যান্স, ঋণ প্রবৃদ্ধি, মুদ্রানীতি বিবৃতি", en: "The policy rate, reserves, remittances, credit growth, the monetary policy statement" },
            { bn: "ঋণনির্ভর কোম্পানি আর ব্যাংক খাতের সিদ্ধান্তে", en: "For decisions about indebted companies and the banking sector" },
          ],
        },
        {
          label: { bn: "বাংলাদেশ পরিসংখ্যান ব্যুরো", en: "Bangladesh Bureau of Statistics" },
          cells: [
            { bn: "মূল্যস্ফীতি, জিডিপি, শ্রমশক্তি, জনসংখ্যা", en: "Inflation, GDP, the labour force, population" },
            { bn: "প্রকৃত রিটার্ন হিসাব করতে, আর ভোগ্যপণ্যের চাহিদা বুঝতে", en: "To work out real returns, and to understand consumer demand" },
          ],
        },
        {
          label: { bn: "রপ্তানি উন্নয়ন ব্যুরো", en: "Export Promotion Bureau" },
          cells: [
            { bn: "মাসিক রপ্তানি, খাত অনুযায়ী আর গন্তব্য অনুযায়ী", en: "Monthly exports, by sector and by destination" },
            { bn: "পোশাক, চামড়া, পাট আর ওষুধ রপ্তানিকারকদের জন্য", en: "For garment, leather, jute and pharmaceutical exporters" },
          ],
        },
        {
          label: { bn: "জাতীয় রাজস্ব বোর্ড", en: "National Board of Revenue" },
          cells: [
            { bn: "করের হার, প্রজ্ঞাপন, ছাড়ের নিয়ম", en: "Tax rates, notifications, exemption rules" },
            { bn: "লভ্যাংশ আর মুনাফার উপর প্রকৃত কর জানতে", en: "To know the actual tax on dividends and gains" },
          ],
        },
        {
          label: { bn: "বিএসইসি আর ডিএসই", en: "BSEC and the DSE" },
          cells: [
            { bn: "বাজারের নিয়ম, নির্দেশনা, কোম্পানির ফাইলিং", en: "Market rules, directives, company filings" },
            { bn: "প্রতিটা কোম্পানিভিত্তিক সিদ্ধান্তে", en: "In every company-level decision" },
          ],
        },
      ],
    },
    "os-bins": {
      kind: "bins",
      title: { bn: "কোনটা কী ধরনের সংখ্যা", en: "What kind of number is this" },
      note: { bn: "যা ঘটেছে তার হিসাব, আর যা ঘটবে তার অনুমান। দুইটা আলাদা বাক্সে।", en: "A record of what happened, and a guess about what will. Two different boxes." },
      bins: [
        { id: "record", label: { bn: "যা ঘটেছে", en: "What happened" }, tone: "good" },
        { id: "guess", label: { bn: "যা ঘটতে পারে", en: "What might happen" }, tone: "warn" },
      ],
      items: [
        {
          text: { bn: "গত মাসের রপ্তানির পরিমাণ", en: "Last month's export figure" },
          bin: "record",
          why: { bn: "মাপা সংখ্যা। পরে সামান্য সংশোধিত হতে পারে, কিন্তু এটা একটা হিসাব।", en: "A measured figure. It can be revised slightly, but it is a record." },
        },
        {
          text: { bn: "আগামী অর্থবছরের প্রবৃদ্ধির লক্ষ্যমাত্রা", en: "The growth target for the coming fiscal year" },
          bin: "guess",
          why: { bn: "লক্ষ্যমাত্রা একটা ইচ্ছা আর একটা পরিকল্পনা, একটা পরিমাপ নয়।", en: "A target is an intention and a plan, not a measurement." },
        },
        {
          text: { bn: "চলতি মাসের ভোক্তা মূল্যসূচক", en: "This month's consumer price index" },
          bin: "record",
          why: { bn: "একটা নমুনার উপর ভিত্তি করে মাপা, তাই নিখুঁত নয়, তবু একটা পরিমাপ।", en: "Measured from a sample, so not perfect, and still a measurement." },
        },
        {
          text: { bn: "একটা ব্রোকারেজ হাউসের সূচকের লক্ষ্য", en: "A brokerage house's index target" },
          bin: "guess",
          why: { bn: "এটা এমনকি সরকারি সূত্রও নয়, আর এর পেছনে একটা স্বার্থ থাকতে পারে।", en: "Not even an official source, and there may be an interest behind it." },
        },
        {
          text: { bn: "গত সপ্তাহের বৈদেশিক মুদ্রার রিজার্ভ", en: "Last week's foreign exchange reserves" },
          bin: "record",
          why: { bn: "কেন্দ্রীয় ব্যাংকের নিজের হিসাব, আর নিয়মিত প্রকাশিত।", en: "The central bank's own figure, published regularly." },
        },
        {
          text: { bn: "একটা প্রক্ষেপণ যে মূল্যস্ফীতি ছয় মাসে ৭% এ নামবে", en: "A projection that inflation falls to 7% in six months" },
          bin: "guess",
          why: { bn: "প্রক্ষেপণ একটা মডেলের ফল, আর মডেলটা ধারণার উপর দাঁড়ানো। ধারণা বদলালে সংখ্যাটাও বদলায়।", en: "A projection is the output of a model resting on assumptions. Change the assumptions and the number changes." },
        },
      ],
    },
    "os-drill": {
      kind: "drill",
      title: { bn: "একটা খাত আর একটা কোম্পানি মিলিয়ে দেখুন", en: "Line up one sector against one company" },
      note: { bn: "একটা রপ্তানিমুখী কোম্পানি নিন। বিশ মিনিট।", en: "Take an export-facing company. Twenty minutes." },
      steps: [
        {
          text: { bn: "একটা রপ্তানিমুখী তালিকাভুক্ত কোম্পানি বাছুন।", en: "Pick a listed company that exports." },
          hint: { bn: "পোশাক, চামড়া, ওষুধ বা পাটের যেকোনো একটা।", en: "Garments, leather, pharmaceuticals or jute will all do." },
        },
        {
          text: { bn: "ইপিবির সাইট থেকে ওই খাতের গত ছয় মাসের রপ্তানি লিখে ফেলুন।", en: "From the EPB site, write down six months of that sector's exports." },
        },
        {
          text: { bn: "কোম্পানির শেষ দুইটা প্রান্তিক ফলাফল থেকে তার নিজের আয় লিখুন।", en: "From the company's last two quarterly results, write down its own revenue." },
        },
        {
          text: { bn: "দুইটার দিক মিলিয়ে দেখুন: দুইটাই বাড়ছে, নাকি আলাদা দিকে যাচ্ছে?", en: "Compare the directions: are both rising, or are they diverging?" },
          hint: { bn: "আলাদা দিকে গেলে সেটাই সবচেয়ে আগ্রহোদ্দীপক ঘটনা, দুই দিকেই।", en: "Divergence is the most interesting case, in either direction." },
        },
        {
          text: { bn: "বিবিএসের সাইট থেকে সর্বশেষ মূল্যস্ফীতির হার লিখে রাখুন।", en: "From the BBS site, note the latest inflation rate." },
        },
        {
          text: { bn: "এক বাক্যে লিখুন খাতের অবস্থা কোম্পানিটার সম্পর্কে কী বলছে।", en: "Write one sentence on what the sector's condition says about the company." },
        },
      ],
    },
    "os-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা পোশাক কোম্পানির আয় গত দুই প্রান্তিকে ৬% কমেছে। ইপিবির তথ্যে দেখা যাচ্ছে পুরো পোশাক খাতের রপ্তানি একই সময়ে ১৪% কমেছে। এটা কী বলে?",
            en: "A garment company's revenue fell 6% over two quarters. EPB data shows the whole garment sector's exports fell 14% in the same period. What does that say?",
          },
          options: [
            {
              text: { bn: "কোম্পানিটা খাতের চেয়ে ভালো করছে, অর্থাৎ বাজার নিচ্ছে", en: "The company is doing better than its sector, so it is taking share" },
              right: true,
              why: {
                bn: "ঠিক, আর এটা একটা শক্তিশালী সংকেত। খারাপ সময়ে যে কোম্পানি প্রতিযোগীদের চেয়ে কম হারায়, সে সাধারণত ভালো সময়ে বেশি পায়, কারণ সংকট দুর্বল প্রতিযোগীদের বাজার ছেড়ে দিতে বাধ্য করে। কেবল কোম্পানির প্রতিবেদন পড়ে এই সংকেতটা পাওয়া যেত না।",
                en: "Right, and it is a strong signal. A company that loses less than its competitors in a downturn usually gains more in the recovery, because a downturn forces weaker rivals to give up ground. You could not have seen this from the company's report alone.",
              },
            },
            {
              text: { bn: "কোম্পানিটা খারাপ করছে, কারণ আয় কমেছে", en: "The company is doing badly, because revenue fell" },
              why: {
                bn: "৬% কমা একটা খারাপ সংখ্যা যদি খাত স্থির থাকত। খাত ১৪% কমেছে, তাই আপেক্ষিকভাবে এটা ভালো ফলাফল। প্রেক্ষাপট ছাড়া একটা সংখ্যা পড়া মানে অর্ধেকটা পড়া।",
                en: "A 6% fall would be a bad number if the sector had been flat. The sector fell 14%, so relatively this is a good result. Reading a number without context is reading half of it.",
              },
            },
            {
              text: { bn: "দুইটা সংখ্যার কোনো সম্পর্ক নেই", en: "The two numbers are unrelated" },
              why: {
                bn: "সরাসরি সম্পর্ক আছে: কোম্পানিটা ওই খাতেরই অংশ, আর ওই একই বাইরের পরিস্থিতির মুখোমুখি। খাতের সংখ্যাটাই সেই মানদণ্ড যার বিপরীতে কোম্পানির সংখ্যাটা পড়তে হয়।",
                en: "They are directly related: the company is part of that sector and faced the same external conditions. The sector number is the benchmark against which the company's number should be read.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা শিরোনামে লেখা: রেমিট্যান্স গত মাসে রেকর্ড ছুঁয়েছে। মূল প্রকাশনায় কী খুঁজবেন?",
            en: "A headline says remittances hit a record last month. What do you look for in the original?",
          },
          options: [
            {
              text: { bn: "তুলনাটা কীসের সঙ্গে, আর ওই মাসে কোনো বিশেষ কারণ ছিল কি না", en: "What it is compared with, and whether anything unusual happened that month" },
              right: true,
              why: {
                bn: "ঠিক। রেমিট্যান্স ঈদের আগে বাড়ে, ছুটির মাসে কমে, আর বিনিময় হারের ব্যবধান বদলালে আনুষ্ঠানিক চ্যানেলে বেশি বা কম আসে। রেকর্ড শব্দটা তথ্য নয়, প্রেক্ষাপটটাই তথ্য।",
                en: "Right. Remittances rise before Eid, fall in holiday months, and shift between official and informal channels when the exchange rate gap changes. The word record is not information; the context is.",
              },
            },
            {
              text: { bn: "সংখ্যাটা কত, শুধু সেটাই", en: "Just what the number is" },
              why: {
                bn: "সংখ্যাটা শিরোনামেই ছিল। মূল প্রকাশনায় যাওয়ার একমাত্র কারণ হলো সংখ্যাটার চারপাশের তথ্য, যা শিরোনামে ধরে না।",
                en: "The number was already in the headline. The only reason to open the original is what surrounds it, which a headline cannot carry.",
              },
            },
            {
              text: { bn: "কোন শেয়ার এতে বাড়বে", en: "Which share this will lift" },
              why: {
                bn: "মূল প্রকাশনা এই প্রশ্নের উত্তর দেয় না, আর দেওয়ার কথাও নয়। এটা প্রেক্ষাপট দেয়, আর প্রেক্ষাপটকে সিদ্ধান্তে রূপান্তর করাটা আপনার কাজ, আর সেটা কোম্পানির সংখ্যার সঙ্গে মিলিয়েই করতে হয়।",
                en: "The original does not answer that and is not meant to. It provides context, and turning context into a decision is your job, done by pairing it with a company's own numbers.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"keeping-records": {
  bn: `
<p>বিনিয়োগের সবচেয়ে কম আকর্ষণীয় অভ্যাসটা হলো খাতা রাখা, আর এটাই সবচেয়ে দ্রুত আপনাকে ভালো করে তোলে। কারণটা সরল: <strong>যা লেখা নেই তা থেকে শেখা যায় না।</strong></p>

<p>মানুষের স্মৃতি নিজের পক্ষে কাজ করে। যে সিদ্ধান্তগুলো কাজ করেছে সেগুলো মনে থাকে, যেগুলো করেনি সেগুলো ঝাপসা হয়ে যায়, আর ছয় মাস পরে আপনার মনে হয় আপনি সবসময় জানতেন। একটা খাতা এই সুবিধাজনক ভুলে যাওয়াটা বন্ধ করে দেয়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>প্রতিটা সিদ্ধান্তের কারণ লিখুন, সিদ্ধান্তের দিনে।</li>
<li>যা লিখবেন: তারিখ, কী করলেন, কেন, আর কী হলে ভুল প্রমাণ হবে।</li>
<li>প্রতিটা কনট্রাক্ট নোট আর বিবরণী সংরক্ষণ করুন।</li>
<li>বছরে একবার পুরনো লেখাগুলো পড়ুন, আর এটাই আসল শিক্ষা।</li>
<li>একটা স্প্রেডশিট আর একটা নোট, এর বেশি কিছু লাগে না।</li>
</ul>
</div>

<h2>খাতায় কী কী থাকবে</h2>

${mount("kr-screen")}

<p>খেয়াল করুন সবচেয়ে গুরুত্বপূর্ণ ঘরটা দাম নিয়ে নয়। "কী হলে বুঝব যে আমি ভুল ছিলাম" এই ঘরটাই খাতার আসল মূল্য, কারণ এটা একটা যাচাইযোগ্য দাবি তৈরি করে।</p>

<div class="ex">
<p><strong>দুইটা এন্ট্রি, একই দিনের।</strong> প্রথমটা: "আজ ২০০টা শেয়ার কিনলাম ৫২ টাকায়।" দ্বিতীয়টা: "আজ ২০০টা শেয়ার কিনলাম ৫২ টাকায়। কারণ: ঋণ কম, তিন বছর ধরে নগদ প্রবাহ ইতিবাচক, আর পিই ১১ যেখানে খাতের গড় ১৫। ভুল প্রমাণ হবে যদি: পরপর দুই প্রান্তিকে নগদ প্রবাহ ঋণাত্মক হয়, বা ঋণ ইকুইটির সমান হয়ে যায়। সর্বোচ্চ ২৫,০০০ টাকা এই শেয়ারে।" এক বছর পরে প্রথমটা থেকে কিছুই শেখা যায় না।</p>
</div>

<h2>কেন কারণটা লিখতেই হবে</h2>

<p>একটা সিদ্ধান্ত দুইভাবে ঠিক হতে পারে: সঠিক কারণে, বা ভুল কারণে সৌভাগ্যক্রমে। বাইরে থেকে দুইটা একই রকম দেখায়, কারণ দুইটাতেই টাকা এসেছে। কেবল লেখা কারণটাই দুইটাকে আলাদা করতে পারে।</p>

<p>এটা গুরুত্বপূর্ণ কারণ ভুল কারণে পাওয়া সাফল্য পরের বার আপনাকে বিভ্রান্ত করবে। আপনি একই ভুল কারণে আবার সিদ্ধান্ত নেবেন, আর এবার সৌভাগ্য নাও থাকতে পারে।</p>

${mount("kr-order")}

<h2>কনট্রাক্ট নোট আর বিবরণী</h2>

<p>এটা আলাদা ধরনের রেকর্ড, আর এর উদ্দেশ্যও আলাদা: প্রমাণ। প্রতিটা লেনদেনের কনট্রাক্ট নোট, প্রতি মাসের বা প্রতি প্রান্তিকের হিসাব বিবরণী, আর লভ্যাংশের কাগজ।</p>

<p>তিনটা কারণে দরকার। প্রথমত, কোনো ভুল হলে অভিযোগের সময় এটাই আপনার একমাত্র প্রমাণ। দ্বিতীয়ত, করের হিসাবের সময় লাগে। তৃতীয়ত, আপনার আসল খরচ কত হয়েছে সেটা এই কাগজগুলোই বলে, স্মৃতি নয়।</p>

<div class="note">
<p>একটা সহজ ব্যবস্থা: বছর অনুযায়ী একটা ফোল্ডার, আর তার ভেতরে প্রতিটা কাগজের ফাইলের নাম তারিখ দিয়ে শুরু। ক্লাউডে রাখুন যাতে ফোন হারালেও থাকে। এটা পাঁচ মিনিটের ব্যবস্থা যা দশ বছর কাজ করবে।</p>
</div>

<h2>বছরে একবার পুরনো লেখা পড়া</h2>

<p>এটাই পুরো অভ্যাসটার আসল উদ্দেশ্য, আর এটাই সবচেয়ে বেশি এড়িয়ে যাওয়া হয়। বছরে একবার, একটা শান্ত সন্ধ্যায়, গত বছরের এন্ট্রিগুলো পড়ুন।</p>

<p>যা খুঁজবেন: কোন কারণগুলো সত্যি হয়েছিল, কোনগুলো হয়নি। আপনি কি বেশি আত্মবিশ্বাসী ছিলেন? কোন ধরনের সিদ্ধান্তে আপনি বারবার ভুল করেন? বেচার সময় কি আপনি নিজের লেখা শর্তগুলো মেনেছেন, নাকি অন্য কারণে বেচেছেন?</p>

<p>শেষ প্রশ্নটার উত্তর প্রায়ই অস্বস্তিকর, আর সেটাই এর মূল্য। বেশিরভাগ মানুষ দেখেন যে তারা লিখেছিলেন একরকম আর করেছেন আরেকরকম, আর এই ব্যবধানটাই তাদের ফলাফলের সবচেয়ে বড় ব্যাখ্যা।</p>

${mount("kr-drill")}

<h2>যন্ত্রটা গুরুত্বপূর্ণ নয়</h2>

<p>একটা স্প্রেডশিট, একটা নোটস অ্যাপ, বা একটা কাগজের খাতা, তিনটাই সমান কাজ করে। যা গুরুত্বপূর্ণ তা হলো এটা এক জায়গায় থাকা আর সিদ্ধান্তের দিনে লেখা।</p>

<p>একটা কথা যা অভিজ্ঞতা থেকে আসে: পরে লিখব ভাবলে লেখা হয় না, আর যদি হয়ও তাহলে সেটা আর সেই দিনের চিন্তা থাকে না, সেটা হয়ে যায় ফলাফল জেনে লেখা একটা ব্যাখ্যা। খাতাটার পুরো মূল্য এটাই যে এটা ফলাফল জানার আগে লেখা।</p>

${mount("kr-quiz")}
`,
  en: `
<p>The least glamorous habit in investing is keeping records, and it is the one that improves you fastest. The reason is simple: <strong>you cannot learn from what was never written down.</strong></p>

<p>Human memory works in its own favour. The decisions that worked are remembered, the ones that did not go blurry, and six months later it feels as though you always knew. A notebook stops that convenient forgetting.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Write the reason for every decision, on the day you take it.</li>
<li>What to write: the date, what you did, why, and what would prove you wrong.</li>
<li>Keep every contract note and statement.</li>
<li>Read the old entries once a year; that is where the learning is.</li>
<li>A spreadsheet and a note are all the equipment required.</li>
</ul>
</div>

<h2>What goes in the record</h2>

${mount("kr-screen")}

<p>Notice that the most important field is not about price. "What would tell me I was wrong" is where the record's value sits, because it creates a testable claim.</p>

<div class="ex">
<p><strong>Two entries from the same day.</strong> The first: "Bought 200 shares at 52 today." The second: "Bought 200 shares at 52 today. Reasons: low debt, three years of positive cash flow, PE of 11 against a sector average of 15. I am wrong if: cash flow turns negative for two consecutive quarters, or debt reaches the level of equity. Maximum 25,000 taka in this share." A year later there is nothing to learn from the first.</p>
</div>

<h2>Why the reason has to be written</h2>

<p>A decision can be right in two ways: for the right reason, or by luck despite the wrong one. From the outside they look identical, because both made money. Only the written reason can tell them apart.</p>

<p>This matters because success for the wrong reason misleads you next time. You will take the same decision on the same faulty reasoning, and next time the luck may not be there.</p>

${mount("kr-order")}

<h2>Contract notes and statements</h2>

<p>This is a different kind of record with a different purpose: evidence. Every trade's contract note, monthly or quarterly account statements, and dividend advices.</p>

<p>Needed for three reasons. First, if anything goes wrong these are your only evidence in a complaint. Second, they are needed for tax. Third, what your costs actually were is in these papers rather than in your memory.</p>

<div class="note">
<p>A simple arrangement: one folder per year, with every file named starting with its date. Keep it in the cloud so losing a phone does not lose it. Five minutes to set up, ten years of use.</p>
</div>

<h2>Reading the old entries once a year</h2>

<p>This is the whole point of the habit, and the most commonly skipped part. Once a year, on a quiet evening, read last year's entries.</p>

<p>What to look for: which of your reasons turned out to be true and which did not. Were you overconfident? Which kind of decision do you get wrong repeatedly? When you sold, did you follow your own written conditions, or did you sell for some other reason?</p>

<p>The answer to that last question is often uncomfortable, and that is its value. Most people find they wrote one thing and did another, and that gap is the biggest single explanation of their results.</p>

${mount("kr-drill")}

<h2>The tool does not matter</h2>

<p>A spreadsheet, a notes app or a paper notebook all work equally well. What matters is that it lives in one place and gets written on the day of the decision.</p>

<p>One thing experience teaches: "I will write it later" means it never gets written, and if it does it is no longer that day's thinking, it is an explanation composed with the outcome already known. The entire value of the record is that it was written before the outcome was known.</p>

${mount("kr-quiz")}
`,
  blocks: {
    "kr-screen": {
      kind: "figure",
      shape: "callouts",
      title: { bn: "একটা এন্ট্রির ঘরগুলো", en: "The fields of one entry" },
      note: { bn: "প্রতিটা ঘরের পাশে এটা কেন আছে।", en: "Beside each field, why it is there." },
      screen: {
        title: { bn: "সিদ্ধান্তের খাতা", en: "Decision record" },
        rows: [
          { label: { bn: "তারিখ", en: "Date" }, value: { bn: "১২ মার্চ", en: "12 March" } },
          { label: { bn: "কী করলাম", en: "What I did" }, value: { bn: "২০০ শেয়ার, ৫২ টাকায়", en: "200 shares at 52" } },
          { label: { bn: "কারণ", en: "Reasons" }, value: { bn: "ঋণ কম, নগদ প্রবাহ ভালো, পিই ১১", en: "Low debt, good cash flow, PE 11" } },
          { label: { bn: "ভুল প্রমাণ হবে যদি", en: "I am wrong if" }, value: { bn: "দুই প্রান্তিকে নগদ প্রবাহ ঋণাত্মক", en: "Cash flow negative for two quarters" } },
          { label: { bn: "সর্বোচ্চ অঙ্ক", en: "Maximum amount" }, value: { bn: "২৫,০০০ টাকা", en: "25,000 taka" } },
          { label: { bn: "কেমন লাগছে", en: "How I feel" }, value: { bn: "একটু তাড়াহুড়ো, দাম উঠছিল", en: "Slightly rushed, the price was rising" } },
        ],
      },
      parts: [
        { text: { bn: "কবে", en: "When" }, note: { bn: "পরে পড়ার সময় ক্রমটা দরকার হবে।", en: "You will need the sequence when reading it back." }, at: 0 },
        { text: { bn: "ঠিক কী করলেন", en: "Exactly what you did" }, note: { bn: "পরিমাণ আর দাম, কারণ পরে ব্রেক ইভেন হিসাব করতে হবে।", en: "Quantity and price, because you will want the break-even later." }, at: 1 },
        { text: { bn: "কেন", en: "Why" }, note: { bn: "তিনটার বেশি কারণ থাকলে সম্ভবত আপনি সিদ্ধান্তটা আগেই নিয়ে ফেলেছেন আর কারণ খুঁজছেন।", en: "More than three reasons usually means the decision came first and the reasons after." }, tone: "lead", at: 2 },
        { text: { bn: "কী হলে ভুল", en: "What would make it wrong" }, note: { bn: "খাতার সবচেয়ে মূল্যবান ঘর, আর সবচেয়ে কম লেখা হয়।", en: "The most valuable field in the record, and the least often filled in." }, tone: "good", at: 3 },
        { text: { bn: "কতদূর যাবেন", en: "How far you will go" }, note: { bn: "আগে লেখা থাকলে পরে উত্তেজনায় বাড়ানো কঠিন হয়।", en: "Written in advance, it is harder to raise in a moment of excitement." }, at: 4 },
        { text: { bn: "মনের অবস্থা", en: "Your state of mind" }, note: { bn: "এক বছর পরে এই এক লাইনই সবচেয়ে বেশি শেখাবে।", en: "A year later this one line will teach you the most." }, tone: "warn", at: 5 },
      ],
      caption: {
        bn: "ছয়টা ঘর, দুই মিনিট। এই দুই মিনিটই এক বছর পরে আপনার একমাত্র সৎ শিক্ষক।",
        en: "Six fields, two minutes. Those two minutes are your only honest teacher a year later.",
      },
    },
    "kr-order": {
      kind: "order",
      title: { bn: "একটা সিদ্ধান্তের রেকর্ড রাখার ক্রম", en: "The order of recording a decision" },
      note: { bn: "লেখাটা কখন হয় সেটাই এখানে আসল প্রশ্ন।", en: "When the writing happens is the whole question here." },
      items: [
        {
          text: { bn: "কোম্পানিটা নিয়ে পড়াশোনা করুন", en: "Do the reading on the company" },
        },
        {
          text: { bn: "সিদ্ধান্ত নেওয়ার আগে কারণ আর শর্ত লিখে ফেলুন", en: "Write the reasons and conditions before deciding" },
          why: { bn: "আগে লেখা মানে ফলাফল জানার আগে লেখা, আর সেটাই এর পুরো মূল্য।", en: "Written first means written before the outcome is known, which is its entire value." },
        },
        {
          text: { bn: "অর্ডার দিন", en: "Place the order" },
        },
        {
          text: { bn: "একই দিনে পরিমাণ, দাম আর মনের অবস্থা যোগ করুন", en: "Add quantity, price and state of mind the same day" },
          why: { bn: "মনের অবস্থাটা পরদিনই ঝাপসা হয়ে যায়।", en: "The state of mind is already blurred by the next day." },
        },
        {
          text: { bn: "কনট্রাক্ট নোটটা বছরের ফোল্ডারে রাখুন", en: "File the contract note in the year's folder" },
        },
        {
          text: { bn: "বছরে একবার পুরনো এন্ট্রিগুলো পড়ুন", en: "Read the old entries once a year" },
          why: { bn: "এটাই পুরো ব্যবস্থাটার উদ্দেশ্য। এই ধাপ ছাড়া বাকিটা কেবল হিসাব রাখা।", en: "This is the point of the whole system. Without it the rest is only bookkeeping." },
        },
      ],
    },
    "kr-drill": {
      kind: "drill",
      title: { bn: "আজ শুরু করুন", en: "Start today" },
      note: { bn: "পনেরো মিনিট, একবার, আর তারপর প্রতি সিদ্ধান্তে দুই মিনিট।", en: "Fifteen minutes once, then two minutes per decision." },
      steps: [
        {
          text: { bn: "একটা স্প্রেডশিট বা নোট খুলুন, আর ছয়টা কলাম বানান।", en: "Open a spreadsheet or note and make six columns." },
          hint: { bn: "তারিখ, কী করলাম, কারণ, ভুল প্রমাণ হবে যদি, সর্বোচ্চ অঙ্ক, মনের অবস্থা।", en: "Date, what I did, reasons, wrong if, maximum, state of mind." },
        },
        {
          text: { bn: "আপনার এখনকার প্রতিটা শেয়ারের জন্য একটা করে সারি লিখুন, স্মৃতি থেকে।", en: "Write one row per current holding, from memory." },
          hint: { bn: "যেগুলোর কারণ মনে করতে পারছেন না, সেটা নিজেই একটা ফলাফল।", en: "The ones whose reasons you cannot recall are themselves a result." },
        },
        {
          text: { bn: "প্রতিটার জন্য ভুল প্রমাণ হওয়ার শর্তটা এখন লিখুন।", en: "Write the wrong-if condition for each, now." },
        },
        {
          text: { bn: "বছর অনুযায়ী একটা ফোল্ডার বানান আর শেষ ছয় মাসের কনট্রাক্ট নোট সেখানে রাখুন।", en: "Create a folder for the year and put the last six months of contract notes in it." },
        },
        {
          text: { bn: "ক্যালেন্ডারে এক বছর পরের একটা তারিখে মনে করানো বসান: পুরনো এন্ট্রি পড়ার দিন।", en: "Put a reminder in your calendar one year out: the day to read the old entries." },
        },
        {
          text: { bn: "পরের যে সিদ্ধান্তটা নেবেন, সেটার আগে কারণটা লিখুন, পরে নয়।", en: "For your next decision, write the reason before rather than after." },
        },
      ],
    },
    "kr-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার একটা শেয়ার দুই বছরে দ্বিগুণ হয়েছে। খাতায় লেখা কারণ ছিল: লভ্যাংশ ভালো আর ঋণ কম। কিন্তু আসলে দাম বেড়েছে কারণ পুরো খাতটাই একটা নীতির কারণে বেড়েছে। এটা কী শেখায়?",
            en: "One of your shares doubled in two years. Your record gave the reasons as a good dividend and low debt. But in fact the price rose because a policy change lifted the entire sector. What does that teach?",
          },
          options: [
            {
              text: { bn: "সিদ্ধান্তটা ঠিক ছিল, কারণ টাকা এসেছে", en: "The decision was right, because it made money" },
              why: {
                bn: "ফলাফল আর সিদ্ধান্তের মান দুইটা আলাদা। এখানে আপনার কারণগুলো ঘটেনি, আর টাকা এসেছে অন্য কারণে। পরের বার একই কারণে আরেকটা শেয়ার কিনলে সৌভাগ্যটা নাও থাকতে পারে।",
                en: "Outcome and decision quality are different things. Here your reasons did not play out and the money came from something else. Buy another share on the same reasons next time and the luck may not repeat.",
              },
            },
            {
              text: { bn: "সঠিক ফলাফল, ভুল কারণ, আর এটা লেখা ছিল বলেই জানা গেল", en: "The right outcome for the wrong reason, and only the record revealed it" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই খাতা রাখার সবচেয়ে বড় যুক্তি। লেখা না থাকলে আপনি আজ বিশ্বাস করতেন যে আপনার বিশ্লেষণ কাজ করেছে, আর সেই ভুল বিশ্বাসটা নিয়ে পরের দশটা সিদ্ধান্ত নিতেন। এখন আপনি জানেন খাতের নীতিগত পরিবর্তনটাও দেখা দরকার ছিল, আর সেটা পরের বার আপনার তালিকায় থাকবে।",
                en: "Right, and this is the strongest argument for keeping records. Without it you would believe today that your analysis worked, and take the next ten decisions on that false belief. Now you know the sector's policy environment needed watching too, and it will be on your list next time.",
              },
            },
            {
              text: { bn: "কারণ লেখার কোনো মানে নেই, কারণ ফলাফলই আসল", en: "Writing reasons is pointless, since only the outcome counts" },
              why: {
                bn: "একটা সিদ্ধান্তের ফলাফল দেখা যায় একবার, আর পদ্ধতিটা ব্যবহার হয় শতবার। খারাপ পদ্ধতি একবার কাজ করতে পারে, আর শত বার নয়। খাতা পদ্ধতিটাকে দৃশ্যমান করে।",
                en: "You see an outcome once and use a method a hundred times. A poor method can work once and not a hundred times. The record is what makes the method visible.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কারণটা কখন লিখবেন?",
            en: "When should the reason be written?",
          },
          options: [
            {
              text: { bn: "সিদ্ধান্ত নেওয়ার আগে", en: "Before taking the decision" },
              right: true,
              why: {
                bn: "ঠিক, আর কেবল আগে লেখাটাই সৎ। ফলাফল জানার পরে লেখা কারণ আসলে ব্যাখ্যা, আর মানুষের মন যেকোনো ফলাফলের জন্য একটা যুক্তিসঙ্গত ব্যাখ্যা তৈরি করতে পারে। আগে লেখা কারণ একটা ভবিষ্যদ্বাণী, আর ভবিষ্যদ্বাণী যাচাই করা যায়।",
                en: "Right, and only writing it first is honest. Written after the outcome, a reason is an explanation, and the mind can manufacture a plausible explanation for any outcome. Written first, a reason is a prediction, and predictions can be tested.",
              },
            },
            {
              text: { bn: "সপ্তাহের শেষে, একসঙ্গে সব", en: "At the end of the week, all together" },
              why: {
                bn: "কয়েক দিনেই সেই দিনের চিন্তাটা বদলে যায়, বিশেষ করে যদি দাম এর মধ্যে নড়ে থাকে। যা লেখা হবে সেটা সেই দিনের চিন্তা নয়, বরং এখনকার চিন্তা যা ইতিমধ্যে দামের নড়াচড়ায় প্রভাবিত।",
                en: "Within days the thinking of that day has shifted, especially if the price moved. What gets written is not that day's thinking but today's, already coloured by the price.",
              },
            },
            {
              text: { bn: "ফলাফল জানার পরে, তাহলে বেশি নির্ভুল হবে", en: "After the outcome, so it is more accurate" },
              why: {
                bn: "নির্ভুল হবে না, বরং উল্টো। ফলাফল জানা থাকলে মন অবচেতনভাবে এমন কারণ বাছে যা ফলাফলের সঙ্গে মেলে, আর তখন খাতাটা শেখানোর ক্ষমতা হারায়।",
                en: "It becomes less accurate rather than more. Knowing the outcome, the mind unconsciously selects reasons that fit it, and the record loses its ability to teach.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"income-statement": {
  bn: `
<p>আয়-ব্যয়ের হিসাব একটা সহজ প্রশ্নের উত্তর দেয়: <strong>বছরে কত টাকা এল, কত খরচ হলো, আর শেষে কত থাকল?</strong> কিন্তু এটা এক লাইনে বলে না। এটা উপর থেকে নিচে নামে, আর প্রতিটা ধাপে একটা করে খরচ বাদ যায়, আর প্রতিটা ধাপের ফলাফল আলাদা প্রশ্নের উত্তর দেয়।</p>

<p>এই লেখাটা সেই সিঁড়িটা ধরে ধরে নামে। শেষে আপনি জানবেন কেন একটা কোম্পানির আয় বাড়া সত্ত্বেও মুনাফা কমতে পারে, আর কেন মুনাফার হার আসল সংখ্যাটার চেয়ে বেশি বলে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>উপরে আয়, নিচে নিট মুনাফা, আর মাঝে চারটা ধাপ।</li>
<li>মোট মুনাফার হার বলে পণ্যটা নিজে কতটা লাভজনক।</li>
<li>পরিচালন মুনাফা বলে ব্যবসাটা নিজে কেমন চলছে।</li>
<li>সুদ আর কর বাদ দিলে যা থাকে সেটাই শেয়ারহোল্ডারের।</li>
<li>প্রতিটা হার আগের বছর আর প্রতিযোগীর সঙ্গে তুলনা করতে হয়।</li>
</ul>
</div>

<h2>সিঁড়িটা</h2>

${mount("is-flow")}

<p>প্রতিটা ধাপে একটা প্রশ্ন লুকিয়ে আছে। আয় থেকে বিক্রীত পণ্যের খরচ বাদ দিলে পাওয়া যায় মোট মুনাফা, যা বলে পণ্যটা তৈরি করে বেচে কতটা থাকল। তারপর পরিচালন ব্যয় বাদ দিলে পাওয়া যায় পরিচালন মুনাফা, যা বলে পুরো ব্যবসাটা চালিয়ে কতটা থাকল। তারপর সুদ, তারপর কর।</p>

<h2>মোট মুনাফার হার</h2>

<p>মোট মুনাফা ভাগ আয়, শতাংশে। এই সংখ্যাটা বলে কোম্পানিটার পণ্যের দাম বাড়ানোর ক্ষমতা কতটা, আর <a class="term" href="/money/basics-2/complements-substitutes.html">পরিপূরক আর বিকল্প</a> লেখায় দেখা প্রশ্নটার উত্তর এখানেই সংখ্যায় আসে।</p>

<p>একটা ওষুধ কোম্পানির মোট মুনাফার হার হতে পারে ৪৫%, আর একটা ইস্পাত ব্যবসায়ীর ৮%। এটা একটা ভালো আর একটা খারাপ কোম্পানি নয়, এটা দুইটা আলাদা ব্যবসা। তাই তুলনাটা সবসময় একই খাতের ভেতরে।</p>

<div class="note">
<p>যা দেখার তা হলো ধারা। একটা কোম্পানির মোট মুনাফার হার তিন বছরে ৩২% থেকে ২৬% এ নেমেছে মানে হয় কাঁচামালের খরচ বেড়েছে, নয়তো দাম কমাতে হয়েছে প্রতিযোগিতার কারণে। দুইটাই গুরুত্বপূর্ণ, আর দুইটাই বার্ষিক প্রতিবেদনে ব্যাখ্যা থাকার কথা।</p>
</div>

<h2>পরিচালন মুনাফা, যা ব্যবসার আসল পরিমাপ</h2>

${mount("is-screen")}

<p>পরিচালন মুনাফা আমার মতে সবচেয়ে দরকারি একটা লাইন, কারণ এটা ব্যবসাটাকে তার অর্থায়ন থেকে আলাদা করে দেখায়। দুইটা একই রকম কোম্পানি, একটা ঋণ নিয়ে চলছে আর একটা নিজের টাকায়: তাদের নিট মুনাফা আলাদা হবে, কিন্তু পরিচালন মুনাফা তুলনীয়।</p>

<p>এই কারণেই <a class="term" href="/money/basics-3/comparing-peers.html">প্রতিযোগীদের সঙ্গে তুলনা</a> করার সময় পরিচালন মুনাফার হার ব্যবহার করা ভালো: এটা প্রশ্ন করে ব্যবসাটা কেমন, ঋণের সিদ্ধান্তটা কেমন সেটা নয়।</p>

<h2>সুদ, কর, আর যা থাকে</h2>

<p>পরিচালন মুনাফা থেকে সুদ বাদ যায়। এই লাইনটা ছোট মনে হয় যতক্ষণ না ঋণ বেশি হয়, আর তখন এটা মুনাফার একটা বড় অংশ খেয়ে ফেলে। <a class="term" href="/money/basics-2/bangladesh-bank.html">সুদের হার</a> বাড়লে এই লাইনটাই প্রথমে বাড়ে।</p>

<p>তারপর কর, আর যা থাকে সেটাই নিট মুনাফা। এই সংখ্যাটাকে মোট শেয়ার সংখ্যা দিয়ে ভাগ করলে পাওয়া যায় <a class="term" href="/money/terms/eps.html">প্রতি শেয়ার আয়</a>, যা <a class="term" href="/money/terms/pe-ratio.html">পিই</a> হিসাবের নিচের সংখ্যা।</p>

${mount("is-lab")}

<h2>যেখানে সংখ্যাগুলো বিভ্রান্ত করে</h2>

<p>তিনটা ফাঁদ, আর তিনটাই সাধারণ।</p>

<p><strong>এককালীন আয়।</strong> একটা কোম্পানি জমি বেচে ৫০ কোটি টাকা পেল, আর সেটা নিট মুনাফায় যোগ হলো। এই বছরের ইপিএস দুর্দান্ত দেখাবে, আর পরের বছর আর হবে না। তাই এককালীন আইটেমগুলো আলাদা করে দেখা দরকার, আর সেগুলো সাধারণত নোটে থাকে।</p>

<p><strong>আয় বাড়া আর মুনাফা কমা।</strong> এটা ঘটে যখন কোম্পানি বেশি বেচছে কিন্তু কম দামে, বা খরচ দ্রুত বাড়ছে। বিক্রি বাড়া একটা ভালো খবর যদি মুনাফার হার ধরে রাখা যায়, আর নাহলে এটা কেবল ব্যস্ততা।</p>

<p><strong>শেয়ার সংখ্যা বাড়া।</strong> কোম্পানি বোনাস শেয়ার দিলে বা নতুন শেয়ার ইস্যু করলে মোট শেয়ার সংখ্যা বাড়ে, তাই একই মুনাফায় ইপিএস কমে যায়। ইপিএসের ধারা দেখার সময় শেয়ার সংখ্যাও দেখা দরকার।</p>

<div class="ex">
<p><strong>একটা কোম্পানি, দুই বছর।</strong> প্রথম বছর: আয় ৫০০ কোটি, নিট মুনাফা ৪০ কোটি, শেয়ার ১০ কোটি, ইপিএস ৪ টাকা। দ্বিতীয় বছর: আয় ৬০০ কোটি, নিট মুনাফা ৪৪ কোটি, কিন্তু বোনাস শেয়ারের পর শেয়ার ১২ কোটি, ইপিএস ৩.৬৭ টাকা। আয় বেড়েছে, মুনাফা বেড়েছে, আর প্রতি শেয়ারে আপনার ভাগ কমেছে।</p>
</div>

${mount("is-quiz")}
`,
  en: `
<p>An income statement answers a simple question: <strong>how much came in over the year, how much went out, and what was left?</strong> But it does not say it in one line. It descends from the top, subtracting one kind of cost at each step, and each step's result answers a different question.</p>

<p>This lesson walks down that staircase. By the end you will know why a company's profit can fall while its revenue rises, and why the margin says more than the absolute number.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Revenue at the top, net profit at the bottom, four steps in between.</li>
<li>The gross margin says how profitable the product itself is.</li>
<li>Operating profit says how the business itself is doing.</li>
<li>After interest and tax, what remains belongs to shareholders.</li>
<li>Every margin has to be compared with last year and with competitors.</li>
</ul>
</div>

<h2>The staircase</h2>

${mount("is-flow")}

<p>A question hides at each step. Revenue less the cost of goods sold gives gross profit, which says how much was left from making and selling the product. Then operating expenses come off, giving operating profit, which says how much was left from running the whole business. Then interest, then tax.</p>

<h2>The gross margin</h2>

<p>Gross profit divided by revenue, as a percentage. This number says how much pricing power the company has, and it is where the question from the lesson on <a class="term" href="/money/basics-2/complements-substitutes.html">complements and substitutes</a> becomes a figure.</p>

<p>A pharmaceutical company might have a gross margin of 45% and a steel trader 8%. That is not one good and one bad company, it is two different businesses. So the comparison is always inside a sector.</p>

<div class="note">
<p>What you are reading is the trend. A gross margin falling from 32% to 26% over three years means either raw material costs rose or prices had to be cut under competition. Both matter, and both should be explained in the annual report.</p>
</div>

<h2>Operating profit, the real measure of the business</h2>

${mount("is-screen")}

<p>Operating profit is the single most useful line, because it separates the business from the way it is financed. Two similar companies, one running on debt and one on its own money, will have different net profits and comparable operating profits.</p>

<p>Which is why <a class="term" href="/money/basics-3/comparing-peers.html">comparing peers</a> works better on operating margins: it asks how good the business is rather than how the financing decision went.</p>

<h2>Interest, tax, and what remains</h2>

<p>Interest comes off operating profit. The line looks small until debt is large, and then it eats a substantial part of the profit. When <a class="term" href="/money/basics-2/bangladesh-bank.html">interest rates</a> rise, this line is the first to grow.</p>

<p>Then tax, and what is left is net profit. Divide it by the number of shares and you have <a class="term" href="/money/terms/eps.html">earnings per share</a>, the number underneath the <a class="term" href="/money/terms/pe-ratio.html">PE</a>.</p>

${mount("is-lab")}

<h2>Where the numbers mislead</h2>

<p>Three traps, all of them common.</p>

<p><strong>One-off income.</strong> A company sells land for 500 million and it lands in net profit. This year's EPS looks superb and it will not repeat. So one-off items have to be looked at separately, and they usually sit in the notes.</p>

<p><strong>Revenue up, profit down.</strong> This happens when a company is selling more at lower prices, or when costs are rising faster. Growing sales is good news if the margin holds, and otherwise it is only activity.</p>

<p><strong>A rising share count.</strong> Bonus shares or a new issue raise the number of shares, so the same profit gives a lower EPS. Reading the EPS trend requires reading the share count too.</p>

<div class="ex">
<p><strong>One company, two years.</strong> Year one: revenue 5 billion, net profit 400 million, 100 million shares, EPS 4. Year two: revenue 6 billion, net profit 440 million, but after a bonus issue there are 120 million shares, so EPS is 3.67. Revenue grew, profit grew, and your share of it per share fell.</p>
</div>

${mount("is-quiz")}
`,
  blocks: {
    "is-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "আয় থেকে নিট মুনাফা", en: "From revenue to net profit" },
      note: { bn: "প্রতিটা ধাপে একটা খরচ বাদ যায়, আর একটা প্রশ্নের উত্তর আসে।", en: "One kind of cost at each step, and one question answered." },
      parts: [
        { text: { bn: "আয়", en: "Revenue" }, note: { bn: "বছরে যত টাকার পণ্য বা সেবা বেচা হয়েছে", en: "The value of everything sold in the year" }, tone: "lead" },
        { text: { bn: "মোট মুনাফা", en: "Gross profit" }, note: { bn: "বিক্রীত পণ্যের খরচ বাদে। পণ্যটা নিজে কতটা লাভজনক।", en: "After the cost of goods sold. How profitable the product itself is." } },
        { text: { bn: "পরিচালন মুনাফা", en: "Operating profit" }, note: { bn: "বেতন, ভাড়া, বিপণন বাদে। ব্যবসাটা নিজে কেমন চলছে।", en: "After salaries, rent and marketing. How the business itself is doing." }, tone: "good" },
        { text: { bn: "কর পূর্ব মুনাফা", en: "Profit before tax" }, note: { bn: "সুদ বাদে। এখানেই ঋণের সিদ্ধান্তটা দেখা যায়।", en: "After interest. This is where the debt decision shows up." }, tone: "warn" },
        { text: { bn: "নিট মুনাফা", en: "Net profit" }, note: { bn: "কর বাদে। এটাই শেয়ারহোল্ডারদের, আর এটাই ইপিএসের ভিত্তি।", en: "After tax. This belongs to shareholders and is the basis of EPS." } },
      ],
      caption: {
        bn: "সবাই কেবল শেষ সংখ্যাটা দেখেন। মাঝের তিনটা বলে সংখ্যাটা কীভাবে তৈরি হলো, আর সেটাই পরের বছরের আন্দাজ দেয়।",
        en: "Everyone looks only at the last number. The three in between say how it was made, and that is what tells you about next year.",
      },
    },
    "is-screen": {
      kind: "figure",
      shape: "callouts",
      title: { bn: "একটা আয়-ব্যয়ের হিসাব", en: "One income statement" },
      note: { bn: "কাল্পনিক সংখ্যা, কোটি টাকায়। পাশে প্রতিটা লাইন কী বলছে।", en: "Imaginary figures, in millions. Beside each line, what it says." },
      screen: {
        title: { bn: "বছর শেষে", en: "For the year" },
        rows: [
          { label: { bn: "আয়", en: "Revenue" }, value: { bn: "৬০০", en: "6,000" } },
          { label: { bn: "বিক্রীত পণ্যের খরচ", en: "Cost of goods sold" }, value: { bn: "(৪২০)", en: "(4,200)" } },
          { label: { bn: "মোট মুনাফা", en: "Gross profit" }, value: { bn: "১৮০, ৩০%", en: "1,800, 30%" } },
          { label: { bn: "পরিচালন ব্যয়", en: "Operating expenses" }, value: { bn: "(১০৫)", en: "(1,050)" } },
          { label: { bn: "পরিচালন মুনাফা", en: "Operating profit" }, value: { bn: "৭৫, ১২.৫%", en: "750, 12.5%" } },
          { label: { bn: "সুদ ও কর", en: "Interest and tax" }, value: { bn: "(৩১)", en: "(310)" } },
          { label: { bn: "নিট মুনাফা", en: "Net profit" }, value: { bn: "৪৪, ৭.৩%", en: "440, 7.3%" } },
        ],
      },
      parts: [
        { text: { bn: "কত বেচল", en: "How much it sold" }, note: { bn: "একা এটা কিছুই বলে না। বেড়েছে না কমেছে, সেটাই প্রশ্ন।", en: "On its own it says nothing. Whether it grew or shrank is the question." }, at: 0 },
        { text: { bn: "পণ্যটা বানাতে কত লাগল", en: "What it cost to make" }, note: { bn: "কাঁচামাল, শ্রম আর কারখানার সরাসরি খরচ।", en: "Raw materials, labour and direct factory costs." }, at: 1 },
        { text: { bn: "পণ্যের নিজের লাভ", en: "The product's own profit" }, note: { bn: "৩০% হার। এটাই দাম বাড়ানোর ক্ষমতার পরিমাপ।", en: "A 30% margin. This is the measure of pricing power." }, tone: "lead", at: 2 },
        { text: { bn: "ব্যবসা চালানোর খরচ", en: "The cost of running the business" }, note: { bn: "বেতন, ভাড়া, বিপণন, প্রশাসন।", en: "Salaries, rent, marketing, administration." }, at: 3 },
        { text: { bn: "ব্যবসাটার আসল ফলাফল", en: "The business's real result" }, note: { bn: "ঋণের সিদ্ধান্ত এখানে ঢোকেনি, তাই প্রতিযোগীর সঙ্গে তুলনা এখানেই।", en: "The financing decision has not entered yet, so peer comparison happens here." }, tone: "good", at: 4 },
        { text: { bn: "ঋণ আর সরকারের ভাগ", en: "The lenders' and the government's share" }, note: { bn: "ঋণ বেশি হলে এই লাইনটাই মুনাফা খেয়ে ফেলে।", en: "With heavy debt this line eats the profit." }, tone: "warn", at: 5 },
        { text: { bn: "আপনার ভাগ", en: "Your share" }, note: { bn: "শেয়ার সংখ্যা দিয়ে ভাগ করলে ইপিএস।", en: "Divide by the share count and you have EPS." }, at: 6 },
      ],
      caption: {
        bn: "তিনটা হার, ৩০%, ১২.৫% আর ৭.৩%, একা কিছু বলে না। গত বছরের আর প্রতিযোগীর সংখ্যার পাশে বসালে বলে।",
        en: "The three margins, 30%, 12.5% and 7.3%, say nothing alone. Beside last year's and a competitor's, they say a great deal.",
      },
    },
    "is-lab": {
      kind: "lab",
      model: "roe",
      title: { bn: "মুনাফার হার আর রিটার্ন", en: "Margins and return" },
      note: { bn: "বিক্রি আর মুনাফা নাড়িয়ে দেখুন মুনাফার হার আর ইকুইটির উপর রিটার্ন কীভাবে বদলায়।", en: "Move sales and profit and watch the margin and the return on equity change." },
      preset: { sales: 600, profit: 44, assets: 700, equity: 250 },
    },
    "is-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানির আয় ২০% বেড়েছে আর নিট মুনাফা ৫% কমেছে। সবচেয়ে সম্ভাব্য কারণ কী?",
            en: "A company's revenue rose 20% and its net profit fell 5%. What is the most likely cause?",
          },
          options: [
            {
              text: { bn: "খরচ আয়ের চেয়ে দ্রুত বেড়েছে, বা সুদের খরচ বেড়েছে", en: "Costs rose faster than revenue, or the interest bill grew" },
              right: true,
              why: {
                bn: "ঠিক, আর কোনটা সেটা জানতে সিঁড়ির প্রতিটা ধাপ দেখতে হবে। মোট মুনাফার হার কমলে কারণটা কাঁচামাল বা দাম। পরিচালন মুনাফার হার কমলে কারণটা বেতন বা বিপণন। দুইটাই ঠিক থেকে নিট মুনাফা কমলে কারণটা সুদ বা কর।",
                en: "Right, and which one requires reading every step of the staircase. A falling gross margin points to raw materials or pricing. A falling operating margin points to salaries or marketing. Both intact and net profit down points to interest or tax.",
              },
            },
            {
              text: { bn: "কোম্পানিটা কম বেচেছে", en: "The company sold less" },
              why: {
                bn: "আয় ২০% বেড়েছে, তাই এটা বেশি বেচেছে বা বেশি দামে বেচেছে। সমস্যাটা বিক্রিতে নয়, বিক্রির পরে।",
                en: "Revenue rose 20%, so it sold more or sold at higher prices. The problem is not in the selling, it is after the selling.",
              },
            },
            {
              text: { bn: "এটা অসম্ভব, আয় বাড়লে মুনাফা বাড়েই", en: "That is impossible; revenue up means profit up" },
              why: {
                bn: "খুবই সম্ভব আর প্রায়ই ঘটে। একটা কোম্পানি দাম কমিয়ে বেশি বেচতে পারে, বা বাড়তি উৎপাদনের জন্য ঋণ নিতে পারে। ব্যস্ততা আর লাভজনকতা এক জিনিস নয়।",
                en: "Entirely possible and common. A company can cut prices to sell more, or borrow to fund extra production. Activity and profitability are not the same thing.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "দুইটা কোম্পানির নিট মুনাফা একই, কিন্তু একটার ঋণ অনেক বেশি। কোন লাইন দিয়ে ব্যবসা দুইটা তুলনা করবেন?",
            en: "Two companies have the same net profit but one carries far more debt. Which line do you use to compare the businesses?",
          },
          options: [
            {
              text: { bn: "পরিচালন মুনাফা", en: "Operating profit" },
              right: true,
              why: {
                bn: "ঠিক। পরিচালন মুনাফা সুদের আগে, তাই এটা ব্যবসাটাকে তার অর্থায়ন থেকে আলাদা করে দেখায়। একই নিট মুনাফায় বেশি ঋণওয়ালা কোম্পানির পরিচালন মুনাফা বেশি হতে হবে, কারণ তাকে সুদ দিতে হয়েছে। অর্থাৎ তার ব্যবসাটা আসলে ভালো, আর তার ঝুঁকি বেশি।",
                en: "Right. Operating profit sits before interest, so it separates the business from its financing. For the same net profit the indebted company must have a higher operating profit, because it paid interest out of it. Its business is actually better, and its risk is higher.",
              },
            },
            {
              text: { bn: "নিট মুনাফা, কারণ সেটাই শেষ সংখ্যা", en: "Net profit, because it is the final number" },
              why: {
                bn: "নিট মুনাফা শেয়ারহোল্ডারের জন্য সঠিক সংখ্যা, আর ব্যবসা তুলনার জন্য নয়। এখানে দুইটার নিট মুনাফা এক, অথচ ব্যবসা দুইটা মোটেও এক নয়, আর নিট মুনাফা সেই পার্থক্যটা লুকিয়ে ফেলছে।",
                en: "Net profit is the right number for a shareholder and the wrong one for comparing businesses. Here the two net profits are equal while the businesses are not, and net profit is hiding that difference.",
              },
            },
            {
              text: { bn: "আয়, কারণ সেটাই সবচেয়ে বড় সংখ্যা", en: "Revenue, because it is the largest number" },
              why: {
                bn: "আয় বলে কত বেচল, কতটা লাভজনক সেটা নয়। দুইটা কোম্পানির আয় এক হয়েও একটার মুনাফা তিনগুণ হতে পারে।",
                en: "Revenue says how much was sold, not how profitably. Two companies with equal revenue can differ threefold in profit.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানির ইপিএস গত বছর ৫ টাকা ছিল, এবার ৪ টাকা। নিট মুনাফা ১০% বেড়েছে। কী ঘটেছে?",
            en: "A company's EPS was 5 last year and is 4 this year, while net profit rose 10%. What happened?",
          },
          options: [
            {
              text: { bn: "শেয়ারের সংখ্যা বেড়েছে, সম্ভবত বোনাস শেয়ার বা নতুন ইস্যুতে", en: "The share count rose, probably from a bonus issue or a new issue" },
              right: true,
              why: {
                bn: "ঠিক। ইপিএস হলো নিট মুনাফা ভাগ শেয়ার সংখ্যা, তাই উপরের সংখ্যা বেড়েও নিচের সংখ্যা বেশি বাড়লে ফলাফল কমে। এই কারণেই ইপিএসের ধারা দেখার সময় শেয়ার সংখ্যাটাও পাশে রাখা দরকার, নাহলে ছবিটা ভুল হয়।",
                en: "Right. EPS is net profit divided by the share count, so if the denominator grows faster than the numerator the result falls. This is why the share count belongs beside the EPS trend, or the picture comes out wrong.",
              },
            },
            {
              text: { bn: "হিসাবে ভুল আছে", en: "There is an error in the accounts" },
              why: {
                bn: "কোনো ভুল নেই। মুনাফা বাড়া আর প্রতি শেয়ারে আয় কমা একসঙ্গে ঘটতে পারে, আর নিয়মিত ঘটে, বিশেষ করে যেসব কোম্পানি প্রতি বছর বোনাস শেয়ার দেয়।",
                en: "There is no error. Profit rising and earnings per share falling can happen together, and regularly do, especially at companies that issue bonus shares every year.",
              },
            },
            {
              text: { bn: "কোম্পানি বেশি কর দিয়েছে", en: "The company paid more tax" },
              why: {
                bn: "কর নিট মুনাফার আগেই বাদ যায়, আর প্রশ্নে বলা আছে নিট মুনাফা বেড়েছে। তাই পার্থক্যটা ভাগফলের নিচের অংশে, উপরের অংশে নয়।",
                en: "Tax is already deducted before net profit, and the question says net profit rose. So the difference is in the denominator, not the numerator.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"balance-sheet": {
  bn: `
<p>আয়-ব্যয়ের হিসাব একটা সিনেমা: এক বছরে কী ঘটল। স্থিতিপত্র একটা ছবি: একটা নির্দিষ্ট দিনে কোম্পানির কী আছে আর কী দিতে হবে। দুইটা একসঙ্গে না পড়লে ছবিটা অসম্পূর্ণ থাকে।</p>

<p>স্থিতিপত্রের একটা নিয়ম আছে যা কখনো ভাঙে না: <strong>সম্পদ সমান দায় যোগ ইকুইটি।</strong> কোম্পানির যা কিছু আছে তা হয় ধার করা টাকায় কেনা, নয়তো মালিকদের টাকায়। তৃতীয় কোনো উৎস নেই।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>সম্পদ সমান দায় যোগ ইকুইটি, সবসময়।</li>
<li>ইকুইটি হলো সম্পদ থেকে দায় বাদ দিলে যা থাকে, আর সেটাই মালিকদের।</li>
<li>চলতি সম্পদ আর চলতি দায়ের অনুপাত বলে কোম্পানি স্বল্পমেয়াদে টিকবে কি না।</li>
<li>ঋণ ইকুইটির তুলনায় কত, সেটাই সবচেয়ে দরকারি একটা সংখ্যা।</li>
<li>প্রাপ্য আর মজুদ বাড়া প্রায়ই বিক্রি বাড়ার চেয়ে বেশি কিছু বলে।</li>
</ul>
</div>

<h2>দুইটা পাল্লা</h2>

${mount("bs-scale")}

<p>বাঁ দিকে যা আছে তা কোম্পানির সম্পত্তি: নগদ, যা পাওনা আছে, মজুদ পণ্য, কারখানা আর যন্ত্রপাতি। ডান দিকে যা আছে তা এই সম্পত্তির দাবি: প্রথমে পাওনাদারদের, তারপর যা থাকে সেটা মালিকদের।</p>

<p>এই কারণেই ইকুইটিকে বলা হয় অবশিষ্ট দাবি। কোম্পানি বন্ধ হলে আগে ঋণ শোধ হয়, তারপর যা থাকে সেটা শেয়ারহোল্ডাররা পান। প্রায়ই কিছুই থাকে না, আর এই কারণেই শেয়ার ঝুঁকিপূর্ণ।</p>

<h2>সম্পদের দিকটা</h2>

${mount("bs-bins")}

<p>সম্পদের একটা গুরুত্বপূর্ণ বিভাজন আছে: চলতি আর অচলতি। চলতি সম্পদ এক বছরের মধ্যে নগদে পরিণত হওয়ার কথা, আর অচলতি সম্পদ দীর্ঘমেয়াদে থাকে।</p>

<p>দুইটা চলতি সম্পদ বিশেষভাবে দেখার মতো। <strong>প্রাপ্য হিসাব</strong> মানে যে টাকা কোম্পানি বেচেছে কিন্তু এখনো পায়নি। <strong>মজুদ</strong> মানে যে পণ্য বানানো হয়েছে কিন্তু বেচা হয়নি। দুইটাই আয়ের অংশ হিসেবে গোনা হয়ে গেছে, আর দুইটাই এখনো নগদ নয়।</p>

<div class="note">
<p>একটা শক্তিশালী পরীক্ষা: প্রাপ্য আর মজুদ কি বিক্রির চেয়ে দ্রুত বাড়ছে? বিক্রি ১০% বেড়েছে আর প্রাপ্য ৪৫% বেড়েছে মানে হয় কোম্পানি এমন ক্রেতাদের কাছে বেচছে যারা সময়মতো দিচ্ছেন না, নয়তো বিক্রি বাড়ানোর জন্য বেশি ছাড় দেওয়া হচ্ছে। দুইটাই পরের বছরের সমস্যা।</p>
</div>

<h2>দায়ের দিকটা</h2>

<p>দায়ও চলতি আর দীর্ঘমেয়াদি। চলতি দায় এক বছরের মধ্যে শোধ করতে হবে: সরবরাহকারীদের পাওনা, স্বল্পমেয়াদি ঋণ, বকেয়া বেতন আর কর। দীর্ঘমেয়াদি দায় সাধারণত ব্যাংক ঋণ আর বন্ড।</p>

<p>দুইটা অনুপাত এখান থেকে আসে, আর দুইটাই দরকারি। <strong>চলতি অনুপাত</strong> হলো চলতি সম্পদ ভাগ চলতি দায়, আর এটা বলে আগামী বছরের দায়গুলো মেটানোর মতো সম্পদ আছে কি না। <strong>ঋণ ইকুইটি অনুপাত</strong> বলে কোম্পানিটা কতটা ধারের উপর দাঁড়িয়ে।</p>

${mount("bs-lab")}

<h2>ইকুইটি আর বইমূল্য</h2>

<p>ইকুইটি ভাগ শেয়ার সংখ্যা হলো <a class="term" href="/money/terms/book-value.html">প্রতি শেয়ার বইমূল্য</a>। এটা বাজারদরের সঙ্গে তুলনা করলে পাওয়া যায় দাম ভাগ বইমূল্য অনুপাত।</p>

<p>এই অনুপাতটা কিছু ব্যবসায় খুব কাজের আর কিছু ব্যবসায় প্রায় অর্থহীন। ব্যাংক আর আর্থিক প্রতিষ্ঠানে এটা গুরুত্বপূর্ণ, কারণ তাদের সম্পদ মূলত আর্থিক আর হিসাবের মূল্যের কাছাকাছি। একটা সফটওয়্যার কোম্পানিতে এটা প্রায় অর্থহীন, কারণ তার আসল সম্পদ মানুষ আর ব্র্যান্ড, যা স্থিতিপত্রে নেই।</p>

<h2>যা স্থিতিপত্রে নেই</h2>

<p>এই প্রশ্নটা করা কম হয় আর এটা গুরুত্বপূর্ণ। কোম্পানির নিজে গড়া ব্র্যান্ড স্থিতিপত্রে নেই। কর্মীদের দক্ষতা নেই। গ্রাহকের আনুগত্য নেই। একটা চলমান মামলার সম্ভাব্য ক্ষতি সাধারণত নোটে থাকে, স্থিতিপত্রের সংখ্যায় নয়।</p>

<p>অন্যদিকে কিছু জিনিস স্থিতিপত্রে আছে যার আসল মূল্য কম হতে পারে: বহু বছরের পুরনো মজুদ, আদায় না হওয়া প্রাপ্য, বা এমন যন্ত্রপাতি যা আর কেউ কেনে না। <a class="term" href="/money/basics-3/red-flags.html">বিপদের চিহ্ন</a> লেখাটা এগুলো ধরার উপায় দেখায়।</p>

<div class="ex">
<p><strong>দুইটা কোম্পানি, একই ইকুইটি।</strong> দুইটারই ইকুইটি ২০০ কোটি। প্রথমটার সম্পদের ৬০% নগদ আর সাম্প্রতিক প্রাপ্য। দ্বিতীয়টার সম্পদের ৬০% হলো দশ বছরের পুরনো যন্ত্রপাতি আর দুই বছরের পুরনো মজুদ। বইমূল্য এক, আর একটা সংকটে দুইটার মূল্য সম্পূর্ণ আলাদা হবে।</p>
</div>

${mount("bs-quiz")}
`,
  en: `
<p>An income statement is a film: what happened over a year. A balance sheet is a photograph: what the company owns and owes on one particular day. Read one without the other and the picture is incomplete.</p>

<p>A balance sheet obeys one rule that never breaks: <strong>assets equal liabilities plus equity.</strong> Everything a company has was funded either with borrowed money or with the owners' money. There is no third source.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Assets equal liabilities plus equity, always.</li>
<li>Equity is what is left after liabilities, and it belongs to the owners.</li>
<li>Current assets against current liabilities says whether the company survives the short term.</li>
<li>Debt against equity is one of the most useful numbers there is.</li>
<li>Rising receivables and inventory often say more than rising sales.</li>
</ul>
</div>

<h2>Two pans of a scale</h2>

${mount("bs-scale")}

<p>The left side is what the company owns: cash, what it is owed, inventory, plant and machinery. The right side is the claims on all of that: the creditors first, and whatever is left belongs to the owners.</p>

<p>Which is why equity is called a residual claim. If a company is wound up the debts are paid first and shareholders get what remains. Often nothing remains, and that is why shares are risky.</p>

<h2>The asset side</h2>

${mount("bs-bins")}

<p>Assets carry an important division: current and non-current. Current assets should turn into cash within a year; non-current ones stay for the long term.</p>

<p>Two current assets deserve particular attention. <strong>Trade receivables</strong> is money for goods sold and not yet collected. <strong>Inventory</strong> is goods made and not yet sold. Both have already been counted towards revenue, and neither is cash yet.</p>

<div class="note">
<p>A powerful test: are receivables and inventory growing faster than sales? Sales up 10% and receivables up 45% means either the company is selling to customers who do not pay on time, or discounts are being used to buy the growth. Both are next year's problem.</p>
</div>

<h2>The liability side</h2>

<p>Liabilities are also current and long term. Current liabilities fall due within a year: money owed to suppliers, short-term borrowings, unpaid salaries and tax. Long-term liabilities are usually bank loans and bonds.</p>

<p>Two ratios come from here, and both are useful. The <strong>current ratio</strong> is current assets divided by current liabilities, and it says whether there are enough assets to meet the coming year's obligations. The <strong>debt to equity ratio</strong> says how much of the company stands on borrowed money.</p>

${mount("bs-lab")}

<h2>Equity and book value</h2>

<p>Equity divided by the number of shares is <a class="term" href="/money/terms/book-value.html">book value per share</a>. Compared against the market price it gives the price to book ratio.</p>

<p>That ratio is very useful in some businesses and close to meaningless in others. It matters at banks and financial institutions, whose assets are mostly financial and close to their carrying value. It means little at a software company, whose real assets are people and a brand, neither of which is on a balance sheet.</p>

<h2>What is not on a balance sheet</h2>

<p>This question is asked too rarely and it matters. A brand a company built itself is not there. Its employees' skill is not there. Customer loyalty is not there. The possible cost of an ongoing case is usually in the notes rather than in the numbers.</p>

<p>In the other direction, some things on a balance sheet may be worth less than they say: inventory that has sat for years, receivables that will not be collected, machinery nobody buys any more. The lesson on <a class="term" href="/money/basics-3/red-flags.html">red flags</a> shows how to catch these.</p>

<div class="ex">
<p><strong>Two companies with the same equity.</strong> Both report equity of 2 billion. In the first, 60% of assets are cash and recent receivables. In the second, 60% are ten-year-old machinery and two-year-old inventory. The book value is identical, and in a crisis the two are worth completely different amounts.</p>
</div>

${mount("bs-quiz")}
`,
  blocks: {
    "bs-scale": {
      kind: "figure",
      shape: "scale",
      title: { bn: "সম্পদ, দায় আর ইকুইটি", en: "Assets, liabilities and equity" },
      note: { bn: "দুইটা পাল্লা সবসময় সমান। ইকুইটি হলো যা সমান করে।", en: "The two pans always balance. Equity is what makes them balance." },
      axes: {
        x: [{ bn: "যা আছে", en: "What it owns" }, { bn: "যার উপর দাবি", en: "Who has a claim" }],
      },
      parts: [
        {
          text: { bn: "সম্পদ", en: "Assets" },
          note: { bn: "নগদ, প্রাপ্য, মজুদ, কারখানা আর যন্ত্রপাতি। এক বছরে নগদ হবে এমন সম্পদ চলতি, বাকিটা অচলতি।", en: "Cash, receivables, inventory, plant and machinery. Anything turning into cash within a year is current; the rest is not." },
          value: 100,
          tone: "good",
        },
        {
          text: { bn: "দায় যোগ ইকুইটি", en: "Liabilities plus equity" },
          note: { bn: "প্রথমে পাওনাদারদের দাবি, তারপর যা থাকে সেটা মালিকদের। ইকুইটি অবশিষ্ট, তাই সম্পদ কমলে ইকুইটিই আগে কমে।", en: "The creditors' claim first, and what remains belongs to the owners. Equity is the residual, so when assets fall, equity falls first." },
          value: 100,
          tone: "warn",
        },
      ],
      caption: {
        bn: "সমীকরণটা কখনো ভাঙে না, আর সেটাই এর দুর্বলতা: দুই পাশ সমান রাখতে একটা সম্পদের মূল্য বাড়িয়ে দেখানো যায়। সম্পদের গুণমান তাই সংখ্যার চেয়ে বেশি গুরুত্বপূর্ণ।",
        en: "The equation never breaks, which is its weakness: an asset can be carried at a generous value to keep the two sides equal. So the quality of the assets matters more than the total.",
      },
    },
    "bs-bins": {
      kind: "bins",
      title: { bn: "চলতি নাকি অচলতি", en: "Current or non-current" },
      note: { bn: "এক বছরের মধ্যে নগদ হওয়ার কথা যেগুলোর, সেগুলো চলতি।", en: "Anything expected to turn into cash within a year is current." },
      bins: [
        { id: "current", label: { bn: "চলতি সম্পদ", en: "Current assets" }, tone: "good" },
        { id: "fixed", label: { bn: "অচলতি সম্পদ", en: "Non-current assets" }, tone: "plain" },
      ],
      items: [
        {
          text: { bn: "ব্যাংকে রাখা নগদ", en: "Cash at the bank" },
          bin: "current",
          why: { bn: "সবচেয়ে চলতি সম্পদ, আর সংকটে একমাত্র যেটার মূল্য নিয়ে প্রশ্ন থাকে না।", en: "The most current asset there is, and the only one whose value is not in question during a crisis." },
        },
        {
          text: { bn: "ক্রেতাদের কাছে পাওনা টাকা", en: "Money owed by customers" },
          bin: "current",
          why: { bn: "চলতি, তবে বয়স দেখুন। এক বছরের পুরনো প্রাপ্য নামেই চলতি।", en: "Current, but check the ageing. A receivable a year old is current in name only." },
        },
        {
          text: { bn: "কারখানার জমি আর ভবন", en: "Factory land and buildings" },
          bin: "fixed",
          why: { bn: "দীর্ঘমেয়াদি, আর সহজে বেচা যায় না। দ্রুত টাকা লাগলে এগুলো কাজে আসে না।", en: "Long term and not easily sold. They are of no help when cash is needed quickly." },
        },
        {
          text: { bn: "গুদামে থাকা তৈরি পণ্য", en: "Finished goods in the warehouse" },
          bin: "current",
          why: { bn: "চলতি, যদি সত্যিই বিক্রি হয়। বহু বছরের পুরনো মজুদ কাগজে সম্পদ আর বাস্তবে নয়।", en: "Current if it actually sells. Inventory that has sat for years is an asset on paper only." },
        },
        {
          text: { bn: "উৎপাদনের যন্ত্রপাতি", en: "Production machinery" },
          bin: "fixed",
          why: { bn: "দীর্ঘমেয়াদি, আর প্রতি বছর অবচয় হয়। বইয়ের মূল্য আর বিক্রয়মূল্য অনেক আলাদা হতে পারে।", en: "Long term, and depreciated each year. Carrying value and resale value can be far apart." },
        },
        {
          text: { bn: "স্বল্পমেয়াদে রাখা বিনিয়োগ", en: "Short-term investments" },
          bin: "current",
          why: { bn: "দ্রুত নগদে পরিণত করা যায়, তাই চলতি। কোম্পানির তারল্যের একটা অংশ।", en: "Convertible into cash quickly, so current. Part of the company's liquidity." },
        },
      ],
    },
    "bs-lab": {
      kind: "lab",
      model: "book-value",
      title: { bn: "বইমূল্য আর দাম", en: "Book value and price" },
      note: { bn: "সম্পদ আর দায় নাড়িয়ে দেখুন ইকুইটি আর প্রতি শেয়ার বইমূল্য কীভাবে বদলায়।", en: "Move assets and liabilities and watch equity and book value per share change." },
      preset: { assets: 800, liabilities: 500, shares: 10, price: 45 },
    },
    "bs-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানির বিক্রি এক বছরে ১০% বেড়েছে, আর প্রাপ্য হিসাব ৫০% বেড়েছে। এটা কী বলে?",
            en: "A company's sales grew 10% in a year while trade receivables grew 50%. What does that say?",
          },
          options: [
            {
              text: { bn: "বিক্রির টাকাটা আসছে না, তাই বিক্রির গুণমান নিয়ে প্রশ্ন", en: "The cash is not coming in, so the quality of the sales is in question" },
              right: true,
              why: {
                bn: "ঠিক, আর এটা সবচেয়ে দরকারি সতর্কসংকেতগুলোর একটা। বিক্রি আয়ের হিসাবে গোনা হয়ে গেছে আর টাকাটা এখনো ক্রেতার কাছে। এর কারণ হতে পারে দুর্বল ক্রেতাদের কাছে বেচা, বা বিক্রি বাড়াতে দীর্ঘ ঋণের মেয়াদ দেওয়া। নোটে প্রাপ্যের বয়স দেখলে পরিষ্কার হবে।",
                en: "Right, and it is one of the most useful warning signals. The sale is already in revenue while the money is still with the customer. The cause may be selling to weaker buyers, or offering longer credit to buy growth. The ageing note will make it clear.",
              },
            },
            {
              text: { bn: "কোম্পানিটা দ্রুত বাড়ছে, তাই এটা ভালো লক্ষণ", en: "The company is growing fast, so this is a good sign" },
              why: {
                bn: "বৃদ্ধি ভালো যখন টাকাটা আসে। প্রাপ্য বিক্রির পাঁচগুণ হারে বাড়া মানে বৃদ্ধিটা কাগজে, আর নগদ প্রবাহে এটা দেখা যাবে না। নগদ প্রবাহের বিবরণী মিলিয়ে দেখলেই বোঝা যায়।",
                en: "Growth is good when the money arrives. Receivables growing five times faster than sales means the growth is on paper, and it will not appear in cash flow. Reading the cash flow statement settles it.",
              },
            },
            {
              text: { bn: "কিছুই বলে না, প্রাপ্য বাড়া স্বাভাবিক", en: "Nothing; receivables normally rise" },
              why: {
                bn: "প্রাপ্য বিক্রির সঙ্গে তাল মিলিয়ে বাড়াটা স্বাভাবিক। বিক্রির পাঁচগুণ হারে বাড়াটা নয়। অনুপাতটাই এখানে তথ্য, সংখ্যাটা নয়।",
                en: "Receivables rising in step with sales is normal. Rising five times faster is not. The ratio is the information here, not the number.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কোম্পানি বন্ধ হয়ে গেলে টাকার ক্রম কী?",
            en: "If a company is wound up, in what order is money paid?",
          },
          options: [
            {
              text: { bn: "আগে পাওনাদার, তারপর যা থাকে শেয়ারহোল্ডারদের", en: "Creditors first, and shareholders get what remains" },
              right: true,
              why: {
                bn: "ঠিক, আর এই কারণেই ইকুইটিকে অবশিষ্ট দাবি বলা হয়। বাস্তবে সম্পদগুলো সাধারণত বইমূল্যের অনেক কমে বিক্রি হয়, তাই শেয়ারহোল্ডারদের জন্য প্রায়ই কিছুই থাকে না। শেয়ারের ঝুঁকির মূল কাঠামোগত কারণ এটাই।",
                en: "Right, and this is why equity is called a residual claim. In practice assets usually sell far below carrying value, so there is often nothing left for shareholders. That is the structural reason shares are risky.",
              },
            },
            {
              text: { bn: "সবাই আনুপাতিক হারে ভাগ পান", en: "Everybody shares proportionally" },
              why: {
                bn: "না, একটা কঠোর ক্রম আছে আর সেটা আইনে নির্ধারিত। শেয়ারহোল্ডাররা সবার শেষে, আর সেই কারণেই তারা সবচেয়ে বেশি সম্ভাব্য রিটার্নও পান।",
                en: "No, there is a strict order set in law. Shareholders come last, which is also why they get the largest potential return.",
              },
            },
            {
              text: { bn: "আগে শেয়ারহোল্ডার, কারণ তারা মালিক", en: "Shareholders first, because they are the owners" },
              why: {
                bn: "মালিকানা মানে শেষ দাবি, প্রথম নয়। মালিক হওয়ার অর্থ হলো বাকি সবাইকে দেওয়ার পরে যা থাকে তা আপনার, ভালো সময়ে যেটা অনেক আর খারাপ সময়ে শূন্য।",
                en: "Ownership means the last claim, not the first. Being an owner means what is left after everyone else is yours, which is a lot in good times and nothing in bad.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা সফটওয়্যার কোম্পানির দাম তার বইমূল্যের ৮ গুণ। এটা কি অতিমূল্যায়িত?",
            en: "A software company trades at eight times book value. Is it overvalued?",
          },
          options: [
            {
              text: { bn: "এই অনুপাত দিয়ে বলা যায় না, কারণ তার আসল সম্পদ স্থিতিপত্রে নেই", en: "This ratio cannot tell you, because its real assets are not on the balance sheet" },
              right: true,
              why: {
                bn: "ঠিক। একটা সফটওয়্যার কোম্পানির মূল্য তার কোড, তার কর্মী আর তার গ্রাহকদের মধ্যে, আর এর কোনোটাই স্থিতিপত্রে সম্পদ হিসেবে বসে না। এখানে আয় আর নগদ প্রবাহভিত্তিক পরিমাপ বেশি অর্থবহ। বইমূল্যের অনুপাত ব্যাংক আর ভারী শিল্পে কাজে লাগে, যেখানে সম্পদগুলো সত্যিই স্থিতিপত্রে আছে।",
                en: "Right. A software company's value sits in its code, its people and its customers, and none of those appears as an asset. Earnings and cash flow measures are more meaningful here. Price to book works at banks and heavy industry, where the assets really are on the balance sheet.",
              },
            },
            {
              text: { bn: "হ্যাঁ, ৮ গুণ সবসময় বেশি", en: "Yes, eight times is always too much" },
              why: {
                bn: "কোনো অনুপাতের একটা সর্বজনীন সীমা নেই। একই সংখ্যা একটা ব্যাংকে উদ্বেগজনক আর একটা সফটওয়্যার কোম্পানিতে সাধারণ, কারণ দুইটার সম্পদের ধরন আলাদা।",
                en: "No ratio has a universal threshold. The same number is alarming at a bank and ordinary at a software company, because the nature of the assets differs.",
              },
            },
            {
              text: { bn: "না, সফটওয়্যার কোম্পানির দাম কখনো বেশি হয় না", en: "No, software companies are never expensive" },
              why: {
                bn: "অবশ্যই হয়, আর প্রায়ই হয়। কথাটা এই নয় যে এটা সস্তা, কথাটা হলো দাম ভাগ বইমূল্য এখানে ভুল যন্ত্র। সঠিক যন্ত্র দিয়ে মাপলে এটা সস্তা বা দামি, দুইটাই হতে পারে।",
                en: "They certainly can be, and often are. The point is not that it is cheap, the point is that price to book is the wrong instrument here. Measured with the right one it may be cheap or expensive.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"cash-flow": {
  bn: `
<p>তিনটা হিসাবের মধ্যে এটাই সবচেয়ে কম পড়া হয়, আর অভিজ্ঞ বিনিয়োগকারীরা প্রায়ই এটাই প্রথমে পড়েন। কারণটা এক বাক্যে বলা যায়: <strong>মুনাফা একটা মতামত, নগদ একটা তথ্য।</strong></p>

<p>মুনাফা হিসাবের নিয়ম মেনে গণনা করা হয়, আর সেই নিয়মে অনেক জায়গায় বিচারবুদ্ধি লাগে: কখন একটা বিক্রি আয় হিসেবে গোনা হবে, কত বছরে একটা যন্ত্র অবচয় হবে, একটা প্রাপ্য আদায় হবে কি না। নগদ প্রবাহে এই বিচারবুদ্ধির জায়গা অনেক কম: টাকাটা ব্যাংক হিসাবে এসেছে, নয়তো আসেনি।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>তিনটা ভাগ: পরিচালন, বিনিয়োগ আর অর্থায়ন।</li>
<li>পরিচালন নগদ প্রবাহই সবচেয়ে গুরুত্বপূর্ণ সংখ্যা।</li>
<li>মুনাফা বেশি আর নগদ প্রবাহ কম, বছরের পর বছর, একটা সতর্কসংকেত।</li>
<li>মুক্ত নগদ প্রবাহ হলো পরিচালন নগদ প্রবাহ বাদ মূলধনি ব্যয়।</li>
<li>লভ্যাংশ নগদ থেকে দিতে হয়, মুনাফা থেকে নয়।</li>
</ul>
</div>

<h2>তিনটা ভাগ</h2>

${mount("cf-flow")}

<p>ভাগ তিনটার অর্থ আলাদা, আর একই সংখ্যা তিন জায়গায় তিন রকম মানে দেয়। পরিচালন থেকে নগদ আসা মানে ব্যবসাটা টাকা বানাচ্ছে। বিনিয়োগ থেকে নগদ আসা মানে কোম্পানি কিছু বেচছে, যা একবার ভালো আর বারবার হলে উদ্বেগজনক। অর্থায়ন থেকে নগদ আসা মানে ধার করা বা শেয়ার ইস্যু করা।</p>

<p>একটা সুস্থ কোম্পানির চেহারা সাধারণত এরকম: পরিচালনে ইতিবাচক, বিনিয়োগে ঋণাত্মক (কারণ সে বাড়ছে), আর অর্থায়নে ঋণাত্মক (কারণ সে ঋণ শোধ করছে আর লভ্যাংশ দিচ্ছে)।</p>

<h2>মুনাফা আর নগদের ফাঁক</h2>

${mount("cf-lab")}

<p>যন্ত্রটাতে প্রাপ্য আর মজুদের পরিবর্তন বাড়িয়ে দেখুন। একই মুনাফায় নগদ প্রবাহ ঋণাত্মক হয়ে যেতে পারে, আর এটাই সেই ফাঁক যা বহু কোম্পানিকে ডুবিয়েছে। একটা কোম্পানি বছরের পর বছর মুনাফা দেখাতে পারে আর একদিন বেতন দিতে না পেরে বন্ধ হয়ে যেতে পারে।</p>

<p>তিনটা জিনিস মুনাফা আর নগদের মধ্যে ফাঁক তৈরি করে। <strong>অবচয়</strong> মুনাফা থেকে বাদ যায় কিন্তু নগদ বেরোয় না, তাই এটা নগদ প্রবাহকে মুনাফার চেয়ে বড় করে। <strong>প্রাপ্য আর মজুদ বাড়া</strong> নগদ আটকে রাখে, তাই এটা নগদ প্রবাহকে ছোট করে। <strong>পাওনা বাড়া</strong> মানে সরবরাহকারীদের দেরিতে দেওয়া, যা নগদ প্রবাহকে বড় করে, সাময়িকভাবে।</p>

<div class="note">
<p>শেষেরটা নিয়ে সতর্ক থাকা দরকার। সরবরাহকারীদের দেরিতে টাকা দিয়ে নগদ প্রবাহ ভালো দেখানো যায়, আর এক প্রান্তিকের জন্য এটা কাজ করে। কিন্তু পাওনা টানা বাড়তে থাকা মানে কোম্পানির নগদের টান, আর একদিন সরবরাহকারীরা আর দেবেন না।</p>
</div>

<h2>মুক্ত নগদ প্রবাহ</h2>

<p>পরিচালন নগদ প্রবাহ থেকে মূলধনি ব্যয় বাদ দিলে যা থাকে সেটাই মুক্ত নগদ প্রবাহ, আর এটাই সেই টাকা যা কোম্পানি সত্যিই ব্যবহার করতে পারে: ঋণ শোধ, লভ্যাংশ, বা নতুন কিছু।</p>

<p>মূলধনি ব্যয় দুই রকম, আর প্রতিবেদন সবসময় আলাদা করে বলে না। কিছু খরচ যা আছে তা টিকিয়ে রাখতে লাগে, আর কিছু খরচ বাড়ানোর জন্য। প্রথমটা বাধ্যতামূলক আর দ্বিতীয়টা ঐচ্ছিক, তাই একটা কোম্পানি খারাপ সময়ে দ্বিতীয়টা বন্ধ করতে পারে আর প্রথমটা পারে না।</p>

${mount("cf-compare")}

<h2>লভ্যাংশ আর নগদ</h2>

<p><a class="term" href="/money/terms/dividend.html">লভ্যাংশ</a> নগদে দিতে হয়, আর নগদ আসে পরিচালন নগদ প্রবাহ থেকে। তাই একটা সহজ পরীক্ষা আছে: কোম্পানির লভ্যাংশ কি তার মুক্ত নগদ প্রবাহের ভেতরে?</p>

<p>যদি না হয়, তাহলে লভ্যাংশটা আসছে ধার করে বা সঞ্চয় ভেঙে, আর সেটা টেকসই নয়। এমন কোম্পানি কয়েক বছর উঁচু লভ্যাংশ দিতে পারে আর তারপর হঠাৎ বন্ধ করে দেয়, আর যারা কেবল লভ্যাংশের জন্য কিনেছিলেন তারা দুইবার ক্ষতিগ্রস্ত হন: লভ্যাংশ যায়, আর দামও পড়ে।</p>

<div class="ex">
<p><strong>দুইটা কোম্পানি, একই লভ্যাংশ।</strong> দুইটাই ২০ কোটি টাকা লভ্যাংশ দিয়েছে। প্রথমটার পরিচালন নগদ প্রবাহ ৭০ কোটি আর মূলধনি ব্যয় ২৫ কোটি, তাই মুক্ত নগদ প্রবাহ ৪৫ কোটি। দ্বিতীয়টার পরিচালন নগদ প্রবাহ ১৮ কোটি আর মূলধনি ব্যয় ১৫ কোটি, তাই মুক্ত নগদ প্রবাহ ৩ কোটি। একই লভ্যাংশ, আর দ্বিতীয়টা সেটা ধার করে দিচ্ছে।</p>
</div>

<h2>পড়ার একটা সংক্ষিপ্ত নিয়ম</h2>

<p>তিন বছরের নগদ প্রবাহের বিবরণী পাশাপাশি রাখুন আর তিনটা প্রশ্ন করুন। পরিচালন নগদ প্রবাহ কি প্রতি বছর ইতিবাচক? এটা কি নিট মুনাফার কাছাকাছি বা তার চেয়ে বেশি? আর মুক্ত নগদ প্রবাহ কি লভ্যাংশের চেয়ে বড়?</p>

<p>তিনটাতেই হ্যাঁ হলে কোম্পানিটা সম্ভবত যা বলছে তাই। কোনো একটাতে না হলে কারণটা খুঁজতে হবে, আর কারণটা প্রায়ই নোটে আছে।</p>

${mount("cf-quiz")}
`,
  en: `
<p>Of the three statements this is the least read, and experienced investors often read it first. The reason fits in one sentence: <strong>profit is an opinion, cash is a fact.</strong></p>

<p>Profit is computed under accounting rules, and those rules require judgement in many places: when a sale counts as revenue, over how many years a machine is depreciated, whether a receivable will be collected. Cash flow leaves far less room for judgement: the money arrived in the bank account, or it did not.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Three sections: operating, investing and financing.</li>
<li>Operating cash flow is the single most important number.</li>
<li>High profit with low cash flow, year after year, is a warning.</li>
<li>Free cash flow is operating cash flow less capital expenditure.</li>
<li>Dividends are paid out of cash, not out of profit.</li>
</ul>
</div>

<h2>Three sections</h2>

${mount("cf-flow")}

<p>The three sections mean different things, and the same number means three different things depending on where it sits. Cash from operations means the business is making money. Cash from investing means the company is selling something, which is fine once and worrying repeatedly. Cash from financing means borrowing or issuing shares.</p>

<p>A healthy company usually looks like this: positive in operations, negative in investing because it is growing, and negative in financing because it is repaying debt and paying dividends.</p>

<h2>The gap between profit and cash</h2>

${mount("cf-lab")}

<p>Increase the changes in receivables and inventory in the tool. At the same profit, cash flow can turn negative, and that gap is what has sunk many companies. A company can report profit year after year and one day close because it cannot pay salaries.</p>

<p>Three things create the gap. <strong>Depreciation</strong> is subtracted from profit without cash leaving, so it makes cash flow larger than profit. <strong>Rising receivables and inventory</strong> tie cash up, so they make cash flow smaller. <strong>Rising payables</strong> means paying suppliers later, which makes cash flow larger, temporarily.</p>

<div class="note">
<p>Be careful with that last one. Paying suppliers late can make cash flow look good, and for one quarter it works. But payables rising steadily means the company is short of cash, and one day the suppliers stop supplying.</p>
</div>

<h2>Free cash flow</h2>

<p>Operating cash flow less capital expenditure is free cash flow, and that is the money a company can genuinely use: to repay debt, to pay a dividend, or to do something new.</p>

<p>Capital expenditure comes in two kinds and reports do not always separate them. Some spending keeps what exists running, and some builds something new. The first is compulsory and the second is optional, so a company in a bad year can stop the second and cannot stop the first.</p>

${mount("cf-compare")}

<h2>Dividends and cash</h2>

<p>A <a class="term" href="/money/terms/dividend.html">dividend</a> is paid in cash, and cash comes from operating cash flow. So there is one easy test: does the dividend fit inside free cash flow?</p>

<p>If not, the dividend is being funded by borrowing or by running down savings, and that is not sustainable. Such a company can pay a high dividend for a few years and then stop abruptly, and anyone who bought purely for the dividend is hurt twice: the dividend goes and the price falls.</p>

<div class="ex">
<p><strong>Two companies, the same dividend.</strong> Both paid 200 million in dividends. The first has operating cash flow of 700 million and capital expenditure of 250 million, so free cash flow of 450 million. The second has operating cash flow of 180 million and capital expenditure of 150 million, so free cash flow of 30 million. Same dividend, and the second one is borrowing to pay it.</p>
</div>

<h2>A short rule for reading it</h2>

<p>Put three years of cash flow statements side by side and ask three questions. Was operating cash flow positive every year? Is it close to or above net profit? And is free cash flow larger than the dividend?</p>

<p>Three yeses and the company is probably what it says. Any no, and the reason has to be found, and the reason is usually in the notes.</p>

${mount("cf-quiz")}
`,
  blocks: {
    "cf-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "নগদ প্রবাহের তিনটা ভাগ", en: "The three sections of cash flow" },
      note: { bn: "একই সংখ্যা তিন জায়গায় তিন রকম মানে দেয়।", en: "The same number means three different things in three places." },
      parts: [
        { text: { bn: "পরিচালন কার্যক্রম", en: "Operating activities" }, note: { bn: "ব্যবসাটা নিজে টাকা বানাচ্ছে কি না। ইতিবাচক না হলে বাকি সব প্রশ্ন গৌণ।", en: "Whether the business itself makes money. If this is not positive, every other question is secondary." }, tone: "lead" },
        { text: { bn: "বিনিয়োগ কার্যক্রম", en: "Investing activities" }, note: { bn: "যন্ত্রপাতি কেনা বা বেচা। বাড়তে থাকা কোম্পানিতে এটা ঋণাত্মক হওয়াই স্বাভাবিক।", en: "Buying or selling assets. In a growing company this is normally negative." } },
        { text: { bn: "অর্থায়ন কার্যক্রম", en: "Financing activities" }, note: { bn: "ঋণ নেওয়া বা শোধ, শেয়ার ইস্যু, লভ্যাংশ দেওয়া।", en: "Borrowing or repaying, issuing shares, paying dividends." } },
        { text: { bn: "নগদের নিট পরিবর্তন", en: "Net change in cash" }, note: { bn: "তিনটার যোগফল, আর এটা স্থিতিপত্রের নগদের পরিবর্তনের সমান হতে হবে।", en: "The sum of the three, and it must equal the change in cash on the balance sheet." }, tone: "good" },
      ],
      caption: {
        bn: "সুস্থ চেহারা: পরিচালনে ইতিবাচক, বিনিয়োগে ঋণাত্মক, অর্থায়নে ঋণাত্মক। উল্টো চেহারা মানে ব্যবসা টাকা বানাচ্ছে না আর ধার করে চলছে।",
        en: "The healthy shape: positive operating, negative investing, negative financing. The reverse means a business that is not making money and is running on borrowing.",
      },
    },
    "cf-lab": {
      kind: "lab",
      model: "cash-vs-profit",
      title: { bn: "মুনাফা থেকে নগদে", en: "From profit to cash" },
      note: { bn: "প্রাপ্য আর মজুদের পরিবর্তন বাড়িয়ে দেখুন নগদ প্রবাহ কীভাবে মুনাফা থেকে সরে যায়।", en: "Increase the change in receivables and inventory and watch cash flow pull away from profit." },
      preset: { profit: 50, depreciation: 15, receivables: 40, inventory: 25, payables: 10 },
    },
    "cf-compare": {
      kind: "compare",
      title: { bn: "তিনটা কোম্পানি, তিনটা চেহারা", en: "Three companies, three shapes" },
      note: { bn: "একই তিনটা ভাগ, আর চিহ্নগুলো আলাদা। চিহ্নই গল্পটা বলে।", en: "The same three sections with different signs. The signs tell the story." },
      columns: [
        { bn: "সুস্থ, বাড়ছে", en: "Healthy, growing" },
        { bn: "সংকটে", en: "In trouble" },
        { bn: "নতুন, বিনিয়োগের পর্যায়ে", en: "Young, still investing" },
      ],
      rows: [
        {
          label: { bn: "পরিচালন", en: "Operating" },
          cells: [{ bn: "ইতিবাচক, বড়", en: "Positive and large" }, { bn: "ঋণাত্মক বা প্রায় শূন্য", en: "Negative or near zero" }, { bn: "সামান্য ইতিবাচক", en: "Slightly positive" }],
          best: 0,
        },
        {
          label: { bn: "বিনিয়োগ", en: "Investing" },
          cells: [{ bn: "ঋণাত্মক, কারণ বাড়ছে", en: "Negative, because it is growing" }, { bn: "ইতিবাচক, কারণ সম্পদ বেচছে", en: "Positive, because assets are being sold" }, { bn: "খুব ঋণাত্মক", en: "Strongly negative" }],
        },
        {
          label: { bn: "অর্থায়ন", en: "Financing" },
          cells: [
            { bn: "ঋণাত্মক, ঋণ শোধ আর লভ্যাংশ", en: "Negative: repaying debt and paying dividends" },
            { bn: "ইতিবাচক, নতুন ধার নিচ্ছে", en: "Positive: taking new debt" },
            { bn: "ইতিবাচক, শেয়ার বা ঋণ", en: "Positive: shares or debt" },
          ],
        },
        {
          label: { bn: "কী বলছে", en: "What it says" },
          cells: [
            { bn: "ব্যবসা টাকা বানাচ্ছে আর নিজের পায়ে দাঁড়িয়ে", en: "The business makes money and stands on its own" },
            { bn: "সম্পদ বেচে আর ধার করে টিকে আছে", en: "Surviving by selling assets and borrowing" },
            { bn: "এখনো প্রমাণিত নয়, তবে ধরনটা স্বাভাবিক", en: "Not yet proven, and the pattern is normal" },
          ],
          best: 0,
        },
      ],
    },
    "cf-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানি টানা তিন বছর নিট মুনাফা দেখাচ্ছে, কিন্তু পরিচালন নগদ প্রবাহ তিন বছরই ঋণাত্মক। এটা কী বলে?",
            en: "A company has reported net profit for three years running while operating cash flow was negative all three. What does that say?",
          },
          options: [
            {
              text: { bn: "মুনাফাটা কাগজে আছে আর নগদে নেই, আর কারণটা খুঁজতে হবে", en: "The profit is on paper and not in cash, and the cause needs finding" },
              right: true,
              why: {
                bn: "ঠিক, আর এটা সবচেয়ে গুরুতর সতর্কসংকেতগুলোর একটা। এক বছর হলে ব্যাখ্যা থাকতে পারে, যেমন একটা বড় প্রকল্পে মজুদ জমা। তিন বছর মানে কাঠামোগত কিছু: প্রাপ্য আদায় হচ্ছে না, মজুদ বিক্রি হচ্ছে না, বা আয়ের স্বীকৃতি খুব আগ্রাসী। কোম্পানিটা বেতন আর সরবরাহকারীদের টাকা দিচ্ছে ধার করে।",
                en: "Right, and it is among the most serious warnings. One year can have an explanation, such as inventory built for a large project. Three years means something structural: receivables not collected, inventory not sold, or revenue recognised aggressively. The company is paying salaries and suppliers out of borrowing.",
              },
            },
            {
              text: { bn: "কোম্পানিটা দ্রুত বাড়ছে, তাই এটা স্বাভাবিক", en: "The company is growing fast, so this is normal" },
              why: {
                bn: "দ্রুত বৃদ্ধিতে কার্যকরী মূলধন আটকে যায়, এটা সত্যি, আর সাধারণত এক বা দুই বছর। তিন বছর ধরে চললে প্রশ্নটা বৃদ্ধির নয়, বৃদ্ধির গুণমানের। যে বৃদ্ধি কখনো নগদে পৌঁছায় না সেটা বৃদ্ধি নয়।",
                en: "Fast growth does tie up working capital, and usually for a year or two. Three years turns the question from growth to the quality of growth. Growth that never reaches cash is not growth.",
              },
            },
            {
              text: { bn: "নগদ প্রবাহ গুরুত্বপূর্ণ নয়, মুনাফাই আসল", en: "Cash flow does not matter; profit is what counts" },
              why: {
                bn: "কোম্পানি বন্ধ হয় নগদ ফুরিয়ে, মুনাফা ফুরিয়ে নয়। মুনাফা দেখিয়ে দেউলিয়া হওয়া সম্ভব আর নিয়মিত ঘটে; নগদ প্রবাহ ভালো থেকে দেউলিয়া হওয়া কঠিন।",
                en: "Companies fail when cash runs out, not when profit does. Going bankrupt while reporting profit is possible and happens regularly; going bankrupt with strong cash flow is hard.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানির পরিচালন নগদ প্রবাহ ৮০ কোটি, মূলধনি ব্যয় ৩০ কোটি, আর লভ্যাংশ ৬০ কোটি। এটা টেকসই?",
            en: "A company has operating cash flow of 800 million, capital expenditure of 300 million and pays 600 million in dividends. Is that sustainable?",
          },
          options: [
            {
              text: { bn: "না, কারণ মুক্ত নগদ প্রবাহ ৫০ কোটি আর লভ্যাংশ ৬০ কোটি", en: "No, because free cash flow is 500 million and the dividend is 600 million" },
              right: true,
              why: {
                bn: "ঠিক। ৮০ বাদ ৩০ সমান ৫০, আর লভ্যাংশ ৬০। প্রতি বছর ১০ কোটি ঘাটতি, যা আসছে নগদের মজুদ থেকে বা ধার থেকে। এক বছর চলে, কয়েক বছর চললে হয় লভ্যাংশ কমবে নয়তো ঋণ বাড়বে। যারা কেবল লভ্যাংশের জন্য ধরে আছেন তাদের এই হিসাবটা প্রতি বছর করা উচিত।",
                en: "Right. 800 less 300 is 500, and the dividend is 600. A shortfall of 100 million a year, funded from cash reserves or borrowing. Fine for one year; over several either the dividend falls or the debt rises. Anyone holding purely for the dividend should do this calculation every year.",
              },
            },
            {
              text: { bn: "হ্যাঁ, কারণ পরিচালন নগদ প্রবাহ লভ্যাংশের চেয়ে বেশি", en: "Yes, because operating cash flow exceeds the dividend" },
              why: {
                bn: "মূলধনি ব্যয় বাদ দিতে ভুলে যাওয়া এখানে সবচেয়ে সাধারণ ভুল। যন্ত্রপাতি রক্ষণাবেক্ষণ আর প্রতিস্থাপন ঐচ্ছিক নয়; সেটা না করলে কয়েক বছর পরে ব্যবসাটাই থাকবে না। তাই তুলনাটা মুক্ত নগদ প্রবাহের সঙ্গে।",
                en: "Forgetting to subtract capital expenditure is the commonest mistake here. Maintaining and replacing equipment is not optional; skip it and in a few years there is no business. So the comparison is with free cash flow.",
              },
            },
            {
              text: { bn: "বলা যায় না, মুনাফার সংখ্যাটা লাগবে", en: "Cannot say without the profit figure" },
              why: {
                bn: "লভ্যাংশ নগদে দেওয়া হয়, মুনাফায় নয়, তাই এই প্রশ্নের জন্য মুনাফার সংখ্যাটা লাগে না। একটা কোম্পানি বড় মুনাফা দেখিয়েও লভ্যাংশ দিতে না পারতে পারে, যদি সেই মুনাফা প্রাপ্য আর মজুদে আটকে থাকে।",
                en: "Dividends are paid in cash rather than out of profit, so the profit figure is not needed here. A company can report a large profit and be unable to pay a dividend, if that profit is tied up in receivables and inventory.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"ratios": {
  bn: `
<p>অনুপাত হলো দুইটা সংখ্যার সম্পর্ক, আর এর পুরো উদ্দেশ্য একটাই: <strong>আকার সরিয়ে ফেলা।</strong> একটা কোম্পানির মুনাফা ৫০ কোটি আর আরেকটার ৫ কোটি, এতে কিছু বোঝা যায় না। কিন্তু প্রথমটা যদি ৫০০ কোটি ইকুইটির উপর ৫০ কোটি বানায় আর দ্বিতীয়টা ২০ কোটির উপর ৫ কোটি, তাহলে দ্বিতীয়টা আড়াই গুণ দক্ষ।</p>

<p>এই লেখাটা কম অনুপাত শেখায়, ইচ্ছাকৃতভাবে। ছয়টা অনুপাত ভালোভাবে বোঝা তিরিশটা মুখস্থ করার চেয়ে অনেক বেশি কাজের, আর এই ছয়টা মিলে একটা কোম্পানির চারটা দিক ঢেকে দেয়: লাভজনকতা, দক্ষতা, নিরাপত্তা আর মূল্যায়ন।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>অনুপাত আকার সরিয়ে দেয়, তাই ছোট আর বড় কোম্পানি তুলনীয় হয়।</li>
<li>একটা অনুপাত একা কিছু বলে না; ধারা আর প্রতিযোগীর তুলনা লাগে।</li>
<li>ছয়টা যথেষ্ট: মুনাফার হার, আরওই, চলতি অনুপাত, ঋণ ইকুইটি, সুদ আবরণ, পিই।</li>
<li>একই অনুপাতের আদর্শ মান খাতভেদে আলাদা।</li>
<li>অনুপাত প্রশ্ন তৈরি করে, উত্তর দেয় না।</li>
</ul>
</div>

<h2>ছয়টা অনুপাত, আর প্রতিটা কী জিজ্ঞেস করে</h2>

${mount("rt-match")}

<p>এই ছয়টার একটা কাঠামো আছে। প্রথম দুইটা জিজ্ঞেস করে কোম্পানিটা কতটা ভালো ব্যবসা। পরের তিনটা জিজ্ঞেস করে এটা কতটা নিরাপদ। শেষটা জিজ্ঞেস করে দামটা কেমন। তিনটা প্রশ্নের উত্তর আলাদা, আর তিনটাই দরকার।</p>

<h2>লাভজনকতা: মুনাফার হার আর আরওই</h2>

<p>মুনাফার হার আয়ের কত অংশ শেষ পর্যন্ত থাকে সেটা বলে। <a class="term" href="/money/terms/roe.html">ইকুইটির উপর রিটার্ন</a>, বা আরওই, বলে মালিকদের টাকার উপর কোম্পানিটা কত রিটার্ন বানাচ্ছে।</p>

${mount("rt-lab")}

<p>আরওই নিয়ে একটা সতর্কতা যা প্রায় কেউ বলে না: <strong>ঋণ বাড়ালে আরওই বাড়ে।</strong> কারণ ইকুইটি ভাগফলের নিচে বসে, আর ঋণ দিয়ে সম্পদ কিনে মুনাফা বাড়ালে উপরের সংখ্যা বাড়ে আর নিচেরটা বাড়ে না। তাই উঁচু আরওই দেখলে সবসময় পাশে ঋণ ইকুইটি অনুপাতটা দেখুন। ২৫% আরওই যদি ঋণহীন কোম্পানির হয় তাহলে সেটা চমৎকার; যদি ঋণ ইকুইটির তিনগুণ হয় তাহলে সেটা ঝুঁকি।</p>

<h2>নিরাপত্তা: চলতি অনুপাত, ঋণ ইকুইটি আর সুদ আবরণ</h2>

<p>চলতি অনুপাত স্বল্পমেয়াদি প্রশ্নের উত্তর দেয়: আগামী বছরের দায়গুলো মেটানোর মতো সম্পদ আছে কি না। ১ এর নিচে মানে সমস্যা, তবে খাতভেদে আলাদা, কারণ যে ব্যবসায় নগদে বিক্রি হয় আর বাকিতে কেনা হয় সেখানে কম চলতি অনুপাতও স্বাভাবিক।</p>

<p>ঋণ ইকুইটি অনুপাত দীর্ঘমেয়াদি প্রশ্নের উত্তর দেয়। আর <strong>সুদ আবরণ</strong>, অর্থাৎ পরিচালন মুনাফা ভাগ সুদ খরচ, সবচেয়ে সরাসরি প্রশ্নের উত্তর দেয়: কোম্পানি তার সুদটা দিতে পারছে তো?</p>

${mount("rt-lab2")}

<p>সুদ আবরণ ৩ এর নিচে নামলে সতর্ক হওয়ার সময়, আর ১.৫ এর নিচে মানে কোম্পানি প্রায় পুরো পরিচালন মুনাফা সুদেই দিয়ে দিচ্ছে। এমন কোম্পানিতে একটা খারাপ প্রান্তিকই যথেষ্ট, কারণ কোনো ব্যবধান নেই।</p>

<h2>মূল্যায়ন: পিই, আর কেন এটা শেষে</h2>

<p><a class="term" href="/money/terms/pe-ratio.html">পিই</a> শেষে আসে কারণ এটা কেবল তখনই অর্থবহ যখন উপরের পাঁচটার উত্তর জানা। একটা কোম্পানির পিই ৮, এটা সস্তা কি না তার উত্তর নির্ভর করে তার মুনাফার হার স্থির কি না, আরওই ভালো কি না, আর ঋণ সামলানোর মতো কি না।</p>

<div class="note">
<p>সস্তা দেখানো কোম্পানির পিই কম থাকে একটা কারণে, আর সেই কারণটা খুঁজে বের করাই কাজ। কারণটা যদি সাময়িক হয় তাহলে সুযোগ, আর যদি কাঠামোগত হয় তাহলে ফাঁদ। উপরের পাঁচটা অনুপাত সেই পার্থক্যটা ধরার যন্ত্র।</p>
</div>

<h2>একটা অনুপাত কখন মিথ্যা বলে</h2>

${mount("rt-compare")}

<p>তিনটা পরিস্থিতিতে অনুপাত বিভ্রান্ত করে, আর তিনটাই সাধারণ। এককালীন আয় বা ব্যয় থাকলে সেই বছরের সব অনুপাত বিকৃত হয়। খাত বদলালে তুলনাটাই অর্থহীন হয়ে যায়। আর ভাগফলের নিচের সংখ্যাটা খুব ছোট হলে অনুপাতটা অস্থির হয়ে যায়: ইকুইটি প্রায় শূন্য হলে আরওই আকাশছোঁয়া দেখাবে, আর সেটা শক্তি নয়, দুর্বলতা।</p>

<div class="ex">
<p><strong>একটা অনুপাত, তিন বছর।</strong> কোম্পানির আরওই ছিল ১৪%, ১৯%, ২৬%। দেখতে চমৎকার একটা ধারা। এবার ঋণ ইকুইটি দেখুন: ০.৪, ০.৯, ১.৮। আরওই বাড়েনি কারণ ব্যবসা ভালো হয়েছে, বেড়েছে কারণ ইকুইটির অনুপাতে ঋণ বেড়েছে। একটা অনুপাত একা পড়লে এটা একটা সাফল্যের গল্প, আর দুইটা একসঙ্গে পড়লে এটা একটা ঝুঁকির গল্প।</p>
</div>

${mount("rt-quiz")}
`,
  en: `
<p>A ratio is a relationship between two numbers, and its entire purpose is one thing: <strong>to remove size.</strong> One company earns 500 million and another 50 million, and that tells you nothing. But if the first makes 500 million on 5 billion of equity and the second makes 50 million on 200 million, the second is two and a half times as efficient.</p>

<p>This lesson teaches few ratios, deliberately. Understanding six well is far more useful than memorising thirty, and these six cover four sides of a company: profitability, efficiency, safety and valuation.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Ratios remove size, so small and large companies become comparable.</li>
<li>One ratio alone says nothing; it needs a trend and a peer.</li>
<li>Six are enough: margin, ROE, current ratio, debt to equity, interest cover, PE.</li>
<li>The right level for the same ratio differs by sector.</li>
<li>Ratios generate questions; they do not give answers.</li>
</ul>
</div>

<h2>Six ratios, and what each one asks</h2>

${mount("rt-match")}

<p>The six have a structure. The first two ask how good a business it is. The next three ask how safe it is. The last asks about the price. Three different questions, and all three are needed.</p>

<h2>Profitability: margin and ROE</h2>

<p>The margin says how much of revenue survives to the bottom. <a class="term" href="/money/terms/roe.html">Return on equity</a>, or ROE, says what return the company earns on the owners' money.</p>

${mount("rt-lab")}

<p>One caution about ROE that is rarely stated: <strong>adding debt raises ROE.</strong> Equity sits in the denominator, and buying assets with borrowed money raises the numerator without raising it. So whenever you see a high ROE, look at debt to equity beside it. A 25% ROE at a debt-free company is excellent; the same figure at three times leverage is risk.</p>

<h2>Safety: current ratio, debt to equity and interest cover</h2>

<p>The current ratio answers the short-term question: are there enough assets to meet the coming year's obligations. Below 1 signals trouble, though it varies by sector, since a business that sells for cash and buys on credit can run a low current ratio quite normally.</p>

<p>Debt to equity answers the long-term question. And <strong>interest cover</strong>, operating profit divided by the interest bill, answers the most direct one: can the company actually pay its interest?</p>

${mount("rt-lab2")}

<p>Interest cover below 3 is time to pay attention, and below 1.5 means nearly all operating profit is going out as interest. One bad quarter is enough at such a company, because there is no margin.</p>

<h2>Valuation: PE, and why it comes last</h2>

<p><a class="term" href="/money/terms/pe-ratio.html">PE</a> comes last because it only means something once the other five have been answered. A PE of 8: whether that is cheap depends on whether the margin is stable, the ROE is decent and the debt is manageable.</p>

<div class="note">
<p>A company that looks cheap has a low PE for a reason, and finding the reason is the work. If the reason is temporary it is an opportunity; if it is structural it is a trap. The five ratios above are the instruments for telling them apart.</p>
</div>

<h2>When a ratio lies</h2>

${mount("rt-compare")}

<p>Three situations mislead, and all three are common. A one-off gain or loss distorts every ratio for that year. A change of sector makes the comparison meaningless. And a very small denominator makes a ratio unstable: with equity near zero, ROE looks enormous, and that is weakness rather than strength.</p>

<div class="ex">
<p><strong>One ratio, three years.</strong> A company's ROE was 14%, 19%, 26%. A splendid-looking trend. Now look at debt to equity: 0.4, 0.9, 1.8. The ROE did not rise because the business improved, it rose because debt grew relative to equity. Read one ratio alone and this is a success story; read two together and it is a story about risk.</p>
</div>

${mount("rt-quiz")}
`,
  blocks: {
    "rt-match": {
      kind: "match",
      title: { bn: "অনুপাত আর তার প্রশ্ন", en: "Ratio and its question" },
      note: { bn: "প্রতিটা অনুপাত একটা নির্দিষ্ট প্রশ্নের উত্তর। মেলান।", en: "Each ratio answers one specific question. Match them." },
      pairs: [
        { left: { bn: "নিট মুনাফার হার", en: "Net margin" }, right: { bn: "আয়ের কত অংশ শেষে থাকে", en: "How much of revenue survives to the end" } },
        { left: { bn: "ইকুইটির উপর রিটার্ন", en: "Return on equity" }, right: { bn: "মালিকদের টাকায় কত রিটার্ন", en: "What return the owners' money earns" } },
        { left: { bn: "চলতি অনুপাত", en: "Current ratio" }, right: { bn: "আগামী বছরের দায় মেটানো যাবে কি না", en: "Whether the coming year's bills can be paid" } },
        { left: { bn: "ঋণ ইকুইটি অনুপাত", en: "Debt to equity" }, right: { bn: "কোম্পানিটা কতটা ধারের উপর দাঁড়িয়ে", en: "How much of the company stands on borrowing" } },
        { left: { bn: "সুদ আবরণ", en: "Interest cover" }, right: { bn: "সুদটা দিতে পারছে কি না, আর কত ব্যবধানে", en: "Whether interest can be paid, and with how much room" } },
        { left: { bn: "পিই অনুপাত", en: "PE ratio" }, right: { bn: "আয়ের তুলনায় দামটা কেমন", en: "How the price compares with earnings" } },
      ],
    },
    "rt-lab": {
      kind: "lab",
      model: "roe",
      title: { bn: "আরওই কোথা থেকে আসে", en: "Where ROE comes from" },
      note: { bn: "ইকুইটি কমিয়ে দেখুন আরওই কীভাবে বাড়ে, ব্যবসার কিছু না বদলেই।", en: "Reduce equity and watch ROE rise without anything about the business changing." },
      preset: { sales: 500, profit: 40, assets: 700, equity: 250 },
    },
    "rt-lab2": {
      kind: "lab",
      model: "debt-cover",
      title: { bn: "সুদটা দিতে পারছে কি", en: "Can it pay the interest" },
      note: { bn: "সুদ খরচ বাড়িয়ে দেখুন কোন জায়গায় গিয়ে ব্যবধানটা শেষ হয়।", en: "Raise the interest bill and see where the margin of safety runs out." },
      preset: { operating: 90, interest: 30, debt: 400, equity: 350 },
    },
    "rt-compare": {
      kind: "compare",
      title: { bn: "একই অনুপাত, তিন খাত", en: "The same ratio, three sectors" },
      note: { bn: "কোনো অনুপাতের একটা সর্বজনীন আদর্শ মান নেই।", en: "No ratio has a universal correct level." },
      columns: [
        { bn: "ব্যাংক", en: "A bank" },
        { bn: "ওষুধ কোম্পানি", en: "A pharmaceutical company" },
        { bn: "বিদ্যুৎ কোম্পানি", en: "A power company" },
      ],
      rows: [
        {
          label: { bn: "ঋণ ইকুইটি", en: "Debt to equity" },
          cells: [
            { bn: "খুব উঁচু, আর সেটাই ব্যবসা", en: "Very high, and that is the business" },
            { bn: "কম হওয়াই স্বাভাবিক", en: "Normally low" },
            { bn: "উঁচু, কারণ প্রকল্প ঋণে চলে", en: "High, because projects run on debt" },
          ],
        },
        {
          label: { bn: "মোট মুনাফার হার", en: "Gross margin" },
          cells: [{ bn: "প্রযোজ্য নয়", en: "Not applicable" }, { bn: "উঁচু, ৪০% এর আশপাশে সম্ভব", en: "High, 40% or so is possible" }, { bn: "চুক্তির শর্তে বাঁধা", en: "Set by contract terms" }],
        },
        {
          label: { bn: "দাম ভাগ বইমূল্য", en: "Price to book" },
          cells: [{ bn: "খুব কাজের", en: "Very useful" }, { bn: "কম কাজের", en: "Less useful" }, { bn: "মোটামুটি কাজের", en: "Fairly useful" }],
          best: 0,
        },
        {
          label: { bn: "চলতি অনুপাত", en: "Current ratio" },
          cells: [
            { bn: "সাধারণ অর্থে প্রযোজ্য নয়", en: "Not applicable in the usual sense" },
            { bn: "১.৫ থেকে ৩ স্বাভাবিক", en: "1.5 to 3 is normal" },
            { bn: "প্রাপ্যের উপর নির্ভর করে", en: "Depends on receivables" },
          ],
        },
      ],
    },
    "rt-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "দুইটা কোম্পানির আরওই দুইটাই ২২%। প্রথমটার ঋণ ইকুইটি ০.২, দ্বিতীয়টার ২.১। কোনটা ভালো?",
            en: "Two companies both have an ROE of 22%. The first has debt to equity of 0.2, the second 2.1. Which is better?",
          },
          options: [
            {
              text: { bn: "প্রথমটা, কারণ একই রিটার্ন সে কম ঝুঁকিতে বানাচ্ছে", en: "The first, because it earns the same return with less risk" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই আরওই একা পড়ার বিপদ। একই ২২% এর একটা ব্যবসার শক্তি থেকে আসছে আর আরেকটা ধারের লিভার থেকে। খারাপ বছর এলে প্রথমটার সুদ কম, তাই ধাক্কা সামলানোর জায়গা আছে। দ্বিতীয়টার সুদ স্থির খরচ, আর মুনাফা কমলে সেটাই তাকে ডোবাবে।",
                en: "Right, and this is the danger of reading ROE alone. The same 22% comes from business strength in one case and from leverage in the other. In a bad year the first has a small interest bill and room to absorb the shock. For the second, interest is a fixed cost, and falling profit is what sinks it.",
              },
            },
            {
              text: { bn: "দুইটাই সমান, কারণ আরওই এক", en: "Equally good, since the ROE is the same" },
              why: {
                bn: "রিটার্ন এক আর ঝুঁকি আলাদা, আর বিনিয়োগে দুইটাই দেখতে হয়। একই রিটার্ন কম ঝুঁকিতে পাওয়া সবসময় ভালো, আর এটাই কার্যত একমাত্র বিনামূল্যের জিনিস বিনিয়োগে।",
                en: "The return is the same and the risk is not, and investing requires looking at both. The same return for less risk is always better, and it is effectively the only free thing in investing.",
              },
            },
            {
              text: { bn: "দ্বিতীয়টা, কারণ সে ধার কাজে লাগাতে পারছে", en: "The second, because it is putting borrowing to work" },
              why: {
                bn: "ধার ভালো সময়ে রিটার্ন বাড়ায় আর খারাপ সময়ে ক্ষতি বাড়ায়, সমানভাবে। প্রশ্নটা হলো একই রিটার্নের জন্য বাড়তি ঝুঁকিটা কী দিচ্ছে, আর উত্তর হলো কিছুই না, কারণ রিটার্ন দুইটার এক।",
                en: "Leverage magnifies returns in good times and losses in bad, symmetrically. The question is what the extra risk buys for the same return, and the answer is nothing, because the returns are equal.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানির সুদ আবরণ ১.৩। এর মানে কী?",
            en: "A company has interest cover of 1.3. What does that mean?",
          },
          options: [
            {
              text: { bn: "পরিচালন মুনাফার প্রায় পুরোটাই সুদে চলে যাচ্ছে", en: "Nearly all of operating profit is going out as interest" },
              right: true,
              why: {
                bn: "ঠিক। ১.৩ মানে সুদ দেওয়ার পরে পরিচালন মুনাফার প্রায় এক চতুর্থাংশ থাকে, আর তারপর কর আছে। কোনো ব্যবধান নেই: বিক্রি ১৫% কমলে বা সুদের হার সামান্য বাড়লে কোম্পানিটা সুদই দিতে পারবে না। এই অবস্থায় একটা খারাপ প্রান্তিক আর একটা সংকট প্রায় একই জিনিস।",
                en: "Right. 1.3 means about a quarter of operating profit survives the interest bill, and tax comes after that. There is no margin: a 15% fall in sales or a small rise in rates and the interest cannot be paid. In this condition a bad quarter and a crisis are nearly the same event.",
              },
            },
            {
              text: { bn: "কোম্পানিটা লাভজনক, তাই চিন্তার কিছু নেই", en: "The company is profitable, so there is nothing to worry about" },
              why: {
                bn: "লাভজনক থাকা আর নিরাপদ থাকা এক জিনিস নয়। এই কোম্পানিটা এই মুহূর্তে লাভজনক, আর তার লাভজনকতা পুরোপুরি নির্ভর করছে কিছু খারাপ না হওয়ার উপর। নিরাপত্তা মানে ভুল হওয়ার জায়গা থাকা।",
                en: "Being profitable and being safe are different things. This company is profitable right now, and its profitability depends entirely on nothing going wrong. Safety means having room to be wrong.",
              },
            },
            {
              text: { bn: "কোম্পানিটা সুদের ১.৩ গুণ আয় করছে বলে ঋণ কম", en: "It earns 1.3 times its interest, so it has little debt" },
              why: {
                bn: "সুদ আবরণ ঋণের পরিমাণ মাপে না, ঋণের বোঝা মাপে। কম ঋণেও উঁচু সুদের হারে আবরণ কম হতে পারে, আর বেশি ঋণেও খুব লাভজনক ব্যবসায় আবরণ ভালো হতে পারে। দুইটা আলাদা প্রশ্ন, আর দুইটাই দেখা দরকার।",
                en: "Interest cover measures the burden of debt rather than its size. Modest debt at a high rate can give thin cover, and large debt at a very profitable business can give good cover. Two separate questions, and both need looking at.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানির পিই ৬, যেখানে খাতের গড় ১৫। প্রথমে কী করবেন?",
            en: "A company trades on a PE of 6 while its sector averages 15. What do you do first?",
          },
          options: [
            {
              text: { bn: "বাকি পাঁচটা অনুপাত দেখি, বিশেষ করে ঋণ আর সুদ আবরণ", en: "Look at the other five ratios, especially debt and interest cover" },
              right: true,
              why: {
                bn: "ঠিক। খাতের গড়ের অর্ধেকেরও কম পিই একটা প্রশ্ন, আর প্রশ্নটা হলো বাজার কী জানে যা এই সংখ্যায় নেই। সবচেয়ে সাধারণ উত্তরগুলো: ঋণ বেশি, আয় পড়ছে, একটা এককালীন লাভ গত বছরের ইপিএস ফুলিয়েছে, বা শাসনব্যবস্থা নিয়ে সন্দেহ। পাঁচটা অনুপাত এই চারটার তিনটাই ধরে ফেলে।",
                en: "Right. A PE less than half the sector average is a question, and the question is what the market knows that this number does not carry. The commonest answers: heavy debt, falling earnings, a one-off gain inflating last year's EPS, or doubts about governance. The five ratios catch three of those four.",
              },
            },
            {
              text: { bn: "কিনে ফেলি, কারণ এটা স্পষ্টতই সস্তা", en: "Buy, because it is clearly cheap" },
              why: {
                bn: "কম পিই সস্তার প্রমাণ নয়, একটা প্রশ্ন। বাজার নিখুঁত নয়, আর বাজার এতটা ভুলও সাধারণত করে না। কারণটা না জেনে কেনা মানে বাজি ধরা যে কোনো কারণই নেই।",
                en: "A low PE is a question rather than evidence of cheapness. The market is not perfect, and it is not usually this wrong either. Buying without knowing the reason is betting that there is no reason.",
              },
            },
            {
              text: { bn: "এড়িয়ে যাই, কম পিই মানেই সমস্যা", en: "Avoid it; a low PE always means trouble" },
              why: {
                bn: "সবসময় নয়। কখনো কারণটা সাময়িক: একটা খারাপ বছর, একটা খাতের সাময়িক মন্দা, বা কেবল বাজারের অমনোযোগ। এই ক্ষেত্রেই সবচেয়ে ভালো সুযোগগুলো থাকে। কাজটা হলো কারণটা বের করা, আগেই সিদ্ধান্তে না পৌঁছানো।",
                en: "Not always. Sometimes the reason is temporary: a bad year, a passing sector downturn, or simple neglect. That is precisely where the best opportunities live. The job is to find the reason rather than to assume one.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"comparing-peers": {
  bn: `
<p>একটা সংখ্যা একা অর্থহীন। ১৮% আরওই ভালো না খারাপ, সেটা নির্ভর করে একই কাজ করা বাকি কোম্পানিগুলো কত পায় তার উপর। তুলনা ছাড়া বিশ্লেষণ হয় না, আর তুলনার একটা নিয়ম আছে: <strong>তুলনীয় জিনিসের সঙ্গে তুলনা করুন।</strong></p>

<p>এই লেখাটা দেখায় কীভাবে একটা তুলনাযোগ্য দল বানাতে হয়, কোন সংখ্যাগুলো পাশাপাশি বসাতে হয়, আর কোন তুলনাগুলো দেখতে যুক্তিসঙ্গত হলেও বিভ্রান্তিকর।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>তুলনার দল তিন থেকে পাঁচটা কোম্পানির, একই খাতের।</li>
<li>একই খাত মানে একই ক্রেতা আর একই চালিকাশক্তি, একই তালিকার নাম নয়।</li>
<li>অনুপাত তুলনা করুন, টাকার অঙ্ক নয়।</li>
<li>একই বছরের সংখ্যা মেলান, আর হিসাববছর আলাদা হলে সাবধান।</li>
<li>যেখানে একটা কোম্পানি আলাদা, সেখানেই আসল প্রশ্নটা আছে।</li>
</ul>
</div>

<h2>দলটা কীভাবে বানাবেন</h2>

<p>শুরু করুন <a class="term" href="/money/basics-2/sectors.html">খাতের</a> তালিকা থেকে, আর তারপর ছাঁকুন। দলে থাকা উচিত সেইসব কোম্পানি যারা একই ধরনের পণ্য একই ধরনের ক্রেতার কাছে বেচে, আর যাদের আয় একই জিনিসে বদলায়।</p>

<p>ডিএসইর খাত তালিকা একটা শুরু, আর এটা যথেষ্ট নয়। একই খাতে একটা কোম্পানি ওষুধ বানায় আর আরেকটা কেবল আমদানি করে বিক্রি করে; দুইটার মুনাফার হার আর ঝুঁকি সম্পূর্ণ আলাদা হবে। প্রশ্নটা তালিকা নয়: <strong>এদের আয় কি একই জিনিসে ওঠানামা করে?</strong></p>

${mount("cp-spot")}

<h2>কোন সংখ্যাগুলো পাশাপাশি</h2>

<p>একটা তুলনার ছক ছয় থেকে আটটা সারির বেশি হওয়ার দরকার নেই। যা থাকা উচিত: আয়ের বৃদ্ধি, মোট মুনাফার হার, পরিচালন মুনাফার হার, <a class="term" href="/money/terms/roe.html">আরওই</a>, ঋণ ইকুইটি, সুদ আবরণ, পরিচালন নগদ প্রবাহ ভাগ নিট মুনাফা, আর <a class="term" href="/money/terms/pe-ratio.html">পিই</a>।</p>

${mount("cp-lab")}

<p>যন্ত্রটাতে দুইটা কোম্পানির পিই আর আরওই বসিয়ে দেখুন। একটা কোম্পানির পিই বেশি হলেও যদি তার আরওই অনেক বেশি হয়, তাহলে বেশি দামটা যুক্তিসঙ্গত হতে পারে। প্রশ্নটা কখনো কেবল সস্তা কি না, প্রশ্নটা হলো যা পাচ্ছেন তার তুলনায় দামটা কেমন।</p>

<div class="note">
<p>হিসাববছরের তারিখ মিলিয়ে নিন। বাংলাদেশে কিছু কোম্পানির হিসাববছর জুন মাসে শেষ হয় আর কিছুর ডিসেম্বরে। জুনের সংখ্যার সঙ্গে ডিসেম্বরের সংখ্যা তুলনা করা মানে ছয় মাসের ভিন্ন পরিস্থিতি তুলনা করা, আর একটা টাকার বড় অবমূল্যায়ন বা একটা সুদের লাফ ঠিক ওই ছয় মাসে পড়তে পারে।</p>
</div>

<h2>যেখানে একটা কোম্পানি আলাদা</h2>

${mount("cp-compare")}

<p>ছকটা বানানোর পর সবচেয়ে দরকারি কাজটা হলো প্রতিটা সারিতে খোঁজা কোন কোম্পানিটা বাকিদের থেকে আলাদা, আর তারপর জিজ্ঞেস করা কেন।</p>

<p>উত্তর দুইটার একটা হবে। হয় কোম্পানিটার সত্যিই কিছু আলাদা আছে: একটা ব্র্যান্ড, একটা প্রযুক্তি, একটা অবস্থান, একটা খরচের সুবিধা। নয়তো সংখ্যাটা আলাদা কোনো হিসাবের কারণে: ভিন্ন অবচয় পদ্ধতি, ভিন্ন হিসাববছর, বা একটা এককালীন আইটেম। প্রথমটা বিনিয়োগের কারণ, দ্বিতীয়টা কেবল একটা ব্যাখ্যা।</p>

<div class="ex">
<p><strong>একটা ছক, একটা প্রশ্ন।</strong> চারটা সিমেন্ট কোম্পানির মোট মুনাফার হার: ২১%, ২৩%, ২২% আর ৩৪%। চতুর্থটা কেন আলাদা? সম্ভাব্য কারণ: নিজের চুনাপাথরের খনি আছে, বা নিজস্ব বিদ্যুৎ কেন্দ্র, বা কেবল সেই বছর একটা সম্পদ বিক্রির লাভ মোট মুনাফায় ঢুকেছে। প্রথম দুইটা টেকসই সুবিধা, তৃতীয়টা এক বছরের ঘটনা। বার্ষিক প্রতিবেদনের নোট বলে দেবে কোনটা।</p>
</div>

<h2>যেসব তুলনা বিভ্রান্ত করে</h2>

<p>তিনটা ফাঁদ। <strong>আকারের ফাঁদ</strong>: একটা ৫০০ কোটির কোম্পানি আর একটা ৫ কোটির কোম্পানির সরাসরি তুলনা প্রায়ই অর্থহীন, কারণ বড় কোম্পানির ক্রেতা, সরবরাহকারী আর ঋণের শর্ত আলাদা।</p>

<p><strong>ব্যবসার মডেলের ফাঁদ</strong>: একটা কোম্পানি নিজে উৎপাদন করে আর আরেকটা তৃতীয় পক্ষ দিয়ে করায়। দ্বিতীয়টার সম্পদ কম হবে, তাই তার আরওই বেশি দেখাবে, আর সেটা দক্ষতার প্রমাণ নয়।</p>

<p><strong>সময়ের ফাঁদ</strong>: একটা কোম্পানি সবেমাত্র একটা বড় কারখানা চালু করেছে, তাই তার এই বছরের মুনাফা কম আর সম্পদ বেশি। এক বছর পরে ছবিটা উল্টে যেতে পারে। এই কারণেই তিন বছরের গড় দিয়ে তুলনা করা এক বছরের চেয়ে ভালো।</p>

<h2>তুলনা থেকে সিদ্ধান্তে</h2>

<p>একটা ভালো তুলনার ছক আপনাকে কোন শেয়ার কিনতে হবে তা বলে না। এটা যা করে তা হলো প্রশ্নগুলো ধারালো করে দেওয়া। "এই কোম্পানিটা কি ভালো" প্রশ্নটা উত্তরহীন, আর "এর মুনাফার হার প্রতিযোগীদের চেয়ে ৮ পয়েন্ট বেশি কেন, আর সেটা কি টিকবে" প্রশ্নটার উত্তর খোঁজা যায়।</p>

<p>দ্বিতীয় প্রশ্নটার উত্তর প্রায়ই বার্ষিক প্রতিবেদনে আছে, আর সেখান থেকেই আপনার <a class="term" href="/money/basics-3/a-thesis.html">নিজের যুক্তিটা</a> তৈরি হয়।</p>

${mount("cp-quiz")}
`,
  en: `
<p>A number alone means nothing. Whether an 18% ROE is good depends on what everybody else doing the same work earns. There is no analysis without comparison, and comparison has one rule: <strong>compare like with like.</strong></p>

<p>This lesson shows how to build a comparable group, which numbers to line up, and which comparisons look reasonable and mislead.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A peer group is three to five companies in the same sector.</li>
<li>The same sector means the same customers and the same driver, not the same list.</li>
<li>Compare ratios, not amounts.</li>
<li>Match the years, and be careful when fiscal year-ends differ.</li>
<li>Where one company differs is where the real question sits.</li>
</ul>
</div>

<h2>Building the group</h2>

<p>Start from the <a class="term" href="/money/basics-2/sectors.html">sector</a> list and then filter. The group should hold companies selling similar products to similar customers, whose earnings move on the same things.</p>

<p>The DSE's sector list is a start and it is not enough. Within one sector, one company manufactures medicines and another only imports and distributes them; their margins and risks are entirely different. The question is not the list: <strong>do their earnings move on the same things?</strong></p>

${mount("cp-spot")}

<h2>Which numbers go side by side</h2>

<p>A comparison table needs no more than six to eight rows. What belongs in it: revenue growth, gross margin, operating margin, <a class="term" href="/money/terms/roe.html">ROE</a>, debt to equity, interest cover, operating cash flow over net profit, and <a class="term" href="/money/terms/pe-ratio.html">PE</a>.</p>

${mount("cp-lab")}

<p>Put two companies' PE and ROE into the tool. A company on a higher PE can still deserve it if its ROE is much higher. The question is never merely whether something is cheap, it is how the price compares with what you get.</p>

<div class="note">
<p>Check the fiscal year-ends. Some companies here close their year in June and others in December. Comparing a June figure with a December one compares six different months of conditions, and a large currency move or a jump in rates can fall precisely in those six.</p>
</div>

<h2>Where one company differs</h2>

${mount("cp-compare")}

<p>Once the table exists, the most useful work is finding, in each row, which company is unlike the rest, and then asking why.</p>

<p>The answer will be one of two things. Either the company genuinely has something different: a brand, a technology, a location, a cost advantage. Or the number differs for an accounting reason: a different depreciation method, a different year-end, or a one-off item. The first is a reason to invest; the second is only an explanation.</p>

<div class="ex">
<p><strong>One table, one question.</strong> Four cement companies with gross margins of 21%, 23%, 22% and 34%. Why is the fourth different? Possible reasons: it owns its own limestone quarry, or has its own power plant, or a gain on an asset sale entered gross profit that year. The first two are durable advantages, the third is a single year's event. The notes to the annual report will tell you which.</p>
</div>

<h2>Comparisons that mislead</h2>

<p>Three traps. <strong>The size trap</strong>: comparing a 5 billion company directly with a 50 million one is usually meaningless, because the larger one faces different customers, suppliers and lending terms.</p>

<p><strong>The business model trap</strong>: one company manufactures and another outsources. The second carries fewer assets, so its ROE looks higher, and that is not evidence of efficiency.</p>

<p><strong>The timing trap</strong>: a company has just commissioned a large plant, so this year its profit is low and its assets are high. A year later the picture may invert. Which is why a three-year average compares better than a single year.</p>

<h2>From comparison to decision</h2>

<p>A good comparison table does not tell you what to buy. What it does is sharpen the questions. "Is this a good company" has no answer; "why is its margin eight points above its competitors, and will that hold" can be researched.</p>

<p>The answer to the second is usually in the annual report, and it is where your own <a class="term" href="/money/basics-3/a-thesis.html">thesis</a> comes from.</p>

${mount("cp-quiz")}
`,
  blocks: {
    "cp-spot": {
      kind: "spot",
      title: { bn: "এই দলে কে থাকা উচিত নয়", en: "Who does not belong in this group" },
      note: { bn: "একটা ওষুধ কোম্পানির তুলনার দল। যেগুলো সত্যিই তুলনীয় নয় সেগুলোতে চাপুন।", en: "A peer group for a pharmaceutical company. Press the ones that are not really comparable." },
      source: { bn: "একজন পাঠকের বানানো তুলনার তালিকা", en: "A reader's peer list" },
      lines: [
        { text: { bn: "আরেকটি দেশীয় ওষুধ প্রস্তুতকারক, একই আকারের", en: "Another domestic drug manufacturer of similar size" } },
        {
          text: { bn: "একটি কোম্পানি যা ওষুধ আমদানি করে বিক্রি করে, নিজে বানায় না", en: "A company that imports and distributes medicines rather than making them" },
          flag: { bn: "একই খাতের তালিকায় আছে আর ব্যবসাটা আলাদা। উৎপাদকের কারখানা, গবেষণা আর নিয়ন্ত্রক ঝুঁকি আছে; পরিবেশকের নেই। মুনাফার হার আর সম্পদের গঠন দুইটাই তুলনাহীন।", en: "On the same sector list with a different business. A manufacturer carries plants, research and regulatory risk; a distributor does not. Margins and asset structure are both incomparable." },
        },
        { text: { bn: "একটি ওষুধ কোম্পানি যার রপ্তানি মোট বিক্রির ৩০%", en: "A drug company exporting 30% of its sales" } },
        {
          text: { bn: "একটি রাসায়নিক কোম্পানি যা ওষুধের কাঁচামাল বানায়", en: "A chemicals company making pharmaceutical raw materials" },
          flag: { bn: "এটা সরবরাহকারী, প্রতিযোগী নয়। এর আয় বাড়ে যখন ওষুধ কোম্পানির খরচ বাড়ে, তাই এরা পরস্পরের বিপরীতে দাঁড়ায়, পাশে নয়।", en: "This is a supplier, not a competitor. Its revenue rises when a drug company's costs rise, so they stand opposite each other rather than alongside." },
        },
        { text: { bn: "একটি দেশীয় ওষুধ প্রস্তুতকারক, আকারে অর্ধেক", en: "A domestic drug maker about half the size" } },
        {
          text: { bn: "একটি হাসপাতাল পরিচালনাকারী কোম্পানি", en: "A hospital operator" },
          flag: { bn: "স্বাস্থ্য খাত এক, ব্যবসা আলাদা। হাসপাতালের আয় আসে সেবা থেকে, আর তার সম্পদ ভবন আর সরঞ্জাম। ওষুধ কোম্পানির সঙ্গে এর একটা অনুপাতও তুলনীয় নয়।", en: "The same broad health sector and a different business. A hospital earns from services and its assets are buildings and equipment. Not one ratio is comparable with a drug maker's." },
        },
      ],
    },
    "cp-lab": {
      kind: "lab",
      model: "peers",
      title: { bn: "দুইটা কোম্পানি পাশাপাশি", en: "Two companies side by side" },
      note: { bn: "পিই আর আরওই দুইটাই বসান। বেশি দাম কখন যুক্তিসঙ্গত, সেটা দেখুন।", en: "Set both PE and ROE. See when a higher price is justified." },
      preset: { pe: 12, peerPe: 16, roe: 18, peerRoe: 12, eps: 5 },
    },
    "cp-compare": {
      kind: "compare",
      title: { bn: "চারটা কোম্পানি, একই খাত", en: "Four companies, one sector" },
      note: { bn: "প্রতিটা সারিতে খুঁজুন কে আলাদা, আর তারপর জিজ্ঞেস করুন কেন।", en: "In each row, find who differs, then ask why." },
      columns: [
        { bn: "ক", en: "A" },
        { bn: "খ", en: "B" },
        { bn: "গ", en: "C" },
        { bn: "ঘ", en: "D" },
      ],
      rows: [
        {
          label: { bn: "আয়ের বৃদ্ধি", en: "Revenue growth" },
          cells: [{ bn: "৯%", en: "9%" }, { bn: "৭%", en: "7%" }, { bn: "৮%", en: "8%" }, { bn: "২৪%", en: "24%" }],
          best: 3,
        },
        {
          label: { bn: "পরিচালন মুনাফার হার", en: "Operating margin" },
          cells: [{ bn: "১৪%", en: "14%" }, { bn: "১৩%", en: "13%" }, { bn: "১৫%", en: "15%" }, { bn: "৯%", en: "9%" }],
          best: 2,
        },
        {
          label: { bn: "আরওই", en: "ROE" },
          cells: [{ bn: "১৭%", en: "17%" }, { bn: "১৫%", en: "15%" }, { bn: "১৮%", en: "18%" }, { bn: "২৬%", en: "26%" }],
        },
        {
          label: { bn: "ঋণ ইকুইটি", en: "Debt to equity" },
          cells: [{ bn: "০.৪", en: "0.4" }, { bn: "০.৩", en: "0.3" }, { bn: "০.৫", en: "0.5" }, { bn: "১.৯", en: "1.9" }],
          best: 1,
        },
        {
          label: { bn: "নগদ প্রবাহ ভাগ মুনাফা", en: "Cash flow over profit" },
          cells: [{ bn: "১.১", en: "1.1" }, { bn: "১.০", en: "1.0" }, { bn: "১.২", en: "1.2" }, { bn: "০.৪", en: "0.4" }],
          best: 2,
        },
        {
          label: { bn: "পিই", en: "PE" },
          cells: [{ bn: "১৩", en: "13" }, { bn: "১২", en: "12" }, { bn: "১৪", en: "14" }, { bn: "১৯", en: "19" }],
        },
      ],
    },
    "cp-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "উপরের ছকে কোম্পানি ঘ-এর আয়ের বৃদ্ধি আর আরওই সবার চেয়ে বেশি, আর পিই-ও সবচেয়ে বেশি। এটা কি সবচেয়ে ভালো কোম্পানি?",
            en: "In the table above, company D has the highest revenue growth, the highest ROE and the highest PE. Is it the best company?",
          },
          options: [
            {
              text: { bn: "বলা যায় না, কারণ তার ঋণ চারগুণ বেশি আর নগদ প্রবাহ মুনাফার অর্ধেকেরও কম", en: "You cannot say, because its debt is four times higher and its cash flow is under half its profit" },
              right: true,
              why: {
                bn: "ঠিক, আর এখানেই ছকটার আসল মূল্য। ঘ-এর আরওই বেশি মূলত ঋণের কারণে, তার মুনাফার হার আসলে সবার চেয়ে কম, আর নগদ প্রবাহ ভাগ মুনাফা ০.৪ মানে বৃদ্ধিটা নগদে পৌঁছাচ্ছে না। দ্রুত বাড়ছে, ধার করে বাড়ছে, আর টাকাটা আসছে না। তিনটা মিলে এটা একটা সতর্কতার ছবি, সাফল্যের নয়।",
                en: "Right, and this is where the table earns its keep. D's higher ROE comes mostly from debt, its operating margin is actually the lowest of the four, and cash flow over profit of 0.4 means the growth is not reaching cash. Growing fast, growing on borrowing, and the money is not arriving. Together that is a caution rather than a success.",
              },
            },
            {
              text: { bn: "হ্যাঁ, বৃদ্ধি আর আরওই দুইটাই সবচেয়ে বেশি", en: "Yes, both growth and ROE are highest" },
              why: {
                bn: "দুইটা সেরা সংখ্যা দেখে সিদ্ধান্ত নেওয়া মানে ছকের বাকি চারটা সারি না পড়া। ছকটা এই কারণেই ছয় সারির: কোনো একটা সারি একা পুরো ছবিটা দেয় না, আর যে কোম্পানি এক সারিতে সেরা সে অন্য সারিতে সবচেয়ে খারাপ হতে পারে।",
                en: "Deciding from two best numbers means not reading the other four rows. The table has six rows for exactly this reason: no single row gives the whole picture, and the company best in one can be worst in another.",
              },
            },
            {
              text: { bn: "না, কারণ তার পিই সবচেয়ে বেশি", en: "No, because its PE is the highest" },
              why: {
                bn: "উঁচু পিই নিজে কোনো রায় নয়। দ্রুত বাড়া কোম্পানির পিই বেশি হওয়া স্বাভাবিক, আর সেটা যুক্তিসঙ্গতও হতে পারে। সমস্যাটা পিই নয়, সমস্যাটা হলো বৃদ্ধিটা ধারের উপর দাঁড়ানো আর নগদে পৌঁছাচ্ছে না।",
                en: "A high PE is not a verdict on its own. Faster-growing companies normally carry higher PEs, and that can be justified. The problem is not the PE, it is that the growth rests on debt and does not reach cash.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "দুইটা কোম্পানির হিসাববছর আলাদা: একটা জুনে শেষ, একটা ডিসেম্বরে। তুলনার সময় কী করবেন?",
            en: "Two companies have different year-ends, one in June and one in December. What do you do when comparing?",
          },
          options: [
            {
              text: { bn: "পার্থক্যটা মাথায় রেখে তুলনা করি, আর ওই ছয় মাসে বড় কিছু ঘটেছে কি না দেখি", en: "Compare with the difference in mind, and check what happened in those six months" },
              right: true,
              why: {
                bn: "ঠিক। তুলনাটা বাদ দেওয়ার দরকার নেই, কিন্তু সতর্ক থাকতে হবে। যদি ওই ছয় মাসে টাকার বড় অবমূল্যায়ন, সুদের লাফ বা কাঁচামালের দামে বড় পরিবর্তন হয়ে থাকে, তাহলে একটা কোম্পানির সংখ্যায় সেটা আছে আর অন্যটার নেই। প্রান্তিক ফলাফল ব্যবহার করে একই সময়ের তুলনাও বানানো যায়।",
                en: "Right. The comparison need not be abandoned, only handled carefully. If those six months contained a large currency move, a jump in rates or a shift in input prices, one company's numbers carry it and the other's do not. Quarterly results can also be used to build a like-for-like period.",
              },
            },
            {
              text: { bn: "কিছুই করি না, ছয় মাসে কিছু বদলায় না", en: "Nothing; six months changes little" },
              why: {
                bn: "ছয় মাসে অনেক কিছু বদলাতে পারে, আর বাংলাদেশে সাম্প্রতিক বছরগুলোতে বদলেছেও: বিনিময় হার, সুদের হার আর জ্বালানির দাম, তিনটাই ছয় মাসে উল্লেখযোগ্যভাবে সরেছে। যে কোম্পানির বছর ওই সময়টা ধরেছে তার সংখ্যা আলাদা দেখাবে, ব্যবসা এক থাকলেও।",
                en: "A great deal can change in six months, and in recent years here it has: the exchange rate, interest rates and fuel prices have all moved substantially within six. A company whose year caught that period shows different numbers even with an identical business.",
              },
            },
            {
              text: { bn: "তুলনাটা বাদ দিই, এটা অর্থহীন", en: "Abandon the comparison as meaningless" },
              why: {
                bn: "অতিরিক্ত কড়া। ভিন্ন হিসাববছর তুলনাটাকে কম নির্ভুল করে, অর্থহীন করে না, বিশেষ করে অনুপাতের ক্ষেত্রে। আর প্রান্তিক তথ্য দিয়ে একই সময়ের সংখ্যা বানিয়ে নেওয়া যায়, যা সামান্য কাজ আর অনেক বেশি নির্ভুল।",
                en: "Too strict. Different year-ends make a comparison less precise rather than meaningless, particularly for ratios. And quarterly data can be used to build matching periods, which is a little work and much more accurate.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"valuation-basics": {
  bn: `
<p>মূল্যায়ন হলো একটা প্রশ্নের উত্তর খোঁজা: <strong>এই ব্যবসাটা কত দামের যোগ্য?</strong> আর এই প্রশ্নের কোনো নির্ভুল উত্তর নেই, কখনো ছিল না। যা আছে তা হলো কয়েকটা পদ্ধতি, প্রতিটার নিজের অনুমান, আর একটা পরিসর যার ভেতরে উত্তরটা সম্ভবত আছে।</p>

<p>এই লেখাটা তিনটা পদ্ধতি শেখায়, সবচেয়ে সরল থেকে সবচেয়ে গভীর, আর সবচেয়ে গুরুত্বপূর্ণ শিক্ষাটা শেষে: একটা সংখ্যা নয়, একটা পরিসর।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>মূল্যায়ন নিখুঁত বিজ্ঞান নয়, এটা কাঠামোবদ্ধ অনুমান।</li>
<li>তিনটা পদ্ধতি: গুণিতক, লভ্যাংশ, আর ভবিষ্যৎ নগদের বর্তমান মূল্য।</li>
<li>প্রতিটা পদ্ধতিতে একটা অনুমান আছে, আর সেটাই ফলাফল ঠিক করে।</li>
<li>নিরাপত্তার ব্যবধান মানে হিসাবের চেয়ে কম দামে কেনা।</li>
<li>একটা সংখ্যা নয়, একটা পরিসর বের করুন, আর সংবেদনশীলতা দেখুন।</li>
</ul>
</div>

<h2>পদ্ধতি এক: গুণিতক</h2>

<p>সবচেয়ে সরল আর সবচেয়ে বেশি ব্যবহৃত। কোম্পানির প্রতি শেয়ার আয় ৫ টাকা, আর একই খাতের কোম্পানিগুলো ১৪ গুণে লেনদেন হয়, তাই ন্যায্য দাম প্রায় ৭০ টাকা।</p>

${mount("vb-lab")}

<p>এই পদ্ধতির শক্তি হলো সরলতা আর দ্রুততা। দুর্বলতা হলো এটা ধরে নেয় খাতের গুণিতকটা সঠিক, যা একটা <a class="term" href="/money/basics-2/market-cycles.html">বাবলে</a> ভুল, আর সেই ভুলটা আপনার হিসাবেও চলে আসে।</p>

<p>তবু এটা দিয়েই শুরু করা উচিত, দুইটা শর্তে। এক, গুণিতকটা তুলনীয় কোম্পানির হতে হবে, <a class="term" href="/money/basics-3/comparing-peers.html">যেভাবে আগের লেখায়</a> দেখা হয়েছে। দুই, যে কোম্পানি প্রতিযোগীদের চেয়ে ভালো, তার গুণিতক বেশি হওয়া যুক্তিসঙ্গত, আর কতটা বেশি সেটা লিখে রাখা দরকার।</p>

<h2>পদ্ধতি দুই: লভ্যাংশের ধারা</h2>

<p>একটা কোম্পানি যদি স্থিরভাবে লভ্যাংশ দেয় আর সেটা ধীরে বাড়ে, তাহলে শেয়ারটাকে একটা বাড়তে থাকা আয়ের ধারা হিসেবে দেখা যায়। এই পদ্ধতিটা পরিণত, স্থিতিশীল কোম্পানিতে ভালো কাজ করে।</p>

<p>যা দরকার তিনটা সংখ্যা: বর্তমান লভ্যাংশ, এর বৃদ্ধির হার, আর আপনার প্রত্যাশিত রিটার্ন। এই তিনটা থেকে একটা মূল্য বেরোয়, আর তিনটার মধ্যে দ্বিতীয়টাই সবচেয়ে অনিশ্চিত।</p>

<div class="note">
<p>এই পদ্ধতির একটা বিপদ আছে: বৃদ্ধির হার আপনার প্রত্যাশিত রিটার্নের কাছাকাছি হলে হিসাবটা বিস্ফোরিত হয়ে যায়, আর একটা অসম্ভব বড় সংখ্যা দেয়। বাস্তবে কোনো কোম্পানি চিরকাল অর্থনীতির চেয়ে দ্রুত বাড়তে পারে না, তাই বৃদ্ধির অনুমানটা রক্ষণশীল রাখা দরকার।</p>
</div>

<h2>পদ্ধতি তিন: ভবিষ্যতের নগদ, আজকের মূল্যে</h2>

${mount("vb-figure")}

<p>এটাই সবচেয়ে ভিত্তিমূলক ধারণা, আর বাকি দুইটা এর সরলীকৃত রূপ। একটা ব্যবসার মূল্য হলো ভবিষ্যতে সে যত নগদ তৈরি করবে তার যোগফল, আজকের টাকায় হিসাব করে।</p>

<p>আজকের টাকায় হিসাব করা মানে ছাড় দেওয়া: আগামী বছরের ১০০ টাকা আজকের ১০০ টাকার সমান নয়, কারণ আজকের ১০০ টাকা এক বছর খাটতে পারত। <a class="term" href="/money/terms/compounding.html">চক্রবৃদ্ধি</a> উল্টো দিকে চালালে এটাই ছাড়ের হিসাব।</p>

<p>পুরো গাণিতিক পদ্ধতিটা এই পর্যায়ের বাইরে, আর ধারণাটা নয়। ধারণাটা হলো: <strong>একটা কোম্পানির আজকের দাম তার ভবিষ্যতের নগদ সম্পর্কে বাজারের একটা বিবৃতি।</strong> আপনার কাজ হলো সেই বিবৃতিটা যুক্তিসঙ্গত কি না দেখা।</p>

${mount("vb-reveal")}

<h2>নিরাপত্তার ব্যবধান</h2>

<p>আপনার হিসাব বলছে ন্যায্য দাম ৭০ টাকা। শেয়ারটা ৬৮ টাকায় লেনদেন হচ্ছে। কেনা উচিত?</p>

<p>সম্ভবত না, আর কারণটা গুরুত্বপূর্ণ: আপনার হিসাবটা অনুমানের উপর দাঁড়ানো, আর অনুমান ভুল হয়। ২ টাকার ব্যবধান কোনো ভুলের জায়গা রাখে না। যদি ন্যায্য দাম ৭০ হয় আর শেয়ারটা ৪৮ এ থাকে, তখন আপনার হিসাব ৩০% ভুল হলেও আপনি হারাচ্ছেন না।</p>

<p>এই ব্যবধানটাই নিরাপত্তার ব্যবধান, আর এটা বিনিয়োগের সবচেয়ে ব্যবহারিক ধারণাগুলোর একটা। এটা বলে না যে আপনি ঠিক; এটা বলে যে আপনি ভুল হলেও বাঁচবেন।</p>

<div class="ex">
<p><strong>একটা পরিসর, একটা সংখ্যা নয়।</strong> রক্ষণশীল অনুমানে ন্যায্য দাম ৫২ টাকা। মাঝারি অনুমানে ৭০। আশাবাদী অনুমানে ৯৫। শেয়ারটা ৪৫ এ থাকলে তিনটা ধারণাতেই এটা সস্তা, আর সেটাই একটা ভালো সুযোগের চেহারা। ৮০ তে থাকলে কেবল আশাবাদী ধারণায় এটা কাজ করে, আর একটা ধারণার উপর টাকা রাখা বাজি।</p>
</div>

<h2>যা মূল্যায়ন করা যায় না</h2>

<p>সৎ থাকা দরকার: কিছু কোম্পানির যুক্তিসঙ্গত মূল্যায়ন করা যায় না, অন্তত এই পর্যায়ের যন্ত্র দিয়ে নয়। যে কোম্পানির আয় নেই, যার ব্যবসার মডেল এখনো প্রমাণিত নয়, বা যার হিসাব বোঝা যাচ্ছে না, সেগুলোর ক্ষেত্রে যেকোনো সংখ্যা একটা ভান।</p>

<p>এই স্বীকৃতিটা দুর্বলতা নয়, শক্তি। যা মাপা যায় না তার দাম বসানোর চেয়ে সেটা বাদ দেওয়া ভালো, আর বাজারে যথেষ্ট কোম্পানি আছে যেগুলো মাপা যায়।</p>

${mount("vb-quiz")}
`,
  en: `
<p>Valuation is the search for an answer to one question: <strong>what is this business worth?</strong> And there is no precise answer to it, and never was. What exists is a handful of methods, each with its own assumptions, and a range within which the answer probably lies.</p>

<p>This lesson teaches three methods, from simplest to deepest, and saves the most important lesson for the end: a range, not a number.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Valuation is not an exact science; it is structured guessing.</li>
<li>Three methods: multiples, dividends, and the present value of future cash.</li>
<li>Every method rests on an assumption, and that assumption decides the answer.</li>
<li>A margin of safety means buying below what your calculation says.</li>
<li>Produce a range rather than a number, and test its sensitivity.</li>
</ul>
</div>

<h2>Method one: multiples</h2>

<p>The simplest and most widely used. Earnings per share are 5, comparable companies trade at 14 times, so a fair price is around 70.</p>

${mount("vb-lab")}

<p>Its strength is simplicity and speed. Its weakness is that it assumes the sector's multiple is right, which in a <a class="term" href="/money/basics-2/market-cycles.html">bubble</a> it is not, and that error carries straight into your calculation.</p>

<p>It is still where to start, on two conditions. First, the multiple must come from genuinely comparable companies, as the <a class="term" href="/money/basics-3/comparing-peers.html">previous lesson</a> set out. Second, a company better than its peers deserves a higher multiple, and how much higher should be written down.</p>

<h2>Method two: the dividend stream</h2>

<p>If a company pays a steady dividend that grows slowly, the share can be treated as a growing stream of income. This method works well for mature, stable companies.</p>

<p>It needs three numbers: the current dividend, its growth rate, and the return you require. Those three produce a value, and the second is by far the most uncertain.</p>

<div class="note">
<p>One danger with this method: if the growth rate approaches your required return, the arithmetic explodes and produces an impossibly large number. In reality no company grows faster than the economy for ever, so the growth assumption has to stay conservative.</p>
</div>

<h2>Method three: future cash, in today's money</h2>

${mount("vb-figure")}

<p>This is the most fundamental idea, and the other two are simplified forms of it. A business is worth the sum of all the cash it will generate in future, counted in today's money.</p>

<p>Counting in today's money means discounting: 100 next year is not the same as 100 today, because today's 100 could have worked for a year. Run <a class="term" href="/money/terms/compounding.html">compounding</a> backwards and you have discounting.</p>

<p>The full arithmetic sits beyond this stage; the idea does not. The idea is this: <strong>a company's price today is the market's statement about its future cash.</strong> Your job is to decide whether that statement is reasonable.</p>

${mount("vb-reveal")}

<h2>The margin of safety</h2>

<p>Your calculation says the fair price is 70. The share trades at 68. Should you buy?</p>

<p>Probably not, and the reason matters: your calculation rests on assumptions, and assumptions are wrong. A gap of 2 leaves no room for error. If the fair value is 70 and the share is at 48, then even with your calculation 30% wrong you are not losing.</p>

<p>That gap is the margin of safety, and it is one of the most practical ideas in investing. It does not say you are right; it says you survive being wrong.</p>

<div class="ex">
<p><strong>A range, not a number.</strong> On conservative assumptions the fair value is 52. On middling ones, 70. On optimistic ones, 95. At 45 the share is cheap under all three, and that is what a good opportunity looks like. At 80 it works only under the optimistic case, and betting on one case is a bet.</p>
</div>

<h2>What cannot be valued</h2>

<p>Honesty is required here: some companies cannot be sensibly valued, at least not with the tools of this stage. A company with no earnings, an unproven business model, or accounts you cannot follow: any number you produce for those is a pretence.</p>

<p>Admitting that is a strength rather than a weakness. Better to skip what cannot be measured than to price it, and there are plenty of companies in the market that can be measured.</p>

${mount("vb-quiz")}
`,
  blocks: {
    "vb-lab": {
      kind: "lab",
      model: "pe",
      title: { bn: "গুণিতক দিয়ে একটা দাম", en: "A price from a multiple" },
      note: { bn: "ইপিএস আর বৃদ্ধির হার নাড়িয়ে দেখুন গুণিতকটা কীভাবে ন্যায্য দামে অনুবাদ হয়।", en: "Move EPS and the growth rate and watch a multiple translate into a fair price." },
      preset: { price: 60, eps: 5, growth: 12 },
    },
    "vb-figure": {
      kind: "figure",
      shape: "steps",
      title: { bn: "ভবিষ্যতের নগদ, আজকের মূল্যে", en: "Future cash, in today's money" },
      note: { bn: "চারটা ধাপ, আর প্রতিটাতে একটা অনুমান আছে।", en: "Four steps, each containing an assumption." },
      parts: [
        { text: { bn: "আগামী কয়েক বছরের নগদ আন্দাজ করুন", en: "Estimate the cash of the coming years" }, note: { bn: "অতীতের ধারা আর ব্যবসার বোঝাপড়া থেকে। এখানেই সবচেয়ে বড় অনুমান।", en: "From past trends and an understanding of the business. The largest assumption sits here." }, tone: "warn" },
        { text: { bn: "প্রতিটা বছরকে আজকের মূল্যে আনুন", en: "Bring each year back to today" }, note: { bn: "চক্রবৃদ্ধি উল্টো দিকে। যত দূরের বছর, তত কম মূল্য।", en: "Compounding in reverse. The further out the year, the less it is worth." } },
        { text: { bn: "যোগ করুন", en: "Add them up" }, note: { bn: "এটাই ব্যবসাটার মোট মূল্য, আপনার অনুমান অনুযায়ী।", en: "That is the whole business's value, under your assumptions." } },
        { text: { bn: "ঋণ বাদ দিয়ে শেয়ার সংখ্যায় ভাগ করুন", en: "Subtract debt and divide by the share count" }, note: { bn: "যা থাকে সেটাই প্রতি শেয়ারের মূল্য, আর সেটাই বাজারদরের সঙ্গে তুলনার সংখ্যা।", en: "What remains is value per share, the number to compare with the market price." }, tone: "good" },
      ],
      caption: {
        bn: "প্রথম ধাপটাই পুরো ফলাফল ঠিক করে দেয়, আর সেটাই সবচেয়ে অনিশ্চিত। এই কারণেই একটা সংখ্যার চেয়ে একটা পরিসর সৎ।",
        en: "The first step decides the whole result and is the most uncertain. Which is why a range is more honest than a number.",
      },
    },
    "vb-reveal": {
      kind: "reveal",
      title: { bn: "একটা প্রশ্ন", en: "One question" },
      ask: {
        bn: "একটা কোম্পানির শেয়ার ১২০ টাকা, আর প্রতি শেয়ার আয় ৪ টাকা। বাজার তাহলে কী বিবৃতি দিচ্ছে?",
        en: "A share trades at 120 with earnings per share of 4. What statement is the market making?",
      },
      choices: [
        { bn: "কোম্পানিটা ভালো, তাই দাম বেশি", en: "The company is good, so the price is high" },
        { bn: "বাজার আশা করছে আয় অনেক বাড়বে, নাহলে দামটা যুক্তিহীন", en: "The market expects earnings to grow a great deal, or the price makes no sense" },
        { bn: "শেয়ারটা অতিমূল্যায়িত", en: "The share is overvalued" },
      ],
      answer: {
        bn: "বাজার আশা করছে আয় অনেক বাড়বে। ৩০ গুণে লেনদেন হওয়া মানে আজকের আয়ে টাকা ফেরত পেতে ত্রিশ বছর, তাই দামটা যুক্তিসঙ্গত হতে হলে আয় দ্রুত বাড়তে হবে।",
        en: "The market expects earnings to grow substantially. Thirty times earnings means thirty years to get the money back at today's level, so for the price to make sense earnings have to grow fast.",
      },
      why: {
        bn: "এটাই মূল্যায়নের সবচেয়ে দরকারি অভ্যাস, আর এটা উল্টো দিক থেকে কাজ করে। একটা দাম দেখে জিজ্ঞেস করার বদলে এটা সস্তা না দামি, জিজ্ঞেস করুন এই দামটা সত্যি হতে হলে কী কী ঘটতে হবে। তারপর সেই তালিকাটা দেখুন আর নিজেকে জিজ্ঞেস করুন সেগুলো ঘটা কতটা সম্ভব। ৩০ গুণ যুক্তিসঙ্গত হতে পারে যদি কোম্পানিটা সত্যিই বছরে ২৫% করে বাড়ে; অসম্ভব যদি এটা একটা পরিণত ব্যবসা যার বৃদ্ধি ৫%। তৃতীয় উত্তরটা তাই তাড়াহুড়ো: অতিমূল্যায়িত কি না সেটা নির্ভর করে বৃদ্ধিটা বাস্তব কি না তার উপর, আর সেটা কোম্পানির হিসাব পড়ে বের করতে হয়।",
        en: "This is the most useful habit in valuation, and it works backwards. Instead of looking at a price and asking whether it is cheap or expensive, ask what would have to happen for this price to be right. Then look at that list and ask how likely those things are. Thirty times can be reasonable if the company really compounds at 25% a year; it is impossible if this is a mature business growing at 5%. The third answer is therefore premature: whether it is overvalued depends on whether the growth is real, and that is found in the accounts.",
      },
    },
    "vb-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার হিসাবে ন্যায্য দাম ৭০ টাকা। শেয়ারটা ৬৯ টাকা। কী করবেন?",
            en: "Your calculation says fair value is 70. The share is at 69. What do you do?",
          },
          options: [
            {
              text: { bn: "অপেক্ষা করি, কারণ ১ টাকার ব্যবধান কোনো ভুলের জায়গা রাখে না", en: "Wait, because a gap of 1 leaves no room for error" },
              right: true,
              why: {
                bn: "ঠিক। আপনার ৭০ সংখ্যাটা কয়েকটা অনুমানের ফল, আর অনুমান নিয়মিত ভুল হয়। বৃদ্ধির হারে ২ পয়েন্টের ভুল ন্যায্য দামকে ৭০ থেকে ৫৫ এ নামাতে পারে। নিরাপত্তার ব্যবধান এই ভুলগুলোর জন্যই, আর সেটা সাধারণত হিসাবের ৩০ থেকে ৪০ শতাংশ কম দাম।",
                en: "Right. Your 70 is the output of several assumptions, and assumptions are wrong regularly. A two-point error in the growth rate can take fair value from 70 to 55. The margin of safety exists for exactly those errors, and it usually means paying 30 to 40 percent below the calculation.",
              },
            },
            {
              text: { bn: "কিনি, কারণ এটা ন্যায্য দামের নিচে", en: "Buy, because it is below fair value" },
              why: {
                bn: "১ টাকা নিচে থাকা কার্যত ন্যায্য দামেই কেনা। এতে আপনার পুরো রিটার্ন নির্ভর করে আপনার অনুমানগুলো সঠিক হওয়ার উপর, আর এটাই সেই ঝুঁকি যা নিরাপত্তার ব্যবধান কমাতে আসে।",
                en: "One below fair value is effectively paying fair value. Your entire return then depends on your assumptions being right, and that is exactly the risk the margin of safety exists to reduce.",
              },
            },
            {
              text: { bn: "হিসাবটা আবার করি যতক্ষণ না সংখ্যাটা বেশি আসে", en: "Redo the calculation until the number comes out higher" },
              why: {
                bn: "এটা মজার শোনালেও বাস্তবে খুব সাধারণ, আর মূল্যায়নের সবচেয়ে বড় ফাঁদ। অনুমানগুলো এত নমনীয় যে যেকোনো কাঙ্ক্ষিত উত্তর বের করা যায়, তাই অনুমানগুলো আগে লিখে ফেলা দরকার, ফলাফল দেখার আগে।",
                en: "It sounds like a joke and is very common, and it is the biggest trap in valuation. The assumptions are pliable enough to produce any desired answer, which is why they should be written down before the result is seen.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানির কোনো মুনাফা নেই, ব্যবসার মডেল নতুন, আর হিসাব জটিল। মূল্যায়ন কীভাবে করবেন?",
            en: "A company has no profit, an untested model and complicated accounts. How do you value it?",
          },
          options: [
            {
              text: { bn: "মূল্যায়ন করব না, আর এই কোম্পানিটা বাদ দেব", en: "I would not value it, and I would skip this company" },
              right: true,
              why: {
                bn: "ঠিক, আর এটা কোনো পরাজয় নয়। বাজারে তিনশোর বেশি তালিকাভুক্ত কোম্পানি আছে আর তাদের বেশিরভাগেরই আয় আর হিসাব বোঝা যায়। যা মাপা যায় না তার একটা সংখ্যা বানানো মানে নিজেকে ধোঁকা দেওয়া, আর সেই সংখ্যাটা পরে সিদ্ধান্তে ব্যবহার হবে যেন সেটা জানা কিছু।",
                en: "Right, and it is not a defeat. There are over three hundred listed companies and most of them have earnings and accounts you can follow. Manufacturing a number for what cannot be measured is self-deception, and that number will later be used in a decision as though it were knowledge.",
              },
            },
            {
              text: { bn: "আয়ের গুণিতক ব্যবহার করব", en: "Use an earnings multiple" },
              why: {
                bn: "মুনাফা নেই, তাই ভাগফলের নিচের সংখ্যাটাই নেই। শূন্য বা ঋণাত্মক আয়ে পিই একটা অর্থহীন সংখ্যা, আর সেটাকে অর্থপূর্ণ দেখানোর জন্য যা করা হয় তা সবসময় একটা অনুমান।",
                en: "There is no profit, so there is no denominator. With zero or negative earnings a PE is a meaningless number, and whatever is done to make it look meaningful is always an assumption.",
              },
            },
            {
              text: { bn: "অন্যদের লক্ষ্য দাম দেখে সিদ্ধান্ত নেব", en: "Take a decision from other people's target prices" },
              why: {
                bn: "একটা লক্ষ্য দাম কারো একটা মূল্যায়নের ফল, আর সেই মূল্যায়নটাও একই সমস্যার মুখোমুখি: মুনাফা নেই আর মডেল প্রমাণিত নয়। অন্যের অনুমানের উপর টাকা রাখা নিজের অনুমানের চেয়ে খারাপ, কারণ আপনি তাদের অনুমানগুলো দেখতেও পাচ্ছেন না।",
                en: "A target price is the output of somebody's valuation, and that valuation faces the same problem: no profit and an unproven model. Resting money on someone else's assumptions is worse than resting it on your own, because you cannot even see theirs.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"red-flags": {
  bn: `
<p>এই লেখাটা আগের ছয়টার উল্টো দিক। সেগুলো শিখিয়েছে কীভাবে একটা কোম্পানি বুঝতে হয়; এটা শেখায় কখন হাত সরিয়ে নিতে হয়।</p>

<p>একটা কথা আগেই বলা দরকার: <strong>একটা বিপদের চিহ্ন প্রমাণ নয়, প্রশ্ন।</strong> প্রতিটার একটা নিরীহ ব্যাখ্যা থাকতে পারে, আর প্রায়ই থাকে। যা গুরুত্বপূর্ণ তা হলো চিহ্নগুলো একসঙ্গে দেখা দেওয়া, আর ব্যাখ্যাগুলো খুঁজে না পাওয়া।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>নগদ প্রবাহ আর মুনাফার দীর্ঘস্থায়ী ফাঁক সবচেয়ে বড় চিহ্ন।</li>
<li>নিরীক্ষক বদল বা নিরীক্ষকের শর্তযুক্ত মতামত থামার মতো ঘটনা।</li>
<li>সম্পর্কিত পক্ষের সঙ্গে বড় লেনদেন সবসময় পড়ার মতো।</li>
<li>পরিচালকদের একসঙ্গে শেয়ার বেচা একটা তথ্য।</li>
<li>একটা চিহ্ন প্রশ্ন; তিনটা একসঙ্গে একটা সিদ্ধান্ত।</li>
</ul>
</div>

<h2>সবচেয়ে বড় চিহ্ন: নগদ আর মুনাফার ফাঁক</h2>

<p><a class="term" href="/money/basics-3/cash-flow.html">নগদ প্রবাহের</a> লেখাটা এটা দেখিয়েছে আর এখানে এটা এক নম্বরে থাকার কারণ আছে: প্রায় প্রতিটা বড় হিসাব কেলেঙ্কারিতে এই চিহ্নটা আগে থেকে ছিল, বছরের পর বছর, আর যারা নগদ প্রবাহের বিবরণী পড়েছিলেন তারা আগে জানতেন।</p>

<p>ধরনটা সহজ: মুনাফা বাড়ছে, নগদ প্রবাহ বাড়ছে না বা ঋণাত্মক, আর পার্থক্যটা জমা হচ্ছে প্রাপ্য আর মজুদে। প্রতি বছর ব্যাখ্যা থাকে, আর প্রতি বছর ফাঁকটা বড় হয়।</p>

${mount("rf-timeline")}

<h2>নিরীক্ষক সংক্রান্ত চিহ্ন</h2>

<p>তিনটা, আর তিনটাই গুরুত্বপূর্ণ। <strong>শর্তযুক্ত মতামত</strong> মানে নিরীক্ষক কিছু একটা নিয়ে একমত হতে পারেননি। <strong>নিরীক্ষক পরিবর্তন</strong>, বিশেষ করে হঠাৎ বা মাঝপথে, একটা প্রশ্ন তোলে: কে কাকে ছাড়ল, আর কেন। <strong>চলমান প্রতিষ্ঠান নিয়ে সন্দেহ</strong> সবচেয়ে কড়া, আর এটা প্রায় কখনোই ভুল প্রমাণিত হয় না।</p>

<div class="note">
<p>নিরীক্ষক পরিবর্তন সবসময় খারাপ নয়: নিয়ম অনুযায়ী নির্দিষ্ট সময় পর পর বদলাতে হতে পারে, বা ফি নিয়ে মতভেদ হতে পারে। যা দেখার তা হলো সময়টা। বছরের মাঝখানে, বা একটা বিতর্কিত হিসাব প্রকাশের ঠিক আগে বা পরে বদল হলে সেটা প্রশ্নের মতো।</p>
</div>

<h2>স্থিতিপত্রের চিহ্ন</h2>

${mount("rf-bins")}

<p>স্থিতিপত্রে চিহ্নগুলো সংখ্যার আকারে নয়, ধারার আকারে আসে। প্রাপ্য বিক্রির চেয়ে দ্রুত বাড়া, মজুদ বিক্রির চেয়ে দ্রুত বাড়া, স্বল্পমেয়াদি ঋণ দ্রুত বাড়া, আর নগদ কমতে থাকা: প্রতিটাই কোম্পানির নগদের টান পড়ার লক্ষণ।</p>

<p>আরেকটা যা কম দেখা হয়: <strong>অন্যান্য প্রাপ্য</strong> বা <strong>অগ্রিম</strong> নামের বড় অঙ্ক। এই শিরোনামগুলো নির্দিষ্ট কিছু বলে না, আর সেটাই এদের বৈশিষ্ট্য। নোটে গিয়ে দেখুন এই টাকাটা কার কাছে গেছে, আর যদি নোটেও পরিষ্কার না হয়, সেটা নিজেই একটা উত্তর।</p>

<h2>শাসনব্যবস্থার চিহ্ন</h2>

<p><strong>সম্পর্কিত পক্ষের লেনদেন।</strong> কোম্পানি পরিচালকদের মালিকানাধীন অন্য প্রতিষ্ঠানের সঙ্গে ব্যবসা করছে: কিনছে, বেচছে, বা টাকা ধার দিচ্ছে। এটা বৈধ আর প্রকাশ করা বাধ্যতামূলক, আর এটাই সেই জায়গা যেখান দিয়ে সংখ্যালঘু শেয়ারহোল্ডারদের টাকা বেরিয়ে যেতে পারে। অঙ্কটা বড় হলে শর্তগুলো পড়ুন।</p>

<p><strong>পরিচালকদের শেয়ার বেচা।</strong> একজন পরিচালক ব্যক্তিগত কারণে শেয়ার বেচতে পারেন, আর সেটা স্বাভাবিক। কয়েকজন পরিচালক অল্প সময়ের মধ্যে বড় অংশ বেচলে সেটা আলাদা জিনিস। এই তথ্য ডিএসইর ঘোষণার পাতায় থাকে।</p>

<p><strong>ঘন ঘন পরিচালনায় পরিবর্তন।</strong> দুই বছরে তিনজন প্রধান আর্থিক কর্মকর্তা বদল হওয়া একটা তথ্য, কারণ আর্থিক কর্মকর্তারা হিসাব দেখেন।</p>

${mount("rf-spot")}

<h2>একটা চিহ্ন, নাকি তিনটা</h2>

<p>এটাই এই লেখার সবচেয়ে গুরুত্বপূর্ণ কথা। একটা চিহ্ন প্রায় সবসময় ব্যাখ্যাযোগ্য: প্রাপ্য বেড়েছে কারণ একটা বড় সরকারি ক্রেতা দেরি করছে; নিরীক্ষক বদল হয়েছে কারণ নিয়ম বলে; ঋণ বেড়েছে কারণ একটা নতুন কারখানা।</p>

<p>তিনটা একসঙ্গে দেখা দিলে ব্যাখ্যাগুলোর সম্ভাবনা দ্রুত কমতে থাকে। প্রাপ্য বেড়েছে, নিরীক্ষক বদল হয়েছে, আর পরিচালকরা শেয়ার বেচছেন: এই তিনটার একটা নিরীহ যৌথ ব্যাখ্যা খুঁজে পাওয়া কঠিন।</p>

<div class="ex">
<p><strong>যা প্রায় প্রতিটা ঘটনায় এক।</strong> বড় হিসাব কেলেঙ্কারিগুলোর ধরন আশ্চর্য রকম একঘেয়ে: প্রথমে নগদ আর মুনাফার ফাঁক, তারপর প্রাপ্য বা মজুদে অস্বাভাবিক বৃদ্ধি, তারপর ঋণ বাড়া, তারপর নিরীক্ষক নিয়ে জটিলতা, তারপর ঘোষণা। প্রতিটা ধাপ প্রকাশিত নথিতে ছিল, আর প্রায় কেউ পড়েনি।</p>
</div>

<h2>যা চিহ্ন নয়</h2>

<p>সমান গুরুত্বপূর্ণ। দাম পড়া বিপদের চিহ্ন নয়, একটা বছরে মুনাফা কমা নয়, লভ্যাংশ এক বছর না দেওয়া নয় যদি কারণটা বিনিয়োগ হয়, আর একটা প্রতিযোগীর আগমনও নয়।</p>

<p>এই তালিকাটা দরকার কারণ অতিরিক্ত সন্দেহ অতিরিক্ত বিশ্বাসের মতোই ব্যয়বহুল। যে বিনিয়োগকারী প্রতিটা খারাপ খবরে বেরিয়ে যান তিনি কখনো একটা ভালো ব্যবসার সঙ্গে দশ বছর থাকতে পারবেন না, আর <a class="term" href="/money/basics-2/why-hold.html">সেটাই</a> যেখানে বেশিরভাগ রিটার্ন আসে।</p>

${mount("rf-quiz")}
`,
  en: `
<p>This lesson is the other side of the six before it. They taught how to understand a company; this one teaches when to walk away.</p>

<p>One thing needs saying first: <strong>a red flag is a question rather than proof.</strong> Every one of them can have an innocent explanation, and often does. What matters is several appearing together, and the explanations not being found.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A persistent gap between cash flow and profit is the largest flag.</li>
<li>An auditor change or a qualified opinion is a stop-and-read event.</li>
<li>Large related party transactions are always worth reading.</li>
<li>Directors selling together is information.</li>
<li>One flag is a question; three together are a decision.</li>
</ul>
</div>

<h2>The biggest flag: the gap between cash and profit</h2>

<p>The lesson on <a class="term" href="/money/basics-3/cash-flow.html">cash flow</a> showed this, and it comes first here for a reason: nearly every large accounting scandal carried this flag in advance, for years, and anyone reading the cash flow statement knew early.</p>

<p>The pattern is simple: profit rises, cash flow does not rise or turns negative, and the difference accumulates in receivables and inventory. Every year there is an explanation, and every year the gap widens.</p>

${mount("rf-timeline")}

<h2>Auditor flags</h2>

<p>Three of them, all serious. A <strong>qualified opinion</strong> means the auditor could not agree about something. An <strong>auditor change</strong>, particularly a sudden or mid-term one, raises a question: who left whom, and why. A <strong>going concern doubt</strong> is the strongest of all, and it is almost never proved wrong.</p>

<div class="note">
<p>An auditor change is not always bad: rotation may be required by rule, or there may be a disagreement over fees. What to read is the timing. A change mid-year, or immediately before or after a contested set of accounts, is a question.</p>
</div>

<h2>Balance sheet flags</h2>

${mount("rf-bins")}

<p>Balance sheet flags come as trends rather than as levels. Receivables growing faster than sales, inventory growing faster than sales, short-term borrowings rising quickly, and cash falling: each is a sign that the company is short of money.</p>

<p>One more that is rarely examined: large amounts under headings like <strong>other receivables</strong> or <strong>advances</strong>. Those headings say nothing specific, which is their defining feature. Go to the note and see who the money went to, and if the note is not clear either, that is itself an answer.</p>

<h2>Governance flags</h2>

<p><strong>Related party transactions.</strong> The company doing business with other entities owned by its directors: buying, selling, or lending money. This is legal and must be disclosed, and it is the route through which minority shareholders' money can leave. Where the amounts are large, read the terms.</p>

<p><strong>Directors selling.</strong> A director can sell for personal reasons and that is ordinary. Several directors selling large stakes within a short period is a different thing. This appears on the DSE announcements page.</p>

<p><strong>Frequent management changes.</strong> Three chief financial officers in two years is information, because chief financial officers see the accounts.</p>

${mount("rf-spot")}

<h2>One flag, or three</h2>

<p>This is the most important point in the lesson. One flag is nearly always explicable: receivables rose because a large government customer is late; the auditor changed because rotation required it; borrowings rose to build a plant.</p>

<p>Three together and the space for explanations shrinks fast. Receivables rose, the auditor changed, and directors are selling: a single innocent explanation covering all three is hard to construct.</p>

<div class="ex">
<p><strong>What is the same in nearly every case.</strong> The pattern of large accounting failures is remarkably monotonous: first a gap between cash and profit, then an unusual rise in receivables or inventory, then rising debt, then trouble with the auditor, then the announcement. Every step was in the published documents, and almost nobody read them.</p>
</div>

<h2>What is not a flag</h2>

<p>Equally important. A falling price is not a red flag, nor is one year of lower profit, nor a year without a dividend if the reason is investment, nor the arrival of a competitor.</p>

<p>This list is needed because excessive suspicion costs as much as excessive trust. An investor who leaves on every piece of bad news will never spend ten years with a good business, and <a class="term" href="/money/basics-2/why-hold.html">that</a> is where most of the return comes from.</p>

${mount("rf-quiz")}
`,
  blocks: {
    "rf-timeline": {
      kind: "figure",
      shape: "timeline",
      title: { bn: "একটা কোম্পানির অবনতি, বছরে বছরে", en: "A company's decline, year by year" },
      note: { bn: "প্রতিটা ধাপ প্রকাশিত নথিতে ছিল, ঘোষণার অনেক আগে।", en: "Every step was in the published documents, long before the announcement." },
      parts: [
        { text: { bn: "বছর ১", en: "Year 1" }, note: { bn: "মুনাফা বাড়ছে, নগদ প্রবাহ প্রায় শূন্য। ব্যাখ্যা: একটা বড় প্রকল্পে মজুদ জমা।", en: "Profit rising, cash flow near zero. Explanation: inventory built for a large project." }, tone: "warn" },
        { text: { bn: "বছর ২", en: "Year 2" }, note: { bn: "প্রাপ্য বিক্রির দ্বিগুণ হারে বাড়ছে। ব্যাখ্যা: একটা সরকারি ক্রেতা দেরি করছে।", en: "Receivables growing at twice the rate of sales. Explanation: a government customer is late." }, tone: "warn" },
        { text: { bn: "বছর ৩", en: "Year 3" }, note: { bn: "স্বল্পমেয়াদি ঋণ দ্বিগুণ, নগদ প্রায় শেষ। ব্যাখ্যা: কার্যকরী মূলধনের প্রয়োজন।", en: "Short-term borrowings doubled, cash nearly gone. Explanation: working capital needs." }, tone: "bad" },
        { text: { bn: "বছর ৪", en: "Year 4" }, note: { bn: "নিরীক্ষক পরিবর্তন, আর দুইজন পরিচালক শেয়ার বেচলেন।", en: "The auditor changed and two directors sold shares." }, tone: "bad" },
        { text: { bn: "বছর ৫", en: "Year 5" }, note: { bn: "শর্তযুক্ত মতামত, প্রাপ্যের বড় অংশ অনাদায়ী হিসেবে বাদ, শেয়ার ৭০% পড়ল।", en: "A qualified opinion, a large write-off of receivables, the share down 70%." }, tone: "bad" },
      ],
      caption: {
        bn: "প্রতিটা বছরের ব্যাখ্যা আলাদাভাবে যুক্তিসঙ্গত ছিল। পাঁচটা একসঙ্গে পড়লে ব্যাখ্যাগুলোই গল্পটা।",
        en: "Each year's explanation was reasonable on its own. Read the five together and the explanations are the story.",
      },
    },
    "rf-bins": {
      kind: "bins",
      title: { bn: "চিহ্ন, নাকি স্বাভাবিক", en: "A flag, or ordinary" },
      note: { bn: "প্রতিটা পরিস্থিতিকে ঠিক বাক্সে ফেলুন। মনে রাখুন, চিহ্ন মানে প্রশ্ন, রায় নয়।", en: "Drop each into the right box. Remember a flag is a question rather than a verdict." },
      bins: [
        { id: "flag", label: { bn: "চিহ্ন, খতিয়ে দেখুন", en: "A flag, investigate" }, tone: "bad" },
        { id: "ok", label: { bn: "স্বাভাবিক", en: "Ordinary" }, tone: "plain" },
      ],
      items: [
        {
          text: { bn: "তিন বছর ধরে মুনাফা বাড়ছে আর পরিচালন নগদ প্রবাহ কমছে", en: "Three years of rising profit and falling operating cash flow" },
          bin: "flag",
          why: { bn: "সবচেয়ে বড় চিহ্ন। মুনাফাটা কোথায় যাচ্ছে সেটাই প্রশ্ন, আর উত্তরটা প্রায়ই প্রাপ্য বা মজুদে।", en: "The largest flag. Where the profit is going is the question, and the answer is usually receivables or inventory." },
        },
        {
          text: { bn: "এক বছরে মুনাফা ১৫% কমেছে, খাতের সবারই কমেছে", en: "Profit down 15% in a year, along with the whole sector" },
          bin: "ok",
          why: { bn: "খাতভিত্তিক মন্দা একটা চক্র, প্রতারণা নয়। প্রশ্নটা তখন কোম্পানিটা প্রতিযোগীদের চেয়ে কম হারিয়েছে কি না।", en: "A sector downturn is a cycle rather than a fraud. The question becomes whether it lost less than its competitors." },
        },
        {
          text: { bn: "কোম্পানি পরিচালকদের অন্য প্রতিষ্ঠানকে ১২০ কোটি টাকা অগ্রিম দিয়েছে", en: "The company advanced 1.2 billion to an entity owned by its directors" },
          bin: "flag",
          why: { bn: "সম্পর্কিত পক্ষের বড় লেনদেন। শর্ত কী, সুদ আছে কি না, ফেরত কবে, সব নোটে পড়া দরকার।", en: "A large related party transaction. What the terms are, whether there is interest, when it is repayable: read all of it in the notes." },
        },
        {
          text: { bn: "কোম্পানি এই বছর লভ্যাংশ দেয়নি, কারণ নতুন কারখানায় বিনিয়োগ", en: "No dividend this year because of investment in a new plant" },
          bin: "ok",
          why: { bn: "টাকাটা কোম্পানির ভেতরেই আছে আর একটা সম্পদে রূপান্তরিত হচ্ছে। নগদ প্রবাহের বিনিয়োগ অংশে এটা দেখা যাবে।", en: "The money stayed inside the company and turned into an asset. It shows in the investing section of cash flow." },
        },
        {
          text: { bn: "দুই বছরে তিনজন প্রধান আর্থিক কর্মকর্তা বদল হয়েছেন", en: "Three chief financial officers in two years" },
          bin: "flag",
          why: { bn: "আর্থিক কর্মকর্তারা হিসাব দেখেন, তাই তাদের বারবার চলে যাওয়া একটা তথ্য। কারণটা প্রকাশ্যে না থাকলে প্রশ্নটা বড় হয়।", en: "Chief financial officers see the accounts, so their repeated departure is information. When no reason is public the question grows." },
        },
        {
          text: { bn: "শেয়ারের দাম ছয় মাসে ৩০% পড়েছে", en: "The share price fell 30% in six months" },
          bin: "ok",
          why: { bn: "দাম পড়া একটা ফলাফল, কারণ নয়। কারণটা কোম্পানির হিসাবে বা বাজারে, আর দামের পতন নিজে কোনো চিহ্ন নয়।", en: "A falling price is a result rather than a cause. The cause is in the accounts or in the market, and the fall itself is not a flag." },
        },
      ],
    },
    "rf-spot": {
      kind: "spot",
      title: { bn: "একটা বার্ষিক প্রতিবেদন, ছয়টা লাইন", en: "One annual report, six lines" },
      note: { bn: "যেগুলোতে থেমে খতিয়ে দেখতে হবে সেগুলোতে চাপুন।", en: "Press the lines that should make you stop and investigate." },
      source: { bn: "একটা কাল্পনিক কোম্পানির প্রতিবেদন থেকে", en: "From an imaginary company's report" },
      lines: [
        {
          text: { bn: "নিরীক্ষক এ বছর পরিবর্তিত হয়েছে, আগের নিরীক্ষক মেয়াদ শেষের আগেই পদত্যাগ করেছেন।", en: "The auditor changed this year; the previous one resigned before the end of their term." },
          flag: { bn: "মেয়াদের আগে পদত্যাগ একটা নির্দিষ্ট ঘটনা, রুটিন পরিবর্তন নয়। কারণটা প্রতিবেদনে বা ঘোষণায় থাকার কথা, আর না থাকলে সেটাও একটা উত্তর।", en: "A resignation before the end of a term is a specific event rather than routine rotation. The reason should be in the report or a filing, and its absence is also an answer." },
        },
        {
          text: { bn: "আয় ১১% বেড়েছে, মূলত রপ্তানি বাজারে বিস্তারের কারণে।", en: "Revenue rose 11%, mainly from expansion in export markets." },
        },
        {
          text: { bn: "অন্যান্য প্রাপ্য বেড়ে ২৪০ কোটি টাকা হয়েছে, যা মোট সম্পদের ১৯%।", en: "Other receivables rose to 2.4 billion, 19% of total assets." },
          flag: { bn: "অন্যান্য প্রাপ্য কোনো নির্দিষ্ট কিছু বলে না, আর মোট সম্পদের ১৯% হওয়া মানে এটা আর অন্যান্য নয়। নোটে গিয়ে দেখুন টাকাটা কার কাছে।", en: "Other receivables names nothing specific, and at 19% of assets it is no longer other. Go to the note and see who holds the money." },
        },
        {
          text: { bn: "কোম্পানি বছরে ১৮% নগদ লভ্যাংশ ঘোষণা করেছে, যা গত পাঁচ বছরের ধারাবাহিকতা।", en: "The company declared an 18% cash dividend, in line with the last five years." },
        },
        {
          text: { bn: "পরিচালকদের চারজন গত ছয় মাসে তাদের মোট শেয়ারের ৩৫% বিক্রি করেছেন।", en: "Four directors sold 35% of their combined holdings in the past six months." },
          flag: { bn: "একজন পরিচালকের ব্যক্তিগত কারণ থাকতে পারে; চারজনের একসঙ্গে, ছয় মাসে, বড় অংশ, সেটা আলাদা জিনিস। ডিএসইর ঘোষণায় তারিখগুলো মিলিয়ে দেখুন।", en: "One director can have personal reasons; four together, within six months, selling a large share is a different matter. Check the dates on the DSE filings." },
        },
        {
          text: { bn: "মজুদ পণ্যের পরিমাণ ৬২% বেড়েছে, যেখানে বিক্রি বেড়েছে ১১%।", en: "Inventory rose 62% while sales rose 11%." },
          flag: { bn: "মজুদ বিক্রির ছয়গুণ হারে বাড়া মানে হয় পণ্য বিক্রি হচ্ছে না, নয়তো ভবিষ্যতের চাহিদার অনুমান অতিরঞ্জিত। দুইটাই পরের বছরের অবচয় বা লোকসান।", en: "Inventory growing six times faster than sales means either goods are not selling or demand was overestimated. Both become next year's write-down." },
        },
      ],
    },
    "rf-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একটা কোম্পানির প্রাপ্য হিসাব বিক্রির চেয়ে দ্রুত বেড়েছে, আর ব্যবস্থাপনা বলছে একটা বড় সরকারি ক্রেতা দেরি করছে। কী করবেন?",
            en: "Receivables grew faster than sales, and management says a large government customer is late. What do you do?",
          },
          options: [
            {
              text: { bn: "ব্যাখ্যাটা মেনে নিই আর পরের বছর একই জিনিস দেখি কি না দেখব", en: "Accept the explanation and check next year whether it repeats" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই একটা চিহ্ন সামলানোর সঠিক উপায়। ব্যাখ্যাটা যুক্তিসঙ্গত আর যাচাইযোগ্য: যদি সত্যি হয় তাহলে পরের বছর ওই টাকা আসবে আর প্রাপ্য কমবে। না কমলে ব্যাখ্যাটা ভুল ছিল, আর তখন আপনার হাতে একটা চিহ্ন নয়, দুইটা।",
                en: "Right, and that is how a single flag should be handled. The explanation is reasonable and testable: if true, the money arrives next year and receivables fall. If they do not, the explanation was wrong, and you now have two flags rather than one.",
              },
            },
            {
              text: { bn: "সঙ্গে সঙ্গে বেচে দিই", en: "Sell immediately" },
              why: {
                bn: "একটা চিহ্নে বেচা মানে বেশিরভাগ ভালো কোম্পানিও ছেড়ে দেওয়া, কারণ প্রতিটা কোম্পানির কোনো না কোনো বছর একটা অস্বাভাবিক সংখ্যা থাকে। অতিরিক্ত সন্দেহ অতিরিক্ত বিশ্বাসের মতোই ব্যয়বহুল।",
                en: "Selling on one flag means leaving most good companies too, because every company has an unusual number in some year. Excessive suspicion costs as much as excessive trust.",
              },
            },
            {
              text: { bn: "কিছুই করি না, ব্যবস্থাপনা তো ব্যাখ্যা দিয়েছে", en: "Do nothing; management gave an explanation" },
              why: {
                bn: "ব্যাখ্যা পাওয়া আর যাচাই করা এক জিনিস নয়। ব্যাখ্যাটা একটা ভবিষ্যদ্বাণী তৈরি করেছে, আর সেটা লিখে রাখা আর পরের বছর মেলানোই আসল কাজ। এই ধাপটা বাদ দিলে ব্যাখ্যা আর প্রমাণের পার্থক্য থাকে না।",
                en: "Receiving an explanation and testing it are different things. The explanation created a prediction, and writing it down and checking it next year is the work. Skip that and explanation and evidence become indistinguishable.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একই কোম্পানিতে তিনটা জিনিস একসঙ্গে: প্রাপ্য দ্রুত বাড়ছে, নিরীক্ষক পদত্যাগ করেছেন, আর দুইজন পরিচালক শেয়ার বেচেছেন। এখন?",
            en: "Three things at one company at once: receivables growing fast, the auditor resigned, and two directors sold shares. Now what?",
          },
          options: [
            {
              text: { bn: "এটা আর একটা প্রশ্ন নয়, এটা একটা সিদ্ধান্ত", en: "This is no longer a question, it is a decision" },
              right: true,
              why: {
                bn: "ঠিক। তিনটা স্বাধীন চিহ্নের একটা যৌথ নিরীহ ব্যাখ্যা থাকার সম্ভাবনা অনেক কম, আর যারা সবচেয়ে ভালো জানেন, নিরীক্ষক আর পরিচালকরা, তারাই সরে যাচ্ছেন। এখানে অপেক্ষা করার খরচ অসম: ভুল হলে আপনি একটা সুযোগ হারাবেন, আর ঠিক হলে আপনি মূলধন হারাবেন।",
                en: "Right. The chance of a single innocent explanation covering three independent flags is small, and the people who know best, the auditor and the directors, are the ones leaving. The cost of waiting here is asymmetric: being wrong costs you an opportunity, being right costs you capital.",
              },
            },
            {
              text: { bn: "প্রতিটার ব্যাখ্যা আছে, তাই ধরে রাখি", en: "Each has an explanation, so hold" },
              why: {
                bn: "প্রতিটার আলাদা ব্যাখ্যা থাকা আর তিনটার একটা ব্যাখ্যা থাকা এক জিনিস নয়। যখন প্রতিটা চিহ্নের জন্য একটা আলাদা ব্যাখ্যা লাগে, তখন ব্যাখ্যাগুলোর সংখ্যাই সবচেয়ে বড় চিহ্ন।",
                en: "Each having its own explanation is not the same as the three having one. When every flag needs a separate explanation, the number of explanations is itself the biggest flag.",
              },
            },
            {
              text: { bn: "দাম পড়া পর্যন্ত অপেক্ষা করি", en: "Wait until the price falls" },
              why: {
                bn: "দাম পড়ার জন্য অপেক্ষা করা মানে অন্যদের আগে বেরোনোর জন্য অপেক্ষা করা, আর এই ধরনের পরিস্থিতিতে দাম পড়ে দ্রুত আর গভীরভাবে। উপরন্তু তারল্য তখন শুকিয়ে যায়, তাই বেরোনো আরও কঠিন হয়।",
                en: "Waiting for the price to fall means waiting for others to leave first, and in situations like this prices fall fast and far. Liquidity dries up at the same time, which makes leaving harder still.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"a-thesis": {
  bn: `
<p>এতক্ষণ যা শিখলেন তার সব এক জায়গায় আসে এখানে। একটা থিসিস হলো আপনার নিজের যুক্তি, লেখা, কেন এই কোম্পানিতে আপনার টাকা থাকা উচিত। এটা এক পৃষ্ঠার বেশি হওয়ার দরকার নেই, আর এটা না থাকলে বাকি সব বিশ্লেষণ কেবল তথ্য সংগ্রহ।</p>

<p>কেন লেখা? কারণ মাথায় থাকা যুক্তি বদলে যায় দামের সঙ্গে। দাম বাড়লে যুক্তিটা শক্তিশালী মনে হয়, দাম পড়লে দুর্বল, আর দুইটাই ভুল, কারণ দাম আপনার যুক্তির অংশ ছিল না।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>একটা থিসিস পাঁচটা অংশে ধরে: ব্যবসা, কারণ, প্রমাণ, ঝুঁকি আর সীমা।</li>
<li>এক পৃষ্ঠার বেশি হলে সম্ভবত আপনি নিজেকে বোঝাচ্ছেন।</li>
<li>সবচেয়ে গুরুত্বপূর্ণ অংশ: কী ঘটলে আমি ভুল প্রমাণিত হব।</li>
<li>একটা থিসিস একটা তারিখ বহন করে, আর সেই তারিখে ফিরে পড়তে হয়।</li>
<li>যে থিসিস লেখা যায় না, সেই বিনিয়োগ করা যায় না।</li>
</ul>
</div>

<h2>পাঁচটা অংশ</h2>

${mount("th-steps")}

<p>ক্রমটা এলোমেলো নয়। ব্যবসা আগে, কারণ ব্যবসাটা না বুঝলে বাকি সব অনুমান। কারণ তারপর, কারণ এটাই আপনার দাবি। প্রমাণ তারপর, কারণ দাবির পেছনে সংখ্যা লাগে। ঝুঁকি চতুর্থ, কারণ প্রতিটা দাবির একটা বিপরীত দিক আছে। আর সীমা শেষে, কারণ সেটাই সিদ্ধান্তটাকে একটা আকার দেয়।</p>

<h2>ব্যবসা: তিন বাক্য</h2>

<p>কী বেচে, কে কেনে, আর টাকাটা কোথা থেকে আসে। <a class="term" href="/money/basics-2/when-to-buy.html">কেনার পাঁচটা প্রশ্নে</a> এটা দ্বিতীয় প্রশ্ন ছিল, আর এখানে এটা ভিত্তি।</p>

<p>একটা পরীক্ষা: বাক্যগুলোতে যদি "সমাধান", "প্ল্যাটফর্ম" বা "ইকোসিস্টেম" জাতীয় শব্দ থাকে আর কী বেচা হয় তা পরিষ্কার না হয়, তাহলে আপনি ব্যবসাটা বোঝেননি, কেবল কোম্পানির ভাষাটা মুখস্থ করেছেন।</p>

<h2>কারণ: এক বাক্য</h2>

<p>কেন এই কোম্পানিটা আগামী কয়েক বছরে আজকের চেয়ে বেশি মূল্যবান হবে? উত্তরটা এক বাক্যে ধরতে হবে, আর সেই বাক্যে দাম থাকতে পারবে না।</p>

<p>ভালো কারণের চেহারা: "খাতটা বাড়ছে আর এই কোম্পানির খরচ প্রতিযোগীদের চেয়ে কম, তাই বাজার বাড়লে এর মুনাফা অনুপাতে বেশি বাড়বে।" খারাপ কারণের চেহারা: "দাম অনেক পড়েছে আর এখন সস্তা।"</p>

<h2>প্রমাণ: তিনটা সংখ্যা</h2>

<p>আপনার কারণটা যদি সত্য হয়, তাহলে সেটা সংখ্যায় দেখা যাওয়ার কথা। খরচের সুবিধা মানে বেশি মুনাফার হার। বাজার নেওয়ার দাবি মানে খাতের চেয়ে দ্রুত আয় বৃদ্ধি। শক্ত আর্থিক অবস্থার দাবি মানে কম ঋণ আর ভালো সুদ আবরণ।</p>

<p>তিনটা সংখ্যা যথেষ্ট, আর তিনটাই আপনার কারণের সঙ্গে সরাসরি যুক্ত হতে হবে। যে সংখ্যা আপনার দাবির সঙ্গে যুক্ত নয় সেটা সাজসজ্জা।</p>

${mount("th-order")}

<h2>ঝুঁকি: কী ঘটলে আমি ভুল</h2>

<p>এই অংশটাই থিসিসের আসল মূল্য, আর এটাই সবচেয়ে বেশি বাদ পড়ে। দুই বা তিনটা নির্দিষ্ট, পর্যবেক্ষণযোগ্য ঘটনা লিখুন যেগুলো ঘটলে আপনার কারণটা আর সত্য থাকে না।</p>

<p>নির্দিষ্ট মানে মাপা যায়। "প্রতিযোগিতা বাড়লে" নির্দিষ্ট নয়। "মোট মুনাফার হার টানা দুই বছর ২৫% এর নিচে নামলে" নির্দিষ্ট, কারণ আপনি বার্ষিক প্রতিবেদন খুলে এটা যাচাই করতে পারবেন।</p>

<div class="note">
<p>এই অংশটা লেখা কঠিন লাগে, আর কঠিন লাগাটাই প্রমাণ যে এটা কাজ করছে। আপনি নিজেকে বাধ্য করছেন এমন একটা শর্ত লিখতে যা আপনাকে পরে বেচতে বাধ্য করবে, আর সেই মুহূর্তে আপনার মন সেটা লিখতে চাইবে না। সেটাই সঠিক সময়, কারণ পরে মনটা আরও কম রাজি হবে।</p>
</div>

<h2>সীমা: কত টাকা</h2>

<p>এই কোম্পানিতে সর্বোচ্চ কত টাকা রাখবেন, একটা সংখ্যা। <a class="term" href="/money/terms/diversification.html">বৈচিত্র্যের</a> নিয়ম অনুযায়ী এটা আপনার মোট বিনিয়োগের একটা নির্দিষ্ট শতাংশ, আর সেটা কেনার আগে ঠিক করা।</p>

<p>একটা অতিরিক্ত সুবিধা আছে এই ঘরটার: আপনার আত্মবিশ্বাস যত বেশি, সীমাটা তত বড় হওয়ার প্রলোভন হবে, আর সেটাই সেই মুহূর্ত যখন আপনার সবচেয়ে বেশি সতর্ক হওয়া দরকার। সবচেয়ে বড় ক্ষতিগুলো সেইসব বিনিয়োগে হয় যেগুলো নিয়ে মানুষ সবচেয়ে নিশ্চিত ছিলেন।</p>

${mount("th-drill")}

<h2>থিসিসটা কখন পড়বেন</h2>

<p>তিনটা সময়। প্রতি বছর, বার্ষিক প্রতিবেদন আসার পরে। যখন কোনো বড় খবর আসে। আর যখন আপনার বেচতে ইচ্ছা করে, বিশেষ করে তখন।</p>

<p>শেষেরটা সবচেয়ে গুরুত্বপূর্ণ। দাম ৩০% পড়েছে আর আপনার হাত কাঁপছে: এটাই সেই মুহূর্ত যার জন্য থিসিসটা লেখা হয়েছিল। খুলুন, পড়ুন, আর একটাই প্রশ্ন করুন: <strong>আমার লেখা ঝুঁকিগুলোর কোনোটা কি ঘটেছে?</strong> না হলে দাম পড়া আপনার সিদ্ধান্তের সঙ্গে সম্পর্কহীন।</p>

${mount("th-quiz")}
`,
  en: `
<p>Everything so far comes together here. A thesis is your own reasoning, written down, for why your money belongs in this company. It need not run past one page, and without it the rest of the analysis is only collecting facts.</p>

<p>Why written? Because reasoning held in the head moves with the price. When the price rises the argument feels strong and when it falls it feels weak, and both are wrong, because the price was never part of the argument.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A thesis fits in five parts: the business, the reason, the evidence, the risks and the limit.</li>
<li>Past one page you are probably persuading yourself.</li>
<li>The most important part: what would prove me wrong.</li>
<li>A thesis carries a date, and must be read again on that date.</li>
<li>An investment whose thesis cannot be written cannot be made.</li>
</ul>
</div>

<h2>The five parts</h2>

${mount("th-steps")}

<p>The order is not arbitrary. The business first, because without understanding it everything else is a guess. The reason next, because that is your claim. Evidence next, because a claim needs numbers behind it. Risks fourth, because every claim has an opposite side. And the limit last, because that is what gives the decision a shape.</p>

<h2>The business: three sentences</h2>

<p>What it sells, who buys it, where the money comes from. In the <a class="term" href="/money/basics-2/when-to-buy.html">five questions before buying</a> this was question two, and here it is the foundation.</p>

<p>A test: if the sentences contain words like "solution", "platform" or "ecosystem" and it is not clear what is sold, then you have not understood the business, you have memorised the company's own language.</p>

<h2>The reason: one sentence</h2>

<p>Why will this company be worth more in a few years than it is today? The answer has to fit in one sentence, and that sentence cannot contain a price.</p>

<p>A good reason looks like: "The sector is growing and this company's costs are below its competitors', so as the market grows its profit grows disproportionately." A bad one looks like: "The price has fallen a lot and it is cheap now."</p>

<h2>Evidence: three numbers</h2>

<p>If your reason is true it should be visible in numbers. A cost advantage means a higher margin. A claim about taking share means revenue growing faster than the sector. A claim about financial strength means low debt and good interest cover.</p>

<p>Three numbers are enough, and all three must connect directly to your reason. A number unconnected to your claim is decoration.</p>

${mount("th-order")}

<h2>Risks: what would prove me wrong</h2>

<p>This part is where the thesis earns its value, and it is the part most often left out. Write two or three specific, observable events that would make your reason untrue.</p>

<p>Specific means measurable. "If competition increases" is not specific. "If the gross margin stays below 25% for two consecutive years" is, because you can open an annual report and check it.</p>

<div class="note">
<p>This part feels hard to write, and the difficulty is the proof that it is working. You are forcing yourself to write a condition that will later force you to sell, and in that moment your mind does not want to write it. Which is exactly why now is the time, because later it will want to even less.</p>
</div>

<h2>The limit: how much money</h2>

<p>The maximum you will hold in this company, as a number. Under the rules of <a class="term" href="/money/terms/diversification.html">diversification</a> it is a fixed percentage of your total investments, decided before you buy.</p>

<p>This field has an extra benefit: the more confident you are, the greater the temptation to raise the limit, and that is precisely the moment to be most careful. The largest losses happen in the investments people were most certain about.</p>

${mount("th-drill")}

<h2>When to read the thesis</h2>

<p>Three occasions. Every year, when the annual report arrives. Whenever there is significant news. And whenever you feel like selling, especially then.</p>

<p>The last is the most important. The price is down 30% and your hand is shaking: this is the moment the thesis was written for. Open it, read it, and ask one question: <strong>has any of the risks I wrote down actually happened?</strong> If not, the falling price has nothing to do with your decision.</p>

${mount("th-quiz")}
`,
  blocks: {
    "th-steps": {
      kind: "figure",
      shape: "steps",
      title: { bn: "একটা থিসিসের পাঁচটা অংশ", en: "The five parts of a thesis" },
      note: { bn: "সব মিলিয়ে এক পৃষ্ঠা। বেশি হলে সম্ভবত আপনি নিজেকে বোঝাচ্ছেন।", en: "One page in total. More than that and you are probably persuading yourself." },
      parts: [
        { text: { bn: "ব্যবসা", en: "The business" }, note: { bn: "তিন বাক্য: কী বেচে, কে কেনে, টাকা কোথা থেকে আসে।", en: "Three sentences: what it sells, who buys, where the money comes from." } },
        { text: { bn: "কারণ", en: "The reason" }, note: { bn: "এক বাক্য, আর সেই বাক্যে দাম থাকতে পারবে না।", en: "One sentence, and it cannot contain a price." }, tone: "lead" },
        { text: { bn: "প্রমাণ", en: "The evidence" }, note: { bn: "তিনটা সংখ্যা, প্রতিটা কারণটার সঙ্গে সরাসরি যুক্ত।", en: "Three numbers, each connected directly to the reason." } },
        { text: { bn: "ঝুঁকি", en: "The risks" }, note: { bn: "দুই বা তিনটা মাপা যায় এমন ঘটনা যা আপনাকে ভুল প্রমাণ করবে।", en: "Two or three measurable events that would prove you wrong." }, tone: "warn" },
        { text: { bn: "সীমা", en: "The limit" }, note: { bn: "সর্বোচ্চ কত টাকা, শতাংশে, কেনার আগেই ঠিক করা।", en: "The maximum amount, as a percentage, fixed before buying." }, tone: "good" },
      ],
      caption: {
        bn: "চতুর্থ অংশটা লিখতে সবচেয়ে কষ্ট হয়, আর ওটাই একমাত্র অংশ যা পরে আপনাকে টাকা বাঁচিয়ে দেবে।",
        en: "The fourth is the hardest to write and the only one that will later save you money.",
      },
    },
    "th-order": {
      kind: "order",
      title: { bn: "একটা থিসিস লেখার ক্রম", en: "The order of writing a thesis" },
      note: { bn: "প্রতিটা ধাপ আগেরটার উপর দাঁড়ায়।", en: "Each step rests on the one before." },
      items: [
        {
          text: { bn: "কোম্পানিটা কী করে, তিন বাক্যে লিখুন", en: "Write what the company does in three sentences" },
          why: { bn: "লিখতে না পারলে এখানেই থামুন। বাকিটা তখন সাজানো অনুমান।", en: "If you cannot, stop here. The rest would be decorated guessing." },
        },
        {
          text: { bn: "এক বাক্যে লিখুন কেন এটা কয়েক বছরে বেশি মূল্যবান হবে", en: "Write one sentence on why it will be worth more in a few years" },
          why: { bn: "বাক্যটাতে দাম থাকলে সেটা কারণ নয়, একটা পর্যবেক্ষণ।", en: "If the sentence contains a price it is an observation rather than a reason." },
        },
        {
          text: { bn: "কারণটা সমর্থন করে এমন তিনটা সংখ্যা বের করুন", en: "Find three numbers that support the reason" },
          why: { bn: "সংখ্যাগুলো কারণটার সঙ্গে যুক্ত না হলে সেগুলো সাজসজ্জা।", en: "Numbers unconnected to the reason are decoration." },
        },
        {
          text: { bn: "দুই বা তিনটা ঘটনা লিখুন যা আপনাকে ভুল প্রমাণ করবে", en: "Write two or three events that would prove you wrong" },
          why: { bn: "প্রতিটা মাপা যায় এমন হতে হবে, যাতে বার্ষিক প্রতিবেদনে যাচাই করা যায়।", en: "Each must be measurable, so an annual report can check it." },
        },
        {
          text: { bn: "সর্বোচ্চ অঙ্কটা শতাংশে ঠিক করুন", en: "Set the maximum amount as a percentage" },
          why: { bn: "কেনার আগে, কারণ কেনার পরে এই সংখ্যাটা আবেগ ঠিক করে।", en: "Before buying, because afterwards this number gets set by feelings." },
        },
        {
          text: { bn: "তারিখ বসিয়ে সংরক্ষণ করুন, আর এক বছর পরের একটা মনে করানো রাখুন", en: "Date it, save it, and set a reminder a year out" },
          why: { bn: "তারিখ ছাড়া থিসিস পরে যাচাই করা যায় না।", en: "Without a date a thesis cannot be tested later." },
        },
      ],
    },
    "th-drill": {
      kind: "drill",
      title: { bn: "একটা থিসিস লিখুন", en: "Write one thesis" },
      note: { bn: "একটা কোম্পানি, এক পৃষ্ঠা, চল্লিশ মিনিট।", en: "One company, one page, forty minutes." },
      steps: [
        {
          text: { bn: "একটা কোম্পানি বাছুন যার শেষ বার্ষিক প্রতিবেদন আপনি পড়েছেন।", en: "Pick a company whose latest annual report you have read." },
          hint: { bn: "না পড়ে থাকলে আগে সেটা করুন, নাহলে থিসিসটা অনুমান হবে।", en: "If you have not, do that first, or the thesis will be guesswork." },
        },
        { text: { bn: "তিন বাক্যে ব্যবসাটা লিখুন, কোম্পানির ভাষা ব্যবহার না করে।", en: "Write the business in three sentences, without using the company's own language." } },
        { text: { bn: "এক বাক্যে কারণটা লিখুন, আর নিশ্চিত করুন তাতে দাম নেই।", en: "Write the reason in one sentence and make sure it contains no price." } },
        {
          text: { bn: "প্রতিবেদন থেকে তিনটা সংখ্যা বের করুন যা কারণটাকে সমর্থন করে।", en: "Pull three numbers from the report that support the reason." },
        },
        {
          text: { bn: "দুইটা মাপা যায় এমন ঘটনা লিখুন যা আপনাকে ভুল প্রমাণ করবে।", en: "Write two measurable events that would prove you wrong." },
          hint: { bn: "প্রতিটার সঙ্গে একটা সংখ্যা আর একটা সময়সীমা জুড়ুন।", en: "Attach a number and a time period to each." },
        },
        {
          text: { bn: "সর্বোচ্চ শতাংশটা লিখুন, তারিখ বসান, আর সংরক্ষণ করুন।", en: "Write the maximum percentage, date it and save it." },
        },
      ],
    },
    "th-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "কোন বাক্যটা একটা থিসিসের কারণ হিসেবে কাজ করবে?",
            en: "Which sentence works as the reason in a thesis?",
          },
          options: [
            {
              text: { bn: "দাম ৬০ থেকে ৩৮ এ নেমেছে, তাই এখন সস্তা", en: "The price fell from 60 to 38, so it is cheap now" },
              why: {
                bn: "এটা একটা পর্যবেক্ষণ, কারণ নয়। দাম পড়ার কারণটা কী, আর সেই কারণটা কি ব্যবসার স্থায়ী অবনতি নাকি সাময়িক কিছু, সেই প্রশ্নের উত্তর এতে নেই। আর সবচেয়ে বড় সমস্যা: এই বাক্যটা যাচাই করা যায় না।",
                en: "An observation rather than a reason. It says nothing about why the price fell, or whether that cause is a permanent deterioration or something temporary. And the deeper problem: this sentence cannot be tested.",
              },
            },
            {
              text: { bn: "কোম্পানিটার নিজস্ব বিদ্যুৎ কেন্দ্র আছে, তাই জ্বালানির দাম বাড়লেও এর খরচ প্রতিযোগীদের চেয়ে কম থাকে", en: "It owns its own power plant, so its costs stay below competitors' when fuel prices rise" },
              right: true,
              why: {
                bn: "ঠিক। এটা একটা নির্দিষ্ট দাবি, ব্যবসার কাঠামো নিয়ে, আর এটা যাচাইযোগ্য: মোট মুনাফার হার প্রতিযোগীদের চেয়ে বেশি হওয়ার কথা, আর জ্বালানির দাম বাড়ার বছরে ব্যবধানটা আরও বাড়ার কথা। দাবিটার সঙ্গে সংখ্যা জোড়া যায়, তাই এটা একটা থিসিস।",
                en: "Right. A specific claim about the structure of the business, and a testable one: the gross margin should be above competitors', and the gap should widen in a year when fuel prices rise. The claim can be attached to numbers, which makes it a thesis.",
              },
            },
            {
              text: { bn: "এটা একটা ভালো কোম্পানি আর ব্যবস্থাপনা দক্ষ", en: "It is a good company with capable management" },
              why: {
                bn: "সত্যি হতে পারে আর যাচাই করা যায় না। ভালো আর দক্ষ, দুইটাই মতামত, আর মতামত ভুল প্রমাণ করা যায় না। থিসিসের কারণটা এমন হতে হবে যা ভবিষ্যতে সত্য বা মিথ্যা প্রমাণিত হতে পারে।",
                en: "It may be true and it cannot be tested. Good and capable are both opinions, and opinions cannot be falsified. The reason in a thesis has to be something that the future can prove true or false.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "আপনার একটা শেয়ার ৩৫% পড়েছে আর আপনার বেচতে ইচ্ছা করছে। থিসিসটা খুলে কী দেখবেন?",
            en: "One of your shares is down 35% and you feel like selling. What do you check in the thesis?",
          },
          options: [
            {
              text: { bn: "আমার লেখা ঝুঁকিগুলোর কোনোটা ঘটেছে কি না", en: "Whether any of the risks I wrote down has happened" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই থিসিসের পুরো উদ্দেশ্য। ঘটে থাকলে বেচার কারণ আছে, আর সেটা প্রথম বৈধ কারণ: যুক্তিটা ভেঙে গেছে। না ঘটে থাকলে দামের পতনটা আপনার সিদ্ধান্তের সঙ্গে সম্পর্কহীন, আর আপনি যা অনুভব করছেন তা তথ্য নয়, অস্বস্তি।",
                en: "Right, and it is the whole purpose of the thesis. If one has, there is a reason to sell, and it is the first legitimate reason: the argument has broken. If none has, the fall is unrelated to your decision, and what you are feeling is discomfort rather than information.",
              },
            },
            {
              text: { bn: "আমার কেনার দামটা কত ছিল", en: "What I paid for it" },
              why: {
                bn: "আপনার কেনা দাম আজকের সিদ্ধান্তের সঙ্গে সম্পর্কহীন। বাজার জানে না আপনি কত দিয়েছিলেন, আর কোম্পানিটাও জানে না। প্রশ্নটা সবসময় একই: আজকের দামে এটা ধরে রাখার মতো কি না।",
                en: "What you paid has nothing to do with today's decision. The market does not know it and neither does the company. The question is always the same: is it worth holding at today's price.",
              },
            },
            {
              text: { bn: "অন্যরা কী বলছে", en: "What other people are saying" },
              why: {
                bn: "পতনের সময় অন্যরা যা বলেন তা প্রায় সবসময় দামের প্রতিধ্বনি, তথ্য নয়। থিসিসটা লেখা হয়েছিল ঠিক এই মুহূর্তের জন্য, যাতে আপনার সিদ্ধান্তের উৎস আপনার নিজের আগের চিন্তা হয়, ভিড়ের আজকের মেজাজ নয়।",
                en: "During a fall what others say is nearly always an echo of the price rather than information. The thesis was written for exactly this moment, so that the source of your decision is your own earlier thinking rather than the crowd's mood today.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"news-vs-rumour": {
  bn: `
<p>শেয়ারবাজারে তথ্য আর গুজবের মধ্যে সীমানাটা সবসময় স্পষ্ট নয়, আর সেটাই সবচেয়ে বড় সমস্যা। একটা গুজব সাধারণত মিথ্যা বলে ঘোষণা করে আসে না; এটা আসে একটা বিশ্বাসযোগ্য বাক্য হিসেবে, একজন বিশ্বাসযোগ্য মানুষের মুখে।</p>

<p>এই লেখাটা একটা যাচাইয়ের পদ্ধতি দেয়, চারটা প্রশ্নে। এটা আপনাকে বলবে না কোনটা সত্য, কিন্তু এটা বলবে কোনটার উপর টাকা রাখা যায়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>চারটা প্রশ্ন: উৎস কে, প্রমাণ কী, বলার কারণ কী, আর যাচাই করা যায় কি না।</li>
<li>একটা মূল্য সংবেদনশীল তথ্য প্রকাশিত হলে সেটা মিনিটেই দামে ঢোকে।</li>
<li>যে তথ্য যাচাই করা যায় না তার উপর টাকা রাখা বাজি।</li>
<li>গুজব ছড়ানোর একটা স্বার্থ থাকে, আর সেটা খোঁজা কঠিন নয়।</li>
<li>খবর সত্য হলেও দাম বাড়বে এমন নয়: প্রত্যাশা আগেই দামে থাকতে পারে।</li>
</ul>
</div>

<h2>চারটা প্রশ্ন</h2>

${mount("nr-flow")}

<p>প্রশ্নগুলো ক্রমানুসারে, আর প্রথমটাতেই বেশিরভাগ জিনিস ছাঁটা পড়ে। "আমার এক পরিচিত বলেছে" একটা উৎস নয়; "কোম্পানি ডিএসইতে ফাইল করেছে" একটা উৎস।</p>

<h2>প্রশ্ন দুই: প্রমাণ কী</h2>

<p>একটা দাবির পেছনে তিন ধরনের সমর্থন থাকতে পারে, আর তাদের ওজন সমান নয়। <strong>নথি</strong> সবচেয়ে ভারী: একটা ফাইলিং, একটা চুক্তির ঘোষণা, একটা নিরীক্ষিত হিসাব। <strong>পর্যবেক্ষণ</strong> মাঝারি: কারখানায় নতুন যন্ত্র বসছে, দোকানে পণ্যটা বেশি দেখা যাচ্ছে। <strong>কথা</strong> সবচেয়ে হালকা, আর বেশিরভাগ গুজব এই তৃতীয় শ্রেণির।</p>

<div class="note">
<p>একটা বিশেষ ধরনের দাবি নিয়ে সতর্ক থাকুন: "কোম্পানিটা একটা বড় চুক্তি পেতে যাচ্ছে" বা "আগামী প্রান্তিকে ফলাফল দুর্দান্ত আসবে"। এগুলো ভবিষ্যৎ নিয়ে, তাই আজ যাচাই করা যায় না, আর সেটাই এদের সবচেয়ে বড় বৈশিষ্ট্য। যে দাবি যাচাই করা যায় না, সেটা সত্য হলেও আপনার জন্য কাজে লাগে না।</p>
</div>

<h2>প্রশ্ন তিন: বলার কারণ কী</h2>

<p>এই প্রশ্নটা অস্বস্তিকর আর অপরিহার্য। যদি কারো কাছে সত্যিই এমন তথ্য থাকে যা দাম বাড়াবে, তার সবচেয়ে যুক্তিসঙ্গত আচরণ হলো চুপচাপ কেনা, বলে বেড়ানো নয়।</p>

<p>তাহলে কেন বলছেন? সম্ভাব্য উত্তর কয়েকটা, আর কোনোটাই আপনার পক্ষে নয়। তিনি ইতিমধ্যে কিনে রেখেছেন আর চান আপনি কিনে দাম তুলুন। তিনি একজন ব্রোকার আর আপনার লেনদেন থেকে কমিশন পান। অথবা, সবচেয়ে সাধারণ, তিনি নিজেই কারো কাছ থেকে শুনেছেন আর সততার সঙ্গে ছড়াচ্ছেন।</p>

${mount("nr-compare")}

<h2>প্রশ্ন চার: যাচাই করা যায়?</h2>

<p>শেষ ছাঁকনি, আর সবচেয়ে ব্যবহারিক। দাবিটা যদি সত্য হয়, তাহলে সেটা কোথাও দেখা যাওয়ার কথা: ডিএসইর ঘোষণায়, কোম্পানির সাইটে, একটা সরকারি প্রজ্ঞাপনে, বা রপ্তানির পরিসংখ্যানে।</p>

<p>যদি দেখা যায়, তাহলে এটা আর গুজব নয়, এটা একটা তথ্য, আর তখন পরের প্রশ্নটা আসে: এটা কি ইতিমধ্যে দামে আছে? যদি না দেখা যায়, তাহলে দুইটার একটা: হয় এটা এখনো অপ্রকাশিত, যার উপর লেনদেন করা <a class="term" href="/money/basics-2/bsec.html">অবৈধ</a>, নয়তো এটা সত্যি নয়।</p>

<p>এই দুইটা সম্ভাবনার কোনোটাই কেনার কারণ নয়, আর এই একটা যুক্তিই বেশিরভাগ গুজব থেকে দূরে থাকার জন্য যথেষ্ট।</p>

${mount("nr-spot")}

<h2>সত্য খবরেও দাম নাও বাড়তে পারে</h2>

<p>এটা প্রায়ই বিস্মিত করে। একটা কোম্পানি চমৎকার ফলাফল ঘোষণা করল, আর দাম পড়ে গেল। কারণটা <a class="term" href="/money/basics-2/news-and-price.html">খবর কীভাবে দামে ঢোকে</a> লেখায় আছে: বাজার আগেই আরও ভালো কিছু আশা করেছিল, আর আজকের দাম সেই প্রত্যাশার উপর দাঁড়ানো ছিল।</p>

<p>তাই একটা তথ্য যাচাই করার পরেও একটা প্রশ্ন বাকি থাকে: <strong>এটা কি বাজার ইতিমধ্যে জানে?</strong> যদি জানে, তাহলে দামে আছে, আর আপনার কেনার কোনো সুবিধা নেই।</p>

<h2>একটা ব্যবহারিক নিয়ম</h2>

<p>একটা গুজব শুনলে সেটা লিখে রাখুন, তারিখসহ, আর কিছু করবেন না। তিন মাস পরে দেখুন কী হয়েছে। ছয় মাস এভাবে চললে আপনার কাছে নিজের একটা তালিকা থাকবে, আর সেই তালিকাটা যেকোনো উপদেশের চেয়ে বেশি শেখাবে।</p>

<p>বেশিরভাগ মানুষ দেখেন যে তাদের শোনা গুজবগুলোর সামান্য অংশ সত্যি হয়েছে, আর যেগুলো হয়েছে সেগুলোতেও দাম আগেই নড়ে গিয়েছিল। এটা নিজের চোখে দেখা একটা যুক্তির চেয়ে অনেক বেশি কার্যকর।</p>

${mount("nr-quiz")}
`,
  en: `
<p>The line between information and rumour in a share market is rarely clear, and that is the difficulty. A rumour does not arrive announcing itself as false; it arrives as a plausible sentence, from a plausible person.</p>

<p>This lesson gives you a test in four questions. It will not tell you what is true, and it will tell you what can carry money.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Four questions: who is the source, what is the evidence, why are they telling you, and can it be verified.</li>
<li>Published price-sensitive information enters the price within minutes.</li>
<li>Putting money on something unverifiable is a bet.</li>
<li>Spreading a rumour serves an interest, and finding it is not hard.</li>
<li>True news does not guarantee a rising price: the expectation may already be there.</li>
</ul>
</div>

<h2>The four questions</h2>

${mount("nr-flow")}

<p>They are in sequence, and the first one removes most things. "Someone I know said" is not a source; "the company filed it with the exchange" is.</p>

<h2>Question two: what is the evidence</h2>

<p>Three kinds of support can sit behind a claim, and they do not weigh the same. <strong>Documents</strong> are heaviest: a filing, a contract announcement, audited accounts. <strong>Observation</strong> is middling: new machinery going into a plant, the product appearing more widely in shops. <strong>Talk</strong> is lightest, and most rumours belong to that third class.</p>

<div class="note">
<p>Be careful with one particular kind of claim: "the company is about to win a large contract" or "next quarter's results will be superb". These are about the future, so they cannot be checked today, and that is their defining feature. A claim that cannot be verified is of no use to you even when it turns out to be true.</p>
</div>

<h2>Question three: why are they telling you</h2>

<p>This question is uncomfortable and indispensable. If somebody genuinely holds information that will raise a price, the rational thing to do is buy quietly rather than talk about it.</p>

<p>So why the talking? A few possible answers, and none of them is in your favour. They already bought and want you to buy and lift the price. They are a broker earning commission on your trade. Or, most commonly, they heard it from somebody else and are honestly passing it on.</p>

${mount("nr-compare")}

<h2>Question four: can it be verified?</h2>

<p>The last filter, and the most practical. If the claim is true it should be visible somewhere: in a DSE announcement, on the company's website, in a government notification, in export statistics.</p>

<p>If it is visible, it is no longer a rumour, it is information, and the next question arrives: is it already in the price? If it is not visible, then one of two things is true: either it is unpublished, in which case trading on it is <a class="term" href="/money/basics-2/bsec.html">illegal</a>, or it is not true.</p>

<p>Neither possibility is a reason to buy, and that single argument is enough to stay away from most rumours.</p>

${mount("nr-spot")}

<h2>True news does not always lift a price</h2>

<p>This surprises people regularly. A company announces excellent results and the price falls. The reason is in the lesson on <a class="term" href="/money/basics-2/news-and-price.html">how news enters a price</a>: the market expected something even better, and today's price already stood on that expectation.</p>

<p>So even after verifying a piece of information, one question remains: <strong>does the market already know?</strong> If it does, it is in the price, and buying gives you no advantage.</p>

<h2>A practical rule</h2>

<p>When you hear a rumour, write it down with the date, and do nothing. Look three months later at what happened. Six months of this gives you your own list, and that list will teach you more than any advice.</p>

<p>Most people find that a small fraction of what they heard turned out to be true, and that even in those cases the price had already moved. Seeing that yourself is far more effective than being told.</p>

${mount("nr-quiz")}
`,
  blocks: {
    "nr-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "একটা দাবি যাচাইয়ের চারটা ধাপ", en: "Four steps for testing a claim" },
      note: { bn: "কোনো ধাপে আটকে গেলে সেখানেই থামুন।", en: "If it fails at a step, stop there." },
      parts: [
        { text: { bn: "উৎস কে", en: "Who is the source" }, note: { bn: "একটা নথি, নাকি একজন মানুষ যিনি অন্য একজনের কাছে শুনেছেন", en: "A document, or a person who heard it from another person" }, tone: "lead" },
        { text: { bn: "প্রমাণ কী", en: "What is the evidence" }, note: { bn: "নথি ভারী, পর্যবেক্ষণ মাঝারি, কথা হালকা", en: "Documents are heavy, observation middling, talk light" } },
        { text: { bn: "বলার কারণ কী", en: "Why are they telling you" }, note: { bn: "সত্যিকারের গোপন তথ্য থাকলে মানুষ কেনে, বলে না", en: "Anyone with genuine private information buys rather than talks" }, tone: "warn" },
        { text: { bn: "যাচাই করা যায়?", en: "Can it be verified" }, note: { bn: "না গেলে হয় অপ্রকাশিত, যা অবৈধ, নয়তো সত্য নয়", en: "If not, it is either unpublished, which is illegal, or untrue" }, tone: "bad" },
      ],
      caption: {
        bn: "চারটা পার হলে এটা আর গুজব নয়, একটা তথ্য। তখন পরের প্রশ্নটা: এটা কি ইতিমধ্যে দামে আছে?",
        en: "Past all four it is no longer a rumour but a fact. Then the next question: is it already in the price?",
      },
    },
    "nr-compare": {
      kind: "compare",
      title: { bn: "খবর আর গুজব", en: "News and rumour" },
      columns: [
        { bn: "খবর", en: "News" },
        { bn: "গুজব", en: "Rumour" },
      ],
      rows: [
        {
          label: { bn: "উৎস", en: "Source" },
          cells: [{ bn: "নাম ধরে বলা যায়, আর খুঁজে পাওয়া যায়", en: "Can be named and found" }, { bn: "কেউ একজন, প্রায়ই কয়েক হাত ঘুরে", en: "Somebody, usually several hands away" }],
          best: 0,
        },
        {
          label: { bn: "যাচাই", en: "Verification" },
          cells: [{ bn: "মূল নথিতে মিলিয়ে নেওয়া যায়", en: "Checkable against an original document" }, { bn: "যায় না, আর সেটাই এর বৈশিষ্ট্য", en: "Cannot be, and that is its defining feature" }],
          best: 0,
        },
        {
          label: { bn: "সময়", en: "Timing" },
          cells: [{ bn: "সবাই একসঙ্গে জানে", en: "Everybody learns at once" }, { bn: "কেউ আগে, কেউ পরে, কেউ কখনো নয়", en: "Some early, some late, some never" }],
        },
        {
          label: { bn: "দামে প্রভাব", en: "Effect on price" },
          cells: [{ bn: "মিনিটে ঢুকে যায়", en: "Enters within minutes" }, { bn: "নড়াচড়া হয়, তারপর প্রায়ই ফিরে যায়", en: "Moves, and often moves back" }],
        },
        {
          label: { bn: "আপনার সুবিধা", en: "Your advantage" },
          cells: [
            { bn: "নেই, কিন্তু ব্যবসা বোঝার কাজে লাগে", en: "None, and it helps you understand the business" },
            { bn: "নেই, আর ঝুঁকি আছে", en: "None, and it carries risk" },
          ],
          best: 0,
        },
      ],
    },
    "nr-spot": {
      kind: "spot",
      title: { bn: "একটা গ্রুপের একদিনের বার্তা", en: "One day of messages in a group" },
      note: { bn: "যেগুলো যাচাই করা যায় সেগুলো ছাড়া বাকিগুলোতে চাপুন।", en: "Press everything that cannot be verified." },
      source: { bn: "একটা কাল্পনিক মেসেজিং গ্রুপ", en: "An imaginary messaging group" },
      lines: [
        {
          text: { bn: "এক্স কোম্পানি আজ ডিএসইতে ১৫% নগদ লভ্যাংশের ঘোষণা দিয়েছে।", en: "Company X filed a 15% cash dividend with the exchange today." },
        },
        {
          text: { bn: "শুনলাম ওয়াই কোম্পানি একটা বিশাল রপ্তানি অর্ডার পেতে যাচ্ছে, ভেতরের খবর।", en: "I hear company Y is about to land a huge export order, from the inside." },
          flag: { bn: "ভবিষ্যৎ নিয়ে দাবি, উৎস নেই, যাচাই করা যায় না। আর যদি সত্যিই ভেতরের অপ্রকাশিত খবর হয়, তাহলে এর উপর লেনদেন করা অবৈধ। দুই দিক থেকেই এটা বাদ।", en: "A claim about the future with no source and no way to check it. And if it really is unpublished inside information, trading on it is illegal. It fails from both directions." },
        },
        {
          text: { bn: "জেড কোম্পানির প্রান্তিক প্রতিবেদন কাল প্রকাশিত হয়েছে, ইপিএস ২.১০।", en: "Company Z published its quarterly report yesterday; EPS is 2.10." },
        },
        {
          text: { bn: "বড় প্রতিষ্ঠানগুলো নাকি এই সপ্তাহে কিনছে, তাই দাম বাড়বে।", en: "The institutions are apparently buying this week, so the price will rise." },
          flag: { bn: "কারা কিনছে সেটা যাচাইযোগ্য নয়, আর যদি হতোও, কেউ কিনছে বলে দাম বাড়বে এটা একটা ভবিষ্যদ্বাণী। এখানে দুইটা অপ্রমাণিত দাবি একটার উপর আরেকটা বসানো।", en: "Who is buying cannot be checked, and even if it could, that a price will rise because somebody is buying is a prediction. Two unproven claims stacked on each other." },
        },
        {
          text: { bn: "বাংলাদেশ ব্যাংক গতকাল নীতি সুদের হার ৫০ বেসিস পয়েন্ট বাড়িয়েছে।", en: "Bangladesh Bank raised the policy rate by 50 basis points yesterday." },
        },
        {
          text: { bn: "একজন পরিচালক নাকি বলেছেন এই বছর বোনাস শেয়ার আসবে, তবে এখনো ঘোষণা হয়নি।", en: "A director apparently said bonus shares are coming this year, though nothing is announced." },
          flag: { bn: "অপ্রকাশিত মূল্য সংবেদনশীল তথ্য, দ্বিতীয় হাতে পাওয়া। সত্য হলে এর উপর লেনদেন অবৈধ; মিথ্যা হলে টাকাটা যাবে। আর বোনাস শেয়ার নিজে কোনো মূল্য তৈরিও করে না, কেবল একই পাইকে বেশি টুকরো করে।", en: "Unpublished price-sensitive information at second hand. If true, trading on it is illegal; if false, the money goes. And bonus shares create no value anyway, they only cut the same pie into more slices." },
        },
      ],
    },
    "nr-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "একজন পরিচিত বললেন তার কাছে একটা কোম্পানির ভেতরের খবর আছে যা এখনো প্রকাশিত হয়নি। সবচেয়ে ভালো প্রতিক্রিয়া কী?",
            en: "An acquaintance says they have unpublished inside information about a company. What is the best response?",
          },
          options: [
            {
              text: { bn: "কিছু করি না, আর ঘোষণা হলে নিজের বিশ্লেষণে সিদ্ধান্ত নিই", en: "Do nothing, and decide on my own analysis when it is announced" },
              right: true,
              why: {
                bn: "ঠিক, আর তিনটা কারণে। এক, অপ্রকাশিত মূল্য সংবেদনশীল তথ্যের উপর লেনদেন অবৈধ। দুই, এই ধরনের বেশিরভাগ তথ্য ভুল বা অতিরঞ্জিত, কারণ সেটা কয়েক হাত ঘুরে এসেছে। তিন, যিনি সত্যিই জানেন তিনি সাধারণত বলেন না, তাই বলা হচ্ছে এটাই একটা সংকেত।",
                en: "Right, for three reasons. One, trading on unpublished price-sensitive information is illegal. Two, most such information is wrong or exaggerated, because it has passed through several hands. Three, someone who genuinely knows usually does not talk, so the telling is itself a signal.",
              },
            },
            {
              text: { bn: "ছোট অঙ্কে কিনে দেখি, ঝুঁকি কম", en: "Try a small amount; the risk is small" },
              why: {
                bn: "অঙ্ক ছোট হলেও কাজটা একই, আর আইনি প্রশ্নটা অঙ্কের উপর নির্ভর করে না। ব্যবহারিক দিক থেকেও এটা একটা অভ্যাস তৈরি করে, আর অভ্যাসটা একদিন বড় অঙ্কে প্রয়োগ হবে।",
                en: "A small amount does not change what the act is, and the legal question does not depend on the size. Practically it also builds a habit, and one day the habit gets applied to a large amount.",
              },
            },
            {
              text: { bn: "তাকে জিজ্ঞেস করি তিনি নিজে কিনেছেন কি না", en: "Ask whether they have bought it themselves" },
              why: {
                bn: "প্রশ্নটা আগ্রহোদ্দীপক আর উত্তরটা যাচাই করা যায় না, তাই এটা আপনাকে এগোতে সাহায্য করে না। উত্তর যাই হোক, তথ্যটা অপ্রকাশিত থাকলে সিদ্ধান্তটা একই।",
                en: "An interesting question whose answer cannot be verified, so it does not move you forward. Whatever the answer, while the information is unpublished the decision is the same.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা কোম্পানি দুর্দান্ত প্রান্তিক ফলাফল ঘোষণা করল, আর দাম ৪% পড়ল। কী ঘটল?",
            en: "A company announced excellent quarterly results and the price fell 4%. What happened?",
          },
          options: [
            {
              text: { bn: "বাজার আরও ভালো আশা করেছিল, আর সেই প্রত্যাশা আগেই দামে ছিল", en: "The market expected even better, and that expectation was already in the price" },
              right: true,
              why: {
                bn: "ঠিক। দাম আজকের ফলাফলের প্রতিক্রিয়া নয়, বরং ফলাফল আর প্রত্যাশার পার্থক্যের প্রতিক্রিয়া। ভালো ফলাফলেও দাম পড়তে পারে যদি প্রত্যাশা তার চেয়ে বেশি ছিল, আর খারাপ ফলাফলেও দাম বাড়তে পারে যদি প্রত্যাশা আরও খারাপ ছিল।",
                en: "Right. A price reacts not to today's result but to the difference between the result and the expectation. Good results can lower a price when expectations were higher, and bad results can lift one when expectations were worse.",
              },
            },
            {
              text: { bn: "বাজার অযৌক্তিক আচরণ করেছে", en: "The market behaved irrationally" },
              why: {
                bn: "এটা একটা সাধারণ ব্যাখ্যা আর সাধারণত ভুল। দাম আগে থেকেই একটা প্রত্যাশা ধরে রেখেছিল, আর সেই প্রত্যাশাটা আপনি দেখতে পাননি বলে প্রতিক্রিয়াটা অযৌক্তিক মনে হচ্ছে। প্রত্যাশাটা পিই-তে দেখা যেত।",
                en: "A common explanation and usually a wrong one. The price already carried an expectation, and because you could not see it the reaction looks irrational. The expectation was visible in the PE.",
              },
            },
            {
              text: { bn: "ফলাফলটা আসলে দুর্দান্ত ছিল না", en: "The results were not actually excellent" },
              why: {
                bn: "সম্ভব, আর যাচাই করা যায়: প্রতিবেদনটা খুলে গত বছরের একই প্রান্তিকের সঙ্গে তুলনা করুন। তবে দুর্দান্ত ফলাফলেও দাম পড়াটা এতটাই সাধারণ যে এটা ব্যাখ্যা করতে ফলাফলটাকে খারাপ প্রমাণ করার দরকার হয় না।",
                en: "Possible, and checkable: open the report and compare with the same quarter last year. But a price falling on excellent results is common enough that explaining it does not require the results to have been bad.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"your-own-biases": {
  bn: `
<p>এই পর্যায়ের সব লেখা এতক্ষণ বাইরের দিকে তাকিয়েছে: কোম্পানি, হিসাব, বাজার। এই লেখাটা ভেতরের দিকে তাকায়, কারণ একজন বিনিয়োগকারীর সবচেয়ে ধারাবাহিক প্রতিপক্ষ বাজার নয়, তার নিজের মন।</p>

<p>এখানে যেসব প্রবণতার কথা বলা হচ্ছে সেগুলো দুর্বলতা নয়, মানুষের স্বাভাবিক গঠন। এগুলো দূর করা যায় না, আর এগুলোর জন্য ব্যবস্থা রাখা যায়। এই লেখাটা ছয়টা চিনতে শেখায় আর প্রতিটার জন্য একটা ব্যবস্থা দেয়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>নিজের যুক্তির পক্ষের তথ্য বেশি চোখে পড়ে, বিপক্ষেরটা কম।</li>
<li>কেনা দাম একটা নোঙর হয়ে যায়, যদিও বাজার সেটা জানে না।</li>
<li>লোকসান একই মাপের লাভের চেয়ে বেশি কষ্ট দেয়, তাই বেচা কঠিন।</li>
<li>যা সহজে মনে পড়ে সেটাকে বেশি সম্ভাব্য মনে হয়।</li>
<li>ব্যবস্থা মানে নিয়ম: লেখা, আগে ঠিক করা, আর যাচাইযোগ্য।</li>
</ul>
</div>

<h2>ছয়টা ফাঁদ</h2>

${mount("yb-match")}

<p>প্রতিটার একটা নাম আছে, আর নামটা জানা কাজে লাগে: যে জিনিসের নাম আছে সেটা নিজের মধ্যে ধরা সহজ। "আমি এই শেয়ারটার পক্ষের খবরই বেশি পড়ছি" একটা পর্যবেক্ষণ, আর সেই পর্যবেক্ষণটাই ফাঁদটাকে অর্ধেক ভেঙে দেয়।</p>

<h2>এক: নিজের পক্ষে খোঁজা</h2>

<p>আপনি একটা শেয়ার কিনেছেন। এখন আপনি ওই কোম্পানির খবর খোঁজেন, আর যেসব খবর আপনার সিদ্ধান্তকে সমর্থন করে সেগুলো বেশি মনোযোগ পায়। বিপক্ষের তথ্য আপনি পড়েন আর ভুলে যান।</p>

<p><strong>ব্যবস্থা:</strong> <a class="term" href="/money/basics-3/a-thesis.html">থিসিসে</a> লেখা ঝুঁকিগুলো। যেহেতু সেগুলো নির্দিষ্ট আর মাপা যায়, সেগুলো যাচাই করা একটা কাজ, একটা অনুভূতি নয়। বছরে একবার শুধু ওই তিনটা জিনিস দেখা যথেষ্ট।</p>

<h2>দুই: কেনা দামের নোঙর</h2>

<p>আপনি ৮০ টাকায় কিনেছেন, এখন দাম ৫২। আপনি বলছেন ৮০ তে ফিরলে বেচে দেব। কিন্তু বাজার জানে না আপনি কত দিয়েছিলেন, আর কোম্পানিটাও জানে না।</p>

<p><strong>ব্যবস্থা:</strong> একটা প্রশ্ন, নিয়মিত জিজ্ঞেস করা: <em>যদি আমার হাতে এটা না থাকত, আজকের দামে আমি কি এটা কিনতাম?</em> উত্তর না হলে ধরে রাখার কারণটা কেনা দাম, আর সেটা কোনো কারণ নয়।</p>

${mount("yb-reveal")}

<h2>তিন: লোকসানের ভয়</h2>

<p>গবেষণা বলে একই মাপের লোকসান লাভের চেয়ে প্রায় দ্বিগুণ তীব্র অনুভব হয়। এর ফলাফল হলো লোকসানে থাকা শেয়ার বেচতে না পারা, কারণ বেচলে লোকসানটা স্বীকার করতে হয়, আর ধরে রাখলে সেটা এখনো কেবল কাগজে।</p>

<p>কিন্তু কাগজের লোকসান আর আসল লোকসান একই জিনিস। আপনার সম্পদের মূল্য আজ যা তা আজকের দাম, আপনি বেচুন বা না বেচুন।</p>

<p><strong>ব্যবস্থা:</strong> বেচার শর্ত কেনার দিনে লিখে ফেলা, যেভাবে <a class="term" href="/money/basics-2/when-to-sell.html">বেচার তিনটা কারণে</a> বলা হয়েছে। শর্তটা যখন পূরণ হয় তখন সিদ্ধান্তটা ইতিমধ্যে নেওয়া হয়ে গেছে।</p>

<h2>চার: যা সহজে মনে পড়ে</h2>

<p>একটা কোম্পানির নাম আপনি প্রতিদিন শোনেন, তাই সেটা নিরাপদ মনে হয়। একটা দুর্ঘটনার খবর সাম্প্রতিক, তাই সেই ধরনের ঝুঁকি বেশি মনে হয়। মন সম্ভাব্যতা মাপে না, মন মনে পড়ার সহজতা মাপে।</p>

<p><strong>ব্যবস্থা:</strong> সংখ্যা। কত শতাংশ কোম্পানি গত দশ বছরে এমন হয়েছে? এই প্রশ্নের উত্তর খোঁজা একটা অনুভূতিকে একটা তথ্যে বদলে দেয়।</p>

<h2>পাঁচ: অতিরিক্ত আত্মবিশ্বাস</h2>

<p>এটা সবচেয়ে ব্যয়বহুল, কারণ এটা অবস্থানের আকারে প্রভাব ফেলে। যে সিদ্ধান্তে আপনি সবচেয়ে নিশ্চিত, সেখানেই আপনি সবচেয়ে বেশি টাকা রাখেন, আর সবচেয়ে বড় ক্ষতিগুলো ঠিক সেখান থেকেই আসে।</p>

<p><strong>ব্যবস্থা:</strong> সর্বোচ্চ সীমা, শতাংশে, আগে ঠিক করা, আর আত্মবিশ্বাস যতই হোক সেটা না বাড়ানো। <a class="term" href="/money/terms/diversification.html">বৈচিত্র্য</a> মূলত এই ফাঁদটার বিরুদ্ধে একটা যন্ত্র।</p>

<h2>ছয়: ভিড়ের চাপ</h2>

<p><a class="term" href="/money/basics-2/crowd-behaviour.html">ভিড়ের আচরণ</a> লেখাটা এটা বাজারের দিক থেকে দেখেছে। ব্যক্তির দিক থেকে এটা আরও সহজ: একা ভুল হওয়ার চেয়ে সবার সঙ্গে ভুল হওয়া কম কষ্টের, তাই মানুষ ভিড়ের সঙ্গে থাকতে চায়।</p>

<p><strong>ব্যবস্থা:</strong> লেখা যুক্তি, আর একটা মাসিক নিয়ম। নিয়ম একটা সিদ্ধান্তকে স্বয়ংক্রিয় করে দেয়, আর স্বয়ংক্রিয় সিদ্ধান্তে ভিড়ের কোনো প্রবেশপথ নেই।</p>

${mount("yb-bins")}

<h2>যা এই লেখাটা দাবি করছে না</h2>

<p>এটা দাবি করছে না যে আপনি এই প্রবণতাগুলো থেকে মুক্ত হতে পারবেন। কেউ পারে না, আর যারা মনে করেন তারা পেরেছেন তারা সাধারণত পাঁচ নম্বর ফাঁদে আছেন।</p>

<p>যা দাবি করছে তা হলো: প্রতিটা ফাঁদের জন্য একটা লেখা নিয়ম আছে, আর নিয়মটা আপনার মেজাজের চেয়ে বেশি নির্ভরযোগ্য। এই কারণেই এই পুরো পর্যায়টা লেখার উপর জোর দেয়: থিসিস লেখা, খাতা রাখা, শর্ত আগে ঠিক করা। লেখা জিনিসগুলো বদলায় না, আর মন বদলায়।</p>

${mount("yb-quiz")}
`,
  en: `
<p>Every lesson in this stage so far has looked outward: at companies, accounts, markets. This one looks inward, because an investor's most consistent opponent is not the market but their own mind.</p>

<p>The tendencies described here are not weaknesses, they are ordinary human wiring. They cannot be removed, and they can be planned for. This lesson teaches you to recognise six and gives you an arrangement for each.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Evidence for your own view is easier to notice than evidence against it.</li>
<li>Your purchase price becomes an anchor, though the market does not know it.</li>
<li>A loss hurts more than a gain of the same size, which makes selling hard.</li>
<li>What comes to mind easily feels more likely than it is.</li>
<li>The arrangement is always a rule: written, decided in advance, and testable.</li>
</ul>
</div>

<h2>Six traps</h2>

${mount("yb-match")}

<p>Each has a name, and knowing the name helps: a thing with a name is easier to catch in yourself. "I am reading mostly the news that supports this share" is an observation, and the observation itself breaks half the trap.</p>

<h2>One: looking for agreement</h2>

<p>You bought a share. Now you look for news about that company, and the items supporting your decision get more attention. Contrary information you read and forget.</p>

<p><strong>The arrangement:</strong> the risks written in your <a class="term" href="/money/basics-3/a-thesis.html">thesis</a>. Because they are specific and measurable, checking them is a task rather than a feeling. Once a year, looking only at those three things is enough.</p>

<h2>Two: the anchor of your purchase price</h2>

<p>You bought at 80 and the price is 52. You say you will sell when it gets back to 80. But the market does not know what you paid, and neither does the company.</p>

<p><strong>The arrangement:</strong> one question, asked regularly: <em>if I did not own this, would I buy it at today's price?</em> If the answer is no, the reason for holding is the purchase price, and that is not a reason.</p>

${mount("yb-reveal")}

<h2>Three: the fear of losses</h2>

<p>Research suggests a loss is felt roughly twice as intensely as a gain of the same size. The consequence is an inability to sell a losing holding, because selling makes the loss real while holding keeps it on paper.</p>

<p>But a paper loss and a real loss are the same thing. What your assets are worth today is today's price, whether or not you sell.</p>

<p><strong>The arrangement:</strong> writing the selling conditions on the day you buy, as the lesson on <a class="term" href="/money/basics-2/when-to-sell.html">the three reasons to sell</a> set out. When a condition is met the decision has already been taken.</p>

<h2>Four: what comes to mind easily</h2>

<p>You hear one company's name every day, so it feels safe. A recent accident is fresh, so that kind of risk feels large. The mind does not measure probability, it measures ease of recall.</p>

<p><strong>The arrangement:</strong> numbers. What percentage of companies has this happened to over ten years? Asking that turns a feeling into a fact.</p>

<h2>Five: overconfidence</h2>

<p>This is the most expensive one, because it acts on position size. The decision you are most certain about is where you put the most money, and the largest losses come from exactly there.</p>

<p><strong>The arrangement:</strong> a maximum limit, as a percentage, fixed in advance, and not raised however confident you feel. <a class="term" href="/money/terms/diversification.html">Diversification</a> is largely an instrument against this trap.</p>

<h2>Six: the pull of the crowd</h2>

<p>The lesson on <a class="term" href="/money/basics-2/crowd-behaviour.html">crowd behaviour</a> looked at this from the market's side. From the individual's it is simpler: being wrong alongside everybody hurts less than being wrong alone, so people want to stand with the crowd.</p>

<p><strong>The arrangement:</strong> a written argument and a monthly rule. A rule makes a decision automatic, and an automatic decision offers the crowd no entrance.</p>

${mount("yb-bins")}

<h2>What this lesson does not claim</h2>

<p>It does not claim you can free yourself of these tendencies. Nobody does, and those who think they have are usually in trap five.</p>

<p>What it does claim is this: each trap has a written rule against it, and the rule is more reliable than your mood. Which is why this whole stage insists on writing: writing a thesis, keeping records, fixing conditions in advance. Written things do not change, and minds do.</p>

${mount("yb-quiz")}
`,
  blocks: {
    "yb-match": {
      kind: "match",
      title: { bn: "ফাঁদ আর তার ব্যবস্থা", en: "The trap and its arrangement" },
      note: { bn: "প্রতিটা প্রবণতার সঙ্গে তার বিরুদ্ধে যে নিয়মটা কাজ করে, সেটা মেলান।", en: "Match each tendency with the rule that works against it." },
      pairs: [
        {
          left: { bn: "নিজের যুক্তির পক্ষের খবরই বেশি চোখে পড়া", en: "Noticing mostly the news that agrees with you" },
          right: { bn: "থিসিসে লেখা মাপা যায় এমন ঝুঁকি, বছরে একবার যাচাই", en: "Measurable risks written in the thesis, checked once a year" },
        },
        {
          left: { bn: "কেনা দামে ফিরলে বেচব, এই ভাবনা", en: "Thinking you will sell when it returns to what you paid" },
          right: { bn: "আজ হাতে না থাকলে আজকের দামে কিনতাম কি না", en: "Asking whether you would buy it today if you did not own it" },
        },
        {
          left: { bn: "লোকসানে থাকা শেয়ার বেচতে না পারা", en: "Being unable to sell a losing holding" },
          right: { bn: "কেনার দিনে লেখা বেচার শর্ত", en: "Selling conditions written on the day you bought" },
        },
        {
          left: { bn: "সাম্প্রতিক ঘটনাকে বেশি সম্ভাব্য মনে হওয়া", en: "A recent event feeling more likely than it is" },
          right: { bn: "সংখ্যা খোঁজা: দশ বছরে কত শতাংশে এটা হয়েছে", en: "Finding the number: in what percentage of cases over ten years" },
        },
        {
          left: { bn: "যে সিদ্ধান্তে সবচেয়ে নিশ্চিত সেখানে বেশি টাকা", en: "Putting most money where you feel most certain" },
          right: { bn: "আগে ঠিক করা সর্বোচ্চ শতাংশ, যা বাড়ে না", en: "A maximum percentage fixed in advance and never raised" },
        },
        {
          left: { bn: "সবাই কিনছে বলে কেনার তাগিদ", en: "The urge to buy because everybody is buying" },
          right: { bn: "একটা মাসিক নিয়ম, বাজার যাই বলুক", en: "A monthly rule, whatever the market says" },
        },
      ],
    },
    "yb-reveal": {
      kind: "reveal",
      title: { bn: "একটা প্রশ্ন যা সব বদলে দেয়", en: "The question that changes everything" },
      ask: {
        bn: "আপনি ৮০ টাকায় কিনেছিলেন, দাম এখন ৫২। কোম্পানির যুক্তি অক্ষত। আপনার সিদ্ধান্তের জন্য সবচেয়ে দরকারি প্রশ্নটা কী?",
        en: "You bought at 80 and the price is 52. The argument for the company is intact. What is the most useful question for your decision?",
      },
      choices: [
        { bn: "কবে ৮০ তে ফিরবে?", en: "When will it get back to 80?" },
        { bn: "আজ হাতে না থাকলে আমি কি ৫২ টাকায় এটা কিনতাম?", en: "If I did not own it, would I buy it at 52?" },
        { bn: "আর কত পড়তে পারে?", en: "How much further can it fall?" },
      ],
      answer: {
        bn: "আজ হাতে না থাকলে আমি কি ৫২ টাকায় এটা কিনতাম? এই একটা প্রশ্ন কেনা দামটাকে হিসাব থেকে সরিয়ে দেয়।",
        en: "If I did not own it, would I buy it at 52? That single question removes your purchase price from the calculation.",
      },
      why: {
        bn: "প্রথম প্রশ্নটা ধরে নিয়েছে যে ৮০ একটা লক্ষ্য, অথচ ৮০ কেবল একটা তারিখে আপনি যা দিয়েছিলেন তার সংখ্যা। বাজার সেটা জানে না, কোম্পানি সেটা জানে না, আর ভবিষ্যতের দামের সঙ্গে সেটার কোনো সম্পর্ক নেই। তৃতীয় প্রশ্নটা ভবিষ্যদ্বাণী চাইছে, যা কেউ দিতে পারে না। দ্বিতীয় প্রশ্নটা যা করে তা হলো আপনাকে আজকের অবস্থানে দাঁড় করিয়ে দেয়: একটা ব্যবসা, একটা দাম, আর একটা সিদ্ধান্ত। উত্তর হ্যাঁ হলে ধরে রাখুন, আর সেটা একটা সক্রিয় সিদ্ধান্ত। উত্তর না হলে ধরে রাখার একমাত্র কারণটা কেনা দাম, আর সেটা কোনো কারণ নয়। প্রশ্নটা প্রতিটা অবস্থানে প্রতি বছর একবার করা যায়, আর তখন এটা একটা পর্যালোচনার যন্ত্র হয়ে ওঠে।",
        en: "The first question assumes 80 is a target, when 80 is only the number you paid on one date. The market does not know it, the company does not know it, and it has no bearing on a future price. The third asks for a prediction that nobody can give. What the second does is put you where you actually stand: a business, a price, and a decision. If the answer is yes, hold, and that is an active decision. If it is no, the only reason for holding is the purchase price, and that is not a reason. Asked once a year of every holding, this becomes a review instrument.",
      },
    },
    "yb-bins": {
      kind: "bins",
      title: { bn: "নিয়ম, নাকি মেজাজ", en: "A rule, or a mood" },
      note: { bn: "প্রতিটা বাক্যকে ঠিক বাক্সে ফেলুন। নিয়ম লেখা আর আগে ঠিক করা; মেজাজ এই মুহূর্তের।", en: "Drop each into the right box. A rule is written and fixed in advance; a mood belongs to this moment." },
      bins: [
        { id: "rule", label: { bn: "নিয়ম", en: "A rule" }, tone: "good" },
        { id: "mood", label: { bn: "মেজাজ", en: "A mood" }, tone: "bad" },
      ],
      items: [
        {
          text: { bn: "কোনো একটা শেয়ারে মোট টাকার ১০% এর বেশি নয়", en: "No more than 10% of the total in any one share" },
          bin: "rule",
          why: { bn: "সংখ্যায় বলা, আগে ঠিক করা, আর যাচাই করা যায়। আত্মবিশ্বাস এটাকে বদলাতে পারে না।", en: "Stated as a number, fixed in advance and checkable. Confidence cannot move it." },
        },
        {
          text: { bn: "এই কোম্পানিটা নিয়ে আমার খুব ভালো অনুভূতি হচ্ছে", en: "I have a very good feeling about this company" },
          bin: "mood",
          why: { bn: "অনুভূতি যাচাই করা যায় না, আর এটা প্রায়ই সাম্প্রতিক দামের নড়াচড়ার প্রতিফলন।", en: "A feeling cannot be tested, and it usually reflects a recent price move." },
        },
        {
          text: { bn: "প্রতি মাসের ৫ তারিখে একটা নির্দিষ্ট অঙ্ক রাখব", en: "A fixed amount on the fifth of every month" },
          bin: "rule",
          why: { bn: "তারিখ আর অঙ্ক দুইটাই আগে ঠিক করা, তাই বাজারের মেজাজ এতে ঢুকতে পারে না।", en: "Both the date and the amount are fixed in advance, so the market's mood cannot enter." },
        },
        {
          text: { bn: "এবার আর দেরি করা যাবে না, সুযোগটা চলে যাচ্ছে", en: "There is no time to lose; the opportunity is going" },
          bin: "mood",
          why: { bn: "তাড়াহুড়োর অনুভূতি প্রায় সবসময় দামের গতির প্রতিক্রিয়া, তথ্যের নয়। সত্যিকারের সুযোগ এক সপ্তাহ অপেক্ষা সহ্য করে।", en: "A sense of urgency is nearly always a reaction to momentum rather than to information. A real opportunity survives a week of waiting." },
        },
        {
          text: { bn: "টানা দুই প্রান্তিকে নগদ প্রবাহ ঋণাত্মক হলে বেচব", en: "Sell if operating cash flow is negative for two quarters" },
          bin: "rule",
          why: { bn: "মাপা যায় এমন শর্ত, আর বার্ষিক প্রতিবেদনে যাচাই করা যায়। সিদ্ধান্তটা আগেই নেওয়া হয়ে আছে।", en: "A measurable condition, checkable in the annual report. The decision has already been taken." },
        },
        {
          text: { bn: "সবাই এটা কিনছে, না কিনলে পিছিয়ে পড়ব", en: "Everybody is buying it; I will be left behind" },
          bin: "mood",
          why: { bn: "এটাই ভিড়ের চাপ, আর এটা চক্রের শেষ পর্বে সবচেয়ে জোরালো হয়, ঠিক যখন দাম সবচেয়ে বেশি।", en: "This is the pull of the crowd, and it is strongest late in a cycle, precisely when prices are highest." },
        },
      ],
    },
    "yb-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার একটা শেয়ার ৪০% পড়েছে, আরেকটা ৪০% বেড়েছে। আপনার টাকার দরকার হলে কোনটা বেচবেন?",
            en: "One holding is down 40% and another is up 40%. If you need money, which do you sell?",
          },
          options: [
            {
              text: { bn: "যেটার যুক্তি সবচেয়ে দুর্বল, দাম যাই হোক", en: "Whichever has the weakest argument, whatever the price" },
              right: true,
              why: {
                bn: "ঠিক। সিদ্ধান্তটা হওয়া উচিত ব্যবসার অবস্থা দেখে, আপনার কেনা দাম দেখে নয়। বেশিরভাগ মানুষ বেড়ে যাওয়াটা বেচেন, কারণ লাভ ধরে রাখলে ভালো লাগে আর লোকসান স্বীকার করতে খারাপ লাগে। এতে পোর্টফোলিও থেকে ভালোটা যায় আর খারাপটা থাকে, বছরের পর বছর।",
                en: "Right. The decision should follow the state of the businesses rather than what you paid. Most people sell the winner, because taking a gain feels good and admitting a loss feels bad. That removes the good one and keeps the bad one, year after year.",
              },
            },
            {
              text: { bn: "যেটা বেড়েছে, লাভটা নিশ্চিত করি", en: "The one that rose, to lock in the gain" },
              why: {
                bn: "লাভ নিশ্চিত করা একটা মনস্তাত্ত্বিক পুরস্কার, আর অর্থনৈতিক যুক্তি নয়। যে শেয়ারটা ভালো করছে সে সাধারণত ভালো ব্যবসা বলেই করছে, আর সেটাই দীর্ঘমেয়াদে ধরে রাখার জিনিস।",
                en: "Locking in a gain is a psychological reward rather than an economic argument. A share doing well is usually doing well because the business is good, and that is what you keep for the long run.",
              },
            },
            {
              text: { bn: "যেটা পড়েছে, লোকসান কমাই", en: "The one that fell, to cut the loss" },
              why: {
                bn: "কখনো ঠিক আর কারণটা ভিন্ন হতে হবে: যুক্তি ভেঙে গেলে বেচা ঠিক, কিন্তু দাম পড়েছে বলে নয়। দাম পড়া একটা ফলাফল, আর প্রশ্নটা সবসময় কেন পড়েছে।",
                en: "Sometimes right, and for a different reason: selling is right when the argument has broken, not because the price fell. A falling price is a result, and the question is always why.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "আপনি একটা কোম্পানি নিয়ে খুব নিশ্চিত, আর ভাবছেন মোট টাকার ৪০% সেখানে রাখবেন। কী করা উচিত?",
            en: "You feel very certain about one company and are thinking of putting 40% of your money into it. What should you do?",
          },
          options: [
            {
              text: { bn: "নিজের আগে ঠিক করা সীমা মেনে চলি, আত্মবিশ্বাস যাই হোক", en: "Keep to the limit I set in advance, whatever my confidence" },
              right: true,
              why: {
                bn: "ঠিক, আর কারণটা অস্বস্তিকর: আত্মবিশ্বাস আর সঠিকতার মধ্যে সম্পর্ক দুর্বল। সবচেয়ে বড় ক্ষতিগুলো সেইসব বিনিয়োগ থেকে আসে যেগুলো নিয়ে মানুষ সবচেয়ে নিশ্চিত ছিলেন, কারণ নিশ্চয়তাই অবস্থানটাকে বড় করেছিল। সীমাটা আগে ঠিক করা হয় ঠিক এই মুহূর্তের জন্য।",
                en: "Right, and for an uncomfortable reason: the relationship between confidence and correctness is weak. The largest losses come from the investments people were most certain about, because the certainty is what made the position large. The limit is set in advance for exactly this moment.",
              },
            },
            {
              text: { bn: "রাখি, কারণ আমি সত্যিই ভালো গবেষণা করেছি", en: "Do it, because I have genuinely researched it well" },
              why: {
                bn: "ভালো গবেষণা সঠিক হওয়ার সম্ভাবনা বাড়ায় আর নিশ্চয়তা দেয় না। একটা কোম্পানিতে যা ঘটতে পারে তার অনেক কিছুই বাইরের: একটা নিয়ম বদল, একটা অগ্নিকাণ্ড, একজন প্রধান নির্বাহীর প্রস্থান। গবেষণা এদের কোনোটাই ঠেকাতে পারে না।",
                en: "Good research raises the chance of being right and does not make it certain. Much of what can happen to a company is external: a rule change, a fire, the departure of a chief executive. Research prevents none of them.",
              },
            },
            {
              text: { bn: "৪০% এর বদলে ৩০% রাখি, একটা আপস হিসেবে", en: "Put in 30% instead of 40%, as a compromise" },
              why: {
                bn: "আপসটা এখনো আত্মবিশ্বাসকেই সীমা ঠিক করতে দিচ্ছে, কেবল কম মাত্রায়। সীমার পুরো উদ্দেশ্য হলো এটা আগে ঠিক করা আর এই মুহূর্তের অনুভূতির নাগালের বাইরে রাখা।",
                en: "The compromise still lets confidence set the limit, only less of it. The whole point of a limit is that it was fixed in advance and sits beyond the reach of how you feel now.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"case-study": {
  bn: `
<p>এই লেখাটা নতুন কিছু শেখায় না। এটা আগের ষোলোটা লেখার সব যন্ত্র একটা কোম্পানির উপর প্রয়োগ করে, শুরু থেকে শেষ পর্যন্ত, আর দেখায় সিদ্ধান্তটা আসলে কীভাবে তৈরি হয়।</p>

<p>কোম্পানিটা কাল্পনিক, ইচ্ছাকৃতভাবে। একটা আসল কোম্পানির নাম দিলে এটা একটা সুপারিশ হয়ে যেত, আর এই সাইটের কাজ সুপারিশ দেওয়া নয়, পদ্ধতি শেখানো। সংখ্যাগুলো বাংলাদেশের একটা মাঝারি আকারের উৎপাদনকারী কোম্পানির মতো করে বসানো।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>কোম্পানিটা কী করে, তিন বাক্যে।</li>
<li>তিনটা হিসাব, ক্রমানুসারে: নগদ প্রবাহ, আয়-ব্যয়, স্থিতিপত্র।</li>
<li>ছয়টা অনুপাত আর প্রতিযোগীদের সঙ্গে তুলনা।</li>
<li>বিপদের চিহ্ন খোঁজা, আর যা পাওয়া গেল তার ব্যাখ্যা।</li>
<li>একটা থিসিস, একটা সীমা, আর একটা সিদ্ধান্ত।</li>
</ul>
</div>

<h2>ধাপ এক: কোম্পানিটা কী করে</h2>

<p>কোম্পানিটা প্লাস্টিকের গৃহস্থালি পণ্য বানায়: বালতি, চেয়ার, খাবারের পাত্র। বিক্রি হয় সারা দেশে ছোট দোকান আর পরিবেশকের মাধ্যমে, প্রায় পুরোটাই দেশের ভেতরে। আয় আসে পরিমাণ আর দামের গুণফল থেকে, আর সবচেয়ে বড় খরচ পলিমার, যা আমদানি হয় আর যার দাম তেলের দামের সঙ্গে চলে।</p>

<p>তিন বাক্যে লেখা হয়ে গেল, আর এর মধ্যেই দুইটা শত্রুর নাম বেরিয়ে এসেছে: <a class="term" href="/money/basics-2/commodities.html">তেলের দাম</a> আর <a class="term" href="/money/basics-2/interest-and-taka.html">ডলার</a>। এই দুইটাই এখন থেকে আমাদের নজরে থাকবে।</p>

<h2>ধাপ দুই: হিসাবগুলো</h2>

${mount("cs3-screen")}

<p>ক্রমটা <a class="term" href="/money/basics-3/annual-report.html">বার্ষিক প্রতিবেদনের</a> লেখা অনুযায়ী: নিরীক্ষকের মতামত আগে, আর সেটা শর্তহীন। তারপর নগদ প্রবাহ, তারপর আয়-ব্যয়, তারপর স্থিতিপত্র।</p>

<p><strong>নগদ প্রবাহ।</strong> পরিচালন নগদ প্রবাহ ৭২ কোটি, নিট মুনাফা ৫৮ কোটি। অনুপাতটা ১.২৪, অর্থাৎ মুনাফার চেয়ে বেশি নগদ আসছে, যা অবচয়ের কারণে স্বাভাবিক আর একটা ভালো লক্ষণ। মূলধনি ব্যয় ৩০ কোটি, তাই মুক্ত নগদ প্রবাহ ৪২ কোটি। লভ্যাংশ ২২ কোটি, যা মুক্ত নগদ প্রবাহের অর্ধেক। এটা টেকসই।</p>

<p><strong>আয়-ব্যয়।</strong> আয় ৬২০ কোটি, গত বছর ৫৬০, অর্থাৎ ১১% বৃদ্ধি। মোট মুনাফার হার ২৮%, গত বছর ৩১%। এটা প্রথম প্রশ্ন: হার কমল কেন? পরিচালন মুনাফার হার ১৩%, নিট ৯.৪%।</p>

<p><strong>স্থিতিপত্র।</strong> ঋণ ইকুইটির ০.৪ গুণ, সুদ আবরণ ৬.২। প্রাপ্য বেড়েছে ১৩%, যা আয়ের বৃদ্ধির কাছাকাছি, তাই স্বাভাবিক। মজুদ বেড়েছে ২৯%, যা আয়ের বৃদ্ধির চেয়ে বেশি। এটা দ্বিতীয় প্রশ্ন।</p>

<h2>ধাপ তিন: দুইটা প্রশ্নের উত্তর খোঁজা</h2>

<p>দুইটা জিনিস আলাদা দেখাল, আর দুইটারই উত্তর নোটে আর ব্যবস্থাপনার আলোচনায় খুঁজতে হবে।</p>

<p><strong>মোট মুনাফার হার ৩১% থেকে ২৮%।</strong> ব্যবস্থাপনা বলছে পলিমারের দাম বছরের দ্বিতীয়ার্ধে বেড়েছে আর তারা দাম আংশিক বাড়াতে পেরেছে। এটা যাচাইযোগ্য: আন্তর্জাতিক পলিমারের দাম আর টাকার বিনিময় হার দুইটাই সেই সময়ে বেড়েছিল কি না দেখা যায়। যদি হ্যাঁ, তাহলে ব্যাখ্যাটা সৎ, আর এটা একটা চক্রীয় সমস্যা, কাঠামোগত নয়।</p>

<p><strong>মজুদ ২৯% বাড়া।</strong> ব্যবস্থাপনা বলছে নতুন একটা পণ্যশ্রেণি চালু হয়েছে আর তার জন্য আগাম মজুদ করা হয়েছে। এটা এক বছরের জন্য গ্রহণযোগ্য, আর এটাই সেই ধরনের দাবি যা পরের বছর যাচাই করতে হবে: মজুদ যদি আবার বাড়ে আর বিক্রি না বাড়ে, তাহলে ব্যাখ্যাটা ভুল ছিল।</p>

${mount("cs3-spot")}

<h2>ধাপ চার: প্রতিযোগীদের সঙ্গে তুলনা</h2>

${mount("cs3-lab")}

<p>একই খাতের তিনটা কোম্পানির পরিচালন মুনাফার হার ১১%, ১২% আর ১৩%। আমাদের কোম্পানিটা ১৩%, অর্থাৎ শীর্ষে কিন্তু নাটকীয়ভাবে নয়। আরওই ১৮%, প্রতিযোগীদের ১৪% আর ১৫%। ঋণ ইকুইটি ০.৪, প্রতিযোগীদের ০.৬ আর ০.৯।</p>

<p>এই তুলনাটা একটা কথা বলছে: কোম্পানিটার আরওই বেশি অথচ ঋণ কম। এটাই সেই বিরল সমন্বয় যা সত্যিকারের ব্যবসায়িক শক্তির লক্ষণ, কারণ <a class="term" href="/money/basics-3/ratios.html">অনুপাতের</a> লেখায় দেখা গেছে ঋণ বাড়িয়ে আরওই বাড়ানো সহজ, আর ঋণ কমিয়ে আরওই বাড়ানো কঠিন।</p>

<h2>ধাপ পাঁচ: দাম</h2>

<p>শেয়ারের দাম ৮৭ টাকা, প্রতি শেয়ার আয় ৭.২৫ টাকা, তাই পিই ১২। খাতের গড় পিই ১৪। প্রতি শেয়ার বইমূল্য ৪১ টাকা, তাই দাম ভাগ বইমূল্য ২.১।</p>

<p>এখানে একটা প্রশ্ন উঠছে যা <a class="term" href="/money/basics-3/comparing-peers.html">তুলনার</a> লেখায় ছিল: কোম্পানিটা প্রতিযোগীদের চেয়ে ভালো, অথচ পিই কম কেন? সম্ভাব্য উত্তর: এই বছরের মুনাফার হার কমেছে আর বাজার সেটাকে স্থায়ী মনে করছে। যদি সেটা সাময়িক হয়, তাহলে এখানে একটা সুযোগ আছে।</p>

${mount("cs3-steps")}

<h2>ধাপ ছয়: থিসিস</h2>

<p><strong>ব্যবসা:</strong> দেশের ভেতরে প্লাস্টিকের গৃহস্থালি পণ্য বানায় আর পরিবেশকের মাধ্যমে বেচে; আয় পরিমাণ আর দামের গুণফল; সবচেয়ে বড় খরচ আমদানি করা পলিমার।</p>

<p><strong>কারণ:</strong> প্রতিযোগীদের চেয়ে কম ঋণে বেশি আরওই বানাচ্ছে, আর এই বছরের মুনাফার হারের পতনটা পলিমারের দামজনিত, যা চক্রীয়; দাম স্থিতিশীল হলে হার ফিরে আসার কথা।</p>

<p><strong>প্রমাণ:</strong> আরওই ১৮% বনাম প্রতিযোগীদের ১৪ আর ১৫; ঋণ ইকুইটি ০.৪ বনাম ০.৬ আর ০.৯; নগদ প্রবাহ ভাগ মুনাফা ১.২৪।</p>

<p><strong>ঝুঁকি:</strong> এক, মোট মুনাফার হার পরের দুই বছরেও ২৮% এর নিচে থাকলে ব্যাখ্যাটা ভুল ছিল আর সমস্যাটা কাঠামোগত। দুই, মজুদ আবার আয়ের চেয়ে দ্রুত বাড়লে নতুন পণ্যশ্রেণির দাবিটা ভুল। তিন, ঋণ ইকুইটির ০.৮ ছাড়ালে কোম্পানিটা আর সেই কোম্পানি নয় যার জন্য এই থিসিস লেখা হয়েছিল।</p>

<p><strong>সীমা:</strong> মোট বিনিয়োগযোগ্য টাকার ৮%, দুই কিস্তিতে।</p>

${mount("cs3-order")}

<h2>ধাপ সাত: সিদ্ধান্ত, আর কী সিদ্ধান্ত নয়</h2>

<p>থিসিসটা দাঁড়িয়েছে, তাই এটা কেনার মতো একটা কোম্পানি। যা এটা বলছে না তা হলো নিশ্চয়তা। তিনটা ঝুঁকির যেকোনো একটা ঘটতে পারে, আর ঘটলে সিদ্ধান্তটা বদলাবে।</p>

<p>দ্বিতীয় কথাটা আরও গুরুত্বপূর্ণ: এই সাত ধাপ আপনাকে এই একটা কোম্পানি সম্পর্কে যা জানিয়েছে, তার চেয়ে বেশি জানিয়েছে <em>কীভাবে</em> জানতে হয় সেটা। পরের কোম্পানিটায় আপনি একই সাতটা ধাপ চালাবেন, আর সংখ্যাগুলো আলাদা হবে।</p>

<div class="ex">
<p><strong>যা এখানে ইচ্ছাকৃতভাবে নেই।</strong> কোনো লক্ষ্য দাম নেই। কোনো "এটা দ্বিগুণ হবে" নেই। কোনো সময়সীমা নেই। এই তিনটাই সেই জিনিস যা বিশ্লেষণকে ভবিষ্যদ্বাণীতে বদলে দেয়, আর ভবিষ্যদ্বাণী এই সাইটের কাজ নয়। যা আছে তা হলো একটা যুক্তি, তার প্রমাণ, আর সেটা ভুল হলে কীভাবে জানবেন।</p>
</div>

${mount("cs3-drill")}

${mount("cs3-quiz")}
`,
  en: `
<p>This lesson teaches nothing new. It applies every tool from the previous sixteen to one company, start to finish, and shows how a decision actually gets made.</p>

<p>The company is imaginary, deliberately. Naming a real one would make this a recommendation, and the work of this site is teaching a method rather than issuing recommendations. The numbers are set to resemble a mid-sized Bangladeshi manufacturer.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>What the company does, in three sentences.</li>
<li>Three statements in order: cash flow, income, balance sheet.</li>
<li>Six ratios and a comparison with competitors.</li>
<li>Looking for red flags, and explaining the ones found.</li>
<li>A thesis, a limit and a decision.</li>
</ul>
</div>

<h2>Step one: what the company does</h2>

<p>The company makes plastic household goods: buckets, chairs, food containers. It sells across the country through small shops and distributors, almost entirely domestically. Revenue is volume times price, and the largest cost is polymer, which is imported and whose price tracks oil.</p>

<p>Three sentences, and two enemies are already named: the <a class="term" href="/money/basics-2/commodities.html">oil price</a> and the <a class="term" href="/money/basics-2/interest-and-taka.html">dollar</a>. Both stay under watch from here.</p>

<h2>Step two: the statements</h2>

${mount("cs3-screen")}

<p>The order follows the lesson on <a class="term" href="/money/basics-3/annual-report.html">annual reports</a>: the auditor's opinion first, and it is unqualified. Then cash flow, then income, then the balance sheet.</p>

<p><strong>Cash flow.</strong> Operating cash flow 720 million against net profit of 580 million. The ratio is 1.24, so more cash arrives than profit, which is normal because of depreciation and is a good sign. Capital expenditure 300 million, so free cash flow is 420 million. The dividend is 220 million, about half of free cash flow. Sustainable.</p>

<p><strong>Income.</strong> Revenue 6.2 billion against 5.6 billion last year, growth of 11%. Gross margin 28% against 31% last year. That is the first question: why did the margin fall? Operating margin 13%, net 9.4%.</p>

<p><strong>Balance sheet.</strong> Debt at 0.4 times equity, interest cover 6.2. Receivables up 13%, close to revenue growth, so ordinary. Inventory up 29%, well ahead of revenue growth. That is the second question.</p>

<h2>Step three: answering the two questions</h2>

<p>Two things stood out, and both need answers from the notes and management's discussion.</p>

<p><strong>Gross margin 31% to 28%.</strong> Management says polymer prices rose in the second half and that they passed on part of it. This is testable: check whether international polymer prices and the exchange rate both rose in that period. If they did, the explanation is honest, and the problem is cyclical rather than structural.</p>

<p><strong>Inventory up 29%.</strong> Management says a new product line launched and stock was built ahead of it. That is acceptable for one year, and it is exactly the kind of claim to test next year: if inventory rises again without sales rising, the explanation was wrong.</p>

${mount("cs3-spot")}

<h2>Step four: comparing with competitors</h2>

${mount("cs3-lab")}

<p>Three companies in the same sector run operating margins of 11%, 12% and 13%. Ours is at 13%, so at the top but not dramatically. ROE is 18% against competitors at 14% and 15%. Debt to equity is 0.4 against 0.6 and 0.9.</p>

<p>That comparison says one thing: the company earns a higher ROE with less debt. This is the rare combination that indicates genuine business strength, because as the lesson on <a class="term" href="/money/basics-3/ratios.html">ratios</a> showed, raising ROE with debt is easy and raising it while reducing debt is hard.</p>

<h2>Step five: the price</h2>

<p>The share is 87 with earnings per share of 7.25, so a PE of 12. The sector average is 14. Book value per share is 41, so price to book is 2.1.</p>

<p>Which raises the question the lesson on <a class="term" href="/money/basics-3/comparing-peers.html">comparing peers</a> pointed at: the company is better than its competitors, so why is its PE lower? A likely answer: the margin fell this year and the market treats that as permanent. If it is temporary, there is an opportunity here.</p>

${mount("cs3-steps")}

<h2>Step six: the thesis</h2>

<p><strong>The business:</strong> makes plastic household goods for the domestic market and sells through distributors; revenue is volume times price; the largest cost is imported polymer.</p>

<p><strong>The reason:</strong> it earns a higher ROE than its competitors on less debt, and this year's margin fall is polymer-driven and therefore cyclical; margins should recover as prices settle.</p>

<p><strong>The evidence:</strong> ROE 18% against 14 and 15; debt to equity 0.4 against 0.6 and 0.9; cash flow over profit 1.24.</p>

<p><strong>The risks:</strong> one, if the gross margin stays below 28% for two more years the explanation was wrong and the problem is structural. Two, if inventory again grows faster than revenue, the new product line claim was wrong. Three, if debt to equity passes 0.8 this is no longer the company this thesis was written about.</p>

<p><strong>The limit:</strong> 8% of investable money, in two instalments.</p>

${mount("cs3-order")}

<h2>Step seven: the decision, and what it is not</h2>

<p>The thesis holds, so this is a company worth buying. What it does not say is that anything is certain. Any of the three risks may happen, and if one does the decision changes.</p>

<p>The second point matters more: what these seven steps taught you about this one company is less than what they taught you about <em>how</em> to find out. On the next company you run the same seven steps, and the numbers will differ.</p>

<div class="ex">
<p><strong>What is deliberately absent.</strong> There is no target price. There is no "this will double". There is no timeframe. Those three are what turn analysis into prophecy, and prophecy is not this site's work. What is here is an argument, its evidence, and how you will know if it is wrong.</p>
</div>

${mount("cs3-drill")}

${mount("cs3-quiz")}
`,
  blocks: {
    "cs3-screen": {
      kind: "figure",
      shape: "callouts",
      title: { bn: "কোম্পানিটার সংখ্যা", en: "The company's numbers" },
      note: { bn: "কাল্পনিক কোম্পানি, কোটি টাকায়। পাশে প্রতিটা সংখ্যা কী প্রশ্ন তোলে।", en: "An imaginary company, in millions. Beside each figure, the question it raises." },
      screen: {
        title: { bn: "বছর শেষে", en: "For the year" },
        rows: [
          { label: { bn: "আয়", en: "Revenue" }, value: { bn: "৬২০, গত বছর ৫৬০", en: "6,200, last year 5,600" } },
          { label: { bn: "মোট মুনাফার হার", en: "Gross margin" }, value: { bn: "২৮%, গত বছর ৩১%", en: "28%, last year 31%" } },
          { label: { bn: "নিট মুনাফা", en: "Net profit" }, value: { bn: "৫৮", en: "580" } },
          { label: { bn: "পরিচালন নগদ প্রবাহ", en: "Operating cash flow" }, value: { bn: "৭২", en: "720" } },
          { label: { bn: "মজুদ", en: "Inventory" }, value: { bn: "+২৯%", en: "+29%" } },
          { label: { bn: "ঋণ ইকুইটি", en: "Debt to equity" }, value: { bn: "০.৪", en: "0.4" } },
        ],
      },
      parts: [
        { text: { bn: "বৃদ্ধি ১১%, স্বাভাবিক", en: "Growth of 11%, ordinary" }, note: { bn: "খাতের বৃদ্ধির সঙ্গে মিলিয়ে দেখতে হবে: এর চেয়ে দ্রুত মানে বাজার নিচ্ছে।", en: "To be read against sector growth: faster than that means taking share." }, at: 0 },
        { text: { bn: "প্রথম প্রশ্ন", en: "The first question" }, note: { bn: "তিন পয়েন্টের পতন। কারণটা চক্রীয় নাকি কাঠামোগত, সেটাই পুরো থিসিসের কেন্দ্র।", en: "A three-point fall. Whether the cause is cyclical or structural is the centre of the whole thesis." }, tone: "warn", at: 1 },
        { text: { bn: "নিট মুনাফার হার ৯.৪%", en: "A net margin of 9.4%" }, note: { bn: "একা কিছু বলে না; প্রতিযোগীদের পাশে বসালে বলে।", en: "Nothing on its own; beside competitors it says a great deal." }, at: 2 },
        { text: { bn: "মুনাফার চেয়ে বেশি নগদ", en: "More cash than profit" }, note: { bn: "অনুপাত ১.২৪। মুনাফাটা কাগজে নয়, নগদে পৌঁছাচ্ছে।", en: "A ratio of 1.24. The profit is not on paper; it reaches cash." }, tone: "good", at: 3 },
        { text: { bn: "দ্বিতীয় প্রশ্ন", en: "The second question" }, note: { bn: "আয় বেড়েছে ১১%, মজুদ ২৯%। ব্যাখ্যা আছে, আর সেটা পরের বছর যাচাই করতে হবে।", en: "Revenue up 11%, inventory up 29%. There is an explanation, and it must be tested next year." }, tone: "warn", at: 4 },
        { text: { bn: "কম ঋণ", en: "Low debt" }, note: { bn: "সুদ আবরণ ৬.২। খারাপ বছর সামলানোর জায়গা আছে।", en: "Interest cover of 6.2. There is room to absorb a bad year." }, tone: "good", at: 5 },
      ],
      caption: {
        bn: "ছয়টা সংখ্যায় দুইটা প্রশ্ন আর দুইটা শক্তি। বাকি কাজটা হলো প্রশ্ন দুইটার উত্তর নোটে খোঁজা।",
        en: "Six numbers holding two questions and two strengths. The remaining work is finding the answers to the two questions in the notes.",
      },
    },
    "cs3-spot": {
      kind: "spot",
      title: { bn: "নোট আর আলোচনায় কোনগুলো থামায়", en: "Which lines in the notes and discussion should stop you" },
      note: { bn: "এই কোম্পানির প্রতিবেদন থেকে ছয়টা বাক্য। যেগুলো খতিয়ে দেখতে হবে সেগুলোতে চাপুন।", en: "Six lines from this company's report. Press the ones that need investigating." },
      source: { bn: "কাল্পনিক কোম্পানির বার্ষিক প্রতিবেদন", en: "The imaginary company's annual report" },
      lines: [
        {
          text: { bn: "নিরীক্ষকের মতামত শর্তহীন।", en: "The auditor's opinion is unqualified." },
        },
        {
          text: { bn: "পলিমারের গড় ক্রয়মূল্য বছরের দ্বিতীয়ার্ধে ১৯% বেড়েছে।", en: "The average purchase price of polymer rose 19% in the second half." },
        },
        {
          text: { bn: "মজুদের ৩৮% নতুন পণ্যশ্রেণির, যা বছরের শেষ মাসে চালু হয়েছে।", en: "38% of inventory is the new product line, launched in the final month of the year." },
          flag: { bn: "ব্যাখ্যাটা সংগত আর এটা একটা যাচাইযোগ্য দাবি তৈরি করেছে: পরের বছর এই মজুদ বিক্রি হয়ে যাওয়ার কথা। না হলে ব্যাখ্যাটা ভুল ছিল, আর তখন এটা একটা লোকসান।", en: "A coherent explanation that creates a testable claim: this stock should sell next year. If it does not, the explanation was wrong and this becomes a write-down." },
        },
        {
          text: { bn: "কোম্পানি পরিচালকদের একটি প্রতিষ্ঠান থেকে পরিবহন সেবা নেয়, বছরে ৪ কোটি টাকার।", en: "The company buys transport services worth 40 million a year from an entity owned by its directors." },
          flag: { bn: "সম্পর্কিত পক্ষের লেনদেন। অঙ্কটা আয়ের তুলনায় ছোট, তাই এটা এই মুহূর্তে বড় সমস্যা নয়, কিন্তু শর্তগুলো বাজারদরে কি না দেখা দরকার আর প্রতি বছর অঙ্কটা নজরে রাখা দরকার।", en: "A related party transaction. The amount is small against revenue so it is not a large problem now, but the terms should be at market rates and the amount watched each year." },
        },
        {
          text: { bn: "কোম্পানি এ বছর ২২ কোটি টাকা নগদ লভ্যাংশ দিয়েছে, টানা সপ্তম বছর।", en: "The company paid a 220 million cash dividend, the seventh consecutive year." },
        },
        {
          text: { bn: "মোট বিক্রির ৪১% শীর্ষ তিনজন পরিবেশকের মাধ্যমে।", en: "41% of sales go through the top three distributors." },
          flag: { bn: "ঘনত্বের ঝুঁকি, আর এটা প্রতি বছর নজরে রাখার মতো। একজন বড় পরিবেশক চলে গেলে বিক্রিতে ধাক্কা আসবে, আর এই সংখ্যাটা বাড়তে থাকলে ঝুঁকিটাও বাড়ে।", en: "Concentration risk, and worth watching each year. Losing one large distributor would hit sales, and if this number keeps rising so does the risk." },
        },
      ],
    },
    "cs3-lab": {
      kind: "lab",
      model: "peers",
      title: { bn: "প্রতিযোগীর পাশে বসিয়ে", en: "Set beside a competitor" },
      note: { bn: "আমাদের কোম্পানির পিই ১২ আর আরওই ১৮; খাতের গড় পিই ১৪ আর আরওই ১৪।", en: "Our company: PE 12, ROE 18. The sector: PE 14, ROE 14." },
      preset: { pe: 12, peerPe: 14, roe: 18, peerRoe: 14, eps: 7.25 },
    },
    "cs3-steps": {
      kind: "figure",
      shape: "steps",
      title: { bn: "সাতটা ধাপ, একটা কোম্পানি", en: "Seven steps, one company" },
      note: { bn: "প্রতিটা ধাপে একটা প্রশ্ন, আর কোনো ধাপে উত্তর না পেলে থামা।", en: "One question per step, and stopping where a step has no answer." },
      parts: [
        { text: { bn: "কী করে", en: "What it does" }, note: { bn: "তিন বাক্য, আর দুইটা শত্রুর নাম বেরিয়ে এল", en: "Three sentences, and two enemies already named" } },
        { text: { bn: "তিনটা হিসাব", en: "The three statements" }, note: { bn: "নগদ প্রবাহ আগে, কারণ সেটাই সবচেয়ে কম সাজানো যায়", en: "Cash flow first, because it is the hardest to dress up" }, tone: "lead" },
        { text: { bn: "যা আলাদা তার ব্যাখ্যা", en: "Explaining what stood out" }, note: { bn: "দুইটা প্রশ্ন, দুইটাই নোটে আর আলোচনায়", en: "Two questions, both answered in the notes and the discussion" } },
        { text: { bn: "প্রতিযোগীদের সঙ্গে", en: "Against competitors" }, note: { bn: "একই খাত, একই ধরনের ক্রেতা, একই সময়কাল", en: "The same sector, the same kind of customer, the same period" } },
        { text: { bn: "দাম", en: "The price" }, note: { bn: "সবার শেষে, আর কেবল উপরের চারটার উত্তর জানার পরে", en: "Last, and only once the four above are answered" }, tone: "warn" },
        { text: { bn: "থিসিস", en: "The thesis" }, note: { bn: "ব্যবসা, কারণ, প্রমাণ, ঝুঁকি, সীমা", en: "Business, reason, evidence, risks, limit" }, tone: "good" },
        { text: { bn: "সিদ্ধান্ত", en: "The decision" }, note: { bn: "একটা সীমা আর দুইটা কিস্তি, আর একটা তারিখ ফিরে দেখার", en: "A limit, two instalments, and a date to come back" } },
      ],
      caption: {
        bn: "সাতটা ধাপে দেড় থেকে দুই ঘণ্টা। একটা কোম্পানির পেছনে দুই ঘণ্টা বেশিরভাগ বিনিয়োগকারীর চেয়ে অনেক বেশি।",
        en: "The seven steps take an hour and a half to two hours. Two hours on one company is far more than most investors spend.",
      },
    },
    "cs3-order": {
      kind: "order",
      title: { bn: "এই বিশ্লেষণটার ক্রম সাজান", en: "Put this analysis in order" },
      note: { bn: "যেভাবে করা হয়েছিল, প্রথম থেকে শেষ।", en: "As it was actually done, first to last." },
      items: [
        {
          text: { bn: "কোম্পানিটা কী বেচে আর কে কেনে, লেখা", en: "Writing down what it sells and who buys it" },
          why: { bn: "এখান থেকেই শত্রুদের নাম আসে: পলিমার আর ডলার।", en: "This is where the enemies get named: polymer and the dollar." },
        },
        {
          text: { bn: "নিরীক্ষকের মতামত পড়া", en: "Reading the auditor's opinion" },
          why: { bn: "শর্ত থাকলে বাকি সংখ্যাগুলোর ওজন কমে যায়, তাই এটা আগে।", en: "A qualification lowers the weight of every other number, so it comes first." },
        },
        {
          text: { bn: "নগদ প্রবাহ আর মুনাফার অনুপাত দেখা", en: "Checking cash flow against profit" },
          why: { bn: "১.২৪ মানে মুনাফাটা নগদে পৌঁছাচ্ছে, আর এটাই প্রথম বড় স্বস্তি।", en: "1.24 means the profit reaches cash, and that is the first real reassurance." },
        },
        {
          text: { bn: "যে দুইটা সংখ্যা আলাদা, সেগুলোর ব্যাখ্যা খোঁজা", en: "Finding explanations for the two numbers that stood out" },
          why: { bn: "মুনাফার হার আর মজুদ। ব্যাখ্যা দুইটাই যাচাইযোগ্য দাবি তৈরি করেছে।", en: "The margin and the inventory. Both explanations created testable claims." },
        },
        {
          text: { bn: "প্রতিযোগীদের সঙ্গে অনুপাত মেলানো", en: "Lining the ratios up against competitors" },
          why: { bn: "কম ঋণে বেশি আরওই, আর এটাই কারণটার ভিত্তি।", en: "Higher ROE on less debt, and that is the foundation of the reason." },
        },
        {
          text: { bn: "দাম দেখা আর খাতের গুণিতকের সঙ্গে তুলনা", en: "Looking at the price against the sector multiple" },
          why: { bn: "শেষে, কারণ দাম দিয়ে শুরু করলে যুক্তিটা দামের চারপাশে গড়ে ওঠে।", en: "Last, because starting from the price builds the argument around the price." },
        },
        {
          text: { bn: "থিসিস লেখা আর সীমা ঠিক করা", en: "Writing the thesis and setting the limit" },
          why: { bn: "ঝুঁকি তিনটা মাপা যায়, আর সীমাটা কেনার আগেই ঠিক।", en: "Three measurable risks, and the limit fixed before buying." },
        },
      ],
    },
    "cs3-drill": {
      kind: "drill",
      title: { bn: "একই সাত ধাপ, একটা আসল কোম্পানিতে", en: "The same seven steps on a real company" },
      note: { bn: "একটা কোম্পানি বাছুন যেটা আপনার নেই। দুই ঘণ্টা, তিন দিনে ভাগ করে নিতে পারেন।", en: "Pick a company you do not own. Two hours, which can be split across three days." },
      steps: [
        {
          text: { bn: "কোম্পানিটা কী বেচে, কে কেনে আর টাকা কোথা থেকে আসে, তিন বাক্যে লিখুন।", en: "Write what it sells, who buys and where the money comes from, in three sentences." },
        },
        {
          text: { bn: "শেষ বার্ষিক প্রতিবেদন নামান আর নিরীক্ষকের মতামত পড়ুন।", en: "Download the latest annual report and read the auditor's opinion." },
        },
        {
          text: { bn: "পরিচালন নগদ প্রবাহ ভাগ নিট মুনাফা হিসাব করুন।", en: "Calculate operating cash flow divided by net profit." },
          hint: { bn: "১ এর কাছাকাছি বা বেশি হলে ভালো। অনেক কম হলে সেটাই আপনার প্রথম প্রশ্ন।", en: "Near or above 1 is good. Much lower and that is your first question." },
        },
        {
          text: { bn: "মোট মুনাফার হার, আরওই, ঋণ ইকুইটি আর সুদ আবরণ বের করুন, দুই বছরের।", en: "Work out gross margin, ROE, debt to equity and interest cover, for two years." },
        },
        {
          text: { bn: "একই খাতের দুইটা কোম্পানির একই চারটা সংখ্যা পাশে বসান।", en: "Put the same four numbers for two companies in the same sector beside them." },
        },
        {
          text: { bn: "যেখানে আপনার কোম্পানি আলাদা, সেখানে কেন, নোটে খুঁজুন।", en: "Where your company differs, find why in the notes." },
        },
        {
          text: { bn: "থিসিসটা লিখুন: ব্যবসা, কারণ, প্রমাণ, তিনটা ঝুঁকি আর একটা সীমা।", en: "Write the thesis: business, reason, evidence, three risks and a limit." },
          hint: { bn: "কেনার দরকার নেই। থিসিসটাই এই অনুশীলনের ফলাফল।", en: "You do not have to buy anything. The thesis is the output of the exercise." },
        },
      ],
    },
    "cs3-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "এই কোম্পানিটার পিই ১২, খাতের গড় ১৪, আর সব অনুপাতে এটা প্রতিযোগীদের চেয়ে ভালো। সবচেয়ে সম্ভাব্য ব্যাখ্যা কী?",
            en: "This company is on a PE of 12 against a sector average of 14, and it beats its competitors on every ratio. What is the most likely explanation?",
          },
          options: [
            {
              text: { bn: "বাজার এই বছরের মুনাফার হারের পতনটাকে স্থায়ী মনে করছে", en: "The market treats this year's margin fall as permanent" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই থিসিসের কেন্দ্রীয় বাজি। বাজার একটা চক্রীয় সমস্যাকে কাঠামোগত মনে করলে দাম যুক্তির চেয়ে কম হয়, আর সেটাই সুযোগ। কিন্তু বাজার ঠিকও হতে পারে, আর সেই কারণেই ঝুঁকি এক নম্বরে লেখা আছে: দুই বছরেও হার না ফিরলে বাজারই ঠিক ছিল।",
                en: "Right, and it is the central bet of the thesis. When the market treats a cyclical problem as structural, the price sits below the argument, and that is the opportunity. But the market may be right, which is why risk one is written as it is: if the margin has not recovered in two years, the market was right.",
              },
            },
            {
              text: { bn: "বাজার ভুল করেছে, আর এটা নিশ্চিত সুযোগ", en: "The market is wrong, so this is a certain opportunity" },
              why: {
                bn: "সুযোগ হতে পারে আর নিশ্চিত কখনো নয়। কম পিই মানে বাজার কিছু একটা নিয়ে চিন্তিত, আর সেই চিন্তাটা সংগত হতে পারে। থিসিসের কাজ হলো চিন্তাটা কী তা নাম ধরে বলা আর সেটা যাচাই করার একটা উপায় লিখে রাখা।",
                en: "It may be an opportunity and it is never certain. A lower PE means the market is worried about something, and the worry may be justified. The thesis names the worry and writes down a way of testing it.",
              },
            },
            {
              text: { bn: "অনুপাতগুলোতে ভুল আছে", en: "There is an error in the ratios" },
              why: {
                bn: "সম্ভব আর সহজে যাচাইযোগ্য: সংখ্যাগুলো মূল প্রতিবেদনে মিলিয়ে নিন। তবে একটা ভালো কোম্পানির পিই খাতের গড়ের নিচে থাকা মোটেও বিরল নয়, বিশেষ করে সাম্প্রতিক একটা খারাপ খবরের পরে।",
                en: "Possible and easily checked: verify the figures against the original report. But a good company trading below the sector average is not at all rare, particularly after a recent piece of bad news.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "পরের বছর দেখা গেল মজুদ আবার ২৫% বেড়েছে আর আয় বেড়েছে ৬%। কী করবেন?",
            en: "The following year inventory is up another 25% while revenue is up 6%. What do you do?",
          },
          options: [
            {
              text: { bn: "থিসিসের দুই নম্বর ঝুঁকি ঘটেছে, তাই বেচার সিদ্ধান্ত নেব", en: "Risk two in the thesis has occurred, so I act on it" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই থিসিস লেখার পুরো উদ্দেশ্য। গত বছরের ব্যাখ্যা ছিল নতুন পণ্যশ্রেণির আগাম মজুদ; সেই ব্যাখ্যা সত্য হলে এই বছর মজুদ কমার কথা ছিল। কমেনি, তাই ব্যাখ্যাটা ভুল ছিল, আর যা ভুল প্রমাণিত হলো তা হলো ব্যবস্থাপনার বলা কথা, যা এই একটা সংখ্যার চেয়েও বড় তথ্য।",
                en: "Right, and this is the whole purpose of writing a thesis. Last year's explanation was stock built for a new line; had that been true, inventory should have fallen this year. It did not, so the explanation was wrong, and what was disproved is management's word, which is bigger information than the number.",
              },
            },
            {
              text: { bn: "আরেক বছর অপেক্ষা করি, হয়তো এবার অন্য কারণ আছে", en: "Wait one more year; perhaps there is a different reason this time" },
              why: {
                bn: "নতুন ব্যাখ্যা শোনা যেতে পারে, আর তখন প্রশ্নটা হলো ব্যাখ্যা কতগুলো লাগছে। আপনার থিসিসে ঝুঁকিটা নির্দিষ্ট করে লেখা ছিল ঠিক এই মুহূর্তে যাতে সিদ্ধান্তটা আবেগ দিয়ে না নিতে হয়। শর্ত পূরণ হয়েছে বলেই শর্তটা লেখা ছিল।",
                en: "A new explanation may be offered, and then the question becomes how many explanations are needed. Your thesis wrote the risk down precisely so that this moment would not require a fresh judgement. The condition was written because it might be met.",
              },
            },
            {
              text: { bn: "দাম দেখি, দাম না পড়লে ধরে রাখি", en: "Look at the price, and hold if it has not fallen" },
              why: {
                bn: "দাম আপনার থিসিসের অংশ ছিল না, আর এখন সেটাকে ঢোকানো মানে শর্তটা বদলে ফেলা। দাম না পড়া কেবল বলছে বাজার এখনো এটা লক্ষ করেনি, যা বেরোনোর জন্য সুবিধাজনক, ধরে রাখার কারণ নয়।",
                en: "The price was not part of your thesis, and admitting it now means rewriting the condition. A price that has not fallen only says the market has not noticed yet, which is convenient for leaving rather than a reason to stay.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "এই সাত ধাপের সবচেয়ে বড় শিক্ষা কী?",
            en: "What is the biggest lesson of these seven steps?",
          },
          options: [
            {
              text: { bn: "পদ্ধতিটা, কারণ পরের কোম্পানিতে সংখ্যা বদলাবে আর ধাপগুলো বদলাবে না", en: "The method, because on the next company the numbers change and the steps do not" },
              right: true,
              why: {
                bn: "ঠিক। একটা কোম্পানির সিদ্ধান্ত একবার কাজে লাগে; একটা পদ্ধতি শত বার কাজে লাগে। আর পদ্ধতির আরেকটা সুবিধা আছে: এটা লেখা থাকে, তাই ভুল হলে কোন ধাপে ভুল হয়েছে সেটা পরে খুঁজে বের করা যায়, আর সেভাবেই পদ্ধতিটা উন্নত হয়।",
                en: "Right. A decision about one company is used once; a method is used a hundred times. And a method has a second advantage: it is written down, so when something goes wrong you can find which step failed, and that is how the method improves.",
              },
            },
            {
              text: { bn: "এই কোম্পানিটা কেনা উচিত", en: "That this company is worth buying" },
              why: {
                bn: "কোম্পানিটা কাল্পনিক, তাই কেনার প্রশ্নই নেই। আর আসল কোম্পানি হলেও একটা সিদ্ধান্ত ছয় মাসে পুরনো হয়ে যায়, যখন নতুন প্রান্তিক ফলাফল আসে।",
                en: "The company is imaginary, so buying does not arise. And even for a real one, a decision goes stale in six months when new quarterly results arrive.",
              },
            },
            {
              text: { bn: "পিই ১২ এর নিচে হলে কেনা উচিত", en: "That anything below a PE of 12 is worth buying" },
              why: {
                bn: "এটা ঠিক সেই ধরনের নিয়ম যা এই সাত ধাপ ভাঙার চেষ্টা করে। একটা সংখ্যা একা কোনো সিদ্ধান্ত দেয় না; ১২ এখানে অর্থপূর্ণ কেবল কারণ এর আগের ছয়টা ধাপ চলেছে।",
                en: "That is exactly the kind of rule these seven steps exist to break. A single number decides nothing; 12 means something here only because the six steps before it were done.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"build-a-portfolio": {
  bn: `
<p>একটা কোম্পানি বাছাই করা আর একটা পোর্টফোলিও বানানো দুইটা আলাদা দক্ষতা। প্রথমটা নিয়ে আগের লেখাগুলো ছিল। এই লেখাটা দ্বিতীয়টা নিয়ে, আর মূল কথাটা হলো: <strong>একটা পোর্টফোলিও ভালো কোম্পানির তালিকা নয়, এটা একটা কাঠামো।</strong></p>

<p>দশটা চমৎকার কোম্পানি যদি সবই একই ধাক্কায় নড়ে, তাহলে সেটা একটা খারাপ পোর্টফোলিও, যদিও প্রতিটা সিদ্ধান্ত আলাদাভাবে ভালো ছিল।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>সংখ্যা নয়, কারণের বৈচিত্র্যই আসল বৈচিত্র্য।</li>
<li>আট থেকে পনেরোটা কোম্পানি বেশিরভাগ মানুষের জন্য যথেষ্ট।</li>
<li>এক কোম্পানিতে সর্বোচ্চ ১০%, এক খাতে সর্বোচ্চ ২৫% থেকে ৩০%।</li>
<li>আপনার চাকরি আর আপনার বাড়িও পোর্টফোলিওর অংশ।</li>
<li>নতুন টাকা দিয়ে সমন্বয় করা বেচে সমন্বয়ের চেয়ে সস্তা।</li>
</ul>
</div>

<h2>ওজনের কাঠামো</h2>

${mount("bp-figure")}

<p>শতাংশগুলো আইন নয়, শুরুর বিন্দু, আর প্রত্যেকের নিজের পরিস্থিতি অনুযায়ী বদলাবে। যা বদলায় না তা হলো নীতিটা: <strong>কোনো একটা সিদ্ধান্ত ভুল হলে সেটা যেন পুরো পরিকল্পনাকে না বদলায়।</strong></p>

<h2>কতগুলো কোম্পানি</h2>

<p>দুই দিক থেকে সীমা আছে। খুব কম হলে একটা দুর্ঘটনা অসম ক্ষতি করে। খুব বেশি হলে আপনি কোনোটাকেই সত্যিকারের নজরে রাখতে পারবেন না, আর তখন পোর্টফোলিওটা একটা সূচকের দুর্বল অনুকরণ হয়ে দাঁড়ায়, কেবল বেশি খরচে।</p>

<p>আট থেকে পনেরো একটা যুক্তিসঙ্গত পরিসর, আর সংখ্যাটা নির্ভর করে আপনি কত সময় দিতে পারেন তার উপর। প্রতিটা কোম্পানির জন্য বছরে দুই থেকে তিন ঘণ্টা লাগে, তাই বারোটা কোম্পানি বছরে ত্রিশ ঘণ্টার কাজ।</p>

<div class="note">
<p>যদি ত্রিশ ঘণ্টা না থাকে, তাহলে সেটা একটা সৎ উত্তর, আর তার সমাধানও সৎ: কম কোম্পানি রাখুন, অথবা একটা <a class="term" href="/money/terms/mutual-fund.html">তহবিলের</a> মাধ্যমে যান। যে পোর্টফোলিও আপনি চালাতে পারেন না সেটা আপনার পোর্টফোলিও নয়।</p>
</div>

<h2>বৈচিত্র্য মানে আলাদা কারণ</h2>

${mount("bp-lab")}

<p>যন্ত্রটাতে কোম্পানির সংখ্যা বাড়িয়ে দেখুন, আর তারপর খাতের সংখ্যা। খেয়াল করুন কোম্পানির সংখ্যা বাড়ালে যতটা উপকার হয়, খাতের সংখ্যা বাড়ালে তার চেয়ে বেশি। এটাই <a class="term" href="/money/basics-2/complements-substitutes.html">পরিপূরক আর বিকল্প</a> লেখার মূল কথাটা সংখ্যায়।</p>

<p>একটা ব্যবহারিক পরীক্ষা যা যেকোনো সময় করা যায়: প্রতিটা শেয়ারের পাশে এক বাক্যে লিখুন এর আয় কীসের উপর নির্ভর করে। তারপর গুনুন কতগুলো আলাদা বাক্য পেলেন। বারোটা শেয়ারে যদি পাঁচটা আলাদা বাক্য থাকে, তাহলে আপনার পাঁচটা বাজি আছে, বারোটা নয়।</p>

<h2>যা পোর্টফোলিওর অংশ আর মানুষ গোনে না</h2>

<p>তিনটা জিনিস। <strong>আপনার চাকরি</strong> সবচেয়ে বড় সম্পদ, আর সেটা একটা খাতের উপর বাজি। <strong>আপনার বাড়ি</strong>, যদি থাকে, সাধারণত আপনার মোট সম্পদের সবচেয়ে বড় একক অংশ। আর <strong>জরুরি তহবিল</strong>, যা বিনিয়োগ নয় কিন্তু পুরো কাঠামোটা দাঁড় করিয়ে রাখে।</p>

<p>এই তিনটা গোনার পরে ছবিটা প্রায়ই বদলে যায়। একজন ব্যাংক কর্মকর্তা যার সঞ্চয়ের ৪০% ব্যাংকের শেয়ারে, তার আসল ঘনত্ব যা দেখাচ্ছে তার চেয়ে অনেক বেশি।</p>

${mount("bp-compare")}

<h2>সমন্বয়, আর কখন</h2>

<p>সময়ের সঙ্গে ওজন সরে যায়: যেগুলো ভালো করে সেগুলোর ভাগ বাড়ে। এটাই স্বাভাবিক আর কাঙ্ক্ষিত, একটা সীমা পর্যন্ত। সীমাটা আপনার নিজের ঠিক করা সর্বোচ্চ শতাংশ।</p>

<p>সমন্বয়ের দুইটা উপায়, আর একটা অন্যটার চেয়ে সস্তা। <strong>নতুন টাকা দিয়ে</strong>: পরের কয়েক মাসের মাসিক অঙ্কটা কম ওজনের খাতে দিন। এতে কেবল কেনার খরচ লাগে। <strong>বেচে</strong>: দুই দিকের খরচ আর সম্ভাব্য কর। দ্বিতীয়টা তখনই দরকার যখন ওজনটা এত বেশি সরে গেছে যে নতুন টাকায় ঠিক হতে বছর লেগে যাবে।</p>

<p>কত ঘন ঘন? বছরে একবার যথেষ্ট, আর সেটাই <a class="term" href="/money/basics-3/your-first-review.html">বার্ষিক পর্যালোচনার</a> কাজ।</p>

${mount("bp-drill")}

<h2>একটা পোর্টফোলিও গড়ার ক্রম</h2>

<p>শূন্য থেকে শুরু করলে ক্রমটা এরকম। প্রথম বছর: তিন থেকে পাঁচটা কোম্পানি, আলাদা খাতে, প্রতিটা ছোট। দ্বিতীয় বছর: আরও তিন থেকে চারটা যোগ, আর প্রথম পাঁচটার থিসিস যাচাই। তৃতীয় বছর: সংখ্যাটা দশ থেকে বারোতে স্থির করা, আর তারপর নতুন টাকা মূলত যেগুলো আছে তাদের মধ্যেই।</p>

<p>এই ধীরগতিটা ইচ্ছাকৃত। প্রথম বছরে আপনি যা শিখবেন তা দ্বিতীয় বছরের সিদ্ধান্তগুলোকে বদলে দেবে, আর এক বছরে পুরো টাকা ঢেলে দিলে সেই শিক্ষাটা প্রয়োগ করার কিছু থাকে না।</p>

${mount("bp-quiz")}
`,
  en: `
<p>Choosing a company and building a portfolio are two different skills. The previous lessons covered the first. This one covers the second, and the central idea is this: <strong>a portfolio is not a list of good companies, it is a structure.</strong></p>

<p>Ten excellent companies that all move on the same shock make a bad portfolio, even though each decision was good on its own.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Real diversification is a variety of causes, not of names.</li>
<li>Eight to fifteen companies is enough for most people.</li>
<li>A maximum of 10% in one company and 25% to 30% in one sector.</li>
<li>Your job and your house are part of the portfolio too.</li>
<li>Rebalancing with new money is cheaper than rebalancing by selling.</li>
</ul>
</div>

<h2>The structure of weights</h2>

${mount("bp-figure")}

<p>The percentages are a starting point rather than a law, and each person's situation moves them. What does not move is the principle: <strong>no single decision going wrong should rewrite the whole plan.</strong></p>

<h2>How many companies</h2>

<p>There are limits from both directions. Too few and one accident does disproportionate damage. Too many and you cannot genuinely follow any of them, at which point the portfolio becomes a poor imitation of an index at a higher cost.</p>

<p>Eight to fifteen is a sensible range, and the number depends on the time you can give. Each company takes two to three hours a year, so twelve companies is thirty hours a year of work.</p>

<div class="note">
<p>If those thirty hours do not exist, that is an honest answer, and so is the remedy: hold fewer companies, or go through a <a class="term" href="/money/terms/mutual-fund.html">fund</a>. A portfolio you cannot run is not your portfolio.</p>
</div>

<h2>Diversification means different causes</h2>

${mount("bp-lab")}

<p>Raise the number of holdings in the tool, then raise the number of sectors. Notice that adding sectors helps more than adding companies. That is the central point of the lesson on <a class="term" href="/money/basics-2/complements-substitutes.html">complements and substitutes</a>, expressed as a number.</p>

<p>A practical test you can run at any time: beside each holding, write one sentence on what its earnings depend on. Then count the distinct sentences. If twelve holdings produce five distinct sentences, you have five bets rather than twelve.</p>

<h2>What belongs to the portfolio and nobody counts</h2>

<p>Three things. <strong>Your job</strong> is your largest asset and it is a bet on one sector. <strong>Your house</strong>, if you have one, is usually the single largest item in your net worth. And the <strong>emergency fund</strong>, which is not an investment and holds the whole structure up.</p>

<p>Counting those three often changes the picture. A bank employee with 40% of their savings in bank shares is far more concentrated than the savings alone suggest.</p>

${mount("bp-compare")}

<h2>Rebalancing, and when</h2>

<p>Weights drift over time: what does well grows as a share. That is natural and desirable, up to a limit. The limit is the maximum percentage you set yourself.</p>

<p>Two ways to rebalance, and one is cheaper. <strong>With new money</strong>: direct the next few months of contributions to the underweight sectors. That pays only the buying side. <strong>By selling</strong>: both sides of a trade plus any tax. The second is only needed when the weight has drifted so far that new money would take years to correct it.</p>

<p>How often? Once a year is enough, and that is the work of the <a class="term" href="/money/basics-3/your-first-review.html">annual review</a>.</p>

${mount("bp-drill")}

<h2>The order of building one</h2>

<p>Starting from nothing, the sequence looks like this. Year one: three to five companies in different sectors, each of them small. Year two: three or four more, and a check of the first five theses. Year three: settle the count at ten to twelve, after which new money mostly goes into what you already hold.</p>

<p>The slowness is deliberate. What you learn in the first year changes the decisions of the second, and putting all the money in during one year leaves nothing to apply that learning to.</p>

${mount("bp-quiz")}
`,
  blocks: {
    "bp-figure": {
      kind: "figure",
      shape: "stack",
      title: { bn: "একটা কাঠামোর উদাহরণ", en: "An example structure" },
      note: { bn: "শতাংশগুলো শুরুর বিন্দু, আইন নয়। নীতিটাই আসল।", en: "The percentages are a starting point rather than a law. The principle is the point." },
      parts: [
        {
          text: { bn: "জরুরি তহবিল", en: "Emergency fund" },
          note: { bn: "ছয় মাসের খরচ, বিনিয়োগের বাইরে। এটা না থাকলে বাকিটা ঝুঁকিতে, কারণ খারাপ সময়ে বেচতে বাধ্য হবেন।", en: "Six months of expenses, outside the investments. Without it the rest is at risk, because a bad month forces a sale." },
          value: 100,
          tone: "good",
        },
        {
          text: { bn: "বড় ও স্থিতিশীল কোম্পানি", en: "Large and stable companies" },
          note: { bn: "বিনিয়োগের ৫০% থেকে ৬০%। ধীরে বাড়ে, কম পড়ে, আর ঘুম নষ্ট করে না।", en: "50% to 60% of the investments. Slower to rise, less to fall, and they do not cost you sleep." },
          value: 55,
        },
        {
          text: { bn: "মাঝারি আকারের কোম্পানি", en: "Mid-sized companies" },
          note: { bn: "২৫% থেকে ৩০%। এখানেই বেশিরভাগ সুযোগ, আর বেশিরভাগ কাজও।", en: "25% to 30%. Most of the opportunity is here, and so is most of the work." },
          value: 28,
        },
        {
          text: { bn: "উঁচু ঝুঁকির অবস্থান", en: "Higher-risk positions" },
          note: { bn: "১০% এর বেশি নয়, আর এই অংশটা পুরো হারালেও পরিকল্পনা টিকবে।", en: "No more than 10%, and losing all of it should leave the plan standing." },
          value: 10,
          tone: "warn",
        },
        {
          text: { bn: "নগদ, সুযোগের জন্য", en: "Cash, for opportunities" },
          note: { bn: "৫% থেকে ১০%। বাজার পড়লে এটাই সেই টাকা যা আপনাকে ক্রেতা রাখে, বিক্রেতা নয়।", en: "5% to 10%. In a fall this is the money that keeps you a buyer rather than a seller." },
          value: 7,
        },
      ],
      caption: {
        bn: "উপরের অংশটা বিনিয়োগ নয় আর সেটাই সবচেয়ে গুরুত্বপূর্ণ। জরুরি তহবিল ছাড়া বাকি কাঠামোটা একটা খারাপ মাসেই ভেঙে পড়ে।",
        en: "The top band is not an investment and it is the most important part. Without it the rest of the structure collapses in one bad month.",
      },
    },
    "bp-lab": {
      kind: "lab",
      model: "diversify",
      title: { bn: "কতগুলো, আর কত খাতে", en: "How many, and across how many sectors" },
      note: { bn: "প্রথমে কোম্পানির সংখ্যা বাড়ান, তারপর খাতের সংখ্যা। পার্থক্যটা লক্ষ করুন।", en: "Raise the number of holdings first, then the number of sectors. Notice the difference." },
      preset: { holdings: 10, biggest: 18, sectors: 5 },
    },
    "bp-compare": {
      kind: "compare",
      title: { bn: "দুইটা পোর্টফোলিও, একই সংখ্যা", en: "Two portfolios, the same count" },
      note: { bn: "দুইজনেরই দশটা কোম্পানি। বৈচিত্র্য এক নয়।", en: "Both hold ten companies. The diversification is not the same." },
      columns: [
        { bn: "প্রথমজন", en: "The first" },
        { bn: "দ্বিতীয়জন", en: "The second" },
      ],
      rows: [
        {
          label: { bn: "কোম্পানির সংখ্যা", en: "Number of holdings" },
          cells: [{ bn: "১০", en: "10" }, { bn: "১০", en: "10" }],
        },
        {
          label: { bn: "আলাদা খাত", en: "Distinct sectors" },
          cells: [{ bn: "২", en: "2" }, { bn: "৬", en: "6" }],
          best: 1,
        },
        {
          label: { bn: "আলাদা চালিকাশক্তি", en: "Distinct drivers" },
          cells: [{ bn: "২", en: "2" }, { bn: "৫", en: "5" }],
          best: 1,
        },
        {
          label: { bn: "সবচেয়ে বড় অবস্থান", en: "Largest position" },
          cells: [{ bn: "৩২%", en: "32%" }, { bn: "১৪%", en: "14%" }],
          best: 1,
        },
        {
          label: { bn: "চাকরি কোন খাতে", en: "Which sector the job is in" },
          cells: [
            { bn: "সবচেয়ে বড় খাতেই", en: "The same as the largest holding" },
            { bn: "যেখানে বিনিয়োগ কম", en: "One where investment is light" },
          ],
          best: 1,
        },
        {
          label: { bn: "একটা খাতের সংকটে", en: "In a sector crisis" },
          cells: [
            { bn: "আয় আর সঞ্চয় একসঙ্গে চাপে", en: "Income and savings under pressure together" },
            { bn: "একটা অংশ পড়ে, বাকিটা দাঁড়িয়ে", en: "One part falls and the rest stands" },
          ],
          best: 1,
        },
      ],
    },
    "bp-drill": {
      kind: "drill",
      title: { bn: "নিজের পোর্টফোলিওটা ছকে বসান", en: "Put your own portfolio into a table" },
      note: { bn: "একটা স্প্রেডশিট, চল্লিশ মিনিট। বছরে একবার করলেই চলে।", en: "A spreadsheet, forty minutes. Once a year is enough." },
      steps: [
        {
          text: { bn: "প্রতিটা শেয়ারের নাম, বর্তমান মূল্য আর মোট বিনিয়োগের শতাংশ লিখুন।", en: "List each holding, its current value and its percentage of the total." },
        },
        {
          text: { bn: "প্রতিটার পাশে খাত লিখুন, আর খাত অনুযায়ী শতাংশ যোগ করুন।", en: "Add the sector beside each and total the percentages by sector." },
        },
        {
          text: { bn: "প্রতিটার পাশে এক বাক্যে লিখুন এর আয় কীসের উপর নির্ভর করে।", en: "Beside each, write one sentence on what its earnings depend on." },
          hint: { bn: "তারপর গুনুন কতগুলো সত্যিই আলাদা বাক্য পেলেন।", en: "Then count how many genuinely distinct sentences you have." },
        },
        {
          text: { bn: "আপনার চাকরি বা ব্যবসা কোন খাতে, সেটাও একটা সারি হিসেবে যোগ করুন।", en: "Add your job or business as a row, with its sector." },
        },
        {
          text: { bn: "সবচেয়ে বড় অবস্থান আর সবচেয়ে বড় খাত চিহ্নিত করুন।", en: "Mark the largest position and the largest sector." },
        },
        {
          text: { bn: "যেগুলো আপনার সীমা ছাড়িয়েছে, সেগুলোর জন্য একটা সমন্বয়ের পরিকল্পনা লিখুন।", en: "For anything past your limit, write a plan to rebalance." },
          hint: { bn: "প্রথমে নতুন টাকা দিয়ে চেষ্টা করুন; বেচা শেষ উপায়।", en: "Try new money first; selling is the last resort." },
        },
      ],
    },
    "bp-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার একটা শেয়ার ভালো করতে করতে মোট পোর্টফোলিওর ২২% হয়ে গেছে, আর আপনার সীমা ছিল ১২%। যুক্তি অক্ষত। কী করবেন?",
            en: "One holding has grown to 22% of the portfolio against a limit of 12%. The argument is intact. What do you do?",
          },
          options: [
            {
              text: { bn: "প্রথমে নতুন টাকা অন্য খাতে দিই, আর সেটা যথেষ্ট না হলে কিছুটা বেচি", en: "Direct new money elsewhere first, and sell some only if that is not enough" },
              right: true,
              why: {
                bn: "ঠিক, আর ক্রমটাও ঠিক। নতুন টাকা দিয়ে সমন্বয় করলে কেবল কেনার দিকের খরচ লাগে আর কোনো কর সামনে আসে না। কিন্তু ২২% থেকে ১২% এ নামা নতুন টাকায় অনেক সময় নেবে, তাই আংশিক বিক্রি সম্ভবত লাগবে। যতটুকু লাগে ততটুকুই, বেশি নয়।",
                en: "Right, and in that order. Rebalancing with new money pays only the buying side and brings no tax forward. But going from 22% to 12% on new money alone would take a long time, so a partial sale is probably needed. Only as much as the limit requires, and no more.",
              },
            },
            {
              text: { bn: "কিছুই করি না, কারণ যুক্তি অক্ষত", en: "Do nothing, because the argument is intact" },
              why: {
                bn: "যুক্তি অক্ষত থাকা কেবল বলে কোম্পানিটা এখনো ভালো, আর সীমাটা কোম্পানির মান নিয়ে নয়, আপনার ঝুঁকি নিয়ে। ২২% এক জায়গায় থাকা মানে একটা অপ্রত্যাশিত ঘটনা আপনার পুরো পরিকল্পনা বদলে দিতে পারে, আর অপ্রত্যাশিত ঘটনা সংজ্ঞা অনুযায়ী থিসিসে লেখা থাকে না।",
                en: "An intact argument says only that the company is still good, and the limit is not about the company's quality but about your risk. 22% in one place means an unexpected event can rewrite the plan, and unexpected events are by definition not in the thesis.",
              },
            },
            {
              text: { bn: "পুরোটা বেচে দিই, ২২% অনেক বেশি", en: "Sell all of it; 22% is far too much" },
              why: {
                bn: "পুরোটা বেচার কারণ হলো যুক্তি ভেঙে যাওয়া, আর সেটা এখানে ঘটেনি। সীমা লঙ্ঘনের উত্তর হলো অতিরিক্তটা বেচা, পুরোটা নয়। ভালো ব্যবসা থেকে সম্পূর্ণ বেরিয়ে যাওয়াটাই দীর্ঘমেয়াদে সবচেয়ে ব্যয়বহুল ভুল।",
                en: "Selling all of it is the answer to a broken argument, which has not happened. The answer to a breached limit is selling the excess. Leaving a good business entirely is the most expensive long-run mistake there is.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একজনের বারোটা শেয়ার আছে, আর প্রতিটার আয় নির্ভর করে দেশের নির্মাণ কার্যক্রমের উপর। তার কতগুলো বাজি আছে?",
            en: "Someone holds twelve shares, and every one of them depends on construction activity. How many bets do they have?",
          },
          options: [
            {
              text: { bn: "একটা", en: "One" },
              right: true,
              why: {
                bn: "ঠিক। বৈচিত্র্যের পরিমাপ নামের সংখ্যা নয়, আলাদা কারণের সংখ্যা। নির্মাণ থামলে বারোটাই একসঙ্গে পড়বে, তাই ঝুঁকির দিক থেকে এটা একটা অবস্থান, বারোটা নয়। এটাই সেই ফাঁদ যা দেখতে সবচেয়ে বেশি বৈচিত্র্যময় লাগে।",
                en: "Right. Diversification is measured in distinct causes rather than in names. If construction stops, all twelve fall together, so in risk terms this is one position rather than twelve. It is the trap that looks most diversified from outside.",
              },
            },
            {
              text: { bn: "বারোটা", en: "Twelve" },
              why: {
                bn: "বারোটা কোম্পানি ঠিকই, আর তারা স্বাধীন নয়। একটা ভালো পরীক্ষা হলো জিজ্ঞেস করা: কী ঘটলে এদের সবার আয় একসঙ্গে কমবে? উত্তরটা যদি একটা বাক্যে দেওয়া যায়, তাহলে এটা একটা বাজি।",
                en: "Twelve companies, and not twelve independent ones. A good test is to ask: what single event would reduce all their earnings at once? If the answer fits in one sentence, this is one bet.",
              },
            },
            {
              text: { bn: "নির্ভর করে কোম্পানিগুলো কত বড় তার উপর", en: "It depends on how large the companies are" },
              why: {
                bn: "আকার ঠিক করে ধাক্কাটা কতটা লাগবে, ধাক্কাটা একসঙ্গে লাগবে কি না সেটা নয়। বড় আর ছোট দুইটা সিমেন্ট কোম্পানিই নির্মাণ থামলে ক্ষতিগ্রস্ত হবে।",
                en: "Size decides how hard the shock lands, not whether it lands on all of them at once. A large and a small cement company both suffer when construction stops.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"your-first-review": {
  bn: `
<p>এটা পর্যায় তিনের শেষ লেখা, আর এটা একটা অভ্যাস নিয়ে যা বাকি সবকিছুকে কাজে লাগায়। বছরে একবার, একটা নির্দিষ্ট দিনে, আপনি বসবেন আর নিজের পুরো পরিকল্পনাটা দেখবেন।</p>

<p>এই একটা দিনই আপনাকে একজন পাঠক থেকে একজন বিনিয়োগকারীতে বদলে দেয়, কারণ এখানেই আপনার লেখা যুক্তিগুলো বাস্তবতার সঙ্গে মিলিয়ে দেখা হয়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বছরে একবার, একটা নির্দিষ্ট তারিখে, দুই থেকে তিন ঘণ্টা।</li>
<li>ছয়টা কাজ, আর ক্রমটা গুরুত্বপূর্ণ।</li>
<li>প্রতিটা থিসিস খুলে ঝুঁকিগুলো যাচাই করা।</li>
<li>ওজন দেখা, আর সীমা ছাড়ালে পরিকল্পনা করা।</li>
<li>পরের বছরের জন্য একটা লেখা সিদ্ধান্ত, তিন লাইনে।</li>
</ul>
</div>

<h2>কখন, আর কেন নির্দিষ্ট দিন</h2>

<p>একটা নির্দিষ্ট তারিখ বাছুন আর সেটা প্রতি বছর একই রাখুন। বাংলাদেশে বেশিরভাগ কোম্পানির বার্ষিক প্রতিবেদন প্রকাশের কয়েক মাস পরে করলে সবচেয়ে বেশি তথ্য হাতে থাকে।</p>

<p>নির্দিষ্ট দিন কেন? কারণ "যখন সময় পাব" মানে বাজার যখন খারাপ, আর তখন পর্যালোচনাটা হয়ে দাঁড়ায় একটা আতঙ্কের প্রতিক্রিয়া। একটা ক্যালেন্ডারে বসানো দিন আপনাকে শান্ত অবস্থায় ভাবতে বাধ্য করে।</p>

<h2>ছয়টা কাজ</h2>

${mount("fr-steps")}

<p>ক্রমটা ইচ্ছাকৃত: থিসিস আগে, ওজন পরে, আর ফলাফল সবার শেষে। ফলাফল দিয়ে শুরু করলে বাকি সব কাজ সেই ফলাফলের ব্যাখ্যা হয়ে দাঁড়ায়, আর সেটাই <a class="term" href="/money/basics-3/your-own-biases.html">নিজের পক্ষে খোঁজার</a> ফাঁদ।</p>

<h2>কাজ এক: থিসিস যাচাই</h2>

<p>প্রতিটা শেয়ারের থিসিস খুলুন আর কেবল ঝুঁকির অংশটা পড়ুন। প্রতিটা ঝুঁকির পাশে লিখুন: ঘটেছে, ঘটেনি, নাকি ঘটার পথে।</p>

<p>ঘটে থাকলে সিদ্ধান্তটা ইতিমধ্যে নেওয়া আছে, আর আপনার কাজ কেবল সেটা কার্যকর করা। এই মুহূর্তে যুক্তি খুঁজতে বসাটাই সেই জিনিস যা থিসিসটা ঠেকাতে এসেছিল।</p>

<h2>কাজ দুই: যেগুলোর থিসিস মনে নেই</h2>

<p>প্রায় প্রতিটা পর্যালোচনায় দুই একটা এমন শেয়ার বেরোয় যার থিসিস লেখা হয়নি বা লেখা থাকলেও এখন আর অর্থবহ মনে হয় না।</p>

<p>এদের জন্য একটা সরল নিয়ম: হয় আজ একটা থিসিস লিখুন, নয়তো বেচে দিন। যে অবস্থানের পেছনে আজকের তারিখে একটা কারণ লেখা যায় না, সেটা একটা অভ্যাস, একটা বিনিয়োগ নয়।</p>

${mount("fr-order")}

<h2>কাজ তিন আর চার: ওজন আর খরচ</h2>

<p>ওজনের ছকটা <a class="term" href="/money/basics-3/build-a-portfolio.html">আগের লেখায়</a> আছে। যা দেখার: কোনো অবস্থান বা খাত সীমা ছাড়িয়েছে কি না, আর ছাড়ালে নতুন টাকা দিয়ে ঠিক করা যাবে কি না।</p>

<p>খরচের হিসাবটা অস্বস্তিকর আর দরকারি। গত বছরের সব কনট্রাক্ট নোট থেকে মোট কমিশন যোগ করুন, তারপর সেটাকে পোর্টফোলিওর মূল্য দিয়ে ভাগ করুন। সংখ্যাটা ১% ছাড়ালে প্রশ্ন করুন কেন এত লেনদেন হলো।</p>

<h2>কাজ পাঁচ: ফলাফল, আর সঠিক তুলনা</h2>

<p>এবার ফলাফল। কিন্তু একটা সংখ্যা একা অর্থহীন, তাই তুলনা লাগে। তিনটা তুলনা কাজের: সূচকের সঙ্গে, একটা এফডিআরের সঙ্গে, আর <a class="term" href="/money/terms/inflation.html">মূল্যস্ফীতির</a> সঙ্গে।</p>

<p>সবচেয়ে গুরুত্বপূর্ণ তুলনাটা শেষেরটা। যদি আপনার রিটার্ন মূল্যস্ফীতির নিচে থাকে, তাহলে সংখ্যায় বাড়লেও আপনার ক্রয়ক্ষমতা কমেছে, আর সেটাই আসল হিসাব।</p>

<div class="note">
<p>এক বছরের ফলাফল প্রায় কিছুই বলে না, আর এটা মনে রাখা কঠিন। একটা ভালো পদ্ধতি এক বছরে খারাপ ফল দিতে পারে আর একটা খারাপ পদ্ধতি ভালো। তিন বছরের আগে ফলাফল দিয়ে পদ্ধতি বিচার করা উচিত নয়; তার আগে যা বিচার করা যায় তা হলো আপনি নিজের নিয়ম মেনেছেন কি না।</p>
</div>

<h2>কাজ ছয়: পরের বছরের সিদ্ধান্ত</h2>

<p>তিন লাইন, আর তিনটাই নির্দিষ্ট। এই বছর মাসে কত রাখব। কোন খাতে ওজন বাড়াব। আর কোন একটা জিনিস আমি ভালো করব, যেমন প্রতিটা প্রান্তিক ফলাফল পড়া বা বেচার আগে সাত দিন অপেক্ষা করা।</p>

<p>এই তিন লাইন লিখে তারিখ বসিয়ে রাখুন, আর পরের বছরের পর্যালোচনায় প্রথম কাজ হবে এই তিন লাইন পড়া।</p>

${mount("fr-drill")}

<h2>এই পর্যায়টা এখানেই শেষ</h2>

<p>পর্যায় শূন্য থেকে তিন পর্যন্ত আপনি যা শিখেছেন তা একটা সম্পূর্ণ পদ্ধতি: টাকার ঘর গোছানো, বাজারের শব্দভাণ্ডার, বাজার কেন নড়ে, আর একটা কোম্পানি নিজে যাচাই করা। এর পরে যা আসে তা এই ভিত্তির উপর, আর ভিত্তিটাই সবচেয়ে বেশি সময় ধরে কাজে লাগবে।</p>

<p>শেষ একটা কথা, যা এই পুরো স্কুলটার সারাংশ: <strong>বিনিয়োগে যা আপনাকে এগিয়ে রাখে তা বুদ্ধি নয়, ধৈর্য আর লেখা নিয়ম।</strong> বুদ্ধিমান মানুষ প্রচুর, আর যারা নিজের লেখা নিয়ম মেনে দশ বছর চলেন তারা কম।</p>

${mount("fr-quiz")}
`,
  en: `
<p>This is the last lesson of stage three, and it is about a habit that puts everything else to work. Once a year, on a fixed day, you sit down and look at the whole plan.</p>

<p>That single day is what turns a reader into an investor, because it is where your written arguments meet reality.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Once a year, on a fixed date, two to three hours.</li>
<li>Six tasks, and the order matters.</li>
<li>Open every thesis and test the risks in it.</li>
<li>Check the weights, and plan a rebalance where a limit is breached.</li>
<li>A written decision for the coming year, in three lines.</li>
</ul>
</div>

<h2>When, and why a fixed day</h2>

<p>Pick a date and keep it the same every year. A few months after most annual reports are published gives you the most information to work with.</p>

<p>Why fixed? Because "when I get time" turns out to mean when the market is bad, and then the review becomes a reaction to fear. A date in the calendar forces the thinking to happen while you are calm.</p>

<h2>The six tasks</h2>

${mount("fr-steps")}

<p>The order is deliberate: theses first, weights next, and performance last. Starting from performance turns every other task into an explanation of it, which is the <a class="term" href="/money/basics-3/your-own-biases.html">looking-for-agreement</a> trap.</p>

<h2>Task one: test the theses</h2>

<p>Open each holding's thesis and read only the risks. Beside each risk write: happened, did not happen, or on its way.</p>

<p>If one happened, the decision has already been made and your job is to carry it out. Sitting down to find reasons at this moment is exactly what the thesis was written to prevent.</p>

<h2>Task two: the ones with no thesis</h2>

<p>Nearly every review turns up a holding or two whose thesis was never written, or was written and no longer means anything.</p>

<p>A simple rule for these: either write a thesis today, or sell. A position for which no reason can be written down on today's date is a habit rather than an investment.</p>

${mount("fr-order")}

<h2>Tasks three and four: weights and costs</h2>

<p>The weights table is in the <a class="term" href="/money/basics-3/build-a-portfolio.html">previous lesson</a>. What to look at: whether any position or sector is past its limit, and whether new money can correct it.</p>

<p>The cost calculation is uncomfortable and necessary. Add the commissions from last year's contract notes and divide by the value of the portfolio. If the number is above 1%, ask why there was so much trading.</p>

<h2>Task five: performance, and the right comparison</h2>

<p>Now performance. A number alone means nothing, so it needs comparisons. Three are useful: the index, a fixed deposit, and <a class="term" href="/money/terms/inflation.html">inflation</a>.</p>

<p>The last is the most important. If your return is below inflation then your purchasing power fell even though the number rose, and purchasing power is the real accounting.</p>

<div class="note">
<p>One year of performance says almost nothing, and that is hard to remember. A good method can have a bad year and a bad method a good one. Judging a method by results before three years is premature; what can be judged sooner is whether you kept to your own rules.</p>
</div>

<h2>Task six: next year's decision</h2>

<p>Three lines, all of them specific. How much a month I will put in this year. Which sector I will add weight to. And one thing I will do better, such as reading every quarterly result, or waiting seven days before any sale.</p>

<p>Write the three lines, date them, and make reading them the first task of next year's review.</p>

${mount("fr-drill")}

<h2>This stage ends here</h2>

<p>What you have learnt across stages zero to three is a complete method: getting the money side in order, the market's vocabulary, why markets move, and checking a company for yourself. What comes after builds on this foundation, and the foundation is what stays useful longest.</p>

<p>One last thing, which is the summary of this whole school: <strong>what puts you ahead in investing is not intelligence but patience and written rules.</strong> Intelligent people are plentiful; people who follow their own written rules for ten years are not.</p>

${mount("fr-quiz")}
`,
  blocks: {
    "fr-steps": {
      kind: "figure",
      shape: "steps",
      title: { bn: "বার্ষিক পর্যালোচনার ছয়টা কাজ", en: "The six tasks of an annual review" },
      note: { bn: "দুই থেকে তিন ঘণ্টা, বছরে একবার, একটা নির্দিষ্ট দিনে।", en: "Two to three hours, once a year, on a fixed day." },
      parts: [
        { text: { bn: "থিসিস যাচাই", en: "Test the theses" }, note: { bn: "কেবল ঝুঁকির অংশ। ঘটেছে, ঘটেনি, নাকি ঘটার পথে।", en: "Only the risks. Happened, did not, or on its way." }, tone: "lead" },
        { text: { bn: "যেগুলোর থিসিস নেই", en: "The ones with no thesis" }, note: { bn: "আজ লিখুন, নয়তো বেচুন। তৃতীয় কোনো পথ নেই।", en: "Write one today or sell. There is no third option." }, tone: "warn" },
        { text: { bn: "ওজন দেখা", en: "Check the weights" }, note: { bn: "অবস্থান আর খাত, দুইটাই, নিজের সীমার বিপরীতে।", en: "Positions and sectors both, against your own limits." } },
        { text: { bn: "খরচ যোগ করা", en: "Add up the costs" }, note: { bn: "গত বছরের কমিশন ভাগ পোর্টফোলিওর মূল্য। ১% এর বেশি হলে প্রশ্ন।", en: "Last year's commission over the portfolio's value. Above 1% raises a question." } },
        { text: { bn: "ফলাফল, তিনটা তুলনায়", en: "Performance, against three things" }, note: { bn: "সূচক, এফডিআর আর মূল্যস্ফীতি। শেষেরটাই আসল।", en: "The index, a deposit and inflation. The last is the real one." } },
        { text: { bn: "পরের বছরের তিন লাইন", en: "Three lines for next year" }, note: { bn: "মাসিক অঙ্ক, কোন খাতে ওজন, আর একটা জিনিস ভালো করা।", en: "The monthly amount, which sector to add to, and one thing to do better." }, tone: "good" },
      ],
      caption: {
        bn: "ফলাফল পঞ্চম কাজ, প্রথম নয়। ফলাফল দিয়ে শুরু করলে বাকি পাঁচটা সেই ফলাফলের ব্যাখ্যা হয়ে দাঁড়ায়।",
        en: "Performance is the fifth task rather than the first. Starting there turns the other five into an explanation of it.",
      },
    },
    "fr-order": {
      kind: "order",
      title: { bn: "পর্যালোচনার দিনটার ক্রম", en: "The order of the review day" },
      note: { bn: "শান্ত অবস্থায়, নির্দিষ্ট তারিখে।", en: "Calmly, on the fixed date." },
      items: [
        {
          text: { bn: "গত বছরের তিন লাইনের সিদ্ধান্তটা পড়ুন", en: "Read last year's three-line decision" },
          why: { bn: "যা করব বলেছিলেন তা করেছেন কি না, এটাই সবচেয়ে সৎ পরিমাপ।", en: "Whether you did what you said you would is the most honest measure there is." },
        },
        {
          text: { bn: "প্রতিটা থিসিসের ঝুঁকির অংশ যাচাই করুন", en: "Test the risk section of every thesis" },
        },
        {
          text: { bn: "যেগুলোর থিসিস নেই, সেগুলো আলাদা করুন", en: "Set aside anything with no thesis" },
        },
        {
          text: { bn: "ওজনের ছক বানান আর সীমা মিলিয়ে দেখুন", en: "Build the weights table and check it against your limits" },
        },
        {
          text: { bn: "গত বছরের মোট খরচ যোগ করুন", en: "Add up last year's costs" },
        },
        {
          text: { bn: "ফলাফল তিনটা তুলনায় বসান", en: "Set performance against the three comparisons" },
          why: { bn: "শেষে, যাতে সংখ্যাটা আগের ধাপগুলোকে প্রভাবিত না করে।", en: "Last, so the number cannot colour the earlier steps." },
        },
        {
          text: { bn: "পরের বছরের তিন লাইন লিখে তারিখ বসান", en: "Write and date next year's three lines" },
        },
      ],
    },
    "fr-drill": {
      kind: "drill",
      title: { bn: "আপনার প্রথম পর্যালোচনা", en: "Your first review" },
      note: { bn: "আজই করা যায়, এমনকি আপনার কিছু না থাকলেও: তখন এটা একটা পরিকল্পনা।", en: "It can be done today, even with nothing invested: then it is a plan." },
      steps: [
        {
          text: { bn: "ক্যালেন্ডারে একটা তারিখ বসান, আর প্রতি বছর সেটাই রাখুন।", en: "Put a date in the calendar and keep it every year." },
        },
        {
          text: { bn: "প্রতিটা শেয়ারের থিসিস খুলুন, আর যেগুলোর নেই সেগুলো তালিকা করুন।", en: "Open each holding's thesis, and list the ones that have none." },
        },
        {
          text: { bn: "প্রতিটা থিসিসের ঝুঁকিগুলোর পাশে ঘটেছে বা ঘটেনি লিখুন।", en: "Beside each risk write happened or did not happen." },
        },
        {
          text: { bn: "ওজনের ছক বানান: শেয়ার, শতাংশ, খাত।", en: "Build the weights table: holding, percentage, sector." },
        },
        {
          text: { bn: "গত বছরের কমিশন যোগ করে শতাংশে বের করুন।", en: "Add last year's commissions and express them as a percentage." },
          hint: { bn: "কনট্রাক্ট নোটগুলো লাগবে, আর এই কারণেই সেগুলো রাখা।", en: "You will need the contract notes, which is why they are kept." },
        },
        {
          text: { bn: "আপনার রিটার্ন গত বছরের মূল্যস্ফীতির সঙ্গে তুলনা করুন।", en: "Compare your return with last year's inflation." },
        },
        {
          text: { bn: "পরের বছরের তিন লাইন লিখুন আর তারিখ বসান।", en: "Write next year's three lines and date them." },
        },
      ],
    },
    "fr-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "পর্যালোচনায় ফলাফল কেন প্রথমে দেখা উচিত নয়?",
            en: "Why should performance not be the first thing you look at in a review?",
          },
          options: [
            {
              text: { bn: "কারণ ফলাফল জানা থাকলে বাকি কাজগুলো সেই ফলাফলের ব্যাখ্যা হয়ে দাঁড়ায়", en: "Because knowing it turns the other tasks into an explanation of it" },
              right: true,
              why: {
                bn: "ঠিক। ভালো বছর হলে আপনি প্রতিটা থিসিসে সমর্থন খুঁজে পাবেন, খারাপ বছর হলে প্রতিটাতে দোষ। থিসিসগুলো আগে যাচাই করলে যাচাইটা সৎ থাকে, কারণ তখন আপনি জানেন না উত্তরটা কোন দিকে যাওয়া উচিত।",
                en: "Right. After a good year you will find support in every thesis and after a bad one you will find fault in every one. Testing the theses first keeps the test honest, because you do not yet know which way the answer is supposed to come out.",
              },
            },
            {
              text: { bn: "কারণ ফলাফল গুরুত্বপূর্ণ নয়", en: "Because performance does not matter" },
              why: {
                bn: "ফলাফল অবশ্যই গুরুত্বপূর্ণ, আর সেই কারণেই এটা পর্যালোচনার একটা কাজ। প্রশ্নটা গুরুত্ব নিয়ে নয়, ক্রম নিয়ে।",
                en: "Performance certainly matters, which is why it is one of the tasks. The question is about order rather than importance.",
              },
            },
            {
              text: { bn: "কারণ এক বছরের ফলাফল হিসাব করা কঠিন", en: "Because a one-year return is hard to calculate" },
              why: {
                bn: "হিসাবটা কঠিন নয়, বিশেষ করে যদি আপনি লেনদেনের রেকর্ড রাখেন। ক্রমের কারণটা মনস্তাত্ত্বিক, গাণিতিক নয়।",
                en: "The calculation is not hard, especially with transaction records. The reason for the order is psychological rather than arithmetical.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "পর্যালোচনায় দেখা গেল একটা শেয়ার আপনার কাছে দুই বছর ধরে আছে আর আপনি মনে করতে পারছেন না কেন কিনেছিলেন। কী করবেন?",
            en: "The review turns up a holding of two years for which you cannot remember the reason. What do you do?",
          },
          options: [
            {
              text: { bn: "আজ একটা থিসিস লিখি, আর না লিখতে পারলে বেচে দিই", en: "Write a thesis today, and sell if I cannot write one" },
              right: true,
              why: {
                bn: "ঠিক, আর এটা কঠিন শোনালেও ন্যায্য। আপনার সব টাকা প্রতিটা মুহূর্তে কোথাও না কোথাও আছে, তাই প্রশ্নটা কখনোই এই নয় যে বেচব কি না; প্রশ্নটা হলো আজকের তারিখে এটা রাখার একটা কারণ আছে কি না। কারণ লিখতে পারলে রাখুন, না পারলে সেই টাকা এমন কোথাও যাক যেখানে একটা কারণ আছে।",
                en: "Right, and though it sounds harsh it is fair. All your money is somewhere at every moment, so the question is never whether to sell; it is whether there is a reason to hold this on today's date. If you can write one, hold. If not, that money should sit somewhere that has one.",
              },
            },
            {
              text: { bn: "রেখে দিই, দুই বছর ধরে আছে যখন", en: "Keep it; it has been there two years already" },
              why: {
                bn: "সময় কোনো কারণ তৈরি করে না। দুই বছর ধরে থাকা কেবল বলে দুই বছর ধরে প্রশ্নটা করা হয়নি। এই ধরনের অবস্থানগুলোই ধীরে ধীরে একটা পোর্টফোলিওকে একটা সংগ্রহে বদলে দেয়।",
                en: "Time does not create a reason. Two years only means the question went unasked for two years. Positions like these are what slowly turn a portfolio into a collection.",
              },
            },
            {
              text: { bn: "লাভে থাকলে রাখি, লোকসানে থাকলে বেচি", en: "Keep it if it is up and sell it if it is down" },
              why: {
                bn: "এটা কেনা দামকে সিদ্ধান্তের ভিত্তি বানাচ্ছে, আর বাজার আপনার কেনা দাম জানে না। প্রশ্নটা ভবিষ্যৎ নিয়ে, অতীত নিয়ে নয়।",
                en: "That makes your purchase price the basis of the decision, and the market does not know your purchase price. The question is about the future rather than the past.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "প্রথম বছরে আপনার রিটার্ন সূচকের চেয়ে কম। এটা কী প্রমাণ করে?",
            en: "In your first year your return is below the index. What does that prove?",
          },
          options: [
            {
              text: { bn: "প্রায় কিছুই না, এক বছর পদ্ধতি বিচারের জন্য যথেষ্ট নয়", en: "Almost nothing; one year is not enough to judge a method" },
              right: true,
              why: {
                bn: "ঠিক। এক বছরে ভাগ্যের অংশ পদ্ধতির অংশের চেয়ে বড়, দুই দিকেই। যা এক বছরে বিচার করা যায় তা হলো আপনি নিজের নিয়ম মেনেছেন কি না: থিসিস লিখেছেন কি না, সীমা মেনেছেন কি না, অপ্রয়োজনীয় লেনদেন এড়িয়েছেন কি না। এগুলো আপনার নিয়ন্ত্রণে আর ফলাফল নয়।",
                en: "Right. Over one year luck outweighs method, in both directions. What can be judged in a year is whether you kept to your own rules: whether the theses were written, the limits respected, the unnecessary trades avoided. Those are in your control and the result is not.",
              },
            },
            {
              text: { bn: "আমার পদ্ধতি কাজ করছে না, তাই বদলানো উচিত", en: "My method is not working, so I should change it" },
              why: {
                bn: "এক বছরের ফলাফলে পদ্ধতি বদলানো সবচেয়ে সাধারণ আর সবচেয়ে ব্যয়বহুল ভুলগুলোর একটা, কারণ এতে আপনি প্রতি বছর একটা নতুন পদ্ধতি শুরু করেন আর কোনোটাকেই যথেষ্ট সময় দেন না।",
                en: "Changing a method on one year's result is among the commonest and costliest mistakes, because it means starting a new method every year and giving none of them enough time.",
              },
            },
            {
              text: { bn: "সূচক কিনলেই ভালো হতো", en: "It would have been better to buy the index" },
              why: {
                bn: "এক বছরের ভিত্তিতে বলা যায় না, আর দীর্ঘমেয়াদে এটা অনেকের জন্য সত্যিও হতে পারে। কিন্তু সেই সিদ্ধান্তটা কয়েক বছরের তথ্য আর নিজের সময় ও আগ্রহের হিসাব করে নেওয়ার কথা, একটা বছরের সংখ্যা দেখে নয়।",
                en: "Not from one year, and over the long run it may well be true for many people. But that decision should come from several years of evidence and an honest accounting of your time and interest, not from one year's number.",
              },
            },
          ],
        },
      ],
    },
  },
},
};
