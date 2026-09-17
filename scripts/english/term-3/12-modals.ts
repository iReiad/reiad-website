/* ============================================================
   12-modals.ts: পর্ব ১২, can, must, should: শক্তির শব্দ.

   One part of the grammar term, gathered into the rung by
   `middle.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>পর্ব ১-এর দলে একদল খেলোয়াড় ছিল যাদের আলাদা করে নাম বলা হয়নি: <span lang="en">can, could, may, might, must, should, will, would</span>। এরা ক্রিয়া, কিন্তু একা কিছু করে না। একটা মূল ক্রিয়ার সামনে দাঁড়িয়ে তার মানে বদলে দেয়: পারা, লাগা, উচিত, হতে পারে, অনুমতি। এদের নাম <span lang="en">modal verb</span>, আর তানভীর ভাই এদের ডাকে "শক্তির শব্দ", কারণ একটা শব্দ বদলালেই অনুরোধ হয়ে যায় হুকুম।</p>

<p>পর্ব ৬-এর টুপির নিয়ম মনে আছে? modal-দের একটা মজা: <strong>এরা কখনো টুপি পরে না, আর এদের পরের ক্রিয়াও পরে না।</strong> <span lang="en">She can swim.</span> <span lang="en">She cans</span> নয়, <span lang="en">can swims</span> নয়। কর্তা যেই হোক, দুটো শব্দই খালি। এই পর্বে নয়টা modal-এর সাতটা কাজ, নিশ্চয়তার সিঁড়ি, ভদ্রতার সিঁড়ি, বাধ্যতার সিঁড়ি, অতীতের modal, না-বাচকের ছক, আর সেই একটা জোড়া যেটা পরীক্ষায় প্রতি বছর: <span lang="en">must not</span> আর <span lang="en">don't have to</span>।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>modal + খালি ক্রিয়া, সবসময়। <span lang="en">must go, should eat, can play</span>। কোনো <span lang="en">to</span> নয়, কোনো <span lang="en">-s</span> নয়।</li>
<li><span lang="en">can / could</span>: পারা, আর অনুরোধ। <span lang="en">may / might</span>: হতে পারে, অনুমতি।</li>
<li><span lang="en">must / have to</span>: লাগবেই। <span lang="en">should</span>: উচিত। <span lang="en">would</span>: ভদ্র অনুরোধ, কল্পনা।</li>
<li>না-বাচক: modal + <span lang="en">not</span>। <span lang="en">cannot, must not, should not</span>। প্রশ্ন: modal আগে। <span lang="en">Can you…? Should I…?</span></li>
<li><span lang="en">must not</span> মানে নিষেধ, কিন্তু <span lang="en">don't have to</span> মানে দরকার নেই। দুটো উল্টো।</li>
<li>অতীত নিয়ে অনুমান বা আফসোস: modal + <span lang="en">have</span> + V3। <span lang="en">must have gone, should have called</span>।</li>
</ul>
</div>

${mount("modals-pattern")}

<h2>নয়টা modal, সাতটা কাজ</h2>

<p>একই modal একাধিক কাজ করে, আর একই কাজ একাধিক modal দিয়ে হয়। তাই modal মুখস্থ না করে কাজ মুখস্থ করো: বাক্যটা কী চাইছে, পারা না অনুমতি না বাধ্যতা? তারপর সেই কাজের modal-টা বসাও।</p>

<div class="table-scroll">
<table>
<thead><tr><th>কাজ</th><th>modal</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td>পারা, ক্ষমতা</td><td><span lang="en">can, could, be able to</span></td><td><span lang="en">Rafi can bowl fast. Nanu could climb trees.</span></td></tr>
<tr><td>অনুমতি</td><td><span lang="en">can, could, may</span></td><td><span lang="en">May I come in? Can I borrow your bat?</span></td></tr>
<tr><td>সম্ভাবনা, অনুমান</td><td><span lang="en">may, might, could, must, can't</span></td><td><span lang="en">It might rain. He must be at home.</span></td></tr>
<tr><td>বাধ্যতা, নিয়ম</td><td><span lang="en">must, have to, need to</span></td><td><span lang="en">You must wear a helmet.</span></td></tr>
<tr><td>উপদেশ, উচিত</td><td><span lang="en">should, ought to, had better</span></td><td><span lang="en">You should sleep early.</span></td></tr>
<tr><td>অনুরোধ, প্রস্তাব</td><td><span lang="en">can, could, would, will, shall</span></td><td><span lang="en">Could you help? Shall we go? Would you like tea?</span></td></tr>
<tr><td>কথা দেওয়া, ভবিষ্যৎ, অভ্যাস</td><td><span lang="en">will, would</span></td><td><span lang="en">I will call you. Nanu would tell us stories every night.</span></td></tr>
</tbody>
</table>
</div>

<p>শেষ সারির <span lang="en">would</span>-টা চেনো: <span lang="en">would</span> শুধু ভদ্রতা নয়, অতীতের অভ্যাসও, <span lang="en">used to</span>-র মতো। <span lang="en">When I was small, Nanu would tell me a story every night.</span> রোজ বলতেন। আর <span lang="en">shall</span> এখন প্রায় শুধু প্রস্তাবে, <span lang="en">I</span> আর <span lang="en">we</span>-র সাথে: <span lang="en">Shall I open the window? Shall we start?</span></p>

${mount("modals-jobs")}

<h2>নিশ্চয়তার সিঁড়ি</h2>

<p>রাফি জানালা দিয়ে দেখে মাঠ ভেজা। কতটা নিশ্চিত যে বৃষ্টি হয়েছে, সেটা একটা modal-এ বলা যায়।</p>

<div class="table-scroll">
<table>
<thead><tr><th>modal</th><th>কতটা নিশ্চিত</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">must</span></td><td>প্রায় ১০০%: নিশ্চয়ই</td><td><span lang="en">The ground is wet. It must have rained.</span></td></tr>
<tr><td><span lang="en">will</span></td><td>নিশ্চিত ভবিষ্যৎ</td><td><span lang="en">It will rain tonight.</span></td></tr>
<tr><td><span lang="en">should</span></td><td>হওয়ার কথা</td><td><span lang="en">The bus should be here by now.</span></td></tr>
<tr><td><span lang="en">may</span></td><td>৫০%: হতে পারে</td><td><span lang="en">It may rain later.</span></td></tr>
<tr><td><span lang="en">might / could</span></td><td>৩০%: হতেও পারে</td><td><span lang="en">It might rain, who knows.</span></td></tr>
<tr><td><span lang="en">can't</span></td><td>০%: অসম্ভব</td><td><span lang="en">That can't be Shakib, he is in Dubai.</span></td></tr>
</tbody>
</table>
</div>

<p>দুটো জোড়া চেনো। <span lang="en">must</span>-এর উল্টো এখানে <span lang="en">must not</span> নয়, <span lang="en">can't</span>: <span lang="en">He must be at home</span> (নিশ্চয়ই বাসায়), <span lang="en">He can't be at home</span> (বাসায় থাকা অসম্ভব)। আর <span lang="en">may be</span> দুটো শব্দ, ক্রিয়া; <span lang="en">maybe</span> একটা শব্দ, adverb, মানে "হয়তো": <span lang="en">He may be late. Maybe he is late.</span></p>

${mount("modals-ladder")}

<h2>পারা: can, could, be able to</h2>

<p><span lang="en">can</span> বর্তমানের ক্ষমতা: <span lang="en">Rafi can bowl.</span> <span lang="en">could</span> অতীতের ক্ষমতা: <span lang="en">Nanu could climb trees when she was young.</span> ভবিষ্যতে আর perfect-এ <span lang="en">can</span> চলে না, তখন <span lang="en">be able to</span>: <span lang="en">You will be able to drive next year. I have been able to swim since I was five.</span> অনুরোধে <span lang="en">could</span> বেশি ভদ্র: <span lang="en">Can you help? Could you help me, please?</span></p>

<p>একটা সূক্ষ্ম জিনিস: অতীতে একবারের সফল কাজে <span lang="en">could</span> নয়, <span lang="en">was able to</span> বা <span lang="en">managed to</span>: <span lang="en">The fire was huge, but everyone was able to escape.</span> সাধারণ ক্ষমতায় <span lang="en">could</span> (<span lang="en">Nanu could swim</span>), একটা নির্দিষ্ট ঘটনায় <span lang="en">was able to</span>। না-বাচকে দুটোই চলে: <span lang="en">I couldn't open the door.</span></p>

<h2>লাগবেই: must, have to, should</h2>

<p><span lang="en">must</span> ভিতর থেকে, নিজের সিদ্ধান্ত বা জোরালো নিয়ম: <span lang="en">I must study tonight.</span> <span lang="en">have to</span> বাইরে থেকে, কারও নিয়ম: <span lang="en">I have to wear a uniform.</span> স্কুল বলেছে। <span lang="en">should</span> উপদেশ, উচিত: <span lang="en">You should sleep early before an exam.</span> অতীতে আফসোস: <span lang="en">I should have studied more.</span> করা উচিত ছিল, করিনি।</p>

<p>আর সেই ফাঁদ যেটা পরীক্ষায় বারবার আসে: <span lang="en">must not</span> মানে করা <em>নিষেধ</em>: <span lang="en">You must not cheat.</span> কিন্তু <span lang="en">don't have to</span> মানে করা <em>দরকার নেই</em>, ইচ্ছে হলে করতে পারো: <span lang="en">You don't have to come; it's optional.</span> বাংলায় দুটোই "করতে হবে না"-র কাছাকাছি শোনায়, ইংরেজিতে দুটো দুই মেরু।</p>

<p>বাধ্যতারও একটা সিঁড়ি, জোর থেকে নরম: <span lang="en">must</span> (নিজের বা কড়া নিয়ম) > <span lang="en">have to</span> (বাইরের নিয়ম) > <span lang="en">had better</span> (নইলে খারাপ হবে) > <span lang="en">should / ought to</span> (উচিত) > <span lang="en">need to</span> (দরকার)। <span lang="en">You had better hurry, or you will miss the bus.</span> <span lang="en">had better</span>-এর পরেও খালি ক্রিয়া, আর <span lang="en">ought</span>-ই একমাত্র modal যার পরে <span lang="en">to</span>: <span lang="en">You ought to apologise.</span> <span lang="en">must</span>-এর অতীত নেই, তাই অতীতে <span lang="en">had to</span>: <span lang="en">I had to leave early yesterday.</span></p>

${mount("modals-duty")}

${mount("modals-lines")}

<h2>অনুমতি আর ভদ্রতা: may, would, shall</h2>

<p><span lang="en">May I come in, Sir?</span> সবচেয়ে ভদ্র অনুমতি। <span lang="en">Can I come in?</span> সাধারণ। <span lang="en">Would you like some tea?</span> ভদ্র প্রস্তাব, <span lang="en">Do you want</span>-এর চেয়ে নরম। <span lang="en">Would you mind closing the door?</span> সবচেয়ে ভদ্র অনুরোধ, আর উত্তরটা উল্টো: <span lang="en">No, not at all</span> মানে হ্যাঁ, বন্ধ করছি। <span lang="en">Shall we go?</span> প্রস্তাব, চলো যাই।</p>

<p>ভদ্রতার নিয়মটা এক লাইনে: অতীতের রূপ বেশি ভদ্র। <span lang="en">could</span> is politer than <span lang="en">can</span>, <span lang="en">would</span> is politer than <span lang="en">will</span>, <span lang="en">might</span> is politer than <span lang="en">may</span>। কারণ অতীতের রূপ একটু দূরত্ব তৈরি করে, আর দূরত্বই ভদ্রতা। <span lang="en">I would like a cup of tea</span> হলো <span lang="en">I want a cup of tea</span>-র ভদ্র রূপ, আর <span lang="en">would like</span>-এর পরে <span lang="en">to</span>: <span lang="en">I would like to see the menu.</span></p>

<div class="ex"><b>Star Wars-এর লাইনটা:</b> <span lang="en">May the Force be with you.</span> এটা অনুমতি নয়, প্রার্থনা: <span lang="en">may</span> দিয়ে শুভকামনা। <span lang="en">May you live long.</span> আর Yoda বলে, <span lang="en">Do or do not. There is no try.</span> কোনো modal নেই, তাই এত কড়া শোনায়। Yoda যদি বলত <span lang="en">You should try</span>, সিনেমাটা অন্য রকম হতো।</div>

${mount("modals-gap")}

<h2>না-বাচক আর প্রশ্নের ছক</h2>

<p>modal-এর না-বাচক সহজ: তার পরে <span lang="en">not</span>, আর প্রায় সবগুলো ছোট হয়। <span lang="en">cannot / can't, could not / couldn't, must not / mustn't, should not / shouldn't, will not / won't, would not / wouldn't, might not / mightn't, need not / needn't</span>। <span lang="en">may not</span> ছোট হয় না। <span lang="en">cannot</span> এক শব্দে লেখা হয়। প্রশ্নে modal কর্তার আগে: <span lang="en">Can you swim? Should I call? Must we go?</span> লেজ-প্রশ্নেও একই modal: <span lang="en">You can swim, can't you? He won't come, will he?</span></p>

<p>না-বাচকে মানে বদলে যায় এমন তিনটা: <span lang="en">must not</span> (নিষেধ), <span lang="en">need not / don't have to</span> (দরকার নেই), <span lang="en">can't</span> (অসম্ভব, অনুমানে)। <span lang="en">You mustn't tell anyone</span>: কাউকে বলা মানা। <span lang="en">You needn't tell anyone</span>: না বললেও চলে। <span lang="en">That can't be true</span>: সত্যি হওয়া অসম্ভব।</p>

${mount("modals-reveal")}

${mount("modals-negatives")}

<h2>অতীতে modal: modal + have + V3</h2>

<p>অতীত নিয়ে অনুমান বা আফসোস করতে <span lang="en">modal + have + V3</span>। <span lang="en">She must have left</span>: নিশ্চয়ই চলে গেছে। <span lang="en">He might have missed the bus</span>: হয়তো বাস মিস করেছে। <span lang="en">You should have called me</span>: ফোন করা উচিত ছিল। <span lang="en">I could have scored a century</span>: করতে পারতাম, করিনি। ক্রিকেটের সব আফসোস এই ছাঁচে: <span lang="en">We could have won.</span></p>

<div class="table-scroll">
<table>
<thead><tr><th>ছাঁচ</th><th>মানে</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">must have + V3</span></td><td>নিশ্চয়ই হয়েছিল (অনুমান)</td><td><span lang="en">The lights are off. They must have gone to bed.</span></td></tr>
<tr><td><span lang="en">may / might have + V3</span></td><td>হয়তো হয়েছিল</td><td><span lang="en">He might have forgotten the date.</span></td></tr>
<tr><td><span lang="en">can't have + V3</span></td><td>হওয়া অসম্ভব</td><td><span lang="en">She can't have finished already; it is too soon.</span></td></tr>
<tr><td><span lang="en">should have + V3</span></td><td>উচিত ছিল, হয়নি (আফসোস)</td><td><span lang="en">You should have told me.</span></td></tr>
<tr><td><span lang="en">could have + V3</span></td><td>পারত, হয়নি</td><td><span lang="en">We could have won that match.</span></td></tr>
<tr><td><span lang="en">would have + V3</span></td><td>হতো (শর্ত সাপেক্ষে)</td><td><span lang="en">I would have come if you had called.</span></td></tr>
<tr><td><span lang="en">needn't have + V3</span></td><td>দরকার ছিল না, তবু করেছে</td><td><span lang="en">You needn't have brought a gift.</span></td></tr>
</tbody>
</table>
</div>

<p>শেষ সারিটা পরীক্ষার প্রিয়: <span lang="en">needn't have brought</span> মানে এনেছ, কিন্তু আনার দরকার ছিল না; <span lang="en">didn't need to bring</span> মানে দরকার ছিল না, তাই আনোনি (সাধারণত)। আর <span lang="en">would have</span> পর্ব ১৭-এর তৃতীয় সিঁড়ি।</p>

${mount("modals-past")}

${mount("modals-build")}

${mount("modals-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>modal-এর প্রশ্ন তিন চেহারায়। এক: <span lang="en">right form</span>, modal-এর পরে বন্ধনীর ক্রিয়া। দুই: খালি ঘরে ঠিক modal (<span lang="en">must / should / can / might</span>)। তিন: <span lang="en">transformation</span>, <span lang="en">must not ↔ don't have to</span> নয়, বরং <span lang="en">It is necessary to… ↔ You must…</span>, <span lang="en">Please… ↔ Would you mind…</span>। ধাপ:</p>

<ol class="step-list">
<li><strong>বন্ধনীর ক্রিয়ার আগে modal?</strong> তাহলে খালি রূপ, কোনো <span lang="en">-s, -ed, -ing, to</span> নয়। আগে <span lang="en">have</span> থাকলে V3।</li>
<li><strong>খালি ঘরে modal চাইলে বাক্যের কাজটা পড়ো।</strong> নিয়ম বা প্রমাণ: <span lang="en">must</span>। উপদেশ: <span lang="en">should</span>। ক্ষমতা: <span lang="en">can</span>। অনিশ্চয়তা: <span lang="en">might</span>। ভদ্র অনুরোধ: <span lang="en">could / would</span>।</li>
<li><strong>না-বাচক হলে মানে দেখো।</strong> নিষেধ: <span lang="en">must not</span>। দরকার নেই: <span lang="en">don't have to / needn't</span>।</li>
<li><strong>অতীত হলে <span lang="en">have + V3</span>।</strong> আর <span lang="en">must</span>-এর অতীত বাধ্যতায় <span lang="en">had to</span>।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Students ___ (wear) their uniforms; it is the rule. You ___ bring your own bat, the club will lend you one. Mitu is not answering; she ___ be asleep. Rafi ___ have practised more before the final. Nanu ___ walk five miles when she was young.</span> উত্তর: <span lang="en">must wear</span> (নিয়ম, খালি ক্রিয়া), <span lang="en">don't have to</span> (দরকার নেই), <span lang="en">must</span> (প্রমাণ থেকে অনুমান), <span lang="en">should</span> (আফসোস, <span lang="en">have practised</span>), <span lang="en">could</span> (অতীতের ক্ষমতা)। পাঁচ ঘর, পাঁচটা আলাদা কাজ।</div>

${mount("modals-exam")}

${mount("modals-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>modal-এর পরে বন্ধনীতে যে ক্রিয়াই থাকুক, উত্তর তার খালি রূপ। <span lang="en">She can (swim)</span>: <span lang="en">swim</span>। কোনো <span lang="en">-s, -ed, -ing, to</span> নয়। একমাত্র ব্যতিক্রম: অতীত নিয়ে বললে <span lang="en">have + V3</span>: <span lang="en">She must have (go)</span>: <span lang="en">gone</span>। বন্ধনীর ক্রিয়ার আগে <span lang="en">have</span> থাকলে V3, নইলে খালি।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">can</span>-এর সাথে কখনো <span lang="en">to</span> নয়: <span lang="en">I can to swim</span> ভুল। কিন্তু <span lang="en">be able to</span> আর <span lang="en">have to</span>-তে <span lang="en">to</span> আছে, কারণ ওগুলো আসল modal নয়, modal-এর কাজ করা ছাঁচ। <span lang="en">I am able to swim. I have to go.</span> তালিকাটা মনে রাখো: আসল modal নয়টা, <span lang="en">can, could, may, might, must, shall, should, will, would</span>, আর এদের কারও পরে <span lang="en">to</span> নেই।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>দুটো modal একসাথে বসে না: <span lang="en">I will can come</span> ভুল। ভবিষ্যতে পারা বোঝাতে <span lang="en">will be able to</span>, ভবিষ্যতে লাগা বোঝাতে <span lang="en">will have to</span>: <span lang="en">Next year I will be able to drive, but I will have to get a licence first.</span> ছাঁচগুলো এই জন্যই আছে: modal যেখানে যেতে পারে না, ছাঁচ সেখানে যায়।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>নয়টা আসল modal না দেখে, আর কেন এদের পরে কখনো <span lang="en">to</span> নয়?</li>
<li>নিশ্চয়তার সিঁড়ি: <span lang="en">must</span> থেকে <span lang="en">can't</span>, ছয় ধাপ?</li>
<li><span lang="en">must not</span> আর <span lang="en">don't have to</span>: একটা করে উদাহরণ?</li>
<li>ভদ্রতার নিয়ম: কেন <span lang="en">could</span> আর <span lang="en">would</span> বেশি ভদ্র?</li>
<li><span lang="en">should have, could have, must have</span>: তিনটা অতীত, তিনটা মানে?</li>
<li><span lang="en">can</span> ভবিষ্যতে কী হয়ে যায়?</li>
</ul>
</div>

${mount("modals-drill")}
`,
  blocks: {
    "modals-pattern": {
      kind: "pattern",
      title: { bn: "modal + খালি ক্রিয়া", en: "Modal + bare verb" },
      shape: "WHO + can / must / should / may / might + VERB (খালি)",
      why: { bn: "modal-এর পরে ক্রিয়া সবসময় খালি: to নয়, -s নয়, -ing নয়। কর্তা যেই হোক। একটা modal বদলালেই মানেটা পারা থেকে লাগা থেকে উচিত-এ চলে যায়, ক্রিয়া একই থাকে।", en: "After a modal the verb is always bare: no to, no -s, no -ing, whoever the subject is. Change the modal and the meaning slides from can to must to should while the verb stays put." },
      examples: [
        { target: "Rafi can bowl fast.", bn: "রাফি জোরে বল করতে পারে। (ক্ষমতা)" },
        { target: "Rafi must practise every day.", bn: "রাফিকে রোজ অনুশীলন করতেই হবে। (বাধ্যতা)" },
        { target: "Rafi should sleep early.", bn: "রাফির তাড়াতাড়ি ঘুমানো উচিত। (উপদেশ)" },
        { target: "Rafi may play in the final.", bn: "রাফি হয়তো ফাইনালে খেলবে। (সম্ভাবনা)" },
        { target: "Could you pass the ball, please?", bn: "বলটা একটু দেবে? (ভদ্র অনুরোধ)" },
      ],
      tip: { bn: "must not = নিষেধ। don't have to = দরকার নেই। এই একটা জোড়া পরীক্ষায় প্রতি বছর।", en: "Must not forbids; don't have to means no need. This one pair comes up every year." },
    },
    "modals-jobs": {
      kind: "bins",
      title: { bn: "modal-টা কী কাজ করছে", en: "What job is the modal doing" },
      note: { bn: "প্রতিটা বাক্যে modal-টা কী চাইছে, সেই ঘরে ফেলো।", en: "Drop each sentence into the box of what its modal is doing." },
      bins: [
        { id: "ability", label: { bn: "পারা", en: "ability" } },
        { id: "permission", label: { bn: "অনুমতি", en: "permission" } },
        { id: "guess", label: { bn: "অনুমান", en: "possibility" } },
        { id: "duty", label: { bn: "বাধ্যতা", en: "obligation" } },
        { id: "advice", label: { bn: "উপদেশ", en: "advice" } },
      ],
      items: [
        { text: { bn: "Nanu can still read without glasses.", en: "Nanu can still read without glasses." }, bin: "ability", why: { bn: "পারা।", en: "Ability." } },
        { text: { bn: "May I leave early today?", en: "May I leave early today?" }, bin: "permission", why: { bn: "অনুমতি চাওয়া।", en: "Asking permission." } },
        { text: { bn: "It might rain this evening.", en: "It might rain this evening." }, bin: "guess", why: { bn: "হতে পারে, অনুমান।", en: "It may happen, a guess." } },
        { text: { bn: "You must wear a helmet.", en: "You must wear a helmet." }, bin: "duty", why: { bn: "নিয়ম, বাধ্যতা।", en: "A rule, an obligation." } },
        { text: { bn: "You should drink more water.", en: "You should drink more water." }, bin: "advice", why: { bn: "উচিত, উপদেশ।", en: "Ought to, advice." } },
        { text: { bn: "The lights are on; someone must be home.", en: "The lights are on; someone must be home." }, bin: "guess", why: { bn: "must এখানে বাধ্যতা নয়, প্রমাণ থেকে অনুমান।", en: "Must here is not duty but a guess from evidence." } },
        { text: { bn: "You can use my phone if you like.", en: "You can use my phone if you like." }, bin: "permission", why: { bn: "অনুমতি দেওয়া।", en: "Giving permission." } },
        { text: { bn: "Students have to wear uniforms.", en: "Students have to wear uniforms." }, bin: "duty", why: { bn: "বাইরের নিয়ম, বাধ্যতা।", en: "An outside rule, obligation." } },
        { text: { bn: "You had better see a doctor.", en: "You had better see a doctor." }, bin: "advice", why: { bn: "জোরালো উপদেশ।", en: "Strong advice." } },
        { text: { bn: "Mustafiz could bowl at 140 when he was twenty.", en: "Mustafiz could bowl at 140 when he was twenty." }, bin: "ability", why: { bn: "অতীতের ক্ষমতা।", en: "Ability in the past." } },
      ],
    },
    "modals-ladder": {
      kind: "order",
      title: { bn: "নিশ্চয়তার সিঁড়ি সাজাও", en: "Build the ladder of certainty" },
      note: { bn: "একই অনুমান, ছয়টা modal। সবচেয়ে নিশ্চিত থেকে সবচেয়ে অসম্ভব পর্যন্ত সাজাও।", en: "The same guess in six modals. Order them from most certain to impossible." },
      items: [
        { text: { bn: "He must be at home. (প্রায় নিশ্চিত)", en: "He must be at home. (almost certain)" } },
        { text: { bn: "He will be at home. (নিশ্চিত ভবিষ্যৎ)", en: "He will be at home. (a sure future)" } },
        { text: { bn: "He should be at home. (থাকার কথা)", en: "He should be at home. (expected)" } },
        { text: { bn: "He may be at home. (হতে পারে)", en: "He may be at home. (possible)" } },
        { text: { bn: "He might be at home. (হতেও পারে)", en: "He might be at home. (less likely)" } },
        { text: { bn: "He can't be at home. (অসম্ভব)", en: "He can't be at home. (impossible)" }, why: { bn: "অনুমানে must-এর উল্টো must not নয়, can't।", en: "In a guess, the opposite of must is can't, not must not." } },
      ],
    },
    "modals-duty": {
      kind: "compare",
      title: { bn: "must, have to, should, had better", en: "Must, have to, should, had better" },
      note: { bn: "চারটা বাধ্যতা, চার রকম জোর, আর চারটার না-বাচক চার রকম।", en: "Four kinds of obligation, four strengths, and four different negatives." },
      columns: [
        { bn: "must", en: "must" },
        { bn: "have to", en: "have to" },
        { bn: "had better", en: "had better" },
        { bn: "should", en: "should" },
      ],
      rows: [
        { label: { bn: "কোথা থেকে", en: "Where from" }, cells: [{ bn: "ভিতর থেকে, বা কড়া নিয়ম", en: "from inside, or a strict rule" }, { bn: "বাইরের নিয়ম", en: "an outside rule" }, { bn: "সতর্কতা: নইলে খারাপ হবে", en: "a warning: or else" }, { bn: "উপদেশ, উচিত", en: "advice, ought to" }] },
        { label: { bn: "উদাহরণ", en: "Example" }, cells: [{ bn: "I must study tonight.", en: "I must study tonight." }, { bn: "I have to wear a uniform.", en: "I have to wear a uniform." }, { bn: "You had better hurry.", en: "You had better hurry." }, { bn: "You should sleep early.", en: "You should sleep early." }] },
        { label: { bn: "না-বাচকের মানে", en: "The negative means" }, cells: [{ bn: "must not: নিষেধ", en: "must not: forbidden" }, { bn: "don't have to: দরকার নেই", en: "don't have to: no need" }, { bn: "had better not: না করাই ভালো", en: "had better not: best not to" }, { bn: "should not: করা উচিত নয়", en: "should not: ought not to" }] },
        { label: { bn: "অতীত", en: "Past" }, cells: [{ bn: "had to (বাধ্যতায়)", en: "had to (for duty)" }, { bn: "had to", en: "had to" }, { bn: "নেই", en: "none" }, { bn: "should have + V3", en: "should have + V3" }] },
        { label: { bn: "পরের ক্রিয়া", en: "The verb after" }, cells: [{ bn: "খালি", en: "bare" }, { bn: "to + খালি", en: "to + bare" }, { bn: "খালি", en: "bare" }, { bn: "খালি (ought to)", en: "bare (ought to)" }] },
      ],
    },
    "modals-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: একই কথা, ভদ্রতার সিঁড়ি", en: "Listen, say: one request, up the ladder of politeness" },
      lines: [
        { target: "Give me the salt.", bn: "লবণ দাও। (হুকুম)" },
        { target: "Can you give me the salt?", bn: "লবণটা দিতে পারো? (সাধারণ)" },
        { target: "Could you give me the salt, please?", bn: "লবণটা একটু দেবেন? (ভদ্র)" },
        { target: "Would you mind passing the salt?", bn: "লবণটা এগিয়ে দিতে কি আপত্তি আছে? (সবচেয়ে ভদ্র)" },
        { target: "May I have the salt, please?", bn: "আমি কি লবণটা পেতে পারি? (আনুষ্ঠানিক)" },
        { target: "I would like some salt, please.", bn: "আমি একটু লবণ চাই। (want-এর ভদ্র রূপ)" },
      ],
    },
    "modals-gap": {
      kind: "gap",
      title: { bn: "কোন শক্তির শব্দ", en: "Which power word" },
      items: [
        { text: "You ___ wear a helmet while batting. It is the rule.", bn: "ব্যাট করার সময় তোমাকে হেলমেট পরতেই হবে। এটা নিয়ম।", options: ["can", "must", "might"], right: 1, why: { bn: "নিয়ম, বাধ্যতা: must।", en: "A rule, an obligation: must." } },
        { text: "It is a holiday. You ___ go to school.", bn: "ছুটি। তোমার স্কুলে যাওয়ার দরকার নেই।", options: ["must not", "don't have to", "should not"], right: 1, why: { bn: "দরকার নেই, নিষেধ নয়: don't have to। must not হলে যাওয়া মানা।", en: "No need, not a ban: don't have to. Must not would forbid going." } },
        { text: "Nanu ___ climb trees when she was a girl.", bn: "নানু ছোটবেলায় গাছে চড়তে পারতেন।", options: ["can", "could", "may"], right: 1, why: { bn: "অতীতের ক্ষমতা: could।", en: "Ability in the past: could." } },
        { text: "The ground is wet. It ___ have rained last night.", bn: "মাঠ ভেজা। কাল রাতে নিশ্চয়ই বৃষ্টি হয়েছে।", options: ["must", "can", "should"], right: 0, why: { bn: "প্রমাণ দেখে প্রায় নিশ্চিত অনুমান: must have + V3।", en: "A near-certain guess from evidence: must have + V3." } },
        { text: "She ___ swim, so she wears a life jacket.", bn: "সে সাঁতার পারে না, তাই লাইফ জ্যাকেট পরে।", options: ["cannot", "must not", "may not"], right: 0, why: { bn: "ক্ষমতা নেই: cannot। এক শব্দে লেখা হয়।", en: "No ability: cannot, written as one word." } },
        { text: "You ___ have told me. I waited for an hour!", bn: "তোমার আমাকে বলা উচিত ছিল। আমি এক ঘণ্টা অপেক্ষা করেছি!", options: ["should", "can", "may"], right: 0, why: { bn: "অতীতের আফসোস, করা উচিত ছিল: should have + V3।", en: "Regret about the past, what ought to have happened: should have + V3." } },
        { text: "Next year you ___ drive; you will be eighteen.", bn: "আগামী বছর তুমি গাড়ি চালাতে পারবে; তোমার আঠারো হবে।", options: ["will can", "will be able to", "can"], right: 1, why: { bn: "ভবিষ্যতে can চলে না, দুটো modal একসাথে চলে না: will be able to।", en: "Can has no future and two modals cannot sit together: will be able to." } },
        { text: "Yesterday I ___ leave early because Nanu was ill.", bn: "কাল নানু অসুস্থ ছিলেন বলে আমাকে আগে চলে যেতে হয়েছিল।", options: ["must", "had to", "should"], right: 1, why: { bn: "must-এর অতীত নেই: had to।", en: "Must has no past: had to." } },
      ],
    },
    "modals-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: কোচ কী বললেন?", en: "Guess first: what did the coach say?" },
      ask: { bn: "কোচ রাফিকে বললেন, You must not come to practice tomorrow. আর মিতুকে বললেন, You don't have to come to practice tomorrow. কে কাল আসতে পারে?", en: "The coach told Rafi, You must not come to practice tomorrow. He told Mitu, You don't have to come to practice tomorrow. Who is allowed to come tomorrow?" },
      choices: [
        { bn: "দুজনেই আসতে পারে", en: "Both may come" },
        { bn: "কেউই না", en: "Neither" },
        { bn: "মিতু পারে, রাফি নয়", en: "Mitu may, Rafi may not" },
      ],
      answer: { bn: "মিতু পারে, রাফি নয়।", en: "Mitu may, Rafi may not." },
      why: { bn: "must not মানে নিষেধ: রাফির আসা মানা, হয়তো সে আহত। don't have to মানে দরকার নেই: মিতু ইচ্ছে হলে আসতে পারে, না এলেও চলে। বাংলায় দুটোই 'আসতে হবে না' শোনায়, ইংরেজিতে একটা দরজা বন্ধ, অন্যটা খোলা। পরীক্ষায় এই জোড়াটা প্রতি বছর, আর জীবনে একটা ভুল বোঝাবুঝির কারণ।", en: "Must not forbids: Rafi is banned, perhaps he is injured. Don't have to means no need: Mitu may come if she likes and may stay away. In Bangla both sound like you need not come; in English one door is shut and the other open. The exam sets this pair every year, and in life it causes real misunderstandings." },
    },
    "modals-negatives": {
      kind: "gap",
      title: { bn: "না-বাচকের মানে", en: "What the negative means" },
      note: { bn: "নিষেধ, দরকার নেই, নাকি অসম্ভব: বাক্যটা কী চাইছে দেখো।", en: "Forbidden, no need, or impossible: read what the sentence wants." },
      items: [
        { text: "You ___ cheat in the exam. It is strictly forbidden.", bn: "পরীক্ষায় নকল করা যাবে না। কড়া নিষেধ।", options: ["must not", "don't have to", "needn't"], right: 0, why: { bn: "নিষেধ: must not।", en: "Forbidden: must not." } },
        { text: "You ___ bring food; lunch is provided.", bn: "খাবার আনার দরকার নেই; দুপুরের খাবার দেওয়া হবে।", options: ["must not", "needn't", "can't"], right: 1, why: { bn: "দরকার নেই: needn't বা don't have to। must not হলে আনা মানা।", en: "No need: needn't or don't have to. Must not would ban it." } },
        { text: "That ___ be Rafi at the door; he is in Sylhet.", bn: "দরজায় ওটা রাফি হতে পারে না; সে সিলেটে।", options: ["must not", "can't", "shouldn't"], right: 1, why: { bn: "অনুমানে অসম্ভব: can't। must not অনুমানে বসে না।", en: "Impossible, as a guess: can't. Must not is not used for guessing." } },
        { text: "You ___ eat so much sugar; it is bad for your teeth.", bn: "তোমার এত চিনি খাওয়া উচিত নয়; দাঁতের জন্য খারাপ।", options: ["shouldn't", "can't", "needn't"], right: 0, why: { bn: "উপদেশ, উচিত নয়: shouldn't।", en: "Advice, ought not to: shouldn't." } },
        { text: "You ___ have brought a gift; your visit was enough.", bn: "উপহার আনার দরকার ছিল না; তোমার আসাই যথেষ্ট ছিল।", options: ["needn't", "mustn't", "can't"], right: 0, why: { bn: "এনেছ, কিন্তু দরকার ছিল না: needn't have + V3।", en: "You brought it, but did not need to: needn't have + V3." } },
        { text: "Mitu ___ have failed; she studied all year.", bn: "মিতু ফেল করতে পারে না; সে সারা বছর পড়েছে।", options: ["can't", "mustn't", "needn't"], right: 0, why: { bn: "অতীত নিয়ে অসম্ভব অনুমান: can't have + V3।", en: "An impossible guess about the past: can't have + V3." } },
      ],
    },
    "modals-past": {
      kind: "match",
      title: { bn: "অতীতের modal মেলাও", en: "Match the past modal" },
      note: { bn: "বাঁ দিকের অবস্থার সাথে ডান দিকের modal + have + V3 মেলাও।", en: "Match each situation on the left with its modal + have + V3 on the right." },
      pairs: [
        { left: { bn: "মাঠ ভেজা, তাই নিশ্চয়ই বৃষ্টি হয়েছে", en: "the ground is wet, so surely it rained" }, right: { bn: "It must have rained.", en: "It must have rained." } },
        { left: { bn: "আমরা জিততে পারতাম, জিতিনি", en: "we were able to win but did not" }, right: { bn: "We could have won.", en: "We could have won." } },
        { left: { bn: "তোমার ফোন করা উচিত ছিল, করোনি", en: "you ought to have called but did not" }, right: { bn: "You should have called.", en: "You should have called." } },
        { left: { bn: "সে হয়তো বাস মিস করেছে, জানি না", en: "perhaps he missed the bus, I am not sure" }, right: { bn: "He might have missed the bus.", en: "He might have missed the bus." } },
        { left: { bn: "এত তাড়াতাড়ি শেষ করা অসম্ভব", en: "finishing so soon is impossible" }, right: { bn: "She can't have finished yet.", en: "She can't have finished yet." } },
        { left: { bn: "এনেছ, কিন্তু আনার দরকার ছিল না", en: "you brought it, but there was no need" }, right: { bn: "You needn't have brought it.", en: "You needn't have brought it." } },
      ],
    },
    "modals-build": {
      kind: "build",
      title: { bn: "modal সাজাও", en: "Build with the modal" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো modal-এর পরে ক্রিয়াটা খালি আছে কি না।", en: "The words are shuffled. As you build, check the verb after the modal stays bare." },
      pattern: "subject + modal + bare verb  ·  modal + have + V3",
      lines: [
        { target: "You must wear a helmet while batting.", bn: "ব্যাট করার সময় তোমাকে হেলমেট পরতেই হবে।" },
        { target: "Could you pass me the salt, please?", bn: "লবণটা একটু এগিয়ে দেবেন?" },
        { target: "Nanu could climb trees when she was young.", bn: "নানু ছোটবেলায় গাছে চড়তে পারতেন।" },
        { target: "You should have told me earlier.", bn: "তোমার আমাকে আগে বলা উচিত ছিল।" },
        { target: "It might rain, so take an umbrella.", bn: "বৃষ্টি হতে পারে, তাই ছাতা নাও।" },
        { target: "We will be able to play after the exams.", bn: "পরীক্ষার পর আমরা খেলতে পারব।" },
      ],
    },
    "modals-spot": {
      kind: "spot",
      title: { bn: "রাফির নোটিশ, modal-এর ভুল", en: "Rafi's notice: the modal mistakes" },
      note: { bn: "রাফি ক্লাবের জন্য একটা নোটিশ লিখেছে। যে লাইনে modal-এর ভুল, সেটা ছোঁও।", en: "Rafi wrote a notice for the club. Tap every line with a modal mistake." },
      source: { bn: "নোটিশ: ক্লাবের নিয়ম", en: "Notice: club rules" },
      lines: [
        { text: { bn: "All players must arrive by four o'clock.", en: "All players must arrive by four o'clock." } },
        { text: { bn: "Everyone should to wear white during matches.", en: "Everyone should to wear white during matches." }, flag: { bn: "should-এর পরে খালি ক্রিয়া: should wear।", en: "A bare verb after should: should wear." } },
        { text: { bn: "Juniors can plays only on Fridays.", en: "Juniors can plays only on Fridays." }, flag: { bn: "modal-এর পরে টুপি নয়: can play।", en: "No hat after a modal: can play." } },
        { text: { bn: "You don't have to bring your own ball; the club provides one.", en: "You don't have to bring your own ball; the club provides one." } },
        { text: { bn: "Members must not to smoke inside the ground.", en: "Members must not to smoke inside the ground." }, flag: { bn: "must not + খালি ক্রিয়া: must not smoke।", en: "Must not + bare verb: must not smoke." } },
        { text: { bn: "Last year we must cancel two matches because of rain.", en: "Last year we must cancel two matches because of rain." }, flag: { bn: "must-এর অতীত নেই: had to cancel।", en: "Must has no past: had to cancel." } },
        { text: { bn: "If you have any questions, you can ask the coach.", en: "If you have any questions, you can ask the coach." } },
      ],
    },
    "modals-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Transformation: It is necessary for you to practise daily. modal দিয়ে?", en: "Transformation: It is necessary for you to practise daily. With a modal?" },
          options: [
            { text: { bn: "You must practise daily.", en: "You must practise daily." }, right: true, why: { bn: "হ্যাঁ। necessary = must, আর পরে খালি ক্রিয়া।", en: "Yes. Necessary means must, with a bare verb after it." } },
            { text: { bn: "You must to practise daily.", en: "You must to practise daily." }, why: { bn: "না। must-এর পরে to নয়।", en: "No. No to after must." } },
            { text: { bn: "You can practise daily.", en: "You can practise daily." }, why: { bn: "না। can মানে পারা, necessary মানে লাগবেই।", en: "No. Can means able; necessary means required." } },
          ],
        },
        {
          ask: { bn: "Mitu got full marks. She ___ very hard. কোনটা?", en: "Mitu got full marks. She ___ very hard. Which?" },
          options: [
            { text: { bn: "must have studied", en: "must have studied" }, right: true, why: { bn: "হ্যাঁ। প্রমাণ (পুরো নম্বর) থেকে অতীত নিয়ে প্রায় নিশ্চিত অনুমান: must have + V3।", en: "Yes. From evidence (full marks), a near-certain guess about the past: must have + V3." } },
            { text: { bn: "must study", en: "must study" }, why: { bn: "না। কাজটা অতীতে হয়ে গেছে, তাই have + V3।", en: "No. The studying is in the past, so have + V3." } },
            { text: { bn: "should have studied", en: "should have studied" }, why: { bn: "না। should have মানে করা উচিত ছিল, করেনি। সে করেছে, তার প্রমাণ নম্বর।", en: "No. Should have means she ought to have and did not. She did, and the marks prove it." } },
          ],
        },
        {
          ask: { bn: "Which sentence means the same as: Please open the window.", en: "Which sentence means the same as: Please open the window." },
          options: [
            { text: { bn: "Would you mind opening the window?", en: "Would you mind opening the window?" }, right: true, why: { bn: "হ্যাঁ। ভদ্র অনুরোধ, আর mind-এর পরে -ing।", en: "Yes. A polite request, with -ing after mind." } },
            { text: { bn: "Would you mind to open the window?", en: "Would you mind to open the window?" }, why: { bn: "না। mind-এর পরে -ing, to নয়।", en: "No. Mind takes -ing, not to." } },
            { text: { bn: "You must open the window.", en: "You must open the window." }, why: { bn: "না। must হুকুম; please অনুরোধ।", en: "No. Must is an order; please is a request." } },
          ],
        },
        {
          ask: { bn: "Rafi ___ swim across the river yesterday, though the current was strong. কোনটা?", en: "Rafi ___ swim across the river yesterday, though the current was strong. Which?" },
          options: [
            { text: { bn: "could", en: "could" }, why: { bn: "না। অতীতে একবারের সফল কাজে could নয়, was able to। could সাধারণ ক্ষমতার জন্য।", en: "No. A single successful past event takes was able to, not could. Could is for general ability." } },
            { text: { bn: "was able to", en: "was able to" }, right: true, why: { bn: "হ্যাঁ। নির্দিষ্ট একটা ঘটনায় সফল: was able to, বা managed to।", en: "Yes. Succeeding on one particular occasion: was able to, or managed to." } },
            { text: { bn: "can", en: "can" }, why: { bn: "না। yesterday, অতীত।", en: "No. Yesterday is the past." } },
          ],
        },
      ],
    },
    "modals-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "কোনটা ঠিক?", en: "Which is right?" },
          options: [
            { text: { bn: "She can sings well.", en: "She can sings well." }, why: { bn: "না। modal-এর পরে খালি ক্রিয়া, টুপি নেই: can sing।", en: "No. After a modal the verb is bare, no hat: can sing." } },
            { text: { bn: "She can to sing well.", en: "She can to sing well." }, why: { bn: "না। আসল modal-এর পরে কখনো to নয়।", en: "No. A true modal never takes to." } },
            { text: { bn: "She can sing well.", en: "She can sing well." }, right: true, why: { bn: "হ্যাঁ। can + খালি ক্রিয়া।", en: "Yes. Can + bare verb." } },
          ],
        },
        {
          ask: { bn: "Would you mind opening the window? এর ভদ্র 'হ্যাঁ' উত্তর কোনটা?", en: "Would you mind opening the window? Which is the polite yes?" },
          options: [
            { text: { bn: "Yes, I would.", en: "Yes, I would." }, why: { bn: "না। এর মানে 'হ্যাঁ, আমার আপত্তি আছে', মানে খুলব না।", en: "No. That means yes, I do mind, so the window stays shut." } },
            { text: { bn: "No, not at all.", en: "No, not at all." }, right: true, why: { bn: "হ্যাঁ। 'আপত্তি নেই', মানে খুলছি। mind-এর প্রশ্নে উত্তরটা উল্টো।", en: "Yes. No objection, so it gets opened. A mind question turns the answer round." } },
            { text: { bn: "Of course not, never.", en: "Of course not, never." }, why: { bn: "না। এটা শুনলে মনে হবে জানালা খুলতে রাজি না, রেগে গেছ।", en: "No. This sounds like an angry refusal." } },
          ],
        },
        {
          ask: { bn: "When I was small, Nanu ___ tell me a story every night. কোনটা?", en: "When I was small, Nanu ___ tell me a story every night. Which?" },
          options: [
            { text: { bn: "would", en: "would" }, right: true, why: { bn: "হ্যাঁ। অতীতের অভ্যাস: would, used to-র মতো।", en: "Yes. A past habit: would, like used to." } },
            { text: { bn: "will", en: "will" }, why: { bn: "না। when I was small, অতীত।", en: "No. When I was small is the past." } },
            { text: { bn: "should", en: "should" }, why: { bn: "না। should মানে উচিত; এটা অভ্যাস।", en: "No. Should means ought to; this is a habit." } },
          ],
        },
      ],
    },
    "modals-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "নিজের পাঁচটা ক্ষমতা আর তিনটা অক্ষমতা: I can… I can't…", en: "Five things you can do and three you cannot: I can… I can't…" } },
        { text: { bn: "স্কুলের বা বাসার পাঁচটা নিয়ম must আর must not দিয়ে।", en: "Five rules of school or home with must and must not." } },
        { text: { bn: "একজন বন্ধুকে তিনটা উপদেশ should দিয়ে, আর নিজের একটা আফসোস should have দিয়ে।", en: "Three pieces of advice to a friend with should, and one regret of your own with should have." } },
        { text: { bn: "একটা অনুরোধ পাঁচ সুরে, জোরে: Give me… Can you… Could you… Would you mind… May I…", en: "One request in five tones, aloud: Give me… Can you… Could you… Would you mind… May I…" } },
        { text: { bn: "জানালার বাইরে তাকাও আর তিনটা অনুমান: It must be… It might be… It can't be…", en: "Look out of the window and make three guesses: It must be… It might be… It can't be…" } },
        { text: { bn: "নিজের তিনটা don't have to আর তিনটা must not, বাসার নিয়ম নিয়ে।", en: "Three don't have to and three must not sentences about the rules at home." } },
      ],
    },
  },
};
