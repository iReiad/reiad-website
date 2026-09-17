/* ============================================================
   10-sentences.ts: পর্ব ১০, বাক্যের চার রকম, আর বড় হাতের অক্ষর.

   One part of the grammar term, gathered into the rung by
   `basic.ts` next door and seeded by `scripts/seed-english.ts`.
   The house rules for the text are at the top of `basic.ts`.
   ============================================================ */

import { mount, type PartContent } from "../shape.ts";

export const PART: PartContent = {
  bn: `
<p>নানু গল্পের মাঝে চারটা কাজ করেন। কিছু বলেন: "রাজা ঘুমিয়ে পড়ল।" কিছু জিজ্ঞেস করেন: "তখন কে এল?" কিছু আদেশ করেন: "চুপ করে শোনো।" আর মাঝে মাঝে চমকে ওঠেন: "কী ভয়ংকর!" ইংরেজি বাক্যও ঠিক এই চার কাজ করে, আর প্রতিটার শুরু আর শেষ আলাদা। এই পর্বে বাক্যের চারটা জাত, আর যে চিহ্নগুলো তাদের আলাদা করে: বড় হাতের অক্ষর, ফুল স্টপ, প্রশ্নবোধক আর বিস্ময়চিহ্ন।</p>

<p>আর তার সাথে যা যা পরীক্ষায় আসে: বাক্যের অংশগুলো (কর্তা, ক্রিয়া, কর্ম, পূরক), গঠন অনুযায়ী তিন জাত (<span lang="en">simple, compound, complex</span>), না-বাচক বানানোর মেশিন, আর এক জাত থেকে আরেক জাতে যাওয়ার প্রথম ধাপ, যেটা পর্ব ২৪-এর <span lang="en">transformation</span>-এর ভিত্তি।</p>

<div class="at-a-glance">
<p class="at-a-glance-label">এক নজরে</p>
<ul>
<li>প্রতিটা বাক্য বড় হাতের অক্ষরে শুরু আর একটা চিহ্নে শেষ। এর মাঝে অন্তত একটা কর্তা আর একটা ক্রিয়া।</li>
<li>বলা (<span lang="en">statement</span>): কর্তা + ক্রিয়া, শেষে ফুল স্টপ। <span lang="en">Rafi plays cricket.</span></li>
<li>জিজ্ঞেস করা (<span lang="en">question</span>): সাহায্যকারী আগে, শেষে ?। <span lang="en">Does Rafi play cricket?</span></li>
<li>আদেশ (<span lang="en">command</span>): কর্তা নেই, ক্রিয়া দিয়ে শুরু। <span lang="en">Play carefully.</span></li>
<li>চমকে ওঠা (<span lang="en">exclamation</span>): <span lang="en">What a…! How…!</span>, শেষে !। <span lang="en">What a catch!</span></li>
<li>গঠনে তিন জাত: <span lang="en">simple</span> (এক ক্রিয়া), <span lang="en">compound</span> (<span lang="en">and, but, or</span> দিয়ে দুটো), <span lang="en">complex</span> (<span lang="en">because, when, if</span> দিয়ে একটা অন্যটার নিচে)।</li>
</ul>
</div>

${mount("sentences-pattern")}

<h2>বাক্য কাকে বলে, আর কাকে বলে না</h2>

<p>একটা বাক্যে অন্তত দুটো জিনিস থাকতেই হবে: কে (কর্তা) আর কী করে (ক্রিয়া)। <span lang="en">Rafi runs.</span> দুটো শব্দ, পূর্ণ বাক্য। <span lang="en">The fast bowler from Khulna with the new ball</span> দশটা শব্দ, কিন্তু বাক্য নয়, কারণ কোনো ক্রিয়া নেই: বোলারটা কী করল? বলা হয়নি। পরীক্ষায় লেখায় এই ভুলটার একটা নাম আছে, <span lang="en">fragment</span>, টুকরো। কিছু লেখার পর নিজেকে জিজ্ঞেস করো: কে, আর কী করল? দুটোর উত্তর থাকলে বাক্য।</p>

<h2>বাক্যের অংশ: কে, কী করে, কী, কেমন</h2>

<p>একটা বাক্যকে দুই ভাগে কাটা যায়: কর্তা (<span lang="en">subject</span>), যাকে নিয়ে কথা, আর বাকিটা (<span lang="en">predicate</span>), তাকে নিয়ে যা বলা হলো। <span lang="en">Rafi | plays cricket every Friday.</span> বাকিটার ভিতরে ক্রিয়া (<span lang="en">plays</span>), কর্ম (<span lang="en">cricket</span>, কাজটা যার উপর), আর বাড়তি কথা (<span lang="en">every Friday</span>)।</p>

<p>কর্ম দুই রকম হতে পারে। <span lang="en">Nanu gave Rafi a mango.</span> কী দিলেন? আম, সেটা সরাসরি কর্ম। কাকে দিলেন? রাফিকে, সেটা পরোক্ষ কর্ম। আর <span lang="en">be, seem, become</span>-এর পরে যেটা বসে সেটা কর্ম নয়, পূরক (<span lang="en">complement</span>): <span lang="en">Rafi is a bowler. Rafi is tired.</span> কর্তাকে পূরণ করছে, কর্তারই আরেকটা নাম বা রং। কর্ম আর পূরকের পার্থক্য: কর্ম আলাদা জিনিস (আম), পূরক কর্তাই (রাফিই বোলার)।</p>

<div class="table-scroll">
<table>
<thead><tr><th>বাক্য</th><th>কর্তা</th><th>ক্রিয়া</th><th>কর্ম / পূরক</th><th>বাড়তি</th></tr></thead>
<tbody>
<tr><td><span lang="en">Rafi plays cricket every Friday.</span></td><td><span lang="en">Rafi</span></td><td><span lang="en">plays</span></td><td><span lang="en">cricket</span> (কর্ম)</td><td><span lang="en">every Friday</span></td></tr>
<tr><td><span lang="en">Nanu gave Rafi a mango.</span></td><td><span lang="en">Nanu</span></td><td><span lang="en">gave</span></td><td><span lang="en">Rafi</span> (কাকে), <span lang="en">a mango</span> (কী)</td><td></td></tr>
<tr><td><span lang="en">Mitu is a good student.</span></td><td><span lang="en">Mitu</span></td><td><span lang="en">is</span></td><td><span lang="en">a good student</span> (পূরক)</td><td></td></tr>
<tr><td><span lang="en">The baby slept.</span></td><td><span lang="en">The baby</span></td><td><span lang="en">slept</span></td><td>নেই</td><td></td></tr>
</tbody>
</table>
</div>

${mount("sentences-parts")}

<h2>প্রথম জাত: বলা</h2>

<p>সবচেয়ে সাধারণ। কর্তা, ক্রিয়া, বাকিটা, ফুল স্টপ। <span lang="en">Mitu is studying. The sky is blue. Bangladesh won.</span> না-বাচক করতে <span lang="en">not</span>: <span lang="en">be</span> থাকলে তার পরে (<span lang="en">Mitu is not studying</span>), না থাকলে <span lang="en">do/does/did + not</span> (<span lang="en">Rafi does not like spinach</span>)। এই <span lang="en">do</span>-র মেশিনটা পর্ব ১৩-তে পুরো খোলা হবে।</p>

<p>না-বাচকের নিয়মটা এখানেই একটা ছকে, কারণ পরীক্ষার <span lang="en">transformation</span>-এ <span lang="en">affirmative to negative</span> প্রতি বছর:</p>

<div class="table-scroll">
<table>
<thead><tr><th>বাক্যে আছে</th><th>না-বাচক</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">am, is, are, was, were</span></td><td>তার পরে <span lang="en">not</span></td><td><span lang="en">Mitu is not studying.</span></td></tr>
<tr><td><span lang="en">can, will, must, have (V3 সহ)</span></td><td>তার পরে <span lang="en">not</span></td><td><span lang="en">Rafi cannot swim. She has not come.</span></td></tr>
<tr><td>শুধু সাধারণ ক্রিয়া, বর্তমান</td><td><span lang="en">do not / does not</span> + খালি ক্রিয়া</td><td><span lang="en">Rafi does not like spinach.</span></td></tr>
<tr><td>শুধু সাধারণ ক্রিয়া, অতীত</td><td><span lang="en">did not</span> + খালি ক্রিয়া</td><td><span lang="en">They did not win.</span></td></tr>
<tr><td><span lang="en">always, everyone, both</span></td><td><span lang="en">never, no one, neither</span></td><td><span lang="en">He never lies. No one came.</span></td></tr>
</tbody>
</table>
</div>

<p>দুটো ফাঁদ: <span lang="en">did not</span>-এর পরে ক্রিয়া খালি, <span lang="en">did not went</span> নয়; আর ইংরেজিতে একটা বাক্যে একটাই না: <span lang="en">I don't know nothing</span> মানে আসলে "আমি কিছু জানি", তাই <span lang="en">I don't know anything</span>।</p>

${mount("sentences-negative")}

<h2>দ্বিতীয় জাত: জিজ্ঞেস করা</h2>

<p>ইংরেজিতে প্রশ্ন করতে বাক্যের প্রথম দুটো শব্দ উল্টে দাও, বা সামনে একটা <span lang="en">do</span> বসাও। <span lang="en">You are ready. Are you ready?</span> <span lang="en">Rafi plays. Does Rafi play?</span> আর wh-শব্দ থাকলে সেটা সবার আগে: <span lang="en">Where does Rafi play?</span> শেষে সবসময় প্রশ্নবোধক। বাংলায় শুধু সুর বদলে প্রশ্ন হয় ("তুমি রেডি?"), ইংরেজিতে শব্দ নড়াতে হয়। এটাই বাংলাভাষীর দ্বিতীয় বড় ফাঁদ।</p>

<p>প্রশ্ন দুই জাতের। যার উত্তর হ্যাঁ বা না: সাহায্যকারী দিয়ে শুরু, <span lang="en">Is Mitu studying? Did they win?</span> আর যার উত্তর একটা তথ্য: wh-শব্দ দিয়ে শুরু, <span lang="en">Where is Mitu studying? Who won?</span> দুটোতেই একই মেশিন, শুধু দ্বিতীয়টায় সামনে একটা wh-শব্দ বসে। পর্ব ১৩-তে মেশিনটা পুরো, লেজ-প্রশ্ন সহ।</p>

${mount("sentences-lines")}

${mount("sentences-machine")}

<h2>তৃতীয় জাত: আদেশ</h2>

<p>কর্তা লুকানো, সবসময় <span lang="en">you</span>। ক্রিয়ার খালি রূপ দিয়ে শুরু। <span lang="en">Sit down. Open your books. Listen carefully.</span> ভদ্র করতে <span lang="en">please</span>, শুরুতে বা শেষে: <span lang="en">Please sit down. Sit down, please.</span> না করতে <span lang="en">Don't</span>: <span lang="en">Don't run. Don't be late.</span> আর <span lang="en">Let's</span> দিয়ে নিজেদেরকে: <span lang="en">Let's go. Let's eat.</span></p>

<p>আদেশের একটা সিঁড়ি আছে, হুকুম থেকে অনুরোধ: <span lang="en">Sit down. Please sit down. Sit down, will you? Could you sit down, please? Would you mind sitting down?</span> একই কথা, পাঁচ সুর। শেষ দুটো আসলে প্রশ্নের চেহারায় আদেশ, আর <span lang="en">Would you mind</span>-এর পরে <span lang="en">-ing</span>। পর্ব ১২-এর modal-এ এই ভদ্রতার সিঁড়ি আবার আসবে।</p>

<h2>চতুর্থ জাত: চমকে ওঠা</h2>

<p>দুটো ছাঁচ, আর দুটোই বিস্ময়চিহ্নে শেষ। <span lang="en">What + a/an + adjective + noun!</span> <span lang="en">What a beautiful catch! What an idea!</span> আর <span lang="en">How + adjective!</span> <span lang="en">How beautiful! How strange!</span> ফাঁদ: <span lang="en">What a nice day!</span> ঠিক, কারণ noun আছে (<span lang="en">day</span>); <span lang="en">How nice!</span> ঠিক, কারণ শুধু adjective। <span lang="en">How a nice day!</span> ভুল, <span lang="en">What nice!</span> ভুল।</p>

<p>বহুবচন আর গোনা যায় না এমন জিনিসে <span lang="en">What</span>-এর পরে <span lang="en">a</span> নেই: <span lang="en">What beautiful flowers! What terrible weather!</span> আর <span lang="en">How</span>-এর পরে পুরো বাক্যও বসতে পারে: <span lang="en">How fast he runs! How well she sings!</span> এখানে ক্রম বলার মতোই, উল্টানো নয়: <span lang="en">he runs</span>, <span lang="en">runs he</span> নয়। পরীক্ষায় <span lang="en">exclamatory to assertive</span>: <span lang="en">What a beautiful catch!</span> হয়ে যায় <span lang="en">It is a very beautiful catch.</span> <span lang="en">What/How</span> সরাও, <span lang="en">very</span> বসাও, ফুল স্টপ।</p>

${mount("sentences-bins")}

${mount("sentences-reveal")}

<h2>গঠনে তিন জাত: simple, compound, complex</h2>

<p>উপরের চার জাত কাজ দিয়ে। পরীক্ষায় আরেকটা ভাগ আসে, গঠন দিয়ে: বাক্যে কয়টা ক্রিয়া, আর তারা কীভাবে জোড়া। <strong><span lang="en">simple</span>:</strong> একটা কর্তা-ক্রিয়ার জোড়া। <span lang="en">Rafi played well.</span> <strong><span lang="en">compound</span>:</strong> দুটো সমান বাক্য, <span lang="en">and, but, or, so</span> দিয়ে জোড়া, দুটোই একা দাঁড়াতে পারে। <span lang="en">Rafi played well, but the team lost.</span> <strong><span lang="en">complex</span>:</strong> একটা মূল বাক্য আর একটা তার নিচের বাক্য, <span lang="en">because, when, if, although, that, who</span> দিয়ে; নিচেরটা একা দাঁড়াতে পারে না। <span lang="en">Although Rafi played well, the team lost.</span></p>

<div class="table-scroll">
<table>
<thead><tr><th>জাত</th><th>চেনার চিহ্ন</th><th>উদাহরণ</th></tr></thead>
<tbody>
<tr><td><span lang="en">simple</span></td><td>একটা ক্রিয়া, কোনো জোড়ার শব্দ নেই (কর্তা বা ক্রিয়া দুটো হলেও চলে)</td><td><span lang="en">Rafi and Mitu played and won.</span></td></tr>
<tr><td><span lang="en">compound</span></td><td><span lang="en">and, but, or, so, yet</span> দুটো পুরো বাক্যের মাঝে</td><td><span lang="en">Rafi bowled, and Mitu kept wicket.</span></td></tr>
<tr><td><span lang="en">complex</span></td><td><span lang="en">because, when, if, although, that, who, which, while, since, unless</span></td><td><span lang="en">We won because Rafi bowled well.</span></td></tr>
</tbody>
</table>
</div>

<p>চেনার কৌশল: জোড়ার শব্দটা খোঁজো। <span lang="en">and, but, or, so</span> হলে <span lang="en">compound</span>। <span lang="en">because, when, if, although, that, who</span> হলে <span lang="en">complex</span>। কিছু না থাকলে <span lang="en">simple</span>, দুটো কর্তা থাকলেও (<span lang="en">Rafi and Mitu played</span>: একটা ক্রিয়া, তাই <span lang="en">simple</span>)। পর্ব ১৪-তে এই তিন জাতের মধ্যে বদল করার মেশিন, যেটা <span lang="en">transformation</span>-এর দ্বিতীয় বড় প্রশ্ন।</p>

${mount("sentences-structure")}

<h2>শুরু আর শেষের চিহ্ন</h2>

<p>প্রতিটা বাক্য বড় হাতের অক্ষরে শুরু। বড় হাত আরও লাগে: নাম (<span lang="en">Rafi, Dhaka</span>), দিন আর মাস (<span lang="en">Friday, June</span>), ভাষা আর জাতি (<span lang="en">Bangla, Bangladeshi</span>), <span lang="en">I</span> শব্দটা সবসময়, বইয়ের নামের বড় শব্দগুলো (<span lang="en">Harry Potter and the Goblet of Fire</span>)। ঋতুর নামে বড় হাত নয়: <span lang="en">summer, winter</span>।</p>

<p>শেষে তিনটার একটা: ফুল স্টপ (বলা, আদেশ), প্রশ্নবোধক (জিজ্ঞেস), বিস্ময়চিহ্ন (চমক, বা জোরালো আদেশ: <span lang="en">Stop!</span>)। আর মাঝখানের সবচেয়ে গুরুত্বপূর্ণ চিহ্নটা কমা, যেটার জন্য আলাদা একটা পর্ব আছে, পর্ব ২৩। আপাতত একটা লাইন: <span lang="en">Let's eat, Nanu</span> মানে নানুকে খেতে ডাকা; <span lang="en">Let's eat Nanu</span> মানে নানুকে খেয়ে ফেলা। কমা মানুষের জীবন বাঁচায়।</p>

${mount("sentences-gap")}

<h2>এক জাত থেকে আরেক জাতে</h2>

<p>একই কথা চার জাতে বলা যায়, আর পরীক্ষার <span lang="en">transformation</span> ঠিক এটাই চায়। <span lang="en">Rafi is a brilliant bowler.</span> (বলা) <span lang="en">Isn't Rafi a brilliant bowler?</span> (জিজ্ঞেস, একই মানে, কারণ উত্তর হ্যাঁ) <span lang="en">What a brilliant bowler Rafi is!</span> (চমক) আর আদেশে বলতে গেলে ক্রিয়া বদলাতে হয়: <span lang="en">Bowl like Rafi.</span> প্রতিটা বদলের একটা ছোট নিয়ম, আর পর্ব ২৪-এ পুরো তালিকা। আজ শুধু চিনে রাখো: হ্যাঁ-বাচক বলা হয়ে যায় না-বাচক প্রশ্ন (<span lang="en">Isn't…?</span>), না-বাচক বলা হয়ে যায় হ্যাঁ-বাচক প্রশ্ন (<span lang="en">He is not honest. Is he honest?</span>), আর চমকে <span lang="en">very</span> হয়ে যায় <span lang="en">What a / How</span>।</p>

${mount("sentences-transform")}

${mount("sentences-build")}

${mount("sentences-spot")}

<h2>পরীক্ষার হলে: প্রশ্ন যেমন আসে</h2>

<p>এই পর্বের প্রশ্ন তিন চেহারায়। এক: <span lang="en">Identify the kind of sentence</span>, কাজ অনুযায়ী (চার জাত) বা গঠন অনুযায়ী (তিন জাত)। দুই: <span lang="en">transformation</span>, এক জাত থেকে আরেক জাতে। তিন: যতিচিহ্ন আর বড় হাত ঠিক করা। প্রথমটার ধাপ:</p>

<ol class="step-list">
<li><strong>প্রশ্নটা কাজের না গঠনের?</strong> <span lang="en">assertive, interrogative, imperative, exclamatory</span> চাইলে কাজ। <span lang="en">simple, compound, complex</span> চাইলে গঠন।</li>
<li><strong>কাজ হলে শেষের চিহ্ন আর প্রথম শব্দ।</strong> ? হলে <span lang="en">interrogative</span>। ! আর <span lang="en">What/How</span> হলে <span lang="en">exclamatory</span>। খালি ক্রিয়া, <span lang="en">Don't, Let's, Please</span> হলে <span lang="en">imperative</span>। বাকি <span lang="en">assertive</span>, <span lang="en">not</span> থাকলে <span lang="en">negative</span>।</li>
<li><strong>গঠন হলে জোড়ার শব্দ।</strong> <span lang="en">and, but, or, so</span>: <span lang="en">compound</span>। <span lang="en">because, when, if, although, that, who, which</span>: <span lang="en">complex</span>। কিছু নেই: <span lang="en">simple</span>।</li>
<li><strong>উত্তরে পুরো নাম লেখো।</strong> <span lang="en">Interrogative sentence</span>, শুধু <span lang="en">question</span> নয়।</li>
</ol>

<div class="ex"><b>একটা পুরো নমুনা:</b> <span lang="en">(a) What a lovely morning it is! (b) Don't waste it. (c) Rafi is playing, and Mitu is reading. (d) Did you see the sky? (e) We stayed home because it rained.</span> কাজ অনুযায়ী: (a) <span lang="en">exclamatory</span>, (b) <span lang="en">imperative, negative</span>, (c) <span lang="en">assertive</span>, (d) <span lang="en">interrogative</span>, (e) <span lang="en">assertive</span>। গঠন অনুযায়ী: (a) <span lang="en">simple</span>, (b) <span lang="en">simple</span>, (c) <span lang="en">compound</span>, (d) <span lang="en">simple</span>, (e) <span lang="en">complex</span>। পাঁচটা বাক্য, দুই রকম উত্তর।</div>

${mount("sentences-exam")}

<div class="side-note">
<p class="side-note-label">পরীক্ষার কৌশল</p>
<p>বাক্যের জাত চিহ্নিত করতে বললে শেষের চিহ্ন আর প্রথম শব্দ দেখো। ? হলে <span lang="en">interrogative</span>। ! আর শুরুতে <span lang="en">What/How</span> হলে <span lang="en">exclamatory</span>। শুরুতে খালি ক্রিয়া, <span lang="en">Don't</span> বা <span lang="en">Let's</span> হলে <span lang="en">imperative</span>। বাকি সব <span lang="en">assertive</span>, আর তার ভিতরে <span lang="en">not</span> থাকলে <span lang="en">negative</span>। <span lang="en">Transformation</span> প্রশ্নে এই চারটার মাঝে বদল করতে বলা হয়; পর্ব ২৪ সেই মেশিন।</p>
</div>

<div class="side-note">
<p class="side-note-label">ফাঁদ</p>
<p>দুটো পুরো বাক্য শুধু কমা দিয়ে জোড়া দেওয়া যায় না: <span lang="en">Rafi played well, he scored fifty</span> ভুল। হয় ফুল স্টপ (<span lang="en">Rafi played well. He scored fifty.</span>), নয় একটা জোড়ার শব্দ (<span lang="en">Rafi played well and he scored fifty</span>)। জোড়ার শব্দগুলো পর্ব ১৪-তে।</p>
</div>

<div class="side-note">
<p class="side-note-label">আরেকটা ফাঁদ</p>
<p><span lang="en">Let's</span>-এর পরে খালি ক্রিয়া, আর অ্যাপস্ট্রফিটা লাগবেই, কারণ ওটা <span lang="en">Let us</span>। <span lang="en">Lets go</span> ভুল, <span lang="en">Let's to go</span> ভুল। আর লেজ-প্রশ্নে <span lang="en">Let's go, shall we?</span> আর <span lang="en">Don't</span>-এর সাথে <span lang="en">Don't be late, will you?</span> এই দুটো লেজ পর্ব ১৩-তে আবার।</p>
</div>

<h2>পর্ব শেষে</h2>

<div class="checklist">
<p>নিজেকে জিজ্ঞেস করো:</p>
<ul>
<li>চার জাতের বাক্য একটা কথা দিয়ে জোরে বলতে পারি?</li>
<li>কর্তা, ক্রিয়া, কর্ম, পূরক: একটা বাক্যে দেখাতে পারি?</li>
<li><span lang="en">simple, compound, complex</span> চেনার শব্দগুলো?</li>
<li>না-বাচকের ছক: কখন <span lang="en">not</span>, কখন <span lang="en">do not</span>, কখন <span lang="en">did not</span>?</li>
<li><span lang="en">What a…!</span> আর <span lang="en">How…!</span>: কোনটায় noun লাগে?</li>
<li>বড় হাত কোথায় লাগে, কোথায় নয়?</li>
</ul>
</div>

${mount("sentences-drill")}
`,
  blocks: {
    "sentences-pattern": {
      kind: "pattern",
      title: { bn: "চার জাত, চার শুরু, তিন শেষ", en: "Four kinds, four openings, three endings" },
      shape: "Rafi plays.  ·  Does Rafi play?  ·  Play!  ·  What a shot!",
      why: { bn: "একই তিনটে শব্দ চার রকম কাজ করে, শুধু ক্রম আর চিহ্ন বদলে। বলা: কর্তা আগে। জিজ্ঞেস: সাহায্যকারী আগে। আদেশ: কর্তা নেই। চমক: What বা How দিয়ে শুরু।", en: "The same three words do four jobs by changing order and mark. Statement: subject first. Question: helper first. Command: no subject. Exclamation: starts with What or How." },
      examples: [
        { target: "Nanu is telling a story.", bn: "নানু একটা গল্প বলছেন। (বলা)" },
        { target: "Is Nanu telling a story?", bn: "নানু কি একটা গল্প বলছেন? (জিজ্ঞেস)" },
        { target: "Tell us a story, Nanu.", bn: "একটা গল্প বলো, নানু। (আদেশ, অনুরোধ)" },
        { target: "What a story that was!", bn: "কী একটা গল্প ছিল সেটা! (চমক)" },
      ],
      tip: { bn: "বাংলায় সুর বদলালেই প্রশ্ন। ইংরেজিতে শব্দ নড়াতে হয়: প্রথম দুটো উল্টাও, বা সামনে do বসাও।", en: "In Bangla a change of tune makes a question. In English words have to move: swap the first two, or put do in front." },
    },
    "sentences-parts": {
      kind: "figure",
      shape: "flow",
      title: { bn: "একটা বাক্যের অংশ", en: "The parts of one sentence" },
      parts: [
        { text: { bn: "কর্তা: Nanu", en: "Subject: Nanu" }, note: { bn: "যাকে নিয়ে কথা", en: "who the sentence is about" }, tone: "lead" },
        { text: { bn: "ক্রিয়া: gave", en: "Verb: gave" }, note: { bn: "কী করল", en: "what was done" }, tone: "good" },
        { text: { bn: "পরোক্ষ কর্ম: Rafi", en: "Indirect object: Rafi" }, note: { bn: "কাকে", en: "to whom" } },
        { text: { bn: "কর্ম: a mango", en: "Object: a mango" }, note: { bn: "কী", en: "what" } },
        { text: { bn: "বাড়তি: after the match", en: "Extra: after the match" }, note: { bn: "কখন, কোথায়, কীভাবে", en: "when, where, how" } },
      ],
      caption: { bn: "Nanu gave Rafi a mango after the match. কর্তা আর ক্রিয়া ছাড়া বাক্য হয় না; বাকিগুলো ক্রিয়া চাইলে বসে।", en: "Nanu gave Rafi a mango after the match. Subject and verb are compulsory; the rest come when the verb asks for them." },
    },
    "sentences-negative": {
      kind: "gap",
      title: { bn: "না-বাচক বানাও", en: "Make it negative" },
      note: { bn: "বাক্যে be বা সাহায্যকারী আছে? তাহলে not। নেই? তাহলে do/does/did + not + খালি ক্রিয়া।", en: "Is there a be or a helper? Then not. None? Then do, does or did + not + bare verb." },
      items: [
        { text: "Mitu ___ studying now.", bn: "মিতু এখন পড়ছে না।", options: ["is not", "does not", "not"], right: 0, why: { bn: "is আছে, তার পরে not: is not studying।", en: "Is is there, so not follows it: is not studying." } },
        { text: "Rafi ___ like spinach.", bn: "রাফি পালংশাক পছন্দ করে না।", options: ["is not", "does not", "not"], right: 1, why: { bn: "সাধারণ ক্রিয়া, বর্তমান, একজন: does not like।", en: "An ordinary verb, present, one person: does not like." } },
        { text: "They ___ the match yesterday.", bn: "তারা কাল ম্যাচটা জেতেনি।", options: ["did not win", "did not won", "not won"], right: 0, why: { bn: "অতীত, সাধারণ ক্রিয়া: did not + খালি win। did not won নয়।", en: "The past, an ordinary verb: did not + bare win. Not did not won." } },
        { text: "Nanu ___ swim.", bn: "নানু সাঁতার জানেন না।", options: ["cannot", "does not can", "not can"], right: 0, why: { bn: "can একটা সাহায্যকারী, তার পরে not: cannot, একসাথে লেখা।", en: "Can is a helper, so not follows it: cannot, written as one word." } },
        { text: "Everyone came, so ___.", bn: "সবাই এসেছিল, তাই কেউ বাদ যায়নি।", options: ["nobody was absent", "nobody was not absent", "anybody was absent"], right: 0, why: { bn: "nobody নিজেই না-বাচক, তার সাথে not নয়: nobody was absent।", en: "Nobody is already negative and takes no not: nobody was absent." } },
        { text: "I ___ anything about it.", bn: "আমি এ নিয়ে কিছুই জানি না।", options: ["don't know", "don't know nothing", "know not"], right: 0, why: { bn: "একটা বাক্যে একটাই না: don't know anything। nothing দিলে দুটো না।", en: "One negative per sentence: don't know anything. Nothing would make two." } },
      ],
    },
    "sentences-lines": {
      kind: "lines",
      title: { bn: "শোনো, বলো: বলা থেকে জিজ্ঞেস", en: "Listen, say: from telling to asking" },
      note: { bn: "প্রতিটা জোড়ায় শব্দ কোথায় নড়ল, শোনো।", en: "In each pair, listen to where the words move." },
      lines: [
        { target: "You are ready. Are you ready?", bn: "তুমি প্রস্তুত। তুমি কি প্রস্তুত?" },
        { target: "She can swim. Can she swim?", bn: "সে সাঁতার পারে। সে কি সাঁতার পারে?" },
        { target: "Rafi likes mangoes. Does Rafi like mangoes?", bn: "রাফি আম পছন্দ করে। রাফি কি আম পছন্দ করে?" },
        { target: "They won the match. Did they win the match?", bn: "তারা ম্যাচ জিতেছে। তারা কি ম্যাচ জিতেছে?" },
        { target: "Please open the window. Don't shout.", bn: "জানালাটা খোলো তো। চেঁচিও না।" },
        { target: "What a beautiful morning! How cold it is!", bn: "কী সুন্দর সকাল! কী ঠান্ডা!" },
      ],
    },
    "sentences-machine": {
      kind: "order",
      title: { bn: "প্রশ্ন বানানোর ধাপ", en: "The steps of making a question" },
      note: { bn: "Rafi plays cricket on Fridays. থেকে Where does Rafi play cricket? বানানোর ধাপগুলো ক্রমে সাজাও।", en: "Put the steps in order for turning Rafi plays cricket on Fridays into Where does Rafi play cricket?" },
      items: [
        { text: { bn: "বাক্যে be বা সাহায্যকারী আছে কি না দেখো: নেই, শুধু plays", en: "Check for be or a helper: none, only plays" }, why: { bn: "সাহায্যকারী থাকলে সেটাই সামনে যেত; না থাকলে do ধার করতে হয়।", en: "A helper would move to the front; without one, do is borrowed." } },
        { text: { bn: "কর্তা একজন, বর্তমান, তাই does ধার করো", en: "One subject, present, so borrow does" } },
        { text: { bn: "does সামনে বসাও আর মূল ক্রিয়া খালি করো: does Rafi play", en: "Put does in front and strip the main verb: does Rafi play" }, why: { bn: "টুপি does-এ, তাই play খালি।", en: "The hat is on does, so play is bare." } },
        { text: { bn: "যেটা জানতে চাও সেটা সরিয়ে wh-শব্দ বসাও: on Fridays সরিয়ে Where", en: "Replace what you want to know with a wh-word: on Fridays becomes Where" } },
        { text: { bn: "wh-শব্দ সবার আগে, শেষে প্রশ্নবোধক: Where does Rafi play cricket?", en: "Wh-word first, question mark last: Where does Rafi play cricket?" } },
      ],
    },
    "sentences-bins": {
      kind: "bins",
      title: { bn: "কোন জাতের বাক্য", en: "Which kind of sentence" },
      bins: [
        { id: "st", label: { bn: "বলা", en: "statement" } },
        { id: "qu", label: { bn: "জিজ্ঞেস", en: "question" } },
        { id: "co", label: { bn: "আদেশ", en: "command" } },
        { id: "ex", label: { bn: "চমক", en: "exclamation" } },
      ],
      items: [
        { text: { bn: "Shakib took five wickets.", en: "Shakib took five wickets." }, bin: "st", why: { bn: "কর্তা, ক্রিয়া, ফুল স্টপ। শুধু বলা।", en: "Subject, verb, full stop. Just telling." } },
        { text: { bn: "Did you see that catch?", en: "Did you see that catch?" }, bin: "qu", why: { bn: "Did আগে, শেষে ?।", en: "Did first, a question mark last." } },
        { text: { bn: "Pass the ball!", en: "Pass the ball!" }, bin: "co", why: { bn: "কর্তা নেই, ক্রিয়া দিয়ে শুরু। জোরালো আদেশে ! বসে, কিন্তু জাত আদেশ।", en: "No subject, verb first. A strong command takes !, but it is still a command." } },
        { text: { bn: "What a wonderful over!", en: "What a wonderful over!" }, bin: "ex", why: { bn: "What a + adjective + noun + !।", en: "What a + adjective + noun + !" } },
        { text: { bn: "Don't be afraid.", en: "Don't be afraid." }, bin: "co", why: { bn: "Don't দিয়ে শুরু, না-বাচক আদেশ।", en: "Starts with Don't: a negative command." } },
        { text: { bn: "How quickly he runs!", en: "How quickly he runs!" }, bin: "ex", why: { bn: "How + adverb + !।", en: "How + adverb + !" } },
        { text: { bn: "Where is my bat?", en: "Where is my bat?" }, bin: "qu", why: { bn: "wh-শব্দ দিয়ে শুরু, ? দিয়ে শেষ।", en: "A wh-word first, a question mark last." } },
        { text: { bn: "Nanu does not like loud music.", en: "Nanu does not like loud music." }, bin: "st", why: { bn: "না-বাচক, কিন্তু জাতে বলা।", en: "Negative, but a statement by kind." } },
        { text: { bn: "Would you mind closing the door?", en: "Would you mind closing the door?" }, bin: "qu", why: { bn: "চেহারায় প্রশ্ন, কাজে অনুরোধ; জাত চিহ্নিত করতে বললে চেহারা: ? আছে, interrogative।", en: "A request in the shape of a question; asked for the kind, go by the shape: it ends in ?, interrogative." } },
        { text: { bn: "Let's start the match.", en: "Let's start the match." }, bin: "co", why: { bn: "Let's দিয়ে শুরু: আদেশ, নিজেদেরকে।", en: "Starts with Let's: a command to ourselves." } },
      ],
    },
    "sentences-reveal": {
      kind: "reveal",
      title: { bn: "আগে ভাবো: কমা কার জীবন বাঁচাল?", en: "Guess first: whose life did the comma save?" },
      ask: { bn: "Let's eat, Nanu. আর Let's eat Nanu. একটা কমার পার্থক্য। কোনটা কী মানে?", en: "Let's eat, Nanu. And Let's eat Nanu. One comma apart. What does each mean?" },
      choices: [
        { bn: "দুটোই নানুকে খেতে ডাকা", en: "Both invite Nanu to eat" },
        { bn: "প্রথমটা নানুকে ডাকা, দ্বিতীয়টা নানুকে খাওয়া", en: "The first calls Nanu; the second eats Nanu" },
        { bn: "কোনো পার্থক্য নেই", en: "No difference" },
      ],
      answer: { bn: "প্রথমটা নানুকে খেতে ডাকা। দ্বিতীয়টা নানুকে খেয়ে ফেলা।", en: "The first calls Nanu to eat. The second makes Nanu the meal." },
      why: { bn: "কমাটা বলে দেয় Nanu বাক্যের কর্ম নয়, ডাকা হচ্ছে তাকে। কমা ছাড়া Nanu হয়ে যায় eat-এর কর্ম: কী খাব? নানুকে। কাউকে সম্বোধন করলে নামের আগে একটা কমা, সবসময়: Rafi, come here. Come here, Rafi. পর্ব ২৩-এ কমার আরও দশটা কাজ, কিন্তু এটাই সবচেয়ে বিখ্যাত।", en: "The comma says Nanu is not the object; she is being addressed. Without it, Nanu becomes the object of eat: eat what? Nanu. When you address someone, a comma sets the name off, always: Rafi, come here. Come here, Rafi. Part 23 has ten more jobs for the comma, but this one is the most famous." },
    },
    "sentences-structure": {
      kind: "bins",
      title: { bn: "simple, compound, নাকি complex", en: "Simple, compound or complex" },
      note: { bn: "জোড়ার শব্দটা খোঁজো, তারপর ঘরে ফেলো।", en: "Find the joining word, then sort." },
      bins: [
        { id: "si", label: { bn: "simple", en: "simple" } },
        { id: "co", label: { bn: "compound", en: "compound" } },
        { id: "cx", label: { bn: "complex", en: "complex" } },
      ],
      items: [
        { text: { bn: "Rafi bowled well.", en: "Rafi bowled well." }, bin: "si", why: { bn: "একটা ক্রিয়া, কোনো জোড়া নেই।", en: "One verb, no joining word." } },
        { text: { bn: "Rafi bowled well, but we lost.", en: "Rafi bowled well, but we lost." }, bin: "co", why: { bn: "but দুটো পুরো বাক্য জোড়ে।", en: "But joins two whole sentences." } },
        { text: { bn: "We lost although Rafi bowled well.", en: "We lost although Rafi bowled well." }, bin: "cx", why: { bn: "although একটাকে অন্যটার নিচে বসায়।", en: "Although puts one under the other." } },
        { text: { bn: "Rafi and Mitu play every evening.", en: "Rafi and Mitu play every evening." }, bin: "si", why: { bn: "দুটো কর্তা, কিন্তু একটাই ক্রিয়া: simple।", en: "Two subjects but one verb: simple." } },
        { text: { bn: "I know that he is honest.", en: "I know that he is honest." }, bin: "cx", why: { bn: "that-এর পরের অংশ একা দাঁড়ায় না।", en: "The part after that cannot stand alone." } },
        { text: { bn: "Hurry up, or you will miss the bus.", en: "Hurry up, or you will miss the bus." }, bin: "co", why: { bn: "or দুটো সমান বাক্য জোড়ে।", en: "Or joins two equal sentences." } },
        { text: { bn: "The boy who scored the century is my cousin.", en: "The boy who scored the century is my cousin." }, bin: "cx", why: { bn: "who দিয়ে একটা বাক্য অন্যটার ভিতরে।", en: "Who tucks one sentence inside another." } },
        { text: { bn: "Nanu told a story and then went to sleep.", en: "Nanu told a story and then went to sleep." }, bin: "si", why: { bn: "একটা কর্তা, দুটো ক্রিয়া, কিন্তু and-এর পরে নতুন কর্তা নেই: simple।", en: "One subject, two verbs, but no new subject after and: simple." } },
      ],
    },
    "sentences-gap": {
      kind: "gap",
      title: { bn: "ঠিক শুরুটা বসাও", en: "Put in the right opening" },
      items: [
        { text: "___ a lovely day it is!", bn: "কী সুন্দর দিন!", options: ["How", "What", "Which"], right: 1, why: { bn: "পরে a + adjective + noun (day) আছে, তাই What। How-এর পরে শুধু adjective।", en: "A + adjective + noun (day) follows, so What. How takes an adjective alone." } },
        { text: "___ kind of you!", bn: "কী দয়ালু তুমি!", options: ["What", "How", "So"], right: 1, why: { bn: "শুধু adjective, noun নেই: How kind!", en: "Only an adjective and no noun: How kind!" } },
        { text: "___ you like ice cream?", bn: "তুমি কি আইসক্রিম পছন্দ করো?", options: ["Are", "Do", "Is"], right: 1, why: { bn: "like সাধারণ ক্রিয়া, be নেই, তাই do দিয়ে প্রশ্ন: Do you like?", en: "Like is an ordinary verb with no be, so the question uses do: Do you like?" } },
        { text: "___ late for the exam.", bn: "পরীক্ষায় দেরি কোরো না।", options: ["Not be", "Don't be", "No be"], right: 1, why: { bn: "না-বাচক আদেশ: Don't + খালি ক্রিয়া। be-র সাথেও Don't be।", en: "A negative command: Don't + bare verb, and be is no exception: Don't be." } },
        { text: "___ go to the field, everyone!", bn: "চলো সবাই মাঠে যাই!", options: ["Let's", "Lets", "Let us to"], right: 0, why: { bn: "Let's = Let us, অ্যাপস্ট্রফি সহ, পরে খালি ক্রিয়া: Let's go।", en: "Let's is Let us with an apostrophe, and a bare verb follows: Let's go." } },
        { text: "___ beautiful flowers these are!", bn: "কী সুন্দর ফুল এগুলো!", options: ["What", "What a", "How"], right: 0, why: { bn: "বহুবচন noun, তাই a নেই: What beautiful flowers!", en: "A plural noun, so no a: What beautiful flowers!" } },
        { text: "___ fast Mustafiz bowls!", bn: "কী দ্রুত মুস্তাফিজ বল করে!", options: ["What", "How", "What a"], right: 1, why: { bn: "পরে adverb আর পুরো বাক্য, noun নয়: How fast he bowls!", en: "An adverb and a whole clause follow, no noun: How fast he bowls!" } },
      ],
    },
    "sentences-transform": {
      kind: "match",
      title: { bn: "এক কথা, চার জাত", en: "One idea, four kinds" },
      note: { bn: "বাঁ দিকের বাক্যটা ডান দিকের জাতের সাথে মেলাও। সবগুলো একই কথা বলছে।", en: "Match each sentence on the left with its kind on the right. They all say the same thing." },
      pairs: [
        { left: { bn: "Rafi is a brilliant bowler.", en: "Rafi is a brilliant bowler." }, right: { bn: "assertive, হ্যাঁ-বাচক", en: "assertive, affirmative" } },
        { left: { bn: "Rafi is not a bad bowler.", en: "Rafi is not a bad bowler." }, right: { bn: "assertive, না-বাচক (একই মানে)", en: "assertive, negative (same meaning)" } },
        { left: { bn: "Isn't Rafi a brilliant bowler?", en: "Isn't Rafi a brilliant bowler?" }, right: { bn: "interrogative (উত্তর হ্যাঁ)", en: "interrogative (the answer is yes)" } },
        { left: { bn: "What a brilliant bowler Rafi is!", en: "What a brilliant bowler Rafi is!" }, right: { bn: "exclamatory", en: "exclamatory" } },
        { left: { bn: "Bowl like Rafi.", en: "Bowl like Rafi." }, right: { bn: "imperative", en: "imperative" } },
      ],
    },
    "sentences-build": {
      kind: "build",
      title: { bn: "চার জাতের বাক্য সাজাও", en: "Build the four kinds" },
      note: { bn: "শব্দগুলো এলোমেলো। সাজানোর পর প্রতিটার জাত বলো, আর শেষের চিহ্নটা কেন।", en: "The words are shuffled. Once built, name each one's kind and say why it ends the way it does." },
      pattern: "statement  ·  question  ·  command  ·  exclamation",
      lines: [
        { target: "Nanu tells the best stories in the world.", bn: "নানু দুনিয়ার সেরা গল্প বলেন।" },
        { target: "Does Rafi play cricket every Friday?", bn: "রাফি কি প্রতি শুক্রবার ক্রিকেট খেলে?" },
        { target: "Please close the window before you leave.", bn: "যাওয়ার আগে জানালাটা বন্ধ করে যেও।" },
        { target: "What a beautiful catch that was!", bn: "কী সুন্দর একটা ক্যাচ ছিল সেটা!" },
        { target: "Where did you put my new bat?", bn: "আমার নতুন ব্যাটটা কোথায় রেখেছ?" },
        { target: "Rafi bowled well, but the team lost.", bn: "রাফি ভালো বল করল, কিন্তু দল হারল।" },
      ],
    },
    "sentences-spot": {
      kind: "spot",
      title: { bn: "মিতু আপুর অনুচ্ছেদ: টুকরো আর জোড়া", en: "Mitu's paragraph: fragments and run-ons" },
      note: { bn: "লাল কালি হাতে নাও। যে লাইন বাক্য নয় (ক্রিয়া নেই), বা দুটো বাক্য শুধু কমায় জোড়া, বা চিহ্ন ভুল, সেটা ছোঁও।", en: "Take the red pen. Tap every line that is not a sentence (no verb), or joins two sentences with only a comma, or ends with the wrong mark." },
      source: { bn: "অনুচ্ছেদ: ফাইনালের দিন", en: "Paragraph: the day of the final" },
      lines: [
        { text: { bn: "The final was on a hot Friday afternoon.", en: "The final was on a hot Friday afternoon." } },
        { text: { bn: "Our whole team in new blue jerseys with white caps.", en: "Our whole team in new blue jerseys with white caps." }, flag: { bn: "ক্রিয়া নেই, টুকরো: Our whole team wore new blue jerseys।", en: "No verb, a fragment: Our whole team wore new blue jerseys." } },
        { text: { bn: "Rafi opened the bowling, he took a wicket in the first over.", en: "Rafi opened the bowling, he took a wicket in the first over." }, flag: { bn: "দুটো বাক্য শুধু কমায়: and বসাও, বা ফুল স্টপ।", en: "Two sentences joined by a comma alone: add and, or a full stop." } },
        { text: { bn: "What a start it was!", en: "What a start it was!" } },
        { text: { bn: "Did the other team give up.", en: "Did the other team give up." }, flag: { bn: "প্রশ্ন, শেষে ? লাগবে।", en: "A question needs a question mark." } },
        { text: { bn: "No, they fought hard until the last ball.", en: "No, they fought hard until the last ball." } },
        { text: { bn: "In the end we won, and everyone ran onto the field.", en: "In the end we won, and everyone ran onto the field." } },
      ],
    },
    "sentences-exam": {
      kind: "quiz",
      title: { bn: "পরীক্ষার হল", en: "The exam room" },
      note: { bn: "প্রতিটা প্রশ্ন একটা সত্যিকারের প্রশ্নপত্রের ধরনে।", en: "Each question is shaped like a real exam paper's." },
      questions: [
        {
          ask: { bn: "Make it exclamatory: It is a very cold morning.", en: "Make it exclamatory: It is a very cold morning." },
          options: [
            { text: { bn: "How a cold morning it is!", en: "How a cold morning it is!" }, why: { bn: "না। noun (morning) আছে, তাই What a।", en: "No. There is a noun (morning), so What a." } },
            { text: { bn: "What a cold morning it is!", en: "What a cold morning it is!" }, right: true, why: { bn: "হ্যাঁ। very সরাও, What a বসাও, বাকি ক্রম বলার মতো: it is।", en: "Yes. Drop very, add What a, and keep the rest in statement order: it is." } },
            { text: { bn: "What a cold morning is it!", en: "What a cold morning is it!" }, why: { bn: "না। চমকে ক্রম উল্টায় না: it is, is it নয়।", en: "No. An exclamation keeps statement order: it is, not is it." } },
          ],
        },
        {
          ask: { bn: "Identify by structure: Rafi and Mitu sang and danced at the function.", en: "Identify by structure: Rafi and Mitu sang and danced at the function." },
          options: [
            { text: { bn: "compound", en: "compound" }, why: { bn: "না। and আছে, কিন্তু দুটো পুরো বাক্য জোড়েনি; দ্বিতীয় and-এর পরে কর্তা নেই।", en: "No. There is an and, but it joins no second full sentence; nothing follows the second and as a subject." } },
            { text: { bn: "simple", en: "simple" }, right: true, why: { bn: "হ্যাঁ। একটা জোড়া কর্তা, একটা জোড়া ক্রিয়া, কিন্তু একটাই বাক্য: simple।", en: "Yes. A double subject and a double verb, but one clause: simple." } },
            { text: { bn: "complex", en: "complex" }, why: { bn: "না। because, when, that-এর মতো কোনো শব্দ নেই।", en: "No. There is no because, when or that." } },
          ],
        },
        {
          ask: { bn: "Make it negative without changing the meaning: Everyone loves Nanu's pitha.", en: "Make it negative without changing the meaning: Everyone loves Nanu's pitha." },
          options: [
            { text: { bn: "Everyone does not love Nanu's pitha.", en: "Everyone does not love Nanu's pitha." }, why: { bn: "না। মানে বদলে গেল: এখন কেউ ভালোবাসে না।", en: "No. The meaning changed: now nobody loves it." } },
            { text: { bn: "There is no one who does not love Nanu's pitha.", en: "There is no one who does not love Nanu's pitha." }, right: true, why: { bn: "হ্যাঁ। দুটো না মিলে হ্যাঁ: কেউ নেই যে ভালোবাসে না, মানে সবাই ভালোবাসে।", en: "Yes. Two negatives make the positive: nobody fails to love it, so everybody loves it." } },
            { text: { bn: "No one loves Nanu's pitha.", en: "No one loves Nanu's pitha." }, why: { bn: "না। উল্টো মানে।", en: "No. The opposite meaning." } },
          ],
        },
        {
          ask: { bn: "Which sentence is punctuated correctly?", en: "Which sentence is punctuated correctly?" },
          options: [
            { text: { bn: "on friday, rafi and i went to dhaka.", en: "on friday, rafi and i went to dhaka." }, why: { bn: "না। বাক্যের শুরু, দিন, নাম, I, শহর: পাঁচটা বড় হাত লাগবে।", en: "No. The sentence start, the day, the name, I and the city all need capitals." } },
            { text: { bn: "On Friday, Rafi and I went to Dhaka.", en: "On Friday, Rafi and I went to Dhaka." }, right: true, why: { bn: "হ্যাঁ। শুরুতে বড় হাত, Friday, Rafi, I, Dhaka।", en: "Yes. A capital at the start, then Friday, Rafi, I, Dhaka." } },
            { text: { bn: "On Friday, Rafi and i went to Dhaka.", en: "On Friday, Rafi and i went to Dhaka." }, why: { bn: "না। I সবসময় বড় হাত, বাক্যের মাঝেও।", en: "No. I is always capital, even mid-sentence." } },
          ],
        },
      ],
    },
    "sentences-drill": {
      kind: "drill",
      title: { bn: "মুখে বলো", en: "Say it out loud" },
      steps: [
        { text: { bn: "একটা বাক্য নাও (Rafi eats rice) আর চার জাতে বলো: বলা, জিজ্ঞেস, আদেশ, চমক।", en: "Take one sentence (Rafi eats rice) and say it in all four kinds: statement, question, command, exclamation." } },
        { text: { bn: "ছোট ভাইবোন বা বন্ধুকে পাঁচটা আদেশ ইংরেজিতে, please সহ: Please pass the salt.", en: "Five commands in English to a sibling or friend, with please: Please pass the salt." } },
        { text: { bn: "জানালার বাইরে যা দেখছ, তিনটা What a…! আর দুটো How…!", en: "Three What a…! and two How…! about what you see out of the window." } },
        { text: { bn: "একটা আদেশ পাঁচ সুরে, হুকুম থেকে অনুরোধ: Sit down. Please sit down. Could you sit down? Would you mind sitting down?", en: "One command in five tones, from order to request: Sit down. Please sit down. Could you sit down? Would you mind sitting down?" } },
        { text: { bn: "নিজের দিনের তিনটা বাক্য, একটা simple, একটা and দিয়ে compound, একটা because দিয়ে complex।", en: "Three sentences about your day: one simple, one compound with and, one complex with because." } },
        { text: { bn: "পাঁচটা হ্যাঁ-বাচক বাক্য না-বাচক করো, জোরে: I like…, I don't like…; I went…, I didn't go…", en: "Turn five affirmative sentences negative, aloud: I like…, I don't like…; I went…, I didn't go…" } },
      ],
    },
  },
};
