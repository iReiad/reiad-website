/* ============================================================
   content/stufe-1.js: the text of Stufe 1.

   Keys match the Teil slugs in ../curriculum.js. The value is
   the body of the page: everything between the standfirst and
   the footer nav. build-deutsch.mjs wraps it in the shared
   shell, so nothing here repeats the header, the fonts or the
   modal reader.

   HOUSE STYLE: the same rules the course itself teaches by:

     · Bangla is the language of explanation; German is the thing
       being explained. Never the other way round.
     · address the learner as তুমি, not আপনি. The rest of the
       site says আপনি because it is talking to an adult about
       their money; this is a language course a teenager is
       meant to read at night, and the deck it comes from says
       তুমি throughout. Consistency with the source beats
       consistency with the finance pages.
     · every German word is wrapped in lang="de" so the browser
       hyphenates and reads it correctly
     · every rule is followed by examples you could say today
     · <div class="muster"> for the pattern of the section: the
       shape itself, before any explanation of it
     · <div class="satz-list"> for German line + Bangla meaning
     · <div class="merke"> for the one line worth remembering,
       <div class="merke warn"> when it is a trap
     · <span class="hut" data-hut="der|die|das"> for the three
       article colours, which are the same three colours the
       workbook asks the learner to write in
     · tables live inside <div class="table-scroll">
   ============================================================ */

export default {

/* ------------------------------------------------------------
   শুরুর আগে
   ------------------------------------------------------------ */

anfang: `
<p>তুমি একবার এই পথ হেঁটেছো। শূন্য থেকে শুরু করে এমন একটা ভাষায় সত্যিকারের বাক্য বলা শিখেছো,
যেটা একসময় অসম্ভব মনে হতো। জার্মান কঠিন নয়, শুধু নতুন। আর এবার তুমি রাস্তাটা চেনো।</p>

<p>তাই শুরুর আগে দুটো জিনিস: জার্মান তোমাকে যে চারটা উপহার আগেই দিয়ে রেখেছে, আর যে ছয়টা
নিয়ম মানলে ৩০ দিনে সত্যি কিছু হবে।</p>

<h2>চারটা উপহার · Vier Geschenke</h2>

<p>জার্মান তোমার সাথে ইংরেজির চেয়ে ভদ্র ব্যবহার করবে। কেন, সেটা এখানে।</p>

<h3>১. <span lang="de">du · ihr · Sie</span>: তুমি, তোমরা, আপনি</h3>
<p>ইংরেজি সবাইকে এক করে <i>you</i> বানিয়ে দিয়েছিল। বন্ধু, শিক্ষক, অচেনা লোক: সবাই এক।
বাংলায় যে সম্মানবোধটা তোমার স্বাভাবিক, ইংরেজিতে সেটা হারিয়ে যেত। জার্মানে তিনটাই আলাদা
আছে, ঠিক বাংলার মতো। এই অনুভূতিটা তোমার চেনা, তাই এটা শিখতে হবে না: মনে করলেই হবে।</p>

<h3>২. যেমন বানান, তেমন উচ্চারণ</h3>
<p>ইংরেজি বানান ছিল ধাঁধা: <i>though</i>, <i>through</i>, <i>tough</i>: একই অক্ষরগুচ্ছ,
তিন রকম উচ্চারণ। জার্মান সৎ। অক্ষর যা বলে, মুখ তাই বলে। নিয়মগুলো একবার শিখলে জীবনে
না-দেখা শব্দও জোরে পড়তে পারবে। সেই নিয়মগুলো আছে
<a href="/deutsch/stufe-1/laute.html">পরের Teil-এ</a>।</p>

<h3>৩. ক্রিয়া মানুষ চেনে</h3>
<p>বাংলায় তুমি বলো: আমি খাই, তুমি খাও, সে খায়। ক্রিয়াটা কে করছে তার সাথে বদলায়। জার্মানও
তাই করে: <span lang="de">ich esse, du isst, er isst</span>। ইংরেজি এই খেলাটা প্রায় ছেড়েই
দিয়েছিল (শুধু <i>he eats</i>-এ একটা s)। জার্মান এদিক থেকে ইংরেজির চেয়ে তোমার মাতৃভাষার
বেশি কাছের।</p>

<h3>৪. তোমার ইংরেজি এখন সেতু</h3>
<p>জার্মান আর ইংরেজি আপন খালাতো ভাই। প্রথম টার্মে ইংরেজি শিখতে যে পরিশ্রম করেছিলে,
সেটা এখন সুদসহ ফেরত আসবে।</p>

<div class="satz-list bruecke">
  <p class="satz"><b lang="de">Haus</b><span>= house</span></p>
  <p class="satz"><b lang="de">Wasser</b><span>= water</span></p>
  <p class="satz"><b lang="de">Mutter</b><span>= mother</span></p>
  <p class="satz"><b lang="de">Bruder</b><span>= brother</span></p>
  <p class="satz"><b lang="de">Buch</b><span>= book</span></p>
  <p class="satz"><b lang="de">trinken</b><span>= drink</span></p>
  <p class="satz"><b lang="de">helfen</b><span>= help</span></p>
  <p class="satz"><b lang="de">gut</b><span>= good</span></p>
</div>

<div class="merke">প্রথম টার্মের এক ফোঁটাও নষ্ট হয়নি। প্রতিটা ইংরেজি শব্দ এখন একটা টর্চ,
আর জার্মানের অন্ধকারে সেটা জ্বলবে।</div>

<h2>ছয়টা নিয়ম · Die sechs Regeln</h2>

<p>পাঁচটা ইংরেজি শেখার সময় থেকে চেনা। একটা একদম নতুন, আর সেটাই সবচেয়ে জরুরি।</p>

<div class="table-scroll">
<table>
  <thead>
    <tr><th>নিয়ম</th><th>মানে কী</th></tr>
  </thead>
  <tbody>
    <tr><td><b lang="de">Laut sprechen. Immer.</b></td>
        <td>সবসময় জোরে বলো। চুপচাপ পড়া = শূন্য। জার্মান মুখের ভাষা, মুখকেই শেখাও।</td></tr>
    <tr><td><b lang="de">Nie ein nacktes Nomen.</b> <span class="neu mono">নতুন</span></td>
        <td>জার্মান বিশেষ্য কখনো খালি গায়ে শিখো না, টুপিসহ শিখো। <span lang="de">Tisch</span> নয়,
            <span lang="de">der Tisch</span>। কেন, সেটা <a href="/deutsch/stufe-1/artikel.html">Teil ৭-এ</a>।</td></tr>
    <tr><td><b lang="de">Muster, nicht Sätze.</b></td>
        <td>বাক্য নয়, কাঠামো শেখো। একটা ছাঁচ = হাজার বাক্য।</td></tr>
    <tr><td><b lang="de">Zwanzig Mal tauschen.</b></td>
        <td>একই ছাঁচে ২০টা আলাদা শব্দ বসাও। তখনই সেটা হাতের হয়, মাথার নয়।</td></tr>
    <tr><td><b lang="de">Fehler sind der Weg.</b></td>
        <td>ভুলই রাস্তা। জার্মানরা নিজেরাই বলে: ভাঙা জার্মানে কথা বলা মানুষকে তারা সম্মান করে।</td></tr>
    <tr><td><b lang="de">Gestern zuerst, dann heute.</b></td>
        <td>নতুন শুরুর আগে গতকালেরটা একবার জোরে বলে নাও। প্রতিদিন। ব্যতিক্রম নেই।</td></tr>
  </tbody>
</table>
</div>

<h2>গোপন কথাটা: এক ছাঁচ, হাজার বাক্য</h2>

<p>সেই পুরনো জাদু, নতুন ভাষায়। একটা ছাঁচ শেখো, তারপর ফাঁকা ঘরে শব্দ বদলাতে থাকো। আজই,
প্রথম দিনেই, এটা দিয়ে তুমি সত্যিকারের কাজের বাক্য বলতে পারবে।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><b lang="de">Ich möchte</b> <i>________</i></p>
  <p class="muster-why">আমি ___ চাই। ফাঁকা ঘরে যা খুশি বসাও: জিনিসও বসে, কাজও বসে।</p>
</div>

<div class="split">
  <div class="do">
    <h5>জিনিস চাই</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich möchte Wasser.</b><span>আমি পানি চাই।</span></p>
      <p class="satz"><b lang="de">Ich möchte Tee.</b><span>আমি চা চাই।</span></p>
      <p class="satz"><b lang="de">Ich möchte Reis.</b><span>আমি ভাত চাই।</span></p>
      <p class="satz"><b lang="de">Ich möchte ein Buch.</b><span>আমি একটা বই চাই।</span></p>
      <p class="satz"><b lang="de">Ich möchte eine Pause.</b><span>আমি একটু বিরতি চাই।</span></p>
      <p class="satz"><b lang="de">Ich möchte das.</b><span>আমি ওটা চাই।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>কাজ করতে চাই</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich möchte schlafen.</b><span>আমি ঘুমাতে চাই।</span></p>
      <p class="satz"><b lang="de">Ich möchte essen.</b><span>আমি খেতে চাই।</span></p>
      <p class="satz"><b lang="de">Ich möchte lernen.</b><span>আমি শিখতে চাই।</span></p>
      <p class="satz"><b lang="de">Ich möchte Deutsch lernen.</b><span>আমি জার্মান শিখতে চাই।</span></p>
      <p class="satz"><b lang="de">Ich möchte nach Hause gehen.</b><span>আমি বাড়ি যেতে চাই।</span></p>
      <p class="satz"><b lang="de">Ich möchte sprechen.</b><span>আমি কথা বলতে চাই।</span></p>
    </div>
  </div>
</div>

<p>ডান কলামটা আরেকবার দেখো: কাজের শব্দটা প্রতিবার বাক্যের একদম শেষে বসেছে। এটা জার্মানের
স্বাক্ষর, আর এটার পুরো গল্প আছে <a href="/deutsch/stufe-1/modalverben.html">Teil ১০-এ</a>।
আজ শুধু ব্যবহার করো, ব্যাখ্যা পরে।</p>

<div class="merke"><b lang="de">Sprich schlecht. Sprich heute.</b> ভুলভাবে বলো, কিন্তু আজই বলো।
আজকের ভাঙা জার্মান কালকের নিখুঁত জার্মানের চেয়ে অনেক দামি, কারণ কালকেরটা কখনো আসে না।</div>
`,

/* ------------------------------------------------------------
   ধ্বনি
   ------------------------------------------------------------ */

laute: `
<p>জার্মান কথা রাখে: যা লেখা, তাই বলা। ইংরেজির মতো ধোঁকা নেই। তাই এই কোর্স ব্যাকরণ দিয়ে
শুরু হচ্ছে না, ধ্বনি দিয়ে শুরু হচ্ছে, আগে কান আর মুখ, পরে মাথা।</p>

<p>এই এক পাতা শেখা হয়ে গেলে তুমি যেকোনো জার্মান শব্দ জোরে পড়তে পারবে, এমনকি জীবনে
কোনোদিন না দেখা শব্দও। এটা ছোট প্রতিশ্রুতি নয়। ইংরেজিতে এই জিনিসটা কোনোদিন সম্ভব হয়নি।</p>

<h2>স্বরবর্ণ: পাঁচটা, আর দুটো নিয়ম</h2>

<p>স্বরগুলো সোজা: <b lang="de">a</b> = আ, <b lang="de">e</b> = এ, <b lang="de">i</b> = ই,
<b lang="de">o</b> = ও, <b lang="de">u</b> = উ। বাকিটা লম্বা না ছোট, সেটুকু।</p>

<ul>
  <li><b>লম্বা টান:</b> স্বরের পরে <b>h</b>, বা জোড়া স্বর।
      <span lang="de">wohnen</span> = ভোওনেন (থাকা)।</li>
  <li><b>ছোট স্বর:</b> পরে জোড়া ব্যঞ্জন।
      <span lang="de">kommen</span> = কম্‌মেন (আসা)।</li>
</ul>

<p>এটুকু জেনেই নিচের শব্দগুলো জোরে পড়ে ফেলো। প্রতিটা অক্ষর আলাদা করে বলো, জার্মান
কোনো অক্ষর গিলে ফেলে না।</p>

<ul class="wort-karten">
  <li><b lang="de">Name</b><span class="lautschrift">না-মে</span><span>নাম</span></li>
  <li><b lang="de">Brot</b><span class="lautschrift">ব্রোওট</span><span>রুটি</span></li>
  <li><b lang="de">Milch</b><span class="lautschrift">মিল্শ</span><span>দুধ</span></li>
  <li><b lang="de">gut</b><span class="lautschrift">গুট</span><span>ভালো</span></li>
  <li><b lang="de">Kind</b><span class="lautschrift">কিন্ট</span><span>শিশু · শেষের d = ট</span></li>
  <li><b lang="de">Tag</b><span class="lautschrift">টাক</span><span>দিন · শেষের g = ক</span></li>
</ul>

<h2>চারটা বিশেষ অক্ষর: ä ö ü ß</h2>

<p>ভয়ের কিছু নেই। <b lang="de">ö</b> আর <b lang="de">ü</b> নতুন ধ্বনি নয়, ঠোঁটের ব্যায়াম।
আয়নার সামনে দাঁড়িয়ে করো, দশবার করে।</p>

<div class="table-scroll">
<table>
  <thead><tr><th>অক্ষর</th><th>কীভাবে বলবে</th><th>উদাহরণ</th></tr></thead>
  <tbody>
    <tr><td><b lang="de">ä</b></td>
        <td>≈ এ্যা। সাধারণ 'এ'-র মতোই, একটু খোলা। সবচেয়ে সহজটা।</td>
        <td lang="de">spät (শ্পেট) · Mädchen (মেটশেন)</td></tr>
    <tr><td><b lang="de">ö</b></td>
        <td>মুখে 'এ' বলো, কিন্তু ঠোঁট গোল করো 'ও'-র মতো। এ + ও-ঠোঁট = ö।</td>
        <td lang="de">schön (শ্যোন) · hören (হ্যোরেন)</td></tr>
    <tr><td><b lang="de">ü</b></td>
        <td>মুখে 'ই' বলো, ঠোঁট গোল করো 'উ'-র মতো। ই + উ-ঠোঁট = ü।</td>
        <td lang="de">fünf (ফ্যুন্ফ) · Tür (ট্যুয়া) · müde (ম্যুদে)</td></tr>
    <tr><td><b lang="de">ß</b></td>
        <td>শুধু ডাবল-স (ss)। দেখতে B-এর মতো, কিন্তু B নয়! উচ্চারণে কোনো রহস্য নেই।</td>
        <td lang="de">heißen (হাইসেন) · Straße (শ্ট্রাসে)</td></tr>
  </tbody>
</table>
</div>

<div class="merke">আয়না-অনুশীলন: 'ই' বলতে বলতে ঠোঁট গোল করতে থাকো, <span lang="de">ü</span>
নিজেই বেরিয়ে আসবে। এটা শেখার জিনিস নয়, করার জিনিস।</div>

<h2>ব্যঞ্জনের চমক</h2>

<p>এই ক'টা জানলে জার্মান পড়া কার্যত শেষ। সবচেয়ে বড়টা এক নম্বরে:
<b lang="de">w</b> মানে <b>ভ</b>।</p>

<div class="table-scroll">
<table class="laut-key">
  <thead><tr><th>লেখা</th><th>বলা</th><th>উদাহরণ</th><th>মনে রাখার কৌশল</th></tr></thead>
  <tbody>
    <tr><td><b lang="de">w</b></td><td>ভ</td>
        <td lang="de">Wasser (ভাসা) · wohnen (ভোনেন)</td>
        <td>জার্মান w = ইংরেজি v। সবচেয়ে বড় চমক।</td></tr>
    <tr><td><b lang="de">v</b></td><td>ফ</td>
        <td lang="de">Vater (ফাটা) · viel (ফীল)</td>
        <td>v দেখলে ফ বলো।</td></tr>
    <tr><td><b lang="de">z</b></td><td>ৎস</td>
        <td lang="de">zehn (ৎসেন) · Zeit (ৎসাইট)</td>
        <td>ত + স একসাথে, দ্রুত।</td></tr>
    <tr><td><b lang="de">s</b> + স্বর</td><td>জ়</td>
        <td lang="de">sie (জ়ী) · sagen (জ়াগেন)</td>
        <td>স্বরের আগে s নরম হয়ে জ় হয়।</td></tr>
    <tr><td><b lang="de">sch</b></td><td>শ</td>
        <td lang="de">Schule (শূলে) · schön (শ্যোন)</td>
        <td>তিন অক্ষর মিলে এক 'শ'।</td></tr>
    <tr><td><b lang="de">st-</b> / <b lang="de">sp-</b></td><td>শ্ট / শ্প</td>
        <td lang="de">Stadt (শ্টাট) · sprechen (শ্প্রেশেন)</td>
        <td>শব্দের শুরুতে s = শ।</td></tr>
    <tr><td><b lang="de">j</b></td><td>ইয়</td>
        <td lang="de">ja (ইয়া) · jung (ইয়ুং)</td>
        <td>j কখনো 'জ' নয়।</td></tr>
    <tr><td><b lang="de">ch</b> (i/e-র পরে)</td><td>শ্‌ (হালকা)</td>
        <td lang="de">ich (ইশ্) · nicht (নিশ্ট)</td>
        <td>জিভ সামনে, হাওয়া ছাড়ো: বিড়ালের হিসের মতো।</td></tr>
    <tr><td><b lang="de">ch</b> (a/o/u-র পরে)</td><td>খ</td>
        <td lang="de">Buch (বুখ) · acht (আখট)</td>
        <td>গলার খ, বাংলার খ-ই।</td></tr>
    <tr><td><b lang="de">-er</b> (শেষে)</td><td>আ</td>
        <td lang="de">Mutter (মুটা) · Wasser (ভাসা)</td>
        <td>শেষের -er প্রায় 'আ' হয়ে যায়।</td></tr>
  </tbody>
</table>
</div>

<div class="merke"><b lang="de">r</b> গলা থেকে আসে, অনেকটা কুলকুচার মতো। না পারলে বাংলার
'র'-ই বলো, সবাই বুঝবে। এটা নিয়ে থেমে থেকো না, এক মাস পরে এমনিই আসবে।</div>

<h2>জোড়া-স্বর: ei · ie · au · eu</h2>

<p>চারটা জোড়া, আর একটা ছড়া যেটা মনে রাখলে দুটো সবচেয়ে বড় ভুল কোনোদিন হবে না:
<b>ei = আই, ie = ঈ</b>।</p>

<div class="table-scroll">
<table>
  <thead><tr><th>জোড়া</th><th>ধ্বনি</th><th>উদাহরণ</th><th>কৌশল</th></tr></thead>
  <tbody>
    <tr><td><b lang="de">ei</b></td><td>আই</td>
        <td lang="de">nein (নাইন) · eins (আইনস) · mein (মাইন)</td>
        <td>দ্বিতীয় অক্ষরের <i>নাম</i> বলো: i-এর নাম 'আই'।</td></tr>
    <tr><td><b lang="de">ie</b></td><td>ঈ (লম্বা)</td>
        <td lang="de">sie (জ়ী) · vier (ফীয়া) · Liebe (লীবে)</td>
        <td>দ্বিতীয় অক্ষরের <i>ধ্বনি</i>: e নেই, শুধু লম্বা ঈ।</td></tr>
    <tr><td><b lang="de">au</b></td><td>আউ</td>
        <td lang="de">Haus (হাউস) · Frau (ফ্রাউ) · kaufen (কাউফেন)</td>
        <td>বাংলার 'আউ'। সহজতম।</td></tr>
    <tr><td><b lang="de">eu</b> / <b lang="de">äu</b></td><td>অয়</td>
        <td lang="de">neun (নয়ন) · Deutsch (ডয়চ) · Häuser (হয়জা)</td>
        <td>ভাষার নামটাই এই ধ্বনি দিয়ে: ডয়চ!</td></tr>
  </tbody>
</table>
</div>

<h2>এবার পরীক্ষা: না দেখা শব্দ</h2>

<p>নিচের পাঁচটা শব্দ তুমি আগে কখনো দেখোনি। এখন জোরে পড়ো, তারপর মিলিয়ে নাও।</p>

<ul class="wort-karten">
  <li><b lang="de">Zeitung</b><span class="lautschrift">ৎসাইটুং</span><span>খবরের কাগজ</span></li>
  <li><b lang="de">Freund</b><span class="lautschrift">ফ্রয়ন্ট</span><span>বন্ধু</span></li>
  <li><b lang="de">Bäckerei</b><span class="lautschrift">বেকেরাই</span><span>বেকারি</span></li>
  <li><b lang="de">Entschuldigung</b><span class="lautschrift">এন্টশুলডিগুং</span><span>মাফ করবেন</span></li>
  <li><b lang="de">Wiedersehen</b><span class="lautschrift">ভীডারজ়েএন</span><span>আবার দেখা</span></li>
</ul>

<div class="merke">পেরেছো? তাহলে জার্মান পড়তে শেখা তোমার হয়ে গেছে। বাকি ২৯ দিন শুধু
বলার আর বোঝার। এই পাতাটা বুকমার্ক করে রাখো, আটকে গেলেই ফিরে এসো।</div>
`,

/* ------------------------------------------------------------
   বাক্যের ইঞ্জিন
   ------------------------------------------------------------ */

satzbau: `
<p>ইংরেজি শেখার প্রথম পাঠটা মনে আছে? বাংলায় ক্রিয়া বাক্যের শেষে বসে, ইংরেজিতে সামনে
এগিয়ে আসে। জার্মানেও ঠিক তাই, শুধু এখানে নিয়মটা আরও কড়া, আর সেই কড়া নিয়মটাই তোমার
বন্ধু, কারণ ব্যতিক্রম নেই।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape">কে · <b>কাজ</b> · কী</p>
  <p class="muster-why">বাংলা: আমি <i>ভাত</i> <b>খাই</b>: কাজটা শেষে।<br>
  জার্মান: <span lang="de">Ich <b>esse</b> Reis.</span>: কাজটা দুই নম্বরে।</p>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich esse Reis.</b><span>আমি ভাত খাই।</span></p>
  <p class="satz"><b lang="de">Ich trinke Wasser.</b><span>আমি পানি খাই।</span></p>
  <p class="satz"><b lang="de">Ich lerne Deutsch.</b><span>আমি জার্মান শিখি।</span></p>
  <p class="satz"><b lang="de">Ich wohne in Dhaka.</b><span>আমি ঢাকায় থাকি।</span></p>
</div>

<h2>আসন-দুই আইন · <span lang="de">Das Verb steht auf Platz zwei</span></h2>

<p>এবার আসল জিনিসটা। বাক্যে যা-ই আগে আসুক, ক্রিয়া <b>সবসময়</b> দ্বিতীয় আসনে বসবে।
বাকি সবাই সরে যাবে, ক্রিয়া নড়বে না। এক আসন, এক আইন।</p>

<div class="table-scroll">
<table class="platz-tabelle">
  <thead><tr><th>১</th><th>২ · ক্রিয়া</th><th>বাকি</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="de">Ich</td><td lang="de"><b>lerne</b></td><td lang="de">heute Deutsch.</td>
        <td>আমি আজ জার্মান শিখি। (সাধারণ)</td></tr>
    <tr><td lang="de">Heute</td><td lang="de"><b>lerne</b></td><td lang="de">ich Deutsch.</td>
        <td>'আজ' সামনে এলো, তাই <span lang="de">ich</span> পিছিয়ে গেল।</td></tr>
    <tr><td lang="de">Deutsch</td><td lang="de"><b>lerne</b></td><td lang="de">ich heute.</td>
        <td>'জার্মান' সামনে, জোর দিতে। ক্রিয়া তবু ২ নম্বরে।</td></tr>
    <tr><td lang="de">Jetzt</td><td lang="de"><b>verstehe</b></td><td lang="de">ich das!</td>
        <td>এখন আমি এটা বুঝি!</td></tr>
  </tbody>
</table>
</div>

<div class="merke">এই এক আইনেই জার্মান বাক্যের অর্ধেক শেখা হয়ে গেল। কিছু একটা সামনে
আনলে কর্তাটা ক্রিয়ার পরে চলে যায়, ভুলে যাওয়ার মতো নয়, শুধু অভ্যাস করার মতো।</div>

<h2>নয়জন কর্তা · <span lang="de">Die Personen</span></h2>

<p>আর এখানেই বাংলার চেনা মুখগুলো: তুমি, তোমরা, আপনি, তিনটাই আলাদা আছে।</p>

<div class="table-scroll">
<table>
  <thead><tr><th lang="de">Deutsch</th><th>বাংলা</th><th>কখন</th></tr></thead>
  <tbody>
    <tr><td lang="de">ich</td><td>আমি</td>
        <td>নিজের কথা। ছোট হাতের i, বাক্যের শুরু ছাড়া কখনো বড় হয় না।</td></tr>
    <tr><td lang="de">du</td><td>তুমি</td>
        <td>বন্ধু, পরিবার, শিশু: কাছের মানুষ।</td></tr>
    <tr><td lang="de">er / sie / es</td><td>সে (ছেলে) / সে (মেয়ে) / এটা</td>
        <td>একজন ছেলে / একজন মেয়ে / একটা জিনিস।</td></tr>
    <tr><td lang="de">wir</td><td>আমরা</td><td>আমি + আরও কেউ।</td></tr>
    <tr><td lang="de">ihr</td><td>তোমরা</td>
        <td>অনেকজন কাছের মানুষ। ইংরেজিতে এটা ছিল না!</td></tr>
    <tr><td lang="de">sie</td><td>তারা</td><td>অনেকজন মানুষ বা জিনিস।</td></tr>
    <tr><td lang="de">Sie</td><td>আপনি / আপনারা</td>
        <td>অচেনা, বয়োজ্যেষ্ঠ, অফিস: সম্মান। লেখায় সবসময় বড় S।</td></tr>
  </tbody>
</table>
</div>

<div class="merke warn">খেয়াল করো: <span lang="de">sie</span> (ছোট s) = সে/তারা, আর
<span lang="de">Sie</span> (বড় S) = আপনি। লেখায় S-টাই একমাত্র পার্থক্য, বলায় বোঝা যায়
প্রসঙ্গ থেকে। সন্দেহ হলে <span lang="de">Sie</span> বলো, ভদ্রতা কখনো ভুল নয়।</div>
`,

/* ------------------------------------------------------------
   sein
   ------------------------------------------------------------ */

sein: `
<p>বাংলায় একটা ক্রিয়া প্রায়ই লুকিয়ে থাকে। "আমি ক্লান্ত"– এখানে কোনো ক্রিয়া দেখছো?
নেই। ইংরেজি শেখার সময় এই জায়গাটাতেই সবচেয়ে বেশি ভুল হতো: <i>I tired</i> নয়,
<i>I <b>am</b> tired</i>।</p>

<p>জার্মানেও তাই। আর এখানে সেই ক্রিয়াটার ছয়টা মুখ আছে। ভয় পেয়ো না, বাংলাও ক্রিয়া
বদলায় (খাই-খাও-খায়), তাই এটা তোমার চেনা খেলা।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><b lang="de">Ich bin</b> <i>________</i></p>
  <p class="muster-why">আমি ___ (হই)। ফাঁকা ঘরে নিজের সত্যিটা বসাও।</p>
</div>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>কে</th><th lang="de">sein</th><th>উদাহরণ</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="de">ich</td><td lang="de"><b>bin</b></td>
        <td lang="de">Ich bin müde.</td><td>আমি ক্লান্ত।</td></tr>
    <tr><td lang="de">du</td><td lang="de"><b>bist</b></td>
        <td lang="de">Du bist nett.</td><td>তুমি ভালো (মিষ্টি)।</td></tr>
    <tr><td lang="de">er / sie / es</td><td lang="de"><b>ist</b></td>
        <td lang="de">Sie ist meine Schwester.</td><td>সে আমার বোন।</td></tr>
    <tr><td lang="de">wir</td><td lang="de"><b>sind</b></td>
        <td lang="de">Wir sind bereit.</td><td>আমরা প্রস্তুত।</td></tr>
    <tr><td lang="de">ihr</td><td lang="de"><b>seid</b></td>
        <td lang="de">Ihr seid laut!</td><td>তোমরা জোরে কথা বলছো!</td></tr>
    <tr><td lang="de">sie / Sie</td><td lang="de"><b>sind</b></td>
        <td lang="de">Sie sind zu Hause.</td><td>তারা বাসায়। / আপনি বাসায়।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">ছড়ার মতো বলো: <b>বিন–বিস্ট–ইস্ট, জ়িন্ট–জ়াইট–জ়িন্ট।</b> দশবার,
গানের সুরে। একবার ঢুকে গেলে আর বেরোবে না।</div>

<div class="merke warn">ফাঁদ: <span lang="de">du <b>bist</b></span> (তুমি) কিন্তু
<span lang="de">ihr <b>seid</b></span> (তোমরা)। <span lang="de">seid</span> শুধু
<span lang="de">ihr</span>-এর, আর কারো না।</div>

<h2>বিশটা সত্যি বাক্য</h2>

<p>একটাই ছাঁচ, দুই রকম ব্যবহার। জোরে পড়ো, তারপর নিজের জীবনের সত্যিগুলো বসাও।</p>

<div class="split">
  <div class="do">
    <h5>অনুভূতি</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich bin glücklich.</b><span>আমি খুশি।</span></p>
      <p class="satz"><b lang="de">Ich bin müde.</b><span>আমি ক্লান্ত।</span></p>
      <p class="satz"><b lang="de">Ich bin hungrig.</b><span>আমার খিদে পেয়েছে।</span></p>
      <p class="satz"><b lang="de">Ich bin traurig.</b><span>আমি দুঃখিত।</span></p>
      <p class="satz"><b lang="de">Ich bin nervös.</b><span>আমি একটু ভয়ে আছি।</span></p>
      <p class="satz"><b lang="de">Ich bin stolz.</b><span>আমি গর্বিত।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>পরিচয় ও অবস্থান</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich bin Schülerin.</b><span>আমি ছাত্রী।</span></p>
      <p class="satz"><b lang="de">Ich bin aus Bangladesch.</b><span>আমি বাংলাদেশের।</span></p>
      <p class="satz"><b lang="de">Ich bin zu Hause.</b><span>আমি বাসায়।</span></p>
      <p class="satz"><b lang="de">Ich bin sechzehn.</b><span>আমার বয়স ষোলো।</span></p>
      <p class="satz"><b lang="de">Ich bin bereit.</b><span>আমি প্রস্তুত।</span></p>
      <p class="satz"><b lang="de">Ich bin nicht allein.</b><span>আমি একা নই।</span></p>
    </div>
  </div>
</div>

<p>একটা জিনিস খেয়াল করো: <span lang="de">Ich bin Schülerin</span>: পেশা বা পরিচয়ের আগে
'একজন' (<span lang="de">ein</span>) লাগে না। ইংরেজিতে <i>I am <b>a</b> student</i> বলতেই
হতো; জার্মানে এক শব্দ কম!</p>

<h2>না বলা, আর প্রশ্ন করা</h2>

<p>সুখবর: জার্মানে কোনো <i>do</i> নেই। প্রশ্ন করতে শুধু ক্রিয়াটা সামনে আনো, বাংলার
'কি'-প্রশ্নের মতোই সরল।</p>

<div class="split">
  <div class="do">
    <h5><span lang="de">Nein</span> · না</h5>
    <p class="muster-why"><span lang="de">nicht</span> বসাও, ব্যস।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich bin nicht müde.</b><span>আমি ক্লান্ত নই।</span></p>
      <p class="satz"><b lang="de">Er ist nicht hier.</b><span>সে এখানে নেই।</span></p>
      <p class="satz"><b lang="de">Das ist nicht schwer.</b><span>এটা কঠিন নয়।</span></p>
      <p class="satz"><b lang="de">Wir sind nicht bereit.</b><span>আমরা প্রস্তুত নই।</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">Frage</span> · প্রশ্ন</h5>
    <p class="muster-why">ক্রিয়া সামনে, কোনো <i>do</i> নেই।</p>
    <div class="satz-list">
      <p class="satz"><b lang="de">Bist du müde?</b><span>তুমি কি ক্লান্ত?</span></p>
      <p class="satz"><b lang="de">Ist sie deine Schwester?</b><span>সে কি তোমার বোন?</span></p>
      <p class="satz"><b lang="de">Seid ihr bereit?</b><span>তোমরা কি প্রস্তুত?</span></p>
      <p class="satz"><b lang="de">Sind Sie Herr Rahman?</b><span>আপনি কি জনাব রহমান?</span></p>
    </div>
  </div>
</div>

<div class="merke">ইংরেজিতে ভারা বানাতে হতো: <i>Do you…? Does she…?</i> জার্মানে শুধু
ক্রিয়াটা সামনে আনো, <span lang="de">Bist du…?</span> এটুকুই। এক বছর পরে বুঝবে
এটা কত বড় উপহার।</div>
`,

/* ------------------------------------------------------------
   haben
   ------------------------------------------------------------ */

haben: `
<p>বাংলায় জিনিসটা আগে আসে: "আমার একটা বোন আছে।" জার্মানে মানুষটা আগে আসে:
<span lang="de">Ich habe eine Schwester.</span>: ইংরেজির সেই একই উল্টো, যেটা তুমি
আগে একবার শিখেছো।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><b lang="de">Ich habe</b> <i>________</i></p>
  <p class="muster-why">আমার ___ আছে। পরিবার, জিনিস, সময়, এমনকি খিদে: সবই এই ছাঁচে।</p>
</div>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>কে</th><th lang="de">haben</th><th>উদাহরণ</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="de">ich</td><td lang="de"><b>habe</b></td>
        <td lang="de">Ich habe eine Schwester.</td><td>আমার একটা বোন আছে।</td></tr>
    <tr><td lang="de">du</td><td lang="de"><b>hast</b></td>
        <td lang="de">Du hast Zeit.</td><td>তোমার সময় আছে।</td></tr>
    <tr><td lang="de">er / sie / es</td><td lang="de"><b>hat</b></td>
        <td lang="de">Er hat ein Fahrrad.</td><td>তার একটা সাইকেল আছে।</td></tr>
    <tr><td lang="de">wir</td><td lang="de"><b>haben</b></td>
        <td lang="de">Wir haben Hunger.</td><td>আমাদের খিদে পেয়েছে।</td></tr>
    <tr><td lang="de">ihr</td><td lang="de"><b>habt</b></td>
        <td lang="de">Ihr habt ein schönes Haus.</td><td>তোমাদের বাড়িটা সুন্দর।</td></tr>
    <tr><td lang="de">sie / Sie</td><td lang="de"><b>haben</b></td>
        <td lang="de">Sie haben zwei Kinder.</td><td>তাদের দুটো সন্তান।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">ছড়া নম্বর দুই: <b>হাবে–হাস্ট–হাট, হাবেন–হাব্‌ট–হাবেন।</b>
<span lang="de">sein</span>-এর মতোই গান বানিয়ে ফেলো।</div>

<h2>খিদে-তেষ্টা-ভয়: জার্মানে এগুলো 'থাকে'</h2>

<p>এটা অনুবাদ করার চেষ্টা কোরো না, মেনে নাও। ইংরেজিতে <i>I <b>am</b> hungry</i>, কিন্তু
জার্মানে খিদেটা তোমার <b>আছে</b>।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich habe Hunger.</b><span>আমার খিদে পেয়েছে।</span></p>
  <p class="satz"><b lang="de">Ich habe Durst.</b><span>আমার তেষ্টা পেয়েছে।</span></p>
  <p class="satz"><b lang="de">Ich habe Angst.</b><span>আমি ভয় পাচ্ছি।</span></p>
  <p class="satz"><b lang="de">Ich habe Zeit.</b><span>আমার সময় আছে।</span></p>
  <p class="satz"><b lang="de">Ich habe eine Frage.</b><span>আমার একটা প্রশ্ন আছে।</span></p>
  <p class="satz"><b lang="de">Ich habe eine Idee.</b><span>আমার একটা বুদ্ধি আছে।</span></p>
</div>

<h2>যা নেই: <span lang="de">kein · keine</span></h2>

<p>'নেই' বলার জন্য জার্মানের নিজস্ব শব্দ আছে, আর সেটা বানানো হয়েছে সবচেয়ে সহজ উপায়ে:
<span lang="de">ein</span>-এর মাথায় একটা <b>k</b> বসাও।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><span lang="de">ein → <b>kein</b></span> &nbsp;·&nbsp;
     <span lang="de">eine → <b>keine</b></span></p>
  <p class="muster-why"><span lang="de">kein</span> বসে <span class="hut" data-hut="der">der</span>
     আর <span class="hut" data-hut="das">das</span> শব্দে;
     <span lang="de">keine</span> বসে <span class="hut" data-hut="die">die</span> শব্দে
     আর সব বহুবচনে। টুপি চেনা শুরু হলে এটা এমনিই বসে যাবে।</p>
</div>

<div class="split">
  <div class="do">
    <h5><span lang="de">Ich habe kein…</span> · আমার নেই</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich habe kein Geld.</b><span>আমার টাকা নেই।</span></p>
      <p class="satz"><b lang="de">Ich habe keine Zeit.</b><span>আমার সময় নেই।</span></p>
      <p class="satz"><b lang="de">Er hat kein Fahrrad.</b><span>তার সাইকেল নেই।</span></p>
      <p class="satz"><b lang="de">Sie hat keine Geschwister.</b><span>তার ভাইবোন নেই।</span></p>
      <p class="satz"><b lang="de">Ich habe keine Angst.</b><span>আমার ভয় নেই।</span></p>
    </div>
  </div>
  <div class="others">
    <h5><span lang="de">Hast du…?</span> · তোমার কি আছে?</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Hast du Zeit?</b><span>তোমার সময় আছে?</span></p>
      <p class="satz"><b lang="de">Hast du Hunger?</b><span>খিদে পেয়েছে?</span></p>
      <p class="satz"><b lang="de">Hat sie Geschwister?</b><span>তার কি ভাইবোন আছে?</span></p>
      <p class="satz"><b lang="de">Habt ihr Wasser?</b><span>তোমাদের পানি আছে?</span></p>
      <p class="satz"><b lang="de">Haben Sie eine Frage?</b><span>আপনার কি প্রশ্ন আছে?</span></p>
    </div>
  </div>
</div>

<p>উত্তর ছোট রাখো: <span lang="de">Ja.</span> / <span lang="de">Nein, leider.</span>
(হ্যাঁ। / না, দুঃখিত।)</p>
`,

/* ------------------------------------------------------------
   der · die · das
   ------------------------------------------------------------ */

artikel: `
<p>এইটাই সেই একটা জিনিস যেটা ইংরেজি কোনোদিন তোমার কাছে চায়নি। প্রতিটা জার্মান বিশেষ্য
একটা টুপি পরে: <span class="hut" data-hut="der">der</span>,
<span class="hut" data-hut="die">die</span>, বা <span class="hut" data-hut="das">das</span>।</p>

<p>কেন? কোনো কারণ নেই। সত্যিই নেই।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">der Löffel</b><span>চামচ</span></p>
  <p class="satz"><b lang="de">die Gabel</b><span>কাঁটাচামচ</span></p>
  <p class="satz"><b lang="de">das Messer</b><span>ছুরি</span></p>
</div>

<p>তিনটা যন্ত্র, একই ড্রয়ারে থাকে, একসাথে ব্যবহার হয়: তিনটা আলাদা টুপি। যুক্তি শূন্য।
আর সবচেয়ে বড় প্রমাণ: <span lang="de">das Mädchen</span>: 'মেয়ে' শব্দটাই
<span class="hut" data-hut="das">das</span>, <span class="hut" data-hut="die">die</span> নয়।</p>

<div class="merke">তাই 'কেন' জিজ্ঞেস কোরো না। কেউ জানে না। জার্মানরা নিজেরাও জানে না,
তারা শিশুকালে শুনে শুনে শিখেছে। তোমার পরিকল্পনাটাও তাই হবে: <b>টুপি ছাড়া কোনো শব্দের
সাথে দেখা কোরো না।</b></div>

<h2>যেভাবে শিখবে</h2>

<ul>
  <li><b>এক নিঃশ্বাসে বলো।</b> <span lang="de">Tisch</span> নয়,
      <span lang="de">derTisch</span>: যেন একটাই শব্দ।</li>
  <li><b>রঙ দাও।</b> <span class="hut" data-hut="der">der</span> = নীল,
      <span class="hut" data-hut="die">die</span> = লাল,
      <span class="hut" data-hut="das">das</span> = সবুজ। খাতায় তিন রঙে লেখো।</li>
  <li><b>বিশেষ্য সবসময় বড় হাতের।</b> লেখায় প্রতিটা বিশেষ্যের প্রথম অক্ষর Capital:
      <span lang="de">das Wasser</span>, <span lang="de">die Zeit</span>। এটা জার্মানের
      নিজস্ব অভ্যাস, আর পড়ার সময় দারুণ কাজে দেয়।</li>
</ul>

<p>আর দুটো সান্ত্বনা, যেগুলো শুনলে বোঝা অনেক হালকা লাগে:</p>

<ol>
  <li><b>সব বহুবচন <span class="hut" data-hut="die">die</span> পরে।</b>
      <span lang="de">die Bücher</span>, <span lang="de">die Kinder</span>,
      <span lang="de">die Männer</span>: ব্যতিক্রম নেই।</li>
  <li><b>ভুল টুপি মানে ভুল কথা নয়।</b> <span lang="de">das Tisch</span> বললেও সবাই বুঝবে
      তুমি টেবিলের কথা বলছো। থেমো না, বলতে থাকো, ঠিক হতে থাকবে।</li>
</ol>

<h2>তোমার প্রথম আলমারি: ২৪টা শব্দ</h2>

<p>প্রতিটা কার্ড এক নিঃশ্বাসে জোরে পড়ো, টুপি আর শব্দ একসাথে, কখনো আলাদা নয়।</p>

<div class="hut-spalten">
  <div class="hut-spalte" data-hut="der">
    <span class="hut-kopf" lang="de">der</span>
    <ul>
      <li><b lang="de">der Mann</b> <span>লোক</span></li>
      <li><b lang="de">der Vater</b> <span>বাবা</span></li>
      <li><b lang="de">der Bruder</b> <span>ভাই</span></li>
      <li><b lang="de">der Tisch</b> <span>টেবিল</span></li>
      <li><b lang="de">der Tee</b> <span>চা</span></li>
      <li><b lang="de">der Tag</b> <span>দিন</span></li>
      <li><b lang="de">der Apfel</b> <span>আপেল</span></li>
      <li><b lang="de">der Bahnhof</b> <span>স্টেশন</span></li>
    </ul>
  </div>
  <div class="hut-spalte" data-hut="die">
    <span class="hut-kopf" lang="de">die</span>
    <ul>
      <li><b lang="de">die Frau</b> <span>মহিলা</span></li>
      <li><b lang="de">die Mutter</b> <span>মা</span></li>
      <li><b lang="de">die Schwester</b> <span>বোন</span></li>
      <li><b lang="de">die Schule</b> <span>স্কুল</span></li>
      <li><b lang="de">die Tür</b> <span>দরজা</span></li>
      <li><b lang="de">die Zeit</b> <span>সময়</span></li>
      <li><b lang="de">die Stadt</b> <span>শহর</span></li>
      <li><b lang="de">die Milch</b> <span>দুধ</span></li>
    </ul>
  </div>
  <div class="hut-spalte" data-hut="das">
    <span class="hut-kopf" lang="de">das</span>
    <ul>
      <li><b lang="de">das Kind</b> <span>শিশু</span></li>
      <li><b lang="de">das Haus</b> <span>বাড়ি</span></li>
      <li><b lang="de">das Wasser</b> <span>পানি</span></li>
      <li><b lang="de">das Buch</b> <span>বই</span></li>
      <li><b lang="de">das Brot</b> <span>রুটি</span></li>
      <li><b lang="de">das Auto</b> <span>গাড়ি</span></li>
      <li><b lang="de">das Fenster</b> <span>জানালা</span></li>
      <li><b lang="de">das Mädchen</b> <span>মেয়ে (!)</span></li>
    </ul>
  </div>
</div>

<h2><span lang="de">ein · eine</span>: 'একটা'</h2>

<div class="table-scroll">
<table>
  <thead><tr><th>টুপি</th><th>একটা</th><th>কোনোটা না</th><th>উদাহরণ</th></tr></thead>
  <tbody>
    <tr><td><span class="hut" data-hut="der">der</span></td>
        <td lang="de">ein</td><td lang="de">kein</td>
        <td lang="de">Das ist ein Apfel. · Ich habe kein Fahrrad.</td></tr>
    <tr><td><span class="hut" data-hut="das">das</span></td>
        <td lang="de">ein</td><td lang="de">kein</td>
        <td lang="de">Das ist ein Haus. · Ich habe kein Geld.</td></tr>
    <tr><td><span class="hut" data-hut="die">die</span></td>
        <td lang="de">eine</td><td lang="de">keine</td>
        <td lang="de">Das ist eine Schule. · Ich habe keine Zeit.</td></tr>
    <tr><td>বহুবচন</td><td>– (কিছু না)</td><td lang="de">keine</td>
        <td lang="de">Ich habe Bücher. · Ich habe keine Bücher.</td></tr>
  </tbody>
</table>
</div>

<h2>সামনের পথের এক ঝলক</h2>

<p>এটা আজ মুখস্থ করার জিনিস নয়, শুধু চোখে দেখে রাখার জিনিস। জার্মানে
<span class="hut" data-hut="der">der</span>-শব্দ যখন বাক্যের 'কী' বা 'কাকে' হয়
(অর্থাৎ কর্ম), তখন সে রূপ বদলায়:</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich trinke den Tee.</b><span>আমি চা-টা খাচ্ছি। (der → den)</span></p>
  <p class="satz"><b lang="de">Ich esse einen Apfel.</b><span>আমি একটা আপেল খাচ্ছি। (ein → einen)</span></p>
</div>

<p><span class="hut" data-hut="die">die</span> আর <span class="hut" data-hut="das">das</span>
এখানে কখনো বদলায় না। শুধু নীল দলটাই বদলায়। এক দল, এক বদল, আর তার পুরো গল্প
<a href="/deutsch/stufe-2/index.html">Stufe ২-তে</a>। আজ ভুল করলেও সবাই বুঝবে।</p>
`,

/* ------------------------------------------------------------
   ক্রিয়া
   ------------------------------------------------------------ */

verben: `
<p>বাংলা এই খেলাটা তোমাকে শিশুকালেই শিখিয়ে দিয়েছে: খাই, খাও, খায়। কে করছে, সেই অনুযায়ী
ক্রিয়ার লেজ বদলায়। জার্মানও ঠিক একই কাজ করে, আর সেটা একটা মেশিনের মতো নিয়মিত।</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><b>-e &nbsp; -st &nbsp; -t &nbsp; -en &nbsp; -t &nbsp; -en</b></p>
  <p class="muster-why">ছয়টা কর্তা, ছয়টা লেজ। এই ছকেই জার্মানের ৯০% ক্রিয়া চলে, চিরকাল।</p>
</div>

<div class="table-scroll">
<table class="konjugation">
  <thead>
    <tr><th>কে</th><th>লেজ</th><th lang="de">lernen (শেখা)</th>
        <th lang="de">wohnen (থাকা)</th><th lang="de">trinken (পান)</th></tr>
  </thead>
  <tbody>
    <tr><td lang="de">ich</td><td>-e</td><td lang="de">lerne</td><td lang="de">wohne</td><td lang="de">trinke</td></tr>
    <tr><td lang="de">du</td><td>-st</td><td lang="de">lernst</td><td lang="de">wohnst</td><td lang="de">trinkst</td></tr>
    <tr><td lang="de">er / sie / es</td><td>-t</td><td lang="de">lernt</td><td lang="de">wohnt</td><td lang="de">trinkt</td></tr>
    <tr><td lang="de">wir</td><td>-en</td><td lang="de">lernen</td><td lang="de">wohnen</td><td lang="de">trinken</td></tr>
    <tr><td lang="de">ihr</td><td>-t</td><td lang="de">lernt</td><td lang="de">wohnt</td><td lang="de">trinkt</td></tr>
    <tr><td lang="de">sie / Sie</td><td>-en</td><td lang="de">lernen</td><td lang="de">wohnen</td><td lang="de">trinken</td></tr>
  </tbody>
</table>
</div>

<div class="merke"><span lang="de">wir</span> আর <span lang="de">sie/Sie</span> সবসময়
অভিধানের পুরো রূপটাই নেয়, কিছু শিখতেই হয় না। <span lang="de">ich</span>-এ একটা -e,
<span lang="de">du</span>-তে -st। মোটে দুটো জিনিস মনে রাখার।</div>

<p>ছোট একটা ব্যতিক্রম, আর সেটা শুধু বলার সুবিধার জন্য: <span lang="de">arbeiten</span>-এর
মতো t বা d দিয়ে শেষ হওয়া ক্রিয়ায় একটা <b>e</b> ঢুকে যায়,
<span lang="de">du arbeitest, er arbeitet</span>। <span lang="de">arbeitst</span> বলা যায় না,
চেষ্টা করে দেখো।</p>

<h2>সারাদিনের ৩০টা ক্রিয়া</h2>

<p><span class="stern">*</span> চিহ্ন মানে: <span lang="de">du</span> আর
<span lang="de">er/sie/es</span>-এ চেহারা বদলায়। সেটা নিচের অংশে।</p>

<div class="verb-gitter">
  <span><b lang="de">kommen</b> আসা</span>
  <span><b lang="de">gehen</b> যাওয়া</span>
  <span><b lang="de">machen</b> করা</span>
  <span><b lang="de">lernen</b> শেখা</span>
  <span><b lang="de">wohnen</b> থাকা</span>
  <span><b lang="de">essen</b><i class="stern">*</i> খাওয়া</span>
  <span><b lang="de">trinken</b> পান করা</span>
  <span><b lang="de">schlafen</b><i class="stern">*</i> ঘুমানো</span>
  <span><b lang="de">arbeiten</b> কাজ করা</span>
  <span><b lang="de">spielen</b> খেলা</span>
  <span><b lang="de">sprechen</b><i class="stern">*</i> কথা বলা</span>
  <span><b lang="de">hören</b> শোনা</span>
  <span><b lang="de">sehen</b><i class="stern">*</i> দেখা</span>
  <span><b lang="de">lesen</b><i class="stern">*</i> পড়া</span>
  <span><b lang="de">schreiben</b> লেখা</span>
  <span><b lang="de">verstehen</b> বোঝা</span>
  <span><b lang="de">wissen</b><i class="stern">*</i> জানা</span>
  <span><b lang="de">denken</b> ভাবা</span>
  <span><b lang="de">brauchen</b> দরকার হওয়া</span>
  <span><b lang="de">lieben</b> ভালোবাসা</span>
  <span><b lang="de">kaufen</b> কেনা</span>
  <span><b lang="de">geben</b><i class="stern">*</i> দেওয়া</span>
  <span><b lang="de">nehmen</b><i class="stern">*</i> নেওয়া</span>
  <span><b lang="de">suchen</b> খোঁজা</span>
  <span><b lang="de">finden</b> পাওয়া</span>
  <span><b lang="de">fragen</b> প্রশ্ন করা</span>
  <span><b lang="de">antworten</b> উত্তর দেওয়া</span>
  <span><b lang="de">helfen</b><i class="stern">*</i> সাহায্য করা</span>
  <span><b lang="de">kochen</b> রান্না করা</span>
  <span><b lang="de">warten</b> অপেক্ষা করা</span>
</div>

<div class="merke">নিয়ম সেই একটাই: ক্রিয়া একা বোলো না, বাক্যে বলো।
<span lang="de">Ich koche Reis</span>: শুধু <span lang="de">kochen</span> নয়। একা শেখা
শব্দ একা থেকে যায়।</div>

<h2>রূপবদলকারীরা · <span lang="de">Die Vokalwechsler</span></h2>

<p>কিছু ক্রিয়া <span lang="de">du</span> আর <span lang="de">er/sie/es</span>-এর ঘরে
চেহারা বদলায়। বাকি চার ঘরে সব স্বাভাবিক, <span lang="de">ich</span>,
<span lang="de">wir</span>, <span lang="de">ihr</span>, <span lang="de">sie</span> কখনো বদলায় না।</p>

<div class="table-scroll">
<table>
  <thead><tr><th>বদল</th><th>ক্রিয়া</th><th lang="de">du</th><th lang="de">er / sie / es</th></tr></thead>
  <tbody>
    <tr><td>e → i</td><td lang="de">sprechen</td><td lang="de">du sprichst</td><td lang="de">er spricht</td></tr>
    <tr><td>e → i</td><td lang="de">essen</td><td lang="de">du isst</td><td lang="de">er isst</td></tr>
    <tr><td>e → i</td><td lang="de">geben</td><td lang="de">du gibst</td><td lang="de">er gibt</td></tr>
    <tr><td>e → i</td><td lang="de">nehmen</td><td lang="de">du nimmst</td><td lang="de">er nimmt</td></tr>
    <tr><td>e → i</td><td lang="de">helfen</td><td lang="de">du hilfst</td><td lang="de">er hilft</td></tr>
    <tr><td>e → ie</td><td lang="de">sehen</td><td lang="de">du siehst</td><td lang="de">er sieht</td></tr>
    <tr><td>e → ie</td><td lang="de">lesen</td><td lang="de">du liest</td><td lang="de">er liest</td></tr>
    <tr><td>a → ä</td><td lang="de">schlafen</td><td lang="de">du schläfst</td><td lang="de">er schläft</td></tr>
    <tr><td>a → ä</td><td lang="de">fahren</td><td lang="de">du fährst</td><td lang="de">er fährt</td></tr>
    <tr><td>বিশেষ</td><td lang="de">wissen</td><td lang="de">du weißt</td>
        <td lang="de">er weiß</td></tr>
  </tbody>
</table>
</div>

<p><span lang="de">wissen</span> একমাত্র ক্রিয়া যেখানে <span lang="de">ich</span>-ও বদলায়:
<span lang="de">ich weiß</span>। একটামাত্র ব্যতিক্রম, আর সেটা এত বেশি ব্যবহার হয় যে
এমনিই মুখস্থ হয়ে যাবে।</p>

<div class="merke">নিয়মটা মুখস্থ কোরো না, জোড়াটা গাও: <b lang="de">ich spreche, du sprichst</b>।
দশবার বলা একবার ব্যাখ্যা পড়ার চেয়ে বেশি কাজের।</div>
`,

/* ------------------------------------------------------------
   না বলা
   ------------------------------------------------------------ */

negation: `
<p>জার্মানে 'না' বলার দুইটা আলাদা অস্ত্র আছে, আর কোনটা কখন সেটা এক লাইনে বোঝা যায়:</p>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><b lang="de">kein</b> মারে বিশেষ্যকে &nbsp;·&nbsp;
     <b lang="de">nicht</b> মারে বাকি সব</p>
  <p class="muster-why">দ্রুত পরীক্ষা: ক্রিয়ার পরে কি <span lang="de">ein</span>-ওয়ালা
  (বা খালি) বিশেষ্য আছে? তাহলে <span lang="de">kein</span>। নাহলে
  <span lang="de">nicht</span>: সাধারণত বাক্যের শেষে, বা বিশেষণের ঠিক আগে।</p>
</div>

<h2>ছয়টা ভুল, যেগুলো সবাই করে</h2>

<div class="table-scroll">
<table class="paar-tabelle">
  <thead><tr><th>✅ ঠিক</th><th>❌ ভুল</th><th>কারণ</th></tr></thead>
  <tbody>
    <tr><td lang="de">Ich habe keine Zeit.</td><td lang="de">Ich habe nicht Zeit.</td>
        <td><span lang="de">Zeit</span> বিশেষ্য → <span lang="de">kein</span> পরিবার।</td></tr>
    <tr><td lang="de">Ich verstehe nicht.</td><td lang="de">Ich nicht verstehe.</td>
        <td><span lang="de">nicht</span> ক্রিয়ার পরে বসে, আগে নয়।</td></tr>
    <tr><td lang="de">Ich bin nicht müde.</td><td lang="de">Ich bin müde nicht.</td>
        <td>বিশেষণের ঠিক আগে <span lang="de">nicht</span>।</td></tr>
    <tr><td lang="de">Er wohnt nicht hier.</td><td lang="de">Er nicht wohnt hier.</td>
        <td>ক্রিয়া দুই নম্বরে অটল, <span lang="de">nicht</span> পরে।</td></tr>
    <tr><td lang="de">Das ist kein Problem.</td><td lang="de">Das ist nicht Problem.</td>
        <td><span lang="de">Problem</span> বিশেষ্য → <span lang="de">kein</span>।</td></tr>
    <tr><td lang="de">Ich trinke keinen Kaffee.</td><td lang="de">Ich trinke nicht Kaffee.</td>
        <td>নীল দলের কর্ম → <span lang="de">keinen</span>
            (<a href="/deutsch/stufe-1/artikel.html">Teil ৭-এর সেই ঝলক</a>)।</td></tr>
  </tbody>
</table>
</div>

<h2>ভদ্রভাবে 'না'</h2>

<p>না বলাটাও একটা শিল্প, আর জার্মানরা সরাসরি না বলাকে অভদ্রতা মনে করে না, কিন্তু একটা
নরম মোড়ক থাকলে সেটা আরও ভালো শোনায়।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Nein, danke.</b><span>না, ধন্যবাদ।</span></p>
  <p class="satz"><b lang="de">Nein, leider nicht.</b><span>না, দুঃখিত।</span></p>
  <p class="satz"><b lang="de">Leider habe ich keine Zeit.</b><span>দুঃখিত, আমার সময় নেই।</span></p>
  <p class="satz"><b lang="de">Vielleicht morgen?</b><span>কাল হলে হয়?</span></p>
  <p class="satz"><b lang="de">Das geht leider nicht.</b><span>এটা দুঃখিত, হবে না।</span></p>
  <p class="satz"><b lang="de">Tut mir leid.</b><span>আমি দুঃখিত।</span></p>
</div>

<div class="merke"><span lang="de">leider</span> (দুঃখজনকভাবে), এই এক শব্দটা যেকোনো
'না'-কে ভদ্র করে দেয়। শিখে রাখো, রোজ কাজে লাগবে।</div>
`,

/* ------------------------------------------------------------
   প্রশ্ন
   ------------------------------------------------------------ */

fragen: `
<p>প্রশ্ন করতে পারা মানে ভাষার প্রতিটা দরজায় চাবি থাকা। না জানলে জিজ্ঞেস করা যায়, না
বুঝলে আবার বলতে বলা যায়, আর কথোপকথন চালু রাখা যায়। আর জার্মানে প্রশ্ন করা ইংরেজির
চেয়ে সহজ।</p>

<h2>হ্যাঁ/না প্রশ্ন: ক্রিয়া লাফ দেয় এক নম্বরে</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape"><b>ক্রিয়া</b> · কে · বাকি <b>?</b></p>
  <p class="muster-why">কোনো <i>do</i> নেই, কোনো যন্ত্রপাতি নেই। শুধু প্রথম দুটো শব্দ
  জায়গা বদল করে।</p>
</div>

<div class="table-scroll">
<table>
  <thead><tr><th>বলা</th><th>প্রশ্ন</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="de">Du kommst morgen.</td><td lang="de"><b>Kommst du</b> morgen?</td>
        <td>তুমি কি কাল আসছো?</td></tr>
    <tr><td lang="de">Sie hat Zeit.</td><td lang="de"><b>Hat sie</b> Zeit?</td>
        <td>তার কি সময় আছে?</td></tr>
    <tr><td lang="de">Du sprichst Deutsch.</td><td lang="de"><b>Sprichst du</b> Deutsch?</td>
        <td>তুমি কি জার্মান বলো?</td></tr>
    <tr><td lang="de">Ihr habt Hunger.</td><td lang="de"><b>Habt ihr</b> Hunger?</td>
        <td>তোমাদের খিদে পেয়েছে?</td></tr>
    <tr><td lang="de">Das ist richtig.</td><td lang="de"><b>Ist das</b> richtig?</td>
        <td>এটা কি ঠিক?</td></tr>
    <tr><td lang="de">Sie verstehen mich.</td><td lang="de"><b>Verstehen Sie</b> mich?</td>
        <td>আপনি কি আমাকে বুঝছেন?</td></tr>
  </tbody>
</table>
</div>

<p>উত্তর ছোট রাখো: <span lang="de">Ja.</span> / <span lang="de">Nein.</span> /
<span lang="de">Ja, gern!</span> (হ্যাঁ, খুশি হয়ে) / <span lang="de">Nein, leider.</span></p>

<h2>সাতটা W-চাবি</h2>

<p>গঠন সবসময় একই: <b>W-শব্দ · ক্রিয়া · কে · বাকি।</b></p>

<div class="table-scroll">
<table>
  <thead><tr><th lang="de">W-Wort</th><th>মানে</th><th>উদাহরণ ও উত্তর</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>Wer?</b></td><td>কে</td>
        <td lang="de">Wer ist das?, Das ist meine Mutter.</td></tr>
    <tr><td lang="de"><b>Was?</b></td><td>কী</td>
        <td lang="de">Was machst du?, Ich lerne.</td></tr>
    <tr><td lang="de"><b>Wo?</b></td><td>কোথায়</td>
        <td lang="de">Wo wohnst du?, In Dhaka.</td></tr>
    <tr><td lang="de"><b>Woher?</b></td><td>কোথা থেকে</td>
        <td lang="de">Woher kommst du?, Aus Bangladesch.</td></tr>
    <tr><td lang="de"><b>Wann?</b></td><td>কখন</td>
        <td lang="de">Wann kommst du?, Um drei Uhr.</td></tr>
    <tr><td lang="de"><b>Warum?</b></td><td>কেন</td>
        <td lang="de">Warum lernst du Deutsch?, Für die Zukunft!</td></tr>
    <tr><td lang="de"><b>Wie?</b></td><td>কেমন / কীভাবে</td>
        <td lang="de">Wie geht's?, Gut, danke!</td></tr>
    <tr><td lang="de"><b>Wie viel?</b></td><td>কত</td>
        <td lang="de">Wie viel kostet das?, Zwei Euro.</td></tr>
  </tbody>
</table>
</div>

<div class="merke">আজই একটা সত্যিকারের মানুষকে জার্মানে একটা প্রশ্ন করো। উত্তরটা বাংলায়
এলেও ক্ষতি নেই, প্রশ্নটাই আসল কাজ।</div>
`,

/* ------------------------------------------------------------
   möchte · kann · muss
   ------------------------------------------------------------ */

modalverben: `
<p>এবার সবচেয়ে জার্মান জিনিসটা। বাক্যটা একটা খিলানের মতো: সাহায্যকারী ক্রিয়া দুই নম্বর
আসনে বসে, আর আসল কাজটা বাক্যের একদম শেষে গিয়ে দরজা বন্ধ করে। মাঝখানে যা খুশি ঢোকাও,
বন্ধনীটা ধরে রাখতে হবে।</p>

<div class="muster">
  <span class="muster-label mono">Die Klammer · বন্ধনী</span>
  <p class="muster-shape">কে · <b lang="de">möchte / kann / muss</b> · … মাঝের সব … ·
     <b>কাজ</b></p>
  <p class="muster-why">শেষ শব্দটা বাক্যের দরজা বন্ধ করে। এটাই জার্মান কানে 'সম্পূর্ণ'
  শোনায়, শেষ শব্দটা না আসা পর্যন্ত জার্মান শ্রোতা অপেক্ষা করে।</p>
</div>

<div class="satz-list">
  <p class="satz"><b lang="de">Ich möchte Deutsch lernen.</b><span>আমি জার্মান শিখতে চাই।</span></p>
  <p class="satz"><b lang="de">Ich kann gut kochen.</b><span>আমি ভালো রান্না করতে পারি।</span></p>
  <p class="satz"><b lang="de">Ich muss jetzt gehen.</b><span>আমাকে এখন যেতেই হবে।</span></p>
  <p class="satz"><b lang="de">Du kannst das machen!</b><span>তুমি এটা পারবে!</span></p>
  <p class="satz"><b lang="de">Wir müssen morgen früh aufstehen.</b><span>আমাদের কাল সকালে উঠতেই হবে।</span></p>
  <p class="satz"><b lang="de">Möchtest du Tee trinken?</b><span>তুমি কি চা খেতে চাও?</span></p>
</div>

<h2>তিন সাহায্যকারীর ছয় মুখ</h2>

<div class="table-scroll">
<table class="konjugation">
  <thead><tr><th>কে</th><th lang="de">möchte (চাই)</th><th lang="de">kann (পারি)</th>
    <th lang="de">muss (হবেই)</th></tr></thead>
  <tbody>
    <tr><td lang="de">ich</td><td lang="de">möchte</td><td lang="de">kann</td><td lang="de">muss</td></tr>
    <tr><td lang="de">du</td><td lang="de">möchtest</td><td lang="de">kannst</td><td lang="de">musst</td></tr>
    <tr><td lang="de">er / sie / es</td><td lang="de">möchte</td><td lang="de">kann</td><td lang="de">muss</td></tr>
    <tr><td lang="de">wir</td><td lang="de">möchten</td><td lang="de">können</td><td lang="de">müssen</td></tr>
    <tr><td lang="de">ihr</td><td lang="de">möchtet</td><td lang="de">könnt</td><td lang="de">müsst</td></tr>
    <tr><td lang="de">sie / Sie</td><td lang="de">möchten</td><td lang="de">können</td><td lang="de">müssen</td></tr>
  </tbody>
</table>
</div>

<div class="merke">সব modal-এ <span lang="de">ich</span> আর
<span lang="de">er/sie/es</span> একই রূপ, কোনো -t নেই! আর পরের মূল ক্রিয়াটা কখনো
বদলায় না: সবসময় অভিধানের রূপ, বাক্যের শেষে।<br>
<span lang="de">Ich kann schwimmen. · Er kann schwimmen.</span>:
কখনোই <span lang="de">er kannt</span> বা <span lang="de">ich kann schwimme</span> নয়।</div>

<h2>বেঁচে থাকার বাক্য</h2>

<p>এগুলো মুখস্থ করা চলবে, কারণ এগুলোই তোমাকে প্রতিটা কথোপকথনে ঢুকিয়ে দেবে আর ভেতরে
টিকিয়ে রাখবে।</p>

<div class="split">
  <div class="do">
    <h5>যখন বুঝতে পারছো না</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Wie bitte?</b><span>কী বললেন? (আবার বলুন)</span></p>
      <p class="satz"><b lang="de">Ich verstehe nicht.</b><span>আমি বুঝিনি।</span></p>
      <p class="satz"><b lang="de">Langsam, bitte!</b><span>একটু আস্তে, প্লিজ!</span></p>
      <p class="satz"><b lang="de">Können Sie das wiederholen?</b><span>আরেকবার বলবেন?</span></p>
      <p class="satz"><b lang="de">Was bedeutet das?</b><span>এটার মানে কী?</span></p>
      <p class="satz"><b lang="de">Ich spreche nur ein bisschen Deutsch.</b><span>আমি অল্প একটু জার্মান বলি।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>ভদ্রতার সোনার শব্দ</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Bitte.</b><span>প্লিজ / আপনাকে স্বাগতম</span></p>
      <p class="satz"><b lang="de">Danke schön!, Bitte schön!</b><span>অনেক ধন্যবাদ!, কিছু না!</span></p>
      <p class="satz"><b lang="de">Entschuldigung!</b><span>মাফ করবেন / এক্সকিউজ মি</span></p>
      <p class="satz"><b lang="de">Kein Problem.</b><span>কোনো সমস্যা নেই।</span></p>
      <p class="satz"><b lang="de">Können Sie mir helfen?</b><span>আমাকে একটু সাহায্য করবেন?</span></p>
      <p class="satz"><b lang="de">Vielen Dank!</b><span>অনেক অনেক ধন্যবাদ!</span></p>
    </div>
  </div>
</div>

<div class="merke">এই দুই বাক্য একসাথে বললে জার্মানরা হাসিমুখে ধীরে বলবে, প্রায় সবসময়:
<b lang="de">Ich lerne Deutsch. Langsam, bitte!</b> পরীক্ষিত সত্য।</div>
`,

/* ------------------------------------------------------------
   সংখ্যা ও ঘড়ি
   ------------------------------------------------------------ */

"zahlen-zeit": `
<p>সংখ্যা ছাড়া বাজার হয় না, দাম হয় না, সময় হয় না, বয়স হয় না। আর জার্মান সংখ্যায়
একটা বিখ্যাত মজা লুকিয়ে আছে।</p>

<h2>০ থেকে ১০০</h2>

<div class="zahl-gitter">
  <span><b lang="de">0 null</b> নুল</span>
  <span><b lang="de">1 eins</b> আইনস</span>
  <span><b lang="de">2 zwei</b> ৎসভাই</span>
  <span><b lang="de">3 drei</b> ড্রাই</span>
  <span><b lang="de">4 vier</b> ফীয়া</span>
  <span><b lang="de">5 fünf</b> ফ্যুন্ফ</span>
  <span><b lang="de">6 sechs</b> জ়েক্স</span>
  <span><b lang="de">7 sieben</b> জ়ীবেন</span>
  <span><b lang="de">8 acht</b> আখট</span>
  <span><b lang="de">9 neun</b> নয়ন</span>
  <span><b lang="de">10 zehn</b> ৎসেন</span>
  <span><b lang="de">11 elf</b> এল্ফ</span>
  <span><b lang="de">12 zwölf</b> ৎসভ্যোল্ফ</span>
  <span><b lang="de">13 dreizehn</b> ৩+১০</span>
  <span><b lang="de">16 sechzehn</b> s-এর x নেই!</span>
  <span><b lang="de">17 siebzehn</b> sieben ছোট হয়</span>
  <span><b lang="de">20 zwanzig</b> ৎসভানৎসিশ</span>
  <span><b lang="de">30 dreißig</b> ড্রাইসিশ</span>
  <span><b lang="de">40 vierzig</b> ফীয়াৎসিশ</span>
  <span><b lang="de">100 hundert</b> হুন্ডাট</span>
</div>

<h2>উল্টো প্যাঁচ: ২১ মানে 'এক-আর-বিশ'</h2>

<div class="muster">
  <span class="muster-label mono">Das Muster · ছাঁচ</span>
  <p class="muster-shape">একক <b lang="de">und</b> দশক</p>
  <p class="muster-why"><span lang="de">21 = einundzwanzig</span> (এক-আর-বিশ) ·
  <span lang="de">34 = vierunddreißig</span> (চার-আর-ত্রিশ) ·
  <span lang="de">58 = achtundfünfzig</span></p>
</div>

<p>ছোট সংখ্যা আগে, দশক পরে: ইংরেজির ঠিক উল্টো। প্রথম দিন হাসি পাবে, তিন দিনে অভ্যাস
হয়ে যাবে। সবচেয়ে দ্রুত পথ: নিজের ফোন নম্বরটা জার্মানে দশবার বলো।</p>

<h2>সপ্তাহের দিন</h2>

<p>মজার ব্যাপার: সব দিনই <span class="hut" data-hut="der">der</span>: নীল দল, ব্যতিক্রম নেই।</p>

<div class="satz-list">
  <p class="satz"><b lang="de">Montag · Dienstag · Mittwoch</b><span>সোম · মঙ্গল · বুধ</span></p>
  <p class="satz"><b lang="de">Donnerstag · Freitag</b><span>বৃহস্পতি · শুক্র</span></p>
  <p class="satz"><b lang="de">Samstag · Sonntag</b><span>শনি · রবি</span></p>
  <p class="satz"><b lang="de">am Montag</b><span>সোমবারে, দিনের আগে <span lang="de">am</span></span></p>
  <p class="satz"><b lang="de">heute · morgen · gestern</b><span>আজ · কাল · গতকাল</span></p>
  <p class="satz"><b lang="de">das Wochenende</b><span>সপ্তাহান্ত</span></p>
</div>

<h2>ঘড়ি, আর সেই মারাত্মক ফাঁদ</h2>

<div class="satz-list">
  <p class="satz"><b lang="de">Wie spät ist es?</b><span>কয়টা বাজে?</span></p>
  <p class="satz"><b lang="de">Es ist drei Uhr.</b><span>তিনটা বাজে।</span></p>
  <p class="satz"><b lang="de">um drei Uhr</b><span>তিনটায়, সময়ের আগে <span lang="de">um</span></span></p>
  <p class="satz"><b lang="de">Viertel nach drei</b><span>৩:১৫, তিনটার পরে সোয়া</span></p>
  <p class="satz"><b lang="de">Viertel vor vier</b><span>৩:৪৫, চারটার আগে পৌনে</span></p>
</div>

<div class="merke warn"><b lang="de">halb vier</b> মানে <b>সাড়ে তিনটা</b>, সাড়ে চারটা নয়!
জার্মান ভাবে 'চারের অর্ধেক পথে'। এটা প্রতি বছর হাজারো মানুষকে ট্রেন মিস করায়।
ভুলে গেলে <span lang="de">drei Uhr dreißig</span> বলো, সবাই বুঝবে, আর কেউ হাসবে না।</div>
`,

/* ------------------------------------------------------------
   বাক্যব্যাংক
   ------------------------------------------------------------ */

satzbank: `
<p>এতক্ষণ কাঠামো শিখেছো। এই পাতাটা আলাদা: এখানে কোনো নিয়ম নেই, শুধু সেই বাক্যগুলো
যেগুলো তুমি প্রথম সপ্তাহেই আসলে বলবে। মুখস্থ করা এখানে বৈধ, কারণ এগুলো কাঠামো নয়,
হাতিয়ার।</p>

<h2><span lang="de">Hallo!</span>: পরিচয় ও কুশল</h2>

<div class="split">
  <div class="do">
    <h5>শুরু করা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Hallo! / Guten Morgen!</b><span>হ্যালো! / শুভ সকাল!</span></p>
      <p class="satz"><b lang="de">Guten Tag! / Guten Abend!</b><span>শুভ দিন! / শুভ সন্ধ্যা!</span></p>
      <p class="satz"><b lang="de">Wie geht's?, Gut, danke!</b><span>কেমন আছো?, ভালো, ধন্যবাদ!</span></p>
      <p class="satz"><b lang="de">Und dir? / Und Ihnen?</b><span>আর তুমি? / আর আপনি?</span></p>
      <p class="satz"><b lang="de">Ich heiße Rima.</b><span>আমার নাম রিমা।</span></p>
      <p class="satz"><b lang="de">Wie heißt du? / Wie heißen Sie?</b><span>তোমার / আপনার নাম কী?</span></p>
    </div>
  </div>
  <div class="others">
    <h5>পরিচয় ও বিদায়</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Woher kommst du?</b><span>তুমি কোথা থেকে এসেছো?</span></p>
      <p class="satz"><b lang="de">Ich komme aus Bangladesch.</b><span>আমি বাংলাদেশ থেকে।</span></p>
      <p class="satz"><b lang="de">Ich wohne in Dhaka.</b><span>আমি ঢাকায় থাকি।</span></p>
      <p class="satz"><b lang="de">Freut mich!</b><span>পরিচিত হয়ে ভালো লাগলো!</span></p>
      <p class="satz"><b lang="de">Bis später! / Bis morgen!</b><span>পরে দেখা হবে! / কাল দেখা হবে!</span></p>
      <p class="satz"><b lang="de">Tschüss! / Auf Wiedersehen!</b><span>বাই! / আবার দেখা হবে (ভদ্র)!</span></p>
    </div>
  </div>
</div>

<h2><span lang="de">Zu Hause</span>: ঘরের ভিতরে</h2>

<div class="split">
  <div class="do">
    <h5>খাওয়া-দাওয়া</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich habe Hunger!</b><span>আমার খিদে পেয়েছে!</span></p>
      <p class="satz"><b lang="de">Ich habe Durst.</b><span>আমার তেষ্টা পেয়েছে।</span></p>
      <p class="satz"><b lang="de">Das Essen ist fertig!</b><span>খাবার তৈরি!</span></p>
      <p class="satz"><b lang="de">Das schmeckt gut!</b><span>খেতে দারুণ!</span></p>
      <p class="satz"><b lang="de">Ich koche heute.</b><span>আজ আমি রান্না করছি।</span></p>
      <p class="satz"><b lang="de">Guten Appetit!</b><span>খাওয়া শুরু করো! (খাবার-শুভেচ্ছা)</span></p>
    </div>
  </div>
  <div class="others">
    <h5>সকাল-রাত</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich bin müde.</b><span>আমি ক্লান্ত।</span></p>
      <p class="satz"><b lang="de">Ich gehe schlafen.</b><span>আমি ঘুমাতে যাচ্ছি।</span></p>
      <p class="satz"><b lang="de">Gute Nacht!</b><span>শুভ রাত্রি!</span></p>
      <p class="satz"><b lang="de">Wo ist mein Buch?</b><span>আমার বইটা কোথায়?</span></p>
      <p class="satz"><b lang="de">Das ist meine Familie.</b><span>এই আমার পরিবার।</span></p>
      <p class="satz"><b lang="de">Ich liebe dich, Mama.</b><span>মা, তোমাকে ভালোবাসি।</span></p>
    </div>
  </div>
</div>

<h2><span lang="de">Im Café, auf dem Markt</span>: ক্যাফে ও বাজার</h2>

<div class="split">
  <div class="do">
    <h5>চাওয়া ও কেনা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Ich möchte einen Tee, bitte.</b><span>একটা চা দিন, প্লিজ।</span></p>
      <p class="satz"><b lang="de">Ein Wasser, bitte.</b><span>একটা পানি, প্লিজ।</span></p>
      <p class="satz"><b lang="de">Ich nehme das.</b><span>আমি এটা নেবো।</span></p>
      <p class="satz"><b lang="de">Haben Sie Reis?</b><span>আপনাদের কি চাল আছে?</span></p>
      <p class="satz"><b lang="de">Ein Kilo Äpfel, bitte.</b><span>এক কেজি আপেল দিন।</span></p>
      <p class="satz"><b lang="de">Sonst noch etwas?, Nein, danke.</b><span>আর কিছু?, না, ধন্যবাদ।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>দাম ও বিদায়</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Wie viel kostet das?</b><span>এটার দাম কত?</span></p>
      <p class="satz"><b lang="de">Das ist zu teuer!</b><span>এটা তো বেশি দামি!</span></p>
      <p class="satz"><b lang="de">Das macht fünf Euro.</b><span>পাঁচ ইউরো হয়েছে।</span></p>
      <p class="satz"><b lang="de">Zahlen, bitte!</b><span>বিল দিন, প্লিজ!</span></p>
      <p class="satz"><b lang="de">Danke schön!, Bitte schön!</b><span>ধন্যবাদ!, কিছু না!</span></p>
      <p class="satz"><b lang="de">Schönen Tag noch!</b><span>বাকি দিনটা ভালো কাটুক!</span></p>
    </div>
  </div>
</div>

<h2><span lang="de">Hilfe!</span>: সাহায্য ও পথ</h2>

<div class="split">
  <div class="do">
    <h5>যখন আটকে গেছো</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Entschuldigung!</b><span>মাফ করবেন!</span></p>
      <p class="satz"><b lang="de">Können Sie mir helfen?</b><span>আমাকে একটু সাহায্য করবেন?</span></p>
      <p class="satz"><b lang="de">Ich verstehe nicht.</b><span>আমি বুঝিনি।</span></p>
      <p class="satz"><b lang="de">Sprechen Sie Englisch?</b><span>আপনি কি ইংরেজি বলেন?</span></p>
      <p class="satz"><b lang="de">Ich habe eine Frage.</b><span>আমার একটা প্রশ্ন আছে।</span></p>
      <p class="satz"><b lang="de">Ich weiß nicht.</b><span>আমি জানি না।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>পথ খোঁজা</h5>
    <div class="satz-list">
      <p class="satz"><b lang="de">Wo ist der Bahnhof?</b><span>স্টেশন কোথায়?</span></p>
      <p class="satz"><b lang="de">Wo ist die Toilette?</b><span>টয়লেট কোথায়?</span></p>
      <p class="satz"><b lang="de">Ist das weit?</b><span>এটা কি দূরে?</span></p>
      <p class="satz"><b lang="de">Links? Rechts? Geradeaus?</b><span>বামে? ডানে? সোজা?</span></p>
      <p class="satz"><b lang="de">Ich suche die Schule.</b><span>আমি স্কুলটা খুঁজছি।</span></p>
      <p class="satz"><b lang="de">Vielen Dank!, Gern geschehen!</b><span>অনেক ধন্যবাদ!, কিছু না!</span></p>
    </div>
  </div>
</div>
`,

/* ------------------------------------------------------------
   মন থেকে
   ------------------------------------------------------------ */

"von-herzen": `
<p>এতদিন তুমি নকল করেছো। আজ থেকে বানাবে। পার্থক্যটা বিরাট, আর এই পাতাটাই সেই মোড়।</p>

<h2>পাঁচটা প্রশ্ন: যেকোনো ছবি থেকে একটা অনুচ্ছেদ</h2>

<p>একটা ছবি নাও, বা জানালা দিয়ে তাকাও, বা নিজের ঘরটা দেখো। তারপর নিজেকে পাঁচটা প্রশ্ন
করো, উত্তরগুলো জোড়া দিলেই একটা অনুচ্ছেদ।</p>

<div class="table-scroll">
<table>
  <thead><tr><th>প্রশ্ন</th><th>মানে</th><th>নমুনা উত্তর</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>Was siehst du?</b></td><td>কী দেখছো?</td>
        <td lang="de">Ich sehe eine Frau und ein Kind.</td></tr>
    <tr><td lang="de"><b>Wo sind sie?</b></td><td>তারা কোথায়?</td>
        <td lang="de">Sie sind zu Hause, in der Küche.</td></tr>
    <tr><td lang="de"><b>Was machen sie?</b></td><td>কী করছে?</td>
        <td lang="de">Die Frau kocht. Das Kind spielt.</td></tr>
    <tr><td lang="de"><b>Wie sind sie?</b></td><td>কেমন তারা?</td>
        <td lang="de">Sie sind glücklich. Das Kind lacht.</td></tr>
    <tr><td lang="de"><b>Was möchtest du?</b></td><td>তুমি কী চাও?</td>
        <td lang="de">Ich möchte auch kochen!</td></tr>
  </tbody>
</table>
</div>

<p><span lang="de">in der Küche</span> (রান্নাঘরে) আর <span lang="de">zu Hause</span>
(বাসায়), এগুলো এখন 'তৈরি টুকরো'। কেন <span lang="de">der</span> হলো, সেটা
<a href="/deutsch/stufe-2/index.html">Stufe ২-র গল্প</a>। আজ শুধু ব্যবহার করো।</p>

<h2><span lang="de">Mein Tag</span>: রোজ রাতে নিজের দিনটা</h2>

<p>ঘুমানোর আগে দিনটা জার্মানে বলো। ইংরেজিতে যে অভ্যাসটা তুমি বানিয়েছিলে, এখন সেটা
দুই ভাষায়।</p>

<div class="table-scroll">
<table>
  <thead><tr><th>কখন</th><th>নমুনা</th></tr></thead>
  <tbody>
    <tr><td lang="de"><b>Morgen</b> · সকাল</td>
        <td lang="de">Ich stehe um sechs Uhr auf. Ich trinke Tee und esse Brot.</td></tr>
    <tr><td lang="de"><b>Tag</b> · দিন</td>
        <td lang="de">Ich gehe zur Schule. Ich lerne Deutsch und Englisch.</td></tr>
    <tr><td lang="de"><b>Abend</b> · সন্ধ্যা</td>
        <td lang="de">Ich helfe zu Hause. Ich koche mit Mama.</td></tr>
    <tr><td lang="de"><b>Nacht</b> · রাত</td>
        <td lang="de">Ich esse Reis mit Fisch. Um zehn Uhr gehe ich schlafen.</td></tr>
    <tr><td lang="de"><b>Gefühl</b> · অনুভূতি</td>
        <td lang="de">Der Tag war gut. Ich bin stolz. Ich gebe nicht auf!</td></tr>
  </tbody>
</table>
</div>

<p>এখানেও কয়েকটা তৈরি টুকরো আছে: <span lang="de">stehe … auf</span> (উঠি, খেয়াল করো,
<span lang="de">auf</span> বাক্যের শেষে চলে গেছে), <span lang="de">zur Schule</span>
(স্কুলে), <span lang="de">war</span> (ছিল), <span lang="de">gebe nicht auf</span>
(হাল ছাড়ি না)। এগুলো এখন গানের লাইন, ব্যাকরণ পরে আসবে, আর যখন আসবে তখন চেনা লাগবে।</p>

<h2><span lang="de">Selbstgespräch</span>: গোপন অস্ত্র</h2>

<p>সারাদিন, বিনামূল্যে, কেউ শুনছে না। ভাষা শেখার সবচেয়ে কম কথিত আর সবচেয়ে কার্যকর
কৌশলটা হলো নিজের সাথে কথা বলা।</p>

<ol>
  <li><b>হাতের কাজ বলে বলে করো।</b>
      <span lang="de">Ich öffne die Tür. Ich trinke Wasser. Ich koche Reis.</span></li>
  <li><b>যা দেখো, নাম দাও।</b>
      <span lang="de">Das ist ein Tisch. Der Himmel ist grau. Das Wasser ist kalt.</span></li>
  <li><b>নিজেকে প্রশ্ন করো।</b>
      <span lang="de">Was mache ich jetzt? Wo ist mein Stift? Warum bin ich müde?</span></li>
  <li><b>নিজের সাথে তর্ক করো।</b>
      <span lang="de">Ich bin müde… aber ich lerne weiter!</span></li>
  <li><b>আয়নার সামনে বলো।</b>
      <span lang="de">Ich heiße ___. Ich lerne Deutsch. Ich gebe nicht auf!</span></li>
</ol>

<div class="merke"><b lang="de">Niemand hört zu. Niemand lacht. Hier stirbt die Angst.</b><br>
কেউ শুনছে না, কেউ হাসছে না: এখানেই ভয়টা মরে। আর ভয়টা মরলে বাকিটা শুধু সময়ের ব্যাপার।</div>
`,

/* ------------------------------------------------------------
   পরিকল্পনা
   ------------------------------------------------------------ */

plan: `
<p>জানা আর করা এক জিনিস নয়। এই পাতাটা করার জন্য: দিনে এক ঘণ্টা কীভাবে ভাগ করবে,
৩০ দিনে কোথায় পৌঁছাবে, আর যে সাতটা ভুল সবাই করে সেগুলো কীভাবে এড়াবে।</p>

<h2>রোজকার এক ঘণ্টা</h2>

<div class="table-scroll">
<table class="routine">
  <thead><tr><th>কত</th><th>কী</th><th>কেন</th></tr></thead>
  <tbody>
    <tr><td class="mono">১০ মি</td><td><b lang="de">Warm-up</b>: গতকালের বাক্যগুলো জোরে</td>
        <td>কালকের পাতাটা আবার মুখে আনা। বাদ দিলে পুরো ব্যবস্থাটা ভেঙে পড়ে।</td></tr>
    <tr><td class="mono">১৫ মি</td><td>নতুন <span lang="de">Muster</span> + নিজের ১০টা বাক্য</td>
        <td>একটা ছাঁচ নাও, তারপর নিজের জীবন ঢালো। অন্যের বাক্য মনে থাকে না।</td></tr>
    <tr><td class="mono">১৫ মি</td><td><b lang="de">Sprechen</b>: ছবি বর্ণনা / <span lang="de">Mein Tag</span> / আয়না</td>
        <td>বলা-ই আসল কাজ। ফোনে রেকর্ড করে শুনলে আরও ভালো।</td></tr>
    <tr><td class="mono">১০ মি</td><td><b lang="de">Hören</b>: ধীর জার্মান শুনে নকল</td>
        <td>প্রতিটা লাইন থামিয়ে হুবহু বলো। কান আগে, বোঝা পরে।</td></tr>
    <tr><td class="mono">১০ মি</td><td><span lang="de">der·die·das</span> কার্ড: ১০টা শব্দ টুপিসহ</td>
        <td>নীল-লাল-সবুজে লেখো, জোরে পড়ো। ২০০ শব্দের পরে কান নিজেই আন্দাজ করা শুরু করবে।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">ইংরেজির চর্চা দিনের অন্য সময়ে চলবে, আলাদা ৩০ মিনিটে। দুই ভাষা,
দুই আলাদা স্লট: এক ঘণ্টায় মেশাবে না। মেশালে দুটোই ঘোলাটে হয়।</div>

<h2>৩০ দিনের মানচিত্র</h2>

<div class="table-scroll">
<table class="karte">
  <thead><tr><th>দিন</th><th lang="de">Fokus</th><th>যা পারবে</th></tr></thead>
  <tbody>
    <tr><td class="mono">১–৩</td><td>ধ্বনি + জোরে পড়া</td>
        <td>যেকোনো জার্মান শব্দ দেখে পড়া: w=ভ, ei=আই, ch দুই রূপ।</td></tr>
    <tr><td class="mono">৪–৬</td><td lang="de">sein</td>
        <td>নিজের পরিচয় ও অনুভূতি বলা, না বলা, প্রশ্ন করা।</td></tr>
    <tr><td class="mono">৭–৯</td><td lang="de">haben + kein</td>
        <td>কী আছে, কী নেই: পরিবার, জিনিস, খিদে।</td></tr>
    <tr><td class="mono">১০–১৪</td><td>ক্রিয়ার মেশিন</td>
        <td>রোজকার কাজ বলা, ছয় কর্তায়, রূপবদলকারীসহ।</td></tr>
    <tr><td class="mono">১৫–১৭</td><td lang="de">der · die · das</td>
        <td>৫০টা শব্দ টুপিসহ, তিন রঙে। <span lang="de">ein/eine/kein</span>।</td></tr>
    <tr><td class="mono">১৮–২০</td><td lang="de">nicht ও kein</td>
        <td>যেকোনো কিছুতে সঠিকভাবে 'না', আর ভদ্রভাবে ফিরিয়ে দেওয়া।</td></tr>
    <tr><td class="mono">২১–২৩</td><td lang="de">Fragen</td>
        <td>প্রশ্ন করা, এবং উত্তর শোনা। সাতটা W-চাবি।</td></tr>
    <tr><td class="mono">২৪–২৬</td><td lang="de">möchte · kann · muss</td>
        <td>চাওয়া, পারা, বাধ্যতা: জার্মান ছন্দে, বন্ধনীসহ।</td></tr>
    <tr><td class="mono">২৭–২৮</td><td lang="de">Zahlen + Uhrzeit</td>
        <td>দাম, বয়স, সময়: সংখ্যায় স্বাধীনতা।</td></tr>
    <tr><td class="mono">২৯–৩০</td><td lang="de">Satzbank + মুক্ত কথা</td>
        <td>ক্যাফে ও রাস্তার মহড়া, তারপর <span lang="de">Mein Tag</span> পুরোটা জার্মানে।</td></tr>
  </tbody>
</table>
</div>

<p>এই মানচিত্রটাই <a href="/deutsch/stufe-1/arbeitsbuch.html">৩০ দিনের অনুশীলন খাতা</a>,
দিন ধরে ধরে সাজানো। রোজ একটা পাতা, আর প্রতিটা পাতার একই পাঁচটা অংশ।</p>

<h2>সাতটা ভুল আর তার ওষুধ</h2>

<div class="table-scroll">
<table class="paar-tabelle">
  <thead><tr><th>❌ যা বলবে</th><th>✅ যা ঠিক</th><th>কারণ</th></tr></thead>
  <tbody>
    <tr><td lang="de">Tisch (খালি শব্দ)</td><td lang="de">der Tisch</td>
        <td>টুপি ছাড়া শব্দ শেখা মানে দুইবার শেখা।</td></tr>
    <tr><td lang="de">Ich müde bin.</td><td lang="de">Ich bin müde.</td>
        <td>ক্রিয়া দুই নম্বর আসনে, সবসময়।</td></tr>
    <tr><td lang="de">Du kommst morgen?</td><td lang="de">Kommst du morgen?</td>
        <td>প্রশ্নে ক্রিয়া সামনে লাফায়, শুধু সুর বদলালে হয় না।</td></tr>
    <tr><td lang="de">Ich möchte lernen Deutsch.</td><td lang="de">Ich möchte Deutsch lernen.</td>
        <td>বন্ধনী: কাজের শব্দ একদম শেষে।</td></tr>
    <tr><td lang="de">Ich habe nicht Zeit.</td><td lang="de">Ich habe keine Zeit.</td>
        <td>বিশেষ্যকে মারে <span lang="de">kein</span>, <span lang="de">nicht</span> নয়।</td></tr>
    <tr><td lang="de">Wasser = 'ওয়াটার'</td><td lang="de">Wasser = 'ভাসা'</td>
        <td>জার্মান w = ভ। প্রথম দিনের নিয়ম, আর সবচেয়ে বেশি ভোলা নিয়ম।</td></tr>
    <tr><td>(চুপ করে থাকা)</td><td lang="de">Wie bitte? Langsam, bitte!</td>
        <td>চুপ থাকাই একমাত্র আসল ভুল। বাকি সব ভুল রাস্তা।</td></tr>
  </tbody>
</table>
</div>

<div class="merke">এই তালিকাটা প্রিন্ট করে দেয়ালে টাঙাও, ইংরেজির পাতাটার পাশে।
রবিবারে একবার পড়ো। দুই ভাষা, এক দেয়াল সততার।</div>

<h2>শেষ কথা</h2>

<p>একবার তুমি এই পথ হেঁটেছো, শূন্য থেকে সত্যিকারের বাক্য পর্যন্ত, এমন একটা ভাষায়
যেটা তখন অসম্ভব মনে হতো। জার্মান কঠিন নয়, শুধু নতুন। আর এবার তুমি রাস্তাটা চেনো।</p>

<div class="merke"><b lang="de">Jetzt schließ die Datei und sag einen Satz. Laut. Los!</b><br>
এখন পাতাটা বন্ধ করো, আর একটা বাক্য বলো। জোরে। যাও!</div>
`,

};
