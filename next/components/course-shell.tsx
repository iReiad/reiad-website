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

/* No trail here any more. It is in the top bar, on every page of
   the site including this one, and `layout.tsx` beside these
   routes is what passes the two levels the nav table cannot know.
   A row here as well would be the same trail twice. */

export function CourseShell() {
  return (
    <main id="main" className="course">
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
