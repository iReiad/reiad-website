"use client";

/* ============================================================
   read-aloud.tsx: the speech control under a piece's byline.

   `archive/modules/read-aloud.js` was 150 lines that built this toolbar with
   `document.createElement`, inserted it after `.byline`, and
   appended a `<style>` to the head for the one class it needed.
   Both of those are the shape `components/scripts.tsx` is entirely
   about: a node a script adds to a document React is about to
   adopt is a node React removes. It survived only because it was
   loaded from an effect.

   ---- it renders nothing on the server, and that is the point ----

   Whether a browser can speak is not a fact the server has, and
   the module's first line was `if (!("speechSynthesis" in window))
   return`. So the toolbar appears after mount or not at all, which
   is the same rule `lib/progress.ts` follows for what a reader has
   read: the page is the server's and the browser's own capability
   is the browser's.

   ---- what it reads, and what it must not write ----

   The paragraphs come out of the DOM rather than from a prop,
   because an article's body is HTML in a database set with
   `dangerouslySetInnerHTML`: there is nothing to pass. READING the
   DOM after mount is fine and is not what the rule above forbids.
   The one thing written into it is `.read-aloud-highlight` on the
   paragraph being spoken, and it is taken off again; React does
   not reconcile the inside of a `dangerouslySetInnerHTML` node, so
   nothing it does can survive a re-render of one that does.

   ---- Stop stops, which is new ----

   The module's Stop cancelled the current sentence and its loop
   then spoke the next one, because the only thing that would have
   broken the loop was `window.canceledByUser`, which nothing on
   this site has ever set. `run` below is the token that fixes it:
   every press claims a number, and a loop whose number is no
   longer the current one stops where it is.
   ============================================================ */

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { Button } from "./ui/button";

const IDLE = "🔈 Read aloud";
const STOP = "⏹ Stop";
const HIGHLIGHT = "read-aloud-highlight";

/** Anything in the Bangla block. One character is enough: a piece
    is written in one language here, and the alternative is a
    ratio nobody could explain. */
const BANGLA = /[ঀ-৾]/;

/** What is read out, and what is furniture. The skipped blocks
    are the ones a reader has not come for: the note under every
    piece, the prev/next pair, the byline the button sits beside,
    the reactions and questions at the foot, and this toolbar,
    which is inside the article and is the one thing here that
    could read itself out. */
const SPEAKS = "h1,h2,h3,h4,p,li";
const SILENT = ".prev-next, .note, .byline, .react-row, .qa-list, .read-aloud-toolbar";

interface Segment {
  node: HTMLElement;
  text: string;
}

function readable(article: Element): Segment[] {
  const out: Segment[] = [];
  for (const node of article.querySelectorAll<HTMLElement>(SPEAKS)) {
    if (node.closest(SILENT)) continue;
    const text = node.innerText.trim();
    /* A one-character paragraph is a bullet, a dash or a stray
       letter, and a synthesiser reads it as a noise. */
    if (text.length < 2) continue;
    out.push({ node, text });
  }
  return out;
}

/** The closest voice to the language the piece is in: the exact
    tag, then the language whatever the region, then an English one
    for a language this machine has no voice for at all, because a
    Bangla sentence read by an English voice is still words. */
function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  const short = lang.split("-")[0];
  return voices.find((v) => v.lang === lang)
    ?? voices.find((v) => v.lang?.startsWith(short))
    ?? (short === "en" ? undefined : voices.find((v) => v.lang?.startsWith("en")))
    ?? null;
}

export function ReadAloud(): ReactElement | null {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [able, setAble] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  /* Which read is the current one. Every press claims the next
     number, so a loop can tell that it has been superseded. */
  const run = useRef(0);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setAble(true);
    const load = () => setVoices(window.speechSynthesis.getVoices() ?? []);
    load();
    /* A listener rather than `onvoiceschanged =`, which is one
       slot and would take whatever else had claimed it. Chrome
       fills the list asynchronously, so the first `getVoices()` is
       usually empty and this is what makes a voice appear at all. */
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const clear = useCallback(() => {
    const article = rootRef.current?.closest("article");
    article?.querySelectorAll(`.${HIGHLIGHT}`)
      .forEach((el) => el.classList.remove(HIGHLIGHT));
  }, []);

  const stop = useCallback(() => {
    run.current += 1;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    clear();
    setSpeaking(false);
  }, [clear]);

  /* Leaving the page, and hiding it. A tab left speaking in the
     background is the one thing about this feature somebody would
     have to go and find the tab to stop. */
  useEffect(() => {
    if (!able) return;
    const hidden = () => { if (document.hidden) stop(); };
    window.addEventListener("pagehide", stop);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.removeEventListener("pagehide", stop);
      document.removeEventListener("visibilitychange", hidden);
      stop();
    };
  }, [able, stop]);

  const press = async (): Promise<void> => {
    if (speaking) { stop(); return; }

    const article = rootRef.current?.closest("article");
    if (!article) return;

    const synth = window.speechSynthesis;
    const mine = run.current + 1;
    run.current = mine;

    const lang = BANGLA.test((article as HTMLElement).innerText) ? "bn-BD" : "en-GB";
    const voice = pickVoice(voices, lang);
    const say = (text: string): SpeechSynthesisUtterance => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      if (voice) u.voice = voice;
      u.rate = rate;
      return u;
    };

    setSpeaking(true);
    const segments = readable(article);

    /* A page with no paragraphs at all still gets read, in one
       go. Nothing is highlighted, because there is nothing this
       can point at. */
    if (!segments.length) {
      const whole = say((article as HTMLElement).innerText || "");
      whole.onend = () => { if (run.current === mine) setSpeaking(false); };
      synth.speak(whole);
      return;
    }

    for (const segment of segments) {
      if (run.current !== mine) return;
      await new Promise<void>((done) => {
        const u = say(segment.text);
        u.onstart = () => {
          clear();
          segment.node.classList.add(HIGHLIGHT);
          segment.node.scrollIntoView({ behavior: "smooth", block: "center" });
        };
        u.onend = () => { segment.node.classList.remove(HIGHLIGHT); done(); };
        u.onerror = () => { segment.node.classList.remove(HIGHLIGHT); done(); };
        synth.speak(u);
      });
    }

    if (run.current !== mine) return;
    setSpeaking(false);
    clear();
  };

  if (!able) return null;

  return (
    <div ref={rootRef}
         className="read-aloud-toolbar my-3 flex flex-wrap items-center gap-2 select-none">
      <Button kind="ghost" size="sm" onClick={press}>{speaking ? STOP : IDLE}</Button>
      <label className="flex items-center gap-1.5 text-t1 text-ink-soft">
        Speed
        <input type="range" min="0.7" max="1.4" step="0.1" title="Speech rate"
               value={rate} onChange={(e) => setRate(Number(e.currentTarget.value))} />
      </label>
    </div>
  );
}
