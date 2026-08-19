"use client";

/* ============================================================
   research.tsx: the three research cards on the About page, and
   the window one of them opens.

   `aab/about.js` was 107 lines over `el` and `flip` imported
   from `/news.js`, and it was the last importer of that module.

   Each of these three became a case study you can open and
   drive. For a while the cards did not say so: they described
   the work in the past tense and led nowhere, while the
   interactive version of the same work sat two clicks away in
   the portfolio. So a card opens the same kind of mini window
   the market-pulse cards open on the Insights hub, growing out
   of the card that was pressed, and the window carries what the
   card had no room for plus the way into the case study.

   ---- progressive enhancement, in that order ----

   The cards ship as cards, each with a plain link to its case
   study under it, so the research leads somewhere with no
   JavaScript at all. The window is an upgrade on that and never
   a replacement for it: `live` is false until an effect has run,
   which is the same rule `ui/tab-panels.tsx` follows, and only
   then does a card become a button and its plain link go. A
   pointer cursor over a card that does nothing is worse than no
   cursor at all.

   ---- the words are the page's ----

   Every string comes down as a prop from the route. The detail a
   window shows is page copy that happens to be shown in a
   window, not a second copy of the page kept in a script, which
   is what the `<template data-detail>` in the old markup was for.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { flip } from "../lib/flip";
import { Button, ButtonLink } from "./ui/button";

/** One piece of research, and the case study it became. */
export interface ResearchItem {
  /** The case study, which is where both ways out lead. */
  href: string;
  /** What the way out says, minus the arrow. One string rather
      than two, because the plain link and the window's button
      have always said the same words and were typed twice. */
  label: string;
  /** The line above the title, and the window's own bar. */
  tag: string;
  title: string;
  /** What the card says. */
  blurb: string;
  /** What the card had no room for, a paragraph per entry. */
  detail: string[];
}

/** Which card is open, and the card itself, because the window
    grows out of that card's rectangle. */
interface Opened {
  item: ResearchItem;
  from: HTMLElement | null;
}

/* ------------------------------------------------------------
   the window

   The news window with a different body: same frame, same bar,
   same way out, so the two mini windows on this site are one
   thing to learn. `showModal()` brings the focus trap, the
   backdrop and Escape, so none of the three is implemented here.
   ------------------------------------------------------------ */

function ResearchWindow({ opened, onClose }:
{ opened: Opened; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const win = ref.current;
    if (!win) return;
    if (!win.open) win.showModal();
    flip(win, opened.from);
  }, [opened]);

  /* A listener rather than React's `onClose`, because this has to
     hear the browser closing the dialog as well as the button:
     Escape fires `close` with nothing on this page involved, and
     a window the page still thinks is open cannot be reopened. */
  useEffect(() => {
    const win = ref.current;
    if (!win) return;
    win.addEventListener("close", onClose);
    return () => win.removeEventListener("close", onClose);
  }, [onClose]);

  const { item } = opened;

  return (
    <dialog
      ref={ref}
      className="news-window res-window"
      id="res-window"
      aria-label="Research"
      onClick={(event) => { if (event.target === ref.current) ref.current?.close(); }}
    >
      <div className="news-window-bar">
        <span className="news-window-meta mono">{item.tag}</span>
        <Button kind="ghost" size="sm" className="ms-auto" aria-label="Close"
                onClick={() => ref.current?.close()}>
          ✕ Esc
        </Button>
      </div>

      <div className="news-window-body">
        <h2 className="news-window-title">{item.title}</h2>
        <div className="res-window-detail">
          {item.detail.map((para) => <p key={para.slice(0, 40)}>{para}</p>)}
        </div>
      </div>

      <div className="news-window-foot">
        <ButtonLink kind="solid" href={item.href}>{`${item.label} →`}</ButtonLink>
        <ButtonLink kind="ghost" href="/portfolio.html">All the case studies</ButtonLink>
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------
   the card

   `role` and `tabindex` rather than a real `<button>`, because
   the card holds an `<h3>` and a button may not contain a
   heading. The card becomes the control rather than growing one:
   a button inside a card leaves most of the card unclickable,
   which on a phone is most of the target.

   `preventDefault` is load-bearing on BOTH keys, for different
   reasons. Space scrolls a page that can scroll. Enter carries
   on to the Close button that `showModal()` has just focused, so
   without it the window opens and shuts again inside one
   keystroke, which looks exactly like a card that does nothing.
   ------------------------------------------------------------ */

function ResearchCard({ item, live, onOpen }: {
  item: ResearchItem;
  live: boolean;
  onOpen: (opened: Opened) => void;
}) {
  const open = (from: HTMLElement): void => onOpen({ item, from });

  return (
    <article
      className={live ? "res res-live" : "res"}
      role={live ? "button" : undefined}
      tabIndex={live ? 0 : undefined}
      onClick={live ? (event) => open(event.currentTarget) : undefined}
      onKeyDown={live ? (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        open(event.currentTarget);
      } : undefined}
    >
      <span className="res-tag mono">{item.tag}</span>
      <h3>{item.title}</h3>
      <p>{item.blurb}</p>
      {/* The way in with no JavaScript, and it goes the moment the
          card itself can be pressed: two ways in that say the same
          thing is one of them being read as something else. */}
      {live ? null
        : <a className="res-fallback more" href={item.href}>{`${item.label} →`}</a>}
    </article>
  );
}

/* ------------------------------------------------------------
   the section
   ------------------------------------------------------------ */

export function Research({ items }: { items: ResearchItem[] }) {
  const [live, setLive] = useState(false);
  const [opened, setOpened] = useState<Opened | null>(null);

  useEffect(() => { setLive(true); }, []);

  return (
    <>
      <div className="research" id="research">
        {items.map((item) => (
          <ResearchCard key={item.href} item={item} live={live} onOpen={setOpened} />
        ))}
      </div>

      {/* Rendered only while a card is open, which is how there is
          never more than one dialog in the document. */}
      {opened
        ? <ResearchWindow opened={opened} onClose={() => setOpened(null)} />
        : null}
    </>
  );
}
