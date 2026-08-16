/* The home page's own root layout. A route group can carry one,
   which is what lets `/` have a shell of its own beside the one
   every other page in `(site)` builds for itself.

   ---- the half of the boot script only this page has ----

   Every other page's inline boot restores two preferences, the
   theme and the audience, and `shell.tsx` holds it. This page's
   restored four: it also picks WHICH of the four introductions is
   the reader's, and the port dropped that. The result was the
   thing the original's comment says it exists to prevent, live:
   all four introductions and all three sets of buttons on screen
   at once, run together, for every reader.

   Two pieces, and neither is in `styles.css` on purpose, which is
   the original's argument and is kept: `sw.js` serves HTML
   network-first and everything else cache-first, so the first
   load after any deploy pairs new markup with the previous
   stylesheet, and a page whose introduction is only legible when
   the two are in step is a page that is illegible once per
   deploy. A rule that ships inside the document cannot be out of
   step with it.

   What did change is HOW the rule ships. The original built the
   `<style>` in the boot script and appended it to the head; this
   renders it, because a node a script adds before React hydrates
   is a node React removes. `components/scripts.tsx` is the whole
   story. */

import { siteLayout } from "../../components/page";
import { SiteScripts } from "../../components/scripts";

/* Which introduction is this reader's, decided before the first
   paint from what they chose last time. `open` is somebody who
   has just arrived, and it is what the markup already reads. */
const PICK = `(function(){var d=document.documentElement;var pick="open";try{`
  + `var a=localStorage.getItem("audience");`
  + `var k=localStorage.getItem("track");`
  + `if(a==="learn"&&(k==="finance"||k==="skills"))d.setAttribute("data-track",k);`
  + `if(a==="work")pick="work";`
  + `else if(a==="learn")pick=k==="skills"?"skills":"finance"}catch(e){}`
  + `d.setAttribute("data-hl",pick)})()`;

/* One of the four shows. The rule hangs off `[data-hl]`, which the
   script above sets and nothing else does, so a reader with no
   JavaScript matches none of it and the <noscript> rule below is
   what they get instead: the version written for somebody who has
   just arrived. */
const WHEN = `[data-hl] [data-when]{display:none}`
  + `[data-hl="open"] [data-when="open"],`
  + `[data-hl="finance"] [data-when="finance"],`
  + `[data-hl="skills"] [data-when="skills"],`
  + `[data-hl="work"] [data-when="work"]{display:revert}`
  + `[data-hl="open"] .hero-actions[data-when="open"],`
  + `[data-hl="finance"] .hero-actions[data-when="finance"],`
  + `[data-hl="skills"] .hero-actions[data-when="skills"],`
  + `[data-hl="work"] .hero-actions[data-when="work"]{display:flex}`
  /* And until somebody has answered the door, the door is the
     whole page. Everything under the hero is written for one of
     the three answers, so showing all of it to somebody who has
     not given one is showing them two thirds of a page meant for
     somebody else, above the question that would have sorted it
     out. It all comes back the moment they choose. */
  + `[data-hl="open"] .home-flow > .hero ~ *{display:none}`;

export default siteLayout({
  beforeMain: (
    <>
      <script dangerouslySetInnerHTML={{ __html: PICK }} />
      <style dangerouslySetInnerHTML={{ __html: WHEN }} />
      <noscript>
        <style>{`[data-when]:not([data-when="open"]){display:none}`}</style>
      </noscript>
    </>
  ),
  scripts: <SiteScripts srcs={["/home.js"]} />,
});
