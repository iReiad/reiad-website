/* ============================================================
   lesson/interactive.tsx: the eight blocks a reader DOES
   something to.

   Quiz, order, match, bins, reveal, compare, spot, drill. The lab
   is next door because it computes and these do not.

   ---- three rules all eight follow ----

   **Nothing is scored out of ten.** A percentage at the end of a
   quiz turns a lesson into an exam and teaches the reader to
   guess until the number goes green. What each of these does
   instead is EXPLAIN: every option carries a `why`, right ones
   included, and the explanation is what the reader came for.

   **Nothing shuffles randomly.** `shuffled()` in
   `shared/lesson.ts` is seeded from the mount id, so the server
   and the browser lay the same puzzle out. `Math.random()` here
   would be a hydration mismatch on every lesson that has one,
   which is React #418 and the failure that blanked every
   calculator on this site for a day.

   **Only one of them remembers anything.** A drill is a list of
   things to do away from the screen and a reader comes back to it
   over a week, so it is stored, under the checkpoint key the
   school already has. A quiz is not: being made to re-answer is
   the point of coming back to it.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import {
  shuffled,
  type BinsBlock, type CompareBlock, type DrillBlock, type MatchBlock,
  type OrderBlock, type QuizBlock, type RevealBlock, type Say, type SpotBlock,
} from "@reiad/shared/lesson";
import { bnNum } from "@reiad/shared/lesson";
import { checkSet, subscribe, toggleCheck } from "../../lib/progress";
import { Button } from "../ui/button";
import { T, TBlock, TPair, pick } from "./lang";
import { useReadLang } from "./lang-switch";

/* ---------- small shared pieces ---------- */

/** The line that appears once a reader has committed. Every one
    of these blocks has one and they all look the same, which is
    the point: the reader learns where the explanation appears. */
function Why({ s, tone }: { s: Say | undefined; tone?: string }) {
  if (!s) return null;
  return (
    <p className="ls-why" data-tone={tone ?? "plain"}>
      <TBlock s={s} />
    </p>
  );
}

const AGAIN: Say = { bn: "আবার", en: "Again" };
const CHECK: Say = { bn: "মিলিয়ে দেখুন", en: "Check" };

function Again({ onClick }: { onClick: () => void }) {
  const lang = useReadLang();
  return (
    <Button kind="quiet" size="sm" onClick={onClick}>{pick(AGAIN, lang)}</Button>
  );
}

/* ---------- quiz ---------- */

export function Quiz({ block, id }: { block: QuizBlock; id: string }) {
  const [picked, setPicked] = useState<Record<string, Set<number>>>({});
  const lang = useReadLang();

  const choose = (q: number, o: number, many: boolean): void => {
    setPicked((was) => {
      const key = String(q);
      const had = new Set(was[key] ?? []);
      if (!many) return { ...was, [key]: new Set([o]) };
      if (had.has(o)) had.delete(o); else had.add(o);
      return { ...was, [key]: had };
    });
  };

  return (
    <div className="ls-quiz">
      {block.questions.map((q, qi) => {
        const many = q.options.filter((o) => o.right).length > 1;
        const chosen = picked[String(qi)] ?? new Set<number>();
        const answered = chosen.size > 0;
        return (
          <div key={qi} className="ls-q">
            <p className="ls-ask">
              <span className="ls-q-n mono">{bnNum(qi + 1)}</span>
              <TPair bn={q.ask.bn} en={q.ask.en} />
            </p>
            {/* Said before a reader can be marked wrong by it,
                rather than discovered by being marked wrong. */}
            {many ? (
              <p className="ls-hint mono">
                <TPair bn="একাধিক উত্তর ঠিক" en="More than one is right" />
              </p>
            ) : null}
            <ul className="ls-opts">
              {q.options.map((o, oi) => {
                const on = chosen.has(oi);
                const state = !on ? undefined : o.right ? "right" : "wrong";
                return (
                  <li key={oi}>
                    <button
                      type="button"
                      className="ls-opt"
                      aria-pressed={on}
                      data-state={state}
                      onClick={() => choose(qi, oi, many)}
                    >
                      <span className="ls-opt-mark" aria-hidden="true" />
                      <span className="ls-opt-text"><T s={o.text} /></span>
                    </button>
                    {on ? <Why s={o.why} tone={o.right ? "good" : "bad"} /> : null}
                  </li>
                );
              })}
            </ul>
            {answered ? (
              <p className="ls-again">
                <Button kind="quiet" size="sm"
                        onClick={() => setPicked((was) => ({ ...was, [String(qi)]: new Set() }))}>
                  {pick(AGAIN, lang)}
                </Button>
              </p>
            ) : null}
          </div>
        );
      })}
      <p className="ls-foot mono" id={`${id}-foot`}>
        <TPair bn="কোনো নম্বর নেই। ভুলটার কারণ জানাই এখানকার কাজ।"
               en="Nothing is scored. Knowing why is the whole job." />
      </p>
    </div>
  );
}

/* ---------- order ---------- */

export function Order({ block, id }: { block: OrderBlock; id: string }) {
  const answer = block.items;
  const start = shuffled(answer.map((_, i) => i), id);
  const [order, setOrder] = useState<number[]>(start);
  const [shown, setShown] = useState(false);
  const lang = useReadLang();

  const move = (at: number, by: number): void => {
    const to = at + by;
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    [next[at], next[to]] = [next[to], next[at]];
    setOrder(next);
    setShown(false);
  };

  const right = order.every((v, i) => v === i);

  return (
    <div className="ls-order">
      <ol className="ls-items">
        {order.map((which, at) => {
          const item = answer[which];
          const inPlace = shown && which === at;
          return (
            <li key={which} className="ls-item"
                data-state={shown ? (inPlace ? "right" : "wrong") : undefined}>
              <span className="ls-item-n mono">{bnNum(at + 1)}</span>
              <span className="ls-item-text"><T s={item.text} /></span>
              <span className="ls-moves">
                <button type="button" className="ls-move" onClick={() => move(at, -1)}
                        disabled={at === 0}
                        aria-label={lang === "bn" ? "উপরে তুলুন" : "Move up"}>
                  <span aria-hidden="true">↑</span>
                </button>
                <button type="button" className="ls-move" onClick={() => move(at, 1)}
                        disabled={at === order.length - 1}
                        aria-label={lang === "bn" ? "নিচে নামান" : "Move down"}>
                  <span aria-hidden="true">↓</span>
                </button>
              </span>
              {shown && item.why ? <Why s={item.why} tone={inPlace ? "good" : "bad"} /> : null}
            </li>
          );
        })}
      </ol>
      <p className="ls-actions">
        <Button kind="soft" size="sm" onClick={() => setShown(true)}>{pick(CHECK, lang)}</Button>
        <Again onClick={() => { setOrder(shuffled(answer.map((_, i) => i), `${id}-again`)); setShown(false); }} />
      </p>
      {shown ? (
        <p className="ls-verdict" data-tone={right ? "good" : "warn"}>
          <TBlock s={right
            ? { bn: "পুরোটাই ঠিক ক্রমে।", en: "All of it, in the right order." }
            : { bn: "কয়েকটা জায়গা বদলাতে হবে। সবুজগুলো ঠিক আছে।", en: "A few need moving. The green ones are already right." }} />
        </p>
      ) : null}
    </div>
  );
}

/* ---------- match ---------- */

export function Match({ block, id }: { block: MatchBlock; id: string }) {
  const rights = shuffled(block.pairs.map((_, i) => i), id);
  const [held, setHeld] = useState<number | null>(null);
  const [joined, setJoined] = useState<Record<number, number>>({});
  const lang = useReadLang();

  const takeLeft = (i: number): void => setHeld(held === i ? null : i);
  const takeRight = (i: number): void => {
    if (held === null) return;
    setJoined((was) => {
      const next: Record<number, number> = {};
      /* One right answer belongs to one left prompt, so joining
         a right that is already taken moves it rather than
         letting two lines point at it. */
      for (const [l, r] of Object.entries(was)) {
        if (Number(l) !== held && r !== i) next[Number(l)] = r;
      }
      next[held] = i;
      return next;
    });
    setHeld(null);
  };

  const done = Object.keys(joined).length === block.pairs.length;
  const right = block.pairs.every((_, i) => joined[i] === i);

  return (
    <div className="ls-match">
      <div className="ls-match-cols">
        <ul className="ls-col">
          {block.pairs.map((p, i) => (
            <li key={i}>
              <button type="button" className="ls-pair" data-side="left"
                      aria-pressed={held === i}
                      data-state={joined[i] === undefined ? undefined
                        : joined[i] === i ? "right" : "wrong"}
                      onClick={() => takeLeft(i)}>
                <T s={p.left} />
                {joined[i] !== undefined
                  ? <span className="ls-join mono">{bnNum(rights.indexOf(joined[i]) + 1)}</span>
                  : null}
              </button>
            </li>
          ))}
        </ul>
        <ul className="ls-col">
          {rights.map((which, at) => (
            <li key={which}>
              <button type="button" className="ls-pair" data-side="right"
                      disabled={held === null}
                      onClick={() => takeRight(which)}>
                <span className="ls-join mono">{bnNum(at + 1)}</span>
                <T s={block.pairs[which].right} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="ls-actions">
        <Again onClick={() => { setJoined({}); setHeld(null); }} />
      </p>
      {done ? (
        <p className="ls-verdict" data-tone={right ? "good" : "warn"}>
          <TBlock s={right
            ? { bn: "সবগুলো মিলেছে।", en: "Every one of them." }
            : { bn: "লালগুলো অন্য জোড়ার। ওগুলোতে চাপ দিয়ে আবার মেলান।", en: "The red ones belong elsewhere. Press one and pair it again." }} />
        </p>
      ) : (
        <p className="ls-foot mono">
          <TPair bn="বাঁ দিকের একটায় চাপ দিন, তারপর ডান দিকের একটায়।"
                 en="Press one on the left, then its answer on the right." />
        </p>
      )}
      <p className="ls-sr" aria-live="polite">
        {held === null ? "" : `${pick(block.pairs[held].left, lang)}: ${lang === "bn" ? "এখন ডান দিক থেকে বাছুন" : "now choose from the right"}`}
      </p>
    </div>
  );
}

/* ---------- bins ---------- */

export function Bins({ block, id }: { block: BinsBlock; id: string }) {
  const order = shuffled(block.items.map((_, i) => i), id);
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [held, setHeld] = useState<number | null>(null);

  const put = (bin: string): void => {
    if (held === null) return;
    setPlaced((was) => ({ ...was, [held]: bin }));
    setHeld(null);
  };

  const left = order.filter((i) => placed[i] === undefined);

  return (
    <div className="ls-bins">
      <ul className="ls-tokens">
        {left.map((i) => (
          <li key={i}>
            <button type="button" className="ls-token" aria-pressed={held === i}
                    onClick={() => setHeld(held === i ? null : i)}>
              <T s={block.items[i].text} />
            </button>
          </li>
        ))}
        {left.length === 0
          ? <li className="ls-tokens-done mono">
              <TPair bn="সবগুলো রাখা হয়েছে" en="All placed" />
            </li>
          : null}
      </ul>
      <div className="ls-bin-row">
        {block.bins.map((bin) => (
          <div key={bin.id} className="ls-bin" data-tone={bin.tone ?? "plain"}>
            <button type="button" className="ls-bin-head" onClick={() => put(bin.id)}
                    disabled={held === null}>
              <T s={bin.label} />
            </button>
            <ul>
              {order.filter((i) => placed[i] === bin.id).map((i) => {
                const item = block.items[i];
                const ok = item.bin === bin.id;
                return (
                  <li key={i} className="ls-token-in" data-state={ok ? "right" : "wrong"}>
                    <span className="ls-token-text"><T s={item.text} /></span>
                    {item.why ? <Why s={item.why} tone={ok ? "good" : "bad"} /> : null}
                    <button type="button" className="ls-move"
                            onClick={() => setPlaced((was) => {
                              const next = { ...was };
                              delete next[i];
                              return next;
                            })}>
                      <span aria-hidden="true">×</span>
                      <span className="ls-sr">
                        <TPair bn="ফিরিয়ে নিন" en="Take it back" />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <p className="ls-foot mono">
        <TPair bn="একটা তুলুন, তারপর যে ঘরে যাবে সেই ঘরে চাপ দিন।"
               en="Pick one up, then press the box it belongs in." />
      </p>
    </div>
  );
}

/* ---------- reveal ---------- */

export function Reveal({ block }: { block: RevealBlock }) {
  const [guess, setGuess] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const lang = useReadLang();

  return (
    <div className="ls-reveal">
      <p className="ls-ask"><TPair bn={block.ask.bn} en={block.ask.en} /></p>
      {block.choices ? (
        <ul className="ls-opts">
          {block.choices.map((c, i) => (
            <li key={i}>
              <button type="button" className="ls-opt" aria-pressed={guess === i}
                      data-state={guess === i ? "pick" : undefined}
                      onClick={() => { setGuess(i); setOpen(true); }}>
                <span className="ls-opt-mark" aria-hidden="true" />
                <span className="ls-opt-text"><T s={c} /></span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {open ? (
        <div className="ls-answer">
          <p className="ls-answer-head"><TBlock s={block.answer} /></p>
          <Why s={block.why} />
        </div>
      ) : (
        <p className="ls-actions">
          <Button kind="soft" size="sm" onClick={() => setOpen(true)}>
            {lang === "bn" ? "ভেবে ফেলেছি, দেখান" : "I have a guess, show me"}
          </Button>
        </p>
      )}
      {open ? null : (
        <p className="ls-foot mono">
          <TPair bn="আগে নিজে একটা উত্তর ভাবুন। ভেবে নিয়ে পড়লে যা মনে থাকে, না ভেবে পড়লে তা থাকে না।"
                 en="Commit to an answer first. What you read after guessing sticks; what you skim does not." />
        </p>
      )}
    </div>
  );
}

/* ---------- compare ---------- */

export function Compare({ block }: { block: CompareBlock }) {
  return (
    <div className="ls-compare table-scroll">
      <table>
        <thead>
          <tr>
            <th />
            {block.columns.map((c, i) => (
              <th key={i} scope="col"><T s={c} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i}>
              <th scope="row"><T s={row.label} /></th>
              {row.cells.map((cell, j) => (
                <td key={j} data-best={row.best === j ? "1" : undefined}>
                  <T s={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- spot ---------- */

export function Spot({ block }: { block: SpotBlock }) {
  const [found, setFound] = useState<Set<number>>(new Set());
  const [gaveUp, setGaveUp] = useState(false);
  const lang = useReadLang();

  const total = block.lines.filter((l) => l.flag).length;
  const got = block.lines.filter((l, i) => l.flag && found.has(i)).length;

  return (
    <div className="ls-spot">
      <p className="ls-spot-source mono"><TPair bn={block.source.bn} en={block.source.en} /></p>
      <ul className="ls-lines">
        {block.lines.map((line, i) => {
          const on = found.has(i) || gaveUp;
          const state = !on ? undefined : line.flag ? "wrong" : "right";
          return (
            <li key={i}>
              <button type="button" className="ls-line" data-state={state}
                      aria-pressed={found.has(i)}
                      onClick={() => setFound((was) => {
                        const next = new Set(was);
                        if (next.has(i)) next.delete(i); else next.add(i);
                        return next;
                      })}>
                <span className="ls-line-text"><T s={line.text} /></span>
              </button>
              {on && line.flag ? <Why s={line.flag} tone="bad" /> : null}
            </li>
          );
        })}
      </ul>
      <p className="ls-actions">
        <span className="ls-score mono" aria-live="polite">
          <span className="ls-bn" lang="bn">{`${bnNum(got)} / ${bnNum(total)}`}</span>
          <span className="ls-en" lang="en">{`${got} / ${total}`}</span>
        </span>
        <Button kind="quiet" size="sm" onClick={() => setGaveUp(true)}>
          {lang === "bn" ? "সবগুলো দেখান" : "Show them all"}
        </Button>
      </p>
    </div>
  );
}

/* ---------- drill ---------- */

export function Drill(
  { block, id, lesson, school }:
  { block: DrillBlock; id: string; lesson: string; school: string }
) {
  const [done, setDone] = useState<Set<string>>(new Set());

  /* Empty on the server and on the first client render, because
     what a reader has ticked is not a fact the server has. The
     real set arrives in an effect, which is the same contract
     `<LessonTick>` keeps. */
  useEffect(() => {
    const load = (): void => setDone(checkSet(school));
    load();
    return subscribe(load);
  }, [school]);

  const stepId = (n: number): string => `${lesson}#${id}#${n}`;
  const count = block.steps.filter((_, n) => done.has(stepId(n))).length;

  return (
    <div className="ls-drill">
      <ol className="ls-steps">
        {block.steps.map((step, n) => {
          const on = done.has(stepId(n));
          return (
            <li key={n}>
              <button type="button" className="ls-step" aria-pressed={on}
                      data-done={on ? "1" : undefined}
                      onClick={() => { toggleCheck(school, stepId(n)); }}>
                <span className="ls-step-mark" aria-hidden="true" />
                <span className="ls-step-text">
                  <T s={step.text} />
                  {step.hint ? <span className="ls-step-hint"><T s={step.hint} /></span> : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="ls-foot mono" aria-live="polite">
        <span className="ls-bn" lang="bn">
          {`${bnNum(block.steps.length)}টার মধ্যে ${bnNum(count)}টা হয়েছে`}
        </span>
        <span className="ls-en" lang="en">
          {`${count} of ${block.steps.length} done`}
        </span>
      </p>
    </div>
  );
}
