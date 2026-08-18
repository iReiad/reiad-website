/* ============================================================
   nav.ts: the whole menu, once.

   The site used to say what its menu was in four places: the
   seven links written into the header, `buildMenu()` in
   `aab/app.js` which drew the overlay's four columns, the
   `SKILLS` list in `content.js`, and the footer. They agreed by
   somebody remembering to edit all four, which is the failure
   mode `CLAUDE.md` opens with, one level up from counting.

   Now there is one table and three readers: the sidebar, the
   footer and the small-screen drawer, which are three views of
   this list rather than three lists.

   ---- what a group is ----

   A group is a heading and its links, and it carries an accent
   colour and an ordering. The ordering is what the audience
   switch moves: a reader who said they are here for work gets
   the work group first, and a learner gets the learning groups
   first. Nothing is hidden from either, which is the rule
   `aab/audience.js` has always stated and is worth restating
   here, where the ordering actually happens: the switch is a
   preference, never a gate.
   ============================================================ */

/** The drawings, by name. `components/icons.tsx` holds the paths. */
export type IconName =
  | "home" | "skills" | "coins" | "book" | "scroll" | "signpost" | "cart"
  | "compass" | "calculator" | "gauge" | "pen" | "briefcase" | "person"
  | "mail" | "user" | "search" | "theme" | "chevron" | "menu" | "close"
  | "check" | "spark" | "seed" | "magnifier" | "cap" | "microscope"
  | "wallet" | "id" | "shield" | "door" | "calendar" | "warning";

export interface NavItem {
  label: string;
  /** The Bangla name, where the thing has one of its own. Shown
      under the label when the sidebar is open. */
  sub?: string;
  href: string;
  icon: IconName;
  /** Which `Current` value marks this item as where you are. */
  key?: string;
  /** A school still being written. It appears, and it says so. */
  soon?: boolean;
  /** In the table, and not in the menus.

      The rail and the footer are seen by everybody, so a link in
      them is a promise that the address opens. `/skills/courses/`
      does not: it is one person's own copy of third-party
      material behind `isAdmin()`, and a reader who followed a
      link from the footer would meet a refusal the site had
      invited them into.

      It is still HERE rather than written straight into the
      skills page, because the rule this file opens with is that
      the menu is said once. `/skills/index.html` reads the flag
      and gives it a card of its own, which is the one place the
      person who can open it will look. */
  unlisted?: boolean;
  /** One Bangla sentence: what you would actually get. Only the
      six learning entries carry one, because only they are listed
      on a page that has room for a sentence. */
  blurb?: string;
  /** What that entry is, in three words, for the card's chip. */
  kind?: string;
  /** The colour this destination owns, as a token name.

      A place on this site has a colour, and the colour is how a
      reader knows where they are before they have read the
      label. Six of the seven belong to the six learning
      destinations, because those are the ones seen together in
      one list; the seventh is the calculators. Anything without
      one inherits its group's, which is the right answer for a
      group whose items are all the same kind of thing. */
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
      { label: "All skills", sub: "দক্ষতা", href: "/skills/index.html", icon: "skills", key: "skills" },
      {
        label: "Money", sub: "টাকা ও শেয়ার", href: "/money/index.html",
        icon: "coins", key: "money", kind: "কোর্স", accent: "var(--green)",
        blurb: "বিও অ্যাকাউন্ট খোলা থেকে নিজে একটা কোম্পানি যাচাই করা পর্যন্ত, "
          + "ধাপে ধাপে সাজানো। সবচেয়ে বড় স্কুল, আর শুরুটা একদম শূন্য থেকে।",
      },
      {
        label: "German", sub: "জার্মান", href: "/deutsch/index.html",
        icon: "book", key: "deutsch", kind: "কোর্স", accent: "var(--blue)",
        blurb: "চারটা স্তরে জার্মান, বাংলা দিয়ে বোঝানো, আর রোজ এক পাতার অনুশীলন খাতা।",
      },
      {
        label: "Qur'anic Arabic", sub: "কুরআনের আরবি", href: "/quran/index.html",
        icon: "scroll", key: "quran", kind: "কোর্স", accent: "var(--teal)",
        blurb: "তিন ধাপে ষাট দিন: শব্দ চেনা, বাক্য বোঝা, তারপর গোটা সূরা খুলে পড়া।",
      },
      {
        label: "English", sub: "মন থেকে ইংরেজি", href: "/english/index.html",
        icon: "signpost", key: "english", kind: "কোর্স", accent: "var(--violet)",
        blurb: "দুই টার্মে ইংরেজি: শব্দের ক্রম থেকে দুই মিনিট টানা বলা পর্যন্ত, সাথে ৩০ দিনের খাতা।",
      },
      {
        label: "Cooking", sub: "রান্না", href: "/cooking/index.html",
        icon: "cart", key: "cooking", kind: "লেখা", accent: "var(--rose)",
        blurb: "মাপ, তাপ আর সময়: রেসিপি মুখস্থ না করে রান্নাটা বোঝা। কোর্স নয়, "
          + "একেকটা উপকরণ নিয়ে পুরো একটা লেখা।",
      },
      {
        label: "Travel", sub: "ভ্রমণ", href: "/travel/index.html",
        icon: "compass", key: "travel", kind: "লেখা", accent: "var(--plum)",
        blurb: "ভিসা, কাগজপত্র আর প্রথমবার দেশের বাইরে যাওয়ার পুরো ধাপ।",
      },
      {
        label: "Courses", sub: "কোর্স", href: "/skills/courses/index.html",
        icon: "cap", key: "courses", kind: "নিজের", unlisted: true,
        accent: "var(--gold)",
        blurb: "বাইরের কোর্স, নিজের পড়ার জন্য রাখা। কোনোটাই প্রকাশ করা হয়নি।",
      },
      {
        label: "Reviews", sub: "রিভিউ", href: "/skills/index.html#reviews",
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
      { label: "Calculators", sub: "ক্যালকুলেটর", href: "/tools/index.html", icon: "calculator", key: "tools" },
      { label: "Stock check", sub: "শেয়ার যাচাই", href: "/tools/stock.html", icon: "gauge", key: "stock" },
      { label: "Live portfolio", sub: "লাইভ পোর্টফোলিও", href: "/tools/live.html", icon: "wallet", key: "live" },
    ],
  },
  {
    id: "read",
    label: "পড়া · Reading",
    accent: "var(--green)",
    items: [
      { label: "Insights", href: "/insights.html", icon: "pen", key: "insights" },
    ],
  },
  {
    id: "work",
    label: "Work",
    accent: "var(--plum)",
    items: [
      { label: "Portfolio", href: "/portfolio.html", icon: "briefcase", key: "portfolio" },
      { label: "About", href: "/about.html", icon: "person", key: "about" },
      { label: "Contact", href: "/contact.html", icon: "mail", key: "contact" },
    ],
  },
  {
    id: "you",
    label: "আপনার · Yours",
    accent: "var(--green)",
    items: [
      { label: "Account", sub: "অ্যাকাউন্ট", href: "/account.html", icon: "user", key: "account" },
    ],
  },
];

/** Which groups lead, per audience. A learner reads down the
    learning groups and finds the work at the bottom; somebody
    hiring gets the reverse. Both lists hold every group: this
    reorders, it never filters. */
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

   A place on this site has a colour and the reader learns it from
   the rail: the German book is blue, the Qur'anic scroll is teal,
   the calculators are gold. Once they know that, the colour is
   faster than the label, so the page a reader opens wears the
   same one its icon does.

   `--accent` is the single property that does it. Every component
   already reads it and never names a colour, and `--accent-soft`,
   `--accent-line` and `--accent-ring` derive from it, so one
   declaration recolours the cards, the chips, the meters, the
   rules and every focus ring on the page.

   This table is DERIVED from NAV above rather than written out,
   because it was written out once already: `aab/styles.css` had
   five `body.deutsch { --accent: ... }` rules, which covered five
   of the sixteen destinations and disagreed with nothing only
   because nobody had added the sixth. An item's own accent wins,
   its group's is the fallback, and a destination that names
   neither gets the site's default.
   ============================================================ */

/** Every `key` in the rail, to the colour that key owns. */
export const ACCENTS: Record<string, string> = Object.fromEntries(
  NAV.flatMap((group) =>
    group.items.map((item) => [item.key ?? item.href, item.accent ?? group.accent])),
);

/** The colour for one destination, as a `var(...)` string.

    Returns null rather than the default for somewhere the rail
    does not list, so a caller can leave the attribute off
    entirely instead of writing the value that was already going
    to apply. */
export function accentFor(key: string | null | undefined): string | null {
  if (!key) return null;
  return ACCENTS[key] ?? null;
}

/** What a renderer puts on `<html>`.

    An inline custom property rather than a generated stylesheet,
    and that is the whole point: the table above is the only place
    the mapping exists, so a section added to the rail is themed
    by the same edit that lists it. There is no second file to
    regenerate and nothing that can drift from this one.

    `in-skills` is the one alias, kept because four routes still
    pass it: a piece in the kitchen or on the travel desk is
    inside the skills half and said so before the money school
    joined that list. */
export function accentStyle(
  key: string | null | undefined,
): Record<string, string> | undefined {
  const accent = accentFor(key === "in-skills" ? "skills" : key);
  return accent ? { "--accent": accent } : undefined;
}

/** The schools' colours, in the order the rail lists them.

    For the one tile that wears all six rather than one: the
    skills card on the home page opens the list they name, so it
    shows the list. The home page kept its own copy of these six
    strings, which is the failure this whole table exists to stop,
    one level down from the menu itself. A seventh school is one
    edit above and appears here by itself. */
export const SCHOOL_ACCENTS: string[] =
  NAV.find((g) => g.id === "learn")?.items
    .filter((i) => i.accent && !i.unlisted && !i.soon)
    .map((i) => i.accent as string) ?? [];

/** The attributes `<html>` carries, as a string, for a renderer
    that is not React.

    The four practice books are generated static HTML and
    `404.html` and `offline.html` are served as files, so six
    pages build their own `<html>` tag. They read this rather than
    each writing a colour, which is the same argument as
    everything above: one table, and a section added to the rail is
    themed everywhere by that one edit.

    Returns `lang` and nothing else for a page the rail does not
    list, so the site default applies rather than a wrong colour. */
export function htmlAttrs(key: string | null | undefined, lang = "bn"): string {
  const accent = accentFor(key === "in-skills" ? "skills" : key);
  const parts = [`lang="${lang}"`];
  if (key) parts.push(`data-section="${key}"`);
  if (accent) parts.push(`style="--accent: ${accent}"`);
  return parts.join(" ");
}
