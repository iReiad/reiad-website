"use client";

/* ============================================================
   lesson/hear-prose.tsx: touch any English line to hear it.

   A lesson's prose is HTML out of a row, so nothing React
   renders can put a button beside each `<span lang="en">` in it,
   and a button beside each would be clutter anyway. This is one
   control in the `.piece-tools` row: pressed, the article gets
   `data-hear="on"`, the stylesheet underlines every English span
   so a reader can see what will answer, and a tap on one speaks
   it. Off by default, because a page that speaks when touched
   surprises the reader who was only scrolling.

   The listener is on the article and reads the click's target,
   so nothing is written into the prose and nothing hydrates
   against it. Lines inside a block are left alone: every block
   that carries English carries its own speaker.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { speak, useSpeechAble } from "./hear";

export function HearProse({ lang = "en" }: { lang?: string }) {
  const able = useSpeechAble();
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const article = ref.current?.closest("article");
    if (!article) return;
    if (!on) { article.removeAttribute("data-hear"); return; }
    article.setAttribute("data-hear", "on");

    const click = (e: Event): void => {
      const target = e.target as Element | null;
      const line = target?.closest?.(`[lang="${lang}"]`);
      if (!line || !article.contains(line) || line.closest(".ls-block")) return;
      e.preventDefault();
      speak(line.textContent?.trim() ?? "", lang);
    };
    article.addEventListener("click", click);
    return () => {
      article.removeEventListener("click", click);
      article.removeAttribute("data-hear");
    };
  }, [on, lang]);

  if (!able) return null;

  return (
    <span ref={ref}>
      <Button kind="ghost" size="sm" pressed={on} onClick={() => setOn(!on)}>
        {on ? "🔊 ছুঁয়ে শুনুন: চালু" : "🔊 ছুঁয়ে শুনুন"}
      </Button>
    </span>
  );
}
