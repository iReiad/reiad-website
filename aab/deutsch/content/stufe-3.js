/* ============================================================
   content/stufe-3.js: the text of Stufe 3.

   Keys match the Teil slugs in ../curriculum.js. Same house
   style as stufe-1.js; see that file's header for the rules.

   The thing that shapes every page here: this Stufe adds no
   weight, it polishes. Präteritum sits beside the Perfekt rather
   than replacing it, Konjunktiv II is haben and werden in a
   softer coat, and the relative clause is weil wearing a
   different hat. Two of the three walls open with a key from
   Bangla, and the third one forgives you. The pages say that
   plainly, because a learner who thinks the hard level has
   arrived will brace instead of speaking.
   ============================================================ */

export default {

/* ------------------------------------------------------------
   রঙিন গল্প
   ------------------------------------------------------------ */

praeteritum: `
<p>জার্মানে দুটো অতীত আছে, আর তারা কাজ ভাগ করে নিয়েছে। মুখের অতীত
(<a href="/deutsch/stufe-2/perfekt.html"><span lang="de">Perfekt</span></a>)
তোমার আছে। এবার বইয়ের অতীত।</p>

<h2>দুই অতীত, দুই কাজ</h2>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>কাল</th><th>কোথায় চলে</th><th>উদাহরণ</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>Perfekt</b></td>
        <td>মুখের অতীত: আড্ডা, মেসেজ, 'কী করলে?'</td>
        <td lang="de">Ich habe Reis gekocht.</td></tr>
    <tr><td lang="de"><b>Präteritum</b></td>
        <td>বইয়ের ও গল্পের অতীত: বই, খবর, রূপকথা, লম্বা বর্ণনা</td>
        <td lang="de">Sie ging in den Wald.</td></tr>
  </tbody>
</table>
</div>

<p>আর সুখবরটা হলো, সবচেয়ে জরুরি দুটো <span lang="de">Präteritum</span> তুমি
আগেই বলো: <span lang="de">war</span> আর <span lang="de">hatte</span>।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape">নিয়মিত: মূল + <b lang="de">-te</b> &nbsp;·&nbsp;
  অনিয়মিত: স্বর বদলায়</p>
  <p class="muster-why"><span lang="de">machen → machte</span>,
  <span lang="de">sagen → sagte</span>। আর
  <span lang="de">gehen → ging</span>, <span lang="de">kommen → kam</span>।</p>
  <p class="muster-tipp">এখানে <span lang="de">ich</span> আর
  <span lang="de">er/sie/es</span> যমজ, কোনো লেজ নেই:
  <span lang="de">ich ging, er ging</span>। একটা কম ভাবনা।</p>
</div>

<h2>গল্প শুরু হয়</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">Es war einmal ein Mädchen.</b><span>একদা এক মেয়ে ছিল।</span></p>
  <p class="satz"><b lang="de">Sie ging in den Wald.</b><span>সে বনে গেল।</span></p>
  <p class="satz"><b lang="de">Sie sah ein Haus.</b><span>সে একটা বাড়ি দেখল।</span></p>
  <p class="satz"><b lang="de">Sie machte die Tür auf.</b><span>সে দরজা খুলল।</span></p>
  <p class="satz"><b lang="de">Sie hatte Angst.</b><span>তার ভয় করছিল।</span></p>
  <p class="satz"><b lang="de">Sie sagte nichts.</b><span>সে কিছু বলল না।</span></p>
</div>

<div class="merke"><span lang="de">Es war einmal</span> মানে 'একদা'। এই তিন শব্দ
দিয়ে পৃথিবীর সব জার্মান রূপকথা শুরু হয়, আর আজ থেকে তোমার গল্পগুলোও।</div>

<h2>গল্পের ষোলোটা ক্রিয়া</h2>

<p>এই ষোলোটা জানলে যেকোনো কাহিনি বলা যায়। জোড়ায় শেখো, ঠিক
<span lang="de">Partizip</span>-এর মতো।</p>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th lang="de">Infinitiv</th><th lang="de">Präteritum</th><th>মানে</th>
      <th lang="de">Infinitiv</th><th lang="de">Präteritum</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="de">sein</td><td lang="de"><b>war</b></td><td>ছিল</td>
        <td lang="de">geben</td><td lang="de"><b>gab</b></td><td>দিল</td></tr>
    <tr><td lang="de">haben</td><td lang="de"><b>hatte</b></td><td>ছিল (কাছে)</td>
        <td lang="de">nehmen</td><td lang="de"><b>nahm</b></td><td>নিল</td></tr>
    <tr><td lang="de">gehen</td><td lang="de"><b>ging</b></td><td>গেল</td>
        <td lang="de">finden</td><td lang="de"><b>fand</b></td><td>পেল</td></tr>
    <tr><td lang="de">kommen</td><td lang="de"><b>kam</b></td><td>এল</td>
        <td lang="de">fragen</td><td lang="de"><b>fragte</b></td><td>জিজ্ঞেস করল</td></tr>
    <tr><td lang="de">sehen</td><td lang="de"><b>sah</b></td><td>দেখল</td>
        <td lang="de">denken</td><td lang="de"><b>dachte</b></td><td>ভাবল</td></tr>
    <tr><td lang="de">sagen</td><td lang="de"><b>sagte</b></td><td>বলল</td>
        <td lang="de">wissen</td><td lang="de"><b>wusste</b></td><td>জানত</td></tr>
    <tr><td lang="de">machen</td><td lang="de"><b>machte</b></td><td>করল</td>
        <td lang="de">stehen</td><td lang="de"><b>stand</b></td><td>দাঁড়াল</td></tr>
    <tr><td lang="de">werden</td><td lang="de"><b>wurde</b></td><td>হয়ে গেল</td>
        <td lang="de">können</td><td lang="de"><b>konnte</b></td><td>পারত</td></tr>
  </tbody>
</table>
</div>

<div class="merke">এই তালিকাটা <a href="/deutsch/stufe-3/arbeitsbuch.html">খাতার</a>
সামনের পাতায় তিন কলামে জমানোর জায়গা আছে:
<span lang="de">Infinitiv</span>, <span lang="de">Präteritum</span>,
<span lang="de">Partizip</span>। নতুন ক্রিয়া পেলে তিন রূপ একসাথে শেখো।</div>

<div class="merke warn">কখন কোনটা: বন্ধুকে বলো
<span lang="de">Ich habe gestern gekocht</span>
(<span lang="de">Perfekt</span>)। কিন্তু একটা গোটা গল্প বললে বা লিখলে
<span lang="de">Präteritum</span>। Perfekt দিয়ে লম্বা গল্প বলা যায়, শুধু
হাঁপিয়ে ওঠা শোনায়।</div>
`,

adjektive: `
<p>এটাই সেই দেয়াল, যেটার নাম শুনে লোকে জার্মান ছেড়ে দেয়। তাই শুরুতেই সবচেয়ে
জরুরি কথাটা বলে রাখি।</p>

<div class="merke">লেজ ভুল হলেও অর্থ কখনো নষ্ট হয় না।
<span lang="de">ein gut Mann</span> বললেও পৃথিবীর প্রতিটা জার্মান বুঝবে তুমি কী
বলছো। এটাই একমাত্র দেয়াল যেটা 'একটু ভুল' চলে। নিয়ম শিখবো, কিন্তু ভয় নয়।</div>

<h2>একটা প্রশ্নই সব ঠিক করে</h2>

<p>জার্মান প্রতিটা বিশেষ্য-দলে লিঙ্গ আর কারক একবারই চিহ্নিত করে। কাউকে টুপিটা
পরতেই হবে। পুরো নিয়মটা তাই একটা প্রশ্ন: টুপিটা কে পরেছে?</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">der gut<b>e</b> Mann</span> &nbsp;·&nbsp;
  <span lang="de">ein gut<b>er</b> Mann</span> &nbsp;·&nbsp;
  <span lang="de">gut<b>er</b> Kaffee</span></p>
  <p class="muster-why"><span lang="de">der</span> আগেই টুপি দেখাচ্ছে, তাই বিশেষণ
  শিথিল। <span lang="de">ein</span> অস্পষ্ট, তাই বিশেষণ নিজেই টুপি পরে।
  কোনো article না থাকলে বিশেষণই পুরো টুপি বহন করে।</p>
</div>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>সামনে কী আছে</th><th>বিশেষণ কী করে</th><th>উদাহরণ</th></tr></thead>
  <tbody>
    <tr><td lang="de">der · die · das · dem · den</td>
        <td>শিথিল হয়: সহজ কর্তায় <span lang="de">-e</span>, বাকি প্রায় সবখানে
        <span lang="de">-en</span></td>
        <td lang="de">der gute Mann · den guten Mann</td></tr>
    <tr><td lang="de">ein · kein · mein</td>
        <td>নিজে টুপি পরে: <span lang="de">-er</span>,
        <span lang="de">-es</span>, <span lang="de">-e</span></td>
        <td lang="de">ein guter Mann · ein gutes Kind</td></tr>
    <tr><td>কিছুই নেই</td>
        <td>পুরো টুপি বিশেষণের</td>
        <td lang="de">guter Kaffee · kaltes Wasser</td></tr>
  </tbody>
</table>
</div>

<h2>পাশাপাশি দেখো</h2>

<div class="split">
  <div class="do">
    <h5><span lang="de">der · die · das</span>-এর পরে</h5>
    <p class="muster-why">কর্তায় <span lang="de">-e</span>, বাকি সব
    <span lang="de">-en</span>।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Der alte Mann kommt.</b><span>কর্তা → -e</span></p>
      <p class="satz"><b lang="de">Ich sehe den alten Mann.</b><span>Akkusativ → -en</span></p>
      <p class="satz"><b lang="de">mit dem alten Mann</b><span>Dativ → -en</span></p>
      <p class="satz"><b lang="de">die kleine Katze</b><span>কর্তা → -e</span></p>
      <p class="satz"><b lang="de">Ich mag die kleine Katze.</b><span>die অটল, তাই -e থেকে যায়</span></p>
      <p class="satz"><b lang="de">im neuen Haus</b><span>das নতুন → -en</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">ein · mein · kein</span>-এর পরে</h5>
    <p class="muster-why">বিশেষণ নিজে টুপি পরে।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">ein alter Mann</b><span>পুংলিঙ্গ কর্তা → -er</span></p>
      <p class="satz"><b lang="de">ein kleines Kind</b><span>ক্লীবলিঙ্গ → -es</span></p>
      <p class="satz"><b lang="de">eine gute Idee</b><span>স্ত্রীলিঙ্গ → -e</span></p>
      <p class="satz"><b lang="de">mein neues Handy</b><span>→ -es</span></p>
      <p class="satz"><b lang="de">Ich habe einen guten Plan.</b><span>Akkusativ পুং → -en</span></p>
      <p class="satz"><b lang="de">keine schlechte Idee!</b><span>→ -e</span></p>
    </div>
  </div>
</div>

<div class="merke">নিরাপদ ডিফল্ট: <span lang="de">der/die/das</span>-এর পরে,
সহজ কর্তা ছাড়া, প্রায় সবসময় <span lang="de">-en</span>। আটকে গেলে
<span lang="de">-en</span> বলো। বেশিরভাগ সময় ঠিক হবে, আর ভুল হলেও কেউ থামবে না।</div>

<h2>রঙ দিয়ে বর্ণনা</h2>

<p>এই স্তরের একটা নিয়ম হলো: শুধু 'একটা বাড়ি' নয়, 'একটা পুরনো, ছোট, সুন্দর
বাড়ি'। বিশেষণই ছবি আঁকে।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich wohne in einem kleinen Haus.</b><span>আমি একটা ছোট বাড়িতে থাকি।</span></p>
  <p class="satz"><b lang="de">Sie hat lange, schwarze Haare.</b><span>তার লম্বা, কালো চুল।</span></p>
  <p class="satz"><b lang="de">Das war ein langer, harter Tag.</b><span>সেটা ছিল লম্বা, কঠিন একটা দিন।</span></p>
  <p class="satz"><b lang="de">Ich trinke gern heißen Tee.</b><span>গরম চা খেতে ভালো লাগে।</span></p>
</div>
`,

relativsatz: `
<p>তোমার তৃতীয় বিনামূল্যের উপহার। প্রথমটা ছিল
<a href="/deutsch/stufe-1/satzbau.html">ক্রিয়ার সাথে কর্তার মিল</a>, দ্বিতীয়টা
<a href="/deutsch/stufe-2/nebensatz.html"><span lang="de">weil</span></a>। এটা
তৃতীয়, আর এটাও বাংলা থেকেই আসছে।</p>

<h2>দুই ভাবনা, এক বাক্য</h2>

<p>তোমার কাছে দুটো তথ্য: 'লোকটা আমার মামা।' আর 'লোকটা আসছে।' জার্মান এদের জোড়ে
একটা সম্বন্ধ-শব্দ দিয়ে, আর যোগ-করা অংশের ক্রিয়া উড়ে যায় শেষে।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Der Mann, <b>der</b> kommt, ist mein Onkel.</span></p>
  <p class="muster-why">'লোকটা, যে আসছে, আমার মামা।' বাংলা ঠিক এই ছাঁচেই বলে,
  আর ক্রিয়াটা যে-অংশের শেষেই বসে।</p>
  <p class="muster-tipp">সূত্রটা সবসময় এক: কমা → সম্বন্ধ-শব্দ → … → ক্রিয়া শেষে।
  কমা আবার ফিরলে মূল বাক্য চলতে থাকে।</p>
</div>

<p>সম্বন্ধ-শব্দটা বিশেষ্যের গোত্র নকল করে, তাই নতুন কিছু মুখস্থ করার নেই।</p>

<div class="verb-gitter">
  <span><b lang="de">der Mann</b> → der</span>
  <span><b lang="de">die Frau</b> → die</span>
  <span><b lang="de">das Kind</b> → das</span>
  <span><b>বহুবচন</b> → die</span>
</div>

<h2>ক্রিয়া বাড়ি ফেরে</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">der Mann, der dort steht</b><span>যে লোকটা ওখানে দাঁড়িয়ে</span></p>
  <p class="satz"><b lang="de">die Frau, die Deutsch spricht</b><span>যে মহিলা জার্মান বলে</span></p>
  <p class="satz"><b lang="de">das Kind, das lacht</b><span>যে শিশুটা হাসছে</span></p>
  <p class="satz"><b lang="de">das Buch, das ich lese</b><span>যে বইটা আমি পড়ছি</span></p>
  <p class="satz"><b lang="de">die Leute, die hier wohnen</b><span>যে মানুষগুলো এখানে থাকে</span></p>
  <p class="satz"><b lang="de">der Tee, den ich mag</b><span>যে চা আমি পছন্দ করি (গ্রহীতা, তাই den)</span></p>
</div>

<h2>কোথায় বসাবে</h2>

<div class="split">
  <div class="do">
    <h5>শেষে বসানো · সহজতম</h5>
    <p class="muster-why">শুরুতে শুধু এটাই করো। সবচেয়ে স্বাভাবিকও এটাই।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich habe einen Freund, der Deutsch spricht.</b><span>আমার এক বন্ধু আছে, যে জার্মান বলে।</span></p>
      <p class="satz"><b lang="de">Das ist die Frau, die mir geholfen hat.</b><span>এই সেই মহিলা, যে আমাকে সাহায্য করেছিল।</span></p>
      <p class="satz"><b lang="de">Ich mag Menschen, die viel lachen.</b><span>আমি হাসিখুশি মানুষ পছন্দ করি।</span></p>
      <p class="satz"><b lang="de">Kennst du das Lied, das jetzt spielt?</b><span>এখন যে গানটা বাজছে, চেনো?</span></p>
    </div>
  </div>
  <div class="others">
    <h5>মাঝখানে বসানো · পরে</h5>
    <p class="muster-why">বিশেষ্যের ঠিক পরে, দুই কমার মাঝে।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Der Mann, der dort wohnt, ist nett.</b><span>যে লোকটা ওখানে থাকে, সে ভালো।</span></p>
      <p class="satz"><b lang="de">Die Frau, die ich kenne, ist Ärztin.</b><span>যে মহিলাকে আমি চিনি, তিনি ডাক্তার।</span></p>
      <p class="satz"><b lang="de">Das Buch, das du liest, ist gut.</b><span>যে বইটা তুমি পড়ছো, সেটা ভালো।</span></p>
      <p class="satz"><b lang="de">Die Stadt, in der ich wohne, ist groß.</b><span>যে শহরে আমি থাকি, সেটা বড়।</span></p>
    </div>
  </div>
</div>

<div class="merke">শেষ উদাহরণটা খেয়াল করো:
<span lang="de">in der</span>। আঠা-শব্দ সামনে এলে সম্বন্ধ-শব্দ তার কারক নেয়,
ঠিক যেভাবে <a href="/deutsch/stufe-2/praepositionen.html">স্তর ২-এ</a> শিখেছো।
নতুন নিয়ম নয়, পুরনো নিয়ম নতুন জায়গায়।</div>

<div class="merke warn">সবচেয়ে বেশি হওয়া ভুল:
<span lang="de">der Mann, der kommt nicht</span> নয়,
<span lang="de">der Mann, der nicht kommt</span>। সম্বন্ধ-অংশে ক্রিয়া একদম শেষে,
<span lang="de">nicht</span>-এরও পরে।</div>
`,

/* ------------------------------------------------------------
   স্বপ্ন ও ভদ্রতা
   ------------------------------------------------------------ */

konjunktiv: `
<p>এই Teil-টার নাম শুনে ভয় লাগতে পারে। লাগার দরকার নেই: এটা নতুন কাল নয়, শুধু
চেনা ক্রিয়ার একটা নরম কোট।</p>

<p>আর কাজটা তুমি রোজ বাংলায় করো: 'করতাম', 'পারতে?', 'ভালো হতো'।</p>

<h2>চারটা শব্দ</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><b lang="de">würde</b> করতাম &nbsp;·&nbsp;
  <b lang="de">könnte</b> পারতাম &nbsp;·&nbsp;
  <b lang="de">hätte</b> থাকত &nbsp;·&nbsp;
  <b lang="de">wäre</b> হতাম</p>
  <p class="muster-why">সত্যিকারের দরকার এই চারটাই। বাকি সব ক্রিয়ার জন্য
  <span lang="de">würde</span> + মূল ক্রিয়া (শেষে) বসিয়ে দাও।</p>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich würde gern helfen.</b><span>আমি সাহায্য করতে চাইতাম।</span></p>
  <p class="satz"><b lang="de">Könntest du das machen?</b><span>তুমি কি এটা করতে পারতে?</span></p>
  <p class="satz"><b lang="de">Ich hätte gern einen Tee.</b><span>আমি একটা চা চাইতাম। (ভদ্র অর্ডার)</span></p>
  <p class="satz"><b lang="de">Das wäre toll!</b><span>সেটা দারুণ হতো!</span></p>
  <p class="satz"><b lang="de">Wärst du so nett?</b><span>একটু দয়া করবে?</span></p>
</div>

<div class="merke">গোপন সূত্র: <span lang="de">würde</span> + মূল ক্রিয়া শেষে,
আর প্রায় যেকোনো ক্রিয়ার Konjunktiv তৈরি। আলাদা করে শুধু তিনটা শেখো:
<span lang="de">könnte</span>, <span lang="de">hätte</span>,
<span lang="de">wäre</span>।</div>

<h2>দুই কাজ, একই চার শব্দ</h2>

<div class="split">
  <div class="do">
    <h5>ভদ্রতা · <span lang="de">Höflichkeit</span></h5>
    <p class="muster-why">কড়া থেকে নরম।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Kannst du…? → Könntest du…?</b><span>পারবে? → পারতে?</span></p>
      <p class="satz"><b lang="de">Ich will… → Ich würde gern…</b><span>চাই → চাইতাম</span></p>
      <p class="satz"><b lang="de">Gib mir… → Könnte ich … haben?</b><span>দাও → পেতে পারি কি?</span></p>
      <p class="satz"><b lang="de">Ich hätte eine Frage.</b><span>আমার একটা প্রশ্ন ছিল।</span></p>
      <p class="satz"><b lang="de">Wären Sie so freundlich?</b><span>একটু দয়া করবেন?</span></p>
    </div>
  </div>
  <div class="others">
    <h5>স্বপ্ন · <span lang="de">Träume</span></h5>
    <p class="muster-why">যা সত্যি নয়, কিন্তু হতে পারত।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich würde gern nach Deutschland reisen.</b><span>জার্মানি যেতে চাইতাম।</span></p>
      <p class="satz"><b lang="de">Ich hätte gern mehr Zeit.</b><span>আরও সময় থাকলে ভালো হতো।</span></p>
      <p class="satz"><b lang="de">Das wäre mein Traum.</b><span>সেটাই আমার স্বপ্ন হতো।</span></p>
      <p class="satz"><b lang="de">Ich könnte den ganzen Tag lesen.</b><span>সারাদিন পড়তে পারতাম।</span></p>
      <p class="satz"><b lang="de">Wie schön wäre das!</b><span>কী সুন্দরই না হতো!</span></p>
    </div>
  </div>
</div>

<div class="merke"><span lang="de">Ich möchte</span> তুমি স্তর ১-এ শিখেছিলে।
এখন জেনে রাখো: <span lang="de">möchte</span> আসলে
<span lang="de">mögen</span>-এর Konjunktiv। মানে এই নরম কোটটা তুমি প্রথম দিন
থেকেই পরে আছো।</div>

<div class="merke warn">ফাঁদ: <span lang="de">Ich würde gehe</span> নয়,
<span lang="de">Ich würde <b>gehen</b></span>। <span lang="de">würde</span>-র পরে
সবসময় মূল রূপ, আর সেটা বাক্যের শেষে।</div>
`,

irreal: `
<p>গত Teil-এ চারটা নরম কোট শিখেছো। এবার পুরো স্বপ্ন-বাক্যটা: 'যদি সময় থাকত,
তাহলে পড়তাম।'</p>

<h2>দুই কোট, এক সেতু</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Wenn ich Zeit <b>hätte</b>,
  <b>würde</b> ich lesen.</span></p>
  <p class="muster-why"><span lang="de">wenn</span>-অংশে
  <span lang="de">hätte</span> বা <span lang="de">wäre</span>,
  <span lang="de">dann</span>-অংশে <span lang="de">würde</span> বা
  <span lang="de">könnte</span>।</p>
  <p class="muster-tipp"><span lang="de">wenn</span>-অংশ আগে এলে
  <span lang="de">dann</span>-ক্রিয়া নিজের অর্ধেকের সামনে লাফায়। সেই সিসো, আর
  এই চালটা তোমার চেনা।</p>
</div>

<div class="table-scroll">
<table class="platz-tabelle">
  <thead><tr><th lang="de">Wenn … <i>(যদি)</i></th><th lang="de">… dann <i>(তাহলে)</i></th>
      <th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="de">Wenn ich Zeit hätte,</td><td lang="de">würde ich mehr lesen.</td>
        <td>সময় থাকলে বেশি পড়তাম।</td></tr>
    <tr><td lang="de">Wenn ich reich wäre,</td><td lang="de">würde ich reisen.</td>
        <td>বড়লোক হলে ঘুরে বেড়াতাম।</td></tr>
    <tr><td lang="de">Wenn ich du wäre,</td><td lang="de">würde ich es machen.</td>
        <td>তোমার জায়গায় হলে করতাম।</td></tr>
    <tr><td lang="de">Wenn ich Deutsch könnte,</td><td lang="de">hätte ich keine Angst.</td>
        <td>জার্মান পারলে ভয় থাকত না।</td></tr>
    <tr><td lang="de">Wenn du Zeit hättest,</td><td lang="de">könnten wir zusammen lernen.</td>
        <td>তোমার সময় থাকলে একসাথে পড়তে পারতাম।</td></tr>
    <tr><td lang="de">Wenn das Wetter gut wäre,</td><td lang="de">würde ich rausgehen.</td>
        <td>আবহাওয়া ভালো হলে বাইরে যেতাম।</td></tr>
  </tbody>
</table>
</div>

<div class="merke warn">ফাঁদ: <span lang="de">Wenn ich hätte Zeit</span> নয়,
<span lang="de">Wenn ich Zeit <b>hätte</b></span>।
<span lang="de">wenn</span> মানেই ক্রিয়া শেষে, স্বপ্নেও।</div>

<h2>আজকের কাজ</h2>

<p>নিজের পাঁচটা সত্যিকারের স্বপ্ন এই ছাঁচে বলো, জোরে। সত্যি স্বপ্ন হলে বাক্যটা
মনে থাকে; বানানো উদাহরণ মনে থাকে না।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Wenn ich Geld hätte, würde ich ein Haus kaufen.</b><span>টাকা থাকলে একটা বাড়ি কিনতাম।</span></p>
  <p class="satz"><b lang="de">Wenn ich ein Vogel wäre, würde ich fliegen.</b><span>পাখি হলে উড়ে যেতাম।</span></p>
  <p class="satz"><b lang="de">Wenn ich in Deutschland wäre, würde ich jeden Tag Deutsch sprechen.</b><span>জার্মানিতে থাকলে রোজ জার্মান বলতাম।</span></p>
</div>
`,

futur: `
<p>ভবিষ্যতের ব্যাকরণ, আর তার সাথে একটা স্বস্তির খবর: জার্মানরা ভবিষ্যতের জন্য
বেশিরভাগ সময় ভবিষ্যৎ কালই ব্যবহার করে না।</p>

<h2>আবার সেই বন্ধনী</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Ich <b>werde</b> Deutsch <b>lernen</b>.</span></p>
  <p class="muster-why"><span lang="de">werden</span> বসে আসন-দুইয়ে, মূল ক্রিয়া
  যায় শেষে। এই খিলানটা তুমি এতবার পার হয়েছো যে আর গোনার দরকার নেই।</p>
  <p class="muster-tipp"><span lang="de">werden</span> চলে
  <span lang="de">sein</span>-এর মতো শেখো:
  <span lang="de">ich werde, du wirst, er wird</span>।</p>
</div>

<div class="split">
  <div class="do">
    <h5><span lang="de">Futur</span> · প্রতিশ্রুতি ও ভবিষ্যদ্বাণী</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich werde Deutsch lernen.</b><span>আমি জার্মান শিখব।</span></p>
      <p class="satz"><b lang="de">Es wird morgen regnen.</b><span>কাল বৃষ্টি হবে।</span></p>
      <p class="satz"><b lang="de">Wir werden uns wiedersehen.</b><span>আমরা আবার দেখা করব।</span></p>
      <p class="satz"><b lang="de">Das wird schwer werden.</b><span>এটা কঠিন হবে।</span></p>
      <p class="satz"><b lang="de">Ich werde es schaffen!</b><span>আমি পারবই!</span></p>
    </div>
  </div>
  <div class="others">
    <h5>রোজকার ভবিষ্যৎ · বর্তমান + সময়-শব্দ</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Morgen lerne ich Deutsch.</b><span>কাল জার্মান শিখব।</span></p>
      <p class="satz"><b lang="de">Nächste Woche fahre ich nach Dhaka.</b><span>সামনের সপ্তাহে ঢাকা যাব।</span></p>
      <p class="satz"><b lang="de">Heute Abend koche ich.</b><span>আজ সন্ধ্যায় রান্না করব।</span></p>
      <p class="satz"><b lang="de">Bald spreche ich fließend!</b><span>শিগগিরই সাবলীল বলব!</span></p>
      <p class="satz"><b lang="de">Ich habe vor, viel zu üben.</b><span>অনেক অনুশীলনের পরিকল্পনা আছে।</span></p>
    </div>
  </div>
</div>

<div class="merke">ডান কলামটাই রোজকার জার্মান।
<span lang="de">morgen</span>, <span lang="de">bald</span>,
<span lang="de">nächste Woche</span> বসিয়ে বর্তমান কালেই বলো।
<span lang="de">werden</span> তুলে রাখো জোর দেওয়া, প্রতিশ্রুতি আর ভবিষ্যদ্বাণীর
জন্য।</div>

<div class="merke warn">খেয়াল করো:
<span lang="de">Das wird schwer <b>werden</b></span>। এখানে
<span lang="de">werden</span> দুবার, একবার সাহায্যকারী হিসেবে আর একবার মূল
ক্রিয়া ('হওয়া') হিসেবে। অদ্ভুত দেখায়, কিন্তু ঠিক।</div>
`,

genitiv: `
<p>চতুর্থ ও শেষ কারক। আর সবচেয়ে ভালো খবরটা আগেই বলে রাখি: মুখের কথায়
জার্মানরা এটা প্রায়ই এড়িয়ে যায়।</p>

<h2>সম্বন্ধ দেখানোর কারক</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">das Auto <b>meines Vaters</b></span> = আমার বাবার গাড়ি</p>
  <p class="muster-why"><span lang="de">der</span> আর
  <span lang="de">das</span> হয়ে যায় <span lang="de">des</span>, আর শব্দটার
  শেষে একটা <span lang="de">s</span> বসে। <span lang="de">die</span> আর বহুবচন
  হয় <span lang="de">der</span>।</p>
  <p class="muster-tipp">খেয়াল করো, বাংলার মতো মালিক আগে নয়, পরে:
  'গাড়ি বাবার'।</p>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">das Auto meines Vaters</b><span>আমার বাবার গাড়ি</span></p>
  <p class="satz"><b lang="de">der Name meiner Mutter</b><span>আমার মায়ের নাম</span></p>
  <p class="satz"><b lang="de">die Farbe der Blume</b><span>ফুলের রঙ</span></p>
  <p class="satz"><b lang="de">das Ende der Geschichte</b><span>গল্পের শেষ</span></p>
  <p class="satz"><b lang="de">das Zentrum der Stadt</b><span>শহরের কেন্দ্র</span></p>
</div>

<h2>সান্ত্বনা: <span lang="de">von</span></h2>

<p>রোজকার কথায় জার্মানরা প্রায়ই <span lang="de">von</span> +
<span lang="de">Dativ</span> বলে ফেলে, আর সেটা পুরোপুরি ঠিক।</p>

<div class="table-scroll">
<table class="paar-tabelle">
  <thead><tr><th>লেখায় (<span lang="de">Genitiv</span>)</th>
      <th>মুখে (<span lang="de">von</span>)</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="de">das Auto meines Vaters</td><td lang="de">das Auto von meinem Vater</td>
        <td>আমার বাবার গাড়ি</td></tr>
    <tr><td lang="de">das Haus meines Freundes</td><td lang="de">das Haus von meinem Freund</td>
        <td>আমার বন্ধুর বাড়ি</td></tr>
  </tbody>
</table>
</div>

<div class="merke">তাই লক্ষ্যটা সহজ: পড়ার সময় <span lang="de">Genitiv</span>
চিনে নাও। বলার সময় <span lang="de">von</span> বললেই চলবে। এক কারক, প্রায় শূন্য
চাপ।</div>

<h2>দুটো আঠা-শব্দ যারা এটা টানে</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">wegen des Wetters</b><span>আবহাওয়ার কারণে</span></p>
  <p class="satz"><b lang="de">trotz des Regens</b><span>বৃষ্টি সত্ত্বেও</span></p>
  <p class="satz"><b lang="de">Trotz des Regens sind wir gegangen.</b><span>বৃষ্টি সত্ত্বেও আমরা গিয়েছিলাম।</span></p>
</div>

<p>এদের দেখলে চিনে নিও। মুখে <span lang="de">wegen dem Wetter</span> বললেও কেউ
কিছু বলবে না, যদিও ব্যাকরণের বই ভুরু কোঁচকাবে।</p>
`,

/* ------------------------------------------------------------
   বোঝানো ও পড়া
   ------------------------------------------------------------ */

konnektoren: `
<p>স্তর ২-এ তুমি <span lang="de">weil</span>, <span lang="de">denn</span> আর
<span lang="de">deshalb</span> শিখেছো, আর তিন পরিবারের নিয়মটাও। এই Teil-এ সেই
পরিবারগুলোয় নতুন সদস্য আসছে, আর তারাই তোমার কথাকে শিশুর বাক্য থেকে পরিণত
বাক্যে নিয়ে যাবে।</p>

<h2>চারটা নতুন জোড়</h2>

<div class="table-scroll">
<table class="platz-tabelle">
  <thead><tr><th>শব্দ</th><th>মানে</th><th>উদাহরণ</th><th>ক্রিয়া কোথায়</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>obwohl</b></td><td>যদিও</td>
        <td lang="de">Ich lerne, obwohl es schwer ist.</td>
        <td>শেষে (<span lang="de">weil</span>-পরিবার)</td></tr>
    <tr><td lang="de"><b>trotzdem</b></td><td>তবুও</td>
        <td lang="de">Es ist schwer. Trotzdem lerne ich.</td>
        <td>আসন-দুইয়ে (সিসো)</td></tr>
    <tr><td lang="de"><b>damit</b></td><td>যাতে</td>
        <td lang="de">Ich übe viel, damit ich fließend spreche.</td>
        <td>শেষে</td></tr>
    <tr><td lang="de"><b>deshalb</b></td><td>তাই</td>
        <td lang="de">Es ist wichtig, deshalb lerne ich es.</td>
        <td>আসন-দুইয়ে (সিসো)</td></tr>
  </tbody>
</table>
</div>

<div class="merke">নতুন নিয়ম শূন্য। <span lang="de">obwohl</span> আর
<span lang="de">damit</span> ক্রিয়াকে শেষে পাঠায়, ঠিক
<span lang="de">weil</span>-এর মতো। <span lang="de">trotzdem</span> আর
<span lang="de">deshalb</span> আসন-এক নেয়, ঠিক
<span lang="de">heute</span>-র মতো। সেই চেনা দুই পরিবার।</div>

<h2><span lang="de">obwohl</span>: মেনে নেওয়ার শব্দ</h2>

<p>এটাই এই স্তরের পরিণত চাল। কিছু একটা স্বীকার করে নিয়ে তারপর নিজের কথা বলা
তোমাকে জেদি নয়, ন্যায্য শোনায়।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich lerne, obwohl es schwer ist.</b><span>কঠিন হলেও আমি শিখি।</span></p>
  <p class="satz"><b lang="de">Ich arbeite, obwohl ich müde bin.</b><span>ক্লান্ত হলেও কাজ করি।</span></p>
  <p class="satz"><b lang="de">Obwohl es regnete, sind wir gegangen.</b><span>বৃষ্টি হলেও আমরা গিয়েছিলাম।</span></p>
</div>

<h2><span lang="de">damit</span>: লক্ষ্যের শব্দ</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich übe viel, damit ich fließend spreche.</b><span>অনেক অনুশীলন করি, যাতে সাবলীল বলি।</span></p>
  <p class="satz"><b lang="de">Ich stehe früh auf, damit ich Zeit habe.</b><span>আগে উঠি, যাতে সময় থাকে।</span></p>
  <p class="satz"><b lang="de">Sprich langsam, damit ich dich verstehe.</b><span>আস্তে বলো, যাতে আমি বুঝি।</span></p>
</div>

<h3>আরও একটা: <span lang="de">sowohl … als auch</span></h3>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich mag sowohl Tee als auch Kaffee.</b><span>চা আর কফি দুটোই পছন্দ করি।</span></p>
  <p class="satz"><b lang="de">Sie spricht sowohl Bangla als auch Deutsch.</b><span>সে বাংলা আর জার্মান দুটোই বলে।</span></p>
</div>

<div class="merke">আজকের খেলা: একটা সত্যি কথা নাও, আর চারভাবে বলো।
<span lang="de">weil</span> দিয়ে, <span lang="de">obwohl</span> দিয়ে,
<span lang="de">trotzdem</span> দিয়ে, আর <span lang="de">damit</span> দিয়ে।
একই ভাবনা, চার রকম সূক্ষ্মতা।</div>
`,

wortbildung: `
<p>লম্বা জার্মান শব্দ নিয়ে পৃথিবী জুড়ে ঠাট্টা হয়। ঠাট্টাটা ঠিক, কিন্তু ভয়টা
ভুল: লম্বা শব্দগুলো আসলে LEGO। টুকরো করলেই খুলে যায়।</p>

<h2>পিছন থেকে পড়ো</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Kranken</span> +
  <span lang="de">Haus</span> = <span lang="de">Krankenhaus</span></p>
  <p class="muster-why">অসুস্থ + বাড়ি = হাসপাতাল। শেষ অংশটাই আসল শব্দ, বাকিটা
  শুধু বিশেষণের মতো কাজ করে।</p>
  <p class="muster-tipp">আর শেষ শব্দটাই টুপি ঠিক করে:
  <span lang="de">das Haus</span> → <span lang="de">das Krankenhaus</span>।</p>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">Haus + Aufgabe = Hausaufgabe</b><span>বাড়ি + কাজ = হোমওয়ার্ক</span></p>
  <p class="satz"><b lang="de">Geburts + Tag = Geburtstag</b><span>জন্ম + দিন = জন্মদিন</span></p>
  <p class="satz"><b lang="de">Wörter + Buch = Wörterbuch</b><span>শব্দ + বই = অভিধান</span></p>
  <p class="satz"><b lang="de">Hand + Schuh = Handschuh</b><span>হাত + জুতা = দস্তানা!</span></p>
  <p class="satz"><b lang="de">Kranken + Haus = Krankenhaus</b><span>অসুস্থ + বাড়ি = হাসপাতাল</span></p>
</div>

<h2>লেজ চিনলে অর্ধেক শেখা</h2>

<p>শব্দের শেষটাই বলে দেয় তার লিঙ্গ কী আর সে কী ধরনের শব্দ। এই ছয়টা চিনলে
হাজারটা শব্দ অভিধান ছাড়াই বোঝা যায়।</p>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>লেজ</th><th>কী বলে</th><th>উদাহরণ</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>-ung</b></td><td>সবসময় <span lang="de">die</span>, কাজ থেকে বিশেষ্য</td>
        <td lang="de">wohnen → die Wohnung <i>(বাসস্থান)</i></td></tr>
    <tr><td lang="de"><b>-heit · -keit</b></td><td>সবসময় <span lang="de">die</span>, গুণ থেকে বিশেষ্য</td>
        <td lang="de">die Freiheit · die Möglichkeit</td></tr>
    <tr><td lang="de"><b>-er</b></td><td>যে করে (পুরুষ)</td>
        <td lang="de">der Lehrer · der Arbeiter</td></tr>
    <tr><td lang="de"><b>-in</b></td><td>যে করে (নারী)</td>
        <td lang="de">die Lehrerin · die Ärztin</td></tr>
    <tr><td lang="de"><b>-lich</b></td><td>বিশেষণ বানায়</td>
        <td lang="de">freundlich · täglich</td></tr>
    <tr><td lang="de"><b>-los</b></td><td>…ছাড়া</td>
        <td lang="de">arbeitslos · hoffnungslos</td></tr>
  </tbody>
</table>
</div>

<div class="merke">নিয়মটা এক লাইনে: লম্বা শব্দ ডান দিক থেকে পড়ো। শেষ অংশটাই
আসল অর্থ ও লিঙ্গ বহন করে। বাকিটা শুধু বর্ণনা।</div>

<div class="merke">আর এটাই <span lang="de">-ung</span>-এর উপহার:
<span lang="de">-ung</span>, <span lang="de">-heit</span>,
<span lang="de">-keit</span> দিয়ে শেষ হওয়া প্রতিটা শব্দ
<span class="hut" data-hut="die">die</span>। তিনটা লেজ শিখে হাজারটা টুপি
বিনামূল্যে পেয়ে গেলে।</div>
`,

register: `
<p>একই ভাষা, আলাদা ঘরে আলাদা পোশাক। বন্ধুকে যা বলো, অফিসে তা বলো না। বাংলায়
তুমি এটা নিখুঁতভাবে করো ('তুই', 'তুমি', 'আপনি'), তাই এই ধারণাটা তোমার কাছে
নতুন নয়, শুধু শব্দগুলো নতুন।</p>

<h2>ঘর বুঝে সুর</h2>

<div class="split">
  <div class="do">
    <h5><span lang="de">informell</span> · du</h5>
    <p class="muster-why">বন্ধু, পরিবার, সমবয়সী, চ্যাট।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Hey! Wie geht's?</b><span>কী খবর?</span></p>
      <p class="satz"><b lang="de">Hast du Lust auf Kaffee?</b><span>কফি খাবে?</span></p>
      <p class="satz"><b lang="de">Kannst du mir helfen?</b><span>একটু সাহায্য করবে?</span></p>
      <p class="satz"><b lang="de">Kein Ding!</b><span>কোনো ব্যাপার না!</span></p>
      <p class="satz"><b lang="de">Bis dann! / Tschüss!</b><span>পরে দেখা!</span></p>
      <p class="satz"><b lang="de">Liebe Grüße</b><span>চিঠির শেষে: ভালোবাসা রইলো</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">formell</span> · Sie</h5>
    <p class="muster-why">অফিস, অচেনা, বয়োজ্যেষ্ঠ, ইমেল।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Guten Tag! Wie geht es Ihnen?</b><span>নমস্কার, কেমন আছেন?</span></p>
      <p class="satz"><b lang="de">Hätten Sie Zeit für ein Gespräch?</b><span>একটু কথা বলার সময় হবে?</span></p>
      <p class="satz"><b lang="de">Könnten Sie mir bitte helfen?</b><span>দয়া করে সাহায্য করবেন?</span></p>
      <p class="satz"><b lang="de">Vielen Dank für Ihre Hilfe.</b><span>সাহায্যের জন্য অনেক ধন্যবাদ।</span></p>
      <p class="satz"><b lang="de">Auf Wiedersehen!</b><span>আবার দেখা হবে।</span></p>
      <p class="satz"><b lang="de">Mit freundlichen Grüßen</b><span>ইমেলের শেষে: বিনীত</span></p>
    </div>
  </div>
</div>

<div class="merke">সন্দেহ হলে <span lang="de">Sie</span>। ভুল করে বেশি ভদ্র হওয়া
কখনো অপমান নয়, কিন্তু বেশি সহজ হওয়াটা হতে পারে।</div>

<div class="merke">খেয়াল করো ডান কলামটা প্রায় পুরোটাই
<a href="/deutsch/stufe-3/konjunktiv.html">Konjunktiv</a>:
<span lang="de">hätten</span>, <span lang="de">könnten</span>। ভদ্রতার ব্যাকরণ
আর স্বপ্নের ব্যাকরণ একই জিনিস, আর এখানেই সেটা সোনা ফলায়।</div>

<h2>আনুষ্ঠানিক ইমেল: পাঁচটা নিরাপদ লাইন</h2>

<p>এই পাঁচ লাইনের কঙ্কালে যেকোনো আনুষ্ঠানিক ইমেল লেখা যায়। শুধু মাঝের কারণ আর
অনুরোধটা বদলাও।</p>

<div class="table-scroll">
<table class="routine">
  <thead><tr><th>অংশ</th><th>যা লিখবে</th><th>কেন</th></tr></thead>
  <tbody>
    <tr><td class="mono" lang="de">Betreff</td><td lang="de">Frage zu einem Termin</td>
        <td>বিষয়: সংক্ষিপ্ত ও পরিষ্কার।</td></tr>
    <tr><td class="mono">সম্বোধন</td>
        <td lang="de">Sehr geehrte Frau … , / Sehr geehrter Herr … ,</td>
        <td>নাম না জানলে: <span lang="de">Sehr geehrte Damen und Herren,</span></td></tr>
    <tr><td class="mono">কারণ</td><td lang="de">Ich schreibe Ihnen, weil ich eine Frage habe.</td>
        <td><span lang="de">weil</span>, আর ক্রিয়া শেষে।</td></tr>
    <tr><td class="mono">অনুরোধ</td><td lang="de">Könnten Sie mir bitte sagen, wann der Termin ist?</td>
        <td><span lang="de">Könnten Sie</span>: Konjunktiv, তাই ভদ্র।</td></tr>
    <tr><td class="mono">সমাপ্তি</td>
        <td lang="de">Vielen Dank im Voraus. Mit freundlichen Grüßen, [Name]</td>
        <td>ধন্যবাদ, তারপর আনুষ্ঠানিক বিদায়।</td></tr>
  </tbody>
</table>
</div>

<div class="merke warn">চিঠিতে <span lang="de">Sie</span>,
<span lang="de">Ihnen</span>, <span lang="de">Ihre</span>: আপনি-অর্থে হলে বড়
হাতের অক্ষরে। ছোট হাতের <span lang="de">sie</span> মানে 'সে' বা 'তারা', আর সেটা
আলাদা কথা।</div>
`,

diskutieren: `
<p>স্তর ২-এ চার ধাপের উত্তর শিখেছিলে। এখানে পাঁচ ধাপ, আর নতুন ধাপটাই সবচেয়ে
জরুরি: মেনে নেওয়া।</p>

<h2>পাঁচ ধাপ</h2>

<div class="table-scroll">
<table class="routine">
  <thead><tr><th>ধাপ</th><th>বাক্য</th><th>কাজ</th></tr></thead>
  <tbody>
    <tr><td class="mono" lang="de">MEINUNG</td>
        <td lang="de">Meiner Meinung nach ist das wichtig.</td>
        <td>মত: 'আমার মতে…'। <span lang="de">dass</span> ছাড়াও শুরু করা যায়।</td></tr>
    <tr><td class="mono" lang="de">GRUND</td>
        <td lang="de">…, weil es vielen Menschen hilft.</td>
        <td>কারণ, ক্রিয়া শেষে।</td></tr>
    <tr><td class="mono" lang="de">ZUGEBEN</td>
        <td lang="de">Zwar ist es teuer, aber …</td>
        <td>মেনে নাও: 'যদিও দামি, কিন্তু…'। এটাই পরিণতির চিহ্ন।</td></tr>
    <tr><td class="mono" lang="de">GEGENSEITE</td>
        <td lang="de">Manche sagen, dass … Trotzdem …</td>
        <td>অন্য পক্ষ, তারপর তবুও। ভারসাম্য দেখাও।</td></tr>
    <tr><td class="mono" lang="de">FAZIT</td>
        <td lang="de">Alles in allem denke ich, dass …</td>
        <td>উপসংহার: 'সব মিলিয়ে…'।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">পরিণত চালটা হলো <span lang="de">ZUGEBEN</span>: পাল্টা বলার
আগে একটা পয়েন্ট স্বীকার করা। <span lang="de">Zwar…, aber…</span> তোমাকে জেদি
নয়, ন্যায্য শোনায়। আর ন্যায্য লোকের কথা মানুষ বেশি শোনে।</div>

<h2>ভাষার আসবাব</h2>

<p>এই বাক্যাংশগুলো প্রতিটা আলাপে ঘুরেফিরে আসে। দশটা মুখস্থ থাকলে তুমি যেকোনো
তর্কে ঢুকে পড়তে পারবে।</p>

<div class="split">
  <div class="do">
    <h5>মত ও জোর দেওয়া</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Meiner Meinung nach…</b><span>আমার মতে…</span></p>
      <p class="satz"><b lang="de">Ich bin der Meinung, dass…</b><span>আমি মনে করি যে…</span></p>
      <p class="satz"><b lang="de">Ich finde es wichtig, dass…</b><span>আমার কাছে জরুরি যে…</span></p>
      <p class="satz"><b lang="de">Einerseits… andererseits…</b><span>একদিকে… অন্যদিকে…</span></p>
      <p class="satz"><b lang="de">Das Wichtigste ist…</b><span>সবচেয়ে জরুরি হলো…</span></p>
      <p class="satz"><b lang="de">Ich bin überzeugt, dass…</b><span>আমি নিশ্চিত যে…</span></p>
    </div>
  </div>
  <div class="others">
    <h5>একমত, দ্বিমত, মেনে নেওয়া</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Da stimme ich dir zu.</b><span>আমি একমত।</span></p>
      <p class="satz"><b lang="de">Das sehe ich anders.</b><span>আমি অন্যভাবে দেখি।</span></p>
      <p class="satz"><b lang="de">Das mag sein, aber…</b><span>তা হতে পারে, কিন্তু…</span></p>
      <p class="satz"><b lang="de">Zwar…, aber…</b><span>যদিও…, তবু…</span></p>
      <p class="satz"><b lang="de">Auf der einen Seite hast du recht…</b><span>একদিকে তুমি ঠিক…</span></p>
      <p class="satz"><b lang="de">Ich verstehe, was du meinst, aber…</b><span>বুঝি কী বলছো, কিন্তু…</span></p>
    </div>
  </div>
</div>

<h2>আজকের কাজ</h2>

<p>একটা বিষয় নাও, পাঁচ ধাপে দুই মিনিট বলো, রেকর্ড করো। প্রতিটায় অন্তত একটা
Konjunktiv, একটা <span lang="de">obwohl</span> বা
<span lang="de">trotzdem</span>, আর একটা সম্বন্ধ-বাক্য রাখার চেষ্টা করো।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Sollten Kinder Handys haben?</b><span>বাচ্চাদের কি মোবাইল থাকা উচিত?</span></p>
  <p class="satz"><b lang="de">Ist das Leben in der Stadt besser als auf dem Land?</b><span>শহরের জীবন কি গ্রামের চেয়ে ভালো?</span></p>
  <p class="satz"><b lang="de">Muss man Englisch und Deutsch lernen?</b><span>ইংরেজি আর জার্মান দুটোই কি শিখতে হবে?</span></p>
  <p class="satz"><b lang="de">Ist Online-Lernen so gut wie Präsenz?</b><span>অনলাইনে শেখা কি সরাসরির মতোই ভালো?</span></p>
  <p class="satz"><b lang="de">Was ist wichtiger: Geld oder Zeit?</b><span>কোনটা বেশি জরুরি, টাকা না সময়?</span></p>
</div>
`,

/* ------------------------------------------------------------
   গল্প, জীবন, পরিকল্পনা
   ------------------------------------------------------------ */

anekdote: `
<p>স্তর ২-এ তুমি গতকালটা ছয় লাইনে বলতে শিখেছিলে। সেটা ছিল একটা দিনের হিসাব।
এটা গল্প, আর গল্পের একটা জিনিস দিনের হিসাবে থাকে না: একটা মোড়।</p>

<h2>গল্পের কাঠামো</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape">পটভূমি → ঘটনা চলছিল → <b lang="de">plötzlich!</b> →
  কী ছিল → অনুভূতি</p>
  <p class="muster-why">শান্তভাবে দৃশ্য সাজাও, তারপর একটা চমক স্টিয়ারিং ঘুরিয়ে
  দিক। ওই মোড়টাই শ্রোতাকে টেনে আনে।</p>
  <p class="muster-tipp">প্রতিটা ভালো গল্পে একটা
  <span lang="de">plötzlich</span> (হঠাৎ) থাকে। ওটাই গল্পের হৃদয়।</p>
</div>

<div class="table-scroll">
<table class="routine">
  <thead><tr><th>ধাপ</th><th>উদাহরণ</th><th>কী দিয়ে</th></tr></thead>
  <tbody>
    <tr><td class="mono">পটভূমি</td>
        <td lang="de">Letzte Woche war ich auf dem Markt. Es war voll.</td>
        <td><span lang="de">war</span> আর <span lang="de">hatte</span> দিয়ে দৃশ্য আঁকো।</td></tr>
    <tr><td class="mono">চলছিল</td>
        <td lang="de">Ich kaufte Obst und suchte mein Geld.</td>
        <td><span lang="de">Präteritum</span>: একের পর এক কাজ।</td></tr>
    <tr><td class="mono">মোড়</td>
        <td lang="de">Plötzlich rief jemand meinen Namen!</td>
        <td>হঠাৎ। শ্রোতা এখানে জেগে ওঠে।</td></tr>
    <tr><td class="mono">কী ছিল</td>
        <td lang="de">Es war meine alte Freundin aus der Schule.</td>
        <td>রহস্যের উত্তর।</td></tr>
    <tr><td class="mono">অনুভূতি</td>
        <td lang="de">Ich war so glücklich! Wir tranken zusammen Tee.</td>
        <td><span lang="de">war</span> দিয়ে শেষ করো।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">খেয়াল করো, পুরো গল্পটা
<a href="/deutsch/stufe-3/praeteritum.html"><span lang="de">Präteritum</span></a>-এ:
<span lang="de">kaufte</span>, <span lang="de">suchte</span>,
<span lang="de">rief</span>, <span lang="de">tranken</span>। এটাই গল্পের কাল, আর
এখানেই সে জীবন্ত হয়।</div>

<h2>গল্প শুরু করার শব্দ</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">Neulich…</b><span>সেদিন…</span></p>
  <p class="satz"><b lang="de">Letzte Woche…</b><span>গত সপ্তাহে…</span></p>
  <p class="satz"><b lang="de">Vor ein paar Tagen…</b><span>কয়েক দিন আগে…</span></p>
  <p class="satz"><b lang="de">Das war so:…</b><span>ব্যাপারটা এরকম:…</span></p>
  <p class="satz"><b lang="de">Ich muss dir was erzählen!</b><span>তোমাকে একটা কথা বলতেই হবে!</span></p>
</div>

<h2>আজকের কাজ</h2>

<p>নিজের একটা সত্যি ঘটনা বলো, পাঁচ ধাপে, না থেমে। তারপর রেকর্ড করে শোনো, আর
একটা প্রশ্ন করো নিজেকে: <span lang="de">plötzlich</span>-এ কি শ্রোতা জাগবে?</p>

<p>কাল আবার একই গল্প। আরও মসৃণ, আরও রঙিন। এই স্তরের নিয়ম নম্বর এক হলো: শুধু
দিন নয়, গল্প বলো, রোজ একটা।</p>
`,

satzbank: `
<p>এই স্তরের বাক্যগুলো স্বাধীন প্রাপ্তবয়স্ক জীবনের: কাজ, বাসা, দপ্তর। ভদ্রতা
এখানে বিলাসিতা নয়, দরকার, আর সেই ভদ্রতার ব্যাকরণ তুমি
<a href="/deutsch/stufe-3/konjunktiv.html">শিখে ফেলেছো</a>।</p>

<h2><span lang="de">Arbeit &amp; Ausbildung</span> · কাজ ও প্রশিক্ষণ</h2>

<div class="split">
  <div class="do">
    <h5>নিজেকে উপস্থাপন</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich interessiere mich für diese Stelle.</b><span>এই পদে আমার আগ্রহ আছে।</span></p>
      <p class="satz"><b lang="de">Ich habe Erfahrung als…</b><span>আমার … হিসেবে অভিজ্ঞতা আছে।</span></p>
      <p class="satz"><b lang="de">Ich lerne schnell und arbeite gern im Team.</b><span>দ্রুত শিখি, দলে কাজ করতে ভালোবাসি।</span></p>
      <p class="satz"><b lang="de">Meine Stärke ist…</b><span>আমার শক্তি হলো…</span></p>
      <p class="satz"><b lang="de">Ich spreche Bangla, Englisch und etwas Deutsch.</b><span>বাংলা, ইংরেজি ও কিছু জার্মান বলি।</span></p>
      <p class="satz"><b lang="de">Ich würde gern mehr lernen.</b><span>আরও শিখতে চাইতাম। (Konjunktiv)</span></p>
    </div>
  </div>
  <div class="others">
    <h5>প্রশ্ন করা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Wie sind die Arbeitszeiten?</b><span>কাজের সময় কেমন?</span></p>
      <p class="satz"><b lang="de">Was sind meine Aufgaben?</b><span>আমার দায়িত্ব কী?</span></p>
      <p class="satz"><b lang="de">Gibt es eine Ausbildung?</b><span>প্রশিক্ষণ আছে কি?</span></p>
      <p class="satz"><b lang="de">Wann kann ich anfangen?</b><span>কবে শুরু করতে পারি?</span></p>
      <p class="satz"><b lang="de">Könnten Sie mir mehr erzählen?</b><span>একটু বিস্তারিত বলবেন?</span></p>
      <p class="satz"><b lang="de">Vielen Dank für das Gespräch.</b><span>কথা বলার জন্য ধন্যবাদ।</span></p>
    </div>
  </div>
</div>

<h2><span lang="de">Die Wohnung</span> · বাসা</h2>

<div class="split">
  <div class="do">
    <h5>খোঁজা ও দেখা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich suche eine Wohnung.</b><span>আমি একটা বাসা খুঁজছি।</span></p>
      <p class="satz"><b lang="de">Wie hoch ist die Miete?</b><span>ভাড়া কত?</span></p>
      <p class="satz"><b lang="de">Sind die Nebenkosten inklusive?</b><span>অন্য খরচ কি এর ভেতরে?</span></p>
      <p class="satz"><b lang="de">Wie viele Zimmer hat die Wohnung?</b><span>কয়টা ঘর?</span></p>
      <p class="satz"><b lang="de">Wann kann ich sie besichtigen?</b><span>কবে দেখতে পারি?</span></p>
      <p class="satz"><b lang="de">Ist die Wohnung noch frei?</b><span>বাসাটা কি এখনো খালি?</span></p>
    </div>
  </div>
  <div class="others">
    <h5>সিদ্ধান্ত ও সমস্যা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Die Wohnung gefällt mir sehr.</b><span>বাসাটা আমার খুব পছন্দ।</span></p>
      <p class="satz"><b lang="de">Ich würde sie gern nehmen.</b><span>আমি এটা নিতে চাইতাম।</span></p>
      <p class="satz"><b lang="de">Die Heizung funktioniert nicht.</b><span>হিটার কাজ করছে না।</span></p>
      <p class="satz"><b lang="de">Könnten Sie das reparieren lassen?</b><span>একটু সারিয়ে দেবেন?</span></p>
      <p class="satz"><b lang="de">Wann ist die Wohnung frei?</b><span>কবে থেকে খালি?</span></p>
      <p class="satz"><b lang="de">Wo muss ich unterschreiben?</b><span>কোথায় সই করব?</span></p>
    </div>
  </div>
</div>

<h2><span lang="de">Beim Amt</span> · সরকারি দপ্তর</h2>

<div class="split">
  <div class="do">
    <h5>পৌঁছে বলা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich habe einen Termin um zehn Uhr.</b><span>দশটায় আমার অ্যাপয়েন্টমেন্ট।</span></p>
      <p class="satz"><b lang="de">Ich brauche eine Bescheinigung.</b><span>আমার একটা সনদ দরকার।</span></p>
      <p class="satz"><b lang="de">Welche Unterlagen brauche ich?</b><span>কোন কাগজপত্র লাগবে?</span></p>
      <p class="satz"><b lang="de">Ich verstehe dieses Formular nicht ganz.</b><span>এই ফর্মটা পুরো বুঝছি না।</span></p>
      <p class="satz"><b lang="de">Könnten Sie mir das erklären?</b><span>একটু বুঝিয়ে দেবেন?</span></p>
      <p class="satz"><b lang="de">Muss ich noch etwas mitbringen?</b><span>আর কিছু আনতে হবে?</span></p>
    </div>
  </div>
  <div class="others">
    <h5>না বুঝলে, আর শেষে</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Entschuldigung, ich spreche noch nicht perfekt.</b><span>দুঃখিত, এখনো নিখুঁত বলি না।</span></p>
      <p class="satz"><b lang="de">Könnten Sie bitte langsamer sprechen?</b><span>একটু আস্তে বলবেন?</span></p>
      <p class="satz"><b lang="de">Habe ich das richtig verstanden?</b><span>ঠিক বুঝলাম তো?</span></p>
      <p class="satz"><b lang="de">Bis wann muss ich das abgeben?</b><span>কবের মধ্যে জমা দিতে হবে?</span></p>
      <p class="satz"><b lang="de">Vielen Dank für Ihre Geduld.</b><span>আপনার ধৈর্যের জন্য ধন্যবাদ।</span></p>
      <p class="satz"><b lang="de">Einen schönen Tag noch!</b><span>দিনটা ভালো কাটুক!</span></p>
    </div>
  </div>
</div>

<div class="merke"><span lang="de">Entschuldigung, ich spreche noch nicht
perfekt</span>: এই এক বাক্য দপ্তরের সুরটাই বদলে দেয়। মানুষ ধৈর্য ধরে, কারণ তুমি
চেষ্টা করছো আর সেটা বলছো।</div>
`,

plan: `
<p>স্তর ১ ছিল ৩০ দিন, স্তর ২ ছিল ৬০। এটা ৯০, আর এটাই সবচেয়ে দীর্ঘ। কারণ
সাবলীলতা তৈরি হয় না, জন্মায়।</p>

<h2>তিন নদী, নব্বই দিন</h2>

<div class="table-scroll">
<table class="karte">
  <thead><tr><th>দিন</th><th lang="de">Fluss</th><th lang="de">Fokus</th><th>যা পারবে</th></tr></thead>
  <tbody>
    <tr><td class="mono">১–৩০</td><td lang="de">ERZÄHLEN</td>
        <td lang="de">Präteritum · Adjektive · Relativsätze</td>
        <td>রঙিন গল্প বলা, বিস্তারিত বর্ণনা।</td></tr>
    <tr><td class="mono">৩১–৬০</td><td lang="de">TRÄUMEN</td>
        <td lang="de">Konjunktiv II · wenn-dann · Futur · Genitiv</td>
        <td>ভদ্রতা, স্বপ্ন, ভবিষ্যৎ, সম্বন্ধ।</td></tr>
    <tr><td class="mono">৬১–৯০</td><td lang="de">ÜBERZEUGEN</td>
        <td lang="de">Konnektoren · Register · Diskussion · Erzählen</td>
        <td>তর্ক, বোঝানো, ইমেল, লম্বা গল্প।</td></tr>
  </tbody>
</table>
</div>

<h2>রোজকার এক ঘণ্টা</h2>

<div class="table-scroll">
<table class="routine">
  <thead><tr><th>কত</th><th>কী</th><th>কেন</th></tr></thead>
  <tbody>
    <tr><td class="mono">১০ মি</td><td>গতকালের গল্পটা জোরে</td>
        <td>এখন আর দিনের হিসাব নয়, একটা গল্প।</td></tr>
    <tr><td class="mono">১৫ মি</td><td>নতুন <span lang="de">Muster</span> + নিজের ১০টা বাক্য</td>
        <td>ছাঁচ নাও, নিজের জীবন ঢালো।</td></tr>
    <tr><td class="mono">১৫ মি</td><td lang="de">Sprechen: একটা গল্প বা তর্ক, রেকর্ড</td>
        <td>রেকর্ডিংটাই একমাত্র নিরপেক্ষ শিক্ষক।</td></tr>
    <tr><td class="mono">১৫ মি</td><td lang="de">Input + Schatten-Sprechen</td>
        <td>পডকাস্ট বা সহজ খবর, আর শুনতে শুনতে হুবহু পিছু পিছু বলা।</td></tr>
    <tr><td class="mono">৫ মি</td><td>এক লাইন ডায়েরি</td>
        <td>লেখা চিন্তাকে ধারালো করে, আর এক লাইন রোজ লেখা যায়।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">নতুন অভ্যাস: <b lang="de">Schatten-Sprechen</b> (shadowing),
মানে অডিও শুনতে শুনতে এক-দুই শব্দ পিছিয়ে হুবহু নকল করে বলা। উচ্চারণ আর ছন্দের
জন্য এর চেয়ে ভালো ব্যায়াম নেই।</div>

<p>তোমার স্তরের, আর সম্পূর্ণ ফ্রি: <span lang="de">Coffee Break German</span>,
<span lang="de">Slow German</span>, আর সহজ খবরের জন্য
<span lang="de">nachrichtenleicht.de</span>। রোজ নতুন পর্ব নয়: পুরো সপ্তাহ একই
পর্ব অনেক বেশি কাজের।</p>

<p>এই মানচিত্রটাই <a href="/deutsch/stufe-3/arbeitsbuch.html">৯০ দিনের অনুশীলন
খাতা</a>, দিন ধরে ধরে সাজানো।</p>

<h2>ছয় নিয়ম</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">Erzähl Geschichten, nicht nur Tage.</b><span>শুধু দিন নয়, গল্প বলো, রোজ একটা।</span></p>
  <p class="satz"><b lang="de">Beschreib mit Farbe.</b><span>'একটা বাড়ি' নয়, 'একটা পুরনো, ছোট, সুন্দর বাড়ি'।</span></p>
  <p class="satz"><b lang="de">Träume auf Deutsch.</b><span>রোজ একটা 'যদি … থাকত' বলো।</span></p>
  <p class="satz"><b lang="de">Input auf Niveau: 15 Minuten.</b><span>রোজ ১৫ মিনিট নিজের স্তরের আসল জার্মান।</span></p>
  <p class="satz"><b lang="de">Schreib jede Woche einen Absatz.</b><span>সপ্তাহে একটা অনুচ্ছেদ: ডায়েরি, মত বা গল্প।</span></p>
  <p class="satz"><b lang="de">Denk nicht über Grammatik nach, beim Sprechen.</b><span>বলার সময় ব্যাকরণ ভেবো না। শুদ্ধি পরে নিজে থেকেই আসে।</span></p>
</div>

<h2>সাতটা ভুল আর তার ওষুধ</h2>

<div class="table-scroll">
<table class="paar-tabelle">
  <thead><tr><th>❌ যা বলবে</th><th>✅ যা ঠিক</th><th>কারণ</th></tr></thead>
  <tbody>
    <tr><td lang="de">der Mann, der kommt nicht</td><td lang="de">der Mann, der nicht kommt</td>
        <td>সম্বন্ধ-অংশে ক্রিয়া একদম শেষে।</td></tr>
    <tr><td lang="de">ein gute Mann</td><td lang="de">ein guter Mann</td>
        <td><span lang="de">ein</span> অস্পষ্ট, তাই বিশেষণ টুপি পরে।</td></tr>
    <tr><td lang="de">Wenn ich hätte Zeit…</td><td lang="de">Wenn ich Zeit hätte…</td>
        <td><span lang="de">wenn</span>-অংশেও ক্রিয়া শেষে।</td></tr>
    <tr><td lang="de">Ich würde gehe.</td><td lang="de">Ich würde gehen.</td>
        <td><span lang="de">würde</span> + মূল রূপ, আর সেটা শেষে।</td></tr>
    <tr><td>Perfekt দিয়ে লম্বা গল্প</td><td>Präteritum দিয়ে গল্প</td>
        <td>লেখা ও গল্পের অতীত <span lang="de">Präteritum</span>।</td></tr>
    <tr><td>বসকে <span lang="de">du</span> বলা</td><td>বসকে <span lang="de">Sie</span> বলা</td>
        <td>সন্দেহ হলে <span lang="de">Sie</span>, সেটাই নিরাপদ।</td></tr>
    <tr><td>(নিখুঁত হতে গিয়ে চুপ)</td><td>সাবলীলতা আগে, নিখুঁততা পরে</td>
        <td>প্রবাহই লক্ষ্য। ভুলসহ বলো।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">সবচেয়ে বড় স্তর-৩ ভুলটা ব্যাকরণের নয়: নিখুঁত হওয়ার চেষ্টায়
থেমে যাওয়া। সাবলীলতা মানে ভুলসহ বয়ে চলা।</div>
`,

};
