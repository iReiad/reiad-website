/* ============================================================
   check-headers.ts: do the two places that set security headers
   still say the same thing?

     node scripts/check-headers.ts

   `aab/_headers` is read by Cloudflare's static asset server and
   applies to every file in `aab/`. A response a Worker builds is
   not a file, so it gets none of them; `shared/headers.ts` is that
   same list, declared so the Worker and the Next.js route can
   attach it by hand.

   Two copies, which is one more than anybody wants, and it is not
   avoidable: `_headers` is a text file Cloudflare reads at deploy
   time and nothing in a Worker can read it at runtime. So they are
   compared here instead, and the failure is loud rather than
   silent.

   ---- what was actually wrong ----

   Nothing was comparing them, and nothing was attaching them. Every
   article published through the Studio was served with no CSP, no
   X-Frame-Options and no HSTS, while the identical-looking article
   beside it, still a committed file, had all three. The page
   renders the same either way, which is why it lasted.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/* A static import rather than `await import(join(ROOT, ...))`.

   The dynamic form was how a `.mjs` file reached a `.ts` one, and
   it is invisible to the compiler: `SECURITY_HEADERS` came back
   as `any`, so this check compared a table it knew nothing about
   against a file it had parsed by hand. Node resolves the
   relative path the same way and now the table is typed. */
import { SECURITY_HEADERS, securityEntries } from "../shared/headers.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");


/* ---------- what _headers says for every file ---------- */

/** The headers in the `/*` block, which is the one that applies to
    every page. Later blocks are per-path Cache-Control and are not
    what this is about. */
function starBlock(): Record<string, string> {
  const lines = readFileSync(join(ROOT, "aab/_headers"), "utf8").split("\n");
  const found: Record<string, string> = {};
  let inside = false;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    if (!/^\s/.test(line)) {                   // a path, not a header
      inside = line.trim() === "/*";
      continue;
    }
    if (!inside) continue;
    const text = line.trim();
    if (text.startsWith("#")) continue;
    const at = text.indexOf(":");
    if (at < 0) continue;
    found[text.slice(0, at).trim()] = text.slice(at + 1).trim();
  }
  return found;
}

/* ---------- the comparison ---------- */

/** Whitespace inside a CSP is not meaning: `a; b` and `a;  b` are
    one policy written twice. Everything else is compared as typed. */
const tidy = (value: string): string => value.replace(/\s+/g, " ").trim();

const fromFile = starBlock();
const failures: string[] = [];

/* `Object.entries` widens the values to `unknown` under
   `strict`, and every one of them is a header value. `shared/`
   exports the pairs already typed, so this asks for those rather
   than asserting its way past the widening. */
for (const [key, value] of securityEntries()) {
  if (!(key in fromFile)) {
    failures.push(`${key} is in shared/headers.ts and not in aab/_headers`);
    continue;
  }
  if (tidy(fromFile[key]) !== tidy(value)) {
    failures.push(
      `${key} differs:\n`
      + `        _headers: ${tidy(fromFile[key])}\n`
      + `        shared:   ${tidy(value)}`
    );
  }
}

/* The other direction matters just as much: a header added to
   `_headers` and not here is one every static page has and every
   Worker-rendered page does not. Cache-Control is excluded because
   it is per-path by design and each response sets its own. */
const NOT_SHARED = new Set(["Cache-Control"]);
for (const key of Object.keys(fromFile)) {
  if (NOT_SHARED.has(key) || key in SECURITY_HEADERS) continue;
  failures.push(`${key} is in aab/_headers and not in shared/headers.ts, `
    + "so a page rendered by a Worker would not have it");
}

if (failures.length) {
  console.error("\nthe two header lists disagree:\n");
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error(
    "\n        aab/_headers is what Cloudflare sends with a static file.\n"
    + "        shared/headers.ts is what the Worker and the Next.js route\n"
    + "        attach by hand, because a response they build is not a file.\n");
  process.exit(1);
}

console.log(
  `headers: ${Object.keys(SECURITY_HEADERS).length} security header(s), `
  + "the same in aab/_headers and shared/headers.ts.");
