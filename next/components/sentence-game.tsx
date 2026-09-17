"use client";

/* ============================================================
   sentence-game.tsx: put the words back in order.

   A day of a practice book has five model sentences a learner
   reads aloud. This shuffles the words of each and asks for the
   sentence back, one tap per word, with the Bangla meaning as the
   prompt and the day's own pattern written above it, so the game
   is the pattern being drilled rather than a puzzle beside it.
   The words the pattern names are lit in the finished sentence:
   that is the structure, shown rather than explained.

   Nothing is stored and nothing is scored out of ten: the round
   counter is for the evening, and tomorrow the same five are
   worth building again. The shuffle is seeded from the day and
   the round, so it is the same puzzle on every device.

   Sentences that are not sentences (the pronunciation days'
   "Wasser = ভাসা" lines, anything under three words) are left
   out by the server before this mounts; `playable()` in
   `lib/sentence-game.ts` is that filter and `workbook.tsx` calls
   it. There rather than here because a server component cannot
   call a function exported from a client module.
   ============================================================ */

import { useState } from "react";
import { shuffled } from "@reiad/shared/lesson";
import { Button } from "./ui/button";
import { tokens, type GameLine } from "../lib/sentence-game";

export interface GameWords {
  title: string;
  sub: string;
  prompt: string;
  check: string;
  next: string;
  again: string;
  right: string;
  wrong: string;
  done: string;
  replay: string;
  pattern: string;
}

/** A word with its punctuation and case taken off, for matching
    against the pattern's words. */
const bare = (w: string): string =>
  w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

export function SentenceGame({ id, lines, pattern, lang, words }: {
  id: string;
  lines: GameLine[];
  /** The day's pattern shape, `Ich möchte ____`. */
  pattern: string;
  lang: string;
  words: GameWords;
}) {
  const [round, setRound] = useState(0);
  const [placed, setPlaced] = useState<number[]>([]);
  const [state, setState] = useState<"building" | "right" | "wrong">("building");
  const [solved, setSolved] = useState<number[]>([]);

  const line = lines[round];
  const want = tokens(line.target);
  const pool = shuffled(want.map((w, i) => ({ w, i })), `${id}-${round}`);
  const structure = new Set(tokens(pattern).map(bare).filter((w) => w.length > 1 && !/^_+$/.test(w)));

  const place = (i: number) => {
    if (state !== "building" || placed.includes(i)) return;
    setPlaced([...placed, i]);
  };
  const unplace = (i: number) => {
    if (state !== "building") return;
    setPlaced(placed.filter((p) => p !== i));
  };

  const check = () => {
    const built = placed.map((i) => want[i]);
    const ok = built.length === want.length && built.every((w, k) => w === want[k]);
    setState(ok ? "right" : "wrong");
    if (ok && !solved.includes(round)) setSolved([...solved, round]);
  };

  const again = () => { setPlaced([]); setState("building"); };
  const next = () => {
    const after = lines.findIndex((_, k) => k > round && !solved.includes(k));
    const to = after >= 0 ? after : lines.findIndex((_, k) => !solved.includes(k));
    setRound(to >= 0 ? to : round);
    again();
  };
  const replay = () => { setSolved([]); setRound(0); again(); };

  const allDone = solved.length === lines.length && state === "right";

  return (
    <div className="grid gap-3 rounded-card border border-accent-line bg-accent-soft p-4"
         data-game="satzbau">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-code text-t1 uppercase tracking-wider text-accent">
          <span lang={lang}>{words.title}</span> · <span lang="bn">{words.sub}</span>
        </span>
        <span className="font-code text-t2 text-ink-soft" lang="bn">
          {bn(solved.length)}/{bn(lines.length)}
        </span>
      </div>

      <p className="text-t3 text-ink-soft" lang="bn">
        {words.pattern}: <span className="font-code text-ink" lang={lang}>{pattern}</span>
      </p>

      <p className="text-t6" lang="bn">
        <span className="text-ink-soft">{words.prompt} </span>
        <b>{line.bn}</b>
      </p>

      {/* The sentence being built. Tapping a word gives it back. */}
      <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-tight border border-dashed border-accent-line bg-paper p-2"
           aria-label={words.title} lang={lang}>
        {placed.length === 0 ? (
          <span className="text-t3 text-ink-soft" lang="bn">নিচের শব্দগুলো ছুঁয়ে বসাও</span>
        ) : placed.map((i, k) => {
          const w = want[i];
          const rightHere = state !== "building" && w === want[k];
          const lit = state === "right" && structure.has(bare(w));
          return (
            <button key={i} type="button" onClick={() => unplace(i)}
                    disabled={state !== "building"}
                    className={[
                      "rounded-round border px-3 py-1.5 text-t5 font-medium transition-[background-color,color] duration-[var(--fast)]",
                      lit ? "border-transparent bg-accent-strong text-accent-ink"
                        : state === "wrong" && !rightHere ? "border-danger text-danger"
                        : rightHere ? "border-accent bg-panel text-accent"
                        : "border-hairline bg-panel",
                    ].join(" ")}>
              {w}
            </button>
          );
        })}
      </div>

      {/* The words still to place. */}
      {state === "building" ? (
        <div className="flex flex-wrap gap-2" lang={lang}>
          {pool.filter((p) => !placed.includes(p.i)).map((p) => (
            <button key={p.i} type="button" onClick={() => place(p.i)}
                    className="rounded-round border border-pane-edge bg-panel px-3 py-1.5 text-t5 font-medium hover:border-accent">
              {p.w}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {state === "building" ? (
          <Button kind="solid" size="sm" disabled={placed.length !== want.length} onClick={check}>
            {words.check}
          </Button>
        ) : state === "wrong" ? (
          <>
            <span className="text-t4 text-danger" lang="bn">{words.wrong}</span>
            <Button kind="soft" size="sm" onClick={again}>{words.again}</Button>
          </>
        ) : allDone ? (
          <>
            <span className="text-t5 font-semibold text-accent" lang="bn">{words.done}</span>
            <Button kind="soft" size="sm" onClick={replay}>{words.replay}</Button>
          </>
        ) : (
          <>
            <span className="text-t4 font-semibold text-accent" lang="bn">{words.right}</span>
            <Button kind="solid" size="sm" onClick={next}>{words.next}</Button>
          </>
        )}
      </div>
    </div>
  );
}

const bn = (n: number): string => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
