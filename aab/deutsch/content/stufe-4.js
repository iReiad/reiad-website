/* ============================================================
   content/stufe-4.js: the text of Stufe 4.

   Keys match the Teil slugs in ../curriculum.js. Same house
   style as stufe-1.js; see that file's header for the rules.

   Two things are different at this level.

   First, this Stufe has no workbook. The daily page has done its
   work; what practises you now is the news you read and the
   argument you have. Several Teile therefore end by handing over
   a habit rather than an exercise, and none of them link at a
   book that does not exist.

   Second, the subject has changed. Up to here the course taught
   what to say. This one teaches how: the tone, the hedge, the
   one small word that turns a correct sentence into a warm one.
   That is why Modalpartikeln sit at the centre of it and not as
   an appendix.
   ============================================================ */

export default {

/* ------------------------------------------------------------
   সময়ের সূক্ষ্মতা
   ------------------------------------------------------------ */

passiv: `
<p>খবর পড়তে গেলে প্রথম যে জিনিসটা চোখে পড়বে, সেটা এই। আর সুখবর: বাংলা এটা
বহুকাল ধরে জানে।</p>

<h2>কাজটাই মুখ্য</h2>

<p>সাধারণ বাক্যে কর্তা সামনে থাকে: 'লোকটা ঘর বানায়।' কিন্তু প্রায়ই কে করছে সেটা
গুরুত্বহীন, কাজটাই আসল। তখন জার্মান কর্তাকে সরিয়ে দেয়।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Das Haus <b>wird</b> <b>gebaut</b>.</span></p>
  <p class="muster-why"><span lang="de">werden</span> আসন-দুইয়ে,
  <span lang="de">Partizip</span> শেষে। সেই বন্ধনী, আরেকবার।</p>
  <p class="muster-tipp">বাংলা: 'ঘরটা বানানো হচ্ছে।' সেই 'হয়' বা 'হচ্ছে'-টাই
  হলো <span lang="de">wird</span>। তোমার ভাষাই সেতু।</p>
</div>

<p>কে করছে সেটা বলতে চাইলে <span lang="de">von</span> দিয়ে আনা যায়:
<span lang="de">Das Haus wird <b>von dem Mann</b> gebaut.</span> কিন্তু
বেশিরভাগ সময় সেটা বলাই হয় না, আর সেটাই এই গঠনের পুরো উদ্দেশ্য।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Hier wird Deutsch gesprochen.</b><span>এখানে জার্মান বলা হয়।</span></p>
  <p class="satz"><b lang="de">Der Brief wird geschrieben.</b><span>চিঠিটা লেখা হচ্ছে।</span></p>
  <p class="satz"><b lang="de">Das Problem wird gelöst.</b><span>সমস্যাটা সমাধান করা হচ্ছে।</span></p>
  <p class="satz"><b lang="de">Der Laden wird um acht geöffnet.</b><span>দোকান আটটায় খোলা হয়।</span></p>
  <p class="satz"><b lang="de">Es wird viel gearbeitet.</b><span>অনেক কাজ করা হয়।</span></p>
</div>

<h2>'হচ্ছে' না 'হয়ে আছে'</h2>

<p>দুটো আলাদা জিনিস, আর জার্মান দুটোকে আলাদা রাখে।</p>

<div class="split">
  <div class="do">
    <h5><span lang="de">Vorgang</span> · কাজ চলছে (<span lang="de">werden</span>)</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Die Tür wird geöffnet.</b><span>দরজাটা খোলা হচ্ছে (কেউ খুলছে)।</span></p>
      <p class="satz"><b lang="de">Das Essen wird gekocht.</b><span>খাবার রান্না করা হচ্ছে।</span></p>
      <p class="satz"><b lang="de">Das Haus wurde gebaut.</b><span>অতীত: বানানো হয়েছিল।</span></p>
      <p class="satz"><b lang="de">Es ist gebaut worden.</b><span>Perfekt: বানানো হয়েছে।</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">Zustand</span> · অবস্থা (<span lang="de">sein</span>)</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Die Tür ist geöffnet.</b><span>দরজাটা খোলা আছে।</span></p>
      <p class="satz"><b lang="de">Das Essen ist gekocht.</b><span>খাবার রান্না হয়ে আছে।</span></p>
      <p class="satz"><b lang="de">Das Geschäft ist geschlossen.</b><span>দোকান বন্ধ আছে।</span></p>
      <p class="satz"><b lang="de">Alles ist vorbereitet.</b><span>সব প্রস্তুত করা আছে।</span></p>
    </div>
  </div>
</div>

<div class="merke warn">সাবধান-জোড়া: Perfekt-এ
<span lang="de">geworden</span> নয়, শুধু <span lang="de">worden</span>।
<span lang="de">Es ist gebaut <b>worden</b>.</span> এটাই এই স্তরের সবচেয়ে বেশি
হওয়া ভুল।</div>

<h2><span lang="de">modal</span>-এর সাথে</h2>

<p>বাধ্যতা বা সম্ভাবনা বোঝাতে হলে <span lang="de">werden</span> চলে যায় একদম
শেষে, <span lang="de">Partizip</span>-এরও পরে।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Das muss gemacht werden.</b><span>এটা করা হতেই হবে।</span></p>
  <p class="satz"><b lang="de">Das kann repariert werden.</b><span>এটা সারানো যেতে পারে।</span></p>
  <p class="satz"><b lang="de">Das sollte nicht vergessen werden.</b><span>এটা ভোলা উচিত নয়।</span></p>
</div>

<div class="merke">এই গঠনটা খবর আর দপ্তরের কণ্ঠ। রোজ দশ মিনিট জার্মান খবর পড়লে
এটা আলাদা করে মুখস্থ করতে হবে না, কানে বসে যাবে।</div>
`,

plusquamperfekt: `
<p>ছোট একটা Teil, আর গঠনটা তোমার পুরোপুরি চেনা। এটা শুধু অতীতের ভেতরে আরেক ধাপ
পিছিয়ে যাওয়া।</p>

<h2>যেটা আগে ঘটেছিল</h2>

<p>কখনো বলতে হয়: একটা ঘটনা ঘটল, আর তার আগে অন্য কিছু ঘটে গিয়েছিল। সেই আগেরটার
জন্য এই কাল।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><b lang="de">hatte</b> / <b lang="de">war</b> +
  <span lang="de">Partizip</span></p>
  <p class="muster-why"><span lang="de">Ich <b>hatte</b> schon <b>gegessen</b>,
  als er kam.</span> আগে খেলাম, তারপর সে এল।</p>
  <p class="muster-tipp">বাংলা ভাবো: 'খেয়ে ফেলেছিলাম, তারপর…'। সেই 'আগেই শেষ'
  অনুভূতিটাই এটা।</p>
</div>

<p>গঠনটা <a href="/deutsch/stufe-2/perfekt.html">Perfekt</a>-এর মতোই, শুধু
<span lang="de">habe</span>-র জায়গায় <span lang="de">hatte</span> আর
<span lang="de">bin</span>-এর জায়গায় <span lang="de">war</span>। নতুন
<span lang="de">Partizip</span> শেখার কিছু নেই।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich hatte schon gegessen.</b><span>আমি আগেই খেয়ে ফেলেছিলাম।</span></p>
  <p class="satz"><b lang="de">Sie war schon gegangen.</b><span>সে আগেই চলে গিয়েছিল।</span></p>
  <p class="satz"><b lang="de">Der Zug war schon weg.</b><span>ট্রেন আগেই চলে গিয়েছিল।</span></p>
  <p class="satz"><b lang="de">Ich hatte es vergessen.</b><span>আমি এটা ভুলে গিয়েছিলাম।</span></p>
  <p class="satz"><b lang="de">Wir hatten viel gelernt.</b><span>আমরা অনেক শিখে ফেলেছিলাম।</span></p>
</div>

<h2><span lang="de">nachdem</span>: এর স্বাভাবিক সঙ্গী</h2>

<p>এই কালটা প্রায়ই <span lang="de">nachdem</span> (এর পরে) বা
<span lang="de">bevor</span> (এর আগে)-র সাথে জোড়া বেঁধে আসে। আর সেগুলো
<span lang="de">weil</span>-পরিবারের, তাই ক্রিয়া শেষে।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Nachdem ich gegessen hatte, ging ich.</b><span>খাওয়ার পর আমি বেরোলাম।</span></p>
  <p class="satz"><b lang="de">Bevor er kam, hatten wir angefangen.</b><span>সে আসার আগে আমরা শুরু করেছিলাম।</span></p>
  <p class="satz"><b lang="de">Als er kam, hatte der Film schon angefangen.</b><span>যখন সে এল, সিনেমা আগেই শুরু হয়ে গিয়েছিল।</span></p>
</div>

<div class="merke">গল্প বলার সময় এটা কাজে লাগে সবচেয়ে বেশি: ঘটনাগুলো যখন
ক্রম মেনে ঘটে না, তখন এই কালটাই শ্রোতাকে বুঝিয়ে দেয় কোনটা আগে।</div>
`,

haette: `
<p><a href="/deutsch/stufe-3/konjunktiv.html">স্তর ৩-এ</a> শিখেছিলে
<span lang="de">Ich würde helfen</span>: এখন বা সবসময়। এবার সেটাকে অতীতে
ঘুরিয়ে দাও, আর তুমি পাবে আক্ষেপ, স্বস্তি আর 'কী হতে পারত'-র ব্যাকরণ।</p>

<h2>যা ঘটেনি</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><b lang="de">hätte</b> / <b lang="de">wäre</b> +
  <span lang="de">Partizip</span></p>
  <p class="muster-why"><span lang="de">Ich hätte dir geholfen.</span>
  আমি তোমাকে সাহায্য করতাম, কিন্তু করিনি।</p>
  <p class="muster-tipp">বাংলা রোজ এটা বলে: 'করতে পারতাম', 'করা উচিত ছিল',
  'এলে ভালো হতো'। ঠিক এই অনুভূতি।</p>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich hätte dir geholfen.</b><span>আমি তোমাকে সাহায্য করতাম।</span></p>
  <p class="satz"><b lang="de">Das hätte ich nicht gedacht!</b><span>এটা আমি ভাবিইনি!</span></p>
  <p class="satz"><b lang="de">Du hättest anrufen sollen.</b><span>তোমার ফোন করা উচিত ছিল।</span></p>
  <p class="satz"><b lang="de">Ich wäre fast gefallen.</b><span>আমি প্রায় পড়েই যেতাম।</span></p>
  <p class="satz"><b lang="de">Wir hätten kommen können.</b><span>আমরা আসতে পারতাম।</span></p>
</div>

<div class="merke warn">এখানে একটাই নতুন কৌশল: modal থাকলে শেষে দুটো মূল-রূপ
পাশাপাশি বসে, <span lang="de">Partizip</span> নয়।
<span lang="de">…anrufen <b>sollen</b></span>,
<span lang="de">…kommen <b>können</b></span>। কানে অদ্ভুত লাগে প্রথমে, তারপর
স্বাভাবিক হয়ে যায়।</div>

<h2>দুই সুর</h2>

<div class="split">
  <div class="do">
    <h5><span lang="de">Bedauern</span> · আক্ষেপ</h5>
    <p class="muster-why">যা হয়নি, তার জন্য।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Wenn ich Zeit gehabt hätte, wäre ich gekommen.</b><span>সময় থাকলে আসতাম।</span></p>
      <p class="satz"><b lang="de">Ich hätte mehr lernen sollen.</b><span>আরও পড়া উচিত ছিল।</span></p>
      <p class="satz"><b lang="de">Hätte ich das nur gewusst!</b><span>জানতাম যদি!</span></p>
      <p class="satz"><b lang="de">Das wäre besser gewesen.</b><span>সেটা ভালো হতো।</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">Erleichterung</span> · স্বস্তি</h5>
    <p class="muster-why">যা প্রায় ঘটেই গিয়েছিল।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Fast wäre ich zu spät gekommen.</b><span>প্রায় দেরি হয়েই যেত।</span></p>
      <p class="satz"><b lang="de">Das hätte schlimm enden können.</b><span>খারাপ হতে পারত।</span></p>
      <p class="satz"><b lang="de">Zum Glück ist nichts passiert.</b><span>ভাগ্যিস কিছু হয়নি।</span></p>
      <p class="satz"><b lang="de">Es hätte anders kommen können.</b><span>অন্যরকমও হতে পারত।</span></p>
    </div>
  </div>
</div>

<div class="merke">পুরো অবাস্তব অতীত বাক্যটা স্তর ৩-এর সেতুরই অতীত রূপ:
<span lang="de">Wenn ich es gewusst <b>hätte</b>, <b>wäre</b> ich gekommen.</span>
দুই অতীত-কোট, এক আক্ষেপ।</div>
`,

"indirekte-rede": `
<p>এই Teil-টা নিয়ে একটা সৎ কথা আগেই বলে রাখি: এটা তোমাকে মূলত <b>চিনতে</b>
হবে, বলতে নয়।</p>

<h2>খবরের কণ্ঠ</h2>

<p>কোনো খবর যখন রিপোর্ট করে কেউ কী বলেছে, তখন সে একটা বিশেষ রূপ নেয়। এই রূপটার
কাজ একটাই: দেখানো যে 'এগুলো তার কথা, আমার নয়'।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">haben → habe · sein → sei ·
  kommen → komme · werden → werde</span></p>
  <p class="muster-why"><span lang="de">Der Minister sagte, er <b>sei</b>
  zuversichtlich.</span> মন্ত্রী বললেন, তিনি আত্মবিশ্বাসী।</p>
  <p class="muster-tipp">খেয়াল করো <span lang="de">er sei</span>, যেখানে
  স্বাভাবিক রূপ হতো <span lang="de">er ist</span>। এই ছোট্ট বদলটাই সংকেত।</p>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">Er sagt, er sei müde.</b><span>সে বলে, সে ক্লান্ত।</span></p>
  <p class="satz"><b lang="de">Sie meint, sie habe recht.</b><span>সে মনে করে, সে ঠিক।</span></p>
  <p class="satz"><b lang="de">Man sagt, es werde kälter.</b><span>বলা হচ্ছে, ঠান্ডা বাড়বে।</span></p>
  <p class="satz"><b lang="de">Er sagte, er komme später.</b><span>সে বলল, পরে আসবে।</span></p>
  <p class="satz"><b lang="de">Er behauptet, er habe es gewusst.</b><span>সে দাবি করে, সে জানত।</span></p>
</div>

<h2>মুখে কী বলবে</h2>

<p>বলার সময় বেশিরভাগ জার্মান সোজা <span lang="de">dass</span> দিয়ে বলে, আর
সেটা পুরোপুরি ঠিক।</p>

<div class="table-scroll">
<table class="paar-tabelle">
  <thead><tr><th>খবরে (<span lang="de">Konjunktiv I</span>)</th>
      <th>মুখে (<span lang="de">dass</span>)</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="de">Er sagt, er habe keine Zeit.</td>
        <td lang="de">Er sagt, dass er keine Zeit hat.</td>
        <td>সে বলে যে তার সময় নেই।</td></tr>
    <tr><td lang="de">Sie meint, sie sei krank.</td>
        <td lang="de">Sie sagt, dass sie krank ist.</td>
        <td>সে বলে যে সে অসুস্থ।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">তাই লক্ষ্যটা পরিষ্কার: খবর পড়ার সময় এই রূপটা দেখলে চিনে নাও,
আর বুঝে নাও যে লেখক নিজে দায় নিচ্ছেন না। নিজে বলার সময়
<span lang="de">dass</span> দিয়ে বলো। কেউ কিছু মনে করবে না।</div>

<p>এটাই এই স্তরের নিয়ম নম্বর এক কাজে লাগার জায়গা: রোজ আসল খবর পড়ো
(<span lang="de">DW Top-Thema</span> বা
<span lang="de">Nachrichtenleicht</span>)। ওখানে
<a href="/deutsch/stufe-4/passiv.html">Passiv</a> আর এই রূপটা জীবন্ত অবস্থায়
পাওয়া যায়, আর কয়েক সপ্তাহেই চোখে ধরা দিতে শুরু করে।</p>
`,

/* ------------------------------------------------------------
   যুক্তির জোড়া
   ------------------------------------------------------------ */

"verben-praeposition": `
<p>টুপির নিয়মটা মনে আছে? বিশেষ্য কখনো একা শেখা যায় না,
<span lang="de">der Tisch</span> হিসেবে শিখতে হয়। ক্রিয়ার বেলায়ও ঠিক তাই, আর
এই Teil-টা সেই জোড়াগুলোর।</p>

<h2>জোড়ায় শেখো, যুক্তি খুঁজো না</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">warten <b>auf</b> + Akkusativ</span></p>
  <p class="muster-why"><span lang="de">Ich warte auf den Bus.</span> কেন
  <span lang="de">auf</span>, <span lang="de">für</span> নয়? কোনো কারণ নেই।
  জোড়াটাই শেখার জিনিস।</p>
  <p class="muster-tipp"><span lang="de">Ich warte auf den Bus</span> পুরোটাকে
  একটা একক শব্দের মতো মুখে বসাও।</p>
</div>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>জোড়া</th><th>মানে</th><th>উদাহরণ</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>warten auf</b> + Akk</td><td>…-এর জন্য অপেক্ষা করা</td>
        <td lang="de">Ich warte auf den Bus.</td></tr>
    <tr><td lang="de"><b>denken an</b> + Akk</td><td>…-এর কথা ভাবা</td>
        <td lang="de">Ich denke an dich.</td></tr>
    <tr><td lang="de"><b>sich freuen auf</b> + Akk</td><td>…-এর জন্য উদগ্রীব হওয়া</td>
        <td lang="de">Ich freue mich auf die Ferien.</td></tr>
    <tr><td lang="de"><b>sich freuen über</b> + Akk</td><td>…-এ (যা ঘটেছে) খুশি হওয়া</td>
        <td lang="de">Ich freue mich über dein Geschenk.</td></tr>
    <tr><td lang="de"><b>sich interessieren für</b> + Akk</td><td>…-এ আগ্রহী হওয়া</td>
        <td lang="de">Er interessiert sich für Musik.</td></tr>
    <tr><td lang="de"><b>teilnehmen an</b> + Dat</td><td>…-এ অংশ নেওয়া</td>
        <td lang="de">Sie nimmt am Kurs teil.</td></tr>
    <tr><td lang="de"><b>sich kümmern um</b> + Akk</td><td>…-এর দেখাশোনা করা</td>
        <td lang="de">Ich kümmere mich um meine Eltern.</td></tr>
    <tr><td lang="de"><b>abhängen von</b> + Dat</td><td>…-এর উপর নির্ভর করা</td>
        <td lang="de">Alles hängt vom Wetter ab.</td></tr>
    <tr><td lang="de"><b>sich erinnern an</b> + Akk</td><td>…-এর কথা মনে রাখা</td>
        <td lang="de">Ich erinnere mich an den Tag.</td></tr>
    <tr><td lang="de"><b>bitten um</b> + Akk</td><td>…চাওয়া, অনুরোধ করা</td>
        <td lang="de">Ich bitte um Hilfe.</td></tr>
    <tr><td lang="de"><b>sprechen über</b> + Akk</td><td>…নিয়ে কথা বলা</td>
        <td lang="de">Wir sprechen über die Arbeit.</td></tr>
    <tr><td lang="de"><b>Angst haben vor</b> + Dat</td><td>…-কে ভয় পাওয়া</td>
        <td lang="de">Ich habe Angst vor Hunden.</td></tr>
  </tbody>
</table>
</div>

<div class="merke warn">ইংরেজি এখানে বারবার ধোঁকা দেবে:
<i>wait <b>for</b></i> কিন্তু <span lang="de">warten <b>auf</b></span>।
অনুবাদ কোরো না, জোড়াটা শেখো।</div>

<h2><span lang="de">wo(r)-</span> আর <span lang="de">da(r)-</span></h2>

<p>জিনিস নিয়ে প্রশ্ন করতে বা উত্তর দিতে গেলে আঠা-শব্দটা সামনে চলে আসে আর জুড়ে
যায়।</p>

<div class="split">
  <div class="do">
    <h5>প্রশ্ন · <span lang="de">wo(r)-</span></h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Worauf wartest du?</b><span>কীসের জন্য অপেক্ষা করছো?</span></p>
      <p class="satz"><b lang="de">Woran denkst du?</b><span>কী নিয়ে ভাবছো?</span></p>
      <p class="satz"><b lang="de">Worüber sprecht ihr?</b><span>কী নিয়ে কথা বলছো?</span></p>
      <p class="satz"><b lang="de">Wovor hast du Angst?</b><span>কীসে ভয় পাও?</span></p>
      <p class="satz"><b lang="de">Auf wen wartest du?</b><span>মানুষ হলে: কার জন্য?</span></p>
    </div>
  </div>
  <div class="others">
    <h5>উত্তর · <span lang="de">da(r)-</span></h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich warte darauf.</b><span>আমি তার জন্য অপেক্ষা করছি।</span></p>
      <p class="satz"><b lang="de">Ich denke daran.</b><span>আমি তা নিয়ে ভাবছি।</span></p>
      <p class="satz"><b lang="de">Wir sprechen darüber.</b><span>আমরা তা নিয়ে কথা বলছি।</span></p>
      <p class="satz"><b lang="de">Ich freue mich darauf!</b><span>আমি তার জন্য উদগ্রীব!</span></p>
      <p class="satz"><b lang="de">Ich warte auf ihn.</b><span>মানুষ হলে: তার জন্য।</span></p>
    </div>
  </div>
</div>

<div class="merke">ছোট নিয়ম, বড় কাজ: স্বরবর্ণ দিয়ে শুরু হলে মাঝে একটা
<span lang="de">r</span> ঢোকে। <span lang="de">wo</span> +
<b lang="de">r</b> + <span lang="de">auf</span> = <span lang="de">worauf</span>,
<span lang="de">da</span> + <b lang="de">r</b> + <span lang="de">an</span> =
<span lang="de">daran</span>। ব্যঞ্জন হলে ঢোকে না:
<span lang="de">damit</span>, <span lang="de">davon</span>।</div>

<div class="merke warn">মানুষ আর জিনিসের নিয়ম আলাদা। জিনিস হলে
<span lang="de">darauf</span>, মানুষ হলে <span lang="de">auf ihn</span>।
জার্মান এখানে খুব কড়া।</div>
`,

konnektoren: `
<p>স্তর ২-এ শিখেছিলে <span lang="de">weil</span> আর
<span lang="de">deshalb</span>, স্তর ৩-এ <span lang="de">obwohl</span> আর
<span lang="de">damit</span>। এই Teil-এ শেষ কয়েকটা, আর এরাই তোমার যুক্তিকে
নির্ভুল করে।</p>

<h2>পাঁচটা সূক্ষ্ম জোড়</h2>

<div class="table-scroll">
<table class="platz-tabelle">
  <thead><tr><th>শব্দ</th><th>মানে</th><th>উদাহরণ</th><th>ক্রিয়া কোথায়</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>je … desto</b></td><td>যত…তত</td>
        <td lang="de">Je mehr ich übe, desto besser werde ich.</td>
        <td><span lang="de">je</span>-অংশে শেষে, তারপর <span lang="de">desto</span> + তুলনা + ক্রিয়া</td></tr>
    <tr><td lang="de"><b>indem</b></td><td>…করার মাধ্যমে</td>
        <td lang="de">Man lernt, indem man spricht.</td>
        <td>শেষে</td></tr>
    <tr><td lang="de"><b>sodass</b></td><td>ফলে</td>
        <td lang="de">Es wurde spät, sodass wir gingen.</td>
        <td>শেষে</td></tr>
    <tr><td lang="de"><b>während</b></td><td>…করার সময়, যেখানে</td>
        <td lang="de">Während ich koche, liest du.</td>
        <td>শেষে</td></tr>
    <tr><td lang="de"><b>um … zu</b></td><td>…করার জন্য</td>
        <td lang="de">Ich lerne, um zu wachsen.</td>
        <td><span lang="de">zu</span> + মূল রূপ, শেষে</td></tr>
  </tbody>
</table>
</div>

<div class="merke">প্রায় সবাই ক্রিয়াকে শেষে পাঠায়, মানে সেই পুরনো
<span lang="de">weil</span>-পরিবারই, শুধু আরও সূক্ষ্ম। নতুন ব্যাকরণ শূন্য।</div>

<h2><span lang="de">um · ohne · anstatt … zu</span></h2>

<p>এই তিনটার একটা সুবিধা আছে: এদের কোনো কর্তা লাগে না। শুধু
<span lang="de">zu</span> আর মূল রূপ, ব্যস।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich lerne Deutsch, um in Deutschland zu arbeiten.</b><span>জার্মানিতে কাজ করার জন্য জার্মান শিখি।</span></p>
  <p class="satz"><b lang="de">Er ging, ohne zu grüßen.</b><span>সে না বলে চলে গেল।</span></p>
  <p class="satz"><b lang="de">Anstatt zu lernen, schlief er.</b><span>পড়ার বদলে সে ঘুমাল।</span></p>
  <p class="satz"><b lang="de">Ich stehe früh auf, um Zeit zu haben.</b><span>সময় পাওয়ার জন্য আগে উঠি।</span></p>
</div>

<div class="merke warn">কর্তা এক হলে <span lang="de">um … zu</span>, আলাদা হলে
<span lang="de">damit</span>। <span lang="de">Ich lerne, um zu wachsen</span>
(আমি, আমি)। কিন্তু <span lang="de">Ich spreche langsam, damit du mich
verstehst</span> (আমি, তুমি)।</div>

<h2><span lang="de">je … desto</span>: সবচেয়ে কাজের</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">Je mehr ich lese, desto mehr verstehe ich.</b><span>যত বেশি পড়ি, তত বেশি বুঝি।</span></p>
  <p class="satz"><b lang="de">Je mehr ich übe, desto weniger Angst habe ich.</b><span>যত বেশি অনুশীলন, তত কম ভয়।</span></p>
  <p class="satz"><b lang="de">Je älter man wird, desto schneller vergeht die Zeit.</b><span>যত বয়স বাড়ে, তত দ্রুত সময় যায়।</span></p>
</div>

<div class="merke warn">ক্রম উল্টে ফেলা এখানে সবচেয়ে সাধারণ ভুল:
<span lang="de">Je mehr ich <b>lerne</b>, desto …</span>, ক্রিয়া
<span lang="de">je</span>-অংশের শেষে।</div>
`,

/* ------------------------------------------------------------
   সুর ও নির্ভুলতা
   ------------------------------------------------------------ */

modalpartikeln: `
<p>এই Teil-টাই এই স্তরের হৃদয়। এখানে যা শিখবে তা ব্যাকরণ নয়, ব্যাকরণ শেষ হওয়ার
পরে যা থাকে সেটা।</p>

<h2>ছোট শব্দ, গোটা সুর</h2>

<p>এই এক-অক্ষরের শব্দগুলো বাক্যের বিষয় বদলায় না। সুর বদলায়। তুমি কেমন অনুভব
করছো, সেটা বলে। জার্মানরা এগুলো অনবরত ব্যবহার করে, আর এগুলো ছাড়া তুমি শুদ্ধ
শোনাবে, কিন্তু শীতল।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">Komm mit.</span> →
  <span lang="de">Komm <b>doch</b> mit!</span></p>
  <p class="muster-why">প্রথমটা একটা তথ্য। দ্বিতীয়টা একটা আমন্ত্রণ। শব্দ বদলায়নি,
  উষ্ণতা যোগ হয়েছে।</p>
  <p class="muster-tipp">বাংলার 'তো' আর 'একটু' ঠিক এই কাজটাই করে:
  'একটু করো <b>তো</b>!' অনুবাদ হয় না, অনুভব করতে হয়।</p>
</div>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>শব্দ</th><th>উদাহরণ</th><th>কোন অনুভূতি</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>doch</b></td><td lang="de">Komm doch mit! · Das weißt du doch!</td>
        <td>উৎসাহ বা মৃদু জোর: 'আরে চলো না', 'জানোই তো'।</td></tr>
    <tr><td lang="de"><b>mal</b></td><td lang="de">Hör mal! · Warte mal.</td>
        <td>নরম করে: 'একটু', 'তো'। আদেশকে অনুরোধ বানায়।</td></tr>
    <tr><td lang="de"><b>ja</b></td><td lang="de">Das ist ja schön! · Du bist ja da!</td>
        <td>অবাক হওয়া: 'আরে!', 'তুমি তো এসেছো!'</td></tr>
    <tr><td lang="de"><b>halt · eben</b></td><td lang="de">Das ist halt so. · So ist es eben.</td>
        <td>মেনে নেওয়া: 'এমনই, কী আর করা'।</td></tr>
    <tr><td lang="de"><b>wohl</b></td><td lang="de">Er ist wohl müde. · Das wird wohl stimmen.</td>
        <td>সম্ভাবনা: 'বোধহয়', 'হয়তো'।</td></tr>
    <tr><td lang="de"><b>denn</b></td><td lang="de">Was machst du denn? · Wo warst du denn?</td>
        <td>কৌতূহল ও উষ্ণতা: প্রশ্নটাকে নরম করে।</td></tr>
  </tbody>
</table>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">Komm doch mit!</b><span>আরে চলো না!</span></p>
  <p class="satz"><b lang="de">Mach mal langsam.</b><span>একটু আস্তে করো।</span></p>
  <p class="satz"><b lang="de">Das ist ja toll!</b><span>আরে, দারুণ তো!</span></p>
  <p class="satz"><b lang="de">Das ist halt so.</b><span>এটা এমনই, কী আর করা।</span></p>
  <p class="satz"><b lang="de">Er ist wohl krank.</b><span>সে বোধহয় অসুস্থ।</span></p>
  <p class="satz"><b lang="de">Was machst du denn?</b><span>আরে, কী করছো?</span></p>
</div>

<div class="merke">নিয়ম: কোনো নিয়ম নেই। আসল কথায় শব্দটা শোনো, অনুভূতিটা ধরো,
আর চুরি করো। শিশু এভাবেই মাতৃভাষা শেখে, আর এই একটা জিনিস ছকে শেখা যায় না।</div>

<div class="merke warn">সাবধান: <span lang="de">denn</span> এখানে
'কারণ' নয়। প্রশ্নের ভেতরে বসা <span lang="de">denn</span> শুধু সুর।
<span lang="de">Wo warst du denn?</span> মানে 'কোথায় ছিলে?', কৌতূহল নিয়ে।</div>

<p>এই স্তরের নিয়ম নম্বর দুই এখানেই: <span lang="de">doch</span>,
<span lang="de">mal</span>, <span lang="de">halt</span>,
<span lang="de">eben</span> অনুভব দিয়ে জমাও, অনুবাদ দিয়ে নয়। কোথায় কোন সুর,
তা কান শেখায়।</p>
`,

nominalstil: `
<p>দপ্তরের চিঠি আর বইয়ের ভাষা ঘন ও বিশেষ্য-ভারী। এই Teil-টা বলার জন্য নয়,
পড়ার জন্য: ঘন বাক্য দেখলে যেন ভয় না লেগে ধৈর্য আসে।</p>

<h2>এক: ক্রিয়া থেকে বিশেষ্য</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">lernen</span> →
  <span lang="de"><b>das</b> Lernen</span></p>
  <p class="muster-why">যেকোনো ক্রিয়াকে বড় হাতের অক্ষরে লিখে দিলেই সেটা
  বিশেষ্য, আর সবসময় <span class="hut" data-hut="das">das</span>। ব্যতিক্রম নেই।</p>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">beim Lesen</b><span>পড়ার সময়</span></p>
  <p class="satz"><b lang="de">zum Lernen</b><span>শেখার জন্য</span></p>
  <p class="satz"><b lang="de">nach dem Essen</b><span>খাওয়ার পর</span></p>
  <p class="satz"><b lang="de">das Wichtigste</b><span>সবচেয়ে জরুরি জিনিস</span></p>
  <p class="satz"><b lang="de">etwas Schönes</b><span>সুন্দর কিছু</span></p>
  <p class="satz"><b lang="de">nichts Neues</b><span>নতুন কিছু নয়</span></p>
</div>

<h2>দুই: বিশেষ্যের সামনে প্যাক করা বর্ণনা</h2>

<p>জার্মান লিখিত ভাষা একটা বিশেষ্যের আগে গোটা একটা বাক্য ঢুকিয়ে দিতে পারে।
দেখতে ভয়ানক, কিন্তু খোলার নিয়মটা সহজ।</p>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>যা লেখা</th><th>মানে</th><th>ভেঙে নিলে</th></tr></thead>
  <tbody>
    <tr><td lang="de">das gebaute Haus</td><td>বানানো ঘরটা</td>
        <td lang="de">das Haus, das gebaut wurde</td></tr>
    <tr><td lang="de">das gestern gebaute Haus</td><td>গতকাল বানানো ঘরটা</td>
        <td lang="de">das Haus, das gestern gebaut wurde</td></tr>
    <tr><td lang="de">das von uns gebaute Haus</td><td>আমাদের বানানো ঘরটা</td>
        <td lang="de">das Haus, das von uns gebaut wurde</td></tr>
    <tr><td lang="de">der lesende Mann</td><td>পড়তে-থাকা লোকটা</td>
        <td lang="de">der Mann, der liest</td></tr>
  </tbody>
</table>
</div>

<div class="merke">পড়ার কৌশল: ঘন বাক্যে আগে মূল বিশেষ্যটা খোঁজো
(<span lang="de">das Haus</span>), তারপর তার সামনের বর্ণনাগুলো একটা একটা করে
খোলো, যেন <a href="/deutsch/stufe-3/relativsatz.html">সম্বন্ধ-বাক্য</a>।
ভয় নয়, ধৈর্য।</div>

<p>নিজে লেখার সময় এই গঠন ব্যবহার করার দরকার নেই। সম্বন্ধ-বাক্য দিয়ে লিখলেই
পরিষ্কার আর শুদ্ধ হবে। এটা চেনার জিনিস, বানানোর নয়।</p>
`,

synonyme: `
<p>এই স্তরের নিয়ম নম্বর তিন: <span lang="de">Sag es genauer</span>। শুধু শুদ্ধ
নয়, নিখুঁত। আর নিখুঁততা আসে শব্দভাণ্ডারের গভীরতা থেকে, ব্যাকরণ থেকে নয়।</p>

<h2><span lang="de">gehen</span> যথেষ্ট নয়</h2>

<p>'যাওয়া' মানেই <span lang="de">gehen</span> নয়। কীভাবে যাচ্ছো, সেটাই আসল কথা।</p>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>শব্দ</th><th>কী রকম যাওয়া</th><th>বাংলায়</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>gehen</b></td><td>সাধারণ</td><td>যাওয়া</td></tr>
    <tr><td lang="de"><b>spazieren</b></td><td>অবসরে, আনন্দে</td><td>পায়চারি করা</td></tr>
    <tr><td lang="de"><b>wandern</b></td><td>লম্বা পদযাত্রা</td><td>হাইকিং করা</td></tr>
    <tr><td lang="de"><b>schlendern</b></td><td>ধীরে, গা ছেড়ে</td><td>ঘুরে বেড়ানো</td></tr>
    <tr><td lang="de"><b>eilen</b></td><td>দ্রুত, তাড়ায়</td><td>তাড়াহুড়ো করা</td></tr>
    <tr><td lang="de"><b>steigen</b></td><td>উপরে বা নিচে</td><td>চড়া, নামা</td></tr>
  </tbody>
</table>
</div>

<h2>সূক্ষ্ম পার্থক্য</h2>

<div class="split">
  <div class="do">
    <h5>বলার পরিবার</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">sagen</b><span>বলা</span></p>
      <p class="satz"><b lang="de">erzählen</b><span>গল্প করা</span></p>
      <p class="satz"><b lang="de">behaupten</b><span>দাবি করা</span></p>
      <p class="satz"><b lang="de">erwähnen</b><span>উল্লেখ করা</span></p>
      <p class="satz"><b lang="de">flüstern</b><span>ফিসফিস করা</span></p>
    </div>
  </div>
  <div class="others">
    <h5>মাত্রার সিঁড়ি</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">schön → hübsch → wunderschön</b><span>সুন্দর → মিষ্টি → অপূর্ব</span></p>
      <p class="satz"><b lang="de">gut → toll → hervorragend</b><span>ভালো → দারুণ → অসাধারণ</span></p>
      <p class="satz"><b lang="de">müde → erschöpft</b><span>ক্লান্ত → নিঃশেষ</span></p>
      <p class="satz"><b lang="de">froh → glücklich → begeistert</b><span>খুশি → সুখী → উচ্ছ্বসিত</span></p>
    </div>
  </div>
</div>

<div class="merke">নতুন শব্দ শেখার সময় একা নয়, তার দুই-এক ভাই-প্রতিশব্দসহ
শেখো। তাতে শব্দটা মনেও থাকে বেশি, কারণ সে একা দাঁড়িয়ে থাকে না।</div>

<h2>বাগধারা: সংস্কৃতির উপহার</h2>

<p>কয়েকটা জানলে কথায় উষ্ণতা আর রঙ আসে। এগুলো হৃদয় থেকে বলা যায়, আর তখন তুমি
বইয়ের মতো নয়, মানুষের মতো শোনাও।</p>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>বাগধারা</th><th>মানে</th><th>আক্ষরিক</th></tr></thead>
  <tbody>
    <tr><td lang="de">Ich verstehe nur Bahnhof.</td><td>কিছুই বুঝছি না।</td>
        <td>'শুধু স্টেশন বুঝি'!</td></tr>
    <tr><td lang="de">Ich drücke dir die Daumen.</td><td>তোমার জন্য শুভকামনা।</td>
        <td>'আঙুল চেপে রাখছি'।</td></tr>
    <tr><td lang="de">Das ist mir Wurst.</td><td>আমার কিছু যায় আসে না।</td>
        <td>'ওটা আমার কাছে সসেজ'!</td></tr>
    <tr><td lang="de">Du gehst mir auf die Nerven.</td><td>তুমি আমাকে জ্বালাচ্ছো।</td>
        <td>স্নায়ুতে চাপ দেওয়া।</td></tr>
    <tr><td lang="de">Alles hat ein Ende.</td><td>সবকিছুর শেষ আছে।</td>
        <td>সান্ত্বনার প্রবাদ।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">তিনটা শেখো, আর হাসিমুখে বলো। বাগধারা মুখস্থ করে ঠেসে দিলে
কৃত্রিম শোনায়; ঠিক জায়গায় একটা বললে মানুষ হেসে ফেলে।</div>
`,

diplomatie: `
<p>B2 থেকে C1-এর সূক্ষ্মতাটা এখানেই: সত্য বলা নয় শুধু, কীভাবে বলা। একটা শব্দ
<span lang="de">vielleicht</span> একটা কড়া বাক্যের দরজাটা খোলা রাখে।</p>

<h2>জোর কমানো</h2>

<p>পরিণত বক্তা নিজের কথাকে নরম করে। এটা দুর্বলতা নয়, জায়গা রাখা: অন্যজনের
উত্তর দেওয়ার জায়গা।</p>

<div class="split">
  <div class="do">
    <h5><span lang="de">Abschwächen</span> · নরম করা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Es könnte sein, dass…</b><span>হতে পারে যে…</span></p>
      <p class="satz"><b lang="de">Ich würde sagen, …</b><span>আমি বরং বলব…</span></p>
      <p class="satz"><b lang="de">Vielleicht / eher / eigentlich</b><span>হয়তো / বরং / আসলে</span></p>
      <p class="satz"><b lang="de">Das ist nicht ganz richtig.</b><span>এটা পুরোপুরি ঠিক নয়।</span></p>
      <p class="satz"><b lang="de">Ich bin mir nicht ganz sicher.</b><span>আমি পুরোপুরি নিশ্চিত নই।</span></p>
      <p class="satz"><b lang="de">sozusagen / gewissermaßen</b><span>একরকম / অনেকটা</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">Diplomatisch</span> · ভদ্র দ্বিমত</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Da bin ich nicht ganz Ihrer Meinung.</b><span>এ ব্যাপারে পুরোপুরি একমত নই।</span></p>
      <p class="satz"><b lang="de">Ich sehe das etwas anders.</b><span>আমি একটু অন্যভাবে দেখি।</span></p>
      <p class="satz"><b lang="de">Verstehe ich Sie richtig, dass…?</b><span>ঠিক বুঝলাম কি, যে…?</span></p>
      <p class="satz"><b lang="de">Das ist ein guter Punkt, aber…</b><span>ভালো কথা, তবে…</span></p>
      <p class="satz"><b lang="de">Darf ich kurz etwas ergänzen?</b><span>একটু যোগ করতে পারি?</span></p>
      <p class="satz"><b lang="de">Ich verstehe Ihren Standpunkt.</b><span>আপনার দৃষ্টিভঙ্গি বুঝি।</span></p>
    </div>
  </div>
</div>

<div class="merke">খেয়াল করো, প্রায় প্রতিটা নরম বাক্যে একটা
<span lang="de">nicht ganz</span> বা <span lang="de">etwas</span> আছে।
'পুরোপুরি নয়' আর 'একটু' এই দুটোই কূটনীতির আসল যন্ত্র।</div>

<div class="merke">আর <a href="/deutsch/stufe-3/konjunktiv.html">Konjunktiv</a>
এখানেই সোনা ফলায়: <span lang="de">Ich würde sagen</span>,
<span lang="de">Es könnte sein</span>, <span lang="de">Hätten Sie…?</span>
নরম কোটটা তুমি স্তর ৩-এই পেয়ে গেছো, এখানে শুধু ঠিক জায়গায় পরছো।</div>

<h2>একটা কথা মনে রাখার মতো</h2>

<p>দুটো বাক্য পাশাপাশি রাখো:</p>

<div class="table-scroll">
<table class="paar-tabelle">
  <thead><tr><th>শুদ্ধ, কিন্তু কড়া</th><th>শুদ্ধ, আর দরজা খোলা</th><th>তফাত</th></tr></thead>
  <tbody>
    <tr><td lang="de">Das ist falsch.</td><td lang="de">Das ist nicht ganz richtig.</td>
        <td>একই কথা, কিন্তু আলোচনা চলতে থাকে।</td></tr>
    <tr><td lang="de">Ich bin dagegen.</td><td lang="de">Ich sehe das etwas anders.</td>
        <td>বিরোধিতা নয়, ভিন্ন দৃষ্টিভঙ্গি।</td></tr>
    <tr><td lang="de">Nein.</td><td lang="de">Das wäre schwierig für mich.</td>
        <td>না বলা হলো, কিন্তু সম্পর্কটা থাকল।</td></tr>
  </tbody>
</table>
</div>

<p>এটাই পরিণত কণ্ঠ। আর এই স্তরের নিয়ম নম্বর পাঁচ ঠিক এই কথাটাই বলে: শুধু তথ্য
নয়, সূক্ষ্মতা।</p>
`,

/* ------------------------------------------------------------
   পৃথিবী ও লেখা
   ------------------------------------------------------------ */

eroerterung: `
<p>স্তর ২-এ চার ধাপ, স্তর ৩-এ পাঁচ। এখানে ছয়, আর বিষয়টাও বদলেছে: এখন তুমি
বিমূর্ত জিনিস নিয়ে কথা বলবে। পরিবেশ, প্রযুক্তি, সমাজ।</p>

<h2>ছয় ধাপে একটা যুক্তি</h2>

<div class="table-scroll">
<table class="routine">
  <thead><tr><th>ধাপ</th><th>বাক্য</th><th>কাজ</th></tr></thead>
  <tbody>
    <tr><td class="mono" lang="de">EINLEITUNG</td>
        <td lang="de">Heute wird viel über … diskutiert.</td>
        <td>ভূমিকা: বিষয়টা তোলো। খেয়াল করো, প্রায়ই
        <a href="/deutsch/stufe-4/passiv.html">Passiv</a>-এ।</td></tr>
    <tr><td class="mono" lang="de">ARGUMENT</td>
        <td lang="de">Einerseits spricht dafür, dass …</td>
        <td>একদিকের যুক্তি, কারণসহ।</td></tr>
    <tr><td class="mono" lang="de">BEISPIEL</td>
        <td lang="de">Ein gutes Beispiel dafür ist …</td>
        <td>উদাহরণ: যুক্তিকে মাটিতে নামাও।</td></tr>
    <tr><td class="mono" lang="de">GEGENSEITE</td>
        <td lang="de">Andererseits könnte man einwenden, dass …</td>
        <td>বিপরীত পক্ষ, Konjunktiv-এ নরম করে।</td></tr>
    <tr><td class="mono" lang="de">ABWÄGUNG</td>
        <td lang="de">Zwar …, aber letztlich wiegt … schwerer.</td>
        <td>ওজন করা: মেনে নাও, তারপর সিদ্ধান্তে ঝোঁকো।</td></tr>
    <tr><td class="mono" lang="de">FAZIT</td>
        <td lang="de">Alles in allem bin ich der Meinung, dass …</td>
        <td>উপসংহার: স্পষ্ট অবস্থান।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">এটা ঝগড়া নয়, একটা নির্মাণ। প্রতিটা ধাপ একটা ইট: পক্ষে,
উদাহরণ, বিপক্ষে, ওজন, উপসংহার। C1-এ এভাবেই ভাবা হয়।</div>

<h2>যে বাক্যগুলো বারবার লাগবে</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">In letzter Zeit wird viel über … gesprochen.</b><span>সম্প্রতি … নিয়ে অনেক কথা হচ্ছে।</span></p>
  <p class="satz"><b lang="de">Man muss zwischen … und … unterscheiden.</b><span>…আর…-এর মধ্যে তফাত করা দরকার।</span></p>
  <p class="satz"><b lang="de">Meiner Ansicht nach liegt das daran, dass …</b><span>আমার মতে এর কারণ…</span></p>
  <p class="satz"><b lang="de">Es hängt stark davon ab, wie …</b><span>এটা অনেকটাই নির্ভর করে কীভাবে…</span></p>
  <p class="satz"><b lang="de">Das lässt sich nicht pauschal sagen.</b><span>এটা ঢালাওভাবে বলা যায় না।</span></p>
  <p class="satz"><b lang="de">Es gibt gute Argumente für beide Seiten.</b><span>দুই পক্ষেই ভালো যুক্তি আছে।</span></p>
  <p class="satz"><b lang="de">Letztlich ist es eine Frage der Balance.</b><span>শেষমেশ এটা ভারসাম্যের ব্যাপার।</span></p>
  <p class="satz"><b lang="de">Da bin ich eher skeptisch.</b><span>এ ব্যাপারে আমি বরং সন্দিহান।</span></p>
</div>

<h2>আজকের কাজ</h2>

<p>একটা বিষয় নাও, ছয় ধাপে দুই থেকে তিন মিনিট বলো, রেকর্ড করো। প্রতিবার অন্তত
একটা <a href="/deutsch/stufe-4/passiv.html">Passiv</a>, একটা Konjunktiv আর
একটা <a href="/deutsch/stufe-4/konnektoren.html">সূক্ষ্ম সংযোগ</a> রাখার চেষ্টা
করো, তারপর শুনে মিলিয়ে দেখো।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Sollte man das Auto in Städten verbieten?</b><span>শহরে গাড়ি কি নিষিদ্ধ করা উচিত?</span></p>
  <p class="satz"><b lang="de">Macht die Technik uns einsamer?</b><span>প্রযুক্তি কি আমাদের একা করে দিচ্ছে?</span></p>
  <p class="satz"><b lang="de">Ist Homeoffice besser als Büroarbeit?</b><span>বাসা থেকে কাজ কি অফিসের চেয়ে ভালো?</span></p>
  <p class="satz"><b lang="de">Sollte Bildung immer kostenlos sein?</b><span>শিক্ষা কি সবসময় বিনামূল্যে হওয়া উচিত?</span></p>
  <p class="satz"><b lang="de">Schadet Social Media der Gesellschaft?</b><span>সোশ্যাল মিডিয়া কি সমাজের ক্ষতি করছে?</span></p>
  <p class="satz"><b lang="de">Braucht jeder Mensch eine Fremdsprache?</b><span>প্রত্যেকেরই কি একটা বিদেশি ভাষা দরকার?</span></p>
</div>
`,

textsorten: `
<p>এই স্তরের নিয়ম নম্বর চার: সপ্তাহে একটা লেখা। কিন্তু কী ধরনের লেখা? চার
রকম, আর প্রতিটার নিজস্ব কণ্ঠ।</p>

<h2>চার ধরন</h2>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th lang="de">Textsorte</th><th>কণ্ঠ ও চিহ্ন</th><th>বাংলায়</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>Nachricht</b></td>
        <td lang="de">Passiv, sachlich, W-Fragen zuerst.</td>
        <td>খবর: নৈর্ব্যক্তিক, Passiv-ময়। কী, কে, কখন, কোথায় আগে।</td></tr>
    <tr><td lang="de"><b>Kommentar</b></td>
        <td lang="de">Meinung + Argumente + Appell.</td>
        <td>মতামত: লেখকের অবস্থান, যুক্তি, শেষে আহ্বান।</td></tr>
    <tr><td lang="de"><b>Formeller Brief</b></td>
        <td lang="de">Sehr geehrte … / Anliegen / Bitte / Gruß.</td>
        <td>আনুষ্ঠানিক চিঠি: সম্বোধন, বিষয়, অনুরোধ, সমাপ্তি।</td></tr>
    <tr><td lang="de"><b>Zusammenfassung</b></td>
        <td lang="de">Kürzer, eigene Worte, kein Zitat.</td>
        <td>সারাংশ: ছোট, নিজের ভাষায়, মূল ভাবটাই।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">পদ্ধতিটা সহজ: এক সপ্তাহ একটা ধরন পড়ো, তারপর নকল করে লেখো।
ভেতর থেকে তার কণ্ঠ শিখবে, নিয়ম হিসেবে নয়, অনুভব হিসেবে।</div>

<h2>অভিযোগ-চিঠির কঙ্কাল</h2>

<p>সবচেয়ে কাজে লাগে এটাই, আর এখানে ভদ্রতা আর দৃঢ়তা একসাথে লাগে।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Sehr geehrte Damen und Herren,</b><span>সম্বোধন, নাম না জানলে।</span></p>
  <p class="satz"><b lang="de">Leider muss ich Ihnen mitteilen, dass …</b><span>দুঃখিত, জানাতে হচ্ছে যে…</span></p>
  <p class="satz"><b lang="de">Es gab ein Problem mit …</b><span>…নিয়ে একটা সমস্যা হয়েছিল।</span></p>
  <p class="satz"><b lang="de">Ich bitte Sie, das zu überprüfen.</b><span>অনুরোধ, একটু দেখে নিন।</span></p>
  <p class="satz"><b lang="de">Ich würde eine schnelle Lösung sehr begrüßen.</b><span>দ্রুত একটা সমাধান পেলে খুশি হতাম।</span></p>
  <p class="satz"><b lang="de">Mit freundlichen Grüßen</b><span>বিনীত।</span></p>
</div>

<div class="merke">সোনালি লাইনটা হলো
<span lang="de">Leider muss ich Ihnen mitteilen, dass …</span>: ভদ্র, দৃঢ় আর
স্পষ্ট, একসাথে তিনটাই।</div>

<h2>সারাংশ লেখার নিয়ম</h2>

<p>সারাংশে তিনটা জিনিস করা যায় না: উদ্ধৃতি দেওয়া, নিজের মত ঢোকানো, আর মূল
লেখার বাক্য হুবহু তুলে দেওয়া। বাকিটা তোমার।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">In dem Text geht es um …</b><span>লেখাটা … নিয়ে।</span></p>
  <p class="satz"><b lang="de">Der Autor schreibt, dass …</b><span>লেখক লিখেছেন যে…</span></p>
  <p class="satz"><b lang="de">Zusammenfassend lässt sich sagen, dass …</b><span>সংক্ষেপে বলা যায় যে…</span></p>
</div>
`,

satzbank: `
<p>শেষ বাক্য-ব্যাংক, আর এখানকার বাক্যগুলো সবচেয়ে বেশি কাজে লাগবে সেই দিনগুলোয়
যেদিন ভাষাটা আর অনুশীলন নয়, দরকার।</p>

<h2><span lang="de">Bewerbungsgespräch</span> · চাকরির সাক্ষাৎকার</h2>

<div class="split">
  <div class="do">
    <h5>নিজেকে উপস্থাপন</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich bringe mehrjährige Erfahrung mit.</b><span>আমার কয়েক বছরের অভিজ্ঞতা আছে।</span></p>
      <p class="satz"><b lang="de">Zu meinen Stärken zählt, dass ich …</b><span>আমার শক্তির একটা: আমি…</span></p>
      <p class="satz"><b lang="de">Ich arbeite sowohl selbstständig als auch im Team.</b><span>একা ও দলে, দুটোতেই কাজ করি।</span></p>
      <p class="satz"><b lang="de">Ich würde mich gern weiterentwickeln.</b><span>আমি আরও এগোতে চাইতাম।</span></p>
      <p class="satz"><b lang="de">An dieser Stelle reizt mich besonders …</b><span>এই পদে আমাকে বিশেষভাবে টানে…</span></p>
      <p class="satz"><b lang="de">Ich bin belastbar und lerne schnell.</b><span>আমি চাপ নিতে পারি, দ্রুত শিখি।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>প্রশ্ন ও সমাপ্তি</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Wie sieht ein typischer Arbeitstag aus?</b><span>সাধারণ কর্মদিবস কেমন?</span></p>
      <p class="satz"><b lang="de">Welche Entwicklungsmöglichkeiten gibt es?</b><span>এগোনোর কী সুযোগ আছে?</span></p>
      <p class="satz"><b lang="de">Wie ist das Team aufgestellt?</b><span>দলটা কেমন সাজানো?</span></p>
      <p class="satz"><b lang="de">Wann könnte ich mit einer Rückmeldung rechnen?</b><span>কবে উত্তর আশা করতে পারি?</span></p>
      <p class="satz"><b lang="de">Vielen Dank für das aufschlussreiche Gespräch.</b><span>তথ্যপূর্ণ আলোচনার জন্য ধন্যবাদ।</span></p>
      <p class="satz"><b lang="de">Ich freue mich auf Ihre Rückmeldung.</b><span>আপনার উত্তরের অপেক্ষায় রইলাম।</span></p>
    </div>
  </div>
</div>

<div class="merke">শেষ বাক্যটা খেয়াল করো:
<span lang="de">sich freuen <b>auf</b></span>, সেই
<a href="/deutsch/stufe-4/verben-praeposition.html">জোড়াগুলোর</a> একটা। এখানেই
জোড়া শেখার ফল।</div>

<h2><span lang="de">Über Gesellschaft sprechen</span> · সমাজ নিয়ে আলাপ</h2>

<div class="split">
  <div class="do">
    <h5>বিষয় তোলা ও মত</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">In letzter Zeit wird viel über … gesprochen.</b><span>সম্প্রতি … নিয়ে অনেক কথা হচ্ছে।</span></p>
      <p class="satz"><b lang="de">Ein großes Thema unserer Zeit ist …</b><span>আমাদের সময়ের একটা বড় বিষয়…</span></p>
      <p class="satz"><b lang="de">Meiner Ansicht nach liegt das daran, dass …</b><span>আমার মতে এর কারণ…</span></p>
      <p class="satz"><b lang="de">Das lässt sich nicht pauschal sagen.</b><span>এটা ঢালাওভাবে বলা যায় না।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>ভারসাম্য ও সতর্কতা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Einerseits …, andererseits …</b><span>একদিকে…, অন্যদিকে…</span></p>
      <p class="satz"><b lang="de">Man sollte nicht vergessen, dass …</b><span>ভুলে গেলে চলবে না যে…</span></p>
      <p class="satz"><b lang="de">Ich möchte das nicht verallgemeinern.</b><span>আমি এটা সাধারণীকরণ করতে চাই না।</span></p>
      <p class="satz"><b lang="de">Letztlich ist es eine Frage der Balance.</b><span>শেষমেশ এটা ভারসাম্যের ব্যাপার।</span></p>
    </div>
  </div>
</div>

<h2><span lang="de">Beschwerde &amp; Konflikt</span> · অভিযোগ ও মতভেদ</h2>

<div class="split">
  <div class="do">
    <h5>সমস্যা তোলা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Leider muss ich mich beschweren.</b><span>দুঃখিত, আমাকে অভিযোগ করতে হচ্ছে।</span></p>
      <p class="satz"><b lang="de">Das entspricht nicht dem, was vereinbart war.</b><span>যা ঠিক হয়েছিল, এটা তা নয়।</span></p>
      <p class="satz"><b lang="de">Ich hatte etwas anderes erwartet.</b><span>আমি অন্যকিছু আশা করেছিলাম।</span></p>
      <p class="satz"><b lang="de">Ich bitte Sie, das zu überprüfen.</b><span>অনুরোধ, একটু দেখে নিন।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>সমাধানের দিকে</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Könnten wir eine Lösung finden?</b><span>আমরা কি একটা সমাধানে আসতে পারি?</span></p>
      <p class="satz"><b lang="de">Ich schlage vor, dass wir …</b><span>আমি প্রস্তাব করি, আমরা…</span></p>
      <p class="satz"><b lang="de">Vielleicht gibt es einen Kompromiss.</b><span>হয়তো একটা মাঝামাঝি পথ আছে।</span></p>
      <p class="satz"><b lang="de">Ich hoffe auf Ihr Verständnis.</b><span>আপনার বোঝাপড়ার আশা রাখি।</span></p>
    </div>
  </div>
</div>

<div class="merke">অভিযোগের পুরো কৌশলটা এক লাইনে: সমস্যা বলো নৈর্ব্যক্তিকভাবে,
সমাধান চাও ব্যক্তিগতভাবে। রাগ নয়, প্রত্যাশা।</div>
`,

plan: `
<p>শেষ মানচিত্র। ৩০, ৬০, ৯০ পেরিয়ে এবার ১২০ দিন, আর এটাই সবচেয়ে দীর্ঘ। কারণ
নিখুঁততা তাড়াহুড়োর জিনিস নয়, ঘষামাজার।</p>

<h2>চার ধাপ, একশো বিশ দিন</h2>

<div class="table-scroll">
<table class="karte">
  <thead><tr><th>দিন</th><th lang="de">Ebene</th><th lang="de">Fokus</th><th>যা পারবে</th></tr></thead>
  <tbody>
    <tr><td class="mono">১–৩০</td><td lang="de">DIE ZEIT</td>
        <td lang="de">Passiv · Plusquamperfekt · hätte gemacht · indirekte Rede</td>
        <td>খবরের কণ্ঠ, অতীতের-অতীত, আক্ষেপ।</td></tr>
    <tr><td class="mono">৩১–৬০</td><td lang="de">DIE LOGIK</td>
        <td lang="de">Verben + Präposition · je…desto · indem · sodass</td>
        <td>নিখুঁত সংযোগ ও নির্ভুল যুক্তি।</td></tr>
    <tr><td class="mono">৬১–৯০</td><td lang="de">DER TON</td>
        <td lang="de">Modalpartikeln · Nominalstil · Redewendungen · Diplomatie</td>
        <td>সুর, সূক্ষ্মতা, বাগধারা, কূটনীতি।</td></tr>
    <tr><td class="mono">৯১–১২০</td><td lang="de">DIE WELT</td>
        <td lang="de">Diskutieren · Textsorten · Satzbanken</td>
        <td>বিমূর্ত তর্ক, আসল লেখা, স্বাধীন জীবন।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">এই স্তরে কোনো অনুশীলন খাতা নেই, আর সেটাই এখানকার পাঠ।
আগের তিন স্তরে অনুশীলন ছিল একটা পাতা, যেটা ভরাতে হতো। এখন অনুশীলন হলো একটা খবর
যেটা পড়তে হবে, একটা তর্ক যেটা করতে হবে, আর একটা বই যেটা শেষ করতে হবে।</div>

<h2>রোজকার এক ঘণ্টা</h2>

<div class="table-scroll">
<table class="routine">
  <thead><tr><th>কত</th><th>কী</th><th>কেন</th></tr></thead>
  <tbody>
    <tr><td class="mono">১৫ মি</td><td lang="de">Lesen: খবর বা মতামত + নতুন শব্দ জোড়ায়</td>
        <td>Passiv আর indirekte Rede এখানেই জীবন্ত।</td></tr>
    <tr><td class="mono">১৫ মি</td><td>নতুন <span lang="de">Muster</span> + নিজের বাক্য</td>
        <td>ছাঁচ নাও, নিজের জীবন ঢালো। এটা চার স্তরেই এক।</td></tr>
    <tr><td class="mono">১৫ মি</td><td lang="de">Sprechen: তর্ক বা গল্প, রেকর্ড</td>
        <td>ছয় ধাপের কাঠামোয়, দুই মিনিট।</td></tr>
    <tr><td class="mono">১০ মি</td><td lang="de">Hören + Schatten-Sprechen</td>
        <td>পডকাস্ট শুনে হুবহু পিছু পিছু বলা।</td></tr>
    <tr><td class="mono">৫ মি</td><td lang="de">Schreiben: এক অনুচ্ছেদ</td>
        <td>লেখা চিন্তাকে ধারালো করে।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">নতুন অভ্যাস: <b lang="de">Wort-mit-Ohr</b>. আসল কথায় শোনা
Modalpartikel আর প্রতিশব্দগুলো 'চুরি' করে খাতায় তোলো। এই স্তরে শব্দ শেখা হয়
কান দিয়ে, তালিকা দিয়ে নয়।</div>

<p>এই স্তরের, আর সম্পূর্ণ ফ্রি: <span lang="de">DW Top-Thema</span> ও
<span lang="de">Nachrichtenleicht</span>, <span lang="de">Tagesschau</span>,
পডকাস্ট <span lang="de">Auf Deutsch gesagt!</span>, আর জার্মানে তোমার প্রথম বই।</p>

<h2>ছয় নিয়ম</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">Lies echte Nachrichten, täglich.</b><span>রোজ আসল খবর পড়ো।</span></p>
  <p class="satz"><b lang="de">Sammle Modalpartikeln nach Gefühl.</b><span>অনুভব দিয়ে জমাও, অনুবাদ দিয়ে নয়।</span></p>
  <p class="satz"><b lang="de">Sag es genauer.</b><span>'gehen' নয়: spazieren, wandern, schlendern?</span></p>
  <p class="satz"><b lang="de">Schreib jede Woche einen Text.</b><span>সপ্তাহে একটা লেখা: মত, চিঠি বা সারাংশ।</span></p>
  <p class="satz"><b lang="de">Sprich in Nuancen, nicht in Fakten.</b><span>'হয়তো', 'একরকম', 'আমি বরং বলব'।</span></p>
  <p class="satz"><b lang="de">Lebe die Sprache. Hör auf, sie zu lernen.</b><span>একটা বই, একটা সিরিজ, একটা বন্ধুত্ব, জার্মানে।</span></p>
</div>

<h2>সাতটা ভুল আর তার ওষুধ</h2>

<div class="table-scroll">
<table class="paar-tabelle">
  <thead><tr><th>❌ যা হয়</th><th>✅ যা ঠিক</th><th>কারণ</th></tr></thead>
  <tbody>
    <tr><td lang="de">Es ist gebaut geworden.</td><td lang="de">Es ist gebaut worden.</td>
        <td>Passiv-Perfekt-এ <span lang="de">worden</span>, <span lang="de">geworden</span> নয়।</td></tr>
    <tr><td lang="de">Du hättest angerufen.</td><td lang="de">Du hättest anrufen sollen.</td>
        <td>modal-সহ শেষে দুই মূল-রূপ।</td></tr>
    <tr><td lang="de">Ich warte für den Bus.</td><td lang="de">Ich warte auf den Bus.</td>
        <td>ক্রিয়া আর আঠা-শব্দ জোড়ায় শেখো, ইংরেজি অনুবাদ কোরো না।</td></tr>
    <tr><td lang="de">Je mehr, desto ich lerne.</td><td lang="de">Je mehr ich lerne, desto …</td>
        <td><span lang="de">je</span>-অংশে ক্রিয়া শেষে।</td></tr>
    <tr><td>(Modalpartikeln এড়িয়ে যাওয়া)</td><td lang="de">Komm doch mal!</td>
        <td>এগুলো ছাড়া কথা শুদ্ধ, কিন্তু শীতল।</td></tr>
    <tr><td>(সব কিছু ঢালাও বলা)</td><td lang="de">Das kommt darauf an.</td>
        <td>সূক্ষ্মতাই পরিণততা।</td></tr>
    <tr><td>(নিখুঁত হতে গিয়ে থেমে যাওয়া)</td><td>সাবলীলতা আগে, এখনো</td>
        <td>প্রবাহই লক্ষ্য, চার স্তর পরেও।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">এই স্তরের সবচেয়ে সূক্ষ্ম ভুলটা ব্যাকরণের নয়: 'ঠিক' জার্মান
বলা, কিন্তু 'উষ্ণ' জার্মান নয়। ছোট শব্দ আর সঠিক সুরই তোমাকে মানুষ করে তোলে।</div>

<h2>শেষে যা থাকে</h2>

<p>শুরুতে প্রতিটা শব্দ ছিল দেয়াল। তারপর সেতু, তারপর নদী। এখন এটা একটা তুলি:
তুমি শুধু কী বলবে তা নয়, কীভাবে বলবে সেটাও বেছে নাও। সুর, রঙ, আর সেই ছোট্ট
<span lang="de">doch</span>, যেটা একটা বাক্যকে আলিঙ্গন বানিয়ে দেয়।</p>

<p>তুমি আর জার্মান বলো না। তুমি জার্মানে আঁকো।</p>
`,

};
