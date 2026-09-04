/* ============================================================
   Vite, configured to fit a site that has never had a build step.

   THE OUTPUT IS COMMITTED, and that is not laziness. The site
   deploys by uploading `aab/` with no build step in CI, so a
   generated file has to be in git to be on the site. Edit the
   source, never the output.

   Three constraints, and all three come from the site rather than
   from React:

     one script, one stylesheet   no hashed chunk soup for sw.js to
                                  learn. Its precache list is a
                                  hand-kept list of paths, and a
                                  build that renamed its output on
                                  every commit would fight it every
                                  time.

     no CSS from here             `next/styles/site.css` is the
                                  design system and the route that
                                  mounts this bundle already carries
                                  it. React renders the same class
                                  names into the same @layer rules.
                                  archive/TRANSITION.md calls
                                  this the single most important
                                  constraint of Stage 9, so there
                                  is no CSS-in-JS, no Tailwind and
                                  no second design system here.

     'self' only                  the site's CSP is script-src
                                  'self'. Everything ships from
                                  this origin; nothing is fetched
                                  from a CDN, ever.

   ---- one page, one build, and TARGET is still here ----

   The Studio is the whole of this workspace now: the desk retired
   to `archive/desk-react/` when `/admin` took its thirteen panels
   over, and `aab/desk/` went off the site with it.

   TARGET stays because the constraint that made it a table has
   not changed: a page here is one file at a stable path, so
   `sw.js` and the route that loads it keep naming something real,
   and Rollup will not inline dynamic imports for more than one
   input at a time. Adding a second page is a line in TARGETS.
   ============================================================ */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/* Where each page's source lives, and where the site serves it
   from. Adding a second page is a line here. */
const TARGETS = {
  studio: { root: "src/studio", out: "aab/studio", base: "/studio/" },
} as const;

const which = (process.env.TARGET ?? "studio") as keyof typeof TARGETS;
const target = TARGETS[which];
if (!target) throw new Error(`TARGET must be one of ${Object.keys(TARGETS).join(", ")}`);

export default defineConfig({
  plugins: [react()],
  root: resolve(here, target.root),
  base: target.base,
  resolve: {
    /* One React in the bundle, whichever directory asked for it.

       `app/src/**` imports components out of `next/components/ui/`,
       and a bare `react` inside one of those files resolves from
       `next/node_modules` while the same specifier in `app/src`
       resolves from `app/node_modules`. Two copies of the JSX
       runtime is the harmless end of that; two copies of React
       itself is hooks throwing `Invalid hook call` in a bundle that
       built cleanly. Named here rather than left to luck: the two
       package.json files can hold the same version today and not
       tomorrow. */
    dedupe: ["react", "react-dom"],
  },
  build: {
    /* Resolved from the workspace root, not from `root`: Vite
       resolves a relative outDir against the project root, which
       is `src/studio` here and would put the build inside app/. */
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
      /* A `.tsx` entry rather than the `index.html` Vite would
         find on its own, which is what stops it emitting a page.

         The shell is a Next.js route as of archive/TRANSITION.md
         Stage 11.6, so the only thing this build still has to
         produce is the script that route loads. Leave an HTML
         entry in and Vite writes a second answer to
         `/studio/index.html` on every build, one the route would
         have to fight. */
      input: resolve(here, target.root, "main.tsx"),
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
