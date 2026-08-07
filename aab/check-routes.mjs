#!/usr/bin/env node
/* ============================================================
   check-routes.mjs — catch broken URLs before deploying.

       node aab/check-routes.mjs

   Cloudflare Pages' routing is the one part of this site that
   can't be tested with a local file server, and it has already
   broken the site once: a "pretty URL" rule in _redirects
   pointed /about → /about.html while Pages itself redirects
   /about.html → /about, so the two bounced off each other
   forever and the page never loaded in any browser.

   This walks every public URL through the same rules Pages
   applies and fails loudly on a loop, a dead end, or a link
   pointing at a file that isn't there.

   Pages' asset behaviour, in order:
     1. _redirects rules, in file order, first match wins
     2. otherwise /foo.html is 308-redirected to /foo
     3. /foo serves foo.html, /dir serves dir/index.html
   ============================================================ */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const MAX_HOPS = 10;

/* ---------- the rules ---------- */

const rules = readFileSync(join(ROOT, "_redirects"), "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"))
  .map((line, i) => {
    const [from, to, status = "302"] = line.split(/\s+/);
    return { from, to, status: Number(status), line: i + 1 };
  });

function step(path) {
  const rule = rules.find((r) => r.from === path);
  if (rule) return { redirect: rule.to, why: `_redirects` };

  if (path.endsWith(".html")) {
    const stripped = path.replace(/(\/index)?\.html$/, "") || "/";
    if (stripped !== path) return { redirect: stripped, why: "Pages strips .html" };
  }

  for (const candidate of [path, `${path}.html`, `${path.replace(/\/$/, "")}/index.html`]) {
    const file = join(ROOT, candidate);
    if (existsSync(file) && statSync(file).isFile()) return { file: candidate };
  }
  return { missing: true };
}

function trace(start) {
  const chain = [];
  let path = start;
  for (let i = 0; i < MAX_HOPS; i++) {
    if (chain.includes(path)) return { status: "LOOP", chain: [...chain, path] };
    chain.push(path);
    const s = step(path);
    if (s.file) return { status: "ok", chain, file: s.file };
    if (s.missing) return { status: "MISSING", chain };
    path = s.redirect;
  }
  return { status: "TOO MANY HOPS", chain };
}

/* ---------- what to check: every page, and every link in it ---------- */

const pages = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!["og", "functions", "node_modules"].includes(entry)) walk(full);
    } else if (entry.endsWith(".html")) {
      pages.push("/" + relative(ROOT, full));
    }
  }
})(ROOT);

const targets = new Set(["/", ...pages, ...rules.map((r) => r.from)]);

// every root-absolute href/src the pages point at
const linkSources = new Map();
for (const page of pages) {
  // Comments explain example paths that deliberately don't exist yet,
  // so scan the real markup only.
  const html = readFileSync(join(ROOT, page.slice(1)), "utf8")
    .replace(/<!--[\s\S]*?-->/g, "");
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    targets.add(m[1]);
    if (!linkSources.has(m[1])) linkSources.set(m[1], page);
  }
}

let failures = 0;
for (const url of [...targets].sort()) {
  const t = trace(url);
  if (t.status === "ok") continue;
  failures++;
  const from = linkSources.get(url);
  console.error(`${t.status}  ${url}${from ? `   (linked from ${from})` : ""}`);
  console.error(`        ${t.chain.join(" → ")}`);
}

console.log(
  failures
    ? `\n${failures} broken route(s) — fix before deploying.`
    : `${targets.size} routes checked, all resolve.`
);
process.exit(failures ? 1 : 0);
