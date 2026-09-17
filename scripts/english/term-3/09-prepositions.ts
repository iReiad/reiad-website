/* ============================================================
   09-prepositions.ts: পর্ব ৯, in, on, at, under: জায়গা আর সময়ের ছোট শব্দ.

   One part of the grammar term, gathered into the rung by
   `basic.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>বাংলায় একটা "এ" দিয়ে কত কিছু হয়: বাক্সে, টেবিলে, ঢাকায়, সকালে, সোমবারে। ইংরেজি ওই এক "এ"-কে তিন টুকরো করে: <span lang="en">in the box, on the table, at the station</span>। তানভীর ভাই বলে, এটা নিয়ম দিয়ে শেখার জিনিস না, ছবি দিয়ে শেখার। ভিতরে থাকলে <span lang="en">in</span>, উপরে লেগে থাকলে <span lang="en">on</span>, একটা বিন্দুতে থাকলে <span lang="en">at</span>। তিনটা ছবি মাথায় বসাও, বাকিটা এসে যাবে।</p>

<p>তিনটা ছবির পরে আরও বারোটা ছবি, যেগুলো দিয়ে একটা পুরো যাত্রা বলা যায়; সময়ের আরও ছয়টা শব্দ, যেগুলো পরীক্ষায় <span lang="en">in/on/at</span>-এর চেয়েও বেশি আসে; যে জোড়াগুলো মুখস্থ; preposition-এর পরে <span lang="en">-ing</span>; আর যে পাঁচটা ক্রিয়ায় বাংলার অভ্যাসে বাড়তি preposition চলে আসে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>জায়গা: <span lang="en">in</span> (ভিতরে, ঘেরা), <span lang="en">on</span> (উপরে, ছুঁয়ে), <span lang="en">at</span> (একটা বিন্দুতে)।</li>
<li>সময়: <span lang="en">in</span> (মাস, বছর, বেলা), <span lang="en">on</span> (দিন, তারিখ), <span lang="en">at</span> (ঘড়ির সময়, উৎসব)। বড় থেকে ছোট।</li>
<li>নড়াচড়া: <span lang="en">to</span> (দিকে), <span lang="en">from</span> (থেকে), <span lang="en">into</span> (ভিতরে ঢোকা), <span lang="en">through</span> (ভেদ করে), <span lang="en">across</span> (পার হয়ে)।</li>
<li>সময়ের দৈর্ঘ্য: <span lang="en">for</span> (কতক্ষণ), <span lang="en">since</span> (কখন থেকে), <span lang="en">during</span> (যার মধ্যে), <span lang="en">until</span> (পর্যন্ত), <span lang="en">by</span> (এর মধ্যে)।</li>
<li>preposition-এর পরে সবসময় noun, pronoun-এর কর্ম-রূপ, বা <span lang="en">-ing</span>: <span lang="en">with him, for us, good at playing</span>।</li>
<li>অনেক জোড়া মুখস্থ: <span lang="en">good at, afraid of, interested in, listen to, depend on</span>।</li>
</ul>
</div>

${mount("prepositions-pattern")}

<h2>জায়গার তিনটা ছবি</h2>

<p><span lang="en">in</span>: চারদিক ঘেরা কিছুর ভিতরে। বাক্স, ঘর, শহর, দেশ, পানি। <span lang="en">in the box, in the room, in Dhaka, in Bangladesh, in the river</span>। ছবি: একটা বল একটা বাক্সের ভিতরে।</p>

<p><span lang="en">on</span>: কোনো তলের উপরে, ছুঁয়ে আছে। টেবিল, দেয়াল, মেঝে, ছাদ, রাস্তা। <span lang="en">on the table, on the wall, on the floor, on the road</span>। ছবি: একটা বল একটা টেবিলের উপরে। আর অদ্ভুত কিন্তু সত্যি: <span lang="en">on the bus, on the train, on a plane</span>, কারণ ওগুলোর ভিতরে হাঁটা যায়। গাড়িতে হাঁটা যায় না, তাই <span lang="en">in the car</span>।</p>

<p><span lang="en">at</span>: মানচিত্রে একটা বিন্দু, একটা ঠিকানা, একটা অবস্থান। <span lang="en">at the station, at the door, at home, at school, at the top</span>। ছবি: মানচিত্রে একটা পিন। <span lang="en">at school</span> মানে স্কুলে আছি, বিন্দু হিসেবে; <span lang="en">in the school</span> মানে ভবনটার ভিতরে।</p>

<div class="table-scroll">
<table>
<thead><tr><th></th><th><span lang="en">in</span></th><th><span lang="en">on</span></th><th><span lang="en">at</span></th></tr></thead>
<tbody>
<tr><td>জায়গা</td><td><span lang="en">in a box, in Dhaka, in bed</span></td><td><span lang="en">on a table, on the wall, on the bus</span></td><td><span lang="en">at the door, at school, at home</span></td></tr>
<tr><td>সময়</td><td><span lang="en">in June, in 2007, in the morning, in winter</span></td><td><span lang="en">on Friday, on 16 December, on my birthday</span></td><td><span lang="en">at 5 o'clock, at night, at Eid, at noon</span></td></tr>
</tbody>
</table>
</div>

${mount("prepositions-lines")}

${mount("prepositions-sort")}

<h2>সময়ের তিন সিঁড়ি: বড় থেকে ছোট</h2>

<p>সময়ে একই তিনটা শব্দ, কিন্তু নিয়মটা আকারের। বড় সময়ে <span lang="en">in</span>: মাস, বছর, ঋতু, দশক, আর দিনের বেলা। <span lang="en">in July, in 1971, in winter, in the afternoon</span>। মাঝারিতে <span lang="en">on</span>: দিন আর তারিখ। <span lang="en">on Monday, on 26 March, on Friday morning</span>। ছোটতে <span lang="en">at</span>: ঘড়ির সময় আর উৎসব। <span lang="en">at 7 o'clock, at midnight, at Eid</span>। আর একটা ব্যতিক্রম যেটা সবাই ভুল করে: <span lang="en">at night</span>, কিন্তু <span lang="en">in the morning</span>।</p>

<p>তিনটা শব্দ যেখানে কিছুই বসে না: <span lang="en">this, last, next, every</span>-র আগে। <span lang="en">this morning, last week, next Friday, every day</span>। <span lang="en">on next Friday</span> নয়, শুধু <span lang="en">next Friday</span>। আর <span lang="en">tomorrow, yesterday, today</span>-র আগেও না।</p>

<h2>নড়াচড়ার শব্দ, আর একটা পুরো যাত্রা</h2>

<p><span lang="en">Rafi walked to school.</span> স্কুলের দিকে, গন্তব্য <span lang="en">to</span>। <span lang="en">He came from the field.</span> মাঠ থেকে, উৎস <span lang="en">from</span>। <span lang="en">The cat jumped into the box.</span> বাইরে থেকে ভিতরে, নড়াচড়া সহ <span lang="en">into</span> (<span lang="en">in</span> মানে ওখানেই আছে, <span lang="en">into</span> মানে ঢুকছে)। <span lang="en">The train went through the tunnel.</span> ভেদ করে। <span lang="en">She swam across the river.</span> এপার থেকে ওপার। <span lang="en">The ball flew over the fence.</span> উপর দিয়ে। <span lang="en">The cat is under the bed.</span> নিচে।</p>

<p>জায়গা আর নড়াচড়ার আরও বারোটা ছবি, জোড়ায় জোড়ায়, কারণ জোড়ায় মনে থাকে:</p>

<div class="table-scroll">
<table>
<thead><tr><th>জোড়া</th><th>ছবি</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">above / below</span></td><td>উপরে / নিচে, না ছুঁয়ে</td><td><span lang="en">The fan is above the table. The valley is below the hill.</span></td></tr>
<tr><td><span lang="en">over / under</span></td><td>ঠিক উপর দিয়ে / ঠিক নিচে</td><td><span lang="en">The ball flew over the fence. The cat is under the bed.</span></td></tr>
<tr><td><span lang="en">in front of / behind</span></td><td>সামনে / পিছনে</td><td><span lang="en">Rafi stood in front of the class. The bag is behind the door.</span></td></tr>
<tr><td><span lang="en">next to, beside / near</span></td><td>ঠিক পাশে / কাছে</td><td><span lang="en">Mitu sits next to me. The school is near the river.</span></td></tr>
<tr><td><span lang="en">between / among</span></td><td>দুটোর মাঝে / অনেকের মাঝে</td><td><span lang="en">Sit between Rafi and Mitu. He was lost among the crowd.</span></td></tr>
<tr><td><span lang="en">opposite / across from</span></td><td>মুখোমুখি</td><td><span lang="en">The shop is opposite the mosque.</span></td></tr>
<tr><td><span lang="en">along / past</span></td><td>বরাবর / পাশ কাটিয়ে</td><td><span lang="en">Walk along the road and go past the bank.</span></td></tr>
<tr><td><span lang="en">towards / away from</span></td><td>দিকে / থেকে দূরে</td><td><span lang="en">He ran towards the ball and away from the dog.</span></td></tr>
<tr><td><span lang="en">out of / off</span></td><td>ভিতর থেকে বাইরে / উপর থেকে নিচে</td><td><span lang="en">She got out of the car. The cup fell off the table.</span></td></tr>
<tr><td><span lang="en">up / down</span></td><td>উপরে / নিচে, পথ ধরে</td><td><span lang="en">Climb up the stairs. Walk down the hill.</span></td></tr>
</tbody>
</table>
</div>

<p>এই ছবিগুলো দিয়ে একটা পুরো যাত্রা বলা যায়, আর সেটাই মনে রাখার সেরা উপায়। রাফির সকাল: <span lang="en">Rafi walked out of the house, along the road, past the mosque, across the bridge, through the market, and into the school.</span> ছয়টা preposition, একটা পথ। নিজের বাড়ি থেকে স্কুলের পথটা এভাবে বলো।</p>

${mount("prepositions-journey")}

${mount("prepositions-pictures")}

${mount("prepositions-gap")}

<div class="ex"><b>Finding Nemo-র পুরো গল্পটাই preposition:</b> <span lang="en">Nemo lives in the sea. He was taken from the reef, put into a tank, kept on a desk at the dentist's, and his father swam across the ocean to find him.</span> এক বাক্যে সাতটা preposition, আর প্রতিটা একটা ছবি।</div>

<h2>সময়ের আরও ছয়টা শব্দ</h2>

<p><span lang="en">in, on, at</span> বলে কখন। এই ছয়টা বলে কতক্ষণ, কখন থেকে, কিসের মধ্যে, কত পর্যন্ত। পরীক্ষায় এরা <span lang="en">in/on/at</span>-এর চেয়েও বেশি আসে, কারণ এদের সাথে কালের নিয়ম জড়ানো।</p>

<div class="table-scroll">
<table>
<thead><tr><th>শব্দ</th><th>মানে</th><th>পরে কী বসে</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">for</span></td><td>কতক্ষণ ধরে</td><td>একটা দৈর্ঘ্য</td><td><span lang="en">for two hours, for three years, for a week</span></td></tr>
<tr><td><span lang="en">since</span></td><td>কখন থেকে</td><td>একটা শুরুর বিন্দু</td><td><span lang="en">since Monday, since 2020, since morning</span></td></tr>
<tr><td><span lang="en">during</span></td><td>যার মধ্যে</td><td>একটা ঘটনা বা সময়ের নাম</td><td><span lang="en">during the match, during the holidays</span></td></tr>
<tr><td><span lang="en">until / till</span></td><td>পর্যন্ত, তখন পর্যন্ত চলে</td><td>শেষের বিন্দু</td><td><span lang="en">wait until five, open till midnight</span></td></tr>
<tr><td><span lang="en">by</span></td><td>এর মধ্যে, তার আগেই শেষ</td><td>শেষ সময়সীমা</td><td><span lang="en">finish by Friday, be home by ten</span></td></tr>
<tr><td><span lang="en">from … to</span></td><td>থেকে … পর্যন্ত</td><td>দুটো বিন্দু</td><td><span lang="en">from nine to five, from Monday to Friday</span></td></tr>
</tbody>
</table>
</div>

<p>দুটো জোড়া সবাই গুলিয়ে ফেলে। <span lang="en">for</span> আর <span lang="en">since</span>: <span lang="en">for</span>-এর পরে কতক্ষণ (<span lang="en">for two days</span>), <span lang="en">since</span>-এর পরে কখন থেকে (<span lang="en">since Monday</span>)। বাংলার "দুই দিন থেকে" ইংরেজিতে <span lang="en">for two days</span>, <span lang="en">since</span> নয়; পর্ব ১১-এ এই জোড়াটা perfect কালের সাথে ফিরে আসবে। আর <span lang="en">until</span> আর <span lang="en">by</span>: <span lang="en">Wait until five</span> মানে পাঁচটা পর্যন্ত অপেক্ষা চলবে; <span lang="en">Finish by five</span> মানে পাঁচটার আগেই শেষ, তার পরে দেরি। <span lang="en">until</span> চলা বোঝায়, <span lang="en">by</span> শেষ হওয়া।</p>

${mount("prepositions-time")}

${mount("prepositions-deadline")}

${mount("prepositions-when")}

<h2>কার জন্য, কী দিয়ে, কার সাথে</h2>

<p>জায়গা আর সময় ছাড়াও preposition সম্পর্ক বলে। <span lang="en">for</span>: কার জন্য, কী উদ্দেশ্যে। <span lang="en">a gift for Nanu, a bat for playing</span>। <span lang="en">with</span>: কার সাথে, কী দিয়ে (হাতের জিনিস)। <span lang="en">with Rafi, cut with a knife</span>। <span lang="en">by</span>: কে করল, কীভাবে (উপায়)। <span lang="en">written by Tagore, by bus, by hand</span>। <span lang="en">of</span>: কার অংশ, কী দিয়ে ভরা। <span lang="en">the door of the room, a cup of tea, a friend of mine</span>। <span lang="en">about</span>: কী নিয়ে। <span lang="en">a book about cricket, talk about the match</span>। <span lang="en">without</span>: ছাড়া। <span lang="en">tea without sugar</span>।</p>

<p>দুটো ফাঁদ। <span lang="en">by</span> আর <span lang="en">with</span>: কাজটা <em>কে</em> করল <span lang="en">by</span> (<span lang="en">The window was broken by Rafi</span>), <em>কী দিয়ে</em> করল <span lang="en">with</span> (<span lang="en">broken with a ball</span>)। পর্ব ১৫-এর passive-এ এই <span lang="en">by</span> ফিরে আসবে। আর <span lang="en">made of</span> আর <span lang="en">made from</span>: উপাদানটা দেখা গেলে <span lang="en">of</span> (<span lang="en">a table made of wood</span>), বদলে গেলে <span lang="en">from</span> (<span lang="en">paper made from wood</span>)।</p>

<h2>জোড়া শব্দ: যেগুলো একসাথে থাকে</h2>

<p>কিছু ক্রিয়া আর adjective-এর সাথে একটা নির্দিষ্ট preposition জোড়া লেগে থাকে, আর সেগুলো যুক্তি দিয়ে বোঝা যায় না, শুধু জোড়া হিসেবে শেখা যায়। বাংলায় "ইংরেজিতে ভালো", কিন্তু ইংরেজিতে <span lang="en">good at English</span>, <span lang="en">good in</span> নয়। সবচেয়ে বেশি লাগে এই কুড়িটা:</p>

<div class="table-scroll">
<table>
<thead><tr><th>জোড়া</th><th>উদাহরণ</th><th>জোড়া</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">good at</span></td><td><span lang="en">good at maths</span></td><td><span lang="en">listen to</span></td><td><span lang="en">listen to music</span></td></tr>
<tr><td><span lang="en">afraid of</span></td><td><span lang="en">afraid of dogs</span></td><td><span lang="en">wait for</span></td><td><span lang="en">wait for the bus</span></td></tr>
<tr><td><span lang="en">interested in</span></td><td><span lang="en">interested in films</span></td><td><span lang="en">look at</span></td><td><span lang="en">look at the sky</span></td></tr>
<tr><td><span lang="en">angry with</span> (মানুষ)</td><td><span lang="en">angry with Rafi</span></td><td><span lang="en">depend on</span></td><td><span lang="en">depend on the weather</span></td></tr>
<tr><td><span lang="en">famous for</span></td><td><span lang="en">famous for pitha</span></td><td><span lang="en">arrive at / in</span></td><td><span lang="en">arrive at school, in Dhaka</span></td></tr>
<tr><td><span lang="en">different from</span></td><td><span lang="en">different from mine</span></td><td><span lang="en">agree with</span></td><td><span lang="en">agree with you</span></td></tr>
<tr><td><span lang="en">married to</span></td><td><span lang="en">married to a doctor</span></td><td><span lang="en">belong to</span></td><td><span lang="en">belong to Nanu</span></td></tr>
<tr><td><span lang="en">tired of</span></td><td><span lang="en">tired of waiting</span></td><td><span lang="en">laugh at</span></td><td><span lang="en">laugh at the joke</span></td></tr>
<tr><td><span lang="en">proud of</span></td><td><span lang="en">proud of my school</span></td><td><span lang="en">apologise for</span></td><td><span lang="en">apologise for being late</span></td></tr>
<tr><td><span lang="en">full of</span></td><td><span lang="en">full of energy</span></td><td><span lang="en">suffer from</span></td><td><span lang="en">suffer from fever</span></td></tr>
</tbody>
</table>
</div>

<p>আর একটা নিয়ম যেটা পর্ব ১৮-এর আগে জেনে রাখা ভালো: preposition-এর পরে ক্রিয়া বসলে সেটা <span lang="en">-ing</span> রূপে, কখনো <span lang="en">to</span> রূপে নয়। <span lang="en">good at playing, interested in learning, tired of waiting, before leaving, without saying goodbye</span>। <span lang="en">good at play</span> নয়, <span lang="en">good at to play</span> নয়।</p>

${mount("prepositions-match")}

${mount("prepositions-reveal")}

<h2>বাক্যের শেষে preposition</h2>

<p>প্রশ্নে wh-শব্দ সামনে গেলে preposition প্রায়ই পিছনে পড়ে থাকে, আর সেটা ভুল নয়: <span lang="en">What are you looking at? Who did you talk to? Where are you from?</span> পুরনো বইয়ে বলত preposition দিয়ে বাক্য শেষ করা যায় না; সেটা ল্যাটিনের নিয়ম, ইংরেজির নয়। খুব আনুষ্ঠানিক লেখায় সামনে আনা যায়: <span lang="en">To whom did you talk?</span> পরীক্ষার খাতায় দুটোই ঠিক; কথায় শেষেরটাই স্বাভাবিক। শুধু preposition-টা ভুলে যেয়ো না: <span lang="en">Who did you talk?</span> অসম্পূর্ণ।</p>

${mount("prepositions-build")}

${mount("prepositions-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>SSC আর HSC-তে preposition একটা আলাদা প্রশ্ন: একটা অনুচ্ছেদ, দশটা খালি ঘর, প্রতিটায় একটা preposition। তিন ধরনের ঘর: জায়গা বা সময় (ছবি দিয়ে), জোড়া (মুখস্থ), আর সম্পর্ক (<span lang="en">for, with, by, of</span>)। ধাপ:</p>

<ol class="step-list">
<li><strong>খালি ঘরের আগের শব্দটা দেখো।</strong> <span lang="en">good, afraid, interested, listen, wait, depend, famous, proud</span>? জোড়া। মুখস্থটা বসাও, ভাবো না।</li>
<li><strong>পরের শব্দটা দেখো।</strong> ঘড়ির সময়, <span lang="en">night</span>, উৎসব: <span lang="en">at</span>। দিন, তারিখ: <span lang="en">on</span>। মাস, বছর, বেলা, শহর, দেশ: <span lang="en">in</span>। দৈর্ঘ্য (<span lang="en">two hours</span>): <span lang="en">for</span>। শুরুর বিন্দু (<span lang="en">2020</span>): <span lang="en">since</span>।</li>
<li><strong>নড়াচড়া আছে?</strong> ক্রিয়াটা <span lang="en">go, come, walk, run, jump</span> হলে গন্তব্যে <span lang="en">to</span>, উৎসে <span lang="en">from</span>, ভিতরে ঢোকায় <span lang="en">into</span>, পার হওয়ায় <span lang="en">across</span>।</li>
<li><strong>কে করল, কী দিয়ে?</strong> <span lang="en">by</span> মানুষ আর উপায়, <span lang="en">with</span> হাতের জিনিস, <span lang="en">for</span> উদ্দেশ্য, <span lang="en">about</span> বিষয়।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Rafi was born (1) ___ 2012 (2) ___ a small village (3) ___ Sylhet. He is good (4) ___ cricket and interested (5) ___ films. Every morning he goes (6) ___ school (7) ___ bus and comes back (8) ___ four o'clock. He has lived (9) ___ Dhaka (10) ___ 2020.</span> উত্তর: (১) <span lang="en">in</span>, বছর; (২) <span lang="en">in</span>, গ্রামের ভিতরে; (৩) <span lang="en">in</span> বা <span lang="en">near</span>, জেলা; (৪) <span lang="en">at</span>, জোড়া; (৫) <span lang="en">in</span>, জোড়া; (৬) <span lang="en">to</span>, গন্তব্য; (৭) <span lang="en">by</span>, উপায়; (৮) <span lang="en">at</span>, ঘড়ির সময়; (৯) <span lang="en">in</span>, শহর; (১০) <span lang="en">since</span>, শুরুর বিন্দু। দশ ঘর, চার ধাপ।</div>

${mount("prepositions-exam")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Preposition</span> শূন্যস্থানে প্রথমে দেখো পরের শব্দটা কী। ঘড়ির সময় বা <span lang="en">night</span>: <span lang="en">at</span>। দিন বা তারিখ: <span lang="en">on</span>। মাস, বছর, শহর, দেশ: <span lang="en">in</span>। আগের শব্দটা যদি <span lang="en">good, afraid, interested, listen, wait, depend</span> হয়, জোড়া মনে করো। এই দুই দিক দেখলে বেশিরভাগ শূন্যস্থান ভরে যায়।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>কিছু ক্রিয়ার পরে বাংলার অভ্যাসে preposition বসাতে ইচ্ছে করে, কিন্তু ইংরেজিতে বসে না: <span lang="en">enter the room</span> (<span lang="en">enter into</span> নয়), <span lang="en">discuss the matter</span> (<span lang="en">discuss about</span> নয়), <span lang="en">reach Dhaka</span> (<span lang="en">reach at</span> নয়), <span lang="en">answer the question</span> (<span lang="en">answer to</span> নয়), <span lang="en">marry someone</span> (<span lang="en">marry with</span> নয়)। পাঁচটা ফাঁদ, মুখস্থ।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p><span lang="en">between</span> দুজনের মাঝে, <span lang="en">among</span> অনেকের মাঝে: <span lang="en">between Rafi and Mitu</span>, কিন্তু <span lang="en">among the players</span>। আর <span lang="en">beside</span> মানে পাশে, <span lang="en">besides</span> মানে "ছাড়াও": <span lang="en">Sit beside me. Besides cricket, I like football.</span> একটা <span lang="en">s</span>, দুটো আলাদা শব্দ।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>জায়গার তিনটা ছবি আর সময়ের তিনটা আকার বলতে পারি?</li>
<li>বাড়ি থেকে স্কুলের পথ ছয়টা preposition দিয়ে বলতে পারি?</li>
<li><span lang="en">for</span> আর <span lang="en">since</span>, <span lang="en">until</span> আর <span lang="en">by</span>: দুই জোড়ার পার্থক্য?</li>
<li>দশটা জোড়া না দেখে: <span lang="en">good at, afraid of…</span>?</li>
<li>যে পাঁচটা ক্রিয়া preposition নেয় না?</li>
<li>preposition-এর পরে ক্রিয়া কোন রূপে?</li>
</ul>
</div>

${mount("prepositions-drill")}
`,
  blocks: {
    "prepositions-pattern": {
      kind: "pattern",
      title: { bn: "তিনটা ছবি", en: "Three pictures" },
      shape: "in = ভিতরে  ·  on = উপরে, ছুঁয়ে  ·  at = একটা বিন্দুতে",
      why: { bn: "জায়গায় তিনটা ছবি, সময়ে তিনটা আকার: in বড় (মাস, বছর), on মাঝারি (দিন), at ছোট (ঘড়ির সময়)। একই তিন শব্দ, দুই কাজ।", en: "Three pictures for place, three sizes for time: in is big (months, years), on is medium (days), at is small (clock times). The same three words, two jobs." },
      examples: [
        { target: "The ball is in the box, on the table, at the door.", bn: "বলটা বাক্সের ভিতরে, টেবিলের উপরে, দরজার কাছে।" },
        { target: "The final is in March, on a Sunday, at 2 o'clock.", bn: "ফাইনাল মার্চে, এক রবিবারে, দুটোর সময়।" },
        { target: "Rafi lives in Dhaka and studies at Ideal School.", bn: "রাফি ঢাকায় থাকে আর আইডিয়াল স্কুলে পড়ে।" },
        { target: "Nanu was born in 1955, on a rainy night.", bn: "নানু ১৯৫৫ সালে, এক বৃষ্টির রাতে জন্মেছিলেন।" },
      ],
      tip: { bn: "at night, in the morning: এই জোড়াটা উল্টো মনে হয়, তাই আলাদা করে মুখস্থ।", en: "At night but in the morning: the pair feels backwards, so learn it separately." },
    },
    "prepositions-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: কোথায়, কখন", en: "Listen, say: where, when" },
      lines: [
        { target: "My keys are in my bag.", bn: "আমার চাবি আমার ব্যাগে।" },
        { target: "There is a lizard on the wall.", bn: "দেয়ালে একটা টিকটিকি আছে।" },
        { target: "Meet me at the gate at five.", bn: "পাঁচটায় গেটে আমার সাথে দেখা করো।" },
        { target: "School starts on Sunday in January.", bn: "স্কুল শুরু জানুয়ারিতে, রবিবারে।" },
        { target: "We are on the bus, not in the car.", bn: "আমরা বাসে, গাড়িতে নয়।" },
        { target: "She is good at English and interested in films.", bn: "সে ইংরেজিতে ভালো আর সিনেমায় আগ্রহী।" },
        { target: "Wait for me until five; I will be home by six.", bn: "পাঁচটা পর্যন্ত আমার জন্য অপেক্ষা করো; ছয়টার মধ্যে বাড়ি ফিরব।" },
      ],
    },
    "prepositions-sort": {
      kind: "bins",
      title: { bn: "in, on, at: জায়গা না সময়", en: "In, on, at: place or time" },
      note: { bn: "প্রতিটা টুকরোর খালি জায়গায় কোন শব্দ বসবে, সেই ঘরে ফেলো।", en: "Drop each phrase into the box of the word that fills its gap." },
      bins: [
        { id: "in", label: { bn: "in", en: "in" } },
        { id: "on", label: { bn: "on", en: "on" } },
        { id: "at", label: { bn: "at", en: "at" } },
      ],
      items: [
        { text: { bn: "___ the morning", en: "___ the morning" }, bin: "in", why: { bn: "দিনের বেলা: in the morning।", en: "A part of the day: in the morning." } },
        { text: { bn: "___ night", en: "___ night" }, bin: "at", why: { bn: "ব্যতিক্রম: at night।", en: "The exception: at night." } },
        { text: { bn: "___ 16 December", en: "___ 16 December" }, bin: "on", why: { bn: "তারিখ: on।", en: "A date: on." } },
        { text: { bn: "___ the wall", en: "___ the wall" }, bin: "on", why: { bn: "দেয়ালের গায়ে, ছুঁয়ে: on।", en: "Touching the surface of the wall: on." } },
        { text: { bn: "___ Bangladesh", en: "___ Bangladesh" }, bin: "in", why: { bn: "দেশের ভিতরে: in।", en: "Inside a country: in." } },
        { text: { bn: "___ the bus stop", en: "___ the bus stop" }, bin: "at", why: { bn: "একটা বিন্দু: at।", en: "A point: at." } },
        { text: { bn: "___ winter", en: "___ winter" }, bin: "in", why: { bn: "ঋতু, বড় সময়: in।", en: "A season, a big stretch: in." } },
        { text: { bn: "___ Eid", en: "___ Eid" }, bin: "at", why: { bn: "উৎসব: at Eid।", en: "A festival: at Eid." } },
        { text: { bn: "___ my birthday", en: "___ my birthday" }, bin: "on", why: { bn: "একটা দিন: on my birthday।", en: "A day: on my birthday." } },
        { text: { bn: "___ the train", en: "___ the train" }, bin: "on", why: { bn: "যার ভিতরে হাঁটা যায়: on the train।", en: "Something you can walk inside: on the train." } },
        { text: { bn: "___ the car", en: "___ the car" }, bin: "in", why: { bn: "যার ভিতরে হাঁটা যায় না: in the car।", en: "Something you cannot walk inside: in the car." } },
        { text: { bn: "___ the top of the hill", en: "___ the top of the hill" }, bin: "at", why: { bn: "একটা বিন্দু: at the top।", en: "A point: at the top." } },
      ],
    },
    "prepositions-journey": {
      kind: "order",
      title: { bn: "রাফির যাত্রা", en: "Rafi's journey" },
      note: { bn: "রাফি বাড়ি থেকে স্কুলে যাচ্ছে। পথের টুকরোগুলো ঠিক ক্রমে সাজাও: বেরোনো, রাস্তা, মসজিদ, সেতু, বাজার, স্কুল।", en: "Rafi is walking from home to school. Put the pieces of the route in order: leaving, the road, the mosque, the bridge, the market, the school." },
      items: [
        { text: { bn: "out of the house", en: "out of the house" }, why: { bn: "ভিতর থেকে বাইরে: শুরু।", en: "From inside to outside: the start." } },
        { text: { bn: "along the road", en: "along the road" }, why: { bn: "রাস্তা বরাবর।", en: "Following the road." } },
        { text: { bn: "past the mosque", en: "past the mosque" }, why: { bn: "মসজিদ পাশ কাটিয়ে।", en: "Going by the mosque." } },
        { text: { bn: "across the bridge", en: "across the bridge" }, why: { bn: "সেতু পার হয়ে, এপার থেকে ওপার।", en: "Over the bridge, side to side." } },
        { text: { bn: "through the market", en: "through the market" }, why: { bn: "বাজারের ভিতর দিয়ে।", en: "Through the middle of the market." } },
        { text: { bn: "into the school", en: "into the school" }, why: { bn: "বাইরে থেকে ভিতরে: শেষ।", en: "From outside to inside: the end." } },
      ],
    },
    "prepositions-pictures": {
      kind: "match",
      title: { bn: "ছবির সাথে শব্দ", en: "The word for the picture" },
      note: { bn: "বাঁ দিকের ছবিটা ডান দিকের preposition-এর সাথে মেলাও।", en: "Match each picture on the left with its preposition on the right." },
      pairs: [
        { left: { bn: "বলটা বেড়ার উপর দিয়ে উড়ে গেল", en: "the ball flew above the fence and past it" }, right: { bn: "over", en: "over" } },
        { left: { bn: "রাফি আর মিতুর মাঝখানে বসো", en: "sit with Rafi on one side and Mitu on the other" }, right: { bn: "between", en: "between" } },
        { left: { bn: "ভিড়ের অনেক মানুষের মাঝে হারিয়ে গেল", en: "lost in the middle of many people" }, right: { bn: "among", en: "among" } },
        { left: { bn: "ব্যাগটা দরজার পিছনে", en: "the bag is at the back of the door" }, right: { bn: "behind", en: "behind" } },
        { left: { bn: "দোকানটা মসজিদের ঠিক মুখোমুখি", en: "the shop faces the mosque across the street" }, right: { bn: "opposite", en: "opposite" } },
        { left: { bn: "কাপটা টেবিল থেকে পড়ে গেল", en: "the cup fell from the table's surface" }, right: { bn: "off", en: "off" } },
        { left: { bn: "মিতু আমার ঠিক পাশে বসে", en: "Mitu sits right beside me" }, right: { bn: "next to", en: "next to" } },
      ],
    },
    "prepositions-gap": {
      kind: "gap",
      title: { bn: "কোন ছবি", en: "Which picture" },
      items: [
        { text: "The match starts ___ 3 o'clock.", bn: "ম্যাচ তিনটায় শুরু।", options: ["in", "on", "at"], right: 2, why: { bn: "ঘড়ির সময়: at। সবচেয়ে ছোট সময়।", en: "A clock time: at. The smallest size of time." } },
        { text: "Rafi was born ___ 2012.", bn: "রাফি ২০১২ সালে জন্মেছে।", options: ["in", "on", "at"], right: 0, why: { bn: "বছর: in। বড় সময়।", en: "A year: in. A big stretch of time." } },
        { text: "We have a holiday ___ Friday.", bn: "শুক্রবারে আমাদের ছুটি।", options: ["in", "on", "at"], right: 1, why: { bn: "দিন: on। মাঝারি সময়।", en: "A day: on. The middle size." } },
        { text: "The cat jumped ___ the box and hid.", bn: "বেড়ালটা বাক্সের ভিতরে লাফ দিয়ে লুকাল।", options: ["in", "into", "on"], right: 1, why: { bn: "বাইরে থেকে ভিতরে ঢোকা, নড়াচড়া: into। in হলে ওখানেই ছিল।", en: "Moving from outside to inside: into. In would mean it was already there." } },
        { text: "Nanu is afraid ___ lizards.", bn: "নানু টিকটিকিকে ভয় পান।", options: ["from", "of", "with"], right: 1, why: { bn: "afraid of: বাঁধা জোড়া। বাংলার 'থেকে ভয়' ইংরেজিতে of।", en: "Afraid of is a fixed pair. Bangla fears from; English fears of." } },
        { text: "I usually go to bed ___ night.", bn: "আমি সাধারণত রাতে ঘুমাতে যাই।", options: ["in", "on", "at"], right: 2, why: { bn: "at night, সেই ব্যতিক্রমটা। in the morning, কিন্তু at night।", en: "At night, the exception. In the morning, but at night." } },
        { text: "We walked ___ the bridge to the other side.", bn: "আমরা সেতু পার হয়ে ওপারে গেলাম।", options: ["across", "through", "under"], right: 0, why: { bn: "এপার থেকে ওপার, উপর দিয়ে: across। through হলে ভিতর দিয়ে।", en: "Side to side, over the top: across. Through would mean inside it." } },
        { text: "The plane flew ___ the clouds.", bn: "প্লেনটা মেঘের উপর দিয়ে উড়ল।", options: ["above", "on", "at"], right: 0, why: { bn: "উপরে, না ছুঁয়ে: above। on হলে মেঘের গায়ে বসে থাকত।", en: "Higher, not touching: above. On would mean sitting on the clouds." } },
      ],
    },
    "prepositions-time": {
      kind: "compare",
      title: { bn: "for, since, during", en: "For, since, during" },
      note: { bn: "তিনটা শব্দ, তিনটা প্রশ্ন, আর পরে কী বসে।", en: "Three words, three questions, and what follows each." },
      columns: [
        { bn: "for", en: "for" },
        { bn: "since", en: "since" },
        { bn: "during", en: "during" },
      ],
      rows: [
        { label: { bn: "প্রশ্ন", en: "Question" }, cells: [{ bn: "কতক্ষণ?", en: "how long?" }, { bn: "কখন থেকে?", en: "from when?" }, { bn: "কিসের মধ্যে?", en: "inside what?" }] },
        { label: { bn: "পরে বসে", en: "Followed by" }, cells: [{ bn: "দৈর্ঘ্য: two hours", en: "a length: two hours" }, { bn: "শুরুর বিন্দু: Monday", en: "a start point: Monday" }, { bn: "ঘটনার নাম: the match", en: "an event: the match" }] },
        { label: { bn: "উদাহরণ", en: "Example" }, cells: [{ bn: "I waited for an hour.", en: "I waited for an hour." }, { bn: "I have been here since noon.", en: "I have been here since noon." }, { bn: "It rained during the match.", en: "It rained during the match." }] },
        { label: { bn: "বাংলার ফাঁদ", en: "The Bangla trap" }, cells: [{ bn: "'দুই দিন থেকে' হলেও for", en: "Bangla says from two days; English says for" }, { bn: "শুধু বিন্দু, দৈর্ঘ্য নয়", en: "a point only, never a length" }, { bn: "while নয়, তার পরে পুরো বাক্য", en: "not while, which takes a clause" }] },
      ],
    },
    "prepositions-deadline": {
      kind: "compare",
      title: { bn: "until আর by: চলা, নাকি শেষ", en: "Until and by: running on, or finishing" },
      note: { bn: "দুটোই 'পর্যন্ত', কিন্তু একটা বলে চলতে থাকে, অন্যটা বলে তার আগেই শেষ।", en: "Both are until in Bangla, but one says it keeps going and the other says it is done before then." },
      columns: [
        { bn: "until / till", en: "until / till" },
        { bn: "by", en: "by" },
      ],
      rows: [
        { label: { bn: "প্রশ্ন", en: "Question" }, cells: [{ bn: "কত পর্যন্ত চলে?", en: "runs till when?" }, { bn: "কিসের আগেই শেষ?", en: "done before when?" }] },
        { label: { bn: "পরে বসে", en: "Followed by" }, cells: [{ bn: "শেষের বিন্দু: five", en: "an end point: five" }, { bn: "সময়সীমা: Friday", en: "a deadline: Friday" }] },
        { label: { bn: "উদাহরণ", en: "Example" }, cells: [{ bn: "Wait until I come back.", en: "Wait until I come back." }, { bn: "Finish it by Friday.", en: "Finish it by Friday." }] },
        { label: { bn: "মানে", en: "What it says" }, cells: [{ bn: "চলা বোঝায়", en: "means continuing" }, { bn: "শেষ বোঝায়", en: "means finishing" }] },
        { label: { bn: "ফাঁদ", en: "The trap" }, cells: [{ bn: "The shop is open until ten.", en: "The shop is open until ten." }, { bn: "Be home by ten.", en: "Be home by ten." }] },
      ],
    },
    "prepositions-when": {
      kind: "gap",
      title: { bn: "কতক্ষণ, কখন থেকে, কিসের মধ্যে", en: "How long, from when, inside what" },
      items: [
        { text: "Rafi has played cricket ___ five years.", bn: "রাফি পাঁচ বছর ধরে ক্রিকেট খেলে।", options: ["since", "for", "during"], right: 1, why: { bn: "পাঁচ বছর একটা দৈর্ঘ্য: for five years।", en: "Five years is a length: for five years." } },
        { text: "Mitu has been studying ___ six o'clock.", bn: "মিতু ছয়টা থেকে পড়ছে।", options: ["since", "for", "by"], right: 0, why: { bn: "ছয়টা একটা শুরুর বিন্দু: since six।", en: "Six o'clock is a starting point: since six." } },
        { text: "Nobody spoke ___ the film.", bn: "সিনেমার মধ্যে কেউ কথা বলল না।", options: ["while", "during", "since"], right: 1, why: { bn: "একটা ঘটনার নামের আগে during। while-এর পরে পুরো বাক্য লাগত: while we were watching।", en: "Before an event's name, during. While would need a whole clause: while we were watching." } },
        { text: "The shop is open ___ ten at night.", bn: "দোকানটা রাত দশটা পর্যন্ত খোলা।", options: ["by", "until", "for"], right: 1, why: { bn: "দশটা পর্যন্ত চলে: until ten।", en: "It runs up to ten: until ten." } },
        { text: "You must hand in the essay ___ Sunday.", bn: "রচনাটা রবিবারের মধ্যে জমা দিতে হবে।", options: ["until", "by", "since"], right: 1, why: { bn: "সময়সীমা, তার আগেই শেষ: by Sunday। until হলে রবিবার পর্যন্ত লেখা চলত।", en: "A deadline, done before it: by Sunday. Until would mean writing continues up to Sunday." } },
        { text: "The office is open ___ nine to five.", bn: "অফিস নয়টা থেকে পাঁচটা পর্যন্ত খোলা।", options: ["from", "since", "at"], right: 0, why: { bn: "দুটো বিন্দু, from … to।", en: "Two points, from … to." } },
        { text: "We will meet again ___ next Friday.", bn: "আমরা আগামী শুক্রবার আবার দেখা করব।", options: ["on", "at", "(nothing)"], right: 2, why: { bn: "next-এর আগে কিছু নয়: next Friday।", en: "Nothing goes before next: next Friday." } },
      ],
    },
    "prepositions-match": {
      kind: "match",
      title: { bn: "জোড়া মেলাও", en: "Match the pairs" },
      note: { bn: "বাঁ দিকের শব্দের সাথে ডান দিকের preposition।", en: "The word on the left with its preposition on the right." },
      pairs: [
        { left: { bn: "good", en: "good" }, right: { bn: "at", en: "at" } },
        { left: { bn: "interested", en: "interested" }, right: { bn: "in", en: "in" } },
        { left: { bn: "listen", en: "listen" }, right: { bn: "to", en: "to" } },
        { left: { bn: "depend", en: "depend" }, right: { bn: "on", en: "on" } },
        { left: { bn: "different", en: "different" }, right: { bn: "from", en: "from" } },
        { left: { bn: "wait", en: "wait" }, right: { bn: "for", en: "for" } },
        { left: { bn: "proud", en: "proud" }, right: { bn: "of", en: "of" } },
        { left: { bn: "angry (মানুষের উপর)", en: "angry (with a person)" }, right: { bn: "with", en: "with" } },
      ],
    },
    "prepositions-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: arrive at না in?", en: "Guess first: arrive at or in?" },
      ask: { bn: "We arrived ___ Dhaka at noon and arrived ___ the station at one. দুটো ঘরে কী বসবে?", en: "We arrived ___ Dhaka at noon and arrived ___ the station at one. What fills the two gaps?" },
      choices: [
        { bn: "in, at", en: "in, at" },
        { bn: "at, at", en: "at, at" },
        { bn: "to, to", en: "to, to" },
      ],
      answer: { bn: "in Dhaka, at the station।", en: "In Dhaka, at the station." },
      why: { bn: "arrive-এর পরে কখনো to নয়; ছবিটা পৌঁছানোর নয়, থাকার। শহর বা দেশে পৌঁছালে in, কারণ ওটা একটা এলাকা, ভিতরে ঢোকা যায়। স্টেশন, স্কুল, বিমানবন্দরে at, কারণ ওটা একটা বিন্দু। reach-এর পরে কিছুই নয়: reach Dhaka। তিনটা ক্রিয়া, তিন রকম: arrive in/at, reach, get to।", en: "Never to after arrive; the picture is being there, not travelling. Arriving in a city or a country takes in, because it is an area you enter. Arriving at a station, a school or an airport takes at, because it is a point. Reach takes nothing: reach Dhaka. Three verbs, three habits: arrive in or at, reach, get to." },
    },
    "prepositions-build": {
      kind: "build",
      title: { bn: "ছবিগুলো দিয়ে বাক্য সাজাও", en: "Build the sentence from the pictures" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর পর প্রতিটা preposition-এর ছবিটা বলো।", en: "The words are shuffled. Once built, say the picture behind each preposition." },
      pattern: "verb + preposition + noun  ·  in / on / at + time",
      lines: [
        { target: "The cat jumped into the box and hid under the bed.", bn: "বেড়ালটা বাক্সে লাফিয়ে ঢুকে খাটের নিচে লুকাল।" },
        { target: "We met at the gate at five on Friday.", bn: "আমরা শুক্রবার পাঁচটায় গেটে দেখা করলাম।" },
        { target: "Rafi walked across the bridge and through the market.", bn: "রাফি সেতু পার হয়ে বাজারের ভিতর দিয়ে হাঁটল।" },
        { target: "Mitu is good at English and afraid of lizards.", bn: "মিতু ইংরেজিতে ভালো আর টিকটিকিকে ভয় পায়।" },
        { target: "I have lived in Dhaka since 2020.", bn: "আমি ২০২০ থেকে ঢাকায় থাকি।" },
        { target: "Finish your homework by nine and wait for me.", bn: "নয়টার মধ্যে হোমওয়ার্ক শেষ করে আমার জন্য অপেক্ষা করো।" },
      ],
    },
    "prepositions-spot": {
      kind: "spot",
      title: { bn: "রাফির চিঠি, preposition-এর ভুল", en: "Rafi's letter: the preposition mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে preposition ভুল, বাড়তি, বা কম, সেটা ছোঁও।", en: "Take the red pen. Tap every line where a preposition is wrong, extra, or missing." },
      source: { bn: "চিঠি: সিলেট ভ্রমণ", en: "Letter: the trip to Sylhet" },
      lines: [
        { text: { bn: "Dear Tamim, we reached at Sylhet on Friday morning.", en: "Dear Tamim, we reached at Sylhet on Friday morning." }, flag: { bn: "reach-এর পরে কিছু নয়: reached Sylhet।", en: "Nothing after reach: reached Sylhet." } },
        { text: { bn: "We stayed in a small hotel near the river.", en: "We stayed in a small hotel near the river." } },
        { text: { bn: "In the afternoon we walked along the tea gardens.", en: "In the afternoon we walked along the tea gardens." } },
        { text: { bn: "Mitu was very interested to the tea factory.", en: "Mitu was very interested to the tea factory." }, flag: { bn: "জোড়া: interested in।", en: "The pair is interested in." } },
        { text: { bn: "We discussed about the trip at night.", en: "We discussed about the trip at night." }, flag: { bn: "discuss-এর পরে about নয়: discussed the trip।", en: "No about after discuss: discussed the trip." } },
        { text: { bn: "I have been here since three days, and I love it.", en: "I have been here since three days, and I love it." }, flag: { bn: "তিন দিন একটা দৈর্ঘ্য: for three days।", en: "Three days is a length: for three days." } },
        { text: { bn: "We will come back home by Sunday evening.", en: "We will come back home by Sunday evening." } },
      ],
    },
    "prepositions-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "The window was broken ___ Rafi ___ a cricket ball. কোন জোড়া?", en: "The window was broken ___ Rafi ___ a cricket ball. Which pair?" },
          options: [
            { text: { bn: "with, by", en: "with, by" }, why: { bn: "উল্টো। যে করল সে by, যা দিয়ে করল সেটা with।", en: "Backwards. The doer takes by, the tool takes with." } },
            { text: { bn: "by, with", en: "by, with" }, right: true, why: { bn: "হ্যাঁ। broken by Rafi (কে), with a ball (কী দিয়ে)।", en: "Yes. Broken by Rafi (who), with a ball (what with)." } },
            { text: { bn: "by, by", en: "by, by" }, why: { bn: "না। বলটা করেনি, বল দিয়ে করা হয়েছে: with a ball।", en: "No. The ball did not do it; it was done with the ball: with a ball." } },
          ],
        },
        {
          ask: { bn: "Nanu is proud ___ Mitu ___ passing the exam. কোন জোড়া?", en: "Nanu is proud ___ Mitu ___ passing the exam. Which pair?" },
          options: [
            { text: { bn: "of, for", en: "of, for" }, right: true, why: { bn: "হ্যাঁ। proud of কাউকে, for কারণটা, আর preposition-এর পরে -ing: for passing।", en: "Yes. Proud of someone, for the reason, and -ing after a preposition: for passing." } },
            { text: { bn: "on, to", en: "on, to" }, why: { bn: "না। জোড়াটা proud of, আর কারণে for।", en: "No. The pair is proud of, and the reason takes for." } },
            { text: { bn: "of, to", en: "of, to" }, why: { bn: "না। কারণ বোঝাতে for, আর তার পরে passing, to pass নয়।", en: "No. The reason takes for, and passing follows it, not to pass." } },
          ],
        },
        {
          ask: { bn: "Which sentence is right?", en: "Which sentence is right?" },
          options: [
            { text: { bn: "She is married with a doctor and lives in Khulna.", en: "She is married with a doctor and lives in Khulna." }, why: { bn: "না। married to, বাংলার 'সাথে' হলেও।", en: "No. Married to, even though Bangla says with." } },
            { text: { bn: "She is married to a doctor and lives in Khulna.", en: "She is married to a doctor and lives in Khulna." }, right: true, why: { bn: "হ্যাঁ। married to, in Khulna।", en: "Yes. Married to, in Khulna." } },
            { text: { bn: "She is married to a doctor and lives at Khulna.", en: "She is married to a doctor and lives at Khulna." }, why: { bn: "না। শহরে থাকা: in Khulna। at একটা বিন্দুর জন্য।", en: "No. Living in a city: in Khulna. At is for a point." } },
          ],
        },
        {
          ask: { bn: "What are you looking ___? এই বাক্যের শেষে কী?", en: "What are you looking ___? What ends this sentence?" },
          options: [
            { text: { bn: "কিছু না; preposition দিয়ে বাক্য শেষ হয় না", en: "Nothing; a sentence cannot end with a preposition" }, why: { bn: "না। সেটা ল্যাটিনের নিয়ম। look at একটা জোড়া, আর at-টা লাগবেই।", en: "No. That is a Latin rule. Look at is a pair, and the at is needed." } },
            { text: { bn: "at", en: "at" }, right: true, why: { bn: "হ্যাঁ। What are you looking at? প্রশ্নে wh-শব্দ সামনে গেছে, preposition শেষে থেকে গেছে, আর সেটা ঠিক।", en: "Yes. What are you looking at? The wh-word moved to the front and the preposition stayed at the end, which is fine." } },
            { text: { bn: "to", en: "to" }, why: { bn: "না। জোড়াটা look at। look to মানে ভরসা করা।", en: "No. The pair is look at. Look to means rely on." } },
          ],
        },
      ],
    },
    "prepositions-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "ঘরে দশটা জিনিস কোথায় আছে বলো: The fan is on the ceiling. The books are in the bag.", en: "Say where ten things in the room are: The fan is on the ceiling. The books are in the bag." } },
        { text: { bn: "নিজের জন্মদিন তিন ভাবে: in (মাস), on (তারিখ), at (কয়টায় জন্ম, জানলে)।", en: "Your birthday three ways: in (month), on (date), at (the time, if you know it)." } },
        { text: { bn: "পাঁচটা জোড়া নিজের কথায়: I am good at… I am afraid of… I am interested in…", en: "Five pairs about yourself: I am good at… I am afraid of… I am interested in…" } },
        { text: { bn: "বাড়ি থেকে স্কুলের পথ ছয়টা preposition দিয়ে, জোরে: out of, along, past, across, through, into।", en: "Your route from home to school in six prepositions, aloud: out of, along, past, across, through, into." } },
        { text: { bn: "নিজের দিন for, since, until, by দিয়ে চার বাক্যে: I have studied for…, I have been awake since…, I will play until…, I will be home by…", en: "Your day in four sentences with for, since, until and by: I have studied for…, I have been awake since…, I will play until…, I will be home by…" } },
        { text: { bn: "পাঁচটা ফাঁদের ক্রিয়া বাক্যে, preposition ছাড়া, তিনবার: enter the room, discuss the matter, reach Dhaka, answer the question, marry someone।", en: "The five trap verbs in sentences without a preposition, three times: enter the room, discuss the matter, reach Dhaka, answer the question, marry someone." } },
      ],
    },
  },
};
