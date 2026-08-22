/* ============================================================
   diet/page-frame.tsx: the head every diet page has.

   A heading, the language switch and a lede, said once. Five
   routes were about to carry five copies of it, and the day one
   of them drifts is the day the section stops looking like one
   section.

   It is a SERVER component: the switch and the strip inside it
   are the only client parts, and both are marked. A frame that
   was client would drag every page's markup into the payload
   for a heading.
   ============================================================ */

import type { ReactNode } from "react";
import { LangSwitch, T, TBlock } from "./lang";
import { DietStrip } from "./strip";
import {
  DIET_TONE, dietFeeds, dietNeeds, dietPage, type DietPage as Entry,
} from "../../lib/diet-pages";

export function DietPage({ href, title, lede, children }: {
  /** WHICH PAGE THIS IS, so the frame can take its title and its
      colour out of the one table rather than being handed a
      second copy of each. A route that passes an href the table
      does not know gets the section's own colour and has to give
      its own title, which is the honest failure: a page not in
      the table is a page the strip cannot reach either. */
  href?: string;
  /** Only for a page the table does not list. */
  title?: ReactNode;
  lede: { en: ReactNode; bn: ReactNode };
  children: ReactNode;
}) {
  const page = href ? dietPage(href) : undefined;
  const heading = page
    ? <T en={page.title.en} bn={page.title.bn} />
    : title;

  return (
    <main
      id="main"
      className="wrap dt-page"
      /* THE PAGE'S COLOUR, set on `main` so everything inside it
         inherits: the figures' rails, the buttons, the chips and
         the strip's own current tab. One inline custom property
         rather than eleven rules, for the reason `nav.ts` gives
         about the rail: the table is the only place the mapping
         exists. */
      style={{ "--accent": page?.tone ?? DIET_TONE } as React.CSSProperties}
    >
      <header className="dt-head">
        <div className="dt-head-row">
          <h1>{heading}</h1>
          <LangSwitch />
        </div>
        <TBlock
          en={<p className="dt-lede">{lede.en}</p>}
          bn={<p className="dt-lede">{lede.bn}</p>}
        />
      </header>
      <DietStrip />
      {children}
      {href ? <Nearby href={href} /> : null}
    </main>
  );
}

/** WHERE THIS PAGE'S NUMBERS COME FROM, AND WHAT READS THEM.

    The strip at the top says which pages exist. It does not say
    which of them are connected, and this tool's whole difficulty
    is that they are: a goal needs a height, a forecast needs a
    trend, and a doctor's sheet needs all three. A reader who
    lands on the goal page with no height sees an empty panel and
    a sentence, and the page that fixes it is one of eleven tabs
    with nothing marking it out.

    Both halves come out of one list. A page names what it NEEDS;
    what it FEEDS is the reverse lookup, so the day somebody adds
    a page that reads the trend, the trend page starts pointing
    at it without anybody remembering to come here. */
function Nearby({ href }: { href: string }) {
  const needs = dietNeeds(href);
  const feeds = dietFeeds(href);
  if (!needs.length && !feeds.length) return null;

  return (
    <aside className="dt-nearby" aria-labelledby="dt-nearby-h">
      <h2 className="dt-readout-h" id="dt-nearby-h">
        <T en="How this page connects" bn="এই পাতাটা কীসের সঙ্গে জড়িত" />
      </h2>
      {needs.length ? (
        <Row
          en="Reads from" bn="যেখান থেকে পড়ে"
          why={{
            en: "Set these first and the figures above fill in.",
            bn: "আগে এগুলো দিলে উপরের সংখ্যাগুলো আসবে।",
          }}
          pages={needs}
        />
      ) : null}
      {feeds.length ? (
        <Row
          en="Feeds into" bn="যেখানে কাজে লাগে"
          why={{
            en: "What you set here changes what these say.",
            bn: "এখানে যা ঠিক করবেন তাতে এগুলোর কথা বদলাবে।",
          }}
          pages={feeds}
        />
      ) : null}
    </aside>
  );
}

function Row({ en, bn, why, pages }: {
  en: string; bn: string;
  why: { en: string; bn: string };
  pages: Entry[];
}) {
  return (
    <div className="dt-nearby-row">
      <p className="dt-nearby-lead">
        <strong><T en={en} bn={bn} /></strong>{" "}
        <T en={why.en} bn={why.bn} />
      </p>
      <ul className="dt-nearby-list">
        {pages.map((p) => (
          <li key={p.href}>
            <a
              href={p.href}
              className="dt-nearby-link"
              style={{ "--tone": p.tone } as React.CSSProperties}
            >
              <span className="dt-tab-dot" aria-hidden="true" />
              <T en={p.title.en} bn={p.title.bn} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
