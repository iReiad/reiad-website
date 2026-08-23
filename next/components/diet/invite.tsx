/* ============================================================
   diet/invite.tsx: what a page says to somebody who is not
   signed in.

   Eleven panels each wrote their own, and every one of them was
   a single sentence in a paragraph: "a journal belongs to an
   account". True, and a dead end. There was no way to sign in
   from the page that had just said an account was needed, and no
   way to find out what the page would be worth once there was
   one.

   THE SENTENCE IS THE PAGE'S AND THE REST IS THIS COMPONENT'S.
   A journal and a doctor's sheet need an account for different
   reasons and should say so differently; the button and the list
   of what the page draws are the same job every time, and eleven
   copies of them is eleven places for one of them to be missed.

   `shows` is the part that matters. A reader deciding whether to
   make an account is deciding whether this page is worth one,
   and a page that will not say what it draws is asking them to
   guess. It is a list of what appears, not a list of features.
   ============================================================ */

import { ButtonLink } from "../ui/button";
import { T } from "./lang";

export function Invite({ en, bn, shows }: {
  /** Why this page needs an account, in the page's own words. */
  en: string;
  bn: string;
  /** What it draws once there is one. Omitted where the page
      really is one sentence, which is rarer than eleven. */
  shows?: ReadonlyArray<{ en: string; bn: string }>;
}) {
  return (
    <div className="dt-invite">
      <p><T en={en} bn={bn} /></p>

      {shows?.length ? (
        <div className="dt-invite-shows">
          <p className="dt-invite-h">
            <T en="What is on this page once you do" bn="সাইন ইন করলে এই পাতায় যা থাকবে" />
          </p>
          <ul>
            {shows.map((line) => (
              <li key={line.en}><T en={line.en} bn={line.bn} /></li>
            ))}
          </ul>
        </div>
      ) : null}

      <ButtonLink href="/account" size="sm">
        <T en="Sign in" bn="সাইন ইন" />
      </ButtonLink>
    </div>
  );
}
