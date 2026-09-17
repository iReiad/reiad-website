/* ============================================================
   19-relatives.ts: পর্ব ১৯, who, which, that: বাক্যের ভিতরে বাক্য.

   One part of the grammar term, gathered into the rung by
   `advanced.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>ধারাভাষ্যকার বললেন, <span lang="en">The boy who scored the century is only sixteen.</span> এক বাক্যে দুটো খবর: একটা ছেলে সেঞ্চুরি করেছে, আর তার বয়স ষোলো। দুটো বাক্য না বলে একটাকে অন্যটার ভিতরে বসিয়ে দেওয়া হয়েছে, <span lang="en">who</span> দিয়ে। ওই <span lang="en">who</span>, আর তার ভাইবোন <span lang="en">which, that, whose, where</span>: এদের নাম <span lang="en">relative pronoun</span>, আর যে অংশটা তারা শুরু করে তার নাম <span lang="en">relative clause</span>। পর্ব ১৪-এর জোড়ার পরের ধাপ: জোড়া নয়, ভিতরে ঢোকানো।</p>

<p>এই পর্বে সাতটা শব্দ কার জন্য, দুটো বাক্য থেকে একটা বানানোর মেশিন, কমার খেলা (যেখানে সবচেয়ে বেশি নম্বর), কখন pronoun-টা বাদ দেওয়া যায়, preposition কোথায় বসে, clause ছোট করে <span lang="en">-ing</span> বা V3 বানানো, আর পরীক্ষার <span lang="en">join the sentences</span>।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">who</span> মানুষের জন্য, <span lang="en">which</span> জিনিস আর প্রাণীর জন্য, <span lang="en">that</span> দুটোর জন্যই (কথায়)।</li>
<li><span lang="en">whose</span>: কার। <span lang="en">where</span>: যে জায়গায়। <span lang="en">when</span>: যে সময়ে। <span lang="en">why</span>: যে কারণে।</li>
<li>clause-টা noun-এর ঠিক পরে বসে, যাকে বর্ণনা করছে তার গায়ে লেগে।</li>
<li>কমা ছাড়া: কোন জনটা, তা চেনাচ্ছে (জরুরি)। কমা সহ: বাড়তি তথ্য (বাদ দিলেও চলে)। নামের পরে সবসময় কমা।</li>
<li>pronoun-টা clause-এর কর্ম হলে বাদ দেওয়া যায়: <span lang="en">the film (that) I saw</span>। কর্তা হলে নয়।</li>
<li>clause-এর ভিতরে দ্বিতীয়বার pronoun নয়: <span lang="en">the bat which I bought it</span> ভুল।</li>
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
<tr><td><span lang="en">why</span></td><td>কারণ, <span lang="en">the reason</span>-এর পরে</td><td><span lang="en">the reason why he left</span></td></tr>
</tbody>
</table>
</div>

<p><span lang="en">that</span> নিয়ে একটা কথা: কমা ছাড়া clause-এ <span lang="en">that</span> মানুষের জন্যও চলে (<span lang="en">the boy that scored</span>), জিনিসের জন্যও (<span lang="en">the ball that broke</span>), আর কথায় এটাই বেশি শোনা যায়। কিন্তু কমা সহ clause-এ কখনো <span lang="en">that</span> নয়, আর preposition-এর ঠিক পরেও নয় (<span lang="en">in which</span>, <span lang="en">in that</span> নয়)। সবার সেরা, <span lang="en">all, everything, nothing, the only</span>-র পরে <span lang="en">that</span>-ই স্বাভাবিক: <span lang="en">the best film that I have seen, everything that he said</span>।</p>

${mount("relatives-which")}

<h2>দুটো বাক্য থেকে একটা</h2>

<p>মেশিনটা তিন ধাপে। (১) দুটো বাক্যে একই মানুষ বা জিনিস খোঁজো: <span lang="en">I met a man. The man knows Shakib.</span> দুবার <span lang="en">man</span>। (২) দ্বিতীয় বাক্যের <span lang="en">man</span>-কে <span lang="en">who</span> বানাও: <span lang="en">who knows Shakib</span>। (৩) প্রথম বাক্যের <span lang="en">man</span>-এর ঠিক পরে বসাও: <span lang="en">I met a man who knows Shakib.</span> ব্যস। জিনিস হলে <span lang="en">which</span>: <span lang="en">This is the bat. Rafi bought the bat yesterday. This is the bat which Rafi bought yesterday.</span></p>

<p>দ্বিতীয় বাক্যে শব্দটা যদি <span lang="en">his, her, their</span> হয়, তাহলে <span lang="en">whose</span>: <span lang="en">I met a girl. Her brother plays for Khulna. I met a girl whose brother plays for Khulna.</span> যদি <span lang="en">there</span> হয়, <span lang="en">where</span>: <span lang="en">This is the stadium. We watched the final there. This is the stadium where we watched the final.</span> যদি <span lang="en">then</span> হয়, <span lang="en">when</span>। আর একটা নিয়ম যেটা প্রায়ই ভুল হয়: clause-টা যে noun-কে বর্ণনা করছে তার <em>ঠিক পরে</em> বসে, বাক্যের শেষে নয়। <span lang="en">The boy who scored the century is sixteen</span>, <span lang="en">The boy is sixteen who scored</span> নয়।</p>

${mount("relatives-steps")}

${mount("relatives-lines")}

<h2>কমার খেলা: চেনানো, নাকি বাড়তি</h2>

<p>এটাই এই পর্বের সবচেয়ে সূক্ষ্ম কথা, আর সবচেয়ে বেশি নম্বরের। দুটো বাক্য দেখো:</p>

<div class="ex"><span lang="en">My brother who lives in Sylhet is a doctor.</span><br>
<span lang="en">My brother, who lives in Sylhet, is a doctor.</span></div>

<p>প্রথমটা কমা ছাড়া: আমার একাধিক ভাই আছে, আর যে ভাইটা সিলেটে থাকে, সে-ই ডাক্তার। clause-টা <em>চেনাচ্ছে</em> কোন ভাই; বাদ দিলে বোঝা যাবে না। এর নাম <span lang="en">defining</span>। দ্বিতীয়টা কমা সহ: আমার একটাই ভাই, সে ডাক্তার, আর বাড়তি খবর, সে সিলেটে থাকে। clause-টা বাদ দিলেও বাক্য পূর্ণ। এর নাম <span lang="en">non-defining</span>। কমা দুটো বন্ধনীর মতো কাজ করে: ভিতরের কথাটা বাড়তি।</p>

<p>দুটো নিয়ম এখান থেকে বেরোয়। কমা সহ clause-এ <span lang="en">that</span> বসে না, <span lang="en">who</span> বা <span lang="en">which</span> লাগে। আর নাম বা একটাই এমন জিনিসের পরে সবসময় কমা, কারণ নামকে চেনাতে হয় না: <span lang="en">Shakib, who captained the side, took three wickets. Dhaka, which is on the Buriganga, is crowded.</span></p>

<p>কমা-সহ clause-এর আরেকটা কাজ: আগের পুরো বাক্যটা নিয়ে মন্তব্য, <span lang="en">which</span> দিয়ে। <span lang="en">Rafi scored a century, which surprised everyone.</span> এখানে <span lang="en">which</span> মানে "এই যে সেঞ্চুরি করল, এটা"। পুরো ঘটনাটাই <span lang="en">which</span>-এর noun। আর সংখ্যা সহ: <span lang="en">I have three cousins, two of whom live in Sylhet. Nanu told ten stories, most of which I had heard before.</span></p>

${mount("relatives-commas")}

${mount("relatives-reveal")}

${mount("relatives-gap")}

<h2>কখন বাদ দেওয়া যায়</h2>

<p>relative pronoun-টা যদি নিজের clause-এর ভিতরে <em>কর্ম</em> হয়, মানে তার পরেই আরেকটা কর্তা আসে, তাহলে কথায় বাদ দেওয়া হয়। <span lang="en">The film that I saw was boring.</span> <span lang="en">that</span>-এর পরে <span lang="en">I</span>, তাই বাদ: <span lang="en">The film I saw was boring.</span> কিন্তু কর্তা হলে বাদ দেওয়া যায় না: <span lang="en">The boy who scored is sixteen.</span> <span lang="en">who</span>-র পরেই ক্রিয়া, কেউ নেই তার জায়গা নেওয়ার, তাই থাকবে। কৌশল: pronoun-এর পরে সরাসরি ক্রিয়া? রাখো। pronoun-এর পরে আরেকটা কর্তা? বাদ দিতে পারো। কমা-সহ clause-এ কখনো বাদ নয়।</p>

<h2>preposition কোথায় বসে</h2>

<p>দ্বিতীয় বাক্যে যদি একটা preposition থাকে (<span lang="en">I spoke to the coach. I live in the house.</span>), তাহলে দুটো পথ। কথায় preposition clause-এর শেষে থেকে যায়, আর pronoun বাদ: <span lang="en">the coach I spoke to, the house I live in</span>। লেখায়, আনুষ্ঠানিক, preposition সামনে আর তার পরে <span lang="en">whom</span> বা <span lang="en">which</span>: <span lang="en">the coach to whom I spoke, the house in which I live</span>। দুটোই ঠিক; মেশানোটা ভুল: <span lang="en">the house in which I live in</span> নয়, আর <span lang="en">to who</span> বা <span lang="en">in that</span> নয়। পর্ব ৯-এর বাক্যের শেষের preposition এখানেই।</p>

<div class="table-scroll">
<table>
<thead><tr><th>দুটো বাক্য</th><th>কথায়</th><th>লেখায়</th></tr></thead>
<tbody>
<tr><td><span lang="en">This is the coach. I spoke to him.</span></td><td><span lang="en">This is the coach I spoke to.</span></td><td><span lang="en">This is the coach to whom I spoke.</span></td></tr>
<tr><td><span lang="en">That is the house. I was born in it.</span></td><td><span lang="en">That is the house I was born in.</span></td><td><span lang="en">That is the house in which I was born.</span></td></tr>
<tr><td><span lang="en">She is the friend. I depend on her.</span></td><td><span lang="en">She is the friend I depend on.</span></td><td><span lang="en">She is the friend on whom I depend.</span></td></tr>
</tbody>
</table>
</div>

${mount("relatives-drop")}

<h2>clause ছোট করা: -ing আর V3</h2>

<p><span lang="en">who/which + be</span> প্রায়ই বাদ দেওয়া যায়, আর যা থাকে সেটা <span lang="en">-ing</span> বা V3। <span lang="en">The boy who is standing there is my cousin. → The boy standing there is my cousin.</span> <span lang="en">The bat which was bought yesterday is broken. → The bat bought yesterday is broken.</span> কর্তা নিজে কাজ করলে <span lang="en">-ing</span>, কাজটা তার উপর হলে V3, পর্ব ১৫-র passive-এর ছায়া। পরীক্ষায় <span lang="en">complex to simple</span>-এর একটা পথ এটাই: <span lang="en">The man who wore a red cap was the umpire. → The man wearing a red cap was the umpire.</span></p>

<p>আর <span lang="en">what</span>: এটা একা একটা relative, যার ভিতরে noun-টা লুকানো, মানে <span lang="en">the thing which</span>। <span lang="en">What he said was true. I did not hear what Nanu told you.</span> <span lang="en">what</span>-এর আগে কোনো noun বসে না: <span lang="en">the thing what he said</span> ভুল।</p>

<div class="ex"><b>Feluda মনে করো:</b> <span lang="en">Feluda, who is a private detective, lives in Calcutta with his cousin Topshe, whose father is a friend of the family.</span> দুটো কমা-সহ clause, কারণ নাম চেনাতে হয় না। আর Jatayu-র বই: <span lang="en">the books that Jatayu writes</span>, কমা ছাড়া, কারণ কোন বই তা চেনাচ্ছে।</div>

${mount("relatives-shorten")}

${mount("relatives-build")}

${mount("relatives-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>দুটো চেহারা। এক: <span lang="en">Join the sentences using a relative pronoun</span>, পাঁচ জোড়া। দুই: <span lang="en">right form</span> বা <span lang="en">gap filling</span>, খালি ঘরে <span lang="en">who / which / whose / where</span>। প্রথমটার ধাপ:</p>

<ol class="step-list">
<li><strong>দুই বাক্যে একই শব্দটা খোঁজো।</strong> নাম, noun, বা দ্বিতীয় বাক্যে তার বদলি pronoun (<span lang="en">he, it, his, there</span>)।</li>
<li><strong>দ্বিতীয় বাক্যের শব্দটাকে বদলাও।</strong> মানুষ: <span lang="en">who</span> (কর্ম হলে <span lang="en">whom</span>)। জিনিস: <span lang="en">which</span>। <span lang="en">his/her/their</span>: <span lang="en">whose</span>। <span lang="en">there</span>: <span lang="en">where</span>। <span lang="en">then</span>: <span lang="en">when</span>।</li>
<li><strong>clause-টা প্রথম বাক্যের সেই শব্দের ঠিক পরে বসাও।</strong> pronoun clause-এর শুরুতে, বাকি ক্রম সোজা।</li>
<li><strong>কমা?</strong> শব্দটা নাম বা একটাই জিনিস হলে দুই পাশে কমা। নইলে নয়।</li>
<li><strong>একবার পড়ো।</strong> ভিতরে <span lang="en">it, him, there</span> বাড়তি থেকে যায়নি তো?</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">(a) I have a friend. He lives in London. (b) This is the house. Nanu was born there. (c) Mitu is a student. Her marks are the highest. (d) Shakib took a catch. It won us the match. (e) The film was boring. I saw it last night.</span> উত্তর: (a) <span lang="en">I have a friend who lives in London.</span> (b) <span lang="en">This is the house where Nanu was born.</span> (c) <span lang="en">Mitu is a student whose marks are the highest.</span> (d) <span lang="en">Shakib took a catch which won us the match.</span> (e) <span lang="en">The film which I saw last night was boring.</span> (<span lang="en">which</span> বাদও যায়।) পাঁচ জোড়া, পাঁচটা আলাদা শব্দ।</div>

${mount("relatives-exam")}

${mount("relatives-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>দুটো বাক্য <span lang="en">relative pronoun</span> দিয়ে জোড়া দিতে বললে: দ্বিতীয় বাক্যের যে শব্দটা প্রথম বাক্যেও আছে, সেটাকেই বদলাও, আর clause-টা প্রথম বাক্যে সেই শব্দের ঠিক পরে বসাও, দূরে নয়। মানুষ <span lang="en">who</span>, জিনিস <span lang="en">which</span>, মালিকানার <span lang="en">his/her/their</span> থাকলে <span lang="en">whose</span>, জায়গা আর সেখানে <span lang="en">there</span> থাকলে <span lang="en">where</span>। প্রথম বাক্যের শব্দটা নাম হলে কমা দাও।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>relative clause-এর ভিতরে দ্বিতীয়বার pronoun নয়। <span lang="en">The bat which I bought it yesterday</span> ভুল: <span lang="en">which</span> আগে থেকেই ব্যাটটা, <span lang="en">it</span> বাড়তি। <span lang="en">The bat which I bought yesterday.</span> বাংলায় "যেটা আমি কাল কিনেছি সেটা" দুবার বলা যায়, ইংরেজিতে <span lang="en">which</span> একাই দুই কাজ করে।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p>clause-এর ভিতরের ক্রিয়া মেলে যে noun-কে বর্ণনা করছে তার সাথে, <span lang="en">who</span>-র সাথে নয়। <span lang="en">the boy who plays</span> (একজন), <span lang="en">the boys who play</span> (অনেক)। আর <span lang="en">one of the boys who play</span>: <span lang="en">play</span>, কারণ <span lang="en">who</span> এখানে <span lang="en">boys</span>-এর বদলি, <span lang="en">one</span>-এর নয়। পর্ব ৬-এর লুকানো কর্তা এখানেও।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>আটটা শব্দ কার জন্য, না দেখে?</li>
<li>দুটো বাক্য থেকে একটা: তিন ধাপ?</li>
<li>কমা সহ আর কমা ছাড়া: <span lang="en">My brother who</span> আর <span lang="en">My brother, who</span>?</li>
<li>কখন pronoun বাদ দেওয়া যায়, কখন নয়?</li>
<li><span lang="en">to whom</span> আর <span lang="en">who … to</span>: দুটোই ঠিক কেন?</li>
<li><span lang="en">the boy standing there</span>: কোন clause ছোট হলো?</li>
</ul>
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
    "relatives-which": {
      kind: "bins",
      title: { bn: "কোন শব্দ", en: "Which word" },
      note: { bn: "প্রতিটা বাক্যের খালি জায়গায় কোন relative বসবে, সেই ঘরে ফেলো।", en: "Drop each sentence into the box of the relative that fills its gap." },
      bins: [
        { id: "who", label: { bn: "who / whom", en: "who / whom" } },
        { id: "which", label: { bn: "which / that", en: "which / that" } },
        { id: "whose", label: { bn: "whose", en: "whose" } },
        { id: "where", label: { bn: "where / when / why", en: "where / when / why" } },
      ],
      items: [
        { text: { bn: "the bowler ___ took five wickets", en: "the bowler ___ took five wickets" }, bin: "who", why: { bn: "মানুষ, কর্তা: who।", en: "A person, the subject: who." } },
        { text: { bn: "the ball ___ broke the window", en: "the ball ___ broke the window" }, bin: "which", why: { bn: "জিনিস: which বা that।", en: "A thing: which or that." } },
        { text: { bn: "the girl ___ brother plays for Khulna", en: "the girl ___ brother plays for Khulna" }, bin: "whose", why: { bn: "কার ভাই: whose।", en: "Whose brother: whose." } },
        { text: { bn: "the stadium ___ we watched the final", en: "the stadium ___ we watched the final" }, bin: "where", why: { bn: "জায়গা: where।", en: "A place: where." } },
        { text: { bn: "the year ___ Bangladesh beat India", en: "the year ___ Bangladesh beat India" }, bin: "where", why: { bn: "সময়: when।", en: "A time: when." } },
        { text: { bn: "the coach ___ everyone respects", en: "the coach ___ everyone respects" }, bin: "who", why: { bn: "মানুষ, কর্ম: whom, বা কথায় who।", en: "A person, the object: whom, or who in speech." } },
        { text: { bn: "the reason ___ he left early", en: "the reason ___ he left early" }, bin: "where", why: { bn: "কারণ: the reason why।", en: "A reason: the reason why." } },
        { text: { bn: "the house ___ roof was blown off", en: "the house ___ roof was blown off" }, bin: "whose", why: { bn: "জিনিসের মালিকানাতেও whose: the house whose roof।", en: "Whose works for things too: the house whose roof." } },
        { text: { bn: "the story ___ Nanu told last night", en: "the story ___ Nanu told last night" }, bin: "which", why: { bn: "জিনিস, কর্ম: which / that, বা বাদ।", en: "A thing, the object: which or that, or nothing." } },
      ],
    },
    "relatives-steps": {
      kind: "order",
      title: { bn: "দুই থেকে এক: ধাপগুলো", en: "Two into one: the steps" },
      note: { bn: "I met a girl. Her brother plays for Khulna. এই দুটো জোড়ার ধাপ ক্রমে সাজাও।", en: "Put the steps in order for joining I met a girl. Her brother plays for Khulna." },
      items: [
        { text: { bn: "দুই বাক্যে একই মানুষ খোঁজো: a girl আর her (মেয়েটার)", en: "Find the shared person: a girl and her (the girl's)" } },
        { text: { bn: "her মালিকানা, তাই দ্বিতীয় বাক্যের her হয়ে যায় whose: whose brother plays for Khulna", en: "Her is possessive, so the her of the second sentence becomes whose: whose brother plays for Khulna" } },
        { text: { bn: "clause-টা প্রথম বাক্যের girl-এর ঠিক পরে বসাও: I met a girl whose brother plays for Khulna.", en: "Put the clause right after girl in the first sentence: I met a girl whose brother plays for Khulna." } },
        { text: { bn: "কমা লাগবে কি না দেখো: a girl নাম নয়, চেনাচ্ছে, তাই কমা নেই", en: "Check for commas: a girl is not a name, the clause identifies her, so no commas" } },
        { text: { bn: "একবার পড়ে দেখো ভিতরে her থেকে যায়নি: whose her brother নয়", en: "Read it once to make sure her did not survive inside: not whose her brother" } },
      ],
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
        { target: "Rafi scored a century, which surprised everyone.", bn: "রাফি সেঞ্চুরি করল, যেটা সবাইকে অবাক করল।" },
      ],
    },
    "relatives-commas": {
      kind: "compare",
      title: { bn: "কমা ছাড়া, কমা সহ", en: "Without commas, with commas" },
      note: { bn: "একই শব্দ, দুই মানে, আর দুই নিয়ম।", en: "The same words, two meanings, and two sets of rules." },
      columns: [
        { bn: "কমা ছাড়া: চেনানো", en: "no commas: defining" },
        { bn: "কমা সহ: বাড়তি", en: "commas: non-defining" },
      ],
      rows: [
        { label: { bn: "কী করে", en: "What it does" }, cells: [{ bn: "বলে কোনটা; বাদ দিলে বোঝা যায় না", en: "says which one; dropping it loses the meaning" }, { bn: "বাড়তি খবর; বাদ দিলেও বাক্য পূর্ণ", en: "extra news; the sentence stands without it" }] },
        { label: { bn: "উদাহরণ", en: "Example" }, cells: [{ bn: "My brother who lives in Sylhet is a doctor.", en: "My brother who lives in Sylhet is a doctor." }, { bn: "My brother, who lives in Sylhet, is a doctor.", en: "My brother, who lives in Sylhet, is a doctor." }] },
        { label: { bn: "মানে", en: "Meaning" }, cells: [{ bn: "একাধিক ভাই; সিলেটেরটা ডাক্তার", en: "several brothers; the Sylhet one is the doctor" }, { bn: "একটাই ভাই; সে ডাক্তার, আর সিলেটে থাকে", en: "one brother; he is a doctor, and he lives in Sylhet" }] },
        { label: { bn: "that", en: "that" }, cells: [{ bn: "চলে", en: "allowed" }, { bn: "কখনো নয়", en: "never" }] },
        { label: { bn: "pronoun বাদ", en: "Dropping the pronoun" }, cells: [{ bn: "কর্ম হলে যায়", en: "possible when it is the object" }, { bn: "কখনো নয়", en: "never" }] },
        { label: { bn: "নামের পরে", en: "After a name" }, cells: [{ bn: "হয় না", en: "not used" }, { bn: "সবসময়: Shakib, who…", en: "always: Shakib, who…" }] },
      ],
    },
    "relatives-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: রাফির কয়টা বোন?", en: "Guess first: how many sisters does Rafi have?" },
      ask: { bn: "রাফি লিখল: My sister, who lives in Dhaka, is a teacher. মিতু লিখল: My sister who lives in Dhaka is a teacher. কার একাধিক বোন?", en: "Rafi wrote: My sister, who lives in Dhaka, is a teacher. Mitu wrote: My sister who lives in Dhaka is a teacher. Who has more than one sister?" },
      choices: [
        { bn: "রাফির", en: "Rafi" },
        { bn: "মিতুর", en: "Mitu" },
        { bn: "দুজনেরই", en: "Both" },
      ],
      answer: { bn: "মিতুর। কমা ছাড়া clause চেনাচ্ছে কোন বোন, মানে একাধিক আছে। রাফির কমা বলছে একটাই বোন, আর ঢাকায় থাকাটা বাড়তি খবর।", en: "Mitu. Without commas the clause picks out which sister, so there is more than one. Rafi's commas say there is just one sister, and living in Dhaka is extra news." },
      why: { bn: "দুটো কমা দুটো বন্ধনীর মতো: ভিতরের কথাটা তুলে নিলেও বাক্য দাঁড়িয়ে থাকে, My sister is a teacher, একটাই বোন। কমা না থাকলে clause-টা noun-এর গায়ে লেগে তাকে চেনায়, তাই চেনানোর দরকার আছে, মানে বোন একাধিক। একই আটটা শব্দ, দুটো কমা, বোনের সংখ্যা বদলে গেল। পরীক্ষায় এই প্রশ্নটা ঠিক এভাবেই আসে: which sentence means…", en: "Two commas work like brackets: lift out what is inside and the sentence still stands, My sister is a teacher, one sister. Without commas the clause clings to the noun and identifies it, so identification is needed, meaning there is more than one sister. The same eight words, two commas, and the number of sisters changes. The exam asks exactly this: which sentence means…" },
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
        { text: "Rafi missed the bus, ___ made him late for the final.", bn: "রাফি বাস মিস করল, যেটা তাকে ফাইনালে দেরি করিয়ে দিল।", options: ["that", "which", "what"], right: 1, why: { bn: "আগের পুরো ঘটনা নিয়ে মন্তব্য, কমা সহ: which। that কমার পরে বসে না।", en: "A comment on the whole previous event, with a comma: which. That never follows a comma." } },
        { text: "I did not understand ___ the teacher said.", bn: "শিক্ষক যা বললেন আমি বুঝিনি।", options: ["that", "which", "what"], right: 2, why: { bn: "আগে কোনো noun নেই: what = the thing which।", en: "No noun before it: what, meaning the thing which." } },
      ],
    },
    "relatives-drop": {
      kind: "gap",
      title: { bn: "রাখব, বাদ দেব, নাকি preposition সামনে", en: "Keep it, drop it, or move the preposition" },
      note: { bn: "pronoun-এর পরে ক্রিয়া হলে রাখো; আরেকটা কর্তা হলে বাদ দিতে পারো; preposition থাকলে দুই পথের একটা।", en: "A verb after the pronoun means keep it; another subject means you may drop it; a preposition gives you two roads." },
      items: [
        { text: "The boy ___ scored the century is my cousin.", bn: "যে ছেলেটা সেঞ্চুরি করল, সে আমার কাজিন।", options: ["who", "(nothing)", "whom"], right: 0, why: { bn: "who-র পরেই ক্রিয়া, who কর্তা: রাখতে হবে।", en: "A verb follows who, so who is the subject: it stays." } },
        { text: "The film ___ we saw last night was boring.", bn: "কাল রাতে যে সিনেমাটা দেখলাম, সেটা বিরক্তিকর ছিল।", options: ["who", "(nothing) or which", "whose"], right: 1, why: { bn: "পরে আরেকটা কর্তা (we), pronoun কর্ম: বাদ দেওয়া যায়, বা which/that।", en: "Another subject (we) follows, so the pronoun is the object: drop it, or which/that." } },
        { text: "This is the coach ___ I spoke yesterday.", bn: "এই সেই কোচ যার সাথে আমি কাল কথা বলেছি।", options: ["to whom", "to who", "whom to"], right: 0, why: { bn: "preposition সামনে হলে তার পরে whom: to whom I spoke। কথায়: the coach I spoke to।", en: "With the preposition in front, whom follows it: to whom I spoke. In speech: the coach I spoke to." } },
        { text: "That is the house ___ Nanu was born.", bn: "ওটাই সেই বাড়ি যেখানে নানু জন্মেছিলেন।", options: ["in which", "in that", "which"], right: 0, why: { bn: "in which = where। in that হয় না, আর শুধু which হলে in-টা হারিয়ে যায়।", en: "In which equals where. In that is impossible, and bare which loses the in." } },
        { text: "Shakib, ___ everyone admires, is very humble.", bn: "শাকিব, যাঁকে সবাই শ্রদ্ধা করে, খুব বিনয়ী।", options: ["(nothing)", "whom", "that"], right: 1, why: { bn: "কমা সহ clause: বাদ দেওয়া যায় না, that-ও নয়: whom (বা who)।", en: "A comma clause: nothing can be dropped and that is banned: whom (or who)." } },
        { text: "Everything ___ he said was true.", bn: "সে যা যা বলল সব সত্যি।", options: ["what", "that", "which"], right: 1, why: { bn: "everything-এর পরে that স্বাভাবিক; what-এর আগে noun বসে না।", en: "After everything, that is natural; what never follows a noun." } },
      ],
    },
    "relatives-shorten": {
      kind: "match",
      title: { bn: "clause ছোট করো", en: "Shorten the clause" },
      note: { bn: "বাঁ দিকের পুরো clause-এর সাথে ডান দিকের ছোট রূপ মেলাও। কর্তা নিজে করলে -ing, তার উপর হলে V3।", en: "Match each full clause on the left with its short form on the right. -ing when the subject acts, V3 when it is acted on." },
      pairs: [
        { left: { bn: "the boy who is standing there", en: "the boy who is standing there" }, right: { bn: "the boy standing there", en: "the boy standing there" } },
        { left: { bn: "the bat which was bought yesterday", en: "the bat which was bought yesterday" }, right: { bn: "the bat bought yesterday", en: "the bat bought yesterday" } },
        { left: { bn: "the man who wore a red cap", en: "the man who wore a red cap" }, right: { bn: "the man wearing a red cap", en: "the man wearing a red cap" } },
        { left: { bn: "the letter which was written by Nanu", en: "the letter which was written by Nanu" }, right: { bn: "the letter written by Nanu", en: "the letter written by Nanu" } },
        { left: { bn: "the students who live in the hostel", en: "the students who live in the hostel" }, right: { bn: "the students living in the hostel", en: "the students living in the hostel" } },
        { left: { bn: "the road which was closed for repairs", en: "the road which was closed for repairs" }, right: { bn: "the road closed for repairs", en: "the road closed for repairs" } },
      ],
    },
    "relatives-build": {
      kind: "build",
      title: { bn: "ভিতরে বাক্য বসিয়ে সাজাও", en: "Build it with the clause inside" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো clause-টা তার noun-এর ঠিক পরে গেল কি না।", en: "The words are shuffled. As you build, check the clause lands right after its noun." },
      pattern: "noun + who / which / whose / where + clause + rest",
      lines: [
        { target: "The boy who scored the century is only sixteen.", bn: "যে ছেলেটা সেঞ্চুরি করল, তার বয়স মাত্র ষোলো।" },
        { target: "This is the stadium where we watched the final.", bn: "এটাই সেই স্টেডিয়াম যেখানে আমরা ফাইনাল দেখেছিলাম।" },
        { target: "Mitu is a student whose marks are the highest.", bn: "মিতু এমন ছাত্রী যার নম্বর সবচেয়ে বেশি।" },
        { target: "Shakib, who captained the side, took three wickets.", bn: "শাকিব, যিনি অধিনায়ক ছিলেন, তিন উইকেট নিলেন।" },
        { target: "The film I saw last night was really boring.", bn: "কাল রাতে যে সিনেমাটা দেখলাম, সেটা সত্যিই বিরক্তিকর ছিল।" },
        { target: "I did not understand what the teacher said.", bn: "শিক্ষক যা বললেন আমি বুঝিনি।" },
      ],
    },
    "relatives-spot": {
      kind: "spot",
      title: { bn: "রাফির রচনা, ভিতরের বাক্যের ভুল", en: "Rafi's essay: the inner-clause mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে relative-এর ভুল, বাড়তি pronoun, বা কমার ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line with a wrong relative, an extra pronoun, or a comma mistake." },
      source: { bn: "রচনা: আমার প্রিয় খেলোয়াড়", en: "Essay: my favourite player" },
      lines: [
        { text: { bn: "Shakib, who is my favourite player, comes from Magura.", en: "Shakib, who is my favourite player, comes from Magura." } },
        { text: { bn: "He is the player which has taken the most wickets for Bangladesh.", en: "He is the player which has taken the most wickets for Bangladesh." }, flag: { bn: "মানুষ: who (বা that), which নয়।", en: "A person: who (or that), not which." } },
        { text: { bn: "The bat which he uses it is very heavy.", en: "The bat which he uses it is very heavy." }, flag: { bn: "which-ই ব্যাটটা; it বাড়তি: which he uses।", en: "Which already is the bat; it is extra: which he uses." } },
        { text: { bn: "I have a cousin whose father coached him as a boy.", en: "I have a cousin whose father coached him as a boy." } },
        { text: { bn: "Magura, that is a small town, is proud of him.", en: "Magura, that is a small town, is proud of him." }, flag: { bn: "কমা সহ clause-এ that নয়: Magura, which is।", en: "No that in a comma clause: Magura, which is." } },
        { text: { bn: "The day when he retires will be a sad day for cricket.", en: "The day when he retires will be a sad day for cricket." } },
        { text: { bn: "The match who I remember most is the 2019 one.", en: "The match who I remember most is the 2019 one." }, flag: { bn: "জিনিস: which বা that, বা বাদ: The match I remember।", en: "A thing: which or that, or nothing: The match I remember." } },
      ],
    },
    "relatives-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Join: This is the boy. His father is a doctor.", en: "Join: This is the boy. His father is a doctor." },
          options: [
            { text: { bn: "This is the boy whose father is a doctor.", en: "This is the boy whose father is a doctor." }, right: true, why: { bn: "হ্যাঁ। His হয়ে যায় whose, clause boy-এর পরে।", en: "Yes. His becomes whose, and the clause follows boy." } },
            { text: { bn: "This is the boy who his father is a doctor.", en: "This is the boy who his father is a doctor." }, why: { bn: "না। who-র পরে his বাড়তি; মালিকানায় whose।", en: "No. His is extra after who; possession takes whose." } },
            { text: { bn: "This is the boy which father is a doctor.", en: "This is the boy which father is a doctor." }, why: { bn: "না। which জিনিসের, আর মালিকানায় whose।", en: "No. Which is for things, and possession takes whose." } },
          ],
        },
        {
          ask: { bn: "Join: Nanu told a story. Nobody had heard it before.", en: "Join: Nanu told a story. Nobody had heard it before." },
          options: [
            { text: { bn: "Nanu told a story which nobody had heard before.", en: "Nanu told a story which nobody had heard before." }, right: true, why: { bn: "হ্যাঁ। it হয় which, clause story-এর পরে, আর it থাকে না।", en: "Yes. It becomes which, the clause follows story, and it disappears." } },
            { text: { bn: "Nanu told a story which nobody had heard it before.", en: "Nanu told a story which nobody had heard it before." }, why: { bn: "না। which-ই গল্পটা; it বাড়তি।", en: "No. Which is the story; it is extra." } },
            { text: { bn: "Nanu told a story, that nobody had heard before.", en: "Nanu told a story, that nobody had heard before." }, why: { bn: "না। that কমার পরে বসে না, আর এখানে কমা লাগেও না।", en: "No. That never follows a comma, and no comma belongs here." } },
          ],
        },
        {
          ask: { bn: "Which sentence means the speaker has ONLY ONE uncle?", en: "Which sentence means the speaker has ONLY ONE uncle?" },
          options: [
            { text: { bn: "My uncle who lives in Sylhet is a doctor.", en: "My uncle who lives in Sylhet is a doctor." }, why: { bn: "না। কমা ছাড়া চেনাচ্ছে কোন মামা: একাধিক মামা।", en: "No. Without commas it identifies which uncle: more than one." } },
            { text: { bn: "My uncle, who lives in Sylhet, is a doctor.", en: "My uncle, who lives in Sylhet, is a doctor." }, right: true, why: { bn: "হ্যাঁ। কমা সহ: একটাই মামা, সিলেটে থাকাটা বাড়তি।", en: "Yes. With commas: one uncle, and Sylhet is extra news." } },
            { text: { bn: "দুটোই একই মানে", en: "Both mean the same" }, why: { bn: "না। কমা মামার সংখ্যা বদলে দেয়।", en: "No. The commas change the number of uncles." } },
          ],
        },
        {
          ask: { bn: "Make it simple: The man who was wearing a red cap was the umpire.", en: "Make it simple: The man who was wearing a red cap was the umpire." },
          options: [
            { text: { bn: "The man wearing a red cap was the umpire.", en: "The man wearing a red cap was the umpire." }, right: true, why: { bn: "হ্যাঁ। who was বাদ, -ing থাকে: একটাই clause।", en: "Yes. Who was goes, -ing stays: one clause." } },
            { text: { bn: "The man worn a red cap was the umpire.", en: "The man worn a red cap was the umpire." }, why: { bn: "না। লোকটা নিজে পরছে, তাই -ing; V3 হতো যদি তার উপর কাজ হতো।", en: "No. The man does the wearing, so -ing; V3 would be for something done to him." } },
            { text: { bn: "The man was wearing a red cap and he was the umpire.", en: "The man was wearing a red cap and he was the umpire." }, why: { bn: "না। and দিয়ে compound।", en: "No. And makes a compound." } },
          ],
        },
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
        {
          ask: { bn: "One of the boys who ___ in our team is my cousin. কোনটা?", en: "One of the boys who ___ in our team is my cousin. Which?" },
          options: [
            { text: { bn: "plays", en: "plays" }, why: { bn: "না। who এখানে boys-এর বদলি, অনেক: play।", en: "No. Who stands for boys here, plural: play." } },
            { text: { bn: "play", en: "play" }, right: true, why: { bn: "হ্যাঁ। who-র noun boys, তাই play। বাইরের ক্রিয়া is, কারণ কর্তা one।", en: "Yes. The noun of who is boys, so play. The outer verb is is, because the subject is one." } },
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
        { text: { bn: "তিনটা জায়গা where দিয়ে আর দুটো সময় when দিয়ে: the field where I…, the day when I…", en: "Three places with where and two times with when: the field where I…, the day when I…" } },
        { text: { bn: "পাঁচটা বাক্য pronoun বাদ দিয়ে জোরে: the film I saw, the book I read, the man I met…", en: "Five sentences with the pronoun dropped, aloud: the film I saw, the book I read, the man I met…" } },
        { text: { bn: "ঘরের তিনজনকে -ing দিয়ে ছোট clause-এ: the boy sitting there, the woman cooking…", en: "Three people in the room in short -ing clauses: the boy sitting there, the woman cooking…" } },
      ],
    },
  },
};
