/* ============================================================
   content/term-1.js: the text of টার্ম ১, the thirteen parts of
   the beginner course.

   Keys match the part slugs in ../curriculum.js. The value is
   the body of the page: everything between the standfirst and
   the footer nav. build-english.mjs wraps it in the shared shell.

   HOUSE STYLE, and most of it is the course's own:

     · address the learner as তুমি. The rest of the site says
       আপনি; the deck says তুমি on every slide and this is a
       course about opening your mouth, not a prospectus
     · Bangla explains, English is what is being explained.
       Never the other way round
     · EVERY piece of English carries lang="en", so the
       stylesheet can give it the Latin face. The Bangla face has
       no Latin worth the name, and English set in it looks limp
       beside the Bangla explaining it
     · <div class="shape"> for the pattern of the part: the shape
       itself, why it works, examples, and the line worth
       remembering. Always first, before any explanation
     · <div class="line-list"> with <p class="line"> for an
       English sentence beside its meaning
     · <div class="word-grid"> for a list of words. It is never
       the point of a page: the course's second rule is that a
       bare word is not worth learning
     · <div class="mone"> for the one line to remember,
       <div class="mone warn"> for the mistake to avoid
     · <div class="bolo"> for the say-it-aloud drill, last on the
       page, always. Nothing here asks the learner to write in
       silence, because the course's first rule is that silent
       reading is worth nothing
   ============================================================ */

export default {

/* ------------------------------------------------------------
   ভিত্তি
   ------------------------------------------------------------ */

"word-order": `
<p>ইংরেজি শেখার সবচেয়ে বড় বাধা শব্দভাণ্ডার নয়। তুমি হয়তো পাঁচশো ইংরেজি শব্দ চেনো,
তবু মুখ দিয়ে বাক্য বের হয় না। কারণটা সহজ: শব্দগুলো কোন ক্রমে বসবে, সেটা জানা নেই।</p>

<p>বাক্য মানে শব্দের স্তূপ নয়। বাক্য হলো একটা কাঠামো, যার ভিতরে কয়েকটা ফাঁকা ঘর
থাকে। কাঠামোটা একবার শিখলে ওই ঘরে যা খুশি বসিয়ে হাজারটা নতুন বাক্য বানানো যায়।
এটাই আসল ফ্লুয়েন্সি: বড় স্মৃতি নয়, কয়েকটা শক্ত কাঠামো আর একটু সাহস।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">WHO + DOES + WHAT</p>
  <p class="shape-why">কে (I, you, she…) + কাজ + কী বা কাকে। কাজের শব্দটা দুই নম্বরে বসে,
  শেষে নয়।</p>
  <p class="shape-eg" lang="en">I eat rice. · She opens the door. · We drink tea.</p>
  <p class="shape-tip">এই একটা অভ্যাস বদলালে শুরুর অর্ধেক ভুল নিজে থেকেই শেষ হয়ে যায়।</p>
</div>

<h2>বাংলা শেষে রাখে, ইংরেজি মাঝখানে</h2>

<p>বাংলায় আমরা বলি: <b>আমি ভাত খাই।</b> ক্রিয়া বসে একদম শেষে। ইংরেজিতে ঠিক সেই কাজটা
হয় দুই নম্বরে:</p>

<div class="split">
  <div class="do">
    <h5>বাংলা</h5>
    <p>আমি → ভাত → <b>খাই</b></p>
    <p>কে → কী → কাজ (শেষে)</p>
  </div>
  <div class="others">
    <h5>ইংরেজি</h5>
    <p lang="en">I → <b>eat</b> → rice.</p>
    <p>কে → কাজ (মাঝখানে) → কী</p>
  </div>
</div>

<p>তাই ইংরেজি বলার সময় শব্দে শব্দে অনুবাদ কোরো না। আগে মনে মনে তিনটা প্রশ্ন করো:
কে? কী করছে? কী বা কাকে? উত্তর তিনটা সাজালেই বাক্য তৈরি।</p>

<h2>তিনটা ব্লক, সাতটা বাক্য</h2>

<div class="line-list">
  <p class="line"><b lang="en">She opens the door.</b><span>সে দরজা খোলে।</span></p>
  <p class="line"><b lang="en">We drink tea.</b><span>আমরা চা খাই।</span></p>
  <p class="line"><b lang="en">My brother drives a car.</b><span>আমার ভাই গাড়ি চালায়।</span></p>
  <p class="line"><b lang="en">The children love mangoes.</b><span>বাচ্চারা আম ভালোবাসে।</span></p>
  <p class="line"><b lang="en">I understand you.</b><span>আমি তোমাকে বুঝি।</span></p>
  <p class="line"><b lang="en">He wants a job.</b><span>সে একটা চাকরি চায়।</span></p>
  <p class="line"><b lang="en">You cook very well.</b><span>তুমি খুব ভালো রান্না করো।</span></p>
</div>

<p>বাংলা অংশটা হাত দিয়ে ঢেকে ইংরেজি লাইনগুলো ছয়বার জোরে পড়ো। তারপর ইংরেজিটা ঢেকে
বাংলা থেকে আবার বানাও। এই দুই দিকের যাতায়াতই আসল অনুশীলন।</p>

<h2>শুরুতে যারা বসতে পারে: সাতজন</h2>

<div class="word-grid">
  <span><b lang="en">I</b> আমি</span>
  <span><b lang="en">You</b> তুমি, আপনি, তোমরা</span>
  <span><b lang="en">He</b> সে (ছেলে)</span>
  <span><b lang="en">She</b> সে (মেয়ে)</span>
  <span><b lang="en">It</b> এটা, সেটা</span>
  <span><b lang="en">We</b> আমরা</span>
  <span><b lang="en">They</b> তারা, ওগুলো</span>
</div>

<div class="mone">
  <p>বাংলায় তুমি, তুই আর আপনি আলাদা। ইংরেজিতে তিনটাই এক শব্দ:
  <span lang="en">you</span>। বস, বন্ধু, ছোট ভাই, সবার জন্য একই। এটা সুখবর:
  সম্মান-অসম্মানের হিসাব মাথা থেকে নামিয়ে রাখো।</p>
</div>

<p><span lang="en">It</span> শুধু জিনিস, পশু আর আবহাওয়ার জন্য। মানুষের জন্য কখনো নয়।</p>

<h2>নিজে বানাও</h2>

<p>আগে ভাবো: কে? কী করছে? কী? তারপর জোরে বলো, তারপর মিলিয়ে নাও।</p>

<div class="line-list">
  <p class="line"><b lang="en">I drink tea.</b><span>আমি চা খাই।</span></p>
  <p class="line"><b lang="en">She reads a book.</b><span>সে বই পড়ে।</span></p>
  <p class="line"><b lang="en">We go to school.</b><span>আমরা স্কুলে যাই।</span></p>
  <p class="line"><b lang="en">They play cricket.</b><span>তারা ক্রিকেট খেলে।</span></p>
  <p class="line"><b lang="en">My mother cooks.</b><span>আমার মা রান্না করে।</span></p>
  <p class="line"><b lang="en">The baby cries.</b><span>বাচ্চাটা কাঁদে।</span></p>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>আজ দিনের যেকোনো সময় নিজের পাঁচটা কাজ এই কাঠামোয় বলো:
  <span lang="en">I open the door. I fill the glass. I wash my hands.</span>
  কেউ শুনছে না, কেউ বিচার করছে না।</p>
</div>
`,

"am-is-are": `
<p>এই পর্বটা বাংলাভাষীর সবচেয়ে দামি পর্ব। কারণ এখানে যে ভুলটা ঠিক হয়, সেটা একাই
তোমার একশোটা বাক্যকে শুদ্ধ করে দেয়।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">WHO + am / is / are + ______</p>
  <p class="shape-why">বাংলায় 'হয়' লুকিয়ে থাকে, ইংরেজিতে কখনো লুকায় না। মাঝে একটা শব্দ
  বসাতেই হবে।</p>
  <p class="shape-eg" lang="en">I am a student. · She is my sister. · They are at home.</p>
  <p class="shape-tip">I হলে am। একজন (he, she, it) হলে is। বাকি সব (you, we, they) হলে are।</p>
</div>

<h2>বাংলা যা লুকায়, ইংরেজি তা বলে</h2>

<p>বাংলায় আমরা বলি <b>আমি ছাত্র</b>। দুটো শব্দ, মাঝে কিছু নেই। ইংরেজি ওভাবে পারে না,
মাঝে একটা ছোট শব্দ বসাতেই হয়।</p>

<div class="mone warn">
  <p><span lang="en">I student.</span> ভাঙা ইংরেজি।
  <span lang="en">I <b>am</b> a student.</span> শুদ্ধ ইংরেজি। বাংলাভাষীরা সবচেয়ে বেশি
  এই ভুলটাই করে, আর এটা আজই শেষ করা যায়।</p>
</div>

<div class="line-list">
  <p class="line"><b lang="en">I am hungry.</b><span>আমার খিদে পেয়েছে।</span></p>
  <p class="line"><b lang="en">She is my sister.</b><span>সে আমার বোন।</span></p>
  <p class="line"><b lang="en">You are late.</b><span>তুমি দেরি করেছো।</span></p>
  <p class="line"><b lang="en">It is cold today.</b><span>আজ ঠান্ডা।</span></p>
  <p class="line"><b lang="en">We are ready.</b><span>আমরা প্রস্তুত।</span></p>
  <p class="line"><b lang="en">They are at home.</b><span>তারা বাসায়।</span></p>
</div>

<h2>কোনটা কার সাথে</h2>

<div class="table-scroll">
<table>
  <thead>
    <tr><th>কে</th><th>be</th><th>মুখের ছোট রূপ</th><th>উদাহরণ</th></tr>
  </thead>
  <tbody>
    <tr><td lang="en">I</td><td lang="en">am</td><td lang="en">I'm</td><td lang="en">I'm tired.</td></tr>
    <tr><td lang="en">You</td><td lang="en">are</td><td lang="en">You're</td><td lang="en">You're right.</td></tr>
    <tr><td lang="en">He</td><td lang="en">is</td><td lang="en">He's</td><td lang="en">He's my father.</td></tr>
    <tr><td lang="en">She</td><td lang="en">is</td><td lang="en">She's</td><td lang="en">She's busy.</td></tr>
    <tr><td lang="en">It</td><td lang="en">is</td><td lang="en">It's</td><td lang="en">It's hot.</td></tr>
    <tr><td lang="en">We</td><td lang="en">are</td><td lang="en">We're</td><td lang="en">We're friends.</td></tr>
    <tr><td lang="en">They</td><td lang="en">are</td><td lang="en">They're</td><td lang="en">They're outside.</td></tr>
  </tbody>
</table>
</div>

<p>সত্যিকারের কথায় মানুষ প্রায় সবসময় ছোট রূপটাই বলে। তাই শুরু থেকেই
<span lang="en">I'm</span>, <span lang="en">he's</span>,
<span lang="en">they're</span> অভ্যাস করো।</p>

<h2>একটা কাঠামো, বিশটা বাক্য</h2>

<div class="split">
  <div class="do">
    <h5>অনুভূতি</h5>
    <div class="line-list">
      <p class="line"><b lang="en">I am happy.</b><span>আমি খুশি।</span></p>
      <p class="line"><b lang="en">I am tired.</b><span>আমি ক্লান্ত।</span></p>
      <p class="line"><b lang="en">I am afraid.</b><span>আমি ভয় পাচ্ছি।</span></p>
      <p class="line"><b lang="en">I am proud of you.</b><span>আমি তোমাকে নিয়ে গর্বিত।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>পরিচয় ও অবস্থান</h5>
    <div class="line-list">
      <p class="line"><b lang="en">I am a student.</b><span>আমি ছাত্রী।</span></p>
      <p class="line"><b lang="en">I am at home.</b><span>আমি বাসায়।</span></p>
      <p class="line"><b lang="en">I am from Bangladesh.</b><span>আমি বাংলাদেশের।</span></p>
      <p class="line"><b lang="en">I am not alone.</b><span>আমি একা নই।</span></p>
    </div>
  </div>
</div>

<h2>না বলা: শুধু not বসাও</h2>

<p>be-এর ঠিক পরেই <span lang="en">not</span>। আর কিছু বদলায় না।</p>

<div class="line-list">
  <p class="line"><b lang="en">I'm not hungry.</b><span>আমার খিদে নেই।</span></p>
  <p class="line"><b lang="en">He isn't here.</b><span>সে এখানে নেই।</span></p>
  <p class="line"><b lang="en">It isn't easy.</b><span>এটা সহজ নয়।</span></p>
  <p class="line"><b lang="en">We aren't late.</b><span>আমরা দেরি করিনি।</span></p>
  <p class="line"><b lang="en">You aren't wrong.</b><span>তুমি ভুল নও।</span></p>
</div>

<h2>প্রশ্ন: প্রথম দুই শব্দ উল্টে দাও</h2>

<p><span lang="en">You are ready.</span> থেকে
<span lang="en">Are you ready?</span> নতুন কিছু শিখতে হলো না, শুধু জায়গা বদল।</p>

<div class="line-list">
  <p class="line"><b lang="en">Are you okay?</b><span>তুমি ঠিক আছো? · <span lang="en">Yes, I am. / No, I'm not.</span></span></p>
  <p class="line"><b lang="en">Is he your brother?</b><span>সে কি তোমার ভাই? · <span lang="en">Yes, he is.</span></span></p>
  <p class="line"><b lang="en">Is it far?</b><span>এটা কি দূরে? · <span lang="en">No, it isn't.</span></span></p>
  <p class="line"><b lang="en">Are they at home?</b><span>তারা কি বাসায়? · <span lang="en">Yes, they are.</span></span></p>
</div>

<div class="mone">
  <p>ছোট উত্তরই যথেষ্ট। <span lang="en">"Yes, I am."</span> বললেই হয়, পুরো বাক্য
  আবার বলার দরকার নেই। মানুষ এভাবেই কথা বলে।</p>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>নিজের সম্পর্কে দশটা <span lang="en">I am</span> বাক্য বলো, তারপর সেগুলোর তিনটাকে
  প্রশ্নে বদলে আয়নার সামনে জিজ্ঞেস করো।</p>
</div>
`,

"have-has": `
<p>এই পর্বে শুধু একটা শব্দ শিখবে না, একটা চিন্তার ধরন বদলাবে। বাংলা আর ইংরেজি এখানে
উল্টো দিক থেকে হাঁটে।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">WHO + have / has + WHAT</p>
  <p class="shape-why">বাংলা জিনিসটাকে আগে রাখে: 'আমার একটা বোন আছে'। ইংরেজি মানুষকে আগে
  রাখে: <span lang="en">I have a sister</span>.</p>
  <p class="shape-eg" lang="en">I have two brothers. · She has a headache. · We have time.</p>
  <p class="shape-tip">he, she, it হলে has। বাকি সবাই have। সেই একই এক সেকেন্ডের নিয়ম।</p>
</div>

<h2>'আছে' মানেই 'is' নয়</h2>

<div class="mone warn">
  <p><span lang="en">My sister is.</span> এটার কোনো মানে হয় না। যেটা দরকার সেটা
  <span lang="en">have</span>: <span lang="en">I have a sister.</span></p>
</div>

<p>আর <span lang="en">have</span> শুধু মালিকানা নয়। পরিবার, অসুখ, সময়, পরিকল্পনা,
এমনকি খাওয়াও এই এক শব্দের ভিতরে থাকে।</p>

<div class="line-list">
  <p class="line"><b lang="en">I have two brothers.</b><span>আমার দুই ভাই আছে।</span></p>
  <p class="line"><b lang="en">She has a headache.</b><span>তার মাথাব্যথা করছে।</span></p>
  <p class="line"><b lang="en">We have time.</b><span>আমাদের সময় আছে।</span></p>
  <p class="line"><b lang="en">He has a good job.</b><span>তার ভালো চাকরি আছে।</span></p>
  <p class="line"><b lang="en">I have an idea.</b><span>আমার একটা বুদ্ধি আছে।</span></p>
  <p class="line"><b lang="en">They have no money.</b><span>তাদের টাকা নেই।</span></p>
</div>

<h2>have নাকি has</h2>

<div class="split">
  <div class="do">
    <h5 lang="en">I · You · We · They → have</h5>
    <div class="line-list">
      <p class="line"><b lang="en">I have a phone.</b><span>আমার ফোন আছে।</span></p>
      <p class="line"><b lang="en">You have a big heart.</b><span>তোমার মন অনেক বড়।</span></p>
      <p class="line"><b lang="en">We have a test today.</b><span>আজ আমাদের পরীক্ষা।</span></p>
    </div>
  </div>
  <div class="others">
    <h5 lang="en">He · She · It → has</h5>
    <div class="line-list">
      <p class="line"><b lang="en">She has long hair.</b><span>তার লম্বা চুল।</span></p>
      <p class="line"><b lang="en">He has a bicycle.</b><span>তার সাইকেল আছে।</span></p>
      <p class="line"><b lang="en">It has four legs.</b><span>এটার চারটা পা।</span></p>
    </div>
  </div>
</div>

<h2>নেই, আর আছে কি?</h2>

<p>না বলতে আর প্রশ্ন করতে <span lang="en">don't</span>, <span lang="en">doesn't</span>,
<span lang="en">do</span> আর <span lang="en">does</span> আসে, আর তখন
<span lang="en">has</span> আবার সাধারণ <span lang="en">have</span> হয়ে যায়।</p>

<div class="line-list">
  <p class="line"><b lang="en">I don't have money.</b><span>আমার টাকা নেই।</span></p>
  <p class="line"><b lang="en">She doesn't have time.</b><span>তার সময় নেই।</span></p>
  <p class="line"><b lang="en">Do you have a pen?</b><span>তোমার কলম আছে?</span></p>
  <p class="line"><b lang="en">Does he have a car?</b><span>তার গাড়ি আছে?</span></p>
  <p class="line"><b lang="en">Do they have children?</b><span>তাদের সন্তান আছে?</span></p>
</div>

<div class="mone warn">
  <p><span lang="en">Does she has time?</span> ভুল।
  <span lang="en">Does she <b>have</b> time?</span> ঠিক। টুপি একজনই পরবে: হয়
  <span lang="en">does</span>, নয় <span lang="en">has</span>।</p>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>ঘরের চারপাশে তাকিয়ে দশটা জিনিসের কথা বলো: <span lang="en">I have a…</span>
  তারপর পরিবারের একজনকে নিয়ে পাঁচটা: <span lang="en">She has a…</span></p>
</div>
`,

/* ------------------------------------------------------------
   কাজ ও কাল
   ------------------------------------------------------------ */

verbs: `
<p>ত্রিশটা ক্রিয়া দিয়ে তোমার দিনের প্রায় নব্বই ভাগ কথা বলা যায়। বইয়ের পাঁচ হাজার শব্দ
নয়, এই ত্রিশটাই আগে চাই।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">He / She / It + VERB + s</p>
  <p class="shape-why">একজন অন্য কেউ কাজটা করলে ক্রিয়ার মাথায় একটা ছোট্ট টুপি বসে।</p>
  <p class="shape-eg" lang="en">I work. → He works. · I go. → She goes.</p>
  <p class="shape-tip">বাংলায় এমন কিছু নেই, তাই মুখ বারবার ভুলবে। দুই সপ্তাহ ধীরে বলো,
  তারপর নিজে থেকেই ঠিক হয়ে যাবে।</p>
</div>

<h2>যে ত্রিশটা তোমার দিন চালায়</h2>

<div class="word-grid">
  <span><b lang="en">go</b> যাওয়া</span>
  <span><b lang="en">come</b> আসা</span>
  <span><b lang="en">eat</b> খাওয়া</span>
  <span><b lang="en">drink</b> পান করা</span>
  <span><b lang="en">sleep</b> ঘুমানো</span>
  <span><b lang="en">wake up</b> ঘুম থেকে ওঠা</span>
  <span><b lang="en">work</b> কাজ করা</span>
  <span><b lang="en">study</b> পড়া</span>
  <span><b lang="en">read</b> পড়া (বই)</span>
  <span><b lang="en">write</b> লেখা</span>
  <span><b lang="en">speak</b> বলা</span>
  <span><b lang="en">listen</b> শোনা</span>
  <span><b lang="en">look</b> তাকানো</span>
  <span><b lang="en">see</b> দেখা</span>
  <span><b lang="en">understand</b> বোঝা</span>
  <span><b lang="en">know</b> জানা</span>
  <span><b lang="en">think</b> ভাবা</span>
  <span><b lang="en">want</b> চাওয়া</span>
  <span><b lang="en">need</b> দরকার হওয়া</span>
  <span><b lang="en">like</b> পছন্দ করা</span>
  <span><b lang="en">love</b> ভালোবাসা</span>
  <span><b lang="en">give</b> দেওয়া</span>
  <span><b lang="en">take</b> নেওয়া</span>
  <span><b lang="en">buy</b> কেনা</span>
  <span><b lang="en">cook</b> রান্না করা</span>
  <span><b lang="en">wash</b> ধোয়া</span>
  <span><b lang="en">open</b> খোলা</span>
  <span><b lang="en">close</b> বন্ধ করা</span>
  <span><b lang="en">help</b> সাহায্য করা</span>
  <span><b lang="en">try</b> চেষ্টা করা</span>
</div>

<div class="mone">
  <p>ক্রিয়া কখনো একা শিখো না। <span lang="en">"cook"</span> নয়,
  <span lang="en">"I cook rice every evening"</span>। একা শব্দ মনে থাকে না, বাক্য থাকে।</p>
</div>

<h2>সেই ছোট্ট -s, যেটা সবাই ভোলে</h2>

<div class="line-list">
  <p class="line"><b lang="en">I work. → He works.</b><span>আমি কাজ করি। → সে কাজ করে।</span></p>
  <p class="line"><b lang="en">I go. → She goes.</b><span>আমি যাই। → সে যায়।</span></p>
  <p class="line"><b lang="en">We study. → He studies.</b><span>আমরা পড়ি। → সে পড়ে।</span></p>
  <p class="line"><b lang="en">They watch TV. → She watches TV.</b><span>তারা টিভি দেখে। → সে টিভি দেখে।</span></p>
  <p class="line"><b lang="en">You cry. → The baby cries.</b><span>তুমি কাঁদো। → বাচ্চাটা কাঁদে।</span></p>
</div>

<p>বানানের দুটো ছোট নিয়ম: <span lang="en">go</span> হয়
<span lang="en">goes</span>, <span lang="en">watch</span> হয়
<span lang="en">watches</span>, আর y-এর আগে ব্যঞ্জন থাকলে y উঠে গিয়ে
<span lang="en">ies</span> বসে: <span lang="en">study → studies</span>।</p>

<h2>কাজে না বলা</h2>

<div class="table-scroll">
<table>
  <thead>
    <tr><th>ঠিক</th><th>যে ভুলটা সবাই করে</th><th>বাংলা</th></tr>
  </thead>
  <tbody>
    <tr><td lang="en">I don't understand.</td><td lang="en">I not understand.</td><td>আমি বুঝি না।</td></tr>
    <tr><td lang="en">She doesn't eat fish.</td><td lang="en">She doesn't eats fish.</td><td>সে মাছ খায় না।</td></tr>
    <tr><td lang="en">He doesn't know me.</td><td lang="en">He don't knows me.</td><td>সে আমাকে চেনে না।</td></tr>
    <tr><td lang="en">They don't live here.</td><td lang="en">They doesn't live here.</td><td>তারা এখানে থাকে না।</td></tr>
    <tr><td lang="en">It doesn't work.</td><td lang="en">It not works.</td><td>এটা কাজ করে না।</td></tr>
  </tbody>
</table>
</div>

<div class="mone">
  <p>সোনালি নিয়ম: <span lang="en">doesn't</span> এলে ক্রিয়ার
  <span lang="en">-s</span> চলে যায়। টুপি একজনই পরবে।</p>
</div>

<h2>কাজ নিয়ে প্রশ্ন</h2>

<div class="line-list">
  <p class="line"><b lang="en">Do you speak English?</b><span>তুমি কি ইংরেজি বলো? · <span lang="en">A little.</span></span></p>
  <p class="line"><b lang="en">Does she live in Dhaka?</b><span>সে কি ঢাকায় থাকে?</span></p>
  <p class="line"><b lang="en">Do they know you?</b><span>তারা কি তোমাকে চেনে?</span></p>
  <p class="line"><b lang="en">Does it hurt?</b><span>ব্যথা করছে?</span></p>
  <p class="line"><b lang="en">Do you understand me?</b><span>তুমি কি আমাকে বুঝতে পারছো?</span></p>
</div>

<p><span lang="en">Do</span> বা <span lang="en">Does</span>-এর পরে ক্রিয়া সবসময় সাধারণ।
<span lang="en">Does she lives here?</span> কখনো নয়।</p>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>একই বাক্য তিন রূপে বলো, আটবার: বলা, না, প্রশ্ন।
  <span lang="en">She goes to school. She doesn't go to school. Does she go to school?</span></p>
</div>
`,

"right-now": `
<p>এই পর্বটা তোমার জন্য উপহার, কারণ বাংলা ঠিক একই কাজ করে। বাংলায় 'খাই' আর 'খাচ্ছি'
আলাদা; ইংরেজিতেও আলাদা, শুধু দুই টুকরায়।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">WHO + am / is / are + VERB + ing</p>
  <p class="shape-why">এই মুহূর্তে যা ঘটছে। বাংলার 'ছি', 'ছে' যেটা বলে, ইংরেজিতে সেটা
  বলে be + ing।</p>
  <p class="shape-eg" lang="en">I am eating. · She is sleeping. · They are coming.</p>
  <p class="shape-tip">প্রথম টুকরাটা কখনো বাদ দিও না। <span lang="en">I eating</span> ভাঙা।</p>
</div>

<h2>এখন ঘটছে</h2>

<div class="line-list">
  <p class="line"><b lang="en">I am cooking now.</b><span>আমি এখন রান্না করছি।</span></p>
  <p class="line"><b lang="en">She is studying.</b><span>সে পড়ছে।</span></p>
  <p class="line"><b lang="en">It is raining.</b><span>বৃষ্টি হচ্ছে।</span></p>
  <p class="line"><b lang="en">We are waiting for you.</b><span>আমরা তোমার জন্য অপেক্ষা করছি।</span></p>
  <p class="line"><b lang="en">They are laughing.</b><span>তারা হাসছে।</span></p>
  <p class="line"><b lang="en">I am trying my best.</b><span>আমি সর্বোচ্চ চেষ্টা করছি।</span></p>
</div>

<div class="mone warn">
  <p><span lang="en">I eating rice.</span> ভাঙা।
  <span lang="en">I <b>am</b> eating rice.</span> ঠিক। এটা দ্বিতীয় পর্বের সেই একই
  be, নতুন কাজে লাগানো।</p>
</div>

<h2>রোজকার অভ্যাস বনাম এই মুহূর্ত</h2>

<div class="table-scroll">
<table>
  <thead>
    <tr><th>রোজ (অভ্যাস)</th><th>এখন</th><th>বাংলা পার্থক্য</th></tr>
  </thead>
  <tbody>
    <tr><td lang="en">I eat rice.</td><td lang="en">I am eating rice.</td><td>খাই / খাচ্ছি</td></tr>
    <tr><td lang="en">She works in a shop.</td><td lang="en">She is working now.</td><td>কাজ করে / করছে</td></tr>
    <tr><td lang="en">They study English.</td><td lang="en">They are studying English.</td><td>পড়ে / পড়ছে</td></tr>
    <tr><td lang="en">It rains in June.</td><td lang="en">It is raining.</td><td>বৃষ্টি হয় / হচ্ছে</td></tr>
    <tr><td lang="en">We speak Bangla.</td><td lang="en">We are speaking English.</td><td>বলি / বলছি</td></tr>
  </tbody>
</table>
</div>

<div class="mone">
  <p>নিজেকে একটা প্রশ্ন করো: এটা কি রোজ সত্যি, নাকি এই সেকেন্ডে ঘটছে? রোজ হলে সাধারণ
  ক্রিয়া, এখন হলে be + ing। উত্তরটাই কাল বেছে দেয়।</p>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>জানালা দিয়ে বা ঘরের ভিতরে তাকাও, আর যা যা ঘটছে দশটা বলো:
  <span lang="en">A man is walking. The fan is turning. My sister is studying.</span>
  এটাই সবচেয়ে দ্রুত শেখার উপায়, আর একদম বিনামূল্যে।</p>
</div>
`,

yesterday: `
<p>তোমার এতদিনের পুরো জীবন এই কালে বসে আছে। কাল কী করেছো, ছোটবেলায় কোথায় থাকতে, কীভাবে
এখানে পৌঁছালে, সব। তাই এই পর্বটা লম্বা, আর এটাই সবচেয়ে বেশি কাজে লাগবে।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">WHO + was / were … · WHO + VERB + ed …</p>
  <p class="shape-why">am আর is অতীতে গিয়ে was, are গিয়ে were। আর বেশিরভাগ ক্রিয়ার শেষে
  শুধু -ed বসে।</p>
  <p class="shape-eg" lang="en">I was tired. · She cooked fish. · We watched a movie.</p>
  <p class="shape-tip">কুড়িটা ক্রিয়া এই নিয়ম মানে না। সেগুলোই সবচেয়ে বেশি লাগে, তাই
  সেগুলোই আগে।</p>
</div>

<h2>was আর were</h2>

<div class="split">
  <div class="do">
    <h5 lang="en">I · He · She · It → was</h5>
    <div class="line-list">
      <p class="line"><b lang="en">I was tired last night.</b><span>কাল রাতে আমি ক্লান্ত ছিলাম।</span></p>
      <p class="line"><b lang="en">She was very kind to me.</b><span>সে আমার সাথে খুব ভালো ছিল।</span></p>
      <p class="line"><b lang="en">It was a beautiful day.</b><span>দিনটা সুন্দর ছিল।</span></p>
    </div>
  </div>
  <div class="others">
    <h5 lang="en">You · We · They → were</h5>
    <div class="line-list">
      <p class="line"><b lang="en">We were at my aunt's house.</b><span>আমরা খালার বাসায় ছিলাম।</span></p>
      <p class="line"><b lang="en">They were happy.</b><span>তারা খুশি ছিল।</span></p>
      <p class="line"><b lang="en">You were right.</b><span>তুমি ঠিক ছিলে।</span></p>
    </div>
  </div>
</div>

<p>না আর প্রশ্ন সেই একই কৌশলে: <span lang="en">I wasn't ready.</span>
<span lang="en">Were you there?</span> <span lang="en">Why were you late?</span></p>

<h2>বেশিরভাগ ক্রিয়া: শুধু -ed</h2>

<div class="table-scroll">
<table>
  <thead>
    <tr><th>এখন</th><th>কাল</th><th>উদাহরণ</th><th>বাংলা</th></tr>
  </thead>
  <tbody>
    <tr><td lang="en">work</td><td lang="en">worked</td><td lang="en">I worked all day.</td><td>সারাদিন কাজ করেছি।</td></tr>
    <tr><td lang="en">cook</td><td lang="en">cooked</td><td lang="en">She cooked fish.</td><td>সে মাছ রান্না করেছে।</td></tr>
    <tr><td lang="en">help</td><td lang="en">helped</td><td lang="en">He helped me.</td><td>সে আমাকে সাহায্য করেছে।</td></tr>
    <tr><td lang="en">watch</td><td lang="en">watched</td><td lang="en">We watched a movie.</td><td>আমরা সিনেমা দেখেছি।</td></tr>
    <tr><td lang="en">study</td><td lang="en">studied</td><td lang="en">She studied hard.</td><td>সে মন দিয়ে পড়েছে।</td></tr>
    <tr><td lang="en">stop</td><td lang="en">stopped</td><td lang="en">The rain stopped.</td><td>বৃষ্টি থেমে গেছে।</td></tr>
  </tbody>
</table>
</div>

<p>বানান: y-এর আগে ব্যঞ্জন থাকলে y উঠে <span lang="en">ied</span>
(<span lang="en">study → studied</span>)। ছোট শব্দ এক ব্যঞ্জনে শেষ হলে সেটা দ্বিগুণ হয়
(<span lang="en">stop → stopped</span>)।</p>

<h2>কুড়িটা রেবেল</h2>

<p>এরা <span lang="en">-ed</span> নেয় না, পুরো বদলে যায়। আর এরাই সবচেয়ে বেশি ব্যবহার
হয়, তাই এদের এড়ানোর উপায় নেই।</p>

<div class="word-grid">
  <span><b lang="en">go → went</b> গেলাম</span>
  <span><b lang="en">eat → ate</b> খেলাম</span>
  <span><b lang="en">come → came</b> এলাম</span>
  <span><b lang="en">see → saw</b> দেখলাম</span>
  <span><b lang="en">take → took</b> নিলাম</span>
  <span><b lang="en">give → gave</b> দিলাম</span>
  <span><b lang="en">make → made</b> বানালাম</span>
  <span><b lang="en">say → said</b> বললাম</span>
  <span><b lang="en">tell → told</b> বললাম (কাউকে)</span>
  <span><b lang="en">do → did</b> করলাম</span>
  <span><b lang="en">get → got</b> পেলাম</span>
  <span><b lang="en">buy → bought</b> কিনলাম</span>
  <span><b lang="en">think → thought</b> ভাবলাম</span>
  <span><b lang="en">know → knew</b> জানতাম</span>
  <span><b lang="en">find → found</b> খুঁজে পেলাম</span>
  <span><b lang="en">speak → spoke</b> বললাম</span>
  <span><b lang="en">write → wrote</b> লিখলাম</span>
  <span><b lang="en">read → read</b> পড়লাম</span>
  <span><b lang="en">sleep → slept</b> ঘুমালাম</span>
  <span><b lang="en">run → ran</b> দৌড়ালাম</span>
</div>

<div class="mone">
  <p>লিস্ট মুখস্থ কোরো না। প্রতিটা দিয়ে নিজের জীবনের একটা সত্যি বাক্য বানাও:
  <span lang="en">I went to the market yesterday.</span> সত্যি বাক্য মনে থাকে,
  তালিকা থাকে না।</p>
</div>

<h2>did-এর জাদু</h2>

<div class="table-scroll">
<table>
  <thead>
    <tr><th>ঠিক</th><th>ভুল</th><th>বাংলা</th></tr>
  </thead>
  <tbody>
    <tr><td lang="en">I didn't go.</td><td lang="en">I didn't went.</td><td>আমি যাইনি।</td></tr>
    <tr><td lang="en">She didn't eat.</td><td lang="en">She didn't ate.</td><td>সে খায়নি।</td></tr>
    <tr><td lang="en">Did you see him?</td><td lang="en">Did you saw him?</td><td>তুমি কি তাকে দেখেছো?</td></tr>
    <tr><td lang="en">We didn't know.</td><td lang="en">We didn't knew.</td><td>আমরা জানতাম না।</td></tr>
    <tr><td lang="en">Why did he leave?</td><td lang="en">Why did he left?</td><td>সে চলে গেল কেন?</td></tr>
  </tbody>
</table>
</div>

<div class="mone">
  <p>যে নিয়মটা তোমাকে বাঁচাবে: <span lang="en">did</span> নিজেই অতীত বহন করে, তাই
  ক্রিয়া আবার সাধারণ রূপে ফিরে যায়। এক বাক্যে অতীত একবারই, দুবার নয়। এটা বিশ্রাম,
  বাড়তি বোঝা নয়।</p>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>কালকের দিনটা ছয় বাক্যে বলো, সত্যি কথা, বানানো নয়: সকালে কী করেছো, কোথায় গিয়েছো,
  কী খেয়েছো, কার সাথে কথা বলেছো, কী করোনি, দিনটা কেমন ছিল।</p>
</div>
`,

tomorrow: `
<p>ভবিষ্যতের জন্য দুটো পথ আছে, আর দুটোই সহজ। পার্থক্যটা ছোট, আর গুলিয়ে ফেললেও কেউ ভুল
বুঝবে না। আগে বলো, পরে ঘষামাজা কোরো।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">WHO + will + VERB · WHO + am/is/are + going to + VERB</p>
  <p class="shape-why">will মানে বলতে বলতে ঠিক করছি, কথা দিচ্ছি বা অনুমান করছি। going to
  মানে আগেই ঠিক করা ছিল।</p>
  <p class="shape-eg" lang="en">I will call you tonight. · I am going to study tonight.</p>
  <p class="shape-tip">will-এর শেষে কখনো -s বসে না, আর পরে কখনো 'to' বসে না।</p>
</div>

<h2>will: সিদ্ধান্ত, প্রতিশ্রুতি, অনুমান</h2>

<div class="line-list">
  <p class="line"><b lang="en">I will call you tonight.</b><span>আজ রাতে ফোন করবো।</span></p>
  <p class="line"><b lang="en">She will come tomorrow.</b><span>সে কাল আসবে।</span></p>
  <p class="line"><b lang="en">It will rain, I think.</b><span>মনে হয় বৃষ্টি হবে।</span></p>
  <p class="line"><b lang="en">I'll help you.</b><span>আমি তোমাকে সাহায্য করবো।</span></p>
  <p class="line"><b lang="en">I will never give up.</b><span>আমি কখনো হাল ছাড়বো না।</span></p>
</div>

<p>না আর প্রশ্ন: <span lang="en">I won't forget.</span>
<span lang="en">Will you help me?</span> <span lang="en">When will you come?</span>
মুখে <span lang="en">will not</span> প্রায় সবসময় <span lang="en">won't</span> হয়ে যায়।</p>

<h2>going to: আগে থেকে ঠিক করা</h2>

<div class="line-list">
  <p class="line"><b lang="en">I am going to study tonight.</b><span>আজ রাতে পড়বো, ঠিক করা আছে।</span></p>
  <p class="line"><b lang="en">She is going to get married.</b><span>তার বিয়ে হতে যাচ্ছে।</span></p>
  <p class="line"><b lang="en">We are going to move house.</b><span>আমরা বাসা বদলাবো।</span></p>
  <p class="line"><b lang="en">It is going to rain.</b><span>বৃষ্টি হবে, আকাশ দেখে বলছি।</span></p>
  <p class="line"><b lang="en">Are you going to eat?</b><span>তুমি কি খাবে?</span></p>
</div>

<div class="mone">
  <p>ফোন বাজছে, তুমি বললে <span lang="en">"I'll get it."</span> এটা will, কারণ
  সিদ্ধান্তটা এইমাত্র নিলে। শুক্রবার খালার বাসায় যাওয়ার কথা আগেই ঠিক ছিল, তাই
  <span lang="en">"I'm going to visit my aunt on Friday."</span></p>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>তোমার আগামীকাল আটটা বাক্যে বলো: কখন উঠবে, কী করবে, কোথায় যাবে, কী করবে না, আর
  একটা প্রতিশ্রুতি নিজেকে।</p>
</div>
`,

/* ------------------------------------------------------------
   হাতিয়ার
   ------------------------------------------------------------ */

helpers: `
<p>ছোট কয়েকটা শব্দ, কিন্তু এদের ছাড়া ভদ্রভাবে কিছু চাওয়া যায় না, অনুমতি নেওয়া যায় না,
পরামর্শও দেওয়া যায় না। সবচেয়ে ভালো খবর: এদের পরে ক্রিয়া সবসময় সাধারণ থাকে।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">WHO + can / want to / need to / have to + VERB</p>
  <p class="shape-why">can-এর পরে সরাসরি ক্রিয়া। want, need আর have-এর পরে to, তারপর
  ক্রিয়া।</p>
  <p class="shape-eg" lang="en">I can swim. · I want to learn. · I have to go now.</p>
  <p class="shape-tip">ক্রিয়ায় কখনো -s বসে না। -s বসলে বসবে প্রথম শব্দে:
  <span lang="en">She wants to go</span>.</p>
</div>

<h2>can আর can't</h2>

<div class="table-scroll">
<table>
  <thead>
    <tr><th>ইংরেজি</th><th>বাংলা</th><th>কীসের জন্য</th></tr>
  </thead>
  <tbody>
    <tr><td lang="en">I can speak a little English.</td><td>আমি একটু ইংরেজি বলতে পারি।</td><td>সামর্থ্য</td></tr>
    <tr><td lang="en">She can't come today.</td><td>সে আজ আসতে পারবে না।</td><td>সামর্থ্য</td></tr>
    <tr><td lang="en">Can you help me, please?</td><td>একটু সাহায্য করবেন?</td><td>অনুরোধ</td></tr>
    <tr><td lang="en">Can I ask you something?</td><td>একটা কথা জিজ্ঞেস করতে পারি?</td><td>অনুমতি</td></tr>
    <tr><td lang="en">You can do this.</td><td>তুমি এটা পারবে।</td><td>সাহস দেওয়া</td></tr>
  </tbody>
</table>
</div>

<div class="mone warn">
  <p><span lang="en">She cans.</span> নয়। <span lang="en">He can to swim.</span> নয়।
  শুধু <span lang="en">He can swim.</span></p>
</div>

<h2>চার কাঠামো, অসংখ্য বাক্য</h2>

<div class="line-list">
  <p class="line"><b lang="en">I want to learn English.</b><span>আমি ইংরেজি শিখতে চাই।</span></p>
  <p class="line"><b lang="en">I need to rest.</b><span>আমার বিশ্রাম দরকার।</span></p>
  <p class="line"><b lang="en">I have to go now.</b><span>আমাকে এখন যেতেই হবে।</span></p>
  <p class="line"><b lang="en">I would like to ask something.</b><span>আমি একটা কথা জিজ্ঞেস করতে চাইছি।</span></p>
  <p class="line"><b lang="en">She needs to see a doctor.</b><span>তার ডাক্তার দেখানো দরকার।</span></p>
  <p class="line"><b lang="en">He has to work tomorrow.</b><span>তাকে কাল কাজ করতে হবে।</span></p>
</div>

<p><span lang="en">would like to</span> হলো <span lang="en">want to</span>-এর ভদ্র রূপ।
দোকানে, অফিসে বা অচেনা মানুষের সাথে এটাই বলবে।</p>

<h2>যে বাক্যগুলো দরজা খুলে দেয়</h2>

<div class="split">
  <div class="do">
    <h5>ভদ্রভাবে চাওয়া</h5>
    <div class="line-list">
      <p class="line"><b lang="en">Could you help me, please?</b><span>একটু সাহায্য করবেন কি?</span></p>
      <p class="line"><b lang="en">May I come in?</b><span>আসতে পারি?</span></p>
      <p class="line"><b lang="en">Could you speak slowly, please?</b><span>একটু আস্তে বলবেন?</span></p>
      <p class="line"><b lang="en">Sorry, I didn't understand.</b><span>দুঃখিত, বুঝিনি।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>পরামর্শ ও নরম করা</h5>
    <div class="line-list">
      <p class="line"><b lang="en">You should rest.</b><span>তোমার বিশ্রাম নেওয়া উচিত।</span></p>
      <p class="line"><b lang="en">You shouldn't worry.</b><span>চিন্তা করা উচিত নয়।</span></p>
      <p class="line"><b lang="en">I think you are right.</b><span>আমার মনে হয় তুমি ঠিক।</span></p>
      <p class="line"><b lang="en">I'm not sure, but…</b><span>নিশ্চিত নই, তবে…</span></p>
    </div>
  </div>
</div>

<div class="mone">
  <p>একটা বাক্য মুখস্থ রাখো, সারাজীবন কাজে লাগবে:
  <span lang="en">"Sorry, I didn't understand. Could you repeat that, please?"</span>
  না বুঝে চুপ করে থাকার চেয়ে এটা বলা হাজার গুণ ভালো।</p>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>আজ যা যা করতে হবে তার তিনটা <span lang="en">have to</span> দিয়ে বলো, যা চাও তার
  তিনটা <span lang="en">want to</span> দিয়ে, আর যা পারো না তার একটা
  <span lang="en">can't</span> দিয়ে। শেষেরটা লজ্জার কিছু নয়, ওটাই পরের লক্ষ্য।</p>
</div>
`,

questions: `
<p>যে মানুষ প্রশ্ন করতে পারে, সে যেকোনো জায়গায় যেকোনো কিছু শিখে নিতে পারে। প্রশ্ন করতে
না পারলে ভাষাটা এক দিকের রাস্তা হয়ে থাকে।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">Q-WORD + HELPER + WHO + VERB ?</p>
  <p class="shape-why">প্রশ্নের শব্দ, তারপর is/are/do/does/did/will/can, তারপর কে, তারপর
  ক্রিয়া। চারটা খোপ, ভরে দাও।</p>
  <p class="shape-eg" lang="en">Where do you live? · What is she doing? · Why did he leave?</p>
  <p class="shape-tip">'কে' নিজেই কর্তা হলে helper লাগে না:
  <span lang="en">Who wants tea?</span></p>
</div>

<h2>ছয়টা চাবি</h2>

<div class="line-list">
  <p class="line"><b lang="en">What is your name?</b><span>কী · তোমার নাম কী?</span></p>
  <p class="line"><b lang="en">Where do you live?</b><span>কোথায় · তুমি কোথায় থাকো?</span></p>
  <p class="line"><b lang="en">When does it start?</b><span>কখন · এটা কখন শুরু হয়?</span></p>
  <p class="line"><b lang="en">Who is that man?</b><span>কে · ওই লোকটা কে?</span></p>
  <p class="line"><b lang="en">Why are you sad?</b><span>কেন · তুমি মন খারাপ কেন?</span></p>
  <p class="line"><b lang="en">How are you?</b><span>কেমন · তুমি কেমন আছো?</span></p>
</div>

<p>সাথে আরও কয়েকটা, যেগুলো রোজ লাগে:</p>

<div class="word-grid">
  <span><b lang="en">How much?</b> দাম কত?</span>
  <span><b lang="en">How many?</b> কয়টা?</span>
  <span><b lang="en">How long?</b> কতক্ষণ?</span>
  <span><b lang="en">How far?</b> কত দূর?</span>
  <span><b lang="en">Which one?</b> কোনটা?</span>
  <span><b lang="en">Whose?</b> কার?</span>
</div>

<h2>প্রশ্ন-মেশিন</h2>

<div class="table-scroll">
<table>
  <thead>
    <tr><th>প্রশ্ন-শব্দ</th><th>helper</th><th>কে</th><th>ক্রিয়া</th><th>বাংলা</th></tr>
  </thead>
  <tbody>
    <tr><td lang="en">Where</td><td lang="en">do</td><td lang="en">you</td><td lang="en">live?</td><td>তুমি কোথায় থাকো?</td></tr>
    <tr><td lang="en">What</td><td lang="en">is</td><td lang="en">she</td><td lang="en">doing?</td><td>সে কী করছে?</td></tr>
    <tr><td lang="en">Why</td><td lang="en">did</td><td lang="en">he</td><td lang="en">leave?</td><td>সে চলে গেল কেন?</td></tr>
    <tr><td lang="en">When</td><td lang="en">will</td><td lang="en">you</td><td lang="en">come?</td><td>তুমি কখন আসবে?</td></tr>
    <tr><td lang="en">How</td><td lang="en">can</td><td lang="en">I</td><td lang="en">help you?</td><td>আমি কীভাবে সাহায্য করবো?</td></tr>
    <tr><td lang="en">How much</td><td lang="en">does</td><td lang="en">it</td><td lang="en">cost?</td><td>এটার দাম কত?</td></tr>
  </tbody>
</table>
</div>

<div class="mone">
  <p>একই মেশিন সব কালের জন্য চলে। শুধু helper বদলাও:
  <span lang="en">do</span> বর্তমানে, <span lang="en">did</span> অতীতে,
  <span lang="en">will</span> ভবিষ্যতে। বাকি খোপ তিনটা একই জায়গায় থাকে।</p>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>দশটা প্রশ্ন বানাও, তারপর আজই সত্যিকারের একজন মানুষকে অন্তত একটা জিজ্ঞেস করো।
  উত্তর না বুঝলেও ক্ষতি নেই, বলো: <span lang="en">"Sorry, again please?"</span></p>
</div>
`,

glue: `
<p>এই শব্দগুলো ছোট, প্রায় অদৃশ্য, আর সব জায়গায় আছে। বাংলায় এদের সরাসরি কোনো জোড়া নেই,
তাই এগুলোই সবচেয়ে বেশি ভুল হয়। ভালো খবর: ভুল হলেও কেউ তোমার কথা ভুল বুঝবে না।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">in (ভিতরে) · on (উপরে, লেগে) · at (একটা নির্দিষ্ট বিন্দু)</p>
  <p class="shape-why">জায়গার বেলায় বড় থেকে ছোট, সময়ের বেলায় লম্বা থেকে ছোট।</p>
  <p class="shape-eg" lang="en">in Dhaka · on the table · at the door · in June · on Friday · at 7 o'clock</p>
  <p class="shape-tip">নিয়ম হিসেবে নয়, ছবি হিসেবে মনে রাখো। ভিতরে, গায়ে লাগানো, আর
  ঠিক এক জায়গায়।</p>
</div>

<h2>জায়গা</h2>

<div class="line-list">
  <p class="line"><b lang="en">in Bangladesh, in Dhaka, in the room, in my bag</b><span>ভিতরে: দেশ, শহর, ঘর, ব্যাগ।</span></p>
  <p class="line"><b lang="en">on the table, on the wall, on the bus, on page 5</b><span>উপরে, গায়ে লেগে আছে।</span></p>
  <p class="line"><b lang="en">at home, at school, at the door, at the market</b><span>নির্দিষ্ট একটা বিন্দুতে।</span></p>
</div>

<h2>সময়</h2>

<div class="line-list">
  <p class="line"><b lang="en">in June, in 2026, in the morning, in two hours</b><span>লম্বা সময়: মাস, বছর, সকাল।</span></p>
  <p class="line"><b lang="en">on Friday, on my birthday, on 12 July</b><span>দিন ও তারিখ।</span></p>
  <p class="line"><b lang="en">at 7 o'clock, at noon, at night, at the moment</b><span>ঘড়ির নির্দিষ্ট সময়।</span></p>
</div>

<h2>a, an আর the</h2>

<p>বাংলায় এগুলো নেই, তাই প্রথমে অদ্ভুত লাগে। কিন্তু নিয়ম আসলে দুটো।</p>

<div class="split">
  <div class="do">
    <h5 lang="en">a / an</h5>
    <p>অনেকের মধ্যে যেকোনো একটা। শ্রোতা এখনো জানে না কোনটা।</p>
    <p lang="en">I bought a book. · I want an egg.</p>
    <p>ব্যঞ্জন-ধ্বনির আগে <span lang="en">a</span>, স্বর-ধ্বনির আগে
    <span lang="en">an</span>।</p>
  </div>
  <div class="others">
    <h5 lang="en">the</h5>
    <p>দুজনেই জানি ঠিক কোনটার কথা হচ্ছে।</p>
    <p lang="en">The book is on the table. · Open the door, please.</p>
    <p>প্রথমবার <span lang="en">a</span>, তারপর থেকে
    <span lang="en">the</span>।</p>
  </div>
</div>

<div class="line-list">
  <p class="line"><b lang="en">I saw a dog. The dog was black.</b><span>একটা কুকুর দেখলাম। কুকুরটা কালো ছিল।</span></p>
  <p class="line"><b lang="en">She is a teacher.</b><span>সে একজন শিক্ষক।</span></p>
  <p class="line"><b lang="en">The sun is hot today.</b><span>আজ রোদ গরম।</span></p>
  <p class="line"><b lang="en">I have an idea.</b><span>আমার একটা বুদ্ধি আছে।</span></p>
</div>

<div class="mone">
  <p>দ্বিধা হলেও থেমো না। একটা <span lang="en">the</span> বাদ পড়লে কেউ তোমার কথা ভুল
  বুঝবে না, কিন্তু চুপ করে থাকলে কথাটাই হারিয়ে যায়।</p>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>ঘরের পাঁচটা জিনিস কোথায় আছে বলো (<span lang="en">The book is on the bed.</span>),
  আর তোমার সপ্তাহের পাঁচটা কাজ কখন হবে বলো
  (<span lang="en">I have class on Sunday at nine.</span>)</p>
</div>
`,

/* ------------------------------------------------------------
   রোজকার জীবন
   ------------------------------------------------------------ */

"sentence-bank": `
<p>এই পর্বে নতুন কোনো নিয়ম নেই। এখানে আছে সেই বাক্যগুলো, যেগুলো এই সপ্তাহেই তোমার
সত্যিই লাগবে। ছয়টা জায়গা, প্রতিটাতে বারোটা করে।</p>

<div class="mone">
  <p>এগুলো মুখস্থ করার তালিকা নয়, ব্যবহার করার তালিকা। একটা করে জায়গা নাও, সেই দিনটায়
  সেই বারোটা বাক্য অন্তত একবার সত্যি সত্যি বলার চেষ্টা করো।</p>
</div>

<h2>ঘরে ও রান্নাঘরে</h2>

<div class="split">
  <div class="do">
    <h5>খাবার</h5>
    <div class="line-list">
      <p class="line"><b lang="en">I'm hungry. Is the food ready?</b><span>খিদে পেয়েছে। খাবার হয়েছে?</span></p>
      <p class="line"><b lang="en">Can you pass me the salt?</b><span>লবণটা একটু দাও তো।</span></p>
      <p class="line"><b lang="en">The rice is almost done.</b><span>ভাত প্রায় হয়ে গেছে।</span></p>
      <p class="line"><b lang="en">I'll wash the dishes.</b><span>আমি বাসন ধুয়ে দেবো।</span></p>
      <p class="line"><b lang="en">Don't touch it, it's hot.</b><span>ধরো না, গরম।</span></p>
      <p class="line"><b lang="en">Have you eaten?</b><span>খেয়েছো?</span></p>
    </div>
  </div>
  <div class="others">
    <h5>সকাল থেকে রাত</h5>
    <div class="line-list">
      <p class="line"><b lang="en">I woke up late today.</b><span>আজ দেরিতে উঠেছি।</span></p>
      <p class="line"><b lang="en">I'm going to take a bath.</b><span>গোসল করতে যাচ্ছি।</span></p>
      <p class="line"><b lang="en">Where are my keys?</b><span>আমার চাবি কোথায়?</span></p>
      <p class="line"><b lang="en">Turn off the light, please.</b><span>লাইটটা নিভিয়ে দাও।</span></p>
      <p class="line"><b lang="en">I'm tired. I'll go to bed.</b><span>ক্লান্ত লাগছে, ঘুমাতে যাচ্ছি।</span></p>
      <p class="line"><b lang="en">Good night. Sleep well.</b><span>শুভ রাত্রি। ভালো ঘুম হোক।</span></p>
    </div>
  </div>
</div>

<h2>বাজারে ও দোকানে</h2>

<div class="split">
  <div class="do">
    <h5>দাম ও কেনা</h5>
    <div class="line-list">
      <p class="line"><b lang="en">How much is this?</b><span>এটার দাম কত?</span></p>
      <p class="line"><b lang="en">That's too expensive.</b><span>এটা তো অনেক দামি।</span></p>
      <p class="line"><b lang="en">Can you give me a discount?</b><span>একটু কম রাখা যায়?</span></p>
      <p class="line"><b lang="en">Do you have a smaller one?</b><span>ছোট সাইজ আছে?</span></p>
      <p class="line"><b lang="en">I'll take two kilos.</b><span>দুই কেজি দিন।</span></p>
      <p class="line"><b lang="en">Here you are. Keep the change.</b><span>এই নিন। খুচরা রেখে দিন।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>বাছাই ও দাম দেওয়া</h5>
    <div class="line-list">
      <p class="line"><b lang="en">I'm just looking, thank you.</b><span>শুধু দেখছি, ধন্যবাদ।</span></p>
      <p class="line"><b lang="en">Is it fresh?</b><span>এটা কি তাজা?</span></p>
      <p class="line"><b lang="en">Can I try it on?</b><span>পরে দেখতে পারি?</span></p>
      <p class="line"><b lang="en">It doesn't fit me.</b><span>এটা আমার গায়ে হচ্ছে না।</span></p>
      <p class="line"><b lang="en">Do you take mobile payment?</b><span>মোবাইলে পেমেন্ট নেন?</span></p>
      <p class="line"><b lang="en">Thank you. See you again.</b><span>ধন্যবাদ। আবার দেখা হবে।</span></p>
    </div>
  </div>
</div>

<h2>শরীর খারাপ হলে</h2>

<div class="split">
  <div class="do">
    <h5>উপসর্গ</h5>
    <div class="line-list">
      <p class="line"><b lang="en">I don't feel well.</b><span>আমার ভালো লাগছে না।</span></p>
      <p class="line"><b lang="en">I have a fever.</b><span>আমার জ্বর হয়েছে।</span></p>
      <p class="line"><b lang="en">My head hurts.</b><span>আমার মাথা ব্যথা করছে।</span></p>
      <p class="line"><b lang="en">I have a cough and a cold.</b><span>কাশি আর ঠান্ডা লেগেছে।</span></p>
      <p class="line"><b lang="en">My stomach hurts.</b><span>পেট ব্যথা করছে।</span></p>
      <p class="line"><b lang="en">It started two days ago.</b><span>দুইদিন আগে শুরু হয়েছে।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>চিকিৎসায়</h5>
    <div class="line-list">
      <p class="line"><b lang="en">I need to see a doctor.</b><span>ডাক্তার দেখাতে হবে।</span></p>
      <p class="line"><b lang="en">Where is the nearest hospital?</b><span>সবচেয়ে কাছের হাসপাতাল কোথায়?</span></p>
      <p class="line"><b lang="en">How many times a day?</b><span>দিনে কয়বার খাবো?</span></p>
      <p class="line"><b lang="en">Before or after food?</b><span>খাওয়ার আগে না পরে?</span></p>
      <p class="line"><b lang="en">I'm feeling better now.</b><span>এখন একটু ভালো লাগছে।</span></p>
      <p class="line"><b lang="en">Please help me.</b><span>দয়া করে সাহায্য করুন।</span></p>
    </div>
  </div>
</div>

<h2>ফোনে ও মেসেজে</h2>

<div class="split">
  <div class="do">
    <h5>কল</h5>
    <div class="line-list">
      <p class="line"><b lang="en">Hello, who is this?</b><span>হ্যালো, কে বলছেন?</span></p>
      <p class="line"><b lang="en">Can you hear me?</b><span>শুনতে পাচ্ছো?</span></p>
      <p class="line"><b lang="en">Sorry, the line is bad.</b><span>দুঃখিত, লাইন খারাপ।</span></p>
      <p class="line"><b lang="en">I'll call you back.</b><span>আমি পরে ফোন করবো।</span></p>
      <p class="line"><b lang="en">Are you free to talk?</b><span>কথা বলার সময় আছে?</span></p>
      <p class="line"><b lang="en">Talk to you later. Bye.</b><span>পরে কথা হবে। বাই।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>মেসেজ ও পরিকল্পনা</h5>
    <div class="line-list">
      <p class="line"><b lang="en">Sorry, I missed your call.</b><span>দুঃখিত, ফোন ধরতে পারিনি।</span></p>
      <p class="line"><b lang="en">I'm on my way.</b><span>আমি আসছি, রাস্তায় আছি।</span></p>
      <p class="line"><b lang="en">I'll be there in ten minutes.</b><span>দশ মিনিটে পৌঁছাবো।</span></p>
      <p class="line"><b lang="en">Can we meet tomorrow?</b><span>কাল দেখা করা যায়?</span></p>
      <p class="line"><b lang="en">Please text me the address.</b><span>ঠিকানাটা মেসেজ করে দাও।</span></p>
      <p class="line"><b lang="en">Thank you for calling.</b><span>ফোন করার জন্য ধন্যবাদ।</span></p>
    </div>
  </div>
</div>

<h2>পথে</h2>

<div class="split">
  <div class="do">
    <h5>পথ জিজ্ঞাসা</h5>
    <div class="line-list">
      <p class="line"><b lang="en">Excuse me, where is the station?</b><span>মাফ করবেন, স্টেশন কোথায়?</span></p>
      <p class="line"><b lang="en">How can I get to Gulshan?</b><span>গুলশানে কীভাবে যাবো?</span></p>
      <p class="line"><b lang="en">Is it far from here?</b><span>এখান থেকে কি দূরে?</span></p>
      <p class="line"><b lang="en">How long does it take?</b><span>কতক্ষণ লাগে?</span></p>
      <p class="line"><b lang="en">I think I'm lost.</b><span>মনে হয় আমি পথ হারিয়েছি।</span></p>
      <p class="line"><b lang="en">Can you show me on the map?</b><span>ম্যাপে একটু দেখাবেন?</span></p>
    </div>
  </div>
  <div class="others">
    <h5>দিক ও গাড়ি</h5>
    <div class="line-list">
      <p class="line"><b lang="en">Go straight, then turn left.</b><span>সোজা যান, তারপর বামে ঘুরুন।</span></p>
      <p class="line"><b lang="en">It's on your right.</b><span>এটা আপনার ডানপাশে।</span></p>
      <p class="line"><b lang="en">Stop here, please.</b><span>এখানে থামুন।</span></p>
      <p class="line"><b lang="en">How much to the airport?</b><span>এয়ারপোর্ট পর্যন্ত কত?</span></p>
      <p class="line"><b lang="en">Please hurry, I'm late.</b><span>একটু তাড়াতাড়ি, দেরি হয়ে যাচ্ছে।</span></p>
      <p class="line"><b lang="en">Wait for me here.</b><span>এখানে আমার জন্য অপেক্ষা করুন।</span></p>
    </div>
  </div>
</div>

<h2>মানুষ ও অনুভূতি</h2>

<div class="split">
  <div class="do">
    <h5>পরিচয়</h5>
    <div class="line-list">
      <p class="line"><b lang="en">How are you? I'm fine, and you?</b><span>কেমন আছো? ভালো, তুমি?</span></p>
      <p class="line"><b lang="en">Nice to meet you.</b><span>পরিচিত হয়ে ভালো লাগলো।</span></p>
      <p class="line"><b lang="en">What do you do?</b><span>তুমি কী করো?</span></p>
      <p class="line"><b lang="en">I'm sorry to hear that.</b><span>শুনে খারাপ লাগলো।</span></p>
      <p class="line"><b lang="en">Congratulations!</b><span>অভিনন্দন!</span></p>
      <p class="line"><b lang="en">Take care of yourself.</b><span>নিজের যত্ন নিও।</span></p>
    </div>
  </div>
  <div class="others">
    <h5>অনুভূতি</h5>
    <div class="line-list">
      <p class="line"><b lang="en">I'm so happy today.</b><span>আজ খুব খুশি লাগছে।</span></p>
      <p class="line"><b lang="en">I feel a little nervous.</b><span>একটু ভয় ভয় লাগছে।</span></p>
      <p class="line"><b lang="en">I miss you.</b><span>তোমাকে মনে পড়ে।</span></p>
      <p class="line"><b lang="en">I'm proud of you.</b><span>তোমাকে নিয়ে গর্ব হয়।</span></p>
      <p class="line"><b lang="en">Don't worry, it's okay.</b><span>চিন্তা কোরো না, ঠিক আছে।</span></p>
      <p class="line"><b lang="en">Thank you for everything.</b><span>সব কিছুর জন্য ধন্যবাদ।</span></p>
    </div>
  </div>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>আজ একটা জায়গা বেছে নাও। সেই বারোটা বাক্য তিনবার করে জোরে পড়ো, তারপর দিনের মধ্যে
  অন্তত একটা সত্যিকারের মানুষকে বলো। ভুল হলেও।</p>
</div>
`,

"from-the-heart": `
<p>এতদিন তুমি নকল করেছো। এবার বানানো শুরু। এই পর্বে কোনো নতুন ব্যাকরণ নেই, আছে তিনটা
কাঠামো, যেগুলো দিয়ে যেকোনো কিছু নিয়ে এক মিনিট কথা বলা যায়।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">I think ______ , because ______ . For example ______ . So ______ .</p>
  <p class="shape-why">মতামতের কাঠামো। চারটা লাইন, আর একটা সম্পূর্ণ উত্তর তৈরি।</p>
  <p class="shape-eg" lang="en">I think English is important, because it opens many doors.</p>
  <p class="shape-tip">এটা পারলে তুমি আর শিক্ষার্থী নও, তুমি বক্তা।</p>
</div>

<h2>যেকোনো কিছু বর্ণনা করো: পাঁচ প্রশ্নের পদ্ধতি</h2>

<p>একটা ছবি, একটা ঘর, একজন মানুষ, যেকোনো কিছু। এই পাঁচটা প্রশ্নের উত্তর দিলেই একটা
অনুচ্ছেদ তৈরি হয়ে যায়।</p>

<div class="line-list">
  <p class="line"><b lang="en">What do you see?</b><span>কী দেখছো? · <span lang="en">I see a woman and a small girl.</span></span></p>
  <p class="line"><b lang="en">Where are they?</b><span>তারা কোথায়? · <span lang="en">They are in a kitchen.</span></span></p>
  <p class="line"><b lang="en">What are they doing?</b><span>কী করছে? · <span lang="en">The woman is cooking.</span></span></p>
  <p class="line"><b lang="en">How do they look?</b><span>কেমন লাগছে? · <span lang="en">They look happy.</span></span></p>
  <p class="line"><b lang="en">What will happen?</b><span>কী মনে হয়? · <span lang="en">I think they will eat together.</span></span></p>
</div>

<p>পাঁচটা উত্তর মানে একটা অনুচ্ছেদ। কিছু মুখস্থ না করেই তুমি পুরো এক মিনিট ইংরেজি
বললে।</p>

<h2>নিজের দিনের গল্প</h2>

<p>রোজ রাতে ঘুমানোর আগে দিনটা ইংরেজিতে বলো, জোরে। এটাই এই কোর্সের সবচেয়ে শক্তিশালী
অভ্যাস, আর এতে কোনো খরচ নেই।</p>

<div class="line-list">
  <p class="line"><b lang="en">I woke up at six. I washed my face and prayed.</b><span>সকাল</span></p>
  <p class="line"><b lang="en">I went to school at eight. English was difficult but I tried.</b><span>দিন</span></p>
  <p class="line"><b lang="en">I came home and helped my mother.</b><span>সন্ধ্যা</span></p>
  <p class="line"><b lang="en">I ate rice and fish. I went to bed at ten.</b><span>রাত</span></p>
  <p class="line"><b lang="en">It was a good day. I am proud of myself, because I did not give up.</b><span>অনুভূতি</span></p>
</div>

<div class="mone">
  <p>খেয়াল করো: অতীত কাল, সত্যিকারের জীবন, আর সৎ একটা অনুভূতি। এই তিনটা থাকলেই সেটা
  গল্প। রোজ রাতে, প্রতিদিন।</p>
</div>

<h2>মতামত দেওয়ার শব্দ</h2>

<div class="split">
  <div class="do">
    <h5>শুরু করার শব্দ</h5>
    <div class="line-list">
      <p class="line"><b lang="en">I think that…</b><span>আমার মনে হয়…</span></p>
      <p class="line"><b lang="en">In my opinion…</b><span>আমার মতে…</span></p>
      <p class="line"><b lang="en">I agree with you.</b><span>আমি একমত।</span></p>
      <p class="line"><b lang="en">I don't agree, because…</b><span>আমি একমত নই, কারণ…</span></p>
      <p class="line"><b lang="en">That's a good point, but…</b><span>কথাটা ঠিক, তবে…</span></p>
      <p class="line"><b lang="en">I'm not sure. Maybe…</b><span>নিশ্চিত নই। হয়তো…</span></p>
    </div>
  </div>
  <div class="others">
    <h5>একটা পূর্ণ উত্তর</h5>
    <p lang="en">I think English is very important,<br>
    because it opens many doors.<br>
    For example, I can read, work,<br>
    and talk to people from other countries.<br>
    So I study every day, even when it is hard.</p>
    <p>এই পাঁচ লাইনই একটা সম্পূর্ণ উত্তর। কোনো পরীক্ষায় এর বেশি লাগে না।</p>
  </div>
</div>

<h2>নিজের সাথে কথা: গোপন অস্ত্র</h2>

<div class="line-list">
  <p class="line"><b lang="en">I am opening the door. I am filling the glass.</b><span>যা করছো, বলে বলে করো।</span></p>
  <p class="line"><b lang="en">That is a red bus. The sky is grey.</b><span>যা দেখো, নাম বলো।</span></p>
  <p class="line"><b lang="en">What will I do now? Where did I put my book?</b><span>নিজেকে প্রশ্ন করো।</span></p>
  <p class="line"><b lang="en">I want to rest, but I have to finish this first.</b><span>নিজের সাথে তর্ক করো।</span></p>
  <p class="line"><b lang="en">My name is ___. I am learning English. I will not stop.</b><span>আয়নার সামনে বলো।</span></p>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>কেউ শুনছে না, কেউ বিচার করছে না। ভয়টা ঠিক এখানেই মরে। আজ পাঁচ মিনিট নিজের সাথে
  ইংরেজিতে বলো, আর কাল ছয় মিনিট।</p>
</div>
`,

"the-plan": `
<p>শেষ পর্বে নতুন কিছু শেখানোর নেই। এখানে আছে রুটিন, মানচিত্র আর সেই সাতটা ভুল, যেগুলো
এড়াতে পারলে তুমি অনেকের চেয়ে এগিয়ে থাকবে।</p>

<div class="shape">
  <span class="shape-label mono">The pattern · কাঠামো</span>
  <p class="shape-line" lang="en">10 warm-up · 15 new pattern · 15 speak · 10 listen · 10 words</p>
  <p class="shape-why">দিনে এক ঘণ্টা, এইভাবে ভাগ করা। কম সময় পেলে অনুপাতটা একই রাখো।</p>
  <p class="shape-eg">অন্তত ২৫ মিনিট মুখে বলা, বাকিটা যা খুশি।</p>
  <p class="shape-tip">চুপচাপ পড়লে জ্ঞান হয়, ভাষা হয় না। মুখ না নড়লে সেটা অনুশীলন নয়।</p>
</div>

<h2>তোমার এক ঘণ্টা</h2>

<div class="line-list">
  <p class="line"><b lang="en">10 min · warm-up</b><span>গতকালের বাক্যগুলো জোরে পড়ো।</span></p>
  <p class="line"><b lang="en">15 min · new pattern</b><span>নতুন কাঠামো শেখো, নিজে দশটা বাক্য বানাও।</span></p>
  <p class="line"><b lang="en">15 min · speak</b><span>ছবি বর্ণনা করো, বা দিনের গল্প বলো।</span></p>
  <p class="line"><b lang="en">10 min · listen</b><span>ধীর ইংরেজি ভিডিও শোনো, প্রতিটা লাইন নকল করো।</span></p>
  <p class="line"><b lang="en">10 min · words</b><span>শব্দভাণ্ডার, শুধু এইটুকু, এর বেশি নয়।</span></p>
</div>

<h2>ত্রিশ দিনের মানচিত্র</h2>

<div class="table-scroll">
<table>
  <thead>
    <tr><th>দিন</th><th>কী শিখবে</th><th>দিন শেষে যা পারবে</th></tr>
  </thead>
  <tbody>
    <tr><td>১–৪</td><td lang="en">Word order + I am / You are</td><td>নিজের পরিচয় ও অনুভূতি বলা</td></tr>
    <tr><td>৫–৮</td><td lang="en">have / has, don't have</td><td>পরিবার ও জিনিসের কথা</td></tr>
    <tr><td>৯–১৩</td><td lang="en">Daily verbs, -s, don't / doesn't</td><td>রোজকার অভ্যাস বলা</td></tr>
    <tr><td>১৪–১৬</td><td lang="en">am / is / are + -ing</td><td>এখন যা ঘটছে বলা</td></tr>
    <tr><td>১৭–২১</td><td lang="en">Past: was / were, -ed, 20 rebels</td><td>কালকের গল্প বলা</td></tr>
    <tr><td>২২–২৪</td><td lang="en">will / going to</td><td>ভবিষ্যতের পরিকল্পনা বলা</td></tr>
    <tr><td>২৫–২৭</td><td lang="en">can · want to · have to · should</td><td>ভদ্রভাবে চাওয়া ও পরামর্শ</td></tr>
    <tr><td>২৮–৩০</td><td lang="en">Question words + free speaking</td><td>পাঁচ মিনিট সত্যিকারের কথোপকথন</td></tr>
  </tbody>
</table>
</div>

<p>প্রতিটা দিনের কাজ একই: একটা কাঠামো, কুড়িবার মুখে বদল, আর নিজের জীবন নিয়ে একটা সত্যি
অনুচ্ছেদ। এই ত্রিশ দিনের পাতা ধরে ধরে সাজানো আছে
<a href="/english/term-1/workbook.html">অনুশীলন খাতায়</a>।</p>

<h2>সাত ভুল আর তার ওষুধ</h2>

<div class="table-scroll">
<table>
  <thead>
    <tr><th>যা বলে ফেলবে</th><th>যেটা ঠিক</th><th>কারণ</th></tr>
  </thead>
  <tbody>
    <tr><td lang="en">I student.</td><td lang="en">I am a student.</td><td>be-শব্দ ছাড়া বাক্য হয় না।</td></tr>
    <tr><td lang="en">She go to school.</td><td lang="en">She goes to school.</td><td>he, she, it হলে -s লাগে।</td></tr>
    <tr><td lang="en">I don't knows.</td><td lang="en">I don't know.</td><td>don't এলে -s চলে যায়।</td></tr>
    <tr><td lang="en">Did you went?</td><td lang="en">Did you go?</td><td>did নিজেই অতীত বহন করে।</td></tr>
    <tr><td lang="en">I eating rice.</td><td lang="en">I am eating rice.</td><td>-ing এর আগে be লাগবেই।</td></tr>
    <tr><td lang="en">He can to swim.</td><td lang="en">He can swim.</td><td>can-এর পরে 'to' বসে না।</td></tr>
    <tr><td>(চুপ করে থাকা)</td><td lang="en">Sorry, I don't understand. Please repeat.</td><td>চুপ থাকাই সবচেয়ে বড় ভুল।</td></tr>
  </tbody>
</table>
</div>

<div class="mone">
  <p>এই সাত লাইন কাগজে লিখে দেয়ালে টাঙিয়ে রাখো। সপ্তাহে একবার পড়ো। ছয় সপ্তাহ পরে আর
  পড়তে হবে না।</p>
</div>

<div class="bolo">
  <span class="bolo-label">মুখে বলো</span>
  <p>কাল নিখুঁত ইংরেজির চেয়ে আজকের ভাঙা ইংরেজি অনেক বেশি দামি। পৃথিবীর প্রতিটা ফ্লুয়েন্ট
  মানুষ একদিন ঠিক তোমার জায়গায় ছিল: ভুল বলেছে, তবু বলেছে। এখন এই পাতাটা বন্ধ করো আর
  একটা বাক্য জোরে বলো। যেকোনো বাক্য।</p>
</div>
`,

};
