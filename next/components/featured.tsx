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

   Each variant carries a drawn scene rather than a stock
   picture: an inline SVG in the card's own accent, faded under
   the text by the stylesheet's mask. Drawn here because nothing
   off-site can be (img-src is 'self'), and because a picture in
   the site's own palette follows the theme where a photograph
   cannot.

   The server renders the `open` variant, which is also what a
   reader with no JavaScript keeps. The swap happens in an
   effect, after hydration, for the same reason `door.tsx` reads
   localStorage the way it does: what this reader chose is not a
   fact the server has.
   ============================================================ */

import { useEffect, useState, type JSX } from "react";
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
    go: "Explore the live portfolio",
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

/* ---------- the three scenes ----------

   One drawing per variant, all in the card's inherited accent so
   a theme change repaints them for free. Gradient ids carry the
   variant's name because only one scene is mounted at a time
   here, and an id that collided with a second mount elsewhere
   would silently paint with the wrong gradient. */

function LiveScene() {
  return (
    <svg viewBox="0 0 360 240" fill="none" role="presentation" preserveAspectRatio="xMaxYMax meet">
      <defs>
        <linearGradient id="fs-open-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.32" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* the plotting paper */}
      <path
        d="M40 20v200M110 20v200M180 20v200M250 20v200M320 20v200M20 60h330M20 120h330M20 180h330"
        stroke="currentColor" strokeOpacity="0.12" />
      {/* the account's line, area first so the stroke sits on it */}
      <path d="M20 208 74 186 128 196 182 148 236 158 290 96 344 62V240H20Z"
        fill="url(#fs-open-area)" />
      <path d="M20 208 74 186 128 196 182 148 236 158 290 96 344 62"
        stroke="currentColor" strokeOpacity="0.22" strokeWidth="9"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 208 74 186 128 196 182 148 236 158 290 96 344 62"
        stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M316 58h28v28" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* the holdings, sitting on their line */}
      <circle cx="182" cy="148" r="5" fill="currentColor" fillOpacity="0.85" />
      <circle cx="290" cy="96" r="5" fill="currentColor" fillOpacity="0.85" />
      <circle cx="74" cy="186" r="5" fill="currentColor" fillOpacity="0.85" />
    </svg>
  );
}

function MoneyScene() {
  return (
    <svg viewBox="0 0 360 240" fill="none" role="presentation" preserveAspectRatio="xMaxYMax meet">
      <defs>
        <linearGradient id="fs-learn-step" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      {/* the ladder the school climbs, as rising steps */}
      <rect x="36" y="176" width="52" height="56" rx="8" fill="url(#fs-learn-step)" />
      <rect x="104" y="146" width="52" height="86" rx="8" fill="url(#fs-learn-step)" />
      <rect x="172" y="112" width="52" height="120" rx="8" fill="url(#fs-learn-step)" />
      <rect x="240" y="72" width="52" height="160" rx="8" fill="url(#fs-learn-step)" />
      {/* the taka, up where the last step points */}
      <circle cx="308" cy="52" r="34" stroke="currentColor" strokeWidth="3"
        strokeOpacity="0.9" />
      <circle cx="308" cy="52" r="24" stroke="currentColor" strokeWidth="1.5"
        strokeOpacity="0.4" />
      <text x="308" y="64" textAnchor="middle" fontSize="34"
        fill="currentColor" style={{ fontFamily: "var(--font-bn-serif)" }}>৳</text>
      {/* the path over the steps */}
      <path d="M40 168 118 136 192 100 258 62"
        stroke="currentColor" strokeWidth="3" strokeDasharray="1 10"
        strokeLinecap="round" />
    </svg>
  );
}

function WorkScene() {
  return (
    <svg viewBox="0 0 360 240" fill="none" role="presentation" preserveAspectRatio="xMaxYMax meet">
      <defs>
        <linearGradient id="fs-work-sheet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      {/* the spreadsheet, open */}
      <rect x="60" y="34" width="220" height="176" rx="12" fill="url(#fs-work-sheet)"
        stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
      <path d="M60 74h220M133 74v136" stroke="currentColor" strokeOpacity="0.35"
        strokeWidth="2" />
      <path d="M76 54h60M156 54h40" stroke="currentColor" strokeOpacity="0.6"
        strokeWidth="6" strokeLinecap="round" />
      {/* the model's rows */}
      <path d="M76 96h40M76 122h40M76 148h40M76 174h40"
        stroke="currentColor" strokeOpacity="0.35" strokeWidth="5"
        strokeLinecap="round" />
      {/* and the numbers it pins, as bars */}
      <path d="M156 190V150M186 190V128M216 190V158M246 190V104"
        stroke="currentColor" strokeOpacity="0.75" strokeWidth="14"
        strokeLinecap="round" />
      <path d="M300 190V96" stroke="currentColor" strokeWidth="14"
        strokeLinecap="round" />
      <circle cx="300" cy="72" r="8" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

const SCENES: Record<Pick, () => JSX.Element> = {
  open: LiveScene, learn: MoneyScene, work: WorkScene,
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
  const Scene = SCENES[pick];

  return (
    /* No column span any more. It carried `lg:col-span-8` while
       the front page was a twelve-column deck with ten other
       tiles in it; that deck was the board said a second time by
       hand and is gone, so this is the only card in its section
       and takes the row. A span left behind would be a number
       about a grid that no longer exists. */
    <a className="gate-tile gate-feat" data-glow="card" href={c.href} lang={c.lang}
       style={{ ["--accent" as string]: c.accent }}>
      <span className="gt-scene max-sm:hidden" aria-hidden="true"><Scene /></span>
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
