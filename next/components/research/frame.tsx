/* ============================================================
   research/frame.tsx: the head every room has.

   A heading, the language switch, a lede and the strip, said
   once. A SERVER component, as the diet frame is: the switch and
   the strip inside it are the only client parts and both are
   marked, so the frame costs the payload nothing.

   The room's colour is set on `main` so everything inside it
   inherits: the chips, the buttons, the rows and the strip's own
   current tab. One inline custom property rather than seventeen
   rules, because the table is the only place the mapping exists.
   ============================================================ */

import type { ReactNode } from "react";
import { toneVar } from "@reiad/shared/research";
import { LangSwitch, T, TBlock } from "./lang";
import { ResearchStrip } from "./strip";
import { RESEARCH_TONE, researchPage } from "../../lib/research-pages";
import { methodsFor } from "../../lib/research-methods";
import { ChipLink } from "../ui/chip";
import { W } from "./lang";

export function ResearchFrame({ href, title, lede, children, wide }: {
  href?: string;
  /** Only for a page the table does not list. */
  title?: { en: ReactNode; bn: ReactNode };
  lede?: { en: ReactNode; bn: ReactNode };
  /** A working room gets the width; a page of prose does not. */
  wide?: boolean;
  children: ReactNode;
}) {
  const page = href ? researchPage(href) : undefined;
  const head = page ? page.title : title;
  const say = lede ?? page?.dek;
  const methods = page ? methodsFor({ room: page.key }) : [];
  return (
    <main
      id="main"
      className={["wrap dt-page rs-page", wide ? "rs-wide" : null].filter(Boolean).join(" ")}
      style={{ "--accent": toneVar(page?.tone ?? RESEARCH_TONE) } as React.CSSProperties}
    >
      <header className="dt-head">
        <div className="dt-head-row">
          <h1>{head ? <T en={head.en} bn={head.bn} /> : <T en="Research Studio" bn="গবেষণা স্টুডিও" />}</h1>
          <LangSwitch />
        </div>
        {say ? (
          <TBlock
            en={<p className="dt-lede">{say.en}</p>}
            bn={<p className="dt-lede">{say.bn}</p>}
          />
        ) : null}
        {methods.length ? (
          <p className="flex flex-wrap items-center gap-2 text-t1 text-ink-soft" data-testid="rs-room-methods">
            <W k="rs.me.howto" />
            {methods.map((m) => <ChipLink key={m.slug} href={`/tools/research/methods#${m.slug}`}><T en={m.title.en} bn={m.title.bn} /></ChipLink>)}
          </p>
        ) : null}
      </header>
      <ResearchStrip />
      {children}
    </main>
  );
}
