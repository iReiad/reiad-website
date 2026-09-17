/* ============================================================
   11-perfect.ts: পর্ব ১১, have + V3: সেতু-কাল আর অতীতের আগের অতীত.

   One part of the grammar term, gathered into the rung by
   `middle.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>পর্ব ৭-এর টাইম মেশিনে বারোটা ঘর ছিল, আর আমরা ছয়টায় ঢুকেছিলাম। বাকি ছয়টার চাবি একটা শব্দ: <span lang="en">have</span>। <span lang="en">have + ক্রিয়ার তৃতীয় রূপ</span>, আর একটা কাল তৈরি যেটার নাম <span lang="en">perfect</span>। বাংলায় এর আলাদা রূপ নেই বলেই বাংলাভাষীরা এটা এড়িয়ে যায়, আর ঠিক এই কারণেই এটা শিখলে ইংরেজি হঠাৎ "শিক্ষিত" শোনায়।</p>

<p><span lang="en">perfect</span> মানে "নিখুঁত" নয়। এখানে মানে "শেষ হয়েছে, আর তার ছাপ এখনো আছে"। <span lang="en">I have eaten</span>: খেয়েছি, তাই এখন ক্ষুধা নেই। <span lang="en">I ate</span>: খেয়েছিলাম, একটা অতীত ঘটনা, ব্যস। একটা সেতু, একটা দ্বীপ। এই পর্বে তিনটা সেতু, সেতুর সাথের শব্দগুলো (<span lang="en">since, for, already, yet, just, ever</span>), সেতু আর দ্বীপের পাশাপাশি তুলনা, <span lang="en">have been -ing</span>, আর পরীক্ষার <span lang="en">right form</span>-এর সেই অর্ধেক যেটা এখানে বসে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ক্রিয়ার তিন রূপ: <span lang="en">eat, ate, eaten</span>। তৃতীয়টার নাম V3 বা <span lang="en">past participle</span>। perfect-এ সবসময় V3।</li>
<li><span lang="en">present perfect: have/has + V3</span>। অতীতে শুরু, এখনের সাথে যোগ। <span lang="en">I have finished.</span></li>
<li><span lang="en">past perfect: had + V3</span>। অতীতের আগের অতীত। <span lang="en">I had finished before he came.</span></li>
<li><span lang="en">future perfect: will have + V3</span>। ভবিষ্যতের একটা সময়ের আগেই শেষ। <span lang="en">I will have finished by five.</span></li>
<li>সাথে যে শব্দগুলো থাকে: <span lang="en">already, yet, just, ever, never, since, for</span>।</li>
<li>বন্ধ সময়ের শব্দের সাথে (<span lang="en">yesterday, ago, in 2007</span>) কখনো present perfect নয়: সেতু নয়, দ্বীপ।</li>
</ul>
</div>

${mount("perfect-pattern")}

${mount("perfect-timeline")}

<h2>present perfect: সেতু-কাল</h2>

<p>তিনটা কাজে লাগে, আর তিনটাই "এখনের সাথে যোগ"।</p>

<ol class="step-list">
<li><strong>এইমাত্র হলো, ফল এখনো আছে।</strong> <span lang="en">Rafi has broken the window.</span> জানালা এখনো ভাঙা। <span lang="en">I have lost my keys.</span> এখনো পাচ্ছি না। সাথে <span lang="en">just, already, yet</span>: <span lang="en">She has just left. I have already eaten. Have you finished yet?</span></li>
<li><strong>জীবনের অভিজ্ঞতা, কবে তা বলা নেই।</strong> <span lang="en">I have seen the Taj Mahal.</span> কবে, সেটা বলছি না, শুধু যে দেখেছি। সাথে <span lang="en">ever, never</span>: <span lang="en">Have you ever met Shakib? I have never been to Sylhet.</span></li>
<li><strong>অতীতে শুরু, এখনো চলছে।</strong> <span lang="en">Nanu has lived in this house for forty years.</span> এখনো থাকেন। <span lang="en">since</span> + শুরুর বিন্দু, <span lang="en">for</span> + কতক্ষণ: <span lang="en">since 1985, for forty years</span>।</li>
</ol>

<p>সবচেয়ে বড় নিয়ম: <strong>শেষ হয়ে যাওয়া সময়ের শব্দের সাথে present perfect বসে না।</strong> <span lang="en">yesterday, last week, in 2007, ago</span> দেখলে past simple। <span lang="en">I have seen him yesterday</span> ভুল, <span lang="en">I saw him yesterday</span> ঠিক। সময়টা বন্ধ হয়ে গেলে দ্বীপ, খোলা থাকলে সেতু।</p>

<p>খোলা সময়ের শব্দগুলোও চেনো, কারণ এরা সেতু ডাকে: <span lang="en">today, this week, this year, so far, recently, lately, up to now, in my life</span>। <span lang="en">I have played three matches this week.</span> সপ্তাহটা এখনো চলছে, তাই সেতু। <span lang="en">I played three matches last week.</span> সপ্তাহটা শেষ, তাই দ্বীপ। একই কথা, একটা শব্দের তফাত।</p>

${mount("perfect-lines")}

${mount("perfect-versus")}

<h2>সেতুর সঙ্গীরা: already, yet, just, ever, never</h2>

<p>এই ছোট শব্দগুলো সেতুর সাথে বসে, আর প্রতিটার নিজের জায়গা আছে। <span lang="en">just</span> (এইমাত্র), <span lang="en">already</span> (এরই মধ্যে), <span lang="en">ever</span> (কখনো, প্রশ্নে), <span lang="en">never</span> (কখনো না): <span lang="en">have</span> আর V3-র মাঝে। <span lang="en">She has just left. I have already eaten. Have you ever seen snow? I have never flown.</span> <span lang="en">yet</span> (এখনো, শুধু প্রশ্ন আর না-বাচকে): বাক্যের শেষে। <span lang="en">Has he come yet? He has not come yet.</span> <span lang="en">so far, recently, lately</span>: শুরুতে বা শেষে। <span lang="en">So far we have won every match.</span></p>

<div class="table-scroll">
<table>
<thead><tr><th>শব্দ</th><th>মানে</th><th>জায়গা</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">just</span></td><td>এইমাত্র</td><td>মাঝে</td><td><span lang="en">Rafi has just scored fifty.</span></td></tr>
<tr><td><span lang="en">already</span></td><td>এরই মধ্যে, ভাবার আগেই</td><td>মাঝে</td><td><span lang="en">Mitu has already finished.</span></td></tr>
<tr><td><span lang="en">yet</span></td><td>এখনো (হয়নি / হয়েছে কি?)</td><td>শেষে, প্রশ্ন ও না-বাচকে</td><td><span lang="en">Nanu has not eaten yet.</span></td></tr>
<tr><td><span lang="en">ever</span></td><td>জীবনে কখনো</td><td>মাঝে, প্রশ্নে</td><td><span lang="en">Have you ever been to Sylhet?</span></td></tr>
<tr><td><span lang="en">never</span></td><td>জীবনে কখনো না</td><td>মাঝে</td><td><span lang="en">I have never seen snow.</span></td></tr>
<tr><td><span lang="en">since / for</span></td><td>কখন থেকে / কতক্ষণ</td><td>শেষে</td><td><span lang="en">since 2020, for two years</span></td></tr>
<tr><td><span lang="en">so far, recently, lately</span></td><td>এখন পর্যন্ত, ইদানীং</td><td>শুরুতে বা শেষে</td><td><span lang="en">I have not seen him lately.</span></td></tr>
</tbody>
</table>
</div>

${mount("perfect-adverbs")}

${mount("perfect-since")}

<h2>past perfect: অতীতের আগের অতীত</h2>

<p>নানুর গল্পে দুটো অতীত থাকে: <span lang="en">When the prince arrived, the princess had already left.</span> রাজপুত্র এল (অতীত), তার আগেই রাজকন্যা চলে গিয়েছিল (আরও আগের অতীত)। আগেরটা <span lang="en">had + V3</span>। এটা তখনই লাগে যখন দুটো অতীত ঘটনার ক্রম বোঝাতে হয়। একটা অতীত ঘটনা একা থাকলে শুধু past simple।</p>

<p>রাফির ম্যাচ: <span lang="en">By the time I reached the stadium, the match had started.</span> পৌঁছানোর আগেই শুরু। <span lang="en">He was sad because he had missed the first over.</span> মিস করা আগে, দুঃখ পরে।</p>

<p>past perfect-এর সঙ্গী শব্দগুলো: <span lang="en">before, after, when, by the time, as soon as, until, because</span>। প্রতিটায় দুটো অতীত, আর প্রশ্নটা এক: কোনটা আগে? আগেরটা <span lang="en">had + V3</span>, পরেরটা past simple। <span lang="en">After Nanu had told the story, the children slept.</span> গল্প আগে, ঘুম পরে। <span lang="en">Before the rain came, we had finished the match.</span> ম্যাচ আগে, বৃষ্টি পরে। আর reported speech-এ (পর্ব ১৬) past simple এক ধাপ পিছিয়ে এই ঘরেই আসে।</p>

${mount("perfect-reveal")}

<h2>future perfect: আগেই শেষ হয়ে যাবে</h2>

<p>ভবিষ্যতের একটা বিন্দুর আগে কাজটা শেষ। <span lang="en">By 2030, Mitu will have become a doctor.</span> <span lang="en">By the time you come, I will have cooked dinner.</span> সাথে প্রায় সবসময় <span lang="en">by</span>: <span lang="en">by five, by next year, by the time</span>। পরীক্ষায় কম আসে, জীবনে ভবিষ্যৎ পরিকল্পনায় বেশি।</p>

<h2>perfect continuous: কতক্ষণ ধরে</h2>

<p><span lang="en">have been + -ing</span>। কাজটা চলছিল, এখনো চলছে, আর জোরটা "কতক্ষণ ধরে"-তে। <span lang="en">Mitu has been studying for three hours.</span> তিন ঘণ্টা ধরে, এখনো। <span lang="en">It has been raining since morning.</span> সকাল থেকে, এখনো। past-এ <span lang="en">had been -ing</span>: <span lang="en">He had been waiting for an hour when the bus came.</span></p>

<p>দুটো সেতুর পার্থক্য: <span lang="en">has been -ing</span> বলে কতক্ষণ, <span lang="en">has + V3</span> বলে কতটা বা কয়টা। <span lang="en">I have been reading for two hours.</span> (কতক্ষণ) <span lang="en">I have read fifty pages.</span> (কতটা) <span lang="en">Rafi has been bowling all afternoon.</span> <span lang="en">Rafi has taken three wickets.</span> কাজটা এখনো চলছে বা এইমাত্র থেমেছে আর তার চিহ্ন গায়ে, তাহলে <span lang="en">been -ing</span>: <span lang="en">Why are you wet? I have been swimming.</span> আর অবস্থার ক্রিয়ায় (<span lang="en">know, have, be, like</span>) কখনো <span lang="en">been -ing</span> নয়: <span lang="en">I have known him for years</span>, <span lang="en">have been knowing</span> নয়।</p>

${mount("perfect-gap")}

<h2>V3: যে দরজাটা সব ঘর খোলে</h2>

<p>তিনটা সেতুর প্রতিটায় V3, আর পর্ব ১৫-এর passive-এও V3। নিয়মিত ক্রিয়ায় V3 আর V2 এক (<span lang="en">played, played</span>), তাই ভুল হয় শুধু রেবেলে। পর্ব ৭-এর ত্রিশটার তালিকা মনে করো, আর এখানে সেই বিশটা যেগুলোর V3 আলাদা, কারণ ওগুলোতেই নম্বর যায়: <span lang="en">gone, seen, eaten, written, taken, given, spoken, broken, begun, drunk, sung, swum, done, been, known, grown, thrown, flown, chosen, forgotten</span>। <span lang="en">I have went</span> নয়, <span lang="en">I have gone</span>; <span lang="en">She has wrote</span> নয়, <span lang="en">She has written</span>।</p>

${mount("perfect-v3")}

<div class="ex"><b>Harry Potter-এর প্রথম বইয়ের প্রথম লাইনের কাছাকাছি:</b> <span lang="en">The Dursleys had everything they wanted, but they also had a secret.</span> এটা past simple, দ্বীপ। কিন্তু Hagrid যখন আসে: <span lang="en">Harry had never received a letter in his life.</span> চিঠিটা আসার আগের পুরো জীবন: past perfect। আর Harry নিজে: <span lang="en">I have never been to a wizard school.</span> জীবনের অভিজ্ঞতা, এখন পর্যন্ত: present perfect।</div>

${mount("perfect-build")}

${mount("perfect-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p><span lang="en">Right form of verbs</span>-এর যে ঘরগুলোয় <span lang="en">since, for, already, yet, just, ever, before, after, by the time</span> আছে, সেগুলো এই পর্বের। প্রতিটায় তিনটা প্রশ্ন, ক্রমে।</p>

<ol class="step-list">
<li><strong>সময়ের শব্দটা বন্ধ না খোলা?</strong> <span lang="en">yesterday, ago, last, in 2007</span>: বন্ধ, দ্বীপ, past simple। <span lang="en">since, for, already, yet, just, ever, never, so far, this week</span>: খোলা, সেতু, <span lang="en">have/has + V3</span>।</li>
<li><strong>দুটো অতীত আছে?</strong> <span lang="en">before, after, when, by the time</span> + আরেকটা past simple থাকলে আগেরটায় <span lang="en">had + V3</span>।</li>
<li><strong><span lang="en">by</span> + ভবিষ্যৎ সময়?</strong> <span lang="en">will have + V3</span>।</li>
<li><strong>কতক্ষণ ধরে, আর এখনো চলছে?</strong> <span lang="en">have been + -ing</span>, তবে অবস্থার ক্রিয়ায় নয়।</li>
<li><strong>V3 ঠিক তো?</strong> রেবেল হলে তালিকা মনে করো: <span lang="en">gone, seen, written</span>।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Rafi (play) ___ cricket since he was six. He (win) ___ many prizes so far. Last year he (score) ___ his first century. By the time the coach arrived, he (already, bat) ___ for an hour. He (practise) ___ every day this month, and by December he (become) ___ the captain.</span> উত্তর: <span lang="en">has played</span> (<span lang="en">since</span>), <span lang="en">has won</span> (<span lang="en">so far</span>), <span lang="en">scored</span> (<span lang="en">last year</span>, দ্বীপ), <span lang="en">had already batted</span> (<span lang="en">by the time</span> + <span lang="en">arrived</span>), <span lang="en">has been practising</span> (<span lang="en">this month</span>, চলছে), <span lang="en">will have become</span> (<span lang="en">by December</span>)। ছয় ঘর, পাঁচ প্রশ্ন।</div>

${mount("perfect-exam")}

${mount("perfect-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Right form</span>-এ perfect চেনার শব্দ: <span lang="en">already, yet, just, ever, never, since, for, so far, recently</span> দেখলে <span lang="en">have/has + V3</span>। <span lang="en">before, after, by the time, when</span>-এর সাথে দুটো অতীত থাকলে আগেরটায় <span lang="en">had + V3</span>। <span lang="en">by + ভবিষ্যৎ সময়</span> দেখলে <span lang="en">will have + V3</span>। আর সবচেয়ে বড় কৌশল: বন্ধনীর ক্রিয়ার V3 রূপটা জানা। <span lang="en">go, went, gone; see, saw, seen; write, wrote, written; take, took, taken</span>। খাতার শেষে ত্রিশটা রেবেল তিন রূপে টুকে রাখো।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">since</span> আর <span lang="en">for</span>। <span lang="en">since</span>-এর পরে শুরুর বিন্দু: <span lang="en">since Monday, since 2020, since morning</span>। <span lang="en">for</span>-এর পরে সময়ের দৈর্ঘ্য: <span lang="en">for two days, for a week, for ages</span>। <span lang="en">since two days</span> ভুল, বাংলার "দুই দিন থেকে"-র সরাসরি অনুবাদ। ইংরেজিতে <span lang="en">for two days</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p><span lang="en">have gone</span> আর <span lang="en">have been</span>। <span lang="en">Rafi has gone to Sylhet</span>: গেছে, এখনো ওখানে, ফেরেনি। <span lang="en">Rafi has been to Sylhet</span>: গিয়েছিল, ফিরে এসেছে, অভিজ্ঞতাটা আছে। <span lang="en">Have you ever gone to Sylhet?</span> ভুল শোনায়; অভিজ্ঞতা জিজ্ঞেস করলে <span lang="en">Have you ever been to Sylhet?</span></p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>সেতু আর দ্বীপ: এক বাক্যে পার্থক্য, আর প্রতিটার তিনটা সময়ের শব্দ?</li>
<li><span lang="en">since</span> আর <span lang="en">for</span>-এর পরে কী বসে?</li>
<li><span lang="en">just, already, yet, ever, never</span>: প্রতিটার জায়গা?</li>
<li>দুটো অতীতের বাক্যে কোনটা <span lang="en">had</span> নেয়?</li>
<li><span lang="en">has been -ing</span> আর <span lang="en">has + V3</span>: কতক্ষণ না কতটা?</li>
<li>বিশটা রেবেল V3 না দেখে?</li>
</ul>
</div>

${mount("perfect-drill")}
`,
  blocks: {
    "perfect-pattern": {
      kind: "pattern",
      title: { bn: "have-এর তিন সেতু", en: "The three bridges of have" },
      shape: "have / has + V3  ·  had + V3  ·  will have + V3",
      why: { bn: "একই মেশিন তিন সময়ে। have-এর কালটা বলে সেতুটা কোথায় দাঁড়িয়ে: এখন (have), অতীতে (had), ভবিষ্যতে (will have)। V3 কখনো বদলায় না।", en: "One machine in three times. The tense of have says where the bridge stands: now (have), in the past (had), in the future (will have). V3 never changes." },
      examples: [
        { target: "I have finished my homework.", bn: "আমি আমার হোমওয়ার্ক শেষ করেছি। (এখন মুক্ত)" },
        { target: "I had finished my homework before dinner.", bn: "রাতের খাবারের আগেই আমি হোমওয়ার্ক শেষ করেছিলাম।" },
        { target: "I will have finished my homework by nine.", bn: "নয়টার মধ্যে আমি হোমওয়ার্ক শেষ করে ফেলব।" },
        { target: "Nanu has lived here since 1985.", bn: "নানু ১৯৮৫ থেকে এখানে থাকেন।" },
        { target: "Have you ever seen a live match?", bn: "তুমি কি কখনো মাঠে বসে ম্যাচ দেখেছ?" },
      ],
      tip: { bn: "yesterday, ago, last week: সময় বন্ধ, তাই সেতু নয়, দ্বীপ। past simple।", en: "Yesterday, ago, last week: the time is closed, so no bridge, an island. Past simple." },
    },
    "perfect-timeline": {
      kind: "figure",
      shape: "timeline",
      title: { bn: "সেতু, দ্বীপ, আর আগের অতীত", en: "The bridge, the island and the earlier past" },
      parts: [
        { text: { bn: "১৯৮৫: had moved", en: "1985: had moved" }, note: { bn: "আরও আগের অতীত, আরেকটা অতীতের আগে", en: "The earlier past, before another past" } },
        { text: { bn: "২০০৭: won", en: "2007: won" }, note: { bn: "দ্বীপ: হলো, শেষ, সময় বন্ধ", en: "The island: it happened, it is over, the time is closed" }, tone: "warn" },
        { text: { bn: "১৯৮৫ থেকে এখন: has lived", en: "1985 to now: has lived" }, note: { bn: "সেতু: শুরু অতীতে, এখনো চলছে", en: "The bridge: began in the past, still going" }, tone: "lead" },
        { text: { bn: "এইমাত্র: has just left", en: "Just now: has just left" }, note: { bn: "সেতু: হলো, ছাপ এখনো", en: "The bridge: done, and the mark is still here" }, tone: "good" },
        { text: { bn: "আগামী জুন: will have finished", en: "Next June: will have finished" }, note: { bn: "ভবিষ্যতের বিন্দুর আগেই শেষ", en: "Finished before a future point" } },
      ],
      caption: { bn: "একটা রেখা, বাঁয়ে অতীত, ডানে ভবিষ্যৎ। সেতু সবসময় এখনকে ছোঁয়; দ্বীপ ছোঁয় না।", en: "One line, past on the left, future on the right. A bridge always touches now; an island never does." },
    },
    "perfect-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: সেতু আর দ্বীপ", en: "Listen, say: the bridge and the island" },
      note: { bn: "প্রতিটা জোড়ায় একই কাজ: একবার এখনের সাথে যোগ, একবার শেষ হয়ে যাওয়া সময়ে।", en: "Each pair is the same action: once joined to now, once in a finished time." },
      lines: [
        { target: "I have lost my pen. I lost my pen yesterday.", bn: "আমি কলমটা হারিয়ে ফেলেছি (এখনো নেই)। আমি কাল কলমটা হারিয়েছিলাম।" },
        { target: "She has visited Cox's Bazar twice. She visited it in 2022.", bn: "সে দুবার কক্সবাজার গেছে। সে ২০২২-এ গিয়েছিল।" },
        { target: "Rafi has just scored fifty. He scored fifty last week too.", bn: "রাফি এইমাত্র পঞ্চাশ করল। গত সপ্তাহেও করেছিল।" },
        { target: "We have known each other for ten years.", bn: "আমরা দশ বছর ধরে একে অপরকে চিনি।" },
        { target: "Have you eaten yet? No, not yet.", bn: "খেয়েছ? না, এখনো না।" },
        { target: "I have played three matches this week, and two last week.", bn: "এই সপ্তাহে তিনটা ম্যাচ খেলেছি, আর গত সপ্তাহে দুটো।" },
      ],
    },
    "perfect-versus": {
      kind: "compare",
      title: { bn: "সেতু পাশে দ্বীপ", en: "The bridge beside the island" },
      note: { bn: "present perfect আর past simple, সারি ধরে। ডান দিকের কলামটা বাংলাভাষীর প্রিয় ভুলের জায়গা।", en: "Present perfect and past simple, row by row. The right column is where Bangla speakers slip most." },
      columns: [
        { bn: "present perfect: সেতু", en: "present perfect: the bridge" },
        { bn: "past simple: দ্বীপ", en: "past simple: the island" },
      ],
      rows: [
        { label: { bn: "রূপ", en: "Form" }, cells: [{ bn: "have / has + V3", en: "have / has + V3" }, { bn: "V2", en: "V2" }] },
        { label: { bn: "সময়", en: "Time" }, cells: [{ bn: "কবে বলা নেই, বা এখনো চলছে", en: "when is unsaid, or still going" }, { bn: "কবে বলা আছে, আর শেষ", en: "when is stated, and over" }] },
        { label: { bn: "সঙ্গী শব্দ", en: "Signal words" }, cells: [{ bn: "since, for, already, yet, just, ever, never, so far, this week", en: "since, for, already, yet, just, ever, never, so far, this week" }, { bn: "yesterday, ago, last week, in 2007, when I was six", en: "yesterday, ago, last week, in 2007, when I was six" }] },
        { label: { bn: "উদাহরণ", en: "Example" }, cells: [{ bn: "I have seen that film.", en: "I have seen that film." }, { bn: "I saw that film last night.", en: "I saw that film last night." }] },
        { label: { bn: "প্রশ্ন", en: "Question" }, cells: [{ bn: "Have you ever been to Sylhet?", en: "Have you ever been to Sylhet?" }, { bn: "Did you go to Sylhet last year?", en: "Did you go to Sylhet last year?" }] },
        { label: { bn: "বাংলার ফাঁদ", en: "The Bangla trap" }, cells: [{ bn: "বাংলায় 'দেখেছি' দুটোতেই, তাই সময়ের শব্দ দেখো", en: "Bangla says the same word for both, so look at the time word" }, { bn: "yesterday-র সাথে কখনো have নয়", en: "never have with yesterday" }] },
      ],
    },
    "perfect-adverbs": {
      kind: "gap",
      title: { bn: "just, already, yet, ever, never: কোথায় বসে", en: "Just, already, yet, ever, never: where they sit" },
      items: [
        { text: "Rafi has ___ scored fifty; the crowd is still cheering.", bn: "রাফি এইমাত্র পঞ্চাশ করল; দর্শকরা এখনো চেঁচাচ্ছে।", options: ["just", "yet", "since"], right: 0, why: { bn: "এইমাত্র, মাঝে: has just scored।", en: "A moment ago, in the middle: has just scored." } },
        { text: "Has Mitu finished her homework ___?", bn: "মিতু কি এখনো হোমওয়ার্ক শেষ করেনি?", options: ["already", "yet", "ever"], right: 1, why: { bn: "প্রশ্নের শেষে এখনো: yet।", en: "Still, at the end of a question: yet." } },
        { text: "Have you ___ seen a live match?", bn: "তুমি কি কখনো মাঠে বসে ম্যাচ দেখেছ?", options: ["never", "ever", "yet"], right: 1, why: { bn: "জীবনে কখনো, প্রশ্নে: ever।", en: "Ever in your life, in a question: ever." } },
        { text: "Nanu has ___ eaten, so she is not hungry.", bn: "নানু এরই মধ্যে খেয়ে নিয়েছেন, তাই ক্ষুধা নেই।", options: ["already", "yet", "for"], right: 0, why: { bn: "ভাবার আগেই হয়ে গেছে, মাঝে: has already eaten।", en: "Done sooner than expected, in the middle: has already eaten." } },
        { text: "I have ___ been on a plane.", bn: "আমি কখনো প্লেনে চড়িনি।", options: ["ever", "never", "yet"], right: 1, why: { bn: "কখনো না, মাঝে, আর আলাদা not লাগে না: have never been।", en: "Never, in the middle, and no separate not: have never been." } },
        { text: "He has not called me ___.", bn: "সে এখনো আমাকে ফোন করেনি।", options: ["already", "yet", "just"], right: 1, why: { bn: "না-বাচকের শেষে: not … yet।", en: "At the end of a negative: not … yet." } },
      ],
    },
    "perfect-since": {
      kind: "bins",
      title: { bn: "since নাকি for", en: "Since or for" },
      note: { bn: "শুরুর বিন্দু হলে since, দৈর্ঘ্য হলে for। প্রতিটা টুকরো ঠিক ঘরে ফেলো।", en: "A starting point takes since, a length takes for. Sort each phrase." },
      bins: [
        { id: "since", label: { bn: "since: কখন থেকে", en: "since: from when" } },
        { id: "for", label: { bn: "for: কতক্ষণ", en: "for: how long" } },
      ],
      items: [
        { text: { bn: "2020", en: "2020" }, bin: "since", why: { bn: "একটা বছর, শুরুর বিন্দু।", en: "A year, a starting point." } },
        { text: { bn: "two days", en: "two days" }, bin: "for", why: { bn: "একটা দৈর্ঘ্য। বাংলায় 'দুই দিন থেকে' হলেও for।", en: "A length. Bangla says from two days, but English says for." } },
        { text: { bn: "Monday", en: "Monday" }, bin: "since", why: { bn: "একটা দিন, বিন্দু।", en: "A day, a point." } },
        { text: { bn: "ages", en: "ages" }, bin: "for", why: { bn: "for ages: অনেক দিন ধরে।", en: "For ages: a long time." } },
        { text: { bn: "this morning", en: "this morning" }, bin: "since", why: { bn: "আজ সকাল থেকে, বিন্দু।", en: "From this morning, a point." } },
        { text: { bn: "an hour", en: "an hour" }, bin: "for", why: { bn: "এক ঘণ্টা, দৈর্ঘ্য।", en: "An hour, a length." } },
        { text: { bn: "I was six", en: "I was six" }, bin: "since", why: { bn: "since + একটা পুরো বাক্যও চলে: since I was six।", en: "Since can take a whole clause: since I was six." } },
        { text: { bn: "a long time", en: "a long time" }, bin: "for", why: { bn: "দৈর্ঘ্য।", en: "A length." } },
        { text: { bn: "Eid", en: "Eid" }, bin: "since", why: { bn: "উৎসবটা একটা বিন্দু: since Eid।", en: "The festival is a point: since Eid." } },
        { text: { bn: "three weeks", en: "three weeks" }, bin: "for", why: { bn: "দৈর্ঘ্য।", en: "A length." } },
      ],
    },
    "perfect-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: কে আগে এল?", en: "Guess first: who came first?" },
      ask: { bn: "When Rafi reached the field, the match had started. আর: When Rafi reached the field, the match started. দুটো বাক্যে গল্প কি এক?", en: "When Rafi reached the field, the match had started. And: When Rafi reached the field, the match started. Do the two sentences tell the same story?" },
      choices: [
        { bn: "হ্যাঁ, একই গল্প", en: "Yes, the same story" },
        { bn: "না: প্রথমটায় রাফি দেরি করেছে, দ্বিতীয়টায় ঠিক সময়ে", en: "No: in the first Rafi is late, in the second he is on time" },
        { bn: "না: প্রথমটায় ম্যাচ পরে শুরু হয়েছে", en: "No: in the first the match started later" },
      ],
      answer: { bn: "না। প্রথমটায় রাফি পৌঁছানোর আগেই ম্যাচ শুরু, রাফি দেরি করেছে। দ্বিতীয়টায় রাফি পৌঁছাল আর তখনই ম্যাচ শুরু হলো।", en: "No. In the first, the match had begun before Rafi arrived: he was late. In the second, he arrived and the match began right then." },
      why: { bn: "had started বলে আরেকটা অতীতের আগে হয়ে গেছে: রাফির পৌঁছানোর আগে। started বলে দুটো একই সময়ে, বা পৌঁছানোর ঠিক পরে। একটা had, আর রাফি দেরি করা থেকে ঠিক সময়ে হয়ে গেল। এই জন্যই দুটো অতীতের বাক্যে had-টা ক্রম বলে, আর ক্রম বদলালে গল্প বদলায়।", en: "Had started says it happened before another past event: before Rafi arrived. Started says the two happened together, or one right after the other. One had, and Rafi goes from late to punctual. That is why, in a sentence with two pasts, had carries the order, and changing the order changes the story." },
    },
    "perfect-gap": {
      kind: "gap",
      title: { bn: "কোন সেতু, নাকি দ্বীপ", en: "Which bridge, or the island" },
      items: [
        { text: "Mitu ___ her homework already.", bn: "মিতু এরই মধ্যে হোমওয়ার্ক শেষ করে ফেলেছে।", options: ["finished", "has finished", "had finished"], right: 1, why: { bn: "already, আর ফলটা এখন: has finished।", en: "Already, with the result now: has finished." } },
        { text: "Bangladesh ___ the World Cup match in 2007.", bn: "বাংলাদেশ ২০০৭-এ বিশ্বকাপের ম্যাচটা জিতেছিল।", options: ["has won", "won", "had won"], right: 1, why: { bn: "in 2007: বন্ধ সময়, দ্বীপ। past simple: won।", en: "In 2007 is a closed time, an island. Past simple: won." } },
        { text: "When we arrived, the film ___.", bn: "আমরা যখন পৌঁছালাম, সিনেমাটা শুরু হয়ে গিয়েছিল।", options: ["started", "has started", "had started"], right: 2, why: { bn: "দুটো অতীত, আর শুরুটা আগে: had started।", en: "Two pasts, and the start came first: had started." } },
        { text: "Nanu ___ in this house since 1985.", bn: "নানু ১৯৮৫ থেকে এই বাড়িতে থাকেন।", options: ["lives", "has lived", "lived"], right: 1, why: { bn: "since, আর এখনো থাকেন: has lived। শুরু অতীতে, চলছে এখনো।", en: "Since, and she still lives there: has lived. Started in the past, still going." } },
        { text: "By next June, Rafi ___ fifteen.", bn: "আগামী জুনের মধ্যে রাফির পনেরো হয়ে যাবে।", options: ["will turn", "will have turned", "has turned"], right: 1, why: { bn: "by + ভবিষ্যৎ: ওই সময়ের আগেই শেষ, will have turned।", en: "By + a future time: finished before that point, will have turned." } },
        { text: "It ___ since morning, and it is still raining.", bn: "সকাল থেকে বৃষ্টি হচ্ছে, আর এখনো হচ্ছে।", options: ["rains", "has been raining", "rained"], right: 1, why: { bn: "কতক্ষণ ধরে, এখনো চলছে: has been raining।", en: "How long, and still going: has been raining." } },
        { text: "I ___ him for ten years, so I trust him.", bn: "আমি তাকে দশ বছর ধরে চিনি, তাই বিশ্বাস করি।", options: ["have known", "have been knowing", "knew"], right: 0, why: { bn: "know অবস্থার ক্রিয়া: have known, been -ing নয়। for, এখনো চিনি: সেতু।", en: "Know is a state verb: have known, not been -ing. For, and still true: a bridge." } },
        { text: "Why are your clothes wet? I ___ in the pond.", bn: "তোমার জামা ভেজা কেন? আমি পুকুরে সাঁতার কাটছিলাম।", options: ["have been swimming", "have swum", "swim"], right: 0, why: { bn: "এইমাত্র থেমেছে আর চিহ্ন গায়ে: have been swimming।", en: "Just stopped and the evidence is on you: have been swimming." } },
      ],
    },
    "perfect-v3": {
      kind: "match",
      title: { bn: "V1 থেকে V3", en: "From V1 to V3" },
      note: { bn: "বাঁ দিকের ক্রিয়ার সাথে ডান দিকের V3 মেলাও। সবগুলো রেবেল, আর সবগুলোর V3 আলাদা।", en: "Match each verb on the left with its V3 on the right. All are rebels, and all have a distinct V3." },
      pairs: [
        { left: { bn: "go", en: "go" }, right: { bn: "gone", en: "gone" } },
        { left: { bn: "write", en: "write" }, right: { bn: "written", en: "written" } },
        { left: { bn: "take", en: "take" }, right: { bn: "taken", en: "taken" } },
        { left: { bn: "begin", en: "begin" }, right: { bn: "begun", en: "begun" } },
        { left: { bn: "forget", en: "forget" }, right: { bn: "forgotten", en: "forgotten" } },
        { left: { bn: "choose", en: "choose" }, right: { bn: "chosen", en: "chosen" } },
        { left: { bn: "fly", en: "fly" }, right: { bn: "flown", en: "flown" } },
        { left: { bn: "be", en: "be" }, right: { bn: "been", en: "been" } },
      ],
    },
    "perfect-build": {
      kind: "build",
      title: { bn: "সেতু সাজাও", en: "Build the bridge" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো have কোথায়, V3 কোথায়, আর since, for, yet কোথায় বসল।", en: "The words are shuffled. As you build, watch where have goes, where V3 goes, and where since, for and yet land." },
      pattern: "subject + have / has / had + V3 + since / for / yet",
      lines: [
        { target: "Nanu has lived in this house since 1985.", bn: "নানু ১৯৮৫ থেকে এই বাড়িতে থাকেন।" },
        { target: "Rafi has not finished his homework yet.", bn: "রাফি এখনো হোমওয়ার্ক শেষ করেনি।" },
        { target: "I have never seen such a beautiful catch.", bn: "আমি কখনো এত সুন্দর ক্যাচ দেখিনি।" },
        { target: "The match had started before we reached the ground.", bn: "আমরা মাঠে পৌঁছানোর আগেই ম্যাচ শুরু হয়ে গিয়েছিল।" },
        { target: "Mitu has been studying for three hours.", bn: "মিতু তিন ঘণ্টা ধরে পড়ছে।" },
        { target: "By December he will have become the captain.", bn: "ডিসেম্বরের মধ্যে সে অধিনায়ক হয়ে যাবে।" },
      ],
    },
    "perfect-spot": {
      kind: "spot",
      title: { bn: "রাফির চিঠি, সেতুর ভুল", en: "Rafi's letter: the bridge mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে সেতু-দ্বীপ, since-for বা V3-র ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line with a bridge-or-island, since-or-for, or V3 mistake." },
      source: { bn: "চিঠি: নতুন স্কুলের গল্প", en: "Letter: news from the new school" },
      lines: [
        { text: { bn: "Dear Tamim, I have been at my new school for two months now.", en: "Dear Tamim, I have been at my new school for two months now." } },
        { text: { bn: "I have made many friends since I have joined.", en: "I have made many friends since I have joined." }, flag: { bn: "since-এর পরে শুরুর বিন্দু, দ্বীপ: since I joined।", en: "After since comes the starting point, an island: since I joined." } },
        { text: { bn: "Last week we have played our first match.", en: "Last week we have played our first match." }, flag: { bn: "last week বন্ধ সময়: we played।", en: "Last week is a closed time: we played." } },
        { text: { bn: "By the time I reached the ground, the toss had already happened.", en: "By the time I reached the ground, the toss had already happened." } },
        { text: { bn: "I have took three wickets, and the coach was pleased.", en: "I have took three wickets, and the coach was pleased." }, flag: { bn: "have-এর পরে V3: have taken। আর একই সময়ের গল্পে took ভালো।", en: "V3 after have: have taken. And in a story of that day, took fits better." } },
        { text: { bn: "I have been playing every day since then.", en: "I have been playing every day since then." } },
        { text: { bn: "Have you ever gone to a real stadium? Write soon.", en: "Have you ever gone to a real stadium? Write soon." }, flag: { bn: "অভিজ্ঞতা জিজ্ঞেস করলে been: Have you ever been to।", en: "Asking about experience takes been: Have you ever been to." } },
      ],
    },
    "perfect-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "The patient ___ before the doctor ___. কোন জোড়া?", en: "The patient ___ before the doctor ___. Which pair?" },
          options: [
            { text: { bn: "died, came", en: "died, came" }, why: { bn: "না। দুটো অতীত আর আগেরটা মারা যাওয়া: had died।", en: "No. Two pasts, and the dying came first: had died." } },
            { text: { bn: "had died, came", en: "had died, came" }, right: true, why: { bn: "হ্যাঁ। before দিয়ে ক্রম: আগেরটা had + V3, পরেরটা past simple।", en: "Yes. Before gives the order: the earlier one is had + V3, the later one past simple." } },
            { text: { bn: "had died, had come", en: "had died, had come" }, why: { bn: "না। দুটোতেই had দিলে কোনটা আগে বোঝা যায় না। পরেরটা past simple।", en: "No. Had on both hides which came first. The later one is past simple." } },
          ],
        },
        {
          ask: { bn: "I ___ him ___ two years, since we moved here. কোন জোড়া?", en: "I ___ him ___ two years, since we moved here. Which pair?" },
          options: [
            { text: { bn: "know, since", en: "know, since" }, why: { bn: "না। দুই বছর একটা দৈর্ঘ্য: for। আর অতীত থেকে এখন, সেতু: have known।", en: "No. Two years is a length: for. And from past to now, a bridge: have known." } },
            { text: { bn: "have known, for", en: "have known, for" }, right: true, why: { bn: "হ্যাঁ। সেতু, অবস্থার ক্রিয়া, তাই have known; দৈর্ঘ্যে for।", en: "Yes. A bridge with a state verb, so have known; a length takes for." } },
            { text: { bn: "have been knowing, for", en: "have been knowing, for" }, why: { bn: "না। know অবস্থার ক্রিয়া, been -ing নেয় না।", en: "No. Know is a state verb and never takes been -ing." } },
          ],
        },
        {
          ask: { bn: "Change into present perfect: Nanu told this story many times. সঙ্গে কী বদলাবে?", en: "Change into present perfect: Nanu told this story many times. What else changes?" },
          options: [
            { text: { bn: "Nanu has told this story many times.", en: "Nanu has told this story many times." }, right: true, why: { bn: "হ্যাঁ। told হয় has told; many times খোলা সময়, তাই থাকে।", en: "Yes. Told becomes has told; many times is open time, so it stays." } },
            { text: { bn: "Nanu has telled this story many times.", en: "Nanu has telled this story many times." }, why: { bn: "না। tell রেবেল: told, V2 আর V3 এক।", en: "No. Tell is a rebel: told, with V2 and V3 the same." } },
            { text: { bn: "Nanu had told this story many times.", en: "Nanu had told this story many times." }, why: { bn: "না। had হলো past perfect; present perfect-এ has।", en: "No. Had is past perfect; present perfect takes has." } },
          ],
        },
        {
          ask: { bn: "Rafi is not here. He ___ to the market. আর: Rafi ___ to the market twice this week. কোন জোড়া?", en: "Rafi is not here. He ___ to the market. And: Rafi ___ to the market twice this week. Which pair?" },
          options: [
            { text: { bn: "has gone, has been", en: "has gone, has been" }, right: true, why: { bn: "হ্যাঁ। has gone: গেছে, এখনো ফেরেনি। has been: গিয়ে ফিরে এসেছে, দুবার।", en: "Yes. Has gone: he went and is still away. Has been: he went and came back, twice." } },
            { text: { bn: "has been, has gone", en: "has been, has gone" }, why: { bn: "উল্টো। এখানে নেই মানে gone; দুবার গিয়ে ফেরা মানে been।", en: "Backwards. Not here means gone; two finished trips mean been." } },
            { text: { bn: "went, went", en: "went, went" }, why: { bn: "না। এখনের সাথে যোগ, আর this week খোলা: সেতু।", en: "No. Both join now, and this week is open: bridges." } },
          ],
        },
      ],
    },
    "perfect-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "I have seen that film last night. কী ভুল?", en: "I have seen that film last night. What is wrong?" },
          options: [
            { text: { bn: "seen ভুল, see হবে", en: "Seen is wrong; it should be see" }, why: { bn: "না। have-এর পরে V3 ঠিক আছে। সমস্যা অন্য জায়গায়।", en: "No. V3 after have is right. The problem is elsewhere." } },
            { text: { bn: "last night বন্ধ সময়, তাই have seen নয়, saw", en: "Last night is a closed time, so not have seen but saw" }, right: true, why: { bn: "হ্যাঁ। শেষ হয়ে যাওয়া সময়ের শব্দের সাথে present perfect বসে না। I saw that film last night.", en: "Yes. Present perfect never sits with a finished time word. I saw that film last night." } },
            { text: { bn: "কিছুই ভুল নেই", en: "Nothing is wrong" }, why: { bn: "না। last night আর have seen একসাথে বসে না। দ্বীপে সেতু বানানো যায় না।", en: "No. Last night and have seen cannot share a sentence. You cannot build a bridge on an island." } },
          ],
        },
        {
          ask: { bn: "I have been reading for two hours. I have read fifty pages. দুটোর পার্থক্য?", en: "I have been reading for two hours. I have read fifty pages. The difference?" },
          options: [
            { text: { bn: "প্রথমটা কতক্ষণ, দ্বিতীয়টা কতটা", en: "The first says how long, the second how much" }, right: true, why: { bn: "হ্যাঁ। been -ing সময়ের দৈর্ঘ্যে জোর, V3 ফলাফলে।", en: "Yes. Been -ing stresses the stretch of time, V3 the result." } },
            { text: { bn: "প্রথমটা অতীত, দ্বিতীয়টা বর্তমান", en: "The first is past, the second present" }, why: { bn: "না। দুটোই সেতু, দুটোই এখনকে ছোঁয়।", en: "No. Both are bridges and both touch now." } },
            { text: { bn: "কোনো পার্থক্য নেই", en: "No difference" }, why: { bn: "আছে: একটা বলে ঘড়ির কথা, অন্যটা পাতার সংখ্যা।", en: "There is: one talks about the clock, the other about the page count." } },
          ],
        },
      ],
    },
    "perfect-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "আজ এখন পর্যন্ত যা করেছ, পাঁচটা have + V3: I have eaten. I have read…", en: "What you have done so far today, five with have + V3: I have eaten. I have read…" } },
        { text: { bn: "জীবনে যা করেছ আর করোনি, তিনটা করে: I have never… I have already…", en: "Things you have and have not done in your life, three each: I have never… I have already…" } },
        { text: { bn: "দশটা রেবেল তিন রূপে, জোরে: go went gone, see saw seen, eat ate eaten…", en: "Ten rebels in three forms, aloud: go went gone, see saw seen, eat ate eaten…" } },
        { text: { bn: "নিজের পাঁচটা since আর পাঁচটা for: I have lived here since… I have known him for…", en: "Five of your own with since and five with for: I have lived here since… I have known him for…" } },
        { text: { bn: "একই কাজ সেতুতে আর দ্বীপে, পাঁচ জোড়া: I have visited Sylhet. I visited Sylhet in 2023.", en: "The same action as a bridge and as an island, five pairs: I have visited Sylhet. I visited Sylhet in 2023." } },
        { text: { bn: "গতকালের তিনটা ঘটনা ক্রমে, had দিয়ে: By the time I…, I had already…", en: "Three events from yesterday in order, with had: By the time I…, I had already…" } },
      ],
    },
  },
};
