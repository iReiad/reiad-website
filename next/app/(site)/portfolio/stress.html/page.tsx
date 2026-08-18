/* ============================================================
   /portfolio/stress.html

   Ported out of `aab/portfolio/stress.html` with archive/TRANSITION.md Stage 11.3,
   words unchanged: this is one of the seven case studies.

   The numbers are not here and must not be. Every figure on this
   page is computed in the browser by `/portfolio/stress.js`
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
import { StatTile } from "../../../../components/ui/stat";
import { Eyebrow, SectionLabel } from "../../../../components/ui/label";

export const metadata: Metadata = pageMeta({
  path: "/portfolio/stress.html",
  title: "Portfolio stress testing · Merton and vintage analysis · Reiad's Library",
  description: "A working credit stress test: macro shocks driving probability of default through a Merton model and a vintage hazard model at once, then loss given default, IFRS 9 provisions and the capital ratio, live in the browser.",
  ogTitle: "Portfolio stress testing: Merton and vintage analysis",
  ogDescription: "Macro shocks driving default rates through two engines at once, then provisions and capital. Every number recomputes in the browser.",
  card: "stress",
});

export default function Page() {
  return (

      <main id="main">
        <div className="wrap">
          <div className="hero">
            <Eyebrow>Case study · Credit risk · Stress testing
            </Eyebrow>
            <h1>What a recession does to a loan book, from the macro path to the capital ratio.
            </h1>
            <p className="lede">
              Unemployment, growth, rates, the exchange rate and collateral prices go in.
          Default rates, provisions and the capital ratio come out, through a Merton
          model and a vintage hazard model running side by side on the same book. The
          gap between the two is on the page, because that gap is the model risk, and
          a stress test that reports one number has not measured less uncertainty, it
          has just stopped showing it.
        
            </p>
            <p className="model-co">
              <strong id="co-name">–
              </strong>
              <span className="mono" id="co-unit">–
              </span>
            </p>
            <p className="note note-inline" id="co-note">–
            </p>
          </div>
          <nav className="page-toc" id="page-toc" aria-label="On this page" />
          <section id="stress" className="model">
            <div className="model-bar">
              <div className="scenarios" role="group" aria-label="Scenario">
                <button className="scenario" type="button" data-scenario="base" aria-pressed="false">Base
                </button>
                <button className="scenario" type="button" data-scenario="adverse" aria-pressed="true">Adverse
                </button>
                <button className="scenario" type="button" data-scenario="severe" aria-pressed="false">Severely adverse
                </button>
              </div>
              <p className="scenario-blurb" id="scenario-blurb">–
              </p>
              <div className="model-actions">
                <Button kind="ghost" id="download-csv">Download CSV
                </Button>
                <Button kind="ghost" id="copy-link">Copy this run's link
                </Button>
              </div>
            </div>
            {/* ============ THE ANSWER ============ */}
            <div className="verdict-card" id="verdict" data-state="up" role="status">
              <div className="verdict-main">
                <span className="mono">CET1 ratio at the trough
                </span>
                <strong className="verdict-value">–
                </strong>
              </div>
              <p className="verdict-detail">–
              </p>
            </div>
            <div className="tiles">
              <StatTile label="Scenario severity"
                        note="Standard deviations from normal, at the worst quarter"
                        fills="severity" />
              <StatTile label="Peak default rate"
                        note={<>Whole book, annualised, against <span id="tile-pd-base">– </span> today</>}
                        fills="pd" />
              <StatTile label="Three-year credit loss"
                        note="Cumulative, as a share of exposure"
                        fills="loss" />
              <StatTile label="Peak provision charge"
                        note="In one quarter, BDT crore"
                        fills="charge" />
              <StatTile label="Peak stage 2"
                        note="Of the performing book, on lifetime allowance"
                        fills="stage2" />
              <StatTile label="Headroom at the trough"
                        note="Against the 7.0% requirement"
                        fills="headroom" />
            </div>
            <div className="model-body">
              <aside className="model-drivers">
                <div className="drivers-head">
                  <h2>Inputs
                  </h2>
                  <button className="chip" type="button" id="reset-drivers" hidden>Reset
                  </button>
                </div>
                <p className="drivers-note">Everything below recomputes the whole twelve-quarter
              path across seven segments. Moving a scenario slider stops it being one of
              the three named scenarios, which is the point of having sliders.
                </p>
                <div className="method-row">
                  <span className="mono">Engine
                  </span>
                  <div className="segmented" role="group" aria-label="Which engine drives the default rate">
                    <button type="button" data-engine="merton" aria-pressed="true">Merton
                    </button>
                    <button type="button" data-engine="vintage" aria-pressed="false">Vintage
                    </button>
                  </div>
                </div>
                <div className="method-row">
                  <span className="mono">Risk weights on
                  </span>
                  <div className="segmented" role="group" aria-label="Which probability of default drives the risk weights">
                    <button type="button" data-basis="ttc" aria-pressed="false">Long-run
                    </button>
                    <button type="button" data-basis="hybrid" aria-pressed="true">Hybrid
                    </button>
                    <button type="button" data-basis="pit" aria-pressed="false">Point in time
                    </button>
                  </div>
                </div>
                <div id="drivers" />
              </aside>
              <div className="model-charts">
                <figure className="chart-card">
                  <figcaption>
                    <strong>The capital ratio through the scenario
                    </strong>
                    <span className="mono">CET1, against the 7.0% requirement
                    </span>
                  </figcaption>
                  <div id="capital-chart" />
                  <p className="statement-note" id="capital-note">–
                  </p>
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>The scenario
                    </strong>
                    <span className="mono">dotted is where it started
                    </span>
                  </figcaption>
                  <div className="macro-grid" id="macro-charts" />
                </figure>
              </div>
            </div>
            {/* ============ 1 · THE BOOK ============ */}
            <section className="statement" id="sec-book" data-toc="The book">
              <h2>The book being tested
              </h2>
              <p className="prose">Seven segments, because the whole exercise turns on them
            behaving differently. A mortgage and a credit card do not default for the
            same reason, do not recover the same way afterwards, and do not attract the
            same capital, and a stress test run on a single portfolio-average borrower
            gets all three of those wrong at once.
              </p>
              <div className="table-scroll" id="book-table" />
              <p className="statement-note">Correlation is Basel's, by exposure class: fixed at
            0.15 for mortgages and 0.04 for revolving retail, and a function of the
            default rate for everything else. It is the share of a borrower's fortunes
            that is the economy's rather than its own, and it is what decides whether a
            bad year is a bad year for one borrower or for all of them at once.
              </p>
            </section>
            {/* ============ 2 · MACRO TO PD ============ */}
            <section className="statement" id="sec-merton" data-toc="Macro to default rate">
              <h2>From a macro path to a default rate
              </h2>
              <p className="prose">A borrower defaults when what it owns is worth less than what
            it owes. Write the change in what it owns as one piece everybody shares and
            one piece that is its own:
              </p>
              <p className="formula mono">A
                <sub>i
                </sub> = √ρ · Z + √(1 − ρ) · ε
                <sub>i
                </sub>
              </p>
              <p className="prose">Z is the economy, in standard deviations. Default is
            A
                <sub>i
                </sub> falling below a threshold, and the threshold that reproduces a
            long-run default rate PD is Φ⁻¹(PD). Hold Z fixed and ask what fraction
            defaults, and the whole model is one line:
              </p>
              <p className="formula mono">PD(Z) = Φ[ (Φ⁻¹(PD) − √ρ · Z) / √(1 − ρ) ]
              </p>
              <p className="prose">So the entire macro half of a stress test is the job of
            turning six economic series into one number, Z. Here each variable's
            distance from where it started is divided by its own standard deviation and
            weighted by what that variable does to that segment. The weights sum to one,
            which fixes the scale: a scenario where everything is two standard
            deviations bad is a shock of exactly two, in every segment. Segments differ
            in which variables hurt them, not in how loudly a shock speaks.
              </p>
              <div className="callout">
                <span className="mono">The starting point is not zero
                </span>
                <p>The long-run average default rate is not the rate of a typical year. Default
              rates are right-skewed: a few terrible years pull the average above the
              median, so the year that actually produces the average rate is already a
              mildly bad one, at 
                  <strong id="anchor-value">–
                  </strong> on this scale.
              Starting a stress test from Z = 0 quietly assumes the book is currently
              running better than its own long-run experience, and the base case then
              shows provision releases in a year where nothing has happened. That was
              the first version of this model, and the base case printing a profit is
              what gave it away.
                </p>
              </div>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Default rate by segment
                  </strong>
                  <span className="mono">annualised, point in time
                  </span>
                </figcaption>
                <div id="pd-chart" />
                <p className="statement-note" id="pd-note">–
                </p>
              </figure>
            </section>
            {/* ============ 3 · VINTAGE ============ */}
            <section className="statement" id="sec-vintage" data-toc="Vintage analysis">
              <h2>The same question, asked from the book instead
              </h2>
              <p className="prose">The second engine never mentions asset values. It says a
            loan's default rate depends on how old it is, which cohort wrote it, and
            what the economy is doing now:
              </p>
              <p className="formula mono">hazard(age, vintage, t) = lifecycle(age) · quality(vintage) · e
                <sup>γ·s
                </sup>
              </p>
              <p className="prose">Loans default on a hump: quiet in the first months, worst
            somewhere between one and three years depending on the product, tailing off
            after. A book written in a boom is a worse book and stays worse for its whole
            life. Both of those come off the book itself and neither is a forecast; only
            the last term is.
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Cumulative default rate by months on book
                  </strong>
                  <span className="mono" id="vintage-seg-label">–
                  </span>
                </figcaption>
                <div className="vintage-controls" id="vintage-picker" role="group" aria-label="Which segment" />
                <div id="vintage-chart" />
                <p className="statement-note">Solid to today, dashed after: the dashed half is this
              scenario, not a record of anything. The lines separate before the scenario
              starts, which is the cohort effect and not the macro one: the 2022 book was
              written into a boom at looser standards and it is still paying for it.
                </p>
              </figure>
            </section>
            {/* ============ 4 · THE TWO ENGINES ============ */}
            <section className="statement" id="sec-engines" data-toc="Where the two disagree">
              <h2>Where the two engines disagree, and why that is the finding
              </h2>
              <p className="prose">The two links are tied together at two points: no shock at
            all, and a one-standard-deviation shock. Everything they do after that comes
            from the shape of the link and nothing else, a probit against a log. The log
            has no ceiling and the probit does, so past two standard deviations the
            hazard model is the more pessimistic of the pair.
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Portfolio default rate, both engines
                  </strong>
                  <span className="mono">
                    <i className="key key-merton" />Merton 
                    <i className="key key-vintage" />Vintage hazard
                  </span>
                </figcaption>
                <div id="engine-chart" />
                <p className="statement-note" id="engine-note">–
                </p>
              </figure>
              <div className="callout">
                <span className="mono">Two different disagreements
                </span>
                <p id="engine-callout">–
                </p>
              </div>
            </section>
            {/* ============ 5 · LGD AND EAD ============ */}
            <section className="statement" id="sec-loss" data-toc="Loss and exposure">
              <h2>Loss given default is not a constant, and neither is exposure
              </h2>
              <p className="prose">A lender that can seize collateral worth C against an exposure
            of 1 loses max(0, 1 − C net of selling costs). That is a put option struck at
            the exposure, so the loss given default of a secured segment is the expected
            value of a put across borrowers whose coverage varies:
              </p>
              <p className="formula mono">LGD = Φ(−d₂) − F · Φ(−d₁),  d₁ = (ln F + σ²/2) / σ,  d₂ = d₁ − σ
              </p>
              <p className="prose">The level is not the interesting part, since σ is solved so
            that the formula reproduces each segment's stated loss given default when
            prices have not moved. The shape is. A well-secured book has a low delta: the
            first few per cent off collateral cost almost nothing, because the cushion
            absorbs them. Keep going and the loss accelerates, into exactly the quarter
            the default rate is peaking. Holding loss given default constant through a
            stress test is holding an option's value fixed while its underlying moves.
              </p>
              <div className="grid-2">
                <figure className="chart-card">
                  <figcaption>
                    <strong>Loss given default against collateral prices
                    </strong>
                    <span className="mono">the option, and where this scenario sits on it
                    </span>
                  </figcaption>
                  <div id="lgd-chart" />
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>Default rate and loss given default, together
                    </strong>
                    <span className="mono">both rise in the same quarter
                    </span>
                  </figcaption>
                  <div id="whammy-chart" />
                </figure>
              </div>
              <p className="statement-note">Exposure moves too. A borrower heading for default
            draws what is still available on a revolving line first, so the exposure at
            default on cards, working capital and corporate limits is above the balance
            showing today. That is what the credit conversion factor is for, and it is
            the one input in a stress test that is reliably underestimated because it
            cannot be seen on the balance sheet at all.
              </p>
            </section>
            {/* ============ 6 · IFRS 9 ============ */}
            <section className="statement" id="sec-ifrs9" data-toc="The provision cliff">
              <h2>IFRS 9, and the cliff nobody put there on purpose
              </h2>
              <p className="prose">Under IFRS 9 a performing loan carries twelve months of
            expected loss until its credit risk has increased significantly, at which
            point it carries the loss expected over its whole remaining life. For a
            five-year mortgage that is a step change of several times, applied to a loan
            that has not missed a payment.
              </p>
              <p className="prose">The share of a book that has crossed the line is not assumed
            here, it is derived. Individual loans deteriorate by different amounts around
            the segment average; take the spread as lognormal and the share past a
            trigger is one evaluation of Φ:
              </p>
              <p className="formula mono">stage 2 share = Φ[ (ln R − ln k) / σ ]
              </p>
              <p className="prose">R is how far the average loan's default rate has risen and k
            is the trigger. When R reaches k, half the book moves at once. That is the
            cliff, and it falls out of the arithmetic rather than being put in by hand.
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>The book by stage, and what it costs
                  </strong>
                  <span className="mono">
                    <i className="key key-stage1" />Stage 1 
                    <i className="key key-stage2" />Stage 2 
                    <i className="key key-stage3" />Stage 3
                  </span>
                </figcaption>
                <div id="stage-chart" />
                <p className="statement-note" id="stage-note">–
                </p>
              </figure>
              <p className="statement-note">Two conventions worth stating, because they move the
            answer more than most of the sliders. Lifetime probability of default follows
            the scenario for as long as the scenario runs and then reverts to the
            long-run rate, rather than holding today's stressed rate flat for five years:
            assuming a recession lasts forever is not prudence, it is a different
            forecast, and it roughly doubled the peak charge when this model did it. And
            the allowance is undiscounted, which overstates it by a few per cent.
              </p>
            </section>
            {/* ============ 7 · CAPITAL ============ */}
            <section className="statement" id="sec-capital" data-toc="Capital">
              <h2>Capital: losses, and the same loans measured as riskier
              </h2>
              <p className="prose">The capital requirement is not a different model. It is this
            one, read at a fixed severity:
              </p>
              <p className="formula mono">K = LGD · Φ[(Φ⁻¹(PD) + √ρ · Φ⁻¹(0.999)) / √(1 − ρ)] − PD · LGD
              </p>
              <p className="prose">which is the conditional default rate at Z = −3.09, the
            economy a one-in-a-thousand year would produce, less the expected loss that
            provisions are already meant to cover. Capital is for the difference. So the
            capital rule and the stress test are the same equation read at two
            severities, and this scenario can be placed on the same axis as the rule.
              </p>
              <div className="grid-2">
                <figure className="chart-card">
                  <figcaption>
                    <strong>This scenario against the capital rule
                    </strong>
                    <span className="mono">the same severity axis
                    </span>
                  </figcaption>
                  <div id="severity-chart" />
                  <p className="statement-note" id="severity-note">–
                  </p>
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>Why the ratio moved
                    </strong>
                    <span className="mono">basis points, at the trough
                    </span>
                  </figcaption>
                  <div id="attrib-chart" />
                  <p className="statement-note" id="attrib-note">–
                  </p>
                </figure>
              </div>
              <div className="callout">
                <span className="mono">Which PD belongs in a risk weight
                </span>
                <p>Basel's probabilities of default are meant to be long-run averages, so on a
               strict reading a risk weight should not move with the cycle at all: only
               the downturn loss given default should. In practice ratings migrate, so
               measured default rates do rise in a downturn and risk weights rise with
               them, and the same loans, unchanged, consume half as much capital again.
               That is the procyclicality argument, and it is a switch above rather than a
               buried assumption because the gap between the three settings is a result.
                </p>
                <p className="statement-note" id="basis-note">–
                </p>
              </div>
            </section>
            {/* ============ 8 · REVERSE STRESS ============ */}
            <section className="statement" id="sec-reverse" data-toc="What would break it">
              <h2>The question a supervisor actually asks
              </h2>
              <p className="prose">Not "what happens in this scenario". That one has an answer
            above. The harder question is which scenario breaks the bank, and it is
            answered by inverting the model rather than running it: bisect on the
            severity of the whole macro path until the capital ratio lands exactly on the
            requirement.
              </p>
              <div className="verdict-card" id="reverse" data-state="up">
                <div className="verdict-main">
                  <span className="mono">Breaks at
                  </span>
                  <strong className="verdict-value">–
                  </strong>
                </div>
                <p className="verdict-detail">–
                </p>
              </div>
              <p className="statement-note">Stated in unemployment because that is the variable
            people have an intuition about, but the multiple applies to the whole path:
            growth, rates, inflation, the exchange rate and collateral prices all move
            with it. A reverse stress test that moves one variable alone finds a much
            larger number and a much less useful one.
              </p>
            </section>
            {/* ============ 9 · SENSITIVITY ============ */}
            <section className="statement" id="sec-sensitivity" data-toc="What drives the answer">
              <h2>What is actually driving the answer
              </h2>
              <div className="grid-2">
                <figure className="chart-card">
                  <figcaption>
                    <strong>One variable at a time
                    </strong>
                    <span className="mono">three-year loss, BDT crore
                    </span>
                  </figcaption>
                  <div id="tornado-chart" />
                  <p className="statement-note" id="tornado-note">–
                  </p>
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>Trough capital ratio
                    </strong>
                    <span className="mono">unemployment against transmission
                    </span>
                  </figcaption>
                  <div className="table-scroll" id="sensitivity" />
                  <p className="statement-note">Green passes the 7.0% requirement, amber fails it.
                Every cell is a complete twelve-quarter run over all seven segments, not
                an interpolation between the corners. Click one to adopt it.
                  </p>
                </figure>
              </div>
            </section>
            {/* ============ 10 · BRING YOUR OWN BOOK ============ */}
            <div className="csv-panel" id="csv-drop">
              <div className="csv-head">
                <h2>Run this on a real book
                </h2>
                <p>Five columns: a segment name, exposure, probability of default, loss given
               default, and which of the four Basel treatments it takes. Percentages or
               decimals, either way. Everything else, the macro sensitivities, the
               seasoning curve, the vintage mix, comes from the shipped segment of the
               same kind. 
                  <strong>Nothing is uploaded
                  </strong>: the parsing and the model
               run in your browser, and the file never leaves your machine.
                </p>
              </div>
              <div className="csv-controls">
                <label className="btn btn-ghost csv-file-label">
                  Choose a CSV
              
                  <input type="file" id="csv-file" accept=".csv,.txt,text/csv" hidden />
                </label>
                <span className="mono">or drag one here, or paste below
                </span>
                <Button kind="ghost" id="csv-reset" hidden>Back to the shipped book</Button>
              </div>
              <label className="csv-paste-label">
                <span className="mono">Paste rows
                </span>
                <textarea id="csv-paste" rows={3} spellCheck="false" placeholder={"Mortgages,5000,0.9%,25%,mortgage\nCredit cards,800,7.5%,80%,card\nCorporate,12500,2.1%,35%,corporate"} />
              </label>
              <p className="csv-status" id="csv-status" />
            </div>
            {/* ============ 11 · LIMITS ============ */}
            <section className="statement" id="sec-limits" data-toc="What this is not">
              <h2>What this is not, ranked by how much it matters
              </h2>
              <div className="method-steps">
                <div className="method-step">
                  <span className="mono">1 · The transmission is the weak point
                  </span>
                  <h3>Six weights, and no regression behind them
                  </h3>
                  <p>In a real engagement the macro weights come from a regression of segment
                 default rates on macro series, with the diagnostics attached and the
                 out-of-sample record shown. Here they are set by hand to sensible values.
                 That is the honest weak point of the whole page, and it is why the
                 transmission dial is the first slider rather than a hidden constant.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">2 · One factor, not many
                  </span>
                  <h3>Everything correlated through a single Z
                  </h3>
                  <p>A one-factor model cannot express a shock that hits construction and
                 spares textiles. Segments differ in their sensitivity here but not in
                 what they are sensitive to, so a genuinely sectoral scenario needs a
                 multi-factor version of the same arithmetic.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">3 · The balance sheet is static
                  </span>
                  <h3>The bank does not react
                  </h3>
                  <p>It does not shrink the book, sell a portfolio, cut costs, raise equity or
                 stop lending. That is the supervisory convention, and it makes this a test
                 of the book rather than a forecast of the business. Management actions are
                 what the second half of a real exercise is about, and they belong in a
                 separate layer rather than mixed into this one.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">4 · The book is synthetic
                  </span>
                  <h3>Composite in shape, nobody's filed accounts
                  </h3>
                  <p>The segment mix, default rates, collateral coverage and capital position
                 are in the region a mid-sized private commercial bank occupies. They are
                 not any bank's numbers, which is why the CSV panel exists: the method is
                 the part that transfers.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">5 · Credit only
                  </span>
                  <h3>No market, operational or liquidity risk
                  </h3>
                  <p>A real exercise adds trading losses, operational risk events and a funding
                 squeeze, and in an emerging market the funding squeeze is often the part
                 that actually arrives first. This page stops at the loan book.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">6 · The capital walk is simplified
                  </span>
                  <h3>Deferred tax, minorities and Tier 2 left out
                  </h3>
                  <p>Only common equity and the credit charge move. A real capital plan carries
                 deferred tax assets whose recognition changes exactly when it hurts, and
                 an add-back for provisions above expected loss that softens the fall.
                  </p>
                </div>
              </div>
            </section>
          </section>
          {/* ============ HOW IT'S BUILT ============ */}
          <section>
            <SectionLabel>How this is built
            </SectionLabel>
            <div className="principles">
              <div className="principle">
                <h3>Two engines, kept honest by each other
                </h3>
                <p>A structural model and a hazard model, calibrated to agree at two points
               and left to diverge everywhere else. Where they part company is where
               the answer stops being a fact and starts being a modelling choice, and
               that number is printed rather than picked between.
                </p>
              </div>
              <div className="principle">
                <h3>The capital rule is the same equation
                </h3>
                <p>The IRB formula is this model read at a one-in-a-thousand year economy.
               Building both out of one function means the scenario can be placed on the
               same severity axis as the rule that sets the requirement, instead of
               being described as "severe" and left there.
                </p>
              </div>
              <div className="principle">
                <h3>Loss given default is an option
                </h3>
                <p>Recovering out of collateral is a put struck at the exposure, so a price
               fall bites slowly and then quickly. The dispersion is solved to reproduce
               each segment's stated loss given default at today's prices, so the level
               is preserved and only the response to the scenario is modelled.
                </p>
              </div>
              <div className="principle">
                <h3>The provision cliff is derived
                </h3>
                <p>The share of the book on lifetime allowance comes out of a distribution
               of loan-level deterioration against a trigger, which is one evaluation of
               Φ. Nothing about the cliff is asserted, which is why it moves properly
               when the trigger or the spread moves.
                </p>
              </div>
              <div className="principle">
                <h3>Reversible, not just runnable
                </h3>
                <p>Bisecting the whole model to find the scenario that lands exactly on the
               requirement is the question a supervisor asks and a board understands. It
               costs forty full runs of the model and returns in under a tenth of a
               second, which is the argument for a DOM-free engine.
                </p>
              </div>
              <div className="principle">
                <h3>168 checks on the engine
                </h3>
                <p>Basel's own published risk weights, the normal distribution against
               printed quantiles, the conditional default rate integrated over the cycle
               to see whether it gives the long-run rate back, exposure conservation, the
               provision identity, and the reverse stress test put back through the model
               to see whether it lands where it said it would.
                </p>
              </div>
            </div>
          </section>
          <div className="note">
            A synthetic loan book, composite in shape rather than copied from any bank's
        accounts, and not a forecast of, or advice about, any institution or security.
        The scenarios are illustrative and are not anyone's published projections. What
        is on display is the method: the same structure I build for a real book, with a
        client's own segments, their own macro history and their own capital position.
      
          </div>
          <Band
            label={"Working together"}
            title={"Need a stress test that survives a supervisor?"}
            actions={<>
              <ButtonLink kind="solid" onAccent href="/contact.html">{"Start a conversation"}</ButtonLink>
              <ButtonLink kind="ghost" onAccent href="/portfolio.html">{"Back to the portfolio"}</ButtonLink>
            </>}
          >
            <p>{"Scenario design, PD and LGD modelling, IFRS 9 staging, capital projection and reverse stress testing, in Excel or Python, with the assumptions in one place and every convention stated on the page rather than in a footnote."}</p>
          </Band>
        </div>
      </main>
  );
}
