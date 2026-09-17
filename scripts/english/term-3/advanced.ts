/* ============================================================
   টার্ম ৩, উচ্চতর: ম্যাচ জেতা. Parts 19 to 25.

   The third rung. Same people, same house rules as `basic.ts`.
   The two closing parts are the exam room and the map: every
   grammar question SSC and HSC papers ask, and how the thirty
   days of the practice book line up against these parts.
   ============================================================ */

import { mount, type Written } from "../shape.ts";

export const LESSONS: Written = {

/* ---------------------------------------------------------- */
"relatives": {
  bn: `
<p>ধারাভাষ্যকার বললেন, <span lang="en">The boy who scored the century is only sixteen.</span> এক বাক্যে দুটো খবর: একটা ছেলে সেঞ্চুরি করেছে, আর তার বয়স ষোলো। দুটো বাক্য না বলে একটাকে অন্যটার ভিতরে বসিয়ে দেওয়া হয়েছে, <span lang="en">who</span> দিয়ে। ওই <span lang="en">who</span>, আর তার ভাইবোন <span lang="en">which, that, whose, where</span>: এদের নাম <span lang="en">relative pronoun</span>, আর যে অংশটা তারা শুরু করে তার নাম <span lang="en">relative clause</span>। পর্ব ১৪-এর জোড়ার পরের ধাপ: জোড়া নয়, ভিতরে ঢোকানো।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">who</span> মানুষের জন্য, <span lang="en">which</span> জিনিস আর প্রাণীর জন্য, <span lang="en">that</span> দুটোর জন্যই (কথায়)।</li>
<li><span lang="en">whose</span>: কার। <span lang="en">where</span>: যে জায়গায়। <span lang="en">when</span>: যে সময়ে।</li>
<li>clause-টা noun-এর ঠিক পরে বসে, যাকে বর্ণনা করছে তার গায়ে লেগে।</li>
<li>কমা ছাড়া: কোন জনটা, তা চেনাচ্ছে (জরুরি)। কমা সহ: বাড়তি তথ্য (বাদ দিলেও চলে)।</li>
<li><span lang="en">who/which/that</span> যদি clause-এর ভিতরে কর্ম হয়, বাদ দেওয়া যায়: <span lang="en">the film (that) I saw</span>।</li>
</ul>
</div>

${mount("relatives-pattern")}

<h2>কোনটা কার জন্য</h2>

<div class="table-scroll">
<table>
<thead><tr><th>শব্দ</th><th>কার জন্য</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">who</span></td><td>মানুষ, কর্তা হিসেবে</td><td><span lang="en">the bowler who took five wickets</span></td></tr>
<tr><td><span lang="en">whom</span></td><td>মানুষ, কর্ম হিসেবে (আনুষ্ঠানিক)</td><td><span lang="en">the coach whom everyone respects</span></td></tr>
<tr><td><span lang="en">which</span></td><td>জিনিস, প্রাণী</td><td><span lang="en">the ball which broke the window</span></td></tr>
<tr><td><span lang="en">that</span></td><td>মানুষ বা জিনিস, কমা ছাড়া</td><td><span lang="en">the story that Nanu told</span></td></tr>
<tr><td><span lang="en">whose</span></td><td>কার (মালিকানা)</td><td><span lang="en">the girl whose brother plays for Khulna</span></td></tr>
<tr><td><span lang="en">where</span></td><td>জায়গা</td><td><span lang="en">the stadium where we watched the final</span></td></tr>
<tr><td><span lang="en">when</span></td><td>সময়</td><td><span lang="en">the year when Bangladesh beat India</span></td></tr>
</tbody>
</table>
</div>

<h2>দুটো বাক্য থেকে একটা</h2>

<p>মেশিনটা তিন ধাপে। (১) দুটো বাক্যে একই মানুষ বা জিনিস খোঁজো: <span lang="en">I met a man. The man knows Shakib.</span> দুবার <span lang="en">man</span>। (২) দ্বিতীয় বাক্যের <span lang="en">man</span>-কে <span lang="en">who</span> বানাও: <span lang="en">who knows Shakib</span>। (৩) প্রথম বাক্যের <span lang="en">man</span>-এর ঠিক পরে বসাও: <span lang="en">I met a man who knows Shakib.</span> ব্যস। জিনিস হলে <span lang="en">which</span>: <span lang="en">This is the bat. Rafi bought the bat yesterday. This is the bat which Rafi bought yesterday.</span></p>

${mount("relatives-lines")}

<h2>কমার খেলা: চেনানো, নাকি বাড়তি</h2>

<p>এটাই এই পর্বের সবচেয়ে সূক্ষ্ম কথা, আর সবচেয়ে বেশি নম্বরের। দুটো বাক্য দেখো:</p>

<div class="ex"><span lang="en">My brother who lives in Sylhet is a doctor.</span><br>
<span lang="en">My brother, who lives in Sylhet, is a doctor.</span></div>

<p>প্রথমটা কমা ছাড়া: আমার একাধিক ভাই আছে, আর যে ভাইটা সিলেটে থাকে, সে-ই ডাক্তার। clause-টা <em>চেনাচ্ছে</em> কোন ভাই; বাদ দিলে বোঝা যাবে না। এর নাম <span lang="en">defining</span>। দ্বিতীয়টা কমা সহ: আমার একটাই ভাই, সে ডাক্তার, আর বাড়তি খবর, সে সিলেটে থাকে। clause-টা বাদ দিলেও বাক্য পূর্ণ। এর নাম <span lang="en">non-defining</span>। কমা দুটো বন্ধনীর মতো কাজ করে: ভিতরের কথাটা বাড়তি।</p>

<p>দুটো নিয়ম এখান থেকে বেরোয়। কমা সহ clause-এ <span lang="en">that</span> বসে না, <span lang="en">who</span> বা <span lang="en">which</span> লাগে। আর নাম বা একটাই এমন জিনিসের পরে সবসময় কমা, কারণ নামকে চেনাতে হয় না: <span lang="en">Shakib, who captained the side, took three wickets. Dhaka, which is on the Buriganga, is crowded.</span></p>

${mount("relatives-gap")}

<h2>কখন বাদ দেওয়া যায়</h2>

<p>relative pronoun-টা যদি নিজের clause-এর ভিতরে <em>কর্ম</em> হয়, মানে তার পরেই আরেকটা কর্তা আসে, তাহলে কথায় বাদ দেওয়া হয়। <span lang="en">The film that I saw was boring.</span> <span lang="en">that</span>-এর পরে <span lang="en">I</span>, তাই বাদ: <span lang="en">The film I saw was boring.</span> কিন্তু কর্তা হলে বাদ দেওয়া যায় না: <span lang="en">The boy who scored is sixteen.</span> <span lang="en">who</span>-র পরেই ক্রিয়া, কেউ নেই তার জায়গা নেওয়ার, তাই থাকবে। কৌশল: pronoun-এর পরে সরাসরি ক্রিয়া? রাখো। pronoun-এর পরে আরেকটা কর্তা? বাদ দিতে পারো।</p>

<div class="ex"><b>Feluda মনে করো:</b> <span lang="en">Feluda, who is a private detective, lives in Calcutta with his cousin Topshe, whose father is a friend of the family.</span> দুটো কমা-সহ clause, কারণ নাম চেনাতে হয় না। আর Jatayu-র বই: <span lang="en">the books that Jatayu writes</span>, কমা ছাড়া, কারণ কোন বই তা চেনাচ্ছে।</div>

${mount("relatives-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>দুটো বাক্য <span lang="en">relative pronoun</span> দিয়ে জোড়া দিতে বললে: দ্বিতীয় বাক্যের যে শব্দটা প্রথম বাক্যেও আছে, সেটাকেই বদলাও, আর clause-টা প্রথম বাক্যে সেই শব্দের ঠিক পরে বসাও, দূরে নয়। মানুষ <span lang="en">who</span>, জিনিস <span lang="en">which</span>, মালিকানার <span lang="en">his/her/their</span> থাকলে <span lang="en">whose</span>, জায়গা আর সেখানে <span lang="en">there</span> থাকলে <span lang="en">where</span>। প্রথম বাক্যের শব্দটা নাম হলে কমা দাও।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>relative clause-এর ভিতরে দ্বিতীয়বার pronoun নয়। <span lang="en">The bat which I bought it yesterday</span> ভুল: <span lang="en">which</span> আগে থেকেই ব্যাটটা, <span lang="en">it</span> বাড়তি। <span lang="en">The bat which I bought yesterday.</span> বাংলায় "যেটা আমি কাল কিনেছি সেটা" দুবার বলা যায়, ইংরেজিতে <span lang="en">which</span> একাই দুই কাজ করে।</p>
</div>

${mount("relatives-drill")}
`,
  blocks: {
    "relatives-pattern": {
      kind: "pattern",
      title: { bn: "বাক্যের ভিতরে বাক্য", en: "A sentence inside a sentence" },
      shape: "NOUN + who / which / that + CLAUSE  ·  NAME, who / which + CLAUSE,",
      why: { bn: "যে মানুষ বা জিনিসের কথা বলছ, তার ঠিক পরে who বা which দিয়ে আরেকটা খবর জুড়ে দাও। কমা ছাড়া মানে চেনাচ্ছ কোনটা; কমা সহ মানে বাড়তি খবর, বাদ দিলেও চলে।", en: "Right after the person or thing, attach a second piece of news with who or which. No commas means it identifies which one; commas mean extra news that could be dropped." },
      examples: [
        { target: "The boy who scored the century is sixteen.", bn: "যে ছেলেটা সেঞ্চুরি করল, তার বয়স ষোলো।" },
        { target: "This is the bat which Rafi bought yesterday.", bn: "এটাই সেই ব্যাট যেটা রাফি কাল কিনেছে।" },
        { target: "Shakib, who captained the side, took three wickets.", bn: "শাকিব, যিনি দলের অধিনায়ক ছিলেন, তিন উইকেট নিলেন।" },
        { target: "That is the girl whose brother plays for Khulna.", bn: "ওই সেই মেয়ে যার ভাই খুলনার হয়ে খেলে।" },
        { target: "This is the stadium where we watched the final.", bn: "এটাই সেই স্টেডিয়াম যেখানে আমরা ফাইনাল দেখেছিলাম।" },
      ],
      tip: { bn: "নামের পরে সবসময় কমা: Shakib, who… নাম চেনাতে হয় না।", en: "After a name, always commas: Shakib, who… A name needs no identifying." },
    },
    "relatives-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: দুই থেকে এক", en: "Listen, say: two into one" },
      lines: [
        { target: "I have a friend. He lives in London. I have a friend who lives in London.", bn: "আমার এক বন্ধু আছে। সে লন্ডনে থাকে। আমার এক বন্ধু আছে যে লন্ডনে থাকে।" },
        { target: "This is the story. Nanu told it. This is the story that Nanu told.", bn: "এটা সেই গল্প। নানু এটা বলেছিলেন। এটা সেই গল্প যেটা নানু বলেছিলেন।" },
        { target: "The house where I was born is gone now.", bn: "যে বাড়িতে আমি জন্মেছি সেটা এখন আর নেই।" },
        { target: "I remember the day when we won.", bn: "যেদিন আমরা জিতেছিলাম সেই দিনটা আমার মনে আছে।" },
        { target: "The film I saw last night was great.", bn: "কাল রাতে যে সিনেমাটা দেখলাম সেটা দারুণ ছিল। (that বাদ)" },
      ],
    },
    "relatives-gap": {
      kind: "gap",
      title: { bn: "কোন শব্দ, আর কমা কি না", en: "Which word, and commas or not" },
      items: [
        { text: "The man ___ lives next door is a pilot.", bn: "যে লোকটা পাশের বাসায় থাকে, সে পাইলট।", options: ["which", "who", "whose"], right: 1, why: { bn: "মানুষ, কর্তা: who। কমা নেই, কারণ চেনাচ্ছে কোন লোক।", en: "A person, as subject: who. No commas, because it says which man." } },
        { text: "The ball ___ broke the window was Rafi's.", bn: "যে বলটা জানালা ভাঙল সেটা রাফির।", options: ["who", "which", "whose"], right: 1, why: { bn: "জিনিস: which (বা that)।", en: "A thing: which, or that." } },
        { text: "Mitu, ___ is in class ten, has an exam tomorrow.", bn: "মিতু, যে ক্লাস টেনে পড়ে, তার কাল পরীক্ষা।", options: ["that", "who", "which"], right: 1, why: { bn: "কমা সহ, তাই that নয়: who। নাম চেনাতে হয় না।", en: "With commas, so not that: who. A name needs no identifying." } },
        { text: "I met a girl ___ father is a famous singer.", bn: "আমি এক মেয়ের সাথে পরিচিত হলাম যার বাবা বিখ্যাত গায়ক।", options: ["who", "whose", "which"], right: 1, why: { bn: "কার বাবা? মালিকানা: whose।", en: "Whose father? Possession: whose." } },
        { text: "This is the café ___ we first met.", bn: "এটাই সেই ক্যাফে যেখানে আমাদের প্রথম দেখা।", options: ["which", "where", "when"], right: 1, why: { bn: "জায়গা, আর সেখানে: where।", en: "A place, and there: where." } },
        { text: "The story ___ Nanu told last night made everyone cry.", bn: "নানু কাল রাতে যে গল্পটা বললেন, তাতে সবাই কাঁদল।", options: ["that", "who", "whose"], right: 0, why: { bn: "জিনিস, কমা নেই: that বা which। কর্ম হিসেবে, তাই বাদও দেওয়া যেত।", en: "A thing without commas: that or which. As the object it could even be dropped." } },
      ],
    },
    "relatives-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "My sister who lives in Dhaka is a teacher. এর মানে কী?", en: "My sister who lives in Dhaka is a teacher. What does it mean?" },
          options: [
            { text: { bn: "আমার একটাই বোন, সে ঢাকায় থাকে", en: "I have one sister and she lives in Dhaka" }, why: { bn: "না। কমা নেই, তাই clause চেনাচ্ছে কোন বোন। একাধিক বোন আছে।", en: "No. No commas, so the clause identifies which sister. There is more than one." } },
            { text: { bn: "আমার একাধিক বোন, তাদের মধ্যে ঢাকারটা শিক্ষক", en: "I have several sisters and the one in Dhaka is the teacher" }, right: true, why: { bn: "হ্যাঁ। কমা ছাড়া মানে চেনানো: কোন বোন? ঢাকারটা।", en: "Yes. Without commas the clause identifies: which sister? The one in Dhaka." } },
            { text: { bn: "বাক্যটা ভুল", en: "The sentence is wrong" }, why: { bn: "না। বাক্যটা ঠিক, শুধু মানেটা কমার উপর নির্ভর করে।", en: "No. The sentence is fine; only its meaning depends on the commas." } },
          ],
        },
        {
          ask: { bn: "কোন বাক্যে that বাদ দেওয়া যায়?", en: "In which sentence can that be dropped?" },
          options: [
            { text: { bn: "The bowler that took five wickets is my cousin.", en: "The bowler that took five wickets is my cousin." }, why: { bn: "না। that-এর পরেই ক্রিয়া (took), that এখানে কর্তা। রাখতে হবে।", en: "No. A verb (took) follows that, so that is the subject. It stays." } },
            { text: { bn: "The pitha that Nanu makes is the best.", en: "The pitha that Nanu makes is the best." }, right: true, why: { bn: "হ্যাঁ। that-এর পরে আরেকটা কর্তা (Nanu), that এখানে কর্ম। The pitha Nanu makes is the best.", en: "Yes. Another subject (Nanu) follows that, so that is the object. The pitha Nanu makes is the best." } },
          ],
        },
      ],
    },
    "relatives-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "পাঁচজন মানুষকে who দিয়ে চেনাও: My friend who… The teacher who…", en: "Identify five people with who: My friend who… The teacher who…" } },
        { text: { bn: "নিজের পাঁচটা জিনিস which দিয়ে: the phone which…, the book which…", en: "Five things of yours with which: the phone which…, the book which…" } },
        { text: { bn: "তিনটা নাম, কমা সহ: Dhaka, which… Shakib, who… Nanu, who…", en: "Three names with commas: Dhaka, which… Shakib, who… Nanu, who…" } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"determiners": {
  bn: `
<p>পর্ব ৪-এর <span lang="en">a, an, the</span> ছিল noun-এর আগে বসা প্রথম তিনটা ছোট শব্দ। তাদের একটা বড় পরিবার আছে, যারা সবাই noun-এর আগে বসে আর বলে দেয় কোনটা, কয়টা, কতটুকু, কার: <span lang="en">this, that, some, any, much, many, few, little, each, every, all, both</span>। এদের নাম <span lang="en">determiner</span>। পর্ব ২-এর গোনা যায়/যায় না ভাগটা এখানে ফিরে আসে, কারণ পরিবারের অর্ধেক শুধু একদলের সাথে বসে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">some</span> হ্যাঁ-বাক্যে, <span lang="en">any</span> না-বাক্যে আর প্রশ্নে। <span lang="en">I have some. I don't have any. Do you have any?</span></li>
<li>গোনা যায়: <span lang="en">many, few, a few, several</span>। গোনা যায় না: <span lang="en">much, little, a little</span>। দুটোতেই: <span lang="en">a lot of, some, any, no</span>।</li>
<li><span lang="en">few</span> = প্রায় নেই (খারাপ)। <span lang="en">a few</span> = কিছু আছে (ভালো)। <span lang="en">little / a little</span>-তেও তাই।</li>
<li><span lang="en">each</span> = একটা একটা করে। <span lang="en">every</span> = সবাই, একদল হিসেবে। দুটোর পরেই একবচন।</li>
<li><span lang="en">this/that</span> একটা, <span lang="en">these/those</span> অনেক। কাছে <span lang="en">this</span>, দূরে <span lang="en">that</span>।</li>
</ul>
</div>

${mount("determiners-pattern")}

<h2>some আর any</h2>

<p>দুটোর মানে একই: কিছু, কয়েকটা। পার্থক্য বাক্যের ধরনে। হ্যাঁ-বাচক বাক্যে <span lang="en">some</span>: <span lang="en">There are some mangoes.</span> না-বাচক বাক্যে আর প্রশ্নে <span lang="en">any</span>: <span lang="en">There aren't any mangoes. Are there any mangoes?</span> একটা ব্যতিক্রম যেটা ভদ্রতার: কিছু দিতে বা চাইতে প্রশ্নেও <span lang="en">some</span>, কারণ উত্তর হ্যাঁ আশা করছ। <span lang="en">Would you like some tea? Can I have some water?</span></p>

<h2>কয়টা আর কতটুকু</h2>

<p>গোনা যায় এমন জিনিসের সাথে <span lang="en">many</span>, গোনা যায় না এমন জিনিসের সাথে <span lang="en">much</span>। <span lang="en">How many runs? How much time?</span> কথায় হ্যাঁ-বাচক বাক্যে <span lang="en">much</span> কম শোনা যায়, তার জায়গায় <span lang="en">a lot of</span>: <span lang="en">We have a lot of time.</span> কিন্তু প্রশ্নে আর না-বাক্যে <span lang="en">much</span> স্বাভাবিক: <span lang="en">We don't have much time.</span></p>

<div class="table-scroll">
<table>
<thead><tr><th></th><th>গোনা যায় (runs, players)</th><th>গোনা যায় না (time, rice)</th></tr></thead>
<tbody>
<tr><td>অনেক</td><td><span lang="en">many, a lot of, lots of</span></td><td><span lang="en">much, a lot of, lots of</span></td></tr>
<tr><td>কিছু (ভালো অর্থে)</td><td><span lang="en">a few, several, some</span></td><td><span lang="en">a little, some</span></td></tr>
<tr><td>প্রায় নেই (খারাপ অর্থে)</td><td><span lang="en">few, hardly any</span></td><td><span lang="en">little, hardly any</span></td></tr>
<tr><td>একদম নেই</td><td><span lang="en">no, not any</span></td><td><span lang="en">no, not any</span></td></tr>
</tbody>
</table>
</div>

${mount("determiners-lines")}

<h2>few আর a few: একটা a-র দাম</h2>

<p>এটা এই পর্বের সবচেয়ে দামি লাইন। <span lang="en">Rafi has a few friends.</span> রাফির কয়েকজন বন্ধু আছে, ভালো, যথেষ্ট। <span lang="en">Rafi has few friends.</span> রাফির বন্ধু প্রায় নেই, খারাপ, একা। একটা <span lang="en">a</span> সরালে মানে উল্টে গেল। গোনা যায় না এমন জিনিসে একই খেলা: <span lang="en">We have a little time</span> (একটু আছে, চলবে) আর <span lang="en">We have little time</span> (প্রায় নেই, তাড়াতাড়ি করো)। মনে রাখার উপায়: <span lang="en">a</span> থাকলে আধা গ্লাস ভরা, না থাকলে আধা গ্লাস খালি।</p>

<h2>each আর every</h2>

<p>দুটোই একবচন noun নেয় আর একবচন ক্রিয়া: <span lang="en">Each player has a number. Every player has a number.</span> পার্থক্য দৃষ্টিতে: <span lang="en">each</span> একটা একটা করে দেখে, <span lang="en">every</span> পুরো দলকে একসাথে। দুজনের ক্ষেত্রে শুধু <span lang="en">each</span>: <span lang="en">each hand</span>, <span lang="en">every hand</span> নয়। আর <span lang="en">every</span> সময়ের সাথে: <span lang="en">every day, every week</span>। <span lang="en">Everyone, everybody, everything</span> সবই একবচন: <span lang="en">Everyone is here.</span></p>

${mount("determiners-gap")}

<h2>all, both, either, neither</h2>

<p><span lang="en">all</span> সবাই (তিন বা বেশি), <span lang="en">both</span> দুজনেই (ঠিক দুই)। <span lang="en">All the players are ready. Both openers are left-handed.</span> <span lang="en">either</span> দুটোর যেকোনো একটা, <span lang="en">neither</span> দুটোর কোনোটাই না। <span lang="en">Either bat is fine. Neither bat is mine.</span> <span lang="en">either/neither</span>-এর পরে একবচন। <span lang="en">none</span> তিন বা বেশির কোনোটাই না: <span lang="en">None of the shops was open.</span></p>

<div class="ex"><b>Harry Potter-এর ছাঁচ:</b> <span lang="en">Every wizard needs a wand. Each wand chooses its wizard. Harry had few friends at the Dursleys' but a few very good ones at Hogwarts. He had little money as a boy and a lot of it later.</span> চার লাইনে পরিবারের প্রায় সবাই।</div>

${mount("determiners-bins")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>শূন্যস্থানের পরের noun-টা দেখো: <span lang="en">-s</span> আছে বা গোনা যায়? তাহলে <span lang="en">many, few, a few, these, those, both, several</span>। <span lang="en">-s</span> নেই আর গোনা যায় না (<span lang="en">water, money, time, information</span>)? তাহলে <span lang="en">much, little, a little</span>। বাক্যে <span lang="en">not</span> বা <span lang="en">?</span> আছে? <span lang="en">any</span>। বাক্যের ভাবটা ভালো না খারাপ? ভালো হলে <span lang="en">a few / a little</span>, খারাপ হলে <span lang="en">few / little</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">every</span>-র পরে বহুবচন নয়। <span lang="en">Every students are</span> ভুল; <span lang="en">Every student is</span> ঠিক। বাংলায় "প্রত্যেক ছাত্ররা" শুনতে বেঠিক লাগে, তবু ইংরেজিতে লেখার সময় <span lang="en">-s</span> চলে আসে। আর <span lang="en">much</span>-এর পরে কখনো বহুবচন নয়: <span lang="en">much people</span> ভুল, <span lang="en">many people</span> ঠিক।</p>
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
      ],
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
      ],
    },
    "determiners-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "ফ্রিজ খুলে পাঁচ বাক্য: There is some… There isn't any… There are a few…", en: "Open the fridge and say five sentences: There is some… There isn't any… There are a few…" } },
        { text: { bn: "নিজের সম্পর্কে দুই জোড়া: I have a few… / I have few… I have a little… / I have little…", en: "Two pairs about yourself: I have a few… / I have few… I have a little… / I have little…" } },
        { text: { bn: "ক্লাসের নিয়ম every দিয়ে তিনটা, একবচন ক্রিয়া সহ: Every student has…", en: "Three class rules with every and a singular verb: Every student has…" } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"causatives": {
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

<h2>জিনিসের উপর: have / get + জিনিস + V3</h2>

<p>এটাই <span lang="en">causative</span>-এর সবচেয়ে ব্যবহৃত ছাঁচ, আর সবচেয়ে ইংরেজি-শোনানো। কে করল সেটা জরুরি নয়, কাজটা করানো হয়েছে সেটাই কথা। <span lang="en">I had my hair cut.</span> নাপিত কেটেছে, নাম বলার দরকার নেই। <span lang="en">We got the house painted.</span> <span lang="en">She is having her car washed.</span> <span lang="en">You should get your eyes tested.</span> ছাঁচ: <strong><span lang="en">have/get</span> (যেকোনো কালে) + জিনিস + V3</strong>। পর্ব ১৫-র passive এখানে লুকিয়ে আছে: <span lang="en">my hair was cut</span>, শুধু সামনে <span lang="en">I had</span> বসে জানাচ্ছে যে আমি করিয়েছি।</p>

<p>দুটো বাক্য পাশাপাশি রাখো: <span lang="en">I cut my hair</span> মানে নিজে কাঁচি নিয়ে কেটেছি (সাহসী)। <span lang="en">I had my hair cut</span> মানে সেলুনে গিয়েছি (স্বাভাবিক)। বাংলায় "চুল কাটালাম" এই একটা "কাটালাম"-এ যা বলি, ইংরেজিতে <span lang="en">had … cut</span> দিয়ে।</p>

<h2>ক্রিয়ার ছাঁচের আরও কয়েকজন</h2>

<p><span lang="en">want / would like / ask / tell / allow / advise / encourage + কাউকে + to</span>: <span lang="en">I want you to come. She asked me to wait. The doctor advised him to rest. Coach encouraged us to keep going.</span> <span lang="en">see / hear / watch / feel + কাউকে + খালি বা -ing</span>: <span lang="en">I saw him leave</span> (পুরো কাজটা দেখলাম), <span lang="en">I saw him leaving</span> (যেতে দেখলাম, মাঝপথে)। <span lang="en">suggest / recommend + -ing</span> বা <span lang="en">that</span>: <span lang="en">I suggest leaving early. I suggest that we leave early.</span> <span lang="en">suggest me to</span> বলে কিছু নেই।</p>

${mount("causatives-gap")}

<div class="ex"><b>Harry Potter-এর Dobby:</b> <span lang="en">The Malfoys made Dobby punish himself. Harry got Lucius to free Dobby by giving him a sock.</span> <span lang="en">make</span> খালি, <span lang="en">get … to</span>। আর Hogwarts-এ: <span lang="en">Students have their wands checked at the gate. Harry had his glasses repaired by Hermione.</span> জিনিসের ছাঁচ, V3।</div>

${mount("causatives-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>বন্ধনীর ক্রিয়ার আগে <span lang="en">make, let, have + মানুষ</span>? খালি রূপ। <span lang="en">get + মানুষ</span>? <span lang="en">to</span> + খালি। <span lang="en">have, get + জিনিস</span>? V3। কৌশল: মাঝের শব্দটা মানুষ না জিনিস? মানুষ হলে ক্রিয়া, জিনিস হলে V3। <span lang="en">I had my brother (fix) the fan → fix</span>। <span lang="en">I had the fan (fix) → fixed</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">make</span> passive হলে <span lang="en">to</span> ফিরে আসে: <span lang="en">Coach made us run</span>, কিন্তু <span lang="en">We were made to run</span>। <span lang="en">let</span>-এর passive সাধারণত <span lang="en">allowed to</span>: <span lang="en">We were allowed to go.</span> আর <span lang="en">suggest</span>-এর পরে কখনো <span lang="en">to</span> নয়: <span lang="en">She suggested me to go</span> ভুল, <span lang="en">She suggested that I go</span> বা <span lang="en">suggested going</span> ঠিক।</p>
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
      ],
    },
    "causatives-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "বাসায় কে কাকে কী করায়, চারটা: Ma makes me… Baba lets me… Nanu has me…", en: "Who makes whom do what at home, four sentences: Ma makes me… Baba lets me… Nanu has me…" } },
        { text: { bn: "এ মাসে যা করিয়েছ, তিনটা have + জিনিস + V3: I had my phone repaired…", en: "Three things you had done this month, have + thing + V3: I had my phone repaired…" } },
        { text: { bn: "একজন অলস বন্ধুকে দিয়ে তিনটা কাজ করাও: I got him to…", en: "Three things you got a lazy friend to do: I got him to…" } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"emphasis": {
  bn: `
<p>ধারাভাষ্যকার সাধারণ কণ্ঠে বলতে পারতেন, <span lang="en">I have never seen such a catch.</span> কিন্তু মুহূর্তটা সাধারণ নয়, তাই তিনি চিৎকার করলেন: <span lang="en">Never have I seen such a catch!</span> একই শব্দ, উল্টো ক্রম, দ্বিগুণ জোর। ইংরেজিতে জোর দেওয়ার কয়েকটা ব্যাকরণ আছে, যেগুলো সাধারণ বাক্যকে ভেঙে বা উল্টে আলো ফেলে একটা শব্দের উপর। এই পর্ব সেই আলোর যন্ত্রগুলো: <span lang="en">inversion, cleft sentence, so/such, do</span>। উচ্চতর, কারণ এগুলো ছাড়া ইংরেজি চলে; কিন্তু এগুলো জানলে লেখা আর কথা দুটোই বড় হয়ে যায়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">inversion</span>: না-বাচক শব্দ (<span lang="en">never, rarely, not only, no sooner</span>) বাক্যের শুরুতে গেলে প্রশ্নের ক্রম: <span lang="en">Never have I seen…</span></li>
<li><span lang="en">cleft</span>: <span lang="en">It was X who/that …</span> একটা অংশকে আলাদা করে আলো: <span lang="en">It was Shakib who took the catch.</span></li>
<li><span lang="en">what</span>-cleft: <span lang="en">What I need is sleep.</span> <span lang="en">All I want is a cup of tea.</span></li>
<li><span lang="en">so + adjective, such + (a) noun</span>: <span lang="en">so fast, such a fast bowler</span>। সাথে <span lang="en">that</span>: এত… যে…</li>
<li>জোরের <span lang="en">do</span>: <span lang="en">I do like it. He did call you.</span></li>
</ul>
</div>

${mount("emphasis-pattern")}

<h2>উল্টে দেওয়া: inversion</h2>

<p>নিয়মটা সহজ কিন্তু অদ্ভুত: কিছু না-বাচক বা সীমাবদ্ধ শব্দকে বাক্যের শুরুতে নিয়ে গেলে, বাকি বাক্যটা প্রশ্নের ক্রম নেয়, মানে সাহায্যকারী কর্তার আগে। <span lang="en">I have never seen such a catch. → Never have I seen such a catch.</span> <span lang="en">She rarely complains. → Rarely does she complain.</span> সাহায্যকারী না থাকলে <span lang="en">do/does/did</span> আসে, ঠিক পর্ব ১৩-র মেশিন। যে শব্দগুলো এই কাজ করে: <span lang="en">never, rarely, seldom, hardly, not only, no sooner, only then, under no circumstances, little</span>।</p>

<p>দুটো বিখ্যাত জোড়া: <span lang="en">Not only … but also</span>: <span lang="en">Not only did he score a century, but he also took three wickets.</span> আর <span lang="en">No sooner … than</span>: <span lang="en">No sooner had the match started than it began to rain.</span> শুরু হতে না হতেই বৃষ্টি। <span lang="en">Hardly … when</span> একই মানে: <span lang="en">Hardly had we sat down when the lights went out.</span></p>

${mount("emphasis-lines")}

<h2>ভেঙে আলো ফেলা: cleft sentence</h2>

<p>সাধারণ বাক্য: <span lang="en">Shakib took the catch in the final.</span> একটা তথ্য। কিন্তু তর্কে যদি কেউ বলে তামিম নিয়েছে, তখন: <span lang="en">It was Shakib who took the catch.</span> শাকিব-ই, অন্য কেউ নয়। বাক্যটা দুই ভাগে ভেঙে (<span lang="en">cleft</span> মানে ভাঙা) একটা ভাগে আলো। ছাঁচ: <strong><span lang="en">It + be + যার উপর আলো + who/that + বাকিটা</span></strong>। জায়গায় আলো: <span lang="en">It was in the final that Shakib took the catch.</span> সময়ে: <span lang="en">It was yesterday that I met him.</span></p>

<p><span lang="en">what</span>-cleft উল্টো দিক থেকে আলো ফেলে, যা চাই সেটার উপর: <span lang="en">What I need is a good night's sleep. What Rafi loves most is bowling.</span> আর <span lang="en">All</span> দিয়ে: <span lang="en">All I want is a cup of tea.</span> শুধু চা-ই চাই, আর কিছু না।</p>

<h2>এত… যে…: so আর such</h2>

<p>দুটোই "এত", কিন্তু <span lang="en">so</span> বসে adjective বা adverb-এর আগে, <span lang="en">such</span> বসে noun-এর আগে (adjective থাকলে তার সাথে)। <span lang="en">The bowler was so fast. He was such a fast bowler.</span> গোনা যায় এমন একবচন noun-এ <span lang="en">such a</span>, নইলে <span lang="en">such</span>: <span lang="en">such a match, such matches, such weather</span>। ফল বোঝাতে <span lang="en">that</span>: <span lang="en">He was so tired that he fell asleep on the bus. It was such a good film that we watched it twice.</span> পরীক্ষায় <span lang="en">so … that ↔ too … to</span> বদল আসে: <span lang="en">He was so tired that he could not walk. = He was too tired to walk.</span></p>

${mount("emphasis-gap")}

<h2>জোরের do</h2>

<p>সাধারণ হ্যাঁ-বাচক বাক্যে <span lang="en">do</span> লাগে না, তাই বসালে জোর হয়: <span lang="en">I like it</span> সাধারণ, <span lang="en">I do like it</span> সত্যিই পছন্দ করি, তুমি যা-ই ভাবো। <span lang="en">He did call you</span>: ফোন করেছিল, তুমি ধরোনি। <span lang="en">Do come to the party!</span> আদেশে জোর, আন্তরিক আমন্ত্রণ। কথায় <span lang="en">do</span>-তে জোর পড়ে।</p>

<div class="ex"><b>Yoda-র প্রায় সব কথা inversion:</b> <span lang="en">Powerful you have become.</span> সাধারণ ইংরেজিতে <span lang="en">You have become powerful</span>, কিন্তু Yoda জোর দেয় <span lang="en">powerful</span>-এ। Titanic: <span lang="en">It was Rose who let go.</span> cleft। আর Kung Fu Panda-র Shifu: <span lang="en">There is no such thing as an accident.</span> <span lang="en">such</span> + noun। এগুলো চিনলে সিনেমার সংলাপ নতুন করে শোনা যায়।</div>

${mount("emphasis-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Transformation</span>-এ <span lang="en">Not only</span> বা <span lang="en">No sooner</span> দিয়ে বাক্য শুরু করতে বললে দ্বিতীয় শব্দটা সাহায্যকারী, তৃতীয়টা কর্তা: <span lang="en">Not only did he…</span> <span lang="en">No sooner had she…</span> <span lang="en">so … that</span> থেকে <span lang="en">too … to</span>: <span lang="en">that</span>-এর পরের <span lang="en">not</span> যায়, ক্রিয়া <span lang="en">to</span> নেয়। <span lang="en">such … that</span> থেকে <span lang="en">so … that</span>: noun সরিয়ে adjective রাখো: <span lang="en">such a fast bowler that → so fast a bowler that</span>, বা সহজে <span lang="en">The bowler was so fast that</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>inversion শুধু তখনই যখন না-বাচক শব্দটা বাক্যের <em>শুরুতে</em>। <span lang="en">I have never seen</span> সাধারণ ক্রম, ঠিক। <span lang="en">Never I have seen</span> ভুল: শুরুতে নিলে উল্টাতেই হবে, <span lang="en">Never have I seen</span>। অর্ধেক উল্টানো সবচেয়ে খারাপ। আর <span lang="en">so such a</span> বলে কিছু নেই: হয় <span lang="en">so fast</span>, নয় <span lang="en">such a fast</span>।</p>
</div>

${mount("emphasis-drill")}
`,
  blocks: {
    "emphasis-pattern": {
      kind: "pattern",
      title: { bn: "আলো ফেলার তিন যন্ত্র", en: "Three ways to throw light" },
      shape: "Never / Not only + HELPER + WHO …   ·   It was X who …   ·   so + adjective / such + a + noun",
      why: { bn: "সাধারণ ক্রম ভাঙলেই কান খাড়া হয়, আর সেটাই জোর। না-বাচক শব্দ শুরুতে নিলে প্রশ্নের ক্রম; It was দিয়ে একটা অংশ আলাদা; so আর such দিয়ে মাত্রা।", en: "Break the ordinary order and the ear pricks up, which is the emphasis. A negative word up front takes question order; It was cuts one part loose; so and such turn up the degree." },
      examples: [
        { target: "Never have I seen such a catch!", bn: "এমন ক্যাচ আমি কখনো দেখিনি!" },
        { target: "Not only did Shakib bat well, but he also bowled well.", bn: "শাকিব শুধু ভালো ব্যাটই করেনি, ভালো বলও করেছে।" },
        { target: "It was Mustafiz who took the last wicket.", bn: "শেষ উইকেটটা মুস্তাফিজই নিয়েছিল।" },
        { target: "What I need now is a cup of tea.", bn: "এখন আমার যা দরকার তা হলো এক কাপ চা।" },
        { target: "He was so tired that he fell asleep on the bus.", bn: "সে এত ক্লান্ত ছিল যে বাসেই ঘুমিয়ে পড়ল।" },
      ],
      tip: { bn: "শুরুতে Never নিলে উল্টাতেই হবে। অর্ধেক উল্টানো, Never I have, সবচেয়ে খারাপ।", en: "Put Never first and you must invert. Half-inverting, Never I have, is the worst of both." },
    },
    "emphasis-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: সাধারণ, তারপর জোর", en: "Listen, say: plain, then emphatic" },
      lines: [
        { target: "I have rarely seen him angry. Rarely have I seen him angry.", bn: "আমি তাকে খুব কমই রাগতে দেখেছি। (দুই সাজ)" },
        { target: "The match had just started when it rained. No sooner had the match started than it rained.", bn: "ম্যাচ শুরু হতে না হতেই বৃষ্টি।" },
        { target: "Nanu told this story. It was Nanu who told this story.", bn: "নানু-ই এই গল্পটা বলেছিলেন।" },
        { target: "I want to sleep. All I want is to sleep.", bn: "আমি শুধু ঘুমাতে চাই।" },
        { target: "I like it. I do like it, really.", bn: "আমার সত্যিই এটা পছন্দ।" },
      ],
    },
    "emphasis-gap": {
      kind: "gap",
      title: { bn: "কোন যন্ত্র", en: "Which device" },
      items: [
        { text: "Never ___ such a beautiful sunset.", bn: "এমন সুন্দর সূর্যাস্ত আমি কখনো দেখিনি।", options: ["I have seen", "have I seen", "I saw"], right: 1, why: { bn: "Never শুরুতে, তাই সাহায্যকারী কর্তার আগে: have I seen।", en: "Never is first, so the helper goes before the subject: have I seen." } },
        { text: "Not only ___ the exam, but she also topped the class.", bn: "সে শুধু পরীক্ষায় পাশই করেনি, ক্লাসে প্রথমও হয়েছে।", options: ["she passed", "did she pass", "she did pass"], right: 1, why: { bn: "Not only শুরুতে, past simple, সাহায্যকারী নেই: did she pass।", en: "Not only opens, past simple with no helper: did she pass." } },
        { text: "It was in 2007 ___ Bangladesh beat India.", bn: "২০০৭ সালেই বাংলাদেশ ভারতকে হারিয়েছিল।", options: ["who", "that", "which"], right: 1, why: { bn: "cleft-এ সময় বা জায়গার পরে that।", en: "In a cleft, that follows a time or a place." } },
        { text: "Rafi is ___ fast that nobody can catch him.", bn: "রাফি এত দ্রুত যে কেউ তাকে ধরতে পারে না।", options: ["so", "such", "such a"], right: 0, why: { bn: "fast একটা adjective, তাই so।", en: "Fast is an adjective, so so." } },
        { text: "It was ___ good film that we watched it twice.", bn: "এত ভালো সিনেমা ছিল যে আমরা দুবার দেখলাম।", options: ["so", "such", "such a"], right: 2, why: { bn: "film একবচন noun, adjective সহ: such a good film।", en: "Film is a singular noun with an adjective: such a good film." } },
        { text: "No sooner ___ the bell rung than the students ran out.", bn: "ঘণ্টা বাজতে না বাজতেই ছাত্ররা দৌড়ে বেরোল।", options: ["had", "has", "did"], right: 0, why: { bn: "No sooner + had + কর্তা + V3 … than।", en: "No sooner + had + subject + V3 … than." } },
      ],
    },
    "emphasis-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "He was so tired that he could not walk. একই মানে কোনটা?", en: "He was so tired that he could not walk. Which means the same?" },
          options: [
            { text: { bn: "He was too tired to walk.", en: "He was too tired to walk." }, right: true, why: { bn: "হ্যাঁ। so … that … not = too … to। not যায়, to আসে।", en: "Yes. So … that … not equals too … to. The not goes and to arrives." } },
            { text: { bn: "He was tired enough to walk.", en: "He was tired enough to walk." }, why: { bn: "না। enough মানে যথেষ্ট, উল্টো মানে: হাঁটার মতো যথেষ্ট ক্লান্ত?", en: "No. Enough means sufficiently, the opposite direction." } },
            { text: { bn: "He was very tired but he walked.", en: "He was very tired but he walked." }, why: { bn: "না। মূল বাক্যে সে হাঁটতে পারেনি।", en: "No. In the original he could not walk." } },
          ],
        },
        {
          ask: { bn: "কোনটা ঠিক?", en: "Which is right?" },
          options: [
            { text: { bn: "Seldom she visits us.", en: "Seldom she visits us." }, why: { bn: "না। Seldom শুরুতে নিলে উল্টাতে হবে।", en: "No. With Seldom first, you must invert." } },
            { text: { bn: "Seldom does she visit us.", en: "Seldom does she visit us." }, right: true, why: { bn: "হ্যাঁ। সাহায্যকারী নেই, does আসে, visit খালি।", en: "Yes. No helper, so does arrives and visit goes bare." } },
            { text: { bn: "Seldom does she visits us.", en: "Seldom does she visits us." }, why: { bn: "না। দুই টুপি: does টুপি পরলে visit খালি।", en: "No. Two hats: once does has the hat, visit goes bare." } },
          ],
        },
      ],
    },
    "emphasis-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "তিনটা Never have I…, নিজের জীবন থেকে: Never have I eaten…", en: "Three Never have I… from your own life: Never have I eaten…" } },
        { text: { bn: "পরিবারের তিনজনকে cleft দিয়ে: It was Ma who… It was Baba who…", en: "Three people at home in clefts: It was Ma who… It was Baba who…" } },
        { text: { bn: "তিন জোড়া so/such: The tea was so hot… It was such hot tea…", en: "Three so/such pairs: The tea was so hot… It was such hot tea…" } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"punctuation": {
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

${mount("punctuation-lines")}

<h2>অ্যাপস্ট্রফি: দুই কাজ, একটা ফাঁদ</h2>

<p>প্রথম কাজ, মালিকানা: <span lang="en">Rafi's bat, the cat's tail, my mother's voice</span>। বহুবচন <span lang="en">-s</span>-এর পরে শুধু অ্যাপস্ট্রফি: <span lang="en">the players' bus, my parents' room</span>। দ্বিতীয় কাজ, দুটো শব্দ জোড়া লাগানো: <span lang="en">it's (it is), don't (do not), I'm (I am), they're (they are), who's (who is), you're (you are)</span>।</p>

<p>ফাঁদটা: <strong>বহুবচনে কখনো অ্যাপস্ট্রফি নয়।</strong> <span lang="en">Two mango's</span> ভুল, <span lang="en">two mangoes</span> ঠিক। দোকানের সাইনবোর্ডে এই ভুল এত বেশি যে ইংরেজিতে এর নাম আছে। আর জোড়া: <span lang="en">its/it's, your/you're, their/they're/there, whose/who's</span>। অ্যাপস্ট্রফি থাকলে দুটো শব্দ; খুলে দেখো: <span lang="en">it's raining = it is raining</span>, ঠিক। <span lang="en">the cat licked it's paw = it is paw</span>, অর্থহীন, তাই <span lang="en">its</span>।</p>

<h2>সেমিকোলন আর কোলন</h2>

<p>সেমিকোলন (;) একটা ফুল স্টপ যেটা দুটো বাক্যকে হাত ধরিয়ে রাখে: <span lang="en">Rafi bowls; Mitu bats.</span> দুই দিকেই পুরো বাক্য, ঘনিষ্ঠ, জোড়ার শব্দ ছাড়া। <span lang="en">however, therefore, moreover</span>-এর আগে সেমিকোলন, পরে কমা: <span lang="en">It rained; however, we played.</span> কোলন (:) মানে "এই যে, এবার আসছে": তালিকা বা ব্যাখ্যা। <span lang="en">We need three things: rice, dal and salt. Nanu has one rule: no phones at dinner.</span> কোলনের আগে পুরো বাক্য থাকতে হবে।</p>

${mount("punctuation-gap")}

<h2>উদ্ধৃতি, আর ড্যাশের বদলে</h2>

<p>কারও কথা হুবহু লিখতে উদ্ধৃতি চিহ্ন, আর বলার ক্রিয়ার পরে কমা: <span lang="en">Nanu said, "Sit down and listen."</span> শেষের ফুল স্টপ বা প্রশ্নবোধক উদ্ধৃতির ভিতরে। কথাটা আগে এলে কমা ভিতরে: <span lang="en">"Sit down," said Nanu.</span> পর্ব ১৬-র narration এটা থেকেই শুরু।</p>

<p>লম্বা ড্যাশ নিয়ে একটা কথা: অনেকে বাক্যের মাঝে হঠাৎ থামতে বা ব্যাখ্যা ঢোকাতে ড্যাশ ব্যবহার করে। পরীক্ষার লেখায় সেটা এড়াও, কারণ পরীক্ষক ওটাকে অসমাপ্ত বাক্য ভাবতে পারেন। ব্যাখ্যা ঢোকাতে কোলন, আলাদা কথা বলতে কমা বা বন্ধনী, নতুন কথায় ফুল স্টপ। এই তিনটে দিয়ে ড্যাশের সব কাজ হয়ে যায়।</p>

<div class="ex"><b>একটা ক্লাসিক:</b> <span lang="en">A woman without her man is nothing.</span> এবার যতিচিহ্ন বসাও। <span lang="en">A woman, without her man, is nothing.</span> এক মানে। <span lang="en">A woman: without her, man is nothing.</span> উল্টো মানে। একই এগারোটা শব্দ। যতিচিহ্ন শব্দের মালিক।</div>

${mount("punctuation-spot")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Punctuation</span> প্রশ্নে অনুচ্ছেদটা আগে একবার জোরে পড়ো: যেখানে নিঃশ্বাস নিতে হয়, সেখানে কমা বা ফুল স্টপ। তারপর তিনটা খোঁজ: (১) বলার ক্রিয়া (<span lang="en">said, asked, replied</span>) দেখলে উদ্ধৃতি চিহ্ন আর কমা। (২) নাম, <span lang="en">I</span>, দিন, মাস, দেশ দেখলে বড় হাত। (৩) প্রশ্নের ক্রম দেখলে প্রশ্নবোধক। বাড়তি নম্বর: সম্বোধনের কমা, আর <span lang="en">it's/its</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>ফুল স্টপের পরে একটা স্পেস, কমার পরে একটা স্পেস, কমার আগে কোনো স্পেস নয়। <span lang="en">Rafi ,Mitu and I</span> ভুল দেখতে, <span lang="en">Rafi, Mitu and I</span> ঠিক। প্রশ্নবোধক আর বিস্ময়চিহ্ন একটাই: <span lang="en">Really?!!</span> নয়, <span lang="en">Really?</span> চিঠির লেখায় দুটো চিহ্ন একসাথে দিলে পরীক্ষক ভ্রু কোঁচকান।</p>
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
    "punctuation-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো, হাতে লেখো", en: "Say it, write it" },
      steps: [
        { text: { bn: "একটা অনুচ্ছেদ খাতায় লেখো যতিচিহ্ন ছাড়া, তারপর জোরে পড়ে কমা আর ফুল স্টপ বসাও।", en: "Write a paragraph with no punctuation, then read it aloud and put in the commas and full stops." } },
        { text: { bn: "পাঁচটা it's আর পাঁচটা its বাক্য, প্রতিটা খুলে যাচাই করো।", en: "Five it's and five its sentences, unpacking each to check." } },
        { text: { bn: "কোনো সাইনবোর্ড বা মেনুতে অ্যাপস্ট্রফির ভুল খোঁজো। পেলে ছবি তোলো; এটা একটা খেলা।", en: "Hunt for a stray apostrophe on a signboard or a menu. Photograph it; it is a game." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"transformation": {
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

${mount("transformation-lines")}

<h2>প্রশ্ন ৩ আর ৪: narration আর voice</h2>

<p>দুটোই পুরো পর্ব পেয়েছে (১৬ আর ১৫)। এখানে শুধু ধাপের তালিকা, হলে বসে যেভাবে মনে করবে। <strong>Narration:</strong> (১) বলার ক্রিয়া: <span lang="en">said/told/asked/requested/ordered/exclaimed/suggested</span>। (২) জোড়া: <span lang="en">that / if / wh / to / not to</span>। (৩) কাল এক ধাপ পিছনে, বলার ক্রিয়া অতীতে থাকলে। (৪) pronoun বক্তার দিক থেকে ঘোরাও। (৫) সময় আর জায়গা দূরে সরাও। (৬) প্রশ্নের ক্রম সোজা করো, প্রশ্নবোধক সরাও।</p>

<p><strong>Voice:</strong> (১) কর্তা, ক্রিয়া, কর্ম চিহ্নিত করো। (২) কর্ম সামনে। (৩) <span lang="en">be</span> মূল ক্রিয়ার কালে: <span lang="en">-ing</span> দেখলে <span lang="en">being</span>, <span lang="en">have</span> দেখলে <span lang="en">been</span>, modal দেখলে <span lang="en">be</span>। (৪) V3। (৫) <span lang="en">by</span> + কর্তা, অথবা বাদ যদি <span lang="en">people/they/someone</span>। (৬) প্রশ্ন হলে আগে বাক্য বানাও, তারপর সাহায্যকারী সামনে।</p>

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

${mount("transformation-quiz")}

<div class="side-note">
<p class="side-note-label">হলে বসার কৌশল</p>
<p>ব্যাকরণের অংশে সময় ভাগ করো: প্রতিটা প্রশ্নে সমান, আর শেষে পাঁচ মিনিট পুরোটা জোরে (মনে মনে) পড়ার জন্য। সবচেয়ে বেশি নম্বর যায় তিন জায়গায়: প্রশ্নবোধক চিহ্ন ফেলে আসা, V2 আর V3 গুলিয়ে ফেলা (<span lang="en">was broke</span>), আর <span lang="en">if</span>-এর ঘরে <span lang="en">will</span>। পরীক্ষার আগের রাতে এই তিনটা লাইন পড়ো, আর খাতার সংগ্রহের রেবেল তালিকাটা।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">transformation</span>-এ মানে বদলে ফেলা সবচেয়ে বড় ভুল। <span lang="en">He is too weak to walk</span> থেকে <span lang="en">He is so weak that he can walk</span> লিখলে ব্যাকরণ ঠিক, মানে উল্টো, নম্বর শূন্য। বদলের পর নিজেকে জিজ্ঞেস করো: একই ঘটনা বলছে তো? <span lang="en">not</span> কোথাও হারিয়ে যায়নি তো?</p>
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
      ],
    },
    "transformation-drill": {
      kind: "drill",
      title: { bn: "খাতায় করো", en: "Do it on paper" },
      steps: [
        { text: { bn: "একটা so…that বাক্য নাও আর too…to বানাও; তারপর উল্টোটা। পাঁচবার।", en: "Take one so…that sentence and make it too…to; then the reverse. Five times." } },
        { text: { bn: "নিজের একটা সাধারণ বাক্যকে simple, complex আর compound তিন গড়নে লেখো।", en: "Write one plain sentence of your own as simple, complex and compound." } },
        { text: { bn: "গত বছরের প্রশ্নপত্রের ব্যাকরণ অংশটা সময় ধরে করো, তারপর এই টার্মের পর্ব নম্বর দিয়ে প্রতিটা ভুলের পাশে লেখো কোন পর্বে ফিরতে হবে।", en: "Do last year's grammar section against the clock, then write beside each mistake which part of this term to go back to." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"mistakes": {
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

${mount("mistakes-lines")}

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

<h2>এরপর</h2>

<p>ব্যাকরণ শেখা শেষ হয় না, কিন্তু ব্যাকরণ <em>ভয়</em> পাওয়া শেষ হয়। এই টার্মের পরে যেকোনো ইংরেজি বাক্য দেখে বলতে পারবে কে কী করছে, আর নিজের বাক্যের ভুল নিজে ধরতে পারবে। সেটাই দরকার ছিল। এবার তিনটে কাজ। রোজ একটা সত্যিকারের ইংরেজি জিনিস পড়ো, খবর, ধারাভাষ্য, যা খুশি, আর প্রতিটা বাক্যে একটা করে নিয়ম চেনো। রোজ দুই মিনিট নিজেকে রেকর্ড করো আর নিজের ফাঁদ নিজে ধরো। আর <a href="/english/term-2">টার্ম ২</a>-তে ফিরে যাও, যেখানে এই নিয়মগুলো দিয়ে দুই মিনিট একটানা কথা বলা শেখানো হয়: ব্যাকরণ জানার পর সেই টার্মটা অন্য রকম লাগবে।</p>

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
      ],
    },
  },
},

};
