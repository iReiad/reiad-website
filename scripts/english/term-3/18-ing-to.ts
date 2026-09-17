/* ============================================================
   18-ing-to.ts: পর্ব ১৮, -ing নাকি to: gerund আর infinitive.

   One part of the grammar term, gathered into the rung by
   `middle.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>রাফি লিখল: <span lang="en">I enjoy to play cricket.</span> মিতু আপু কেটে দিল: <span lang="en">I enjoy playing cricket.</span> রাফি লিখল: <span lang="en">I want playing tomorrow.</span> আবার কাটা: <span lang="en">I want to play tomorrow.</span> কেন একটায় <span lang="en">-ing</span> আর অন্যটায় <span lang="en">to</span>? উত্তরটা সৎ: পুরোপুরি নিয়ম নেই। প্রথম ক্রিয়াটা ঠিক করে দ্বিতীয়টা কী রূপে আসবে, আর সেটা মুখস্থ জোড়া। কিন্তু জোড়াগুলো কম, আর একটা কান-নিয়ম আছে যেটা নব্বই ভাগ কাজ করে।</p>

<p>জোড়ার তালিকার পরে বাকিটা: <span lang="en">-ing</span> বাক্যে কী কী কাজ করে (কর্তা, কর্ম, preposition-এর পরে), <span lang="en">to</span> আর কোথায় বসে (উদ্দেশ্য, adjective-এর পরে, <span lang="en">too</span> আর <span lang="en">enough</span>), মাঝে একজন মানুষ ঢুকলে কী হয় (<span lang="en">want him to</span>), <span lang="en">used to</span>-র তিন রূপ, দেখা-শোনার ক্রিয়া, আর পরীক্ষায় এই সব যেভাবে আসে।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>ক্রিয়া + <span lang="en">-ing</span> (<span lang="en">gerund</span>): <span lang="en">enjoy, finish, mind, avoid, suggest, keep, practise, stop, miss, consider</span>।</li>
<li>ক্রিয়া + <span lang="en">to</span> (<span lang="en">infinitive</span>): <span lang="en">want, need, hope, decide, plan, promise, learn, refuse, agree, expect</span>।</li>
<li>দুটোই, একই মানে: <span lang="en">like, love, hate, start, begin, continue</span>।</li>
<li>দুটোই, আলাদা মানে: <span lang="en">stop, remember, forget, try</span>।</li>
<li>preposition-এর পরে সবসময় <span lang="en">-ing</span>। বাক্যের কর্তা হিসেবে <span lang="en">-ing</span>। উদ্দেশ্য বোঝাতে <span lang="en">to</span>।</li>
<li><span lang="en">make, let, help</span>, আর modal-এর পরে খালি ক্রিয়া।</li>
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
<tr><td><span lang="en">give up, can't help, imagine</span></td><td><span lang="en">expect, offer, manage, afford</span></td><td><span lang="en">intend, bother</span></td></tr>
<tr><td><span lang="en">deny, admit, delay, postpone</span></td><td><span lang="en">seem, appear, pretend, threaten</span></td><td></td></tr>
</tbody>
</table>
</div>

<p>তালিকা মুখস্থের একটা কৌশল: <span lang="en">-ing</span>-এর দলটা "থামা-চালানো-এড়ানো-উপভোগ": <span lang="en">stop, keep, avoid, enjoy</span>, আর তাদের বন্ধুরা। <span lang="en">to</span>-র দলটা "চাওয়া-আশা-সিদ্ধান্ত-কথা": <span lang="en">want, hope, decide, promise</span>। নতুন ক্রিয়া পেলে জিজ্ঞেস করো, এটা কোন দলের বন্ধু?</p>

${mount("ing-to-lines")}

${mount("ing-to-bins")}

<h2>চারটা ক্রিয়া, দুই মানে</h2>

<p>এই চারটায় দুটোই বসে, কিন্তু মানে বদলে যায়, আর পরীক্ষা এখানেই ফাঁদ পাতে।</p>

<ul>
<li><span lang="en">stop + -ing</span>: কাজটা বন্ধ করা। <span lang="en">He stopped smoking.</span> আর ধূমপান করে না। <span lang="en">stop + to</span>: অন্য একটা কাজ করার জন্য থামা। <span lang="en">He stopped to smoke.</span> ধূমপান করার জন্য থামল।</li>
<li><span lang="en">remember + -ing</span>: যা করেছ তা মনে আছে। <span lang="en">I remember locking the door.</span> তালা দিয়েছি, মনে আছে। <span lang="en">remember + to</span>: করতে মনে রাখা। <span lang="en">Remember to lock the door.</span> ভুলো না।</li>
<li><span lang="en">forget + -ing</span>: করেছ কিন্তু ভুলে গেছ (কম ব্যবহার)। <span lang="en">forget + to</span>: করতে ভুলে যাওয়া। <span lang="en">I forgot to bring my bat.</span></li>
<li><span lang="en">try + -ing</span>: পরীক্ষা করে দেখা। <span lang="en">Try restarting the phone.</span> <span lang="en">try + to</span>: চেষ্টা করা, কঠিন। <span lang="en">I tried to lift the box, but it was too heavy.</span></li>
</ul>

<p>একটা কৌশল চারটাতেই চলে: <span lang="en">-ing</span> পিছনে তাকায় (যা হয়েছে বা হচ্ছে), <span lang="en">to</span> সামনে তাকায় (যা করতে হবে)। <span lang="en">remember locking</span>: তালা দেওয়া হয়ে গেছে। <span lang="en">remember to lock</span>: তালা দেওয়া সামনে। <span lang="en">stop smoking</span>: ধূমপানটা পিছনে ফেলে। <span lang="en">stop to smoke</span>: ধূমপান সামনে। আরও দুটো: <span lang="en">regret + -ing</span> (করে আফসোস: <span lang="en">I regret saying that</span>), <span lang="en">regret + to</span> (বলতে খারাপ লাগছে: <span lang="en">We regret to inform you</span>); <span lang="en">go on + -ing</span> (চালিয়ে যাওয়া), <span lang="en">go on + to</span> (এরপর অন্য কিছু শুরু)।</p>

${mount("ing-to-meanings")}

${mount("ing-to-reveal")}

<h2>-ing বাক্যে কী কী কাজ করে</h2>

<p><span lang="en">-ing</span> রূপটা যখন noun-এর কাজ করে, বইয়ে তার নাম <span lang="en">gerund</span>। চারটা জায়গায়। কর্তা হিসেবে: <span lang="en">Swimming is good exercise. Reading makes you smart.</span> (<span lang="en">To swim is good</span> ব্যাকরণে ঠিক, কিন্তু কেউ বলে না।) কর্ম হিসেবে, ওই <span lang="en">-ing</span>-ক্রিয়াগুলোর পরে: <span lang="en">I enjoy swimming.</span> preposition-এর পরে, সবসময়: <span lang="en">good at bowling, afraid of falling, before leaving, without saying, interested in learning, thank you for coming</span>। পর্ব ৯-এর জোড়াগুলো এখানে ফিরে আসে। আর <span lang="en">be</span>-র পরে, পূরক হিসেবে: <span lang="en">My hobby is reading.</span></p>

<p>দুটো ফাঁদ। <span lang="en">look forward to, be used to, get used to, object to</span>-র <span lang="en">to</span>-টা preposition, ক্রিয়ার <span lang="en">to</span> নয়, তাই পরে <span lang="en">-ing</span>: <span lang="en">I look forward to meeting you. I am used to getting up early.</span> পরীক্ষা করার উপায়: <span lang="en">to</span>-র পরে একটা noun বসানো যায় কি না। <span lang="en">I look forward to the holiday</span>: যায়, তাই preposition, তাই <span lang="en">-ing</span>। আর <span lang="en">need + -ing</span> passive মানে দেয়: <span lang="en">The bike needs repairing = needs to be repaired.</span></p>

${mount("ing-to-jobs")}

<h2>to-র আরও তিন জায়গা</h2>

<p><strong>উদ্দেশ্য:</strong> কেন করছি, সেটা <span lang="en">to</span> দিয়ে। <span lang="en">I study to pass. Rafi went to the field to practise.</span> <span lang="en">for</span> নয়: <span lang="en">I study for pass</span> বাংলার "পাশের জন্য"-র ছায়া, ইংরেজিতে <span lang="en">to pass</span> বা <span lang="en">in order to pass</span>। <span lang="en">for</span> বসে noun-এর আগে: <span lang="en">for the exam</span>। <strong>adjective-এর পরে:</strong> <span lang="en">happy to see you, easy to learn, hard to say, ready to go, afraid to ask</span>। <strong><span lang="en">too</span> আর <span lang="en">enough</span>-এর সাথে:</strong> <span lang="en">too tired to walk</span> (এত ক্লান্ত যে হাঁটা যায় না), <span lang="en">old enough to vote</span> (ভোট দেওয়ার মতো বয়স)। পর্ব ১৪-র <span lang="en">so … that ↔ too … to</span> এখান থেকে।</p>

<p>আর মাঝখানে একজন মানুষ ঢুকলে: <span lang="en">want someone to, ask someone to, tell someone to, allow someone to, expect someone to, would like someone to</span>। <span lang="en">Ma wants me to study. Coach told us to run. I would like you to come.</span> কর্ম-রূপের pronoun, তারপর <span lang="en">to</span>। বাংলায় "মা চায় আমি পড়ি" আলাদা বাক্য, ইংরেজিতে একটা: <span lang="en">Ma wants me to study</span>, <span lang="en">Ma wants that I study</span> নয়।</p>

${mount("ing-to-gap")}

${mount("ing-to-purpose")}

<h2>make, let, help: খালি ক্রিয়া</h2>

<p>তিনটা ক্রিয়ার পরে <span lang="en">to</span>-ও নয়, <span lang="en">-ing</span>-ও নয়, একদম খালি: <span lang="en">make someone do, let someone do, help someone (to) do</span>। <span lang="en">Coach made us run ten laps. Ma let me watch the match. Rafi helped me carry the bags.</span> পর্ব ২১-এ এদের পুরো পরিবার।</p>

<p>দেখা-শোনার ক্রিয়াও খালি বা <span lang="en">-ing</span> নেয়, <span lang="en">to</span> নয়: <span lang="en">see, hear, watch, feel, notice</span>। <span lang="en">I saw him cross the road</span> (পুরো পার হওয়াটা দেখলাম), <span lang="en">I saw him crossing the road</span> (পার হচ্ছিল, তার মাঝখানে দেখলাম)। <span lang="en">I heard her sing</span> (পুরো গান), <span lang="en">I heard her singing</span> (গাইছিল)। <span lang="en">I saw him to cross</span> কখনো নয়।</p>

<div class="table-scroll">
<table>
<thead><tr><th>ছাঁচ</th><th>উদাহরণ</th><th>মানে</th></tr></thead>
<tbody>
<tr><td><span lang="en">used to + verb</span></td><td><span lang="en">I used to play marbles.</span></td><td>আগে করতাম, এখন করি না</td></tr>
<tr><td><span lang="en">be used to + -ing</span></td><td><span lang="en">I am used to waking early.</span></td><td>অভ্যস্ত</td></tr>
<tr><td><span lang="en">get used to + -ing</span></td><td><span lang="en">I am getting used to the noise.</span></td><td>অভ্যস্ত হচ্ছি</td></tr>
<tr><td><span lang="en">see / hear + object + verb</span></td><td><span lang="en">I saw him leave.</span></td><td>পুরোটা দেখলাম</td></tr>
<tr><td><span lang="en">see / hear + object + -ing</span></td><td><span lang="en">I saw him leaving.</span></td><td>চলছিল, মাঝখানে দেখলাম</td></tr>
<tr><td><span lang="en">make / let + object + verb</span></td><td><span lang="en">She made me laugh. Let me go.</span></td><td>করানো / দেওয়া</td></tr>
</tbody>
</table>
</div>

<div class="ex"><b>Frozen-এর Elsa:</b> <span lang="en">Let it go.</span> <span lang="en">let</span> + খালি। Nemo-র Dory: <span lang="en">Just keep swimming.</span> <span lang="en">keep + -ing</span>। Finding Nemo-র Marlin: <span lang="en">I promised I would never let anything happen to him.</span> <span lang="en">let + happen</span>, খালি। আর Kung Fu Panda: <span lang="en">I don't want to fight!</span> <span lang="en">want + to</span>। সিনেমা দেখলে জোড়াগুলো এমনিই কানে বসে।</div>

${mount("ing-to-used")}

${mount("ing-to-build")}

${mount("ing-to-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p><span lang="en">Right form of verbs</span>-এ যে ঘরগুলোর ঠিক আগে আরেকটা ক্রিয়া বা একটা preposition আছে, সেগুলো এই পর্বের। প্রতিটায় একটা প্রশ্ন: আগেরটা কে?</p>

<ol class="step-list">
<li><strong>আগে preposition?</strong> <span lang="en">in, at, of, for, about, without, before, after, to (look forward to)</span>: <span lang="en">-ing</span>, সবসময়।</li>
<li><strong>আগে modal, বা <span lang="en">make, let, help, see, hear</span>?</strong> খালি ক্রিয়া।</li>
<li><strong>আগে <span lang="en">-ing</span>-দলের ক্রিয়া?</strong> <span lang="en">enjoy, finish, mind, avoid, keep, stop, suggest, practise</span>: <span lang="en">-ing</span>।</li>
<li><strong>আগে <span lang="en">to</span>-দলের ক্রিয়া, adjective, <span lang="en">too/enough</span>, বা উদ্দেশ্য?</strong> <span lang="en">to</span>।</li>
<li><strong><span lang="en">stop, remember, forget, try</span>?</strong> মানেটা পড়ো: পিছনে <span lang="en">-ing</span>, সামনে <span lang="en">to</span>।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">Rafi enjoys (play) ___ cricket and hopes (become) ___ a fast bowler. He is good at (bowl) ___, but he must (practise) ___ every day. Yesterday he stopped (play) ___ because it started (rain) ___. His coach made him (run) ___ ten laps and told him (come) ___ early the next day.</span> উত্তর: <span lang="en">playing, to become, bowling, practise, playing, raining</span> (বা <span lang="en">to rain</span>), <span lang="en">run, to come</span>। আটটা ঘর, পাঁচটা প্রশ্ন।</div>

${mount("ing-to-exam")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>বন্ধনীতে একটা ক্রিয়া, আর ঠিক আগে আরেকটা ক্রিয়া বা preposition? আগেরটা দেখো। <span lang="en">enjoy, finish, mind, avoid, keep, stop, suggest</span> বা যেকোনো preposition: <span lang="en">-ing</span>। <span lang="en">want, need, hope, decide, plan, promise, would like</span>: <span lang="en">to</span>। <span lang="en">make, let, help, can, must, should</span>: খালি। এই তিন তালিকা খাতার শেষ পাতায়। <span lang="en">stop/remember/forget/try</span> এলে মানেটা পড়ো: কাজটা বন্ধ (<span lang="en">-ing</span>) নাকি অন্য কাজের জন্য থামা (<span lang="en">to</span>)।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p><span lang="en">look forward to</span>-র <span lang="en">to</span> একটা preposition, তাই পরে <span lang="en">-ing</span>: <span lang="en">I look forward to meeting you</span>, <span lang="en">to meet</span> নয়। <span lang="en">used to</span> দুই রকম: <span lang="en">I used to play</span> (আগে খেলতাম, এখন না) আর <span lang="en">I am used to playing</span> (খেলায় অভ্যস্ত)। <span lang="en">be</span> থাকলে <span lang="en">-ing</span>।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p><span lang="en">suggest</span>-এর পরে কখনো <span lang="en">to</span> নয়, আর মাঝখানে মানুষও নয়: <span lang="en">She suggested me to go</span> ভুল। হয় <span lang="en">She suggested going</span>, নয় <span lang="en">She suggested that I should go</span>। একই কথা <span lang="en">recommend</span>-এ। আর <span lang="en">want</span>-এর পরে <span lang="en">that</span> নয়: <span lang="en">I want that you come</span> ভুল, <span lang="en">I want you to come</span>।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>কান-নিয়ম এক লাইনে: <span lang="en">to</span> কোন দিকে তাকায়, <span lang="en">-ing</span> কোন দিকে?</li>
<li>দশটা <span lang="en">-ing</span>-ক্রিয়া আর দশটা <span lang="en">to</span>-ক্রিয়া না দেখে?</li>
<li><span lang="en">stop smoking</span> আর <span lang="en">stop to smoke</span>?</li>
<li>preposition-এর পরে কী বসে, <span lang="en">look forward to</span> সহ?</li>
<li><span lang="en">used to play</span> আর <span lang="en">be used to playing</span>?</li>
<li><span lang="en">make, let, see, hear</span>-এর পরে কী?</li>
</ul>
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
        { target: "Ma wants me to study, but she let me watch the match.", bn: "মা চান আমি পড়ি, কিন্তু ম্যাচটা দেখতে দিলেন।" },
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
        { text: { bn: "suggest", en: "suggest" }, bin: "ing", why: { bn: "suggest going। কখনো suggest to নয়।", en: "Suggest going. Never suggest to." } },
        { text: { bn: "afford", en: "afford" }, bin: "to", why: { bn: "can't afford to buy।", en: "Can't afford to buy." } },
        { text: { bn: "hear (someone)", en: "hear (someone)" }, bin: "bare", why: { bn: "I heard her sing (বা singing), কখনো to sing নয়।", en: "I heard her sing (or singing), never to sing." } },
      ],
    },
    "ing-to-meanings": {
      kind: "match",
      title: { bn: "একই ক্রিয়া, দুই মানে", en: "The same verb, two meanings" },
      note: { bn: "বাঁ দিকের বাক্যটা ডান দিকের মানের সাথে মেলাও। -ing পিছনে তাকায়, to সামনে।", en: "Match each sentence on the left with its meaning on the right. -ing looks back, to looks ahead." },
      pairs: [
        { left: { bn: "He stopped smoking.", en: "He stopped smoking." }, right: { bn: "ধূমপান ছেড়ে দিল", en: "he gave up the habit" } },
        { left: { bn: "He stopped to smoke.", en: "He stopped to smoke." }, right: { bn: "ধূমপান করার জন্য থামল", en: "he paused in order to have one" } },
        { left: { bn: "I remember locking the door.", en: "I remember locking the door." }, right: { bn: "তালা দিয়েছি, সেটা মনে আছে", en: "I recall that I did it" } },
        { left: { bn: "Remember to lock the door.", en: "Remember to lock the door." }, right: { bn: "তালা দিতে ভুলো না", en: "do not forget to do it" } },
        { left: { bn: "Try restarting the phone.", en: "Try restarting the phone." }, right: { bn: "পরীক্ষা করে দেখো, কাজ হয় কি না", en: "test it as a possible fix" } },
        { left: { bn: "I tried to lift the box.", en: "I tried to lift the box." }, right: { bn: "চেষ্টা করলাম, কঠিন ছিল", en: "I made an effort, and it was hard" } },
        { left: { bn: "I regret saying that.", en: "I regret saying that." }, right: { bn: "বলে ফেলে আফসোস", en: "I am sorry I said it" } },
      ],
    },
    "ing-to-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: কে ধূমপান ছাড়ল?", en: "Guess first: who quit smoking?" },
      ask: { bn: "দুই বন্ধু। Tanvir stopped smoking last year. Habib stopped to smoke outside the shop. কে ধূমপান ছেড়েছে?", en: "Two friends. Tanvir stopped smoking last year. Habib stopped to smoke outside the shop. Who has given up smoking?" },
      choices: [
        { bn: "দুজনেই", en: "Both" },
        { bn: "শুধু তানভীর", en: "Only Tanvir" },
        { bn: "শুধু হাবিব", en: "Only Habib" },
      ],
      answer: { bn: "শুধু তানভীর। হাবিব ধূমপান করার জন্যই থেমেছে।", en: "Only Tanvir. Habib stopped precisely in order to smoke." },
      why: { bn: "stop + -ing মানে কাজটা বন্ধ করা: তানভীর ধূমপানটা পিছনে ফেলেছে। stop + to মানে অন্য একটা কাজ করার জন্য থামা, আর to-র পরের কাজটাই সেই কাজ: হাবিব হাঁটা থামিয়ে ধূমপান করল। একটা to, দুই উল্টো জীবন। -ing পিছনে তাকায়, to সামনে: এই একটা ছবি চারটা ক্রিয়াতেই চলে।", en: "Stop + -ing means ending the activity: Tanvir left smoking behind. Stop + to means pausing in order to do something else, and the thing after to is that something: Habib stopped walking and lit up. One to, two opposite lives. -ing looks back and to looks ahead, and that single picture works for all four verbs." },
    },
    "ing-to-jobs": {
      kind: "figure",
      shape: "flow",
      title: { bn: "-ing চার জায়গায়", en: "-ing in four places" },
      parts: [
        { text: { bn: "কর্তা: Swimming is fun.", en: "Subject: Swimming is fun." }, note: { bn: "কাজটাই বাক্যের বিষয়", en: "the activity is what the sentence is about" }, tone: "lead" },
        { text: { bn: "কর্ম: I enjoy swimming.", en: "Object: I enjoy swimming." }, note: { bn: "-ing-দলের ক্রিয়ার পরে", en: "after an -ing verb" } },
        { text: { bn: "preposition-এর পরে: good at swimming", en: "After a preposition: good at swimming" }, note: { bn: "সবসময়, look forward to সহ", en: "always, look forward to included" }, tone: "good" },
        { text: { bn: "be-র পরে: My hobby is swimming.", en: "After be: My hobby is swimming." }, note: { bn: "পূরক", en: "a complement" } },
      ],
      caption: { bn: "চার জায়গাতেই -ing একটা noun-এর কাজ করছে। বইয়ে নাম gerund।", en: "In all four places -ing does a noun's job. The books call it a gerund." },
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
        { text: "Ma wants ___ the exam this year.", bn: "মা চান আমি এ বছর পরীক্ষাটা পাশ করি।", options: ["that I pass", "me to pass", "me passing"], right: 1, why: { bn: "want + কাউকে + to: wants me to pass। want that নয়।", en: "Want + someone + to: wants me to pass. Never want that." } },
        { text: "I look forward ___ you at Eid.", bn: "ঈদে তোমার সাথে দেখার অপেক্ষায় আছি।", options: ["to see", "to seeing", "seeing"], right: 1, why: { bn: "look forward to-র to preposition: to seeing।", en: "The to in look forward to is a preposition: to seeing." } },
      ],
    },
    "ing-to-purpose": {
      kind: "gap",
      title: { bn: "to-র আরও জায়গা: উদ্দেশ্য, adjective, too, enough", en: "More places for to: purpose, adjectives, too, enough" },
      items: [
        { text: "Rafi went to the field ___.", bn: "রাফি অনুশীলন করতে মাঠে গেল।", options: ["for practise", "to practise", "practising"], right: 1, why: { bn: "উদ্দেশ্য: to practise। for-এর পরে noun বসে, ক্রিয়া নয়।", en: "A purpose: to practise. For takes a noun, not a verb." } },
        { text: "I am happy ___ you again.", bn: "তোমাকে আবার দেখে আমি খুশি।", options: ["seeing", "to see", "see"], right: 1, why: { bn: "adjective-এর পরে to: happy to see।", en: "To after an adjective: happy to see." } },
        { text: "Nanu is too tired ___ tonight.", bn: "নানু আজ রাতে এত ক্লান্ত যে রাঁধতে পারবেন না।", options: ["cooking", "to cook", "for cook"], right: 1, why: { bn: "too + adjective + to: too tired to cook।", en: "Too + adjective + to: too tired to cook." } },
        { text: "Mitu is old enough ___ alone.", bn: "মিতুর একা যাওয়ার মতো বয়স হয়েছে।", options: ["to travel", "travelling", "travel"], right: 0, why: { bn: "adjective + enough + to: old enough to travel।", en: "Adjective + enough + to: old enough to travel." } },
        { text: "English is not hard ___ if you practise daily.", bn: "রোজ অনুশীলন করলে ইংরেজি শেখা কঠিন নয়।", options: ["learning", "to learn", "learn"], right: 1, why: { bn: "hard, easy, difficult-এর পরে to: hard to learn।", en: "To after hard, easy, difficult: hard to learn." } },
        { text: "The bike needs ___; the chain is loose.", bn: "সাইকেলটা সারানো দরকার; চেইনটা ঢিলা।", options: ["repairing", "to repair", "repair"], right: 0, why: { bn: "need + -ing = passive: needs repairing, মানে needs to be repaired।", en: "Need + -ing is passive: needs repairing, meaning needs to be repaired." } },
      ],
    },
    "ing-to-used": {
      kind: "compare",
      title: { bn: "used to-র তিন রূপ", en: "The three shapes of used to" },
      note: { bn: "একই তিনটা শব্দ, তিনটা মানে। be আছে কি না, সেটাই সূত্র।", en: "The same three words, three meanings. Whether be is there is the clue." },
      columns: [
        { bn: "used to + verb", en: "used to + verb" },
        { bn: "be used to + -ing", en: "be used to + -ing" },
        { bn: "get used to + -ing", en: "get used to + -ing" },
      ],
      rows: [
        { label: { bn: "মানে", en: "Meaning" }, cells: [{ bn: "আগে করতাম, এখন করি না", en: "I did it before, not now" }, { bn: "অভ্যস্ত, স্বাভাবিক লাগে", en: "accustomed, it feels normal" }, { bn: "অভ্যস্ত হচ্ছি", en: "becoming accustomed" }] },
        { label: { bn: "উদাহরণ", en: "Example" }, cells: [{ bn: "Nanu used to climb trees.", en: "Nanu used to climb trees." }, { bn: "I am used to waking at five.", en: "I am used to waking at five." }, { bn: "Rafi is getting used to the new school.", en: "Rafi is getting used to the new school." }] },
        { label: { bn: "কাল", en: "Tense" }, cells: [{ bn: "শুধু অতীত", en: "past only" }, { bn: "যেকোনো: am / was used to", en: "any: am / was used to" }, { bn: "যেকোনো: get / got / will get", en: "any: get / got / will get" }] },
        { label: { bn: "পরে", en: "Followed by" }, cells: [{ bn: "খালি ক্রিয়া", en: "a bare verb" }, { bn: "-ing বা noun", en: "-ing or a noun" }, { bn: "-ing বা noun", en: "-ing or a noun" }] },
        { label: { bn: "না-বাচক", en: "Negative" }, cells: [{ bn: "didn't use to", en: "didn't use to" }, { bn: "am not used to", en: "am not used to" }, { bn: "can't get used to", en: "can't get used to" }] },
      ],
    },
    "ing-to-build": {
      kind: "build",
      title: { bn: "জোড়া ঠিক রেখে সাজাও", en: "Build with the pairs intact" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর সময় দেখো প্রথম ক্রিয়ার পরে ঠিক রূপটা গেল কি না।", en: "The words are shuffled. As you build, check the right form follows the first verb." },
      pattern: "verb + -ing  ·  verb + to + verb  ·  verb + object + bare verb",
      lines: [
        { target: "Rafi enjoys playing cricket every Friday.", bn: "রাফি প্রতি শুক্রবার ক্রিকেট খেলতে ভালোবাসে।" },
        { target: "Mitu hopes to become a doctor one day.", bn: "মিতু একদিন ডাক্তার হওয়ার আশা করে।" },
        { target: "The coach made us run ten laps.", bn: "কোচ আমাদের দশ চক্কর দৌড় করালেন।" },
        { target: "I look forward to seeing you at Eid.", bn: "ঈদে তোমার সাথে দেখার অপেক্ষায় আছি।" },
        { target: "Nanu used to climb trees when she was young.", bn: "নানু ছোটবেলায় গাছে চড়তেন।" },
        { target: "Remember to lock the door before leaving.", bn: "যাওয়ার আগে দরজায় তালা দিতে মনে রেখো।" },
      ],
    },
    "ing-to-spot": {
      kind: "spot",
      title: { bn: "রাফির চিঠি, জোড়ার ভুল", en: "Rafi's letter: the pairing mistakes" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইনে -ing, to বা খালি ক্রিয়ার ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line with an -ing, to or bare-verb mistake." },
      source: { bn: "চিঠি: নতুন কোচিং", en: "Letter: the new coaching" },
      lines: [
        { text: { bn: "Dear Tamim, I have started going to a new cricket coaching.", en: "Dear Tamim, I have started going to a new cricket coaching." } },
        { text: { bn: "The coach makes us to run five laps before practice.", en: "The coach makes us to run five laps before practice." }, flag: { bn: "make-এর পরে খালি ক্রিয়া: makes us run।", en: "A bare verb after make: makes us run." } },
        { text: { bn: "I enjoy to bowl, but I avoid batting first.", en: "I enjoy to bowl, but I avoid batting first." }, flag: { bn: "enjoy + -ing: enjoy bowling।", en: "Enjoy + -ing: enjoy bowling." } },
        { text: { bn: "He suggested me to practise at home too.", en: "He suggested me to practise at home too." }, flag: { bn: "suggest-এর পরে মানুষ আর to নয়: suggested practising, বা suggested that I should practise।", en: "No person and no to after suggest: suggested practising, or suggested that I should practise." } },
        { text: { bn: "I am used to waking up early now.", en: "I am used to waking up early now." } },
        { text: { bn: "I look forward to play with you in the holidays.", en: "I look forward to play with you in the holidays." }, flag: { bn: "look forward to + -ing: to playing।", en: "Look forward to + -ing: to playing." } },
        { text: { bn: "Please remember to bring your bat. Write soon.", en: "Please remember to bring your bat. Write soon." } },
      ],
    },
    "ing-to-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "I saw him ___ the road. পুরো পার হওয়াটা দেখেছি। কোনটা?", en: "I saw him ___ the road. I watched the whole crossing. Which?" },
          options: [
            { text: { bn: "cross", en: "cross" }, right: true, why: { bn: "হ্যাঁ। see + object + খালি ক্রিয়া: পুরোটা দেখা।", en: "Yes. See + object + bare verb: the whole action." } },
            { text: { bn: "crossing", en: "crossing" }, why: { bn: "ঠিক ইংরেজি, কিন্তু মানে মাঝখানে দেখা, পুরোটা নয়।", en: "Correct English, but it means catching him mid-way, not the whole crossing." } },
            { text: { bn: "to cross", en: "to cross" }, why: { bn: "না। see-এর পরে কখনো to নয়।", en: "No. Never to after see." } },
          ],
        },
        {
          ask: { bn: "Transformation: He is so weak that he cannot walk. (Use too … to)", en: "Transformation: He is so weak that he cannot walk. (Use too … to)" },
          options: [
            { text: { bn: "He is too weak to walk.", en: "He is too weak to walk." }, right: true, why: { bn: "হ্যাঁ। so … that … cannot হয় too … to, আর cannot হারিয়ে যায়, কারণ too-র ভিতরেই 'পারে না'।", en: "Yes. So … that … cannot becomes too … to, and cannot disappears because too already carries it." } },
            { text: { bn: "He is too weak to not walk.", en: "He is too weak to not walk." }, why: { bn: "না। too-র ভিতরেই না; আবার not নয়।", en: "No. Too already holds the negative; no extra not." } },
            { text: { bn: "He is too weak for walking.", en: "He is too weak for walking." }, why: { bn: "না। too … to, for নয়।", en: "No. Too pairs with to, not for." } },
          ],
        },
        {
          ask: { bn: "Nanu ___ a lot of stories, but she doesn't any more. কোনটা?", en: "Nanu ___ a lot of stories, but she doesn't any more. Which?" },
          options: [
            { text: { bn: "used to tell", en: "used to tell" }, right: true, why: { bn: "হ্যাঁ। আগে করতেন, এখন না: used to + খালি ক্রিয়া।", en: "Yes. She did before and not now: used to + bare verb." } },
            { text: { bn: "is used to telling", en: "is used to telling" }, why: { bn: "না। ওটা অভ্যস্ত হওয়া, আর বর্তমান। এখানে আগের অভ্যাস।", en: "No. That means accustomed, and it is present. This is a past habit." } },
            { text: { bn: "used to telling", en: "used to telling" }, why: { bn: "না। be ছাড়া used to-র পরে খালি ক্রিয়া: used to tell।", en: "No. Without be, used to takes a bare verb: used to tell." } },
          ],
        },
        {
          ask: { bn: "Which sentence is right?", en: "Which sentence is right?" },
          options: [
            { text: { bn: "Ma wants that I become a doctor.", en: "Ma wants that I become a doctor." }, why: { bn: "না। want-এর পরে that নয়: wants me to become।", en: "No. Want takes no that: wants me to become." } },
            { text: { bn: "Ma wants me to become a doctor.", en: "Ma wants me to become a doctor." }, right: true, why: { bn: "হ্যাঁ। want + কাউকে + to।", en: "Yes. Want + someone + to." } },
            { text: { bn: "Ma wants me becoming a doctor.", en: "Ma wants me becoming a doctor." }, why: { bn: "না। want সামনে তাকায়: to।", en: "No. Want looks ahead: to." } },
          ],
        },
      ],
    },
    "ing-to-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "পাঁচটা enjoy আর পাঁচটা want: I enjoy… I want to…", en: "Five with enjoy and five with want: I enjoy… I want to…" } },
        { text: { bn: "এ বছরের তিনটা সিদ্ধান্ত আর দুটো কথা: I decided to… I promise to…", en: "Three decisions and two promises for this year: I decided to… I promise to…" } },
        { text: { bn: "চার জোড়া জোরে: stop smoking / stop to smoke, remember locking / remember to lock।", en: "Four pairs aloud: stop smoking / stop to smoke, remember locking / remember to lock." } },
        { text: { bn: "নিজের পাঁচটা preposition + -ing: I am good at… I am afraid of… I look forward to…", en: "Five of your own with a preposition + -ing: I am good at… I am afraid of… I look forward to…" } },
        { text: { bn: "ছোটবেলার তিনটা used to, আর এখনকার দুটো be used to: I used to… I am used to…", en: "Three used to sentences about childhood and two be used to about now: I used to… I am used to…" } },
        { text: { bn: "পরিবারের তিনজন তোমাকে কী করতে চায়, want + me + to দিয়ে: Ma wants me to… Baba wants me to…", en: "What three people at home want you to do, with want + me + to: Ma wants me to… Baba wants me to…" } },
      ],
    },
  },
};
