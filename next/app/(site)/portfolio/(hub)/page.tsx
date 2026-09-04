/* ============================================================
   /portfolio

   Ported out of `aab/portfolio.html` with archive/TRANSITION.md Stage 11.3,
   words unchanged: this is the portfolio index.

   The numbers are not here and must not be. Every figure on this
   page is computed in the browser by `/app.js`
   from the `.model.js` and `.data.js` files beside it, which stay
   exactly where they are with their tests running on every
   commit. What moved is the page around the numbers, which is the
   whole of section 2b's rule about the case studies: their value
   is that the figures are right and provably unchanged, so they
   are the last thing a port is allowed to touch.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";
import { Band } from "../../../../components/ui/band";
import { Button, ButtonLink } from "../../../../components/ui/button";
import { Chip } from "../../../../components/ui/chip";
import { InfoCard } from "../../../../components/deck";
import { Eyebrow, SectionLabel } from "../../../../components/ui/label";
import { WorkCard } from "../../../../components/work-card";
import { STUDIES } from "../../../../lib/work";
import { HEADS } from "@reiad/shared/heads";

export const metadata: Metadata = pageMeta({
  path: "/portfolio",
  title: "Portfolio & Services · Reiad's Library",
  description: "Freelance financial modeling, data analysis and finance writing by Rony Reiad. Case studies you can open and drive in the browser, plus Excel models, Python and R analysis, and writing in English or Bangla.",
  ogTitle: "Portfolio & Services",
  ogDescription: "Freelance financial modeling, data analysis and finance writing by Rony Reiad. Case studies you can open and drive in the browser.",
  card: "portfolio",
});

export default function Page() {
  return (

      <main id="main">
        <div className="wrap">
          {/* ============================================================
           HERO

           The terms row under the buttons is the part a client
           actually scans for. Price basis, response time, ownership
           and NDA are the four questions that decide whether the
           email gets written, and they were previously spread over
           three sections and an FAQ near the bottom of the page.
           ============================================================ */}
          <div className="hero">
            {/* Out of `shared/heads.ts`, which is what the
                Android app draws this hub from too. */}
            <Eyebrow>{HEADS.portfolio.eyebrow}</Eyebrow>
            <h1>{HEADS.portfolio.title}</h1>
            <p className="lede">{HEADS.portfolio.lede}</p>
            <div className="hero-actions">
              <ButtonLink kind="solid" href="/contact">Start a project
              </ButtonLink>
              <ButtonLink kind="ghost" href="#work">See the work
              </ButtonLink>
            </div>
            <ul className="terms-row" aria-label="Terms, in brief">
              <li>Fixed price per project
              </li>
              <li>Quote within one business day
              </li>
              <li>You own the files
              </li>
              <li>NDA on request
              </li>
            </ul>
          </div>
          {/* ============ THE WORK, IN NUMBERS ============
           Every figure here is stated somewhere it can be checked:
           the fund-months and the five-year hold are printed on the
           pages they describe, and the business day is the promise
           made in the process section and the FAQ.

           The case-study count is NOT typed here. It said four while
           seven existed, because it was written when four was true
           and nothing made it look again. It is a [data-count] slot
           now, filled by app.js from COUNTS in content.js, which
           counts the cards rather than remembering them. The 7 in
           the markup is only the no-JavaScript fallback. Add a case
           study to PAGES and this number moves on its own. */}
          <div className="strip" aria-label="The work on this page, in numbers">
            <div>
              <span className="n" data-count="caseStudies">7
              </span>
              <span className="l">case studies you can open and drive in the browser
              </span>
            </div>
            <div>
              <span className="n">19,577
              </span>
              <span className="l">fund-months behind the dissertation's regressions
              </span>
            </div>
            <div>
              <span className="n">5 years
              </span>
              <span className="l">a screened fund weighted in 2015 and held, unchanged, through them
              </span>
            </div>
            <div>
              <span className="n">1 day
              </span>
              <span className="l">from brief to scope, delivery date and a fixed price
              </span>
            </div>
          </div>
          {/* ============================================================
           SELECTED WORK

           This section used to sit third, under two lists describing
           the services. It is the reason someone is on the page, so
           it comes first now, and each card carries the facts that
           make it checkable: the forecast horizon, the sample size,
           the number of views. The lead card is the three-statement
           model because the DCF is built on top of it, so it is the
           one to read first.

           These are real and finished. If a fifth lands, copy the
           card markup, keep the four facts honest, and add it to
           PAGES in content.js so the menu and the search palette
           pick it up too.
           ============================================================ */}
          <section id="work">
            <SectionLabel>Selected work
            </SectionLabel>
            <p className="section-intro measure">
              Every piece here is interactive, running its own arithmetic in your
          browser. Nothing is a picture of a spreadsheet: change an input and
          every number downstream of it moves, which is the only honest way to
          show that a model works.
        
            </p>
            {/* The seven, out of `next/lib/work.ts`, whose rows come
                from `PAGES` in `shared/content.ts`. They were written
                out here as seven blocks of markup carrying their own
                charts, which is a second copy of a list the site
                already holds: this page said four while seven
                existed, for that reason, and the front page could
                not show them at all without a third copy.

                The lead is the first row rather than a URL named
                here, because `PAGES` already lists the
                three-statement model first and the DCF is built on
                top of it. */}
            <WorkCard study={STUDIES[0]} lead />
            <div className="grid-3 work-grid">
              {STUDIES.slice(1).map((study) => (
                <WorkCard key={study.url} study={study} />
              ))}
            </div>
            {/* ============ THE REST OF IT ============
             The case studies above are the work that has a page of
             its own. This is everything else on the site that is
             also the work, and it stays a row list rather than
             becoming seven more cards: a client scanning the
             section should be able to tell the difference between
             "here is a model you can drive" and "here is more of
             what I do, if you want it".

             A separate archive page was the other option and is not
             worth it yet. It would be these four rows and the seven
             cards above, on a page of their own, with nothing on it
             that this section does not already say. */}
            <div className="work-more">
              <h2>Also on this site
              </h2>
              <p>Work that lives somewhere other than a case-study page.
              </p>
              <div className="big-links">
                <a className="big-link" href="/tools">
                  <span className="num">01
                  </span>
                  <span className="t">The calculators
                  </span>
                  <span className="go">→
                  </span>
                  <span className="d">
                    <span data-count="calculators">5
                    </span> calculators in the
                Tools hub, plus a stock check that runs{" "}
                    <span data-count="ratios">44
                    </span>{" "}
                    ratios across{" "}
                    <span data-count="pillars">6
                    </span> pillars and shows its own
                arithmetic. Each one linkable, each one in English or Bangla.
                  </span>
                </a>
                <a className="big-link" href="/insights">
                  <span className="num">02
                  </span>
                  <span className="t">Insights: the written pieces
                  </span>
                  <span className="go">→
                  </span>
                  <span className="d">Longer explainers and market write-ups. The finance-writing
                service, in the form it actually takes.
                  </span>
                </a>
                <a className="big-link" href="/money" data-keep>
                  <span className="num">03
                  </span>
                  <span className="t">The Bangla learning library
                  </span>
                  <span className="go">→
                  </span>
                  <span className="d">A full curriculum in everyday Bangla, from opening a BO
                account to reading research. The proof that the Bangla half of the
                writing service is not a translation exercise.
                  </span>
                </a>
                <a className="big-link" href="/about">
                  <span className="num">04
                  </span>
                  <span className="t">The research behind the case studies
                  </span>
                  <span className="go">→
                  </span>
                  <span className="d">The MSc dissertation, a fund portfolio built and tested in
                Python, and a credit-risk case worked the way a bank would: liquidity,
                leverage, profitability, repayment capacity, recommendation.
                  </span>
                </a>
              </div>
            </div>
          </section>
          {/* ============================================================
           SERVICES

           One section, not two. This page used to describe the three
           services near the top and then describe the same three
           again further down under "what you actually receive",
           which read as padding and made the page feel longer than
           its content. The description and the deliverables belong
           in the same card.
           ============================================================ */}
          <section id="services">
            <SectionLabel>What I do
            </SectionLabel>
            <p className="section-intro measure">
              Three services, one standard across them: the working file is the
          deliverable, the assumptions are visible, and nothing arrives locked.
        
            </p>
            <div className="grid-3">
              <div className="cell svc-card">
                <Chip>Financial modeling</Chip>
                <h3>A model you can edit
                </h3>
                <p>Three-statement models, DCF and comparable-company valuations,
              budgets and scenario models, built in Excel with a clean
              assumptions tab so you can change the inputs yourself.
                </p>
                <span className="svc-k mono">What you receive
                </span>
                <ul className="checks">
                  <li>One assumptions tab, colour-coded: blue inputs, black formulas, nothing hard-coded
                  </li>
                  <li>Three linked statements that balance, with the check row visible
                  </li>
                  <li>Scenario switch: base, upside, downside, without rebuilding anything
                  </li>
                  <li>Sensitivity tables on the two inputs that matter most
                  </li>
                  <li>A one-page summary a non-finance reader can follow
                  </li>
                  <li>A walkthrough call, so the model outlives the engagement
                  </li>
                </ul>
              </div>
              <div className="cell svc-card">
                <Chip>Data analysis</Chip>
                <h3>An answer, plus the working
                </h3>
                <p>Cleaning, analyzing and visualizing financial or business data in
              Python, R or Excel. Dashboards and summary decks that answer a
              specific question rather than displaying everything at once.
                </p>
                <span className="svc-k mono">What you receive
                </span>
                <ul className="checks">
                  <li>The question stated precisely before any code is written
                  </li>
                  <li>Cleaning steps documented: what was dropped, and why
                  </li>
                  <li>Commented Python or R you can re-run when the data updates
                  </li>
                  <li>Charts that survive being printed in black and white
                  </li>
                  <li>Findings written in sentences, with the caveats attached
                  </li>
                  <li>Raw outputs handed over, not just the pretty version
                  </li>
                </ul>
              </div>
              <div className="cell svc-card">
                <Chip>Finance writing</Chip>
                <h3>Copy that survives an expert reader
                </h3>
                <p>Explainers, market write-ups, research summaries and educational
              content. Accurate, sourced, and written in English or in everyday
              Bangla rather than textbook Bangla.
                </p>
                <span className="svc-k mono">What you receive
                </span>
                <ul className="checks">
                  <li>English or Bangla, in your house style
                  </li>
                  <li>Every factual claim sourced, with links in the draft
                  </li>
                  <li>Jargon either explained on first use or removed
                  </li>
                  <li>Structured for skim-reading: headings that carry meaning
                  </li>
                  <li>Two revision rounds included as standard
                  </li>
                  <li>Compliance-safe phrasing where a regulator might read it
                  </li>
                </ul>
              </div>
            </div>
          </section>
          {/* ============ HOW IT WORKS ============ */}
          <section>
            <SectionLabel>How it works
            </SectionLabel>
            <div className="path">
              <InfoCard chip="Step one" title="The brief"
                        dek={<>Send what you need with any files or examples, through
                          the <a href="/contact">contact form</a> or straight
                          to <a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a>. A
                          paragraph and a spreadsheet is enough to start.</>} />
              <InfoCard chip="Step two"
                        title="The quote"
                        dek="A reply within one business day with scope, a delivery date and a fixed price. The price does not move unless the scope does, so the estimate is my problem rather than yours." />
              <InfoCard chip="Step three"
                        title="Delivery"
                        dek="The working files (model, code or draft), a walkthrough of how they fit together, and one round of revisions included. Ownership transfers on final payment." />
            </div>
            <p className="note">
              Prefer the protection of a platform? I also take projects through Fiverr
          and Upwork.{" "}
              <a href="/contact">Get in touch
              </a> and I will share the
          current profile links.
        
            </p>
          </section>
          {/* ============================================================
           WHO IS DOING THE WORK

           New, and the largest gap this page had. A services page
           with no named credentials asks a stranger to send
           commercial data to an email address on trust. The detail
           lives on the About page; this is the short version, with
           the route there.
           ============================================================ */}
          <section id="who">
            <SectionLabel>Who does the work
            </SectionLabel>
            <div className="cred">
              <div className="cred-main">
                <h2>One person, start to finish, and I answer my own email.
                </h2>
                <p>
                  I am Rony Reiad. Economics at the University of Chittagong, then an
              MSc in Finance and Risk Management at the University of Brighton,
              finishing with an Upper Merit, and CFA Level 1 in the November 2026
              window. No agency, no account manager, no handoff to someone you
              have not spoken to.
            
                </p>
                <p>
                  Everything on this site is my own build: the case studies above, the
              calculators in the Tools hub, and a Bangla learning library that
              exists because financial education in Bangladesh usually fails
              people at the language step rather than the maths step. It is the
              closest thing to a work sample a first email can offer.
            
                </p>
                <p className="cred-links">
                  <a href="/about">The full background
                  </a>
                  <a href="https://www.linkedin.com/in/reiad" rel="noopener">LinkedIn
                  </a>
                  <a href="mailto:i@reiad.co.uk">i@reiad.co.uk
                  </a>
                </p>
              </div>
              <div className="cred-kit">
                <div className="cred-group">
                  <span className="cred-k mono">Modeling
                  </span>
                  <ul className="chips">
                    <li><Chip>Excel</Chip></li>
                    <li><Chip>Three-statement</Chip></li>
                    <li><Chip>DCF</Chip></li>
                    <li><Chip>Credit analysis</Chip></li>
                  </ul>
                </div>
                <div className="cred-group">
                  <span className="cred-k mono">Analysis
                  </span>
                  <ul className="chips">
                    <li><Chip>Python</Chip></li>
                    <li><Chip>R</Chip></li>
                    <li><Chip>Stata</Chip></li>
                    <li><Chip>SPSS</Chip></li>
                    <li><Chip>EViews</Chip></li>
                  </ul>
                </div>
                <div className="cred-group">
                  <span className="cred-k mono">Data
                  </span>
                  <ul className="chips">
                    <li><Chip>Bloomberg Terminal</Chip></li>
                    <li><Chip>DSE filings</Chip></li>
                    <li><Chip>Time-series</Chip></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          {/* ============ WHAT I NEED ============ */}
          <section>
            <SectionLabel>What makes a project go well
            </SectionLabel>
            <div className="rows">
              <div className="row">
                <span className="k mono">The real question
                </span>
                <span className="v">"Should we raise now or in six months" is a brief.
              "Build a model" is a shopping list. Tell me the decision the work has to
              support and the output usually gets simpler, not more complex.
                </span>
              </div>
              <div className="row">
                <span className="k mono">The messy data
                </span>
                <span className="v">Send it as it is: the export, the spreadsheet with three
              header rows, the PDF someone scanned. Cleaning is part of the job, and
              seeing the mess tells me things a tidied version hides.
                </span>
              </div>
              <div className="row">
                <span className="k mono">Who reads it
                </span>
                <span className="v">A model for your own team and a model going to a lender are
              different documents. Knowing the audience changes the structure, the
              level of detail, and how much gets said out loud versus assumed.
                </span>
              </div>
              <div className="row">
                <span className="k mono">The real deadline
                </span>
                <span className="v">Not the comfortable one. If something is going in front of a
              board on the 14th, that date shapes what's worth doing first.
                </span>
              </div>
            </div>
          </section>
          {/* ============ FAQ ============ */}
          <section>
            <SectionLabel>Before you ask
            </SectionLabel>
            <div className="stack measure">
              <details className="faq">
                <summary>How much does it cost?
                </summary>
                <p>Fixed price per project, quoted after the brief, not hourly, so the
               estimate is my problem rather than yours. Scope, delivery date and
               price come in one reply, and the price doesn't move unless the scope
               does. Send the brief and you'll have a number within a business day.
                </p>
              </details>
              <details className="faq">
                <summary>How long does it take?
                </summary>
                <p>It depends on the state of the data far more than on the size of the
               model. A clean three-statement build is days; the same job where the
               numbers arrive as scanned PDFs is weeks. The quote states a date, and
               if something threatens it you hear about it early rather than late.
                </p>
              </details>
              <details className="faq">
                <summary>Who owns the work?
                </summary>
                <p>You do: files, formulas, code, all of it, on final payment. No locked
               spreadsheets, no "contact me to unlock the assumptions tab". If I want
               to reference the work publicly I'll ask first, and anonymise if you'd
               rather.
                </p>
              </details>
              <details className="faq">
                <summary>Will you sign an NDA?
                </summary>
                <p>Yes, routinely, and I'd rather sign one than have you send a redacted
               brief that makes the work worse.
                </p>
              </details>
              <details className="faq">
                <summary>What won't you do?
                </summary>
                <p>I won't produce a valuation designed to reach a number decided in
               advance, write promotional copy dressed as independent research, or
               recommend specific securities to retail readers. Turning down that
               kind of work is the reason the rest of it is worth anything.
                </p>
              </details>
              <details className="faq">
                <summary>Can I see the code or the model first?
                </summary>
                <p>You already can. The case studies above are the samples: open
               one, drag the assumptions, download the CSV, read the notes on where
               each number came from. They run the same arithmetic a client build
               would, on companies and data small enough to publish. For work that
               sits under an NDA, ask and I'll walk you through a redacted example
               on a call.
                </p>
              </details>
            </div>
          </section>
          <Band
            label={"Next step"}
            title={"Send the brief: however rough it is"}
            actions={<>
              <ButtonLink kind="solid" onAccent href="/contact">{"Send a brief"}</ButtonLink>
              <ButtonLink kind="ghost" onAccent href="mailto:i@reiad.co.uk">{"i@reiad.co.uk"}</ButtonLink>
            </>}
          >
            <p>{"A paragraph and a spreadsheet is plenty to start. You'll get scope, a delivery date and a fixed price back within one business day, with no obligation and no sales sequence."}</p>
          </Band>
        </div>
      </main>
  );
}
