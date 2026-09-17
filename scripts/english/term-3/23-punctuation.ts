/* ============================================================
   23-punctuation.ts: পর্ব ২৩, যতিচিহ্ন (punctuation).

   One part of the grammar term, gathered into the rung by
   `advanced.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>নানু গল্পের মাঝে বললেন, "চলো, খাই, নানু।" রাফি হাসতে হাসতে বলল, নানু, কমাটা না থাকলে তো তোমাকেই খেতে বলছ! <span lang="en">Let's eat, Nanu</span> আর <span lang="en">Let's eat Nanu</span>: একটা কমার দূরত্ব, একটা জীবন। যতিচিহ্ন ব্যাকরণের ছোট ভাই, কিন্তু লেখায় নম্বর এখানেই ওঠে আর নামে। এই পর্বে সবচেয়ে বেশি লাগা ছয়টা চিহ্ন: কমা, অ্যাপস্ট্রফি, সেমিকোলন, কোলন, উদ্ধৃতি চিহ্ন, আর ড্যাশের বদলে যা লিখবে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>কমা: তালিকায়, দুটো পুরো বাক্যের মাঝে জোড়ার শব্দের আগে, শুরুর অধীন অংশের পরে, বাড়তি তথ্যের দুই পাশে, আর সম্বোধনে।</li>
<li>অ্যাপস্ট্রফি দুই কাজে: মালিকানা (<span lang="en">Rafi's</span>) আর দুটো শব্দ জোড়া (<span lang="en">it's = it is</span>)। বহুবচনে কখনো নয়।</li>
<li>সেমিকোলন: দুটো পুরো বাক্য, ঘনিষ্ঠ, জোড়ার শব্দ ছাড়া। কোলন: এরপর তালিকা বা ব্যাখ্যা।</li>
<li>উদ্ধৃতি চিহ্ন: কারও কথা হুবহু, আর শেষের চিহ্ন ভিতরে।</li>
<li>বড় হাত: বাক্যের শুরু, নাম, <span lang="en">I</span>, দিন, মাস, ভাষা।</li>
</ul>
</div>

${mount("punctuation-pattern")}

<h2>কমার পাঁচটা কাজ</h2>

<ol class="step-list">
<li><strong>তালিকা:</strong> <span lang="en">We need rice, dal, oil and salt.</span> শেষের <span lang="en">and</span>-এর আগে কমা দিলেও চলে, না দিলেও; একটা নিয়ম বেছে সবসময় সেটাই মানো।</li>
<li><strong>দুটো পুরো বাক্য জোড়া:</strong> <span lang="en">and, but, so, or</span>-এর আগে। <span lang="en">Rafi bowled well, but the team lost.</span> পর্ব ১৪।</li>
<li><strong>শুরুর অধীন অংশের পরে:</strong> <span lang="en">Although it rained, we played. When Nanu speaks, everyone listens.</span></li>
<li><strong>বাড়তি তথ্যের দুই পাশে, বন্ধনীর মতো:</strong> <span lang="en">Shakib, our captain, took three wickets.</span> পর্ব ১৯-এর কমা-সহ clause এটাই।</li>
<li><strong>সম্বোধন আর হ্যাঁ/না:</strong> <span lang="en">Let's eat, Nanu. Yes, I am coming. No, thank you.</span></li>
</ol>

<p>আর কমার একটা "না": দুটো পুরো বাক্যের মাঝে শুধু কমা নয়। <span lang="en">It rained, we stayed home</span> ভুল। হয় ফুল স্টপ, নয় <span lang="en">so</span>, নয় সেমিকোলন।</p>

<p>কমা কোথায় <em>বসে না</em>, সেটাও পাঁচটা কাজের মতোই জরুরি। কর্তা আর ক্রিয়ার মাঝে নয়: <span lang="en">The boy who won the race, is my cousin</span> ভুল; <span lang="en">who won the race</span> চেনাচ্ছে, তাই কমা নেই। ক্রিয়া আর কর্মের মাঝে নয়: <span lang="en">She said, that she was tired</span> ভুল, <span lang="en">that</span>-এর আগে কমা বসে না। অধীন অংশ <em>পরে</em> এলে সাধারণত কমা নেই: <span lang="en">We played although it rained.</span> শুরুতে এলে কমা, শেষে এলে নয়: এটাই পরীক্ষার সবচেয়ে ধরা-পড়া নিয়ম।</p>

${mount("punctuation-commas")}

${mount("punctuation-lines")}

<h2>অ্যাপস্ট্রফি: দুই কাজ, একটা ফাঁদ</h2>

<p>প্রথম কাজ, মালিকানা: <span lang="en">Rafi's bat, the cat's tail, my mother's voice</span>। বহুবচন <span lang="en">-s</span>-এর পরে শুধু অ্যাপস্ট্রফি: <span lang="en">the players' bus, my parents' room</span>। দ্বিতীয় কাজ, দুটো শব্দ জোড়া লাগানো: <span lang="en">it's (it is), don't (do not), I'm (I am), they're (they are), who's (who is), you're (you are)</span>।</p>

<p>ফাঁদটা: <strong>বহুবচনে কখনো অ্যাপস্ট্রফি নয়।</strong> <span lang="en">Two mango's</span> ভুল, <span lang="en">two mangoes</span> ঠিক। দোকানের সাইনবোর্ডে এই ভুল এত বেশি যে ইংরেজিতে এর নাম আছে। আর জোড়া: <span lang="en">its/it's, your/you're, their/they're/there, whose/who's</span>। অ্যাপস্ট্রফি থাকলে দুটো শব্দ; খুলে দেখো: <span lang="en">it's raining = it is raining</span>, ঠিক। <span lang="en">the cat licked it's paw = it is paw</span>, অর্থহীন, তাই <span lang="en">its</span>।</p>

<p>মালিকানায় অ্যাপস্ট্রফি কোথায় বসবে, তার একটা যন্ত্র: আগে মালিকটা লেখো, তারপর অ্যাপস্ট্রফি, তারপর <span lang="en">s</span> যদি আগে থেকে <span lang="en">s</span> না থাকে। একটা ছেলে: <span lang="en">boy + ' + s = boy's</span>। অনেক ছেলে: <span lang="en">boys + ' = boys'</span>। অনিয়মিত বহুবচন, যেখানে <span lang="en">s</span> নেই: <span lang="en">children + ' + s = children's, men's, women's</span>। <span lang="en">s</span> দিয়ে শেষ হওয়া নাম: <span lang="en">James's bat</span> বা <span lang="en">James' bat</span>, দুটোই চলে, একটা বেছে সবসময় সেটাই।</p>

${mount("punctuation-apostrophe")}

${mount("punctuation-pairs")}

<h2>সেমিকোলন আর কোলন</h2>

<p>সেমিকোলন (;) একটা ফুল স্টপ যেটা দুটো বাক্যকে হাত ধরিয়ে রাখে: <span lang="en">Rafi bowls; Mitu bats.</span> দুই দিকেই পুরো বাক্য, ঘনিষ্ঠ, জোড়ার শব্দ ছাড়া। <span lang="en">however, therefore, moreover</span>-এর আগে সেমিকোলন, পরে কমা: <span lang="en">It rained; however, we played.</span> কোলন (:) মানে "এই যে, এবার আসছে": তালিকা বা ব্যাখ্যা। <span lang="en">We need three things: rice, dal and salt. Nanu has one rule: no phones at dinner.</span> কোলনের আগে পুরো বাক্য থাকতে হবে।</p>

<p>তিনটা চিহ্নের একটা পরীক্ষা: দুই পাশে কী আছে? দুই পাশেই পুরো বাক্য, আর জোড়ার শব্দ নেই, তাহলে সেমিকোলন। বাঁয়ে পুরো বাক্য, ডানে তালিকা বা ব্যাখ্যা, তাহলে কোলন। বাঁয়ে পুরো বাক্য, ডানে পুরো বাক্য, মাঝে <span lang="en">and/but/so</span>, তাহলে কমা। <span lang="en">We need: rice, dal and salt</span> ভুল, কারণ কোলনের বাঁয়ে <span lang="en">We need</span> পুরো বাক্য নয়। কোলনটা তুলে দাও, বা বাঁয়ে বাক্য পূর্ণ করো: <span lang="en">We need three things: rice, dal and salt.</span></p>

${mount("punctuation-marks")}

${mount("punctuation-gap")}

<h2>উদ্ধৃতি, আর ড্যাশের বদলে</h2>

<p>কারও কথা হুবহু লিখতে উদ্ধৃতি চিহ্ন, আর বলার ক্রিয়ার পরে কমা: <span lang="en">Nanu said, "Sit down and listen."</span> শেষের ফুল স্টপ বা প্রশ্নবোধক উদ্ধৃতির ভিতরে। কথাটা আগে এলে কমা ভিতরে: <span lang="en">"Sit down," said Nanu.</span> পর্ব ১৬-র narration এটা থেকেই শুরু।</p>

<p>উদ্ধৃতির চারটা সাজ, চারটাই পরীক্ষায় আসে। বলার ক্রিয়া আগে: <span lang="en">Nanu said, "Sit down."</span> বলার ক্রিয়া পরে: <span lang="en">"Sit down," said Nanu.</span> বলার ক্রিয়া মাঝে: <span lang="en">"Sit down," said Nanu, "and listen."</span> প্রশ্ন হলে কমার জায়গায় প্রশ্নবোধক, তবু ভিতরে: <span lang="en">"Where are you going?" asked Ma.</span> লক্ষ করো <span lang="en">asked</span> ছোট হাতে, যদিও প্রশ্নবোধকের পরে: প্রশ্নবোধকটা এখানে কমার কাজ করছে, বাক্য শেষ করছে না। আর উদ্ধৃতির ভিতরের প্রথম শব্দ বড় হাতে, কারণ কারও কথা তার নিজের বাক্য।</p>

<p>লম্বা ড্যাশ নিয়ে একটা কথা: অনেকে বাক্যের মাঝে হঠাৎ থামতে বা ব্যাখ্যা ঢোকাতে ড্যাশ ব্যবহার করে। পরীক্ষার লেখায় সেটা এড়াও, কারণ পরীক্ষক ওটাকে অসমাপ্ত বাক্য ভাবতে পারেন। ব্যাখ্যা ঢোকাতে কোলন, আলাদা কথা বলতে কমা বা বন্ধনী, নতুন কথায় ফুল স্টপ। এই তিনটে দিয়ে ড্যাশের সব কাজ হয়ে যায়।</p>

<div class="ex"><b>একটা ক্লাসিক:</b> <span lang="en">A woman without her man is nothing.</span> এবার যতিচিহ্ন বসাও। <span lang="en">A woman, without her man, is nothing.</span> এক মানে। <span lang="en">A woman: without her, man is nothing.</span> উল্টো মানে। একই এগারোটা শব্দ। যতিচিহ্ন শব্দের মালিক।</div>

${mount("punctuation-reveal")}

<h2>বড় হাত: কোথায়, কোথায় নয়</h2>

<p>বড় হাত সাতটা জায়গায়: বাক্যের প্রথম শব্দ; নাম (<span lang="en">Rafi, Dhaka, Padma, Bangladesh</span>); <span lang="en">I</span>, বাক্যের যেখানেই থাকুক; দিন আর মাস (<span lang="en">Friday, March</span>); ভাষা আর জাতি (<span lang="en">Bangla, English, Bangladeshi</span>); ছুটি আর উৎসব (<span lang="en">Eid, Pahela Baishakh</span>); আর উদ্ধৃতির ভিতরের প্রথম শব্দ। কোথায় <em>নয়</em>: ঋতু (<span lang="en">summer, winter</span>), বিষয় যদি ভাষা না হয় (<span lang="en">maths, science</span>, কিন্তু <span lang="en">English</span>), পেশা (<span lang="en">doctor, teacher</span>), আর সাধারণ noun নামের পরে বসলেও (<span lang="en">Padma river</span> নয়, <span lang="en">the Padma</span> বা <span lang="en">the Padma River</span> পুরো নাম হিসেবে)। বাংলায় বড় হাত নেই, তাই এটা পুরোটাই নতুন অভ্যাস, আর punctuation প্রশ্নে সবচেয়ে সস্তা নম্বর।</p>

${mount("punctuation-capitals")}

${mount("punctuation-spot")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Punctuation</span> প্রশ্নে অনুচ্ছেদটা আগে একবার জোরে পড়ো: যেখানে নিঃশ্বাস নিতে হয়, সেখানে কমা বা ফুল স্টপ। তারপর তিনটা খোঁজ: (১) বলার ক্রিয়া (<span lang="en">said, asked, replied</span>) দেখলে উদ্ধৃতি চিহ্ন আর কমা। (২) নাম, <span lang="en">I</span>, দিন, মাস, দেশ দেখলে বড় হাত। (৩) প্রশ্নের ক্রম দেখলে প্রশ্নবোধক। বাড়তি নম্বর: সম্বোধনের কমা, আর <span lang="en">it's/its</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>ফুল স্টপের পরে একটা স্পেস, কমার পরে একটা স্পেস, কমার আগে কোনো স্পেস নয়। <span lang="en">Rafi ,Mitu and I</span> ভুল দেখতে, <span lang="en">Rafi, Mitu and I</span> ঠিক। প্রশ্নবোধক আর বিস্ময়চিহ্ন একটাই: <span lang="en">Really?!!</span> নয়, <span lang="en">Really?</span> চিঠির লেখায় দুটো চিহ্ন একসাথে দিলে পরীক্ষক ভ্রু কোঁচকান।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>পরোক্ষ প্রশ্নে প্রশ্নবোধক নেই। <span lang="en">Ma asked where I was going.</span> এটা একটা বিবৃতি, মা কী জিজ্ঞেস করলেন তার খবর, তাই ফুল স্টপ। <span lang="en">Ma asked, "Where are you going?"</span> এটা হুবহু কথা, তাই প্রশ্নবোধক, ভিতরে। পর্ব ১৬-র reported speech-এ প্রশ্নবোধক সরানোর নিয়মটা এই কারণেই। কৌশল: উদ্ধৃতি চিহ্ন আছে? প্রশ্নবোধক ভিতরে। নেই? প্রশ্নবোধকও নেই।</p>
</div>

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<ol class="step-list">
<li><strong>প্রশ্নটা পড়ো:</strong> সাধারণত "Re-write the passage using punctuation and capital letters where necessary." অনুচ্ছেদটা ছোট হাতে, চিহ্ন ছাড়া।</li>
<li><strong>জোরে পড়ো, বাক্য কাটো:</strong> যেখানে একটা কথা শেষ, সেখানে ফুল স্টপ আর পরের শব্দ বড় হাতে। এটাই অর্ধেক নম্বর।</li>
<li><strong>বলার ক্রিয়া খোঁজো:</strong> <span lang="en">said, asked, replied, told</span>। প্রতিটার সাথে কমা, উদ্ধৃতি চিহ্ন, ভিতরে বড় হাত, শেষে চিহ্ন ভিতরে।</li>
<li><strong>নাম, <span lang="en">I</span>, দিন, মাস, দেশ, ভাষা:</strong> বড় হাত। একটা একটা করে দাগ দাও।</li>
<li><strong>শেষে তিনটা ছোট চিহ্ন:</strong> সম্বোধনের কমা (<span lang="en">Yes, Nanu</span>), শুরুর অধীন অংশের কমা (<span lang="en">When I got home, …</span>), আর অ্যাপস্ট্রফি (<span lang="en">don't, Rafi's</span>)।</li>
<li><strong>লেখা শেষে একবার গোনো:</strong> খোলা উদ্ধৃতি চিহ্ন যতগুলো, বন্ধও ততগুলো।</li>
</ol>

<div class="ex"><b>একটা নমুনা:</b> প্রশ্ন: <span lang="en">rafi said to nanu i cant find my bat where did you keep it nanu smiled and said its under your bed as always</span>। ধাপ: বাক্য কাটো: <span lang="en">rafi said to nanu … / nanu smiled and said …</span>, দুটো বাক্য। বলার ক্রিয়া: <span lang="en">said</span> দুবার, তাই দুটো উদ্ধৃতি। উত্তর: <span lang="en">Rafi said to Nanu, "I can't find my bat. Where did you keep it?" Nanu smiled and said, "It's under your bed, as always."</span> বড় হাত পাঁচটা (<span lang="en">Rafi, Nanu, I, Where, Nanu, It's</span>), অ্যাপস্ট্রফি দুটো, প্রশ্নবোধক ভিতরে, সম্বোধন নয় কিন্তু <span lang="en">as always</span>-এর আগে কমা।</div>

${mount("punctuation-order")}

${mount("punctuation-build")}

${mount("punctuation-exam")}

<div class="checklist">
<p>পর্ব শেষে নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>কমার পাঁচটা কাজ আর তিনটা "না" বলতে পারি?</li>
<li>অ্যাপস্ট্রফির যন্ত্র (মালিক লেখো, অ্যাপস্ট্রফি, s যদি না থাকে) চালাতে পারি?</li>
<li><span lang="en">it's/its, you're/your, they're/their/there</span>: খুলে যাচাই করতে পারি?</li>
<li>সেমিকোলন, কোলন, কমা: দুই পাশে কী আছে দেখে বেছে নিতে পারি?</li>
<li>উদ্ধৃতির চার সাজ, আর প্রশ্নবোধক ভিতরে, মনে আছে?</li>
<li>বড় হাতের সাত জায়গা আর চারটা "নয়" জানি?</li>
</ul>
</div>

${mount("punctuation-drill")}
`,
  blocks: {
    "punctuation-pattern": {
      kind: "pattern",
      title: { bn: "যে চিহ্নগুলো মানে বদলায়", en: "The marks that change the meaning" },
      shape: "Let's eat, Nanu.  ·  It's = it is  ·  its = এর  ·  bowls; bats  ·  three things: …",
      why: { bn: "কমা সম্বোধনকে আলাদা করে। অ্যাপস্ট্রফি হয় মালিকানা, নয় দুটো শব্দ জোড়া, কখনো বহুবচন নয়। সেমিকোলন দুটো পুরো বাক্যের হাত ধরে, কোলন বলে এবার তালিকা আসছে।", en: "A comma sets off the person addressed. An apostrophe is either possession or two words joined, never a plural. A semicolon holds two full sentences together; a colon announces what follows." },
      examples: [
        { target: "Let's eat, Nanu. Let's eat Nanu.", bn: "চলো খাই, নানু। চলো নানুকে খাই। (কমা জীবন বাঁচায়)" },
        { target: "It's raining, and the cat is licking its paw.", bn: "বৃষ্টি হচ্ছে, আর বেড়ালটা তার থাবা চাটছে।" },
        { target: "Rafi bowls; Mitu bats.", bn: "রাফি বল করে; মিতু ব্যাট করে।" },
        { target: "We need three things: rice, dal and salt.", bn: "আমাদের তিনটে জিনিস লাগবে: চাল, ডাল আর লবণ।" },
        { target: "\"Sit down,\" said Nanu, \"and listen.\"", bn: "নানু বললেন, বসো, আর শোনো।" },
      ],
      tip: { bn: "অ্যাপস্ট্রফি দেখলে খুলে দেখো: it's = it is হয় কি না। না হলে its।", en: "See an apostrophe, unpack it: does it's read as it is? If not, its." },
    },
    "punctuation-commas": {
      kind: "bins",
      title: { bn: "কমা বসে, কমা বসে না", en: "Comma, or no comma" },
      note: { bn: "প্রতিটা বাক্যে ___ জায়গায় কমা বসবে কি না, সেই ঘরে ফেলো।", en: "Drop each sentence into the box that says whether a comma goes at ___." },
      bins: [
        { id: "yes", label: { bn: "কমা বসে", en: "comma" } },
        { id: "no", label: { bn: "কমা বসে না", en: "no comma" } },
      ],
      items: [
        { text: { bn: "Although it rained ___ we played.", en: "Although it rained ___ we played." }, bin: "yes", why: { bn: "শুরুর অধীন অংশের পরে কমা।", en: "A comma after an opening dependent clause." } },
        { text: { bn: "We played ___ although it rained.", en: "We played ___ although it rained." }, bin: "no", why: { bn: "অধীন অংশ পরে এলে সাধারণত কমা নেই।", en: "A dependent clause at the end usually takes no comma." } },
        { text: { bn: "Rafi bowled well ___ but the team lost.", en: "Rafi bowled well ___ but the team lost." }, bin: "yes", why: { bn: "দুটো পুরো বাক্য, জোড়ার শব্দের আগে কমা।", en: "Two full sentences: a comma before the joining word." } },
        { text: { bn: "The boy who won the race ___ is my cousin.", en: "The boy who won the race ___ is my cousin." }, bin: "no", why: { bn: "কর্তা আর ক্রিয়ার মাঝে কমা নয়; clause-টা চেনাচ্ছে।", en: "No comma between subject and verb; the clause identifies him." } },
        { text: { bn: "Shakib ___ our captain, took three wickets.", en: "Shakib ___ our captain, took three wickets." }, bin: "yes", why: { bn: "বাড়তি তথ্য, দুই পাশে কমা।", en: "Extra information, commas on both sides." } },
        { text: { bn: "She said ___ that she was tired.", en: "She said ___ that she was tired." }, bin: "no", why: { bn: "that-এর আগে কমা বসে না।", en: "No comma before that." } },
        { text: { bn: "Yes ___ Nanu, I am coming.", en: "Yes ___ Nanu, I am coming." }, bin: "yes", why: { bn: "হ্যাঁ/না আর সম্বোধনের পরে কমা।", en: "A comma after yes or no, and around the person addressed." } },
        { text: { bn: "We bought rice ___ and salt.", en: "We bought rice ___ and salt." }, bin: "no", why: { bn: "দুটো জিনিসের তালিকায় and-এর আগে কমা নয়; তিনটার বেশি হলে তখন প্রশ্ন।", en: "Two items joined by and take no comma; the question only arises with three or more." } },
      ],
    },
    "punctuation-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: কমার থামা", en: "Listen, say: the comma's pause" },
      note: { bn: "যেখানে কমা, সেখানে ছোট্ট থামা। শুনে বোঝো কমা কোথায়।", en: "Where the comma is, a tiny pause. Hear where the commas fall." },
      lines: [
        { target: "Although it rained, we played the whole match.", bn: "যদিও বৃষ্টি হলো, আমরা পুরো ম্যাচ খেললাম।" },
        { target: "Shakib, our captain, took three wickets.", bn: "শাকিব, আমাদের অধিনায়ক, তিন উইকেট নিলেন।" },
        { target: "Yes, Nanu, I am coming.", bn: "হ্যাঁ, নানু, আসছি।" },
        { target: "We bought rice, dal, oil and salt.", bn: "আমরা চাল, ডাল, তেল আর লবণ কিনলাম।" },
        { target: "It rained; however, the match went on.", bn: "বৃষ্টি হলো; তবু ম্যাচ চলল।" },
      ],
    },
    "punctuation-apostrophe": {
      kind: "gap",
      title: { bn: "অ্যাপস্ট্রফির যন্ত্র", en: "The apostrophe machine" },
      note: { bn: "মালিক লেখো, অ্যাপস্ট্রফি, তারপর s যদি আগে থেকে s না থাকে।", en: "Write the owner, the apostrophe, then s unless there is an s already." },
      items: [
        { text: "This is my ___ room.", bn: "এটা আমার বাবা-মায়ের ঘর।", options: ["parents'", "parent's", "parents"], right: 0, why: { bn: "দুজন, বহুবচন parents, তারপর শুধু অ্যাপস্ট্রফি।", en: "Two of them, plural parents, then just the apostrophe." } },
        { text: "The ___ toys were all over the floor.", bn: "বাচ্চাদের খেলনা মেঝেজুড়ে।", options: ["childrens'", "children's", "childrens"], right: 1, why: { bn: "children অনিয়মিত বহুবচন, s নেই, তাই 's।", en: "Children is an irregular plural with no s, so 's." } },
        { text: "I borrowed ___ bat for the match.", bn: "ম্যাচের জন্য রাফির ব্যাট ধার নিলাম।", options: ["Rafis", "Rafi's", "Rafis'"], right: 1, why: { bn: "একজন মালিক: Rafi's।", en: "One owner: Rafi's." } },
        { text: "The ___ nest fell from the tree.", bn: "পাখিটার বাসা গাছ থেকে পড়ল।", options: ["bird's", "birds", "birds'"], right: 0, why: { bn: "একটা পাখির বাসা: bird's।", en: "One bird's nest: bird's." } },
        { text: "I ___ know where she went.", bn: "আমি জানি না সে কোথায় গেল।", options: ["dont", "don't", "do'nt"], right: 1, why: { bn: "do not: হারানো o-র জায়গায় অ্যাপস্ট্রফি।", en: "Do not: the apostrophe sits where the o went." } },
        { text: "There are three ___ in the basket.", bn: "ঝুড়িতে তিনটে আম।", options: ["mango's", "mangoes'", "mangoes"], right: 2, why: { bn: "বহুবচন, মালিকানা নয়: কোনো অ্যাপস্ট্রফি নেই।", en: "A plural, no possession: no apostrophe at all." } },
      ],
    },
    "punctuation-pairs": {
      kind: "compare",
      title: { bn: "যে জোড়াগুলো এক শোনায়", en: "The pairs that sound the same" },
      note: { bn: "অ্যাপস্ট্রফি থাকলে দুটো শব্দ। খুলে দেখো: মানে হয় কি না।", en: "With an apostrophe, it is two words. Unpack it and see whether it still makes sense." },
      columns: [{ bn: "অ্যাপস্ট্রফি: দুটো শব্দ", en: "apostrophe: two words" }, { bn: "অ্যাপস্ট্রফি নেই: একটা শব্দ", en: "no apostrophe: one word" }],
      rows: [
        { label: { bn: "it's / its", en: "it's / its" }, cells: [{ bn: "it's = it is: It's raining.", en: "it's = it is: It's raining." }, { bn: "its = এর: The cat licked its paw.", en: "its = belonging to it: The cat licked its paw." }] },
        { label: { bn: "you're / your", en: "you're / your" }, cells: [{ bn: "you're = you are: You're late.", en: "you're = you are: You're late." }, { bn: "your = তোমার: Your bat is here.", en: "your = belonging to you: Your bat is here." }] },
        { label: { bn: "they're / their / there", en: "they're / their / there" }, cells: [{ bn: "they're = they are: They're coming.", en: "they're = they are: They're coming." }, { bn: "their = তাদের; there = ওখানে: Their bus is there.", en: "their = belonging to them; there = in that place: Their bus is there." }] },
        { label: { bn: "who's / whose", en: "who's / whose" }, cells: [{ bn: "who's = who is: Who's there?", en: "who's = who is: Who's there?" }, { bn: "whose = কার: Whose bat is this?", en: "whose = belonging to whom: Whose bat is this?" }] },
        { label: { bn: "let's / lets", en: "let's / lets" }, cells: [{ bn: "let's = let us: Let's eat, Nanu.", en: "let's = let us: Let's eat, Nanu." }, { bn: "lets = দেয়: Ma lets me go.", en: "lets = allows: Ma lets me go." }] },
      ],
    },
    "punctuation-marks": {
      kind: "match",
      title: { bn: "কোন চিহ্ন, কোন কাজ", en: "Which mark, which job" },
      note: { bn: "প্রতিটা চিহ্নের সাথে তার কাজ মেলাও।", en: "Match each mark to its job." },
      pairs: [
        { left: { bn: "সেমিকোলন ;", en: "semicolon ;" }, right: { bn: "দুটো পুরো বাক্য, ঘনিষ্ঠ, জোড়ার শব্দ ছাড়া", en: "two full sentences, close, with no joining word" } },
        { left: { bn: "কোলন :", en: "colon :" }, right: { bn: "পুরো বাক্যের পরে তালিকা বা ব্যাখ্যা", en: "a list or an explanation after a full sentence" } },
        { left: { bn: "কমা + and/but/so", en: "comma + and/but/so" }, right: { bn: "দুটো পুরো বাক্য জোড়ার শব্দ দিয়ে", en: "two full sentences joined by a word" } },
        { left: { bn: "অ্যাপস্ট্রফি '", en: "apostrophe '" }, right: { bn: "মালিকানা, বা দুটো শব্দ জোড়া", en: "possession, or two words joined" } },
        { left: { bn: "উদ্ধৃতি চিহ্ন \" \"", en: "quotation marks \" \"" }, right: { bn: "কারও কথা হুবহু", en: "somebody's exact words" } },
        { left: { bn: "বন্ধনী ( )", en: "brackets ( )" }, right: { bn: "বাদ দিলেও চলে এমন কথা", en: "an aside the sentence can do without" } },
      ],
    },
    "punctuation-gap": {
      kind: "gap",
      title: { bn: "কোন চিহ্ন, কোন শব্দ", en: "Which mark, which word" },
      items: [
        { text: "The dog wagged ___ tail.", bn: "কুকুরটা তার লেজ নাড়ল।", options: ["it's", "its", "its'"], right: 1, why: { bn: "মালিকানা, it is নয়: its। খুলে দেখো: wagged it is tail? না।", en: "Possession, not it is: its. Unpack it: wagged it is tail? No." } },
        { text: "___ going to rain tonight.", bn: "আজ রাতে বৃষ্টি হবে।", options: ["Its", "It's", "Its'"], right: 1, why: { bn: "It is going: দুটো শব্দ, অ্যাপস্ট্রফি।", en: "It is going: two words, apostrophe." } },
        { text: "I bought two ___ at the market.", bn: "আমি বাজার থেকে দুটো আম কিনলাম।", options: ["mango's", "mangoes", "mangoes'"], right: 1, why: { bn: "বহুবচন, অ্যাপস্ট্রফি নয়: mangoes।", en: "A plural takes no apostrophe: mangoes." } },
        { text: "This is the ___ changing room.", bn: "এটা খেলোয়াড়দের ড্রেসিং রুম।", options: ["players", "player's", "players'"], right: 2, why: { bn: "অনেক খেলোয়াড়ের, বহুবচন + মালিকানা: players'।", en: "Belonging to many players, plural possession: players'." } },
        { text: "Nanu has one rule ___ no phones at dinner.", bn: "নানুর একটা নিয়ম: খাওয়ার সময় ফোন নয়।", options: [",", ";", ":"], right: 2, why: { bn: "এরপর ব্যাখ্যা আসছে, আগে পুরো বাক্য: কোলন।", en: "An explanation follows a full sentence: a colon." } },
        { text: "\"Where are you going ___ asked Ma.", bn: "মা জিজ্ঞেস করলেন, কোথায় যাচ্ছ?", options: ["?\"", "\"?", ",\""], right: 0, why: { bn: "প্রশ্নবোধক উদ্ধৃতির ভিতরে, তারপর চিহ্ন বন্ধ।", en: "The question mark goes inside the quotation, then the closing mark." } },
      ],
    },
    "punctuation-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: একটা চিহ্ন, দুটো মানে", en: "Guess first: one mark, two meanings" },
      ask: { bn: "রাফি মিতুকে লিখল: I love cooking my family and my dog. মিতু হেসে বলল, তুমি তো ভয়ংকর লোক! কোন চিহ্ন বসালে রাফি নিরাপদ?", en: "Rafi wrote to Mitu: I love cooking my family and my dog. Mitu laughed and said, you are a dangerous man! Which mark makes Rafi safe?" },
      choices: [
        { bn: "I love cooking, my family and my dog.", en: "I love cooking, my family and my dog." },
        { bn: "I love cooking my family, and my dog.", en: "I love cooking my family, and my dog." },
        { bn: "I love cooking; my family and my dog.", en: "I love cooking; my family and my dog." },
      ],
      answer: { bn: "I love cooking, my family and my dog.", en: "I love cooking, my family and my dog." },
      why: { bn: "কমা ছাড়া cooking একটা ক্রিয়া আর my family তার কর্ম: পরিবারকে রান্না করা। cooking-এর পরে কমা দিলে তিনটে জিনিসের তালিকা: রান্না, পরিবার, কুকুর। দ্বিতীয়টায় কমা ভুল জায়গায়, পরিবার তখনও রান্না হচ্ছে। তৃতীয়টায় সেমিকোলনের ডান পাশে পুরো বাক্য নেই, তাই সেমিকোলন বসেই না। যতিচিহ্ন ব্যাকরণের ছোট ভাই, কিন্তু এখানে সে-ই মানে ঠিক করে দিল।", en: "Without a comma, cooking is a verb and my family its object: cooking the family. A comma after cooking makes a list of three: cooking, family, dog. The second puts the comma in the wrong place, and the family is still being cooked. The third has no full sentence to the right of the semicolon, so a semicolon cannot go there. Punctuation is grammar's little brother, but here it decides the meaning." },
    },
    "punctuation-capitals": {
      kind: "bins",
      title: { bn: "বড় হাত, ছোট হাত", en: "Capital or small" },
      note: { bn: "বাক্যের মাঝে এই শব্দটা বড় হাতে শুরু হবে, না ছোট হাতে?", en: "In the middle of a sentence, does this word start with a capital or not?" },
      bins: [
        { id: "cap", label: { bn: "বড় হাত", en: "capital" } },
        { id: "small", label: { bn: "ছোট হাত", en: "small" } },
      ],
      items: [
        { text: { bn: "friday", en: "friday" }, bin: "cap", why: { bn: "দিন: Friday।", en: "A day: Friday." } },
        { text: { bn: "summer", en: "summer" }, bin: "small", why: { bn: "ঋতু ছোট হাতে।", en: "Seasons stay small." } },
        { text: { bn: "bangla", en: "bangla" }, bin: "cap", why: { bn: "ভাষা: Bangla।", en: "A language: Bangla." } },
        { text: { bn: "maths", en: "maths" }, bin: "small", why: { bn: "বিষয়, ভাষা নয়: maths।", en: "A subject that is not a language: maths." } },
        { text: { bn: "i", en: "i" }, bin: "cap", why: { bn: "I সবসময় বড়, বাক্যের যেখানেই থাকুক।", en: "I is always capital, wherever it sits." } },
        { text: { bn: "doctor", en: "doctor" }, bin: "small", why: { bn: "পেশা: doctor। নামের সাথে হলে Doctor Rahman।", en: "A job: doctor. Capital only as part of a name, Doctor Rahman." } },
        { text: { bn: "eid", en: "eid" }, bin: "cap", why: { bn: "উৎসব: Eid।", en: "A festival: Eid." } },
        { text: { bn: "march (মাস)", en: "march (the month)" }, bin: "cap", why: { bn: "মাস: March। কিন্তু march = মার্চ করা, ছোট।", en: "The month: March. The verb march stays small." } },
        { text: { bn: "river", en: "river" }, bin: "small", why: { bn: "সাধারণ noun। the Padma-র সাথে পুরো নাম হলে the Padma River।", en: "A common noun. Capital only inside a full name, the Padma River." } },
      ],
    },
    "punctuation-spot": {
      kind: "spot",
      title: { bn: "রাফির চিঠি", en: "Rafi's letter" },
      note: { bn: "যে লাইনে যতিচিহ্নের ভুল, সেটা ছোঁও।", en: "Tap every line with a punctuation mistake." },
      source: { bn: "মামাকে লেখা চিঠি, খসড়া", en: "A draft letter to Mama" },
      lines: [
        { text: { bn: "Dear Mama, I hope you are well.", en: "Dear Mama, I hope you are well." } },
        { text: { bn: "Last friday we went to the stadium with nanu.", en: "Last friday we went to the stadium with nanu." }, flag: { bn: "Friday আর Nanu বড় হাতে: দিন আর নাম।", en: "Friday and Nanu take capitals: a day and a name." } },
        { text: { bn: "Shakib, our captain, scored a century.", en: "Shakib, our captain, scored a century." } },
        { text: { bn: "It was so exciting, everyone was shouting.", en: "It was so exciting, everyone was shouting." }, flag: { bn: "দুটো পুরো বাক্য শুধু কমায় নয়: ফুল স্টপ, so বা সেমিকোলন।", en: "Two full sentences cannot share a bare comma: a full stop, so, or a semicolon." } },
        { text: { bn: "Nanu said, \"This is the best day of my life.\"", en: "Nanu said, \"This is the best day of my life.\"" } },
        { text: { bn: "The teams bus was late, so we waited.", en: "The teams bus was late, so we waited." }, flag: { bn: "দলের বাস, মালিকানা: team's।", en: "The team's bus, possession: team's." } },
        { text: { bn: "Its a memory I will keep forever.", en: "Its a memory I will keep forever." }, flag: { bn: "It is a memory: It's।", en: "It is a memory: It's." } },
        { text: { bn: "Your loving nephew, Rafi", en: "Your loving nephew, Rafi" } },
      ],
    },
    "punctuation-order": {
      kind: "order",
      title: { bn: "হলে বসে: ছয় ধাপ", en: "In the exam room: six steps" },
      note: { bn: "চিহ্নহীন অনুচ্ছেদ পেলে যে ক্রমে কাজ করবে, সাজাও।", en: "Put in order the steps you take on an unpunctuated passage." },
      items: [
        { text: { bn: "একবার জোরে পড়ে বাক্য কাটো: ফুল স্টপ আর পরের শব্দ বড় হাতে", en: "Read it aloud once and cut the sentences: full stops, and a capital on the next word" } },
        { text: { bn: "বলার ক্রিয়া খোঁজো (said, asked): কমা, উদ্ধৃতি চিহ্ন, ভিতরে বড় হাত", en: "Find the saying verbs (said, asked): comma, quotation marks, a capital inside" } },
        { text: { bn: "নাম, I, দিন, মাস, দেশ, ভাষা: বড় হাত", en: "Names, I, days, months, countries, languages: capitals" } },
        { text: { bn: "প্রশ্নের ক্রম দেখলে প্রশ্নবোধক, উদ্ধৃতির ভিতরে", en: "Question order means a question mark, inside the quotation" } },
        { text: { bn: "ছোট চিহ্ন: সম্বোধনের কমা, শুরুর অধীন অংশের কমা, অ্যাপস্ট্রফি", en: "The small marks: the comma of address, the comma after an opening clause, apostrophes" } },
        { text: { bn: "খোলা আর বন্ধ উদ্ধৃতি চিহ্ন গুনে মেলাও", en: "Count the opening and closing quotation marks and make them match" }, why: { bn: "প্রথম ধাপেই অর্ধেক নম্বর, কারণ বাক্য কাটাটাই পরীক্ষক আগে দেখেন। শেষ ধাপটা এক মিনিটের, আর সবচেয়ে বেশি ভুলে যাওয়া।", en: "Half the marks are in the first step, because cutting the sentences is what the examiner checks first. The last step takes a minute and is the most often forgotten." } },
      ],
    },
    "punctuation-build": {
      kind: "build",
      title: { bn: "শব্দ সাজাও: চিহ্ন যেখানে বসে", en: "Build it: where the marks sit" },
      note: { bn: "চিহ্নগুলো শব্দের গায়ে লেগে আছে। সাজানোর সময় দেখো কমা কোন শব্দের পিছনে, আর উদ্ধৃতি কোথায় খোলে।", en: "The marks are attached to their words. As you build, watch which word the comma follows and where the quotation opens." },
      pattern: "Name said, \"Capital … .\"  ·  \"…,\" said Name.  ·  Opening clause, main clause.",
      lines: [
        { target: "Nanu said, \"Sit down and listen.\"", bn: "নানু বললেন, বসো আর শোনো।" },
        { target: "\"Where are you going?\" asked Ma.", bn: "মা জিজ্ঞেস করলেন, কোথায় যাচ্ছ?" },
        { target: "Although it rained, we played the match.", bn: "যদিও বৃষ্টি হলো, আমরা ম্যাচটা খেললাম।" },
        { target: "We need three things: rice, dal and salt.", bn: "আমাদের তিনটে জিনিস লাগবে: চাল, ডাল আর লবণ।" },
        { target: "Rafi bowled well, but the team lost.", bn: "রাফি ভালো বল করল, কিন্তু দল হারল।" },
        { target: "Yes, Nanu, it's under my bed.", bn: "হ্যাঁ, নানু, এটা আমার খাটের নিচে।" },
      ],
    },
    "punctuation-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "তিনটা প্রশ্ন, প্রতিটায় একটা লাইনের ঠিক সাজ বেছে নাও।", en: "Three questions; pick the correctly punctuated line each time." },
      questions: [
        {
          ask: { bn: "কোন লাইনটা ঠিক?", en: "Which line is right?" },
          options: [
            { text: { bn: "\"Where is my bat\"? asked Rafi.", en: "\"Where is my bat\"? asked Rafi." }, why: { bn: "না। প্রশ্নবোধক উদ্ধৃতির ভিতরে।", en: "No. The question mark goes inside the quotation." } },
            { text: { bn: "\"Where is my bat?\" asked Rafi.", en: "\"Where is my bat?\" asked Rafi." }, right: true, why: { bn: "হ্যাঁ। প্রশ্নবোধক ভিতরে, asked ছোট হাতে, কারণ বাক্য শেষ হয়নি।", en: "Yes. Question mark inside, asked in small letters because the sentence has not ended." } },
            { text: { bn: "\"Where is my bat?\" Asked Rafi.", en: "\"Where is my bat?\" Asked Rafi." }, why: { bn: "না। asked বড় হাতে নয়; প্রশ্নবোধকটা এখানে কমার কাজ করছে।", en: "No. Asked takes no capital; the question mark is doing a comma's job here." } },
          ],
        },
        {
          ask: { bn: "Ma asked where I was going. এই বাক্যের শেষে কী?", en: "Ma asked where I was going. What ends this sentence?" },
          options: [
            { text: { bn: "প্রশ্নবোধক, কারণ asked আছে", en: "A question mark, because of asked" }, why: { bn: "না। এটা পরোক্ষ প্রশ্ন, মা কী জিজ্ঞেস করলেন তার খবর, একটা বিবৃতি।", en: "No. This is an indirect question, a report of what Ma asked, a statement." } },
            { text: { bn: "ফুল স্টপ", en: "A full stop" }, right: true, why: { bn: "হ্যাঁ। উদ্ধৃতি চিহ্ন নেই, তাই প্রশ্নবোধকও নেই। হুবহু কথা হলে Ma asked, \"Where are you going?\"", en: "Yes. No quotation marks, so no question mark. The exact words would be Ma asked, \"Where are you going?\"" } },
            { text: { bn: "কোলন, কারণ ব্যাখ্যা আসছে", en: "A colon, because an explanation follows" }, why: { bn: "না। কোলনের পরে কিছুই নেই; বাক্যটা going-এ শেষ।", en: "No. Nothing follows a colon here; the sentence ends at going." } },
          ],
        },
        {
          ask: { bn: "দুটো বাক্য: It rained. We played. এক করতে কোনটা ঠিক?", en: "Two sentences: It rained. We played. Which joins them correctly?" },
          options: [
            { text: { bn: "It rained, we played.", en: "It rained, we played." }, why: { bn: "না। দুটো পুরো বাক্যের মাঝে শুধু কমা নয়।", en: "No. Two full sentences cannot share a bare comma." } },
            { text: { bn: "It rained; we played.", en: "It rained; we played." }, right: true, why: { bn: "হ্যাঁ। সেমিকোলন দুটো পুরো বাক্যের হাত ধরে। It rained, but we played-ও ঠিক।", en: "Yes. A semicolon holds two full sentences. It rained, but we played is also right." } },
            { text: { bn: "It rained: we played.", en: "It rained: we played." }, why: { bn: "না। কোলনের পরে তালিকা বা ব্যাখ্যা আসে; খেলাটা বৃষ্টির ব্যাখ্যা নয়।", en: "No. A colon introduces a list or an explanation; playing does not explain the rain." } },
          ],
        },
      ],
    },
    "punctuation-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো, হাতে লেখো", en: "Say it, write it" },
      steps: [
        { text: { bn: "একটা অনুচ্ছেদ খাতায় লেখো যতিচিহ্ন ছাড়া, তারপর জোরে পড়ে কমা আর ফুল স্টপ বসাও।", en: "Write a paragraph with no punctuation, then read it aloud and put in the commas and full stops." } },
        { text: { bn: "পাঁচটা it's আর পাঁচটা its বাক্য, প্রতিটা খুলে যাচাই করো।", en: "Five it's and five its sentences, unpacking each to check." } },
        { text: { bn: "কোনো সাইনবোর্ড বা মেনুতে অ্যাপস্ট্রফির ভুল খোঁজো। পেলে ছবি তোলো; এটা একটা খেলা।", en: "Hunt for a stray apostrophe on a signboard or a menu. Photograph it; it is a game." } },
        { text: { bn: "একটা কথোপকথন চার সাজে লেখো: said আগে, said পরে, said মাঝে, আর একটা প্রশ্ন।", en: "Write one exchange in the four layouts: said before, said after, said in the middle, and one question." } },
        { text: { bn: "খেলা: একজন একটা বাক্য বলবে, অন্যজন বলবে কোথায় কোন চিহ্ন (কমা, সেমিকোলন, কোলন) আর কেন। দশটা।", en: "A game: one says a sentence, the other names every mark in it (comma, semicolon, colon) and why. Ten of them." } },
        { text: { bn: "গত বছরের প্রশ্নপত্রের punctuation অংশটা ছয় ধাপে করো, সময় ধরে, আর শেষে উদ্ধৃতি চিহ্ন গোনো।", en: "Do last year's punctuation question in the six steps, against the clock, and count the quotation marks at the end." } },
      ],
    },
  },
};
