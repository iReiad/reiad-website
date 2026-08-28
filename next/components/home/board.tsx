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
import { ContinueCard } from "../door";
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
    `unlisted` for theirs. */
function NavBand({ group }: { group: string }) {
  const found = NAV.find((g) => g.id === group);
  if (!found) return null;
  const rows = found.items.filter((i) => !i.hub && !i.unlisted && !i.soon);
  if (!rows.length) return null;

  return (
    <section>
      <div className="hub-section-head">
        <SectionLabel>{found.label}</SectionLabel>
      </div>
      <div className="deck deck-2">
        {rows.map((item) => (
          <a
            key={item.href} href={item.href} className="gate-tile"
            lang={item.sub ? "bn" : undefined}
            style={{ ["--accent" as string]: item.accent ?? found.accent }}
          >
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
    </section>
  );
}

function StockTile() {
  const item = NAV.flatMap((g) => g.items).find((i) => i.key === "stock");
  if (!item) return null;
  return (
    <a href={item.href} className="gate-tile" style={{ ["--accent" as string]: "var(--gold)" }}>
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
  const placed = layoutOf(JSON.parse(snapshot) as string[] | null, DRAWABLE);
  const [arranging, setArranging] = useState(false);

  const put = useCallback((next: Placed[]) => { save(next); }, []);

  const offered = WIDGETS.filter(
    (k) => DRAWABLE.includes(k.id) && !placed.some((p) => p.id === k.id),
  );

  return (
    <>
      <div className="flex justify-end mb-[var(--gap)]">
        <Button
          kind="soft" size="sm" pressed={arranging}
          onClick={() => setArranging((was) => !was)}
        >
          <Icon name={arranging ? "close" : "menu"} size={15} />
          {arranging ? "হয়ে গেছে" : "সাজান"}
        </Button>
      </div>

      <div className="board">
        {placed.map((p, at) => {
          const kind = KINDS.get(p.id);
          return (
            <div key={p.id} className={SIZE_CLASS[p.size]}>
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
              <div className={arranging ? "opacity-70" : undefined}>
                <Widget id={p.id} size={p.size} />
              </div>
            </div>
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
    </>
  );
}

/** One widget's arranging controls.

    A strip ABOVE it rather than an overlay on it: an overlay on
    glass is a second surface on a surface, and every kind having
    the same rest state is what the material section of
    `CLAUDE.md` warns about.

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
      <span className="mono" lang="bn">{kind.bn}</span>
      {first ? null : (
        <Button kind="quiet" size="sm" onClick={onUp} aria-label={`${kind.bn}: উপরে নিন`}>
          <Icon name="chevron" size={15} />
        </Button>
      )}
      {last ? null : (
        <Button kind="quiet" size="sm" onClick={onDown} aria-label={`${kind.bn}: নিচে নামান`}>
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
