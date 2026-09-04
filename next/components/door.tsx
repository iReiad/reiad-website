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
import { latest, readSet, subscribe, type Bookmark } from "../lib/progress";
import { LADDER_SCHOOLS } from "@reiad/shared/nav";
import { Icon } from "./icons";

const WORDS: Record<string, { school: string; go: string }> = {
  money: { school: "টাকা ও শেয়ার", go: "পড়া চালিয়ে যান" },
  deutsch: { school: "জার্মান", go: "পড়া চালিয়ে যান" },
  quran: { school: "কুরআনের আরবি", go: "পড়া চালিয়ে যান" },
  english: { school: "মন থেকে ইংরেজি", go: "পড়া চালিয়ে যান" },
};

/** The bookmark this card would draw, or null.

    Exported because the card is not the only thing that needs the
    answer. The front page's board has to know BEFORE it lays out
    whether this widget has anything to say: it is a half-width
    cell on a laptop, and a reader who has not started a lesson
    yet was given that cell empty, which is six blank columns at
    the top of the board on a first visit. One hook, so the board
    and the card cannot disagree about whether there is a
    bookmark.

    The snapshot is the four stored strings joined, not the object
    built from them: React compares snapshots by identity and a
    fresh object every read would loop.

    The STORAGE keys, not the school ids: the money school's
    bookmark has been filed under `learn-last` since before the
    school moved, and the rule in CLAUDE.md is that those strings
    never change. This list said `money-last` for a while, which
    is a key nothing has ever written, so the gate below judged
    the money school's reader to have no bookmark and the card
    never showed for exactly the readers the biggest school has. */
export function useBookmark(): (Bookmark & { school: string }) | null {
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
  return mark?.url ? mark : null;
}

export function ContinueCard() {
  const mark = useBookmark();
  /* Whether the lesson the bookmark names has been TICKED, which
     is the difference between "carry on" and "carry on with the
     one after this". Read here rather than in the hook because
     the hook answers one question, "is there a bookmark", and the
     board asks it before it lays out. */
  const done = useSyncExternalStore(
    subscribe,
    () => (mark && readSet(mark.school).has(mark.id) ? "yes" : "no"),
    () => "no",
  ) === "yes";
  if (!mark) return null;

  const words = WORDS[mark.school] ?? { school: mark.school, go: "চালিয়ে যান" };

  /* A BOOKMARK IS WHERE YOU WERE, NOT WHERE TO GO, and the two
     are the same only until the lesson is finished. A reader who
     read lesson 20, ticked it and closed the tab was offered
     lesson 20 again: the one card on the page that is about them,
     pointing backwards.

     `Resume` inside a school computes the first unticked lesson
     after the bookmark, and it can, because a school page has its
     own ladder to hand. This page has none and must not read
     four on the one page whose job is to be instant. So it says
     the true thing it can say: the school itself, whose hub
     computes the next lesson properly two hundred milliseconds
     later. Forwards, and never wrong. */
  const href = done ? schoolHref(mark.school) : mark.url;

  /* The same tile the rest of the door is built from, in its slim
     row form: a returning reader knows where they were going, so
     this is a handle rather than a card, one line tall. */
  return (
    <a className="gate-tile gate-slim" data-glow="card" href={href}
       style={{ ["--accent" as string]: "var(--gold)" }}>
      <span className="gt-disc"><Icon name="spark" size={16} /></span>
      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 min-w-0">
        <span className="gt-chip mono" lang="bn">
          {done ? "এরপর কী" : "যেখানে ছিলেন"} · {words.school}
        </span>
        <span className="gt-title" lang="bn">
          {done ? words.school : mark.title}
        </span>
      </span>
      <span className="gt-go" lang="bn">{done ? "পরের পাঠে যান" : words.go}
        <span className="gt-arrow"><Icon name="arrow" size={14} /></span>
      </span>
    </a>
  );
}

/** Where a school's own hub is, out of the one table that says.

    Not built from the id: the money school lives at `/money` and
    files its ticks under `learn-*`, so a template would send half
    the readers of the biggest school to a page that is not there. */
function schoolHref(school: string): string {
  return LADDER_SCHOOLS.find((s) => s.key === school)?.href ?? "/skills";
}
