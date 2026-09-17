"use client";

/* ============================================================
   lesson/hear.tsx: one line, spoken.

   A small round button beside a line in the language being
   learnt. It is the one thing a reader of a language lesson
   asks for that a page cannot do in print, and it is kept small
   on purpose: a speaker beside every line is a row of speakers,
   not a lesson.

   ---- it is hidden until it can work ----

   The server renders it `hidden`, and the first client render
   agrees, because whether this browser can speak is not a fact
   the server has. An effect lifts the attribute where
   `speechSynthesis` exists, which is the same contract
   `read-aloud.tsx` keeps with its whole toolbar. A reader with
   scripts off is left with the line, which is right: nothing can
   speak it for them.

   ---- one voice, picked the way the toolbar picks it ----

   `pickVoice()` is the toolbar's, imported rather than copied:
   two lists of preferences drift, and a lesson read in one accent
   and its pieces in another is the kind of thing nobody reports.
   ============================================================ */

import { useEffect, useState } from "react";
import { pickVoice } from "../read-aloud";

/** The tag a school's short language code speaks in. The
    English school teaches British spelling and the German school
    German German, so the region is not decoration. */
const TAGS: Record<string, string> = {
  en: "en-GB", de: "de-DE", bn: "bn-BD", ar: "ar-SA",
};

export const speechTag = (lang: string): string => TAGS[lang] ?? lang;

/** Whether this browser can speak at all. False on the server
    and on the first client render, true one effect later where it
    can: the contract every component here keeps so React adopts
    the server's markup rather than throwing it away. */
export function useSpeechAble(): boolean {
  const [able, setAble] = useState(false);
  useEffect(() => { setAble("speechSynthesis" in window); }, []);
  return able;
}

/** One utterance, in the school's language, at a pace a learner
    can shadow. Not spoken yet: the caller queues it, because a
    list of lines is spoken by queueing every one. */
export function utter(text: string, lang: string): SpeechSynthesisUtterance {
  const tag = speechTag(lang);
  const u = new SpeechSynthesisUtterance(text);
  u.lang = tag;
  const voice = pickVoice(window.speechSynthesis.getVoices() ?? [], tag);
  if (voice) u.voice = voice;
  u.rate = 0.92;
  return u;
}

/** Say one thing now, dropping whatever was being said. */
export function speak(text: string, lang: string): void {
  if (!("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  synth.speak(utter(text, lang));
}

export function Hear({ text, lang = "en", label = "শুনুন" }: {
  text: string;
  /** The short code: `en`, `de`. */
  lang?: string;
  label?: string;
}) {
  const able = useSpeechAble();
  const [on, setOn] = useState(false);

  const press = (): void => {
    const synth = window.speechSynthesis;
    if (on) { synth.cancel(); setOn(false); return; }
    synth.cancel();
    const u = utter(text, lang);
    /* Both, because Chrome answers a `cancel()` with `error` and
       Safari with `end`, and a button left lit after either is a
       button that says it is speaking into silence. */
    u.onend = () => setOn(false);
    u.onerror = () => setOn(false);
    setOn(true);
    synth.speak(u);
  };

  return (
    <button type="button" className="ls-hear" hidden={!able}
            aria-pressed={on} aria-label={label} title={label} lang="bn"
            onClick={press}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
           strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
      </svg>
    </button>
  );
}
