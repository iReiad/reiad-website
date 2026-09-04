/* ============================================================
   nav.ts: the whole menu, once. One table and three readers: the
   sidebar, the footer and the small-screen drawer, which are
   three VIEWS of this list rather than three lists.

   A group is a heading, its links, an accent colour and an
   ordering. The ordering is what the audience switch moves, and
   nothing is hidden from either audience: THE SWITCH IS A
   PREFERENCE, NEVER A GATE.
   ============================================================ */

import type { ArtSubject } from "./art.ts";

/** The drawings, by name. `components/icons.tsx` holds the paths. */
export type IconName =
  | "home" | "skills" | "coins" | "book" | "scroll" | "signpost" | "cart"
  | "compass" | "calculator" | "gauge" | "pen" | "briefcase" | "person"
  | "mail" | "user" | "search" | "theme" | "chevron" | "menu" | "close"
  | "check" | "spark" | "seed" | "magnifier" | "cap" | "microscope"
  | "wallet" | "id" | "shield" | "door" | "calendar" | "warning" | "leaf"
  | "keep" | "note";

export interface NavItem {
  label: string;
  /** The Bangla name, where the thing has one of its own. Shown
      under the label when the sidebar is open. */
  sub?: string;
  href: string;
  icon: IconName;
  /** Which `Current` value marks this item as where you are. */
  key?: string;
  /** Which of the twelve drawings this thing wears, named HERE
      rather than in a component so a school is the same card on
      the board, on `/skills` and in the tools hub. The union is
      `shared/art.ts`, which is also where a row that is not in
      this table gets one derived. An item with none gets a card
      with no picture. */
  art?: ArtSubject;
  /** A school with a ladder: stages, lessons, a tick per lesson.
      `/account` draws a bar for each and the settings form offers
      them to follow, so the FLAG says "this is a course" rather
      than a Bangla word in `kind` being read as one.

      `scripts/check-next.ts` fails if the four flagged here are
      not exactly the four in `next/lib/school-ladders.ts`: a
      school that gains a ladder and not the flag is a bar the
      account page never draws, on a page that looks finished. */
  ladder?: true;
  /** A school still being written. It appears, and it says so. */
  soon?: boolean;
  /** In the table, and not in the menus. A link in the rail or
      the footer is a promise that the address opens, and
      `/skills/courses/` is behind `isAdmin()`. Still HERE rather
      than written into the skills page, because the menu is said
      once: `/skills` reads the flag and gives it a card. */
  unlisted?: boolean;
  /** This entry IS its group's own front page. A fact rather
      than an instruction, and each reader decides what to do with
      it: `/skills` drops it, because a card linking to the page
      you are on is a dead card, and the app's group tab does the
      same and takes that page's head out of `shared/heads.ts`.
      HERE rather than filtered inside one page, so the second
      reader of the table knows too. */
  hub?: boolean;
  /** One Bangla sentence: what you would actually get. */
  blurb?: string;
  /** What that entry is, in three words, for the card's chip. */
  kind?: string;
  /** The colour this destination owns, as a token name: how a
      reader knows where they are before reading the label.
      Anything without one inherits its group's. */
  accent?: string;
}

export interface NavGroup {
  id: "learn" | "make" | "read" | "work" | "you";
  label: string;
  /** The group's own colour, and the fallback for any item that
      does not name one. */
  accent: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    id: "learn",
    label: "শেখা · Learning",
    accent: "var(--green)",
    items: [
      { label: "All skills", sub: "দক্ষতা", href: "/skills", icon: "skills", key: "skills", hub: true },
      {
        label: "Money", sub: "টাকা ও শেয়ার", href: "/money",
        icon: "coins", key: "money", art: "coins", kind: "কোর্স", ladder: true, accent: "var(--green)",
        blurb: "বিও অ্যাকাউন্ট খোলা থেকে নিজে একটা কোম্পানি যাচাই করা পর্যন্ত, "
          + "ধাপে ধাপে সাজানো। সবচেয়ে বড় স্কুল, আর শুরুটা একদম শূন্য থেকে।",
      },
      {
        label: "German", sub: "জার্মান", href: "/deutsch",
        icon: "book", key: "deutsch", art: "cards", kind: "কোর্স", ladder: true, accent: "var(--blue)",
        blurb: "চারটা স্তরে জার্মান, বাংলা দিয়ে বোঝানো, আর রোজ এক পাতার অনুশীলন খাতা।",
      },
      {
        label: "Qur'anic Arabic", sub: "কুরআনের আরবি", href: "/quran",
        icon: "scroll", key: "quran", art: "arch", kind: "কোর্স", ladder: true, accent: "var(--teal)",
        blurb: "তিন ধাপে ষাট দিন: শব্দ চেনা, বাক্য বোঝা, তারপর গোটা সূরা খুলে পড়া।",
      },
      {
        label: "English", sub: "মন থেকে ইংরেজি", href: "/english",
        icon: "signpost", key: "english", art: "bubbles", kind: "কোর্স", ladder: true, accent: "var(--violet)",
        blurb: "দুই টার্মে ইংরেজি: শব্দের ক্রম থেকে দুই মিনিট টানা বলা পর্যন্ত, সাথে ৩০ দিনের খাতা।",
      },
      {
        label: "Cooking", sub: "রান্না", href: "/cooking",
        icon: "cart", key: "cooking", art: "pan", kind: "লেখা", accent: "var(--rose)",
        blurb: "মাপ, তাপ আর সময়: রেসিপি মুখস্থ না করে রান্নাটা বোঝা। কোর্স নয়, "
          + "একেকটা উপকরণ নিয়ে পুরো একটা লেখা।",
      },
      {
        label: "Travel", sub: "ভ্রমণ", href: "/travel",
        icon: "compass", key: "travel", art: "ridge", kind: "লেখা", accent: "var(--plum)",
        blurb: "ভিসা, কাগজপত্র আর প্রথমবার দেশের বাইরে যাওয়ার পুরো ধাপ।",
      },
      {
        label: "Courses", sub: "কোর্স", href: "/skills/courses",
        icon: "cap", key: "courses", kind: "নিজের", unlisted: true,
        accent: "var(--gold)",
        blurb: "বাইরের কোর্স, নিজের পড়ার জন্য রাখা। কোনোটাই প্রকাশ করা হয়নি।",
      },
      {
        label: "Reviews", sub: "রিভিউ", href: "/skills#reviews",
        icon: "magnifier", key: "reviews", kind: "আসছে", soon: true,
        blurb: "বই, কোর্স, অ্যাপ আর যন্ত্রপাতি: কেনার আগে সৎ একটা মতামত।",
      },
    ],
  },
  {
    id: "make",
    label: "কাজে লাগান · Tools",
    accent: "var(--gold)",
    items: [
      {
        label: "Calculators", sub: "ক্যালকুলেটর", href: "/tools",
        icon: "calculator", key: "tools", hub: true,
        blurb: "চক্রবৃদ্ধি, সঞ্চয়পত্র বনাম এফডিআর, মূল্যস্ফীতি, কিস্তি আর "
          + "পজিশন সাইজ।",
      },
      {
        label: "Stock check", sub: "শেয়ার যাচাই", href: "/tools/stock",
        icon: "gauge", key: "stock", art: "gauge",
        /* No count in the sentence: both figures are in `COUNTS`,
           and one typed into a blurb is the drift
           `check-content.ts` exists to catch. */
        blurb: "একটা টিকার লিখুন: অনুপাত ধরে ধরে যাচাই, আর একটা রায়, "
          + "হিসাবটা দেখিয়ে।",
      },
      {
        label: "Live portfolio", sub: "লাইভ পোর্টফোলিও", href: "/tools/live",
        icon: "wallet", key: "live", art: "chart",
        blurb: "এই সাইটের নিজের পোর্টফোলিও, ব্রোকার থেকে সরাসরি। নিজের "
          + "অ্যাকাউন্টও যোগ করা যায়।",
      },
      {
        label: "Routine", sub: "রুটিন", href: "/tools/routine",
        icon: "calendar", key: "routine", art: "calendar",
        blurb: "একদিন করে, আর পেছনে পুরো বছরটা আঁকা: অভ্যাসটা যা হয়েছে "
          + "তা থেকেই পড়া যায়।",
      },
      {
        label: "Diet", sub: "খাদ্য ও ওজন", href: "/tools/diet",
        icon: "leaf", key: "diet", art: "plate",
        blurb: "কোমর, বিএমআই আর শরীরের চর্বি, আপনার জন্য যে মাপকাঠি সেটাতেই। "
          + "সাথে টাকায় আর পাউন্ডে খাবারের হিসাব।",
      },
      /* The Research Studio. RESEARCH.md is the plan. */
      {
        label: "Research", sub: "গবেষণা", href: "/tools/research",
        icon: "microscope", key: "research", art: "sheets", accent: "var(--gold)",
        blurb: "সূত্র জমানো, পড়া, কোড করা আর লেখা: গবেষণার পুরো কাজটা "
          + "এক জায়গায়।",
      },
    ],
  },
  {
    id: "read",
    label: "পড়া · Reading",
    accent: "var(--green)",
    items: [
      { label: "Insights", href: "/insights", icon: "pen", key: "insights", art: "book", hub: true },
    ],
  },
  {
    id: "work",
    label: "Work",
    accent: "var(--plum)",
    items: [
      { label: "Portfolio", href: "/portfolio", icon: "briefcase", key: "portfolio", art: "sheets", hub: true },
      { label: "About", href: "/about", icon: "person", key: "about" },
      { label: "Contact", href: "/contact", icon: "mail", key: "contact" },
    ],
  },
  {
    id: "you",
    label: "আপনার · Yours",
    accent: "var(--green)",
    items: [
      { label: "Account", sub: "অ্যাকাউন্ট", href: "/account", icon: "user", key: "account" },
      /* Unlisted, as the course section is: in the one table so
         the menu is still said once, and skipped by the rail and
         the footer because it answers 403. ADMIN.md is the
         plan. */
      {
        label: "Admin", sub: "অ্যাডমিন", href: "/admin", icon: "gauge",
        key: "admin", unlisted: true,
      },
    ],
  },
];

/** Which groups lead, per audience. Both lists hold every group:
    THIS REORDERS, IT NEVER FILTERS. */
export const ORDER: Record<"learn" | "work", NavGroup["id"][]> = {
  learn: ["learn", "make", "read", "work", "you"],
  work: ["work", "make", "read", "learn", "you"],
};

/** The two answers the top bar offers, and the words for each. */
export const AUDIENCES = [
  { id: "learn" as const, label: "Learning", sub: "শিখতে এসেছি" },
  { id: "work" as const, label: "Hiring", sub: "কাজের খোঁজে" },
];

/* ============================================================
   The colour a page wears

   `--accent` is the single property that does it. Every component
   reads it and never names a colour, and `--accent-soft`,
   `--accent-line` and `--accent-ring` derive from it, so one
   declaration recolours the cards, the chips, the meters, the
   rules and every focus ring on the page.

   DERIVED from NAV above rather than written out: a stylesheet
   holding `body.deutsch { --accent: ... }` rules covers whichever
   destinations somebody remembered. An item's own accent wins,
   its group's is the fallback, and a destination naming neither
   gets the site's default.
   ============================================================ */

/** Every `key` in the rail, to the colour that key owns. */
export const ACCENTS: Record<string, string> = Object.fromEntries(
  NAV.flatMap((group) =>
    group.items.map((item) => [item.key ?? item.href, item.accent ?? group.accent])),
);

/** The colour for one destination, as a `var(...)` string. Null
    rather than the default for somewhere the rail does not list,
    so a caller can leave the attribute off entirely. */
export function accentFor(key: string | null | undefined): string | null {
  if (!key) return null;
  return ACCENTS[key] ?? null;
}

/** What a renderer puts on `<html>`. An inline custom property
    rather than a generated stylesheet, so a section added to the
    rail is themed by the same edit that lists it.

    `in-skills` is the one alias, kept because four routes still
    pass it. */
export function accentStyle(
  key: string | null | undefined,
): Record<string, string> | undefined {
  const accent = accentFor(key === "in-skills" ? "skills" : key);
  return accent ? { "--accent": accent } : undefined;
}

/** The rail keys that name a CALCULATOR, derived from the group
    that holds them. `next/components/used.tsx` records when one
    was last opened, so a sixth tool is recorded by being added to
    the table above. */
export const TOOL_KEYS: string[] = (NAV.find((g) => g.id === "make")?.items ?? [])
  .filter((item) => !item.soon)
  .map((item) => item.key)
  .filter((key): key is string => Boolean(key));

/** The schools' colours, in the order the rail lists them, for
    the one tile that wears all six rather than one. */
export const SCHOOL_ACCENTS: string[] =
  NAV.find((g) => g.id === "learn")?.items
    .filter((i) => i.accent && !i.unlisted && !i.soon)
    .map((i) => i.accent as string) ?? [];

/** The four schools with a ladder, in the order the rail lists
    them. `/account` reads this twice: once for the bar it draws
    per school, once for the courses the settings form offers to
    follow. */
export const LADDER_SCHOOLS = (NAV.find((g) => g.id === "learn")?.items ?? [])
  .filter((item) => item.ladder)
  .map((item) => ({
    key: item.key as string,
    /** The school's own name, which is the one it teaches under. */
    bn: item.sub,
    en: item.label,
    href: item.href,
    accent: item.accent ?? "var(--green)",
    blurb: item.blurb ?? "",
    /** What kind of thing this is, in Bangla, which is what the
        card's chip says. THE APP READS THIS TABLE rather than
        `NAV`, so a field dropped here is a school card wearing
        the Latin label on a phone with nothing on the site
        noticing. */
    kind: item.kind ?? "",
  }));

/** Both names, the way this site writes a school: Bangla first. */
export const schoolName = (key: string): string => {
  const school = LADDER_SCHOOLS.find((s) => s.key === key);
  return school ? `${school.bn} · ${school.en}` : key;
};

/** The attributes `<html>` carries, as a string, for a renderer
    that is not React: `404.html` and `offline.html` build their
    own `<html>` tag and read this rather than each writing a
    colour.

    Returns `lang` and nothing else for a page the rail does not
    list, so the site default applies rather than a wrong
    colour. */
export function htmlAttrs(key: string | null | undefined, lang = "bn"): string {
  const accent = accentFor(key === "in-skills" ? "skills" : key);
  const parts = [`lang="${lang}"`];
  if (key) parts.push(`data-section="${key}"`);
  if (accent) parts.push(`style="--accent: ${accent}"`);
  return parts.join(" ");
}
