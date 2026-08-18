/* ============================================================
   /portfolio/dissertation.html

   Ported out of `aab/portfolio/dissertation.html` with archive/TRANSITION.md Stage 11.3,
   words unchanged: this is one of the seven case studies.

   The numbers are not here and must not be. Every figure on this
   page is computed in the browser by `/portfolio/dissertation.js`
   from the `.model.js` and `.data.js` files beside it, which stay
   exactly where they are with their tests running on every
   commit. What moved is the page around the numbers, which is the
   whole of section 2b's rule about the case studies: their value
   is that the figures are right and provably unchanged, so they
   are the last thing a port is allowed to touch.
   ============================================================ */

import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";
import { Band } from "../../../../components/ui/band";
import { ButtonLink } from "../../../../components/ui/button";

export const metadata: Metadata = pageMeta({
  path: "/portfolio/dissertation.html",
  title: "Islamic vs conventional funds in the UK · MSc dissertation · Reiad's Library",
  description: "A 15,000-word MSc dissertation made interactive: 220 UK equity funds, 19,577 fund-months, Fama–French five-factor and Carhart models, drawdown and idiosyncratic risk, and an honest account of what a sample of three Islamic funds could and could not detect.",
  ogTitle: "Are Islamic funds really lower risk? A dissertation, made interactive",
  ogDescription: "220 UK equity funds, 19,577 fund-months, five-factor and Carhart models, and a straight answer about what three Islamic funds could actually prove.",
  card: "dissertation",
});

export default function Page() {
  return (

      <main id="main">
        <div className="wrap">
          <div className="hero">
            <span className="eyebrow mono">Case study · Empirical research · MSc dissertation
            </span>
            <h1>Lower risk? Not in this data, and not provable either way.
            </h1>
            <p className="lede">
              Two hundred and twenty UK equity funds. Nineteen thousand five hundred
          and seventy-seven fund-months. Five risk factors, a momentum factor, and
          every risk-adjusted measure the literature argues about. The hypothesis
          was that Shariah-compliant funds carry less risk; it failed. Then the
          sample turned out to be too small to have tested it, and that, worked
          out properly, is the result worth publishing.
        
            </p>
            <p className="model-co">
              <strong>Are Islamic mutual funds exposed to lower risk than conventional funds? Evidence from the United Kingdom
              </strong>
              <span className="mono" id="study-meta">–
              </span>
            </p>
          </div>
          {/* ============ THE WHOLE THING, UP FRONT ============ */}
          <div className="verdict-card" data-state="down">
            <span className="mono">The finding, in one line
            </span>
            <div className="verdict-main">
              <span className="verdict-value">No difference
              </span>
              <span>found in volatility, market beta, idiosyncratic risk, or factor-adjusted return.
              </span>
            </div>
            <p className="verdict-detail">
              Every univariate test returns p &gt; 0.21. The Islamic dummy in the
          six-factor model is positive but insignificant (p = 0.164), and its
          confidence interval straddles zero. Only drawdown gets close
          (p = 0.068), and the power calculation on this page shows that
          comparison had roughly a 7% chance of finding the gap it was looking for.
        
            </p>
          </div>
          <div className="tiles">
            <div className="tile" data-tile="fact-funds">
              <span className="mono">Funds in the sample
              </span>
              <strong className="tile-value">–
              </strong>
              <small>UK-domiciled equity funds, Bloomberg
              </small>
            </div>
            <div className="tile" data-tile="fact-islamic">
              <span className="mono">Of which Shariah-compliant
              </span>
              <strong className="tile-value">–
              </strong>
              <small>The constraint the whole study runs into
              </small>
            </div>
            <div className="tile" data-tile="fact-obs">
              <span className="mono">Fund-months
              </span>
              <strong className="tile-value">–
              </strong>
              <small>The panel behind every regression
              </small>
            </div>
            <div className="tile" data-tile="fact-months">
              <span className="mono">Months covered
              </span>
              <strong className="tile-value">–
              </strong>
              <small>Jan 2018 → Jul 2025, COVID included
              </small>
            </div>
          </div>
          <nav className="page-toc" id="page-toc" aria-label="On this page" />
          <section id="dissertation" className="model">
            {/* ============ 1 · THE QUESTION ============ */}
            <section className="statement" id="sec-question" data-toc="The question">
              <h2>The question, and why it is not obvious
              </h2>
              <p className="prose">
                Shariah-compliant funds cannot hold interest-bearing instruments,
            cannot hold conventional banks or insurers, cannot use leverage
            beyond a narrow ratio, and screen out alcohol, gambling, tobacco and
            adult entertainment. Two arguments follow, and they point in
            opposite directions.
          
              </p>
              <div className="grid-2">
                <div className="cell">
                  <span className="tag mono">Argument one · lower risk
                  </span>
                  <h3>Screening removes the risky part
                  </h3>
                  <p>Excluding highly leveraged firms strips out the credit-like
                channel that turns market falls into fund collapses. Excluding
                banks avoids the sector that led the 2008 drawdown. On this
                reading Islamic funds should show a lower beta, lower
                volatility, and shallower falls
                (Hayat & Kraeussl, 2011; Naveed et al., 2020).
                  </p>
                </div>
                <div className="cell">
                  <span className="tag mono">Argument two · higher risk
                  </span>
                  <h3>Screening removes the diversification
                  </h3>
                  <p>Markowitz (1952) is unambiguous: a smaller investable universe
                means a worse efficient frontier. Cut out whole sectors and what
                remains is concentrated, heavier in technology and healthcare,
                more dependent on one market regime, carrying more
                fund-specific risk (Hoepner et al., 2011; Walkshäusl & Lobe, 2012).
                  </p>
                </div>
              </div>
              <p className="prose">
                Theory cannot settle it. That makes it an empirical question, and the
            UK is the natural place to ask it: London is the largest Western
            centre for Islamic finance, Shariah pension inflows hit records in
            2025, and yet the peer-reviewed UK fund evidence amounts to
            essentially one paper (Reddy et al., 2017). Almost everything else
            in this literature comes from Malaysia, Pakistan or the Gulf.
          
              </p>
              <div className="callout">
                <span className="mono">Hypothesis under test
                </span>
                <p>
                  <strong>Islamic funds exhibit lower overall risk in the UK:
              systematic, idiosyncratic and downside.
                  </strong>
                </p>
                <p className="statement-note">Stated so it could fail. It did.
                </p>
              </div>
            </section>
            {/* ============ 2 · THE LITERATURE ============ */}
            <section className="statement" id="sec-literature" data-toc="What was already known">
              <h2>What the literature already said, and why it disagrees with itself
              </h2>
              <p className="prose">
                Sixteen studies, tagged by what they concluded. The disagreement in
            this field is not noise. It sorts almost perfectly by three things:
            which market was studied, whether the metric was a return or a risk,
            and whether the window contained a crisis.
          
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>How the evidence splits
                  </strong>
                  <span className="mono" id="evidence-count">–
                  </span>
                </figcaption>
                <div id="chart-evidence" />
                <ul className="chart-key" id="evidence-legend" />
              </figure>
              <div className="horizon-picker" role="group" aria-label="Filter by finding">
                <span className="mono">Show
                </span>
                <button type="button" data-finding="all" aria-pressed="true">All
                </button>
                <button type="button" data-finding="better" aria-pressed="false">Islamic better
                </button>
                <button type="button" data-finding="same" aria-pressed="false">No difference
                </button>
                <button type="button" data-finding="mixed" aria-pressed="false">It depends
                </button>
                <button type="button" data-finding="worse" aria-pressed="false">Islamic worse
                </button>
              </div>
              <div className="table-scroll" id="evidence-table" />
              <p className="statement-note">
                The pattern: emerging-market studies that measure 
                <em>risk
                </em> tend
            to find Islamic funds lower-risk. Developed-market studies that
            measure 
                <em>return
                </em> tend to find no difference or a small
            penalty. Index-level studies that split by regime find Islamic
            portfolios look best precisely when everything else looks worst.
            A study's conclusion is largely determined before it collects a
            single price, by where it looks and what it decides to call risk.
          
              </p>
              <p className="prose">
                The gap this dissertation aims at: a UK sample, recent enough to
            include COVID and the 2022 rate shock, run through the modern
            five-factor framework rather than CAPM alone, and judged on risk
            measures rather than mean returns.
          
              </p>
            </section>
            {/* ============ 3 · THE DATA ============ */}
            <section className="statement" id="sec-data" data-toc="The data">
              <h2>The data, and the problem sitting inside it
              </h2>
              <div className="table-scroll" id="source-table" />
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>The sample, drawn to scale
                  </strong>
                  <span className="mono">one dot per fund
                  </span>
                </figcaption>
                <div id="chart-sample" className="chart-narrow" />
                <p className="statement-note">
                  Three. Not three hundred, not thirty, three UK-domiciled
              Shariah-compliant equity funds with a usable NAV history over the
              window, against 217 conventional ones. This is not a sampling
              choice that could have been made differently; it is the size of
              the UK Shariah equity fund market. Every result below has to be
              read through this picture, and the
              
                  <a href="#sec-power">power section
                  </a> makes the consequence
              precise instead of leaving it as a caveat.
            
                </p>
              </figure>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>The environment both fund types were operating in
                  </strong>
                  <button className="toggle" type="button" id="rebase-toggle" aria-pressed="true">Rebased to 100
                  </button>
                </figcaption>
                <div id="chart-indices" />
                <p className="statement-note" id="index-readout">–
                </p>
                <p className="statement-note">
                  A note on the Islamic series: its last three months are identical
              to five decimal places. The index stopped updating in the export
              after May 2025 and the sample runs to July. It is two months of a
              ninety-month window and it does not touch the fund panel, but a
              chart should say when its own data has gone flat rather than let
              a reader treat a stale line as a calm market.
            
                </p>
              </figure>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Every fund-month in the panel, as one distribution
                  </strong>
                  <button className="toggle" type="button" id="hist-log" aria-pressed="true">Log counts
                  </button>
                </figcaption>
                <div id="chart-excess" />
                <div className="vol-controls">
                  <label className="driver">
                    <span className="label-row">
                      <span>Bin width
                      </span>
                      <span className="val" id="hist-width-value">1.0pp bins
                      </span>
                    </span>
                    <input type="range" id="hist-width" min="1" max="8" step="1" defaultValue="2" style={{ "--pct": "14.3%" } as CSSProperties} aria-label="Histogram bin width" />
                    <small>The bins are re-summed from the 0.5pp resolution the data
                  ships at, never re-estimated; widening a bin can only ever
                  merge counts that were already there.
                    </small>
                  </label>
                </div>
                <p className="statement-note">
                  Nineteen thousand seven hundred and ninety-seven monthly excess
              returns. On a linear count axis this looks like a tidy bell; on a
              log axis the tails appear, and they are enormous: excess kurtosis
              of 513 against the 0 a normal distribution would give. The
              gold curve is that normal distribution, fitted to the same mean
              and standard deviation, and it is wrong at both ends.
              Four observations sit outside ±50% in a month. Those are not
              markets; they are NAV series with corporate actions in them, and
              they are the same funds that show up as outliers in
              
                  <a href="#sec-idio">the volatility cross-section
                  </a>.
            
                </p>
                <p className="statement-note is-warn">
                  The distribution is also centred in the wrong place: its mean sits
              at −7.3% a month, not near zero. That is not a market fact and it
              is not a rounding error. It is worked through in
              
                  <a href="#sec-audit">reading my own numbers back
                  </a>, along with
              what it does and does not invalidate.
            
                </p>
              </figure>
            </section>
            {/* ============ 4 · METHOD ============ */}
            <section className="statement" id="sec-method" data-toc="Method">
              <h2>Method, stated so it could be repeated
              </h2>
              <p className="prose">
                Four layers, each answering a question the one before it cannot.
            Nothing here is exotic; the point of using the standard toolkit is
            that a reader can check it against the papers it comes from.
          
              </p>
              <div className="method-steps">
                <div className="method-step">
                  <span className="mono">Step 1 · the raw material
                  </span>
                  <h3>Excess returns
                  </h3>
                  <p>Monthly simple returns from NAV, minus the UK 3-month Treasury
                bill. Everything downstream is denominated in the return an
                investor earned 
                    <em>above
                    </em> doing nothing.
                  </p>
                  <p className="formula mono">r
                    <sub>i,t
                    </sub> − r
                    <sub>f,t
                    </sub> = (NAV
                    <sub>i,t
                    </sub> / NAV
                    <sub>i,t−1
                    </sub> − 1) − r
                    <sub>f,t
                    </sub>
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">Step 2 · one factor
                  </span>
                  <h3>CAPM: beta, alpha, and what is left over
                  </h3>
                  <p>Regress each fund's excess return on the market's. The slope is
                systematic risk. The intercept is Jensen's alpha. The standard
                deviation of the residuals is idiosyncratic volatility, the part
                of a fund's movement the market cannot explain.
                  </p>
                  <p className="formula mono">r
                    <sub>i,t
                    </sub> − r
                    <sub>f,t
                    </sub> = α
                    <sub>i
                    </sub> + β
                    <sub>i
                    </sub>(r
                    <sub>m,t
                    </sub> − r
                    <sub>f,t
                    </sub>) + ε
                    <sub>i,t
                    </sub>
                  </p>
                  <p className="formula mono">IVOL
                    <sub>i
                    </sub> = σ(ε
                    <sub>i
                    </sub>) = √( Σε²
                    <sub>i,t
                    </sub> / (T − 2) )
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">Step 3 · six factors
                  </span>
                  <h3>Fama–French five-factor plus Carhart momentum
                  </h3>
                  <p>A single beta assumes the market is the only systematic risk
                worth paying for. It isn't. Size, value, profitability,
                investment and momentum absorb the style tilts that screening
                creates, so that whatever is left in the dummy is a difference
                between fund 
                    <em>types
                    </em>, not a difference between growth and
                value portfolios wearing different labels.
                  </p>
                  <p className="formula mono is-long">r
                    <sub>i,t
                    </sub> − r
                    <sub>f,t
                    </sub> = α + β·MktRF
                    <sub>t
                    </sub> + s·SMB
                    <sub>t
                    </sub> + h·HML
                    <sub>t
                    </sub> + r·RMW
                    <sub>t
                    </sub> + c·CMA
                    <sub>t
                    </sub> + m·MOM
                    <sub>t
                    </sub> + γ·Islamic
                    <sub>i
                    </sub> + ε
                    <sub>i,t
                    </sub>
                  </p>
                  <p>
                    <strong>γ is the entire research question.
                    </strong> If Shariah
                screening changes what an investor gets, after paying for every
                exposure the literature knows how to price, it shows up there
                and nowhere else.
                  </p>
                </div>
                <div className="method-step">
                  <span className="mono">Step 4 · the path, not the spread
                  </span>
                  <h3>Drawdown
                  </h3>
                  <p>Volatility is symmetric and memoryless; investors are neither.
                Maximum drawdown measures the worst peak-to-trough fall actually
                lived through, which is the number that makes people sell
                (Magdon-Ismail & Atiya, 2004; Chekhlov et al., 2005).
                  </p>
                  <p className="formula mono">DD
                    <sub>i,t
                    </sub> = NAV
                    <sub>i,t
                    </sub> / max
                    <sub>s≤t
                    </sub> NAV
                    <sub>i,s
                    </sub> − 1
                  </p>
                  <p className="formula mono">MDD
                    <sub>i
                    </sub> = min
                    <sub>t
                    </sub> DD
                    <sub>i,t
                    </sub>
                  </p>
                </div>
              </div>
              <span className="section-label mono">The six factors, in one sentence each
              </span>
              <div className="rows" id="factor-list" />
              <p className="statement-note">
                Group comparisons use Welch's two-sample t-test: unequal variances,
            which is the right default when one group has three members and the
            other has 217. Fund-level measures are equally weighted across
            funds; the pooled regression is not, because an unbalanced panel
            weights each fund by how many months it contributed.
          
              </p>
            </section>
            {/* ============ 5 · RESULTS ============ */}
            <section className="statement" id="sec-results" data-toc="Results: the comparison">
              <h2>Result 1: the univariate comparison
              </h2>
              <div className="method-row">
                <span className="mono">Significance threshold
                </span>
                <div className="segmented" role="group" aria-label="Significance threshold">
                  <button type="button" data-alpha="0.1" aria-pressed="false">10%
                  </button>
                  <button type="button" data-alpha="0.05" aria-pressed="true">5%
                  </button>
                  <button type="button" data-alpha="0.01" aria-pressed="false">1%
                  </button>
                </div>
                <span className="mono">currently 
                  <span id="alpha-value">5%
                  </span>
                </span>
              </div>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Group means, each metric on its own scale
                  </strong>
                  <span className="mono">
                    <i className="key key-isl" />Islamic 
                    <i className="key key-conv" />Conventional
                  </span>
                </figcaption>
                <div id="chart-dumbbells" />
              </figure>
              <p className="statement-note">
                Every gap points the way the hypothesis predicted: Islamic funds
            look slightly better on Sharpe, slightly less volatile, slightly
            better on Treynor and alpha. Not one of them survives contact with a
            t-test. Beta is the starkest: 0.9148 against 0.9149, a difference in
            the fourth decimal place, p = 0.9923. Whatever Shariah screening
            does to a UK equity fund, it does not change how much of the market
            the fund is carrying. Move the threshold to 10% and nothing changes,
            because the smallest p-value in the table is 0.21.
          
              </p>
            </section>
            <section className="statement" id="sec-regression" data-toc="Results: the factor models">
              <h2>Result 2: six factors, three specifications
              </h2>
              <div className="model-bar">
                <div className="scenarios" role="group" aria-label="Regression specification">
                  <button className="scenario" type="button" data-spec="pooled" aria-pressed="true">Pooled + dummy
                  </button>
                  <button className="scenario" type="button" data-spec="islamic" aria-pressed="false">Islamic only
                  </button>
                  <button className="scenario" type="button" data-spec="conventional" aria-pressed="false">Conventional only
                  </button>
                </div>
                <p className="scenario-blurb" id="forest-blurb">–
                </p>
                <div className="model-actions">
                  <button className="toggle" type="button" id="t-view" aria-pressed="false">Show t-statistics
                  </button>
                </div>
              </div>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Coefficients with 95% confidence intervals
                  </strong>
                  <span className="mono">market factor shown separately below
                  </span>
                </figcaption>
                <div id="chart-forest" />
                <p className="statement-note" id="forest-readout">–
                </p>
              </figure>
              <div className="tiles" id="forest-fit" />
              <p className="statement-note">
                The market factor is left out of the plot above on purpose: at 0.918
            it is two hundred times the size of everything else and would flatten
            the rest into a vertical line. It gets its own exhibit, because what
            it shows is worth seeing on its own.
          
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Market beta, by specification
                  </strong>
                  <span className="mono">estimate and 95% interval
                  </span>
                </figcaption>
                <div id="chart-beta" />
              </figure>
              <p className="statement-note">
                0.918135 pooled. 0.917432 Islamic-only. 0.918144 conventional-only.
            Three regressions, run on samples that differ by a factor of
            seventy-three, agreeing to three decimal places. Whatever else
            screening does, a UK Shariah equity fund is a UK equity fund: it
            carries the same market risk, and the intervals overlap almost
            entirely.
          
              </p>
              <div className="balance-check" data-state="warn" role="status">
                <span className="check-mark" aria-hidden="true">γ
                </span>
                <div>
                  <strong className="check-verdict">Islamic dummy: +0.003901, p = 0.164, 95% CI [−0.001596, +0.009397]
                  </strong>
                  <span className="check-detail">Positive, which is the direction the
                hypothesis wanted. Insignificant, with an interval that contains
                zero and stretches nearly as far into "Islamic funds do worse" as
                into "Islamic funds do better". After controlling for six
                factors, the data cannot tell the two fund types apart.
                  </span>
                </div>
              </div>
              <p className="prose">
                What 
                <em>does
                </em> differ is style. HML is negative everywhere: a
            growth tilt, exactly what removing leveraged financials from an
            index produces. CMA is more negative in the Islamic-only fit
            (−0.0043 against −0.0021), and momentum, significant in the
            conventional sample, vanishes entirely for Islamic funds
            (p = 0.899), consistent with a mandate that forbids the speculative
            trading momentum is harvested by. Different constraints, different
            style exposures, indistinguishable outcomes.
          
              </p>
              <p className="statement-note">
                Switch to t-statistics and a second lesson appears. In the
            conventional-only model almost every factor clears ±1.96, not
            because those effects are large but because 19,313 observations will
            find significance in almost anything. In the Islamic-only model, on
            264 observations, most of the same coefficients cannot be
            distinguished from zero even though they have the same signs and
            similar magnitudes. Sample size is doing more work in this table
            than economics is.
          
              </p>
            </section>
            <section className="statement" id="sec-idio" data-toc="Results: fund-specific risk">
              <h2>Result 3: idiosyncratic risk
              </h2>
              <p className="prose">
                If screening concentrates a portfolio, the concentration should show
            up as risk the market cannot explain: the scatter left over once
            beta has done its work. This is the measure most likely to catch a
            diversification penalty, and the one the "narrower universe" argument
            predicts most directly.
          
              </p>
              <div className="table-scroll" id="ivol-table" />
              <p className="statement-note" id="ivol-readout">–
              </p>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Every fund's monthly volatility, and where the two group means fall
                  </strong>
                  <button className="toggle" type="button" id="strip-log" aria-pressed="true">Log scale
                  </button>
                </figcaption>
                <div id="chart-strip" />
                <p className="statement-note" id="strip-readout">–
                </p>
              </figure>
              <div className="balance-check" data-state="bad" role="status">
                <span className="check-mark" aria-hidden="true">!
                </span>
                <div>
                  <strong className="check-verdict">"Not significant" is not the same as "not different"
                  </strong>
                  <span className="check-detail" id="ivol-mde">–
                  </span>
                </div>
              </div>
            </section>
            <section className="statement" id="sec-drawdown" data-toc="Results: drawdown">
              <h2>Result 4: the only result that came close
              </h2>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Average drawdown from the previous peak, by fund type
                  </strong>
                  <button className="toggle" type="button" id="dd-diff" aria-pressed="false">Show the gap
                  </button>
                </figcaption>
                <div id="chart-drawdown" />
                <p className="statement-note" id="dd-readout">–
                </p>
              </figure>
              <div className="tiles">
                <div className="tile">
                  <span className="mono">Mean maximum drawdown · Islamic
                  </span>
                  <strong className="tile-value">−17.8%
                  </strong>
                  <small>Average across the three funds
                  </small>
                </div>
                <div className="tile" data-tone="bad">
                  <span className="mono">Mean maximum drawdown · Conventional
                  </span>
                  <strong className="tile-value">−23.5%
                  </strong>
                  <small>Average across 217 funds
                  </small>
                </div>
                <div className="tile" data-tone="warn">
                  <span className="mono">p-value
                  </span>
                  <strong className="tile-value">0.068
                  </strong>
                  <small>The closest any test in the study came
                  </small>
                </div>
              </div>
              <p className="prose">
                A 5.7 percentage point difference in the worst fall an investor had
            to sit through, in the direction the hypothesis predicted, at
            p = 0.068. At a 10% threshold this is a result. At 5% it is not. It
            would be easy to write it up either way, and plenty of papers would.
            The honest treatment is to work out what the test could have seen,
            which is the next section, and it changes the reading completely.
          
              </p>
              <p className="statement-note">
                Note what the chart is and is not. Both curves are averages
            
                <em>across funds
                </em>, so they show the shared shape of the period
            (COVID in early 2020, the rate shock through 2022) with fund-level
            dispersion averaged out. That dispersion is precisely what the
            t-test needs in order to conclude anything, which is why a chart
            that looks like a clear separation and a test that returns p = 0.068
            are both telling the truth about different things.
          
              </p>
            </section>
            {/* ============ 6 · POWER ============ */}
            <section className="statement" id="sec-power" data-toc="What three funds could detect">
              <h2>What a sample of three could ever have detected
              </h2>
              <p className="prose">
                This section is not in the submitted dissertation. It is the
            calculation I would insist on now, and it is the part of this work
            I would defend hardest, because it converts a limitation everybody
            writes in their final chapter into a number.
          
              </p>
              <p className="prose">
                A statistical test that finds nothing has two possible readings:
            there was nothing there, or the test could not see. Distinguishing
            them takes a power calculation, asking, before looking at the
            answer, how large a difference this design would have caught. With
            three funds in one group, the answer is unforgiving.
          
              </p>
              <div className="vol-controls is-wide">
                <label className="driver">
                  <span className="label-row">
                    <span>Assumed spread in maximum drawdown across funds (σ)
                    </span>
                    <span className="val" id="power-sd-value">15pp
                    </span>
                  </span>
                  <input type="range" id="power-sd" min="3" max="30" step="1" defaultValue="15" style={{ "--pct": "44.4%" } as CSSProperties} aria-label="Assumed cross-fund standard deviation of maximum drawdown" />
                  <small>The dissertation's own box plot puts conventional fund
                maximum drawdowns between roughly 0 and −99%, which implies a
                cross-fund spread in the region of 15 percentage points. Move it
                and watch how little the conclusion depends on the guess.
                  </small>
                </label>
              </div>
              <div className="tiles">
                <div className="tile" data-tile="power-mde" data-tone="bad">
                  <span className="mono">Smallest difference detectable
                  </span>
                  <strong className="tile-value">–
                  </strong>
                  <small>At 80% power, 5% two-sided
                  </small>
                </div>
                <div className="tile" data-tile="power-detect" data-tone="bad">
                  <span className="mono">Chance of catching the 5.7pp gap
                  </span>
                  <strong className="tile-value">–
                  </strong>
                  <small>If that gap were real
                  </small>
                </div>
                <div className="tile" data-tile="power-needed">
                  <span className="mono">Islamic funds actually needed
                  </span>
                  <strong className="tile-value">–
                  </strong>
                  <small>To find it four times in five
                  </small>
                </div>
              </div>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>The smallest drawdown difference detectable, by sample size
                  </strong>
                  <span className="mono">80% power · 5% two-sided · noncentral t
                  </span>
                </figcaption>
                <div id="chart-power" />
                <p className="statement-note" id="power-readout">–
                </p>
              </figure>
              <p className="prose">
                There is a further twist, and it is the reason no amount of extra
            data collection would have rescued this design. Precision in a
            two-sample comparison is governed by the 
                <em>smaller
                </em> group.
            Raising the conventional count from 217 to a million moves the
            detectable difference by well under a percentage point. The 217
            funds are not the constraint and never were. Three is.
          
              </p>
              <div className="callout">
                <span className="mono">The finding, restated properly
                </span>
                <p>
                  <strong>This study did not find that UK Islamic funds carry the
              same risk as conventional ones. It found that a sample of three
              cannot tell.
                  </strong>
                </p>
                <p className="statement-note">Those are different sentences, and only one
              of them is supported. Every conclusion on this page is written to
              be the second.
                </p>
              </div>
            </section>
            {/* ============ 7 · THE AUDIT ============ */}
            <section className="statement" id="sec-audit" data-toc="Reading my own numbers back">
              <h2>Reading my own numbers back
              </h2>
              <p className="prose">
                Building this page meant extracting the underlying series out of the
            submitted document and recomputing things. One number does not
            survive that, and burying it would be worse than the error.
          
              </p>
              <div className="table-scroll">
                <table className="fin-table">
                  <thead>
                    <tr>
                      <th>What was reported
                      </th>
                      <th>Value
                      </th>
                      <th>What it implies per month
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Mean of the excess-return column
                      </th>
                      <td>−0.0732
                      </td>
                      <td>−7.3%
                      </td>
                    </tr>
                    <tr>
                      <th>Islamic Sharpe × its volatility
                      </th>
                      <td>−2.0948 × 0.0356
                      </td>
                      <td>−7.5%
                      </td>
                    </tr>
                    <tr>
                      <th>Islamic Treynor × its beta
                      </th>
                      <td>−0.0758 × 0.9148
                      </td>
                      <td>−6.9%
                      </td>
                    </tr>
                    <tr className="is-total">
                      <th>Implied average excess return
                      </th>
                      <td>–
                      </td>
                      <td className="is-negative">≈ −7% a month
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="prose">
                Three independent routes through the results table land on the same
            impossible number. UK equity funds did not lose seven per cent a
            month above cash for seven and a half years, over the same window
            the FTSE 100 rose. The level of the excess-return series carries a
            units artefact: a risk-free rate on one scale subtracted from returns
            on another.
          
              </p>
              <p className="prose">
                What that does and does not damage is worth being precise about,
            because the instinct is to assume everything is ruined and the truth
            is narrower.
          
              </p>
              <div className="grid-2">
                <div className="cell">
                  <span className="tag mono">Affected
                  </span>
                  <h3>Anything that reads the level
                  </h3>
                  <ul className="checks">
                    <li>Sharpe ratios: a monthly figure of −2.09 is not interpretable and should not be quoted
                    </li>
                    <li>Treynor ratios, for the same reason
                    </li>
                    <li>The absolute size of Jensen's alpha
                    </li>
                    <li>The pooled intercept as a statement about abnormal return
                    </li>
                  </ul>
                </div>
                <div className="cell">
                  <span className="tag mono">Not affected
                  </span>
                  <h3>Anything that reads a slope or a difference
                  </h3>
                  <ul className="checks">
                    <li>Market beta: a constant shift in both sides of a regression moves the intercept, not the slope
                    </li>
                    <li>Every factor loading, for the same reason
                    </li>
                    {/* One span, not bare inline markup: .checks li is a
                     two-column grid, and a stray <strong> next to a text
                     node becomes a third grid item that pushes the row
                     past the viewport on a phone. */}
                    <li>
                      <span>
                        <strong>The Islamic dummy
                        </strong>: the offset is identical for both groups, so it cancels in the comparison
                      </span>
                    </li>
                    <li>Volatility, idiosyncratic volatility and drawdown, none of which touch the risk-free rate at all
                    </li>
                    <li>Every p-value in the study
                    </li>
                  </ul>
                </div>
              </div>
              <p className="prose">
                So the research question survives intact and the presentation of the
            risk-adjusted ratios does not. The right correction is to rebuild the
            risk-free series on the same scale as the returns and re-derive
            Sharpe and Treynor; the ranking between groups would not move,
            because a common constant cannot reorder two groups.
          
              </p>
              <p className="statement-note">
                This is on the page because a portfolio piece that only shows the
            parts that came out clean is a sales document. Finding this in your
            own submitted work, tracing exactly how far it propagates, and
            publishing the propagation map is a more useful demonstration of how
            somebody handles data than any result would be.
          
              </p>
            </section>
            {/* ============ 8 · DISCUSSION ============ */}
            <section className="statement" id="sec-discussion" data-toc="What it means">
              <h2>What it means
              </h2>
              <div className="principles">
                <div className="principle">
                  <h3>Different constraints, similar outcomes
                  </h3>
                  <p>In a developed market, a Shariah-compliant equity fund is an
                equity fund with a rulebook. It carries the same market risk,
                falls at the same time, and recovers on roughly the same
                schedule. The constraints show up in 
                    <em>style
                    </em> (a growth
                tilt, no momentum exposure), not in the level of risk. That is
                consistent with Reddy et al. (2017), the one prior UK study, and
                inconsistent with the emerging-market findings that motivated the
                hypothesis.
                  </p>
                </div>
                <div className="principle">
                  <h3>Why the emerging-market results don't travel
                  </h3>
                  <p>Pakistan and Bangladesh have dozens of Shariah funds, shallower
                markets, and conventional peers with far more heterogeneous
                strategies. Both halves of that make differences easier to see:
                more Islamic funds to measure, and more dispersion to measure
                them against. Neither condition holds in the UK.
                  </p>
                </div>
                <div className="principle">
                  <h3>For an investor with a religious constraint
                  </h3>
                  <p>The practical finding is the useful one, and it is
                reassuring rather than exciting: on this evidence, screening does
                not appear to cost return, and it does not appear to buy safety
                either. The "cost of conscience" (Renneboog et al., 2008) is not
                visible in UK data. Neither is a defensive premium.
                  </p>
                </div>
                <div className="principle">
                  <h3>For anybody designing the next study
                  </h3>
                  <p>Do the power calculation first. If the answer says the design
                cannot resolve a difference smaller than the quantity being
                measured, the fix is a different design (pooled European
                domiciles, a matched-pair construction, or fund-level
                bootstrapping), not a larger control group and a hopeful
                t-test.
                  </p>
                </div>
              </div>
            </section>
            {/* ============ 9 · LIMITATIONS ============ */}
            <section className="statement" id="sec-limits" data-toc="Limitations">
              <h2>Limitations, ranked by how much they matter
              </h2>
              <div className="rows">
                <div className="row">
                  <span className="k mono">1 · Three funds
                  </span>
                  <span className="v">Everything else on this list is a footnote next to
                it. Three funds caps the precision of every subgroup comparison
                in the study, and no treatment of the other 217 can lift that
                cap. It is a property of the UK market, not a mistake in the
                sampling, which is exactly why the honest response is a power
                calculation rather than an apology.
                  </span>
                </div>
                <div className="row">
                  <span className="k mono">2 · Standard errors that assume too much
                  </span>
                  <span className="v">The pooled regression uses ordinary OLS standard
                errors on panel data. Fund returns are serially correlated within
                a fund and correlated across funds in the same month; plain OLS
                errors are too small under both conditions (Petersen, 2009).
                Clustering by fund and by month, or Newey–West corrections
                (Newey & West, 1987), would widen every interval on this
                page. Since the headline coefficient is already insignificant,
                the correction can only reinforce the conclusion, but the
                intervals as printed are optimistic.
                  </span>
                </div>
                <div className="row">
                  <span className="k mono">3 · The units artefact
                  </span>
                  <span className="v">Covered in full 
                    <a href="#sec-audit">above
                    </a>.
                Contained to the level of the risk-adjusted ratios; it does not
                reach the comparisons.
                  </span>
                </div>
                <div className="row">
                  <span className="k mono">4 · Survivorship
                  </span>
                  <span className="v">Funds that closed during the window drop out of a
                Bloomberg screen taken at the end of it. That biases the sample
                towards survivors, and it plausibly bites harder on the
                conventional side, where there were more funds to fail.
                  </span>
                </div>
                <div className="row">
                  <span className="k mono">5 · Residual volatility is not purely idiosyncratic
                  </span>
                  <span className="v">IVOL is defined as what a one-factor model leaves
                behind. Anything systematic the model omits sits in there too,
                and idiosyncratic volatility is known to have a common factor of
                its own (Herskovic et al., 2016). The measure is a residual, and
                it should be read as one.
                  </span>
                </div>
                <div className="row">
                  <span className="k mono">6 · Drawdown depends on the window
                  </span>
                  <span className="v">Maximum drawdown is path-dependent: move the start
                or end date and it can change materially even when volatility
                does not (Magdon-Ismail & Atiya, 2004). A single window
                cannot separate a defensive fund from a lucky start date.
                  </span>
                </div>
              </div>
              <p className="prose">
                What I would do differently, in order: run the power calculation
            before collecting anything; widen the universe to UK-available rather
            than UK-domiciled funds, and to European domiciles if that is still
            too thin; cluster the standard errors; and pre-register the
            regime split so that "Islamic funds are more defensive in a crisis"
            is a hypothesis tested rather than a pattern noticed.
          
              </p>
            </section>
            {/* ============ REFERENCES ============ */}
            <section className="statement" id="sec-references" data-toc="References">
              <h2>References
              </h2>
              <p className="statement-note" id="reference-count">–
              </p>
              <details className="ref-details">
                <summary>Show the reference list
                </summary>
                <div id="reference-list" />
              </details>
            </section>
          </section>
          {/* ============ HOW THIS PAGE IS BUILT ============ */}
          <section>
            <span className="section-label mono">How this page is built
            </span>
            <div className="principles">
              <div className="principle">
                <h3>The numbers are the submitted ones
                </h3>
                <p>Every table is transcribed from the dissertation. Every series
               (the FTSE 100 line, the Islamic index, both drawdown curves, the
               216 fund volatilities, all 19,797 excess returns) was extracted
               from the data caches Word stores inside the document's charts.
               Nothing was read off a picture, and nothing was regenerated to
               look better.
                </p>
              </div>
              <div className="principle">
                <h3>The statistics run in your browser
                </h3>
                <p>Welch's t-test, Student's t distribution, and the noncentral t
               behind every power figure are implemented from scratch in about
               three hundred lines. The power sliders are not lookups against a
               table; they solve for the detectable difference each time you
               move them.
                </p>
              </div>
              <div className="principle">
                <h3>Checked against things that already have answers
                </h3>
                <p>141 tests on the engine: log-gamma and the incomplete beta
               against closed forms, t-quantiles against printed tables,
               Cohen's classic sample sizes for 80% power, the noncentral t
               collapsing to the central one at zero, and every transcribed
               coefficient re-checked so that t equals b over its standard error
               and each interval agrees with its own p-value.
                </p>
              </div>
              <div className="principle">
                <h3>The p-value is reproduced, not repeated
                </h3>
                <p>The dissertation reports p = 0.877487 for the idiosyncratic risk
               comparison. This page recomputes it from the printed group means
               and gets 0.877441, with entirely different code. That agreement
               is the reason to trust the rest of the arithmetic here.
                </p>
              </div>
              <div className="principle">
                <h3>What could not be published, isn't
                </h3>
                <p>The fund-level NAV panel is Bloomberg's and cannot be
               redistributed, so it is not here. What is here is everything
               derived from it that can be: the summary statistics, the
               distributions, the group series. Where a number is missing, the
               page says so instead of standing in a plausible substitute.
                </p>
              </div>
              <div className="principle">
                <h3>Drawn, not plotted
                </h3>
                <p>Every chart is inline SVG written by hand, no plotting library,
               nothing fetched. They inherit the site's own colours, so they
               work in both themes, print in black and white, and add nothing to
               the page weight worth measuring.
                </p>
              </div>
            </div>
          </section>
          <div className="note">
            This is academic research, presented as research. It is not investment
        advice, not a recommendation about any fund or fund type, and not a
        statement about how Shariah-compliant funds will behave in future. The
        central finding is a limit on what the available UK data can establish.
      
          </div>
          <Band
            label={"Working together"}
            title={"Need a question answered with data, and answered honestly?"}
            actions={<>
              <ButtonLink kind="solid" onAccent href="/contact.html">{"Start a conversation"}</ButtonLink>
              <ButtonLink kind="ghost" onAccent href="/portfolio.html">{"Back to the portfolio"}</ButtonLink>
            </>}
          >
            <p>{"Empirical finance work: panel construction, factor models, risk measurement and the power analysis that tells you whether the design can answer the question at all. Delivered with the code, the assumptions written down, and the limitations stated before anyone has to ask."}</p>
          </Band>
        </div>
      </main>
  );
}
