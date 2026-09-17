/* ============================================================
   01-players.ts: পর্ব ১, আটজন খেলোয়াড়: parts of speech.

   One part of the grammar term, gathered into the rung by
   `basic.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>রাফির স্কুলের ক্রিকেট দলে এগারোজন। কিন্তু কোচ স্যার বলেন, পজিশন আসলে কয়েকটা: ওপেনার, মিডল অর্ডার, কিপার, পেসার, স্পিনার। কে কোন পজিশনে খেলবে সেটা জানলেই দল সাজানো যায়। ইংরেজি বাক্যও ঠিক তাই: হাজার হাজার শব্দ, কিন্তু পজিশন মাত্র <span lang="en">eight</span>। ব্যাকরণের বইয়ে এদের নাম <span lang="en">parts of speech</span>।</p>

<p>এই একটা পর্ব পুরো টার্মের মানচিত্র। পরের চব্বিশটা পর্বে যে খেলোয়াড়দের নিয়ে আলাদা আলাদা কথা হবে, আজ তাদের সবাইকে এক লাইনে দাঁড় করানো। আর শুধু চেনা নয়: আজ প্রতিটা খেলোয়াড়কে কাছ থেকে দেখা, লেজ দেখে চেনার কৌশল, একই শব্দের চার রূপ, আর পরীক্ষায় এই প্রশ্নটা যেভাবে আসে, সেভাবে উত্তর দেওয়ার অভ্যাস।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>একটা শব্দ কোন জাতের, সেটা ঠিক হয় বাক্যে তার <em>কাজ</em> দিয়ে, চেহারা দিয়ে নয়।</li>
<li>আটজন: <span lang="en">noun, pronoun, verb, adjective, adverb, preposition, conjunction, interjection</span>।</li>
<li>প্রতিটা বাক্যে অন্তত একজন <span lang="en">verb</span> থাকতেই হবে। ক্রিয়া ছাড়া বাক্য হয় না।</li>
<li>একই শব্দ এক বাক্যে <span lang="en">noun</span>, আরেক বাক্যে <span lang="en">verb</span> হতে পারে: <span lang="en">a run</span> আর <span lang="en">to run</span>।</li>
<li>শব্দের লেজ প্রায়ই জাত বলে দেয়: <span lang="en">-tion</span> হলে noun, <span lang="en">-ful</span> হলে adjective, <span lang="en">-ly</span> হলে প্রায়ই adverb।</li>
</ul>
</div>

${mount("players-pattern")}

<h2>দলের তালিকা</h2>

<p>একটা করে নাম, একটা করে কাজ, একটা করে উদাহরণ। রাফির দল দিয়েই দেখো।</p>

<div class="table-scroll">
<table>
<thead><tr><th>খেলোয়াড়</th><th>কাজ</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">noun</span></td><td>নাম: মানুষ, জায়গা, জিনিস, ভাব</td><td><span lang="en">Rafi, Dhaka, bat, courage</span></td></tr>
<tr><td><span lang="en">pronoun</span></td><td>নামের বদলি</td><td><span lang="en">he, she, it, they, we</span></td></tr>
<tr><td><span lang="en">verb</span></td><td>কাজ, বা হওয়া</td><td><span lang="en">bowl, run, is, have</span></td></tr>
<tr><td><span lang="en">adjective</span></td><td>নামের রং: কেমন</td><td><span lang="en">fast, red, tired, brave</span></td></tr>
<tr><td><span lang="en">adverb</span></td><td>কাজের রং: কীভাবে, কখন, কোথায়</td><td><span lang="en">fast, always, here, very</span></td></tr>
<tr><td><span lang="en">preposition</span></td><td>জায়গা আর সময়ের সম্পর্ক</td><td><span lang="en">in, on, at, under, before</span></td></tr>
<tr><td><span lang="en">conjunction</span></td><td>জোড়ার শব্দ</td><td><span lang="en">and, but, because, so</span></td></tr>
<tr><td><span lang="en">interjection</span></td><td>হঠাৎ আওয়াজ</td><td><span lang="en">Wow! Oh no! Ouch!</span></td></tr>
</tbody>
</table>
</div>

<p>তানভীর ভাই বলে, <span lang="en">Spider-Man</span>-এর সেই লাইনটা মনে আছে? <span lang="en">With great power comes great responsibility.</span> এখানে <span lang="en">power</span> আর <span lang="en">responsibility</span> হলো <span lang="en">noun</span>, <span lang="en">great</span> দুবারই <span lang="en">adjective</span>, <span lang="en">comes</span> হলো <span lang="en">verb</span>, আর <span lang="en">with</span> একটা <span lang="en">preposition</span>। একটা বিখ্যাত লাইন, চারজন খেলোয়াড়।</p>

${mount("players-tree")}

<h2>কাজ দেখে চেনো, চেহারা দেখে নয়</h2>

<p>এটাই আজকের সবচেয়ে বড় কথা। <span lang="en">run</span> শব্দটা দেখে বলা যায় না ও কে। <span lang="en">Tamim can run fast</span> বাক্যে <span lang="en">run</span> একটা কাজ, তাই <span lang="en">verb</span>। <span lang="en">Tamim scored a quick run</span> বাক্যে <span lang="en">run</span> একটা জিনিস, একটা রান, তাই <span lang="en">noun</span>। একই শব্দ, দুই পজিশন। ঠিক যেমন শাকিব কখনো ব্যাটার, কখনো বোলার।</p>

${mount("players-lines")}

${mount("players-reveal")}

<h2>প্রতিটা খেলোয়াড়কে কাছ থেকে</h2>

<p>দলের তালিকাটা ম্যাচের আগের টিমশিট। এবার প্রত্যেকের খেলার ধরন। পরের পর্বগুলোতে এদের প্রত্যেকের নিজের পর্ব আছে, তাই এখানে শুধু যতটুকু চিনলে বাক্য পড়ে বলা যায় কে কী করছে।</p>

<p><strong><span lang="en">noun</span> চার জাতের।</strong> বিশেষ নাম, বড় হাতের অক্ষরে: <span lang="en">Rafi, Dhaka, Eid</span>। সাধারণ নাম: <span lang="en">boy, city, festival</span>। যা ছোঁয়া যায় না, শুধু ভাবা যায়: <span lang="en">courage, happiness, freedom</span>, এদের নাম <span lang="en">abstract noun</span>। আর একদল মানুষ বা জিনিসের একটা নাম: <span lang="en">team, family, class</span>, এরা <span lang="en">collective noun</span>। পর্ব ২-তে noun-এর পুরো গল্প।</p>

<p><strong><span lang="en">verb</span> দুই দলে খেলে।</strong> মূল ক্রিয়া, যেটা আসল কাজটা বলে: <span lang="en">play, eat, think</span>। আর সাহায্যকারী ক্রিয়া, যেটা মূল ক্রিয়ার সামনে দাঁড়িয়ে কাল, প্রশ্ন বা না বোঝায়: <span lang="en">is, was, have, do, will, can</span>। <span lang="en">Rafi is playing</span> বাক্যে <span lang="en">is</span> সাহায্যকারী, <span lang="en">playing</span> মূল। আর একদল ক্রিয়া কাজ নয়, হওয়া বোঝায়: <span lang="en">is, seem, become</span>। <span lang="en">Rafi is tired</span>: কোনো কাজ হচ্ছে না, শুধু একটা অবস্থা। এদের নাম <span lang="en">linking verb</span>, কারণ এরা কর্তাকে তার রঙের সাথে জুড়ে দেয়।</p>

<p><strong><span lang="en">adjective</span> শুধু রং নয়, সংখ্যাও।</strong> <span lang="en">three bats, many players, this ball, my kit</span>: এখানে <span lang="en">three, many, this, my</span> সবাই noun-কে বর্ণনা করছে, কতটা বা কোনটা। ব্যাকরণের বইয়ে এদের অনেকের আলাদা নাম আছে, <span lang="en">determiner</span>, কিন্তু কাজ দেখলে এরা adjective-এর জাতভাই। <span lang="en">a, an, the</span>-ও এই দলে, আর তাদের নিজের পর্ব আছে, পর্ব ৪।</p>

<p><strong><span lang="en">adverb</span> শুধু ক্রিয়াকে নয়, adjective-কেও রং দেয়।</strong> <span lang="en">very fast, really tired, too hot</span>: <span lang="en">very, really, too</span> এখানে adjective-কে বাড়াচ্ছে বা কমাচ্ছে। তাই adverb-এর কাজ তিনটা: ক্রিয়ার রং, adjective-এর রং, আর অন্য adverb-এর রং (<span lang="en">very quickly</span>)।</p>

<p><strong><span lang="en">preposition</span> কখনো একা থাকে না।</strong> তার পরে সবসময় একটা noun বা pronoun বসে, আর দুজন মিলে একটা টুকরো তৈরি করে: <span lang="en">in the box, at school, with him</span>। এই টুকরোটা পুরোটাই একসাথে কাজ করে, কোথায় বা কখন বলে।</p>

<p><strong><span lang="en">conjunction</span> দুই জাতের।</strong> সমান দুটোকে জোড়ে: <span lang="en">and, but, or, so</span>। আর একটাকে অন্যটার নিচে বসায়: <span lang="en">because, although, if, when</span>। <span lang="en">Rafi played and Mitu watched</span>: দুটো সমান কথা। <span lang="en">Rafi played although it rained</span>: দ্বিতীয়টা প্রথমটার একটা শর্ত। পর্ব ১৪-তে পুরো খেলা।</p>

<p><strong><span lang="en">interjection</span> দলের বাইরের লোক।</strong> ব্যাকরণের সাথে তার কোনো চুক্তি নেই: বাক্যের শুরুতে একটা আওয়াজ, তারপর একটা কমা বা বিস্ময়চিহ্ন, ব্যস। <span lang="en">Wow, what a catch! Oh no, he is out. Hey, wait!</span></p>

<h2>লেজ দেখে চেনো</h2>

<p>একটা শব্দ কে, সেটা বাক্যের কাজ দিয়ে ঠিক হয়। কিন্তু শব্দের শেষের অংশটা, তার লেজ, প্রায়ই একটা ইঙ্গিত দেয়। পরীক্ষার হলে অচেনা শব্দ দেখলে লেজটা দেখো।</p>

<div class="table-scroll">
<table>
<thead><tr><th>লেজ</th><th>প্রায়ই</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">-tion, -sion, -ment, -ness, -ity, -ship, -hood</span></td><td><span lang="en">noun</span></td><td><span lang="en">education, decision, movement, kindness, ability, friendship, childhood</span></td></tr>
<tr><td><span lang="en">-er, -or, -ist</span> (মানুষ)</td><td><span lang="en">noun</span></td><td><span lang="en">player, actor, artist</span></td></tr>
<tr><td><span lang="en">-ful, -less, -ous, -ive, -al, -able, -ish</span></td><td><span lang="en">adjective</span></td><td><span lang="en">careful, careless, famous, active, national, readable, childish</span></td></tr>
<tr><td><span lang="en">-ly</span></td><td><span lang="en">adverb</span> (প্রায়ই)</td><td><span lang="en">quickly, happily, carefully</span></td></tr>
<tr><td><span lang="en">-ize, -ify, -en, -ate</span></td><td><span lang="en">verb</span></td><td><span lang="en">realize, simplify, widen, educate</span></td></tr>
</tbody>
</table>
</div>

<p>এই ছকটা মুখস্থ নয়, চেনার জন্য। <span lang="en">happiness</span> দেখে কখনো দেখোনি? লেজ <span lang="en">-ness</span>, তাই noun, "সুখ"। <span lang="en">simplify</span>? লেজ <span lang="en">-ify</span>, তাই verb, "সহজ করা"। শব্দের মানে না জেনেও তার পজিশন বলা যায়, আর পরীক্ষায় সেটাই দরকার।</p>

${mount("players-suffix")}

<h2>একই শব্দ, চার পজিশন</h2>

<p>ইংরেজিতে একটা মূল থেকে চারটা খেলোয়াড় জন্মায়। <span lang="en">beauty</span> (noun, সৌন্দর্য), <span lang="en">beautiful</span> (adjective, সুন্দর), <span lang="en">beautifully</span> (adverb, সুন্দরভাবে), <span lang="en">beautify</span> (verb, সুন্দর করা)। একটা পরিবার, চারটা কাজ। পরীক্ষায় <span lang="en">right form of words</span> নামে যে প্রশ্নটা আসে, সেটা ঠিক এই পরিবার নিয়ে: বন্ধনীতে একটা রূপ দেওয়া থাকে, বাক্যে বসবে অন্য রূপ।</p>

<div class="table-scroll">
<table>
<thead><tr><th><span lang="en">noun</span></th><th><span lang="en">verb</span></th><th><span lang="en">adjective</span></th><th><span lang="en">adverb</span></th></tr></thead>
<tbody>
<tr><td><span lang="en">beauty</span></td><td><span lang="en">beautify</span></td><td><span lang="en">beautiful</span></td><td><span lang="en">beautifully</span></td></tr>
<tr><td><span lang="en">care</span></td><td><span lang="en">care</span></td><td><span lang="en">careful</span></td><td><span lang="en">carefully</span></td></tr>
<tr><td><span lang="en">success</span></td><td><span lang="en">succeed</span></td><td><span lang="en">successful</span></td><td><span lang="en">successfully</span></td></tr>
<tr><td><span lang="en">danger</span></td><td><span lang="en">endanger</span></td><td><span lang="en">dangerous</span></td><td><span lang="en">dangerously</span></td></tr>
<tr><td><span lang="en">strength</span></td><td><span lang="en">strengthen</span></td><td><span lang="en">strong</span></td><td><span lang="en">strongly</span></td></tr>
<tr><td><span lang="en">decision</span></td><td><span lang="en">decide</span></td><td><span lang="en">decisive</span></td><td><span lang="en">decisively</span></td></tr>
</tbody>
</table>
</div>

<p>কোন রূপটা বসবে, সেটা ঠিক করে খালি জায়গাটার আশপাশ। জায়গাটা যদি <span lang="en">a, the, his</span>-এর পরে হয়, noun। যদি noun-এর ঠিক আগে হয়, adjective। যদি ক্রিয়ার পরে হয় আর "কীভাবে" বোঝায়, adverb। যদি কর্তার পরে খালি জায়গা আর কোনো ক্রিয়া নেই, verb। জায়গাটা দেখো, তারপর পরিবার থেকে ঠিক সদস্যকে ডাকো।</p>

${mount("players-family")}

<h2>দ্রুত চেনার তিনটা প্রশ্ন</h2>

<ol class="step-list">
<li><strong>এটা কি কেউ বা কিছু?</strong> হ্যাঁ হলে <span lang="en">noun</span>। আগে <span lang="en">a, an, the</span> বসানো গেলে প্রায় নিশ্চিত: <span lang="en">a bat, the match</span>।</li>
<li><strong>এটা কি কাজ বা হওয়া?</strong> হ্যাঁ হলে <span lang="en">verb</span>। আগে <span lang="en">to</span> বসানো গেলে নিশ্চিত: <span lang="en">to bowl, to sleep</span>।</li>
<li><strong>এটা কি কোনো কিছুকে বর্ণনা করছে?</strong> নামকে করলে <span lang="en">adjective</span> (<span lang="en">a fast bowler</span>), কাজকে করলে <span lang="en">adverb</span> (<span lang="en">he bowls fast</span>)।</li>
</ol>

<p>বাকি চারজন ছোট শব্দ, আর তাদের সংখ্যা কম। <span lang="en">in, on, at, under, with, for, from, to</span> প্রায় সবসময় <span lang="en">preposition</span>; <span lang="en">and, but, or, because, so, if</span> হলো <span lang="en">conjunction</span>; বিস্ময়চিহ্ন দেখলে <span lang="en">interjection</span>।</p>

${mount("players-order")}

${mount("players-bins")}

<h2>নানুর গল্পে আটজন</h2>

<p>নানু রাতে ঠাকুরমার ঝুলি থেকে গল্প বলেন। একটা লাইন ইংরেজিতে ধরো: <span lang="en">The clever fox quietly walked into the dark forest, but the tiger saw him. Oh!</span></p>

<p>এখানে সবাই আছে। <span lang="en">fox, forest, tiger</span> হলো <span lang="en">noun</span>। <span lang="en">him</span> হলো <span lang="en">pronoun</span>। <span lang="en">walked, saw</span> হলো <span lang="en">verb</span>। <span lang="en">clever, dark</span> হলো <span lang="en">adjective</span>। <span lang="en">quietly</span> হলো <span lang="en">adverb</span>। <span lang="en">into</span> হলো <span lang="en">preposition</span>। <span lang="en">but</span> হলো <span lang="en">conjunction</span>। আর শেষের <span lang="en">Oh!</span> হলো <span lang="en">interjection</span>। একটা বাক্যে পুরো দল।</p>

<p>এবার নিজে একটা বানাও। নানুর গল্পের যেকোনো একটা দৃশ্য নাও, আর চেষ্টা করো এক বাক্যে আটজনকেই নামাতে। প্রথমে কষ্ট হবে, তৃতীয়বারে হয়ে যাবে। এই খেলাটার নাম "পুরো দল"।</p>

${mount("players-build")}

<h2>যে জায়গাগুলোয় সবাই আটকায়</h2>

<p>কিছু শব্দ দুই দলে খেলে, আর পরীক্ষায় ঠিক সেগুলোই আসে। নিচের ছকটা সেই শব্দগুলোর: একই শব্দ, দুই বাক্য, দুই পজিশন।</p>

<div class="table-scroll">
<table>
<thead><tr><th>শব্দ</th><th>এক পজিশনে</th><th>অন্য পজিশনে</th></tr></thead>
<tbody>
<tr><td><span lang="en">fast</span></td><td><span lang="en">a fast bowler</span> (adjective)</td><td><span lang="en">he bowls fast</span> (adverb)</td></tr>
<tr><td><span lang="en">that</span></td><td><span lang="en">that ball</span> (adjective, কোনটা)</td><td><span lang="en">I know that he lied</span> (conjunction)</td></tr>
<tr><td><span lang="en">well</span></td><td><span lang="en">she plays well</span> (adverb)</td><td><span lang="en">I am well</span> (adjective, সুস্থ)</td></tr>
<tr><td><span lang="en">like</span></td><td><span lang="en">I like mangoes</span> (verb)</td><td><span lang="en">he runs like a deer</span> (preposition, মতো)</td></tr>
<tr><td><span lang="en">before</span></td><td><span lang="en">before the match</span> (preposition)</td><td><span lang="en">wash your hands before you eat</span> (conjunction)</td></tr>
<tr><td><span lang="en">light</span></td><td><span lang="en">turn on the light</span> (noun)</td><td><span lang="en">a light bag</span> (adjective)</td></tr>
<tr><td><span lang="en">water</span></td><td><span lang="en">drink water</span> (noun)</td><td><span lang="en">water the plants</span> (verb)</td></tr>
</tbody>
</table>
</div>

${mount("players-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>এই পর্বের প্রশ্ন দুই চেহারায় আসে। প্রথমটা: একটা অনুচ্ছেদ, কয়েকটা শব্দের নিচে দাগ, আর বলা হয় <span lang="en">Identify the parts of speech of the underlined words.</span> দ্বিতীয়টা: বন্ধনীতে একটা শব্দ, খালি জায়গায় তার ঠিক রূপটা বসাতে হবে, <span lang="en">right form of words</span>। দুটোরই ধাপ একই।</p>

<ol class="step-list">
<li><strong>শব্দটা একা দেখো না, আগে-পরে দেখো।</strong> <span lang="en">The tired players walked slowly.</span> <span lang="en">tired</span>-এর আগে <span lang="en">The</span>, পরে <span lang="en">players</span> (noun): noun-এর আগে বসে তাকে বর্ণনা করছে, তাই adjective।</li>
<li><strong>ক্রিয়াটা খোঁজো।</strong> <span lang="en">walked</span>: কাজ, অতীতে। এটাই verb। ক্রিয়া পেলে বাকি সবাইকে তার চারপাশে সাজানো যায়।</li>
<li><strong>ক্রিয়ার পরে যে শব্দ "কীভাবে" বলছে, সে adverb।</strong> <span lang="en">slowly</span>: কীভাবে হাঁটল? ধীরে। লেজে <span lang="en">-ly</span>, কাজটাকে রং দিচ্ছে।</li>
<li><strong>উত্তরে জাতের পুরো নাম লেখো।</strong> <span lang="en">tired: adjective; walked: verb; slowly: adverb.</span> শুধু <span lang="en">adj.</span> লিখলে অনেক স্যার নম্বর কাটেন।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Mitu is a brilliant student, and she always studies quietly at night.</span> দাগ দেওয়া: <span lang="en">brilliant</span> (noun-এর আগে: adjective), <span lang="en">and</span> (দুটো বাক্য জোড়ে: conjunction), <span lang="en">always</span> (কত ঘন ঘন: adverb), <span lang="en">studies</span> (কাজ: verb), <span lang="en">at</span> (সময়ের সম্পর্ক: preposition), <span lang="en">night</span> (একটা জিনিস: noun)। ছয়টা শব্দ, ছয়টা উত্তর, দুই মিনিট।</div>

${mount("players-exam")}

${mount("players-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Parts of speech</span> চিহ্নিত করতে বললে শব্দটা আলাদা করে দেখো না, তার আগে-পরে কী আছে দেখো। আগে <span lang="en">the</span> বা <span lang="en">a</span> থাকলে <span lang="en">noun</span>; আগে <span lang="en">is, was, can, will</span> থাকলে <span lang="en">verb</span>; শেষে <span lang="en">-ly</span> থাকলে প্রায় সবসময় <span lang="en">adverb</span>। দুই সেকেন্ডে উত্তর।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">-ly</span> দেখলেই <span lang="en">adverb</span> ভেবো না। <span lang="en">friendly, lovely, lonely</span> সবগুলো <span lang="en">adjective</span>: <span lang="en">a friendly dog</span>। আর <span lang="en">fast, hard, late, early</span> কোনো <span lang="en">-ly</span> ছাড়াই দুই কাজই করে: <span lang="en">a fast car</span> (adjective), <span lang="en">he drives fast</span> (adverb)।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p><span lang="en">-ing</span> দিয়ে শেষ হওয়া শব্দ তিন জায়গায় খেলে। <span lang="en">Rafi is playing</span>: ক্রিয়ার অংশ। <span lang="en">Playing is fun</span>: কর্তা, তাই noun-এর কাজ। <span lang="en">a playing child</span>: noun-এর আগে, adjective। শব্দটা দেখে নয়, জায়গাটা দেখে বলো। এই তিন <span lang="en">-ing</span> পর্ব ১৮-তে আবার ফিরে আসবে।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>আটজন খেলোয়াড়ের নাম না দেখে বলতে পারি, আর প্রত্যেকের একটা করে উদাহরণ?</li>
<li>একটা শব্দ দেখে বলতে পারি সে কোন পজিশনে, আগে-পরে দেখে?</li>
<li><span lang="en">run, light, water, fast</span>: প্রতিটার দুই পজিশনের দুটো বাক্য বলতে পারি?</li>
<li><span lang="en">beauty, beautiful, beautifully, beautify</span>: চারটা রূপ চারটা বাক্যে বসাতে পারি?</li>
<li>লেজ দেখে অচেনা শব্দের জাত আন্দাজ করতে পারি?</li>
</ul>
</div>

${mount("players-drill")}
`,
  blocks: {
    "players-pattern": {
      kind: "pattern",
      title: { bn: "একটা বাক্য, চারটা পজিশন", en: "One sentence, four positions" },
      shape: "WHO (noun / pronoun) + DOES (verb) + WHAT (noun) + HOW (adverb)",
      why: { bn: "যেকোনো ইংরেজি বাক্য এই চারটা ঘরের ভিতরে বসে। কে, কী করে, কী, কীভাবে। বাকি চারজন এই ঘরগুলোর মাঝে সেতু আর রং।", en: "Every English sentence sits in these four slots: who, does, what, how. The other four players are the bridges and the colour between them." },
      examples: [
        { target: "Rafi hits the ball hard.", bn: "রাফি বলটা জোরে মারে। (noun, verb, noun, adverb)" },
        { target: "She reads stories quietly.", bn: "সে চুপচাপ গল্প পড়ে। (pronoun, verb, noun, adverb)" },
        { target: "The old cat sleeps peacefully.", bn: "বুড়ো বেড়ালটা শান্তিতে ঘুমায়। (adjective + noun, verb, adverb)" },
        { target: "Nanu tells long stories at night.", bn: "নানু রাতে লম্বা গল্প বলেন। (noun, verb, adjective + noun, preposition + noun)" },
      ],
      tip: { bn: "প্রতিটা ঘরে এক এক করে অন্য শব্দ বসাও: Rafi-র জায়গায় Mitu, hits-এর জায়গায় throws। ঘর একই, বাক্য নতুন।", en: "Swap one slot at a time: Mitu for Rafi, throws for hits. Same slots, new sentence." },
    },
    "players-tree": {
      kind: "figure",
      shape: "tree",
      title: { bn: "আটজন, চার দলে", en: "Eight players, four groups" },
      screen: { title: { bn: "একটা ইংরেজি বাক্য", en: "One English sentence" } },
      parts: [
        { text: { bn: "নামের দল", en: "The naming group" }, note: { bn: "noun (Rafi, bat), pronoun (he, it)", en: "noun (Rafi, bat), pronoun (he, it)" }, tone: "lead" },
        { text: { bn: "কাজের দল", en: "The doing group" }, note: { bn: "verb (play, is, have): একজন হলেও থাকতেই হবে", en: "verb (play, is, have): at least one, always" }, tone: "good" },
        { text: { bn: "রঙের দল", en: "The colouring group" }, note: { bn: "adjective (fast, red) নামের রং, adverb (fast, always) কাজের রং", en: "adjective (fast, red) colours a noun, adverb (fast, always) colours a verb" } },
        { text: { bn: "ছোট শব্দের দল", en: "The small-word group" }, note: { bn: "preposition (in, at), conjunction (and, but), interjection (Wow!)", en: "preposition (in, at), conjunction (and, but), interjection (Wow!)" } },
      ],
      caption: { bn: "একটা বাক্যে কমপক্ষে নামের দল আর কাজের দল। বাকি দুই দল রং আর সেতু।", en: "A sentence needs the naming group and the doing group at least. The other two are colour and bridges." },
    },
    "players-lines": {
      kind: "lines",
      title: { bn: "একই শব্দ, দুই পজিশন", en: "Same word, two positions" },
      note: { bn: "শোনো, আর মোটা শব্দটা কী কাজ করছে বলো।", en: "Listen, and say what job the key word is doing." },
      lines: [
        { target: "I love a good run in the morning.", bn: "সকালে একটা ভালো দৌড় আমার খুব পছন্দ। (run: noun)" },
        { target: "I run every morning.", bn: "আমি রোজ সকালে দৌড়াই। (run: verb)" },
        { target: "Give me a light, please.", bn: "একটা আলো দাও তো। (light: noun)" },
        { target: "This bag is very light.", bn: "এই ব্যাগটা খুব হালকা। (light: adjective)" },
        { target: "Please water the plants.", bn: "গাছগুলোতে পানি দাও তো। (water: verb)" },
        { target: "The water is cold.", bn: "পানিটা ঠান্ডা। (water: noun)" },
        { target: "He runs like a deer.", bn: "সে হরিণের মতো দৌড়ায়। (like: preposition)" },
        { target: "I like his bowling.", bn: "আমার তার বোলিং ভালো লাগে। (like: verb)" },
      ],
    },
    "players-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: bat কে?", en: "Guess first: who is bat?" },
      ask: { bn: "Rafi will bat first, and his bat is new. দুটো bat: প্রথমটা কে, দ্বিতীয়টা কে?", en: "Rafi will bat first, and his bat is new. Two bats: what is the first, what is the second?" },
      choices: [
        { bn: "দুটোই noun", en: "Both are nouns" },
        { bn: "প্রথমটা verb, দ্বিতীয়টা noun", en: "The first is a verb, the second a noun" },
        { bn: "প্রথমটা noun, দ্বিতীয়টা verb", en: "The first is a noun, the second a verb" },
      ],
      answer: { bn: "প্রথমটা verb, দ্বিতীয়টা noun।", en: "The first is a verb, the second a noun." },
      why: { bn: "প্রথম bat-এর আগে will, একটা সাহায্যকারী ক্রিয়া: will bat, ব্যাট করবে। কাজ, তাই verb। দ্বিতীয় bat-এর আগে his, আর সেটা একটা জিনিস যেটা নতুন: noun। একই বানান, দুই পজিশন। আগে-পরে দেখলেই ধরা যায়।", en: "The first bat follows will, a helping verb: will bat, an action, so a verb. The second follows his and is a thing that is new: a noun. Same spelling, two positions, and the neighbours give it away." },
    },
    "players-suffix": {
      kind: "match",
      title: { bn: "লেজ মেলাও", en: "Match the tail" },
      note: { bn: "বাঁ দিকের শব্দটা লেজ দেখে চেনো, আর ডান দিকে তার জাত।", en: "Read the tail of the word on the left and match it with its kind on the right." },
      pairs: [
        { left: { bn: "happiness", en: "happiness" }, right: { bn: "noun: -ness, একটা ভাব", en: "noun: -ness, a feeling" } },
        { left: { bn: "dangerous", en: "dangerous" }, right: { bn: "adjective: -ous, কেমন", en: "adjective: -ous, what kind" } },
        { left: { bn: "carefully", en: "carefully" }, right: { bn: "adverb: -ly, কীভাবে", en: "adverb: -ly, how" } },
        { left: { bn: "simplify", en: "simplify" }, right: { bn: "verb: -ify, করা", en: "verb: -ify, to make" } },
        { left: { bn: "friendship", en: "friendship" }, right: { bn: "noun: -ship, একটা সম্পর্ক", en: "noun: -ship, a relationship" } },
        { left: { bn: "childish", en: "childish" }, right: { bn: "adjective: -ish, মতো", en: "adjective: -ish, like a" } },
      ],
    },
    "players-family": {
      kind: "gap",
      title: { bn: "পরিবার থেকে ঠিক সদস্য", en: "The right member of the family" },
      note: { bn: "খালি জায়গার আগে-পরে দেখো: noun, verb, adjective, না adverb লাগবে? তারপর ছোঁও।", en: "Look either side of the gap: does it want a noun, a verb, an adjective or an adverb? Then tap." },
      items: [
        { text: "Mitu answered every question ___.", bn: "মিতু প্রতিটা প্রশ্নের উত্তর সঠিকভাবে দিল।", options: ["correct", "correctly", "correctness"], right: 1, why: { bn: "ক্রিয়ার পরে, কীভাবে উত্তর দিল: adverb, correctly।", en: "After the verb, saying how she answered: an adverb, correctly." } },
        { text: "Shakib is a ___ all-rounder.", bn: "শাকিব একজন সফল অলরাউন্ডার।", options: ["success", "succeed", "successful"], right: 2, why: { bn: "noun (all-rounder)-এর আগে, তাকে বর্ণনা করছে: adjective, successful।", en: "Before the noun all-rounder, describing it: an adjective, successful." } },
        { text: "Nanu's ___ surprised everyone.", bn: "নানুর সাহস সবাইকে অবাক করল।", options: ["brave", "bravery", "bravely"], right: 1, why: { bn: "Nanu's-এর পরে একটা জিনিস চাই, আর সেটা বাক্যের কর্তা: noun, bravery।", en: "After Nanu's a thing is needed, and it is the subject: a noun, bravery." } },
        { text: "The coach wants to ___ the team.", bn: "কোচ দলটাকে শক্ত করতে চান।", options: ["strong", "strength", "strengthen"], right: 2, why: { bn: "to-এর পরে সবসময় ক্রিয়া: strengthen। strong একটা adjective, strength একটা noun।", en: "After to comes a verb: strengthen. Strong is an adjective and strength a noun." } },
        { text: "It was a ___ decision.", bn: "এটা একটা বিপজ্জনক সিদ্ধান্ত ছিল।", options: ["danger", "dangerous", "dangerously"], right: 1, why: { bn: "a … decision: noun-এর আগে adjective, dangerous।", en: "A … decision: an adjective before the noun, dangerous." } },
        { text: "Rafi ___ to open the batting.", bn: "রাফি ব্যাটিং ওপেন করার সিদ্ধান্ত নিল।", options: ["decision", "decided", "decisive"], right: 1, why: { bn: "কর্তার পরে খালি জায়গা আর বাক্যে অন্য কোনো ক্রিয়া নেই: verb, decided।", en: "A gap after the subject and no other verb in the sentence: a verb, decided." } },
      ],
    },
    "players-order": {
      kind: "order",
      title: { bn: "চেনার ধাপ, ক্রমে", en: "The steps of spotting, in order" },
      note: { bn: "একটা অচেনা বাক্যে কে কী, বের করার ধাপগুলো ঠিক ক্রমে সাজাও।", en: "Put the steps for working out an unfamiliar sentence in the right order." },
      items: [
        { text: { bn: "প্রথমে ক্রিয়াটা খোঁজো: কাজ বা হওয়া কোন শব্দে", en: "First find the verb: which word is the action or the being" }, why: { bn: "ক্রিয়া ছাড়া বাক্য নেই, আর ক্রিয়া পেলে বাকি সবাইকে তার চারপাশে সাজানো যায়।", en: "No verb, no sentence, and once the verb is found everything else sits around it." } },
        { text: { bn: "তারপর জিজ্ঞেস করো, কাজটা কে করছে: সেটা noun বা pronoun, কর্তা", en: "Then ask who does it: that is a noun or pronoun, the subject" } },
        { text: { bn: "ক্রিয়ার পরে কী আছে দেখো: কী করছে, সেটা আরেকটা noun", en: "Look after the verb: what is done to is another noun" } },
        { text: { bn: "noun-গুলোর আগে যে শব্দ, সে adjective; ক্রিয়ার পাশে যে শব্দ, সে adverb", en: "A word before a noun is an adjective; a word beside the verb is an adverb" } },
        { text: { bn: "বাকি ছোট শব্দগুলো: in, at হলে preposition, and, but হলে conjunction", en: "The small words left over: in and at are prepositions, and and but are conjunctions" } },
      ],
    },
    "players-bins": {
      kind: "bins",
      title: { bn: "দল সাজাও", en: "Pick the team" },
      note: { bn: "প্রতিটা শব্দকে তার পজিশনে পাঠাও। শব্দগুলো নানুর গল্পের।", en: "Send each word to its position. The words are from Nanu's story." },
      bins: [
        { id: "noun", label: { bn: "noun: নাম", en: "noun" } },
        { id: "verb", label: { bn: "verb: কাজ", en: "verb" } },
        { id: "adj", label: { bn: "adjective: কেমন", en: "adjective" } },
        { id: "small", label: { bn: "ছোট শব্দ: prep / conj", en: "small words: prep / conj" } },
      ],
      items: [
        { text: { bn: "tiger", en: "tiger" }, bin: "noun", why: { bn: "একটা প্রাণী, একটা নাম। আগে the বসে: the tiger।", en: "An animal, a name. The fits before it: the tiger." } },
        { text: { bn: "walked", en: "walked" }, bin: "verb", why: { bn: "হাঁটা একটা কাজ, আর -ed বলছে সেটা অতীতে হয়েছে।", en: "Walking is an action, and -ed says it happened in the past." } },
        { text: { bn: "clever", en: "clever" }, bin: "adj", why: { bn: "শেয়ালটা কেমন? চালাক। নামকে বর্ণনা করছে।", en: "What is the fox like? Clever. It describes the noun." } },
        { text: { bn: "into", en: "into" }, bin: "small", why: { bn: "জঙ্গলের ভিতরে: জায়গার সম্পর্ক, তাই preposition।", en: "Into the forest: a relation of place, so a preposition." } },
        { text: { bn: "but", en: "but" }, bin: "small", why: { bn: "দুটো বাক্য জোড়া লাগাচ্ছে, তাই conjunction।", en: "It joins two sentences, so a conjunction." } },
        { text: { bn: "forest", en: "forest" }, bin: "noun", why: { bn: "একটা জায়গা। জায়গার নাম মানেই noun।", en: "A place. The name of a place is a noun." } },
        { text: { bn: "saw", en: "saw" }, bin: "verb", why: { bn: "see-এর অতীত রূপ। দেখা একটা কাজ।", en: "The past of see. Seeing is an action." } },
        { text: { bn: "dark", en: "dark" }, bin: "adj", why: { bn: "জঙ্গলটা কেমন? অন্ধকার। the dark forest।", en: "What is the forest like? Dark. The dark forest." } },
        { text: { bn: "courage", en: "courage" }, bin: "noun", why: { bn: "ছোঁয়া যায় না, কিন্তু একটা জিনিস: abstract noun।", en: "Cannot be touched, but it is a thing: an abstract noun." } },
        { text: { bn: "because", en: "because" }, bin: "small", why: { bn: "কারণ বলে দুটো কথা জোড়ে: conjunction।", en: "It joins two ideas with a reason: a conjunction." } },
      ],
    },
    "players-build": {
      kind: "build",
      title: { bn: "পুরো দল নামাও", en: "Field the whole team" },
      note: { bn: "শব্দগুলো এলোমেলো। ছাঁচটা মনে রেখে বাক্যটা সাজাও, আর সাজানোর পর প্রতিটা শব্দের পজিশন বলো।", en: "The words are shuffled. Build the sentence to the pattern, then name each word's position." },
      pattern: "adjective + noun + verb + adverb + preposition + noun",
      lines: [
        { target: "The brave boy swam quickly across the river.", bn: "সাহসী ছেলেটা দ্রুত নদী পার হয়ে সাঁতরাল।" },
        { target: "A clever fox walked quietly into the forest.", bn: "একটা চালাক শেয়াল চুপচাপ জঙ্গলে ঢুকল।" },
        { target: "The tired players sat silently on the bench.", bn: "ক্লান্ত খেলোয়াড়রা চুপচাপ বেঞ্চে বসল।" },
        { target: "Nanu tells old stories slowly at night.", bn: "নানু রাতে ধীরে ধীরে পুরনো গল্প বলেন।" },
        { target: "Wow, the young batter hit the ball hard!", bn: "বাহ, তরুণ ব্যাটার বলটা জোরে মারল!" },
      ],
    },
    "players-spot": {
      kind: "spot",
      title: { bn: "ভুল পজিশনে খেলোয়াড়", en: "A player in the wrong position" },
      note: { bn: "রাফির রচনায় কিছু শব্দ ভুল পজিশনে খেলছে: adjective-এর জায়গায় adverb, noun-এর জায়গায় verb। যে লাইনে ভুল, সেটা ছোঁও।", en: "Some words in Rafi's essay are playing the wrong position: an adverb where an adjective belongs, a verb where a noun belongs. Tap every line with a mistake." },
      source: { bn: "রচনা: আমার প্রিয় খেলোয়াড়", en: "Essay: my favourite player" },
      lines: [
        { text: { bn: "Shakib is a very talented all-rounder.", en: "Shakib is a very talented all-rounder." } },
        { text: { bn: "He bats good and bowls even better.", en: "He bats good and bowls even better." }, flag: { bn: "ক্রিয়ার পরে কীভাবে: adverb চাই। good নয়, well।", en: "After the verb, how: an adverb is needed. Not good but well." } },
        { text: { bn: "His success is not a surprise to anyone.", en: "His success is not a surprise to anyone." } },
        { text: { bn: "He practises with great care every morning.", en: "He practises with great care every morning." } },
        { text: { bn: "He is a real hero, and he plays brave in every match.", en: "He is a real hero, and he plays brave in every match." }, flag: { bn: "plays-এর পরে কীভাবে: bravely। brave একটা adjective।", en: "After plays, how: bravely. Brave is an adjective." } },
        { text: { bn: "Everyone admires his decide to keep playing.", en: "Everyone admires his decide to keep playing." }, flag: { bn: "his-এর পরে একটা noun চাই: decision। decide একটা verb।", en: "After his a noun is needed: decision. Decide is a verb." } },
        { text: { bn: "I want to be as calm as him one day.", en: "I want to be as calm as him one day." } },
      ],
    },
    "players-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল: দাগ দেওয়া শব্দ", en: "The exam room: the underlined word" },
      note: { bn: "প্রতিটা প্রশ্নে একটা বাক্য আর একটা শব্দ। আগে-পরে দেখে জাত বলো।", en: "Each question gives a sentence and one word. Read its neighbours and name its kind." },
      questions: [
        {
          ask: { bn: "I know that Rafi is honest. এখানে that কী?", en: "I know that Rafi is honest. What is that?" },
          options: [
            { text: { bn: "adjective", en: "adjective" }, why: { bn: "না। that adjective হয় noun-এর আগে বসলে: that ball। এখানে পরে একটা পুরো বাক্য।", en: "No. That is an adjective before a noun: that ball. Here a whole clause follows." } },
            { text: { bn: "conjunction", en: "conjunction" }, right: true, why: { bn: "হ্যাঁ। I know আর Rafi is honest, দুটো বাক্য জোড়া লাগাচ্ছে: conjunction।", en: "Yes. It joins I know and Rafi is honest, two clauses: a conjunction." } },
            { text: { bn: "pronoun", en: "pronoun" }, why: { bn: "না। pronoun হলে নামের বদলি হতো: That is my bat। এখানে কোনো নামের বদলি নয়, জোড়া।", en: "No. As a pronoun it would replace a name: That is my bat. Here it joins, it does not replace." } },
          ],
        },
        {
          ask: { bn: "Playing cricket is fun. এখানে Playing কী কাজ করছে?", en: "Playing cricket is fun. What job is Playing doing?" },
          options: [
            { text: { bn: "verb", en: "verb" }, why: { bn: "না। বাক্যের ক্রিয়া is। Playing এখানে কাজ করছে না, কাজটার নাম বলছে।", en: "No. The verb of the sentence is is. Playing is not doing here; it names the doing." } },
            { text: { bn: "noun", en: "noun" }, right: true, why: { bn: "হ্যাঁ। কী মজার? খেলা। বাক্যের কর্তা, একটা জিনিসের মতো: noun-এর কাজ। -ing হলেও।", en: "Yes. What is fun? Playing. The subject, treated like a thing: a noun's job, -ing or not." } },
            { text: { bn: "adverb", en: "adverb" }, why: { bn: "না। adverb কাজকে রং দেয়। এখানে Playing নিজেই বাক্যের বিষয়।", en: "No. An adverb colours an action. Here Playing is the subject itself." } },
          ],
        },
        {
          ask: { bn: "The team played well, but the captain was not well. দুটো well: কে কে?", en: "The team played well, but the captain was not well. The two wells: what are they?" },
          options: [
            { text: { bn: "দুটোই adverb", en: "Both adverbs" }, why: { bn: "না। দ্বিতীয় well বসেছে was-এর পরে, অধিনায়ক কেমন ছিল: সুস্থ নয়। সেটা adjective।", en: "No. The second well sits after was and says what the captain was like: not healthy. That is an adjective." } },
            { text: { bn: "প্রথমটা adverb, দ্বিতীয়টা adjective", en: "The first an adverb, the second an adjective" }, right: true, why: { bn: "হ্যাঁ। played well: কীভাবে খেলল, adverb। was not well: কেমন ছিল, সুস্থ নয়, adjective।", en: "Yes. Played well: how they played, an adverb. Was not well: what he was like, unwell, an adjective." } },
            { text: { bn: "দুটোই adjective", en: "Both adjectives" }, why: { bn: "না। প্রথম well ক্রিয়া played-কে রং দিচ্ছে, কীভাবে খেলল। সেটা adverb।", en: "No. The first well colours the verb played, how they played. That is an adverb." } },
          ],
        },
        {
          ask: { bn: "Nanu spoke before the meeting, and she left before it ended. দুটো before: কে কে?", en: "Nanu spoke before the meeting, and she left before it ended. The two befores?" },
          options: [
            { text: { bn: "প্রথমটা preposition, দ্বিতীয়টা conjunction", en: "The first a preposition, the second a conjunction" }, right: true, why: { bn: "হ্যাঁ। before the meeting: পরে শুধু একটা noun, preposition। before it ended: পরে কর্তা আর ক্রিয়া সহ একটা পুরো বাক্য, conjunction।", en: "Yes. Before the meeting: only a noun follows, a preposition. Before it ended: a whole clause with a subject and verb follows, a conjunction." } },
            { text: { bn: "দুটোই preposition", en: "Both prepositions" }, why: { bn: "না। preposition-এর পরে বসে একটা noun, পুরো বাক্য নয়। it ended একটা পুরো বাক্য।", en: "No. A preposition takes a noun after it, not a whole clause. It ended is a clause." } },
            { text: { bn: "দুটোই adverb", en: "Both adverbs" }, why: { bn: "না। before একা দাঁড়ালে adverb হতে পারত: I have seen it before। এখানে দুবারই পরে কিছু আছে।", en: "No. Before alone can be an adverb: I have seen it before. Here something follows both times." } },
          ],
        },
      ],
    },
    "players-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "Shakib bowls beautifully. এখানে beautifully কী?", en: "Shakib bowls beautifully. What is beautifully?" },
          options: [
            { text: { bn: "adjective", en: "adjective" }, why: { bn: "না। adjective নামকে বর্ণনা করে। এখানে শাকিবকে নয়, তার বোলিং করাটাকে বর্ণনা করা হচ্ছে।", en: "No. An adjective describes a noun. This describes the bowling, not Shakib." } },
            { text: { bn: "adverb", en: "adverb" }, right: true, why: { bn: "হ্যাঁ। কীভাবে বল করে? সুন্দরভাবে। কাজকে বর্ণনা করলেই adverb।", en: "Yes. How does he bowl? Beautifully. Describing the action makes it an adverb." } },
            { text: { bn: "verb", en: "verb" }, why: { bn: "না। কাজটা হলো bowls। beautifully বলছে কাজটা কেমন করে হচ্ছে।", en: "No. The action is bowls. Beautifully says how it is done." } },
          ],
        },
        {
          ask: { bn: "Rafi wants a new bat. এখানে bat কী?", en: "Rafi wants a new bat. What is bat?" },
          options: [
            { text: { bn: "verb", en: "verb" }, why: { bn: "না। bat ক্রিয়াও হতে পারে (to bat), কিন্তু এখানে আগে a new বসেছে, মানে এটা একটা জিনিস।", en: "No. Bat can be a verb, but a new sits before it here, so it is a thing." } },
            { text: { bn: "noun", en: "noun" }, right: true, why: { bn: "হ্যাঁ। একটা জিনিস, আর আগে a বসেছে। রাফি যেটা চায়, সেটা।", en: "Yes. A thing, with a before it. The thing Rafi wants." } },
            { text: { bn: "adjective", en: "adjective" }, why: { bn: "না। adjective হলো new: ব্যাটটা কেমন? নতুন।", en: "No. The adjective is new: what kind of bat? A new one." } },
          ],
        },
        {
          ask: { bn: "Wow, what a catch! এখানে Wow কী?", en: "Wow, what a catch! What is Wow?" },
          options: [
            { text: { bn: "interjection", en: "interjection" }, right: true, why: { bn: "হ্যাঁ। হঠাৎ বেরিয়ে আসা আওয়াজ, বাক্যের সাথে ব্যাকরণের কোনো সম্পর্ক নেই।", en: "Yes. A sudden sound, with no grammatical tie to the sentence." } },
            { text: { bn: "adverb", en: "adverb" }, why: { bn: "না। Wow কোনো কাজকে বর্ণনা করছে না। ওটা শুধু অনুভূতি।", en: "No. Wow describes no action. It is only a feeling." } },
            { text: { bn: "noun", en: "noun" }, why: { bn: "না। কোনো জিনিস বা মানুষ নয়। noun এখানে catch।", en: "No. Not a thing or a person. The noun here is catch." } },
          ],
        },
        {
          ask: { bn: "Rafi is tired. এখানে is কী কাজ করছে?", en: "Rafi is tired. What is is doing?" },
          options: [
            { text: { bn: "কাজ বোঝাচ্ছে, তাই সাধারণ verb", en: "It shows an action, an ordinary verb" }, why: { bn: "না। এখানে কেউ কিছু করছে না। রাফি শুধু একটা অবস্থায় আছে।", en: "No. Nobody is doing anything. Rafi is only in a state." } },
            { text: { bn: "কর্তাকে তার রঙের সাথে জুড়ছে: linking verb", en: "It links the subject to its colour: a linking verb" }, right: true, why: { bn: "হ্যাঁ। is একটা সেতু: Rafi-কে tired-এর সাথে জুড়ে দিচ্ছে। হওয়া বোঝায়, করা নয়। তবু verb, কারণ বাক্যে ক্রিয়া এটাই।", en: "Yes. Is is a bridge joining Rafi to tired. It shows being, not doing, and it is still the sentence's verb." } },
            { text: { bn: "এটা adverb", en: "It is an adverb" }, why: { bn: "না। ক্রিয়া ছাড়া বাক্য হয় না, আর এই বাক্যে is-ই একমাত্র ক্রিয়া।", en: "No. A sentence needs a verb, and is is the only one here." } },
          ],
        },
      ],
    },
    "players-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      note: { bn: "স্ক্রিনের বাইরে, আজই। একটা করে টিক দাও।", en: "Away from the screen, today. Tick each one." },
      steps: [
        { text: { bn: "নিজের ঘরের দশটা জিনিসের ইংরেজি নাম জোরে বলো। প্রতিটা একটা noun।", en: "Say the English name of ten things in your room. Each one is a noun." }, hint: { bn: "table, fan, window, bag…", en: "table, fan, window, bag…" } },
        { text: { bn: "আজ যা যা করেছ, পাঁচটা verb দিয়ে বলো: I ate, I walked, I read…", en: "Say what you did today in five verbs: I ate, I walked, I read…" } },
        { text: { bn: "প্রিয় ক্রিকেটারকে তিনটা adjective দিয়ে বর্ণনা করো, জোরে।", en: "Describe your favourite cricketer in three adjectives, aloud." }, hint: { bn: "calm, brave, fast…", en: "calm, brave, fast…" } },
        { text: { bn: "একটা গানের বা সিনেমার ইংরেজি লাইন নাও, আর প্রতিটা শব্দের পজিশন বলো।", en: "Take one English line from a song or a film and name each word's position." } },
        { text: { bn: "beauty, beautiful, beautifully, beautify: চারটা রূপ দিয়ে চারটা বাক্য, জোরে। তারপর success পরিবার দিয়ে আরও চারটা।", en: "Four sentences with beauty, beautiful, beautifully, beautify, aloud. Then four more with the success family." } },
        { text: { bn: "আজকের খবরের কাগজের একটা ইংরেজি বাক্য নাও আর ক্রিয়া থেকে শুরু করে পাঁচ ধাপে প্রতিটা শব্দ চেনো।", en: "Take one English sentence from today's newspaper and, starting from the verb, name every word in five steps." } },
      ],
    },
  },
};
