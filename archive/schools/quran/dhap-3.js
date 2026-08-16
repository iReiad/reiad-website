/* ============================================================
   content/dhap-3.js: the text of ধাপ ৩, বাক্য থেকে সূরা.

   Keys match the lesson slugs in ../curriculum.js. Same house
   style as dhap-1.js; see that file's header.

   One difference worth knowing about: this ধাপ has no সহায়িকা.
   The first two shipped with a companion booklet that explained
   each day again in more words and added a fact about the Quran;
   this one does not, because by day 30 the learner is reading
   whole surahs and the explaining is done by the verse itself.
   So the কুরআনি তথ্য panels here come from the deck's own asides
   rather than from a companion, and there are fewer of them.

   The last seven days are the point of the whole course. They
   are not new grammar at all: they are four surahs the learner
   has recited their whole life, taken apart with the tools of
   the previous fifty-three days, and then read once more with
   the vowel marks taken away.
   ============================================================ */

export default {

/* ------------------------------------------------------------
   ক্রিয়ার রূপ
   ------------------------------------------------------------ */

"ek-muul-onek-rup": `
<p>দ্বিতীয় ধাপে শিখেছ মূল থেকে ছাঁচ। এবার এক ধাপ গভীরে: একই মূল থেকে ক্রিয়ার অনেক
রূপ, আর প্রতিটা রূপের নিজের একটা মানে।</p>

<h2>বিষয়টা কী</h2>

<p>মূল <span lang="ar" dir="rtl">ع · ل · م</span> ধরে দেখো। তিনটে অক্ষর এক, কিন্তু
রূপ বদলে মানে বদলে যাচ্ছে।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">عَلِمَ</b><span>সে জানল · মূল রূপ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عَلَّمَ</b><span>সে শেখাল · রূপ ২, মাঝে জোর</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَعْلَمَ</b><span>সে জানাল · রূপ ৪, সামনে أ</span></p>
</div>

<p>জানা, শেখানো, জানানো। তিনটে আলাদা কাজ, একটাই মূল।</p>

<h2>কেন এত দরকারি</h2>

<p>কুরআনের বেশির ভাগ ক্রিয়াই মূল রূপ নয়, কোনো না কোনো রূপে গড়া। রূপগুলোর চেহারা
চিনলে অচেনা ক্রিয়াও ধরা যায়, আর মানেও আন্দাজ করা যায়।</p>

<p>আর চেনার পথটা সহজ: প্রতিটি রূপের একটা করে চিহ্ন আছে। মাঝে জোর, সামনে
<span lang="ar" dir="rtl">أ</span>, ভেতরে <span lang="ar" dir="rtl">ت</span>, বা
সামনে <span lang="ar" dir="rtl">اسْت</span>। চিহ্নটা দেখলেই রূপ চেনা যায়, আর রূপ
চিনলে মানে।</p>

<p>মুখস্থ করার কিছু নেই। চিহ্ন চেনো, বাকিটা বারবার দেখলে বসে যাবে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">عَلِمَ · عَلَّمَ · أَعْلَمَ</span>। এক মূল, তিন রূপ।</p>
</div>
`,

"rup-chena": `
<p>চারটে রূপ কুরআনে সবচেয়ে বেশি আসে। আজ শুধু তাদের চিহ্নগুলো চিনে নাও।</p>

<h2>চার চিহ্ন</h2>

<div class="table-scroll">
<table>
  <thead><tr><th>রূপ</th><th>চিহ্ন</th><th>উদাহরণ</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="ar" dir="rtl">فَعَّلَ</td><td>মাঝে জোর (<span lang="ar" dir="rtl">ّ</span>)</td>
        <td lang="ar" dir="rtl">عَلَّمَ</td><td>শেখাল</td></tr>
    <tr><td lang="ar" dir="rtl">أَفْعَلَ</td><td>সামনে <span lang="ar" dir="rtl">أ</span></td>
        <td lang="ar" dir="rtl">أَنْزَلَ</td><td>নাযিল করল</td></tr>
    <tr><td lang="ar" dir="rtl">اِفْتَعَلَ</td><td>ভেতরে <span lang="ar" dir="rtl">ت</span></td>
        <td lang="ar" dir="rtl">اِسْتَمَعَ</td><td>মন দিয়ে শুনল</td></tr>
    <tr><td lang="ar" dir="rtl">اِسْتَفْعَلَ</td><td>সামনে <span lang="ar" dir="rtl">اسْت</span></td>
        <td lang="ar" dir="rtl">اِسْتَغْفَرَ</td><td>ক্ষমা চাইল</td></tr>
  </tbody>
</table>
</div>

<p>এই চারটে চিনলেই অনেক কাজ হয়ে যায়। বাকি রূপগুলো কম আসে, আর সেগুলো নিয়ে আজ ভাবার
দরকার নেই।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">عَلَّمَ · أَنْزَلَ · اِسْتَمَعَ · اِسْتَغْفَرَ</span>।
  প্রতিবার চিহ্নটা কোথায়, খেয়াল করো।</p>
</div>
`,

"rup-dui": `
<p>প্রথম রূপ, আর সবচেয়ে চেনা চিহ্ন: মাঝের অক্ষরে জোর।</p>

<h2><span lang="ar" dir="rtl">فَعَّلَ</span></h2>

<p>মাঝের অক্ষরে শাদ্দা (<span lang="ar" dir="rtl">ّ</span>) বসে। মানে দাঁড়ায় বেশি
করে করা, বা কাউকে দিয়ে করানো।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">عَلَّمَ</b><span>শেখাল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَزَّلَ</b><span>ধাপে ধাপে নাযিল করল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">سَبَّحَ</b><span>পবিত্রতা ঘোষণা করল, তাসবীহ করল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">كَذَّبَ</b><span>মিথ্যা বলে অস্বীকার করল</span></p>
</div>

<p><span lang="ar" dir="rtl">عَلِمَ</span> (জানল) থেকে
<span lang="ar" dir="rtl">عَلَّمَ</span> (শেখাল): মাঝে একটা জোর পড়ায় মানেটা
পাল্টে গেল। জানা নিজের কাজ, শেখানো অন্যের উপর গিয়ে পড়ে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">عَلِمَ</span> আর
  <span lang="ar" dir="rtl">عَلَّمَ</span>। পাশাপাশি বলো, জোরটা কানে ধরো।</p>
</div>
`,

"rup-char": `
<p>দ্বিতীয় চিহ্ন, আর সবচেয়ে সহজে চোখে পড়ে: শব্দের সামনে একটা
<span lang="ar" dir="rtl">أ</span>।</p>

<h2><span lang="ar" dir="rtl">أَفْعَلَ</span></h2>

<p>মানে দাঁড়ায় কিছু করানো বা ঘটানো, মানে কাজটার কারণ হওয়া।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْزَلَ</b><span>নাযিল করল, নামাল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَسْلَمَ</b><span>আত্মসমর্পণ করল, ইসলাম আনল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَخْرَجَ</b><span>বের করল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْعَمَ</b><span>অনুগ্রহ করল</span></p>
</div>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>শেষেরটা তুমি রোজ পড়ো: <span lang="ar" dir="rtl">أَنْعَمْتَ</span> ('তুমি অনুগ্রহ
  করেছ'), সূরা ফাতিহার
  <span lang="ar" dir="rtl">صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ</span>-এ। ওটা এই
  রূপ ৪, আর আজ থেকে সামনের <span lang="ar" dir="rtl">أ</span>-টা তোমার চোখে পড়বে।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">أَنْزَلَ · أَخْرَجَ · أَنْعَمَ</span></p>
</div>
`,

"rup-at-dosh": `
<p>দুটো দিন একসাথে, কারণ দুটো রূপই একই কায়দায় চেনা যায়: একটা চিহ্ন খুঁজে বের করা।</p>

<h2>রূপ ৮: ভেতরে <span lang="ar" dir="rtl">ت</span></h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">اِسْتَمَعَ</b><span>মন দিয়ে শুনল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اِتَّبَعَ</b><span>অনুসরণ করল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اِتَّقَى</b><span>সাবধান হলো, তাকওয়া করল</span></p>
</div>

<h2>রূপ ১০: সামনে <span lang="ar" dir="rtl">اسْت</span></h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">اِسْتَغْفَرَ</b><span>ক্ষমা চাইল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اِسْتَعَانَ</b><span>সাহায্য চাইল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اِسْتَكْبَرَ</b><span>অহংকার করল</span></p>
</div>

<p>রূপ ১০-এর একটা সুন্দর মিল আছে: এটা প্রায়ই 'চাওয়া' বোঝায়।
<span lang="ar" dir="rtl">اِسْتَغْفَرَ</span> মানে ক্ষমা চাওয়া,
<span lang="ar" dir="rtl">اِسْتَعَانَ</span> মানে সাহায্য চাওয়া। সামনে
<span lang="ar" dir="rtl">اسْت</span> দেখলে প্রথমেই 'চাওয়া' ভাবো, আর বেশির ভাগ সময়
মিলে যাবে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">اِسْتَغْفَرَ · اِسْتَعَانَ</span>। দুটোই চাওয়া।</p>
</div>
`,

"chena-line": `
<p>আজ কোনো নতুন নিয়ম নেই। আজ শুধু একটা চেনা লাইনের ভেতরে ঢুকে দেখা।</p>

<h2>সূরা ফাতিহার এক আয়াত</h2>

<div class="ayah" lang="ar" dir="rtl">إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ</div>
<p class="ayah-mane">কেবল তোমারই ইবাদত করি, আর কেবল তোমারই সাহায্য চাই।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">نَعْبُدُ</b><span>আমরা ইবাদত করি · মূল রূপ, মূল <span lang="ar" dir="rtl">ع-ب-د</span></span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَسْتَعِينُ</b><span>আমরা সাহায্য চাই · রূপ ১০, <span lang="ar" dir="rtl">اسْت</span> + <span lang="ar" dir="rtl">ع-و-ن</span></span></p>
</div>

<p>দুটো ক্রিয়াই বর্তমান কালের, দুটোর সামনেই <span lang="ar" dir="rtl">ن</span>, তাই
দুটোই 'আমরা'। কিন্তু দ্বিতীয়টায় বাড়তি <span lang="ar" dir="rtl">اسْت</span> বসেছে,
আর সেটাই 'করি'-কে বানিয়ে দিয়েছে 'চাই'।</p>

<p>রূপ ১০-এর সেই 'চাওয়া' মানেটাই এখানে, নামাজের প্রতি রাকাতে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">نَعْبُدُ · نَسْتَعِينُ</span>। এবার পুরো আয়াতটা,
  ধীরে, দুটো রূপ মনে রেখে।</p>
</div>
`,

"rup-chine-nao": `
<p>সেগমেন্টের শেষ দিন, আর আজ কোনো নতুন কিছু নেই। শুধু চিহ্ন খোঁজা।</p>

<h2>কোন রূপ?</h2>

<p>মাঝে জোর? সামনে <span lang="ar" dir="rtl">أ</span>? সামনে
<span lang="ar" dir="rtl">اسْت</span>? আগে নিজে বলো, তারপর মিলিয়ে নাও।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">نَزَّلَ</b><span>রূপ ২ · মাঝে জোর</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَخْرَجَ</b><span>রূপ ৪ · সামনে أ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اِسْتَغْفَرَ</b><span>রূপ ১০ · সামনে اسْت</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عَلَّمَ</b><span>রূপ ২ · মাঝে জোর</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْعَمَ</b><span>রূপ ৪ · সামনে أ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اِتَّبَعَ</b><span>রূপ ৮ · ভেতরে ت</span></p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">عَلَّمَ · أَنْزَلَ · اِسْتَغْفَرَ</span>। তিনবার,
  আর প্রতিবার রূপের নামটা মনে মনে বলো।</p>
</div>
`,

/* ------------------------------------------------------------
   ভাঙা বহুবচন
   ------------------------------------------------------------ */

"dui-bohuboton": `
<p>দ্বিতীয় ধাপে শিখেছ 'সহজ' বহুবচন: শেষে
<span lang="ar" dir="rtl">ـُونَ</span> বা <span lang="ar" dir="rtl">ـَاتٌ</span>
জুড়ে দেওয়া। কিন্তু অনেক শব্দ বহুবচন হয় অন্যভাবে।</p>

<h2>দুই রকম</h2>

<div class="split">
  <div class="do">
    <h5>সহজ বহুবচন</h5>
    <p class="ayah-mane" style="text-align:start">শেষে চিহ্ন যোগ হয়।</p>
    <div class="shobdo-list">
      <p class="shobdo"><b lang="ar" dir="rtl">مُسْلِم · مُسْلِمُونَ</b><span>আত্মসমর্পণকারী, তারা</span></p>
    </div>
  </div>
  <div class="others">
    <h5>ভাঙা বহুবচন</h5>
    <p class="ayah-mane" style="text-align:start">ভেতরটাই বদলে যায়।</p>
    <div class="shobdo-list">
      <p class="shobdo"><b lang="ar" dir="rtl">كِتَاب · كُتُب</b><span>কিতাব, কিতাবসমূহ</span></p>
    </div>
  </div>
</div>

<p>চিন্তা নেই। ভাঙা বহুবচনেও মূল অক্ষরগুলো একই থাকে, শুধু ভেতরের আওয়াজ বদলায়। তাই
চিনতে পারবে, আর সেটাই আজকের একমাত্র কাজ।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">كِتَاب</span> আর
  <span lang="ar" dir="rtl">كُتُب</span>। অক্ষর এক, আওয়াজ আলাদা।</p>
</div>
`,

"bhanga-bohuboton": `
<p>পাঁচটা জোড়া, আর এগুলো কুরআনে অসংখ্যবার আসে।</p>

<h2>বেশি আসা ভাঙা বহুবচন</h2>

<div class="table-scroll">
<table>
  <thead><tr><th>একবচন</th><th>বহুবচন</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td lang="ar" dir="rtl">كِتَاب</td><td lang="ar" dir="rtl">كُتُب</td><td>কিতাবসমূহ</td></tr>
    <tr><td lang="ar" dir="rtl">رَسُول</td><td lang="ar" dir="rtl">رُسُل</td><td>রাসূলগণ</td></tr>
    <tr><td lang="ar" dir="rtl">نَبِيّ</td><td lang="ar" dir="rtl">أَنْبِيَاء</td><td>নবীগণ</td></tr>
    <tr><td lang="ar" dir="rtl">قَلْب</td><td lang="ar" dir="rtl">قُلُوب</td><td>অন্তরসমূহ</td></tr>
    <tr><td lang="ar" dir="rtl">عَبْد</td><td lang="ar" dir="rtl">عِبَاد</td><td>বান্দাগণ</td></tr>
  </tbody>
</table>
</div>

<p>খেয়াল করো, প্রতিটিতে মূল অক্ষরগুলো একই। শুধু ভেতরের আওয়াজ বদলেছে, আর কখনো সামনে
একটা <span lang="ar" dir="rtl">أ</span> যোগ হয়েছে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">قَلْب · قُلُوب</span>, তারপর
  <span lang="ar" dir="rtl">عَبْد · عِبَاد</span>। জোড়ায় জোড়ায়।</p>
</div>
`,

"bohuboton-quran": `
<p>আজ শুধু চেনা আয়াতের ভেতরে গতকালের শব্দগুলো খুঁজে বের করা।</p>

<h2>কুরআনে দেখো</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">فِي الْقُلُوبِ</b><span>অন্তরসমূহে, মানুষের হৃদয়ে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عِبَادُ اللهِ</b><span>আল্লাহর বান্দাগণ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الرُّسُلُ وَالْأَنْبِيَاءُ</b><span>রাসূলগণ ও নবীগণ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">السَّمَاوَاتُ وَالْأَرْضُ</b><span>আসমানসমূহ ও জমিন</span></p>
</div>

<p>দ্বিতীয়টা খেয়াল করো: <span lang="ar" dir="rtl">عِبَادُ اللهِ</span> একটা
<a href="/quran/dhap-2/idafa.html">ইদাফা</a>ও বটে, ভাঙা বহুবচন দিয়ে গড়া। দুটো জিনিস
একসাথে কাজ করছে, আর এখান থেকেই আয়াত খোলা শুরু হয়।</p>

<p>একই ভাঙা বহুবচন বারবার ফিরে আসে। একবার চিনলে সারাজীবন চেনা।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">فِي الْقُلُوبِ</span> ·
  <span lang="ar" dir="rtl">عِبَادُ اللهِ</span></p>
</div>
`,

"bohuboton-chine-nao": `
<p>সেগমেন্টের শেষ দিন। উল্টো দিক থেকে কাজটা করো: বহুবচন দেখে একবচন বলো।</p>

<h2>কোনটার বহুবচন?</h2>

<p>মূল অক্ষর ধরে বলো এটা কোন একবচন থেকে এসেছে। আগে নিজে, তারপর মিলিয়ে নাও।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">قُلُوب</b><span><span lang="ar" dir="rtl">قَلْب</span> · অন্তর</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رُسُل</b><span><span lang="ar" dir="rtl">رَسُول</span> · রাসূল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">كُتُب</b><span><span lang="ar" dir="rtl">كِتَاب</span> · কিতাব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عِبَاد</b><span><span lang="ar" dir="rtl">عَبْد</span> · বান্দা</span></p>
</div>

<p>মূল অক্ষর চেনাই আসল কাজ। বাকিটা অভ্যাসে সহজ হয়ে যায়।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p>চারটে জোড়া পরপর বলো, একবচন আগে, বহুবচন পরে।</p>
</div>
`,

/* ------------------------------------------------------------
   কর্মবাচ্য
   ------------------------------------------------------------ */

"ke-korlo-ki-holo": `
<p>কখনো বলা হয় শুধু 'কী করা হলো', আর কে করল সেটা বলা হয় না। কুরআনে এটা অনেক আসে,
আর কেন আসে সেটাও সুন্দর।</p>

<h2>বিষয়টা কী</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">خَلَقَ</b><span>কর্তাবাচ্য · সে সৃষ্টি করল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">خُلِقَ</b><span>কর্মবাচ্য · সৃষ্টি করা হলো</span></p>
</div>

<p>খেয়াল করো: অক্ষর একই (<span lang="ar" dir="rtl">خ · ل · ق</span>), শুধু ভেতরের
আওয়াজ বদলেছে। খালাকা হয়ে গেল খুলিকা।</p>

<p>এটাই আরবির কর্মবাচ্য। বাংলার মতো আলাদা কোনো শব্দ যোগ হয় না, শুধু স্বর বদলায়।
তাই চোখে নয়, কানে চিনতে হয়।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">خَلَقَ · خُلِقَ</span>। খালাকা, খুলিকা। তিনবার।</p>
</div>
`,

"kormobachcho-chinho": `
<p>চিহ্নটা ভেতরের আওয়াজে, আর সেটার একটা নির্দিষ্ট নকশা আছে।</p>

<h2>চেনার নিয়ম</h2>

<p>অতীতে প্রথম অক্ষরে পেশ আর মাঝে যের। বর্তমানে সামনে
<span lang="ar" dir="rtl">يُ</span>।</p>

<div class="table-scroll">
<table>
  <thead><tr><th>কাল</th><th>কর্তাবাচ্য</th><th>কর্মবাচ্য</th><th>মানে</th></tr></thead>
  <tbody>
    <tr><td>অতীত</td><td lang="ar" dir="rtl">خَلَقَ</td><td lang="ar" dir="rtl">خُلِقَ</td>
        <td>সৃষ্টি করা হলো</td></tr>
    <tr><td>অতীত</td><td lang="ar" dir="rtl">قَتَلَ</td><td lang="ar" dir="rtl">قُتِلَ</td>
        <td>নিহত হলো</td></tr>
    <tr><td>বর্তমান</td><td lang="ar" dir="rtl">يَبْعَثُ</td><td lang="ar" dir="rtl">يُبْعَثُ</td>
        <td>উঠানো হয়</td></tr>
  </tbody>
</table>
</div>

<p>ছাঁচ হিসেবে মনে রাখো: অতীতে <span lang="ar" dir="rtl">فُعِلَ</span> (খুলিকা),
বর্তমানে <span lang="ar" dir="rtl">يُفْعَلُ</span>। এই আওয়াজটাই চিহ্ন, আর
<a href="/quran/dhap-2/chanch.html">ছাঁচ চেনার</a> অভ্যাস এখানেই কাজে লাগছে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">خُلِقَ · قُتِلَ · يُبْعَثُ</span></p>
</div>
`,

"kormobachcho-quran": `
<p>তিনটে আয়াত, আর তিনটেতেই কর্তা বলা নেই।</p>

<h2>কুরআনে দেখো</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">خُلِقَ الْإِنْسَانُ ضَعِيفًا</b><span>মানুষকে সৃষ্টি করা হয়েছে দুর্বল করে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">وَإِذَا قُرِئَ الْقُرْآنُ</b><span>আর যখন কুরআন পড়া হয়</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يَوْمَئِذٍ يُبْعَثُونَ</b><span>সেদিন তাদের উঠানো হবে</span></p>
</div>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>কর্তা বলা নেই, কারণ কে করেন তা জানা: আল্লাহ। কর্মবাচ্য এখানে তথ্য লুকায় না,
  বরং একটা গাম্ভীর্য আনে। কাজটাই সামনে থাকে, আর কর্তা এত স্পষ্ট যে নাম নেওয়ার
  দরকারই হয় না।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">خُلِقَ الْإِنْسَانُ ضَعِيفًا</span>। ধীরে, দুবার।</p>
</div>
`,

"kormobachcho-chine-nao": `
<p>সেগমেন্টের শেষ দিন। কান দিয়ে চেনার অভ্যাস।</p>

<h2>কর্তাবাচ্য না কর্মবাচ্য?</h2>

<p>ভেতরের আওয়াজ শোনো। পেশ-যের (খুলিকা ধরন) হলে কর্মবাচ্য। বলো তো।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">خَلَقَ</b><span>কর্তাবাচ্য</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">قُتِلَ</b><span>কর্মবাচ্য</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يُتْلَى</b><span>কর্মবাচ্য · পাঠ করা হয়</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">قَالَ</b><span>কর্তাবাচ্য</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أُنْزِلَ</b><span>কর্মবাচ্য · নাযিল করা হয়েছে</span></p>
</div>

<p>শেষেরটা খেয়াল করো: <span lang="ar" dir="rtl">أَنْزَلَ</span> ছিল রূপ ৪, আর
<span lang="ar" dir="rtl">أُنْزِلَ</span> তার কর্মবাচ্য। দুটো নিয়ম একসাথে বসে গেছে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">خَلَقَ · خُلِقَ</span>। খালাকা, খুলিকা, তিনবার।</p>
</div>
`,

/* ------------------------------------------------------------
   বাক্যের হাতিয়ার
   ------------------------------------------------------------ */

inna: `
<p>কিছু ছোট শব্দ বাক্যের শুরুতে বসে অর্থে জোর, সংযোগ বা শর্ত আনে। এই সেগমেন্টে
পাঁচটা, আর এরা ছোট সূরাগুলোয় সবখানে।</p>

<h2><span lang="ar" dir="rtl">إِنَّ</span>: নিশ্চয়ই</h2>

<p>বাক্যের শুরুতে বসে জোর আনে। আর একটা নিয়ম সঙ্গে নিয়ে আসে: পরের নাম-শব্দটা যবর
(<span lang="ar" dir="rtl">ـَ</span>) নেয়।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">إِنَّ اللهَ غَفُورٌ</b><span>নিশ্চয়ই আল্লাহ ক্ষমাশীল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ</b><span>নিশ্চয়ই মানুষ ক্ষতির মধ্যে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">إِنَّا أَعْطَيْنَاكَ</b><span>নিশ্চয়ই আমি তোমাকে দিয়েছি</span></p>
</div>

<p>দ্বিতীয়টায় খেয়াল করো: <span lang="ar" dir="rtl">الْإِنْسَانَ</span> যবর নিয়েছে,
কারণ আগে <span lang="ar" dir="rtl">إِنَّ</span>। শব্দের শেষের চিহ্ন যে কাজ বলে দেয়,
সেই <a href="/quran/dhap-2/tin-tupi.html">দ্বিতীয় ধাপের নিয়ম</a> এখানে কাজ করছে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">إِنَّ اللهَ غَفُورٌ رَحِيمٌ</span></p>
</div>
`,

allazi: `
<p>দুটো বাক্যকে এক করে দেওয়ার শব্দ, আর কুরআনে সবচেয়ে বেশি আসা গঠনগুলোর একটা।</p>

<h2><span lang="ar" dir="rtl">الَّذِي</span> ও <span lang="ar" dir="rtl">الَّذِينَ</span></h2>

<p>একবচনে <span lang="ar" dir="rtl">الَّذِي</span> ('যে'), বহুবচনে
<span lang="ar" dir="rtl">الَّذِينَ</span> ('যারা')।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">الَّذِي خَلَقَ</b><span>যিনি সৃষ্টি করেছেন</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الَّذِينَ آمَنُوا</b><span>যারা ঈমান এনেছে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الَّذِي عَلَّمَ بِالْقَلَمِ</b><span>যিনি কলমের মাধ্যমে শিখিয়েছেন</span></p>
</div>

<p>শেষেরটায় <span lang="ar" dir="rtl">عَلَّمَ</span> দেখলে? ওটা রূপ ২, যেটা তুমি
এই ধাপের তৃতীয় দিনে চিনেছ। নিয়মগুলো একটার উপর আরেকটা বসছে।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p><span lang="ar" dir="rtl">الَّذِينَ آمَنُوا</span> ('যারা ঈমান এনেছে') কুরআনে
  সবচেয়ে বেশি আসা বাক্যাংশগুলোর একটা। একবার চিনলে প্রতি পাতায় চোখে পড়বে।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">الَّذِي خَلَقَ</span> ·
  <span lang="ar" dir="rtl">الَّذِينَ آمَنُوا</span></p>
</div>
`,

kana: `
<p>দ্বিতীয় ধাপে শিখেছ নাম-বাক্যে 'হয়' লাগে না। কিন্তু অতীতে বলতে গেলে? তখন সেই
জায়গাটা <span lang="ar" dir="rtl">كَانَ</span> নিয়ে নেয়।</p>

<h2><span lang="ar" dir="rtl">كَانَ</span>: ছিল</h2>

<p>নাম-বাক্যের শুরুতে বসে, আর খবরটা যবর (<span lang="ar" dir="rtl">ـَ</span>) নেয়।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">كَانَ اللهُ غَفُورًا رَحِيمًا</b><span>আল্লাহ ক্ষমাশীল, দয়ালু</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">إِنَّهُ كَانَ تَوَّابًا</b><span>নিশ্চয়ই তিনি তওবা-কবুলকারী</span></p>
</div>

<p>প্রথমটায় খেয়াল করো: 'ক্ষমাশীল' শব্দটা যবর
(<span lang="ar" dir="rtl">ـًا</span>) নিয়েছে, কারণ শুরুতে
<span lang="ar" dir="rtl">كَانَ</span>। এটাই এর নিয়ম, আর
<span lang="ar" dir="rtl">إِنَّ</span>-এর নিয়মের সাথে মিলিয়ে দেখো: দুটোই পরের
শব্দে যবর আনে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">كَانَ اللهُ غَفُورًا رَحِيمًا</span></p>
</div>
`,

iza: `
<p>দুটো দিন একসাথে, কারণ এই এক শব্দ দিয়ে অনেকগুলো ছোট সূরা শুরু হয়।</p>

<h2><span lang="ar" dir="rtl">إِذَا</span>: যখন</h2>

<p>একটা শর্ত বা সময় বোঝায়।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">إِذَا جَاءَ نَصْرُ اللهِ وَالْفَتْحُ</b><span>যখন আল্লাহর সাহায্য ও বিজয় আসবে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">إِذَا زُلْزِلَتِ الْأَرْضُ</b><span>যখন যমীনকে প্রকম্পিত করা হবে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">وَإِذَا قُرِئَ الْقُرْآنُ</b><span>আর যখন কুরআন পড়া হয়</span></p>
</div>

<p>প্রথম দুটোই দুটো সূরার প্রথম আয়াত: সূরা নাসর আর সূরা যিলযাল। আর দ্বিতীয় ও
তৃতীয়টায় ক্রিয়া দুটো কর্মবাচ্য
(<span lang="ar" dir="rtl">زُلْزِلَتْ</span>, <span lang="ar" dir="rtl">قُرِئَ</span>),
যেটা তুমি গত সেগমেন্টেই চিনেছ।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">إِذَا جَاءَ نَصْرُ اللهِ وَالْفَتْحُ</span></p>
</div>
`,

"ya-ayyuha": `
<p>শেষ হাতিয়ার, আর সবচেয়ে সরাসরি: ডাক।</p>

<h2><span lang="ar" dir="rtl">يَا أَيُّهَا</span>: হে!</h2>

<p>কাউকে ডাকতে বা সম্বোধন করতে ব্যবহার হয়। কুরআন প্রায়ই এভাবে মানুষকে ডাকে, আর এই
শব্দটা শুনলে বুঝবে পরের কথাটা সরাসরি তোমাকে বলা হচ্ছে।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">يَا أَيُّهَا النَّاسُ</b><span>হে মানুষ!</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يَا أَيُّهَا الَّذِينَ آمَنُوا</b><span>হে ঈমানদারগণ!</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يَا أَيُّهَا الْكَافِرُونَ</b><span>হে কাফিরগণ!</span></p>
</div>

<p>দ্বিতীয়টায় <span lang="ar" dir="rtl">الَّذِينَ آمَنُوا</span> আবার চলে এলো।
দুটো হাতিয়ার পাশাপাশি, আর তুমি দুটোই চেনো।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">يَا أَيُّهَا النَّاسُ</span> ·
  <span lang="ar" dir="rtl">يَا أَيُّهَا الَّذِينَ آمَنُوا</span></p>
</div>
`,

"hatiar-chine-nao": `
<p>সেগমেন্টের শেষ দিন। চারটে হাতিয়ার, চারটে কাজ।</p>

<h2>কোন হাতিয়ার, কী মানে?</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">إِنَّ</b><span>নিশ্চয়ই · জোর আনে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الَّذِينَ</b><span>যারা · দুই বাক্য জোড়ে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">إِذَا</b><span>যখন · সময় বা শর্ত</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يَا أَيُّهَا</b><span>হে · ডাক</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">كَانَ</b><span>ছিল · অতীতের নাম-বাক্য</span></p>
</div>

<p>এই কটা হাতিয়ার চিনলে ছোট সূরার প্রায় প্রতিটি লাইনের শুরু চেনা। আর সেটাই পরের
সেগমেন্টের কাজ।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p>পাঁচটা শব্দ পরপর বলো, আর প্রতিটার পরে তার কাজটা বাংলায় বলো।</p>
</div>
`,

/* ------------------------------------------------------------
   পূর্ণ সূরা পড়া
   ------------------------------------------------------------ */

"surah-kivabe": `
<p>শেষ সেগমেন্ট। এবার ষাট দিনের সব শেখা একসাথে কাজে লাগবে।</p>

<h2>গোটা সূরা ভয়ের কিছু নয়</h2>

<p>একেকটা শব্দ ধরো, চেনা টুকরো খুঁজে বের করো, তারপর মানে জোড়া লাগাও। তিন ধাপ, আর
এর বেশি কিছু নয়।</p>

<div class="shobdo-list">
  <p class="shobdo"><b>১ · শব্দ ভাঙো</b><span>প্রতিটি শব্দকে আলাদা করে দেখো।</span></p>
  <p class="shobdo"><b>২ · চেনা খোঁজো</b><span>মূল, ছাঁচ, সর্বনাম, হাতিয়ার চিনে নাও।</span></p>
  <p class="shobdo"><b>৩ · মানে জোড়ো</b><span>টুকরোগুলো মিলিয়ে পুরো ভাব ধরো।</span></p>
</div>

<p>এই তিন ধাপেই যেকোনো ছোট সূরা খুলে যাবে। পরের ছয় দিনে আমরা চারটা সূরায় ঠিক এটাই
করব।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p>তিনটে ধাপ নিজের ভাষায় বলো: ভাঙো, চেনা খোঁজো, জোড়ো।</p>
</div>
`,

ikhlas: `
<p>প্রথম সূরা, আর এটাই সেই সূরা যার প্রথম আয়াত তুমি
<a href="/quran/dhap-1/shob-ekshathe.html">প্রথম ধাপের দশম দিনে</a> পড়েছিলে।</p>

<h2>প্রথম দুই আয়াত</h2>

<div class="ayah" lang="ar" dir="rtl">قُلْ هُوَ اللَّهُ أَحَدٌ</div>
<p class="ayah-mane">বলো, তিনি আল্লাহ, এক।</p>

<div class="tafsil">
  <span><b lang="ar" dir="rtl">قُلْ</b><i>বলো · আদেশ</i></span>
  <span><b lang="ar" dir="rtl">هُوَ</b><i>তিনি · সর্বনাম</i></span>
  <span><b lang="ar" dir="rtl">اللَّهُ</b><i>আল্লাহ</i></span>
  <span><b lang="ar" dir="rtl">أَحَدٌ</b><i>এক · তানভীন</i></span>
</div>

<div class="ayah" lang="ar" dir="rtl">اللَّهُ الصَّمَدُ</div>
<p class="ayah-mane">আল্লাহ অমুখাপেক্ষী, সবাই যাঁর মুখাপেক্ষী।</p>

<h2>শেষ দুই আয়াত</h2>

<div class="ayah" lang="ar" dir="rtl">لَمْ يَلِدْ وَلَمْ يُولَدْ</div>
<p class="ayah-mane">তিনি জন্ম দেননি, জন্মও নেননি।</p>

<div class="tafsil">
  <span><b lang="ar" dir="rtl">لَمْ</b><i>না</i></span>
  <span><b lang="ar" dir="rtl">يَلِدْ</b><i>জন্ম দেয়</i></span>
  <span><b lang="ar" dir="rtl">وَ</b><i>আর</i></span>
  <span><b lang="ar" dir="rtl">لَمْ</b><i>না</i></span>
  <span><b lang="ar" dir="rtl">يُولَدْ</b><i>জন্ম নেওয়া হয়</i></span>
</div>

<div class="ayah" lang="ar" dir="rtl">وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ</div>
<p class="ayah-mane">আর তাঁর সমকক্ষ কেউ নেই।</p>

<p>শেষ থেকে দ্বিতীয় শব্দটা খেয়াল করো:
<span lang="ar" dir="rtl">يُولَدْ</span> কর্মবাচ্য, 'জন্ম নেওয়া হয়'। এই সেগমেন্টের
আগেরটাতেই তুমি কর্মবাচ্য চিনেছ, আর এখানে সেটা কাজে লাগল।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p>পুরো সূরাটা একবার, ধীরে, প্রতিটি শব্দের মানে মনে রেখে।</p>
</div>
`,

nasr: `
<p>তিন আয়াতে একটা গোটা ঘটনা, আর শুরুটা সেই
<a href="/quran/dhap-3/iza.html"><span lang="ar" dir="rtl">إِذَا</span></a> দিয়ে।</p>

<h2>সূরা নাসর</h2>

<div class="ayah" lang="ar" dir="rtl">إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ</div>
<p class="ayah-mane">যখন আল্লাহর সাহায্য ও বিজয় আসবে,</p>

<div class="tafsil">
  <span><b lang="ar" dir="rtl">إِذَا</b><i>যখন</i></span>
  <span><b lang="ar" dir="rtl">جَاءَ</b><i>আসবে</i></span>
  <span><b lang="ar" dir="rtl">نَصْرُ</b><i>সাহায্য</i></span>
  <span><b lang="ar" dir="rtl">اللَّهِ</b><i>আল্লাহর</i></span>
  <span><b lang="ar" dir="rtl">وَالْفَتْحُ</b><i>ও বিজয়</i></span>
</div>

<div class="ayah" lang="ar" dir="rtl">فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ</div>
<p class="ayah-mane">তখন তোমার রবের প্রশংসাসহ তাসবীহ পড়ো, আর তাঁর কাছে ক্ষমা চাও।</p>

<h2>সব চেনা টুকরো একসাথে</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">إِذَا</b><span>যখন · হাতিয়ার, দিন ২০</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَصْرُ اللَّهِ</b><span>ইদাফা · ধাপ ২, দিন ১৩</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">سَبِّحْ</b><span>রূপ ২, আদেশ · দিন ৩</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اسْتَغْفِرْ</b><span>রূপ ১০, আদেশ · দিন ৫</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَبِّكَ</b><span>যুক্ত সর্বনাম · ধাপ ১, দিন ৪</span></p>
</div>

<p>পাঁচটা টুকরো, পাঁচটা আলাদা দিন থেকে। এভাবেই একটা সূরা খোলে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p>পুরো সূরাটা একবার, তারপর শুধু চেনা টুকরোগুলো আলাদা করে বলো।</p>
</div>
`,

asr: `
<p>তিন আয়াতে পুরো জীবনের হিসাব। আর এখানে তোমার দুটো হাতিয়ারই আছে।</p>

<h2>সূরা আসর</h2>

<div class="ayah" lang="ar" dir="rtl">وَالْعَصْرِ</div>
<p class="ayah-mane">সময়ের কসম!</p>

<div class="ayah" lang="ar" dir="rtl">إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ</div>
<p class="ayah-mane">নিশ্চয়ই মানুষ ক্ষতির মধ্যে।</p>

<div class="tafsil">
  <span><b lang="ar" dir="rtl">إِنَّ</b><i>নিশ্চয়ই</i></span>
  <span><b lang="ar" dir="rtl">الْإِنْسَانَ</b><i>মানুষ · যবর</i></span>
  <span><b lang="ar" dir="rtl">لَفِي</b><i>মধ্যেই</i></span>
  <span><b lang="ar" dir="rtl">خُسْرٍ</b><i>ক্ষতি</i></span>
</div>

<div class="ayah" lang="ar" dir="rtl">إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ</div>
<p class="ayah-mane">তারা ছাড়া, যারা ঈমান এনেছে ও সৎকাজ করেছে।</p>

<p>সব হাতিয়ার একসাথে: <span lang="ar" dir="rtl">إِنَّ</span> (নিশ্চয়ই), তার পরে
<span lang="ar" dir="rtl">الْإِنْسَانَ</span> যবর নিয়েছে, আর শেষে
<span lang="ar" dir="rtl">الَّذِينَ آمَنُوا</span>, সেই চেনা বাক্যাংশ।</p>

<p>আর <span lang="ar" dir="rtl">الصَّالِحَاتِ</span> খেয়াল করো: শেষে
<span lang="ar" dir="rtl">ـَاتِ</span>, মানে স্ত্রী-লিঙ্গের বহুবচন, যেটা
<a href="/quran/dhap-2/bisheshon.html">ধাপ ২-এর চৌদ্দ নম্বর দিনে</a> এসেছিল।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p>পুরো সূরাটা একবার। মাত্র তিন আয়াত, আর তার ভেতরে ষাট দিনের অর্ধেক।</p>
</div>
`,

fatiha: `
<p>শেষ সূরা, আর সবচেয়ে চেনা। যে সূরা তুমি রোজ পড়ো, তার ভেতরে তোমার শেখা প্রায় সব
কিছুই আছে।</p>

<h2>আয়াত ধরে ধরে</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</b><span><span lang="ar" dir="rtl">الـ</span> · ইদাফা · বহুবচন</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">مَالِكِ يَوْمِ الدِّينِ</b><span>ইদাফা, দিনের মালিক</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ</b><span>বর্তমান ক্রিয়া · রূপ ১০</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ</b><span>আদেশ + <span lang="ar" dir="rtl">نا</span> · নাম ও বিশেষণ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ</b><span><span lang="ar" dir="rtl">الَّذِينَ</span> · রূপ ৪ · জোড়া-সর্বনাম</span></p>
</div>

<h2>কোথা থেকে কী এলো</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">الْحَمْدُ</b><span>'আল' দিয়ে নির্দিষ্ট · ধাপ ১, দিন ৯</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَبِّ الْعَالَمِينَ</b><span>ইদাফা · ধাপ ২, দিন ১৩</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَعْبُدُ</b><span>বর্তমান, সামনে ن · ধাপ ২, দিন ৬</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَسْتَعِينُ</b><span>রূপ ১০ · ধাপ ৩, দিন ৫</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اهْدِنَا</b><span>আদেশ + 'আমাদের' · ধাপ ২, দিন ৭</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْعَمْتَ</b><span>রূপ ৪ · ধাপ ৩, দিন ৪</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عَلَيْهِمْ</b><span>জোড়া-শব্দ + সর্বনাম · ধাপ ১, দিন ৭</span></p>
</div>

<p>প্রায় প্রতিটি টুকরো চেনা, আর এটাই ষাট দিনের আসল পুরস্কার। যে সূরা তুমি সারা
জীবন পড়েছ, আজ সেটার প্রতিটি শব্দ তোমার সাথে কথা বলছে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p>পুরো ফাতিহা একবার পড়ো, ধীরে। প্রতিটা শব্দে থামো, আর মনে করো সেটা কোন দিনে
  চিনেছিলে।</p>
</div>
`,

"harakat-chara-surah": `
<p>চেনা সূরা, এবার যের-যবর ছাড়া। আগে নিজে পড়ার চেষ্টা করো, তারপর নিচে মিলিয়ে নাও।</p>

<h2>সূরা ইখলাস, চিহ্ন ছাড়া</h2>

<div class="ayah" lang="ar" dir="rtl">قل هو الله احد · الله الصمد</div>

<p class="ayah-mane">এবার মিলিয়ে নাও:</p>

<div class="ayah" lang="ar" dir="rtl">قُلْ هُوَ اللَّهُ أَحَدٌ · اللَّهُ الصَّمَدُ</div>
<p class="ayah-mane">বলো, তিনি আল্লাহ, এক। আল্লাহ অমুখাপেক্ষী।</p>

<p>তুমি সূরা ইখলাস হারাকাত ছাড়া পড়ে ফেললে। শব্দগুলো এখন সত্যিই তোমার।</p>

<p>মনে আছে <a href="/quran/dhap-2/keno-chinho-chara.html">তিনটে সূত্র</a>? শব্দ চেনা,
ছাঁচ চেনা, কাজ চেনা। আজ তিনটেই একসাথে কাজ করল, আর তুমি টেরও পেলে না।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p>উপরের চিহ্ন-ছাড়া লাইনটা তিনবার পড়ো, প্রতিবার একটু দ্রুত।</p>
</div>
`,

"nije-poro-shesh": `
<p>শেষ দিন। আজ শুধু তুমি আর কুরআন।</p>

<h2>নিজে পড়ে দেখো</h2>

<p>হারাকাত ছাড়া তিনটে চেনা লাইন। ধীরে ধীরে, তিন সূত্র মিলিয়ে পড়ো।</p>

<div class="ayah" lang="ar" dir="rtl">الحمد لله رب العالمين</div>
<p class="ayah-mane">সব প্রশংসা আল্লাহর, জগতের রব</p>

<div class="ayah" lang="ar" dir="rtl">ان الانسان لفي خسر</div>
<p class="ayah-mane">নিশ্চয়ই মানুষ ক্ষতির মধ্যে</p>

<div class="ayah" lang="ar" dir="rtl">الذين امنوا وعملوا الصالحات</div>
<p class="ayah-mane">যারা ঈমান এনেছে ও সৎকাজ করেছে</p>

<p>চিহ্ন নেই, তবু পড়তে পারছ। এই তো, কুরআন খুলে গেল।</p>

<h2>ষাট দিনের শেষে</h2>

<div class="shobdo-list">
  <p class="shobdo"><b>নাম, কাজ, ছোট শব্দ, সর্বনাম</b><span>চিনি</span></p>
  <p class="shobdo"><b>মূল ও ছাঁচ</b><span>নতুন শব্দ আন্দাজ করি</span></p>
  <p class="shobdo"><b>তিন কাল ও ক্রিয়ার রূপ</b><span>চিনি</span></p>
  <p class="shobdo"><b>নাম-বাক্য, কাজ-বাক্য, ইদাফা</b><span>বুঝি</span></p>
  <p class="shobdo"><b>ভাঙা বহুবচন ও কর্মবাচ্য</b><span>চিনি</span></p>
  <p class="shobdo"><b>শেষের চিহ্ন কী বলে</b><span>জানি</span></p>
  <p class="shobdo"><b>গোটা ছোট সূরা</b><span>হারাকাত সহ ও ছাড়া, পড়ি ও বুঝি</span></p>
</div>

<p>ষাট দিন আগে যা কেবল চিহ্ন ছিল, আজ তা অর্থপূর্ণ শব্দ। এটাই আসল অর্জন।</p>

<h2>থেমো না</h2>

<p>কোর্স শেষ, কিন্তু পথ চলবে। এবার যা দরকার তা সহজ: রোজ একটু পড়া, আর নতুন সূরায়
চেনা টুকরো খোঁজা। যত খুঁজবে, তত বেশি চিনবে। শব্দগুলো একদিন আপনা-আপনি কথা বলতে
শুরু করবে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">وَقُل رَّبِّ زِدْنِي عِلْمًا</span>
  <br>বলো, হে আমার রব, আমার জ্ঞান বাড়িয়ে দাও।</p>
</div>
`,

};
