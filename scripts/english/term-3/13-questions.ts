/* ============================================================
   13-questions.ts: পর্ব ১৩, প্রশ্ন বানানোর মেশিন, আর tag question.

   One part of the grammar term, gathered into the rung by
   `middle.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>যে মানুষ প্রশ্ন করতে পারে, সে যেকোনো জায়গায় যেকোনো কিছু শিখে নিতে পারে। কিন্তু বাংলাভাষীর ইংরেজি প্রশ্নে একটা পুরনো সমস্যা: বাংলায় প্রশ্ন করতে শুধু সুর বদলালেই হয়, "তুমি খেয়েছ?" ইংরেজিতে শব্দ নাড়াতে হয়। পর্ব ১০-এ চার জাতের বাক্যে সেটা এক ঝলক দেখেছ। এই পর্বে পুরো প্রশ্ন-মেশিনটা খুলে দেখা, আর বাক্যের শেষের সেই ছোট্ট লেজ: <span lang="en">isn't it?</span></p>

<p>মেশিনটা দুটো, wh-চাবি বারোটা, ছোট উত্তরের একটা ছক, না-বাচক প্রশ্নের একটা ফাঁদ, পরোক্ষ প্রশ্নের একটা নিয়ম, আর লেজের চার ধাপ। সবগুলো এক পর্বে, কারণ পরীক্ষায় <span lang="en">making questions</span> আর <span lang="en">tag questions</span> দুটো আলাদা প্রশ্ন, আর জীবনে প্রতিটা কথোপকথন একটা প্রশ্ন দিয়ে শুরু।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>সাহায্যকারী থাকলে (<span lang="en">be, have, can, will</span>…), তাকে কর্তার আগে নাও: <span lang="en">She is ready. Is she ready?</span></li>
<li>সাহায্যকারী না থাকলে সামনে <span lang="en">do / does / did</span> বসাও, আর মূল ক্রিয়া খালি: <span lang="en">She plays. Does she play?</span></li>
<li>wh-প্রশ্নে wh-শব্দ সবার আগে, তারপর একই মেশিন: <span lang="en">Where does she play?</span></li>
<li>wh-শব্দটা নিজেই কর্তা হলে মেশিন লাগে না: <span lang="en">Who called you?</span></li>
<li>ছোট উত্তরে সাহায্যকারীটাই ফিরে আসে: <span lang="en">Does she play? Yes, she does.</span></li>
<li>tag question: বাক্য হ্যাঁ হলে লেজ না, বাক্য না হলে লেজ হ্যাঁ। <span lang="en">It is hot, isn't it? It isn't hot, is it?</span></li>
</ul>
</div>

${mount("questions-pattern")}

<h2>প্রথম মেশিন: উল্টে দাও</h2>

<p>বাক্যে যদি আগে থেকেই একটা সাহায্যকারী থাকে, <span lang="en">am, is, are, was, were, have, has, had, can, could, will, would, should, must</span>, তাহলে কাজ একটাই: সাহায্যকারীটা কর্তার আগে নিয়ে যাও। <span lang="en">Rafi is playing. Is Rafi playing? They have eaten. Have they eaten? You can swim. Can you swim?</span> আর কিছুই বদলায় না। শেষে প্রশ্নবোধক।</p>

<h2>দ্বিতীয় মেশিন: do বসাও</h2>

<p>বাক্যে সাহায্যকারী না থাকলে, শুধু একটা সাধারণ ক্রিয়া, তাহলে সামনে একটা <span lang="en">do</span> বসে, আর মূল ক্রিয়া তার টুপি বা <span lang="en">-ed</span> খুলে দেয়। বর্তমানে <span lang="en">do</span>, একজন হলে <span lang="en">does</span>, অতীতে <span lang="en">did</span>। <span lang="en">Rafi plays. Does Rafi play? They played. Did they play? You like tea. Do you like tea?</span> টুপি একটাই: <span lang="en">does</span> পরেছে, তাই <span lang="en">play</span> খালি। <span lang="en">Does he plays?</span> বাংলাভাষীর প্রিয় ভুল, দুই টুপি।</p>

<div class="table-scroll">
<table>
<thead><tr><th>বাক্যে আছে</th><th>মেশিন</th><th>বলা</th><th>প্রশ্ন</th></tr></thead>
<tbody>
<tr><td><span lang="en">am, is, are, was, were</span></td><td>উল্টাও</td><td><span lang="en">Mitu is tired.</span></td><td><span lang="en">Is Mitu tired?</span></td></tr>
<tr><td><span lang="en">have, has, had</span> + V3</td><td>উল্টাও</td><td><span lang="en">They have left.</span></td><td><span lang="en">Have they left?</span></td></tr>
<tr><td><span lang="en">can, will, must, should</span></td><td>উল্টাও</td><td><span lang="en">Rafi can bowl.</span></td><td><span lang="en">Can Rafi bowl?</span></td></tr>
<tr><td>সাধারণ ক্রিয়া, বর্তমান, অনেক</td><td><span lang="en">Do</span> + খালি</td><td><span lang="en">They play.</span></td><td><span lang="en">Do they play?</span></td></tr>
<tr><td>সাধারণ ক্রিয়া, বর্তমান, একজন</td><td><span lang="en">Does</span> + খালি</td><td><span lang="en">Nanu likes tea.</span></td><td><span lang="en">Does Nanu like tea?</span></td></tr>
<tr><td>সাধারণ ক্রিয়া, অতীত</td><td><span lang="en">Did</span> + খালি</td><td><span lang="en">Rafi went home.</span></td><td><span lang="en">Did Rafi go home?</span></td></tr>
<tr><td><span lang="en">have</span> মালিকানা অর্থে</td><td><span lang="en">Do</span> (আজকাল)</td><td><span lang="en">You have a bat.</span></td><td><span lang="en">Do you have a bat?</span></td></tr>
</tbody>
</table>
</div>

<p>শেষ সারিটা একটা ফাঁদ: <span lang="en">have</span> যখন সাহায্যকারী (<span lang="en">have eaten</span>), তখন উল্টাও; যখন মালিকানার ক্রিয়া (<span lang="en">have a bat</span>), তখন সাধারণ ক্রিয়ার মতো <span lang="en">do</span>। <span lang="en">Have you a bat?</span> পুরনো বইয়ের ইংরেজি; আজ <span lang="en">Do you have a bat?</span></p>

${mount("questions-lines")}

${mount("questions-machine")}

<h2>বারোটা চাবি: wh-শব্দ</h2>

<p><span lang="en">what</span> (কী), <span lang="en">who</span> (কে), <span lang="en">where</span> (কোথায়), <span lang="en">when</span> (কখন), <span lang="en">why</span> (কেন), <span lang="en">how</span> (কীভাবে)। আর কয়েকটা জোড়া: <span lang="en">which</span> (কোনটা), <span lang="en">whose</span> (কার), <span lang="en">how many</span> (কয়টা), <span lang="en">how much</span> (কতটুকু), <span lang="en">how long</span> (কতক্ষণ), <span lang="en">how often</span> (কত ঘন ঘন)। ছাঁচ: <strong>wh-শব্দ + সাহায্যকারী + কর্তা + ক্রিয়া</strong>। <span lang="en">Where does Rafi play? When did Nanu come? Why are you late? How long have you waited?</span></p>

<div class="table-scroll">
<table>
<thead><tr><th>চাবি</th><th>জিজ্ঞেস করে</th><th>উত্তরে থাকে</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">what</span></td><td>কী, কোন জিনিস</td><td>একটা জিনিস বা কাজ</td><td><span lang="en">What did you eat? Rice.</span></td></tr>
<tr><td><span lang="en">which</span></td><td>কোনটা, অল্প কয়টার মধ্যে</td><td>একটা বাছাই</td><td><span lang="en">Which bat is yours? The red one.</span></td></tr>
<tr><td><span lang="en">who / whom</span></td><td>কে / কাকে</td><td>একজন মানুষ</td><td><span lang="en">Who called? Rafi. Whom did you call? Rafi.</span></td></tr>
<tr><td><span lang="en">whose</span></td><td>কার</td><td>একটা মালিক</td><td><span lang="en">Whose bat is this? Mitu's.</span></td></tr>
<tr><td><span lang="en">where / when / why</span></td><td>কোথায় / কখন / কেন</td><td>জায়গা / সময় / কারণ</td><td><span lang="en">Why are you late? Because of the rain.</span></td></tr>
<tr><td><span lang="en">how</span></td><td>কীভাবে, কেমন</td><td>উপায় বা অবস্থা</td><td><span lang="en">How do you go to school? By bus.</span></td></tr>
<tr><td><span lang="en">how many / much</span></td><td>কয়টা / কতটুকু</td><td>সংখ্যা / পরিমাণ</td><td><span lang="en">How many runs? Fifty. How much rice? A kilo.</span></td></tr>
<tr><td><span lang="en">how long / often / far / old</span></td><td>কতক্ষণ / কতবার / কত দূর / কত বয়স</td><td>সময় / ঘন ঘন / দূরত্ব / বয়স</td><td><span lang="en">How long is the match? Three hours.</span></td></tr>
</tbody>
</table>
</div>

<p>প্রশ্ন বানানোর কৌশল উল্টো দিক থেকে: উত্তরটা দেখো, তারপর চাবি বাছো। উত্তরে জায়গা থাকলে <span lang="en">where</span>, সময় থাকলে <span lang="en">when</span>, <span lang="en">because</span> থাকলে <span lang="en">why</span>, সংখ্যা থাকলে <span lang="en">how many</span>। পরীক্ষায় <span lang="en">make questions so that the underlined words are the answer</span>: দাগ দেওয়া শব্দটা কী, সেটাই চাবি।</p>

${mount("questions-keys")}

<h2>কর্তার প্রশ্ন, কর্মের প্রশ্ন</h2>

<p>একটা ব্যতিক্রম, যেটা সহজ করে দেয়: wh-শব্দটা যদি নিজেই কর্তা হয়, মানে প্রশ্নটা "কে করল" বা "কী হলো", তাহলে কোনো মেশিন লাগে না। <span lang="en">Who broke the window?</span> <span lang="en">Who did break</span> নয়। <span lang="en">What happened?</span> <span lang="en">What did happen</span> নয়। কর্তার জায়গায় wh-শব্দ বসিয়ে বাকি বাক্য যেমন ছিল তেমন।</p>

<p>একই <span lang="en">who</span>, দুই প্রশ্ন: <span lang="en">Rafi called Mitu.</span> কে ডাকল? <span lang="en">Who called Mitu?</span> (কর্তা, মেশিন নেই।) কাকে ডাকল? <span lang="en">Who did Rafi call?</span> (কর্ম, মেশিন আছে; খাতায় <span lang="en">Whom</span>।) কর্তার প্রশ্নে ক্রিয়া একজনের রূপ নেয়, কারণ <span lang="en">who</span> একজন ধরা হয়: <span lang="en">Who wants tea?</span> <span lang="en">Who want</span> নয়।</p>

${mount("questions-reveal")}

${mount("questions-gap")}

<h2>ছোট উত্তর, আর না-বাচক প্রশ্নের ফাঁদ</h2>

<p>ইংরেজিতে হ্যাঁ/না প্রশ্নের উত্তর শুধু <span lang="en">Yes</span> বা <span lang="en">No</span> নয়; সাহায্যকারীটা ফিরে আসে। <span lang="en">Does she play? Yes, she does. Is he ready? No, he isn't. Have they left? Yes, they have. Can you swim? No, I can't.</span> যে সাহায্যকারী দিয়ে প্রশ্ন, সেটাই উত্তরে, কর্তা pronoun হয়ে। মূল ক্রিয়া ফিরে আসে না: <span lang="en">Yes, she plays</span> ভুল নয়, কিন্তু <span lang="en">Yes, she does</span>-ই ইংরেজি।</p>

<p>না-বাচক প্রশ্নে বাংলা আর ইংরেজি উল্টো দিকে যায়, আর এটা সত্যিকারের বিপদ। <span lang="en">Don't you like tea?</span> বাংলায় "তুমি চা পছন্দ করো না?" উত্তরে "হ্যাঁ" মানে "হ্যাঁ, করি না"। ইংরেজিতে <span lang="en">Yes</span> মানে সবসময় <span lang="en">Yes, I like tea</span>, আর <span lang="en">No</span> মানে <span lang="en">No, I don't</span>। প্রশ্নটা হ্যাঁ-বাচক না না-বাচক, তাতে কিছু যায় আসে না; উত্তর সত্যিটার দিকে। নিরাপদ পথ: শুধু <span lang="en">Yes</span> বা <span lang="en">No</span> বলো না, পুরোটা বলো: <span lang="en">Yes, I do. No, I don't.</span></p>

${mount("questions-short")}

<h2>লেজের প্রশ্ন: tag question</h2>

<p>মিতু আপু বলে, এটা পরীক্ষায় প্রতি বছর আসে, আর জীবনে প্রতি দিন। ইংরেজিতে কথার শেষে একটা ছোট প্রশ্ন জুড়ে দেওয়া হয় সম্মতি চাইতে: "তাই না?" নিয়ম দুটো, আর দুটোই মেশিনের মতো:</p>

<ol class="step-list">
<li><strong>উল্টো:</strong> বাক্য হ্যাঁ-বাচক হলে লেজ না-বাচক, বাক্য না-বাচক হলে লেজ হ্যাঁ-বাচক। <span lang="en">It is hot, isn't it? It isn't hot, is it?</span></li>
<li><strong>একই সাহায্যকারী, কর্তা pronoun:</strong> বাক্যে যে সাহায্যকারী, লেজে সেটাই; সাহায্যকারী না থাকলে <span lang="en">do/does/did</span>। কর্তা সবসময় pronoun। <span lang="en">Rafi can bowl, can't he? Nanu tells stories, doesn't she? They went home, didn't they?</span></li>
</ol>

<p>কয়েকটা রেবেল লেজ: <span lang="en">I am late, aren't I?</span> (<span lang="en">amn't</span> বলে কিছু নেই)। <span lang="en">Let's go, shall we?</span> <span lang="en">Open the door, will you?</span> <span lang="en">Nobody came, did they?</span> (<span lang="en">nobody</span> না-বাচক, তাই লেজ হ্যাঁ, আর pronoun <span lang="en">they</span>)। <span lang="en">There is a problem, isn't there?</span></p>

<p>রেবেলদের পুরো তালিকা, কারণ পরীক্ষা ঠিক এদের দিয়েই প্রশ্ন করে:</p>

<div class="table-scroll">
<table>
<thead><tr><th>বাক্যে</th><th>লেজ</th><th>কেন</th></tr></thead>
<tbody>
<tr><td><span lang="en">I am</span></td><td><span lang="en">aren't I?</span></td><td><span lang="en">amn't</span> নেই</td></tr>
<tr><td><span lang="en">Let's</span></td><td><span lang="en">shall we?</span></td><td>প্রস্তাবের লেজ</td></tr>
<tr><td>আদেশ (<span lang="en">Open…, Don't…</span>)</td><td><span lang="en">will you? / won't you?</span></td><td>আদেশের লেজ</td></tr>
<tr><td><span lang="en">nobody, no one, none, nothing</span></td><td>হ্যাঁ-বাচক লেজ, <span lang="en">they / it</span></td><td>এরা না-বাচক</td></tr>
<tr><td><span lang="en">never, hardly, seldom, rarely</span></td><td>হ্যাঁ-বাচক লেজ</td><td>এরাও না-বাচক</td></tr>
<tr><td><span lang="en">everyone, everybody, someone</span></td><td><span lang="en">they</span></td><td>pronoun হিসেবে <span lang="en">they</span></td></tr>
<tr><td><span lang="en">this / that</span></td><td><span lang="en">it</span></td><td>একটা জিনিস</td></tr>
<tr><td><span lang="en">these / those</span></td><td><span lang="en">they</span></td><td>অনেক</td></tr>
<tr><td><span lang="en">There is / are</span></td><td><span lang="en">isn't there? / aren't there?</span></td><td><span lang="en">there</span>-ই থাকে</td></tr>
<tr><td><span lang="en">has to, have to</span></td><td><span lang="en">doesn't / don't</span></td><td>সাধারণ ক্রিয়ার মতো</td></tr>
<tr><td><span lang="en">used to</span></td><td><span lang="en">didn't</span></td><td>অতীত</td></tr>
</tbody>
</table>
</div>

${mount("questions-tagsteps")}

${mount("questions-match")}

<div class="ex"><b>Sherlock-এর ধরন:</b> Sherlock প্রশ্ন করে না, বলে দেয়, তারপর লেজ জোড়ে: <span lang="en">You've been in Afghanistan, haven't you?</span> লেজটা প্রশ্ন নয়, নিশ্চয়তা। সুর নামালে (<span lang="en">haven't you</span> নিচের দিকে) মানে "আমি জানি"; সুর তুললে মানে সত্যিই জিজ্ঞেস করছি। একই লেজ, দুই সুর।</div>

<h2>পরোক্ষ প্রশ্ন: মেশিন থামে</h2>

<p><span lang="en">Where is the station?</span> সরাসরি। কিন্তু <span lang="en">Could you tell me where the station is?</span> ভিতরের অংশটা আর প্রশ্নের ক্রমে নয়, সাধারণ বাক্যের ক্রমে: <span lang="en">where the station is</span>, <span lang="en">where is the station</span> নয়। <span lang="en">I don't know what time it is.</span> <span lang="en">Do you know if she has come?</span> বাক্যের ভিতরে প্রশ্ন ঢুকলে সে ভদ্র হয়ে সোজা হয়ে বসে। আর <span lang="en">do/does/did</span> মেশিনটা একেবারে চলে যায়: <span lang="en">Where does Rafi live?</span> কিন্তু <span lang="en">Do you know where Rafi lives?</span> হ্যাঁ/না প্রশ্নে ভিতরে <span lang="en">if</span> বা <span lang="en">whether</span>। এই নিয়মটাই পর্ব ১৬-এর reported question।</p>

${mount("questions-indirect")}

${mount("questions-build")}

${mount("questions-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>দুটো আলাদা প্রশ্ন। এক: <span lang="en">Make wh-questions</span> বা <span lang="en">questions so that the underlined words are the answer</span>। দুই: <span lang="en">Add tag questions</span>, পাঁচটা বাক্য, পাঁচটা লেজ। প্রথমটার ধাপ:</p>

<ol class="step-list">
<li><strong>উত্তরটা কী ধরনের?</strong> দাগ দেওয়া অংশ জায়গা হলে <span lang="en">where</span>, সময় হলে <span lang="en">when</span>, মানুষ হলে <span lang="en">who</span>, কারণ হলে <span lang="en">why</span>, সংখ্যা হলে <span lang="en">how many</span>।</li>
<li><strong>দাগ দেওয়া অংশ কি কর্তা?</strong> হলে মেশিন নেই: <span lang="en">Who</span> বসিয়ে বাকিটা যেমন আছে।</li>
<li><strong>নইলে মেশিন।</strong> সাহায্যকারী আছে? উল্টাও। নেই? <span lang="en">do/does/did</span>, মূল ক্রিয়া খালি।</li>
<li><strong>দাগ দেওয়া অংশ সরাও, প্রশ্নবোধক বসাও।</strong> আর একবার পড়ে দেখো <span lang="en">Does he plays</span> হয়ে যায়নি।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Rafi plays cricket at the club on Fridays because he loves it.</span> দাগ <span lang="en">Rafi</span>: <span lang="en">Who plays cricket at the club on Fridays?</span> দাগ <span lang="en">cricket</span>: <span lang="en">What does Rafi play at the club?</span> দাগ <span lang="en">at the club</span>: <span lang="en">Where does Rafi play cricket?</span> দাগ <span lang="en">on Fridays</span>: <span lang="en">When does Rafi play cricket?</span> দাগ <span lang="en">because he loves it</span>: <span lang="en">Why does Rafi play cricket?</span> একটা বাক্য, পাঁচটা প্রশ্ন, একটা মেশিন।</div>

${mount("questions-exam")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>tag question-এ চারটা ধাপ, ক্রমে: (১) বাক্যটা হ্যাঁ না না? <span lang="en">not, never, no, nobody, hardly, seldom</span> থাকলে না। (২) সাহায্যকারী কোনটা? না থাকলে কাল দেখে <span lang="en">do/does/did</span>। (৩) কর্তাকে pronoun বানাও: <span lang="en">Rafi</span> হয় <span lang="en">he</span>, <span lang="en">the players</span> হয় <span lang="en">they</span>, <span lang="en">everyone</span> হয় <span lang="en">they</span>, <span lang="en">this</span> হয় <span lang="en">it</span>। (৪) উল্টো করে লেখো, কমা আর প্রশ্নবোধক সহ।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>পরোক্ষ প্রশ্নে মেশিন থামে। <span lang="en">Where is the station?</span> সরাসরি। কিন্তু <span lang="en">Could you tell me where the station is?</span> ভিতরের অংশটা আর প্রশ্নের ক্রমে নয়, সাধারণ বাক্যের ক্রমে: <span lang="en">where the station is</span>, <span lang="en">where is the station</span> নয়। <span lang="en">I don't know what time it is.</span> <span lang="en">Do you know if she has come?</span> বাক্যের ভিতরে প্রশ্ন ঢুকলে সে ভদ্র হয়ে সোজা হয়ে বসে।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>লেজে ছোট রূপ, পুরো নয়: <span lang="en">isn't it</span>, <span lang="en">is not it</span> নয়; <span lang="en">won't he</span>, <span lang="en">will not he</span> নয়। আর <span lang="en">will not</span>-এর ছোট রূপ <span lang="en">won't</span>, <span lang="en">willn't</span> নয়। লেজে সবসময় pronoun: <span lang="en">Rafi is late, isn't Rafi?</span> ভুল, <span lang="en">isn't he?</span></p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>দুই মেশিন: কখন উল্টাই, কখন <span lang="en">do</span> বসাই?</li>
<li><span lang="en">Who called Rafi?</span> আর <span lang="en">Who did Rafi call?</span>: কেন একটায় <span lang="en">did</span>, অন্যটায় নয়?</li>
<li><span lang="en">Don't you like tea?</span>-র উত্তরে <span lang="en">Yes</span> মানে কী?</li>
<li>লেজের চার ধাপ, আর পাঁচটা রেবেল লেজ?</li>
<li>পরোক্ষ প্রশ্নে ক্রম কেমন?</li>
<li>বারোটা চাবি না দেখে?</li>
</ul>
</div>

${mount("questions-drill")}
`,
  blocks: {
    "questions-pattern": {
      kind: "pattern",
      title: { bn: "প্রশ্ন-মেশিনের চার খোপ", en: "The four slots of the question machine" },
      shape: "(Wh-) + HELPER + WHO + VERB … ?",
      why: { bn: "সাহায্যকারী কর্তার আগে চলে যায়। যেখানে সাহায্যকারী নেই, do এসে সেই জায়গা নেয়। wh-শব্দ থাকলে সবার আগে। এই একটা ছাঁচে ইংরেজির প্রতিটা প্রশ্ন।", en: "The helper moves in front of the subject. Where there is no helper, do steps in to take the slot. A wh-word goes first of all. Every question in English fits this one shape." },
      examples: [
        { target: "Is Rafi playing today?", bn: "রাফি কি আজ খেলছে? (be উল্টে)" },
        { target: "Does Rafi play on Fridays?", bn: "রাফি কি শুক্রবারে খেলে? (do বসিয়ে)" },
        { target: "Where does Rafi play?", bn: "রাফি কোথায় খেলে? (wh + do)" },
        { target: "Who taught you this?", bn: "কে তোমাকে এটা শেখাল? (who নিজেই কর্তা, মেশিন নেই)" },
        { target: "It is hot today, isn't it?", bn: "আজ গরম, তাই না? (লেজ)" },
      ],
      tip: { bn: "Does he plays? দুই টুপি, ভুল। does টুপি পরলে play খালি।", en: "Does he plays? Two hats, wrong. Once does wears the hat, play goes bare." },
    },
    "questions-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: বলা থেকে প্রশ্ন", en: "Listen, say: statement to question" },
      lines: [
        { target: "She has finished. Has she finished?", bn: "সে শেষ করেছে। সে কি শেষ করেছে?" },
        { target: "They will come. Will they come?", bn: "তারা আসবে। তারা কি আসবে?" },
        { target: "Nanu likes tea. Does Nanu like tea?", bn: "নানু চা পছন্দ করেন। নানু কি চা পছন্দ করেন?" },
        { target: "Rafi went home. Did Rafi go home?", bn: "রাফি বাসায় গেল। রাফি কি বাসায় গেল?" },
        { target: "What time does the match start?", bn: "ম্যাচ কয়টায় শুরু?" },
        { target: "How long have you lived here?", bn: "তুমি কতদিন ধরে এখানে থাকো?" },
        { target: "Do you have a bat? Yes, I do.", bn: "তোমার কি একটা ব্যাট আছে? হ্যাঁ, আছে।" },
      ],
    },
    "questions-machine": {
      kind: "bins",
      title: { bn: "কোন মেশিন", en: "Which machine" },
      note: { bn: "প্রতিটা বাক্যকে প্রশ্ন করতে কী লাগবে: উল্টানো, do/does, did, নাকি কিছুই না (wh-শব্দ কর্তা)।", en: "What each sentence needs to become a question: inversion, do or does, did, or nothing at all (the wh-word is the subject)." },
      bins: [
        { id: "flip", label: { bn: "উল্টাও", en: "invert" } },
        { id: "do", label: { bn: "do / does", en: "do / does" } },
        { id: "did", label: { bn: "did", en: "did" } },
        { id: "none", label: { bn: "মেশিন নেই", en: "no machine" } },
      ],
      items: [
        { text: { bn: "Mitu is studying. (Is she?)", en: "Mitu is studying. (Is she?)" }, bin: "flip", why: { bn: "is আছে, উল্টাও: Is Mitu studying?", en: "Is is there; invert: Is Mitu studying?" } },
        { text: { bn: "Nanu likes tea. (Does she?)", en: "Nanu likes tea. (Does she?)" }, bin: "do", why: { bn: "সাধারণ ক্রিয়া, একজন: Does Nanu like tea?", en: "An ordinary verb, one person: Does Nanu like tea?" } },
        { text: { bn: "They won the match. (Did they?)", en: "They won the match. (Did they?)" }, bin: "did", why: { bn: "অতীত, সাধারণ ক্রিয়া: Did they win?", en: "Past, ordinary verb: Did they win?" } },
        { text: { bn: "Someone broke the window. (Who?)", en: "Someone broke the window. (Who?)" }, bin: "none", why: { bn: "কে ভাঙল: who কর্তা, মেশিন নেই: Who broke the window?", en: "Who broke it: who is the subject, no machine: Who broke the window?" } },
        { text: { bn: "Rafi can swim. (Can he?)", en: "Rafi can swim. (Can he?)" }, bin: "flip", why: { bn: "modal আছে: Can Rafi swim?", en: "A modal is there: Can Rafi swim?" } },
        { text: { bn: "You have a bat. (Do you?)", en: "You have a bat. (Do you?)" }, bin: "do", why: { bn: "মালিকানার have, সাধারণ ক্রিয়ার মতো: Do you have a bat?", en: "Have of ownership behaves like an ordinary verb: Do you have a bat?" } },
        { text: { bn: "Something happened. (What?)", en: "Something happened. (What?)" }, bin: "none", why: { bn: "কী হলো: what কর্তা: What happened?", en: "What happened: what is the subject: What happened?" } },
        { text: { bn: "Nanu told a story. (Did she?)", en: "Nanu told a story. (Did she?)" }, bin: "did", why: { bn: "অতীত: Did Nanu tell a story? tell খালি।", en: "Past: Did Nanu tell a story? Tell goes bare." } },
        { text: { bn: "They have eaten. (Have they?)", en: "They have eaten. (Have they?)" }, bin: "flip", why: { bn: "have সাহায্যকারী: Have they eaten?", en: "Have is a helper here: Have they eaten?" } },
      ],
    },
    "questions-keys": {
      kind: "match",
      title: { bn: "উত্তর দেখে চাবি", en: "The key from the answer" },
      note: { bn: "বাঁ দিকে একটা উত্তর। ডান দিকে সেই উত্তর যে প্রশ্নের, তার চাবি।", en: "An answer on the left; on the right, the question word that would fetch it." },
      pairs: [
        { left: { bn: "At the club.", en: "At the club." }, right: { bn: "Where", en: "Where" } },
        { left: { bn: "Because he loves it.", en: "Because he loves it." }, right: { bn: "Why", en: "Why" } },
        { left: { bn: "Fifty runs.", en: "Fifty runs." }, right: { bn: "How many", en: "How many" } },
        { left: { bn: "Mitu's.", en: "Mitu's." }, right: { bn: "Whose", en: "Whose" } },
        { left: { bn: "For three hours.", en: "For three hours." }, right: { bn: "How long", en: "How long" } },
        { left: { bn: "The red one.", en: "The red one." }, right: { bn: "Which", en: "Which" } },
        { left: { bn: "By bus.", en: "By bus." }, right: { bn: "How", en: "How" } },
        { left: { bn: "Twice a week.", en: "Twice a week." }, right: { bn: "How often", en: "How often" } },
      ],
    },
    "questions-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: did লাগবে?", en: "Guess first: is did needed?" },
      ask: { bn: "Rafi called Mitu. এই বাক্য থেকে দুটো প্রশ্ন: কে ডাকল? আর কাকে ডাকল? কোনটায় did লাগবে?", en: "Rafi called Mitu. Two questions from this sentence: who called, and who was called? Which one needs did?" },
      choices: [
        { bn: "দুটোতেই", en: "Both" },
        { bn: "শুধু 'কাকে ডাকল'-তে", en: "Only 'who was called'" },
        { bn: "কোনোটাতেই না", en: "Neither" },
      ],
      answer: { bn: "শুধু 'কাকে ডাকল'-তে: Who did Rafi call? আর 'কে ডাকল': Who called Mitu? মেশিন ছাড়া।", en: "Only 'who was called': Who did Rafi call? And 'who called': Who called Mitu?, with no machine." },
      why: { bn: "কে ডাকল: who নিজেই কর্তা, রাফির জায়গায় বসে, বাকি বাক্য যেমন ছিল: Who called Mitu? কোনো did নয়, called-ও বদলায় না। কাকে ডাকল: who এখানে কর্ম, মিতুর জায়গায়, আর কর্মের প্রশ্নে মেশিন লাগে: did সামনে, call খালি: Who did Rafi call? খাতায় Whom did Rafi call? একই who, দুই জায়গা, একটায় মেশিন।", en: "Who called: who is the subject itself, standing where Rafi stood, and the rest stays as it was: Who called Mitu? No did, and called does not change. Who was called: who is the object here, standing where Mitu stood, and an object question needs the machine: did in front, call bare: Who did Rafi call? On paper, Whom did Rafi call? The same who, two positions, and the machine runs for only one of them." },
    },
    "questions-gap": {
      kind: "gap",
      title: { bn: "মেশিন চালাও", en: "Run the machine" },
      items: [
        { text: "___ Mitu study at night?", bn: "মিতু কি রাতে পড়ে?", options: ["Do", "Does", "Is"], right: 1, why: { bn: "সাহায্যকারী নেই, একজন, বর্তমান: Does। আর study খালি।", en: "No helper, one person, present: Does, and study stays bare." } },
        { text: "Where ___ you yesterday?", bn: "তুমি কাল কোথায় ছিলে?", options: ["was", "were", "did"], right: 1, why: { bn: "be নিজেই সাহায্যকারী, উল্টে দাও: were you। did লাগে না।", en: "Be is its own helper; just invert: were you. No did needed." } },
        { text: "___ broke the window?", bn: "কে জানালা ভাঙল?", options: ["Who did", "Who", "Did who"], right: 1, why: { bn: "who নিজেই কর্তা, তাই মেশিন নেই: Who broke?", en: "Who is itself the subject, so no machine: Who broke?" } },
        { text: "Rafi can swim, ___?", bn: "রাফি সাঁতার পারে, তাই না?", options: ["can he", "can't he", "doesn't he"], right: 1, why: { bn: "হ্যাঁ-বাচক বাক্য, লেজ না-বাচক, একই সাহায্যকারী: can't he।", en: "A positive sentence takes a negative tag with the same helper: can't he." } },
        { text: "Nanu doesn't like loud music, ___?", bn: "নানু জোরে গান পছন্দ করেন না, তাই না?", options: ["doesn't she", "does she", "isn't she"], right: 1, why: { bn: "না-বাচক বাক্য, লেজ হ্যাঁ-বাচক: does she।", en: "A negative sentence takes a positive tag: does she." } },
        { text: "Could you tell me where ___?", bn: "স্টেশনটা কোথায় বলতে পারবেন?", options: ["is the station", "the station is", "does the station"], right: 1, why: { bn: "পরোক্ষ প্রশ্ন: ভিতরে সাধারণ ক্রম, the station is।", en: "An indirect question keeps normal order inside: the station is." } },
        { text: "___ did you see at the market? Mitu.", bn: "বাজারে কাকে দেখলে? মিতুকে।", options: ["Who", "Whom", "Whose"], right: 1, why: { bn: "উত্তরে her বসে (I saw her), কর্ম: খাতায় Whom। কথায় Who চলে।", en: "The answer takes her (I saw her), an object: Whom on paper. Who passes in speech." } },
        { text: "How ___ sugar do you take in your tea?", bn: "চায়ে কতটুকু চিনি নাও?", options: ["many", "much", "long"], right: 1, why: { bn: "sugar গোনা যায় না: how much।", en: "Sugar is uncountable: how much." } },
      ],
    },
    "questions-short": {
      kind: "gap",
      title: { bn: "ছোট উত্তর", en: "Short answers" },
      note: { bn: "যে সাহায্যকারী দিয়ে প্রশ্ন, সেটাই উত্তরে। আর না-বাচক প্রশ্নে সত্যিটার দিকে উত্তর।", en: "The helper that asked the question answers it. And with a negative question, answer towards the truth." },
      items: [
        { text: "Does Rafi play on Fridays? Yes, he ___.", bn: "রাফি কি শুক্রবারে খেলে? হ্যাঁ, খেলে।", options: ["does", "plays", "is"], right: 0, why: { bn: "does দিয়ে প্রশ্ন, does দিয়ে উত্তর।", en: "Does asked, so does answers." } },
        { text: "Is Nanu at home? No, she ___.", bn: "নানু কি বাসায়? না, নেই।", options: ["doesn't", "isn't", "hasn't"], right: 1, why: { bn: "is দিয়ে প্রশ্ন: No, she isn't।", en: "Is asked: No, she isn't." } },
        { text: "Have they left? Yes, they ___.", bn: "তারা কি চলে গেছে? হ্যাঁ, গেছে।", options: ["did", "have", "are"], right: 1, why: { bn: "have দিয়ে প্রশ্ন: Yes, they have।", en: "Have asked: Yes, they have." } },
        { text: "Did you see the match? No, I ___.", bn: "তুমি কি ম্যাচটা দেখেছ? না, দেখিনি।", options: ["didn't", "don't", "wasn't"], right: 0, why: { bn: "did দিয়ে প্রশ্ন: No, I didn't।", en: "Did asked: No, I didn't." } },
        { text: "Don't you like tea? ___, I do. I love it.", bn: "তুমি কি চা পছন্দ করো না? হ্যাঁ, করি। খুব ভালোবাসি।", options: ["Yes", "No"], right: 0, why: { bn: "ইংরেজিতে Yes মানে সবসময় হ্যাঁ, পছন্দ করি, প্রশ্ন না-বাচক হলেও। বাংলার 'হ্যাঁ, করি না' এখানে নেই।", en: "In English Yes always means yes, I like it, even after a negative question. Bangla's yes, I don't does not exist here." } },
        { text: "Can Mitu swim? No, she ___, but she is learning.", bn: "মিতু কি সাঁতার পারে? না, পারে না, কিন্তু শিখছে।", options: ["can't", "doesn't", "isn't"], right: 0, why: { bn: "can দিয়ে প্রশ্ন: No, she can't।", en: "Can asked: No, she can't." } },
      ],
    },
    "questions-tagsteps": {
      kind: "order",
      title: { bn: "লেজ বানানোর চার ধাপ", en: "The four steps of a tag" },
      note: { bn: "Nobody called Rafi yesterday. এই বাক্যের লেজ বানানোর ধাপগুলো ক্রমে সাজাও।", en: "Put the steps in order for building the tag of Nobody called Rafi yesterday." },
      items: [
        { text: { bn: "বাক্যটা হ্যাঁ না না? nobody আছে, তাই না-বাচক", en: "Is the sentence positive or negative? Nobody is in it, so negative" }, why: { bn: "না-বাচক বাক্যের লেজ হ্যাঁ-বাচক হবে।", en: "A negative sentence takes a positive tag." } },
        { text: { bn: "সাহায্যকারী কোনটা? নেই, আর called অতীত, তাই did", en: "Which helper? None, and called is past, so did" } },
        { text: { bn: "কর্তাকে pronoun বানাও: nobody হয় they", en: "Turn the subject into a pronoun: nobody becomes they" }, why: { bn: "nobody-র pronoun they।", en: "The pronoun for nobody is they." } },
        { text: { bn: "উল্টো করে লেখো, কমা আর প্রশ্নবোধক সহ: Nobody called Rafi yesterday, did they?", en: "Write it the other way round, with the comma and question mark: Nobody called Rafi yesterday, did they?" } },
      ],
    },
    "questions-match": {
      kind: "match",
      title: { bn: "লেজ মেলাও", en: "Match the tail" },
      note: { bn: "বাঁয়ের বাক্যের সাথে ডানের ঠিক লেজ।", en: "The sentence on the left with its right tag." },
      pairs: [
        { left: { bn: "I am late,", en: "I am late," }, right: { bn: "aren't I?", en: "aren't I?" } },
        { left: { bn: "Let's start,", en: "Let's start," }, right: { bn: "shall we?", en: "shall we?" } },
        { left: { bn: "Nobody called,", en: "Nobody called," }, right: { bn: "did they?", en: "did they?" } },
        { left: { bn: "Close the door,", en: "Close the door," }, right: { bn: "will you?", en: "will you?" } },
        { left: { bn: "There is a match today,", en: "There is a match today," }, right: { bn: "isn't there?", en: "isn't there?" } },
        { left: { bn: "They have never lost,", en: "They have never lost," }, right: { bn: "have they?", en: "have they?" } },
        { left: { bn: "Rafi has to leave early,", en: "Rafi has to leave early," }, right: { bn: "doesn't he?", en: "doesn't he?" } },
        { left: { bn: "Nanu used to sing,", en: "Nanu used to sing," }, right: { bn: "didn't she?", en: "didn't she?" } },
      ],
    },
    "questions-indirect": {
      kind: "compare",
      title: { bn: "সরাসরি আর পরোক্ষ", en: "Direct and indirect" },
      note: { bn: "একই প্রশ্ন, দুই চেহারা। ডান দিকে ক্রম সোজা আর মেশিন নেই।", en: "The same question in two shapes. On the right the order is plain and the machine is gone." },
      columns: [
        { bn: "সরাসরি", en: "direct" },
        { bn: "পরোক্ষ, ভদ্র", en: "indirect, polite" },
      ],
      rows: [
        { label: { bn: "be", en: "be" }, cells: [{ bn: "Where is the station?", en: "Where is the station?" }, { bn: "Could you tell me where the station is?", en: "Could you tell me where the station is?" }] },
        { label: { bn: "do / does", en: "do / does" }, cells: [{ bn: "Where does Rafi live?", en: "Where does Rafi live?" }, { bn: "Do you know where Rafi lives?", en: "Do you know where Rafi lives?" }] },
        { label: { bn: "did", en: "did" }, cells: [{ bn: "When did the match start?", en: "When did the match start?" }, { bn: "I wonder when the match started.", en: "I wonder when the match started." }] },
        { label: { bn: "হ্যাঁ / না", en: "yes / no" }, cells: [{ bn: "Has she come?", en: "Has she come?" }, { bn: "Do you know if she has come?", en: "Do you know if she has come?" }] },
        { label: { bn: "শেষের চিহ্ন", en: "End mark" }, cells: [{ bn: "সবসময় ?", en: "always ?" }, { bn: "বাইরের বাক্যটা প্রশ্ন হলে ?, নইলে ফুল স্টপ", en: "? if the outer sentence asks, a full stop if it tells" }] },
      ],
    },
    "questions-build": {
      kind: "build",
      title: { bn: "প্রশ্ন সাজাও", en: "Build the question" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো সাহায্যকারী কর্তার আগে গেল কি না, আর wh-শব্দ সবার আগে।", en: "The words are shuffled. As you build, check the helper lands before the subject and the wh-word first of all." },
      pattern: "wh-word + helper + subject + verb … ?  ·  statement, tag?",
      lines: [
        { target: "Where does Rafi play cricket on Fridays?", bn: "রাফি শুক্রবারে কোথায় ক্রিকেট খেলে?" },
        { target: "How long have you been waiting here?", bn: "তুমি কতক্ষণ ধরে এখানে অপেক্ষা করছ?" },
        { target: "Who taught Nanu to make pitha?", bn: "নানুকে পিঠা বানানো কে শেখাল?" },
        { target: "Did Mitu finish her homework last night?", bn: "মিতু কি কাল রাতে হোমওয়ার্ক শেষ করেছিল?" },
        { target: "Could you tell me where the library is?", bn: "লাইব্রেরিটা কোথায় বলতে পারবেন?" },
        { target: "Nobody saw the accident, did they?", bn: "কেউ দুর্ঘটনাটা দেখেনি, তাই না?" },
      ],
    },
    "questions-spot": {
      kind: "spot",
      title: { bn: "রাফির সাক্ষাৎকার, প্রশ্নের ভুল", en: "Rafi's interview: the question mistakes" },
      note: { bn: "রাফি স্কুল ম্যাগাজিনের জন্য কোচকে প্রশ্ন লিখেছে। যে প্রশ্নে মেশিনের ভুল, সেটা ছোঁও।", en: "Rafi wrote questions for the coach for the school magazine. Tap every question where the machine went wrong." },
      source: { bn: "সাক্ষাৎকার: কোচের সাথে", en: "Interview: with the coach" },
      lines: [
        { text: { bn: "When did you start playing cricket?", en: "When did you start playing cricket?" } },
        { text: { bn: "Who did teach you to bowl?", en: "Who did teach you to bowl?" }, flag: { bn: "who কর্তা, মেশিন নেই: Who taught you to bowl?", en: "Who is the subject, no machine: Who taught you to bowl?" } },
        { text: { bn: "Does your team practises every day?", en: "Does your team practises every day?" }, flag: { bn: "দুই টুপি: Does your team practise।", en: "Two hats: Does your team practise." } },
        { text: { bn: "How many matches have you won this year?", en: "How many matches have you won this year?" } },
        { text: { bn: "You were nervous in your first match, weren't you?", en: "You were nervous in your first match, weren't you?" } },
        { text: { bn: "Can you tell me what is your favourite ground?", en: "Can you tell me what is your favourite ground?" }, flag: { bn: "পরোক্ষ প্রশ্ন, সোজা ক্রম: what your favourite ground is।", en: "An indirect question keeps plain order: what your favourite ground is." } },
        { text: { bn: "Nobody beats your team at home, do they?", en: "Nobody beats your team at home, do they?" } },
        { text: { bn: "Why you chose to become a coach?", en: "Why you chose to become a coach?" }, flag: { bn: "মেশিন হারিয়ে গেছে: Why did you choose।", en: "The machine is missing: Why did you choose." } },
      ],
    },
    "questions-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Make a question so that the underlined words are the answer: Nanu tells stories at night. (দাগ: at night)", en: "Make a question so that the underlined words are the answer: Nanu tells stories at night. (underlined: at night)" },
          options: [
            { text: { bn: "When does Nanu tell stories?", en: "When does Nanu tell stories?" }, right: true, why: { bn: "হ্যাঁ। সময় জিজ্ঞেস, when; সাহায্যকারী নেই, একজন, does; tell খালি; at night সরানো।", en: "Yes. Asking about time, when; no helper and one person, does; tell bare; at night removed." } },
            { text: { bn: "When Nanu tells stories?", en: "When Nanu tells stories?" }, why: { bn: "না। মেশিন নেই। wh-শব্দের পরে সাহায্যকারী লাগে।", en: "No. The machine is missing. A helper follows the wh-word." } },
            { text: { bn: "When does Nanu tells stories?", en: "When does Nanu tells stories?" }, why: { bn: "না। দুই টুপি।", en: "No. Two hats." } },
          ],
        },
        {
          ask: { bn: "Add a tag: Everyone enjoyed the match, ___?", en: "Add a tag: Everyone enjoyed the match, ___?" },
          options: [
            { text: { bn: "didn't they?", en: "didn't they?" }, right: true, why: { bn: "হ্যাঁ। হ্যাঁ-বাচক, অতীত, তাই didn't; everyone-এর pronoun they।", en: "Yes. Positive and past, so didn't; the pronoun for everyone is they." } },
            { text: { bn: "didn't he?", en: "didn't he?" }, why: { bn: "না। everyone-এর লেজে they।", en: "No. Everyone takes they in the tag." } },
            { text: { bn: "did they?", en: "did they?" }, why: { bn: "না। বাক্য হ্যাঁ-বাচক, লেজ না-বাচক।", en: "No. The sentence is positive, so the tag is negative." } },
          ],
        },
        {
          ask: { bn: "Which reply means you DO want tea? Wouldn't you like some tea?", en: "Which reply means you DO want tea? Wouldn't you like some tea?" },
          options: [
            { text: { bn: "No, I wouldn't.", en: "No, I wouldn't." }, why: { bn: "না। এর মানে চাই না।", en: "No. That means you do not want any." } },
            { text: { bn: "Yes, I would.", en: "Yes, I would." }, right: true, why: { bn: "হ্যাঁ। ইংরেজিতে Yes সবসময় সত্যির দিকে: চাই।", en: "Yes. In English, Yes always points at the truth: you want it." } },
            { text: { bn: "Yes, I wouldn't.", en: "Yes, I wouldn't." }, why: { bn: "না। Yes আর wouldn't একসাথে হয় না।", en: "No. Yes and wouldn't cannot share an answer." } },
          ],
        },
        {
          ask: { bn: "Change into an indirect question: What time is it?", en: "Change into an indirect question: What time is it?" },
          options: [
            { text: { bn: "Could you tell me what time is it?", en: "Could you tell me what time is it?" }, why: { bn: "না। ভিতরে সোজা ক্রম চাই: what time it is।", en: "No. Plain order is needed inside: what time it is." } },
            { text: { bn: "Could you tell me what time it is?", en: "Could you tell me what time it is?" }, right: true, why: { bn: "হ্যাঁ। ভিতরের প্রশ্ন সোজা হয়ে বসেছে।", en: "Yes. The inner question has straightened out." } },
            { text: { bn: "Could you tell me what time does it?", en: "Could you tell me what time does it?" }, why: { bn: "না। be-র বাক্যে do আসে না, আর পরোক্ষে মেশিনই নেই।", en: "No. A be sentence never takes do, and an indirect question has no machine at all." } },
          ],
        },
      ],
    },
    "questions-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "একজন বন্ধুকে ছয়টা wh-প্রশ্ন, ছয় চাবি দিয়ে: What… Who… Where… When… Why… How…", en: "Six wh-questions to a friend, one per key: What… Who… Where… When… Why… How…" } },
        { text: { bn: "পাঁচটা সাধারণ বাক্য বলো আর প্রতিটায় লেজ জোড়ো: It's cold, isn't it?", en: "Say five plain sentences and put a tag on each: It's cold, isn't it?" } },
        { text: { bn: "দোকানে বা রাস্তায় জিজ্ঞেস করার তিনটা ভদ্র পরোক্ষ প্রশ্ন: Could you tell me where…", en: "Three polite indirect questions for a shop or the street: Could you tell me where…" } },
        { text: { bn: "একটা বাক্য নাও (Rafi plays cricket at the club on Fridays) আর প্রতিটা শব্দ নিয়ে একটা করে প্রশ্ন: Who… What… Where… When…", en: "Take one sentence (Rafi plays cricket at the club on Fridays) and ask one question per word: Who… What… Where… When…" } },
        { text: { bn: "পাঁচটা হ্যাঁ/না প্রশ্ন নিজেকে, আর ছোট উত্তর: Do I like tea? Yes, I do.", en: "Five yes/no questions to yourself, with short answers: Do I like tea? Yes, I do." } },
        { text: { bn: "পাঁচটা রেবেল লেজ জোরে, তিনবার: aren't I, shall we, will you, did they, isn't there।", en: "Five rebel tags aloud, three times: aren't I, shall we, will you, did they, isn't there." } },
      ],
    },
  },
};
