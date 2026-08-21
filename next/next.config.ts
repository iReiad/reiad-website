/* ============================================================
   next.config.ts

   Three settings, and all of them are about this app living inside
   a repository that is mostly not a Next.js app.

   ---- the package, and why it is one ----

   `@reiad/shared` is `shared/`, a `file:` dependency, and it is a
   package rather than a relative import for a reason worth writing
   down. The table it holds is what the Worker's own renderer
   reads, and the acceptance test for this whole stage is that the
   two renderers agree; a copy of it in here would give this route
   a second answer to what a kitchen piece's footer says.

   A relative import up and out of this directory is the obvious
   way to share it and does not work. Turbopack refuses to resolve
   above its root, and moving the root up moves the file-tracing
   root with it, which makes Next write `.next/standalone/next/...`
   while OpenNext reads the manifests from the flat path: the build
   fails on a missing pages-manifest.json, which reads like a Next
   16 incompatibility and is nothing of the sort. The two roots are
   coupled and want opposite answers.

   `next/.npmrc` sets `install-links=true`, so npm copies the
   directory into `node_modules` rather than symlinking it: a
   symlink resolves to its real path and gets refused for being
   outside the root all over again.

   ---- and why it has to be transpiled ----

   `shared/` is TypeScript, with no compiled JavaScript beside it.
   Both of its consumers compile it themselves, which is the whole
   reason there is no build step in that directory: wrangler's
   esbuild does it when it bundles `worker.js`, and this line is
   the same instruction for Next.

   It is needed because the package resolves INSIDE `node_modules`,
   by the arrangement two paragraphs up, and Next does not compile
   TypeScript it finds there. Without this the build fails on the
   first `import ... from "@reiad/shared/look"` with a syntax error
   in a `.ts` file, which reads like a broken package and is only
   ever this setting missing.
   ============================================================ */

import type { NextConfig } from "next";

/* ---- which build is this ----

   Cloudflare Workers Builds sets WORKERS_CI_COMMIT_SHA; the other
   two are what the same fact is called elsewhere, so a build
   started by hand or by an action still has a name.

   It exists because /admin rendered its heading and two cards and
   none of its panels, in one browser and not another, and nothing
   on the page could say which build was answering. Every check
   reads what the server sends; none of them can see what a
   reader's own machine, or a cache between the two, decided to
   hand over instead. A page that names its build turns that from
   an investigation into a screenshot. */
const BUILD = process.env.WORKERS_CI_COMMIT_SHA
  ?? process.env.CF_PAGES_COMMIT_SHA
  ?? process.env.GITHUB_SHA
  ?? "";

export default {
  reactStrictMode: true,
  transpilePackages: ["@reiad/shared"],
  /* Only when it is known: Next's own default is a fresh id per
     build, and replacing it with a constant would make two
     different builds claim the same one. */
  ...(BUILD ? { generateBuildId: () => BUILD } : {}),
  env: { SITE_BUILD: BUILD },
} satisfies NextConfig;

/* There is no setting here that reduces what a reading page ships.

   The App Router sends its runtime and router to every page,
   whatever the tree contains, and none of `optimizePackageImports`,
   `modularizeImports` or anything else touches it: they trim what
   YOUR code pulls in, and this route's own code is a few kilobytes
   already. The 170 KB is the framework. The only lever that ever
   existed is `unstable_runtimeJS: false`, which is Pages Router
   only. Stage 10 in archive/TRANSITION.md records why that trade was taken
   the way it was, so the next person to go looking finds the
   answer instead of the search. */

/* The security headers are NOT set here.

   `headers()` in this file is the documented place for them and
   does not survive the trip: under @opennextjs/cloudflare the
   response came back with none of them. They are set in
   middleware.ts, which runs in the Worker itself, and the parity
   test checks every one of them against the Worker's own. */
