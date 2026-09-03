import type { MethodLesson } from "../research-methods";

export const LESSON: MethodLesson = {
  slug: "screening-without-losing-your-mind",
  minutes: 5,
  en: `<div class="at-a-glance"><p class="at-a-glance-label">At a glance</p><ul>
<li>Write the criteria before you open the first record. Screening with criteria you are still inventing is not screening.</li>
<li>Every record gets an id the day it arrives and keeps it for the life of the review.</li>
<li>Two passes, never one: title and abstract first, full text second.</li>
<li>Every exclusion carries a reason from a fixed list. "Not relevant" is not a reason.</li>
<li>A second screener on a sample, and one number, Cohen's kappa, says how well you agreed.</li>
<li>PRISMA 2020 is arithmetic on your counts. If the boxes do not add up, a count is wrong, not the diagram.</li>
</ul></div>

<h2>Why screening goes wrong</h2>
<p>A search brings back a thousand records. Most are not what you want, and the temptation is to start reading at the top and decide as you go. Three weeks later, record 700 is being judged by a stricter person than record 7 was, you cannot say why record 312 went out, and an examiner asks how many were excluded for each reason and you have nothing. Three failures, one cause: the rules were in your head, and your head changed.</p>

<h2>Before the first record</h2>
<ol class="step-list">
<li><strong>Write the criteria as questions with a yes or no answer.</strong> Population, intervention or exposure, comparison, outcome, study design, dates, languages. Then write the exclusion reasons as a short fixed list with a code: E1 wrong population, E2 no comparison group, E3 not empirical, E4 outcome not measured, E5 language. Put them in order, because a paper that fails two gets the first one it fails.</li>
<li><strong>Give every record an id.</strong> Export each database search, note how many came from each, remove the duplicates, and number what is left R0001 onwards. An id is never changed and never reused. If you rerun the search later, the new records start where the old ones stopped.</li>
<li><strong>Pilot on fifty.</strong> Two people, blind to each other, on the same fifty. Where you disagree, the criterion is unclear: fix the wording, not the decision, and start the real screen only after that.</li>
</ol>

<h2>Pass one: title and abstract</h2>
<p>Fast and generous. The question is "could this be included?", not "is it included?". If in doubt, keep it. You are removing what is plainly out: the wrong topic, an editorial, a conference abstract with no data. Every exclusion still gets a code, because the codes are what the diagram is drawn from. Eight or nine in ten records usually leave here.</p>

<h2>Pass two: full text</h2>
<p>Slow and strict. Now the question is "does it meet every criterion?". Fetch the paper. If after a real attempt (the library, an email to the author) you cannot, that is "not retrieved", and it is its own count rather than a quiet exclusion. Each excluded paper gets one main reason, the first on your ordered list that it fails. One reason each is what makes the reasons add up to the total.</p>

<h2>A second screener and one number</h2>
<p>Cohen's kappa compares how often two screeners agreed with how often they would have agreed by chance, so 1 is perfect agreement, 0 is chance, and anything above about 0.6 is usually taken as good enough to carry on. Disagreements are settled by talking, or by a third person, and the settlement is written down beside the record.</p>
<div class="ex"><b>Worked example.</b> Two screeners, the same 100 abstracts. Both said include on 15, both said exclude on 75, and they disagreed on 10. Observed agreement is 90 out of 100, so 0.90. Screener A included 21 in all and screener B included 19. The chance that both include by luck is 0.21 times 0.19, which is 0.0399; the chance both exclude by luck is 0.79 times 0.81, which is 0.6399; together, 0.6798. Kappa is (0.90 minus 0.6798) divided by (1 minus 0.6798), which is 0.2202 divided by 0.3202, which is 0.69. Good enough to continue, and the ten disagreements are the ten records to talk about.</div>

<h2>The counts become the diagram</h2>
<div class="ex"><b>Worked example.</b> Three databases returned 612, 418 and 210 records: 1,240 identified. Removing duplicates took out 315, leaving 925 to screen. Title and abstract excluded 812, so 113 papers were sought in full. Six could not be retrieved, so 107 were assessed. Of those, 84 were excluded: 31 wrong population, 22 no comparison group, 17 not empirical, 9 outcome not measured, 5 language. That leaves 23 studies included. Check every step: 1,240 minus 315 is 925; 925 minus 812 is 113; 113 minus 6 is 107; 107 minus 84 is 23; and 31 plus 22 plus 17 plus 9 plus 5 is 84.</div>
<div class="table-scroll"><table>
<thead><tr><th>PRISMA 2020 box</th><th>Count</th></tr></thead>
<tbody>
<tr><td>Records identified from databases</td><td>1,240</td></tr>
<tr><td>Duplicate records removed</td><td>315</td></tr>
<tr><td>Records screened</td><td>925</td></tr>
<tr><td>Records excluded</td><td>812</td></tr>
<tr><td>Reports sought for retrieval</td><td>113</td></tr>
<tr><td>Reports not retrieved</td><td>6</td></tr>
<tr><td>Reports assessed for eligibility</td><td>107</td></tr>
<tr><td>Reports excluded, with reasons</td><td>84 (31, 22, 17, 9, 5)</td></tr>
<tr><td>Studies included in review</td><td>23</td></tr>
</tbody></table></div>

<div class="side-note"><p class="side-note-label">Records, reports, studies</p><p>PRISMA 2020 uses three words on purpose. A record is a database hit. A report is a document. A study is a piece of research. One study can appear in two reports, and one report can describe two studies, so the last box counts studies and the boxes above it count reports, and the number can differ.</p></div>

<h2>Where it goes wrong</h2>
<ul>
<li>The criteria were tightened halfway through, and records 1 to 400 were never screened again under the new rule.</li>
<li>Exclusion reason: "not relevant". Nobody, including you in six months, can say what that meant.</li>
<li>One screener, no sample checked by a second, and no kappa. An examiner will ask.</li>
<li>A paper excluded under two reasons, so the reasons add to more than the exclusions.</li>
<li>The search was rerun before submission and the new records were merged into the old numbering.</li>
<li>Reports counted as studies, so three papers on one trial became three studies.</li>
</ul>
<p class="note">Never delete a record. A record that is out is a record with a reason on it. Deleting is how the boxes stop adding up, and there is no way back.</p>

<h2>Checklist</h2>
<ul class="checklist">
<li>Criteria and exclusion codes written and dated before screening began.</li>
<li>Count from each database recorded before deduplication.</li>
<li>Every record has an id that has not changed.</li>
<li>Every excluded record has exactly one code.</li>
<li>A second screener has done at least a sample, and kappa is reported.</li>
<li>"Not retrieved" is counted separately from "excluded".</li>
<li>Every subtraction in the diagram has been checked by hand.</li>
</ul>

<p>The review room in the studio holds the records with their ids and a reason on every exclusion, and the workshop's PRISMA drawer draws the diagram out of those counts, so the boxes cannot disagree with the table.</p>`,
  bn: `<div class="at-a-glance"><p class="at-a-glance-label">এক নজরে</p><ul>
<li>প্রথম রেকর্ড খোলার আগেই মানদণ্ড লিখুন। যে নিয়ম এখনও বানাচ্ছেন, তা দিয়ে বাছাই করা বাছাই নয়।</li>
<li>প্রতিটি রেকর্ড আসার দিনই একটা আইডি পায়, আর সেটা শেষ পর্যন্ত থাকে।</li>
<li>দুই ধাপ, কখনও এক নয়: আগে শিরোনাম আর সারাংশ, পরে পুরো লেখা।</li>
<li>প্রতিটি বাদের সঙ্গে একটা কারণ, আগে থেকে ঠিক করা তালিকা থেকে। "প্রাসঙ্গিক নয়" কোনো কারণ নয়।</li>
<li>একটা নমুনায় দ্বিতীয় একজন বাছাই করেন, আর একটা সংখ্যা, Cohen's kappa, বলে দেয় দুজন কতটা মিললেন।</li>
<li>PRISMA 2020 আপনার গণনার যোগ-বিয়োগ। ঘরগুলো না মিললে ছবিটা ভুল নয়, কোনো একটা গণনা ভুল।</li>
</ul></div>

<h2>বাছাই কেন গোলমাল হয়</h2>
<p>একটা খোঁজে হাজারখানেক রেকর্ড আসে। বেশির ভাগই আপনার কাজের নয়, আর লোভ হয় ওপর থেকে পড়া শুরু করে যেতে যেতে ঠিক করার। তিন সপ্তাহ পরে ৭০০ নম্বর রেকর্ডকে যিনি বিচার করছেন, তিনি ৭ নম্বরের বিচারকের চেয়ে কড়া। ৩১২ নম্বর কেন বাদ গেল, আপনি বলতে পারেন না। পরীক্ষক জিজ্ঞেস করেন কোন কারণে কতগুলো বাদ গেছে, আর আপনার হাতে কিছু নেই। তিনটা সমস্যা, কারণ একটাই: নিয়ম ছিল মাথায়, আর মাথা বদলে গেছে।</p>

<h2>প্রথম রেকর্ডের আগে</h2>
<ol class="step-list">
<li><strong>মানদণ্ড লিখুন এমন প্রশ্ন হিসেবে, যার উত্তর হ্যাঁ বা না।</strong> কাদের নিয়ে গবেষণা, কী করা হয়েছে, কার সঙ্গে তুলনা, কী মাপা হয়েছে, গবেষণার ধরন, সময়, ভাষা। তারপর বাদ দেওয়ার কারণগুলো ছোট একটা তালিকায় লিখুন, প্রতিটির একটা কোড: E1 ভুল জনগোষ্ঠী, E2 তুলনার দল নেই, E3 তথ্যভিত্তিক নয়, E4 ফলাফল মাপা হয়নি, E5 ভাষা। তালিকাটা ক্রমে সাজান, কারণ যে লেখা দুটোয় আটকায়, সে প্রথমটার কোড পাবে।</li>
<li><strong>প্রতিটি রেকর্ডকে একটা আইডি দিন।</strong> প্রতিটি ডেটাবেসের খোঁজ আলাদা করে নামান, কোনটা থেকে কতগুলো এল লিখে রাখুন, নকলগুলো সরান, আর যা থাকল তাতে R0001 থেকে নম্বর দিন। আইডি কখনও বদলায় না, আবার ব্যবহার হয় না। পরে খোঁজ আবার চালালে নতুন রেকর্ড পুরোনো নম্বরের পর থেকে শুরু হবে।</li>
<li><strong>পঞ্চাশটায় মহড়া দিন।</strong> দুজন, একে অন্যের সিদ্ধান্ত না দেখে, একই পঞ্চাশটায়। যেখানে দুজন আলাদা বললেন, সেখানে মানদণ্ডটাই অস্পষ্ট: সিদ্ধান্ত নয়, কথাটা ঠিক করুন। আসল বাছাই তার পরে।</li>
</ol>

<h2>প্রথম ধাপ: শিরোনাম আর সারাংশ</h2>
<p>দ্রুত আর উদার। প্রশ্ন হলো "এটা কি নেওয়া যেতে পারে?", "এটা কি নেওয়া হলো?" নয়। সন্দেহ হলে রাখুন। এখানে সরাবেন যা স্পষ্টই বাইরে: ভুল বিষয়, সম্পাদকীয়, তথ্যহীন সম্মেলনের সারাংশ। তবু প্রতিটি বাদের একটা কোড থাকবে, কারণ কোড থেকেই ছবিটা আঁকা হয়। সাধারণত দশে আট-নয়টা রেকর্ড এখানেই বিদায় নেয়।</p>

<h2>দ্বিতীয় ধাপ: পুরো লেখা</h2>
<p>ধীরে আর কড়া। এবার প্রশ্ন "প্রতিটি মানদণ্ড কি মিলছে?"। লেখাটা জোগাড় করুন। সত্যিকারের চেষ্টার পরেও (লাইব্রেরি, লেখককে ইমেল) না পেলে সেটা "পাওয়া যায়নি", আর তার গণনা আলাদা, চুপচাপ বাদ নয়। বাদ পড়া প্রতিটি লেখা পায় একটাই মূল কারণ: আপনার সাজানো তালিকায় যেটায় সে প্রথম আটকাল। প্রতিটির একটা কারণ, এ জন্যই কারণগুলোর যোগফল মোটের সঙ্গে মেলে।</p>

<h2>দ্বিতীয় বাছাইকারী আর একটা সংখ্যা</h2>
<p>Cohen's kappa দেখে দুজন কতবার মিললেন, আর নিছক কাকতালে কতবার মিলতেন। ১ মানে পুরো মিল, ০ মানে কাকতালের সমান, আর মোটামুটি ০.৬-এর ওপরে হলে সাধারণত এগোনোর মতো ধরা হয়। যেখানে দুজন আলাদা বললেন, তা কথা বলে বা তৃতীয় কাউকে দিয়ে মেটান, আর মীমাংসাটা রেকর্ডের পাশে লিখে রাখুন।</p>
<div class="ex"><b>করে দেখানো।</b> দুজন বাছাইকারী, একই ১০০টা সারাংশ। ১৫টায় দুজনেই বললেন নাও, ৭৫টায় দুজনেই বললেন বাদ, ১০টায় দুজন আলাদা। দেখা মিল ১০০-তে ৯০, মানে ০.৯০। প্রথমজন মোট ২১টা নিলেন, দ্বিতীয়জন ১৯টা। কাকতালে দুজনেরই নেওয়ার সম্ভাবনা ০.২১ গুণ ০.১৯, মানে ০.০৩৯৯; দুজনেরই বাদ দেওয়ার সম্ভাবনা ০.৭৯ গুণ ০.৮১, মানে ০.৬৩৯৯; মোট ০.৬৭৯৮। Kappa হলো (০.৯০ বিয়োগ ০.৬৭৯৮) ভাগ (১ বিয়োগ ০.৬৭৯৮), মানে ০.২২০২ ভাগ ০.৩২০২, মানে ০.৬৯। এগোনোর মতো, আর ওই দশটা অমিলই দশটা আলোচনার রেকর্ড।</div>

<h2>গণনা থেকে ছবি</h2>
<div class="ex"><b>করে দেখানো।</b> তিনটা ডেটাবেস দিল ৬১২, ৪১৮ আর ২১০টা রেকর্ড: মোট ১,২৪০। নকল সরাতে গেল ৩১৫টা, বাছাইয়ের জন্য থাকল ৯২৫। শিরোনাম আর সারাংশে বাদ গেল ৮১২, তাই পুরো লেখা খোঁজা হলো ১১৩টার। ছয়টা পাওয়া গেল না, তাই যাচাই হলো ১০৭টা। তার মধ্যে বাদ ৮৪: ভুল জনগোষ্ঠী ৩১, তুলনার দল নেই ২২, তথ্যভিত্তিক নয় ১৭, ফলাফল মাপা হয়নি ৯, ভাষা ৫। থাকল ২৩টা গবেষণা। প্রতিটি ধাপ মিলিয়ে দেখুন: ১,২৪০ বিয়োগ ৩১৫ হলো ৯২৫; ৯২৫ বিয়োগ ৮১২ হলো ১১৩; ১১৩ বিয়োগ ৬ হলো ১০৭; ১০৭ বিয়োগ ৮৪ হলো ২৩; আর ৩১ যোগ ২২ যোগ ১৭ যোগ ৯ যোগ ৫ হলো ৮৪।</div>
<div class="table-scroll"><table>
<thead><tr><th>PRISMA 2020-এর ঘর</th><th>সংখ্যা</th></tr></thead>
<tbody>
<tr><td>ডেটাবেস থেকে পাওয়া রেকর্ড</td><td>১,২৪০</td></tr>
<tr><td>নকল সরানো</td><td>৩১৫</td></tr>
<tr><td>বাছাই করা রেকর্ড</td><td>৯২৫</td></tr>
<tr><td>বাদ দেওয়া রেকর্ড</td><td>৮১২</td></tr>
<tr><td>পুরো লেখা খোঁজা হয়েছে</td><td>১১৩</td></tr>
<tr><td>পাওয়া যায়নি</td><td>৬</td></tr>
<tr><td>যাচাই করা লেখা</td><td>১০৭</td></tr>
<tr><td>কারণসহ বাদ</td><td>৮৪ (৩১, ২২, ১৭, ৯, ৫)</td></tr>
<tr><td>রিভিউতে নেওয়া গবেষণা</td><td>২৩</td></tr>
</tbody></table></div>

<div class="side-note"><p class="side-note-label">রেকর্ড, লেখা, গবেষণা</p><p>PRISMA 2020 ইচ্ছে করেই তিনটা আলাদা শব্দ ব্যবহার করে। রেকর্ড হলো ডেটাবেসের একটা ফল। লেখা হলো একটা দলিল। গবেষণা হলো একটা কাজ। একটা গবেষণা দুটো লেখায় আসতে পারে, একটা লেখায় দুটো গবেষণা থাকতে পারে। তাই শেষ ঘরে গোনা হয় গবেষণা, তার ওপরের ঘরগুলোয় লেখা, আর সংখ্যা দুটো আলাদা হতে পারে।</p></div>

<h2>কোথায় ভুল হয়</h2>
<ul>
<li>মাঝপথে মানদণ্ড কড়া করা হলো, আর ১ থেকে ৪০০ নম্বর রেকর্ড নতুন নিয়মে আর দেখা হলো না।</li>
<li>বাদের কারণ: "প্রাসঙ্গিক নয়"। ছয় মাস পরে আপনি নিজেও বলতে পারবেন না এর মানে কী ছিল।</li>
<li>একজনই বাছাই করলেন, দ্বিতীয় কেউ নমুনা দেখলেন না, kappa নেই। পরীক্ষক জিজ্ঞেস করবেন।</li>
<li>একটা লেখা দুটো কারণে বাদ, তাই কারণগুলোর যোগ মোট বাদের চেয়ে বেশি।</li>
<li>জমা দেওয়ার আগে খোঁজ আবার চালানো হলো, আর নতুন রেকর্ড পুরোনো নম্বরের ভেতরে মিশে গেল।</li>
<li>লেখাকে গবেষণা ধরা হলো, তাই একটা পরীক্ষার তিনটা লেখা হয়ে গেল তিনটা গবেষণা।</li>
</ul>
<p class="note">কোনো রেকর্ড কখনও মুছবেন না। বাদ পড়া রেকর্ড মানে যার গায়ে একটা কারণ লেখা আছে। মুছলেই ঘরগুলো মেলা বন্ধ হয়, আর ফেরার পথ থাকে না।</p>

<h2>যাচাই তালিকা</h2>
<ul class="checklist">
<li>বাছাই শুরুর আগে মানদণ্ড আর বাদের কোড লেখা, তারিখসহ।</li>
<li>নকল সরানোর আগে প্রতিটি ডেটাবেসের সংখ্যা লেখা।</li>
<li>প্রতিটি রেকর্ডের একটা আইডি, যা বদলায়নি।</li>
<li>বাদ পড়া প্রতিটি রেকর্ডে ঠিক একটা কোড।</li>
<li>দ্বিতীয় একজন অন্তত একটা নমুনা দেখেছেন, আর kappa লেখা আছে।</li>
<li>"পাওয়া যায়নি" আর "বাদ" আলাদা করে গোনা।</li>
<li>ছবির প্রতিটি বিয়োগ হাতে মিলিয়ে দেখা।</li>
</ul>

<p>স্টুডিওর রিভিউ ঘরে রেকর্ডগুলো থাকে আইডিসহ, প্রতিটি বাদের সঙ্গে কারণ, আর কর্মশালার PRISMA আঁকার যন্ত্র ওই গণনা থেকেই ছবিটা আঁকে, তাই ঘরগুলো টেবিলের সঙ্গে না মেলার উপায় নেই।</p>`,
};
