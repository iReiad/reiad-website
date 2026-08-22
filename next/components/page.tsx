/* ============================================================
   page.tsx: a hand-written page's layout, in two lines.

   Every page of this site that is not an article or a hub wants
   the same shell with one thing changed: which nav link is
   marked as where you are. A layout cannot be told that by its
   page, because a layout never sees its page's props, so each
   one is its own file. This is what stops those files being
   twelve lines of the same thing:

       import { siteLayout } from "../../components/page";
       export default siteLayout({ current: "about" });

   Anything the shell takes can be passed, which is how the two
   Bangla pages get their language and their footer.
   ============================================================ */

import type { ReactNode } from "react";
import { SiteShell, type Current } from "./shell";
import type { Crumb } from "./ui/crumbs";

type Options = {
  current?: Current;
  /** The trail in the bar, for a page deeper than its section.
      Left out, the section's own is built from `shared/nav.ts`. */
  crumbs?: Crumb[];
  /** A section that draws its OWN trail, in place of the row the
      bar builds from `crumbs`. One does, and `shell.tsx` says
      why where it reads this. */
  liveTrail?: ReactNode;
  lang?: string;
  bodyClass?: string;
  skip?: string;
  skipTo?: string;
  footer?: string;
  footerName?: string;
  /** One page fills the viewport and does not scroll. */
  fixed?: boolean;
  beforeMain?: ReactNode;
  scripts?: ReactNode;
};

export function siteLayout(options: Options = {}) {
  return function PageLayout({ children }: { children: ReactNode }) {
    return <SiteShell {...options}>{children}</SiteShell>;
  };
}
