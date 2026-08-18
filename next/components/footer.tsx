/* ============================================================
   footer.tsx: the end of every page.

   The old one was three lines: a name, the page's own
   disclaimer, and an email address. It was honest and it was a
   dead end, on a site whose whole shape is "there is more of
   this than you think".

   This one is the menu again, spelled out. Same table,
   `lib/nav.ts`, so a school added there appears here as well as
   in the rail, and neither can drift from the other.

   The per-page note is kept and is the last line rather than the
   first. It is a disclaimer, not a greeting.

   ---- what came out, and why ----

   A green band under the links said, in both languages, that
   everything is free, that there is no login, and that what you
   have read stays in your own browser. Every one of those facts
   is in `note`, two elements below it, on every page that has a
   note: the German school's reads "free, in Bangla, and without
   a login. Your progress stays in your own browser." So the
   footer made the same promise twice, a hundred pixels apart,
   and on /skills/ the page itself made it a third time in a band
   directly above.

   One sentence of it survives, under the mark, because it was
   the only part not said anywhere else: that an account carries
   progress between devices.
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
            <p className="deck-foot-line">
              বাংলায় শেখা, আর যে কাজগুলো খুলে দেখা যায়।
            </p>
            <p className="deck-foot-line" lang="en">
              Six free courses and models you can open.
            </p>
            <a className="deck-foot-mail" href="mailto:i@reiad.co.uk">
              <Icon name="mail" size={15} /> i@reiad.co.uk
            </a>
            {/* The one thing the green band used to say that the
                page's own note does not: what an account is FOR.
                Everything else it said, that this is free, that
                there is no login, that progress stays on the
                device, is said again in `note` two elements
                below, on every school page and on /skills/. */}
            <p className="deck-foot-line" lang="bn">
              অ্যাকাউন্ট খুললে অগ্রগতি আপনার সব ডিভাইসে থাকে।
            </p>
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
