/* ============================================================
   /portfolio/dsex.html

   Ported out of `aab/portfolio/dsex.html` with archive/TRANSITION.md Stage 11.3,
   words unchanged: this is one of the seven case studies.

   The numbers are not here and must not be. Every figure on this
   page is computed in the browser by `/portfolio/dsex.js`
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
import { Button, ButtonLink } from "../../../../components/ui/button";
import { StatTile } from "../../../../components/ui/stat";
import { Eyebrow, SectionLabel } from "../../../../components/ui/label";

export const metadata: Metadata = pageMeta({
  path: "/portfolio/dsex.html",
  title: "Index returns: volatility & drawdowns · Reiad's Library",
  description: "Rolling volatility, drawdown decomposition, tail risk and holding-period outcomes for an equity index, six linked views, and a CSV import so you can run the same analysis on real data.",
  ogTitle: "Index returns: volatility & drawdowns",
  ogDescription: "Rolling volatility, drawdowns, tail risk and what holding periods actually teach, with your own data if you have it.",
  card: "dsex",
});

export default function Page() {
  return (

      <main id="main">
        <div className="wrap">
          <div className="hero">
            <Eyebrow>Case study · Data analysis · Python-equivalent
            </Eyebrow>
            <h1>Volatility is a statistic. A drawdown is a year of your life.
            </h1>
            <p className="lede">
              Six views over one price series: the index itself, rolling volatility,
          the underwater curve, the shape of the return distribution against a
          normal one, and, the reason for all of it, what actually happened to
          people who held for a day, a year, or five.
        
            </p>
            <p className="model-co">
              <strong id="series-name">–
              </strong>
              <span className="mono" id="series-range">–
              </span>
            </p>
          </div>
          {/* ============ THE DATA, STATED UP FRONT ============ */}
          <div className="balance-check" id="sim-banner" data-state="warn" role="status">
            <span className="check-mark" aria-hidden="true">!
            </span>
            <div>
              <strong className="check-verdict">This series is simulated, not the real DSEX
              </strong>
              <span className="check-detail" id="series-note">–
              </span>
            </div>
          </div>
          <section id="dsex" className="model">
            <div className="model-bar">
              <div className="scenarios" role="group" aria-label="Data source">
                <button className="scenario" type="button" id="use-sim" aria-pressed="true">Simulated series
                </button>
              </div>
              <p className="scenario-blurb">Have real data? Drop a CSV below and every
            number on this page becomes about your series.
              </p>
              <div className="model-actions">
                <Button kind="ghost" id="download-csv">Download the analysis
                </Button>
              </div>
            </div>
            {/* ============ LOAD YOUR OWN ============ */}
            <div className="csv-panel" id="csv-drop">
              <div className="csv-head">
                <h2>Run this on real data
                </h2>
                <p>Two columns: a date and a closing level. DSE publishes daily index
               history; export it, drop it here, and the whole page recomputes.
               
                  <strong>Nothing is uploaded
                  </strong>: the parsing and the maths
               happen in your browser, and the file never leaves your machine.
                </p>
              </div>
              <div className="csv-controls">
                <label className="btn btn-ghost csv-file-label">
                  Choose a CSV
              
                  <input type="file" id="csv-file" accept=".csv,.txt,text/csv" hidden />
                </label>
                <span className="mono">or drag one here, or paste below
                </span>
              </div>
              <label className="csv-paste-label">
                <span className="mono">Paste rows
                </span>
                <textarea id="csv-paste" rows={3} spellCheck="false" placeholder={"2024-01-01,6120.55\n2024-01-02,6180.10\n2024-01-03,6099.00"} />
              </label>
              <p className="csv-status" id="csv-status" />
            </div>
            {/* ============ HEADLINES ============ */}
            <div className="tiles">
              <StatTile label="Annualised return"
                        note="Compound, over the whole series"
                        fills="cagr" />
              <StatTile label="Annualised volatility" note="Daily sd × √252" fills="vol" />
              <StatTile label="Maximum drawdown"
                        note="Worst fall from a previous peak"
                        fills="mdd" />
              <StatTile label="Best single day" note="" fills="best" />
              <StatTile label="Worst single day" note="" fills="worst" />
              <StatTile label="Excess kurtosis"
                        note="0 would be a normal distribution"
                        fills="kurt" />
            </div>
            {/* ============ 1 · THE INDEX ============ */}
            <figure className="chart-card wide-chart">
              <figcaption>
                <strong>The index, with its three worst drawdowns shaded
                </strong>
                <button className="toggle" type="button" id="log-scale" aria-pressed="false">Log scale
                </button>
              </figcaption>
              <div id="chart-index" />
              <p className="statement-note">A linear axis makes early moves look trivial
            and recent ones look dramatic; on a log axis equal vertical distances
            are equal 
                <em>percentage
                </em> moves, which is what a holder actually
            experiences. Worth toggling: it changes the story the chart tells.
              </p>
            </figure>
            {/* ============ 2 · ROLLING VOLATILITY ============ */}
            <section className="statement">
              <h2>Volatility is not one number
              </h2>
              <div className="vol-controls">
                <label className="driver">
                  <span className="label-row">
                    <span>Rolling window
                    </span>
                    <span className="val" id="vol-window-value">60 days
                    </span>
                  </span>
                  <input type="range" id="vol-window" min="10" max="250" step="5" defaultValue="60" style={{ "--pct": "20.8%" } as CSSProperties} aria-label="Rolling volatility window in days" />
                  <small>A short window reacts fast and is noisy; a long one is smooth
                and late. There is no correct answer, which is the point of making
                it a control rather than a constant.
                  </small>
                </label>
              </div>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Rolling annualised volatility
                  </strong>
                </figcaption>
                <div id="chart-vol" />
              </figure>
              <p className="statement-note" id="vol-readout">–
              </p>
            </section>
            {/* ============ 3 · DRAWDOWNS ============ */}
            <section className="statement">
              <h2>Underwater
              </h2>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>How far below the previous peak, every day
                  </strong>
                </figcaption>
                <div id="chart-underwater" />
              </figure>
              <p className="statement-note">The flat stretches at the top are the only
            times a holder was making new money. Everything below the line is
            time spent waiting to get back to where they already were, and that
            waiting, not the volatility number, is what makes people sell.
              </p>
              <div className="table-scroll" id="table-episodes" />
              <p className="statement-note">An episode runs peak → trough → the day the
            index first regains that peak. One still underwater at the end of the
            data is reported as such rather than quietly closed off, because
            pretending it ended would understate exactly the risk being measured.
              </p>
            </section>
            {/* ============ 4 · THE DISTRIBUTION ============ */}
            <section className="statement">
              <h2>The tails are fatter than the textbook
              </h2>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Daily returns, against a normal curve with the same mean and standard deviation
                  </strong>
                </figcaption>
                <div id="chart-hist" />
              </figure>
              <div className="table-scroll" id="table-tails" />
              <p className="statement-note" id="tail-readout">–
              </p>
            </section>
            {/* ============ 5 · CLUSTERING ============ */}
            <section className="statement">
              <h2>Bad days arrive together
              </h2>
              <p className="statement-note" id="cluster-readout">–
              </p>
            </section>
            {/* ============ 6 · HOLDING PERIODS ============ */}
            <section className="statement">
              <h2>What holding periods actually teach
              </h2>
              <figure className="chart-card wide-chart">
                <figcaption>
                  <strong>Share of holding periods that ended positive
                  </strong>
                  <span className="mono">every overlapping window in the series
                  </span>
                </figcaption>
                <div id="chart-horizons" />
              </figure>
              <div className="horizon-picker" role="group" aria-label="Holding period">
                <span className="mono">Look closer at
                </span>
                <button type="button" data-horizon="21" aria-pressed="false">1 month
                </button>
                <button type="button" data-horizon="63" aria-pressed="false">3 months
                </button>
                <button type="button" data-horizon="252" aria-pressed="true">1 year
                </button>
                <button type="button" data-horizon="504" aria-pressed="false">2 years
                </button>
                <button type="button" data-horizon="1260" aria-pressed="false">5 years
                </button>
              </div>
              <div className="tiles">
                <StatTile label="Ended positive"
                          note={<>Of all <span id="hp-label">1 year </span> windows</>}
                          fills="hppos" />
                <StatTile label="Worst outcome" note="The unluckiest start date" fills="hpworst" />
                <StatTile label="Median outcome" note="The typical experience" fills="hpmed" />
                <StatTile label="Best outcome" note="The luckiest start date" fills="hpbest" />
              </div>
              <p className="statement-note" id="hp-readout">–
              </p>
              <p className="statement-note">These windows overlap, on purpose. The
            question being asked is "if I had started on any given day", and
            every given day was a real starting point for somebody. They are not
            independent draws and this is not a significance test; it is a record
            of what happened.
              </p>
            </section>
            {/* ============ CALENDAR ============ */}
            <section className="statement">
              <h2>Year by year
              </h2>
              <div className="table-scroll" id="table-calendar" />
            </section>
          </section>
          {/* ============ METHOD ============ */}
          <section>
            <SectionLabel>How this analysis is built
            </SectionLabel>
            <div className="principles">
              <div className="principle">
                <h3>The data question, answered honestly
                </h3>
                <p>The shipped series is simulated and labelled as such on the page,
               in the banner and in the export. Inventing numbers and calling
               them the DSEX would be inventing that index's record, and anyone
               who checked would find it doesn't match. What's on display is the
               method, so the page takes your CSV and runs the identical
               analysis on real prices.
                </p>
              </div>
              <div className="principle">
                <h3>Nothing is uploaded
                </h3>
                <p>The CSV is parsed and analysed in the browser. There is no
               endpoint, no storage, and no request, which is both a privacy
               property and the reason it works on a file you would not be
               allowed to send anywhere.
                </p>
              </div>
              <div className="principle">
                <h3>Windows that admit what they are
                </h3>
                <p>Rolling volatility returns nothing until the window is full,
               rather than quietly computing a three-day "sixty-day volatility"
               at the start of the series. A chart that begins with a confident
               wrong number is worse than one that begins late.
                </p>
              </div>
              <div className="principle">
                <h3>Drawdowns measured properly
                </h3>
                <p>Peak to trough to recovery, as distinct episodes, with an
               unrecovered one flagged instead of closed at the last data point.
               The recovery time is usually the more painful number and the one
               most summaries leave out.
                </p>
              </div>
              <div className="principle">
                <h3>Tail risk past the headline
                </h3>
                <p>Value-at-risk says how bad a bad day is at the threshold;
               expected shortfall says how bad they are once you're past it. Both
               are here, at 95% and 99%, next to a count of how many days moved
               beyond three, four and five standard deviations against what a
               normal distribution would allow.
                </p>
              </div>
              <div className="principle">
                <h3>Checked against hand-worked cases
                </h3>
                <p>Fifty-two tests on the engine: standard deviations against known
               values, drawdowns on a seven-point series checkable by eye,
               holding periods on monotonic series that must come out 100% and
               0%, VaR against its own empirical frequency, and a CSV parser
               fed headers, reversed files, junk rows and quoted thousands
               separators.
                </p>
              </div>
            </div>
          </section>
          <div className="note">
            The bundled series is simulated with deliberately realistic behaviour
        (volatility clustering, fat tails, multi-year drawdowns), so the analysis
        has something worth analysing. It is not the Dhaka Stock Exchange's
        history, not a forecast, and not advice about any security. Load real
        prices to make every figure on this page real.
      
          </div>
          <Band
            label={"Working together"}
            title={"Have a series that needs interrogating?"}
            actions={<>
              <ButtonLink kind="solid" onAccent href="/contact.html">{"Start a conversation"}</ButtonLink>
              <ButtonLink kind="ghost" onAccent href="/portfolio.html">{"Back to the portfolio"}</ButtonLink>
            </>}
          >
            <p>{"Return and risk analysis in Python or R: cleaning, statistics, charts and a written answer to the question you actually asked, with the notebook handed over so the work can be rerun."}</p>
          </Band>
        </div>
      </main>
  );
}
