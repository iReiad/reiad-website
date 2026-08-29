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

   `next/components/card-art.tsx` draws them: the account's line
   over the candles it is drawn from, the school's coins as a
   ladder, the case studies as sheets holding a model. It is the
   same drawing each of those things wears on its own card
   everywhere else, out of `shared/nav.ts`.

   THIS IS THE ONE CARD WHOSE PICTURE IS BESIDE ITS WORDS rather
   than above them, and the reason is its shape: it is four times
   as wide as it is tall, and a band across the top of that is a
   stripe. Under 760px it is a band like every other card's.

   A drawing rather than a photograph, for three reasons that are
   one reason: this site's `img-src` is `'self'`, so nothing
   off-site would load at all; a stock photograph is somebody
   else's licence to keep for ever; and a drawing made of the
   page's own tokens answers the theme, which a photograph
   cannot.

   The server renders the `open` variant, which is also what a
   reader with no JavaScript keeps. The swap happens in an
   effect, after hydration, for the same reason `door.tsx` reads
   localStorage the way it does: what this reader chose is not a
   fact the server has.
   ============================================================ */

import { useEffect, useState } from "react";
import { CardArt, type ArtSubject } from "./card-art";
import { Icon } from "./icons";

type Pick = "open" | "learn" | "work";

/* `art` names one of the twelve drawings rather than a file, so
   this card answers the theme with the rest of the page, and the
   type is the union in `next/components/card-art.tsx`: a name
   that is not one of the twelve does not compile, where a path to
   a picture that was not there used to render a card with a hole
   in it. */
const CARDS: Record<Pick, {
  href: string; accent: string; icon: string; chip: string;
  title: string; dek: string; go: string; art: ArtSubject; lang?: string;
}> = {
  open: {
    href: "/tools/live", accent: "var(--gold)", icon: "wallet",
    chip: "Live · লাইভ",
    title: "One real portfolio, live",
    dek: "The site's own Trading 212 account, straight from the broker as "
      + "you read: every holding's weight and every return. Connect your "
      + "own key and the same dashboard reads your account instead.",
    go: "Explore the live portfolio",
    art: "chart",
  },
  learn: {
    href: "/money", accent: "var(--green)", icon: "coins",
    chip: "সবচেয়ে বড়টা", lang: "bn",
    title: "টাকা ও শেয়ার",
    dek: "হাতেখড়ি থেকে গবেষণা পর্যন্ত, ধাপে ধাপে। বিও অ্যাকাউন্ট খোলা থেকে "
      + "নিজে একটা কোম্পানি যাচাই করা পর্যন্ত, পুরোটাই ফ্রি।",
    go: "শুরু করুন",
    art: "coins",
  },
  work: {
    href: "/portfolio", accent: "var(--plum)", icon: "briefcase",
    chip: "Work",
    title: "Seven case studies, all of them open",
    dek: "Three-statement models, a DCF, a stress test and a frontier "
      + "optimiser, each one a working spreadsheet you can open in the "
      + "browser and pull apart. The numbers are pinned by tests.",
    go: "See the work",
    art: "sheets",
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

  /* One property. The drawing is a child now rather than a
     background, which is what lets it read the theme and lean
     under the pointer. */
  const style: Record<string, string> = { "--accent": c.accent };

  return (
    /* No column span any more. It carried `lg:col-span-8` while
       the front page was a twelve-column deck with ten other
       tiles in it; that deck was the board said a second time by
       hand and is gone, so this is the only card in its section
       and takes the row. A span left behind would be a number
       about a grid that no longer exists. */
    <a className="gate-tile gate-feat" data-glow="card"
       href={c.href} lang={c.lang} style={style}>
      <CardArt subject={c.art} className="gate-feat-art" />
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
