import type { MethodLesson } from "../research-methods";

export const LESSON: MethodLesson = {
  slug: "search-string-for-a-systematic-review",
  minutes: 5,
  en: `<div class="at-a-glance"><p class="at-a-glance-label">At a glance</p><ul>
<li>A search string is concepts ANDed together, and each concept is a list of synonyms ORed together.</li>
<li>Truncation, a wildcard on the stem, catches farmer, farmers and farming with one term.</li>
<li>A phrase in quotation marks catches "index insurance" as a term and not index and insurance sitting apart.</li>
<li>No two databases use quite the same syntax, so one string becomes several, translated rather than pasted.</li>
<li>A search log records the database, the exact string, the date and the number of hits, because the same search run next month can return a different count.</li>
</ul></div>

<h2>Concepts ANDed, synonyms ORed</h2>
<p>A systematic review's question breaks into two or three concepts, not a paragraph. "Does index insurance increase savings among smallholder farmers" is two concepts and an outcome: the intervention, the population, and what is being measured. Each concept gets its own list of synonyms, because researchers do not agree on a name for anything: one paper's "index insurance" is another's "weather index insurance" or "parametric insurance", and a string that names only one of the three quietly loses the other two.</p>
<p>Inside a concept, the synonyms are joined with OR: any one of them is enough to make a record a candidate. Between concepts, the joins are AND: a record has to mention the intervention and the population, not merely one of the two. Get the two the wrong way round, AND inside a concept and OR between concepts, and the count explodes: every paper about smallholder farmers, plus every paper about insurance of any kind, whether or not the two ever meet inside the same paper.</p>

<h2>Truncation and phrase searching</h2>
<p>Two devices do most of the work inside a concept's synonym list.</p>
<p><strong>Truncation</strong> cuts a word to its stem and adds a wildcard, usually an asterisk, so one term catches every ending: <code>farm*</code> finds farm, farmer, farmers and farming in a single search rather than four. It is a shortcut, and a blunt one: <code>farm*</code> also finds farmed and farmyard, so a shorter stem is not automatically a better one. Test what a stem actually returns before trusting it inside the full string.</p>
<p><strong>A phrase in quotation marks</strong> does the opposite: it pins two or more words together so the database looks for them in that order, next to each other, rather than anywhere at all in the record. <code>index insurance</code> without quotes finds every record that mentions index somewhere and insurance somewhere else, which in a large database is most of agricultural economics. <code>"index insurance"</code> with the quotes finds the term.</p>

<h2>One string per database</h2>
<p>The idea, concepts ANDed and synonyms ORed, is the same everywhere. The syntax that says it is not. A string written for one database is not pasted into the next; it is translated, term list and all, into that database's own rules for AND, OR, truncation, phrase and which fields it searches by default.</p>
<div class="table-scroll"><table>
<thead><tr><th>Database</th><th>Field search</th><th>Truncation</th><th>Phrase</th><th>Worth knowing</th></tr></thead>
<tbody>
<tr><td>OpenAlex</td><td>separate title and abstract filters</td><td>not reliable; write out endings by hand</td><td>quotation marks</td><td>free, and the concept filter can stand in for a whole synonym list on its own</td></tr>
<tr><td>Scopus</td><td><code>TITLE-ABS-KEY(...)</code></td><td>asterisk</td><td>quotation marks</td><td>a proximity operator, <code>W/n</code>, finds two words within n words of each other</td></tr>
<tr><td>Google Scholar</td><td>none; searches everywhere at once</td><td>none</td><td>quotation marks</td><td>a query is capped at a few hundred characters, so a long string is silently cut off</td></tr>
</tbody></table></div>
<div class="side-note"><p class="side-note-label">Google Scholar is a supplement, not a count</p><p>It ranks by a mixture of relevance and citation count that changes without notice, it will not take field tags or a long Boolean string, and it cannot export a screening-ready list past its first few hundred results. Use it to catch grey literature and papers the indexed databases missed, and never report its result count as one of the search's numbers.</p></div>

<h2>The search log</h2>
<p>A protocol without a log is a promise nobody can check. The log is a table, kept from the first search onward rather than reconstructed at the end from memory, and it needs four things for every database searched: which database, the exact string run, the date it was run, and how many records it returned.</p>
<p class="note">Write the log as you search, not afterwards. A database's index changes week to week, and a count reconstructed from memory a month later is a number nobody, including you, can check.</p>

<h2>Worked example: index insurance and smallholder farmers</h2>
<div class="ex"><b>Worked example.</b> The question: does index insurance affect the take-up of other financial products among smallholder farmers. Three concepts, each with its own synonym list.</div>
<div class="table-scroll"><table>
<thead><tr><th>Concept</th><th>Synonyms, ORed</th></tr></thead>
<tbody>
<tr><td>Intervention</td><td>"index insurance" OR "index-based insurance" OR "weather index insurance" OR "parametric insurance"</td></tr>
<tr><td>Population</td><td>smallhold* OR "small-scale farm*" OR "subsistence farm*"</td></tr>
<tr><td>Outcome</td><td>adopt* OR uptake OR "take-up" OR demand OR purchas*</td></tr>
</tbody></table></div>
<p>The three concepts ANDed together, in Scopus syntax:</p>
<p><code>TITLE-ABS-KEY(("index insurance" OR "index-based insurance" OR "weather index insurance" OR "parametric insurance") AND (smallhold* OR "small-scale farm*" OR "subsistence farm*") AND (adopt* OR uptake OR "take-up" OR demand OR purchas*))</code></p>
<p>The same three concepts in OpenAlex, where truncation is not reliable, so the outcome list is spelled out rather than stemmed: <code>adopt OR adoption OR adopting OR adopted OR uptake OR "take-up" OR demand OR purchase OR purchasing</code>, searched against title and abstract.</p>
<div class="table-scroll"><table>
<thead><tr><th>Database</th><th>String</th><th>Date</th><th>Hits</th></tr></thead>
<tbody>
<tr><td>Scopus</td><td>as above</td><td>3 September 2026</td><td>212</td></tr>
<tr><td>OpenAlex</td><td>spelled-out variant, title and abstract</td><td>3 September 2026</td><td>489</td></tr>
<tr><td>Google Scholar</td><td>same three concepts, no field tags, first 200 results screened by hand</td><td>3 September 2026</td><td>about 6,340 (first 200 used)</td></tr>
</tbody></table></div>
<p>Three databases, three counts, none of them the true size of the literature: some of it is the same paper indexed three times, and the log's job is only to say exactly what was run and when, so that whoever checks the review later can run it again and expect to land close to the same place.</p>

<h2>Where it goes wrong</h2>
<ul>
<li>One synonym per concept, so a paper that calls it "weather index insurance" never appears at all.</li>
<li>OR between concepts instead of AND, which returns everything about farmers and everything about insurance separately, in the tens of thousands.</li>
<li>A stem so short it pulls in unrelated words: <code>farm*</code> alone, with no population qualifier, also finds pharmacology.</li>
<li>Pasting one database's string into another database's search box unchanged, where the field tags and the truncation symbol mean nothing or mean something else.</li>
<li>Quoting Google Scholar's result count as though it were comparable to a database with a controlled index.</li>
</ul>

<ul class="checklist">
<li>Every concept the question needs has its own synonym list, ORed.</li>
<li>Concepts are joined with AND, not OR.</li>
<li>A stem has been tested before being trusted, not assumed.</li>
<li>A phrase that must stay together is in quotation marks.</li>
<li>The string has been translated into each database's own syntax, not copied across.</li>
<li>The log names the database, the exact string, the date and the hit count, for every database searched.</li>
</ul>

<p>The find room runs one search across several indexes at once and keeps the log automatically; the Boolean builder in the review room turns a concept table like the one above into a string in each database's own syntax without your having to remember which one takes an asterisk and which one does not.</p>`,
  bn: `<div class="at-a-glance"><p class="at-a-glance-label">এক নজরে</p><ul>
<li>খোঁজার শব্দমালা মানে ধারণাগুলো AND দিয়ে জোড়া, আর প্রতিটি ধারণা তার প্রতিশব্দের তালিকা, OR দিয়ে জোড়া।</li>
<li>ট্রাংকেশন, মানে মূল শব্দের ওপর একটা ওয়াইল্ডকার্ড, এক শব্দেই farmer, farmers আর farming ধরে ফেলে।</li>
<li>উদ্ধৃতি চিহ্নে বাঁধা একটা phrase "index insurance"-কে একটা শব্দবন্ধ হিসেবে ধরে, index আর insurance আলাদা আলাদা ধরে না।</li>
<li>দুটো ডেটাবেসের নিয়ম কখনও পুরো এক রকম হয় না, তাই একটা শব্দমালা কয়েকটায় ভাগ হয়, কপি-পেস্ট নয়, অনুবাদ হয়ে।</li>
<li>খোঁজার লগে থাকে কোন ডেটাবেস, ঠিক কোন শব্দমালা, কবে চালানো হয়েছে, আর কতগুলো ফল এসেছে, কারণ একমাস পরে একই খোঁজ চালালে সংখ্যাটা বদলে যেতে পারে।</li>
</ul></div>

<h2>ধারণা AND, প্রতিশব্দ OR</h2>
<p>সিস্টেম্যাটিক রিভিউয়ের প্রশ্ন ভেঙে যায় দুই বা তিনটা ধারণায়, একটা অনুচ্ছেদে নয়। "ইনডেক্স ইনস্যুরেন্স কি ক্ষুদ্র চাষিদের সঞ্চয় বাড়ায়" এটা দুটো ধারণা আর একটা ফলাফল: হস্তক্ষেপ, জনগোষ্ঠী, আর কী মাপা হচ্ছে। প্রতিটি ধারণার নিজের একটা প্রতিশব্দের তালিকা থাকে, কারণ গবেষকেরা কোনো কিছুর নামে একমত হন না: একজনের "index insurance" আরেকজনের কাছে "weather index insurance" বা "parametric insurance", আর শব্দমালায় শুধু একটা নাম থাকলে বাকি দুটো চুপচাপ হারিয়ে যায়।</p>
<p>একটা ধারণার ভেতরে প্রতিশব্দগুলো OR দিয়ে জোড়া থাকে: যেকোনো একটা থাকলেই রেকর্ডটা প্রার্থী হয়। দুটো ধারণার মধ্যে জোড়া হয় AND দিয়ে: একটা রেকর্ডে হস্তক্ষেপ আর জনগোষ্ঠী দুটোরই কথা থাকতে হবে, শুধু একটা নয়। উল্টো করলে, মানে ধারণার ভেতরে AND আর ধারণার মধ্যে OR করলে, সংখ্যাটা ফেটে বেরিয়ে যায়: ক্ষুদ্র চাষি নিয়ে প্রতিটা লেখা, আর যেকোনো ধরনের ইনস্যুরেন্স নিয়ে প্রতিটা লেখা, দুটো একই লেখায় থাকুক বা না থাকুক।</p>

<h2>ট্রাংকেশন আর phrase খোঁজা</h2>
<p>একটা ধারণার প্রতিশব্দ তালিকার ভেতরে বেশিরভাগ কাজ করে দুটো কৌশল।</p>
<p><strong>ট্রাংকেশন</strong> শব্দটাকে মূলে ছেঁটে একটা ওয়াইল্ডকার্ড জুড়ে দেয়, সাধারণত একটা তারকাচিহ্ন, তাই এক শব্দেই সব শেষাংশ ধরা পড়ে: <code>farm*</code> একবারেই farm, farmer, farmers আর farming পায়, চারবার আলাদা লেখার বদলে। এটা একটা সংক্ষিপ্ত পথ, আর একটু ভোঁতাও: <code>farm*</code> farmed আর farmyard-ও ধরে নেয়, তাই ছোট মূল মানেই ভালো মূল নয়। পুরো শব্দমালায় বসানোর আগে দেখে নিন মূলটা আসলে কী কী ফিরিয়ে আনছে।</p>
<p><strong>উদ্ধৃতি চিহ্নে phrase</strong> ঠিক উল্টো কাজ করে: দুই বা তার বেশি শব্দকে পাশাপাশি, একই ক্রমে আটকে রাখে, রেকর্ডের যেখানে খুশি সেখানে থাকলে চলবে না। <code>index insurance</code> উদ্ধৃতি ছাড়া লিখলে এমন প্রতিটা রেকর্ড ধরে যাতে index কোথাও আছে আর insurance কোথাও আছে, বড় ডেটাবেসে যা কৃষি অর্থনীতির প্রায় সবটাই। <code>"index insurance"</code> উদ্ধৃতিসহ লিখলে শব্দবন্ধটাই ধরে।</p>

<h2>প্রতিটা ডেটাবেসের নিজের শব্দমালা</h2>
<p>ধারণাটা, মানে AND-এ ধারণা আর OR-এ প্রতিশব্দ, সব জায়গায় একই। কিন্তু সেটা লেখার নিয়ম একই নয়। এক ডেটাবেসের জন্য লেখা শব্দমালা পরের ডেটাবেসে পেস্ট করা হয় না; পুরো তালিকাসহ সেই ডেটাবেসের নিজের নিয়মে অনুবাদ করা হয়, AND, OR, ট্রাংকেশন, phrase আর কোন ক্ষেত্রে খোঁজে, সবটা ধরে।</p>
<div class="table-scroll"><table>
<thead><tr><th>ডেটাবেস</th><th>ক্ষেত্র ধরে খোঁজ</th><th>ট্রাংকেশন</th><th>Phrase</th><th>জেনে রাখার মতো</th></tr></thead>
<tbody>
<tr><td>OpenAlex</td><td>শিরোনাম আর সারাংশের জন্য আলাদা ফিল্টার</td><td>ভরসাযোগ্য নয়; শেষাংশ হাতে লিখতে হয়</td><td>উদ্ধৃতি চিহ্ন</td><td>বিনামূল্যে, আর concept ফিল্টার একাই পুরো প্রতিশব্দ তালিকার কাজ করতে পারে</td></tr>
<tr><td>Scopus</td><td><code>TITLE-ABS-KEY(...)</code></td><td>তারকাচিহ্ন</td><td>উদ্ধৃতি চিহ্ন</td><td>একটা proximity অপারেটর, <code>W/n</code>, দুটো শব্দ পরস্পর থেকে n শব্দের মধ্যে থাকলে ধরে</td></tr>
<tr><td>Google Scholar</td><td>নেই; সবখানে একসঙ্গে খোঁজে</td><td>নেই</td><td>উদ্ধৃতি চিহ্ন</td><td>একটা খোঁজে অক্ষরের সীমা আছে, লম্বা শব্দমালা চুপচাপ কেটে যায়</td></tr>
</tbody></table></div>
<div class="side-note"><p class="side-note-label">Google Scholar একটা সহায়ক, গোনার জায়গা নয়</p><p>এটা প্রাসঙ্গিকতা আর উদ্ধৃতির সংখ্যার একটা মিশ্রণ দিয়ে ক্রম সাজায়, যা না জানিয়েই বদলায়। এটা ক্ষেত্র ধরে খোঁজ নেয় না, লম্বা Boolean শব্দমালাও নেয় না, আর কয়েকশো ফলের পরে বাছাইয়ের জন্য তালিকা এক্সপোর্টও করতে পারে না। ধূসর সাহিত্য আর অন্য ডেটাবেস যা মিস করেছে তা ধরতে এটা ব্যবহার করুন, এর ফলের সংখ্যাকে খোঁজের নিজস্ব একটা সংখ্যা হিসেবে কখনও লিখবেন না।</p></div>

<h2>খোঁজার লগ</h2>
<p>লগ ছাড়া প্রোটোকল এমন একটা প্রতিশ্রুতি যা কেউ যাচাই করতে পারে না। লগ একটা ছক, প্রথম খোঁজ থেকেই রাখা, শেষে স্মৃতি থেকে বানানো নয়, আর প্রতিটা ডেটাবেসের জন্য চারটা জিনিস দরকার: কোন ডেটাবেস, ঠিক কোন শব্দমালা চালানো হয়েছে, কবে চালানো হয়েছে, আর কতগুলো রেকর্ড ফিরেছে।</p>
<p class="note">লগ খোঁজার সময়েই লিখুন, পরে নয়। ডেটাবেসের সূচি সপ্তাহে সপ্তাহে বদলায়, আর এক মাস পরে স্মৃতি থেকে বানানো সংখ্যা এমন একটা সংখ্যা যা কেউ, আপনি নিজেও, আর যাচাই করতে পারবেন না।</p>

<h2>করে দেখানো: ইনডেক্স ইনস্যুরেন্স আর ক্ষুদ্র চাষি</h2>
<div class="ex"><b>করে দেখানো।</b> প্রশ্ন: ইনডেক্স ইনস্যুরেন্স কি ক্ষুদ্র চাষিদের অন্য আর্থিক পণ্য নেওয়ার হারে প্রভাব ফেলে। তিনটা ধারণা, প্রতিটার নিজের প্রতিশব্দ তালিকা।</div>
<div class="table-scroll"><table>
<thead><tr><th>ধারণা</th><th>প্রতিশব্দ, OR দিয়ে</th></tr></thead>
<tbody>
<tr><td>হস্তক্ষেপ</td><td>"index insurance" OR "index-based insurance" OR "weather index insurance" OR "parametric insurance"</td></tr>
<tr><td>জনগোষ্ঠী</td><td>smallhold* OR "small-scale farm*" OR "subsistence farm*"</td></tr>
<tr><td>ফলাফল</td><td>adopt* OR uptake OR "take-up" OR demand OR purchas*</td></tr>
</tbody></table></div>
<p>তিনটা ধারণা AND দিয়ে জোড়া, Scopus-এর নিয়মে:</p>
<p><code>TITLE-ABS-KEY(("index insurance" OR "index-based insurance" OR "weather index insurance" OR "parametric insurance") AND (smallhold* OR "small-scale farm*" OR "subsistence farm*") AND (adopt* OR uptake OR "take-up" OR demand OR purchas*))</code></p>
<p>একই তিনটা ধারণা OpenAlex-এ, যেখানে ট্রাংকেশন ভরসাযোগ্য নয়, তাই ফলাফলের তালিকা মূল না ছেঁটে পুরো লেখা হয়েছে: <code>adopt OR adoption OR adopting OR adopted OR uptake OR "take-up" OR demand OR purchase OR purchasing</code>, শিরোনাম আর সারাংশ ধরে খোঁজা।</p>
<div class="table-scroll"><table>
<thead><tr><th>ডেটাবেস</th><th>শব্দমালা</th><th>তারিখ</th><th>ফল</th></tr></thead>
<tbody>
<tr><td>Scopus</td><td>ওপরে যেমন</td><td>৩ সেপ্টেম্বর ২০২৬</td><td>২১২</td></tr>
<tr><td>OpenAlex</td><td>পুরো লেখা রূপ, শিরোনাম ও সারাংশ</td><td>৩ সেপ্টেম্বর ২০২৬</td><td>৪৮৯</td></tr>
<tr><td>Google Scholar</td><td>একই তিনটা ধারণা, ক্ষেত্র ছাড়া, প্রথম ২০০টা ফল হাতে দেখা</td><td>৩ সেপ্টেম্বর ২০২৬</td><td>প্রায় ৬,৩৪০ (প্রথম ২০০ কাজে লাগানো)</td></tr>
</tbody></table></div>
<p>তিনটা ডেটাবেস, তিনটা সংখ্যা, কোনোটাই সাহিত্যের আসল আকার নয়: এর কিছুটা একই লেখা তিনবার সূচিভুক্ত হওয়া। লগের কাজ শুধু ঠিক কী চালানো হয়েছিল আর কবে, তা বলা, যাতে পরে যে কেউ রিভিউটা যাচাই করতে চাইলে আবার চালিয়ে প্রায় একই জায়গায় পৌঁছাতে পারে।</p>

<h2>কোথায় ভুল হয়</h2>
<ul>
<li>প্রতিটা ধারণার একটাই প্রতিশব্দ, তাই যে লেখাটা "weather index insurance" বলে, সেটা কখনও আসেই না।</li>
<li>ধারণার মধ্যে AND-এর বদলে OR, তাতে চাষি নিয়ে সব আর ইনস্যুরেন্স নিয়ে সব আলাদা আলাদা করে হাজার হাজার লেখা ফিরে আসে।</li>
<li>এত ছোট মূল যে অসম্পর্কিত শব্দও টেনে আনে: জনগোষ্ঠীর কোনো শর্ত ছাড়া শুধু <code>farm*</code>, তাতে ফার্মাকোলজিও চলে আসে।</li>
<li>এক ডেটাবেসের শব্দমালা অন্য ডেটাবেসের বাক্সে অবিকল বসিয়ে দেওয়া, যেখানে ক্ষেত্র চিহ্ন আর ট্রাংকেশন চিহ্নের কোনো মানে নেই, বা অন্য কিছু বোঝায়।</li>
<li>Google Scholar-এর ফলের সংখ্যাকে এমনভাবে লেখা যেন সেটা নিয়ন্ত্রিত সূচিসহ ডেটাবেসের সংখ্যার সমান।</li>
</ul>

<ul class="checklist">
<li>প্রশ্নের দরকার প্রতিটা ধারণার নিজের প্রতিশব্দ তালিকা আছে, OR দিয়ে জোড়া।</li>
<li>ধারণাগুলো AND দিয়ে জোড়া, OR দিয়ে নয়।</li>
<li>মূলটা ভরসা করার আগে পরীক্ষা করা হয়েছে, ধরে নেওয়া হয়নি।</li>
<li>একসঙ্গে থাকা দরকার এমন phrase উদ্ধৃতি চিহ্নে আছে।</li>
<li>শব্দমালা প্রতিটা ডেটাবেসের নিজের নিয়মে অনুবাদ করা হয়েছে, কপি করা হয়নি।</li>
<li>যে ডেটাবেসেই খোঁজা হোক, লগে ডেটাবেসের নাম, ঠিক শব্দমালা, তারিখ আর ফলের সংখ্যা লেখা আছে।</li>
</ul>

<p>খোঁজ ঘর একসঙ্গে কয়েকটা সূচিতে এক খোঁজ চালায় আর লগ নিজেই রাখে; রিভিউ ঘরের Boolean builder ওপরের মতো একটা ধারণার ছককে প্রতিটা ডেটাবেসের নিজের নিয়মে শব্দমালা বানিয়ে দেয়, কোনটায় তারকাচিহ্ন লাগে আর কোনটায় লাগে না তা মনে রাখা ছাড়াই।</p>`,
};
