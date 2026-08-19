#!/usr/bin/env node
/* ============================================================
   check-jsx-space.ts: the space between a sentence and the link
   inside it, which JSX eats.

       node scripts/check-jsx-space.ts
       node scripts/check-jsx-space.ts --list   # every boundary

   THE BUG THIS EXISTS FOR

   JSX drops the newline and the indentation between a line of
   text and an element on the next line, so this

       below lands in my inbox, or email
       <a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a>

   ships as "or emaili@reiad.co.uk". The same happens on the
   closing side: `</a>` and then text on the next line are joined
   with nothing between them. A space written on the SAME line
   survives, and `{" "}` survives; a line break does not.

   Nothing else here can see it. The markup is valid, the link
   works, the route renders, and every check that reads HTML
   reads the glued words as one word. It was live in nine files.

   WHAT IT READS

   Every `.tsx` under `next/`, parsed as TSX with the TypeScript
   the repository already installs, so only real JSX children are
   candidates: an object literal that happens to sit under a line
   of prose is not one. A boundary is two things that render,
   with a line break between the last character of one and the
   first character of the other, one of them an inline element
   and the other prose.

   WHAT IT LEAVES ALONE, ON PURPOSE

     A heading. `.tool h2 .bn-h` is `display: block` and
     `.cv-body h3` is a flex row with a gap, so a second element
     inside a heading is laid out rather than read as prose.

     Two elements with only a newline between them. That is a row
     of spans and the gap is the stylesheet's, not a sentence.

     `<sub>` and `<sup>`, by being off the inline list below:
     `A<sub>i</sub>` is one symbol and a space would be wrong.

     Anything whose edge this cannot compute, which is any child
     that is an expression other than a string literal.
   ============================================================ */

import ts from "typescript";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LIST = process.argv.includes("--list");

/** Elements a sentence runs THROUGH. A block element on the next
    line is a new line on the page and needs no space before it. */
const INLINE = new Set([
  "a", "Link", "abbr", "b", "cite", "code", "del", "dfn", "em", "i",
  "ins", "kbd", "mark", "q", "s", "samp", "small", "span", "strong",
  "time", "u", "var",
]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (name.endsWith(".tsx")) out.push(path);
  }
  return out;
}

/** The JSX transform's own whitespace rule, and the whole check
    turns on it: a line is trimmed where it meets a newline, a
    blank line goes, and what is left joins with one space. */
function shown(raw: string): string {
  const lines = raw.split(/\r\n|\n|\r/);
  const kept: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (i !== 0) line = line.replace(/^[ \t]+/, "");
    if (i !== lines.length - 1) line = line.replace(/[ \t]+$/, "");
    if (line) kept.push(line);
  }
  return kept.join(" ");
}

/** What a child renders at one of its edges: "" when it renders
    nothing, and null when this cannot tell, which is where the
    check stays quiet rather than guessing. */
function edge(node: ts.JsxChild, side: "first" | "last"): string | null {
  if (ts.isJsxText(node)) return shown(node.text);
  if (ts.isJsxExpression(node)) {
    const value = node.expression;
    return value && ts.isStringLiteral(value) ? value.text : null;
  }
  if (ts.isJsxSelfClosingElement(node)) return "";
  let last = "";
  for (const child of node.children) {
    const text = edge(child, side);
    if (text === null) return null;
    if (!text) continue;
    if (side === "first") return text;
    last = text;
  }
  return last;
}

/** One child that renders, and where its own characters start and
    end. A JsxText's node span includes the indentation around it,
    so the line break has to be measured from the text itself. */
interface Piece {
  first: string;
  last: string;
  tag: string;
  from: number;
  to: number;
}

function piece(node: ts.JsxChild): Piece | null {
  const first = edge(node, "first");
  const last = edge(node, "last");
  if (first === null || last === null || !first || !last) return null;
  let from = node.getStart();
  let to = node.getEnd();
  if (ts.isJsxText(node)) {
    from = node.pos + node.text.length - node.text.replace(/^\s+/, "").length;
    to = node.pos + node.text.replace(/\s+$/, "").length;
  }
  const tag = ts.isJsxElement(node)
    ? node.openingElement.tagName.getText()
    : ts.isJsxSelfClosingElement(node) ? node.tagName.getText() : "";
  return { first, last, tag, from, to };
}

/** One prose boundary written across two lines: where it is, the
    two things that meet at it, and whether a space survives. */
interface Boundary {
  where: string;
  before: string;
  after: string;
  spaced: boolean;
}

const files = walk(join(ROOT, "next"));
const found: Boundary[] = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const visit = (node: ts.Node): void => {
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      const parent = ts.isJsxElement(node) ? node.openingElement.tagName.getText() : "";
      if (/^h[1-6]$/.test(parent)) { ts.forEachChild(node, visit); return; }

      let prev: Piece | null = null;
      for (const child of node.children) {
        /* A child that renders nothing is not a side of anything:
           its whitespace is the gap, which is what is measured. */
        if (ts.isJsxText(child) && !shown(child.text)) continue;
        const here = piece(child);
        if (!here) { prev = null; continue; }

        /* One element and one piece of prose, with the author's
           line break between their own characters. Two elements
           are a row laid out by the stylesheet, not a sentence. */
        const elements = Number(prev !== null && prev.tag !== "") + Number(here.tag !== "");
        const inline = INLINE.has(prev?.tag ?? "") || INLINE.has(here.tag);
        if (prev && elements === 1 && inline
          && /\n/.test(source.slice(prev.to, here.from))
          /* An entity is a character this does not decode, so text
             ending in one (`&nbsp;` before a link) is not judged. */
          && !/&[A-Za-z#0-9]+;$/.test(prev.last)) {
          found.push({
            where: `${relative(ROOT, file)}:`
              + `${parsed.getLineAndCharacterOfPosition(here.from).line + 1}`,
            before: prev.last.slice(-44),
            after: here.first.slice(0, 44),
            spaced: /\s$/.test(prev.last) || /^\s/.test(here.first),
          });
        }
        prev = here;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(parsed);
}

const glued = found.filter((b) => !b.spaced);

if (LIST) {
  for (const b of found) {
    console.log(`  ${b.spaced ? "ok  " : "FAIL"} ${b.where}`);
    console.log(`       ...${b.before}|${b.after}...`);
  }
}

if (glued.length) {
  console.error(`\n${glued.length} sentence(s) run into an element with no space:\n`);
  for (const b of glued) {
    console.error(`  ${b.where}`);
    console.error(`      ...${b.before}|${b.after}...`);
  }
  console.error("\nJSX eats the newline and the indentation between them. End the text"
    + "\nline with {\" \"}, or bring the element up on to it.");
  process.exit(1);
}

console.log(`jsx spacing: ${files.length} routes and components read, `
  + `${found.length} prose boundaries broken across two lines, `
  + "and every one of them keeps its space.");
