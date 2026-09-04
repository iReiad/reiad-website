/* ============================================================
   What a hub page SAYS about itself: the eyebrow, the headline
   and the lede of every page that is a list rather than a piece
   of writing. HERE rather than in each React page, because copy
   is DATA and reaches the Android app with no release.
   `functions/api/site.ts` sends it and `check-app-surface.ts`
   fails on a table added here that nothing sends.

   A NUMBER IN A LEDE IS A SLOT: it carries `{n}` and names the
   `COUNTS` key that fills it, and the endpoint resolves it before
   it leaves. `check-content.ts` fails on a `{n}` with no key and
   on a key with no `{n}`.

   NOT HERE: a page whose screen the app does not draw. A head
   carried and never rendered is a field somebody later mistakes
   for a feature.
   ============================================================ */

import { COUNTS } from "./content.ts";

export interface Head {
  /** One line, mono, in the accent. Bilingual, as the site
      writes them: `দক্ষতা · Skills`. */
  eyebrow: string;
  title: string;
  /** `{n}` is filled from `count` before this is sent. */
  lede: string;
  /** The language the title and lede are written in, which
      decides the face. */
  lang: "bn" | "en";
  /** The `COUNTS` key that fills `{n}`, where there is one. */
  count?: keyof typeof COUNTS;
}

/** Keyed by the nav key of the page, so a screen that knows
    which destination it is drawing knows where to look. */
export const HEADS: Record<string, Head> = {
  skills: {
    eyebrow: "দক্ষতা · Skills",
    title: "এই সাইটে যা যা শেখানো হয়।",
    lede: "{n}টা খোলা আছে, বাকিটা হচ্ছে। প্রতিটার নিয়ম একই: ব্যাখ্যা বাংলায়, "
      + "শেখার সবকিছু ফ্রি, আর আপনার অগ্রগতি জমা থাকে আপনার অ্যাকাউন্টে। "
      + "যেটা এখনো আসেনি সেটাও নিচে আছে, কারণ কী আসছে জানা থাকলে অপেক্ষা করা যায়।",
    lang: "bn",
    count: "courses",
  },
  portfolio: {
    eyebrow: "Portfolio & services · Rony Reiad",
    title: "Models, analysis and writing: shown, not told.",
    lede: "Freelance financial modeling, data analysis and finance writing. Every "
      + "engagement starts with a short brief and ends with working files you own, "
      + "not screenshots. The case studies below are live: open one and drag a "
      + "slider.",
    lang: "en",
  },
};
