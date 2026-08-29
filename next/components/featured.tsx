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

   ---- each variant wears a picture, and it is OURS ----

   `scripts/build-card-art.ts` draws them: the account's line over
   the candles it is drawn from, the school's coins as a ladder,
   the case studies as sheets holding a model. They are worn the
   way a piece wears its cover, through `--gate-photo` and the
   `gate-photo` rules in `@layer components`, so the card is a
   poster in both themes and the words on it are light either way.

   It was an inline SVG scene for one release, which is a diagram
   rather than a picture: line art on a flat ground with no depth
   in it and nothing for the eye to land on. A drawing rather than
   a photograph for three reasons that are all one reason: this
   site's `img-src` is `'self'`, so nothing off-site would load at
   all; a stock photograph is somebody else's licence to keep
   track of for ever; and a picture built out of the site's own
   accents follows the palette, which a photograph cannot.

   The server renders the `open` variant, which is also what a
   reader with no JavaScript keeps. The swap happens in an
   effect, after hydration, for the same reason `door.tsx` reads
   localStorage the way it does: what this reader chose is not a
   fact the server has.
   ============================================================ */

import { useEffect, useState } from "react";
import { Icon } from "./icons";

type Pick = "open" | "learn" | "work";

/* `art` is written out in full rather than built out of the id.
   `scripts/build-card-art.ts --check` reads these files for the
   literal and fails on one naming a drawing that is not on disk:
   a card whose picture 404s renders perfectly and is merely flat,
   which is the kind of breakage nothing else here would catch. */
const CARDS: Record<Pick, {
  href: string; accent: string; icon: string; chip: string;
  title: string; dek: string; go: string; art: string; artSm: string; lang?: string;
}> = {
  open: {
    href: "/tools/live", accent: "var(--gold)", icon: "wallet",
    chip: "Live · লাইভ",
    title: "One real portfolio, live",
    dek: "The site's own Trading 212 account, straight from the broker as "
      + "you read: every holding's weight and every return. Connect your "
      + "own key and the same dashboard reads your account instead.",
    go: "Explore the live portfolio",
    art: "/art/live.webp", artSm: "/art/live-tall.webp",
  },
  learn: {
    href: "/money", accent: "var(--green)", icon: "coins",
    chip: "সবচেয়ে বড়টা", lang: "bn",
    title: "টাকা ও শেয়ার",
    dek: "হাতেখড়ি থেকে গবেষণা পর্যন্ত, ধাপে ধাপে। বিও অ্যাকাউন্ট খোলা থেকে "
      + "নিজে একটা কোম্পানি যাচাই করা পর্যন্ত, পুরোটাই ফ্রি।",
    go: "শুরু করুন",
    art: "/art/money.webp", artSm: "/art/money-tall.webp",
  },
  work: {
    href: "/portfolio", accent: "var(--plum)", icon: "briefcase",
    chip: "Work",
    title: "Seven case studies, all of them open",
    dek: "Three-statement models, a DCF, a stress test and a frontier "
      + "optimiser, each one a working spreadsheet you can open in the "
      + "browser and pull apart. The numbers are pinned by tests.",
    go: "See the work",
    art: "/art/work.webp", artSm: "/art/work-tall.webp",
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

  /* Two properties and no background. The drawing is composed
     into `--surface-image` by the stylesheet, under the scrim and
     over the material's own weave: written here as a background
     it would REPLACE that whole stack and take the bevel, the
     grain and the glow with it. */
  const style: Record<string, string> = {
    "--accent": c.accent,
    "--gate-photo": `url("${c.art}")`,
    /* The phone's own crop. The stylesheet reaches for it under
       640px and falls back to the wide one, so this is the whole
       of what makes the card work on a phone. */
    "--gate-photo-sm": `url("${c.artSm}")`,
  };

  return (
    /* No column span any more. It carried `lg:col-span-8` while
       the front page was a twelve-column deck with ten other
       tiles in it; that deck was the board said a second time by
       hand and is gone, so this is the only card in its section
       and takes the row. A span left behind would be a number
       about a grid that no longer exists. */
    <a className="gate-tile gate-feat gate-photo gate-art" data-glow="card"
       href={c.href} lang={c.lang} style={style}>
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
