/* ============================================================
   /portfolio/three-statement.html

   Ported out of `aab/portfolio/three-statement.html` with archive/TRANSITION.md Stage 11.3,
   words unchanged: this is one of the seven case studies.

   The numbers are not here and must not be. Every figure on this
   page is computed in the browser by `/portfolio/three-statement.js`
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
  path: "/portfolio/three-statement.html",
  title: "Three-statement model · DSE-listed manufacturer · Reiad's Library",
  description: "A working three-statement financial model for a DSE-listed Bangladeshi manufacturer: linked income statement, balance sheet and cash flow, editable assumptions, a scenario switch and a live balance check.",
  ogTitle: "Three-statement model · DSE-listed manufacturer",
  ogDescription: "Linked income statement, balance sheet and cash flow. Move an assumption and watch all three move, with a live balance check.",
  card: "three-statement",
});

export default function Page() {
  return (

      <main id="main">
        <div className="wrap">
          <div className="hero">
            <Eyebrow>Case study · Financial model · Excel-equivalent
            </Eyebrow>
            <h1>A three-statement model you can actually push around.
            </h1>
            <p className="lede">
              Income statement, balance sheet and cash flow for a DSE-listed
          manufacturer, properly linked, so a change to one assumption moves all
          three. Drag any driver and watch the statements, the charts and the
          credit metrics move with it. The balance check at the top is computed,
          not asserted: if the model were wrong, it would say so.
        
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
          <section id="model" className="model">
            {/* ============ SCENARIO ============ */}
            <div className="model-bar">
              <div className="scenarios" role="group" aria-label="Scenario">
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
                <Button kind="ghost" id="download-csv">Download CSV
                </Button>
                <Button kind="ghost" id="copy-link">Copy this model's link
                </Button>
              </div>
            </div>
            {/* ============ THE BALANCE CHECK ============ */}
            <div className="balance-check" id="balance-check" data-state="ok" role="status">
              <span className="check-mark" aria-hidden="true">✓
              </span>
              <div>
                <strong className="check-verdict">–
                </strong>
                <span className="check-detail">–
                </span>
              </div>
            </div>
            {/* ============ HEADLINES ============ */}
            <div className="tiles">
              <StatTile label="Revenue CAGR" note="FY24A → FY29E" fills="cagr" />
              <StatTile label="Exit EBITDA margin" note="FY29E" fills="ebitda" />
              <StatTile label="Net debt / EBITDA"
                        note="FY29E: the covenant everyone watches"
                        fills="leverage" />
              <StatTile label="Cumulative free cash flow" note="Five years, BDT lakh" fills="fcf" />
              <StatTile label="Return on equity" note="FY29E" fills="roe" />
              <StatTile label="Interest cover" note="EBIT ÷ interest, FY29E" fills="cover" />
            </div>
            <p className="note note-inline" id="revolver-note" hidden />
            {/* ============ DRIVERS + CHARTS ============ */}
            <div className="model-body">
              <aside className="model-drivers">
                <div className="drivers-head">
                  <h2>Assumptions
                  </h2>
                  <button className="chip" type="button" id="reset-drivers" hidden>Reset
                  </button>
                </div>
                <p className="drivers-note">Every one of these is live. Edited drivers are
              marked, and the link at the top carries your version of the model.
                </p>
                <div id="drivers" />
              </aside>
              <div className="model-charts">
                <figure className="chart-card">
                  <figcaption>
                    <strong>Revenue and EBITDA
                    </strong>
                    <span className="mono">
                      <i className="key key-revenue" /> Revenue
                  
                      <i className="key key-ebitda" /> EBITDA
                    </span>
                  </figcaption>
                  <div id="chart-revenue" />
                </figure>
                <figure className="chart-card">
                  <figcaption>
                    <strong>Cash and net debt
                    </strong>
                    <span className="mono">
                      <i className="key key-cash" /> Closing cash
                  
                      <i className="key key-netdebt" /> Net debt
                    </span>
                  </figcaption>
                  <div id="chart-cash" />
                </figure>
              </div>
            </div>
            {/* ============ THE STATEMENTS ============ */}
            <div className="statements">
              <section className="statement">
                <h2>Income statement
                </h2>
                <div className="table-scroll" id="is-table" />
              </section>
              <section className="statement">
                <h2>Balance sheet
                </h2>
                <div className="table-scroll" id="bs-table" />
                <p className="statement-note" id="opening-check">–
                </p>
              </section>
              <section className="statement">
                <h2>Cash flow statement
                </h2>
                <div className="table-scroll" id="cf-table" />
                <p className="statement-note">The last reported year has no cash flow
              column: the model starts from that year's balance sheet, and a flow
              needs two balance sheets to exist between.
                </p>
              </section>
            </div>
          </section>
          {/* ============ HOW IT'S BUILT ============ */}
          <section>
            <SectionLabel>How this model is built
            </SectionLabel>
            <div className="principles">
              <div className="principle">
                <h3>The links are the model
                </h3>
                <p>Net income lands in retained earnings and at the top of the cash
               flow. Capex builds PP&E and comes back as next year's
               depreciation. Working capital days set receivables, inventory and
               payables, and the 
                  <em>change
                  </em> in them is a cash item. Cash is
               the balance sheet's plug, straight off the bottom of the cash flow.
                </p>
              </div>
              <div className="principle">
                <h3>A balance check that can fail
                </h3>
                <p>Assets minus liabilities and equity is computed for every year and
               shown. Because each roll-forward carries the prior year's
               difference rather than creating one, a balanced opening balance
               sheet guarantees balanced forecast years, so a non-zero check
               means a real error, not a rounding artefact. Nudge an opening
               balance and watch it go red.
                </p>
              </div>
              <div className="principle">
                <h3>No circular references
                </h3>
                <p>Interest is charged on opening debt rather than on a closing or
               average balance. Charging it on the closing balance would make
               interest depend on cash and cash depend on interest, the circular
               reference that makes a spreadsheet need iterative calculation and
               makes an error impossible to trace. The convention is stated rather
               than hidden.
                </p>
              </div>
              <div className="principle">
                <h3>A revolver, so the plan is fundable
                </h3>
                <p>A forecast that runs cash negative isn't a forecast. When the
               closing balance would fall below the minimum, a revolving facility
               draws the difference; when there's surplus, it sweeps back. Its
               interest is charged through the income statement, so stress shows
               up in profit as well as in the balance sheet.
                </p>
              </div>
              <div className="principle">
                <h3>Assumptions in one place
                </h3>
                <p>Every driver is a named input with a range, a unit and a plain
               sentence about what it does. Nothing is hardcoded inside a formula,
               which is what makes a model auditable by someone who didn't write
               it, and editable by the client afterwards.
                </p>
              </div>
              <div className="principle">
                <h3>Tested, not just eyeballed
                </h3>
                <p>The engine is separate from the page and checked on its own:
               three thousand randomised assumption sets, plus deliberate stress,
               a loss-making plan, debt repaid faster than it exists, working
               capital stretched to breaking point. All of them still balance.
                </p>
              </div>
            </div>
          </section>
          <div className="note">
            Illustrative model built for this portfolio. The company is a composite
        of a DSE-listed mid-cap manufacturer, not the filed accounts of any real
        business, and nothing here is a forecast of, or advice about, any actual
        security. The same structure is what I build in Excel for clients,
        with their numbers, their chart of accounts and their covenant tests.
      
          </div>
          <Band
            label={"Working together"}
            title={"Need this for a real company?"}
            actions={<>
              <ButtonLink kind="solid" onAccent href="/contact.html">{"Start a conversation"}</ButtonLink>
              <ButtonLink kind="ghost" onAccent href="/portfolio.html">{"Back to the portfolio"}</ButtonLink>
            </>}
          >
            <p>{"Three-statement models, DCFs and operating models in Excel: built so you can edit them after I hand them over, with the assumptions in one place and the checks visible."}</p>
          </Band>
        </div>
      </main>
  );
}
