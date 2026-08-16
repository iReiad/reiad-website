/* ============================================================
   /

   The home page, ported out of `aab/index.html` with
   TRANSITION.md Stage 11.5, words unchanged. The last
   hand-written page on this site.

   ---- what still runs in the browser, and why ----

   All of it. `/home.js` draws the rotation, the resume card, the
   four schools' progress and the news, and every one of those is
   a fact about the person reading rather than about the site:
   what they have finished is in their own browser, and the two
   lists it merges come from `pieces.js`, which asks the database
   after the page has painted. A home page rendered on the server
   with somebody's progress in it would be a page this site cached
   wrong.

   The headline swap is inline and adjacent to the heading it
   swaps, which is its own comment's argument and is kept exactly:
   it runs the moment that heading is parsed, it cannot be a
   version behind the markup, and with no script at all the
   heading already reads correctly for somebody who has just
   arrived.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../lib/pageMeta";

/* Swap the headline before the browser has painted it. Inline and
   adjacent to the heading on purpose: it runs the moment that
   heading is parsed, it ships inside the document so it can never
   be a version behind it, and with no script at all the heading in
   the markup is already the right one for someone who has just
   arrived. `data-hl` is set by the boot script in this page's
   layout, one line above the whole document. */
const SWAP = `(function(){`
  + `var h=document.currentScript.previousElementSibling;`
  + `var pick=document.documentElement.getAttribute("data-hl");`
  + `var next=pick&&h.dataset["hl"+pick[0].toUpperCase()+pick.slice(1)];`
  + `if(!next)return;`
  + `h.textContent=next;`
  + `if(pick==="finance"||pick==="skills"){h.classList.add("bn-h");h.lang="bn"}})()`;

const LD = "{\"@context\": \"https://schema.org\", \"@type\": \"WebSite\", \"name\": \"Reiad's Library\", \"url\": \"https://reiad.co.uk/\", \"description\": \"Plain-Bangla investment education, financial tools, and finance analysis.\", \"inLanguage\": [\"en\", \"bn\"], \"author\": {\"@type\": \"Person\", \"name\": \"Rony Reiad\", \"url\": \"https://reiad.co.uk/about.html\"}}";

export const metadata: Metadata = pageMeta({
  path: "/",
  title: "Reiad's Library · Finance & Bangladesh Markets",
  description: "Rony Reiad: finance and risk management graduate. Bangla-language "
    + "investment education for Bangladeshi readers, plus financial modeling, data "
    + "analysis and finance writing.",
  ogTitle: "Reiad's Library · Finance & Bangladesh Markets",
  ogDescription: "Plain-Bangla investment education, plus financial modeling and analysis.",
  card: "default",
});

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: LD }} />

      <main id="main">
        {/* home-flow lets the audience choice reorder these blocks; see
         the `audience` section of styles.css */}
        <div className="wrap home-flow">
          <div className="hero">
            {/* Decorative market line: draws itself on load (CSS animation).
             aria-hidden so screen readers skip the decoration. */}
            <svg className="hero-chart" viewBox="0 0 560 240" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path className="chart-fill" d="M0,205 C55,196 85,150 130,158 C175,166 205,118 250,124 C295,130 320,88 365,94 C410,100 435,58 480,52 C510,48 535,40 560,34 L560,240 L0,240 Z" />
              <path className="chart-line" pathLength="1" d="M0,205 C55,196 85,150 130,158 C175,166 205,118 250,124 C295,130 320,88 365,94 C410,100 435,58 480,52 C510,48 535,40 560,34" />
              <circle className="chart-dot" cx="560" cy="34" r="4.5" />
            </svg>
            <span className="eyebrow mono">Rony Reiad · Dhaka / Brighton · CFA L1 candidate
            </span>
            {/* ============ ONE HEADLINE PER VISITOR ============
             The headline holds ONE version, and the other three
             live in attributes beside it rather than in the element.

             That is not a style choice, it is the fix for a real
             break. app.js animates this headline word by word, and
             the way it does that is to read the element's
             textContent and replace its children with one span per
             word. Four headlines inside it meant four headlines
             read out as one string and rebuilt as one paragraph,
             which is exactly what a reader got on the first load
             after the deploy, because sw.js serves HTML
             network-first and scripts cache-first, so new markup
             met the previous app.js. Text that only makes sense to
             one version of a script does not belong in the DOM.

             An attribute is invisible to textContent, so every
             version of that script, including the one from before
             any of this existed, sees a single ordinary headline
             and does the right thing with it.

             The learner's two are Bangla, because the learning half
             of this site is Bangla: the person it is written for
             should not have to read English to be told it exists. */}
            {/* `suppressHydrationWarning`, because the script below
                rewrites this heading before React gets to it and the
                whole point is that it happens before the first paint.
                Without it React finds text it did not render, calls
                that a mismatch and puts the English headline back,
                which is this page's share of the break the tools and
                the case studies had. */}
            <h1 id="kinetic" className="home-h1" suppressHydrationWarning data-hl-finance="টাকার ভাষা, আমাদের ভাষায়।" data-hl-skills="যা শিখতে চান, নিজের ভাষায়।" data-hl-work="Financial models you can open, edit and trust.">Bangladesh's markets, explained in the language we speak.
            </h1>
            {/* Through `dangerouslySetInnerHTML`, which for an inline
                script is not a style: React drops the children of a
                `<script>` tag written as JSX, so this shipped as
                `<script></script>` and swapped nothing at all. */}
            <script dangerouslySetInnerHTML={{ __html: SWAP }} />
            <p className="lede" data-when="open">
              Two libraries in plain Bangla, one for money and one for everything
          else worth learning, plus financial modeling and analysis for clients
          who need the numbers done right.
        
            </p>
            <p className="lede" data-when="finance" lang="bn">
              বিও অ্যাকাউন্ট খোলা থেকে গবেষণা পর্যন্ত: শেয়ার, সঞ্চয়পত্র, মিউচুয়াল ফান্ড আর
          ঝুঁকির হিসাব, সবটাই সহজ বাংলায়। সঙ্গে 
              <span data-count="calculators">৫
              </span>টা ক্যালকুলেটর, যাতে হিসাবটা
          নিজেই করে দেখতে পারেন।
        
            </p>
            <p className="lede" data-when="skills" lang="bn">
              টাকা ছাড়া বাকি যা কিছু: জার্মান, কুরআনের আরবি আর ইংরেজি আজই শুরু করা যায়,
          রান্নাঘরে প্রথম লেখাটা তৈরি, আর ভ্রমণ ও রিভিউ হচ্ছে। ব্যাখ্যা বাংলায়, অনুশীলন
          আসল জিনিসে, কোনো লগইন বা দাম ছাড়াই।
        
            </p>
            <p className="lede" data-when="work">
              Three-statement models, DCFs, Python analysis and finance writing,
          from an MSc in finance and risk management. Every case study on this
          site runs in your browser, so you can take the work apart before you
          decide whether to commission any.
        
            </p>
            {/* ============ THE FRONT DOOR ============
             Three very different people arrive here: a Bangladeshi
             reader who wants to understand money in Bangla, one who
             came for German or one of the schools being written
             beside it, and a recruiter or client who wants the
             work. Asking once beats making each of them read past
             the other two.

             The learning pair is grouped rather than laid out as
             three equal doors, because the real question is "are
             you here to learn or to hire?" and the second question,
which library, only exists for one of those
             answers. Grouping asks both at once without pretending
             they are the same question.

             Every door is an ordinary link, so this works with
             JavaScript off; audience.js only adds the remembering.
             Nothing is ever hidden as a result of the answer, see
             the note at the top of audience.js. */}
            <div className="doorway" id="doorway">
              <div className="door-group">
                <span className="door-group-label mono">আমি শিখতে এসেছি · I'm here to learn
                </span>
                <div className="door-pair">
                  <a className="cell door" href="/learn/index.html" data-door="finance" data-audience-pick="learn" data-track-pick="finance" data-keep>
                    <span className="door-art" aria-hidden="true">
                      <svg className="art" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 21v-7" />
                        <path d="M12 14c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z" />
                        <path d="M12 16c0-2.5-2-4.5-4.5-4.5C7.5 14 9.5 16 12 16Z" />
                      </svg>
                    </span>
                    <h3 className="bn-h">টাকা ও বিনিয়োগ
                    </h3>
                    <p>শেয়ার, সঞ্চয়পত্র, ঝুঁকি: একদম শুরু থেকে।
                    </p>
                    <span className="more">শেখার লাইব্রেরি →
                    </span>
                  </a>
                  <a className="cell door" href="/skills/index.html" data-door="skills" data-audience-pick="learn" data-track-pick="skills">
                    <span className="door-art" aria-hidden="true">
                      <svg className="art" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5Z" />
                        <path d="M4 19.5A1.5 1.5 0 0 1 5.5 21H19v-3" />
                        <path d="M8 7.5h7" />
                      </svg>
                    </span>
                    <h3 className="bn-h">দক্ষতা
                    </h3>
                    <p>জার্মান, কুরআন, ইংরেজি, রান্না, ভ্রমণ, রিভিউ।
                    </p>
                    <span className="more">দক্ষতার তালিকা →
                    </span>
                  </a>
                </div>
              </div>
              <div className="door-group">
                <span className="door-group-label mono">Or you're here for the work
                </span>
                <a className="cell door door-work" href="/portfolio.html" data-door="work" data-audience-pick="work">
                  <span className="door-art" aria-hidden="true">
                    <svg className="art" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8h18v11H3z" />
                      <path d="M9 8V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v2" />
                      <path d="M3 13h18" />
                      <path d="M11 13v2h2v-2" />
                    </svg>
                  </span>
                  <h3>I'm hiring, or I need work done
                  </h3>
                  <p>Financial modeling, data analysis and finance writing: open a
                 case study and edit the assumptions yourself.
                  </p>
                  <span className="more">See the portfolio →
                  </span>
                </a>
              </div>
            </div>
            {/* The button row that replaces the doors once a visitor has
             chosen. There is no `open` version: before they choose,
             the doorway above is the thing to act on and this row
             would only be the same links twice. */}
            <div className="hero-actions after-doors" data-when="finance">
              <a className="btn btn-solid" href="/learn/index.html">শেখার লাইব্রেরি →
              </a>
              <a className="btn btn-ghost" href="/tools/index.html">ক্যালকুলেটর
              </a>
              <a className="btn btn-ghost" href="/skills/index.html">দক্ষতা
              </a>
            </div>
            <div className="hero-actions after-doors" data-when="skills">
              <a className="btn btn-solid" href="/skills/index.html">দক্ষতার তালিকা →
              </a>
              <a className="btn btn-ghost" href="/deutsch/index.html">জার্মান শুরু করুন
              </a>
              <a className="btn btn-ghost" href="/learn/index.html">টাকা ও বিনিয়োগ
              </a>
            </div>
            <div className="hero-actions after-doors" data-when="work">
              <a className="btn btn-solid" href="/portfolio.html">See the portfolio
              </a>
              <a className="btn btn-ghost" href="/portfolio/three-statement.html">Open a live model
              </a>
              <a className="btn btn-ghost" href="/contact.html">Start a conversation
              </a>
            </div>
            {/* Ticker tape: decorative, pauses on hover, static under
             reduced motion. The list is duplicated once: the CSS loop
             scrolls exactly half the track for a seamless repeat, so
             KEEP BOTH COPIES IDENTICAL when editing. */}
            <div className="ticker" aria-hidden="true">
              <div className="ticker-track">
                <span>
                  <b>DSE
                  </b> · ঢাকা স্টক এক্সচেঞ্জ
                </span>
                <span>
                  <b>সঞ্চয়পত্র
                  </b> savings certificates
                </span>
                <span>
                  <b>মিউচুয়াল ফান্ড
                  </b> · NAV
                </span>
                <span>
                  <b>ডিভিডেন্ড
                  </b> · EPS · P/E
                </span>
                <span>
                  <b>চক্রবৃদ্ধি
                  </b> compounding
                </span>
                <span>
                  <b>ঝুঁকি ও রিটার্ন
                  </b> risk & return
                </span>
                <span>
                  <b>Excel
                  </b> models · Python · R
                </span>
                <span>
                  <b>CFA L1
                  </b> Nov 2026
                </span>
                <span>৳
                </span>
                <span>
                  <b>DSE
                  </b> · ঢাকা স্টক এক্সচেঞ্জ
                </span>
                <span>
                  <b>সঞ্চয়পত্র
                  </b> savings certificates
                </span>
                <span>
                  <b>মিউচুয়াল ফান্ড
                  </b> · NAV
                </span>
                <span>
                  <b>ডিভিডেন্ড
                  </b> · EPS · P/E
                </span>
                <span>
                  <b>চক্রবৃদ্ধি
                  </b> compounding
                </span>
                <span>
                  <b>ঝুঁকি ও রিটার্ন
                  </b> risk & return
                </span>
                <span>
                  <b>Excel
                  </b> models · Python · R
                </span>
                <span>
                  <b>CFA L1
                  </b> Nov 2026
                </span>
                <span>৳
                </span>
              </div>
            </div>
          </div>
          {/* ============ WELCOME BACK ============
           Three things a returning reader wants and a first-time
           one must never be shown: where they stopped, what else
           they had open, and what has happened since.

           Built by /home.js entirely from what is already on the
           device: the two schools' own bookmarks, the recent
           list in /recent.js, and the cached market pulse. The
           whole section stays `hidden` until there is genuinely
           something in it, because an empty "continue where you
           left off" is worse than no such offer at all: it tells
           a new visitor the site has lost their place. */}
          <section id="welcome-back" className="welcome-back" data-for="both" hidden>
            <span className="section-label mono" id="welcome-label">Pick up where you left off
            </span>
            {/* Only ever shown to somebody who has progress on this
             device and no account to keep it in. Filled by home.js. */}
            <p className="welcome-note" id="welcome-note" hidden />
            <div className="wb-grid">
              <div className="wb-continue" id="wb-continue" />
              <div className="wb-side">
                <div className="wb-recent" id="wb-recent" hidden />
                <div className="wb-news" id="wb-news" hidden />
              </div>
            </div>
          </section>
          {/* data-for marks who a block is mainly for; the `audience`
           block in styles.css reorders on it. Everything stays on the
           page for everyone: only the order changes. */}
          <div className="bento" data-for="work">
            {/* Featured article (big cell)
             Filled by home.js from the newest live article in
             content.js, so publishing a piece features it. What is
             written here is the fallback, and it is deliberately
             the first article rather than a placeholder: a reader
             with no JavaScript gets a real piece to read, not an
             empty box. */}
            <article className="cell cell-feature" data-for="learn" id="home-feature">
              <span className="tag mono">Featured · Explainer
              </span>
              <h2>How the Dhaka Stock Exchange actually works
              </h2>
              <p>What the DSEX index measures, how a BO account works, and the
             questions worth asking before buying your first share, the first
             piece in the Learn hub's interconnected library.
              </p>
              <a className="more" href="/insights/dse-basics.html">Read the explainer →
              </a>
            </article>
            {/* Glass stats card: the site's one glassmorphism moment */}
            <div className="cell cell-stats" data-for="work">
              <div className="glass">
                <span className="mono">Credentials
                </span>
                <div>
                  <strong>MSc Finance & Risk Management
                  </strong>
                  <small>University of Brighton · Upper Merit
                  </small>
                </div>
                <div>
                  <strong>CFA Level 1 candidate
                  </strong>
                  <small>
                    <time dateTime="2026-11">November 2026
                    </time> window
                  </small>
                </div>
                <div>
                  <strong>Bloomberg Market Concepts
                  </strong>
                  <small>Certified
                  </small>
                </div>
              </div>
            </div>
            {/* About snippet */}
            <div className="cell cell-about" data-for="work">
              <span className="tag mono">About
              </span>
              <h3>Economics first, risk second, plain language always
              </h3>
              {/* "published research" it is not: it is a submitted MSc
               dissertation, and the difference is one a reader in
               finance will notice. The claim is now what the work
               actually is, and the number is the one on the case
               study itself. */}
              <p>Economics in Chittagong, an MSc in Brighton, a dissertation on fund
             performance across 220 UK equity funds, and a habit of turning
             jargon into sentences people actually use.
              </p>
              <a className="more" href="/about.html">More about me →
              </a>
            </div>
            {/* What is being written next.
             home.js rotates this through the pieces marked "soon"
             in content.js, so the card changes as the queue does
             and cannot go on advertising something already
             published. The one below is the fallback. */}
            <div className="cell cell-note" data-for="learn" lang="bn" id="home-next">
              <span className="tag mono">লেখা হচ্ছে
              </span>
              <h3 className="bn-h">সঞ্চয়পত্র বনাম ব্যাংক এফডিআর
              </h3>
              <p>কর বাদ দিলে কোনটায় টাকা বেশি খাটে? হিসাবটা শেখার লাইব্রেরিতে আসছে।
              </p>
              <a className="more" href="/insights.html">সব লেখা →
              </a>
            </div>
            {/* Services teaser */}
            <div className="cell cell-services" data-for="work">
              <span className="tag mono">Services
              </span>
              {/* The model names are links now. They were plain text
               sitting beside pages that let you open the actual
               model and take it apart, which is the whole argument
               for hiring anyone, and it was two clicks away. */}
              <div className="svc">
                <span>Financial modeling: Excel,
              
                  <a href="/portfolio/three-statement.html">three-statement
                  </a>,
              
                  <a href="/portfolio/dcf.html">DCF
                  </a>
                </span>
                <span>Data analysis:
              
                  <a href="/portfolio/dsex.html">Python for finance
                  </a>,
              
                  <a href="/portfolio/dissertation.html">empirical research
                  </a>
                </span>
                {/* Three lines, and it stays three. A fourth ("emerging &
                 frontier markets, where the data is thin") was added here
                 and made this cell taller than the two beside it, which
                 put a band of empty panel across the whole row. The point
                 it was making is already made by the case studies below
                 and by the bio in the next cell along. */}
                <span>Finance writing: English & Bangla
                </span>
              </div>
              <a className="more" href="/portfolio.html">See portfolio →
              </a>
            </div>
          </div>
          {/* ============ THINGS YOU CAN OPEN ============
           For the hiring half. A portfolio that says "I build
           three-statement models" is a claim; one you can open,
           edit and watch recalculate is evidence. These were
           reachable only from /portfolio.html, which is one click
           too far for the thing that does the persuading.

           THREE, not all of them, and one line each. This list was
           the longest single thing on the home page: five rows
           with a three-line blurb apiece, in front of a reader who
           had not yet decided to care. A home page argues; the
           portfolio catalogues.

           WHICH three is home.js's business, not this file's. The
           rows below were typed here, and by the time three more
           case studies existed this section still showed the same
           three with a trailing line naming two of the four it had
           left out. The markup is now the no-JavaScript fallback
           and nothing more: home.js rebuilds the list from PAGES,
           rotates which three lead on a daily cycle so the page
           is not the same page every visit, and counts the rest
           rather than naming some of them.

           KEEP THE FALLBACK ROWS VALID anyway. They are what a
           reader with no JavaScript gets, and check-content.mjs
           will not let a case study go missing from the portfolio
           page, which is where all of them always are. */}
          <section data-for="work">
            <span className="section-label mono">Open one and take it apart
            </span>
            <p className="measure section-intro">Every model runs in the browser. Change an
           assumption and watch the statements, the valuation or the charts move with
           it: no download, no sign-up.
            </p>
            <div className="big-links" id="home-cases">
              <a className="big-link" href="/portfolio/three-statement.html">
                <span className="num">01
                </span>
                <span className="t">Three-statement model: a listed manufacturer
                </span>
                <span className="go">→
                </span>
                <span className="d">Linked statements with a revolver and a scenario switch. The
              balance check is on the page, and it ties.
                </span>
              </a>
              <a className="big-link" href="/portfolio/dcf.html">
                <span className="num">02
                </span>
                <span className="t">DCF with two-way sensitivity tables
                </span>
                <span className="go">→
                </span>
                <span className="d">WACC built up from its parts rather than typed in, and a grid
              where every cell is a full revaluation.
                </span>
              </a>
              <a className="big-link" href="/portfolio/dsex.html">
                <span className="num">03
                </span>
                <span className="t">Index volatility & drawdowns: Python
                </span>
                <span className="go">→
                </span>
                <span className="d">Rolling volatility, drawdown episodes with recovery times, fat
              tails against a normal curve. Bring your own CSV.
                </span>
              </a>
            </div>
            <p className="section-more">
              <a href="/portfolio.html" id="home-cases-rest">Every case
           study, and how a project runs →
              </a>
            </p>
          </section>
          {/* ============ WHAT'S HERE: THE MONEY LIBRARY ============ */}
          {/* The learner's half of the home page, in Bangla.

           It was written in English about Bangla content, which is
           the wrong way round: someone who came here because the
           explanations exist in their own language should not have
           to read English to find them. The English half is
           untouched: it is a page ordering, not a translation.

           There are two of these now, one per track. Both are on
           the page for everyone, always; the track only decides
           which comes first. See the note at the top of
           audience.js for why that is never a filter.

           Three rows each, one line each. These are signposts to
           the two hubs, not a table of contents for them: the
           hub is better at being that than a home page is, and it
           is one tap away in the nav. What used to be here was
           four rows with a four-line blurb apiece, twice over,
           which is most of the reason this page needed scrolling
           past to reach anything. */}
          <section data-for="learn" data-track="finance" lang="bn" className="learn-half">
            <span className="section-label mono">টাকা ও বিনিয়োগ · এখান থেকে শুরু করুন
            </span>
            <div className="big-links">
              <a className="big-link" href="/learn/index.html" data-keep>
                <span className="num">০১
                </span>
                <span className="t bn-h">শেখার লাইব্রেরি: একদম শুরু থেকে
                </span>
                <span className="go">→
                </span>
                <span className="d">বিও অ্যাকাউন্ট খোলা থেকে গবেষণা পর্যন্ত 
                  <span data-count="stages">৮
                  </span>টা ধাপ, 
                  <span data-count="lessons">৬০
                  </span>টা লেখা।
                </span>
              </a>
              <a className="big-link" href="/tools/stock.html">
                <span className="num">০২
                </span>
                <span className="t bn-h">শেয়ার যাচাই: কিনবেন, ধরে রাখবেন, নাকি বেচবেন?
                </span>
                <span className="go">→
                </span>
                <span className="d">বার্ষিক প্রতিবেদনের সংখ্যা বসান, 
                  <span data-count="ratios">৪৪
                  </span>টা রেশিও নিজেই হিসাব করে দেখাবে।
                </span>
              </a>
              <a className="big-link" href="/tools/index.html">
                <span className="num">০৩
                </span>
                <span className="t bn-h">ক্যালকুলেটর: যে 
                  <span data-count="calculators">৫
                  </span>টা হিসাব আগে করা দরকার
                </span>
                <span className="go">→
                </span>
                <span className="d">চক্রবৃদ্ধি, সঞ্চয়পত্র বনাম এফডিআর, মূল্যস্ফীতি, কিস্তি আর ঝুঁকির মাপ।
                </span>
              </a>
            </div>
          </section>
          {/* ============ WHAT'S HERE: THE SKILLS ============ */}
          <section data-for="learn" data-track="skills" lang="bn" className="learn-half">
            <span className="section-label mono">দক্ষতা · টাকা ছাড়া বাকি যা কিছু
            </span>
            <p className="measure section-intro">একটা স্কুল পুরো লেখা হয়ে গেছে, বাকিগুলো হচ্ছে।
          কোনটা কতটা তৈরি, তালিকায় বলা আছে।
            </p>
            <div className="big-links">
              <a className="big-link" href="/deutsch/index.html">
                <span className="num">০১
                </span>
                <span className="t bn-h">জার্মান, বাংলায়: একদম শুরু থেকে
                </span>
                <span className="go">→
                </span>
                <span className="d">
                  <span data-count="stufen">৪
                  </span>টা স্তর, ধ্বনি থেকে শুরু: প্রথম দিনেই যেকোনো জার্মান শব্দ পড়তে পারবেন।
                </span>
              </a>
              <a className="big-link" href="/deutsch/stufe-1/arbeitsbuch.html">
                <span className="num">০২
                </span>
                <span className="t bn-h">রোজকার অনুশীলন খাতা
                </span>
                <span className="go">→
                </span>
                <span className="d">প্রথম 
                  <span data-count="workbooks">৩
                  </span>টা স্তরে দিনে একটা পাতা: একটা ছাঁচ, কয়েকটা নমুনা, আর নিজের হাতে লেখা বাক্য।
                </span>
              </a>
              <a className="big-link" href="/skills/index.html">
                <span className="num">০৩
                </span>
                <span className="t bn-h">দক্ষতার পুরো তালিকা
                </span>
                <span className="go">→
                </span>
                <span className="d">কুরআন, ইংরেজি, রান্না, ভ্রমণ আর রিভিউ: কোনটা কতটা তৈরি, এক পাতায়।
                </span>
              </a>
            </div>
          </section>
          {/* ============ LATEST ============ */}
          <section data-for="both">
            <span className="section-label mono">Latest writing
            </span>
            {/* rendered from the ARTICLES list in /content.js */}
            <div className="cards grid-2" id="article-cards" data-section="insights" data-mode="live" data-limit="2" />
            <p className="section-more">
              <a href="/insights.html">Everything I've written →
              </a>
            </p>
          </section>
          {/* ============ WHY THIS EXISTS ============ */}
          <section data-for="context">
            <span className="section-label mono">Why this site exists
            </span>
            <div className="principles">
              <div className="principle">
                <h3>The jargon is the barrier
                </h3>
                <p>Most savings decisions in Bangladesh are made without the vocabulary to
               examine them, not from a lack of intelligence, but because the
               explanations only exist in English, written for people who already
               understand. The same is true of German grammar, of Quranic Arabic, of
               half the things worth learning. That's a solvable problem.
                </p>
              </div>
              <div className="principle">
                <h3>Arithmetic before opinion
                </h3>
                <p>Whether sanchayapatra beats an FDR is not a matter of opinion; it's a
               calculation, and it changes with the tax at source and how long you can
               leave the money. So the calculators come with the writing.
                </p>
              </div>
              <div className="principle">
                <h3>Say what isn't known
                </h3>
                <p>Rates change, rules change, and automated news filters miss things.
               Every page here says what it assumes and where it could be wrong.
               Nothing on this site tells you what to buy.
                </p>
              </div>
            </div>
          </section>
          {/* ============ CTA ============ */}
          <div className="band">
            <span className="mono">Working together
            </span>
            <h2>Numbers that need doing properly
            </h2>
            <p>Freelance financial modeling, data analysis and finance writing, for
           founders raising money, teams that need a model they can actually edit,
           and publications that need finance explained without the fog. Remote,
           and used to working across time zones.
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid" href="/contact.html">Start a conversation
              </a>
              <a className="btn btn-ghost" href="/portfolio.html">See what that looks like
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
