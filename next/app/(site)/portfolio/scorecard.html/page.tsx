/* ============================================================
   /portfolio/scorecard.html

   Ported out of `aab/portfolio/scorecard.html` with TRANSITION.md Stage 11.3,
   words unchanged: this is one of the seven case studies.

   The numbers are not here and must not be. Every figure on this
   page is computed in the browser by `/portfolio/scorecard.js`
   from the `.model.js` and `.data.js` files beside it, which stay
   exactly where they are with their tests running on every
   commit. What moved is the page around the numbers, which is the
   whole of section 2b's rule about the case studies: their value
   is that the figures are right and provably unchanged, so they
   are the last thing a port is allowed to touch.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";

export const metadata: Metadata = pageMeta({
  path: "/portfolio/scorecard.html",
  title: "Probability of default: scorecard vs gradient boosting · Reiad's Library",
  description: "A full PD modelling pipeline on a real public dataset: logistic regression and gradient boosting fitted live in the browser, with cross-validation, DeLong's test, calibration, the cost of a cut-off, and the fair-lending question.",
  ogTitle: "Probability of default: scorecard vs gradient boosting",
  ogDescription: "The full pipeline on a real public dataset, fitted live in the browser: two models, cross-validated, and an honest answer about which one wins.",
  card: "scorecard",
});

export default function Page() {
  return (

      <main id="main">
        <div className="wrap">
          <div className="hero" style={{ paddingBlock: "56px 26px" }}>
            <span className="eyebrow mono">Case study · Credit risk · Machine learning
            </span>
            <h1>A probability-of-default model, and an honest answer about whether the clever one wins.
            </h1>
            <p className="lede">
              The whole pipeline on a real public dataset, fitted in your browser while
          you read: split, encode, a logistic scorecard, a gradient-boosted ensemble,
          cross-validation, calibration, and the cut-off where the modelling stops
          and the lending decision starts. Nothing here is precomputed. Move the
          split seed and every number on the page is refitted, which is the fastest
          way to see how much of a result on a thousand rows is real.
        
            </p>
            <p className="model-co">
              <strong id="data-name">–
              </strong>
              <span className="mono" id="data-meta">–
              </span>
            </p>
            <p className="note note-inline" id="data-note">–
            </p>
          </div>
          <nav className="page-toc" id="page-toc" aria-label="On this page" />
          <section id="pd" className="model">
            <div className="model-bar">
              <div className="scenarios" role="group" aria-label="Which model leads the page">
                <button className="scenario" type="button" data-model="logit" aria-pressed="true">Scorecard
                </button>
                <button className="scenario" type="button" data-model="gbm" aria-pressed="false">Boosted
                </button>
              </div>
              <p className="scenario-blurb" id="model-blurb">–
              </p>
              <div className="model-actions">
                <button className="btn btn-ghost" type="button" id="download-csv">Download CSV
                </button>
                <button className="btn btn-ghost" type="button" id="copy-link">Copy this run's link
                </button>
              </div>
            </div>
            {/* ============ THE ANSWER ============ */}
            <div className="verdict-card" id="verdict" data-state="up" role="status">
              <div className="verdict-main">
                <span className="mono">Boosted minus scorecard, test AUC
                </span>
                <strong className="verdict-value">–
                </strong>
              </div>
              <p className="verdict-detail">–
              </p>
            </div>
            <div className="tiles">
              <div className="tile" data-tile="auc-logit">
                <span className="mono">Scorecard AUC
                </span>
                <strong className="tile-value">–
                </strong>
                <small>Held-out applicants, 
                  <span id="test-n">–
                  </span> of them
                </small>
              </div>
              <div className="tile" data-tile="auc-gbm">
                <span className="mono">Boosted AUC
                </span>
                <strong className="tile-value">–
                </strong>
                <small>Same applicants, same split
                </small>
              </div>
              <div className="tile" data-tile="ks">
                <span className="mono">KS
                </span>
                <strong className="tile-value">–
                </strong>
                <small>The separation credit teams quote
                </small>
              </div>
              <div className="tile" data-tile="cost">
                <span className="mono">Cost per applicant
                </span>
                <strong className="tile-value">–
                </strong>
                <small>At your cut-off, on the dataset's 5:1 matrix
                </small>
              </div>
              <div className="tile" data-tile="approval">
                <span className="mono">Approval rate
                </span>
                <strong className="tile-value">–
                </strong>
                <small>What the cut-off actually does
                </small>
              </div>
              <div className="tile" data-tile="brier">
                <span className="mono">Brier score
                </span>
                <strong className="tile-value">–
                </strong>
                <small>Whether the probability means anything
                </small>
              </div>
            </div>
            <div className="model-body">
              <aside className="model-drivers">
                <div className="drivers-head">
                  <h2>Inputs
                  </h2>
                  <button className="chip" type="button" id="reset-drivers" hidden>Reset
                  </button>
                </div>
                <p className="drivers-note">Everything below refits both models from scratch on
              your machine. The cut-off is the exception: it changes the decision, not
              the model, so it responds instantly.
                </p>
                <div className="method-row">
                  <span className="mono">Protected attributes
                  </span>
                  <button className="toggle" type="button" id="use-protected" aria-pressed="true">Included
                  </button>
                </div>
                <div className="method-row">
                  <span className="mono">Boosted scores
                  </span>
                  <button className="toggle" type="button" id="calibrate" aria-pressed="true">Recalibrated
                  </button>
                </div>
                <div id="drivers" />
              </aside>
              <div className="model-charts">
                <figure className="chart-card">
                  <figcaption>
                    <strong>ROC on the held-out applicants
                    </strong>
                    <span className="mono">
                      <i className="key key-logit" />Scorecard 
                      <i className="key key-gbm" />Boosted
                    </span>
                  </figcaption>
                  <div id="roc-chart" />
                  <p className="statement-note" id="roc-note">–
                  </p>
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>Where the two models disagree about an applicant
                    </strong>
                    <span className="mono">one dot per held-out applicant
                    </span>
                  </figcaption>
                  <div id="scatter-chart" />
                  <p className="statement-note" id="scatter-note">–
                  </p>
                </figure>
              </div>
            </div>
            {/* ============ 1 · THE DATA ============ */}
            <section className="statement" id="sec-data" data-toc="The data">
              <h2>The data, and what is wrong with it
              </h2>
              <p className="prose">A thousand loan applications from a German bank, twenty
            attributes each, labelled good or bad. It is the most-used credit dataset
            in teaching, which is the reason to use it and also the reason to be
            careful with it: everything below is a demonstration of method on a set
            that no longer describes any real lending market.
              </p>
              <div className="rows" id="data-facts" />
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Information value, before any model is fitted
                  </strong>
                  <span className="mono">training rows only
                  </span>
                </figcaption>
                <div id="iv-chart" />
                <p className="statement-note" id="iv-note">–
                </p>
              </figure>
              <p className="statement-note">Information value is the first thing a credit
            analyst computes and the last thing a machine-learning course mentions.
            It measures how far an attribute separates the two outcomes, on its own,
            with no model in the way, and the industry has read it off the same
            thresholds for thirty years: under 0.02 useless, 0.1 weak, 0.3 medium,
            above 0.5 strong enough that the honest first reaction is to check for
            leakage rather than to celebrate.
              </p>
            </section>
            {/* ============ 2 · THE PIPELINE ============ */}
            <section className="statement" id="sec-pipeline" data-toc="The pipeline">
              <h2>The pipeline, in the order that matters
              </h2>
              <div className="method-steps">
                <div className="method-step">
                  <span className="mono">1 · Split
                  </span>
                  <h3>Before anything else touches the data
                  </h3>
                  <p>Stratified, so both halves carry the same 30% default rate, and seeded,
                 so it is the same split for every reader. A slice of the training rows
                 is held back again for the boosting curve and the calibration, which
                 keeps the test set for one job only.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">2 · Encode
                  </span>
                  <h3>Learned on the training rows, applied to the test rows
                  </h3>
                  <p>Each category becomes a column, except the two the documentation lists
                 and the data never contains. The scorecard drops one level per attribute
                 as its reference and standardises the numbers; the trees take the raw
                 values, because a split point does not care about scale.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">3 · Fit
                  </span>
                  <h3>Two models, the same columns
                  </h3>
                  <p>Newton's method for the scorecard, second-order gradient boosting for
                 the ensemble. Neither sees a test row.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">4 · Calibrate
                  </span>
                  <h3>A ranking is not yet a probability
                  </h3>
                  <p>Boosted scores rank well and lie about the level. The mapping that fixes
                 that is fitted on held-out rows, because fitting it in-sample makes the
                 answer worse in a way that only shows up later.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">5 · Decide
                  </span>
                  <h3>The cut-off is an economic choice
                  </h3>
                  <p>No amount of AUC picks it. The dataset's own cost matrix does: lending
                 to a bad applicant is stated to be five times as expensive as turning
                 away a good one.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">6 · Check
                  </span>
                  <h3>Whether the difference was real
                  </h3>
                  <p>Cross-validation and DeLong's test, because a single split of 300
                 applicants measures an AUC to about three points, and both models are
                 well inside that of each other.
                  </p>
                </div>
              </div>
              <div className="callout">
                <span className="mono">The leak that does not announce itself
                </span>
                <p>Standardise, bin, or compute weights of evidence on all thousand rows
               before splitting, and the test AUC comes out higher than the model
               deserves. Nothing errors. The number just quietly includes a little
               knowledge of the applicants it was supposed to be surprised by, and the
               model underperforms in production for reasons nobody can reconstruct.
               Every fitted quantity on this page is learned inside the training set,
               which is why the encoder is refitted on every fold rather than once.
                </p>
              </div>
            </section>
            {/* ============ 3 · THE SCORECARD ============ */}
            <section className="statement" id="sec-scorecard" data-toc="The scorecard">
              <h2>Model one: the scorecard
              </h2>
              <p className="prose">Logistic regression, fitted by iteratively reweighted least
            squares, which is Newton's method on the log-likelihood:
              </p>
              <p className="formula mono">ln( p / (1 − p) ) = β₀ + β₁x₁ + … + βₖxₖ
              </p>
              <p className="prose">Every coefficient is a log odds ratio against its reference
            level, every one has a standard error from the inverse of the Hessian, and
            the whole thing converts into a points table where the odds double every
            twenty points. That last part is not decoration: a scorecard is what lets a
            lender tell a declined applicant which two things cost them the most, which
            in most places that lend money is a legal requirement rather than a
            courtesy.
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Coefficients, largest effect first
                  </strong>
                  <span className="mono">log odds against the reference level, with 95% intervals
                  </span>
                </figcaption>
                <div id="coef-chart" />
                <p className="statement-note" id="coef-note">–
                </p>
              </figure>
              <div className="table-scroll" id="points-table" />
              <p className="statement-note">A ridge is on by default. Without it, a category
            where every applicant happened to default sends its coefficient to
            infinity, which is called complete separation and looks from the outside
            exactly like a very confident model.
              </p>
            </section>
            {/* ============ 4 · THE BOOSTED MODEL ============ */}
            <section className="statement" id="sec-boosted" data-toc="Gradient boosting">
              <h2>Model two: gradient boosting
              </h2>
              <p className="prose">The algorithm XGBoost and LightGBM implement, written out
            rather than imported, because a page served as static files cannot run a
            C++ library. Each tree fits the errors of the ones before it, using the
            second-order approximation to the loss. A split is worth taking when
              </p>
              <p className="formula mono">gain = ½ [ G²ₗ/(Hₗ+λ) + G²ᵣ/(Hᵣ+λ) − G²/(H+λ) ] − γ
              </p>
              <p className="prose">is positive, and the value that lands in a leaf is
            −G/(H+λ), where G and H are the sums of the gradient and the curvature of
            the loss over the rows that reach it. Features are pre-binned into a
            histogram before any tree is grown, which is the trick that makes LightGBM
            fast and costs nothing to do here.
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>The learning curve
                  </strong>
                  <span className="mono">
                    <i className="key key-train" />Training 
                    <i className="key key-valid" />Held-out slice
                  </span>
                </figcaption>
                <div id="curve-chart" />
                <p className="statement-note" id="curve-note">–
                </p>
              </figure>
              <p className="statement-note">The validation curve is drawn on rows carved out of
            the training set, never on the test set. Choosing the number of trees by
            watching a test curve is how a test set stops being one, and it is the
            most common way a model's reported performance ends up better than its
            real performance.
              </p>
            </section>
            {/* ============ 5 · WHICH ONE WINS ============ */}
            <section className="statement" id="sec-compare" data-toc="Which one wins">
              <h2>So does the clever model win?
              </h2>
              <p className="prose">On one split, usually, by a little. The question is whether
            that little survives being measured properly, and there are two ways to
            find out. DeLong's test compares two AUCs measured on the same applicants,
            which is the right test because the two models agree about the easy cases
            and differ only on the hard ones. Cross-validation asks the same question
            by refitting everything, five times, on different folds.
              </p>
              <div className="grid-2">
                <figure className="chart-card">
                  <figcaption>
                    <strong>DeLong's test
                    </strong>
                    <span className="mono">difference in AUC, with its interval
                    </span>
                  </figcaption>
                  <div id="delong-chart" />
                  <p className="statement-note" id="delong-note">–
                  </p>
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>Five folds, both models
                    </strong>
                    <span className="mono">refitted from scratch each time
                    </span>
                  </figcaption>
                  <div id="cv-chart" />
                  <p className="statement-note" id="cv-note">–
                  </p>
                </figure>
              </div>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Score distribution by outcome
                  </strong>
                  <span className="mono">where the KS statistic comes from
                  </span>
                </figcaption>
                <div id="dist-chart" />
              </figure>
              <div className="callout">
                <span className="mono">What a thousand rows can and cannot settle
                </span>
                <p id="power-note">–
                </p>
              </div>
            </section>
            {/* ============ 6 · THE CUT-OFF ============ */}
            <section className="statement" id="sec-threshold" data-toc="Where the cut-off goes">
              <h2>Where the cut-off goes, and what it costs
              </h2>
              <p className="prose">Everything above is ranking. None of it is a decision. The
            decision is a number: above this probability of default, decline. The
            dataset ships its own cost matrix, and with it the answer follows from
            arithmetic rather than taste. Declining a good applicant costs 1. Lending
            to a bad one costs 5. So decline when
              </p>
              <p className="formula mono">p × 5 &gt; (1 − p) × 1,  which is  p &gt; 1/6 = 0.167
              </p>
              <p className="prose">and the whole apparatus of AUC has no opinion about it. A
            model that ranks better lets you sit at a lower cut-off for the same loss
            rate, which is where its value actually shows up.
              </p>
              <div className="grid-2">
                <figure className="chart-card">
                  <figcaption>
                    <strong>Cost against cut-off
                    </strong>
                    <span className="mono">the dataset's own 5:1 matrix
                    </span>
                  </figcaption>
                  <div id="cost-chart" />
                  <p className="statement-note" id="cost-note">–
                  </p>
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>The decision at your cut-off
                    </strong>
                    <span className="mono" id="conf-label">–
                    </span>
                  </figcaption>
                  <div id="confusion" />
                  <p className="statement-note" id="conf-note">–
                  </p>
                </figure>
              </div>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>The lift table
                  </strong>
                  <span className="mono">applicants sorted worst first, in tenths
                  </span>
                </figcaption>
                <div className="table-scroll" id="lift-table" />
              </figure>
            </section>
            {/* ============ 7 · CALIBRATION ============ */}
            <section className="statement" id="sec-calibration" data-toc="Calibration">
              <h2>A ranking is not a probability
              </h2>
              <p className="prose">AUC only knows about order. A model can rank every applicant
            perfectly and still say 4% when it means 20%, and for a PD model that is
            not a detail: the number goes into a provision, a capital calculation and
            a price. Boosted trees are usually the worst offenders, because the loss
            they minimise rewards confidence on the training rows.
              </p>
              <p className="prose">The fix is a one-variable logistic regression of the outcome
            on the model's own log odds, fitted on held-out rows. It cannot reorder
            anybody, so AUC, Gini and KS are untouched by construction. What changes is
            whether the number means what it says.
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Reliability
                  </strong>
                  <span className="mono">predicted against observed, in tenths of the book
                  </span>
                </figcaption>
                <div id="calib-chart" />
                <p className="statement-note" id="calib-note">–
                </p>
              </figure>
            </section>
            {/* ============ 8 · EXPLAINING ONE DECISION ============ */}
            <section className="statement" id="sec-explain" data-toc="Explaining a decision">
              <h2>Explaining one decision
              </h2>
              <p className="prose">A model that cannot say why it declined someone is a model
            that cannot be deployed in consumer lending. The scorecard answers by
            construction: the points are additive, so the reasons are the rows with the
            most negative points. The boosted model has to be taken apart, and for an
            additive ensemble of trees that can be done exactly rather than
            approximately: walk each tree, and give every split the change in value it
            caused. The parts add to the prediction, which the test file checks.
              </p>
              <div className="chip-row" id="applicant-bar" role="group" aria-label="Pick an applicant" />
              <div className="grid-2">
                <figure className="chart-card">
                  <figcaption>
                    <strong>Scorecard
                    </strong>
                    <span className="mono" id="applicant-logit">–
                    </span>
                  </figcaption>
                  <div id="explain-logit" />
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>Boosted
                    </strong>
                    <span className="mono" id="applicant-gbm">–
                    </span>
                  </figcaption>
                  <div id="explain-gbm" />
                </figure>
              </div>
              <p className="statement-note" id="explain-note">–
              </p>
            </section>
            {/* ============ 9 · FAIRNESS ============ */}
            <section className="statement" id="sec-fairness" data-toc="Fair lending">
              <h2>The attributes a lender is not allowed to use
              </h2>
              <p className="prose">This dataset ships sex, age and foreign-worker status, and a
            model handed all three will use all three. Every jurisdiction that
            regulates consumer credit restricts at least two of them, so the first
            thing a real project does is take them out. The toggle above does that, and
            the interesting part is what happens next: performance barely moves, and
            the disparity does not disappear, because fifty other columns rebuild what
            they can from what is left.
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Approval rate by group, at your cut-off
                  </strong>
                  <span className="mono" id="fair-label">–
                  </span>
                </figcaption>
                <div className="chip-row" id="group-picker" role="group" aria-label="Which grouping" />
                <div id="fair-chart" />
                <p className="statement-note" id="fair-note">–
                </p>
              </figure>
              <div className="callout">
                <span className="mono">What the four-fifths rule is and is not
                </span>
                <p>If one group's approval rate is under four-fifths of another's, that is
               the point at which a US regulator starts asking questions. It is a
               screening test rather than a legal standard, it says nothing about
               whether the difference is justified by risk, and passing it is not a
               defence. It is on the page because it is the first number any model
               review computes, and because a page about credit models that skipped
               this section would be a page about a different job.
                </p>
              </div>
            </section>
            {/* ============ 10 · LIMITS ============ */}
            <section className="statement" id="sec-limits" data-toc="What this is not">
              <h2>What this is not
              </h2>
              <div className="method-steps">
                <div className="method-step">
                  <span className="mono">1 · The dataset
                  </span>
                  <h3>A thousand rows from 1994
                  </h3>
                  <p>A 30% default rate is not a lending book, it is a teaching set, probably
                 oversampled from bad cases. Amounts are in Deutsche Marks. A 2019
                 re-examination of the source argues parts of the published codebook are
                 wrong. None of that damages a demonstration of method, and all of it
                 would damage a conclusion about lending.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">2 · No time
                  </span>
                  <h3>Every row is treated as if it happened at once
                  </h3>
                  <p>Real credit data arrives in vintages, and the split that matters is
                 out-of-time, not random: train on last year, test on this one. A random
                 split flatters every model, because it lets it learn from applicants
                 who came after the ones it is being tested on.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">3 · No reject inference
                  </span>
                  <h3>The applicants who were declined are not in the data
                  </h3>
                  <p>A bank only observes the outcome of loans it made. Fitting on approved
                 applicants only and then scoring everyone is the oldest selection
                 problem in credit, and correcting for it is most of the work in a real
                 build.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">4 · One threshold, no pricing
                  </span>
                  <h3>Approve or decline, and nothing in between
                  </h3>
                  <p>Real lenders price to risk, set limits, ask for a guarantor, or approve
                 at a shorter term. The cost matrix here has two cells because the
                 dataset's does.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">5 · No monitoring
                  </span>
                  <h3>The half of the job that happens after deployment
                  </h3>
                  <p>Population stability, score drift, override rates, back-testing the
                 calibration every quarter. A model is a product with a shelf life, and
                 nothing on this page measures it.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">6 · The algorithm, not the library
                  </span>
                  <h3>Gradient boosting written out by hand
                  </h3>
                  <p>Same objective, same split rule, same histogram trick, a few hundred
                 lines instead of a few hundred thousand. What it does not have is the
                 tuning, the categorical handling and the twenty years of edge cases
                 that make XGBoost and LightGBM worth using in production.
                  </p>
                </div>
              </div>
            </section>
          </section>
          {/* ============ HOW IT'S BUILT ============ */}
          <section>
            <span className="section-label mono">How this is built
            </span>
            <div className="principles">
              <div className="principle">
                <h3>Fitted here, not pasted in
                </h3>
                <p>Both models, the cross-validation and every metric are computed in the
               browser when the page loads. There are no stored results to drift from
               the code that made them, and the split seed is a slider because the
               honest way to show how much a result depends on luck is to let someone
               change the luck.
                </p>
              </div>
              <div className="principle">
                <h3>Data with a receipt
                </h3>
                <p>A script in the repository downloads the dataset from its archive,
               records the checksum, and writes the module the page imports. The test
               file recomputes column totals and level counts against what that script
               saw, so the data in the repository can be traced to the data at the
               source.
                </p>
              </div>
              <div className="principle">
                <h3>The comparison is tested, not asserted
                </h3>
                <p>DeLong for the difference on one split, repeated stratified folds for
               the difference in general, and a check in the test file that the gap
               between the models really is smaller than the spread across folds, so
               the page cannot go on claiming it after that stops being true.
                </p>
              </div>
              <div className="principle">
                <h3>Closed forms as the referee
                </h3>
                <p>Logistic regression on one binary predictor must return the log odds
               ratio of the two-by-two table and Woolf's standard error, exactly. AUC
               is computed three ways and they must agree. A boosted leaf must equal
               the closed-form minimiser of the objective it claims to minimise.
                </p>
              </div>
              <div className="principle">
                <h3>The parts of the answer add up
                </h3>
                <p>The scorecard's points sum to its score; the boosted model's per-feature
               contributions sum to its prediction; the Brier score decomposes into
               reliability, resolution and uncertainty. Three identities that hold to
               machine precision or the tests fail.
                </p>
              </div>
              <div className="principle">
                <h3>180 checks on the engine
                </h3>
                <p>Including the two bugs they caught while it was being written: a
               calibration fitted on in-sample scores that made the model worse, and a
               gradient with its sign the wrong way round, which trains a model that
               climbs the loss it is meant to descend and returns something that looks
               like a model.
                </p>
              </div>
            </div>
          </section>
          <div className="note" id="attribution">–
          </div>
          <div className="band">
            <span className="mono">Working together
            </span>
            <h2>Need a model that survives a validation team?
            </h2>
            <p>Scorecards, machine-learning challengers, the comparison that says whether
           the challenger is really better, calibration, cut-off economics and the
           documentation a model risk function will ask for. In Python or R, with the
           notebook and the data pipeline handed over.
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid" href="/contact.html">Start a conversation
              </a>
              <a className="btn btn-ghost" href="/portfolio.html">Back to the portfolio
              </a>
            </div>
          </div>
        </div>
      </main>
  );
}
