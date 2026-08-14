/* ============================================================
   content/dhap-1.js: the text of ধাপ ১, the ten foundation days.

   Keys match the lesson slugs in ../curriculum.js. The value is
   the body of the page: everything between the standfirst and
   the footer nav. build-quran.mjs wraps it in the shared shell.

   HOUSE STYLE, and most of it is the course's own:

     · Bangla explains, Arabic is what is being explained. Never
       the other way round.
     · address the learner as তুমি. The rest of the site says
       আপনি, and the German school explains why it does not; the
       reason here is the same and stronger, because the deck and
       the সহায়িকা both say তুমি throughout.
     · EVERY piece of Arabic carries lang="ar" dir="rtl". Not
       lang alone: without dir, a phrase with a comma or a number
       in it puts that punctuation at the wrong end, and a
       misplaced mark in a verse is a misquotation.
     · no exercise asks the learner to write anything. The course
       says কোনো লেখা নয় on its first slide and means it: the
       drill is always to say a thing out loud.
     · <div class="ayah"> for a verse, with <p class="ayah-mane">
       under it for the meaning
     · <div class="shobdo-list"> for Arabic word + Bangla meaning
     · <div class="tafsil"> for a verse broken word by word. It
       runs right to left, like the verse
     · <div class="tothyo"> for the day's fact about the Quran
     · <div class="mukhe"> for the say-it-aloud drill, last on
       the page, always
   ============================================================ */

export default {

/* ------------------------------------------------------------
   শব্দ ও তার লিঙ্গ
   ------------------------------------------------------------ */

"tin-prokar": `
<p>তুমি আরবি পড়তে পারো। এটাই তোমার সবচেয়ে বড় শক্তি, আর অনেকের সেটাও নেই। এখন কাজ
শুধু একটাই: শব্দগুলোর মানে চিনে ফেলা।</p>

<p>মানে চিনলে পড়ার সময় আর মনে মনে বাংলা করতে হবে না। শুনলেই বুঝবে। সেই পথের প্রথম
পাথরটা আজকের।</p>

<h2>বিষয়টা কী</h2>

<p>আরবির প্রতিটি শব্দ তিন দলের একটাতে পড়ে। শুধু তিনটা, আর এর বাইরে কিছু নেই।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">اِسْم</b><span>নাম-শব্দ: কোনো জিনিস বা মানুষের নাম</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">فِعْل</b><span>কাজ-শব্দ: কোনো কাজ বোঝায়</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">حَرْف</b><span>ছোট শব্দ: একা মানে দেয় না, শব্দ জোড়া লাগায়</span></p>
</div>

<p>মানে ধরার সবচেয়ে সহজ শুরু এটাই। শব্দটা 'নাম' না 'কাজ' না 'ছোট শব্দ', এইটুকু বুঝলেই
বাক্যের কাঠামো ধীরে ধীরে চোখে পড়তে থাকে।</p>

<h2>উদাহরণ</h2>

<div class="split">
  <div class="do">
    <h5>নাম-শব্দ · <span lang="ar" dir="rtl">اِسْم</span></h5>
    <div class="shobdo-list">
      <p class="shobdo"><b lang="ar" dir="rtl">بَيْت</b><span>ঘর</span></p>
      <p class="shobdo"><b lang="ar" dir="rtl">كِتَاب</b><span>বই, কিতাব</span></p>
      <p class="shobdo"><b lang="ar" dir="rtl">قَلَم</b><span>কলম</span></p>
      <p class="shobdo"><b lang="ar" dir="rtl">بَاب</b><span>দরজা</span></p>
      <p class="shobdo"><b lang="ar" dir="rtl">مَاء</b><span>পানি</span></p>
    </div>
  </div>
  <div class="others">
    <h5>কাজ-শব্দ · <span lang="ar" dir="rtl">فِعْل</span></h5>
    <div class="shobdo-list">
      <p class="shobdo"><b lang="ar" dir="rtl">كَتَبَ</b><span>সে লিখল</span></p>
      <p class="shobdo"><b lang="ar" dir="rtl">قَالَ</b><span>সে বলল</span></p>
      <p class="shobdo"><b lang="ar" dir="rtl">عَلِمَ</b><span>সে জানল</span></p>
      <p class="shobdo"><b lang="ar" dir="rtl">نَصَرَ</b><span>সে সাহায্য করল</span></p>
      <p class="shobdo"><b lang="ar" dir="rtl">خَلَقَ</b><span>সে সৃষ্টি করল</span></p>
    </div>
  </div>
</div>

<h3>ছোট শব্দ · <span lang="ar" dir="rtl">حَرْف</span></h3>

<div class="shobdo-gitter">
  <span><b lang="ar" dir="rtl">وَ</b> এবং</span>
  <span><b lang="ar" dir="rtl">مِنْ</b> থেকে</span>
  <span><b lang="ar" dir="rtl">فِي</b> ভেতরে</span>
  <span><b lang="ar" dir="rtl">عَلَى</b> উপরে</span>
  <span><b lang="ar" dir="rtl">إِلَى</b> দিকে</span>
</div>

<p>ছোট শব্দগুলো মুখস্থ করার জিনিস নয়। বারবার দেখলেই চেনা হয়ে যাবে, আর ষাট দিনে তুমি
এগুলো হাজারবার দেখবে।</p>

<h2>নিজে চিনে নাও</h2>

<p>নিচের শব্দগুলো কোন প্রকার? আগে নিজে ভাবো, তারপর মিলিয়ে নাও।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">رَجُل</b><span>মানুষ (পুরুষ) · নাম-শব্দ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">ذَهَبَ</b><span>সে গেল · কাজ-শব্দ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">إِلَى</b><span>দিকে · ছোট শব্দ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">شَمْس</b><span>সূর্য · নাম-শব্দ</span></p>
</div>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>কুরআনের প্রথম লাইন <span lang="ar" dir="rtl">بِسْمِ اللَّهِ</span>, আর এর
  ভেতরেই তিন প্রকারের ছোঁয়া আছে: <span lang="ar" dir="rtl">بِـ</span> একটা ছোট শব্দ,
  <span lang="ar" dir="rtl">اسْم</span> একটা নাম-শব্দ, আর
  <span lang="ar" dir="rtl">اللَّه</span> একটা নাম। প্রথম লাইনেই পুরো ভিত্তিটা লুকানো।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">بَيْت</span> · <span lang="ar" dir="rtl">قَالَ</span> ·
  <span lang="ar" dir="rtl">مِنْ</span>: তিনটে তিন প্রকারের। জোরে পড়ো, আর মনে মনে
  দলটা বলো।</p>
</div>
`,

sorbonam: `
<p>সর্বনাম মানে নামের বদলে বসা ছোট শব্দ: সে, তুমি, আমি। আরবিতে এগুলো একা দাঁড়াতে
পারে, তাই এদের বলা হয় 'আলাদা' সর্বনাম।</p>

<h2>বিষয়টা কী</h2>

<p>আটটা শব্দ, আর এর মধ্যে দুটো তোমার সবচেয়ে বেশি লাগবে:
<span lang="ar" dir="rtl">هُوَ</span> আর <span lang="ar" dir="rtl">هِيَ</span>।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">هُوَ</b><span>সে (ছেলে), তিনি</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">هِيَ</b><span>সে (মেয়ে)</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْتَ</b><span>তুমি (ছেলে)</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْتِ</b><span>তুমি (মেয়ে)</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنَا</b><span>আমি</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَحْنُ</b><span>আমরা</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">هُمْ</b><span>তারা (ছেলেরা)</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْتُمْ</b><span>তোমরা</span></p>
</div>

<p>খেয়াল করো: ছেলে আর মেয়ের জন্য আরবিতে আলাদা শব্দ। বাংলায় 'সে' একটাই, আরবিতে দুটো।
এটা কঠিন কিছু নয়, শুধু নতুন, আর প্রথম দিন থেকেই কানে বসতে শুরু করবে।</p>

<h2>কুরআনে দেখো</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">هُوَ اللَّهُ</b><span>তিনি আল্লাহ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْتَ الْعَلِيمُ الْحَكِيمُ</b><span>তুমিই সব জানো, প্রজ্ঞাময়</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَحْنُ نَعْلَمُ</b><span>আমরা জানি</span></p>
</div>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>সূরা ইখলাস শুরু হয় <span lang="ar" dir="rtl">قُلْ هُوَ اللَّهُ أَحَدٌ</span> দিয়ে,
  একদম শুরুতেই সর্বনাম <span lang="ar" dir="rtl">هُوَ</span> ('তিনি'), যা আল্লাহকে
  বোঝাচ্ছে। এই ছোট্ট সূরাকে হাদিসে কুরআনের এক-তৃতীয়াংশের সমান বলা হয়েছে।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">هُوَ</span> · <span lang="ar" dir="rtl">هِيَ</span> ·
  <span lang="ar" dir="rtl">أَنَا</span>। তিনবার জোরে পড়ো।</p>
</div>
`,

"purush-stri": `
<p>আরবিতে শুধু মানুষের নয়, শব্দেরও লিঙ্গ আছে: পুরুষ
(<span lang="ar" dir="rtl">مُذَكَّر</span>) বা স্ত্রী
(<span lang="ar" dir="rtl">مُؤَنَّث</span>)। ঘর পুরুষ, দয়া স্ত্রী। কেন, তার কোনো
যুক্তি খুঁজতে যেয়ো না।</p>

<h2>বিষয়টা কী</h2>

<p>চেনার সবচেয়ে সহজ চিহ্নটা চোখেই ধরা পড়ে: শব্দের শেষে গোল
<span class="chinho" lang="ar" dir="rtl">ة</span> থাকলে বেশির ভাগ সময় সেটা স্ত্রী-লিঙ্গ।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">مُسْلِم · مُسْلِمَة</b><span>আত্মসমর্পণকারী: পুরুষ, তারপর স্ত্রী</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">مُؤْمِن · مُؤْمِنَة</b><span>বিশ্বাসী</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">صَالِح · صَالِحَة</b><span>সৎ, নেককার</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عَالِم · عَالِمَة</b><span>জ্ঞানী</span></p>
</div>

<p>ডান দিকের শব্দগুলোর শেষে ওই এক চিহ্ন। একই শব্দ, একটা অক্ষর বেশি, আর অন্য লিঙ্গ।</p>

<h2>নিজে চিনে নাও</h2>

<p>শেষে <span lang="ar" dir="rtl">ة</span> আছে কি না দেখো। থাকলে স্ত্রী, না থাকলে পুরুষ।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">جَنَّة</b><span>বাগান, জান্নাত · স্ত্রী</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">كِتَاب</b><span>কিতাব · পুরুষ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَحْمَة</b><span>দয়া · স্ত্রী</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يَوْم</b><span>দিন · পুরুষ</span></p>
</div>

<p>এখন শুধু চিহ্নটা চিনে রাখো। কেন লিঙ্গ মেলাতে হয়, সেই নিয়ম
<a href="/quran/dhap-2/bisheshon.html">দ্বিতীয় ধাপে</a> আসবে, আর তখন আজকের এই এক
অক্ষরই কাজে লাগবে।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>কুরআনের অনেক সুন্দর শব্দই স্ত্রী-লিঙ্গের:
  <span lang="ar" dir="rtl">رَحْمَة</span> (দয়া),
  <span lang="ar" dir="rtl">جَنَّة</span> (জান্নাত), আর
  <span lang="ar" dir="rtl">آيَة</span> (নিদর্শন, আয়াত)। কুরআন নিজেই তৈরি অসংখ্য
  <span lang="ar" dir="rtl">آيَات</span> দিয়ে, আর শব্দটার শেষে সেই
  <span lang="ar" dir="rtl">ة</span>।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">رَحْمَة</span> · <span lang="ar" dir="rtl">جَنَّة</span>।
  শেষের <span lang="ar" dir="rtl">ة</span> শুনতে পাও কি না খেয়াল করো।</p>
</div>
`,

/* ------------------------------------------------------------
   কার জিনিস, কোনটা
   ------------------------------------------------------------ */

"jukto-sorbonam": `
<p>গতকালের সর্বনামগুলো একা দাঁড়াত। আজকেরগুলো দাঁড়ায় না: এরা শব্দের শেষে জুড়ে বসে,
আর মানে দাঁড়ায় 'তার, তোমার, আমার'।</p>

<p>এটা কুরআনের সবখানে আছে। সত্যিই সবখানে।</p>

<h2>বিষয়টা কী</h2>

<p><span lang="ar" dir="rtl">رَبّ</span> (রব) শব্দটা ধরে দেখো। শব্দটা একই থাকছে, শুধু
শেষে ছোট একটা অংশ জুড়ছে, আর প্রতিবার মালিক বদলে যাচ্ছে।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">رَبُّهُ</b><span>তার (ছেলের) রব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَبُّهَا</b><span>তার (মেয়ের) রব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَبُّكَ</b><span>তোমার রব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَبِّي</b><span>আমার রব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَبُّنَا</b><span>আমাদের রব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَبُّهُمْ</b><span>তাদের রব</span></p>
</div>

<h3>শেষের অংশটাই মনে রাখো</h3>

<div class="shobdo-gitter">
  <span><b lang="ar" dir="rtl">ـهُ</b> তার (ছেলে)</span>
  <span><b lang="ar" dir="rtl">ـهَا</b> তার (মেয়ে)</span>
  <span><b lang="ar" dir="rtl">ـكَ</b> তোমার</span>
  <span><b lang="ar" dir="rtl">ـي</b> আমার</span>
  <span><b lang="ar" dir="rtl">ـنَا</b> আমাদের</span>
  <span><b lang="ar" dir="rtl">ـهُمْ</b> তাদের</span>
</div>

<p>একই ছোট অংশ যেকোনো নাম-শব্দের শেষে বসে। রব দিয়ে যা করলে, কিতাব বা ঘর দিয়েও তাই।</p>

<h2>কুরআনে দেখো</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">رَبُّكَ</b><span>তোমার রব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">كِتَابُهُ</b><span>তার কিতাব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">قَوْمُهُ</b><span>তার জাতি</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَفْسَهُ</b><span>তার নিজেকে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">قَلْبِي</b><span>আমার অন্তর</span></p>
</div>

<p>কেন এটা এত দরকারি: 'কার জিনিস' বোঝাতে আরবি আলাদা কোনো শব্দ আনে না, ছোট এই অংশটা
শব্দের সাথেই জুড়ে দেয়। তাই এটা না চিনলে আয়াতের অর্ধেক শব্দ অচেনা লাগবে।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>কুরআনের অনেক দোয়া শুরু হয় <span lang="ar" dir="rtl">رَبَّنَا</span> ('হে আমাদের
  রব') দিয়ে, যেমন <span lang="ar" dir="rtl">رَبَّنَا آتِنَا</span>। এখানে
  <span lang="ar" dir="rtl">رَبّ</span>-এর সাথে যুক্ত
  <span lang="ar" dir="rtl">ـنَا</span> মানে 'আমাদের'। যুক্ত সর্বনাম চিনলে এই
  দোয়াগুলোও চেনা লাগবে।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">رَبِّي</span> · <span lang="ar" dir="rtl">رَبُّكَ</span>
  · <span lang="ar" dir="rtl">رَبَّنَا</span>। ধীরে ধীরে বলো।</p>
</div>
`,

"ei-oi": `
<p>কাছের জিনিস দেখাতে 'এই', দূরের জিনিস দেখাতে 'ঐ'। আর যথারীতি, ছেলে-জিনিস আর
মেয়ে-জিনিসের জন্য আলাদা শব্দ।</p>

<h2>বিষয়টা কী</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">هَٰذَا</b><span>এই (পুরুষ)</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">هَٰذِهِ</b><span>এই (স্ত্রী)</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">ذَٰلِكَ</b><span>ঐ (পুরুষ)</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">تِلْكَ</b><span>ঐ (স্ত্রী)</span></p>
</div>

<p>এর মধ্যে <span lang="ar" dir="rtl">ذَٰلِكَ</span> কুরআনের সবচেয়ে বেশি আসা
শব্দগুলোর একটা। এটা ভালো করে চিনে রাখো, আজই।</p>

<h2>কুরআনে দেখো</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">ذَٰلِكَ الْكِتَابُ</b><span>ঐ কিতাব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">هَٰذَا رَبِّي</b><span>এই আমার রব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">تِلْكَ آيَاتُ اللَّهِ</b><span>ঐগুলো আল্লাহর আয়াত</span></p>
</div>

<p>দ্বিতীয় লাইনটা খেয়াল করো: <span lang="ar" dir="rtl">رَبِّي</span>, গতকালের সেই
'আমার'। দিনগুলো একটার উপর আরেকটা দাঁড়াচ্ছে, আর এভাবেই ষাট দিন পার হবে।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>সবচেয়ে বড় সূরা, সূরা বাকারা, তার দ্বিতীয় আয়াত শুরু হয়
  <span lang="ar" dir="rtl">ذَٰلِكَ الْكِتَابُ</span> দিয়ে ('ঐ কিতাব, যাতে কোনো সন্দেহ
  নেই')। দেখানোর একটা শব্দ দিয়েই কুরআনের মূল বার্তা শুরু।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">هَٰذَا</span> · <span lang="ar" dir="rtl">ذَٰلِكَ</span>।
  একটা কাছের, একটা দূরের।</p>
</div>
`,

/* ------------------------------------------------------------
   জোড়া-শব্দ
   ------------------------------------------------------------ */

"chhoto-jora": `
<p>ভেতরে, থেকে, উপরে, দিকে, জন্য। এই শব্দগুলো নিজে বড় কিছু নয়, কিন্তু কুরআনের প্রায়
প্রতিটি লাইনে আছে। এরা শব্দকে শব্দের সাথে জোড়ে, আর জায়গা, দিক ও সম্পর্ক বোঝায়।</p>

<h2>সবচেয়ে দরকারি দশটা</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">فِي</b><span>ভেতরে, মধ্যে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">مِنْ</b><span>থেকে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">إِلَىٰ</b><span>দিকে, পর্যন্ত</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عَلَىٰ</b><span>উপরে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عَنْ</b><span>সম্পর্কে, থেকে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">بِـ</b><span>দিয়ে, সাথে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">لِـ</b><span>জন্য</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">كَـ</b><span>মতো</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">مَعَ</b><span>সাথে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عِنْدَ</b><span>কাছে</span></p>
</div>

<p>শেষের দিকের তিনটা (<span lang="ar" dir="rtl">بِـ</span>,
<span lang="ar" dir="rtl">لِـ</span>, <span lang="ar" dir="rtl">كَـ</span>) আলাদা
শব্দ হয়ে বসে না, পরের শব্দের সাথে লেগে যায়। তাই লেখার সময় এদের খুঁজে পেতে একটু
অভ্যাস লাগে।</p>

<h2>কুরআনে দেখো</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">فِي الْأَرْضِ</b><span>জমিনে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">مِنَ النَّاسِ</b><span>মানুষের মধ্য থেকে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عَلَىٰ كُلِّ شَيْءٍ</b><span>সব কিছুর উপরে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">إِلَى اللَّهِ</b><span>আল্লাহর দিকে</span></p>
</div>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>পুরো কুরআনের একদম শেষ শব্দগুলো, সূরা নাসের শেষে,
  <span lang="ar" dir="rtl">مِنَ الْجِنَّةِ وَالنَّاسِ</span> ('জিন ও মানুষের মধ্য
  থেকে')। এখানেও একটা ছোট জোড়া-শব্দ <span lang="ar" dir="rtl">مِنْ</span>। ছোট শব্দ
  দিয়েই কুরআন শেষ হয়।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">فِي</span> · <span lang="ar" dir="rtl">مِنْ</span> ·
  <span lang="ar" dir="rtl">إِلَىٰ</span> · <span lang="ar" dir="rtl">عَلَىٰ</span> ·
  <span lang="ar" dir="rtl">لِـ</span></p>
</div>
`,

"jora-sorbonam": `
<p>আজ দুটো চেনা জিনিস মিশছে: <a href="/quran/dhap-1/chhoto-jora.html">গতকালের ছোট
জোড়া-শব্দ</a> আর <a href="/quran/dhap-1/jukto-sorbonam.html">চার দিন আগের যুক্ত
সর্বনাম</a>।</p>

<p>মিশলে দাঁড়ায়: তার জন্য, এতে, তার উপর।</p>

<h2>বিষয়টা কী</h2>

<p><span lang="ar" dir="rtl">لِـ</span> আর <span lang="ar" dir="rtl">ـهُ</span> মিলে
<span lang="ar" dir="rtl">لَهُ</span>। <span lang="ar" dir="rtl">فِي</span> আর
<span lang="ar" dir="rtl">ـهِ</span> মিলে <span lang="ar" dir="rtl">فِيهِ</span>।
আলাদা শব্দ লাগে না, ছোট অংশটা জুড়ে যায়।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">لَهُ</b><span>তার জন্য, তাঁরই</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">بِهِ</b><span>এর দ্বারা</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">فِيهِ</b><span>এতে, এর ভেতরে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">إِلَيْهِ</b><span>তার দিকে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عَلَيْهِ</b><span>তার উপর</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">مِنْهُ</b><span>এর থেকে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">مَعَهُ</b><span>তার সাথে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عِنْدَهُ</b><span>তার কাছে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عَلَيْهِمْ</b><span>তাদের উপর</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">لَهُمْ</b><span>তাদের জন্য</span></p>
</div>

<h2>কুরআনে দেখো</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">لَهُ الْمُلْكُ</b><span>রাজত্ব তাঁরই</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">فِيهِ هُدًى</b><span>এতে হেদায়াত আছে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">عَلَيْهِمْ</b><span>তাদের উপর</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">بِهِ</b><span>এর দ্বারা</span></p>
</div>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p><span lang="ar" dir="rtl">لَهُ الْمُلْكُ</span> ('রাজত্ব তাঁরই') কুরআনে বারবার
  আসে। আর সূরা বাকারার শুরুতেই
  <span lang="ar" dir="rtl">لَا رَيْبَ فِيهِ</span> ('এতে কোনো সন্দেহ নেই'), যেখানে
  <span lang="ar" dir="rtl">فِيهِ</span> মানে 'এতে'। আজকের দুটো শব্দই কুরআনের সবচেয়ে
  পরিচিত লাইনগুলোয় বসে আছে।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">لَهُ</span> · <span lang="ar" dir="rtl">فِيهِ</span> ·
  <span lang="ar" dir="rtl">عَلَيْهِ</span> · <span lang="ar" dir="rtl">بِهِ</span></p>
</div>
`,

/* ------------------------------------------------------------
   শব্দভাণ্ডার ও প্রথম আয়াত
   ------------------------------------------------------------ */

"beshi-asha-shobdo": `
<p>একটা কথা শুরুতেই বলে রাখা ভালো, কারণ এটাই এই কোর্সের পুরো ভিত্তি: কুরআনে অল্প কিছু
শব্দই বারবার ফিরে আসে। সবচেয়ে বেশি ব্যবহৃত প্রায় ৩০০টা শব্দ চিনলে কুরআনের বেশির ভাগ
শব্দ তোমার চেনা হয়ে যাবে।</p>

<p>আজ তার মধ্যে সবচেয়ে দরকারি চৌদ্দটা।</p>

<h2>বেশি আসা নাম-শব্দ</h2>

<div class="shobdo-gitter">
  <span><b lang="ar" dir="rtl">اللَّه</b> আল্লাহ</span>
  <span><b lang="ar" dir="rtl">رَبّ</b> রব, প্রভু</span>
  <span><b lang="ar" dir="rtl">يَوْم</b> দিন</span>
  <span><b lang="ar" dir="rtl">نَاس</b> মানুষ</span>
  <span><b lang="ar" dir="rtl">أَرْض</b> জমিন</span>
  <span><b lang="ar" dir="rtl">سَمَاء</b> আসমান</span>
  <span><b lang="ar" dir="rtl">كِتَاب</b> কিতাব</span>
  <span><b lang="ar" dir="rtl">رَسُول</b> রাসূল</span>
  <span><b lang="ar" dir="rtl">نَبِيّ</b> নবী</span>
  <span><b lang="ar" dir="rtl">قَوْم</b> জাতি</span>
  <span><b lang="ar" dir="rtl">نَفْس</b> নিজ, প্রাণ</span>
  <span><b lang="ar" dir="rtl">قَلْب</b> অন্তর</span>
  <span><b lang="ar" dir="rtl">نُور</b> আলো</span>
  <span><b lang="ar" dir="rtl">رَحْمَة</b> দয়া</span>
</div>

<h2>আল্লাহর কিছু নাম</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">الرَّحْمَٰن</b><span>পরম দয়ালু</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الرَّحِيم</b><span>অতি দয়ালু</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْمَلِك</b><span>বাদশাহ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْغَفُور</b><span>ক্ষমাশীল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْعَلِيم</b><span>সর্বজ্ঞ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">السَّمِيع</b><span>সর্বশ্রোতা</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْبَصِير</b><span>সর্বদ্রষ্টা</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْحَكِيم</b><span>প্রজ্ঞাময়</span></p>
</div>

<p>এই নামগুলো শুধু মুখে নয়, মানে বুঝে বলো। কুরআনে এগুলো বারবার শুনবে, আর প্রতিবার
একটু বেশি চেনা লাগবে।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>বিসমিল্লাহতেই আল্লাহর দুটো নাম, <span lang="ar" dir="rtl">الرَّحْمَٰن</span> আর
  <span lang="ar" dir="rtl">الرَّحِيم</span>, আর দুটোই এক মূল
  <span lang="ar" dir="rtl">ر-ح-م</span> ('দয়া') থেকে। কুরআন খোলেই দয়া দিয়ে। নাম
  দুটো প্রায়ই জোড়ায় আসে, যেমন
  <span lang="ar" dir="rtl">غَفُورٌ رَحِيمٌ</span>।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">اللَّه</span> · <span lang="ar" dir="rtl">رَبّ</span> ·
  <span lang="ar" dir="rtl">الرَّحْمَٰن</span> ·
  <span lang="ar" dir="rtl">الرَّحِيم</span></p>
</div>
`,

al: `
<p>শব্দের আগে <span lang="ar" dir="rtl">الـ</span> বসলে সেটা 'নির্দিষ্ট' হয়ে যায়:
'একটা' নয়, 'সেই'। বাংলায় যেমন 'বই' আর 'বইটি'।</p>

<h2>বিষয়টা কী</h2>

<p><span lang="ar" dir="rtl">الـ</span> সবসময় একই থাকে। রূপ বদলায় না, লিঙ্গ দেখে না,
শুধু শব্দের সামনে বসে যায়।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">كِتَاب · الْكِتَاب</b><span>একটা কিতাব, সেই কিতাব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يَوْم · الْيَوْم</b><span>একটা দিন, আজকের দিন</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَاس · النَّاس</b><span>মানুষ, সেই মানুষজন</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَرْض · الْأَرْض</b><span>জমিন, সেই জমিন</span></p>
</div>

<h2>কখনো 'ল' শোনা যায় না</h2>

<p>এটাই একমাত্র জায়গা যেখানে চোখ আর কান আলাদা কথা বলে। কখনো
<span lang="ar" dir="rtl">الـ</span>-এর 'ল' উচ্চারণে আসে না, বদলে পরের অক্ষরটা জোর
পায়, আর সেই জোরের চিহ্নটা শাদ্দা।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">الْقَمَر</b><span>আল্‌-ক্বামার (চাঁদ) · 'ল' শোনা যায়</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْبَيْت</b><span>আল্‌-বাইত (ঘর) · 'ল' শোনা যায়</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الشَّمْس</b><span>আশ্‌-শামস (সূর্য) · 'ল' নেই</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الرَّحْمَٰن</b><span>আর্‌-রাহমান · 'ল' নেই</span></p>
</div>

<p>ভয় নেই, আর এটা মুখস্থ করারও দরকার নেই। তুমি তো হরকত দেখে পড়ছ, তাই যা লেখা আছে
তাই পড়লে এটা আপনা-আপনি ঠিক হয়ে যাবে।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>সূরা ফাতিহা শুরু হয় <span lang="ar" dir="rtl">الْحَمْدُ لِلَّهِ</span> দিয়ে, আর
  <span lang="ar" dir="rtl">الْحَمْد</span> মানে 'সব প্রশংসা', নির্দিষ্ট, সামনে সেই
  <span lang="ar" dir="rtl">الـ</span> সহ। ছোট্ট দুটো অক্ষর একটা শব্দকে 'সেই বিশেষ'
  বানিয়ে দেয়।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">الْكِتَاب</span> ·
  <span lang="ar" dir="rtl">النَّاس</span> ·
  <span lang="ar" dir="rtl">الشَّمْس</span>। শেষ দুটোয় 'ল' শুনতে পাচ্ছ না, খেয়াল করো।</p>
</div>
`,

"shob-ekshathe": `
<p>দশ দিন হলো। এবার সব একসাথে।</p>

<p>নিচের তিনটা আয়াত তুমি সারা জীবন শুনে এসেছ। আজ প্রথমবার শব্দ ধরে ধরে দেখো, আর
খেয়াল করো কতগুলো টুকরো ইতিমধ্যেই তোমার চেনা।</p>

<h2>আয়াত ১</h2>

<div class="ayah" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
<p class="ayah-mane">আল্লাহর নামে, যিনি পরম দয়ালু, অতি দয়ালু।</p>

<div class="tafsil">
  <span><b lang="ar" dir="rtl">بِسْمِ</b><i>নামে</i></span>
  <span><b lang="ar" dir="rtl">اللَّهِ</b><i>আল্লাহর</i></span>
  <span><b lang="ar" dir="rtl">الرَّحْمَٰنِ</b><i>পরম দয়ালু</i></span>
  <span><b lang="ar" dir="rtl">الرَّحِيمِ</b><i>অতি দয়ালু</i></span>
</div>

<h2>আয়াত ২</h2>

<div class="ayah" lang="ar" dir="rtl">الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</div>
<p class="ayah-mane">সব প্রশংসা আল্লাহর, যিনি সকল জগতের রব।</p>

<div class="tafsil">
  <span><b lang="ar" dir="rtl">الْحَمْدُ</b><i>সব প্রশংসা</i></span>
  <span><b lang="ar" dir="rtl">لِلَّهِ</b><i>আল্লাহর জন্য</i></span>
  <span><b lang="ar" dir="rtl">رَبِّ</b><i>রব</i></span>
  <span><b lang="ar" dir="rtl">الْعَالَمِينَ</b><i>সকল জগতের</i></span>
</div>

<h2>আয়াত ৩</h2>

<div class="ayah" lang="ar" dir="rtl">قُلْ هُوَ اللَّهُ أَحَدٌ</div>
<p class="ayah-mane">বলো, তিনি আল্লাহ, এক।</p>

<div class="tafsil">
  <span><b lang="ar" dir="rtl">قُلْ</b><i>বলো</i></span>
  <span><b lang="ar" dir="rtl">هُوَ</b><i>তিনি</i></span>
  <span><b lang="ar" dir="rtl">اللَّهُ</b><i>আল্লাহ</i></span>
  <span><b lang="ar" dir="rtl">أَحَدٌ</b><i>এক</i></span>
</div>

<h2>দেখো, কত কিছু চিনে ফেলেছ</h2>

<p>এই তিন আয়াতের ভেতরেই দশ দিনের শেখা প্রায় সবটা লুকিয়ে আছে।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">بِـ</b><span>ছোট জোড়া-শব্দ, 'দিয়ে' · দিন ৬</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اسْم</b><span>নাম-শব্দ · দিন ১</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الرَّحْمَٰن</b><span>'আল' দিয়ে নির্দিষ্ট · দিন ৯</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">لِلَّهِ</b><span>'জন্য' জুড়ে বসেছে · দিন ৬</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَبّ</b><span>বেশি আসা শব্দ · দিন ৮</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">هُوَ</b><span>আলাদা সর্বনাম · দিন ২</span></p>
</div>

<p>মাত্র দশ দিনে তুমি কুরআনের শব্দ ধরে ধরে মানে অনুভব করতে শুরু করেছ। এটাই আসল শুরু,
আর বাকি পঞ্চাশ দিন এই একই জিনিসের উপর দাঁড়াবে।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>বিসমিল্লাহ দিয়ে কুরআনের প্রতিটি সূরা শুরু হয়, শুধু সূরা তওবা (৯) ছাড়া। সূরা
  ফাতিহা (৭ আয়াত) নামাজের প্রতি রাকাতে পড়া হয়, তাই এটাই সবচেয়ে বেশি পড়া অংশ। আর
  সূরা ইখলাস (৪ আয়াত) নিয়ে হাদিসে বলা হয়েছে, এটা কুরআনের এক-তৃতীয়াংশের সমান।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p>তিনটি আয়াত ধীরে ধীরে পড়ো, প্রতিটি শব্দের মানে মনে রেখে, অন্তর থেকে।</p>
</div>
`,

};
