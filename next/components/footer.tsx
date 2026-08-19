/* ============================================================
   footer.tsx: the end of every page.

   It is the menu again, spelled out, from the same table the rail
   and the drawer read, `lib/nav.ts`. A school added there appears
   here by itself and the two cannot drift.

   The per-page note is the last line rather than the first. It is
   a disclaimer, not a greeting.

   ---- keep it short ----

   Three rows and no more: the mark, the links, and the legal
   line. Every extra line here is a line under all 250-odd pages,
   so anything the page already says belongs to the page. That is
   why there is one sentence beside the name and not four: what
   this site is, and what an account is for.

   `unlisted` items are skipped. A link in the footer is a promise
   the address opens, and `/skills/courses/` answers 403 to
   everybody but one person. See `lib/nav.ts`.
   ============================================================ */

import { NAV } from "../lib/nav";
import { Icon } from "./icons";

export function SiteFooter({
  note, name = "Reiad's Library",
}: {
  note: string;
  name?: string;
}) {
  const year = 2026;

  return (
    <footer className="deck-foot">
      <div className="deck-foot-inner">

        <div className="deck-foot-top">
          <div className="deck-foot-mark">
            <span className="deck-foot-name">{name}</span>
            <p className="deck-foot-line" lang="bn">
              বাংলায় শেখা, আর যে কাজগুলো খুলে দেখা যায়। শেখা ফ্রি, আর
              অগ্রগতি থাকে আপনার অ্যাকাউন্টে।
            </p>
            <a className="deck-foot-mail" href="mailto:i@reiad.co.uk">
              <Icon name="mail" size={14} /> i@reiad.co.uk
            </a>
          </div>

          <nav className="deck-foot-nav" aria-label="Everything on this site">
            {NAV.map((group) => (
              <div className="deck-foot-col" key={group.id} data-group={group.id}
                   style={{ "--accent": group.accent } as React.CSSProperties}>
                <span className="deck-foot-label mono">{group.label}</span>
                <ul>
                  {group.items.filter((item) => !item.unlisted).map((item) => (
                    <li key={item.href}>
                      <a href={item.href}>
                        {item.label}
                        {item.sub ? <span lang="bn"> · {item.sub}</span> : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="deck-foot-end">
          <span className="mono">© {year} Rony Reiad</span>
          <a className="mono" href="/feed.xml">RSS</a>
          <a className="mono" href="/sitemap.xml">Sitemap</a>
          <p className="deck-foot-note">{note}</p>
        </div>

      </div>
    </footer>
  );
}
