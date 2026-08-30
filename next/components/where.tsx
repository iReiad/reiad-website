"use client";

/* ============================================================
   where.tsx: how far into this piece you had got, and a way back
   to it.

   Two jobs, and only one of them is visible. It watches the
   reader down the page and records the block they have reached;
   and if they arrive with a place already recorded and are not
   already past it, it offers one quiet control to go there.

   ---- it never jumps on its own ----

   A page that scrolls itself on load is a page that has decided
   what the reader came for. Somebody may be rereading from the
   start, or following a link to check one line, and a jump
   answers a question nobody asked. It is a button, and the button
   is only there when there is somewhere to go.

   ---- the block, not the offset ----

   `lib/progress.ts` says why at length: a scroll offset is a fact
   about a window and moves with the type size, the measure, a
   photograph's height and any edit to the prose. What is recorded
   is which block, plus the first few words of it, so a piece that
   has been rewritten gives up rather than sending a reader to the
   wrong paragraph.

   ---- and it is one listener, passive, off a rAF ----

   The read of the block positions happens inside the frame, not
   in the scroll handler, for the reason `aab/src/tilt.ts` gives:
   reading a layout value in a scroll handler is a synchronous
   layout on the frame the browser is already trying to paint.
   ============================================================ */

import { useCallback, useEffect, useRef, useState } from "react";
import { markWhere, whereRead, forgetWhere, type Place } from "../lib/progress";
import { cue } from "../lib/sound";

/** The blocks a position can name. Anything a reader's eye stops
    on, and nothing that is furniture: the byline, the tools row
    and the prev/next pair are not places in a piece. */
const BLOCKS = "p, h2, h3, h4, li, blockquote, figure, table, .at-a-glance, .side-note";

/** The first few words, normalised, as the block's signature.
    Short enough that a typo fix does not lose the place and long
    enough that two paragraphs are not the same block. */
const sigOf = (el: Element): string =>
  (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40);

/** How far down the window counts as "reached". A third: a block
    whose top has passed that line has been read past rather than
    glanced at, and using the very top would record the next block
    the moment the previous one scrolls off. */
const LINE = 0.34;

/** Not on every frame. A position is worth writing about once a
    second; writing it on every scroll frame is sixty localStorage
    writes a second and a sync push behind each burst. */
const EVERY = 900;

export function Where({ url }: { url: string }) {
  const [back, setBack] = useState<{ i: number; el: Element } | null>(null);
  const root = useRef<HTMLElement | null>(null);
  const blocks = useRef<Element[]>([]);
  const furthest = useRef(-1);
  const wrote = useRef(0);

  /* The article this control is inside, found once. It is
     `closest` rather than a selector on the document because the
     Studio renders a preview of a piece beside the real one. */
  const hold = useCallback((node: HTMLElement | null) => {
    root.current = node?.closest("article") ?? null;
  }, []);

  useEffect(() => {
    const article = root.current;
    if (!article) return;

    const list = [...article.querySelectorAll(BLOCKS)]
      .filter((el) => (el.textContent ?? "").trim().length > 20
        || el.tagName === "FIGURE" || el.tagName === "TABLE");
    blocks.current = list;
    if (!list.length) return;

    /* ---- is there somewhere to go back to ---- */
    const had: Place | null = whereRead(url);
    if (had && had.i > 1) {
      /* The block that index names, if the piece still says what
         it said. A rewrite moves everything, so look either side
         before giving up: an inserted paragraph shifts the whole
         tail by one and the reader should not lose their place
         over it. */
      let found = -1;
      for (const at of [had.i, ...Array.from({ length: 10 },
        (_, k) => had.i + (k % 2 ? -1 : 1) * Math.ceil((k + 1) / 2))]) {
        if (at >= 0 && at < list.length && sigOf(list[at]) === had.sig) { found = at; break; }
      }
      if (found >= 0) {
        /* OFF THE SCREEN, not merely below the line. If the block
           is already in view the reader can see it, and a button
           that scrolls to something visible is a button that
           answers a question nobody asked. It was two thirds of
           the way down for one draft, which offered a way back to
           a paragraph a reader was already looking at. */
        if (list[found].getBoundingClientRect().top > window.innerHeight) {
          setBack({ i: found, el: list[found] });
        }
      }
    }

    /* ---- and watch them go down it ---- */
    let frame = 0;
    const look = (): void => {
      frame = 0;
      const line = window.innerHeight * LINE;
      let at = -1;
      for (let k = 0; k < blocks.current.length; k += 1) {
        if (blocks.current[k].getBoundingClientRect().top <= line) at = k; else break;
      }
      if (at <= furthest.current) return;
      furthest.current = at;

      /* FINISHING A PIECE IS NOT A PLACE TO COME BACK TO, and the
         bottom of the page is what finishing means.

         "The last block is above the line" is NOT the same test
         and does not work: at maximum scroll the last paragraph
         sits near the bottom of the window, so it can never rise
         to a line a third of the way down. A reader who read to
         the end kept a position at about ninety per cent and was
         offered a way back to it next time. */
      const doc = document.documentElement;
      const ended = window.scrollY + window.innerHeight >= doc.scrollHeight - 8;
      if (ended || at >= blocks.current.length - 1) { forgetWhere(url); return; }

      const now = Date.now();
      if (now - wrote.current < EVERY) return;
      wrote.current = now;
      markWhere(url, { i: at, of: blocks.current.length, sig: sigOf(blocks.current[at]) });
    };
    const onScroll = (): void => { frame ||= requestAnimationFrame(look); };

    /* And once on the way out, so the last screen of a visit is
       not lost to the throttle. `pagehide` rather than `unload`,
       which is never fired on a phone. */
    const onLeave = (): void => {
      const at = furthest.current;
      if (at < 0 || at >= blocks.current.length - 1) return;
      const doc = document.documentElement;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 8) return;
      markWhere(url, { i: at, of: blocks.current.length, sig: sigOf(blocks.current[at]) });
    };

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pagehide", onLeave);
    document.addEventListener("visibilitychange", onLeave);
    look();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("pagehide", onLeave);
      document.removeEventListener("visibilitychange", onLeave);
      onLeave();
    };
  }, [url]);

  const go = useCallback(() => {
    if (!back) return;
    back.el.scrollIntoView({ block: "center", behavior: "smooth" });
    /* The reader is there now, so the offer has been taken and
       the button goes. `furthest` moves with them so the watcher
       does not immediately record a step backwards. */
    furthest.current = back.i;
    setBack(null);
    cue("next");
  }, [back]);

  return (
    <span className="where" ref={hold}>
      {back ? (
        <button type="button" className="keep-btn where-btn" onClick={go}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"
               stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
               strokeLinejoin="round">
            <path d="M12 5v14" /><path d="m6 13 6 6 6-6" />
          </svg>
          <span className="keep-word">Where you were</span>
        </button>
      ) : null}
    </span>
  );
}
