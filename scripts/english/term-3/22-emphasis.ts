/* ============================================================
   22-emphasis.ts: পর্ব ২২, জোর দেওয়ার যন্ত্র (emphasis).

   One part of the grammar term, gathered into the rung by
   `advanced.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
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

<h2>inversion-এর মেশিন, ধাপে ধাপে</h2>

<p>পর্ব ১৩-র প্রশ্নের মেশিনটাই, শুধু সামনে একটা না-বাচক শব্দ। ধাপ: (১) না-বাচক শব্দটা সামনে নাও। (২) বাক্যে সাহায্যকারী আছে কি না দেখো: <span lang="en">have, had, will, can, is, was</span>। থাকলে সেটা কর্তার আগে। (৩) না থাকলে কালের মাপে <span lang="en">do / does / did</span> বসাও আর মূল ক্রিয়া খালি করো। (৪) বাকিটা যেমন ছিল। <span lang="en">She rarely complains</span>: সাহায্যকারী নেই, present, একজন, তাই <span lang="en">does</span>: <span lang="en">Rarely does she complain.</span> <span lang="en">complains</span>-এর <span lang="en">-s</span> টুপি <span lang="en">does</span> নিয়ে নিল, পর্ব ৬-এর এক টুপির নিয়ম।</p>

<div class="table-scroll">
<table>
<thead><tr><th>সাধারণ</th><th>সাহায্যকারী</th><th>উল্টানো</th></tr></thead>
<tbody>
<tr><td><span lang="en">I have never seen it.</span></td><td><span lang="en">have</span> আছে</td><td><span lang="en">Never have I seen it.</span></td></tr>
<tr><td><span lang="en">She rarely complains.</span></td><td>নেই, <span lang="en">does</span> আসে</td><td><span lang="en">Rarely does she complain.</span></td></tr>
<tr><td><span lang="en">He seldom visited us.</span></td><td>নেই, <span lang="en">did</span> আসে</td><td><span lang="en">Seldom did he visit us.</span></td></tr>
<tr><td><span lang="en">We had hardly sat down when…</span></td><td><span lang="en">had</span> আছে</td><td><span lang="en">Hardly had we sat down when…</span></td></tr>
<tr><td><span lang="en">You will not leave under any circumstances.</span></td><td><span lang="en">will</span> আছে</td><td><span lang="en">Under no circumstances will you leave.</span></td></tr>
<tr><td><span lang="en">He little knew that…</span></td><td>নেই, <span lang="en">did</span> আসে</td><td><span lang="en">Little did he know that…</span></td></tr>
</tbody>
</table>
</div>

${mount("emphasis-steps")}

${mount("emphasis-lines")}

<h2>ভেঙে আলো ফেলা: cleft sentence</h2>

<p>সাধারণ বাক্য: <span lang="en">Shakib took the catch in the final.</span> একটা তথ্য। কিন্তু তর্কে যদি কেউ বলে তামিম নিয়েছে, তখন: <span lang="en">It was Shakib who took the catch.</span> শাকিব-ই, অন্য কেউ নয়। বাক্যটা দুই ভাগে ভেঙে (<span lang="en">cleft</span> মানে ভাঙা) একটা ভাগে আলো। ছাঁচ: <strong><span lang="en">It + be + যার উপর আলো + who/that + বাকিটা</span></strong>। জায়গায় আলো: <span lang="en">It was in the final that Shakib took the catch.</span> সময়ে: <span lang="en">It was yesterday that I met him.</span></p>

<p>একটা বাক্য, চারটা আলো। <span lang="en">Rafi broke the window with a ball on Friday.</span> কে? <span lang="en">It was Rafi who broke the window.</span> কী? <span lang="en">It was the window that Rafi broke.</span> কী দিয়ে? <span lang="en">It was with a ball that Rafi broke the window.</span> কবে? <span lang="en">It was on Friday that Rafi broke the window.</span> একই ঘটনা, চার জায়গায় টর্চ। মানুষে <span lang="en">who</span> (বা <span lang="en">that</span>), বাকি সবকিছুতে <span lang="en">that</span>; <span lang="en">which</span> এখানে বসে না। আর <span lang="en">It was</span> সবসময় একবচন, আলোর নিচে বহুবচন থাকলেও: <span lang="en">It was the players who complained.</span></p>

<p><span lang="en">what</span>-cleft উল্টো দিক থেকে আলো ফেলে, যা চাই সেটার উপর: <span lang="en">What I need is a good night's sleep. What Rafi loves most is bowling.</span> আর <span lang="en">All</span> দিয়ে: <span lang="en">All I want is a cup of tea.</span> শুধু চা-ই চাই, আর কিছু না। <span lang="en">what</span>-cleft-এ ক্রিয়াও আলো পেতে পারে: <span lang="en">What he did was (to) call the police.</span> সে যা করল তা হলো পুলিশ ডাকা।</p>

${mount("emphasis-torch")}

<h2>এত… যে…: so আর such</h2>

<p>দুটোই "এত", কিন্তু <span lang="en">so</span> বসে adjective বা adverb-এর আগে, <span lang="en">such</span> বসে noun-এর আগে (adjective থাকলে তার সাথে)। <span lang="en">The bowler was so fast. He was such a fast bowler.</span> গোনা যায় এমন একবচন noun-এ <span lang="en">such a</span>, নইলে <span lang="en">such</span>: <span lang="en">such a match, such matches, such weather</span>। ফল বোঝাতে <span lang="en">that</span>: <span lang="en">He was so tired that he fell asleep on the bus. It was such a good film that we watched it twice.</span> পরীক্ষায় <span lang="en">so … that ↔ too … to</span> বদল আসে: <span lang="en">He was so tired that he could not walk. = He was too tired to walk.</span></p>

<p><span lang="en">so</span>-র আরও দুটো জায়গা যেখানে <span lang="en">such</span> বসে না: <span lang="en">so many / so few</span> গোনা যায় এমন বহুবচনে, <span lang="en">so much / so little</span> গোনা যায় না এমনটায়। <span lang="en">There were so many people that we could not sit. He has so much homework that he cannot play.</span> এখানে noun আছে, তবু <span lang="en">so</span>, কারণ <span lang="en">many/much</span> নিজেরাই মাত্রার শব্দ, পর্ব ২০-র determiner।</p>

<div class="table-scroll">
<table>
<thead><tr><th>পরে কী</th><th>শব্দ</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td>adjective / adverb একা</td><td><span lang="en">so</span></td><td><span lang="en">so fast, so quickly, so tired</span></td></tr>
<tr><td>একবচন গোনা-noun (adjective সহ বা ছাড়া)</td><td><span lang="en">such a / an</span></td><td><span lang="en">such a fast bowler, such an idea</span></td></tr>
<tr><td>বহুবচন বা গোনা যায় না এমন noun</td><td><span lang="en">such</span></td><td><span lang="en">such fast bowlers, such weather</span></td></tr>
<tr><td><span lang="en">many / few</span> + বহুবচন</td><td><span lang="en">so</span></td><td><span lang="en">so many runs, so few chances</span></td></tr>
<tr><td><span lang="en">much / little</span> + গোনা যায় না</td><td><span lang="en">so</span></td><td><span lang="en">so much noise, so little time</span></td></tr>
</tbody>
</table>
</div>

${mount("emphasis-sosuch")}

${mount("emphasis-gap")}

<h2>জোরের do</h2>

<p>সাধারণ হ্যাঁ-বাচক বাক্যে <span lang="en">do</span> লাগে না, তাই বসালে জোর হয়: <span lang="en">I like it</span> সাধারণ, <span lang="en">I do like it</span> সত্যিই পছন্দ করি, তুমি যা-ই ভাবো। <span lang="en">He did call you</span>: ফোন করেছিল, তুমি ধরোনি। <span lang="en">Do come to the party!</span> আদেশে জোর, আন্তরিক আমন্ত্রণ। কথায় <span lang="en">do</span>-তে জোর পড়ে।</p>

<p>জোরের <span lang="en">do</span>-তেও এক টুপির নিয়ম: <span lang="en">do/does/did</span> কাল আর কর্তার মাপ নিল, মূল ক্রিয়া খালি। <span lang="en">She does like him</span> (<span lang="en">likes</span> নয়), <span lang="en">He did call</span> (<span lang="en">called</span> নয়)। সাহায্যকারী আগে থেকে থাকলে <span lang="en">do</span> লাগে না, শুধু সাহায্যকারীটায় গলার জোর: <span lang="en">I HAVE finished. She IS coming.</span> লেখায় সেটা বোঝাতে অনেকে <span lang="en">really</span> বা <span lang="en">indeed</span> বসায়।</p>

${mount("emphasis-devices")}

<div class="ex"><b>Yoda-র প্রায় সব কথা inversion:</b> <span lang="en">Powerful you have become.</span> সাধারণ ইংরেজিতে <span lang="en">You have become powerful</span>, কিন্তু Yoda জোর দেয় <span lang="en">powerful</span>-এ। Titanic: <span lang="en">It was Rose who let go.</span> cleft। আর Kung Fu Panda-র Shifu: <span lang="en">There is no such thing as an accident.</span> <span lang="en">such</span> + noun। এগুলো চিনলে সিনেমার সংলাপ নতুন করে শোনা যায়।</div>

${mount("emphasis-reveal")}

${mount("emphasis-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Transformation</span>-এ <span lang="en">Not only</span> বা <span lang="en">No sooner</span> দিয়ে বাক্য শুরু করতে বললে দ্বিতীয় শব্দটা সাহায্যকারী, তৃতীয়টা কর্তা: <span lang="en">Not only did he…</span> <span lang="en">No sooner had she…</span> <span lang="en">so … that</span> থেকে <span lang="en">too … to</span>: <span lang="en">that</span>-এর পরের <span lang="en">not</span> যায়, ক্রিয়া <span lang="en">to</span> নেয়। <span lang="en">such … that</span> থেকে <span lang="en">so … that</span>: noun সরিয়ে adjective রাখো: <span lang="en">such a fast bowler that → so fast a bowler that</span>, বা সহজে <span lang="en">The bowler was so fast that</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>inversion শুধু তখনই যখন না-বাচক শব্দটা বাক্যের <em>শুরুতে</em>। <span lang="en">I have never seen</span> সাধারণ ক্রম, ঠিক। <span lang="en">Never I have seen</span> ভুল: শুরুতে নিলে উল্টাতেই হবে, <span lang="en">Never have I seen</span>। অর্ধেক উল্টানো সবচেয়ে খারাপ। আর <span lang="en">so such a</span> বলে কিছু নেই: হয় <span lang="en">so fast</span>, নয় <span lang="en">such a fast</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p><span lang="en">No sooner</span>-এর জোড়া <span lang="en">than</span>, <span lang="en">Hardly</span> আর <span lang="en">Scarcely</span>-র জোড়া <span lang="en">when</span>। জোড়া মেলালে পুরো নম্বর যায়: <span lang="en">No sooner had he left when…</span> ভুল, <span lang="en">No sooner had he left than…</span> ঠিক। মনে রাখার কৌশল: <span lang="en">sooner</span> একটা তুলনা (<span lang="en">-er</span>), আর তুলনার জোড়া সবসময় <span lang="en">than</span>, পর্ব ৫। <span lang="en">hardly</span> তুলনা নয়, তাই সময়ের শব্দ <span lang="en">when</span>।</p>
</div>

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<ol class="step-list">
<li><strong>Transformation, "Begin with Not only / No sooner / Hardly":</strong> শব্দটা সামনে, তারপর সাহায্যকারী, তারপর কর্তা। <span lang="en">No sooner</span> হলে <span lang="en">had + V3 … than</span>; <span lang="en">Hardly</span> হলে <span lang="en">had + V3 … when</span>।</li>
<li><strong>Transformation, "Make it emphatic" বা "Begin with It":</strong> cleft। আলো কার উপর, প্রশ্নটা বলে দেয়; না বললে কর্তার উপর। <span lang="en">It was + কর্তা + who + বাকি</span>।</li>
<li><strong>so … that ↔ too … to:</strong> <span lang="en">that</span>-এর ঘরে <span lang="en">not</span> থাকলেই <span lang="en">too … to</span> হয়। <span lang="en">not</span> না থাকলে (<span lang="en">so tired that he slept</span>) <span lang="en">too</span> হয় না; হয় <span lang="en">enough to</span> নয়, হয় না-ই।</li>
<li><strong>such … that ↔ so … that:</strong> <span lang="en">such a fast bowler that → so fast a bowler that</span>। noun-টা adjective-এর পিছনে যায়, <span lang="en">a</span> মাঝখানে।</li>
<li><strong>Error correction:</strong> খুঁজবে <span lang="en">Never I have</span>, <span lang="en">Not only he scored</span>, <span lang="en">No sooner … when</span>, <span lang="en">so such</span>, <span lang="en">such fast</span> (একবচনে <span lang="en">a</span> নেই), <span lang="en">Seldom does she visits</span>।</li>
</ol>

<div class="ex"><b>একটা নমুনা:</b> প্রশ্ন: <span lang="en">Transform: The boy was so weak that he could not stand. (a) Begin with 'too'. (b) Begin with 'Such'.</span> (a) <span lang="en">that</span>-এর ঘরে <span lang="en">not</span> আছে, তাই <span lang="en">too</span>: <span lang="en">The boy was too weak to stand.</span> (b) <span lang="en">Such</span> শুরুতে হলে সেটাও inversion: <span lang="en">Such was the boy's weakness that he could not stand.</span> adjective-টা noun হয়ে গেল (<span lang="en">weak → weakness</span>), আর <span lang="en">was</span> কর্তার আগে। এই দ্বিতীয়টা কম আসে, কিন্তু এলে অনেকে ছেড়ে দেয়; তুমি দেবে না।</div>

${mount("emphasis-build")}

${mount("emphasis-spot")}

${mount("emphasis-exam")}

<div class="checklist">
<p>পর্ব শেষে নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>inversion-এর মেশিনের চার ধাপ মনে আছে (শব্দ সামনে, সাহায্যকারী খোঁজো, নেই তো do, বাকিটা একই)?</li>
<li><span lang="en">No sooner … than</span> আর <span lang="en">Hardly … when</span>, জোড়া মেলাতে পারি?</li>
<li>একটা বাক্যে চার জায়গায় টর্চ ফেলতে পারি, <span lang="en">It was … who / that</span> দিয়ে?</li>
<li><span lang="en">so</span> আর <span lang="en">such (a)</span>, পাঁচ ঘরের টেবিলটা মাথায় আছে?</li>
<li><span lang="en">so … that … not</span> থেকে <span lang="en">too … to</span>, আর <span lang="en">not</span> না থাকলে কী হয়, জানি?</li>
<li>জোরের <span lang="en">do</span>-তেও এক টুপির নিয়ম, মনে আছে?</li>
</ul>
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
    "emphasis-steps": {
      kind: "order",
      title: { bn: "inversion-এর মেশিন", en: "The inversion machine" },
      note: { bn: "She rarely complains থেকে Rarely does she complain: ধাপগুলো ক্রমে সাজাও।", en: "From She rarely complains to Rarely does she complain: put the steps in order." },
      items: [
        { text: { bn: "না-বাচক শব্দটা (rarely) বাক্যের সামনে নাও", en: "Move the negative word (rarely) to the front" } },
        { text: { bn: "সাহায্যকারী খোঁজো: have, will, can, is… নেই", en: "Look for a helper: have, will, can, is… there is none" } },
        { text: { bn: "নেই, তাই কালের মাপে does বসাও, কর্তার আগে", en: "None, so put in does for the tense, before the subject" } },
        { text: { bn: "মূল ক্রিয়া খালি করো: complains → complain", en: "Strip the main verb bare: complains to complain" } },
        { text: { bn: "বাকিটা যেমন ছিল: Rarely does she complain.", en: "The rest stays as it was: Rarely does she complain." }, why: { bn: "পর্ব ১৩-র প্রশ্নের মেশিনই, সামনে শুধু একটা না-বাচক শব্দ। সাহায্যকারী থাকলে তৃতীয় আর চতুর্থ ধাপ লাগে না: Never have I seen।", en: "It is the question machine from part 13 with a negative word in front. With a helper already there, steps three and four fall away: Never have I seen." } },
      ],
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
    "emphasis-torch": {
      kind: "match",
      title: { bn: "একটা বাক্য, চার জায়গায় টর্চ", en: "One sentence, four places for the torch" },
      note: { bn: "Rafi broke the window with a ball on Friday. প্রশ্নটার সাথে যে cleft উত্তর দেয়, সেটা মেলাও।", en: "Rafi broke the window with a ball on Friday. Match each question to the cleft that answers it." },
      pairs: [
        { left: { bn: "কে ভাঙল?", en: "Who broke it?" }, right: { bn: "It was Rafi who broke the window.", en: "It was Rafi who broke the window." } },
        { left: { bn: "কী ভাঙল?", en: "What got broken?" }, right: { bn: "It was the window that Rafi broke.", en: "It was the window that Rafi broke." } },
        { left: { bn: "কী দিয়ে?", en: "With what?" }, right: { bn: "It was with a ball that Rafi broke the window.", en: "It was with a ball that Rafi broke the window." } },
        { left: { bn: "কবে?", en: "When?" }, right: { bn: "It was on Friday that Rafi broke the window.", en: "It was on Friday that Rafi broke the window." } },
        { left: { bn: "রাফি কী করল?", en: "What did Rafi do?" }, right: { bn: "What Rafi did was break the window.", en: "What Rafi did was break the window." } },
      ],
    },
    "emphasis-sosuch": {
      kind: "bins",
      title: { bn: "so, such, নাকি such a", en: "So, such, or such a" },
      note: { bn: "প্রতিটা শব্দগুচ্ছের সামনে কোনটা বসে?", en: "Which one goes in front of each phrase?" },
      bins: [
        { id: "so", label: { bn: "so", en: "so" } },
        { id: "sucha", label: { bn: "such a / an", en: "such a / an" } },
        { id: "such", label: { bn: "such", en: "such" } },
      ],
      items: [
        { text: { bn: "… fast", en: "… fast" }, bin: "so", why: { bn: "adjective একা: so fast।", en: "A bare adjective: so fast." } },
        { text: { bn: "… quickly", en: "… quickly" }, bin: "so", why: { bn: "adverb: so quickly।", en: "An adverb: so quickly." } },
        { text: { bn: "… many runs", en: "… many runs" }, bin: "so", why: { bn: "many + বহুবচন: so many।", en: "Many + plural: so many." } },
        { text: { bn: "… much noise", en: "… much noise" }, bin: "so", why: { bn: "much + গোনা যায় না: so much।", en: "Much + uncountable: so much." } },
        { text: { bn: "… fast bowler", en: "… fast bowler" }, bin: "sucha", why: { bn: "একবচন গোনা-noun: such a fast bowler।", en: "A singular countable noun: such a fast bowler." } },
        { text: { bn: "… idea", en: "… idea" }, bin: "sucha", why: { bn: "একবচন, স্বরধ্বনি: such an idea।", en: "Singular, vowel sound: such an idea." } },
        { text: { bn: "… fast bowlers", en: "… fast bowlers" }, bin: "such", why: { bn: "বহুবচন: such fast bowlers, a নেই।", en: "Plural: such fast bowlers, no a." } },
        { text: { bn: "… bad weather", en: "… bad weather" }, bin: "such", why: { bn: "গোনা যায় না: such bad weather।", en: "Uncountable: such bad weather." } },
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
    "emphasis-devices": {
      kind: "compare",
      title: { bn: "চার যন্ত্র পাশাপাশি", en: "The four devices side by side" },
      note: { bn: "একই সাধারণ বাক্য, চার রকম জোর। যন্ত্র বাছাইয়ের প্রশ্ন একটাই: কোন শব্দটাকে কেউ অস্বীকার করছে? আলো সেখানে।", en: "The same plain sentence, four kinds of emphasis. Choosing the device comes down to one question: which word is somebody denying? The light goes there." },
      columns: [{ bn: "সাধারণ", en: "plain" }, { bn: "জোর দিয়ে", en: "emphatic" }, { bn: "আলো কোথায়", en: "where the light falls" }],
      rows: [
        { label: { bn: "inversion", en: "inversion" }, cells: [{ bn: "Rafi has never missed practice.", en: "Rafi has never missed practice." }, { bn: "Never has Rafi missed practice.", en: "Never has Rafi missed practice." }, { bn: "never-এর উপর: কখনোই না", en: "on never: not once" }] },
        { label: { bn: "it-cleft", en: "it-cleft" }, cells: [{ bn: "Rafi scored the winning run.", en: "Rafi scored the winning run." }, { bn: "It was Rafi who scored the winning run.", en: "It was Rafi who scored the winning run." }, { bn: "Rafi-র উপর: অন্য কেউ নয়", en: "on Rafi: nobody else" }] },
        { label: { bn: "what-cleft", en: "what-cleft" }, cells: [{ bn: "Rafi wants a new bat.", en: "Rafi wants a new bat." }, { bn: "What Rafi wants is a new bat.", en: "What Rafi wants is a new bat." }, { bn: "a new bat-এর উপর: অন্য কিছু নয়", en: "on a new bat: nothing else" }] },
        { label: { bn: "জোরের do", en: "emphatic do" }, cells: [{ bn: "Rafi practises every day.", en: "Rafi practises every day." }, { bn: "Rafi does practise every day.", en: "Rafi does practise every day." }, { bn: "ক্রিয়ার সত্যতার উপর: তুমি যা-ই ভাবো", en: "on the truth of the verb: whatever you think" }] },
      ],
    },
    "emphasis-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: Only when", en: "Guess first: Only when" },
      ask: { bn: "The rain stopped and then we went out. বাক্যটা Only when দিয়ে শুরু করলে কোথায় উল্টাবে?", en: "The rain stopped and then we went out. Begin it with Only when: where does the inversion land?" },
      choices: [
        { bn: "Only when the rain stopped did we go out.", en: "Only when the rain stopped did we go out." },
        { bn: "Only when did the rain stop we went out.", en: "Only when did the rain stop we went out." },
        { bn: "Only when the rain stopped we went out.", en: "Only when the rain stopped we went out." },
      ],
      answer: { bn: "Only when the rain stopped did we go out.", en: "Only when the rain stopped did we go out." },
      why: { bn: "Only when, Only after, Not until: এদের পরে একটা পুরো অংশ থাকে (the rain stopped), আর সেটা যেমন ছিল তেমনই থাকে। উল্টানোটা হয় মূল বাক্যে, তার পরে: did we go out। অনেকে ভুল করে Only when-এর ঠিক পরেই উল্টায়, কিন্তু সেখানে প্রশ্ন নেই, শর্ত আছে। কৌশল: কমা কোথায় পড়ত, তার পরের অংশে উল্টাও।", en: "Only when, Only after, Not until: each is followed by a whole chunk (the rain stopped) that stays exactly as it was. The inversion happens in the main clause after it: did we go out. Many invert right after Only when, but that part is a condition, not a question. The trick: invert whatever comes after where the comma would fall." },
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
        {
          ask: { bn: "No sooner had we reached the ground ___ it started to rain. শূন্যস্থানে?", en: "No sooner had we reached the ground ___ it started to rain. In the gap?" },
          options: [
            { text: { bn: "when", en: "when" }, why: { bn: "না। when-এর জোড়া Hardly আর Scarcely। sooner একটা তুলনা, তুলনার জোড়া than।", en: "No. When pairs with Hardly and Scarcely. Sooner is a comparative, and comparatives pair with than." } },
            { text: { bn: "than", en: "than" }, right: true, why: { bn: "হ্যাঁ। No sooner … than।", en: "Yes. No sooner … than." } },
            { text: { bn: "that", en: "that" }, why: { bn: "না। that-এর জোড়া so আর such, এখানে নয়।", en: "No. That pairs with so and such, not here." } },
          ],
        },
      ],
    },
    "emphasis-build": {
      kind: "build",
      title: { bn: "শব্দ সাজাও: উল্টানো আর ভাঙা", en: "Build it: inverted and cleft" },
      note: { bn: "প্রতিটা বাক্যে একটা জোরের যন্ত্র। সাহায্যকারী কর্তার আগে বসছে কি না, দেখো।", en: "One emphasis device per sentence. Check whether the helper lands before the subject." },
      pattern: "Never / Not only / No sooner + helper + subject …  ·  It was X who …  ·  What I need is …",
      lines: [
        { target: "Never have I seen such a catch.", bn: "এমন ক্যাচ আমি কখনো দেখিনি।" },
        { target: "Not only did he bat but he also bowled.", bn: "সে শুধু ব্যাটই করেনি, বলও করেছে।" },
        { target: "It was Nanu who told the story.", bn: "নানু-ই গল্পটা বলেছিলেন।" },
        { target: "What I need is a cup of tea.", bn: "আমার যা দরকার তা এক কাপ চা।" },
        { target: "No sooner had we sat than it rained.", bn: "আমরা বসতে না বসতেই বৃষ্টি।" },
        { target: "Rarely does she complain about anything.", bn: "সে খুব কমই কিছু নিয়ে অভিযোগ করে।" },
      ],
    },
    "emphasis-spot": {
      kind: "spot",
      title: { bn: "ধারাভাষ্যের খসড়া", en: "The commentary draft" },
      note: { bn: "রাফি স্কুল ম্যাগাজিনের জন্য ধারাভাষ্য লিখেছে, জোর দিতে গিয়ে কয়েক জায়গায় গড়বড়। যে লাইনে ভুল, সেটা ছোঁও।", en: "Rafi wrote match commentary for the school magazine and tripped in a few places while adding emphasis. Tap every line with a mistake." },
      source: { bn: "স্কুল ম্যাগাজিন, ফাইনালের রিপোর্ট", en: "School magazine, the final's report" },
      lines: [
        { text: { bn: "Never I have seen a final like this one.", en: "Never I have seen a final like this one." }, flag: { bn: "শুরুতে Never, উল্টাতেই হবে: Never have I seen।", en: "Never up front means you must invert: Never have I seen." } },
        { text: { bn: "It was Mitu who scored the first fifty.", en: "It was Mitu who scored the first fifty." } },
        { text: { bn: "Not only she batted well, but she also kept wicket.", en: "Not only she batted well, but she also kept wicket." }, flag: { bn: "Not only-র পরে সাহায্যকারী: Not only did she bat well।", en: "After Not only comes the helper: Not only did she bat well." } },
        { text: { bn: "The crowd was so loud that we could not hear the umpire.", en: "The crowd was so loud that we could not hear the umpire." } },
        { text: { bn: "No sooner had the last over begun when the lights failed.", en: "No sooner had the last over begun when the lights failed." }, flag: { bn: "No sooner-এর জোড়া than, when নয়।", en: "No sooner pairs with than, not when." } },
        { text: { bn: "It was such exciting match that nobody went home.", en: "It was such exciting match that nobody went home." }, flag: { bn: "একবচন গোনা-noun: such an exciting match।", en: "A singular countable noun: such an exciting match." } },
        { text: { bn: "What we will remember most is the last ball.", en: "What we will remember most is the last ball." } },
        { text: { bn: "Seldom does a school final ends like this.", en: "Seldom does a school final ends like this." }, flag: { bn: "এক টুপি: does এসেছে, তাই end খালি।", en: "One hat: does has arrived, so end goes bare." } },
      ],
    },
    "emphasis-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "তিনটা transformation, যেমন প্রশ্নপত্রে আসে। মানে ধরে রেখে ছাঁচ বদলাও।", en: "Three transformations as the paper sets them. Change the pattern and keep the meaning." },
      questions: [
        {
          ask: { bn: "The bowler was so fast that nobody could face him. Begin with 'Such'.", en: "The bowler was so fast that nobody could face him. Begin with 'Such'." },
          options: [
            { text: { bn: "Such was the bowler's speed that nobody could face him.", en: "Such was the bowler's speed that nobody could face him." }, right: true, why: { bn: "হ্যাঁ। Such শুরুতে হলে inversion (was আগে) আর adjective noun হয়: fast → speed।", en: "Yes. Such up front inverts (was first) and the adjective becomes a noun: fast to speed." } },
            { text: { bn: "Such a fast bowler that nobody could face him.", en: "Such a fast bowler that nobody could face him." }, why: { bn: "না। মূল ক্রিয়া হারিয়ে গেছে; এটা বাক্যই নয়। He was such a fast bowler that… হলে ঠিক, কিন্তু সেটা Such দিয়ে শুরু নয়।", en: "No. The main verb has gone; this is not a sentence. He was such a fast bowler that… would be fine, but it does not begin with Such." } },
            { text: { bn: "Such the bowler was fast that nobody could face him.", en: "Such the bowler was fast that nobody could face him." }, why: { bn: "না। Such-এর পরে সাহায্যকারী, তারপর কর্তা, আর adjective নয়, noun।", en: "No. After Such comes the helper, then the subject, and a noun rather than an adjective." } },
          ],
        },
        {
          ask: { bn: "The tea was so hot that I could not drink it. 'too' দিয়ে?", en: "The tea was so hot that I could not drink it. With 'too'?" },
          options: [
            { text: { bn: "The tea was too hot to drink.", en: "The tea was too hot to drink." }, right: true, why: { bn: "হ্যাঁ। not যায়, to আসে। শেষের it-ও যায়, কারণ চা-ই কর্তা আর কর্ম দুটোই। (to drink it লিখলে অনেক পরীক্ষক কাটেন।)", en: "Yes. The not goes, to arrives. The final it goes too, because the tea is both subject and object. (Many examiners mark down to drink it.)" } },
            { text: { bn: "The tea was too hot that I could not drink it.", en: "The tea was too hot that I could not drink it." }, why: { bn: "না। too আর that একসাথে কখনো নয়।", en: "No. Too and that never sit together." } },
            { text: { bn: "The tea was hot enough to drink.", en: "The tea was hot enough to drink." }, why: { bn: "না। enough উল্টো মানে: খাওয়ার মতো যথেষ্ট গরম। মূল বাক্যে খাওয়া যায়নি।", en: "No. Enough flips the meaning: hot enough to drink. In the original it could not be drunk." } },
          ],
        },
        {
          ask: { bn: "He had hardly entered the room when the phone rang. Begin with 'Hardly'.", en: "He had hardly entered the room when the phone rang. Begin with 'Hardly'." },
          options: [
            { text: { bn: "Hardly had he entered the room when the phone rang.", en: "Hardly had he entered the room when the phone rang." }, right: true, why: { bn: "হ্যাঁ। Hardly + had + কর্তা + V3 … when। জোড়া when-ই থাকে।", en: "Yes. Hardly + had + subject + V3 … when. The partner stays when." } },
            { text: { bn: "Hardly he had entered the room when the phone rang.", en: "Hardly he had entered the room when the phone rang." }, why: { bn: "না। অর্ধেক উল্টানো: Hardly শুরুতে নিলে had কর্তার আগে।", en: "No. Half-inverted: with Hardly first, had goes before the subject." } },
            { text: { bn: "Hardly had he entered the room than the phone rang.", en: "Hardly had he entered the room than the phone rang." }, why: { bn: "না। than-এর জোড়া No sooner; Hardly-র জোড়া when।", en: "No. Than pairs with No sooner; Hardly pairs with when." } },
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
        { text: { bn: "একটা বাক্য নাও (Rafi broke the window with a ball on Friday) আর চার জায়গায় টর্চ ফেলো, চারটা cleft।", en: "Take one sentence (Rafi broke the window with a ball on Friday) and shine the torch in four places, four clefts." } },
        { text: { bn: "খেলা: একজন সাধারণ বাক্য বলবে (She rarely calls), অন্যজন সাথে সাথে উল্টাবে (Rarely does she call)। পাঁচটা, তারপর পালা বদল।", en: "A game: one says a plain sentence (She rarely calls), the other inverts it at once (Rarely does she call). Five, then swap." } },
        { text: { bn: "তিনটা so … that … not বাক্য লেখো, প্রতিটাকে too … to বানাও, তারপর একটাকে Such দিয়ে শুরু করো।", en: "Write three so … that … not sentences, turn each into too … to, then begin one with Such." } },
      ],
    },
  },
};
