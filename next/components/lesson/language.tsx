"use client";

/* ============================================================
   lesson/language.tsx: the four blocks a language lesson does.

   Pattern, lines, gap, build. The money school's blocks ask a
   reader to choose; these ask them to hear, say and fit, which is
   what a grammar point needs: a rule read silently is a rule
   forgotten by the next paragraph.

   The three rules `interactive.tsx` states hold here too. Nothing
   is scored out of ten, nothing shuffles randomly (the build game
   seeds off the mount id through `shuffled()`), and nothing is
   stored: a gap worth filling tonight is worth filling again next
   week.

   Every English line carries a `<Hear>`, and it is the only
   button on the line. A line that could be heard, copied, slowed
   and translated is a toolbar; a learner wants the sound.
   ============================================================ */

import { useState } from "react";
import type { BuildBlock, GapItem, LinesBlock, PatternBlock } from "@reiad/shared/lesson";
import { bnNum } from "@reiad/shared/lesson";
import { Button } from "../ui/button";
import { SentenceGame, type GameWords } from "../sentence-game";
import { playable } from "../../lib/sentence-game";
import { T, TBlock, TPair, pick } from "./lang";
import { useReadLang } from "./lang-switch";
import { Hear, useSpeechAble, utter } from "./hear";

/* ---------- pattern ---------- */

export function Pattern({ block, lang }: { block: PatternBlock; lang: string }) {
  return (
    <div className="ls-pattern">
      <p className="ls-pattern-shape" lang={lang}>{block.shape}</p>
      <p className="ls-pattern-why"><T s={block.why} /></p>
      <ul className="ls-pattern-eg">
        {block.examples.map((line, i) => (
          <li key={i}>
            <Hear text={line.target} lang={lang} />
            <span className="ls-target" lang={lang}>{line.target}</span>
            <span className="ls-meaning" lang="bn">{line.bn}</span>
          </li>
        ))}
      </ul>
      {block.tip ? <p className="ls-pattern-tip"><T s={block.tip} /></p> : null}
    </div>
  );
}

/* ---------- lines ---------- */

export function Lines({ block, lang }: { block: LinesBlock; lang: string }) {
  const able = useSpeechAble();
  const [playing, setPlaying] = useState(false);
  const readLang = useReadLang();

  /* Every line queued at once, in order: the synthesiser plays
     a queue back to back, and a pause between lines is what a
     learner shadowing them needs, so each is its own utterance
     rather than one long string. */
  const all = (): void => {
    const synth = window.speechSynthesis;
    if (playing) { synth.cancel(); setPlaying(false); return; }
    synth.cancel();
    block.lines.forEach((line, i) => {
      const u = utter(line.target, lang);
      if (i === block.lines.length - 1) {
        u.onend = () => setPlaying(false);
        u.onerror = () => setPlaying(false);
      }
      synth.speak(u);
    });
    setPlaying(true);
  };

  return (
    <div className="ls-lines-block">
      <ul className="ls-lines">
        {block.lines.map((line, i) => (
          <li key={i} className="ls-line-row">
            <Hear text={line.target} lang={lang} />
            <span className="ls-target" lang={lang}>{line.target}</span>
            <span className="ls-meaning" lang="bn">{line.bn}</span>
          </li>
        ))}
      </ul>
      {able ? (
        <p className="ls-actions">
          <Button kind="soft" size="sm" pressed={playing} onClick={all}>
            {playing
              ? (readLang === "bn" ? "থামান" : "Stop")
              : (readLang === "bn" ? "একটানা শুনুন" : "Play them all")}
          </Button>
          <span className="ls-foot mono">
            <TPair bn="শোনো, থামাও, নিজে বলো। তিনবার।" en="Listen, pause, say it back. Three times." />
          </span>
        </p>
      ) : null}
    </div>
  );
}

/* ---------- gap ---------- */

/** The sentence with its hole filled, for the speaker and for
    the eye once a word is in. */
const filled = (item: GapItem, word: string): string => item.text.replace("___", word);

export function Gap({ items, lang }: { items: GapItem[]; id: string; lang: string }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const readLang = useReadLang();

  const right = items.filter((it, i) => picked[i] === it.right).length;
  const answered = Object.keys(picked).length;

  return (
    <div className="ls-gap">
      {items.map((item, i) => {
        const choice = picked[i];
        const done = choice !== undefined;
        const ok = done && choice === item.right;
        const [before, after] = item.text.split("___");
        return (
          <div key={i} className="ls-gap-item">
            <p className="ls-gap-sentence" lang={lang}>
              <span className="ls-gap-n mono" lang="bn">{bnNum(i + 1)}</span>
              <span>{before}</span>
              <span className="ls-gap-slot" data-state={done ? (ok ? "right" : "wrong") : undefined}>
                {done ? item.options[choice] : " "}
              </span>
              <span>{after}</span>
              {done ? <Hear text={filled(item, item.options[item.right])} lang={lang} /> : null}
            </p>
            {item.bn ? <p className="ls-gap-bn" lang="bn">{item.bn}</p> : null}
            <ul className="ls-gap-opts" lang={lang}>
              {item.options.map((word, o) => {
                const state = !done ? undefined
                  : o === choice ? (ok ? "right" : "wrong")
                  : o === item.right && !ok ? "right" : undefined;
                return (
                  <li key={o}>
                    <button type="button" className="ls-gap-opt" data-state={state}
                            aria-pressed={choice === o} disabled={done}
                            onClick={() => setPicked((was) => ({ ...was, [i]: o }))}>
                      {word}
                    </button>
                  </li>
                );
              })}
            </ul>
            {done ? (
              <div className="ls-why" data-tone={ok ? "good" : "bad"}>
                <TBlock s={item.why} />
              </div>
            ) : null}
            {done ? (
              <p className="ls-again">
                <Button kind="quiet" size="sm"
                        onClick={() => setPicked((was) => {
                          const next = { ...was };
                          delete next[i];
                          return next;
                        })}>
                  {pick({ bn: "আবার", en: "Again" }, readLang)}
                </Button>
              </p>
            ) : null}
          </div>
        );
      })}
      <p className="ls-foot mono" aria-live="polite">
        {answered === 0 ? (
          <TPair bn="প্রতিটা বাক্যে একটা ফাঁকা ঘর। যে শব্দটা বসবে সেটা ছোঁও।"
                 en="Each sentence has one hole. Tap the word that fits." />
        ) : (
          <>
            <span className="ls-bn" lang="bn">{`${bnNum(items.length)}টার মধ্যে ${bnNum(right)}টা ঠিক`}</span>
            <span className="ls-en" lang="en">{`${right} of ${items.length} right`}</span>
          </>
        )}
      </p>
    </div>
  );
}

/* ---------- build ---------- */

/* The game's own words, per language the site teaches through
   it. `workbook.tsx` keeps the practice books' copy, and this is
   not an import of it: that file reaches the books themselves
   through `lib/workbook.ts`, six thousand lines that must not
   ride into a client bundle for a title. */
const GAME_WORDS: Record<string, GameWords> = {
  en: {
    title: "Word order", sub: "বাক্য সাজাও", prompt: "বাংলায়:", pattern: "ছাঁচ",
    check: "মিলিয়ে দেখো", next: "পরেরটা →", again: "আবার", right: "ঠিক! ✓",
    wrong: "ক্রমটা এখনো ঠিক নয়।", done: "সবগুলো ঠিক ✓ এই ছাঁচ তোমার।", replay: "আবার খেলো",
  },
  de: {
    title: "Satzbau", sub: "বাক্য সাজাও", prompt: "বাংলায়:", pattern: "ছাঁচ",
    check: "মিলিয়ে দেখো", next: "পরেরটা →", again: "আবার", right: "ঠিক! ✓",
    wrong: "ক্রমটা এখনো ঠিক নয়।", done: "সবগুলো ঠিক ✓ এই ছাঁচ তোমার।", replay: "আবার খেলো",
  },
};

export function Build({ block, id, lang }: { block: BuildBlock; id: string; lang: string }) {
  const lines = playable(block.lines);
  if (lines.length < 2) return null;
  return (
    <div className="ls-build">
      <SentenceGame id={id} lines={lines} pattern={block.pattern} lang={lang}
                    words={GAME_WORDS[lang] ?? GAME_WORDS.en} />
    </div>
  );
}
