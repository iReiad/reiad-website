import type { MethodLesson } from "../research-methods";

export const LESSON: MethodLesson = {
  slug: "csad-herding-step-by-step",
  minutes: 7,
  en: `<div class="at-a-glance"><p class="at-a-glance-label">At a glance</p><ul>
<li>CSAD measures how spread out stocks' daily returns are around the market's own return on that day.</li>
<li>Regress CSAD on the absolute market return and its square; the shape of that curve is the test.</li>
<li>A negative and significant coefficient on the squared term is read as herding: dispersion grows more slowly, or even falls, on the days the market moves hardest.</li>
<li>Split the sample into up days and down days; herding is often not the same size in both directions.</li>
<li>On a thin market, a day with many non-traded stocks can manufacture the same negative sign for a reason that has nothing to do with behaviour.</li>
</ul></div>

<h2>What CSAD measures</h2>
<p>On any trading day, some stocks go up, some go down, some barely move. Cross-sectional absolute deviation is one number for the whole market that day: how far, on average, each stock's return sat from that day's own market return. Take the market's return for the day, subtract it from every stock's own return, ignore the sign, and average the result across all the stocks in the sample. A small CSAD means the market moved as one; a large CSAD means today was a day of very different stories across different names.</p>

<h2>The regression, and a negative squared term</h2>
<p>The standard test regresses the day's CSAD on the day's absolute market return and on that same number squared: CSAD equals a constant, plus one slope on the absolute market return, plus a second slope on its square, plus noise. In an ordinary market, where each stock reacts to a big market move roughly in proportion to its own beta, dispersion should keep growing, at least as fast as the market's move, as that move gets bigger: a high-beta stock and a low-beta stock have more room to pull apart on a nine per cent day than on a two per cent one. Herding says the opposite happens. On the days the market swings hardest, if enough investors are following the index, or following each other, rather than their own read of a stock's own news, returns bunch up around the market's own number instead of spreading further apart. CSAD then grows more slowly than the straight-line part of the regression predicts, or turns down altogether, at the largest market moves. That shows up as a negative coefficient on the squared term, and it has to be a coefficient that clears the usual bar for significance before it is read as herding rather than as noise.</p>
<p class="note">A negative squared term says dispersion grew more slowly than the size of the market's move predicts. It does not, by itself, say why: crowding, a shared piece of news reaching every stock at once, and a data problem in how the market return was built can all leave the same sign behind.</p>

<ol class="step-list">
<li>Collect every stock's own return for each day, and enough stocks to average across.</li>
<li>Compute the market's return for that day as the average across the same stocks.</li>
<li>Compute that day's CSAD: the average absolute distance of each stock's return from the market's.</li>
<li>Regress the day-by-day CSAD on the day's absolute market return and on its square.</li>
<li>Read the sign of the squared term, and whether it clears the bar for significance.</li>
</ol>

<h2>Worked example: five stocks, three days</h2>
<div class="ex"><b>Worked example.</b> Daily return, in percent, for five stocks over three days.</div>
<div class="table-scroll"><table>
<thead><tr><th>Stock</th><th>Day 1</th><th>Day 1 |R minus Rm|</th><th>Day 2</th><th>Day 2 |R minus Rm|</th><th>Day 3</th><th>Day 3 |R minus Rm|</th></tr></thead>
<tbody>
<tr><td>A</td><td>2</td><td>0</td><td>-3</td><td>1</td><td>8</td><td>1</td></tr>
<tr><td>B</td><td>3</td><td>1</td><td>-5</td><td>1</td><td>10</td><td>1</td></tr>
<tr><td>C</td><td>-1</td><td>3</td><td>-2</td><td>2</td><td>9</td><td>0</td></tr>
<tr><td>D</td><td>4</td><td>2</td><td>-4</td><td>0</td><td>11</td><td>2</td></tr>
<tr><td>E</td><td>2</td><td>0</td><td>-6</td><td>2</td><td>7</td><td>2</td></tr>
<tr><td>Market return</td><td>2.0</td><td></td><td>-4.0</td><td></td><td>9.0</td><td></td></tr>
<tr><td>Sum of |R minus Rm|</td><td></td><td>6</td><td></td><td>6</td><td></td><td>6</td></tr>
<tr><td>CSAD</td><td></td><td>1.2</td><td></td><td>1.2</td><td></td><td>1.2</td></tr>
</tbody></table></div>
<p>Day 1: the market return is the average of the five, 2 plus 3 minus 1 plus 4 plus 2, which is 10, divided by 5, which is 2.0 per cent. Each stock's distance from that, ignoring sign: 0, 1, 3, 2 and 0. Add them: 6. Divide by 5: CSAD is <strong>1.2</strong> per cent.</p>
<p>Day 2: the average of -3, -5, -2, -4 and -6 is -20 divided by 5, which is -4.0 per cent. Distances: 1, 1, 2, 0 and 2. Sum 6, divide by 5: CSAD is again <strong>1.2</strong>.</p>
<p>Day 3: the average of 8, 10, 9, 11 and 7 is 45 divided by 5, which is 9.0 per cent. Distances: 1, 1, 0, 2 and 2. Sum 6, divide by 5: CSAD is <strong>1.2</strong> a third time.</p>
<p>The market moved four times as far on day 2 as on day 1, and it moved more than four times as far again on day 3, yet dispersion did not budge. In an ordinary market that would be strange: a bigger market move should give a high-beta stock and a low-beta stock more room to disagree, not the same room every time. Three flat readings against a market move that keeps growing is exactly the shape a negative and significant squared term is built to catch: stocks huddled around the market's own number on the days it would have made most sense for them to spread out.</p>
<div class="side-note"><p class="side-note-label">Three days prove nothing on their own</p><p>A regression of CSAD on the market return and its square has three numbers to estimate from three days of data, which fits perfectly and leaves nothing over to compute a standard error from. A real test needs many more days, sixty at the least and usually several hundred, before a squared term's sign is worth reading as anything at all.</p></div>

<h2>Up days and down days</h2>
<p>Herding is not necessarily the same size, or even the same sign, in a rising market and a falling one. Investors crowding into the same trades out of fear on the way down is a different behaviour from crowding into the same winners on the way up, and a regression run on the whole sample together can average the two into something neither day actually looked like. Split the sample by the sign of that day's market return and run the same regression on each half separately: an up-day squared term and a down-day squared term, each with its own sign and its own significance, rather than one number standing in for both.</p>

<h2>Thin market cautions</h2>
<p>On a market where several counters go a whole session without a trade, a stale price is recorded as a zero return whether the true price moved or not. On a day the market itself swings hard, the stocks that did not trade sit at zero while the ones that did trade move with the market, which narrows the measured spread for a reason that has nothing to do with anybody following anybody. That narrowing can manufacture the same negative squared term a real herding test is looking for, out of missing trades rather than crowd behaviour. Checking how many of the day's stocks actually traded, and reporting it alongside the regression, is part of the test, not an afterthought to it.</p>

<h2>Where it goes wrong</h2>
<ul>
<li>Reading a negative squared term as herding with no check on how many stocks traded that day.</li>
<li>Running the test on too few days and reporting a coefficient as though it had cleared a bar for significance.</li>
<li>Skipping the up-day and down-day split and reporting one number for a market that behaves differently in each direction.</li>
<li>Computing the market return from a different set of stocks than the ones CSAD is measured against.</li>
<li>Reporting the sign of the squared term with no mention of how large the coefficient is.</li>
</ul>

<h2>Checklist</h2>
<ul class="checklist">
<li>CSAD and the market return are computed from the same set of stocks.</li>
<li>The regression has enough days behind it for a standard error to mean something.</li>
<li>The up-day and down-day halves are reported separately, not only the whole sample.</li>
<li>The share of stocks that actually traded that day is checked before a thin day is trusted.</li>
<li>Herding is claimed only where the squared term is both negative and significant, not one without the other.</li>
</ul>

<p>The lab runs the CSAD regression from the method list, on daily returns for as many stocks as are entered, and reads its own squared term's sign as herding or no herding in the summary line; its market button and the workshop's Returns tool turn a run of daily prices into the returns this test needs before the first CSAD can be computed.</p>`,
  bn: `<div class="at-a-glance"><p class="at-a-glance-label">এক নজরে</p><ul>
<li>CSAD মাপে, একটা দিনে শেয়ারগুলোর দৈনিক রিটার্ন সেদিনের নিজের বাজার রিটার্নের চারপাশে কতটা ছড়িয়ে আছে।</li>
<li>CSAD-কে বাজারের রিটার্নের পরম মান আর তার বর্গের ওপর রিগ্রেশন করুন; সেই বক্ররেখার আকৃতিই আসল পরীক্ষা।</li>
<li>বর্গ পদের সহগ ঋণাত্মক আর তাৎপর্যপূর্ণ হলে তাকে হার্ডিং বলা হয়: বাজার সবচেয়ে জোরে নড়া দিনগুলোয় ছড়ানো ধীরে বাড়ে, এমনকি কমেও যায়।</li>
<li>নমুনাকে ওঠার দিন আর পড়ার দিনে ভাগ করুন; হার্ডিং দুই দিকে একই মাপের হয় না প্রায়ই।</li>
<li>কম লেনদেনের বাজারে, অনেক শেয়ারের লেনদেন না হওয়া একটা দিনও আচরণের সঙ্গে কোনো সম্পর্ক ছাড়াই একই ঋণাত্মক চিহ্ন তৈরি করে দিতে পারে।</li>
</ul></div>

<h2>CSAD কী মাপে</h2>
<p>যেকোনো লেনদেনের দিনে কিছু শেয়ার ওঠে, কিছু পড়ে, কিছু প্রায় নড়েই না। ক্রস-সেকশনাল অ্যাবসোলিউট ডেভিয়েশন (CSAD) সেই দিনের পুরো বাজারের জন্য একটাই সংখ্যা: গড়ে প্রতিটি শেয়ারের রিটার্ন সেদিনের নিজের বাজার রিটার্ন থেকে কতটা দূরে বসেছিল। সেদিনের বাজার রিটার্নটা নিন, প্রতিটি শেয়ারের নিজের রিটার্ন থেকে বাদ দিন, চিহ্ন বাদ দিন, আর নমুনার সব শেয়ারের ওপর গড় করুন। ছোট CSAD মানে বাজার একসঙ্গে নড়েছে; বড় CSAD মানে সেদিন আলাদা আলাদা শেয়ারের গল্প খুব আলাদা ছিল।</p>

<h2>রিগ্রেশন, আর ঋণাত্মক বর্গ পদ</h2>
<p>মানদণ্ড পরীক্ষাটা সেদিনের CSAD-কে সেদিনের বাজার রিটার্নের পরম মান আর সেই সংখ্যার বর্গের ওপর রিগ্রেশন করে: CSAD সমান একটা ধ্রুবক, যোগ বাজার রিটার্নের পরম মানের ওপর একটা ঢাল, যোগ তার বর্গের ওপর দ্বিতীয় ঢাল, যোগ গোলমাল। সাধারণ বাজারে, যেখানে প্রতিটি শেয়ার বড় বাজার নড়াচড়ায় নিজের বিটা অনুযায়ী মোটামুটি সমানুপাতে সাড়া দেয়, বাজারের নড়াচড়া বড় হওয়ার সঙ্গে সঙ্গে ছড়ানোও অন্তত ততটাই বাড়া উচিত: উঁচু-বিটা আর নিচু-বিটা শেয়ারের মধ্যে নয় শতাংশের দিনে দুই শতাংশের দিনের চেয়ে বেশি ফারাক তৈরি হওয়ার জায়গা থাকে। হার্ডিং বলে ঠিক উল্টোটা ঘটে। বাজার সবচেয়ে জোরে দোলা দিনগুলোয়, যথেষ্ট বিনিয়োগকারী যদি নিজের শেয়ারের নিজস্ব খবরের বদলে ইনডেক্স বা একে অপরকে অনুসরণ করেন, তাহলে রিটার্নগুলো আরও ছড়িয়ে পড়ার বদলে বাজারের নিজের সংখ্যার চারপাশে জড়ো হয়ে যায়। তখন CSAD রিগ্রেশনের সরলরেখার অংশ যতটা বলে তার চেয়ে ধীরে বাড়ে, অথবা সবচেয়ে বড় বাজার নড়াচড়ায় পুরোপুরি নেমেই যায়। এটা বর্গ পদে একটা ঋণাত্মক সহগ হিসেবে দেখা যায়, আর হার্ডিং হিসেবে পড়ার আগে সেই সহগকে তাৎপর্যের সাধারণ সীমা পার হতে হবে, নইলে সেটা নিছক গোলমাল।</p>
<p class="note">ঋণাত্মক বর্গ পদ বলে, ছড়ানো বাজারের নড়াচড়ার আকার যা বলত তার চেয়ে ধীরে বেড়েছে। এটা একা কেন তা বলে না: ভিড়, সব শেয়ারে একসঙ্গে পৌঁছানো একটা ভাগ করা খবর, আর বাজার রিটার্ন তৈরির পদ্ধতিতে একটা তথ্য সমস্যা, সবই একই চিহ্ন রেখে যেতে পারে।</p>

<ol class="step-list">
<li>প্রতিদিন প্রতিটি শেয়ারের নিজের রিটার্ন জোগাড় করুন, আর গড় করার মতো যথেষ্ট শেয়ার নিন।</li>
<li>সেদিনের বাজার রিটার্ন হিসাব করুন, একই শেয়ারগুলোর গড় হিসেবে।</li>
<li>সেদিনের CSAD হিসাব করুন: প্রতিটি শেয়ারের রিটার্ন বাজারের রিটার্ন থেকে গড়ে কতটা দূরে, তার পরম মান।</li>
<li>দিনে দিনে CSAD-কে সেদিনের বাজার রিটার্নের পরম মান আর তার বর্গের ওপর রিগ্রেশন করুন।</li>
<li>বর্গ পদের চিহ্ন দেখুন, আর সেটা তাৎপর্যের সীমা পার করে কি না তাও।</li>
</ol>

<h2>করে দেখানো: পাঁচটা শেয়ার, তিন দিন</h2>
<div class="ex"><b>করে দেখানো।</b> পাঁচটা শেয়ারের তিন দিনের দৈনিক রিটার্ন, শতাংশে।</div>
<div class="table-scroll"><table>
<thead><tr><th>শেয়ার</th><th>দিন ১</th><th>দিন ১ |R বিয়োগ Rm|</th><th>দিন ২</th><th>দিন ২ |R বিয়োগ Rm|</th><th>দিন ৩</th><th>দিন ৩ |R বিয়োগ Rm|</th></tr></thead>
<tbody>
<tr><td>A</td><td>২</td><td>০</td><td>-৩</td><td>১</td><td>৮</td><td>১</td></tr>
<tr><td>B</td><td>৩</td><td>১</td><td>-৫</td><td>১</td><td>১০</td><td>১</td></tr>
<tr><td>C</td><td>-১</td><td>৩</td><td>-২</td><td>২</td><td>৯</td><td>০</td></tr>
<tr><td>D</td><td>৪</td><td>২</td><td>-৪</td><td>০</td><td>১১</td><td>২</td></tr>
<tr><td>E</td><td>২</td><td>০</td><td>-৬</td><td>২</td><td>৭</td><td>২</td></tr>
<tr><td>বাজার রিটার্ন</td><td>২.০</td><td></td><td>-৪.০</td><td></td><td>৯.০</td><td></td></tr>
<tr><td>|R বিয়োগ Rm|-এর যোগ</td><td></td><td>৬</td><td></td><td>৬</td><td></td><td>৬</td></tr>
<tr><td>CSAD</td><td></td><td>১.২</td><td></td><td>১.২</td><td></td><td>১.২</td></tr>
</tbody></table></div>
<p>দিন ১: বাজার রিটার্ন হলো পাঁচটার গড়, ২ যোগ ৩ বিয়োগ ১ যোগ ৪ যোগ ২, মানে ১০, ভাগ ৫, মানে ২.০ শতাংশ। প্রতিটি শেয়ারের সেখান থেকে দূরত্ব, চিহ্ন বাদে: ০, ১, ৩, ২ আর ০। যোগ করুন: ৬। ৫ দিয়ে ভাগ করুন: CSAD হলো <strong>১.২</strong> শতাংশ।</p>
<p>দিন ২: -৩, -৫, -২, -৪ আর -৬-এর গড় হলো -২০ ভাগ ৫, মানে -৪.০ শতাংশ। দূরত্ব: ১, ১, ২, ০ আর ২। যোগ ৬, ৫ দিয়ে ভাগ: CSAD আবার <strong>১.২</strong>।</p>
<p>দিন ৩: ৮, ১০, ৯, ১১ আর ৭-এর গড় হলো ৪৫ ভাগ ৫, মানে ৯.০ শতাংশ। দূরত্ব: ১, ১, ০, ২ আর ২। যোগ ৬, ৫ দিয়ে ভাগ: CSAD তৃতীয়বারও <strong>১.২</strong>।</p>
<p>বাজার দিন ১-এর চেয়ে দিন ২-এ চার গুণ দূরে নড়েছে, আর দিন ৩-এ আরও চার গুণের বেশি দূরে, তবু ছড়ানো এক চুলও নড়েনি। সাধারণ বাজারে এটা অদ্ভুত হতো: বড় বাজার নড়াচড়া উঁচু-বিটা আর নিচু-বিটা শেয়ারকে দ্বিমত করার বেশি জায়গা দেয়, প্রতিবার একই জায়গা দেয় না। ক্রমাগত বাড়তে থাকা বাজার নড়াচড়ার বিপরীতে তিনটে সমান CSAD ঠিক সেই আকৃতি, যা ঋণাত্মক আর তাৎপর্যপূর্ণ বর্গ পদ ধরার জন্য তৈরি: শেয়ারগুলো বাজারের নিজের সংখ্যার চারপাশে জড়ো হয়ে আছে, ঠিক সেই দিনগুলোতেই যখন তাদের ছড়িয়ে পড়া সবচেয়ে বেশি মানানসই হতো।</p>
<div class="side-note"><p class="side-note-label">তিন দিন একা কিছু প্রমাণ করে না</p><p>বাজার রিটার্ন আর তার বর্গের ওপর CSAD-এর রিগ্রেশনে তিনটে সংখ্যা আন্দাজ করতে হয় মাত্র তিন দিনের তথ্য থেকে, যা নিখুঁতভাবে বসে যায় আর স্ট্যান্ডার্ড এরর হিসাব করার মতো কিছু বাকি রাখে না। আসল পরীক্ষায় আরও অনেক বেশি দিন লাগে, অন্তত ষাট আর সাধারণত কয়েকশ, তার আগে বর্গ পদের চিহ্নকে কিছু ভাবাই ঠিক নয়।</p></div>

<h2>ওঠার দিন আর পড়ার দিন</h2>
<p>ওঠা বাজার আর পড়া বাজারে হার্ডিং একই মাপের, এমনকি একই চিহ্নের, হয় না সবসময়। পড়ার সময় ভয়ে একই লেনদেনে ভিড় করা আর ওঠার সময় একই বিজয়ী শেয়ারে ভিড় করা আলাদা আচরণ, আর পুরো নমুনা একসঙ্গে নিয়ে রিগ্রেশন চালালে দুইটা মিলিয়ে এমন একটা সংখ্যা বেরোয় যা আসলে কোনো দিনের মতোই নয়। সেদিনের বাজার রিটার্নের চিহ্ন দিয়ে নমুনাকে ভাগ করুন, আর প্রতিটা অর্ধেকে আলাদা করে একই রিগ্রেশন চালান: একটা ওঠার-দিনের বর্গ পদ, একটা পড়ার-দিনের বর্গ পদ, প্রতিটার নিজস্ব চিহ্ন আর নিজস্ব তাৎপর্য, দুটোর হয়ে একটা সংখ্যা না দাঁড়িয়ে।</p>

<h2>কম লেনদেনের বাজারের সতর্কতা</h2>
<p>যে বাজারে অনেক কাউন্টার পুরো একটা সেশন লেনদেন ছাড়া কাটায়, সেখানে পুরনো দাম শূন্য রিটার্ন হিসেবে লেখা হয়, আসল দাম নড়ুক বা না নড়ুক। বাজার নিজেই জোরে দোলা একটা দিনে, যে শেয়ারগুলোর লেনদেন হয়নি সেগুলো শূন্যে বসে থাকে, আর যেগুলো হয়েছে সেগুলো বাজারের সঙ্গে নড়ে, যা মাপা ছড়ানোকে সরু করে দেয় এমন একটা কারণে যার সঙ্গে কে কাকে অনুসরণ করছে তার কোনো সম্পর্ক নেই। এই সরু হওয়াটা আসল হার্ডিং পরীক্ষা যে ঋণাত্মক বর্গ পদ খুঁজছে, ঠিক সেটাই তৈরি করে দিতে পারে, ভিড়ের আচরণ থেকে নয়, হারানো লেনদেন থেকে। সেদিন আসলে কতগুলো শেয়ারের লেনদেন হয়েছে তা দেখা, আর রিগ্রেশনের পাশে সেটা লেখা, পরীক্ষার অংশ, পরে যোগ করা কোনো টীকা নয়।</p>

<h2>কোথায় ভুল হয়</h2>
<ul>
<li>সেদিন কতগুলো শেয়ারের লেনদেন হয়েছে তা না দেখেই ঋণাত্মক বর্গ পদকে হার্ডিং বলে ধরে নেওয়া।</li>
<li>খুব কম দিনে পরীক্ষা চালিয়ে একটা সহগকে তাৎপর্যের সীমা পার করেছে বলে লেখা।</li>
<li>ওঠার-দিন আর পড়ার-দিনের ভাগ বাদ দিয়ে দুই দিকে আলাদা আচরণ করা বাজারের জন্য একটাই সংখ্যা লেখা।</li>
<li>CSAD যে শেয়ারগুলো নিয়ে মাপা হয়েছে, তার চেয়ে আলাদা শেয়ার দিয়ে বাজার রিটার্ন হিসাব করা।</li>
<li>বর্গ পদের সহগ কতটা বড় তা না বলে শুধু চিহ্নটা লেখা।</li>
</ul>

<h2>যাচাই তালিকা</h2>
<ul class="checklist">
<li>CSAD আর বাজার রিটার্ন একই শেয়ারগুলো থেকে হিসাব হয়েছে।</li>
<li>রিগ্রেশনের পেছনে যথেষ্ট দিন আছে যাতে স্ট্যান্ডার্ড এররের মানে থাকে।</li>
<li>ওঠার-দিন আর পড়ার-দিনের ফলাফল আলাদা করে লেখা, শুধু পুরো নমুনা নয়।</li>
<li>কম লেনদেনের দিনকে বিশ্বাস করার আগে সেদিন আসলে কতটা শেয়ারের লেনদেন হয়েছে তা দেখা হয়েছে।</li>
<li>হার্ডিং দাবি করা হয়েছে শুধু তখনই যখন বর্গ পদ ঋণাত্মক আর তাৎপর্যপূর্ণ দুটোই, একটা ছাড়া অন্যটা নয়।</li>
</ul>

<p>ল্যাব পদ্ধতির তালিকা থেকে CSAD রিগ্রেশন চালায়, যত শেয়ার দেওয়া হয় তাদের দৈনিক রিটার্নের ওপর, আর সারাংশ লাইনে নিজের বর্গ পদের চিহ্ন দেখে হার্ডিং না নো-হার্ডিং লিখে দেয়; এর market বোতাম আর কর্মশালার Returns যন্ত্র দৈনিক দামের একটা ধারাকে সেই রিটার্নে বদলে দেয়, যা প্রথম CSAD হিসাব করার আগে লাগবেই।</p>`,
};
