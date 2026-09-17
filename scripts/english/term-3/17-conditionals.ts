/* ============================================================
   17-conditionals.ts: পর্ব ১৭, if-এর চার সিঁড়ি.

   One part of the grammar term, gathered into the rung by
   `middle.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>রাফি বৃষ্টির দিকে তাকিয়ে চারটা কথা ভাবে। <span lang="en">If it rains, the match stops.</span> সবসময়ের নিয়ম। <span lang="en">If it rains tomorrow, we will play indoors.</span> সম্ভব, দেখা যাক। <span lang="en">If I were Shakib, I would bowl in the rain.</span> কল্পনা, আমি শাকিব নই। <span lang="en">If we had won yesterday, we would have been champions.</span> আফসোস, জিতিনি, শেষ। চারটা <span lang="en">if</span>, চারটা সিঁড়ি, আর নিয়মটা এক লাইনে: <strong>যত পিছনের কাল, তত কম সত্যি।</strong> পর্ব ৭ আর ১১-র কালগুলো এখানে অন্য কাজে লাগে: সময় বলতে নয়, দূরত্ব বলতে।</p>

<p>চার সিঁড়ির পরে বাকিটা: <span lang="en">if</span>-এর বদলে যে শব্দগুলো বসে (<span lang="en">unless, in case, as long as, provided that</span>), <span lang="en">wish</span> আর <span lang="en">if only</span>, দুই সিঁড়ি মেশানো, <span lang="en">if</span> ছাড়াই শর্ত (<span lang="en">Had I known…</span>), আর <span lang="en">transformation</span>-এর সেই দুটো বদল যেগুলো প্রতি বছর আসে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>শূন্য: <span lang="en">If + present, present</span>। চিরসত্য, নিয়ম। <span lang="en">If you heat ice, it melts.</span></li>
<li>প্রথম: <span lang="en">If + present, will + verb</span>। সম্ভব ভবিষ্যৎ। <span lang="en">If it rains, we will stay home.</span></li>
<li>দ্বিতীয়: <span lang="en">If + past, would + verb</span>। অবাস্তব বর্তমান বা কল্পনা। <span lang="en">If I had wings, I would fly.</span></li>
<li>তৃতীয়: <span lang="en">If + past perfect, would have + V3</span>। অতীতের আফসোস। <span lang="en">If I had studied, I would have passed.</span></li>
<li><span lang="en">if</span>-এর অংশে কখনো <span lang="en">will</span> নয়। <span lang="en">unless</span> মানে <span lang="en">if … not</span>।</li>
<li><span lang="en">wish</span> দ্বিতীয় আর তৃতীয় সিঁড়ির মতো: <span lang="en">I wish I were, I wish I had known</span>।</li>
</ul>
</div>

${mount("conditionals-pattern")}

<h2>শূন্য সিঁড়ি: যখনই, তখনই</h2>

<p>দুই দিকেই present। <span lang="en">if</span>-এর জায়গায় <span lang="en">when</span> বসালেও মানে বদলায় না, এটাই চেনার কৌশল। <span lang="en">If you heat water to 100 degrees, it boils. If Nanu tells a story, everyone listens. If the batter is out, he walks.</span> বিজ্ঞান, নিয়ম, অভ্যাস।</p>

<h2>প্রথম সিঁড়ি: হতে পারে, দেখা যাক</h2>

<p><span lang="en">if</span>-এর দিকে present, ফলের দিকে <span lang="en">will</span>। ভবিষ্যতের সত্যিকারের সম্ভাবনা। <span lang="en">If it rains tomorrow, the match will be cancelled. If you study tonight, you will pass. If Mustafiz plays, we will win.</span> সবচেয়ে বড় ফাঁদ এখানেই: বাংলায় "যদি বৃষ্টি হবে" বলা যায়, ইংরেজিতে <span lang="en">if it will rain</span> ভুল। <span lang="en">if</span>-এর অংশে ভবিষ্যৎ present-এ বলা হয়, <span lang="en">will</span> শুধু ফলের দিকে। ফলের দিকে <span lang="en">will</span>-এর বদলে <span lang="en">can, may, must</span> বা আদেশও চলে: <span lang="en">If you see Rafi, tell him to call me.</span></p>

<p>প্রথম সিঁড়ির ফলের দিকটা নরমও করা যায়: <span lang="en">If it rains, we might stay home</span> (হয়তো), <span lang="en">we can stay home</span> (পারি), <span lang="en">we should stay home</span> (উচিত)। আর <span lang="en">if</span>-এর দিকে present perfect-ও বসে, কাজটা শেষ হওয়ার শর্তে: <span lang="en">If you have finished, you can go.</span></p>

${mount("conditionals-lines")}

${mount("conditionals-steps")}

<h2>দ্বিতীয় সিঁড়ি: কল্পনা</h2>

<p><span lang="en">if</span>-এর দিকে past, ফলের দিকে <span lang="en">would</span>। কিন্তু কালটা অতীত নয়, দূরত্ব: এটা এখনকার কথা, শুধু সত্যি নয়। <span lang="en">If I had a million taka, I would buy a stadium.</span> নেই, তাই কল্পনা। <span lang="en">If I were you, I would apologise.</span> আমি তুমি নই। এখানে একটা বিশেষ নিয়ম: <span lang="en">be</span>-র জায়গায় সব কর্তার সাথে <span lang="en">were</span>, <span lang="en">was</span> নয়। <span lang="en">If I were, if he were, if she were</span>। কথায় মানুষ <span lang="en">was</span> বলে, পরীক্ষায় <span lang="en">were</span>। উপদেশের সবচেয়ে ভদ্র ছাঁচ এটাই: <span lang="en">If I were you, I would…</span></p>

<p>ফলের দিকে <span lang="en">would</span>-এর বদলে <span lang="en">could</span> (পারতাম) বা <span lang="en">might</span> (হয়তো): <span lang="en">If I had wings, I could fly. If we practised more, we might win.</span> আর প্রথম আর দ্বিতীয় সিঁড়ির পার্থক্যটা বিশ্বাসের: <span lang="en">If I win the lottery, I will buy a car</span> (জিততে পারি, ভাবছি), <span lang="en">If I won the lottery, I would buy a car</span> (জিতব না জানি, স্বপ্ন দেখছি)। একই ঘটনা, দুই সিঁড়ি, বক্তার বিশ্বাস আলাদা।</p>

<h2>তৃতীয় সিঁড়ি: আফসোস</h2>

<p><span lang="en">if</span>-এর দিকে past perfect, ফলের দিকে <span lang="en">would have + V3</span>। অতীতে যা হয়নি, হলে কী হতো। <span lang="en">If we had won that match, we would have reached the final.</span> জিতিনি, ফাইনালে যাইনি, শেষ। <span lang="en">If I had woken up early, I would not have missed the bus.</span> ক্রিকেটের সব "যদি"-ই তৃতীয় সিঁড়ি: <span lang="en">If Tamim had not been injured, we would have won the series.</span></p>

<div class="table-scroll">
<table>
<thead><tr><th>সিঁড়ি</th><th>if-এর দিক</th><th>ফলের দিক</th><th>কতটা সত্যি</th></tr></thead>
<tbody>
<tr><td>শূন্য</td><td><span lang="en">present</span></td><td><span lang="en">present</span></td><td>সবসময়</td></tr>
<tr><td>প্রথম</td><td><span lang="en">present</span></td><td><span lang="en">will + verb</span></td><td>হতে পারে</td></tr>
<tr><td>দ্বিতীয়</td><td><span lang="en">past (were)</span></td><td><span lang="en">would + verb</span></td><td>কল্পনা</td></tr>
<tr><td>তৃতীয়</td><td><span lang="en">past perfect</span></td><td><span lang="en">would have + V3</span></td><td>হয়নি, শেষ</td></tr>
</tbody>
</table>
</div>

<p>দুটো সিঁড়ি মেশানোও যায়, যখন শর্ত অতীতে আর ফল এখন: <span lang="en">If I had studied medicine, I would be a doctor now.</span> শর্ত তৃতীয় (<span lang="en">had studied</span>), ফল দ্বিতীয় (<span lang="en">would be now</span>)। বা উল্টো: <span lang="en">If I were taller, I would have been picked.</span> এর নাম <span lang="en">mixed conditional</span>; পরীক্ষায় কম, জীবনে প্রচুর।</p>

${mount("conditionals-halves")}

${mount("conditionals-gap")}

<h2>দুই দিক উল্টানো, আর unless</h2>

<p><span lang="en">if</span>-অংশ আগে বসলে কমা, পরে বসলে কমা নয়: <span lang="en">If it rains, we will stay. We will stay if it rains.</span> <span lang="en">unless</span> মানে <span lang="en">if … not</span>: <span lang="en">Unless you hurry, you will miss the bus. = If you don't hurry…</span> পর্ব ১৪-র ফাঁদ: <span lang="en">unless</span>-এর পরে আর <span lang="en">not</span> নয়।</p>

<p><span lang="en">if</span>-এর বদলে আরও কয়েকটা শব্দ বসে, আর প্রতিটার নিজের রং। পরীক্ষার <span lang="en">connectors</span> আর <span lang="en">transformation</span> দুটোতেই এরা আসে:</p>

<div class="table-scroll">
<table>
<thead><tr><th>শব্দ</th><th>মানে</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">unless</span></td><td>যদি না</td><td><span lang="en">Unless it rains, we will play.</span></td></tr>
<tr><td><span lang="en">as long as, provided that</span></td><td>যতক্ষণ, এই শর্তে</td><td><span lang="en">You can borrow my bat as long as you return it.</span></td></tr>
<tr><td><span lang="en">in case</span></td><td>যদি হয়ে যায়, সেই ভয়ে</td><td><span lang="en">Take an umbrella in case it rains.</span></td></tr>
<tr><td><span lang="en">even if</span></td><td>হলেও</td><td><span lang="en">Even if it rains, we will play.</span></td></tr>
<tr><td><span lang="en">whether … or not</span></td><td>হোক বা না হোক</td><td><span lang="en">We will play whether it rains or not.</span></td></tr>
<tr><td><span lang="en">otherwise, or</span></td><td>নইলে</td><td><span lang="en">Hurry up, otherwise you will miss the bus.</span></td></tr>
</tbody>
</table>
</div>

<p><span lang="en">in case</span> আর <span lang="en">if</span> এক নয়: <span lang="en">Take an umbrella if it rains</span> মানে বৃষ্টি হলে তখন নাও; <span lang="en">Take an umbrella in case it rains</span> মানে এখনই নাও, পরে হতে পারে বলে। <span lang="en">in case</span>-এর পরে present, <span lang="en">will</span> নয়, ঠিক <span lang="en">if</span>-এর মতো।</p>

${mount("conditionals-alternatives")}

<h2>wish আর if only: শর্ত ছাড়া আফসোস</h2>

<p><span lang="en">wish</span> দ্বিতীয় আর তৃতীয় সিঁড়ির মতোই কাজ করে: <span lang="en">I wish I were taller</span> (এখন, অবাস্তব), <span lang="en">I wish I had studied</span> (অতীত, আফসোস)। আর একটা তৃতীয় রূপ, বিরক্তি: <span lang="en">I wish you would stop shouting</span>, তুমি যদি থামতে। <span lang="en">if only</span> একই কাজ, একটু বেশি জোর: <span lang="en">If only I had listened!</span> মনে রাখার কথা: <span lang="en">wish</span>-এর পরে কখনো present নয়। <span lang="en">I wish I am rich</span> ভুল; <span lang="en">I wish I were rich</span>।</p>

<div class="table-scroll">
<table>
<thead><tr><th>ছাঁচ</th><th>কখন</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">wish + past (were)</span></td><td>এখন যা নেই</td><td><span lang="en">I wish I had a bike. I wish it were Friday.</span></td></tr>
<tr><td><span lang="en">wish + past perfect</span></td><td>অতীতে যা হয়নি</td><td><span lang="en">I wish I had practised more.</span></td></tr>
<tr><td><span lang="en">wish + would</span></td><td>অন্যের কাজে বিরক্তি</td><td><span lang="en">I wish it would stop raining.</span></td></tr>
<tr><td><span lang="en">if only + একই তিন রূপ</span></td><td>আরও জোরে</td><td><span lang="en">If only I had known!</span></td></tr>
</tbody>
</table>
</div>

<h2>if ছাড়াই শর্ত: Had I known</h2>

<p>লেখার ভাষায় <span lang="en">if</span> সরিয়ে সাহায্যকারীটা সামনে আনা যায়, প্রশ্নের মতো: <span lang="en">If I had known → Had I known. If I were you → Were I you. If you should need help → Should you need help.</span> মানে এক, সুর বেশি আনুষ্ঠানিক। পরীক্ষায় <span lang="en">transformation</span>: <span lang="en">Had I known, I would have come. = If I had known…</span> পর্ব ২২-এ এই উল্টানোর পুরো পরিবার।</p>

${mount("conditionals-wish")}

${mount("conditionals-reveal")}

<div class="ex"><b>The Lion King-এর Simba:</b> <span lang="en">If I were king, I would make the hyenas leave.</span> দ্বিতীয় সিঁড়ি, কারণ তখনো রাজা নয়। শেষে Rafiki বলে, <span lang="en">If you had listened to your father, you would not have run away.</span> তৃতীয়, আফসোস। আর Timon-এর নিয়ম: <span lang="en">If you have no worries, you have no problems.</span> শূন্য। Hakuna Matata।</div>

${mount("conditionals-build")}

${mount("conditionals-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>তিনটা চেহারা। এক: <span lang="en">right form</span>, একটা দিক দেওয়া, অন্য দিকের ক্রিয়া বসাও। দুই: <span lang="en">complete the sentence</span>, <span lang="en">If I were you, …</span> বা <span lang="en">Had I known, …</span> নিজে শেষ করো। তিন: <span lang="en">transformation</span>, <span lang="en">unless ↔ if not</span>, <span lang="en">Had I ↔ If I had</span>, <span lang="en">too … to ↔ if</span>। প্রথমটার ধাপ:</p>

<ol class="step-list">
<li><strong>দেওয়া দিকটা দেখো।</strong> ফলের দিকে <span lang="en">will</span>: <span lang="en">if</span>-এ present। <span lang="en">would + verb</span>: <span lang="en">if</span>-এ past (<span lang="en">be</span> হলে <span lang="en">were</span>)। <span lang="en">would have</span>: <span lang="en">if</span>-এ <span lang="en">had + V3</span>।</li>
<li><strong>উল্টোটাও।</strong> <span lang="en">if</span>-এ present: ফলে <span lang="en">will</span>। past: <span lang="en">would</span>। <span lang="en">had + V3</span>: <span lang="en">would have + V3</span>।</li>
<li><strong>দুই দিকেই খালি?</strong> মানেটা পড়ো: সম্ভব হলে প্রথম, কল্পনা হলে দ্বিতীয়, অতীত হলে তৃতীয়।</li>
<li><strong>শেষে দেখো:</strong> <span lang="en">if</span>-এর ঘরে <span lang="en">will/would</span> ঢুকে যায়নি তো? <span lang="en">unless</span>-এর পরে <span lang="en">not</span> নেই তো?</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">If you (heat) ___ ice, it melts. If it (rain) ___ tomorrow, we will stay in. If I (be) ___ the captain, I would open the batting. If Rafi (practise) ___ more, he would have been picked. Unless you (hurry) ___, you will be late. I wish I (know) ___ the answer now.</span> উত্তর: <span lang="en">heat</span> (শূন্য), <span lang="en">rains</span> (<span lang="en">will</span>, তাই present), <span lang="en">were</span> (<span lang="en">would</span>, আর <span lang="en">be</span>), <span lang="en">had practised</span> (<span lang="en">would have</span>), <span lang="en">hurry</span> (<span lang="en">unless</span> + present), <span lang="en">knew</span> (<span lang="en">wish</span> + past, এখনকার আফসোস)। ছয় ঘর, চার ধাপ।</div>

${mount("conditionals-exam")}

${mount("conditionals-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Right form</span>-এ <span lang="en">if</span> দেখলে অন্য অংশটা দেখো: যে অংশ দেওয়া আছে, সেটার কাল বলে দেয় সিঁড়িটা কোন। অন্য দিকে <span lang="en">will</span> থাকলে <span lang="en">if</span>-এ present; <span lang="en">would</span> থাকলে <span lang="en">if</span>-এ past (আর <span lang="en">be</span> হলে <span lang="en">were</span>); <span lang="en">would have</span> থাকলে <span lang="en">if</span>-এ <span lang="en">had + V3</span>। উল্টোটাও: <span lang="en">if</span>-এর কাল দেখে ফলের দিক। কখনো <span lang="en">if</span>-এর পরে <span lang="en">will</span> নয়। <span lang="en">Transformation</span>-এ <span lang="en">unless ↔ if not</span> প্রতি বছর।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">would</span> কখনো <span lang="en">if</span>-এর ঘরে ঢোকে না। <span lang="en">If I would have money</span> ভুল, <span lang="en">If I had money</span> ঠিক। <span lang="en">would</span> শুধু ফলের দিকে থাকে। একটা ছবি: <span lang="en">if</span>-এর ঘরে <span lang="en">will/would</span> ঢুকতে চাইলে দরজায় লেখা আছে "প্রবেশ নিষেধ"।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>তৃতীয় সিঁড়িতে দুই দিকেই <span lang="en">had</span> নয়। <span lang="en">If I had known, I had come</span> ভুল; ফলের দিকে <span lang="en">would have come</span>। আর <span lang="en">would of</span> বলে কিছু নেই, যদিও কানে <span lang="en">would've</span> তেমনই শোনায়: লেখায় সবসময় <span lang="en">would have</span>।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>চার সিঁড়ি একটা বৃষ্টি দিয়ে জোরে?</li>
<li><span lang="en">if</span>-এর ঘরে কী ঢোকে না?</li>
<li><span lang="en">If I were</span> কেন, <span lang="en">If I was</span> নয়?</li>
<li><span lang="en">unless, in case, as long as</span>: তিনটার মানে?</li>
<li><span lang="en">wish</span>-এর তিন রূপ?</li>
<li><span lang="en">Had I known</span> মানে কী?</li>
</ul>
</div>

${mount("conditionals-drill")}
`,
  blocks: {
    "conditionals-pattern": {
      kind: "pattern",
      title: { bn: "চার সিঁড়ি", en: "Four steps" },
      shape: "If + present, present  ·  If + present, will  ·  If + past, would  ·  If + had V3, would have V3",
      why: { bn: "if-এর ঘরে কালটা যত পিছনে, কথাটা তত কম সত্যি। present মানে হতে পারে, past মানে কল্পনা, past perfect মানে হয়নি। ফলের দিকে will, would, would have সেই সিঁড়ির সাথে মেলে।", en: "The further back the tense in the if clause, the less true the idea. Present means possible, past means imagined, past perfect means it never happened. Will, would and would have on the result side match the step." },
      examples: [
        { target: "If you heat ice, it melts.", bn: "বরফ গরম করলে গলে। (সবসময়)" },
        { target: "If it rains tomorrow, we will play indoors.", bn: "কাল বৃষ্টি হলে আমরা ঘরের ভিতরে খেলব। (হতে পারে)" },
        { target: "If I were Shakib, I would bowl the last over.", bn: "আমি শাকিব হলে শেষ ওভারটা করতাম। (কল্পনা)" },
        { target: "If we had won, we would have been champions.", bn: "আমরা জিতলে চ্যাম্পিয়ন হতাম। (হয়নি)" },
      ],
      tip: { bn: "if-এর ঘরে will বা would কখনো ঢোকে না। প্রবেশ নিষেধ।", en: "Will and would never enter the if clause. No entry." },
    },
    "conditionals-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: একই বৃষ্টি, চার সিঁড়ি", en: "Listen, say: the same rain, four steps" },
      lines: [
        { target: "If it rains, the ground gets wet.", bn: "বৃষ্টি হলে মাঠ ভেজে।" },
        { target: "If it rains, we will stay at home.", bn: "বৃষ্টি হলে আমরা বাসায় থাকব।" },
        { target: "If it rained in the desert, the flowers would bloom.", bn: "মরুভূমিতে বৃষ্টি হলে ফুল ফুটত।" },
        { target: "If it had rained last week, the crops would have survived.", bn: "গত সপ্তাহে বৃষ্টি হলে ফসল বাঁচত।" },
        { target: "Unless it stops raining, the match will be cancelled.", bn: "বৃষ্টি না থামলে ম্যাচ বাতিল হবে।" },
        { target: "If I were you, I would take an umbrella.", bn: "আমি তুমি হলে একটা ছাতা নিতাম।" },
        { target: "I wish it would stop raining.", bn: "বৃষ্টিটা যদি থামত।" },
      ],
    },
    "conditionals-steps": {
      kind: "bins",
      title: { bn: "কোন সিঁড়ি", en: "Which step" },
      note: { bn: "প্রতিটা বাক্য কোন সিঁড়িতে, সেই ঘরে ফেলো। কালটা দেখো, সত্যিটা ভাবো।", en: "Drop each sentence into the box of its step. Look at the tense, think about how true it is." },
      bins: [
        { id: "zero", label: { bn: "শূন্য: সবসময়", en: "zero: always" } },
        { id: "first", label: { bn: "প্রথম: হতে পারে", en: "first: possible" } },
        { id: "second", label: { bn: "দ্বিতীয়: কল্পনা", en: "second: imagined" } },
        { id: "third", label: { bn: "তৃতীয়: হয়নি", en: "third: never happened" } },
      ],
      items: [
        { text: { bn: "If you mix red and blue, you get purple.", en: "If you mix red and blue, you get purple." }, bin: "zero", why: { bn: "দুই দিকে present, সবসময় সত্যি।", en: "Present on both sides, always true." } },
        { text: { bn: "If Mustafiz plays, we will win.", en: "If Mustafiz plays, we will win." }, bin: "first", why: { bn: "present + will, সম্ভব।", en: "Present + will, possible." } },
        { text: { bn: "If I were a bird, I would fly to Sylhet.", en: "If I were a bird, I would fly to Sylhet." }, bin: "second", why: { bn: "were + would, কল্পনা।", en: "Were + would, imagined." } },
        { text: { bn: "If we had left earlier, we would have caught the train.", en: "If we had left earlier, we would have caught the train." }, bin: "third", why: { bn: "had + would have, আফসোস।", en: "Had + would have, regret." } },
        { text: { bn: "If Nanu tells a story, everyone listens.", en: "If Nanu tells a story, everyone listens." }, bin: "zero", why: { bn: "অভ্যাস, দুই দিকে present।", en: "A habit, present on both sides." } },
        { text: { bn: "If I had a million taka, I would build a stadium.", en: "If I had a million taka, I would build a stadium." }, bin: "second", why: { bn: "নেই, তাই কল্পনা: had + would।", en: "I have none, so imagined: had + would." } },
        { text: { bn: "If you see Rafi, tell him to call me.", en: "If you see Rafi, tell him to call me." }, bin: "first", why: { bn: "present + আদেশ, সম্ভব ভবিষ্যৎ।", en: "Present + a command, a possible future." } },
        { text: { bn: "If Tamim had not been injured, we would have won.", en: "If Tamim had not been injured, we would have won." }, bin: "third", why: { bn: "অতীতে হয়নি: had + would have।", en: "Did not happen: had + would have." } },
      ],
    },
    "conditionals-halves": {
      kind: "match",
      title: { bn: "দুই দিক মেলাও", en: "Match the two halves" },
      note: { bn: "বাঁ দিকের if-অংশের সাথে ডান দিকের ঠিক ফলটা মেলাও। কালটাই সূত্র।", en: "Match each if clause on the left with the right result on the right. The tense is the clue." },
      pairs: [
        { left: { bn: "If you heat ice,", en: "If you heat ice," }, right: { bn: "it melts.", en: "it melts." } },
        { left: { bn: "If it rains tomorrow,", en: "If it rains tomorrow," }, right: { bn: "we will play indoors.", en: "we will play indoors." } },
        { left: { bn: "If I were the captain,", en: "If I were the captain," }, right: { bn: "I would open the batting.", en: "I would open the batting." } },
        { left: { bn: "If Rafi had practised,", en: "If Rafi had practised," }, right: { bn: "he would have been picked.", en: "he would have been picked." } },
        { left: { bn: "Unless you hurry,", en: "Unless you hurry," }, right: { bn: "you will miss the bus.", en: "you will miss the bus." } },
        { left: { bn: "If I had studied medicine,", en: "If I had studied medicine," }, right: { bn: "I would be a doctor now.", en: "I would be a doctor now." } },
      ],
    },
    "conditionals-gap": {
      kind: "gap",
      title: { bn: "কোন সিঁড়ি", en: "Which step" },
      note: { bn: "অন্য দিকটা দেখো, তারপর ছোঁও।", en: "Look at the other side, then tap." },
      items: [
        { text: "If you ___ hard, you will pass.", bn: "কঠোর পরিশ্রম করলে তুমি পাশ করবে।", options: ["work", "will work", "worked"], right: 0, why: { bn: "অন্য দিকে will, তাই if-এ present: work। if-এর পরে will নয়।", en: "The other side has will, so the if clause is present: work. No will after if." } },
        { text: "If I ___ a bird, I would fly to Cox's Bazar.", bn: "আমি পাখি হলে কক্সবাজারে উড়ে যেতাম।", options: ["am", "was", "were"], right: 2, why: { bn: "would আছে, কল্পনা, আর be-র জায়গায় সব কর্তায় were।", en: "Would is there, imagined, and be becomes were for every subject." } },
        { text: "If Rafi had practised more, he ___ the match.", bn: "রাফি আরও অনুশীলন করলে ম্যাচটা জিতত।", options: ["would win", "would have won", "will win"], right: 1, why: { bn: "had practised: তৃতীয় সিঁড়ি, ফলে would have + V3।", en: "Had practised is the third step, so would have + V3 follows." } },
        { text: "If you mix red and blue, you ___ purple.", bn: "লাল আর নীল মেশালে বেগুনি হয়।", options: ["get", "will get", "would get"], right: 0, why: { bn: "চিরসত্য, শূন্য সিঁড়ি: দুই দিকেই present। will দিলে ভুল নয়, কিন্তু নিয়ম বোঝাতে get।", en: "A universal truth, the zero step: present on both sides. Get states the rule." } },
        { text: "___ you hurry, you will miss the train.", bn: "তাড়াতাড়ি না করলে ট্রেন মিস করবে।", options: ["If", "Unless", "When"], right: 1, why: { bn: "না করলে: unless। পরে না-বাচক নেই, তাই If হলে মানে উল্টে যেত।", en: "If you do not: unless. There is no not after it, so If would flip the meaning." } },
        { text: "I wish I ___ taller.", bn: "আমি যদি আরেকটু লম্বা হতাম।", options: ["am", "were", "had been"], right: 1, why: { bn: "এখনকার অবাস্তব ইচ্ছা: wish + were, দ্বিতীয় সিঁড়ির মতো।", en: "A present, unreal wish: wish + were, like the second step." } },
        { text: "If we ___ earlier, we would have caught the bus.", bn: "আগে বেরোলে আমরা বাসটা পেতাম।", options: ["left", "had left", "would leave"], right: 1, why: { bn: "would have আছে: if-এ had + V3।", en: "Would have is there: had + V3 in the if clause." } },
        { text: "If you have finished, you ___ go home.", bn: "শেষ করে থাকলে তুমি বাড়ি যেতে পারো।", options: ["can", "could have", "would"], right: 0, why: { bn: "প্রথম সিঁড়ি, ফলে can: সম্ভব, এখন।", en: "The first step with can as the result: possible, now." } },
      ],
    },
    "conditionals-alternatives": {
      kind: "compare",
      title: { bn: "if-এর বদলে", en: "Instead of if" },
      note: { bn: "চারটা শব্দ, চারটা রং। সবার পরে present, কারও পরে will নয়।", en: "Four words, four colours. Present after each, will after none." },
      columns: [
        { bn: "unless", en: "unless" },
        { bn: "in case", en: "in case" },
        { bn: "as long as", en: "as long as" },
        { bn: "even if", en: "even if" },
      ],
      rows: [
        { label: { bn: "মানে", en: "Meaning" }, cells: [{ bn: "যদি না", en: "if not" }, { bn: "হতে পারে বলে, আগে থেকে", en: "because it might, beforehand" }, { bn: "এই শর্তে, যতক্ষণ", en: "on condition that" }, { bn: "হলেও, ফল বদলায় না", en: "whether or not, the result stands" }] },
        { label: { bn: "উদাহরণ", en: "Example" }, cells: [{ bn: "Unless it rains, we will play.", en: "Unless it rains, we will play." }, { bn: "Take a coat in case it gets cold.", en: "Take a coat in case it gets cold." }, { bn: "You can go as long as you are back by six.", en: "You can go as long as you are back by six." }, { bn: "Even if it rains, we will play.", en: "Even if it rains, we will play." }] },
        { label: { bn: "= if দিয়ে", en: "= with if" }, cells: [{ bn: "If it does not rain, we will play.", en: "If it does not rain, we will play." }, { bn: "if-এ বলা যায় না: if it gets cold মানে ঠান্ডা লাগলে তখন", en: "not the same as if: if it gets cold means take it then" }, { bn: "If you are back by six, you can go.", en: "If you are back by six, you can go." }, { bn: "If it rains, we will still play.", en: "If it rains, we will still play." }] },
        { label: { bn: "ফাঁদ", en: "Trap" }, cells: [{ bn: "পরে not নয়", en: "no not after it" }, { bn: "পরে will নয়", en: "no will after it" }, { bn: "provided that একই", en: "provided that is the same" }, { bn: "although-এর কাছাকাছি", en: "close to although" }] },
      ],
    },
    "conditionals-wish": {
      kind: "gap",
      title: { bn: "wish, if only, Had I", en: "Wish, if only, Had I" },
      items: [
        { text: "I wish I ___ the answer, but I don't.", bn: "উত্তরটা জানলে ভালো হতো, কিন্তু জানি না।", options: ["know", "knew", "had known"], right: 1, why: { bn: "এখনকার আফসোস: wish + past, knew।", en: "A present regret: wish + past, knew." } },
        { text: "I wish I ___ harder for the exam last year.", bn: "গত বছর পরীক্ষার জন্য আরও পড়লে ভালো হতো।", options: ["study", "studied", "had studied"], right: 2, why: { bn: "অতীতের আফসোস: wish + past perfect।", en: "A past regret: wish + past perfect." } },
        { text: "I wish you ___ stop shouting!", bn: "তুমি যদি চেঁচানো থামাতে!", options: ["will", "would", "had"], right: 1, why: { bn: "অন্যের কাজে বিরক্তি: wish + would।", en: "Annoyance at what someone else does: wish + would." } },
        { text: "___ I known you were coming, I would have waited.", bn: "তুমি আসছ জানলে আমি অপেক্ষা করতাম।", options: ["If", "Had", "Would"], right: 1, why: { bn: "if ছাড়া তৃতীয় সিঁড়ি: Had I known = If I had known।", en: "The third step without if: Had I known equals If I had known." } },
        { text: "Take some water ___ you get thirsty on the way.", bn: "পথে তেষ্টা পেতে পারে, তাই একটু পানি নাও।", options: ["if", "in case", "unless"], right: 1, why: { bn: "আগে থেকে, হতে পারে বলে: in case। if হলে তেষ্টা পেলে তখন নাও।", en: "Beforehand, because it might happen: in case. If would mean take it once you are thirsty." } },
        { text: "You may use my bike ___ you return it by five.", bn: "পাঁচটার মধ্যে ফেরত দিলে আমার সাইকেল নিতে পারো।", options: ["unless", "as long as", "in case"], right: 1, why: { bn: "শর্তে: as long as / provided that।", en: "On condition: as long as or provided that." } },
      ],
    },
    "conditionals-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: was না were?", en: "Guess first: was or were?" },
      ask: { bn: "রাফি লিখল: If I was you, I would apologise. মিতু আপু বলল, কথায় চলে, খাতায় নয়। কেন?", en: "Rafi wrote: If I was you, I would apologise. Mitu said it passes in speech but not on paper. Why?" },
      choices: [
        { bn: "I-এর সাথে সবসময় were বসে", en: "I always takes were" },
        { bn: "কল্পনার if-এ be সব কর্তায় were হয়", en: "In an imagined if, be becomes were for every subject" },
        { bn: "মিতু ভুল, was ঠিক", en: "Mitu is wrong; was is right" },
      ],
      answer: { bn: "কল্পনার if-এ be সব কর্তায় were হয়: If I were you, if he were here, if it were Friday।", en: "In an imagined if, be becomes were for every subject: If I were you, if he were here, if it were Friday." },
      why: { bn: "দ্বিতীয় সিঁড়ির past আসলে অতীত নয়, দূরত্ব; আর ইংরেজি সেই দূরত্বটা be-তে একটা আলাদা রূপ দিয়ে দেখায়: were, কর্তা যেই হোক। ব্যাকরণের বইয়ে এর নাম subjunctive। কথায় অনেকে was বলে, আর সেটা কেউ ধরে না; পরীক্ষার খাতায় were-ই ঠিক, আর If I were you উপদেশের সবচেয়ে ভদ্র ছাঁচ। wish-এর পরেও একই: I wish it were Friday।", en: "The past in the second step is not really past but distance, and English shows that distance in be with one special form: were, whoever the subject is. Grammar books call it the subjunctive. People say was in conversation and nobody minds; on an exam paper were is the form, and If I were you is the politest shape advice takes. After wish it is the same: I wish it were Friday." },
    },
    "conditionals-build": {
      kind: "build",
      title: { bn: "সিঁড়ি সাজাও", en: "Build the step" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো if-এর ঘরে will বা would ঢুকে যায়নি তো।", en: "The words are shuffled. As you build, check that no will or would slipped into the if clause." },
      pattern: "If + clause, + result clause",
      lines: [
        { target: "If it rains tomorrow, we will play indoors.", bn: "কাল বৃষ্টি হলে আমরা ঘরের ভিতরে খেলব।" },
        { target: "If I were you, I would apologise to Nanu.", bn: "আমি তুমি হলে নানুর কাছে ক্ষমা চাইতাম।" },
        { target: "If we had left earlier, we would have caught the train.", bn: "আগে বেরোলে আমরা ট্রেনটা পেতাম।" },
        { target: "Unless you practise, you will not improve.", bn: "অনুশীলন না করলে তুমি ভালো করবে না।" },
        { target: "Take an umbrella in case it rains.", bn: "বৃষ্টি হতে পারে, ছাতা নাও।" },
        { target: "Had I known the answer, I would have told you.", bn: "উত্তরটা জানলে তোমাকে বলতাম।" },
      ],
    },
    "conditionals-spot": {
      kind: "spot",
      title: { bn: "রাফির ডায়েরি, if-এর ভুল", en: "Rafi's diary: the if mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে সিঁড়ি মিশে গেছে বা if-এর ঘরে will ঢুকেছে, সেটা ছোঁও।", en: "Take the red pen. Tap every line where the steps got mixed or will crept into the if clause." },
      source: { bn: "ডায়েরি: ফাইনালের আগের রাত", en: "Diary: the night before the final" },
      lines: [
        { text: { bn: "Tomorrow is the final. If it rains, the match will be delayed.", en: "Tomorrow is the final. If it rains, the match will be delayed." } },
        { text: { bn: "If I will bowl the first over, I will keep it tight.", en: "If I will bowl the first over, I will keep it tight." }, flag: { bn: "if-এর ঘরে will নয়: If I bowl।", en: "No will in the if clause: If I bowl." } },
        { text: { bn: "If I was the captain, I would bat first.", en: "If I was the captain, I would bat first." }, flag: { bn: "কল্পনায় were: If I were the captain।", en: "Imagined, so were: If I were the captain." } },
        { text: { bn: "Last year, if we had won the semi-final, we would have played here too.", en: "Last year, if we had won the semi-final, we would have played here too." } },
        { text: { bn: "If we had practised more, we would win that day.", en: "If we had practised more, we would win that day." }, flag: { bn: "তৃতীয় সিঁড়ি: would have won।", en: "The third step: would have won." } },
        { text: { bn: "Unless we don't lose early wickets, we will score big.", en: "Unless we don't lose early wickets, we will score big." }, flag: { bn: "unless-এর পরে not নয়: Unless we lose।", en: "No not after unless: Unless we lose." } },
        { text: { bn: "I wish Tamim were playing with us.", en: "I wish Tamim were playing with us." } },
      ],
    },
    "conditionals-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Transformation: Unless you work hard, you will fail. (Use if)", en: "Transformation: Unless you work hard, you will fail. (Use if)" },
          options: [
            { text: { bn: "If you do not work hard, you will fail.", en: "If you do not work hard, you will fail." }, right: true, why: { bn: "হ্যাঁ। unless = if … not।", en: "Yes. Unless equals if … not." } },
            { text: { bn: "If you work hard, you will fail.", en: "If you work hard, you will fail." }, why: { bn: "না। মানে উল্টে গেল; not হারিয়ে গেছে।", en: "No. The meaning flipped; the not went missing." } },
            { text: { bn: "If you do not work hard, you will not fail.", en: "If you do not work hard, you will not fail." }, why: { bn: "না। ফলের দিকটা বদলায় না।", en: "No. The result side does not change." } },
          ],
        },
        {
          ask: { bn: "Complete: If I were a bird, ___", en: "Complete: If I were a bird, ___" },
          options: [
            { text: { bn: "I would fly over the Padma.", en: "I would fly over the Padma." }, right: true, why: { bn: "হ্যাঁ। were-এর সাথে would + খালি ক্রিয়া।", en: "Yes. Were pairs with would + bare verb." } },
            { text: { bn: "I will fly over the Padma.", en: "I will fly over the Padma." }, why: { bn: "না। were দ্বিতীয় সিঁড়ি: would।", en: "No. Were is the second step: would." } },
            { text: { bn: "I would have flown over the Padma.", en: "I would have flown over the Padma." }, why: { bn: "না। would have তৃতীয় সিঁড়ির, if-এ had লাগত।", en: "No. Would have belongs to the third step, which needs had in the if clause." } },
          ],
        },
        {
          ask: { bn: "Transformation: Had he studied, he would have passed. (Use if)", en: "Transformation: Had he studied, he would have passed. (Use if)" },
          options: [
            { text: { bn: "If he had studied, he would have passed.", en: "If he had studied, he would have passed." }, right: true, why: { bn: "হ্যাঁ। Had he = If he had।", en: "Yes. Had he equals If he had." } },
            { text: { bn: "If he studied, he would have passed.", en: "If he studied, he would have passed." }, why: { bn: "না। তৃতীয় সিঁড়িতে if-এ had + V3।", en: "No. The third step needs had + V3 in the if clause." } },
            { text: { bn: "If he had studied, he would pass.", en: "If he had studied, he would pass." }, why: { bn: "না। ফলের দিক দেওয়া ছিল would have passed; বদলায় না।", en: "No. The result side was given as would have passed; it stays." } },
          ],
        },
        {
          ask: { bn: "Which sentence means it is still possible?", en: "Which sentence means it is still possible?" },
          options: [
            { text: { bn: "If I win the match, I will buy sweets for everyone.", en: "If I win the match, I will buy sweets for everyone." }, right: true, why: { bn: "হ্যাঁ। প্রথম সিঁড়ি: জেতা সম্ভব, ম্যাচ সামনে।", en: "Yes. The first step: winning is possible, the match is ahead." } },
            { text: { bn: "If I won the match, I would buy sweets for everyone.", en: "If I won the match, I would buy sweets for everyone." }, why: { bn: "না। দ্বিতীয় সিঁড়ি: জিতব না ধরে নিচ্ছি, কল্পনা।", en: "No. The second step: I assume I will not win, a daydream." } },
            { text: { bn: "If I had won the match, I would have bought sweets.", en: "If I had won the match, I would have bought sweets." }, why: { bn: "না। তৃতীয়: ম্যাচ শেষ, জিতিনি।", en: "No. The third: the match is over and I lost." } },
          ],
        },
      ],
    },
    "conditionals-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "If I had known, I would have come. এর মানে কী?", en: "If I had known, I would have come. What does it mean?" },
          options: [
            { text: { bn: "আমি জানতাম, তাই এসেছি", en: "I knew, so I came" }, why: { bn: "না। তৃতীয় সিঁড়ি সবসময় উল্টো: যা বলা হচ্ছে তা হয়নি।", en: "No. The third step is always the reverse: what it says did not happen." } },
            { text: { bn: "আমি জানতাম না, তাই আসিনি; জানলে আসতাম", en: "I did not know, so I did not come; had I known, I would have" }, right: true, why: { bn: "হ্যাঁ। অতীতের আফসোস: দুটোই হয়নি।", en: "Yes. Past regret: neither thing happened." } },
            { text: { bn: "আমি হয়তো আসব", en: "I might come" }, why: { bn: "না। would have + V3 মানে অতীত, শেষ। ভবিষ্যতের কোনো সম্ভাবনা নেই।", en: "No. Would have + V3 is past and closed. There is no future possibility in it." } },
          ],
        },
        {
          ask: { bn: "কোনটা ঠিক?", en: "Which is right?" },
          options: [
            { text: { bn: "If it will rain, we will stay home.", en: "If it will rain, we will stay home." }, why: { bn: "না। if-এর ঘরে will নিষেধ।", en: "No. Will is banned from the if clause." } },
            { text: { bn: "If it rains, we will stay home.", en: "If it rains, we will stay home." }, right: true, why: { bn: "হ্যাঁ। প্রথম সিঁড়ি: if + present, will।", en: "Yes. The first step: if + present, will." } },
            { text: { bn: "If it rains, we would stay home.", en: "If it rains, we would stay home." }, why: { bn: "না। সিঁড়ি মিশে গেছে: rains-এর সাথে will, rained-এর সাথে would।", en: "No. The steps are mixed: rains goes with will, rained with would." } },
          ],
        },
      ],
    },
    "conditionals-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "কাল নিয়ে তিনটা প্রথম সিঁড়ি: If it is sunny tomorrow, I will…", en: "Three first-step sentences about tomorrow: If it is sunny tomorrow, I will…" } },
        { text: { bn: "তিনটা কল্পনা: If I had a million taka… If I were the captain… If I could fly…", en: "Three imagined ones: If I had a million taka… If I were the captain… If I could fly…" } },
        { text: { bn: "দুটো আফসোস, নরম করে: If I had…, I would have…", en: "Two regrets, gently: If I had…, I would have…" } },
        { text: { bn: "একটা ঘটনা চার সিঁড়িতে জোরে: If it rains… চারবার, চার কালে।", en: "One event in all four steps aloud: If it rains… four times, four tenses." } },
        { text: { bn: "তিনটা wish: I wish I were… I wish I had… I wish you would…", en: "Three wishes: I wish I were… I wish I had… I wish you would…" } },
        { text: { bn: "পাঁচটা unless-বাক্য, তারপর প্রতিটা if not দিয়ে আবার।", en: "Five unless sentences, then each one again with if not." } },
      ],
    },
  },
};
