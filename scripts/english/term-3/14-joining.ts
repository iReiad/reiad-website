/* ============================================================
   14-joining.ts: পর্ব ১৪, and, but, because, although: বাক্য জোড়া.

   One part of the grammar term, gathered into the rung by
   `middle.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>রাফির ইংরেজি খাতায় একটা অনুচ্ছেদ: <span lang="en">I like cricket. I play every day. I want to be a fast bowler. I practise hard.</span> সব বাক্য ঠিক। কিন্তু মিতু আপু বলে, শুনতে লাগছে ক্লাস টু-র বাচ্চার মতো। কারণ প্রতিটা বাক্য একা দাঁড়িয়ে আছে, কেউ কারও হাত ধরেনি। ইংরেজিতে বাক্য জোড়ার শব্দগুলোর নাম <span lang="en">conjunction</span>, আর ওগুলো দিলেই: <span lang="en">I like cricket, so I play every day because I want to be a fast bowler, although it is hard.</span> এক বাক্য, চারটা ভাব, একজন বড় লেখক।</p>

<p>এই পর্বে জোড়ার দুই জাত, তাদের কমার নিয়ম, জোড়া-জোড়ার শব্দ, তারপর যে জিনিসটা পরীক্ষায় আলাদা প্রশ্ন হয়ে আসে: <span lang="en">connectors</span>, বাক্যের বাইরে থেকে অনুচ্ছেদ জোড়ার শব্দ (<span lang="en">however, therefore, moreover</span>)। আর শেষে <span lang="en">simple, compound, complex</span>-এর মধ্যে বদল করার মেশিন, যেটা পর্ব ২৪-এর <span lang="en">transformation</span>-এর দ্বিতীয় বড় প্রশ্ন।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>সমান জোড়া (<span lang="en">and, but, or, so</span>): দুটো পুরো বাক্য পাশাপাশি, মাঝে কমা। <span lang="en">Rafi bowled, and Mitu batted.</span></li>
<li>অধীন জোড়া (<span lang="en">because, although, when, if, while, until, since</span>): একটা বাক্য অন্যটার উপর ঝুলে থাকে। এগুলো বাক্যের শুরুতেও বসতে পারে।</li>
<li>অধীন অংশটা আগে বসলে কমা, পরে বসলে সাধারণত কমা নয়। <span lang="en">Although it rained, we played. We played although it rained.</span></li>
<li>জোড়া-জোড়ায়: <span lang="en">both … and, either … or, neither … nor, not only … but also</span>।</li>
<li>অনুচ্ছেদ জোড়ার শব্দ (<span lang="en">However, Therefore, Moreover</span>): নতুন বাক্যের শুরুতে, বড় হাতে, পরে কমা।</li>
<li>একটা বাক্য জোড়ায় একটাই জোড়ার শব্দ: <span lang="en">Although … but</span> ভুল।</li>
</ul>
</div>

${mount("joining-pattern")}

<h2>সমান জোড়া: FANBOYS</h2>

<p>সাতটা ছোট শব্দ যারা দুটো সমান বাক্যকে পাশাপাশি রাখে: <span lang="en">for, and, nor, but, or, yet, so</span>। প্রথম অক্ষর মিলিয়ে <span lang="en">FANBOYS</span>। রোজ লাগে চারটা: <span lang="en">and</span> (যোগ), <span lang="en">but</span> (বিপরীত), <span lang="en">or</span> (বিকল্প), <span lang="en">so</span> (ফল)। দুটো পুরো বাক্য জুড়লে জোড়ার শব্দের আগে একটা কমা: <span lang="en">It rained, so the match stopped.</span> শুধু দুটো শব্দ জুড়লে কমা নয়: <span lang="en">tea and biscuits</span>।</p>

<p>বাকি তিনটাও চেনো: <span lang="en">yet</span> মানে <span lang="en">but</span>, একটু বেশি চমক (<span lang="en">He is old, yet he runs fast</span>); <span lang="en">for</span> মানে <span lang="en">because</span>, লেখার ভাষায় (<span lang="en">We stayed in, for it was raining</span>); <span lang="en">nor</span> মানে "আর … ও না", আর তার পরে বাক্য উল্টে যায় (<span lang="en">He did not come, nor did he call</span>)। শেষেরটা পর্ব ২২-এর inversion-এর প্রথম দেখা।</p>

<h2>অধীন জোড়া: কারণ, সময়, শর্ত, বিপরীত</h2>

<p>এই শব্দগুলো একটা বাক্যকে অন্যটার "অধীন" করে দেয়। <span lang="en">because it rained</span> একা দাঁড়াতে পারে না, একটা মূল বাক্য লাগে: <span lang="en">The match stopped because it rained.</span> চার দলে ভাগ:</p>

<div class="table-scroll">
<table>
<thead><tr><th>দল</th><th>শব্দ</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td>কারণ</td><td><span lang="en">because, since, as</span></td><td><span lang="en">Rafi was happy because he scored.</span></td></tr>
<tr><td>সময়</td><td><span lang="en">when, while, before, after, until, as soon as</span></td><td><span lang="en">Call me when you reach home.</span></td></tr>
<tr><td>শর্ত</td><td><span lang="en">if, unless</span></td><td><span lang="en">We will go out if it stops raining.</span></td></tr>
<tr><td>বিপরীত</td><td><span lang="en">although, though, even though, whereas</span></td><td><span lang="en">Although he was tired, he kept bowling.</span></td></tr>
<tr><td>উদ্দেশ্য</td><td><span lang="en">so that, in order that</span></td><td><span lang="en">He practises daily so that he can play in the final.</span></td></tr>
<tr><td>ফল</td><td><span lang="en">so … that, such … that</span></td><td><span lang="en">He was so tired that he fell asleep.</span></td></tr>
</tbody>
</table>
</div>

<p>এদের সুবিধা: বাক্যের শুরুতেও বসতে পারে, মাঝেও। শুরুতে বসলে অধীন অংশ শেষে একটা কমা: <span lang="en">Because it rained, the match stopped.</span> মাঝে বসলে কমা লাগে না: <span lang="en">The match stopped because it rained.</span> একই কথা, দুই সাজ।</p>

<p>শেষ দুই সারি একটা জোড়া যেটা সবাই গুলিয়ে ফেলে। <span lang="en">so that</span> উদ্দেশ্য বলে, কেন করছি: <span lang="en">I study so that I can pass.</span> পাশ করার জন্য। <span lang="en">so … that</span> ফল বলে, এত … যে: <span lang="en">I was so tired that I slept early.</span> এত ক্লান্ত যে। <span lang="en">so</span>-র পরে adjective বা adverb, <span lang="en">such</span>-এর পরে noun: <span lang="en">so hot, such a hot day</span>। পর্ব ২২-এ এই জোড়াটার পুরো খেলা।</p>

${mount("joining-sort")}

${mount("joining-lines")}

<h2>because নাকি so, although নাকি but</h2>

<p>একই সম্পর্ক দুই দিক থেকে বলা যায়। <span lang="en">because</span> কারণের আগে বসে, <span lang="en">so</span> ফলের আগে: <span lang="en">It rained, so we stayed home. We stayed home because it rained.</span> একটাই ঘটনা। <span lang="en">but</span> আর <span lang="en">although</span> দুটোই বিপরীত, কিন্তু <span lang="en">but</span> মাঝে বসে আর <span lang="en">although</span> যেকোনো জায়গায়: <span lang="en">It rained, but we played. Although it rained, we played.</span> ফাঁদ: দুটো একসাথে নয়। <span lang="en">Although it rained, but we played</span> ভুল। বাংলায় "যদিও … তবুও" দুটোই বসে, তাই বাংলাভাষী এখানে বারবার পড়ে।</p>

<p>আরেকটা জোড়া: <span lang="en">because</span> আর <span lang="en">because of</span>, <span lang="en">although</span> আর <span lang="en">in spite of / despite</span>। প্রথমটার পরে পুরো বাক্য (কর্তা আর ক্রিয়া), দ্বিতীয়টার পরে শুধু একটা noun বা <span lang="en">-ing</span>। <span lang="en">because it rained</span> কিন্তু <span lang="en">because of the rain</span>; <span lang="en">although he was tired</span> কিন্তু <span lang="en">in spite of his tiredness</span>, <span lang="en">despite being tired</span>। পরীক্ষার <span lang="en">transformation</span> ঠিক এই বদলটা চায়।</p>

${mount("joining-reveal")}

${mount("joining-versus")}

${mount("joining-gap")}

<h2>জোড়া-জোড়ার শব্দ</h2>

<p><span lang="en">both Rafi and Mitu</span> (দুজনেই), <span lang="en">either tea or coffee</span> (যেকোনো একটা), <span lang="en">neither Tamim nor Shakib</span> (কেউই না), <span lang="en">not only fast but also accurate</span> (শুধু না, বরং)। ফাঁদ: <span lang="en">neither … nor</span>-এর সাথে আরেকটা <span lang="en">not</span> নয়, কারণ <span lang="en">neither</span> নিজেই না-বাচক। <span lang="en">Neither of them didn't come</span> ভুল; <span lang="en">Neither of them came</span> ঠিক।</p>

<p>জোড়ায় জোড়ায় বসা শব্দের একটা নিয়ম: দুই দিকে একই জাতের জিনিস। <span lang="en">both cricket and football</span> (দুটো noun), <span lang="en">either play or watch</span> (দুটো ক্রিয়া), <span lang="en">not only in Dhaka but also in Sylhet</span> (দুটো জায়গা)। <span lang="en">both cricket and to play football</span> কানে বাজে, কারণ দুই দিক দুই জাতের। আর <span lang="en">either … or</span>, <span lang="en">neither … nor</span>-এ ক্রিয়া মেলে কাছের কর্তার সাথে, পর্ব ৬ মনে করো: <span lang="en">Neither Rafi nor his friends are here.</span></p>

<div class="ex"><b>Toy Story-র Buzz:</b> <span lang="en">To infinity and beyond!</span> একটা <span lang="en">and</span>। আর Woody সম্পর্কে: <span lang="en">Woody was Andy's favourite toy until Buzz arrived.</span> <span lang="en">until</span> পুরো সিনেমার গল্প বলে দেয়। Nemo-র বাবা: <span lang="en">I promised I would never let anything happen to him.</span> <span lang="en">that</span> লুকানো, কিন্তু আছে: <span lang="en">I promised (that) I would…</span> বাক্যের ভিতরে বাক্য, পর্ব ১৯-এ পুরোটা।</div>

${mount("joining-order")}

<h2>অনুচ্ছেদ জোড়ার শব্দ: however, therefore, moreover</h2>

<p><span lang="en">and, but, so</span> দুটো বাক্যকে একটা বাক্যে জোড়ে। আরেক দল শব্দ আছে যারা দুটো আলাদা বাক্যকে ভাবে জোড়ে, একটা বাক্যে নয়: নতুন বাক্যের শুরুতে বসে, বড় হাতে, পরে একটা কমা। <span lang="en">It rained all day. However, we played.</span> <span lang="en">He practised hard. Therefore, he was picked.</span> পরীক্ষায় এদের নাম <span lang="en">connectors</span> বা <span lang="en">linking words</span>, আর একটা অনুচ্ছেদে দশটা খালি ঘরে এরাই বসে।</p>

<div class="table-scroll">
<table>
<thead><tr><th>সম্পর্ক</th><th>বাক্যের ভিতরে</th><th>বাক্যের শুরুতে, কমা সহ</th></tr></thead>
<tbody>
<tr><td>যোগ</td><td><span lang="en">and</span></td><td><span lang="en">Moreover, In addition, Besides, Also, Furthermore</span></td></tr>
<tr><td>বিপরীত</td><td><span lang="en">but, yet, although</span></td><td><span lang="en">However, On the other hand, Nevertheless, Still</span></td></tr>
<tr><td>ফল</td><td><span lang="en">so</span></td><td><span lang="en">Therefore, As a result, Consequently, Thus</span></td></tr>
<tr><td>কারণ</td><td><span lang="en">because, since</span></td><td><span lang="en">This is because, For this reason</span></td></tr>
<tr><td>উদাহরণ</td><td></td><td><span lang="en">For example, For instance</span></td></tr>
<tr><td>ক্রম</td><td><span lang="en">then</span></td><td><span lang="en">First, Secondly, Next, Finally, At last</span></td></tr>
<tr><td>জোর, সত্যি</td><td></td><td><span lang="en">In fact, Actually, Indeed</span></td></tr>
<tr><td>সারাংশ</td><td></td><td><span lang="en">In short, In conclusion, To sum up</span></td></tr>
</tbody>
</table>
</div>

<p>দুটো নিয়ম। এক: এরা <span lang="en">and, but</span>-এর মতো দুটো বাক্যের মাঝে শুধু কমা দিয়ে বসে না। <span lang="en">It rained, however, we played</span> ভুল; হয় ফুল স্টপ আর নতুন বাক্য (<span lang="en">It rained. However, we played.</span>), নয় সেমিকোলন (<span lang="en">It rained; however, we played.</span>)। দুই: <span lang="en">however</span> বাক্যের মাঝেও যেতে পারে, দুই পাশে কমা: <span lang="en">We, however, played.</span> পর্ব ২৩-এ সেমিকোলনের গল্প।</p>

${mount("joining-connectors")}

<h2>তিন জাতের মধ্যে বদল: transformation-এর মেশিন</h2>

<p>পর্ব ১০-এ <span lang="en">simple, compound, complex</span> চেনা হয়েছিল। পরীক্ষা চেনা নিয়ে থামে না, বদলাতে বলে: <span lang="en">Make it complex. Make it simple.</span> একই কথা তিন গঠনে, আর প্রতিটা বদলের একটা ছোট নিয়ম:</p>

<div class="table-scroll">
<table>
<thead><tr><th>simple</th><th>compound</th><th>complex</th></tr></thead>
<tbody>
<tr><td><span lang="en">Being tired, he slept.</span></td><td><span lang="en">He was tired, so he slept.</span></td><td><span lang="en">As he was tired, he slept.</span></td></tr>
<tr><td><span lang="en">In spite of his illness, he came.</span></td><td><span lang="en">He was ill, but he came.</span></td><td><span lang="en">Though he was ill, he came.</span></td></tr>
<tr><td><span lang="en">He is too weak to walk.</span></td><td><span lang="en">He is very weak, so he cannot walk.</span></td><td><span lang="en">He is so weak that he cannot walk.</span></td></tr>
<tr><td><span lang="en">Work hard to succeed.</span></td><td><span lang="en">Work hard, or you will not succeed.</span></td><td><span lang="en">If you work hard, you will succeed.</span></td></tr>
<tr><td><span lang="en">After finishing the work, he left.</span></td><td><span lang="en">He finished the work, and then he left.</span></td><td><span lang="en">After he had finished the work, he left.</span></td></tr>
<tr><td><span lang="en">I know his name.</span></td><td><span lang="en">I know him, and I know his name.</span></td><td><span lang="en">I know what his name is.</span></td></tr>
</tbody>
</table>
</div>

<p>ছকটা পড়ার কৌশল: প্রতিটা সারিতে সম্পর্কটা এক (কারণ, বিপরীত, ফল, শর্ত, সময়), শুধু জোড়ার যন্ত্র বদলাচ্ছে। <span lang="en">simple</span>-এ জোড়ার শব্দ নেই, তার বদলে <span lang="en">-ing</span>, <span lang="en">in spite of</span>, <span lang="en">too … to</span>, <span lang="en">to</span>। <span lang="en">compound</span>-এ <span lang="en">and, but, or, so</span>। <span lang="en">complex</span>-এ <span lang="en">as, though, so … that, if, after</span>। সম্পর্কটা চেনো, তারপর সেই সারির যন্ত্রটা নাও। পর্ব ২৪-এ পুরো তালিকা।</p>

${mount("joining-transform")}

${mount("joining-build")}

${mount("joining-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>দুটো প্রশ্ন। এক: <span lang="en">connectors</span>, একটা অনুচ্ছেদ, দশটা খালি ঘর, নিচে বা উপরে শব্দের তালিকা। দুই: <span lang="en">transformation</span>, <span lang="en">simple / compound / complex</span>-এর মধ্যে বদল। প্রথমটার ধাপ:</p>

<ol class="step-list">
<li><strong>খালি ঘরের দুই পাশের বাক্য পড়ো।</strong> সম্পর্কটা কী: কারণ, ফল, বিপরীত, যোগ, উদাহরণ, ক্রম?</li>
<li><strong>ঘরটা কোথায়?</strong> বাক্যের শুরুতে, পরে কমা: <span lang="en">However, Therefore, Moreover</span>। দুটো বাক্যের মাঝে, আগে কমা: <span lang="en">and, but, so</span>। একটা অংশের শুরুতে, পরে কর্তা-ক্রিয়া: <span lang="en">because, although, if</span>।</li>
<li><strong>পরে কী আছে?</strong> পুরো বাক্য হলে <span lang="en">because, although</span>; শুধু noun হলে <span lang="en">because of, in spite of</span>।</li>
<li><strong>তালিকার শব্দ একবারই।</strong> ব্যবহার করা শব্দ কেটে দাও, নইলে একই শব্দ দুবার বসে যায়।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Rafi loves cricket. (1) ___, he practises every day. (2) ___ it rains, he practises indoors. He is fast, (3) ___ his bowling is not always accurate. (4) ___, his coach believes in him. (5) ___ his hard work, he was picked for the final. (6) ___, he took three wickets.</span> উত্তর: (১) <span lang="en">Therefore</span> (ফল, শুরুতে); (২) <span lang="en">When</span> বা <span lang="en">If</span> (সময়/শর্ত, পরে পুরো বাক্য); (৩) <span lang="en">but</span> (বিপরীত, মাঝে); (৪) <span lang="en">However</span> (বিপরীত, শুরুতে); (৫) <span lang="en">Because of</span> (কারণ, পরে noun); (৬) <span lang="en">Finally</span> বা <span lang="en">As a result</span>। ছয় ঘর, তিন প্রশ্ন।</div>

${mount("joining-exam")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Connectors</span> বা <span lang="en">linking words</span>-এর শূন্যস্থানে দুই পাশের বাক্যের সম্পর্ক জিজ্ঞেস করো: কারণ? <span lang="en">because</span>। ফল? <span lang="en">so, therefore</span>। বিপরীত? <span lang="en">but, however, although</span>। যোগ? <span lang="en">and, moreover, besides</span>। সময়? <span lang="en">when, after, before</span>। শর্ত? <span lang="en">if, unless</span>। আর শূন্যস্থান বাক্যের শুরুতে আর পরে কমা থাকলে <span lang="en">However, Moreover, Therefore</span>: বড় হাতে, কমা সহ।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">unless</span> মানে <span lang="en">if … not</span>, তাই পরে আবার <span lang="en">not</span> নয়। <span lang="en">You will fail unless you don't study</span> ভুল, উল্টো মানে। <span lang="en">You will fail unless you study</span> ঠিক: না পড়লে ফেল। আর <span lang="en">until</span> মানে "যতক্ষণ না": <span lang="en">Wait here until I come back.</span></p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p><span lang="en">despite</span> আর <span lang="en">in spite of</span>: দুটোই ঠিক, কিন্তু <span lang="en">despite of</span> বলে কিছু নেই। <span lang="en">Despite the rain, we played. In spite of the rain, we played.</span> আর দুটোর পরেই noun বা <span lang="en">-ing</span>, কখনো পুরো বাক্য নয়: <span lang="en">despite it rained</span> ভুল, <span lang="en">despite the rain</span> বা <span lang="en">although it rained</span>।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li><span lang="en">FANBOYS</span> সাতটা, আর দুটো বাক্য জোড়ার কমার নিয়ম?</li>
<li>অধীন জোড়ার ছয় দল, প্রতিটার দুটো শব্দ?</li>
<li><span lang="en">because</span> আর <span lang="en">because of</span>, <span lang="en">although</span> আর <span lang="en">in spite of</span>: পরে কী বসে?</li>
<li><span lang="en">However</span> কোথায় বসে, আর কোন চিহ্ন সহ?</li>
<li>একটা কথা <span lang="en">simple, compound, complex</span>-এ তিন ভাবে?</li>
<li><span lang="en">so that</span> আর <span lang="en">so … that</span>-এর পার্থক্য?</li>
</ul>
</div>

${mount("joining-drill")}
`,
  blocks: {
    "joining-pattern": {
      kind: "pattern",
      title: { bn: "দুই রকম জোড়া", en: "Two kinds of join" },
      shape: "SENTENCE, and / but / so SENTENCE   ·   Because / Although / When SENTENCE, SENTENCE",
      why: { bn: "and, but, so দুটো সমান বাক্যের মাঝে বসে, আগে কমা। because, although, when একটা বাক্যকে অধীন করে, আর শুরুতে বসলে শেষে কমা। একটা জোড়ায় একটাই জোড়ার শব্দ।", en: "And, but, so sit between two equal sentences with a comma before them. Because, although, when make one sentence depend on the other, and take a comma after the clause when they open. One join, one joining word." },
      examples: [
        { target: "Rafi bowled well, but the team lost.", bn: "রাফি ভালো বল করল, কিন্তু দল হারল।" },
        { target: "It was raining, so we stayed home.", bn: "বৃষ্টি হচ্ছিল, তাই আমরা বাসায় থাকলাম।" },
        { target: "Because it was raining, we stayed home.", bn: "কারণ বৃষ্টি হচ্ছিল, আমরা বাসায় থাকলাম।" },
        { target: "Although he was tired, Rafi kept practising.", bn: "যদিও সে ক্লান্ত ছিল, রাফি অনুশীলন চালিয়ে গেল।" },
        { target: "Call me when you get home.", bn: "বাসায় পৌঁছে আমাকে ফোন কোরো।" },
      ],
      tip: { bn: "Although … but: দুটো একসাথে কখনো নয়। বাংলার 'যদিও … তবুও' ইংরেজিতে একটা শব্দে।", en: "Although … but: never both. Bangla's although … yet is one word in English." },
    },
    "joining-sort": {
      kind: "bins",
      title: { bn: "সম্পর্কটা কী", en: "What is the relation" },
      note: { bn: "প্রতিটা জোড়ার শব্দ দুটো বাক্যের মধ্যে কী সম্পর্ক বলে, সেই ঘরে ফেলো।", en: "Drop each joining word into the box of the relation it makes between two sentences." },
      bins: [
        { id: "cause", label: { bn: "কারণ / ফল", en: "cause / result" } },
        { id: "contrast", label: { bn: "বিপরীত", en: "contrast" } },
        { id: "time", label: { bn: "সময়", en: "time" } },
        { id: "cond", label: { bn: "শর্ত", en: "condition" } },
        { id: "add", label: { bn: "যোগ / বিকল্প", en: "addition / choice" } },
      ],
      items: [
        { text: { bn: "because", en: "because" }, bin: "cause", why: { bn: "কারণ।", en: "A reason." } },
        { text: { bn: "although", en: "although" }, bin: "contrast", why: { bn: "যদিও, বিপরীত।", en: "Although, a contrast." } },
        { text: { bn: "as soon as", en: "as soon as" }, bin: "time", why: { bn: "যেই মাত্র, সময়।", en: "The moment that, time." } },
        { text: { bn: "unless", en: "unless" }, bin: "cond", why: { bn: "যদি না, শর্ত।", en: "If not, a condition." } },
        { text: { bn: "so", en: "so" }, bin: "cause", why: { bn: "তাই, ফল।", en: "So, a result." } },
        { text: { bn: "whereas", en: "whereas" }, bin: "contrast", why: { bn: "যেখানে অন্যদিকে, বিপরীত।", en: "Whereas, a contrast." } },
        { text: { bn: "until", en: "until" }, bin: "time", why: { bn: "যতক্ষণ না, সময়।", en: "Up to when, time." } },
        { text: { bn: "or", en: "or" }, bin: "add", why: { bn: "বিকল্প।", en: "A choice." } },
        { text: { bn: "therefore", en: "therefore" }, bin: "cause", why: { bn: "সেই কারণে, ফল।", en: "For that reason, a result." } },
        { text: { bn: "if", en: "if" }, bin: "cond", why: { bn: "যদি, শর্ত।", en: "If, a condition." } },
        { text: { bn: "moreover", en: "moreover" }, bin: "add", why: { bn: "তার উপরে, যোগ।", en: "On top of that, addition." } },
        { text: { bn: "while", en: "while" }, bin: "time", why: { bn: "যখন, সময় (কখনো বিপরীতও)।", en: "While, time (sometimes contrast too)." } },
      ],
    },
    "joining-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: একই কথা, দুই সাজে", en: "Listen, say: one idea, two arrangements" },
      lines: [
        { target: "We stayed home because it rained.", bn: "বৃষ্টি হয়েছিল বলে আমরা বাসায় থাকলাম।" },
        { target: "Because it rained, we stayed home.", bn: "কারণ বৃষ্টি হয়েছিল, আমরা বাসায় থাকলাম।" },
        { target: "I will call you when I arrive.", bn: "পৌঁছে আমি তোমাকে ফোন করব।" },
        { target: "When I arrive, I will call you.", bn: "আমি যখন পৌঁছাব, তোমাকে ফোন করব।" },
        { target: "Nanu is old, yet she walks every morning.", bn: "নানু বয়স্ক, তবু রোজ সকালে হাঁটেন।" },
        { target: "You can have either tea or coffee, not both.", bn: "তুমি চা বা কফি যেকোনো একটা পেতে পারো, দুটো নয়।" },
        { target: "It rained all day. However, we played.", bn: "সারাদিন বৃষ্টি হলো। তবু আমরা খেললাম।" },
      ],
    },
    "joining-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: একটা না দুটো?", en: "Guess first: one or two?" },
      ask: { bn: "রাফি লিখল: Although it was raining, but we played the match. মিতু আপু একটা শব্দ কাটল। কোনটা?", en: "Rafi wrote: Although it was raining, but we played the match. Mitu crossed out one word. Which?" },
      choices: [
        { bn: "Although", en: "Although" },
        { bn: "but", en: "but" },
        { bn: "যেকোনো একটা, দুটোই চলে", en: "Either; both work" },
      ],
      answer: { bn: "যেকোনো একটা। but কাটলে: Although it was raining, we played. Although কাটলে: It was raining, but we played. দুটো একসাথে কখনো নয়।", en: "Either one. Cross out but: Although it was raining, we played. Cross out Although: It was raining, but we played. Never both." },
      why: { bn: "একটা জোড়ায় একটাই জোড়ার শব্দ। Although নিজেই বিপরীতটা বলে দিচ্ছে, তাই but বাড়তি; but নিজেই বলে দিচ্ছে, তাই Although বাড়তি। বাংলায় 'যদিও বৃষ্টি হচ্ছিল, তবুও আমরা খেললাম' দুটো শব্দই বসে, আর সেই অভ্যাসটাই ইংরেজিতে চলে আসে। because-এর সাথে so-ও একই ফাঁদ: Because it rained, so we stayed ভুল।", en: "One join, one joining word. Although already carries the contrast, so but is extra; but carries it too, so Although is extra. Bangla puts both words in, and that habit walks into English. Because with so is the same trap: Because it rained, so we stayed is wrong." },
    },
    "joining-versus": {
      kind: "compare",
      title: { bn: "পুরো বাক্য, নাকি শুধু noun", en: "A whole clause, or just a noun" },
      note: { bn: "একই সম্পর্ক, দুই যন্ত্র। বাঁ দিকে পরে কর্তা আর ক্রিয়া; ডান দিকে পরে শুধু একটা noun বা -ing।", en: "The same relation, two tools. The left takes a subject and verb after it; the right takes only a noun or -ing." },
      columns: [
        { bn: "+ পুরো বাক্য", en: "+ whole clause" },
        { bn: "+ noun / -ing", en: "+ noun / -ing" },
      ],
      rows: [
        { label: { bn: "কারণ", en: "Reason" }, cells: [{ bn: "because it rained", en: "because it rained" }, { bn: "because of the rain", en: "because of the rain" }] },
        { label: { bn: "বিপরীত", en: "Contrast" }, cells: [{ bn: "although he was tired", en: "although he was tired" }, { bn: "in spite of / despite being tired", en: "in spite of / despite being tired" }] },
        { label: { bn: "সময়", en: "Time" }, cells: [{ bn: "while we were watching", en: "while we were watching" }, { bn: "during the match", en: "during the match" }] },
        { label: { bn: "শর্ত", en: "Condition" }, cells: [{ bn: "if it rains", en: "if it rains" }, { bn: "in case of rain", en: "in case of rain" }] },
        { label: { bn: "উদ্দেশ্য", en: "Purpose" }, cells: [{ bn: "so that I can pass", en: "so that I can pass" }, { bn: "in order to pass / to pass", en: "in order to pass / to pass" }] },
      ],
    },
    "joining-gap": {
      kind: "gap",
      title: { bn: "কোন জোড়ার শব্দ", en: "Which joining word" },
      items: [
        { text: "Rafi was late ___ the bus broke down.", bn: "বাস নষ্ট হয়ে যাওয়ায় রাফির দেরি হলো।", options: ["so", "because", "although"], right: 1, why: { bn: "পরের অংশটা কারণ: because।", en: "The second part is the reason: because." } },
        { text: "The bus broke down, ___ Rafi was late.", bn: "বাস নষ্ট হলো, তাই রাফির দেরি হলো।", options: ["so", "because", "but"], right: 0, why: { bn: "পরের অংশটা ফল: so। একই ঘটনা, উল্টো দিক থেকে।", en: "The second part is the result: so. The same event from the other side." } },
        { text: "___ it was hot, we played the whole match.", bn: "যদিও গরম ছিল, আমরা পুরো ম্যাচ খেললাম।", options: ["Because", "Although", "So"], right: 1, why: { bn: "বিপরীত, আর বাক্যের শুরুতে: Although। পরে কমা।", en: "A contrast at the front of the sentence: Although, with a comma after the clause." } },
        { text: "Wait here ___ I come back.", bn: "আমি ফিরে না আসা পর্যন্ত এখানে অপেক্ষা করো।", options: ["until", "unless", "while"], right: 0, why: { bn: "যতক্ষণ না: until।", en: "Up to the moment of: until." } },
        { text: "You will miss the bus ___ you hurry.", bn: "তাড়াতাড়ি না করলে তুমি বাস মিস করবে।", options: ["if", "unless", "although"], right: 1, why: { bn: "না করলে: unless = if you don't। পরে আর not নয়।", en: "If you do not: unless means if you don't, with no second not." } },
        { text: "___ Tamim nor Shakib played in that match.", bn: "তামিম বা শাকিব কেউই সেই ম্যাচে খেলেনি।", options: ["Either", "Neither", "Both"], right: 1, why: { bn: "nor-এর জোড়া neither: কেউই না, আর বাক্যে আলাদা not নেই।", en: "Nor pairs with neither: not one of them, with no separate not in the sentence." } },
        { text: "We stayed indoors ___ the heavy rain.", bn: "প্রবল বৃষ্টির কারণে আমরা ঘরে থাকলাম।", options: ["because", "because of", "although"], right: 1, why: { bn: "পরে শুধু একটা noun (the heavy rain), কর্তা-ক্রিয়া নেই: because of।", en: "Only a noun follows (the heavy rain), no subject and verb: because of." } },
        { text: "He practises daily ___ he can play in the final.", bn: "সে রোজ অনুশীলন করে যাতে ফাইনালে খেলতে পারে।", options: ["so that", "so", "such that"], right: 0, why: { bn: "উদ্দেশ্য, কেন করছে: so that। so একা হলে ফল।", en: "A purpose, why he does it: so that. So alone would give a result." } },
      ],
    },
    "joining-order": {
      kind: "order",
      title: { bn: "রাফির অনুচ্ছেদ, জোড়া লাগিয়ে", en: "Rafi's paragraph, joined up" },
      note: { bn: "এক বাক্যের টুকরোগুলো ঠিক ক্রমে সাজাও।", en: "Put the pieces of one sentence in order." },
      items: [
        { text: { bn: "Although it was hard,", en: "Although it was hard," }, why: { bn: "অধীন অংশ শুরুতে, শেষে কমা।", en: "The dependent clause opens, with its comma." } },
        { text: { bn: "Rafi practised every day", en: "Rafi practised every day" }, why: { bn: "মূল বাক্য।", en: "The main clause." } },
        { text: { bn: "because he wanted to be a fast bowler,", en: "because he wanted to be a fast bowler," }, why: { bn: "কারণ, মাঝে, কমা ছাড়া শুরু।", en: "The reason, in the middle." } },
        { text: { bn: "so the coach picked him for the final.", en: "so the coach picked him for the final." }, why: { bn: "ফল, সবার শেষে, আগে কমা।", en: "The result, last, with a comma before so." } },
      ],
    },
    "joining-connectors": {
      kind: "gap",
      title: { bn: "অনুচ্ছেদ জোড়ার শব্দ", en: "The paragraph connectors" },
      note: { bn: "ঘরটা বাক্যের শুরুতে, পরে কমা। দুই পাশের বাক্যের সম্পর্ক দেখো।", en: "The gap opens a sentence, with a comma after it. Read the relation between the two sentences." },
      items: [
        { text: "It rained all day. ___, we played the match.", bn: "সারাদিন বৃষ্টি হলো। তবু আমরা ম্যাচটা খেললাম।", options: ["However", "Therefore", "Moreover"], right: 0, why: { bn: "বিপরীত: However।", en: "A contrast: However." } },
        { text: "Rafi practised hard all year. ___, he was picked for the team.", bn: "রাফি সারা বছর কঠোর অনুশীলন করল। ফলে সে দলে সুযোগ পেল।", options: ["However", "Therefore", "For example"], right: 1, why: { bn: "ফল: Therefore।", en: "A result: Therefore." } },
        { text: "Sylhet has tea gardens. ___, it has beautiful waterfalls.", bn: "সিলেটে চা বাগান আছে। তার উপরে সুন্দর ঝর্নাও আছে।", options: ["Moreover", "Nevertheless", "Finally"], right: 0, why: { bn: "যোগ: Moreover।", en: "An addition: Moreover." } },
        { text: "Many players are good at one skill. ___, Mustafiz is a great bowler but a weak batter.", bn: "অনেক খেলোয়াড় একটা দিকে ভালো। যেমন মুস্তাফিজ দারুণ বোলার কিন্তু দুর্বল ব্যাটার।", options: ["Therefore", "For example", "In short"], right: 1, why: { bn: "উদাহরণ: For example।", en: "An example: For example." } },
        { text: "First, warm up. Then stretch. ___, start bowling.", bn: "প্রথমে গা গরম করো। তারপর স্ট্রেচ। সবশেষে বোলিং শুরু।", options: ["Finally", "However", "Besides"], right: 0, why: { bn: "ক্রমের শেষ ধাপ: Finally।", en: "The last step in order: Finally." } },
        { text: "The team was tired. ___, they refused to give up.", bn: "দলটা ক্লান্ত ছিল। তবু তারা হাল ছাড়তে রাজি হয়নি।", options: ["Nevertheless", "As a result", "In addition"], right: 0, why: { bn: "বিপরীত, জোরালো: Nevertheless।", en: "A strong contrast: Nevertheless." } },
      ],
    },
    "joining-transform": {
      kind: "match",
      title: { bn: "তিন গঠন মেলাও", en: "Match the three structures" },
      note: { bn: "বাঁ দিকে একটা complex বাক্য। ডান দিকে তার simple রূপ। সম্পর্কটা এক, যন্ত্র আলাদা।", en: "A complex sentence on the left; its simple form on the right. Same relation, different tool." },
      pairs: [
        { left: { bn: "As he was tired, he slept.", en: "As he was tired, he slept." }, right: { bn: "Being tired, he slept.", en: "Being tired, he slept." } },
        { left: { bn: "Though he was ill, he came.", en: "Though he was ill, he came." }, right: { bn: "In spite of his illness, he came.", en: "In spite of his illness, he came." } },
        { left: { bn: "He is so weak that he cannot walk.", en: "He is so weak that he cannot walk." }, right: { bn: "He is too weak to walk.", en: "He is too weak to walk." } },
        { left: { bn: "If you work hard, you will succeed.", en: "If you work hard, you will succeed." }, right: { bn: "Work hard to succeed.", en: "Work hard to succeed." } },
        { left: { bn: "After he had finished, he left.", en: "After he had finished, he left." }, right: { bn: "After finishing, he left.", en: "After finishing, he left." } },
        { left: { bn: "He studies so that he can pass.", en: "He studies so that he can pass." }, right: { bn: "He studies in order to pass.", en: "He studies in order to pass." } },
      ],
    },
    "joining-build": {
      kind: "build",
      title: { bn: "জোড়া লাগিয়ে সাজাও", en: "Build the joined sentence" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো জোড়ার শব্দটা কোথায় গেল, আর কমা কোথায়।", en: "The words are shuffled. As you build, watch where the joining word goes and where the comma sits." },
      pattern: "clause + , + and / but / so + clause  ·  Because / Although + clause + , + clause",
      lines: [
        { target: "Rafi bowled well, but the team lost.", bn: "রাফি ভালো বল করল, কিন্তু দল হারল।" },
        { target: "Although it rained, we played the whole match.", bn: "যদিও বৃষ্টি হলো, আমরা পুরো ম্যাচ খেললাম।" },
        { target: "Nanu was tired, so she went to bed early.", bn: "নানু ক্লান্ত ছিলেন, তাই তাড়াতাড়ি ঘুমাতে গেলেন।" },
        { target: "Call me as soon as you reach home.", bn: "বাড়ি পৌঁছেই আমাকে ফোন কোরো।" },
        { target: "Neither Tamim nor Shakib played in that match.", bn: "তামিম বা শাকিব কেউই সেই ম্যাচে খেলেনি।" },
        { target: "He practises daily so that he can play in the final.", bn: "সে রোজ অনুশীলন করে যাতে ফাইনালে খেলতে পারে।" },
      ],
    },
    "joining-spot": {
      kind: "spot",
      title: { bn: "রাফির অনুচ্ছেদ, জোড়ার ভুল", en: "Rafi's paragraph: the joining mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে জোড়ার শব্দ বাড়তি, ভুল, বা কমা-চিহ্নে ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line with an extra or wrong joining word, or a joining mistake in punctuation." },
      source: { bn: "অনুচ্ছেদ: আমাদের ফাইনাল", en: "Paragraph: our final" },
      lines: [
        { text: { bn: "Our final was on a rainy Friday, but nobody wanted to go home.", en: "Our final was on a rainy Friday, but nobody wanted to go home." } },
        { text: { bn: "Although the ground was wet, but the umpires let us play.", en: "Although the ground was wet, but the umpires let us play." }, flag: { bn: "একটাই জোড়ার শব্দ: Although … , the umpires। but বাদ।", en: "One joining word only: Although … , the umpires. Drop but." } },
        { text: { bn: "Because of it rained, the first over was slow.", en: "Because of it rained, the first over was slow." }, flag: { bn: "পরে পুরো বাক্য, তাই because, of ছাড়া: Because it rained।", en: "A whole clause follows, so because without of: Because it rained." } },
        { text: { bn: "Rafi took two wickets, so the other team panicked.", en: "Rafi took two wickets, so the other team panicked." } },
        { text: { bn: "We were nervous, however, we kept our heads.", en: "We were nervous, however, we kept our heads." }, flag: { bn: "however দুটো বাক্যকে কমায় জোড়ে না: We were nervous. However, we kept our heads।", en: "However cannot join two sentences with a comma: We were nervous. However, we kept our heads." } },
        { text: { bn: "In the last over we needed six runs, and Mitu hit a four and then a two.", en: "In the last over we needed six runs, and Mitu hit a four and then a two." } },
        { text: { bn: "We will not forget that day unless we don't live to be a hundred.", en: "We will not forget that day unless we don't live to be a hundred." }, flag: { bn: "unless-এর পরে আর not নয়: unless we live।", en: "No not after unless: unless we live." } },
      ],
    },
    "joining-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Make it complex: In spite of his illness, Rafi played.", en: "Make it complex: In spite of his illness, Rafi played." },
          options: [
            { text: { bn: "Though he was ill, Rafi played.", en: "Though he was ill, Rafi played." }, right: true, why: { bn: "হ্যাঁ। in spite of + noun হয়ে যায় though + পুরো বাক্য।", en: "Yes. In spite of + noun becomes though + a whole clause." } },
            { text: { bn: "He was ill, but Rafi played.", en: "He was ill, but Rafi played." }, why: { bn: "না। but দিয়ে compound হয়, complex নয়।", en: "No. But makes a compound, not a complex." } },
            { text: { bn: "Though his illness, Rafi played.", en: "Though his illness, Rafi played." }, why: { bn: "না। though-এর পরে কর্তা আর ক্রিয়া লাগে: though he was ill।", en: "No. Though needs a subject and verb: though he was ill." } },
          ],
        },
        {
          ask: { bn: "Make it simple: He is so tired that he cannot walk.", en: "Make it simple: He is so tired that he cannot walk." },
          options: [
            { text: { bn: "He is very tired, so he cannot walk.", en: "He is very tired, so he cannot walk." }, why: { bn: "না। so দিয়ে compound।", en: "No. So makes a compound." } },
            { text: { bn: "He is too tired to walk.", en: "He is too tired to walk." }, right: true, why: { bn: "হ্যাঁ। so … that … cannot হয়ে যায় too … to: একটাই ক্রিয়া, simple।", en: "Yes. So … that … cannot becomes too … to: one verb, simple." } },
            { text: { bn: "He is too tired that he cannot walk.", en: "He is too tired that he cannot walk." }, why: { bn: "না। too-র সাথে to, that নয়।", en: "No. Too pairs with to, not that." } },
          ],
        },
        {
          ask: { bn: "Join with a suitable connector: Nanu is eighty. She walks two miles every morning.", en: "Join with a suitable connector: Nanu is eighty. She walks two miles every morning." },
          options: [
            { text: { bn: "Nanu is eighty, so she walks two miles every morning.", en: "Nanu is eighty, so she walks two miles every morning." }, why: { bn: "না। আশি বছর হাঁটার কারণ নয়; সম্পর্কটা বিপরীত।", en: "No. Being eighty is not the reason for walking; the relation is a contrast." } },
            { text: { bn: "Although Nanu is eighty, she walks two miles every morning.", en: "Although Nanu is eighty, she walks two miles every morning." }, right: true, why: { bn: "হ্যাঁ। বিপরীত: বয়স বেশি, তবু হাঁটেন। Although, বা … , yet she walks।", en: "Yes. A contrast: old, yet she walks. Although, or … , yet she walks." } },
            { text: { bn: "Nanu is eighty because she walks two miles every morning.", en: "Nanu is eighty because she walks two miles every morning." }, why: { bn: "না। হাঁটা তাঁর বয়সের কারণ নয়।", en: "No. Walking is not the cause of her age." } },
          ],
        },
        {
          ask: { bn: "Which sentence is punctuated correctly?", en: "Which sentence is punctuated correctly?" },
          options: [
            { text: { bn: "It was late, therefore we went home.", en: "It was late, therefore we went home." }, why: { bn: "না। therefore শুধু কমা দিয়ে দুটো বাক্য জোড়ে না।", en: "No. Therefore cannot join two sentences with a comma alone." } },
            { text: { bn: "It was late; therefore, we went home.", en: "It was late; therefore, we went home." }, right: true, why: { bn: "হ্যাঁ। সেমিকোলন, therefore, কমা। বা ফুল স্টপ আর নতুন বাক্য।", en: "Yes. Semicolon, therefore, comma. Or a full stop and a new sentence." } },
            { text: { bn: "It was late therefore, we went home.", en: "It was late therefore, we went home." }, why: { bn: "না। therefore-এর আগে সেমিকোলন বা ফুল স্টপ লাগে।", en: "No. Therefore needs a semicolon or full stop before it." } },
          ],
        },
      ],
    },
    "joining-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "নিজের দিন নিয়ে তিন-বাক্যের গল্প, তারপর because, so, but দিয়ে এক বাক্যে।", en: "A three-sentence story about your day, then one sentence with because, so and but." } },
        { text: { bn: "পাঁচটা although-বাক্য নিজের জীবন থেকে: Although I was tired, I…", en: "Five although sentences from your own life: Although I was tired, I…" } },
        { text: { bn: "তিনটা when-বাক্য, দুই সাজে: When I get home, I… / I… when I get home.", en: "Three when sentences, both ways round." } },
        { text: { bn: "একটা কথা তিন গঠনে জোরে: Being tired, I slept. I was tired, so I slept. As I was tired, I slept.", en: "One idea in three structures, aloud: Being tired, I slept. I was tired, so I slept. As I was tired, I slept." } },
        { text: { bn: "পাঁচটা বাক্য জোড়ায় However, Therefore, Moreover, For example, Finally দিয়ে, কমা সহ।", en: "Five pairs of sentences joined with However, Therefore, Moreover, For example and Finally, comma included." } },
        { text: { bn: "because আর because of, although আর in spite of: একই কথা দুই ভাবে, তিন জোড়া।", en: "Because and because of, although and in spite of: the same idea both ways, three pairs." } },
      ],
    },
  },
};
