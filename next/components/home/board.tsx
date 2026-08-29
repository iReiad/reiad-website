"use client";

/* ============================================================
   The front page is a board the reader arranges.

   ---- what was wrong with it ----

   A deck of tiles, every one of them a link, every one saying the
   same thing in the same voice. Nothing on it was about the
   reader: how far through a school they were, what they were
   reading, what was published this week were all one page deeper.
   A page like that is a menu, and a menu is what you read once.

   ---- the split ----

   `shared/widgets.ts` is the catalogue and the parse, and it is
   DATA, so the Android app draws the same board from the same
   list. A widget's DRAWING is code on each side: `DRAWABLE`
   below is what THIS build can render, and a kind in the
   catalogue that is not in it is skipped rather than left as an
   empty box with a title on it.

   ---- and it renders with no JavaScript ----

   `useSyncExternalStore` with a server snapshot of "never
   arranged", which is the same shape `door.tsx` uses. The server
   renders the DEFAULT board, so a reader with JavaScript off gets
   a real front page rather than a blank one, and a reader who has
   arranged theirs sees it swap in on hydration. The alternative,
   reading storage during render, is a hydration mismatch and
   React error #418.
   ============================================================ */

import { useCallback, useState, useSyncExternalStore } from "react";
import { NAV, SCHOOL_ACCENTS } from "@reiad/shared/nav";
import {
  WIDGETS, layoutOf, storedOf, type Placed, type WidgetKind, type WidgetSize,
} from "@reiad/shared/widgets";
import { board as read, save, reset, stored, subscribe } from "../../lib/board";
import { ContinueCard, useBookmark } from "../door";
import { PulseCard } from "../pulse-card";
import { MarketPulse } from "../market-pulse";
import { SchoolMeters } from "./meters";
import { Icon } from "../icons";
import { SectionLabel } from "../ui/label";
import { Button } from "../ui/button";

/** What this build has a renderer for.

    Seven of the catalogue's twelve. The other five read an
    account and this page makes no such request: `/account` is
    where they are, and offering them here would be five boxes
    saying sign in on the page a stranger meets first. */
const DRAWABLE = ["continue", "progress", "pulse", "market", "schools", "tools", "stock"];

const KINDS = new Map(WIDGETS.map((k) => [k.id, k]));

/** Written out rather than templated, because `check-css.ts`
    reads class names as literals: `board-${"{"}size{"}"}` is
    three rules styling nothing as far as it can see, and a rule
    it cannot see used is a rule it will one day be right
    about. */
const SIZE_CLASS: Record<WidgetSize, string> = {
  small: "board-small",
  wide: "board-wide",
  tall: "board-tall",
};

/** Widgets that say their own name loudly enough, so the board
    does not say it again above them.

    One so far, and the test is whether the widget's FIRST LINE is
    already its name: the featured-style pulse tile leads with the
    piece's title, the meters lead with a list, and the market
    grid leads with somebody else's headline, so all three need
    telling apart. The continue card leads with a chip that says
    where you were, in the school's own words, which is the same
    sentence its head would carry. */
const SELF_TITLED = new Set(["continue"]);

/* ---------- the widgets this page can draw ---------- */

function Widget({ id, size }: { id: string; size: WidgetSize }) {
  switch (id) {
    case "continue": return <ContinueCard />;
    case "progress": return <SchoolMeters />;
    /* The two feeds are the kinds a size genuinely changes: at
       `wide` each shows its first story and at `tall` the
       morning's worth. A size that only stretched the same
       drawing would be a stretch wearing a size's name. */
    case "pulse": return <PulseCard limit={size === "tall" ? 4 : 1} />;
    case "market": return <MarketPulse limit={size === "tall" ? undefined : 3} />;
    case "schools": return <NavBand group="learn" />;
    case "tools": return <NavBand group="make" />;
    case "stock": return <StockTile />;
    default: return null;
  }
}

/** A group of the menu as a row of tiles.

    Out of `shared/nav.ts` and never typed here, which is the rule
    at the top of `CLAUDE.md`: a school added there appears on the
    front page, in the rail and in the footer at once. `hub` is
    skipped for the reason `/skills` skips it, and `soon` and
    `unlisted` for theirs.

    It draws no heading of its own. It used to draw the nav
    group's (`শেখা · LEARNING`), which is a THIRD name for one
    thing: the catalogue calls this widget `যা যা শেখানো হয়`, the
    picker offers it under that name, and the arranging strip said
    it a fourth time. The board's head carries it once now, from
    the catalogue, which is the half of this that the Android app
    reads too.

    `.deck board-deck`, and it was `.deck deck-2`. A band is half
    the board on a laptop now rather than the whole of it, and at
    501px measured `deck-2`'s 400px minimum, and `.deck`'s 280px,
    both came out at ONE column: the six schools stacked 1305px
    tall beside four tools at 737px. `board-deck` is the same deck
    with a minimum that fits two in half a board. */
/** The picture a tile wears, by the key `shared/nav.ts` gives it.

    Written out in full rather than built from the key, because
    `scripts/build-card-art.ts --check` reads this file for the
    literal and fails on one naming a drawing that is not on disk:
    a tile whose band 404s renders as a card with a hole in it and
    nothing else here would catch that.

    A key that is not in this table gets no band and is a card of
    words, which is what every tile was before this. So a school
    added to the menu appears on the board the moment it is added,
    and gains a picture when somebody draws one. */
const TILE_ART: Record<string, string> = {
  money: "/art/money-tile.webp",
  deutsch: "/art/deutsch-tile.webp",
  quran: "/art/quran-tile.webp",
  english: "/art/english-tile.webp",
  cooking: "/art/cooking-tile.webp",
  travel: "/art/travel-tile.webp",
  stock: "/art/stock-tile.webp",
  live: "/art/live-tile.webp",
  routine: "/art/routine-tile.webp",
  diet: "/art/diet-tile.webp",
};

/** The band across the top of a tile.

    An `<img>` rather than a background, and that is the whole
    reason this is a component: ten of these are on the front page
    at once, and an image element is the only kind a browser will
    decline to fetch while it is off screen. As a background they
    were 150 KB nobody had scrolled to yet.

    `alt` is empty because the tile's title says the same thing
    one line below it, and the whole tile is one link. */
function Band({ art }: { art: string | undefined }) {
  if (!art) return null;
  return (
    <span className="gt-band" aria-hidden="true">
      <img src={art} alt="" loading="lazy" decoding="async" />
    </span>
  );
}

function NavBand({ group }: { group: string }) {
  const found = NAV.find((g) => g.id === group);
  if (!found) return null;
  const rows = found.items.filter((i) => !i.hub && !i.unlisted && !i.soon);
  if (!rows.length) return null;

  return (
    <div className="deck board-deck">
      {rows.map((item) => (
        <a
          key={item.href} href={item.href}
          className={`gate-tile${item.key && TILE_ART[item.key] ? " gate-banded" : ""}`}
          lang={item.sub ? "bn" : undefined}
          style={{ ["--accent" as string]: item.accent ?? found.accent }}
        >
          <Band art={item.key ? TILE_ART[item.key] : undefined} />
          <span className="flex items-center gap-2.5 min-w-0">
            <span className="gt-disc"><Icon name={item.icon} size={18} /></span>
            {item.kind ? <span className="gt-chip mono">{item.kind}</span> : null}
          </span>
          <span className="gt-title">{item.sub ?? item.label}</span>
          {item.blurb ? <span className="gt-dek max-sm:line-clamp-3">{item.blurb}</span> : null}
          <span className="gt-go mono">
            {item.kind === "কোর্স" ? "কোর্সটা খুলুন" : "খুলুন"}
            <Icon name="chevron" size={14} />
          </span>
        </a>
      ))}
    </div>
  );
}

function StockTile() {
  const item = NAV.flatMap((g) => g.items).find((i) => i.key === "stock");
  if (!item) return null;
  return (
    <a href={item.href} className="gate-tile gate-banded"
       style={{ ["--accent" as string]: "var(--gold)" }}>
      <Band art={TILE_ART.stock} />
      <span className="flex items-center gap-2.5 min-w-0">
        <span className="gt-disc"><Icon name={item.icon} size={18} /></span>
        <span className="gt-chip mono">Tool</span>
      </span>
      <span className="gt-title" lang="bn">{item.sub ?? item.label}</span>
      <span className="flex gap-[5px] my-0.5" aria-hidden="true">
        {SCHOOL_ACCENTS.slice(0, 4).map((c) => (
          <i key={c} className="size-[9px] rounded-full" style={{ background: c }} />
        ))}
      </span>
      <span className="gt-dek" lang="bn">
        একটা টিকার লিখুন: ৪৪টা অনুপাত আর একটা রায়, হিসাবটা দেখিয়ে।
      </span>
      <span className="gt-go mono">যাচাই করুন<Icon name="chevron" size={14} /></span>
    </a>
  );
}

/* ---------- the board ---------- */

export function Board() {
  /* The stored list as a STRING, not the parsed array: React
     compares snapshots by identity and a fresh array every read
     would loop for ever. The same trap `door.tsx` names. */
  const snapshot = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(stored()),
    () => "null",
  );
  /* A WIDGET WITH NOTHING TO SAY IS NOT PLACED, and hiding it
     afterwards is not the same thing: on a laptop the board is
     twelve columns and the continue card is six of them, so a
     reader who has not started a lesson got the board's first
     row half empty and the widget beside it orphaned. A cell
     that is hidden is still a cell.

     One widget can be empty today and it is this one, so the
     test is written out rather than made into a table of one.
     `useBookmark` is the card's own hook, so the two cannot
     disagree about whether there is a bookmark to continue from.

     Never while ARRANGING: a widget nobody can see is a widget
     nobody can take off the board. */
  const bookmark = useBookmark();
  const [arranging, setArranging] = useState(false);
  const placed = layoutOf(JSON.parse(snapshot) as string[] | null, DRAWABLE)
    .filter((p) => arranging || p.id !== "continue" || bookmark);

  const put = useCallback((next: Placed[]) => { save(next); }, []);

  const offered = WIDGETS.filter(
    (k) => DRAWABLE.includes(k.id) && !placed.some((p) => p.id === k.id),
  );

  return (
    <section aria-labelledby="board-label">
      {/* The board's own head, and the button lives IN it. It was
          a lone control at the right of an empty band with nothing
          saying what it arranged, which reads as a stray button
          rather than as the top of a section. Every other section
          of this site opens with a `SectionLabel` and a rule under
          it; this one does too, and the button sits on the same
          line because it belongs to the label rather than to the
          first widget under it. */}
      <div className="board-bar">
        <SectionLabel id="board-label">
          আপনার বোর্ড · <span lang="en">Your board</span>
        </SectionLabel>
        <Button
          kind="soft" size="sm" pressed={arranging}
          onClick={() => setArranging((was) => !was)}
        >
          <Icon name={arranging ? "close" : "menu"} size={15} />
          {arranging ? "হয়ে গেছে" : "সাজান"}
        </Button>
      </div>

      {/* `data-arranging` is what lets the stylesheet hide a
          widget that drew nothing without hiding it from the
          person trying to take it off the board. A widget can
          render empty for a reason only the browser knows: the
          continue card has nothing to say until there is a
          bookmark, and its cell was a six-column hole at the top
          of the board for every reader who has not started a
          lesson, which is everybody arriving for the first time. */}
      <div className="board" data-arranging={arranging ? "yes" : undefined}>
        {placed.map((p, at) => {
          const kind = KINDS.get(p.id);
          /* THE NAME COMES FROM THE CATALOGUE, ONCE. Three of the
             widgets drew their own heading, in three different
             shapes, and three drew none: the market grid was eight
             of somebody else's headlines under nothing at all. The
             catalogue already holds a name in both languages, the
             picker already offers it under that name, and it is
             data, so the app says the same words. */
          const titled = kind && !SELF_TITLED.has(p.id);
          return (
            <section key={p.id} className={`board-item ${SIZE_CLASS[p.size]}`}
                     aria-label={kind ? kind.en : undefined}>
              {titled || (arranging && kind) ? (
                <div className="board-head">
                  {titled ? (
                    <SectionLabel className="board-item-label">
                      <span lang="bn">{kind.bn}</span>
                      {" · "}<span lang="en">{kind.en}</span>
                    </SectionLabel>
                  ) : null}
                  {arranging && kind ? (
                    <Strip
                      kind={kind} placed={p}
                      first={at === 0} last={at === placed.length - 1}
                      onUp={() => put(moved(placed, at, at - 1))}
                      onDown={() => put(moved(placed, at, at + 1))}
                      onResize={() => {
                        const other = otherSize(kind, p.size);
                        if (!other) return;
                        put(placed.map((q, i) => (i === at ? { ...q, size: other } : q)));
                      }}
                      onRemove={() => put(placed.filter((_, i) => i !== at))}
                    />
                  ) : null}
                </div>
              ) : null}
              <div className={["board-body", arranging ? "opacity-70" : null]
                .filter(Boolean).join(" ")}>
                <Widget id={p.id} size={p.size} />
              </div>
            </section>
          );
        })}
      </div>

      {arranging ? (
        <section className="board-picker">
          <div className="hub-section-head">
            <SectionLabel>আরও যোগ করুন · <span lang="en">Add to your board</span></SectionLabel>
          </div>
          {offered.length ? (
            <ul className="board-offers">
              {offered.map((kind) => (
                <li key={kind.id}>
                  <span className="gt-disc"><Icon name={kind.icon} size={16} /></span>
                  <span className="min-w-0">
                    <b lang="bn">{kind.bn}</b>
                    <span className="block text-[0.9em] opacity-75" lang="bn">{kind.note}</span>
                  </span>
                  <Button
                    kind="soft" size="sm"
                    onClick={() => put([...placed, { id: kind.id, size: firstSize(kind) }])}
                  >
                    যোগ করুন
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p lang="bn">সবগুলোই বোর্ডে আছে। যেটা লাগবে না সেটা সরিয়ে দিলে এখানে আবার দেখা যাবে।</p>
          )}
          <Button kind="quiet" size="sm" onClick={reset}>
            আগের মতো করে দিন
          </Button>
        </section>
      ) : null}
    </section>
  );
}

/** One widget's arranging controls.

    In the head BESIDE its name rather than in a strip above it:
    an overlay on glass is a second surface on a surface, and a
    strip of its own was a second row saying the widget's name,
    which the head already says once, out of the catalogue.

    A control that cannot do anything is absent rather than
    disabled, because a disabled control is a control a reader
    presses twice before deciding the page is broken. */
function Strip({ kind, placed, first, last, onUp, onDown, onResize, onRemove }: {
  kind: WidgetKind; placed: Placed; first: boolean; last: boolean;
  onUp: () => void; onDown: () => void; onResize: () => void; onRemove: () => void;
}) {
  const other = otherSize(kind, placed.size);
  return (
    <div className="board-strip">
      {/* THE DIRECTION IS ON THE BUTTON, NOT ON ITS POSITION. The
          one chevron in the icon set points right, so up and down
          are that drawing turned, and the stylesheet turned it by
          `button:nth-of-type(1)` and `(2)`. Both of those controls
          are CONDITIONAL: the first widget on the board has no up
          and the last has no down, so at the top of the board the
          down arrow was the first button and pointed UP, and at
          the bottom the resize mark was the second and was turned
          on its side. A board of one widget got both. */}
      {first ? null : (
        <Button kind="quiet" size="sm" className="board-up"
                onClick={onUp} aria-label={`${kind.bn}: উপরে নিন`}>
          <Icon name="chevron" size={15} />
        </Button>
      )}
      {last ? null : (
        <Button kind="quiet" size="sm" className="board-down"
                onClick={onDown} aria-label={`${kind.bn}: নিচে নামান`}>
          <Icon name="chevron" size={15} />
        </Button>
      )}
      {other ? (
        <Button
          kind="quiet" size="sm" onClick={onResize}
          aria-label={`${kind.bn}: ${
            other === "small" ? "ছোট করুন" : other === "tall" ? "লম্বা করুন" : "চওড়া করুন"
          }`}
        >
          <Icon name="menu" size={15} />
        </Button>
      ) : null}
      <Button kind="quiet" size="sm" onClick={onRemove} aria-label={`${kind.bn}: সরিয়ে দিন`}>
        <Icon name="close" size={15} />
      </Button>
    </div>
  );
}

/* ---------- the small arithmetic ----------

   Written here rather than inline because a reorder that is right
   in the middle and wrong at the ends is the classic off-by-one,
   and `scripts/widgets.test.ts` holds the same shape on the
   shared side. */

function moved(placed: Placed[], from: number, to: number): Placed[] {
  if (from < 0 || from >= placed.length) return placed;
  const target = Math.min(Math.max(to, 0), placed.length - 1);
  if (target === from) return placed;
  const out = [...placed];
  out.splice(target, 0, out.splice(from, 1)[0]);
  return out;
}

/** The next size along, wrapping, or null where the kind offers
    one: a resize control on a widget with one size is a control
    that does nothing twice. */
function otherSize(kind: WidgetKind, size: WidgetSize): WidgetSize | null {
  if (kind.sizes.length < 2) return null;
  const at = kind.sizes.indexOf(size);
  return kind.sizes[(at + 1) % kind.sizes.length] ?? null;
}

function firstSize(kind: WidgetKind): WidgetSize {
  return kind.sizes[0] ?? "full";
}

export { DRAWABLE as BOARD_DRAWABLE, storedOf as boardStoredOf, read as readBoard };
