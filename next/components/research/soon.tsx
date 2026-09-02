/* ============================================================
   research/soon.tsx: a room whose stage has not landed.

   It has its address, its strip entry and its card, and it says
   honestly what it will do and that it is coming: a link that
   vanishes is a room that does not exist as far as a reader can
   tell. `<SoonCard>` is the site's own shape for a thing that
   has been promised and not written.
   ============================================================ */

import { GoCard, SoonCard } from "../deck";
import { toneVar } from "@reiad/shared/research";
import { RESEARCH_PAGES, isOpen, researchPage } from "../../lib/research-pages";
import { T, W } from "./lang";

export function Soon({ href }: { href: string }) {
  const page = researchPage(href);
  if (!page) return null;
  const open = RESEARCH_PAGES.filter(isOpen);
  return (
    <div className="grid gap-6">
      <SoonCard
        art={page.art}
        accent={toneVar(page.tone)}
        soon={<><T en={`Stage ${page.stage}`} bn={`ধাপ ${page.stage}`} /></>}
        title={<W k="rs.soon.head" />}
        dek={<T en={page.dek.en} bn={page.dek.bn} />}
      >
        <p className="text-t2 text-ink-soft"><W k="rs.soon.body" /></p>
      </SoonCard>
      <section aria-labelledby="rs-open-h">
        <h2 id="rs-open-h" className="text-t3 font-medium mb-3"><W k="rs.rooms" /></h2>
        <div className="cards grid-2">
          {open.map((p) => (
            <GoCard
              key={p.href}
              href={p.href}
              art={p.art}
              accent={toneVar(p.tone)}
              title={<T en={p.title.en} bn={p.title.bn} />}
              dek={<T en={p.dek.en} bn={p.dek.bn} />}
              go={<T en={p.go.en} bn={p.go.bn} />}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
