/* The home page's own root layout. A route group can carry one,
   which is what lets `/` have a shell of its own beside the one
   every other page in `(site)` builds for itself.

   Two things are this page's alone.

   **It does not scroll.** `fixed` puts the shell into its
   one-screen mode and leaves the footer off: see the note at the
   top of `page.tsx`.

   **It picks which introduction to show, before the first
   paint.** Three, and only one of them is the reader's. The rule
   ships inside the document rather than in `styles.css`, which is
   the original's argument and is kept: `sw.js` serves HTML
   network-first and everything else cache-first, so the first
   load after any deploy pairs new markup with the previous
   stylesheet, and a page whose introduction is only legible when
   the two are in step is a page that is illegible once per
   deploy. A rule that ships inside the document cannot be out of
   step with it.

   It is rendered rather than appended, because a node a script
   adds before React hydrates is a node React removes.
   `components/scripts.tsx` is the whole story.

   ---- what went, and it is most of this file ----

   The `track` half. A learner used to be "finance" or "skills",
   because the learning side had two front doors: money at
   `/money/` and everything else at `/skills/`. The money school
   is an entry in the skills list now, so there is one door and
   the refinement has nothing left to refine. Anything a browser
   still has stored under `track` is ignored here and cleared the
   next time the audience switch is pressed. */

import { siteLayout } from "../../components/page";

/* Which introduction is this reader's, decided before the first
   paint from what they chose last time. `open` is somebody who
   has just arrived, and it is what a reader with no JavaScript
   gets. */
const PICK = `(function(){var d=document.documentElement;var pick="open";try{`
  + `var a=localStorage.getItem("audience");`
  + `if(a==="work")pick="work";else if(a==="learn")pick="learn"}catch(e){}`
  + `d.setAttribute("data-hl",pick)})()`;

/* One of the three shows. The rule hangs off `[data-hl]`, which
   the script above sets and nothing else does, so a reader with
   no JavaScript matches none of it and the <noscript> rule below
   is what they get instead. */
const WHEN = `[data-hl] [data-when]{display:none}`
  + `[data-hl="open"] [data-when="open"],`
  + `[data-hl="learn"] [data-when="learn"],`
  + `[data-hl="work"] [data-when="work"]{display:revert}`;

export default siteLayout({
  lang: "bn",
  current: "home",
  fixed: true,
  skip: "মূল অংশে যান",
  beforeMain: (
    <>
      <script dangerouslySetInnerHTML={{ __html: PICK }} />
      <style dangerouslySetInnerHTML={{ __html: WHEN }} />
      <noscript>
        <style>{`[data-when]:not([data-when="open"]){display:none}`}</style>
      </noscript>
    </>
  ),
});
