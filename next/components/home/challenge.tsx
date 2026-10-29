"use client";

/* challenge.tsx: a short recall session drawn from the public money glossary, with no progress writes. */
import { useRef, useState } from "react";
import type { Term } from "@reiad/shared/content";
import { Button, ButtonLink } from "../ui/button";
import { SectionLabel } from "../ui/label";

const bn = (value: number) => value.toLocaleString("bn-BD");

export function LearningChallenge({ terms }: { terms: Term[] }) {
  const [cursor, setCursor] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [score, setScore] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const length = Math.min(5, terms.length);
  if (terms.length < 3) return null;

  const term = terms[cursor % terms.length];
  const options = [0, 1, 2].map((index) => terms[(cursor + index) % terms.length]);
  const shift = cursor % options.length;
  const ordered = [...options.slice(shift), ...options.slice(0, shift)];
  const finished = answered === length;

  function answer(slug: string) {
    if (choice !== null || finished) return;
    setChoice(slug);
    setAnswered(answered + 1);
    if (slug === term.slug) setScore(score + 1);
  }

  function next() {
    setCursor(cursor + 1);
    setChoice(null);
    heading.current?.focus();
  }

  return <section aria-labelledby="challenge-h" lang="bn">
    <div className="hub-section-head">
      <SectionLabel>একটু অনুশীলন · <span lang="en">Try a challenge</span></SectionLabel>
      <h2 className="band-h" id="challenge-h">টাকার কথাগুলো কতটা চেনেন?</h2>
      <p className="hub-section-note">ছোট্ট বর্ণনা পড়ে সঠিক শব্দটি বেছে নিন। ভুল হলেও শিখবেন, তারপর চাইলে পুরোটা পড়বেন।</p>
    </div>
    <div className="grid gap-5 rounded-card border border-hairline bg-paper-sunk p-6 sm:p-8">
      <div className="flex flex-wrap justify-between gap-3 text-ink-soft">
        <span>প্রশ্ন {bn(Math.min(answered + (choice === null ? 1 : 0), length))} / {bn(length)}</span>
        <span>সঠিক উত্তর: {bn(score)} / {bn(answered)}</span>
      </div>
      <h3 ref={heading} tabIndex={-1} className="text-t5 text-ink" id="challenge-question">এই বর্ণনাটি কোন শব্দের?</h3>
      <p className="text-t4 leading-relaxed">{term.blurb}</p>
      <div className="flex flex-wrap gap-3" role="group" aria-labelledby="challenge-question">
        {ordered.map((option) => <Button key={option.slug}
          kind={choice !== null && option.slug === term.slug ? "solid" : "ghost"}
          pressed={choice === option.slug} disabled={choice !== null}
          onClick={() => answer(option.slug)}>{option.bn}</Button>)}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true">
        {choice !== null && <div className="grid gap-3">
          <p><strong>{choice === term.slug ? "ঠিক ধরেছেন!" : "চেষ্টা করেছেন, এবার জেনে নিন।"}</strong>{" "}
            সঠিক উত্তর: {term.bn} <span lang="en">({term.en})</span>।</p>
          <a href={`/money/terms/${term.slug}.html`}>এই শব্দটি বিস্তারিত পড়ুন →</a>
          {finished && <p>এই পর্ব শেষ! {bn(length)}টির মধ্যে {bn(score)}টি সঠিক হয়েছে। আবার অনুশীলন করতে পারেন, অথবা পাঠে এগিয়ে যান।</p>}
        </div>}
      </div>
      <div className="flex flex-wrap gap-3">
        {choice !== null && !finished && <Button kind="solid" onClick={next}>পরের প্রশ্ন →</Button>}
        {finished && <Button kind="solid" onClick={() => {
          setAnswered(0);
          setScore(0);
          next();
        }}>আরেক পর্ব খেলি</Button>}
        <ButtonLink href="/money" kind="ghost">টাকা শেখার কোর্স দেখুন</ButtonLink>
      </div>
      <p className="text-t2 text-ink-soft">নিজেকে যাচাই করার খেলা। এই পাতা ছেড়ে গেলে ফল আর থাকবে না।</p>
      <noscript>অনুশীলনের বোতাম চালাতে জাভাস্ক্রিপ্ট লাগবে। উপরের কোর্সের লিংক দিয়ে সরাসরি পড়তে পারেন।</noscript>
    </div>
  </section>;
}
