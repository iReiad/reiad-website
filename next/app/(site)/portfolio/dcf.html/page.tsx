/* ============================================================
   /portfolio/dcf.html

   Ported out of `aab/portfolio/dcf.html` with archive/TRANSITION.md Stage 11.3,
   words unchanged: this is one of the seven case studies.

   The numbers are not here and must not be. Every figure on this
   page is computed in the browser by `/portfolio/dcf.js`
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
import { ButtonLink } from "../../../../components/ui/button";
import { StatTile } from "../../../../components/ui/stat";
import { Eyebrow, SectionLabel } from "../../../../components/ui/label";

export const metadata: Metadata = pageMeta({
  path: "/portfolio/dcf.html",
  title: "DCF with sensitivity tables · DSE-listed manufacturer · Reiad's Library",
  description: "A working discounted cash flow valuation: WACC built up from its parts, two terminal value methods that cross-check each other, and a live two-way sensitivity table on WACC and terminal growth.",
  ogTitle: "DCF with sensitivity tables · DSE-listed manufacturer",
  ogDescription: "WACC built up from its parts, two terminal value methods that cross-check each other, and a live two-way sensitivity table.",
  card: "dcf",
});

export default function Page() {
  return (

      <main id="main">
        <div className="wrap">
          <div className="hero">
            <Eyebrow>Case study · Valuation · Excel-equivalent
            </Eyebrow>
            <h1>A DCF that shows its working, and a sensitivity table that earns its place.
            </h1>
            <p className="lede">
              The discount rate is built up from its parts rather than typed in. The
          terminal value can be taken two ways, and each one is quoted back as
          the other, a growth assumption stated as the exit multiple it amounts
          to, and vice versa. Every cell in the sensitivity grid is a full
          revaluation, and clicking one adopts it.
        
            </p>
            <p className="model-co">
              <strong id="co-name">–
              </strong>
              <span className="mono" id="co-unit">–
              </span>
            </p>
            <p className="note note-inline" id="co-note">–
            </p>
            <p className="lede" style={{ fontSize: "0.95rem" }}>
              The cash flows come from the
          
              <a href="/portfolio/three-statement.html">three-statement model
              </a> in
          this same portfolio, not a second set of invented numbers. Change the
          operating scenario below and the valuation moves, because the forecast
          does.
        
            </p>
          </div>
          <section id="dcf" className="model">
            <div className="model-bar">
              <div className="scenarios" role="group" aria-label="Operating scenario">
                <button className="scenario" type="button" data-scenario="base" aria-pressed="true">Base
                </button>
                <button className="scenario" type="button" data-scenario="upside" aria-pressed="false">Upside
                </button>
                <button className="scenario" type="button" data-scenario="downside" aria-pressed="false">Downside
                </button>
              </div>
              <p className="scenario-blurb" id="scenario-blurb">–
              </p>
              <div className="model-actions">
                <button className="btn btn-ghost" type="button" id="download-csv">Download CSV
                </button>
                <button className="btn btn-ghost" type="button" id="copy-link">Copy this valuation's link
                </button>
              </div>
            </div>
            {/* ============ THE ANSWER ============ */}
            <div className="verdict-card" id="verdict" data-state="up" role="status">
              <div className="verdict-main">
                <span className="mono">Value per share
                </span>
                <strong className="verdict-value">–
                </strong>
              </div>
              <p className="verdict-detail">–
              </p>
            </div>
            <div className="tiles">
              <StatTile label="WACC" note="The discount rate, built up below" fills="wacc" />
              <StatTile label="Cost of equity" note="Risk-free + beta × ERP + country" fills="ke" />
              <StatTile label="Enterprise value" note="BDT lakh" fills="ev" />
              <StatTile label="Equity value" note="After bridging out net debt" fills="equity" />
              <StatTile label="Terminal value share"
                        note="Of enterprise value: above 80% is a warning"
                        fills="terminal" />
              <StatTile label="Implied EV/EBITDA" note="At the DCF value, on FY25E" fills="entry" />
            </div>
            <div className="model-body">
              <aside className="model-drivers">
                <div className="drivers-head">
                  <h2>Inputs
                  </h2>
                  <button className="chip" type="button" id="reset-drivers" hidden>Reset
                  </button>
                </div>
                <p className="drivers-note">The greyed input is the one the current
              terminal value method doesn't use: dimmed rather than hidden, so
              nothing disappears from under your cursor.
                </p>
                <div className="method-row">
                  <span className="mono">Terminal value
                  </span>
                  <div className="segmented" role="group" aria-label="Terminal value method">
                    <button type="button" data-tv="gordon" aria-pressed="true">Gordon growth
                    </button>
                    <button type="button" data-tv="multiple" aria-pressed="false">Exit multiple
                    </button>
                  </div>
                </div>
                <div className="method-row">
                  <span className="mono">Discounting
                  </span>
                  <button className="toggle" type="button" id="mid-year" aria-pressed="false">Mid-year convention
                  </button>
                </div>
                <div id="drivers" />
              </aside>
              <div className="model-charts">
                <figure className="chart-card">
                  <figcaption>
                    <strong>From enterprise value to equity value
                    </strong>
                  </figcaption>
                  <div className="bridge" id="bridge" />
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>Two-way sensitivity
                    </strong>
                    <span className="segmented" role="group" aria-label="Sensitivity axis">
                      <button type="button" data-axis="terminalGrowth" aria-pressed="true">vs growth
                      </button>
                      <button type="button" data-axis="exitMultiple" aria-pressed="false">vs multiple
                      </button>
                    </span>
                  </figcaption>
                  <div className="table-scroll" id="sensitivity" />
                  <p className="statement-note" id="grid-note">–
                  </p>
                </figure>
              </div>
            </div>
            <section className="statement">
              <h2>Unlevered free cash flow
              </h2>
              <div className="table-scroll" id="fcf-table" />
              <p className="statement-note" id="cross-check">–
              </p>
              <p className="statement-note">Interest is deliberately absent. The cost of
            debt already sits inside the discount rate, so deducting it here as
            well would charge for the same financing twice, which is why this
            builds to an enterprise value, from which net debt is bridged out.
              </p>
            </section>
          </section>
          {/* ============ HOW IT'S BUILT ============ */}
          <section>
            <SectionLabel>How this valuation is built
            </SectionLabel>
            <div className="principles">
              <div className="principle">
                <h3>The cash flows aren't typed in
                </h3>
                <p>They come from the three-statement model: EBIT, depreciation,
               capex and the working-capital movement, all from a forecast whose
               balance sheet balances. The commonest fault in a spreadsheet DCF
               is a valuation tab whose EBITDA stopped agreeing with the model
               two tabs to the left.
                </p>
              </div>
              <div className="principle">
                <h3>The discount rate is built, not chosen
                </h3>
                <p>Risk-free, equity risk premium, beta, country premium, cost of
               debt, tax shield and target weights, each one visible and each
               one movable. A WACC that arrives as a single number is a WACC
               nobody can argue with, which is not a virtue.
                </p>
              </div>
              <div className="principle">
                <h3>Each terminal value checks the other
                </h3>
                <p>A Gordon growth assumption is quoted back as the exit multiple it
               amounts to; an exit multiple is quoted back as the perpetuity
               growth it assumes. Most disagreements about a DCF are really
               disagreements about the terminal value, and this puts the
               argument where it belongs.
                </p>
              </div>
              <div className="principle">
                <h3>Impossible cells say so
                </h3>
                <p>Gordon growth needs the discount rate above the growth rate.
               Where the grid crosses that line the cell reads n/a instead of a
               number, because a negative denominator produces a confident,
               enormous and completely wrong valuation.
                </p>
              </div>
              <div className="principle">
                <h3>Conventions on the surface
                </h3>
                <p>Mid-year discounting is a toggle, not a hidden choice, and when
               it's on the terminal value still discounts at the full final year
 , it's a lump sum at the end of the forecast, not a flow through
               it. The share of value sitting in the terminal value is shown,
               and flagged when it passes 80%.
                </p>
              </div>
              <div className="principle">
                <h3>Tested against first principles
                </h3>
                <p>Fifty checks on the engine alone: discount factors derived
               independently, both terminal value methods round-tripped through
               their own implied assumptions, every sensitivity cell verified as
               a genuine revaluation, and the grid checked so that a cell is
               refused if and only if growth meets or beats the discount rate.
                </p>
              </div>
            </div>
          </section>
          <div className="note">
            Illustrative valuation of the same composite company as the operating
        model, not the filed accounts of any real business, and not a forecast
        of, or advice about, any actual security. Share count and market price
        are illustrative. What's on display is the method: the same structure I
        build in Excel, with a client's own numbers and their own comparables.
      
          </div>
          <Band
            label={"Working together"}
            title={"Need a valuation that survives a second reader?"}
            actions={<>
              <ButtonLink kind="solid" onAccent href="/contact.html">{"Start a conversation"}</ButtonLink>
              <ButtonLink kind="ghost" onAccent href="/portfolio.html">{"Back to the portfolio"}</ButtonLink>
            </>}
          >
            <p>{"DCFs, comparable-company analysis and operating models in Excel, assumptions in one place, conventions stated, and the sensitivity tables built before anyone asks for them."}</p>
          </Band>
        </div>
      </main>
  );
}
