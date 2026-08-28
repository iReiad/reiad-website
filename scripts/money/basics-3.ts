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
};
