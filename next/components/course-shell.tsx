/* ============================================================
   course-shell.tsx: the empty page four course routes serve.

   ---- why there is nothing in it ----

   This is the one section of the site whose content the server
   must not render. `/skills/courses/` is one person's own copy of
   a third-party course sitting in a private Drive folder, gated
   behind `isAdmin()`, and a page that put the catalogue into its
   HTML would publish it to anybody who fetched the address,
   whatever the page then chose to draw. So the route serves the
   chrome, the address and a container, and `/courses.js` fills it
   after asking `/api/courses` with the reader's own token. The
   long version is at the head of `functions/api/courses/[[route]].ts`.

   That is the opposite of the rule everywhere else on this site,
   where the ladder is the server's, and it is worth being explicit
   that it is a deliberate exception rather than a shortcut. The
   ticks are unchanged: still the browser's, still `courses-read`,
   still carried to the account by `aab/sync.js`.

   ---- the loading line is real markup, not a spinner ----

   It is what a reader sees if the fetch is slow, if JavaScript is
   off, or if they are not signed in and the module has not
   replaced it yet. So it says something true in all three cases
   rather than spinning.
   ============================================================ */

import { Crumbs } from "./ui/crumbs";

/* Home, Skills, Courses, and wherever you are.

   The first three are the route's to know and always were: this
   section has one shape and every page in it sits three deep. The
   fourth is the page's own name, which the server cannot know,
   because the catalogue is admin-only and arrives from
   `/api/courses`. `setHere()` in `crumbs.js` rewrites the last
   crumb when it lands, finding it by
   `.crumbs li[aria-current="page"]`, which is what `<Crumbs>`
   renders.

   No JSON-LD beside it, unlike the module: every page in this
   section is `noindex`, so a machine-readable trail would describe
   a page no crawler is allowed to have. */
const TRAIL = [
  { href: "/", label: "Home" },
  { href: "/skills/index.html", label: "Skills" },
  { href: "/skills/courses/index.html", label: "Courses" },
];

export function CourseShell({ here }: { here?: string }) {
  const trail = here ? [...TRAIL, { label: here }] : TRAIL;

  return (
    <main id="main" className="course">
      {/* Inside the content column, which is the whole of the fix.
          `crumbs.js` mounts into `main > .wrap` and falls back to
          bare `main`; this shell has no wrap, so the trail landed
          in `main`, which has no inset, and sat against the left
          edge of the window while every other line on the page
          started at the column. The inset here is `.course-shell`'s
          own, so the two line up by construction rather than by
          both being told the same number.

          It also has to sit OUTSIDE `#course-app`, whose children
          are replaced wholesale by `/courses.js`. */}
      <div className="mx-auto max-w-[78rem] px-[clamp(1rem,3vw,2.5rem)]
        pt-[clamp(1rem,3vw,2.5rem)]">
        <Crumbs trail={trail} />
      </div>

      {/* `/courses.js` looks this up by id and replaces its
          children. The id is in that module too, and nowhere
          else: one page, one container, one name. */}
      <div className="course-shell" id="course-app">
        <div className="course-note">
          <h1>Loading the course</h1>
          <p>
            This section is private and needs an admin account. If nothing
            appears, you are either signed out or this is not your library.
          </p>
          <noscript>
            <p>It also needs JavaScript, because nothing here is in the page itself.</p>
          </noscript>
        </div>
      </div>
    </main>
  );
}

/** The head of every page in the section.

    `noindex` on all four, and not because the pages are boring: a
    crawler that cannot sign in gets the shell above, so what it
    would index is a permanent "loading" page under eight hundred
    addresses. `build-meta.mjs` disallows the prefix in robots.txt
    as well, which is the half that stops the fetch; this is the
    half that survives somebody linking to it. */
export const courseMeta = (title: string) => ({
  title: `${title} · Reiad's Library`,
  description: "A private study section. Not published.",
  robots: { index: false, follow: false },
  other: { "color-scheme": "light dark", "theme-color": "#0B3D2E" },
});
