"use client";

/* ============================================================
   door.tsx: the one thing on the front page that is the
   reader's.

   Everything else about the door is written down and rendered on
   the server. This is not: which school somebody is in the middle
   of is in their own browser, and it is the single most useful
   thing the front page can say to a returning reader.

   ---- why it uses the stored address ----

   Every other place progress is shown recomputes a lesson's URL
   from the rows the page was rendered from, because an id cannot
   move and an address can. This page reads no ladder: it would
   have to read four, on a page whose whole job is to be instant.
   So it uses the address the bookmark carries, and `Bookmark` in
   lib/progress.ts says in as many words that the field is a hint.
   The cost of it being stale is one 404 on a lesson that moved,
   against four queries on every load of the front page.
   ============================================================ */

import { useSyncExternalStore } from "react";
import { latest, subscribe } from "../lib/progress";
import { Icon } from "./icons";

const WORDS: Record<string, { school: string; go: string }> = {
  money: { school: "টাকা ও শেয়ার", go: "পড়া চালিয়ে যান" },
  deutsch: { school: "জার্মান", go: "পড়া চালিয়ে যান" },
  quran: { school: "কুরআনের আরবি", go: "পড়া চালিয়ে যান" },
  english: { school: "মন থেকে ইংরেজি", go: "পড়া চালিয়ে যান" },
};

export function ContinueCard() {
  /* The snapshot is the four stored strings joined, not the
     object built from them: React compares snapshots by identity
     and a fresh object every read would loop. */
  /* The STORAGE keys, not the school ids: the money school's
     bookmark has been filed under `learn-last` since before the
     school moved, and the rule in CLAUDE.md is that those
     strings never change. This list said `money-last` for a
     while, which is a key nothing has ever written, so the
     gate below judged the money school's reader to have no
     bookmark and the card never showed for exactly the readers
     the biggest school has. */
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return ["learn", "deutsch", "quran", "english"]
          .map((s) => localStorage.getItem(`${s}-last`) ?? "")
          .join("|");
      } catch { return ""; }
    },
    () => "",
  );

  if (!raw.replace(/\|/g, "")) return null;
  const mark = latest();
  if (!mark?.url) return null;

  const words = WORDS[mark.school] ?? { school: mark.school, go: "চালিয়ে যান" };

  /* The same tile the rest of the door is built from, in its slim
     row form: a returning reader knows where they were going, so
     this is a handle rather than a card, one line tall. */
  return (
    <a className="gate-tile gate-slim" href={mark.url}
       style={{ ["--accent" as string]: "var(--gold)" }}>
      <span className="gt-disc"><Icon name="spark" size={16} /></span>
      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 min-w-0">
        <span className="gt-chip mono" lang="bn">যেখানে ছিলেন · {words.school}</span>
        <span className="gt-title" lang="bn">{mark.title}</span>
      </span>
      <span className="gt-go" lang="bn">{words.go}
        <span className="gt-arrow"><Icon name="arrow" size={14} /></span>
      </span>
    </a>
  );
}
