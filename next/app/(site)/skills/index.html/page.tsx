/* ============================================================
   /skills/index.html

   Ported out of `aab/skills/index.html` with TRANSITION.md Stage
   11.5, words unchanged. The ladders and the progress rings are
   `/skills/skills.js`'s, still, and still read from
   localStorage: what a reader has finished is theirs and is not
   a fact the server has.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";

export const metadata: Metadata = pageMeta({
  path: "/skills/index.html",
  title: "দক্ষতা · Skills · Reiad's Library",
  description: "টাকা ছাড়া বাকি যা কিছু এখানে শেখানো হয়: জার্মান, কুরআন, ইংরেজি, রান্না, "
    + "ভ্রমণ আর রিভিউ, সবটাই বাংলায়।",
  ogTitle: "দক্ষতা · Skills",
  ogDescription: "জার্মান, কুরআন, ইংরেজি, রান্না, ভ্রমণ আর রিভিউ, সবটাই বাংলায়।",
  card: "skills",
  locale: "bn_BD",
});

export default function SkillsPage() {
  return (

      <main id="main">
        <div className="wrap">
          <div className="hero">
            <span className="eyebrow mono">দক্ষতা · Skills
            </span>
            <h1 className="bn-h">টাকা ছাড়া বাকি যা কিছু।
            </h1>
            <p className="lede">এই সাইটের বেশিরভাগটা টাকা নিয়ে। এই পাতাটা বাকিটা নিয়ে,
        যে জিনিসগুলো শিখলে জীবনটা একটু সহজ হয়, আর যেগুলোর ভালো ব্যাখ্যা বাংলায়
        পাওয়া যায় না। একই নিয়ম: কোনো লগইন নেই, কোনো দাম নেই, আপনার অগ্রগতি
        আপনার ব্রাউজারেই থাকে।
            </p>
            {/* Where they left off in any school that has one. Built by
             skills.js; absent for a first-time visitor, who should
             see a clean start rather than an empty box. */}
            <div id="resume" hidden />
          </div>
          {/* The same pledge as the Learn hub, worded for this half.
           Both hubs carry it because both are entered directly,
           a reader who arrives at /skills/ from a search result
           never passes the other one. */}
          <p className="pledge" lang="bn">
            <b className="bn-h">শিক্ষা বিনামূল্যে হওয়া উচিত।
            </b>
            <span>এখানকার প্রতিটা স্কুল ফ্রি থাকবে, চিরকাল। যেগুলো এখনো লেখা
          হয়নি, সেগুলোও ফ্রিই আসবে।
            </span>
            <span className="pledge-en" lang="en">Education should be free
            </span>
          </p>
          <section id="all">
            <span className="section-label mono">যা যা আছে · Everything here
            </span>
            <p className="measure section-intro">চারটে খোলা আছে, বাকিগুলো হচ্ছে। যেটা
        এখনো আসেনি সেটাও নিচে আছে, কারণ কী আসছে সেটা জানা থাকলে অপেক্ষা করা যায়।
            </p>
            {/* Rendered from the SKILLS list in /content.js by skills.js.
             The list below is the no-JavaScript fallback and the thing
             a search engine reads; keep the two in step. */}
            <div className="skill-grid" id="skill-grid">
              <ul className="skill-fallback">
                <li>
                  <a href="/deutsch/index.html">
                    <b>জার্মান · Deutsch
                    </b>
                  </a>
                  <span data-count="stufen">৪
                  </span>টা স্তরে জার্মান, বাংলা দিয়ে বোঝানো, আর রোজ এক পাতার অনুশীলন খাতা।
                </li>
                <li>
                  <a href="/quran/index.html">
                    <b>কুরআনের আরবি · Qur'anic Arabic
                    </b>
                  </a>
                  তিন ধাপে ষাট দিন: শব্দ চেনা, বাক্য বোঝা, তারপর গোটা সূরা খুলে পড়া।
                </li>
                <li>
                  <a href="/english/index.html">
                    <b>মন থেকে ইংরেজি · English From The Heart
                    </b>
                  </a>
                  দুই টার্মে 
                  <span data-count="englishParts">৩০
                  </span>টি পর্ব: শব্দের ক্রম থেকে দুই মিনিট টানা বলা পর্যন্ত, সাথে ৩০ দিনের খাতা।
                </li>
                <li>
                  <a href="/cooking/index.html">
                    <b>রান্না · Cooking
                    </b>
                  </a>
                  মাপ, তাপ আর সময়: রেসিপি মুখস্থ না করে রান্নাটা বোঝা। ধাপে ধাপে কোর্স নয়,
              একেকটা উপকরণ নিয়ে পুরো একটা লেখা।
                </li>
                <li>
                  <b>ভ্রমণ · Travel
                  </b>: ভিসা, টিকিট, বাজেট আর ব্যাগ। আসছে।
                </li>
                <li>
                  <b>রিভিউ · Reviews
                  </b>: বই, কোর্স, অ্যাপ আর যন্ত্রপাতির সৎ মতামত। আসছে।
                </li>
              </ul>
            </div>
          </section>
          <section>
            <span className="section-label mono">কেন এভাবে
            </span>
            <div className="principles">
              <div className="principle">
                <h3 className="bn-h">ব্যাখ্যা বাংলায়, অনুশীলন আসল জিনিসে
                </h3>
                <p>বোঝার সময় শক্তি খরচ হওয়া উচিত বিষয়টা বুঝতে, ভাষা বুঝতে নয়। তাই
               ব্যাখ্যাটা বাংলায়। কিন্তু যা মুখে তুলবেন বা হাতে করবেন, সেটা আসল
               জিনিসেই: জার্মান বাক্য জার্মানে, রান্নার মাপ চামচে।
                </p>
              </div>
              <div className="principle">
                <h3 className="bn-h">ছাঁচ, তালিকা নয়
                </h3>
                <p>একশোটা শব্দ মুখস্থ করলে একশোটা শব্দই থাকে। একটা কাঠামো শিখলে তাতে
               নিজের হাজারটা বাক্য ঢালা যায়। প্রতিটা অংশ সেভাবেই সাজানো:
               মুখস্থ করার মতো কম, বানানোর মতো বেশি।
                </p>
              </div>
              <div className="principle">
                <h3 className="bn-h">যা লেখা হয়নি, সেটা বলা আছে
                </h3>
                <p>উপরের তালিকায় যেগুলোতে "আসছে" লেখা, সেগুলো এখনো লেখা হয়নি, এবং
               সেটা লুকানো হয়নি। খালি পাতায় ঢুকে সময় নষ্ট করার চেয়ে আগে থেকে
               জানা ভালো।
                </p>
              </div>
            </div>
          </section>
          <div className="band">
            <span className="mono">শেখার লাইব্রেরি
            </span>
            <h2 className="bn-h">টাকার অংশটা আলাদা, আর অনেক বড়
            </h2>
            <p>বিও অ্যাকাউন্ট খোলা থেকে গবেষণা পর্যন্ত 
              <span data-count="stages">৮
              </span>টা ধাপ,
           
              <span data-count="lessons">৬০
              </span>টা লেখা, সবটাই সহজ বাংলায়। সঙ্গে
           
              <span data-count="calculators">৫
              </span>টা ক্যালকুলেটর।
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid" href="/learn/index.html">শেখার লাইব্রেরি →
              </a>
              <a className="btn btn-ghost" href="/tools/index.html">ক্যালকুলেটর
              </a>
            </div>
          </div>
        </div>
      </main>
  );
}
