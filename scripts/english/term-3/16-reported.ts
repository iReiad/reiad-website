/* ============================================================
   16-reported.ts: পর্ব ১৬, সে বলল যে…: reported speech.

   One part of the grammar term, gathered into the rung by
   `middle.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>মিতু আপু ফোনে বলল, <span lang="en">"I am busy today."</span> রাফি মাকে বলতে গেল কী শুনেছে। সে তো আর মিতুর গলায় বলবে না, নিজের মুখে বলবে: <span lang="en">Mitu said that she was busy that day.</span> <span lang="en">I</span> হয়ে গেল <span lang="en">she</span>, <span lang="en">am</span> হয়ে গেল <span lang="en">was</span>, <span lang="en">today</span> হয়ে গেল <span lang="en">that day</span>। অন্যের কথা নিজের মুখে বহন করার এই মেশিনের নাম <span lang="en">reported speech</span>, পরীক্ষার খাতায় <span lang="en">narration</span>। নিয়ম মেনে চললে এটা পুরো নম্বরের প্রশ্ন।</p>

<p>এই পর্বে চারটা নিয়ম (কাল, pronoun আর সময়, প্রশ্ন, আদেশ), তারপর বাকি সব জাত: চমক, প্রস্তাব, শুভকামনা, <span lang="en">yes/no</span>, সম্বোধন, আর একই উদ্ধৃতিতে দুটো বাক্য। আর উল্টো দিকটাও, <span lang="en">indirect to direct</span>, কারণ পরীক্ষা সেটাও চায়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>উদ্ধৃতি চিহ্ন যায়, <span lang="en">that</span> আসে: <span lang="en">She said, "…" → She said that …</span></li>
<li>কাল এক ধাপ পিছিয়ে যায়: <span lang="en">am → was, play → played, played → had played, will → would, can → could</span>।</li>
<li>pronoun বক্তার দিক থেকে শ্রোতার দিকে ঘোরে: <span lang="en">I → he/she, my → his/her, you → me/him</span>।</li>
<li>সময় আর জায়গা দূরে সরে যায়: <span lang="en">now → then, today → that day, tomorrow → the next day, here → there, this → that</span>।</li>
<li>প্রশ্নে <span lang="en">asked</span> আর সোজা ক্রম; আদেশে <span lang="en">told/asked + to</span>; চমকে <span lang="en">exclaimed</span>; চিরসত্যে কাল বদলায় না।</li>
<li>বলার ক্রিয়া বর্তমানে (<span lang="en">says</span>) হলে কিছুই পিছোয় না।</li>
</ul>
</div>

${mount("reported-pattern")}

<h2>প্রথম নিয়ম: কাল এক ধাপ পিছনে</h2>

<p>বলার ক্রিয়াটা যদি অতীতে থাকে (<span lang="en">said, told, asked</span>), ভিতরের কাল এক ধাপ পিছিয়ে যায়। কারণ কথাটা বলা হয়েছিল আগে, তুমি বলছ এখন। পর্ব ৭ আর ১১-র মানচিত্রে এক ঘর নিচে:</p>

<div class="table-scroll">
<table>
<thead><tr><th>সরাসরি</th><th>বহন করে</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td>present simple</td><td>past simple</td><td><span lang="en">"I play." → He said he played.</span></td></tr>
<tr><td>present continuous</td><td>past continuous</td><td><span lang="en">"I am playing." → He said he was playing.</span></td></tr>
<tr><td>past simple</td><td>past perfect</td><td><span lang="en">"I played." → He said he had played.</span></td></tr>
<tr><td>present perfect</td><td>past perfect</td><td><span lang="en">"I have played." → He said he had played.</span></td></tr>
<tr><td>past perfect</td><td>past perfect (আর পিছোয় না)</td><td><span lang="en">"I had played." → He said he had played.</span></td></tr>
<tr><td><span lang="en">will</span></td><td><span lang="en">would</span></td><td><span lang="en">"I will play." → He said he would play.</span></td></tr>
<tr><td><span lang="en">can</span></td><td><span lang="en">could</span></td><td><span lang="en">"I can play." → He said he could play.</span></td></tr>
<tr><td><span lang="en">may</span></td><td><span lang="en">might</span></td><td><span lang="en">"I may play." → He said he might play.</span></td></tr>
<tr><td><span lang="en">must</span></td><td><span lang="en">had to</span></td><td><span lang="en">"I must play." → He said he had to play.</span></td></tr>
<tr><td><span lang="en">would, could, should, might</span></td><td>একই থাকে</td><td><span lang="en">"I should go." → He said he should go.</span></td></tr>
</tbody>
</table>
</div>

<p>তিনটা জায়গায় কাল বদলায় না। বলার ক্রিয়া বর্তমানে হলে (<span lang="en">says, tells</span>): <span lang="en">She says that she is busy.</span> চিরসত্য: <span lang="en">The teacher said that the earth goes round the sun.</span> পৃথিবী এখনো ঘোরে, তাই <span lang="en">goes</span>। আর যে কথা এখনো সত্যি, বহন করার সময়েও: <span lang="en">Rafi said that he lives in Dhaka</span> (এখনো থাকে) চলে, যদিও পরীক্ষায় <span lang="en">lived</span> নিরাপদ।</p>

${mount("reported-shift")}

${mount("reported-lines")}

<h2>দ্বিতীয় নিয়ম: pronoun আর সময় সরে যায়</h2>

<p>বক্তা যখন <span lang="en">I</span> বলেছিল, তুমি বহন করার সময় সেটা <span lang="en">he</span> বা <span lang="en">she</span>। বক্তা যাকে <span lang="en">you</span> বলেছিল, সে যদি তুমি হও, তাহলে <span lang="en">me</span>: <span lang="en">Mitu said, "I will help you." → Mitu said that she would help me.</span> সময়ের শব্দ: <span lang="en">now → then, today → that day, tonight → that night, yesterday → the day before, tomorrow → the next day, last week → the week before, next week → the following week, ago → before, here → there, this → that, these → those</span>।</p>

<p>pronoun-এর নিয়মটা একটা ছকে, কারণ এখানেই বেশি ভুল হয়। প্রথম ব্যক্তি (<span lang="en">I, we, my, our</span>) বক্তার সাথে যায়: বক্তা রাফি হলে <span lang="en">he, his</span>; বক্তা রাফি আর মিতু হলে <span lang="en">they, their</span>। দ্বিতীয় ব্যক্তি (<span lang="en">you, your</span>) শ্রোতার সাথে যায়: শ্রোতা আমি হলে <span lang="en">me, my</span>; শ্রোতা তামিম হলে <span lang="en">him, his</span>। তৃতীয় ব্যক্তি (<span lang="en">he, she, they</span>) বদলায় না। মনে রাখার কথা: <strong>প্রথম বক্তার, দ্বিতীয় শ্রোতার, তৃতীয় যেমন আছে।</strong></p>

<div class="table-scroll">
<table>
<thead><tr><th>সরাসরি</th><th>কে বলল, কাকে</th><th>বহন করে</th></tr></thead>
<tbody>
<tr><td><span lang="en">"I will help you."</span></td><td>মিতু আমাকে</td><td><span lang="en">Mitu said that she would help me.</span></td></tr>
<tr><td><span lang="en">"I will help you."</span></td><td>মিতু রাফিকে</td><td><span lang="en">Mitu told Rafi that she would help him.</span></td></tr>
<tr><td><span lang="en">"We are ready."</span></td><td>খেলোয়াড়রা কোচকে</td><td><span lang="en">The players told the coach that they were ready.</span></td></tr>
<tr><td><span lang="en">"Your bat is here."</span></td><td>নানু আমাকে</td><td><span lang="en">Nanu said that my bat was there.</span></td></tr>
<tr><td><span lang="en">"He is late."</span></td><td>যে কেউ</td><td><span lang="en">She said that he was late.</span> (বদলায়নি)</td></tr>
</tbody>
</table>
</div>

${mount("reported-time")}

<h2>তৃতীয় নিয়ম: প্রশ্ন সোজা হয়ে বসে</h2>

<p>পর্ব ১৩-র ফাঁদটা মনে করো: বাক্যের ভিতরে প্রশ্ন ঢুকলে সে ভদ্র হয়ে সোজা হয়। <span lang="en">said</span>-এর জায়গায় <span lang="en">asked</span>, প্রশ্নবোধক চিহ্ন যায়, আর ক্রম হয় সাধারণ বাক্যের। wh-প্রশ্নে wh-শব্দটাই জোড়া: <span lang="en">He asked, "Where do you live?" → He asked me where I lived.</span> হ্যাঁ/না প্রশ্নে <span lang="en">if</span> বা <span lang="en">whether</span>: <span lang="en">She asked, "Are you ready?" → She asked if I was ready.</span> <span lang="en">do/does/did</span> মেশিনটা একেবারে চলে যায়: <span lang="en">"Do you like tea?" → She asked if I liked tea.</span> <span lang="en">did</span> নেই, <span lang="en">like</span> এক ধাপ পিছিয়ে <span lang="en">liked</span>।</p>

<h2>চতুর্থ নিয়ম: আদেশ হয় to</h2>

<p>আদেশ বা অনুরোধ বহন করতে <span lang="en">told / asked / ordered / requested + কাকে + to + ক্রিয়া</span>। <span lang="en">Coach said, "Practise every day." → Coach told us to practise every day.</span> না-বাচকে <span lang="en">not to</span>: <span lang="en">"Don't be late." → He told me not to be late.</span> <span lang="en">please</span> থাকলে <span lang="en">requested</span>, নইলে <span lang="en">told</span> বা <span lang="en">ordered</span>। <span lang="en">Let's</span> হলে <span lang="en">suggested + -ing</span>: <span lang="en">"Let's go." → She suggested going.</span> উপদেশ হলে <span lang="en">advised</span>: <span lang="en">"You should rest." → The doctor advised me to rest.</span></p>

${mount("reported-verbs")}

${mount("reported-gap")}

<h2>বাকি জাতগুলো: চমক, শুভকামনা, হ্যাঁ-না, সম্বোধন</h2>

<p>পরীক্ষায় পাঁচটা বাক্যের একটা প্রায়ই এই দল থেকে, আর প্রতিটার একটা ছোট ছাঁচ। <strong>চমক:</strong> <span lang="en">exclaimed with joy / sorrow / surprise that</span>, আর ভিতরের <span lang="en">What a / How</span> হয়ে যায় <span lang="en">very</span>। <span lang="en">"What a lovely day!" she said. → She exclaimed with joy that it was a very lovely day.</span> <span lang="en">Hurrah</span> থাকলে <span lang="en">with joy</span>, <span lang="en">Alas</span> থাকলে <span lang="en">with sorrow</span>। <strong>শুভকামনা:</strong> <span lang="en">wished / prayed that</span>: <span lang="en">"May you live long," Nanu said. → Nanu prayed that I might live long.</span> <strong>হ্যাঁ/না উত্তর:</strong> <span lang="en">replied in the affirmative / negative</span>: <span lang="en">"Yes, I will come," he said. → He replied in the affirmative that he would come.</span> <strong>সম্বোধন:</strong> নামটা <span lang="en">addressing</span> দিয়ে, বা <span lang="en">told + নাম</span>: <span lang="en">"Rafi, come here," Ma said. → Ma told Rafi to go there.</span> (<span lang="en">come</span> হয়ে গেল <span lang="en">go</span>, কারণ জায়গাটা দূরে সরে গেছে।) <strong>ধন্যবাদ আর দুঃখ প্রকাশ:</strong> <span lang="en">thanked, apologised</span>: <span lang="en">"Thank you," she said. → She thanked me. "Sorry," he said. → He apologised.</span></p>

<div class="table-scroll">
<table>
<thead><tr><th>জাত</th><th>চিহ্ন</th><th>বলার ক্রিয়া</th><th>জোড়া</th></tr></thead>
<tbody>
<tr><td>বলা</td><td>ফুল স্টপ</td><td><span lang="en">said, told</span></td><td><span lang="en">that</span></td></tr>
<tr><td>wh-প্রশ্ন</td><td>?, wh-শব্দ</td><td><span lang="en">asked</span></td><td>wh-শব্দ</td></tr>
<tr><td>হ্যাঁ/না প্রশ্ন</td><td>?, সাহায্যকারী আগে</td><td><span lang="en">asked</span></td><td><span lang="en">if / whether</span></td></tr>
<tr><td>আদেশ, অনুরোধ, উপদেশ</td><td>খালি ক্রিয়া, <span lang="en">please</span></td><td><span lang="en">told, ordered, requested, advised</span></td><td><span lang="en">to / not to</span></td></tr>
<tr><td>প্রস্তাব</td><td><span lang="en">Let's</span></td><td><span lang="en">suggested, proposed</span></td><td><span lang="en">-ing</span> বা <span lang="en">that we should</span></td></tr>
<tr><td>চমক</td><td>!, <span lang="en">What a / How</span></td><td><span lang="en">exclaimed with joy / sorrow</span></td><td><span lang="en">that … very</span></td></tr>
<tr><td>শুভকামনা</td><td><span lang="en">May</span></td><td><span lang="en">wished, prayed</span></td><td><span lang="en">that … might</span></td></tr>
<tr><td>হ্যাঁ / না</td><td><span lang="en">Yes / No</span></td><td><span lang="en">replied in the affirmative / negative</span></td><td><span lang="en">that</span></td></tr>
</tbody>
</table>
</div>

${mount("reported-kinds")}

<h2>উদ্ধৃতিতে দুটো বাক্য, আর উল্টো দিক</h2>

<p>উদ্ধৃতির ভিতরে দুটো আলাদা জাতের বাক্য থাকলে দুটো আলাদা বলার ক্রিয়া, <span lang="en">and</span> দিয়ে জোড়া। <span lang="en">Rafi said, "I am tired. Can I go home?" → Rafi said that he was tired and asked if he could go home.</span> প্রথমটা বলা, দ্বিতীয়টা প্রশ্ন, তাই <span lang="en">said that … and asked if</span>। একই জাতের দুটো বাক্য হলে একটা ক্রিয়াতেই চলে।</p>

<p>আর উল্টো দিক, <span lang="en">indirect to direct</span>: সব নিয়ম উল্টো করে চালাও। <span lang="en">that</span> যায়, উদ্ধৃতি চিহ্ন আসে, কাল এক ধাপ সামনে, pronoun বক্তার মুখে ফেরে, <span lang="en">that day</span> হয় <span lang="en">today</span>, <span lang="en">told me to</span> হয় একটা আদেশ, <span lang="en">asked if</span> হয় একটা প্রশ্ন, প্রশ্নবোধক ফিরে আসে। <span lang="en">Mitu said that she would call me the next day. → Mitu said, "I will call you tomorrow."</span> যতিচিহ্ন মনে রেখো: বলার ক্রিয়ার পরে কমা, উদ্ধৃতি বড় হাতে শুরু, শেষের চিহ্ন উদ্ধৃতির ভিতরে।</p>

<div class="ex"><b>নানুর গল্পে narration সবসময়:</b> নানু বলেন, <span lang="en">The king said, "I will give half my kingdom to the man who brings the golden bird."</span> আর পরদিন রাফি বন্ধুকে বলে: <span lang="en">Nanu told me that the king had said he would give half his kingdom to the man who brought the golden bird.</span> কাল দুই ধাপ পিছিয়েছে, কারণ দুই স্তরের বহন। Home Alone-এর Kevin: <span lang="en">"I made my family disappear!" → Kevin shouted that he had made his family disappear.</span></div>

${mount("reported-reveal")}

${mount("reported-build")}

${mount("reported-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p><span lang="en">Narration</span>: পাঁচটা বাক্য বা একটা ছোট কথোপকথন, সরাসরি থেকে পরোক্ষে, কখনো উল্টো। চারটা কাজ ক্রমে, প্রতিবার, আর শেষে একবার জোরে পড়া।</p>

<ol class="step-list">
<li><strong>জাত চেনো, বলার ক্রিয়া বাছো।</strong> ফুল স্টপ: <span lang="en">said / told</span>। ?: <span lang="en">asked</span>। খালি ক্রিয়া বা <span lang="en">please</span>: <span lang="en">told / requested / advised</span>। <span lang="en">Let's</span>: <span lang="en">suggested</span>। !: <span lang="en">exclaimed</span>। <span lang="en">May</span>: <span lang="en">wished</span>।</li>
<li><strong>জোড়ার শব্দ বসাও।</strong> <span lang="en">that / wh-শব্দ / if / to / not to / -ing</span>।</li>
<li><strong>কাল এক ধাপ পিছনে,</strong> যদি বলার ক্রিয়া অতীতে আর কথাটা চিরসত্য নয়।</li>
<li><strong>pronoun আর সময়ের শব্দ ঘোরাও।</strong> প্রথম বক্তার, দ্বিতীয় শ্রোতার। <span lang="en">today → that day, here → there, come → go</span>।</li>
<li><strong>একবার জোরে পড়ো।</strong> প্রশ্নবোধক থেকে গেছে? উদ্ধৃতি চিহ্ন থেকে গেছে? <span lang="en">told</span>-এর পরে কাকে আছে?</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">"Where are you going, Rafi?" Ma asked. "I am going to the field," Rafi replied. "Don't be late. Your father will come home early today," Ma said.</span> উত্তর: <span lang="en">Ma asked Rafi where he was going. Rafi replied that he was going to the field. Ma told him not to be late and added that his father would come home early that day.</span> তিনটা উদ্ধৃতি, চার জাত, প্রতিটার নিজের ক্রিয়া, আর <span lang="en">today</span> হয়ে গেল <span lang="en">that day</span>।</div>

${mount("reported-exam")}

${mount("reported-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Narration</span>-এ চারটা কাজ ক্রমে, প্রতিবার: (১) বলার ক্রিয়া বাছো: বলা হলে <span lang="en">said/told</span>, প্রশ্ন হলে <span lang="en">asked</span>, আদেশ হলে <span lang="en">told/ordered/requested</span>, চমক হলে <span lang="en">exclaimed with joy/sorrow</span>, <span lang="en">Let's</span> হলে <span lang="en">suggested</span>। (২) জোড়ার শব্দ: <span lang="en">that / if / wh-শব্দ / to</span>। (৩) কাল এক ধাপ পিছনে, যদি বলার ক্রিয়া অতীতে। (৪) pronoun আর সময়ের শব্দ ঘোরাও। শেষে একবার জোরে পড়ো: প্রশ্নবোধক চিহ্ন থেকে গেছে কি না দেখো।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">say</span> আর <span lang="en">tell</span>। <span lang="en">tell</span>-এর পরে সবসময় কাকে: <span lang="en">She told me.</span> <span lang="en">say</span>-এর পরে সরাসরি কথা বা <span lang="en">that</span>: <span lang="en">She said that…</span> <span lang="en">She told that</span> ভুল, <span lang="en">She said me</span> ভুল। কাকে বললে <span lang="en">tell</span>, কী বললে <span lang="en">say</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p><span lang="en">said to</span> থাকলে বহন করার সময় সেটা <span lang="en">told</span> হয়ে যায়: <span lang="en">Rafi said to me, "…" → Rafi told me that…</span> <span lang="en">said to me that</span> চলে, কিন্তু ভারী। আর প্রশ্নে কখনো <span lang="en">said</span> নয়, <span lang="en">asked</span>; আর <span lang="en">asked</span>-এর পরে <span lang="en">that</span> নয়: <span lang="en">He asked that where I lived</span> ভুল।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>কালের ছক: আটটা বদল না দেখে?</li>
<li>কোন তিন জায়গায় কাল বদলায় না?</li>
<li>প্রথম বক্তার, দ্বিতীয় শ্রোতার, তৃতীয় যেমন আছে: একটা উদাহরণ?</li>
<li>দশটা সময়ের শব্দ আর তাদের বদল?</li>
<li>প্রশ্ন, আদেশ, প্রস্তাব, চমক, শুভকামনা: পাঁচটা বলার ক্রিয়া?</li>
<li>উল্টো দিকে যেতে কী কী ফেরে?</li>
</ul>
</div>

${mount("reported-drill")}
`,
  blocks: {
    "reported-pattern": {
      kind: "pattern",
      title: { bn: "কথা বহনের মেশিন", en: "The carrying machine" },
      shape: "X said, \"I VERB …\"  →  X said that he / she VERB-ed …",
      why: { bn: "উদ্ধৃতি যায়, that আসে, কাল এক ধাপ পিছোয়, I হয়ে যায় he বা she, আর today হয়ে যায় that day। প্রশ্নে asked আর সোজা ক্রম, আদেশে told + to।", en: "The quotation marks go, that arrives, the tense steps back, I becomes he or she, and today becomes that day. Questions take asked and plain order; commands take told + to." },
      examples: [
        { target: "Mitu said, \"I am busy today.\" Mitu said that she was busy that day.", bn: "মিতু বলল, আমি আজ ব্যস্ত। মিতু বলল যে সে সেদিন ব্যস্ত ছিল।" },
        { target: "Rafi said, \"I will win.\" Rafi said that he would win.", bn: "রাফি বলল, আমি জিতব। রাফি বলল যে সে জিতবে।" },
        { target: "She asked, \"Where do you live?\" She asked me where I lived.", bn: "সে জিজ্ঞেস করল, তুমি কোথায় থাকো? সে জিজ্ঞেস করল আমি কোথায় থাকি।" },
        { target: "Coach said, \"Don't be late.\" Coach told us not to be late.", bn: "কোচ বললেন, দেরি কোরো না। কোচ আমাদের দেরি না করতে বললেন।" },
      ],
      tip: { bn: "বলার ক্রিয়া বর্তমানে (says) হলে কিছু পিছোয় না। চিরসত্যেও না।", en: "If the reporting verb is present (says), nothing steps back. Nor does a universal truth." },
    },
    "reported-shift": {
      kind: "match",
      title: { bn: "এক ধাপ পিছনে", en: "One step back" },
      note: { bn: "বাঁ দিকের সরাসরি ক্রিয়ার সাথে ডান দিকের বহন করা রূপ মেলাও।", en: "Match each direct verb on the left with its reported form on the right." },
      pairs: [
        { left: { bn: "am playing", en: "am playing" }, right: { bn: "was playing", en: "was playing" } },
        { left: { bn: "played", en: "played" }, right: { bn: "had played", en: "had played" } },
        { left: { bn: "will play", en: "will play" }, right: { bn: "would play", en: "would play" } },
        { left: { bn: "can play", en: "can play" }, right: { bn: "could play", en: "could play" } },
        { left: { bn: "must play", en: "must play" }, right: { bn: "had to play", en: "had to play" } },
        { left: { bn: "have played", en: "have played" }, right: { bn: "had played (একই)", en: "had played (the same)" } },
        { left: { bn: "should play", en: "should play" }, right: { bn: "should play (বদলায় না)", en: "should play (no change)" } },
      ],
    },
    "reported-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: সরাসরি, তারপর বহন", en: "Listen, say: direct, then reported" },
      lines: [
        { target: "\"I am tired,\" said Nanu. Nanu said that she was tired.", bn: "নানু বললেন, আমি ক্লান্ত। নানু বললেন যে তিনি ক্লান্ত।" },
        { target: "\"We won yesterday,\" Rafi said. Rafi said that they had won the day before.", bn: "রাফি বলল, আমরা কাল জিতেছি। রাফি বলল যে তারা আগের দিন জিতেছিল।" },
        { target: "\"Can you swim?\" she asked. She asked if I could swim.", bn: "সে জিজ্ঞেস করল, তুমি সাঁতার পারো? সে জিজ্ঞেস করল আমি সাঁতার পারি কি না।" },
        { target: "\"Please open the window,\" he said. He requested me to open the window.", bn: "সে বলল, জানালাটা খোলো তো। সে আমাকে জানালা খুলতে অনুরোধ করল।" },
        { target: "\"The sun rises in the east,\" the teacher said. The teacher said that the sun rises in the east.", bn: "শিক্ষক বললেন, সূর্য পূর্বে ওঠে। চিরসত্য, কাল বদলায়নি।" },
        { target: "\"What a lovely catch!\" he said. He exclaimed with joy that it was a very lovely catch.", bn: "সে বলল, কী সুন্দর ক্যাচ! সে আনন্দে বলে উঠল যে ক্যাচটা খুব সুন্দর ছিল।" },
      ],
    },
    "reported-time": {
      kind: "bins",
      title: { bn: "সময় আর জায়গা দূরে সরে", en: "Time and place move away" },
      note: { bn: "প্রতিটা সরাসরি শব্দ বহন করলে কী হয়, সেই ঘরে ফেলো।", en: "Drop each direct word into the box of what it becomes when reported." },
      bins: [
        { id: "then", label: { bn: "then / that day / that night", en: "then / that day / that night" } },
        { id: "next", label: { bn: "the next day / the following week", en: "the next day / the following week" } },
        { id: "before", label: { bn: "the day before / before", en: "the day before / before" } },
        { id: "there", label: { bn: "there / that / those", en: "there / that / those" } },
      ],
      items: [
        { text: { bn: "now", en: "now" }, bin: "then", why: { bn: "now → then।", en: "Now becomes then." } },
        { text: { bn: "tomorrow", en: "tomorrow" }, bin: "next", why: { bn: "tomorrow → the next day।", en: "Tomorrow becomes the next day." } },
        { text: { bn: "yesterday", en: "yesterday" }, bin: "before", why: { bn: "yesterday → the day before।", en: "Yesterday becomes the day before." } },
        { text: { bn: "here", en: "here" }, bin: "there", why: { bn: "here → there।", en: "Here becomes there." } },
        { text: { bn: "today", en: "today" }, bin: "then", why: { bn: "today → that day।", en: "Today becomes that day." } },
        { text: { bn: "next week", en: "next week" }, bin: "next", why: { bn: "next week → the following week।", en: "Next week becomes the following week." } },
        { text: { bn: "two days ago", en: "two days ago" }, bin: "before", why: { bn: "ago → before: two days before।", en: "Ago becomes before: two days before." } },
        { text: { bn: "this", en: "this" }, bin: "there", why: { bn: "this → that।", en: "This becomes that." } },
        { text: { bn: "tonight", en: "tonight" }, bin: "then", why: { bn: "tonight → that night।", en: "Tonight becomes that night." } },
        { text: { bn: "last week", en: "last week" }, bin: "before", why: { bn: "last week → the week before / the previous week।", en: "Last week becomes the week before, or the previous week." } },
      ],
    },
    "reported-verbs": {
      kind: "compare",
      title: { bn: "বলার ক্রিয়া আর জোড়ার শব্দ", en: "The reporting verb and the joining word" },
      note: { bn: "উদ্ধৃতির জাত দেখে দুটো জিনিস বাছো: ক্রিয়া আর জোড়া।", en: "From the kind of quotation, pick two things: the verb and the join." },
      columns: [
        { bn: "বলা", en: "statement" },
        { bn: "প্রশ্ন", en: "question" },
        { bn: "আদেশ", en: "command" },
        { bn: "প্রস্তাব", en: "suggestion" },
      ],
      rows: [
        { label: { bn: "চিহ্ন", en: "Sign" }, cells: [{ bn: "ফুল স্টপ", en: "full stop" }, { bn: "?, সাহায্যকারী বা wh-শব্দ আগে", en: "?, helper or wh-word first" }, { bn: "খালি ক্রিয়া, Don't, please", en: "bare verb, Don't, please" }, { bn: "Let's", en: "Let's" }] },
        { label: { bn: "ক্রিয়া", en: "Verb" }, cells: [{ bn: "said, told", en: "said, told" }, { bn: "asked, enquired", en: "asked, enquired" }, { bn: "told, ordered, requested, advised", en: "told, ordered, requested, advised" }, { bn: "suggested, proposed", en: "suggested, proposed" }] },
        { label: { bn: "জোড়া", en: "Join" }, cells: [{ bn: "that", en: "that" }, { bn: "if / whether, বা wh-শব্দ", en: "if / whether, or the wh-word" }, { bn: "to / not to", en: "to / not to" }, { bn: "-ing, বা that we should", en: "-ing, or that we should" }] },
        { label: { bn: "উদাহরণ", en: "Example" }, cells: [{ bn: "He said that he was tired.", en: "He said that he was tired." }, { bn: "He asked if I was tired.", en: "He asked if I was tired." }, { bn: "He told me to rest.", en: "He told me to rest." }, { bn: "He suggested resting.", en: "He suggested resting." }] },
      ],
    },
    "reported-gap": {
      kind: "gap",
      title: { bn: "কী হয়ে যায়", en: "What it turns into" },
      items: [
        { text: "Rafi said, \"I am hungry.\" Rafi said that he ___ hungry.", bn: "রাফি বলল যে সে ক্ষুধার্ত।", options: ["is", "was", "had been"], right: 1, why: { bn: "am এক ধাপ পিছনে: was।", en: "Am steps back one: was." } },
        { text: "Mitu said, \"I will call you tomorrow.\" Mitu said she ___ call me the next day.", bn: "মিতু বলল সে পরদিন আমাকে ফোন করবে।", options: ["will", "would", "can"], right: 1, why: { bn: "will হয় would, tomorrow হয় the next day।", en: "Will becomes would; tomorrow becomes the next day." } },
        { text: "He said, \"I lost my keys.\" He said that he ___ his keys.", bn: "সে বলল যে সে চাবি হারিয়ে ফেলেছিল।", options: ["lost", "had lost", "has lost"], right: 1, why: { bn: "past simple এক ধাপ পিছনে: past perfect, had lost।", en: "Past simple steps back to past perfect: had lost." } },
        { text: "She asked, \"Are you ready?\" She asked ___ I was ready.", bn: "সে জিজ্ঞেস করল আমি প্রস্তুত কি না।", options: ["that", "if", "what"], right: 1, why: { bn: "হ্যাঁ/না প্রশ্ন: if বা whether, আর সোজা ক্রম।", en: "A yes/no question: if or whether, with plain order." } },
        { text: "Coach said, \"Practise every day.\" Coach told us ___ every day.", bn: "কোচ আমাদের রোজ অনুশীলন করতে বললেন।", options: ["practise", "to practise", "that practise"], right: 1, why: { bn: "আদেশ: told + কাকে + to + ক্রিয়া।", en: "A command: told + whom + to + verb." } },
        { text: "The teacher said, \"Water boils at 100 degrees.\" The teacher said that water ___ at 100 degrees.", bn: "শিক্ষক বললেন যে পানি ১০০ ডিগ্রিতে ফোটে।", options: ["boiled", "boils", "had boiled"], right: 1, why: { bn: "চিরসত্য: কাল বদলায় না, boils।", en: "A universal truth: the tense stays, boils." } },
        { text: "\"Let's go for a walk,\" Nanu said. Nanu ___ going for a walk.", bn: "নানু হাঁটতে যাওয়ার প্রস্তাব দিলেন।", options: ["told", "suggested", "asked"], right: 1, why: { bn: "Let's: suggested + -ing।", en: "Let's: suggested + -ing." } },
        { text: "\"May you pass the exam,\" Ma said. Ma ___ that I might pass the exam.", bn: "মা দোয়া করলেন যেন আমি পরীক্ষায় পাশ করি।", options: ["said", "prayed", "ordered"], right: 1, why: { bn: "May দিয়ে শুভকামনা: prayed / wished that … might।", en: "A wish with May: prayed or wished that … might." } },
      ],
    },
    "reported-kinds": {
      kind: "bins",
      title: { bn: "কোন বলার ক্রিয়া", en: "Which reporting verb" },
      note: { bn: "প্রতিটা উদ্ধৃতি বহন করতে কোন ক্রিয়া লাগবে, সেই ঘরে ফেলো।", en: "Drop each quotation into the box of the verb that will report it." },
      bins: [
        { id: "said", label: { bn: "said / told … that", en: "said / told … that" } },
        { id: "asked", label: { bn: "asked … if / wh-", en: "asked … if / wh-" } },
        { id: "told", label: { bn: "told / requested … to", en: "told / requested … to" } },
        { id: "other", label: { bn: "exclaimed / suggested / wished", en: "exclaimed / suggested / wished" } },
      ],
      items: [
        { text: { bn: "\"I have finished my homework.\"", en: "\"I have finished my homework.\"" }, bin: "said", why: { bn: "বলা: said that she had finished।", en: "A statement: said that she had finished." } },
        { text: { bn: "\"Where is my bat?\"", en: "\"Where is my bat?\"" }, bin: "asked", why: { bn: "wh-প্রশ্ন: asked where his bat was।", en: "A wh-question: asked where his bat was." } },
        { text: { bn: "\"Please close the door.\"", en: "\"Please close the door.\"" }, bin: "told", why: { bn: "অনুরোধ: requested me to close।", en: "A request: requested me to close." } },
        { text: { bn: "\"What a beautiful morning!\"", en: "\"What a beautiful morning!\"" }, bin: "other", why: { bn: "চমক: exclaimed with joy that it was a very beautiful morning।", en: "An exclamation: exclaimed with joy that it was a very beautiful morning." } },
        { text: { bn: "\"Let's play indoors.\"", en: "\"Let's play indoors.\"" }, bin: "other", why: { bn: "প্রস্তাব: suggested playing indoors।", en: "A suggestion: suggested playing indoors." } },
        { text: { bn: "\"Do you like mangoes?\"", en: "\"Do you like mangoes?\"" }, bin: "asked", why: { bn: "হ্যাঁ/না প্রশ্ন: asked if I liked mangoes।", en: "A yes/no question: asked if I liked mangoes." } },
        { text: { bn: "\"Don't touch the wire.\"", en: "\"Don't touch the wire.\"" }, bin: "told", why: { bn: "না-বাচক আদেশ: told me not to touch।", en: "A negative command: told me not to touch." } },
        { text: { bn: "\"May God bless you.\"", en: "\"May God bless you.\"" }, bin: "other", why: { bn: "শুভকামনা: prayed that God might bless me।", en: "A blessing: prayed that God might bless me." } },
        { text: { bn: "\"We will win the final.\"", en: "\"We will win the final.\"" }, bin: "said", why: { bn: "বলা: said that they would win।", en: "A statement: said that they would win." } },
      ],
    },
    "reported-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: come না go?", en: "Guess first: come or go?" },
      ask: { bn: "মা মাঠে ফোন করে রাফিকে বললেন, \"Come home now.\" রাফি বন্ধুকে বলল কী শুনেছে। Ma told me to ___ home ___. দুটো ঘরে কী?", en: "Ma phoned the field and told Rafi, \"Come home now.\" Rafi told a friend what he heard. Ma told me to ___ home ___. What fills the two gaps?" },
      choices: [
        { bn: "come, now", en: "come, now" },
        { bn: "go, then", en: "go, then" },
        { bn: "come, then", en: "come, then" },
      ],
      answer: { bn: "go, then: Ma told me to go home then.", en: "Go, then: Ma told me to go home then." },
      why: { bn: "মা বাড়িতে দাঁড়িয়ে বলেছিলেন come, কারণ বাড়ি তাঁর কাছে। রাফি মাঠে দাঁড়িয়ে বহন করছে, বাড়ি তার থেকে দূরে, তাই go। জায়গা দূরে সরলে come হয় go, here হয় there, this হয় that। আর now হয় then, কারণ কথাটা আগে বলা। বহন মানে শুধু শব্দ বদলানো নয়, দাঁড়ানোর জায়গা বদলানো।", en: "Ma was standing at home when she said come, because home was near her. Rafi reports it from the field, where home is far away, so go. When the place moves away, come becomes go, here becomes there, this becomes that. And now becomes then, because the words were said earlier. Reporting is not just changing words; it is changing where you stand." },
    },
    "reported-build": {
      kind: "build",
      title: { bn: "বহন করা বাক্য সাজাও", en: "Build the reported sentence" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো বলার ক্রিয়া, জোড়ার শব্দ আর পিছোনো কাল ঠিক ক্রমে গেল কি না।", en: "The words are shuffled. As you build, check the reporting verb, the joining word and the shifted tense land in order." },
      pattern: "X + said / asked / told + (whom) + that / if / to + shifted clause",
      lines: [
        { target: "Mitu said that she was busy that day.", bn: "মিতু বলল যে সে সেদিন ব্যস্ত।" },
        { target: "Rafi asked me where I had put his bat.", bn: "রাফি জিজ্ঞেস করল আমি তার ব্যাট কোথায় রেখেছি।" },
        { target: "The coach told us not to be late.", bn: "কোচ আমাদের দেরি না করতে বললেন।" },
        { target: "Nanu asked if I had eaten anything.", bn: "নানু জিজ্ঞেস করলেন আমি কিছু খেয়েছি কি না।" },
        { target: "She suggested going to the fair the next day.", bn: "সে পরদিন মেলায় যাওয়ার প্রস্তাব দিল।" },
        { target: "He exclaimed with joy that it was a very fine catch.", bn: "সে আনন্দে বলে উঠল যে ক্যাচটা খুব চমৎকার।" },
      ],
    },
    "reported-spot": {
      kind: "spot",
      title: { bn: "রাফির narration, ভুল খোঁজো", en: "Rafi's narration: find the mistakes" },
      note: { bn: "রাফি ছয়টা বাক্য বহন করেছে। যেটায় ভুল, সেটা ছোঁও: ক্রিয়া, জোড়া, কাল, ক্রম, বা pronoun।", en: "Rafi reported six sentences. Tap each one with a mistake: the verb, the join, the tense, the order, or a pronoun." },
      source: { bn: "খাতা: narration", en: "Exercise book: narration" },
      lines: [
        { text: { bn: "Mitu said that she was busy that day.", en: "Mitu said that she was busy that day." } },
        { text: { bn: "Nanu told that she was tired.", en: "Nanu told that she was tired." }, flag: { bn: "told-এর পরে কাকে লাগে: Nanu told me that, বা Nanu said that।", en: "Told needs a person after it: Nanu told me that, or Nanu said that." } },
        { text: { bn: "The coach asked me why was I late.", en: "The coach asked me why was I late." }, flag: { bn: "ভিতরে সোজা ক্রম: why I was late।", en: "Plain order inside: why I was late." } },
        { text: { bn: "Ma told me to finish my homework before dinner.", en: "Ma told me to finish my homework before dinner." } },
        { text: { bn: "He said that he will come the next day.", en: "He said that he will come the next day." }, flag: { bn: "said অতীত, তাই will হয় would।", en: "Said is past, so will becomes would." } },
        { text: { bn: "She asked that if I liked mangoes.", en: "She asked that if I liked mangoes." }, flag: { bn: "asked-এর পরে that নয়: asked if I liked।", en: "No that after asked: asked if I liked." } },
        { text: { bn: "The teacher said that the earth moves round the sun.", en: "The teacher said that the earth moves round the sun." } },
      ],
    },
    "reported-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Change the narration: Rafi said to me, \"I am tired. Can I go home?\"", en: "Change the narration: Rafi said to me, \"I am tired. Can I go home?\"" },
          options: [
            { text: { bn: "Rafi told me that he was tired and asked if he could go home.", en: "Rafi told me that he was tired and asked if he could go home." }, right: true, why: { bn: "হ্যাঁ। দুটো জাত, দুটো ক্রিয়া: told … that, asked if; can হয় could।", en: "Yes. Two kinds, two verbs: told … that, asked if; can becomes could." } },
            { text: { bn: "Rafi told me that he was tired and can he go home.", en: "Rafi told me that he was tired and can he go home." }, why: { bn: "না। প্রশ্নটা asked if দিয়ে, সোজা ক্রমে, could।", en: "No. The question takes asked if, plain order, could." } },
            { text: { bn: "Rafi said me that he was tired and asked that he could go home.", en: "Rafi said me that he was tired and asked that he could go home." }, why: { bn: "না। said me হয় না (told me), আর asked-এর পরে if।", en: "No. Said me does not exist (told me), and asked takes if." } },
          ],
        },
        {
          ask: { bn: "Change into direct speech: Mitu told Rafi that she would return his bat the next day.", en: "Change into direct speech: Mitu told Rafi that she would return his bat the next day." },
          options: [
            { text: { bn: "Mitu said to Rafi, \"I will return your bat tomorrow.\"", en: "Mitu said to Rafi, \"I will return your bat tomorrow.\"" }, right: true, why: { bn: "হ্যাঁ। would ফেরে will-এ, she হয় I, his হয় your, the next day হয় tomorrow।", en: "Yes. Would returns to will, she to I, his to your, the next day to tomorrow." } },
            { text: { bn: "Mitu said to Rafi, \"She will return his bat tomorrow.\"", en: "Mitu said to Rafi, \"She will return his bat tomorrow.\"" }, why: { bn: "না। উদ্ধৃতিতে মিতু নিজের মুখে বলে: I, your।", en: "No. In the quotation Mitu speaks for herself: I, your." } },
            { text: { bn: "Mitu said to Rafi, \"I would return your bat the next day.\"", en: "Mitu said to Rafi, \"I would return your bat the next day.\"" }, why: { bn: "না। সরাসরি বললে কাল আর সময়ের শব্দ ফিরে আসে: will, tomorrow।", en: "No. In direct speech the tense and the time word come back: will, tomorrow." } },
          ],
        },
        {
          ask: { bn: "\"Hurrah! We have won the match,\" the boys said. বহন করলে?", en: "\"Hurrah! We have won the match,\" the boys said. Reported?" },
          options: [
            { text: { bn: "The boys exclaimed with joy that they had won the match.", en: "The boys exclaimed with joy that they had won the match." }, right: true, why: { bn: "হ্যাঁ। Hurrah = with joy; have won হয় had won; we হয় they।", en: "Yes. Hurrah means with joy; have won becomes had won; we becomes they." } },
            { text: { bn: "The boys said that hurrah they had won the match.", en: "The boys said that hurrah they had won the match." }, why: { bn: "না। Hurrah শব্দটা থাকে না, তার বদলে exclaimed with joy।", en: "No. The word Hurrah does not survive; exclaimed with joy replaces it." } },
            { text: { bn: "The boys exclaimed with sorrow that they had won the match.", en: "The boys exclaimed with sorrow that they had won the match." }, why: { bn: "না। জেতা আনন্দের: with joy। Alas হলে with sorrow।", en: "No. Winning is joy: with joy. Alas would be with sorrow." } },
          ],
        },
        {
          ask: { bn: "\"Rafi, don't play in the sun,\" Ma said. বহন করলে?", en: "\"Rafi, don't play in the sun,\" Ma said. Reported?" },
          options: [
            { text: { bn: "Ma told Rafi not to play in the sun.", en: "Ma told Rafi not to play in the sun." }, right: true, why: { bn: "হ্যাঁ। সম্বোধনের নামটা told-এর পরে, আর না-বাচক আদেশ not to।", en: "Yes. The addressed name goes after told, and a negative command takes not to." } },
            { text: { bn: "Ma told Rafi to not play in the sun.", en: "Ma told Rafi to not play in the sun." }, why: { bn: "না। ক্রমটা not to, to not নয়।", en: "No. The order is not to, not to not." } },
            { text: { bn: "Ma said Rafi that he did not play in the sun.", en: "Ma said Rafi that he did not play in the sun." }, why: { bn: "না। আদেশ বলা নয়: told + to। আর said Rafi হয় না।", en: "No. A command is not a statement: told + to. And said Rafi does not exist." } },
          ],
        },
      ],
    },
    "reported-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "He asked me, \"Where are you going?\" এর ঠিক বহন কোনটা?", en: "He asked me, \"Where are you going?\" Which report is right?" },
          options: [
            { text: { bn: "He asked me where was I going.", en: "He asked me where was I going." }, why: { bn: "না। ভিতরে প্রশ্নের ক্রম থেকে গেছে। সোজা করো: where I was going।", en: "No. The question order survived inside. Straighten it: where I was going." } },
            { text: { bn: "He asked me where I was going.", en: "He asked me where I was going." }, right: true, why: { bn: "হ্যাঁ। asked, wh-শব্দ জোড়া, সোজা ক্রম, am going → was going।", en: "Yes. Asked, the wh-word joins, plain order, am going becomes was going." } },
            { text: { bn: "He asked me that where I was going.", en: "He asked me that where I was going." }, why: { bn: "না। wh-শব্দ থাকলে that লাগে না। একটা জোড়ার শব্দই যথেষ্ট।", en: "No. With a wh-word there is no that. One joining word is enough." } },
          ],
        },
        {
          ask: { bn: "কোনটা ঠিক?", en: "Which is right?" },
          options: [
            { text: { bn: "She told that she was busy.", en: "She told that she was busy." }, why: { bn: "না। tell-এর পরে কাকে লাগে: She told me that…", en: "No. Tell needs a person after it: She told me that…" } },
            { text: { bn: "She said me that she was busy.", en: "She said me that she was busy." }, why: { bn: "না। say-এর পরে সরাসরি কাকে বসে না: She said to me, বা She said that।", en: "No. Say takes no direct person: She said to me, or She said that." } },
            { text: { bn: "She told me that she was busy.", en: "She told me that she was busy." }, right: true, why: { bn: "হ্যাঁ। told + me + that।", en: "Yes. Told + me + that." } },
          ],
        },
      ],
    },
    "reported-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "আজ বাসায় কে কী বলেছে, পাঁচ বাক্যে বহন করো: Ma said that… Baba told me to…", en: "What people said at home today, reported in five sentences: Ma said that… Baba told me to…" } },
        { text: { bn: "একটা সিনেমার তিনটা সংলাপ নাও আর reported speech-এ বলো: Iron Man said that he was Iron Man.", en: "Take three lines from a film and report them: Iron Man said that he was Iron Man." } },
        { text: { bn: "সময়ের শব্দের জোড়া জোরে, তিনবার: today that day, tomorrow the next day, yesterday the day before, now then, here there।", en: "The time-word pairs aloud, three times: today that day, tomorrow the next day, yesterday the day before, now then, here there." } },
        { text: { bn: "একজন বন্ধুকে তিনটা প্রশ্ন করো, তারপর তৃতীয় কাউকে বহন করে বলো: I asked him if… I asked her where…", en: "Ask a friend three questions, then report them to a third person: I asked him if… I asked her where…" } },
        { text: { bn: "কোচ বা শিক্ষকের পাঁচটা আদেশ বহন করো: The coach told us to… He told us not to…", en: "Report five orders from a coach or teacher: The coach told us to… He told us not to…" } },
        { text: { bn: "তিনটা বহন করা বাক্য উল্টো দিকে, সরাসরি করে, জোরে, উদ্ধৃতি চিহ্ন হাতে এঁকে।", en: "Turn three reported sentences back into direct speech aloud, drawing the quotation marks in the air." } },
      ],
    },
  },
};
