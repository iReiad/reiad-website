/* ============================================================
   15-passive.ts: পর্ব ১৫, কে করল জানা নেই: passive voice.

   One part of the grammar term, gathered into the rung by
   `middle.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>খবরের কাগজে লেখা: <span lang="en">The match was won by Bangladesh.</span> রাফি ভাবল, <span lang="en">Bangladesh won the match</span> লিখলেই তো হতো, ছোট, সোজা। ঠিক। কিন্তু পরের খবরটা দেখো: <span lang="en">The stadium was built in 2006.</span> কে বানাল? জানা নেই, বা জরুরি নয়। কর্তা যখন হারিয়ে যায়, বা কর্তার চেয়ে কাজটাই বড় খবর, তখন বাক্য উল্টে যায়। এর নাম <span lang="en">passive voice</span>। খবর, বিজ্ঞান, নিয়ম আর অফিসের ভাষা এখানেই থাকে, আর পরীক্ষায় <span lang="en">voice change</span> নামে প্রতি বছর আসে।</p>

<p>এই পর্বে মেশিনটা তিন ধাপে, <span lang="en">be</span>-র আট কালের ছক, কখন passive লাগে আর কখন লাগে না, প্রশ্ন আর আদেশের passive, দুটো কর্মের বাক্য, <span lang="en">by</span> কখন বাদ, যে ক্রিয়াগুলোর passive হয় না, আর <span lang="en">voice change</span>-এর সেই সাতটা ফাঁদ যেখানে নম্বর যায়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">active</span>: কর্তা + ক্রিয়া + কর্ম। <span lang="en">Rafi broke the window.</span></li>
<li><span lang="en">passive</span>: কর্ম + <span lang="en">be</span> + V3 (+ <span lang="en">by</span> কর্তা)। <span lang="en">The window was broken by Rafi.</span></li>
<li><span lang="en">be</span>-র কালটা মূল বাক্যের কাল বহন করে: <span lang="en">is broken, was broken, will be broken, has been broken</span>।</li>
<li>V3 কখনো বদলায় না। যে ক্রিয়ার V3 জানো না, তার passive পারবে না।</li>
<li>কর্ম না থাকলে passive হয় না: <span lang="en">Rafi sleeps</span>-এর passive নেই।</li>
<li>কর্তা <span lang="en">someone, people, they, we</span> হলে <span lang="en">by</span>-অংশ বাদ; নাম হলে থাকে।</li>
</ul>
</div>

${mount("passive-pattern")}

<h2>মেশিনটা তিন ধাপে</h2>

<ol class="step-list">
<li><strong>কর্মটাকে সামনে আনো।</strong> <span lang="en">Rafi broke <em>the window</em>.</span> কর্ম <span lang="en">the window</span>, সে এখন বাক্যের শুরুতে: <span lang="en">The window …</span></li>
<li><strong>মূল ক্রিয়ার কাল দেখে সেই কালের <span lang="en">be</span> বসাও, তারপর V3।</strong> <span lang="en">broke</span> অতীত, তাই <span lang="en">was</span>; <span lang="en">break</span>-এর V3 <span lang="en">broken</span>: <span lang="en">The window was broken …</span></li>
<li><strong>পুরনো কর্তাকে <span lang="en">by</span> দিয়ে শেষে, যদি দরকার হয়।</strong> <span lang="en">The window was broken by Rafi.</span> কর্তা <span lang="en">someone, people, they</span> হলে বাদ: <span lang="en">The window was broken.</span></li>
</ol>

<p>কর্তা যদি pronoun হয়, <span lang="en">by</span>-এর পরে কর্ম-রূপ: <span lang="en">She wrote it. It was written by her.</span> পর্ব ৩ মনে করো। আর কর্ম যদি pronoun হয়, সামনে গিয়ে কর্তা-রূপ: <span lang="en">Rafi called me. I was called by Rafi.</span> <span lang="en">Me was called</span> নয়।</p>

${mount("passive-order")}

<h2>be-র কালের ছক</h2>

<p>passive-এর পুরো খেলা <span lang="en">be</span>-র কালে। মূল বাক্যে কাল যা, <span lang="en">be</span>-কে সেই কালে নাও, আর V3 বসাও। <span lang="en">write</span> দিয়ে:</p>

<div class="table-scroll">
<table>
<thead><tr><th>কাল</th><th>active</th><th>passive</th></tr></thead>
<tbody>
<tr><td>present simple</td><td><span lang="en">She writes a letter.</span></td><td><span lang="en">A letter is written.</span></td></tr>
<tr><td>present continuous</td><td><span lang="en">She is writing a letter.</span></td><td><span lang="en">A letter is being written.</span></td></tr>
<tr><td>past simple</td><td><span lang="en">She wrote a letter.</span></td><td><span lang="en">A letter was written.</span></td></tr>
<tr><td>past continuous</td><td><span lang="en">She was writing a letter.</span></td><td><span lang="en">A letter was being written.</span></td></tr>
<tr><td>present perfect</td><td><span lang="en">She has written a letter.</span></td><td><span lang="en">A letter has been written.</span></td></tr>
<tr><td>past perfect</td><td><span lang="en">She had written a letter.</span></td><td><span lang="en">A letter had been written.</span></td></tr>
<tr><td>future</td><td><span lang="en">She will write a letter.</span></td><td><span lang="en">A letter will be written.</span></td></tr>
<tr><td>modal</td><td><span lang="en">She must write a letter.</span></td><td><span lang="en">A letter must be written.</span></td></tr>
<tr><td><span lang="en">going to</span></td><td><span lang="en">She is going to write a letter.</span></td><td><span lang="en">A letter is going to be written.</span></td></tr>
</tbody>
</table>
</div>

<p>দুটো ছোট কৌশল: <span lang="en">-ing</span> থাকলে <span lang="en">being</span> আসে, <span lang="en">have</span> থাকলে <span lang="en">been</span> আসে, আর modal বা <span lang="en">will</span> থাকলে খালি <span lang="en">be</span>। বাকি সব শুধু <span lang="en">is/are/was/were</span>। আর তিনটা ঘর passive-এ প্রায় বসে না, কারণ শুনতে ভারী: future continuous আর দুটো perfect continuous। <span lang="en">will be being written</span> ব্যাকরণে ঠিক, কানে অসহ্য; পরীক্ষায় আসে না।</p>

<p><span lang="en">be</span>-র সংখ্যাও মেলাতে হয়: নতুন কর্তা (পুরনো কর্ম) একজন না অনেক। <span lang="en">She wrote two letters. Two letters were written.</span> <span lang="en">was written</span> নয়, কারণ <span lang="en">letters</span> অনেক। পর্ব ৬-এর টুপি passive-এও চলে।</p>

${mount("passive-tenses")}

${mount("passive-lines")}

<h2>কখন passive লাগে, আর কখন লাগে না</h2>

<p>চারটা কারণে। (১) কর্তা জানা নেই: <span lang="en">My bike was stolen.</span> কে চুরি করল, জানি না। (২) কর্তা জরুরি নয়, কাজটাই খবর: <span lang="en">The new bridge was opened yesterday.</span> (৩) কর্তা সবাই জানে: <span lang="en">Rice is grown in Bangladesh.</span> কৃষকরা, বলার দরকার নেই। (৪) নিয়ম আর নোটিশ, যেখানে কারও নাম নেওয়া হয় না: <span lang="en">Mobile phones must be switched off. English is spoken here.</span> বিজ্ঞান বইয়ের অর্ধেক passive: <span lang="en">Water is heated to 100 degrees. The mixture was stirred.</span></p>

<p>আর কখন লাগে না: যখন কর্তাই খবর। <span lang="en">Shakib took five wickets</span> বলার সময় কেউ <span lang="en">Five wickets were taken by Shakib</span> বলে না, কারণ শাকিবই আসল কথা। active ছোট, সোজা, জোরালো; passive দূরের, ভারী, আনুষ্ঠানিক। রচনায় বেশি passive লিখলে স্যার লেখেন "বাক্য ভারী"। নিয়ম: কর্তা জানা আর জরুরি হলে active।</p>

<p>দুটো <span lang="en">by</span>-র নিয়ম। কর্তা <span lang="en">someone, somebody, people, they, we, nobody</span> হলে <span lang="en">by</span>-অংশ বাদ, কারণ ওটা কোনো তথ্য দেয় না: <span lang="en">Someone stole my bike. My bike was stolen.</span> কর্তা নাম বা নির্দিষ্ট কেউ হলে থাকে: <span lang="en">by Rafi, by the coach</span>। আর যা দিয়ে করা হলো সেটা <span lang="en">with</span>: <span lang="en">The window was broken by Rafi with a ball.</span> পর্ব ৯ মনে করো।</p>

${mount("passive-when")}

<h2>যে ক্রিয়ার passive নেই</h2>

<p>passive-এর জন্য একটা কর্ম লাগে, কারণ কর্মটাই সামনে যায়। যে ক্রিয়ার কর্ম নেই, তার passive নেই: <span lang="en">sleep, go, come, arrive, die, happen, sit, laugh, cry</span>। <span lang="en">Rafi slept</span>-কে উল্টানো যায় না, কারণ কিছুই ঘুমানো হয়নি। পরীক্ষায় এমন বাক্য দিয়ে ফাঁদ পাতা হয়: <span lang="en">Change the voice: He arrived late.</span> উত্তর: হয় না, <span lang="en">intransitive verb</span>। একইভাবে <span lang="en">have</span> (মালিকানা), <span lang="en">resemble, lack, fit, suit</span>-এর passive হয় না: <span lang="en">I have a bat</span>, <span lang="en">A bat is had by me</span> নয়।</p>

<h2>প্রশ্ন আর আদেশের passive</h2>

<p>প্রশ্ন: আগে সাধারণ বাক্যের passive বানাও, তারপর পর্ব ১৩-র মেশিন। <span lang="en">Did Rafi break the window? Was the window broken by Rafi?</span> <span lang="en">Who broke the window? By whom was the window broken?</span> wh-প্রশ্নে wh-শব্দটা যদি কর্ম হয়, সেটা সামনে থেকে যায়: <span lang="en">What did he eat? What was eaten by him?</span> আদেশ: <span lang="en">Let + কর্ম + be + V3</span>। <span lang="en">Open the door. Let the door be opened.</span> <span lang="en">Do the work. Let the work be done.</span> না-বাচক আদেশে <span lang="en">Let … not be</span>: <span lang="en">Don't touch it. Let it not be touched.</span> আর <span lang="en">please</span> সহ অনুরোধে <span lang="en">You are requested to</span>: <span lang="en">Please help me. You are requested to help me.</span></p>

<div class="table-scroll">
<table>
<thead><tr><th>জাত</th><th>active</th><th>passive</th></tr></thead>
<tbody>
<tr><td>হ্যাঁ/না প্রশ্ন</td><td><span lang="en">Did Rafi break the window?</span></td><td><span lang="en">Was the window broken by Rafi?</span></td></tr>
<tr><td><span lang="en">who</span> কর্তা</td><td><span lang="en">Who broke the window?</span></td><td><span lang="en">By whom was the window broken?</span></td></tr>
<tr><td><span lang="en">what</span> কর্ম</td><td><span lang="en">What did he eat?</span></td><td><span lang="en">What was eaten by him?</span></td></tr>
<tr><td>আদেশ</td><td><span lang="en">Open the door.</span></td><td><span lang="en">Let the door be opened.</span></td></tr>
<tr><td>না-বাচক আদেশ</td><td><span lang="en">Don't tell a lie.</span></td><td><span lang="en">Let not a lie be told.</span></td></tr>
<tr><td>অনুরোধ</td><td><span lang="en">Please open the window.</span></td><td><span lang="en">You are requested to open the window.</span></td></tr>
<tr><td>দুটো কর্ম</td><td><span lang="en">He gave me a book.</span></td><td><span lang="en">I was given a book. / A book was given to me.</span></td></tr>
</tbody>
</table>
</div>

<p>শেষ সারিটা আলাদা করে: দুটো কর্ম থাকলে (কাকে, কী) যেকোনো একটাকে সামনে আনা যায়। মানুষটাকে সামনে আনলে বেশি স্বাভাবিক: <span lang="en">I was given a book.</span> জিনিসটাকে আনলে মানুষের আগে <span lang="en">to</span>: <span lang="en">A book was given to me.</span> পরীক্ষায় দুটোই ঠিক; প্রশ্নে একটা চাইলে সেটা।</p>

${mount("passive-gap")}

${mount("passive-reveal")}

<div class="ex"><b>Jurassic Park-এর বিজ্ঞানীরা passive-এ কথা বলে:</b> <span lang="en">The dinosaurs were cloned from ancient DNA. The park was built on an island. Every gate is controlled by computer.</span> কে ক্লোন করল, কে বানাল: কোম্পানি, তাই নাম নেই। আর তারপর Malcolm বলে, <span lang="en">Life finds a way.</span> active, তিন শব্দ, কারণ এখানে কর্তাই আসল খবর।</div>

<h2>voice change-এর সাতটা ফাঁদ</h2>

<div class="table-scroll">
<table>
<thead><tr><th>ভুল</th><th>ঠিক</th><th>কেন</th></tr></thead>
<tbody>
<tr><td><span lang="en">The window was broke.</span></td><td><span lang="en">The window was broken.</span></td><td>V3, V2 নয়</td></tr>
<tr><td><span lang="en">Two letters was written.</span></td><td><span lang="en">Two letters were written.</span></td><td><span lang="en">be</span> নতুন কর্তার সাথে মেলে</td></tr>
<tr><td><span lang="en">A letter is wrote by her.</span></td><td><span lang="en">A letter is written by her.</span></td><td>V3, আর <span lang="en">by</span>-এর পরে <span lang="en">her</span></td></tr>
<tr><td><span lang="en">The road is repairing.</span></td><td><span lang="en">The road is being repaired.</span></td><td><span lang="en">-ing</span> থাকলে <span lang="en">being</span></td></tr>
<tr><td><span lang="en">My bike was stolen by someone.</span></td><td><span lang="en">My bike was stolen.</span></td><td><span lang="en">someone</span> বাদ</td></tr>
<tr><td><span lang="en">He was arrived late.</span></td><td><span lang="en">He arrived late.</span></td><td><span lang="en">arrive</span>-এর passive নেই</td></tr>
<tr><td><span lang="en">The match will won.</span></td><td><span lang="en">The match will be won.</span></td><td><span lang="en">will</span>-এর পরে খালি <span lang="en">be</span></td></tr>
</tbody>
</table>
</div>

${mount("passive-spot")}

${mount("passive-build")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p><span lang="en">Change the voice</span>: পাঁচটা বাক্য, active থেকে passive বা উল্টো। উল্টোটাও আসে, তাই মেশিনটা দুই দিকে চালাতে জানো: passive থেকে active করতে <span lang="en">by</span>-এর পরের জনকে সামনে আনো, <span lang="en">be</span> সরাও, V3-কে মূল কালে ফেরাও। <span lang="en">by</span> না থাকলে একটা কর্তা বানাও: <span lang="en">someone, people, they</span>।</p>

<ol class="step-list">
<li><strong>কর্তা, ক্রিয়া, কর্ম মার্ক করো কলম দিয়ে।</strong> কর্ম নেই? তাহলে passive হয় না, লিখে দাও।</li>
<li><strong>কর্ম সামনে, কর্তা <span lang="en">by</span>-এর পরে শেষে।</strong> pronoun হলে রূপ বদলাও: <span lang="en">he</span> হয় <span lang="en">him</span>, <span lang="en">me</span> হয় <span lang="en">I</span>।</li>
<li><strong>ক্রিয়ার কাল দেখে <span lang="en">be</span>।</strong> <span lang="en">-ing</span> দেখলে <span lang="en">being</span>, <span lang="en">has/have/had</span> দেখলে <span lang="en">been</span>, <span lang="en">will/can/must</span> দেখলে খালি <span lang="en">be</span>। তারপর V3।</li>
<li><strong>নতুন কর্তার সাথে <span lang="en">be</span> মেলাও।</strong> অনেক হলে <span lang="en">are/were</span>।</li>
<li><strong><span lang="en">by</span> রাখব?</strong> <span lang="en">people, they, someone, nobody</span> হলে বাদ। দুটো কর্ম থাকলে যেকোনো একটা সামনে।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">(a) People speak English all over the world. (b) Rafi is repairing his bike. (c) Who wrote this poem? (d) Open the gate. (e) They have given her a prize.</span> উত্তর: (a) <span lang="en">English is spoken all over the world.</span> (<span lang="en">people</span> বাদ) (b) <span lang="en">His bike is being repaired by Rafi.</span> (<span lang="en">being</span>) (c) <span lang="en">By whom was this poem written?</span> (d) <span lang="en">Let the gate be opened.</span> (e) <span lang="en">She has been given a prize.</span> (<span lang="en">they</span> বাদ, <span lang="en">been</span>)। পাঁচটা বাক্য, পাঁচটা আলাদা ফাঁদ।</div>

${mount("passive-exam")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Voice change</span>-এ তিনটা জিনিস মার্ক করো কলম দিয়ে: কর্তা, ক্রিয়া, কর্ম। কর্ম সামনে, কর্তা <span lang="en">by</span>-এর পরে শেষে। ক্রিয়ার কাল দেখে <span lang="en">be</span>: <span lang="en">-ing</span> দেখলে <span lang="en">being</span>, <span lang="en">has/have/had</span> দেখলে <span lang="en">been</span>, <span lang="en">will/can/must</span> দেখলে খালি <span lang="en">be</span>। তারপর V3। কর্তা <span lang="en">people, they, someone, nobody</span> হলে <span lang="en">by</span> অংশ বাদ। দুটো কর্ম থাকলে (<span lang="en">He gave me a book</span>) যেকোনো একটাকে সামনে: <span lang="en">I was given a book. A book was given to me.</span></p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>V3 আর V2 এক নয়। <span lang="en">The window was broke</span> ভুল, <span lang="en">was broken</span> ঠিক। <span lang="en">The letter was wrote</span> ভুল, <span lang="en">was written</span> ঠিক। নিয়মিত ক্রিয়ায় দুটো এক (<span lang="en">played, played</span>) বলে রেবেলগুলোতে ভুল হয়। খাতার সংগ্রহে তিন রূপের তালিকাটা এই জন্যই।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>কিছু ক্রিয়ার সাথে <span lang="en">by</span> নয়, অন্য preposition: <span lang="en">known to</span> (<span lang="en">He is known to everyone</span>), <span lang="en">interested in</span>, <span lang="en">surprised at</span>, <span lang="en">pleased with</span>, <span lang="en">covered with</span>, <span lang="en">filled with</span>, <span lang="en">made of</span>। <span lang="en">The hill was covered with snow</span>, <span lang="en">by snow</span> নয়। এগুলো আসলে adjective হয়ে যাওয়া V3, আর প্রতিটার নিজের জোড়া। পর্ব ৯-এর জোড়ার তালিকায় এগুলো জুড়ে নাও।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>তিন ধাপের মেশিন না দেখে?</li>
<li><span lang="en">being, been, be</span>: কোন চিহ্নে কোনটা?</li>
<li>কোন কর্তায় <span lang="en">by</span> বাদ?</li>
<li>কোন ক্রিয়ার passive নেই, আর কেন?</li>
<li><span lang="en">Let … be</span>, <span lang="en">By whom</span>, <span lang="en">You are requested to</span>: কোন জাতের বাক্যে?</li>
<li>দুটো কর্মের বাক্যের দুটো passive?</li>
</ul>
</div>

${mount("passive-drill")}
`,
  blocks: {
    "passive-pattern": {
      kind: "pattern",
      title: { bn: "উল্টানো বাক্য", en: "The sentence turned round" },
      shape: "OBJECT + be (in the verb's tense) + V3 (+ by SUBJECT)",
      why: { bn: "কর্মটা সামনে যায়, be এসে মূল ক্রিয়ার কালটা বহন করে, আর ক্রিয়া নিজে জমে যায় V3-তে। কর্তা দরকার হলে by-এর পরে, নইলে বাদ।", en: "The object moves to the front, be arrives carrying the verb's tense, and the verb itself freezes into V3. The subject follows by if it is needed, and goes if it is not." },
      examples: [
        { target: "Rafi broke the window. The window was broken by Rafi.", bn: "রাফি জানালা ভাঙল। জানালাটা রাফির দ্বারা ভাঙা হলো।" },
        { target: "Someone stole my bike. My bike was stolen.", bn: "কেউ আমার সাইকেল চুরি করেছে। আমার সাইকেল চুরি হয়েছে।" },
        { target: "They are building a bridge. A bridge is being built.", bn: "তারা একটা সেতু বানাচ্ছে। একটা সেতু বানানো হচ্ছে।" },
        { target: "Nanu has told this story many times. This story has been told many times.", bn: "নানু এই গল্পটা অনেকবার বলেছেন। এই গল্পটা অনেকবার বলা হয়েছে।" },
        { target: "You must switch off your phone. Your phone must be switched off.", bn: "তোমার ফোন বন্ধ করতে হবে। ফোন বন্ধ করা আবশ্যক।" },
      ],
      tip: { bn: "-ing দেখলে being, have দেখলে been, will দেখলে be। বাকি সব was/were, is/are।", en: "See -ing, write being; see have, write been; see will, write be. Everything else is is/are, was/were." },
    },
    "passive-order": {
      kind: "order",
      title: { bn: "voice change-এর ধাপগুলো", en: "The steps of a voice change" },
      note: { bn: "Rafi broke the window থেকে passive বানানোর ধাপগুলো ক্রমে সাজাও।", en: "Order the steps that turn Rafi broke the window into the passive." },
      items: [
        { text: { bn: "কর্তা, ক্রিয়া আর কর্ম চিহ্নিত করো: Rafi / broke / the window", en: "Mark subject, verb and object: Rafi / broke / the window" } },
        { text: { bn: "কর্মটাকে সামনে আনো: The window …", en: "Move the object to the front: The window …" } },
        { text: { bn: "ক্রিয়ার কাল দেখে be বসাও: broke অতীত, তাই was", en: "Put be in the verb's tense: broke is past, so was" } },
        { text: { bn: "ক্রিয়ার V3 বসাও: broken", en: "Put in V3: broken" } },
        { text: { bn: "কর্তাকে by দিয়ে শেষে: by Rafi", en: "Put the subject last after by: by Rafi" } },
      ],
    },
    "passive-tenses": {
      kind: "bins",
      title: { bn: "be, being, নাকি been", en: "Be, being, or been" },
      note: { bn: "প্রতিটা active বাক্যের passive-এ be-র কোন টুকরোটা আসবে, সেই ঘরে ফেলো।", en: "Drop each active sentence into the box of the piece of be its passive will carry." },
      bins: [
        { id: "plain", label: { bn: "শুধু is / are / was / were", en: "just is / are / was / were" } },
        { id: "being", label: { bn: "is / was + being", en: "is / was + being" } },
        { id: "been", label: { bn: "has / have / had + been", en: "has / have / had + been" } },
        { id: "be", label: { bn: "will / must / can + be", en: "will / must / can + be" } },
      ],
      items: [
        { text: { bn: "She writes a letter.", en: "She writes a letter." }, bin: "plain", why: { bn: "present simple: is written।", en: "Present simple: is written." } },
        { text: { bn: "They are repairing the road.", en: "They are repairing the road." }, bin: "being", why: { bn: "-ing: is being repaired।", en: "-ing: is being repaired." } },
        { text: { bn: "Rafi has taken the wicket.", en: "Rafi has taken the wicket." }, bin: "been", why: { bn: "has: has been taken।", en: "Has: has been taken." } },
        { text: { bn: "We will announce the results.", en: "We will announce the results." }, bin: "be", why: { bn: "will: will be announced।", en: "Will: will be announced." } },
        { text: { bn: "Nanu told a story.", en: "Nanu told a story." }, bin: "plain", why: { bn: "past simple: was told।", en: "Past simple: was told." } },
        { text: { bn: "You must wear a helmet.", en: "You must wear a helmet." }, bin: "be", why: { bn: "modal: must be worn।", en: "A modal: must be worn." } },
        { text: { bn: "The coach was giving instructions.", en: "The coach was giving instructions." }, bin: "being", why: { bn: "was -ing: were being given।", en: "Was -ing: were being given." } },
        { text: { bn: "Someone had opened the gate.", en: "Someone had opened the gate." }, bin: "been", why: { bn: "had: had been opened।", en: "Had: had been opened." } },
        { text: { bn: "People grow rice here.", en: "People grow rice here." }, bin: "plain", why: { bn: "present simple: is grown।", en: "Present simple: is grown." } },
      ],
    },
    "passive-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: কর্তা হারিয়ে গেছে", en: "Listen, say: the doer has vanished" },
      lines: [
        { target: "Rice is grown in Bangladesh.", bn: "বাংলাদেশে ধান চাষ হয়।" },
        { target: "The stadium was built in 2006.", bn: "স্টেডিয়ামটা ২০০৬ সালে বানানো হয়েছিল।" },
        { target: "My phone has been repaired.", bn: "আমার ফোন সারানো হয়েছে।" },
        { target: "The results will be announced on Sunday.", bn: "ফলাফল রবিবার ঘোষণা করা হবে।" },
        { target: "English is spoken here.", bn: "এখানে ইংরেজি বলা হয়।" },
        { target: "The road is being repaired, so drive slowly.", bn: "রাস্তা সারানো হচ্ছে, তাই ধীরে চালাও।" },
        { target: "I was given a prize by the headmaster.", bn: "প্রধান শিক্ষক আমাকে একটা পুরস্কার দিলেন।" },
      ],
    },
    "passive-when": {
      kind: "bins",
      title: { bn: "active নাকি passive: কোনটা ভালো", en: "Active or passive: which is better" },
      note: { bn: "প্রতিটা অবস্থায় কোনটা স্বাভাবিক শোনাবে, সেই ঘরে ফেলো। কর্তা জানা আর জরুরি হলে active।", en: "Drop each situation into the box of what sounds natural. If the doer is known and matters, active." },
      bins: [
        { id: "active", label: { bn: "active: কর্তাই খবর", en: "active: the doer is the news" }, tone: "good" },
        { id: "passive", label: { bn: "passive: কর্তা অজানা বা অদরকারি", en: "passive: the doer is unknown or unimportant" }, tone: "lead" },
      ],
      items: [
        { text: { bn: "কে জিতল বলছি: শাকিব পাঁচ উইকেট নিল", en: "Saying who did it: Shakib took five wickets" }, bin: "active", why: { bn: "শাকিবই খবর: Shakib took five wickets।", en: "Shakib is the news: Shakib took five wickets." } },
        { text: { bn: "সাইকেল চুরি হয়েছে, চোর অজানা", en: "A bike was stolen, thief unknown" }, bin: "passive", why: { bn: "কর্তা জানা নেই: My bike was stolen।", en: "The doer is unknown: My bike was stolen." } },
        { text: { bn: "নোটিশ: ফোন বন্ধ রাখতে হবে", en: "A notice: phones must be off" }, bin: "passive", why: { bn: "নিয়ম, কারও নাম নেই: Phones must be switched off।", en: "A rule with no one named: Phones must be switched off." } },
        { text: { bn: "বিজ্ঞান বইয়ে পরীক্ষার বর্ণনা", en: "A science book describing an experiment" }, bin: "passive", why: { bn: "কে করল জরুরি নয়: The water was heated।", en: "Who did it does not matter: The water was heated." } },
        { text: { bn: "নানু আজ পিঠা বানালেন, সেটাই বলছি", en: "Nanu made pitha today, and that is the point" }, bin: "active", why: { bn: "নানুই খবর: Nanu made pitha।", en: "Nanu is the news: Nanu made pitha." } },
        { text: { bn: "সেতুটা ২০০৬-এ খোলা হয়, কোম্পানির নাম দরকার নেই", en: "The bridge opened in 2006; the builder's name is beside the point" }, bin: "passive", why: { bn: "কাজটাই খবর: The bridge was opened in 2006।", en: "The event is the news: The bridge was opened in 2006." } },
        { text: { bn: "বন্ধুকে বলছি কাল কী করেছি", en: "Telling a friend what I did yesterday" }, bin: "active", why: { bn: "আমিই কর্তা, আমিই খবর: I played, I ate।", en: "I am the doer and the news: I played, I ate." } },
      ],
    },
    "passive-gap": {
      kind: "gap",
      title: { bn: "be-র কালটা বসাও", en: "Put in the tense of be" },
      items: [
        { text: "The letter ___ written yesterday.", bn: "চিঠিটা কাল লেখা হয়েছিল।", options: ["is", "was", "has been"], right: 1, why: { bn: "yesterday: past simple, তাই was written।", en: "Yesterday: past simple, so was written." } },
        { text: "A new school ___ built near our house now.", bn: "আমাদের বাড়ির কাছে এখন একটা নতুন স্কুল বানানো হচ্ছে।", options: ["is being", "is", "has been"], right: 0, why: { bn: "now, চলছে: is being built। continuous-এ being।", en: "Now, in progress: is being built. Continuous takes being." } },
        { text: "The match ___ cancelled because of rain.", bn: "বৃষ্টির কারণে ম্যাচটা বাতিল করা হয়েছে।", options: ["has been", "is being", "will be"], right: 0, why: { bn: "হয়ে গেছে, ফল এখন: has been cancelled। perfect-এ been।", en: "Done, with the result now: has been cancelled. Perfect takes been." } },
        { text: "Homework must ___ on time.", bn: "হোমওয়ার্ক সময়মতো জমা দিতে হবে।", options: ["submit", "be submitted", "submitted"], right: 1, why: { bn: "modal-এর পরে খালি be + V3: must be submitted।", en: "After a modal, bare be + V3: must be submitted." } },
        { text: "Who ___ this song written by?", bn: "এই গানটা কে লিখেছে?", options: ["is", "was", "did"], right: 1, why: { bn: "গানটা লেখা হয়ে গেছে, অতীত: Who was this song written by?", en: "The song was written in the past: Who was this song written by?" } },
        { text: "The children ___ given new books every year.", bn: "বাচ্চাদের প্রতি বছর নতুন বই দেওয়া হয়।", options: ["is", "are", "was"], right: 1, why: { bn: "every year: present simple, children অনেক: are given।", en: "Every year: present simple, and children are many: are given." } },
        { text: "Two windows ___ broken during the storm.", bn: "ঝড়ের সময় দুটো জানালা ভেঙেছিল।", options: ["was", "were", "is"], right: 1, why: { bn: "windows অনেক, অতীত: were broken।", en: "Windows are many, in the past: were broken." } },
        { text: "The hill is covered ___ snow in winter.", bn: "শীতে পাহাড়টা বরফে ঢাকা থাকে।", options: ["with", "by", "of"], right: 0, why: { bn: "covered-এর জোড়া with, by নয়; বরফ কর্তা নয়, যা দিয়ে ঢাকা।", en: "Covered pairs with with, not by; the snow is not a doer but what it is covered in." } },
      ],
    },
    "passive-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: এটার passive হয়?", en: "Guess first: can this go passive?" },
      ask: { bn: "পরীক্ষায় এল: Change the voice: The old man died peacefully last night. তুমি কী লিখবে?", en: "The exam says: Change the voice: The old man died peacefully last night. What do you write?" },
      choices: [
        { bn: "The old man was died peacefully last night.", en: "The old man was died peacefully last night." },
        { bn: "Peace was died by the old man last night.", en: "Peace was died by the old man last night." },
        { bn: "হয় না: die-এর কর্ম নেই", en: "It cannot: die has no object" },
      ],
      answer: { bn: "হয় না। die একটা কর্মহীন ক্রিয়া, তাই এর passive নেই। খাতায় লেখো: intransitive verb, no passive form।", en: "It cannot. Die takes no object, so it has no passive. Write on the paper: intransitive verb, no passive form." },
      why: { bn: "passive-এ কর্মটা সামনে যায়। এই বাক্যে কর্ম নেই: বুড়ো লোকটা কিছুকে মারেনি, শুধু মারা গেছে। peacefully একটা adverb, last night সময়; কেউই কর্ম নয়। was died বলে কোনো ইংরেজি নেই। পরীক্ষায় এমন একটা বাক্য ইচ্ছে করে দেওয়া হয়; যে চিনতে পারে সে নম্বর পায়, যে জোর করে উল্টায় সে হারায়। sleep, go, come, arrive, happen, laugh: সবার একই কথা।", en: "In the passive the object moves to the front. This sentence has no object: the old man did not die anything, he simply died. Peacefully is an adverb and last night is a time; neither is an object. Was died is not English. Exams set such a sentence on purpose; the student who recognises it earns the mark and the one who forces it loses it. Sleep, go, come, arrive, happen, laugh: the same story for each." },
    },
    "passive-spot": {
      kind: "spot",
      title: { bn: "মিতু আপুর voice change, ভুল খোঁজো", en: "Mitu's voice change: find the mistakes" },
      note: { bn: "মিতু পাঁচটা বাক্য passive করেছে। যেটায় ভুল, সেটা ছোঁও: V3, be-র কাল, by, বা সংখ্যা।", en: "Mitu turned five sentences passive. Tap each one with a mistake: V3, the tense of be, by, or number." },
      source: { bn: "খাতা: voice change", en: "Exercise book: voice change" },
      lines: [
        { text: { bn: "The letters was posted by Rafi this morning.", en: "The letters was posted by Rafi this morning." }, flag: { bn: "letters অনেক: were posted।", en: "Letters is plural: were posted." } },
        { text: { bn: "This poem was written by Nazrul.", en: "This poem was written by Nazrul." } },
        { text: { bn: "The bridge is being repairing at the moment.", en: "The bridge is being repairing at the moment." }, flag: { bn: "being-এর পরে V3: is being repaired।", en: "V3 after being: is being repaired." } },
        { text: { bn: "My bag has been stolen by someone.", en: "My bag has been stolen by someone." }, flag: { bn: "someone বাদ: My bag has been stolen।", en: "Drop someone: My bag has been stolen." } },
        { text: { bn: "Rice is grown in Bangladesh.", en: "Rice is grown in Bangladesh." } },
        { text: { bn: "The window was broke by a ball.", en: "The window was broke by a ball." }, flag: { bn: "V3: was broken; আর বল দিয়ে হলে with a ball।", en: "V3: was broken; and if the ball is the tool, with a ball." } },
        { text: { bn: "The results will be announced tomorrow.", en: "The results will be announced tomorrow." } },
      ],
    },
    "passive-build": {
      kind: "build",
      title: { bn: "উল্টানো বাক্য সাজাও", en: "Build the turned-round sentence" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো be-র টুকরোটা V3-র ঠিক আগে গেল কি না।", en: "The words are shuffled. As you build, check the piece of be lands right before V3." },
      pattern: "object + be + V3 + (by + subject)",
      lines: [
        { target: "The window was broken by Rafi.", bn: "জানালাটা রাফি ভেঙেছিল।" },
        { target: "A new bridge is being built over the river.", bn: "নদীর উপর একটা নতুন সেতু বানানো হচ্ছে।" },
        { target: "This story has been told many times.", bn: "এই গল্পটা অনেকবার বলা হয়েছে।" },
        { target: "The results will be announced on Sunday.", bn: "ফলাফল রবিবার ঘোষণা করা হবে।" },
        { target: "Let the door be opened at once.", bn: "দরজাটা এখনই খোলা হোক।" },
        { target: "By whom was this poem written?", bn: "এই কবিতাটা কে লিখেছে?" },
      ],
    },
    "passive-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Change the voice: Who taught you English?", en: "Change the voice: Who taught you English?" },
          options: [
            { text: { bn: "By whom were you taught English?", en: "By whom were you taught English?" }, right: true, why: { bn: "হ্যাঁ। who কর্তা, তাই By whom; you কর্ম, সামনে; taught অতীত, were।", en: "Yes. Who is the subject, so By whom; you is the object and moves front; taught is past, were." } },
            { text: { bn: "Who was taught you English?", en: "Who was taught you English?" }, why: { bn: "না। who-ই কর্তা ছিল, তাকে by-এর পরে নিতে হবে।", en: "No. Who was the subject and must move behind by." } },
            { text: { bn: "By whom you were taught English?", en: "By whom you were taught English?" }, why: { bn: "না। প্রশ্নে were কর্তার আগে: were you taught।", en: "No. In a question were comes before the subject: were you taught." } },
          ],
        },
        {
          ask: { bn: "Change the voice: The teacher gave the students some advice.", en: "Change the voice: The teacher gave the students some advice." },
          options: [
            { text: { bn: "The students were given some advice by the teacher.", en: "The students were given some advice by the teacher." }, right: true, why: { bn: "হ্যাঁ। দুটো কর্ম; মানুষটাকে সামনে আনা স্বাভাবিক। students অনেক: were।", en: "Yes. Two objects; bringing the people forward is natural. Students is plural: were." } },
            { text: { bn: "The students was given some advice by the teacher.", en: "The students was given some advice by the teacher." }, why: { bn: "না। students অনেক: were given।", en: "No. Students is plural: were given." } },
            { text: { bn: "Some advice was given the students by the teacher.", en: "Some advice was given the students by the teacher." }, why: { bn: "প্রায়। জিনিসটা সামনে আনলে মানুষের আগে to লাগে: given to the students।", en: "Nearly. Bringing the thing forward needs to before the people: given to the students." } },
          ],
        },
        {
          ask: { bn: "Change the voice: The road was being repaired by the workers.", en: "Change the voice: The road was being repaired by the workers." },
          options: [
            { text: { bn: "The workers were repairing the road.", en: "The workers were repairing the road." }, right: true, why: { bn: "হ্যাঁ। by-এর পরের জন সামনে, was being হয় were -ing, V3 ফিরে যায় মূল ক্রিয়ায়।", en: "Yes. The doer after by moves front, was being becomes were -ing, and V3 returns to the main verb." } },
            { text: { bn: "The workers repaired the road.", en: "The workers repaired the road." }, why: { bn: "না। was being মানে চলছিল, past continuous: were repairing।", en: "No. Was being means in progress, past continuous: were repairing." } },
            { text: { bn: "The workers are repairing the road.", en: "The workers are repairing the road." }, why: { bn: "না। was অতীত: were repairing।", en: "No. Was is past: were repairing." } },
          ],
        },
        {
          ask: { bn: "Change the voice: Don't waste water.", en: "Change the voice: Don't waste water." },
          options: [
            { text: { bn: "Let water not be wasted.", en: "Let water not be wasted." }, right: true, why: { bn: "হ্যাঁ। না-বাচক আদেশ: Let + কর্ম + not be + V3। Let not water be wasted-ও চলে।", en: "Yes. A negative command: Let + object + not be + V3. Let not water be wasted passes too." } },
            { text: { bn: "Water is not wasted.", en: "Water is not wasted." }, why: { bn: "না। এটা বলা, আদেশ নয়।", en: "No. That is a statement, not a command." } },
            { text: { bn: "Don't let water be wasting.", en: "Don't let water be wasting." }, why: { bn: "না। be-র পরে V3: wasted।", en: "No. V3 after be: wasted." } },
          ],
        },
      ],
    },
    "passive-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "ঘরের পাঁচটা জিনিস কোথায় তৈরি: My phone was made in China. This shirt was made in Bangladesh.", en: "Where five things in the room were made: My phone was made in China. This shirt was made in Bangladesh." } },
        { text: { bn: "আজকের পাঁচটা খবর passive-এ: A new road was opened. The match was won by…", en: "Five pieces of today's news in the passive: A new road was opened. The match was won by…" } },
        { text: { bn: "একটা active বাক্য নাও আর আটটা কালে passive বলো, ছক দেখে।", en: "Take one active sentence and say its passive in all eight tenses, using the table." } },
        { text: { bn: "স্কুলের পাঁচটা নিয়ম passive-এ: Phones must be switched off. Homework must be submitted…", en: "Five school rules in the passive: Phones must be switched off. Homework must be submitted…" } },
        { text: { bn: "পাঁচটা কর্মহীন ক্রিয়া জোরে, আর বলো কেন এদের passive নেই: sleep, go, come, arrive, die।", en: "Five verbs without objects aloud, and say why they have no passive: sleep, go, come, arrive, die." } },
        { text: { bn: "তিনটা প্রশ্ন আর তিনটা আদেশ passive-এ: By whom was… ? Let the … be…", en: "Three questions and three commands in the passive: By whom was… ? Let the … be…" } },
      ],
    },
  },
};
