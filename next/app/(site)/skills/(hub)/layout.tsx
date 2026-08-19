/* `/skills/skills.js` is gone from here and from the repository.
   It drew the cards from the `SKILLS` list in `content.js` and
   drew a resume card above them, in the browser, after the page
   had painted: a reader with no JavaScript got the hand-written
   fallback list underneath, and a crawler got the same. The cards
   are rendered by the route now, out of `lib/nav.ts`, and the
   resume card is on the front door where a reader passes it
   whichever school they are in. */

import { siteLayout } from "../../../../components/page";

export default siteLayout({
  current: "skills",
  lang: "bn",
  skip: "মূল লেখায় যান",
  footer: "এখানকার সব লেখা সাধারণ শিক্ষার জন্য। "
    + "আপনার অগ্রগতি জমা থাকে আপনার অ্যাকাউন্টে।",
});
