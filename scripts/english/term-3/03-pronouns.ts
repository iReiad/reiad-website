/* ============================================================
   03-pronouns.ts: পর্ব ৩, বদলি খেলোয়াড়: pronoun.

   One part of the grammar term, gathered into the rung by
   `basic.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>রাফি লিখছে: <span lang="en">Shakib is my hero. Shakib bats well. Shakib bowls well. I like Shakib.</span> চার বাক্যে চারবার শাকিব। কোচ হলে বলতেন, একজনকে দিয়েই পুরো ম্যাচ চালাচ্ছ কেন? বদলি নামাও। ইংরেজিতে বদলি খেলোয়াড়ের নাম <span lang="en">pronoun</span>: <span lang="en">Shakib is my hero. He bats well. He bowls well. I like him.</span></p>

<p>ছোট শব্দ, কিন্তু বাংলাভাষীর জন্য একটা ফাঁদ আছে: বাংলায় "সে" যে কাজই করুক একই থাকে, ইংরেজিতে <span lang="en">he</span> কাজ করলে <span lang="en">he</span>, কাজ সহ্য করলে <span lang="en">him</span>। এই পর্বে সেটাই, আর তার সাথে pronoun-এর বাকি পরিবার: কাছের-দূরের <span lang="en">this, that</span>, প্রশ্নের <span lang="en">who, whose</span>, সবার <span lang="en">everyone</span>, আর যে ফাঁদটা লেখায় সবচেয়ে বেশি ধরা পড়ে: <span lang="en">he</span> বলতে কাকে বোঝাচ্ছ, সেটা পাঠক জানে তো?</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>কর্তা হলে <span lang="en">I, you, he, she, it, we, they</span>: যে কাজটা করছে।</li>
<li>কর্ম হলে <span lang="en">me, you, him, her, it, us, them</span>: যার উপর কাজটা হচ্ছে।</li>
<li>কার জিনিস, নামের আগে: <span lang="en">my, your, his, her, its, our, their</span>। একা দাঁড়ালে: <span lang="en">mine, yours, his, hers, ours, theirs</span>।</li>
<li>নিজেই নিজেকে: <span lang="en">myself, yourself, himself, herself, itself, ourselves, themselves</span>।</li>
<li>কাছে-দূরে: <span lang="en">this, that, these, those</span>। প্রশ্নে: <span lang="en">who, whom, whose, which, what</span>।</li>
<li>একটা pronoun সবসময় আগের কোনো noun-এর বদলি, আর পাঠককে জানতে হবে কোনটার।</li>
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

<p>ছকটা একবার দেখে নয়, হাতে ভরে মনে থাকে। নিচের ছকে <span lang="en">I</span>-এর সারি দেওয়া আছে; বাকিগুলো তুমি।</p>

${mount("pronouns-grid")}

<h2>কে সে: he, she, it, they</h2>

<p>মানুষ হলে <span lang="en">he</span> বা <span lang="en">she</span>। জিনিস, প্রাণী আর ভাব হলে <span lang="en">it</span>: <span lang="en">the bat, it; the cat, it; the idea, it</span>। পোষা প্রাণীকে আদর করে অনেকে <span lang="en">he, she</span> বলে, কিন্তু নিয়মে <span lang="en">it</span>। অনেক হলে, মানুষ হোক বা জিনিস, <span lang="en">they</span>: <span lang="en">the players, they; the bats, they</span>।</p>

<p><span lang="en">it</span>-এর আরেকটা কাজ আছে যেটা বাংলায় নেই: আবহাওয়া, সময়, দূরত্ব আর অবস্থার বাক্যে একটা কর্তা লাগে, আর সেটা <span lang="en">it</span>। বাংলায় "বৃষ্টি হচ্ছে", কর্তা নেই। ইংরেজিতে <span lang="en">It is raining.</span> <span lang="en">It is five o'clock. It is far from here. It is hot today. It is Friday.</span> এই <span lang="en">it</span> কারও বদলি নয়, শুধু কর্তার চেয়ারটা ভরাট করছে, কারণ ইংরেজি বাক্যে চেয়ার খালি থাকে না।</p>

<p>আর <span lang="en">you</span> একজনও, অনেকজনও। <span lang="en">You are late, Rafi.</span> <span lang="en">You are all late, boys.</span> একই শব্দ, ক্রিয়াও একই: <span lang="en">are</span>। বাংলার "তুমি" আর "তোমরা" ইংরেজিতে এক।</p>

${mount("pronouns-it")}

<h2>কর্তা নাকি কর্ম: ক্রিয়ার কোন পাশে</h2>

<p>নিয়মটা এক লাইনে: <strong>ক্রিয়ার আগে কর্তা, ক্রিয়ার পরে কর্ম।</strong> <span lang="en">She called him</span>: <span lang="en">she</span> ডাকল, <span lang="en">him</span>-কে ডাকা হলো। উল্টো করলে <span lang="en">He called her</span>। আর <span lang="en">preposition</span>-এর পরেও কর্ম: <span lang="en">with him, for her, to them, about us</span>। কখনো <span lang="en">with he</span> নয়।</p>

<p>সবচেয়ে বেশি ভুলটা হয় দুজনকে একসাথে বলতে গিয়ে। মিতু আপু আর আমি গেলাম: <span lang="en">Mitu and I went</span>, কারণ আমরা কর্তা। স্যার মিতু আপু আর আমাকে ডাকলেন: <span lang="en">Sir called Mitu and me</span>, কারণ আমরা কর্ম। পরীক্ষা করার কৌশল: অন্যজনকে সরিয়ে দাও। <span lang="en">Sir called me</span> ঠিক, <span lang="en">Sir called I</span> ভুল। তাই <span lang="en">Mitu and me</span>।</p>

<p>আর একটা ভদ্রতার ক্রম, যেটা পরীক্ষায় আসে: একসাথে বলার সময় সামনের জন আগে, তৃতীয় জন মাঝে, নিজে সবার শেষে। <span lang="en">You, Rafi and I are in the same team.</span> <span lang="en">I and Rafi</span> নয়। কর্মের বেলাতেও তাই: <span lang="en">The coach picked you, Rafi and me.</span> মনে রাখার কথা: নিজেকে শেষে রাখাটাই ভদ্রতা, ইংরেজিতেও।</p>

${mount("pronouns-lines")}

${mount("pronouns-order")}

<h2>কার জিনিস: my নাকি mine</h2>

<p><span lang="en">my</span> সবসময় একটা নামের আগে বসে: <span lang="en">my bat</span>। <span lang="en">mine</span> একা দাঁড়ায়, নাম ছাড়া: <span lang="en">This bat is mine.</span> একই কথা, দুই ছাঁচ। <span lang="en">This is my bat. This bat is mine.</span> <span lang="en">his</span> দুই কাজই করে, তাই ওটা সহজ; <span lang="en">her</span> আর <span lang="en">hers</span> আলাদা।</p>

<div class="ex"><b>Frozen-এর গান মনে করো:</b> <span lang="en">Let it go</span>। <span lang="en">it</span> এখানে কর্ম: ছেড়ে দাও ওটাকে। আর <span lang="en">The Lion King</span>-এ Mufasa বলে, <span lang="en">Everything the light touches is our kingdom.</span> <span lang="en">our</span> বসেছে <span lang="en">kingdom</span>-এর আগে। নামের আগে বসলে <span lang="en">our</span>, একা হলে <span lang="en">ours</span>: <span lang="en">The kingdom is ours.</span></div>

<p>একা-রূপগুলোর একটা কাজের ছাঁচ: <span lang="en">a friend of mine</span>, আমার এক বন্ধু। <span lang="en">a cousin of hers, a neighbour of ours</span>। বাংলায় "আমার একটা বন্ধু", ইংরেজিতে <span lang="en">a friend of mine</span>, <span lang="en">a my friend</span> নয়।</p>

${mount("pronouns-match")}

${mount("pronouns-gap")}

<h2>নিজে নিজেই: -self</h2>

<p>কর্তা আর কর্ম একই মানুষ হলে <span lang="en">-self</span>: <span lang="en">Rafi hurt himself</span>, রাফি নিজেকে ব্যথা দিল। <span lang="en">Rafi hurt him</span> মানে অন্য কাউকে। আর জোর দিতে: <span lang="en">I made this cake myself</span>, নিজেই বানিয়েছি, কেউ সাহায্য করেনি। বহুবচনে <span lang="en">-selves</span>: <span lang="en">We enjoyed ourselves</span>, <span lang="en">They did it themselves</span>।</p>

<p>দুটো ভুল বানান, যেগুলো শুনতে ঠিক লাগে বলেই লেখায় চলে আসে: <span lang="en">hisself</span> বলে কিছু নেই, <span lang="en">himself</span>; <span lang="en">theirselves</span> বলে কিছু নেই, <span lang="en">themselves</span>। কর্ম-রূপের সাথে <span lang="en">-self</span>: <span lang="en">him + self, them + selves</span>। আর <span lang="en">each other</span> আলাদা জিনিস: <span lang="en">Rafi and Mitu help each other</span>, একে অন্যকে; <span lang="en">help themselves</span> হলে যে যার নিজেকে।</p>

<div class="side-note">
<p class="side-note-label">it আর its আর it's</p>
<p><span lang="en">its</span> মানে "এর", কার জিনিস: <span lang="en">The cat licked its paw.</span> <span lang="en">it's</span> মানে <span lang="en">it is</span>: <span lang="en">It's raining.</span> অ্যাপস্ট্রফি থাকলে দুটো শব্দ, না থাকলে মালিকানা। ইংরেজিতে যারা জন্ম থেকে বলে তারাও এটা ভুল করে, তাই এটা জানলে তুমি এগিয়ে।</p>
</div>

<h2>কাছে আর দূরে: this, that, these, those</h2>

<p>হাতের কাছে একটা: <span lang="en">this</span>। দূরে একটা: <span lang="en">that</span>। হাতের কাছে অনেক: <span lang="en">these</span>। দূরে অনেক: <span lang="en">those</span>। <span lang="en">This is my bat, and that is Rafi's. These are my books, those are yours.</span> সময়েও একই ছবি: এখনের জিনিস <span lang="en">this</span> (<span lang="en">this week</span>), আগের জিনিস <span lang="en">that</span> (<span lang="en">that day</span>)। ফোনে: <span lang="en">This is Rafi.</span> আমি রাফি বলছি। আর একটা পুরো কথার বদলি: <span lang="en">Rafi is late again. That is not fair.</span> এখানে <span lang="en">that</span> মানে আগের পুরো বাক্যটা।</p>

<div class="table-scroll">
<table>
<thead><tr><th></th><th>একটা</th><th>অনেক</th></tr></thead>
<tbody>
<tr><td>কাছে, এখন</td><td><span lang="en">this</span></td><td><span lang="en">these</span></td></tr>
<tr><td>দূরে, তখন</td><td><span lang="en">that</span></td><td><span lang="en">those</span></td></tr>
</tbody>
</table>
</div>

${mount("pronouns-point")}

<h2>বাকি পরিবার: প্রশ্নের, সবার, কারও-না</h2>

<p><strong>প্রশ্নের pronoun:</strong> <span lang="en">who</span> (কে, কর্তা), <span lang="en">whom</span> (কাকে, কর্ম), <span lang="en">whose</span> (কার), <span lang="en">which</span> (কোনটা), <span lang="en">what</span> (কী)। <span lang="en">Who called? Whom did you call? Whose bat is this? Which one is yours?</span> কথায় <span lang="en">whom</span> প্রায় হারিয়ে গেছে, <span lang="en">Who did you call?</span> চলে; পরীক্ষায় <span lang="en">whom</span> লিখলে বাড়তি নম্বর। কৌশল: উত্তরে <span lang="en">him</span> বসলে <span lang="en">whom</span>, <span lang="en">he</span> বসলে <span lang="en">who</span>। প্রশ্ন বানানোর পুরো মেশিন পর্ব ১৩-তে।</p>

<p><strong>সবার আর কারও-না:</strong> <span lang="en">everyone, everybody, someone, anyone, no one, nobody, everything, something, nothing</span>। এরা দেখতে অনেক, ব্যাকরণে একজন: <span lang="en">Everyone is here. Nobody knows. Something is wrong.</span> ক্রিয়ায় একজনের রূপ, পর্ব ৬-এর সেই টুপি। আর <span lang="en">one</span> একটা noun-এর বদলিও হয়: <span lang="en">Which bat? The red one. The old ones are broken.</span> পর্ব ২০-তে <span lang="en">some, any, each, every</span>-র পুরো তালিকা।</p>

<h2>he বলতে কাকে বোঝাচ্ছ</h2>

<p>একটা pronoun সবসময় আগের কোনো noun-এর বদলি, আর ওই noun-টা পাঠকের মাথায় স্পষ্ট থাকতে হবে। <span lang="en">Rafi told Tamim that he had been selected.</span> কে নির্বাচিত হলো? রাফি, না তামিম? বাক্যটা বলে না। লেখক জানে, পাঠক জানে না। এর নাম অস্পষ্ট বদলি, আর রচনায় নম্বর কাটার একটা বড় কারণ। সারানোর উপায়: নামটা আবার বলো, বা বাক্য ভাঙো। <span lang="en">Rafi told Tamim, "You have been selected."</span></p>

<p>দ্বিতীয় নিয়ম: pronoun আর তার noun-এর সংখ্যা মিলতে হবে। <span lang="en">Every student must bring his or her book</span>, <span lang="en">their book</span> নয় পরীক্ষার খাতায়, কারণ <span lang="en">every student</span> একজন। <span lang="en">The team won its match</span>, দল একটা। <span lang="en">The players won their match</span>, খেলোয়াড় অনেক।</p>

${mount("pronouns-reveal")}

${mount("pronouns-build")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>pronoun-এর প্রশ্ন তিন চেহারায়। এক: খালি ঘরে ঠিক রূপ (<span lang="en">I/me, my/mine, its/it's</span>)। দুই: অনুচ্ছেদে বারবার আসা নামের জায়গায় pronoun বসানো, <span lang="en">rewrite using pronouns</span>। তিন: ভুল ধরা, <span lang="en">Me and Rafi</span> ধরনের। তিনটারই একই তিন প্রশ্ন।</p>

<ol class="step-list">
<li><strong>জায়গাটা ক্রিয়ার কোন পাশে?</strong> আগে হলে কর্তা-রূপ (<span lang="en">he, they</span>), পরে বা preposition-এর পরে হলে কর্ম-রূপ (<span lang="en">him, them</span>)।</li>
<li><strong>পরে একটা noun আছে?</strong> থাকলে <span lang="en">my, his, their</span>। না থাকলে, বাক্য শেষ, তাহলে <span lang="en">mine, his, theirs</span>।</li>
<li><strong>কর্তা আর কর্ম কি একই মানুষ?</strong> হলে <span lang="en">-self</span>।</li>
<li><strong>দুজন একসাথে?</strong> অন্যজনকে সরিয়ে পড়ে দেখো: <span lang="en">called me</span> হয়, <span lang="en">called I</span> হয় না।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Rafi and (I/me) ___ went to the field. The coach gave (we/us) ___ two bats: the new one is (my/mine) ___ and the old one is (his/him) ___. Rafi hurt (him/himself) ___ while batting.</span> ধাপে ধাপে: ক্রিয়ার আগে, তাই <span lang="en">I</span>; <span lang="en">gave</span>-এর পরে, তাই <span lang="en">us</span>; পরে noun নেই, তাই <span lang="en">mine</span>; একা দাঁড়িয়ে, <span lang="en">his</span>; নিজেকে, <span lang="en">himself</span>। পাঁচটা ঘর, চারটা প্রশ্ন।</div>

${mount("pronouns-spot")}

${mount("pronouns-exam")}

${mount("pronouns-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>শূন্যস্থানটা ক্রিয়ার আগে হলে কর্তা-রূপ (<span lang="en">he, she, they</span>), ক্রিয়ার পরে বা <span lang="en">to, with, for</span>-এর পরে হলে কর্ম-রূপ (<span lang="en">him, her, them</span>)। শূন্যস্থানের পরেই একটা noun থাকলে <span lang="en">my, his, their</span>। শূন্যস্থানের পর কিছু না থাকলে, বাক্য শেষ, তাহলে <span lang="en">mine, hers, theirs</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">between you and I</span> শুনতে ভদ্র লাগে, কিন্তু ভুল। <span lang="en">between</span> একটা preposition, তার পরে কর্ম-রূপ: <span lang="en">between you and me</span>। একই কথা <span lang="en">for Rafi and me, with Mitu and me</span>। ইংরেজরাও এই ভুল করে, কারণ ছোটবেলায় <span lang="en">Me and Rafi</span> বলে বকা খেয়ে তারা সব জায়গায় <span lang="en">I</span> বসাতে শুরু করে।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>পাঁচ কলামের ছকটা না দেখে <span lang="en">he</span> আর <span lang="en">they</span>-এর সারি বলতে পারি?</li>
<li><span lang="en">Rafi and I</span> কখন, <span lang="en">Rafi and me</span> কখন: কৌশলটা বলতে পারি?</li>
<li><span lang="en">It is raining</span>-এর <span lang="en">it</span> কার বদলি? (কারও না, চেয়ার ভরাট।)</li>
<li><span lang="en">this, that, these, those</span>: দুই প্রশ্নে ঠিকটা বাছতে পারি?</li>
<li><span lang="en">Everyone is</span> কেন, <span lang="en">Everyone are</span> নয়?</li>
</ul>
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
    "pronouns-grid": {
      kind: "grid",
      model: "en-pronouns",
      title: { bn: "ছকটা নিজে ভরো", en: "Fill the table yourself" },
      note: { bn: "প্রতিটা সারিতে তিনটা ঘর: কর্ম, নামের আগে, একা। লিখে তারপর মিলিয়ে দেখো।", en: "Three cells a row: object, before a noun, on its own. Type, then check." },
    },
    "pronouns-it": {
      kind: "gap",
      title: { bn: "কে সে: he, she, it, they", en: "Who is it: he, she, it, they" },
      note: { bn: "আগের noun-টা কে বা কী, সেটা দেখে বদলি বাছো।", en: "Look at the noun before, and pick its substitute." },
      items: [
        { text: "Mitu has an exam, so ___ is studying.", bn: "মিতুর পরীক্ষা, তাই সে পড়ছে।", options: ["he", "she", "it"], right: 1, why: { bn: "মিতু একজন মেয়ে: she।", en: "Mitu is a girl: she." } },
        { text: "The bat is new, but ___ is heavy.", bn: "ব্যাটটা নতুন, কিন্তু ওটা ভারী।", options: ["he", "it", "they"], right: 1, why: { bn: "একটা জিনিস: it।", en: "One thing: it." } },
        { text: "The players are tired because ___ ran a lot.", bn: "খেলোয়াড়রা ক্লান্ত, কারণ তারা অনেক দৌড়েছে।", options: ["he", "it", "they"], right: 2, why: { bn: "অনেকজন: they।", en: "Many people: they." } },
        { text: "Look outside! ___ is raining.", bn: "বাইরে দেখো! বৃষ্টি হচ্ছে।", options: ["It", "There", "This"], right: 0, why: { bn: "আবহাওয়ার বাক্যে কর্তার চেয়ার it ভরাট করে: It is raining।", en: "In a weather sentence, it fills the subject's chair: It is raining." } },
        { text: "___ is five o'clock; the match starts now.", bn: "পাঁচটা বাজে; ম্যাচ এখন শুরু।", options: ["It", "He", "They"], right: 0, why: { bn: "সময়ের বাক্যেও it: It is five o'clock।", en: "A time sentence takes it as well: It is five o'clock." } },
        { text: "Nanu and I made pitha, and ___ tasted great.", bn: "নানু আর আমি পিঠা বানালাম, আর সেগুলো দারুণ হলো।", options: ["it", "they", "we"], right: 1, why: { bn: "pitha অনেকগুলো, স্বাদ তাদের: they। we হলে আমরা নিজেরাই মজার হতাম।", en: "The pitha are many and they are what tasted great: they. We would mean we tasted great ourselves." } },
      ],
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
        { target: "You, Rafi and I are in the same team.", bn: "তুমি, রাফি আর আমি একই দলে।" },
      ],
    },
    "pronouns-order": {
      kind: "order",
      title: { bn: "ভদ্রতার ক্রম", en: "The polite order" },
      note: { bn: "তিনজনকে একসাথে বলতে হবে। ইংরেজির ভদ্রতার ক্রমে সাজাও: কে আগে, কে মাঝে, কে শেষে।", en: "Three people in one sentence. Put them in English's polite order: who comes first, who in the middle, who last." },
      items: [
        { text: { bn: "You (সামনের জন, দ্বিতীয় ব্যক্তি)", en: "You (the one in front, second person)" }, why: { bn: "যার সাথে কথা বলছ, সে সবার আগে।", en: "The person you are talking to comes first." } },
        { text: { bn: "Rafi (তৃতীয় ব্যক্তি)", en: "Rafi (third person)" }, why: { bn: "যার কথা বলছ, সে মাঝে।", en: "The person you are talking about comes in the middle." } },
        { text: { bn: "and I (নিজে, প্রথম ব্যক্তি)", en: "and I (yourself, first person)" }, why: { bn: "নিজেকে শেষে: You, Rafi and I। ভুল করে দুঃখ প্রকাশে উল্টো: I, Rafi and you are to blame।", en: "Yourself last: You, Rafi and I. Only when confessing a fault does it reverse: I, Rafi and you are to blame." } },
        { text: { bn: "are in the same team.", en: "are in the same team." }, why: { bn: "তিনজন মিলে অনেক, তাই are।", en: "Three together are many, so are." } },
      ],
    },
    "pronouns-match": {
      kind: "match",
      title: { bn: "কর্তা থেকে একা-রূপ", en: "From the subject to the standalone form" },
      note: { bn: "বাঁ দিকের কর্তার সাথে ডান দিকের 'কার, একা' রূপটা মেলাও।", en: "Match each subject on the left with its on-its-own form on the right." },
      pairs: [
        { left: { bn: "I", en: "I" }, right: { bn: "mine", en: "mine" } },
        { left: { bn: "she", en: "she" }, right: { bn: "hers", en: "hers" } },
        { left: { bn: "we", en: "we" }, right: { bn: "ours", en: "ours" } },
        { left: { bn: "they", en: "they" }, right: { bn: "theirs", en: "theirs" } },
        { left: { bn: "you", en: "you" }, right: { bn: "yours", en: "yours" } },
        { left: { bn: "he", en: "he" }, right: { bn: "his (দুই কাজই)", en: "his (both jobs)" } },
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
        { text: "Is Tamim a friend of ___?", bn: "তামিম কি তোমার বন্ধু?", options: ["you", "your", "yours"], right: 2, why: { bn: "a friend of + একা-রূপ: a friend of yours। a friend of you নয়।", en: "A friend of + the standalone form: a friend of yours. Not a friend of you." } },
        { text: "Keep this between you and ___.", bn: "এটা তোমার আর আমার মধ্যেই রেখো।", options: ["I", "me", "myself"], right: 1, why: { bn: "between একটা preposition, পরে কর্ম-রূপ: between you and me।", en: "Between is a preposition and takes the object form: between you and me." } },
      ],
    },
    "pronouns-point": {
      kind: "bins",
      title: { bn: "কাছে না দূরে, একটা না অনেক", en: "Near or far, one or many" },
      note: { bn: "প্রতিটা বাক্যের খালি জায়গায় কোন শব্দ বসবে, সেই ঘরে ফেলো।", en: "Drop each sentence into the box of the word that fills its gap." },
      bins: [
        { id: "this", label: { bn: "this", en: "this" } },
        { id: "that", label: { bn: "that", en: "that" } },
        { id: "these", label: { bn: "these", en: "these" } },
        { id: "those", label: { bn: "those", en: "those" } },
      ],
      items: [
        { text: { bn: "___ is my bat, here in my hand.", en: "___ is my bat, here in my hand." }, bin: "this", why: { bn: "হাতে, একটা: this।", en: "In the hand, one: this." } },
        { text: { bn: "Look at ___ birds on the far tree.", en: "Look at ___ birds on the far tree." }, bin: "those", why: { bn: "দূরে, অনেক: those।", en: "Far away, many: those." } },
        { text: { bn: "___ mangoes in my bag are for Nanu.", en: "___ mangoes in my bag are for Nanu." }, bin: "these", why: { bn: "আমার ব্যাগে, কাছে, অনেক: these।", en: "In my bag, near, many: these." } },
        { text: { bn: "Do you remember ___ day we won the final?", en: "Do you remember ___ day we won the final?" }, bin: "that", why: { bn: "আগের একটা দিন, দূরে: that day।", en: "A day in the past, far: that day." } },
        { text: { bn: "Hello, ___ is Rafi speaking.", en: "Hello, ___ is Rafi speaking." }, bin: "this", why: { bn: "ফোনে নিজেকে: This is Rafi।", en: "Introducing yourself on the phone: This is Rafi." } },
        { text: { bn: "Rafi is late again. ___ is not fair.", en: "Rafi is late again. ___ is not fair." }, bin: "that", why: { bn: "আগের পুরো কথাটার বদলি: That is not fair।", en: "Standing in for the whole previous sentence: That is not fair." } },
        { text: { bn: "Are ___ your shoes by the door?", en: "Are ___ your shoes by the door?" }, bin: "those", why: { bn: "দরজার কাছে, একটু দূরে, অনেক: those।", en: "By the door, a little away, many: those." } },
      ],
    },
    "pronouns-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: he কে?", en: "Guess first: who is he?" },
      ask: { bn: "Rafi told Tamim that he had been selected for the team. কে নির্বাচিত হলো?", en: "Rafi told Tamim that he had been selected for the team. Who was selected?" },
      choices: [
        { bn: "রাফি", en: "Rafi" },
        { bn: "তামিম", en: "Tamim" },
        { bn: "বাক্যটা বলে না", en: "The sentence does not say" },
      ],
      answer: { bn: "বাক্যটা বলে না। he দুজনের যে কারও বদলি হতে পারে।", en: "The sentence does not say. He could stand for either of them." },
      why: { bn: "একটা pronoun আগের কোনো noun-এর বদলি, আর এখানে আগে দুটো noun, দুজনই he হতে পারে। লেখক জানে, পাঠক জানে না। এর নাম অস্পষ্ট বদলি, আর রচনায় এটা নম্বর কাটে। সারাও: Rafi told Tamim, You have been selected. বা: Rafi, who had been selected, told Tamim the news.", en: "A pronoun replaces an earlier noun, and here two nouns come before it, either of which could be he. The writer knows, the reader does not. That is an unclear reference, and essays lose marks for it. Fix it: Rafi told Tamim, You have been selected. Or: Rafi, who had been selected, told Tamim the news." },
    },
    "pronouns-build": {
      kind: "build",
      title: { bn: "বদলি নিয়ে বাক্য সাজাও", en: "Build the sentence with its substitutes" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো কর্তা-রূপ ক্রিয়ার আগে গেল কি না, আর কর্ম-রূপ পরে।", en: "The words are shuffled. As you build, check that the subject form lands before the verb and the object form after." },
      pattern: "subject pronoun + verb + object pronoun",
      lines: [
        { target: "She gave him her old bat.", bn: "সে তাকে তার পুরনো ব্যাটটা দিল।" },
        { target: "They invited us to their house.", bn: "তারা আমাদের তাদের বাড়িতে ডাকল।" },
        { target: "We helped them and they thanked us.", bn: "আমরা তাদের সাহায্য করলাম আর তারা আমাদের ধন্যবাদ দিল।" },
        { target: "This bat is mine and that one is yours.", bn: "এই ব্যাটটা আমার আর ওটা তোমার।" },
        { target: "Rafi hurt himself while batting.", bn: "রাফি ব্যাট করতে গিয়ে নিজেকে ব্যথা দিল।" },
        { target: "It is raining, so nobody is outside.", bn: "বৃষ্টি হচ্ছে, তাই বাইরে কেউ নেই।" },
      ],
    },
    "pronouns-spot": {
      kind: "spot",
      title: { bn: "রাফির চিঠি, বদলির ভুল", en: "Rafi's letter: the substitute mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে pronoun-এর ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line with a pronoun mistake in it." },
      source: { bn: "চিঠি: বন্ধুকে ম্যাচের গল্প", en: "Letter: the match, to a friend" },
      lines: [
        { text: { bn: "Dear Tamim, last Friday was the best day of my life.", en: "Dear Tamim, last Friday was the best day of my life." } },
        { text: { bn: "Me and Mitu went to the stadium early.", en: "Me and Mitu went to the stadium early." }, flag: { bn: "কর্তা, ক্রিয়ার আগে, আর নিজেকে শেষে: Mitu and I went।", en: "The subject, before the verb, and yourself last: Mitu and I went." } },
        { text: { bn: "The coach gave us two tickets, and the seats were great.", en: "The coach gave us two tickets, and the seats were great." } },
        { text: { bn: "Between you and I, the first over was boring.", en: "Between you and I, the first over was boring." }, flag: { bn: "between-এর পরে কর্ম-রূপ: between you and me।", en: "After between, the object form: between you and me." } },
        { text: { bn: "Then Shakib hit a six, and the crowd went wild.", en: "Then Shakib hit a six, and the crowd went wild." } },
        { text: { bn: "A boy near us caught the ball and kept it for hisself.", en: "A boy near us caught the ball and kept it for hisself." }, flag: { bn: "hisself বলে কিছু নেই: himself।", en: "There is no hisself: himself." } },
        { text: { bn: "The team raised it's trophy at the end.", en: "The team raised it's trophy at the end." }, flag: { bn: "মালিকানা, অ্যাপস্ট্রফি ছাড়া: its trophy।", en: "Possession, no apostrophe: its trophy." } },
        { text: { bn: "I hope you and your family are well. Write to me soon.", en: "I hope you and your family are well. Write to me soon." } },
      ],
    },
    "pronouns-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Each student must bring ___ own bat. কোনটা?", en: "Each student must bring ___ own bat. Which?" },
          options: [
            { text: { bn: "their", en: "their" }, why: { bn: "না, পরীক্ষার খাতায় নয়। each student একজন, তাই একজনের রূপ। কথায় their চলে, খাতায় নয়।", en: "Not in the exam. Each student is one, so a singular form. Their passes in speech, not on paper." } },
            { text: { bn: "his or her", en: "his or her" }, right: true, why: { bn: "হ্যাঁ। each student একজন, ছেলে বা মেয়ে: his or her own bat।", en: "Yes. Each student is one person, boy or girl: his or her own bat." } },
            { text: { bn: "its", en: "its" }, why: { bn: "না। its জিনিসের জন্য। ছাত্র মানুষ।", en: "No. Its is for things. A student is a person." } },
          ],
        },
        {
          ask: { bn: "___ did you give the ticket to? পরীক্ষার খাতায় কোনটা?", en: "___ did you give the ticket to? Which, on the exam paper?" },
          options: [
            { text: { bn: "Who", en: "Who" }, why: { bn: "কথায় চলে, কিন্তু উত্তরে him বসে (I gave it to him), তাই খাতায় whom।", en: "Fine in speech, but the answer is him (I gave it to him), so on paper it is whom." } },
            { text: { bn: "Whom", en: "Whom" }, right: true, why: { bn: "হ্যাঁ। উত্তরটা him বা her: to him। him বসলে whom।", en: "Yes. The answer is him or her: to him. Where him fits, whom goes." } },
            { text: { bn: "Whose", en: "Whose" }, why: { bn: "না। whose মানে কার, মালিকানা। এখানে কাকে দিলে, কর্ম।", en: "No. Whose means belonging to whom. Here it is whom you gave to, the object." } },
          ],
        },
        {
          ask: { bn: "Rewrite using pronouns: Rafi gave Rafi's bat to Mitu because Mitu had lost Mitu's bat. সবচেয়ে ভালো?", en: "Rewrite using pronouns: Rafi gave Rafi's bat to Mitu because Mitu had lost Mitu's bat. The best version?" },
          options: [
            { text: { bn: "He gave his bat to her because she had lost hers.", en: "He gave his bat to her because she had lost hers." }, why: { bn: "প্রায়, কিন্তু শুরুতে নাম না থাকলে পাঠক জানে না he কে। প্রথম নামটা রাখতে হয়।", en: "Close, but with no name at the start the reader does not know who he is. Keep the first name." } },
            { text: { bn: "Rafi gave his bat to Mitu because she had lost hers.", en: "Rafi gave his bat to Mitu because she had lost hers." }, right: true, why: { bn: "হ্যাঁ। দুটো নাম একবার করে, তারপর his, she, hers। শেষে hers একা, কারণ পরে noun নেই।", en: "Yes. Each name once, then his, she, hers. Hers stands alone at the end because no noun follows." } },
            { text: { bn: "Rafi gave him bat to Mitu because her had lost her.", en: "Rafi gave him bat to Mitu because her had lost her." }, why: { bn: "না। bat-এর আগে his; কর্তা হিসেবে she; আর শেষে একা hers।", en: "No. Before bat it is his; as a subject it is she; and alone at the end it is hers." } },
          ],
        },
        {
          ask: { bn: "Nobody ___ the answer, so everybody ___ quiet. কোন জোড়া?", en: "Nobody ___ the answer, so everybody ___ quiet. Which pair?" },
          options: [
            { text: { bn: "know, are", en: "know, are" }, why: { bn: "না। nobody আর everybody দুটোই ব্যাকরণে একজন।", en: "No. Nobody and everybody both count as one in grammar." } },
            { text: { bn: "knows, is", en: "knows, is" }, right: true, why: { bn: "হ্যাঁ। দেখতে অনেক, ব্যাকরণে একজন: Nobody knows, everybody is।", en: "Yes. They look like many and count as one: Nobody knows, everybody is." } },
            { text: { bn: "knows, are", en: "knows, are" }, why: { bn: "না। everybody-ও একজনের রূপ নেয়: is।", en: "No. Everybody takes the singular too: is." } },
          ],
        },
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
        {
          ask: { bn: "Rafi and Mitu help ___ with homework. একে অন্যকে?", en: "Rafi and Mitu help ___ with homework. Each helps the other?" },
          options: [
            { text: { bn: "themselves", en: "themselves" }, why: { bn: "না। themselves মানে যে যার নিজেকে। একে অন্যকে হলে each other।", en: "No. Themselves means each their own self. Each helping the other is each other." } },
            { text: { bn: "each other", en: "each other" }, right: true, why: { bn: "হ্যাঁ। রাফি মিতুকে, মিতু রাফিকে: each other।", en: "Yes. Rafi helps Mitu and Mitu helps Rafi: each other." } },
            { text: { bn: "theirselves", en: "theirselves" }, why: { bn: "না। theirselves বলে কোনো শব্দ নেই।", en: "No. There is no such word as theirselves." } },
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
        { text: { bn: "জানালার বাইরে তাকিয়ে it দিয়ে পাঁচটা বাক্য: It is hot. It is Friday. It is three o'clock…", en: "Look out of the window and say five sentences with it: It is hot. It is Friday. It is three o'clock…" } },
        { text: { bn: "ঘরের চারটা জিনিস this/that/these/those দিয়ে দেখাও, একটা কাছে, একটা দূরে।", en: "Point at four things with this, that, these and those, some near, some far." } },
        { text: { bn: "ছকের he আর they-এর সারি না দেখে পাঁচটা রূপ বলো, তারপর she আর we।", en: "Say the five forms of the he row and the they row without looking, then she and we." } },
      ],
    },
  },
};
