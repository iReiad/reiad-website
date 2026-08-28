/* ============================================================
   পর্যায় ০, হাতেখড়ি. Eleven lessons.

   What seeded these rows. Not a second copy of anything: nothing
   imports this at runtime, no builder reads it, and the route
   reads D1. `scripts/money/shape.ts` says why it is kept at all.

   Three lessons answer WHY before eight answer HOW, because the
   commonest way somebody leaves this market is not a bad share.
   It is having no reason to be here that survives a bad month.
   ============================================================ */

import { mount, type Written } from "./shape.ts";

export const LESSONS: Written = {

/* ---------------------------------------------------------- */
"why-invest": {
  bn: `
<p>ধরুন ২০১৫ সালের কোনো এক দিনে আপনার নানি বালিশের নিচে এক লাখ টাকা রেখেছিলেন, নাতির বিয়ের জন্য। টাকাটা কেউ চুরি করেনি, আগুনে পোড়েনি, ইঁদুরেও কাটেনি। আজ সেই এক লাখ টাকা বের করলে গোনার সময় ঠিক এক লাখই পাওয়া যাবে।</p>

<p>কিন্তু ২০১৫ সালে এক লাখ টাকায় যা কেনা যেত, আজ তা কেনা যায় না। তখন এক ভরি সোনার দাম ছিল প্রায় চল্লিশ হাজার টাকা, আজ সেটা লাখ ছাড়িয়েছে। তখন যে চালের কেজি ছিল ৪৫ টাকা, আজ তার দাম দ্বিগুণের কাছাকাছি। নানির টাকার অঙ্ক এক থেকেছে, কিন্তু ওই টাকা দিয়ে যা করা যায় তা প্রায় অর্ধেক হয়ে গেছে।</p>

<p>এটাই এই পুরো পাঠশালার প্রথম কথা, আর সবচেয়ে গুরুত্বপূর্ণ কথা: <strong>টাকা বসে থাকলে নিরাপদ থাকে না, চুপচাপ ক্ষয় হয়।</strong> যে জিনিসটা টাকাকে ক্ষয় করে তার নাম মূল্যস্ফীতি, ইংরেজিতে inflation, আর সেটা কোনো দুর্ঘটনা নয়। প্রতিটা দেশের অর্থনীতিতে এটা সবসময় চলছে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>টাকার অঙ্ক আর টাকার ক্ষমতা এক জিনিস না। অঙ্ক বসে থাকে, ক্ষমতা কমে।</li>
<li>বাংলাদেশে গত এক দশকে মূল্যস্ফীতি বছরে গড়ে ছয় থেকে দশ শতাংশের মধ্যে ঘোরাফেরা করেছে।</li>
<li>সঞ্চয় মানে টাকা জমানো। বিনিয়োগ মানে সেই জমা টাকাকে কাজে লাগানো, যাতে সে নিজেও কিছু আনে।</li>
<li>জুয়ার সঙ্গে বিনিয়োগের পার্থক্যটা লাভ-লোকসানে না, সময় আর তথ্যে।</li>
<li>শুরু করার সবচেয়ে ভালো দিন ছিল দশ বছর আগে। দ্বিতীয় সবচেয়ে ভালো দিন আজ।</li>
</ul>
</div>

<h2>ক্ষয়টা কেমন দেখতে</h2>

<p>নিচের হিসাবটা নিজে নাড়াচাড়া করে দেখুন। মূল্যস্ফীতির হার বদলান, বছর বদলান, আর লক্ষ করুন সংখ্যাটা কীভাবে নামে। এটা কোনো ভবিষ্যদ্বাণী না, এটা কেবল ভাগের অঙ্ক।</p>

${mount("inflation-lab")}

<p>খেয়াল করুন, ৯% হারে দশ বছরে টাকার জোর প্রায় ৪২ শতাংশ কমে যায়। মানে আজকের এক লাখ টাকা দশ বছর পর প্রায় আটান্ন হাজার টাকার সমান কাজ করবে। কেউ আপনার পকেট থেকে বিয়াল্লিশ হাজার টাকা নেয়নি, তবু সেটা নেই।</p>

<div class="side-note">
<p class="side-note-label">তাহলে ব্যাংকে রাখলে?</p>
<p>ব্যাংকে রাখলে সুদ পাওয়া যায়, ধরা যাক বছরে সাড়ে আট শতাংশ। কিন্তু সেই সুদ থেকে উৎসে কর কাটা যায়, আর যা থাকে তা মূল্যস্ফীতির সঙ্গে লড়ে। বেশিরভাগ বছরে ফলাফলটা শূন্যের কাছাকাছি, কোনো কোনো বছরে শূন্যের নিচে। ব্যাংক টাকা রাখে, বাড়ায় না। জরুরি তহবিলের জন্য এটাই ঠিক জায়গা, বিশ বছরের লক্ষ্যের জন্য না।</p>
</div>

<h2>সঞ্চয় আর বিনিয়োগ এক জিনিস না</h2>

<p>বাংলায় দুইটা কথাই আমরা প্রায় একইভাবে ব্যবহার করি, কিন্তু কাজ দুইটা আলাদা।</p>

${mount("save-vs-invest")}

<p>সঞ্চয় হলো খরচ না করে টাকা সরিয়ে রাখা। এটা প্রথম কাজ, আর এটা ছাড়া দ্বিতীয় কাজটা করাই যায় না। বিনিয়োগ হলো সরিয়ে রাখা টাকাটাকে এমন কোথাও রাখা যেখানে সে নিজেও কিছু আনে: একটা ব্যবসার অংশ, সরকারের কাছে ধার, একটা ফ্ল্যাট, বা একটা ফান্ড।</p>

<p>গুরুত্বপূর্ণ কথাটা হলো, বিনিয়োগ মানে ঝুঁকি নেওয়া। ঝুঁকি ছাড়া মূল্যস্ফীতির চেয়ে বেশি রিটার্ন পাওয়ার কোনো পথ নেই, আর কেউ যদি বলে আছে, তাহলে সে হয় ভুল করছে নয়তো মিথ্যা বলছে। এই কথাটা আপনি এই পাঠশালায় বহুবার শুনবেন, কারণ বাংলাদেশে মানুষ সবচেয়ে বেশি টাকা হারায় ঠিক এই এক জায়গাতেই।</p>

<h2>তাহলে জুয়ার সঙ্গে পার্থক্য কী</h2>

<p>এই প্রশ্নটা খুব সঙ্গত, আর অনেকে এড়িয়ে যান। শেয়ারবাজারে দাম ওঠে-নামে, মানুষ টাকা হারায়, ২০১০ সালে বাংলাদেশে লাখ লাখ মানুষ সর্বস্ব হারিয়েছে। তাহলে এটা জুয়া নয় কেন?</p>

<p>পার্থক্য তিনটা, আর তিনটাই আপনার নিজের হাতে।</p>

<ol class="step-list">
<li><strong>আপনি কী কিনছেন।</strong> লটারির টিকিট কিনলে আপনি কিছুই কেনেন না, একটা সম্ভাবনা কেনেন। শেয়ার কিনলে আপনি একটা সত্যিকারের ব্যবসার টুকরা কেনেন, যার কারখানা আছে, কর্মী আছে, বিক্রি আছে, লাভ আছে। ওই ব্যবসাটা বছরের পর বছর কিছু বানায়, আর আপনি তার অংশীদার।</li>
<li><strong>সময়ের দৈর্ঘ্য।</strong> এক সপ্তাহে শেয়ারের দাম কী করবে সেটা প্রায় পুরোপুরি এলোমেলো, আর ওই সময়ের ভেতর কেনাবেচা করা সত্যিই জুয়ার কাছাকাছি। দশ বছরে দামটা বেশি করে নির্ভর করে ব্যবসাটা কেমন চলল তার ওপর। সময় বাড়লে এলোমেলোভাবের ভাগ কমে, আর ব্যবসার ভাগ বাড়ে।</li>
<li><strong>তথ্য।</strong> জুয়ায় খোঁজ নেওয়ার কিছু নেই। এখানে কোম্পানির বার্ষিক প্রতিবেদন আছে, বিক্রির সংখ্যা আছে, ঋণের হিসাব আছে, নিরীক্ষকের মন্তব্য আছে, সব বিনামূল্যে পাওয়া যায়। যিনি পড়েন আর যিনি পড়েন না, দুইজনের ঝুঁকি সমান না।</li>
</ol>

<div class="ex"><b>উদাহরণ:</b> কেউ যদি আজকে একটা শেয়ার কিনে আগামীকাল বেচে দেওয়ার আশা করেন, তিনি আসলে বাজি ধরছেন যে আগামীকাল অন্য কেউ বেশি দাম দিতে রাজি হবে। কেউ যদি একটা ওষুধ কোম্পানির শেয়ার দশ বছরের জন্য কেনেন কারণ দেশে ওষুধের চাহিদা বাড়ছে আর কোম্পানিটা লাভজনক, তিনি বাজি ধরছেন না, তিনি হিসাব করছেন। দুইজনের হাতে একই কাগজ, কিন্তু কাজ দুইটা আলাদা।</div>

<h2>সময় যা করে</h2>

<p>বিনিয়োগে সবচেয়ে বড় শক্তিটা কোনো চালাকি না, ধৈর্য। এর নাম চক্রবৃদ্ধি: আপনার মুনাফা নিজেও মুনাফা আনতে শুরু করে। নিচের হিসাবটায় বছর সংখ্যা বাড়িয়ে দেখুন, আর লক্ষ করুন কোথায় গিয়ে সবুজ রেখাটা হঠাৎ খাড়া হয়ে ওঠে।</p>

${mount("compound-lab")}

<p>এই বাঁকটাই সবকিছু। প্রথম পাঁচ বছরে মনে হবে কিছুই হচ্ছে না, আর বেশিরভাগ মানুষ ঠিক ওখানেই হাল ছেড়ে দেন। যিনি ছাড়েন না, তিনি বিশ বছর পর দেখেন টাকাটা তার নিজের দেওয়া টাকার চেয়ে বেশি এনেছে।</p>

<div class="note">এখানকার কোনো সংখ্যাই প্রতিশ্রুতি না। বছরে দশ শতাংশ রিটার্ন একটা অনুমান, ইতিহাস থেকে নেওয়া, আর ভবিষ্যৎ ইতিহাস মেনে চলতে বাধ্য নয়। কেউ যদি আপনাকে নির্দিষ্ট রিটার্নের নিশ্চয়তা দেয়, সেটাই প্রথম বিপদের চিহ্ন।</div>

<h2>দেরি করার দাম</h2>

${mount("late-reveal")}

<h2>নিজে যাচাই করুন</h2>

${mount("why-quiz")}

<p>পরের লেখায় আমরা ঠিক করব আপনি কীসের জন্য টাকা জমাচ্ছেন, কারণ ওই উত্তরটা না জানলে কোথায় রাখবেন তার সিদ্ধান্ত নেওয়া যায় না। <a class="term" href="/money/start/your-goal.html">লক্ষ্য ঠিক করুন, তারপর টাকা</a>।</p>
`,
  en: `
<p>Suppose that one day in 2015 your grandmother put a hundred thousand taka under her mattress for a grandson's wedding. Nobody stole it, no fire touched it, no mouse chewed it. Take it out today and count it and there will be exactly a hundred thousand taka.</p>

<p>But what a hundred thousand taka bought in 2015 is not what it buys now. A bhori of gold then was around forty thousand taka; today it is past a lakh. Rice that was 45 taka a kilo is close to double. The number on your grandmother's money never moved. What that money can do has roughly halved.</p>

<p>That is the first thing this school has to say, and the most important: <strong>money left alone is not safe, it quietly decays.</strong> The thing that decays it is inflation, and it is not an accident. It runs, always, in every economy on earth.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>The number on your money and the power of your money are different things. The number sits still; the power falls.</li>
<li>Inflation in Bangladesh over the last decade has run somewhere between six and ten percent a year.</li>
<li>Saving is putting money aside. Investing is putting the money aside to work, so that it brings something in too.</li>
<li>What separates investing from gambling is not whether you can lose. It is time and information.</li>
<li>The best day to start was ten years ago. The second best is today.</li>
</ul>
</div>

<h2>What the decay looks like</h2>

<p>Move the sliders below yourself. Change the inflation rate, change the years, and watch the number fall. This is not a forecast. It is division.</p>

${mount("inflation-lab")}

<p>Notice that at 9% over ten years the buying power falls by about 42 percent. A lakh today does the work of about fifty-eight thousand taka in ten years' time. Nobody took forty-two thousand taka out of your pocket, and it is gone all the same.</p>

<div class="side-note">
<p class="side-note-label">So put it in the bank?</p>
<p>The bank pays interest, say eight and a half percent. Tax is deducted at source, and what survives then has to beat inflation. In most years the result lands near zero, and in some years below it. A bank holds money; it does not grow it. That is exactly right for an emergency fund and exactly wrong for a twenty year goal.</p>
</div>

<h2>Saving and investing are not the same job</h2>

<p>In everyday speech the two words blur together. The jobs do not.</p>

${mount("save-vs-invest")}

<p>Saving is not spending: money moved aside. It is the first job and the second one is impossible without it. Investing is putting that money somewhere it earns: a share of a business, a loan to the government, a flat, a fund.</p>

<p>The important part is that investing means taking risk. There is no route to beating inflation without it, and anyone who says there is, is either mistaken or lying. You will hear this sentence many times in this school, because it is the single place where the most money is lost in Bangladesh.</p>

<h2>Then how is this different from gambling?</h2>

<p>It is a fair question and a lot of people dodge it. Prices move, people lose money, and in 2010 hundreds of thousands of Bangladeshis lost everything they had. So why is this not a bet?</p>

<p>Three differences, and all three are in your hands.</p>

<ol class="step-list">
<li><strong>What you are buying.</strong> A lottery ticket buys you nothing: it buys a possibility. A share buys a piece of a real business with a factory, staff, sales and profit. That business makes something year after year, and you own part of it.</li>
<li><strong>The length of time.</strong> What a share price does in a week is close to random, and trading inside that window really is near enough a bet. What it does over ten years depends far more on how the business went. Stretch the time out and the random part shrinks while the business part grows.</li>
<li><strong>Information.</strong> There is nothing to research about a roulette wheel. Here there is an annual report, sales figures, a debt schedule, an auditor's opinion, all of it free. The person who reads them and the person who does not are not taking the same risk.</li>
</ol>

<div class="ex"><b>Example:</b> Someone who buys a share today hoping to sell tomorrow is betting that somebody else will pay more tomorrow. Someone who buys a pharmaceutical company for ten years because demand for medicine is rising and the company is profitable is not betting, they are calculating. Same certificate, different job.</div>

<h2>What time does</h2>

<p>The strongest force in investing is not cleverness, it is patience. It is called compounding: your returns start earning returns of their own. Push the years out below and watch where the green line suddenly turns steep.</p>

${mount("compound-lab")}

<p>That bend is the whole thing. For the first five years it feels like nothing is happening, and that is precisely where most people give up. The ones who do not, look up after twenty years and find the money has brought in more than they ever put in.</p>

<div class="note">None of these numbers is a promise. Ten percent a year is an assumption taken from history, and the future is not obliged to match history. If anyone guarantees you a return, that is the first red flag.</div>

<h2>What waiting costs</h2>

${mount("late-reveal")}

<h2>Check yourself</h2>

${mount("why-quiz")}

<p>Next we decide what you are saving for, because until that is answered there is no way to choose where the money goes: <a class="term" href="/money/start/your-goal.html">Decide the goal before the money</a>.</p>
`,
  blocks: {
    "inflation-lab": {
      kind: "lab",
      model: "inflation",
      title: { bn: "আপনার টাকা কত দ্রুত ক্ষয় হচ্ছে", en: "How fast your money decays" },
      note: {
        bn: "স্লাইডার নাড়ান। ৯% বাংলাদেশের সাম্প্রতিক বছরগুলোর কাছাকাছি একটা অনুমান।",
        en: "Move the sliders. 9% is close to Bangladesh's recent years.",
      },
      preset: { amount: 100000, rate: 9, years: 10 },
    },
    "save-vs-invest": {
      kind: "compare",
      title: { bn: "সঞ্চয় আর বিনিয়োগ", en: "Saving and investing" },
      columns: [
        { bn: "সঞ্চয়", en: "Saving" },
        { bn: "বিনিয়োগ", en: "Investing" },
      ],
      rows: [
        {
          label: { bn: "কাজটা কী", en: "What it is" },
          cells: [
            { bn: "খরচ না করে টাকা সরিয়ে রাখা", en: "Not spending: money moved aside" },
            { bn: "সরিয়ে রাখা টাকাকে কাজে লাগানো", en: "Putting that money to work" },
          ],
        },
        {
          label: { bn: "টাকা কমে যাওয়ার ভয়", en: "Can you lose money" },
          cells: [
            { bn: "অঙ্ক কমে না, ক্রয়ক্ষমতা কমে", en: "The number holds; the buying power falls" },
            { bn: "অঙ্কও কমতে পারে, সাময়িকভাবে", en: "The number itself can fall, for a while" },
          ],
        },
        {
          label: { bn: "কত সময়ের জন্য", en: "Over what horizon" },
          cells: [
            { bn: "যেকোনো সময়, এমনকি আগামী মাসের জন্যও", en: "Any horizon, even next month" },
            { bn: "অন্তত পাঁচ বছর, নাহলে ঝুঁকিটা অন্যায্য", en: "Five years at least, or the risk is not fair" },
          ],
        },
        {
          label: { bn: "মূল্যস্ফীতির সঙ্গে লড়াই", en: "Against inflation" },
          cells: [
            { bn: "হারে, প্রায় প্রতি বছর", en: "Loses, most years" },
            { bn: "লম্বা সময়ে জেতার সুযোগ আছে", en: "Has a chance over long stretches" },
          ],
          best: 1,
        },
        {
          label: { bn: "কোনটা আগে", en: "Which comes first" },
          cells: [
            { bn: "এটা। এটা ছাড়া পরেরটা সম্ভব না।", en: "This one. Nothing else is possible without it." },
            { bn: "সঞ্চয় দাঁড়িয়ে যাওয়ার পর", en: "Once the saving stands up" },
          ],
          best: 0,
        },
      ],
    },
    "compound-lab": {
      kind: "lab",
      model: "compound",
      title: { bn: "ধৈর্যের অঙ্ক", en: "The arithmetic of patience" },
      note: {
        bn: "বছর সংখ্যা বাড়িয়ে কমিয়ে দেখুন কোথায় বাঁকটা খাড়া হয়।",
        en: "Push the years up and down and find where the curve turns.",
      },
      preset: { start: 50000, monthly: 5000, rate: 10, years: 20 },
    },
    "late-reveal": {
      kind: "reveal",
      title: { bn: "দশ বছর দেরি করলে কত যায়", en: "What ten years of waiting costs" },
      ask: {
        bn: "দুইজন মানুষ, দুইজনেই মাসে ৫,০০০ টাকা করে রাখেন, দুইজনেই বছরে ১০% পান। একজন ২৫ বছর বয়সে শুরু করেন আর ৬০ বছরে থামেন। আরেকজন ৩৫ বছরে শুরু করেন আর ৬০ বছরেই থামেন। দ্বিতীয়জন প্রথমজনের কত শতাংশ পাবেন?",
        en: "Two people each put aside 5,000 taka a month at 10% a year. One starts at 25 and stops at 60. The other starts at 35 and also stops at 60. How much does the second one end with, as a share of the first?",
      },
      choices: [
        { bn: "প্রায় ৭০ শতাংশ", en: "About 70 percent" },
        { bn: "প্রায় ৫০ শতাংশ", en: "About 50 percent" },
        { bn: "প্রায় ৩৫ শতাংশ", en: "About 35 percent" },
      ],
      answer: {
        bn: "প্রায় ৩৫ শতাংশ। দশ বছর দেরি করলে দুই-তৃতীয়াংশের বেশি হারিয়ে যায়।",
        en: "About 35 percent. Ten years of delay costs more than two thirds of the result.",
      },
      why: {
        bn: "প্রথমজন মোট ২১ লাখ টাকা দেন আর প্রায় ১ কোটি ৯০ লাখ টাকা নিয়ে থামেন। দ্বিতীয়জন ১৫ লাখ টাকা দেন আর প্রায় ৬৬ লাখ টাকা নিয়ে থামেন। দেওয়া টাকার পার্থক্য ছয় লাখ, ফলাফলের পার্থক্য এক কোটির বেশি। কারণ প্রথম দশ বছরে জমা হওয়া টাকা বাকি পঁচিশ বছর ধরে নিজেই বাড়তে থাকে, আর ওই বাড়াটাই সবচেয়ে দামি। দেরি করলে টাকা হারায় না, সময় হারায়, আর সময় কিনে ফেরত আনা যায় না।",
        en: "The first pays in 21 lakh and finishes near 1.9 crore. The second pays in 15 lakh and finishes near 66 lakh. Six lakh more paid in, over a crore more out. The money saved in those first ten years spends the remaining twenty-five compounding on itself, and that growth is the expensive part. Waiting does not cost you money, it costs you time, and time cannot be bought back.",
      },
    },
    "why-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "এক বছরে মূল্যস্ফীতি ৯% আর আপনার এফডিআরে সুদ ৮%। আপনার টাকার কী হলো?",
            en: "Inflation is 9% and your fixed deposit paid 8%. What happened to your money?",
          },
          options: [
            {
              text: { bn: "৮% বাড়ল", en: "It grew 8%" },
              why: {
                bn: "অঙ্কে বাড়ল, ঠিক। কিন্তু প্রশ্নটা ছিল টাকার, অঙ্কের না। জিনিসপত্রের দাম ৯% বেড়েছে, আপনার টাকা বেড়েছে ৮%, তাই আপনি এক শতাংশ পিছিয়ে গেছেন।",
                en: "The number grew, yes. But the question was about the money, not the number. Prices rose 9% and your money rose 8%, so you fell a percent behind.",
              },
            },
            {
              text: { bn: "প্রায় ১% ক্রয়ক্ষমতা হারাল", en: "It lost about 1% of its buying power" },
              right: true,
              why: {
                bn: "ঠিক। আর কর কাটলে আরও খারাপ: ১০% উৎসে কর ধরলে হাতে থাকে ৭.২%, তাই আসল ক্ষতি প্রায় ১.৭%। এইজন্যই এফডিআর নিরাপদ শোনায় আর নিরাপদ নয়।",
                en: "Right. And after tax it is worse: 10% withheld leaves 7.2%, so the real loss is nearer 1.7%. That is why a fixed deposit sounds safe without being safe.",
              },
            },
            {
              text: { bn: "কিছুই হয়নি, টাকা তো ব্যাংকেই আছে", en: "Nothing: the money is still in the bank" },
              why: {
                bn: "টাকাটা আছে, কিন্তু টাকার কাজ করার ক্ষমতা কমেছে। এই লেখার পুরো বিষয়টাই এই পার্থক্য।",
                en: "The money is there and what it can do has shrunk. That difference is the whole of this lesson.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কোনগুলো বিনিয়োগকে জুয়া থেকে আলাদা করে? একাধিক উত্তর ঠিক।",
            en: "What separates investing from gambling? More than one is right.",
          },
          options: [
            {
              text: { bn: "আপনি একটা সত্যিকারের ব্যবসার অংশ কিনছেন", en: "You are buying part of a real business" },
              right: true,
              why: {
                bn: "হ্যাঁ। ব্যবসাটা লাভ করলে সেই লাভের ভাগ আপনার, লটারিতে এমন কিছু নেই।",
                en: "Yes. If the business profits, part of that profit is yours. A lottery ticket has no such thing behind it.",
              },
            },
            {
              text: { bn: "সময় লম্বা হলে এলোমেলোভাবের ভাগ কমে", en: "Over a long horizon the random part shrinks" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর এইজন্যই দিনে দিনে কেনাবেচা করলে পার্থক্যটা প্রায় মুছে যায়।",
                en: "Yes, which is also why day trading rubs the difference out again.",
              },
            },
            {
              text: { bn: "বিনিয়োগে টাকা হারানোর ভয় নেই", en: "In investing you cannot lose money" },
              why: {
                bn: "না, আর এটাই সবচেয়ে বিপজ্জনক ভুল ধারণা। বিনিয়োগে টাকা হারানো যায়, নিয়মিত যায়। পার্থক্যটা ঝুঁকি না থাকায় না, ঝুঁকিটা বোঝা যায় আর মাপা যায় তাতে।",
                en: "No, and this is the most dangerous misunderstanding on the page. You can lose money investing, routinely. The difference is not the absence of risk, it is that the risk can be understood and measured.",
              },
            },
            {
              text: { bn: "কোম্পানির তথ্য পড়ে যাচাই করা যায়", en: "You can read the company's own numbers" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর বিনামূল্যেই পাওয়া যায়। পর্যায় ৩ পুরোটাই এই কাজটা শেখানোর জন্য।",
                en: "Yes, and free. Stage 3 of this school is entirely about doing it.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একজন বলছেন, দশ বছরের জন্য টাকা রাখব বলে ঠিক করেছি, কিন্তু আরও পাঁচ বছর পরে শুরু করব কারণ এখন বাজার চড়া। এতে সমস্যা কী?",
            en: "Someone says: I will invest for ten years, but I will start in five years because the market looks expensive now. What is wrong with that?",
          },
          options: [
            {
              text: { bn: "কিছুই না, সস্তায় কেনা তো ভালো", en: "Nothing: buying cheaper is better" },
              why: {
                bn: "সস্তায় কেনা ভালো, কিন্তু পাঁচ বছর পর দাম কম থাকবে কি না সেটা কেউ জানে না। আর এই পাঁচ বছর টাকাটা ব্যাংকে বসে মূল্যস্ফীতির কাছে হারছে, সেটা নিশ্চিত।",
                en: "Buying cheaper is better, and nobody knows whether it will be cheaper in five years. Meanwhile the money sits in a bank losing to inflation, which is certain.",
              },
            },
            {
              text: { bn: "শুরুর দিকের বছরগুলোই সবচেয়ে দামি, আর সেগুলোই বাদ যাচ্ছে", en: "The earliest years are the valuable ones, and those are the years being skipped" },
              right: true,
              why: {
                bn: "ঠিক। উপরের রিভিল ব্লকে দেখা গেছে দশ বছর দেরিতে ফলাফলের দুই-তৃতীয়াংশের বেশি চলে যায়। প্রথম বছরের টাকাটা সবচেয়ে বেশি সময় পায় বাড়ার জন্য।",
                en: "Right. The reveal above showed ten years of delay costing more than two thirds of the outcome. The first year's money gets the longest run.",
              },
            },
            {
              text: { bn: "বাজারের দাম কখনো কমে না", en: "Markets never fall" },
              why: {
                bn: "বাজার অবশ্যই কমে, প্রায়ই কমে। কিন্তু কখন কমবে সেটা আগে থেকে জানা যায় না, আর অপেক্ষা করে বসে থাকার নিজেরই একটা দাম আছে।",
                en: "Markets absolutely fall, often. You just cannot know when in advance, and waiting has a price of its own.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"your-goal": {
  bn: `
<p>বেশিরভাগ মানুষ বিনিয়োগ শুরু করেন ভুল প্রশ্ন দিয়ে। প্রশ্নটা হয় "কোন শেয়ারটা কিনব" বা "কোন ফান্ডটা ভালো"। এই প্রশ্নের কোনো উত্তর নেই, কারণ উত্তরটা নির্ভর করে আরেকটা প্রশ্নের উপর যেটা এখনো করা হয়নি: <strong>টাকাটা কবে লাগবে?</strong></p>

<p>একটা উদাহরণ। ধরুন দুইজন মানুষ, দুইজনেরই হাতে পাঁচ লাখ টাকা। প্রথমজনের আগামী এগারো মাসে বোনের বিয়ে। দ্বিতীয়জনের বয়স ত্রিশ, তিনি ষাট বছর বয়সের কথা ভাবছেন। একই পাঁচ লাখ টাকা, কিন্তু দুইজনের জন্য একদম আলাদা জায়গা। প্রথমজনের জন্য শেয়ারবাজার একটা বাজে সিদ্ধান্ত, যত ভালো শেয়ারই হোক, কারণ এগারো মাসের ভেতর বাজার ২৫% পড়ে যেতেই পারে আর বিয়ের তারিখ পেছানো যায় না। দ্বিতীয়জনের জন্য এফডিআর একটা বাজে সিদ্ধান্ত, কারণ ত্রিশ বছরে মূল্যস্ফীতি তার টাকাটা প্রায় গিলে ফেলবে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>প্রতিটা লক্ষ্যের তিনটা অংশ: কত টাকা, কবে, আর কতটা নড়চড় সহ্য হবে।</li>
<li>সময়ের দৈর্ঘ্যই ঠিক করে দেয় কোন মাধ্যম, বাকি সবকিছুর আগে।</li>
<li>তিন বছরের কম হলে শেয়ার নয়। পাঁচ বছরের বেশি হলে কেবল এফডিআর নয়।</li>
<li>একটা লক্ষ্য যা লিখে রাখা হয়নি, সেটা লক্ষ্য নয়, ইচ্ছা।</li>
<li>একসঙ্গে অনেকগুলো লক্ষ্য থাকতে পারে, আর থাকা উচিত। প্রতিটার আলাদা জায়গা।</li>
</ul>
</div>

<h2>একটা লক্ষ্যের তিনটা অংশ</h2>

<p>"টাকা জমাতে চাই" লক্ষ্য নয়। লক্ষ্য হতে হলে তিনটা জিনিস লাগে, আর তিনটাই সংখ্যা।</p>

${mount("goal-parts")}

<p>তৃতীয়টা নিয়ে মানুষ কম ভাবেন আর সেটাই সবচেয়ে বেশি ক্ষতি করে। বাড়ির ডাউনপেমেন্টের টাকা যদি ঠিক ওই মাসে ২০% কমে যায়, আপনি বাড়িটা কিনতে পারবেন না। এই লক্ষ্যের নড়চড় সহ্য করার ক্ষমতা শূন্যের কাছাকাছি। আবার অবসরের টাকা যদি এই বছর ২০% কমে যায়, ত্রিশ বছর হাতে থাকলে সেটা আসলে কোনো ঘটনাই না, বরং সস্তায় কেনার সুযোগ।</p>

<h2>সময় ঠিক করে দেয় জায়গা</h2>

<p>নিচের ছকটা এই লেখার সবচেয়ে কাজের অংশ। এটা মনে রাখলে "কোন শেয়ারটা কিনব" প্রশ্নটা অনেকদিন পিছিয়ে দেওয়া যায়।</p>

${mount("horizon-matrix")}

<div class="table-scroll">
<table>
<thead>
<tr><th>কবে লাগবে</th><th>কোথায় রাখবেন</th><th>কেন</th></tr>
</thead>
<tbody>
<tr><td>যেকোনো দিন</td><td>সেভিংস অ্যাকাউন্ট</td><td>হাতে পাওয়া যাওয়াটাই এখানে একমাত্র প্রশ্ন</td></tr>
<tr><td>১ বছরের কম</td><td>সেভিংস বা ছোট মেয়াদি এফডিআর</td><td>এত অল্প সময়ে ঝুঁকি নেওয়ার পুরস্কার নেই</td></tr>
<tr><td>১ থেকে ৩ বছর</td><td>এফডিআর, ডিপিএস</td><td>দাম নিশ্চিত থাকা দরকার, বাড়া নয়</td></tr>
<tr><td>৩ থেকে ৫ বছর</td><td>সঞ্চয়পত্র, বন্ড, অল্প কিছু ফান্ড</td><td>কিছুটা ঝুঁকি সহ্য হয়, পুরোটা না</td></tr>
<tr><td>৫ থেকে ১০ বছর</td><td>মিউচুয়াল ফান্ড, শেয়ার, মিলিয়ে</td><td>একটা খারাপ বছর সামলে নেওয়ার সময় আছে</td></tr>
<tr><td>১০ বছরের বেশি</td><td>মূলত শেয়ার আর ফান্ড</td><td>এখানে আসল শত্রু মূল্যস্ফীতি, ওঠানামা নয়</td></tr>
</tbody>
</table>
</div>

<div class="note">এই ছকটা নিয়ম নয়, শুরুর জায়গা। আপনার কাজের নিরাপত্তা, পরিবারের অন্য আয়, আর নিজের মেজাজ, তিনটাই এই ছককে একটু বাঁয়ে বা ডানে সরাতে পারে। পরের লেখায় ঠিক সেই মাপটাই করা হবে।</div>

<h2>উল্টো দিক থেকে হিসাব</h2>

<p>বেশিরভাগ মানুষ হিসাব করেন সামনের দিক থেকে: মাসে পাঁচ হাজার রাখলে বিশ বছরে কত হবে। উল্টো দিক থেকে করা অনেক বেশি কাজের: বিশ বছরে বিশ লাখ লাগলে মাসে কত রাখতে হবে। কারণ সামনের দিকের হিসাব একটা তথ্য দেয়, আর উল্টো দিকের হিসাব একটা সিদ্ধান্ত দেয়।</p>

${mount("goal-lab")}

<p>সংখ্যাটা অসম্ভব মনে হলে সেটাও একটা উত্তর, আর দরকারি উত্তর। তখন তিনটার একটা বদলাতে হবে: লক্ষ্যটা ছোট করা, সময়টা বাড়ানো, বা মাসের সঞ্চয় বাড়ানো। রিটার্নের অনুমানটা বাড়িয়ে দেওয়া বদল নয়, ওটা নিজেকে মিথ্যা বলা।</p>

<div class="ex"><b>উদাহরণ:</b> রুমানা ২৯ বছর বয়সী, বেসরকারি চাকরি করেন। তিনটা লক্ষ্য লিখলেন। এক, দুই বছরে ছোট ভাইয়ের বিশ্ববিদ্যালয়ের ভর্তি বাবদ দেড় লাখ, তাই সেটা ডিপিএসে। দুই, ছয় বছরে একটা ফ্ল্যাটের ডাউনপেমেন্ট বাবদ পনেরো লাখ, তাই সেটা সঞ্চয়পত্র আর ফান্ড মিলিয়ে। তিন, ষাট বছরের জন্য যত বেশি সম্ভব, তাই সেটা মাসে মাসে ফান্ডে। তিনটা লক্ষ্য, তিনটা আলাদা জায়গা, একটাই মানুষ।</div>

<h2>কোনটা কোন তাকে</h2>

${mount("goal-bins")}

<h2>লিখে ফেলুন</h2>

<p>এই কাজটা করতে দশ মিনিট লাগে আর এটাই এই পুরো পর্যায়ের সবচেয়ে দামি দশ মিনিট। একটা খাতা, একটা নোট অ্যাপ, বা ফোনের মেসেজ, যেখানে খুশি।</p>

${mount("goal-drill")}

<h2>নিজে যাচাই করুন</h2>

${mount("goal-quiz")}

<p>লক্ষ্য ঠিক হলো, সময়ও ঠিক হলো। এখন বাকি একটা প্রশ্ন, আর সেটা টাকার নয়, আপনার নিজের: <a class="term" href="/money/start/how-much-risk.html">কতটা ঝুঁকি আপনার জন্য</a>।</p>
`,
  en: `
<p>Most people start investing from the wrong question. The question is usually "which share should I buy" or "which fund is good". That question has no answer, because the answer depends on one that has not been asked yet: <strong>when do you need the money?</strong></p>

<p>Take two people, each holding five lakh taka. The first has a sister's wedding in eleven months. The second is thirty and thinking about being sixty. Same five lakh, completely different homes for it. For the first, the stock market is a bad decision no matter how good the share, because a market can fall 25% inside eleven months and a wedding date cannot be moved. For the second, a fixed deposit is a bad decision, because over thirty years inflation will eat most of it.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A goal has three parts: how much, by when, and how much wobble it can take.</li>
<li>The horizon decides the instrument, before anything else does.</li>
<li>Under three years, no shares. Over five years, not fixed deposits alone.</li>
<li>A goal you have not written down is not a goal, it is a wish.</li>
<li>You can have several goals at once, and you should. Each gets its own home.</li>
</ul>
</div>

<h2>The three parts of a goal</h2>

<p>"I want to save money" is not a goal. A goal needs three things and all three are numbers.</p>

${mount("goal-parts")}

<p>The third is the one people think about least and it does the most damage. If the money for a house deposit is 20% down in exactly the month you need it, you do not buy the house. That goal's tolerance for wobble is near zero. If retirement money is 20% down this year and you have thirty years left, nothing has happened at all; if anything it is a chance to buy cheaply.</p>

<h2>The horizon chooses the home</h2>

<p>The table below is the most useful part of this lesson. Remember it and you can put off "which share" for a long time.</p>

${mount("horizon-matrix")}

<div class="table-scroll">
<table>
<thead>
<tr><th>When you need it</th><th>Where it goes</th><th>Why</th></tr>
</thead>
<tbody>
<tr><td>Any day</td><td>Savings account</td><td>Reaching it is the only question here</td></tr>
<tr><td>Under a year</td><td>Savings, or a short fixed deposit</td><td>There is no reward for risk over that span</td></tr>
<tr><td>One to three years</td><td>Fixed deposits, DPS</td><td>The amount needs to be certain, not large</td></tr>
<tr><td>Three to five years</td><td>Savings certificates, bonds, a little in funds</td><td>Some risk is survivable, not all of it</td></tr>
<tr><td>Five to ten years</td><td>Funds and shares, mixed</td><td>There is time to absorb one bad year</td></tr>
<tr><td>Over ten years</td><td>Mostly shares and funds</td><td>Here the enemy is inflation, not volatility</td></tr>
</tbody>
</table>
</div>

<div class="note">This table is a starting point, not a rule. Job security, other income in the household, and your own temperament each shift it a little one way or the other. The next lesson is about measuring exactly that.</div>

<h2>Work it backwards</h2>

<p>Most people calculate forwards: five thousand a month for twenty years gives what? Backwards is far more useful: twenty lakh in twenty years needs what a month? The forward sum gives you a fact. The backward one gives you a decision.</p>

${mount("goal-lab")}

<p>If the number looks impossible, that is also an answer, and a useful one. Then one of three things has to move: shrink the goal, lengthen the time, or raise the saving. Raising the return assumption is not a change, it is lying to yourself.</p>

<div class="ex"><b>Example:</b> Rumana is 29 and works in the private sector. She wrote three goals. One: a lakh and a half in two years for her brother's university admission, so that goes in a DPS. Two: fifteen lakh in six years for a flat deposit, so that is savings certificates and funds mixed. Three: as much as possible by sixty, so that is a monthly amount into a fund. Three goals, three homes, one person.</div>

<h2>Which shelf does each one go on</h2>

${mount("goal-bins")}

<h2>Write it down</h2>

<p>This takes ten minutes and it is the most valuable ten minutes in this whole stage. A notebook, a notes app, a message to yourself, anywhere.</p>

${mount("goal-drill")}

<h2>Check yourself</h2>

${mount("goal-quiz")}

<p>The goal is set and the horizon with it. One question is left, and it is not about money, it is about you: <a class="term" href="/money/start/how-much-risk.html">How much risk is yours to take</a>.</p>
`,
  blocks: {
    "goal-parts": {
      kind: "figure",
      shape: "flow",
      title: { bn: "একটা লক্ষ্য দাঁড় করানোর তিনটা অংশ", en: "The three parts of a goal" },
      parts: [
        {
          text: { bn: "কত টাকা", en: "How much" },
          note: { bn: "আজকের দামে, তারপর মূল্যস্ফীতি যোগ করুন", en: "In today's prices, then add inflation" },
          tone: "lead",
        },
        {
          text: { bn: "কবে", en: "By when" },
          note: { bn: "মাস বা বছরে, আন্দাজে নয়", en: "In months or years, not vaguely" },
          tone: "lead",
        },
        {
          text: { bn: "কতটা নড়চড় সহ্য হবে", en: "How much wobble it can take" },
          note: { bn: "ঠিক ওই মাসে ২০% কম হলে কী হবে", en: "What happens if it is 20% short that month" },
          tone: "warn",
        },
      ],
      caption: {
        bn: "তিনটার একটাও বাদ দিলে বাকি সিদ্ধান্তগুলো নেওয়া যায় না।",
        en: "Leave any one out and none of the later decisions can be made.",
      },
    },
    "horizon-matrix": {
      kind: "figure",
      shape: "matrix",
      title: { bn: "সময় আর ঝুঁকি", en: "Horizon against risk" },
      axes: {
        x: [{ bn: "অল্প সময়", en: "Short horizon" }, { bn: "লম্বা সময়", en: "Long horizon" }],
        y: [{ bn: "নড়চড় সহ্য হয় না", en: "Cannot take a wobble" }, { bn: "নড়চড় সহ্য হয়", en: "Can take a wobble" }],
      },
      parts: [
        {
          text: { bn: "এফডিআর, ডিপিএস", en: "Fixed deposits, DPS" },
          note: { bn: "বিয়ে, ভর্তি, সেমিস্টার ফি", en: "A wedding, admission, a semester's fees" },
          tone: "good",
        },
        {
          text: { bn: "সঞ্চয়পত্র, বন্ড, ফান্ড মিলিয়ে", en: "Savings certificates, bonds, some funds" },
          note: { bn: "ডাউনপেমেন্ট, ব্যবসার পুঁজি", en: "A deposit on a flat, business capital" },
          tone: "plain",
        },
        {
          text: { bn: "সেভিংস অ্যাকাউন্ট", en: "A savings account" },
          note: { bn: "জরুরি তহবিল, যেকোনো দিন লাগতে পারে", en: "The emergency fund, needed any day" },
          tone: "warn",
        },
        {
          text: { bn: "শেয়ার আর ফান্ড", en: "Shares and funds" },
          note: { bn: "অবসর, সন্তানের উচ্চশিক্ষা", en: "Retirement, a child's education" },
          tone: "lead",
        },
      ],
      caption: {
        bn: "উপরের ডান কোণটাই একমাত্র জায়গা যেখানে শেয়ার যুক্তিসঙ্গত।",
        en: "The top right corner is the only square where shares make sense.",
      },
    },
    "goal-lab": {
      kind: "lab",
      model: "goal",
      title: { bn: "লক্ষ্যটা মাসে কত চায়", en: "What the goal costs a month" },
      note: {
        bn: "লক্ষ্য আর সময় বসান, তারপর মাসের সংখ্যাটা দেখুন।",
        en: "Set the target and the years, then read the monthly number.",
      },
      preset: { target: 2000000, years: 10, rate: 10, have: 100000 },
    },
    "goal-bins": {
      kind: "bins",
      title: { bn: "কোনটা কোন তাকে", en: "Which shelf" },
      note: {
        bn: "একটা তুলুন, তারপর যে ঘরে যাবে সেই ঘরে চাপ দিন।",
        en: "Pick one up, then press the box it belongs in.",
      },
      bins: [
        { id: "safe", label: { bn: "ব্যাংক বা ডিপিএস", en: "Bank or DPS" }, tone: "good" },
        { id: "mid", label: { bn: "সঞ্চয়পত্র বা বন্ড", en: "Certificates or bonds" }, tone: "plain" },
        { id: "long", label: { bn: "ফান্ড বা শেয়ার", en: "Funds or shares" }, tone: "lead" },
      ],
      items: [
        {
          text: { bn: "আগামী মাসে হাসপাতালের বিল আসতে পারে", en: "A hospital bill that could come next month" },
          bin: "safe",
          why: {
            bn: "যেকোনো দিন লাগতে পারে, তাই একমাত্র প্রশ্ন হাতে পাওয়া যাবে কি না।",
            en: "It could be needed any day, so reaching it is the only question.",
          },
        },
        {
          text: { bn: "এগারো মাস পরে বোনের বিয়ে", en: "A sister's wedding in eleven months" },
          bin: "safe",
          why: {
            bn: "তারিখ পেছানো যায় না, তাই দাম নিশ্চিত থাকতে হবে। এক বছরে বাজার যা খুশি করতে পারে।",
            en: "The date cannot move, so the amount has to be certain. A market can do anything in a year.",
          },
        },
        {
          text: { bn: "চার বছর পরে ব্যবসার পুঁজি", en: "Business capital in four years" },
          bin: "mid",
          why: {
            bn: "কিছুটা ঝুঁকি সহ্য হয়, পুরোটা না। চার বছর একটা খারাপ বছর সামলানোর জন্য অল্প।",
            en: "Some risk survives here, not all of it. Four years is thin cover for one bad year.",
          },
        },
        {
          text: { bn: "ছয় বছর পরে ফ্ল্যাটের ডাউনপেমেন্ট", en: "A flat deposit in six years" },
          bin: "mid",
          why: {
            bn: "সীমানার কাছাকাছি। বেশিরভাগটা নিরাপদে, অল্প কিছু ফান্ডে, এই মিশ্রণটাই বেশিরভাগ মানুষের জন্য ঠিক।",
            en: "Right on the border. Most of it safe with a slice in funds is the mix that fits most people.",
          },
        },
        {
          text: { bn: "সন্তানের বিশ্ববিদ্যালয়, এখন তার বয়স তিন", en: "University for a three year old" },
          bin: "long",
          why: {
            bn: "পনেরো বছর হাতে। এখানে ওঠানামা শত্রু না, মূল্যস্ফীতি শত্রু।",
            en: "Fifteen years out. Here volatility is not the enemy; inflation is.",
          },
        },
        {
          text: { bn: "নিজের অবসর, বয়স এখন ৩০", en: "Your own retirement, aged 30" },
          bin: "long",
          why: {
            bn: "ত্রিশ বছর। এই সময়ে এফডিআরে রাখা মানে ক্রয়ক্ষমতার প্রায় অর্ধেক হেরে যাওয়া।",
            en: "Thirty years. Leaving it in fixed deposits over that span loses close to half the buying power.",
          },
        },
      ],
    },
    "goal-drill": {
      kind: "drill",
      title: { bn: "আপনার তিনটা লক্ষ্য", en: "Your three goals" },
      note: {
        bn: "এখনই করুন, পরে না। খাতা, নোট অ্যাপ, যেখানে খুশি।",
        en: "Now, not later. A notebook, a notes app, anywhere.",
      },
      steps: [
        {
          text: { bn: "একটা লক্ষ্য লিখুন যেটা তিন বছরের ভেতরে", en: "Write one goal inside three years" },
          hint: { bn: "কত টাকা, কোন মাসে। আন্দাজ হলেও সংখ্যা লিখুন।", en: "How much, which month. A rough number is still a number." },
        },
        {
          text: { bn: "একটা লক্ষ্য লিখুন পাঁচ থেকে দশ বছরের", en: "Write one goal five to ten years out" },
          hint: { bn: "মূল্যস্ফীতির কথা মনে রাখুন: আজকের দশ লাখ তখন দশ লাখ নয়।", en: "Remember inflation: ten lakh today is not ten lakh then." },
        },
        {
          text: { bn: "একটা লক্ষ্য লিখুন দশ বছরের বেশি", en: "Write one goal beyond ten years" },
          hint: { bn: "অবসর, সন্তানের পড়া, নিজের বাড়ি।", en: "Retirement, a child's education, a home of your own." },
        },
        {
          text: { bn: "প্রতিটার পাশে লিখুন কত মাসে কত টাকা লাগবে", en: "Beside each, write the monthly amount it needs" },
          hint: { bn: "উপরের হিসাবটা ব্যবহার করুন, প্রতিটার জন্য একবার করে।", en: "Use the calculator above, once per goal." },
        },
        {
          text: { bn: "যোগ করুন। মোটটা আপনার মাসিক সঞ্চয়ের চেয়ে বেশি কি না দেখুন।", en: "Add them up and see whether the total beats what you can save" },
          hint: { bn: "বেশি হলে সেটা খারাপ খবর না, সেটা তথ্য। এখন আপনি জানেন কী বদলাতে হবে।", en: "If it does, that is not bad news, it is information. Now you know what has to move." },
        },
      ],
    },
    "goal-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "আপনার হাতে তিন লাখ টাকা আছে, আর চৌদ্দ মাস পর সেটা দিয়ে একটা কোর্সের ফি দিতে হবে। কোনটা ঠিক?",
            en: "You have three lakh taka and a course fee to pay in fourteen months. What is right?",
          },
          options: [
            {
              text: { bn: "ভালো একটা মিউচুয়াল ফান্ডে রাখা, কারণ ফান্ড শেয়ারের চেয়ে নিরাপদ", en: "Put it in a good mutual fund, since funds are safer than shares" },
              why: {
                bn: "ফান্ড একক শেয়ারের চেয়ে ছড়ানো, ঠিক। কিন্তু চৌদ্দ মাসে ফান্ডও ২০% পড়তে পারে, আর ফির তারিখ পেছাবে না। প্রশ্নটা কোনটা নিরাপদ তা না, সময়টা কত তা।",
                en: "A fund is more spread than one share, true. It can still be 20% down in fourteen months, and the fee date will not move. The question is not which is safer, it is how long you have.",
              },
            },
            {
              text: { bn: "চৌদ্দ মাসের এফডিআর বা ডিপিএসে রাখা", en: "A fourteen month fixed deposit or a DPS" },
              right: true,
              why: {
                bn: "ঠিক। এই লক্ষ্যের নড়চড় সহ্য করার ক্ষমতা প্রায় শূন্য, তাই এখানে বাড়ার চেয়ে নিশ্চয়তা বেশি দামি। মূল্যস্ফীতিতে সামান্য হারবেন, আর সেটা ফি দিতে না পারার চেয়ে ঢের ভালো।",
                en: "Right. This goal's tolerance for a wobble is near zero, so certainty is worth more than growth. You lose a little to inflation, which beats not being able to pay.",
              },
            },
            {
              text: { bn: "অর্ধেক শেয়ারে, অর্ধেক এফডিআরে", en: "Half in shares, half in a deposit" },
              why: {
                bn: "মাঝামাঝি সিদ্ধান্ত এখানে কাজ করে না। অর্ধেক টাকা ২৫% পড়লে আপনার সাড়ে বারো শতাংশ কম, আর ফির অঙ্ক তো কমেনি।",
                en: "Splitting the difference does not help here. A 25% fall on half the money is 12.5% short overall, and the fee has not shrunk.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "লক্ষ্যের হিসাবে মাসের সংখ্যাটা আপনার সাধ্যের বাইরে এল। কোনগুলো সৎ সমাধান? একাধিক উত্তর ঠিক।",
            en: "The monthly number came out beyond what you can afford. Which are honest fixes? More than one is right.",
          },
          options: [
            {
              text: { bn: "লক্ষ্যটা ছোট করা", en: "Shrink the goal" },
              right: true,
              why: {
                bn: "হ্যাঁ। পনেরো লাখের বদলে দশ লাখ ডাউনপেমেন্ট মানে ছোট ফ্ল্যাট, আর সেটা একটা সিদ্ধান্ত, ব্যর্থতা না।",
                en: "Yes. Ten lakh instead of fifteen means a smaller flat, and that is a decision rather than a failure.",
              },
            },
            {
              text: { bn: "সময়টা বাড়ানো", en: "Lengthen the time" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর এটা প্রায়ই সবচেয়ে সহজ বদল। ছয় বছরের বদলে আট বছর ধরলে মাসের সংখ্যাটা অনেকটা নামে।",
                en: "Yes, and it is often the easiest lever. Eight years instead of six pulls the monthly number down a lot.",
              },
            },
            {
              text: { bn: "মাসের সঞ্চয় বাড়ানো, খরচের বড় লাইনগুলো কমিয়ে", en: "Save more, by cutting the big spending lines" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর বড় লাইনগুলোই, ছোটগুলো নয়। বাড়িভাড়া বা কিস্তি একবার বদলালে যা হয়, চায়ের খরচ বাঁচিয়ে তা হয় না।",
                en: "Yes, and the big lines rather than the small ones. Rent or an instalment changed once does what skipping tea never will.",
              },
            },
            {
              text: { bn: "রিটার্নের অনুমান ১০% থেকে ১৮% করা", en: "Raise the return assumption from 10% to 18%" },
              why: {
                bn: "না। এটা কোনো বদল না, এটা অঙ্কটাকে মিলিয়ে দেওয়ার জন্য নিজেকে মিথ্যা বলা। ১৮% পেতে হলে অনেক বেশি ঝুঁকি নিতে হবে, আর তাতে লক্ষ্যটা পৌঁছানোর সম্ভাবনা বাড়ে না, কমে।",
                en: "No. That is not a change, it is lying to yourself to make the arithmetic close. Reaching 18% means far more risk, which lowers the chance of hitting the goal rather than raising it.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"how-much-risk": {
  bn: `
<p>২০১০ সালের ডিসেম্বর মাসে ঢাকার শেয়ারবাজার এক দিনে ৬৬০ পয়েন্ট পড়েছিল। মতিঝিলে হাজার হাজার মানুষ রাস্তায় নেমেছিলেন। পরের এগারো মাসে সূচক প্রায় অর্ধেক হয়ে যায়। অনেকে সব হারান, কিছু মানুষ আত্মহত্যা করেন।</p>

<p>এই গল্পটা এখানে ভয় দেখানোর জন্য না। এটা এখানে কারণ ওই সময় যারা সবচেয়ে বেশি ক্ষতিগ্রস্ত হয়েছিলেন, তাদের বেশিরভাগের ভুলটা ছিল একই: তারা এমন টাকা বাজারে দিয়েছিলেন যা তাদের দেওয়ার কথা ছিল না, আর অনেকে ধার করে দিয়েছিলেন। বাজার পড়ল সবার জন্য। যাদের অপেক্ষা করার ক্ষমতা ছিল, তারা তিন বছরে ফিরে এলেন। যাদের ছিল না, তারা ঠিক সবচেয়ে খারাপ দামে বেচতে বাধ্য হলেন।</p>

<p>তাই এই লেখাটা টাকার নয়, আপনার নিজের। এখানে দুইটা আলাদা জিনিস মাপা হবে, আর মানুষ প্রায়ই দুইটাকে গুলিয়ে ফেলেন।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ঝুঁকি নেওয়ার সামর্থ্য: আপনার অবস্থা কতটা ধাক্কা সইতে পারে। এটা অঙ্কের ব্যাপার।</li>
<li>ঝুঁকি সহ্য করার ক্ষমতা: পড়ে গেলে আপনি কী করবেন। এটা মেজাজের ব্যাপার।</li>
<li>দুইটার মধ্যে যেটা ছোট, সেটাই আপনার আসল ঝুঁকি।</li>
<li>৩০% পড়ে যাওয়া অস্বাভাবিক না। ফিরতে ৪৩% উঠতে হয়, আর সেটাই আসল সংখ্যা।</li>
<li>ঝুঁকি কমানোর সবচেয়ে সস্তা উপায় ধার না করা, ভালো শেয়ার বাছা নয়।</li>
</ul>
</div>

<h2>আগে নিজেকে একটা প্রশ্ন</h2>

${mount("crash-reveal")}

<h2>দুইটা আলাদা জিনিস</h2>

<p>একজন ২৬ বছর বয়সী সরকারি চাকুরে, যার সংসারে আর কেউ নির্ভরশীল নেই আর হাতে ছয় মাসের জরুরি তহবিল আছে, তার ঝুঁকি নেওয়ার সামর্থ্য অনেক। কিন্তু যদি দাম ১৫% পড়লেই তার রাতের ঘুম নষ্ট হয় আর তিনি বেচে দেন, তার সহ্যক্ষমতা কম। এই দুইটার মধ্যে ছোটটাই তার আসল ঝুঁকি, কারণ শেষ পর্যন্ত হাতটা তারই।</p>

${mount("capacity-scale")}

<p>উল্টোটাও হয়, আর সেটা আরও বিপজ্জনক। একজন ৫৪ বছর বয়সী, তিন বছর পর অবসর, ছেলের বিয়ে সামনে, কিন্তু মেজাজে খুব সাহসী। তার সহ্যক্ষমতা বেশি আর সামর্থ্য কম। তিনি যদি সাহসের কথা শোনেন, তিনি তিন বছর পর বিপদে পড়বেন, আর তখন ঠিক করার সময় থাকবে না।</p>

<h2>সামর্থ্য মাপার পাঁচটা প্রশ্ন</h2>

<p>এগুলোর উত্তর অঙ্কে আসে, তাই এগুলো নিয়ে তর্ক করার কিছু নেই।</p>

<ol class="step-list">
<li><strong>টাকাটা কবে লাগবে?</strong> তিন বছরের কম হলে ঝুঁকি নেওয়ার সামর্থ্য শূন্য, আপনি যত সাহসীই হোন। এটা আগের লেখার বিষয়।</li>
<li><strong>জরুরি তহবিল আছে?</strong> ছয় মাসের খরচ আলাদা করে রাখা না থাকলে, বাজার পড়ার সময়ই আপনার টাকা লাগবে, কারণ খারাপ সময় সাধারণত একসঙ্গে আসে। চাকরি যায় আর বাজারও পড়ে, একই মন্দায়।</li>
<li><strong>আয় কতটা নিশ্চিত?</strong> সরকারি চাকরি, বেসরকারি চাকরি আর নিজের ব্যবসা, তিনটার নিশ্চয়তা তিন রকম। আয় যত অনিশ্চিত, বিনিয়োগে ঝুঁকি তত কম নেওয়া উচিত।</li>
<li><strong>কে নির্ভরশীল?</strong> একা মানুষ আর চারজনের সংসার চালানো মানুষ, দুইজনের একই ভুলের দাম এক না।</li>
<li><strong>ধার আছে?</strong> ১৪% সুদের ব্যক্তিগত ঋণ থাকা অবস্থায় বিনিয়োগ করা মানে ১৪% নিশ্চিত খরচের বিপরীতে ১০% অনিশ্চিত আয়ের বাজি ধরা। এটা কখনোই কাজ করে না।</li>
</ol>

<div class="note">এই পাঁচটার একটাতেও উত্তর খারাপ এলে সেটা "বিনিয়োগ করবেন না" মানে না। মানে হলো, ওই সমস্যাটা আগে সারানোই আপনার সবচেয়ে ভালো বিনিয়োগ। ১৪% সুদের ঋণ শোধ করা মানে নিশ্চিত ১৪% রিটার্ন, যা কোনো শেয়ার নিশ্চিত করতে পারে না।</div>

<h2>পড়ে যাওয়া থেকে ফেরার অঙ্ক</h2>

<p>এই সংখ্যাটা বেশিরভাগ মানুষ জানেন না, আর জানলে অনেক সিদ্ধান্ত বদলে যেত।</p>

${mount("drawdown-lab")}

<p>৫০% পড়লে ফিরতে ১০০% উঠতে হয়। ক্ষতি আর লাভ সমান নয়, আর এই অসমতাটাই কারণ যে বড় ক্ষতি এড়ানো বড় লাভ খোঁজার চেয়ে দামি। যে কৌশল বছরে ২৫% আনে আর একবার ৬০% হারায়, সেটা যে কৌশল বছরে ১১% আনে আর কখনো ২০%-এর বেশি হারায় না তার চেয়ে খারাপ, দশ বছরে।</p>

<h2>তিনটা মানুষ, তিনটা আলাদা উত্তর</h2>

${mount("three-profiles")}

<h2>নিজের হিসাবটা করে ফেলুন</h2>

${mount("risk-drill")}

<h2>নিজে যাচাই করুন</h2>

${mount("risk-quiz")}

<div class="side-note">
<p class="side-note-label">মোদ্দাকথা</p>
<p>ঝুঁকি কমানোর সবচেয়ে বড় হাতিয়ারটা কোনো শেয়ার বাছাই না। সেটা হলো: ধার করে বিনিয়োগ না করা, জরুরি তহবিল আগে গড়া, আর যত টাকা তিন বছরের ভেতর লাগবে তা বাজারের বাইরে রাখা। এই তিনটা করলে বাজারের যেকোনো পতন আপনার জন্য একটা খবর হয়ে থাকে, বিপদ হয় না।</p>
</div>

<p>এবার আটটা ধাপ শুরু। প্রথমটা টাকার নিজের গোছগাছ: <a class="term" href="/money/start/money-first.html">টাকাটা আগে ঠিক করুন</a>।</p>
`,
  en: `
<p>In December 2010 the Dhaka market fell 660 points in a single day. Thousands of people came out on to the street in Motijheel. Over the next eleven months the index roughly halved. Many lost everything they had; some took their own lives.</p>

<p>That story is not here to frighten anybody. It is here because the people hurt worst mostly made the same mistake: they put money into the market that had no business being there, and a great many of them had borrowed it. The market fell for everyone. The people who could afford to wait were back within about three years. The people who could not were forced to sell at the worst possible price.</p>

<p>So this lesson is not about money, it is about you. Two separate things get measured here, and people routinely confuse them.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Capacity for risk: how much of a shock your situation can absorb. This is arithmetic.</li>
<li>Tolerance for risk: what you will actually do when it falls. This is temperament.</li>
<li>Whichever of the two is smaller is your real risk level.</li>
<li>A 30% fall is not unusual. Getting level again takes a 43% rise, and that is the number that matters.</li>
<li>The cheapest way to cut risk is not borrowing, not picking better shares.</li>
</ul>
</div>

<h2>One question first</h2>

${mount("crash-reveal")}

<h2>Two different things</h2>

<p>A 26 year old in a government job, nobody depending on them, six months of expenses set aside, has a great deal of capacity. But if a 15% fall costs them sleep and they sell, their tolerance is low. The smaller of the two is their real risk level, because in the end the hand on the button is theirs.</p>

${mount("capacity-scale")}

<p>The reverse also happens and it is more dangerous. Someone of 54, retiring in three years, a son's wedding coming, but temperamentally fearless. High tolerance, low capacity. If they listen to the courage, they will be in trouble in three years with no time left to fix it.</p>

<h2>Five questions that measure capacity</h2>

<p>These have numerical answers, so there is nothing to argue about.</p>

<ol class="step-list">
<li><strong>When do you need it?</strong> Under three years, capacity is zero however brave you are. That was the last lesson.</li>
<li><strong>Is there an emergency fund?</strong> Without six months of expenses set aside, you will need the money exactly when the market is down, because bad things arrive together. The job goes and the market falls in the same recession.</li>
<li><strong>How certain is the income?</strong> A government job, a private one and your own business carry three different certainties. The less certain the income, the less risk the portfolio should carry.</li>
<li><strong>Who depends on you?</strong> One person alone and one person running a household of four do not pay the same price for the same mistake.</li>
<li><strong>Is there debt?</strong> Investing while carrying a 14% personal loan means betting an uncertain 10% against a certain 14%. That never works.</li>
</ol>

<div class="note">A bad answer to any of the five does not mean "do not invest". It means fixing that thing is your best available investment. Paying off a 14% loan is a guaranteed 14% return, which no share can promise.</div>

<h2>The arithmetic of getting back</h2>

<p>Most people do not know this number, and a lot of decisions would change if they did.</p>

${mount("drawdown-lab")}

<p>A 50% fall needs a 100% rise to undo. Losses and gains are not symmetric, and that asymmetry is why avoiding the big loss beats hunting the big gain. A strategy that makes 25% a year and loses 60% once is worse over ten years than one that makes 11% and never loses more than 20%.</p>

<h2>Three people, three different answers</h2>

${mount("three-profiles")}

<h2>Do your own sum</h2>

${mount("risk-drill")}

<h2>Check yourself</h2>

${mount("risk-quiz")}

<div class="side-note">
<p class="side-note-label">The short version</p>
<p>The biggest lever on risk is not which share you pick. It is: do not invest borrowed money, build the emergency fund first, and keep anything needed inside three years out of the market. Do those three and any market fall stays a news item rather than becoming an emergency.</p>
</div>

<p>Now the eight steps begin, and the first one is about the money itself: <a class="term" href="/money/start/money-first.html">Get your money ready first</a>.</p>
`,
  blocks: {
    "crash-reveal": {
      kind: "reveal",
      title: { bn: "সৎ উত্তরটা দিন", en: "Answer honestly" },
      ask: {
        bn: "আপনি দশ লাখ টাকা বিনিয়োগ করেছেন। ছয় মাস পর হিসাব খুলে দেখলেন সাত লাখ। খবরে বলছে আরও পড়তে পারে। আপনি কী করবেন?",
        en: "You invested ten lakh taka. Six months later the account reads seven lakh, and the news says it may fall further. What do you do?",
      },
      choices: [
        { bn: "সব বেচে দেব, আর ঘুমাব", en: "Sell everything and get some sleep" },
        { bn: "কিছুই করব না, অপেক্ষা করব", en: "Do nothing and wait" },
        { bn: "আরও কিনব, সস্তা হয়েছে", en: "Buy more: it is cheaper now" },
        { bn: "জানি না, কখনো ভাবিনি", en: "I do not know, I have never thought about it" },
      ],
      answer: {
        bn: "চারটাই সৎ উত্তর হতে পারে। কোনটা আপনার, সেটাই এই লেখার আসল বিষয়।",
        en: "All four can be honest answers. Which one is yours is the point of this lesson.",
      },
      why: {
        bn: "প্রথম উত্তরটা মানে আপনার সহ্যক্ষমতা কম, আর সেটা কোনো দোষ না, একটা তথ্য। যিনি জানেন যে তিনি পড়লে বেচে দেবেন, তার উচিত এমন পোর্টফোলিও রাখা যা এতটা পড়ে না, নাহলে তিনি প্রতি চক্রে উপরে কিনে নিচে বেচবেন। দ্বিতীয় আর তৃতীয় উত্তরের মানুষ শেয়ারে বেশি টাকা রাখতে পারেন। চতুর্থ উত্তরটা সবচেয়ে সাধারণ আর সবচেয়ে বিপজ্জনক: যিনি আগে ভাবেননি, তিনি সিদ্ধান্তটা নেবেন ঠিক সেই মুহূর্তে যখন ভয় সবচেয়ে বেশি, আর ভয়ের সময় নেওয়া সিদ্ধান্ত প্রায় সবসময় ভুল হয়। তাই এই প্রশ্নের উত্তরটা আজ লিখে রাখাই আসল কাজ।",
        en: "The first answer means low tolerance, which is not a failing, it is information. Someone who knows they will sell in a fall should hold a portfolio that does not fall that far, or they will buy high and sell low every cycle. The second and third can carry more in shares. The fourth is the commonest and the most dangerous: someone who has never thought about it will make the decision at the exact moment fear peaks, and decisions made in fear are almost always wrong. Writing your answer down today is the real work here.",
      },
    },
    "capacity-scale": {
      kind: "figure",
      shape: "scale",
      title: { bn: "সামর্থ্য আর সহ্যক্ষমতা", en: "Capacity against tolerance" },
      parts: [
        {
          text: { bn: "ঝুঁকি নেওয়ার সামর্থ্য", en: "Capacity to take risk" },
          note: { bn: "সময়, জরুরি তহবিল, আয়ের নিশ্চয়তা, নির্ভরশীল, ধার", en: "Time, emergency fund, income security, dependants, debt" },
          value: 8,
          tone: "good",
        },
        {
          text: { bn: "ঝুঁকি সহ্য করার ক্ষমতা", en: "Tolerance for risk" },
          note: { bn: "পড়ে গেলে আপনি আসলে কী করবেন", en: "What you will actually do in a fall" },
          value: 4,
          tone: "warn",
        },
      ],
      caption: {
        bn: "যেটা ছোট, সেটাই আপনার আসল ঝুঁকি। এখানে সামর্থ্য বেশি হলেও কাজে লাগানো যাবে ছোটটাই, কারণ শেষ পর্যন্ত হাতটা আপনার।",
        en: "The smaller one wins. Capacity may be high, and what you can actually use is the lower number, because the hand on the button is yours.",
      },
    },
    "drawdown-lab": {
      kind: "lab",
      model: "drawdown",
      title: { bn: "পড়ে যাওয়া থেকে ফিরতে কত লাগে", en: "What it takes to get level again" },
      note: {
        bn: "পতনের হার বাড়িয়ে দেখুন, আর ফেরার জন্য দরকারি উত্থানটা কত দ্রুত বাড়ে লক্ষ করুন।",
        en: "Raise the fall and watch how much faster the required rise grows.",
      },
      preset: { fall: 30, rate: 12 },
    },
    "three-profiles": {
      kind: "compare",
      title: { bn: "একই বাজার, তিনটা আলাদা উত্তর", en: "One market, three different answers" },
      columns: [
        { bn: "রাকিব, ২৬", en: "Rakib, 26" },
        { bn: "নাসরিন, ৩৯", en: "Nasrin, 39" },
        { bn: "আনোয়ার, ৫৪", en: "Anwar, 54" },
      ],
      rows: [
        {
          label: { bn: "টাকাটা কবে লাগবে", en: "When the money is needed" },
          cells: [
            { bn: "৩০ বছর পর, অবসরে", en: "In 30 years, at retirement" },
            { bn: "৮ বছর পর, সন্তানের পড়া", en: "In 8 years, a child's education" },
            { bn: "৩ বছর পর, অবসরে", en: "In 3 years, at retirement" },
          ],
        },
        {
          label: { bn: "আয়", en: "Income" },
          cells: [
            { bn: "সরকারি চাকরি, নিশ্চিত", en: "Government job, secure" },
            { bn: "বেসরকারি চাকরি", en: "Private sector" },
            { bn: "নিজের দোকান, ওঠানামা করে", en: "Own shop, uneven" },
          ],
        },
        {
          label: { bn: "নির্ভরশীল", en: "Dependants" },
          cells: [
            { bn: "কেউ না", en: "None" },
            { bn: "দুই সন্তান", en: "Two children" },
            { bn: "স্ত্রী, এক ছেলে", en: "Wife, one son" },
          ],
        },
        {
          label: { bn: "শেয়ারে কতটা যুক্তিসঙ্গত", en: "How much in shares is reasonable" },
          cells: [
            { bn: "৭০ থেকে ৮০ শতাংশ", en: "70 to 80 percent" },
            { bn: "৪০ থেকে ৫০ শতাংশ", en: "40 to 50 percent" },
            { bn: "১০ থেকে ২০ শতাংশ", en: "10 to 20 percent" },
          ],
        },
        {
          label: { bn: "সবচেয়ে বড় ভুল যেটা করতে পারেন", en: "The biggest mistake available to them" },
          cells: [
            { bn: "খুব নিরাপদে রেখে ত্রিশ বছর মূল্যস্ফীতিতে হারা", en: "Playing so safe that thirty years go to inflation" },
            { bn: "একটা খাতে সব রেখে দেওয়া", en: "Putting it all in one sector" },
            { bn: "শেষ তিন বছরে সাহস দেখানো", en: "Getting brave in the last three years" },
          ],
        },
      ],
    },
    "risk-drill": {
      kind: "drill",
      title: { bn: "পাঁচটা প্রশ্ন, লিখে ফেলুন", en: "Five questions, written down" },
      steps: [
        {
          text: { bn: "লিখুন: এই টাকাটা কত বছর পর লাগবে", en: "Write down: how many years until you need this money" },
        },
        {
          text: { bn: "লিখুন: কত মাসের খরচ আলাদা করে রাখা আছে", en: "Write down: how many months of expenses are set aside" },
          hint: { bn: "শূন্য হলেও লিখুন। পরের লেখাটাই এই নিয়ে।", en: "Write zero if it is zero. The next lesson is about exactly this." },
        },
        {
          text: { bn: "লিখুন: কত টাকার ধার আছে আর সুদ কত", en: "Write down: what you owe and at what rate" },
          hint: { bn: "১২% এর বেশি হলে ওটা শোধ করাই আপনার সেরা বিনিয়োগ।", en: "Above 12%, clearing it is the best investment available to you." },
        },
        {
          text: { bn: "উপরের প্রশ্নে আপনি কোন উত্তরটা দিয়েছিলেন, সেটা লিখে রাখুন", en: "Write down which answer you gave to the question above" },
          hint: { bn: "তারিখসহ। দুই বছর পর বাজার পড়লে এই কাগজটা পড়বেন।", en: "With the date. Read it back the next time the market falls." },
        },
        {
          text: { bn: "ঠিক করুন: শেয়ার আর ফান্ডে সর্বোচ্চ কত শতাংশ যাবে", en: "Decide: the most that will ever go into shares and funds" },
          hint: { bn: "সংখ্যাটা লিখে রাখুন। পরে বাড়ানো যাবে, কিন্তু উত্তেজনার সময় না।", en: "Write the number down. It can be raised later, just never in the middle of a rally." },
        },
      ],
    },
    "risk-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "কারো ১৪% সুদের ব্যক্তিগত ঋণ আছে আর হাতে দুই লাখ টাকা এসেছে। কোনটা করা উচিত?",
            en: "Someone has a 14% personal loan and two lakh taka has come in. What should they do?",
          },
          options: [
            {
              text: { bn: "ঋণ শোধ করা", en: "Clear the loan" },
              right: true,
              why: {
                bn: "১৪% সুদ বাঁচানো মানে নিশ্চিত ১৪% রিটার্ন, কোনো ঝুঁকি ছাড়া, কোনো কর ছাড়া। শেয়ারবাজার এটা প্রতিশ্রুতি দিতে পারে না। এটা এই পুরো পাঠশালার সবচেয়ে সহজ অঙ্ক।",
                en: "Saving 14% of interest is a guaranteed 14% return, risk free and tax free. The market cannot promise that. It is the easiest sum in the whole school.",
              },
            },
            {
              text: { bn: "বিনিয়োগ করা, কারণ বাজারে বেশি পাওয়া যায়", en: "Invest it, because the market pays more" },
              why: {
                bn: "বাজারে গড়ে বেশি পাওয়া যেতে পারে, নিশ্চিত না। আপনি নিশ্চিত ১৪% খরচের বিপরীতে অনিশ্চিত রিটার্নের বাজি ধরছেন, আর খারাপ বছরে দুই দিক থেকেই মার খাবেন।",
                en: "The market may pay more on average, not certainly. You would be betting an uncertain return against a certain 14% cost, and in a bad year you lose on both sides.",
              },
            },
            {
              text: { bn: "অর্ধেক ঋণে, অর্ধেক বিনিয়োগে", en: "Half to the loan, half invested" },
              why: {
                bn: "ভালো শোনায়, কিন্তু অঙ্কটা বদলায় না: যে অর্ধেকটা বিনিয়োগে গেল, সেটার বিপরীতে এখনো ১৪% সুদ চলছে। উঁচু সুদের ঋণ থাকলে হিসাবটা সোজা।",
                en: "It sounds balanced and the arithmetic does not change: the invested half is still carrying 14% against it. With high-rate debt the sum is not close.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা পোর্টফোলিও ৪০% পড়েছে। আগের জায়গায় ফিরতে কত উঠতে হবে?",
            en: "A portfolio has fallen 40%. How much does it have to rise to get level?",
          },
          options: [
            {
              text: { bn: "৪০%", en: "40%" },
              why: {
                bn: "না, আর এই ভুলটাই সবচেয়ে সাধারণ। ১০০ টাকা ৪০% পড়ে ৬০ হয়। ৬০ থেকে ১০০ হতে হলে ৪০ বাড়তে হবে, আর ৬০ এর ৪০ হলো ৬৭ শতাংশ।",
                en: "No, and this is the commonest slip. 100 falls 40% to 60. Going from 60 back to 100 is a rise of 40, and 40 on a base of 60 is 67 percent.",
              },
            },
            {
              text: { bn: "প্রায় ৬৭%", en: "About 67%" },
              right: true,
              why: {
                bn: "ঠিক। উপরের হিসাবে ৪০ বসিয়ে দেখুন। এই অসমতাটাই কারণ বড় ক্ষতি এড়ানো বড় লাভ খোঁজার চেয়ে দামি।",
                en: "Right. Put 40 into the calculator above. That asymmetry is why avoiding the big loss beats chasing the big gain.",
              },
            },
            {
              text: { bn: "৮০%", en: "80%" },
              why: {
                bn: "বেশি হয়ে গেল। ৮০% হলো ৪৪% পতনের জবাব। সঠিক সংখ্যাটা ৬৭%।",
                en: "Too much: 80% answers a 44% fall. The right number is 67%.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কোনগুলো ঝুঁকি নেওয়ার সামর্থ্য বাড়ায়? একাধিক উত্তর ঠিক।",
            en: "Which of these raise your capacity to take risk? More than one is right.",
          },
          options: [
            {
              text: { bn: "ছয় মাসের খরচ আলাদা করে রাখা", en: "Six months of expenses set aside" },
              right: true,
              why: {
                bn: "হ্যাঁ। এটা থাকলে খারাপ সময়ে আপনাকে বেচতে হবে না, আর না বেচাটাই সব।",
                en: "Yes. With it you are never forced to sell in a bad month, and not selling is the whole game.",
              },
            },
            {
              text: { bn: "টাকা লাগার সময়টা আরও দূরে সরানো", en: "Pushing the date you need the money further out" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর এটাই সবচেয়ে শক্তিশালী হাতিয়ার। সময় থাকলে একটা খারাপ বছর কেবল একটা বছর।",
                en: "Yes, and it is the strongest lever there is. With time, a bad year is only a year.",
              },
            },
            {
              text: { bn: "মার্জিন ঋণ নিয়ে বেশি শেয়ার কেনা", en: "Taking a margin loan to buy more" },
              why: {
                bn: "উল্টো। ধার সামর্থ্য কমায়, বাড়ায় না: ব্রোকার আপনার হয়ে বেচে দিতে পারে, আর ঠিক সবচেয়ে খারাপ দামে। পর্যায় ১-এ এর আলাদা লেখা আছে।",
                en: "The opposite. Debt lowers capacity: the broker can sell for you, at the worst possible price. There is a whole lesson on it in stage 1.",
              },
            },
            {
              text: { bn: "আয়ের একটা দ্বিতীয় উৎস থাকা", en: "Having a second source of income" },
              right: true,
              why: {
                bn: "হ্যাঁ। একটা আয় বন্ধ হলে যদি আরেকটা চলে, তাহলে খারাপ সময়ে বিনিয়োগে হাত দেওয়ার দরকার পড়ে না।",
                en: "Yes. If one income stops and another continues, a bad stretch never has to reach the portfolio.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"money-first": {
  bn: `
<p>শেয়ার কেনার আগে তিনটা জিনিস ঠিক থাকতে হয়। এই তিনটার একটাও যদি ঠিক না থাকে, তাহলে আপনি বিনিয়োগ করছেন না, ঝুঁকির ওপর ঝুঁকি চাপাচ্ছেন। আর এর মধ্যে সবচেয়ে বিরক্তিকর কথাটা হলো: এই তিনটা ঠিক করাই আসলে আপনার সবচেয়ে লাভজনক কাজ, যেকোনো শেয়ারের চেয়ে বেশি।</p>

<p>কারণটা সহজ। শেয়ার থেকে বছরে ১২% পাওয়া একটা আশা। ১৮% সুদের ক্রেডিট কার্ডের বকেয়া শোধ করা একটা নিশ্চিত ১৮%। কোনো ফান্ড ম্যানেজার আপনাকে নিশ্চিত ১৮% দিতে পারবেন না।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>এক, মাসে কত টাকা আসলে আলাদা রাখতে পারেন, সেটা জানা।</li>
<li>দুই, ছয় মাসের খরচের একটা জরুরি তহবিল, ব্যাংকে, হাতের কাছে।</li>
<li>তিন, উঁচু সুদের ধার শেষ করা। ১২% এর বেশি হলে ওটাই আগে।</li>
<li>এই তিনটার পর যা থাকে, সেটাই বিনিয়োগের টাকা। তার আগে যা যায়, সেটা জুয়া।</li>
<li>জরুরি তহবিল বিনিয়োগ নয় এবং হওয়ার চেষ্টাও করা উচিত না।</li>
</ul>
</div>

<h2>এক: আসলে কত জমে</h2>

<p>বেশিরভাগ মানুষ জানেন না। আন্দাজ করেন, আর আন্দাজটা প্রায় সবসময় বাস্তবের চেয়ে বেশি হয়। তাই প্রথম কাজ হলো দুইটা সংখ্যা বের করা: মাসে কত আসে, আর মাসে কত যায়।</p>

${mount("savings-lab")}

<p>যে সংখ্যাটা বেরোল, সেটাই আপনার আসল ক্ষমতা। এটা যদি শূন্য বা ঋণাত্মক হয়, তাহলে এই পাঠশালার বাকি সবকিছুর আগে ওটাই ঠিক করার জিনিস, আর সেটা করতে খরচের বড় লাইনগুলো লাগবে: বাড়িভাড়া, কিস্তি, যাতায়াত। চায়ের খরচ বাঁচিয়ে কেউ কখনো বিনিয়োগ শুরু করেননি।</p>

<div class="side-note">
<p class="side-note-label">এক মাস মেপে দেখুন</p>
<p>যদি খরচের সংখ্যাটা না জানেন, এক মাস ধরে প্রতিটা খরচ লিখুন, ফোনের নোটে হলেও। বেশিরভাগ মানুষ এই এক মাসেই দুই-তিনটা লাইন খুঁজে পান যা তারা জানতেনই না। এটা করা বিরক্তিকর আর এটা একবারই করতে হয়।</p>
</div>

<h2>দুই: জরুরি তহবিল</h2>

<p>এটা আপনার বিনিয়োগ যাত্রার সবচেয়ে গুরুত্বপূর্ণ অংশ, আর সবচেয়ে অবহেলিত। জরুরি তহবিল হলো ছয় মাসের খরচের সমান টাকা, একটা সাধারণ সেভিংস অ্যাকাউন্টে, যেটা যেকোনো দিন তোলা যায়।</p>

<p>এটা কেন এত জরুরি, তা একটা কথায় বোঝা যায়: <strong>খারাপ জিনিসগুলো একসঙ্গে আসে।</strong> মন্দা এলে চাকরি যায় আর শেয়ারবাজারও পড়ে, একই মাসে। জরুরি তহবিল না থাকলে আপনাকে ঠিক ওই মাসেই শেয়ার বেচতে হবে, সবচেয়ে খারাপ দামে। জরুরি তহবিল আসলে শেয়ার বাঁচানোর জিনিস, নিজেকে বাঁচানোর জিনিস নয়।</p>

${mount("emergency-lab")}

<div class="note">জরুরি তহবিলকে "কাজে লাগানোর" চেষ্টা করবেন না। এটা সঞ্চয়পত্রে, ফান্ডে বা তিন বছরের এফডিআরে রাখলে এটা আর জরুরি তহবিল থাকে না, কারণ যেদিন লাগবে সেদিন হাতে পাওয়া যাবে না বা ভেঙে ক্ষতি দিতে হবে। এই টাকাটা মূল্যস্ফীতিতে সামান্য হারবে, আর সেটাই এর দাম। বিমার প্রিমিয়ামের মতো ভাবুন।</div>

<h2>তিন: ধার</h2>

<p>ধার সব এক রকম না, আর এখানে সুদের হারটাই সব ঠিক করে দেয়।</p>

<div class="table-scroll">
<table>
<thead>
<tr><th>ধারের ধরন</th><th>সাধারণত সুদ</th><th>কী করবেন</th></tr>
</thead>
<tbody>
<tr><td>ক্রেডিট কার্ডের বকেয়া</td><td>২০% থেকে ৩০%</td><td>সবকিছুর আগে, আজই</td></tr>
<tr><td>ব্যক্তিগত ঋণ</td><td>১২% থেকে ১৮%</td><td>বিনিয়োগের আগে</td></tr>
<tr><td>গাড়ির ঋণ</td><td>৯% থেকে ১৩%</td><td>বিনিয়োগের আগে, বেশিরভাগ ক্ষেত্রে</td></tr>
<tr><td>বাড়ির ঋণ</td><td>৮% থেকে ১১%</td><td>পাশাপাশি চলতে পারে</td></tr>
<tr><td>শিক্ষা ঋণ, ভর্তুকিসহ</td><td>৫% থেকে ৮%</td><td>পাশাপাশি চলতে পারে</td></tr>
</tbody>
</table>
</div>

<p>নিয়মটা সহজ: ধারের সুদ যদি আপনার বিনিয়োগ থেকে আশা করা রিটার্নের চেয়ে বেশি হয়, ধারটা আগে। আর মনে রাখবেন, ধারের সুদ নিশ্চিত আর রিটার্ন অনিশ্চিত, তাই সমান হলেও ধারটাই আগে।</p>

<h2>ক্রমটা মনে রাখুন</h2>

${mount("order-flow")}

<h2>ক্রমটা সাজান</h2>

${mount("order-puzzle")}

<h2>করে ফেলুন</h2>

${mount("money-drill")}

<h2>নিজে যাচাই করুন</h2>

${mount("money-quiz")}

<p>টাকা তৈরি হলে এবার কাগজপত্র: <a class="term" href="/money/start/papers.html">কাগজপত্র গুছিয়ে নিন</a>।</p>
`,
  en: `
<p>Three things have to be in place before you buy a share. If any one of them is not, you are not investing, you are stacking risk on risk. And the tedious part is this: sorting those three out is the most profitable thing you can do with your money, more profitable than any share.</p>

<p>The reason is simple. Twelve percent a year from shares is a hope. Clearing an 18% credit card balance is a certain 18%. No fund manager can hand you a certain 18%.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>One: know how much you can actually set aside each month.</li>
<li>Two: six months of expenses in an emergency fund, in a bank, reachable.</li>
<li>Three: clear high-rate debt. Above 12%, that comes first.</li>
<li>What is left after those three is the money you invest. What goes in before them is a gamble.</li>
<li>An emergency fund is not an investment and should not be made to behave like one.</li>
</ul>
</div>

<h2>One: what actually accumulates</h2>

<p>Most people do not know. They estimate, and the estimate is almost always higher than the truth. So the first job is two numbers: what comes in each month and what goes out.</p>

${mount("savings-lab")}

<p>Whatever came out of that is your real capacity. If it is zero or negative, that is the thing to fix before anything else in this school, and fixing it means the big lines: rent, instalments, transport. Nobody ever started investing by skipping tea.</p>

<div class="side-note">
<p class="side-note-label">Measure one month</p>
<p>If you do not know the spending number, write down every expense for a single month, even in your phone's notes. Most people find two or three lines in that month they did not know were there. It is boring and you only have to do it once.</p>
</div>

<h2>Two: the emergency fund</h2>

<p>This is the most important part of your investing life and the most neglected. An emergency fund is six months of expenses in an ordinary savings account, reachable any day.</p>

<p>Why it matters comes down to one sentence: <strong>bad things arrive together.</strong> In a recession the job goes and the market falls in the same month. Without a fund you have to sell shares in exactly that month, at exactly the worst price. The fund is really there to protect the shares, not you.</p>

${mount("emergency-lab")}

<div class="note">Do not try to make the emergency fund "work". Put it in savings certificates, a fund or a three year deposit and it stops being an emergency fund, because on the day you need it you either cannot reach it or you break it at a loss. This money will lose slightly to inflation, and that is its price. Think of it as an insurance premium.</div>

<h2>Three: debt</h2>

<p>Not all debt is the same, and the rate decides everything here.</p>

<div class="table-scroll">
<table>
<thead>
<tr><th>Kind of debt</th><th>Typical rate</th><th>What to do</th></tr>
</thead>
<tbody>
<tr><td>Credit card balance</td><td>20% to 30%</td><td>Before anything else, today</td></tr>
<tr><td>Personal loan</td><td>12% to 18%</td><td>Before investing</td></tr>
<tr><td>Car loan</td><td>9% to 13%</td><td>Before investing, usually</td></tr>
<tr><td>Home loan</td><td>8% to 11%</td><td>Can run alongside</td></tr>
<tr><td>Subsidised student loan</td><td>5% to 8%</td><td>Can run alongside</td></tr>
</tbody>
</table>
</div>

<p>The rule is simple: if the debt costs more than you expect to earn, the debt goes first. And remember the cost is certain while the return is not, so even at parity the debt still goes first.</p>

<h2>Remember the order</h2>

${mount("order-flow")}

<h2>Put it in order</h2>

${mount("order-puzzle")}

<h2>Go and do it</h2>

${mount("money-drill")}

<h2>Check yourself</h2>

${mount("money-quiz")}

<p>With the money ready, next comes the paperwork: <a class="term" href="/money/start/papers.html">Get your papers in order</a>.</p>
`,
  blocks: {
    "savings-lab": {
      kind: "lab",
      model: "savings-rate",
      title: { bn: "মাসে আসলে কত থাকে", en: "What is actually left each month" },
      preset: { income: 40000, spend: 32000 },
    },
    "emergency-lab": {
      kind: "lab",
      model: "emergency",
      title: { bn: "জরুরি তহবিল কত আর কতদিনে", en: "How big, and how long" },
      note: {
        bn: "আয় অনিশ্চিত হলে ছয়ের বদলে নয় বা বারো মাস ধরুন।",
        en: "If the income is uneven, use nine or twelve months rather than six.",
      },
      preset: { spend: 30000, months: 6, have: 40000, save: 8000 },
    },
    "order-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "টাকা কোথায় কোন ক্রমে যায়", en: "Where money goes, in order" },
      parts: [
        { text: { bn: "মাসের খরচ", en: "The month's costs" }, note: { bn: "ভাড়া, খাওয়া, যাতায়াত", en: "Rent, food, transport" }, tone: "plain" },
        { text: { bn: "উঁচু সুদের ধার", en: "High-rate debt" }, note: { bn: "১২% এর বেশি হলে এখানেই", en: "Anything above 12% stops here" }, tone: "bad" },
        { text: { bn: "জরুরি তহবিল", en: "Emergency fund" }, note: { bn: "ছয় মাসের খরচ, ব্যাংকে", en: "Six months of costs, in a bank" }, tone: "warn" },
        { text: { bn: "বিনিয়োগ", en: "Investing" }, note: { bn: "যা থাকে, প্রতি মাসে", en: "What is left, every month" }, tone: "good" },
      ],
      caption: {
        bn: "ক্রমটা উল্টে দিলে প্রতিটা ধাপই কাজ করা বন্ধ করে দেয়।",
        en: "Reverse the order and every step stops working.",
      },
    },
    "order-puzzle": {
      kind: "order",
      title: { bn: "কোনটা আগে", en: "Which comes first" },
      note: { bn: "উপরে-নিচে সরিয়ে ক্রমে সাজান, তারপর মিলিয়ে দেখুন।", en: "Move them into order, then check." },
      items: [
        {
          text: { bn: "এক মাসের খরচ লিখে রাখা", en: "Write down one month of spending" },
          why: { bn: "সংখ্যাটা না জানলে বাকি কোনো সিদ্ধান্তই নেওয়া যায় না।", en: "Without the number, none of the later decisions can be made." },
        },
        {
          text: { bn: "ক্রেডিট কার্ডের বকেয়া শোধ", en: "Clear the credit card balance" },
          why: { bn: "২৫% সুদ। এর চেয়ে ভালো নিশ্চিত রিটার্ন কোথাও নেই।", en: "25% interest. No certain return anywhere beats it." },
        },
        {
          text: { bn: "এক মাসের খরচ ব্যাংকে জমা", en: "One month of expenses into the bank" },
          why: { bn: "পুরো ছয় মাস একবারে নয়। প্রথম মাসটাই সবচেয়ে বড় পরিবর্তন।", en: "Not six months at once. The first month is the biggest change." },
        },
        {
          text: { bn: "ছয় মাসের জরুরি তহবিল পূর্ণ করা", en: "Fill the fund to six months" },
          why: { bn: "এখানে পৌঁছালে আপনি আর কখনো খারাপ দামে বেচতে বাধ্য হবেন না।", en: "Reach this and you are never again forced to sell at a bad price." },
        },
        {
          text: { bn: "প্রথম মিউচুয়াল ফান্ড কেনা", en: "Buy the first mutual fund" },
          why: { bn: "উপরের চারটার পরে, আর তখন এটা আর ঝুঁকিপূর্ণ কাজ নয়।", en: "After the four above, at which point it stops being a risky act." },
        },
        {
          text: { bn: "একক শেয়ার বাছাই শুরু", en: "Start picking individual shares" },
          why: { bn: "সবার শেষে, আর পর্যায় ৩ শেষ করার পর।", en: "Last of all, and after stage 3." },
        },
      ],
    },
    "money-drill": {
      kind: "drill",
      title: { bn: "এই সপ্তাহের কাজ", en: "This week's work" },
      steps: [
        { text: { bn: "গত মাসের ব্যাংক স্টেটমেন্ট খুলে মোট খরচটা বের করুন", en: "Open last month's bank statement and total the spending" } },
        { text: { bn: "সব ধারের তালিকা করুন, প্রতিটার সুদের হারসহ", en: "List every debt with its interest rate beside it" },
          hint: { bn: "হার না জানলে ব্যাংকে ফোন করুন। এই এক ফোনেই অনেক সিদ্ধান্ত হয়ে যায়।", en: "If you do not know a rate, phone and ask. That one call settles a lot." } },
        { text: { bn: "জরুরি তহবিলের জন্য একটা আলাদা অ্যাকাউন্ট খুলুন", en: "Open a separate account for the emergency fund" },
          hint: { bn: "আলাদা হওয়াটা জরুরি। একই অ্যাকাউন্টে থাকলে খরচ হয়ে যায়।", en: "Separate matters. In the same account it gets spent." } },
        { text: { bn: "বেতনের দিনে স্বয়ংক্রিয় ট্রান্সফার চালু করুন", en: "Set up an automatic transfer on payday" },
          hint: { bn: "মাস শেষে যা থাকে তা নয়, মাসের শুরুতে যা সরিয়ে রাখেন তা।", en: "Not what is left at the end of the month: what you move at the start of it." } },
        { text: { bn: "সবচেয়ে উঁচু সুদের ধারটার জন্য একটা তারিখ ঠিক করুন", en: "Set a date for clearing the highest-rate debt" } },
      ],
    },
    "money-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "জরুরি তহবিলের টাকা কোথায় রাখা উচিত?",
            en: "Where should the emergency fund sit?",
          },
          options: [
            {
              text: { bn: "একটা সাধারণ সেভিংস অ্যাকাউন্টে", en: "An ordinary savings account" },
              right: true,
              why: {
                bn: "ঠিক। একমাত্র শর্ত হলো যেদিন লাগবে সেদিন পুরো টাকাটা পাওয়া যাবে। রিটার্ন এখানে দ্বিতীয় প্রশ্ন, এমনকি তৃতীয়।",
                en: "Right. The only requirement is that the whole amount is there on the day it is needed. Return is the second question here, or the third.",
              },
            },
            {
              text: { bn: "তিন বছরের সঞ্চয়পত্রে, কারণ সুদ বেশি", en: "A three year savings certificate, since it pays more" },
              why: {
                bn: "সুদ বেশি, ঠিক, কিন্তু মেয়াদের আগে ভাঙলে ক্ষতি। জরুরি অবস্থা মেয়াদ শেষ হওয়ার অপেক্ষা করে না।",
                en: "It pays more, and breaking it early costs you. An emergency does not wait for a maturity date.",
              },
            },
            {
              text: { bn: "একটা ভালো মিউচুয়াল ফান্ডে", en: "A good mutual fund" },
              why: {
                bn: "না, আর কারণটা এই লেখার মূল কথা: খারাপ জিনিসগুলো একসঙ্গে আসে। চাকরি যাওয়ার মাসেই ফান্ডটা ২০% নিচে থাকবে।",
                en: "No, and the reason is this lesson's whole point: bad things arrive together. In the month the job goes, the fund is 20% down.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কারো হাতে ৫০,০০০ টাকা এসেছে। তার ২২% সুদের কার্ড বকেয়া আছে ৩০,০০০, আর জরুরি তহবিল শূন্য। কোনটা করা উচিত?",
            en: "Fifty thousand taka arrives. There is a 30,000 balance on a 22% card and no emergency fund. What now?",
          },
          options: [
            {
              text: { bn: "৩০,০০০ দিয়ে কার্ড শোধ, বাকি ২০,০০০ জরুরি তহবিলে", en: "30,000 clears the card, 20,000 starts the fund" },
              right: true,
              why: {
                bn: "ঠিক। ২২% বাঁচানো নিশ্চিত রিটার্ন, আর বাকিটা দিয়ে তহবিল শুরু হলে পরের বার কার্ডে হাত পড়বে না। এই দুইটা একসঙ্গে করাই আসল কাজ, কারণ তহবিল ছাড়া কার্ডের বকেয়া ফিরে আসে।",
                en: "Right. Saving 22% is a certain return, and starting the fund with the rest is what stops the card filling up again. Doing both is the point: without a fund the balance comes back.",
              },
            },
            {
              text: { bn: "পুরো ৫০,০০০ জরুরি তহবিলে", en: "All 50,000 into the fund" },
              why: {
                bn: "তহবিল থাকবে আর ৩০,০০০-এ ২২% সুদ চলতেই থাকবে, বছরে সাড়ে ছয় হাজার টাকা। তহবিলের অ্যাকাউন্ট ওই টাকা আনবে না।",
                en: "You would have a fund and still be paying 22% on 30,000, which is about six and a half thousand a year. The savings account will not earn that back.",
              },
            },
            {
              text: { bn: "পুরো ৫০,০০০ শেয়ারে, সুযোগটা হারানো ঠিক না", en: "All 50,000 into shares before the chance goes" },
              why: {
                bn: "এই সিদ্ধান্তটাই বাংলাদেশে সবচেয়ে বেশি টাকা খেয়েছে। ২২% খরচের বিপরীতে অনিশ্চিত রিটার্ন, আর তহবিল না থাকায় প্রথম বিপদেই বেচতে হবে।",
                en: "This is the decision that has cost the most money in this market. An uncertain return against a certain 22%, and with no fund the first setback forces a sale.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "মাসে ৪০,০০০ আয়, ৩৮,০০০ খরচ। কোনটা সবচেয়ে কার্যকর পদক্ষেপ?",
            en: "Income 40,000 a month, spending 38,000. What is the most effective move?",
          },
          options: [
            {
              text: { bn: "প্রতিদিনের ছোট খরচ কমানো", en: "Cut the small daily spending" },
              why: {
                bn: "সাহায্য করে, কিন্তু অল্প। ২,০০০ টাকার ফাঁক ছোট খরচ দিয়ে বড় করা কঠিন, আর এটা করতে গিয়ে বেশিরভাগ মানুষ ক্লান্ত হয়ে হাল ছাড়েন।",
                en: "It helps a little. A 2,000 gap is hard to widen with small cuts, and most people burn out trying.",
              },
            },
            {
              text: { bn: "খরচের সবচেয়ে বড় দুইটা লাইন ধরে একবার বড় সিদ্ধান্ত নেওয়া", en: "Take one big decision on the two largest lines" },
              right: true,
              why: {
                bn: "হ্যাঁ। বাড়িভাড়া, কিস্তি বা যাতায়াত, এই লাইনগুলোতে একবার সিদ্ধান্ত নিলে প্রতি মাসে কাজ করে, আর প্রতিদিন মনে রাখতে হয় না।",
                en: "Yes. Rent, an instalment, transport: a decision taken once on one of these works every month afterwards and needs no daily willpower.",
              },
            },
            {
              text: { bn: "আয় বাড়ানোর চেষ্টা করা", en: "Try to earn more" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর দীর্ঘমেয়াদে এটাই সবচেয়ে বড় হাতিয়ার। খরচ কমানোর একটা মেঝে আছে, আয় বাড়ানোর নেই।",
                en: "Yes, and over a career this is the biggest lever of all. Cutting has a floor; earning does not.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"papers": {
  bn: `
<p>এই ধাপটা বিরক্তিকর, আর এইজন্যই বেশিরভাগ মানুষ এখানে আটকে যান। একবার বসে কাগজগুলো গুছিয়ে ফেললে পরের প্রতিটা ধাপে সময় বাঁচে: বিও অ্যাকাউন্ট খুলতে দুই দিন লাগে দুই সপ্তাহের বদলে, আর ব্রোকারের অফিসে দুইবার যেতে হয় না।</p>

<p>বাংলাদেশে শেয়ারবাজারে ঢুকতে যা যা লাগে তা আসলে খুব বেশি না। বেশিরভাগ মানুষের কাছে অর্ধেকটা এমনিতেই আছে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>এনআইডি, ছবি, ব্যাংক অ্যাকাউন্ট আর নমিনির তথ্য, এই চারটা ছাড়া কিছুই হবে না।</li>
<li>টিআইএন বাধ্যতামূলক নয়, কিন্তু না থাকলে ডিভিডেন্ডে বেশি কর কাটা যায়।</li>
<li>নমিনি ঠিক করা পাঁচ মিনিটের কাজ আর সবচেয়ে বেশি অবহেলিত।</li>
<li>ব্যাংক অ্যাকাউন্টটা আপনার নিজের নামে হতে হবে, অন্য কারো নামে নয়।</li>
<li>সব কাগজের ছবি তুলে একটা ফোল্ডারে রাখুন। এই এক অভ্যাস বহু ঘণ্টা বাঁচায়।</li>
</ul>
</div>

<h2>যা যা লাগবে</h2>

${mount("papers-flow")}

<div class="table-scroll">
<table>
<thead>
<tr><th>কাগজ</th><th>কেন লাগে</th><th>না থাকলে</th></tr>
</thead>
<tbody>
<tr><td>জাতীয় পরিচয়পত্র</td><td>পরিচয় যাচাই, বাধ্যতামূলক</td><td>জন্মনিবন্ধন বা পাসপোর্ট কিছু ক্ষেত্রে চলে, তবে এনআইডিই সহজ</td></tr>
<tr><td>পাসপোর্ট সাইজ ছবি</td><td>বিও ফর্মে, সাধারণত দুই কপি</td><td>যেকোনো স্টুডিওতে দশ মিনিট</td></tr>
<tr><td>ব্যাংক অ্যাকাউন্ট</td><td>টাকা আসা-যাওয়ার জন্য, নিজের নামে</td><td>যেকোনো ব্যাংকে খোলা যায়, এমনকি এজেন্ট ব্যাংকিংয়েও</td></tr>
<tr><td>ব্যাংক স্টেটমেন্ট বা চেকের পাতা</td><td>অ্যাকাউন্ট যাচাই</td><td>ব্যাংক থেকে এক দিনে দেয়</td></tr>
<tr><td>নমিনির এনআইডি ও ছবি</td><td>আপনি না থাকলে শেয়ার কার কাছে যাবে</td><td>এটা বাদ দেবেন না, নিচে দেখুন কেন</td></tr>
<tr><td>টিআইএন</td><td>ডিভিডেন্ডে কম কর</td><td>অনলাইনে বিনামূল্যে, এক দিনে</td></tr>
</tbody>
</table>
</div>

<h2>নমিনি: পাঁচ মিনিট, যা সবচেয়ে বেশি বাদ পড়ে</h2>

<p>নমিনি হলো সেই মানুষ, যার কাছে আপনি না থাকলে আপনার শেয়ারগুলো যাবে। বিও ফর্মে এই ঘরটা আছে, আর অনেকেই তাড়াহুড়ায় খালি রেখে দেন বা "পরে দেব" বলেন।</p>

<p>খালি থাকলে কী হয়, সেটা জানা দরকার। শেয়ারগুলো আটকে যায়, আর পরিবারকে উত্তরাধিকার সনদ নিয়ে আদালতে যেতে হয়। এতে মাস লাগে, টাকা লাগে, আর যে সময়টায় পরিবারের সবচেয়ে বেশি টাকা দরকার ঠিক সেই সময়েই টাকাটা পাওয়া যায় না।</p>

<div class="note">নমিনি মানে মালিকানা হস্তান্তর নয়, দাবি করার অধিকার। একাধিক নমিনি দেওয়া যায় শতকরা ভাগ ঠিক করে দিয়ে। বিয়ে, সন্তান জন্ম বা বিচ্ছেদের পর নমিনি হালনাগাদ করার কথা মনে রাখবেন, কারণ ফর্মটা নিজে থেকে বদলায় না।</div>

<h2>টিআইএন: বাধ্যতামূলক নয়, কিন্তু সস্তা</h2>

<p>বিও অ্যাকাউন্ট খুলতে টিআইএন লাগে না। কিন্তু ডিভিডেন্ড থেকে কর কাটার সময় টিআইএন থাকলে কম কাটে, না থাকলে বেশি। পার্থক্যটা সাধারণত দশ শতাংশ বনাম পনেরো শতাংশের মতো, আর হার সময়ে সময়ে বদলায়।</p>

<p>টিআইএন নেওয়া অনলাইনে বিনামূল্যে, এনবিআরের সাইট থেকে, আর এক দিনের কাজ। মনে রাখবেন, টিআইএন থাকা মানে রিটার্ন জমা দেওয়ার দায়িত্বও আসা, আর সেটা আলাদা একটা কাজ।</p>

${mount("papers-compare")}

<h2>একটা ফোল্ডার, একবার</h2>

<p>এই কাজটা করতে বিশ মিনিট লাগে আর সারাজীবন কাজে দেয়। সব কাগজের ছবি তুলে বা স্ক্যান করে একটা জায়গায় রাখুন, ফোনে হোক বা গুগল ড্রাইভে। ব্রোকারের অফিসে বসে "এনআইডির কপি আনিনি" বলাটা এই বিশ মিনিটের অভাবে হয়।</p>

${mount("papers-drill")}

<h2>নিজে যাচাই করুন</h2>

${mount("papers-quiz")}

<p>কাগজ তৈরি। কিন্তু শেয়ারে যাওয়ার আগে আরেকটা ধাপ আছে, আর সেটা এড়িয়ে যাওয়াই বেশিরভাগ মানুষের প্রথম বড় ভুল: <a class="term" href="/money/start/safest-first.html">সবচেয়ে নিরাপদটা দিয়ে শুরু</a>।</p>
`,
  en: `
<p>This step is boring, which is exactly why most people stall here. Sit down once and sort the paperwork out, and every later step gets shorter: a BO account takes two days instead of two weeks, and you do not make a second trip to the broker's office.</p>

<p>What Bangladesh actually asks for is not much. Most people already have half of it.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>NID, photographs, a bank account and a nominee. Nothing happens without those four.</li>
<li>A TIN is not compulsory, and without one more tax is withheld from dividends.</li>
<li>Naming a nominee takes five minutes and is the most skipped step here.</li>
<li>The bank account must be in your own name, not a relative's.</li>
<li>Photograph everything into one folder. That single habit saves hours later.</li>
</ul>
</div>

<h2>What you need</h2>

${mount("papers-flow")}

<div class="table-scroll">
<table>
<thead>
<tr><th>Document</th><th>What it is for</th><th>If you do not have it</th></tr>
</thead>
<tbody>
<tr><td>National ID</td><td>Identity, compulsory</td><td>A birth certificate or passport works in some cases; the NID is simplest</td></tr>
<tr><td>Passport photographs</td><td>The BO form, usually two copies</td><td>Ten minutes at any studio</td></tr>
<tr><td>Bank account</td><td>Money in and out, in your own name</td><td>Any bank will open one, agent banking included</td></tr>
<tr><td>Statement or cheque leaf</td><td>Verifying the account</td><td>The bank issues one in a day</td></tr>
<tr><td>Nominee's ID and photo</td><td>Who the shares go to if you are gone</td><td>Do not skip this: see below</td></tr>
<tr><td>TIN</td><td>Lower tax on dividends</td><td>Free online, one day</td></tr>
</tbody>
</table>
</div>

<h2>The nominee: five minutes, most often skipped</h2>

<p>A nominee is the person your shares go to if you are not there. The BO form has a box for it, and plenty of people leave it blank in a hurry or say they will do it later.</p>

<p>It is worth knowing what blank means. The shares are frozen, and the family has to go to court for a succession certificate. That takes months and money, in exactly the period when the family most needs the money and cannot reach it.</p>

<div class="note">A nominee is not a transfer of ownership, it is a right to claim. You can name more than one with a percentage split. Update the nomination after a marriage, a birth or a separation, because the form does not update itself.</div>

<h2>TIN: not compulsory, and cheap</h2>

<p>You do not need a TIN to open a BO account. You do need one to have less tax withheld from dividends: the difference is usually something like ten percent against fifteen, and the rates change from time to time.</p>

<p>Getting a TIN is free, online, from the NBR site, and takes a day. Do remember that having one brings the duty to file a return, which is a separate job.</p>

${mount("papers-compare")}

<h2>One folder, once</h2>

<p>Twenty minutes now, useful for the rest of your life. Photograph or scan everything into one place, on the phone or in a drive. Saying "I did not bring a copy of my NID" while sitting in a broker's office is what those twenty minutes prevent.</p>

${mount("papers-drill")}

<h2>Check yourself</h2>

${mount("papers-quiz")}

<p>The papers are ready. One step still stands between you and shares, and skipping it is most people's first real mistake: <a class="term" href="/money/start/safest-first.html">Start with the safest thing</a>.</p>
`,
  blocks: {
    "papers-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "কাগজ থেকে অ্যাকাউন্ট", en: "From paperwork to an account" },
      parts: [
        { text: { bn: "এনআইডি ও ছবি", en: "NID and photographs" }, note: { bn: "আপনার নিজের, স্পষ্ট কপি", en: "Your own, a clear copy" } },
        { text: { bn: "নিজের নামে ব্যাংক অ্যাকাউন্ট", en: "A bank account in your name" }, note: { bn: "স্টেটমেন্ট বা চেকের পাতা সহ", en: "With a statement or a cheque leaf" } },
        { text: { bn: "নমিনির তথ্য", en: "The nominee's details" }, note: { bn: "এনআইডি আর এক কপি ছবি", en: "Their NID and one photograph" }, tone: "warn" },
        { text: { bn: "বিও অ্যাকাউন্ট", en: "A BO account" }, note: { bn: "ব্রোকারের অফিসে, দুই থেকে সাত দিন", en: "At the broker, two to seven days" }, tone: "good" },
      ],
    },
    "papers-compare": {
      kind: "compare",
      title: { bn: "টিআইএন থাকলে আর না থাকলে", en: "With a TIN and without" },
      columns: [
        { bn: "টিআইএন আছে", en: "With a TIN" },
        { bn: "টিআইএন নেই", en: "Without" },
      ],
      rows: [
        {
          label: { bn: "বিও খুলতে পারবেন?", en: "Can you open a BO account?" },
          cells: [{ bn: "হ্যাঁ", en: "Yes" }, { bn: "হ্যাঁ", en: "Yes" }],
        },
        {
          label: { bn: "ডিভিডেন্ডে উৎসে কর", en: "Tax withheld on dividends" },
          cells: [
            { bn: "কম হারে", en: "At the lower rate" },
            { bn: "বেশি হারে", en: "At the higher rate" },
          ],
          best: 0,
        },
        {
          label: { bn: "খরচ", en: "What it costs" },
          cells: [
            { bn: "বিনামূল্যে, অনলাইনে", en: "Free, online" },
            { bn: "কিছু না, কিন্তু প্রতি বছর বাড়তি কর", en: "Nothing, but extra tax every year" },
          ],
        },
        {
          label: { bn: "সঙ্গে যা আসে", en: "What comes with it" },
          cells: [
            { bn: "প্রতি বছর রিটার্ন জমা দেওয়ার দায়িত্ব", en: "A duty to file a return each year" },
            { bn: "কোনো দায়িত্ব নেই", en: "No filing duty" },
          ],
          best: 1,
        },
      ],
    },
    "papers-drill": {
      kind: "drill",
      title: { bn: "বিশ মিনিটের কাজ", en: "Twenty minutes of work" },
      steps: [
        { text: { bn: "এনআইডির দুই পাশের ছবি তুলুন", en: "Photograph both sides of your NID" } },
        { text: { bn: "দুই কপি পাসপোর্ট সাইজ ছবি তুলে রাখুন", en: "Get two passport photographs taken" },
          hint: { bn: "ডিজিটাল কপিটাও রাখুন, পরে আবার লাগবে।", en: "Keep the digital copy too: you will need it again." } },
        { text: { bn: "ব্যাংক স্টেটমেন্ট বা একটা বাতিল চেকের ছবি নিন", en: "Get a statement or photograph a cancelled cheque" } },
        { text: { bn: "নমিনি কে হবেন ঠিক করুন আর তার এনআইডির কপি নিন", en: "Decide the nominee and collect a copy of their NID" },
          hint: { bn: "একাধিক নমিনি দিতে চাইলে শতকরা ভাগটাও ঠিক করে নিন।", en: "If you want more than one, decide the percentage split now." } },
        { text: { bn: "টিআইএন না থাকলে এনবিআরের সাইটে আবেদন করুন", en: "If you have no TIN, apply on the NBR site" } },
        { text: { bn: "সব ফাইল একটা ফোল্ডারে রাখুন, নাম দিন documents", en: "Put every file in one folder and name it documents" } },
      ],
    },
    "papers-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "বিও ফর্মে নমিনির ঘরটা খালি রেখে দিলে কী হয়?",
            en: "What happens if the nominee box on the BO form is left blank?",
          },
          options: [
            {
              text: { bn: "কিছুই না, পরে যোগ করা যায়", en: "Nothing: it can be added later" },
              why: {
                bn: "পরে যোগ করা যায় ঠিক, কিন্তু ফাঁকা রাখলে ওই সময়টুকু ঝুঁকি থেকে যায়, আর সবাই পরে করে না। এই মুহূর্তে করাটাই কাজের কথা।",
                en: "It can be added later, and the gap in between is a real risk, and not everybody gets round to it. Doing it now is the point.",
              },
            },
            {
              text: { bn: "আপনি না থাকলে শেয়ারগুলো আটকে যায় আর পরিবারকে আদালতে যেতে হয়", en: "If you are gone the shares freeze and the family goes to court" },
              right: true,
              why: {
                bn: "ঠিক। উত্তরাধিকার সনদের প্রক্রিয়ায় মাস লাগে, টাকা লাগে, আর ঠিক তখনই লাগে যখন পরিবারের হাতে টাকা কম।",
                en: "Right. A succession certificate takes months and money, exactly when the family has least of both.",
              },
            },
            {
              text: { bn: "ব্রোকার নিজে একজন নমিনি ঠিক করে দেয়", en: "The broker names one for you" },
              why: {
                bn: "না, আর কেউ এটা করতে পারে না। এটা আপনার সিদ্ধান্ত, আর কেবল আপনার।",
                en: "No, and nobody can. It is your decision and only yours.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "ব্যাংক অ্যাকাউন্টটা কার নামে হতে হবে?",
            en: "Whose name must the bank account be in?",
          },
          options: [
            {
              text: { bn: "আপনার নিজের নামে", en: "Your own" },
              right: true,
              why: {
                bn: "ঠিক। বিও অ্যাকাউন্ট আর ব্যাংক অ্যাকাউন্ট এক নামে না হলে টাকা আসা-যাওয়ায় সমস্যা হয়, আর নিয়ম মেনেও এটাই দরকার।",
                en: "Right. If the BO and the bank account are in different names the money cannot move cleanly, and the rules require it anyway.",
              },
            },
            {
              text: { bn: "পরিবারের যে কারো নামে চলবে", en: "Anyone in the family will do" },
              why: {
                bn: "না। অন্যের অ্যাকাউন্ট ব্যবহার করলে আপনার শেয়ার আইনত আপনার প্রমাণ করা কঠিন হয়ে যায়, আর বিক্রির টাকা ফেরত পেতেও সমস্যা হয়।",
                en: "No. Using someone else's account makes it hard to prove the shares are yours and awkward to get sale proceeds back.",
              },
            },
            {
              text: { bn: "ব্রোকারের অ্যাকাউন্টেই টাকা রাখা যায়", en: "The money can just sit with the broker" },
              why: {
                bn: "ব্রোকারের কাছে সাময়িকভাবে টাকা থাকতে পারে, কিন্তু আপনার নিজের ব্যাংক অ্যাকাউন্ট লাগবেই, আর বড় অঙ্ক ব্রোকারের কাছে ফেলে রাখা কখনোই ভালো অভ্যাস নয়।",
                en: "A broker can hold cash briefly, you still need your own bank account, and leaving large sums with a broker is never a good habit.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"safest-first": {
  bn: `
<p>এখানে একটা পরামর্শ আছে যা প্রায় কেউ দেয় না, কারণ এটা শুনতে উত্তেজনাহীন: <strong>শেয়ার ছোঁয়ার আগে অন্তত ছয় মাস এমন কিছুতে টাকা রাখুন যা পড়ে না।</strong> ডিপিএস, সঞ্চয়পত্র, বা এফডিআর।</p>

<p>কারণটা রিটার্ন নয়। কারণটা অভ্যাস। এই ছয় মাসে আপনি তিনটা জিনিস শিখবেন যা কোনো লেখা পড়ে শেখা যায় না: প্রতি মাসে একই দিনে টাকা সরিয়ে রাখার অভ্যাস, হিসাবের কাগজ পড়ার অভ্যাস, আর টাকা আটকে থাকলে কেমন লাগে তার অভিজ্ঞতা। এই তিনটা নিয়ে শেয়ারবাজারে ঢুকলে আপনি অন্য মানুষ।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ডিপিএস: মাসে মাসে জমা, ব্যাংকে, নির্দিষ্ট মেয়াদে। অভ্যাস গড়ার জন্য সেরা।</li>
<li>সঞ্চয়পত্র: সরকারের কাছে ধার, সাধারণত সবচেয়ে বেশি হার, তবে সীমা আছে।</li>
<li>এফডিআর: এক দফায় টাকা, নির্দিষ্ট মেয়াদ, নির্দিষ্ট হার।</li>
<li>তিনটাতেই আসল রিটার্ন মূল্যস্ফীতির পরে হিসাব করতে হবে, আর সেটা ছোট।</li>
<li>এগুলো গন্তব্য নয়, প্রশিক্ষণের মাঠ। এখানে থেমে গেলে দীর্ঘমেয়াদে হারবেন।</li>
</ul>
</div>

<h2>তিনটা জিনিস, পাশাপাশি</h2>

${mount("safe-compare")}

<h2>ডিপিএস কেন প্রথম</h2>

<p>ডিপিএস, বা ডিপোজিট পেনশন স্কিম, হলো মাসে মাসে একটা নির্দিষ্ট টাকা ব্যাংকে জমা রাখা, তিন থেকে দশ বছরের জন্য। ব্যাংক প্রতিটার হার আলাদা রাখে আর মেয়াদ শেষে মোট টাকাটা সুদসহ ফেরত দেয়।</p>

<p>এটা প্রথম হওয়ার কারণ রিটার্ন না। কারণ হলো এটা আপনাকে একটা জিনিস শেখায় যা বিনিয়োগের বাকি সবকিছুর ভিত্তি: <strong>মাসের শুরুতে টাকা সরিয়ে রাখা, মাস শেষে যা থাকে তা নয়।</strong> স্বয়ংক্রিয় ডেবিট চালু করে দিলে সিদ্ধান্তটা প্রতি মাসে নতুন করে নিতে হয় না, আর ঠিক এই কারণেই মানুষ ডিপিএস চালিয়ে যেতে পারেন যেখানে "প্রতি মাসে জমাব" ভেবে কেউ পারেন না।</p>

<div class="ex"><b>উদাহরণ:</b> মাসে ৩,০০০ টাকার একটা পাঁচ বছরের ডিপিএস। আপনি জমা দেবেন ১,৮০,০০০ টাকা। মেয়াদ শেষে সুদসহ পাবেন হয়তো ২,১৫,০০০ থেকে ২,২৫,০০০। বড় লাভ নয়। কিন্তু পাঁচ বছর পর আপনার হাতে দুইটা জিনিস থাকবে: টাকাটা, আর ষাটবার নিজের সঙ্গে করা প্রতিশ্রুতি রাখার প্রমাণ।</div>

<h2>সঞ্চয়পত্র: সবচেয়ে বেশি হার, কিছু শর্তসহ</h2>

<p>সঞ্চয়পত্র হলো সরকারের কাছে টাকা ধার দেওয়া। বাংলাদেশে এটাই সবচেয়ে জনপ্রিয় নিরাপদ সঞ্চয়, আর হার সাধারণত ব্যাংকের এফডিআরের চেয়ে বেশি। কয়েকটা ধরন আছে: পরিবার সঞ্চয়পত্র, পেনশনার সঞ্চয়পত্র, তিন মাস অন্তর মুনাফাভিত্তিক, আর পাঁচ বছর মেয়াদি।</p>

<p>দুইটা জিনিস আগে জেনে নেওয়া দরকার। এক, কেনার সীমা আছে, ব্যক্তি ও যৌথ নামে আলাদা, আর সেই সীমা সময়ে সময়ে বদলায়। দুই, মুনাফার ওপর উৎসে কর কাটা হয়, আর মেয়াদের আগে ভাঙলে হার কমে যায়। কেনার আগে চলতি হার আর সীমা জাতীয় সঞ্চয় অধিদপ্তরের সাইট থেকে মিলিয়ে নেবেন, কারণ এই সংখ্যাগুলো বাজেটে বদলায়।</p>

<h2>আসল রিটার্নটা মেপে দেখুন</h2>

<p>এই হিসাবটা এই লেখার সবচেয়ে গুরুত্বপূর্ণ অংশ। ঘোষিত হার, কর, আর মূল্যস্ফীতি, তিনটা বসিয়ে দেখুন হাতে আসলে কত থাকে।</p>

${mount("fdr-lab")}

<p>বেশিরভাগ বছরে সংখ্যাটা শূন্যের আশেপাশে ঘোরে, আর কোনো কোনো বছরে নিচে নামে। এটা এফডিআরকে খারাপ বানায় না, এটা কেবল বলে দেয় এফডিআর কী কাজের জন্য: টাকা ধরে রাখার জন্য, বাড়ানোর জন্য নয়।</p>

<div class="note">এইজন্যই এই লেখার শিরোনাম "সবচেয়ে নিরাপদটা দিয়ে শুরু", "সবচেয়ে নিরাপদটাতেই থাকুন" নয়। বাংলাদেশে বহু পরিবার প্রজন্মের পর প্রজন্ম কেবল সঞ্চয়পত্রে টাকা রেখেছে, আর তাদের সম্পদ বাড়েনি, কেবল ক্ষয় হয়েছে ধীরে। নিরাপদ শোনানো আর নিরাপদ হওয়া এক জিনিস না।</div>

<h2>টাকা কোথায় যাচ্ছে, ছবিতে</h2>

${mount("safe-stack")}

<h2>ছয় মাসে যা শিখবেন</h2>

${mount("safe-drill")}

<h2>নিজে যাচাই করুন</h2>

${mount("safe-quiz")}

<p>অভ্যাস তৈরি হচ্ছে। এবার শেয়ারবাজারের দরজা: <a class="term" href="/money/start/bo-account.html">বিও অ্যাকাউন্ট খুলুন</a>।</p>
`,
  en: `
<p>Here is a piece of advice almost nobody gives, because it is unexciting: <strong>before you touch a share, spend at least six months putting money into something that does not fall.</strong> A DPS, a savings certificate, a fixed deposit.</p>

<p>The reason is not the return. The reason is habit. In those six months you learn three things no article can teach: moving money aside on the same day every month, reading a statement, and what it feels like to have money locked away. Walk into the stock market carrying those three and you are a different investor.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>DPS: a fixed amount monthly into a bank for a set term. Best for building the habit.</li>
<li>Savings certificates: lending to the government, usually the highest rate, with limits.</li>
<li>Fixed deposit: one lump, one term, one rate.</li>
<li>For all three, the real return is the one after inflation, and it is small.</li>
<li>These are a training ground, not a destination. Stopping here loses over a lifetime.</li>
</ul>
</div>

<h2>The three, side by side</h2>

${mount("safe-compare")}

<h2>Why the DPS comes first</h2>

<p>A DPS, a deposit pension scheme, is a fixed monthly amount into a bank for three to ten years. Each bank sets its own rate and pays the total back with interest at the end.</p>

<p>It comes first not for the return but because it teaches the thing everything else rests on: <strong>move money at the start of the month, not whatever is left at the end.</strong> Set up an automatic debit and the decision stops having to be made again every month, which is precisely why people keep a DPS going when "I will save each month" never survives.</p>

<div class="ex"><b>Example:</b> 3,000 taka a month into a five year DPS. You pay in 1,80,000. At the end you get back perhaps 2,15,000 to 2,25,000 with interest. Not a windfall. But after five years you hold two things: the money, and proof that you kept a promise to yourself sixty times.</div>

<h2>Savings certificates: the best rate, with conditions</h2>

<p>A savings certificate is a loan to the government. It is the most popular safe saving in Bangladesh and the rate usually beats a bank deposit. There are several kinds: family, pensioner, quarterly-profit, and the five year certificate.</p>

<p>Two things to know first. There are purchase limits, different for individual and joint holdings, and they change from time to time. And profit has tax withheld, with the rate dropping if you break the term early. Check the current rates and limits on the Directorate of National Savings site before buying, because a budget can move these numbers.</p>

<h2>Measure the real return</h2>

<p>This calculator is the most important part of the lesson. Put in the advertised rate, the tax and inflation, and see what is actually left.</p>

${mount("fdr-lab")}

<p>In most years the number hovers near zero and in some it goes below. That does not make a deposit bad, it tells you what a deposit is for: holding money, not growing it.</p>

<div class="note">That is why this lesson is called "start with the safest thing" and not "stay in the safest thing". Plenty of families in Bangladesh have held nothing but savings certificates for generations, and their wealth did not grow, it slowly eroded. Sounding safe and being safe are different things.</div>

<h2>Where the money goes, drawn</h2>

${mount("safe-stack")}

<h2>What six months teaches</h2>

${mount("safe-drill")}

<h2>Check yourself</h2>

${mount("safe-quiz")}

<p>The habit is forming. Now for the door into the market: <a class="term" href="/money/start/bo-account.html">Open a BO account</a>.</p>
`,
  blocks: {
    "safe-compare": {
      kind: "compare",
      title: { bn: "ডিপিএস, সঞ্চয়পত্র, এফডিআর", en: "DPS, savings certificates, fixed deposits" },
      columns: [
        { bn: "ডিপিএস", en: "DPS" },
        { bn: "সঞ্চয়পত্র", en: "Savings certificate" },
        { bn: "এফডিআর", en: "Fixed deposit" },
      ],
      rows: [
        {
          label: { bn: "টাকা কীভাবে দেন", en: "How you pay in" },
          cells: [
            { bn: "প্রতি মাসে একই অঙ্ক", en: "The same amount monthly" },
            { bn: "একবারে, পুরোটা", en: "One lump, all at once" },
            { bn: "একবারে, পুরোটা", en: "One lump, all at once" },
          ],
        },
        {
          label: { bn: "কার কাছে ধার দিচ্ছেন", en: "Who owes you" },
          cells: [
            { bn: "ব্যাংক", en: "A bank" },
            { bn: "সরকার", en: "The government" },
            { bn: "ব্যাংক", en: "A bank" },
          ],
        },
        {
          label: { bn: "সাধারণত হার", en: "Typical rate" },
          cells: [
            { bn: "মাঝারি", en: "Middling" },
            { bn: "সবচেয়ে বেশি", en: "Highest of the three" },
            { bn: "মাঝারি", en: "Middling" },
          ],
          best: 1,
        },
        {
          label: { bn: "সীমা আছে?", en: "Is there a cap?" },
          cells: [
            { bn: "না", en: "No" },
            { bn: "হ্যাঁ, ব্যক্তি ও যৌথ নামে আলাদা", en: "Yes, different for single and joint" },
            { bn: "না", en: "No" },
          ],
        },
        {
          label: { bn: "অভ্যাস গড়ে?", en: "Does it build the habit?" },
          cells: [
            { bn: "হ্যাঁ, এটাই এর আসল কাজ", en: "Yes, and that is its real job" },
            { bn: "না, একবারের সিদ্ধান্ত", en: "No, a one-off decision" },
            { bn: "না, একবারের সিদ্ধান্ত", en: "No, a one-off decision" },
          ],
          best: 0,
        },
        {
          label: { bn: "মেয়াদের আগে ভাঙলে", en: "Breaking it early" },
          cells: [
            { bn: "হার কমে যায়", en: "The rate falls" },
            { bn: "হার কমে যায়, ধাপে ধাপে", en: "The rate falls, in steps" },
            { bn: "হার কমে যায়", en: "The rate falls" },
          ],
        },
      ],
    },
    "fdr-lab": {
      kind: "lab",
      model: "fdr-real",
      title: { bn: "ঘোষিত হার আর আসল হার", en: "The advertised rate and the real one" },
      note: {
        bn: "তিনটা স্লাইডার নাড়ান আর নিচের সবুজ বা লাল সংখ্যাটা দেখুন।",
        en: "Move the three sliders and watch the number at the bottom.",
      },
      preset: { rate: 8.5, tax: 10, inflation: 9 },
    },
    "safe-stack": {
      kind: "figure",
      shape: "stack",
      title: { bn: "১০০ টাকা সুদের কোথায় যায়", en: "Where 100 taka of interest goes" },
      parts: [
        { text: { bn: "উৎসে কর", en: "Tax at source" }, value: 10, tone: "bad" },
        { text: { bn: "মূল্যস্ফীতি খেয়ে ফেলে", en: "Eaten by inflation" }, value: 84, tone: "warn" },
        { text: { bn: "আপনার হাতে থাকে", en: "Left in your hands" }, value: 6, tone: "good" },
      ],
      caption: {
        bn: "৮.৫% হারে, ১০% কর আর ৯% মূল্যস্ফীতি ধরে। সংখ্যাগুলো বছরে বছরে বদলায়, আর ভাগটা প্রায় একই থাকে।",
        en: "At 8.5%, with 10% tax and 9% inflation. The numbers move year to year; the shape of the split does not.",
      },
    },
    "safe-drill": {
      kind: "drill",
      title: { bn: "ছয় মাসের প্রশিক্ষণ", en: "A six month training" },
      steps: [
        { text: { bn: "একটা ডিপিএস খুলুন, যত ছোট অঙ্ক হোক", en: "Open a DPS, however small the amount" },
          hint: { bn: "৫০০ টাকাও চলে। অঙ্কটা এখানে বিষয় না, নিয়মিততাটা বিষয়।", en: "500 taka is fine. The amount is not the point here, the regularity is." } },
        { text: { bn: "স্বয়ংক্রিয় ডেবিট চালু করুন, বেতনের পরদিনে", en: "Set up an automatic debit for the day after payday" } },
        { text: { bn: "প্রথম স্টেটমেন্টটা এলে পুরোটা পড়ুন", en: "Read the first statement all the way through" },
          hint: { bn: "প্রতিটা লাইন কী বোঝাচ্ছে বোঝার চেষ্টা করুন। এই অভ্যাসটাই পর্যায় ৩-এ কাজে লাগবে।", en: "Work out what every line means. That habit is what stage 3 runs on." } },
        { text: { bn: "চলতি সঞ্চয়পত্রের হার আর সীমা দেখে নিন", en: "Look up the current savings certificate rates and limits" } },
        { text: { bn: "ছয় মাস পরে হিসাব করুন মূল্যস্ফীতির পর কত থাকল", en: "After six months, work out what is left after inflation" },
          hint: { bn: "উপরের হিসাবটাই ব্যবহার করুন। সংখ্যাটা দেখলে পরের ধাপে যাওয়ার কারণ বোঝা যাবে।", en: "Use the calculator above. Seeing the number explains why the next step exists." } },
      ],
    },
    "safe-quiz": {
      kind: "quiz",
      title: { bn: "দুইটা প্রশ্ন", en: "Two questions" },
      questions: [
        {
          ask: {
            bn: "সঞ্চয়পত্রে ১১.৫% হার, উৎসে কর ১০%, মূল্যস্ফীতি ৯.৫%। আপনার ক্রয়ক্ষমতা কী করল?",
            en: "A savings certificate pays 11.5%, 10% tax is withheld and inflation is 9.5%. What happened to your buying power?",
          },
          options: [
            {
              text: { bn: "প্রায় ১১.৫% বাড়ল", en: "It grew about 11.5%" },
              why: {
                bn: "ওটা ঘোষিত হার, হাতে পাওয়া হার নয়। কর কাটার পর থাকে ১০.৩৫%, আর মূল্যস্ফীতির পর প্রায় ০.৮%।",
                en: "That is the advertised rate, not the one you keep. After tax it is 10.35%, and after inflation about 0.8%.",
              },
            },
            {
              text: { bn: "প্রায় ১% বাড়ল", en: "It grew about 1%" },
              right: true,
              why: {
                bn: "ঠিক। বাংলাদেশের সবচেয়ে ভালো নিরাপদ মাধ্যমটাও মূল্যস্ফীতির পর প্রায় শূন্যে দাঁড়ায়। এটা খারাপ খবর না, এটা কেবল বলে দেয় নিরাপদ জিনিসের কাজ কী।",
                en: "Right. Even the best safe instrument in the country lands near zero after inflation. That is not bad news, it just tells you what safe things are for.",
              },
            },
            {
              text: { bn: "কমল", en: "It fell" },
              why: {
                bn: "এই সংখ্যাগুলোতে সামান্য বেড়েছে। কিন্তু মূল্যস্ফীতি এক শতাংশ বাড়লেই নেমে যাবে, আর সেটাই মূল কথা: মার্জিনটা এত পাতলা যে যেকোনো বছর উল্টে যেতে পারে।",
                en: "With these numbers it rose slightly. One more point of inflation and it goes negative, which is the real lesson: the margin is thin enough to flip in any year.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কেন এই লেখাটা শেয়ারের আগে ছয় মাস নিরাপদ মাধ্যমে থাকার কথা বলছে?",
            en: "Why does this lesson ask for six months in safe instruments before shares?",
          },
          options: [
            {
              text: { bn: "কারণ নিরাপদ মাধ্যমে রিটার্ন বেশি", en: "Because safe instruments pay more" },
              why: {
                bn: "না, উল্টো। উপরের হিসাবেই দেখা গেছে আসল রিটার্ন প্রায় শূন্য।",
                en: "No, the opposite. The calculator above showed the real return is near zero.",
              },
            },
            {
              text: { bn: "কারণ তিনটা অভ্যাস তৈরি হয়: নিয়মিত জমা, হিসাব পড়া, আর টাকা আটকে রাখার সহ্যক্ষমতা", en: "Because it builds three habits: paying in regularly, reading a statement, and tolerating locked-up money" },
              right: true,
              why: {
                bn: "ঠিক। এই তিনটা ছাড়া শেয়ারবাজারে ঢুকলে প্রথম পতনেই সব বেচে দেওয়ার সম্ভাবনা অনেক বেশি। অভ্যাসটাই আসল প্রস্তুতি।",
                en: "Right. Enter the market without those three and the odds of selling everything in the first fall are high. The habit is the preparation.",
              },
            },
            {
              text: { bn: "কারণ শেয়ারবাজার খুব বিপজ্জনক আর এড়িয়ে চলা উচিত", en: "Because the market is dangerous and should be avoided" },
              why: {
                bn: "না। এই পাঠশালার পরের পুরোটাই শেয়ারবাজার নিয়ে। কথাটা এড়িয়ে চলার না, প্রস্তুত হয়ে ঢোকার।",
                en: "No. The rest of this school is about the market. The point is not avoidance, it is arriving prepared.",
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
<p>বিও অ্যাকাউন্ট, পুরো নাম বেনিফিশিয়ারি ওনার্স অ্যাকাউন্ট, হলো শেয়ারবাজারের দরজা। আপনার কেনা শেয়ারগুলো কোনো কাগজ হিসেবে আপনার আলমারিতে থাকে না, ইলেকট্রনিকভাবে জমা থাকে এই অ্যাকাউন্টে, ঠিক যেমন টাকা ব্যাংক অ্যাকাউন্টে থাকে।</p>

<p>একটা জিনিস আগে পরিষ্কার করে নেওয়া দরকার, কারণ এটা নিয়ে মানুষ প্রায়ই বিভ্রান্ত হন: <strong>শেয়ার জমা থাকে সিডিবিএলে, ব্রোকারের কাছে নয়।</strong> ব্রোকার কেবল আপনার হয়ে অর্ডার দেয় আর অ্যাকাউন্টটা রক্ষণাবেক্ষণ করে। ব্রোকারেজ হাউস বন্ধ হয়ে গেলেও আপনার শেয়ার হারায় না, আপনি অন্য হাউসে সরিয়ে নিতে পারেন। এই একটা তথ্য জানা থাকলে অনেক দুশ্চিন্তা কমে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বিও অ্যাকাউন্ট খোলা হয় একটা ব্রোকারেজ হাউস বা মার্চেন্ট ব্যাংকের মাধ্যমে।</li>
<li>শেয়ার জমা থাকে সিডিবিএলে, ব্রোকারের কাছে নয়। ব্রোকার বদলানো যায়।</li>
<li>খরচ দুইটা: খোলার সময় একবার, আর বছরে একবার রক্ষণাবেক্ষণ ফি।</li>
<li>এককভাবে বা যৌথভাবে খোলা যায়। যৌথ হলে দুইজনেরই কাগজ লাগবে।</li>
<li>নমিনি ছাড়া ফর্ম জমা দেবেন না।</li>
</ul>
</div>

<h2>কে কোন কাজটা করে</h2>

<p>এই ছবিটা একবার বুঝে নিলে বাকি সবকিছু সহজ হয়ে যায়।</p>

${mount("bo-flow")}

<p>খেয়াল করুন, আপনার আর শেয়ারের মাঝখানে দুইটা প্রতিষ্ঠান: ব্রোকার, যে কেনাবেচার কাজটা করে, আর সিডিবিএল, যে জমা রাখার কাজটা করে। দুইটা আলাদা প্রতিষ্ঠান হওয়াটা একটা সুরক্ষা, দুর্বলতা নয়।</p>

<h2>ব্রোকার বাছাই: এখন কতটা ভাববেন</h2>

<p>প্রথম অ্যাকাউন্টের জন্য নিখুঁত ব্রোকার খোঁজার দরকার নেই, কারণ পরে বদলানো যায়। তবু চারটা জিনিস দেখে নেওয়া ভালো।</p>

<ol class="step-list">
<li><strong>কমিশন কত।</strong> সাধারণত লেনদেনের ০.৩% থেকে ০.৫%, দুই দিকেই। শতাংশে ছোট শোনায়; বছরে বারো বার কেনাবেচা করলে সেটা বছরে ১০% এর কাছাকাছি হয়ে যায়।</li>
<li><strong>অ্যাপটা কেমন।</strong> নিজে অর্ডার দিতে পারবেন, নাকি প্রতিবার ফোন করতে হবে? লাইভ দাম দেখা যায়? এটা দৈনন্দিন অভিজ্ঞতার পুরোটা।</li>
<li><strong>মার্জিন ঋণ কতটা ঠেলে।</strong> কিছু হাউস ঋণ নিতে চাপ দেয়, কারণ ঋণে তাদের আয় বাড়ে। যে হাউস প্রথম দিনেই মার্জিনের কথা তোলে, সেটাই সতর্ক হওয়ার সংকেত।</li>
<li><strong>অফিস কোথায়।</strong> প্রথম বছরে অন্তত একবার যেতে হতেই পারে, তাই কাছাকাছি হলে সুবিধা।</li>
</ol>

<div class="note">সবচেয়ে কম কমিশনওয়ালা হাউস সবসময় সবচেয়ে ভালো নয়। বছরে দুই-তিনবার কেনাবেচা করলে কমিশনের পার্থক্য সামান্য, আর একটা কাজ না করা অ্যাপ বা ফোন না ধরা অফিস অনেক বেশি খরচ করায়। পর্যায় ২-এ এই নিয়ে পুরো একটা লেখা আছে।</div>

<h2>খরচগুলো</h2>

${mount("bo-costs")}

<h2>ফর্মে যা থাকে</h2>

<p>বিও ফর্ম দেখতে ভয়ংকর লাগে, আসলে চারটা অংশ।</p>

${mount("bo-callouts")}

<h2>অ্যাকাউন্ট খোলার পর যা হয়</h2>

<p>ফর্ম জমা দেওয়ার পর সাধারণত দুই থেকে সাত কর্মদিবসে আপনি একটা বিও নম্বর পাবেন, ষোলো সংখ্যার। এই নম্বরটাই আপনার পরিচয় সিডিবিএলের কাছে, আর আইপিওতে আবেদন থেকে শুরু করে শেয়ার হস্তান্তর, সবখানে এটাই লাগবে। নিরাপদ জায়গায় লিখে রাখুন, তবে যেখানে সেখানে শেয়ার করবেন না।</p>

<p>এরপর টাকা পাঠাতে হবে। ব্রোকারেজ হাউস আপনাকে একটা অ্যাকাউন্ট নম্বর দেবে যেখানে টাকা জমা করলে সেটা আপনার নামে দেখাবে। বেশিরভাগ হাউসে এখন অনলাইনে ব্যাংক ট্রান্সফার বা মোবাইল ব্যাংকিং চলে। টাকা পৌঁছাতে কয়েক ঘণ্টা থেকে এক দিন লাগে, আর ওই টাকা জমা হওয়ার আগে কোনো অর্ডার দেওয়া যাবে না।</p>

<p>একটা অভ্যাস প্রথম দিন থেকেই শুরু করুন: <strong>সিডিবিএলের নিজের বিবরণী মাঝে মাঝে মিলিয়ে দেখা।</strong> ব্রোকারের অ্যাপ যা দেখায় আর সিডিবিএলের খাতায় যা আছে, দুইটা মেলা উচিত। বাংলাদেশে যত অনিয়মের ঘটনা ধরা পড়েছে, তার অনেকগুলোই ধরা পড়েছে এইভাবে: বিনিয়োগকারী নিজের হিসাব মিলিয়ে দেখে বুঝেছেন শেয়ার সংখ্যা মিলছে না। বছরে অন্তত দুইবার দেখুন।</p>

<div class="side-note">
<p class="side-note-label">যৌথ না একক</p>
<p>যৌথ অ্যাকাউন্টে দুইজনের নাম থাকে আর দুইজনের সম্মতি ছাড়া লেনদেন করা যায় না, যা কোনো কোনো পরিবারে সুরক্ষা আর কোনো কোনো ক্ষেত্রে ঝামেলা। আইপিওর ক্ষেত্রে সীমা আর বরাদ্দের নিয়ম দুইটার জন্য আলাদা হতে পারে। সন্দেহ থাকলে এককভাবে শুরু করুন: একজনের নামের অ্যাকাউন্ট পরে যৌথ করা সহজ, উল্টোটা কঠিন।</p>
</div>

<h2>ক্রমটা সাজান</h2>

${mount("bo-order")}

<h2>করে ফেলুন</h2>

${mount("bo-drill")}

<h2>নিজে যাচাই করুন</h2>

${mount("bo-quiz")}

<p>অ্যাকাউন্ট খোলা হলো। এবার সবচেয়ে বড় প্রশ্ন, আর এখানে বেশিরভাগ মানুষ ভুল করেন: <a class="term" href="/money/start/first-buy.html">প্রথম কেনাকাটা</a>।</p>
`,
  en: `
<p>A BO account, in full a Beneficiary Owner's account, is the door into the market. The shares you buy do not sit in a drawer as certificates; they sit electronically in this account, the way money sits in a bank account.</p>

<p>One thing to be clear about, because it confuses people constantly: <strong>your shares are held at CDBL, not by your broker.</strong> The broker places orders for you and maintains the account. If a brokerage closes down your shares do not vanish; you move them to another house. Knowing that alone removes a lot of worry.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A BO account is opened through a brokerage house or a merchant bank.</li>
<li>The shares are held at CDBL, not at the broker. Brokers can be changed.</li>
<li>Two costs: one at opening, and an annual maintenance fee.</li>
<li>It can be single or joint. A joint account needs both sets of papers.</li>
<li>Do not submit the form without a nominee.</li>
</ul>
</div>

<h2>Who does what</h2>

<p>Understand this picture once and everything else gets easier.</p>

${mount("bo-flow")}

<p>Notice that two institutions sit between you and the share: the broker, who does the buying and selling, and CDBL, who does the holding. Those being separate organisations is a protection, not a weakness.</p>

<h2>Choosing a broker: how much to agonise now</h2>

<p>You do not need the perfect broker for a first account, because you can move later. Four things are still worth checking.</p>

<ol class="step-list">
<li><strong>The commission.</strong> Usually 0.3% to 0.5% of the trade, each way. It sounds small as a percentage; trade twelve times a year and it becomes close to 10% a year.</li>
<li><strong>The app.</strong> Can you place your own orders or must you telephone every time? Are live prices there? This is the whole of your day to day experience.</li>
<li><strong>How hard they push margin.</strong> Some houses push loans because loans are how they earn. A house that raises margin on day one is itself the warning.</li>
<li><strong>Where the office is.</strong> You will probably have to go there at least once in the first year, so nearby helps.</li>
</ol>

<div class="note">The cheapest house is not automatically the best. If you trade two or three times a year the commission difference is small, while an app that does not work or an office that does not answer costs far more. There is a whole lesson on this in stage 2.</div>

<h2>The costs</h2>

${mount("bo-costs")}

<h2>What is on the form</h2>

<p>The BO form looks alarming and is really four parts.</p>

${mount("bo-callouts")}

<h2>What happens after it opens</h2>

<p>Two to seven working days after the form goes in you receive a BO number, sixteen digits. That number is your identity at CDBL and it is what an IPO application, a share transfer and everything else will ask for. Write it somewhere safe, and do not scatter it about.</p>

<p>Then money has to go in. The house gives you an account number to pay into, and the deposit shows up against your name. Most houses now accept a bank transfer or mobile banking. It takes a few hours to a day to land, and no order can be placed until it does.</p>

<p>Start one habit on day one: <strong>reconcile against CDBL's own statement now and then.</strong> What the broker's app shows and what CDBL's books say should match. A good number of the irregularities ever caught in this market were caught exactly this way, by an investor checking their own holdings and finding the share count did not agree. Twice a year is enough.</p>

<div class="side-note">
<p class="side-note-label">Joint or single</p>
<p>A joint account carries two names and nothing moves without both consents, which is protection in some families and friction in others. IPO limits and allotment rules can differ between the two. If in doubt, start single: turning a single account joint later is easy and the reverse is not.</p>
</div>

<h2>Put it in order</h2>

${mount("bo-order")}

<h2>Go and do it</h2>

${mount("bo-drill")}

<h2>Check yourself</h2>

${mount("bo-quiz")}

<p>The account is open. Now the biggest question, and the one most people get wrong: <a class="term" href="/money/start/first-buy.html">Your first purchase</a>.</p>
`,
  blocks: {
    "bo-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "একটা অর্ডার কোথা দিয়ে যায়", en: "The path an order takes" },
      parts: [
        { text: { bn: "আপনি", en: "You" }, note: { bn: "অ্যাপে বা ফোনে অর্ডার দেন", en: "Place an order in the app or by phone" }, tone: "lead" },
        { text: { bn: "ব্রোকারেজ হাউস", en: "The brokerage house" }, note: { bn: "লাইসেন্সধারী, অর্ডারটা বাজারে পাঠায়", en: "Licensed, sends the order to the market" } },
        { text: { bn: "ঢাকা স্টক এক্সচেঞ্জ", en: "Dhaka Stock Exchange" }, note: { bn: "ক্রেতা আর বিক্রেতার অর্ডার মিলিয়ে দেয়", en: "Matches buyers against sellers" } },
        { text: { bn: "সিডিবিএল", en: "CDBL" }, note: { bn: "শেয়ারটা আপনার বিও অ্যাকাউন্টে জমা করে", en: "Books the share into your BO account" }, tone: "good" },
      ],
      caption: {
        bn: "শেয়ার থাকে শেষ ঘরে, দ্বিতীয় ঘরে নয়। ব্রোকার বদলালেও শেষ ঘরটা একই থাকে।",
        en: "The share lives in the last box, not the second. Change brokers and the last box does not move.",
      },
    },
    "bo-costs": {
      kind: "figure",
      shape: "stack",
      title: { bn: "প্রথম বছরে কোথায় কত", en: "What the first year costs" },
      parts: [
        { text: { bn: "অ্যাকাউন্ট খোলার ফি", en: "Account opening fee" }, note: { bn: "একবার, সাধারণত ৪০০ থেকে ৮০০ টাকা", en: "Once, usually 400 to 800 taka" }, value: 600, tone: "plain" },
        { text: { bn: "বার্ষিক রক্ষণাবেক্ষণ ফি", en: "Annual maintenance" }, note: { bn: "প্রতি বছর, সাধারণত ৪৫০ টাকা", en: "Every year, usually about 450 taka" }, value: 450, tone: "warn" },
        { text: { bn: "প্রতিটা কেনাবেচায় কমিশন", en: "Commission on each trade" }, note: { bn: "লেনদেনের ০.৩% থেকে ০.৫%, দুই দিকেই", en: "0.3% to 0.5% of the trade, each way" }, value: 1200, tone: "bad" },
      ],
      caption: {
        bn: "স্থির ফি দুইটা ছোট। বড় খরচটা কমিশন, আর ওটা আপনি কত ঘন ঘন কেনাবেচা করেন তার ওপর নির্ভর করে। এটাই একমাত্র খরচ যা আপনার নিয়ন্ত্রণে।",
        en: "The two fixed fees are small. The big cost is commission, and it depends entirely on how often you trade. It is the one cost you control.",
      },
    },
    "bo-callouts": {
      kind: "figure",
      shape: "callouts",
      title: { bn: "বিও ফর্মের চারটা অংশ", en: "The four parts of a BO form" },
      screen: {
        title: { bn: "বিও অ্যাকাউন্ট খোলার ফর্ম", en: "BO account opening form" },
        rows: [
          { label: { bn: "অ্যাকাউন্টের ধরন", en: "Account type" }, value: { bn: "একক / যৌথ", en: "Single / joint" } },
          { label: { bn: "নিজের তথ্য", en: "Your details" }, value: { bn: "নাম, এনআইডি, ঠিকানা", en: "Name, NID, address" } },
          { label: { bn: "ব্যাংক অ্যাকাউন্ট", en: "Bank account" }, value: { bn: "নিজের নামে, শাখাসহ", en: "In your name, with branch" } },
          { label: { bn: "নমিনি", en: "Nominee" }, value: { bn: "নাম, এনআইডি, শতকরা ভাগ", en: "Name, NID, percentage" } },
          { label: { bn: "লিংক অ্যাকাউন্ট", en: "Linked account" }, value: { bn: "মার্জিন চাইলে, নাহলে খালি", en: "Only if you want margin" } },
          { label: { bn: "স্বাক্ষর", en: "Signature" }, value: { bn: "ব্যাংকের স্বাক্ষরের সঙ্গে মিলতে হবে", en: "Must match the bank's" } },
        ],
      },
      parts: [
        {
          at: 0,
          text: { bn: "একক না যৌথ, এখানেই ঠিক হয়", en: "Single or joint is decided here" },
          note: { bn: "যৌথ হলে দুইজনেরই সব কাগজ লাগবে, আর পরে বদলানো ঝামেলা।", en: "A joint account needs both sets of papers, and changing it later is a chore." },
        },
        {
          at: 2,
          text: { bn: "ব্যাংক অ্যাকাউন্টটা আপনার নিজের নামে", en: "The bank account must be your own" },
          note: { bn: "অন্য কারো নাম দিলে বিক্রির টাকা ফেরত পেতে সমস্যা হবে।", en: "Somebody else's name makes getting sale proceeds back a problem." },
        },
        {
          at: 3,
          text: { bn: "নমিনির ঘরটা খালি রাখবেন না", en: "Do not leave the nominee blank" },
          tone: "bad",
          note: { bn: "খালি রাখলে আপনি না থাকলে শেয়ার আটকে যায় আর পরিবারকে আদালতে যেতে হয়।", en: "Blank means the shares freeze and the family goes to court." },
        },
        {
          at: 4,
          text: { bn: "লিংক অ্যাকাউন্ট মানে মার্জিন ঋণ", en: "A linked account means a margin loan" },
          tone: "warn",
          note: { bn: "প্রথম অ্যাকাউন্টে এটা খালি রাখুন। ঋণ নিয়ে শেয়ার কেনা নতুনদের জন্য নয়।", en: "Leave it blank on a first account. Borrowing to buy shares is not for beginners." },
        },
      ],
    },
    "bo-order": {
      kind: "order",
      title: { bn: "খোলার ক্রম", en: "The order of opening" },
      items: [
        { text: { bn: "নিজের নামে একটা ব্যাংক অ্যাকাউন্ট থাকা", en: "Have a bank account in your own name" },
          why: { bn: "বিও ফর্মেই এই তথ্য লাগে, তাই এটা আগে।", en: "The BO form asks for it, so it comes first." } },
        { text: { bn: "দুই তিনটা ব্রোকারেজ হাউসের কমিশন আর অ্যাপ দেখা", en: "Compare two or three houses on commission and app" } },
        { text: { bn: "কাগজপত্র নিয়ে অফিসে গিয়ে ফর্ম পূরণ", en: "Take the papers in and fill the form" },
          why: { bn: "কিছু হাউস এখন অনলাইনেও নেয়, তবে প্রথমবার সশরীরে গেলে প্রশ্ন করা যায়।", en: "Some houses now do this online; going in person the first time lets you ask questions." } },
        { text: { bn: "বিও নম্বর পাওয়া", en: "Receive the BO number" },
          why: { bn: "সাধারণত দুই থেকে সাত কর্মদিবস।", en: "Usually two to seven working days." } },
        { text: { bn: "ব্যাংক থেকে বিও অ্যাকাউন্টে টাকা পাঠানো", en: "Move money from the bank into the account" } },
        { text: { bn: "প্রথম অর্ডার দেওয়া", en: "Place the first order" },
          why: { bn: "আর প্রথম অর্ডারটা কী হওয়া উচিত, সেটা পরের লেখার বিষয়।", en: "What that first order should be is the next lesson." } },
      ],
    },
    "bo-drill": {
      kind: "drill",
      title: { bn: "অ্যাকাউন্ট খোলার কাজ", en: "Opening the account" },
      steps: [
        { text: { bn: "তিনটা ব্রোকারেজ হাউসের কমিশনের হার লিখে রাখুন", en: "Write down the commission at three houses" },
          hint: { bn: "ফোন করে জিজ্ঞেস করুন। ওয়েবসাইটে সবসময় থাকে না।", en: "Phone and ask. It is not always on the website." } },
        { text: { bn: "একটার অ্যাপ ডাউনলোড করে দেখুন কেমন", en: "Download one of their apps and look at it" } },
        { text: { bn: "ফর্মে নমিনির ঘরটা পূরণ করুন", en: "Fill in the nominee box on the form" } },
        { text: { bn: "লিংক অ্যাকাউন্টের ঘরটা খালি রাখুন", en: "Leave the linked account box blank" },
          hint: { bn: "কেউ জোর করলে জিজ্ঞেস করুন এতে তাদের কী লাভ। উত্তরটা শুনলেই বুঝবেন।", en: "If someone insists, ask what they gain from it. The answer tells you everything." } },
        { text: { bn: "বিও নম্বরটা পেলে নিরাপদ জায়গায় লিখে রাখুন", en: "When the BO number arrives, write it somewhere safe" } },
      ],
    },
    "bo-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "আপনার ব্রোকারেজ হাউসটা ব্যবসা বন্ধ করে দিল। আপনার শেয়ারের কী হবে?",
            en: "Your brokerage house shuts down. What happens to your shares?",
          },
          options: [
            {
              text: { bn: "শেয়ারগুলো হারিয়ে যাবে", en: "The shares are lost" },
              why: {
                bn: "না। শেয়ার ব্রোকারের কাছে থাকে না, সিডিবিএলে থাকে। ব্রোকার কেবল একজন মধ্যস্থতাকারী।",
                en: "No. The shares are not held by the broker, they are held at CDBL. The broker is only an intermediary.",
              },
            },
            {
              text: { bn: "শেয়ারগুলো সিডিবিএলেই থাকবে, অন্য হাউসে সরিয়ে নেওয়া যাবে", en: "They stay at CDBL and can be moved to another house" },
              right: true,
              why: {
                bn: "ঠিক। এইজন্যই কেনাবেচা আর জমা রাখা দুইটা আলাদা প্রতিষ্ঠানের কাজ। প্রক্রিয়াটায় সময় লাগতে পারে, কিন্তু শেয়ার আপনারই থাকে।",
                en: "Right. That is exactly why trading and custody are two different institutions. The process can take time; the shares stay yours.",
              },
            },
            {
              text: { bn: "ডিএসই আপনাকে নগদ টাকা দিয়ে দেবে", en: "DSE pays you out in cash" },
              why: {
                bn: "না, আর কেউ আপনার শেয়ার বেচে দেবে না। শেয়ার শেয়ারই থাকে, কেবল দেখাশোনার ঠিকানা বদলায়।",
                en: "No, and nobody sells your shares for you. The shares stay shares; only the address that services them changes.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "ব্রোকার বলছেন লিংক অ্যাকাউন্ট খুলে নিলে আপনি দ্বিগুণ শেয়ার কিনতে পারবেন। কী করবেন?",
            en: "The broker says a linked account lets you buy twice as many shares. What do you do?",
          },
          options: [
            {
              text: { bn: "খুলে নেব, দ্বিগুণ কেনা মানে দ্বিগুণ লাভ", en: "Open it: twice the shares means twice the gain" },
              why: {
                bn: "দ্বিগুণ লস-ও। মার্জিন ঋণে দাম পড়লে ব্রোকার আপনার অনুমতি ছাড়াই বেচে দিতে পারে, আর ঠিক সবচেয়ে খারাপ দামে। পর্যায় ১-এ এর আলাদা লেখা আছে।",
                en: "And twice the loss. With margin, a fall lets the broker sell without asking you, at the worst price. There is a lesson on this in stage 1.",
              },
            },
            {
              text: { bn: "খালি রাখব, আর কেন ঠেলছেন সেটা জিজ্ঞেস করব", en: "Leave it blank, and ask why they are pushing it" },
              right: true,
              why: {
                bn: "ঠিক। মার্জিন ঋণে হাউসের সুদ আয় হয়, তাই ঠেলার একটা স্বার্থ আছে। প্রথম অ্যাকাউন্টে এটা লাগে না, আর দরকার হলে পরেও খোলা যায়।",
                en: "Right. The house earns interest on margin, so there is an interest in pushing it. A first account does not need it, and it can be added later if it is ever wanted.",
              },
            },
            {
              text: { bn: "খুলে নেব কিন্তু ব্যবহার করব না", en: "Open it but never use it" },
              why: {
                bn: "খারাপ না, তবে অপ্রয়োজনীয়। খোলা থাকলে একদিন উত্তেজনার মুহূর্তে ব্যবহার হওয়ার সম্ভাবনা থেকে যায়, আর ওই মুহূর্তটাই সবচেয়ে খারাপ সময়।",
                en: "Not terrible, and unnecessary. If it is open it can get used one excitable afternoon, and that afternoon is the worst possible time.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কমিশন ০.৪%, আর আপনি বছরে ১৫ বার কিনে ১৫ বার বেচেন। কমিশনে বছরে কত যায়?",
            en: "Commission is 0.4% and you buy 15 times and sell 15 times a year. What does commission cost annually?",
          },
          options: [
            {
              text: { bn: "প্রায় ০.৪%", en: "About 0.4%" },
              why: {
                bn: "না। ০.৪% প্রতিটা লেনদেনে, আর আপনি ৩০টা লেনদেন করছেন। মোট প্রায় ১২%।",
                en: "No. That is 0.4% per trade, and there are 30 trades. The total is about 12%.",
              },
            },
            {
              text: { bn: "প্রায় ৬%", en: "About 6%" },
              why: {
                bn: "কাছাকাছি, কিন্তু আপনি কেবল কেনাগুলো গুনেছেন। বেচার সময়ও কমিশন লাগে, তাই সংখ্যাটা দ্বিগুণ।",
                en: "Close, but you counted only the buys. Selling costs too, so the number doubles.",
              },
            },
            {
              text: { bn: "প্রায় ১২%", en: "About 12%" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই বেশিরভাগ ছোট বিনিয়োগকারীর সবচেয়ে বড় লুকানো খরচ। বাজার থেকে বছরে ১২% পাওয়া কঠিন; ১২% কমিশনে দিয়ে দেওয়া সহজ। পর্যায় ২-এ এই নিয়ে আলাদা লেখা আছে।",
                en: "Right, and it is the biggest hidden cost for most small investors. Earning 12% a year from the market is hard; handing 12% to commission is easy. Stage 2 has a lesson on it.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"first-buy": {
  bn: `
<p>এই ধাপে বেশিরভাগ মানুষ একটা নির্দিষ্ট ভুল করেন, আর ভুলটা এত সাধারণ যে এর একটা প্যাটার্ন আছে। বিও অ্যাকাউন্ট খোলার পর তারা কারো কাছে জিজ্ঞেস করেন "কোন শেয়ারটা ভালো", একটা নাম পান, সেই একটা শেয়ারে পুরো টাকা দিয়ে দেন, আর তিন মাস পর হিসাব খুলে দেখেন ৩০% নেই।</p>

<p>সমস্যাটা শেয়ারটা খারাপ ছিল তা না। সমস্যাটা হলো একটামাত্র শেয়ারে পুরো টাকা দেওয়া। একটা কোম্পানি যত ভালোই হোক, তার কারখানায় আগুন লাগতে পারে, তার এমডি চলে যেতে পারেন, তার একমাত্র বড় ক্রেতা অর্ডার বন্ধ করে দিতে পারে। এসব কোনোটাই আপনি আগে থেকে জানতে পারবেন না, আর জানার কথাও না।</p>

<p>তাই এই লেখার পরামর্শটা পরিষ্কার: <strong>প্রথম কেনাকাটা একক শেয়ার নয়, একটা মিউচুয়াল ফান্ড।</strong></p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>প্রথমে ফান্ড, কারণ একটা ফান্ড মানে একসঙ্গে ২৫ থেকে ৪০টা কোম্পানি।</li>
<li>একবারে সব টাকা নয়। ছয় থেকে বারো মাসে ভাগ করে ঢোকান।</li>
<li>অর্ডার দেওয়ার সময় লিমিট অর্ডার, মার্কেট অর্ডার নয়।</li>
<li>প্রথম কেনাটা ছোট রাখুন, শেখার খরচ হিসেবে ধরুন।</li>
<li>কেনার আগে লিখে রাখুন কেন কিনছেন। এই এক বাক্য পরে অনেক কাজে দেবে।</li>
</ul>
</div>

<h2>কেন ফান্ড আগে</h2>

${mount("fund-venn")}

<p>মিউচুয়াল ফান্ড হলো অনেক মানুষের টাকা এক করে একজন পেশাদার ম্যানেজারের হাতে দেওয়া, যিনি সেটা অনেকগুলো কোম্পানিতে ছড়িয়ে দেন। বাংলাদেশে ডিএসইতে তালিকাভুক্ত ক্লোজড-এন্ড ফান্ড আছে, আবার অ্যাসেট ম্যানেজমেন্ট কোম্পানির কাছ থেকে সরাসরি কেনা যায় এমন ওপেন-এন্ড ফান্ডও আছে।</p>

<p>ফান্ড নিখুঁত না। খরচ আছে, আর বাংলাদেশে অনেক ফান্ডের কর্মক্ষমতা সূচকের চেয়েও খারাপ হয়েছে। কিন্তু নতুন বিনিয়োগকারীর জন্য প্রশ্নটা "সবচেয়ে ভালো কী" না, প্রশ্নটা "সবচেয়ে খারাপ যা হতে পারে সেটা কত খারাপ"। একটা ফান্ডে সবচেয়ে খারাপ যা হয় তা একটা একক শেয়ারে সবচেয়ে খারাপ যা হয় তার চেয়ে অনেক কম খারাপ।</p>

<div class="ex"><b>উদাহরণ:</b> ধরুন আপনার এক লাখ টাকা আছে। যদি একটা কোম্পানিতে পুরোটা দেন আর সেটা Z ক্যাটাগরিতে নেমে যায়, আপনার হয়তো ৭০ হাজার টাকা চলে গেল। যদি একটা ফান্ডে দেন যেখানে ৩০টা কোম্পানি আছে, ওই একই কোম্পানিটা ফান্ডের ৩% হলে আপনার ক্ষতি ২,১০০ টাকা। একই ঘটনা, তেত্রিশ গুণ কম ক্ষতি।</div>

<h2>একবারে না, ভাগ করে</h2>

<p>দ্বিতীয় ভুলটা হলো একদিনে পুরো টাকা ঢুকিয়ে দেওয়া। এতে আপনার পুরো ফলাফল একটা তারিখের ওপর নির্ভর করে, আর কোন তারিখটা ভালো তা কেউ আগে জানে না।</p>

<p>এর সমাধান খুব সহজ আর একেবারেই চালাকি নয়: প্রতি মাসে একই টাকা। দাম বেশি থাকলে কম ইউনিট আসে, দাম কম থাকলে বেশি ইউনিট আসে, তাই গড় দামটা নিজে থেকেই নিচে নামে। নিচে নিজে নাড়িয়ে দেখুন।</p>

${mount("dca-lab")}

<p>খেয়াল করুন, আপনার গড় দাম দামগুলোর নিজের গড়ের চেয়ে কম। এটা কোনো কৌশল না, ভাগের অঙ্ক: একই টাকায় সস্তার সময় বেশি ইউনিট আসে বলেই গড়টা নেমে যায়।</p>

<h2>অর্ডারটা আসলে কীভাবে দেয়</h2>

<p>অ্যাপে অর্ডার দেওয়ার সময় দুইটা বাছাই থাকে, আর নতুনদের জন্য একটাই ঠিক উত্তর।</p>

<div class="table-scroll">
<table>
<thead>
<tr><th></th><th>মার্কেট অর্ডার</th><th>লিমিট অর্ডার</th></tr>
</thead>
<tbody>
<tr><td>আপনি বলছেন</td><td>যে দামেই হোক, কিনে দাও</td><td>এই দামে বা তার কমে কিনো</td></tr>
<tr><td>কখন হয়</td><td>প্রায় সঙ্গে সঙ্গে</td><td>দাম ওখানে পৌঁছালে</td></tr>
<tr><td>ঝুঁকি</td><td>যা ভেবেছিলেন তার চেয়ে অনেক বেশি দামে হয়ে যেতে পারে</td><td>নাও হতে পারে</td></tr>
<tr><td>নতুনদের জন্য</td><td>না</td><td>হ্যাঁ</td></tr>
</tbody>
</table>
</div>

<p>পাতলা বাজারে, মানে যেখানে খুব বেশি কেনাবেচা হয় না, মার্কেট অর্ডার সত্যিই বিপজ্জনক: আপনি ভাবছেন ৪৫ টাকায় কিনছেন আর হয়ে গেল ৪৯ টাকায়, কারণ ৪৫ টাকায় মাত্র দশটা শেয়ার ছিল। লিমিট অর্ডারে এটা হয় না।</p>

<h2>প্রথম অর্ডারের পুরো পথ</h2>

${mount("buy-flow")}

<h2>কেনার আগে যেটা লিখবেন</h2>

${mount("thesis-reveal")}

<h2>করে ফেলুন</h2>

${mount("first-buy-drill")}

<h2>নিজে যাচাই করুন</h2>

${mount("first-buy-quiz")}

<p>কেনা হলো। এবার সবচেয়ে কঠিন অংশ, আর সেটা কেনার চেয়ে কঠিন: <a class="term" href="/money/start/make-a-rule.html">নিয়ম বানান, তারপর ধৈর্য</a>।</p>
`,
  en: `
<p>Most people make one specific mistake at this step, and it is common enough to have a shape. The BO account opens, they ask somebody which share is good, they get a name, they put the whole amount into that one share, and three months later the account is 30% down.</p>

<p>The problem is not that the share was bad. The problem is putting everything into one share. However good a company is, its factory can burn, its managing director can leave, its one large customer can stop ordering. You cannot know any of that in advance, and you are not supposed to.</p>

<p>So this lesson's advice is blunt: <strong>your first purchase is not a share, it is a mutual fund.</strong></p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A fund first, because one fund is 25 to 40 companies at once.</li>
<li>Not all the money on one day. Spread it over six to twelve months.</li>
<li>Place a limit order, never a market order.</li>
<li>Keep the first purchase small and treat it as the price of learning.</li>
<li>Write down why you are buying before you buy. That one sentence earns its keep later.</li>
</ul>
</div>

<h2>Why a fund comes first</h2>

${mount("fund-venn")}

<p>A mutual fund pools many people's money under a professional manager who spreads it across many companies. Bangladesh has closed-end funds listed on the DSE and open-end funds you buy directly from an asset management company.</p>

<p>Funds are not perfect. They have costs, and plenty of funds here have done worse than the index. But for a new investor the question is not "what is best", it is "how bad is the worst case". The worst case in a fund is far milder than the worst case in a single share.</p>

<div class="ex"><b>Example:</b> Say you have a lakh. Put all of it into one company and that company drops into Z category and you may be down seventy thousand. Put it into a fund holding thirty companies, where that same company is 3% of the fund, and you are down 2,100. Same event, a thirty-third of the damage.</div>

<h2>Not in one go</h2>

<p>The second mistake is putting the whole amount in on a single day. That makes your entire result depend on one date, and nobody knows in advance which dates are the good ones.</p>

<p>The fix is simple and not remotely clever: the same amount every month. When the price is high the money buys fewer units and when it is low it buys more, so the average comes down on its own. Move the sliders below.</p>

${mount("dca-lab")}

<p>Notice your average is below the simple average of the prices. That is not a technique, it is division: a fixed sum buys more units when things are cheap, so the average falls.</p>

<h2>How the order is actually placed</h2>

<p>The app offers two choices when you order, and for a beginner only one of them is right.</p>

<div class="table-scroll">
<table>
<thead>
<tr><th></th><th>Market order</th><th>Limit order</th></tr>
</thead>
<tbody>
<tr><td>What you are saying</td><td>Buy it at whatever the price is</td><td>Buy at this price or better</td></tr>
<tr><td>When it fills</td><td>Almost immediately</td><td>When the price gets there</td></tr>
<tr><td>The risk</td><td>Filling far above what you expected</td><td>Not filling at all</td></tr>
<tr><td>For a beginner</td><td>No</td><td>Yes</td></tr>
</tbody>
</table>
</div>

<p>In a thin market, where little trades, a market order is genuinely dangerous: you think you are buying at 45 and it fills at 49, because there were only ten shares at 45. A limit order cannot do that to you.</p>

<h2>The whole path of a first order</h2>

${mount("buy-flow")}

<h2>What to write before you buy</h2>

${mount("thesis-reveal")}

<h2>Go and do it</h2>

${mount("first-buy-drill")}

<h2>Check yourself</h2>

${mount("first-buy-quiz")}

<p>Bought. Now the hard part, harder than the buying: <a class="term" href="/money/start/make-a-rule.html">Make a rule, then wait</a>.</p>
`,
  blocks: {
    "fund-venn": {
      kind: "figure",
      shape: "venn",
      title: { bn: "একটা শেয়ার আর একটা ফান্ড", en: "One share and one fund" },
      parts: [
        {
          text: { bn: "একটা শেয়ার কিনলে", en: "Buying one share" },
          note: { bn: "একটা কোম্পানির ভাগ্য আপনার পুরো ফলাফল ঠিক করে", en: "One company's luck decides your entire result" },
          tone: "bad",
        },
        {
          text: { bn: "দুইটাতেই যা সত্যি", en: "True of both" },
          note: { bn: "বাজার পড়লে দুইটাই পড়ে, আর দুইটাতেই দীর্ঘমেয়াদ লাগে", en: "Both fall when the market falls, and both need a long horizon" },
          tone: "plain",
        },
        {
          text: { bn: "একটা ফান্ড কিনলে", en: "Buying one fund" },
          note: { bn: "৩০টা কোম্পানি, তাই একটার দুর্ঘটনা আপনার ৩ শতাংশ", en: "Thirty companies, so one disaster is 3% of you" },
          tone: "good",
        },
      ],
      caption: {
        bn: "ফান্ড বাজারের ঝুঁকি সরায় না, একটা কোম্পানির ঝুঁকি সরায়। নতুন বিনিয়োগকারীর জন্য দ্বিতীয়টাই বেশি বিপজ্জনক।",
        en: "A fund does not remove market risk, it removes single-company risk. For a beginner the second is the more dangerous one.",
      },
    },
    "dca-lab": {
      kind: "lab",
      model: "dca",
      title: { bn: "প্রতি মাসে একই টাকা", en: "The same amount every month" },
      note: {
        bn: "ওঠানামা বাড়িয়ে দেখুন। গড় দামটা দামগুলোর গড়ের চেয়ে কতটা নিচে থাকে লক্ষ করুন।",
        en: "Raise the swing and watch how far your average sits below the simple average.",
      },
      preset: { monthly: 5000, start: 100, swing: 30, months: 24 },
    },
    "buy-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "টাকা থেকে শেয়ার", en: "From money to a share" },
      parts: [
        { text: { bn: "ব্যাংক থেকে বিও অ্যাকাউন্টে টাকা", en: "Money into the BO account" }, note: { bn: "কয়েক ঘণ্টা থেকে এক দিন", en: "A few hours to a day" } },
        { text: { bn: "লিমিট অর্ডার দেওয়া", en: "Place a limit order" }, note: { bn: "কোড, সংখ্যা, আর সর্বোচ্চ দাম", en: "The code, the quantity, and your top price" }, tone: "lead" },
        { text: { bn: "অর্ডার মিলে যাওয়া", en: "The order fills" }, note: { bn: "কেউ ওই দামে বেচতে রাজি হলে", en: "When somebody sells at that price" } },
        { text: { bn: "টি প্লাস টু নিষ্পত্তি", en: "Settlement, T plus two" }, note: { bn: "দুই কর্মদিবস পরে শেয়ার আপনার অ্যাকাউন্টে", en: "Two working days later the share is in your account" }, tone: "good" },
      ],
      caption: {
        bn: "কেনার দিন আর শেয়ার হাতে পাওয়ার দিন এক নয়। এইজন্যই কিনেই বেচে দেওয়া যায় না।",
        en: "The day you buy and the day you hold it are not the same day. That is why you cannot buy and instantly sell.",
      },
    },
    "thesis-reveal": {
      kind: "reveal",
      title: { bn: "এক বাক্যে", en: "In one sentence" },
      ask: {
        bn: "কেনার আগে একটা কাগজে কী লিখে রাখা উচিত?",
        en: "What should you write down before you buy?",
      },
      choices: [
        { bn: "কত দামে কিনছি", en: "The price I paid" },
        { bn: "কেন কিনছি, আর কী হলে আমি ভুল প্রমাণিত হব", en: "Why I am buying, and what would prove me wrong" },
        { bn: "কবে বেচব", en: "When I will sell" },
      ],
      answer: {
        bn: "কেন কিনছি, আর কী হলে ভুল প্রমাণিত হব। দুইটা একসঙ্গে, আলাদা নয়।",
        en: "Why you are buying and what would prove you wrong. Both, together.",
      },
      why: {
        bn: "দাম অ্যাপেই লেখা থাকে, ওটা লিখে রাখার দরকার নেই। কবে বেচবেন সেটা আগে থেকে জানা সম্ভব না। কিন্তু কারণটা লিখে রাখলে দুইটা জিনিস হয়। এক, ছয় মাস পর দাম পড়লে আপনি পড়ে দেখতে পারবেন কারণটা এখনো সত্য কি না; সত্য হলে অপেক্ষা করবেন, মিথ্যা হলে বেরিয়ে আসবেন। দুই, কারণটা লিখতে গিয়ে অর্ধেক সময় আপনি নিজেই বুঝবেন কারণটা আসলে দুর্বল, আর তখন কেনাই হবে না। ওই না-কেনাগুলোই আপনার সবচেয়ে লাভজনক সিদ্ধান্ত হতে পারে। পর্যায় ৩-এ এই নিয়ে পুরো একটা লেখা আছে।",
        en: "The price is in the app already; there is no need to record it. When you will sell cannot be known in advance. But writing the reason does two things. First, six months later when the price is down you can read it and ask whether the reason still holds: if it does, wait; if it does not, leave. Second, about half the time the act of writing it shows you the reason is thin, and then you do not buy at all. Those non-purchases may be your most profitable decisions. Stage 3 has a whole lesson on this.",
      },
    },
    "first-buy-drill": {
      kind: "drill",
      title: { bn: "প্রথম কেনাকাটা", en: "The first purchase" },
      steps: [
        { text: { bn: "ডিএসইর সাইটে তালিকাভুক্ত মিউচুয়াল ফান্ডগুলোর তালিকা দেখুন", en: "Look up the listed mutual funds on the DSE site" } },
        { text: { bn: "তিনটা ফান্ডের গত পাঁচ বছরের কর্মক্ষমতা আর খরচের হার লিখে রাখুন", en: "Note three funds' five year performance and expense ratio" },
          hint: { bn: "খরচের হার বেশি হলে সেটা প্রতি বছর আপনার রিটার্ন থেকে যায়, বাজার যাই করুক।", en: "A high expense ratio comes out of your return every year whatever the market does." } },
        { text: { bn: "যত টাকা দেবেন ভেবেছেন, তার এক-দ্বাদশাংশ দিয়ে শুরু করুন", en: "Start with a twelfth of what you were planning to invest" },
          hint: { bn: "বাকিটা পরের এগারো মাসে। এই এক সিদ্ধান্ত সবচেয়ে বড় ভুলটা ঠেকায়।", en: "The rest over the next eleven months. That one decision prevents the biggest mistake." } },
        { text: { bn: "লিমিট অর্ডার দিন, মার্কেট অর্ডার নয়", en: "Place a limit order, not a market order" } },
        { text: { bn: "কেন কিনছেন সেটা দুই বাক্যে লিখে রাখুন, তারিখসহ", en: "Write two sentences on why, with the date" } },
        { text: { bn: "পরের এগারো মাসের জন্য ফোনে একটা মাসিক রিমাইন্ডার দিন", en: "Set a monthly reminder for the next eleven months" } },
      ],
    },
    "first-buy-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "একজন বলছেন, আমার কাছে দুই লাখ টাকা আছে আর আমি একটা খুব ভালো কোম্পানি খুঁজে পেয়েছি, পুরোটা ওখানেই দেব। সমস্যা কী?",
            en: "Someone says: I have two lakh and I have found a very good company, so it all goes there. What is wrong?",
          },
          options: [
            {
              text: { bn: "কোম্পানিটা হয়তো ভালো না", en: "The company might not be good" },
              why: {
                bn: "হতে পারে, কিন্তু সেটা আসল সমস্যা না। কোম্পানিটা সত্যিই ভালো হলেও একক শেয়ারে পুরো টাকা দেওয়ার ঝুঁকি থেকেই যায়: আগুন, নিয়ম বদল, একজন গুরুত্বপূর্ণ মানুষের চলে যাওয়া।",
                en: "Possibly, and that is not the real problem. Even a genuinely good company leaves the risk of everything in one name: a fire, a rule change, a key person leaving.",
              },
            },
            {
              text: { bn: "একটা কোম্পানিতে পুরো টাকা মানে একটা ঘটনার ওপর পুরো ফলাফল", en: "Everything in one company means one event decides everything" },
              right: true,
              why: {
                bn: "ঠিক। আপনি কোম্পানিটার মান নিয়ে বাজি ধরছেন না, আপনি বাজি ধরছেন যে ওই একটা কোম্পানির সঙ্গে খারাপ কিছুই ঘটবে না, আর সেটা আপনার নিয়ন্ত্রণের বাইরে।",
                en: "Right. You are not betting on the company's quality, you are betting that nothing bad happens to that one company, and that is outside your control.",
              },
            },
            {
              text: { bn: "দুই লাখ টাকা খুব বেশি", en: "Two lakh is too much money" },
              why: {
                bn: "অঙ্কটা সমস্যা না। দুই হাজার টাকা এক জায়গায় দেওয়া আর দুই লাখ এক জায়গায় দেওয়া একই ভুল, কেবল দ্বিতীয়টার দাম বেশি।",
                en: "The amount is not the issue. Two thousand in one name and two lakh in one name are the same mistake; the second one just costs more.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "একটা শেয়ারের সর্বশেষ দাম ৪৫ টাকা, কিন্তু ওই দামে কেবল ২০টা শেয়ার বিক্রির জন্য আছে। আপনি ১,০০০টা কিনতে মার্কেট অর্ডার দিলেন। কী হবে?",
            en: "A share last traded at 45 but only 20 are for sale at that price. You place a market order for 1,000. What happens?",
          },
          options: [
            {
              text: { bn: "১,০০০টাই ৪৫ টাকায় হবে", en: "All 1,000 fill at 45" },
              why: {
                bn: "না। ৪৫ টাকায় কেবল ২০টা আছে। বাকি ৯৮০টা পরের দামগুলো থেকে আসবে, যা ৪৬, ৪৮, ৫০ হতে পারে।",
                en: "No. There are only 20 at 45. The other 980 come from the next prices up, which might be 46, 48, 50.",
              },
            },
            {
              text: { bn: "২০টা ৪৫-এ, বাকিগুলো ক্রমশ বেশি দামে", en: "Twenty at 45 and the rest at rising prices" },
              right: true,
              why: {
                bn: "ঠিক, আর এটাই মার্কেট অর্ডারের বিপদ। পাতলা বাজারে গড় দাম আপনার ভাবনার চেয়ে অনেক বেশি হয়ে যেতে পারে। লিমিট অর্ডার দিলে ২০টা হতো আর বাকিটা অপেক্ষা করত, যা অনেক ভালো।",
                en: "Right, and that is the danger of a market order. In a thin market the average fill can land far above what you expected. A limit order would have taken the 20 and waited, which is much better.",
              },
            },
            {
              text: { bn: "অর্ডারটা বাতিল হয়ে যাবে", en: "The order is cancelled" },
              why: {
                bn: "না, মার্কেট অর্ডার বাতিল হয় না, সে যেকোনো দামে পূরণ হওয়ার চেষ্টা করে। ওটাই তার সংজ্ঞা আর ওটাই তার সমস্যা।",
                en: "No. A market order does not cancel, it tries to fill at any price. That is its definition and its problem.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "এক লাখ টাকা বারো মাসে ভাগ করে ঢোকানোর সুবিধাগুলো কী? একাধিক উত্তর ঠিক।",
            en: "What does spreading a lakh over twelve months get you? More than one is right.",
          },
          options: [
            {
              text: { bn: "গড় কেনা দাম দামগুলোর গড়ের চেয়ে কম হয়", en: "Your average price comes below the simple average" },
              right: true,
              why: {
                bn: "হ্যাঁ, ভাগের অঙ্কের কারণে। একই টাকায় সস্তার সময় বেশি ইউনিট আসে।",
                en: "Yes, purely by division: a fixed sum buys more units when the price is low.",
              },
            },
            {
              text: { bn: "একটা খারাপ তারিখে সব ঢুকিয়ে ফেলার ঝুঁকি থাকে না", en: "You cannot put everything in on one bad date" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর এটাই আসল সুবিধা। কোন তারিখটা খারাপ তা আগে জানা যায় না, তাই সব তারিখে একটু করে ঢোকানোই নিরাপদ।",
                en: "Yes, and this is the real benefit. You cannot know which date is bad in advance, so a bit on every date is the safe answer.",
              },
            },
            {
              text: { bn: "রিটার্ন সবসময় বেশি হয়", en: "The return is always higher" },
              why: {
                bn: "না। বাজার টানা উঠতে থাকলে একবারে ঢোকানোই বেশি আনত। ভাগ করা রিটার্ন বাড়ানোর কৌশল না, সবচেয়ে খারাপ ফলাফলটা কম খারাপ করার কৌশল।",
                en: "No. In a market that rises steadily, one lump would have done better. Spreading is not a way to raise the return, it is a way to make the worst outcome less bad.",
              },
            },
            {
              text: { bn: "প্রতি মাসে সিদ্ধান্ত নেওয়ার অভ্যাস তৈরি হয়", en: "It builds the habit of deciding every month" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর পরের লেখাটা পুরোটাই এই নিয়ে। অভ্যাসটাই দীর্ঘমেয়াদে সবচেয়ে বেশি কাজ করে।",
                en: "Yes, and the next lesson is entirely about that. Over a lifetime the habit does more work than anything else.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"make-a-rule": {
  bn: `
<p>আপনি প্রথম কেনাকাটা করে ফেলেছেন। এখন যে অংশটা আসছে সেটা কোনো লেখায় শেখানো যায় না, কেবল করে শেখা যায়, আর বেশিরভাগ মানুষ এখানেই হেরে যান। তারা খারাপ শেয়ার কিনে হারেন না; তারা হারেন ভালো শেয়ার কিনে সাত মাস পর বিরক্ত হয়ে বেচে দিয়ে।</p>

<p>সমাধানটা অদ্ভুত রকমের সরল: <strong>একটা নিয়ম বানিয়ে ফেলুন, আর তারপর সিদ্ধান্ত নেওয়া বন্ধ করে দিন।</strong> কারণ প্রতি মাসে নতুন করে সিদ্ধান্ত নিতে হলে আপনি প্রতি মাসে খবর, ভয়, আশা আর বন্ধুর পরামর্শের মুখোমুখি হবেন, আর ওগুলোর কাছে মানুষ সবসময় হারে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>প্রতি মাসে একই দিনে, একই টাকা। তারিখটা বেতনের পরের দিন হলে সবচেয়ে ভালো।</li>
<li>স্বয়ংক্রিয় করে দিন। ইচ্ছাশক্তির ওপর ছেড়ে দিলে দুই মাসের মধ্যে থেমে যাবে।</li>
<li>হিসাব দেখুন তিন মাসে একবার। প্রতিদিন দেখা কেবল ক্ষতি করে।</li>
<li>বছরে একবার পুনর্বিন্যাস, আর সেটা ক্যালেন্ডারের তারিখে, খবরের ভিত্তিতে নয়।</li>
<li>নিয়ম বদলানোর নিয়মও আগে থেকে লিখে রাখুন।</li>
</ul>
</div>

<h2>মাসের চক্রটা</h2>

${mount("rule-cycle")}

<p>এই চক্রটার সবচেয়ে গুরুত্বপূর্ণ অংশটা হলো তৃতীয় ঘর: কিছু না করা। এটা আসলে সবচেয়ে কঠিন কাজ, আর অভিজ্ঞ বিনিয়োগকারীদের সঙ্গে নতুনদের পার্থক্যের বড় অংশটা এখানেই।</p>

<h2>কেন স্বয়ংক্রিয় করা এত জরুরি</h2>

<p>একটা কথা মনে রাখুন: <strong>মাস শেষে যা থাকে তা জমাবেন না, মাসের শুরুতে যা সরিয়ে রাখেন তা জমাবেন।</strong> এই দুইটার মধ্যে পার্থক্যটা বিশাল, আর কারণটা মানুষের স্বভাব।</p>

<p>মাস শেষে জমানোর পরিকল্পনা করলে টাকাটা সারা মাস আপনার অ্যাকাউন্টে থাকে, আর সারা মাস সেটা খরচ হওয়ার সুযোগ পায়। মাসের শুরুতে সরিয়ে দিলে বাকি মাসটা আপনি যা আছে তা দিয়েই চালান, আর মানুষ আশ্চর্যজনকভাবে ভালোভাবেই চালাতে পারেন।</p>

<div class="side-note">
<p class="side-note-label">সংখ্যাটা ছোট রাখুন, শুরুতে</p>
<p>মাসে ৫,০০০ টাকার একটা নিয়ম যেটা তিন বছর চলল, সেটা মাসে ২০,০০০ টাকার একটা নিয়মের চেয়ে ভালো যেটা দুই মাসে ভেঙে গেল। যে অঙ্কটা খারাপ মাসেও দিতে পারবেন, সেটাই ঠিক অঙ্ক। বেতন বাড়লে অঙ্কটা বাড়াবেন, ওটাই সবচেয়ে সহজ সময়।</p>
</div>

<h2>কত ঘন ঘন দেখবেন</h2>

<p>এই প্রশ্নটার উত্তর অনেকের কাছে অবাক লাগে: যত কম, তত ভালো। কারণটা মানসিক, আর সেটা মাপা গেছে। শেয়ারের দাম দিনে দিনে প্রায় এলোমেলোভাবে ওঠানামা করে, তাই আপনি যত ঘন ঘন দেখবেন তত বেশি লাল দিন দেখবেন, আর লাল দিন দেখা মানুষকে বেচতে ঠেলে।</p>

${mount("check-compare")}

<p>বাংলাদেশের প্রেক্ষাপটে আরও একটা কারণ আছে। ব্রোকারের অ্যাপ খুলে বসে থাকলে ফেসবুকের গ্রুপ, হোয়াটসঅ্যাপের টিপস আর "আজকের হট শেয়ার" সবই হাতের নাগালে চলে আসে। যিনি তিন মাসে একবার দেখেন, তিনি এই পুরো জগতটার সংস্পর্শেই আসেন না।</p>

<h2>বছরে একবার পুনর্বিন্যাস</h2>

<p>পুনর্বিন্যাস, ইংরেজিতে rebalancing, মানে হলো বছরে একবার দেখা যে আপনার ঠিক করা ভাগগুলো এখনো ঠিক আছে কি না, আর না থাকলে ফিরিয়ে আনা।</p>

<div class="ex"><b>উদাহরণ:</b> আপনি ঠিক করেছিলেন ৬০% ফান্ডে আর ৪০% সঞ্চয়পত্রে। এক বছর পর বাজার ভালো গেছে, তাই এখন ভাগটা ৭২% আর ২৮%। পুনর্বিন্যাস মানে ফান্ড থেকে কিছু বেচে সঞ্চয়পত্রে সরানো, যাতে আবার ৬০-৪০ হয়। শুনতে উল্টো লাগে, কারণ আপনি যেটা ভালো করছে সেটা বেচছেন। আর ঠিক এইজন্যই এটা কাজ করে: এটা আপনাকে নিয়ম মেনে উঁচুতে বেচায় আর নিচুতে কেনায়, ঠিক যেটা মন কখনো করতে দেয় না।</div>

<p>একটা শর্ত আছে: পুনর্বিন্যাস করতে হবে ক্যালেন্ডারের একটা তারিখে, ধরুন প্রতি বছর জানুয়ারির প্রথম সপ্তাহে। খবর দেখে করলে সেটা পুনর্বিন্যাস নয়, সেটা প্রতিক্রিয়া।</p>

<h2>নিয়মটা লিখে ফেলুন</h2>

${mount("rule-order")}

<h2>ধৈর্যের দামটা দেখে নিন</h2>

${mount("rule-lab")}

<h2>করে ফেলুন</h2>

${mount("rule-drill")}

<h2>নিজে যাচাই করুন</h2>

${mount("rule-quiz")}

<p>নিয়ম দাঁড়িয়ে গেছে। এবার শেষ ধাপের আগেরটা, আর এটা না জানলে বাকি সবকিছু বৃথা যেতে পারে: <a class="term" href="/money/start/dont-get-cheated.html">ঠকবেন না</a>।</p>
`,
  en: `
<p>You have made the first purchase. What comes next cannot be taught in an article, only practised, and it is where most people lose. They do not lose by buying bad shares; they lose by buying good ones and selling seven months later out of boredom.</p>

<p>The fix is oddly simple: <strong>make a rule and then stop deciding.</strong> Because if the decision has to be made again every month, then every month you face news, fear, hope and a friend's tip, and people lose to those every time.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>The same amount on the same day each month. The day after payday is best.</li>
<li>Automate it. Left to willpower it stops inside two months.</li>
<li>Look at the account once a quarter. Looking daily only does damage.</li>
<li>Rebalance once a year, on a calendar date, never on the news.</li>
<li>Write down the rule for changing the rule, in advance.</li>
</ul>
</div>

<h2>The monthly cycle</h2>

${mount("rule-cycle")}

<p>The most important box in that cycle is the third one: doing nothing. It is the hardest job on the list, and a large part of what separates experienced investors from new ones.</p>

<h2>Why automating matters so much</h2>

<p>Hold on to this sentence: <strong>do not save what is left at the end of the month, save what you move at the start of it.</strong> The gap between those two is enormous, and the reason is human nature.</p>

<p>Plan to save at the end and the money sits in your account all month, available to be spent all month. Move it at the start and you run the rest of the month on what remains, and people are surprisingly good at doing exactly that.</p>

<div class="side-note">
<p class="side-note-label">Keep the number small at first</p>
<p>A 5,000 a month rule that ran for three years beats a 20,000 a month rule that broke in two. The right amount is the one you can pay in a bad month too. Raise it when your salary rises, which is the easiest moment there is.</p>
</div>

<h2>How often to look</h2>

<p>The answer surprises people: as rarely as you can manage. The reason is psychological and it has been measured. Prices move close to randomly day to day, so the more often you look the more red days you see, and red days push people to sell.</p>

${mount("check-compare")}

<p>In Bangladesh there is a second reason. Sit with the broker's app open and the Facebook groups, the WhatsApp tips and "today's hot share" are all one tap away. Somebody who looks once a quarter never comes into contact with that world at all.</p>

<h2>Rebalancing, once a year</h2>

<p>Rebalancing means checking once a year that your chosen proportions still hold and bringing them back if they do not.</p>

<div class="ex"><b>Example:</b> You decided on 60% in funds and 40% in savings certificates. A year on the market has done well, so the split is now 72 and 28. Rebalancing means selling some of the fund and moving it to the certificates until it is 60-40 again. It feels backwards, because you are selling the thing that is doing well. That is exactly why it works: it makes you sell high and buy low by rule, which the mind will never let you do by feel.</div>

<p>One condition: rebalance on a calendar date, say the first week of January every year. Do it because of the news and it is not rebalancing, it is reacting.</p>

<h2>Write the rule down</h2>

${mount("rule-order")}

<h2>See what the patience is worth</h2>

${mount("rule-lab")}

<h2>Go and do it</h2>

${mount("rule-drill")}

<h2>Check yourself</h2>

${mount("rule-quiz")}

<p>The rule is standing. Now the one before last, and without it everything else can still be lost: <a class="term" href="/money/start/dont-get-cheated.html">Don't get cheated</a>.</p>
`,
  blocks: {
    "rule-cycle": {
      kind: "figure",
      shape: "cycle",
      title: { bn: "প্রতি মাসে যা হয়", en: "What happens each month" },
      parts: [
        { text: { bn: "বেতন আসে", en: "Salary arrives" }, note: { bn: "মাসের নির্দিষ্ট দিনে", en: "On a known day" } },
        { text: { bn: "টাকা স্বয়ংক্রিয়ভাবে সরে যায়", en: "The money moves itself" }, note: { bn: "পরদিন, আপনার হাত ছাড়াই", en: "The next day, with no hand on it" }, tone: "good" },
        { text: { bn: "কেনা হয়", en: "The purchase happens" }, note: { bn: "একই ফান্ডে, একই অঙ্ক", en: "Same fund, same amount" } },
        { text: { bn: "কিছু না করা", en: "Do nothing" }, note: { bn: "সবচেয়ে কঠিন ঘর, আর সবচেয়ে দামি", en: "The hardest box, and the valuable one" }, tone: "lead" },
      ],
      caption: {
        bn: "চারটার তিনটা স্বয়ংক্রিয় করা যায়। চতুর্থটা করা যায় না, আর সেটাই আসল কাজ।",
        en: "Three of the four can be automated. The fourth cannot, and it is the real work.",
      },
    },
    "check-compare": {
      kind: "compare",
      title: { bn: "কত ঘন ঘন হিসাব দেখবেন", en: "How often to look" },
      columns: [
        { bn: "প্রতিদিন", en: "Daily" },
        { bn: "মাসে একবার", en: "Monthly" },
        { bn: "তিন মাসে একবার", en: "Quarterly" },
      ],
      rows: [
        {
          label: { bn: "কত ভাগ দিনে লাল দেখবেন", en: "Share of checks that look red" },
          cells: [
            { bn: "প্রায় অর্ধেক", en: "About half" },
            { bn: "প্রায় এক-তৃতীয়াংশ", en: "About a third" },
            { bn: "প্রায় এক-চতুর্থাংশ", en: "About a quarter" },
          ],
          best: 2,
        },
        {
          label: { bn: "আতঙ্কে বেচার সম্ভাবনা", en: "Chance of a panic sale" },
          cells: [
            { bn: "সবচেয়ে বেশি", en: "Highest" },
            { bn: "মাঝারি", en: "Middling" },
            { bn: "সবচেয়ে কম", en: "Lowest" },
          ],
          best: 2,
        },
        {
          label: { bn: "নতুন তথ্য পাওয়া যায়?", en: "Any new information?" },
          cells: [
            { bn: "প্রায় কিছুই না, কেবল আওয়াজ", en: "Almost none, just noise" },
            { bn: "সামান্য", en: "A little" },
            { bn: "ত্রৈমাসিক ফলাফল, যা আসল খবর", en: "Quarterly results, which is the real news" },
          ],
          best: 2,
        },
        {
          label: { bn: "কখন বেশি দেখা যুক্তিসঙ্গত", en: "When looking more often is reasonable" },
          cells: [
            { bn: "কখনো না", en: "Never" },
            { bn: "টাকা ঢোকানোর দিনে", en: "On the day money goes in" },
            { bn: "ফলাফল প্রকাশের সময়", en: "Around results season" },
          ],
        },
      ],
    },
    "rule-order": {
      kind: "order",
      title: { bn: "নিয়মটা কীভাবে সাজানো", en: "How the rule is built" },
      note: { bn: "একটা কাজের নিয়ম এই ক্রমে দাঁড়ায়।", en: "A working rule stands up in this order." },
      items: [
        { text: { bn: "একটা অঙ্ক ঠিক করা যেটা খারাপ মাসেও দেওয়া যায়", en: "Pick an amount you can pay in a bad month" },
          why: { bn: "যে নিয়ম ভাঙে সেটা নিয়ম না। ছোট আর টেকসই বড় আর ভঙ্গুরকে হারায়।", en: "A rule that breaks is not a rule. Small and durable beats large and brittle." } },
        { text: { bn: "একটা তারিখ ঠিক করা, বেতনের পরের দিন", en: "Pick a date, the day after payday" },
          why: { bn: "মাস শেষে যা থাকে তা নয়, মাসের শুরুতে যা সরিয়ে রাখেন তা।", en: "Not what is left at the end: what you move at the start." } },
        { text: { bn: "ব্যাংকে স্বয়ংক্রিয় ট্রান্সফার চালু করা", en: "Set the automatic transfer at the bank" },
          why: { bn: "ইচ্ছাশক্তি ফুরিয়ে যায়, স্থায়ী নির্দেশ ফুরায় না।", en: "Willpower runs out. A standing instruction does not." } },
        { text: { bn: "হিসাব দেখার সময়সূচি ঠিক করা, তিন মাসে একবার", en: "Decide when you look: once a quarter" },
          why: { bn: "না দেখাটাও সিদ্ধান্ত, আর সেটা আগে থেকে নিতে হয়।", en: "Not looking is also a decision, and it has to be made in advance." } },
        { text: { bn: "পুনর্বিন্যাসের তারিখ ক্যালেন্ডারে বসানো", en: "Put the rebalancing date in the calendar" },
          why: { bn: "বছরে একবার, খবরের সঙ্গে সম্পর্কহীন।", en: "Once a year, unrelated to any news." } },
        { text: { bn: "কী হলে নিয়ম বদলাবে সেটা লিখে রাখা", en: "Write down what would change the rule" },
          why: { bn: "বেতন বাড়া, চাকরি যাওয়া, বিয়ে, সন্তান। বাজার পড়া এই তালিকায় নেই।", en: "A raise, a job loss, a marriage, a child. A market fall is not on the list." } },
      ],
    },
    "rule-lab": {
      kind: "lab",
      model: "compound",
      title: { bn: "একটা নিয়ম বিশ বছরে কী করে", en: "What one rule does over twenty years" },
      note: {
        bn: "মাসের অঙ্কটা বদলে দেখুন। ছোট অঙ্কও কত দূর যায় লক্ষ করুন।",
        en: "Change the monthly amount and see how far even a small one goes.",
      },
      preset: { start: 0, monthly: 5000, rate: 10, years: 20 },
    },
    "rule-drill": {
      kind: "drill",
      title: { bn: "আজকের কাজ", en: "Today's work" },
      steps: [
        { text: { bn: "একটা অঙ্ক ঠিক করুন যেটা খারাপ মাসেও দিতে পারবেন", en: "Pick an amount you could pay in a bad month" } },
        { text: { bn: "ব্যাংকের অ্যাপে বেতনের পরদিনের জন্য স্থায়ী নির্দেশ দিন", en: "Set a standing instruction in the bank app for the day after payday" } },
        { text: { bn: "ফোনের ক্যালেন্ডারে তিন মাস পরের একটা তারিখ বসান, হিসাব দেখার জন্য", en: "Put a date three months out in the calendar, to look at the account" },
          hint: { bn: "আর তার আগে দেখবেন না। এটাই এই তালিকার সবচেয়ে কঠিন লাইন।", en: "And do not look before it. This is the hardest line on the list." } },
        { text: { bn: "পরের জানুয়ারির প্রথম সপ্তাহে পুনর্বিন্যাসের তারিখ বসান", en: "Put a rebalancing date in the first week of next January" } },
        { text: { bn: "লিখে রাখুন: কোন তিনটা ঘটনায় এই নিয়ম বদলাবে", en: "Write down the three events that would change this rule" },
          hint: { bn: "বাজার পড়া ওই তিনটার একটা নয়। ওটাই মূল কথা।", en: "A market fall is not one of the three. That is the point." } },
      ],
    },
    "rule-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "বাজার ছয় মাসে ২২% পড়েছে। আপনার মাসিক নিয়ম কী হবে?",
            en: "The market is down 22% over six months. What happens to your monthly rule?",
          },
          options: [
            {
              text: { bn: "থামিয়ে দেব, পরিস্থিতি ভালো হলে আবার শুরু করব", en: "Pause it and restart when things improve" },
              why: {
                bn: "শুনতে যুক্তিসঙ্গত, আর এটাই সবচেয়ে দামি ভুল। আপনি ঠিক তখনই কেনা বন্ধ করছেন যখন দাম সবচেয়ে কম, আর আবার শুরু করবেন যখন দাম আবার বেড়ে গেছে। 'পরিস্থিতি ভালো' মানে দাম বেশি।",
                en: "It sounds reasonable and it is the most expensive mistake here. You stop buying exactly when things are cheapest and restart once they are dear again. \"Things improving\" means prices are higher.",
              },
            },
            {
              text: { bn: "একই থাকবে, কারণ পতনের সময় একই টাকায় বেশি ইউনিট আসে", en: "It carries on, because the same money buys more units in a fall" },
              right: true,
              why: {
                bn: "ঠিক। মাসিক নিয়মের পুরো সুবিধাটাই আসে পতনের মাসগুলো থেকে। যিনি ওই মাসগুলোতে থেমে যান, তিনি নিয়মটার সবচেয়ে দামি অংশটাই বাদ দেন।",
                en: "Right. The entire benefit of a monthly rule comes from the falling months. Pausing in those months removes the most valuable part of it.",
              },
            },
            {
              text: { bn: "দ্বিগুণ করে দেব, সস্তা হয়েছে", en: "Double it, since things are cheap" },
              why: {
                bn: "লোভনীয়, আর সাবধান। যে অঙ্কটা খারাপ মাসে দেওয়া যায় না সেটা নিয়ম ভাঙে, আর পতন কতদিন চলবে তা কেউ জানে না। বাড়াতে হলে বেতন বাড়ার সময় বাড়ান।",
                en: "Tempting, and be careful. An amount you cannot sustain in a bad month breaks the rule, and nobody knows how long a fall runs. Raise it when your salary rises instead.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "পুনর্বিন্যাস মানে কী?",
            en: "What does rebalancing mean?",
          },
          options: [
            {
              text: { bn: "যেটা ভালো করছে সেটা আরও কেনা", en: "Buying more of whatever is doing well" },
              why: {
                bn: "উল্টো। ওটাকে বলে ধাওয়া করা, আর ওটা প্রায় সবসময় উঁচুতে কেনায় গিয়ে ঠেকে।",
                en: "The opposite. That is chasing, and it almost always ends in buying high.",
              },
            },
            {
              text: { bn: "যেটা বেড়েছে তার কিছু বেচে আগের ভাগে ফিরিয়ে আনা", en: "Selling some of what has risen to restore the original split" },
              right: true,
              why: {
                bn: "ঠিক। এটা নিয়ম মেনে উঁচুতে বেচায় আর নিচুতে কেনায়, যা মন কখনো করতে দেয় না। শর্ত একটাই: ক্যালেন্ডারের তারিখে করতে হবে, খবরে নয়।",
                en: "Right. It makes you sell high and buy low by rule, which feelings never allow. The one condition: do it on a calendar date, not on the news.",
              },
            },
            {
              text: { bn: "সব বেচে নতুন করে শুরু করা", en: "Selling everything and starting again" },
              why: {
                bn: "না, আর এতে কমিশন আর কর দুইটাই লাগে। পুনর্বিন্যাস একটা ছোট সমন্বয়, নতুন শুরু নয়।",
                en: "No, and that pays commission and tax twice over. Rebalancing is a small adjustment, not a fresh start.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কেন মাসের শুরুতে টাকা সরানো, মাস শেষে নয়?",
            en: "Why move the money at the start of the month rather than the end?",
          },
          options: [
            {
              text: { bn: "কারণ মাসের শুরুতে দাম কম থাকে", en: "Because prices are lower early in the month" },
              why: {
                bn: "না, এমন কোনো নিয়ম নেই। মাসের কোন দিনে দাম কম থাকে সেটা আগে থেকে জানা যায় না, আর জানার দরকারও নেই।",
                en: "No such pattern exists. Which day of the month is cheap cannot be known in advance and does not need to be.",
              },
            },
            {
              text: { bn: "কারণ অ্যাকাউন্টে থাকা টাকা খরচ হয়ে যায়", en: "Because money sitting in the account gets spent" },
              right: true,
              why: {
                bn: "ঠিক, আর এটা ইচ্ছাশক্তির সমস্যা নয়, ব্যবস্থার সমস্যা। টাকাটা সরিয়ে দিলে বাকি মাসটা মানুষ যা আছে তা দিয়েই চালান, আর আশ্চর্যজনকভাবে ভালোই চালান।",
                en: "Right, and it is not a willpower problem, it is a plumbing problem. Move it and people run the rest of the month on what is left, and do it surprisingly well.",
              },
            },
            {
              text: { bn: "কারণ ব্যাংক শুরুতে বেশি সুদ দেয়", en: "Because banks pay more interest early in the month" },
              why: {
                bn: "না, সুদ সাধারণত দৈনিক বা মাসিক ভিত্তিতে হিসাব হয়, আর পার্থক্যটা এখানে অর্থহীন।",
                en: "No. Interest is usually computed daily or monthly and the difference is meaningless here.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"dont-get-cheated": {
  bn: `
<p>বাংলাদেশে বিনিয়োগ করে মানুষ যত টাকা হারিয়েছে, তার একটা বড় অংশ খারাপ শেয়ার কিনে হারায়নি। হারিয়েছে এমন জায়গায় যা আসলে বিনিয়োগই ছিল না: ডেসটিনি, যুবক, ইউনিপে টু ইউ, ই-ভ্যালি, আর নাম না জানা শত শত ছোট স্কিম যেগুলো জেলা শহরে শুরু হয়ে দুই বছর পর অফিস বন্ধ করে দিয়েছে।</p>

<p>এই লেখাটা এইজন্য পাঁচ তারার। শেয়ার বাছাই ভুল হলে আপনি ৩০% হারান। প্রতারণায় পড়লে আপনি ১০০% হারান, আর সঙ্গে সঙ্গে নয়, দুই বছর ধরে আস্থা রেখে অপেক্ষা করার পর।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>নিশ্চিত রিটার্নের প্রতিশ্রুতিই সবচেয়ে বড় সংকেত। ঝুঁকি ছাড়া বাড়তি রিটার্ন হয় না।</li>
<li>যে স্কিমে নতুন সদস্য আনলে টাকা পাওয়া যায়, সেটা বিনিয়োগ নয়, শৃঙ্খল।</li>
<li>নিয়ন্ত্রক সংস্থার লাইসেন্স নম্বর চান, আর নিজে যাচাই করুন।</li>
<li>তাড়া দেওয়া মানেই সন্দেহ করা: ভালো সুযোগ আগামীকালও থাকে।</li>
<li>কাউকে টাকা দেওয়ার আগে নিজের নামে অ্যাকাউন্ট, নিজের নামে কাগজ।</li>
</ul>
</div>

<h2>একটাই প্রশ্ন, আর সেটা যথেষ্ট</h2>

<p>যদি একটামাত্র জিনিস মনে রাখতে হয়, এটাই: <strong>টাকাটা আসলে কোথা থেকে আসছে?</strong></p>

<p>প্রতিটা সৎ বিনিয়োগে এই প্রশ্নের একটা পরিষ্কার উত্তর আছে। শেয়ারে টাকা আসে কোম্পানির লাভ থেকে। এফডিআরে আসে ব্যাংকের ঋণের সুদ থেকে। সঞ্চয়পত্রে আসে সরকারের কর থেকে। ফ্ল্যাটে আসে ভাড়া থেকে। উত্তরটা সবসময় একটা সত্যিকারের অর্থনৈতিক কর্মকাণ্ড।</p>

<p>প্রতারণায় এই প্রশ্নের উত্তর হয় ধোঁয়াশা, নয়তো উত্তরটা হলো "নতুন সদস্যদের টাকা থেকে"। দ্বিতীয়টা হলে সেটার নাম পিরামিড বা পঞ্জি, আর সেটা গাণিতিকভাবে ভেঙে পড়তে বাধ্য, প্রশ্নটা কেবল কবে।</p>

${mount("ponzi-flow")}

<h2>প্রতিশ্রুত রিটার্ন আর বাস্তব</h2>

${mount("return-matrix")}

<p>ছবিটার নিচের ডান কোণে কিছু নেই, আর সেটা কাকতালীয় নয়। উঁচু রিটার্ন আর কম ঝুঁকি একসঙ্গে থাকতে পারে না, কারণ যদি পারত তাহলে পৃথিবীর সব টাকা ওখানেই যেত আর রিটার্নটা নেমে যেত। যিনি ওই কোণটা বিক্রি করছেন, তিনি হয় ভুল করছেন নয়তো মিথ্যা বলছেন, তৃতীয় সম্ভাবনা নেই।</p>

<h2>একটা বার্তা, লাইন ধরে ধরে</h2>

<p>নিচেরটা এই ধরনের হোয়াটসঅ্যাপ বার্তার একটা রূপ যা বাংলাদেশে হাজারো মানুষ পেয়েছেন। প্রতিটা লাইনে চাপ দিয়ে দেখুন কোনগুলো বিপদের চিহ্ন।</p>

${mount("scam-spot")}

<h2>যাচাই করার তিনটা ধাপ</h2>

<ol class="step-list">
<li><strong>লাইসেন্স নম্বর চান, আর নিজে মিলিয়ে দেখুন।</strong> শেয়ারবাজারের ব্রোকার হলে বিএসইসির তালিকায় থাকতে হবে। ফান্ড হলে অ্যাসেট ম্যানেজমেন্ট কোম্পানিটাকেও নিবন্ধিত হতে হবে। ওদের দেওয়া কাগজ দেখে সন্তুষ্ট হবেন না, নিয়ন্ত্রকের নিজের সাইটে গিয়ে নামটা খুঁজুন। ওরা যদি নম্বর দিতে গড়িমসি করে, আলোচনা শেষ।</li>
<li><strong>টাকাটা কোথায় যাচ্ছে দেখুন।</strong> সৎ প্রতিষ্ঠানে টাকা যায় প্রতিষ্ঠানের নিজের ব্যাংক অ্যাকাউন্টে, আর আপনার নামে রসিদ আসে। কোনো ব্যক্তির ব্যক্তিগত অ্যাকাউন্টে বা বিকাশ নম্বরে টাকা চাইলে সেটা প্রতারণা, ব্যতিক্রম নেই।</li>
<li><strong>তিন দিন অপেক্ষা করুন।</strong> এটাই সবচেয়ে সহজ আর সবচেয়ে কার্যকর হাতিয়ার। প্রতারণা তাড়ার ওপর চলে: আজকের মধ্যে না দিলে সুযোগ চলে যাবে, কেবল দশটা জায়গা বাকি। সত্যিকারের বিনিয়োগ তিন দিন পরেও থাকে। যিনি তাড়া দিচ্ছেন, তিনি চান না আপনি ভাবেন।</li>
</ol>

<div class="note">পরিচিত মানুষ প্রস্তাব আনলে সন্দেহটা কমে যায়, আর প্রতারণা ঠিক এটার ওপরই দাঁড়িয়ে থাকে। ডেসটিনি বা ই-ভ্যালির বেশিরভাগ শিকার অচেনা কারো কাছ থেকে খবরটা পাননি; পেয়েছেন ভাই, কলিগ বা মসজিদের পরিচিত কারো কাছ থেকে, যিনি নিজেও সৎভাবে বিশ্বাস করতেন। প্রশ্নটা মানুষটার সততা নিয়ে নয়, স্কিমটার অঙ্ক নিয়ে।</div>

<h2>বাংলাদেশে যেভাবে হয়</h2>

${mount("scam-compare")}

<h2>যাচাই করে ফেলুন</h2>

${mount("scam-drill")}

<h2>নিজে যাচাই করুন</h2>

${mount("scam-quiz")}

<p>শেষ ধাপ। এখান থেকে কোথায়: <a class="term" href="/money/start/where-next.html">এরপর কোথায়</a>।</p>
`,
  en: `
<p>A large share of the money Bangladeshis have lost investing was not lost on bad shares. It was lost in places that were never investments at all: Destiny, Jubok, Unipay2U, Evaly, and hundreds of unnamed local schemes that opened in a district town and shut the office two years later.</p>

<p>That is why this lesson carries five stars. Pick the wrong share and you lose 30%. Walk into a fraud and you lose 100%, not at once, but after two years of trusting and waiting.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>A promise of guaranteed returns is the single loudest signal. Extra return without risk does not exist.</li>
<li>A scheme that pays you for bringing in new members is not an investment, it is a chain.</li>
<li>Ask for the licence number and verify it yourself.</li>
<li>Urgency is itself the warning: a real opportunity is still there tomorrow.</li>
<li>Before money moves: your own account, your own name on the paperwork.</li>
</ul>
</div>

<h2>One question, and it is enough</h2>

<p>If you remember one thing from this lesson, make it this: <strong>where is the money actually coming from?</strong></p>

<p>Every honest investment has a clear answer. In shares it comes from company profits. In a deposit it comes from interest on the bank's lending. In savings certificates it comes from taxes. In a flat it comes from rent. The answer is always some real economic activity.</p>

<p>In a fraud the answer is either vague or it is "from the new members' money". If it is the second, that is a pyramid or a Ponzi, and it is mathematically certain to collapse. The only question is when.</p>

${mount("ponzi-flow")}

<h2>Promised return against reality</h2>

${mount("return-matrix")}

<p>Nothing sits in the bottom right corner, and that is not a coincidence. High return and low risk cannot coexist, because if they could every taka on earth would go there and the return would fall. Anyone selling that corner is either mistaken or lying; there is no third option.</p>

<h2>One message, line by line</h2>

<p>Below is a version of a WhatsApp message thousands of people in Bangladesh have received. Press each line and find the warnings.</p>

${mount("scam-spot")}

<h2>Three steps that check</h2>

<ol class="step-list">
<li><strong>Ask for the licence number, then verify it yourself.</strong> A stockbroker has to be on BSEC's list. A fund needs its asset management company registered too. Do not be satisfied by paperwork they hand you; go to the regulator's own site and search for the name. If they hesitate to give a number, the conversation is over.</li>
<li><strong>Watch where the money goes.</strong> At an honest institution money goes into the institution's own bank account and a receipt comes back in your name. Anyone asking you to pay a person's private account or a mobile wallet number is running a fraud, with no exceptions.</li>
<li><strong>Wait three days.</strong> The simplest and most effective tool there is. Fraud runs on urgency: only today, only ten places left. A real investment is still there in three days. Someone hurrying you does not want you to think.</li>
</ol>

<div class="note">Suspicion drops when the offer comes from somebody you know, and that is exactly what these schemes stand on. Most Destiny and Evaly victims did not hear about it from a stranger; they heard from a brother, a colleague, somebody from the mosque, who believed it honestly themselves. The question is not about that person's integrity, it is about the scheme's arithmetic.</div>

<h2>How it looks in Bangladesh</h2>

${mount("scam-compare")}

<h2>Go and check</h2>

${mount("scam-drill")}

<h2>Check yourself</h2>

${mount("scam-quiz")}

<p>Last step. Where to from here: <a class="term" href="/money/start/where-next.html">Where to go next</a>.</p>
`,
  blocks: {
    "ponzi-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "পঞ্জি স্কিম কীভাবে চলে আর কীভাবে থামে", en: "How a Ponzi runs, and how it stops" },
      parts: [
        { text: { bn: "প্রথম দলের টাকা", en: "The first group pays in" }, note: { bn: "১০০ জন, মাসে ১০% প্রতিশ্রুতি", en: "A hundred people, 10% a month promised" } },
        { text: { bn: "দ্বিতীয় দলের টাকা দিয়ে প্রথম দলকে দেওয়া", en: "The second group's money pays the first" }, note: { bn: "প্রথম দল সত্যিই টাকা পায়, তাই সবাইকে বলে", en: "The first group really is paid, so they tell everyone" }, tone: "warn" },
        { text: { bn: "নতুন সদস্য দ্রুত বাড়তে থাকে", en: "Recruitment accelerates" }, note: { bn: "প্রতি ধাপে দ্বিগুণ লাগে, আর মানুষ ফুরিয়ে যায়", en: "Each round needs double, and people run out" }, tone: "warn" },
        { text: { bn: "নতুন টাকা কমে যায়", en: "New money slows" }, note: { bn: "গণিত এখানে থামায়, কোনো দুর্ঘটনা না", en: "Arithmetic stops it here, not an accident" }, tone: "bad" },
        { text: { bn: "অফিস বন্ধ", en: "The office closes" }, note: { bn: "শেষ দলের কেউ কিছুই ফেরত পায় না", en: "The last group gets nothing back" }, tone: "bad" },
      ],
      caption: {
        bn: "শুরুর দিকের কয়েকজন সত্যিই টাকা পান, আর সেটাই স্কিমটার সবচেয়ে শক্তিশালী বিজ্ঞাপন।",
        en: "The earliest members really are paid, and that is the scheme's most powerful advertisement.",
      },
    },
    "return-matrix": {
      kind: "figure",
      shape: "matrix",
      title: { bn: "রিটার্ন আর ঝুঁকি", en: "Return against risk" },
      axes: {
        x: [{ bn: "কম ঝুঁকি", en: "Low risk" }, { bn: "বেশি ঝুঁকি", en: "High risk" }],
        y: [{ bn: "কম রিটার্ন", en: "Low return" }, { bn: "বেশি রিটার্ন", en: "High return" }],
      },
      parts: [
        {
          text: { bn: "এখানে কিছু নেই", en: "Nothing lives here" },
          note: { bn: "যা প্রতিশ্রুতি দেওয়া হয় আর যা সত্যি নয়: মাসে ১০%, নিশ্চিত", en: "What gets promised and is never true: 10% a month, guaranteed" },
          tone: "bad",
        },
        {
          text: { bn: "শেয়ার, ফান্ড", en: "Shares and funds" },
          note: { bn: "লম্বা সময়ে বেশি, আর পথে ওঠানামা করবেই", en: "More over long stretches, and it will wobble on the way" },
          tone: "good",
        },
        {
          text: { bn: "এফডিআর, সঞ্চয়পত্র", en: "Deposits and certificates" },
          note: { bn: "নিশ্চিত, আর মূল্যস্ফীতির পর প্রায় কিছুই না", en: "Certain, and near nothing after inflation" },
          tone: "plain",
        },
        {
          text: { bn: "জুয়া, একক পাতলা শেয়ার", en: "Gambling, one thin share" },
          note: { bn: "ঝুঁকি নেওয়া মানেই রিটার্ন পাওয়া নয়", en: "Taking risk is not the same as being paid for it" },
          tone: "warn",
        },
      ],
      caption: {
        bn: "উপরের বাঁ ঘরটা যিনি বিক্রি করছেন, তিনি এমন কিছু বিক্রি করছেন যা নেই।",
        en: "Anyone selling the top left square is selling something that does not exist.",
      },
    },
    "scam-spot": {
      kind: "spot",
      title: { bn: "কোন লাইনগুলো বিপদের চিহ্ন", en: "Which lines are the warnings" },
      note: { bn: "প্রতিটা লাইনে চাপ দিন। কয়েকটা স্বাভাবিক, কয়েকটা নয়।", en: "Press each line. Some are ordinary, some are not." },
      source: {
        bn: "একটা হোয়াটসঅ্যাপ বার্তা, পরিচিত একজনের কাছ থেকে",
        en: "A WhatsApp message, from somebody you know",
      },
      lines: [
        {
          text: { bn: "ভাই, একটা দারুণ সুযোগ পেয়েছি, তোমাকে বলছি কারণ তুমি আমার কাছের মানুষ।", en: "Bhai, I have found a great opportunity and I am telling you because you are close to me." },
        },
        {
          text: { bn: "কোম্পানিটা সোনার ব্যবসা করে, মাসে নিশ্চিত ৮% দেয়।", en: "The company trades gold and pays a guaranteed 8% a month." },
          flag: {
            bn: "নিশ্চিত ৮% মাসে মানে বছরে ১৫০% এর বেশি, চক্রবৃদ্ধিসহ। পৃথিবীর সেরা বিনিয়োগকারীরা বছরে ২০% পান। আর 'নিশ্চিত' শব্দটাই আলাদা করে একটা সংকেত: বিনিয়োগে কিছুই নিশ্চিত না।",
            en: "A guaranteed 8% a month is over 150% a year compounded. The best investors alive make about 20% a year. And the word \"guaranteed\" is a signal on its own: nothing in investing is.",
          },
        },
        {
          text: { bn: "গত দুই বছর ধরে সবাই ঠিকমতো টাকা পাচ্ছে, আমি নিজেও পেয়েছি।", en: "Everyone has been paid on time for two years and I have been paid myself." },
          flag: {
            bn: "পঞ্জি স্কিমে শুরুর দিকের সদস্যরা সত্যিই টাকা পান, নতুনদের টাকা দিয়ে। এই কথাটা স্কিমটা সৎ প্রমাণ করে না, বরং এটাই তার প্রধান বিজ্ঞাপন। ডেসটিনি সতেরো বছর টাকা দিয়েছিল।",
            en: "In a Ponzi the earliest members really are paid, out of newer members' money. This proves nothing about honesty; it is the scheme's main advertisement. Destiny paid out for seventeen years.",
          },
        },
        {
          text: { bn: "কাগজপত্র সব আছে, অফিস গুলশানে, আমি নিজে গিয়েছি।", en: "All the paperwork exists, the office is in Gulshan, I have been there myself." },
        },
        {
          text: { bn: "আর তুমি যদি আরও দুইজন আনতে পারো, তোমার নিজের রিটার্ন ১২% হয়ে যাবে।", en: "And if you bring in two more people your own return goes up to 12%." },
          flag: {
            bn: "এটাই সিদ্ধান্তমূলক প্রমাণ। কোনো সৎ বিনিয়োগে নতুন সদস্য আনার জন্য বাড়তি রিটার্ন দেওয়া হয় না, কারণ রিটার্ন আসে ব্যবসা থেকে, সদস্য থেকে নয়। যেখানে সদস্য আনলে টাকা বাড়ে, সেখানে সদস্যের টাকাই আপনার রিটার্ন।",
            en: "This is the decisive one. No honest investment pays extra for recruitment, because the return comes from the business, not from members. Where recruiting raises your return, the recruits' money is your return.",
          },
        },
        {
          text: { bn: "টাকাটা আমার বিকাশে পাঠাও, আমি একসাথে জমা দিয়ে দেব।", en: "Send the money to my mobile wallet and I will deposit it together." },
          flag: {
            bn: "কোনো ব্যক্তির ব্যক্তিগত অ্যাকাউন্টে বিনিয়োগের টাকা যায় না, ব্যতিক্রম ছাড়া। সৎ প্রতিষ্ঠানে টাকা যায় প্রতিষ্ঠানের নিজের অ্যাকাউন্টে আর আপনার নিজের নামে রসিদ আসে।",
            en: "Investment money never goes to a person's private account. At an honest institution it goes to the institution's own account and the receipt comes back in your name.",
          },
        },
        {
          text: { bn: "নতুন সদস্য নেওয়া এই সপ্তাহেই বন্ধ হয়ে যাচ্ছে, তাই আজকের মধ্যে জানাও।", en: "Registration closes this week, so let me know today." },
          flag: {
            bn: "তাড়া দেওয়াই প্রতারণার প্রধান হাতিয়ার, কারণ ভাবার সময় পেলে মানুষ প্রশ্ন করে। সত্যিকারের বিনিয়োগের সুযোগ তিন দিন পরেও থাকে। তিন দিনের নিয়মটা এইজন্যই কাজ করে।",
            en: "Urgency is the main tool, because given time people ask questions. A real opportunity is still there in three days. That is exactly why the three day rule works.",
          },
        },
        {
          text: { bn: "চাইলে আগে অল্প টাকা দিয়ে দেখতে পারো, বিশ হাজার হলেও চলবে।", en: "You can start small if you like, twenty thousand is fine." },
        },
      ],
    },
    "scam-compare": {
      kind: "compare",
      title: { bn: "সৎ প্রতিষ্ঠান আর প্রতারণা", en: "An honest institution and a fraud" },
      columns: [
        { bn: "সৎ প্রতিষ্ঠান", en: "Honest" },
        { bn: "প্রতারণা", en: "Fraud" },
      ],
      rows: [
        {
          label: { bn: "রিটার্ন সম্পর্কে কী বলে", en: "What it says about returns" },
          cells: [
            { bn: "অতীতের ফল দেখায়, ভবিষ্যতের নিশ্চয়তা দেয় না", en: "Shows past results, guarantees no future" },
            { bn: "নির্দিষ্ট হার, নিশ্চিত, লিখিতভাবে", en: "A fixed rate, guaranteed, in writing" },
          ],
          best: 0,
        },
        {
          label: { bn: "টাকা কোথায় যায়", en: "Where the money goes" },
          cells: [
            { bn: "প্রতিষ্ঠানের নিজের অ্যাকাউন্টে, রসিদসহ", en: "The institution's own account, with a receipt" },
            { bn: "একজন ব্যক্তির অ্যাকাউন্টে বা মোবাইল ওয়ালেটে", en: "A person's account or a mobile wallet" },
          ],
          best: 0,
        },
        {
          label: { bn: "নিয়ন্ত্রক", en: "The regulator" },
          cells: [
            { bn: "বিএসইসি বা বাংলাদেশ ব্যাংকের তালিকায় নাম আছে", en: "Named on BSEC's or Bangladesh Bank's list" },
            { bn: "নিবন্ধন আছে, কিন্তু ভিন্ন কাজের জন্য", en: "Registered, but for a different activity" },
          ],
          best: 0,
        },
        {
          label: { bn: "নতুন সদস্য আনলে", en: "For bringing new members" },
          cells: [
            { bn: "কিছু হয় না, রিটার্ন ব্যবসা থেকে আসে", en: "Nothing: the return comes from the business" },
            { bn: "আপনার রিটার্ন বেড়ে যায়", en: "Your return goes up" },
          ],
          best: 0,
        },
        {
          label: { bn: "সময়ের চাপ", en: "Time pressure" },
          cells: [
            { bn: "নেই, আপনি যতদিন খুশি ভাবতে পারেন", en: "None: think as long as you like" },
            { bn: "আজকের মধ্যে, শেষ কয়েকটা জায়গা", en: "Today only, last few places" },
          ],
          best: 0,
        },
        {
          label: { bn: "বেরিয়ে আসা", en: "Getting out" },
          cells: [
            { bn: "যেকোনো সময়, বাজারদরে", en: "Any time, at market price" },
            { bn: "মেয়াদ শেষে, বা আরও বিনিয়োগ করলে", en: "At maturity, or if you invest more" },
          ],
          best: 0,
        },
      ],
    },
    "scam-drill": {
      kind: "drill",
      title: { bn: "একবার করে ফেললে সারাজীবন কাজে দেয়", en: "Do it once, useful for life" },
      steps: [
        { text: { bn: "বিএসইসির ওয়েবসাইটে গিয়ে ব্রোকারেজ হাউসের তালিকাটা খুঁজে বের করুন", en: "Find BSEC's list of licensed brokerage houses on their site" },
          hint: { bn: "লিংকটা বুকমার্ক করে রাখুন। পরে যখন কেউ কিছু বলবে, তখন খোঁজার সময় থাকে না।", en: "Bookmark it. When somebody makes an offer later there is no time to go looking." } },
        { text: { bn: "আপনার নিজের ব্রোকারের নাম ওই তালিকায় আছে কি না দেখুন", en: "Check that your own broker is on that list" } },
        { text: { bn: "পরিবারের একজনকে তিন দিনের নিয়মটা বলুন", en: "Tell one person in your family the three day rule" },
          hint: { bn: "প্রতারণা সাধারণত পরিবারের ভেতর দিয়েই ছড়ায়, তাই এই কথাটা ছড়ানোও সুরক্ষা।", en: "These things spread through families, so spreading the rule is protection too." } },
        { text: { bn: "লিখে রাখুন: টাকা দেওয়ার আগে আমি সবসময় লাইসেন্স নম্বর চাইব", en: "Write down: I will always ask for the licence number before money moves" } },
        { text: { bn: "সবচেয়ে সাম্প্রতিক কোন স্কিমটা ভেঙে পড়েছে, একবার পড়ে দেখুন", en: "Read up on the most recent scheme that collapsed" },
          hint: { bn: "প্রতিটার গল্প প্রায় একই, আর প্যাটার্নটা চিনে রাখলে পরেরটা চেনা সহজ।", en: "Every story is nearly the same, and knowing the pattern makes the next one obvious." } },
      ],
    },
    "scam-quiz": {
      kind: "quiz",
      title: { bn: "তিনটা প্রশ্ন", en: "Three questions" },
      questions: [
        {
          ask: {
            bn: "একটা স্কিম দুই বছর ধরে সবাইকে ঠিকমতো টাকা দিয়ে আসছে। এটা কী প্রমাণ করে?",
            en: "A scheme has paid everybody on time for two years. What does that prove?",
          },
          options: [
            {
              text: { bn: "প্রমাণ করে যে এটা সৎ", en: "That it is honest" },
              why: {
                bn: "না। পঞ্জি স্কিমের সংজ্ঞাই হলো নতুনদের টাকা দিয়ে পুরনোদের দেওয়া, তাই টাকা দেওয়াটা স্কিমটা চলার প্রমাণ, সৎ হওয়ার নয়। ডেসটিনি সতেরো বছর চলেছিল।",
                en: "No. The definition of a Ponzi is paying the old with the new, so payment proves the scheme is running, not that it is honest. Destiny ran for seventeen years.",
              },
            },
            {
              text: { bn: "কিছুই প্রমাণ করে না, নতুন টাকা এখনো আসছে এটুকু ছাড়া", en: "Nothing, beyond the fact that new money is still coming in" },
              right: true,
              why: {
                bn: "ঠিক। আসল প্রশ্নটা কখনো বদলায় না: টাকাটা কোথা থেকে আসছে? উত্তরটা যদি নতুন সদস্য হয়, তাহলে কত বছর ধরে চলছে সেটা অপ্রাসঙ্গিক।",
                en: "Right. The real question never changes: where is the money coming from? If the answer is new members, how long it has run is irrelevant.",
              },
            },
            {
              text: { bn: "প্রমাণ করে ব্যবসাটা লাভজনক", en: "That the business is profitable" },
              why: {
                bn: "না। টাকা বেরোনো লাভের প্রমাণ না, নগদ প্রবাহের প্রমাণ, আর সেই নগদ নতুন সদস্যদের কাছ থেকেও আসতে পারে।",
                en: "No. Money going out proves cash flow, not profit, and the cash can be coming from new members.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কোনগুলো একটা প্রস্তাব সন্দেহজনক হওয়ার নির্ভরযোগ্য সংকেত? একাধিক উত্তর ঠিক।",
            en: "Which of these reliably signal a suspicious offer? More than one is right.",
          },
          options: [
            {
              text: { bn: "নির্দিষ্ট রিটার্নের নিশ্চয়তা দেওয়া", en: "A guaranteed rate of return" },
              right: true,
              why: {
                bn: "হ্যাঁ। ব্যাংক আমানত আর সরকারি সঞ্চয়পত্র ছাড়া কোথাও নিশ্চয়তা থাকে না, আর ওই দুইটার হার সবাই জানে।",
                en: "Yes. Outside bank deposits and government certificates nothing is guaranteed, and everyone knows what those two pay.",
              },
            },
            {
              text: { bn: "নতুন সদস্য আনলে আপনার রিটার্ন বাড়ে", en: "Your return rises if you recruit" },
              right: true,
              why: {
                bn: "হ্যাঁ, আর এটা একাই যথেষ্ট। রিটার্ন যদি সদস্য সংখ্যার সঙ্গে বাড়ে, রিটার্নের উৎস সদস্যরাই।",
                en: "Yes, and this one alone is enough. If the return grows with the membership, the members are the source of the return.",
              },
            },
            {
              text: { bn: "প্রস্তাবটা পরিচিত কারো কাছ থেকে এসেছে", en: "The offer came from someone you know" },
              why: {
                bn: "এটা সংকেত না, কারণ বেশিরভাগ সৎ পরামর্শও পরিচিতদের কাছ থেকেই আসে। তবে পরিচিত মানুষ সন্দেহ কমিয়ে দেয় বলে প্রতারণা এই পথটাই বেছে নেয়। মানুষটাকে না, প্রস্তাবটাকে যাচাই করুন।",
                en: "Not a signal in itself, since most honest advice also comes from people you know. But familiarity lowers suspicion, which is why frauds travel that way. Check the offer, not the person.",
              },
            },
            {
              text: { bn: "সিদ্ধান্ত নিতে চাপ দেওয়া হচ্ছে", en: "You are being hurried into a decision" },
              right: true,
              why: {
                bn: "হ্যাঁ। ভাবার সময় দিলে মানুষ প্রশ্ন করে, আর প্রশ্ন প্রতারণার শত্রু। তাই তিন দিন অপেক্ষা করাই সবচেয়ে সস্তা সুরক্ষা।",
                en: "Yes. Given time people ask questions, and questions are a fraud's enemy. Waiting three days is the cheapest protection there is.",
              },
            },
          ],
        },
        {
          ask: {
            bn: "কেউ বলছেন তাদের কোম্পানি সরকারি নিবন্ধনপ্রাপ্ত, তাই নিরাপদ। এতে কী সমস্যা?",
            en: "Someone says their company is government registered, so it is safe. What is wrong with that?",
          },
          options: [
            {
              text: { bn: "কোনো সমস্যা নেই, নিবন্ধনই যথেষ্ট", en: "Nothing: registration is enough" },
              why: {
                bn: "না। যৌথ মূলধন কোম্পানি হিসেবে নিবন্ধন নেওয়া একটা প্রশাসনিক কাজ, যেকোনো ব্যবসা করে। বিনিয়োগ নেওয়ার অনুমতি একদম আলাদা জিনিস, আর সেটা দেয় বিএসইসি বা বাংলাদেশ ব্যাংক।",
                en: "No. Registering as a company is an administrative step any business takes. Permission to take investment money is a different thing entirely, and it comes from BSEC or Bangladesh Bank.",
              },
            },
            {
              text: { bn: "কোম্পানি হিসেবে নিবন্ধন আর বিনিয়োগ নেওয়ার লাইসেন্স এক জিনিস নয়", en: "Company registration and a licence to take investments are not the same thing" },
              right: true,
              why: {
                bn: "ঠিক, আর প্রায় প্রতিটা বড় প্রতারণা এই বিভ্রান্তিটাই ব্যবহার করেছে: একটা বৈধ নিবন্ধন সনদ দেখিয়ে এমন কাজের অনুমতি দাবি করা যা ওই সনদ দেয় না। নির্দিষ্ট কাজের লাইসেন্স নম্বরটা চান।",
                en: "Right, and nearly every large fraud has used this confusion: showing a genuine registration certificate to claim a permission it does not grant. Ask for the licence number for the specific activity.",
              },
            },
            {
              text: { bn: "সরকারি নিবন্ধন বলে কিছু নেই", en: "There is no such thing as government registration" },
              why: {
                bn: "আছে, আর সেটাই সমস্যাটাকে বিভ্রান্তিকর করে তোলে। কাগজটা আসল হতে পারে; প্রশ্নটা হলো কাগজটা কী অনুমতি দেয়।",
                en: "There is, which is what makes the confusion work. The certificate can be genuine; the question is what it permits.",
              },
            },
          ],
        },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"where-next": {
  bn: `
<p>হাতেখড়ি শেষ। এই এগারোটা লেখা পড়ে আর কাজগুলো করে ফেললে আপনার এখন যা আছে তা অনেকের দশ বছরেও হয় না: একটা লক্ষ্য, একটা জরুরি তহবিল, একটা বিও অ্যাকাউন্ট, একটা প্রথম কেনাকাটা, আর সবচেয়ে গুরুত্বপূর্ণ, একটা নিয়ম।</p>

<p>এবার প্রশ্ন হলো এরপর কী। উত্তরটা নির্ভর করে আপনি কী হতে চান তার ওপর, আর এই পাঠশালায় তিনটা পথ খোলা আছে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>এখানেই থেমে গিয়ে নিয়ম চালিয়ে যাওয়া একটা সম্পূর্ণ বৈধ পথ।</li>
<li>পর্যায় ১ শব্দগুলো শেখায়, আর ওটাই বাকি সবকিছুর ভিত্তি।</li>
<li>পর্যায় ২ বাজারটা কীভাবে চলে তা শেখায়।</li>
<li>পর্যায় ৩ শেখায় নিজে একটা কোম্পানি যাচাই করা।</li>
<li>তাড়াহুড়া করার কিছু নেই। প্রতিটা পর্যায় আগেরটার ওপর দাঁড়ানো।</li>
</ul>
</div>

<h2>প্রথমে একটা সৎ কথা</h2>

<p>এখানেই থেমে যাওয়া একটা খারাপ সিদ্ধান্ত নয়। যদি আপনি প্রতি মাসে একটা ভালো ফান্ডে নির্দিষ্ট টাকা রাখেন, বছরে একবার পুনর্বিন্যাস করেন, আর বাকি সময় হিসাব না দেখেন, তাহলে আপনি বাংলাদেশের অধিকাংশ বিনিয়োগকারীর চেয়ে ভালো করবেন। এতে কোনো বিদ্রূপ নেই, এটা সত্যি।</p>

<p>বাকি পর্যায়গুলো তাদের জন্য যারা আরও কিছু চান: হয় নিজে বেছে নেওয়ার ক্ষমতা, নয় এই বিষয়টা নিয়ে কাজ করার ইচ্ছা, নয় কেবল বোঝার আনন্দ।</p>

<h2>সিঁড়িটা</h2>

${mount("ladder-steps")}

<h2>কোন পর্যায় কার জন্য</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>পর্যায়</th><th>কী শিখবেন</th><th>শেষে যা পারবেন</th></tr>
</thead>
<tbody>
<tr><td>পর্যায় ১, শব্দগুলো শিখুন</td><td>বাজারের ছাব্বিশটা শব্দ, প্রতিটার আলাদা লেখা</td><td>একটা সংবাদ প্রতিবেদন পড়ে বুঝবেন</td></tr>
<tr><td>পর্যায় ২, বাজারটা পড়তে শিখুন</td><td>দাম কেন নড়ে, কে কী করে, অ্যাপে কী দেখবেন</td><td>একটা দাম দেখে বুঝবেন কেন ওটা ওখানে</td></tr>
<tr><td>পর্যায় ৩, নিজে যাচাই করুন</td><td>হিসাব পড়া, অনুপাত, দাম বসানো, সিদ্ধান্ত</td><td>একটা কোম্পানি নিয়ে নিজের যুক্তি দাঁড় করাবেন</td></tr>
</tbody>
</table>
</div>

<div class="side-note">
<p class="side-note-label">কত সময় লাগবে</p>
<p>পর্যায় ১ ছাব্বিশটা ছোট লেখা, প্রতিটা দশ থেকে তেরো মিনিট। সপ্তাহে তিনটা করে পড়লে দুই মাসে শেষ। পর্যায় ২ আর ৩ লম্বা, আর ওগুলো এক টানে পড়ার জিনিস নয়: একটা লেখা পড়ে সেটার কাজটা করে তারপর পরেরটায় যাওয়াই আসল পদ্ধতি।</p>
</div>

<h2>যদি আপনি এই খাতে কাজ করতে চান</h2>

<p>এই পাঠশালার উপরের দিকে আরও চারটা পর্যায় আছে, আর সেগুলো বিনিয়োগকারীর জন্য নয়, পেশাদারের জন্য। মাঝারি পর্যায় ১ বিশ্ববিদ্যালয়ের কোর্সের বিষয়গুলো ধরে ধরে যায়: কর্পোরেট ফিন্যান্স, মূল্যায়ন, পোর্টফোলিও তত্ত্ব। মাঝারি পর্যায় ২ গবেষণা আর অভিসন্দর্ভ নিয়ে। মাঝারি পর্যায় ৩ চাকরির জগৎ নিয়ে: রিসার্চ অ্যানালিস্ট, ক্রেডিট, ট্রেজারি, অ্যাসেট ম্যানেজমেন্ট, কে আসলে সারাদিন কী করে। আর সবার উপরে গবেষণা স্তর।</p>

<p>ওগুলো এখনো লেখা হয়নি, আর সেটা লুকানোর কিছু নেই: ধাপগুলো ল্যাডারে আছে, "আসছে" লেখা আছে, আর যেদিন লেখা হবে সেদিন আপনার হিসাবে সেগুলো এমনিতেই দেখা যাবে। ততদিন প্রথম চারটা পর্যায়ই যথেষ্ট, কারণ ওই চারটাই একজন সাধারণ মানুষকে একজন সচেতন বিনিয়োগকারীতে বদলে দেওয়ার জন্য যথেষ্ট।</p>

<h2>যা এখনো এই সাইটে আছে</h2>

<p>পড়ার বাইরেও কিছু জিনিস আছে যা এখনই কাজে লাগে। <a class="term" href="/tools/stock">শেয়ার যাচাইয়ের টুল</a> একটা কোম্পানির সংখ্যাগুলো বসিয়ে দিলে চুয়াল্লিশটা দিক থেকে নম্বর দেয়, আর পর্যায় ৩ পড়ার পর ওটা অনেক বেশি অর্থবহ হয়ে ওঠে। <a class="term" href="/tools">টুলের পাতায়</a> চক্রবৃদ্ধি, মূল্যস্ফীতি আর ঋণের হিসাব করার আলাদা ক্যালকুলেটর আছে। আর <a class="term" href="/portfolio">কেস স্টাডিগুলো</a> দেখায় একজন বিশ্লেষক আসলে কীভাবে একটা কোম্পানির মডেল দাঁড় করান, শুরু থেকে শেষ পর্যন্ত।</p>

<h2>এই সময়ে যা করতে থাকবেন</h2>

<p>পড়া চলবে, আর তার পাশাপাশি নিয়মটা চলবে। এই দুইটার মধ্যে দ্বিতীয়টাই বেশি গুরুত্বপূর্ণ। যিনি সবকিছু পড়ে ফেলেছেন আর কিছু কেনেননি, তিনি যিনি কিছুই পড়েননি আর প্রতি মাসে ফান্ড কিনছেন তার চেয়ে পিছিয়ে থাকবেন।</p>

${mount("next-quiz")}

<h2>শুরু করুন</h2>

${mount("next-drill")}

<p>পরের পর্যায়ের প্রথম লেখাটা সবচেয়ে মৌলিক শব্দটা নিয়ে: <a class="term" href="/money/terms/share.html">শেয়ার</a>। পুরো সূচিপত্র দেখতে চাইলে <a class="term" href="/money/contents">সব বিষয় এক নজরে</a>।</p>
`,
  en: `
<p>The starter guide is done. Read these eleven lessons and do the work in them and you now have what many people do not have after ten years: a goal, an emergency fund, a BO account, a first purchase, and most importantly a rule.</p>

<p>The question is what comes next. The answer depends on what you want to become, and this school has three roads open.</p>

<div class="at-a-glance">
<p class="at-a-glance-label">At a glance</p>
<ul>
<li>Stopping here and keeping the rule going is a perfectly valid path.</li>
<li>Stage 1 teaches the vocabulary, which everything else rests on.</li>
<li>Stage 2 teaches how the market actually behaves.</li>
<li>Stage 3 teaches you to judge a company yourself.</li>
<li>There is no hurry. Each stage stands on the one before it.</li>
</ul>
</div>

<h2>An honest word first</h2>

<p>Stopping here is not a bad decision. Put a fixed amount into a decent fund every month, rebalance once a year and otherwise leave the account alone, and you will do better than most investors in Bangladesh. There is no irony in that sentence; it is simply true.</p>

<p>The remaining stages are for people who want something more: the ability to choose for themselves, an interest in working in this field, or just the pleasure of understanding it.</p>

<h2>The staircase</h2>

${mount("ladder-steps")}

<h2>Who each stage is for</h2>

<div class="table-scroll">
<table>
<thead>
<tr><th>Stage</th><th>What it teaches</th><th>What you can do at the end</th></tr>
</thead>
<tbody>
<tr><td>Stage 1, the words</td><td>Twenty-six terms, one lesson each</td><td>Read a business news report and follow it</td></tr>
<tr><td>Stage 2, reading the market</td><td>Why prices move, who does what, what the app shows</td><td>Look at a price and understand why it is there</td></tr>
<tr><td>Stage 3, judging for yourself</td><td>Statements, ratios, valuation, deciding</td><td>Build your own argument about a company</td></tr>
</tbody>
</table>
</div>

<div class="side-note">
<p class="side-note-label">How long it takes</p>
<p>Stage 1 is twenty-six short lessons of ten to thirteen minutes. Three a week finishes it in two months. Stages 2 and 3 are longer and are not meant to be read in one run: read one, do its work, then move to the next.</p>
</div>

<h2>If you want to work in this field</h2>

<p>Four more stages sit above these, and they are for professionals rather than investors. Intermediate 1 walks the university syllabus: corporate finance, valuation, portfolio theory. Intermediate 2 is research and the dissertation. Intermediate 3 is the job market: research analyst, credit, treasury, asset management, what each of them actually does all day. Above those sits the research level.</p>

<p>Those are not written yet, and there is nothing to hide about that: the rungs are on the ladder, marked as coming, and the day they are written they appear in your own progress without anything else changing. Until then the first four stages are enough, because those four are what turn an ordinary person into an informed investor.</p>

<h2>What else is already on this site</h2>

<p>There are things beyond the reading that are useful now. The <a class="term" href="/tools/stock">stock check</a> scores a company across forty-four measures once you type its numbers in, and it means a great deal more after stage 3. The <a class="term" href="/tools">tools page</a> has separate calculators for compounding, inflation and debt. And the <a class="term" href="/portfolio">case studies</a> show how an analyst actually builds a model of a company, start to finish.</p>

<h2>What keeps running while you read</h2>

<p>The reading continues and so does the rule, and of the two the rule matters more. Somebody who has read everything and bought nothing is behind somebody who has read nothing and buys a fund every month.</p>

${mount("next-quiz")}

<h2>Get going</h2>

${mount("next-drill")}

<p>The next stage opens with the most basic word of all: <a class="term" href="/money/terms/share.html">Share</a>. For the whole map, see <a class="term" href="/money/contents">the full contents</a>.</p>
`,
  blocks: {
    "ladder-steps": {
      kind: "figure",
      shape: "steps",
      title: { bn: "চারটা পর্যায়, একটার ওপর আরেকটা", en: "Four stages, each on the last" },
      parts: [
        { text: { bn: "পর্যায় ০, হাতেখড়ি", en: "Stage 0, the starter guide" }, note: { bn: "শেষ। টাকা তৈরি, অ্যাকাউন্ট খোলা, নিয়ম চালু।", en: "Done. Money ready, account open, rule running." }, tone: "good" },
        { text: { bn: "পর্যায় ১, শব্দগুলো শিখুন", en: "Stage 1, the words" }, note: { bn: "ছাব্বিশটা শব্দ। ভাষা না জানলে বাকিটা পড়া যায় না।", en: "Twenty-six terms. Without the language the rest cannot be read." }, tone: "lead" },
        { text: { bn: "পর্যায় ২, বাজারটা পড়তে শিখুন", en: "Stage 2, reading the market" }, note: { bn: "দাম কেন নড়ে, আর কে কী নিয়ন্ত্রণ করে।", en: "Why prices move, and who controls what." } },
        { text: { bn: "পর্যায় ৩, নিজে যাচাই করুন", en: "Stage 3, judging for yourself" }, note: { bn: "হিসাব পড়া থেকে সিদ্ধান্ত লেখা পর্যন্ত।", en: "From reading statements to writing a decision." } },
      ],
      caption: {
        bn: "উপরের দিকে যাওয়া বাধ্যতামূলক নয়। প্রথম ধাপে দাঁড়িয়ে থাকাও একটা সম্পূর্ণ উত্তর।",
        en: "Climbing is not compulsory. Standing on the first step is a complete answer too.",
      },
    },
    "next-quiz": {
      kind: "quiz",
      title: { bn: "একটা প্রশ্ন, নিজের কাছে", en: "One question, to yourself" },
      questions: [
        {
          ask: {
            bn: "হাতেখড়ি শেষে যদি একটামাত্র জিনিস চালু থাকে, সেটা কী হওয়া উচিত?",
            en: "If only one thing survives the starter guide, what should it be?",
          },
          options: [
            {
              text: { bn: "যে শেয়ারটা কিনেছেন সেটা", en: "The share you bought" },
              why: {
                bn: "একটা কেনা একটা ঘটনা, অভ্যাস নয়। যিনি একবার কিনে থেমে যান, তিনি দশ বছরে ওই একবারের ফলাফলই পান।",
                en: "One purchase is an event, not a habit. Buy once and stop and ten years later you have the result of that one day.",
              },
            },
            {
              text: { bn: "মাসিক নিয়মটা", en: "The monthly rule" },
              right: true,
              why: {
                bn: "ঠিক। বাকি সবকিছু, শব্দ শেখা, কোম্পানি যাচাই, দাম বসানো, ওই নিয়মটার কার্যকারিতা বাড়ায়। কিন্তু নিয়মটা না চললে বাকিটা তত্ত্ব হয়ে থাকে। পড়া চলুক, আর নিয়মটা চলতে থাকুক।",
                en: "Right. Everything else, the vocabulary, judging companies, valuation, makes that rule work better. Without the rule the rest stays theory. Keep reading, and keep the rule running.",
              },
            },
            {
              text: { bn: "বাজারের খবর নিয়মিত দেখা", en: "Following the market news" },
              why: {
                bn: "খবর দেখা প্রায় কোনো মূল্য যোগ করে না আর ক্ষতি করে অনেক। মেক-এ-রুল লেখাটায় দেখা গেছে যত ঘন ঘন দেখা হয় তত বেশি আতঙ্কে বেচার সম্ভাবনা।",
                en: "Following the news adds almost nothing and costs a lot. The rule lesson showed that the more often you look, the more likely a panic sale becomes.",
              },
            },
          ],
        },
      ],
    },
    "next-drill": {
      kind: "drill",
      title: { bn: "পরের দুই মাসের পরিকল্পনা", en: "A plan for the next two months" },
      steps: [
        { text: { bn: "সপ্তাহে তিনটা লেখা পড়ার একটা দিন ঠিক করুন", en: "Pick a day of the week to read three lessons" },
          hint: { bn: "শুক্রবার সকাল বা রাতের এক ঘণ্টা। দিনটা ঠিক থাকলে অভ্যাসটা টেকে।", en: "Friday morning, or an hour at night. A fixed day is what makes it survive." } },
        { text: { bn: "পর্যায় ১ এর প্রথম লেখাটা এখনই খুলুন", en: "Open the first lesson of stage 1 now" } },
        { text: { bn: "নিশ্চিত করুন মাসিক ট্রান্সফারটা এখনো চালু আছে", en: "Confirm the monthly transfer is still running" } },
        { text: { bn: "আপনার লেখা লক্ষ্যের কাগজটা আরেকবার পড়ুন", en: "Read your written goals once more" },
          hint: { bn: "কিছু বদলেছে কি না দেখুন। বদলালে কাগজটা হালনাগাদ করুন, মাথায় রাখবেন না।", en: "See whether anything changed. If it has, update the paper rather than your memory." } },
      ],
    },
  },
},
};
