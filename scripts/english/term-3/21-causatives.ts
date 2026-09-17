/* ============================================================
   21-causatives.ts: পর্ব ২১, করা নাকি করানো (causatives).

   One part of the grammar term, gathered into the rung by
   `advanced.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>রাফির ফোনের স্ক্রিন ভেঙেছে। সে নিজে সারায়নি, দোকানে দিয়ে সারিয়ে এনেছে। ইংরেজিতে এই তফাতটা ব্যাকরণে ধরা পড়ে: <span lang="en">I repaired my phone</span> মানে নিজে সারিয়েছি; <span lang="en">I had my phone repaired</span> মানে সারিয়ে নিয়েছি, কাউকে দিয়ে। কাউকে দিয়ে কিছু করানোর ক্রিয়াগুলোর নাম <span lang="en">causative</span>: <span lang="en">make, let, have, get, help</span>। পর্ব ১৮-তে <span lang="en">make</span> আর <span lang="en">let</span>-এর সাথে খালি ক্রিয়া দেখেছ; এই পর্বে পুরো পরিবার, আর প্রতিটার নিজের ছাঁচ।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">make + কাউকে + খালি ক্রিয়া</span>: বাধ্য করা। <span lang="en">Coach made us run.</span></li>
<li><span lang="en">let + কাউকে + খালি ক্রিয়া</span>: অনুমতি দেওয়া। <span lang="en">Ma let me go.</span></li>
<li><span lang="en">have + কাউকে + খালি ক্রিয়া</span>: দায়িত্ব দেওয়া। <span lang="en">I had the mechanic check the bike.</span></li>
<li><span lang="en">get + কাউকে + to + ক্রিয়া</span>: রাজি করানো। <span lang="en">I got Rafi to help me.</span></li>
<li><span lang="en">have / get + জিনিস + V3</span>: কাজটা করিয়ে নেওয়া, কে করল বলা নেই। <span lang="en">I had my hair cut. I got the phone repaired.</span></li>
</ul>
</div>

${mount("causatives-pattern")}

<h2>মানুষকে দিয়ে: make, let, have, get</h2>

<p>চারটা ক্রিয়া, চারটা সম্পর্ক, আর দুটো ছাঁচ। <span lang="en">make, let, have</span>-এর পরে মানুষ, তারপর খালি ক্রিয়া, কোনো <span lang="en">to</span> নয়। <span lang="en">get</span>-এর পরে মানুষ, তারপর <span lang="en">to</span>। <span lang="en">get</span>-ই একমাত্র যে <span lang="en">to</span> নেয়, আর পরীক্ষা ঠিক এখানে ফাঁদ পাতে।</p>

<div class="table-scroll">
<table>
<thead><tr><th>ক্রিয়া</th><th>মানে</th><th>ছাঁচ</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">make</span></td><td>বাধ্য করা, জোর</td><td>make + কাকে + খালি</td><td><span lang="en">The teacher made us rewrite the essay.</span></td></tr>
<tr><td><span lang="en">let</span></td><td>অনুমতি দেওয়া</td><td>let + কাকে + খালি</td><td><span lang="en">Baba let me stay up late.</span></td></tr>
<tr><td><span lang="en">have</span></td><td>দায়িত্ব দেওয়া, কাজ করানো</td><td>have + কাকে + খালি</td><td><span lang="en">I had my brother fix the fan.</span></td></tr>
<tr><td><span lang="en">get</span></td><td>রাজি করানো, বুঝিয়ে করানো</td><td>get + কাকে + <span lang="en">to</span></td><td><span lang="en">I got my brother to fix the fan.</span></td></tr>
<tr><td><span lang="en">help</span></td><td>সাহায্য করা</td><td>help + কাকে + খালি বা <span lang="en">to</span></td><td><span lang="en">Rafi helped me (to) carry it.</span></td></tr>
</tbody>
</table>
</div>

<p><span lang="en">have</span> আর <span lang="en">get</span>-এর তফাতটা সূক্ষ্ম: <span lang="en">have</span> মানে এটা ওর কাজ, আমি বললাম, ও করল। <span lang="en">get</span> মানে একটু বোঝাতে হয়েছে, রাজি করাতে হয়েছে। <span lang="en">I had the plumber fix the tap</span> (প্লাম্বারের কাজ)। <span lang="en">I got my lazy cousin to fix the tap</span> (অলস কাজিনকে রাজি করিয়ে)।</p>

${mount("causatives-lines")}

<h2>কে কাকে কতটা জোর করছে: একটা সিঁড়ি</h2>

<p>পাঁচটা ক্রিয়াকে জোরের মাত্রায় সাজালে একটা সিঁড়ি পাওয়া যায়, আর সিঁড়িটা মনে রাখলে কোন ক্রিয়া বসবে সেটা মানে থেকেই বেরিয়ে আসে। সবচেয়ে নিচে <span lang="en">let</span>: ও চেয়েছিল, আমি শুধু বাধা দিইনি। তার উপরে <span lang="en">help</span>: ও করছে, আমি হাত লাগালাম। মাঝখানে <span lang="en">have</span>: আমি বললাম, ও করল, কোনো তর্ক নেই, কারণ এটা ওর কাজ। তার উপরে <span lang="en">get</span>: ও করতে চায়নি, আমি বুঝিয়ে, অনুরোধ করে, ঘুষ দিয়ে করালাম। সবচেয়ে উপরে <span lang="en">make</span>: ওর মতামত ছিল না, করতেই হয়েছে। <span lang="en">Ma let me go</span> আর <span lang="en">Ma made me go</span>: একটায় আমি যেতে চেয়েছিলাম, অন্যটায় চাইনি।</p>

${mount("causatives-ladder")}

<div class="table-scroll">
<table>
<thead><tr><th>ক্রিয়া</th><th>যাকে দিয়ে করানো হলো, সে চেয়েছিল?</th><th>বাংলায় কাছাকাছি</th></tr></thead>
<tbody>
<tr><td><span lang="en">let</span></td><td>হ্যাঁ, সে-ই চেয়েছিল</td><td>যেতে দিলাম</td></tr>
<tr><td><span lang="en">help</span></td><td>হ্যাঁ, একসাথে করলাম</td><td>সাহায্য করলাম</td></tr>
<tr><td><span lang="en">have</span></td><td>তার কাজ, প্রশ্নই ওঠে না</td><td>দিয়ে করালাম</td></tr>
<tr><td><span lang="en">get</span></td><td>প্রথমে না, পরে রাজি</td><td>রাজি করিয়ে করালাম</td></tr>
<tr><td><span lang="en">make</span></td><td>না, জোর করে</td><td>বাধ্য করলাম</td></tr>
</tbody>
</table>
</div>

<h2>জিনিসের উপর: have / get + জিনিস + V3</h2>

<p>এটাই <span lang="en">causative</span>-এর সবচেয়ে ব্যবহৃত ছাঁচ, আর সবচেয়ে ইংরেজি-শোনানো। কে করল সেটা জরুরি নয়, কাজটা করানো হয়েছে সেটাই কথা। <span lang="en">I had my hair cut.</span> নাপিত কেটেছে, নাম বলার দরকার নেই। <span lang="en">We got the house painted.</span> <span lang="en">She is having her car washed.</span> <span lang="en">You should get your eyes tested.</span> ছাঁচ: <strong><span lang="en">have/get</span> (যেকোনো কালে) + জিনিস + V3</strong>। পর্ব ১৫-র passive এখানে লুকিয়ে আছে: <span lang="en">my hair was cut</span>, শুধু সামনে <span lang="en">I had</span> বসে জানাচ্ছে যে আমি করিয়েছি।</p>

<p>দুটো বাক্য পাশাপাশি রাখো: <span lang="en">I cut my hair</span> মানে নিজে কাঁচি নিয়ে কেটেছি (সাহসী)। <span lang="en">I had my hair cut</span> মানে সেলুনে গিয়েছি (স্বাভাবিক)। বাংলায় "চুল কাটালাম" এই একটা "কাটালাম"-এ যা বলি, ইংরেজিতে <span lang="en">had … cut</span> দিয়ে।</p>

<h2>একই ছাঁচ, সব কালে</h2>

<p>ছাঁচের মাঝের দুটো জিনিস, জিনিসটা আর V3, কখনো বদলায় না। যা বদলায় তা শুধু <span lang="en">have</span> বা <span lang="en">get</span>-এর কাল, আর সেটা পর্ব ৭ আর ১১-র সাধারণ নিয়মে। এই টেবিলটা একবার জোরে পড়লে <span lang="en">right form</span>-এর প্রশ্নে <span lang="en">having … repaired</span> বা <span lang="en">will have … repaired</span> দেখে আর চমকাবে না।</p>

<div class="table-scroll">
<table>
<thead><tr><th>কাল</th><th>বাক্য</th><th>বাংলা</th></tr></thead>
<tbody>
<tr><td>present simple</td><td><span lang="en">I have my bike serviced every month.</span></td><td>প্রতি মাসে সাইকেলটা সার্ভিস করাই</td></tr>
<tr><td>present continuous</td><td><span lang="en">I am having my bike serviced now.</span></td><td>এখন সার্ভিস করাচ্ছি</td></tr>
<tr><td>past simple</td><td><span lang="en">I had my bike serviced yesterday.</span></td><td>কাল সার্ভিস করিয়েছি</td></tr>
<tr><td>present perfect</td><td><span lang="en">I have just had my bike serviced.</span></td><td>এইমাত্র সার্ভিস করিয়েছি</td></tr>
<tr><td>future</td><td><span lang="en">I will have my bike serviced next week.</span></td><td>সামনের সপ্তাহে সার্ভিস করাব</td></tr>
<tr><td>modal</td><td><span lang="en">I must get my bike serviced.</span></td><td>সার্ভিস করাতেই হবে</td></tr>
<tr><td>-ing এর পরে</td><td><span lang="en">I enjoy getting my bike serviced.</span></td><td>সার্ভিস করাতে ভালো লাগে</td></tr>
</tbody>
</table>
</div>

<p>খেয়াল করো <span lang="en">have just had</span>: প্রথম <span lang="en">have</span> perfect-এর সাহায্যকারী, দ্বিতীয় <span lang="en">had</span> causative। দুটো <span lang="en">have</span> পাশাপাশি দেখে অনেকে ভয় পায়; আসলে দুজনের দুটো আলাদা কাজ, পর্ব ১-এর ভাষায় একজন সাহায্যকারী আর একজন খেলোয়াড়।</p>

${mount("causatives-tense")}

<h2>ক্রিয়ার ছাঁচের আরও কয়েকজন</h2>

<p><span lang="en">want / would like / ask / tell / allow / advise / encourage + কাউকে + to</span>: <span lang="en">I want you to come. She asked me to wait. The doctor advised him to rest. Coach encouraged us to keep going.</span> <span lang="en">see / hear / watch / feel + কাউকে + খালি বা -ing</span>: <span lang="en">I saw him leave</span> (পুরো কাজটা দেখলাম), <span lang="en">I saw him leaving</span> (যেতে দেখলাম, মাঝপথে)। <span lang="en">suggest / recommend + -ing</span> বা <span lang="en">that</span>: <span lang="en">I suggest leaving early. I suggest that we leave early.</span> <span lang="en">suggest me to</span> বলে কিছু নেই।</p>

<p>তিনটা দলে ভাগ করলে মনে থাকে। <strong>খালি দল:</strong> <span lang="en">make, let, have, help, see, hear, watch, feel, notice</span>। <strong><span lang="en">to</span> দল:</strong> <span lang="en">get, want, ask, tell, allow, advise, encourage, force, order, remind, warn, expect, would like</span>। <strong>না-দল, যেখানে কাউকে + <span lang="en">to</span> বসেই না:</strong> <span lang="en">suggest, recommend</span>, এদের পরে <span lang="en">-ing</span> বা <span lang="en">that</span>। খালি দলের ক্রিয়াগুলো সব অনুভূতি আর করানোর ক্রিয়া; <span lang="en">to</span> দল বলা আর চাওয়ার ক্রিয়া। এই ছবিটা মাথায় থাকলে নতুন ক্রিয়া দেখেও আন্দাজ করা যায়।</p>

${mount("causatives-bins")}

${mount("causatives-gap")}

<div class="ex"><b>Harry Potter-এর Dobby:</b> <span lang="en">The Malfoys made Dobby punish himself. Harry got Lucius to free Dobby by giving him a sock.</span> <span lang="en">make</span> খালি, <span lang="en">get … to</span>। আর Hogwarts-এ: <span lang="en">Students have their wands checked at the gate. Harry had his glasses repaired by Hermione.</span> জিনিসের ছাঁচ, V3।</div>

<h2>have + জিনিস + V3 এর আরেকটা মানে: ক্ষতি</h2>

<p>একই ছাঁচ কখনো কখনো করানো নয়, ঘটে যাওয়া বোঝায়, বিশেষ করে খারাপ কিছু। <span lang="en">Rafi had his phone stolen on the bus.</span> রাফি চুরি করায়নি; তার ফোন চুরি হয়ে গেছে, তার সাথে ঘটেছে। <span lang="en">We had our roof blown off in the storm.</span> ঝড়ে ছাদ উড়ে গেছে। কোনটা করানো আর কোনটা ঘটে যাওয়া, মানে থেকেই বোঝা যায়: কেউ নিজের ফোন চুরি করায় না। পরীক্ষায় এই দ্বিতীয় মানেটা কম আসে, কিন্তু গল্প আর খবরে খুব আসে, আর <span lang="en">right form</span>-এ V3-ই বসে, দুই মানেই।</p>

${mount("causatives-match")}

${mount("causatives-passive")}

${mount("causatives-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>বন্ধনীর ক্রিয়ার আগে <span lang="en">make, let, have + মানুষ</span>? খালি রূপ। <span lang="en">get + মানুষ</span>? <span lang="en">to</span> + খালি। <span lang="en">have, get + জিনিস</span>? V3। কৌশল: মাঝের শব্দটা মানুষ না জিনিস? মানুষ হলে ক্রিয়া, জিনিস হলে V3। <span lang="en">I had my brother (fix) the fan → fix</span>। <span lang="en">I had the fan (fix) → fixed</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">make</span> passive হলে <span lang="en">to</span> ফিরে আসে: <span lang="en">Coach made us run</span>, কিন্তু <span lang="en">We were made to run</span>। <span lang="en">let</span>-এর passive সাধারণত <span lang="en">allowed to</span>: <span lang="en">We were allowed to go.</span> আর <span lang="en">suggest</span>-এর পরে কখনো <span lang="en">to</span> নয়: <span lang="en">She suggested me to go</span> ভুল, <span lang="en">She suggested that I go</span> বা <span lang="en">suggested going</span> ঠিক।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>মাঝের শব্দটা মানুষ হলেই খালি ক্রিয়া নয়; সেটা নির্ভর করে মানুষটা কাজটা <em>করছে</em> নাকি তার <em>উপর</em> কাজ হচ্ছে। <span lang="en">I had the doctor examine me</span>: ডাক্তার পরীক্ষা করছেন, খালি ক্রিয়া। <span lang="en">I had my son examined by the doctor</span>: ছেলেকে পরীক্ষা করানো হলো, ছেলে কিছু করছে না, V3। কৌশলটা তাই আসলে "মানুষ না জিনিস" নয়, "মাঝের জন করছে, না তার উপর হচ্ছে"। বেশিরভাগ বাক্যে দুটো এক কথা, কিন্তু পরীক্ষা মাঝেমধ্যে এই ব্যতিক্রমটাই বসায়।</p>
</div>

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<ol class="step-list">
<li><strong>Right form of verbs:</strong> বন্ধনীর ক্রিয়ার আগে <span lang="en">make/let/have/get</span> দেখলে থামো। তারপর মাঝের শব্দ: করছে না তার উপর হচ্ছে। <span lang="en">She made me (wait). → wait</span>। <span lang="en">She got the letter (post). → posted</span>।</li>
<li><strong>Transformation, active থেকে passive:</strong> <span lang="en">make</span> passive-এ <span lang="en">to</span> পায়: <span lang="en">They made him apologise. → He was made to apologise.</span> <span lang="en">let</span> হয় <span lang="en">was allowed to</span>।</li>
<li><strong>Completing sentence:</strong> <span lang="en">I had my hair …</span> দেখলে V3: <span lang="en">cut</span>। <span lang="en">Ma didn't let me …</span> দেখলে খালি: <span lang="en">go out</span>।</li>
<li><strong>Error correction:</strong> খুঁজবে <span lang="en">made me to go</span> (বাড়তি <span lang="en">to</span>), <span lang="en">got him help</span> (হারানো <span lang="en">to</span>), <span lang="en">had my phone repair</span> (V3 নয়), <span lang="en">suggested me to</span>।</li>
<li><strong>Translation:</strong> বাংলার "-ালাম / -িয়ে নিলাম / -তে দিলাম" দেখলেই causative। "করালাম" <span lang="en">had/got … done</span>, "করতে দিলাম" <span lang="en">let</span>, "করতে বাধ্য করলাম" <span lang="en">made</span>।</li>
</ol>

<div class="ex"><b>একটা নমুনা:</b> প্রশ্ন: <span lang="en">Fill in the gaps: The coach (a) ___ (make) us (b) ___ (run) five laps, and then he (c) ___ (have) the ground (d) ___ (clean).</span> ধাপ: (a) গল্প অতীতে, <span lang="en">made</span>। (b) <span lang="en">made + us</span>, আমরা দৌড়াচ্ছি, খালি: <span lang="en">run</span>। (c) অতীত, <span lang="en">had</span>। (d) <span lang="en">had + the ground</span>, মাঠের উপর কাজ, V3: <span lang="en">cleaned</span>। উত্তর: <span lang="en">made, run, had, cleaned</span>।</div>

${mount("causatives-build")}

${mount("causatives-spot")}

${mount("causatives-exam")}

<div class="checklist">
<p>পর্ব শেষে নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>পাঁচটা causative ক্রিয়া জোরের সিঁড়িতে সাজাতে পারি (<span lang="en">let, help, have, get, make</span>)?</li>
<li>কোনটা <span lang="en">to</span> নেয় বলতে পারি (শুধু <span lang="en">get</span>, মানুষের সাথে)?</li>
<li>মাঝের জন করছে না তার উপর হচ্ছে, দেখে খালি নাকি V3 বেছে নিতে পারি?</li>
<li><span lang="en">have + জিনিস + V3</span> সাত কালে বলতে পারি?</li>
<li><span lang="en">made to</span> আর <span lang="en">allowed to</span>, passive-এর দুই রূপ মনে আছে?</li>
<li><span lang="en">suggest</span>-এর পরে কী বসে আর কী বসে না, জানি?</li>
</ul>
</div>

${mount("causatives-drill")}
`,
  blocks: {
    "causatives-pattern": {
      kind: "pattern",
      title: { bn: "করা, নাকি করানো", en: "Doing it, or having it done" },
      shape: "make / let / have + PERSON + VERB  ·  get + PERSON + to VERB  ·  have / get + THING + V3",
      why: { bn: "মাঝের শব্দটা মানুষ হলে তার পরে ক্রিয়া (get-এ to সহ)। মাঝের শব্দটা জিনিস হলে তার পরে V3, কারণ জিনিসটা নিজে কিছু করে না, তার উপর কাজ হয়।", en: "If the word in the middle is a person, a verb follows (with to after get). If it is a thing, V3 follows, because a thing does nothing itself; something is done to it." },
      examples: [
        { target: "Coach made us run ten laps.", bn: "কোচ আমাদের দশ চক্কর দৌড় করালেন।" },
        { target: "Ma let me watch the final.", bn: "মা আমাকে ফাইনাল দেখতে দিলেন।" },
        { target: "I had the mechanic check the bike.", bn: "আমি মেকানিককে দিয়ে সাইকেলটা দেখালাম।" },
        { target: "I got Rafi to help me with the bags.", bn: "আমি রাফিকে রাজি করিয়ে ব্যাগগুলো নিয়ে সাহায্য নিলাম।" },
        { target: "I had my phone repaired yesterday.", bn: "আমি কাল ফোনটা সারিয়ে নিয়েছি।" },
      ],
      tip: { bn: "I cut my hair = নিজে কাঁচি হাতে। I had my hair cut = সেলুনে গেছি।", en: "I cut my hair means scissors in hand. I had my hair cut means a trip to the barber." },
    },
    "causatives-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: কাকে দিয়ে কী", en: "Listen, say: who was made to do what" },
      lines: [
        { target: "The rain made us stop the match.", bn: "বৃষ্টি আমাদের ম্যাচ থামাতে বাধ্য করল।" },
        { target: "Nanu let the children stay up late.", bn: "নানু বাচ্চাদের দেরি করে জাগতে দিলেন।" },
        { target: "We had the roof fixed before the monsoon.", bn: "বর্ষার আগে আমরা ছাদটা সারিয়ে নিলাম।" },
        { target: "She got her brother to carry the bags.", bn: "সে তার ভাইকে দিয়ে ব্যাগগুলো বহন করাল।" },
        { target: "You should get your eyes tested.", bn: "তোমার চোখ পরীক্ষা করানো উচিত।" },
        { target: "I saw him leave the ground.", bn: "আমি তাকে মাঠ ছেড়ে যেতে দেখলাম।" },
      ],
    },
    "causatives-ladder": {
      kind: "order",
      title: { bn: "জোরের সিঁড়ি", en: "The ladder of force" },
      note: { bn: "সবচেয়ে কম জোর থেকে সবচেয়ে বেশি জোরে সাজাও: যাকে দিয়ে করানো হলো, সে কতটা চেয়েছিল?", en: "Order from least force to most: how much did the person want to do it?" },
      items: [
        { text: { bn: "let: সে চেয়েছিল, আমি শুধু বাধা দিইনি", en: "let: they wanted to, and I did not stand in the way" } },
        { text: { bn: "help: ও করছে, আমি হাত লাগালাম", en: "help: they are doing it, and I lent a hand" } },
        { text: { bn: "have: তার কাজ, আমি বললাম, ও করল", en: "have: it is their job; I said, they did" } },
        { text: { bn: "get: রাজি করাতে হয়েছে, বুঝিয়ে বা অনুরোধ করে", en: "get: they had to be persuaded, by argument or request" } },
        { text: { bn: "make: ওর মত ছিল না, করতেই হয়েছে", en: "make: they had no say; they simply had to" }, why: { bn: "সিঁড়িটা মনে থাকলে মানে থেকে ক্রিয়া বেরিয়ে আসে: Ma let me go আর Ma made me go, একটায় আমি চেয়েছিলাম, অন্যটায় চাইনি।", en: "With the ladder in mind the meaning picks the verb: Ma let me go and Ma made me go, wanted in one and not in the other." } },
      ],
    },
    "causatives-tense": {
      kind: "gap",
      title: { bn: "একই ছাঁচ, বদলায় শুধু কাল", en: "Same pattern, only the tense moves" },
      note: { bn: "প্রতিটায় have বা get-এর সঠিক রূপ বসাও। শেষের V3 কখনো বদলায় না।", en: "Put in the right form of have or get each time. The V3 at the end never changes." },
      items: [
        { text: "Look, Rafi ___ his bat repaired at the shop right now.", bn: "দেখো, রাফি এখন দোকানে ব্যাটটা সারাচ্ছে।", options: ["has", "is having", "had"], right: 1, why: { bn: "right now, continuous: is having।", en: "Right now, continuous: is having." } },
        { text: "We ___ the house painted every two years.", bn: "আমরা প্রতি দুই বছরে বাড়িটা রং করাই।", options: ["have", "are having", "have had"], right: 0, why: { bn: "every two years, অভ্যাস: present simple have।", en: "Every two years, a habit: present simple have." } },
        { text: "Ma has just ___ the sofa cleaned.", bn: "মা এইমাত্র সোফাটা পরিষ্কার করিয়েছেন।", options: ["had", "have", "having"], right: 0, why: { bn: "just, present perfect: has had। প্রথম has সাহায্যকারী, দ্বিতীয় had causative, V3 রূপে।", en: "Just, present perfect: has had. The first has is the helper, the second had the causative, in V3." } },
        { text: "Nanu ___ her eyes tested last month.", bn: "নানু গত মাসে চোখ পরীক্ষা করিয়েছেন।", options: ["has had", "had", "is having"], right: 1, why: { bn: "last month বন্ধ সময়: past simple had।", en: "Last month is closed time: past simple had." } },
        { text: "You should ___ that tooth looked at.", bn: "তোমার ওই দাঁতটা দেখানো উচিত।", options: ["get", "got", "getting"], right: 0, why: { bn: "modal-এর পরে খালি: should get।", en: "After a modal, the bare form: should get." } },
        { text: "I hate ___ my hair cut; the barber talks too much.", bn: "চুল কাটাতে আমার ভালো লাগে না; নাপিত বেশি কথা বলে।", options: ["get", "getting", "got"], right: 1, why: { bn: "hate + -ing: hate getting। পর্ব ১৮।", en: "Hate + -ing: hate getting. Part 18." } },
      ],
    },
    "causatives-bins": {
      kind: "bins",
      title: { bn: "তিন দল: খালি, to, নাকি কোনোটাই নয়", en: "Three groups: bare, to, or neither" },
      note: { bn: "প্রতিটা ক্রিয়ার পরে 'কাউকে' বসলে তার পরে কী আসে?", en: "After each verb plus a person, what follows?" },
      bins: [
        { id: "bare", label: { bn: "কাউকে + খালি ক্রিয়া", en: "person + bare verb" } },
        { id: "to", label: { bn: "কাউকে + to", en: "person + to" } },
        { id: "never", label: { bn: "কাউকে + to বসেই না", en: "never person + to" } },
      ],
      items: [
        { text: { bn: "make", en: "make" }, bin: "bare", why: { bn: "make + কাউকে + খালি।", en: "Make + person + bare verb." } },
        { text: { bn: "let", en: "let" }, bin: "bare", why: { bn: "let + কাউকে + খালি।", en: "Let + person + bare verb." } },
        { text: { bn: "have", en: "have" }, bin: "bare", why: { bn: "have + কাউকে + খালি।", en: "Have + person + bare verb." } },
        { text: { bn: "see / hear / watch", en: "see / hear / watch" }, bin: "bare", why: { bn: "অনুভূতির ক্রিয়া: saw him leave। (-ing-ও চলে।)", en: "A verb of the senses: saw him leave. (-ing works too.)" } },
        { text: { bn: "get", en: "get" }, bin: "to", why: { bn: "get + কাউকে + to। causative পরিবারে একমাত্র।", en: "Get + person + to. The only one in the causative family." } },
        { text: { bn: "want / would like", en: "want / would like" }, bin: "to", why: { bn: "want you to come।", en: "Want you to come." } },
        { text: { bn: "ask / tell / advise", en: "ask / tell / advise" }, bin: "to", why: { bn: "asked me to wait, advised him to rest।", en: "Asked me to wait, advised him to rest." } },
        { text: { bn: "allow / force / remind", en: "allow / force / remind" }, bin: "to", why: { bn: "allowed us to go, forced him to sign, reminded me to call।", en: "Allowed us to go, forced him to sign, reminded me to call." } },
        { text: { bn: "suggest", en: "suggest" }, bin: "never", why: { bn: "suggest + -ing বা that; suggest me to বলে কিছু নেই।", en: "Suggest + -ing or that; there is no suggest me to." } },
        { text: { bn: "recommend", en: "recommend" }, bin: "never", why: { bn: "recommend + -ing বা that, suggest-এর মতো।", en: "Recommend + -ing or that, like suggest." } },
      ],
    },
    "causatives-gap": {
      kind: "gap",
      title: { bn: "খালি, to, নাকি V3", en: "Bare, to, or V3" },
      items: [
        { text: "The teacher made us ___ the essay again.", bn: "শিক্ষক আমাদের রচনাটা আবার লেখালেন।", options: ["write", "to write", "written"], right: 0, why: { bn: "make + মানুষ + খালি ক্রিয়া।", en: "Make + person + bare verb." } },
        { text: "I got my cousin ___ me with maths.", bn: "আমি আমার কাজিনকে দিয়ে অঙ্কে সাহায্য করালাম।", options: ["help", "to help", "helped"], right: 1, why: { bn: "get + মানুষ + to। get-ই একমাত্র to নেয়।", en: "Get + person + to. Get is the only one that takes to." } },
        { text: "We had the house ___ last month.", bn: "গত মাসে আমরা বাড়িটা রং করিয়েছি।", options: ["paint", "to paint", "painted"], right: 2, why: { bn: "have + জিনিস + V3: বাড়িটা রং করা হলো, আমরা করালাম।", en: "Have + thing + V3: the house was painted, and we had it done." } },
        { text: "Ma didn't let me ___ out after dark.", bn: "মা আমাকে সন্ধ্যার পর বাইরে যেতে দেননি।", options: ["go", "to go", "going"], right: 0, why: { bn: "let + মানুষ + খালি।", en: "Let + person + bare verb." } },
        { text: "Rafi is having his bat ___.", bn: "রাফি তার ব্যাটটা মেরামত করাচ্ছে।", options: ["repair", "repairing", "repaired"], right: 2, why: { bn: "have + জিনিস + V3, continuous-এ having।", en: "Have + thing + V3, with having in the continuous." } },
        { text: "The doctor advised Nanu ___ more.", bn: "ডাক্তার নানুকে আরও বিশ্রাম নিতে বললেন।", options: ["rest", "to rest", "resting"], right: 1, why: { bn: "advise + মানুষ + to।", en: "Advise + person + to." } },
      ],
    },
    "causatives-match": {
      kind: "match",
      title: { bn: "বাংলার ক্রিয়া, ইংরেজির ছাঁচ", en: "The Bangla verb, the English pattern" },
      note: { bn: "বাংলার কথাটা যে ইংরেজি ছাঁচে যায়, সেটার সাথে মেলাও।", en: "Match each Bangla phrase to the English pattern it takes." },
      pairs: [
        { left: { bn: "যেতে দিলাম", en: "I allowed it" }, right: { bn: "let me go", en: "let me go" } },
        { left: { bn: "যেতে বাধ্য করলাম", en: "I forced it" }, right: { bn: "made me go", en: "made me go" } },
        { left: { bn: "রাজি করিয়ে যাওয়ালাম", en: "I persuaded" }, right: { bn: "got me to go", en: "got me to go" } },
        { left: { bn: "সারিয়ে নিলাম", en: "I arranged the repair" }, right: { bn: "had it repaired", en: "had it repaired" } },
        { left: { bn: "চুরি হয়ে গেল (আমার)", en: "it was stolen from me" }, right: { bn: "had it stolen", en: "had it stolen" } },
        { left: { bn: "যেতে সাহায্য করলাম", en: "I helped" }, right: { bn: "helped me go", en: "helped me go" } },
      ],
    },
    "causatives-passive": {
      kind: "compare",
      title: { bn: "active-এ খালি, passive-এ to", en: "Bare in the active, to in the passive" },
      note: { bn: "make আর let দুটোই active-এ খালি ক্রিয়া নেয়; passive-এ to ফিরে আসে, আর let ধার করে allowed to। এই দুই লাইন transformation-এ প্রতি বছর।", en: "Make and let both take a bare verb in the active; in the passive the to comes back, and let borrows allowed to. These two lines come up in transformation every year." },
      columns: [{ bn: "active", en: "active" }, { bn: "passive", en: "passive" }],
      rows: [
        { label: { bn: "make", en: "make" }, cells: [{ bn: "Coach made us run.", en: "Coach made us run." }, { bn: "We were made to run.", en: "We were made to run." }] },
        { label: { bn: "let", en: "let" }, cells: [{ bn: "Ma let me go.", en: "Ma let me go." }, { bn: "I was allowed to go.", en: "I was allowed to go." }] },
        { label: { bn: "see", en: "see" }, cells: [{ bn: "I saw him leave.", en: "I saw him leave." }, { bn: "He was seen to leave.", en: "He was seen to leave." }] },
        { label: { bn: "have (মানুষ)", en: "have (person)" }, cells: [{ bn: "I had him fix it.", en: "I had him fix it." }, { bn: "passive হয় না; বদলে He was asked to fix it.", en: "no passive; instead He was asked to fix it." }] },
      ],
    },
    "causatives-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "I had my hair cut. কে চুল কাটল?", en: "I had my hair cut. Who cut the hair?" },
          options: [
            { text: { bn: "আমি নিজে", en: "I did" }, why: { bn: "না। নিজে কাটলে I cut my hair। had … cut মানে অন্য কেউ।", en: "No. Cutting it myself would be I cut my hair. Had … cut means somebody else." } },
            { text: { bn: "অন্য কেউ, যেমন নাপিত", en: "Somebody else, such as a barber" }, right: true, why: { bn: "হ্যাঁ। have + জিনিস + V3: কাজটা করানো হয়েছে।", en: "Yes. Have + thing + V3: the job was done for me." } },
            { text: { bn: "বাক্যটা ভুল", en: "The sentence is wrong" }, why: { bn: "না। এটাই ছাঁচ, আর এটাই ইংরেজিতে চুল কাটানোর কথা বলার একমাত্র স্বাভাবিক উপায়।", en: "No. This is the pattern, and the only natural way to talk about a haircut in English." } },
          ],
        },
        {
          ask: { bn: "কোনটা ঠিক?", en: "Which is right?" },
          options: [
            { text: { bn: "She suggested me to leave.", en: "She suggested me to leave." }, why: { bn: "না। suggest-এর পরে কাউকে + to বসে না।", en: "No. Suggest never takes somebody + to." } },
            { text: { bn: "She suggested that I leave.", en: "She suggested that I leave." }, right: true, why: { bn: "হ্যাঁ। suggest + that, বা suggest + -ing।", en: "Yes. Suggest + that, or suggest + -ing." } },
            { text: { bn: "She suggested to leave.", en: "She suggested to leave." }, why: { bn: "না। suggest + to নয়: suggested leaving।", en: "No. Not suggest + to: suggested leaving." } },
          ],
        },
        {
          ask: { bn: "Rafi had his phone stolen. এখানে কী হয়েছে?", en: "Rafi had his phone stolen. What happened here?" },
          options: [
            { text: { bn: "রাফি কাউকে দিয়ে ফোন চুরি করিয়েছে", en: "Rafi got somebody to steal a phone" }, why: { bn: "না। ছাঁচটা এক, কিন্তু মানে থেকে বোঝা যায়: কেউ নিজের ফোন চুরি করায় না।", en: "No. Same pattern, but the sense tells you: nobody arranges to have their own phone stolen." } },
            { text: { bn: "রাফির ফোন চুরি হয়ে গেছে, তার সাথে ঘটেছে", en: "Rafi's phone was stolen; it happened to him" }, right: true, why: { bn: "হ্যাঁ। have + জিনিস + V3 এর দ্বিতীয় মানে: ক্ষতি, ঘটে যাওয়া।", en: "Yes. The second sense of have + thing + V3: a loss, something that happened to you." } },
            { text: { bn: "রাফি নিজে ফোন চুরি করেছে", en: "Rafi stole a phone himself" }, why: { bn: "না। নিজে করলে Rafi stole a phone। had … stolen মানে তার নিজের ফোন গেছে।", en: "No. Doing it himself would be Rafi stole a phone. Had … stolen means his own phone went." } },
          ],
        },
      ],
    },
    "causatives-build": {
      kind: "build",
      title: { bn: "শব্দ সাজাও: কে কাকে কী করাল", en: "Build it: who had whom do what" },
      note: { bn: "প্রতিটা বাক্যে একটা causative। get-এর to আর জিনিসের V3 কোথায় বসে, দেখো।", en: "One causative per sentence. Watch where get's to and the thing's V3 go." },
      pattern: "make / let / have + person + verb  ·  get + person + to verb  ·  have / get + thing + V3",
      lines: [
        { target: "Coach made us run ten laps.", bn: "কোচ আমাদের দশ চক্কর দৌড় করালেন।" },
        { target: "I got Rafi to carry the bags.", bn: "আমি রাফিকে রাজি করিয়ে ব্যাগগুলো বহন করালাম।" },
        { target: "We had the roof fixed before the rain.", bn: "বৃষ্টির আগে আমরা ছাদটা সারিয়ে নিলাম।" },
        { target: "Ma didn't let me stay out late.", bn: "মা আমাকে দেরি করে বাইরে থাকতে দেননি।" },
        { target: "Nanu is having her eyes tested today.", bn: "নানু আজ চোখ পরীক্ষা করাচ্ছেন।" },
        { target: "We were made to wait outside.", bn: "আমাদের বাইরে অপেক্ষা করতে বাধ্য করা হলো।" },
      ],
    },
    "causatives-spot": {
      kind: "spot",
      title: { bn: "রাফির ডায়েরি: মেরামতের দিন", en: "Rafi's diary: repair day" },
      note: { bn: "যে লাইনে causative-এর ভুল, সেটা ছোঁও। খালি, to, নাকি V3, তিনটার দিকেই নজর।", en: "Tap every line with a causative mistake. Watch all three: bare, to, and V3." },
      source: { bn: "রাফির ডায়েরি, শনিবার", en: "Rafi's diary, Saturday" },
      lines: [
        { text: { bn: "This morning Ma made me to clean my room.", en: "This morning Ma made me to clean my room." }, flag: { bn: "make + কাউকে + খালি: made me clean।", en: "Make + person + bare verb: made me clean." } },
        { text: { bn: "Then I had my bike repaired at the corner shop.", en: "Then I had my bike repaired at the corner shop." } },
        { text: { bn: "I got Mitu help me carry it there.", en: "I got Mitu help me carry it there." }, flag: { bn: "get + কাউকে + to: got Mitu to help।", en: "Get + person + to: got Mitu to help." } },
        { text: { bn: "The mechanic let me watch him work.", en: "The mechanic let me watch him work." } },
        { text: { bn: "In the afternoon Baba had the fan fix.", en: "In the afternoon Baba had the fan fix." }, flag: { bn: "have + জিনিস + V3: had the fan fixed।", en: "Have + thing + V3: had the fan fixed." } },
        { text: { bn: "Nanu suggested us to eat out to celebrate.", en: "Nanu suggested us to eat out to celebrate." }, flag: { bn: "suggest + কাউকে + to নয়: suggested eating out, বা suggested that we eat out।", en: "No suggest + person + to: suggested eating out, or suggested that we eat out." } },
        { text: { bn: "We were allowed to stay up late.", en: "We were allowed to stay up late." } },
      ],
    },
    "causatives-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "তিনটা প্রশ্ন, তিন রকম। প্রতিটায় মাঝের জন করছে না তার উপর হচ্ছে, সেটা আগে ঠিক করো।", en: "Three questions, three kinds. First decide each time: is the one in the middle doing it, or having it done to them?" },
      questions: [
        {
          ask: { bn: "Right form: They made him (apologise) in front of the class. Passive-এ?", en: "Right form: They made him (apologise) in front of the class. And in the passive?" },
          options: [
            { text: { bn: "apologise; He was made to apologise", en: "apologise; He was made to apologise" }, right: true, why: { bn: "হ্যাঁ। active-এ খালি, passive-এ to ফিরে আসে।", en: "Yes. Bare in the active, and the to comes back in the passive." } },
            { text: { bn: "to apologise; He was made apologise", en: "to apologise; He was made apologise" }, why: { bn: "না। ঠিক উল্টো: active-এ to নয়, passive-এ to।", en: "No. Exactly backwards: no to in the active, to in the passive." } },
            { text: { bn: "apologised; He was made apologised", en: "apologised; He was made apologised" }, why: { bn: "না। মাঝের জন (him) নিজে ক্ষমা চাইছে, তাই V3 নয়।", en: "No. The one in the middle (him) is doing the apologising, so not V3." } },
          ],
        },
        {
          ask: { bn: "I had my son (examine) by the doctor. বন্ধনীতে কী?", en: "I had my son (examine) by the doctor. What goes in the brackets?" },
          options: [
            { text: { bn: "examine", en: "examine" }, why: { bn: "না। মাঝে মানুষ ঠিকই, কিন্তু ছেলে পরীক্ষা করছে না, তার উপর হচ্ছে; by the doctor সেটাই বলে।", en: "No. A person in the middle, yes, but the son is not examining; he is being examined. By the doctor says so." } },
            { text: { bn: "examined", en: "examined" }, right: true, why: { bn: "হ্যাঁ। ছেলের উপর কাজ হচ্ছে, তাই V3। কৌশল 'মানুষ না জিনিস' নয়, 'করছে না তার উপর হচ্ছে'।", en: "Yes. Something is done to the son, so V3. The trick is not person or thing, but doing or done to." } },
            { text: { bn: "to examine", en: "to examine" }, why: { bn: "না। had-এর পরে to কখনো নয়; to শুধু get-এর সাথে।", en: "No. Never to after had; to goes only with get." } },
          ],
        },
        {
          ask: { bn: "অনুবাদ: 'আমি কাল দাঁত তোলালাম।' কোনটা?", en: "Translate: 'I had a tooth taken out yesterday.' Which one?" },
          options: [
            { text: { bn: "I pulled my tooth yesterday.", en: "I pulled my tooth yesterday." }, why: { bn: "না। এটা নিজে টেনে তোলা। 'তোলালাম' মানে কাউকে দিয়ে।", en: "No. That is pulling it out yourself. The Bangla says somebody else did it." } },
            { text: { bn: "I had a tooth taken out yesterday.", en: "I had a tooth taken out yesterday." }, right: true, why: { bn: "হ্যাঁ। বাংলার '-ালাম' ইংরেজিতে had + জিনিস + V3।", en: "Yes. The Bangla causative ending is had + thing + V3 in English." } },
            { text: { bn: "I had taken out a tooth yesterday.", en: "I had taken out a tooth yesterday." }, why: { bn: "না। এটা past perfect, আমি নিজে তুলেছি, আর yesterday-র সাথে বসেও না।", en: "No. That is past perfect, me doing it, and it does not sit with yesterday either." } },
          ],
        },
      ],
    },
    "causatives-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "বাসায় কে কাকে কী করায়, চারটা: Ma makes me… Baba lets me… Nanu has me…", en: "Who makes whom do what at home, four sentences: Ma makes me… Baba lets me… Nanu has me…" } },
        { text: { bn: "এ মাসে যা করিয়েছ, তিনটা have + জিনিস + V3: I had my phone repaired…", en: "Three things you had done this month, have + thing + V3: I had my phone repaired…" } },
        { text: { bn: "একজন অলস বন্ধুকে দিয়ে তিনটা কাজ করাও: I got him to…", en: "Three things you got a lazy friend to do: I got him to…" } },
        { text: { bn: "একটা কাজ, সাত কাল: I have my bike serviced / am having / had / have had / will have / must get / enjoy getting…", en: "One job in seven tenses: I have my bike serviced / am having / had / have had / will have / must get / enjoy getting…" } },
        { text: { bn: "জোরের সিঁড়ি একটা কাজে: Ma let me… helped me… had me… got me to… made me… প্রতিটায় মানে কীভাবে বদলায়, বলো।", en: "The ladder of force on one task: Ma let me… helped me… had me… got me to… made me… Say how the meaning shifts each step." } },
        { text: { bn: "খেলা: একজন active বলবে (They made us wait), অন্যজন সাথে সাথে passive (We were made to wait)। পাঁচটা, তারপর পালা বদল।", en: "A game: one says the active (They made us wait), the other answers at once in the passive (We were made to wait). Five, then swap." } },
      ],
    },
  },
};
