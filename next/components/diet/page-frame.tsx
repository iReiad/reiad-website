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
import { LangSwitch, TBlock } from "./lang";
import { DietStrip } from "./strip";

export function DietPage({ title, lede, children }: {
  title: ReactNode;
  lede: { en: ReactNode; bn: ReactNode };
  children: ReactNode;
}) {
  return (
    <main id="main" className="wrap dt-page">
      <header className="dt-head">
        <div className="dt-head-row">
          <h1>{title}</h1>
          <LangSwitch />
        </div>
        <TBlock
          en={<p className="dt-lede">{lede.en}</p>}
          bn={<p className="dt-lede">{lede.bn}</p>}
        />
      </header>
      <DietStrip />
      {children}
    </main>
  );
}
