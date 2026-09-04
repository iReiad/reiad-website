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
import { LADDER_SCHOOLS, NAV, SCHOOL_ACCENTS } from "@reiad/shared/nav";
import {
  WIDGETS, layoutOf, storedOf, type Placed, type WidgetKind, type WidgetSize,
} from "@reiad/shared/widgets";
import { save, reset, stored, subscribe } from "../../lib/board";
import { GoCard } from "../deck";
import { ContinueCard, useBookmark } from "../door";
import { MarketPulse } from "../market-pulse";
import { SchoolMeters } from "./meters";
import { Icon } from "../icons";
import { SectionLabel } from "../ui/label";
import { Band } from "../ui/band";
import { Button, ButtonLink } from "../ui/button";
import { readSet, subscribe as onProgress } from "../../lib/progress";

/** What this build has a renderer for.

    Four of the catalogue's twelve, and the three that went are the
    three the PAGE now draws: the newest writing, the schools and
    the tools. Measured off the built page, those three widgets
    were 61 per cent of the front page on a phone, and every one of
    them was a second drawing of something already on screen or one
    press away. A widget the page draws better is a widget on the
    board twice.

    They stay in the catalogue, so the Android app keeps them:
    `DRAWABLE` is what THIS build renders, which is not what the
    catalogue holds, and the whole reason the catalogue is data is
    that the two sides run different releases.

    The other five read an account and this page makes no such
    request: `/account` is where they are, and offering them here
    would be five boxes saying sign in on the page a stranger
    meets first. */
const DRAWABLE = ["continue", "progress", "market", "stock"];

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

function Widget({ id, size, totals }: {
  id: string; size: WidgetSize; totals?: Record<string, number>;
}) {
  switch (id) {
    case "continue": return <ContinueCard />;
    case "progress": return <SchoolMeters totals={totals} />;
    /* A size genuinely changes this one: at `wide` it shows its
       first three stories and at `tall` the morning's worth. A
       size that only stretched the same drawing would be a
       stretch wearing a size's name. */
    case "market": return <MarketPulse limit={size === "tall" ? undefined : 3} />;
    case "stock": return <StockTile />;
    default: return null;
  }
}

function StockTile() {
  const item = NAV.flatMap((g) => g.items).find((i) => i.key === "stock");
  if (!item) return null;
  return (
    <GoCard
      href={item.href} art={item.art} icon={item.icon} accent="var(--gold)"
      chip="Tool" title={item.sub ?? item.label} lang="bn"
      dek="একটা টিকার লিখুন: ৪৪টা অনুপাত আর একটা রায়, হিসাবটা দেখিয়ে।"
      go="যাচাই করুন"
    >
      {/* The one thing this card says that the others do not: it
          answers for every school at once. */}
      <span className="flex gap-[5px]" aria-hidden="true">
        {SCHOOL_ACCENTS.slice(0, 4).map((c) => (
          <i key={c} className="size-[9px] rounded-full" style={{ background: c }} />
        ))}
      </span>
    </GoCard>
  );
}

/** Whether this reader has ticked anything at all, in any school.

    The same store the meters read, asked as one question, because
    the board's own existence turns on it: `readSet` is a set per
    school and `subscribe` is the three events that can change one,
    the third of which (`sync:done`) is the one that matters for a
    signed-in reader arriving on a new device. */
function useAnyProgress(): boolean {
  return useSyncExternalStore(
    onProgress,
    () => (LADDER_SCHOOLS.some((s) => readSet(s.key).size > 0) ? "yes" : "no"),
    () => "no",
  ) === "yes";
}

/* ---------- the board ---------- */

export function Board({ start, totals }: { start?: string; totals?: Record<string, number> }) {
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
  const ticked = useAnyProgress();
  const [arranging, setArranging] = useState(false);
  const placed = layoutOf(JSON.parse(snapshot) as string[] | null, DRAWABLE)
    .filter((p) => arranging || p.id !== "continue" || bookmark);

  /* DRAWABLE goes WITH the write. `layoutOf` filtered the stored
     board down to what this build can draw, so writing the result
     back would delete the eight kinds it could not, out of the
     account and off the phone. `save` puts them back. */
  const put = useCallback((next: Placed[]) => { save(next, DRAWABLE); }, []);

  const offered = WIDGETS.filter(
    (k) => DRAWABLE.includes(k.id) && !placed.some((p) => p.id === k.id),
  );

  /* A BOARD IS A READER'S, SO A STRANGER HAS NONE. It opened with
     "আপনার বোর্ড · Your board" and an arrange button on the first
     visit anybody ever made, over four rows reading ০টা পাঠ. That
     is a dashboard of somebody's progress shown to somebody who
     has none, and it was the first thing under the hero.

     Three things make a board theirs, and any one is enough: a
     lesson opened, a lesson ticked, or a board they arranged.
     Until then this is the invitation instead, which says what
     the thing is rather than drawing an empty one. */
  const theirs = Boolean(bookmark) || ticked || snapshot !== "null";

  if (!theirs) {
    return (
      <Band
        tone="soft"
        label={<>আপনার বোর্ড · <span lang="en">Your board</span></>}
        title={<span lang="bn">একটা পাঠ পড়লেই এই পাতাটা আপনার হয়ে যাবে।</span>}
        /* A LESSON, NOT A THIRD INDEX. The door's own button and
           the ledger already offer `/skills`, and a third one on
           the same page is the same call to action said three
           times. `start` is the first lesson of the money ladder,
           handed down as a prop because the ladder is a hundred
           kilobytes of curriculum and this is a client
           component. */
        actions={start
          ? <ButtonLink kind="solid" href={start} lang="bn">প্রথম পাঠটা পড়ুন</ButtonLink>
          : null}
      >
        <span lang="bn">
          কোথায় থেমেছিলেন, কোন স্কুলে কতদূর হয়েছে, আর কী কী রেখে দিয়েছেন:
          সবটা এখানে জমতে থাকবে, আর আপনি নিজের মতো সাজিয়ে নিতে পারবেন।
          কিছু জমা রাখতে অ্যাকাউন্ট লাগে না।
        </span>
      </Band>
    );
  }

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
                <Widget id={p.id} size={p.size} totals={totals} />
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

/* Nothing imports these: they were a re-export for a test
   that reads the shared half directly. `read` went with the
   import it aliased. */
export { DRAWABLE as BOARD_DRAWABLE };
