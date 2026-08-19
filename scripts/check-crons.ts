/* ============================================================
   check-crons.ts: the schedules in wrangler.toml are the ones
   worker.js is waiting for.

     node scripts/check-crons.ts

   Cloudflare hands `scheduled()` the exact cron string from
   wrangler.toml, and worker.js decides which job to run by
   comparing against it. There is no binding, no enum and no type:
   two strings in two files that have to be identical.

   When they drift, nothing complains. The Worker still deploys,
   the trigger still fires, and the branch that was meant to catch
   it silently does not, so the job stops running and the first
   sign of it is a backup that is three weeks old on the day you
   need it. That is the whole reason this file exists.
   ============================================================ */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const toml = readFileSync(join(root, "wrangler.toml"), "utf8");
const worker = readFileSync(join(root, "worker.js"), "utf8");

let bad = 0;
const fail = (msg: string): void => { bad += 1; console.error(`  ${msg}`); };

/* ---- what wrangler.toml actually declares ---- */
const line = toml.match(/^\s*crons\s*=\s*\[(.*)\]\s*$/m);
if (!line) {
  fail("no `crons = [...]` line in wrangler.toml");
} else {
  const declared = [...line[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

  /* ---- what worker.js is watching for ---- */
  const block = worker.match(/export const CRON = \{([\s\S]*?)\};/);
  if (!block) {
    fail("no `export const CRON = { ... }` in worker.js");
  } else {
    const watched = Object.fromEntries(
      [...block[1].matchAll(/(\w+)\s*:\s*"([^"]+)"/g)].map((m) => [m[1], m[2]])
    );

    for (const [name, cron] of Object.entries(watched)) {
      if (!declared.includes(cron)) {
        fail(`worker.js waits for CRON.${name} = "${cron}", `
          + `which wrangler.toml does not declare. That job will never run.`);
      }
    }

    for (const cron of declared) {
      if (!Object.values(watched).includes(cron)) {
        fail(`wrangler.toml declares "${cron}", which worker.js names nowhere. `
          + `It will fall through to the default branch.`);
      }
    }

    /* The comparison in scheduled() has to use the constants, or
       the constants are decoration and the check is checking
       nothing. */
    if (!/event\.cron === CRON\.\w+/.test(worker)) {
      fail("scheduled() does not compare event.cron against CRON.*, "
        + "so these constants are not what actually decides anything.");
    }

    if (!bad) {
      console.log(
        `crons: ${declared.length} schedule(s) declared, `
        + `all named in worker.js and compared through CRON.*`
      );
    }
  }
}

process.exit(bad ? 1 : 0);
