/* ============================================================
   /tools/stock

   Ported out of `aab/tools/stock.html` with archive/TRANSITION.md Stage
   11.4, words unchanged. The forty-four ratios and the six pillars
   are `/tools/stock.model.js`, unchanged and still in `aab/`: see
   the note on the tools index for why the calculators are not
   components yet.

   Every word of the Bangla is still fetched from
   `/tools/stock.i18n.js` at the same address, and that file is
   GENERATED now: its source is `shared/tool-strings.ts`, because
   the Android app reads the same table through `/api/tools`.
   Edit the source, never the output.

   The skip link goes to the verdict rather than to the top of the
   page, which is this page's own and not an oversight.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";
import { Band } from "../../../../components/ui/band";
import { Button, ButtonLink } from "../../../../components/ui/button";

export const metadata: Metadata = pageMeta({
  path: "/tools/stock",
  title: "Stock check · buy, hold or sell · Reiad's Library",
  description: "An interactive stock analyser for the Dhaka Stock Exchange: "
    + "forty-odd ratios across six pillars, a verdict that shows its own "
    + "arithmetic, and a full Bangla translation. P/E, ROE, Altman Z, Piotroski "
    + "F-score, dividend cover and bank-specific ratios.",
  ogTitle: "Stock check · buy, hold or sell a DSE share",
  ogDescription: "Forty-odd ratios across six pillars, a verdict that shows its "
    + "own arithmetic, and every word in English or Bangla.",
  card: "stock",
});

export default function StockPage() {
  return (

      <main id="main">
        <div className="wrap">
          {/* ============ hero ============ */}
          <section className="hero-compact">
            <span className="mono eyebrow" data-i18n="page.eyebrow">Tools · advanced
            </span>
            <h1 data-i18n="page.h1">Should you buy, hold or sell this share?
            </h1>
            <p className="lede" data-i18n="page.lede">Type the numbers off the annual report and the price off your broker's app.
            </p>
            <div className="tool-topbar">
              <div className="lang-picker">
                <span className="mono" data-i18n="page.langLabel">Language
                </span>
                <div className="segmented" id="lang-switch" role="group">
                  <button type="button" data-lang="en" aria-pressed="true">English
                  </button>
                  <button type="button" data-lang="bn" aria-pressed="false" lang="bn">বাংলা
                  </button>
                </div>
              </div>
              <div className="preset-picker">
                <span className="mono" data-i18n="preset.label">Load an example
                </span>
                <div className="scenarios" id="preset-row" />
              </div>
            </div>
            <p className="note-inline" data-i18n="preset.note">These are archetypes, not real companies.
            </p>
          </section>
          {/* ============ the verdict ============ */}
          <section className="verdict-card verdict-big" id="verdict" data-state="good">
            <div id="verdict-dial" />
            <div className="verdict-text">
              <span className="mono" data-i18n="verdict.title">The verdict
              </span>
              <strong className="verdict-value" id="verdict-band">–
              </strong>
              <span className="verdict-cap mono" id="verdict-cap" hidden />
              <p className="verdict-detail" id="verdict-why" />
              <p className="verdict-headroom" id="verdict-headroom" hidden />
            </div>
            <div className="verdict-aside">
              <span className="mono" data-i18n="verdict.buyBelow">Buy-below price
              </span>
              <strong id="verdict-buybelow">–
              </strong>
            </div>
          </section>
          <div className="tiles" id="tiles" />
          {/* ============ inputs + everything else ============ */}
          <div className="model-body">
            <aside className="model-drivers" id="driver-panel">
              <div className="drivers-head">
                <h2 data-i18n="g.weights">What kind of investor are you?
                </h2>
              </div>
              <p className="drivers-note" data-i18n="g.weightsNote" />
              <div id="weights" />
              <div id="drivers" />
              <div className="model-actions">
                <Button kind="ghost" id="copy-link" data-i18n="a.copyLink">Copy link
                </Button>
                <Button kind="ghost" id="download-csv" data-i18n="a.download">Download CSV
                </Button>
                <Button kind="ghost" id="reset" data-i18n="a.reset">Reset
                </Button>
              </div>
              {/* Saving a filled-in check belongs to an account and
                  to nothing else, so this whole block is hidden
                  until `stock.js` finds one. A signed-out reader
                  keeps what they have always had: the URL in the
                  address bar, which carries every input. */}
              <div className="save-scenario" id="save-scenario" hidden>
                <label htmlFor="scenario-name" data-i18n="a.saveLabel">Save this as
                </label>
                <div className="save-scenario-row">
                  <input type="text" id="scenario-name" maxLength={80} placeholder="Square Pharma, Q2" />
                  <Button kind="solid" id="save-scenario-go" data-i18n="a.save">Save
                  </Button>
                </div>
                <p className="tool-note" id="scenario-note" />
                <div className="saved-list" id="scenario-list" />
              </div>
            </aside>
            <div className="model-charts">
              <section className="chart-card">
                <div className="section-head">
                  <h2 data-i18n="sec.pillars">The six pillars
                  </h2>
                  <button className="toggle" id="expand-all" type="button" data-mode="closed" data-i18n="a.expandAll">Open every pillar
                  </button>
                </div>
                <p className="statement-note" data-i18n="sec.pillarsNote" />
                <div id="pillars" />
              </section>
              <section className="chart-card">
                <h2 data-i18n="sec.flags">Flags
                </h2>
                <p className="statement-note" data-i18n="sec.flagsNote" />
                <div id="flags" />
              </section>
              <section className="chart-card">
                <h2 data-i18n="sec.signals">Patterns worth naming
                </h2>
                <p className="statement-note" data-i18n="sec.signalsNote" />
                <div className="signals" id="signals" />
              </section>
              <section className="chart-card">
                <h2 data-i18n="sec.fair">What is it worth?
                </h2>
                <p className="statement-note" data-i18n="sec.fairNote" />
                <div id="chart-fair" />
                <p className="statement-note is-warn" id="fair-note" hidden />
                <div className="table-scroll" id="fair-table" />
              </section>
              <section className="chart-card">
                <h2 data-i18n="sec.market">Where the price sits
                </h2>
                <div id="chart-range" />
                <div id="chart-yields" />
              </section>
              <section className="chart-card">
                <h2 data-i18n="sec.dupont">Where the return comes from
                </h2>
                <p className="statement-note" data-i18n="sec.dupontNote" />
                <div id="chart-dupont" />
              </section>
              <section className="chart-card">
                <h2 data-i18n="sec.piotroski">The nine tests
                </h2>
                <p className="statement-note" data-i18n="sec.piotroskiNote" />
                <div id="piotroski" />
              </section>
              <section className="chart-card">
                <h2 data-i18n="sec.drags">What is holding the score down
                </h2>
                <p className="statement-note" data-i18n="sec.dragsNote" />
                <div id="drags" />
              </section>
              <section className="chart-card">
                <h2 data-i18n="sec.shariah">Shariah screen
                </h2>
                <p className="statement-note" data-i18n="sec.shariahNote" />
                <div id="shariah" />
              </section>
              <section className="chart-card">
                <h2 data-i18n="sec.scorecard">Every number, in one table
                </h2>
                <p className="statement-note" data-i18n="sec.scorecardNote" />
                <div className="table-scroll" id="scorecard" />
              </section>
            </div>
          </div>
          {/* ============ the caveat ============ */}
          <section className="balance-check" data-state="warn" id="disclaimer">
            <span className="check-mark" aria-hidden="true">!
            </span>
            <div>
              <strong data-i18n="disc.title">What this cannot see
              </strong>
              <p className="check-detail" data-i18n="disc.body" />
              <p className="check-detail" data-i18n="disc.units" />
            </div>
          </section>
          <Band
            label={"Working together"}
            title={"Need this built properly, on your own data?"}
            actions={<>
              <ButtonLink kind="solid" onAccent href="/contact">{"Start a conversation"}</ButtonLink>
              <ButtonLink kind="ghost" onAccent href="/tools">{"Back to the calculators"}</ButtonLink>
            </>}
          >
            <p>{"Screening frameworks, valuation models and research notes: the same method as this page, in Excel or Python, against a real portfolio."}</p>
          </Band>
        </div>
      </main>
  );
}
