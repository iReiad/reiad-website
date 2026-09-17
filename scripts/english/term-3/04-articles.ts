/* ============================================================
   04-articles.ts: পর্ব ৪, a, an, the: তিনটা ছোট শব্দের বড় কাজ.

   One part of the grammar term, gathered into the rung by
   `basic.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>তানভীর ভাই একটা মজার কথা বলে: বাংলাভাষী যখন ইংরেজি বলে, তখন হয় সব <span lang="en">the</span>, নয় কোনো <span lang="en">the</span>-ই না। কারণ সহজ। বাংলায় এই শব্দগুলোর কোনো ভাই নেই। "আমি বই পড়ি" আর "আমি বইটা পড়ি": বাংলায় একটা "টা" দিয়ে যেটুকু বোঝাই, ইংরেজিতে সেটাই <span lang="en">a book</span> আর <span lang="en">the book</span>-এর মাঝের দূরত্ব। তিনটা ছোট শব্দ, আর তিনটা প্রশ্ন দিয়ে পুরোটা ধরা যায়। তারপর সেই লম্বা তালিকাগুলো, যেখানে <span lang="en">the</span> বসে আর যেখানে বসে না, যেগুলো পরীক্ষায় প্রতি বছর আসে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">a / an</span>: যেকোনো একটা, প্রথমবার বলছি, শ্রোতা জানে না কোনটা। <span lang="en">a book</span>: একটা বই, যেকোনো।</li>
<li><span lang="en">the</span>: নির্দিষ্ট, দুজনেই জানি কোনটা। <span lang="en">the book</span>: বইটা, ওই যে।</li>
<li><span lang="en">a</span> নাকি <span lang="en">an</span>: পরের শব্দের <em>আওয়াজ</em> দিয়ে ঠিক হয়, বানান দিয়ে নয়। <span lang="en">an hour, a university</span>।</li>
<li>কিছুই নয়: বহুবচন আর গোনা যায় না এমন জিনিস, সাধারণভাবে বললে। <span lang="en">I like mangoes. Water is life.</span></li>
<li><span lang="en">the</span> সবসময়: সবার সেরা (<span lang="en">the best</span>), ক্রম (<span lang="en">the first</span>), নদী আর সাগর (<span lang="en">the Padma</span>), একটাই জিনিস (<span lang="en">the sun</span>)।</li>
<li>কখনো নয়: <span lang="en">go to school, by bus, at night, have breakfast, play cricket</span>। এগুলো জোড়া, মুখস্থ।</li>
</ul>
</div>

${mount("articles-pattern")}

${mount("articles-flow")}

<h2>প্রথম প্রশ্ন: শ্রোতা কি জানে কোনটা?</h2>

<p>এটাই আসল প্রশ্ন। রাফি বাসায় এসে বলল, <span lang="en">I saw a snake today!</span> মা জানেন না কোন সাপ, রাফি প্রথমবার বলছে, তাই <span lang="en">a snake</span>। তারপর, <span lang="en">The snake was under the bench.</span> এখন মা জানেন কোন সাপের কথা হচ্ছে, তাই <span lang="en">the snake</span>। নিয়মটা এক বাক্যে: <strong>প্রথমবার <span lang="en">a</span>, তারপর থেকে <span lang="en">the</span>।</strong></p>

<p>দুনিয়ায় একটাই এমন জিনিসও <span lang="en">the</span>, কারণ সবাই জানে কোনটা: <span lang="en">the sun, the moon, the sky, the internet, the Padma</span>। আর যেটা আশেপাশে একটাই: <span lang="en">Close the door. Turn on the fan.</span> ঘরে একটাই দরজা, তাই <span lang="en">the</span>।</p>

<p>শ্রোতা আরও এক ভাবে জানতে পারে কোনটা: বাক্যেই বলে দিলে। <span lang="en">the boy who scored the century</span>, <span lang="en">the bat on the table</span>, <span lang="en">the book I gave you</span>। noun-এর পরে যে অংশটা তাকে চিনিয়ে দিচ্ছে, সেটাই <span lang="en">the</span> ডেকে আনে। পর্ব ১৯-এ এই চেনানো অংশগুলোর নাম <span lang="en">relative clause</span>।</p>

${mount("articles-reveal")}

${mount("articles-lines")}

<h2>দ্বিতীয় প্রশ্ন: a নাকি an</h2>

<p>নিয়মটা বানানের নয়, আওয়াজের। পরের শব্দ যদি স্বরধ্বনি দিয়ে শুরু হয় (a, e, i, o, u-এর আওয়াজ), তাহলে <span lang="en">an</span>, নইলে <span lang="en">a</span>। বেশিরভাগ সময় বানান আর আওয়াজ একই: <span lang="en">an apple, an egg, a ball</span>। কিন্তু চারটা ফাঁদ:</p>

<div class="table-scroll">
<table>
<thead><tr><th>শব্দ</th><th>বানান শুরু</th><th>আওয়াজ শুরু</th><th>তাই</th></tr></thead>
<tbody>
<tr><td><span lang="en">hour</span></td><td>h</td><td>আ (h চুপ)</td><td><span lang="en">an hour</span></td></tr>
<tr><td><span lang="en">honest</span></td><td>h</td><td>অ (h চুপ)</td><td><span lang="en">an honest man</span></td></tr>
<tr><td><span lang="en">university</span></td><td>u</td><td>ইউ (y-এর মতো)</td><td><span lang="en">a university</span></td></tr>
<tr><td><span lang="en">one</span></td><td>o</td><td>ওয়া (w-এর মতো)</td><td><span lang="en">a one-day match</span></td></tr>
<tr><td><span lang="en">MP</span></td><td>M</td><td>এম</td><td><span lang="en">an MP</span></td></tr>
</tbody>
</table>
</div>

<p>ফাঁদগুলো চার দলে। চুপ <span lang="en">h</span>: <span lang="en">an hour, an honest man, an heir, an honour</span>। কিন্তু যে <span lang="en">h</span> শোনা যায়, সে <span lang="en">a</span>: <span lang="en">a house, a hero, a hospital, a history book</span>। "ইউ" আওয়াজ: <span lang="en">a university, a uniform, a European, a useful tip, a unit</span>। কিন্তু <span lang="en">an umbrella, an uncle, an ugly duckling</span>, কারণ ওখানে "আ"। "ওয়া" আওয়াজ: <span lang="en">a one-taka coin, a one-way street</span>। আর অক্ষরের নামে: <span lang="en">an MP, an FM radio, an X-ray, an SMS</span>, কারণ এম, এফ, এক্স, এস সবাই স্বর দিয়ে শুরু; কিন্তু <span lang="en">a BCS exam, a DVD</span>।</p>

<h2>তৃতীয় প্রশ্ন: কিছুই লাগবে না তো?</h2>

<p>সাধারণভাবে কোনো জিনিসের কথা বললে, সব বই, সব পানি, সব ক্রিকেট, তখন কিছুই বসে না। <span lang="en">Books are expensive.</span> সব বই। <span lang="en">Cricket is popular in Bangladesh.</span> খেলাটা, সাধারণভাবে। <span lang="en">I love tea.</span> সব চা। কিন্তু নির্দিষ্ট করলেই <span lang="en">the</span> ফিরে আসে: <span lang="en">The tea you made was great.</span> তুমি যে চা-টা বানালে।</p>

<p>নামের আগেও সাধারণত কিছু নয়: <span lang="en">Rafi, Dhaka, Bangladesh, Eid, Monday</span>। ব্যতিক্রম কয়েকটা দেশ আর নদী, পাহাড়ের সারি: <span lang="en">the United States, the Padma, the Himalayas</span>।</p>

${mount("articles-gap")}

<h2>the-এর বড় তালিকা</h2>

<p>তিনটা প্রশ্নে বেশিরভাগ ঘর ভরে যায়। বাকিটা তালিকা, আর পরীক্ষার প্রশ্ন ঠিক এই তালিকা থেকে আসে। যেখানে <span lang="en">the</span> বসবেই:</p>

<div class="table-scroll">
<table>
<thead><tr><th>কোথায়</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td>সবার সেরা, <span lang="en">-est / most</span></td><td><span lang="en">the best bowler, the most expensive bat, the tallest boy</span></td></tr>
<tr><td>ক্রম: প্রথম, দ্বিতীয়, শেষ, একমাত্র, একই</td><td><span lang="en">the first over, the last ball, the only son, the same team</span></td></tr>
<tr><td>একটাই আছে এমন জিনিস</td><td><span lang="en">the sun, the moon, the earth, the sky, the sea, the world</span></td></tr>
<tr><td>নদী, সাগর, মহাসাগর, উপসাগর, মরুভূমি</td><td><span lang="en">the Padma, the Meghna, the Bay of Bengal, the Pacific, the Sahara</span></td></tr>
<tr><td>পাহাড়ের সারি, দ্বীপের দল</td><td><span lang="en">the Himalayas, the Alps, the Maldives, the Sundarbans</span></td></tr>
<tr><td>বহুবচন বা শব্দওয়ালা দেশের নাম</td><td><span lang="en">the United States, the United Kingdom, the Netherlands, the Philippines</span></td></tr>
<tr><td>বাদ্যযন্ত্র</td><td><span lang="en">play the guitar, the tabla, the piano</span></td></tr>
<tr><td>একটা গোটা পরিবার, একটা জাতি</td><td><span lang="en">the Rahmans, the Bangladeshis, the English</span></td></tr>
<tr><td>খবরের কাগজ, বিখ্যাত ভবন, জাহাজ</td><td><span lang="en">the Daily Star, the Taj Mahal, the Titanic</span></td></tr>
<tr><td><span lang="en">the</span> + adjective = সেই ধরনের মানুষেরা</td><td><span lang="en">the poor, the rich, the young, the blind</span></td></tr>
<tr><td>একটা গোটা জাতের হয়ে একটা</td><td><span lang="en">The tiger is a dangerous animal. The telephone was invented in 1876.</span></td></tr>
<tr><td>দিনের ভাগ, দিক, তারিখ</td><td><span lang="en">in the morning, in the east, on the 26th of March</span></td></tr>
</tbody>
</table>
</div>

<h2>যেখানে কিছুই বসে না</h2>

<p>আর উল্টো তালিকা, যেখানে <span lang="en">the</span> বসালেই ভুল। এগুলোই বাংলাভাষীর সবচেয়ে বেশি ভুলের জায়গা, কারণ বাংলায় "স্কুলে যাই" আর "স্কুলটায় যাই" দুটোই বলা যায়।</p>

<div class="table-scroll">
<table>
<thead><tr><th>কোথায়</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td>প্রতিষ্ঠান, তার কাজের জন্য</td><td><span lang="en">go to school, go to bed, go to hospital, go to work, be in class, be at home</span></td></tr>
<tr><td>খাবার, ভাষা, খেলা, বিষয়</td><td><span lang="en">have breakfast, speak Bangla, play cricket, study physics</span></td></tr>
<tr><td>যানবাহন, <span lang="en">by</span> দিয়ে</td><td><span lang="en">by bus, by car, by train, by air, on foot</span></td></tr>
<tr><td>শহর, বেশিরভাগ দেশ, মহাদেশ</td><td><span lang="en">Dhaka, Bangladesh, Asia, Europe</span></td></tr>
<tr><td>একটা পাহাড়, একটা হ্রদ, একটা দ্বীপ</td><td><span lang="en">Mount Everest, Lake Kaptai, Saint Martin's Island</span></td></tr>
<tr><td>রাস্তা, পার্ক, স্টেশন, বিমানবন্দর</td><td><span lang="en">Mirpur Road, Ramna Park, Kamalapur Station</span></td></tr>
<tr><td>দিন, মাস, উৎসব</td><td><span lang="en">on Friday, in June, at Eid, at Christmas</span></td></tr>
<tr><td>সাধারণভাবে বহুবচন আর ভাব</td><td><span lang="en">Children love stories. Honesty is rare. Life is short.</span></td></tr>
</tbody>
</table>
</div>

<p>দুটো তালিকায় একই শব্দ দুই দলে খেলে, আর সেটাই আসল খেলা। <span lang="en">go to school</span>: পড়তে যাই, তাই কিছু নয়। <span lang="en">go to the school</span>: ভবনটায় যাই, হয়তো একটা মিটিংয়ে, তাই <span lang="en">the</span>। <span lang="en">in hospital</span>: রোগী হিসেবে ভর্তি। <span lang="en">in the hospital</span>: ভবনটার ভিতরে, হয়তো কাউকে দেখতে। প্রতিষ্ঠানটার <em>কাজে</em> গেলে কিছু নয়, <em>জায়গাটায়</em> গেলে <span lang="en">the</span>।</p>

${mount("articles-sort")}

${mount("articles-pairs")}

<h2>a-এর আরও তিনটা কাজ</h2>

<p><span lang="en">a</span> শুধু "একটা যেকোনো" নয়। <strong>পেশা:</strong> <span lang="en">Mitu wants to be a doctor. Baba is an engineer.</span> বাংলায় "বাবা ইঞ্জিনিয়ার", ইংরেজিতে <span lang="en">an</span> লাগবেই। <strong>প্রতি:</strong> <span lang="en">twice a week, sixty taka a kilo, once a year</span>। বাংলার "সপ্তাহে দুবার" ইংরেজিতে <span lang="en">a week</span>। <strong>চমক:</strong> <span lang="en">What a catch! What an idea! Such a beautiful day!</span> আর <strong>একটা জাতের হয়ে একটা:</strong> <span lang="en">A dog is a loyal animal.</span> যেকোনো একটা কুকুর, মানে সব কুকুর। এই শেষ কাজটা <span lang="en">the</span>-ও করে: <span lang="en">The dog is a loyal animal.</span> দুটোই ঠিক।</p>

<div class="ex"><b>সিনেমার নাম দিয়ে মনে রাখো:</b> <span lang="en">The Lion King</span>: একটাই রাজা, সবাই জানে কে। <span lang="en">A Quiet Place</span>: যেকোনো একটা নিরিবিলি জায়গা। <span lang="en">Finding Nemo</span>: নামের আগে কিছু নয়। তিনটা সিনেমা, তিনটা নিয়ম।</div>

${mount("articles-build")}

${mount("articles-gap2")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>SSC আর HSC-তে <span lang="en">article</span> একটা আলাদা প্রশ্ন: একটা অনুচ্ছেদ, আট থেকে দশটা খালি ঘর, প্রতিটায় <span lang="en">a, an, the</span> বা একটা ক্রস। কৌশল: ঘরগুলো এক এক করে নয়, প্রথমে পুরো অনুচ্ছেদটা পড়ো, কারণ দ্বিতীয়বার আসা জিনিসের <span lang="en">the</span> চিনতে হলে প্রথমবারটা মনে রাখতে হয়।</p>

<ol class="step-list">
<li><strong>পরের শব্দটা দেখো।</strong> বহুবচন বা গোনা যায় না, আর সাধারণভাবে বলা? ক্রস। <span lang="en">-est, first, only, same</span>? <span lang="en">the</span>।</li>
<li><strong>আগে বলা হয়েছে?</strong> অনুচ্ছেদে এই জিনিসটা আগে এসেছে, বা একটাই আছে (<span lang="en">sun, sky, world</span>)? <span lang="en">the</span>।</li>
<li><strong>প্রথমবার আর একটা?</strong> তাহলে <span lang="en">a</span>, আর পরের আওয়াজ স্বর হলে <span lang="en">an</span>। আওয়াজ, বানান নয়।</li>
<li><strong>জোড়া চেনো।</strong> <span lang="en">go to school, by bus, at night, in the morning, play the guitar</span>: এগুলো নিয়ম নয়, মুখস্থ জোড়া। জোড়া দেখলে থামো, ভাবো না, বসাও।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Rafi is (1) ___ honest boy. He goes to (2) ___ school by (3) ___ bus. One day he found (4) ___ purse on (5) ___ road. (6) ___ purse had (7) ___ lot of money. He gave it to (8) ___ police. It was (9) ___ best thing he had ever done.</span> উত্তর: (১) <span lang="en">an</span>, চুপ h; (২) ক্রস, পড়তে যায়; (৩) ক্রস, <span lang="en">by bus</span>; (৪) <span lang="en">a</span>, প্রথমবার; (৫) <span lang="en">the</span>, রাস্তা একটাই, সবাই জানে; (৬) <span lang="en">The</span>, দ্বিতীয়বার; (৭) <span lang="en">a</span>, <span lang="en">a lot of</span>; (৮) <span lang="en">the</span>, পুলিশ একটা প্রতিষ্ঠান, সবাই জানে কোনটা; (৯) <span lang="en">the</span>, <span lang="en">best</span>। নয়টা ঘর, চার ধাপ।</div>

${mount("articles-spot")}

${mount("articles-exam")}

${mount("articles-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Article</span>-এর শূন্যস্থানে তিনটা প্রশ্ন ক্রমে করো: (১) পরের শব্দটা কি বহুবচন বা গোনা যায় না, আর সাধারণভাবে বলা? তাহলে কিছু নয়, একটা ক্রস দাও। (২) দুজনেই কি জানি কোনটা, বা আগে একবার বলা হয়েছে? তাহলে <span lang="en">the</span>। (৩) নইলে <span lang="en">a</span>, আর পরের আওয়াজ স্বর হলে <span lang="en">an</span>। এই ক্রমে গেলে নব্বই ভাগ ঠিক।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>যেসব শব্দে <span lang="en">the</span> লাগে না, বাংলাভাষীরা ঠিক সেগুলোতেই লাগায়: <span lang="en">I go to school</span> (প্রতিষ্ঠান হিসেবে, <span lang="en">the school</span> নয়), <span lang="en">at home, in bed, at night, by bus, play cricket, have breakfast</span>। এগুলো মুখস্থ জোড়া, নিয়ম নয়। উল্টো দিকে <span lang="en">play the guitar</span>: বাদ্যযন্ত্রে <span lang="en">the</span>, খেলায় নয়।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p><span lang="en">a</span> বসে শুধু গোনা যায় এমন একবচনের আগে। <span lang="en">a good news</span> ভুল, <span lang="en">good news</span> বা <span lang="en">a piece of good news</span>। <span lang="en">an advice</span> ভুল, <span lang="en">some advice</span>। আর <span lang="en">a</span> আর <span lang="en">one</span> এক নয়: <span lang="en">I have a brother</span> মানে আমার ভাই আছে; <span lang="en">I have one brother</span> মানে ঠিক একজন, দুজন নয়। সংখ্যাটা জরুরি হলে <span lang="en">one</span>, নইলে <span lang="en">a</span>।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>তিনটা প্রশ্ন ক্রমে বলতে পারি, আর প্রতিটার একটা উদাহরণ?</li>
<li><span lang="en">an hour, a university, an MP, a one-day match</span>: চারটার কারণ বলতে পারি?</li>
<li><span lang="en">the</span>-এর তালিকা থেকে দশটা জায়গা না দেখে বলতে পারি?</li>
<li><span lang="en">go to school</span> আর <span lang="en">go to the school</span>-এর পার্থক্য?</li>
<li><span lang="en">the Padma</span> কিন্তু <span lang="en">Mount Everest</span>: কেন?</li>
</ul>
</div>

${mount("articles-drill")}
`,
  blocks: {
    "articles-pattern": {
      kind: "pattern",
      title: { bn: "প্রথমবার a, তারপর the", en: "First time a, then the" },
      shape: "I saw a ____.  The ____ was ____.",
      why: { bn: "যে জিনিসটা প্রথমবার বলছ, শ্রোতা জানে না কোনটা, তাই a। একবার বলে ফেলার পর দুজনেই জানো, তাই the। প্রতিটা গল্প এভাবেই শুরু হয়।", en: "The first time you mention a thing the listener does not know which one, so a. Once said, you both know, so the. Every story begins this way." },
      examples: [
        { target: "I saw a dog. The dog was hungry.", bn: "একটা কুকুর দেখলাম। কুকুরটা ক্ষুধার্ত ছিল।" },
        { target: "Nanu told me a story. The story was about a king.", bn: "নানু একটা গল্প বললেন। গল্পটা এক রাজাকে নিয়ে।" },
        { target: "Rafi bought an egg. The egg was rotten!", bn: "রাফি একটা ডিম কিনল। ডিমটা পচা ছিল!" },
        { target: "There is a ball on the roof. Can you get the ball?", bn: "ছাদে একটা বল আছে। বলটা আনতে পারবে?" },
      ],
      tip: { bn: "the মানে 'ওই যে, তুমি জানো কোনটা'। মনে মনে 'ওই যে' বসিয়ে দেখো; মানে হলে the।", en: "The means that one, you know which. Try saying that one in your head; if it makes sense, the." },
    },
    "articles-flow": {
      kind: "figure",
      shape: "flow",
      title: { bn: "তিন প্রশ্নের পথ", en: "The three-question path" },
      parts: [
        { text: { bn: "১. বহুবচন বা গোনা যায় না, আর সাধারণভাবে?", en: "1. Plural or uncountable, and in general?" }, note: { bn: "হ্যাঁ: কিছু নয়। Books are expensive.", en: "Yes: nothing. Books are expensive." }, tone: "warn" },
        { text: { bn: "২. দুজনেই জানি কোনটা?", en: "2. Do we both know which one?" }, note: { bn: "হ্যাঁ: the। Close the door.", en: "Yes: the. Close the door." }, tone: "lead" },
        { text: { bn: "৩. নইলে a, স্বরের আওয়াজে an", en: "3. Otherwise a, or an before a vowel sound" }, note: { bn: "I saw a snake. We waited an hour.", en: "I saw a snake. We waited an hour." }, tone: "good" },
      ],
      caption: { bn: "এই ক্রমেই প্রশ্ন করো। প্রথম প্রশ্নে হ্যাঁ হলে বাকি দুটো লাগে না।", en: "Ask in this order. A yes to the first question ends it." },
    },
    "articles-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: a না the, মানে কী বদলায়?", en: "Guess first: a or the, and what changes" },
      ask: { bn: "রাফি বলল, I met the coach today. আর মিতু বলল, I met a coach today. দুজনের কথায় পার্থক্য কী?", en: "Rafi said, I met the coach today. Mitu said, I met a coach today. What is the difference?" },
      choices: [
        { bn: "কোনো পার্থক্য নেই", en: "No difference" },
        { bn: "রাফির কোচকে শ্রোতা চেনে, মিতুরটাকে চেনে না", en: "The listener knows Rafi's coach, not Mitu's" },
        { bn: "মিতু একজনের বেশি কোচের সাথে দেখা করেছে", en: "Mitu met more than one coach" },
      ],
      answer: { bn: "রাফির কোচকে শ্রোতা চেনে; মিতুরটা যেকোনো একজন কোচ।", en: "The listener knows Rafi's coach; Mitu's is some coach or other." },
      why: { bn: "the coach মানে আমাদের কোচ, ওই যে, তুমি জানো কে। a coach মানে কোনো একজন কোচ, হয়তো অন্য স্কুলের, শ্রোতা তাকে চেনে না। একই বাক্য, একটা শব্দ বদলে গল্পটাই বদলে গেল। এটাই article-এর পুরো কাজ: শ্রোতাকে বলা, তুমি জানো কোনটা, না জানো না।", en: "The coach means our coach, that one, you know who. A coach means some coach, maybe from another school, one the listener does not know. One word changed and the story changed. That is the whole job of an article: telling the listener whether they know which one." },
    },
    "articles-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: একটাই, তাই the", en: "Listen, say: only one, so the" },
      lines: [
        { target: "The sun rises in the east.", bn: "সূর্য পূর্ব দিকে ওঠে।" },
        { target: "Please close the window.", bn: "জানালাটা বন্ধ করো তো।" },
        { target: "The captain won the toss.", bn: "অধিনায়ক টস জিতলেন।" },
        { target: "Pass me the salt, please.", bn: "লবণটা দাও তো।" },
        { target: "The internet is slow tonight.", bn: "আজ রাতে ইন্টারনেট ধীর।" },
        { target: "The Padma is the widest river in Bangladesh.", bn: "পদ্মা বাংলাদেশের সবচেয়ে চওড়া নদী।" },
        { target: "Mitu plays the tabla and Rafi plays cricket.", bn: "মিতু তবলা বাজায় আর রাফি ক্রিকেট খেলে।" },
      ],
    },
    "articles-gap": {
      kind: "gap",
      title: { bn: "a, an, the, নাকি কিছুই না", en: "a, an, the, or nothing" },
      note: { bn: "তিনটা প্রশ্ন ক্রমে করো, তারপর ছোঁও। 'কিছু না' মানে খালি।", en: "Ask the three questions in order, then tap. Nothing means leave it empty." },
      items: [
        { text: "Rafi has ___ new bat. It is red.", bn: "রাফির একটা নতুন ব্যাট আছে। ওটা লাল।", options: ["a", "an", "the"], right: 0, why: { bn: "প্রথমবার বলা হচ্ছে, শ্রোতা জানে না কোন ব্যাট। new শুরু হয় n দিয়ে, তাই a।", en: "First mention, the listener does not know which bat. New starts with an n sound, so a." } },
        { text: "We waited for ___ hour.", bn: "আমরা এক ঘণ্টা অপেক্ষা করলাম।", options: ["a", "an", "the"], right: 1, why: { bn: "hour-এর h চুপ, আওয়াজ শুরু 'আ' দিয়ে, তাই an। বানান নয়, আওয়াজ।", en: "The h in hour is silent; it starts with a vowel sound, so an. Sound, not spelling." } },
        { text: "Mitu goes to ___ university in Dhaka.", bn: "মিতু ঢাকার একটা বিশ্ববিদ্যালয়ে পড়ে।", options: ["a", "an", "the"], right: 0, why: { bn: "university শুরু হয় 'ইউ' আওয়াজে, y-এর মতো, স্বর নয়। তাই a।", en: "University starts with a y sound, not a vowel sound, so a." } },
        { text: "___ moon is very bright tonight.", bn: "আজ রাতে চাঁদটা খুব উজ্জ্বল।", options: ["A", "The", "(nothing)"], right: 1, why: { bn: "চাঁদ একটাই, সবাই জানে কোনটা: the moon।", en: "There is one moon and everybody knows which: the moon." } },
        { text: "I love ___ mangoes.", bn: "আমি আম ভালোবাসি।", options: ["a", "the", "(nothing)"], right: 2, why: { bn: "সব আম, সাধারণভাবে, বহুবচন। কিছুই বসে না।", en: "All mangoes, in general, plural. Nothing goes there." } },
        { text: "Mustafiz is ___ best bowler in the team.", bn: "মুস্তাফিজ দলের সেরা বোলার।", options: ["a", "the", "(nothing)"], right: 1, why: { bn: "best, সেরা একজনই হয়, তাই the। -est বা most দেখলেই the।", en: "Best: there can be only one, so the. See -est or most and the follows." } },
      ],
    },
    "articles-sort": {
      kind: "bins",
      title: { bn: "the, a, নাকি খালি", en: "The, a, or nothing" },
      note: { bn: "প্রতিটা টুকরোকে ঠিক ঘরে ফেলো। জোড়া হলে জোড়া মনে করো, নিয়ম হলে নিয়ম।", en: "Sort each phrase. If it is a fixed pair, recall the pair; if it is a rule, apply the rule." },
      bins: [
        { id: "the", label: { bn: "the", en: "the" } },
        { id: "a", label: { bn: "a / an", en: "a / an" } },
        { id: "none", label: { bn: "কিছু নয়", en: "nothing" } },
      ],
      items: [
        { text: { bn: "___ Bay of Bengal", en: "___ Bay of Bengal" }, bin: "the", why: { bn: "উপসাগর: the Bay of Bengal।", en: "A bay: the Bay of Bengal." } },
        { text: { bn: "go to ___ bed", en: "go to ___ bed" }, bin: "none", why: { bn: "ঘুমাতে যাওয়া, জোড়া: go to bed।", en: "Going to sleep, a fixed pair: go to bed." } },
        { text: { bn: "___ Mount Everest", en: "___ Mount Everest" }, bin: "none", why: { bn: "একটা পাহাড়ের নামে কিছু নয়। পাহাড়ের সারিতে the: the Himalayas।", en: "A single mountain takes nothing. A range takes the: the Himalayas." } },
        { text: { bn: "twice ___ week", en: "twice ___ week" }, bin: "a", why: { bn: "প্রতি: twice a week।", en: "Per: twice a week." } },
        { text: { bn: "play ___ guitar", en: "play ___ guitar" }, bin: "the", why: { bn: "বাদ্যযন্ত্র: play the guitar।", en: "An instrument: play the guitar." } },
        { text: { bn: "play ___ football", en: "play ___ football" }, bin: "none", why: { bn: "খেলা: play football।", en: "A sport: play football." } },
        { text: { bn: "___ honest answer", en: "___ honest answer" }, bin: "a", why: { bn: "চুপ h, স্বরের আওয়াজ: an honest answer।", en: "A silent h and a vowel sound: an honest answer." } },
        { text: { bn: "___ United States", en: "___ United States" }, bin: "the", why: { bn: "বহুবচন নামের দেশ: the United States।", en: "A country with a plural name: the United States." } },
        { text: { bn: "have ___ breakfast", en: "have ___ breakfast" }, bin: "none", why: { bn: "খাবার: have breakfast।", en: "A meal: have breakfast." } },
        { text: { bn: "___ first over of the match", en: "___ first over of the match" }, bin: "the", why: { bn: "ক্রম: the first।", en: "An ordinal: the first." } },
        { text: { bn: "Baba is ___ engineer", en: "Baba is ___ engineer" }, bin: "a", why: { bn: "পেশা, আর স্বরের আওয়াজ: an engineer।", en: "A job, and a vowel sound: an engineer." } },
        { text: { bn: "help ___ poor", en: "help ___ poor" }, bin: "the", why: { bn: "the + adjective = সেই মানুষেরা: the poor।", en: "The + adjective = those people: the poor." } },
      ],
    },
    "articles-pairs": {
      kind: "match",
      title: { bn: "কেন এখানে the, কেন ওখানে নয়", en: "Why the here and not there" },
      note: { bn: "বাঁ দিকের টুকরোটা ডান দিকের কারণের সাথে মেলাও।", en: "Match each phrase on the left with its reason on the right." },
      pairs: [
        { left: { bn: "the Sundarbans", en: "the Sundarbans" }, right: { bn: "অনেক দ্বীপ বা পাহাড়ের একটা নাম", en: "one name for many islands or hills" } },
        { left: { bn: "in the morning", en: "in the morning" }, right: { bn: "দিনের ভাগ", en: "a part of the day" } },
        { left: { bn: "at night", en: "at night" }, right: { bn: "মুখস্থ জোড়া, নিয়ম নয়", en: "a fixed pair, not a rule" } },
        { left: { bn: "the only child", en: "the only child" }, right: { bn: "only, same, first: একটাই হতে পারে", en: "only, same, first: there can be just one" } },
        { left: { bn: "in hospital", en: "in hospital" }, right: { bn: "প্রতিষ্ঠানের কাজে, রোগী হিসেবে", en: "for the institution's purpose, as a patient" } },
        { left: { bn: "the Daily Star", en: "the Daily Star" }, right: { bn: "খবরের কাগজ", en: "a newspaper" } },
      ],
    },
    "articles-build": {
      kind: "build",
      title: { bn: "একটা গল্প, a থেকে the", en: "One story, from a to the" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর পর দেখো: a কোথায়, the কোথায়, আর কোথায় কিছু নেই।", en: "The words are shuffled. Once built, look at where a is, where the is, and where nothing is." },
      pattern: "a + first mention  ·  the + second mention  ·  nothing + general",
      lines: [
        { target: "Rafi found a purse on the road.", bn: "রাফি রাস্তায় একটা মানিব্যাগ পেল।" },
        { target: "The purse had a lot of money in it.", bn: "মানিব্যাগটায় অনেক টাকা ছিল।" },
        { target: "He goes to school by bus every day.", bn: "সে রোজ বাসে স্কুলে যায়।" },
        { target: "Honesty is the best policy.", bn: "সততাই সেরা নীতি।" },
        { target: "An honest boy gave the purse to the police.", bn: "একটা সৎ ছেলে মানিব্যাগটা পুলিশকে দিল।" },
        { target: "Nanu plays the harmonium twice a week.", bn: "নানু সপ্তাহে দুবার হারমোনিয়াম বাজান।" },
      ],
    },
    "articles-gap2": {
      kind: "gap",
      title: { bn: "তালিকা থেকে", en: "From the lists" },
      note: { bn: "এবার কঠিনগুলো: নদী, পাহাড়, জোড়া, পেশা, প্রতি।", en: "The hard ones now: rivers, mountains, fixed pairs, jobs, per." },
      items: [
        { text: "We crossed ___ Padma by launch.", bn: "আমরা লঞ্চে পদ্মা পার হলাম।", options: ["a", "the", "(nothing)"], right: 1, why: { bn: "নদীর নামে the: the Padma।", en: "A river's name takes the: the Padma." } },
        { text: "Tenzing climbed ___ Mount Everest in 1953.", bn: "তেনজিং ১৯৫৩ সালে এভারেস্টে উঠেছিলেন।", options: ["a", "the", "(nothing)"], right: 2, why: { bn: "একটা পাহাড়ের নামে কিছু নয়। the Himalayas, কিন্তু Mount Everest।", en: "A single mountain takes nothing. The Himalayas, but Mount Everest." } },
        { text: "Nanu usually goes to bed ___ night.", bn: "নানু সাধারণত রাতে ঘুমাতে যান।", options: ["at", "at the", "in the"], right: 0, why: { bn: "at night, জোড়া; আর go to bed-এও কিছু নয়।", en: "At night, a fixed pair; and go to bed takes nothing either." } },
        { text: "Mitu wants to be ___ doctor.", bn: "মিতু ডাক্তার হতে চায়।", options: ["a", "the", "(nothing)"], right: 0, why: { bn: "পেশার আগে a: a doctor। বাংলায় নেই, ইংরেজিতে লাগবেই।", en: "A job takes a: a doctor. Bangla drops it; English cannot." } },
        { text: "Mangoes cost eighty taka ___ kilo now.", bn: "আম এখন কেজিতে আশি টাকা।", options: ["a", "the", "per the"], right: 0, why: { bn: "প্রতি কেজি: a kilo। twice a week-এর মতো।", en: "Per kilo: a kilo. Like twice a week." } },
        { text: "The rich should help ___ poor.", bn: "ধনীদের উচিত গরিবদের সাহায্য করা।", options: ["the", "a", "(nothing)"], right: 0, why: { bn: "the + adjective মানে সেই ধরনের মানুষেরা: the rich, the poor।", en: "The + adjective means those people: the rich, the poor." } },
        { text: "Rafi is in ___ hospital; he broke his arm.", bn: "রাফি হাসপাতালে ভর্তি; তার হাত ভেঙেছে।", options: ["a", "the", "(nothing)"], right: 2, why: { bn: "রোগী হিসেবে ভর্তি, প্রতিষ্ঠানের কাজে: in hospital। দেখতে গেলে in the hospital।", en: "Admitted as a patient, for the institution's purpose: in hospital. Visiting would be in the hospital." } },
        { text: "It was ___ one-day match, and we won.", bn: "এটা একটা একদিনের ম্যাচ ছিল, আর আমরা জিতলাম।", options: ["a", "an", "the"], right: 0, why: { bn: "one শুরু হয় 'ওয়া' আওয়াজে, w-এর মতো: a one-day match।", en: "One starts with a w sound: a one-day match." } },
      ],
    },
    "articles-spot": {
      kind: "spot",
      title: { bn: "রাফির অনুচ্ছেদ, article-এর ভুল", en: "Rafi's paragraph: the article mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে a, an, the-র ভুল, সেটা ছোঁও। বাড়তি the-ও ভুল।", en: "Take the red pen. Tap every line with an article mistake, and an extra the counts." },
      source: { bn: "অনুচ্ছেদ: আমার রোজকার দিন", en: "Paragraph: my daily routine" },
      lines: [
        { text: { bn: "I get up early in the morning and have a glass of milk.", en: "I get up early in the morning and have a glass of milk." } },
        { text: { bn: "Then I go to the school by the bus.", en: "Then I go to the school by the bus." }, flag: { bn: "পড়তে যাওয়া আর by bus: দুটোতেই কিছু নয়। go to school by bus।", en: "Going to study and by bus: nothing in either. Go to school by bus." } },
        { text: { bn: "My school is the best school in our area.", en: "My school is the best school in our area." } },
        { text: { bn: "After school I play the cricket with my friends.", en: "After school I play the cricket with my friends." }, flag: { bn: "খেলায় কিছু নয়: play cricket। বাদ্যযন্ত্রে the।", en: "A sport takes nothing: play cricket. An instrument takes the." } },
        { text: { bn: "In the evening I read a book, and Nanu tells an story.", en: "In the evening I read a book, and Nanu tells an story." }, flag: { bn: "story শুরু s দিয়ে, ব্যঞ্জন: a story।", en: "Story starts with a consonant sound: a story." } },
        { text: { bn: "Nanu says that honesty is a best policy.", en: "Nanu says that honesty is a best policy." }, flag: { bn: "best, সবার সেরা: the best policy।", en: "Best, the top of all: the best policy." } },
        { text: { bn: "I go to bed at ten o'clock.", en: "I go to bed at ten o'clock." } },
      ],
    },
    "articles-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "He is ___ MBBS doctor and ___ honest man. কোন জোড়া?", en: "He is ___ MBBS doctor and ___ honest man. Which pair?" },
          options: [
            { text: { bn: "a, a", en: "a, a" }, why: { bn: "না। M-এর নাম 'এম', স্বরের আওয়াজ; honest-এর h চুপ। দুটোতেই an।", en: "No. The letter M is said em, a vowel sound; the h in honest is silent. Both take an." } },
            { text: { bn: "an, an", en: "an, an" }, right: true, why: { bn: "হ্যাঁ। an MBBS doctor (এম দিয়ে শুরু), an honest man (h চুপ)। বানান নয়, আওয়াজ।", en: "Yes. An MBBS doctor (said em), an honest man (silent h). Sound, not spelling." } },
            { text: { bn: "the, an", en: "the, an" }, why: { bn: "না। পেশা প্রথমবার বলা হচ্ছে, যেকোনো একজন ডাক্তার: an।", en: "No. A job on first mention, one doctor among many: an." } },
          ],
        },
        {
          ask: { bn: "___ Himalayas are ___ highest mountains in ___ world. কোনটা?", en: "___ Himalayas are ___ highest mountains in ___ world. Which?" },
          options: [
            { text: { bn: "The, the, the", en: "The, the, the" }, right: true, why: { bn: "হ্যাঁ। পাহাড়ের সারি the; highest সবার সেরা the; world একটাই the। তিনটাই।", en: "Yes. A range takes the; highest is a superlative, the; world is one of a kind, the. All three." } },
            { text: { bn: "(nothing), the, the", en: "(nothing), the, the" }, why: { bn: "না। একটা পাহাড়ে কিছু নয় (Mount Everest), কিন্তু সারিতে the: the Himalayas।", en: "No. A single mountain takes nothing (Mount Everest), but a range takes the: the Himalayas." } },
            { text: { bn: "The, (nothing), the", en: "The, (nothing), the" }, why: { bn: "না। highest, -est: সবার সেরা, তাই the highest।", en: "No. Highest, -est: a superlative, so the highest." } },
          ],
        },
        {
          ask: { bn: "কোন বাক্যটা ঠিক?", en: "Which sentence is right?" },
          options: [
            { text: { bn: "The Rafi is a honest boy.", en: "The Rafi is a honest boy." }, why: { bn: "না। মানুষের নামে কিছু নয়, আর honest-এ an।", en: "No. A person's name takes nothing, and honest takes an." } },
            { text: { bn: "Rafi is an honest boy.", en: "Rafi is an honest boy." }, right: true, why: { bn: "হ্যাঁ। নামে কিছু নয়, honest-এর h চুপ, তাই an।", en: "Yes. Nothing before the name, and the silent h of honest takes an." } },
            { text: { bn: "Rafi is the honest boy.", en: "Rafi is the honest boy." }, why: { bn: "না, এখানে নয়। the honest boy মানে ওই নির্দিষ্ট ছেলেটা, যার কথা আগে হয়েছে। প্রথমবার বললে an।", en: "Not here. The honest boy means that particular boy already mentioned. On first mention, an." } },
          ],
        },
        {
          ask: { bn: "She gave me ___ useful advice. কোনটা?", en: "She gave me ___ useful advice. Which?" },
          options: [
            { text: { bn: "a", en: "a" }, why: { bn: "না। advice গোনা যায় না, তার আগে a বসে না, useful থাকলেও।", en: "No. Advice is uncountable and takes no a, even with useful in front." } },
            { text: { bn: "an", en: "an" }, why: { bn: "না। useful শুরু 'ইউ' আওয়াজে, তাই an-ও হয় না, আর advice-এর আগে a-ই বসে না।", en: "No. Useful starts with a y sound, so an is wrong too, and advice takes no a at all." } },
            { text: { bn: "some", en: "some" }, right: true, why: { bn: "হ্যাঁ। গোনা যায় না: some useful advice, বা a useful piece of advice।", en: "Yes. Uncountable: some useful advice, or a useful piece of advice." } },
          ],
        },
      ],
    },
    "articles-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "কোনটা ঠিক?", en: "Which is right?" },
          options: [
            { text: { bn: "I go to the school by the bus.", en: "I go to the school by the bus." }, why: { bn: "না। school প্রতিষ্ঠান হিসেবে, আর by bus একটা বাঁধা জোড়া: দুটোতেই the নয়।", en: "No. School as an institution and by bus are fixed pairs: no the in either." } },
            { text: { bn: "I go to school by bus.", en: "I go to school by bus." }, right: true, why: { bn: "হ্যাঁ। school-এ পড়তে যাওয়া, আর by bus, by car, by train: কিছু বসে না।", en: "Yes. Going to school to study, and by bus, by car, by train: nothing goes there." } },
            { text: { bn: "I go to a school by a bus.", en: "I go to a school by a bus." }, why: { bn: "না। কোনো একটা স্কুলে যেকোনো একটা বাসে? মানে বদলে যায়। রোজকার যাওয়া বোঝাতে কিছুই না।", en: "No. To some school on some bus? The meaning changes. Daily going takes nothing." } },
          ],
        },
        {
          ask: { bn: "Water is important. এই বাক্যে Water-এর আগে কিছু নেই কেন?", en: "Water is important. Why is there nothing before Water?" },
          options: [
            { text: { bn: "কারণ বাক্যের শুরুতে article বসে না", en: "Because an article cannot start a sentence" }, why: { bn: "না। The match is over: বাক্যের শুরুতে the দিব্যি বসে।", en: "No. The match is over: the starts a sentence happily." } },
            { text: { bn: "কারণ সব পানির কথা, সাধারণভাবে, আর পানি গোনা যায় না", en: "Because it means all water, in general, and water is uncountable" }, right: true, why: { bn: "হ্যাঁ। সাধারণভাবে গোনা যায় না এমন জিনিস: কিছুই বসে না। নির্দিষ্ট হলে the: The water in this glass is cold.", en: "Yes. An uncountable thing in general takes nothing. Made specific it takes the: The water in this glass is cold." } },
            { text: { bn: "ভুল আছে, a water হবে", en: "It is wrong; it should be a water" }, why: { bn: "না। a water হয় না, পানি গোনা যায় না। a glass of water হয়।", en: "No. A water is impossible; water is uncountable. A glass of water works." } },
          ],
        },
        {
          ask: { bn: "I have ___ brother. বলতে চাই, ঠিক একজন, দুজন নয়। কোনটা?", en: "I have ___ brother. You mean exactly one, not two. Which?" },
          options: [
            { text: { bn: "a", en: "a" }, why: { bn: "চলে, কিন্তু a brother শুধু বলে ভাই আছে, কয়জন বলে না।", en: "It works, but a brother only says you have one, not how many." } },
            { text: { bn: "one", en: "one" }, right: true, why: { bn: "হ্যাঁ। সংখ্যাটা জরুরি হলে one: I have one brother, not two।", en: "Yes. When the number matters, one: I have one brother, not two." } },
            { text: { bn: "the", en: "the" }, why: { bn: "না। the brother মানে ওই নির্দিষ্ট ভাই, শ্রোতা যাকে চেনে। এখানে সংখ্যার কথা।", en: "No. The brother means that particular brother the listener knows. This is about the number." } },
          ],
        },
      ],
    },
    "articles-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "একটা ছোট গল্প বলো: I saw a… The… was… তিনটা আলাদা জিনিস দিয়ে।", en: "Tell a tiny story: I saw a… The… was… with three different things." } },
        { text: { bn: "ঘরের একটাই আছে এমন পাঁচটা জিনিস the দিয়ে বলো: the door, the fan, the ceiling…", en: "Name five things there is only one of in the room, with the: the door, the fan, the ceiling…" } },
        { text: { bn: "an দিয়ে পাঁচটা: an egg, an apple, an hour, an umbrella, an honest friend।", en: "Five with an: an egg, an apple, an hour, an umbrella, an honest friend." } },
        { text: { bn: "তোমার প্রিয় পাঁচটা জিনিস সাধারণভাবে, কিছু ছাড়া: I love mangoes, cricket, tea…", en: "Five favourite things in general, with nothing: I love mangoes, cricket, tea…" } },
        { text: { bn: "বাংলাদেশের মানচিত্র মনে করে পাঁচটা নাম: the Padma, the Bay of Bengal, the Sundarbans, Dhaka, Cox's Bazar। কোনটায় the, কোনটায় নয়, বলো।", en: "Picture the map and say five names: the Padma, the Bay of Bengal, the Sundarbans, Dhaka, Cox's Bazar. Say which take the and which do not." } },
        { text: { bn: "পরিবারের তিনজনের পেশা a/an দিয়ে: Baba is a…, Ma is a…, Mama is an…", en: "Three family members' jobs with a or an: Baba is a…, Ma is a…, Mama is an…" } },
      ],
    },
  },
};
