import { siteLayout } from "../../../../components/page";

/* This file is the shell, and without it the three routine
   routes rendered as bare HTML: no stylesheet, no rail, no bar,
   no footer. `globals.css` is imported by `shell.tsx`, so a
   route that mounts no shell links no stylesheet at all, and
   Next answers a missing layout by generating an empty one
   rather than by failing. The page looked finished in every
   check because every check reads markup.

   `print/` and `settings/` inherit this, which is right: the
   print sheet needs the stylesheet most of all, and the rules
   that take the chrome away on paper are in it. */
export default siteLayout({
  current: "routine",
  skip: "Skip to today",
});
