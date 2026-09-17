/* ============================================================
   24-transformation.ts: পর্ব ২৪, পরীক্ষার হল (transformation
   and the other four exam questions).

   One part of the grammar term, gathered into the rung by
   `advanced.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>মিতু আপু SSC-র প্রশ্নপত্রের ব্যাকরণ অংশটা খুলে বলল, দেখ, প্রতি বছর একই পাঁচটা প্রশ্ন আসে, শুধু বাক্যগুলো বদলায়। <span lang="en">Right form of verbs, transformation of sentences, narration, voice change</span>, আর <span lang="en">completing sentences</span>। এই টার্মের আগের তেইশটা পর্বে প্রতিটার নিয়ম আলাদা আলাদা করে শেখা হয়েছে। এই পর্বে সবগুলো এক ঘরে, যেভাবে পরীক্ষার হলে পাশাপাশি বসে। প্রতিটার একটা ধাপের তালিকা, আর যে ফাঁদে সবচেয়ে বেশি নম্বর যায়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">Right form</span>: সময়ের শব্দ খোঁজো, কর্তা একজন না অনেক দেখো, আগের শব্দ (modal, preposition, have) দেখো।</li>
<li><span lang="en">Transformation</span>: প্রতিটা বদলের একটা ছাঁচ আছে: <span lang="en">too…to ↔ so…that, unless ↔ if not, degree, voice, narration, simple ↔ complex ↔ compound</span>।</li>
<li><span lang="en">Narration</span>: বলার ক্রিয়া, জোড়ার শব্দ, কাল পিছনে, pronoun আর সময় ঘোরাও।</li>
<li><span lang="en">Voice</span>: কর্ম সামনে, be ক্রিয়ার কালে, V3, by কর্তা।</li>
<li>প্রতিটার শেষে একবার জোরে পড়ো: কানে যেটা খটকা লাগে সেটাই ভুল।</li>
</ul>
</div>

${mount("transformation-pattern")}

<h2>প্রশ্ন ১: right form of verbs</h2>

<p>তিনটা প্রশ্ন ক্রমে, প্রতিটা শূন্যস্থানে। <strong>কাল কী?</strong> সময়ের শব্দ খোঁজো (পর্ব ৭): <span lang="en">yesterday, ago</span> অতীত; <span lang="en">now, look</span> continuous; <span lang="en">already, since, yet</span> perfect; <span lang="en">every day</span> present simple। অন্য ক্রিয়ার কালও ইঙ্গিত: গল্পে সব অতীত হলে শূন্যস্থানও অতীত। <strong>কর্তা একজন না অনেক?</strong> বর্তমান কালে একজন হলে <span lang="en">-s</span> (পর্ব ৬)। <strong>ঠিক আগের শব্দটা কী?</strong> modal হলে খালি; <span lang="en">have/has/had</span> হলে V3; <span lang="en">be</span> হলে <span lang="en">-ing</span> বা passive V3; preposition হলে <span lang="en">-ing</span>; <span lang="en">to</span> হলে খালি (পর্ব ১২, ১১, ১৫, ১৮)।</p>

<p>তৃতীয় প্রশ্নটাই সবচেয়ে বেশি নম্বর বাঁচায়, কারণ আগের শব্দটা প্রায়ই কালের কথা ভাবতেই দেয় না। একটা টেবিলে রাখো:</p>

<div class="table-scroll">
<table>
<thead><tr><th>ঠিক আগের শব্দ</th><th>বন্ধনীর ক্রিয়া হয়</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td>modal (<span lang="en">can, must, should</span>)</td><td>খালি</td><td><span lang="en">He must (go) → go</span></td></tr>
<tr><td><span lang="en">to</span></td><td>খালি</td><td><span lang="en">I want to (see) → see</span></td></tr>
<tr><td><span lang="en">have / has / had</span></td><td>V3</td><td><span lang="en">She has (write) → written</span></td></tr>
<tr><td><span lang="en">be</span> (<span lang="en">is, was, been</span>)</td><td>-ing (নিজে করছে) বা V3 (তার উপর হচ্ছে)</td><td><span lang="en">He is (play) → playing; It was (break) → broken</span></td></tr>
<tr><td>preposition (<span lang="en">in, of, at, without</span>)</td><td>-ing</td><td><span lang="en">good at (bowl) → bowling</span></td></tr>
<tr><td><span lang="en">enjoy, finish, mind, avoid</span></td><td>-ing</td><td><span lang="en">enjoy (play) → playing</span></td></tr>
<tr><td><span lang="en">make, let, see</span> + কাউকে</td><td>খালি</td><td><span lang="en">made us (wait) → wait</span></td></tr>
<tr><td><span lang="en">had better, would rather</span></td><td>খালি</td><td><span lang="en">You had better (leave) → leave</span></td></tr>
<tr><td><span lang="en">It is time, wish, as if</span></td><td>past</td><td><span lang="en">I wish I (be) → were</span></td></tr>
</tbody>
</table>
</div>

${mount("transformation-steps")}

${mount("transformation-rightform")}

<h2>প্রশ্ন ২: transformation of sentences</h2>

<p>পরীক্ষা যে বদলগুলো চায়, প্রতিটার একটা মেশিন:</p>

<div class="table-scroll">
<table>
<thead><tr><th>বদল</th><th>থেকে</th><th>এ</th></tr></thead>
<tbody>
<tr><td>so…that ↔ too…to</td><td><span lang="en">He is so weak that he cannot walk.</span></td><td><span lang="en">He is too weak to walk.</span></td></tr>
<tr><td>unless ↔ if not</td><td><span lang="en">Unless you work, you will fail.</span></td><td><span lang="en">If you do not work, you will fail.</span></td></tr>
<tr><td>degree: superlative ↔ comparative</td><td><span lang="en">Shakib is the best all-rounder.</span></td><td><span lang="en">No other all-rounder is as good as Shakib. Shakib is better than any other all-rounder.</span></td></tr>
<tr><td>affirmative ↔ negative</td><td><span lang="en">Everyone loves Nanu.</span></td><td><span lang="en">There is no one who does not love Nanu.</span></td></tr>
<tr><td>assertive ↔ interrogative</td><td><span lang="en">Nobody can deny it.</span></td><td><span lang="en">Who can deny it?</span></td></tr>
<tr><td>assertive ↔ exclamatory</td><td><span lang="en">It was a great match.</span></td><td><span lang="en">What a great match it was!</span></td></tr>
<tr><td>simple ↔ complex ↔ compound</td><td><span lang="en">Seeing the tiger, he ran.</span></td><td><span lang="en">When he saw the tiger, he ran. He saw the tiger and ran.</span></td></tr>
</tbody>
</table>
</div>

<p><span lang="en">simple, complex, compound</span>: একটা ক্রিয়া, একটাই clause হলে <span lang="en">simple</span> (<span lang="en">-ing, to, because of, in spite of</span> দিয়ে)। একটা মূল clause আর একটা অধীন clause (<span lang="en">when, because, although, if, who</span>) হলে <span lang="en">complex</span>। দুটো সমান clause <span lang="en">and, but, so</span> দিয়ে হলে <span lang="en">compound</span>। পর্ব ১৪-র দুই রকম জোড়া, আর তার আগের অবস্থা।</p>

<p>তিন গড়নের মাঝে যাওয়ার একটা শব্দের টেবিল, কারণ পরীক্ষা এখানে শব্দ চায়, ধারণা নয়:</p>

<div class="table-scroll">
<table>
<thead><tr><th>মানে</th><th>simple</th><th>complex</th><th>compound</th></tr></thead>
<tbody>
<tr><td>কারণ</td><td><span lang="en">because of, owing to, being + adj</span></td><td><span lang="en">because, as, since</span></td><td><span lang="en">so, and so</span></td></tr>
<tr><td>বিপরীত</td><td><span lang="en">in spite of, despite</span></td><td><span lang="en">though, although</span></td><td><span lang="en">but, yet</span></td></tr>
<tr><td>সময়</td><td><span lang="en">-ing (Seeing …), at, after</span></td><td><span lang="en">when, as soon as, after</span></td><td><span lang="en">and (then)</span></td></tr>
<tr><td>শর্ত</td><td><span lang="en">by + -ing, without + -ing</span></td><td><span lang="en">if, unless</span></td><td><span lang="en">and (you will), or (you will)</span></td></tr>
<tr><td>উদ্দেশ্য</td><td><span lang="en">to, in order to</span></td><td><span lang="en">so that … can</span></td><td><span lang="en">and (wanted to)</span></td></tr>
</tbody>
</table>
</div>

${mount("transformation-builds")}

${mount("transformation-lines")}

<h2>প্রশ্ন ৩ আর ৪: narration আর voice</h2>

<p>দুটোই পুরো পর্ব পেয়েছে (১৬ আর ১৫)। এখানে শুধু ধাপের তালিকা, হলে বসে যেভাবে মনে করবে। <strong>Narration:</strong> (১) বলার ক্রিয়া: <span lang="en">said/told/asked/requested/ordered/exclaimed/suggested</span>। (২) জোড়া: <span lang="en">that / if / wh / to / not to</span>। (৩) কাল এক ধাপ পিছনে, বলার ক্রিয়া অতীতে থাকলে। (৪) pronoun বক্তার দিক থেকে ঘোরাও। (৫) সময় আর জায়গা দূরে সরাও। (৬) প্রশ্নের ক্রম সোজা করো, প্রশ্নবোধক সরাও।</p>

<p><strong>Voice:</strong> (১) কর্তা, ক্রিয়া, কর্ম চিহ্নিত করো। (২) কর্ম সামনে। (৩) <span lang="en">be</span> মূল ক্রিয়ার কালে: <span lang="en">-ing</span> দেখলে <span lang="en">being</span>, <span lang="en">have</span> দেখলে <span lang="en">been</span>, modal দেখলে <span lang="en">be</span>। (৪) V3। (৫) <span lang="en">by</span> + কর্তা, অথবা বাদ যদি <span lang="en">people/they/someone</span>। (৬) প্রশ্ন হলে আগে বাক্য বানাও, তারপর সাহায্যকারী সামনে।</p>

${mount("transformation-machines")}

${mount("transformation-gap")}

<h2>প্রশ্ন ৫: completing sentences</h2>

<p>শুরুটা দেওয়া থাকে, শেষটা তোমার। কৌশল: শুরুর শব্দটাই ছাঁচ বলে দেয়। <span lang="en">If I were a bird, …</span> দ্বিতীয় সিঁড়ি, তাই <span lang="en">would</span> (পর্ব ১৭)। <span lang="en">Though he is poor, …</span> বিপরীত, তাই ভালো কিছু: <span lang="en">he is honest</span>। <span lang="en">It is high time …</span> পরে past: <span lang="en">we left</span>। <span lang="en">Would that …</span> বা <span lang="en">I wish …</span> পরে past বা <span lang="en">had + V3</span>। <span lang="en">No sooner had … than …</span> <span lang="en">Hardly … when …</span> <span lang="en">Scarcely … when …</span> <span lang="en">As soon as …</span> <span lang="en">So that …</span> উদ্দেশ্য, <span lang="en">can/could</span>। <span lang="en">Lest …</span> পরে <span lang="en">should</span>: <span lang="en">Run fast lest you should miss the bus.</span> <span lang="en">Since …</span> কারণ, <span lang="en">Till/until …</span> সময়, <span lang="en">as if …</span> পরে past: <span lang="en">He talks as if he knew everything.</span></p>

<div class="table-scroll">
<table>
<thead><tr><th>শুরু</th><th>যা আসে</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">It is high time</span></td><td>past</td><td><span lang="en">It is high time we started.</span></td></tr>
<tr><td><span lang="en">I wish / Would that</span></td><td>past / had V3</td><td><span lang="en">I wish I were rich.</span></td></tr>
<tr><td><span lang="en">as if / as though</span></td><td>past</td><td><span lang="en">She talks as if she were the queen.</span></td></tr>
<tr><td><span lang="en">lest</span></td><td><span lang="en">should</span></td><td><span lang="en">Walk carefully lest you should fall.</span></td></tr>
<tr><td><span lang="en">so that</span></td><td><span lang="en">can / could / may</span></td><td><span lang="en">He studies hard so that he can pass.</span></td></tr>
<tr><td><span lang="en">too … to</span></td><td>খালি ক্রিয়া</td><td><span lang="en">The tea is too hot to drink.</span></td></tr>
<tr><td><span lang="en">had better / would rather</span></td><td>খালি ক্রিয়া</td><td><span lang="en">You had better go now.</span></td></tr>
</tbody>
</table>
</div>

<p><span lang="en">completing sentences</span>-এ দ্বিতীয় অর্ধেকটা নিজের, তাই দুটো নিয়ম: মানে হতে হবে, আর ব্যাকরণ শুরুর সাথে মিলতে হবে। <span lang="en">If I had wings, …</span>-এর পরে <span lang="en">I will fly</span> লিখলে মানে ঠিক, ব্যাকরণ ভুল (দ্বিতীয় সিঁড়িতে <span lang="en">would</span>)। <span lang="en">Though he is rich, …</span>-এর পরে <span lang="en">he has a car</span> লিখলে ব্যাকরণ ঠিক, মানে ভুল (<span lang="en">though</span> বিপরীত চায়: <span lang="en">he is unhappy</span>)। দুটোই লাগে, আর দুটোই এক নম্বর।</p>

${mount("transformation-starters")}

${mount("transformation-complete")}

<div class="ex"><b>একটা নমুনা:</b> প্রশ্ন: <span lang="en">Complete: (a) It is high time … (b) Unless you hurry, … (c) He ran fast so that … (d) The man talks as if …</span> উত্তর: (a) <span lang="en">It is high time we left for the station.</span> past। (b) <span lang="en">Unless you hurry, you will miss the train.</span> <span lang="en">unless</span> মানে যদি না, তাই খারাপ ফল, আর <span lang="en">will</span> মূল অংশে। (c) <span lang="en">He ran fast so that he could catch the bus.</span> <span lang="en">could</span>, কারণ <span lang="en">ran</span> অতীত। (d) <span lang="en">The man talks as if he knew everything.</span> past, অবাস্তব। চারটায় চার রকম ছাঁচ, আর চারটাই শুরুর শব্দে লুকানো।</div>

${mount("transformation-reveal")}

${mount("transformation-quiz")}

<div class="side-note">
<p class="side-note-label">হলে বসার কৌশল</p>
<p>ব্যাকরণের অংশে সময় ভাগ করো: প্রতিটা প্রশ্নে সমান, আর শেষে পাঁচ মিনিট পুরোটা জোরে (মনে মনে) পড়ার জন্য। সবচেয়ে বেশি নম্বর যায় তিন জায়গায়: প্রশ্নবোধক চিহ্ন ফেলে আসা, V2 আর V3 গুলিয়ে ফেলা (<span lang="en">was broke</span>), আর <span lang="en">if</span>-এর ঘরে <span lang="en">will</span>। পরীক্ষার আগের রাতে এই তিনটা লাইন পড়ো, আর খাতার সংগ্রহের রেবেল তালিকাটা।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">transformation</span>-এ মানে বদলে ফেলা সবচেয়ে বড় ভুল। <span lang="en">He is too weak to walk</span> থেকে <span lang="en">He is so weak that he can walk</span> লিখলে ব্যাকরণ ঠিক, মানে উল্টো, নম্বর শূন্য। বদলের পর নিজেকে জিজ্ঞেস করো: একই ঘটনা বলছে তো? <span lang="en">not</span> কোথাও হারিয়ে যায়নি তো?</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>degree বদলে বহুবচন-একবচনের খেলা। <span lang="en">Shakib is the best all-rounder</span> থেকে comparative: <span lang="en">Shakib is better than any other all-rounder</span>, একবচন, কারণ <span lang="en">any other</span> মানে বাকি প্রত্যেকে, একজন একজন করে। কিন্তু <span lang="en">Shakib is better than all other all-rounders</span>, বহুবচন, কারণ <span lang="en">all</span>। আর positive-এ <span lang="en">No other all-rounder is as good as Shakib</span>, একবচন। <span lang="en">any other all-rounders</span> লিখলে এক নম্বর গেল, যদিও মানে ঠিক ছিল।</p>
</div>

<h2>পরীক্ষার হলে: পুরো অংশটা একসাথে</h2>

<ol class="step-list">
<li><strong>প্রথম দুই মিনিট:</strong> পাঁচটা প্রশ্ন একবার চোখ বুলাও। যেটা সবচেয়ে ভালো পারো, সেটা আগে; আত্মবিশ্বাস বাকিগুলোয় কাজে লাগে।</li>
<li><strong>Right form:</strong> প্রতিটা শূন্যস্থানে তিন প্রশ্ন (কাল, কর্তা, আগের শব্দ)। আগের শব্দটা আগে দেখো; সেটা প্রায়ই একাই উত্তর দেয়।</li>
<li><strong>Transformation:</strong> ছাঁচ থেকে ছাঁচে। লিখে একটা প্রশ্ন: একই ঘটনা? <span lang="en">not</span> হারায়নি?</li>
<li><strong>Narration:</strong> ছয় ধাপ ক্রমে। শেষে প্রশ্নবোধক আছে কি না দেখো: থাকলে ভুল।</li>
<li><strong>Voice:</strong> ছয় ধাপ। <span lang="en">be</span>-র কাল আর V3, দুটো জায়গাতেই নম্বর।</li>
<li><strong>Completing:</strong> শুরুর শব্দ থেকে ছাঁচ, তারপর মানে। দুটোই।</li>
<li><strong>শেষ পাঁচ মিনিট:</strong> মনে মনে জোরে পড়ো। যেটা কানে খটকা লাগে, সেটা আবার দেখো।</li>
</ol>

${mount("transformation-build")}

${mount("transformation-spot")}

${mount("transformation-exam")}

<div class="checklist">
<p>পর্ব শেষে নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>right form-এর তিন প্রশ্ন আর আগের-শব্দের নয় সারির টেবিল মুখস্থ?</li>
<li>সাতটা transformation-এর মেশিন দুই দিকে চালাতে পারি?</li>
<li>simple, complex, compound: পাঁচ মানের শব্দ-টেবিল থেকে শব্দ বাছতে পারি?</li>
<li>narration আর voice-এর ছয় ধাপ, না দেখে বলতে পারি?</li>
<li>দশটা completing-শুরু আর তাদের ছাঁচ মনে আছে?</li>
<li>বদলের পরের একটা প্রশ্ন (একই ঘটনা? not হারায়নি?) অভ্যাস হয়েছে?</li>
</ul>
</div>

${mount("transformation-drill")}
`,
  blocks: {
    "transformation-pattern": {
      kind: "pattern",
      title: { bn: "যে বদলগুলো প্রতি বছর আসে", en: "The changes that come every year" },
      shape: "so … that … not  ↔  too … to   ·   unless  ↔  if … not   ·   the best  ↔  better than any other",
      why: { bn: "প্রতিটা transformation একটা ছাঁচ থেকে আরেকটা ছাঁচে যাওয়া, মানে একই রেখে। ছাঁচ দুটো পাশাপাশি মুখস্থ থাকলে হলে বসে ভাবতে হয় না, বসাতে হয়।", en: "Every transformation moves from one pattern to another with the meaning held still. With both patterns memorised side by side, the exam room is a matter of fitting, not thinking." },
      examples: [
        { target: "He is so weak that he cannot walk. He is too weak to walk.", bn: "সে এত দুর্বল যে হাঁটতে পারে না। সে হাঁটার পক্ষে খুব বেশি দুর্বল।" },
        { target: "Unless you hurry, you will be late. If you do not hurry, you will be late.", bn: "তাড়াতাড়ি না করলে দেরি হবে।" },
        { target: "Shakib is the best all-rounder. No other all-rounder is as good as Shakib.", bn: "শাকিব সেরা অলরাউন্ডার। অন্য কোনো অলরাউন্ডার শাকিবের মতো ভালো নয়।" },
        { target: "It was a great match. What a great match it was!", bn: "দারুণ ম্যাচ ছিল। কী দারুণ ম্যাচই না ছিল!" },
        { target: "Seeing the tiger, he ran. When he saw the tiger, he ran. He saw the tiger and ran.", bn: "বাঘ দেখে সে দৌড়াল: simple, complex, compound।" },
      ],
      tip: { bn: "বদলের পর একটা প্রশ্ন: একই ঘটনা বলছে তো? not হারায়নি তো?", en: "After the change, one question: is it still the same event? Did a not go missing?" },
    },
    "transformation-steps": {
      kind: "order",
      title: { bn: "right form: তিন প্রশ্ন ক্রমে", en: "Right form: the three questions in order" },
      note: { bn: "She (play) cricket every Friday since 2020: শূন্যস্থান ভরার ধাপ সাজাও।", en: "She (play) cricket every Friday since 2020: order the steps for filling the gap." },
      items: [
        { text: { bn: "ঠিক আগের শব্দটা দেখো: She, কোনো modal, have বা preposition নয়, তাই কাল ভাবতে হবে", en: "Look at the word just before: She, no modal, have or preposition, so tense has to be decided" } },
        { text: { bn: "সময়ের শব্দ খোঁজো: since 2020, একটা সেতু, তাই perfect", en: "Look for a time word: since 2020, a bridge, so perfect" } },
        { text: { bn: "কর্তা একজন না অনেক: She একজন, তাই has", en: "One subject or many: She is one, so has" } },
        { text: { bn: "every Friday-ও আছে, চলছেই: has been playing", en: "Every Friday is there too, it keeps going: has been playing" } },
        { text: { bn: "বসিয়ে একবার জোরে পড়ো: She has been playing cricket every Friday since 2020.", en: "Put it in and read it aloud once: She has been playing cricket every Friday since 2020." }, why: { bn: "আগের শব্দটা আগে, কারণ modal বা have থাকলে কাল ভাবাই লাগে না। তারপর সময়ের শব্দ, তারপর কর্তা। জোরে পড়াটা শেষ ধাপ, প্রতিবার।", en: "The word before comes first, because with a modal or have there is no tense to decide. Then the time word, then the subject. Reading aloud is the last step, every time." } },
      ],
    },
    "transformation-rightform": {
      kind: "gap",
      title: { bn: "right form: আগের শব্দটাই বলে দেয়", en: "Right form: the word before decides" },
      note: { bn: "প্রতিটায় বন্ধনীর ঠিক আগের শব্দটা দেখো। বেশিরভাগে কাল ভাবতেই হবে না।", en: "Look at the word just before the gap each time. Mostly there is no tense to decide." },
      items: [
        { text: "You had better ___ now.", bn: "তোমার এখনই যাওয়া ভালো।", options: ["leave", "to leave", "leaving"], right: 0, why: { bn: "had better + খালি।", en: "Had better + bare verb." } },
        { text: "She is good at ___.", bn: "সে ছবি আঁকায় ভালো।", options: ["draw", "drawing", "to draw"], right: 1, why: { bn: "preposition-এর পরে -ing।", en: "After a preposition, -ing." } },
        { text: "The letter has already been ___.", bn: "চিঠিটা ইতিমধ্যে পাঠানো হয়ে গেছে।", options: ["send", "sent", "sending"], right: 1, why: { bn: "been-এর পরে passive V3।", en: "After been, the passive V3." } },
        { text: "I wish I ___ taller.", bn: "আমি যদি আরেকটু লম্বা হতাম।", options: ["am", "were", "will be"], right: 1, why: { bn: "wish-এর পরে past, অবাস্তব: were।", en: "After wish, the past, unreal: were." } },
        { text: "Coach made us ___ ten laps.", bn: "কোচ আমাদের দশ চক্কর দৌড় করালেন।", options: ["run", "to run", "running"], right: 0, why: { bn: "make + কাউকে + খালি। পর্ব ২১।", en: "Make + person + bare. Part 21." } },
        { text: "Nanu avoids ___ late at night.", bn: "নানু রাতে দেরিতে খাওয়া এড়িয়ে চলেন।", options: ["eat", "to eat", "eating"], right: 2, why: { bn: "avoid + -ing। পর্ব ১৮।", en: "Avoid + -ing. Part 18." } },
        { text: "If it ___ tomorrow, we will stay home.", bn: "কাল বৃষ্টি হলে আমরা বাড়িতে থাকব।", options: ["rains", "will rain", "rained"], right: 0, why: { bn: "if-এর ঘরে will নয়: present। পর্ব ১৭।", en: "No will in the if clause: present. Part 17." } },
      ],
    },
    "transformation-builds": {
      kind: "bins",
      title: { bn: "simple, complex, নাকি compound", en: "Simple, complex, or compound" },
      note: { bn: "প্রতিটা বাক্য কোন গড়নের? finite ক্রিয়া গোনো আর জোড়ার শব্দটা দেখো।", en: "Which build is each sentence? Count the finite verbs and look at the joining word." },
      bins: [
        { id: "simple", label: { bn: "simple: একটাই clause", en: "simple: one clause" } },
        { id: "complex", label: { bn: "complex: মূল + অধীন", en: "complex: main + dependent" } },
        { id: "compound", label: { bn: "compound: দুটো সমান", en: "compound: two equal" } },
      ],
      items: [
        { text: { bn: "Seeing the tiger, he ran.", en: "Seeing the tiger, he ran." }, bin: "simple", why: { bn: "একটাই finite ক্রিয়া (ran); seeing একটা participle।", en: "One finite verb (ran); seeing is a participle." } },
        { text: { bn: "When he saw the tiger, he ran.", en: "When he saw the tiger, he ran." }, bin: "complex", why: { bn: "when দিয়ে অধীন clause, তারপর মূল clause।", en: "A dependent clause with when, then the main clause." } },
        { text: { bn: "He saw the tiger and ran.", en: "He saw the tiger and ran." }, bin: "compound", why: { bn: "and দিয়ে দুটো সমান clause, একই কর্তা।", en: "Two equal clauses with and, sharing a subject." } },
        { text: { bn: "In spite of his illness, he came.", en: "In spite of his illness, he came." }, bin: "simple", why: { bn: "in spite of + noun, clause নয়।", en: "In spite of + a noun, not a clause." } },
        { text: { bn: "He was ill, but he came.", en: "He was ill, but he came." }, bin: "compound", why: { bn: "but দিয়ে দুটো সমান clause।", en: "Two equal clauses with but." } },
        { text: { bn: "Although he was ill, he came.", en: "Although he was ill, he came." }, bin: "complex", why: { bn: "although দিয়ে অধীন clause।", en: "A dependent clause with although." } },
        { text: { bn: "He studied hard to pass the exam.", en: "He studied hard to pass the exam." }, bin: "simple", why: { bn: "to pass একটা infinitive, clause নয়; একটাই finite ক্রিয়া।", en: "To pass is an infinitive, not a clause; one finite verb." } },
        { text: { bn: "He studied hard so that he could pass.", en: "He studied hard so that he could pass." }, bin: "complex", why: { bn: "so that দিয়ে অধীন clause।", en: "A dependent clause with so that." } },
        { text: { bn: "Work hard, or you will fail.", en: "Work hard, or you will fail." }, bin: "compound", why: { bn: "or দিয়ে দুটো সমান clause; complex রূপ: Unless you work hard, you will fail।", en: "Two equal clauses with or; the complex form is Unless you work hard, you will fail." } },
      ],
    },
    "transformation-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: এক কথা, তিন গড়ন", en: "Listen, say: one idea, three builds" },
      lines: [
        { target: "Being tired, Rafi went to bed early.", bn: "ক্লান্ত থাকায় রাফি তাড়াতাড়ি ঘুমাতে গেল। (simple)" },
        { target: "As Rafi was tired, he went to bed early.", bn: "যেহেতু রাফি ক্লান্ত ছিল, সে তাড়াতাড়ি ঘুমাতে গেল। (complex)" },
        { target: "Rafi was tired, so he went to bed early.", bn: "রাফি ক্লান্ত ছিল, তাই তাড়াতাড়ি ঘুমাতে গেল। (compound)" },
        { target: "In spite of his illness, he came to school.", bn: "অসুস্থতা সত্ত্বেও সে স্কুলে এল। (simple)" },
        { target: "Though he was ill, he came to school.", bn: "যদিও সে অসুস্থ ছিল, সে স্কুলে এল। (complex)" },
        { target: "He was ill, but he came to school.", bn: "সে অসুস্থ ছিল, কিন্তু স্কুলে এল। (compound)" },
      ],
    },
    "transformation-machines": {
      kind: "compare",
      title: { bn: "narration আর voice: ছয় ধাপ পাশাপাশি", en: "Narration and voice: six steps side by side" },
      note: { bn: "দুটো মেশিনের একই সংখ্যক ধাপ, আর দুটোরই শেষ ধাপ প্রশ্নের জন্য।", en: "Both machines have the same number of steps, and both end with the step for questions." },
      columns: [{ bn: "narration (পর্ব ১৬)", en: "narration (part 16)" }, { bn: "voice (পর্ব ১৫)", en: "voice (part 15)" }],
      rows: [
        { label: { bn: "১", en: "1" }, cells: [{ bn: "বলার ক্রিয়া বাছো: said / told / asked / requested / ordered", en: "Pick the saying verb: said / told / asked / requested / ordered" }, { bn: "কর্তা, ক্রিয়া, কর্ম চিহ্নিত করো", en: "Mark subject, verb, object" }] },
        { label: { bn: "২", en: "2" }, cells: [{ bn: "জোড়ার শব্দ: that / if / wh- / to / not to", en: "The joining word: that / if / wh- / to / not to" }, { bn: "কর্ম সামনে", en: "Object to the front" }] },
        { label: { bn: "৩", en: "3" }, cells: [{ bn: "কাল এক ধাপ পিছনে (বলার ক্রিয়া অতীতে হলে)", en: "Tense one step back (if the saying verb is past)" }, { bn: "be মূল ক্রিয়ার কালে: is / was / being / been / be", en: "Be in the main verb's tense: is / was / being / been / be" }] },
        { label: { bn: "৪", en: "4" }, cells: [{ bn: "pronoun বক্তার দিক থেকে ঘোরাও", en: "Turn the pronouns from the speaker's side" }, { bn: "মূল ক্রিয়া V3", en: "Main verb to V3" }] },
        { label: { bn: "৫", en: "5" }, cells: [{ bn: "সময় আর জায়গা দূরে সরাও: now → then, here → there", en: "Push time and place away: now to then, here to there" }, { bn: "by + কর্তা, বা বাদ (people, they, someone)", en: "By + agent, or drop it (people, they, someone)" }] },
        { label: { bn: "৬", en: "6" }, cells: [{ bn: "প্রশ্নের ক্রম সোজা করো, প্রশ্নবোধক সরাও", en: "Straighten question order, remove the question mark" }, { bn: "প্রশ্ন হলে আগে বাক্য বানাও, তারপর সাহায্যকারী সামনে", en: "For a question, build the statement first, then move the helper forward" }] },
      ],
    },
    "transformation-gap": {
      kind: "gap",
      title: { bn: "হলে বসে", en: "In the exam room" },
      note: { bn: "প্রতিটা একটা আসল পরীক্ষার ধরনের প্রশ্ন।", en: "Each one is a real exam-style question." },
      items: [
        { text: "The tea is too hot ___.", bn: "চা-টা খাওয়ার পক্ষে খুব গরম।", options: ["to drink", "that I cannot drink", "for drink"], right: 0, why: { bn: "too + adjective + to + খালি ক্রিয়া।", en: "Too + adjective + to + bare verb." } },
        { text: "It is high time we ___ the work.", bn: "এখনই কাজটা শুরু করার সময়।", options: ["start", "started", "will start"], right: 1, why: { bn: "It is high time-এর পরে past: started।", en: "After it is high time comes the past: started." } },
        { text: "Walk carefully lest you ___ fall.", bn: "সাবধানে হাঁটো, পাছে পড়ে যাও।", options: ["will", "should", "can"], right: 1, why: { bn: "lest-এর পরে should।", en: "After lest comes should." } },
        { text: "She talks as if she ___ everything.", bn: "সে এমনভাবে কথা বলে যেন সব জানে।", options: ["knows", "knew", "has known"], right: 1, why: { bn: "as if-এর পরে past, অবাস্তব: knew।", en: "After as if comes the past, unreal: knew." } },
        { text: "No other bowler in the team is ___ Mustafiz.", bn: "দলে আর কোনো বোলার মুস্তাফিজের মতো দ্রুত নয়।", options: ["faster than", "as fast as", "the fastest"], right: 1, why: { bn: "superlative থেকে positive: No other … as … as।", en: "Superlative to positive: No other … as … as." } },
        { text: "Who does not love his country? = ___ loves his country.", bn: "কে না তার দেশকে ভালোবাসে? = সবাই তার দেশকে ভালোবাসে।", options: ["Nobody", "Everybody", "Somebody"], right: 1, why: { bn: "না-বাচক প্রশ্ন থেকে হ্যাঁ-বাচক বাক্য: Everybody।", en: "A negative question becomes a positive statement: Everybody." } },
      ],
    },
    "transformation-starters": {
      kind: "match",
      title: { bn: "শুরুর শব্দ, তার ছাঁচ", en: "The opening word and its pattern" },
      note: { bn: "completing sentences-এ শুরুটাই ছাঁচ বলে দেয়। মেলাও।", en: "In completing sentences, the opening decides the pattern. Match them." },
      pairs: [
        { left: { bn: "It is high time …", en: "It is high time …" }, right: { bn: "past: we left", en: "past: we left" } },
        { left: { bn: "I wish …", en: "I wish …" }, right: { bn: "past বা had V3: I were rich", en: "past or had V3: I were rich" } },
        { left: { bn: "Lest …", en: "Lest …" }, right: { bn: "should: you should fall", en: "should: you should fall" } },
        { left: { bn: "… so that …", en: "… so that …" }, right: { bn: "can / could: he could pass", en: "can / could: he could pass" } },
        { left: { bn: "If I were you, …", en: "If I were you, …" }, right: { bn: "would: I would apologise", en: "would: I would apologise" } },
        { left: { bn: "Though he is poor, …", en: "Though he is poor, …" }, right: { bn: "বিপরীত: he is honest", en: "the opposite: he is honest" } },
        { left: { bn: "No sooner had he left …", en: "No sooner had he left …" }, right: { bn: "than: than it rained", en: "than: than it rained" } },
      ],
    },
    "transformation-complete": {
      kind: "gap",
      title: { bn: "completing sentences: ছাঁচ আর মানে, দুটোই", en: "Completing sentences: pattern and meaning, both" },
      note: { bn: "প্রতিটায় একটাই শেষ ঠিক: ব্যাকরণ শুরুর সাথে মেলে, আর মানেও হয়।", en: "Only one ending is right each time: the grammar fits the opening, and the sense holds." },
      items: [
        { text: "If I had wings, ___.", bn: "আমার ডানা থাকলে আমি উড়তাম।", options: ["I would fly", "I will fly", "I fly"], right: 0, why: { bn: "দ্বিতীয় সিঁড়ি, had, তাই would। will লিখলে মানে ঠিক, ব্যাকরণ ভুল।", en: "Second ladder, had, so would. With will the sense is fine and the grammar wrong." } },
        { text: "Though he is rich, ___.", bn: "যদিও সে ধনী, সে সুখী নয়।", options: ["he is unhappy", "he has a big car", "he is very rich"], right: 0, why: { bn: "though বিপরীত চায়। বড় গাড়ি ধনীর বিপরীত নয়।", en: "Though wants a contrast. A big car is no contrast to being rich." } },
        { text: "He ran fast so that ___.", bn: "সে জোরে দৌড়াল যাতে বাসটা ধরতে পারে।", options: ["he could catch the bus", "he can catch the bus", "he caught the bus"], right: 0, why: { bn: "ran অতীত, তাই could।", en: "Ran is past, so could." } },
        { text: "Unless you hurry, ___.", bn: "তাড়াতাড়ি না করলে তুমি ট্রেন মিস করবে।", options: ["you will miss the train", "you will catch the train", "you would miss the train"], right: 0, why: { bn: "unless = if not, তাই খারাপ ফল, আর প্রথম সিঁড়িতে will।", en: "Unless means if not, so a bad outcome, and will on the first ladder." } },
        { text: "It is high time ___.", bn: "এখনই কাজ শুরু করার সময়।", options: ["we started work", "we start work", "we will start work"], right: 0, why: { bn: "high time-এর পরে past: started।", en: "After high time, the past: started." } },
        { text: "Hardly had we sat down ___.", bn: "আমরা বসতে না বসতেই বাতি নিভে গেল।", options: ["when the lights went out", "than the lights went out", "then the lights went out"], right: 0, why: { bn: "Hardly-র জোড়া when। পর্ব ২২।", en: "Hardly pairs with when. Part 22." } },
      ],
    },
    "transformation-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: not কোথায় গেল", en: "Guess first: where did the not go" },
      ask: { bn: "He is so honest that he cannot tell a lie. 'too' দিয়ে বদলাতে গিয়ে রাফি লিখল: He is too honest to not tell a lie. মিতু আপু কাটল। ঠিকটা কী?", en: "He is so honest that he cannot tell a lie. Changing it with 'too', Rafi wrote: He is too honest to not tell a lie. Mitu crossed it out. What is right?" },
      choices: [
        { bn: "He is too honest to tell a lie.", en: "He is too honest to tell a lie." },
        { bn: "He is too honest not to tell a lie.", en: "He is too honest not to tell a lie." },
        { bn: "He is too honest that he tells a lie.", en: "He is too honest that he tells a lie." },
      ],
      answer: { bn: "He is too honest to tell a lie.", en: "He is too honest to tell a lie." },
      why: { bn: "too নিজেই না-বাচক: too honest to tell মানে এত সৎ যে বলতে পারে না। that-এর ঘরের cannot এই too-র ভিতরে ঢুকে যায়, আলাদা not লাগে না। রাফি not-টা রেখে দিয়ে দুবার না বলে ফেলেছে, মানে উল্টে গেছে: সে মিথ্যা বলে। বদলের পরের প্রশ্নটাই এখানে বাঁচায়: একই ঘটনা বলছে তো? মূল বাক্যে সে মিথ্যা বলে না; বদলেও যেন না বলে।", en: "Too is negative by itself: too honest to tell means so honest he cannot. The cannot in the that clause folds into too; no separate not is needed. Rafi kept the not and said no twice, so the meaning flipped: he does lie. The question after the change is what saves you here: is it the same event? In the original he does not lie; after the change he must not either." },
    },
    "transformation-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "Unless you study, you will fail. এর ঠিক বদল কোনটা?", en: "Unless you study, you will fail. Which is the right change?" },
          options: [
            { text: { bn: "If you study, you will fail.", en: "If you study, you will fail." }, why: { bn: "না। unless মানে if not; not হারিয়ে গেছে, মানে উল্টে গেছে।", en: "No. Unless means if not; the not has vanished and the meaning flipped." } },
            { text: { bn: "If you do not study, you will fail.", en: "If you do not study, you will fail." }, right: true, why: { bn: "হ্যাঁ। unless = if … not, বাকি সব একই।", en: "Yes. Unless equals if … not; everything else stays." } },
            { text: { bn: "If you study, you will not fail.", en: "If you study, you will not fail." }, why: { bn: "না। মানে কাছাকাছি, কিন্তু এটা অন্য বাক্য: not অন্য ঘরে চলে গেছে। পরীক্ষায় হুবহু ছাঁচ চাই।", en: "No. Close in sense, but a different sentence: the not moved rooms. The exam wants the exact pattern." } },
          ],
        },
        {
          ask: { bn: "Seeing the police, the thief ran away. এটা কোন গড়নের বাক্য?", en: "Seeing the police, the thief ran away. Which build is this?" },
          options: [
            { text: { bn: "simple", en: "simple" }, right: true, why: { bn: "হ্যাঁ। একটাই finite ক্রিয়া (ran); seeing একটা participle, clause নয়।", en: "Yes. One finite verb (ran); seeing is a participle, not a clause." } },
            { text: { bn: "complex", en: "complex" }, why: { bn: "না। complex হতে when, because, who-র মতো একটা অধীন clause লাগত: When he saw the police…", en: "No. Complex would need a dependent clause with when, because, who: When he saw the police…" } },
            { text: { bn: "compound", en: "compound" }, why: { bn: "না। compound-এ and, but, so দিয়ে দুটো সমান clause: He saw the police and ran away.", en: "No. Compound joins two equal clauses with and, but, so: He saw the police and ran away." } },
          ],
        },
        {
          ask: { bn: "Shakib is the best all-rounder. comparative-এ কোনটা ঠিক?", en: "Shakib is the best all-rounder. Which comparative is right?" },
          options: [
            { text: { bn: "Shakib is better than any other all-rounders.", en: "Shakib is better than any other all-rounders." }, why: { bn: "না। any other-এর পরে একবচন: all-rounder। মানে ঠিক, এক নম্বর গেল।", en: "No. After any other comes the singular: all-rounder. The sense is right and a mark is gone." } },
            { text: { bn: "Shakib is better than any other all-rounder.", en: "Shakib is better than any other all-rounder." }, right: true, why: { bn: "হ্যাঁ। any other + একবচন; all other + বহুবচন হলেও চলত।", en: "Yes. Any other + singular; all other + plural would also work." } },
            { text: { bn: "Shakib is the better all-rounder than others.", en: "Shakib is the better all-rounder than others." }, why: { bn: "না। the better … than বলে ছাঁচ নেই; the বাদ, any other বসাও।", en: "No. There is no the better … than pattern; drop the and put any other." } },
          ],
        },
      ],
    },
    "transformation-build": {
      kind: "build",
      title: { bn: "শব্দ সাজাও: বদলের ছাঁচগুলো", en: "Build it: the transformation patterns" },
      note: { bn: "প্রতিটা লাইন একটা transformation-এর 'পরের' রূপ। ছাঁচের শব্দগুলো (too, unless, No other, What a) কোথায় বসে, দেখো।", en: "Each line is the 'after' form of one transformation. Watch where the pattern words (too, unless, No other, What a) land." },
      pattern: "too + adjective + to + verb  ·  Unless + clause, will …  ·  No other … as … as  ·  What a … it was!",
      lines: [
        { target: "He is too weak to walk.", bn: "সে হাঁটার পক্ষে খুব বেশি দুর্বল।" },
        { target: "Unless you hurry, you will be late.", bn: "তাড়াতাড়ি না করলে দেরি হবে।" },
        { target: "No other all-rounder is as good as Shakib.", bn: "অন্য কোনো অলরাউন্ডার শাকিবের মতো ভালো নয়।" },
        { target: "What a great match it was!", bn: "কী দারুণ ম্যাচই না ছিল!" },
        { target: "Who can deny it?", bn: "কে এটা অস্বীকার করতে পারে?" },
        { target: "It is high time we started the work.", bn: "এখনই কাজটা শুরু করার সময়।" },
      ],
    },
    "transformation-spot": {
      kind: "spot",
      title: { bn: "মিতুর খাতা দেখা", en: "Marking Mitu's paper" },
      note: { bn: "রাফির ব্যাকরণ অংশের উত্তর, মিতু আপু দেখছে। যে লাইনে ভুল, সেটা ছোঁও, আর কোন পর্বের ফাঁদ মনে করো।", en: "Rafi's answers to the grammar section, with Mitu marking. Tap every line with a mistake and recall which part's trap it is." },
      source: { bn: "রাফির উত্তরপত্র, ব্যাকরণ অংশ", en: "Rafi's answer sheet, grammar section" },
      lines: [
        { text: { bn: "Right form: She has lived here since 2020.", en: "Right form: She has lived here since 2020." } },
        { text: { bn: "Transformation (too): He is too weak that he cannot walk.", en: "Transformation (too): He is too weak that he cannot walk." }, flag: { bn: "too আর that একসাথে নয়: too weak to walk।", en: "Too and that never sit together: too weak to walk." } },
        { text: { bn: "Narration: Ma asked me where was I going?", en: "Narration: Ma asked me where was I going?" }, flag: { bn: "প্রশ্নের ক্রম সোজা হয়নি, প্রশ্নবোধক রয়ে গেছে: asked me where I was going. পর্ব ১৬।", en: "Question order not straightened, question mark left in: asked me where I was going. Part 16." } },
        { text: { bn: "Voice: The window was broken by the boys.", en: "Voice: The window was broken by the boys." } },
        { text: { bn: "Degree: Shakib is better than any other all-rounders.", en: "Degree: Shakib is better than any other all-rounders." }, flag: { bn: "any other + একবচন: all-rounder।", en: "Any other + singular: all-rounder." } },
        { text: { bn: "Completing: If I were a bird, I will fly to Cox's Bazar.", en: "Completing: If I were a bird, I will fly to Cox's Bazar." }, flag: { bn: "দ্বিতীয় সিঁড়ি: would fly। পর্ব ১৭।", en: "Second ladder: would fly. Part 17." } },
        { text: { bn: "Simple to complex: Being ill, he stayed home. = As he was ill, he stayed home.", en: "Simple to complex: Being ill, he stayed home. = As he was ill, he stayed home." } },
        { text: { bn: "Voice: The letter was wrote by Nanu yesterday.", en: "Voice: The letter was wrote by Nanu yesterday." }, flag: { bn: "passive-এ V3: was written। পর্ব ১৫।", en: "The passive takes V3: was written. Part 15." } },
      ],
    },
    "transformation-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "তিনটা প্রশ্ন, তিনটা মেশিন। প্রতিটায় বদলের পরের প্রশ্নটা করো: একই ঘটনা?", en: "Three questions, three machines. Ask the after-question each time: is it the same event?" },
      questions: [
        {
          ask: { bn: "Everyone loves Nanu. negative-এ কোনটা ঠিক?", en: "Everyone loves Nanu. Which negative is right?" },
          options: [
            { text: { bn: "There is no one who does not love Nanu.", en: "There is no one who does not love Nanu." }, right: true, why: { bn: "হ্যাঁ। দুটো না = হ্যাঁ, মানে একই থাকল।", en: "Yes. Two negatives make a positive; the meaning holds." } },
            { text: { bn: "No one loves Nanu.", en: "No one loves Nanu." }, why: { bn: "না। ব্যাকরণ ঠিক, মানে উল্টো। negative করা মানে মানে বদলানো নয়।", en: "No. The grammar is fine and the meaning flipped. Making it negative does not mean changing what it says." } },
            { text: { bn: "Everyone does not love Nanu.", en: "Everyone does not love Nanu." }, why: { bn: "না। এটাও মানে বদলায়: সবাই ভালোবাসে না।", en: "No. This changes the meaning too: not everyone loves." } },
          ],
        },
        {
          ask: { bn: "Nobody can deny it. interrogative-এ?", en: "Nobody can deny it. As a question?" },
          options: [
            { text: { bn: "Can nobody deny it?", en: "Can nobody deny it?" }, why: { bn: "না। ব্যাকরণ ঠিক, কিন্তু এটা সত্যিকারের প্রশ্ন, বাক্যের মানে ধরে না। পরীক্ষা চায় Who can deny it?", en: "No. Grammatical, but a real question that does not carry the statement's meaning. The exam wants Who can deny it?" } },
            { text: { bn: "Who can deny it?", en: "Who can deny it?" }, right: true, why: { bn: "হ্যাঁ। Nobody can → Who can? উত্তর যার নেই, সেই প্রশ্ন।", en: "Yes. Nobody can becomes Who can? A question with no answer, which is the point." } },
            { text: { bn: "Who cannot deny it?", en: "Who cannot deny it?" }, why: { bn: "না। মানে উল্টে গেল: সবাই অস্বীকার করতে পারে।", en: "No. The meaning flipped: everybody can deny it." } },
          ],
        },
        {
          ask: { bn: "He studied hard so that he could pass. simple-এ?", en: "He studied hard so that he could pass. As a simple sentence?" },
          options: [
            { text: { bn: "He studied hard to pass.", en: "He studied hard to pass." }, right: true, why: { bn: "হ্যাঁ। so that … could → to; একটাই finite ক্রিয়া।", en: "Yes. So that … could becomes to; one finite verb." } },
            { text: { bn: "He studied hard and passed.", en: "He studied hard and passed." }, why: { bn: "না। এটা compound, আর মানেও বদলেছে: পাশ করা উদ্দেশ্য ছিল, ফল নয়।", en: "No. That is compound, and the meaning changed: passing was the aim, not the result." } },
            { text: { bn: "He studied hard because he wanted to pass.", en: "He studied hard because he wanted to pass." }, why: { bn: "না। because দিয়ে অধীন clause, এটা complex।", en: "No. A dependent clause with because makes it complex." } },
          ],
        },
      ],
    },
    "transformation-drill": {
      kind: "drill",
      title: { bn: "খাতায় করো", en: "Do it on paper" },
      steps: [
        { text: { bn: "একটা so…that বাক্য নাও আর too…to বানাও; তারপর উল্টোটা। পাঁচবার।", en: "Take one so…that sentence and make it too…to; then the reverse. Five times." } },
        { text: { bn: "নিজের একটা সাধারণ বাক্যকে simple, complex আর compound তিন গড়নে লেখো।", en: "Write one plain sentence of your own as simple, complex and compound." } },
        { text: { bn: "গত বছরের প্রশ্নপত্রের ব্যাকরণ অংশটা সময় ধরে করো, তারপর এই টার্মের পর্ব নম্বর দিয়ে প্রতিটা ভুলের পাশে লেখো কোন পর্বে ফিরতে হবে।", en: "Do last year's grammar section against the clock, then write beside each mistake which part of this term to go back to." } },
        { text: { bn: "আগের-শব্দের নয় সারির টেবিল থেকে প্রতিটা সারিতে নিজের একটা বাক্য, বন্ধনী সহ, তারপর নিজেই ভরো।", en: "From the nine-row word-before table, write one sentence of your own per row with brackets, then fill them in yourself." } },
        { text: { bn: "দশটা completing-শুরু একটা কাগজে, শেষটা ঢেকে রাখো, তারপর মুখে শেষ করো। ছাঁচ আর মানে, দুটোই যাচাই।", en: "Ten completing openers on a sheet, endings covered, then finish each aloud. Check pattern and meaning both." } },
        { text: { bn: "খেলা: একজন একটা বাক্য বলবে আর একটা বদলের নাম (too, unless, degree, negative, question, exclamatory, simple)। অন্যজন দশ সেকেন্ডে বদলাবে। সাতটা, তারপর পালা বদল।", en: "A game: one says a sentence and names a change (too, unless, degree, negative, question, exclamatory, simple). The other changes it in ten seconds. Seven, then swap." } },
      ],
    },
  },
};
