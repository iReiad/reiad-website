import type { MethodLesson } from "../research-methods";

export const LESSON: MethodLesson = {
  slug: "ols-and-robust-errors",
  minutes: 5,
  en: `<div class="at-a-glance"><p class="at-a-glance-label">At a glance</p><ul>
<li>A regression draws the one straight line that comes closest to all the points at once, and reports its slope.</li>
<li>The slope is in the data's own units: maunds of yield per centimetre of rain, taka per year of schooling.</li>
<li>The standard error says how much that slope would wobble if you drew a fresh sample of the same size.</li>
<li>Robust (HC1) errors change the standard error and never the coefficient.</li>
<li>Observations that share a village, a firm or a year share their noise too. Cluster on that.</li>
</ul></div>

<h2>A regression in plain words</h2>
<p>Put rainfall along the bottom and yield up the side, one dot per farm. Ordinary least squares picks the intercept and the slope of the line whose vertical gaps to the dots, squared and added up, are as small as they can be. "Ordinary" because every dot counts the same. The model is yield equals intercept plus slope times rainfall plus noise, and the noise is everything about a farm the line does not know: soil, seed, the farmer.</p>
<p>The slope is the coefficient, and it is a sentence: one more centimetre of rain goes with this much more yield, in the units the columns were typed in. Change rainfall to millimetres and the slope divides by ten while meaning exactly the same thing.</p>

<h2>The four assumptions, in plain words</h2>
<ol class="step-list">
<li><strong>The relationship is a straight line</strong>, or you have transformed the columns until it is. A curve fitted with a line gives a slope that is right nowhere.</li>
<li><strong>The noise averages zero at every level of rainfall.</strong> Nothing hiding in the noise also moves rainfall. If wetter villages also have richer soil, the slope carries the soil's credit and calls it rain.</li>
<li><strong>The noise is equally spread at every level of rainfall.</strong> This is homoskedasticity, and when it fails the failure is called heteroskedasticity.</li>
<li><strong>One farm's noise says nothing about another farm's.</strong> Independence.</li>
</ol>
<p class="note">The first two decide whether the slope is right. The last two decide whether the standard error is right. Robust errors mend the last two; nothing about the errors can mend the first two.</p>

<h2>Worked example: six farms</h2>
<div class="ex"><b>Worked example.</b> Rainfall over the season in centimetres, and yield in maunds per bigha, for six farms. The mean rainfall is 130 and the mean yield is 16.</div>
<div class="table-scroll"><table>
<thead><tr><th>Farm</th><th>Rain</th><th>Yield</th><th>Rain minus 130</th><th>Yield minus 16</th><th>Product</th><th>Rain deviation squared</th></tr></thead>
<tbody>
<tr><td>1</td><td>80</td><td>14</td><td>-50</td><td>-2</td><td>100</td><td>2,500</td></tr>
<tr><td>2</td><td>100</td><td>12</td><td>-30</td><td>-4</td><td>120</td><td>900</td></tr>
<tr><td>3</td><td>120</td><td>17</td><td>-10</td><td>1</td><td>-10</td><td>100</td></tr>
<tr><td>4</td><td>140</td><td>15</td><td>10</td><td>-1</td><td>-10</td><td>100</td></tr>
<tr><td>5</td><td>160</td><td>20</td><td>30</td><td>4</td><td>120</td><td>900</td></tr>
<tr><td>6</td><td>180</td><td>18</td><td>50</td><td>2</td><td>100</td><td>2,500</td></tr>
<tr><td>Sum</td><td></td><td></td><td></td><td></td><td>420</td><td>7,000</td></tr>
</tbody></table></div>
<p>The slope is the sum of the products divided by the sum of the squared rain deviations: 420 divided by 7,000, which is <strong>0.06</strong> maunds per centimetre. The intercept is the mean yield minus the slope times the mean rain: 16 minus 0.06 times 130, which is 16 minus 7.8, which is <strong>8.2</strong>. The line is yield equals 8.2 plus 0.06 times rain. In words: across these six farms, ten centimetres more rain went with 0.6 of a maund more per bigha.</p>

<h2>Where the standard error comes from</h2>
<p>Put each farm's rain into the line and see what it predicts: 13, 14.2, 15.4, 16.6, 17.8 and 19. The gaps between what happened and what the line says are the residuals: 1, -2.2, 1.6, -1.6, 2.2 and -1. Square them and add: 1 plus 4.84 plus 2.56 plus 2.56 plus 4.84 plus 1 is 16.8. Divide by the observations minus the two things estimated, 6 minus 2, to get the noise variance: 4.2. The standard error of the slope is the square root of that divided by the sum of squared rain deviations: the square root of 4.2 over 7,000, which is the square root of 0.0006, which is <strong>0.0245</strong>.</p>
<p>The t statistic is the slope over its standard error: 0.06 divided by 0.0245, which is <strong>2.45</strong>. A t of about 2.4 says the slope sits two and a half standard errors away from zero. What that is worth depends on how many farms there are. With six, the line for a five per cent two-sided test is 2.78, so these six do not clear it. With thirty or more the line is about 2.04 and the same t clears it. And t says nothing about size: whether 0.06 of a maund per centimetre matters to a farmer is a question about farming, not about statistics.</p>

<h2>Heteroskedasticity, and what HC1 does</h2>
<p>The classical standard error above used one number, 4.2, for the spread of the noise at every level of rain. Suppose the big, wet farms are also the erratic ones. Then the spread is larger exactly where the rain deviations are largest, which is where the points pull hardest on the slope, and the classical standard error is too small: the slope is less certain than it says.</p>
<p>HC1 (heteroskedasticity-consistent, the first small-sample correction) does not assume one spread. It takes each farm's own squared residual, weights it by that farm's squared rain deviation, adds them up, divides by the squared sum of rain deviations, and multiplies by n over n minus k to make up for small samples. On the six farms: the weighted squares are 2,500, 4,356, 256, 256, 4,356 and 2,500, which add to 14,224. Times 6 over 4 is 21,336. Divide by 7,000 squared, 49,000,000, and take the square root: <strong>0.0209</strong>. The t becomes 2.87.</p>
<p>The slope is still 0.06. It has to be: least squares chose it by minimising the gaps and never looked at how the gaps were spread. Robust errors re-estimate how sure you may be, never what you found. Six farms are too few for the robust number to mean much on its own; the point is which number moved.</p>

<h2>Clustered errors</h2>
<p>Sixty farms in six villages are not sixty independent facts about rain. Farms in one village share the weather, the soil, the same extension officer, so their residuals move together, and the fourth assumption fails by construction. Cluster-robust errors let the residuals correlate however they like inside a village and assume nothing between villages. Cluster at the level where the shock or the treatment varies: a village-level programme means village clusters even when the outcome is measured per farm.</p>
<div class="side-note"><p class="side-note-label">How many clusters</p><p>The method wants many clusters, thirty to fifty as a rule of thumb, and with six villages no correction is honest. Say so in the text rather than reporting a clustered error as if it settled the matter.</p></div>

<h2>Where it goes wrong</h2>
<ul>
<li>Reporting the slope with no units, so nobody can tell whether 0.06 is a lot.</li>
<li>Reading a large t as a large effect.</li>
<li>Reaching for robust errors to rescue a slope that is biased by the second assumption. They cannot.</li>
<li>Clustering at the farm level when the programme was assigned by village.</li>
<li>Reporting HC1 errors for a sample of twenty as though they were exact.</li>
</ul>

<h2>Checklist</h2>
<ul class="checklist">
<li>The units of every coefficient are stated in the sentence that reports it.</li>
<li>The scatter has been looked at before the line was fitted.</li>
<li>Something has been said about what might sit in the noise and move the regressor too.</li>
<li>A test for unequal spread has been run, or robust errors are reported by default.</li>
<li>If observations share a group, errors are clustered on it and the number of clusters is stated.</li>
<li>Effect size and t are reported as two different things.</li>
</ul>

<p>The lab runs OLS with classical, HC1 or clustered errors from the method list and writes the APA table; the workshop's "which test" tool asks whether a regression is what your question needs, and its sample size tool says how many farms would let a slope this size clear the line.</p>`,
  bn: `<div class="at-a-glance"><p class="at-a-glance-label">এক নজরে</p><ul>
<li>রিগ্রেশন সব বিন্দুর সবচেয়ে কাছ দিয়ে যাওয়া একটা সরলরেখা টানে, আর তার ঢাল জানায়।</li>
<li>ঢাল থাকে তথ্যের নিজের এককে: প্রতি সেন্টিমিটার বৃষ্টিতে কত মণ ফলন, প্রতি বছর পড়াশোনায় কত টাকা।</li>
<li>স্ট্যান্ডার্ড এরর বলে, একই মাপের নতুন নমুনা নিলে ঢালটা কতটা এদিক-ওদিক হতো।</li>
<li>রোবাস্ট (HC1) ত্রুটি স্ট্যান্ডার্ড এরর বদলায়, সহগ কখনও নয়।</li>
<li>একই গ্রাম, একই কোম্পানি বা একই বছরের পর্যবেক্ষণ তাদের গোলমালও ভাগ করে নেয়। সেই দল ধরে ক্লাস্টার করুন।</li>
</ul></div>

<h2>সহজ কথায় রিগ্রেশন</h2>
<p>নিচে বৃষ্টি, পাশে ফলন, প্রতিটি খামারের জন্য একটা বিন্দু। সাধারণ লিস্ট স্কোয়ার (OLS) এমন একটা রেখার শুরুর মান আর ঢাল বেছে নেয়, যার সঙ্গে বিন্দুগুলোর খাড়া ফারাক বর্গ করে যোগ করলে যতটা সম্ভব ছোট হয়। "সাধারণ" কারণ প্রতিটি বিন্দুর ওজন সমান। মডেলটা হলো: ফলন সমান শুরুর মান যোগ ঢাল গুণ বৃষ্টি যোগ গোলমাল। গোলমাল হলো খামারের সেই সব কিছু যা রেখা জানে না: মাটি, বীজ, চাষি নিজে।</p>
<p>ঢালই সহগ, আর সেটা একটা বাক্য: এক সেন্টিমিটার বেশি বৃষ্টির সঙ্গে এতটা বেশি ফলন, যে এককে কলামগুলো লেখা হয়েছে সেই এককে। বৃষ্টি মিলিমিটারে লিখলে ঢাল দশ ভাগ হয়ে যায়, কিন্তু মানে থাকে ঠিক একই।</p>

<h2>সহজ কথায় চারটা অনুমান</h2>
<ol class="step-list">
<li><strong>সম্পর্কটা সরলরেখা</strong>, অথবা কলাম বদলে আপনি সরলরেখা বানিয়েছেন। বাঁকা সম্পর্কে সরলরেখা টানলে ঢাল কোথাও ঠিক হয় না।</li>
<li><strong>বৃষ্টির প্রতিটি মাত্রায় গোলমালের গড় শূন্য।</strong> গোলমালের ভেতরে লুকিয়ে থাকা কিছু যেন বৃষ্টিকেও না নাড়ায়। বেশি বৃষ্টির গ্রামের মাটিও যদি ভালো হয়, তবে মাটির কৃতিত্ব ঢালের ঘাড়ে চাপে আর নাম হয় বৃষ্টির।</li>
<li><strong>বৃষ্টির প্রতিটি মাত্রায় গোলমাল সমান ছড়ানো।</strong> এর নাম homoskedasticity, আর এটা ভাঙলে তার নাম heteroskedasticity।</li>
<li><strong>এক খামারের গোলমাল অন্য খামারের গোলমাল সম্পর্কে কিছু বলে না।</strong> স্বাধীনতা।</li>
</ol>
<p class="note">প্রথম দুটো ঠিক করে ঢাল সঠিক কি না। শেষ দুটো ঠিক করে স্ট্যান্ডার্ড এরর সঠিক কি না। রোবাস্ট ত্রুটি শেষ দুটো সারায়; ত্রুটি নিয়ে যা-ই করুন, প্রথম দুটো সারে না।</p>

<h2>করে দেখানো: ছয়টা খামার</h2>
<div class="ex"><b>করে দেখানো।</b> ছয়টা খামারে মৌসুমের বৃষ্টি সেন্টিমিটারে, আর ফলন বিঘাপ্রতি মণে। বৃষ্টির গড় ১৩০, ফলনের গড় ১৬।</div>
<div class="table-scroll"><table>
<thead><tr><th>খামার</th><th>বৃষ্টি</th><th>ফলন</th><th>বৃষ্টি বিয়োগ ১৩০</th><th>ফলন বিয়োগ ১৬</th><th>গুণফল</th><th>বৃষ্টির ফারাকের বর্গ</th></tr></thead>
<tbody>
<tr><td>১</td><td>৮০</td><td>১৪</td><td>-৫০</td><td>-২</td><td>১০০</td><td>২,৫০০</td></tr>
<tr><td>২</td><td>১০০</td><td>১২</td><td>-৩০</td><td>-৪</td><td>১২০</td><td>৯০০</td></tr>
<tr><td>৩</td><td>১২০</td><td>১৭</td><td>-১০</td><td>১</td><td>-১০</td><td>১০০</td></tr>
<tr><td>৪</td><td>১৪০</td><td>১৫</td><td>১০</td><td>-১</td><td>-১০</td><td>১০০</td></tr>
<tr><td>৫</td><td>১৬০</td><td>২০</td><td>৩০</td><td>৪</td><td>১২০</td><td>৯০০</td></tr>
<tr><td>৬</td><td>১৮০</td><td>১৮</td><td>৫০</td><td>২</td><td>১০০</td><td>২,৫০০</td></tr>
<tr><td>যোগ</td><td></td><td></td><td></td><td></td><td>৪২০</td><td>৭,০০০</td></tr>
</tbody></table></div>
<p>ঢাল হলো গুণফলের যোগ ভাগ বৃষ্টির ফারাকের বর্গের যোগ: ৪২০ ভাগ ৭,০০০, মানে প্রতি সেন্টিমিটারে <strong>০.০৬</strong> মণ। শুরুর মান হলো ফলনের গড় বিয়োগ ঢাল গুণ বৃষ্টির গড়: ১৬ বিয়োগ ০.০৬ গুণ ১৩০, মানে ১৬ বিয়োগ ৭.৮, মানে <strong>৮.২</strong>। রেখাটা: ফলন সমান ৮.২ যোগ ০.০৬ গুণ বৃষ্টি। কথায়: এই ছয় খামারে দশ সেন্টিমিটার বেশি বৃষ্টির সঙ্গে বিঘায় ০.৬ মণ বেশি ফলন গেছে।</p>

<h2>স্ট্যান্ডার্ড এরর কোথা থেকে আসে</h2>
<p>প্রতিটি খামারের বৃষ্টি রেখায় বসিয়ে দেখুন কী বলে: ১৩, ১৪.২, ১৫.৪, ১৬.৬, ১৭.৮ আর ১৯। যা হয়েছে আর রেখা যা বলে, তার ফারাকগুলো: ১, -২.২, ১.৬, -১.৬, ২.২ আর -১। বর্গ করে যোগ করুন: ১ যোগ ৪.৮৪ যোগ ২.৫৬ যোগ ২.৫৬ যোগ ৪.৮৪ যোগ ১ হলো ১৬.৮। পর্যবেক্ষণ থেকে আন্দাজ করা দুটো জিনিস বাদ দিয়ে, ৬ বিয়োগ ২ দিয়ে ভাগ করলে গোলমালের ভেদ: ৪.২। ঢালের স্ট্যান্ডার্ড এরর হলো সেটাকে বৃষ্টির ফারাকের বর্গের যোগ দিয়ে ভাগ করে বর্গমূল: ৪.২ ভাগ ৭,০০০-এর বর্গমূল, মানে ০.০০০৬-এর বর্গমূল, মানে <strong>০.০২৪৫</strong>।</p>
<p>t হলো ঢাল ভাগ তার স্ট্যান্ডার্ড এরর: ০.০৬ ভাগ ০.০২৪৫, মানে <strong>২.৪৫</strong>। মোটামুটি ২.৪ মানের t বলে, ঢালটা শূন্য থেকে আড়াই স্ট্যান্ডার্ড এরর দূরে। তার দাম কত, তা নির্ভর করে খামার কটা তার ওপর। ছয়টায় দুই দিকের পাঁচ শতাংশ পরীক্ষার সীমা ২.৭৮, তাই এই ছয়টা সীমা পার হয় না। তিরিশ বা তার বেশি হলে সীমা মোটামুটি ২.০৪, আর একই t পার হয়ে যায়। আর t মাপের কথা কিছুই বলে না: প্রতি সেন্টিমিটারে ০.০৬ মণ চাষির কাছে কিছু মানে কি না, সেটা চাষের প্রশ্ন, পরিসংখ্যানের নয়।</p>

<h2>Heteroskedasticity, আর HC1 কী করে</h2>
<p>ওপরের সাধারণ স্ট্যান্ডার্ড এরর বৃষ্টির সব মাত্রায় গোলমালের ছড়ানোর জন্য একটাই সংখ্যা ধরেছে, ৪.২। ধরুন বড় আর ভেজা খামারগুলোই বেশি খামখেয়ালি। তাহলে ছড়ানো বেশি ঠিক সেখানে যেখানে বৃষ্টির ফারাক সবচেয়ে বড়, মানে যে বিন্দুগুলো ঢালকে সবচেয়ে জোরে টানে, আর সাধারণ স্ট্যান্ডার্ড এরর হয় খুব ছোট: ঢাল যতটা নিশ্চিত বলছে, ততটা নয়।</p>
<p>HC1 (heteroskedasticity-consistent, ছোট নমুনার প্রথম সংশোধনসহ) একটা ছড়ানো ধরে নেয় না। প্রতিটি খামারের নিজের ফারাকের বর্গ নেয়, সেই খামারের বৃষ্টির ফারাকের বর্গ দিয়ে ওজন দেয়, যোগ করে, বৃষ্টির ফারাকের বর্গের যোগের বর্গ দিয়ে ভাগ করে, আর ছোট নমুনা পুষিয়ে নিতে n ভাগ n বিয়োগ k দিয়ে গুণ করে। ছয় খামারে: ওজন দেওয়া বর্গগুলো ২,৫০০, ৪,৩৫৬, ২৫৬, ২৫৬, ৪,৩৫৬ আর ২,৫০০, যোগ ১৪,২২৪। ৬ ভাগ ৪ দিয়ে গুণ করলে ২১,৩৩৬। ৭,০০০-এর বর্গ ৪,৯০,০০,০০০ দিয়ে ভাগ করে বর্গমূল: <strong>০.০২০৯</strong>। t হয় ২.৮৭।</p>
<p>ঢাল এখনও ০.০৬। তা-ই হওয়ার কথা: লিস্ট স্কোয়ার ফারাক ছোট করে ঢাল বেছেছিল, ফারাক কীভাবে ছড়ানো তা দেখেইনি। রোবাস্ট ত্রুটি নতুন করে আন্দাজ করে আপনি কতটা নিশ্চিত হতে পারেন, কী পেয়েছেন তা নয়। ছয়টা খামার এত কম যে রোবাস্ট সংখ্যাটার নিজের মানে সামান্য; আসল কথা, কোন সংখ্যাটা নড়ল।</p>

<h2>ক্লাস্টার করা ত্রুটি</h2>
<p>ছয় গ্রামের ষাটটা খামার বৃষ্টি নিয়ে ষাটটা স্বাধীন তথ্য নয়। এক গ্রামের খামারগুলো একই আবহাওয়া, একই মাটি, একই কৃষি কর্মকর্তা ভাগ করে নেয়, তাই তাদের ফারাকগুলো একসঙ্গে নড়ে, আর চতুর্থ অনুমান গোড়া থেকেই ভাঙে। ক্লাস্টার-রোবাস্ট ত্রুটি গ্রামের ভেতরে ফারাকগুলোকে যেমন খুশি জড়াতে দেয়, আর গ্রামে গ্রামে কিছু ধরে না। ক্লাস্টার করুন সেই স্তরে যেখানে ধাক্কা বা কর্মসূচিটা বদলায়: গ্রামভিত্তিক কর্মসূচি হলে গ্রাম ধরে ক্লাস্টার, ফলাফল খামার ধরে মাপা হলেও।</p>
<div class="side-note"><p class="side-note-label">কটা ক্লাস্টার</p><p>পদ্ধতিটা অনেক ক্লাস্টার চায়, মোটামুটি হিসেবে তিরিশ থেকে পঞ্চাশ। ছয়টা গ্রামে কোনো সংশোধনই সৎ নয়। ক্লাস্টার করা ত্রুটি দিয়ে বিষয়টা মিটে গেছে এমন ভাব না করে, লেখায় কথাটা বলুন।</p></div>

<h2>কোথায় ভুল হয়</h2>
<ul>
<li>একক ছাড়া ঢাল লেখা, তাই ০.০৬ বেশি না কম কেউ বলতে পারে না।</li>
<li>বড় t-কে বড় প্রভাব ভেবে নেওয়া।</li>
<li>দ্বিতীয় অনুমান ভেঙে পক্ষপাতী হওয়া ঢাল বাঁচাতে রোবাস্ট ত্রুটির দিকে হাত বাড়ানো। তা পারে না।</li>
<li>কর্মসূচি গ্রাম ধরে দেওয়া হলেও খামার ধরে ক্লাস্টার করা।</li>
<li>বিশটা নমুনায় HC1 ত্রুটি এমনভাবে লেখা যেন নিখুঁত।</li>
</ul>

<h2>যাচাই তালিকা</h2>
<ul class="checklist">
<li>প্রতিটি সহগ যে বাক্যে লেখা হয়েছে, তাতে তার একক বলা আছে।</li>
<li>রেখা টানার আগে বিন্দুর ছবিটা দেখা হয়েছে।</li>
<li>গোলমালের ভেতরে কী থাকতে পারে যা বৃষ্টিকেও নাড়ায়, তা নিয়ে কিছু বলা হয়েছে।</li>
<li>অসমান ছড়ানোর পরীক্ষা চালানো হয়েছে, নয়তো রোবাস্ট ত্রুটিই লেখা হয়েছে।</li>
<li>পর্যবেক্ষণ কোনো দল ভাগ করলে সেই দল ধরে ক্লাস্টার, আর ক্লাস্টারের সংখ্যা লেখা।</li>
<li>প্রভাবের মাপ আর t দুটো আলাদা জিনিস হিসেবে লেখা।</li>
</ul>

<p>ল্যাব পদ্ধতির তালিকা থেকে সাধারণ, HC1 বা ক্লাস্টার করা ত্রুটিসহ OLS চালায় আর APA টেবিল লিখে দেয়; কর্মশালার "কোন পরীক্ষা" যন্ত্র জিজ্ঞেস করে আপনার প্রশ্নের জন্য রিগ্রেশনই দরকার কি না, আর তার নমুনার মাপের যন্ত্র বলে এই মাপের ঢাল সীমা পার করতে কটা খামার লাগত।</p>`,
};
