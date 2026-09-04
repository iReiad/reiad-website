"use client";

/* ============================================================
   progress.tsx: the reader's own ticks, on the page.

   Four small client components over `lib/progress.ts`. Every one
   of them renders nothing on the server and nothing on the first
   client paint, and that is deliberate rather than lazy: what a
   reader has read is not a fact the server has, so a server
   render of it is a render of zero, and a component that showed
   zero and then jumped to sixty per cent would be announcing that
   it had guessed.

   `useSyncExternalStore` is what makes that exact: its server
   snapshot is the empty state, its client snapshot is the real
   one, and React knows the two differ rather than calling it a
   hydration error.

   ---- the ladder is the server's, the ticks are the browser's ----

   Nothing here decides what a lesson is or where it lives. Every
   id, title and URL comes down as a prop from the route that read
   the rows. This decides one thing per lesson: whether it has a
   tick.
   ============================================================ */

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  getLast, lastKeyOf, markRead, readKeyOf, readSet, setLast, subscribe,
  toggleRead, type Bookmark,
} from "../lib/progress";
import { GoCard } from "./deck";
import { Icon } from "./icons";

/** The lessons of a school, as the page already knows them. */
export interface LadderLesson {
  id: string;
  title: string;
  url: string;
  stage: string;
}

const EMPTY = new Set<string>();

/** Subscribing to a store whose snapshot is a fresh Set on every
    read would loop: React compares snapshots by identity. So the
    snapshot is the stored string, and the Set is derived from it.

    It takes no list of ids any more, and that is the fix for the
    worst bug this file has had. It used to hand its caller's ids
    to `readSet` as the set of "real" ones, and `readSet` deleted
    everything else from storage. Every caller passes a SUBSET:
    one lesson, one card, one stage's rungs. So drawing a tick
    threw away the rest of the school. See the note on `readSet`.

    Nothing is lost by dropping it. Each caller below already
    asks `read.has(id)` for the ids it cares about, which is the
    same intersection done in memory, where it cannot destroy
    anything. */
function useRead(school: string): Set<string> {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try { return localStorage.getItem(readKeyOf(school)) ?? ""; } catch { return ""; }
    },
    () => "",
  );

  if (!raw) return EMPTY;
  return readSet(school);
}

function useBookmark(school: string, known: string[]): Bookmark | null {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try { return localStorage.getItem(lastKeyOf(school)) ?? ""; } catch { return ""; }
    },
    () => "",
  );
  if (!raw) return null;
  return getLast(school, new Set(known));
}

/* ---------- on a lesson page ---------- */

/** Records that this lesson was opened, and offers the tick.

    Opening is not finishing, so the two are separate: the visit
    moves the bookmark and nothing else, and the tick is a button
    the reader presses. The old money school marked a lesson read
    on arrival, which is why a reader who opened a page, saw it
    was the wrong one and left had it counted. */
export function LessonTick({
  school, id, title, stage, url, words, of,
}: {
  school: string;
  id: string;
  title: string;
  stage: string;
  /** Every lesson id on this lesson's ladder, so the tick can
      tell finishing a lesson from finishing the whole stage and
      say the larger thing when it is the larger thing. Optional:
      a school that does not pass it gets the lesson cue, which is
      the true smaller sentence rather than a wrong one. */
  of?: string[];
  /** Only the front door reads this, and only as a hint: see
      `Bookmark` in lib/progress.ts. */
  url: string;
  /** The school's own wording, because four schools say this
      four ways and none of them says it in English. */
  words: { done: string; notDone: string };
}) {
  useEffect(() => {
    setLast(school, { id, title, stage, url });
  }, [school, id, title, stage, url]);

  const read = useRead(school);
  const done = read.has(id);
  /* THE PRESS, not the state. `@layer deck` draws the landing off
     `[data-just]` rather than off `[data-done]` because the tick
     is read out of storage after hydration: keyed on the state,
     the button would pop a moment after every load of a lesson
     the reader finished last week. Cleared on `animationend`, so
     the attribute lives exactly as long as the animation does. */
  const [just, setJust] = useState(false);
  const onClick = useCallback(() => {
    /* Worked out BEFORE the toggle, because after it the answer
       is already true and every tick would sound like the end of
       a stage. Ticking OFF never celebrates either way, and nor
       does it land: a tick coming off is a correction. */
    const finishes = !done && !!of?.length
      && of.every((other) => other === id || read.has(other));
    if (!done) setJust(true);
    toggleRead(school, id, finishes ? "stage" : "lesson");
  }, [school, id, of, read, done]);

  return (
    /* The air around it is this caller's, not the button's. The
       control carried `margin-block: 28px 6px` for this one place
       and took it everywhere else it was used, including into a
       centred row on the course player where it pushed itself out
       of line with the button beside it. */
    <div className="mt-7 mb-1.5">
      <button className="tick-btn" type="button" onClick={onClick}
              data-done={done ? "" : undefined} aria-pressed={done}
              data-just={just ? "" : undefined}
              /* The BUTTON's own animation, not the check mark's.
                 `animationend` bubbles, and both run at 380ms, so
                 either would clear the flag today and the pair
                 would silently truncate each other the day one
                 duration changes. */
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) setJust(false);
              }}>
        <Icon name="check" size={16} />
        {done ? words.done : words.notDone}
      </button>
    </div>
  );
}

/* ---------- on a ladder, a hub, or a contents page ---------- */

/** Bangla numerals, for the labels below. The same substitution
    `shared/schools.ts` does; a copy rather than an import because
    this file is the browser's bundle and that one is the Worker's,
    and it is one line. */
const bn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

/** How much of a list has been read, as a bar.

    ---- why the label is two strings and not a function ----

    The obvious shape for this prop is `(done, total) => string`,
    and it is not allowed: this is a client component, its props
    are serialised into the RSC payload, and a function cannot be.
    React's message is exact ("Functions cannot be passed directly
    to Client Components") and the failure is a 500 on the whole
    route rather than a warning, which is worth knowing because
    `next build` compiles it happily and only a real request finds
    it.

    So: two sentences, with `{done}` and `{total}` substituted, and
    the numbers written in Bangla because every page that uses this
    is. `none` is what to say before anything has been read, where
    a school would rather say "start here" than "0 of 89". */
export function LadderMeter({
  school, lessons, words, accent,
}: {
  school: string;
  lessons: LadderLesson[];
  words: { some: string; none?: string };
  accent?: string;
}) {
  const ids = lessons.map((l) => l.id);
  const read = useRead(school);
  const done = ids.filter((id) => read.has(id)).length;
  const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;

  const label = (done === 0 && words.none ? words.none : words.some)
    .replace("{done}", bn(done))
    .replace("{total}", bn(ids.length));

  return (
    <div className="meter-line" style={accent ? { ["--accent" as string]: accent } : undefined}>
      <span className="meter" role="progressbar" aria-valuenow={pct}
            aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <i style={{ width: `${pct}%` }} />
      </span>
      <span>{label}</span>
    </div>
  );
}

/** A tick on a card, for a lesson in a list. Rendered inside the
    card by the server; this is only the mark. */
export function CardTick({ school, id }: { school: string; id: string }) {
  const done = useRead(school).has(id);
  if (!done) return null;
  return <span className="card-tick" aria-label="পড়া হয়েছে">✓</span>;
}

/** Where they left off, or nothing at all.

    Nothing at all is the point: a reader who has never been here
    should see a clean start rather than an empty box telling them
    they have not started. */
export function Resume({
  school, lessons, words,
}: {
  school: string;
  lessons: LadderLesson[];
  words: { label: string; go: string; fresh?: string };
}) {
  const ids = lessons.map((l) => l.id);
  const last = useBookmark(school, ids);
  const read = useRead(school);

  /* The bookmark is where they were. What they want is where to
     go, and those are the same only until they finish the lesson
     they were on. So: the first lesson after the bookmark that
     has no tick, and the bookmark itself if there is none. */
  const at = last ? lessons.findIndex((l) => l.id === last.id) : -1;
  const next = at === -1
    ? lessons.find((l) => !read.has(l.id))
    : lessons.slice(at).find((l) => !read.has(l.id)) ?? lessons.find((l) => !read.has(l.id));

  if (!last && !read.size) return null;
  if (!next) {
    return words.fresh ? <p className="resume-done">{words.fresh}</p> : null;
  }

  /* `<GoCard>` rather than the five class names it writes.

     This was the deck's own private vocabulary copied out by
     hand: `.card`, `data-kind="go"`, `.card-chip`, `.card-title`
     and `.card-go`, all correct, none of them imported. It is the
     one call site on the site that could go on rendering
     correctly while the component it copies changed underneath
     it, which is the definition of the drift the library exists
     to stop. The DOM is identical. */
  return (
    <GoCard className="resume" href={next.url}
            chip={words.label} title={next.title} go={words.go} />
  );
}

/** Marks a lesson read without a button, for the one place that
    is right: the last page of a stage, where arriving IS
    finishing. Not used yet; exported so that the decision is
    made once if it ever is. */
export function markLessonRead(school: string, id: string) {
  markRead(school, id);
}
