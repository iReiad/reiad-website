/* ============================================================
   /portfolio/frontier

   Ported out of `aab/portfolio/frontier.html` with archive/TRANSITION.md Stage 11.3,
   words unchanged: this is one of the seven case studies.

   The numbers are not here and must not be. Every figure on this
   page is computed in the browser by `/portfolio/frontier.js`
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
  path: "/portfolio/frontier",
  title: "Portfolio construction: a screened FTSE 250 fund · Reiad's Library",
  description: "A ten-holding FTSE 250 fund screened on leverage, sustainability and returns, weighted on one year of daily prices and held from 2016 to 2020. Ten million pounds became fourteen and a half, at half the market's beta. Every figure is recomputed live in the browser.",
  ogTitle: "Portfolio construction: a screened FTSE 250 fund",
  ogDescription: "Ten screened FTSE 250 holdings, weighted on 2015 and held to 2020. Half the market's beta, beat the index in three years of five, and every figure recomputed in the browser.",
  card: "frontier",
});

export default function Page() {
  return (

      <main id="main">
        <div className="wrap">
          <div className="hero">
            <Eyebrow>Case study · Portfolio construction · Interactive
            </Eyebrow>
            <h1>A Shariah and ESG screened FTSE 250 fund, built in 2015 and held to 2020.
            </h1>
            <p className="lede">
              Ten mid-cap holdings chosen by a screen that runs before any price is
          looked at: leverage under a third of equity, sustainability away from the
          laggards, returns on capital above the cost of it, and a required return
          set for each one off the security market line. Weights chosen at the end of
          2015 by minimising the variance the holdings contribute, then held,
          unchanged, through the five years that followed. £10m at the start, and
          every number on this page computed in your browser from the daily closes
          rather than copied out of a spreadsheet.
        
            </p>
            <p className="model-co">
              <strong id="fund-title">–
              </strong>
              <span className="mono" id="fund-meta">–
              </span>
            </p>
            <p className="note note-inline" id="fund-note">–
            </p>
          </div>
          <nav className="page-toc" id="page-toc" aria-label="On this page" />
          <section id="fund" className="model">
            <div className="model-bar">
              <div className="scenarios" role="group" aria-label="Which portfolio to hold">
                <button className="scenario" type="button" data-strategy="asbuilt" aria-pressed="true">As built
                </button>
                <button className="scenario" type="button" data-strategy="minvar" aria-pressed="false">Min variance
                </button>
                <button className="scenario" type="button" data-strategy="tangency" aria-pressed="false">Max Sharpe
                </button>
                <button className="scenario" type="button" data-strategy="equal" aria-pressed="false">Equal weight
                </button>
              </div>
              <p className="scenario-blurb" id="strategy-blurb">–
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
                <span className="mono">Five years held
                </span>
                <strong className="verdict-value">–
                </strong>
              </div>
              <p className="verdict-detail">–
              </p>
            </div>
            <div className="tiles">
              <StatTile label="Hold-out return" note="Cumulative over the five years" fills="ret" />
              <StatTile label="Annualised" note="Compound, after the whole period" fills="cagr" />
              <StatTile label="Portfolio beta" note="Weighted, against the FTSE 250" fills="beta" />
              <StatTile label="Sharpe" note="Realised, on the held-out years" fills="sharpe" />
              <StatTile label="Deepest drawdown" note="Peak to trough, along the way" fills="dd" />
              <StatTile label="Average year, vs index"
                        note="Mean annual return against the FTSE 250"
                        fills="vsindex" />
            </div>
            <div className="model-body">
              <aside className="model-drivers">
                <div className="drivers-head">
                  <h2>Inputs
                  </h2>
                  <button className="chip" type="button" id="reset-drivers" hidden>Reset
                  </button>
                </div>
                <p className="drivers-note">The fund as built is the first button. The others
              are comparisons: each re-solves the frontier, forty constrained
              optimisations, and runs the five years again. None of it is
              precomputed. Opening the universe to all thirteen moves the
              frontier and the three optimised alternatives; the fund as built
              held ten, so its own weights do not move.
                </p>
                <div className="method-row">
                  <span className="mono">Holding
                  </span>
                  <div className="segmented" role="group" aria-label="Rebalancing convention">
                    <button type="button" data-mode="rebalance" aria-pressed="true">Weights held
                    </button>
                    <button type="button" data-mode="hold" aria-pressed="false">Buy and hold
                    </button>
                  </div>
                </div>
                <div className="method-row">
                  <span className="mono">Universe
                  </span>
                  <div className="segmented" role="group" aria-label="Which candidates to optimise over">
                    <button type="button" data-universe="ten" aria-pressed="true">The ten held
                    </button>
                    <button type="button" data-universe="all" aria-pressed="false">All thirteen
                    </button>
                  </div>
                </div>
                <div id="drivers" />
              </aside>
              <div className="model-charts">
                <figure className="chart-card">
                  <figcaption>
                    <strong>The efficient frontier, estimated on 2015
                    </strong>
                    <span className="mono">annualised, long only, capped
                    </span>
                  </figcaption>
                  <div id="frontier-chart" />
                  <p className="statement-note" id="frontier-note">–
                  </p>
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>What five years did to it
                    </strong>
                    <span className="mono">
                      <i className="key key-chosen" />The fund 
                      <i className="key key-equal" />Equal weight
                    </span>
                  </figcaption>
                  <div id="nav-chart" />
                  <p className="statement-note" id="nav-note">–
                  </p>
                </figure>
              </div>
            </div>
            {/* ============ 1 · THE SCREEN ============ */}
            <section className="statement" id="sec-universe" data-toc="The screen">
              <h2>What got in, and what the screen threw out
              </h2>
              <p className="prose">The universe starts as the FTSE 250 and is cut by rules
            that are stated before any price is looked at: leverage below a third of
            equity, a sustainability score away from the laggards, a return on equity
            in double figures, and a return on invested capital above the cost of it.
            Sector caps then stop the survivors from being ten versions of the same
            bet.
              </p>
              <div className="table-scroll" id="screen-table" />
              <p className="statement-note" id="screen-note">–
              </p>
            </section>
            {/* ============ 2 · THE ESTIMATE ============ */}
            <section className="statement" id="sec-estimate" data-toc="One year of data">
              <h2>Everything the optimiser knows
              </h2>
              <p className="prose">One year of daily closes. From it: an average return and a
            volatility for each holding, and a correlation with every other. That is
            fifty-five numbers estimated from 252 days, and the optimiser will treat
            all of them as though they were facts.
              </p>
              <div className="grid-2">
                <figure className="chart-card">
                  <figcaption>
                    <strong>Risk and return, one year
                    </strong>
                    <span className="mono">each holding, annualised
                    </span>
                  </figcaption>
                  <div id="scatter-chart" />
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>Correlations
                    </strong>
                    <span className="mono">daily, over the estimation window
                    </span>
                  </figcaption>
                  <div id="corr-chart" />
                </figure>
              </div>
              <div className="callout">
                <span className="mono">Why there is a shrinkage dial
                </span>
                <p>A covariance matrix estimated from a single year is mostly signal in its
               diagonal and mostly noise off it. A minimum-variance objective is drawn
               to whichever pair of holdings looks least correlated, which is exactly
               where the estimate is least trustworthy, so the optimiser reliably falls
               in love with an artefact. Pulling the off-diagonal terms towards zero is
               the standard defence. Move the dial and watch how much of the answer was
               resting on those numbers.
                </p>
              </div>
            </section>
            {/* ============ 3 · THE FRONTIER ============ */}
            <section className="statement" id="sec-frontier" data-toc="The frontier">
              <h2>Solving it, forty times
              </h2>
              <p className="prose">Every point on the curve above is a constrained
            optimisation, solved here, of
              </p>
              <p className="formula mono">maximise w′μ − (γ/2)·w′Σw  subject to  Σw = 1,  0 ≤ w ≤ cap
              </p>
              <p className="prose">Sweeping the risk aversion γ from large to small traces the
            whole frontier without ever fixing a target return. The projection onto the
            constraint set is exact rather than a clip followed by a renormalisation,
            which matters more than it sounds: clipping quietly pushes every solution
            towards the cap and makes the frontier look better behaved than it is.
              </p>
              <div className="table-scroll" id="weights-table" />
              <p className="statement-note" id="weights-note">–
              </p>
            </section>
            {/* ============ 4 · RISK ============ */}
            <section className="statement" id="sec-risk" data-toc="Where the risk is">
              <h2>Weights are not risk
              </h2>
              <p className="prose">A holding's share of the portfolio's volatility is not its
            share of the money. The component contributions below add up to the
            portfolio volatility exactly, which is what makes them worth quoting: a
            small position in something wild can carry more risk than a large position
            in something dull.
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Share of money against share of risk
                  </strong>
                  <span className="mono">
                    <i className="key key-chosen" />Weight 
                    <i className="key key-risk" />Risk
                  </span>
                </figcaption>
                <div id="risk-chart" />
                <p className="statement-note" id="risk-note">–
                </p>
              </figure>
            </section>
            {/* ============ 5 · THE HOLD-OUT ============ */}
            <section className="statement" id="sec-holdout" data-toc="Five years later">
              <h2>The only test that counts
              </h2>
              <p className="prose">The weights are fixed at the end of the estimation window
            and held through 2016 to 2020. Nothing is re-estimated, nothing is
            re-optimised, and no holding is replaced. Every number below comes from
            days the optimiser never saw.
              </p>
              <div className="grid-2">
                <figure className="chart-card">
                  <figcaption>
                    <strong>Underwater
                    </strong>
                    <span className="mono">how far below the previous peak
                    </span>
                  </figcaption>
                  <div id="dd-chart" />
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>Calendar years
                    </strong>
                    <span className="mono">
                      <i className="key key-chosen" />Portfolio 
                      <i className="key key-bench" />FTSE 250
                    </span>
                  </figcaption>
                  <div id="annual-chart" />
                </figure>
              </div>
              <p className="statement-note">The index comparison is annual because the index
            history collected for this work was annual. Anywhere the portfolio is set
            against the FTSE 250 it is set against five numbers, not a daily series,
            and a five-point comparison is worth exactly as much as it sounds.
              </p>
            </section>
            {/* ============ 6 · CAPM ============ */}
            <section className="statement" id="sec-capm" data-toc="What a share should earn">
              <h2>The security market line
              </h2>
              <p className="prose">The screen says which companies are sound. It says nothing
            about what return to ask of them, so the next step sets a required return
            for each one out of the market risk it carries,
              </p>
              <p className="formula mono">E[rᵢ] = r_f + βᵢ(E[r_m] − r_f)
              </p>
              <p className="prose">which is the dashed line below. It is a single-factor model
            and its limits are well known: beta is estimated from the past, and the
            line says nothing about size, value or momentum. It is here because it is
            a stated rule applied to every candidate the same way, which at this stage
            is worth more than a better model applied by eye.
              </p>
              <p className="prose">The dots are what each share actually did over the year the
            fund was built on. The vertical distance between a dot and the line is the
            part of that year the model does not explain, and the striking thing is how
            large it is in both directions: a year of prices is not an estimate of
            expected return, it is one draw from a wide distribution. That is the whole
            case for the weighting step that follows, which reads the volatilities and
            takes no view on returns at all.
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>What the line asks for, and what 2015 delivered
                  </strong>
                  <span className="mono" id="sml-label">–
                  </span>
                </figcaption>
                <div id="sml-chart" />
                <p className="statement-note" id="sml-note">–
                </p>
              </figure>
            </section>
            {/* ============ 7 · COMPOSITION ============ */}
            <section className="statement" id="sec-composition" data-toc="What was held">
              <h2>The fund, as it went in
              </h2>
              <p className="prose">Ten holdings across nine sectors, weighted by the
            optimisation and left alone. The second chart is the one worth reading
            twice: a holding's contribution to the fund's market sensitivity is its
            weight times its beta, and one of these ten carries a negative beta, which
            is why the fund as a whole ends up at roughly half the market's.
              </p>
              <div className="grid-2">
                <figure className="chart-card">
                  <figcaption>
                    <strong>Weights
                    </strong>
                    <span className="mono">as at 1 January 2016
                    </span>
                  </figcaption>
                  <div id="weights-chart" />
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>Beta contribution
                    </strong>
                    <span className="mono">weight × beta
                    </span>
                  </figcaption>
                  <div id="beta-chart" />
                </figure>
              </div>
              <p className="statement-note" id="beta-note">–
              </p>
            </section>
            {/* ============ 7b · THE YEARS ============ */}
            <section className="statement" id="sec-years" data-toc="Year by year">
              <h2>Five years, reported the way a fund is reported
              </h2>
              <p className="prose">Return against the index, the excess over what the fund's
            market exposure alone would have earned, and both risk-adjusted ratios.
            Sharpe divides the excess by everything that moved; Treynor divides it only
            by the part the market explains. For a fund deliberately run at a low beta
            the two say different things, which is the reason to quote both.
              </p>
              <p className="formula mono">α = R_p − [r_f + β_p(R_m − r_f)]   ·   Sharpe = (R_p − r_f)/σ_p   ·   Treynor = (R_p − r_f)/β_p
              </p>
              <div className="table-scroll" id="years-table" />
              <p className="statement-note" id="years-note">–
              </p>
            </section>
            {/* ============ 7c · SCENARIOS ============ */}
            <section className="statement" id="sec-scenario" data-toc="Two years worth reading">
              <h2>The rally it beat, and the crash it did not cushion
              </h2>
              <div className="grid-2">
                <div className="method-step">
                  <span className="mono">2017 · the rally
                  </span>
                  <h3>Half the beta, twice the rise
                  </h3>
                  <p id="scenario-2017">–
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">2020 · the crash
                  </span>
                  <h3>Diversification going missing exactly when it was needed
                  </h3>
                  <p id="scenario-2020">–
                  </p>
                </div>
              </div>
              <p className="statement-note">A fund at half the market's beta is supposed to lag
            a rally and cushion a fall. Across these five years it did neither. It beat
            the index in 2017 by a margin no amount of market exposure explains, which
            is stock selection and not a low beta doing the work; and in February and
            March 2020 it fell as hard as anything else, because correlations across
            almost everything went to one at the same moment. That is the standing
            complaint about diversification as a defence: it is measured in calm
            markets and spent in violent ones.
              </p>
            </section>
            {/* ============ 8 · LIMITS ============ */}
            <section className="statement" id="sec-limits" data-toc="What this is not">
              <h2>What this is not
              </h2>
              <div className="method-steps">
                <div className="method-step">
                  <span className="mono">1 · One window, one path
                  </span>
                  <h3>A single five-year run is one observation
                  </h3>
                  <p>Everything here rests on one estimation window and one hold-out period.
                 A stronger answer would roll the whole exercise forward month by month
                 over decades and report the distribution rather than the anecdote.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">2 · A single factor
                  </span>
                  <h3>Beta captures market risk and nothing else
                  </h3>
                  <p>The screening test is CAPM, so size, value, profitability and momentum
                 are all invisible to it. A five-factor version of the same screen would
                 keep a different ten, and no claim here survives that being tried.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">3 · ESG data is not one thing
                  </span>
                  <h3>Providers disagree with each other
                  </h3>
                  <p>Sustainability scores diverge sharply between vendors for the same
                 company, so a cut at one threshold on one provider's scale is a rough
                 instrument. It is applied here as a filter, not as a measurement.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">4 · A simplified compliance test
                  </span>
                  <h3>Leverage, not the full standard
                  </h3>
                  <p>The Shariah screen here is a debt-to-equity limit plus sector
                 exclusions. A full AAOIFI screen also tests interest income and cash
                 purity, which needs statement-level data this exercise did not carry.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">5 · Prices only, and no costs
                  </span>
                  <h3>No dividends in the path, no spread paid
                  </h3>
                  <p>The return series is built from closing prices, so income is missing
                 from the compounding on a book yielding three to four per cent. Nothing
                 pays commission, spread or stamp duty either, and holding the weights
                 constant means trading every day.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">6 · Survivorship
                  </span>
                  <h3>The universe is a list that survived
                  </h3>
                  <p>Candidates were drawn from an index membership list, so companies that
                 left the index or the market are absent. That biases every backtest
                 built this way upwards, including this one.
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
                <h3>Solved, not stored
                </h3>
                <p>The covariance matrix, the frontier and the weights are computed in the
               browser from the daily prices in the repository. Move the cap and forty
               optimisations run again. There is no stored answer to drift away from
               the code that produced it.
                </p>
              </div>
              <div className="principle">
                <h3>An exact projection
                </h3>
                <p>The constraint set is handled by projecting onto it exactly, through a
               one-dimensional root find on the multiplier. Clipping and renormalising
               is the usual shortcut and it biases every weight towards the cap.
                </p>
              </div>
              <div className="principle">
                <h3>The estimation window is sealed
                </h3>
                <p>Weights are chosen using 2015 and nothing else. The hold-out years are
               never touched until the weights are fixed, which is the whole point and
               is the step most easily lost when a backtest is written in a hurry.
                </p>
              </div>
              <div className="principle">
                <h3>Checked against closed forms
                </h3>
                <p>The minimum-variance weights must equal Σ⁻¹1/(1′Σ⁻¹1) where that
               solution is interior. The variance of the realised return series must
               equal w′Σw. Equal-weight buy and hold must end at the average price
               relative. All three hold to machine precision or the tests fail.
                </p>
              </div>
              <div className="principle">
                <h3>Both conventions, stated
                </h3>
                <p>The fund held its weights constant, which is what the headline figures
               report. Buying once and never trading is a different strategy and is
               offered as a switch rather than left ambiguous, because on this data the
               two differ by about a fifth of the final value.
                </p>
              </div>
              <div className="principle">
                <h3>118 checks on the engine
                </h3>
                <p>Including the identities above, the projection tested against a grid
               search for nearest point, the frontier checked for dominated points,
               and a hold-out return reproduced from a figure computed independently
               in a spreadsheet.
                </p>
              </div>
            </div>
          </section>
          <div className="note" id="attribution">–
          </div>
          <Band
            label={"Working together"}
            title={"Need a portfolio built and then honestly tested?"}
            actions={<>
              <ButtonLink kind="solid" onAccent href="/contact">{"Start a conversation"}</ButtonLink>
              <ButtonLink kind="ghost" onAccent href="/portfolio">{"Back to the portfolio"}</ButtonLink>
            </>}
          >
            <p>{"Screening, covariance estimation, constrained optimisation, and the out-of-sample work that says whether any of it survives contact with the years that follow. In Python or Excel, with the data and the code handed over."}</p>
          </Band>
        </div>
      </main>
  );
}
