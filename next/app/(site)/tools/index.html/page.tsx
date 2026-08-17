/* ============================================================
   /tools/index.html

   Ported out of `aab/tools/index.html` with TRANSITION.md Stage
   11.4, words unchanged.

   ---- where the "use client" is, and why it is not here ----

   Stage 11.4 says a calculator is the first place a `"use
   client"` is correct rather than a mistake, and it is: an input,
   a number and a recalculation is the thing React is for. It is
   still not this commit's job. The five calculators are
   `/tools/tools.js`, which imports nothing above `aab/`, and
   the stock check is a thousand lines of scoring maths in
   `/tools/stock.model.js` with its own tests. Turbopack will not
   resolve above `next/`, so making those components means moving
   the models into `shared/` first, and moving a model that
   `check-content.mjs` asserts against and that has 1,931 lines
   of tests pinned to it is its own change with its own way of
   going wrong.

   So the page is a server component and the arithmetic is exactly
   the code that was doing it yesterday, at the same URL. What
   this step buys is the file, and one shell instead of two.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";

export const metadata: Metadata = pageMeta({
  path: "/tools/index.html",
  title: "Tools & calculators · Reiad's Library",
  description: "Free calculators for Bangladeshi savers and investors: compounding, "
    + "sanchayapatra vs FDR after tax, inflation and real return, loan EMI, and "
    + "position sizing.",
  ogTitle: "Tools & calculators · Reiad's Library",
  ogDescription: "Compounding, sanchayapatra vs FDR, inflation, EMI and position "
    + "sizing; every result is a link you can share.",
  card: "tools",
});

export default function ToolsPage() {
  return (

      <main id="main">
        <div className="wrap">
          <div className="hero" style={{ paddingBlock: "72px 34px" }}>
            <span className="eyebrow mono">Tools · ক্যালকুলেটর
            </span>
            <h1>The five sums worth doing before you decide anything.
            </h1>
            <p className="lede">
              No sign-up, no data leaving your browser, no "book a call". Change a
          number and everything moves. When you get a result worth keeping,
          copy the link, the whole calculation travels with it.
        
            </p>
            {/* ============ the advanced one, which needs its own page ============
             It sits ABOVE the calculator picker rather than after it: it is
             the biggest thing here and was easy to scroll past underneath.

             Deliberately NOT a sixth tab. The picker below is an ARIA tab
             set whose tabs each control a panel on this page, and a link
             that navigates away is not a tab. It is also a different kind
             of thing: the five below answer one question each, this one
             runs a whole analysis. */}
            <a className="work-card advanced-card" href="/tools/stock.html">
              <span className="mono">Advanced · উন্নত টুল
              </span>
              <h2>Stock check: buy, hold or sell?
              </h2>
              {/* The spaces around the two counting slots are written
                  as explicit entities. JSX collapses whitespace that
                  sits between an element and a line break, so the
                  sentence shipped as "app.44 ratios across6 pillars"
                  the moment the page became a component. */}
              <p>Type a company&apos;s figures off its annual report and the price off
                your broker&apos;s app.{" "}
                <span data-count="ratios">44</span>{" "}ratios across{" "}
                <span data-count="pillars">6</span>{" "}pillars,
                weighted by the kind of investor you are, with every step of the
                arithmetic shown, and a separate set for banks, where
                debt-to-equity and EBITDA mean nothing.
              </p>
              <p className="mono advanced-langs" lang="bn">সম্পূর্ণ বাংলায় পড়া যায়: এক ক্লিকে ভাষা বদলান।
              </p>
              <span className="more mono">Open the stock check →
              </span>
            </a>
            {/* The tool picker. These are real links to real anchors, so
             with JavaScript off they still jump to a calculator and all
             five remain on the page. tools.js upgrades them into a tab
             set, one calculator at a time, which is the difference
             between "a page of five things" and "the thing you came
             for, with the others one tap away". */}
            <div className="tool-tabs" id="tool-tabs" role="tablist" aria-label="Choose a calculator">
              <a className="tool-tab" href="#compounding" role="tab" id="tab-compounding" aria-controls="compounding">
                <span className="tool-tab-en">Compounding
                </span>
                <span className="tool-tab-bn bn-h">চক্রবৃদ্ধি
                </span>
              </a>
              <a className="tool-tab" href="#sanchayapatra" role="tab" id="tab-sanchayapatra" aria-controls="sanchayapatra">
                <span className="tool-tab-en">Sanchayapatra vs FDR
                </span>
                <span className="tool-tab-bn bn-h">সঞ্চয়পত্র বনাম এফডিআর
                </span>
              </a>
              <a className="tool-tab" href="#inflation" role="tab" id="tab-inflation" aria-controls="inflation">
                <span className="tool-tab-en">Inflation
                </span>
                <span className="tool-tab-bn bn-h">মূল্যস্ফীতি
                </span>
              </a>
              <a className="tool-tab" href="#emi" role="tab" id="tab-emi" aria-controls="emi">
                <span className="tool-tab-en">Loan EMI
                </span>
                <span className="tool-tab-bn bn-h">কিস্তির হিসাব
                </span>
              </a>
              <a className="tool-tab" href="#position" role="tab" id="tab-position" aria-controls="position">
                <span className="tool-tab-en">Position size
                </span>
                <span className="tool-tab-bn bn-h">ঝুঁকি ও পজিশন
                </span>
              </a>
            </div>
          </div>
          {/* ============ 1 · COMPOUNDING ============ */}
          <section id="compounding" className="tool">
            <header>
              <h2>What a monthly habit becomes 
                <span className="bn-h">চক্রবৃদ্ধি: মাসিক সঞ্চয়ের হিসাব
                </span>
              </h2>
              <p>The single most useful calculation in personal finance, and the one
             most people never run. Watch how much of the final number is growth
             rather than your own money.
              </p>
            </header>
            <div className="tool-body">
              <div className="tool-inputs">
                <label>
                  <span className="label-row">Starting amount 
                    <span className="val" data-for="start" data-format="money" />
                  </span>
                  <input type="range" name="start" min="0" max="1000000" step="5000" defaultValue="50000" />
                </label>
                <label>
                  <span className="label-row">Added every month 
                    <span className="val" data-for="monthly" data-format="money" />
                  </span>
                  <input type="range" name="monthly" min="0" max="100000" step="500" defaultValue="5000" />
                </label>
                <label>
                  <span className="label-row">Annual return 
                    <span className="val" data-for="rate" data-suffix="%" />
                  </span>
                  <input type="range" name="rate" min="0" max="25" step="0.5" defaultValue="10" />
                </label>
                <label>
                  <span className="label-row">For how long 
                    <span className="val" data-for="years" data-suffix=" yrs" />
                  </span>
                  <input type="range" name="years" min="1" max="40" step="1" defaultValue="20" />
                </label>
                <div className="tool-actions">
                  <button className="chip copy-link" type="button">Copy link to this
                  </button>
                </div>
              </div>
              <div className="tool-out">
                <div className="stat-row">
                  <div className="stat stat-lead" data-stat="final">
                    <span className="k">You end with
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                  <div className="stat" data-stat="paid">
                    <span className="k">You put in
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                  <div className="stat" data-stat="growth">
                    <span className="k">Growth
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                </div>
                <div className="chart-box" />
                <div className="chart-legend">
                  <span>
                    <i style={{ background: "var(--green)" }} />Total value
                  </span>
                  <span>
                    <i style={{ background: "var(--gold)" }} />Your own money
                  </span>
                </div>
                <p className="verdict" />
                <p className="tool-note">
                  Assumes the return arrives evenly and gets reinvested, and that you
              never miss a month. Real returns arrive lumpy: the shape holds, the
              exact number won't. 
                  <a className="term" href="/learn/terms/compounding.html">চক্রবৃদ্ধি কী?
                  </a>
                </p>
              </div>
            </div>
          </section>
          {/* ============ 2 · SANCHAYAPATRA vs FDR ============ */}
          <section id="sanchayapatra" className="tool">
            <header>
              <h2>Sanchayapatra vs. bank FDR 
                <span className="bn-h">সঞ্চয়পত্র বনাম এফডিআর: করের পর
                </span>
              </h2>
              <p>The comparison every Bangladeshi saver makes, usually on gross rates
             that nobody actually receives. Put in the rates you've been quoted
             and the tax deducted at source, and compare what lands in your hand.
              </p>
            </header>
            <div className="tool-body">
              <div className="tool-inputs">
                <label>
                  <span className="label-row">Amount 
                    <span className="val" data-for="amount" data-format="money" />
                  </span>
                  <input type="range" name="amount" min="50000" max="5000000" step="50000" defaultValue="1000000" />
                </label>
                <label>
                  <span className="label-row">Years 
                    <span className="val" data-for="years" data-suffix=" yrs" />
                  </span>
                  <input type="range" name="years" min="1" max="10" step="1" defaultValue="5" />
                </label>
                <label>
                  <span className="label-row">Sanchayapatra rate 
                    <span className="val" data-for="srate" data-suffix="%" />
                  </span>
                  <input type="range" name="srate" min="5" max="15" step="0.01" defaultValue="11.04" />
                </label>
                <label>
                  <span className="label-row">Tax at source 
                    <span className="val" data-for="stax" data-suffix="%" />
                  </span>
                  <input type="range" name="stax" min="0" max="20" step="1" defaultValue="10" />
                </label>
                <label>
                  <span className="label-row">FDR rate 
                    <span className="val" data-for="frate" data-suffix="%" />
                  </span>
                  <input type="range" name="frate" min="3" max="15" step="0.01" defaultValue="9" />
                </label>
                <label>
                  <span className="label-row">FDR tax at source 
                    <span className="val" data-for="ftax" data-suffix="%" />
                  </span>
                  <input type="range" name="ftax" min="0" max="20" step="1" defaultValue="10" />
                </label>
                <div className="tool-actions">
                  <button className="chip copy-link" type="button">Copy link to this
                  </button>
                </div>
              </div>
              <div className="tool-out">
                <div className="versus">
                  <div className="side" data-side="s">
                    <h3>সঞ্চয়পত্র
                    </h3>
                    <span className="bn-h">Savings certificate · profit paid out
                    </span>
                    <dl>
                      <dt>Profit
                      </dt>
                      <dd data-k="gross">–
                      </dd>
                      <dt>Tax at source
                      </dt>
                      <dd data-k="tax">–
                      </dd>
                      <dt>Kept
                      </dt>
                      <dd data-k="net">–
                      </dd>
                      <dt>Total back
                      </dt>
                      <dd data-k="total">–
                      </dd>
                    </dl>
                  </div>
                  <div className="side" data-side="f">
                    <h3>FDR
                    </h3>
                    <span className="bn-h">Fixed deposit · interest compounds
                    </span>
                    <dl>
                      <dt>Interest
                      </dt>
                      <dd data-k="gross">–
                      </dd>
                      <dt>Tax at source
                      </dt>
                      <dd data-k="tax">–
                      </dd>
                      <dt>Kept
                      </dt>
                      <dd data-k="net">–
                      </dd>
                      <dt>Total back
                      </dt>
                      <dd data-k="total">–
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="chart-box" />
                <p className="verdict" />
                <p className="tool-note">
                  Modelled simply: sanchayapatra profit is treated as paid out and
              taxed as it's paid, FDR interest as compounding annually and taxed
              on the interest. Real products differ: purchase ceilings, quarterly
              versus maturity payment, and early-encashment penalties can outweigh
              the rate gap entirely. Confirm current rates with Bangladesh Bank
              and your branch.
              
                  <a className="term" href="/learn/terms/sanchayapatra.html">সঞ্চয়পত্র
                  </a> ·
              
                  <a className="term" href="/learn/terms/fdr.html">এফডিআর
                  </a>
                </p>
              </div>
            </div>
          </section>
          {/* ============ 3 · INFLATION ============ */}
          <section id="inflation" className="tool">
            <header>
              <h2>What your money will really be worth 
                <span className="bn-h">মূল্যস্ফীতি ও প্রকৃত রিটার্ন
                </span>
              </h2>
              <p>A number that doesn't change still shrinks. This is the calculation
             that explains why money under the mattress, or in an account paying
             less than inflation, quietly loses.
              </p>
            </header>
            <div className="tool-body">
              <div className="tool-inputs">
                <label>
                  <span className="label-row">Amount today 
                    <span className="val" data-for="amount" data-format="money" />
                  </span>
                  <input type="range" name="amount" min="10000" max="10000000" step="10000" defaultValue="500000" />
                </label>
                <label>
                  <span className="label-row">Inflation 
                    <span className="val" data-for="inflation" data-suffix="%" />
                  </span>
                  <input type="range" name="inflation" min="0" max="20" step="0.25" defaultValue="9" />
                </label>
                <label>
                  <span className="label-row">Your return 
                    <span className="val" data-for="nominal" data-suffix="%" />
                  </span>
                  <input type="range" name="nominal" min="0" max="25" step="0.25" defaultValue="9" />
                </label>
                <label>
                  <span className="label-row">Years 
                    <span className="val" data-for="years" data-suffix=" yrs" />
                  </span>
                  <input type="range" name="years" min="1" max="30" step="1" defaultValue="10" />
                </label>
                <div className="tool-actions">
                  <button className="chip copy-link" type="button">Copy link to this
                  </button>
                </div>
              </div>
              <div className="tool-out">
                <div className="stat-row">
                  <div className="stat stat-lead" data-stat="worth">
                    <span className="k">Same money buys
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                  <div className="stat" data-stat="lost">
                    <span className="k">Purchasing power lost
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                  <div className="stat" data-stat="real">
                    <span className="k">Real return
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                </div>
                <div className="chart-box" />
                <div className="chart-legend">
                  <span>
                    <i style={{ background: "var(--gold)" }} />On paper
                  </span>
                  <span>
                    <i style={{ background: "var(--green)" }} />In real buying power
                  </span>
                </div>
                <p className="verdict" />
                <p className="tool-note">
                  Real return uses the Fisher relation, (1 + return) ÷ (1 + inflation)
              − 1, not the subtraction people usually do, which flatters the
              answer at high rates.
              
                  <a className="term" href="/learn/terms/inflation.html">মূল্যস্ফীতি কী?
                  </a>
                </p>
              </div>
            </div>
          </section>
          {/* ============ 4 · EMI ============ */}
          <section id="emi" className="tool">
            <header>
              <h2>What a loan actually costs 
                <span className="bn-h">কিস্তি ও মোট সুদের হিসাব
                </span>
              </h2>
              <p>The instalment is the number you're shown. The total interest is the
             number that matters, and the term length moves it more than the rate.
              </p>
            </header>
            <div className="tool-body">
              <div className="tool-inputs">
                <label>
                  <span className="label-row">Loan amount 
                    <span className="val" data-for="principal" data-format="money" />
                  </span>
                  <input type="range" name="principal" min="50000" max="10000000" step="50000" defaultValue="1500000" />
                </label>
                <label>
                  <span className="label-row">Interest rate 
                    <span className="val" data-for="rate" data-suffix="%" />
                  </span>
                  <input type="range" name="rate" min="4" max="20" step="0.25" defaultValue="12" />
                </label>
                <label>
                  <span className="label-row">Term 
                    <span className="val" data-for="years" data-suffix=" yrs" />
                  </span>
                  <input type="range" name="years" min="1" max="25" step="1" defaultValue="10" />
                </label>
                <div className="tool-actions">
                  <button className="chip copy-link" type="button">Copy link to this
                  </button>
                </div>
              </div>
              <div className="tool-out">
                <div className="stat-row">
                  <div className="stat stat-lead" data-stat="emi">
                    <span className="k">Instalment
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                  <div className="stat" data-stat="interest">
                    <span className="k">Total interest
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                  <div className="stat" data-stat="total">
                    <span className="k">Total repaid
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                </div>
                <div className="chart-box" />
                <div className="chart-legend">
                  <span>
                    <i style={{ background: "var(--green)" }} />Balance left
                  </span>
                  <span>
                    <i style={{ background: "var(--danger)" }} />Interest paid so far
                  </span>
                </div>
                <p className="verdict" />
                <p className="tool-note">
                  Standard reducing-balance EMI at a fixed rate. Processing fees,
              insurance and rate resets aren't in here: ask for the total cost of
              credit in writing before signing anything.
            
                </p>
              </div>
            </div>
          </section>
          {/* ============ 5 · POSITION SIZING ============ */}
          <section id="position" className="tool">
            <header>
              <h2>How much of this share you can actually buy 
                <span className="bn-h">ঝুঁকি অনুযায়ী পজিশন সাইজ
                </span>
              </h2>
              <p>Most first-year losses aren't bad picks: they're good picks bought
             too big. Decide the most you'll lose before you decide how much to
             buy, and the size follows from arithmetic instead of nerve.
              </p>
            </header>
            <div className="tool-body">
              <div className="tool-inputs">
                <label>
                  <span className="label-row">Portfolio 
                    <span className="val" data-for="capital" data-format="money" />
                  </span>
                  <input type="range" name="capital" min="10000" max="5000000" step="10000" defaultValue="200000" />
                </label>
                <label>
                  <span className="label-row">Risk per trade 
                    <span className="val" data-for="risk" data-suffix="%" />
                  </span>
                  <input type="range" name="risk" min="0.25" max="5" step="0.25" defaultValue="1" />
                </label>
                <label>
                  <span className="label-row">Entry price 
                    <span className="val" data-for="entry" data-format="money" />
                  </span>
                  <input type="number" name="entry" min="1" step="0.1" defaultValue="45" />
                </label>
                <label>
                  <span className="label-row">Stop-loss price 
                    <span className="val" data-for="stop" data-format="money" />
                  </span>
                  <input type="number" name="stop" min="0" step="0.1" defaultValue="40" />
                </label>
                <div className="tool-actions">
                  <button className="chip copy-link" type="button">Copy link to this
                  </button>
                </div>
              </div>
              <div className="tool-out">
                <div className="stat-row">
                  <div className="stat stat-lead" data-stat="shares">
                    <span className="k">Buy at most
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                  <div className="stat" data-stat="cost">
                    <span className="k">That costs
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                  <div className="stat" data-stat="risk">
                    <span className="k">Planned loss
                    </span>
                    <span className="v">–
                    </span>
                    <span className="n" />
                  </div>
                </div>
                <p className="verdict" />
                <p className="tool-note">
                  A stop-loss is a decision, not a guarantee: DSE circuit breakers and
              thin liquidity mean the price you get out at can be worse than the
              one you planned. Size as though the stop might slip.
              
                  <a className="term" href="/learn/terms/risk-return.html">ঝুঁকি ও রিটার্ন
                  </a>
                </p>
              </div>
            </div>
          </section>
          <div className="note measure">
            These calculators are educational. They don't know your tax position, your
        debts, or what you need the money for, and nothing here is a
        recommendation to buy or hold anything. Check current rates and rules with
        Bangladesh Bank, the BSEC, or your own bank before acting.
      
          </div>
          <div className="band">
            <span className="mono">Next
            </span>
            <h2>The words behind the numbers
            </h2>
            <p>Every calculator here leans on a handful of ideas: compounding, real
           return, risk and return. The Learn hub explains each one in plain
           Bangla, in about two minutes each.
            </p>
            <div className="hero-actions">
              <a className="btn btn-solid" href="/learn/index.html">শেখার লাইব্রেরি →
              </a>
              <a className="btn btn-ghost" href="/insights.html">Read the longer pieces
              </a>
            </div>
          </div>
        </div>
      </main>
  );
}
