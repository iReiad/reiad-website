/* ============================================================
   hub.tsx: a reading section's index.

   Two components for three pages, which is the shape archive/TRANSITION.md
   Stage 11.1 says these are: "one component pretending to be three
   pages". The kitchen and the travel desk really are one page with
   two sets of words, so they share `ReadHub` and differ only in
   the table in `lib/hub.ts`. Insights is genuinely a different
   page, with the market pulse and the subscribe box on it, so it
   is written out.

   ---- what the list is, and what it is not ----

   The cards come from D1, server-side, and the number in the
   sentence above them counts the cards underneath it. Both hubs
   used to carry a hand-written list in the markup as the
   no-JavaScript fallback, plus a `data-count` slot holding a
   number somebody had typed. Those are the two failures CLAUDE.md
   opens with, and neither has anywhere left to happen: there is
   nothing to keep in step, because there is only one list.
   ============================================================ */

import { ReadCard, SampleCard, SoonCard, bn } from "./cards";
import { SOON, type ReadHubCopy } from "../lib/hub";
import type { Piece } from "../lib/pieces";
import { InfoCard } from "./deck";

/* ---------- the kitchen and the travel desk ---------- */

export function ReadHub({ copy, pieces }: { copy: ReadHubCopy; pieces: Piece[] | null }) {
  /* Only when the piece it names is actually live. The label says
     which piece to read first, so it cannot be pointed somewhere
     else, and a button to a piece that has been unpublished is a
     404 on the first thing a reader clicks. */
  const first = pieces?.find((piece) => piece.slug === copy.first.slug);

  return (
    <main id="main">
      <div className="wrap">

        <div className="hero read-hero">
          <span className="eyebrow mono">
            {copy.eyebrow.bn} · <span lang="en">{copy.eyebrow.en}</span>
          </span>
          <h1 className="bn-h">{copy.heading}</h1>
          <p className="lede">{copy.lede}</p>

          <div className="hero-actions">
            {first ? (
              <a className="btn btn-solid" href={first.url}>{copy.first.label}</a>
            ) : null}
            <a className="btn btn-ghost" href="/skills/index.html">{copy.more}</a>
          </div>
        </div>

        <section id="lekha">
          <span className="section-label mono">
            {copy.list.bn} · <span lang="en">{copy.list.en}</span>
          </span>
          {pieces ? (
            <>
              {/* One string rather than three expressions, so that
                  React writes one text node. Three would come out
                  as `এখন পর্যন্ত <!-- -->১<!-- -->টি`, which reads
                  the same and is a sentence with two comments in
                  the middle of it. */}
              <p className="measure ladder-intro">
                {`${copy.intro}${bn(pieces.length)}${copy.outro}`}
              </p>
              <div className="cards grid-2">
                {pieces.map((piece) => (
                  <ReadCard key={piece.slug} piece={piece} icon={copy.icon} />
                ))}
              </div>
            </>
          ) : (
            <p className="measure ladder-intro">{copy.unavailable}</p>
          )}
        </section>

        <section id="kivabe" className="no-filter">
          <span className="section-label mono">
            {copy.how.bn} · <span lang="en">{copy.how.en}</span>
          </span>
          <div className="wie-gitter">
            {copy.cells.map((cell) => (
              <InfoCard key={cell.heading} lang="bn"
                        title={cell.heading} dek={cell.body} />
            ))}
          </div>
        </section>

        <div className="note">{copy.note}</div>

      </div>
    </main>
  );
}

/* ---------- Insights ---------- */

/** The chips above the article cards, counted from the pieces
    actually on the page. `initTopicFilter()` in app.js built these
    in the browser from the same counts; what it cannot do is have
    them in the HTML, so a reader with no JavaScript saw an empty
    row where the filter should be. `/hub.js` wires up the
    clicking, and does nothing else. */
function TopicChips({ pieces }: { pieces: Piece[] }) {
  const counts = new Map<string, number>();
  for (const piece of pieces) {
    for (const topic of piece.topics) counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  const chips = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return (
    /* `data-filter-ready` is how /hub.js tells the two hubs apart:
       here the chips are in the HTML and want a listener, and on
       the hand-written page app.js builds them and binds its own.
       Without it, that page would toggle every card twice. */
    <div className="filter-row" id="topic-filter" role="group" aria-label="Filter by topic"
         data-filter-ready>
      <button className="chip" type="button" data-topic="" aria-pressed="true">
        Everything · {pieces.length}
      </button>
      {chips.map(([name, count]) => (
        <button className="chip" type="button" data-topic={name} aria-pressed="false" key={name}>
          {name} · {count}
        </button>
      ))}
    </div>
  );
}

export function InsightsHub({ pieces }: { pieces: Piece[] | null }) {
  return (
    <main id="main">
      <div className="wrap">

        <div className="hero">
          <span className="eyebrow mono">Insights</span>
          <h1>Notes on markets, written to be understood.</h1>
          <p className="lede">
            Longer-form pieces on Bangladesh and global finance, plus a live pulse
            of the market news that actually matters, updated automatically through
            the day.
          </p>
        </div>

        <section>
          <div className="pulse-head">
            <span className="section-label mono" style={{ flex: 1 }}>Market pulse · auto-updating</span>
          </div>
          <div id="pulse" aria-live="polite" />
          {/* The caveats matter, but they shouldn't outweigh the thing they
              describe, folded away until someone wants them. */}
          <details className="faq" style={{ marginTop: "14px" }}>
            <summary style={{ fontSize: "0.95rem" }}>How these headlines are chosen</summary>
            <p className="pulse-note" style={{ marginTop: 0 }}>
              Selected automatically from The Business Standard and BBC Business by a
              relevance filter, refreshed roughly every 30 minutes. Opening a card shows
              the publisher&apos;s own standfirst and nothing more; the button in it goes to
              the original story at its source, full credit to the journalists who
              reported it. Automated selection isn&apos;t editorial judgment: an important
              story can slip through, and a minor one can sneak in.
              শিরোনামের বাংলা রূপ স্বয়ংক্রিয় অনুবাদ: গুরুত্বপূর্ণ কিছুর আগে মূল লেখাটা পড়ে নিন।
            </p>
          </details>
        </section>

        <section>
          <div className="pulse-head">
            <span className="section-label mono" style={{ flex: 1 }}>Articles</span>
          </div>

          {pieces ? <TopicChips pieces={pieces} /> : null}

          <div className="cards grid-2">
            {pieces
              ? pieces.map((piece) => <SampleCard key={piece.slug} piece={piece} />)
              : null}
            {SOON.map((soon) => (
              <SoonCard key={soon.title} title={soon.title} dek={soon.dek} />
            ))}
          </div>
          {pieces ? null : (
            <p className="measure">
              The list of pieces could not be loaded just now. <a href="/feed.xml">The feed</a> has
              all of them.
            </p>
          )}
        </section>

        <section>
          <span className="section-label mono">How to read anything here</span>
          <div className="prose">
            <p>A few habits make finance writing, mine or anyone&apos;s, much less
               dangerous to act on:</p>
          </div>
          <div className="stack" style={{ marginTop: "18px", maxWidth: "70ch" }}>
            <details className="faq">
              <summary>Ask what the number is being compared to</summary>
              <p>&quot;11% return&quot; means nothing on its own. Against what inflation? Over
                 how long? After what tax at source? A rate quoted without those
                 three is marketing, not information; the{" "}
                 <a href="/tools/index.html#inflation">inflation calculator</a> exists
                 to make that comparison automatic.</p>
            </details>
            <details className="faq">
              <summary>Separate the mechanism from the recommendation</summary>
              <p>How a BO account works, how settlement lag affects your cash, what a
                 circuit breaker does to liquidity; these are facts you can verify.
                 &quot;This share will go up&quot; is not. Most of what&apos;s worth learning lives
                 in the first category, and none of it goes stale.</p>
            </details>
            <details className="faq">
              <summary>Notice who benefits from you believing it</summary>
              <p>Brokerage houses earn on trading volume. Fund managers earn on assets
                 under management. Newspapers earn on attention. None of that makes
                 them wrong, but it tells you which mistakes they&apos;re more likely to
                 make, and in which direction.</p>
            </details>
            <details className="faq">
              <summary>Why is the market pulse automated?</summary>
              <p>Because I can&apos;t read every wire all day, and pretending otherwise
                 would be worse. A keyword filter scores headlines from The Business
                 Standard and BBC Business and keeps the top few. It is a rough
                 first pass, not an editor; it will miss things, and occasionally
                 keep something trivial. Every link goes to the original story.</p>
            </details>
          </div>
        </section>

        <section>
          <span className="section-label mono">Subscribe</span>
          <div className="prose">
            <p>No newsletter, no tracking, no &quot;sign up to continue reading&quot;. If you
               want to know when something new appears, the feed is the honest way:
               it works in any reader, and it doesn&apos;t tell me who you are.</p>
            {/* The email box only appears if the site has a database to
                put an address in; otherwise the RSS line stands alone.
                `/hub.js` is what asks and what unhides it. */}
            <form className="subscribe-form" id="subscribe-form" hidden>
              <label className="visually-hidden" htmlFor="sub-email">Email address</label>
              <input type="email" id="sub-email" name="email" required
                     placeholder="you@example.com" autoComplete="email" />
              <input type="text" name="website" tabIndex={-1} autoComplete="off"
                     aria-hidden="true" className="honeypot" />
              <button className="btn btn-solid" type="submit">Email me new pieces</button>
            </form>
            <p className="gate-msg mono" id="sub-msg" role="status" style={{ marginTop: "8px" }} />

            <p><a href="/feed.xml">RSS feed →</a> &nbsp;·&nbsp;
               <a href="/money/index.html">শেখার লাইব্রেরি</a> &nbsp;·&nbsp;
               <a href="/tools/index.html">Calculators</a></p>
          </div>
        </section>

      </div>
    </main>
  );
}
