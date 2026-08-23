/* ============================================================
   What a hub page SAYS about itself.

   The eyebrow, the headline and the lede of the pages that are a
   list of things rather than a piece of writing. Every one of
   them was written into its own React page, which made it a
   sentence only a browser could reach: the Android app drew each
   of these hubs with a bare title and no words at all, exactly
   the way its front page did before `DOOR` moved here.

   That is this site's own rule about the app, one page along:
   copy is DATA, and data reaches a phone with no release.
   `functions/api/site.ts` sends this and
   `check-app-surface.ts` fails on a table added here that
   nothing sends.

   ---- and a number in a lede is a SLOT ----

   `/skills` says how many schools are open. That number is a
   count of the data and must not be typed into a sentence, which
   is the rule at the top of `CLAUDE.md`. So a lede carries `{n}`
   and names the `COUNTS` key that fills it, the way `DOOR.facts`
   already does, and the endpoint resolves it before it leaves.
   `check-content.ts` fails on a `{n}` with no key and on a key
   with no `{n}`.

   ---- what is NOT here ----

   A page whose screen the app does not draw. A head carried and
   never rendered is a field somebody later mistakes for a
   feature, which is the reason `TEMPLATES` is held back from the
   manifest and the reason `ManifestSurfaceTest` in the app fails
   on one. `/about` and `/contact` join this table on the day
   their screens exist.
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
