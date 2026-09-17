/* ============================================================
   07-tenses.ts: পর্ব ৭, টাইম মেশিন: তিন কাল, চার রূপ.

   One part of the grammar term, gathered into the rung by
   `basic.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>ডোরেমনের টাইম মেশিন মনে আছে? নোবিতা ডেস্কের ড্রয়ার খুলে অতীতে চলে যায়, ভবিষ্যতে চলে যায়। ইংরেজি ক্রিয়াও ঠিক তাই করে, কিন্তু ড্রয়ার নয়, ক্রিয়ার রূপ বদলে। <span lang="en">I eat, I ate, I will eat</span>: একই কাজ, তিন সময়। আর প্রতিটা সময়ে চার রকম করে বলা যায়: কাজটা এমনি হয়, চলছে, শেষ হয়েছে, নাকি শেষ-হওয়া-চলছে। তিন গুণ চার, বারোটা ঘর। এই পর্বে পুরো মানচিত্র, আর মাঝের ছয়টা ঘরে আজই ঢুকে পড়া। বাকি ছয়টা পর্ব ১১-তে।</p>

<p>এই পর্বটা এই টার্মের সবচেয়ে লম্বা, আর সেটা ইচ্ছে করেই। পরীক্ষার <span lang="en">right form of verbs</span>-এর অর্ধেক নম্বর এই ছয়টা ঘরে, আর রোজকার কথার নব্বই ভাগ। তাই আজ ছয়টা ঘরের প্রতিটা আলাদা করে, তার সময়ের শব্দ, তার বানান, তার রেবেল, তার ফাঁদ, আর ঘর থেকে ঘরে যাওয়ার খেলা।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>তিন কাল: <span lang="en">present</span> (আজ), <span lang="en">past</span> (কাল), <span lang="en">future</span> (আগামীকাল)।</li>
<li>চার রূপ: <span lang="en">simple</span> (এমনি), <span lang="en">continuous</span> (চলছে, <span lang="en">be + -ing</span>), <span lang="en">perfect</span> (শেষ, <span lang="en">have + V3</span>), <span lang="en">perfect continuous</span>।</li>
<li>সবচেয়ে বেশি লাগে ছয়টা: তিন <span lang="en">simple</span> আর তিন <span lang="en">continuous</span>। রোজকার কথার নব্বই ভাগ এখানে।</li>
<li><span lang="en">continuous</span> মানে ছবিটা নড়ছে: <span lang="en">is playing</span>। <span lang="en">simple</span> মানে ছবিটা স্থির, অভ্যাস বা সত্যি: <span lang="en">plays</span>।</li>
<li>একটা ক্রিয়ার পাঁচটা রূপ, আর সবগুলো ঘর এই পাঁচটা দিয়েই তৈরি: <span lang="en">play, plays, playing, played, played</span>।</li>
<li>সময়ের শব্দটা ঘর বলে দেয়: <span lang="en">every day, now, yesterday, while, tomorrow</span>।</li>
</ul>
</div>

${mount("tenses-pattern")}

<h2>বারোটা ঘর, এক নজরে</h2>

<p>একটা ক্রিয়া নাও, <span lang="en">play</span>, আর কর্তা <span lang="en">Rafi</span>। এই ছকটা মুখস্থ নয়, চেনার জন্য। মোটা করা ছয়টা ঘরই আজকের।</p>

<div class="table-scroll">
<table>
<thead><tr><th></th><th>simple: এমনি</th><th>continuous: চলছে</th><th>perfect: শেষ</th><th>perfect continuous</th></tr></thead>
<tbody>
<tr><td>present</td><td><strong><span lang="en">plays</span></strong></td><td><strong><span lang="en">is playing</span></strong></td><td><span lang="en">has played</span></td><td><span lang="en">has been playing</span></td></tr>
<tr><td>past</td><td><strong><span lang="en">played</span></strong></td><td><strong><span lang="en">was playing</span></strong></td><td><span lang="en">had played</span></td><td><span lang="en">had been playing</span></td></tr>
<tr><td>future</td><td><strong><span lang="en">will play</span></strong></td><td><strong><span lang="en">will be playing</span></strong></td><td><span lang="en">will have played</span></td><td><span lang="en">will have been playing</span></td></tr>
</tbody>
</table>
</div>

<h2>একটা ক্রিয়ার পাঁচটা রূপ</h2>

<p>বারোটা ঘর দেখে ভয় লাগে, কিন্তু একটা ক্রিয়ার রূপ মাত্র পাঁচটা, আর বারোটা ঘরের প্রতিটা এই পাঁচটা থেকে বানানো। <span lang="en">write</span> নাও। খালি রূপ: <span lang="en">write</span>। একজনের রূপ: <span lang="en">writes</span>। চলার রূপ: <span lang="en">writing</span>। অতীত, যাকে বইয়ে V2 বলে: <span lang="en">wrote</span>। তৃতীয় রূপ, V3, যেটা <span lang="en">have</span> আর <span lang="en">be</span>-র পরে বসে: <span lang="en">written</span>। নিয়মিত ক্রিয়ায় V2 আর V3 একই (<span lang="en">played, played</span>); রেবেলদের আলাদা। এই পাঁচটা জানলে বারোটা ঘরে যাওয়া শুধু সাহায্যকারী বসানো: <span lang="en">is writing, was writing, will write, has written</span>।</p>

${mount("tenses-forms")}

<h2>present simple: যা হয়, যা সত্যি</h2>

<p>অভ্যাস, রুটিন, চিরসত্য। <span lang="en">Rafi plays cricket every Friday.</span> প্রতি শুক্রবার, অভ্যাস। <span lang="en">The sun rises in the east.</span> চিরসত্য। <span lang="en">Nanu tells stories at night.</span> রুটিন। সাথে প্রায়ই থাকে <span lang="en">every day, always, usually, often, never, on Fridays</span>। আর একজন হলে সেই টুপিটা: <span lang="en">-s</span>।</p>

<p>আরও তিনটা কাজ, যেগুলো পরীক্ষায় লুকিয়ে আসে। সময়সূচি, ভবিষ্যতের হলেও: <span lang="en">The train leaves at six tomorrow. The exam starts on Monday.</span> সূচির জিনিস স্থির, তাই স্থির ছবি। গল্প বলার সময়, প্রাণ দিতে: <span lang="en">Then the fox jumps and the tiger runs!</span> আর নির্দেশ: <span lang="en">You take the first left, then you cross the bridge.</span></p>

<h2>present continuous: এই মুহূর্তে যা চলছে</h2>

<p><span lang="en">am/is/are + -ing</span>। ছবিটা নড়ছে, এখনই। <span lang="en">Rafi is playing cricket now.</span> <span lang="en">Look! It is raining.</span> সাথে <span lang="en">now, at the moment, look, listen</span>। বাংলাভাষীর জন্য এটা উপহার, কারণ বাংলাও ঠিক এই ভাগটা করে: "খেলে" আর "খেলছে"। <span lang="en">plays</span> আর <span lang="en">is playing</span>। যে ভাষায় এই দুটো আলাদা, সে ভাষার লোকের এই কাল শিখতে এক দিন লাগে।</p>

<p>এই ঘরেরও তিনটা বাড়তি কাজ। কিছুদিনের জন্য, স্থায়ী নয়: <span lang="en">I am staying with Nanu this week.</span> (রোজ থাকি না।) ঠিক করা ভবিষ্যৎ, তারিখ সহ: <span lang="en">We are playing Ideal School on Sunday.</span> আর বিরক্তির অভ্যাস, <span lang="en">always</span> সহ: <span lang="en">Rafi is always losing his kit!</span> এখানে <span lang="en">always</span> অভ্যাস নয়, বিরক্তি।</p>

<p><span lang="en">-ing</span> লাগানোর বানান তিনটা: সাধারণত শুধু <span lang="en">-ing</span> (<span lang="en">play, playing</span>)। শেষে চুপ <span lang="en">e</span> থাকলে <span lang="en">e</span> বাদ (<span lang="en">write, writing; make, making; come, coming</span>)। এক স্বর + এক ব্যঞ্জনে শেষ হলে ব্যঞ্জন দুবার (<span lang="en">run, running; sit, sitting; swim, swimming; stop, stopping</span>)। কিন্তু <span lang="en">rain, raining</span>, কারণ দুটো স্বর; <span lang="en">open, opening</span>, কারণ জোর প্রথম সিলেবলে।</p>

${mount("tenses-lines")}

${mount("tenses-timeline")}

<h2>past simple: কাল যা হয়েছে, শেষ</h2>

<p>কাজটা হয়ে গেছে, সময়টা শেষ। <span lang="en">Bangladesh beat India in 2007.</span> <span lang="en">Rafi played yesterday.</span> নিয়মিত ক্রিয়ায় <span lang="en">-ed</span>, আর রেবেলদের নিজেদের রূপ: <span lang="en">go, went; eat, ate; see, saw; have, had; do, did</span>। সাথে <span lang="en">yesterday, last week, in 2007, ago</span>। কর্তা যেই হোক, রূপ এক: <span lang="en">I played, she played, they played</span>। কোনো টুপি নেই।</p>

<p><span lang="en">-ed</span>-এর বানানও <span lang="en">-ing</span>-এর মতোই: <span lang="en">play, played; love, loved; stop, stopped; study, studied</span>। আর উচ্চারণ তিন রকম, যেটা শুনলে বানান মনে থাকে: <span lang="en">played, loved</span>-এ "ড"; <span lang="en">walked, stopped, laughed</span>-এ "ট"; <span lang="en">wanted, needed, started</span>-এ বাড়তি সিলেবল, "ইড", কারণ শেষে <span lang="en">t</span> বা <span lang="en">d</span> আগে থেকেই আছে।</p>

<h2>রেবেলদের তালিকা, যেটা না জানলে ঘরগুলো খোলে না</h2>

<p>ইংরেজির সবচেয়ে বেশি ব্যবহৃত ক্রিয়াগুলো প্রায় সবাই রেবেল। এই ত্রিশটা তিন রূপে জানলে past simple, perfect (পর্ব ১১) আর passive (পর্ব ১৫), তিনটার দরজা খুলে যায়। রূপগুলো দলে দলে মনে রাখো: যেগুলো একদম বদলায় না, যেগুলোর V2 আর V3 এক, আর যেগুলোর তিনটাই আলাদা।</p>

<div class="table-scroll">
<table>
<thead><tr><th>দল</th><th>V1</th><th>V2</th><th>V3</th></tr></thead>
<tbody>
<tr><td rowspan="3">বদলায় না</td><td><span lang="en">cut</span></td><td><span lang="en">cut</span></td><td><span lang="en">cut</span></td></tr>
<tr><td><span lang="en">put</span></td><td><span lang="en">put</span></td><td><span lang="en">put</span></td></tr>
<tr><td><span lang="en">read</span></td><td><span lang="en">read</span> (উচ্চারণ "রেড")</td><td><span lang="en">read</span></td></tr>
<tr><td rowspan="8">V2 আর V3 এক</td><td><span lang="en">have</span></td><td><span lang="en">had</span></td><td><span lang="en">had</span></td></tr>
<tr><td><span lang="en">make</span></td><td><span lang="en">made</span></td><td><span lang="en">made</span></td></tr>
<tr><td><span lang="en">say</span></td><td><span lang="en">said</span></td><td><span lang="en">said</span></td></tr>
<tr><td><span lang="en">tell</span></td><td><span lang="en">told</span></td><td><span lang="en">told</span></td></tr>
<tr><td><span lang="en">buy</span></td><td><span lang="en">bought</span></td><td><span lang="en">bought</span></td></tr>
<tr><td><span lang="en">think</span></td><td><span lang="en">thought</span></td><td><span lang="en">thought</span></td></tr>
<tr><td><span lang="en">teach</span></td><td><span lang="en">taught</span></td><td><span lang="en">taught</span></td></tr>
<tr><td><span lang="en">keep, sleep, feel, meet</span></td><td><span lang="en">kept, slept, felt, met</span></td><td><span lang="en">kept, slept, felt, met</span></td></tr>
<tr><td rowspan="8">তিনটাই আলাদা</td><td><span lang="en">go</span></td><td><span lang="en">went</span></td><td><span lang="en">gone</span></td></tr>
<tr><td><span lang="en">see</span></td><td><span lang="en">saw</span></td><td><span lang="en">seen</span></td></tr>
<tr><td><span lang="en">eat</span></td><td><span lang="en">ate</span></td><td><span lang="en">eaten</span></td></tr>
<tr><td><span lang="en">write</span></td><td><span lang="en">wrote</span></td><td><span lang="en">written</span></td></tr>
<tr><td><span lang="en">take, give</span></td><td><span lang="en">took, gave</span></td><td><span lang="en">taken, given</span></td></tr>
<tr><td><span lang="en">speak, break</span></td><td><span lang="en">spoke, broke</span></td><td><span lang="en">spoken, broken</span></td></tr>
<tr><td><span lang="en">begin, drink, sing, swim</span></td><td><span lang="en">began, drank, sang, swam</span></td><td><span lang="en">begun, drunk, sung, swum</span></td></tr>
<tr><td><span lang="en">do, be</span></td><td><span lang="en">did, was/were</span></td><td><span lang="en">done, been</span></td></tr>
</tbody>
</table>
</div>

${mount("tenses-rebels")}

<h2>past continuous: তখন যা চলছিল</h2>

<p><span lang="en">was/were + -ing</span>। অতীতের একটা মুহূর্তে ছবিটা নড়ছিল। <span lang="en">I was sleeping when the phone rang.</span> ঘুমটা চলছিল (লম্বা), ফোনটা বাজল (হঠাৎ, এক মুহূর্ত)। লম্বা কাজটা <span lang="en">was -ing</span>, হঠাৎ কাজটা <span lang="en">-ed</span>। এই জোড়াটা গল্পের প্রাণ: নানু বলেন, <span lang="en">The king was sleeping when the thief entered.</span></p>

<p>জোড়াটার দুটো শব্দ: <span lang="en">when</span> আর <span lang="en">while</span>। <span lang="en">when</span>-এর পরে সাধারণত হঠাৎ কাজটা (<span lang="en">when the thief entered</span>), <span lang="en">while</span>-এর পরে লম্বা কাজটা (<span lang="en">while the king was sleeping</span>)। দুটো লম্বা কাজ একসাথে চললে দুটোই <span lang="en">was -ing</span>: <span lang="en">While Nanu was cooking, Rafi was reading.</span> আর <span lang="en">was -ing</span> একা, শুধু দৃশ্য আঁকতে: <span lang="en">The sun was shining and the birds were singing.</span> পরীক্ষায় <span lang="en">when</span> দেখলে দুই ঘরের জোড়াটা মনে করো।</p>

<h2>future: will আর going to</h2>

<p><span lang="en">will + verb</span>: এইমাত্র ঠিক করলাম, বা কথা দিচ্ছি, বা অনুমান। <span lang="en">I will call you.</span> <span lang="en">It will rain tomorrow.</span> <span lang="en">going to + verb</span>: আগে থেকেই ঠিক করা, প্রমাণ আছে। <span lang="en">We are going to watch the final.</span> টিকিট কাটা আছে। আর <span lang="en">will be -ing</span>: ভবিষ্যতের একটা মুহূর্তে যা চলবে। <span lang="en">This time tomorrow I will be sitting in the exam hall.</span></p>

<p>ভবিষ্যৎ বলার আসলে চারটা পথ, আর পার্থক্যটা কতটা ঠিক করা তার। <span lang="en">will</span>: এখনই মাথায় এল, বা কথা দিলাম। <span lang="en">going to</span>: আগে থেকে ভেবে রেখেছি, বা চিহ্ন দেখা যাচ্ছে (<span lang="en">Look at those clouds. It is going to rain.</span>)। <span lang="en">present continuous</span>: ঠিক করা, তারিখ আর জায়গা সহ (<span lang="en">I am meeting Mitu at five.</span>)। <span lang="en">present simple</span>: সূচি (<span lang="en">The bus leaves at six.</span>)। কথায় চারটাই চলে; পরীক্ষায় <span lang="en">tomorrow, next week</span> দেখলে <span lang="en">will</span> নিরাপদ, আর <span lang="en">Look!</span> বা কোনো চিহ্ন থাকলে <span lang="en">going to</span>।</p>

${mount("tenses-future")}

${mount("tenses-gap")}

<div class="ex"><b>Ice Age-এর ছোট্ট কাঠবিড়ালিটা মনে করো:</b> <span lang="en">Scrat wants the acorn. He is chasing it. He chased it yesterday. He was chasing it when the ice cracked. He will chase it forever.</span> একটা প্রাণী, একটা বাদাম, পাঁচটা কাল। কালটা বদলায়, লোভটা না।</div>

${mount("tenses-bins")}

${mount("tenses-reveal")}

<h2>ঘর থেকে ঘরে: একই বাক্য ছয়বার</h2>

<p>টাইম মেশিন শেখার সবচেয়ে ভালো খেলা: একটা বাক্য নাও আর ছয়টা বোতাম টেপো। <span lang="en">Nanu tells a story.</span> <span lang="en">Nanu is telling a story.</span> <span lang="en">Nanu told a story.</span> <span lang="en">Nanu was telling a story.</span> <span lang="en">Nanu will tell a story.</span> <span lang="en">Nanu will be telling a story.</span> ছয়টা বাক্যে বদলেছে শুধু ক্রিয়ার টুকরোটা: <span lang="en">tells, is telling, told, was telling, will tell, will be telling</span>। বাকি সব এক। পরীক্ষার <span lang="en">transformation</span> প্রশ্নে "change the tense" ঠিক এটাই।</p>

<p>প্রশ্ন আর না-বাচকেও একই ছয় ঘর, শুধু সাহায্যকারী সামনে বা তার পরে <span lang="en">not</span>। যে ঘরে সাহায্যকারী নেই, <span lang="en">tells, told</span>, সেখানে <span lang="en">do</span> ধার করতে হয়: <span lang="en">Does Nanu tell? Did Nanu tell? Nanu does not tell. Nanu did not tell.</span> আর <span lang="en">did</span>, <span lang="en">does</span> এলে মূল ক্রিয়া খালি হয়ে যায়: <span lang="en">Did Nanu told</span> নয়। পর্ব ১৩-তে পুরো মেশিন।</p>

${mount("tenses-build")}

${mount("tenses-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p><span lang="en">Right form of verbs</span>: একটা অনুচ্ছেদ, দশটা বন্ধনী। প্রতিটা ঘরে চারটা প্রশ্ন, ক্রমে। আর একটা কৌশল যেটা অর্ধেক নম্বর বাঁচায়: অনুচ্ছেদটা যে কালে শুরু, বেশিরভাগ ঘর সেই কালেই, কারণ একটা গল্প একটা কালে চলে। প্রথম ক্রিয়াটা ঠিক করো, তারপর সময়ের শব্দ যেখানে বদলায় সেখানেই শুধু ঘর বদলাও।</p>

<ol class="step-list">
<li><strong>সময়ের শব্দ খোঁজো।</strong> ঘরে না থাকলে অনুচ্ছেদের প্রথম লাইনে। <span lang="en">yesterday, ago, last, in 1971</span>: অতীত। <span lang="en">every, usually, always</span>: present simple। <span lang="en">now, look, at the moment</span>: continuous। <span lang="en">tomorrow, next</span>: future।</li>
<li><strong>স্থির না নড়া ছবি?</strong> অভ্যাস আর সত্যি স্থির (simple)। ওই মুহূর্তে চলছে বা চলছিল, নড়া (continuous)। <span lang="en">when</span> + হঠাৎ কাজ থাকলে অন্যটা <span lang="en">was -ing</span>।</li>
<li><strong>ক্রিয়াটা রেবেল?</strong> অতীত হলে V2 খোঁজো: <span lang="en">go, went</span>। <span lang="en">goed</span> লিখলে নম্বর যায়।</li>
<li><strong>অবস্থার ক্রিয়া?</strong> <span lang="en">know, like, want, have, believe</span>: <span lang="en">-ing</span> নয়, <span lang="en">now</span> থাকলেও।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Rafi usually (walk) ___ to school, but yesterday he (take) ___ a rickshaw because it (rain) ___ heavily. While he (sit) ___ in the rickshaw, he (see) ___ Mitu. She (wait) ___ for a bus. "Tomorrow I (bring) ___ my umbrella," she said.</span> উত্তর: <span lang="en">walks</span> (<span lang="en">usually</span>, অভ্যাস), <span lang="en">took</span> (<span lang="en">yesterday</span>, রেবেল), <span lang="en">was raining</span> (তখন চলছিল), <span lang="en">was sitting</span> (<span lang="en">while</span>, লম্বা কাজ), <span lang="en">saw</span> (হঠাৎ, রেবেল), <span lang="en">was waiting</span> (চলছিল), <span lang="en">will bring</span> (<span lang="en">tomorrow</span>)। সাত ঘর, চার প্রশ্ন।</div>

${mount("tenses-hard")}

${mount("tenses-exam")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>কাল চেনার সবচেয়ে ভালো উপায় সময়ের শব্দ খোঁজা। <span lang="en">every day, usually, always</span>: present simple। <span lang="en">now, at the moment, Look!</span>: present continuous। <span lang="en">yesterday, ago, last, in 1971</span>: past simple। <span lang="en">while, when</span> + অন্য একটা past কাজ: past continuous। <span lang="en">tomorrow, next week, soon</span>: future। শব্দটা আগে খোঁজো, তারপর ঘর বাছো।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>কিছু ক্রিয়া <span lang="en">-ing</span> নেয় না, কারণ সেগুলো কাজ নয়, অবস্থা: <span lang="en">know, like, love, want, need, believe, understand, have</span> (মালিকানা অর্থে)। <span lang="en">I am knowing</span> নয়, <span lang="en">I know</span>। <span lang="en">I am loving cricket</span> নয়, <span lang="en">I love cricket</span>। বাংলায় "জানছি" বলা যায় না, ইংরেজিতেও যায় না।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>একটা বাক্যে দুটো অতীত কাজ থাকলে <span lang="en">did</span> একবারই: <span lang="en">Did you see the match?</span> ঠিক, <span lang="en">Did you saw</span> ভুল। আর <span lang="en">ago</span> সবসময় past simple, <span lang="en">have</span> কখনো নয়: <span lang="en">I saw him two days ago</span>, <span lang="en">I have seen him two days ago</span> নয়। কেন, সেটা পর্ব ১১-এর গল্প; আপাতত <span lang="en">ago</span> দেখলে V2।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>একটা ক্রিয়ার পাঁচটা রূপ বলতে পারি, নিয়মিত আর রেবেল দুটোরই?</li>
<li>ছয়টা বোতাম একটা বাক্যে জোরে টিপতে পারি?</li>
<li><span lang="en">was -ing</span> আর <span lang="en">-ed</span> কোন জোড়ায় কে লম্বা, কে হঠাৎ?</li>
<li><span lang="en">will</span> আর <span lang="en">going to</span>-র পার্থক্য এক বাক্যে?</li>
<li>দশটা রেবেল তিন রূপে না দেখে?</li>
<li>কোন দশটা ক্রিয়া <span lang="en">-ing</span> নেয় না?</li>
</ul>
</div>

${mount("tenses-drill")}
`,
  blocks: {
    "tenses-pattern": {
      kind: "pattern",
      title: { bn: "টাইম মেশিনের ছয়টা বোতাম", en: "Six buttons on the time machine" },
      shape: "plays / is playing  ·  played / was playing  ·  will play / will be playing",
      why: { bn: "তিন সময়, আর প্রতিটায় দুই রূপ: স্থির ছবি (simple) আর নড়া ছবি (continuous, be + -ing)। এই ছয়টা দিয়ে রোজকার কথার প্রায় সবটা বলা যায়। বাকি ছয়টা ঘর, perfect, পর্ব ১১-তে।", en: "Three times, two forms each: the still picture (simple) and the moving one (continuous, be + -ing). These six carry almost all daily speech. The other six, the perfects, are part 11." },
      examples: [
        { target: "Rafi plays cricket every Friday.", bn: "রাফি প্রতি শুক্রবার ক্রিকেট খেলে। (অভ্যাস)" },
        { target: "Rafi is playing cricket now.", bn: "রাফি এখন ক্রিকেট খেলছে। (এই মুহূর্তে)" },
        { target: "Rafi played cricket yesterday.", bn: "রাফি কাল ক্রিকেট খেলেছে। (শেষ)" },
        { target: "Rafi was playing when it started to rain.", bn: "রাফি খেলছিল, তখন বৃষ্টি শুরু হলো। (চলছিল)" },
        { target: "Rafi will play cricket tomorrow.", bn: "রাফি কাল ক্রিকেট খেলবে।" },
        { target: "Rafi will be playing at five o'clock.", bn: "রাফি পাঁচটার সময় খেলতে থাকবে।" },
      ],
      tip: { bn: "সময়ের শব্দটা আগে খোঁজো: every day, now, yesterday, tomorrow। শব্দটাই ঘর বলে দেয়।", en: "Find the time word first: every day, now, yesterday, tomorrow. The word names the box." },
    },
    "tenses-forms": {
      kind: "grid",
      model: "en-forms",
      title: { bn: "একটা ক্রিয়ার পাঁচ রূপ, নিজে ভরো", en: "One verb, five shapes: fill it yourself" },
      note: { bn: "write-এর খালি রূপ দেওয়া আছে। বাকি চারটা লেখো, তারপর মিলিয়ে দেখো।", en: "The bare form of write is given. Type the other four, then check." },
    },
    "tenses-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: স্থির আর নড়া ছবি", en: "Listen, say: the still and the moving picture" },
      lines: [
        { target: "Nanu tells stories every night.", bn: "নানু রোজ রাতে গল্প বলেন। (অভ্যাস)" },
        { target: "Nanu is telling a story right now.", bn: "নানু এখনই একটা গল্প বলছেন। (চলছে)" },
        { target: "Mitu studies in the morning.", bn: "মিতু সকালে পড়ে।" },
        { target: "Mitu is studying at the moment, so be quiet.", bn: "মিতু এই মুহূর্তে পড়ছে, তাই চুপ করো।" },
        { target: "It rains a lot in July.", bn: "জুলাইয়ে অনেক বৃষ্টি হয়।" },
        { target: "Look, it is raining!", bn: "দেখো, বৃষ্টি হচ্ছে!" },
        { target: "The train leaves at six tomorrow morning.", bn: "ট্রেনটা কাল সকাল ছয়টায় ছাড়ে। (সূচি, তাই simple)" },
      ],
    },
    "tenses-timeline": {
      kind: "figure",
      shape: "timeline",
      title: { bn: "একটা কাজ, ছয়টা সময়", en: "One action, six times" },
      parts: [
        { text: { bn: "গতকাল: played", en: "Yesterday: played" }, note: { bn: "শেষ, সময়টাও শেষ", en: "Finished, and the time is closed" } },
        { text: { bn: "কাল বিকেল, যখন বৃষ্টি এল: was playing", en: "Yesterday afternoon, when the rain came: was playing" }, note: { bn: "তখন চলছিল", en: "Was running at that moment" } },
        { text: { bn: "রোজ: plays", en: "Every day: plays" }, note: { bn: "অভ্যাস, স্থির ছবি", en: "A habit, a still picture" }, tone: "lead" },
        { text: { bn: "এখন: is playing", en: "Now: is playing" }, note: { bn: "এই মুহূর্তে, নড়া ছবি", en: "At this moment, a moving picture" }, tone: "good" },
        { text: { bn: "আগামীকাল: will play", en: "Tomorrow: will play" }, note: { bn: "হবে", en: "Will happen" } },
        { text: { bn: "কাল ঠিক পাঁচটায়: will be playing", en: "At five tomorrow: will be playing" }, note: { bn: "তখন চলতে থাকবে", en: "Will be running at that moment" } },
      ],
      caption: { bn: "বাঁ থেকে ডানে সময়। প্রতিটা বিন্দুতে একই ক্রিয়া, অন্য পোশাকে।", en: "Time runs left to right. The same verb at every point, in a different costume." },
    },
    "tenses-rebels": {
      kind: "grid",
      model: "en-rebels",
      title: { bn: "রেবেলদের তিন রূপ, নিজে ভরো", en: "The rebels' three forms: fill it yourself" },
      note: { bn: "go-র সারি দেওয়া আছে। বাকিদের V2 আর V3 লেখো। V3 পর্ব ১১ আর ১৫-এর চাবি।", en: "The go row is given. Type V2 and V3 of the rest. V3 is the key to parts 11 and 15." },
    },
    "tenses-future": {
      kind: "compare",
      title: { bn: "ভবিষ্যতের চার পথ", en: "Four roads to the future" },
      note: { bn: "একই কাজ, কতটা ঠিক করা তার উপর চার রকম বলা।", en: "The same action, said four ways depending on how settled it is." },
      columns: [
        { bn: "will", en: "will" },
        { bn: "going to", en: "going to" },
        { bn: "am / is / are -ing", en: "am / is / are -ing" },
        { bn: "present simple", en: "present simple" },
      ],
      rows: [
        { label: { bn: "কখন", en: "When" }, cells: [{ bn: "এইমাত্র ঠিক করলাম, কথা দিলাম, আন্দাজ", en: "decided just now, a promise, a guess" }, { bn: "আগে থেকে ভাবা, বা চিহ্ন দেখা যাচ্ছে", en: "planned already, or the signs are visible" }, { bn: "ঠিক করা, তারিখ আর জায়গা সহ", en: "arranged, with a date and a place" }, { bn: "সূচি, সময়সারণি", en: "a timetable" }] },
        { label: { bn: "উদাহরণ", en: "Example" }, cells: [{ bn: "I will call you tonight.", en: "I will call you tonight." }, { bn: "We are going to watch the final.", en: "We are going to watch the final." }, { bn: "I am meeting Mitu at five.", en: "I am meeting Mitu at five." }, { bn: "The bus leaves at six.", en: "The bus leaves at six." }] },
        { label: { bn: "চিহ্ন", en: "Signal" }, cells: [{ bn: "I think, probably, promise", en: "I think, probably, promise" }, { bn: "Look!, already decided", en: "Look!, already decided" }, { bn: "on Sunday, at five", en: "on Sunday, at five" }, { bn: "timetable, schedule", en: "timetable, schedule" }] },
        { label: { bn: "পরীক্ষায় নিরাপদ", en: "Safe in the exam" }, cells: [{ bn: "tomorrow, next week দেখলে", en: "with tomorrow, next week" }, { bn: "Look at the clouds দেখলে", en: "with Look at the clouds" }, { bn: "কমই আসে", en: "rarely set" }, { bn: "সূচির শব্দ থাকলে", en: "with timetable words" }], best: 0 },
      ],
    },
    "tenses-gap": {
      kind: "gap",
      title: { bn: "কোন বোতাম", en: "Which button" },
      note: { bn: "সময়ের শব্দটা খোঁজো, তারপর ছোঁও।", en: "Find the time word, then tap." },
      items: [
        { text: "Rafi ___ cricket every Friday.", bn: "রাফি প্রতি শুক্রবার ক্রিকেট খেলে।", options: ["plays", "is playing", "played"], right: 0, why: { bn: "every Friday: অভ্যাস, present simple, আর Rafi একজন তাই -s।", en: "Every Friday is a habit: present simple, with the -s because Rafi is one." } },
        { text: "Be quiet! The baby ___.", bn: "চুপ! বাচ্চাটা ঘুমাচ্ছে।", options: ["sleeps", "is sleeping", "slept"], right: 1, why: { bn: "এই মুহূর্তে চলছে: is sleeping। Be quiet! সময়ের শব্দের মতোই কাজ করছে।", en: "Happening right now: is sleeping. Be quiet! works like a time word." } },
        { text: "Bangladesh ___ the match last night.", bn: "বাংলাদেশ কাল রাতে ম্যাচটা জিতেছে।", options: ["wins", "is winning", "won"], right: 2, why: { bn: "last night: শেষ হয়ে যাওয়া অতীত। win একটা রেবেল: won।", en: "Last night: a finished past. Win is a rebel: won." } },
        { text: "I ___ TV when the lights went out.", bn: "আমি টিভি দেখছিলাম, তখন কারেন্ট চলে গেল।", options: ["watched", "was watching", "am watching"], right: 1, why: { bn: "লম্বা কাজটা চলছিল, হঠাৎ কাজটা হলো: was watching … went out।", en: "The long action was running when the sudden one happened: was watching … went out." } },
        { text: "Don't worry, I ___ you tomorrow.", bn: "চিন্তা কোরো না, আমি কাল তোমাকে ফোন করব।", options: ["call", "will call", "called"], right: 1, why: { bn: "tomorrow, আর একটা কথা দেওয়া: will call।", en: "Tomorrow, and a promise: will call." } },
        { text: "Mitu ___ two brothers.", bn: "মিতুর দুই ভাই।", options: ["has", "is having", "had"], right: 0, why: { bn: "have মালিকানা অর্থে অবস্থা, কাজ নয়: -ing নেয় না। has।", en: "Have in the sense of owning is a state, not an action: no -ing. Has." } },
        { text: "Look at those clouds! It ___ rain.", bn: "মেঘগুলো দেখো! বৃষ্টি হবে।", options: ["will", "is going to", "is"], right: 1, why: { bn: "চিহ্ন দেখা যাচ্ছে, মেঘ: going to। Look! থাকলে going to।", en: "The signs are visible, the clouds: going to. With Look!, going to." } },
        { text: "The exam ___ at ten o'clock on Monday.", bn: "পরীক্ষা সোমবার দশটায় শুরু।", options: ["starts", "is starting", "will have started"], right: 0, why: { bn: "সূচি, স্থির জিনিস: present simple, ভবিষ্যতের হলেও।", en: "A timetable, a fixed thing: present simple, even for the future." } },
      ],
    },
    "tenses-bins": {
      kind: "bins",
      title: { bn: "সময়ের শব্দগুলো ভাগ করো", en: "Sort the time words" },
      bins: [
        { id: "ps", label: { bn: "present simple", en: "present simple" } },
        { id: "pc", label: { bn: "present continuous", en: "present continuous" } },
        { id: "pa", label: { bn: "past", en: "past" } },
        { id: "fu", label: { bn: "future", en: "future" } },
      ],
      items: [
        { text: { bn: "every day", en: "every day" }, bin: "ps", why: { bn: "রোজ, অভ্যাস।", en: "Daily, a habit." } },
        { text: { bn: "now", en: "now" }, bin: "pc", why: { bn: "এই মুহূর্তে চলছে।", en: "Happening at this moment." } },
        { text: { bn: "yesterday", en: "yesterday" }, bin: "pa", why: { bn: "শেষ হয়ে যাওয়া সময়।", en: "A finished time." } },
        { text: { bn: "tomorrow", en: "tomorrow" }, bin: "fu", why: { bn: "আগামীকাল।", en: "The day after today." } },
        { text: { bn: "usually", en: "usually" }, bin: "ps", why: { bn: "সাধারণত, অভ্যাস।", en: "Usually, a habit." } },
        { text: { bn: "at the moment", en: "at the moment" }, bin: "pc", why: { bn: "এই মুহূর্তে।", en: "At this moment." } },
        { text: { bn: "in 2007", en: "in 2007" }, bin: "pa", why: { bn: "একটা নির্দিষ্ট অতীত বছর।", en: "A specific past year." } },
        { text: { bn: "next week", en: "next week" }, bin: "fu", why: { bn: "আগামী সপ্তাহ।", en: "The week to come." } },
        { text: { bn: "two days ago", en: "two days ago" }, bin: "pa", why: { bn: "ago মানেই অতীত।", en: "Ago always means the past." } },
        { text: { bn: "Look!", en: "Look!" }, bin: "pc", why: { bn: "দেখো! মানে এখনই কিছু চলছে।", en: "Look! means something is happening right now." } },
        { text: { bn: "on Fridays", en: "on Fridays" }, bin: "ps", why: { bn: "প্রতি শুক্রবার, অভ্যাস।", en: "Every Friday, a habit." } },
        { text: { bn: "soon", en: "soon" }, bin: "fu", why: { bn: "শিগগিরই, সামনে।", en: "Soon, ahead." } },
      ],
    },
    "tenses-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: I'm loving it?", en: "Guess first: I'm loving it?" },
      ask: { bn: "একটা বিখ্যাত বিজ্ঞাপন বলে, I'm loving it. পর্বের নিয়ম বলে love অবস্থার ক্রিয়া, -ing নেয় না। কে ঠিক?", en: "A famous advert says, I'm loving it. This part says love is a state verb and takes no -ing. Who is right?" },
      choices: [
        { bn: "বিজ্ঞাপনটা, নিয়মটা পুরনো", en: "The advert; the rule is old" },
        { bn: "নিয়মটা; বিজ্ঞাপনটা ইচ্ছে করে ভাঙছে", en: "The rule; the advert breaks it on purpose" },
        { bn: "দুটোই সমান ঠিক", en: "Both are equally right" },
      ],
      answer: { bn: "নিয়মটা। বিজ্ঞাপনটা ইচ্ছে করে ভাঙছে, চোখে পড়ার জন্য।", en: "The rule. The advert breaks it on purpose, to catch the eye." },
      why: { bn: "I love it মানে আমার ভালো লাগে, একটা অবস্থা। I'm loving it নিয়ম ভেঙে বলে, এই মুহূর্তে উপভোগ করছি, আর ভাঙাটাই চোখে পড়ে, সেটাই বিজ্ঞাপনের কাজ। কথায় কেউ কেউ বলে, কিন্তু পরীক্ষার খাতায় know, like, love, want, need, believe, understand, have কখনো -ing নেয় না। বিজ্ঞাপন থেকে ব্যাকরণ শিখো না; বিজ্ঞাপন ব্যাকরণ ভেঙে বিক্রি করে।", en: "I love it means I like it, a state. I'm loving it breaks the rule to say I am enjoying it this very moment, and the break is what catches the eye, which is the advert's job. Some people say it, but on an exam paper know, like, love, want, need, believe, understand and have never take -ing. Do not learn grammar from adverts; adverts break grammar to sell." },
    },
    "tenses-build": {
      kind: "build",
      title: { bn: "ছয় ঘরে বাক্য সাজাও", en: "Build a sentence in each box" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর পর প্রতিটা বাক্যের ঘরের নাম বলো।", en: "The words are shuffled. Once built, name each sentence's box." },
      pattern: "subject + verb (six buttons) + rest",
      lines: [
        { target: "Nanu tells a story every night.", bn: "নানু রোজ রাতে একটা গল্প বলেন।" },
        { target: "The children are listening quietly now.", bn: "বাচ্চারা এখন চুপচাপ শুনছে।" },
        { target: "Bangladesh won the final two years ago.", bn: "বাংলাদেশ দুই বছর আগে ফাইনাল জিতেছিল।" },
        { target: "I was sleeping when the phone rang.", bn: "ফোন বাজল যখন, আমি ঘুমাচ্ছিলাম।" },
        { target: "We will visit Sylhet next winter.", bn: "আমরা আগামী শীতে সিলেট যাব।" },
        { target: "This time tomorrow I will be sitting in the exam hall.", bn: "কাল এই সময় আমি পরীক্ষার হলে বসে থাকব।" },
      ],
    },
    "tenses-spot": {
      kind: "spot",
      title: { bn: "রাফির ডায়েরি, কালের ভুল", en: "Rafi's diary: the tense mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে কালের ভুল, সেটা ছোঁও। সময়ের শব্দটা দেখো।", en: "Take the red pen. Tap every line with a tense mistake, and watch the time words." },
      source: { bn: "ডায়েরি: গতকাল", en: "Diary: yesterday" },
      lines: [
        { text: { bn: "Yesterday was the day of our school match.", en: "Yesterday was the day of our school match." } },
        { text: { bn: "I wake up at six and put on my kit.", en: "I wake up at six and put on my kit." }, flag: { bn: "yesterday-র গল্প, অতীত: woke up। put বদলায় না, তাই ওটা ঠিক।", en: "A story about yesterday, the past: woke up. Put does not change, so that one is fine." } },
        { text: { bn: "When I reached the field, the other team was already practising.", en: "When I reached the field, the other team was already practising." } },
        { text: { bn: "Our captain was giving a speech when the umpire arrives.", en: "Our captain was giving a speech when the umpire arrives." }, flag: { bn: "হঠাৎ কাজটাও অতীতে: arrived।", en: "The sudden action is in the past too: arrived." } },
        { text: { bn: "I bowled the first over and taked two wickets.", en: "I bowled the first over and taked two wickets." }, flag: { bn: "take রেবেল: took।", en: "Take is a rebel: took." } },
        { text: { bn: "Now I am knowing that practice matters.", en: "Now I am knowing that practice matters." }, flag: { bn: "know অবস্থার ক্রিয়া, -ing নয়: Now I know।", en: "Know is a state verb and takes no -ing: Now I know." } },
        { text: { bn: "Tomorrow we will play the final, and I am going to bowl first.", en: "Tomorrow we will play the final, and I am going to bowl first." } },
      ],
    },
    "tenses-hard": {
      kind: "gap",
      title: { bn: "কঠিন ঘরগুলো", en: "The hard boxes" },
      note: { bn: "when আর while, going to, অবস্থার ক্রিয়া, রেবেল: পরীক্ষার প্রিয় ফাঁদগুলো একসাথে।", en: "When and while, going to, state verbs, rebels: the exam's favourite traps in one place." },
      items: [
        { text: "While Nanu ___ dinner, the lights went out.", bn: "নানু যখন রাতের খাবার রাঁধছিলেন, কারেন্ট চলে গেল।", options: ["cooked", "was cooking", "is cooking"], right: 1, why: { bn: "while-এর পরে লম্বা কাজ, অতীতে: was cooking। went out হঠাৎ কাজ।", en: "After while comes the long action, in the past: was cooking. Went out is the sudden one." } },
        { text: "Rafi ___ his homework when I called him.", bn: "আমি যখন ফোন করলাম, রাফি হোমওয়ার্ক করছিল।", options: ["did", "was doing", "does"], right: 1, why: { bn: "ফোনটা হঠাৎ (called), হোমওয়ার্ক তখন চলছিল: was doing।", en: "The call was sudden (called); the homework was running at the time: was doing." } },
        { text: "She ___ the answer, but she will not tell us.", bn: "সে উত্তরটা জানে, কিন্তু আমাদের বলবে না।", options: ["knows", "is knowing", "knew"], right: 0, why: { bn: "know অবস্থার ক্রিয়া: knows, -ing কখনো নয়। বাক্যটা এখনের, তাই knew নয়।", en: "Know is a state verb: knows, never -ing. The sentence is about now, so not knew." } },
        { text: "Mitu ___ the letter and posted it yesterday.", bn: "মিতু কাল চিঠিটা লিখে পোস্ট করেছে।", options: ["writed", "wrote", "written"], right: 1, why: { bn: "yesterday, V2। write রেবেল: wrote। written হলো V3, have-এর পরে বসে।", en: "Yesterday, V2. Write is a rebel: wrote. Written is V3 and sits after have." } },
        { text: "We have tickets. We ___ the final on Sunday.", bn: "আমাদের টিকিট আছে। রবিবার আমরা ফাইনাল দেখছি।", options: ["watch", "are watching", "watched"], right: 1, why: { bn: "ঠিক করা ভবিষ্যৎ, টিকিট আর তারিখ সহ: are watching। going to-ও চলত।", en: "An arranged future with tickets and a date: are watching. Going to would pass too." } },
        { text: "The sun ___ in the east.", bn: "সূর্য পূর্ব দিকে ওঠে।", options: ["rises", "is rising", "rose"], right: 0, why: { bn: "চিরসত্য: present simple, rises।", en: "An eternal truth: present simple, rises." } },
        { text: "I ___ him at the market two days ago.", bn: "দুই দিন আগে আমি তাকে বাজারে দেখেছি।", options: ["have seen", "saw", "see"], right: 1, why: { bn: "ago মানেই past simple: saw। have seen-এর সাথে ago বসে না।", en: "Ago always means past simple: saw. Have seen does not take ago." } },
        { text: "Hurry up! The bus ___ in five minutes.", bn: "তাড়াতাড়ি! বাসটা পাঁচ মিনিটে ছাড়বে।", options: ["leaves", "left", "was leaving"], right: 0, why: { bn: "সূচির জিনিস: present simple, leaves, ভবিষ্যৎ হলেও।", en: "A timetable: present simple, leaves, even though it is the future." } },
      ],
    },
    "tenses-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Change the tense: Nanu tells a story. (past continuous)", en: "Change the tense: Nanu tells a story. (past continuous)" },
          options: [
            { text: { bn: "Nanu told a story.", en: "Nanu told a story." }, why: { bn: "এটা past simple। continuous মানে was + -ing।", en: "That is past simple. Continuous means was + -ing." } },
            { text: { bn: "Nanu was telling a story.", en: "Nanu was telling a story." }, right: true, why: { bn: "হ্যাঁ। was + telling। কর্তা একজন, তাই was।", en: "Yes. Was + telling. One subject, so was." } },
            { text: { bn: "Nanu is telling a story.", en: "Nanu is telling a story." }, why: { bn: "এটা present continuous। অতীতে is হয়ে যায় was।", en: "That is present continuous. In the past, is becomes was." } },
          ],
        },
        {
          ask: { bn: "___ you ___ the match last night? কোন জোড়া?", en: "___ you ___ the match last night? Which pair?" },
          options: [
            { text: { bn: "Did, saw", en: "Did, saw" }, why: { bn: "না। did এলে মূল ক্রিয়া খালি: Did you see। দুটো অতীত নয়।", en: "No. Once did is there the main verb is bare: Did you see. Not two pasts." } },
            { text: { bn: "Did, see", en: "Did, see" }, right: true, why: { bn: "হ্যাঁ। last night অতীত, প্রশ্নে did, তারপর খালি see।", en: "Yes. Last night is the past, did for the question, then bare see." } },
            { text: { bn: "Do, see", en: "Do, see" }, why: { bn: "না। last night, অতীত: did।", en: "No. Last night is the past: did." } },
          ],
        },
        {
          ask: { bn: "Water ___ at 100 degrees, but this water ___ yet. কোন জোড়া?", en: "Water ___ at 100 degrees, but this water ___ yet. Which pair?" },
          options: [
            { text: { bn: "boils, is not boiling", en: "boils, is not boiling" }, right: true, why: { bn: "হ্যাঁ। প্রথমটা চিরসত্য, simple। দ্বিতীয়টা এই মুহূর্তে, এই পানিটা: continuous।", en: "Yes. The first is an eternal truth, simple. The second is this water at this moment: continuous." } },
            { text: { bn: "is boiling, does not boil", en: "is boiling, does not boil" }, why: { bn: "উল্টো। সত্যি স্থির ছবি, এই মুহূর্তের জিনিস নড়া ছবি।", en: "Backwards. A truth is a still picture; this moment is a moving one." } },
            { text: { bn: "boiled, is not boiling", en: "boiled, is not boiling" }, why: { bn: "না। পানি সবসময়ই একশোতে ফোটে, অতীত নয়: boils।", en: "No. Water always boils at a hundred, not only in the past: boils." } },
          ],
        },
        {
          ask: { bn: "Rafi is always ___ his kit! এখানে always কী বোঝাচ্ছে?", en: "Rafi is always ___ his kit! What does always mean here?" },
          options: [
            { text: { bn: "losing; বিরক্তি, বারবার হয়", en: "losing; annoyance, it keeps happening" }, right: true, why: { bn: "হ্যাঁ। is always -ing মানে বারবার, আর বলার লোক বিরক্ত। অভ্যাস হলে simple হতো: Rafi always loses।", en: "Yes. Is always -ing means again and again, and the speaker is fed up. A plain habit would be simple: Rafi always loses." } },
            { text: { bn: "loses; সাধারণ অভ্যাস", en: "loses; a plain habit" }, why: { bn: "is থাকলে -ing লাগবে, আর is always -ing-এর মানে বিরক্তি।", en: "With is there, -ing is needed, and is always -ing carries annoyance." } },
            { text: { bn: "lost; একবার, অতীতে", en: "lost; once, in the past" }, why: { bn: "না। is বর্তমান, আর always বলছে একবার নয়।", en: "No. Is is present, and always says it was not once." } },
          ],
        },
      ],
    },
    "tenses-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "একটা কাজ নাও, যেমন eat, আর ছয়টা বোতাম টেপো: I eat, I am eating, I ate, I was eating, I will eat, I will be eating।", en: "Take one verb, say eat, and press all six buttons: I eat, I am eating, I ate, I was eating, I will eat, I will be eating." } },
        { text: { bn: "আজ সকাল থেকে যা করেছ, past simple-এ পাঁচ বাক্য: I woke up, I ate…", en: "What you did since morning, five sentences in the past simple: I woke up, I ate…" } },
        { text: { bn: "জানালার বাইরে তাকাও আর এখন যা চলছে বলো: A man is walking. Birds are flying.", en: "Look out of the window and say what is happening: A man is walking. Birds are flying." } },
        { text: { bn: "কাল কী করবে, তিনটা will আর দুটো going to।", en: "Tomorrow's plans: three with will and two with going to." } },
        { text: { bn: "দশটা রেবেল তিন রূপে জোরে, তিনবার: go went gone, see saw seen…", en: "Ten rebels in three forms, aloud, three times: go went gone, see saw seen…" } },
        { text: { bn: "একটা ছোট গল্প when দিয়ে, পাঁচ বাক্য: I was …ing when … । প্রতিটায় লম্বা কাজ আর হঠাৎ কাজ।", en: "A tiny story with when, five sentences: I was …ing when … . A long action and a sudden one in each." } },
      ],
    },
  },
};
