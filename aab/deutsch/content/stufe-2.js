/* ============================================================
   content/stufe-2.js: the text of Stufe 2.

   Keys match the Teil slugs in ../curriculum.js. Same house
   style as stufe-1.js, and that file's header is the reference:
   Bangla explains, German is explained, the learner is তুমি,
   every German word carries lang="de".

   What is different at this level, and it runs through every
   Teil below: nothing here is new. Stufe 1 handed over a
   bracket, three hats and seat two, and every wall in this Stufe
   opens with one of those. The pages say so out loud, because a
   learner who believes Stufe 2 is a fresh mountain will climb it
   like one.
   ============================================================ */

export default {

/* ------------------------------------------------------------
   কে কাকে কী
   ------------------------------------------------------------ */

akkusativ: `
<p>স্তর ১-এ একটা কথা দিয়ে রাখা হয়েছিল: <span lang="de">einen Tee</span>-র ওই
<span lang="de">-en</span> লেজটা কোথা থেকে এলো, সেটা পরে বলা হবে। এই সেই পরে।</p>

<p>আর কথাটা রাখতে এক লাইনই লাগবে। ভয় পাওয়ার মতো কিছু এখানে নেই, শুধু একটা দল আছে
যে কোট পরে।</p>

<h2>যা আসলে ঘটছে</h2>

<p>প্রতিটা বাক্যে একজন কর্তা থাকে (কে করছে), আর প্রায়ই একজন গ্রহীতা (কাকে, বা কী)।
বাংলা গ্রহীতাকে চিহ্নিত করে '-কে' দিয়ে: লোক<b>টাকে</b> দেখি। জার্মানও চিহ্নিত করে,
কিন্তু মাত্র এক দলে।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><b>WER?</b> <span lang="de">der Mann</span> →
  <b>WEN?</b> <span lang="de">den Mann</span></p>
  <p class="muster-why">কর্তা হলে <span lang="de">der</span>, গ্রহীতা হলে
  <span lang="de">den</span>। শুধু নীল দল বদলায়।</p>
  <p class="muster-tipp">লাল (<span lang="de">die</span>), সবুজ
  (<span lang="de">das</span>) আর বহুবচন: একেবারে অটল।</p>
</div>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>টুপি</th><th>কর্তা (<span lang="de">WER</span>)</th>
      <th>গ্রহীতা (<span lang="de">WEN</span>)</th><th>উদাহরণ</th></tr></thead>
  <tbody>
    <tr><td><span class="hut" data-hut="der">der</span></td><td lang="de">der · ein · kein · mein</td>
        <td lang="de"><b>den · einen · keinen · meinen</b></td>
        <td lang="de">Ich sehe den Mann.</td></tr>
    <tr><td><span class="hut" data-hut="die">die</span></td><td lang="de">die · eine · keine</td>
        <td lang="de">die · eine · keine <i>(অটল)</i></td>
        <td lang="de">Ich öffne die Tür.</td></tr>
    <tr><td><span class="hut" data-hut="das">das</span></td><td lang="de">das · ein · kein</td>
        <td lang="de">das · ein · kein <i>(অটল)</i></td>
        <td lang="de">Ich lese das Buch.</td></tr>
    <tr><td>বহুবচন</td><td lang="de">die · keine · meine</td>
        <td lang="de">die · keine · meine <i>(অটল)</i></td>
        <td lang="de">Ich sehe die Kinder.</td></tr>
  </tbody>
</table>
</div>

<div class="merke">পুরো <span lang="de">Akkusativ</span> এক লাইনে: এক দল, একটা
<span lang="de">-en</span> কোট। বাকি তিন দলকে ছুঁয়ো না।</div>

<h2>জোরে পড়ার বাক্য</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich sehe den Mann.</b><span>আমি লোকটাকে দেখি।</span></p>
  <p class="satz"><b lang="de">Ich trinke den Tee.</b><span>আমি চা-টা খাই।</span></p>
  <p class="satz"><b lang="de">Ich esse einen Apfel.</b><span>আমি একটা আপেল খাই।</span></p>
  <p class="satz"><b lang="de">Ich habe keinen Bruder.</b><span>আমার কোনো ভাই নেই।</span></p>
  <p class="satz"><b lang="de">Ich suche meinen Stift.</b><span>আমি আমার কলমটা খুঁজছি।</span></p>
  <p class="satz"><b lang="de">Ich lese das Buch.</b><span>আমি বইটা পড়ছি। (অটল)</span></p>
  <p class="satz"><b lang="de">Ich öffne die Tür.</b><span>আমি দরজাটা খুলি। (অটল)</span></p>
</div>

<h2>মানুষগুলোও কোট পরে</h2>

<p>বাংলায় 'আমি' হয়ে যায় 'আমাকে', 'তুমি' হয় 'তোমাকে'। জার্মানে শব্দটাই বদলে যায়।
সত্যিকারের নতুন মাত্র তিনটা, বাকিরা আগের মতোই।</p>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>কর্তা</th><th>গ্রহীতা</th><th lang="de">Beispiel</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="de">ich</td><td lang="de"><b>mich</b></td>
        <td lang="de">Siehst du mich?</td><td>তুমি কি আমাকে দেখছো?</td></tr>
    <tr><td lang="de">du</td><td lang="de"><b>dich</b></td>
        <td lang="de">Ich liebe dich.</td><td>আমি তোমাকে ভালোবাসি।</td></tr>
    <tr><td lang="de">er</td><td lang="de"><b>ihn</b></td>
        <td lang="de">Ich kenne ihn.</td><td>আমি তাকে চিনি।</td></tr>
    <tr><td lang="de">sie / es</td><td lang="de">sie / es</td>
        <td lang="de">Ich sehe sie.</td><td>বদলায় না।</td></tr>
    <tr><td lang="de">wir</td><td lang="de"><b>uns</b></td>
        <td lang="de">Sie kennt uns.</td><td>সে আমাদের চেনে।</td></tr>
    <tr><td lang="de">ihr</td><td lang="de"><b>euch</b></td>
        <td lang="de">Ich höre euch!</td><td>আমি তোমাদের শুনছি!</td></tr>
    <tr><td lang="de">sie / Sie</td><td lang="de">sie / Sie</td>
        <td lang="de">Ich verstehe Sie.</td><td>আমি আপনাকে বুঝছি।</td></tr>
  </tbody>
</table>
</div>

<div class="merke"><span lang="de">Ich liebe dich</span>: এটা তো পৃথিবীই জানে।
মানে তিনটার একটা তুমি আগেই শিখে বসে আছো।</div>

<h2>যে ক্রিয়াগুলো সবসময় গ্রহীতা টানে</h2>

<p>এই ক্রিয়াগুলোর পরে প্রায় সবসময় একটা গ্রহীতা আসে। এদের চিনে রাখলে নিয়মটা
নিজেই বসে যাবে।</p>

<div class="verb-gitter">
  <span><b lang="de">sehen</b> দেখা</span>
  <span><b lang="de">haben</b> থাকা</span>
  <span><b lang="de">kaufen</b> কেনা</span>
  <span><b lang="de">essen</b> খাওয়া</span>
  <span><b lang="de">trinken</b> পান করা</span>
  <span><b lang="de">lieben</b> ভালোবাসা</span>
  <span><b lang="de">kennen</b> চেনা</span>
  <span><b lang="de">suchen</b> খোঁজা</span>
  <span><b lang="de">finden</b> পাওয়া</span>
  <span><b lang="de">brauchen</b> দরকার হওয়া</span>
  <span><b lang="de">lesen</b> পড়া</span>
  <span><b lang="de">öffnen</b> খোলা</span>
</div>

<h3><span lang="de">es gibt</span>: একটা আস্ত মেশিন</h3>

<p>'আছে' বলার জার্মান পদ্ধতি, আর যা 'আছে' সেটা সবসময় গ্রহীতার আসনে ঢোকে।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Es gibt einen Markt hier.</b><span>এখানে একটা বাজার আছে।</span></p>
  <p class="satz"><b lang="de">Es gibt keinen Tee mehr.</b><span>চা আর নেই।</span></p>
  <p class="satz"><b lang="de">Gibt es Fragen?</b><span>কোনো প্রশ্ন আছে?</span></p>
  <p class="satz"><b lang="de">Es gibt immer einen Weg.</b><span>পথ সবসময় একটা থাকে।</span></p>
</div>

<div class="merke warn">ফাঁদ: <span lang="de">Ich sehe der Mann</span> নয়।
নীল দল গ্রহীতা হলে <span lang="de">den</span>, ব্যতিক্রম নেই।</div>
`,

possessiv: `
<p><span lang="de">kein</span> তুমি স্তর ১-এ শিখেছো। সুখবরটা হলো: মালিকানার
শব্দগুলো ঠিক <span lang="de">kein</span>-এর মতো চলে। একটা শিখলে আরেকটা বিনামূল্যে।</p>

<h2>দুই ধাপ, তারপর শেষ</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape">মালিক → শব্দটা &nbsp;·&nbsp; জিনিসের টুপি → পোশাকটা</p>
  <p class="muster-why">কে মালিক, সেটা ঠিক করে <span lang="de">mein</span> না
  <span lang="de">sein</span> না <span lang="de">ihr</span>। জিনিসটা কোন টুপির,
  সেটা ঠিক করে শেষে <span lang="de">-e</span> বসবে কি না।</p>
</div>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>মালিক</th><th>শব্দ</th><th><span lang="de">der</span> ও
      <span lang="de">das</span> জিনিস</th><th><span lang="de">die</span> জিনিস ও বহুবচন</th></tr></thead>
  <tbody>
    <tr><td>আমার</td><td lang="de"><b>mein</b></td>
        <td lang="de">mein Bruder · mein Buch</td><td lang="de">meine Mutter · meine Bücher</td></tr>
    <tr><td>তোমার</td><td lang="de"><b>dein</b></td>
        <td lang="de">dein Vater</td><td lang="de">deine Schwester</td></tr>
    <tr><td>তার (ছেলের)</td><td lang="de"><b>sein</b></td>
        <td lang="de">sein Haus</td><td lang="de">seine Familie</td></tr>
    <tr><td>তার (মেয়ের) / তাদের</td><td lang="de"><b>ihr</b></td>
        <td lang="de">ihr Bruder</td><td lang="de">ihre Schule</td></tr>
    <tr><td>আমাদের</td><td lang="de"><b>unser</b></td>
        <td lang="de">unser Haus</td><td lang="de">unsere Familie</td></tr>
    <tr><td>তোমাদের</td><td lang="de"><b>euer</b></td>
        <td lang="de">euer Haus</td><td lang="de">eure Schule <i>(e পড়ে যায়)</i></td></tr>
    <tr><td>আপনার</td><td lang="de"><b>Ihr</b></td>
        <td lang="de">Ihr Name</td><td lang="de">Ihre Frage</td></tr>
  </tbody>
</table>
</div>

<div class="merke warn">সাবধান-জোড়া: <span lang="de">sein</span> মানে তার (ছেলের),
<span lang="de">ihr</span> মানে তার (মেয়ের)। মালিক কে, সেটাই ঠিক করে দেয়,
জিনিসটা কী তা নয়। ইংরেজির <i>his</i> আর <i>her</i>-এর মতোই।</div>

<h2>গ্রহীতা হলে</h2>

<p>এখানে <a href="/deutsch/stufe-2/akkusativ.html">আগের Teil</a>-এর সেই এক লাইনের
আইনই খাটে: শুধু নীল জিনিসে <span lang="de">-en</span>।</p>

<div class="split">
  <div class="do">
    <h5>নীল জিনিস → <span lang="de">-en</span></h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich liebe meinen Bruder.</b><span>আমি আমার ভাইকে ভালোবাসি।</span></p>
      <p class="satz"><b lang="de">Ich suche meinen Stift.</b><span>আমি আমার কলম খুঁজছি।</span></p>
      <p class="satz"><b lang="de">Ich besuche ihren Vater.</b><span>আমি তার বাবাকে দেখতে যাচ্ছি।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>বাকি সব → অটল</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich liebe meine Familie.</b><span>আমি আমার পরিবারকে ভালোবাসি।</span></p>
      <p class="satz"><b lang="de">Kennst du seine Schwester?</b><span>তুমি কি তার বোনকে চেনো?</span></p>
      <p class="satz"><b lang="de">Wir lieben unser Land.</b><span>আমরা আমাদের দেশকে ভালোবাসি।</span></p>
    </div>
  </div>
</div>

<h2>নিজের পরিবার, সঠিক মালিকানায়</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">Das ist meine Mutter.</b><span>এই আমার মা।</span></p>
  <p class="satz"><b lang="de">Das ist mein Vater.</b><span>এই আমার বাবা।</span></p>
  <p class="satz"><b lang="de">Das sind meine Geschwister.</b><span>এরা আমার ভাইবোন।</span></p>
  <p class="satz"><b lang="de">Sein Bruder wohnt in Dhaka.</b><span>তার (ছেলের) ভাই ঢাকায় থাকে।</span></p>
  <p class="satz"><b lang="de">Ihre Schwester ist Lehrerin.</b><span>তার (মেয়ের) বোন শিক্ষিকা।</span></p>
  <p class="satz"><b lang="de">Unser Haus ist klein, aber schön.</b><span>আমাদের বাড়ি ছোট, কিন্তু সুন্দর।</span></p>
</div>

<div class="merke">আজকের কাজ: নিজের পরিবারের ছয়জনকে জার্মানে পরিচয় করিয়ে দাও,
জোরে। ছয়টা বাক্য, ছয়জন মানুষ, একটাই ছাঁচ।</div>
`,

"trennbare-verben": `
<p>একটা কথা স্বীকার করা যাক: <span lang="de">Ich stehe um sechs Uhr auf</span>
তুমি স্তর ১ থেকেই বলছো। তৈরি টুকরো হিসেবে মুখস্থ করেছিলে, আর সেটা কাজও করেছে।</p>

<p>আজ শুধু যন্ত্রটা খুলে দেখবো। ভেতরে কোনো নতুন যন্ত্রাংশ নেই।</p>

<h2>কাতাপল্ট</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">auf</span> + <span lang="de">stehen</span> =
  <span lang="de">aufstehen</span> → <span lang="de">Ich <b>stehe</b> um sechs Uhr <b>auf</b>.</span></p>
  <p class="muster-why">মূল ক্রিয়াটা আসন-দুইয়ে বসে (সেই চেনা আইন), আর উপসর্গটা
  কাতাপল্টে উড়ে গিয়ে বাক্যের শেষে পড়ে। মাঝখানে যা খুশি বসতে পারে।</p>
  <p class="muster-tipp">এটা স্তর ১-এর বন্ধনীরই আপন ভাই:
  <span lang="de">möchte … lernen</span>, <span lang="de">stehe … auf</span>।</p>
</div>

<div class="table-scroll">
<table class="platz-tabelle">
  <thead><tr><th>১</th><th>২ · ক্রিয়া</th><th>মাঝখানে</th><th>শেষ · উপসর্গ</th></tr></thead>
  <tbody>
    <tr><td lang="de">Ich</td><td lang="de"><b>stehe</b></td><td lang="de">um sechs Uhr</td>
        <td lang="de"><b>auf</b>.</td></tr>
    <tr><td lang="de">Ich</td><td lang="de"><b>rufe</b></td><td lang="de">dich heute Abend</td>
        <td lang="de"><b>an</b>.</td></tr>
    <tr><td lang="de">Der Film</td><td lang="de"><b>fängt</b></td><td lang="de">um acht</td>
        <td lang="de"><b>an</b>.</td></tr>
    <tr><td lang="de">Wir</td><td lang="de"><b>kaufen</b></td><td lang="de">am Freitag</td>
        <td lang="de"><b>ein</b>.</td></tr>
  </tbody>
</table>
</div>

<h2>রোজকার কাতাপল্টগুলো</h2>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th lang="de">Verb</th><th>অর্থ</th><th>বাক্যের ভেতরে</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>aufstehen</b></td><td>ঘুম থেকে ওঠা</td>
        <td lang="de">Ich stehe um sechs Uhr auf.</td></tr>
    <tr><td lang="de"><b>anrufen</b></td><td>ফোন করা</td>
        <td lang="de">Ich rufe dich heute Abend an.</td></tr>
    <tr><td lang="de"><b>einkaufen</b></td><td>বাজার করা</td>
        <td lang="de">Wir kaufen am Freitag ein.</td></tr>
    <tr><td lang="de"><b>fernsehen</b></td><td>টিভি দেখা</td>
        <td lang="de">Er sieht jeden Abend fern.</td></tr>
    <tr><td lang="de"><b>mitkommen</b></td><td>সাথে আসা</td>
        <td lang="de">Kommst du mit?</td></tr>
    <tr><td lang="de"><b>anfangen</b> <i class="stern">*</i></td><td>শুরু হওয়া</td>
        <td lang="de">Der Film fängt um acht an.</td></tr>
  </tbody>
</table>
</div>

<p><span class="stern">*</span> চিহ্নটা মনে আছে? <span lang="de">anfangen</span>-এ
<span lang="de">du</span> আর <span lang="de">er/sie/es</span>-এ স্বর বদলায়:
<span lang="de">fängt</span>।</p>

<div class="verb-gitter">
  <span><b lang="de">aufhören</b> থামা</span>
  <span><b lang="de">aufmachen</b> খোলা</span>
  <span><b lang="de">zumachen</b> বন্ধ করা</span>
  <span><b lang="de">ausgehen</b> বেরোনো</span>
  <span><b lang="de">zurückkommen</b> ফিরে আসা</span>
  <span><b lang="de">abholen</b> নিতে যাওয়া</span>
  <span><b lang="de">aussehen</b> দেখতে লাগা</span>
  <span><b lang="de">mitbringen</b> সাথে আনা</span>
</div>

<h2>modal এলে জোড়া লেগে যায়</h2>

<p>সাহায্যকারী ক্রিয়া (<span lang="de">möchte</span>, <span lang="de">kann</span>,
<span lang="de">muss</span>) থাকলে কাতাপল্ট বন্ধ। পুরো ক্রিয়াটা জোড়া লেগে বাক্যের
শেষে গিয়ে বসে, ঠিক স্তর ১-এর বন্ধনীর নিয়মে।</p>

<div class="split">
  <div class="do">
    <h5>একা · ভাঙে</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich stehe früh auf.</b><span>আমি সকালে উঠি।</span></p>
      <p class="satz"><b lang="de">Ich rufe dich an.</b><span>আমি তোমাকে ফোন করবো।</span></p>
      <p class="satz"><b lang="de">Wann fängt die Schule an?</b><span>স্কুল কখন শুরু হয়?</span></p>
      <p class="satz"><b lang="de">Du siehst müde aus!</b><span>তোমাকে ক্লান্ত দেখাচ্ছে!</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">modal</span>-এর সাথে · জোড়া লাগে</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich muss früh aufstehen.</b><span>আমাকে সকালে উঠতেই হবে।</span></p>
      <p class="satz"><b lang="de">Ich möchte dich anrufen.</b><span>আমি তোমাকে ফোন করতে চাই।</span></p>
      <p class="satz"><b lang="de">Kann ich mitkommen?</b><span>আমি কি সাথে আসতে পারি?</span></p>
      <p class="satz"><b lang="de">Ich möchte nicht fernsehen.</b><span>আমি টিভি দেখতে চাই না।</span></p>
    </div>
  </div>
</div>

<div class="merke">দুটো নিয়ম, একটাই আত্মা: আসল ক্রিয়া-অংশ আসন-দুইয়ে, বাকিটা
বাক্যের শেষে। জার্মান বাক্য একটা খিলান, আর সেটা দুই পায়ে দাঁড়ায়।</div>

<div class="merke warn">ফাঁদ: <span lang="de">Ich aufstehe um sechs</span> নয়।
উপসর্গ কখনো ক্রিয়ার সাথে আসন-দুইয়ে বসে না, সে উড়ে যায়।</div>
`,

/* ------------------------------------------------------------
   দেওয়া ও গতকাল
   ------------------------------------------------------------ */

dativ: `
<p>জার্মান শেখা লোকজন <span lang="de">Dativ</span> নিয়ে ভয় দেখায়। তাদের ভয়টা
সত্যি, কিন্তু সেটা ইংরেজিভাষীদের ভয়। তোমার জন্য এখানে একটা উপহার লুকানো আছে,
আর সেটা তোমার মাতৃভাষা থেকেই আসছে।</p>

<h2>বাংলার উপহার</h2>

<p><span lang="de">Dativ</span>-এর প্রশ্ন হলো <b lang="de">WEM?</b>: কাকে। দেওয়া,
সাহায্য করা আর অনুভব করার কারক।</p>

<p>এবার আসল কথাটা। জার্মান বলে <span lang="de">Das gefällt mir</span>, যার আক্ষরিক
অর্থ 'ওটা আমার-কাছে ভালো লাগে'। বাংলা ঠিক তাই বলে: <b>আমার ভালো লাগে</b>।
ইংরেজি জোর করে বলায় <i>I like it</i>, কর্তা আগে। তোমার মাতৃভাষা আর জার্মান
এখানে একমত: যে অনুভব করছে, সে-ই গ্রহীতা।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Das gefällt <b>mir</b>.</span> = আমার ভালো লাগে।</p>
  <p class="muster-why">বাংলা যেভাবে ভাবে, জার্মানও ঠিক সেভাবেই ভাবে। মাঝখানে
  ইংরেজিটাকে ঢুকতে দিও না।</p>
  <p class="muster-tipp"><span lang="de">Wie geht es dir?</span>: স্তর ১ থেকেই তুমি
  <span lang="de">Dativ</span> বলছো, না জেনেই।</p>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">Das gefällt mir.</b><span>আমার (এটা) ভালো লাগে।</span></p>
  <p class="satz"><b lang="de">Der Tee schmeckt mir.</b><span>চা-টা আমার ভালো লাগছে (স্বাদে)।</span></p>
  <p class="satz"><b lang="de">Wie geht es dir?</b><span>তোমার কেমন চলছে?</span></p>
  <p class="satz"><b lang="de">Mir ist kalt.</b><span>আমার ঠান্ডা লাগছে।</span></p>
  <p class="satz"><b lang="de">Das gehört mir.</b><span>এটা আমার।</span></p>
  <p class="satz"><b lang="de">Deutsch macht mir Spaß!</b><span>জার্মান আমার মজা লাগে!</span></p>
</div>

<h2>ছোট্ট দুটো গান</h2>

<div class="split">
  <div class="do">
    <h5>মানুষ · <span lang="de">WEM?</span></h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">ich → mir</b><span>আমাকে, আমার-কাছে</span></p>
      <p class="satz"><b lang="de">du → dir</b><span>তোমাকে</span></p>
      <p class="satz"><b lang="de">er / es → ihm</b><span>তাকে (ছেলে), ওটাকে</span></p>
      <p class="satz"><b lang="de">sie → ihr</b><span>তাকে (মেয়ে)</span></p>
      <p class="satz"><b lang="de">wir → uns</b><span>আমাদের</span></p>
      <p class="satz"><b lang="de">ihr → euch</b><span>তোমাদের</span></p>
      <p class="satz"><b lang="de">sie / Sie → ihnen / Ihnen</b><span>তাদের, আপনাকে</span></p>
    </div>
  </div>
  <div class="others">
    <h5>টুপি · <span lang="de">dem-der-dem-den</span></h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">der → dem</b><span lang="de">mit dem Mann</span></p>
      <p class="satz"><b lang="de">das → dem</b><span lang="de">mit dem Kind</span></p>
      <p class="satz"><b lang="de">die → der</b><span lang="de">mit der Frau</span></p>
      <p class="satz"><b lang="de">বহুবচন → den + n</b><span lang="de">mit den Kindern</span></p>
      <p class="satz"><b lang="de">ein → einem</b><span lang="de">eine → einer</span></p>
      <p class="satz"><b lang="de">mein → meinem</b><span lang="de">meiner Mutter</span></p>
    </div>
  </div>
</div>

<div class="merke">গাও: <b lang="de">dem-der-dem-den</b>, তারপর
<b lang="de">mir-dir-ihm-ihr</b>। দশবার। এটা পাহাড় নয়, দুটো সিঁড়ি।</div>

<div class="merke warn">খেয়াল করো: লাল দল (<span lang="de">die</span>) এখানে
<span lang="de">der</span> হয়ে যায়। এটাই একমাত্র জায়গা যেখানে চোখ ধোঁকা খায়:
<span lang="de">mit der Frau</span>-র <span lang="de">der</span> নীল নয়, লাল।</div>

<h2>যে পাঁচ ক্রিয়া সবসময় দেয়</h2>

<p>এরা সবসময় 'কাউকে' কিছু করে, তাই এদের পরে সবসময় <span lang="de">Dativ</span>।
প্রতিটাকে দুই শব্দের হৃদস্পন্দনের মতো শেখো।</p>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>ক্রিয়া</th><th>হৃদস্পন্দন</th><th>উদাহরণ</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>helfen</b></td><td lang="de">hilf mir</td>
        <td lang="de">Kannst du mir helfen? · Ich helfe meiner Mutter.</td></tr>
    <tr><td lang="de"><b>danken</b></td><td lang="de">danke dir</td>
        <td lang="de">Ich danke dir! · Wir danken Ihnen.</td></tr>
    <tr><td lang="de"><b>gehören</b></td><td lang="de">gehört mir</td>
        <td lang="de">Das Buch gehört mir.</td></tr>
    <tr><td lang="de"><b>gefallen</b></td><td lang="de">gefällt mir</td>
        <td lang="de">Gefällt dir das Lied?</td></tr>
    <tr><td lang="de"><b>schmecken</b></td><td lang="de">schmeckt mir</td>
        <td lang="de">Der Reis schmeckt mir. · Schmeckt es dir?</td></tr>
  </tbody>
</table>
</div>

<div class="merke warn">সবচেয়ে বেশি হওয়া ভুল:
<span lang="de">hilf <b>mich</b></span> নয়, <span lang="de">hilf <b>mir</b></span>।
<span lang="de">helfen</span> সাহায্য করে কাউ<b>কে</b>, আর সেটাই
<span lang="de">Dativ</span>।</div>
`,

praepositionen: `
<p>আঠা-শব্দগুলো ছোট, কিন্তু এদের মতামত শক্ত: প্রত্যেকে ঠিক করে রেখেছে তার পরে
কোন কারক আসবে। মুখস্থ করার দরকার নেই, দুটো গান গাইলেই হবে।</p>

<h2>দুই দল, দুই গান</h2>

<div class="split">
  <div class="do">
    <h5><span lang="de">Akkusativ</span>-দল</h5>
    <p class="muster-why"><b lang="de">für · ohne · gegen · durch · um</b></p>
    <div class="satz-list">
      <p class="satz"><b lang="de">für dich</b><span>তোমার জন্য</span></p>
      <p class="satz"><b lang="de">für meinen Bruder</b><span>আমার ভাইয়ের জন্য (নীল দল)</span></p>
      <p class="satz"><b lang="de">ohne Zucker</b><span>চিনি ছাড়া</span></p>
      <p class="satz"><b lang="de">gegen die Wand</b><span>দেয়ালের দিকে</span></p>
      <p class="satz"><b lang="de">durch die Stadt</b><span>শহরের ভেতর দিয়ে</span></p>
      <p class="satz"><b lang="de">um drei Uhr</b><span>তিনটায় (চেনা টুকরো)</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">Dativ</span>-দল</h5>
    <p class="muster-why"><b lang="de">mit · nach · aus · zu · von · bei · seit</b></p>
    <div class="satz-list">
      <p class="satz"><b lang="de">mit dem Bus</b><span>বাসে করে</span></p>
      <p class="satz"><b lang="de">mit meiner Mutter</b><span>মায়ের সাথে</span></p>
      <p class="satz"><b lang="de">aus Bangladesch</b><span>বাংলাদেশ থেকে</span></p>
      <p class="satz"><b lang="de">zur Schule</b><span>স্কুলে (zu der)</span></p>
      <p class="satz"><b lang="de">zum Markt</b><span>বাজারে (zu dem)</span></p>
      <p class="satz"><b lang="de">bei uns</b><span>আমাদের ওখানে</span></p>
    </div>
  </div>
</div>

<div class="merke">গান দুটো রোজ একবার: <b lang="de">für-ohne-gegen-durch-um</b>
(<span lang="de">Akkusativ</span>), আর
<b lang="de">mit-nach-aus-zu-von-bei-seit</b> (<span lang="de">Dativ</span>)।</div>

<h3>ছোট জোড়াগুলো</h3>

<p>এগুলো মুখস্থই চলবে, কারণ জার্মানরা এদের আলাদা করে বলেই না।</p>

<div class="verb-gitter">
  <span><b lang="de">im</b> = in dem</span>
  <span><b lang="de">ins</b> = in das</span>
  <span><b lang="de">zur</b> = zu der</span>
  <span><b lang="de">zum</b> = zu dem</span>
  <span><b lang="de">am</b> = an dem</span>
  <span><b lang="de">vom</b> = von dem</span>
</div>

<h2><span lang="de">seit</span>: যে ফাঁদে সবাই পড়ে</h2>

<p>ইংরেজি বলে <i>I have been learning for two years</i>, তাই সবাই জার্মানেও অতীত
বসাতে যায়। জার্মান এখানে বর্তমান কাল ব্যবহার করে, কারণ কাজটা এখনো চলছে।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Ich lerne <b>seit</b> zwei Jahren Deutsch.</span></p>
  <p class="muster-why">আমি দুই বছর ধরে জার্মান শিখছি, আর এখনো শিখছি। তাই
  সাধারণ বর্তমান কাল।</p>
  <p class="muster-tipp"><span lang="de">seit</span> শুরুর বিন্দুটা দেখায়, শেষ
  হওয়া অতীত নয়।</p>
</div>

<div class="table-scroll">
<table class="paar-tabelle">
  <thead><tr><th>❌ যা বলতে যাবে</th><th>✅ যা ঠিক</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="de">Ich habe seit zwei Jahren gelernt.</td>
        <td lang="de">Ich lerne seit zwei Jahren.</td>
        <td>এখনো চলছে, তাই বর্তমান।</td></tr>
    <tr><td lang="de">Ich habe seit 2020 in Dhaka gewohnt.</td>
        <td lang="de">Ich wohne seit 2020 in Dhaka.</td>
        <td>২০২০ থেকে ঢাকায় আছি, এখনো।</td></tr>
  </tbody>
</table>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">Wir lernen seit drei Monaten Deutsch.</b><span>তিন মাস ধরে জার্মান শিখছি।</span></p>
  <p class="satz"><b lang="de">Seit wann lernst du Deutsch?</b><span>কবে থেকে জার্মান শিখছো?</span></p>
  <p class="satz"><b lang="de">Ich kenne sie seit der Schule.</b><span>স্কুল থেকে তাকে চিনি।</span></p>
</div>

<h2><span lang="de">Wo?</span> না <span lang="de">Wohin?</span></h2>

<p><span lang="de">in</span>, <span lang="de">an</span>, <span lang="de">auf</span>:
এদের দুই মন। দাঁড়িয়ে থাকলে <span lang="de">Dativ</span>, কোথাও ঢুকতে থাকলে
<span lang="de">Akkusativ</span>।</p>

<div class="split">
  <div class="do">
    <h5><span lang="de">WO?</span> · কোথায় (স্থির) → <span lang="de">Dativ</span></h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich bin in der Schule.</b><span>আমি স্কুলে আছি।</span></p>
      <p class="satz"><b lang="de">Das Buch ist auf dem Tisch.</b><span>বইটা টেবিলের উপর।</span></p>
      <p class="satz"><b lang="de">Ich wohne im Haus.</b><span>আমি বাড়িটায় থাকি।</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">WOHIN?</span> · কোথায় (গতি) → <span lang="de">Akkusativ</span></h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich gehe in die Schule.</b><span>আমি স্কুলে যাচ্ছি।</span></p>
      <p class="satz"><b lang="de">Ich lege das Buch auf den Tisch.</b><span>আমি বইটা টেবিলে রাখছি।</span></p>
      <p class="satz"><b lang="de">Ich gehe ins Haus.</b><span>আমি বাড়ির ভেতরে যাচ্ছি।</span></p>
    </div>
  </div>
</div>

<div class="merke">ছবিটাকে জিজ্ঞেস করো: কিছু কি কোনো জায়গার দিকে যাচ্ছে?
যাচ্ছে মানে <span lang="de">Akkusativ</span>। থেমে আছে মানে
<span lang="de">Dativ</span>।</div>
`,

perfekt: `
<p>এই Teil-টা এই স্তরের কেন্দ্র। এটা পারলে তুমি গতকালের কথা বলতে পারবে, আর
গতকালের কথা বলতে পারা মানে তোমার একটা অতীত তৈরি হলো, যেটার উপরে বাকি সবকিছু
দাঁড়াবে।</p>

<p>আর গঠনটা? তোমার পুরনো বন্ধু। বন্ধনী।</p>

<h2>যা আসলে ঘটছে</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Ich <b>habe</b> Reis <b>gekocht</b>.</span></p>
  <p class="muster-why"><span lang="de">haben</span> (বা <span lang="de">sein</span>)
  বসে আসন-দুইয়ে, আর <span lang="de">ge</span>-শব্দটা যায় একদম শেষে।</p>
  <p class="muster-tipp">আসন-দুই আর শেষ-আসন: সেই একই খিলান, যেটা তুমি
  <span lang="de">möchte … lernen</span> আর <span lang="de">stehe … auf</span>-এ
  পার হয়ে এসেছো।</p>
</div>

<p>বইয়ে আরেকটা অতীত আছে (<span lang="de">Präteritum</span>), সেটা
<a href="/deutsch/stufe-3/praeteritum.html">স্তর ৩-এ</a>। মুখের অতীত এটাই, আর
আমরা মুখেরটাই আগে শিখবো।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich habe Reis gekocht.</b><span>আমি ভাত রান্না করেছি।</span></p>
  <p class="satz"><b lang="de">Ich habe Deutsch gelernt.</b><span>আমি জার্মান পড়েছি।</span></p>
  <p class="satz"><b lang="de">Wir haben Fisch gegessen.</b><span>আমরা মাছ খেয়েছি।</span></p>
  <p class="satz"><b lang="de">Sie hat Wasser getrunken.</b><span>সে পানি খেয়েছে।</span></p>
  <p class="satz"><b lang="de">Was hast du gemacht?</b><span>তুমি কী করেছো?</span></p>
  <p class="satz"><b lang="de">Ich habe dich angerufen!</b><span>আমি তোমাকে ফোন করেছিলাম!</span></p>
</div>

<h2><span lang="de">ge</span>-শব্দ বানানোর কারখানা</h2>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>দল</th><th>নিয়ম</th><th lang="de">Beispiele</th></tr></thead>
  <tbody>
    <tr><td>নিয়মিত</td><td lang="de">ge + মূল + t</td>
        <td lang="de">machen → gemacht · lernen → gelernt · kaufen → gekauft · spielen → gespielt</td></tr>
    <tr><td>অনিয়মিত</td><td lang="de">ge + বদল + en</td>
        <td lang="de">essen → gegessen · trinken → getrunken · sehen → gesehen · schreiben → geschrieben</td></tr>
    <tr><td>কাতাপল্ট</td><td>উপসর্গ + <span lang="de">ge</span> + বাকিটা</td>
        <td lang="de">aufstehen → aufgestanden · einkaufen → eingekauft · anrufen → angerufen</td></tr>
    <tr><td lang="de">-ieren · be- · ver-</td><td><span lang="de">ge</span> নেই!</td>
        <td lang="de">studieren → studiert · besuchen → besucht · verstehen → verstanden</td></tr>
  </tbody>
</table>
</div>

<div class="merke">টুপি-নিয়মের নতুন সংস্করণ: ক্রিয়া আর কখনো একা শিখবে না।
জোড়ায় শিখবে, ঠিক <span lang="de">der Tisch</span>-এর মতো:
<b lang="de">essen–gegessen</b>।</div>

<p>আজকের দশ জোড়া, গানের মতো জোরে:</p>

<div class="verb-gitter">
  <span><b lang="de">machen</b> gemacht</span>
  <span><b lang="de">lernen</b> gelernt</span>
  <span><b lang="de">kochen</b> gekocht</span>
  <span><b lang="de">kaufen</b> gekauft</span>
  <span><b lang="de">spielen</b> gespielt</span>
  <span><b lang="de">essen</b> gegessen</span>
  <span><b lang="de">trinken</b> getrunken</span>
  <span><b lang="de">sehen</b> gesehen</span>
  <span><b lang="de">lesen</b> gelesen</span>
  <span><b lang="de">sprechen</b> gesprochen</span>
</div>

<h2><span lang="de">haben</span> না <span lang="de">sein</span>?</h2>

<p>একটাই কঠিন প্রশ্ন, আর তার একটাই সহজ পরীক্ষা: শরীরটা কি এক জায়গা থেকে আরেক
জায়গায় গেছে? গেলে <span lang="de">sein</span>, নাহলে <span lang="de">haben</span>।</p>

<div class="split">
  <div class="do">
    <h5><span lang="de">haben</span> · বেশিরভাগ</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich habe gegessen.</b><span>খেয়েছি।</span></p>
      <p class="satz"><b lang="de">Ich habe ein Buch gelesen.</b><span>একটা বই পড়েছি।</span></p>
      <p class="satz"><b lang="de">Wir haben Cricket gespielt.</b><span>ক্রিকেট খেলেছি।</span></p>
      <p class="satz"><b lang="de">Sie hat viel gearbeitet.</b><span>সে অনেক কাজ করেছে।</span></p>
      <p class="satz"><b lang="de">Er hat nichts gesagt.</b><span>সে কিছু বলেনি।</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">sein</span> · গতি ও বদল</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich bin gegangen.</b><span>গিয়েছি।</span></p>
      <p class="satz"><b lang="de">Sie ist gekommen.</b><span>সে এসেছে।</span></p>
      <p class="satz"><b lang="de">Wir sind nach Dhaka gefahren.</b><span>ঢাকায় গিয়েছি।</span></p>
      <p class="satz"><b lang="de">Ich bin um sechs aufgestanden.</b><span>ছয়টায় উঠেছি।</span></p>
      <p class="satz"><b lang="de">Er ist zu Hause geblieben.</b><span>সে বাসায় থেকেছে।</span></p>
    </div>
  </div>
</div>

<div class="merke warn">দুই বিখ্যাত ব্যতিক্রম: <span lang="de">bleiben</span> (থাকা)
আর <span lang="de">passieren</span> (ঘটা)। কেউ নড়ে না, তবু দুটোই
<span lang="de">sein</span> নেয়। <span lang="de">Was ist passiert?</span></div>

<h2><span lang="de">war</span> আর <span lang="de">hatte</span></h2>

<p>দুটো শব্দ, বিরাট লাভ। <span lang="de">sein</span> আর
<span lang="de">haben</span>-এর অতীতে কেউ <span lang="de">Perfekt</span> বলে না,
সবাই সোজা <span lang="de">war</span> আর <span lang="de">hatte</span> বলে।</p>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>কে</th><th lang="de">war</th><th lang="de">hatte</th><th lang="de">Beispiel</th></tr></thead>
  <tbody>
    <tr><td lang="de">ich</td><td lang="de"><b>war</b></td><td lang="de"><b>hatte</b></td>
        <td lang="de">Ich war müde. Ich hatte Hunger.</td></tr>
    <tr><td lang="de">du</td><td lang="de">warst</td><td lang="de">hattest</td>
        <td lang="de">Wo warst du?</td></tr>
    <tr><td lang="de">er / sie / es</td><td lang="de"><b>war</b></td><td lang="de"><b>hatte</b></td>
        <td lang="de">Sie hatte keine Zeit.</td></tr>
    <tr><td lang="de">wir</td><td lang="de">waren</td><td lang="de">hatten</td>
        <td lang="de">Wir waren zu Hause.</td></tr>
    <tr><td lang="de">ihr</td><td lang="de">wart</td><td lang="de">hattet</td>
        <td lang="de">Wart ihr in der Schule?</td></tr>
    <tr><td lang="de">sie / Sie</td><td lang="de">waren</td><td lang="de">hatten</td>
        <td lang="de">Sie hatten Angst.</td></tr>
  </tbody>
</table>
</div>

<div class="merke"><span lang="de">ich</span> আর
<span lang="de">er/sie/es</span> একই চেহারা, ঠিক modal-দের মতো।
আর <span lang="de">Der Tag war schön. Ich hatte keine Zeit.</span>: এই দুই শব্দই
অতীত নিয়ে সব আড্ডার অর্ধেকটা টেনে নেয়।</div>

<p>আজ থেকে রোজ রাতের <span lang="de">Mein Gestern</span>-এর শেষ লাইনটা এভাবে হোক:
<span lang="de">Der Tag war gut.</span></p>
`,

/* ------------------------------------------------------------
   কারণ, তুলনা, আদেশ
   ------------------------------------------------------------ */

nebensatz: `
<p>জার্মান শেখা ইংরেজিভাষীরা এই জায়গাটায় বছরের পর বছর কষ্ট পায়। তুমি পাবে না।</p>

<p>কারণ এই দেয়ালটার চাবি তোমার জন্মগত।</p>

<h2>ক্রিয়া বাড়ি ফেরে</h2>

<p>মূল বাক্যে ক্রিয়া আসন-দুইয়ে। কিন্তু <span lang="de">weil</span>,
<span lang="de">dass</span> বা <span lang="de">wenn</span>-এর পরে ক্রিয়া হেঁটে
চলে যায় নিজের অংশের একদম শেষে।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Ich bleibe zu Hause, weil ich müde <b>bin</b>.</span></p>
  <p class="muster-why">শোনো তো, এটা কার মতো শোনাচ্ছে? বাংলা বলে:
  'আমি বাসায় থাকছি, কারণ আমি ক্লান্ত<b>।</b>' ক্রিয়াটা শেষেই।</p>
  <p class="muster-tipp">সারাজীবন তুমি ক্রিয়া শেষে বসিয়ে এসেছো। এই দেয়ালের
  চাবিটা তোমার হাতেই ধরা ছিল।</p>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">…, weil ich müde bin.</b><span>কারণ আমি ক্লান্ত।</span></p>
  <p class="satz"><b lang="de">…, weil ich keine Zeit habe.</b><span>কারণ আমার সময় নেই।</span></p>
  <p class="satz"><b lang="de">…, weil es wichtig ist.</b><span>কারণ এটা জরুরি।</span></p>
  <p class="satz"><b lang="de">…, weil ich Deutsch lernen möchte.</b><span>modal-ও শেষে যায়।</span></p>
  <p class="satz"><b lang="de">…, weil ich früh aufstehe.</b><span>কাতাপল্ট জোড়া লেগে যায়।</span></p>
  <p class="satz"><b lang="de">…, weil ich gestern gearbeitet habe.</b><span>Perfekt-এ habe একদম শেষে।</span></p>
</div>

<div class="merke">শেষ দুটো লাইন ভালো করে দেখো। কাতাপল্ট এখানে ভাঙে না, আর
<span lang="de">Perfekt</span>-এ <span lang="de">habe</span> চলে যায়
<span lang="de">ge</span>-শব্দেরও পরে। যা কিছু ক্রিয়া, সব শেষে জড়ো হয়।</div>

<h2><span lang="de">dass</span> আর <span lang="de">wenn</span>: একই সুর</h2>

<div class="split">
  <div class="do">
    <h5><span lang="de">dass</span> · যে</h5>
    <p class="muster-why">মতামতের দরজা।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich denke, dass Deutsch schön ist.</b><span>আমার মনে হয় জার্মান সুন্দর।</span></p>
      <p class="satz"><b lang="de">Ich glaube, dass du das kannst.</b><span>আমি বিশ্বাস করি তুমি পারবে।</span></p>
      <p class="satz"><b lang="de">Ich weiß, dass es schwer ist.</b><span>জানি এটা কঠিন।</span></p>
      <p class="satz"><b lang="de">Sie sagt, dass sie kommt.</b><span>সে বলছে যে আসবে।</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">wenn</span> · যখন, যদি</h5>
    <p class="muster-why">আগে এলে একটা সেতু তৈরি হয়।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Wenn ich Zeit habe, lese ich.</b><span>সময় থাকলে পড়ি।</span></p>
      <p class="satz"><b lang="de">Wenn es regnet, bleibe ich zu Hause.</b><span>বৃষ্টি হলে বাসায় থাকি।</span></p>
      <p class="satz"><b lang="de">Wenn du willst, helfe ich dir.</b><span>চাইলে সাহায্য করবো।</span></p>
      <p class="satz"><b lang="de">Ich lese, wenn ich Zeit habe.</b><span>উল্টে বললেও ঠিক।</span></p>
    </div>
  </div>
</div>

<div class="merke"><span lang="de">Wenn ich Zeit <b>habe</b>, <b>lese</b> ich</span>:
দুটো ক্রিয়া কমার দুই পাশে মুখোমুখি দাঁড়ায়। এই সেতুটা একবার চোখে পড়লে আর
ভুলবে না।</div>

<h2>তিন পরিবার</h2>

<p>জোড়া দেওয়ার শব্দ তিন রকম হয়, আর কোনটা কোন পরিবারের সেটাই ঠিক করে ক্রিয়া
কোথায় বসবে।</p>

<div class="table-scroll">
<table class="platz-tabelle">
  <thead><tr><th>পরিবার</th><th>সদস্য</th><th>উদাহরণ</th><th>ক্রিয়া কোথায়</th></tr></thead>
  <tbody>
    <tr><td>শেষে পাঠায়</td><td lang="de">weil · dass · wenn</td>
        <td lang="de">Ich bleibe, weil es regnet.</td>
        <td>অংশের শেষে</td></tr>
    <tr><td>শূন্য আসন</td><td lang="de">und · aber · oder · denn</td>
        <td lang="de">Ich bleibe, denn es regnet.</td>
        <td>স্বাভাবিক, কিছুই বদলায় না</td></tr>
    <tr><td>আসন-এক নেয়</td><td lang="de">deshalb · dann · heute</td>
        <td lang="de">Es regnet, deshalb bleibe ich.</td>
        <td>আসন-দুইয়ে (সিসো)</td></tr>
  </tbody>
</table>
</div>

<p><span lang="de">denn</span> হলো <span lang="de">weil</span>-এর সহজ ভাই: একই মানে,
কিন্তু কিছুই নাড়াচাড়া করতে হয় না। আটকে গেলে <span lang="de">denn</span> বলো,
তারপর ধীরে ধীরে <span lang="de">weil</span>-এ যাও।</p>

<div class="merke">আজকের আসল খেলা: একই ঘটনা তিন স্বাদে বলো।
<span lang="de">weil</span> দিয়ে, <span lang="de">denn</span> দিয়ে, আর
<span lang="de">deshalb</span> দিয়ে।</div>

<div class="merke warn">সবচেয়ে বেশি হওয়া ভুল:
<span lang="de">weil ich <b>bin</b> müde</span> নয়,
<span lang="de">weil ich müde <b>bin</b></span>। বাংলায় ভাবো, তারপর বলো।
তোমার মাতৃভাষাই এখানে শিক্ষক।</div>
`,

komparativ: `
<p>তুলনা করার ব্যাকরণ, যেটা আসলে রুচি আর পছন্দের ব্যাকরণ। আর সুখবর: ইংরেজির
চেয়ে সহজ, কারণ জার্মানে <i>more beautiful</i> বলে কিছু নেই। সব
<span lang="de">-er</span>।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape">বিশেষণ + <b lang="de">-er</b> + <b lang="de">als</b>
  &nbsp;·&nbsp; চূড়ায় <b lang="de">am</b> + <b lang="de">-sten</b></p>
  <p class="muster-why"><span lang="de">Dhaka ist größer als Gazipur.</span>
  ছোট শব্দে প্রায়ই উমলাউট এসে যায়: a → ä, o → ö, u → ü।</p>
</div>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>সাধারণ</th><th>আরও (<span lang="de">-er</span>)</th>
      <th>সবচেয়ে (<span lang="de">am -sten</span>)</th><th lang="de">Beispiel</th></tr></thead>
  <tbody>
    <tr><td lang="de">klein <i>(ছোট)</i></td><td lang="de">kleiner</td><td lang="de">am kleinsten</td>
        <td lang="de">Mein Zimmer ist kleiner als deins.</td></tr>
    <tr><td lang="de">groß <i>(বড়)</i></td><td lang="de">größer</td><td lang="de">am größten</td>
        <td lang="de">Dhaka ist größer als Gazipur.</td></tr>
    <tr><td lang="de">jung <i>(অল্পবয়সী)</i></td><td lang="de">jünger</td><td lang="de">am jüngsten</td>
        <td lang="de">Ich bin jünger als mein Bruder.</td></tr>
    <tr><td lang="de">alt <i>(বুড়ো)</i></td><td lang="de">älter</td><td lang="de">am ältesten</td>
        <td lang="de">Mein Vater ist älter als meine Mutter.</td></tr>
    <tr><td lang="de">gut <i>(ভালো)</i></td><td lang="de"><b>besser</b></td><td lang="de">am besten</td>
        <td lang="de">Übung ist besser als Angst.</td></tr>
    <tr><td lang="de">viel <i>(বেশি)</i></td><td lang="de"><b>mehr</b></td><td lang="de">am meisten</td>
        <td lang="de">Ich lerne mehr als früher.</td></tr>
    <tr><td lang="de">gern <i>(পছন্দে)</i></td><td lang="de"><b>lieber</b></td><td lang="de">am liebsten</td>
        <td lang="de">Ich trinke lieber Tee als Kaffee.</td></tr>
  </tbody>
</table>
</div>

<div class="merke warn">তুলনায় <span lang="de"><b>als</b></span>, কখনোই
<span lang="de">wie</span> নয়। <span lang="de">größer als</span>,
<span lang="de">besser als</span>।</div>

<h2>রুচির মেশিন</h2>

<p>তিনটা শব্দ, আর এদের দিয়ে পছন্দের সব কথা বলা যায়।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich esse gern Reis.</b><span>ভাত খেতে ভালো লাগে।</span></p>
  <p class="satz"><b lang="de">Ich esse lieber Fisch.</b><span>মাছ বেশি ভালো লাগে।</span></p>
  <p class="satz"><b lang="de">Am liebsten esse ich Mangos!</b><span>সবচেয়ে ভালো লাগে আম!</span></p>
  <p class="satz"><b lang="de">Was trinkst du lieber, Tee oder Kaffee?</b><span>কোনটা বেশি পছন্দ, চা না কফি?</span></p>
</div>

<h2>নিজের জগৎ তুলনা করো</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">Deutsch ist schwerer als Englisch, aber schöner.</b><span>জার্মান ইংরেজির চেয়ে কঠিন, কিন্তু সুন্দর।</span></p>
  <p class="satz"><b lang="de">Heute ist besser als gestern.</b><span>আজ কালকের চেয়ে ভালো।</span></p>
  <p class="satz"><b lang="de">Tee ist besser als Kaffee, finde ich.</b><span>আমার মতে চা কফির চেয়ে ভালো।</span></p>
  <p class="satz"><b lang="de">Mein Dorf ist schöner als die Stadt.</b><span>আমার গ্রাম শহরের চেয়ে সুন্দর।</span></p>
</div>

<div class="merke">শেষ বাক্যটা খেয়াল করো: <span lang="de">finde ich</span> পিছনে
বসিয়ে দিলে যেকোনো তুলনা মতামত হয়ে যায়, আর মতামত নিয়ে কেউ তর্ক করে না।</div>
`,

imperativ: `
<p>আদেশ, অনুরোধ আর আমন্ত্রণ: একসাথে কিছু করার ব্যাকরণ। জার্মানে এটা এত সহজ যে
প্রায় অন্যায় মনে হয়, কারণ কাজটা মূলত জিনিস ফেলে দেওয়া।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Du kommst</span> →
  <span lang="de"><b>Komm!</b></span></p>
  <p class="muster-why"><span lang="de">du</span> ফেলে দাও,
  <span lang="de">-st</span> ফেলে দাও। যা থাকে, সেটাই আদেশ।</p>
  <p class="muster-tipp">আর সঙ্গে <span lang="de">bitte</span> জুড়ে দাও: তাতে
  আদেশও অনুরোধ হয়ে যায়।</p>
</div>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>কাকে</th><th>গঠন</th><th lang="de">Beispiele</th></tr></thead>
  <tbody>
    <tr><td lang="de">du <i>(তুমি)</i></td><td>ক্রিয়ার মূল, <span lang="de">du</span> নেই</td>
        <td lang="de">Komm! · Trink Wasser! · Schlaf gut! · Hilf mir, bitte!</td></tr>
    <tr><td lang="de">du</td><td>রূপবদল থাকলে e → i / ie থাকে</td>
        <td lang="de">Iss! · Sprich langsam! · Lies das!</td></tr>
    <tr><td lang="de">ihr <i>(তোমরা)</i></td><td><span lang="de">ihr</span>-রূপ, <span lang="de">ihr</span> নেই</td>
        <td lang="de">Kommt! · Esst! · Hört zu!</td></tr>
    <tr><td lang="de">Sie <i>(আপনি)</i></td><td>ক্রিয়া + <span lang="de">Sie</span></td>
        <td lang="de">Kommen Sie bitte! · Sprechen Sie langsam, bitte!</td></tr>
    <tr><td>আমরা-প্রস্তাব</td><td lang="de">Lass uns … / Wollen wir …?</td>
        <td lang="de">Lass uns Deutsch sprechen! · Wollen wir essen?</td></tr>
  </tbody>
</table>
</div>

<div class="merke warn">একটা সূক্ষ্ম জিনিস: e → i বদল থেকে যায়
(<span lang="de">Iss! Sprich!</span>), কিন্তু a → ä বদল উধাও হয়ে যায়:
<span lang="de">Schlaf!</span>, <span lang="de">Fahr!</span>, কোনো উমলাউট নেই।</div>

<h2>কাতাপল্ট এখানেও ওড়ে</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">Mach die Tür zu!</b><span>দরজাটা বন্ধ করো!</span></p>
  <p class="satz"><b lang="de">Mach das Fenster auf!</b><span>জানালাটা খোলো!</span></p>
  <p class="satz"><b lang="de">Hör zu!</b><span>শোনো!</span></p>
  <p class="satz"><b lang="de">Ruf mich an!</b><span>আমাকে ফোন কোরো!</span></p>
</div>

<h2>যেগুলো তুমি আধা-চেনো</h2>

<p>এই অনুরোধগুলো তোমার দরকার হবে প্রথম দিন থেকেই, আর কয়েকটা স্তর ১-এ দেখেছোও।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Langsam, bitte!</b><span>একটু আস্তে, প্লিজ!</span></p>
  <p class="satz"><b lang="de">Wiederholen Sie, bitte.</b><span>আরেকবার বলুন, প্লিজ।</span></p>
  <p class="satz"><b lang="de">Hilf mir, bitte!</b><span>আমাকে একটু সাহায্য করো!</span></p>
  <p class="satz"><b lang="de">Warte kurz!</b><span>একটু দাঁড়াও!</span></p>
  <p class="satz"><b lang="de">Komm mit!</b><span>সাথে চলো!</span></p>
  <p class="satz"><b lang="de">Lass uns zusammen lernen!</b><span>চলো একসাথে পড়ি!</span></p>
</div>

<div class="merke"><span lang="de">Hilf mir!</span>: সেই
<a href="/deutsch/stufe-2/dativ.html">Dativ</a>-হৃদস্পন্দন মনে আছে?
<span lang="de">helfen</span> সবসময় <span lang="de">mir</span> নেয়, আদেশেও।</div>

<div class="merke"><span lang="de">Lass uns …</span> মানে 'চলো আমরা …', আর এটাই
বন্ধুত্বের ব্যাকরণ। রোজ একবার কাউকে বলো:
<span lang="de">Lass uns Deutsch sprechen!</span></div>
`,

wortstellung: `
<p>এই Teil-এ তিনটা ছোট মেশিন। কোনোটাই কঠিন নয়, কিন্তু তিনটাই সেই জিনিস যা একটা
শুদ্ধ বাক্যকে <i>জার্মান</i> শোনায়।</p>

<h2>এক: সময় আগে, জায়গা পরে</h2>

<p>ইংরেজি বলে <i>I'm going home today</i>: জায়গা আগে, সময় পরে। জার্মান ঠিক
উল্টোটা করে। আর মজার ব্যাপার, বাংলাও জার্মানের দলে।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Ich fahre <b>morgen</b> <b>mit dem Bus</b>
  <b>nach Dhaka</b>.</span></p>
  <p class="muster-why">কখন (<span lang="de">Zeit</span>) → কীভাবে
  (<span lang="de">Art</span>) → কোথায় (<span lang="de">Ort</span>)।</p>
  <p class="muster-tipp">বাংলা: 'আমি কাল বাসে ঢাকায় যাবো।' হুবহু একই ক্রম।
  আরেকটা ঘরের চাবি তোমার হাতেই।</p>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich fahre morgen mit dem Bus nach Dhaka.</b><span>আমি কাল বাসে ঢাকায় যাবো।</span></p>
  <p class="satz"><b lang="de">Ich koche heute Abend zu Hause.</b><span>আমি আজ সন্ধ্যায় বাসায় রান্না করবো।</span></p>
  <p class="satz"><b lang="de">Wir gehen am Freitag ins Kino.</b><span>আমরা শুক্রবারে সিনেমায় যাবো।</span></p>
</div>

<h2>দুই: <span lang="de">man</span></h2>

<p>'লোকে', 'সবাই', 'করা হয়': কে করছে সেটা যখন জরুরি নয়। জার্মানরা এটা অনবরত
ব্যবহার করে, আর এটা <span lang="de">er</span>-এর রূপ নেয়।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Man spricht hier Bangla.</b><span>এখানে বাংলা বলা হয়।</span></p>
  <p class="satz"><b lang="de">In Bangladesch isst man Reis mit Fisch.</b><span>বাংলাদেশে ভাত-মাছ খাওয়া হয়।</span></p>
  <p class="satz"><b lang="de">Wie sagt man das auf Deutsch?</b><span>এটা জার্মানে কীভাবে বলে?</span></p>
  <p class="satz"><b lang="de">Das macht man so.</b><span>এটা এভাবেই করে।</span></p>
  <p class="satz"><b lang="de">Man lernt nie aus!</b><span>শেখার শেষ নেই!</span></p>
</div>

<div class="merke"><span lang="de">Wie sagt man das auf Deutsch?</span>: এই এক
বাক্য তোমাকে যেকোনো আলাপে বাঁচিয়ে দেবে। আজই মুখস্থ করো।</div>

<h2>তিন: <span lang="de">es gibt</span></h2>

<p><a href="/deutsch/stufe-2/akkusativ.html">Akkusativ</a>-এ এর সাথে পরিচয় হয়েছে।
এখানে পুরোটা: যা 'আছে' বলবে, সেটা গ্রহীতার আসনে ঢোকে।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Es gibt einen Markt hier.</b><span>এখানে একটা বাজার আছে।</span></p>
  <p class="satz"><b lang="de">Es gibt keinen Tee mehr.</b><span>চা আর নেই।</span></p>
  <p class="satz"><b lang="de">Gibt es Fragen?</b><span>কোনো প্রশ্ন আছে?</span></p>
  <p class="satz"><b lang="de">Was gibt es zum Essen?</b><span>খাবারে কী আছে?</span></p>
  <p class="satz"><b lang="de">Es gibt viel zu lernen.</b><span>শেখার অনেক কিছু আছে।</span></p>
  <p class="satz"><b lang="de">Es gibt immer einen Weg.</b><span>পথ সবসময় একটা থাকে।</span></p>
</div>

<div class="merke">সিসোটা ভুলো না: সময়ের শব্দ সামনে আনলে ক্রিয়া আসন-দুইয়েই
থাকে, আর কর্তা পিছিয়ে যায়।
<span lang="de"><b>Heute</b> gehe ich früh schlafen.</span></div>
`,

/* ------------------------------------------------------------
   গল্প ও বাস্তব জীবন
   ------------------------------------------------------------ */

erzaehlen: `
<p>এতক্ষণে তোমার কাছে সব যন্ত্রাংশ আছে: <span lang="de">Perfekt</span>,
<span lang="de">Dativ</span>, <span lang="de">weil</span>, কাতাপল্ট। এই Teil-টা
যন্ত্রাংশ জোড়ার। একটা সুতো, পাঁচটা পুঁতি, আর গতকালটা গল্প হয়ে যায়।</p>

<h2>পাঁচটা পুঁতি</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">zuerst → dann → danach → später → am Ende</span></p>
  <p class="muster-why">প্রতিটা পুঁতি আসন-এক নেয়, তাই ক্রিয়া চলে আসে আসন-দুইয়ে।
  সেই সিসো, পাঁচবার।</p>
</div>

<div class="table-scroll">
<table class="platz-tabelle">
  <thead><tr><th>১ · পুঁতি</th><th>২ · ক্রিয়া</th><th>বাকি</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="de">Zuerst</td><td lang="de"><b>habe</b></td><td lang="de">ich Tee getrunken.</td>
        <td>প্রথমে চা খেয়েছি।</td></tr>
    <tr><td lang="de">Dann</td><td lang="de"><b>bin</b></td><td lang="de">ich zur Schule gegangen.</td>
        <td>তারপর স্কুলে গেছি।</td></tr>
    <tr><td lang="de">Danach</td><td lang="de"><b>habe</b></td><td lang="de">ich meiner Mutter geholfen.</td>
        <td>তার পরে মাকে সাহায্য করেছি।</td></tr>
    <tr><td lang="de">Später</td><td lang="de"><b>habe</b></td><td lang="de">ich ferngesehen.</td>
        <td>পরে টিভি দেখেছি।</td></tr>
    <tr><td lang="de">Am Ende</td><td lang="de"><b>war</b></td><td lang="de">ich müde, aber glücklich.</td>
        <td>শেষে ক্লান্ত ছিলাম, কিন্তু খুশি।</td></tr>
  </tbody>
</table>
</div>

<div class="merke"><span lang="de">danach</span> হলো
<span lang="de">dann</span>-এর ভদ্র ভাই। পরপর তিনটা
<span lang="de">dann</span> বললে গল্পটা শিশুর মতো শোনায়, তাই বদলে বদলে বলো।</div>

<h2><span lang="de">Mein Gestern</span>: ছয় লাইনে একটা দিন</h2>

<p>এই ছয় লাইনে এই স্তরের প্রায় সব হাতিয়ার আছে। জোরে পড়ো, তারপর নিজেরটা বানাও।
আজ থেকে এটাই রোজ রাতের ব্যায়াম।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Gestern bin ich um sechs Uhr aufgestanden.</b><span>sein + কাতাপল্ট-Partizip</span></p>
  <p class="satz"><b lang="de">Zuerst habe ich Tee getrunken und Brot gegessen.</b><span>haben + দুটো ge-শব্দ</span></p>
  <p class="satz"><b lang="de">Dann bin ich mit dem Bus zur Schule gefahren.</b><span>সময় → কীভাবে → কোথায়</span></p>
  <p class="satz"><b lang="de">Danach habe ich meiner Mutter geholfen, weil sie müde war.</b><span>Dativ + weil</span></p>
  <p class="satz"><b lang="de">Am Abend habe ich ein bisschen ferngesehen.</b><span>কাতাপল্ট-Partizip</span></p>
  <p class="satz"><b lang="de">Der Tag war lang, aber er war gut. Ich war stolz.</b><span>war দিয়ে অনুভূতিতে নামা</span></p>
</div>

<div class="merke">ছয় লাইন সমান একটা পুরো দিন। প্রতি রাতে এই ছাঁচে নিজের গতকাল
বলো, আর এক মাসের মধ্যে <span lang="de">Perfekt</span> তোমার মুখের ভাষা হয়ে যাবে।
এই কাজটার জন্যই <a href="/deutsch/stufe-2/arbeitsbuch.html">খাতার</a> প্রতিটা
পাতার নিচে টিক-বাক্সটা আছে।</div>

<h2>আজকের কাজ</h2>

<p>নিজের গতকালটা ছয় লাইনে বলো, না থেমে। তারপর ফোনে রেকর্ড করো, শোনো, আর কাল
আবার একই গল্প বলো। একই গল্প, আরও মসৃণ। এটাই পুরো পদ্ধতি।</p>
`,

satzbank: `
<p>ব্যাকরণ শেখা হলো। এবার সেই বাক্যগুলো, যেগুলো তুমি আসলে বলবে। চারটা তালিকা,
আর প্রতিটাই এই স্তরের হাতিয়ার দিয়ে বানানো।</p>

<h2><span lang="de">Pläne machen</span> · পরিকল্পনা ও দাওয়াত</h2>

<div class="split">
  <div class="do">
    <h5>প্রস্তাব দেওয়া</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Hast du am Samstag Zeit?</b><span>শনিবারে সময় আছে?</span></p>
      <p class="satz"><b lang="de">Wollen wir ins Kino gehen?</b><span>সিনেমায় যাবে নাকি?</span></p>
      <p class="satz"><b lang="de">Lass uns zusammen lernen!</b><span>চলো একসাথে পড়ি!</span></p>
      <p class="satz"><b lang="de">Passt es dir um drei?</b><span>তিনটায় তোমার সুবিধা হবে?</span></p>
      <p class="satz"><b lang="de">Ich rufe dich morgen an.</b><span>কাল তোমাকে ফোন করবো।</span></p>
      <p class="satz"><b lang="de">Bis Samstag dann!</b><span>তাহলে শনিবারে দেখা!</span></p>
    </div>
  </div>
  <div class="others">
    <h5>হ্যাঁ বা না বলা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ja, gern! Das passt mir gut.</b><span>হ্যাঁ, খুশি হয়ে! সুবিধাই হবে।</span></p>
      <p class="satz"><b lang="de">Gute Idee!</b><span>দারুণ বুদ্ধি!</span></p>
      <p class="satz"><b lang="de">Ich kann leider nicht, weil ich arbeiten muss.</b><span>পারছি না, কারণ কাজ করতে হবে।</span></p>
      <p class="satz"><b lang="de">Vielleicht am Sonntag?</b><span>রবিবারে হলে কেমন হয়?</span></p>
      <p class="satz"><b lang="de">Kein Problem, ein anderes Mal.</b><span>সমস্যা নেই, অন্য কোনোদিন।</span></p>
      <p class="satz"><b lang="de">Schade! Aber danke für die Einladung.</b><span>ইশ! তবু দাওয়াতের জন্য ধন্যবাদ।</span></p>
    </div>
  </div>
</div>

<div class="merke">না বলার সময় <span lang="de">weil</span> জুড়ে দাও। কারণসহ 'না'
কখনো রূঢ় শোনায় না, আর তুমি এখন কারণ দিতে পারো।</div>

<h2><span lang="de">Beim Arzt</span> · শরীর খারাপ</h2>

<div class="split">
  <div class="do">
    <h5>কী হয়েছে বলা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich bin krank.</b><span>আমি অসুস্থ।</span></p>
      <p class="satz"><b lang="de">Mir ist schlecht.</b><span>আমার খারাপ লাগছে। (Dativ)</span></p>
      <p class="satz"><b lang="de">Ich habe Kopfschmerzen.</b><span>মাথাব্যথা করছে।</span></p>
      <p class="satz"><b lang="de">Ich habe Fieber und Husten.</b><span>জ্বর আর কাশি আছে।</span></p>
      <p class="satz"><b lang="de">Mein Bauch tut weh.</b><span>পেট ব্যথা করছে।</span></p>
      <p class="satz"><b lang="de">Ich habe seit zwei Tagen Fieber.</b><span>দুই দিন ধরে জ্বর। (seit + বর্তমান)</span></p>
    </div>
  </div>
  <div class="others">
    <h5>সাহায্য চাওয়া</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich brauche einen Termin.</b><span>একটা অ্যাপয়েন্টমেন্ট দরকার।</span></p>
      <p class="satz"><b lang="de">Können Sie mir helfen?</b><span>আমাকে সাহায্য করতে পারবেন?</span></p>
      <p class="satz"><b lang="de">Was soll ich nehmen?</b><span>আমি কী খাবো (ওষুধ)?</span></p>
      <p class="satz"><b lang="de">Wie oft am Tag?</b><span>দিনে কয়বার?</span></p>
      <p class="satz"><b lang="de">Gute Besserung!</b><span>দ্রুত সুস্থ হও!</span></p>
      <p class="satz"><b lang="de">Mir geht es schon besser, danke.</b><span>এখন একটু ভালো লাগছে, ধন্যবাদ।</span></p>
    </div>
  </div>
</div>

<h2><span lang="de">Einkaufen</span> · কেনাকাটা</h2>

<div class="split">
  <div class="do">
    <h5>খোঁজা ও মাপা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich suche eine Jacke.</b><span>একটা জ্যাকেট খুঁজছি।</span></p>
      <p class="satz"><b lang="de">Welche Größe haben Sie?</b><span>আপনার কোন সাইজ?</span></p>
      <p class="satz"><b lang="de">Kann ich das anprobieren?</b><span>এটা পরে দেখতে পারি? (কাতাপল্ট)</span></p>
      <p class="satz"><b lang="de">Haben Sie das in Rot?</b><span>এটা লালে আছে?</span></p>
      <p class="satz"><b lang="de">Das ist mir zu groß.</b><span>এটা আমার জন্য বড়। (Dativ)</span></p>
      <p class="satz"><b lang="de">Das steht dir gut!</b><span>এটায় তোমাকে মানিয়েছে!</span></p>
    </div>
  </div>
  <div class="others">
    <h5>দাম ও সিদ্ধান্ত</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Wie viel kostet die Jacke?</b><span>জ্যাকেটটার দাম কত?</span></p>
      <p class="satz"><b lang="de">Das ist mir zu teuer.</b><span>এটা আমার জন্য বেশি দামি।</span></p>
      <p class="satz"><b lang="de">Gibt es etwas Billigeres?</b><span>আরেকটু সস্তা কিছু আছে?</span></p>
      <p class="satz"><b lang="de">Ich nehme es!</b><span>আমি এটা নিচ্ছি!</span></p>
      <p class="satz"><b lang="de">Ich schaue nur, danke.</b><span>শুধু দেখছি, ধন্যবাদ।</span></p>
      <p class="satz"><b lang="de">Kann ich mit Karte zahlen?</b><span>কার্ডে দিতে পারি?</span></p>
    </div>
  </div>
</div>

<h2><span lang="de">Meinung sagen</span> · মত জানানো</h2>

<div class="split">
  <div class="do">
    <h5>মত দেওয়া</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich finde, dass das gut ist.</b><span>আমার মতে এটা ভালো।</span></p>
      <p class="satz"><b lang="de">Ich glaube, dass du recht hast.</b><span>মনে হয় তুমি ঠিক।</span></p>
      <p class="satz"><b lang="de">Mir gefällt das, weil es einfach ist.</b><span>আমার ভালো লাগে, কারণ সহজ।</span></p>
      <p class="satz"><b lang="de">Ich bin nicht sicher.</b><span>আমি নিশ্চিত নই।</span></p>
      <p class="satz"><b lang="de">Wie findest du das?</b><span>তোমার কেমন লাগে?</span></p>
    </div>
  </div>
  <div class="others">
    <h5>একমত ও দ্বিমত</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Das stimmt!</b><span>ঠিক বলেছো!</span></p>
      <p class="satz"><b lang="de">Da bin ich einverstanden.</b><span>আমি একমত।</span></p>
      <p class="satz"><b lang="de">Das stimmt nicht ganz.</b><span>পুরোপুরি ঠিক নয়।</span></p>
      <p class="satz"><b lang="de">Ich sehe das anders.</b><span>আমি অন্যভাবে দেখি।</span></p>
      <p class="satz"><b lang="de">Interessant! Erzähl mehr.</b><span>মজার তো! আরও বলো।</span></p>
    </div>
  </div>
</div>

<div class="merke">খেয়াল করো, শেষ তালিকাটা পুরোটাই
<a href="/deutsch/stufe-2/nebensatz.html"><span lang="de">dass</span> আর
<span lang="de">weil</span></a> দিয়ে চলছে। ব্যাকরণটা এখানেই ফল দিচ্ছে।</div>
`,

sprechen: `
<p>এক বাক্য বলে থেমে যাওয়া আর এক মিনিট টানা বলা: এই দুটোর মধ্যে ব্যাকরণের কোনো
তফাত নেই। তফাতটা কাঠামোর। এই Teil-এ সেই কাঠামোটা।</p>

<h2>চার ধাপের উত্তর</h2>

<p>যেকোনো প্রশ্নের এক-মিনিটের উত্তর, চার ধাপে। প্রতিটা ধাপে এই স্তরের একটা করে
হাতিয়ার।</p>

<div class="table-scroll">
<table class="routine">
  <thead><tr><th>ধাপ</th><th>বাক্য</th><th>কী কাজে লাগছে</th></tr></thead>
  <tbody>
    <tr><td class="mono" lang="de">ALSO…</td>
        <td lang="de">Also, ich denke, dass Handys wichtig sind.</td>
        <td>শুরু আর অবস্থান। <span lang="de">Also</span> বলে ভাবার সময়টাও কিনে নিলে।</td></tr>
    <tr><td class="mono" lang="de">WEIL…</td>
        <td lang="de">…, weil man immer lernen kann.</td>
        <td>কারণ, ক্রিয়া শেষে। তোমার বাংলা-শক্তি।</td></tr>
    <tr><td class="mono" lang="de">ZUM BEISPIEL…</td>
        <td lang="de">Zum Beispiel lerne ich Deutsch mit dem Handy.</td>
        <td>উদাহরণ, নিজের জীবন থেকে। আসন-এক নিলো, তাই ক্রিয়া দুইয়ে।</td></tr>
    <tr><td class="mono" lang="de">ABER…</td>
        <td lang="de">Aber man spielt auch zu viel. Deshalb finde ich: wichtig, aber mit Pause!</td>
        <td>অন্য দিক আর উপসংহার, সিসো দিয়ে নামা।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">চার ধাপ গুণ পনেরো সেকেন্ড সমান এক মিনিট টানা জার্মান।
শব্দ খোঁজা নেই, নীরবতা নেই।</div>

<h2>আটকে গেলে: সারানোর কিট</h2>

<p>সবাই আটকায়। তফাতটা হলো, সাবলীল লোকেরা আটকে গেলে জার্মানেই আটকায়, চুপ করে
যায় না।</p>

<div class="split">
  <div class="do">
    <h5>সময় কেনা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Also… / Na ja…</b><span>আচ্ছা… / মানে…</span></p>
      <p class="satz"><b lang="de">Moment, bitte.</b><span>এক সেকেন্ড।</span></p>
      <p class="satz"><b lang="de">Gute Frage!</b><span>ভালো প্রশ্ন!</span></p>
      <p class="satz"><b lang="de">Wie soll ich sagen…</b><span>কীভাবে বলি…</span></p>
      <p class="satz"><b lang="de">Lass mich überlegen.</b><span>একটু ভাবতে দাও।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>নিজেকে সারানো</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Wie sagt man … auf Deutsch?</b><span>…টা জার্মানে কী বলে?</span></p>
      <p class="satz"><b lang="de">Ich habe das Wort vergessen.</b><span>শব্দটা ভুলে গেছি।</span></p>
      <p class="satz"><b lang="de">Es ist ein Ding für…</b><span>এটা একটা জিনিস, যেটা দিয়ে…</span></p>
      <p class="satz"><b lang="de">Ich meine…</b><span>মানে বলতে চাইছি…</span></p>
      <p class="satz"><b lang="de">Noch einmal, bitte?</b><span>আরেকবার বলবেন?</span></p>
    </div>
  </div>
</div>

<div class="merke"><span lang="de">Ich habe das Wort vergessen, es ist ein Ding
für…</span>: এই বাক্যটা দুর্বলতা নয়। এটাই সাবলীলতা, কারণ এটা বলার পরেও তুমি
জার্মানেই আছো।</div>

<h2>আজকের কাজ</h2>

<p>এই প্রশ্নগুলোর প্রতিটায় এক মিনিট, চার ধাপে। রেকর্ড করো, শোনো, কাল আবার।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Ist Tee besser als Kaffee?</b><span>চা কি কফির চেয়ে ভালো?</span></p>
  <p class="satz"><b lang="de">Stadt oder Dorf, wo ist das Leben besser?</b><span>শহর না গ্রাম?</span></p>
  <p class="satz"><b lang="de">Warum lernst du Deutsch?</b><span>তুমি জার্মান শিখছো কেন?</span></p>
  <p class="satz"><b lang="de">Was hast du gestern gemacht?</b><span>কাল কী করেছো?</span></p>
  <p class="satz"><b lang="de">Beschreib deine Familie.</b><span>নিজের পরিবারের কথা বলো।</span></p>
  <p class="satz"><b lang="de">Was möchtest du in fünf Jahren machen?</b><span>পাঁচ বছর পরে কী করতে চাও?</span></p>
</div>
`,

plan: `
<p>স্তর ১ ছিল ৩০ দিনের। এটা ৬০। এটা ভয় দেখানো নয়, সততা: কারক আর
<span lang="de">Perfekt</span>-এর শিকড় গজাতে সময় লাগে, আর তাড়াহুড়ো করলে
শিকড়টাই গজায় না।</p>

<h2>তিন সেতু, ষাট দিন</h2>

<div class="table-scroll">
<table class="karte">
  <thead><tr><th>দিন</th><th lang="de">Brücke</th><th lang="de">Fokus</th><th>যা পারবে</th></tr></thead>
  <tbody>
    <tr><td class="mono">১–২০</td><td lang="de">WER &amp; WEN</td>
        <td lang="de">Akkusativ · Possessiv · trennbare Verben</td>
        <td>কে কাকে কী, সঠিক কোটে। আর কাতাপল্ট সচল।</td></tr>
    <tr><td class="mono">২১–৪০</td><td lang="de">GEBEN &amp; GESTERN</td>
        <td lang="de">Dativ · Präpositionen · Perfekt · war/hatte</td>
        <td>কাকে দেওয়া হলো, আর গতকালের পুরো গল্প।</td></tr>
    <tr><td class="mono">৪১–৬০</td><td lang="de">DENKEN &amp; ERZÄHLEN</td>
        <td lang="de">weil · dass · wenn · Komparativ · Erzählen</td>
        <td>কারণসহ মত, তুলনা, আর এক মিনিট টানা কথা।</td></tr>
  </tbody>
</table>
</div>

<h2>রোজকার এক ঘণ্টা</h2>

<div class="table-scroll">
<table class="routine">
  <thead><tr><th>কত</th><th>কী</th><th>কেন</th></tr></thead>
  <tbody>
    <tr><td class="mono">১০ মি</td><td>গতকালের ছয় লাইন জোরে</td>
        <td>স্তর ১-এর warm-up, নতুন কাজে। এটাই এই স্তরের প্রধান ব্যায়াম।</td></tr>
    <tr><td class="mono">১৫ মি</td><td>নতুন <span lang="de">Muster</span> + নিজের ১০টা বাক্য</td>
        <td>ছাঁচ নাও, নিজের জীবন ঢালো। অন্যের বাক্য মনে থাকে না।</td></tr>
    <tr><td class="mono">১৫ মি</td><td lang="de">Sprechen: Mein Gestern রেকর্ড</td>
        <td>রেকর্ডিংগুলো রেখে দাও। ওগুলোই একমাত্র প্রমাণ যে তুমি এগোচ্ছো।</td></tr>
    <tr><td class="mono">১০ মি</td><td lang="de">Hören: Nicos Weg / Easy German</td>
        <td>দুটোই ফ্রি, আর ঠিক এই স্তরের জন্য বানানো।</td></tr>
    <tr><td class="mono">১০ মি</td><td>কার্ড: <span lang="de">Partizip</span>-জোড়া + টুপি</td>
        <td>নতুন সদস্য: <span lang="de">essen–gegessen</span> জোড়ার কার্ড, টুপি-কার্ডের পাশে।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">রোজ ১০ মিনিট শোনা সপ্তাহে ১ ঘণ্টার চেয়ে অনেক বেশি কাজের।
আর পুরো সপ্তাহ একই পর্ব শোনো: চেনা কণ্ঠ কানকে দ্রুত শেখায়, নতুনত্ব নয়।</div>

<p>এই মানচিত্রটাই <a href="/deutsch/stufe-2/arbeitsbuch.html">৬০ দিনের অনুশীলন
খাতা</a>, দিন ধরে ধরে সাজানো। রোজ একটা পাতা, আর প্রতিটা পাতার সেই একই পাঁচটা অংশ।</p>

<h2>ছয় নিয়ম</h2>

<p>স্তর ১-এর নিয়মগুলো বহাল আছে। এগুলো তার উপরে বসছে।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Erzähl jeden Abend dein Gestern.</b><span>রোজ রাতে গতকালের গল্প, Perfekt-এ।</span></p>
  <p class="satz"><b lang="de">Sammle Partizipien wie Hüte.</b><span>টুপির মতো Partizip জমাও, জোড়ায় জোড়ায়।</span></p>
  <p class="satz"><b lang="de">Ein weil-Satz pro Tag. Mindestens.</b><span>দিনে অন্তত একটা weil-বাক্য।</span></p>
  <p class="satz"><b lang="de">Hör echtes Deutsch: 10 Minuten täglich.</b><span>রোজ ১০ মিনিট আসল জার্মান।</span></p>
  <p class="satz"><b lang="de">Sprich in Absätzen, nicht in Sätzen.</b><span>এক বাক্যে থেমো না, অনুচ্ছেদ বানাও।</span></p>
  <p class="satz"><b lang="de">Ein Mensch pro Woche.</b><span>সপ্তাহে একজন সত্যিকারের মানুষের সাথে জার্মানে কথা।</span></p>
</div>

<h2>সাতটা ভুল আর তার ওষুধ</h2>

<div class="table-scroll">
<table class="paar-tabelle">
  <thead><tr><th>❌ যা বলবে</th><th>✅ যা ঠিক</th><th>কারণ</th></tr></thead>
  <tbody>
    <tr><td lang="de">…weil ich bin müde.</td><td lang="de">…weil ich müde bin.</td>
        <td><span lang="de">weil</span> ক্রিয়াকে শেষে পাঠায়, বাংলার মতোই।</td></tr>
    <tr><td lang="de">Ich habe gegessen Reis.</td><td lang="de">Ich habe Reis gegessen.</td>
        <td><span lang="de">ge</span>-শব্দ একদম শেষে। বন্ধনী।</td></tr>
    <tr><td lang="de">Ich sehe der Mann.</td><td lang="de">Ich sehe den Mann.</td>
        <td>নীল দল গ্রহীতা হলে <span lang="de">den</span>।</td></tr>
    <tr><td lang="de">Kannst du helfen mich?</td><td lang="de">Kannst du mir helfen?</td>
        <td><span lang="de">helfen</span> নেয় <span lang="de">Dativ</span>, আর ক্রিয়া শেষে।</td></tr>
    <tr><td lang="de">Ich habe seit 2 Jahren gelernt.</td><td lang="de">Ich lerne seit zwei Jahren.</td>
        <td>এখনো চলছে, তাই বর্তমান কাল।</td></tr>
    <tr><td lang="de">Ich aufstehe um sechs.</td><td lang="de">Ich stehe um sechs auf.</td>
        <td>কাতাপল্ট: উপসর্গ উড়ে গিয়ে শেষে পড়ে।</td></tr>
    <tr><td>(চুপ করে থাকা)</td><td lang="de">Wie sagt man das auf Deutsch?</td>
        <td>চুপ থাকাটাই একমাত্র আসল ভুল।</td></tr>
  </tbody>
</table>
</div>

<h2>যে দেয়ালগুলোয় ধাক্কা লাগবে</h2>

<p>আগে থেকে চেনা থাকলে ধাক্কাটা কম লাগে, আর দরজা খোঁজা যায়।</p>

<div class="split">
  <div class="do">
    <h5>যা মনে হবে</h5>
    <div class="satz-list">
      <p class="satz"><b>কারক মনে থাকে না, কথা আটকে যায়।</b><span>বলতে থাকো। ভুল কোটেও সবাই বোঝে।</span></p>
      <p class="satz"><b>Partizip খুঁজতে গিয়ে বাক্য হারাই।</b><span>আটকালে war বা hatte দিয়ে বলো, ওরা সবসময় কাজ করে।</span></p>
      <p class="satz"><b>weil-এ ক্রিয়া কোথায় যাবে ভুলে যাই।</b><span>বাংলায় ভাবো, তারপর বলো।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>ওষুধ</h5>
    <div class="satz-list">
      <p class="satz"><b>শুনলে সব দ্রুত লাগে।</b><span>একই ভিডিও পুরো সপ্তাহ। পুনরাবৃত্তি, নতুনত্ব নয়।</span></p>
      <p class="satz"><b>উন্নতি টের পাই না।</b><span>প্রথম দিনের রেকর্ডিংটা শোনো। প্রমাণ সেখানেই বসে আছে।</span></p>
      <p class="satz"><b>সময় পাই না।</b><span>দশ মিনিটও দিন। শূন্য দিনের চেয়ে দশ মিনিট অসীম গুণ বেশি।</span></p>
    </div>
  </div>
</div>

<div class="merke">প্রত্যেক শিক্ষার্থী প্রতিটা দেয়ালে ধাক্কা খায়। যারা শেষ পর্যন্ত
পৌঁছায়, তারা শুধু হাঁটা থামায়নি।</div>
`,

};
