import type { MethodLesson } from "../research-methods";

export const LESSON: MethodLesson = {
  slug: "event-study-by-hand",
  minutes: 5,
  en: `<div class="at-a-glance"><p class="at-a-glance-label">At a glance</p><ul>
<li>An event study asks whether a stock's return around one date was larger, or smaller, than what the market alone would have predicted.</li>
<li>The estimation window is an ordinary stretch of days used to fit a market model; the event window is the days around the date being tested.</li>
<li>Abnormal return is the actual return minus what the fitted model predicts, for one day.</li>
<li>Cumulative abnormal return, CAR, adds the daily abnormal returns across the whole event window into one number.</li>
<li>A confounding announcement, or many firms sharing one event date, can make an abnormal return look larger or smaller than the event alone earned.</li>
</ul></div>

<h2>Two windows, with a gap between them</h2>
<p>An event study needs two stretches of time that do different jobs. The estimation window is a run of ordinary trading days, long enough to fit a market model on, typically well over a hundred sessions, chosen precisely because nothing unusual was happening to the stock during it. The event window is short, often no more than a week either side of the date being tested, and it is where the question actually gets asked. Between the two sits a gap of a few weeks: if the estimation window ran right up to the event, any rumour or run-up in the days before the announcement would already be baked into the fitted alpha and beta, and the model would then judge the event against a version of the stock that had already half-priced it in.</p>

<h2>Fitting the market model, in the quiet window</h2>
<p>Fitting the model itself is the same regression as any market model: the stock's return on the market's return, over the estimation window rather than the event window, giving a slope, beta, and an intercept, alpha, exactly as worked through on a full example elsewhere in this room. What that regression also leaves behind is the spread of its own residuals, the standard deviation of the gap between what the model predicted and what actually happened, on the ordinary days when nothing was going on. That number is carried forward and used again below, once the event window is reached. Here it is supplied rather than refitted: alpha of 0.05 per cent a day, beta of 1.2, and a residual standard deviation of 0.8 per cent a day, all taken as the estimation window's own output.</p>
<p class="note">Alpha, beta and the residual standard deviation are only as good as the estimation window they came from. A window that itself sat inside a takeover rumour, a previous scandal or an unusually calm quarter for the whole market will hand the event window a model that was never really quiet.</p>

<h2>Abnormal and cumulative abnormal returns</h2>
<p>An abnormal return is what is left over once the market's own contribution is taken out: the stock's actual return on a day, minus what the fitted line predicts for that day given the market's own return. A predicted return of its own is alpha plus beta times that day's market return, the same market model equation as always, just evaluated one day at a time inside the event window rather than fitted there. Add the day's abnormal returns across the whole event window, running total by running total, and the sum at the end is the cumulative abnormal return, CAR, one number for whatever the event window was worth altogether.</p>

<h2>Worked example: a five-day event window</h2>
<div class="ex"><b>Worked example.</b> A five-day event window around an announcement on day 0, using the estimation window's own alpha of 0.05 and beta of 1.2 from above.</div>
<div class="table-scroll"><table>
<thead><tr><th>Day</th><th>Market return</th><th>Actual return</th><th>Predicted return</th><th>Abnormal return</th><th>CAR</th></tr></thead>
<tbody>
<tr><td>-2</td><td>0.5</td><td>1.0</td><td>0.65</td><td>0.35</td><td>0.35</td></tr>
<tr><td>-1</td><td>-0.3</td><td>0.0</td><td>-0.31</td><td>0.31</td><td>0.66</td></tr>
<tr><td>0 (event)</td><td>0.2</td><td>3.0</td><td>0.29</td><td>2.71</td><td>3.37</td></tr>
<tr><td>+1</td><td>0.4</td><td>1.5</td><td>0.53</td><td>0.97</td><td>4.34</td></tr>
<tr><td>+2</td><td>-0.1</td><td>0.2</td><td>-0.07</td><td>0.27</td><td>4.61</td></tr>
</tbody></table></div>
<p>Day -2: predicted return is 0.05 plus 1.2 times 0.5, which is 0.05 plus 0.6, which is 0.65. The actual return was 1.0, so the abnormal return is 1.0 minus 0.65, which is <strong>0.35</strong>.</p>
<p>Day -1: predicted return is 0.05 plus 1.2 times -0.3, which is 0.05 minus 0.36, which is -0.31. Actual was 0.0, so abnormal is 0.0 minus -0.31, which is <strong>0.31</strong>. Running total, the cumulative abnormal return so far: 0.35 plus 0.31, which is 0.66.</p>
<p>Day 0, the event itself: predicted return is 0.05 plus 1.2 times 0.2, which is 0.05 plus 0.24, which is 0.29. Actual was 3.0, a jump the market's own move of 0.2 per cent does not begin to explain, so abnormal is 3.0 minus 0.29, which is <strong>2.71</strong>. Cumulative: 0.66 plus 2.71, which is 3.37.</p>
<p>Day +1: predicted is 0.05 plus 1.2 times 0.4, which is 0.53. Actual 1.5, abnormal 0.97. Cumulative: 3.37 plus 0.97, which is 4.34.</p>
<p>Day +2: predicted is 0.05 plus 1.2 times -0.1, which is -0.07. Actual 0.2, abnormal 0.27. Cumulative, at the end of the window: 4.34 plus 0.27, which is <strong>4.61</strong> per cent.</p>

<h2>The t test on CAR</h2>
<p>The cumulative abnormal return above is a number; the question is whether it is a large one. The test compares it with the spread the estimation window's own residuals already showed: divide the cumulative abnormal return by the residual standard deviation from that quiet window, times the square root of how many days are in the event window. Here that is 4.61 divided by 0.8 times the square root of 5. The square root of 5 is about 2.236. 0.8 times 2.236 is about 1.789. 4.61 divided by 1.789 is about <strong>2.58</strong>. Against the usual two-sided five per cent line of about 1.96, this cumulative abnormal return clears the bar: the stock did more, around this announcement, than five days of ordinary market exposure would explain, by more than chance alone is likely to produce.</p>

<h2>Confounding events</h2>
<p>The test above assumes the event window's only unusual news is the one being studied. A dividend declared the same week as the earnings figure, or an index rebalancing that happens to fall inside the window, will move the abnormal return too, and the test cannot tell the two apart. The fix is not statistical: check the news wire for every day inside the window, not only the date an announcement was formally dated, before crediting the CAR to the event the study set out to test.</p>

<h2>Clustered event dates</h2>
<p>The t test above treats the estimation window's residual spread as the whole story of how much a CAR like this one varies by chance, which holds for one firm on one date. It stops holding the moment many firms share the same event date, a national budget, a policy rate decision, a sector-wide reporting deadline, because those firms' abnormal returns then share one market-wide shock and stop being independent draws. Averaging across such a cluster as though each firm were a separate, unrelated event overstates how confident the result should be. Treat the clustered date as one observation, not many: build one CAR for the whole cluster, or adjust the test's variance for the correlation the shared date introduces, rather than running the simple test once per firm and counting each as independent evidence.</p>
<div class="side-note"><p class="side-note-label">A day with no trade inside the window</p><p>A stock that does not trade on one of the event window's own days leaves an abnormal return with nothing real behind it: the stale price it carries forward is not that day's answer to the announcement, only yesterday's answer repeated. Check the trading log for the event window itself, not only for the estimation window used to fit the model.</p></div>

<h2>Where it goes wrong</h2>
<ul>
<li>Letting the estimation window run right up to the event, so the alpha and beta already carry the run-up.</li>
<li>Reporting a cumulative abnormal return with no t statistic beside it.</li>
<li>Treating several firms that share one event date as several independent tests.</li>
<li>Crediting the whole cumulative abnormal return to the event without checking for other news in the same window.</li>
<li>Widening the event window after seeing the result, until the number looks the way it was expected to.</li>
</ul>

<h2>Checklist</h2>
<ul class="checklist">
<li>The estimation window and the event window are separated by a gap, stated in the write-up.</li>
<li>Alpha, beta and the residual standard deviation all come from the estimation window, never the event window.</li>
<li>The cumulative abnormal return carries a t statistic, not just a sign.</li>
<li>The news wire has been checked for the whole event window, not only the announcement's own date.</li>
<li>Firms sharing one event date are treated as one clustered observation, not several independent ones.</li>
</ul>

<p>The lab runs an event study from the method list: fit the market model over the estimation window, then feed it the event window's own returns to get the abnormal and cumulative abnormal returns and the t statistic written straight into the APA table; its market button fetches the daily series both windows need, so the two need never be typed in by hand.</p>`,
  bn: `<div class="at-a-glance"><p class="at-a-glance-label">এক নজরে</p><ul>
<li>ইভেন্ট স্টাডি জিজ্ঞেস করে, একটা শেয়ারের একটা তারিখের চারপাশের রিটার্ন শুধু বাজার যা দিত তার চেয়ে বড় ছিল কি না, নাকি ছোট।</li>
<li>এস্টিমেশন উইন্ডো হলো সাধারণ দিনগুলোর একটা পর্ব, যা দিয়ে বাজার মডেল বসানো হয়; ইভেন্ট উইন্ডো হলো পরীক্ষা করা তারিখের চারপাশের দিনগুলো।</li>
<li>অস্বাভাবিক রিটার্ন হলো আসল রিটার্ন বিয়োগ বসানো মডেল সেই দিনের জন্য যা বলে।</li>
<li>CAR পুরো ইভেন্ট উইন্ডো জুড়ে প্রতিদিনের অস্বাভাবিক রিটার্ন যোগ করে একটাই সংখ্যায় নিয়ে আসে।</li>
<li>একই দিনে আরেকটা খবর, বা একই তারিখে অনেক কোম্পানির ঘটনা, অস্বাভাবিক রিটার্নকে ঘটনাটা আসলে যতটা এনেছে তার চেয়ে বড় বা ছোট দেখাতে পারে।</li>
</ul></div>

<h2>দুটো উইন্ডো, মাঝে ফাঁক রেখে</h2>
<p>ইভেন্ট স্টাডির দুটো সময়ের পর্ব লাগে, দুটো আলাদা কাজে। এস্টিমেশন উইন্ডো হলো সাধারণ লেনদেনের দিনের একটা দীর্ঘ পর্ব, বাজার মডেল বসানোর মতো লম্বা, সাধারণত একশর অনেক বেশি সেশন, আর বাছা হয় ঠিক এই কারণে যে সেই সময় শেয়ারটাতে অস্বাভাবিক কিছু ঘটছিল না। ইভেন্ট উইন্ডো ছোট, প্রায়ই পরীক্ষা করা তারিখের দুই পাশে এক সপ্তাহের বেশি নয়, আর আসল প্রশ্নটা এখানেই জিজ্ঞেস করা হয়। দুটোর মাঝে কয়েক সপ্তাহের একটা ফাঁক থাকে: এস্টিমেশন উইন্ডো যদি ইভেন্ট পর্যন্ত টেনে আনা হতো, ঘোষণার আগের দিনগুলোর কোনো গুজব বা দাম বাড়ার প্রবণতা আগে থেকেই বসানো আলফা আর বিটার মধ্যে ঢুকে যেত, আর মডেল তখন ঘটনাটাকে বিচার করত এমন এক শেয়ারের বিপরীতে যে আগেই অর্ধেক দাম বসিয়ে ফেলেছিল।</p>

<h2>বাজার মডেল বসানো, শান্ত উইন্ডোয়</h2>
<p>মডেল বসানোটা যেকোনো বাজার মডেলের মতোই একটা রিগ্রেশন: শেয়ারের রিটার্ন বাজারের রিটার্নের ওপর, ইভেন্ট উইন্ডোর বদলে এস্টিমেশন উইন্ডোয়, যা থেকে একটা ঢাল, বিটা, আর একটা শুরুর মান, আলফা পাওয়া যায়, ঠিক এই ঘরের আরেক জায়গায় পুরো করে দেখানো উদাহরণের মতোই। সেই রিগ্রেশন আরও একটা জিনিস রেখে যায়: নিজের রেসিডুয়ালের ছড়ানো, মডেল যা বলেছিল আর সাধারণ দিনে আসলে যা হয়েছিল তার ফারাকের স্ট্যান্ডার্ড ডেভিয়েশন, যেসব দিনে বিশেষ কিছুই ঘটছিল না। সেই সংখ্যাটা এগিয়ে নিয়ে যাওয়া হয়, ইভেন্ট উইন্ডোয় পৌঁছালে আবার কাজে লাগে। এখানে সেটা নতুন করে বসানো হয়নি, দেওয়া আছে: দিনে ০.০৫ শতাংশ আলফা, ১.২ বিটা, আর দিনে ০.৮ শতাংশ রেসিডুয়াল স্ট্যান্ডার্ড ডেভিয়েশন, সবই এস্টিমেশন উইন্ডোর নিজের ফলাফল ধরে নেওয়া।</p>
<p class="note">আলফা, বিটা আর রেসিডুয়াল স্ট্যান্ডার্ড ডেভিয়েশন যতটা ভালো, এস্টিমেশন উইন্ডোটা যেখান থেকে এসেছে ততটাই ভালো। উইন্ডোটা নিজেই যদি একটা অধিগ্রহণের গুজব, আগের কোনো কেলেঙ্কারি, বা পুরো বাজারের জন্য অস্বাভাবিক রকম শান্ত একটা প্রান্তিকের ভেতরে বসে থাকে, তাহলে ইভেন্ট উইন্ডো এমন একটা মডেল পাবে যা আসলে কখনও শান্ত ছিলই না।</p>

<h2>অস্বাভাবিক আর সঞ্চিত অস্বাভাবিক রিটার্ন</h2>
<p>অস্বাভাবিক রিটার্ন হলো বাজারের নিজের অবদান বাদ দেওয়ার পর যা পড়ে থাকে: একটা দিনে শেয়ারের আসল রিটার্ন, বিয়োগ বসানো রেখা সেই দিনের বাজার রিটার্ন দেখে যা বলে। একটা দিনের নিজের পূর্বানুমান হলো আলফা যোগ বিটা গুণ সেই দিনের বাজার রিটার্ন, সবসময়ের সেই একই বাজার মডেল সমীকরণ, শুধু ইভেন্ট উইন্ডোর ভেতর একদিন একদিন করে হিসাব করা, সেখানে বসানো নয়। পুরো ইভেন্ট উইন্ডো জুড়ে প্রতিদিনের অস্বাভাবিক রিটার্ন যোগ করুন, চলতি যোগফলে চলতি যোগফলে, আর শেষের যোগফলটাই CAR, পুরো ইভেন্ট উইন্ডো মিলিয়ে কতটা হলো তার একটাই সংখ্যা।</p>

<h2>করে দেখানো: পাঁচ দিনের ইভেন্ট উইন্ডো</h2>
<div class="ex"><b>করে দেখানো।</b> দিন ০-এ একটা ঘোষণার চারপাশে পাঁচ দিনের ইভেন্ট উইন্ডো, ওপরের এস্টিমেশন উইন্ডোর নিজের ০.০৫ আলফা আর ১.২ বিটা ব্যবহার করে।</div>
<div class="table-scroll"><table>
<thead><tr><th>দিন</th><th>বাজার রিটার্ন</th><th>আসল রিটার্ন</th><th>পূর্বানুমান</th><th>অস্বাভাবিক রিটার্ন</th><th>CAR</th></tr></thead>
<tbody>
<tr><td>-২</td><td>০.৫</td><td>১.০</td><td>০.৬৫</td><td>০.৩৫</td><td>০.৩৫</td></tr>
<tr><td>-১</td><td>-০.৩</td><td>০.০</td><td>-০.৩১</td><td>০.৩১</td><td>০.৬৬</td></tr>
<tr><td>০ (ইভেন্ট)</td><td>০.২</td><td>৩.০</td><td>০.২৯</td><td>২.৭১</td><td>৩.৩৭</td></tr>
<tr><td>+১</td><td>০.৪</td><td>১.৫</td><td>০.৫৩</td><td>০.৯৭</td><td>৪.৩৪</td></tr>
<tr><td>+২</td><td>-০.১</td><td>০.২</td><td>-০.০৭</td><td>০.২৭</td><td>৪.৬১</td></tr>
</tbody></table></div>
<p>দিন -২: পূর্বানুমান হলো ০.০৫ যোগ ১.২ গুণ ০.৫, মানে ০.০৫ যোগ ০.৬, মানে ০.৬৫। আসল রিটার্ন ছিল ১.০, তাই অস্বাভাবিক রিটার্ন ১.০ বিয়োগ ০.৬৫, মানে <strong>০.৩৫</strong>।</p>
<p>দিন -১: পূর্বানুমান হলো ০.০৫ যোগ ১.২ গুণ -০.৩, মানে ০.০৫ বিয়োগ ০.৩৬, মানে -০.৩১। আসল ছিল ০.০, তাই অস্বাভাবিক রিটার্ন ০.০ বিয়োগ -০.৩১, মানে <strong>০.৩১</strong>। এখন পর্যন্ত CAR: ০.৩৫ যোগ ০.৩১, মানে ০.৬৬।</p>
<p>দিন ০, ইভেন্ট নিজেই: পূর্বানুমান হলো ০.০৫ যোগ ১.২ গুণ ০.২, মানে ০.০৫ যোগ ০.২৪, মানে ০.২৯। আসল ছিল ৩.০, এমন একটা লাফ যা বাজারের নিজের ০.২ শতাংশ নড়াচড়া দিয়ে ব্যাখ্যা করা যায় না, তাই অস্বাভাবিক রিটার্ন ৩.০ বিয়োগ ০.২৯, মানে <strong>২.৭১</strong>। CAR: ০.৬৬ যোগ ২.৭১, মানে ৩.৩৭।</p>
<p>দিন +১: পূর্বানুমান ০.০৫ যোগ ১.২ গুণ ০.৪, মানে ০.৫৩। আসল ১.৫, অস্বাভাবিক রিটার্ন ০.৯৭। CAR: ৩.৩৭ যোগ ০.৯৭, মানে ৪.৩৪।</p>
<p>দিন +২: পূর্বানুমান ০.০৫ যোগ ১.২ গুণ -০.১, মানে -০.০৭। আসল ০.২, অস্বাভাবিক রিটার্ন ০.২৭। উইন্ডোর শেষে CAR: ৪.৩৪ যোগ ০.২৭, মানে <strong>৪.৬১</strong> শতাংশ।</p>

<h2>CAR-এর ওপর t পরীক্ষা</h2>
<p>ওপরের CAR একটা সংখ্যা; প্রশ্ন হলো সেটা বড় কি না। পরীক্ষাটা সেটাকে এস্টিমেশন উইন্ডোর নিজের রেসিডুয়াল কতটা ছড়ানো দেখিয়েছিল তার সঙ্গে তুলনা করে: CAR-কে ভাগ করুন শান্ত উইন্ডোর রেসিডুয়াল স্ট্যান্ডার্ড ডেভিয়েশন গুণ ইভেন্ট উইন্ডোয় কটা দিন আছে তার বর্গমূল দিয়ে। এখানে সেটা ৪.৬১ ভাগ, ০.৮ গুণ ৫-এর বর্গমূল। ৫-এর বর্গমূল প্রায় ২.২৩৬। ০.৮ গুণ ২.২৩৬ প্রায় ১.৭৮৯। ৪.৬১ ভাগ ১.৭৮৯ প্রায় <strong>২.৫৮</strong>। দুই দিকের পাঁচ শতাংশের সাধারণ সীমা প্রায় ১.৯৬-এর বিপরীতে, এই CAR সীমা পার হয়ে যায়: এই ঘোষণার চারপাশে শেয়ারটা পাঁচ দিনের সাধারণ বাজার সংস্পর্শ যা ব্যাখ্যা করত তার চেয়ে বেশি করেছে, শুধু কাকতালীয়ভাবে হওয়ার চেয়ে বেশি।</p>

<h2>মিশে যাওয়া ঘটনা</h2>
<p>ওপরের পরীক্ষা ধরে নেয়, ইভেন্ট উইন্ডোর একমাত্র অস্বাভাবিক খবর সেটাই যা পরীক্ষা করা হচ্ছে। আয়ের সংখ্যার একই সপ্তাহে ঘোষিত একটা লভ্যাংশ, বা উইন্ডোর ভেতরে পড়ে যাওয়া একটা ইনডেক্স পুনর্বিন্যাসও অস্বাভাবিক রিটার্নকে নাড়াবে, আর পরীক্ষাটা দুটোকে আলাদা করতে পারবে না। এর সমাধান পরিসংখ্যানের নয়: উইন্ডোর ভেতরের প্রতিটা দিনের খবরের তার দেখুন, শুধু ঘোষণার আনুষ্ঠানিক তারিখ নয়, তারপর CAR-টা যে ঘটনা পরীক্ষা করার কথা ছিল তার নামে লিখুন।</p>

<h2>একসঙ্গে জমা হওয়া ইভেন্ট তারিখ</h2>
<p>ওপরের t পরীক্ষা এস্টিমেশন উইন্ডোর রেসিডুয়াল ছড়ানোকে এই CAR-এর মতো একটা সংখ্যা কাকতালীয়ভাবে কতটা বদলাতে পারে তার পুরো গল্প ধরে নেয়, যা একটা কোম্পানি একটা তারিখে হলে ঠিক থাকে। অনেক কোম্পানি একই ইভেন্ট তারিখ ভাগ করলেই সেটা ভেঙে পড়ে, একটা জাতীয় বাজেট, একটা নীতি হারের সিদ্ধান্ত, একটা খাতের সব কোম্পানি একই দিনে যার বিরুদ্ধে রিপোর্ট করে এমন সময়সীমা, কারণ তখন কোম্পানিগুলোর অস্বাভাবিক রিটার্ন একই বাজারজোড়া ধাক্কা ভাগ করে নেয় আর আর স্বাধীন থাকে না। এমন একটা দলকে যেন প্রতিটা আলাদা, সম্পর্কহীন ঘটনা, এভাবে গড় করলে ফলাফলে যতটা আস্থা রাখা উচিত তার চেয়ে বেশি দেখায়। দলটাকে একটাই পর্যবেক্ষণ হিসেবে ধরুন, অনেকগুলো নয়: পুরো দলের জন্য একটাই CAR তৈরি করুন, অথবা ভাগ করা তারিখের সহসম্পর্কের জন্য পরীক্ষার ভেদাঙ্ক ঠিক করুন, প্রতিটা কোম্পানির জন্য আলাদা করে সহজ পরীক্ষাটা চালিয়ে প্রতিটাকে স্বাধীন প্রমাণ হিসেবে গোনার বদলে।</p>
<div class="side-note"><p class="side-note-label">উইন্ডোর ভেতরে লেনদেন-না-হওয়া একটা দিন</p><p>ইভেন্ট উইন্ডোর কোনো একটা দিনে লেনদেন না হওয়া শেয়ার এমন একটা অস্বাভাবিক রিটার্ন রেখে যায় যার পেছনে আসল কিছু নেই: টেনে আনা পুরনো দামটা ঘোষণার সেদিনের উত্তর নয়, গতকালের উত্তরের পুনরাবৃত্তি মাত্র। মডেল বসানোর এস্টিমেশন উইন্ডোর জন্য নয় শুধু, ইভেন্ট উইন্ডোর নিজের জন্যও লেনদেনের লগ দেখুন।</p></div>

<h2>কোথায় ভুল হয়</h2>
<ul>
<li>এস্টিমেশন উইন্ডোকে ইভেন্ট পর্যন্ত টেনে আনা, যাতে আলফা আর বিটা আগে থেকেই দাম বাড়ার প্রবণতা বহন করে।</li>
<li>CAR লেখা, পাশে কোনো t না রেখে।</li>
<li>একই ইভেন্ট তারিখ ভাগ করা কয়েকটা কোম্পানিকে কয়েকটা স্বাধীন পরীক্ষা হিসেবে ধরা।</li>
<li>একই উইন্ডোয় অন্য খবর আছে কি না না দেখেই পুরো CAR-এর কৃতিত্ব ইভেন্টটাকে দেওয়া।</li>
<li>ফলাফল দেখার পর ইভেন্ট উইন্ডো চওড়া করতে থাকা, যতক্ষণ না সংখ্যাটা যেমন আশা করা হয়েছিল তেমন দেখায়।</li>
</ul>

<h2>যাচাই তালিকা</h2>
<ul class="checklist">
<li>এস্টিমেশন উইন্ডো আর ইভেন্ট উইন্ডোর মাঝে একটা ফাঁক আছে, আর সেটা লেখায় বলা আছে।</li>
<li>আলফা, বিটা আর রেসিডুয়াল স্ট্যান্ডার্ড ডেভিয়েশন, তিনটেই এস্টিমেশন উইন্ডো থেকে, কখনও ইভেন্ট উইন্ডো থেকে নয়।</li>
<li>CAR-এর সঙ্গে একটা t আছে, শুধু একটা চিহ্ন নয়।</li>
<li>পুরো ইভেন্ট উইন্ডোর জন্য খবরের তার দেখা হয়েছে, শুধু ঘোষণার নিজের তারিখের জন্য নয়।</li>
<li>একই ইভেন্ট তারিখ ভাগ করা কোম্পানিগুলোকে একটা একসঙ্গে জমা হওয়া পর্যবেক্ষণ হিসেবে ধরা হয়েছে, কয়েকটা স্বাধীন পর্যবেক্ষণ হিসেবে নয়।</li>
</ul>

<p>ল্যাব পদ্ধতির তালিকা থেকে ইভেন্ট স্টাডি চালায়: এস্টিমেশন উইন্ডোয় বাজার মডেল বসায়, তারপর ইভেন্ট উইন্ডোর নিজের রিটার্ন দিয়ে অস্বাভাবিক রিটার্ন, CAR আর t সরাসরি APA টেবিলে লিখে দেয়; এর market বোতাম দুটো উইন্ডোরই দৈনিক তথ্য এনে দেয়, তাই কোনোটাই হাতে টাইপ করতে হয় না।</p>`,
};
