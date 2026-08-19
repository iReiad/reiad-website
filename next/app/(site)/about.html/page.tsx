/* ============================================================
   /about.html

   Ported out of `aab/about.html` with archive/TRANSITION.md Stage 11.5,
   words unchanged.

   ---- the tally ----

   The four numbers under the glance are counted on the server out
   of `@reiad/shared/content`, which is the same manifest the
   browser reads at `/content.js`. They were `/about.js`'s until
   the four ladders moved into `shared/`, and a reader with no
   JavaScript saw a dash where each number should have been.
   ============================================================ */

import type { Metadata } from "next";
import { COUNTS } from "@reiad/shared/content";
import { pageMeta } from "../../../lib/pageMeta";
import { Band } from "../../../components/ui/band";
import { ButtonLink } from "../../../components/ui/button";
import { InfoCard } from "../../../components/deck";
import { Eyebrow, SectionLabel } from "../../../components/ui/label";

const DEK = "Rony Reiad: economics graduate from Chittagong, MSc Finance & Risk "
  + "Management from Brighton, researching Islamic funds and credit risk, and "
  + "building Bangla-language investment education.";

export const metadata: Metadata = pageMeta({
  path: "/about.html",
  title: "About · Reiad's Library",
  description: DEK,
  ogTitle: "About",
  card: "about",
});

export default function AboutPage() {
  return (

      <main id="main">
        <div className="wrap">
          {/* ============================================================
           HERO: the name card

           Written in the third person throughout. That changes what
           can honestly be said: a first-person page can call its own
           work rigorous, a third-person one describing the same
           person reads as boasting the moment it uses an adjective.
           So this states what he did and lets the reader judge it.
           ============================================================ */}
          <section className="about-hero">
            <div className="about-intro">
              <Eyebrow>About
              </Eyebrow>
              <h1>Economics first, risk second, plain language always.
              </h1>
              <p className="lede">
                Rony Reiad is an economics graduate from Chittagong who took an MSc in
            Finance and Risk Management at Brighton. He writes and builds everything
            on this site, the Bangla learning library, the calculators, and the
            models in the portfolio.
          
              </p>
              <p className="about-thesis">
                His working view is that financial knowledge in Bangladesh usually fails
            people at the language step rather than the maths step, and that this is
            a solvable problem rather than a permanent one.
          
              </p>
            </div>
            <aside className="id-card">
              <span className="id-mark" aria-hidden="true">
                <svg viewBox="0 0 100 100" fill="none">
                  <rect x="22" y="58" width="10" height="20" rx="3" fill="currentColor" />
                  <rect x="40" y="46" width="10" height="32" rx="3" fill="currentColor" />
                  <rect x="58" y="32" width="10" height="46" rx="3" fill="currentColor" />
                  <circle cx="63" cy="24" r="5.5" fill="var(--accent)" />
                </svg>
              </span>
              <strong className="id-name">Rony Reiad
              </strong>
              <span className="id-role">MSc Finance & Risk Management
              </span>
              <span className="id-role">CFA Level 1 candidate · November 2026
              </span>
              <span className="id-place mono">Chittagong → Brighton
              </span>
              <ul className="social" aria-label="Elsewhere on the web">
                <li>
                  <a href="https://www.linkedin.com/in/reiad" rel="me noopener" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4V9Z" />
                    </svg>
                    <span>LinkedIn
                    </span>
                  </a>
                </li>
                <li>
                  <a href="https://x.com/i_reiad" rel="me noopener" aria-label="X">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M17.53 3h3.05l-6.67 7.62L21.75 21h-6.13l-4.8-6.28L5.32 21H2.27l7.13-8.15L2.25 3h6.29l4.34 5.74L17.53 3Zm-1.07 16.17h1.69L7.62 4.73H5.81l10.65 14.44Z" />
                    </svg>
                    <span>X
                    </span>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/reiaaaad/" rel="me noopener" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
                    </svg>
                    <span>Facebook
                    </span>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/reiaaad/" rel="me noopener" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.8c-3.14 0-3.51.01-4.75.07-1.15.05-1.77.24-2.18.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.18-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.05 1.15.24 1.77.4 2.18.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.18.4 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c1.15-.05 1.77-.24 2.18-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.18.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.05-1.15-.24-1.77-.4-2.18a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.18-.4-1.24-.06-1.61-.07-4.75-.07Zm0 3.06a4.98 4.98 0 1 1 0 9.96 4.98 4.98 0 0 1 0-9.96Zm0 8.21a3.23 3.23 0 1 0 0-6.46 3.23 3.23 0 0 0 0 6.46Zm6.34-8.41a1.16 1.16 0 1 1-2.33 0 1.16 1.16 0 0 1 2.33 0Z" />
                    </svg>
                    <span>Instagram
                    </span>
                  </a>
                </li>
                <li>
                  <a href="mailto:i@reiad.co.uk" aria-label="Email">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.4L4.6 7h14.8L12 12.4ZM4 8.5V17h16V8.5l-7.4 5.4a1 1 0 0 1-1.2 0L4 8.5Z" />
                    </svg>
                    <span>Email
                    </span>
                  </a>
                </li>
              </ul>
            </aside>
          </section>
          {/* ============ AT A GLANCE ============ */}
          <section className="no-label">
            <div className="glance">
              <div className="glance-item">
                <span className="glance-k mono">Degree
                </span>
                <b>MSc Finance & Risk Management
                </b>
                <small>University of Brighton · Upper Merit
                </small>
              </div>
              <div className="glance-item">
                <span className="glance-k mono">First degree
                </span>
                <b>BSS Economics (Honours)
                </b>
                <small>University of Chittagong
                </small>
              </div>
              <div className="glance-item">
                <span className="glance-k mono">In progress
                </span>
                <b>CFA Level 1
                </b>
                <small>November 2026 window
                </small>
              </div>
              <div className="glance-item">
                <span className="glance-k mono">Languages
                </span>
                <b>English ·{" "}
                  <span className="bn-h">বাংলা
                  </span>
                </b>
                <small>Writes and models in both
                </small>
              </div>
            </div>
          </section>
          {/* ============ WHAT HE HAS BUILT HERE ============
           Counted out of the manifest, so the figures cannot drift
           from the site they describe. `lessons` is the ones
           WRITTEN rather than the ones planned: counting the whole
           ladder had this page advertising 89 while the home page
           said 60 about the same shelf. */}
          <section className="no-label">
            <div className="tally" id="tally">
              <a className="tally-item" href="/money/index.html" data-keep>
                <b>{COUNTS.lessons}
                </b>
                <span>lessons in the Bangla library
                </span>
              </a>
              <a className="tally-item" href="/money/index.html" data-keep>
                <b>{COUNTS.stages}
                </b>
                <span>stages, starter to research level
                </span>
              </a>
              <a className="tally-item" href="/tools/index.html">
                <b>{COUNTS.calculators}
                </b>
                <span>calculators, each linkable
                </span>
              </a>
              <a className="tally-item" href="/portfolio.html">
                <b>{COUNTS.models}
                </b>
                <span>interactive models to open
                </span>
              </a>
            </div>
          </section>
          {/* ============ THE STORY ============ */}
          <section className="prose">
            <SectionLabel>The route here
            </SectionLabel>
            <p>
              He read Economics at the University of Chittagong, then moved to the UK for
          an MSc in Finance and Risk Management at the University of Brighton's School
          of Business and Law, finishing with an Upper Merit. The interests narrowed
          along the way: corporate finance, equity research, credit risk, and how
          markets behave when they are tested with data rather than described with
          adjectives.
        
            </p>
            <p>
              The research followed that instinct. His dissertation (15,000 words)
          asked whether Islamic funds genuinely carry less risk than conventional UK
          funds, measuring systematic risk, idiosyncratic risk and drawdowns instead
          of taking the marketing at face value. A related project built an Islamic
          fund portfolio in Python and compared its pre- and post-COVID performance
          against conventional benchmarks, with the analysis and charts automated. A
          third worked a credit-risk case the way a bank would: liquidity, leverage,
          profitability, repayment capacity, recommendation.
        
            </p>
            <p>
              Alongside that: a quantitative analysis internship with the Summit Equity
          Society at the University of Essex, industry experience at a corporate legal
          firm in Eastbourne that included financial fraud investigation, and two
          years as President of the Bangladeshi Society at Brighton. He worked
          customer-facing jobs through the degree. Before all of it, Sylhet Cadet
          College, and a pass through the Bangladesh Navy officers' ISSB selection.
        
            </p>
            <p>
              This site exists because financial education in Bangladesh mostly arrives
          either in English or in textbook Bangla, and neither is how people talk
          about money. The Learn hub is the attempt to close that gap: every concept
          in everyday spoken Bangla, every term linked, nothing left unexplained
          because it was assumed.
        
            </p>
          </section>
          {/* ============ THE TIMELINE ============
           Education and work on one spine rather than two separate
           key/value tables. They happened at the same time, and
           reading them as one sequence is the only way the shape of
           it makes sense. */}
          <section>
            <SectionLabel>Education & experience
            </SectionLabel>
            <ol className="cv">
              <li className="cv-item" data-kind="edu">
                <span className="cv-year mono">2024–26
                </span>
                <div className="cv-body">
                  <h3>MSc Finance & Risk Management 
                    <em>Upper Merit
                    </em>
                  </h3>
                  <span className="cv-org">University of Brighton, UK
                  </span>
                  <p>Financial risk management, applied econometrics and time-series,
                 investment management, financial theory.
                  </p>
                </div>
              </li>
              <li className="cv-item" data-kind="work">
                <span className="cv-year mono">2025
                </span>
                <div className="cv-body">
                  <h3>Quantitative Analysis Intern
                  </h3>
                  <span className="cv-org">Summit Equity Society, University of Essex · remote
                  </span>
                  <p>Market and company research, Excel-based analysis, mutual fund
                 research summaries.
                  </p>
                </div>
              </li>
              <li className="cv-item" data-kind="work">
                <span className="cv-year mono">2025
                </span>
                <div className="cv-body">
                  <h3>Paralegal: industry experience
                  </h3>
                  <span className="cv-org">Corporate & Legal Corporation, Eastbourne
                  </span>
                  <p>Financial fraud investigation, repayment plans and corporate case
                 handling.
                  </p>
                </div>
              </li>
              <li className="cv-item" data-kind="work">
                <span className="cv-year mono">2024–25
                </span>
                <div className="cv-body">
                  <h3>President: Bangladeshi Society
                  </h3>
                  <span className="cv-org">University of Brighton
                  </span>
                  <p>Events, charity coordination and stakeholder management for the
                 society's members.
                  </p>
                </div>
              </li>
              <li className="cv-item" data-kind="work">
                <span className="cv-year mono">2024–26
                </span>
                <div className="cv-body">
                  <h3>Customer-facing roles alongside the MSc
                  </h3>
                  <span className="cv-org">Brighton & Burgess Hill
                  </span>
                  <p>Front-of-house operations and team coordination, worked around a
                 full-time degree.
                  </p>
                </div>
              </li>
              <li className="cv-item" data-kind="edu">
                <span className="cv-year mono">2018–23
                </span>
                <div className="cv-body">
                  <h3>BSS Economics (Honours)
                  </h3>
                  <span className="cv-org">University of Chittagong, Bangladesh
                  </span>
                </div>
              </li>
              <li className="cv-item" data-kind="edu">
                <span className="cv-year mono">Earlier
                </span>
                <div className="cv-body">
                  <h3>Sylhet Cadet College 
                    <em>GPA 5.00 / 5.00
                    </em>
                  </h3>
                  <span className="cv-org">SSC and HSC · passed Bangladesh Navy officers' ISSB selection
                  </span>
                </div>
              </li>
            </ol>
          </section>
          {/* ============ RESEARCH ============ */}
          <section>
            <SectionLabel>Research
            </SectionLabel>
            {/* ============================================================
             Each of these three became a case study you can open and
             drive. For a while the cards did not say so: they
             described the research in the past tense and led
             nowhere, while the finished, interactive version of the
             same work sat two clicks away in the portfolio.

             So they open. A card is a button now, it opens the same
             kind of mini window the market-pulse cards use on the
             Insights page, growing out of the card you clicked, and
             the window carries what the card had no room for plus a
             way into the case study itself.

             The `data-detail` paragraphs are the window's content
             and stay in the markup rather than in about.js: they are
             page copy, they should be in the page, and a reader with
             no JavaScript gets a card that is simply a link to the
             case study instead. See about.js.
             ============================================================ */}
            <div className="research" id="research">
              <article className="res" data-case="/portfolio/dissertation.html" data-case-label="Open the dissertation case study">
                <span className="res-tag mono">Dissertation · 15,000 words
                </span>
                <h3>Do Islamic funds actually carry less risk?
                </h3>
                <p>Islamic against conventional UK funds on systematic risk, idiosyncratic
               risk and drawdowns, across the pre- and post-COVID periods. The
               interesting differences turned up in behaviour under stress rather than
               in headline average returns.
                </p>
                <template data-detail />
                <a className="res-fallback more" href="/portfolio/dissertation.html">Open the dissertation case study →
                </a>
              </article>
              <article className="res" data-case="/portfolio/frontier.html" data-case-label="Open the fund">
                <span className="res-tag mono">Python
                </span>
                <h3>An Islamic fund portfolio, built and tested
                </h3>
                <p>Portfolio construction in Python with performance compared against
               conventional benchmarks either side of COVID. Analysis and charts
               automated, so re-running it on new data is one command.
                </p>
                <template data-detail />
                <a className="res-fallback more" href="/portfolio/frontier.html">Open the fund →
                </a>
              </article>
              <article className="res" data-case="/portfolio/scorecard.html" data-case-label="Open the credit models">
                <span className="res-tag mono">Credit
                </span>
                <h3>A credit-risk case, worked as a bank would
                </h3>
                <p>Liquidity, leverage, profitability and repayment capacity assessed in
               order, ending in a recommendation that states what would have to change
               to reverse it.
                </p>
                <template data-detail />
                <a className="res-fallback more" href="/portfolio/scorecard.html">Open the credit models →
                </a>
              </article>
            </div>
          </section>
          {/* ============ TOOLKIT ============ */}
          <section>
            <SectionLabel>Toolkit & certificates
            </SectionLabel>
            <div className="kit">
              <div className="kit-group">
                <span className="kit-k mono">Modelling
                </span>
                <ul className="chips">
                  <li>Excel
                  </li>
                  <li>Three-statement
                  </li>
                  <li>DCF
                  </li>
                  <li>Credit analysis
                  </li>
                </ul>
              </div>
              <div className="kit-group">
                <span className="kit-k mono">Analysis
                </span>
                <ul className="chips">
                  <li>Python
                  </li>
                  <li>R
                  </li>
                  <li>Stata
                  </li>
                  <li>SPSS
                  </li>
                  <li>EViews
                  </li>
                </ul>
              </div>
              <div className="kit-group">
                <span className="kit-k mono">Data
                </span>
                <ul className="chips">
                  <li>Bloomberg Terminal
                  </li>
                  <li>DSE filings
                  </li>
                  <li>Time-series
                  </li>
                </ul>
              </div>
              <div className="kit-group">
                <span className="kit-k mono">Certificates
                </span>
                <ul className="chips">
                  <li>Bloomberg Market Concepts
                  </li>
                  <li>Algorithmic Trading & Finance Models: Python, R, Stata
                  </li>
                  <li>Reading Corporate Financial Statements
                  </li>
                </ul>
              </div>
            </div>
            <p className="kit-note">
              The formal CV is available on request:{" "}
              <a href="mailto:i@reiad.co.uk">email
              </a>{" "}
              or{" "}
              <a href="https://www.linkedin.com/in/reiad" rel="noopener">LinkedIn
              </a>.
        
            </p>
          </section>
          {/* ============ HOW HE WORKS ============ */}
          <section>
            <SectionLabel>How he works
            </SectionLabel>
            <div className="principles">
              <div className="principle">
                <h3>Assumptions live in one place
                </h3>
                <p>Every model has a single assumptions tab, colour-coded, with nothing
               hard-coded into a formula. Change a growth rate and the whole thing
               moves, without needing to ask him which cell to edit.
                </p>
              </div>
              <div className="principle">
                <h3>A number you can't trace is a number you can't defend
                </h3>
                <p>A figure in a summary links back to the calculation, and the
               calculation links back to its source. Everything on this site works
               that way, including the models in the portfolio.
                </p>
              </div>
              <div className="principle">
                <h3>Plain language is a technical skill
                </h3>
                <p>Restating jargon in more jargon is easy. Explaining a concept so a
               non-specialist gets it, without making it wrong, requires
               understanding the thing properly first.
                </p>
              </div>
              <div className="principle">
                <h3>State the uncertainty
                </h3>
                <p>Risk management leaves a habit behind: give the range, name what would
               have to be true, and say which input the answer is most sensitive to.
               Several pages here refuse to produce a number when the inputs don't
               support one.
                </p>
              </div>
            </div>
          </section>
          {/* ============ WHERE THIS IS GOING ============ */}
          <section>
            <SectionLabel>Where this is going
            </SectionLabel>
            {/* Roadmap, not résumé: "Now" is in progress, the rest are
             stated intentions. Worth keeping that distinction visible. */}
            <div className="path">
              <InfoCard chip="Now · 2026"
                        title="Building the foundation">
                <ul>
                  <li>CFA Level 1: November 2026 window
                  </li>
                  <li>Publishing the Bangla Learn hub, stage by stage
                  </li>
                  <li>A public library of models: every one open, editable and showing its arithmetic
                  </li>
                </ul>
              </InfoCard>
              <InfoCard chip="Next · 2027–28"
                        title="Into the industry">
                <ul>
                  <li>Analyst or management trainee: Bangladesh banking or Gulf finance
                  </li>
                  <li>CFA Level 2, continuing the charter path
                  </li>
                  <li>Freelance modeling practice with repeat clients
                  </li>
                </ul>
              </InfoCard>
              <InfoCard chip="The aim"
                        title="Research-grade finance, spoken plainly"
                        fill>
                <ul>
                  <li>Charterholder working across Bangladesh and Gulf markets
                  </li>
                  <li>A Bangla resource first-time investors actually reach for
                  </li>
                  <li>Research that bridges local markets and global standards
                  </li>
                </ul>
              </InfoCard>
            </div>
          </section>
          {/* ============ FAQ ============ */}
          <section>
            <SectionLabel>Questions people actually ask
            </SectionLabel>
            <div className="stack measure">
              <details className="faq">
                <summary>Why write investment education in Bangla?
                </summary>
                <p>Because the decisions get made in Bangla. Someone choosing between
               sanchayapatra and an FDR is not going to read a forty-page English
               circular, and shouldn't have to. Most of what is published on
               Bangladeshi markets is either English and technical or Bangla and
               promotional. There is very little in between, and that gap is what
               this site is for.
                </p>
              </details>
              <details className="faq">
                <summary>Does he give investment advice?
                </summary>
                <p>No, and not as a legal formality. He isn't a licensed adviser, he
               doesn't know your situation, and the moment a site like this starts
               recommending instruments it acquires an interest in you believing it.
               Explaining how something works and telling you what to buy are
               different jobs; this site only does the first.
                </p>
              </details>
              <details className="faq">
                <summary>What does the dissertation actually say?
                </summary>
                <p>It compared Islamic and conventional fund performance on systematic
               risk and drawdowns across the pre- and post-COVID periods. The short
               version: the differences worth knowing about show up in how the two
               behave under stress, not in headline average returns, and the sample
               of Shariah-compliant funds was too small to have proved otherwise.
               The whole thing is on this site as an{" "}
               
                  <a href="/portfolio/dissertation.html">interactive case study
                  </a>,
               every table and series as submitted.
                </p>
              </details>
              <details className="faq">
                <summary>Is he available for work?
                </summary>
                <p>Yes: financial modeling, data analysis and finance writing, freelance.{" "}
               
                  <a href="/portfolio.html">The portfolio page
                  </a> sets out what that
               covers and how a project runs, and{" "}
               
                  <a href="/contact.html">the contact form
                  </a> reaches him directly.
                </p>
              </details>
              <details className="faq">
                <summary>How was this site built?
                </summary>
                <p>By hand for two years, and it is moving: the pages you are reading
               are becoming React components on Next.js, one route at a time, with
               the writing itself in a database rather than in files. The plan, the
               reasoning and the things it has cost are in{" "}
               
                  <a href="https://github.com/iReiad/reiad-website">the repository
                  </a>,
               written down as they happen rather than afterwards.
                </p>
              </details>
            </div>
          </section>
          <Band
            label="Elsewhere"
            title="Recruiters, clients, or a reader with a question"
            actions={<>
              <ButtonLink kind="solid" onAccent href="/contact.html">Get in touch</ButtonLink>
              <ButtonLink kind="ghost" onAccent href="mailto:i@reiad.co.uk">i@reiad.co.uk</ButtonLink>
            </>}
            footer={<ul className="social social-band" aria-label="Elsewhere on the web">
                <li>
                  <a href="https://www.linkedin.com/in/reiad" rel="me noopener">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4V9Z" />
                    </svg>
                    <span>LinkedIn
                    </span>
                  </a>
                </li>
                <li>
                  <a href="https://x.com/i_reiad" rel="me noopener">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M17.53 3h3.05l-6.67 7.62L21.75 21h-6.13l-4.8-6.28L5.32 21H2.27l7.13-8.15L2.25 3h6.29l4.34 5.74L17.53 3Zm-1.07 16.17h1.69L7.62 4.73H5.81l10.65 14.44Z" />
                    </svg>
                    <span>X
                    </span>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/reiaaaad/" rel="me noopener">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
                    </svg>
                    <span>Facebook
                    </span>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/reiaaad/" rel="me noopener">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.8c-3.14 0-3.51.01-4.75.07-1.15.05-1.77.24-2.18.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.18-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.05 1.15.24 1.77.4 2.18.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.18.4 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c1.15-.05 1.77-.24 2.18-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.18.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.05-1.15-.24-1.77-.4-2.18a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.18-.4-1.24-.06-1.61-.07-4.75-.07Zm0 3.06a4.98 4.98 0 1 1 0 9.96 4.98 4.98 0 0 1 0-9.96Zm0 8.21a3.23 3.23 0 1 0 0-6.46 3.23 3.23 0 0 0 0 6.46Zm6.34-8.41a1.16 1.16 0 1 1-2.33 0 1.16 1.16 0 0 1 2.33 0Z" />
                    </svg>
                    <span>Instagram
                    </span>
                  </a>
                </li>
              </ul>}
          >
            <p>All three are welcome. The contact form lands straight in his inbox, and
              he answers within a business day.</p>
          </Band>
        </div>
      </main>
  );
}
