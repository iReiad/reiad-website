"use client";

/* One thing you did today, and the button for it. `.chip` is not a flex
   container, so three bare children inside one run together.

   THE MARK IS A DRAWING, NOT A LETTER. `○` at chip size beside Bangla is
   `০`: the state of the button was carried by a character that reads as a
   digit in the language the button is labelled in. It is a drawn ring
   that fills.

   THE TALLY SAYS WHAT IT IS. That trailing numeral is how many days the
   task has EVER been marked, so it sits behind a hairline in the mono
   face, and it is only drawn when there is something to count: a zero
   beside a task you have never done is a reproach, and this page has no
   flames and nothing counting down.

   AND THE WORDS ARE BANGLA. `.chip` sets `uppercase` and `0.05em` of
   tracking, which are right for a mono label and wrong for a Bangla
   phrase: Bangla has no case, so the transform does nothing, and the
   tracking pulls apart conjuncts that should sit together.

   The visible parts are `aria-hidden` and the button carries one
   sentence: a ring, a phrase and a numeral read out as three fragments is
   not a label. */

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
