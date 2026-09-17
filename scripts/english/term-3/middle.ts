/* ============================================================
   টার্ম ৩, মাঝারি: খেলা গড়া. Parts 11 to 18.

   The second rung EXPANDS the first: every part here names the
   basic part it stands on, so a reader who is lost knows where
   to go back to. Same people, same house rules as `basic.ts`.
   ============================================================ */

import { mount, type Written } from "../shape.ts";

export const LESSONS: Written = {

/* ---------------------------------------------------------- */
"perfect": {
  bn: `
<p>পর্ব ৭-এর টাইম মেশিনে বারোটা ঘর ছিল, আর আমরা ছয়টায় ঢুকেছিলাম। বাকি ছয়টার চাবি একটা শব্দ: <span lang="en">have</span>। <span lang="en">have + ক্রিয়ার তৃতীয় রূপ</span>, আর একটা কাল তৈরি যেটার নাম <span lang="en">perfect</span>। বাংলায় এর আলাদা রূপ নেই বলেই বাংলাভাষীরা এটা এড়িয়ে যায়, আর ঠিক এই কারণেই এটা শিখলে ইংরেজি হঠাৎ "শিক্ষিত" শোনায়।</p>

<p><span lang="en">perfect</span> মানে "নিখুঁত" নয়। এখানে মানে "শেষ হয়েছে, আর তার ছাপ এখনো আছে"। <span lang="en">I have eaten</span>: খেয়েছি, তাই এখন ক্ষুধা নেই। <span lang="en">I ate</span>: খেয়েছিলাম, একটা অতীত ঘটনা, ব্যস। একটা সেতু, একটা দ্বীপ।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ক্রিয়ার তিন রূপ: <span lang="en">eat, ate, eaten</span>। তৃতীয়টার নাম V3 বা <span lang="en">past participle</span>। perfect-এ সবসময় V3।</li>
<li><span lang="en">present perfect: have/has + V3</span>। অতীতে শুরু, এখনের সাথে যোগ। <span lang="en">I have finished.</span></li>
<li><span lang="en">past perfect: had + V3</span>। অতীতের আগের অতীত। <span lang="en">I had finished before he came.</span></li>
<li><span lang="en">future perfect: will have + V3</span>। ভবিষ্যতের একটা সময়ের আগেই শেষ। <span lang="en">I will have finished by five.</span></li>
<li>সাথে যে শব্দগুলো থাকে: <span lang="en">already, yet, just, ever, never, since, for</span>।</li>
</ul>
</div>

${mount("perfect-pattern")}

<h2>present perfect: সেতু-কাল</h2>

<p>তিনটা কাজে লাগে, আর তিনটাই "এখনের সাথে যোগ"।</p>

<ol class="step-list">
<li><strong>এইমাত্র হলো, ফল এখনো আছে।</strong> <span lang="en">Rafi has broken the window.</span> জানালা এখনো ভাঙা। <span lang="en">I have lost my keys.</span> এখনো পাচ্ছি না। সাথে <span lang="en">just, already, yet</span>: <span lang="en">She has just left. I have already eaten. Have you finished yet?</span></li>
<li><strong>জীবনের অভিজ্ঞতা, কবে তা বলা নেই।</strong> <span lang="en">I have seen the Taj Mahal.</span> কবে, সেটা বলছি না, শুধু যে দেখেছি। সাথে <span lang="en">ever, never</span>: <span lang="en">Have you ever met Shakib? I have never been to Sylhet.</span></li>
<li><strong>অতীতে শুরু, এখনো চলছে।</strong> <span lang="en">Nanu has lived in this house for forty years.</span> এখনো থাকেন। <span lang="en">since</span> + শুরুর বিন্দু, <span lang="en">for</span> + কতক্ষণ: <span lang="en">since 1985, for forty years</span>।</li>
</ol>

<p>সবচেয়ে বড় নিয়ম: <strong>শেষ হয়ে যাওয়া সময়ের শব্দের সাথে present perfect বসে না।</strong> <span lang="en">yesterday, last week, in 2007, ago</span> দেখলে past simple। <span lang="en">I have seen him yesterday</span> ভুল, <span lang="en">I saw him yesterday</span> ঠিক। সময়টা বন্ধ হয়ে গেলে দ্বীপ, খোলা থাকলে সেতু।</p>

${mount("perfect-lines")}

<h2>past perfect: অতীতের আগের অতীত</h2>

<p>নানুর গল্পে দুটো অতীত থাকে: <span lang="en">When the prince arrived, the princess had already left.</span> রাজপুত্র এল (অতীত), তার আগেই রাজকন্যা চলে গিয়েছিল (আরও আগের অতীত)। আগেরটা <span lang="en">had + V3</span>। এটা তখনই লাগে যখন দুটো অতীত ঘটনার ক্রম বোঝাতে হয়। একটা অতীত ঘটনা একা থাকলে শুধু past simple।</p>

<p>রাফির ম্যাচ: <span lang="en">By the time I reached the stadium, the match had started.</span> পৌঁছানোর আগেই শুরু। <span lang="en">He was sad because he had missed the first over.</span> মিস করা আগে, দুঃখ পরে।</p>

<h2>future perfect: আগেই শেষ হয়ে যাবে</h2>

<p>ভবিষ্যতের একটা বিন্দুর আগে কাজটা শেষ। <span lang="en">By 2030, Mitu will have become a doctor.</span> <span lang="en">By the time you come, I will have cooked dinner.</span> সাথে প্রায় সবসময় <span lang="en">by</span>: <span lang="en">by five, by next year, by the time</span>। পরীক্ষায় কম আসে, জীবনে ভবিষ্যৎ পরিকল্পনায় বেশি।</p>

<h2>perfect continuous: কতক্ষণ ধরে</h2>

<p><span lang="en">have been + -ing</span>। কাজটা চলছিল, এখনো চলছে, আর জোরটা "কতক্ষণ ধরে"-তে। <span lang="en">Mitu has been studying for three hours.</span> তিন ঘণ্টা ধরে, এখনো। <span lang="en">It has been raining since morning.</span> সকাল থেকে, এখনো। past-এ <span lang="en">had been -ing</span>: <span lang="en">He had been waiting for an hour when the bus came.</span></p>

${mount("perfect-gap")}

<div class="ex"><b>Harry Potter-এর প্রথম বইয়ের প্রথম লাইনের কাছাকাছি:</b> <span lang="en">The Dursleys had everything they wanted, but they also had a secret.</span> এটা past simple, দ্বীপ। কিন্তু Hagrid যখন আসে: <span lang="en">Harry had never received a letter in his life.</span> চিঠিটা আসার আগের পুরো জীবন: past perfect। আর Harry নিজে: <span lang="en">I have never been to a wizard school.</span> জীবনের অভিজ্ঞতা, এখন পর্যন্ত: present perfect।</div>

${mount("perfect-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Right form</span>-এ perfect চেনার শব্দ: <span lang="en">already, yet, just, ever, never, since, for, so far, recently</span> দেখলে <span lang="en">have/has + V3</span>। <span lang="en">before, after, by the time, when</span>-এর সাথে দুটো অতীত থাকলে আগেরটায় <span lang="en">had + V3</span>। <span lang="en">by + ভবিষ্যৎ সময়</span> দেখলে <span lang="en">will have + V3</span>। আর সবচেয়ে বড় কৌশল: বন্ধনীর ক্রিয়ার V3 রূপটা জানা। <span lang="en">go, went, gone; see, saw, seen; write, wrote, written; take, took, taken</span>। খাতার শেষে ত্রিশটা রেবেল তিন রূপে টুকে রাখো।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">since</span> আর <span lang="en">for</span>। <span lang="en">since</span>-এর পরে শুরুর বিন্দু: <span lang="en">since Monday, since 2020, since morning</span>। <span lang="en">for</span>-এর পরে সময়ের দৈর্ঘ্য: <span lang="en">for two days, for a week, for ages</span>। <span lang="en">since two days</span> ভুল, বাংলার "দুই দিন থেকে"-র সরাসরি অনুবাদ। ইংরেজিতে <span lang="en">for two days</span>।</p>
</div>

${mount("perfect-drill")}
`,
  blocks: {
    "perfect-pattern": {
      kind: "pattern",
      title: { bn: "have-এর তিন সেতু", en: "The three bridges of have" },
      shape: "have / has + V3  ·  had + V3  ·  will have + V3",
      why: { bn: "একই মেশিন তিন সময়ে। have-এর কালটা বলে সেতুটা কোথায় দাঁড়িয়ে: এখন (have), অতীতে (had), ভবিষ্যতে (will have)। V3 কখনো বদলায় না।", en: "One machine in three times. The tense of have says where the bridge stands: now (have), in the past (had), in the future (will have). V3 never changes." },
      examples: [
        { target: "I have finished my homework.", bn: "আমি আমার হোমওয়ার্ক শেষ করেছি। (এখন মুক্ত)" },
        { target: "I had finished my homework before dinner.", bn: "রাতের খাবারের আগেই আমি হোমওয়ার্ক শেষ করেছিলাম।" },
        { target: "I will have finished my homework by nine.", bn: "নয়টার মধ্যে আমি হোমওয়ার্ক শেষ করে ফেলব।" },
        { target: "Nanu has lived here since 1985.", bn: "নানু ১৯৮৫ থেকে এখানে থাকেন।" },
        { target: "Have you ever seen a live match?", bn: "তুমি কি কখনো মাঠে বসে ম্যাচ দেখেছ?" },
      ],
      tip: { bn: "yesterday, ago, last week: সময় বন্ধ, তাই সেতু নয়, দ্বীপ। past simple।", en: "Yesterday, ago, last week: the time is closed, so no bridge, an island. Past simple." },
    },
    "perfect-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: সেতু আর দ্বীপ", en: "Listen, say: the bridge and the island" },
      note: { bn: "প্রতিটা জোড়ায় একই কাজ: একবার এখনের সাথে যোগ, একবার শেষ হয়ে যাওয়া সময়ে।", en: "Each pair is the same action: once joined to now, once in a finished time." },
      lines: [
        { target: "I have lost my pen. I lost my pen yesterday.", bn: "আমি কলমটা হারিয়ে ফেলেছি (এখনো নেই)। আমি কাল কলমটা হারিয়েছিলাম।" },
        { target: "She has visited Cox's Bazar twice. She visited it in 2022.", bn: "সে দুবার কক্সবাজার গেছে। সে ২০২২-এ গিয়েছিল।" },
        { target: "Rafi has just scored fifty. He scored fifty last week too.", bn: "রাফি এইমাত্র পঞ্চাশ করল। গত সপ্তাহেও করেছিল।" },
        { target: "We have known each other for ten years.", bn: "আমরা দশ বছর ধরে একে অপরকে চিনি।" },
        { target: "Have you eaten yet? No, not yet.", bn: "খেয়েছ? না, এখনো না।" },
      ],
    },
    "perfect-gap": {
      kind: "gap",
      title: { bn: "কোন সেতু, নাকি দ্বীপ", en: "Which bridge, or the island" },
      items: [
        { text: "Mitu ___ her homework already.", bn: "মিতু এরই মধ্যে হোমওয়ার্ক শেষ করে ফেলেছে।", options: ["finished", "has finished", "had finished"], right: 1, why: { bn: "already, আর ফলটা এখন: has finished।", en: "Already, with the result now: has finished." } },
        { text: "Bangladesh ___ the World Cup match in 2007.", bn: "বাংলাদেশ ২০০৭-এ বিশ্বকাপের ম্যাচটা জিতেছিল।", options: ["has won", "won", "had won"], right: 1, why: { bn: "in 2007: বন্ধ সময়, দ্বীপ। past simple: won।", en: "In 2007 is a closed time, an island. Past simple: won." } },
        { text: "When we arrived, the film ___.", bn: "আমরা যখন পৌঁছালাম, সিনেমাটা শুরু হয়ে গিয়েছিল।", options: ["started", "has started", "had started"], right: 2, why: { bn: "দুটো অতীত, আর শুরুটা আগে: had started।", en: "Two pasts, and the start came first: had started." } },
        { text: "Nanu ___ in this house since 1985.", bn: "নানু ১৯৮৫ থেকে এই বাড়িতে থাকেন।", options: ["lives", "has lived", "lived"], right: 1, why: { bn: "since, আর এখনো থাকেন: has lived। শুরু অতীতে, চলছে এখনো।", en: "Since, and she still lives there: has lived. Started in the past, still going." } },
        { text: "By next June, Rafi ___ fifteen.", bn: "আগামী জুনের মধ্যে রাফির পনেরো হয়ে যাবে।", options: ["will turn", "will have turned", "has turned"], right: 1, why: { bn: "by + ভবিষ্যৎ: ওই সময়ের আগেই শেষ, will have turned।", en: "By + a future time: finished before that point, will have turned." } },
        { text: "It ___ since morning, and it is still raining.", bn: "সকাল থেকে বৃষ্টি হচ্ছে, আর এখনো হচ্ছে।", options: ["rains", "has been raining", "rained"], right: 1, why: { bn: "কতক্ষণ ধরে, এখনো চলছে: has been raining।", en: "How long, and still going: has been raining." } },
      ],
    },
    "perfect-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "I have seen that film last night. কী ভুল?", en: "I have seen that film last night. What is wrong?" },
          options: [
            { text: { bn: "seen ভুল, see হবে", en: "Seen is wrong; it should be see" }, why: { bn: "না। have-এর পরে V3 ঠিক আছে। সমস্যা অন্য জায়গায়।", en: "No. V3 after have is right. The problem is elsewhere." } },
            { text: { bn: "last night বন্ধ সময়, তাই have seen নয়, saw", en: "Last night is a closed time, so not have seen but saw" }, right: true, why: { bn: "হ্যাঁ। শেষ হয়ে যাওয়া সময়ের শব্দের সাথে present perfect বসে না। I saw that film last night.", en: "Yes. Present perfect never sits with a finished time word. I saw that film last night." } },
            { text: { bn: "কিছুই ভুল নেই", en: "Nothing is wrong" }, why: { bn: "না। last night আর have seen একসাথে বসে না। দ্বীপে সেতু বানানো যায় না।", en: "No. Last night and have seen cannot share a sentence. You cannot build a bridge on an island." } },
          ],
        },
        {
          ask: { bn: "The patient ___ before the doctor came. কোনটা?", en: "The patient ___ before the doctor came. Which?" },
          options: [
            { text: { bn: "died", en: "died" }, why: { bn: "না। দুটো অতীত, আর মারা যাওয়াটা আগে। আগেরটায় had লাগে।", en: "No. Two pasts, and the dying came first. The earlier one needs had." } },
            { text: { bn: "had died", en: "had died" }, right: true, why: { bn: "হ্যাঁ। before দিয়ে ক্রম বলা: আগেরটা had + V3।", en: "Yes. Before gives the order: the earlier one is had + V3." } },
            { text: { bn: "has died", en: "has died" }, why: { bn: "না। came অতীত, তাই সেতুটা এখনের সাথে নয়, আরও পিছনের অতীতের সাথে: had।", en: "No. Came is past, so the bridge joins a further past, not now: had." } },
          ],
        },
      ],
    },
    "perfect-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "আজ এখন পর্যন্ত যা করেছ, পাঁচটা have + V3: I have eaten. I have read…", en: "What you have done so far today, five with have + V3: I have eaten. I have read…" } },
        { text: { bn: "জীবনে যা করেছ আর করোনি, তিনটা করে: I have never… I have already…", en: "Things you have and have not done in your life, three each: I have never… I have already…" } },
        { text: { bn: "দশটা রেবেল তিন রূপে, জোরে: go went gone, see saw seen, eat ate eaten…", en: "Ten rebels in three forms, aloud: go went gone, see saw seen, eat ate eaten…" } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"modals": {
  bn: `
<p>পর্ব ১-এর দলে একদল খেলোয়াড় ছিল যাদের আলাদা করে নাম বলা হয়নি: <span lang="en">can, could, may, might, must, should, will, would</span>। এরা ক্রিয়া, কিন্তু একা কিছু করে না। একটা মূল ক্রিয়ার সামনে দাঁড়িয়ে তার মানে বদলে দেয়: পারা, লাগা, উচিত, হতে পারে, অনুমতি। এদের নাম <span lang="en">modal verb</span>, আর তানভীর ভাই এদের ডাকে "শক্তির শব্দ", কারণ একটা শব্দ বদলালেই অনুরোধ হয়ে যায় হুকুম।</p>

<p>পর্ব ৬-এর টুপির নিয়ম মনে আছে? modal-দের একটা মজা: <strong>এরা কখনো টুপি পরে না, আর এদের পরের ক্রিয়াও পরে না।</strong> <span lang="en">She can swim.</span> <span lang="en">She cans</span> নয়, <span lang="en">can swims</span> নয়। কর্তা যেই হোক, দুটো শব্দই খালি।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>modal + খালি ক্রিয়া, সবসময়। <span lang="en">must go, should eat, can play</span>। কোনো <span lang="en">to</span> নয়, কোনো <span lang="en">-s</span> নয়।</li>
<li><span lang="en">can / could</span>: পারা, আর অনুরোধ। <span lang="en">may / might</span>: হতে পারে, অনুমতি।</li>
<li><span lang="en">must / have to</span>: লাগবেই। <span lang="en">should</span>: উচিত। <span lang="en">would</span>: ভদ্র অনুরোধ, কল্পনা।</li>
<li>না-বাচক: modal + <span lang="en">not</span>। <span lang="en">cannot, must not, should not</span>। প্রশ্ন: modal আগে। <span lang="en">Can you…? Should I…?</span></li>
<li><span lang="en">must not</span> মানে নিষেধ, কিন্তু <span lang="en">don't have to</span> মানে দরকার নেই। দুটো উল্টো।</li>
</ul>
</div>

${mount("modals-pattern")}

<h2>নিশ্চয়তার সিঁড়ি</h2>

<p>রাফি জানালা দিয়ে দেখে মাঠ ভেজা। কতটা নিশ্চিত যে বৃষ্টি হয়েছে, সেটা একটা modal-এ বলা যায়।</p>

<div class="table-scroll">
<table>
<thead><tr><th>modal</th><th>কতটা নিশ্চিত</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">must</span></td><td>প্রায় ১০০%: নিশ্চয়ই</td><td><span lang="en">The ground is wet. It must have rained.</span></td></tr>
<tr><td><span lang="en">will</span></td><td>নিশ্চিত ভবিষ্যৎ</td><td><span lang="en">It will rain tonight.</span></td></tr>
<tr><td><span lang="en">should</span></td><td>হওয়ার কথা</td><td><span lang="en">The bus should be here by now.</span></td></tr>
<tr><td><span lang="en">may</span></td><td>৫০%: হতে পারে</td><td><span lang="en">It may rain later.</span></td></tr>
<tr><td><span lang="en">might / could</span></td><td>৩০%: হতেও পারে</td><td><span lang="en">It might rain, who knows.</span></td></tr>
<tr><td><span lang="en">can't</span></td><td>০%: অসম্ভব</td><td><span lang="en">That can't be Shakib, he is in Dubai.</span></td></tr>
</tbody>
</table>
</div>

<h2>পারা: can, could, be able to</h2>

<p><span lang="en">can</span> বর্তমানের ক্ষমতা: <span lang="en">Rafi can bowl.</span> <span lang="en">could</span> অতীতের ক্ষমতা: <span lang="en">Nanu could climb trees when she was young.</span> ভবিষ্যতে আর perfect-এ <span lang="en">can</span> চলে না, তখন <span lang="en">be able to</span>: <span lang="en">You will be able to drive next year. I have been able to swim since I was five.</span> অনুরোধে <span lang="en">could</span> বেশি ভদ্র: <span lang="en">Can you help? Could you help me, please?</span></p>

<h2>লাগবেই: must, have to, should</h2>

<p><span lang="en">must</span> ভিতর থেকে, নিজের সিদ্ধান্ত বা জোরালো নিয়ম: <span lang="en">I must study tonight.</span> <span lang="en">have to</span> বাইরে থেকে, কারও নিয়ম: <span lang="en">I have to wear a uniform.</span> স্কুল বলেছে। <span lang="en">should</span> উপদেশ, উচিত: <span lang="en">You should sleep early before an exam.</span> অতীতে আফসোস: <span lang="en">I should have studied more.</span> করা উচিত ছিল, করিনি।</p>

<p>আর সেই ফাঁদ যেটা পরীক্ষায় বারবার আসে: <span lang="en">must not</span> মানে করা <em>নিষেধ</em>: <span lang="en">You must not cheat.</span> কিন্তু <span lang="en">don't have to</span> মানে করা <em>দরকার নেই</em>, ইচ্ছে হলে করতে পারো: <span lang="en">You don't have to come; it's optional.</span> বাংলায় দুটোই "করতে হবে না"-র কাছাকাছি শোনায়, ইংরেজিতে দুটো দুই মেরু।</p>

${mount("modals-lines")}

<h2>অনুমতি আর ভদ্রতা: may, would, shall</h2>

<p><span lang="en">May I come in, Sir?</span> সবচেয়ে ভদ্র অনুমতি। <span lang="en">Can I come in?</span> সাধারণ। <span lang="en">Would you like some tea?</span> ভদ্র প্রস্তাব, <span lang="en">Do you want</span>-এর চেয়ে নরম। <span lang="en">Would you mind closing the door?</span> সবচেয়ে ভদ্র অনুরোধ, আর উত্তরটা উল্টো: <span lang="en">No, not at all</span> মানে হ্যাঁ, বন্ধ করছি। <span lang="en">Shall we go?</span> প্রস্তাব, চলো যাই।</p>

<div class="ex"><b>Star Wars-এর লাইনটা:</b> <span lang="en">May the Force be with you.</span> এটা অনুমতি নয়, প্রার্থনা: <span lang="en">may</span> দিয়ে শুভকামনা। <span lang="en">May you live long.</span> আর Yoda বলে, <span lang="en">Do or do not. There is no try.</span> কোনো modal নেই, তাই এত কড়া শোনায়। Yoda যদি বলত <span lang="en">You should try</span>, সিনেমাটা অন্য রকম হতো।</div>

${mount("modals-gap")}

<h2>অতীতে modal: modal + have + V3</h2>

<p>অতীত নিয়ে অনুমান বা আফসোস করতে <span lang="en">modal + have + V3</span>। <span lang="en">She must have left</span>: নিশ্চয়ই চলে গেছে। <span lang="en">He might have missed the bus</span>: হয়তো বাস মিস করেছে। <span lang="en">You should have called me</span>: ফোন করা উচিত ছিল। <span lang="en">I could have scored a century</span>: করতে পারতাম, করিনি। ক্রিকেটের সব আফসোস এই ছাঁচে: <span lang="en">We could have won.</span></p>

${mount("modals-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>modal-এর পরে বন্ধনীতে যে ক্রিয়াই থাকুক, উত্তর তার খালি রূপ। <span lang="en">She can (swim)</span>: <span lang="en">swim</span>। কোনো <span lang="en">-s, -ed, -ing, to</span> নয়। একমাত্র ব্যতিক্রম: অতীত নিয়ে বললে <span lang="en">have + V3</span>: <span lang="en">She must have (go)</span>: <span lang="en">gone</span>। বন্ধনীর ক্রিয়ার আগে <span lang="en">have</span> থাকলে V3, নইলে খালি।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">can</span>-এর সাথে কখনো <span lang="en">to</span> নয়: <span lang="en">I can to swim</span> ভুল। কিন্তু <span lang="en">be able to</span> আর <span lang="en">have to</span>-তে <span lang="en">to</span> আছে, কারণ ওগুলো আসল modal নয়, modal-এর কাজ করা ছাঁচ। <span lang="en">I am able to swim. I have to go.</span> তালিকাটা মনে রাখো: আসল modal নয়টা, <span lang="en">can, could, may, might, must, shall, should, will, would</span>, আর এদের কারও পরে <span lang="en">to</span> নেই।</p>
</div>

${mount("modals-drill")}
`,
  blocks: {
    "modals-pattern": {
      kind: "pattern",
      title: { bn: "modal + খালি ক্রিয়া", en: "Modal + bare verb" },
      shape: "WHO + can / must / should / may / might + VERB (খালি)",
      why: { bn: "modal-এর পরে ক্রিয়া সবসময় খালি: to নয়, -s নয়, -ing নয়। কর্তা যেই হোক। একটা modal বদলালেই মানেটা পারা থেকে লাগা থেকে উচিত-এ চলে যায়, ক্রিয়া একই থাকে।", en: "After a modal the verb is always bare: no to, no -s, no -ing, whoever the subject is. Change the modal and the meaning slides from can to must to should while the verb stays put." },
      examples: [
        { target: "Rafi can bowl fast.", bn: "রাফি জোরে বল করতে পারে। (ক্ষমতা)" },
        { target: "Rafi must practise every day.", bn: "রাফিকে রোজ অনুশীলন করতেই হবে। (বাধ্যতা)" },
        { target: "Rafi should sleep early.", bn: "রাফির তাড়াতাড়ি ঘুমানো উচিত। (উপদেশ)" },
        { target: "Rafi may play in the final.", bn: "রাফি হয়তো ফাইনালে খেলবে। (সম্ভাবনা)" },
        { target: "Could you pass the ball, please?", bn: "বলটা একটু দেবে? (ভদ্র অনুরোধ)" },
      ],
      tip: { bn: "must not = নিষেধ। don't have to = দরকার নেই। এই একটা জোড়া পরীক্ষায় প্রতি বছর।", en: "Must not forbids; don't have to means no need. This one pair comes up every year." },
    },
    "modals-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: একই কথা, ভদ্রতার সিঁড়ি", en: "Listen, say: one request, up the ladder of politeness" },
      lines: [
        { target: "Give me the salt.", bn: "লবণ দাও। (হুকুম)" },
        { target: "Can you give me the salt?", bn: "লবণটা দিতে পারো? (সাধারণ)" },
        { target: "Could you give me the salt, please?", bn: "লবণটা একটু দেবেন? (ভদ্র)" },
        { target: "Would you mind passing the salt?", bn: "লবণটা এগিয়ে দিতে কি আপত্তি আছে? (সবচেয়ে ভদ্র)" },
        { target: "May I have the salt, please?", bn: "আমি কি লবণটা পেতে পারি? (আনুষ্ঠানিক)" },
      ],
    },
    "modals-gap": {
      kind: "gap",
      title: { bn: "কোন শক্তির শব্দ", en: "Which power word" },
      items: [
        { text: "You ___ wear a helmet while batting. It is the rule.", bn: "ব্যাট করার সময় তোমাকে হেলমেট পরতেই হবে। এটা নিয়ম।", options: ["can", "must", "might"], right: 1, why: { bn: "নিয়ম, বাধ্যতা: must।", en: "A rule, an obligation: must." } },
        { text: "It is a holiday. You ___ go to school.", bn: "ছুটি। তোমার স্কুলে যাওয়ার দরকার নেই।", options: ["must not", "don't have to", "should not"], right: 1, why: { bn: "দরকার নেই, নিষেধ নয়: don't have to। must not হলে যাওয়া মানা।", en: "No need, not a ban: don't have to. Must not would forbid going." } },
        { text: "Nanu ___ climb trees when she was a girl.", bn: "নানু ছোটবেলায় গাছে চড়তে পারতেন।", options: ["can", "could", "may"], right: 1, why: { bn: "অতীতের ক্ষমতা: could।", en: "Ability in the past: could." } },
        { text: "The ground is wet. It ___ have rained last night.", bn: "মাঠ ভেজা। কাল রাতে নিশ্চয়ই বৃষ্টি হয়েছে।", options: ["must", "can", "should"], right: 0, why: { bn: "প্রমাণ দেখে প্রায় নিশ্চিত অনুমান: must have + V3।", en: "A near-certain guess from evidence: must have + V3." } },
        { text: "She ___ swim, so she wears a life jacket.", bn: "সে সাঁতার পারে না, তাই লাইফ জ্যাকেট পরে।", options: ["cannot", "must not", "may not"], right: 0, why: { bn: "ক্ষমতা নেই: cannot। এক শব্দে লেখা হয়।", en: "No ability: cannot, written as one word." } },
        { text: "You ___ have told me. I waited for an hour!", bn: "তোমার আমাকে বলা উচিত ছিল। আমি এক ঘণ্টা অপেক্ষা করেছি!", options: ["should", "can", "may"], right: 0, why: { bn: "অতীতের আফসোস, করা উচিত ছিল: should have + V3।", en: "Regret about the past, what ought to have happened: should have + V3." } },
      ],
    },
    "modals-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "কোনটা ঠিক?", en: "Which is right?" },
          options: [
            { text: { bn: "She can sings well.", en: "She can sings well." }, why: { bn: "না। modal-এর পরে খালি ক্রিয়া, টুপি নেই: can sing।", en: "No. After a modal the verb is bare, no hat: can sing." } },
            { text: { bn: "She can to sing well.", en: "She can to sing well." }, why: { bn: "না। আসল modal-এর পরে কখনো to নয়।", en: "No. A true modal never takes to." } },
            { text: { bn: "She can sing well.", en: "She can sing well." }, right: true, why: { bn: "হ্যাঁ। can + খালি ক্রিয়া।", en: "Yes. Can + bare verb." } },
          ],
        },
        {
          ask: { bn: "Would you mind opening the window? এর ভদ্র 'হ্যাঁ' উত্তর কোনটা?", en: "Would you mind opening the window? Which is the polite yes?" },
          options: [
            { text: { bn: "Yes, I would.", en: "Yes, I would." }, why: { bn: "না। এর মানে 'হ্যাঁ, আমার আপত্তি আছে', মানে খুলব না।", en: "No. That means yes, I do mind, so the window stays shut." } },
            { text: { bn: "No, not at all.", en: "No, not at all." }, right: true, why: { bn: "হ্যাঁ। 'আপত্তি নেই', মানে খুলছি। mind-এর প্রশ্নে উত্তরটা উল্টো।", en: "Yes. No objection, so it gets opened. A mind question turns the answer round." } },
            { text: { bn: "Of course not, never.", en: "Of course not, never." }, why: { bn: "না। এটা শুনলে মনে হবে জানালা খুলতে রাজি না, রেগে গেছ।", en: "No. This sounds like an angry refusal." } },
          ],
        },
      ],
    },
    "modals-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "নিজের পাঁচটা ক্ষমতা আর তিনটা অক্ষমতা: I can… I can't…", en: "Five things you can do and three you cannot: I can… I can't…" } },
        { text: { bn: "স্কুলের বা বাসার পাঁচটা নিয়ম must আর must not দিয়ে।", en: "Five rules of school or home with must and must not." } },
        { text: { bn: "একজন বন্ধুকে তিনটা উপদেশ should দিয়ে, আর নিজের একটা আফসোস should have দিয়ে।", en: "Three pieces of advice to a friend with should, and one regret of your own with should have." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"questions": {
  bn: `
<p>যে মানুষ প্রশ্ন করতে পারে, সে যেকোনো জায়গায় যেকোনো কিছু শিখে নিতে পারে। কিন্তু বাংলাভাষীর ইংরেজি প্রশ্নে একটা পুরনো সমস্যা: বাংলায় প্রশ্ন করতে শুধু সুর বদলালেই হয়, "তুমি খেয়েছ?" ইংরেজিতে শব্দ নাড়াতে হয়। পর্ব ১০-এ চার জাতের বাক্যে সেটা এক ঝলক দেখেছ। এই পর্বে পুরো প্রশ্ন-মেশিনটা খুলে দেখা, আর বাক্যের শেষের সেই ছোট্ট লেজ: <span lang="en">isn't it?</span></p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>সাহায্যকারী থাকলে (<span lang="en">be, have, can, will</span>…), তাকে কর্তার আগে নাও: <span lang="en">She is ready. Is she ready?</span></li>
<li>সাহায্যকারী না থাকলে সামনে <span lang="en">do / does / did</span> বসাও, আর মূল ক্রিয়া খালি: <span lang="en">She plays. Does she play?</span></li>
<li>wh-প্রশ্নে wh-শব্দ সবার আগে, তারপর একই মেশিন: <span lang="en">Where does she play?</span></li>
<li>wh-শব্দটা নিজেই কর্তা হলে মেশিন লাগে না: <span lang="en">Who called you?</span></li>
<li>tag question: বাক্য হ্যাঁ হলে লেজ না, বাক্য না হলে লেজ হ্যাঁ। <span lang="en">It is hot, isn't it? It isn't hot, is it?</span></li>
</ul>
</div>

${mount("questions-pattern")}

<h2>প্রথম মেশিন: উল্টে দাও</h2>

<p>বাক্যে যদি আগে থেকেই একটা সাহায্যকারী থাকে, <span lang="en">am, is, are, was, were, have, has, had, can, could, will, would, should, must</span>, তাহলে কাজ একটাই: সাহায্যকারীটা কর্তার আগে নিয়ে যাও। <span lang="en">Rafi is playing. Is Rafi playing? They have eaten. Have they eaten? You can swim. Can you swim?</span> আর কিছুই বদলায় না। শেষে প্রশ্নবোধক।</p>

<h2>দ্বিতীয় মেশিন: do বসাও</h2>

<p>বাক্যে সাহায্যকারী না থাকলে, শুধু একটা সাধারণ ক্রিয়া, তাহলে সামনে একটা <span lang="en">do</span> বসে, আর মূল ক্রিয়া তার টুপি বা <span lang="en">-ed</span> খুলে দেয়। বর্তমানে <span lang="en">do</span>, একজন হলে <span lang="en">does</span>, অতীতে <span lang="en">did</span>। <span lang="en">Rafi plays. Does Rafi play? They played. Did they play? You like tea. Do you like tea?</span> টুপি একটাই: <span lang="en">does</span> পরেছে, তাই <span lang="en">play</span> খালি। <span lang="en">Does he plays?</span> বাংলাভাষীর প্রিয় ভুল, দুই টুপি।</p>

${mount("questions-lines")}

<h2>ছয়টা চাবি: wh-শব্দ</h2>

<p><span lang="en">what</span> (কী), <span lang="en">who</span> (কে), <span lang="en">where</span> (কোথায়), <span lang="en">when</span> (কখন), <span lang="en">why</span> (কেন), <span lang="en">how</span> (কীভাবে)। আর কয়েকটা জোড়া: <span lang="en">which</span> (কোনটা), <span lang="en">whose</span> (কার), <span lang="en">how many</span> (কয়টা), <span lang="en">how much</span> (কতটুকু), <span lang="en">how long</span> (কতক্ষণ), <span lang="en">how often</span> (কত ঘন ঘন)। ছাঁচ: <strong>wh-শব্দ + সাহায্যকারী + কর্তা + ক্রিয়া</strong>। <span lang="en">Where does Rafi play? When did Nanu come? Why are you late? How long have you waited?</span></p>

<p>একটা ব্যতিক্রম, যেটা সহজ করে দেয়: wh-শব্দটা যদি নিজেই কর্তা হয়, মানে প্রশ্নটা "কে করল" বা "কী হলো", তাহলে কোনো মেশিন লাগে না। <span lang="en">Who broke the window?</span> <span lang="en">Who did break</span> নয়। <span lang="en">What happened?</span> <span lang="en">What did happen</span> নয়। কর্তার জায়গায় wh-শব্দ বসিয়ে বাকি বাক্য যেমন ছিল তেমন।</p>

${mount("questions-gap")}

<h2>লেজের প্রশ্ন: tag question</h2>

<p>মিতু আপু বলে, এটা পরীক্ষায় প্রতি বছর আসে, আর জীবনে প্রতি দিন। ইংরেজিতে কথার শেষে একটা ছোট প্রশ্ন জুড়ে দেওয়া হয় সম্মতি চাইতে: "তাই না?" নিয়ম দুটো, আর দুটোই মেশিনের মতো:</p>

<ol class="step-list">
<li><strong>উল্টো:</strong> বাক্য হ্যাঁ-বাচক হলে লেজ না-বাচক, বাক্য না-বাচক হলে লেজ হ্যাঁ-বাচক। <span lang="en">It is hot, isn't it? It isn't hot, is it?</span></li>
<li><strong>একই সাহায্যকারী, কর্তা pronoun:</strong> বাক্যে যে সাহায্যকারী, লেজে সেটাই; সাহায্যকারী না থাকলে <span lang="en">do/does/did</span>। কর্তা সবসময় pronoun। <span lang="en">Rafi can bowl, can't he? Nanu tells stories, doesn't she? They went home, didn't they?</span></li>
</ol>

<p>কয়েকটা রেবেল লেজ: <span lang="en">I am late, aren't I?</span> (<span lang="en">amn't</span> বলে কিছু নেই)। <span lang="en">Let's go, shall we?</span> <span lang="en">Open the door, will you?</span> <span lang="en">Nobody came, did they?</span> (<span lang="en">nobody</span> না-বাচক, তাই লেজ হ্যাঁ, আর pronoun <span lang="en">they</span>)। <span lang="en">There is a problem, isn't there?</span></p>

${mount("questions-match")}

<div class="ex"><b>Sherlock-এর ধরন:</b> Sherlock প্রশ্ন করে না, বলে দেয়, তারপর লেজ জোড়ে: <span lang="en">You've been in Afghanistan, haven't you?</span> লেজটা প্রশ্ন নয়, নিশ্চয়তা। সুর নামালে (<span lang="en">haven't you</span> নিচের দিকে) মানে "আমি জানি"; সুর তুললে মানে সত্যিই জিজ্ঞেস করছি। একই লেজ, দুই সুর।</div>

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>tag question-এ চারটা ধাপ, ক্রমে: (১) বাক্যটা হ্যাঁ না না? <span lang="en">not, never, no, nobody, hardly, seldom</span> থাকলে না। (২) সাহায্যকারী কোনটা? না থাকলে কাল দেখে <span lang="en">do/does/did</span>। (৩) কর্তাকে pronoun বানাও: <span lang="en">Rafi</span> হয় <span lang="en">he</span>, <span lang="en">the players</span> হয় <span lang="en">they</span>, <span lang="en">everyone</span> হয় <span lang="en">they</span>, <span lang="en">this</span> হয় <span lang="en">it</span>। (৪) উল্টো করে লেখো, কমা আর প্রশ্নবোধক সহ।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>পরোক্ষ প্রশ্নে মেশিন থামে। <span lang="en">Where is the station?</span> সরাসরি। কিন্তু <span lang="en">Could you tell me where the station is?</span> ভিতরের অংশটা আর প্রশ্নের ক্রমে নয়, সাধারণ বাক্যের ক্রমে: <span lang="en">where the station is</span>, <span lang="en">where is the station</span> নয়। <span lang="en">I don't know what time it is.</span> <span lang="en">Do you know if she has come?</span> বাক্যের ভিতরে প্রশ্ন ঢুকলে সে ভদ্র হয়ে সোজা হয়ে বসে।</p>
</div>

${mount("questions-drill")}
`,
  blocks: {
    "questions-pattern": {
      kind: "pattern",
      title: { bn: "প্রশ্ন-মেশিনের চার খোপ", en: "The four slots of the question machine" },
      shape: "(Wh-) + HELPER + WHO + VERB … ?",
      why: { bn: "সাহায্যকারী কর্তার আগে চলে যায়। যেখানে সাহায্যকারী নেই, do এসে সেই জায়গা নেয়। wh-শব্দ থাকলে সবার আগে। এই একটা ছাঁচে ইংরেজির প্রতিটা প্রশ্ন।", en: "The helper moves in front of the subject. Where there is no helper, do steps in to take the slot. A wh-word goes first of all. Every question in English fits this one shape." },
      examples: [
        { target: "Is Rafi playing today?", bn: "রাফি কি আজ খেলছে? (be উল্টে)" },
        { target: "Does Rafi play on Fridays?", bn: "রাফি কি শুক্রবারে খেলে? (do বসিয়ে)" },
        { target: "Where does Rafi play?", bn: "রাফি কোথায় খেলে? (wh + do)" },
        { target: "Who taught you this?", bn: "কে তোমাকে এটা শেখাল? (who নিজেই কর্তা, মেশিন নেই)" },
        { target: "It is hot today, isn't it?", bn: "আজ গরম, তাই না? (লেজ)" },
      ],
      tip: { bn: "Does he plays? দুই টুপি, ভুল। does টুপি পরলে play খালি।", en: "Does he plays? Two hats, wrong. Once does wears the hat, play goes bare." },
    },
    "questions-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: বলা থেকে প্রশ্ন", en: "Listen, say: statement to question" },
      lines: [
        { target: "She has finished. Has she finished?", bn: "সে শেষ করেছে। সে কি শেষ করেছে?" },
        { target: "They will come. Will they come?", bn: "তারা আসবে। তারা কি আসবে?" },
        { target: "Nanu likes tea. Does Nanu like tea?", bn: "নানু চা পছন্দ করেন। নানু কি চা পছন্দ করেন?" },
        { target: "Rafi went home. Did Rafi go home?", bn: "রাফি বাসায় গেল। রাফি কি বাসায় গেল?" },
        { target: "What time does the match start?", bn: "ম্যাচ কয়টায় শুরু?" },
        { target: "How long have you lived here?", bn: "তুমি কতদিন ধরে এখানে থাকো?" },
      ],
    },
    "questions-gap": {
      kind: "gap",
      title: { bn: "মেশিন চালাও", en: "Run the machine" },
      items: [
        { text: "___ Mitu study at night?", bn: "মিতু কি রাতে পড়ে?", options: ["Do", "Does", "Is"], right: 1, why: { bn: "সাহায্যকারী নেই, একজন, বর্তমান: Does। আর study খালি।", en: "No helper, one person, present: Does, and study stays bare." } },
        { text: "Where ___ you yesterday?", bn: "তুমি কাল কোথায় ছিলে?", options: ["was", "were", "did"], right: 1, why: { bn: "be নিজেই সাহায্যকারী, উল্টে দাও: were you। did লাগে না।", en: "Be is its own helper; just invert: were you. No did needed." } },
        { text: "___ broke the window?", bn: "কে জানালা ভাঙল?", options: ["Who did", "Who", "Did who"], right: 1, why: { bn: "who নিজেই কর্তা, তাই মেশিন নেই: Who broke?", en: "Who is itself the subject, so no machine: Who broke?" } },
        { text: "Rafi can swim, ___?", bn: "রাফি সাঁতার পারে, তাই না?", options: ["can he", "can't he", "doesn't he"], right: 1, why: { bn: "হ্যাঁ-বাচক বাক্য, লেজ না-বাচক, একই সাহায্যকারী: can't he।", en: "A positive sentence takes a negative tag with the same helper: can't he." } },
        { text: "Nanu doesn't like loud music, ___?", bn: "নানু জোরে গান পছন্দ করেন না, তাই না?", options: ["doesn't she", "does she", "isn't she"], right: 1, why: { bn: "না-বাচক বাক্য, লেজ হ্যাঁ-বাচক: does she।", en: "A negative sentence takes a positive tag: does she." } },
        { text: "Could you tell me where ___?", bn: "স্টেশনটা কোথায় বলতে পারবেন?", options: ["is the station", "the station is", "does the station"], right: 1, why: { bn: "পরোক্ষ প্রশ্ন: ভিতরে সাধারণ ক্রম, the station is।", en: "An indirect question keeps normal order inside: the station is." } },
      ],
    },
    "questions-match": {
      kind: "match",
      title: { bn: "লেজ মেলাও", en: "Match the tail" },
      note: { bn: "বাঁয়ের বাক্যের সাথে ডানের ঠিক লেজ।", en: "The sentence on the left with its right tag." },
      pairs: [
        { left: { bn: "I am late,", en: "I am late," }, right: { bn: "aren't I?", en: "aren't I?" } },
        { left: { bn: "Let's start,", en: "Let's start," }, right: { bn: "shall we?", en: "shall we?" } },
        { left: { bn: "Nobody called,", en: "Nobody called," }, right: { bn: "did they?", en: "did they?" } },
        { left: { bn: "Close the door,", en: "Close the door," }, right: { bn: "will you?", en: "will you?" } },
        { left: { bn: "There is a match today,", en: "There is a match today," }, right: { bn: "isn't there?", en: "isn't there?" } },
        { left: { bn: "They have never lost,", en: "They have never lost," }, right: { bn: "have they?", en: "have they?" } },
      ],
    },
    "questions-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "একজন বন্ধুকে ছয়টা wh-প্রশ্ন, ছয় চাবি দিয়ে: What… Who… Where… When… Why… How…", en: "Six wh-questions to a friend, one per key: What… Who… Where… When… Why… How…" } },
        { text: { bn: "পাঁচটা সাধারণ বাক্য বলো আর প্রতিটায় লেজ জোড়ো: It's cold, isn't it?", en: "Say five plain sentences and put a tag on each: It's cold, isn't it?" } },
        { text: { bn: "দোকানে বা রাস্তায় জিজ্ঞেস করার তিনটা ভদ্র পরোক্ষ প্রশ্ন: Could you tell me where…", en: "Three polite indirect questions for a shop or the street: Could you tell me where…" } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"joining": {
  bn: `
<p>রাফির ইংরেজি খাতায় একটা অনুচ্ছেদ: <span lang="en">I like cricket. I play every day. I want to be a fast bowler. I practise hard.</span> সব বাক্য ঠিক। কিন্তু মিতু আপু বলে, শুনতে লাগছে ক্লাস টু-র বাচ্চার মতো। কারণ প্রতিটা বাক্য একা দাঁড়িয়ে আছে, কেউ কারও হাত ধরেনি। ইংরেজিতে বাক্য জোড়ার শব্দগুলোর নাম <span lang="en">conjunction</span>, আর ওগুলো দিলেই: <span lang="en">I like cricket, so I play every day because I want to be a fast bowler, although it is hard.</span> এক বাক্য, চারটা ভাব, একজন বড় লেখক।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>সমান জোড়া (<span lang="en">and, but, or, so</span>): দুটো পুরো বাক্য পাশাপাশি, মাঝে কমা। <span lang="en">Rafi bowled, and Mitu batted.</span></li>
<li>অধীন জোড়া (<span lang="en">because, although, when, if, while, until, since</span>): একটা বাক্য অন্যটার উপর ঝুলে থাকে। এগুলো বাক্যের শুরুতেও বসতে পারে।</li>
<li>অধীন অংশটা আগে বসলে কমা, পরে বসলে সাধারণত কমা নয়। <span lang="en">Although it rained, we played. We played although it rained.</span></li>
<li>জোড়া-জোড়ায়: <span lang="en">both … and, either … or, neither … nor, not only … but also</span>।</li>
<li>একটা বাক্য জোড়ায় একটাই জোড়ার শব্দ: <span lang="en">Although … but</span> ভুল।</li>
</ul>
</div>

${mount("joining-pattern")}

<h2>সমান জোড়া: FANBOYS</h2>

<p>সাতটা ছোট শব্দ যারা দুটো সমান বাক্যকে পাশাপাশি রাখে: <span lang="en">for, and, nor, but, or, yet, so</span>। প্রথম অক্ষর মিলিয়ে <span lang="en">FANBOYS</span>। রোজ লাগে চারটা: <span lang="en">and</span> (যোগ), <span lang="en">but</span> (বিপরীত), <span lang="en">or</span> (বিকল্প), <span lang="en">so</span> (ফল)। দুটো পুরো বাক্য জুড়লে জোড়ার শব্দের আগে একটা কমা: <span lang="en">It rained, so the match stopped.</span> শুধু দুটো শব্দ জুড়লে কমা নয়: <span lang="en">tea and biscuits</span>।</p>

<h2>অধীন জোড়া: কারণ, সময়, শর্ত, বিপরীত</h2>

<p>এই শব্দগুলো একটা বাক্যকে অন্যটার "অধীন" করে দেয়। <span lang="en">because it rained</span> একা দাঁড়াতে পারে না, একটা মূল বাক্য লাগে: <span lang="en">The match stopped because it rained.</span> চার দলে ভাগ:</p>

<div class="table-scroll">
<table>
<thead><tr><th>দল</th><th>শব্দ</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td>কারণ</td><td><span lang="en">because, since, as</span></td><td><span lang="en">Rafi was happy because he scored.</span></td></tr>
<tr><td>সময়</td><td><span lang="en">when, while, before, after, until, as soon as</span></td><td><span lang="en">Call me when you reach home.</span></td></tr>
<tr><td>শর্ত</td><td><span lang="en">if, unless</span></td><td><span lang="en">We will go out if it stops raining.</span></td></tr>
<tr><td>বিপরীত</td><td><span lang="en">although, though, even though, whereas</span></td><td><span lang="en">Although he was tired, he kept bowling.</span></td></tr>
</tbody>
</table>
</div>

<p>এদের সুবিধা: বাক্যের শুরুতেও বসতে পারে, মাঝেও। শুরুতে বসলে অধীন অংশ শেষে একটা কমা: <span lang="en">Because it rained, the match stopped.</span> মাঝে বসলে কমা লাগে না: <span lang="en">The match stopped because it rained.</span> একই কথা, দুই সাজ।</p>

${mount("joining-lines")}

<h2>because নাকি so, although নাকি but</h2>

<p>একই সম্পর্ক দুই দিক থেকে বলা যায়। <span lang="en">because</span> কারণের আগে বসে, <span lang="en">so</span> ফলের আগে: <span lang="en">It rained, so we stayed home. We stayed home because it rained.</span> একটাই ঘটনা। <span lang="en">but</span> আর <span lang="en">although</span> দুটোই বিপরীত, কিন্তু <span lang="en">but</span> মাঝে বসে আর <span lang="en">although</span> যেকোনো জায়গায়: <span lang="en">It rained, but we played. Although it rained, we played.</span> ফাঁদ: দুটো একসাথে নয়। <span lang="en">Although it rained, but we played</span> ভুল। বাংলায় "যদিও … তবুও" দুটোই বসে, তাই বাংলাভাষী এখানে বারবার পড়ে।</p>

${mount("joining-gap")}

<h2>জোড়া-জোড়ার শব্দ</h2>

<p><span lang="en">both Rafi and Mitu</span> (দুজনেই), <span lang="en">either tea or coffee</span> (যেকোনো একটা), <span lang="en">neither Tamim nor Shakib</span> (কেউই না), <span lang="en">not only fast but also accurate</span> (শুধু না, বরং)। ফাঁদ: <span lang="en">neither … nor</span>-এর সাথে আরেকটা <span lang="en">not</span> নয়, কারণ <span lang="en">neither</span> নিজেই না-বাচক। <span lang="en">Neither of them didn't come</span> ভুল; <span lang="en">Neither of them came</span> ঠিক।</p>

<div class="ex"><b>Toy Story-র Buzz:</b> <span lang="en">To infinity and beyond!</span> একটা <span lang="en">and</span>। আর Woody সম্পর্কে: <span lang="en">Woody was Andy's favourite toy until Buzz arrived.</span> <span lang="en">until</span> পুরো সিনেমার গল্প বলে দেয়। Nemo-র বাবা: <span lang="en">I promised I would never let anything happen to him.</span> <span lang="en">that</span> লুকানো, কিন্তু আছে: <span lang="en">I promised (that) I would…</span> বাক্যের ভিতরে বাক্য, পর্ব ১৯-এ পুরোটা।</div>

${mount("joining-order")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Connectors</span> বা <span lang="en">linking words</span>-এর শূন্যস্থানে দুই পাশের বাক্যের সম্পর্ক জিজ্ঞেস করো: কারণ? <span lang="en">because</span>। ফল? <span lang="en">so, therefore</span>। বিপরীত? <span lang="en">but, however, although</span>। যোগ? <span lang="en">and, moreover, besides</span>। সময়? <span lang="en">when, after, before</span>। শর্ত? <span lang="en">if, unless</span>। আর শূন্যস্থান বাক্যের শুরুতে আর পরে কমা থাকলে <span lang="en">However, Moreover, Therefore</span>: বড় হাতে, কমা সহ।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">unless</span> মানে <span lang="en">if … not</span>, তাই পরে আবার <span lang="en">not</span> নয়। <span lang="en">You will fail unless you don't study</span> ভুল, উল্টো মানে। <span lang="en">You will fail unless you study</span> ঠিক: না পড়লে ফেল। আর <span lang="en">until</span> মানে "যতক্ষণ না": <span lang="en">Wait here until I come back.</span></p>
</div>

${mount("joining-drill")}
`,
  blocks: {
    "joining-pattern": {
      kind: "pattern",
      title: { bn: "দুই রকম জোড়া", en: "Two kinds of join" },
      shape: "SENTENCE, and / but / so SENTENCE   ·   Because / Although / When SENTENCE, SENTENCE",
      why: { bn: "and, but, so দুটো সমান বাক্যের মাঝে বসে, আগে কমা। because, although, when একটা বাক্যকে অধীন করে, আর শুরুতে বসলে শেষে কমা। একটা জোড়ায় একটাই জোড়ার শব্দ।", en: "And, but, so sit between two equal sentences with a comma before them. Because, although, when make one sentence depend on the other, and take a comma after the clause when they open. One join, one joining word." },
      examples: [
        { target: "Rafi bowled well, but the team lost.", bn: "রাফি ভালো বল করল, কিন্তু দল হারল।" },
        { target: "It was raining, so we stayed home.", bn: "বৃষ্টি হচ্ছিল, তাই আমরা বাসায় থাকলাম।" },
        { target: "Because it was raining, we stayed home.", bn: "কারণ বৃষ্টি হচ্ছিল, আমরা বাসায় থাকলাম।" },
        { target: "Although he was tired, Rafi kept practising.", bn: "যদিও সে ক্লান্ত ছিল, রাফি অনুশীলন চালিয়ে গেল।" },
        { target: "Call me when you get home.", bn: "বাসায় পৌঁছে আমাকে ফোন কোরো।" },
      ],
      tip: { bn: "Although … but: দুটো একসাথে কখনো নয়। বাংলার 'যদিও … তবুও' ইংরেজিতে একটা শব্দে।", en: "Although … but: never both. Bangla's although … yet is one word in English." },
    },
    "joining-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: একই কথা, দুই সাজে", en: "Listen, say: one idea, two arrangements" },
      lines: [
        { target: "We stayed home because it rained.", bn: "বৃষ্টি হয়েছিল বলে আমরা বাসায় থাকলাম।" },
        { target: "Because it rained, we stayed home.", bn: "কারণ বৃষ্টি হয়েছিল, আমরা বাসায় থাকলাম।" },
        { target: "I will call you when I arrive.", bn: "পৌঁছে আমি তোমাকে ফোন করব।" },
        { target: "When I arrive, I will call you.", bn: "আমি যখন পৌঁছাব, তোমাকে ফোন করব।" },
        { target: "Nanu is old, yet she walks every morning.", bn: "নানু বয়স্ক, তবু রোজ সকালে হাঁটেন।" },
        { target: "You can have either tea or coffee, not both.", bn: "তুমি চা বা কফি যেকোনো একটা পেতে পারো, দুটো নয়।" },
      ],
    },
    "joining-gap": {
      kind: "gap",
      title: { bn: "কোন জোড়ার শব্দ", en: "Which joining word" },
      items: [
        { text: "Rafi was late ___ the bus broke down.", bn: "বাস নষ্ট হয়ে যাওয়ায় রাফির দেরি হলো।", options: ["so", "because", "although"], right: 1, why: { bn: "পরের অংশটা কারণ: because।", en: "The second part is the reason: because." } },
        { text: "The bus broke down, ___ Rafi was late.", bn: "বাস নষ্ট হলো, তাই রাফির দেরি হলো।", options: ["so", "because", "but"], right: 0, why: { bn: "পরের অংশটা ফল: so। একই ঘটনা, উল্টো দিক থেকে।", en: "The second part is the result: so. The same event from the other side." } },
        { text: "___ it was hot, we played the whole match.", bn: "যদিও গরম ছিল, আমরা পুরো ম্যাচ খেললাম।", options: ["Because", "Although", "So"], right: 1, why: { bn: "বিপরীত, আর বাক্যের শুরুতে: Although। পরে কমা।", en: "A contrast at the front of the sentence: Although, with a comma after the clause." } },
        { text: "Wait here ___ I come back.", bn: "আমি ফিরে না আসা পর্যন্ত এখানে অপেক্ষা করো।", options: ["until", "unless", "while"], right: 0, why: { bn: "যতক্ষণ না: until।", en: "Up to the moment of: until." } },
        { text: "You will miss the bus ___ you hurry.", bn: "তাড়াতাড়ি না করলে তুমি বাস মিস করবে।", options: ["if", "unless", "although"], right: 1, why: { bn: "না করলে: unless = if you don't। পরে আর not নয়।", en: "If you do not: unless means if you don't, with no second not." } },
        { text: "___ Tamim nor Shakib played in that match.", bn: "তামিম বা শাকিব কেউই সেই ম্যাচে খেলেনি।", options: ["Either", "Neither", "Both"], right: 1, why: { bn: "nor-এর জোড়া neither: কেউই না, আর বাক্যে আলাদা not নেই।", en: "Nor pairs with neither: not one of them, with no separate not in the sentence." } },
      ],
    },
    "joining-order": {
      kind: "order",
      title: { bn: "রাফির অনুচ্ছেদ, জোড়া লাগিয়ে", en: "Rafi's paragraph, joined up" },
      note: { bn: "এক বাক্যের টুকরোগুলো ঠিক ক্রমে সাজাও।", en: "Put the pieces of one sentence in order." },
      items: [
        { text: { bn: "Although it was hard,", en: "Although it was hard," }, why: { bn: "অধীন অংশ শুরুতে, শেষে কমা।", en: "The dependent clause opens, with its comma." } },
        { text: { bn: "Rafi practised every day", en: "Rafi practised every day" }, why: { bn: "মূল বাক্য।", en: "The main clause." } },
        { text: { bn: "because he wanted to be a fast bowler,", en: "because he wanted to be a fast bowler," }, why: { bn: "কারণ, মাঝে, কমা ছাড়া শুরু।", en: "The reason, in the middle." } },
        { text: { bn: "so the coach picked him for the final.", en: "so the coach picked him for the final." }, why: { bn: "ফল, সবার শেষে, আগে কমা।", en: "The result, last, with a comma before so." } },
      ],
    },
    "joining-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "নিজের দিন নিয়ে তিন-বাক্যের গল্প, তারপর because, so, but দিয়ে এক বাক্যে।", en: "A three-sentence story about your day, then one sentence with because, so and but." } },
        { text: { bn: "পাঁচটা although-বাক্য নিজের জীবন থেকে: Although I was tired, I…", en: "Five although sentences from your own life: Although I was tired, I…" } },
        { text: { bn: "তিনটা when-বাক্য, দুই সাজে: When I get home, I… / I… when I get home.", en: "Three when sentences, both ways round." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"passive": {
  bn: `
<p>খবরের কাগজে লেখা: <span lang="en">The match was won by Bangladesh.</span> রাফি ভাবল, <span lang="en">Bangladesh won the match</span> লিখলেই তো হতো, ছোট, সোজা। ঠিক। কিন্তু পরের খবরটা দেখো: <span lang="en">The stadium was built in 2006.</span> কে বানাল? জানা নেই, বা জরুরি নয়। কর্তা যখন হারিয়ে যায়, বা কর্তার চেয়ে কাজটাই বড় খবর, তখন বাক্য উল্টে যায়। এর নাম <span lang="en">passive voice</span>। খবর, বিজ্ঞান, নিয়ম আর অফিসের ভাষা এখানেই থাকে, আর পরীক্ষায় <span lang="en">voice change</span> নামে প্রতি বছর আসে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li><span lang="en">active</span>: কর্তা + ক্রিয়া + কর্ম। <span lang="en">Rafi broke the window.</span></li>
<li><span lang="en">passive</span>: কর্ম + <span lang="en">be</span> + V3 (+ <span lang="en">by</span> কর্তা)। <span lang="en">The window was broken by Rafi.</span></li>
<li><span lang="en">be</span>-র কালটা মূল বাক্যের কাল বহন করে: <span lang="en">is broken, was broken, will be broken, has been broken</span>।</li>
<li>V3 কখনো বদলায় না। যে ক্রিয়ার V3 জানো না, তার passive পারবে না।</li>
<li>কর্ম না থাকলে passive হয় না: <span lang="en">Rafi sleeps</span>-এর passive নেই।</li>
</ul>
</div>

${mount("passive-pattern")}

<h2>মেশিনটা তিন ধাপে</h2>

<ol class="step-list">
<li><strong>কর্মটাকে সামনে আনো।</strong> <span lang="en">Rafi broke <em>the window</em>.</span> কর্ম <span lang="en">the window</span>, সে এখন বাক্যের শুরুতে: <span lang="en">The window …</span></li>
<li><strong>মূল ক্রিয়ার কাল দেখে সেই কালের <span lang="en">be</span> বসাও, তারপর V3।</strong> <span lang="en">broke</span> অতীত, তাই <span lang="en">was</span>; <span lang="en">break</span>-এর V3 <span lang="en">broken</span>: <span lang="en">The window was broken …</span></li>
<li><strong>পুরনো কর্তাকে <span lang="en">by</span> দিয়ে শেষে, যদি দরকার হয়।</strong> <span lang="en">The window was broken by Rafi.</span> কর্তা <span lang="en">someone, people, they</span> হলে বাদ: <span lang="en">The window was broken.</span></li>
</ol>

<p>কর্তা যদি pronoun হয়, <span lang="en">by</span>-এর পরে কর্ম-রূপ: <span lang="en">She wrote it. It was written by her.</span> পর্ব ৩ মনে করো।</p>

<h2>be-র কালের ছক</h2>

<p>passive-এর পুরো খেলা <span lang="en">be</span>-র কালে। মূল বাক্যে কাল যা, <span lang="en">be</span>-কে সেই কালে নাও, আর V3 বসাও। <span lang="en">write</span> দিয়ে:</p>

<div class="table-scroll">
<table>
<thead><tr><th>কাল</th><th>active</th><th>passive</th></tr></thead>
<tbody>
<tr><td>present simple</td><td><span lang="en">She writes a letter.</span></td><td><span lang="en">A letter is written.</span></td></tr>
<tr><td>present continuous</td><td><span lang="en">She is writing a letter.</span></td><td><span lang="en">A letter is being written.</span></td></tr>
<tr><td>past simple</td><td><span lang="en">She wrote a letter.</span></td><td><span lang="en">A letter was written.</span></td></tr>
<tr><td>past continuous</td><td><span lang="en">She was writing a letter.</span></td><td><span lang="en">A letter was being written.</span></td></tr>
<tr><td>present perfect</td><td><span lang="en">She has written a letter.</span></td><td><span lang="en">A letter has been written.</span></td></tr>
<tr><td>past perfect</td><td><span lang="en">She had written a letter.</span></td><td><span lang="en">A letter had been written.</span></td></tr>
<tr><td>future</td><td><span lang="en">She will write a letter.</span></td><td><span lang="en">A letter will be written.</span></td></tr>
<tr><td>modal</td><td><span lang="en">She must write a letter.</span></td><td><span lang="en">A letter must be written.</span></td></tr>
</tbody>
</table>
</div>

<p>দুটো ছোট কৌশল: <span lang="en">-ing</span> থাকলে <span lang="en">being</span> আসে, <span lang="en">have</span> থাকলে <span lang="en">been</span> আসে, আর modal বা <span lang="en">will</span> থাকলে খালি <span lang="en">be</span>। বাকি সব শুধু <span lang="en">is/are/was/were</span>।</p>

${mount("passive-lines")}

<h2>কখন passive লাগে</h2>

<p>চারটা কারণে। (১) কর্তা জানা নেই: <span lang="en">My bike was stolen.</span> কে চুরি করল, জানি না। (২) কর্তা জরুরি নয়, কাজটাই খবর: <span lang="en">The new bridge was opened yesterday.</span> (৩) কর্তা সবাই জানে: <span lang="en">Rice is grown in Bangladesh.</span> কৃষকরা, বলার দরকার নেই। (৪) নিয়ম আর নোটিশ, যেখানে কারও নাম নেওয়া হয় না: <span lang="en">Mobile phones must be switched off. English is spoken here.</span> বিজ্ঞান বইয়ের অর্ধেক passive: <span lang="en">Water is heated to 100 degrees. The mixture was stirred.</span></p>

<h2>প্রশ্ন আর আদেশের passive</h2>

<p>প্রশ্ন: আগে সাধারণ বাক্যের passive বানাও, তারপর পর্ব ১৩-র মেশিন। <span lang="en">Did Rafi break the window? Was the window broken by Rafi?</span> <span lang="en">Who broke the window? By whom was the window broken?</span> আদেশ: <span lang="en">Let + কর্ম + be + V3</span>। <span lang="en">Open the door. Let the door be opened.</span> <span lang="en">Do the work. Let the work be done.</span></p>

${mount("passive-gap")}

<div class="ex"><b>Jurassic Park-এর বিজ্ঞানীরা passive-এ কথা বলে:</b> <span lang="en">The dinosaurs were cloned from ancient DNA. The park was built on an island. Every gate is controlled by computer.</span> কে ক্লোন করল, কে বানাল: কোম্পানি, তাই নাম নেই। আর তারপর Malcolm বলে, <span lang="en">Life finds a way.</span> active, তিন শব্দ, কারণ এখানে কর্তাই আসল খবর।</div>

${mount("passive-order")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Voice change</span>-এ তিনটা জিনিস মার্ক করো কলম দিয়ে: কর্তা, ক্রিয়া, কর্ম। কর্ম সামনে, কর্তা <span lang="en">by</span>-এর পরে শেষে। ক্রিয়ার কাল দেখে <span lang="en">be</span>: <span lang="en">-ing</span> দেখলে <span lang="en">being</span>, <span lang="en">has/have/had</span> দেখলে <span lang="en">been</span>, <span lang="en">will/can/must</span> দেখলে খালি <span lang="en">be</span>। তারপর V3। কর্তা <span lang="en">people, they, someone, nobody</span> হলে <span lang="en">by</span> অংশ বাদ। দুটো কর্ম থাকলে (<span lang="en">He gave me a book</span>) যেকোনো একটাকে সামনে: <span lang="en">I was given a book. A book was given to me.</span></p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>V3 আর V2 এক নয়। <span lang="en">The window was broke</span> ভুল, <span lang="en">was broken</span> ঠিক। <span lang="en">The letter was wrote</span> ভুল, <span lang="en">was written</span> ঠিক। নিয়মিত ক্রিয়ায় দুটো এক (<span lang="en">played, played</span>) বলে রেবেলগুলোতে ভুল হয়। খাতার সংগ্রহে তিন রূপের তালিকাটা এই জন্যই।</p>
</div>

${mount("passive-drill")}
`,
  blocks: {
    "passive-pattern": {
      kind: "pattern",
      title: { bn: "উল্টানো বাক্য", en: "The sentence turned round" },
      shape: "OBJECT + be (in the verb's tense) + V3 (+ by SUBJECT)",
      why: { bn: "কর্মটা সামনে যায়, be এসে মূল ক্রিয়ার কালটা বহন করে, আর ক্রিয়া নিজে জমে যায় V3-তে। কর্তা দরকার হলে by-এর পরে, নইলে বাদ।", en: "The object moves to the front, be arrives carrying the verb's tense, and the verb itself freezes into V3. The subject follows by if it is needed, and goes if it is not." },
      examples: [
        { target: "Rafi broke the window. The window was broken by Rafi.", bn: "রাফি জানালা ভাঙল। জানালাটা রাফির দ্বারা ভাঙা হলো।" },
        { target: "Someone stole my bike. My bike was stolen.", bn: "কেউ আমার সাইকেল চুরি করেছে। আমার সাইকেল চুরি হয়েছে।" },
        { target: "They are building a bridge. A bridge is being built.", bn: "তারা একটা সেতু বানাচ্ছে। একটা সেতু বানানো হচ্ছে।" },
        { target: "Nanu has told this story many times. This story has been told many times.", bn: "নানু এই গল্পটা অনেকবার বলেছেন। এই গল্পটা অনেকবার বলা হয়েছে।" },
        { target: "You must switch off your phone. Your phone must be switched off.", bn: "তোমার ফোন বন্ধ করতে হবে। ফোন বন্ধ করা আবশ্যক।" },
      ],
      tip: { bn: "-ing দেখলে being, have দেখলে been, will দেখলে be। বাকি সব was/were, is/are।", en: "See -ing, write being; see have, write been; see will, write be. Everything else is is/are, was/were." },
    },
    "passive-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: কর্তা হারিয়ে গেছে", en: "Listen, say: the doer has vanished" },
      lines: [
        { target: "Rice is grown in Bangladesh.", bn: "বাংলাদেশে ধান চাষ হয়।" },
        { target: "The stadium was built in 2006.", bn: "স্টেডিয়ামটা ২০০৬ সালে বানানো হয়েছিল।" },
        { target: "My phone has been repaired.", bn: "আমার ফোন সারানো হয়েছে।" },
        { target: "The results will be announced on Sunday.", bn: "ফলাফল রবিবার ঘোষণা করা হবে।" },
        { target: "English is spoken here.", bn: "এখানে ইংরেজি বলা হয়।" },
        { target: "The road is being repaired, so drive slowly.", bn: "রাস্তা সারানো হচ্ছে, তাই ধীরে চালাও।" },
      ],
    },
    "passive-gap": {
      kind: "gap",
      title: { bn: "be-র কালটা বসাও", en: "Put in the tense of be" },
      items: [
        { text: "The letter ___ written yesterday.", bn: "চিঠিটা কাল লেখা হয়েছিল।", options: ["is", "was", "has been"], right: 1, why: { bn: "yesterday: past simple, তাই was written।", en: "Yesterday: past simple, so was written." } },
        { text: "A new school ___ built near our house now.", bn: "আমাদের বাড়ির কাছে এখন একটা নতুন স্কুল বানানো হচ্ছে।", options: ["is being", "is", "has been"], right: 0, why: { bn: "now, চলছে: is being built। continuous-এ being।", en: "Now, in progress: is being built. Continuous takes being." } },
        { text: "The match ___ cancelled because of rain.", bn: "বৃষ্টির কারণে ম্যাচটা বাতিল করা হয়েছে।", options: ["has been", "is being", "will be"], right: 0, why: { bn: "হয়ে গেছে, ফল এখন: has been cancelled। perfect-এ been।", en: "Done, with the result now: has been cancelled. Perfect takes been." } },
        { text: "Homework must ___ on time.", bn: "হোমওয়ার্ক সময়মতো জমা দিতে হবে।", options: ["submit", "be submitted", "submitted"], right: 1, why: { bn: "modal-এর পরে খালি be + V3: must be submitted।", en: "After a modal, bare be + V3: must be submitted." } },
        { text: "Who ___ this song written by?", bn: "এই গানটা কে লিখেছে?", options: ["is", "was", "did"], right: 1, why: { bn: "গানটা লেখা হয়ে গেছে, অতীত: Who was this song written by?", en: "The song was written in the past: Who was this song written by?" } },
        { text: "The children ___ given new books every year.", bn: "বাচ্চাদের প্রতি বছর নতুন বই দেওয়া হয়।", options: ["is", "are", "was"], right: 1, why: { bn: "every year: present simple, children অনেক: are given।", en: "Every year: present simple, and children are many: are given." } },
      ],
    },
    "passive-order": {
      kind: "order",
      title: { bn: "voice change-এর ধাপগুলো", en: "The steps of a voice change" },
      note: { bn: "Rafi broke the window থেকে passive বানানোর ধাপগুলো ক্রমে সাজাও।", en: "Order the steps that turn Rafi broke the window into the passive." },
      items: [
        { text: { bn: "কর্তা, ক্রিয়া আর কর্ম চিহ্নিত করো: Rafi / broke / the window", en: "Mark subject, verb and object: Rafi / broke / the window" } },
        { text: { bn: "কর্মটাকে সামনে আনো: The window …", en: "Move the object to the front: The window …" } },
        { text: { bn: "ক্রিয়ার কাল দেখে be বসাও: broke অতীত, তাই was", en: "Put be in the verb's tense: broke is past, so was" } },
        { text: { bn: "ক্রিয়ার V3 বসাও: broken", en: "Put in V3: broken" } },
        { text: { bn: "কর্তাকে by দিয়ে শেষে: by Rafi", en: "Put the subject last after by: by Rafi" } },
      ],
    },
    "passive-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "ঘরের পাঁচটা জিনিস কোথায় তৈরি: My phone was made in China. This shirt was made in Bangladesh.", en: "Where five things in the room were made: My phone was made in China. This shirt was made in Bangladesh." } },
        { text: { bn: "আজকের পাঁচটা খবর passive-এ: A new road was opened. The match was won by…", en: "Five pieces of today's news in the passive: A new road was opened. The match was won by…" } },
        { text: { bn: "একটা active বাক্য নাও আর আটটা কালে passive বলো, ছক দেখে।", en: "Take one active sentence and say its passive in all eight tenses, using the table." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"reported": {
  bn: `
<p>মিতু আপু ফোনে বলল, <span lang="en">"I am busy today."</span> রাফি মাকে বলতে গেল কী শুনেছে। সে তো আর মিতুর গলায় বলবে না, নিজের মুখে বলবে: <span lang="en">Mitu said that she was busy that day.</span> <span lang="en">I</span> হয়ে গেল <span lang="en">she</span>, <span lang="en">am</span> হয়ে গেল <span lang="en">was</span>, <span lang="en">today</span> হয়ে গেল <span lang="en">that day</span>। অন্যের কথা নিজের মুখে বহন করার এই মেশিনের নাম <span lang="en">reported speech</span>, পরীক্ষার খাতায় <span lang="en">narration</span>। নিয়ম মেনে চললে এটা পুরো নম্বরের প্রশ্ন।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>উদ্ধৃতি চিহ্ন যায়, <span lang="en">that</span> আসে: <span lang="en">She said, "…" → She said that …</span></li>
<li>কাল এক ধাপ পিছিয়ে যায়: <span lang="en">am → was, play → played, played → had played, will → would, can → could</span>।</li>
<li>pronoun বক্তার দিক থেকে শ্রোতার দিকে ঘোরে: <span lang="en">I → he/she, my → his/her, you → me/him</span>।</li>
<li>সময় আর জায়গা দূরে সরে যায়: <span lang="en">now → then, today → that day, tomorrow → the next day, here → there, this → that</span>।</li>
<li>প্রশ্নে <span lang="en">asked</span> আর সোজা ক্রম; আদেশে <span lang="en">told/asked + to</span>; চিরসত্যে কাল বদলায় না।</li>
</ul>
</div>

${mount("reported-pattern")}

<h2>প্রথম নিয়ম: কাল এক ধাপ পিছনে</h2>

<p>বলার ক্রিয়াটা যদি অতীতে থাকে (<span lang="en">said, told, asked</span>), ভিতরের কাল এক ধাপ পিছিয়ে যায়। কারণ কথাটা বলা হয়েছিল আগে, তুমি বলছ এখন। পর্ব ৭ আর ১১-র মানচিত্রে এক ঘর নিচে:</p>

<div class="table-scroll">
<table>
<thead><tr><th>সরাসরি</th><th>বহন করে</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td>present simple</td><td>past simple</td><td><span lang="en">"I play." → He said he played.</span></td></tr>
<tr><td>present continuous</td><td>past continuous</td><td><span lang="en">"I am playing." → He said he was playing.</span></td></tr>
<tr><td>past simple</td><td>past perfect</td><td><span lang="en">"I played." → He said he had played.</span></td></tr>
<tr><td>present perfect</td><td>past perfect</td><td><span lang="en">"I have played." → He said he had played.</span></td></tr>
<tr><td><span lang="en">will</span></td><td><span lang="en">would</span></td><td><span lang="en">"I will play." → He said he would play.</span></td></tr>
<tr><td><span lang="en">can</span></td><td><span lang="en">could</span></td><td><span lang="en">"I can play." → He said he could play.</span></td></tr>
<tr><td><span lang="en">may</span></td><td><span lang="en">might</span></td><td><span lang="en">"I may play." → He said he might play.</span></td></tr>
<tr><td><span lang="en">must</span></td><td><span lang="en">had to</span></td><td><span lang="en">"I must play." → He said he had to play.</span></td></tr>
</tbody>
</table>
</div>

<p>দুটো জায়গায় কাল বদলায় না। বলার ক্রিয়া বর্তমানে হলে (<span lang="en">says, tells</span>): <span lang="en">She says that she is busy.</span> আর চিরসত্য: <span lang="en">The teacher said that the earth goes round the sun.</span> পৃথিবী এখনো ঘোরে, তাই <span lang="en">goes</span>।</p>

${mount("reported-lines")}

<h2>দ্বিতীয় নিয়ম: pronoun আর সময় সরে যায়</h2>

<p>বক্তা যখন <span lang="en">I</span> বলেছিল, তুমি বহন করার সময় সেটা <span lang="en">he</span> বা <span lang="en">she</span>। বক্তা যাকে <span lang="en">you</span> বলেছিল, সে যদি তুমি হও, তাহলে <span lang="en">me</span>: <span lang="en">Mitu said, "I will help you." → Mitu said that she would help me.</span> সময়ের শব্দ: <span lang="en">now → then, today → that day, tonight → that night, yesterday → the day before, tomorrow → the next day, last week → the week before, next week → the following week, ago → before, here → there, this → that, these → those</span>।</p>

<h2>তৃতীয় নিয়ম: প্রশ্ন সোজা হয়ে বসে</h2>

<p>পর্ব ১৩-র ফাঁদটা মনে করো: বাক্যের ভিতরে প্রশ্ন ঢুকলে সে ভদ্র হয়ে সোজা হয়। <span lang="en">said</span>-এর জায়গায় <span lang="en">asked</span>, প্রশ্নবোধক চিহ্ন যায়, আর ক্রম হয় সাধারণ বাক্যের। wh-প্রশ্নে wh-শব্দটাই জোড়া: <span lang="en">He asked, "Where do you live?" → He asked me where I lived.</span> হ্যাঁ/না প্রশ্নে <span lang="en">if</span> বা <span lang="en">whether</span>: <span lang="en">She asked, "Are you ready?" → She asked if I was ready.</span></p>

<h2>চতুর্থ নিয়ম: আদেশ হয় to</h2>

<p>আদেশ বা অনুরোধ বহন করতে <span lang="en">told / asked / ordered / requested + কাকে + to + ক্রিয়া</span>। <span lang="en">Coach said, "Practise every day." → Coach told us to practise every day.</span> না-বাচকে <span lang="en">not to</span>: <span lang="en">"Don't be late." → He told me not to be late.</span> <span lang="en">please</span> থাকলে <span lang="en">requested</span>, নইলে <span lang="en">told</span> বা <span lang="en">ordered</span>। <span lang="en">Let's</span> হলে <span lang="en">suggested + -ing</span>: <span lang="en">"Let's go." → She suggested going.</span></p>

${mount("reported-gap")}

<div class="ex"><b>নানুর গল্পে narration সবসময়:</b> নানু বলেন, <span lang="en">The king said, "I will give half my kingdom to the man who brings the golden bird."</span> আর পরদিন রাফি বন্ধুকে বলে: <span lang="en">Nanu told me that the king had said he would give half his kingdom to the man who brought the golden bird.</span> কাল দুই ধাপ পিছিয়েছে, কারণ দুই স্তরের বহন। Home Alone-এর Kevin: <span lang="en">"I made my family disappear!" → Kevin shouted that he had made his family disappear.</span></div>

${mount("reported-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Narration</span>-এ চারটা কাজ ক্রমে, প্রতিবার: (১) বলার ক্রিয়া বাছো: বলা হলে <span lang="en">said/told</span>, প্রশ্ন হলে <span lang="en">asked</span>, আদেশ হলে <span lang="en">told/ordered/requested</span>, চমক হলে <span lang="en">exclaimed with joy/sorrow</span>, <span lang="en">Let's</span> হলে <span lang="en">suggested</span>। (২) জোড়ার শব্দ: <span lang="en">that / if / wh-শব্দ / to</span>। (৩) কাল এক ধাপ পিছনে, যদি বলার ক্রিয়া অতীতে। (৪) pronoun আর সময়ের শব্দ ঘোরাও। শেষে একবার জোরে পড়ো: প্রশ্নবোধক চিহ্ন থেকে গেছে কি না দেখো।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">say</span> আর <span lang="en">tell</span>। <span lang="en">tell</span>-এর পরে সবসময় কাকে: <span lang="en">She told me.</span> <span lang="en">say</span>-এর পরে সরাসরি কথা বা <span lang="en">that</span>: <span lang="en">She said that…</span> <span lang="en">She told that</span> ভুল, <span lang="en">She said me</span> ভুল। কাকে বললে <span lang="en">tell</span>, কী বললে <span lang="en">say</span>।</p>
</div>

${mount("reported-drill")}
`,
  blocks: {
    "reported-pattern": {
      kind: "pattern",
      title: { bn: "কথা বহনের মেশিন", en: "The carrying machine" },
      shape: "X said, \"I VERB …\"  →  X said that he / she VERB-ed …",
      why: { bn: "উদ্ধৃতি যায়, that আসে, কাল এক ধাপ পিছোয়, I হয়ে যায় he বা she, আর today হয়ে যায় that day। প্রশ্নে asked আর সোজা ক্রম, আদেশে told + to।", en: "The quotation marks go, that arrives, the tense steps back, I becomes he or she, and today becomes that day. Questions take asked and plain order; commands take told + to." },
      examples: [
        { target: "Mitu said, \"I am busy today.\" Mitu said that she was busy that day.", bn: "মিতু বলল, আমি আজ ব্যস্ত। মিতু বলল যে সে সেদিন ব্যস্ত ছিল।" },
        { target: "Rafi said, \"I will win.\" Rafi said that he would win.", bn: "রাফি বলল, আমি জিতব। রাফি বলল যে সে জিতবে।" },
        { target: "She asked, \"Where do you live?\" She asked me where I lived.", bn: "সে জিজ্ঞেস করল, তুমি কোথায় থাকো? সে জিজ্ঞেস করল আমি কোথায় থাকি।" },
        { target: "Coach said, \"Don't be late.\" Coach told us not to be late.", bn: "কোচ বললেন, দেরি কোরো না। কোচ আমাদের দেরি না করতে বললেন।" },
      ],
      tip: { bn: "বলার ক্রিয়া বর্তমানে (says) হলে কিছু পিছোয় না। চিরসত্যেও না।", en: "If the reporting verb is present (says), nothing steps back. Nor does a universal truth." },
    },
    "reported-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: সরাসরি, তারপর বহন", en: "Listen, say: direct, then reported" },
      lines: [
        { target: "\"I am tired,\" said Nanu. Nanu said that she was tired.", bn: "নানু বললেন, আমি ক্লান্ত। নানু বললেন যে তিনি ক্লান্ত।" },
        { target: "\"We won yesterday,\" Rafi said. Rafi said that they had won the day before.", bn: "রাফি বলল, আমরা কাল জিতেছি। রাফি বলল যে তারা আগের দিন জিতেছিল।" },
        { target: "\"Can you swim?\" she asked. She asked if I could swim.", bn: "সে জিজ্ঞেস করল, তুমি সাঁতার পারো? সে জিজ্ঞেস করল আমি সাঁতার পারি কি না।" },
        { target: "\"Please open the window,\" he said. He requested me to open the window.", bn: "সে বলল, জানালাটা খোলো তো। সে আমাকে জানালা খুলতে অনুরোধ করল।" },
        { target: "\"The sun rises in the east,\" the teacher said. The teacher said that the sun rises in the east.", bn: "শিক্ষক বললেন, সূর্য পূর্বে ওঠে। চিরসত্য, কাল বদলায়নি।" },
      ],
    },
    "reported-gap": {
      kind: "gap",
      title: { bn: "কী হয়ে যায়", en: "What it turns into" },
      items: [
        { text: "Rafi said, \"I am hungry.\" Rafi said that he ___ hungry.", bn: "রাফি বলল যে সে ক্ষুধার্ত।", options: ["is", "was", "had been"], right: 1, why: { bn: "am এক ধাপ পিছনে: was।", en: "Am steps back one: was." } },
        { text: "Mitu said, \"I will call you tomorrow.\" Mitu said she ___ call me the next day.", bn: "মিতু বলল সে পরদিন আমাকে ফোন করবে।", options: ["will", "would", "can"], right: 1, why: { bn: "will হয় would, tomorrow হয় the next day।", en: "Will becomes would; tomorrow becomes the next day." } },
        { text: "He said, \"I lost my keys.\" He said that he ___ his keys.", bn: "সে বলল যে সে চাবি হারিয়ে ফেলেছিল।", options: ["lost", "had lost", "has lost"], right: 1, why: { bn: "past simple এক ধাপ পিছনে: past perfect, had lost।", en: "Past simple steps back to past perfect: had lost." } },
        { text: "She asked, \"Are you ready?\" She asked ___ I was ready.", bn: "সে জিজ্ঞেস করল আমি প্রস্তুত কি না।", options: ["that", "if", "what"], right: 1, why: { bn: "হ্যাঁ/না প্রশ্ন: if বা whether, আর সোজা ক্রম।", en: "A yes/no question: if or whether, with plain order." } },
        { text: "Coach said, \"Practise every day.\" Coach told us ___ every day.", bn: "কোচ আমাদের রোজ অনুশীলন করতে বললেন।", options: ["practise", "to practise", "that practise"], right: 1, why: { bn: "আদেশ: told + কাকে + to + ক্রিয়া।", en: "A command: told + whom + to + verb." } },
        { text: "The teacher said, \"Water boils at 100 degrees.\" The teacher said that water ___ at 100 degrees.", bn: "শিক্ষক বললেন যে পানি ১০০ ডিগ্রিতে ফোটে।", options: ["boiled", "boils", "had boiled"], right: 1, why: { bn: "চিরসত্য: কাল বদলায় না, boils।", en: "A universal truth: the tense stays, boils." } },
      ],
    },
    "reported-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "He asked me, \"Where are you going?\" এর ঠিক বহন কোনটা?", en: "He asked me, \"Where are you going?\" Which report is right?" },
          options: [
            { text: { bn: "He asked me where was I going.", en: "He asked me where was I going." }, why: { bn: "না। ভিতরে প্রশ্নের ক্রম থেকে গেছে। সোজা করো: where I was going।", en: "No. The question order survived inside. Straighten it: where I was going." } },
            { text: { bn: "He asked me where I was going.", en: "He asked me where I was going." }, right: true, why: { bn: "হ্যাঁ। asked, wh-শব্দ জোড়া, সোজা ক্রম, am going → was going।", en: "Yes. Asked, the wh-word joins, plain order, am going becomes was going." } },
            { text: { bn: "He asked me that where I was going.", en: "He asked me that where I was going." }, why: { bn: "না। wh-শব্দ থাকলে that লাগে না। একটা জোড়ার শব্দই যথেষ্ট।", en: "No. With a wh-word there is no that. One joining word is enough." } },
          ],
        },
        {
          ask: { bn: "কোনটা ঠিক?", en: "Which is right?" },
          options: [
            { text: { bn: "She told that she was busy.", en: "She told that she was busy." }, why: { bn: "না। tell-এর পরে কাকে লাগে: She told me that…", en: "No. Tell needs a person after it: She told me that…" } },
            { text: { bn: "She said me that she was busy.", en: "She said me that she was busy." }, why: { bn: "না। say-এর পরে সরাসরি কাকে বসে না: She said to me, বা She said that।", en: "No. Say takes no direct person: She said to me, or She said that." } },
            { text: { bn: "She told me that she was busy.", en: "She told me that she was busy." }, right: true, why: { bn: "হ্যাঁ। told + me + that।", en: "Yes. Told + me + that." } },
          ],
        },
      ],
    },
    "reported-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "আজ বাসায় কে কী বলেছে, পাঁচ বাক্যে বহন করো: Ma said that… Baba told me to…", en: "What people said at home today, reported in five sentences: Ma said that… Baba told me to…" } },
        { text: { bn: "একটা সিনেমার তিনটা সংলাপ নাও আর reported speech-এ বলো: Iron Man said that he was Iron Man.", en: "Take three lines from a film and report them: Iron Man said that he was Iron Man." } },
        { text: { bn: "সময়ের শব্দের জোড়া জোরে, তিনবার: today that day, tomorrow the next day, yesterday the day before, now then, here there।", en: "The time-word pairs aloud, three times: today that day, tomorrow the next day, yesterday the day before, now then, here there." } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"conditionals": {
  bn: `
<p>রাফি বৃষ্টির দিকে তাকিয়ে চারটা কথা ভাবে। <span lang="en">If it rains, the match stops.</span> সবসময়ের নিয়ম। <span lang="en">If it rains tomorrow, we will play indoors.</span> সম্ভব, দেখা যাক। <span lang="en">If I were Shakib, I would bowl in the rain.</span> কল্পনা, আমি শাকিব নই। <span lang="en">If we had won yesterday, we would have been champions.</span> আফসোস, জিতিনি, শেষ। চারটা <span lang="en">if</span>, চারটা সিঁড়ি, আর নিয়মটা এক লাইনে: <strong>যত পিছনের কাল, তত কম সত্যি।</strong> পর্ব ৭ আর ১১-র কালগুলো এখানে অন্য কাজে লাগে: সময় বলতে নয়, দূরত্ব বলতে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>শূন্য: <span lang="en">If + present, present</span>। চিরসত্য, নিয়ম। <span lang="en">If you heat ice, it melts.</span></li>
<li>প্রথম: <span lang="en">If + present, will + verb</span>। সম্ভব ভবিষ্যৎ। <span lang="en">If it rains, we will stay home.</span></li>
<li>দ্বিতীয়: <span lang="en">If + past, would + verb</span>। অবাস্তব বর্তমান বা কল্পনা। <span lang="en">If I had wings, I would fly.</span></li>
<li>তৃতীয়: <span lang="en">If + past perfect, would have + V3</span>। অতীতের আফসোস। <span lang="en">If I had studied, I would have passed.</span></li>
<li><span lang="en">if</span>-এর অংশে কখনো <span lang="en">will</span> নয়। <span lang="en">unless</span> মানে <span lang="en">if … not</span>।</li>
</ul>
</div>

${mount("conditionals-pattern")}

<h2>শূন্য সিঁড়ি: যখনই, তখনই</h2>

<p>দুই দিকেই present। <span lang="en">if</span>-এর জায়গায় <span lang="en">when</span> বসালেও মানে বদলায় না, এটাই চেনার কৌশল। <span lang="en">If you heat water to 100 degrees, it boils. If Nanu tells a story, everyone listens. If the batter is out, he walks.</span> বিজ্ঞান, নিয়ম, অভ্যাস।</p>

<h2>প্রথম সিঁড়ি: হতে পারে, দেখা যাক</h2>

<p><span lang="en">if</span>-এর দিকে present, ফলের দিকে <span lang="en">will</span>। ভবিষ্যতের সত্যিকারের সম্ভাবনা। <span lang="en">If it rains tomorrow, the match will be cancelled. If you study tonight, you will pass. If Mustafiz plays, we will win.</span> সবচেয়ে বড় ফাঁদ এখানেই: বাংলায় "যদি বৃষ্টি হবে" বলা যায়, ইংরেজিতে <span lang="en">if it will rain</span> ভুল। <span lang="en">if</span>-এর অংশে ভবিষ্যৎ present-এ বলা হয়, <span lang="en">will</span> শুধু ফলের দিকে। ফলের দিকে <span lang="en">will</span>-এর বদলে <span lang="en">can, may, must</span> বা আদেশও চলে: <span lang="en">If you see Rafi, tell him to call me.</span></p>

${mount("conditionals-lines")}

<h2>দ্বিতীয় সিঁড়ি: কল্পনা</h2>

<p><span lang="en">if</span>-এর দিকে past, ফলের দিকে <span lang="en">would</span>। কিন্তু কালটা অতীত নয়, দূরত্ব: এটা এখনকার কথা, শুধু সত্যি নয়। <span lang="en">If I had a million taka, I would buy a stadium.</span> নেই, তাই কল্পনা। <span lang="en">If I were you, I would apologise.</span> আমি তুমি নই। এখানে একটা বিশেষ নিয়ম: <span lang="en">be</span>-র জায়গায় সব কর্তার সাথে <span lang="en">were</span>, <span lang="en">was</span> নয়। <span lang="en">If I were, if he were, if she were</span>। কথায় মানুষ <span lang="en">was</span> বলে, পরীক্ষায় <span lang="en">were</span>। উপদেশের সবচেয়ে ভদ্র ছাঁচ এটাই: <span lang="en">If I were you, I would…</span></p>

<h2>তৃতীয় সিঁড়ি: আফসোস</h2>

<p><span lang="en">if</span>-এর দিকে past perfect, ফলের দিকে <span lang="en">would have + V3</span>। অতীতে যা হয়নি, হলে কী হতো। <span lang="en">If we had won that match, we would have reached the final.</span> জিতিনি, ফাইনালে যাইনি, শেষ। <span lang="en">If I had woken up early, I would not have missed the bus.</span> ক্রিকেটের সব "যদি"-ই তৃতীয় সিঁড়ি: <span lang="en">If Tamim had not been injured, we would have won the series.</span></p>

<div class="table-scroll">
<table>
<thead><tr><th>সিঁড়ি</th><th>if-এর দিক</th><th>ফলের দিক</th><th>কতটা সত্যি</th></tr></thead>
<tbody>
<tr><td>শূন্য</td><td><span lang="en">present</span></td><td><span lang="en">present</span></td><td>সবসময়</td></tr>
<tr><td>প্রথম</td><td><span lang="en">present</span></td><td><span lang="en">will + verb</span></td><td>হতে পারে</td></tr>
<tr><td>দ্বিতীয়</td><td><span lang="en">past (were)</span></td><td><span lang="en">would + verb</span></td><td>কল্পনা</td></tr>
<tr><td>তৃতীয়</td><td><span lang="en">past perfect</span></td><td><span lang="en">would have + V3</span></td><td>হয়নি, শেষ</td></tr>
</tbody>
</table>
</div>

${mount("conditionals-gap")}

<h2>দুই দিক উল্টানো, আর unless</h2>

<p><span lang="en">if</span>-অংশ আগে বসলে কমা, পরে বসলে কমা নয়: <span lang="en">If it rains, we will stay. We will stay if it rains.</span> <span lang="en">unless</span> মানে <span lang="en">if … not</span>: <span lang="en">Unless you hurry, you will miss the bus. = If you don't hurry…</span> পর্ব ১৪-র ফাঁদ: <span lang="en">unless</span>-এর পরে আর <span lang="en">not</span> নয়। আর <span lang="en">wish</span> দ্বিতীয় আর তৃতীয় সিঁড়ির মতোই কাজ করে: <span lang="en">I wish I were taller</span> (এখন), <span lang="en">I wish I had studied</span> (অতীত)।</p>

<div class="ex"><b>The Lion King-এর Simba:</b> <span lang="en">If I were king, I would make the hyenas leave.</span> দ্বিতীয় সিঁড়ি, কারণ তখনো রাজা নয়। শেষে Rafiki বলে, <span lang="en">If you had listened to your father, you would not have run away.</span> তৃতীয়, আফসোস। আর Timon-এর নিয়ম: <span lang="en">If you have no worries, you have no problems.</span> শূন্য। Hakuna Matata।</div>

${mount("conditionals-quiz")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p><span lang="en">Right form</span>-এ <span lang="en">if</span> দেখলে অন্য অংশটা দেখো: যে অংশ দেওয়া আছে, সেটার কাল বলে দেয় সিঁড়িটা কোন। অন্য দিকে <span lang="en">will</span> থাকলে <span lang="en">if</span>-এ present; <span lang="en">would</span> থাকলে <span lang="en">if</span>-এ past (আর <span lang="en">be</span> হলে <span lang="en">were</span>); <span lang="en">would have</span> থাকলে <span lang="en">if</span>-এ <span lang="en">had + V3</span>। উল্টোটাও: <span lang="en">if</span>-এর কাল দেখে ফলের দিক। কখনো <span lang="en">if</span>-এর পরে <span lang="en">will</span> নয়। <span lang="en">Transformation</span>-এ <span lang="en">unless ↔ if not</span> প্রতি বছর।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">would</span> কখনো <span lang="en">if</span>-এর ঘরে ঢোকে না। <span lang="en">If I would have money</span> ভুল, <span lang="en">If I had money</span> ঠিক। <span lang="en">would</span> শুধু ফলের দিকে থাকে। একটা ছবি: <span lang="en">if</span>-এর ঘরে <span lang="en">will/would</span> ঢুকতে চাইলে দরজায় লেখা আছে "প্রবেশ নিষেধ"।</p>
</div>

${mount("conditionals-drill")}
`,
  blocks: {
    "conditionals-pattern": {
      kind: "pattern",
      title: { bn: "চার সিঁড়ি", en: "Four steps" },
      shape: "If + present, present  ·  If + present, will  ·  If + past, would  ·  If + had V3, would have V3",
      why: { bn: "if-এর ঘরে কালটা যত পিছনে, কথাটা তত কম সত্যি। present মানে হতে পারে, past মানে কল্পনা, past perfect মানে হয়নি। ফলের দিকে will, would, would have সেই সিঁড়ির সাথে মেলে।", en: "The further back the tense in the if clause, the less true the idea. Present means possible, past means imagined, past perfect means it never happened. Will, would and would have on the result side match the step." },
      examples: [
        { target: "If you heat ice, it melts.", bn: "বরফ গরম করলে গলে। (সবসময়)" },
        { target: "If it rains tomorrow, we will play indoors.", bn: "কাল বৃষ্টি হলে আমরা ঘরের ভিতরে খেলব। (হতে পারে)" },
        { target: "If I were Shakib, I would bowl the last over.", bn: "আমি শাকিব হলে শেষ ওভারটা করতাম। (কল্পনা)" },
        { target: "If we had won, we would have been champions.", bn: "আমরা জিতলে চ্যাম্পিয়ন হতাম। (হয়নি)" },
      ],
      tip: { bn: "if-এর ঘরে will বা would কখনো ঢোকে না। প্রবেশ নিষেধ।", en: "Will and would never enter the if clause. No entry." },
    },
    "conditionals-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: একই বৃষ্টি, চার সিঁড়ি", en: "Listen, say: the same rain, four steps" },
      lines: [
        { target: "If it rains, the ground gets wet.", bn: "বৃষ্টি হলে মাঠ ভেজে।" },
        { target: "If it rains, we will stay at home.", bn: "বৃষ্টি হলে আমরা বাসায় থাকব।" },
        { target: "If it rained in the desert, the flowers would bloom.", bn: "মরুভূমিতে বৃষ্টি হলে ফুল ফুটত।" },
        { target: "If it had rained last week, the crops would have survived.", bn: "গত সপ্তাহে বৃষ্টি হলে ফসল বাঁচত।" },
        { target: "Unless it stops raining, the match will be cancelled.", bn: "বৃষ্টি না থামলে ম্যাচ বাতিল হবে।" },
        { target: "If I were you, I would take an umbrella.", bn: "আমি তুমি হলে একটা ছাতা নিতাম।" },
      ],
    },
    "conditionals-gap": {
      kind: "gap",
      title: { bn: "কোন সিঁড়ি", en: "Which step" },
      note: { bn: "অন্য দিকটা দেখো, তারপর ছোঁও।", en: "Look at the other side, then tap." },
      items: [
        { text: "If you ___ hard, you will pass.", bn: "কঠোর পরিশ্রম করলে তুমি পাশ করবে।", options: ["work", "will work", "worked"], right: 0, why: { bn: "অন্য দিকে will, তাই if-এ present: work। if-এর পরে will নয়।", en: "The other side has will, so the if clause is present: work. No will after if." } },
        { text: "If I ___ a bird, I would fly to Cox's Bazar.", bn: "আমি পাখি হলে কক্সবাজারে উড়ে যেতাম।", options: ["am", "was", "were"], right: 2, why: { bn: "would আছে, কল্পনা, আর be-র জায়গায় সব কর্তায় were।", en: "Would is there, imagined, and be becomes were for every subject." } },
        { text: "If Rafi had practised more, he ___ the match.", bn: "রাফি আরও অনুশীলন করলে ম্যাচটা জিতত।", options: ["would win", "would have won", "will win"], right: 1, why: { bn: "had practised: তৃতীয় সিঁড়ি, ফলে would have + V3।", en: "Had practised is the third step, so would have + V3 follows." } },
        { text: "If you mix red and blue, you ___ purple.", bn: "লাল আর নীল মেশালে বেগুনি হয়।", options: ["get", "will get", "would get"], right: 0, why: { bn: "চিরসত্য, শূন্য সিঁড়ি: দুই দিকেই present। will দিলে ভুল নয়, কিন্তু নিয়ম বোঝাতে get।", en: "A universal truth, the zero step: present on both sides. Get states the rule." } },
        { text: "___ you hurry, you will miss the train.", bn: "তাড়াতাড়ি না করলে ট্রেন মিস করবে।", options: ["If", "Unless", "When"], right: 1, why: { bn: "না করলে: unless। পরে না-বাচক নেই, তাই If হলে মানে উল্টে যেত।", en: "If you do not: unless. There is no not after it, so If would flip the meaning." } },
        { text: "I wish I ___ taller.", bn: "আমি যদি আরেকটু লম্বা হতাম।", options: ["am", "were", "had been"], right: 1, why: { bn: "এখনকার অবাস্তব ইচ্ছা: wish + were, দ্বিতীয় সিঁড়ির মতো।", en: "A present, unreal wish: wish + were, like the second step." } },
      ],
    },
    "conditionals-quiz": {
      kind: "quiz",
      title: { bn: "নিজে যাচাই করো", en: "Check yourself" },
      questions: [
        {
          ask: { bn: "If I had known, I would have come. এর মানে কী?", en: "If I had known, I would have come. What does it mean?" },
          options: [
            { text: { bn: "আমি জানতাম, তাই এসেছি", en: "I knew, so I came" }, why: { bn: "না। তৃতীয় সিঁড়ি সবসময় উল্টো: যা বলা হচ্ছে তা হয়নি।", en: "No. The third step is always the reverse: what it says did not happen." } },
            { text: { bn: "আমি জানতাম না, তাই আসিনি; জানলে আসতাম", en: "I did not know, so I did not come; had I known, I would have" }, right: true, why: { bn: "হ্যাঁ। অতীতের আফসোস: দুটোই হয়নি।", en: "Yes. Past regret: neither thing happened." } },
            { text: { bn: "আমি হয়তো আসব", en: "I might come" }, why: { bn: "না। would have + V3 মানে অতীত, শেষ। ভবিষ্যতের কোনো সম্ভাবনা নেই।", en: "No. Would have + V3 is past and closed. There is no future possibility in it." } },
          ],
        },
        {
          ask: { bn: "কোনটা ঠিক?", en: "Which is right?" },
          options: [
            { text: { bn: "If it will rain, we will stay home.", en: "If it will rain, we will stay home." }, why: { bn: "না। if-এর ঘরে will নিষেধ।", en: "No. Will is banned from the if clause." } },
            { text: { bn: "If it rains, we will stay home.", en: "If it rains, we will stay home." }, right: true, why: { bn: "হ্যাঁ। প্রথম সিঁড়ি: if + present, will।", en: "Yes. The first step: if + present, will." } },
            { text: { bn: "If it rains, we would stay home.", en: "If it rains, we would stay home." }, why: { bn: "না। সিঁড়ি মিশে গেছে: rains-এর সাথে will, rained-এর সাথে would।", en: "No. The steps are mixed: rains goes with will, rained with would." } },
          ],
        },
      ],
    },
    "conditionals-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "কাল নিয়ে তিনটা প্রথম সিঁড়ি: If it is sunny tomorrow, I will…", en: "Three first-step sentences about tomorrow: If it is sunny tomorrow, I will…" } },
        { text: { bn: "তিনটা কল্পনা: If I had a million taka… If I were the captain… If I could fly…", en: "Three imagined ones: If I had a million taka… If I were the captain… If I could fly…" } },
        { text: { bn: "দুটো আফসোস, নরম করে: If I had…, I would have…", en: "Two regrets, gently: If I had…, I would have…" } },
      ],
    },
  },
},

/* ---------------------------------------------------------- */
"ing-to": {
  bn: `
<p>রাফি লিখল: <span lang="en">I enjoy to play cricket.</span> মিতু আপু কেটে দিল: <span lang="en">I enjoy playing cricket.</span> রাফি লিখল: <span lang="en">I want playing tomorrow.</span> আবার কাটা: <span lang="en">I want to play tomorrow.</span> কেন একটায় <span lang="en">-ing</span> আর অন্যটায় <span lang="en">to</span>? উত্তরটা সৎ: পুরোপুরি নিয়ম নেই। প্রথম ক্রিয়াটা ঠিক করে দ্বিতীয়টা কী রূপে আসবে, আর সেটা মুখস্থ জোড়া। কিন্তু জোড়াগুলো কম, আর একটা কান-নিয়ম আছে যেটা নব্বই ভাগ কাজ করে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ক্রিয়া + <span lang="en">-ing</span> (<span lang="en">gerund</span>): <span lang="en">enjoy, finish, mind, avoid, suggest, keep, practise, stop, miss, consider</span>।</li>
<li>ক্রিয়া + <span lang="en">to</span> (<span lang="en">infinitive</span>): <span lang="en">want, need, hope, decide, plan, promise, learn, refuse, agree, expect</span>।</li>
<li>দুটোই, একই মানে: <span lang="en">like, love, hate, start, begin, continue</span>।</li>
<li>দুটোই, আলাদা মানে: <span lang="en">stop, remember, forget, try</span>।</li>
<li>preposition-এর পরে সবসময় <span lang="en">-ing</span>। বাক্যের কর্তা হিসেবে <span lang="en">-ing</span>।</li>
</ul>
</div>

${mount("ing-to-pattern")}

<h2>কান-নিয়ম: এখনই নাকি পরে</h2>

<p>বেশিরভাগ <span lang="en">to</span>-ক্রিয়া ভবিষ্যতের দিকে তাকায়: চাওয়া, আশা করা, সিদ্ধান্ত নেওয়া, পরিকল্পনা করা, কথা দেওয়া। কাজটা এখনো হয়নি, হবে। <span lang="en">I want to play. I hope to win. I decided to stay. I promised to call.</span> <span lang="en">to</span> মানে একটা তীর, সামনের দিকে।</p>

<p>বেশিরভাগ <span lang="en">-ing</span>-ক্রিয়া কাজটাকে একটা জিনিস হিসেবে দেখে, যেটা চলছে বা হয়ে গেছে: উপভোগ করা, শেষ করা, এড়িয়ে যাওয়া, চালিয়ে যাওয়া, থামা। <span lang="en">I enjoy playing. I finished eating. I avoid arguing. I kept running.</span> <span lang="en">-ing</span> মানে একটা ছবি, যেটা ধরা আছে।</p>

<div class="table-scroll">
<table>
<thead><tr><th>+ <span lang="en">-ing</span></th><th>+ <span lang="en">to</span></th><th>দুটোই, একই মানে</th></tr></thead>
<tbody>
<tr><td><span lang="en">enjoy, finish, mind</span></td><td><span lang="en">want, need, hope</span></td><td><span lang="en">like, love, hate</span></td></tr>
<tr><td><span lang="en">avoid, suggest, keep</span></td><td><span lang="en">decide, plan, promise</span></td><td><span lang="en">start, begin, continue</span></td></tr>
<tr><td><span lang="en">practise, miss, consider</span></td><td><span lang="en">learn, refuse, agree</span></td><td><span lang="en">prefer</span></td></tr>
<tr><td><span lang="en">give up, can't help</span></td><td><span lang="en">expect, offer, manage</span></td><td></td></tr>
</tbody>
</table>
</div>

${mount("ing-to-lines")}

<h2>চারটা ক্রিয়া, দুই মানে</h2>

<p>এই চারটায় দুটোই বসে, কিন্তু মানে বদলে যায়, আর পরীক্ষা এখানেই ফাঁদ পাতে।</p>

<ul>
<li><span lang="en">stop + -ing</span>: কাজটা বন্ধ করা। <span lang="en">He stopped smoking.</span> আর ধূমপান করে না। <span lang="en">stop + to</span>: অন্য একটা কাজ করার জন্য থামা। <span lang="en">He stopped to smoke.</span> ধূমপান করার জন্য থামল।</li>
<li><span lang="en">remember + -ing</span>: যা করেছ তা মনে আছে। <span lang="en">I remember locking the door.</span> তালা দিয়েছি, মনে আছে। <span lang="en">remember + to</span>: করতে মনে রাখা। <span lang="en">Remember to lock the door.</span> ভুলো না।</li>
<li><span lang="en">forget + -ing</span>: করেছ কিন্তু ভুলে গেছ (কম ব্যবহার)। <span lang="en">forget + to</span>: করতে ভুলে যাওয়া। <span lang="en">I forgot to bring my bat.</span></li>
<li><span lang="en">try + -ing</span>: পরীক্ষা করে দেখা। <span lang="en">Try restarting the phone.</span> <span lang="en">try + to</span>: চেষ্টা করা, কঠিন। <span lang="en">I tried to lift the box, but it was too heavy.</span></li>
</ul>

<h2>preposition-এর পরে, আর কর্তা হিসেবে</h2>

<p><span lang="en">in, on, at, of, for, about, without, before, after</span>-এর পরে ক্রিয়া এলে সবসময় <span lang="en">-ing</span>: <span lang="en">good at bowling, afraid of falling, before leaving, without saying, interested in learning</span>। পর্ব ৯-এর জোড়াগুলো এখানে ফিরে আসে। আর ক্রিয়া যদি বাক্যের কর্তা হয়, তাহলেও <span lang="en">-ing</span>: <span lang="en">Swimming is good exercise. Reading makes you smart.</span> <span lang="en">To swim is good</span> ব্যাকরণে ঠিক, কিন্তু কেউ বলে না।</p>

${mount("ing-to-gap")}

<h2>make, let, help: খালি ক্রিয়া</h2>

<p>তিনটা ক্রিয়ার পরে <span lang="en">to</span>-ও নয়, <span lang="en">-ing</span>-ও নয়, একদম খালি: <span lang="en">make someone do, let someone do, help someone (to) do</span>। <span lang="en">Coach made us run ten laps. Ma let me watch the match. Rafi helped me carry the bags.</span> পর্ব ২১-এ এদের পুরো পরিবার।</p>

<div class="ex"><b>Frozen-এর Elsa:</b> <span lang="en">Let it go.</span> <span lang="en">let</span> + খালি। Nemo-র Dory: <span lang="en">Just keep swimming.</span> <span lang="en">keep + -ing</span>। Finding Nemo-র Marlin: <span lang="en">I promised I would never let anything happen to him.</span> <span lang="en">let + happen</span>, খালি। আর Kung Fu Panda: <span lang="en">I don't want to fight!</span> <span lang="en">want + to</span>। সিনেমা দেখলে জোড়াগুলো এমনিই কানে বসে।</div>

${mount("ing-to-bins")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>বন্ধনীতে একটা ক্রিয়া, আর ঠিক আগে আরেকটা ক্রিয়া বা preposition? আগেরটা দেখো। <span lang="en">enjoy, finish, mind, avoid, keep, stop, suggest</span> বা যেকোনো preposition: <span lang="en">-ing</span>। <span lang="en">want, need, hope, decide, plan, promise, would like</span>: <span lang="en">to</span>। <span lang="en">make, let, help, can, must, should</span>: খালি। এই তিন তালিকা খাতার শেষ পাতায়। <span lang="en">stop/remember/forget/try</span> এলে মানেটা পড়ো: কাজটা বন্ধ (<span lang="en">-ing</span>) নাকি অন্য কাজের জন্য থামা (<span lang="en">to</span>)।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">look forward to</span>-র <span lang="en">to</span> একটা preposition, তাই পরে <span lang="en">-ing</span>: <span lang="en">I look forward to meeting you</span>, <span lang="en">to meet</span> নয়। <span lang="en">used to</span> দুই রকম: <span lang="en">I used to play</span> (আগে খেলতাম, এখন না) আর <span lang="en">I am used to playing</span> (খেলায় অভ্যস্ত)। <span lang="en">be</span> থাকলে <span lang="en">-ing</span>।</p>
</div>

${mount("ing-to-drill")}
`,
  blocks: {
    "ing-to-pattern": {
      kind: "pattern",
      title: { bn: "প্রথম ক্রিয়াই ঠিক করে", en: "The first verb decides" },
      shape: "enjoy / finish / keep + VERB-ing   ·   want / hope / decide + to VERB   ·   make / let + VERB",
      why: { bn: "দ্বিতীয় ক্রিয়ার রূপ প্রথমটার হাতে। to সামনের দিকে তাকায় (চাওয়া, আশা), -ing কাজটাকে ছবি হিসেবে দেখে (উপভোগ, শেষ), আর make, let-এর পরে কিছুই না।", en: "The second verb's form is in the first verb's hands. To looks ahead (wanting, hoping), -ing holds the action as a picture (enjoying, finishing), and make and let take nothing at all." },
      examples: [
        { target: "I enjoy playing, but I want to win.", bn: "আমি খেলতে ভালোবাসি, কিন্তু জিততে চাই।" },
        { target: "Rafi finished eating and decided to go out.", bn: "রাফি খাওয়া শেষ করে বাইরে যাওয়ার সিদ্ধান্ত নিল।" },
        { target: "Nanu keeps telling stories and hopes to write a book.", bn: "নানু গল্প বলে যান আর একটা বই লেখার আশা করেন।" },
        { target: "Ma let me watch the final. Coach made us run.", bn: "মা আমাকে ফাইনাল দেখতে দিলেন। কোচ আমাদের দৌড় করালেন।" },
        { target: "She is good at bowling and afraid of failing.", bn: "সে বোলিংয়ে ভালো আর ব্যর্থ হতে ভয় পায়। (preposition-এর পরে -ing)" },
      ],
      tip: { bn: "stop smoking = ধূমপান ছাড়া। stop to smoke = ধূমপান করতে থামা। একটা to, দুই জীবন।", en: "Stop smoking means quitting; stop to smoke means pausing for one. One to, two lives." },
    },
    "ing-to-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: to আর -ing", en: "Listen, say: to and -ing" },
      lines: [
        { target: "I want to learn German next year.", bn: "আমি আগামী বছর জার্মান শিখতে চাই।" },
        { target: "I enjoy learning new words.", bn: "আমি নতুন শব্দ শিখতে ভালোবাসি।" },
        { target: "She decided to leave early.", bn: "সে তাড়াতাড়ি চলে যাওয়ার সিদ্ধান্ত নিল।" },
        { target: "She suggested leaving early.", bn: "সে তাড়াতাড়ি চলে যাওয়ার প্রস্তাব দিল।" },
        { target: "Remember to call Nanu. I remember calling her yesterday.", bn: "নানুকে ফোন করতে মনে রেখো। কাল তাঁকে ফোন করেছি, মনে আছে।" },
        { target: "Thank you for helping me. I look forward to seeing you.", bn: "সাহায্যের জন্য ধন্যবাদ। তোমার সাথে দেখার অপেক্ষায় আছি।" },
      ],
    },
    "ing-to-gap": {
      kind: "gap",
      title: { bn: "to, -ing, নাকি খালি", en: "To, -ing, or bare" },
      items: [
        { text: "Rafi enjoys ___ cricket on Fridays.", bn: "রাফি শুক্রবারে ক্রিকেট খেলতে ভালোবাসে।", options: ["to play", "playing", "play"], right: 1, why: { bn: "enjoy + -ing, সবসময়।", en: "Enjoy + -ing, always." } },
        { text: "Mitu hopes ___ a doctor.", bn: "মিতু ডাক্তার হওয়ার আশা করে।", options: ["becoming", "to become", "become"], right: 1, why: { bn: "hope সামনে তাকায়: hope to।", en: "Hope looks ahead: hope to." } },
        { text: "Coach made us ___ ten laps.", bn: "কোচ আমাদের দশ চক্কর দৌড় করালেন।", options: ["to run", "running", "run"], right: 2, why: { bn: "make + কাউকে + খালি ক্রিয়া।", en: "Make + someone + bare verb." } },
        { text: "He stopped ___ when the doctor warned him.", bn: "ডাক্তার সাবধান করার পর সে ধূমপান ছেড়ে দিল।", options: ["to smoke", "smoking", "smoke"], right: 1, why: { bn: "কাজটা বন্ধ করা: stop + -ing। stop to smoke হলে ধূমপান করতে থামা।", en: "Quitting the habit: stop + -ing. Stop to smoke would mean pausing to have one." } },
        { text: "She is interested ___ Japanese.", bn: "সে জাপানি শিখতে আগ্রহী।", options: ["to learn", "in learning", "learn"], right: 1, why: { bn: "interested in, আর preposition-এর পরে -ing: in learning।", en: "Interested in, and -ing after a preposition: in learning." } },
        { text: "Don't forget ___ the door before you leave.", bn: "যাওয়ার আগে দরজায় তালা দিতে ভুলো না।", options: ["locking", "to lock", "lock"], right: 1, why: { bn: "করতে মনে রাখা, কাজটা এখনো হয়নি: forget to।", en: "Remembering to do something not yet done: forget to." } },
      ],
    },
    "ing-to-bins": {
      kind: "bins",
      title: { bn: "ক্রিয়াগুলো ভাগ করো", en: "Sort the verbs" },
      note: { bn: "প্রতিটা ক্রিয়ার পরে কী বসে।", en: "What follows each verb." },
      bins: [
        { id: "ing", label: { bn: "+ -ing", en: "+ -ing" } },
        { id: "to", label: { bn: "+ to", en: "+ to" } },
        { id: "bare", label: { bn: "+ খালি ক্রিয়া", en: "+ bare verb" } },
      ],
      items: [
        { text: { bn: "finish", en: "finish" }, bin: "ing", why: { bn: "finish eating।", en: "Finish eating." } },
        { text: { bn: "want", en: "want" }, bin: "to", why: { bn: "want to go।", en: "Want to go." } },
        { text: { bn: "let", en: "let" }, bin: "bare", why: { bn: "let me go।", en: "Let me go." } },
        { text: { bn: "avoid", en: "avoid" }, bin: "ing", why: { bn: "avoid talking।", en: "Avoid talking." } },
        { text: { bn: "promise", en: "promise" }, bin: "to", why: { bn: "promise to call।", en: "Promise to call." } },
        { text: { bn: "must", en: "must" }, bin: "bare", why: { bn: "must go: modal, খালি।", en: "Must go: a modal, bare." } },
        { text: { bn: "keep", en: "keep" }, bin: "ing", why: { bn: "keep swimming।", en: "Keep swimming." } },
        { text: { bn: "decide", en: "decide" }, bin: "to", why: { bn: "decide to stay।", en: "Decide to stay." } },
        { text: { bn: "make", en: "make" }, bin: "bare", why: { bn: "make him laugh।", en: "Make him laugh." } },
      ],
    },
    "ing-to-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "পাঁচটা enjoy আর পাঁচটা want: I enjoy… I want to…", en: "Five with enjoy and five with want: I enjoy… I want to…" } },
        { text: { bn: "এ বছরের তিনটা সিদ্ধান্ত আর দুটো কথা: I decided to… I promise to…", en: "Three decisions and two promises for this year: I decided to… I promise to…" } },
        { text: { bn: "চার জোড়া জোরে: stop smoking / stop to smoke, remember locking / remember to lock।", en: "Four pairs aloud: stop smoking / stop to smoke, remember locking / remember to lock." } },
      ],
    },
  },
},

};
