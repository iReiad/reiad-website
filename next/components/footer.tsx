/* ============================================================
   footer.tsx: the end of every page.

   The old one was three lines: a name, the page's own
   disclaimer, and an email address. It was honest and it was a
   dead end, on a site whose whole shape is "there is more of
   this than you think".

   This one is the menu again, spelled out. Same table,
   `lib/nav.ts`, so a school added there appears here as well as
   in the rail, and neither can drift from the other. Under it,
   the two things a reader of this site should never have to go
   looking for: that everything is free, and that what they have
   read is stored on their own machine and nowhere else.

   The per-page note is kept and is the last line rather than the
   first. It is a disclaimer, not a greeting.
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
          </div>

          <nav className="deck-foot-nav" aria-label="Everything on this site">
            {NAV.map((group) => (
              <div className="deck-foot-col" key={group.id}
                   style={{ "--accent": group.accent } as React.CSSProperties}>
                <span className="deck-foot-label mono">{group.label}</span>
                <ul>
                  {group.items.map((item) => (
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

        <div className="deck-foot-pledge">
          <p lang="bn">
            <b className="bn-h">সবকিছু ফ্রি, চিরকাল।</b> কোনো লগইন লাগে না, কোনো দাম নেই।
            অ্যাকাউন্ট ছাড়া পড়লে আপনি কী কী পড়েছেন তা শুধু আপনার নিজের ব্রাউজারে
            থাকে, আমাদের কাছে নয়।
          </p>
          <p lang="en">
            Free, no login, no price. Without an account what you have read
            stays in your own browser; with one it is kept for you and follows
            you between your devices.
          </p>
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
