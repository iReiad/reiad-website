/* ============================================================
   টার্ম ৩, বেসিক: খেলার নিয়ম. Parts 1 to 10.

   What seeds these rows. See `scripts/english/shape.ts` for why
   the file is kept and what it is not.

   House rules for the text here:

     · the learner is তুমি, as in every part of this school
     · every English string is the thing being taught and carries
       lang="en"; every Bangla string is what it means or why it
       works, never the other way round
     · the same four people walk through every part: রাফি (class
       eight, cricket), মিতু আপু (class ten, the exam), নানু (the
       stories) and তানভীর ভাই (the films), so a rule arrives in a
       scene a reader already knows
     · every part ends on something said out loud
   ============================================================ */

import { mount, type Written } from "../shape.ts";

export const LESSONS: Written = {

/* ---------------------------------------------------------- */
"players": {
  bn: `
<p>রাফির স্কুলের ক্রিকেট দলে এগারোজন। কিন্তু কোচ স্যার বলেন, পজিশন আসলে কয়েকটা: ওপেনার, মিডল অর্ডার, কিপার, পেসার, স্পিনার। কে কোন পজিশনে খেলবে সেটা জানলেই দল সাজানো যায়। ইংরেজি বাক্যও ঠিক তাই: হাজার হাজার শব্দ, কিন্তু পজিশন মাত্র <span lang="en">eight</span>। ব্যাকরণের বইয়ে এদের নাম <span lang="en">parts of speech</span>।</p>

<p>এই একটা পর্ব পুরো টার্মের মানচিত্র। পরের চব্বিশটা পর্বে যে খেলোয়াড়দের নিয়ে আলাদা আলাদা কথা হবে, আজ তাদের সবাইকে এক লাইনে দাঁড় করানো।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>একটা শব্দ কোন জাতের, সেটা ঠিক হয় বাক্যে তার <em>কাজ</em> দিয়ে, চেহারা দিয়ে নয়।</li>
<li>আটজন: <span lang="en">noun, pronoun, verb, adjective, adverb, preposition, conjunction, interjection</span>।</li>
<li>প্রতিটা বাক্যে অন্তত একজন <span lang="en">verb</span> থাকতেই হবে। ক্রিয়া ছাড়া বাক্য হয় না।</li>
<li>একই শব্দ এক বাক্যে <span lang="en">noun</span>, আরেক বাক্যে <span lang="en">verb</span> হতে পারে: <span lang="en">a run</span> আর <span lang="en">to run</span>।</li>
</ul>
</div>

${mount("players-pattern")}

<h2>দলের তালিকা</h2>

<p>একটা করে নাম, একটা করে কাজ, একটা করে উদাহরণ। রাফির দল দিয়েই দেখো।</p>

<div class="table-scroll">
<table>
<thead><tr><th>খেলোয়াড়</th><th>কাজ</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">noun</span></td><td>নাম: মানুষ, জায়গা, জিনিস, ভাব</td><td><span lang="en">Rafi, Dhaka, bat, courage</span></td></tr>
<tr><td><span lang="en">pronoun</span></td><td>নামের বদলি</td><td><span lang="en">he, she, it, they, we</span></td></tr>
<tr><td><span lang="en">verb</span></td><td>কাজ, বা হওয়া</td><td><span lang="en">bowl, run, is, have</span></td></tr>
<tr><td><span lang="en">adjective</span></td><td>নামের রং: কেমন</td><td><span lang="en">fast, red, tired, brave</span></td></tr>
<tr><td><span lang="en">adverb</span></td><td>কাজের রং: কীভাবে, কখন, কোথায়</td><td><span lang="en">fast, always, here, very</span></td></tr>
<tr><td><span lang="en">preposition</span></td><td>জায়গা আর সময়ের সম্পর্ক</td><td><span lang="en">in, on, at, under, before</span></td></tr>
<tr><td><span lang="en">conjunction</span></td><td>জোড়ার শব্দ</td><td><span lang="en">and, but, because, so</span></td></tr>
<tr><td><span lang="en">interjection</span></td><td>হঠাৎ আওয়াজ</td><td><span lang="en">Wow! Oh no! Ouch!</span></td></tr>
</tbody>
</table>
</div>

<p>তানভীর ভাই বলে, <span lang="en">Spider-Man</span>-এর সেই লাইনটা মনে আছে? <span lang="en">With great power comes great responsibility.</span> এখানে <span lang="en">power</span> আর <span lang="en">responsibility</span> হলো <span lang="en">noun</span>, <span lang="en">great</span> দুবারই <span lang="en">adjective</span>, <span lang="en">comes</span> হলো <span lang="en">verb</span>, আর <span lang="en">with</span> একটা <span lang="en">preposition</span>। একটা বিখ্যাত লাইন, চারজন খেলোয়াড়।</p>

<h2>কাজ দেখে চেনো, চেহারা দেখে নয়</h2>

<p>এটাই আজকের সবচেয়ে বড় কথা। <span lang="en">run</span> শব্দটা দেখে বলা যায় না ও কে। <span lang="en">Tamim can run fast</span> বাক্যে <span lang="en">run</span> একটা কাজ, তাই <span lang="en">verb</span>। <span lang="en">Tamim scored a quick run</span> বাক্যে <span lang="en">run</span> একটা জিনিস, একটা রান, তাই <span lang="en">noun</span>। একই শব্দ, দুই পজিশন। ঠিক যেমন শাকিব কখনো ব্যাটার, কখনো বোলার।</p>

${mount("players-lines")}

<h2>দ্রুত চেনার তিনটা প্রশ্ন</h2>

<ol class="step-list">
<li><strong>এটা কি কেউ বা কিছু?</strong> হ্যাঁ হলে <span lang="en">noun</span>। আগে <span lang="en">a, an, the</span> বসানো গেলে প্রায় নিশ্চিত: <span lang="en">a bat, the match</span>।</li>
<li><strong>এটা কি কাজ বা হওয়া?</strong> হ্যাঁ হলে <span lang="en">verb</span>। আগে <span lang="en">to</span> বসানো গেলে নিশ্চিত: <span lang="en">to bowl, to sleep</span>।</li>
<li><strong>এটা কি কোনো কিছুকে বর্ণনা করছে?</strong> নামকে করলে <span lang="en">adjective</span> (<span lang="en">a fast bowler</span>), কাজকে করলে <span lang="en">adverb</span> (<span lang="en">he bowls fast</span>)।</li>
</ol>

<p>বাকি চারজন ছোট শব্দ, আর তাদের সংখ্যা কম। <span lang="en">in, on, at, under, with, for, from, to</span> প্রায় সবসময় <span lang="en">preposition</span>; <span lang="en">and, but, or, because, so, if</span> হলো <span lang="en">conjunction</span>; বিস্ময়চিহ্ন দেখলে <span lang="en">interjection</span>।</p>

${mount("players-bins")}

<h2>নানুর গল্পে আটজন</h2>

<p>নানু রাতে ঠাকুরমার ঝুলি থেকে গল্প বলেন। একটা লাইন ইংরেজিতে ধরো: <span lang="en">The clever fox quietly walked into the dark forest, but the tiger saw him. Oh!</span></p>

<p>এখানে সবাই আছে। <span lang="en">fox, forest, tiger</span> হলো <span lang="en">noun</span>। <span lang="en">him</span> হলো <span lang="en">pronoun</span>। <span lang="en">walked, saw</span> হলো <span lang="en">verb</span>। <span lang="en">clever, dark</span> হলো <span lang="en">adjective</span>। <span lang="en">quietly</span> হলো <span lang="en">adverb</span>। <span lang="en">into</span> হলো <span lang="en">preposition</span>। <span lang="en">but</span> হলো <span lang="en">conjunction</span>। আর শেষের <span lang="en">Oh!</span> হলো <span lang="en">interjection</span>। একটা বাক্যে পুরো দল।</p>

${mount("players-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Parts of speech</span> চিহ্নিত করতে বললে শব্দটা আলাদা করে দেখো না, তার আগে-পরে কী আছে দেখো। আগে <span lang="en">the</span> বা <span lang="en">a</span> থাকলে <span lang="en">noun</span>; আগে <span lang="en">is, was, can, will</span> থাকলে <span lang="en">verb</span>; শেষে <span lang="en">-ly</span> থাকলে প্রায় সবসময় <span lang="en">adverb</span>। দুই সেকেন্ডে উত্তর।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">-ly</span> দেখলেই <span lang="en">adverb</span> ভেবো না। <span lang="en">friendly, lovely, lonely</span> সবগুলো <span lang="en">adjective</span>: <span lang="en">a friendly dog</span>। আর <span lang="en">fast, hard, late, early</span> কোনো <span lang="en">-ly</span> ছাড়াই দুই কাজই করে: <span lang="en">a fast car</span> (adjective), <span lang="en">he drives fast</span> (adverb)।</p>
</div>

${mount("players-drill")}
`,
  blocks: {
    "players-pattern": {
      kind: "pattern",
      title: { bn: "একটা বাক্য, চারটা পজিশন", en: "One sentence, four positions" },
      shape: "WHO (noun / pronoun) + DOES (verb) + WHAT (noun) + HOW (adverb)",
      why: { bn: "যেকোনো ইংরেজি বাক্য এই চারটা ঘরের ভিতরে বসে। কে, কী করে, কী, কীভাবে। বাকি চারজন এই ঘরগুলোর মাঝে সেতু আর রং।", en: "Every English sentence sits in these four slots: who, does, what, how. The other four players are the bridges and the colour between them." },
      examples: [
        { target: "Rafi hits the ball hard.", bn: "রাফি বলটা জোরে মারে। (noun, verb, noun, adverb)" },
        { target: "She reads stories quietly.", bn: "সে চুপচাপ গল্প পড়ে। (pronoun, verb, noun, adverb)" },
        { target: "The old cat sleeps peacefully.", bn: "বুড়ো বেড়ালটা শান্তিতে ঘুমায়। (adjective + noun, verb, adverb)" },
      ],
      tip: { bn: "প্রতিটা ঘরে এক এক করে অন্য শব্দ বসাও: Rafi-র জায়গায় Mitu, hits-এর জায়গায় throws। ঘর একই, বাক্য নতুন।", en: "Swap one slot at a time: Mitu for Rafi, throws for hits. Same slots, new sentence." },
    },
    "players-lines": {
      kind: "lines",
      title: { bn: "একই শব্দ, দুই পজিশন", en: "Same word, two positions" },
      note: { bn: "শোনো, আর মোটা শব্দটা কী কাজ করছে বলো।", en: "Listen, and say what job the key word is doing." },
      lines: [
        { target: "I love a good run in the morning.", bn: "সকালে একটা ভালো দৌড় আমার খুব পছন্দ। (run: noun)" },
        { target: "I run every morning.", bn: "আমি রোজ সকালে দৌড়াই। (run: verb)" },
        { target: "Give me a light, please.", bn: "একটা আলো দাও তো। (light: noun)" },
        { target: "This bag is very light.", bn: "এই ব্যাগটা খুব হালকা। (light: adjective)" },
        { target: "Please water the plants.", bn: "গাছগুলোতে পানি দাও তো। (water: verb)" },
        { target: "The water is cold.", bn: "পানিটা ঠান্ডা। (water: noun)" },
      ],
    },
    "players-bins": {
      kind: "bins",
      title: { bn: "দল সাজাও", en: "Pick the team" },
      note: { bn: "প্রতিটা শব্দকে তার পজিশনে পাঠাও। শব্দগুলো নানুর গল্পের।", en: "Send each word to its position. The words are from Nanu's story." },
      bins: [
        { id: "noun", label: { bn: "noun: নাম", en: "noun" } },
        { id: "verb", label: { bn: "verb: কাজ", en: "verb" } },
        { id: "adj", label: { bn: "adjective: কেমন", en: "adjective" } },
        { id: "small", label: { bn: "ছোট শব্দ: prep / conj", en: "small words: prep / conj" } },
      ],
      items: [
        { text: { bn: "tiger", en: "tiger" }, bin: "noun", why: { bn: "একটা প্রাণী, একটা নাম। আগে the বসে: the tiger।", en: "An animal, a name. The fits before it: the tiger." } },
        { text: { bn: "walked", en: "walked" }, bin: "verb", why: { bn: "হাঁটা একটা কাজ, আর -ed বলছে সেটা অতীতে হয়েছে।", en: "Walking is an action, and -ed says it happened in the past." } },
        { text: { bn: "clever", en: "clever" }, bin: "adj", why: { bn: "শেয়ালটা কেমন? চালাক। নামকে বর্ণনা করছে।", en: "What is the fox like? Clever. It describes the noun." } },
        { text: { bn: "into", en: "into" }, bin: "small", why: { bn: "জঙ্গলের ভিতরে: জায়গার সম্পর্ক, তাই preposition।", en: "Into the forest: a relation of place, so a preposition." } },
        { text: { bn: "but", en: "but" }, bin: "small", why: { bn: "দুটো বাক্য জোড়া লাগাচ্ছে, তাই conjunction।", en: "It joins two sentences, so a conjunction." } },
        { text: { bn: "forest", en: "forest" }, bin: "noun", why: { bn: "একটা জায়গা। জায়গার নাম মানেই noun।", en: "A place. The name of a place is a noun." } },
        { text: { bn: "saw", en: "saw" }, bin: "verb", why: { bn: "see-এর অতীত রূপ। দেখা একটা কাজ।", en: "The past of see. Seeing is an action." } },
        { text: { bn: "dark", en: "dark" }, bin: "adj", why: { bn: "জঙ্গলটা কেমন? অন্ধকার। the dark forest।", en: "What is the forest like? Dark. The dark forest." } },
      ],
    },
    "players-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "Shakib bowls beautifully. এখানে beautifully কী?", en: "Shakib bowls beautifully. What is beautifully?" },
          options: [
            { text: { bn: "adjective", en: "adjective" }, why: { bn: "না। adjective নামকে বর্ণনা করে। এখানে শাকিবকে নয়, তার বোলিং করাটাকে বর্ণনা করা হচ্ছে।", en: "No. An adjective describes a noun. This describes the bowling, not Shakib." } },
            { text: { bn: "adverb", en: "adverb" }, right: true, why: { bn: "হ্যাঁ। কীভাবে বল করে? সুন্দরভাবে। কাজকে বর্ণনা করলেই adverb।", en: "Yes. How does he bowl? Beautifully. Describing the action makes it an adverb." } },
            { text: { bn: "verb", en: "verb" }, why: { bn: "না। কাজটা হলো bowls। beautifully বলছে কাজটা কেমন করে হচ্ছে।", en: "No. The action is bowls. Beautifully says how it is done." } },
          ],
        },
        {
          ask: { bn: "Rafi wants a new bat. এখানে bat কী?", en: "Rafi wants a new bat. What is bat?" },
          options: [
            { text: { bn: "verb", en: "verb" }, why: { bn: "না। bat ক্রিয়াও হতে পারে (to bat), কিন্তু এখানে আগে a new বসেছে, মানে এটা একটা জিনিস।", en: "No. Bat can be a verb, but a new sits before it here, so it is a thing." } },
            { text: { bn: "noun", en: "noun" }, right: true, why: { bn: "হ্যাঁ। একটা জিনিস, আর আগে a বসেছে। রাফি যেটা চায়, সেটা।", en: "Yes. A thing, with a before it. The thing Rafi wants." } },
            { text: { bn: "adjective", en: "adjective" }, why: { bn: "না। adjective হলো new: ব্যাটটা কেমন? নতুন।", en: "No. The adjective is new: what kind of bat? A new one." } },
          ],
        },
        {
          ask: { bn: "Wow, what a catch! এখানে Wow কী?", en: "Wow, what a catch! What is Wow?" },
          options: [
            { text: { bn: "interjection", en: "interjection" }, right: true, why: { bn: "হ্যাঁ। হঠাৎ বেরিয়ে আসা আওয়াজ, বাক্যের সাথে ব্যাকরণের কোনো সম্পর্ক নেই।", en: "Yes. A sudden sound, with no grammatical tie to the sentence." } },
            { text: { bn: "adverb", en: "adverb" }, why: { bn: "না। Wow কোনো কাজকে বর্ণনা করছে না। ওটা শুধু অনুভূতি।", en: "No. Wow describes no action. It is only a feeling." } },
            { text: { bn: "noun", en: "noun" }, why: { bn: "না। কোনো জিনিস বা মানুষ নয়। noun এখানে catch।", en: "No. Not a thing or a person. The noun here is catch." } },
          ],
        },
      ],
    },
    "players-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      note: { bn: "স্ক্রিনের বাইরে, আজই। একটা করে টিক দাও।", en: "Away from the screen, today. Tick each one." },
      steps: [
        { text: { bn: "নিজের ঘরের দশটা জিনিসের ইংরেজি নাম জোরে বলো। প্রতিটা একটা noun।", en: "Say the English name of ten things in your room. Each one is a noun." }, hint: { bn: "table, fan, window, bag…", en: "table, fan, window, bag…" } },
        { text: { bn: "আজ যা যা করেছ, পাঁচটা verb দিয়ে বলো: I ate, I walked, I read…", en: "Say what you did today in five verbs: I ate, I walked, I read…" } },
        { text: { bn: "প্রিয় ক্রিকেটারকে তিনটা adjective দিয়ে বর্ণনা করো, জোরে।", en: "Describe your favourite cricketer in three adjectives, aloud." }, hint: { bn: "calm, brave, fast…", en: "calm, brave, fast…" } },
        { text: { bn: "একটা গানের বা সিনেমার ইংরেজি লাইন নাও, আর প্রতিটা শব্দের পজিশন বলো।", en: "Take one English line from a song or a film and name each word's position." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"nouns": {
  bn: `
<p>মিতু আপু ইংরেজি পরীক্ষায় একটা বাক্য লিখেছিল: <span lang="en">I have many informations about the match.</span> স্যার লাল কালিতে <span lang="en">informations</span> কেটে দিয়েছেন। মিতু বুঝতে পারেনি কেন: একটার বেশি তথ্য থাকলে তো <span lang="en">-s</span> লাগবে? এই পর্বটা সেই প্রশ্নের উত্তর, আর <span lang="en">noun</span> নিয়ে যা যা জানা দরকার তার পুরোটা।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">noun</span> দুই জাতের: গোনা যায় (<span lang="en">countable</span>) আর গোনা যায় না (<span lang="en">uncountable</span>)।</li>
<li>গোনা যায় এমন noun-এর দুটো রূপ: একটা (<span lang="en">cat</span>) আর অনেক (<span lang="en">cats</span>)।</li>
<li>গোনা যায় না এমন noun-এর একটাই রূপ: <span lang="en">water, rice, information, advice</span>। এদের শেষে কখনো <span lang="en">-s</span> নয়।</li>
<li>কয়েকটা noun নিয়ম মানে না: <span lang="en">child, children; man, men; foot, feet</span>। এরা রেবেল, মুখস্থ।</li>
<li>মালিকানা বোঝাতে <span lang="en">'s</span>: <span lang="en">Rafi's bat</span>।</li>
</ul>
</div>

${mount("nouns-pattern")}

<h2>গোনা যায়, নাকি যায় না</h2>

<p>এটাই noun-এর সবচেয়ে গুরুত্বপূর্ণ ভাগ, আর বাংলাভাষীর জন্য সবচেয়ে অচেনা। বাংলায় আমরা বলি "দুটো তথ্য", "তিনটে উপদেশ", "অনেক খবর"। ইংরেজিতে <span lang="en">information, advice, news</span> এমন জিনিস যা তরল পানির মতো: গোনা যায় না, শুধু মাপা যায়। তাই <span lang="en">two informations</span> নয়, <span lang="en">two pieces of information</span>। <span lang="en">an advice</span> নয়, <span lang="en">some advice</span>।</p>

<div class="table-scroll">
<table>
<thead><tr><th>গোনা যায় না</th><th>ভুল</th><th>ঠিক</th></tr></thead>
<tbody>
<tr><td><span lang="en">water</span></td><td><span lang="en">two waters</span></td><td><span lang="en">two glasses of water</span></td></tr>
<tr><td><span lang="en">rice</span></td><td><span lang="en">a rice</span></td><td><span lang="en">a plate of rice</span></td></tr>
<tr><td><span lang="en">information</span></td><td><span lang="en">informations</span></td><td><span lang="en">some information</span></td></tr>
<tr><td><span lang="en">advice</span></td><td><span lang="en">an advice</span></td><td><span lang="en">a piece of advice</span></td></tr>
<tr><td><span lang="en">furniture</span></td><td><span lang="en">furnitures</span></td><td><span lang="en">some furniture</span></td></tr>
<tr><td><span lang="en">homework</span></td><td><span lang="en">homeworks</span></td><td><span lang="en">a lot of homework</span></td></tr>
<tr><td><span lang="en">luggage</span></td><td><span lang="en">luggages</span></td><td><span lang="en">three bags</span></td></tr>
</tbody>
</table>
</div>

<p>একটা কান-পরীক্ষা: শব্দটার আগে <span lang="en">a</span> বা <span lang="en">one</span> বসানো যায়? <span lang="en">a cat</span>: যায়, তাই গোনা যায়। <span lang="en">a rice</span>: যায় না, তাই গোনা যায় না। এই পরীক্ষাটা নব্বই ভাগ সময় ঠিক উত্তর দেয়।</p>

${mount("nouns-bins")}

<h2>একটা থেকে অনেক: -s এর পাঁচটা রূপ</h2>

<p>বেশিরভাগ noun-এ শুধু <span lang="en">-s</span>। কিন্তু শব্দটা কী দিয়ে শেষ হচ্ছে তার উপর পাঁচটা ছোট নিয়ম আছে।</p>

<ol class="step-list">
<li><strong>সাধারণ:</strong> শুধু <span lang="en">-s</span>। <span lang="en">bat, bats; ball, balls; film, films</span>।</li>
<li><strong>শেষে <span lang="en">-s, -sh, -ch, -x</span>:</strong> <span lang="en">-es</span>, কারণ নইলে উচ্চারণ করা যায় না। <span lang="en">bus, buses; match, matches; box, boxes; wish, wishes</span>।</li>
<li><strong>শেষে ব্যঞ্জন + <span lang="en">-y</span>:</strong> <span lang="en">y</span> হয়ে যায় <span lang="en">-ies</span>। <span lang="en">story, stories; city, cities; baby, babies</span>। কিন্তু স্বর + y হলে শুধু -s: <span lang="en">day, days; key, keys</span>।</li>
<li><strong>শেষে <span lang="en">-f</span> বা <span lang="en">-fe</span>:</strong> প্রায়ই <span lang="en">-ves</span>। <span lang="en">leaf, leaves; knife, knives; wife, wives</span>।</li>
<li><strong>রেবেল:</strong> নিয়ম নেই, মুখস্থ। <span lang="en">child, children; man, men; woman, women; foot, feet; tooth, teeth; mouse, mice</span>। আর কয়েকটা একদমই বদলায় না: <span lang="en">sheep, sheep; fish, fish; deer, deer</span>।</li>
</ol>

<div class="ex"><b>ছোট গল্প:</b> নানু বলেন, <span lang="en">Three mice stole two loaves of bread and hid under the leaves.</span> এক লাইনে তিনটে রেবেল: <span lang="en">mice, loaves, leaves</span>। যে গল্পে রেবেলরা থাকে, সেটাই মনে থাকে।</div>

${mount("nouns-gap")}

<h2>কার জিনিস: 's</h2>

<p>বাংলায় "রাফির ব্যাট"। ইংরেজিতে নামের শেষে একটা অ্যাপস্ট্রফি আর s: <span lang="en">Rafi's bat</span>। নামটা যদি আগে থেকেই <span lang="en">-s</span> দিয়ে শেষ হয়, যেমন অনেকের জিনিস, তাহলে শুধু অ্যাপস্ট্রফি: <span lang="en">the players' bus</span>, খেলোয়াড়দের বাস। জিনিসের ক্ষেত্রে সাধারণত <span lang="en">of</span>: <span lang="en">the door of the room</span>, <span lang="en">the room's door</span> নয়।</p>

${mount("nouns-lines")}

<h2>বড় হাতের অক্ষর কোথায়</h2>

<p>বিশেষ নাম (<span lang="en">proper noun</span>) সবসময় বড় হাতের অক্ষরে শুরু: মানুষের নাম, জায়গা, দিন, মাস, ভাষা, উৎসব। <span lang="en">Rafi, Dhaka, Friday, June, Bangla, Eid</span>। সাধারণ নাম (<span lang="en">common noun</span>) ছোট হাতে: <span lang="en">boy, city, day, month, language</span>। মিতু আপুর একটা কৌশল: প্রশ্ন করো, "এই নামের জিনিস দুনিয়ায় কয়টা?" একটা হলে বড় হাত, অনেক হলে ছোট।</p>

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Right form</span> বা <span lang="en">fill in the blanks</span>-এ যদি শূন্যস্থানের আগে <span lang="en">many, few, several, two</span> থাকে, উত্তর অনেক (<span lang="en">plural</span>)। আগে <span lang="en">much, little, a lot of, some</span> থাকলে গোনা যায় না এমন noun হতে পারে, তখন <span lang="en">-s</span> নয়। <span lang="en">many informations</span> লিখলে নম্বর যায়; <span lang="en">much information</span> লিখলে থাকে।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">people</span> শব্দটা দেখতে একবচন, কিন্তু এর মানে "মানুষজন", অনেক। তাই <span lang="en">People is</span> নয়, <span lang="en">People are kind</span>। উল্টো দিকে <span lang="en">news</span> শেষে s আছে, কিন্তু একবচন: <span lang="en">The news is good</span>। <span lang="en">Mathematics, physics, economics</span> সবই একই রকম: s আছে, কিন্তু একটা বিষয়, তাই <span lang="en">is</span>।</p>
</div>

${mount("nouns-drill")}
`,
  blocks: {
    "nouns-pattern": {
      kind: "pattern",
      title: { bn: "একটা, অনেক, মাপা", en: "One, many, measured" },
      shape: "a + cat  ·  two + cats  ·  some + water  ·  a glass of + water",
      why: { bn: "গোনা যায় এমন জিনিসের সাথে সংখ্যা বসে, আর অনেক হলে -s। গোনা যায় না এমন জিনিসের সাথে সংখ্যা বসে না, বসে some, আর মাপতে হলে একটা পাত্র: a cup of, a piece of।", en: "Countable things take a number and an -s when there are many. Uncountable things take no number: some, or a container to measure with, a cup of, a piece of." },
      examples: [
        { target: "I have two cats and a dog.", bn: "আমার দুটো বেড়াল আর একটা কুকুর আছে।" },
        { target: "We need some rice and a bottle of oil.", bn: "আমাদের একটু চাল আর এক বোতল তেল লাগবে।" },
        { target: "She gave me a piece of advice.", bn: "সে আমাকে একটা উপদেশ দিল।" },
        { target: "The children are playing with three balls.", bn: "বাচ্চারা তিনটে বল নিয়ে খেলছে।" },
      ],
      tip: { bn: "সন্দেহ হলে a বসিয়ে দেখো। a ball: হয়। a rice: হয় না। ব্যস।", en: "In doubt, try a before it. A ball works. A rice does not. Done." },
    },
    "nouns-bins": {
      kind: "bins",
      title: { bn: "গোনা যায়, নাকি যায় না", en: "Count it, or measure it" },
      note: { bn: "প্রতিটা শব্দ ঠিক ঘরে ফেলো। কান-পরীক্ষা: আগে a বসে কি না।", en: "Sort each word. The ear test: does a fit before it?" },
      bins: [
        { id: "count", label: { bn: "গোনা যায়: a / two", en: "countable: a / two" }, tone: "good" },
        { id: "mass", label: { bn: "গোনা যায় না: some", en: "uncountable: some" }, tone: "warn" },
      ],
      items: [
        { text: { bn: "match", en: "match" }, bin: "count", why: { bn: "a match, two matches। ম্যাচ গোনা যায়।", en: "A match, two matches. Matches can be counted." } },
        { text: { bn: "information", en: "information" }, bin: "mass", why: { bn: "some information, a piece of information। কখনো informations নয়।", en: "Some information, a piece of information. Never informations." } },
        { text: { bn: "bat", en: "bat" }, bin: "count", why: { bn: "a bat, three bats।", en: "A bat, three bats." } },
        { text: { bn: "homework", en: "homework" }, bin: "mass", why: { bn: "a lot of homework। বাংলায় 'অনেকগুলো হোমওয়ার্ক' বলি, ইংরেজিতে নয়।", en: "A lot of homework. Bangla counts it; English does not." } },
        { text: { bn: "advice", en: "advice" }, bin: "mass", why: { bn: "some advice, a piece of advice।", en: "Some advice, a piece of advice." } },
        { text: { bn: "story", en: "story" }, bin: "count", why: { bn: "a story, many stories। নানুর ঝুলিতে অনেক।", en: "A story, many stories. Nanu has a bag full." } },
        { text: { bn: "money", en: "money" }, bin: "mass", why: { bn: "some money, a lot of money। টাকা গোনা যায়, money যায় না: two takas, কিন্তু some money।", en: "Some money, a lot of money. Takas are counted, money is not." } },
        { text: { bn: "player", en: "player" }, bin: "count", why: { bn: "a player, eleven players।", en: "A player, eleven players." } },
        { text: { bn: "furniture", en: "furniture" }, bin: "mass", why: { bn: "some furniture, a piece of furniture। একটা চেয়ার a chair, কিন্তু সব মিলে furniture।", en: "Some furniture, a piece of furniture. A chair is countable; furniture is not." } },
      ],
    },
    "nouns-gap": {
      kind: "gap",
      title: { bn: "একটা থেকে অনেক", en: "One to many" },
      note: { bn: "ঠিক বহুবচনটা বসাও।", en: "Put in the right plural." },
      items: [
        { text: "Rafi has two new ___.", bn: "রাফির দুটো নতুন ব্যাট আছে।", options: ["bats", "bates", "bat"], right: 0, why: { bn: "সাধারণ noun, শুধু -s: bats। two থাকলে বহুবচন লাগবেই।", en: "A regular noun takes -s: bats. Two demands a plural." } },
        { text: "Bangladesh won three ___ this year.", bn: "বাংলাদেশ এ বছর তিনটে ম্যাচ জিতেছে।", options: ["matchs", "matches", "match"], right: 1, why: { bn: "-ch দিয়ে শেষ, তাই -es: matches। matchs উচ্চারণই করা যায় না।", en: "Ends in -ch, so -es: matches. Matchs cannot even be said." } },
        { text: "Nanu knows a hundred ___.", bn: "নানু একশোটা গল্প জানেন।", options: ["storys", "stories", "story"], right: 1, why: { bn: "ব্যঞ্জন + y, তাই y হয়ে যায় ies: stories।", en: "Consonant + y turns into ies: stories." } },
        { text: "The ___ are playing in the field.", bn: "বাচ্চারা মাঠে খেলছে।", options: ["childs", "childrens", "children"], right: 2, why: { bn: "রেবেল: child থেকে children। childrens বলে কিছু নেই, children-এ আগে থেকেই অনেক।", en: "A rebel: child becomes children. Childrens does not exist; children is already many." } },
        { text: "Please give me some ___.", bn: "আমাকে একটু পানি দাও তো।", options: ["water", "waters", "a water"], right: 0, why: { bn: "গোনা যায় না, তাই some water। শেষে s নয়, আগে a নয়।", en: "Uncountable, so some water. No -s after, no a before." } },
        { text: "Two ___ are grazing near the river.", bn: "দুটো ভেড়া নদীর ধারে ঘাস খাচ্ছে।", options: ["sheeps", "sheep", "sheepes"], right: 1, why: { bn: "sheep কখনো বদলায় না: one sheep, two sheep। fish আর deer-ও তাই।", en: "Sheep never changes: one sheep, two sheep. So do fish and deer." } },
      ],
    },
    "nouns-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: কার জিনিস", en: "Listen, say: whose is it" },
      lines: [
        { target: "This is Rafi's bat.", bn: "এটা রাফির ব্যাট।" },
        { target: "Mitu's exam is on Sunday.", bn: "মিতুর পরীক্ষা রবিবার।" },
        { target: "The players' bus is late.", bn: "খেলোয়াড়দের বাস দেরি করেছে।" },
        { target: "Nanu's stories are the best.", bn: "নানুর গল্পগুলোই সেরা।" },
        { target: "The colour of the sky is grey today.", bn: "আজ আকাশের রং ধূসর।" },
      ],
    },
    "nouns-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "রান্নাঘরে গিয়ে পাঁচটা জিনিস বলো: কোনটা গোনা যায়, কোনটা যায় না। two eggs, some salt…", en: "In the kitchen, name five things: which can be counted, which cannot. Two eggs, some salt…" } },
        { text: { bn: "পাঁচটা রেবেল বহুবচন জোরে বলো, তিনবার: child children, man men, foot feet, tooth teeth, mouse mice।", en: "Say five rebel plurals aloud, three times." } },
        { text: { bn: "পরিবারের তিনজনের একটা করে জিনিস বলো: Baba's phone, Ma's saree, Nanu's glasses।", en: "Name one thing each for three people in your family: Baba's phone, Ma's saree, Nanu's glasses." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"pronouns": {
  bn: `
<p>রাফি লিখছে: <span lang="en">Shakib is my hero. Shakib bats well. Shakib bowls well. I like Shakib.</span> চার বাক্যে চারবার শাকিব। কোচ হলে বলতেন, একজনকে দিয়েই পুরো ম্যাচ চালাচ্ছ কেন? বদলি নামাও। ইংরেজিতে বদলি খেলোয়াড়ের নাম <span lang="en">pronoun</span>: <span lang="en">Shakib is my hero. He bats well. He bowls well. I like him.</span></p>

<p>ছোট শব্দ, কিন্তু বাংলাভাষীর জন্য একটা ফাঁদ আছে: বাংলায় "সে" যে কাজই করুক একই থাকে, ইংরেজিতে <span lang="en">he</span> কাজ করলে <span lang="en">he</span>, কাজ সহ্য করলে <span lang="en">him</span>। এই পর্বে সেটাই।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>কর্তা হলে <span lang="en">I, you, he, she, it, we, they</span>: যে কাজটা করছে।</li>
<li>কর্ম হলে <span lang="en">me, you, him, her, it, us, them</span>: যার উপর কাজটা হচ্ছে।</li>
<li>কার জিনিস, নামের আগে: <span lang="en">my, your, his, her, its, our, their</span>। একা দাঁড়ালে: <span lang="en">mine, yours, his, hers, ours, theirs</span>।</li>
<li>নিজেই নিজেকে: <span lang="en">myself, yourself, himself, herself, itself, ourselves, themselves</span>।</li>
</ul>
</div>

${mount("pronouns-pattern")}

<h2>পুরো ছক</h2>

<div class="table-scroll">
<table>
<thead><tr><th>কে (কর্তা)</th><th>কাকে (কর্ম)</th><th>কার (নামের আগে)</th><th>কার (একা)</th><th>নিজে</th></tr></thead>
<tbody>
<tr><td><span lang="en">I</span></td><td><span lang="en">me</span></td><td><span lang="en">my</span></td><td><span lang="en">mine</span></td><td><span lang="en">myself</span></td></tr>
<tr><td><span lang="en">you</span></td><td><span lang="en">you</span></td><td><span lang="en">your</span></td><td><span lang="en">yours</span></td><td><span lang="en">yourself</span></td></tr>
<tr><td><span lang="en">he</span></td><td><span lang="en">him</span></td><td><span lang="en">his</span></td><td><span lang="en">his</span></td><td><span lang="en">himself</span></td></tr>
<tr><td><span lang="en">she</span></td><td><span lang="en">her</span></td><td><span lang="en">her</span></td><td><span lang="en">hers</span></td><td><span lang="en">herself</span></td></tr>
<tr><td><span lang="en">it</span></td><td><span lang="en">it</span></td><td><span lang="en">its</span></td><td>নেই</td><td><span lang="en">itself</span></td></tr>
<tr><td><span lang="en">we</span></td><td><span lang="en">us</span></td><td><span lang="en">our</span></td><td><span lang="en">ours</span></td><td><span lang="en">ourselves</span></td></tr>
<tr><td><span lang="en">they</span></td><td><span lang="en">them</span></td><td><span lang="en">their</span></td><td><span lang="en">theirs</span></td><td><span lang="en">themselves</span></td></tr>
</tbody>
</table>
</div>

<h2>কর্তা নাকি কর্ম: ক্রিয়ার কোন পাশে</h2>

<p>নিয়মটা এক লাইনে: <strong>ক্রিয়ার আগে কর্তা, ক্রিয়ার পরে কর্ম।</strong> <span lang="en">She called him</span>: <span lang="en">she</span> ডাকল, <span lang="en">him</span>-কে ডাকা হলো। উল্টো করলে <span lang="en">He called her</span>। আর <span lang="en">preposition</span>-এর পরেও কর্ম: <span lang="en">with him, for her, to them, about us</span>। কখনো <span lang="en">with he</span> নয়।</p>

<p>সবচেয়ে বেশি ভুলটা হয় দুজনকে একসাথে বলতে গিয়ে। মিতু আপু আর আমি গেলাম: <span lang="en">Mitu and I went</span>, কারণ আমরা কর্তা। স্যার মিতু আপু আর আমাকে ডাকলেন: <span lang="en">Sir called Mitu and me</span>, কারণ আমরা কর্ম। পরীক্ষা করার কৌশল: অন্যজনকে সরিয়ে দাও। <span lang="en">Sir called me</span> ঠিক, <span lang="en">Sir called I</span> ভুল। তাই <span lang="en">Mitu and me</span>।</p>

${mount("pronouns-lines")}

<h2>কার জিনিস: my নাকি mine</h2>

<p><span lang="en">my</span> সবসময় একটা নামের আগে বসে: <span lang="en">my bat</span>। <span lang="en">mine</span> একা দাঁড়ায়, নাম ছাড়া: <span lang="en">This bat is mine.</span> একই কথা, দুই ছাঁচ। <span lang="en">This is my bat. This bat is mine.</span> <span lang="en">his</span> দুই কাজই করে, তাই ওটা সহজ; <span lang="en">her</span> আর <span lang="en">hers</span> আলাদা।</p>

<div class="ex"><b>Frozen-এর গান মনে করো:</b> <span lang="en">Let it go</span>। <span lang="en">it</span> এখানে কর্ম: ছেড়ে দাও ওটাকে। আর <span lang="en">The Lion King</span>-এ Mufasa বলে, <span lang="en">Everything the light touches is our kingdom.</span> <span lang="en">our</span> বসেছে <span lang="en">kingdom</span>-এর আগে। নামের আগে বসলে <span lang="en">our</span>, একা হলে <span lang="en">ours</span>: <span lang="en">The kingdom is ours.</span></div>

${mount("pronouns-gap")}

<h2>নিজে নিজেই: -self</h2>

<p>কর্তা আর কর্ম একই মানুষ হলে <span lang="en">-self</span>: <span lang="en">Rafi hurt himself</span>, রাফি নিজেকে ব্যথা দিল। <span lang="en">Rafi hurt him</span> মানে অন্য কাউকে। আর জোর দিতে: <span lang="en">I made this cake myself</span>, নিজেই বানিয়েছি, কেউ সাহায্য করেনি। বহুবচনে <span lang="en">-selves</span>: <span lang="en">We enjoyed ourselves</span>, <span lang="en">They did it themselves</span>।</p>

<div class="side-note">
<p class="side-note-label">it আর its আর it's</p>
<p><span lang="en">its</span> মানে "এর", কার জিনিস: <span lang="en">The cat licked its paw.</span> <span lang="en">it's</span> মানে <span lang="en">it is</span>: <span lang="en">It's raining.</span> অ্যাপস্ট্রফি থাকলে দুটো শব্দ, না থাকলে মালিকানা। ইংরেজিতে যারা জন্ম থেকে বলে তারাও এটা ভুল করে, তাই এটা জানলে তুমি এগিয়ে।</p>
</div>

${mount("pronouns-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>শূন্যস্থানটা ক্রিয়ার আগে হলে কর্তা-রূপ (<span lang="en">he, she, they</span>), ক্রিয়ার পরে বা <span lang="en">to, with, for</span>-এর পরে হলে কর্ম-রূপ (<span lang="en">him, her, them</span>)। শূন্যস্থানের পরেই একটা noun থাকলে <span lang="en">my, his, their</span>। শূন্যস্থানের পর কিছু না থাকলে, বাক্য শেষ, তাহলে <span lang="en">mine, hers, theirs</span>।</p>
</div>

${mount("pronouns-drill")}
`,
  blocks: {
    "pronouns-pattern": {
      kind: "pattern",
      title: { bn: "ক্রিয়ার দুই পাশে দুই রূপ", en: "Two forms, either side of the verb" },
      shape: "WHO (I / he / she / they) + VERB + WHOM (me / him / her / them)",
      why: { bn: "বাংলায় 'সে তাকে দেখল': দুটোই 'সে' থেকে আসা। ইংরেজিতে ক্রিয়ার বাঁয়ে he, ডানে him। জায়গাটাই রূপ ঠিক করে।", en: "In Bangla both words come from the same root. In English the left of the verb takes he and the right takes him. The position decides the form." },
      examples: [
        { target: "She helped him with the homework.", bn: "সে তাকে হোমওয়ার্কে সাহায্য করল।" },
        { target: "They invited us to the match.", bn: "তারা আমাদের ম্যাচে ডাকল।" },
        { target: "I told her the whole story.", bn: "আমি তাকে পুরো গল্পটা বললাম।" },
        { target: "We saw them at the stadium.", bn: "আমরা তাদের স্টেডিয়ামে দেখলাম।" },
      ],
      tip: { bn: "with, to, for, about-এর পরেও ডান পাশের রূপ: with him, for us, about them।", en: "After with, to, for, about it is the right-hand form too: with him, for us, about them." },
    },
    "pronouns-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: বদলি নামাও", en: "Listen, say: bring on the substitute" },
      note: { bn: "প্রতিটা জোড়ার দ্বিতীয় বাক্যে নামের বদলে pronoun।", en: "The second sentence of each pair swaps the name for a pronoun." },
      lines: [
        { target: "Mitu is studying. She has an exam tomorrow.", bn: "মিতু পড়ছে। তার কাল পরীক্ষা।" },
        { target: "I called Rafi, but he did not answer.", bn: "আমি রাফিকে ডাকলাম, কিন্তু সে সাড়া দিল না।" },
        { target: "Where is the ball? I cannot find it.", bn: "বলটা কোথায়? আমি ওটা খুঁজে পাচ্ছি না।" },
        { target: "Nanu told us a story, and we loved it.", bn: "নানু আমাদের একটা গল্প বললেন, আর আমরা সেটা খুব পছন্দ করলাম।" },
        { target: "The players are tired. Give them some water.", bn: "খেলোয়াড়রা ক্লান্ত। তাদের একটু পানি দাও।" },
      ],
    },
    "pronouns-gap": {
      kind: "gap",
      title: { bn: "কোন রূপটা বসবে", en: "Which form fits" },
      items: [
        { text: "Tamim and ___ are going to the stadium.", bn: "তামিম আর আমি স্টেডিয়ামে যাচ্ছি।", options: ["me", "I", "my"], right: 1, why: { bn: "কর্তা, ক্রিয়ার আগে। তামিমকে সরিয়ে দেখো: I am going। তাই Tamim and I।", en: "The subject, before the verb. Take Tamim away: I am going. So Tamim and I." } },
        { text: "The coach praised Rafi and ___.", bn: "কোচ রাফি আর আমাকে প্রশংসা করলেন।", options: ["I", "me", "mine"], right: 1, why: { bn: "কর্ম, ক্রিয়ার পরে। রাফিকে সরাও: praised me। তাই Rafi and me।", en: "The object, after the verb. Take Rafi away: praised me. So Rafi and me." } },
        { text: "This phone is ___, not yours.", bn: "এই ফোনটা আমার, তোমার নয়।", options: ["my", "mine", "me"], right: 1, why: { bn: "পরে কোনো noun নেই, বাক্য শেষ, তাই mine। my-এর পরে সবসময় একটা নাম লাগে।", en: "No noun follows and the sentence ends, so mine. My always needs a noun after it." } },
        { text: "The cat is licking ___ paw.", bn: "বেড়ালটা তার থাবা চাটছে।", options: ["it's", "its", "it"], right: 1, why: { bn: "কার থাবা? বেড়ালের। মালিকানা, অ্যাপস্ট্রফি ছাড়া: its। it's মানে it is।", en: "Whose paw? The cat's. Possession, no apostrophe: its. It's means it is." } },
        { text: "Rafi cut ___ while making the salad.", bn: "সালাদ বানাতে গিয়ে রাফি নিজেকে কেটে ফেলল।", options: ["him", "himself", "his"], right: 1, why: { bn: "কর্তা আর কর্ম একই মানুষ, রাফি নিজেকে, তাই himself। him হলে অন্য কেউ কাটা পড়ত।", en: "Subject and object are the same person, so himself. Him would mean somebody else got cut." } },
        { text: "We enjoyed ___ at the fair.", bn: "মেলায় আমরা খুব মজা করলাম।", options: ["us", "ourselves", "our"], right: 1, why: { bn: "enjoy-এর পরে নিজেরাই: ourselves। ইংরেজিতে 'মজা করা' মানে নিজেকে উপভোগ করানো।", en: "After enjoy, ourselves. In English, having fun is enjoying yourself." } },
      ],
    },
    "pronouns-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "কোন বাক্যটা ঠিক?", en: "Which sentence is right?" },
          options: [
            { text: { bn: "Me and Rafi played well.", en: "Me and Rafi played well." }, why: { bn: "না। কর্তা হিসেবে me বসে না। রাফিকে সরাও: Me played well? না।", en: "No. Me cannot be a subject. Remove Rafi: Me played well? No." } },
            { text: { bn: "Rafi and I played well.", en: "Rafi and I played well." }, right: true, why: { bn: "হ্যাঁ। দুজনেই কর্তা, ক্রিয়ার আগে, আর ভদ্রতায় নিজেকে পরে বলা হয়।", en: "Yes. Both are subjects before the verb, and politeness puts yourself last." } },
            { text: { bn: "Rafi and me played well.", en: "Rafi and me played well." }, why: { bn: "না। মানুষ কথায় বলে বটে, কিন্তু পরীক্ষায় নম্বর যাবে: কর্তা হলে I।", en: "No. People say it, but the exam takes the mark: a subject is I." } },
          ],
        },
        {
          ask: { bn: "The book is on the table. Please bring ___ to me.", en: "The book is on the table. Please bring ___ to me." },
          options: [
            { text: { bn: "it", en: "it" }, right: true, why: { bn: "হ্যাঁ। একটা জিনিস, কর্ম হিসেবে it। ক্রিয়ার পরে বসেছে।", en: "Yes. One thing, as the object: it, after the verb." } },
            { text: { bn: "its", en: "its" }, why: { bn: "না। its মানে 'এর', মালিকানা। এখানে বইটাকে আনতে বলা হচ্ছে।", en: "No. Its means belonging to it. Here the book itself is to be brought." } },
            { text: { bn: "them", en: "them" }, why: { bn: "না। বই একটা, them হলো অনেকের জন্য।", en: "No. One book; them is for many." } },
          ],
        },
      ],
    },
    "pronouns-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "পরিবারের প্রত্যেককে নিয়ে একটা বাক্য বলো, নাম দিয়ে, তারপর pronoun দিয়ে: Ma cooks. She cooks.", en: "One sentence about each person at home, first with the name, then with a pronoun: Ma cooks. She cooks." } },
        { text: { bn: "নিজের পাঁচটা জিনিস দেখিয়ে বলো: This is my… This is mine.", en: "Point at five things of yours: This is my… This is mine." } },
        { text: { bn: "আয়নার সামনে: I did it myself. তিনবার, তিন রকম কাজ দিয়ে।", en: "At the mirror: I did it myself. Three times, three different tasks." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"articles": {
  bn: `
<p>তানভীর ভাই একটা মজার কথা বলে: বাংলাভাষী যখন ইংরেজি বলে, তখন হয় সব <span lang="en">the</span>, নয় কোনো <span lang="en">the</span>-ই না। কারণ সহজ। বাংলায় এই শব্দগুলোর কোনো ভাই নেই। "আমি বই পড়ি" আর "আমি বইটা পড়ি": বাংলায় একটা "টা" দিয়ে যেটুকু বোঝাই, ইংরেজিতে সেটাই <span lang="en">a book</span> আর <span lang="en">the book</span>-এর মাঝের দূরত্ব। তিনটা ছোট শব্দ, আর তিনটা প্রশ্ন দিয়ে পুরোটা ধরা যায়।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">a / an</span>: যেকোনো একটা, প্রথমবার বলছি, শ্রোতা জানে না কোনটা। <span lang="en">a book</span>: একটা বই, যেকোনো।</li>
<li><span lang="en">the</span>: নির্দিষ্ট, দুজনেই জানি কোনটা। <span lang="en">the book</span>: বইটা, ওই যে।</li>
<li><span lang="en">a</span> নাকি <span lang="en">an</span>: পরের শব্দের <em>আওয়াজ</em> দিয়ে ঠিক হয়, বানান দিয়ে নয়। <span lang="en">an hour, a university</span>।</li>
<li>কিছুই নয়: বহুবচন আর গোনা যায় না এমন জিনিস, সাধারণভাবে বললে। <span lang="en">I like mangoes. Water is life.</span></li>
</ul>
</div>

${mount("articles-pattern")}

<h2>প্রথম প্রশ্ন: শ্রোতা কি জানে কোনটা?</h2>

<p>এটাই আসল প্রশ্ন। রাফি বাসায় এসে বলল, <span lang="en">I saw a snake today!</span> মা জানেন না কোন সাপ, রাফি প্রথমবার বলছে, তাই <span lang="en">a snake</span>। তারপর, <span lang="en">The snake was under the bench.</span> এখন মা জানেন কোন সাপের কথা হচ্ছে, তাই <span lang="en">the snake</span>। নিয়মটা এক বাক্যে: <strong>প্রথমবার <span lang="en">a</span>, তারপর থেকে <span lang="en">the</span>।</strong></p>

<p>দুনিয়ায় একটাই এমন জিনিসও <span lang="en">the</span>, কারণ সবাই জানে কোনটা: <span lang="en">the sun, the moon, the sky, the internet, the Padma</span>। আর যেটা আশেপাশে একটাই: <span lang="en">Close the door. Turn on the fan.</span> ঘরে একটাই দরজা, তাই <span lang="en">the</span>।</p>

${mount("articles-lines")}

<h2>দ্বিতীয় প্রশ্ন: a নাকি an</h2>

<p>নিয়মটা বানানের নয়, আওয়াজের। পরের শব্দ যদি স্বরধ্বনি দিয়ে শুরু হয় (a, e, i, o, u-এর আওয়াজ), তাহলে <span lang="en">an</span>, নইলে <span lang="en">a</span>। বেশিরভাগ সময় বানান আর আওয়াজ একই: <span lang="en">an apple, an egg, a ball</span>। কিন্তু চারটা ফাঁদ:</p>

<div class="table-scroll">
<table>
<thead><tr><th>শব্দ</th><th>বানান শুরু</th><th>আওয়াজ শুরু</th><th>তাই</th></tr></thead>
<tbody>
<tr><td><span lang="en">hour</span></td><td>h</td><td>আ (h চুপ)</td><td><span lang="en">an hour</span></td></tr>
<tr><td><span lang="en">honest</span></td><td>h</td><td>অ (h চুপ)</td><td><span lang="en">an honest man</span></td></tr>
<tr><td><span lang="en">university</span></td><td>u</td><td>ইউ (y-এর মতো)</td><td><span lang="en">a university</span></td></tr>
<tr><td><span lang="en">one</span></td><td>o</td><td>ওয়া (w-এর মতো)</td><td><span lang="en">a one-day match</span></td></tr>
<tr><td><span lang="en">MP</span></td><td>M</td><td>এম</td><td><span lang="en">an MP</span></td></tr>
</tbody>
</table>
</div>

<h2>তৃতীয় প্রশ্ন: কিছুই লাগবে না তো?</h2>

<p>সাধারণভাবে কোনো জিনিসের কথা বললে, সব বই, সব পানি, সব ক্রিকেট, তখন কিছুই বসে না। <span lang="en">Books are expensive.</span> সব বই। <span lang="en">Cricket is popular in Bangladesh.</span> খেলাটা, সাধারণভাবে। <span lang="en">I love tea.</span> সব চা। কিন্তু নির্দিষ্ট করলেই <span lang="en">the</span> ফিরে আসে: <span lang="en">The tea you made was great.</span> তুমি যে চা-টা বানালে।</p>

<p>নামের আগেও সাধারণত কিছু নয়: <span lang="en">Rafi, Dhaka, Bangladesh, Eid, Monday</span>। ব্যতিক্রম কয়েকটা দেশ আর নদী, পাহাড়ের সারি: <span lang="en">the United States, the Padma, the Himalayas</span>।</p>

${mount("articles-gap")}

<div class="ex"><b>সিনেমার নাম দিয়ে মনে রাখো:</b> <span lang="en">The Lion King</span>: একটাই রাজা, সবাই জানে কে। <span lang="en">A Quiet Place</span>: যেকোনো একটা নিরিবিলি জায়গা। <span lang="en">Finding Nemo</span>: নামের আগে কিছু নয়। তিনটা সিনেমা, তিনটা নিয়ম।</div>

${mount("articles-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Article</span>-এর শূন্যস্থানে তিনটা প্রশ্ন ক্রমে করো: (১) পরের শব্দটা কি বহুবচন বা গোনা যায় না, আর সাধারণভাবে বলা? তাহলে কিছু নয়, একটা ক্রস দাও। (২) দুজনেই কি জানি কোনটা, বা আগে একবার বলা হয়েছে? তাহলে <span lang="en">the</span>। (৩) নইলে <span lang="en">a</span>, আর পরের আওয়াজ স্বর হলে <span lang="en">an</span>। এই ক্রমে গেলে নব্বই ভাগ ঠিক।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>যেসব শব্দে <span lang="en">the</span> লাগে না, বাংলাভাষীরা ঠিক সেগুলোতেই লাগায়: <span lang="en">I go to school</span> (প্রতিষ্ঠান হিসেবে, <span lang="en">the school</span> নয়), <span lang="en">at home, in bed, at night, by bus, play cricket, have breakfast</span>। এগুলো মুখস্থ জোড়া, নিয়ম নয়। উল্টো দিকে <span lang="en">play the guitar</span>: বাদ্যযন্ত্রে <span lang="en">the</span>, খেলায় নয়।</p>
</div>

${mount("articles-drill")}
`,
  blocks: {
    "articles-pattern": {
      kind: "pattern",
      title: { bn: "প্রথমবার a, তারপর the", en: "First time a, then the" },
      shape: "I saw a ____.  The ____ was ____.",
      why: { bn: "যে জিনিসটা প্রথমবার বলছ, শ্রোতা জানে না কোনটা, তাই a। একবার বলে ফেলার পর দুজনেই জানো, তাই the। প্রতিটা গল্প এভাবেই শুরু হয়।", en: "The first time you mention a thing the listener does not know which one, so a. Once said, you both know, so the. Every story begins this way." },
      examples: [
        { target: "I saw a dog. The dog was hungry.", bn: "একটা কুকুর দেখলাম। কুকুরটা ক্ষুধার্ত ছিল।" },
        { target: "Nanu told me a story. The story was about a king.", bn: "নানু একটা গল্প বললেন। গল্পটা এক রাজাকে নিয়ে।" },
        { target: "Rafi bought an egg. The egg was rotten!", bn: "রাফি একটা ডিম কিনল। ডিমটা পচা ছিল!" },
        { target: "There is a ball on the roof. Can you get the ball?", bn: "ছাদে একটা বল আছে। বলটা আনতে পারবে?" },
      ],
      tip: { bn: "the মানে 'ওই যে, তুমি জানো কোনটা'। মনে মনে 'ওই যে' বসিয়ে দেখো; মানে হলে the।", en: "The means that one, you know which. Try saying that one in your head; if it makes sense, the." },
    },
    "articles-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: একটাই, তাই the", en: "Listen, say: only one, so the" },
      lines: [
        { target: "The sun rises in the east.", bn: "সূর্য পূর্ব দিকে ওঠে।" },
        { target: "Please close the window.", bn: "জানালাটা বন্ধ করো তো।" },
        { target: "The captain won the toss.", bn: "অধিনায়ক টস জিতলেন।" },
        { target: "Pass me the salt, please.", bn: "লবণটা দাও তো।" },
        { target: "The internet is slow tonight.", bn: "আজ রাতে ইন্টারনেট ধীর।" },
      ],
    },
    "articles-gap": {
      kind: "gap",
      title: { bn: "a, an, the, নাকি কিছুই না", en: "a, an, the, or nothing" },
      note: { bn: "তিনটা প্রশ্ন ক্রমে করো, তারপর ছোঁও। 'কিছু না' মানে খালি।", en: "Ask the three questions in order, then tap. Nothing means leave it empty." },
      items: [
        { text: "Rafi has ___ new bat. It is red.", bn: "রাফির একটা নতুন ব্যাট আছে। ওটা লাল।", options: ["a", "an", "the"], right: 0, why: { bn: "প্রথমবার বলা হচ্ছে, শ্রোতা জানে না কোন ব্যাট। new শুরু হয় n দিয়ে, তাই a।", en: "First mention, the listener does not know which bat. New starts with an n sound, so a." } },
        { text: "We waited for ___ hour.", bn: "আমরা এক ঘণ্টা অপেক্ষা করলাম।", options: ["a", "an", "the"], right: 1, why: { bn: "hour-এর h চুপ, আওয়াজ শুরু 'আ' দিয়ে, তাই an। বানান নয়, আওয়াজ।", en: "The h in hour is silent; it starts with a vowel sound, so an. Sound, not spelling." } },
        { text: "Mitu goes to ___ university in Dhaka.", bn: "মিতু ঢাকার একটা বিশ্ববিদ্যালয়ে পড়ে।", options: ["a", "an", "the"], right: 0, why: { bn: "university শুরু হয় 'ইউ' আওয়াজে, y-এর মতো, স্বর নয়। তাই a।", en: "University starts with a y sound, not a vowel sound, so a." } },
        { text: "___ moon is very bright tonight.", bn: "আজ রাতে চাঁদটা খুব উজ্জ্বল।", options: ["A", "The", "(nothing)"], right: 1, why: { bn: "চাঁদ একটাই, সবাই জানে কোনটা: the moon।", en: "There is one moon and everybody knows which: the moon." } },
        { text: "I love ___ mangoes.", bn: "আমি আম ভালোবাসি।", options: ["a", "the", "(nothing)"], right: 2, why: { bn: "সব আম, সাধারণভাবে, বহুবচন। কিছুই বসে না।", en: "All mangoes, in general, plural. Nothing goes there." } },
        { text: "Mustafiz is ___ best bowler in the team.", bn: "মুস্তাফিজ দলের সেরা বোলার।", options: ["a", "the", "(nothing)"], right: 1, why: { bn: "best, সেরা একজনই হয়, তাই the। -est বা most দেখলেই the।", en: "Best: there can be only one, so the. See -est or most and the follows." } },
      ],
    },
    "articles-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "কোনটা ঠিক?", en: "Which is right?" },
          options: [
            { text: { bn: "I go to the school by the bus.", en: "I go to the school by the bus." }, why: { bn: "না। school প্রতিষ্ঠান হিসেবে, আর by bus একটা বাঁধা জোড়া: দুটোতেই the নয়।", en: "No. School as an institution and by bus are fixed pairs: no the in either." } },
            { text: { bn: "I go to school by bus.", en: "I go to school by bus." }, right: true, why: { bn: "হ্যাঁ। school-এ পড়তে যাওয়া, আর by bus, by car, by train: কিছু বসে না।", en: "Yes. Going to school to study, and by bus, by car, by train: nothing goes there." } },
            { text: { bn: "I go to a school by a bus.", en: "I go to a school by a bus." }, why: { bn: "না। কোনো একটা স্কুলে যেকোনো একটা বাসে? মানে বদলে যায়। রোজকার যাওয়া বোঝাতে কিছুই না।", en: "No. To some school on some bus? The meaning changes. Daily going takes nothing." } },
          ],
        },
        {
          ask: { bn: "Water is important. এই বাক্যে Water-এর আগে কিছু নেই কেন?", en: "Water is important. Why is there nothing before Water?" },
          options: [
            { text: { bn: "কারণ বাক্যের শুরুতে article বসে না", en: "Because an article cannot start a sentence" }, why: { bn: "না। The match is over: বাক্যের শুরুতে the দিব্যি বসে।", en: "No. The match is over: the starts a sentence happily." } },
            { text: { bn: "কারণ সব পানির কথা, সাধারণভাবে, আর পানি গোনা যায় না", en: "Because it means all water, in general, and water is uncountable" }, right: true, why: { bn: "হ্যাঁ। সাধারণভাবে গোনা যায় না এমন জিনিস: কিছুই বসে না। নির্দিষ্ট হলে the: The water in this glass is cold.", en: "Yes. An uncountable thing in general takes nothing. Made specific it takes the: The water in this glass is cold." } },
            { text: { bn: "ভুল আছে, a water হবে", en: "It is wrong; it should be a water" }, why: { bn: "না। a water হয় না, পানি গোনা যায় না। a glass of water হয়।", en: "No. A water is impossible; water is uncountable. A glass of water works." } },
          ],
        },
      ],
    },
    "articles-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "একটা ছোট গল্প বলো: I saw a… The… was… তিনটা আলাদা জিনিস দিয়ে।", en: "Tell a tiny story: I saw a… The… was… with three different things." } },
        { text: { bn: "ঘরের একটাই আছে এমন পাঁচটা জিনিস the দিয়ে বলো: the door, the fan, the ceiling…", en: "Name five things there is only one of in the room, with the: the door, the fan, the ceiling…" } },
        { text: { bn: "an দিয়ে পাঁচটা: an egg, an apple, an hour, an umbrella, an honest friend।", en: "Five with an: an egg, an apple, an hour, an umbrella, an honest friend." } },
        { text: { bn: "তোমার প্রিয় পাঁচটা জিনিস সাধারণভাবে, কিছু ছাড়া: I love mangoes, cricket, tea…", en: "Five favourite things in general, with nothing: I love mangoes, cricket, tea…" } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"adjectives": {
  bn: `
<p>নানু একটা গল্প শুরু করেন, "এক ছিল রাজা।" রাফি বলে, "কেমন রাজা?" নানু বলেন, "লোভী, বুড়ো, আর ভীষণ একা।" ওই তিনটে শব্দে রাজাটা জ্যান্ত হয়ে উঠল। ইংরেজিতে ওই শব্দগুলোর নাম <span lang="en">adjective</span>: <span lang="en">a greedy, old, lonely king</span>। নামের রং।</p>

<p>আর একটা adjective-এর আসল খেলা শুরু হয় যখন দুটো জিনিসের তুলনা হয়: তামিম লম্বা, কিন্তু মাশরাফি আরও লম্বা, আর দলে সবচেয়ে লম্বা কে? <span lang="en">tall, taller, tallest</span>। এই পর্বে দুটোই।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">adjective</span> বসে noun-এর <em>আগে</em> (<span lang="en">a fast bowler</span>) বা <span lang="en">be</span>-র <em>পরে</em> (<span lang="en">The bowler is fast</span>)।</li>
<li>দুটোর তুলনা: <span lang="en">-er</span> বা <span lang="en">more</span>, সাথে <span lang="en">than</span>। <span lang="en">taller than, more beautiful than</span>।</li>
<li>অনেকের মধ্যে সেরা: <span lang="en">the -est</span> বা <span lang="en">the most</span>। <span lang="en">the tallest, the most beautiful</span>।</li>
<li>ছোট শব্দে <span lang="en">-er/-est</span>, লম্বা শব্দে <span lang="en">more/most</span>। কান দিয়েই বোঝা যায়।</li>
<li>রেবেল: <span lang="en">good, better, best; bad, worse, worst; far, farther, farthest</span>।</li>
</ul>
</div>

${mount("adjectives-pattern")}

<h2>রং লাগানোর দুই জায়গা</h2>

<p>বাংলায় বিশেষণ নামের আগেই বসে: "লাল বল"। ইংরেজিতেও তাই, <span lang="en">a red ball</span>। কিন্তু ইংরেজিতে আরেকটা জায়গা আছে যেটা বাংলায় লুকিয়ে থাকে: "বলটা লাল" বলতে বাংলায় মাঝে কিছু লাগে না, ইংরেজিতে <span lang="en">be</span> লাগে। <span lang="en">The ball is red.</span> দুই জায়গা, একই শব্দ।</p>

<p>একাধিক adjective একসাথে বসলে ইংরেজির একটা গোপন ক্রম আছে, যেটা সবাই মানে কিন্তু কেউ শেখে না: <strong>মত, আকার, বয়স, রং, উৎস, উপাদান</strong>। <span lang="en">a beautiful big old red Bangladeshi wooden boat</span>। কেউ পুরোটা একসাথে বলে না, কিন্তু <span lang="en">a red big ball</span> শুনলে কান খচ করে ওঠে, <span lang="en">a big red ball</span> শুনলে না। আকার আগে, রং পরে।</p>

${mount("adjectives-lines")}

<h2>তুলনা: -er নাকি more</h2>

<p>নিয়মটা শব্দের দৈর্ঘ্যের। এক সিলেবলের ছোট শব্দে <span lang="en">-er, -est</span>: <span lang="en">tall, taller, tallest; fast, faster, fastest</span>। তিন বা তার বেশি সিলেবলের লম্বা শব্দে <span lang="en">more, most</span>: <span lang="en">beautiful, more beautiful, most beautiful; expensive, more expensive, most expensive</span>। দুই সিলেবলের শব্দ মাঝামাঝি: <span lang="en">-y</span> দিয়ে শেষ হলে <span lang="en">-ier</span> (<span lang="en">happy, happier, happiest; easy, easier, easiest</span>), নইলে বেশিরভাগ সময় <span lang="en">more</span> (<span lang="en">more careful, more famous</span>)।</p>

<div class="table-scroll">
<table>
<thead><tr><th>শব্দ</th><th>দুজনের তুলনা</th><th>সবার সেরা</th><th>নিয়ম</th></tr></thead>
<tbody>
<tr><td><span lang="en">fast</span></td><td><span lang="en">faster</span></td><td><span lang="en">the fastest</span></td><td>ছোট শব্দ, <span lang="en">-er</span></td></tr>
<tr><td><span lang="en">big</span></td><td><span lang="en">bigger</span></td><td><span lang="en">the biggest</span></td><td>শেষের ব্যঞ্জন দুবার</td></tr>
<tr><td><span lang="en">happy</span></td><td><span lang="en">happier</span></td><td><span lang="en">the happiest</span></td><td><span lang="en">y</span> হয়ে যায় <span lang="en">i</span></td></tr>
<tr><td><span lang="en">famous</span></td><td><span lang="en">more famous</span></td><td><span lang="en">the most famous</span></td><td>লম্বা শব্দ, <span lang="en">more</span></td></tr>
<tr><td><span lang="en">good</span></td><td><span lang="en">better</span></td><td><span lang="en">the best</span></td><td>রেবেল</td></tr>
<tr><td><span lang="en">bad</span></td><td><span lang="en">worse</span></td><td><span lang="en">the worst</span></td><td>রেবেল</td></tr>
<tr><td><span lang="en">little</span></td><td><span lang="en">less</span></td><td><span lang="en">the least</span></td><td>রেবেল</td></tr>
</tbody>
</table>
</div>

<p>দুটোর তুলনায় সবসময় <span lang="en">than</span>: <span lang="en">Rafi is taller than Mitu.</span> সবার সেরায় সবসময় <span lang="en">the</span>: <span lang="en">Shakib is the best all-rounder.</span> আর কখনো দুটো একসাথে নয়: <span lang="en">more taller</span> বলে কিছু নেই। এটা বাংলাভাষীর একটা প্রিয় ভুল, কারণ বাংলায় "আরও বেশি লম্বা" বলা যায়।</p>

${mount("adjectives-gap")}

<h2>সমান সমান: as … as</h2>

<p>কেউ কারও চেয়ে বেশি না হলে: <span lang="en">Rafi is as tall as Mitu.</span> রাফি মিতুর মতোই লম্বা। না-বাচক করলে: <span lang="en">Rafi is not as tall as Tamim.</span> তুলনার তিনটে সিঁড়ি একসাথে: <span lang="en">as tall as, taller than, the tallest</span>।</p>

<div class="ex"><b>ক্রিকেট ধারাভাষ্য শোনো:</b> <span lang="en">Mustafiz is quicker than he looks. But today the pitch is slower, so the batters are more comfortable. This is the best over of the match!</span> চার লাইন, চার রকম তুলনা। ধারাভাষ্যকাররা adjective ছাড়া দুই মিনিট কথা বলতে পারেন না।</div>

${mount("adjectives-match")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>শূন্যস্থানের পরে <span lang="en">than</span> দেখলেই <span lang="en">-er</span> বা <span lang="en">more</span>। আগে <span lang="en">the</span> আর বাক্যে <span lang="en">of all, in the class, in the world</span> দেখলে <span lang="en">-est</span> বা <span lang="en">most</span>। <span lang="en">as</span> দেখলে সাধারণ রূপ। বন্ধনীতে <span lang="en">good</span> থাকলে থামো: উত্তর <span lang="en">gooder</span> নয়, <span lang="en">better</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">-ing</span> আর <span lang="en">-ed</span> দিয়ে বানানো adjective দুটো আলাদা জিনিস। <span lang="en">The film is boring</span>: সিনেমাটা বিরক্তিকর। <span lang="en">I am bored</span>: আমি বিরক্ত। <span lang="en">I am boring</span> বললে মানে দাঁড়ায় "আমি একজন বিরক্তিকর মানুষ"। জিনিসটা <span lang="en">-ing</span>, তোমার অনুভূতি <span lang="en">-ed</span>: <span lang="en">exciting match, excited fans</span>।</p>
</div>

${mount("adjectives-drill")}
`,
  blocks: {
    "adjectives-pattern": {
      kind: "pattern",
      title: { bn: "তুলনার তিন সিঁড়ি", en: "The three steps of comparison" },
      shape: "as ___ as  ·  ___er than / more ___ than  ·  the ___est / the most ___",
      why: { bn: "সমান হলে as … as। দুজনের মধ্যে একজন বেশি হলে -er than বা more … than। অনেকের মধ্যে একজন সবার উপরে হলে the -est বা the most। শব্দ ছোট হলে -er, লম্বা হলে more।", en: "Equal: as … as. One of two is more: -er than or more … than. One of many is above all: the -est or the most. Short words take -er, long words take more." },
      examples: [
        { target: "Rafi is as tall as Mitu.", bn: "রাফি মিতুর মতোই লম্বা।" },
        { target: "Tamim is taller than Rafi.", bn: "তামিম রাফির চেয়ে লম্বা।" },
        { target: "Mashrafe is the tallest of them all.", bn: "মাশরাফি তাদের সবার মধ্যে সবচেয়ে লম্বা।" },
        { target: "This film is more exciting than the last one.", bn: "এই সিনেমাটা আগেরটার চেয়ে বেশি উত্তেজনাপূর্ণ।" },
        { target: "It is the most exciting film of the year.", bn: "এটা বছরের সবচেয়ে উত্তেজনাপূর্ণ সিনেমা।" },
      ],
      tip: { bn: "than শুনলে -er, the শুনলে -est। দুটো একসাথে কখনো নয়: more taller বলে কিছু নেই।", en: "Hear than, think -er; hear the, think -est. Never both at once: there is no more taller." },
    },
    "adjectives-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: দুই জায়গায় রং", en: "Listen, say: colour in two places" },
      lines: [
        { target: "Shakib is a calm captain.", bn: "শাকিব একজন শান্ত অধিনায়ক। (নামের আগে)" },
        { target: "Shakib is calm.", bn: "শাকিব শান্ত। (be-র পরে)" },
        { target: "Nanu makes a delicious pitha.", bn: "নানু খুব মজার পিঠা বানান।" },
        { target: "The pitha is delicious.", bn: "পিঠাটা খুব মজার।" },
        { target: "It was a long, hot, tiring day.", bn: "দিনটা ছিল লম্বা, গরম আর ক্লান্তিকর।" },
      ],
    },
    "adjectives-gap": {
      kind: "gap",
      title: { bn: "কোন সিঁড়িতে", en: "Which step" },
      items: [
        { text: "Rafi runs ___ than his friend.", bn: "রাফি তার বন্ধুর চেয়ে দ্রুত দৌড়ায়।", options: ["fast", "faster", "more faster", "fastest"], right: 1, why: { bn: "than আছে, দুজনের তুলনা, ছোট শব্দ: faster। more faster দুটো একসাথে, ভুল।", en: "Than is there, two are compared, short word: faster. More faster doubles up and is wrong." } },
        { text: "This is the ___ story Nanu has ever told.", bn: "এটা নানুর বলা সবচেয়ে মজার গল্প।", options: ["funny", "funnier", "funniest", "most funny"], right: 2, why: { bn: "the আছে, ever আছে: সবার সেরা। funny-র y হয়ে যায় i: funniest।", en: "The and ever say best of all. The y of funny becomes i: funniest." } },
        { text: "Dhaka is ___ than Sylhet.", bn: "ঢাকা সিলেটের চেয়ে বেশি জনবহুল।", options: ["crowded", "crowdeder", "more crowded", "most crowded"], right: 2, why: { bn: "লম্বা শব্দ, তাই more crowded than। crowdeder উচ্চারণই হয় না।", en: "A long word takes more: more crowded than. Crowdeder cannot be said." } },
        { text: "Mitu's marks are ___ than mine.", bn: "মিতুর নম্বর আমার চেয়ে ভালো।", options: ["gooder", "better", "more good", "best"], right: 1, why: { bn: "good একটা রেবেল: good, better, best। than আছে, তাই better।", en: "Good is a rebel: good, better, best. Than is there, so better." } },
        { text: "Mustafiz is ___ good as Shakib with the ball.", bn: "বল হাতে মুস্তাফিজ শাকিবের মতোই ভালো।", options: ["as", "than", "more"], right: 0, why: { bn: "as good as: সমান সমান। as-এর সাথে সাধারণ রূপ, কোনো -er নয়।", en: "As good as: equal. With as, the plain form and no -er." } },
        { text: "It is the ___ day of the year.", bn: "এটা বছরের সবচেয়ে গরম দিন।", options: ["hot", "hotter", "hottest", "most hot"], right: 2, why: { bn: "the … of the year: সবার সেরা। ছোট শব্দ, শেষের t দুবার: hottest।", en: "The … of the year: best of all. Short word, double the t: hottest." } },
      ],
    },
    "adjectives-match": {
      kind: "match",
      title: { bn: "-ing নাকি -ed", en: "-ing or -ed" },
      note: { bn: "বাঁ দিকের কথাটা ডান দিকের ঠিক শব্দটার সাথে মেলাও।", en: "Match the phrase on the left with the right word on the right." },
      pairs: [
        { left: { bn: "ম্যাচটা দারুণ উত্তেজনার", en: "the match was full of excitement" }, right: { bn: "an exciting match", en: "an exciting match" } },
        { left: { bn: "দর্শকরা উত্তেজিত", en: "the crowd felt excitement" }, right: { bn: "excited fans", en: "excited fans" } },
        { left: { bn: "লেকচারটা বিরক্তিকর", en: "the lecture caused boredom" }, right: { bn: "a boring lecture", en: "a boring lecture" } },
        { left: { bn: "ছাত্ররা বিরক্ত", en: "the students felt boredom" }, right: { bn: "bored students", en: "bored students" } },
        { left: { bn: "খবরটা চমকে দেওয়ার মতো", en: "the news caused surprise" }, right: { bn: "surprising news", en: "surprising news" } },
      ],
    },
    "adjectives-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "দুই ক্রিকেটার নাও আর পাঁচটা তুলনা বলো: X is faster than Y. Y is more patient than X.", en: "Take two cricketers and say five comparisons: X is faster than Y. Y is more patient than X." } },
        { text: { bn: "পরিবারের সবচেয়ে … কে? পাঁচটা the -est বাক্য: Nanu is the oldest. Rafi is the noisiest.", en: "Who is the most … in the family? Five the -est sentences." } },
        { text: { bn: "নিজের ঘরের তিনটা জিনিসকে দুটো করে adjective দাও, ঠিক ক্রমে: a small blue bag।", en: "Give three things in your room two adjectives each, in the right order: a small blue bag." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"agreement": {
  bn: `
<p>মিতু আপুর SSC-র মডেল টেস্টের খাতা ফেরত এসেছে। <span lang="en">Right form of verbs</span>-এ দশে ছয়। চারটা ভুলের তিনটাই একই ভুল: <span lang="en">She play, He go, The boy run</span>। একটা অক্ষর কম, একটা করে নম্বর কম। এই পর্ব ওই একটা অক্ষরের।</p>

<p>ইংরেজিতে কর্তা আর ক্রিয়াকে মিলতে হয়, ঠিক যেমন বাংলায় "আমি খাই" কিন্তু "সে খায়"। বাংলায় আমরা এটা না ভেবেই করি। ইংরেজির নিয়মটা আরও সহজ, কারণ বদলটা হয় মাত্র এক জায়গায়: <strong>একজন তৃতীয় ব্যক্তি, বর্তমান কাল, ক্রিয়ায় একটা <span lang="en">-s</span>।</strong></p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">he, she, it</span>, বা একজন মানুষ, একটা জিনিস: ক্রিয়ার শেষে <span lang="en">-s</span>। <span lang="en">She plays. Rafi plays. The cat sleeps.</span></li>
<li><span lang="en">I, you, we, they</span>, বা অনেকজন: কোনো <span lang="en">-s</span> নয়। <span lang="en">They play. The boys play.</span></li>
<li><span lang="en">be</span> আর <span lang="en">have</span> নিজেদের রূপ বদলায়: <span lang="en">am/is/are, has/have</span>।</li>
<li>অতীত কালে এই নিয়ম নেই: <span lang="en">She played. They played.</span> সবার এক।</li>
<li>টুপি একটাই: হয় কর্তায় <span lang="en">-s</span> (অনেক), নয় ক্রিয়ায় <span lang="en">-s</span> (একজন)। দুটোতে একসাথে না, কোনোটাতেও না, এমন হয় না।</li>
</ul>
</div>

${mount("agreement-pattern")}

<h2>টুপির নিয়ম</h2>

<p>একটা ছবি মনে রাখো: বাক্যে একটাই টুপি আছে, আর কেউ একজন সেটা পরবে। কর্তা যদি অনেক হয়, <span lang="en">boys, cats, players</span>, তাহলে কর্তা টুপিটা পরেছে (<span lang="en">-s</span> কর্তায়), ক্রিয়া খালি মাথায়: <span lang="en">The boys play.</span> কর্তা যদি একজন হয়, <span lang="en">boy, cat, Rafi, she</span>, তাহলে টুপিটা ক্রিয়ার: <span lang="en">The boy plays.</span></p>

<p>ব্যতিক্রম শুধু <span lang="en">I</span> আর <span lang="en">you</span>: এরা একজন হলেও টুপি নেয় না। <span lang="en">I play. You play.</span> কারণ ইতিহাস, কারণ নেই। মুখস্থ।</p>

<div class="table-scroll">
<table>
<thead><tr><th>কর্তা</th><th>সাধারণ ক্রিয়া</th><th><span lang="en">be</span></th><th><span lang="en">have</span></th><th><span lang="en">do</span></th></tr></thead>
<tbody>
<tr><td><span lang="en">I</span></td><td><span lang="en">play</span></td><td><span lang="en">am</span></td><td><span lang="en">have</span></td><td><span lang="en">do</span></td></tr>
<tr><td><span lang="en">you, we, they</span></td><td><span lang="en">play</span></td><td><span lang="en">are</span></td><td><span lang="en">have</span></td><td><span lang="en">do</span></td></tr>
<tr><td><span lang="en">he, she, it, Rafi</span></td><td><span lang="en">plays</span></td><td><span lang="en">is</span></td><td><span lang="en">has</span></td><td><span lang="en">does</span></td></tr>
</tbody>
</table>
</div>

${mount("agreement-lines")}

<h2>-s বসানোর বানান</h2>

<p>noun-এর বহুবচনের যে নিয়ম, ক্রিয়ার <span lang="en">-s</span>-এরও ঠিক তাই। শেষে <span lang="en">-s, -sh, -ch, -x, -o</span> থাকলে <span lang="en">-es</span>: <span lang="en">watches, washes, fixes, goes, does</span>। ব্যঞ্জন + <span lang="en">y</span> হলে <span lang="en">-ies</span>: <span lang="en">study, studies; cry, cries; fly, flies</span>। স্বর + y হলে শুধু -s: <span lang="en">plays, enjoys, buys</span>। আর <span lang="en">have</span> হয়ে যায় <span lang="en">has</span>, নিয়ম ছাড়াই।</p>

${mount("agreement-gap")}

<h2>কর্তা কোথায় লুকিয়ে আছে</h2>

<p>সহজ বাক্যে সবাই পারে। পরীক্ষায় ফাঁদ পাতা হয় কর্তা আর ক্রিয়ার মাঝে কিছু ঢুকিয়ে। <span lang="en">The captain of the players ___ tired.</span> কর্তা কে? <span lang="en">captain</span>, একজন। <span lang="en">players</span> শুধু পাশে দাঁড়িয়ে আছে, <span lang="en">of</span>-এর পিছনে। তাই <span lang="en">is</span>। কৌশল: <span lang="en">of, with, in</span> দিয়ে শুরু হওয়া অংশটা হাত দিয়ে ঢেকে দাও, তারপর দেখো কর্তা একজন না অনেক।</p>

<p>আরও কয়েকটা লুকানো কর্তা:</p>

<ul>
<li><span lang="en">Everyone, everybody, someone, nobody, each</span>: দেখতে অনেক, আসলে একজন। <span lang="en">Everyone loves Shakib. Nobody knows.</span></li>
<li><span lang="en">Rafi and Mitu</span>: <span lang="en">and</span> দিয়ে জোড়া, তাই অনেক। <span lang="en">Rafi and Mitu are cousins.</span></li>
<li><span lang="en">Rafi or Mitu</span>: <span lang="en">or</span> হলে যে কাছে, তার সাথে মিল। <span lang="en">Rafi or Mitu is coming.</span></li>
<li><span lang="en">Rice, water, news, mathematics</span>: গোনা যায় না, তাই একজনের মতো। <span lang="en">The news is good.</span></li>
<li><span lang="en">There is a bat. There are two bats.</span> <span lang="en">There</span> কর্তা নয়, তার পরে যেটা আছে সেটা কর্তা।</li>
</ul>

${mount("agreement-spot")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Right form of verbs</span>-এ তিনটা প্রশ্ন ক্রমে: (১) কালটা কী, বর্তমান না অতীত? অতীত হলে <span lang="en">-ed</span> বা রেবেল রূপ, <span lang="en">-s</span>-এর প্রশ্নই নেই। (২) বর্তমান হলে কর্তা একজন না অনেক? <span lang="en">of, with</span>-এর অংশ ঢেকে দাও। (৩) একজন, আর <span lang="en">I/you</span> নয়? তাহলে <span lang="en">-s</span>। প্রশ্নপত্রের প্রতিটা ফাঁকা ঘরে এই তিন প্রশ্ন, এক নিঃশ্বাসে।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">does, doesn't, can, will, must</span>-এর পরে ক্রিয়া সবসময় খালি মাথায়। <span lang="en">She doesn't plays</span> ভুল: টুপিটা <span lang="en">does</span> আগেই পরে নিয়েছে, তাই <span lang="en">She doesn't play.</span> <span lang="en">He can plays</span> ভুল, <span lang="en">He can play</span> ঠিক। একটা বাক্যে একটাই টুপি।</p>
</div>

${mount("agreement-drill")}
`,
  blocks: {
    "agreement-pattern": {
      kind: "pattern",
      title: { bn: "একটাই টুপি", en: "One hat" },
      shape: "He / She / It / Rafi + VERB-s   ·   I / You / We / They / the boys + VERB",
      why: { bn: "বর্তমান কালে একজন তৃতীয় ব্যক্তি হলে ক্রিয়ায় একটা -s। বাকি সবাই খালি ক্রিয়া। কর্তা অনেক হলে টুপি কর্তার মাথায়, ক্রিয়ার নয়।", en: "In the present, one third person puts an -s on the verb. Everybody else takes the bare verb. Many subjects wear the hat themselves, so the verb does not." },
      examples: [
        { target: "Rafi plays cricket every evening.", bn: "রাফি রোজ সন্ধ্যায় ক্রিকেট খেলে।" },
        { target: "His friends play with him.", bn: "তার বন্ধুরা তার সাথে খেলে।" },
        { target: "Mitu studies at night.", bn: "মিতু রাতে পড়ে।" },
        { target: "The cat has a red collar.", bn: "বেড়ালটার একটা লাল কলার আছে।" },
        { target: "I have two sisters.", bn: "আমার দুই বোন।" },
      ],
      tip: { bn: "কর্তার শেষে s আছে? তাহলে ক্রিয়ায় নেই। কর্তায় নেই? তাহলে ক্রিয়ায় আছে। I আর you-কে বাদ রেখে।", en: "An s on the subject means none on the verb, and none on the subject means one on the verb, with I and you the exception." },
    },
    "agreement-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: টুপি বদল", en: "Listen, say: swap the hat" },
      note: { bn: "প্রতিটা জোড়ায় একই কাজ, একজন আর অনেকে। -s কোথায় গেল শোনো।", en: "Each pair is the same action for one and for many. Listen to where the -s goes." },
      lines: [
        { target: "The boy runs. The boys run.", bn: "ছেলেটা দৌড়ায়। ছেলেরা দৌড়ায়।" },
        { target: "She watches films. They watch films.", bn: "সে সিনেমা দেখে। তারা সিনেমা দেখে।" },
        { target: "Nanu has a story. We have a question.", bn: "নানুর একটা গল্প আছে। আমাদের একটা প্রশ্ন আছে।" },
        { target: "Rafi does his homework. You do yours.", bn: "রাফি তার হোমওয়ার্ক করে। তুমি তোমারটা করো।" },
        { target: "Everyone loves a good story.", bn: "সবাই ভালো গল্প ভালোবাসে।" },
      ],
    },
    "agreement-gap": {
      kind: "gap",
      title: { bn: "টুপিটা কার", en: "Whose hat is it" },
      items: [
        { text: "Mitu ___ English every morning.", bn: "মিতু রোজ সকালে ইংরেজি পড়ে।", options: ["study", "studies", "studys"], right: 1, why: { bn: "Mitu একজন, বর্তমান কাল: -s। ব্যঞ্জন + y, তাই studies।", en: "Mitu is one person in the present: -s. Consonant + y, so studies." } },
        { text: "The players ___ hard before a match.", bn: "খেলোয়াড়রা ম্যাচের আগে কঠোর অনুশীলন করে।", options: ["practises", "practise", "practising"], right: 1, why: { bn: "players অনেক, টুপি কর্তার মাথায়, ক্রিয়া খালি: practise।", en: "Players are many; the subject wears the hat and the verb is bare: practise." } },
        { text: "The captain of the players ___ a speech.", bn: "খেলোয়াড়দের অধিনায়ক একটা বক্তৃতা দেন।", options: ["give", "gives", "giving"], right: 1, why: { bn: "কর্তা captain, একজন। of the players ঢেকে দাও। তাই gives।", en: "The subject is captain, one person. Cover of the players. So gives." } },
        { text: "Everybody ___ Nanu's pitha.", bn: "সবাই নানুর পিঠা পছন্দ করে।", options: ["like", "likes", "liking"], right: 1, why: { bn: "everybody দেখতে অনেক, ব্যাকরণে একজন: likes।", en: "Everybody looks like many and counts as one: likes." } },
        { text: "Rafi doesn't ___ spinach.", bn: "রাফি পালংশাক পছন্দ করে না।", options: ["likes", "like", "liked"], right: 1, why: { bn: "টুপিটা does আগেই পরেছে, তাই ক্রিয়া খালি: doesn't like।", en: "Does already wears the hat, so the verb is bare: doesn't like." } },
        { text: "There ___ three mangoes on the table.", bn: "টেবিলে তিনটে আম আছে।", options: ["is", "are", "be"], right: 1, why: { bn: "There কর্তা নয়। কর্তা three mangoes, অনেক: are।", en: "There is not the subject. Three mangoes is, and it is many: are." } },
      ],
    },
    "agreement-spot": {
      kind: "spot",
      title: { bn: "মিতু আপুর খাতা", en: "Mitu's exam paper" },
      note: { bn: "স্যারের মতো লাল কালি হাতে নাও। যে লাইনে ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line with a mistake in it." },
      source: { bn: "মডেল টেস্ট, অনুচ্ছেদ লেখা", en: "Model test, paragraph writing" },
      lines: [
        { text: { bn: "My cousin Rafi love cricket more than anything.", en: "My cousin Rafi love cricket more than anything." }, flag: { bn: "Rafi একজন, বর্তমান কাল: loves।", en: "Rafi is one person in the present: loves." } },
        { text: { bn: "He plays every evening with his friends.", en: "He plays every evening with his friends." } },
        { text: { bn: "His friends also likes the game.", en: "His friends also likes the game." }, flag: { bn: "friends অনেক, ক্রিয়া খালি: like।", en: "Friends are many, the verb is bare: like." } },
        { text: { bn: "The captain of their team is very strict.", en: "The captain of their team is very strict." } },
        { text: { bn: "Everyone in the team want to win.", en: "Everyone in the team want to win." }, flag: { bn: "everyone একজন, in the team ঢেকে দাও: wants।", en: "Everyone counts as one; cover in the team: wants." } },
        { text: { bn: "Rafi doesn't likes losing.", en: "Rafi doesn't likes losing." }, flag: { bn: "does টুপি পরে ফেলেছে, তাই like। একটা বাক্যে একটাই টুপি।", en: "Does already has the hat, so like. One hat per sentence." } },
        { text: { bn: "But he always shakes hands after the match.", en: "But he always shakes hands after the match." } },
      ],
    },
    "agreement-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "পরিবারের প্রত্যেকে রোজ কী করে, একটা করে বাক্য, -s সহ: Ma cooks. Baba reads the paper. Nanu prays.", en: "One sentence for what each person at home does daily, with the -s: Ma cooks. Baba reads the paper. Nanu prays." } },
        { text: { bn: "তারপর দুজনকে একসাথে করে বলো, -s ছাড়া: Ma and Baba watch the news.", en: "Then pair two of them up, without the -s: Ma and Baba watch the news." } },
        { text: { bn: "পাঁচটা ক্রিয়ার -es রূপ জোরে: goes, does, watches, washes, studies।", en: "Five -es forms aloud: goes, does, watches, washes, studies." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"tenses": {
  bn: `
<p>ডোরেমনের টাইম মেশিন মনে আছে? নোবিতা ডেস্কের ড্রয়ার খুলে অতীতে চলে যায়, ভবিষ্যতে চলে যায়। ইংরেজি ক্রিয়াও ঠিক তাই করে, কিন্তু ড্রয়ার নয়, ক্রিয়ার রূপ বদলে। <span lang="en">I eat, I ate, I will eat</span>: একই কাজ, তিন সময়। আর প্রতিটা সময়ে চার রকম করে বলা যায়: কাজটা এমনি হয়, চলছে, শেষ হয়েছে, নাকি শেষ-হওয়া-চলছে। তিন গুণ চার, বারোটা ঘর। এই পর্বে পুরো মানচিত্র, আর মাঝের ছয়টা ঘরে আজই ঢুকে পড়া। বাকি ছয়টা পর্ব ১১-তে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>তিন কাল: <span lang="en">present</span> (আজ), <span lang="en">past</span> (কাল), <span lang="en">future</span> (আগামীকাল)।</li>
<li>চার রূপ: <span lang="en">simple</span> (এমনি), <span lang="en">continuous</span> (চলছে, <span lang="en">be + -ing</span>), <span lang="en">perfect</span> (শেষ, <span lang="en">have + V3</span>), <span lang="en">perfect continuous</span>।</li>
<li>সবচেয়ে বেশি লাগে ছয়টা: তিন <span lang="en">simple</span> আর তিন <span lang="en">continuous</span>। রোজকার কথার নব্বই ভাগ এখানে।</li>
<li><span lang="en">continuous</span> মানে ছবিটা নড়ছে: <span lang="en">is playing</span>। <span lang="en">simple</span> মানে ছবিটা স্থির, অভ্যাস বা সত্যি: <span lang="en">plays</span>।</li>
</ul>
</div>

${mount("tenses-pattern")}

<h2>বারোটা ঘর, এক নজরে</h2>

<p>একটা ক্রিয়া নাও, <span lang="en">play</span>, আর কর্তা <span lang="en">Rafi</span>। এই ছকটা মুখস্থ নয়, চেনার জন্য। মোটা করা ছয়টা ঘরই আজকের।</p>

<div class="table-scroll">
<table>
<thead><tr><th></th><th>simple: এমনি</th><th>continuous: চলছে</th><th>perfect: শেষ</th><th>perfect continuous</th></tr></thead>
<tbody>
<tr><td>present</td><td><strong><span lang="en">plays</span></strong></td><td><strong><span lang="en">is playing</span></strong></td><td><span lang="en">has played</span></td><td><span lang="en">has been playing</span></td></tr>
<tr><td>past</td><td><strong><span lang="en">played</span></strong></td><td><strong><span lang="en">was playing</span></strong></td><td><span lang="en">had played</span></td><td><span lang="en">had been playing</span></td></tr>
<tr><td>future</td><td><strong><span lang="en">will play</span></strong></td><td><strong><span lang="en">will be playing</span></strong></td><td><span lang="en">will have played</span></td><td><span lang="en">will have been playing</span></td></tr>
</tbody>
</table>
</div>

<h2>present simple: যা হয়, যা সত্যি</h2>

<p>অভ্যাস, রুটিন, চিরসত্য। <span lang="en">Rafi plays cricket every Friday.</span> প্রতি শুক্রবার, অভ্যাস। <span lang="en">The sun rises in the east.</span> চিরসত্য। <span lang="en">Nanu tells stories at night.</span> রুটিন। সাথে প্রায়ই থাকে <span lang="en">every day, always, usually, often, never, on Fridays</span>। আর একজন হলে সেই টুপিটা: <span lang="en">-s</span>।</p>

<h2>present continuous: এই মুহূর্তে যা চলছে</h2>

<p><span lang="en">am/is/are + -ing</span>। ছবিটা নড়ছে, এখনই। <span lang="en">Rafi is playing cricket now.</span> <span lang="en">Look! It is raining.</span> সাথে <span lang="en">now, at the moment, look, listen</span>। বাংলাভাষীর জন্য এটা উপহার, কারণ বাংলাও ঠিক এই ভাগটা করে: "খেলে" আর "খেলছে"। <span lang="en">plays</span> আর <span lang="en">is playing</span>। যে ভাষায় এই দুটো আলাদা, সে ভাষার লোকের এই কাল শিখতে এক দিন লাগে।</p>

${mount("tenses-lines")}

<h2>past simple: কাল যা হয়েছে, শেষ</h2>

<p>কাজটা হয়ে গেছে, সময়টা শেষ। <span lang="en">Bangladesh beat India in 2007.</span> <span lang="en">Rafi played yesterday.</span> নিয়মিত ক্রিয়ায় <span lang="en">-ed</span>, আর রেবেলদের নিজেদের রূপ: <span lang="en">go, went; eat, ate; see, saw; have, had; do, did</span>। সাথে <span lang="en">yesterday, last week, in 2007, ago</span>। কর্তা যেই হোক, রূপ এক: <span lang="en">I played, she played, they played</span>। কোনো টুপি নেই।</p>

<h2>past continuous: তখন যা চলছিল</h2>

<p><span lang="en">was/were + -ing</span>। অতীতের একটা মুহূর্তে ছবিটা নড়ছিল। <span lang="en">I was sleeping when the phone rang.</span> ঘুমটা চলছিল (লম্বা), ফোনটা বাজল (হঠাৎ, এক মুহূর্ত)। লম্বা কাজটা <span lang="en">was -ing</span>, হঠাৎ কাজটা <span lang="en">-ed</span>। এই জোড়াটা গল্পের প্রাণ: নানু বলেন, <span lang="en">The king was sleeping when the thief entered.</span></p>

<h2>future: will আর going to</h2>

<p><span lang="en">will + verb</span>: এইমাত্র ঠিক করলাম, বা কথা দিচ্ছি, বা অনুমান। <span lang="en">I will call you.</span> <span lang="en">It will rain tomorrow.</span> <span lang="en">going to + verb</span>: আগে থেকেই ঠিক করা, প্রমাণ আছে। <span lang="en">We are going to watch the final.</span> টিকিট কাটা আছে। আর <span lang="en">will be -ing</span>: ভবিষ্যতের একটা মুহূর্তে যা চলবে। <span lang="en">This time tomorrow I will be sitting in the exam hall.</span></p>

${mount("tenses-gap")}

<div class="ex"><b>Ice Age-এর ছোট্ট কাঠবিড়ালিটা মনে করো:</b> <span lang="en">Scrat wants the acorn. He is chasing it. He chased it yesterday. He was chasing it when the ice cracked. He will chase it forever.</span> একটা প্রাণী, একটা বাদাম, পাঁচটা কাল। কালটা বদলায়, লোভটা না।</div>

${mount("tenses-bins")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>কাল চেনার সবচেয়ে ভালো উপায় সময়ের শব্দ খোঁজা। <span lang="en">every day, usually, always</span>: present simple। <span lang="en">now, at the moment, Look!</span>: present continuous। <span lang="en">yesterday, ago, last, in 1971</span>: past simple। <span lang="en">while, when</span> + অন্য একটা past কাজ: past continuous। <span lang="en">tomorrow, next week, soon</span>: future। শব্দটা আগে খোঁজো, তারপর ঘর বাছো।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>কিছু ক্রিয়া <span lang="en">-ing</span> নেয় না, কারণ সেগুলো কাজ নয়, অবস্থা: <span lang="en">know, like, love, want, need, believe, understand, have</span> (মালিকানা অর্থে)। <span lang="en">I am knowing</span> নয়, <span lang="en">I know</span>। <span lang="en">I am loving cricket</span> নয়, <span lang="en">I love cricket</span>। বাংলায় "জানছি" বলা যায় না, ইংরেজিতেও যায় না।</p>
</div>

${mount("tenses-drill")}
`,
  blocks: {
    "tenses-pattern": {
      kind: "pattern",
      title: { bn: "টাইম মেশিনের ছয়টা বোতাম", en: "Six buttons on the time machine" },
      shape: "plays / is playing  ·  played / was playing  ·  will play / will be playing",
      why: { bn: "তিন সময়, আর প্রতিটায় দুই রূপ: স্থির ছবি (simple) আর নড়া ছবি (continuous, be + -ing)। এই ছয়টা দিয়ে রোজকার কথার প্রায় সবটা বলা যায়। বাকি ছয়টা ঘর, perfect, পর্ব ১১-তে।", en: "Three times, two forms each: the still picture (simple) and the moving one (continuous, be + -ing). These six carry almost all daily speech. The other six, the perfects, are part 11." },
      examples: [
        { target: "Rafi plays cricket every Friday.", bn: "রাফি প্রতি শুক্রবার ক্রিকেট খেলে। (অভ্যাস)" },
        { target: "Rafi is playing cricket now.", bn: "রাফি এখন ক্রিকেট খেলছে। (এই মুহূর্তে)" },
        { target: "Rafi played cricket yesterday.", bn: "রাফি কাল ক্রিকেট খেলেছে। (শেষ)" },
        { target: "Rafi was playing when it started to rain.", bn: "রাফি খেলছিল, তখন বৃষ্টি শুরু হলো। (চলছিল)" },
        { target: "Rafi will play cricket tomorrow.", bn: "রাফি কাল ক্রিকেট খেলবে।" },
        { target: "Rafi will be playing at five o'clock.", bn: "রাফি পাঁচটার সময় খেলতে থাকবে।" },
      ],
      tip: { bn: "সময়ের শব্দটা আগে খোঁজো: every day, now, yesterday, tomorrow। শব্দটাই ঘর বলে দেয়।", en: "Find the time word first: every day, now, yesterday, tomorrow. The word names the box." },
    },
    "tenses-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: স্থির আর নড়া ছবি", en: "Listen, say: the still and the moving picture" },
      lines: [
        { target: "Nanu tells stories every night.", bn: "নানু রোজ রাতে গল্প বলেন। (অভ্যাস)" },
        { target: "Nanu is telling a story right now.", bn: "নানু এখনই একটা গল্প বলছেন। (চলছে)" },
        { target: "Mitu studies in the morning.", bn: "মিতু সকালে পড়ে।" },
        { target: "Mitu is studying at the moment, so be quiet.", bn: "মিতু এই মুহূর্তে পড়ছে, তাই চুপ করো।" },
        { target: "It rains a lot in July.", bn: "জুলাইয়ে অনেক বৃষ্টি হয়।" },
        { target: "Look, it is raining!", bn: "দেখো, বৃষ্টি হচ্ছে!" },
      ],
    },
    "tenses-gap": {
      kind: "gap",
      title: { bn: "কোন বোতাম", en: "Which button" },
      note: { bn: "সময়ের শব্দটা খোঁজো, তারপর ছোঁও।", en: "Find the time word, then tap." },
      items: [
        { text: "Rafi ___ cricket every Friday.", bn: "রাফি প্রতি শুক্রবার ক্রিকেট খেলে।", options: ["plays", "is playing", "played"], right: 0, why: { bn: "every Friday: অভ্যাস, present simple, আর Rafi একজন তাই -s।", en: "Every Friday is a habit: present simple, with the -s because Rafi is one." } },
        { text: "Be quiet! The baby ___.", bn: "চুপ! বাচ্চাটা ঘুমাচ্ছে।", options: ["sleeps", "is sleeping", "slept"], right: 1, why: { bn: "এই মুহূর্তে চলছে: is sleeping। Be quiet! সময়ের শব্দের মতোই কাজ করছে।", en: "Happening right now: is sleeping. Be quiet! works like a time word." } },
        { text: "Bangladesh ___ the match last night.", bn: "বাংলাদেশ কাল রাতে ম্যাচটা জিতেছে।", options: ["wins", "is winning", "won"], right: 2, why: { bn: "last night: শেষ হয়ে যাওয়া অতীত। win একটা রেবেল: won।", en: "Last night: a finished past. Win is a rebel: won." } },
        { text: "I ___ TV when the lights went out.", bn: "আমি টিভি দেখছিলাম, তখন কারেন্ট চলে গেল।", options: ["watched", "was watching", "am watching"], right: 1, why: { bn: "লম্বা কাজটা চলছিল, হঠাৎ কাজটা হলো: was watching … went out।", en: "The long action was running when the sudden one happened: was watching … went out." } },
        { text: "Don't worry, I ___ you tomorrow.", bn: "চিন্তা কোরো না, আমি কাল তোমাকে ফোন করব।", options: ["call", "will call", "called"], right: 1, why: { bn: "tomorrow, আর একটা কথা দেওয়া: will call।", en: "Tomorrow, and a promise: will call." } },
        { text: "Mitu ___ two brothers.", bn: "মিতুর দুই ভাই।", options: ["has", "is having", "had"], right: 0, why: { bn: "have মালিকানা অর্থে অবস্থা, কাজ নয়: -ing নেয় না। has।", en: "Have in the sense of owning is a state, not an action: no -ing. Has." } },
      ],
    },
    "tenses-bins": {
      kind: "bins",
      title: { bn: "সময়ের শব্দগুলো ভাগ করো", en: "Sort the time words" },
      bins: [
        { id: "ps", label: { bn: "present simple", en: "present simple" } },
        { id: "pc", label: { bn: "present continuous", en: "present continuous" } },
        { id: "pa", label: { bn: "past", en: "past" } },
        { id: "fu", label: { bn: "future", en: "future" } },
      ],
      items: [
        { text: { bn: "every day", en: "every day" }, bin: "ps", why: { bn: "রোজ, অভ্যাস।", en: "Daily, a habit." } },
        { text: { bn: "now", en: "now" }, bin: "pc", why: { bn: "এই মুহূর্তে চলছে।", en: "Happening at this moment." } },
        { text: { bn: "yesterday", en: "yesterday" }, bin: "pa", why: { bn: "শেষ হয়ে যাওয়া সময়।", en: "A finished time." } },
        { text: { bn: "tomorrow", en: "tomorrow" }, bin: "fu", why: { bn: "আগামীকাল।", en: "The day after today." } },
        { text: { bn: "usually", en: "usually" }, bin: "ps", why: { bn: "সাধারণত, অভ্যাস।", en: "Usually, a habit." } },
        { text: { bn: "at the moment", en: "at the moment" }, bin: "pc", why: { bn: "এই মুহূর্তে।", en: "At this moment." } },
        { text: { bn: "in 2007", en: "in 2007" }, bin: "pa", why: { bn: "একটা নির্দিষ্ট অতীত বছর।", en: "A specific past year." } },
        { text: { bn: "next week", en: "next week" }, bin: "fu", why: { bn: "আগামী সপ্তাহ।", en: "The week to come." } },
        { text: { bn: "two days ago", en: "two days ago" }, bin: "pa", why: { bn: "ago মানেই অতীত।", en: "Ago always means the past." } },
      ],
    },
    "tenses-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "একটা কাজ নাও, যেমন eat, আর ছয়টা বোতাম টেপো: I eat, I am eating, I ate, I was eating, I will eat, I will be eating।", en: "Take one verb, say eat, and press all six buttons: I eat, I am eating, I ate, I was eating, I will eat, I will be eating." } },
        { text: { bn: "আজ সকাল থেকে যা করেছ, past simple-এ পাঁচ বাক্য: I woke up, I ate…", en: "What you did since morning, five sentences in the past simple: I woke up, I ate…" } },
        { text: { bn: "জানালার বাইরে তাকাও আর এখন যা চলছে বলো: A man is walking. Birds are flying.", en: "Look out of the window and say what is happening: A man is walking. Birds are flying." } },
        { text: { bn: "কাল কী করবে, তিনটা will আর দুটো going to।", en: "Tomorrow's plans: three with will and two with going to." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"adverbs": {
  bn: `
<p>ধারাভাষ্যকার বললেন, <span lang="en">Mustafiz bowls fast.</span> রাফি ভাবল, <span lang="en">fast</span> তো adjective, আগের পর্বে শিখেছি। কিন্তু এখানে <span lang="en">fast</span> মুস্তাফিজকে বর্ণনা করছে না, তার বোলিং করাটাকে করছে। কী করে বল করে? দ্রুত। কাজকে যে শব্দ রং দেয়, তার নাম <span lang="en">adverb</span>। adjective নামের রং, adverb কাজের রং।</p>

<p>adverb চারটা প্রশ্নের উত্তর দেয়: কীভাবে (<span lang="en">quickly</span>), কখন (<span lang="en">yesterday</span>), কোথায় (<span lang="en">here</span>), কত ঘন ঘন (<span lang="en">always</span>)। আর পঞ্চম একটা কাজ: অন্য কোনো শব্দকে কতটা জোর দেওয়া (<span lang="en">very, really, too</span>)।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বেশিরভাগ adverb বানানো হয় adjective + <span lang="en">-ly</span>: <span lang="en">quick, quickly; careful, carefully; happy, happily</span>।</li>
<li>কয়েকটা adjective আর adverb একই: <span lang="en">fast, hard, late, early, high</span>। কোনো <span lang="en">-ly</span> নয়।</li>
<li><span lang="en">good</span>-এর adverb <span lang="en">well</span>: <span lang="en">She sings well</span>, <span lang="en">goodly</span> নয়।</li>
<li>কত ঘন ঘন (<span lang="en">always, usually, often, sometimes, never</span>) বসে ক্রিয়ার <em>আগে</em>, কিন্তু <span lang="en">be</span>-র <em>পরে</em>।</li>
<li>কীভাবে, কোথায়, কখন: এই ক্রমে, বাক্যের শেষে। <span lang="en">He played well at home yesterday.</span></li>
</ul>
</div>

${mount("adverbs-pattern")}

<h2>-ly লাগানোর তিনটা বানান</h2>

<p>সাধারণত শুধু <span lang="en">-ly</span>: <span lang="en">slow, slowly; quiet, quietly; brave, bravely</span>। শেষে <span lang="en">-y</span> থাকলে <span lang="en">-ily</span>: <span lang="en">happy, happily; easy, easily; angry, angrily</span>। শেষে <span lang="en">-le</span> থাকলে <span lang="en">e</span> গিয়ে <span lang="en">-ly</span>: <span lang="en">gentle, gently; simple, simply; terrible, terribly</span>। আর <span lang="en">-ic</span> দিয়ে শেষ হলে <span lang="en">-ically</span>: <span lang="en">basic, basically; automatic, automatically</span>।</p>

<h2>যারা -ly নেয় না</h2>

<p>এই কয়েকটা শব্দ দুই দলেই খেলে, একই জার্সিতে। <span lang="en">a fast car</span> (adjective) আর <span lang="en">he drives fast</span> (adverb)। <span lang="en">a hard question</span> আর <span lang="en">she works hard</span>। <span lang="en">a late train</span> আর <span lang="en">he came late</span>। <span lang="en">an early bus</span> আর <span lang="en">we left early</span>। এদের <span lang="en">-ly</span> লাগালে হয় ভুল, নয় অন্য মানে: <span lang="en">hardly</span> মানে "প্রায় না", <span lang="en">lately</span> মানে "ইদানীং"। <span lang="en">She hardly works</span> মানে সে প্রায় কাজই করে না। উল্টো মানে!</p>

<p>আর <span lang="en">good</span>-এর adverb হলো <span lang="en">well</span>। <span lang="en">Shakib is a good player. Shakib plays well.</span> <span lang="en">He plays good</span> বাংলাভাষীর প্রিয় ভুল, আর মার্কিন সিনেমার চরিত্ররা এটা বলে বলেই মনে হয় ঠিক। পরীক্ষায় ঠিক নয়।</p>

${mount("adverbs-lines")}

<h2>কত ঘন ঘন: always থেকে never</h2>

<p>একটা সিঁড়ি: <span lang="en">always</span> (১০০%), <span lang="en">usually</span> (৯০%), <span lang="en">often</span> (৭০%), <span lang="en">sometimes</span> (৫০%), <span lang="en">rarely</span> (১০%), <span lang="en">never</span> (০%)। এদের জায়গা একটাই নিয়মে বাঁধা: <strong>সাধারণ ক্রিয়ার আগে, <span lang="en">be</span>-র পরে।</strong> <span lang="en">Rafi always plays on Fridays.</span> <span lang="en">Rafi is always late.</span> <span lang="en">Nanu never forgets a story.</span> <span lang="en">Mitu is never late.</span> সাহায্যকারী থাকলে তার পরে, মূল ক্রিয়ার আগে: <span lang="en">I have never seen snow. She can usually come.</span></p>

<h2>বাক্যের শেষে: কীভাবে, কোথায়, কখন</h2>

<p>একাধিক adverb শেষে জমলে ইংরেজি একটা ক্রম মানে: <strong>কীভাবে, কোথায়, কখন</strong>। <span lang="en">Rafi played well at the club yesterday.</span> <span lang="en">Nanu sleeps peacefully in her room at night.</span> ক্রমটা মনে রাখার একটা কথা: ম-জা-স, মানে-জায়গা-সময়। বাংলায় আমরা উল্টো বলি, "কাল ক্লাবে ভালো খেলল", তাই এটা অভ্যাস করতে হয়।</p>

${mount("adverbs-gap")}

<h2>জোর দেওয়ার শব্দ: very, too, enough</h2>

<p><span lang="en">very</span> adjective বা adverb-কে বাড়ায়: <span lang="en">very fast, very carefully</span>। <span lang="en">too</span> মানে বেশি, খারাপ অর্থে: <span lang="en">The tea is too hot</span>, খাওয়া যাচ্ছে না। <span lang="en">enough</span> বসে adjective-এর <em>পরে</em>: <span lang="en">The tea is hot enough.</span> <span lang="en">enough hot</span> নয়। আর <span lang="en">too</span> আর <span lang="en">very</span> এক নয়: <span lang="en">very tall</span> ভালো কথা, <span lang="en">too tall</span> মানে সমস্যা, দরজায় মাথা ঠেকে।</p>

<div class="ex"><b>Kung Fu Panda-র Master Oogway বলে:</b> <span lang="en">Yesterday is history, tomorrow is a mystery, but today is a gift.</span> তিনটা সময়ের adverb এক লাইনে। আর Po নিজের সম্পর্কে বলে, <span lang="en">I eat very quickly and I train really badly.</span> <span lang="en">very</span> আর <span lang="en">really</span> জোর, <span lang="en">quickly</span> আর <span lang="en">badly</span> কীভাবে।</div>

${mount("adverbs-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>বন্ধনীতে adjective দেওয়া আর শূন্যস্থানটা ক্রিয়ার পরে? <span lang="en">-ly</span> লাগাও, adverb। শূন্যস্থানটা noun-এর আগে বা <span lang="en">is/was</span>-এর পরে? adjective, যেমন আছে তেমন। বন্ধনীতে <span lang="en">good</span> আর জায়গাটা ক্রিয়ার পরে? <span lang="en">well</span>। বন্ধনীতে <span lang="en">fast, hard, late, early</span>? বদলাবে না, কখনো <span lang="en">-ly</span> নয়।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">feel, look, smell, taste, sound</span>-এর পরে adjective, adverb নয়, কারণ এরা কাজ নয়, অবস্থা। <span lang="en">I feel bad</span> (আমার খারাপ লাগছে), <span lang="en">I feel badly</span> নয়। <span lang="en">The pitha smells good. She looks happy. It sounds great.</span> পাঁচটা ক্রিয়া, পাঁচবার adjective।</p>
</div>

${mount("adverbs-drill")}
`,
  blocks: {
    "adverbs-pattern": {
      kind: "pattern",
      title: { bn: "নামের রং, কাজের রং", en: "Colour on the noun, colour on the verb" },
      shape: "a careful driver (adjective)  ·  drives carefully (adverb)",
      why: { bn: "একই ভাব দুই জায়গায়। নামের পাশে বসলে adjective, যেমন আছে তেমন। কাজের পাশে বসলে -ly লেগে adverb হয়ে যায়। fast, hard, late, early আর well: এই পাঁচটা শুধু মুখস্থ।", en: "One idea in two places. Beside the noun it stays an adjective; beside the verb it takes -ly and becomes an adverb. Fast, hard, late, early and well are the five to memorise." },
      examples: [
        { target: "Mustafiz is a fast bowler. He bowls fast.", bn: "মুস্তাফিজ দ্রুতগতির বোলার। সে দ্রুত বল করে।" },
        { target: "Mitu is a careful student. She writes carefully.", bn: "মিতু সাবধানী ছাত্রী। সে সাবধানে লেখে।" },
        { target: "Nanu is a good storyteller. She tells stories well.", bn: "নানু ভালো গল্প বলিয়ে। তিনি গল্প ভালো বলেন।" },
        { target: "Rafi always plays on Fridays, but he is never late.", bn: "রাফি সবসময় শুক্রবারে খেলে, কিন্তু কখনো দেরি করে না।" },
      ],
      tip: { bn: "কীভাবে, কোথায়, কখন: এই ক্রমে বাক্যের শেষে। He played well here yesterday.", en: "How, where, when: in that order at the end. He played well here yesterday." },
    },
    "adverbs-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: কখন, কোথায়, কীভাবে", en: "Listen, say: when, where, how" },
      lines: [
        { target: "Speak slowly, please.", bn: "একটু ধীরে বলো তো।" },
        { target: "The train arrived late again.", bn: "ট্রেনটা আবার দেরিতে এল।" },
        { target: "She sings really well.", bn: "সে সত্যিই খুব ভালো গায়।" },
        { target: "I usually walk to school.", bn: "আমি সাধারণত হেঁটে স্কুলে যাই।" },
        { target: "We rarely eat out.", bn: "আমরা কদাচিৎ বাইরে খাই।" },
        { target: "He worked hard and finished early.", bn: "সে কঠোর পরিশ্রম করল আর তাড়াতাড়ি শেষ করল।" },
      ],
    },
    "adverbs-gap": {
      kind: "gap",
      title: { bn: "adjective নাকি adverb", en: "Adjective or adverb" },
      items: [
        { text: "Shakib bats ___.", bn: "শাকিব ভালো ব্যাট করে।", options: ["good", "well", "goodly"], right: 1, why: { bn: "ক্রিয়ার পরে, কীভাবে ব্যাট করে: adverb। good-এর adverb well।", en: "After the verb, how he bats: an adverb. The adverb of good is well." } },
        { text: "Please drive ___; the road is wet.", bn: "একটু সাবধানে চালাও; রাস্তা ভেজা।", options: ["careful", "carefully", "carefuly"], right: 1, why: { bn: "কীভাবে চালাবে: adverb, careful + ly। একটা l নয়, দুটো।", en: "How to drive: an adverb, careful + ly. Two l's, not one." } },
        { text: "Mitu is a ___ student.", bn: "মিতু একজন পরিশ্রমী ছাত্রী।", options: ["hardly", "hard-working", "hard"], right: 1, why: { bn: "noun-এর আগে adjective: hard-working। hardly মানে 'প্রায় না', উল্টো মানে।", en: "Before a noun, an adjective: hard-working. Hardly means almost not, the opposite." } },
        { text: "Rafi ___ forgets his kit.", bn: "রাফি কখনো তার কিট ভোলে না।", options: ["never", "is never", "forgets never"], right: 0, why: { bn: "কত ঘন ঘন: সাধারণ ক্রিয়ার আগে। Rafi never forgets।", en: "How often goes before an ordinary verb: Rafi never forgets." } },
        { text: "The bus came ___ this morning.", bn: "বাসটা আজ সকালে দেরিতে এল।", options: ["lately", "late", "latly"], right: 1, why: { bn: "late কোনো -ly নেয় না। lately মানে 'ইদানীং', অন্য শব্দ।", en: "Late takes no -ly. Lately means recently, a different word." } },
        { text: "This pitha tastes ___.", bn: "এই পিঠাটা খেতে দারুণ।", options: ["wonderfully", "wonderful", "wonder"], right: 1, why: { bn: "taste অবস্থার ক্রিয়া, পরে adjective: tastes wonderful। feel, look, smell, sound-ও তাই।", en: "Taste is a state verb and takes an adjective: tastes wonderful. So do feel, look, smell, sound." } },
      ],
    },
    "adverbs-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "কোন ক্রমটা ঠিক?", en: "Which order is right?" },
          options: [
            { text: { bn: "He played yesterday well at the club.", en: "He played yesterday well at the club." }, why: { bn: "না। সময় সবার শেষে যায়। ম-জা-স: মানে, জায়গা, সময়।", en: "No. Time goes last. How, where, when." } },
            { text: { bn: "He played well at the club yesterday.", en: "He played well at the club yesterday." }, right: true, why: { bn: "হ্যাঁ। কীভাবে (well), কোথায় (at the club), কখন (yesterday)।", en: "Yes. How (well), where (at the club), when (yesterday)." } },
            { text: { bn: "He well played at the club yesterday.", en: "He well played at the club yesterday." }, why: { bn: "না। কীভাবে-র adverb ক্রিয়ার পরে বসে, আগে নয়। আগে বসে শুধু always, never-রা।", en: "No. A how adverb comes after the verb. Only always, never and their family go before." } },
          ],
        },
        {
          ask: { bn: "The tea is ___ hot to drink. কোনটা?", en: "The tea is ___ hot to drink. Which?" },
          options: [
            { text: { bn: "very", en: "very" }, why: { bn: "না। very hot মানে খুব গরম, কিন্তু খাওয়া যায়। to drink-এর সাথে 'বেশি' চাই।", en: "No. Very hot means hot, but drinkable. With to drink you need too much." } },
            { text: { bn: "too", en: "too" }, right: true, why: { bn: "হ্যাঁ। too hot to drink: এত গরম যে খাওয়া যায় না। too মানে সমস্যা।", en: "Yes. Too hot to drink: so hot it cannot be drunk. Too means a problem." } },
            { text: { bn: "enough", en: "enough" }, why: { bn: "না। enough বসে adjective-এর পরে: hot enough, আর মানে হয় যথেষ্ট।", en: "No. Enough goes after the adjective: hot enough, and means sufficiently." } },
          ],
        },
      ],
    },
    "adverbs-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "পাঁচজন মানুষ কীভাবে কথা বলে: Nanu speaks softly. Baba speaks loudly…", en: "How five people speak: Nanu speaks softly. Baba speaks loudly…" } },
        { text: { bn: "নিজের সপ্তাহ always থেকে never পর্যন্ত পাঁচ বাক্যে: I always… I usually… I never…", en: "Your week from always to never in five sentences: I always… I usually… I never…" } },
        { text: { bn: "একটা লম্বা বাক্য, ম-জা-স ক্রমে: I read quietly in my room at night.", en: "One long sentence in how-where-when order: I read quietly in my room at night." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"prepositions": {
  bn: `
<p>বাংলায় একটা "এ" দিয়ে কত কিছু হয়: বাক্সে, টেবিলে, ঢাকায়, সকালে, সোমবারে। ইংরেজি ওই এক "এ"-কে তিন টুকরো করে: <span lang="en">in the box, on the table, at the station</span>। তানভীর ভাই বলে, এটা নিয়ম দিয়ে শেখার জিনিস না, ছবি দিয়ে শেখার। ভিতরে থাকলে <span lang="en">in</span>, উপরে লেগে থাকলে <span lang="en">on</span>, একটা বিন্দুতে থাকলে <span lang="en">at</span>। তিনটা ছবি মাথায় বসাও, বাকিটা এসে যাবে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>জায়গা: <span lang="en">in</span> (ভিতরে, ঘেরা), <span lang="en">on</span> (উপরে, ছুঁয়ে), <span lang="en">at</span> (একটা বিন্দুতে)।</li>
<li>সময়: <span lang="en">in</span> (মাস, বছর, বেলা), <span lang="en">on</span> (দিন, তারিখ), <span lang="en">at</span> (ঘড়ির সময়, উৎসব)। বড় থেকে ছোট।</li>
<li>নড়াচড়া: <span lang="en">to</span> (দিকে), <span lang="en">from</span> (থেকে), <span lang="en">into</span> (ভিতরে ঢোকা), <span lang="en">through</span> (ভেদ করে), <span lang="en">across</span> (পার হয়ে)।</li>
<li>preposition-এর পরে সবসময় noun বা pronoun-এর কর্ম-রূপ: <span lang="en">with him, for us</span>।</li>
<li>অনেক জোড়া মুখস্থ: <span lang="en">good at, afraid of, interested in, listen to, depend on</span>।</li>
</ul>
</div>

${mount("prepositions-pattern")}

<h2>জায়গার তিনটা ছবি</h2>

<p><span lang="en">in</span>: চারদিক ঘেরা কিছুর ভিতরে। বাক্স, ঘর, শহর, দেশ, পানি। <span lang="en">in the box, in the room, in Dhaka, in Bangladesh, in the river</span>। ছবি: একটা বল একটা বাক্সের ভিতরে।</p>

<p><span lang="en">on</span>: কোনো তলের উপরে, ছুঁয়ে আছে। টেবিল, দেয়াল, মেঝে, ছাদ, রাস্তা। <span lang="en">on the table, on the wall, on the floor, on the road</span>। ছবি: একটা বল একটা টেবিলের উপরে। আর অদ্ভুত কিন্তু সত্যি: <span lang="en">on the bus, on the train, on a plane</span>, কারণ ওগুলোর ভিতরে হাঁটা যায়। গাড়িতে হাঁটা যায় না, তাই <span lang="en">in the car</span>।</p>

<p><span lang="en">at</span>: মানচিত্রে একটা বিন্দু, একটা ঠিকানা, একটা অবস্থান। <span lang="en">at the station, at the door, at home, at school, at the top</span>। ছবি: মানচিত্রে একটা পিন। <span lang="en">at school</span> মানে স্কুলে আছি, বিন্দু হিসেবে; <span lang="en">in the school</span> মানে ভবনটার ভিতরে।</p>

<div class="table-scroll">
<table>
<thead><tr><th></th><th><span lang="en">in</span></th><th><span lang="en">on</span></th><th><span lang="en">at</span></th></tr></thead>
<tbody>
<tr><td>জায়গা</td><td><span lang="en">in a box, in Dhaka, in bed</span></td><td><span lang="en">on a table, on the wall, on the bus</span></td><td><span lang="en">at the door, at school, at home</span></td></tr>
<tr><td>সময়</td><td><span lang="en">in June, in 2007, in the morning, in winter</span></td><td><span lang="en">on Friday, on 16 December, on my birthday</span></td><td><span lang="en">at 5 o'clock, at night, at Eid, at noon</span></td></tr>
</tbody>
</table>
</div>

${mount("prepositions-lines")}

<h2>সময়ের তিন সিঁড়ি: বড় থেকে ছোট</h2>

<p>সময়ে একই তিনটা শব্দ, কিন্তু নিয়মটা আকারের। বড় সময়ে <span lang="en">in</span>: মাস, বছর, ঋতু, দশক, আর দিনের বেলা। <span lang="en">in July, in 1971, in winter, in the afternoon</span>। মাঝারিতে <span lang="en">on</span>: দিন আর তারিখ। <span lang="en">on Monday, on 26 March, on Friday morning</span>। ছোটতে <span lang="en">at</span>: ঘড়ির সময় আর উৎসব। <span lang="en">at 7 o'clock, at midnight, at Eid</span>। আর একটা ব্যতিক্রম যেটা সবাই ভুল করে: <span lang="en">at night</span>, কিন্তু <span lang="en">in the morning</span>।</p>

<h2>নড়াচড়ার শব্দ</h2>

<p><span lang="en">Rafi walked to school.</span> স্কুলের দিকে, গন্তব্য <span lang="en">to</span>। <span lang="en">He came from the field.</span> মাঠ থেকে, উৎস <span lang="en">from</span>। <span lang="en">The cat jumped into the box.</span> বাইরে থেকে ভিতরে, নড়াচড়া সহ <span lang="en">into</span> (<span lang="en">in</span> মানে ওখানেই আছে, <span lang="en">into</span> মানে ঢুকছে)। <span lang="en">The train went through the tunnel.</span> ভেদ করে। <span lang="en">She swam across the river.</span> এপার থেকে ওপার। <span lang="en">The ball flew over the fence.</span> উপর দিয়ে। <span lang="en">The cat is under the bed.</span> নিচে।</p>

${mount("prepositions-gap")}

<div class="ex"><b>Finding Nemo-র পুরো গল্পটাই preposition:</b> <span lang="en">Nemo lives in the sea. He was taken from the reef, put into a tank, kept on a desk at the dentist's, and his father swam across the ocean to find him.</span> এক বাক্যে সাতটা preposition, আর প্রতিটা একটা ছবি।</div>

<h2>জোড়া শব্দ: যেগুলো একসাথে থাকে</h2>

<p>কিছু ক্রিয়া আর adjective-এর সাথে একটা নির্দিষ্ট preposition জোড়া লেগে থাকে, আর সেগুলো যুক্তি দিয়ে বোঝা যায় না, শুধু জোড়া হিসেবে শেখা যায়। বাংলায় "ইংরেজিতে ভালো", কিন্তু ইংরেজিতে <span lang="en">good at English</span>, <span lang="en">good in</span> নয়। সবচেয়ে বেশি লাগে এই কুড়িটা:</p>

<div class="table-scroll">
<table>
<thead><tr><th>জোড়া</th><th>উদাহরণ</th><th>জোড়া</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">good at</span></td><td><span lang="en">good at maths</span></td><td><span lang="en">listen to</span></td><td><span lang="en">listen to music</span></td></tr>
<tr><td><span lang="en">afraid of</span></td><td><span lang="en">afraid of dogs</span></td><td><span lang="en">wait for</span></td><td><span lang="en">wait for the bus</span></td></tr>
<tr><td><span lang="en">interested in</span></td><td><span lang="en">interested in films</span></td><td><span lang="en">look at</span></td><td><span lang="en">look at the sky</span></td></tr>
<tr><td><span lang="en">angry with</span> (মানুষ)</td><td><span lang="en">angry with Rafi</span></td><td><span lang="en">depend on</span></td><td><span lang="en">depend on the weather</span></td></tr>
<tr><td><span lang="en">famous for</span></td><td><span lang="en">famous for pitha</span></td><td><span lang="en">arrive at / in</span></td><td><span lang="en">arrive at school, in Dhaka</span></td></tr>
<tr><td><span lang="en">different from</span></td><td><span lang="en">different from mine</span></td><td><span lang="en">agree with</span></td><td><span lang="en">agree with you</span></td></tr>
<tr><td><span lang="en">married to</span></td><td><span lang="en">married to a doctor</span></td><td><span lang="en">belong to</span></td><td><span lang="en">belong to Nanu</span></td></tr>
<tr><td><span lang="en">tired of</span></td><td><span lang="en">tired of waiting</span></td><td><span lang="en">laugh at</span></td><td><span lang="en">laugh at the joke</span></td></tr>
</tbody>
</table>
</div>

${mount("prepositions-match")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Preposition</span> শূন্যস্থানে প্রথমে দেখো পরের শব্দটা কী। ঘড়ির সময় বা <span lang="en">night</span>: <span lang="en">at</span>। দিন বা তারিখ: <span lang="en">on</span>। মাস, বছর, শহর, দেশ: <span lang="en">in</span>। আগের শব্দটা যদি <span lang="en">good, afraid, interested, listen, wait, depend</span> হয়, জোড়া মনে করো। এই দুই দিক দেখলে বেশিরভাগ শূন্যস্থান ভরে যায়।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>কিছু ক্রিয়ার পরে বাংলার অভ্যাসে preposition বসাতে ইচ্ছে করে, কিন্তু ইংরেজিতে বসে না: <span lang="en">enter the room</span> (<span lang="en">enter into</span> নয়), <span lang="en">discuss the matter</span> (<span lang="en">discuss about</span> নয়), <span lang="en">reach Dhaka</span> (<span lang="en">reach at</span> নয়), <span lang="en">answer the question</span> (<span lang="en">answer to</span> নয়), <span lang="en">marry someone</span> (<span lang="en">marry with</span> নয়)। পাঁচটা ফাঁদ, মুখস্থ।</p>
</div>

${mount("prepositions-drill")}
`,
  blocks: {
    "prepositions-pattern": {
      kind: "pattern",
      title: { bn: "তিনটা ছবি", en: "Three pictures" },
      shape: "in = ভিতরে  ·  on = উপরে, ছুঁয়ে  ·  at = একটা বিন্দুতে",
      why: { bn: "জায়গায় তিনটা ছবি, সময়ে তিনটা আকার: in বড় (মাস, বছর), on মাঝারি (দিন), at ছোট (ঘড়ির সময়)। একই তিন শব্দ, দুই কাজ।", en: "Three pictures for place, three sizes for time: in is big (months, years), on is medium (days), at is small (clock times). The same three words, two jobs." },
      examples: [
        { target: "The ball is in the box, on the table, at the door.", bn: "বলটা বাক্সের ভিতরে, টেবিলের উপরে, দরজার কাছে।" },
        { target: "The final is in March, on a Sunday, at 2 o'clock.", bn: "ফাইনাল মার্চে, এক রবিবারে, দুটোর সময়।" },
        { target: "Rafi lives in Dhaka and studies at Ideal School.", bn: "রাফি ঢাকায় থাকে আর আইডিয়াল স্কুলে পড়ে।" },
        { target: "Nanu was born in 1955, on a rainy night.", bn: "নানু ১৯৫৫ সালে, এক বৃষ্টির রাতে জন্মেছিলেন।" },
      ],
      tip: { bn: "at night, in the morning: এই জোড়াটা উল্টো মনে হয়, তাই আলাদা করে মুখস্থ।", en: "At night but in the morning: the pair feels backwards, so learn it separately." },
    },
    "prepositions-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: কোথায়, কখন", en: "Listen, say: where, when" },
      lines: [
        { target: "My keys are in my bag.", bn: "আমার চাবি আমার ব্যাগে।" },
        { target: "There is a lizard on the wall.", bn: "দেয়ালে একটা টিকটিকি আছে।" },
        { target: "Meet me at the gate at five.", bn: "পাঁচটায় গেটে আমার সাথে দেখা করো।" },
        { target: "School starts on Sunday in January.", bn: "স্কুল শুরু জানুয়ারিতে, রবিবারে।" },
        { target: "We are on the bus, not in the car.", bn: "আমরা বাসে, গাড়িতে নয়।" },
        { target: "She is good at English and interested in films.", bn: "সে ইংরেজিতে ভালো আর সিনেমায় আগ্রহী।" },
      ],
    },
    "prepositions-gap": {
      kind: "gap",
      title: { bn: "কোন ছবি", en: "Which picture" },
      items: [
        { text: "The match starts ___ 3 o'clock.", bn: "ম্যাচ তিনটায় শুরু।", options: ["in", "on", "at"], right: 2, why: { bn: "ঘড়ির সময়: at। সবচেয়ে ছোট সময়।", en: "A clock time: at. The smallest size of time." } },
        { text: "Rafi was born ___ 2012.", bn: "রাফি ২০১২ সালে জন্মেছে।", options: ["in", "on", "at"], right: 0, why: { bn: "বছর: in। বড় সময়।", en: "A year: in. A big stretch of time." } },
        { text: "We have a holiday ___ Friday.", bn: "শুক্রবারে আমাদের ছুটি।", options: ["in", "on", "at"], right: 1, why: { bn: "দিন: on। মাঝারি সময়।", en: "A day: on. The middle size." } },
        { text: "The cat jumped ___ the box and hid.", bn: "বেড়ালটা বাক্সের ভিতরে লাফ দিয়ে লুকাল।", options: ["in", "into", "on"], right: 1, why: { bn: "বাইরে থেকে ভিতরে ঢোকা, নড়াচড়া: into। in হলে ওখানেই ছিল।", en: "Moving from outside to inside: into. In would mean it was already there." } },
        { text: "Nanu is afraid ___ lizards.", bn: "নানু টিকটিকিকে ভয় পান।", options: ["from", "of", "with"], right: 1, why: { bn: "afraid of: বাঁধা জোড়া। বাংলার 'থেকে ভয়' ইংরেজিতে of।", en: "Afraid of is a fixed pair. Bangla fears from; English fears of." } },
        { text: "I usually go to bed ___ night.", bn: "আমি সাধারণত রাতে ঘুমাতে যাই।", options: ["in", "on", "at"], right: 2, why: { bn: "at night, সেই ব্যতিক্রমটা। in the morning, কিন্তু at night।", en: "At night, the exception. In the morning, but at night." } },
      ],
    },
    "prepositions-match": {
      kind: "match",
      title: { bn: "জোড়া মেলাও", en: "Match the pairs" },
      note: { bn: "বাঁ দিকের শব্দের সাথে ডান দিকের preposition।", en: "The word on the left with its preposition on the right." },
      pairs: [
        { left: { bn: "good", en: "good" }, right: { bn: "at", en: "at" } },
        { left: { bn: "interested", en: "interested" }, right: { bn: "in", en: "in" } },
        { left: { bn: "listen", en: "listen" }, right: { bn: "to", en: "to" } },
        { left: { bn: "depend", en: "depend" }, right: { bn: "on", en: "on" } },
        { left: { bn: "different", en: "different" }, right: { bn: "from", en: "from" } },
        { left: { bn: "wait", en: "wait" }, right: { bn: "for", en: "for" } },
      ],
    },
    "prepositions-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "ঘরে দশটা জিনিস কোথায় আছে বলো: The fan is on the ceiling. The books are in the bag.", en: "Say where ten things in the room are: The fan is on the ceiling. The books are in the bag." } },
        { text: { bn: "নিজের জন্মদিন তিন ভাবে: in (মাস), on (তারিখ), at (কয়টায় জন্ম, জানলে)।", en: "Your birthday three ways: in (month), on (date), at (the time, if you know it)." } },
        { text: { bn: "পাঁচটা জোড়া নিজের কথায়: I am good at… I am afraid of… I am interested in…", en: "Five pairs about yourself: I am good at… I am afraid of… I am interested in…" } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"sentences": {
  bn: `
<p>নানু গল্পের মাঝে চারটা কাজ করেন। কিছু বলেন: "রাজা ঘুমিয়ে পড়ল।" কিছু জিজ্ঞেস করেন: "তখন কে এল?" কিছু আদেশ করেন: "চুপ করে শোনো।" আর মাঝে মাঝে চমকে ওঠেন: "কী ভয়ংকর!" ইংরেজি বাক্যও ঠিক এই চার কাজ করে, আর প্রতিটার শুরু আর শেষ আলাদা। এই পর্বে বাক্যের চারটা জাত, আর যে চিহ্নগুলো তাদের আলাদা করে: বড় হাতের অক্ষর, ফুল স্টপ, প্রশ্নবোধক আর বিস্ময়চিহ্ন।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>প্রতিটা বাক্য বড় হাতের অক্ষরে শুরু আর একটা চিহ্নে শেষ। এর মাঝে অন্তত একটা কর্তা আর একটা ক্রিয়া।</li>
<li>বলা (<span lang="en">statement</span>): কর্তা + ক্রিয়া, শেষে ফুল স্টপ। <span lang="en">Rafi plays cricket.</span></li>
<li>জিজ্ঞেস করা (<span lang="en">question</span>): সাহায্যকারী আগে, শেষে ?। <span lang="en">Does Rafi play cricket?</span></li>
<li>আদেশ (<span lang="en">command</span>): কর্তা নেই, ক্রিয়া দিয়ে শুরু। <span lang="en">Play carefully.</span></li>
<li>চমকে ওঠা (<span lang="en">exclamation</span>): <span lang="en">What a…! How…!</span>, শেষে !। <span lang="en">What a catch!</span></li>
</ul>
</div>

${mount("sentences-pattern")}

<h2>বাক্য কাকে বলে, আর কাকে বলে না</h2>

<p>একটা বাক্যে অন্তত দুটো জিনিস থাকতেই হবে: কে (কর্তা) আর কী করে (ক্রিয়া)। <span lang="en">Rafi runs.</span> দুটো শব্দ, পূর্ণ বাক্য। <span lang="en">The fast bowler from Khulna with the new ball</span> দশটা শব্দ, কিন্তু বাক্য নয়, কারণ কোনো ক্রিয়া নেই: বোলারটা কী করল? বলা হয়নি। পরীক্ষায় লেখায় এই ভুলটার একটা নাম আছে, <span lang="en">fragment</span>, টুকরো। কিছু লেখার পর নিজেকে জিজ্ঞেস করো: কে, আর কী করল? দুটোর উত্তর থাকলে বাক্য।</p>

<h2>প্রথম জাত: বলা</h2>

<p>সবচেয়ে সাধারণ। কর্তা, ক্রিয়া, বাকিটা, ফুল স্টপ। <span lang="en">Mitu is studying. The sky is blue. Bangladesh won.</span> না-বাচক করতে <span lang="en">not</span>: <span lang="en">be</span> থাকলে তার পরে (<span lang="en">Mitu is not studying</span>), না থাকলে <span lang="en">do/does/did + not</span> (<span lang="en">Rafi does not like spinach</span>)। এই <span lang="en">do</span>-র মেশিনটা পর্ব ১৩-তে পুরো খোলা হবে।</p>

<h2>দ্বিতীয় জাত: জিজ্ঞেস করা</h2>

<p>ইংরেজিতে প্রশ্ন করতে বাক্যের প্রথম দুটো শব্দ উল্টে দাও, বা সামনে একটা <span lang="en">do</span> বসাও। <span lang="en">You are ready. Are you ready?</span> <span lang="en">Rafi plays. Does Rafi play?</span> আর wh-শব্দ থাকলে সেটা সবার আগে: <span lang="en">Where does Rafi play?</span> শেষে সবসময় প্রশ্নবোধক। বাংলায় শুধু সুর বদলে প্রশ্ন হয় ("তুমি রেডি?"), ইংরেজিতে শব্দ নড়াতে হয়। এটাই বাংলাভাষীর দ্বিতীয় বড় ফাঁদ।</p>

${mount("sentences-lines")}

<h2>তৃতীয় জাত: আদেশ</h2>

<p>কর্তা লুকানো, সবসময় <span lang="en">you</span>। ক্রিয়ার খালি রূপ দিয়ে শুরু। <span lang="en">Sit down. Open your books. Listen carefully.</span> ভদ্র করতে <span lang="en">please</span>, শুরুতে বা শেষে: <span lang="en">Please sit down. Sit down, please.</span> না করতে <span lang="en">Don't</span>: <span lang="en">Don't run. Don't be late.</span> আর <span lang="en">Let's</span> দিয়ে নিজেদেরকে: <span lang="en">Let's go. Let's eat.</span></p>

<h2>চতুর্থ জাত: চমকে ওঠা</h2>

<p>দুটো ছাঁচ, আর দুটোই বিস্ময়চিহ্নে শেষ। <span lang="en">What + a/an + adjective + noun!</span> <span lang="en">What a beautiful catch! What an idea!</span> আর <span lang="en">How + adjective!</span> <span lang="en">How beautiful! How strange!</span> ফাঁদ: <span lang="en">What a nice day!</span> ঠিক, কারণ noun আছে (<span lang="en">day</span>); <span lang="en">How nice!</span> ঠিক, কারণ শুধু adjective। <span lang="en">How a nice day!</span> ভুল, <span lang="en">What nice!</span> ভুল।</p>

${mount("sentences-bins")}

<h2>শুরু আর শেষের চিহ্ন</h2>

<p>প্রতিটা বাক্য বড় হাতের অক্ষরে শুরু। বড় হাত আরও লাগে: নাম (<span lang="en">Rafi, Dhaka</span>), দিন আর মাস (<span lang="en">Friday, June</span>), ভাষা আর জাতি (<span lang="en">Bangla, Bangladeshi</span>), <span lang="en">I</span> শব্দটা সবসময়, বইয়ের নামের বড় শব্দগুলো (<span lang="en">Harry Potter and the Goblet of Fire</span>)। ঋতুর নামে বড় হাত নয়: <span lang="en">summer, winter</span>।</p>

<p>শেষে তিনটার একটা: ফুল স্টপ (বলা, আদেশ), প্রশ্নবোধক (জিজ্ঞেস), বিস্ময়চিহ্ন (চমক, বা জোরালো আদেশ: <span lang="en">Stop!</span>)। আর মাঝখানের সবচেয়ে গুরুত্বপূর্ণ চিহ্নটা কমা, যেটার জন্য আলাদা একটা পর্ব আছে, পর্ব ২৩। আপাতত একটা লাইন: <span lang="en">Let's eat, Nanu</span> মানে নানুকে খেতে ডাকা; <span lang="en">Let's eat Nanu</span> মানে নানুকে খেয়ে ফেলা। কমা মানুষের জীবন বাঁচায়।</p>

${mount("sentences-gap")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>বাক্যের জাত চিহ্নিত করতে বললে শেষের চিহ্ন আর প্রথম শব্দ দেখো। ? হলে <span lang="en">interrogative</span>। ! আর শুরুতে <span lang="en">What/How</span> হলে <span lang="en">exclamatory</span>। শুরুতে খালি ক্রিয়া, <span lang="en">Don't</span> বা <span lang="en">Let's</span> হলে <span lang="en">imperative</span>। বাকি সব <span lang="en">assertive</span>, আর তার ভিতরে <span lang="en">not</span> থাকলে <span lang="en">negative</span>। <span lang="en">Transformation</span> প্রশ্নে এই চারটার মাঝে বদল করতে বলা হয়; পর্ব ২৪ সেই মেশিন।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>দুটো পুরো বাক্য শুধু কমা দিয়ে জোড়া দেওয়া যায় না: <span lang="en">Rafi played well, he scored fifty</span> ভুল। হয় ফুল স্টপ (<span lang="en">Rafi played well. He scored fifty.</span>), নয় একটা জোড়ার শব্দ (<span lang="en">Rafi played well and he scored fifty</span>)। জোড়ার শব্দগুলো পর্ব ১৪-তে।</p>
</div>

${mount("sentences-drill")}
`,
  blocks: {
    "sentences-pattern": {
      kind: "pattern",
      title: { bn: "চার জাত, চার শুরু, তিন শেষ", en: "Four kinds, four openings, three endings" },
      shape: "Rafi plays.  ·  Does Rafi play?  ·  Play!  ·  What a shot!",
      why: { bn: "একই তিনটে শব্দ চার রকম কাজ করে, শুধু ক্রম আর চিহ্ন বদলে। বলা: কর্তা আগে। জিজ্ঞেস: সাহায্যকারী আগে। আদেশ: কর্তা নেই। চমক: What বা How দিয়ে শুরু।", en: "The same three words do four jobs by changing order and mark. Statement: subject first. Question: helper first. Command: no subject. Exclamation: starts with What or How." },
      examples: [
        { target: "Nanu is telling a story.", bn: "নানু একটা গল্প বলছেন। (বলা)" },
        { target: "Is Nanu telling a story?", bn: "নানু কি একটা গল্প বলছেন? (জিজ্ঞেস)" },
        { target: "Tell us a story, Nanu.", bn: "একটা গল্প বলো, নানু। (আদেশ, অনুরোধ)" },
        { target: "What a story that was!", bn: "কী একটা গল্প ছিল সেটা! (চমক)" },
      ],
      tip: { bn: "বাংলায় সুর বদলালেই প্রশ্ন। ইংরেজিতে শব্দ নড়াতে হয়: প্রথম দুটো উল্টাও, বা সামনে do বসাও।", en: "In Bangla a change of tune makes a question. In English words have to move: swap the first two, or put do in front." },
    },
    "sentences-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: বলা থেকে জিজ্ঞেস", en: "Listen, say: from telling to asking" },
      note: { bn: "প্রতিটা জোড়ায় শব্দ কোথায় নড়ল, শোনো।", en: "In each pair, listen to where the words move." },
      lines: [
        { target: "You are ready. Are you ready?", bn: "তুমি প্রস্তুত। তুমি কি প্রস্তুত?" },
        { target: "She can swim. Can she swim?", bn: "সে সাঁতার পারে। সে কি সাঁতার পারে?" },
        { target: "Rafi likes mangoes. Does Rafi like mangoes?", bn: "রাফি আম পছন্দ করে। রাফি কি আম পছন্দ করে?" },
        { target: "They won the match. Did they win the match?", bn: "তারা ম্যাচ জিতেছে। তারা কি ম্যাচ জিতেছে?" },
        { target: "Please open the window. Don't shout.", bn: "জানালাটা খোলো তো। চেঁচিও না।" },
        { target: "What a beautiful morning! How cold it is!", bn: "কী সুন্দর সকাল! কী ঠান্ডা!" },
      ],
    },
    "sentences-bins": {
      kind: "bins",
      title: { bn: "কোন জাতের বাক্য", en: "Which kind of sentence" },
      bins: [
        { id: "st", label: { bn: "বলা", en: "statement" } },
        { id: "qu", label: { bn: "জিজ্ঞেস", en: "question" } },
        { id: "co", label: { bn: "আদেশ", en: "command" } },
        { id: "ex", label: { bn: "চমক", en: "exclamation" } },
      ],
      items: [
        { text: { bn: "Shakib took five wickets.", en: "Shakib took five wickets." }, bin: "st", why: { bn: "কর্তা, ক্রিয়া, ফুল স্টপ। শুধু বলা।", en: "Subject, verb, full stop. Just telling." } },
        { text: { bn: "Did you see that catch?", en: "Did you see that catch?" }, bin: "qu", why: { bn: "Did আগে, শেষে ?।", en: "Did first, a question mark last." } },
        { text: { bn: "Pass the ball!", en: "Pass the ball!" }, bin: "co", why: { bn: "কর্তা নেই, ক্রিয়া দিয়ে শুরু। জোরালো আদেশে ! বসে, কিন্তু জাত আদেশ।", en: "No subject, verb first. A strong command takes !, but it is still a command." } },
        { text: { bn: "What a wonderful over!", en: "What a wonderful over!" }, bin: "ex", why: { bn: "What a + adjective + noun + !।", en: "What a + adjective + noun + !" } },
        { text: { bn: "Don't be afraid.", en: "Don't be afraid." }, bin: "co", why: { bn: "Don't দিয়ে শুরু, না-বাচক আদেশ।", en: "Starts with Don't: a negative command." } },
        { text: { bn: "How quickly he runs!", en: "How quickly he runs!" }, bin: "ex", why: { bn: "How + adverb + !।", en: "How + adverb + !" } },
        { text: { bn: "Where is my bat?", en: "Where is my bat?" }, bin: "qu", why: { bn: "wh-শব্দ দিয়ে শুরু, ? দিয়ে শেষ।", en: "A wh-word first, a question mark last." } },
        { text: { bn: "Nanu does not like loud music.", en: "Nanu does not like loud music." }, bin: "st", why: { bn: "না-বাচক, কিন্তু জাতে বলা।", en: "Negative, but a statement by kind." } },
      ],
    },
    "sentences-gap": {
      kind: "gap",
      title: { bn: "ঠিক শুরুটা বসাও", en: "Put in the right opening" },
      items: [
        { text: "___ a lovely day it is!", bn: "কী সুন্দর দিন!", options: ["How", "What", "Which"], right: 1, why: { bn: "পরে a + adjective + noun (day) আছে, তাই What। How-এর পরে শুধু adjective।", en: "A + adjective + noun (day) follows, so What. How takes an adjective alone." } },
        { text: "___ kind of you!", bn: "কী দয়ালু তুমি!", options: ["What", "How", "So"], right: 1, why: { bn: "শুধু adjective, noun নেই: How kind!", en: "Only an adjective and no noun: How kind!" } },
        { text: "___ you like ice cream?", bn: "তুমি কি আইসক্রিম পছন্দ করো?", options: ["Are", "Do", "Is"], right: 1, why: { bn: "like সাধারণ ক্রিয়া, be নেই, তাই do দিয়ে প্রশ্ন: Do you like?", en: "Like is an ordinary verb with no be, so the question uses do: Do you like?" } },
        { text: "___ late for the exam.", bn: "পরীক্ষায় দেরি কোরো না।", options: ["Not be", "Don't be", "No be"], right: 1, why: { bn: "না-বাচক আদেশ: Don't + খালি ক্রিয়া। be-র সাথেও Don't be।", en: "A negative command: Don't + bare verb, and be is no exception: Don't be." } },
        { text: "___ go to the field, everyone!", bn: "চলো সবাই মাঠে যাই!", options: ["Let's", "Lets", "Let us to"], right: 0, why: { bn: "Let's = Let us, অ্যাপস্ট্রফি সহ, পরে খালি ক্রিয়া: Let's go।", en: "Let's is Let us with an apostrophe, and a bare verb follows: Let's go." } },
      ],
    },
    "sentences-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "একটা বাক্য নাও (Rafi eats rice) আর চার জাতে বলো: বলা, জিজ্ঞেস, আদেশ, চমক।", en: "Take one sentence (Rafi eats rice) and say it in all four kinds: statement, question, command, exclamation." } },
        { text: { bn: "ছোট ভাইবোন বা বন্ধুকে পাঁচটা আদেশ ইংরেজিতে, please সহ: Please pass the salt.", en: "Five commands in English to a sibling or friend, with please: Please pass the salt." } },
        { text: { bn: "জানালার বাইরে যা দেখছ, তিনটা What a…! আর দুটো How…!", en: "Three What a…! and two How…! about what you see out of the window." } },
      ],
    },
  },
},

};
