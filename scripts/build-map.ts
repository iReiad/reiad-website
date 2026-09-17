#!/usr/bin/env node
/* ============================================================
   build-map.ts: MAP.md, the one note an agent reads first.

       node scripts/build-map.ts           write MAP.md
       node scripts/build-map.ts --check   fail if MAP.md is stale

   The map is GENERATED so it cannot rot: every route under
   `next/app/`, every source file with the first line of its own
   header, every storage key with what it holds, every entry of
   the menu, and the list of checks. A hand-written map is right
   on the day it is typed; this one is rebuilt by the generated
   stage of `check-all.ts` and fails the build when it drifts.

   What it is for: an agent that has read CLAUDE.md and this file
   knows where everything is and what each file is for without
   opening it. It reads a file only to change it.

   A file's line is the `name.ts: purpose` sentence at the top of
   it, which most files carry. A file without one gets its first
   comment line instead, and a file with no comment at all gets
   only its name, which is the honest answer and also a nudge.
   ============================================================ */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "MAP.md");
const CHECK = process.argv.includes("--check");

const { KEPT } = await import("../shared/storage.ts");
const { NAV } = await import("../shared/nav.ts");

/* ---------- reading ---------- */

function walk(dir: string, keep: (name: string) => boolean): string[] {
  const out: string[] = [];
  let names: string[];
  try { names = readdirSync(dir); } catch { return out; }
  for (const name of names.sort()) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const at = join(dir, name);
    if (statSync(at).isDirectory()) out.push(...walk(at, keep));
    else if (keep(name)) out.push(at);
  }
  return out;
}

const isSource = (name: string): boolean =>
  /\.(ts|tsx)$/.test(name) && !name.endsWith(".d.ts");

/** The one-line purpose at the top of a file: `name.ts: ...`
    where the header carries it, otherwise the first line of the
    first comment, otherwise nothing. Trimmed to one sentence and
    one line so the table stays a table. */
function purpose(path: string): string {
  const head = readFileSync(path, "utf8").split("\n").slice(0, 16).join("\n");
  const base = path.split("/").pop() ?? "";
  /* The rest of the header from the name on, so a sentence that
     wraps is still one sentence; cut at the end of the comment,
     then at the first full stop. */
  const named = new RegExp(`${base.replace(/[.[\]()]/g, "\\$&")}:\\s*([\\s\\S]+)`).exec(head);
  let line = named?.[1];
  if (!line) {
    const comment = /\/\*[\s=]*\n?\s*\*?\s*([\s\S]+)|^\s*\/\/\s*(.+)$/m.exec(head);
    line = comment?.[1] ?? comment?.[2] ?? "";
  }
  line = line.replace(/\*\/[\s\S]*$/, "").replace(/\n\s*\*?\s*/g, " ")
    .replace(/\s+/g, " ").replace(/[=*/]+\s*$/, "").trim();
  /* One sentence, and never a bare fragment ending in a comma. */
  const stop = line.search(/[.!?](\s|$)/);
  if (stop > 20) line = line.slice(0, stop + 1);
  if (line.length > 130) line = `${line.slice(0, 127).trimEnd()}...`;
  return line;
}

const rel = (path: string): string => relative(ROOT, path);

/** `next/app/(site)/tools/diet/page.tsx` is `/tools/diet`. */
const address = (path: string): string => {
  const inner = rel(path).replace(/^next\/app/, "").replace(/\/page\.tsx$/, "")
    .replace(/\/\([^)]*\)/g, "");
  return inner === "" ? "/" : inner;
};

function table(rows: Array<[string, string]>, heads: [string, string]): string {
  const lines = [`| ${heads[0]} | ${heads[1]} |`, "| --- | --- |"];
  for (const [a, b] of rows) lines.push(`| ${a} | ${b.replace(/\|/g, "\\|")} |`);
  return lines.join("\n");
}

/** Directories of DATA files, one row each: fourteen method
    essays or five seeded stages are one line in a map, not
    fourteen. Keyed by directory, with what the files are. */
const FOLDED: Record<string, string> = {
  "next/lib/methods": "one method essay per file, for /tools/research/methods/<slug>",
  "next/lib/workbooks": "one practice book per file, a term's or a Stufe's days",
  "scripts/money": "the money school's seeded lessons, one stage per file",
  "scripts/english/term-3": "the English grammar term's seeded parts, one part per file, and the three rungs that gather them",
  "shared/csl": "the CSL citation styles the Research Studio renders",
};

const files = (dir: string, keep = isSource): Array<[string, string]> => {
  const rows: Array<[string, string]> = [];
  const folded = new Set<string>();
  for (const p of walk(join(ROOT, dir), keep)) {
    const at = rel(p);
    const fold = Object.keys(FOLDED).find((d) => at.startsWith(`${d}/`));
    if (fold) {
      if (!folded.has(fold)) {
        folded.add(fold);
        const n = walk(join(ROOT, fold), keep).length;
        rows.push([`\`${fold}/\``, `${n} files: ${FOLDED[fold]}`]);
      }
      continue;
    }
    rows.push([`\`${at}\``, purpose(p)]);
  }
  return rows;
};

/* ---------- the parts ---------- */

const routes = walk(join(ROOT, "next/app"), (n) => n === "page.tsx")
  .map((p): [string, string] => [`\`${address(p)}\``, `${purpose(p)} (\`${rel(p)}\`)`])
  .sort((a, b) => a[0].localeCompare(b[0]));

const tests = walk(ROOT, (n) => /\.test\.ts$/.test(n))
  .filter((p) => !rel(p).startsWith("app/node_modules"))
  .map((p): [string, string] => [`\`${rel(p)}\``, purpose(p)]);

const keys = KEPT.map((k): [string, string] =>
  [`\`${k.key}\``, `${k.held}${k.syncs ? ", syncs" : ""}: ${k.what} (${k.by})`]);

const menu = NAV.flatMap((g) => g.items.map((it): [string, string] =>
  [`\`${it.href}\``, `${it.label}${"bn" in it && it.bn ? ` · ${String(it.bn)}` : ""} (${g.id})`]));

const checkAll = readFileSync(join(ROOT, "scripts/check-all.ts"), "utf8");
const listed = [...checkAll.matchAll(/^\s*(?:\[)?"((?:scripts|next|aab|functions)\/[^"]+\.ts)"/gm)]
  .map((m) => m[1]);
const checks = [...new Set(listed)].map((p): [string, string] =>
  [`\`${p}\``, purpose(join(ROOT, p))]);

const PREAMBLE = `# The map

Generated by \`scripts/build-map.ts\` from the files themselves, so it is
never out of date: the generated stage of \`check-all.ts\` fails when it
drifts. **Read this once at the start of a task**, after \`CLAUDE.md\`,
and open a file only to change it. Every line is the first sentence of
the file's own header.

## How the site is put together

- **Two Workers.** \`worker.js\` is the front door: it serves \`aab/\` as
  static assets, answers the API under \`functions/\`, and forwards every
  address in \`NEXT_ROUTES\` to the Next Worker, which is \`next/\` built
  by OpenNext. \`wrangler.toml\` is the first Worker's config.
- **Where the data is.** Articles, lessons and settings are in D1
  (Cloudflare's SQLite), written through the Studio at \`/studio\` and
  read by the routes. Accounts, progress, saved things and the research
  tables are in Supabase, behind row-level security, read by the browser
  with the reader's own token. Photos and nightly backups are in R2.
- **What the browser runs.** \`aab/src/*.ts\` are the served modules,
  compiled to \`aab/*.js\` by \`scripts/build-modules.ts\`; a Next route
  loads one through \`<SiteScripts>\`. \`app/src/\` is the React Studio,
  built to \`aab/studio/\`. React components under \`next/components/\`
  are the rest of the interface.
- **What three runtimes share.** \`shared/\` is imported by the Worker,
  the browser (compiled) and Next (as \`@reiad/shared\`, a copied package:
  refresh it after editing, see CLAUDE.md).
- **The look.** \`next/styles/site.css\` is the design system in cascade
  layers (\`tokens\`, \`base\`, \`shell\`, \`components\`, \`deck\`, \`article\`,
  \`lesson\`, one per section, \`tw\` last); \`tailwind.css\` maps the tokens
  to utilities; \`aab/fallback.css\` is the built copy for the two pages
  that are files. Colours, type, corners, spacing and motion are tokens
  on \`:root\` at the top of \`site.css\`.
- **The menu.** \`shared/nav.ts\` is the one table the rail, the top bar,
  the footer and \`/api/site\` read.
- **Verifying.** \`node scripts/check-all.ts --changed\` for what the diff
  could have broken, \`node scripts/check-all.ts\` before a pull request,
  and the browser suites in the Tests table for the areas touched.

## Where to change what

| to add or change | edit |
| --- | --- |
| a menu entry, a school, a tool, a section's colour | \`shared/nav.ts\` (and \`shared/content.ts\` for a count or a page) |
| a lesson's prose | the Studio at \`/studio/?lessons\`, or the seed under \`scripts/money/\`, \`scripts/english/\` |
| a ladder (stages, lessons, ids) | \`shared/curricula/<school>.ts\`, then \`scripts/build-modules.ts\` |
| an article block class | \`@layer article\` in \`site.css\`, \`KEEP_CLASSES\` in \`aab/editor.js\`, \`ALLOWED_CLASSES\` in \`functions/_lib/sanitise.ts\` |
| a storage key | a row in \`shared/storage.ts\`, and \`KEYS\` in \`aab/src/sync.ts\` if it syncs |
| a colour, a face, a corner, a spacing step | the tokens at the top of \`next/styles/site.css\`, then \`scripts/build-fallback.ts\` |
| a served module | \`aab/src/<name>.ts\`, then \`scripts/build-modules.ts\`, then bump \`VERSION\` in \`aab/sw.js\` and \`scripts/check-sw.ts --update\` |
| an API endpoint | \`functions/api/\`, gated by \`requireAdmin\`/\`isAdmin\` or named public in \`scripts/check-admin.ts\` |
| a route | a directory under \`next/app/\`, \`run_worker_first\` in \`wrangler.toml\`, \`NEXT_ROUTES\` in \`worker.js\` |
| a table a reader owns | a migration under \`supabase/migrations/\`, plus the copy and the erase in \`aab/src/account-page.ts\` |
| a check | \`scripts/check-<thing>.ts\`, listed in \`scripts/check-all.ts\` |
| the design | \`DESIGN.md\` says what it is today and what is still wrong; change it, then say so there |
`;

const doc = [
  PREAMBLE,
  "## Routes\n\nEvery `page.tsx` under `next/app/`, by address.\n\n" + table(routes, ["address", "what it is"]),
  "## Components (`next/components/`)\n\n" + table(files("next/components"), ["file", "what it is"]),
  "## Libraries (`next/lib/`)\n\n" + table(files("next/lib"), ["file", "what it is"]),
  "## Shared (`shared/`)\n\n" + table(files("shared"), ["file", "what it is"]),
  "## Served modules (`aab/src/`, built to `aab/*.js`) and the schools' engines\n\n"
    + table([...files("aab/src"), ...files("aab/schools", (n) => /\.(js|ts)$/.test(n) && !/\.test\./.test(n))], ["file", "what it is"]),
  "## API (`functions/`)\n\n" + table(files("functions"), ["file", "what it is"]),
  "## Scripts: checks, builds, seeds (`scripts/`)\n\n"
    + table(files("scripts", (n) => isSource(n) && !/\.test\.ts$/.test(n)), ["file", "what it is"]),
  "## The Studio (`app/src/`)\n\n" + table(files("app/src"), ["file", "what it is"]),
  "## Tests\n\nEvery `*.test.ts`. A test that needs a browser or a build says so in its header and skips out loud without one.\n\n"
    + table(tests, ["file", "what it guards"]),
  "## What runs in `check-all.ts`\n\n" + table(checks, ["entry", "what it catches"]),
  "## Storage keys (`shared/storage.ts`)\n\nWhat a browser holds, which kind it is, whether it syncs, and who writes it.\n\n"
    + table(keys, ["key", "what it is"]),
  "## The menu (`shared/nav.ts`)\n\n" + table(menu, ["address", "entry (group)"]),
].join("\n\n") + "\n";

/* ---------- writing, or checking ---------- */

if (CHECK) {
  let current = "";
  try { current = readFileSync(OUT, "utf8"); } catch { /* absent counts as stale */ }
  if (current !== doc) {
    console.error("MAP.md is stale: a file, a route, a key or a menu entry changed"
      + " and the map was not rebuilt.\n\n    node scripts/build-map.ts\n");
    process.exit(1);
  }
  console.log(`map: MAP.md matches the tree, ${doc.split("\n").length} lines.`);
} else {
  writeFileSync(OUT, doc);
  console.log(`wrote MAP.md, ${doc.split("\n").length} lines: ${routes.length} routes, `
    + `${keys.length} keys, ${menu.length} menu entries, ${checks.length} checks.`);
}
