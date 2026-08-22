"use client";

/* ============================================================
   routine/log.tsx: one thing you did today, and the button for it.

   The today card on the dashboard is the fastest place to log a
   task: the day page is the long form, this is the row of things
   you actually tick. It was three bare children inside a chip:

       <span>{m >= 1 ? "✓" : "○"}</span>
       <span lang="bn">{t.bn}</span>
       <em className="mono">{ever}</em>

   and `.chip` is not a flex container, so all three ran together:

       ০ইংরেজি + জার্মান১

   Three separate problems in one string, which is why this is a
   component rather than a `gap` added to the chip.

   ---- 1. the mark was a letter ----

   `○` at chip size, beside Bangla, is `০`. The state of the
   button was being carried by a character that reads as a digit
   in the language the button is labelled in. It is a drawn ring
   that fills now, which is the same idea as the tick on the day
   page and cannot be read as a number in any language.

   ---- 2. the tally said nothing about itself ----

   That trailing numeral is how many days this task has EVER been
   marked, and jammed against the words it reads as part of them.
   Behind a hairline and in the mono face it reads as a count, and
   it is only drawn when there is something to count: a zero
   beside a task you have never done is a reproach, and this page
   deliberately has no flames and nothing counting down.

   ---- 3. and the words are Bangla ----

   `.chip` sets `uppercase` and `0.05em` of tracking, which are
   right for a mono label and wrong for a Bangla phrase: Bangla
   has no case, so the transform does nothing, and the tracking
   pulls apart conjuncts that should sit together. `.crumbs`
   already turns both off for Bangla and this does the same.

   ---- what the screen reader gets ----

   The visible parts are `aria-hidden` and the button carries one
   sentence: the task, whether it is done, and how many days it
   has been. A ring, a phrase and a numeral read out as three
   fragments is not a label.
   ============================================================ */

import { ChipButton } from "../ui/chip";

export function LogChip({ name, done, times, numeral, onPress }: {
  /** The task, in the reader's language. */
  name: string;
  done: boolean;
  /** How many days this has ever been marked. */
  times: number;
  /** The same number, in the digits the page is set in. Passed
      rather than computed here, because which digits a page uses
      is the page's business and `bn()` is already where that is
      decided. */
  numeral: string;
  onPress: () => void;
}) {
  return (
    <ChipButton
      pressed={done}
      className="rt-log"
      onClick={onPress}
      aria-label={[
        name,
        done ? "done today" : "not done today",
        times > 0 ? `${times} days so far` : null,
      ].filter(Boolean).join(", ")}
    >
      <span className="rt-log-mark" aria-hidden="true" />
      <span className="rt-log-name" lang="bn">{name}</span>
      {times > 0
        ? <span className="rt-log-times mono" aria-hidden="true">{numeral}</span>
        : null}
    </ChipButton>
  );
}
