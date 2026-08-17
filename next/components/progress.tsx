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

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  getLast, markRead, readSet, setLast, subscribe, toggleRead, type Bookmark,
} from "../lib/progress";
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
    snapshot is the stored string, and the Set is derived from it. */
function useRead(school: string, known: string[]): Set<string> {
  const knownSet = new Set(known);

  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try { return localStorage.getItem(keyOf(school)) ?? ""; } catch { return ""; }
    },
    () => "",
  );

  if (!raw) return EMPTY;
  return readSet(school, knownSet);
}

const keyOf = (school: string) =>
  school === "quran" ? "quran-done" : `${school}-read`;

function useBookmark(school: string, known: string[]): Bookmark | null {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try { return localStorage.getItem(`${school}-last`) ?? ""; } catch { return ""; }
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
  school, id, title, stage, url, words,
}: {
  school: string;
  id: string;
  title: string;
  stage: string;
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

  const done = useRead(school, [id]).has(id);
  const onClick = useCallback(() => { toggleRead(school, id); }, [school, id]);

  return (
    <button className="tick-btn" type="button" onClick={onClick}
            data-done={done ? "" : undefined} aria-pressed={done}>
      <Icon name="check" size={16} />
      {done ? words.done : words.notDone}
    </button>
  );
}

/* ---------- on a ladder, a hub, or a contents page ---------- */

/** Bangla numerals, for the labels below. The same substitution
    `shared/schools.js` does; a copy rather than an import because
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
  const read = useRead(school, ids);
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
  const done = useRead(school, [id]).has(id);
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
  const read = useRead(school, ids);

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

  return (
    <a className="card resume" data-kind="go" href={next.url}>
      <span className="card-chip">{words.label}</span>
      <h3 className="card-title">{next.title}</h3>
      <span className="card-go">{words.go}</span>
    </a>
  );
}

/** Marks a lesson read without a button, for the one place that
    is right: the last page of a stage, where arriving IS
    finishing. Not used yet; exported so that the decision is
    made once if it ever is. */
export function markLessonRead(school: string, id: string) {
  markRead(school, id);
}
