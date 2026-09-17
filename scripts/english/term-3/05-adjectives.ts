/* ============================================================
   05-adjectives.ts: পর্ব ৫, রং লাগানো: adjective আর তুলনা.

   One part of the grammar term, gathered into the rung by
   `basic.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>নানু একটা গল্প শুরু করেন, "এক ছিল রাজা।" রাফি বলে, "কেমন রাজা?" নানু বলেন, "লোভী, বুড়ো, আর ভীষণ একা।" ওই তিনটে শব্দে রাজাটা জ্যান্ত হয়ে উঠল। ইংরেজিতে ওই শব্দগুলোর নাম <span lang="en">adjective</span>: <span lang="en">a greedy, old, lonely king</span>। নামের রং।</p>

<p>আর একটা adjective-এর আসল খেলা শুরু হয় যখন দুটো জিনিসের তুলনা হয়: তামিম লম্বা, কিন্তু মাশরাফি আরও লম্বা, আর দলে সবচেয়ে লম্বা কে? <span lang="en">tall, taller, tallest</span>। এই পর্বে দুটোই, আর তার সাথে যা যা পরীক্ষায় আসে: বানানের নিয়ম, রেবেলদের পুরো তালিকা, adjective-এর গোপন ক্রম, <span lang="en">-ing</span> আর <span lang="en">-ed</span>, <span lang="en">as … as</span>, আর তুলনার সাতটা ফাঁদ।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">adjective</span> বসে noun-এর <em>আগে</em> (<span lang="en">a fast bowler</span>) বা <span lang="en">be</span>-র <em>পরে</em> (<span lang="en">The bowler is fast</span>)।</li>
<li>দুটোর তুলনা: <span lang="en">-er</span> বা <span lang="en">more</span>, সাথে <span lang="en">than</span>। <span lang="en">taller than, more beautiful than</span>।</li>
<li>অনেকের মধ্যে সেরা: <span lang="en">the -est</span> বা <span lang="en">the most</span>। <span lang="en">the tallest, the most beautiful</span>।</li>
<li>ছোট শব্দে <span lang="en">-er/-est</span>, লম্বা শব্দে <span lang="en">more/most</span>। কান দিয়েই বোঝা যায়।</li>
<li>রেবেল: <span lang="en">good, better, best; bad, worse, worst; far, farther, farthest</span>।</li>
<li>সমান হলে <span lang="en">as … as</span>; কম হলে <span lang="en">less … than</span>; একাধিক adjective-এর একটা ক্রম আছে।</li>
</ul>
</div>

${mount("adjectives-pattern")}

<h2>রং লাগানোর দুই জায়গা</h2>

<p>বাংলায় বিশেষণ নামের আগেই বসে: "লাল বল"। ইংরেজিতেও তাই, <span lang="en">a red ball</span>। কিন্তু ইংরেজিতে আরেকটা জায়গা আছে যেটা বাংলায় লুকিয়ে থাকে: "বলটা লাল" বলতে বাংলায় মাঝে কিছু লাগে না, ইংরেজিতে <span lang="en">be</span> লাগে। <span lang="en">The ball is red.</span> দুই জায়গা, একই শব্দ।</p>

<p>কয়েকটা adjective শুধু <span lang="en">be</span>-র পরেই বসে, noun-এর আগে নয়: <span lang="en">afraid, asleep, awake, alive, alone, ill, well</span>। <span lang="en">The baby is asleep</span> ঠিক, <span lang="en">an asleep baby</span> ভুল, বলতে হয় <span lang="en">a sleeping baby</span>। আর <span lang="en">feel, look, seem, smell, taste, sound, become</span>-এর পরেও adjective, কারণ এরা <span lang="en">be</span>-র মতো, কর্তাকে তার রঙের সাথে জুড়ে দেয়: <span lang="en">The pitha smells good. Rafi looks tired. It sounds great.</span></p>

<p>একাধিক adjective একসাথে বসলে ইংরেজির একটা গোপন ক্রম আছে, যেটা সবাই মানে কিন্তু কেউ শেখে না: <strong>মত, আকার, বয়স, রং, উৎস, উপাদান</strong>। <span lang="en">a beautiful big old red Bangladeshi wooden boat</span>। কেউ পুরোটা একসাথে বলে না, কিন্তু <span lang="en">a red big ball</span> শুনলে কান খচ করে ওঠে, <span lang="en">a big red ball</span> শুনলে না। আকার আগে, রং পরে।</p>

<div class="table-scroll">
<table>
<thead><tr><th>১ মত</th><th>২ আকার</th><th>৩ বয়স</th><th>৪ আকৃতি</th><th>৫ রং</th><th>৬ উৎস</th><th>৭ উপাদান</th><th>noun</th></tr></thead>
<tbody>
<tr><td><span lang="en">beautiful</span></td><td><span lang="en">big</span></td><td><span lang="en">old</span></td><td><span lang="en">round</span></td><td><span lang="en">red</span></td><td><span lang="en">Bangladeshi</span></td><td><span lang="en">wooden</span></td><td><span lang="en">boat</span></td></tr>
<tr><td><span lang="en">lovely</span></td><td><span lang="en">small</span></td><td><span lang="en">new</span></td><td></td><td><span lang="en">blue</span></td><td></td><td><span lang="en">cotton</span></td><td><span lang="en">shirt</span></td></tr>
<tr><td></td><td><span lang="en">tall</span></td><td><span lang="en">young</span></td><td></td><td></td><td><span lang="en">Sylheti</span></td><td></td><td><span lang="en">player</span></td></tr>
</tbody>
</table>
</div>

<p>মনে রাখার একটা কথা: মতটা আগে (কেমন লাগে), তারপর মাপা যায় যা (আকার, বয়স, আকৃতি), তারপর দেখা যায় যা (রং), তারপর কোথাকার আর কী দিয়ে তৈরি। পরীক্ষায় দুটো বা তিনটে adjective সাজাতে বলে; সাতটা কখনো নয়।</p>

${mount("adjectives-lines")}

${mount("adjectives-order")}

<h2>তুলনা: -er নাকি more</h2>

<p>নিয়মটা শব্দের দৈর্ঘ্যের। এক সিলেবলের ছোট শব্দে <span lang="en">-er, -est</span>: <span lang="en">tall, taller, tallest; fast, faster, fastest</span>। তিন বা তার বেশি সিলেবলের লম্বা শব্দে <span lang="en">more, most</span>: <span lang="en">beautiful, more beautiful, most beautiful; expensive, more expensive, most expensive</span>। দুই সিলেবলের শব্দ মাঝামাঝি: <span lang="en">-y</span> দিয়ে শেষ হলে <span lang="en">-ier</span> (<span lang="en">happy, happier, happiest; easy, easier, easiest</span>), নইলে বেশিরভাগ সময় <span lang="en">more</span> (<span lang="en">more careful, more famous</span>)।</p>

<div class="table-scroll">
<table>
<thead><tr><th>শব্দ</th><th>দুজনের তুলনা</th><th>সবার সেরা</th><th>নিয়ম</th></tr></thead>
<tbody>
<tr><td><span lang="en">fast</span></td><td><span lang="en">faster</span></td><td><span lang="en">the fastest</span></td><td>ছোট শব্দ, <span lang="en">-er</span></td></tr>
<tr><td><span lang="en">big</span></td><td><span lang="en">bigger</span></td><td><span lang="en">the biggest</span></td><td>শেষের ব্যঞ্জন দুবার</td></tr>
<tr><td><span lang="en">happy</span></td><td><span lang="en">happier</span></td><td><span lang="en">the happiest</span></td><td><span lang="en">y</span> হয়ে যায় <span lang="en">i</span></td></tr>
<tr><td><span lang="en">famous</span></td><td><span lang="en">more famous</span></td><td><span lang="en">the most famous</span></td><td>লম্বা শব্দ, <span lang="en">more</span></td></tr>
<tr><td><span lang="en">good</span></td><td><span lang="en">better</span></td><td><span lang="en">the best</span></td><td>রেবেল</td></tr>
<tr><td><span lang="en">bad</span></td><td><span lang="en">worse</span></td><td><span lang="en">the worst</span></td><td>রেবেল</td></tr>
<tr><td><span lang="en">little</span></td><td><span lang="en">less</span></td><td><span lang="en">the least</span></td><td>রেবেল</td></tr>
</tbody>
</table>
</div>

<p>দুটোর তুলনায় সবসময় <span lang="en">than</span>: <span lang="en">Rafi is taller than Mitu.</span> সবার সেরায় সবসময় <span lang="en">the</span>: <span lang="en">Shakib is the best all-rounder.</span> আর কখনো দুটো একসাথে নয়: <span lang="en">more taller</span> বলে কিছু নেই। এটা বাংলাভাষীর একটা প্রিয় ভুল, কারণ বাংলায় "আরও বেশি লম্বা" বলা যায়।</p>

<h2>-er লাগানোর বানান, আর রেবেলদের পুরো তালিকা</h2>

<p>বানানের নিয়ম চারটা, আর তিনটা noun-এর বহুবচনের মতোই। শুধু <span lang="en">-er</span>: <span lang="en">tall, taller</span>। শেষে <span lang="en">e</span> থাকলে শুধু <span lang="en">-r</span>: <span lang="en">nice, nicer; large, larger; late, later</span>। এক স্বর + এক ব্যঞ্জনে শেষ হলে ব্যঞ্জনটা দুবার: <span lang="en">big, bigger; hot, hotter; thin, thinner; sad, sadder</span>। কিন্তু <span lang="en">cheap, cheaper</span>, কারণ দুটো স্বর। ব্যঞ্জন + <span lang="en">y</span> হলে <span lang="en">-ier</span>: <span lang="en">busy, busier; early, earlier; heavy, heavier</span>।</p>

<div class="table-scroll">
<table>
<thead><tr><th>রেবেল</th><th>দুজনের</th><th>সবার</th><th>মানে</th></tr></thead>
<tbody>
<tr><td><span lang="en">good, well</span></td><td><span lang="en">better</span></td><td><span lang="en">best</span></td><td>ভালো</td></tr>
<tr><td><span lang="en">bad, ill</span></td><td><span lang="en">worse</span></td><td><span lang="en">worst</span></td><td>খারাপ</td></tr>
<tr><td><span lang="en">much, many</span></td><td><span lang="en">more</span></td><td><span lang="en">most</span></td><td>অনেক</td></tr>
<tr><td><span lang="en">little</span></td><td><span lang="en">less</span></td><td><span lang="en">least</span></td><td>অল্প</td></tr>
<tr><td><span lang="en">far</span></td><td><span lang="en">farther / further</span></td><td><span lang="en">farthest / furthest</span></td><td>দূর</td></tr>
<tr><td><span lang="en">old</span></td><td><span lang="en">older / elder</span></td><td><span lang="en">oldest / eldest</span></td><td>বয়স্ক; <span lang="en">elder</span> শুধু পরিবারে</td></tr>
<tr><td><span lang="en">late</span></td><td><span lang="en">later / latter</span></td><td><span lang="en">latest / last</span></td><td>সময়ে পরে / ক্রমে পরে</td></tr>
</tbody>
</table>
</div>

<p>শেষ দুটো সারি পরীক্ষার প্রিয়। <span lang="en">elder, eldest</span> শুধু পরিবারের মানুষের জন্য আর শুধু noun-এর আগে: <span lang="en">my elder brother, the eldest son</span>। <span lang="en">than</span>-এর সাথে কখনো <span lang="en">elder</span> নয়: <span lang="en">He is older than me.</span> আর <span lang="en">latest</span> মানে সবচেয়ে নতুন (<span lang="en">the latest phone</span>), <span lang="en">last</span> মানে শেষ (<span lang="en">the last ball</span>)।</p>

${mount("adjectives-grid")}

${mount("adjectives-gap")}

<h2>সমান সমান: as … as, আর কম: less</h2>

<p>কেউ কারও চেয়ে বেশি না হলে: <span lang="en">Rafi is as tall as Mitu.</span> রাফি মিতুর মতোই লম্বা। না-বাচক করলে: <span lang="en">Rafi is not as tall as Tamim.</span> তুলনার তিনটে সিঁড়ি একসাথে: <span lang="en">as tall as, taller than, the tallest</span>।</p>

<p>উল্টো দিকেও যাওয়া যায়। কম বোঝাতে <span lang="en">less … than</span>, সবচেয়ে কম <span lang="en">the least</span>: <span lang="en">This bat is less expensive than that one. It is the least expensive bat in the shop.</span> আর <span lang="en">not as … as</span> প্রায়ই <span lang="en">less than</span>-এর সহজ রূপ: <span lang="en">Sylhet is not as crowded as Dhaka</span>। তুলনা বাড়াতে <span lang="en">much, far, a lot</span>: <span lang="en">much taller, far more expensive</span>। একটু বাড়াতে <span lang="en">a little, slightly</span>: <span lang="en">a little cheaper</span>। আর দুটো তুলনা একসাথে বাড়লে: <span lang="en">The more you practise, the better you play.</span> যত বেশি, তত ভালো।</p>

<div class="ex"><b>ক্রিকেট ধারাভাষ্য শোনো:</b> <span lang="en">Mustafiz is quicker than he looks. But today the pitch is slower, so the batters are more comfortable. This is the best over of the match!</span> চার লাইন, চার রকম তুলনা। ধারাভাষ্যকাররা adjective ছাড়া দুই মিনিট কথা বলতে পারেন না।</div>

${mount("adjectives-compare")}

${mount("adjectives-build")}

<h2>-ing নাকি -ed: জিনিসটা, নাকি তোমার অনুভূতি</h2>

<p>একটা ক্রিয়া থেকে দুটো adjective জন্মায়, আর দুটোর মানে দুই দিকে। <span lang="en">bore</span> থেকে <span lang="en">boring</span> আর <span lang="en">bored</span>। <span lang="en">The film is boring</span>: সিনেমাটা বিরক্তিকর, সিনেমাটা বিরক্তি তৈরি করছে। <span lang="en">I am bored</span>: আমি বিরক্ত, আমার ভিতরে অনুভূতিটা। নিয়ম: যে জিনিস অনুভূতিটা <em>বানায়</em>, সে <span lang="en">-ing</span>; যে অনুভূতিটা <em>পায়</em>, সে <span lang="en">-ed</span>।</p>

<div class="table-scroll">
<table>
<thead><tr><th>ক্রিয়া</th><th>জিনিসটা (<span lang="en">-ing</span>)</th><th>অনুভূতি (<span lang="en">-ed</span>)</th></tr></thead>
<tbody>
<tr><td><span lang="en">excite</span></td><td><span lang="en">an exciting match</span></td><td><span lang="en">excited fans</span></td></tr>
<tr><td><span lang="en">bore</span></td><td><span lang="en">a boring lecture</span></td><td><span lang="en">bored students</span></td></tr>
<tr><td><span lang="en">interest</span></td><td><span lang="en">an interesting book</span></td><td><span lang="en">an interested reader</span></td></tr>
<tr><td><span lang="en">tire</span></td><td><span lang="en">a tiring day</span></td><td><span lang="en">a tired player</span></td></tr>
<tr><td><span lang="en">surprise</span></td><td><span lang="en">surprising news</span></td><td><span lang="en">a surprised face</span></td></tr>
<tr><td><span lang="en">frighten</span></td><td><span lang="en">a frightening story</span></td><td><span lang="en">a frightened child</span></td></tr>
<tr><td><span lang="en">confuse</span></td><td><span lang="en">a confusing map</span></td><td><span lang="en">a confused tourist</span></td></tr>
</tbody>
</table>
</div>

${mount("adjectives-match")}

${mount("adjectives-feelings")}

<h2>তুলনার সাতটা ফাঁদ</h2>

<p>পরীক্ষায় তুলনার প্রশ্ন সহজ, কিন্তু নম্বর কাটা যায় সাত জায়গায়। প্রতিটা একবার চিনলে আর পড়তে হয় না।</p>

<div class="table-scroll">
<table>
<thead><tr><th>ভুল</th><th>ঠিক</th><th>কেন</th></tr></thead>
<tbody>
<tr><td><span lang="en">more taller</span></td><td><span lang="en">taller</span></td><td>একটাই তুলনা, দুটো নয়</td></tr>
<tr><td><span lang="en">taller from me</span></td><td><span lang="en">taller than me</span></td><td>বাংলার 'থেকে' ইংরেজিতে <span lang="en">than</span></td></tr>
<tr><td><span lang="en">the taller of them all</span></td><td><span lang="en">the tallest of them all</span></td><td>তিনজনের বেশি হলে <span lang="en">-est</span></td></tr>
<tr><td><span lang="en">the tallest of the two</span></td><td><span lang="en">the taller of the two</span></td><td>মাত্র দুজন হলে <span lang="en">-er</span></td></tr>
<tr><td><span lang="en">gooder, badder</span></td><td><span lang="en">better, worse</span></td><td>রেবেল</td></tr>
<tr><td><span lang="en">He is elder than me.</span></td><td><span lang="en">He is older than me.</span></td><td><span lang="en">than</span>-এর সাথে <span lang="en">elder</span> নয়</td></tr>
<tr><td><span lang="en">Rafi is taller than any boy in the class.</span></td><td><span lang="en">Rafi is taller than any other boy in the class.</span></td><td>নিজেকে বাদ দিতে <span lang="en">other</span></td></tr>
</tbody>
</table>
</div>

<p>শেষ ফাঁদটা পর্ব ২৪-এর <span lang="en">transformation</span>-এর প্রাণ। একই কথা তিন ভাবে: <span lang="en">Rafi is the tallest boy in the class. Rafi is taller than any other boy in the class. No other boy in the class is as tall as Rafi.</span> একটা সত্যি, তিনটা বাক্য, আর পরীক্ষা ঠিক এই তিনটার মধ্যে বদল করতে বলে।</p>

${mount("adjectives-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>adjective-এর প্রশ্ন তিন চেহারায়। এক: বন্ধনীতে একটা adjective, খালি ঘরে তার ঠিক সিঁড়ি (<span lang="en">tall / taller / tallest</span>)। দুই: <span lang="en">transformation</span>, একই তুলনা তিন ভাবে। তিন: <span lang="en">-ing</span> না <span lang="en">-ed</span>। প্রথমটার ধাপ:</p>

<ol class="step-list">
<li><strong>বাক্যে <span lang="en">than</span> আছে?</strong> তাহলে দুজনের তুলনা: <span lang="en">-er</span> বা <span lang="en">more</span>।</li>
<li><strong>আগে <span lang="en">the</span>, আর বাক্যে <span lang="en">of all, in the class, in the world, ever</span>?</strong> তাহলে সবার সেরা: <span lang="en">-est</span> বা <span lang="en">most</span>।</li>
<li><strong><span lang="en">as</span> আছে?</strong> তাহলে সাধারণ রূপ, যেমন আছে তেমন: <span lang="en">as tall as</span>।</li>
<li><strong>এবার শব্দটা দেখো।</strong> ছোট হলে <span lang="en">-er</span> আর বানানের নিয়ম (<span lang="en">big, bigger; happy, happier</span>)। লম্বা হলে <span lang="en">more</span>। রেবেল হলে রেবেল: <span lang="en">good</span> দেখলে থামো।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Dhaka is (big) ___ than Sylhet, but Sylhet is (beautiful) ___. In fact, many say Sylhet is the (beautiful) ___ city in Bangladesh, and its tea is (good) ___ than any other.</span> ধাপে: <span lang="en">than</span>, ছোট, <span lang="en">g</span> দুবার: <span lang="en">bigger</span>; কোনো <span lang="en">than</span> নেই, শুধু বর্ণনা: <span lang="en">beautiful</span>; <span lang="en">the … in Bangladesh</span>: <span lang="en">most beautiful</span>; <span lang="en">than</span> আর রেবেল: <span lang="en">better</span>। চারটা ঘর, চারটা আলাদা সিঁড়ি।</div>

${mount("adjectives-exam")}

${mount("adjectives-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>শূন্যস্থানের পরে <span lang="en">than</span> দেখলেই <span lang="en">-er</span> বা <span lang="en">more</span>। আগে <span lang="en">the</span> আর বাক্যে <span lang="en">of all, in the class, in the world</span> দেখলে <span lang="en">-est</span> বা <span lang="en">most</span>। <span lang="en">as</span> দেখলে সাধারণ রূপ। বন্ধনীতে <span lang="en">good</span> থাকলে থামো: উত্তর <span lang="en">gooder</span> নয়, <span lang="en">better</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">-ing</span> আর <span lang="en">-ed</span> দিয়ে বানানো adjective দুটো আলাদা জিনিস। <span lang="en">The film is boring</span>: সিনেমাটা বিরক্তিকর। <span lang="en">I am bored</span>: আমি বিরক্ত। <span lang="en">I am boring</span> বললে মানে দাঁড়ায় "আমি একজন বিরক্তিকর মানুষ"। জিনিসটা <span lang="en">-ing</span>, তোমার অনুভূতি <span lang="en">-ed</span>: <span lang="en">exciting match, excited fans</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>কিছু adjective-এর তুলনা হয় না, কারণ এরা এমনিতেই চূড়ান্ত: <span lang="en">perfect, unique, dead, empty, full, complete</span>। <span lang="en">more perfect</span> বলে কিছু নেই; হয় <span lang="en">perfect</span>, নয় নয়। <span lang="en">very unique</span>-ও তাই, যদিও সিনেমায় শোনা যায়। পরীক্ষায় লিখো না।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>তুলনার তিন সিঁড়ি একটা adjective দিয়ে জোরে বলতে পারি: <span lang="en">as … as, -er than, the -est</span>?</li>
<li><span lang="en">big, happy, nice, careful</span>: চারটার <span lang="en">-er</span> বানান আলাদা কেন?</li>
<li>সাতটা রেবেল না দেখে বলতে পারি?</li>
<li><span lang="en">a big red ball</span>, <span lang="en">a red big ball</span> নয়: ক্রমটা কী?</li>
<li><span lang="en">bored</span> আর <span lang="en">boring</span>-এর পার্থক্য এক বাক্যে?</li>
<li><span lang="en">taller than any other boy</span>: <span lang="en">other</span> কেন?</li>
</ul>
</div>

${mount("adjectives-drill")}
`,
  blocks: {
    "adjectives-pattern": {
      kind: "pattern",
      title: { bn: "তুলনার তিন সিঁড়ি", en: "The three steps of comparison" },
      shape: "as ___ as  ·  ___er than / more ___ than  ·  the ___est / the most ___",
      why: { bn: "সমান হলে as … as। দুজনের মধ্যে একজন বেশি হলে -er than বা more … than। অনেকের মধ্যে একজন সবার উপরে হলে the -est বা the most। শব্দ ছোট হলে -er, লম্বা হলে more।", en: "Equal: as … as. One of two is more: -er than or more … than. One of many is above all: the -est or the most. Short words take -er, long words take more." },
      examples: [
        { target: "Rafi is as tall as Mitu.", bn: "রাফি মিতুর মতোই লম্বা।" },
        { target: "Tamim is taller than Rafi.", bn: "তামিম রাফির চেয়ে লম্বা।" },
        { target: "Mashrafe is the tallest of them all.", bn: "মাশরাফি তাদের সবার মধ্যে সবচেয়ে লম্বা।" },
        { target: "This film is more exciting than the last one.", bn: "এই সিনেমাটা আগেরটার চেয়ে বেশি উত্তেজনাপূর্ণ।" },
        { target: "It is the most exciting film of the year.", bn: "এটা বছরের সবচেয়ে উত্তেজনাপূর্ণ সিনেমা।" },
      ],
      tip: { bn: "than শুনলে -er, the শুনলে -est। দুটো একসাথে কখনো নয়: more taller বলে কিছু নেই।", en: "Hear than, think -er; hear the, think -est. Never both at once: there is no more taller." },
    },
    "adjectives-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: দুই জায়গায় রং", en: "Listen, say: colour in two places" },
      lines: [
        { target: "Shakib is a calm captain.", bn: "শাকিব একজন শান্ত অধিনায়ক। (নামের আগে)" },
        { target: "Shakib is calm.", bn: "শাকিব শান্ত। (be-র পরে)" },
        { target: "Nanu makes a delicious pitha.", bn: "নানু খুব মজার পিঠা বানান।" },
        { target: "The pitha is delicious.", bn: "পিঠাটা খুব মজার।" },
        { target: "It was a long, hot, tiring day.", bn: "দিনটা ছিল লম্বা, গরম আর ক্লান্তিকর।" },
        { target: "The baby is asleep, so speak softly.", bn: "বাচ্চাটা ঘুমিয়ে, তাই আস্তে কথা বলো। (asleep শুধু be-র পরে)" },
      ],
    },
    "adjectives-order": {
      kind: "order",
      title: { bn: "রঙের ক্রম", en: "The order of colours" },
      note: { bn: "একটা noun-এর আগে পাঁচটা adjective। ইংরেজির গোপন ক্রমে সাজাও: মত, আকার, বয়স, রং, উপাদান।", en: "Five adjectives before one noun. Put them in English's hidden order: opinion, size, age, colour, material." },
      items: [
        { text: { bn: "a beautiful (মত)", en: "a beautiful (opinion)" }, why: { bn: "কেমন লাগে, সেটা সবার আগে।", en: "What you think of it comes first." } },
        { text: { bn: "small (আকার)", en: "small (size)" } },
        { text: { bn: "old (বয়স)", en: "old (age)" } },
        { text: { bn: "blue (রং)", en: "blue (colour)" } },
        { text: { bn: "wooden (উপাদান)", en: "wooden (material)" }, why: { bn: "কী দিয়ে তৈরি, সেটা noun-এর ঠিক আগে।", en: "What it is made of sits right before the noun." } },
        { text: { bn: "boat", en: "boat" } },
      ],
    },
    "adjectives-grid": {
      kind: "grid",
      model: "en-compare",
      title: { bn: "তিন সিঁড়ি নিজে ভরো", en: "Fill the three steps yourself" },
      note: { bn: "প্রতিটা adjective-এর দুজনের রূপ আর সবার রূপ লেখো। বানানের নিয়ম আর রেবেল, দুটোই আছে।", en: "Type the of-two form and the of-all form of each adjective. Spelling rules and rebels are both in here." },
    },
    "adjectives-gap": {
      kind: "gap",
      title: { bn: "কোন সিঁড়িতে", en: "Which step" },
      items: [
        { text: "Rafi runs ___ than his friend.", bn: "রাফি তার বন্ধুর চেয়ে দ্রুত দৌড়ায়।", options: ["fast", "faster", "more faster", "fastest"], right: 1, why: { bn: "than আছে, দুজনের তুলনা, ছোট শব্দ: faster। more faster দুটো একসাথে, ভুল।", en: "Than is there, two are compared, short word: faster. More faster doubles up and is wrong." } },
        { text: "This is the ___ story Nanu has ever told.", bn: "এটা নানুর বলা সবচেয়ে মজার গল্প।", options: ["funny", "funnier", "funniest", "most funny"], right: 2, why: { bn: "the আছে, ever আছে: সবার সেরা। funny-র y হয়ে যায় i: funniest।", en: "The and ever say best of all. The y of funny becomes i: funniest." } },
        { text: "Dhaka is ___ than Sylhet.", bn: "ঢাকা সিলেটের চেয়ে বেশি জনবহুল।", options: ["crowded", "crowdeder", "more crowded", "most crowded"], right: 2, why: { bn: "লম্বা শব্দ, তাই more crowded than। crowdeder উচ্চারণই হয় না।", en: "A long word takes more: more crowded than. Crowdeder cannot be said." } },
        { text: "Mitu's marks are ___ than mine.", bn: "মিতুর নম্বর আমার চেয়ে ভালো।", options: ["gooder", "better", "more good", "best"], right: 1, why: { bn: "good একটা রেবেল: good, better, best। than আছে, তাই better।", en: "Good is a rebel: good, better, best. Than is there, so better." } },
        { text: "Mustafiz is ___ good as Shakib with the ball.", bn: "বল হাতে মুস্তাফিজ শাকিবের মতোই ভালো।", options: ["as", "than", "more"], right: 0, why: { bn: "as good as: সমান সমান। as-এর সাথে সাধারণ রূপ, কোনো -er নয়।", en: "As good as: equal. With as, the plain form and no -er." } },
        { text: "It is the ___ day of the year.", bn: "এটা বছরের সবচেয়ে গরম দিন।", options: ["hot", "hotter", "hottest", "most hot"], right: 2, why: { bn: "the … of the year: সবার সেরা। ছোট শব্দ, শেষের t দুবার: hottest।", en: "The … of the year: best of all. Short word, double the t: hottest." } },
        { text: "Of the two bats, the red one is ___.", bn: "দুটো ব্যাটের মধ্যে লালটা হালকা।", options: ["light", "the lighter", "the lightest"], right: 1, why: { bn: "মাত্র দুটো, তাই -er, the সহ: the lighter of the two।", en: "Only two, so -er, with the: the lighter of the two." } },
        { text: "My ___ brother is a doctor.", bn: "আমার বড় ভাই ডাক্তার।", options: ["elder", "older than", "more old"], right: 0, why: { bn: "পরিবারে, noun-এর আগে: elder brother। than থাকলে older হতো।", en: "In the family and before a noun: elder brother. With than it would be older." } },
      ],
    },
    "adjectives-compare": {
      kind: "compare",
      title: { bn: "একই কথা, তিন সিঁড়ি", en: "The same fact, three steps" },
      note: { bn: "প্রতিটা সারি একটা সত্যি, তিন ভাবে বলা। কোন সিঁড়িতে কী বদলায়, দেখো।", en: "Each row is one fact said three ways. Watch what changes on each step." },
      columns: [
        { bn: "সমান: as … as", en: "equal: as … as" },
        { bn: "দুজনের: -er than", en: "of two: -er than" },
        { bn: "সবার: the -est", en: "of all: the -est" },
      ],
      rows: [
        { label: { bn: "লম্বা", en: "tall" }, cells: [{ bn: "Rafi is as tall as Mitu.", en: "Rafi is as tall as Mitu." }, { bn: "Tamim is taller than Rafi.", en: "Tamim is taller than Rafi." }, { bn: "Mashrafe is the tallest of all.", en: "Mashrafe is the tallest of all." }] },
        { label: { bn: "ভালো (রেবেল)", en: "good (rebel)" }, cells: [{ bn: "Mustafiz is as good as Shakib.", en: "Mustafiz is as good as Shakib." }, { bn: "Shakib is better than Rafi.", en: "Shakib is better than Rafi." }, { bn: "Shakib is the best of all.", en: "Shakib is the best of all." }] },
        { label: { bn: "দামি (লম্বা শব্দ)", en: "expensive (long word)" }, cells: [{ bn: "This bat is as expensive as that one.", en: "This bat is as expensive as that one." }, { bn: "This bat is more expensive than that one.", en: "This bat is more expensive than that one." }, { bn: "This is the most expensive bat here.", en: "This is the most expensive bat here." }] },
        { label: { bn: "কম", en: "less" }, cells: [{ bn: "Sylhet is not as crowded as Dhaka.", en: "Sylhet is not as crowded as Dhaka." }, { bn: "Sylhet is less crowded than Dhaka.", en: "Sylhet is less crowded than Dhaka." }, { bn: "Sylhet is the least crowded of the three.", en: "Sylhet is the least crowded of the three." }] },
      ],
    },
    "adjectives-build": {
      kind: "build",
      title: { bn: "তুলনার বাক্য সাজাও", en: "Build the comparison" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো than কোথায় গেল, the কোথায়, আর as দুটো কোথায়।", en: "The words are shuffled. As you build, watch where than goes, where the goes, and where the two as go." },
      pattern: "X + is + -er / more + than + Y  ·  X + is + the + -est",
      lines: [
        { target: "Tamim is taller than Rafi.", bn: "তামিম রাফির চেয়ে লম্বা।" },
        { target: "Nanu's pitha is better than any shop's.", bn: "নানুর পিঠা যেকোনো দোকানের চেয়ে ভালো।" },
        { target: "This is the most exciting match of the year.", bn: "এটা বছরের সবচেয়ে উত্তেজনাপূর্ণ ম্যাচ।" },
        { target: "Mitu is as clever as her elder sister.", bn: "মিতু তার বড় বোনের মতোই বুদ্ধিমান।" },
        { target: "The more you practise, the better you play.", bn: "যত বেশি অনুশীলন, তত ভালো খেলা।" },
        { target: "Rafi is taller than any other boy in the class.", bn: "রাফি ক্লাসের অন্য যেকোনো ছেলের চেয়ে লম্বা।" },
      ],
    },
    "adjectives-match": {
      kind: "match",
      title: { bn: "-ing নাকি -ed", en: "-ing or -ed" },
      note: { bn: "বাঁ দিকের কথাটা ডান দিকের ঠিক শব্দটার সাথে মেলাও।", en: "Match the phrase on the left with the right word on the right." },
      pairs: [
        { left: { bn: "ম্যাচটা দারুণ উত্তেজনার", en: "the match was full of excitement" }, right: { bn: "an exciting match", en: "an exciting match" } },
        { left: { bn: "দর্শকরা উত্তেজিত", en: "the crowd felt excitement" }, right: { bn: "excited fans", en: "excited fans" } },
        { left: { bn: "লেকচারটা বিরক্তিকর", en: "the lecture caused boredom" }, right: { bn: "a boring lecture", en: "a boring lecture" } },
        { left: { bn: "ছাত্ররা বিরক্ত", en: "the students felt boredom" }, right: { bn: "bored students", en: "bored students" } },
        { left: { bn: "খবরটা চমকে দেওয়ার মতো", en: "the news caused surprise" }, right: { bn: "surprising news", en: "surprising news" } },
        { left: { bn: "বাচ্চাটা ভয় পেয়েছে", en: "the child felt fear" }, right: { bn: "a frightened child", en: "a frightened child" } },
      ],
    },
    "adjectives-feelings": {
      kind: "bins",
      title: { bn: "জিনিসটা, নাকি অনুভূতি", en: "The thing, or the feeling" },
      note: { bn: "প্রতিটা বাক্যের খালি জায়গায় -ing বসবে না -ed, সেই ঘরে ফেলো। যে বানায় সে -ing, যে পায় সে -ed।", en: "Drop each sentence into the box of the ending that fills its gap. What causes the feeling takes -ing; who feels it takes -ed." },
      bins: [
        { id: "ing", label: { bn: "-ing: জিনিসটা", en: "-ing: the thing" } },
        { id: "ed", label: { bn: "-ed: অনুভূতি", en: "-ed: the feeling" } },
      ],
      items: [
        { text: { bn: "The last over was really excit___.", en: "The last over was really excit___." }, bin: "ing", why: { bn: "ওভারটা উত্তেজনা বানাল: exciting।", en: "The over caused the excitement: exciting." } },
        { text: { bn: "Rafi was too excit___ to sleep.", en: "Rafi was too excit___ to sleep." }, bin: "ed", why: { bn: "রাফি অনুভূতিটা পেল: excited।", en: "Rafi felt it: excited." } },
        { text: { bn: "I am bor___ of this game.", en: "I am bor___ of this game." }, bin: "ed", why: { bn: "আমি বিরক্ত: bored। boring হলে আমি নিজেই বিরক্তিকর।", en: "I feel it: bored. Boring would make me the dull one." } },
        { text: { bn: "Nanu's stories are never bor___.", en: "Nanu's stories are never bor___." }, bin: "ing", why: { bn: "গল্পগুলো বিরক্তি বানায় না: boring।", en: "The stories never cause boredom: boring." } },
        { text: { bn: "It was a tir___ journey.", en: "It was a tir___ journey." }, bin: "ing", why: { bn: "যাত্রাটা ক্লান্তি বানাল: tiring।", en: "The journey caused the tiredness: tiring." } },
        { text: { bn: "The players were tir___ after it.", en: "The players were tir___ after it." }, bin: "ed", why: { bn: "খেলোয়াড়রা ক্লান্তি পেল: tired।", en: "The players felt it: tired." } },
        { text: { bn: "The map was confus___, so we got lost.", en: "The map was confus___, so we got lost." }, bin: "ing", why: { bn: "মানচিত্রটা গোলমাল বানাল: confusing।", en: "The map caused the confusion: confusing." } },
        { text: { bn: "Mitu was interest___ in the book.", en: "Mitu was interest___ in the book." }, bin: "ed", why: { bn: "মিতুর আগ্রহ, অনুভূতি: interested in।", en: "Mitu's interest, her feeling: interested in." } },
      ],
    },
    "adjectives-spot": {
      kind: "spot",
      title: { bn: "রাফির রচনা, তুলনার ভুল", en: "Rafi's essay: the comparison mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে adjective বা তুলনার ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line with an adjective or comparison mistake." },
      source: { bn: "রচনা: আমার প্রিয় শহর", en: "Essay: my favourite city" },
      lines: [
        { text: { bn: "Sylhet is my favourite city in Bangladesh.", en: "Sylhet is my favourite city in Bangladesh." } },
        { text: { bn: "It is more greener than Dhaka and much quieter.", en: "It is more greener than Dhaka and much quieter." }, flag: { bn: "একটাই তুলনা: greener than, more greener নয়।", en: "One comparison only: greener than, not more greener." } },
        { text: { bn: "The tea gardens there are the most beautiful in the country.", en: "The tea gardens there are the most beautiful in the country." } },
        { text: { bn: "The weather is more cool than in my city.", en: "The weather is more cool than in my city." }, flag: { bn: "cool ছোট শব্দ: cooler than।", en: "Cool is a short word: cooler than." } },
        { text: { bn: "Of all the places I have seen, Jaflong is the more exciting.", en: "Of all the places I have seen, Jaflong is the more exciting." }, flag: { bn: "of all, সবার মধ্যে: the most exciting।", en: "Of all, the top of many: the most exciting." } },
        { text: { bn: "The river there is as clear as glass.", en: "The river there is as clear as glass." } },
        { text: { bn: "I was very exciting when I first saw it.", en: "I was very exciting when I first saw it." }, flag: { bn: "আমার অনুভূতি: excited। exciting হলে আমি নিজেই উত্তেজনার জিনিস।", en: "My feeling: excited. Exciting would make me the thrilling thing." } },
        { text: { bn: "Sylhet is better than any other city I know.", en: "Sylhet is better than any other city I know." } },
      ],
    },
    "adjectives-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Transformation: Shakib is the best all-rounder in the team. একই কথা, comparative-এ?", en: "Transformation: Shakib is the best all-rounder in the team. The same fact as a comparative?" },
          options: [
            { text: { bn: "Shakib is better than any all-rounder in the team.", en: "Shakib is better than any all-rounder in the team." }, why: { bn: "প্রায়। কিন্তু any all-rounder-এ শাকিব নিজেও পড়ে যায়, আর সে নিজের চেয়ে ভালো হতে পারে না। other লাগবে।", en: "Nearly. But any all-rounder includes Shakib himself, and he cannot be better than himself. Other is needed." } },
            { text: { bn: "Shakib is better than any other all-rounder in the team.", en: "Shakib is better than any other all-rounder in the team." }, right: true, why: { bn: "হ্যাঁ। the best = better than any other। other দিয়ে নিজেকে বাদ।", en: "Yes. The best equals better than any other, and other leaves him out of the group." } },
            { text: { bn: "No other all-rounder in the team is better than Shakib.", en: "No other all-rounder in the team is better than Shakib." }, why: { bn: "মানে ঠিক, কিন্তু এটা negative রূপ, comparative চাওয়া হয়েছে। comparative হলো better than any other।", en: "True in meaning, but this is the negative form and a comparative was asked for. The comparative is better than any other." } },
          ],
        },
        {
          ask: { bn: "Of the two sisters, Mitu is ___. কোনটা?", en: "Of the two sisters, Mitu is ___. Which?" },
          options: [
            { text: { bn: "the cleverest", en: "the cleverest" }, why: { bn: "না। মাত্র দুজন, তাই -est নয়।", en: "No. Only two, so no -est." } },
            { text: { bn: "the cleverer", en: "the cleverer" }, right: true, why: { bn: "হ্যাঁ। দুজনের মধ্যে একজন: the cleverer of the two। the বসে, কিন্তু -er।", en: "Yes. One of two: the cleverer of the two. The is there, but with -er." } },
            { text: { bn: "more clever", en: "more clever" }, why: { bn: "না। clever দুই সিলেবল, -er নেয়: cleverer। আর of the two-র সাথে the লাগে।", en: "No. Clever has two syllables and takes -er: cleverer. And of the two wants the." } },
          ],
        },
        {
          ask: { bn: "Rafi is my ___ brother, and he is two years ___ than me. কোন জোড়া?", en: "Rafi is my ___ brother, and he is two years ___ than me. Which pair?" },
          options: [
            { text: { bn: "elder, elder", en: "elder, elder" }, why: { bn: "না। than-এর সাথে elder বসে না: older than।", en: "No. Elder does not go with than: older than." } },
            { text: { bn: "elder, older", en: "elder, older" }, right: true, why: { bn: "হ্যাঁ। noun-এর আগে পরিবারে elder brother; than-এর সাথে older than me।", en: "Yes. Before a noun in the family, elder brother; with than, older than me." } },
            { text: { bn: "older, elder", en: "older, elder" }, why: { bn: "উল্টো। older brother চলে, কিন্তু elder than কখনো নয়।", en: "Backwards. Older brother passes, but elder than never does." } },
          ],
        },
        {
          ask: { bn: "The film was so ___ that the ___ children fell asleep. কোন জোড়া?", en: "The film was so ___ that the ___ children fell asleep. Which pair?" },
          options: [
            { text: { bn: "bored, boring", en: "bored, boring" }, why: { bn: "উল্টো। সিনেমাটা বিরক্তি বানাল (boring), বাচ্চারা পেল (bored)।", en: "Backwards. The film caused it (boring), the children felt it (bored)." } },
            { text: { bn: "boring, bored", en: "boring, bored" }, right: true, why: { bn: "হ্যাঁ। জিনিসটা boring, অনুভূতি bored।", en: "Yes. The thing is boring, the feeling is bored." } },
            { text: { bn: "boring, boring", en: "boring, boring" }, why: { bn: "না। boring children মানে বাচ্চারা নিজেরাই বিরক্তিকর।", en: "No. Boring children would make the children the dull ones." } },
          ],
        },
      ],
    },
    "adjectives-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "কোন ক্রমটা ঠিক?", en: "Which order is right?" },
          options: [
            { text: { bn: "a red big old ball", en: "a red big old ball" }, why: { bn: "না। আকার আর বয়স রঙের আগে।", en: "No. Size and age come before colour." } },
            { text: { bn: "a big old red ball", en: "a big old red ball" }, right: true, why: { bn: "হ্যাঁ। আকার, বয়স, রং: big old red।", en: "Yes. Size, age, colour: big old red." } },
            { text: { bn: "an old red big ball", en: "an old red big ball" }, why: { bn: "না। আকার সবার আগে: big।", en: "No. Size comes first: big." } },
          ],
        },
        {
          ask: { bn: "The pitha smells ___. কোনটা?", en: "The pitha smells ___. Which?" },
          options: [
            { text: { bn: "wonderful", en: "wonderful" }, right: true, why: { bn: "হ্যাঁ। smell একটা অবস্থার ক্রিয়া, be-র মতো: পরে adjective।", en: "Yes. Smell is a state verb like be, and takes an adjective after it." } },
            { text: { bn: "wonderfully", en: "wonderfully" }, why: { bn: "না। adverb বসে কাজের পাশে। এখানে পিঠা কিছু করছে না, শুধু একটা অবস্থায় আছে।", en: "No. An adverb goes beside an action. The pitha is not doing anything; it is in a state." } },
          ],
        },
        {
          ask: { bn: "This puzzle is ___ than that one. কোনটা?", en: "This puzzle is ___ than that one. Which?" },
          options: [
            { text: { bn: "more easy", en: "more easy" }, why: { bn: "না। easy দুই সিলেবল, -y দিয়ে শেষ: easier।", en: "No. Easy has two syllables and ends in -y: easier." } },
            { text: { bn: "easier", en: "easier" }, right: true, why: { bn: "হ্যাঁ। ব্যঞ্জন + y, তাই -ier: easier than।", en: "Yes. Consonant + y takes -ier: easier than." } },
            { text: { bn: "easyer", en: "easyer" }, why: { bn: "না। y হয়ে যায় i: easier।", en: "No. The y turns to i: easier." } },
          ],
        },
      ],
    },
    "adjectives-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "দুই ক্রিকেটার নাও আর পাঁচটা তুলনা বলো: X is faster than Y. Y is more patient than X.", en: "Take two cricketers and say five comparisons: X is faster than Y. Y is more patient than X." } },
        { text: { bn: "পরিবারের সবচেয়ে … কে? পাঁচটা the -est বাক্য: Nanu is the oldest. Rafi is the noisiest.", en: "Who is the most … in the family? Five the -est sentences." } },
        { text: { bn: "নিজের ঘরের তিনটা জিনিসকে দুটো করে adjective দাও, ঠিক ক্রমে: a small blue bag।", en: "Give three things in your room two adjectives each, in the right order: a small blue bag." } },
        { text: { bn: "একটা সত্যি তিন ভাবে, জোরে: Dhaka is the biggest city. Dhaka is bigger than any other city. No other city is as big as Dhaka.", en: "One fact three ways, aloud: Dhaka is the biggest city. Dhaka is bigger than any other city. No other city is as big as Dhaka." } },
        { text: { bn: "আজ কেমন লাগছে আর কেন, -ed আর -ing দিয়ে: I am tired because the day was tiring.", en: "How you feel today and why, with -ed and -ing: I am tired because the day was tiring." } },
        { text: { bn: "সাতটা রেবেল তিন রূপে, তিনবার: good better best, bad worse worst…", en: "The seven rebels in three forms, three times: good better best, bad worse worst…" } },
      ],
    },
  },
};
