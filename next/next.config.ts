/* ============================================================
   next.config.ts

   Two settings, and both are about this app living inside a
   repository that is mostly not a Next.js app.

   ---- the one interesting line ----

   `@reiad/look` is `shared/look/`, a `file:` dependency, and it is
   a package rather than a relative import for a reason worth
   writing down. The table it holds is what the Worker's own
   renderer reads, and the acceptance test for this whole stage is
   that the two renderers agree; a copy of it in here would give
   this route a second answer to what a kitchen piece's footer
   says.

   A relative import up and out of this directory is the obvious
   way to share it and does not work. Turbopack refuses to resolve
   above its root, and moving the root up moves the file-tracing
   root with it, which makes Next write `.next/standalone/next/...`
   while OpenNext reads the manifests from the flat path: the build
   fails on a missing pages-manifest.json, which reads like a Next
   16 incompatibility and is nothing of the sort. The two roots are
   coupled and want opposite answers.

   npm resolves a `file:` dependency to a symlink inside
   node_modules, which is inside the root, so there is nothing to
   configure and nothing to keep in step.
   ============================================================ */

import type { NextConfig } from "next";
export default {
  reactStrictMode: true,
} satisfies NextConfig;

/* There is no setting here that reduces what a reading page ships.

   The App Router sends its runtime and router to every page,
   whatever the tree contains, and none of `optimizePackageImports`,
   `modularizeImports` or anything else touches it: they trim what
   YOUR code pulls in, and this route's own code is a few kilobytes
   already. The 170 KB is the framework. The only lever that ever
   existed is `unstable_runtimeJS: false`, which is Pages Router
   only. Stage 10 in TRANSITION.md records why that trade was taken
   the way it was, so the next person to go looking finds the
   answer instead of the search. */

/* The security headers are NOT set here.

   `headers()` in this file is the documented place for them and
   does not survive the trip: under @opennextjs/cloudflare the
   response came back with none of them. They are set in
   middleware.ts, which runs in the Worker itself, and the parity
   test checks every one of them against the Worker's own. */
