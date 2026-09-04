/* The home page's own root layout. Two things are this page's alone.

   IT SCROLLS, on purpose: the front page is a deck built to grow
   downwards as the site does, so it is an ordinary scrolling page with
   the footer back on.

   IT PICKS WHICH INTRODUCTION TO SHOW, BEFORE THE FIRST PAINT. The rule
   ships inside the document rather than in the stylesheet because `sw.js`
   serves HTML network-first and everything else cache-first, so the first
   load after any deploy pairs new markup with the previous stylesheet: a
   page whose introduction is only legible when the two are in step is
   illegible once per deploy. It is rendered rather than appended, because
   a node a script adds before React hydrates is a node React removes.

   Anything a browser still has stored under `track` is ignored here and
   cleared the next time the audience switch is pressed. */

import { siteLayout } from "../../components/page";

/* Which introduction is this reader's, decided before the first
   paint from what they chose last time. `open` is somebody who
   has just arrived, and it is what a reader with no JavaScript
   gets. */
const PICK = `(function(){var d=document.documentElement;var pick="open";try{`
  + `var a=localStorage.getItem("audience");`
  + `if(a==="work")pick="work";else if(a==="learn")pick="learn"}catch(e){}`
  + `d.setAttribute("data-hl",pick)})()`;

    /* One of the three shows. The rule hangs off `[data-hl]`, which the
       script above sets and nothing else does, so a reader with no
       JavaScript matches none of it and gets the <noscript> rule.

       Written as "hide the two that do not match" rather than "hide all
       three, then show one", and the difference is not style: a rule in
       this inline sheet is unlayered, and unlayered author CSS beats every
       @layer in the stylesheet, so `display:revert` on the winner pins its
       display from here and the door's own compact rules silently lose.
       Saying nothing about the winner hands it back to the stylesheet. */
const WHEN = `[data-hl="open"] [data-when]:not([data-when="open"]),`
  + `[data-hl="learn"] [data-when]:not([data-when="learn"]),`
  + `[data-hl="work"] [data-when]:not([data-when="work"]){display:none}`;

export default siteLayout({
  lang: "bn",
  current: "home",
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
