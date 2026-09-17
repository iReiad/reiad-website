/* ============================================================
   02-nouns.ts: পর্ব ২, নাম-শব্দ: noun, একটা না অনেক.

   One part of the grammar term, gathered into the rung by
   `basic.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>মিতু আপু ইংরেজি পরীক্ষায় একটা বাক্য লিখেছিল: <span lang="en">I have many informations about the match.</span> স্যার লাল কালিতে <span lang="en">informations</span> কেটে দিয়েছেন। মিতু বুঝতে পারেনি কেন: একটার বেশি তথ্য থাকলে তো <span lang="en">-s</span> লাগবে? এই পর্বটা সেই প্রশ্নের উত্তর, আর <span lang="en">noun</span> নিয়ে যা যা জানা দরকার তার পুরোটা: গোনা যায় কি যায় না, একটা থেকে অনেক হওয়ার নিয়ম আর রেবেলরা, মাপার পাত্র, চার জাতের noun, কার জিনিস, বড় হাতের অক্ষর, আর পরীক্ষায় এই সব যেভাবে আসে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">noun</span> দুই জাতের: গোনা যায় (<span lang="en">countable</span>) আর গোনা যায় না (<span lang="en">uncountable</span>)।</li>
<li>গোনা যায় এমন noun-এর দুটো রূপ: একটা (<span lang="en">cat</span>) আর অনেক (<span lang="en">cats</span>)।</li>
<li>গোনা যায় না এমন noun-এর একটাই রূপ: <span lang="en">water, rice, information, advice</span>। এদের শেষে কখনো <span lang="en">-s</span> নয়।</li>
<li>গোনা যায় না এমন জিনিস মাপতে একটা পাত্র: <span lang="en">a cup of tea, a piece of advice</span>।</li>
<li>কয়েকটা noun নিয়ম মানে না: <span lang="en">child, children; man, men; foot, feet</span>। এরা রেবেল, মুখস্থ।</li>
<li>মালিকানা বোঝাতে <span lang="en">'s</span>: <span lang="en">Rafi's bat</span>। অনেকের হলে শুধু <span lang="en">'</span>: <span lang="en">the players' bus</span>।</li>
</ul>
</div>

${mount("nouns-pattern")}

<h2>গোনা যায়, নাকি যায় না</h2>

<p>এটাই noun-এর সবচেয়ে গুরুত্বপূর্ণ ভাগ, আর বাংলাভাষীর জন্য সবচেয়ে অচেনা। বাংলায় আমরা বলি "দুটো তথ্য", "তিনটে উপদেশ", "অনেক খবর"। ইংরেজিতে <span lang="en">information, advice, news</span> এমন জিনিস যা তরল পানির মতো: গোনা যায় না, শুধু মাপা যায়। তাই <span lang="en">two informations</span> নয়, <span lang="en">two pieces of information</span>। <span lang="en">an advice</span> নয়, <span lang="en">some advice</span>।</p>

<div class="table-scroll">
<table>
<thead><tr><th>গোনা যায় না</th><th>ভুল</th><th>ঠিক</th></tr></thead>
<tbody>
<tr><td><span lang="en">water</span></td><td><span lang="en">two waters</span></td><td><span lang="en">two glasses of water</span></td></tr>
<tr><td><span lang="en">rice</span></td><td><span lang="en">a rice</span></td><td><span lang="en">a plate of rice</span></td></tr>
<tr><td><span lang="en">information</span></td><td><span lang="en">informations</span></td><td><span lang="en">some information</span></td></tr>
<tr><td><span lang="en">advice</span></td><td><span lang="en">an advice</span></td><td><span lang="en">a piece of advice</span></td></tr>
<tr><td><span lang="en">furniture</span></td><td><span lang="en">furnitures</span></td><td><span lang="en">some furniture</span></td></tr>
<tr><td><span lang="en">homework</span></td><td><span lang="en">homeworks</span></td><td><span lang="en">a lot of homework</span></td></tr>
<tr><td><span lang="en">luggage</span></td><td><span lang="en">luggages</span></td><td><span lang="en">three bags</span></td></tr>
</tbody>
</table>
</div>

<p>একটা কান-পরীক্ষা: শব্দটার আগে <span lang="en">a</span> বা <span lang="en">one</span> বসানো যায়? <span lang="en">a cat</span>: যায়, তাই গোনা যায়। <span lang="en">a rice</span>: যায় না, তাই গোনা যায় না। এই পরীক্ষাটা নব্বই ভাগ সময় ঠিক উত্তর দেয়।</p>

<p>গোনা যায় না এমন জিনিসগুলো কয়েকটা দলে পড়ে, আর দল চিনলে নতুন শব্দও চেনা যায়। তরল আর গুঁড়ো: <span lang="en">water, milk, oil, sugar, salt, sand</span>। উপাদান: <span lang="en">wood, paper, gold, cotton</span>। ভাব আর অনুভূতি: <span lang="en">love, anger, courage, happiness</span>। অনেক ছোট জিনিসের একটা নাম: <span lang="en">furniture, luggage, equipment, money</span>। আর সেই বিখ্যাত তিনটে: <span lang="en">information, advice, news</span>। বাংলায় এদের সবাইকে গোনা যায়, তাই এখানেই ভুল হয়।</p>

${mount("nouns-bins")}

<h2>দুই মুখো noun</h2>

<p>কিছু শব্দ দুই দলেই খেলে, আর দলটা বদলালে মানেও বদলায়। <span lang="en">paper</span> মানে কাগজ, উপাদান, গোনা যায় না: <span lang="en">a sheet of paper</span>। কিন্তু <span lang="en">a paper</span> মানে একটা খবরের কাগজ বা একটা প্রশ্নপত্র, গোনা যায়। <span lang="en">chicken</span> মানে মুরগির মাংস, <span lang="en">a chicken</span> মানে একটা মুরগি। <span lang="en">hair</span> মানে মাথার চুল (সব মিলে), <span lang="en">a hair</span> মানে একটা চুল, স্যুপে পড়েছে। <span lang="en">time</span> মানে সময়, <span lang="en">three times</span> মানে তিনবার। <span lang="en">glass</span> মানে কাচ, <span lang="en">a glass</span> মানে একটা গ্লাস।</p>

<p>নিয়মটা: উপাদান বা ভাব হিসেবে বললে গোনা যায় না, একটা আলাদা টুকরো বা ঘটনা হিসেবে বললে গোনা যায়। <span lang="en">I love chicken</span> (মাংস)। <span lang="en">Nanu keeps six chickens</span> (ছয়টা মুরগি)। একই শব্দ, দুই ছবি।</p>

${mount("nouns-twoface")}

<h2>মাপার পাত্র</h2>

<p>গোনা যায় না এমন জিনিস গুনতে হলে ইংরেজি একটা পাত্র ধার করে: <span lang="en">a cup of tea</span>। কাপটা গোনা যায়, চা-টা নয়। এই পাত্রগুলো জোড়া হিসেবে শেখো, কারণ প্রতিটা জিনিসের নিজের পাত্র আছে।</p>

<div class="table-scroll">
<table>
<thead><tr><th>পাত্র</th><th>কী মাপে</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">a piece of</span></td><td>ভাব, খবর, আসবাব</td><td><span lang="en">a piece of advice, a piece of news, a piece of furniture</span></td></tr>
<tr><td><span lang="en">a cup of, a glass of, a bottle of</span></td><td>তরল</td><td><span lang="en">a cup of tea, a glass of water, a bottle of oil</span></td></tr>
<tr><td><span lang="en">a bag of, a kilo of</span></td><td>গুঁড়ো আর দানা</td><td><span lang="en">a bag of rice, a kilo of sugar</span></td></tr>
<tr><td><span lang="en">a loaf of, a slice of</span></td><td>রুটি, কেক</td><td><span lang="en">a loaf of bread, a slice of cake</span></td></tr>
<tr><td><span lang="en">a sheet of, a bar of, a drop of</span></td><td>কাগজ, সাবান, বৃষ্টি</td><td><span lang="en">a sheet of paper, a bar of soap, a drop of rain</span></td></tr>
<tr><td><span lang="en">a bit of, a lot of</span></td><td>যেকোনো কিছু, অল্প বা অনেক</td><td><span lang="en">a bit of luck, a lot of work</span></td></tr>
</tbody>
</table>
</div>

<p>এর ভিতরে সবচেয়ে কাজের <span lang="en">a piece of</span>: যে জিনিস মাপার আলাদা পাত্র নেই, তার সাথে এটা বসে। <span lang="en">a piece of information, two pieces of advice, a piece of furniture</span>। আর দ্বিতীয় সবচেয়ে কাজের <span lang="en">some</span>: পাত্র না বলে শুধু "একটু": <span lang="en">some water, some advice, some news</span>।</p>

${mount("nouns-measure")}

<h2>একটা থেকে অনেক: -s এর পাঁচটা রূপ</h2>

<p>বেশিরভাগ noun-এ শুধু <span lang="en">-s</span>। কিন্তু শব্দটা কী দিয়ে শেষ হচ্ছে তার উপর পাঁচটা ছোট নিয়ম আছে।</p>

<ol class="step-list">
<li><strong>সাধারণ:</strong> শুধু <span lang="en">-s</span>। <span lang="en">bat, bats; ball, balls; film, films</span>।</li>
<li><strong>শেষে <span lang="en">-s, -sh, -ch, -x</span>:</strong> <span lang="en">-es</span>, কারণ নইলে উচ্চারণ করা যায় না। <span lang="en">bus, buses; match, matches; box, boxes; wish, wishes</span>।</li>
<li><strong>শেষে ব্যঞ্জন + <span lang="en">-y</span>:</strong> <span lang="en">y</span> হয়ে যায় <span lang="en">-ies</span>। <span lang="en">story, stories; city, cities; baby, babies</span>। কিন্তু স্বর + y হলে শুধু -s: <span lang="en">day, days; key, keys</span>।</li>
<li><strong>শেষে <span lang="en">-f</span> বা <span lang="en">-fe</span>:</strong> প্রায়ই <span lang="en">-ves</span>। <span lang="en">leaf, leaves; knife, knives; wife, wives</span>।</li>
<li><strong>রেবেল:</strong> নিয়ম নেই, মুখস্থ। <span lang="en">child, children; man, men; woman, women; foot, feet; tooth, teeth; mouse, mice</span>। আর কয়েকটা একদমই বদলায় না: <span lang="en">sheep, sheep; fish, fish; deer, deer</span>।</li>
</ol>

<div class="ex"><b>ছোট গল্প:</b> নানু বলেন, <span lang="en">Three mice stole two loaves of bread and hid under the leaves.</span> এক লাইনে তিনটে রেবেল: <span lang="en">mice, loaves, leaves</span>। যে গল্পে রেবেলরা থাকে, সেটাই মনে থাকে।</div>

<h2>-o দিয়ে শেষ, আর বাকি রেবেলরা</h2>

<p><span lang="en">-o</span> দিয়ে শেষ হওয়া শব্দ দুই দলে। খাবার আর পুরনো শব্দে <span lang="en">-es</span>: <span lang="en">mango, mangoes; potato, potatoes; tomato, tomatoes; hero, heroes</span>। নতুন আর ছোট করা শব্দে শুধু <span lang="en">-s</span>: <span lang="en">photo, photos; piano, pianos; radio, radios; video, videos</span>। মনে রাখার কৌশল: যেটা খাওয়া যায় বা যে যুদ্ধ করে (<span lang="en">hero</span>), সেটা <span lang="en">-es</span>; যেটা যন্ত্র, সেটা <span lang="en">-s</span>।</p>

<p>রেবেলের তালিকাটা আরেকটু লম্বা, আর পরীক্ষায় এদের কেউ না কেউ থাকেই। <span lang="en">person, people; goose, geese; ox, oxen; louse, lice</span>। বিদেশ থেকে আসা কয়েকটা: <span lang="en">crisis, crises; basis, bases; phenomenon, phenomena; criterion, criteria</span>। আর কয়েকটা শব্দ সবসময় বহুবচন, একটা বললেও: <span lang="en">trousers, scissors, glasses, jeans</span>। একটা প্যান্ট গুনতে চাইলে <span lang="en">a pair of trousers</span>।</p>

${mount("nouns-factory")}

${mount("nouns-gap")}

<h2>noun-এর চার জাত</h2>

<p>পর্ব ১-এ এক লাইনে বলা হয়েছিল, এবার একটু কাছ থেকে। <strong>বিশেষ নাম</strong> (<span lang="en">proper noun</span>): একটাই, বড় হাতে। <span lang="en">Rafi, Dhaka, Bangladesh, Eid, Friday, the Padma</span>। <strong>সাধারণ নাম</strong> (<span lang="en">common noun</span>): যেকোনো একটা। <span lang="en">boy, city, country, festival, day, river</span>। <strong>ভাবের নাম</strong> (<span lang="en">abstract noun</span>): দেখা যায় না, ছোঁয়া যায় না, শুধু ভাবা যায়। <span lang="en">courage, honesty, childhood, freedom, beauty</span>। এরা প্রায় সবাই গোনা যায় না। <strong>দলের নাম</strong> (<span lang="en">collective noun</span>): অনেকে মিলে একটা। <span lang="en">team, family, class, crowd, flock, herd</span>।</p>

<p>দলের নামে একটা ফাঁদ আছে। <span lang="en">team</span> এগারোজন, কিন্তু শব্দটা একটা, তাই ক্রিয়ায় একজনের রূপ: <span lang="en">The team is playing well.</span> <span lang="en">My family is large.</span> <span lang="en">The class starts at nine.</span> ইংল্যান্ডে অনেকে <span lang="en">The team are</span> বলে, কিন্তু পরীক্ষার খাতায় <span lang="en">is</span>। আর <span lang="en">people</span> দলের নাম নয়, ওটা <span lang="en">person</span>-এর বহুবচন, তাই <span lang="en">People are kind</span>।</p>

<div class="table-scroll">
<table>
<thead><tr><th>দল</th><th>কার</th><th>দল</th><th>কার</th></tr></thead>
<tbody>
<tr><td><span lang="en">a team of</span></td><td><span lang="en">players</span></td><td><span lang="en">a flock of</span></td><td><span lang="en">birds, sheep</span></td></tr>
<tr><td><span lang="en">a crowd of</span></td><td><span lang="en">people</span></td><td><span lang="en">a herd of</span></td><td><span lang="en">cows, elephants</span></td></tr>
<tr><td><span lang="en">a bunch of</span></td><td><span lang="en">keys, flowers, bananas</span></td><td><span lang="en">a pack of</span></td><td><span lang="en">wolves, cards</span></td></tr>
<tr><td><span lang="en">a class of</span></td><td><span lang="en">students</span></td><td><span lang="en">a swarm of</span></td><td><span lang="en">bees</span></td></tr>
</tbody>
</table>
</div>

${mount("nouns-reveal")}

<h2>ভাবের নাম বানানো</h2>

<p>adjective আর verb থেকে ইংরেজি ভাবের noun বানায়, আর পরীক্ষার <span lang="en">right form</span> প্রশ্নে এটা বারবার আসে। <span lang="en">kind</span> থেকে <span lang="en">kindness</span>, <span lang="en">free</span> থেকে <span lang="en">freedom</span>, <span lang="en">child</span> থেকে <span lang="en">childhood</span>, <span lang="en">friend</span> থেকে <span lang="en">friendship</span>, <span lang="en">wise</span> থেকে <span lang="en">wisdom</span>, <span lang="en">brave</span> থেকে <span lang="en">bravery</span>, <span lang="en">strong</span> থেকে <span lang="en">strength</span>, <span lang="en">decide</span> থেকে <span lang="en">decision</span>, <span lang="en">know</span> থেকে <span lang="en">knowledge</span>, <span lang="en">grow</span> থেকে <span lang="en">growth</span>। লেজগুলো চেনো: <span lang="en">-ness, -dom, -hood, -ship, -ery, -th, -sion, -tion</span>। লেজ চিনলে অচেনা শব্দও চেনা।</p>

<p>এই noun-গুলো প্রায় সবাই গোনা যায় না, তাই <span lang="en">a</span> ছাড়া: <span lang="en">Honesty is the best policy. Kindness costs nothing.</span> আর বাক্যে এরা কর্তা হলে ক্রিয়ায় একজনের রূপ: <span lang="en">is, costs</span>।</p>

${mount("nouns-build")}

<h2>কার জিনিস: 's</h2>

<p>বাংলায় "রাফির ব্যাট"। ইংরেজিতে নামের শেষে একটা অ্যাপস্ট্রফি আর s: <span lang="en">Rafi's bat</span>। নামটা যদি আগে থেকেই <span lang="en">-s</span> দিয়ে শেষ হয়, যেমন অনেকের জিনিস, তাহলে শুধু অ্যাপস্ট্রফি: <span lang="en">the players' bus</span>, খেলোয়াড়দের বাস। জিনিসের ক্ষেত্রে সাধারণত <span lang="en">of</span>: <span lang="en">the door of the room</span>, <span lang="en">the room's door</span> নয়।</p>

<p>আরও তিনটে ছোট নিয়ম। রেবেল বহুবচন, যেটার শেষে s নেই, সেটা সাধারণ নিয়মে <span lang="en">'s</span> নেয়: <span lang="en">the children's room, the men's team, people's opinion</span>। দুজনের একটা জিনিস হলে শুধু শেষের নামে <span lang="en">'s</span>: <span lang="en">Rafi and Mitu's house</span> (একটাই বাড়ি, দুজনের)। দুজনের আলাদা জিনিস হলে দুজনেরই: <span lang="en">Rafi's and Mitu's bats</span> (দুটো ব্যাট)। আর সময়ের সাথেও <span lang="en">'s</span> বসে: <span lang="en">today's match, a week's holiday</span>।</p>

<div class="table-scroll">
<table>
<thead><tr><th>কার</th><th>লেখা</th><th>মানে</th></tr></thead>
<tbody>
<tr><td>একজন</td><td><span lang="en">the boy's bat</span></td><td>একটা ছেলের ব্যাট</td></tr>
<tr><td>অনেকে, শেষে s</td><td><span lang="en">the boys' bats</span></td><td>ছেলেদের ব্যাটগুলো</td></tr>
<tr><td>অনেকে, রেবেল</td><td><span lang="en">the children's bats</span></td><td>বাচ্চাদের ব্যাটগুলো</td></tr>
<tr><td>দুজনের একটা</td><td><span lang="en">Rafi and Mitu's house</span></td><td>একটা বাড়ি</td></tr>
<tr><td>দুজনের দুটো</td><td><span lang="en">Rafi's and Mitu's bats</span></td><td>দুটো ব্যাট</td></tr>
<tr><td>জিনিসের</td><td><span lang="en">the legs of the table</span></td><td>টেবিলের পা</td></tr>
</tbody>
</table>
</div>

${mount("nouns-lines")}

<h2>বড় হাতের অক্ষর কোথায়</h2>

<p>বিশেষ নাম (<span lang="en">proper noun</span>) সবসময় বড় হাতের অক্ষরে শুরু: মানুষের নাম, জায়গা, দিন, মাস, ভাষা, উৎসব। <span lang="en">Rafi, Dhaka, Friday, June, Bangla, Eid</span>। সাধারণ নাম (<span lang="en">common noun</span>) ছোট হাতে: <span lang="en">boy, city, day, month, language</span>। মিতু আপুর একটা কৌশল: প্রশ্ন করো, "এই নামের জিনিস দুনিয়ায় কয়টা?" একটা হলে বড় হাত, অনেক হলে ছোট।</p>

<p>দুটো ফাঁদ। ঋতুর নাম ছোট হাতে: <span lang="en">summer, winter, the rainy season</span>। আর একটা সাধারণ নাম বিশেষ নামের অংশ হলে বড় হাত হয়ে যায়: <span lang="en">a river</span> কিন্তু <span lang="en">the Padma River</span>; <span lang="en">a school</span> কিন্তু <span lang="en">Ideal School</span>; <span lang="en">uncle</span> কিন্তু <span lang="en">Uncle Habib</span>।</p>

<h2>noun বাক্যে কী কী কাজ করে</h2>

<p>একটা noun বাক্যে চার জায়গায় বসতে পারে, আর জায়গাটা চিনলে পর্ব ৩-এর pronoun আর পর্ব ৬-এর মিল, দুটোই সহজ হয়ে যায়। কর্তা হিসেবে, ক্রিয়ার আগে: <span lang="en">Rafi plays.</span> কর্ম হিসেবে, ক্রিয়ার পরে: <span lang="en">Rafi hit the ball.</span> preposition-এর পরে: <span lang="en">Rafi sat on the bench.</span> আর মালিক হিসেবে, <span lang="en">'s</span> সহ: <span lang="en">Rafi's bat</span>। একটা বাক্যে একই noun চার জায়গায় ঘুরিয়ে দেখো: <span lang="en">The bat is new. I bought the bat. I play with the bat. The bat's handle broke.</span></p>

${mount("nouns-jobs")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>noun-এর প্রশ্ন তিন চেহারায় আসে। এক: <span lang="en">right form</span>, বন্ধনীতে একটা noun, বসাতে হবে একটা না অনেক। দুই: <span lang="en">countable</span> না <span lang="en">uncountable</span>, বা <span lang="en">a piece of</span> বসানো। তিন: <span lang="en">gap filling</span>, যেখানে খালি জায়গায় একটা ঠিক noun বসাতে হয়, প্রায়ই <span lang="en">many/much/a lot of</span>-এর পরে। প্রতিটার ধাপ একই।</p>

<ol class="step-list">
<li><strong>শব্দটা কি গোনা যায়?</strong> <span lang="en">a</span> বসিয়ে দেখো। যায় না? তাহলে কখনো <span lang="en">-s</span> নয়, <span lang="en">many</span> নয়, <span lang="en">a</span> নয়: <span lang="en">much, some, a lot of, a piece of</span>।</li>
<li><strong>গোনা যায়? আগের শব্দটা দেখো।</strong> <span lang="en">two, many, several, these, few</span> থাকলে বহুবচন। <span lang="en">a, one, each, every, this</span> থাকলে একবচন।</li>
<li><strong>বহুবচন লাগলে বানানের পাঁচ নিয়ম।</strong> শেষের অক্ষর দেখো: <span lang="en">-ch</span> হলে <span lang="en">-es</span>, ব্যঞ্জন + <span lang="en">y</span> হলে <span lang="en">-ies</span>, <span lang="en">-f</span> হলে <span lang="en">-ves</span>। আর রেবেল হলে রেবেল।</li>
<li><strong>ক্রিয়াটা মেলাও।</strong> noun বদলালে ক্রিয়াও বদলায়: <span lang="en">The child is</span> কিন্তু <span lang="en">The children are</span>।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">The (child) ___ are playing with two (knife) ___, and Nanu has given them a lot of (advice) ___.</span> প্রথমটা: <span lang="en">are</span> আছে, তাই অনেক, রেবেল: <span lang="en">children</span>। দ্বিতীয়টা: <span lang="en">two</span>, <span lang="en">-fe</span>: <span lang="en">knives</span>। তৃতীয়টা: <span lang="en">advice</span> গোনা যায় না, <span lang="en">a lot of</span>-এর পরেও একই থাকে: <span lang="en">advice</span>। তিনটা খালি ঘর, তিনটা আলাদা নিয়ম।</div>

${mount("nouns-spot")}

${mount("nouns-exam")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Right form</span> বা <span lang="en">fill in the blanks</span>-এ যদি শূন্যস্থানের আগে <span lang="en">many, few, several, two</span> থাকে, উত্তর অনেক (<span lang="en">plural</span>)। আগে <span lang="en">much, little, a lot of, some</span> থাকলে গোনা যায় না এমন noun হতে পারে, তখন <span lang="en">-s</span> নয়। <span lang="en">many informations</span> লিখলে নম্বর যায়; <span lang="en">much information</span> লিখলে থাকে।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">people</span> শব্দটা দেখতে একবচন, কিন্তু এর মানে "মানুষজন", অনেক। তাই <span lang="en">People is</span> নয়, <span lang="en">People are kind</span>। উল্টো দিকে <span lang="en">news</span> শেষে s আছে, কিন্তু একবচন: <span lang="en">The news is good</span>। <span lang="en">Mathematics, physics, economics</span> সবই একই রকম: s আছে, কিন্তু একটা বিষয়, তাই <span lang="en">is</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>অ্যাপস্ট্রফি দিয়ে বহুবচন হয় না। <span lang="en">two mango's</span> ভুল, <span lang="en">two mangoes</span> ঠিক। অ্যাপস্ট্রফি শুধু মালিকানার জন্য (<span lang="en">Rafi's</span>) আর ছোট করার জন্য (<span lang="en">it's = it is</span>)। দোকানের সাইনবোর্ডে এই ভুলটা এত বেশি যে ইংরেজরা এর একটা নাম দিয়েছে: <span lang="en">the grocer's apostrophe</span>।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>দশটা গোনা যায় না এমন noun বলতে পারি, আর প্রতিটার একটা পাত্র?</li>
<li>বহুবচনের পাঁচ নিয়ম আর দশটা রেবেল না দেখে বলতে পারি?</li>
<li><span lang="en">paper</span> আর <span lang="en">a paper</span>-এর পার্থক্য বলতে পারি?</li>
<li><span lang="en">the boys' bats</span> আর <span lang="en">the children's bats</span>: অ্যাপস্ট্রফি কোথায়, কেন?</li>
<li><span lang="en">The news is</span>, <span lang="en">People are</span>, <span lang="en">The team is</span>: তিনটার কারণ বলতে পারি?</li>
</ul>
</div>

${mount("nouns-drill")}
`,
  blocks: {
    "nouns-pattern": {
      kind: "pattern",
      title: { bn: "একটা, অনেক, মাপা", en: "One, many, measured" },
      shape: "a + cat  ·  two + cats  ·  some + water  ·  a glass of + water",
      why: { bn: "গোনা যায় এমন জিনিসের সাথে সংখ্যা বসে, আর অনেক হলে -s। গোনা যায় না এমন জিনিসের সাথে সংখ্যা বসে না, বসে some, আর মাপতে হলে একটা পাত্র: a cup of, a piece of।", en: "Countable things take a number and an -s when there are many. Uncountable things take no number: some, or a container to measure with, a cup of, a piece of." },
      examples: [
        { target: "I have two cats and a dog.", bn: "আমার দুটো বেড়াল আর একটা কুকুর আছে।" },
        { target: "We need some rice and a bottle of oil.", bn: "আমাদের একটু চাল আর এক বোতল তেল লাগবে।" },
        { target: "She gave me a piece of advice.", bn: "সে আমাকে একটা উপদেশ দিল।" },
        { target: "The children are playing with three balls.", bn: "বাচ্চারা তিনটে বল নিয়ে খেলছে।" },
      ],
      tip: { bn: "সন্দেহ হলে a বসিয়ে দেখো। a ball: হয়। a rice: হয় না। ব্যস।", en: "In doubt, try a before it. A ball works. A rice does not. Done." },
    },
    "nouns-bins": {
      kind: "bins",
      title: { bn: "গোনা যায়, নাকি যায় না", en: "Count it, or measure it" },
      note: { bn: "প্রতিটা শব্দ ঠিক ঘরে ফেলো। কান-পরীক্ষা: আগে a বসে কি না।", en: "Sort each word. The ear test: does a fit before it?" },
      bins: [
        { id: "count", label: { bn: "গোনা যায়: a / two", en: "countable: a / two" }, tone: "good" },
        { id: "mass", label: { bn: "গোনা যায় না: some", en: "uncountable: some" }, tone: "warn" },
      ],
      items: [
        { text: { bn: "match", en: "match" }, bin: "count", why: { bn: "a match, two matches। ম্যাচ গোনা যায়।", en: "A match, two matches. Matches can be counted." } },
        { text: { bn: "information", en: "information" }, bin: "mass", why: { bn: "some information, a piece of information। কখনো informations নয়।", en: "Some information, a piece of information. Never informations." } },
        { text: { bn: "bat", en: "bat" }, bin: "count", why: { bn: "a bat, three bats।", en: "A bat, three bats." } },
        { text: { bn: "homework", en: "homework" }, bin: "mass", why: { bn: "a lot of homework। বাংলায় 'অনেকগুলো হোমওয়ার্ক' বলি, ইংরেজিতে নয়।", en: "A lot of homework. Bangla counts it; English does not." } },
        { text: { bn: "advice", en: "advice" }, bin: "mass", why: { bn: "some advice, a piece of advice।", en: "Some advice, a piece of advice." } },
        { text: { bn: "story", en: "story" }, bin: "count", why: { bn: "a story, many stories। নানুর ঝুলিতে অনেক।", en: "A story, many stories. Nanu has a bag full." } },
        { text: { bn: "money", en: "money" }, bin: "mass", why: { bn: "some money, a lot of money। টাকা গোনা যায়, money যায় না: two takas, কিন্তু some money।", en: "Some money, a lot of money. Takas are counted, money is not." } },
        { text: { bn: "player", en: "player" }, bin: "count", why: { bn: "a player, eleven players।", en: "A player, eleven players." } },
        { text: { bn: "furniture", en: "furniture" }, bin: "mass", why: { bn: "some furniture, a piece of furniture। একটা চেয়ার a chair, কিন্তু সব মিলে furniture।", en: "Some furniture, a piece of furniture. A chair is countable; furniture is not." } },
        { text: { bn: "equipment", en: "equipment" }, bin: "mass", why: { bn: "some equipment। একটা ব্যাট a bat, কিন্তু সব সরঞ্জাম মিলে equipment, s ছাড়া।", en: "Some equipment. A bat is a bat, but the kit as a whole is equipment, with no s." } },
        { text: { bn: "courage", en: "courage" }, bin: "mass", why: { bn: "একটা ভাব: some courage, a lot of courage। a courage নয়।", en: "A feeling: some courage, a lot of courage. Never a courage." } },
      ],
    },
    "nouns-twoface": {
      kind: "match",
      title: { bn: "দুই মুখো শব্দ মেলাও", en: "Match the two-faced words" },
      note: { bn: "বাঁ দিকের টুকরোটা ডান দিকের ঠিক মানের সাথে মেলাও। a আছে কি নেই, সেটাই সূত্র।", en: "Match each phrase on the left with its meaning on the right. Whether a is there is the clue." },
      pairs: [
        { left: { bn: "a paper", en: "a paper" }, right: { bn: "একটা খবরের কাগজ বা প্রশ্নপত্র", en: "a newspaper or an exam paper" } },
        { left: { bn: "paper", en: "paper" }, right: { bn: "কাগজ, উপাদান হিসেবে", en: "paper, the material" } },
        { left: { bn: "a chicken", en: "a chicken" }, right: { bn: "একটা জ্যান্ত মুরগি", en: "one live bird" } },
        { left: { bn: "chicken", en: "chicken" }, right: { bn: "মুরগির মাংস", en: "the meat" } },
        { left: { bn: "a hair", en: "a hair" }, right: { bn: "একটা চুল, যেমন স্যুপে", en: "one strand, as in the soup" } },
        { left: { bn: "three times", en: "three times" }, right: { bn: "তিনবার", en: "on three occasions" } },
        { left: { bn: "a glass", en: "a glass" }, right: { bn: "একটা পানির গ্লাস", en: "one drinking glass" } },
      ],
    },
    "nouns-measure": {
      kind: "gap",
      title: { bn: "কোন পাত্রে মাপবে", en: "Which container measures it" },
      note: { bn: "গোনা যায় না এমন জিনিসটার ঠিক পাত্রটা বসাও।", en: "Put the right container in front of the uncountable thing." },
      items: [
        { text: "Nanu gave me a ___ of advice.", bn: "নানু আমাকে একটা উপদেশ দিলেন।", options: ["piece", "cup", "loaf"], right: 0, why: { bn: "advice-এর নিজের পাত্র নেই, তাই a piece of advice।", en: "Advice has no container of its own, so a piece of advice." } },
        { text: "Please bring two ___ of water.", bn: "দুই গ্লাস পানি আনো তো।", options: ["glasses", "pieces", "sheets"], right: 0, why: { bn: "পানি তরল, গ্লাসে মাপা হয়: two glasses of water। glass-এর বহুবচন glasses।", en: "Water is a liquid measured in glasses: two glasses of water. The plural of glass is glasses." } },
        { text: "Ma bought a ___ of rice from the market.", bn: "মা বাজার থেকে এক বস্তা চাল কিনলেন।", options: ["slice", "bag", "drop"], right: 1, why: { bn: "দানা জিনিস বস্তায়: a bag of rice।", en: "Grain comes in a bag: a bag of rice." } },
        { text: "Give me a ___ of paper to write on.", bn: "লেখার জন্য একটা কাগজ দাও।", options: ["sheet", "bar", "bottle"], right: 0, why: { bn: "কাগজ পাতায় মাপা হয়: a sheet of paper।", en: "Paper is measured in sheets: a sheet of paper." } },
        { text: "That is a ___ of good news!", bn: "এটা একটা ভালো খবর!", options: ["piece", "kilo", "glass"], right: 0, why: { bn: "news গোনা যায় না, a news হয় না: a piece of news।", en: "News is uncountable and a news is impossible: a piece of news." } },
        { text: "We shared a ___ of cake after the match.", bn: "ম্যাচের পর আমরা এক টুকরো কেক ভাগ করে খেলাম।", options: ["loaf", "slice", "bag"], right: 1, why: { bn: "কেক টুকরোয়: a slice of cake। loaf রুটির জন্য।", en: "Cake comes in slices: a slice of cake. A loaf is for bread." } },
      ],
    },
    "nouns-factory": {
      kind: "bins",
      title: { bn: "বহুবচনের কারখানা", en: "The plural factory" },
      note: { bn: "প্রতিটা শব্দকে তার বহুবচনের নিয়মের ঘরে পাঠাও। শেষের অক্ষর দেখো।", en: "Send each word to the box of the rule its plural follows. Look at the last letters." },
      bins: [
        { id: "s", label: { bn: "শুধু -s", en: "just -s" } },
        { id: "es", label: { bn: "-es", en: "-es" } },
        { id: "ies", label: { bn: "y হয়ে যায় -ies", en: "y becomes -ies" } },
        { id: "ves", label: { bn: "f হয়ে যায় -ves", en: "f becomes -ves" } },
        { id: "rebel", label: { bn: "রেবেল", en: "rebel" }, tone: "warn" },
      ],
      items: [
        { text: { bn: "bus", en: "bus" }, bin: "es", why: { bn: "শেষে s, তাই buses।", en: "Ends in s, so buses." } },
        { text: { bn: "city", en: "city" }, bin: "ies", why: { bn: "ব্যঞ্জন + y: cities।", en: "Consonant + y: cities." } },
        { text: { bn: "knife", en: "knife" }, bin: "ves", why: { bn: "-fe: knives।", en: "-fe: knives." } },
        { text: { bn: "mango", en: "mango" }, bin: "es", why: { bn: "খাবার, -o: mangoes।", en: "A food ending in -o: mangoes." } },
        { text: { bn: "tooth", en: "tooth" }, bin: "rebel", why: { bn: "tooth, teeth। নিয়ম নেই।", en: "Tooth, teeth. No rule." } },
        { text: { bn: "photo", en: "photo" }, bin: "s", why: { bn: "যন্ত্র বা ছোট করা শব্দ, -o হলেও শুধু -s: photos।", en: "A device or a shortened word takes just -s despite the -o: photos." } },
        { text: { bn: "key", en: "key" }, bin: "s", why: { bn: "স্বর + y: শুধু -s, keys।", en: "Vowel + y: just -s, keys." } },
        { text: { bn: "wish", en: "wish" }, bin: "es", why: { bn: "শেষে -sh: wishes।", en: "Ends in -sh: wishes." } },
        { text: { bn: "leaf", en: "leaf" }, bin: "ves", why: { bn: "-f: leaves।", en: "-f: leaves." } },
        { text: { bn: "person", en: "person" }, bin: "rebel", why: { bn: "person, people। persons শুধু আইনের কাগজে।", en: "Person, people. Persons is only for legal papers." } },
        { text: { bn: "baby", en: "baby" }, bin: "ies", why: { bn: "ব্যঞ্জন + y: babies।", en: "Consonant + y: babies." } },
        { text: { bn: "sheep", en: "sheep" }, bin: "rebel", why: { bn: "sheep, sheep। বদলায়ই না।", en: "Sheep, sheep. It never changes." } },
      ],
    },
    "nouns-gap": {
      kind: "gap",
      title: { bn: "একটা থেকে অনেক", en: "One to many" },
      note: { bn: "ঠিক বহুবচনটা বসাও।", en: "Put in the right plural." },
      items: [
        { text: "Rafi has two new ___.", bn: "রাফির দুটো নতুন ব্যাট আছে।", options: ["bats", "bates", "bat"], right: 0, why: { bn: "সাধারণ noun, শুধু -s: bats। two থাকলে বহুবচন লাগবেই।", en: "A regular noun takes -s: bats. Two demands a plural." } },
        { text: "Bangladesh won three ___ this year.", bn: "বাংলাদেশ এ বছর তিনটে ম্যাচ জিতেছে।", options: ["matchs", "matches", "match"], right: 1, why: { bn: "-ch দিয়ে শেষ, তাই -es: matches। matchs উচ্চারণই করা যায় না।", en: "Ends in -ch, so -es: matches. Matchs cannot even be said." } },
        { text: "Nanu knows a hundred ___.", bn: "নানু একশোটা গল্প জানেন।", options: ["storys", "stories", "story"], right: 1, why: { bn: "ব্যঞ্জন + y, তাই y হয়ে যায় ies: stories।", en: "Consonant + y turns into ies: stories." } },
        { text: "The ___ are playing in the field.", bn: "বাচ্চারা মাঠে খেলছে।", options: ["childs", "childrens", "children"], right: 2, why: { bn: "রেবেল: child থেকে children। childrens বলে কিছু নেই, children-এ আগে থেকেই অনেক।", en: "A rebel: child becomes children. Childrens does not exist; children is already many." } },
        { text: "Please give me some ___.", bn: "আমাকে একটু পানি দাও তো।", options: ["water", "waters", "a water"], right: 0, why: { bn: "গোনা যায় না, তাই some water। শেষে s নয়, আগে a নয়।", en: "Uncountable, so some water. No -s after, no a before." } },
        { text: "Two ___ are grazing near the river.", bn: "দুটো ভেড়া নদীর ধারে ঘাস খাচ্ছে।", options: ["sheeps", "sheep", "sheepes"], right: 1, why: { bn: "sheep কখনো বদলায় না: one sheep, two sheep। fish আর deer-ও তাই।", en: "Sheep never changes: one sheep, two sheep. So do fish and deer." } },
        { text: "Ma cut the ___ for the salad.", bn: "মা সালাদের জন্য টমেটোগুলো কাটলেন।", options: ["tomatos", "tomatoes", "tomatoe"], right: 1, why: { bn: "খাবার, শেষে -o: tomatoes। potato, mango-ও তাই।", en: "A food ending in -o: tomatoes. So do potato and mango." } },
        { text: "The two ___ of the school met the parents.", bn: "স্কুলের দুই নারী শিক্ষক অভিভাবকদের সাথে দেখা করলেন।", options: ["womans", "women", "womens"], right: 1, why: { bn: "রেবেল: woman, women। বানানে a হয়ে যায় e, উচ্চারণে 'উইমেন'।", en: "A rebel: woman, women. The a turns to e in spelling, and the sound changes too." } },
      ],
    },
    "nouns-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: দল একজন না অনেক?", en: "Guess first: is a team one or many?" },
      ask: { bn: "Our team ___ practising hard, and the players ___ tired. দুটো খালি ঘরে is না are?", en: "Our team ___ practising hard, and the players ___ tired. Is or are in the two gaps?" },
      choices: [
        { bn: "are, are", en: "are, are" },
        { bn: "is, are", en: "is, are" },
        { bn: "is, is", en: "is, is" },
      ],
      answer: { bn: "is, are: The team is practising, the players are tired.", en: "Is, are: the team is practising, the players are tired." },
      why: { bn: "team একটা দলের নাম, collective noun, আর শব্দটা একটা, তাই is। players অনেকে, শেষে s, তাই are। একই এগারোজন, দুই শব্দ, দুই ক্রিয়া। পরীক্ষায় দলের নামে সবসময় একজনের রূপ।", en: "Team names one group, a collective noun, and the word is singular, so is. Players is many, with an s, so are. The same eleven people, two words, two verbs. In the exam a group name always takes the singular." },
    },
    "nouns-build": {
      kind: "build",
      title: { bn: "গোনা আর মাপা, বাক্যে", en: "Counting and measuring, in a sentence" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজাও, আর সাজানোর সময় দেখো কোথায় -s আছে আর কোথায় নেই।", en: "The words are shuffled. Build the sentence, and notice where the -s is and where it is not." },
      pattern: "number + plural  ·  some / a piece of + uncountable",
      lines: [
        { target: "We need some information about the match.", bn: "ম্যাচ নিয়ে আমাদের কিছু তথ্য দরকার।" },
        { target: "Nanu gave the children three pieces of advice.", bn: "নানু বাচ্চাদের তিনটে উপদেশ দিলেন।" },
        { target: "The men bought two loaves of bread.", bn: "লোকগুলো দুটো পাউরুটি কিনল।" },
        { target: "Honesty is the best policy.", bn: "সততাই সেরা নীতি।" },
        { target: "The news about the final is good.", bn: "ফাইনালের খবরটা ভালো।" },
        { target: "Rafi and Mitu's house has many rooms.", bn: "রাফি আর মিতুর বাড়িতে অনেক ঘর।" },
      ],
    },
    "nouns-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: কার জিনিস", en: "Listen, say: whose is it" },
      lines: [
        { target: "This is Rafi's bat.", bn: "এটা রাফির ব্যাট।" },
        { target: "Mitu's exam is on Sunday.", bn: "মিতুর পরীক্ষা রবিবার।" },
        { target: "The players' bus is late.", bn: "খেলোয়াড়দের বাস দেরি করেছে।" },
        { target: "Nanu's stories are the best.", bn: "নানুর গল্পগুলোই সেরা।" },
        { target: "The children's room is upstairs.", bn: "বাচ্চাদের ঘরটা উপরে।" },
        { target: "Today's match starts at three.", bn: "আজকের ম্যাচ তিনটায় শুরু।" },
        { target: "The colour of the sky is grey today.", bn: "আজ আকাশের রং ধূসর।" },
      ],
    },
    "nouns-jobs": {
      kind: "figure",
      shape: "flow",
      title: { bn: "একটা noun, চার জায়গা", en: "One noun, four places" },
      parts: [
        { text: { bn: "কর্তা: ক্রিয়ার আগে", en: "Subject: before the verb" }, note: { bn: "The bat is new.", en: "The bat is new." }, tone: "lead" },
        { text: { bn: "কর্ম: ক্রিয়ার পরে", en: "Object: after the verb" }, note: { bn: "I bought the bat.", en: "I bought the bat." } },
        { text: { bn: "preposition-এর পরে", en: "After a preposition" }, note: { bn: "I play with the bat.", en: "I play with the bat." } },
        { text: { bn: "মালিক: 's সহ", en: "Owner: with 's" }, note: { bn: "The bat's handle broke.", en: "The bat's handle broke." } },
      ],
      caption: { bn: "একই শব্দ চার জায়গায়। জায়গাটা চিনলে পর্ব ৩-এ কোন pronoun বসবে সেটাও চেনা যাবে।", en: "The same word in four places. Knowing the place is what tells you, in part 3, which pronoun replaces it." },
    },
    "nouns-spot": {
      kind: "spot",
      title: { bn: "মিতু আপুর খাতা, noun-এর ভুল", en: "Mitu's paper: the noun mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে noun-এর ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line with a noun mistake in it." },
      source: { bn: "রচনা: আমাদের স্কুল লাইব্রেরি", en: "Essay: our school library" },
      lines: [
        { text: { bn: "Our school library has thousands of books.", en: "Our school library has thousands of books." } },
        { text: { bn: "The librarian gives us many informations about new books.", en: "The librarian gives us many informations about new books." }, flag: { bn: "information গোনা যায় না: a lot of information।", en: "Information is uncountable: a lot of information." } },
        { text: { bn: "There are new furnitures in the reading room.", en: "There are new furnitures in the reading room." }, flag: { bn: "furniture-এ কখনো -s নয়: new furniture, আর তাই There is।", en: "Furniture never takes -s: new furniture, and so There is." } },
        { text: { bn: "Two shelves are full of story books.", en: "Two shelves are full of story books." } },
        { text: { bn: "The childrens come here every afternoon.", en: "The childrens come here every afternoon." }, flag: { bn: "children আগে থেকেই বহুবচন: The children come।", en: "Children is already plural: The children come." } },
        { text: { bn: "My friend's favourite book is about a brave girl.", en: "My friend's favourite book is about a brave girl." } },
        { text: { bn: "The librarian gave me an advice: read a page every day.", en: "The librarian gave me an advice: read a page every day." }, flag: { bn: "advice গোনা যায় না: a piece of advice, বা some advice।", en: "Advice is uncountable: a piece of advice, or some advice." } },
        { text: { bn: "I have borrowed three novel's this month.", en: "I have borrowed three novel's this month." }, flag: { bn: "অ্যাপস্ট্রফি দিয়ে বহুবচন হয় না: three novels।", en: "An apostrophe does not make a plural: three novels." } },
      ],
    },
    "nouns-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "The news ___ very good today. কোনটা বসবে?", en: "The news ___ very good today. Which fits?" },
          options: [
            { text: { bn: "are", en: "are" }, why: { bn: "না। news শেষে s থাকলেও একবচন, গোনা যায় না।", en: "No. News ends in s but is singular and uncountable." } },
            { text: { bn: "is", en: "is" }, right: true, why: { bn: "হ্যাঁ। news একটা জিনিস, গোনা যায় না: The news is good।", en: "Yes. News is one uncountable thing: The news is good." } },
            { text: { bn: "were", en: "were" }, why: { bn: "না। today বলছে এখনের কথা, আর news একবচন।", en: "No. Today says the present, and news is singular." } },
          ],
        },
        {
          ask: { bn: "Change the number: The thief stole the lady's knife. সব noun বহুবচন করলে?", en: "Change the number: The thief stole the lady's knife. With every noun made plural?" },
          options: [
            { text: { bn: "The thiefs stole the ladys' knifes.", en: "The thiefs stole the ladys' knifes." }, why: { bn: "না। thief আর knife দুটোই -f, তাই -ves; lady-র y হয়ে যায় ies।", en: "No. Thief and knife both end in -f and take -ves; the y of lady becomes ies." } },
            { text: { bn: "The thieves stole the ladies' knives.", en: "The thieves stole the ladies' knives." }, right: true, why: { bn: "হ্যাঁ। thieves, ladies, knives; আর ladies-এর শেষে s আছে, তাই শুধু অ্যাপস্ট্রফি: ladies'।", en: "Yes. Thieves, ladies, knives, and ladies already ends in s, so only an apostrophe: ladies'." } },
            { text: { bn: "The thieves stole the ladies's knives.", en: "The thieves stole the ladies's knives." }, why: { bn: "না। s দিয়ে শেষ হওয়া বহুবচনে শুধু অ্যাপস্ট্রফি: ladies'।", en: "No. A plural ending in s takes only the apostrophe: ladies'." } },
          ],
        },
        {
          ask: { bn: "কোন বাক্যটা ঠিক?", en: "Which sentence is right?" },
          options: [
            { text: { bn: "People in my village is very kind.", en: "People in my village is very kind." }, why: { bn: "না। people অনেক মানুষ, বহুবচন: are।", en: "No. People is many, a plural: are." } },
            { text: { bn: "People in my village are very kind.", en: "People in my village are very kind." }, right: true, why: { bn: "হ্যাঁ। people হলো person-এর বহুবচন, তাই are। in my village ঢেকে দিলে কর্তা People।", en: "Yes. People is the plural of person, so are. Cover in my village and the subject is People." } },
            { text: { bn: "Peoples in my village are very kind.", en: "Peoples in my village are very kind." }, why: { bn: "না। peoples মানে 'জাতিসমূহ', একদম অন্য কথা। এখানে শুধু people।", en: "No. Peoples means nations, a different thing. Here it is just people." } },
          ],
        },
        {
          ask: { bn: "Mitu has ___ homework tonight. কোনটা?", en: "Mitu has ___ homework tonight. Which?" },
          options: [
            { text: { bn: "many", en: "many" }, why: { bn: "না। many শুধু গোনা যায় এমন বহুবচনের সাথে: many books।", en: "No. Many goes only with countable plurals: many books." } },
            { text: { bn: "a lot of", en: "a lot of" }, right: true, why: { bn: "হ্যাঁ। homework গোনা যায় না, তাই a lot of বা much: a lot of homework।", en: "Yes. Homework is uncountable, so a lot of or much: a lot of homework." } },
            { text: { bn: "a", en: "a" }, why: { bn: "না। a homework হয় না। গোনা যায় না এমন জিনিসের আগে a বসে না।", en: "No. A homework is impossible. Uncountable things take no a." } },
          ],
        },
      ],
    },
    "nouns-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "রান্নাঘরে গিয়ে পাঁচটা জিনিস বলো: কোনটা গোনা যায়, কোনটা যায় না। two eggs, some salt…", en: "In the kitchen, name five things: which can be counted, which cannot. Two eggs, some salt…" } },
        { text: { bn: "পাঁচটা রেবেল বহুবচন জোরে বলো, তিনবার: child children, man men, foot feet, tooth teeth, mouse mice।", en: "Say five rebel plurals aloud, three times." } },
        { text: { bn: "পরিবারের তিনজনের একটা করে জিনিস বলো: Baba's phone, Ma's saree, Nanu's glasses।", en: "Name one thing each for three people in your family: Baba's phone, Ma's saree, Nanu's glasses." } },
        { text: { bn: "গোনা যায় না এমন পাঁচটা জিনিস, প্রতিটা তার পাত্র সহ: a cup of tea, a piece of advice…", en: "Five uncountable things, each with its container: a cup of tea, a piece of advice…" } },
        { text: { bn: "বাজারের তালিকা ইংরেজিতে, জোরে: two kilos of rice, a dozen eggs, some oil, three mangoes…", en: "A shopping list in English, aloud: two kilos of rice, a dozen eggs, some oil, three mangoes…" } },
        { text: { bn: "পাঁচটা adjective নাও আর প্রতিটার ভাবের noun বলো: kind kindness, brave bravery, free freedom…", en: "Take five adjectives and say the abstract noun of each: kind kindness, brave bravery, free freedom…" } },
      ],
    },
  },
};
