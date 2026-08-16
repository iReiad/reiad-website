/* ============================================================
   Vite, configured to fit a site that has never had a build step.

   THE OUTPUT IS COMMITTED, and that is not laziness. Every school
   on this site is already generated and committed: `aab/learn/**`
   comes out of `build-lessons.mjs`, and CLAUDE.md's rule is "edit
   the source, never the output". This is the same arrangement with
   a different generator, so it needs no change to how the site
   deploys, no build command in a dashboard that cannot be seen
   from the repository, and it stays one `git revert` from gone.

   Three constraints, and all three come from the site rather than
   from React:

     one script, one stylesheet   no hashed chunk soup for sw.js to
                                  learn. Its precache list is a
                                  hand-kept list of paths, and a
                                  build that renamed its output on
                                  every commit would fight it every
                                  time.

     no CSS from here             `aab/styles.css` is the design
                                  system and the page loads it as
                                  it always has. React renders the
                                  same class names into the same
                                  @layer rules. TRANSITION.md calls
                                  this the single most important
                                  constraint of Stage 9, so there
                                  is no CSS-in-JS, no Tailwind and
                                  no second design system here.

     'self' only                  the site's CSP is script-src
                                  'self'. Everything ships from
                                  this origin; nothing is fetched
                                  from a CDN, ever.

   ---- two pages, two builds ----

   The desk and the Studio are separate pages that share modules,
   not one app with two routes, and they build separately because
   of the first constraint above: one file each, at a stable path,
   so `sw.js` and the two HTML shells keep naming something real.
   Rollup will not inline dynamic imports for more than one input
   at a time, which is the same constraint stated by the bundler.

   `npm run build` runs both. TARGET picks one.
   ============================================================ */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/* Where each page's source lives, and where the site serves it
   from. Adding a third page is a line here. */
const TARGETS = {
  desk: { root: "src", out: "aab/desk", base: "/desk/" },
  studio: { root: "src/studio", out: "aab/studio", base: "/studio/" },
} as const;

const which = (process.env.TARGET ?? "desk") as keyof typeof TARGETS;
const target = TARGETS[which];
if (!target) throw new Error(`TARGET must be one of ${Object.keys(TARGETS).join(", ")}`);

export default defineConfig({
  plugins: [react()],
  root: resolve(here, target.root),
  base: target.base,
  build: {
    /* Resolved from the workspace root, not from `root`: Vite
       resolves a relative outDir against the project root, which
       is `src/studio` for one of these two and would put the
       Studio's build inside app/. */
    outDir: resolve(here, "..", target.out),
    emptyOutDir: true,
    /* Minified, after trying it the other way.

       The first version of this said readable output was worth
       more than the kilobytes because the file is committed. That
       was wrong twice over: unminified React is 507 KB, which is
       350 KB of somebody else's library that nobody is going to
       read a diff of anyway, and it is 350 KB a browser has to
       parse to draw a private page. Generated output is not
       source; `git diff` on it is not meant to be read, which is
       exactly what CLAUDE.md already says about every generated
       page on this site. */
    minify: true,
    sourcemap: false,
    rollupOptions: {
      /* The site's own modules are NOT bundled. `/app.js`,
         `/api.js`, `/auth.js`, `/content.js`, `/share-card.js`,
         `/photo.js` and `/editor.js` are served by this site at
         those exact paths, are shared with every other page, and
         several are already in the service worker's precache list.
         Copying them into this bundle would ship two of each and
         let the two drift.

         `/content.js` is the one that would hurt most: it is the
         manifest the menu, the palette, the sitemap and the
         portfolio count all read, and a second copy of it inside
         a committed bundle is a second answer to "what is on this
         site" that nothing would ever check against the first.
         `/editor.js` is the one that would hurt soonest: the old
         Studio and this one have to sanitise identically or a
         piece means different things depending on which page it
         was written in.

         Left external, the built file keeps `import { api } from
         "/api.js"` and the browser resolves it at runtime, which
         is how every other module on this site already works. */
      external: [/^\/(app|api|auth|content|share-card|photo|editor)\.js$/],
      output: {
        entryFileNames: "app.js",
        assetFileNames: "app.[ext]",
        // One file. See the note above about the precache list.
        inlineDynamicImports: true,
      },
    },
  },
});
