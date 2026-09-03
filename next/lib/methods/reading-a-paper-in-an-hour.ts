import type { MethodLesson } from "../research-methods";

export const LESSON: MethodLesson = {
  slug: "reading-a-paper-in-an-hour",
  minutes: 5,
  en: `<div class="at-a-glance"><p class="at-a-glance-label">At a glance</p><ul>
<li>Three passes: five minutes for the shape, twenty for the argument, thirty for the method.</li>
<li>Write something after each pass, before starting the next.</li>
<li>Stop after any pass if the paper is not for you. That is the hour working, not failing.</li>
<li>The last thing you write is one line: what the paper found, and what it means for your question.</li>
</ul></div>

<p>A doctoral student reads hundreds of papers. Most of them deserve five minutes, a few deserve an hour, and a handful deserve a week. The mistake is to read all of them the same way, first word to last, and to reach the end of an afternoon with two papers finished and nothing written down. The method here is three passes, and each one ends with a decision about whether to make the next.</p>

<h2>Pass one: the shape (five to ten minutes)</h2>
<p>Read the title, the abstract, the section headings, every figure and table with its caption, and the conclusion. Do not read the introduction and do not read the method. You are asking four questions: what is this paper about, what does it claim to have found, what kind of paper is it (empirical, theoretical, a review), and is it about my question or only near it.</p>
<p>Write two or three lines. What the paper claims, what kind of evidence it seems to use, and a decision: stop here, or make the second pass.</p>

<h2>Pass two: the argument (twenty minutes)</h2>
<p>Now read the introduction and the whole of the results and discussion, but skip the proofs, the robustness appendix and the estimation detail. Read to follow the argument: what question, what gap, what data in broad terms, what finding, and what the authors say it means. Mark every claim you would want to check and every number you may want to use. Mark the references you do not know.</p>
<p>Write a short paragraph in your own words: the question, the design, the main result with its size, and what you doubt. Then decide again.</p>

<h2>Pass three: the method (thirty minutes)</h2>
<p>This pass is only for a paper that will be cited in your own argument or copied in your own design. Read the method and the identification line by line, and try to rebuild it: what is the unit of observation, what is compared with what, where does the variation come from, what would have to be true for the estimate to be causal, and what did they do about the things that could be untrue. Read the tables again, knowing now what is in them. Read the robustness section asking which check you would have asked for and whether it is there.</p>
<p>Write the notes a literature note needs: sample, method, effect size, limitation, and how it bears on your question. That is the next lesson.</p>

<h2>The one-line takeaway</h2>
<p>After whichever pass you stop at, write one line. Not a summary of the paper: a sentence that says what the paper found and what it means for what you are doing. "Flood losses to farm income were mostly recovered within two seasons, so a one-year window will miss the recovery" is a takeaway. "This paper studies floods and income" is a filing label. The reading room asks for this line because in six months the line is the only thing you will read.</p>

<div class="ex"><b>Worked example.</b> An empirical paper on farm income after a flood, of the shape these papers usually take: household panel data from a delta region, two survey rounds before a major flood and three after, about 2,400 households, a difference in differences comparing villages inside the mapped flood extent with villages outside it, and income in real terms per adult.
<p>After pass one: "Empirical, panel DiD, flooded versus unflooded villages, 5 rounds. Claims income fell about 30 per cent in the flood year and was back on trend by the third year after. Figure 2 is the whole story: a dip and a recovery. Table 4 splits by landholding. Relevant to my insurance question: this is what happens without it. Make pass two."</p>
<p>After pass two: "Question: how long does a flood shock to income last. Design: villages inside the mapped flood extent as treated, outside as control, household fixed effects. Result: minus 31 per cent in the flood year (standard error about 6), minus 12 in the year after, not distinguishable from zero by the second year. Landless households recover slower: minus 19 in the year after against minus 7 for landowners. Authors say informal transfers explain the fast recovery. Doubts: were unflooded villages really unaffected (prices, labour markets), and is the flood map measuring exposure or just lowland. Pass three, because this is the comparison my chapter needs."</p>
<p>After pass three: "Unit: household by year. Variation: the flood extent map, which is satellite-derived, so exposure is a village attribute rather than reported damage. They test pre-trends and the two pre-flood rounds are flat, which is the strongest thing in the paper. Clustered at the village, 140 villages, fine. No consumption data, so 'recovery' is income recovery and could be borrowing. No attrition table: 2,400 households in round one, 2,180 in round five, and the missing 220 are not described. The recovery could be selection if the worst-hit households left."</p>
<p>One line: "Farm income recovers from a flood in about two years without insurance, but the paper cannot separate recovery from borrowing or from the hardest-hit households leaving the sample, so my insurance comparison needs consumption, not income."</p></div>

<h2>Where it goes wrong</h2>
<ul>
<li><strong>Reading the introduction first.</strong> An introduction is written to make you continue. The abstract and the figures are written to tell you what happened.</li>
<li><strong>Not writing between passes.</strong> A pass with no note leaves nothing behind, and the next paper writes over it.</li>
<li><strong>Making the third pass out of guilt.</strong> Most papers do not need it. The hour is for the ones that do.</li>
<li><strong>Copying the abstract as the takeaway.</strong> The abstract says what the authors found. The takeaway says what it means for you.</li>
<li><strong>Trusting a figure without reading its axis.</strong> A dip that looks like 30 per cent is 3 per cent on an axis that starts at 0.9.</li>
</ul>

<ul class="checklist">
<li>Pass one done: title, abstract, headings, every figure, conclusion. Two lines written.</li>
<li>Decision made: stop, or go on.</li>
<li>Pass two done: introduction, results, discussion. A paragraph in my own words.</li>
<li>Pass three, if needed: method rebuilt, robustness read, sample and attrition checked.</li>
<li>One line written: what it found and what it means for my question.</li>
<li>The paper is filed with that line attached, not with the abstract.</li>
</ul>

<p>The reading room is where this happens: a PDF drawn on this origin, a highlight anchored to its words, and a box for the one-line takeaway before a source is marked as read. The library keeps that line beside the source.</p>`,
  bn: `<div class="at-a-glance"><p class="at-a-glance-label">এক নজরে</p><ul>
<li>তিন বার পড়া: আকার বুঝতে পাঁচ মিনিট, যুক্তি বুঝতে বিশ, পদ্ধতি বুঝতে ত্রিশ।</li>
<li>প্রতিবার পড়ার পরে কিছু লিখুন, তারপর পরের বারে যান।</li>
<li>কাগজটা আপনার কাজের না হলে যেকোনো ধাপে থামুন। সেটা ঘণ্টাটা কাজ করছে, নষ্ট হচ্ছে না।</li>
<li>শেষে এক লাইন লিখুন: কাগজটা কী পেয়েছে, আর আপনার প্রশ্নের জন্য তার মানে কী।</li>
</ul></div>

<p>একজন পিএইচডি গবেষক শত শত কাগজ পড়েন। বেশিরভাগের জন্য পাঁচ মিনিটই যথেষ্ট, কয়েকটার জন্য এক ঘণ্টা, আর হাতে গোনা কয়েকটার জন্য এক সপ্তাহ। ভুলটা হয় সবগুলো একইভাবে পড়লে, প্রথম শব্দ থেকে শেষ শব্দ পর্যন্ত। তাতে বিকেল শেষে দুটো কাগজ পড়া হয়, আর কিছুই লেখা থাকে না। এখানকার পদ্ধতি তিন বার পড়া, আর প্রতিবারের শেষে একটা সিদ্ধান্ত: পরের বার পড়ব কি না।</p>

<h2>প্রথম বার: আকার (পাঁচ থেকে দশ মিনিট)</h2>
<p>শিরোনাম, সারাংশ, অংশগুলোর নাম, প্রতিটি ছবি আর ছক তার ক্যাপশনসহ, আর উপসংহার পড়ুন। ভূমিকা পড়বেন না, পদ্ধতিও না। চারটা প্রশ্ন করছেন: কাগজটা কী নিয়ে, কী পেয়েছে বলে দাবি করছে, কী ধরনের কাগজ (তথ্যভিত্তিক, তত্ত্বের, নাকি পর্যালোচনা), আর এটা আমার প্রশ্নের কাগজ নাকি শুধু কাছাকাছি।</p>
<p>দুই-তিন লাইন লিখুন। কাগজটা কী দাবি করছে, কী ধরনের প্রমাণ ব্যবহার করছে বলে মনে হচ্ছে, আর একটা সিদ্ধান্ত: এখানেই থামব, নাকি দ্বিতীয় বার পড়ব।</p>

<h2>দ্বিতীয় বার: যুক্তি (বিশ মিনিট)</h2>
<p>এবার ভূমিকা আর পুরো ফলাফল ও আলোচনা পড়ুন। প্রমাণের অংশ, রোবাস্টনেসের পরিশিষ্ট আর হিসাবের খুঁটিনাটি বাদ দিন। যুক্তিটা ধরার জন্য পড়ুন: কী প্রশ্ন, কী ফাঁক, মোটা দাগে কী ডেটা, কী পাওয়া গেল, আর লেখকেরা তার কী মানে করছেন। যে দাবি যাচাই করতে চান আর যে সংখ্যা কাজে লাগাতে পারেন, সব দাগিয়ে রাখুন। যে সূত্রগুলো চেনেন না, সেগুলোও।</p>
<p>নিজের কথায় ছোট একটা অনুচ্ছেদ লিখুন: প্রশ্ন, নকশা, প্রধান ফল তার মাপসহ, আর কোথায় সন্দেহ। তারপর আবার সিদ্ধান্ত নিন।</p>

<h2>তৃতীয় বার: পদ্ধতি (ত্রিশ মিনিট)</h2>
<p>এই বারটা শুধু সেই কাগজের জন্য, যেটা আপনার নিজের যুক্তিতে উদ্ধৃত হবে বা যার নকশা আপনি নিজের কাজে নেবেন। পদ্ধতি আর শনাক্তকরণের অংশ লাইন ধরে পড়ুন, আর নিজে গড়ে তোলার চেষ্টা করুন: পর্যবেক্ষণের একক কী, কার সঙ্গে কার তুলনা, পার্থক্যটা কোথা থেকে আসছে, হিসাবটা কার্যকারণ হতে হলে কী কী সত্যি হতে হবে, আর যা সত্যি না-ও হতে পারে তা নিয়ে তাঁরা কী করেছেন। ছকগুলো আবার পড়ুন, এবার জেনে যে তাতে কী আছে। রোবাস্টনেসের অংশ পড়ুন এই প্রশ্ন নিয়ে: আমি কোন পরীক্ষা চাইতাম, আর সেটা আছে কি না।</p>
<p>পড়ার নোটে যা লাগে সেগুলো লিখুন: নমুনা, পদ্ধতি, প্রভাবের মাপ, সীমাবদ্ধতা, আর আমার প্রশ্নে এর সম্পর্ক। সেটা পরের পাঠ।</p>

<h2>এক লাইনের সারকথা</h2>
<p>যে ধাপেই থামুন, তারপর এক লাইন লিখুন। কাগজের সারাংশ নয়: একটা বাক্য, যা বলে কাগজটা কী পেয়েছে আর আপনার কাজের জন্য তার মানে কী। "বন্যায় খামারের আয়ের ক্ষতি দুই মৌসুমের মধ্যে প্রায় পুরোটা ফিরে এসেছে, তাই এক বছরের জানালায় ফিরে আসাটা ধরা পড়বে না" একটা সারকথা। "এই কাগজ বন্যা আর আয় নিয়ে" একটা ফাইলের লেবেল। পড়ার ঘর এই লাইনটা চায়, কারণ ছয় মাস পরে এই লাইনটাই আপনি পড়বেন, আর কিছু না।</p>

<div class="ex"><b>করে দেখানো উদাহরণ।</b> বন্যার পরে খামারের আয় নিয়ে একটা তথ্যভিত্তিক কাগজ, এ ধরনের কাগজ যেমন হয়: একটা বদ্বীপ অঞ্চলের খানা জরিপের প্যানেল ডেটা, বড় বন্যার আগে দুই দফা আর পরে তিন দফা জরিপ, প্রায় ২,৪০০ খানা, মানচিত্রে বন্যার সীমার ভেতরের গ্রামের সঙ্গে বাইরের গ্রামের তুলনা (difference in differences), আর প্রকৃত মূল্যে প্রাপ্তবয়স্ক প্রতি আয়।
<p>প্রথম বারের পরে: "তথ্যভিত্তিক, প্যানেল DiD, প্লাবিত বনাম অপ্লাবিত গ্রাম, ৫ দফা। দাবি: বন্যার বছরে আয় প্রায় ৩০ শতাংশ কমেছে, তৃতীয় বছরে আগের ধারায় ফিরেছে। ছবি ২-ই পুরো গল্প: একটা পতন আর ফিরে আসা। ছক ৪ জমির মালিকানা ধরে ভাগ। বিমা নিয়ে আমার প্রশ্নের জন্য দরকারি: বিমা না থাকলে কী হয়, এটা তা-ই। দ্বিতীয় বার পড়ব।"</p>
<p>দ্বিতীয় বারের পরে: "প্রশ্ন: বন্যার ধাক্কা আয়ে কতদিন থাকে। নকশা: মানচিত্রে বন্যার সীমার ভেতরের গ্রাম চিকিৎসিত, বাইরের গ্রাম নিয়ন্ত্রণ, খানার ফিক্সড এফেক্ট। ফল: বন্যার বছরে মাইনাস ৩১ শতাংশ (স্ট্যান্ডার্ড এরর প্রায় ৬), পরের বছর মাইনাস ১২, দ্বিতীয় বছরে শূন্য থেকে আলাদা করা যায় না। ভূমিহীন খানা ধীরে ফেরে: পরের বছর মাইনাস ১৯, জমির মালিকদের মাইনাস ৭। লেখকেরা বলছেন আত্মীয় আর প্রতিবেশীর সাহায্যই দ্রুত ফেরার কারণ। সন্দেহ: অপ্লাবিত গ্রাম কি সত্যিই অছোঁয়া ছিল (দাম, শ্রমের বাজার), আর বন্যার মানচিত্র কি ক্ষতির মুখোমুখি হওয়া মাপছে নাকি শুধু নিচু জমি। তৃতীয় বার পড়ব, কারণ আমার অধ্যায়ের তুলনাটা এটাই।"</p>
<p>তৃতীয় বারের পরে: "একক: খানা, বছর ধরে। পার্থক্য: বন্যার মানচিত্র থেকে, যা উপগ্রহের ছবি থেকে আঁকা, তাই ক্ষতির মুখোমুখি হওয়াটা গ্রামের বৈশিষ্ট্য, খানার জানানো ক্ষতি নয়। আগের ধারা পরীক্ষা করেছেন, বন্যার আগের দুই দফা সমতল, কাগজের সবচেয়ে জোরালো জায়গা এটাই। গ্রাম ধরে ক্লাস্টার, ১৪০ গ্রাম, ঠিক আছে। ভোগের ডেটা নেই, তাই 'ফিরে আসা' মানে আয় ফিরে আসা, সেটা ধারও হতে পারে। ঝরে পড়ার ছক নেই: প্রথম দফায় ২,৪০০ খানা, পঞ্চম দফায় ২,১৮০, আর হারানো ২২০ খানার কথা কোথাও নেই। সবচেয়ে ক্ষতিগ্রস্ত খানাগুলো চলে গিয়ে থাকলে ফিরে আসাটা বাছাইয়ের ফল হতে পারে।"</p>
<p>এক লাইন: "বিমা ছাড়াই খামারের আয় বন্যা থেকে প্রায় দুই বছরে ফেরে, কিন্তু কাগজটা ফিরে আসাকে ধার থেকে, বা সবচেয়ে ক্ষতিগ্রস্তদের নমুনা ছেড়ে যাওয়া থেকে, আলাদা করতে পারে না। তাই আমার বিমার তুলনায় ভোগ লাগবে, আয় নয়।"</p></div>

<h2>কোথায় ভুল হয়</h2>
<ul>
<li><strong>আগে ভূমিকা পড়া।</strong> ভূমিকা লেখা হয় আপনাকে পড়িয়ে নিতে। সারাংশ আর ছবি লেখা হয় কী হয়েছে বলতে।</li>
<li><strong>দুই বারের মাঝে না লেখা।</strong> নোট ছাড়া একবার পড়া কিছু রেখে যায় না, আর পরের কাগজ তার ওপর লেখে।</li>
<li><strong>অপরাধবোধ থেকে তৃতীয় বার পড়া।</strong> বেশিরভাগ কাগজের সেটা লাগে না। ঘণ্টাটা সেগুলোর জন্য, যেগুলোর লাগে।</li>
<li><strong>সারাংশ টুকে সারকথা বানানো।</strong> সারাংশ বলে লেখকেরা কী পেয়েছেন। সারকথা বলে আপনার জন্য তার মানে কী।</li>
<li><strong>অক্ষ না পড়ে ছবি বিশ্বাস করা।</strong> যে পতন ৩০ শতাংশ দেখায়, ০.৯ থেকে শুরু হওয়া অক্ষে সেটা ৩ শতাংশ।</li>
</ul>

<ul class="checklist">
<li>প্রথম বার শেষ: শিরোনাম, সারাংশ, অংশের নাম, প্রতিটি ছবি, উপসংহার। দুই লাইন লেখা।</li>
<li>সিদ্ধান্ত নেওয়া: থামব, নাকি এগোব।</li>
<li>দ্বিতীয় বার শেষ: ভূমিকা, ফলাফল, আলোচনা। নিজের কথায় একটা অনুচ্ছেদ।</li>
<li>দরকার হলে তৃতীয় বার: পদ্ধতি নিজে গড়া, রোবাস্টনেস পড়া, নমুনা আর ঝরে পড়া দেখা।</li>
<li>এক লাইন লেখা: কী পেয়েছে আর আমার প্রশ্নের জন্য মানে কী।</li>
<li>কাগজটা ওই লাইনসহ রাখা, সারাংশসহ নয়।</li>
</ul>

<p>পড়ার ঘরেই এটা হয়: এই সাইটেই আঁকা একটা PDF, শব্দে গাঁথা হাইলাইট, আর কোনো সূত্রকে পড়া হয়েছে বলে চিহ্নিত করার আগে এক লাইনের সারকথার একটা ঘর। লাইব্রেরি সূত্রের পাশে সেই লাইনটা রাখে।</p>`,
};
