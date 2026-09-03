#!/usr/bin/env node
/* ============================================================
   check-research.ts: the Research Studio's rules that are about
   PAGES and TABLES rather than about arithmetic.

       node scripts/check-research.ts

   `RESEARCH.md` section 30 asks for three guards and they cover
   different halves. `scripts/research.test.ts` is the arithmetic:
   the citation key, the duplicate hash, the two parsers.
   `next/research-studio.test.ts` drives the built rooms in a
   browser. This is the third thing, and every question it asks
   is a rule the plan states that nothing else holds:

   1. EVERY ROOM IN THE PAGES TABLE IS A ROUTE, AND EVERY ROUTE
      IS IN THE TABLE. Two lists that can disagree, held to each
      other. The clipper and the two `[id]` children are named as
      not rooms, with the reason.

   2. BOTH LANGUAGES COVER EVERY PHRASE. A `<T>` with an empty
      half, a `<W>` naming a key nobody wrote, an `aria-label` or
      a `placeholder` written as an English literal: each is a
      Bangla reader meeting English on a page whose whole promise
      is that they will not.

   3. EVERY VOCABULARY IS THE MIGRATION'S. `shared/research.ts`
      says what a type, a kind, a lane and a state may be, and the
      migration says it again as a CHECK constraint. The day they
      disagree is the day a value the page offers is a 400 on the
      whole write.

   4. THE DESK IS GONE. No `.rd-` rule, no `/admin/research`
      route, a 301 for the address, and no `threads` in the
      account page: a replacement that leaves the thing it
      replaced half in place is two things drifting apart.

   5. EVERY ROUTE CARRIES METADATA and the studio's frame, so a
      room added by copying its neighbour cannot ship as bare
      HTML with no title.
   ============================================================ */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { RESEARCH_PAGES } from "../next/lib/research-pages.ts";
import {
  HIGHLIGHT_MEANINGS, NOTE_KINDS, PROJECT_KINDS, PROJECT_STATES, QUESTION_KINDS, QUESTION_STATES, SOURCE_STATUSES,
  SOURCE_TYPE_IDS, SOURCE_VIAS, TASK_LANES, TONES,
} from "../shared/research.ts";
import { EVENT_KINDS } from "../shared/research-plan.ts";
import { PEOPLE_ROLES } from "../shared/research-plan.ts";
import { RECORD_STAGES, REVIEW_KINDS, REVIEW_STATES } from "../shared/research-review.ts";
import { RUN_KINDS } from "../shared/research-lab.ts";
import { RESEARCH_WORDS } from "../shared/research-words.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROUTES = join(ROOT, "next", "app", "(site)", "tools", "research");
const COMPONENTS = join(ROOT, "next", "components", "research");

let bad = 0;
const fail = (line: string, ...detail: string[]): void => {
  bad += 1;
  console.error(`\n  x ${line}`);
  for (const d of detail) console.error(`        ${d}`);
};

/* ---------- 1. the table and the routes ---------- */

/** Directories under the studio that are not rooms, with why. */
const NOT_A_ROOM: Record<string, string> = {
  clip: "the bookmarklet's landing: a press on a paper's page arrives here and "
    + "leaves for the source it filed. Not in the strip because nobody goes there on purpose.",
  survey: "a field room survey as a stranger sees it (RESEARCH.md 15): a public form "
    + "read from /api/survey/<token> with no bearer. Not in the strip because it is not the reader's page.",
};

/** A route that deliberately stands outside the studio's frame: a
    page for somebody who is not the reader. Every other page under
    tools/research wears the frame, and the walk below fails a page
    that does not unless it is named here with the reason. */
const NOT_FRAMED: Record<string, string> = {
  "survey/[token]/page.tsx": "a stranger answering a survey should see the form and nothing of the studio.",
};

{
  const dirs = readdirSync(ROUTES).filter((n) => statSync(join(ROUTES, n)).isDirectory());
  const tabled = new Set(RESEARCH_PAGES.map((p) => p.href.replace("/tools/research/", "")));
  for (const d of dirs) {
    if (tabled.has(d) || NOT_A_ROOM[d]) continue;
    fail(`next/app/(site)/tools/research/${d}/ is a route and not a room in the pages table`,
      "Add it to RESEARCH_PAGES in next/lib/research-pages.ts, or to NOT_A_ROOM here with the reason.");
  }
  for (const p of RESEARCH_PAGES) {
    const dir = p.href.replace("/tools/research/", "");
    if (!existsSync(join(ROUTES, dir, "page.tsx"))) {
      fail(`${p.href} is in the pages table and has no route`, `expected next/app/(site)/tools/research/${dir}/page.tsx`);
    }
  }
  for (const name of Object.keys(NOT_A_ROOM)) {
    if (!existsSync(join(ROUTES, name))) fail(`NOT_A_ROOM names ${name}/, which is not there.`, "Remove the entry.");
  }
  for (const name of Object.keys(NOT_FRAMED)) {
    if (!existsSync(join(ROUTES, name))) fail(`NOT_FRAMED names ${name}, which is not there.`, "Remove the entry.");
  }
  const seen = new Set<string>();
  for (const p of RESEARCH_PAGES) {
    if (seen.has(p.href)) fail(`${p.href} is in the pages table twice`);
    seen.add(p.href);
    if (!TONES.includes(p.tone)) fail(`${p.href} wears "${p.tone}", which is not one of the seven tones`);
    if (!p.tab.en || !p.tab.bn || !p.title.en || !p.title.bn || !p.dek.en || !p.dek.bn) {
      fail(`${p.href} has a half-written phrase in the pages table`);
    }
  }
  /* Exactly one layout under the tree: check-routes counts shells
     site-wide, and this is the studio saying it out loud. */
  const layouts: string[] = [];
  const walk = (dir: string): void => {
    for (const n of readdirSync(dir)) {
      const at = join(dir, n);
      if (statSync(at).isDirectory()) walk(at);
      else if (n === "layout.tsx") layouts.push(relative(ROUTES, at));
    }
  };
  walk(ROUTES);
  if (layouts.length !== 1 || layouts[0] !== "layout.tsx") {
    fail(`the studio has ${layouts.length} layout(s): ${layouts.join(", ")}`,
      "One, at the top. A second draws the rail, the bar, the footer and the",
      "boot script twice, which is what happened to the desk under /admin.");
  }
}

/* ---------- 2. both languages ---------- */

const BANGLA = /[ঀ-৿]/;

const files: string[] = [];
const walkTsx = (dir: string): void => {
  for (const n of readdirSync(dir)) {
    const at = join(dir, n);
    if (statSync(at).isDirectory()) walkTsx(at);
    else if (/\.tsx?$/.test(n)) files.push(at);
  }
};
walkTsx(COMPONENTS);
walkTsx(ROUTES);

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);
  /* Every key a <W> names is a key somebody wrote. Template keys
     (`rs.board.decided.${x}`) are checked by prefix: every key
     with that prefix must exist for every value the code can
     produce, which the vocabulary lists say. */
  for (const m of src.matchAll(/<W\s+k="([^"]+)"/g)) {
    if (!RESEARCH_WORDS[m[1]]) fail(`${rel} draws <W k="${m[1]}"> and shared/research-words.ts has no such key`);
  }
  for (const m of src.matchAll(/both\("([^"]+)"\)/g)) {
    if (!RESEARCH_WORDS[m[1]]) fail(`${rel} calls both("${m[1]}") and shared/research-words.ts has no such key`);
  }
  /* A <T> with one half. */
  for (const m of src.matchAll(/<T\s+([^>]*?)\/>/g)) {
    const attrs = m[1];
    const hasEn = /\ben=/.test(attrs);
    const hasBn = /\bbn=/.test(attrs);
    if (hasEn !== hasBn) fail(`${rel} has a <T> with one half: ${m[0].slice(0, 80)}`);
    const bn = /\bbn="([^"]*)"/.exec(attrs)?.[1];
    if (bn !== undefined && bn && !BANGLA.test(bn)) fail(`${rel}: a <T> whose bn half is not Bangla: ${bn}`);
  }
  /* An attribute is not a node and cannot be rendered twice, so
     a literal there must carry both scripts. */
  for (const m of src.matchAll(/\b(aria-label|placeholder|title)="([^"{}]+)"/g)) {
    if (/^[A-Za-z]/.test(m[2]) && !BANGLA.test(m[2]) && !/^[\d\-\s]+$/.test(m[2])) {
      fail(`${rel} has ${m[1]}="${m[2]}" as an English literal`,
        'Use both("key") from lang.tsx, or write both scripts: "Sources / উৎস".');
    }
  }
}

for (const [k, p] of Object.entries(RESEARCH_WORDS)) {
  if (!p.en?.trim() || !p.bn?.trim()) fail(`research-words "${k}" has an empty half`);
  else if (!BANGLA.test(p.bn) && p.bn !== p.en) fail(`research-words "${k}" bn half is not Bangla: ${p.bn}`);
}

/* The keys the code builds from a vocabulary. */
for (const s of SOURCE_STATUSES) if (!RESEARCH_WORDS[`rs.lib.status.${s}`]) fail(`no phrase for rs.lib.status.${s}`);
for (const s of QUESTION_STATES) if (!RESEARCH_WORDS[`rs.q.state.${s}`]) fail(`no phrase for rs.q.state.${s}`);
for (const s of ["supports", "contradicts", "method", "context"]) if (!RESEARCH_WORDS[`rs.q.stance.${s}`]) fail(`no phrase for rs.q.stance.${s}`);
for (const s of ["doi", "isbn", "url", "bib", "todo", "note", "dup", "fail"]) if (!RESEARCH_WORDS[`rs.board.decided.${s}`]) fail(`no phrase for rs.board.decided.${s}`);

/* ---------- 3. the vocabularies against the migration ---------- */

{
  const dir = join(ROOT, "supabase", "migrations");
  const sql = readdirSync(dir).filter((f) => /research/.test(f))
    .map((f) => readFileSync(join(dir, f), "utf8")).join("\n")
    .replace(/^\s*--.*$/gm, "");
  const constraint = (table: string, column: string): string[] => {
    const body = new RegExp(`create table if not exists public\\.${table} \\(([\\s\\S]*?)\\n\\);`).exec(sql)?.[1] ?? "";
    const col = new RegExp(`\\n\\s*${column}\\s+text[^\\n]*(?:\\n[^\\n]*)*?check \\(${column} in \\(([^)]*)\\)`).exec(body);
    if (!col) return [];
    return col[1].split(",").map((s) => s.trim().replace(/^'|'$/g, ""));
  };
  const same = (what: string, table: string, column: string, ours: readonly string[]): void => {
    const theirs = constraint(table, column);
    if (!theirs.length) { fail(`${table}.${column} has no CHECK constraint in the migration`); return; }
    const a = [...ours].sort().join(",");
    const b = [...theirs].sort().join(",");
    if (a !== b) fail(`${what}: shared/research.ts says [${a}] and the migration says [${b}]`);
  };
  same("SOURCE_TYPES", "research_sources", "type", SOURCE_TYPE_IDS);
  same("SOURCE_STATUSES", "research_sources", "status", SOURCE_STATUSES);
  same("SOURCE_VIAS", "research_sources", "added_via", SOURCE_VIAS);
  same("NOTE_KINDS", "research_notes", "kind", NOTE_KINDS);
  same("TASK_LANES", "research_tasks", "lane", TASK_LANES);
  same("QUESTION_KINDS", "research_questions", "kind", QUESTION_KINDS);
  same("QUESTION_STATES", "research_questions", "state", QUESTION_STATES);
  same("PROJECT_KINDS", "research_projects", "kind", PROJECT_KINDS);
  same("HIGHLIGHT_MEANINGS", "research_highlights", "meaning", HIGHLIGHT_MEANINGS);
  same("EVENT_KINDS", "research_events", "kind", EVENT_KINDS);
  same("PEOPLE_ROLES", "research_people", "role", PEOPLE_ROLES);
  same("REVIEW_KINDS", "research_reviews", "kind", REVIEW_KINDS);
  same("RUN_KINDS", "research_runs", "kind", RUN_KINDS);
  same("TONES", "research_codes", "colour", TONES);
  same("REVIEW_STATES", "research_reviews", "state", REVIEW_STATES);
  same("RECORD_STAGES", "research_review_records", "stage", RECORD_STAGES);
  same("DOCUMENT_KINDS", "research_documents", "kind", ["chapter", "paper", "proposal", "abstract", "letter", "other"]);
  same("PROJECT_STATES", "research_projects", "state", PROJECT_STATES);
  same("TONES", "research_projects", "tone", TONES);
}

/* ---------- 4. the desk is gone ---------- */

{
  const css = readFileSync(join(ROOT, "next", "styles", "site.css"), "utf8");
  if (/\.rd-[a-z]/.test(css)) fail("next/styles/site.css still holds a .rd- rule from the research desk");
  if (existsSync(join(ROOT, "next", "app", "(site)", "admin", "research"))) fail("next/app/(site)/admin/research/ is back");
  const worker = readFileSync(join(ROOT, "worker.js"), "utf8");
  if (/admin\(\\\/research\)\?/.test(worker)) fail("worker.js still routes /admin/research to Next");
  const wrangler = readFileSync(join(ROOT, "wrangler.toml"), "utf8");
  if (/"\/admin\/research"/.test(wrangler)) fail("wrangler.toml still lists /admin/research in run_worker_first");
  const redirects = readFileSync(join(ROOT, "aab", "_redirects"), "utf8");
  if (!/^\/admin\/research\s+\/tools\/research\/questions\s+301/m.test(redirects)) fail("aab/_redirects has no 301 for /admin/research");
  const account = readFileSync(join(ROOT, "aab", "src", "account-page.ts"), "utf8");
  if (/"threads"/.test(account)) fail("aab/src/account-page.ts still names the threads table");
  const saved = readFileSync(join(ROOT, "aab", "src", "saved.ts"), "utf8");
  if (/listThreads|saveThread/.test(saved)) fail("aab/src/saved.ts still carries the desk's thread functions");
}

/* ---------- 5. every route is a real page ---------- */

{
  const walk = (dir: string): void => {
    for (const n of readdirSync(dir)) {
      const at = join(dir, n);
      if (statSync(at).isDirectory()) { walk(at); continue; }
      if (n !== "page.tsx") continue;
      const src = readFileSync(at, "utf8");
      const rel = relative(ROOT, at);
      if (!/export const metadata/.test(src)) fail(`${rel} exports no metadata`);
      const under = relative(ROUTES, at);
      if (!/<ResearchFrame/.test(src) && !NOT_FRAMED[under]) fail(`${rel} does not use the studio's frame`);
      if (NOT_FRAMED[under] && /<ResearchFrame/.test(src)) fail(`${rel} is in NOT_FRAMED and wears the frame`, "Take it out of the list.");
      if (!/card: "tools"/.test(src)) fail(`${rel} names no share card`);
    }
  };
  walk(ROUTES);
}

if (bad) {
  console.error(`\nresearch: ${bad} problem(s).`);
  process.exit(1);
}
console.log(`research: ${RESEARCH_PAGES.length} rooms routed, ${Object.keys(RESEARCH_WORDS).length} phrases in both languages, every vocabulary the migration's, the desk gone.`);
