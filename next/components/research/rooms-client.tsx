"use client";

/* ============================================================
   research/rooms-client.tsx: the three rooms that carry a browser
   library, loaded in the browser and nowhere else.

   A WORKER IS CAPPED AT 3 MiB COMPRESSED, and this one reached
   3.29 with the studio's last stage. 432 KiB of that, gzipped, was
   four libraries that only ever run in a browser: pdf.js draws a
   PDF on a canvas, `docx` and `pptxgenjs` build a file the reader
   downloads, citeproc renders citations as they type, KaTeX draws
   an equation. Every one is reached through `await import(...)`
   inside an effect or a click, so the server never awaits one, and
   Next bundles them anyway: a client component's dynamic imports
   are in the server graph too.

   `ssr: false` is what takes them out, and it needs this file:
   a Server Component may not pass it to `next/dynamic`, so the
   boundary is a client module of its own. What the reader loses is
   markup for a room that renders its signed-out state on the
   server and everything else after hydration, which is what these
   three did already.

   Measured, gzipped: pdf.js 148 KiB, docx 112, citeproc 95,
   KaTeX 77. `node scripts/check-worker-size.ts` is what fails if
   the bundle climbs back.
   ============================================================ */

import dynamic from "next/dynamic";

export const ReadingRoom = dynamic(() => import("./queue").then((m) => m.ReadingRoom), { ssr: false });
export const Desk = dynamic(() => import("./write").then((m) => m.Desk), { ssr: false });
export const Workshop = dynamic(() => import("./workshop").then((m) => m.Workshop), { ssr: false });
export const ReviewRoom = dynamic(() => import("./review").then((m) => m.ReviewRoom), { ssr: false });
