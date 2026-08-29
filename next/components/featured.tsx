"use client";

/* ============================================================
   featured.tsx: the big card, chosen by what the reader said.

   The front page asks one question, through the audience switch,
   and this card is the answer given back: somebody here to learn
   gets the money school, somebody hiring gets the case studies,
   and somebody who has said nothing yet gets the live portfolio,
   because one real account moving in real time is the single
   most convincing thing this site can open with.

   The choice is deliberately COARSE. It reads the same
   `audience` key the top-bar switch writes and nothing else: no
   per-school guessing, no duplicate of the continue strip beside
   it (that strip already answers "where was I"), and the three
   variants are three fixed cards, so the layout never has to
   guess its own height.

   The server renders the `open` variant, which is also what a
   reader with no JavaScript keeps. The swap happens in an
   effect, after hydration, for the same reason `door.tsx` reads
   localStorage the way it does: what this reader chose is not a
   fact the server has.
   ============================================================ */

import { useEffect, useState } from "react";
import { Icon } from "./icons";

type Pick = "open" | "learn" | "work";

const CARDS: Record<Pick, {
  href: string; accent: string; icon: string; chip: string;
  title: string; dek: string; go: string; lang?: string;
}> = {
  open: {
    href: "/tools/live", accent: "var(--gold)", icon: "wallet",
    chip: "Live · লাইভ",
    title: "One real portfolio, live",
    dek: "The site's own Trading 212 account, straight from the broker as "
      + "you read: every holding's weight and every return. Connect your "
      + "own key and the same dashboard reads your account instead.",
    go: "Open the dashboard",
  },
  learn: {
    href: "/money", accent: "var(--green)", icon: "coins",
    chip: "সবচেয়ে বড়টা", lang: "bn",
    title: "টাকা ও শেয়ার",
    dek: "হাতেখড়ি থেকে গবেষণা পর্যন্ত, ধাপে ধাপে। বিও অ্যাকাউন্ট খোলা থেকে "
      + "নিজে একটা কোম্পানি যাচাই করা পর্যন্ত, পুরোটাই ফ্রি।",
    go: "শুরু করুন",
  },
  work: {
    href: "/portfolio", accent: "var(--plum)", icon: "briefcase",
    chip: "Work",
    title: "Seven case studies, all of them open",
    dek: "Three-statement models, a DCF, a stress test and a frontier "
      + "optimiser, each one a working spreadsheet you can open in the "
      + "browser and pull apart. The numbers are pinned by tests.",
    go: "See the work",
  },
};

export function FeaturedCard() {
  const [pick, setPick] = useState<Pick>("open");

  useEffect(() => {
    try {
      const said = localStorage.getItem("audience");
      if (said === "learn" || said === "work") setPick(said);
    } catch { /* a browser that forbids storage gets the open card */ }

    /* The switch in the top bar dispatches this, so choosing an
       audience re-answers the card without a reload, exactly as
       it swaps the headline. */
    const onSwitch = (e: Event) => {
      const said = (e as CustomEvent).detail;
      setPick(said === "learn" || said === "work" ? said : "open");
    };
    document.addEventListener("audience:pick", onSwitch);
    return () => document.removeEventListener("audience:pick", onSwitch);
  }, []);

  const c = CARDS[pick];

  return (
    /* No column span any more. It carried `lg:col-span-8` while
       the front page was a twelve-column deck with ten other
       tiles in it; that deck was the board said a second time by
       hand and is gone, so this is the only card in its section
       and takes the row. A span left behind would be a number
       about a grid that no longer exists. */
    <a className="gate-tile gate-feat" data-glow="card" href={c.href} lang={c.lang}
       style={{ ["--accent" as string]: c.accent }}>
      <span className="gt-bg" aria-hidden="true"><Icon name={c.icon} size={150} /></span>
      <span className="flex items-center gap-2.5 min-w-0">
        <span className="gt-disc"><Icon name={c.icon} size={19} /></span>
        <span className="gt-chip mono">{c.chip}</span>
      </span>
      <span className="gt-title">{c.title}</span>
      <span className="gt-dek max-sm:line-clamp-3">{c.dek}</span>
      <span className="gt-go">{c.go}
        <span className="gt-arrow"><Icon name="arrow" size={14} /></span>
      </span>
    </a>
  );
}
