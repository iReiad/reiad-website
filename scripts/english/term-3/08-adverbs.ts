/* ============================================================
   08-adverbs.ts: পর্ব ৮, কীভাবে, কখন, কোথায়: adverb.

   One part of the grammar term, gathered into the rung by
   `basic.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>ধারাভাষ্যকার বললেন, <span lang="en">Mustafiz bowls fast.</span> রাফি ভাবল, <span lang="en">fast</span> তো adjective, আগের পর্বে শিখেছি। কিন্তু এখানে <span lang="en">fast</span> মুস্তাফিজকে বর্ণনা করছে না, তার বোলিং করাটাকে করছে। কী করে বল করে? দ্রুত। কাজকে যে শব্দ রং দেয়, তার নাম <span lang="en">adverb</span>। adjective নামের রং, adverb কাজের রং।</p>

<p>adverb চারটা প্রশ্নের উত্তর দেয়: কীভাবে (<span lang="en">quickly</span>), কখন (<span lang="en">yesterday</span>), কোথায় (<span lang="en">here</span>), কত ঘন ঘন (<span lang="en">always</span>)। আর পঞ্চম একটা কাজ: অন্য কোনো শব্দকে কতটা জোর দেওয়া (<span lang="en">very, really, too</span>)। এই পর্বে পাঁচ জাত, তিনটা বসার জায়গা, <span lang="en">-ly</span>-র বানান, যারা <span lang="en">-ly</span> নেয় না, <span lang="en">still, yet, already</span>-র ত্রিভুজ, adverb-এর তুলনা, আর যে ফাঁদগুলো পরীক্ষায় প্রতি বছর।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>বেশিরভাগ adverb বানানো হয় adjective + <span lang="en">-ly</span>: <span lang="en">quick, quickly; careful, carefully; happy, happily</span>।</li>
<li>কয়েকটা adjective আর adverb একই: <span lang="en">fast, hard, late, early, high</span>। কোনো <span lang="en">-ly</span> নয়।</li>
<li><span lang="en">good</span>-এর adverb <span lang="en">well</span>: <span lang="en">She sings well</span>, <span lang="en">goodly</span> নয়।</li>
<li>কত ঘন ঘন (<span lang="en">always, usually, often, sometimes, never</span>) বসে ক্রিয়ার <em>আগে</em>, কিন্তু <span lang="en">be</span>-র <em>পরে</em>।</li>
<li>কীভাবে, কোথায়, কখন: এই ক্রমে, বাক্যের শেষে। <span lang="en">He played well at home yesterday.</span></li>
<li><span lang="en">feel, look, smell, taste, sound</span>-এর পরে adjective, adverb নয়।</li>
</ul>
</div>

${mount("adverbs-pattern")}

<h2>পাঁচ জাতের adverb</h2>

<div class="table-scroll">
<table>
<thead><tr><th>জাত</th><th>প্রশ্ন</th><th>উদাহরণ</th><th>সাধারণত কোথায়</th></tr></thead>
<tbody>
<tr><td>ধরন (<span lang="en">manner</span>)</td><td>কীভাবে</td><td><span lang="en">slowly, well, hard, carefully</span></td><td>ক্রিয়ার পরে</td></tr>
<tr><td>সময় (<span lang="en">time</span>)</td><td>কখন</td><td><span lang="en">yesterday, now, soon, today, still, yet</span></td><td>শেষে বা শুরুতে</td></tr>
<tr><td>জায়গা (<span lang="en">place</span>)</td><td>কোথায়</td><td><span lang="en">here, there, outside, upstairs, everywhere</span></td><td>ক্রিয়ার পরে</td></tr>
<tr><td>ঘন ঘন (<span lang="en">frequency</span>)</td><td>কতবার</td><td><span lang="en">always, usually, often, sometimes, rarely, never</span></td><td>ক্রিয়ার আগে, <span lang="en">be</span>-র পরে</td></tr>
<tr><td>মাত্রা (<span lang="en">degree</span>)</td><td>কতটা</td><td><span lang="en">very, really, too, quite, almost, enough</span></td><td>যাকে বাড়ায় তার আগে (<span lang="en">enough</span> পরে)</td></tr>
</tbody>
</table>
</div>

<p>জাত চেনা দরকার একটা কারণে: জাত বলে দেয় শব্দটা কোথায় বসবে। ধরনের adverb ক্রিয়ার পরে, ঘন ঘন-র adverb ক্রিয়ার আগে, মাত্রার adverb adjective-এর আগে। জাত ভুল হলে জায়গা ভুল হয়, আর জায়গা ভুল হলে বাক্যটা বিদেশির মতো শোনায়।</p>

${mount("adverbs-kinds")}

<h2>-ly লাগানোর তিনটা বানান</h2>

<p>সাধারণত শুধু <span lang="en">-ly</span>: <span lang="en">slow, slowly; quiet, quietly; brave, bravely</span>। শেষে <span lang="en">-y</span> থাকলে <span lang="en">-ily</span>: <span lang="en">happy, happily; easy, easily; angry, angrily</span>। শেষে <span lang="en">-le</span> থাকলে <span lang="en">e</span> গিয়ে <span lang="en">-ly</span>: <span lang="en">gentle, gently; simple, simply; terrible, terribly</span>। আর <span lang="en">-ic</span> দিয়ে শেষ হলে <span lang="en">-ically</span>: <span lang="en">basic, basically; automatic, automatically</span>।</p>

<p>দুটো বানান যেগুলো সবাই ভুল করে: <span lang="en">full</span> থেকে <span lang="en">fully</span> (তিনটা l নয়), আর <span lang="en">true</span> থেকে <span lang="en">truly</span> (e বাদ)। আর <span lang="en">careful</span> থেকে <span lang="en">carefully</span>: দুটো l, কারণ <span lang="en">careful</span>-এর l আর <span lang="en">-ly</span>-র l, দুটোই থাকে।</p>

<h2>যারা -ly নেয় না</h2>

<p>এই কয়েকটা শব্দ দুই দলেই খেলে, একই জার্সিতে। <span lang="en">a fast car</span> (adjective) আর <span lang="en">he drives fast</span> (adverb)। <span lang="en">a hard question</span> আর <span lang="en">she works hard</span>। <span lang="en">a late train</span> আর <span lang="en">he came late</span>। <span lang="en">an early bus</span> আর <span lang="en">we left early</span>। এদের <span lang="en">-ly</span> লাগালে হয় ভুল, নয় অন্য মানে: <span lang="en">hardly</span> মানে "প্রায় না", <span lang="en">lately</span> মানে "ইদানীং"। <span lang="en">She hardly works</span> মানে সে প্রায় কাজই করে না। উল্টো মানে!</p>

<p>আর <span lang="en">good</span>-এর adverb হলো <span lang="en">well</span>। <span lang="en">Shakib is a good player. Shakib plays well.</span> <span lang="en">He plays good</span> বাংলাভাষীর প্রিয় ভুল, আর মার্কিন সিনেমার চরিত্ররা এটা বলে বলেই মনে হয় ঠিক। পরীক্ষায় ঠিক নয়।</p>

<p>উল্টো দিকে কয়েকটা শব্দ <span lang="en">-ly</span> দিয়ে শেষ হলেও adjective, কারণ এরা noun থেকে বানানো: <span lang="en">friendly, lovely, lonely, lively, daily, weekly, silly, elderly</span>। <span lang="en">a friendly dog, a daily paper</span>। এদের adverb বানাতে ঘুরিয়ে বলতে হয়: <span lang="en">in a friendly way</span>।</p>

${mount("adverbs-match")}

${mount("adverbs-lines")}

${mount("adverbs-reveal")}

<h2>কত ঘন ঘন: always থেকে never</h2>

<p>একটা সিঁড়ি: <span lang="en">always</span> (১০০%), <span lang="en">usually</span> (৯০%), <span lang="en">often</span> (৭০%), <span lang="en">sometimes</span> (৫০%), <span lang="en">rarely</span> (১০%), <span lang="en">never</span> (০%)। এদের জায়গা একটাই নিয়মে বাঁধা: <strong>সাধারণ ক্রিয়ার আগে, <span lang="en">be</span>-র পরে।</strong> <span lang="en">Rafi always plays on Fridays.</span> <span lang="en">Rafi is always late.</span> <span lang="en">Nanu never forgets a story.</span> <span lang="en">Mitu is never late.</span> সাহায্যকারী থাকলে তার পরে, মূল ক্রিয়ার আগে: <span lang="en">I have never seen snow. She can usually come.</span></p>

<p>মাঝের সিঁড়িগুলো, <span lang="en">sometimes, usually, often</span>, বাক্যের শুরুতেও যেতে পারে: <span lang="en">Sometimes we eat out.</span> কিন্তু <span lang="en">always</span> আর <span lang="en">never</span> শুরুতে গেলে বাক্য উল্টে যায়: <span lang="en">Never have I seen such a catch!</span> সেটা পর্ব ২২-এর জোর দেওয়ার খেলা। আপাতত <span lang="en">always, never</span> মাঝখানেই রাখো। আর <span lang="en">never</span> নিজেই না-বাচক, তাই তার সাথে <span lang="en">not</span> নয়: <span lang="en">I never don't</span> বলে কিছু নেই।</p>

<h2>বাক্যের শেষে: কীভাবে, কোথায়, কখন</h2>

<p>একাধিক adverb শেষে জমলে ইংরেজি একটা ক্রম মানে: <strong>কীভাবে, কোথায়, কখন</strong>। <span lang="en">Rafi played well at the club yesterday.</span> <span lang="en">Nanu sleeps peacefully in her room at night.</span> ক্রমটা মনে রাখার একটা কথা: ম-জা-স, মানে-জায়গা-সময়। বাংলায় আমরা উল্টো বলি, "কাল ক্লাবে ভালো খেলল", তাই এটা অভ্যাস করতে হয়।</p>

<p>তিনটা জায়গা আছে adverb বসার: শুরুতে, মাঝে, শেষে। শুরুতে বসে সময়ের adverb, জোর দিতে: <span lang="en">Yesterday, we won.</span> মাঝে বসে ঘন ঘন-র adverb আর <span lang="en">just, already, still</span>: <span lang="en">We have just won.</span> শেষে বসে ধরন, জায়গা, সময়, ওই ক্রমে। ধরনের adverb ক্রিয়া আর তার কর্মের মাঝে কখনো নয়: <span lang="en">He hit hard the ball</span> ভুল, <span lang="en">He hit the ball hard</span> ঠিক। ক্রিয়া আর কর্ম একসাথে থাকে, adverb তাদের পরে।</p>

${mount("adverbs-order")}

${mount("adverbs-gap")}

<h2>still, yet, already: সময়ের ত্রিভুজ</h2>

<p>তিনটা ছোট শব্দ, তিনটা ছবি, আর পরীক্ষায় প্রতি বছর। <span lang="en">still</span>: এখনো চলছে, শেষ হয়নি, একটু অধৈর্য। <span lang="en">Rafi is still sleeping.</span> মাঝে বসে। <span lang="en">yet</span>: এখনো হয়নি, কিন্তু হবে; শুধু না-বাচক আর প্রশ্নে, বাক্যের শেষে। <span lang="en">Rafi has not woken up yet. Has he woken up yet?</span> <span lang="en">already</span>: ভাবার আগেই হয়ে গেছে, একটু চমক। <span lang="en">Rafi has already left!</span> মাঝে বসে। তিনটা একসাথে একটা গল্পে: <span lang="en">Is Mitu still studying? No, she has already finished. But Rafi has not started yet.</span></p>

${mount("adverbs-triangle")}

<h2>জোর দেওয়ার শব্দ: very, too, enough</h2>

<p><span lang="en">very</span> adjective বা adverb-কে বাড়ায়: <span lang="en">very fast, very carefully</span>। <span lang="en">too</span> মানে বেশি, খারাপ অর্থে: <span lang="en">The tea is too hot</span>, খাওয়া যাচ্ছে না। <span lang="en">enough</span> বসে adjective-এর <em>পরে</em>: <span lang="en">The tea is hot enough.</span> <span lang="en">enough hot</span> নয়। আর <span lang="en">too</span> আর <span lang="en">very</span> এক নয়: <span lang="en">very tall</span> ভালো কথা, <span lang="en">too tall</span> মানে সমস্যা, দরজায় মাথা ঠেকে।</p>

<p><span lang="en">too</span>-র আরেকটা মানে "ও", বাক্যের শেষে: <span lang="en">I like mangoes too.</span> সেই মানেতে <span lang="en">also</span> মাঝে বসে (<span lang="en">I also like mangoes</span>) আর <span lang="en">as well</span> শেষে। আর <span lang="en">quite, rather, fairly, pretty</span>: "বেশ", <span lang="en">very</span>-র চেয়ে কম। <span lang="en">The film was quite good.</span> মাত্রার একটা সিঁড়ি: <span lang="en">a little, fairly, quite, very, extremely, too</span>।</p>

<div class="ex"><b>Kung Fu Panda-র Master Oogway বলে:</b> <span lang="en">Yesterday is history, tomorrow is a mystery, but today is a gift.</span> তিনটা সময়ের adverb এক লাইনে। আর Po নিজের সম্পর্কে বলে, <span lang="en">I eat very quickly and I train really badly.</span> <span lang="en">very</span> আর <span lang="en">really</span> জোর, <span lang="en">quickly</span> আর <span lang="en">badly</span> কীভাবে।</div>

<h2>adverb-এরও তুলনা হয়</h2>

<p>পর্ব ৫-এর তিন সিঁড়ি adverb-এও চলে, শুধু নিয়মটা একটু আলাদা: <span lang="en">-ly</span> দিয়ে শেষ হওয়া adverb-এ সবসময় <span lang="en">more, most</span> (<span lang="en">more carefully, most carefully</span>), আর ছোটগুলোয় <span lang="en">-er, -est</span> (<span lang="en">faster, fastest; harder, hardest; earlier, earliest</span>)। রেবেল দুটো: <span lang="en">well, better, best</span> আর <span lang="en">badly, worse, worst</span>। <span lang="en">Shakib bats well, Tamim bats better, but Mushfiq bats best of all.</span> <span lang="en">Mustafiz bowls faster than anyone.</span></p>

${mount("adverbs-compare")}

${mount("adverbs-build")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>adverb-এর প্রশ্ন তিন চেহারায়। এক: বন্ধনীতে adjective, খালি ঘরে adjective না adverb। দুই: adverb-টা ঠিক জায়গায় বসানো (<span lang="en">always</span> কোথায়)। তিন: <span lang="en">-ly</span> লাগবে না লাগবে না (<span lang="en">hard/hardly</span>)। প্রথমটার ধাপ:</p>

<ol class="step-list">
<li><strong>খালি ঘরটা কার পাশে?</strong> noun-এর আগে বা <span lang="en">is/was/feel/look</span>-এর পরে: adjective, বন্ধনীর শব্দ যেমন আছে। ক্রিয়ার পরে, "কীভাবে" বোঝায়: adverb, <span lang="en">-ly</span>।</li>
<li><strong>শব্দটা কি <span lang="en">-ly</span> নেয়?</strong> <span lang="en">fast, hard, late, early</span>: না। <span lang="en">good</span>: <span lang="en">well</span>।</li>
<li><strong>বানান।</strong> <span lang="en">-y</span> হলে <span lang="en">-ily</span>, <span lang="en">-le</span> হলে <span lang="en">-ly</span>, <span lang="en">-ic</span> হলে <span lang="en">-ically</span>।</li>
<li><strong>জায়গা ঠিক তো?</strong> ধরনের adverb ক্রিয়া আর কর্মের মাঝে নয়; ঘন ঘন-র adverb ক্রিয়ার আগে, <span lang="en">be</span>-র পরে।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Mitu is a (careful) ___ student. She writes (careful) ___ and (usual) ___ finishes (early) ___. Her teacher says she works (hard) ___ and her English is (real) ___ (good) ___.</span> উত্তর: <span lang="en">careful</span> (noun-এর আগে), <span lang="en">carefully</span> (ক্রিয়ার পরে), <span lang="en">usually</span> (ঘন ঘন, ক্রিয়ার আগে), <span lang="en">early</span> (<span lang="en">-ly</span> নেয় না), <span lang="en">hard</span> (<span lang="en">hardly</span> হলে উল্টো মানে), <span lang="en">really</span> (adjective-কে বাড়াচ্ছে), <span lang="en">good</span> (<span lang="en">is</span>-এর পরে adjective)। সাত ঘর, চার প্রশ্ন।</div>

${mount("adverbs-spot")}

${mount("adverbs-exam")}

${mount("adverbs-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>বন্ধনীতে adjective দেওয়া আর শূন্যস্থানটা ক্রিয়ার পরে? <span lang="en">-ly</span> লাগাও, adverb। শূন্যস্থানটা noun-এর আগে বা <span lang="en">is/was</span>-এর পরে? adjective, যেমন আছে তেমন। বন্ধনীতে <span lang="en">good</span> আর জায়গাটা ক্রিয়ার পরে? <span lang="en">well</span>। বন্ধনীতে <span lang="en">fast, hard, late, early</span>? বদলাবে না, কখনো <span lang="en">-ly</span> নয়।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">feel, look, smell, taste, sound</span>-এর পরে adjective, adverb নয়, কারণ এরা কাজ নয়, অবস্থা। <span lang="en">I feel bad</span> (আমার খারাপ লাগছে), <span lang="en">I feel badly</span> নয়। <span lang="en">The pitha smells good. She looks happy. It sounds great.</span> পাঁচটা ক্রিয়া, পাঁচবার adjective।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p><span lang="en">very</span> একটা তুলনার আগে বসে না। <span lang="en">very better</span> নয়, <span lang="en">much better</span>; <span lang="en">very faster</span> নয়, <span lang="en">much faster</span> বা <span lang="en">far faster</span>। <span lang="en">very</span> শুধু সাধারণ রূপের সাথে: <span lang="en">very good, very fast</span>। আর <span lang="en">very</span> ক্রিয়ার সাথেও বসে না: <span lang="en">I very like it</span> নয়, <span lang="en">I like it very much</span> বা <span lang="en">I really like it</span>।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>পাঁচ জাতের adverb, প্রতিটার একটা উদাহরণ আর তার বসার জায়গা?</li>
<li><span lang="en">fast, hard, late, early, well</span>: কেন এই পাঁচটা মুখস্থ?</li>
<li><span lang="en">hardly</span> আর <span lang="en">lately</span>-র মানে?</li>
<li><span lang="en">always</span> কোথায় বসে, সাধারণ ক্রিয়ায় আর <span lang="en">be</span>-তে?</li>
<li><span lang="en">still, yet, already</span>: তিনটা ছবি এক বাক্যে?</li>
<li><span lang="en">too hot</span> আর <span lang="en">very hot</span>-এর পার্থক্য?</li>
</ul>
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
    "adverbs-kinds": {
      kind: "bins",
      title: { bn: "কোন জাতের adverb", en: "Which kind of adverb" },
      note: { bn: "প্রতিটা শব্দ কোন প্রশ্নের উত্তর দেয়, সেই ঘরে ফেলো।", en: "Drop each word into the box of the question it answers." },
      bins: [
        { id: "how", label: { bn: "কীভাবে", en: "how" } },
        { id: "when", label: { bn: "কখন", en: "when" } },
        { id: "where", label: { bn: "কোথায়", en: "where" } },
        { id: "often", label: { bn: "কতবার", en: "how often" } },
        { id: "much", label: { bn: "কতটা", en: "how much" } },
      ],
      items: [
        { text: { bn: "carefully", en: "carefully" }, bin: "how", why: { bn: "সাবধানে: কীভাবে।", en: "Carefully: how." } },
        { text: { bn: "yesterday", en: "yesterday" }, bin: "when", why: { bn: "গতকাল: কখন।", en: "Yesterday: when." } },
        { text: { bn: "upstairs", en: "upstairs" }, bin: "where", why: { bn: "উপরতলায়: কোথায়।", en: "Upstairs: where." } },
        { text: { bn: "rarely", en: "rarely" }, bin: "often", why: { bn: "কদাচিৎ: কতবার।", en: "Rarely: how often." } },
        { text: { bn: "very", en: "very" }, bin: "much", why: { bn: "খুব: কতটা।", en: "Very: how much." } },
        { text: { bn: "well", en: "well" }, bin: "how", why: { bn: "ভালোভাবে: কীভাবে। good-এর adverb।", en: "Well: how. The adverb of good." } },
        { text: { bn: "soon", en: "soon" }, bin: "when", why: { bn: "শিগগিরই: কখন।", en: "Soon: when." } },
        { text: { bn: "everywhere", en: "everywhere" }, bin: "where", why: { bn: "সব জায়গায়: কোথায়।", en: "Everywhere: where." } },
        { text: { bn: "always", en: "always" }, bin: "often", why: { bn: "সবসময়: কতবার।", en: "Always: how often." } },
        { text: { bn: "almost", en: "almost" }, bin: "much", why: { bn: "প্রায়: কতটা।", en: "Almost: how much." } },
        { text: { bn: "hard", en: "hard" }, bin: "how", why: { bn: "কঠোরভাবে: কীভাবে। -ly ছাড়া।", en: "Hard: how, with no -ly." } },
        { text: { bn: "too", en: "too" }, bin: "much", why: { bn: "বেশি: কতটা।", en: "Too: how much." } },
      ],
    },
    "adverbs-match": {
      kind: "match",
      title: { bn: "adjective থেকে adverb", en: "From adjective to adverb" },
      note: { bn: "বাঁ দিকের adjective-এর সাথে ডান দিকের adverb মেলাও। কয়েকটা রেবেল আছে।", en: "Match each adjective on the left with its adverb on the right. A few are rebels." },
      pairs: [
        { left: { bn: "good", en: "good" }, right: { bn: "well", en: "well" } },
        { left: { bn: "happy", en: "happy" }, right: { bn: "happily", en: "happily" } },
        { left: { bn: "gentle", en: "gentle" }, right: { bn: "gently", en: "gently" } },
        { left: { bn: "fast", en: "fast" }, right: { bn: "fast (একই)", en: "fast (the same)" } },
        { left: { bn: "basic", en: "basic" }, right: { bn: "basically", en: "basically" } },
        { left: { bn: "hard", en: "hard" }, right: { bn: "hard (hardly নয়)", en: "hard (not hardly)" } },
        { left: { bn: "true", en: "true" }, right: { bn: "truly", en: "truly" } },
      ],
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
        { target: "Is Rafi still sleeping? He has not eaten yet.", bn: "রাফি কি এখনো ঘুমাচ্ছে? সে এখনো খায়নি।" },
      ],
    },
    "adverbs-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: hard না hardly?", en: "Guess first: hard or hardly?" },
      ask: { bn: "মিতু আপুর রিপোর্ট কার্ডে লেখা: Mitu hardly works in class. স্যার কি প্রশংসা করলেন?", en: "Mitu's report card says: Mitu hardly works in class. Is the teacher praising her?" },
      choices: [
        { bn: "হ্যাঁ, বলছেন সে কঠোর পরিশ্রম করে", en: "Yes, it says she works hard" },
        { bn: "না, বলছেন সে প্রায় কাজই করে না", en: "No, it says she almost never works" },
      ],
      answer: { bn: "না। hardly মানে 'প্রায় না'। স্যার বলছেন মিতু ক্লাসে প্রায় কাজই করে না।", en: "No. Hardly means almost not. The teacher is saying Mitu barely works in class." },
      why: { bn: "hard-এর adverb hard-ই: Mitu works hard, মিতু কঠোর পরিশ্রম করে। hardly একদম আলাদা শব্দ, উল্টো মানে: প্রায় না। I can hardly hear you, আমি তোমাকে প্রায় শুনতেই পাচ্ছি না। একটা -ly, আর প্রশংসা হয়ে গেল অভিযোগ। lately-ও তাই: late-এর adverb late, আর lately মানে ইদানীং।", en: "The adverb of hard is hard: Mitu works hard. Hardly is a different word with the opposite meaning: almost not. I can hardly hear you means I can barely hear you. One -ly turns praise into a complaint. Lately is the same: the adverb of late is late, and lately means recently." },
    },
    "adverbs-order": {
      kind: "order",
      title: { bn: "ম-জা-স: ঠিক ক্রমে সাজাও", en: "How, where, when: put it in order" },
      note: { bn: "একটা বাক্যের টুকরোগুলো এলোমেলো। ক্রিয়া আর কর্ম একসাথে, তারপর কীভাবে, কোথায়, কখন।", en: "The pieces of one sentence, shuffled. Verb and object stay together, then how, where, when." },
      items: [
        { text: { bn: "Rafi", en: "Rafi" }, why: { bn: "কর্তা সবার আগে।", en: "The subject comes first." } },
        { text: { bn: "played the match", en: "played the match" }, why: { bn: "ক্রিয়া আর কর্ম একসাথে, মাঝে কোনো adverb নয়।", en: "Verb and object stay together; no adverb between them." } },
        { text: { bn: "brilliantly (কীভাবে)", en: "brilliantly (how)" } },
        { text: { bn: "at the stadium (কোথায়)", en: "at the stadium (where)" } },
        { text: { bn: "last Friday (কখন)", en: "last Friday (when)" }, why: { bn: "সময় সবার শেষে।", en: "Time goes last." } },
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
        { text: "Nanu is ___ late for prayers.", bn: "নানু কখনো নামাজে দেরি করেন না।", options: ["never", "never is", "not never"], right: 0, why: { bn: "be-র পরে: is never late। never নিজেই না-বাচক, not লাগে না।", en: "After be: is never late. Never is already negative and needs no not." } },
        { text: "She explained it ___ that everyone understood.", bn: "সে এত সহজ করে বোঝাল যে সবাই বুঝল।", options: ["so simple", "so simply", "so simplely"], right: 1, why: { bn: "কীভাবে বোঝাল: adverb। simple-এর e যায়: simply।", en: "How she explained: an adverb. The e of simple goes: simply." } },
      ],
    },
    "adverbs-triangle": {
      kind: "compare",
      title: { bn: "still, yet, already", en: "Still, yet, already" },
      note: { bn: "তিনটা শব্দ, তিনটা ছবি, তিনটা জায়গা।", en: "Three words, three pictures, three positions." },
      columns: [
        { bn: "still", en: "still" },
        { bn: "yet", en: "yet" },
        { bn: "already", en: "already" },
      ],
      rows: [
        { label: { bn: "ছবি", en: "Picture" }, cells: [{ bn: "এখনো চলছে, শেষ হয়নি", en: "still going on, not over" }, { bn: "এখনো হয়নি, কিন্তু হবে", en: "not happened, but expected" }, { bn: "ভাবার আগেই হয়ে গেছে", en: "done sooner than expected" }] },
        { label: { bn: "কোন বাক্যে", en: "Which sentences" }, cells: [{ bn: "হ্যাঁ-বাচক, প্রশ্ন", en: "positive, questions" }, { bn: "শুধু না-বাচক আর প্রশ্ন", en: "negatives and questions only" }, { bn: "হ্যাঁ-বাচক, প্রশ্ন", en: "positive, questions" }] },
        { label: { bn: "জায়গা", en: "Position" }, cells: [{ bn: "মাঝে: is still sleeping", en: "middle: is still sleeping" }, { bn: "শেষে: has not eaten yet", en: "end: has not eaten yet" }, { bn: "মাঝে: has already left", en: "middle: has already left" }] },
        { label: { bn: "সুর", en: "Tone" }, cells: [{ bn: "একটু অধৈর্য", en: "a little impatient" }, { bn: "অপেক্ষা", en: "waiting" }, { bn: "একটু চমক", en: "a little surprised" }] },
      ],
    },
    "adverbs-compare": {
      kind: "gap",
      title: { bn: "adverb-এর তিন সিঁড়ি", en: "The adverb's three steps" },
      note: { bn: "-ly হলে more/most, ছোট হলে -er/-est, আর well আর badly রেবেল।", en: "With -ly take more and most, short ones take -er and -est, and well and badly are rebels." },
      items: [
        { text: "Mustafiz bowls ___ than anyone in the team.", bn: "মুস্তাফিজ দলের যে কারও চেয়ে দ্রুত বল করে।", options: ["more fast", "faster", "fastly"], right: 1, why: { bn: "fast ছোট, -ly নেয় না: faster than।", en: "Fast is short and takes no -ly: faster than." } },
        { text: "Mitu writes ___ than her brother.", bn: "মিতু তার ভাইয়ের চেয়ে সাবধানে লেখে।", options: ["more carefully", "carefullier", "carefuller"], right: 0, why: { bn: "-ly adverb-এ সবসময় more: more carefully।", en: "An -ly adverb always takes more: more carefully." } },
        { text: "Of all the batters, Mushfiq plays ___ under pressure.", bn: "সব ব্যাটারের মধ্যে মুশফিক চাপের মুখে সবচেয়ে ভালো খেলে।", options: ["best", "goodest", "most well"], right: 0, why: { bn: "well রেবেল: well, better, best। of all, তাই best।", en: "Well is a rebel: well, better, best. Of all, so best." } },
        { text: "Rafi came ___ than usual today.", bn: "রাফি আজ অন্য দিনের চেয়ে আগে এল।", options: ["more early", "earlier", "earlyer"], right: 1, why: { bn: "early-র y হয়ে যায় i: earlier। early -ly নেয় না।", en: "The y of early becomes i: earlier. Early takes no -ly." } },
        { text: "I played ___ in the second match than in the first.", bn: "প্রথম ম্যাচের চেয়ে দ্বিতীয়টায় আমি খারাপ খেলেছি।", options: ["worse", "more badly", "badlier"], right: 0, why: { bn: "badly রেবেল: badly, worse, worst।", en: "Badly is a rebel: badly, worse, worst." } },
        { text: "This bat is ___ better than the old one.", bn: "এই ব্যাটটা পুরনোটার চেয়ে অনেক ভালো।", options: ["very", "much", "more"], right: 1, why: { bn: "তুলনার আগে very নয়: much better, far better।", en: "Not very before a comparative: much better, far better." } },
      ],
    },
    "adverbs-build": {
      kind: "build",
      title: { bn: "ঠিক জায়গায় adverb বসিয়ে সাজাও", en: "Build it with the adverb in its place" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো always কোথায় গেল, yet কোথায়, আর ম-জা-স ক্রম।", en: "The words are shuffled. As you build, watch where always goes, where yet goes, and the how-where-when order." },
      pattern: "subject + (frequency) + verb + object + how + where + when",
      lines: [
        { target: "Rafi always plays cricket on Fridays.", bn: "রাফি সবসময় শুক্রবারে ক্রিকেট খেলে।" },
        { target: "Nanu is never late for prayers.", bn: "নানু কখনো নামাজে দেরি করেন না।" },
        { target: "She sang beautifully at the school function yesterday.", bn: "সে কাল স্কুলের অনুষ্ঠানে সুন্দর গাইল।" },
        { target: "Mitu has not finished her homework yet.", bn: "মিতু এখনো হোমওয়ার্ক শেষ করেনি।" },
        { target: "The tea is too hot to drink.", bn: "চা-টা এত গরম যে খাওয়া যাচ্ছে না।" },
        { target: "He worked hard and passed easily.", bn: "সে কঠোর পরিশ্রম করল আর সহজে পাশ করল।" },
      ],
    },
    "adverbs-spot": {
      kind: "spot",
      title: { bn: "রাফির রচনা, adverb-এর ভুল", en: "Rafi's essay: the adverb mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে adverb বা তার জায়গার ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line with an adverb mistake or an adverb in the wrong place." },
      source: { bn: "রচনা: আমাদের নতুন কোচ", en: "Essay: our new coach" },
      lines: [
        { text: { bn: "Our new coach speaks softly, but everyone listens carefully.", en: "Our new coach speaks softly, but everyone listens carefully." } },
        { text: { bn: "He arrives always before us and leaves last.", en: "He arrives always before us and leaves last." }, flag: { bn: "always ক্রিয়ার আগে: He always arrives।", en: "Always goes before the verb: He always arrives." } },
        { text: { bn: "He explains the game very good.", en: "He explains the game very good." }, flag: { bn: "কীভাবে বোঝান: adverb, well। very well।", en: "How he explains: an adverb, well. Very well." } },
        { text: { bn: "We practise hard every evening.", en: "We practise hard every evening." } },
        { text: { bn: "Last week he hit brilliantly the ball in the practice match.", en: "Last week he hit brilliantly the ball in the practice match." }, flag: { bn: "ক্রিয়া আর কর্মের মাঝে adverb নয়: hit the ball brilliantly।", en: "No adverb between verb and object: hit the ball brilliantly." } },
        { text: { bn: "I feel badly when we lose, but he says losing teaches us.", en: "I feel badly when we lose, but he says losing teaches us." }, flag: { bn: "feel-এর পরে adjective: I feel bad।", en: "After feel, an adjective: I feel bad." } },
        { text: { bn: "We have already won two matches this season.", en: "We have already won two matches this season." } },
      ],
    },
    "adverbs-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Put always in the right place: Nanu / is / kind / to children.", en: "Put always in the right place: Nanu / is / kind / to children." },
          options: [
            { text: { bn: "Nanu always is kind to children.", en: "Nanu always is kind to children." }, why: { bn: "না। be-র পরে বসে, আগে নয়।", en: "No. It goes after be, not before." } },
            { text: { bn: "Nanu is always kind to children.", en: "Nanu is always kind to children." }, right: true, why: { bn: "হ্যাঁ। be-র পরে: is always।", en: "Yes. After be: is always." } },
            { text: { bn: "Nanu is kind always to children.", en: "Nanu is kind always to children." }, why: { bn: "না। always মাঝে, is-এর ঠিক পরে।", en: "No. Always sits in the middle, right after is." } },
          ],
        },
        {
          ask: { bn: "Has the match started ___? No, it has not started ___. কোন জোড়া?", en: "Has the match started ___? No, it has not started ___. Which pair?" },
          options: [
            { text: { bn: "already, still", en: "already, still" }, why: { bn: "না। না-বাচক আর প্রশ্নের শেষে yet বসে।", en: "No. Yet goes at the end of negatives and questions." } },
            { text: { bn: "yet, yet", en: "yet, yet" }, right: true, why: { bn: "হ্যাঁ। প্রশ্ন আর না-বাচক, দুটোর শেষেই yet।", en: "Yes. A question and a negative, and yet ends both." } },
            { text: { bn: "still, already", en: "still, already" }, why: { bn: "না। already হ্যাঁ-বাচকে, still মাঝে। এখানে দুটোই yet।", en: "No. Already is for positives and still sits in the middle. Both here are yet." } },
          ],
        },
        {
          ask: { bn: "The soup smells ___, but it tastes ___ salty. কোন জোড়া?", en: "The soup smells ___, but it tastes ___ salty. Which pair?" },
          options: [
            { text: { bn: "nicely, very", en: "nicely, very" }, why: { bn: "না। smell-এর পরে adjective: nice।", en: "No. After smell, an adjective: nice." } },
            { text: { bn: "nice, too", en: "nice, too" }, right: true, why: { bn: "হ্যাঁ। smells nice (adjective), আর but বলছে সমস্যা: too salty।", en: "Yes. Smells nice (adjective), and but signals a problem: too salty." } },
            { text: { bn: "nice, enough", en: "nice, enough" }, why: { bn: "না। enough adjective-এর পরে বসে (salty enough), আর মানেটা সমস্যা নয়।", en: "No. Enough goes after the adjective (salty enough), and it does not mean a problem." } },
          ],
        },
        {
          ask: { bn: "Which sentence means 'I almost never see him'?", en: "Which sentence means 'I almost never see him'?" },
          options: [
            { text: { bn: "I hardly see him.", en: "I hardly see him." }, right: true, why: { bn: "হ্যাঁ। hardly মানে প্রায় না।", en: "Yes. Hardly means almost not." } },
            { text: { bn: "I see him hard.", en: "I see him hard." }, why: { bn: "না। hard মানে কঠোরভাবে, আর এটা see-র সাথে বসে না।", en: "No. Hard means with effort, and it does not go with see." } },
            { text: { bn: "I see him lately.", en: "I see him lately." }, why: { bn: "না। lately মানে ইদানীং, আর সেটা have seen-এর সাথে বসে।", en: "No. Lately means recently, and it goes with have seen." } },
          ],
        },
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
        {
          ask: { bn: "She is a ___ girl, and she smiles ___. কোন জোড়া?", en: "She is a ___ girl, and she smiles ___. Which pair?" },
          options: [
            { text: { bn: "friendly, friendlily", en: "friendly, friendlily" }, why: { bn: "না। friendlily বলে কিছু নেই। ঘুরিয়ে বলতে হয়: in a friendly way।", en: "No. There is no friendlily. Say it another way: in a friendly way." } },
            { text: { bn: "friendly, in a friendly way", en: "friendly, in a friendly way" }, right: true, why: { bn: "হ্যাঁ। friendly একটা adjective, -ly থাকলেও। adverb বানাতে in a friendly way।", en: "Yes. Friendly is an adjective despite the -ly. Its adverb is in a friendly way." } },
            { text: { bn: "friend, friendly", en: "friend, friendly" }, why: { bn: "না। a friend girl হয় না; noun-এর আগে adjective, friendly।", en: "No. A friend girl is impossible; before a noun comes the adjective, friendly." } },
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
        { text: { bn: "still, yet, already দিয়ে তিনটা সত্যি বাক্য আজকের দিন নিয়ে: I am still…, I have not … yet, I have already…", en: "Three true sentences about today with still, yet and already: I am still…, I have not … yet, I have already…" } },
        { text: { bn: "পাঁচটা adjective নাও আর প্রতিটার adverb বলো, বানান সহ: happy happily, gentle gently, basic basically, good well, fast fast।", en: "Take five adjectives and say each one's adverb, spelling included: happy happily, gentle gently, basic basically, good well, fast fast." } },
        { text: { bn: "আজকের আবহাওয়া too আর enough দিয়ে: It is too hot to play. It is not cool enough.", en: "Today's weather with too and enough: It is too hot to play. It is not cool enough." } },
      ],
    },
  },
};
