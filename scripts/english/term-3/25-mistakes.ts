/* ============================================================
   25-mistakes.ts: পর্ব ২৫, পঁচিশটা ফাঁদ আর খাতার মানচিত্র
   (the term's closing part).

   One part of the grammar term, gathered into the rung by
   `advanced.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.

   `scripts/check-english.ts` reads the "খাতার ত্রিশ দিন" table below
   to prove every workbook day maps to a part exactly once: keep
   its <td>day</td><td>parts</td> rows, and put no other table of
   that shape in this part.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>এই টার্মের শেষ পর্ব, আর এটা নতুন কোনো নিয়ম নয়। এটা একটা আয়না। বাংলা থেকে ইংরেজিতে যাওয়ার পথে যে ভুলগুলো প্রায় সবাই করে, কারণ বাংলা একভাবে ভাবে আর ইংরেজি আরেকভাবে, সেগুলো একটা তালিকায়। পঁচিশটা, আর প্রতিটার পাশে কোন পর্বে নিয়মটা আছে। মিতু আপু বলে, পরীক্ষার আগের রাতে পুরো বই নয়, এই তালিকাটা পড়ো। আর পর্বের শেষে খাতার ত্রিশ দিনের মানচিত্র: কোন দিন কোন পর্বের সাথে মেলে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বেশিরভাগ ভুল বাংলার ছাঁচ ইংরেজিতে বসানো থেকে: "আমি ছাত্র" থেকে <span lang="en">I student</span>।</li>
<li>বাকিগুলো ইংরেজির নিজের অদ্ভুত নিয়ম: <span lang="en">-s</span>, <span lang="en">a/the</span>, <span lang="en">in/on/at</span>।</li>
<li>প্রতিটা ফাঁদ একবার চিনলে আর পড়তে হয় না। চেনাটাই কাজ।</li>
<li>খাতার ত্রিশ দিন এই পঁচিশ পর্বের উপর দিয়েই হাঁটে, বেসিক থেকে উচ্চতর।</li>
</ul>
</div>

${mount("mistakes-pattern")}

<h2>পঁচিশটা ফাঁদ</h2>

<div class="table-scroll">
<table>
<thead><tr><th>#</th><th>ভুল</th><th>ঠিক</th><th>কেন</th><th>পর্ব</th></tr></thead>
<tbody>
<tr><td>১</td><td><span lang="en">I student.</span></td><td><span lang="en">I am a student.</span></td><td>বাংলার লুকানো 'হয়' ইংরেজিতে বলতেই হয়</td><td>১</td></tr>
<tr><td>২</td><td><span lang="en">many informations</span></td><td><span lang="en">much information</span></td><td>গোনা যায় না</td><td>২</td></tr>
<tr><td>৩</td><td><span lang="en">Me and Rafi went.</span></td><td><span lang="en">Rafi and I went.</span></td><td>কর্তা হলে I</td><td>৩</td></tr>
<tr><td>৪</td><td><span lang="en">I go to the school.</span></td><td><span lang="en">I go to school.</span></td><td>প্রতিষ্ঠান হিসেবে, the নয়</td><td>৪</td></tr>
<tr><td>৫</td><td><span lang="en">more taller</span></td><td><span lang="en">taller</span></td><td>একটাই তুলনা</td><td>৫</td></tr>
<tr><td>৬</td><td><span lang="en">She play cricket.</span></td><td><span lang="en">She plays cricket.</span></td><td>একজন, টুপি</td><td>৬</td></tr>
<tr><td>৭</td><td><span lang="en">I am knowing him.</span></td><td><span lang="en">I know him.</span></td><td>অবস্থার ক্রিয়ায় -ing নয়</td><td>৭</td></tr>
<tr><td>৮</td><td><span lang="en">He plays good.</span></td><td><span lang="en">He plays well.</span></td><td>কাজের রং adverb</td><td>৮</td></tr>
<tr><td>৯</td><td><span lang="en">good in English</span></td><td><span lang="en">good at English</span></td><td>বাঁধা জোড়া</td><td>৯</td></tr>
<tr><td>১০</td><td><span lang="en">discuss about it</span></td><td><span lang="en">discuss it</span></td><td>বাড়তি preposition</td><td>৯</td></tr>
<tr><td>১১</td><td><span lang="en">You are ready?</span></td><td><span lang="en">Are you ready?</span></td><td>শব্দ উল্টাতে হয়</td><td>১০</td></tr>
<tr><td>১২</td><td><span lang="en">I have seen him yesterday.</span></td><td><span lang="en">I saw him yesterday.</span></td><td>বন্ধ সময়ে সেতু নয়</td><td>১১</td></tr>
<tr><td>১৩</td><td><span lang="en">since two days</span></td><td><span lang="en">for two days</span></td><td>দৈর্ঘ্যে for</td><td>১১</td></tr>
<tr><td>১৪</td><td><span lang="en">He can plays.</span></td><td><span lang="en">He can play.</span></td><td>modal-এর পরে খালি</td><td>১২</td></tr>
<tr><td>১৫</td><td><span lang="en">Does he plays?</span></td><td><span lang="en">Does he play?</span></td><td>একটাই টুপি</td><td>১৩</td></tr>
<tr><td>১৬</td><td><span lang="en">Although … but …</span></td><td><span lang="en">Although …, …</span></td><td>একটাই জোড়ার শব্দ</td><td>১৪</td></tr>
<tr><td>১৭</td><td><span lang="en">The window was broke.</span></td><td><span lang="en">The window was broken.</span></td><td>passive-এ V3</td><td>১৫</td></tr>
<tr><td>১৮</td><td><span lang="en">She told that …</span></td><td><span lang="en">She said that …</span></td><td>tell-এর পরে কাকে</td><td>১৬</td></tr>
<tr><td>১৯</td><td><span lang="en">If it will rain …</span></td><td><span lang="en">If it rains …</span></td><td>if-এর ঘরে will নয়</td><td>১৭</td></tr>
<tr><td>২০</td><td><span lang="en">I enjoy to play.</span></td><td><span lang="en">I enjoy playing.</span></td><td>enjoy + -ing</td><td>১৮</td></tr>
<tr><td>২১</td><td><span lang="en">the bat which I bought it</span></td><td><span lang="en">the bat which I bought</span></td><td>which-ই কর্ম, it বাড়তি</td><td>১৯</td></tr>
<tr><td>২২</td><td><span lang="en">Every students are …</span></td><td><span lang="en">Every student is …</span></td><td>every + একবচন</td><td>২০</td></tr>
<tr><td>২৩</td><td><span lang="en">I cut my hair yesterday.</span></td><td><span lang="en">I had my hair cut.</span></td><td>করানো, করা নয়</td><td>২১</td></tr>
<tr><td>২৪</td><td><span lang="en">Never I have seen …</span></td><td><span lang="en">Never have I seen …</span></td><td>শুরুতে নিলে উল্টাতে হয়</td><td>২২</td></tr>
<tr><td>২৫</td><td><span lang="en">it's paw / two mango's</span></td><td><span lang="en">its paw / two mangoes</span></td><td>অ্যাপস্ট্রফি মালিকানা বা জোড়া</td><td>২৩</td></tr>
</tbody>
</table>
</div>

${mount("mistakes-spot")}

<h2>কেন এগুলোই</h2>

<p>তালিকাটা দেখলে একটা ছবি ফোটে। অর্ধেকের বেশি ভুল বাংলার অভ্যাস: বাংলায় "হয়" লুকায়, article নেই, প্রশ্ন সুরে হয়, "যদিও… তবুও" দুটোই বসে, "দুই দিন থেকে" বলা যায়। এগুলো বুদ্ধির ভুল নয়, মাতৃভাষার ছায়া। ছায়াটা চিনলে সরানো যায়। বাকি ভুলগুলো ইংরেজির নিজের খেয়াল: <span lang="en">-s</span> এক জায়গায় বসে অন্য জায়গায় নয়, <span lang="en">enjoy</span> একরকম চায় আর <span lang="en">want</span> আরেকরকম। এগুলো মুখস্থ, আর মুখস্থ মানে ব্যবহার, দশবার।</p>

<p>দুই দলের দুই ওষুধ, আর সেটাই এই ভাগটা করার কারণ। বাংলার ছায়ার ওষুধ <em>অনুবাদ থামানো</em>: বাক্যটা বাংলায় ভেবে তারপর ইংরেজিতে বসালে ছায়া সাথে আসে; ইংরেজির ছাঁচটা সরাসরি মুখস্থ থাকলে আসে না। তাই এই টার্মের প্রতিটা পর্বে <span lang="en">lines</span> ব্লক: কানে ছাঁচ বসানো, যাতে ভাবতে না হয়। ইংরেজির খেয়ালের ওষুধ <em>তালিকা</em>: রেবেল ক্রিয়া, <span lang="en">-ing</span> ক্রিয়া, বাঁধা preposition জোড়া, এগুলো যুক্তি দিয়ে বের হয় না, খাতার সংগ্রহ থেকে বের হয়। কোন ভুল কোন দলের, সেটা জানলে কোন ওষুধ, সেটাও জানা।</p>

${mount("mistakes-shadow")}

<div class="table-scroll">
<table>
<thead><tr><th>বাংলা যেভাবে ভাবে</th><th>ইংরেজি যেভাবে ভাবে</th><th>ফাঁদ</th></tr></thead>
<tbody>
<tr><td>'হয়' লুকিয়ে থাকে: আমি ছাত্র</td><td><span lang="en">be</span> বলতেই হয়: <span lang="en">I am a student</span></td><td>১</td></tr>
<tr><td>article নেই: বই পড়ি</td><td>প্রতিটা একবচন noun-এর সামনে কিছু একটা: <span lang="en">a book, the book</span></td><td>৪</td></tr>
<tr><td>প্রশ্ন সুরে: তুমি রেডি?</td><td>প্রশ্ন শব্দ উল্টে: <span lang="en">Are you ready?</span></td><td>১১</td></tr>
<tr><td>জোড়ার শব্দ দুটো: যদিও… তবুও…</td><td>একটাই: <span lang="en">Although …, …</span></td><td>১৬</td></tr>
<tr><td>'থেকে' দৈর্ঘ্যেও: দুই দিন থেকে</td><td>দৈর্ঘ্যে <span lang="en">for</span>, শুরুতে <span lang="en">since</span></td><td>১৩</td></tr>
<tr><td>একটাই ক্রিয়া করা আর করানোয়: কাটলাম / কাটালাম</td><td>ছাঁচ বদলায়: <span lang="en">I cut / I had it cut</span></td><td>২৩</td></tr>
<tr><td>বলল = said = told</td><td><span lang="en">tell</span>-এর পরে কাকে, <span lang="en">say</span>-এর পরে নয়</td><td>১৮</td></tr>
</tbody>
</table>
</div>

${mount("mistakes-parts")}

${mount("mistakes-lines")}

<h2>নিজের ভুল নিজে ধরা: লাল কালির নিয়ম</h2>

<p>এই টার্মের শেষে একটা দক্ষতাই সবচেয়ে দামি: নিজের লেখা নিজে দেখা। শিক্ষক পরীক্ষার হলে থাকেন না, তালিকাটা থাকে। তাই একটা নিয়ম, যেটা লেখা শেষের পাঁচ মিনিটে চলে, প্রতিবার একই ক্রমে। প্রথমে ক্রিয়া: প্রতিটা ক্রিয়ায় আঙুল রেখে তিনটা প্রশ্ন, কাল ঠিক? কর্তার সাথে মিলছে? আগের শব্দ (modal, have, preposition) কী চায়? তারপর noun: প্রতিটা একবচন noun-এর সামনে <span lang="en">a/the</span> বা কিছু একটা আছে? গোনা যায় না এমন noun-এ <span lang="en">-s</span> বসেনি তো? তারপর ছোট শব্দ: preposition জোড়া (<span lang="en">good at, depend on, listen to</span>), <span lang="en">since/for</span>, <span lang="en">tell/say</span>। শেষে চিহ্ন: প্রশ্নবোধক, বড় হাত, অ্যাপস্ট্রফি। চার পাক, পাঁচ মিনিট, আর তালিকার বেশিরভাগ ফাঁদ এই চার পাকেই ধরা পড়ে।</p>

${mount("mistakes-redpen")}

${mount("mistakes-gap")}

${mount("mistakes-reveal")}

<h2>খাতার ত্রিশ দিন, এই পঁচিশ পর্বের উপরে</h2>

<p>এই টার্মের <a href="/english/term-3/workbook">ত্রিশ দিনের খাতা</a> একটা করে নিয়ম নিয়ে একটা করে পাতা। প্রতিদিনের পাতায় দিনের ছাঁচ, পাঁচটা লাইন শোনার আর বলার জন্য, শব্দ সাজানোর খেলা, নিজের আটটা বাক্য, ছয়টা ফাঁকা ঘর ভরানো, ছয়টা অনুবাদ, আর একটা সত্যি অনুচ্ছেদ। কোন দিন কোন পর্বের সাথে:</p>

<div class="table-scroll">
<table>
<thead><tr><th>দিন</th><th>পর্ব</th><th>বিষয়</th></tr></thead>
<tbody>
<tr><td>১ থেকে ২</td><td>১, ২</td><td>আটজন খেলোয়াড়, noun</td></tr>
<tr><td>৩ থেকে ৪</td><td>৩, ৪</td><td>pronoun, article</td></tr>
<tr><td>৫ থেকে ৬</td><td>৫, ৬</td><td>adjective, তুলনা, -s এর নিয়ম</td></tr>
<tr><td>৭ থেকে ৯</td><td>৭</td><td>টাইম মেশিন, তিন দিন</td></tr>
<tr><td>১০ থেকে ১২</td><td>৮, ৯, ১০</td><td>adverb, preposition, বাক্যের চার রকম</td></tr>
<tr><td>১৩ থেকে ১৪</td><td>১১</td><td>perfect কাল</td></tr>
<tr><td>১৫ থেকে ১৬</td><td>১২, ১৩</td><td>modal, প্রশ্ন আর লেজ</td></tr>
<tr><td>১৭ থেকে ১৮</td><td>১৪, ১৫</td><td>জোড়া, passive</td></tr>
<tr><td>১৯ থেকে ২১</td><td>১৬, ১৭, ১৮</td><td>reported speech, if, -ing নাকি to</td></tr>
<tr><td>২২ থেকে ২৪</td><td>১৯, ২০, ২১</td><td>relative, determiner, causative</td></tr>
<tr><td>২৫ থেকে ২৭</td><td>২২, ২৩</td><td>জোর, যতিচিহ্ন</td></tr>
<tr><td>২৮ থেকে ৩০</td><td>২৪, ২৫</td><td>পরীক্ষার হল, ফাঁদের তালিকা, সব একসাথে</td></tr>
</tbody>
</table>
</div>

<h2>পরীক্ষার আগের সাত দিন</h2>

<p>টার্ম শেষ, খাতা শেষ, পরীক্ষা সামনে। শেষ সপ্তাহটা নতুন কিছু শেখার নয়, যা আছে সেটা হাতের নাগালে আনার। একটা ছক, প্রতিদিন আধ ঘণ্টা। <strong>দিন ১:</strong> পঁচিশটা ফাঁদ জোরে পড়ো, নিজে যেগুলোয় পড়ো সেগুলোয় দাগ দাও; সাধারণত পাঁচ-ছয়টা। <strong>দিন ২:</strong> দাগ দেওয়া ফাঁদগুলোর পর্বে ফিরে শুধু <span lang="en">lines</span> আর <span lang="en">gap</span> ব্লক দুটো আবার করো। <strong>দিন ৩:</strong> পর্ব ২৪-এর পাঁচ প্রশ্নের ধাপগুলো না দেখে লেখো, তারপর মিলিয়ে দেখো। <strong>দিন ৪:</strong> গত বছরের একটা প্রশ্নপত্র, সময় ধরে। <strong>দিন ৫:</strong> সেটার ভুলগুলো ফাঁদের নম্বর দিয়ে চিহ্নিত করো; একই ফাঁদে দুবার পড়লে সেই পর্বের <span lang="en">spot</span> ব্লক। <strong>দিন ৬:</strong> খাতার সংগ্রহ: রেবেল ক্রিয়া, <span lang="en">-ing</span> ক্রিয়া, preposition জোড়া, একবার পড়ো। <strong>দিন ৭:</strong> কিছু না। ঘুমাও। যে মাথা বিশ্রাম পেয়েছে, সে-ই ফাঁদ দেখতে পায়।</p>

${mount("mistakes-week")}

<h2>এরপর</h2>

<p>ব্যাকরণ শেখা শেষ হয় না, কিন্তু ব্যাকরণ <em>ভয়</em> পাওয়া শেষ হয়। এই টার্মের পরে যেকোনো ইংরেজি বাক্য দেখে বলতে পারবে কে কী করছে, আর নিজের বাক্যের ভুল নিজে ধরতে পারবে। সেটাই দরকার ছিল। এবার তিনটে কাজ। রোজ একটা সত্যিকারের ইংরেজি জিনিস পড়ো, খবর, ধারাভাষ্য, যা খুশি, আর প্রতিটা বাক্যে একটা করে নিয়ম চেনো। রোজ দুই মিনিট নিজেকে রেকর্ড করো আর নিজের ফাঁদ নিজে ধরো। আর <a href="/english/term-2">টার্ম ২</a>-তে ফিরে যাও, যেখানে এই নিয়মগুলো দিয়ে দুই মিনিট একটানা কথা বলা শেখানো হয়: ব্যাকরণ জানার পর সেই টার্মটা অন্য রকম লাগবে।</p>

${mount("mistakes-build")}

${mount("mistakes-letter")}

${mount("mistakes-exam")}

${mount("mistakes-quiz")}

<div class="checklist">
<p>শেষের সপ্তাহের তালিকা:</p>
<ul>
<li>পঁচিশটা ফাঁদ একবার জোরে পড়া, আর যেগুলোয় নিজে পড়ি সেগুলোয় দাগ দেওয়া</li>
<li>খাতার সংগ্রহে রেবেল ক্রিয়াগুলো তিন রূপে টুকে রাখা</li>
<li>গত বছরের একটা প্রশ্নপত্রের ব্যাকরণ অংশ সময় ধরে করা</li>
<li>নিজের একটা লেখা নিয়ে নিজেই স্যার সাজা: লাল কালিতে ভুল খোঁজা</li>
<li>একজনকে এই টার্মের একটা নিয়ম শেখানো, কারণ যে শেখায় সে দুবার শেখে</li>
</ul>
</div>

${mount("mistakes-drill")}
`,
  blocks: {
    "mistakes-pattern": {
      kind: "pattern",
      title: { bn: "যে ছায়াটা বাংলা ফেলে", en: "The shadow Bangla casts" },
      shape: "বাংলার ছাঁচ ≠ ইংরেজির ছাঁচ:  I am a student  ·  Are you ready?  ·  for two days  ·  Although …, …",
      why: { bn: "বেশিরভাগ ভুল বুদ্ধির নয়, মাতৃভাষার। বাংলায় যেটা লুকায় (হয়), ইংরেজিতে সেটা বলতে হয়; বাংলায় যেটা দুবার বসে (যদিও… তবুও), ইংরেজিতে একবার। ছায়াটা চিনলেই সরানো যায়।", en: "Most mistakes are not the mind's but the mother tongue's. What Bangla hides (the verb be) English must say; what Bangla doubles (although … yet) English says once. Recognise the shadow and it lifts." },
      examples: [
        { target: "I am a student. I am not a student. Am I a student?", bn: "আমি ছাত্র। আমি ছাত্র নই। আমি কি ছাত্র?" },
        { target: "I have lived here for two years, since 2024.", bn: "আমি দুই বছর ধরে, ২০২৪ থেকে, এখানে থাকি।" },
        { target: "Although it rained, we played.", bn: "যদিও বৃষ্টি হলো, আমরা খেললাম। (একটাই জোড়ার শব্দ)" },
        { target: "She plays well and speaks English well.", bn: "সে ভালো খেলে আর ভালো ইংরেজি বলে।" },
      ],
      tip: { bn: "পরীক্ষার আগের রাতে পুরো বই নয়, এই পঁচিশটার তালিকা।", en: "The night before the exam, not the whole book: this list of twenty-five." },
    },
    "mistakes-spot": {
      kind: "spot",
      title: { bn: "রাফির অনুচ্ছেদ, শেষ পরীক্ষা", en: "Rafi's paragraph, the final test" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে ফাঁদ, সেটা ছোঁও। কোন পর্বের ফাঁদ, মনে করো।", en: "Take the red pen. Tap every line with a trap, and recall which part it belongs to." },
      source: { bn: "রচনা: আমার প্রিয় খেলা", en: "Essay: my favourite game" },
      lines: [
        { text: { bn: "Cricket is my favourite game, and I play it every Friday.", en: "Cricket is my favourite game, and I play it every Friday." } },
        { text: { bn: "My cousin Rafi play with me.", en: "My cousin Rafi play with me." }, flag: { bn: "একজন, বর্তমান: plays। পর্ব ৬।", en: "One person in the present: plays. Part 6." } },
        { text: { bn: "We are good in bowling but weak in batting.", en: "We are good in bowling but weak in batting." }, flag: { bn: "good at, weak at। পর্ব ৯।", en: "Good at, weak at. Part 9." } },
        { text: { bn: "Last week we have won a big match.", en: "Last week we have won a big match." }, flag: { bn: "last week বন্ধ সময়: won। পর্ব ১১।", en: "Last week is a closed time: won. Part 11." } },
        { text: { bn: "Our coach, who is very strict, was happy.", en: "Our coach, who is very strict, was happy." } },
        { text: { bn: "If we will win the final, we will get a trophy.", en: "If we will win the final, we will get a trophy." }, flag: { bn: "if-এর ঘরে will নয়: If we win। পর্ব ১৭।", en: "No will in the if clause: If we win. Part 17." } },
        { text: { bn: "I enjoy to play under the lights.", en: "I enjoy to play under the lights." }, flag: { bn: "enjoy + -ing: enjoy playing। পর্ব ১৮।", en: "Enjoy + -ing: enjoy playing. Part 18." } },
        { text: { bn: "It is the best feeling in the world.", en: "It is the best feeling in the world." } },
      ],
    },
    "mistakes-shadow": {
      kind: "bins",
      title: { bn: "বাংলার ছায়া, নাকি ইংরেজির খেয়াল", en: "Bangla's shadow, or English's own quirk" },
      note: { bn: "প্রতিটা ফাঁদ কোন দলের? ছায়ার ওষুধ অনুবাদ থামানো, খেয়ালের ওষুধ তালিকা।", en: "Which group is each trap in? The cure for a shadow is to stop translating; the cure for a quirk is a list." },
      bins: [
        { id: "shadow", label: { bn: "বাংলার ছায়া", en: "Bangla's shadow" } },
        { id: "quirk", label: { bn: "ইংরেজির খেয়াল", en: "English's quirk" } },
      ],
      items: [
        { text: { bn: "I student.", en: "I student." }, bin: "shadow", why: { bn: "বাংলায় 'হয়' লুকায়; সেই অভ্যাস।", en: "Bangla hides the verb be; that habit carried over." } },
        { text: { bn: "You are ready?", en: "You are ready?" }, bin: "shadow", why: { bn: "বাংলায় প্রশ্ন সুরে হয়, শব্দ উল্টায় না।", en: "Bangla asks by tone and never flips the words." } },
        { text: { bn: "She play cricket.", en: "She play cricket." }, bin: "quirk", why: { bn: "-s টুপি ইংরেজির নিজের খেয়াল; বাংলায় এর কোনো ছায়া নেই।", en: "The -s hat is English's own; Bangla casts no shadow here." } },
        { text: { bn: "Although … but …", en: "Although … but …" }, bin: "shadow", why: { bn: "যদিও… তবুও…, দুটো শব্দই বাংলায় বসে।", en: "Bangla uses both joining words at once." } },
        { text: { bn: "I enjoy to play.", en: "I enjoy to play." }, bin: "quirk", why: { bn: "enjoy কেন -ing চায় আর want কেন to, যুক্তি নেই; তালিকা।", en: "Why enjoy wants -ing and want wants to has no logic; it is a list." } },
        { text: { bn: "since two days", en: "since two days" }, bin: "shadow", why: { bn: "বাংলার 'থেকে' দৈর্ঘ্যেও চলে।", en: "The Bangla word for since also covers a length of time." } },
        { text: { bn: "The window was broke.", en: "The window was broke." }, bin: "quirk", why: { bn: "V2 আর V3 আলাদা, রেবেল ক্রিয়ায়; খাতার সংগ্রহ।", en: "V2 and V3 differ in the rebel verbs; that is the workbook's collection." } },
        { text: { bn: "I go to the school.", en: "I go to the school." }, bin: "shadow", why: { bn: "বাংলায় article নেই, তাই কোথায় বসবে আর কোথায় নয়, সেটা ছায়ার ভুল।", en: "Bangla has no article, so where it goes and where it does not is a shadow mistake." } },
        { text: { bn: "good in English", en: "good in English" }, bin: "quirk", why: { bn: "বাঁধা preposition জোড়া; ইংরেজির খেয়াল, তালিকা।", en: "A fixed preposition pair; English's quirk, a list item." } },
        { text: { bn: "I cut my hair yesterday.", en: "I cut my hair yesterday." }, bin: "shadow", why: { bn: "বাংলার একটা 'কাটালাম' ইংরেজিতে had … cut; ছাঁচটা বাংলায় নেই।", en: "Bangla's one causative ending is had … cut in English; the pattern has no Bangla mirror." } },
      ],
    },
    "mistakes-parts": {
      kind: "match",
      title: { bn: "ফাঁদ, আর যে নিয়মে ফিরবে", en: "The trap, and the rule to go back to" },
      note: { bn: "প্রতিটা ভুলের সাথে যে নিয়মটা সারায়, সেটা মেলাও।", en: "Match each mistake to the rule that fixes it." },
      pairs: [
        { left: { bn: "He can plays.", en: "He can plays." }, right: { bn: "modal-এর পরে খালি ক্রিয়া (পর্ব ১২)", en: "a bare verb after a modal (part 12)" } },
        { left: { bn: "Does he plays?", en: "Does he plays?" }, right: { bn: "এক বাক্যে একটাই টুপি (পর্ব ১৩)", en: "one hat per sentence (part 13)" } },
        { left: { bn: "She told that she was tired.", en: "She told that she was tired." }, right: { bn: "tell-এর পরে কাকে, say-এর পরে নয় (পর্ব ১৬)", en: "tell takes a person, say does not (part 16)" } },
        { left: { bn: "Every students are here.", en: "Every students are here." }, right: { bn: "every + একবচন noun + একবচন ক্রিয়া (পর্ব ২০)", en: "every + singular noun + singular verb (part 20)" } },
        { left: { bn: "the bat which I bought it", en: "the bat which I bought it" }, right: { bn: "which-ই কর্ম, it বাড়তি (পর্ব ১৯)", en: "which is already the object; it is extra (part 19)" } },
        { left: { bn: "Never I have seen it.", en: "Never I have seen it." }, right: { bn: "না-বাচক শব্দ শুরুতে হলে উল্টাতে হয় (পর্ব ২২)", en: "a negative word up front forces inversion (part 22)" } },
        { left: { bn: "more taller", en: "more taller" }, right: { bn: "একটাই তুলনা: -er বা more (পর্ব ৫)", en: "one comparison only: -er or more (part 5)" } },
      ],
    },
    "mistakes-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: ঠিক রূপগুলো", en: "Listen, say: the right forms" },
      note: { bn: "প্রতিটা লাইন একটা ফাঁদের ঠিক রূপ। কান দিয়ে মুখস্থ করো।", en: "Each line is the right form of one trap. Learn it by ear." },
      lines: [
        { target: "I am a student, and my sister is a doctor.", bn: "আমি ছাত্র, আর আমার বোন ডাক্তার।" },
        { target: "Rafi and I are good at English.", bn: "রাফি আর আমি ইংরেজিতে ভালো।" },
        { target: "She plays well, and she has played for two years.", bn: "সে ভালো খেলে, আর দুই বছর ধরে খেলছে।" },
        { target: "Does he play? He can play, but he doesn't play every day.", bn: "সে কি খেলে? সে খেলতে পারে, কিন্তু রোজ খেলে না।" },
        { target: "If it rains, we will stay. Although it rained, we played.", bn: "বৃষ্টি হলে থাকব। যদিও বৃষ্টি হলো, খেললাম।" },
        { target: "I enjoy playing, I want to win, and I had my bat repaired.", bn: "আমি খেলতে ভালোবাসি, জিততে চাই, আর ব্যাটটা সারিয়ে নিয়েছি।" },
      ],
    },
    "mistakes-redpen": {
      kind: "order",
      title: { bn: "লাল কালির চার পাক", en: "The red pen's four passes" },
      note: { bn: "লেখা শেষের পাঁচ মিনিটে নিজের লেখা দেখার ক্রম সাজাও।", en: "Put in order the passes you make over your own writing in the last five minutes." },
      items: [
        { text: { bn: "ক্রিয়া: প্রতিটায় আঙুল রেখে কাল, কর্তার মিল, আর আগের শব্দ (modal, have, preposition) দেখো", en: "Verbs: a finger on each, checking tense, agreement with the subject, and the word before (modal, have, preposition)" } },
        { text: { bn: "noun: প্রতিটা একবচন noun-এর সামনে a/the বা কিছু আছে? গোনা যায় না এমনটায় -s বসেনি?", en: "Nouns: does every singular noun have a, the or something in front? No -s on an uncountable?" } },
        { text: { bn: "ছোট শব্দ: preposition জোড়া, since/for, tell/say", en: "Small words: preposition pairs, since/for, tell/say" } },
        { text: { bn: "চিহ্ন: প্রশ্নবোধক, বড় হাত, অ্যাপস্ট্রফি", en: "Marks: question marks, capitals, apostrophes" }, why: { bn: "ক্রিয়া আগে, কারণ পঁচিশ ফাঁদের দশটা ক্রিয়ায়। চিহ্ন শেষে, কারণ সেটা এক মিনিটের কাজ আর বাক্য বদলায় না। একই ক্রমে প্রতিবার, যাতে ভাবতে না হয়।", en: "Verbs first, because ten of the twenty-five traps live in verbs. Marks last, because that pass takes a minute and changes no sentence. The same order every time, so there is nothing to decide." } },
      ],
    },
    "mistakes-gap": {
      kind: "gap",
      title: { bn: "পঁচিশের ঠিক রূপ", en: "The right form of the twenty-five" },
      note: { bn: "প্রতিটা তালিকার একটা ফাঁদ। ঠিকটা বসাও, আর মনে করো কোন পর্ব।", en: "Each one is a trap from the list. Put in the right form and recall the part." },
      items: [
        { text: "Rafi and ___ went to the stadium.", bn: "রাফি আর আমি স্টেডিয়ামে গেলাম।", options: ["I", "me", "myself"], right: 0, why: { bn: "কর্তা হলে I। ফাঁদ ৩, পর্ব ৩।", en: "As a subject, I. Trap 3, part 3." } },
        { text: "We need ___ information about the exam.", bn: "পরীক্ষা নিয়ে আমাদের আরও তথ্য দরকার।", options: ["many", "more", "a few"], right: 1, why: { bn: "information গোনা যায় না: much / more, many নয়। ফাঁদ ২।", en: "Information is uncountable: much or more, never many. Trap 2." } },
        { text: "I ___ him at the market yesterday.", bn: "কাল বাজারে তার সাথে দেখা হলো।", options: ["have seen", "saw", "have saw"], right: 1, why: { bn: "yesterday বন্ধ সময়: past simple। ফাঁদ ১২।", en: "Yesterday is closed time: past simple. Trap 12." } },
        { text: "She has been ill ___ Monday.", bn: "সে সোমবার থেকে অসুস্থ।", options: ["since", "for", "from"], right: 0, why: { bn: "শুরুর বিন্দু: since। দৈর্ঘ্য হলে for। ফাঁদ ১৩।", en: "A starting point: since. A length would take for. Trap 13." } },
        { text: "Although it was late, ___ we kept playing.", bn: "যদিও দেরি হয়ে গিয়েছিল, আমরা খেলতেই থাকলাম।", options: ["but", "(nothing)", "yet"], right: 1, why: { bn: "একটাই জোড়ার শব্দ; Although আছে, but নয়। ফাঁদ ১৬।", en: "One joining word only; Although is there, so no but. Trap 16." } },
        { text: "Every student ___ a copy of the timetable.", bn: "প্রত্যেক ছাত্রের কাছে সময়সূচির একটা কপি আছে।", options: ["have", "has", "having"], right: 1, why: { bn: "every + একবচন: has। ফাঁদ ২২।", en: "Every + singular: has. Trap 22." } },
        { text: "He discussed ___ the plan with his coach.", bn: "সে কোচের সাথে পরিকল্পনাটা নিয়ে আলোচনা করল।", options: ["about", "(nothing)", "on"], right: 1, why: { bn: "discuss-এর পরে সরাসরি কর্ম, about নয়। ফাঁদ ১০।", en: "Discuss takes its object directly, no about. Trap 10." } },
        { text: "The cat licked ___ paw.", bn: "বেড়ালটা তার থাবা চাটল।", options: ["it's", "its", "its'"], right: 1, why: { bn: "মালিকানা: its। খুলে দেখো, it is paw হয় না। ফাঁদ ২৫।", en: "Possession: its. Unpack it; it is paw makes no sense. Trap 25." } },
      ],
    },
    "mistakes-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: কোনটায় ফাঁদ নেই", en: "Guess first: which one has no trap" },
      ask: { bn: "তিনটা বাক্য, দুটোয় ফাঁদ। ফাঁদহীনটা কোনটা? I have been living here since three years. / I am living here since 2023. / I have lived here for three years.", en: "Three sentences, two with traps. Which is trap-free? I have been living here since three years. / I am living here since 2023. / I have lived here for three years." },
      choices: [
        { bn: "I have been living here since three years.", en: "I have been living here since three years." },
        { bn: "I am living here since 2023.", en: "I am living here since 2023." },
        { bn: "I have lived here for three years.", en: "I have lived here for three years." },
      ],
      answer: { bn: "I have lived here for three years.", en: "I have lived here for three years." },
      why: { bn: "প্রথমটায় since-এর পরে দৈর্ঘ্য (three years), ফাঁদ ১৩: দৈর্ঘ্যে for। দ্বিতীয়টায় since আছে কিন্তু সেতুর কাল নেই: am living বর্তমান, since অতীত থেকে এখন পর্যন্ত টানে, তাই have been living লাগত। এটা বাংলার ছায়া, কারণ বাংলায় 'আমি ২০২৩ থেকে এখানে থাকছি' একদম স্বাভাবিক। তৃতীয়টায় সেতু (have lived) আর দৈর্ঘ্য (for), দুটোই ঠিক। দুটো ফাঁদ একই পর্বের, ১১, আর দুটোই একই জায়গায় ধরা পড়ে: since দেখলেই থামো।", en: "The first puts a length (three years) after since, trap 13: a length takes for. The second has since but no bridge tense: am living is present, while since pulls from the past up to now, so it needed have been living. That one is Bangla's shadow, because the Bangla sentence is perfectly natural. The third has the bridge (have lived) and the length (for), both right. Both traps belong to part 11, and both get caught at the same spot: stop whenever you see since." },
    },
    "mistakes-week": {
      kind: "compare",
      title: { bn: "পরীক্ষার আগের সাত দিন", en: "The seven days before the exam" },
      note: { bn: "প্রতিদিন আধ ঘণ্টা, নতুন কিছু নয়, যা আছে সেটা হাতের নাগালে।", en: "Half an hour a day, nothing new, just bringing what you have within reach." },
      columns: [{ bn: "কাজ", en: "the task" }, { bn: "কোথায়", en: "where" }],
      rows: [
        { label: { bn: "দিন ১", en: "Day 1" }, cells: [{ bn: "পঁচিশটা ফাঁদ জোরে পড়ো, নিজেরগুলোয় দাগ", en: "Read the twenty-five traps aloud, mark your own" }, { bn: "এই পর্বের টেবিল", en: "the table in this part" }] },
        { label: { bn: "দিন ২", en: "Day 2" }, cells: [{ bn: "দাগ দেওয়া ফাঁদের পর্বে lines আর gap আবার", en: "The lines and gap blocks of the parts you marked, again" }, { bn: "সেই পর্বগুলো", en: "those parts" }] },
        { label: { bn: "দিন ৩", en: "Day 3" }, cells: [{ bn: "পাঁচ প্রশ্নের ধাপ না দেখে লেখো, মিলিয়ে দেখো", en: "Write the steps of the five questions from memory, then check" }, { bn: "পর্ব ২৪", en: "part 24" }] },
        { label: { bn: "দিন ৪", en: "Day 4" }, cells: [{ bn: "গত বছরের প্রশ্নপত্র, সময় ধরে", en: "Last year's paper, against the clock" }, { bn: "প্রশ্নপত্র", en: "the paper" }] },
        { label: { bn: "দিন ৫", en: "Day 5" }, cells: [{ bn: "ভুলগুলোয় ফাঁদের নম্বর; দুবার পড়া ফাঁদের spot ব্লক", en: "Number each mistake by trap; the spot block of any trap hit twice" }, { bn: "সেই পর্বগুলো", en: "those parts" }] },
        { label: { bn: "দিন ৬", en: "Day 6" }, cells: [{ bn: "খাতার সংগ্রহ একবার: রেবেল, -ing ক্রিয়া, preposition জোড়া", en: "The workbook's collection once: rebels, -ing verbs, preposition pairs" }, { bn: "খাতা", en: "the workbook" }] },
        { label: { bn: "দিন ৭", en: "Day 7" }, cells: [{ bn: "কিছু না। ঘুমাও।", en: "Nothing. Sleep." }, { bn: "বিছানা", en: "bed" }] },
      ],
    },
    "mistakes-build": {
      kind: "build",
      title: { bn: "শব্দ সাজাও: ছায়া ছাড়া", en: "Build it: without the shadow" },
      note: { bn: "প্রতিটা লাইন একটা ফাঁদের ঠিক রূপ। যে শব্দটা বাংলায় থাকে না (am, a, do, for), সেটা কোথায় বসে, দেখো।", en: "Each line is the right form of one trap. Watch where the word Bangla lacks (am, a, do, for) goes." },
      pattern: "subject + be + a + noun  ·  Do / Does + subject + bare verb?  ·  for + length, since + point",
      lines: [
        { target: "I am a student at this school.", bn: "আমি এই স্কুলের ছাত্র।" },
        { target: "Does he play cricket every day?", bn: "সে কি রোজ ক্রিকেট খেলে?" },
        { target: "She has lived here for two years.", bn: "সে দুই বছর ধরে এখানে থাকে।" },
        { target: "Although it rained, we played the match.", bn: "যদিও বৃষ্টি হলো, আমরা ম্যাচটা খেললাম।" },
        { target: "Rafi and I are good at English.", bn: "রাফি আর আমি ইংরেজিতে ভালো।" },
        { target: "I had my hair cut last Friday.", bn: "গত শুক্রবার আমি চুল কাটিয়েছি।" },
      ],
    },
    "mistakes-letter": {
      kind: "spot",
      title: { bn: "মিতুর চিঠি: শেষ লাল কালি", en: "Mitu's letter: the last red pen" },
      note: { bn: "আরেকটা লেখা, আরেক লেখক। লাল কালির চার পাক চালাও: ক্রিয়া, noun, ছোট শব্দ, চিহ্ন। যে লাইনে ফাঁদ, সেটা ছোঁও।", en: "Another piece, another writer. Run the red pen's four passes: verbs, nouns, small words, marks. Tap every line with a trap." },
      source: { bn: "মিতুর চিঠি, বন্ধুকে", en: "Mitu's letter to a friend" },
      lines: [
        { text: { bn: "Dear Sumi, I am writing to tell you about our school trip.", en: "Dear Sumi, I am writing to tell you about our school trip." } },
        { text: { bn: "We went to Sylhet since three days.", en: "We went to Sylhet since three days." }, flag: { bn: "দৈর্ঘ্যে for: for three days। ফাঁদ ১৩।", en: "A length takes for: for three days. Trap 13." } },
        { text: { bn: "Our teacher told that the tea gardens were beautiful.", en: "Our teacher told that the tea gardens were beautiful." }, flag: { bn: "tell-এর পরে কাকে: told us that, বা said that। ফাঁদ ১৮।", en: "Tell takes a person: told us that, or said that. Trap 18." } },
        { text: { bn: "Every student was given a notebook.", en: "Every student was given a notebook." } },
        { text: { bn: "Rafi and me climbed the hill first.", en: "Rafi and me climbed the hill first." }, flag: { bn: "কর্তা হলে I: Rafi and I। ফাঁদ ৩।", en: "As a subject, I: Rafi and I. Trap 3." } },
        { text: { bn: "Never I have seen such a green place.", en: "Never I have seen such a green place." }, flag: { bn: "Never শুরুতে, উল্টাও: Never have I seen। ফাঁদ ২৪।", en: "Never up front, so invert: Never have I seen. Trap 24." } },
        { text: { bn: "I had my photo taken beside the waterfall.", en: "I had my photo taken beside the waterfall." } },
        { text: { bn: "Write back soon and tell me about you're holiday.", en: "Write back soon and tell me about you're holiday." }, flag: { bn: "you're = you are; মালিকানা your। ফাঁদ ২৫।", en: "You're is you are; possession is your. Trap 25." } },
      ],
    },
    "mistakes-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "তিনটা প্রশ্ন, প্রতিটায় একাধিক ফাঁদ একসাথে। গুনে দেখো কয়টা।", en: "Three questions, each with more than one trap at once. Count them." },
      questions: [
        {
          ask: { bn: "Error correction: 'Although he is poor but he is honest and he can speaks English good.' কয়টা ভুল?", en: "Error correction: 'Although he is poor but he is honest and he can speaks English good.' How many mistakes?" },
          options: [
            { text: { bn: "একটা", en: "One" }, why: { bn: "না। তিনটা: but বাড়তি (১৬), can speaks (১৪), good-এর জায়গায় well (৮)।", en: "No. Three: an extra but (16), can speaks (14), good for well (8)." } },
            { text: { bn: "তিনটা", en: "Three" }, right: true, why: { bn: "হ্যাঁ। Although he is poor, he is honest and he can speak English well.", en: "Yes. Although he is poor, he is honest and he can speak English well." } },
            { text: { bn: "দুটো", en: "Two" }, why: { bn: "না। good-টা adverb-এর জায়গায় adjective, সেটাও ভুল: well।", en: "No. Good is an adjective where an adverb belongs; that one counts too: well." } },
          ],
        },
        {
          ask: { bn: "Translation: 'আমি দুই বছর ধরে এখানে থাকি।' কোনটা ফাঁদহীন?", en: "Translate: 'I have lived here for two years.' Which is trap-free?" },
          options: [
            { text: { bn: "I live here since two years.", en: "I live here since two years." }, why: { bn: "দুটো ফাঁদ: সেতুর কাল নেই, আর দৈর্ঘ্যে since।", en: "Two traps: no bridge tense, and since for a length." } },
            { text: { bn: "I have lived here for two years.", en: "I have lived here for two years." }, right: true, why: { bn: "হ্যাঁ। সেতু (have lived), দৈর্ঘ্য (for)।", en: "Yes. Bridge (have lived), length (for)." } },
            { text: { bn: "I am living here for two years.", en: "I am living here for two years." }, why: { bn: "একটা ফাঁদ: for ঠিক, কিন্তু am living সেতু নয়; have been living বা have lived।", en: "One trap: for is right, but am living is no bridge; have been living or have lived." } },
          ],
        },
        {
          ask: { bn: "Right form: 'If it (rain) tomorrow, we (stay) home, and Ma (make) us (study).' কোন সেটটা ঠিক?", en: "Right form: 'If it (rain) tomorrow, we (stay) home, and Ma (make) us (study).' Which set is right?" },
          options: [
            { text: { bn: "will rain / stay / makes / to study", en: "will rain / stay / makes / to study" }, why: { bn: "তিনটা ফাঁদ: if-এর ঘরে will (১৯), মূল অংশে will নেই, made-এর পরে to (২১-এর make)।", en: "Three traps: will in the if clause (19), no will in the main clause, to after make (part 21)." } },
            { text: { bn: "rains / will stay / will make / study", en: "rains / will stay / will make / study" }, right: true, why: { bn: "হ্যাঁ। প্রথম সিঁড়ি: if + present, will; make + কাউকে + খালি।", en: "Yes. First ladder: if + present, will; make + person + bare verb." } },
            { text: { bn: "rains / will stay / will make / studying", en: "rains / will stay / will make / studying" }, why: { bn: "একটা ফাঁদ: make + কাউকে + খালি ক্রিয়া, -ing নয়।", en: "One trap: make + person + bare verb, not -ing." } },
          ],
        },
      ],
    },
    "mistakes-quiz": {
      kind: "quiz",
      title: { bn: "শেষ যাচাই", en: "The last check" },
      questions: [
        {
          ask: { bn: "কোন বাক্যে কোনো ফাঁদ নেই?", en: "Which sentence has no trap in it?" },
          options: [
            { text: { bn: "Me and Mitu has seen the film yesterday.", en: "Me and Mitu has seen the film yesterday." }, why: { bn: "তিনটা ফাঁদ: Me (I), has (have, দুজন), have seen + yesterday (saw)।", en: "Three traps: Me (I), has (have, two people), have seen with yesterday (saw)." } },
            { text: { bn: "Mitu and I saw the film yesterday.", en: "Mitu and I saw the film yesterday." }, right: true, why: { bn: "হ্যাঁ। কর্তা I, বন্ধ সময়ে past simple।", en: "Yes. I as subject, and past simple for a closed time." } },
            { text: { bn: "Mitu and I have saw the film yesterday.", en: "Mitu and I have saw the film yesterday." }, why: { bn: "দুটো ফাঁদ: have + V2 (saw নয়, seen), আর yesterday-র সাথে perfect নয়।", en: "Two traps: have + V2 (seen, not saw), and no perfect with yesterday." } },
          ],
        },
        {
          ask: { bn: "এই টার্মের পরে সবচেয়ে দরকারি অভ্যাস কোনটা?", en: "Which habit matters most after this term?" },
          options: [
            { text: { bn: "সব নিয়ম মুখস্থ রাখা", en: "Memorising every rule" }, why: { bn: "না। নিয়ম ভুলে যাবে; ব্যবহারে যেটা বসে সেটাই থাকে।", en: "No. Rules fade; what stays is what you use." } },
            { text: { bn: "রোজ একটা সত্যিকারের ইংরেজি লেখা পড়া আর নিজের ভুল নিজে ধরা", en: "Reading one real piece of English a day and catching your own mistakes" }, right: true, why: { bn: "হ্যাঁ। যে নিজের ভুল ধরতে পারে, তার আর শিক্ষক লাগে না।", en: "Yes. Somebody who can catch their own mistakes no longer needs a teacher for them." } },
            { text: { bn: "ব্যাকরণ ছাড়া শুধু কথা বলা", en: "Only speaking, with no grammar" }, why: { bn: "অর্ধেক ঠিক: কথা বলা জরুরি, কিন্তু এখন তুমি ব্যাকরণ জানো, তাই কথাটা নিজে শুধরে নিতে পারবে।", en: "Half right: speaking matters, but now you know the grammar, so you can correct yourself as you go." } },
          ],
        },
      ],
    },
    "mistakes-drill": {
      kind: "drill",
      title: { bn: "শেষ কাজ", en: "The last tasks" },
      steps: [
        { text: { bn: "পঁচিশটা ফাঁদের ঠিক রূপ জোরে পড়ো, একবার, আজই।", en: "Read the right form of all twenty-five traps aloud, once, today." } },
        { text: { bn: "নিজের পুরনো একটা ইংরেজি লেখা বের করো আর লাল কালিতে নিজের ফাঁদ খোঁজো।", en: "Dig out an old piece of your own English and hunt your traps in red." } },
        { text: { bn: "খাতার প্রথম দিন খোলো। বা, শেষ করে থাকলে, দিন ১ আবার: নিয়ম জানার পর পাতাটা অন্য রকম লাগবে।", en: "Open day one of the workbook. Or, if it is done, day one again: the page reads differently once you know the rule." } },
        { text: { bn: "কাউকে একটা নিয়ম শেখাও। যে শেখায়, সে দুবার শেখে।", en: "Teach somebody one rule. Whoever teaches learns twice." } },
        { text: { bn: "লাল কালির চার পাক একটা লেখায় সময় ধরে চালাও: পাঁচ মিনিটে চার পাক, প্রতিটা পাকে একটা করে জিনিস।", en: "Run the red pen's four passes over one piece against the clock: four passes in five minutes, one thing per pass." } },
        { text: { bn: "খেলা: একজন তালিকা থেকে একটা ভুল বাক্য বলবে, অন্যজন ঠিক রূপ আর পর্বের নম্বর, পাঁচ সেকেন্ডে। পঁচিশটাই, তারপর পালা বদল।", en: "A game: one says a wrong sentence from the list, the other gives the right form and the part number within five seconds. All twenty-five, then swap." } },
      ],
    },
  },
};
