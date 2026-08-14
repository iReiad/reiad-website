/* ============================================================
   content/dhap-2.js: the text of ধাপ ২, শব্দ থেকে বাক্য.

   Keys match the lesson slugs in ../curriculum.js. Same house
   style as dhap-1.js; see that file's header for the rules, and
   note the two that matter most here: every piece of Arabic
   carries lang="ar" dir="rtl", and nothing on any page asks the
   learner to write.

   What shapes this ধাপ: it is the one that turns a pile of
   recognised words into a language. Two things carry it, and
   they are the same two the last segment depends on: the ছাঁচ
   (segment ক) tells you how a word sounds, and the শেষের চিহ্ন
   (segment ঘ) tells you what it is doing. Learn those two and
   you can read Arabic with no vowel marks at all, which is what
   the final three days are for and why they are the reward
   rather than the hurdle.
   ============================================================ */

export default {

/* ------------------------------------------------------------
   মূল ও ছাঁচ
   ------------------------------------------------------------ */

muul: `
<p>প্রথম ধাপে তুমি শব্দ চিনেছ, একটা একটা করে। এই ধাপে শিখবে সেই শব্দগুলো কোথা থেকে
আসে, আর এটা জানলে অচেনা শব্দও আন্দাজ করতে পারবে।</p>

<h2>বিষয়টা কী</h2>

<p>বেশির ভাগ আরবি শব্দ তিনটি অক্ষরের একটা 'মূল' থেকে আসে। এক মূল থেকে জন্মায় অনেক
শব্দ, আর সবার মানে কাছাকাছি।</p>

<p>মূল <span lang="ar" dir="rtl">ك · ت · ب</span> মানে 'লেখা'র ভাব। দেখো এই তিনটে
অক্ষর প্রতিটা শব্দের ভেতরে বসে আছে।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">كَتَبَ</b><span>সে লিখল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">كِتَاب</b><span>বই, কিতাব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">كَاتِب</b><span>লেখক</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">مَكْتُوب</b><span>লিখিত</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">مَكْتَب</b><span>দপ্তর, ডেস্ক</span></p>
</div>

<p>পাঁচটা আলাদা শব্দ, একটাই পরিবার। এভাবেই আরবি চলে: মূল চিনলে শব্দের 'পরিবার' চেনা
যায়, আর নতুন শব্দ দেখলেও আন্দাজ করা যায় সে কোন ঘরের।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>মূল <span lang="ar" dir="rtl">ع-ل-م</span> ('জানা') থেকে দেখো কত শব্দ:
  <span lang="ar" dir="rtl">عَلِمَ</span> (জানল),
  <span lang="ar" dir="rtl">عِلْم</span> (জ্ঞান),
  <span lang="ar" dir="rtl">عَالِم</span> (জ্ঞানী), আর
  <span lang="ar" dir="rtl">عَلِيم</span> (সর্বজ্ঞ, আল্লাহর নাম)। একটা মূল চিনলে
  একগুচ্ছ শব্দ খুলে যায়।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">كَتَبَ</span> ·
  <span lang="ar" dir="rtl">كَاتِب</span> ·
  <span lang="ar" dir="rtl">مَكْتُوب</span>। একই মূল, তিন চেহারা।</p>
</div>
`,

chanch: `
<p>মূল জানা হলো। এবার প্রশ্ন: একই তিন অক্ষর থেকে এত আলাদা শব্দ আসে কীভাবে?</p>

<p>উত্তর: ছাঁচ।</p>

<h2>বিষয়টা কী</h2>

<p>শব্দের 'আকার' মাপতে আরবি ব্যবহার করে তিনটে অক্ষর:
<span lang="ar" dir="rtl">ف · ع · ل</span> (মানে 'করা')। মূলকে এই ছাঁচে ঢাললে শব্দ
তৈরি হয়।</p>

<div class="table-scroll">
<table>
  <thead><tr><th>ছাঁচ (<span lang="ar" dir="rtl">وَزْن</span>)</th>
      <th><span lang="ar" dir="rtl">ن-ص-ر</span> থেকে</th>
      <th><span lang="ar" dir="rtl">ك-ت-ب</span> থেকে</th></tr></thead>
  <tbody>
    <tr><td lang="ar" dir="rtl">فَعَلَ</td><td lang="ar" dir="rtl">نَصَرَ</td>
        <td lang="ar" dir="rtl">كَتَبَ</td></tr>
    <tr><td lang="ar" dir="rtl">فَاعِل</td><td lang="ar" dir="rtl">نَاصِر</td>
        <td lang="ar" dir="rtl">كَاتِب</td></tr>
    <tr><td lang="ar" dir="rtl">مَفْعُول</td><td lang="ar" dir="rtl">مَنْصُور</td>
        <td lang="ar" dir="rtl">مَكْتُوب</td></tr>
  </tbody>
</table>
</div>

<p>খেয়াল করো, প্রতিটা সারিতে আওয়াজের নকশা এক। শুধু ভেতরের তিন অক্ষর বদলেছে।</p>

<h2>এটাই হারাকাত ছাড়া পড়ার প্রথম চাবি</h2>

<p>ছাঁচ চিনলে যের-যবর না থাকলেও তুমি বুঝবে কোন শব্দ আর কীভাবে পড়তে হবে, কারণ ছাঁচই
বলে দেয় আওয়াজটা। <a href="/quran/dhap-2/keno-chinho-chara.html">এই ধাপের শেষ তিন
দিনে</a> এর পুরো মজাটা পাবে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">نَصَرَ · نَاصِر · مَنْصُور</span>, তারপর
  <span lang="ar" dir="rtl">كَتَبَ · كَاتِب · مَكْتُوب</span>। একই সুর, দুই মূল।</p>
</div>
`,

"dorkari-chanch": `
<p>ছাঁচ অনেক আছে, কিন্তু কুরআন পড়তে ছয়টাই বেশির ভাগ কাজ চালিয়ে দেবে।</p>

<h2>ছয়টা ছাঁচ</h2>

<div class="table-scroll">
<table>
  <thead><tr><th>ছাঁচ</th><th>মানে</th><th>উদাহরণ</th></tr></thead>
  <tbody>
    <tr><td lang="ar" dir="rtl">فَعَلَ</td><td>সে করল (অতীত)</td>
        <td lang="ar" dir="rtl">نَصَرَ · خَلَقَ</td></tr>
    <tr><td lang="ar" dir="rtl">يَفْعُلُ</td><td>সে করে (বর্তমান)</td>
        <td lang="ar" dir="rtl">يَنْصُرُ · يَعْلَمُ</td></tr>
    <tr><td lang="ar" dir="rtl">فَاعِل</td><td>যে করে (কর্তা)</td>
        <td lang="ar" dir="rtl">نَاصِر · عَالِم · خَالِق</td></tr>
    <tr><td lang="ar" dir="rtl">مَفْعُول</td><td>যাকে করা হয়</td>
        <td lang="ar" dir="rtl">مَنْصُور · مَعْلُوم</td></tr>
    <tr><td lang="ar" dir="rtl">فَعِيل</td><td>গুণবাচক</td>
        <td lang="ar" dir="rtl">رَحِيم · عَلِيم · سَمِيع</td></tr>
    <tr><td lang="ar" dir="rtl">مَفْعَل</td><td>জায়গা</td>
        <td lang="ar" dir="rtl">مَسْجِد · مَكْتَب</td></tr>
  </tbody>
</table>
</div>

<h2>চেনা নামেই লুকানো ছাঁচ</h2>

<p>আল্লাহর যে নামগুলো তুমি <a href="/quran/dhap-1/beshi-asha-shobdo.html">প্রথম ধাপে</a>
চিনেছ, সেগুলোও আসলে এই ছাঁচেই তৈরি। মানে তুমি অজান্তেই ছাঁচ চিনে ফেলেছ।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">الرَّحِيم</b><span>ছাঁচ <span lang="ar" dir="rtl">فَعِيل</span></span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْعَلِيم</b><span>ছাঁচ <span lang="ar" dir="rtl">فَعِيل</span></span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">السَّمِيع</b><span>ছাঁচ <span lang="ar" dir="rtl">فَعِيل</span></span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْبَصِير</b><span>ছাঁচ <span lang="ar" dir="rtl">فَعِيل</span></span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْغَفُور</b><span>ছাঁচ <span lang="ar" dir="rtl">فَعُول</span></span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْخَالِق</b><span>ছাঁচ <span lang="ar" dir="rtl">فَاعِل</span></span></p>
</div>

<p>একটা ছাঁচ (<span lang="ar" dir="rtl">فَعِيل</span>) চিনলেই একসাথে অনেকগুলো নাম
চেনা হয়ে যায়।</p>

<h2>নিজে চিনে নাও</h2>

<p>প্রতিটি শব্দের ভেতরের তিন অক্ষরের মূল বের করো। আগে নিজে ভাবো, তারপর মিলিয়ে নাও।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">عَالِم</b><span>মূল <span lang="ar" dir="rtl">ع · ل · م</span></span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">مَكْتُوب</b><span>মূল <span lang="ar" dir="rtl">ك · ت · ب</span></span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَاصِر</b><span>মূল <span lang="ar" dir="rtl">ن · ص · ر</span></span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">خَالِق</b><span>মূল <span lang="ar" dir="rtl">خ · ل · ق</span></span></p>
</div>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>আল্লাহর অনেক নামই এক ছাঁচ <span lang="ar" dir="rtl">فَعِيل</span>-এ তৈরি:
  <span lang="ar" dir="rtl">رَحِيم</span> · <span lang="ar" dir="rtl">عَلِيم</span> ·
  <span lang="ar" dir="rtl">سَمِيع</span> · <span lang="ar" dir="rtl">بَصِير</span>।
  একটা ছাঁচ চিনলেই একসাথে অনেক নাম চেনা হয়ে যায়।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">رَحِيم · عَلِيم · سَمِيع · بَصِير</span>। এক ছাঁচ, চার নাম।</p>
</div>
`,

/* ------------------------------------------------------------
   কাজ-শব্দ
   ------------------------------------------------------------ */

"tin-kal": `
<p>ভাষার প্রাণ হলো ক্রিয়া: সে করল, সে করে, করো। আর আরবিতে এই তিনটেই আসে একটাই মূল
থেকে, শুধু ছাঁচ বদলে।</p>

<h2>বিষয়টা কী</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">نَصَرَ</b><span>অতীত (<span lang="ar" dir="rtl">مَاضِي</span>): সে সাহায্য করল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يَنْصُرُ</b><span>বর্তমান (<span lang="ar" dir="rtl">مُضَارِع</span>): সে সাহায্য করে, করবে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اُنْصُرْ</b><span>আদেশ (<span lang="ar" dir="rtl">أَمْر</span>): সাহায্য করো!</span></p>
</div>

<p>মূল একটাই, <span lang="ar" dir="rtl">ن · ص · ر</span>। শুধু ছাঁচ বদলে কাল বদলে
যাচ্ছে, আর এই তিনটে চেহারা তুমি বাকি ষাট দিন বারবার দেখবে।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">نَصَرَ</span> ·
  <span lang="ar" dir="rtl">يَنْصُرُ</span> ·
  <span lang="ar" dir="rtl">اُنْصُرْ</span>। তিন কাল, তিনবার বলো।</p>
</div>
`,

otit: `
<p>আজ চেনা সর্বনামগুলো ফিরে আসছে, কিন্তু এবার আলাদা শব্দ হয়ে নয়। এবার ক্রিয়ার শেষে
ছোট্ট চিহ্ন হয়ে জুড়ে বসেছে।</p>

<h2>কে করল</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">هُوَ نَصَرَ</b><span>সে (ছেলে) সাহায্য করল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">هِيَ نَصَرَتْ</b><span>সে (মেয়ে) সাহায্য করল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْتَ نَصَرْتَ</b><span>তুমি (ছেলে) করলে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْتِ نَصَرْتِ</b><span>তুমি (মেয়ে) করলে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنَا نَصَرْتُ</b><span>আমি করলাম</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَحْنُ نَصَرْنَا</b><span>আমরা করলাম</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">هُمْ نَصَرُوا</b><span>তারা করল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْتُمْ نَصَرْتُمْ</b><span>তোমরা করলে</span></p>
</div>

<p>শব্দের গোড়াটা এক থাকছে, বদলাচ্ছে শুধু লেজ। ওই লেজটাই বলে দিচ্ছে কে করল।</p>

<h2>কুরআনে দেখো</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">خَلَقَ</b><span>সৃষ্টি করলেন</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">قَالَ</b><span>বললেন</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْزَلَ</b><span>নাযিল করলেন</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">جَعَلَ</b><span>বানালেন</span></p>
</div>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p><span lang="ar" dir="rtl">قَالَ</span> কুরআনের সবচেয়ে বেশি আসা ক্রিয়াগুলোর
  একটা, আর কারণটা সুন্দর: কুরআন বারবার কারো না কারো কথা তুলে ধরে। নবীদের কথা,
  ফেরেশতাদের কথা, অস্বীকারকারীদের কথা। তাই 'বললেন' শব্দটা এত ফেরে।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">خَلَقَ</span> · <span lang="ar" dir="rtl">قَالَ</span>
  · <span lang="ar" dir="rtl">أَنْزَلَ</span>। তিনবার জোরে পড়ো।</p>
</div>
`,

bortoman: `
<p>অতীতে চিহ্নটা বসত ক্রিয়ার শেষে। বর্তমানে সেটা চলে আসে সামনে, আর অক্ষর মাত্র চারটা।</p>

<h2>চার অক্ষর, আর কিছু নয়</h2>

<div class="shobdo-gitter">
  <span><b lang="ar" dir="rtl">أ</b> আমি</span>
  <span><b lang="ar" dir="rtl">ن</b> আমরা</span>
  <span><b lang="ar" dir="rtl">ي</b> সে (ছেলে), তারা</span>
  <span><b lang="ar" dir="rtl">ت</b> সে (মেয়ে), তুমি, তোমরা</span>
</div>

<p>সামনে এই চারটার একটা দেখলেই বুঝবে: এটা বর্তমান কালের ক্রিয়া।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">يَنْصُرُ</b><span>সে (ছেলে) করে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">تَنْصُرُ</b><span>সে (মেয়ে) করে, বা তুমি করো</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْصُرُ</b><span>আমি করি</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَنْصُرُ</b><span>আমরা করি</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يَنْصُرُونَ</b><span>তারা করে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">تَنْصُرُونَ</b><span>তোমরা করো</span></p>
</div>

<h2>কুরআনে দেখো</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">يَعْلَمُ</b><span>তিনি জানেন</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَعْبُدُ</b><span>আমরা ইবাদত করি</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يُؤْمِنُونَ</b><span>তারা বিশ্বাস করে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">تَعْلَمُونَ</b><span>তোমরা জানো</span></p>
</div>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>সূরা ফাতিহার <span lang="ar" dir="rtl">إِيَّاكَ نَعْبُدُ</span>, আর এখানে
  <span lang="ar" dir="rtl">نَعْبُدُ</span> মানে 'আমরা ইবাদত করি'। সামনে
  <span lang="ar" dir="rtl">ن</span>, তাই 'আমরা'। রোজ নামাজে তুমি এই এক অক্ষর দিয়েই
  নিজেকে সবার সাথে জুড়ে নাও, আর আজ থেকে সেটা টের পাবে।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">أَنْصُرُ</span> ·
  <span lang="ar" dir="rtl">نَنْصُرُ</span> ·
  <span lang="ar" dir="rtl">يَنْصُرُ</span> ·
  <span lang="ar" dir="rtl">تَنْصُرُ</span>। সামনের অক্ষরটা খেয়াল করো।</p>
</div>
`,

adesh: `
<p>কাউকে কিছু করতে বললে ব্যবহার হয় আদেশ-ক্রিয়া। ছোট, আর জোরালো।</p>

<h2>বিষয়টা কী</h2>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">اُنْصُرْ</b><span>সাহায্য করো</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اُكْتُبْ</b><span>লেখো</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اِقْرَأْ</b><span>পড়ো</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">قُلْ</b><span>বলো</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اُذْكُرْ</b><span>স্মরণ করো</span></p>
</div>

<p><span lang="ar" dir="rtl">قُلْ</span> তো তুমি
<a href="/quran/dhap-1/shob-ekshathe.html">আগেই চিনেছ</a>, সূরা ইখলাসের প্রথম শব্দ।
এতদিন জানতে না যে ওটা একটা আদেশ-ক্রিয়া, আজ জানলে।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>একটা তথ্য গায়ে কাঁটা দেয়: <span lang="ar" dir="rtl">اِقْرَأْ</span> ('পড়ো')
  কুরআনের সবচেয়ে প্রথম নাযিল হওয়া শব্দ (সূরা আলাক)। পুরো কুরআনের শুরু একটা আদেশ
  দিয়ে, আর সেই আদেশটা হলো: পড়ো।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">اِقْرَأْ</span> · <span lang="ar" dir="rtl">قُلْ</span>
  · <span lang="ar" dir="rtl">اُذْكُرْ</span></p>
</div>
`,

"na-bodhok": `
<p>ছোট একটা শব্দ ক্রিয়ার সামনে বসিয়ে তাকে 'না' করে দেওয়া হয়। কোনটা কোথায় বসে,
সেটাই আজকের কাজ।</p>

<h2>চারটে ছোট শব্দ</h2>

<div class="table-scroll">
<table>
  <thead><tr><th>শব্দ</th><th>মানে</th><th>উদাহরণ</th></tr></thead>
  <tbody>
    <tr><td lang="ar" dir="rtl">لَا</td><td>করে না (বর্তমান)</td>
        <td lang="ar" dir="rtl">لَا يَعْلَمُ</td></tr>
    <tr><td lang="ar" dir="rtl">لَنْ</td><td>কখনো করবে না</td>
        <td lang="ar" dir="rtl">لَنْ نُؤْمِنَ</td></tr>
    <tr><td lang="ar" dir="rtl">مَا</td><td>করেনি (অতীত)</td>
        <td lang="ar" dir="rtl">مَا قَالَ</td></tr>
    <tr><td lang="ar" dir="rtl">لَمْ</td><td>করেনি (অতীত)</td>
        <td lang="ar" dir="rtl">لَمْ يَلِدْ</td></tr>
  </tbody>
</table>
</div>

<p>শেষেরটা খেয়াল করো: <span lang="ar" dir="rtl">لَمْ</span> বসে বর্তমান-চেহারার
ক্রিয়ার সামনে, কিন্তু মানে হয়ে যায় অতীত। অদ্ভুত লাগে প্রথমে, তারপর কানে বসে যায়।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>চেনা লাগছে? <span lang="ar" dir="rtl">لَمْ يَلِدْ وَلَمْ يُولَدْ</span>, সূরা
  ইখলাসের লাইন, মানে 'তিনি জন্ম দেননি, জন্মও নেননি'। এক আয়াতে
  <span lang="ar" dir="rtl">لَمْ</span> দুবার।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">لَا يَعْلَمُ</span> ·
  <span lang="ar" dir="rtl">مَا قَالَ</span> ·
  <span lang="ar" dir="rtl">لَمْ يَلِدْ</span></p>
</div>
`,

"korta-vitore": `
<p>আরবির একটা সুন্দর মিতব্যয়িতা আছে, আর এটা বুঝলে অনেক আয়াত হঠাৎ পরিষ্কার হয়ে যায়।</p>

<h2>বিষয়টা কী</h2>

<p>'কে করছে' সেটা প্রায়ই ক্রিয়ার ভেতরেই বলা থাকে। আলাদা সর্বনাম না লাগলেও চলে।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">نَصَرَ</b><span>সে সাহায্য করল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَصَرْتُ</b><span>আমি সাহায্য করলাম</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَصَرْنَا</b><span>আমরা সাহায্য করলাম</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يَنْصُرُونَ</b><span>তারা সাহায্য করে</span></p>
</div>

<p>শেষের ছোট্ট চিহ্নই বলে দিচ্ছে কে: <span lang="ar" dir="rtl">ـتُ</span> মানে 'আমি',
<span lang="ar" dir="rtl">ـنَا</span> মানে 'আমরা'। তাই একটা শব্দই একটা গোটা বাক্য।</p>

<h2>নিজে চিনে নাও</h2>

<p>সামনে <span lang="ar" dir="rtl">أ · ن · ي · ت</span> আছে কি? তাহলে বর্তমান। নাহলে
দেখো লেজে কী বসেছে।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">خَلَقَ</b><span>অতীত</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يَعْلَمُ</b><span>বর্তমান</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اُكْتُبْ</b><span>আদেশ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">نَعْبُدُ</b><span>বর্তমান</span></p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">نَصَرَ</span> ·
  <span lang="ar" dir="rtl">يَنْصُرُ</span> ·
  <span lang="ar" dir="rtl">اُنْصُرْ</span>। তিনবার, আর প্রতিবার ভাবো কে করছে।</p>
</div>
`,

/* ------------------------------------------------------------
   বাক্য গড়া
   ------------------------------------------------------------ */

"dui-rokom-bakko": `
<p>শব্দ জোড়া লেগে বাক্য হয়। আর আরবিতে বাক্য মাত্র দুই রকম, তাই এই দিনটা ছোট।</p>

<h2>বিষয়টা কী</h2>

<div class="split">
  <div class="do">
    <h5>নাম-বাক্য</h5>
    <p class="ayah-mane" style="text-align:start">নাম দিয়ে শুরু।</p>
    <div class="shobdo-list">
      <p class="shobdo"><b lang="ar" dir="rtl">اللهُ نُورٌ</b><span>আল্লাহ আলো</span></p>
      <p class="shobdo"><b lang="ar" dir="rtl">هُوَ الْعَلِيمُ</b><span>তিনি সর্বজ্ঞ</span></p>
    </div>
  </div>
  <div class="others">
    <h5>কাজ-বাক্য</h5>
    <p class="ayah-mane" style="text-align:start">কাজ দিয়ে শুরু।</p>
    <div class="shobdo-list">
      <p class="shobdo"><b lang="ar" dir="rtl">خَلَقَ اللهُ</b><span>সৃষ্টি করলেন আল্লাহ</span></p>
      <p class="shobdo"><b lang="ar" dir="rtl">قَالَ رَبُّكَ</b><span>বললেন তোমার রব</span></p>
    </div>
  </div>
</div>

<p>কোন শব্দ দিয়ে বাক্য শুরু হলো, সেটাই ঠিক করে বাক্যটা কোন রকম। এর বেশি কিছু নয়।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">اللهُ نُورٌ</span> ·
  <span lang="ar" dir="rtl">خَلَقَ اللهُ</span>। একটা নাম-বাক্য, একটা কাজ-বাক্য।</p>
</div>
`,

"nam-bakko": `
<p>আরবির সবচেয়ে সহজ নিয়মটা আজকের, আর এটা বাংলার সাথে মিলেও যায়।</p>

<h2>'হয়' বলার দরকার নেই</h2>

<p>বর্তমান কালে 'হয়' বা 'আছে' বলতে হয় না। দুটো শব্দ পাশাপাশি বসলেই বাক্য দাঁড়িয়ে যায়।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">اللهُ غَفُورٌ</b><span>আল্লাহ ক্ষমাশীল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">هُوَ الْعَلِيمُ</b><span>তিনি সর্বজ্ঞ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَبُّكَ رَحِيمٌ</b><span>তোমার রব দয়ালু</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْكِتَابُ نُورٌ</b><span>কিতাব আলো</span></p>
</div>

<p>বাংলাও ঠিক এটাই করে: 'আল্লাহ ক্ষমাশীল'। মাঝখানে কিছু বসাতে হয় না। ইংরেজি এখানে
জোর করে <i>is</i> বসাতে বলত, আরবি আর বাংলা দুটোই সেটা চায় না।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>আল্লাহর নাম প্রায়ই জোড়ায় এসে নাম-বাক্য গড়ে:
  <span lang="ar" dir="rtl">غَفُورٌ رَحِيمٌ</span> (ক্ষমাশীল, দয়ালু),
  <span lang="ar" dir="rtl">عَلِيمٌ حَكِيمٌ</span> (সর্বজ্ঞ, প্রজ্ঞাময়)। দুটো নাম,
  একটা গোটা বাক্য, আর কোনো ক্রিয়া নেই।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">اللهُ غَفُورٌ رَحِيمٌ</span>। তিনবার, ধীরে।</p>
</div>
`,

"kaj-bakko": `
<p>কাজ-বাক্যে শব্দের সাজানোটা বাংলার উল্টো, আর এটাই অভ্যাস করার জিনিস।</p>

<h2>ক্রিয়া, কর্তা, কর্ম</h2>

<div class="ayah" lang="ar" dir="rtl">خَلَقَ اللهُ السَّمَاوَاتِ</div>
<p class="ayah-mane">আল্লাহ আকাশমণ্ডলী সৃষ্টি করলেন।</p>

<div class="tafsil">
  <span><b lang="ar" dir="rtl">خَلَقَ</b><i>ক্রিয়া: সৃষ্টি করলেন</i></span>
  <span><b lang="ar" dir="rtl">اللهُ</b><i>কর্তা: কে? আল্লাহ</i></span>
  <span><b lang="ar" dir="rtl">السَّمَاوَاتِ</b><i>কর্ম: কী? আকাশমণ্ডলী</i></span>
</div>

<p>বাংলায় কর্তা আগে আসে, আরবিতে প্রায়ই ক্রিয়া আগে। এই সাজানোয় অভ্যস্ত হওয়াই
সাবলীল হওয়ার চাবি, আর অভ্যাস হতে কয়েক দিনই লাগে।</p>

<h2>নিজে চিনে নাও</h2>

<p>নাম দিয়ে শুরু হলে নাম-বাক্য, কাজ দিয়ে শুরু হলে কাজ-বাক্য। বলো তো।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">خَلَقَ اللهُ</b><span>কাজ-বাক্য</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">اللهُ نُورٌ</b><span>নাম-বাক্য</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">قَالَ رَبُّكَ</b><span>কাজ-বাক্য</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">هُوَ الْعَلِيمُ</b><span>নাম-বাক্য</span></p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">خَلَقَ اللهُ السَّمَاوَاتِ</span>। বলার সময় মনে মনে
  তিন ভাগে ভাগ করো: ক্রিয়া, কর্তা, কর্ম।</p>
</div>
`,

idafa: `
<p>দুটো নাম-শব্দ পাশাপাশি বসিয়ে বোঝানো হয় 'X-এর Y'। এটাকে বলে ইদাফা, আর কুরআনে এটা
সবখানে।</p>

<h2>বিষয়টা কী</h2>

<p>নিয়ম একটাই: দ্বিতীয় শব্দটা যের (<span lang="ar" dir="rtl">ِ</span>) নেয়।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">كِتَابُ اللهِ</b><span>আল্লাহর কিতাব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَسُولُ اللهِ</b><span>আল্লাহর রাসূল</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَبُّ الْعَالَمِينَ</b><span>জগতের রব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يَوْمُ الدِّينِ</b><span>বিচারের দিন</span></p>
</div>

<h2>কুরআনে দেখো: কর্তা ও কর্ম</h2>

<p>গতকালের কাজ-বাক্যও সাথে মিলিয়ে নাও। প্রতিটিতে খুঁজে দেখো কোনটা ক্রিয়া, কে কর্তা,
আর কী কর্ম।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">قَالَ رَبُّكَ</b><span>বললেন তোমার রব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">أَنْزَلَ اللهُ الْكِتَابَ</b><span>আল্লাহ কিতাব নাযিল করলেন</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">يُحِبُّ اللهُ الْمُحْسِنِينَ</b><span>আল্লাহ সৎকর্মশীলদের ভালোবাসেন</span></p>
</div>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>সূরা ফাতিহার <span lang="ar" dir="rtl">رَبِّ الْعَالَمِينَ</span> নিজেই একটা
  ইদাফা: 'জগতের রব'। তুমি এটা ধাপ ১-এই পড়েছ, আর আজ জানলে কেন শব্দ দুটো এভাবে জোড়া
  আর কেন দ্বিতীয়টার শেষে যের।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">كِتَابُ اللهِ</span> ·
  <span lang="ar" dir="rtl">رَبُّ الْعَالَمِينَ</span> ·
  <span lang="ar" dir="rtl">يَوْمُ الدِّينِ</span></p>
</div>
`,

bisheshon: `
<p>আজ দুটো জিনিস, আর দুটোই শব্দের চেহারা দেখে চেনার।</p>

<h2>এক: গুণ-শব্দ</h2>

<p>বিশেষণ নাম-শব্দের <b>পরে</b> বসে, আর তার সাথে মিল রেখে চলে। বাংলায় যেমন আগে বসে
('সরল পথ'), আরবিতে পরে।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">الصِّرَاطَ الْمُسْتَقِيمَ</b><span>সরল পথ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْكِتَابُ الْكَرِيمُ</b><span>সম্মানিত কিতাব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَبٌّ غَفُورٌ</b><span>ক্ষমাশীল রব</span></p>
</div>

<p>খেয়াল করো, প্রথম দুটোয় <span lang="ar" dir="rtl">الـ</span> দুবার, আর তৃতীয়টায়
তানভীন দুবার। বিশেষণ তার নাম-শব্দের সাজ নকল করে, আর
<a href="/quran/dhap-1/purush-stri.html">লিঙ্গও</a> মিলিয়ে নেয়।</p>

<h2>দুই: এক, দুই, অনেক</h2>

<p>শব্দের শেষের চেহারা বলে দেয় একটা, দুটো, না অনেক।</p>

<div class="table-scroll">
<table>
  <thead><tr><th>সংখ্যা</th><th>শেষের চেহারা</th><th>উদাহরণ</th></tr></thead>
  <tbody>
    <tr><td>এক</td><td>কিছু নেই</td><td lang="ar" dir="rtl">مُؤْمِن</td></tr>
    <tr><td>দুই</td><td lang="ar" dir="rtl">ـَانِ · ـَيْنِ</td>
        <td lang="ar" dir="rtl">مُؤْمِنَانِ</td></tr>
    <tr><td>অনেক (পুরুষ)</td><td lang="ar" dir="rtl">ـُونَ · ـِينَ</td>
        <td lang="ar" dir="rtl">الْمُؤْمِنُونَ</td></tr>
    <tr><td>অনেক (স্ত্রী)</td><td lang="ar" dir="rtl">ـَاتٌ</td>
        <td lang="ar" dir="rtl">الْمُؤْمِنَاتُ</td></tr>
  </tbody>
</table>
</div>

<p><span lang="ar" dir="rtl">الْعَالَمِينَ</span> ·
<span lang="ar" dir="rtl">الْمُسْلِمِينَ</span>: এই
<span lang="ar" dir="rtl">ـِينَ</span> শেষ মানেই 'অনেক'। ফাতিহার প্রথম আয়াতেই তুমি
এটা রোজ পড়ো।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>সূরা ফাতিহার <span lang="ar" dir="rtl">الصِّرَاطَ الْمُسْتَقِيمَ</span>, 'সরল
  পথ'। পথ (নাম) আগে, সরল (গুণ) পরে, আর দুটোতেই
  <span lang="ar" dir="rtl">الـ</span>, দুটোতেই যবর। মিলটা চোখে পড়লে আর ভুলবে না।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">الصِّرَاطَ الْمُسْتَقِيمَ</span> ·
  <span lang="ar" dir="rtl">رَبِّ الْعَالَمِينَ</span></p>
</div>
`,

/* ------------------------------------------------------------
   শব্দের শেষের চিহ্ন
   ------------------------------------------------------------ */

"tin-tupi": `
<p>এই সেগমেন্টটা ছোট, মাত্র তিন দিন, কিন্তু এখান থেকেই এই ধাপের সবচেয়ে বড় পুরস্কার
আসবে।</p>

<h2>তিনটি টুপি</h2>

<p>শব্দের শেষে তিন রকম ছোট্ট চিহ্ন বসতে পারে, আর প্রতিটি বলে দেয় শব্দটার 'কাজ' কী।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">ـُ</b><span>পেশ · কর্তা, যে করে</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">ـَ</b><span>যবর · কর্ম, যাকে করা হয়</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">ـِ</b><span>যের · ছোট-শব্দের পরে, বা ইদাফায়</span></p>
</div>

<h2>একই শব্দ, তিন টুপি</h2>

<p>একটা শব্দ <span lang="ar" dir="rtl">الْكِتَاب</span>। বাক্যে কী কাজ করছে, তার উপর
শেষের চিহ্ন বদলায়।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">هَٰذَا الْكِتَابُ</b><span>এই কিতাব · কর্তা, তাই পেশ</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">قَرَأْتُ الْكِتَابَ</b><span>কিতাব পড়লাম · কর্ম, তাই যবর</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">فِي الْكِتَابِ</b><span>কিতাবে · ছোট-শব্দের পরে, তাই যের</span></p>
</div>

<p>শেষের চিহ্ন হলো শব্দের পরিচয়পত্র। এটা পড়তে শিখলে বাক্য নিজে থেকেই খুলে যায়।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>একটা সুন্দর ইতিহাস: কুরআনের সঠিক পড়া রক্ষা করতেই আরবি ব্যাকরণ আর শব্দের শেষের
  চিহ্নের নিয়ম প্রথম গোছানো শুরু হয়েছিল। মানে ধরার এই চিহ্নগুলো কুরআনেরই দান।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">الْكِتَابُ · الْكِتَابَ · الْكِتَابِ</span>। এক শব্দ,
  তিন কাজ।</p>
</div>
`,

tanvin: `
<p>শেষের চিহ্ন যদি দুবার লেখা হয়, আওয়াজে একটা <span lang="ar" dir="rtl">ن</span>
এসে যায়। এটাকে বলে তানভীন।</p>

<h2>বিষয়টা কী</h2>

<p><span lang="ar" dir="rtl">ـٌ ـً ـٍ</span> পড়া হয় 'উন, আন, ইন', আর মানে দাঁড়ায়
'একটা', মানে অনির্দিষ্ট।</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">كِتَابٌ</b><span>একটা কিতাব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">الْكِتَابُ</b><span>সেই কিতাব</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">رَحْمَةً</b><span>একটা দয়া</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">هُدًى</b><span>একটা পথনির্দেশ</span></p>
</div>

<h2>চেনার সাথে জোড়া</h2>

<p>এখানে <a href="/quran/dhap-1/al.html">প্রথম ধাপের 'আল'</a> ফিরে আসছে, আর দুটো
মিলে একটা পরিষ্কার জোড়া তৈরি করছে:</p>

<div class="shobdo-list">
  <p class="shobdo"><b lang="ar" dir="rtl">الـ</b><span>থাকলে 'সেই', নির্দিষ্ট</span></p>
  <p class="shobdo"><b lang="ar" dir="rtl">ـٌ ـً ـٍ</b><span>থাকলে 'একটা', অনির্দিষ্ট</span></p>
</div>

<p>আর দুটো কখনো একসাথে থাকে না। একটা শব্দে হয় <span lang="ar" dir="rtl">الـ</span>
থাকবে, নয় তানভীন। এই এক নিয়ম অনেক বিভ্রান্তি কমিয়ে দেয়।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">كِتَابٌ</span> আর
  <span lang="ar" dir="rtl">الْكِتَابُ</span>। পাশাপাশি বলো, তফাতটা কানে ধরো।</p>
</div>
`,

"chinho-mane": `
<p>ছোট একটা দিন, কিন্তু এখানেই এই ধাপের আসল খবরটা আছে।</p>

<h2>বিষয়টা কী</h2>

<p>যেহেতু শব্দের শেষের চিহ্নই তার কাজ বলে দেয়, তাই আরবিতে শব্দের সাজানো একটু
বদলালেও মানে ঠিক থাকে। বাংলায় 'রহিম করিমকে দেখল' আর 'করিমকে রহিম দেখল' দুটোই বোঝা
যায়, কারণ '-কে' লেগে আছে। আরবিতে ওই '-কে'-র কাজটা করে শেষের যবর।</p>

<h2>আর এটাই বড় খবর</h2>

<p>চিহ্ন কী বলে সেটা জানলে, যের-যবর ছাপা না থাকলেও তুমি ঠিক ধরতে পারবে কে কর্তা আর
কে কর্ম। কারণ তুমি ছাঁচ থেকে আওয়াজ আন্দাজ করতে পারো, আর বাক্যে কাজ থেকে চিহ্ন
আন্দাজ করতে পারো।</p>

<p>সেগমেন্ট ক (ছাঁচ) আর সেগমেন্ট ঘ (চিহ্ন), এই দুটো মিলেই হারাকাত ছাড়া পড়া সম্ভব
হয়। আর সেটাই <a href="/quran/dhap-2/keno-chinho-chara.html">পরের তিন দিন</a>।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">هَٰذَا الْكِتَابُ</span> ·
  <span lang="ar" dir="rtl">فِي الْكِتَابِ</span>। শেষের চিহ্নটা কেন বদলাল, নিজেকে বলো।</p>
</div>
`,

/* ------------------------------------------------------------
   হারাকাত ছাড়া পড়া
   ------------------------------------------------------------ */

"keno-chinho-chara": `
<p>এই ধাপের সবচেয়ে বড় পুরস্কার শুরু হচ্ছে।</p>

<h2>কেন চিহ্ন ছাড়া</h2>

<p>বেশির ভাগ ছাপা আরবি, বই, খবরের কাগজ, সাইনবোর্ড, কোনো যের-যবর ছাড়াই লেখা হয়।
অভ্যস্ত পাঠক নিজে থেকেই আওয়াজ বসিয়ে পড়ে নেন।</p>

<p>ভয় নেই। তুমি শব্দ চেনো, ছাঁচ চেনো, আর শেষের চিহ্নের কাজ জানো। এই তিনটা জানা
থাকলেই চিহ্ন ছাড়া পড়া যায়। শুরুতে ধীরে, তারপর আপনা-আপনি দ্রুত। এটা কোনো জাদু নয়,
শুধু চেনা জিনিস কাজে লাগানো।</p>

<h2>তিনটি সূত্র</h2>

<div class="shobdo-list">
  <p class="shobdo"><b>১ · শব্দ চেনা</b><span>শব্দটা আগে দেখেছ, তাই আওয়াজ জানো।</span></p>
  <p class="shobdo"><b>২ · ছাঁচ চেনা</b><span>ছাঁচ বলে দেয় কোন যের-যবর বসবে।</span></p>
  <p class="shobdo"><b>৩ · কাজ চেনা</b><span>বাক্যে কাজ বুঝলে শেষের চিহ্ন আন্দাজ হয়।</span></p>
</div>

<p>তিনটাই তুমি আগের সেগমেন্টগুলোতে শিখেছ। আজ শুধু একসাথে কাজে লাগানো।</p>

<div class="tothyo">
  <span class="tothyo-label">কুরআনি তথ্য</span>
  <p>জেনে রাখো: প্রথম যুগের উসমানি মুসহাফে কোনো যের-যবর বা নুকতা ছিল না, সাহাবিরা
  মুখস্থ থেকে পড়তেন। পরে সহজ করতে চিহ্ন যোগ করা হয়। অর্থাৎ 'চিহ্ন ছাড়া পড়া'
  কুরআনের আদি রূপ, আর তুমি সেই পথেই হাঁটছ।</p>
</div>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p>তিনটে সূত্র নিজের ভাষায় বলো: শব্দ চেনা, ছাঁচ চেনা, কাজ চেনা।</p>
</div>
`,

"ek-line-dui-vabe": `
<p>উপরে যের-যবর সহ, নিচে যের-যবর ছাড়া। একই লাইন। তুমি চেনো, তাই দুটোই পড়তে পারবে।</p>

<h2>একই লাইন, দুইভাবে</h2>

<div class="ayah" lang="ar" dir="rtl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ</div>
<p class="ayah-mane">চিহ্ন সহ</p>

<div class="ayah" lang="ar" dir="rtl">بسم الله الرحمن الرحيم</div>
<p class="ayah-mane">চিহ্ন ছাড়া, আর একই লাইন</p>

<p>পারলে তো? কারণ শব্দগুলো এখন তোমার চেনা। এটাই পুরো কৌশল।</p>

<h2>চেনা শব্দ, চিহ্ন ছাড়া</h2>

<p>নিচের শব্দগুলো চিহ্ন ছাড়া লেখা। তুমি এগুলো চেনো, তাই জোরে পড়ে দেখো।</p>

<div class="shobdo-gitter">
  <span><b lang="ar" dir="rtl">الله</b> আল্লাহ</span>
  <span><b lang="ar" dir="rtl">رب</b> রব</span>
  <span><b lang="ar" dir="rtl">كتاب</b> কিতাব</span>
  <span><b lang="ar" dir="rtl">رحيم</b> দয়ালু</span>
  <span><b lang="ar" dir="rtl">قل</b> বলো</span>
  <span><b lang="ar" dir="rtl">هو</b> তিনি</span>
  <span><b lang="ar" dir="rtl">نور</b> আলো</span>
  <span><b lang="ar" dir="rtl">يوم</b> দিন</span>
</div>

<p>চিহ্ন নেই, তবু চিনতে অসুবিধা হলো না। তাই না?</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p>উপরের আটটা শব্দ চিহ্ন ছাড়া পড়ো, একটার পর একটা, না থেমে।</p>
</div>
`,

"nije-poro": `
<p>শেষ দিন। আজ শুধু একটা কাজ, আর সেটা তুমিই করবে।</p>

<h2>নিজে পড়ে দেখো</h2>

<p>চিহ্ন ছাড়া একটা লাইন। আগে নিজে পড়ার চেষ্টা করো, তারপর নিচে মিলিয়ে নাও।</p>

<div class="ayah" lang="ar" dir="rtl">قل هو الله احد</div>

<p class="ayah-mane">এবার মিলিয়ে নাও:</p>

<div class="ayah" lang="ar" dir="rtl">قُلْ هُوَ اللهُ أَحَدٌ</div>
<p class="ayah-mane">বলো, তিনি আল্লাহ, এক।</p>

<p>তুমি সূরা ইখলাসের প্রথম লাইন চিহ্ন ছাড়া পড়ে ফেললে, যেটা
<a href="/quran/dhap-1/shob-ekshathe.html">প্রথম ধাপে</a> চিহ্ন সহ শিখেছিলে।</p>

<h2>বিশ দিনে যা হলো</h2>

<div class="shobdo-list">
  <p class="shobdo"><b>মূল ও ছাঁচ</b><span>নতুন শব্দ আন্দাজ করতে পারি</span></p>
  <p class="shobdo"><b>তিন কাল</b><span>অতীত, বর্তমান ও আদেশ চিনি</span></p>
  <p class="shobdo"><b>দুই রকম বাক্য</b><span>নাম-বাক্য ও কাজ-বাক্য আলাদা করি</span></p>
  <p class="shobdo"><b>ইদাফা</b><span>কার জিনিস, বুঝি</span></p>
  <p class="shobdo"><b>শেষের চিহ্ন</b><span>কে কর্তা, কে কর্ম, ধরতে পারি</span></p>
  <p class="shobdo"><b>হারাকাত ছাড়া</b><span>চেনা লাইন পড়তে পারি</span></p>
</div>

<p>মাত্র বিশ দিনে তুমি শব্দ থেকে বাক্যে পৌঁছে গেছ, আর চিহ্ন ছাড়াও পড়তে শুরু করেছ।
পরের ধাপে গোটা সূরা।</p>

<div class="mukhe">
  <span class="mukhe-label">মুখে বলো</span>
  <p><span lang="ar" dir="rtl">رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي</span>
  <br>হে আমার রব, আমার বুক প্রশস্ত করো, আর আমার কাজ সহজ করো।</p>
</div>
`,

};
