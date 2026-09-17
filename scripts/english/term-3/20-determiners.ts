/* ============================================================
   20-determiners.ts: পর্ব ২০, some, any, much, many, few: পরিমাণের শব্দ.

   One part of the grammar term, gathered into the rung by
   `advanced.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>পর্ব ৪-এর <span lang="en">a, an, the</span> ছিল noun-এর আগে বসা প্রথম তিনটা ছোট শব্দ। তাদের একটা বড় পরিবার আছে, যারা সবাই noun-এর আগে বসে আর বলে দেয় কোনটা, কয়টা, কতটুকু, কার: <span lang="en">this, that, some, any, much, many, few, little, each, every, all, both</span>। এদের নাম <span lang="en">determiner</span>। পর্ব ২-এর গোনা যায়/যায় না ভাগটা এখানে ফিরে আসে, কারণ পরিবারের অর্ধেক শুধু একদলের সাথে বসে।</p>

<p>এই পর্বে পুরো পরিবারের ছক, <span lang="en">some/any</span>, <span lang="en">much/many</span>, সেই একটা <span lang="en">a</span> যেটা <span lang="en">few</span>-কে উল্টে দেয়, <span lang="en">each/every</span>, <span lang="en">all/both/either/neither</span>, <span lang="en">of</span>-এর সাথে বসার নিয়ম, আর <span lang="en">another / other / the other / others</span>, যেটা পরীক্ষায় প্রতি বছর একবার আসেই।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">some</span> হ্যাঁ-বাক্যে, <span lang="en">any</span> না-বাক্যে আর প্রশ্নে। <span lang="en">I have some. I don't have any. Do you have any?</span></li>
<li>গোনা যায়: <span lang="en">many, few, a few, several</span>। গোনা যায় না: <span lang="en">much, little, a little</span>। দুটোতেই: <span lang="en">a lot of, some, any, no</span>।</li>
<li><span lang="en">few</span> = প্রায় নেই (খারাপ)। <span lang="en">a few</span> = কিছু আছে (ভালো)। <span lang="en">little / a little</span>-তেও তাই।</li>
<li><span lang="en">each</span> = একটা একটা করে। <span lang="en">every</span> = সবাই, একদল হিসেবে। দুটোর পরেই একবচন।</li>
<li><span lang="en">this/that</span> একটা, <span lang="en">these/those</span> অনেক। কাছে <span lang="en">this</span>, দূরে <span lang="en">that</span>।</li>
<li><span lang="en">the, my, this</span>-এর আগে determiner বসলে মাঝে <span lang="en">of</span>: <span lang="en">some of the boys, all of my friends</span>।</li>
</ul>
</div>

${mount("determiners-pattern")}

<h2>পুরো পরিবার</h2>

<p>determiner সবাই একটা কাজ করে: noun-এর সামনে দাঁড়িয়ে বলে দেয় কোনটা বা কতটা। পরিবারে ছয়টা দল, আর noun-এর আগে সাধারণত এদের একজনই বসে: <span lang="en">the my bat</span> নয়, হয় <span lang="en">the bat</span>, নয় <span lang="en">my bat</span>।</p>

<div class="table-scroll">
<table>
<thead><tr><th>দল</th><th>শব্দ</th><th>কী বলে</th></tr></thead>
<tbody>
<tr><td><span lang="en">article</span></td><td><span lang="en">a, an, the</span></td><td>যেকোনো একটা, না নির্দিষ্ট (পর্ব ৪)</td></tr>
<tr><td>কাছে-দূরে</td><td><span lang="en">this, that, these, those</span></td><td>কোনটা, কোথায় (পর্ব ৩)</td></tr>
<tr><td>কার</td><td><span lang="en">my, your, his, her, its, our, their</span></td><td>মালিক (পর্ব ৩)</td></tr>
<tr><td>পরিমাণ</td><td><span lang="en">some, any, much, many, few, little, a lot of, no, enough</span></td><td>কতটা, কয়টা</td></tr>
<tr><td>সংখ্যা</td><td><span lang="en">one, two, first, second, last</span></td><td>কয়টা, কত নম্বর</td></tr>
<tr><td>ভাগ করে</td><td><span lang="en">each, every, either, neither, all, both, half</span></td><td>কীভাবে ভাগ</td></tr>
<tr><td>অন্য</td><td><span lang="en">another, other, the other</span></td><td>আরেকটা, বাকিটা</td></tr>
</tbody>
</table>
</div>

${mount("determiners-family")}

<h2>some আর any</h2>

<p>দুটোর মানে একই: কিছু, কয়েকটা। পার্থক্য বাক্যের ধরনে। হ্যাঁ-বাচক বাক্যে <span lang="en">some</span>: <span lang="en">There are some mangoes.</span> না-বাচক বাক্যে আর প্রশ্নে <span lang="en">any</span>: <span lang="en">There aren't any mangoes. Are there any mangoes?</span> একটা ব্যতিক্রম যেটা ভদ্রতার: কিছু দিতে বা চাইতে প্রশ্নেও <span lang="en">some</span>, কারণ উত্তর হ্যাঁ আশা করছ। <span lang="en">Would you like some tea? Can I have some water?</span></p>

<p><span lang="en">any</span>-র আরেকটা মানে হ্যাঁ-বাক্যে: "যেকোনো"। <span lang="en">Any student can join. Take any bat you like.</span> আর <span lang="en">if</span>-এর পরে <span lang="en">any</span>: <span lang="en">If you have any questions, ask.</span> এদের পরিবার একই নিয়ম মানে: <span lang="en">someone / anyone, something / anything, somewhere / anywhere</span>। <span lang="en">I saw someone. I did not see anyone. Did you see anyone?</span></p>

<h2>কয়টা আর কতটুকু</h2>

<p>গোনা যায় এমন জিনিসের সাথে <span lang="en">many</span>, গোনা যায় না এমন জিনিসের সাথে <span lang="en">much</span>। <span lang="en">How many runs? How much time?</span> কথায় হ্যাঁ-বাচক বাক্যে <span lang="en">much</span> কম শোনা যায়, তার জায়গায় <span lang="en">a lot of</span>: <span lang="en">We have a lot of time.</span> কিন্তু প্রশ্নে আর না-বাক্যে <span lang="en">much</span> স্বাভাবিক: <span lang="en">We don't have much time.</span></p>

<div class="table-scroll">
<table>
<thead><tr><th></th><th>গোনা যায় (runs, players)</th><th>গোনা যায় না (time, rice)</th></tr></thead>
<tbody>
<tr><td>অনেক</td><td><span lang="en">many, a lot of, lots of, plenty of</span></td><td><span lang="en">much, a lot of, lots of, plenty of</span></td></tr>
<tr><td>কিছু (ভালো অর্থে)</td><td><span lang="en">a few, several, some</span></td><td><span lang="en">a little, some</span></td></tr>
<tr><td>প্রায় নেই (খারাপ অর্থে)</td><td><span lang="en">few, hardly any</span></td><td><span lang="en">little, hardly any</span></td></tr>
<tr><td>যথেষ্ট</td><td><span lang="en">enough</span></td><td><span lang="en">enough</span></td></tr>
<tr><td>একদম নেই</td><td><span lang="en">no, not any</span></td><td><span lang="en">no, not any</span></td></tr>
</tbody>
</table>
</div>

${mount("determiners-lines")}

${mount("determiners-bins")}

<h2>few আর a few: একটা a-র দাম</h2>

<p>এটা এই পর্বের সবচেয়ে দামি লাইন। <span lang="en">Rafi has a few friends.</span> রাফির কয়েকজন বন্ধু আছে, ভালো, যথেষ্ট। <span lang="en">Rafi has few friends.</span> রাফির বন্ধু প্রায় নেই, খারাপ, একা। একটা <span lang="en">a</span> সরালে মানে উল্টে গেল। গোনা যায় না এমন জিনিসে একই খেলা: <span lang="en">We have a little time</span> (একটু আছে, চলবে) আর <span lang="en">We have little time</span> (প্রায় নেই, তাড়াতাড়ি করো)। মনে রাখার উপায়: <span lang="en">a</span> থাকলে আধা গ্লাস ভরা, না থাকলে আধা গ্লাস খালি।</p>

<p>বাক্যের সুরটাই বলে দেয় কোনটা। <span lang="en">Don't worry, I have a little money</span> (আশ্বাস)। <span lang="en">I'm sorry, I have little money</span> (দুঃখ)। <span lang="en">Only a few people came</span> মানে কম, কিন্তু <span lang="en">only</span> বলছে, <span lang="en">a few</span> নিজে নয়। <span lang="en">quite a few</span> মানে বেশ অনেক, উল্টো দিকে: <span lang="en">Quite a few people came.</span></p>

${mount("determiners-glass")}

${mount("determiners-reveal")}

<h2>each আর every</h2>

<p>দুটোই একবচন noun নেয় আর একবচন ক্রিয়া: <span lang="en">Each player has a number. Every player has a number.</span> পার্থক্য দৃষ্টিতে: <span lang="en">each</span> একটা একটা করে দেখে, <span lang="en">every</span> পুরো দলকে একসাথে। দুজনের ক্ষেত্রে শুধু <span lang="en">each</span>: <span lang="en">each hand</span>, <span lang="en">every hand</span> নয়। আর <span lang="en">every</span> সময়ের সাথে: <span lang="en">every day, every week</span>। <span lang="en">Everyone, everybody, everything</span> সবই একবচন: <span lang="en">Everyone is here.</span></p>

<p><span lang="en">each</span> একা দাঁড়াতে পারে, <span lang="en">every</span> পারে না: <span lang="en">The books cost ten taka each.</span> <span lang="en">Each of the boys</span> চলে, <span lang="en">every of the boys</span> নয়, বলতে হয় <span lang="en">every one of the boys</span>। আর <span lang="en">every</span> সংখ্যার সাথে: <span lang="en">every two hours, every third day</span>।</p>

${mount("determiners-gap")}

<h2>all, both, either, neither, আর of-এর নিয়ম</h2>

<p><span lang="en">all</span> সবাই (তিন বা বেশি), <span lang="en">both</span> দুজনেই (ঠিক দুই)। <span lang="en">All the players are ready. Both openers are left-handed.</span> <span lang="en">either</span> দুটোর যেকোনো একটা, <span lang="en">neither</span> দুটোর কোনোটাই না। <span lang="en">Either bat is fine. Neither bat is mine.</span> <span lang="en">either/neither</span>-এর পরে একবচন। <span lang="en">none</span> তিন বা বেশির কোনোটাই না: <span lang="en">None of the shops was open.</span></p>

<p><span lang="en">of</span>-এর নিয়ম, যেটা পরীক্ষায় লুকিয়ে আসে: noun-এর আগে যদি <span lang="en">the, my, this, these</span> থাকে, তাহলে পরিমাণের শব্দ আর সরাসরি বসে না, মাঝে <span lang="en">of</span>। <span lang="en">some boys</span> কিন্তু <span lang="en">some of the boys</span>; <span lang="en">most people</span> কিন্তু <span lang="en">most of my friends</span>; <span lang="en">each player</span> কিন্তু <span lang="en">each of these players</span>। <span lang="en">all</span> আর <span lang="en">both</span>-এ <span lang="en">of</span> থাকলেও চলে, না থাকলেও: <span lang="en">all the boys, all of the boys</span>। pronoun-এর সাথে সবসময় <span lang="en">of</span>: <span lang="en">some of them, none of us, both of you</span>।</p>

<div class="table-scroll">
<table>
<thead><tr><th>সরাসরি noun</th><th>the / my / these + noun</th><th>pronoun</th></tr></thead>
<tbody>
<tr><td><span lang="en">some boys</span></td><td><span lang="en">some of the boys</span></td><td><span lang="en">some of them</span></td></tr>
<tr><td><span lang="en">most people</span></td><td><span lang="en">most of my friends</span></td><td><span lang="en">most of us</span></td></tr>
<tr><td><span lang="en">each player</span></td><td><span lang="en">each of these players</span></td><td><span lang="en">each of them</span></td></tr>
<tr><td><span lang="en">all players</span></td><td><span lang="en">all (of) the players</span></td><td><span lang="en">all of them</span></td></tr>
<tr><td><span lang="en">no shop</span></td><td><span lang="en">none of the shops</span></td><td><span lang="en">none of them</span></td></tr>
</tbody>
</table>
</div>

<h2>another, other, the other, others</h2>

<p>চারটা শব্দ, চারটা ছবি, আর পরীক্ষার প্রিয় ফাঁদ। <span lang="en">another</span> = <span lang="en">an + other</span>, আরেকটা, যেকোনো একটা বাড়তি, একবচন: <span lang="en">Give me another mango.</span> <span lang="en">other</span> + বহুবচন noun, অন্যগুলো, অনির্দিষ্ট: <span lang="en">Other boys play football.</span> <span lang="en">the other</span> = বাকিটা, দুটোর মধ্যে দ্বিতীয়টা, নির্দিষ্ট: <span lang="en">One bat is mine; the other is Rafi's.</span> <span lang="en">others</span> = noun ছাড়া, অন্যরা: <span lang="en">Some like tea; others like coffee.</span> আর <span lang="en">the others</span> = বাকি সবাই: <span lang="en">Two boys left; the others stayed.</span></p>

<div class="table-scroll">
<table>
<thead><tr><th>শব্দ</th><th>মানে</th><th>পরে</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">another</span></td><td>আরেকটা, বাড়তি একটা</td><td>একবচন noun</td><td><span lang="en">Have another pitha.</span></td></tr>
<tr><td><span lang="en">other</span></td><td>অন্য, অনির্দিষ্ট</td><td>বহুবচন বা গোনা যায় না এমন noun</td><td><span lang="en">Other students agreed.</span></td></tr>
<tr><td><span lang="en">the other</span></td><td>বাকিটা, দ্বিতীয়টা</td><td>একবচন noun বা একা</td><td><span lang="en">Where is the other shoe?</span></td></tr>
<tr><td><span lang="en">others</span></td><td>অন্যরা</td><td>একা, noun ছাড়া</td><td><span lang="en">Some agreed; others did not.</span></td></tr>
<tr><td><span lang="en">the others</span></td><td>বাকি সবাই</td><td>একা</td><td><span lang="en">Rafi left; the others stayed.</span></td></tr>
</tbody>
</table>
</div>

${mount("determiners-other")}

<div class="ex"><b>Harry Potter-এর ছাঁচ:</b> <span lang="en">Every wizard needs a wand. Each wand chooses its wizard. Harry had few friends at the Dursleys' but a few very good ones at Hogwarts. He had little money as a boy and a lot of it later.</span> চার লাইনে পরিবারের প্রায় সবাই।</div>

${mount("determiners-of")}

${mount("determiners-build")}

${mount("determiners-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>determiner-এর প্রশ্ন সাধারণত <span lang="en">gap filling</span>: একটা অনুচ্ছেদ, খালি ঘর, নিচে তালিকা (<span lang="en">some, any, much, many, few, a few, little, a little, each, every, another, other</span>)। ধাপ:</p>

<ol class="step-list">
<li><strong>খালি ঘরের পরের noun-টা দেখো।</strong> বহুবচন বা গোনা যায়: <span lang="en">many, few, a few, several, these, both</span>। গোনা যায় না: <span lang="en">much, little, a little</span>। একবচন: <span lang="en">each, every, another, this</span>।</li>
<li><strong>বাক্যটা হ্যাঁ, না, না প্রশ্ন?</strong> না বা প্রশ্ন: <span lang="en">any</span>। হ্যাঁ: <span lang="en">some</span>। প্রস্তাবের প্রশ্ন: <span lang="en">some</span>।</li>
<li><strong>ভাবটা ভালো না খারাপ?</strong> আশ্বাস: <span lang="en">a few, a little</span>। দুঃখ: <span lang="en">few, little</span>।</li>
<li><strong>noun-এর আগে <span lang="en">the, my, these</span> আছে?</strong> তাহলে <span lang="en">of</span> লাগবে: <span lang="en">some of the</span>।</li>
<li><strong>দুটোর কথা না অনেকের?</strong> দুটো: <span lang="en">both, either, neither, the other</span>। অনেক: <span lang="en">all, none, the others</span>।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Rafi has (1) ___ friends, but not many. (2) ___ of them play cricket; (3) ___ prefer football. He does not have (4) ___ free time during exams, so he plays (5) ___ Friday only. (6) ___ player in his team has a nickname, and Rafi wants (7) ___ one.</span> উত্তর: (১) <span lang="en">a few</span> (আছে, ভালো); (২) <span lang="en">Some</span> (<span lang="en">of them</span>); (৩) <span lang="en">others</span> (অন্যরা); (৪) <span lang="en">much</span> (গোনা যায় না, না-বাক্য); (৫) <span lang="en">every</span> (সময়); (৬) <span lang="en">Every</span> বা <span lang="en">Each</span> (একবচন noun); (৭) <span lang="en">another</span> (আরেকটা)। সাত ঘর, পাঁচ ধাপ।</div>

${mount("determiners-exam")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>শূন্যস্থানের পরের noun-টা দেখো: <span lang="en">-s</span> আছে বা গোনা যায়? তাহলে <span lang="en">many, few, a few, these, those, both, several</span>। <span lang="en">-s</span> নেই আর গোনা যায় না (<span lang="en">water, money, time, information</span>)? তাহলে <span lang="en">much, little, a little</span>। বাক্যে <span lang="en">not</span> বা <span lang="en">?</span> আছে? <span lang="en">any</span>। বাক্যের ভাবটা ভালো না খারাপ? ভালো হলে <span lang="en">a few / a little</span>, খারাপ হলে <span lang="en">few / little</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">every</span>-র পরে বহুবচন নয়। <span lang="en">Every students are</span> ভুল; <span lang="en">Every student is</span> ঠিক। বাংলায় "প্রত্যেক ছাত্ররা" শুনতে বেঠিক লাগে, তবু ইংরেজিতে লেখার সময় <span lang="en">-s</span> চলে আসে। আর <span lang="en">much</span>-এর পরে কখনো বহুবচন নয়: <span lang="en">much people</span> ভুল, <span lang="en">many people</span> ঠিক।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p><span lang="en">another</span> এক শব্দে, আর সবসময় একবচন: <span lang="en">another books</span> ভুল, <span lang="en">other books</span> ঠিক। <span lang="en">an other</span> বলে কিছু নেই। আর <span lang="en">the others</span> মানে বাকি সবাই, <span lang="en">others</span> মানে অন্য কেউ কেউ: <span lang="en">Some left early, others stayed till the end</span> (কেউ কেউ), <span lang="en">Rafi left early, the others stayed</span> (রাফি ছাড়া সবাই)।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>পরিবারের সাত দল, প্রতিটার দুটো শব্দ?</li>
<li><span lang="en">some</span> আর <span lang="en">any</span>: তিন নিয়ম, একটা ব্যতিক্রম?</li>
<li><span lang="en">few / a few / little / a little</span>: চারটার ছবি?</li>
<li><span lang="en">each</span> আর <span lang="en">every</span>-র পার্থক্য এক বাক্যে?</li>
<li>কখন <span lang="en">of</span> লাগে?</li>
<li><span lang="en">another, other, the other, others</span>: চারটা উদাহরণ?</li>
</ul>
</div>

${mount("determiners-drill")}
`,
  blocks: {
    "determiners-pattern": {
      kind: "pattern",
      title: { bn: "কয়টা, কতটুকু", en: "How many, how much" },
      shape: "many / few / a few + PLURAL   ·   much / little / a little + UNCOUNTABLE",
      why: { bn: "পর্ব ২-এর ভাগটাই এখানে নিয়ম: গোনা যায় এমন জিনিসের সাথে many আর few, গোনা যায় না এমন জিনিসের সাথে much আর little। আর a-টা ভাব বদলায়: a few মানে আছে, few মানে প্রায় নেই।", en: "The split from part 2 is the rule here: countable things take many and few, uncountable things take much and little. The a changes the mood: a few means some, few means hardly any." },
      examples: [
        { target: "How many runs did he score? How much time is left?", bn: "সে কত রান করল? কতটুকু সময় বাকি?" },
        { target: "I have a few friends and a little money.", bn: "আমার কয়েকজন বন্ধু আর একটু টাকা আছে। (যথেষ্ট)" },
        { target: "He has few friends and little money.", bn: "তার বন্ধু প্রায় নেই, টাকাও প্রায় নেই। (খারাপ)" },
        { target: "There are some mangoes, but there isn't any rice.", bn: "কিছু আম আছে, কিন্তু চাল নেই।" },
        { target: "Every player has a number. Each number is different.", bn: "প্রতিটা খেলোয়াড়ের একটা নম্বর আছে। প্রতিটা নম্বর আলাদা।" },
      ],
      tip: { bn: "a থাকলে আধা গ্লাস ভরা, না থাকলে আধা গ্লাস খালি।", en: "With a, the glass is half full; without it, half empty." },
    },
    "determiners-family": {
      kind: "figure",
      shape: "tree",
      title: { bn: "noun-এর সামনের পরিবার", en: "The family that stands before a noun" },
      screen: { title: { bn: "determiner: কোনটা, কয়টা, কার", en: "determiner: which, how many, whose" } },
      parts: [
        { text: { bn: "article: a, an, the", en: "article: a, an, the" }, note: { bn: "যেকোনো একটা, না নির্দিষ্ট", en: "any one, or a definite one" }, tone: "lead" },
        { text: { bn: "কাছে-দূরে: this, that, these, those", en: "pointing: this, that, these, those" }, note: { bn: "কোনটা, কোথায়", en: "which one, where" } },
        { text: { bn: "কার: my, your, his, her, our, their", en: "owner: my, your, his, her, our, their" }, note: { bn: "মালিক", en: "the owner" } },
        { text: { bn: "পরিমাণ: some, any, much, many, few, little", en: "quantity: some, any, much, many, few, little" }, note: { bn: "কতটা, কয়টা", en: "how much, how many" }, tone: "good" },
        { text: { bn: "ভাগ: each, every, all, both, either, neither", en: "sharing: each, every, all, both, either, neither" }, note: { bn: "কীভাবে ভাগ", en: "how it is shared out" } },
        { text: { bn: "অন্য: another, other, the other", en: "other: another, other, the other" }, note: { bn: "আরেকটা, বাকিটা", en: "one more, the rest" } },
      ],
      caption: { bn: "noun-এর আগে সাধারণত এদের একজনই বসে: the my bat নয়।", en: "Usually only one of them stands before a noun: never the my bat." },
    },
    "determiners-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: some আর any", en: "Listen, say: some and any" },
      lines: [
        { target: "There is some milk in the fridge.", bn: "ফ্রিজে কিছু দুধ আছে।" },
        { target: "There isn't any milk in the fridge.", bn: "ফ্রিজে কোনো দুধ নেই।" },
        { target: "Is there any milk in the fridge?", bn: "ফ্রিজে কি দুধ আছে?" },
        { target: "Would you like some milk?", bn: "একটু দুধ নেবে? (দিচ্ছি, তাই some)" },
        { target: "We don't have much time, so hurry.", bn: "আমাদের সময় বেশি নেই, তাই তাড়াতাড়ি করো।" },
        { target: "Both teams played well, but neither side won.", bn: "দুই দলই ভালো খেলল, কিন্তু কোনো দলই জিতল না।" },
        { target: "Some of my friends like tea; others prefer coffee.", bn: "আমার কিছু বন্ধু চা পছন্দ করে; অন্যরা কফি।" },
      ],
    },
    "determiners-bins": {
      kind: "bins",
      title: { bn: "কার সাথে কে", en: "Who goes with whom" },
      note: { bn: "প্রতিটা determiner ঠিক ঘরে।", en: "Each determiner in its right box." },
      bins: [
        { id: "count", label: { bn: "শুধু গোনা যায় (books)", en: "countable only" } },
        { id: "mass", label: { bn: "শুধু গোনা যায় না (rice)", en: "uncountable only" } },
        { id: "both", label: { bn: "দুটোতেই", en: "both" } },
      ],
      items: [
        { text: { bn: "many", en: "many" }, bin: "count", why: { bn: "many books, কখনো many rice নয়।", en: "Many books, never many rice." } },
        { text: { bn: "much", en: "much" }, bin: "mass", why: { bn: "much rice, কখনো much books নয়।", en: "Much rice, never much books." } },
        { text: { bn: "a few", en: "a few" }, bin: "count", why: { bn: "a few books।", en: "A few books." } },
        { text: { bn: "a little", en: "a little" }, bin: "mass", why: { bn: "a little rice।", en: "A little rice." } },
        { text: { bn: "some", en: "some" }, bin: "both", why: { bn: "some books, some rice: দুটোই।", en: "Some books, some rice: both." } },
        { text: { bn: "a lot of", en: "a lot of" }, bin: "both", why: { bn: "a lot of books, a lot of rice।", en: "A lot of books, a lot of rice." } },
        { text: { bn: "several", en: "several" }, bin: "count", why: { bn: "several books।", en: "Several books." } },
        { text: { bn: "no", en: "no" }, bin: "both", why: { bn: "no books, no rice।", en: "No books, no rice." } },
        { text: { bn: "enough", en: "enough" }, bin: "both", why: { bn: "enough books, enough rice।", en: "Enough books, enough rice." } },
        { text: { bn: "each", en: "each" }, bin: "count", why: { bn: "each book, একবচন; each rice হয় না।", en: "Each book, singular; each rice is impossible." } },
        { text: { bn: "plenty of", en: "plenty of" }, bin: "both", why: { bn: "plenty of books, plenty of rice।", en: "Plenty of books, plenty of rice." } },
      ],
    },
    "determiners-glass": {
      kind: "compare",
      title: { bn: "few, a few, little, a little", en: "Few, a few, little, a little" },
      note: { bn: "একটা a আর একটা s-এর খেলা।", en: "A game of one a and one s." },
      columns: [
        { bn: "few", en: "few" },
        { bn: "a few", en: "a few" },
        { bn: "little", en: "little" },
        { bn: "a little", en: "a little" },
      ],
      rows: [
        { label: { bn: "কার সাথে", en: "Goes with" }, cells: [{ bn: "গোনা যায়", en: "countable" }, { bn: "গোনা যায়", en: "countable" }, { bn: "গোনা যায় না", en: "uncountable" }, { bn: "গোনা যায় না", en: "uncountable" }] },
        { label: { bn: "গ্লাস", en: "The glass" }, cells: [{ bn: "আধা খালি: প্রায় নেই", en: "half empty: hardly any" }, { bn: "আধা ভরা: কিছু আছে", en: "half full: some" }, { bn: "আধা খালি: প্রায় নেই", en: "half empty: hardly any" }, { bn: "আধা ভরা: একটু আছে", en: "half full: some" }] },
        { label: { bn: "সুর", en: "Tone" }, cells: [{ bn: "দুঃখ", en: "regret" }, { bn: "আশ্বাস", en: "reassurance" }, { bn: "দুঃখ", en: "regret" }, { bn: "আশ্বাস", en: "reassurance" }] },
        { label: { bn: "উদাহরণ", en: "Example" }, cells: [{ bn: "He has few friends.", en: "He has few friends." }, { bn: "He has a few friends.", en: "He has a few friends." }, { bn: "We have little time.", en: "We have little time." }, { bn: "We have a little time.", en: "We have a little time." }] },
        { label: { bn: "কাছাকাছি", en: "Close to" }, cells: [{ bn: "hardly any, not many", en: "hardly any, not many" }, { bn: "some, several", en: "some, several" }, { bn: "hardly any, not much", en: "hardly any, not much" }, { bn: "some, a bit of", en: "some, a bit of" }] },
      ],
    },
    "determiners-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: কে বেশি খুশি?", en: "Guess first: who is happier?" },
      ask: { bn: "রাফি বলল, I have a few friends here. মিতু বলল, I have few friends here. কে নতুন স্কুলে বেশি খুশি?", en: "Rafi said, I have a few friends here. Mitu said, I have few friends here. Who is happier at the new school?" },
      choices: [
        { bn: "রাফি", en: "Rafi" },
        { bn: "মিতু", en: "Mitu" },
        { bn: "দুজনেই সমান", en: "Both the same" },
      ],
      answer: { bn: "রাফি। a few মানে কয়েকজন আছে, যথেষ্ট। few মানে প্রায় নেই, একা।", en: "Rafi. A few means some, enough. Few means hardly any, lonely." },
      why: { bn: "একটা a পুরো সুরটা বদলে দেয়। a few বলে আধা গ্লাস ভরা: আছে, চলছে। few বলে আধা গ্লাস খালি: নেই বললেই চলে। বাংলায় দুটোই 'কয়েকজন' হয়ে যায়, তাই বাংলাভাষী এখানে মানে না বুঝেই a ফেলে দেয় বা বসায়। little আর a little-এ একই গল্প: We have little time মানে তাড়াতাড়ি করো, We have a little time মানে শান্ত হও।", en: "One a changes the whole tone. A few says the glass is half full: there are some, things are fine. Few says half empty: as good as none. Bangla turns both into the same word, so Bangla speakers drop or add the a without hearing the difference. Little and a little tell the same story: We have little time means hurry, We have a little time means relax." },
    },
    "determiners-gap": {
      kind: "gap",
      title: { bn: "কোন পরিমাণ", en: "Which quantity" },
      items: [
        { text: "How ___ sugar do you take in your tea?", bn: "চায়ে তুমি কতটুকু চিনি খাও?", options: ["many", "much", "few"], right: 1, why: { bn: "sugar গোনা যায় না: much।", en: "Sugar is uncountable: much." } },
        { text: "There are ___ people at the ground today.", bn: "আজ মাঠে অনেক মানুষ।", options: ["much", "many", "little"], right: 1, why: { bn: "people অনেকজন, গোনা যায়: many। much people বলে কিছু নেই।", en: "People are many and countable: many. Much people does not exist." } },
        { text: "Hurry! We have ___ time.", bn: "তাড়াতাড়ি! আমাদের সময় প্রায় নেই।", options: ["a little", "little", "few"], right: 1, why: { bn: "time গোনা যায় না, আর ভাবটা খারাপ, প্রায় নেই: little।", en: "Time is uncountable and the mood is bad, hardly any: little." } },
        { text: "Don't worry, I have ___ friends who can help.", bn: "চিন্তা কোরো না, আমার কয়েকজন বন্ধু আছে যারা সাহায্য করতে পারে।", options: ["few", "a few", "little"], right: 1, why: { bn: "friends গোনা যায়, ভাব ভালো, আছে: a few।", en: "Friends are countable and the mood is good, there are some: a few." } },
        { text: "I don't have ___ money with me.", bn: "আমার সাথে কোনো টাকা নেই।", options: ["some", "any", "many"], right: 1, why: { bn: "না-বাচক বাক্য: any।", en: "A negative sentence: any." } },
        { text: "___ student must bring a pen.", bn: "প্রত্যেক ছাত্রকে কলম আনতে হবে।", options: ["Every", "All", "Many"], right: 0, why: { bn: "student একবচন, must: Every student। All হলে students লাগত।", en: "Student is singular with must: Every student. All would need students." } },
        { text: "Would you like ___ more rice?", bn: "আরেকটু ভাত নেবে?", options: ["some", "any", "few"], right: 0, why: { bn: "প্রস্তাবের প্রশ্ন, উত্তর হ্যাঁ আশা: some।", en: "An offer, expecting yes: some." } },
        { text: "The twins look alike, but ___ of them has a different voice.", bn: "যমজ দুজন দেখতে এক, কিন্তু প্রত্যেকের গলা আলাদা।", options: ["every", "each", "all"], right: 1, why: { bn: "দুজন, একটা একটা করে: each। every দুজনে বসে না।", en: "Two people, one at a time: each. Every does not work for two." } },
      ],
    },
    "determiners-other": {
      kind: "match",
      title: { bn: "another, other, the other, others", en: "Another, other, the other, others" },
      note: { bn: "বাঁ দিকের খালি জায়গায় ডান দিকের কোন শব্দ বসবে, মেলাও।", en: "Match each gap on the left with the word that fills it on the right." },
      pairs: [
        { left: { bn: "This pitha is delicious. Can I have ___ one?", en: "This pitha is delicious. Can I have ___ one?" }, right: { bn: "another (আরেকটা)", en: "another (one more)" } },
        { left: { bn: "One shoe is here; where is ___?", en: "One shoe is here; where is ___?" }, right: { bn: "the other (বাকিটা, দ্বিতীয়টা)", en: "the other (the remaining one of two)" } },
        { left: { bn: "Some students like maths; ___ prefer English.", en: "Some students like maths; ___ prefer English." }, right: { bn: "others (অন্যরা)", en: "others (other ones)" } },
        { left: { bn: "Rafi left early, but ___ stayed till the end.", en: "Rafi left early, but ___ stayed till the end." }, right: { bn: "the others (বাকি সবাই)", en: "the others (all the rest)" } },
        { left: { bn: "___ students in the class agreed with Mitu.", en: "___ students in the class agreed with Mitu." }, right: { bn: "Other (অন্য কিছু ছাত্র)", en: "Other (some other students)" } },
        { left: { bn: "He lives on ___ side of the river.", en: "He lives on ___ side of the river." }, right: { bn: "the other (ওপারে, দুই পারের দ্বিতীয়টা)", en: "the other (the far side of two)" } },
      ],
    },
    "determiners-of": {
      kind: "gap",
      title: { bn: "of লাগবে কি না", en: "Does it need of" },
      note: { bn: "noun-এর আগে the, my, these বা একটা pronoun থাকলে মাঝে of।", en: "With the, my, these or a pronoun before the noun, of goes in between." },
      items: [
        { text: "___ my friends play cricket.", bn: "আমার বেশিরভাগ বন্ধু ক্রিকেট খেলে।", options: ["Most", "Most of", "The most"], right: 1, why: { bn: "my আছে: most of my friends।", en: "My is there: most of my friends." } },
        { text: "___ students need a pen.", bn: "সব ছাত্রের একটা কলম লাগে।", options: ["All of", "All", "Every"], right: 1, why: { bn: "সরাসরি noun, the নেই: all students। every হলে student হতো।", en: "A bare noun with no the: all students. Every would need student." } },
        { text: "___ them were late this morning.", bn: "তাদের কেউই আজ সকালে দেরি করেনি।", options: ["None of", "None", "No"], right: 0, why: { bn: "pronoun-এর সাথে সবসময় of: none of them।", en: "Always of with a pronoun: none of them." } },
        { text: "___ the two bats is yours?", bn: "দুটো ব্যাটের কোনটা তোমার?", options: ["Which of", "Which", "What"], right: 0, why: { bn: "the two bats-এর আগে: which of the two।", en: "Before the two bats: which of the two." } },
        { text: "___ these mangoes is ripe.", bn: "এই আমগুলোর প্রতিটা পাকা।", options: ["Every", "Each of", "Each"], right: 1, why: { bn: "these আছে: each of these mangoes, আর ক্রিয়া একবচন is।", en: "These is there: each of these mangoes, with singular is." } },
        { text: "___ the players were tired after the match.", bn: "ম্যাচের পর দুই খেলোয়াড়ই ক্লান্ত ছিল।", options: ["Both of", "Both", "Either"], right: 0, why: { bn: "the players-এর আগে both of; both the players-ও চলে, কিন্তু both players নয় এখানে।", en: "Before the players: both of; both the players also passes, but not both players here." } },
      ],
    },
    "determiners-build": {
      kind: "build",
      title: { bn: "পরিমাণ বসিয়ে সাজাও", en: "Build it with the quantity in place" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো determiner-টা তার noun-এর ঠিক আগে গেল কি না।", en: "The words are shuffled. As you build, check the determiner lands right before its noun." },
      pattern: "determiner + noun + verb + rest",
      lines: [
        { target: "There is some milk in the fridge.", bn: "ফ্রিজে কিছু দুধ আছে।" },
        { target: "We do not have much time before the exam.", bn: "পরীক্ষার আগে আমাদের সময় বেশি নেই।" },
        { target: "Rafi has a few good friends at school.", bn: "স্কুলে রাফির কয়েকজন ভালো বন্ধু আছে।" },
        { target: "Every player in the team has a nickname.", bn: "দলের প্রতিটা খেলোয়াড়ের একটা ডাকনাম আছে।" },
        { target: "Some of my cousins live in Sylhet.", bn: "আমার কিছু কাজিন সিলেটে থাকে।" },
        { target: "One bat is mine and the other is Rafi's.", bn: "একটা ব্যাট আমার আর অন্যটা রাফির।" },
      ],
    },
    "determiners-spot": {
      kind: "spot",
      title: { bn: "রাফির অনুচ্ছেদ, পরিমাণের ভুল", en: "Rafi's paragraph: the quantity mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে determiner-এর ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line with a determiner mistake." },
      source: { bn: "অনুচ্ছেদ: আমাদের ক্লাস", en: "Paragraph: our class" },
      lines: [
        { text: { bn: "There are forty students in our class, and every student has a story.", en: "There are forty students in our class, and every student has a story." } },
        { text: { bn: "Much students come from the villages near the town.", en: "Much students come from the villages near the town." }, flag: { bn: "students গোনা যায়: Many students।", en: "Students are countable: Many students." } },
        { text: { bn: "Some of them walk to school; others come by bus.", en: "Some of them walk to school; others come by bus." } },
        { text: { bn: "We don't have some computers, but we have a library.", en: "We don't have some computers, but we have a library." }, flag: { bn: "না-বাচক বাক্যে any: don't have any computers।", en: "A negative sentence takes any: don't have any computers." } },
        { text: { bn: "Every students likes our English teacher.", en: "Every students likes our English teacher." }, flag: { bn: "every + একবচন: Every student likes।", en: "Every + singular: Every student likes." } },
        { text: { bn: "She gives us a little homework, so we have a few time to play.", en: "She gives us a little homework, so we have a few time to play." }, flag: { bn: "time গোনা যায় না: a little time।", en: "Time is uncountable: a little time." } },
        { text: { bn: "Most of us want to be doctors, but I want to be another thing: a cricketer.", en: "Most of us want to be doctors, but I want to be another thing: a cricketer." }, flag: { bn: "এখানে 'অন্য কিছু': something else, বা something different। another thing শুনতে বাড়তি একটা জিনিস।", en: "Here the sense is something else, or something different. Another thing sounds like one more thing." } },
      ],
    },
    "determiners-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Which sentence means the speaker is sad about it?", en: "Which sentence means the speaker is sad about it?" },
          options: [
            { text: { bn: "I have a little money left.", en: "I have a little money left." }, why: { bn: "না। a little আশ্বাস: একটু আছে।", en: "No. A little reassures: there is some." } },
            { text: { bn: "I have little money left.", en: "I have little money left." }, right: true, why: { bn: "হ্যাঁ। little মানে প্রায় নেই, দুঃখের সুর।", en: "Yes. Little means hardly any, a note of regret." } },
            { text: { bn: "I have a lot of money left.", en: "I have a lot of money left." }, why: { bn: "না। অনেক আছে।", en: "No. There is plenty." } },
          ],
        },
        {
          ask: { bn: "Nanu has two sons. One is a doctor, and ___ is a teacher.", en: "Nanu has two sons. One is a doctor, and ___ is a teacher." },
          options: [
            { text: { bn: "another", en: "another" }, why: { bn: "না। another মানে আরেকটা, তৃতীয় কেউ। দুজনের দ্বিতীয়টা the other।", en: "No. Another means one more, a third person. The second of two is the other." } },
            { text: { bn: "the other", en: "the other" }, right: true, why: { bn: "হ্যাঁ। দুজনের বাকিটা: the other।", en: "Yes. The remaining one of two: the other." } },
            { text: { bn: "other", en: "other" }, why: { bn: "না। other একা দাঁড়ায় না, পরে noun লাগে; একা হলে the other বা others।", en: "No. Other cannot stand alone; it needs a noun, or becomes the other or others." } },
          ],
        },
        {
          ask: { bn: "___ of the students has finished, so we must wait.", en: "___ of the students has finished, so we must wait." },
          options: [
            { text: { bn: "None", en: "None" }, right: true, why: { bn: "হ্যাঁ। কেউই না, তাই অপেক্ষা; none of + the, আর has একবচন চলে।", en: "Yes. Not one of them, so we wait; none of + the, and singular has passes." } },
            { text: { bn: "Neither", en: "Neither" }, why: { bn: "না। neither শুধু দুজনের জন্য; ছাত্র অনেক।", en: "No. Neither is for two; there are many students." } },
            { text: { bn: "No", en: "No" }, why: { bn: "না। of-এর আগে none, no নয়: no students, কিন্তু none of the students।", en: "No. Before of it is none, not no: no students, but none of the students." } },
          ],
        },
        {
          ask: { bn: "Do you have ___ questions? If you have ___, ask now.", en: "Do you have ___ questions? If you have ___, ask now." },
          options: [
            { text: { bn: "some, some", en: "some, some" }, why: { bn: "না। প্রশ্নে আর if-এর পরে any।", en: "No. A question and an if clause both take any." } },
            { text: { bn: "any, any", en: "any, any" }, right: true, why: { bn: "হ্যাঁ। প্রশ্ন: any; if-এর পরে: any।", en: "Yes. A question: any; after if: any." } },
            { text: { bn: "any, some", en: "any, some" }, why: { bn: "না। if-এর পরে any: If you have any।", en: "No. After if comes any: If you have any." } },
          ],
        },
      ],
    },
    "determiners-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "ফ্রিজ খুলে পাঁচ বাক্য: There is some… There isn't any… There are a few…", en: "Open the fridge and say five sentences: There is some… There isn't any… There are a few…" } },
        { text: { bn: "নিজের সম্পর্কে দুই জোড়া: I have a few… / I have few… I have a little… / I have little…", en: "Two pairs about yourself: I have a few… / I have few… I have a little… / I have little…" } },
        { text: { bn: "ক্লাসের নিয়ম every দিয়ে তিনটা, একবচন ক্রিয়া সহ: Every student has…", en: "Three class rules with every and a singular verb: Every student has…" } },
        { text: { bn: "নিজের বন্ধুদের নিয়ে of দিয়ে চারটা: Some of my friends… Most of them… None of us… Both of…", en: "Four about your friends with of: Some of my friends… Most of them… None of us… Both of…" } },
        { text: { bn: "চারটা শব্দ চারটা বাক্যে জোরে: another, other, the other, others।", en: "The four words in four sentences aloud: another, other, the other, others." } },
        { text: { bn: "বাজারের তালিকা much/many দিয়ে প্রশ্ন করে: How much rice? How many eggs?", en: "A shopping list as questions with much and many: How much rice? How many eggs?" } },
      ],
    },
  },
};
