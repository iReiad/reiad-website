"use client";

/* The headline card and the mini window.

   Headlines are external text. Every value below is a child of a JSX
   element, so React escapes all of it; nothing from the feed is ever
   handed to `dangerouslySetInnerHTML`.

   FETCHING: two endpoints, raced, first usable answer wins, so the page
   does not care which one is currently deployed and does not wait out a
   timeout on the one that is not. Degrades to the last successful fetch
   kept on the device, labelled with when it was.

   THE CARD is a `<button>`, not an `<a>`: it opens the window rather than
   navigating. A grid of squares reads as a board of stories where a list
   reads as a table of contents.

   THE MINI WINDOW grows out of the card it came from, a real FLIP
   measured from that card's own rectangle, so it is obvious which of
   twelve squares was opened. Under prefers-reduced-motion it appears.

   `pulse-cache` is a key in real browsers: renaming it does not move
   somebody's cached headlines, it loses them. The link out is
   `rel="noopener"` and `data-no-prerender`: prerendering someone else's
   site on hover is not ours to do. */

import { useEffect, useRef } from "react";
import { flip } from "../lib/flip";
import { Button, ButtonLink } from "./ui/button";

/* ------------------------------------------------------------
   what a story is
   ------------------------------------------------------------ */

/** One story as `functions/api/news.ts` sends it. Everything but
    the title and the URL is optional, because the feeds belong to
    somebody else: a missing standfirst is ordinary, and
    `title_bn` is only there once the translator has answered. */
export interface NewsItem {
  title: string;
  url: string;
  source?: string;
  region?: string;
  published?: string | null;
  summary?: string;
  title_bn?: string;
}

export interface NewsFeed {
  updated?: string;
  items: NewsItem[];
}

/** What came back and where from. `staleFrom` is set when this
    came off the device rather than off the wire. */
export interface NewsAnswer {
  data: NewsFeed;
  staleFrom: number | null;
}

/* ------------------------------------------------------------
   fetching
   ------------------------------------------------------------ */

const ENDPOINTS = [
  "/api/news",
  "https://market-pulse.i-reiad.workers.dev/",
];

const TIMEOUT_MS = 5000;
const CACHE_KEY = "pulse-cache";
const CACHE_MAX_AGE = 24 * 3600 * 1000;   // a day-old headline is still context

/** A feed with something in it. An answer with an empty `items`
    is a deployment that is up and has nothing to say, which is
    not an answer this page can use, so it loses the race rather
    than winning it empty. */
function isFeed(value: unknown): value is NewsFeed {
  if (typeof value !== "object" || value === null) return false;
  const items = (value as { items?: unknown }).items;
  return Array.isArray(items) && items.length > 0;
}

async function fetchOne(url: string): Promise<NewsFeed> {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(String(res.status));
  const data: unknown = await res.json();
  if (!isFeed(data)) throw new Error("empty");
  return data;
}

interface Kept {
  at: number;
  data: NewsFeed;
}

function keep(data: NewsFeed): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch { /* storage full or blocked; the cache is a bonus */ }
}

function kept(): Kept | null {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (typeof raw !== "object" || raw === null) return null;
    const { at, data } = raw as { at?: unknown; data?: unknown };
    if (typeof at !== "number" || Date.now() - at > CACHE_MAX_AGE) return null;
    if (!isFeed(data)) return null;
    return { at, data };
  } catch { return null; }
}

/** Throws only when there is neither a live answer nor one on the
    device. */
export async function loadNews(): Promise<NewsAnswer> {
  try {
    const data = await Promise.any(ENDPOINTS.map(fetchOne));
    keep(data);
    return { data, staleFrom: null };
  } catch {
    const stale = kept();
    if (stale) return { data: stale.data, staleFrom: stale.at };
    throw new Error("unreachable");
  }
}

/* ------------------------------------------------------------
   "3 hours ago", in the reader's own locale
   ------------------------------------------------------------ */

const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

export function relTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const mins = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (!Number.isFinite(mins)) return "";
  if (mins < 60) return rtf.format(-mins, "minute");
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return rtf.format(-hrs, "hour");
  return rtf.format(-Math.round(hrs / 24), "day");
}

const regionLabel = (item: NewsItem): string =>
  (item.region === "BD" ? "Bangladesh" : "Global");

/* ------------------------------------------------------------
   the card
   ------------------------------------------------------------ */

/** One square. `onOpen` is handed the story and the card itself,
    because the window grows out of that card's rectangle. */
export function NewsCard(
  { item, onOpen }:
  { item: NewsItem; onOpen: (item: NewsItem, from: HTMLElement) => void },
) {
  const bn = Boolean(item.title_bn);

  return (
    <button
      type="button"
      className="news-card"
      data-region={item.region === "BD" ? "bd" : "global"}
      onClick={(event) => onOpen(item, event.currentTarget)}
    >
      <span className="news-card-top">
        <span className={`pill relief-lift ${item.region === "BD" ? "pill-bd" : "pill-global"}`}>
          {regionLabel(item)}
        </span>
        <time dateTime={item.published ?? undefined}>{relTime(item.published)}</time>
      </span>

      <span className={bn ? "news-card-title nt-bn" : "news-card-title"}>
        {item.title_bn || item.title}
      </span>

      {/* The first line or two of the publisher's standfirst. A
          square with a two-line headline in it is mostly paper,
          and a card that shows nothing beyond its own title gives
          a reader no reason to open it. The rest is in the
          window. */}
      {item.summary ? <span className="news-card-sum">{item.summary}</span> : null}

      <span className="news-card-foot">
        <span className="mono news-card-src">{item.source ?? ""}</span>
        {/* An arrow and not a word. "আরও →" was 55px of a 209px
            row, and the only way to fit it beside "The Business
            Standard" was to take the last five letters off the
            publisher's name, on every card that named them. */}
        <span className="news-card-go relief-lift" aria-hidden="true">→</span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------
   the mini window

   The growing is `lib/flip.ts`, shared with the About page's
   research window, which opens the same way out of the card that
   was pressed.
   ------------------------------------------------------------ */

/** Which story is open, and the card it was opened from. */
export interface Story {
  item: NewsItem;
  from: HTMLElement | null;
}

const BN_NOTE = "শিরোনামের বাংলা রূপ স্বয়ংক্রিয় অনুবাদ। পুরো খবরটা মূল সূত্রে।";
const EN_NOTE = "Selected automatically, and summarised from the publisher's own "
  + "standfirst. The full story is at the source.";

    /**
     * One story, in a modal window. Rendered only while a story is open,
     * which is how there is never more than one dialog in the document.
     *
     * `showModal()` brings the focus trap, the backdrop and Escape, so
     * none of the four is implemented here. Escape and the backdrop both
     * end in the dialog's own `close` event, which is the one place this
     * tells the page above it that the window has gone.
     */
export function NewsWindow({ story, onClose }: { story: Story; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const win = ref.current;
    if (!win) return;
    if (!win.open) win.showModal();
    flip(win, story.from);
  }, [story]);

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

  const { item } = story;
  const bn = Boolean(item.title_bn);

  return (
    <dialog
      ref={ref}
      className="news-window"
      id="news-window"
      aria-label="Story"
      onClick={(event) => { if (event.target === ref.current) ref.current?.close(); }}
    >
      <div className="news-window-bar">
        <span className="news-window-meta mono">
          {[regionLabel(item), item.source, relTime(item.published)]
            .filter(Boolean).join("  ·  ")}
        </span>
        {/* `ghost`, not `quiet`. It was `.icon-btn push`: a panel
            ground with a hairline, and `quiet` is transparent
            until hovered. The way out of a modal is the one
            control in it that must be findable without looking.
            `components/research.tsx` draws the same window's
            close the same way, so the two match. */}
        <Button kind="ghost" size="sm" className="ms-auto" aria-label="Close"
                onClick={() => ref.current?.close()}>
          ✕ Esc
        </Button>
      </div>

      <div className="news-window-body">
        <h2 className={bn ? "news-window-title nt-bn" : "news-window-title"}>
          {item.title_bn || item.title}
        </h2>
        {/* The English original, under a headline a machine
            translated. Hidden rather than absent, because it is
            the same fact either way and the window has one shape. */}
        <p className="news-window-en" hidden={!bn}>{item.title}</p>
        <p className="news-window-sum" hidden={!item.summary}>{item.summary ?? ""}</p>
        <p className="news-window-note mono">{bn ? BN_NOTE : EN_NOTE}</p>
      </div>

      <div className="news-window-foot">
        <ButtonLink kind="solid" href={item.url} target="_blank" rel="noopener"
                    data-no-prerender="">
          {item.source ? `Read it at ${item.source} →` : "Read it at the source →"}
        </ButtonLink>
        <ButtonLink kind="ghost" href="/insights">All the headlines</ButtonLink>
      </div>
    </dialog>
  );
}
