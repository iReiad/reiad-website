/* ============================================================
   storage.ts: everything this site keeps in a browser, in one
   table, with what it is and whether it leaves the machine.

   ---- why a table and not a paragraph ----

   Twenty-eight keys had accumulated across fourteen files, and
   the only way to find out what this site keeps was to grep for
   `localStorage`. That is not a privacy policy, it is an
   archaeology exercise, and it is also how a key gets written
   that nobody meant to keep: `studio-unlocked` is in here as
   `legacy` because one file still deletes it and nothing has
   written it for months.

   `scripts/check-storage.ts` reads the code and this table and
   fails when they disagree in either direction: a key written
   and not described, a key described and never written, and a
   row whose `syncs` does not match `KEYS` in `aab/src/sync.ts`.
   That last one is the expensive one, because a key that says it
   syncs and is not in that table is a promise the account page
   makes and the account does not keep.

   ---- and why it is in shared/ ----

   Three runtimes read it. The check runs under node; the account
   page draws the panel that tells a reader what is held and where
   it goes; and `sync.ts` is compared against it. A fourth copy in
   prose is what this file replaces.

   ---- the categories are about the READER, not about us ----

   Not "string, object, array". What a reader wants to know is
   whether a thing is something they DID, something they CHOSE,
   something about this machine, or something the site is holding
   for its own convenience. Those four answers are what decides
   whether it syncs, whether erasing an account should take it,
   and whether it is worth keeping at all.
   ============================================================ */

/** What a held thing IS, from the reader's side of it. */
export type Held =
  /** Something they did: a tick, a bookmark, a day they turned
      up. The account is the record and the device is a mirror. */
  | "progress"
  /** Something they made: a note, a board, a draft. */
  | "made"
  /** Something they chose about how the site behaves. */
  | "preference"
  /** A fact about THIS machine, true here and false elsewhere.
      Never synced, and that is not an omission: a phone in Dhaka
      and a laptop in Brighton are two places. */
  | "device"
  /** A credential or a lock. Goes when they sign out. */
  | "session"
  /** Something the site could refetch. Losing it costs a
      request. */
  | "cache"
  /** Written by a version of this site that is gone. Something
      still deletes it, and nothing writes it. */
  | "legacy";

export interface Keep {
  /** The literal string. Never rename one: it does not move
      somebody's data, it loses it. CLAUDE.md says this three
      times and it is still the easiest mistake here. */
  key: string;
  where: "local" | "session";
  held: Held;
  /** One line, in the second person, because the account page
      prints it to the reader who owns the thing. */
  what: string;
  /** True exactly when `KEYS` in `aab/src/sync.ts` carries it. */
  syncs: boolean;
  /** Why it does NOT sync. Required for anything a reader did,
      made or chose, because for those three the default answer is
      that it should, and a blank is how one stops. */
  why?: string;
  /** Where it is written, for the check and for whoever is
      following this back to the code. */
  by: string;
  /** The fragment that file uses, where the key is BUILT rather
      than written out. The four `<school>-checks` are
      `${prefix}-checks` inside one shared module, which is what
      keeps four schools on one engine. */
  built?: string;
}

export const KEPT: Keep[] = [
  /* ---------------- the Research Studio ---------------- */
  { key: "research-dense", where: "local", held: "cache", syncs: false,
    what: "Whether the Research Studio draws itself with less air around everything, "
      + "copied from your account so the first paint can read it.",
    by: "next/components/research/settings.tsx" },

  /* ---------------- what a reader has done ---------------- */
  { key: "learn-read", where: "local", held: "progress", syncs: true,
    what: "The money school's lessons you have ticked.",
    by: "next/lib/progress.ts" },
  { key: "learn-last", where: "local", held: "progress", syncs: true,
    what: "The last money lesson you opened.", by: "next/lib/progress.ts" },
  { key: "learn-checks", where: "local", held: "progress", syncs: true,
    what: "The checkpoints you have ticked inside money lessons.",
    by: "aab/checkpoints.js", built: "-checks" },

  { key: "deutsch-read", where: "local", held: "progress", syncs: true,
    what: "The German lessons you have ticked.", by: "aab/deutsch/progress.js" },
  { key: "deutsch-days", where: "local", held: "progress", syncs: true,
    what: "The German practice days you have finished.", by: "aab/deutsch/progress.js" },
  { key: "deutsch-last", where: "local", held: "progress", syncs: true,
    what: "The last German lesson you opened.", by: "aab/deutsch/progress.js" },
  { key: "deutsch-tag", where: "local", held: "progress", syncs: true,
    what: "How far into the German practice book you have got.",
    by: "aab/deutsch/progress.js" },
  { key: "deutsch-checks", where: "local", held: "progress", syncs: true,
    what: "The checkpoints you have ticked inside German lessons.",
    by: "aab/checkpoints.js", built: "-checks" },

  { key: "english-read", where: "local", held: "progress", syncs: true,
    what: "The English lessons you have ticked.", by: "aab/english/progress.js" },
  { key: "english-days", where: "local", held: "progress", syncs: true,
    what: "The English practice days you have finished.", by: "aab/english/progress.js" },
  { key: "english-last", where: "local", held: "progress", syncs: true,
    what: "The last English lesson you opened.", by: "aab/english/progress.js" },
  { key: "english-day", where: "local", held: "progress", syncs: true,
    what: "How far into the English practice book you have got.",
    by: "aab/english/progress.js" },
  { key: "english-checks", where: "local", held: "progress", syncs: true,
    what: "The checkpoints you have ticked inside English lessons.",
    by: "aab/checkpoints.js", built: "-checks" },

  { key: "quran-done", where: "local", held: "progress", syncs: true,
    what: "The Qur'anic Arabic lessons you have ticked.",
    by: "aab/quran/progress.js" },
  { key: "quran-last", where: "local", held: "progress", syncs: true,
    what: "The last Qur'anic Arabic lesson you opened.",
    by: "aab/quran/progress.js" },
  { key: "quran-checks", where: "local", held: "progress", syncs: true,
    what: "The checkpoints you have ticked inside Qur'anic Arabic lessons.",
    by: "aab/checkpoints.js", built: "-checks" },

  { key: "courses-read", where: "local", held: "progress", syncs: true,
    what: "The course lessons you have marked complete.", by: "aab/src/courses.ts" },
  { key: "courses-last", where: "local", held: "progress", syncs: true,
    what: "The last course lesson you opened.", by: "aab/src/courses.ts" },
  { key: "courses-answers", where: "local", held: "progress", syncs: true,
    what: "What you picked in a course quiz. Nothing is marked right or wrong.",
    by: "aab/src/courses.ts" },

  /* THE ONE THING A LEARNER AUTHORS IN THE FOUR SCHOOLS, and the
     one thing the account did not carry until 30 August 2026. A
     learner wrote eight German sentences on a laptop, opened the
     book on a phone and found every box empty; the export did not
     include them and the erase left them behind. Nothing said so,
     because nothing compared what a browser holds against what an
     account holds. This table and its check are that comparison,
     and these two rows are the first thing it found. */
  { key: "deutsch-schrift", where: "local", held: "made", syncs: true,
    what: "What you wrote in the German practice book.",
    by: "aab/deutsch/arbeitsbuch.js" },
  { key: "english-write", where: "local", held: "made", syncs: true,
    what: "What you wrote in the English practice book.",
    by: "aab/english/workbook.js" },

  { key: "days-active", where: "local", held: "progress", syncs: true,
    what: "The days you turned up.", by: "aab/src/streak.ts" },

  { key: "where-read", where: "local", held: "progress", syncs: true,
    what: "How far into each piece and lesson you had got.",
    by: "next/lib/progress.ts" },
  { key: "tools-used", where: "local", held: "progress", syncs: true,
    what: "When you last opened each calculator.", by: "next/lib/progress.ts" },

  /* ---------------- what a reader made ---------------- */
  { key: "home-board", where: "local", held: "made", syncs: true,
    what: "How you arranged your front page.", by: "next/lib/board.ts" },
  { key: "drafts", where: "local", held: "made", syncs: false,
    what: "Unpublished writing in the Studio.",
    why: "The Studio is one person's writing desk and a draft is the machine's "
      + "until it is published. Syncing it would put half-written prose into an "
      + "account row for a feature nobody has asked for.",
    by: "app/src/studio/drafts.ts" },

  /* ---------------- what a reader chose ---------------- */
  { key: "reader-prefs", where: "local", held: "preference", syncs: true,
    what: "Type size, line width, the finish, and which language the calculators open in.",
    by: "aab/src/prefs.ts" },
  { key: "theme", where: "local", held: "preference", syncs: false,
    what: "Light, dark, or whatever this machine is set to.",
    why: "A screen is a fact about a machine. A laptop under a desk lamp and a "
      + "phone in the sun are not the same room, and one of them following the "
      + "other is worse than neither. It is out of `reader-prefs` for the same "
      + "reason and `savePrefs` drops it by name.",
    by: "aab/src/app.ts" },
  { key: "tool-lang", where: "local", held: "preference", syncs: false,
    what: "Which language the calculators open in.",
    why: "It is the calculators' own spelling of a field inside `reader-prefs`, "
      + "which is synced, and they have read this key since long before there "
      + "were accounts. One choice, one source, two names.",
    by: "aab/src/prefs.ts" },
  { key: "tool-depth", where: "local", held: "preference", syncs: false,
    what: "Whether a calculator opens with its main numbers or all of them.",
    why: "The calculators' own spelling of a field inside `reader-prefs`, which "
      + "is synced. `stock.js` reads it before its first render and a string "
      + "comparison there is cheaper than a JSON parse. One choice, one source, "
      + "two names, exactly as `tool-lang` is.",
    by: "aab/src/prefs.ts" },
  { key: "audience", where: "local", held: "preference", syncs: false,
    what: "Whether the menu leads with learning or with hiring.",
    why: "Which of two things somebody came for today, answered by pressing a "
      + "switch that is on every page. It is a mood rather than a setting, and "
      + "an account carrying it would answer for a person who has changed "
      + "their mind since.",
    by: "aab/src/audience.ts" },
  { key: "track", where: "local", held: "preference", syncs: false,
    what: "Which learning track you said you were on.",
    why: "The other half of the audience switch, and it goes with it.",
    by: "aab/src/audience.ts" },

  /* ---------------- facts about this machine ---------------- */
  { key: "rail", where: "local", held: "device", syncs: false,
    what: "Whether the menu down the left is open or folded.",
    why: "A 13-inch laptop and a 27-inch monitor want different answers, and "
      + "the fold is about how much room there is rather than about the reader.",
    by: "next/components/sidebar.tsx" },
  { key: "weather-place", where: "local", held: "device", syncs: false,
    what: "Where you are, to two decimal places, for the sky on the glass.",
    why: "Every other synced key is something the reader MADE. Where somebody "
      + "is standing is not that: it is different on every device by "
      + "definition, and a phone in Dhaka and a laptop in Brighton are two "
      + "places. Two decimals is about a kilometre.",
    by: "next/components/weather.tsx" },

  /* ---------------- credentials and caches ---------------- */
  { key: "reiad-session", where: "local", held: "session", syncs: false,
    what: "Your sign-in, so you are still signed in tomorrow.",
    by: "aab/src/account.ts" },
  { key: "reiad-profile", where: "local", held: "cache", syncs: false,
    what: "Your name and settings, so the account page can draw before the network answers.",
    by: "aab/src/account.ts" },
  { key: "sync-base", where: "local", held: "session", syncs: false,
    what: "What the account said at the last exchange, so two devices can be reconciled.",
    by: "aab/src/sync.ts" },
  { key: "pulse-cache", where: "local", held: "cache", syncs: false,
    what: "The last market headlines, so the board is not empty while it fetches.",
    by: "next/components/news.tsx" },
  { key: "studio-unlocked-local", where: "session", held: "session", syncs: false,
    what: "That you unlocked the Studio in this tab.",
    by: "aab/src/auth.ts" },
  { key: "broker-tab-key", where: "session", held: "session", syncs: false,
    what: "A broker key you pasted for this tab only, never stored.",
    by: "aab/src/tools/live.ts" },

  /* ---------------- gone, but still swept up ---------------- */
  { key: "studio-unlocked", where: "local", held: "legacy", syncs: false,
    what: "A Studio unlock that used to outlive the tab.",
    by: "aab/src/auth.ts" },
];

/** The four a reader would call "mine". Everything else is
    machinery, and the account page says so. */
export const MINE: Held[] = ["progress", "made", "preference"];

export const keptBy = (held: Held): Keep[] => KEPT.filter((k) => k.held === held);

/** In the order the account page lists them, which is most
    personal first. */
export const HELD_ORDER: Held[] = [
  "progress", "made", "preference", "device", "session", "cache", "legacy",
];

export const HELD_LABEL: Record<Held, string> = {
  progress: "What you have done",
  made: "What you made",
  preference: "What you chose",
  device: "About this machine",
  session: "Signing in",
  cache: "Saved to be quick",
  legacy: "Left over, and swept up",
};
