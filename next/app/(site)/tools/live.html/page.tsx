/* ============================================================
   /tools/live.html

   The live portfolio: a Trading 212 account, read through the
   site's own Worker at /api/broker and drawn by /tools/live.js.

   Everything a reader sees here is client-filled, the same
   arrangement as /account.html and for the same reason: what
   this page shows depends on who is looking. A stranger gets
   the site's own portfolio in percentages; a signed-in reader
   with a key of their own gets their account in full; an admin
   gets the levers. None of those is a fact the server should
   bake into HTML that gets cached and shared, so the server
   renders the furniture and the module fills it.

   The markup below is therefore the no-JavaScript story as much
   as it is a skeleton: every slot holds a dash and the page says
   plainly that the numbers need JavaScript, which is true of a
   live feed in a way it is not true of prose.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../lib/pageMeta";
import { Button, ButtonLink } from "../../../../components/ui/button";

export const metadata: Metadata = pageMeta({
  path: "/tools/live.html",
  title: "Live portfolio · a real account, live from the broker · Reiad's Library",
  description: "A real Trading 212 portfolio, live: the site's own account in "
    + "percentages for anyone, and the full dashboard for your own account "
    + "when you connect your own API key. Allocation, returns, dividends and "
    + "recent activity, drawn the moment you open it.",
  ogTitle: "Live portfolio · a real account, live",
  ogDescription: "The site's own portfolio in percentages, live from the "
    + "broker. Connect your own Trading 212 key for the full dashboard.",
  card: "tools",
});

export default function LivePortfolioPage() {
  return (
    <main id="main">
      <div className="wrap">
        {/* ============ hero ============ */}
        <section className="hero-compact">
          <span className="mono eyebrow">Tools · live
          </span>
          <h1>One real portfolio, live
          </h1>
          <p className="lede">The money school teaches with real numbers, so here are mine: the
            site&apos;s own portfolio, straight from the broker, refreshed as you
            read it. Connect your own Trading 212 key and the same dashboard
            reads your account instead.
          </p>
          <p className="note-inline" lang="bn">সাইটের নিজের পোর্টফোলিও, ব্রোকার থেকে সরাসরি। নিজের Trading 212
            চাবি যোগ করলে একই ড্যাশবোর্ড আপনার হিসাবটাও দেখাবে।
          </p>
        </section>

        {/* ============ the site's own portfolio ============ */}
        <section className="tool" id="site-portfolio" aria-labelledby="site-portfolio-h">
          <header>
            <h2 id="site-portfolio-h">The site&apos;s portfolio
              <span className="bn-h" lang="bn">সাইটের পোর্টফোলিও</span>
            </h2>
            <p>Percentages only, on purpose. A weight and a return say everything
              a lesson needs; a balance would only say how much money somebody
              else has, which teaches nothing. Every number below is a share of
              the same whole.
            </p>
          </header>

          <div className="stat-row" id="live-public-stats">
            <div className="stat stat-lead">
              <span className="k">Return on holdings</span>
              <span className="v" id="live-public-return">–</span>
              <span className="n">unrealised, on cost</span>
            </div>
            <div className="stat">
              <span className="k">Invested</span>
              <span className="v" id="live-public-invested">–</span>
              <span className="n">of the account</span>
            </div>
            <div className="stat">
              <span className="k">Free cash</span>
              <span className="v" id="live-public-cash">–</span>
              <span className="n">waiting for a reason</span>
            </div>
            <div className="stat">
              <span className="k">Holdings</span>
              <span className="v" id="live-public-count">–</span>
              <span className="n">positions open</span>
            </div>
          </div>

          <div className="live-holdings" id="live-public-holdings">
            <p className="muted">The live numbers need JavaScript: they come from the broker as
              you read, and there is nothing honest to print here in advance.
            </p>
          </div>

          <p className="note-inline mono" id="live-public-note" hidden></p>
        </section>

        {/* ============ the reader's own account ============ */}
        <section className="tool" id="your-portfolio" aria-labelledby="your-portfolio-h">
          <header>
            <h2 id="your-portfolio-h">Your own account
              <span className="bn-h" lang="bn">আপনার নিজের হিসাব</span>
            </h2>
            <p>The same dashboard, pointed at your Trading 212 account. Make a
              key in the Trading 212 app under Settings, then API, and paste it
              here. It is used to read, never to trade: nothing on this page
              can place an order, and the key never appears in this page&apos;s
              own address or in anything shareable.
            </p>
          </header>

          {/* The module decides which ONE of these three is visible:
              the sign-in ask, the key form, or the dashboard. */}
          <div id="live-signin">
            <p>This half needs an account, so your key belongs to you and not
              to a browser somebody else might sit at.&nbsp;
              <ButtonLink kind="solid" href="/account.html">Sign in first</ButtonLink>
            </p>
          </div>

          <form id="live-key-form" hidden>
            <div className="live-key-grid">
              <label>API key
                <input type="password" id="live-key" autoComplete="off"
                  spellCheck={false} placeholder="paste the whole key" required />
              </label>
              <label>Account
                <select id="live-env">
                  <option value="live">Real money</option>
                  <option value="demo">Practice (paper)</option>
                </select>
              </label>
              <label>Call it
                <input type="text" id="live-label" maxLength={40}
                  placeholder="my ISA" />
              </label>
            </div>
            <label className="live-remember">
              <input type="checkbox" id="live-save" defaultChecked />
              <span>Keep it with my account. The key is sealed by the server
                before it is stored and can only be opened by this site&apos;s
                own Worker. Untick it and the key lives in this tab only,
                gone when the tab goes.</span>
            </label>
            <div className="live-actions">
              <Button kind="solid" type="submit" id="live-connect">Connect</Button>
              <span className="mono live-form-note" id="live-key-note" hidden></span>
            </div>
          </form>

          <div id="live-own-out" hidden></div>
        </section>

        {/* ============ the admin's levers ============ */}
        <section className="tool" id="live-admin" hidden aria-labelledby="live-admin-h">
          <header>
            <h2 id="live-admin-h">Running the public side</h2>
            <p>Only you can see this panel. The key set here is what feeds the
              public percentages above; the switches decide how much of the
              list a stranger gets.
            </p>
          </header>
          <div id="live-admin-out"></div>
        </section>
      </div>
    </main>
  );
}
