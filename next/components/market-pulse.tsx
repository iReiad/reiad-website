"use client";

/* ============================================================
   market-pulse.tsx: the board of headlines on the Insights hub.

   NOT `pulse-card.tsx`, which is the home page's card of WRITING.
   Two different things have carried the word "pulse" since before
   either was a component, and the market one is this: an
   automatically selected feed of somebody else's headlines. The
   two share no markup, no data and no endpoint.

   `components/news.tsx` holds the fetching, the card and the
   window, because they are the same three things wherever a
   headline is shown. What is here is the page-specific part: the
   grid, the skeleton while it loads, and what to say when the
   feed cannot be reached.

   Degrading, in order:
     1. live data
     2. the last successful fetch, kept on the device, labelled
        with when it was
     3. a compact note with links straight to the sources, and a
        retry button

   The section is never allowed to become a dead apology at the
   top of the page: if it cannot be useful it gets out of the way.

   ---- it renders nothing on the server ----

   What a reader has cached and whether a feed answers are both
   facts about one browser, so the server sends the empty live
   region and no more, which is exactly what a reader with no
   JavaScript has always got here. The rule is `read-aloud.tsx`'s
   and `lib/progress.ts`'s: the page is the server's, the
   browser's own state is the browser's.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { NewsCard, NewsWindow, loadNews, relTime, type NewsFeed, type Story }
  from "./news";
import { runtimeModule } from "./account/runtime";

/** `/tilt.js` as this uses it. Declared here rather than in
    `app/src/types/`, which is a directory that is emptying: the
    module is interface waiting to be a component, so a
    description of it would be deleted rather than converted. */
interface TiltModule {
  tiltIn: (root: Element) => void;
}

/** How many grey squares stand in for the feed while it loads.

    Capped by `limit` where the caller set one, because a
    skeleton is a promise about the size of what is coming: the
    board's `wide` market widget drew eight and then settled to
    three, so the page under it jumped every time. */
const SKELETONS = 8;
/** One quiet second chance. A first load during a flaky moment
    should not condemn the section for the whole visit. */
const RETRY_MS = 2500;

type State =
  /* What the server renders and what the first paint holds: the
     region, empty. Nothing here is hidden by CSS, so a reader
     with no JavaScript gets the rest of the page rather than a
     grid of grey squares that will never fill. */
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; feed: NewsFeed; staleFrom: number | null }
  | { kind: "unreachable" };

/** `limit` caps the stories drawn, for the board's `wide` size:
    the hub and the tall widget show the feed whole. Undefined is
    the whole feed, which is what every existing caller gets. */
export function MarketPulse({ limit }: { limit?: number } = {}) {
  const [state, setState] = useState<State>({ kind: "idle" });
  /* Every press of Try again is a new attempt, and the number is
     also the answer to "has this already had its second chance":
     the first load gets one, a press does not, which is what the
     module did by passing `isRetry` straight through. */
  const [attempt, setAttempt] = useState(0);
  const [story, setStory] = useState<Story | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const load = (isRetry: boolean): void => {
      setState({ kind: "loading" });
      loadNews().then(
        ({ data, staleFrom }) => {
          if (live) setState({ kind: "ready", feed: data, staleFrom });
        },
        () => {
          if (!live) return;
          if (!isRetry) { timer = setTimeout(() => load(true), RETRY_MS); return; }
          setState({ kind: "unreachable" });
        },
      );
    };

    load(attempt > 0);
    return () => { live = false; clearTimeout(timer); };
  }, [attempt]);

  /* The grid arrives long after `initTilt()` has run, so the cards
     in it lean towards the pointer only if something tells the
     module they are there. `/tilt.js` is served and precached; if
     it cannot be reached the cards simply do not lean. */
  useEffect(() => {
    const grid = gridRef.current;
    if (state.kind !== "ready" || !grid) return;
    runtimeModule<TiltModule>("/tilt.js")
      .then((tilt) => tilt.tiltIn(grid))
      .catch(() => { /* a nicety, and never a reason to break the grid */ });
  }, [state]);

  return (
    <>
      {/* The window is outside the live region on purpose: a
          screen reader announcing a whole story because a modal
          opened is the region doing the dialog's job badly. */}
      <div id="pulse" aria-live="polite">
        {state.kind === "loading" ? (
          <div className="news-grid" aria-hidden="true">
            {Array.from({ length: Math.min(SKELETONS, limit ?? SKELETONS) }, (_, i) => (
              <div key={i} className="news-card skeleton" />
            ))}
          </div>
        ) : null}

        {state.kind === "ready" ? (
          <>
            <div className="news-grid" ref={gridRef}>
              {(limit ? state.feed.items.slice(0, limit) : state.feed.items).map((item) => (
                <NewsCard key={item.url} item={item}
                          onOpen={(it, from) => setStory({ item: it, from })} />
              ))}
            </div>
            <p className="pulse-updated mono">
              {state.staleFrom
                ? `Offline: showing the last update, from `
                  + `${relTime(new Date(state.staleFrom).toISOString())}`
                : `Updated ${relTime(state.feed.updated)} · tap a card for a little more`}
            </p>
          </>
        ) : null}

        {state.kind === "unreachable" ? (
          <>
            {/* Each `</a>` sits on the line its sentence carries
                on, because JSX eats a line break between an
                element and the words after it and there is no
                space before a comma. `check-jsx-space.ts`. */}
            <p className="pulse-fallback">
              The live feed isn&apos;t reachable right now. The sources it pulls from are{" "}
              <a href="https://www.tbsnews.net/economy"
                 rel="noopener" target="_blank">The Business Standard</a>{" "}
              and{" "}
              <a href="https://www.bbc.co.uk/news/business"
                 rel="noopener" target="_blank">BBC Business</a>, both worth reading
              directly.
            </p>
            <div className="row-flex">
              <Button kind="ghost" size="sm" onClick={() => setAttempt((n) => n + 1)}>
                Try again
              </Button>
            </div>
          </>
        ) : null}
      </div>

      {story ? <NewsWindow story={story} onClose={() => setStory(null)} /> : null}
    </>
  );
}
