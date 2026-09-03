#!/usr/bin/env node
/* ============================================================
   check-worker-size.ts: the Next Worker against Cloudflare's cap.

       node scripts/check-worker-size.ts

   A WORKER IS 3 MiB COMPRESSED AND NOTHING HERE MEASURED IT. On 3
   September 2026 the Research Studio's last stage took `reiad-next`
   from 2946 KiB gzipped to 3294, and every deploy of that branch
   failed. What that looks like is the worst kind of red: `checks`
   green, every test green, a clean `opennextjs-cloudflare build`,
   and one line in a Cloudflare dashboard nobody can read from a
   pull request. It took a clean clone of main, built and measured,
   to find out the number had simply crossed a line.

   What crossed it was four libraries that only ever run in a
   browser, pulled into the SERVER bundle because a client
   component's dynamic imports are in the server graph too:
   pdf.js at 148 KiB gzipped, `docx` at 112, citeproc at 95 and
   KaTeX at 77. `next/components/research/rooms-client.tsx` is the
   `ssr: false` boundary that keeps them out, and this is what
   fails if they come back.

   LIMIT is Cloudflare's own 3 MiB. CEILING is lower on purpose:
   a check that passes at 3071 KiB tells you nothing until the day
   it tells you too late, and the room to add a room is the whole
   point of knowing the number.

   It needs a build and says so rather than passing without one:

       cd next && npx opennextjs-cloudflare build
   ============================================================ */

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NEXT = join(ROOT, "next");

/** Cloudflare's cap on a Worker, compressed. */
const LIMIT = 3 * 1024;
/** What this fails at, in KiB gzipped. */
const CEILING = 2800;

if (!existsSync(join(NEXT, ".open-next", "worker.js"))) {
  console.log("worker size: SKIPPED, next/.open-next is not built.");
  console.log("  cd next && npx opennextjs-cloudflare build");
  console.log("A skip is not a pass.\n");
  process.exit(0);
}

let out = "";
try {
  out = execFileSync("npx", ["wrangler@4", "deploy", "--dry-run"], {
    cwd: NEXT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 300_000,
  });
} catch (e) {
  const err = e as { stdout?: string; stderr?: string };
  out = `${err.stdout ?? ""}\n${err.stderr ?? ""}`;
}

const found = /gzip:\s*([\d.]+)\s*KiB/.exec(out);
if (!found) {
  console.error("worker size: wrangler did not report a gzip size.");
  console.error(out.split("\n").slice(-12).join("\n"));
  process.exit(1);
}

const kib = Number(found[1]);
const room = LIMIT - kib;
if (kib > CEILING) {
  console.error(`\n  x reiad-next is ${kib} KiB gzipped, over this file's ${CEILING} KiB ceiling.`);
  console.error(`        Cloudflare refuses it at ${LIMIT}, so there is ${room.toFixed(0)} KiB left.`);
  console.error("        What put it over last time was a browser library in the SERVER");
  console.error("        bundle. Look for one, and give the room that carries it an");
  console.error("        `ssr: false` boundary in components/research/rooms-client.tsx:");
  console.error("          cd next && find .open-next/server-functions -name '*.js' \\");
  console.error("            | xargs -I{} sh -c 'echo \"$(gzip -c {} | wc -c) {}\"' | sort -rn | head");
  process.exit(1);
}

console.log(`worker size: reiad-next is ${kib} KiB gzipped, ${room.toFixed(0)} KiB under Cloudflare's ${LIMIT}.`);
