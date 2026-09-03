import type { MethodLesson } from "../research-methods";

export const LESSON: MethodLesson = {
  slug: "factor-regression-and-beta",
  minutes: 5,
  en: `<div class="at-a-glance"><p class="at-a-glance-label">At a glance</p><ul>
<li>A factor regression puts a stock's return above a safe rate against the market's return above the same rate, and reports the slope.</li>
<li>Beta is that slope: how many percent the stock's excess return tends to move for every one percent the market's excess return moves, in the same direction.</li>
<li>Alpha is the intercept: the average monthly excess return the regression cannot explain by market exposure alone.</li>
<li>R squared says how much of the stock's month to month swing is the market's; the rest is this firm's own news.</li>
<li>On a market where many stocks trade thin, a computed beta usually comes out too small, not too large.</li>
</ul></div>

<h2>Excess return, and why it is not the raw return</h2>
<p>A regression of one return on another is easy to write and slightly wrong. Holding cash already earns something: a treasury bill yield, a savings rate, whatever the safest asset on the market pays. What a stock has to earn to be worth the bother is its return above that floor. So both sides of the regression are excess returns: the stock's return minus the risk-free rate for the same month, and the market's return minus the same risk-free rate. Subtracting a number that moves with time keeps the intercept honest across periods when the risk-free rate itself was high or low, rather than folding a changing floor into a coefficient that is supposed to describe only the stock.</p>

<h2>The market model</h2>
<p>The market model is one regression with one right-hand variable: the stock's excess return equals alpha plus beta times the market's excess return, plus noise. It is ordinary least squares exactly as in the farms example elsewhere in this room, with rain replaced by the market's excess return and yield replaced by the stock's. Beta is the slope: covariance of the two excess returns divided by the variance of the market's. Alpha is the intercept: the mean stock excess return minus beta times the mean market excess return.</p>

<h2>Worked example: twelve months</h2>
<div class="ex"><b>Worked example.</b> Twelve months of excess return, in percent, for one stock and for the market. The risk-free rate has already been taken out of both columns. The mean market excess return is 1.0 and the mean stock excess return is 2.0.</div>
<div class="table-scroll"><table>
<thead><tr><th>Month</th><th>Market</th><th>Stock</th><th>Market minus 1.0</th><th>Stock minus 2.0</th><th>Product</th><th>Market deviation squared</th></tr></thead>
<tbody>
<tr><td>1</td><td>3.0</td><td>5.0</td><td>2</td><td>3</td><td>6</td><td>4</td></tr>
<tr><td>2</td><td>-2.0</td><td>-2.0</td><td>-3</td><td>-4</td><td>12</td><td>9</td></tr>
<tr><td>3</td><td>4.0</td><td>7.0</td><td>3</td><td>5</td><td>15</td><td>9</td></tr>
<tr><td>4</td><td>0.0</td><td>1.0</td><td>-1</td><td>-1</td><td>1</td><td>1</td></tr>
<tr><td>5</td><td>-1.0</td><td>-1.0</td><td>-2</td><td>-3</td><td>6</td><td>4</td></tr>
<tr><td>6</td><td>5.0</td><td>8.0</td><td>4</td><td>6</td><td>24</td><td>16</td></tr>
<tr><td>7</td><td>2.0</td><td>3.0</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>8</td><td>-3.0</td><td>-3.0</td><td>-4</td><td>-5</td><td>20</td><td>16</td></tr>
<tr><td>9</td><td>1.0</td><td>5.0</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>10</td><td>0.0</td><td>0.0</td><td>-1</td><td>-2</td><td>2</td><td>1</td></tr>
<tr><td>11</td><td>3.0</td><td>5.0</td><td>2</td><td>3</td><td>6</td><td>4</td></tr>
<tr><td>12</td><td>0.0</td><td>-4.0</td><td>-1</td><td>-6</td><td>6</td><td>1</td></tr>
<tr><td>Sum</td><td>12.0</td><td>24.0</td><td></td><td></td><td>99</td><td>66</td></tr>
</tbody></table></div>
<p>Beta is the sum of the products divided by the sum of the squared market deviations: 99 divided by 66, which is <strong>1.5</strong>. Alpha is the mean stock excess return minus beta times the mean market excess return: 2.0 minus 1.5 times 1.0, which is 2.0 minus 1.5, which is <strong>0.5</strong>. The line is stock excess return equals 0.5 plus 1.5 times market excess return.</p>

<h2>What R squared says</h2>
<p>Put each month's market excess return into that line: 5.0, -2.5, 6.5, 0.5, -1.0, 8.0, 3.5, -4.0, 2.0, 0.5, 5.0 and 0.5. The gaps between what happened and what the line predicts are the residuals: 0, 0.5, 0.5, 0.5, 0, 0, -0.5, 1.0, 3.0, -0.5, 0 and -4.5. Square them and add: the total is 31.5. The sum of squared deviations of the stock's own excess return, from the deviation column above, is 180. R squared is one minus the ratio of the two: 1 minus 31.5 over 180, which is 1 minus 0.175, which is <strong>0.825</strong>. Eighty two and a half per cent of this stock's month to month swing moved with the market. The rest, months nine and twelve especially, is this firm's own news landing on a day the market itself barely moved.</p>
<p class="note">R squared here comes from twelve months, and twelve months is not enough to call it stable. Treat it as a description of this particular year, not a forecast for the next one.</p>

<h2>Beta, said as a sentence about risk</h2>
<p>A beta of 1.5, the number this workbook found, says the stock's excess return tends to move one and a half times as far as the market's, in the same direction. A beta of 1.3, to take the round number analysts actually quote most often, says the same thing at a gentler slope: if the market's excess return rises ten per cent, expect this stock's excess return to rise about thirteen per cent over the same stretch, and to fall by about the same multiple when the market falls. A beta above one is not a promise of more return. It is a promise of more swing, on the way down as much as on the way up. A beta below one moves less than the market in both directions; a beta near zero barely moves with it at all; a negative beta is rare enough that it is worth checking the arithmetic before trusting it.</p>

<h2>The three-factor extension, briefly</h2>
<p>One right-hand variable is a start, not the whole story. Small companies have tended to outrun large ones by more than their market beta explains, and cheap companies, measured by book value against price, have tended to outrun expensive ones the same way. Fama and French's three-factor model adds both: a size factor, the return on small stocks minus large ones, and a value factor, the return on cheap stocks minus expensive ones, alongside the market factor already here. The regression is the same idea with three slopes instead of one, run exactly as before, and alpha is now the return the three together cannot explain, which is a stricter test than the single-factor alpha above.</p>

<h2>Dhaka Stock Exchange cautions</h2>
<p>Many counters on this market do not trade every session. A day with no trade is not a day with no news: the exchange simply carries the last traded price forward, so that day's return is recorded as zero whether the true price moved or not. A stock with several such days a month looks, on paper, less connected to the market than it is, because half its real reaction to a market move is sitting in the next session's price rather than that day's. The effect is not random noise, it is a one-directional pull: a beta estimated this way is usually biased towards zero, understating both how defensive a thinly traded stock looks and how risky it actually is once it does move. One way through it is to widen the window: sum returns over a week instead of a day, so a stale price has more time to catch up, or add a lead and a lag of the market's excess return to the same regression and add the three slopes together. Neither is free: a wider window throws away timing, and the lead-lag fix needs more months of data than the simple regression above to hold its own standard errors steady.</p>
<div class="side-note"><p class="side-note-label">Before trusting a beta</p><p>Check the trading calendar for the stock, not only the index. A beta built from twelve months in which the stock traded on nine sessions is a beta built from nine months, not twelve, whatever the row count says.</p></div>

<h2>Where it goes wrong</h2>
<ul>
<li>Regressing raw returns instead of excess returns, and calling the intercept alpha anyway.</li>
<li>Reading R squared as a verdict on the stock rather than on how much of its movement is systematic.</li>
<li>Quoting a beta with no mention of the window it was estimated over: a beta from a falling market and a beta from a calm one can differ for the same stock.</li>
<li>Trusting a beta from a stock that barely trades, with no correction and no warning.</li>
<li>Reporting alpha as skill without saying over what stretch, and without a standard error next to it.</li>
</ul>

<h2>Checklist</h2>
<ul class="checklist">
<li>Both columns are excess returns, the risk-free rate already taken out.</li>
<li>Beta is stated with the window it was estimated over.</li>
<li>R squared is reported as how much of the movement is explained, not as a grade.</li>
<li>Thin trading has been checked before the beta is trusted.</li>
<li>If a factor beyond the market is added, it is named and its own slope is reported.</li>
</ul>

<p>The lab runs a factor regression, including the single-factor CAPM case, from the method list and writes alpha, beta and R squared into the APA table on its own; its market button fetches a daily series for a ticker so twelve months of prices become excess returns without being typed in by hand, and the workshop's Returns tool turns a run of prices into the daily or monthly returns a factor regression needs before it can run at all.</p>`,
  bn: `<div class="at-a-glance"><p class="at-a-glance-label">এক নজরে</p><ul>
<li>ফ্যাক্টর রিগ্রেশন একটা শেয়ারের রিটার্নকে নিরাপদ হারের ওপরে বসিয়ে বাজারের রিটার্নের বিপরীতে দাঁড় করায়, একই হার দুই দিক থেকে বাদ দিয়ে, আর ঢাল জানায়।</li>
<li>বিটাই সেই ঢাল: বাজারের অতিরিক্ত রিটার্ন প্রতি এক শতাংশ বাড়লে শেয়ারের অতিরিক্ত রিটার্ন কত শতাংশ একই দিকে নড়ে।</li>
<li>আলফা হলো শুরুর মান: বাজারের সংস্পর্শ দিয়ে যা ব্যাখ্যা হয় না, এমন মাসিক গড় অতিরিক্ত রিটার্ন।</li>
<li>R² বলে, শেয়ারের মাসে মাসে ওঠানামার কতটা বাজারের নিজের; বাকিটা এই কোম্পানির নিজস্ব খবর।</li>
<li>যে বাজারে অনেক শেয়ারের লেনদেন কম হয়, সেখানে হিসাব করা বিটা সাধারণত বেশি নয়, কমই আসে।</li>
</ul></div>

<h2>অতিরিক্ত রিটার্ন, আসল রিটার্ন নয় কেন</h2>
<p>একটা রিটার্নকে আরেকটা রিটার্নের ওপর রিগ্রেশন করা সহজ, আর একটু ভুলও। নগদ টাকা রেখে দিলেও কিছু আয় হয়: ট্রেজারি বিলের হার, সঞ্চয়ের হার, বাজারের সবচেয়ে নিরাপদ সম্পদ যা দেয়। একটা শেয়ার ঝক্কি নেওয়ার যোগ্য হতে হলে তাকে সেই মেঝের ওপরে আয় করতে হয়। তাই রিগ্রেশনের দুই দিকই অতিরিক্ত রিটার্ন: শেয়ারের রিটার্ন বিয়োগ সেই মাসের ঝুঁকিমুক্ত হার, আর বাজারের রিটার্ন বিয়োগ একই হার। সময়ের সঙ্গে বদলানো একটা সংখ্যা বাদ দিলে শুরুর মান সৎ থাকে সেই সময়েও যখন ঝুঁকিমুক্ত হার নিজেই বেশি বা কম ছিল, নইলে বদলানো মেঝেটাই এমন এক সহগের ভেতর ঢুকে যেত যার কাজ শুধু শেয়ারটাকে বর্ণনা করা।</p>

<h2>বাজার মডেল</h2>
<p>বাজার মডেল একটাই রিগ্রেশন, একটাই ডান দিকের চলক নিয়ে: শেয়ারের অতিরিক্ত রিটার্ন সমান আলফা যোগ বিটা গুণ বাজারের অতিরিক্ত রিটার্ন, যোগ গোলমাল। এটা এই ঘরের আরেক জায়গার খামারের উদাহরণের মতোই সাধারণ লিস্ট স্কোয়ার, শুধু বৃষ্টির জায়গায় বাজারের অতিরিক্ত রিটার্ন, ফলনের জায়গায় শেয়ারের। বিটাই ঢাল: দুই অতিরিক্ত রিটার্নের সহভেদাঙ্ক ভাগ বাজারের ভেদাঙ্ক। আলফাই শুরুর মান: শেয়ারের গড় অতিরিক্ত রিটার্ন বিয়োগ বিটা গুণ বাজারের গড় অতিরিক্ত রিটার্ন।</p>

<h2>করে দেখানো: বারো মাস</h2>
<div class="ex"><b>করে দেখানো।</b> একটা শেয়ার আর বাজারের বারো মাসের অতিরিক্ত রিটার্ন, শতাংশে। দুই কলাম থেকেই ঝুঁকিমুক্ত হার আগে বাদ দেওয়া হয়েছে। বাজারের গড় অতিরিক্ত রিটার্ন ১.০, শেয়ারের গড় ২.০।</div>
<div class="table-scroll"><table>
<thead><tr><th>মাস</th><th>বাজার</th><th>শেয়ার</th><th>বাজার বিয়োগ ১.০</th><th>শেয়ার বিয়োগ ২.০</th><th>গুণফল</th><th>বাজারের ফারাকের বর্গ</th></tr></thead>
<tbody>
<tr><td>১</td><td>৩.০</td><td>৫.০</td><td>২</td><td>৩</td><td>৬</td><td>৪</td></tr>
<tr><td>২</td><td>-২.০</td><td>-২.০</td><td>-৩</td><td>-৪</td><td>১২</td><td>৯</td></tr>
<tr><td>৩</td><td>৪.০</td><td>৭.০</td><td>৩</td><td>৫</td><td>১৫</td><td>৯</td></tr>
<tr><td>৪</td><td>০.০</td><td>১.০</td><td>-১</td><td>-১</td><td>১</td><td>১</td></tr>
<tr><td>৫</td><td>-১.০</td><td>-১.০</td><td>-২</td><td>-৩</td><td>৬</td><td>৪</td></tr>
<tr><td>৬</td><td>৫.০</td><td>৮.০</td><td>৪</td><td>৬</td><td>২৪</td><td>১৬</td></tr>
<tr><td>৭</td><td>২.০</td><td>৩.০</td><td>১</td><td>১</td><td>১</td><td>১</td></tr>
<tr><td>৮</td><td>-৩.০</td><td>-৩.০</td><td>-৪</td><td>-৫</td><td>২০</td><td>১৬</td></tr>
<tr><td>৯</td><td>১.০</td><td>৫.০</td><td>০</td><td>৩</td><td>০</td><td>০</td></tr>
<tr><td>১০</td><td>০.০</td><td>০.০</td><td>-১</td><td>-২</td><td>২</td><td>১</td></tr>
<tr><td>১১</td><td>৩.০</td><td>৫.০</td><td>২</td><td>৩</td><td>৬</td><td>৪</td></tr>
<tr><td>১২</td><td>০.০</td><td>-৪.০</td><td>-১</td><td>-৬</td><td>৬</td><td>১</td></tr>
<tr><td>যোগ</td><td>১২.০</td><td>২৪.০</td><td></td><td></td><td>৯৯</td><td>৬৬</td></tr>
</tbody></table></div>
<p>বিটা হলো গুণফলের যোগ ভাগ বাজারের ফারাকের বর্গের যোগ: ৯৯ ভাগ ৬৬, মানে <strong>১.৫</strong>। আলফা হলো শেয়ারের গড় অতিরিক্ত রিটার্ন বিয়োগ বিটা গুণ বাজারের গড়: ২.০ বিয়োগ ১.৫ গুণ ১.০, মানে ২.০ বিয়োগ ১.৫, মানে <strong>০.৫</strong>। রেখাটা: শেয়ারের অতিরিক্ত রিটার্ন সমান ০.৫ যোগ ১.৫ গুণ বাজারের অতিরিক্ত রিটার্ন।</p>

<h2>R² কী বলে</h2>
<p>প্রতিটি মাসের বাজারের অতিরিক্ত রিটার্ন সেই রেখায় বসান: ৫.০, -২.৫, ৬.৫, ০.৫, -১.০, ৮.০, ৩.৫, -৪.০, ২.০, ০.৫, ৫.০ আর ০.৫। যা হয়েছে আর রেখা যা বলে, তার ফারাক হলো রেসিডুয়াল: ০, ০.৫, ০.৫, ০.৫, ০, ০, -০.৫, ১.০, ৩.০, -০.৫, ০ আর -৪.৫। বর্গ করে যোগ করুন: মোট ৩১.৫। ওপরের ফারাকের কলাম থেকে শেয়ারের নিজের অতিরিক্ত রিটার্নের ফারাকের বর্গের যোগ ১৮০। R² হলো এক বিয়োগ এই দুইয়ের অনুপাত: ১ বিয়োগ ৩১.৫ ভাগ ১৮০, মানে ১ বিয়োগ ০.১৭৫, মানে <strong>০.৮২৫</strong>। এই শেয়ারের মাসে মাসে ওঠানামার ৮২.৫ শতাংশ বাজারের সঙ্গে নড়েছে। বাকিটা, বিশেষ করে নয় আর বারো নম্বর মাস, এই কোম্পানির নিজস্ব খবর, এমন দিনে যখন বাজার নিজেই প্রায় নড়েনি।</p>
<p class="note">এই R² এসেছে বারো মাস থেকে, আর বারো মাস যথেষ্ট নয় এটাকে স্থিতিশীল বলার জন্য। এটাকে এই নির্দিষ্ট বছরের একটা বর্ণনা হিসেবে ধরুন, পরের বছরের পূর্বাভাস হিসেবে নয়।</p>

<h2>বিটা, ঝুঁকি নিয়ে একটা বাক্য হিসেবে</h2>
<p>১.৫ বিটা, এই খাতাটা যা পেয়েছে, বলে: শেয়ারের অতিরিক্ত রিটার্ন বাজারের চেয়ে দেড় গুণ দূরে যেতে চায়, একই দিকে। ১.৩ বিটা, বিশ্লেষকরা যে গোল সংখ্যাটা বেশি বলেন, একই কথা বলে একটু কম ঢালে: বাজারের অতিরিক্ত রিটার্ন দশ শতাংশ বাড়লে, এই শেয়ারের অতিরিক্ত রিটার্ন প্রায় তেরো শতাংশ বাড়বে বলে আশা করা যায়, আর বাজার পড়লে একই অনুপাতে পড়বে। এক-এর বেশি বিটা মানে বেশি রিটার্নের প্রতিশ্রুতি নয়। এর মানে বেশি ওঠানামা, ওঠায় যতটা তার চেয়ে কম নয় পড়ায়ও। এক-এর কম বিটা দুই দিকেই বাজারের চেয়ে কম নড়ে; শূন্যের কাছাকাছি বিটা বাজারের সঙ্গে প্রায় নড়েই না; ঋণাত্মক বিটা এতই বিরল যে বিশ্বাস করার আগে হিসাবটা আরেকবার দেখা উচিত।</p>

<h2>তিন-ফ্যাক্টর সম্প্রসারণ, সংক্ষেপে</h2>
<p>একটা ডান দিকের চলক একটা শুরু, পুরো গল্প নয়। ছোট কোম্পানিগুলো তাদের বাজার বিটা যা ব্যাখ্যা করে তার চেয়ে বেশি এগিয়ে থাকার ঝোঁক দেখিয়েছে বড় কোম্পানিগুলোর চেয়ে, আর সস্তা কোম্পানিগুলো, দামের বিপরীতে বইয়ের মূল্য মেপে, একইভাবে দামি কোম্পানিগুলোর চেয়ে এগিয়ে থাকার ঝোঁক দেখিয়েছে। ফামা আর ফ্রেঞ্চের তিন-ফ্যাক্টর মডেল দুটোই যোগ করে: একটা আকার ফ্যাক্টর, ছোট শেয়ারের রিটার্ন বিয়োগ বড়গুলোর, আর একটা মূল্য ফ্যাক্টর, সস্তা শেয়ারের রিটার্ন বিয়োগ দামিগুলোর, ইতিমধ্যে থাকা বাজার ফ্যাক্টরের পাশে। রিগ্রেশনটা একই ধারণা, শুধু একটার বদলে তিনটে ঢাল নিয়ে, ঠিক আগের মতোই চালানো, আর আলফা এখন সেই রিটার্ন যা তিনটে মিলেও ব্যাখ্যা করতে পারে না, যা একক-ফ্যাক্টর আলফার চেয়ে কঠিন পরীক্ষা।</p>

<h2>ঢাকা স্টক এক্সচেঞ্জের সতর্কতা</h2>
<p>এই বাজারের অনেক কাউন্টার প্রতি সেশনে লেনদেন হয় না। যেদিন লেনদেন নেই সেদিন খবর নেই তা নয়: এক্সচেঞ্জ শুধু আগের লেনদেন হওয়া দামটাই টেনে নিয়ে আসে, তাই সেদিনের রিটার্ন শূন্য হিসেবে লেখা হয়, আসল দাম নড়ুক বা না নড়ুক। মাসে এমন কয়েকটা দিন থাকা শেয়ার কাগজে-কলমে বাজারের সঙ্গে যতটা যুক্ত মনে হয়, তার চেয়ে কম যুক্ত দেখায়, কারণ বাজারের নড়াচড়ায় তার আসল প্রতিক্রিয়ার অর্ধেকটাই সেদিনের বদলে পরের সেশনের দামে বসে থাকে। এটা এলোমেলো গোলমাল নয়, একদিকে টানা একটা টান: এভাবে হিসাব করা বিটা সাধারণত শূন্যের দিকে হেলে যায়, ফলে কম লেনদেন হওয়া শেয়ারটাকে যতটা রক্ষণশীল দেখায় তার চেয়ে বেশি রক্ষণশীল দেখায়, আর নড়লে সেটা আসলে যতটা ঝুঁকিপূর্ণ তার চেয়ে কম ঝুঁকিপূর্ণ মনে হয়। এর একটা পথ হলো জানালাটা চওড়া করা: একদিনের বদলে এক সপ্তাহের রিটার্ন যোগ করা, যাতে পুরনো দামটা ধরে ফেলার সময় পায়, অথবা একই রিগ্রেশনে বাজারের অতিরিক্ত রিটার্নের একটা আগের আর একটা পরের মাস যোগ করে তিনটে ঢাল একসঙ্গে যোগ করা। কোনোটাই বিনামূল্যে নয়: চওড়া জানালা সময়ের নির্ভুলতা হারায়, আর আগে-পরে যোগ করার পদ্ধতির স্ট্যান্ডার্ড এরর স্থির রাখতে ওপরের সাধারণ রিগ্রেশনের চেয়ে বেশি মাসের তথ্য লাগে।</p>
<div class="side-note"><p class="side-note-label">বিটা বিশ্বাস করার আগে</p><p>ইনডেক্স নয়, শেয়ারটার নিজের লেনদেন ক্যালেন্ডার দেখুন। বারো মাসের মধ্যে যে শেয়ার নয় সেশনে লেনদেন হয়েছে, সেই তথ্য থেকে তৈরি বিটা আসলে নয় মাসের বিটা, সারি সংখ্যা যা-ই বলুক না কেন।</p></div>

<h2>কোথায় ভুল হয়</h2>
<ul>
<li>অতিরিক্ত রিটার্নের বদলে আসল রিটার্ন নিয়ে রিগ্রেশন করা, তারপরও শুরুর মানকে আলফা বলা।</li>
<li>R²-কে শেয়ারটার রায় ভেবে নেওয়া, তার নড়াচড়ার কতটা নিয়মিত তা না ভেবে।</li>
<li>বিটা কোন সময়ে হিসাব হয়েছে তা না বলে বিটা উদ্ধৃত করা: পড়তি বাজার থেকে পাওয়া বিটা আর শান্ত বাজার থেকে পাওয়া বিটা একই শেয়ারের জন্য আলাদা হতে পারে।</li>
<li>প্রায় লেনদেনই না হওয়া শেয়ারের বিটা কোনো সংশোধন বা সতর্কতা ছাড়াই বিশ্বাস করা।</li>
<li>কত সময় ধরে, আর কী স্ট্যান্ডার্ড এরর সহ, তা না বলে আলফাকে দক্ষতা বলে চালানো।</li>
</ul>

<h2>যাচাই তালিকা</h2>
<ul class="checklist">
<li>দুই কলামই অতিরিক্ত রিটার্ন, ঝুঁকিমুক্ত হার আগেই বাদ দেওয়া।</li>
<li>বিটা কোন সময়ে হিসাব হয়েছে তা বলা আছে।</li>
<li>R² লেখা হয়েছে নড়াচড়ার কতটা ব্যাখ্যা হয় তা হিসেবে, নম্বর হিসেবে নয়।</li>
<li>বিটা বিশ্বাস করার আগে কম লেনদেনের বিষয়টা দেখা হয়েছে।</li>
<li>বাজারের বাইরে আরেকটা ফ্যাক্টর যোগ হলে তার নাম আর নিজের ঢাল লেখা আছে।</li>
</ul>

<p>ল্যাব একক-ফ্যাক্টর CAPM সহ ফ্যাক্টর রিগ্রেশন চালায় পদ্ধতির তালিকা থেকে, আর নিজে থেকেই আলফা, বিটা আর R² APA টেবিলে লিখে দেয়; এর market বোতাম একটা টিকারের দৈনিক তথ্য এনে দেয়, তাই বারো মাসের দাম হাতে না লিখেই অতিরিক্ত রিটার্নে বদলে যায়, আর কর্মশালার Returns যন্ত্র দামের একটা ধারাকে দৈনিক বা মাসিক রিটার্নে বদলায়, যা ফ্যাক্টর রিগ্রেশন চালানোর আগে লাগবেই।</p>`,
};
