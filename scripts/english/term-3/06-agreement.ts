/* ============================================================
   06-agreement.ts: পর্ব ৬, কর্তা আর ক্রিয়ার মিল: -s এর নিয়ম.

   One part of the grammar term, gathered into the rung by
   `basic.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>মিতু আপুর SSC-র মডেল টেস্টের খাতা ফেরত এসেছে। <span lang="en">Right form of verbs</span>-এ দশে ছয়। চারটা ভুলের তিনটাই একই ভুল: <span lang="en">She play, He go, The boy run</span>। একটা অক্ষর কম, একটা করে নম্বর কম। এই পর্ব ওই একটা অক্ষরের।</p>

<p>ইংরেজিতে কর্তা আর ক্রিয়াকে মিলতে হয়, ঠিক যেমন বাংলায় "আমি খাই" কিন্তু "সে খায়"। বাংলায় আমরা এটা না ভেবেই করি। ইংরেজির নিয়মটা আরও সহজ, কারণ বদলটা হয় মাত্র এক জায়গায়: <strong>একজন তৃতীয় ব্যক্তি, বর্তমান কাল, ক্রিয়ায় একটা <span lang="en">-s</span>।</strong> নিয়মটা এক লাইনের, কিন্তু পরীক্ষার ফাঁদ বারোটা: লুকানো কর্তা, <span lang="en">and</span> আর <span lang="en">or</span>, <span lang="en">everyone</span>, <span lang="en">there is</span>, দলের নাম, দূরত্বের নাম, শিরোনাম, আর <span lang="en">one of</span>। আজ সবগুলো।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">he, she, it</span>, বা একজন মানুষ, একটা জিনিস: ক্রিয়ার শেষে <span lang="en">-s</span>। <span lang="en">She plays. Rafi plays. The cat sleeps.</span></li>
<li><span lang="en">I, you, we, they</span>, বা অনেকজন: কোনো <span lang="en">-s</span> নয়। <span lang="en">They play. The boys play.</span></li>
<li><span lang="en">be</span> আর <span lang="en">have</span> নিজেদের রূপ বদলায়: <span lang="en">am/is/are, has/have</span>।</li>
<li>অতীত কালে এই নিয়ম নেই: <span lang="en">She played. They played.</span> সবার এক। শুধু <span lang="en">was/were</span> আলাদা।</li>
<li>টুপি একটাই: হয় কর্তায় <span lang="en">-s</span> (অনেক), নয় ক্রিয়ায় <span lang="en">-s</span> (একজন)। দুটোতে একসাথে না, কোনোটাতেও না, এমন হয় না।</li>
<li>কর্তা খোঁজো <span lang="en">of, with, in</span>-এর আগে; <span lang="en">everyone, each</span> একজন; <span lang="en">and</span> অনেক; <span lang="en">or</span> হলে কাছেরটার সাথে।</li>
</ul>
</div>

${mount("agreement-pattern")}

<h2>টুপির নিয়ম</h2>

<p>একটা ছবি মনে রাখো: বাক্যে একটাই টুপি আছে, আর কেউ একজন সেটা পরবে। কর্তা যদি অনেক হয়, <span lang="en">boys, cats, players</span>, তাহলে কর্তা টুপিটা পরেছে (<span lang="en">-s</span> কর্তায়), ক্রিয়া খালি মাথায়: <span lang="en">The boys play.</span> কর্তা যদি একজন হয়, <span lang="en">boy, cat, Rafi, she</span>, তাহলে টুপিটা ক্রিয়ার: <span lang="en">The boy plays.</span></p>

<p>ব্যতিক্রম শুধু <span lang="en">I</span> আর <span lang="en">you</span>: এরা একজন হলেও টুপি নেয় না। <span lang="en">I play. You play.</span> কারণ ইতিহাস, কারণ নেই। মুখস্থ।</p>

<div class="table-scroll">
<table>
<thead><tr><th>কর্তা</th><th>সাধারণ ক্রিয়া</th><th><span lang="en">be</span></th><th><span lang="en">have</span></th><th><span lang="en">do</span></th></tr></thead>
<tbody>
<tr><td><span lang="en">I</span></td><td><span lang="en">play</span></td><td><span lang="en">am</span></td><td><span lang="en">have</span></td><td><span lang="en">do</span></td></tr>
<tr><td><span lang="en">you, we, they</span></td><td><span lang="en">play</span></td><td><span lang="en">are</span></td><td><span lang="en">have</span></td><td><span lang="en">do</span></td></tr>
<tr><td><span lang="en">he, she, it, Rafi</span></td><td><span lang="en">plays</span></td><td><span lang="en">is</span></td><td><span lang="en">has</span></td><td><span lang="en">does</span></td></tr>
</tbody>
</table>
</div>

<p><span lang="en">be</span> একমাত্র ক্রিয়া যেটা অতীতেও কর্তার সাথে বদলায়: <span lang="en">I was, he was, she was, it was</span>, কিন্তু <span lang="en">you were, we were, they were</span>। বাকি সব ক্রিয়া অতীতে এক রূপ। নিচের ছকে <span lang="en">be</span>-র সবগুলো রূপ নিজে ভরো।</p>

${mount("agreement-grid")}

${mount("agreement-lines")}

<h2>-s বসানোর বানান</h2>

<p>noun-এর বহুবচনের যে নিয়ম, ক্রিয়ার <span lang="en">-s</span>-এরও ঠিক তাই। শেষে <span lang="en">-s, -sh, -ch, -x, -o</span> থাকলে <span lang="en">-es</span>: <span lang="en">watches, washes, fixes, goes, does</span>। ব্যঞ্জন + <span lang="en">y</span> হলে <span lang="en">-ies</span>: <span lang="en">study, studies; cry, cries; fly, flies</span>। স্বর + y হলে শুধু -s: <span lang="en">plays, enjoys, buys</span>। আর <span lang="en">have</span> হয়ে যায় <span lang="en">has</span>, নিয়ম ছাড়াই।</p>

<p>উচ্চারণটাও তিন রকম, আর কান দিয়ে চিনলে বানান মনে থাকে। <span lang="en">plays, runs, goes</span>-এ শেষে "জ়" আওয়াজ। <span lang="en">eats, sleeps, likes</span>-এ "স"। আর <span lang="en">watches, washes, fixes</span>-এ পুরো একটা বাড়তি সিলেবল, "ইজ়", কারণ দুটো হিসহিস আওয়াজ পাশাপাশি বলা যায় না; সেই জন্যই ওখানে <span lang="en">-es</span>।</p>

${mount("agreement-spell")}

${mount("agreement-gap")}

<h2>কর্তা কোথায় লুকিয়ে আছে</h2>

<p>সহজ বাক্যে সবাই পারে। পরীক্ষায় ফাঁদ পাতা হয় কর্তা আর ক্রিয়ার মাঝে কিছু ঢুকিয়ে। <span lang="en">The captain of the players ___ tired.</span> কর্তা কে? <span lang="en">captain</span>, একজন। <span lang="en">players</span> শুধু পাশে দাঁড়িয়ে আছে, <span lang="en">of</span>-এর পিছনে। তাই <span lang="en">is</span>। কৌশল: <span lang="en">of, with, in</span> দিয়ে শুরু হওয়া অংশটা হাত দিয়ে ঢেকে দাও, তারপর দেখো কর্তা একজন না অনেক।</p>

<p>আরও কয়েকটা লুকানো কর্তা:</p>

<ul>
<li><span lang="en">Everyone, everybody, someone, nobody, each</span>: দেখতে অনেক, আসলে একজন। <span lang="en">Everyone loves Shakib. Nobody knows.</span></li>
<li><span lang="en">Rafi and Mitu</span>: <span lang="en">and</span> দিয়ে জোড়া, তাই অনেক। <span lang="en">Rafi and Mitu are cousins.</span></li>
<li><span lang="en">Rafi or Mitu</span>: <span lang="en">or</span> হলে যে কাছে, তার সাথে মিল। <span lang="en">Rafi or Mitu is coming.</span></li>
<li><span lang="en">Rice, water, news, mathematics</span>: গোনা যায় না, তাই একজনের মতো। <span lang="en">The news is good.</span></li>
<li><span lang="en">There is a bat. There are two bats.</span> <span lang="en">There</span> কর্তা নয়, তার পরে যেটা আছে সেটা কর্তা।</li>
</ul>

<h2>আরও সাতটা ফাঁদ, পরীক্ষা যেগুলো ভালোবাসে</h2>

<div class="table-scroll">
<table>
<thead><tr><th>ফাঁদ</th><th>উদাহরণ</th><th>কেন</th></tr></thead>
<tbody>
<tr><td><span lang="en">either … or, neither … nor</span></td><td><span lang="en">Neither Rafi nor his friends are here. Either the boys or Mitu is wrong.</span></td><td>কাছের কর্তার সাথে মিল</td></tr>
<tr><td><span lang="en">with, as well as, together with</span></td><td><span lang="en">Rafi, with his friends, is coming.</span></td><td><span lang="en">with</span> জোড়ে না; কর্তা শুধু রাফি</td></tr>
<tr><td><span lang="en">one of + বহুবচন</span></td><td><span lang="en">One of the players is injured.</span></td><td>কর্তা <span lang="en">one</span>, একজন</td></tr>
<tr><td>দলের নাম</td><td><span lang="en">The team is ready. The family lives here.</span></td><td>দল একটা</td></tr>
<tr><td>টাকা, সময়, দূরত্ব, একটা পরিমাণ হিসেবে</td><td><span lang="en">Ten kilometres is a long walk. Two hours is enough. Fifty taka is the fare.</span></td><td>পুরোটা একটা পরিমাণ</td></tr>
<tr><td>শিরোনাম আর নাম</td><td><span lang="en">The Hunger Games is a film. The Maldives is a country.</span></td><td>একটা বই, একটা দেশ</td></tr>
<tr><td><span lang="en">-ing</span> দিয়ে শুরু কর্তা</td><td><span lang="en">Playing cricket is fun. Reading books makes you wise.</span></td><td>কাজটা একটা জিনিস, একজন</td></tr>
<tr><td><span lang="en">a number of</span> আর <span lang="en">the number of</span></td><td><span lang="en">A number of students are absent. The number of students is small.</span></td><td>প্রথমটা "অনেকে", দ্বিতীয়টা "সংখ্যাটা"</td></tr>
</tbody>
</table>
</div>

<p>এই ফাঁদগুলোর প্রতিটায় প্রশ্নটা এক: আসল কর্তা কে, আর সে একজন না অনেক? <span lang="en">with</span>, <span lang="en">of</span>, <span lang="en">as well as</span> দিয়ে জোড়া লাগানো অংশ কর্তা নয়। <span lang="en">and</span> দিয়ে জোড়া লাগানো অংশ কর্তার ভিতরে। এটুকু মনে রাখলে সাতটা এক হয়ে যায়।</p>

${mount("agreement-hidden")}

${mount("agreement-reveal")}

${mount("agreement-spot")}

<h2>প্রশ্ন আর না-বাচকে টুপি কোথায় যায়</h2>

<p>প্রশ্ন বা না-বাচক করলে একটা সাহায্যকারী ক্রিয়া আসে, <span lang="en">do</span> বা <span lang="en">does</span>, আর টুপিটা সে নিয়ে নেয়। <span lang="en">Rafi plays.</span> টুপি <span lang="en">plays</span>-এ। <span lang="en">Does Rafi play?</span> টুপি <span lang="en">does</span>-এ, তাই <span lang="en">play</span> খালি। <span lang="en">Rafi does not play.</span> একই। <span lang="en">Does Rafi plays?</span> দুটো টুপি, ভুল। পর্ব ১৩-তে প্রশ্নের পুরো মেশিন, কিন্তু নিয়মটা এখানেই: <strong>একটা বাক্যে একটাই টুপি।</strong> <span lang="en">can, will, must, should</span>-এর পরেও তাই: এরা টুপিই নেয় না, আর তাদের পরের ক্রিয়াও নেয় না। <span lang="en">He can play. She must go.</span></p>

${mount("agreement-build")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>এই পর্বের প্রশ্নের নাম <span lang="en">right form of verbs</span>: একটা অনুচ্ছেদ, দশটা বন্ধনী, প্রতিটায় একটা ক্রিয়ার খালি রূপ। অর্ধেক ঘরে প্রশ্নটা কাল (পর্ব ৭, ১১), বাকি অর্ধেকে প্রশ্নটা এই <span lang="en">-s</span>। প্রতিটা ঘরে তিন প্রশ্ন, এক নিঃশ্বাসে।</p>

<ol class="step-list">
<li><strong>কালটা কী?</strong> বাক্যে <span lang="en">yesterday, ago, last</span> থাকলে অতীত: <span lang="en">-ed</span> বা রেবেল রূপ, <span lang="en">-s</span>-এর প্রশ্নই নেই। <span lang="en">every day, usually, always</span> বা কোনো সময়ের শব্দ না থাকলে বর্তমান।</li>
<li><strong>বর্তমান হলে, আসল কর্তা কে?</strong> <span lang="en">of, with, in</span>-এর অংশ ঢেকে দাও। <span lang="en">everyone, each, one of</span> একজন। <span lang="en">and</span> অনেক। <span lang="en">There</span>-এর পরেরটা কর্তা।</li>
<li><strong>একজন, আর <span lang="en">I/you</span> নয়?</strong> তাহলে <span lang="en">-s</span>, বানানের নিয়ম মেনে। আর বাক্যে <span lang="en">does, can, will</span> আগে থেকে থাকলে ক্রিয়া খালি: টুপি ওরা পরে ফেলেছে।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Rafi (love) ___ cricket. Every evening he and his friends (go) ___ to the field. One of them (bring) ___ a ball. The captain of the team (choose) ___ the sides, and everybody (play) ___ until dark. Nobody (want) ___ to go home.</span> উত্তর: <span lang="en">loves</span> (রাফি একজন), <span lang="en">go</span> (<span lang="en">and</span>, অনেক), <span lang="en">brings</span> (<span lang="en">one of</span>, একজন), <span lang="en">chooses</span> (কর্তা <span lang="en">captain</span>), <span lang="en">plays</span> (<span lang="en">everybody</span> একজন), <span lang="en">wants</span> (<span lang="en">nobody</span> একজন)। ছয় ঘর, ছয়বার একই তিন প্রশ্ন।</div>

${mount("agreement-exam")}

${mount("agreement-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Right form of verbs</span>-এ তিনটা প্রশ্ন ক্রমে: (১) কালটা কী, বর্তমান না অতীত? অতীত হলে <span lang="en">-ed</span> বা রেবেল রূপ, <span lang="en">-s</span>-এর প্রশ্নই নেই। (২) বর্তমান হলে কর্তা একজন না অনেক? <span lang="en">of, with</span>-এর অংশ ঢেকে দাও। (৩) একজন, আর <span lang="en">I/you</span> নয়? তাহলে <span lang="en">-s</span>। প্রশ্নপত্রের প্রতিটা ফাঁকা ঘরে এই তিন প্রশ্ন, এক নিঃশ্বাসে।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">does, doesn't, can, will, must</span>-এর পরে ক্রিয়া সবসময় খালি মাথায়। <span lang="en">She doesn't plays</span> ভুল: টুপিটা <span lang="en">does</span> আগেই পরে নিয়েছে, তাই <span lang="en">She doesn't play.</span> <span lang="en">He can plays</span> ভুল, <span lang="en">He can play</span> ঠিক। একটা বাক্যে একটাই টুপি।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>একটা ক্রিয়া কর্তা থেকে অনেক দূরে বসলে চোখ ঠিক আগের শব্দটার সাথে মেলাতে চায়। <span lang="en">The book that Mitu borrowed from her friends ___ on the table.</span> ঠিক আগে <span lang="en">friends</span>, কিন্তু কর্তা <span lang="en">book</span>: <span lang="en">is</span>। বাক্য লম্বা হলে প্রথমে ক্রিয়াটা খোঁজো, তারপর জিজ্ঞেস করো "কে?" আর <span lang="en">that, who, which</span> দিয়ে শুরু হওয়া অংশটাও ঢেকে দাও, ঠিক <span lang="en">of</span>-এর মতো।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>টুপির নিয়ম এক বাক্যে বলতে পারি, আর <span lang="en">I, you</span>-র ব্যতিক্রম?</li>
<li><span lang="en">be</span>-র দশটা রূপ (এখন পাঁচটা, তখন পাঁচটা) না দেখে?</li>
<li><span lang="en">The captain of the players is</span>: কেন <span lang="en">is</span>?</li>
<li><span lang="en">everyone, one of, neither … nor, there is</span>: চারটার নিয়ম?</li>
<li><span lang="en">Does he play</span>, <span lang="en">Does he plays</span> নয়: কেন?</li>
</ul>
</div>

${mount("agreement-drill")}
`,
  blocks: {
    "agreement-pattern": {
      kind: "pattern",
      title: { bn: "একটাই টুপি", en: "One hat" },
      shape: "He / She / It / Rafi + VERB-s   ·   I / You / We / They / the boys + VERB",
      why: { bn: "বর্তমান কালে একজন তৃতীয় ব্যক্তি হলে ক্রিয়ায় একটা -s। বাকি সবাই খালি ক্রিয়া। কর্তা অনেক হলে টুপি কর্তার মাথায়, ক্রিয়ার নয়।", en: "In the present, one third person puts an -s on the verb. Everybody else takes the bare verb. Many subjects wear the hat themselves, so the verb does not." },
      examples: [
        { target: "Rafi plays cricket every evening.", bn: "রাফি রোজ সন্ধ্যায় ক্রিকেট খেলে।" },
        { target: "His friends play with him.", bn: "তার বন্ধুরা তার সাথে খেলে।" },
        { target: "Mitu studies at night.", bn: "মিতু রাতে পড়ে।" },
        { target: "The cat has a red collar.", bn: "বেড়ালটার একটা লাল কলার আছে।" },
        { target: "I have two sisters.", bn: "আমার দুই বোন।" },
      ],
      tip: { bn: "কর্তার শেষে s আছে? তাহলে ক্রিয়ায় নেই। কর্তায় নেই? তাহলে ক্রিয়ায় আছে। I আর you-কে বাদ রেখে।", en: "An s on the subject means none on the verb, and none on the subject means one on the verb, with I and you the exception." },
    },
    "agreement-grid": {
      kind: "grid",
      model: "en-be",
      title: { bn: "be: এখন আর তখন, নিজে ভরো", en: "Be, now and then: fill it yourself" },
      note: { bn: "প্রতিটা কর্তার পাশে দুটো ঘর: এখনের রূপ আর তখনের রূপ। একটা দেওয়া আছে।", en: "Two cells beside each subject: the form for now and the form for then. One is given." },
    },
    "agreement-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: টুপি বদল", en: "Listen, say: swap the hat" },
      note: { bn: "প্রতিটা জোড়ায় একই কাজ, একজন আর অনেকে। -s কোথায় গেল শোনো।", en: "Each pair is the same action for one and for many. Listen to where the -s goes." },
      lines: [
        { target: "The boy runs. The boys run.", bn: "ছেলেটা দৌড়ায়। ছেলেরা দৌড়ায়।" },
        { target: "She watches films. They watch films.", bn: "সে সিনেমা দেখে। তারা সিনেমা দেখে।" },
        { target: "Nanu has a story. We have a question.", bn: "নানুর একটা গল্প আছে। আমাদের একটা প্রশ্ন আছে।" },
        { target: "Rafi does his homework. You do yours.", bn: "রাফি তার হোমওয়ার্ক করে। তুমি তোমারটা করো।" },
        { target: "Everyone loves a good story.", bn: "সবাই ভালো গল্প ভালোবাসে।" },
        { target: "He was late, and they were angry.", bn: "সে দেরি করেছিল, আর তারা রেগে ছিল।" },
      ],
    },
    "agreement-spell": {
      kind: "bins",
      title: { bn: "-s এর বানান কারখানা", en: "The -s spelling factory" },
      note: { bn: "he বা she কর্তা হলে প্রতিটা ক্রিয়ার শেষে কী বসবে, সেই ঘরে ফেলো।", en: "With he or she as the subject, drop each verb into the box of what its ending becomes." },
      bins: [
        { id: "s", label: { bn: "শুধু -s", en: "just -s" } },
        { id: "es", label: { bn: "-es", en: "-es" } },
        { id: "ies", label: { bn: "y হয়ে যায় -ies", en: "y becomes -ies" } },
      ],
      items: [
        { text: { bn: "play", en: "play" }, bin: "s", why: { bn: "স্বর + y: plays।", en: "Vowel + y: plays." } },
        { text: { bn: "watch", en: "watch" }, bin: "es", why: { bn: "-ch: watches, বাড়তি সিলেবল।", en: "-ch: watches, with an extra syllable." } },
        { text: { bn: "study", en: "study" }, bin: "ies", why: { bn: "ব্যঞ্জন + y: studies।", en: "Consonant + y: studies." } },
        { text: { bn: "go", en: "go" }, bin: "es", why: { bn: "-o: goes।", en: "-o: goes." } },
        { text: { bn: "fix", en: "fix" }, bin: "es", why: { bn: "-x: fixes।", en: "-x: fixes." } },
        { text: { bn: "enjoy", en: "enjoy" }, bin: "s", why: { bn: "স্বর + y: enjoys।", en: "Vowel + y: enjoys." } },
        { text: { bn: "cry", en: "cry" }, bin: "ies", why: { bn: "ব্যঞ্জন + y: cries।", en: "Consonant + y: cries." } },
        { text: { bn: "wash", en: "wash" }, bin: "es", why: { bn: "-sh: washes।", en: "-sh: washes." } },
        { text: { bn: "read", en: "read" }, bin: "s", why: { bn: "সাধারণ: reads।", en: "Regular: reads." } },
        { text: { bn: "do", en: "do" }, bin: "es", why: { bn: "-o: does, আর উচ্চারণ 'ডাজ়'।", en: "-o: does, and it is said duz." } },
      ],
    },
    "agreement-gap": {
      kind: "gap",
      title: { bn: "টুপিটা কার", en: "Whose hat is it" },
      items: [
        { text: "Mitu ___ English every morning.", bn: "মিতু রোজ সকালে ইংরেজি পড়ে।", options: ["study", "studies", "studys"], right: 1, why: { bn: "Mitu একজন, বর্তমান কাল: -s। ব্যঞ্জন + y, তাই studies।", en: "Mitu is one person in the present: -s. Consonant + y, so studies." } },
        { text: "The players ___ hard before a match.", bn: "খেলোয়াড়রা ম্যাচের আগে কঠোর অনুশীলন করে।", options: ["practises", "practise", "practising"], right: 1, why: { bn: "players অনেক, টুপি কর্তার মাথায়, ক্রিয়া খালি: practise।", en: "Players are many; the subject wears the hat and the verb is bare: practise." } },
        { text: "The captain of the players ___ a speech.", bn: "খেলোয়াড়দের অধিনায়ক একটা বক্তৃতা দেন।", options: ["give", "gives", "giving"], right: 1, why: { bn: "কর্তা captain, একজন। of the players ঢেকে দাও। তাই gives।", en: "The subject is captain, one person. Cover of the players. So gives." } },
        { text: "Everybody ___ Nanu's pitha.", bn: "সবাই নানুর পিঠা পছন্দ করে।", options: ["like", "likes", "liking"], right: 1, why: { bn: "everybody দেখতে অনেক, ব্যাকরণে একজন: likes।", en: "Everybody looks like many and counts as one: likes." } },
        { text: "Rafi doesn't ___ spinach.", bn: "রাফি পালংশাক পছন্দ করে না।", options: ["likes", "like", "liked"], right: 1, why: { bn: "টুপিটা does আগেই পরেছে, তাই ক্রিয়া খালি: doesn't like।", en: "Does already wears the hat, so the verb is bare: doesn't like." } },
        { text: "There ___ three mangoes on the table.", bn: "টেবিলে তিনটে আম আছে।", options: ["is", "are", "be"], right: 1, why: { bn: "There কর্তা নয়। কর্তা three mangoes, অনেক: are।", en: "There is not the subject. Three mangoes is, and it is many: are." } },
        { text: "Rafi and Mitu ___ cousins.", bn: "রাফি আর মিতু খালাতো ভাইবোন।", options: ["is", "are", "am"], right: 1, why: { bn: "and দিয়ে জোড়া, দুজন: are।", en: "Joined by and, two people: are." } },
        { text: "Yesterday the boys ___ late for practice.", bn: "কাল ছেলেরা অনুশীলনে দেরি করেছিল।", options: ["was", "were", "is"], right: 1, why: { bn: "অতীত, আর boys অনেক: were। be অতীতেও কর্তার সাথে বদলায়।", en: "The past, and boys are many: were. Be changes with its subject in the past too." } },
      ],
    },
    "agreement-hidden": {
      kind: "gap",
      title: { bn: "লুকানো কর্তা", en: "The hidden subject" },
      note: { bn: "প্রথমে ক্রিয়াটা খোঁজো, তারপর 'কে?' জিজ্ঞেস করো। of, with, that-এর অংশ ঢেকে দাও।", en: "Find the verb first, then ask who. Cover the of, with and that parts." },
      items: [
        { text: "One of my friends ___ in Sylhet.", bn: "আমার এক বন্ধু সিলেটে থাকে।", options: ["live", "lives", "living"], right: 1, why: { bn: "কর্তা one, একজন। of my friends ঢেকে দাও: lives।", en: "The subject is one, singular. Cover of my friends: lives." } },
        { text: "Neither Rafi nor his friends ___ ready.", bn: "রাফি বা তার বন্ধুরা, কেউই প্রস্তুত নয়।", options: ["is", "are", "am"], right: 1, why: { bn: "nor-এর কাছের কর্তা friends, অনেক: are।", en: "The subject nearer to nor is friends, plural: are." } },
        { text: "Rafi, with his two brothers, ___ coming.", bn: "রাফি, তার দুই ভাইকে নিয়ে, আসছে।", options: ["is", "are", "were"], right: 0, why: { bn: "with জোড়ে না। কর্তা শুধু Rafi, একজন: is।", en: "With does not join. The subject is Rafi alone: is." } },
        { text: "Two hours ___ enough for this exam.", bn: "এই পরীক্ষার জন্য দুই ঘণ্টা যথেষ্ট।", options: ["is", "are", "have"], right: 0, why: { bn: "দুই ঘণ্টা একটা পরিমাণ, একটা জিনিস: is।", en: "Two hours is one amount, one thing: is." } },
        { text: "Playing cricket in the rain ___ dangerous.", bn: "বৃষ্টিতে ক্রিকেট খেলা বিপজ্জনক।", options: ["is", "are", "be"], right: 0, why: { bn: "-ing দিয়ে শুরু কর্তা একটা কাজ, একটা জিনিস: is। rain ঠিক আগে, কিন্তু কর্তা নয়।", en: "An -ing subject is one activity, one thing: is. Rain sits right before the gap but is not the subject." } },
        { text: "The number of students in our class ___ forty.", bn: "আমাদের ক্লাসের ছাত্র সংখ্যা চল্লিশ।", options: ["is", "are", "were"], right: 0, why: { bn: "the number of: সংখ্যাটা, একটা: is। a number of হলে অনেক হতো।", en: "The number of: the figure itself, one thing: is. A number of would mean many." } },
        { text: "The books that Mitu borrowed ___ on the shelf.", bn: "মিতু যে বইগুলো ধার করেছিল, সেগুলো তাকে।", options: ["is", "are", "was"], right: 1, why: { bn: "that Mitu borrowed ঢেকে দাও। কর্তা books, অনেক: are।", en: "Cover that Mitu borrowed. The subject is books, plural: are." } },
        { text: "Mathematics ___ my favourite subject.", bn: "গণিত আমার প্রিয় বিষয়।", options: ["is", "are", "were"], right: 0, why: { bn: "শেষে s আছে, কিন্তু একটা বিষয়: is।", en: "It ends in s, but it is one subject: is." } },
      ],
    },
    "agreement-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: কে টুপি পরল?", en: "Guess first: who wears the hat?" },
      ask: { bn: "Either the boys or Mitu ___ to blame. আর: Either Mitu or the boys ___ to blame. দুটো বাক্যে is না are?", en: "Either the boys or Mitu ___ to blame. And: Either Mitu or the boys ___ to blame. Is or are, in each?" },
      choices: [
        { bn: "দুটোতেই are", en: "Are in both" },
        { bn: "প্রথমটায় is, দ্বিতীয়টায় are", en: "Is in the first, are in the second" },
        { bn: "দুটোতেই is", en: "Is in both" },
      ],
      answer: { bn: "প্রথমটায় is, দ্বিতীয়টায় are।", en: "Is in the first, are in the second." },
      why: { bn: "either … or আর neither … nor-এ ক্রিয়া মেলে যে কর্তা তার সবচেয়ে কাছে, তার সাথে। প্রথম বাক্যে or-এর পরে Mitu, একজন: is। দ্বিতীয়টায় or-এর পরে the boys, অনেক: are। একই দুজন, ক্রম বদলালে ক্রিয়া বদলায়। পরীক্ষায় এই জোড়াটা প্রায় প্রতি বছর।", en: "With either … or and neither … nor the verb agrees with the subject nearest to it. In the first sentence Mitu follows or, singular: is. In the second the boys follow or, plural: are. Same two subjects, and swapping the order swaps the verb. The exam sets this pair almost every year." },
    },
    "agreement-spot": {
      kind: "spot",
      title: { bn: "মিতু আপুর খাতা", en: "Mitu's exam paper" },
      note: { bn: "স্যারের মতো লাল কালি হাতে নাও। যে লাইনে ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line with a mistake in it." },
      source: { bn: "মডেল টেস্ট, অনুচ্ছেদ লেখা", en: "Model test, paragraph writing" },
      lines: [
        { text: { bn: "My cousin Rafi love cricket more than anything.", en: "My cousin Rafi love cricket more than anything." }, flag: { bn: "Rafi একজন, বর্তমান কাল: loves।", en: "Rafi is one person in the present: loves." } },
        { text: { bn: "He plays every evening with his friends.", en: "He plays every evening with his friends." } },
        { text: { bn: "His friends also likes the game.", en: "His friends also likes the game." }, flag: { bn: "friends অনেক, ক্রিয়া খালি: like।", en: "Friends are many, the verb is bare: like." } },
        { text: { bn: "The captain of their team is very strict.", en: "The captain of their team is very strict." } },
        { text: { bn: "Everyone in the team want to win.", en: "Everyone in the team want to win." }, flag: { bn: "everyone একজন, in the team ঢেকে দাও: wants।", en: "Everyone counts as one; cover in the team: wants." } },
        { text: { bn: "Rafi doesn't likes losing.", en: "Rafi doesn't likes losing." }, flag: { bn: "does টুপি পরে ফেলেছে, তাই like। একটা বাক্যে একটাই টুপি।", en: "Does already has the hat, so like. One hat per sentence." } },
        { text: { bn: "One of his bats are broken, but he still plays.", en: "One of his bats are broken, but he still plays." }, flag: { bn: "কর্তা one, একটা: is broken।", en: "The subject is one, singular: is broken." } },
        { text: { bn: "But he always shakes hands after the match.", en: "But he always shakes hands after the match." } },
      ],
    },
    "agreement-build": {
      kind: "build",
      title: { bn: "টুপি ঠিক জায়গায় রেখে সাজাও", en: "Build it with the hat in the right place" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় প্রতিটা বাক্যে টুপিটা কার, বলো।", en: "The words are shuffled. As you build each sentence, say who is wearing the hat." },
      pattern: "one subject + verb-s  ·  many subjects + verb",
      lines: [
        { target: "The captain of the team gives a speech.", bn: "দলের অধিনায়ক একটা বক্তৃতা দেন।" },
        { target: "Everyone in the class loves Nanu's stories.", bn: "ক্লাসের সবাই নানুর গল্প ভালোবাসে।" },
        { target: "Rafi and Mitu study together every evening.", bn: "রাফি আর মিতু রোজ সন্ধ্যায় একসাথে পড়ে।" },
        { target: "One of the players is injured.", bn: "খেলোয়াড়দের একজন আহত।" },
        { target: "Does she watch films at night?", bn: "সে কি রাতে সিনেমা দেখে?" },
        { target: "There are two mangoes on the table.", bn: "টেবিলে দুটো আম আছে।" },
      ],
    },
    "agreement-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Each of the boys ___ a bat. কোনটা?", en: "Each of the boys ___ a bat. Which?" },
          options: [
            { text: { bn: "have", en: "have" }, why: { bn: "না। কর্তা each, একজন করে। of the boys ঢেকে দাও।", en: "No. The subject is each, one at a time. Cover of the boys." } },
            { text: { bn: "has", en: "has" }, right: true, why: { bn: "হ্যাঁ। each একজন: has। boys ঠিক আগে, কিন্তু কর্তা নয়।", en: "Yes. Each is singular: has. Boys sits right before the gap but is not the subject." } },
            { text: { bn: "having", en: "having" }, why: { bn: "না। -ing একা ক্রিয়া হয় না; আগে is লাগত।", en: "No. -ing alone is not a verb; it would need is before it." } },
          ],
        },
        {
          ask: { bn: "Ten kilometres ___ a long way to walk, and the roads ___ bad. কোন জোড়া?", en: "Ten kilometres ___ a long way to walk, and the roads ___ bad. Which pair?" },
          options: [
            { text: { bn: "are, are", en: "are, are" }, why: { bn: "না। দশ কিলোমিটার একটা দূরত্ব, একটা পরিমাণ: is।", en: "No. Ten kilometres is one distance, one amount: is." } },
            { text: { bn: "is, are", en: "is, are" }, right: true, why: { bn: "হ্যাঁ। পরিমাণ হিসেবে একটা: is। roads অনেক: are।", en: "Yes. As an amount it is one: is. Roads are many: are." } },
            { text: { bn: "is, is", en: "is, is" }, why: { bn: "না। roads বহুবচন: are।", en: "No. Roads is plural: are." } },
          ],
        },
        {
          ask: { bn: "The Hunger Games ___ my favourite film, and its sequels ___ good too. কোন জোড়া?", en: "The Hunger Games ___ my favourite film, and its sequels ___ good too. Which pair?" },
          options: [
            { text: { bn: "are, are", en: "are, are" }, why: { bn: "না। শিরোনাম একটা সিনেমা, শেষে s থাকলেও: is।", en: "No. A title is one film, s or no s: is." } },
            { text: { bn: "is, are", en: "is, are" }, right: true, why: { bn: "হ্যাঁ। একটা সিনেমার নাম: is। sequels অনেক: are।", en: "Yes. One film's title: is. Sequels are many: are." } },
            { text: { bn: "is, is", en: "is, is" }, why: { bn: "না। sequels বহুবচন: are।", en: "No. Sequels is plural: are." } },
          ],
        },
        {
          ask: { bn: "A number of students ___ absent today, so the number of players ___ small. কোন জোড়া?", en: "A number of students ___ absent today, so the number of players ___ small. Which pair?" },
          options: [
            { text: { bn: "are, is", en: "are, is" }, right: true, why: { bn: "হ্যাঁ। a number of মানে অনেকে: are। the number of মানে সংখ্যাটা, একটা: is।", en: "Yes. A number of means many: are. The number of means the figure, one thing: is." } },
            { text: { bn: "is, is", en: "is, is" }, why: { bn: "না। a number of students মানে অনেক ছাত্র: are।", en: "No. A number of students means many students: are." } },
            { text: { bn: "are, are", en: "are, are" }, why: { bn: "না। the number মানে সংখ্যাটা নিজে, একটা: is।", en: "No. The number means the figure itself, one: is." } },
          ],
        },
      ],
    },
    "agreement-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "কোন বাক্যটা ঠিক?", en: "Which sentence is right?" },
          options: [
            { text: { bn: "She don't like tea.", en: "She don't like tea." }, why: { bn: "না। she একজন, তাই does: She doesn't like tea।", en: "No. She is one person, so does: She doesn't like tea." } },
            { text: { bn: "She doesn't like tea.", en: "She doesn't like tea." }, right: true, why: { bn: "হ্যাঁ। does টুপি পরেছে, like খালি।", en: "Yes. Does wears the hat and like stays bare." } },
            { text: { bn: "She doesn't likes tea.", en: "She doesn't likes tea." }, why: { bn: "না। দুটো টুপি। does-এর পরে খালি ক্রিয়া।", en: "No. Two hats. After does the verb is bare." } },
          ],
        },
        {
          ask: { bn: "I ___ at home yesterday, and my brothers ___ at school. কোন জোড়া?", en: "I ___ at home yesterday, and my brothers ___ at school. Which pair?" },
          options: [
            { text: { bn: "was, were", en: "was, were" }, right: true, why: { bn: "হ্যাঁ। অতীতে be বদলায়: I was, they were।", en: "Yes. Be changes in the past: I was, they were." } },
            { text: { bn: "were, was", en: "were, was" }, why: { bn: "উল্টো। I-এর সাথে was, brothers-এর সাথে were।", en: "Backwards. I takes was, brothers take were." } },
            { text: { bn: "am, are", en: "am, are" }, why: { bn: "না। yesterday, অতীত: was, were।", en: "No. Yesterday is the past: was, were." } },
          ],
        },
        {
          ask: { bn: "Nanu, as well as her sisters, ___ pitha every winter. কোনটা?", en: "Nanu, as well as her sisters, ___ pitha every winter. Which?" },
          options: [
            { text: { bn: "make", en: "make" }, why: { bn: "না। as well as জোড়ে না, and-এর মতো নয়। কর্তা শুধু Nanu।", en: "No. As well as does not join the way and does. The subject is Nanu alone." } },
            { text: { bn: "makes", en: "makes" }, right: true, why: { bn: "হ্যাঁ। as well as-এর অংশ ঢেকে দাও: Nanu makes।", en: "Yes. Cover the as well as part: Nanu makes." } },
          ],
        },
      ],
    },
    "agreement-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "পরিবারের প্রত্যেকে রোজ কী করে, একটা করে বাক্য, -s সহ: Ma cooks. Baba reads the paper. Nanu prays.", en: "One sentence for what each person at home does daily, with the -s: Ma cooks. Baba reads the paper. Nanu prays." } },
        { text: { bn: "তারপর দুজনকে একসাথে করে বলো, -s ছাড়া: Ma and Baba watch the news.", en: "Then pair two of them up, without the -s: Ma and Baba watch the news." } },
        { text: { bn: "পাঁচটা ক্রিয়ার -es রূপ জোরে: goes, does, watches, washes, studies।", en: "Five -es forms aloud: goes, does, watches, washes, studies." } },
        { text: { bn: "be-র দশটা রূপ এক নিঃশ্বাসে: I am, you are, he is, we are, they are; I was, you were, he was, we were, they were।", en: "The ten forms of be in one breath: I am, you are, he is, we are, they are; I was, you were, he was, we were, they were." } },
        { text: { bn: "পাঁচটা লুকানো কর্তার বাক্য জোরে: One of my friends is… Everyone in my class likes… The captain of the team plays…", en: "Five hidden-subject sentences aloud: One of my friends is… Everyone in my class likes… The captain of the team plays…" } },
        { text: { bn: "একটা বাক্য তিন ভাবে: Rafi plays. Does Rafi play? Rafi doesn't play. টুপি কোথায় গেল, প্রতিবার বলো।", en: "One sentence three ways: Rafi plays. Does Rafi play? Rafi doesn't play. Say where the hat went each time." } },
      ],
    },
  },
};
