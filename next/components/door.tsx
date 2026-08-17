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
  learn: { school: "টাকা ও শেয়ার", go: "পড়া চালিয়ে যান" },
  deutsch: { school: "জার্মান", go: "পড়া চালিয়ে যান" },
  quran: { school: "কুরআনের আরবি", go: "পড়া চালিয়ে যান" },
  english: { school: "মন থেকে ইংরেজি", go: "পড়া চালিয়ে যান" },
};

export function ContinueCard() {
  /* The snapshot is the four stored strings joined, not the
     object built from them: React compares snapshots by identity
     and a fresh object every read would loop. */
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

  return (
    <a className="card gate-continue" data-kind="go" href={mark.url}
       style={{ ["--accent" as string]: "var(--gold)" }}>
      <span className="card-chip">
        <Icon name="spark" size={13} /> যেখানে ছিলেন
      </span>
      <h3 className="card-title" lang="bn">{mark.title}</h3>
      <p className="card-dek" lang="bn">{words.school}</p>
      <span className="card-go">{words.go}</span>
    </a>
  );
}
