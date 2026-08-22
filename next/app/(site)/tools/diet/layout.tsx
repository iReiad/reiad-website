import { siteLayout } from "../../../../components/page";

/* The shell for every diet route. Without it they render as bare
   HTML: `globals.css` is imported by `shell.tsx`, so a route that
   mounts no shell links no stylesheet at all, and Next answers a
   missing layout by generating an empty one rather than failing.
   The page looks finished in every check that reads markup. */
export default siteLayout({
  current: "diet",
  skip: "Skip to the numbers",
});
