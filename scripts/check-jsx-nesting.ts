#!/usr/bin/env node
/* ============================================================
   check-jsx-nesting.ts: a paragraph holding something a
   paragraph cannot hold, which is how a page loses hydration.

       node scripts/check-jsx-nesting.ts
       node scripts/check-jsx-nesting.ts --list   # every component's root

   THE BUG THIS EXISTS FOR

   `<p className="ls-verdict">` held a `<TBlock>`, and a `TBlock`
   renders two `<div>`s. HTML does not allow that: a start tag
   for a block element CLOSES an open paragraph, so the browser
   builds

       <p class="ls-verdict"></p><div class="ls-bn">…</div>

   where React rendered one paragraph with the divs inside it.
   The DOM is then not the tree, React abandons the server's
   markup and renders the root again from scratch.

   Nothing else here could see it. The markup validates as far as
   any check that reads a string is concerned, `parity.test.ts`
   compares the SERVER's HTML and finds it perfect, and the page
   looks right in a screenshot. What is lost is what the boot
   script in `shell.tsx` wrote on to `<html>` before the first
   paint: the reader's theme, their rail, their language. A route
   that regenerates its tree drops all three, on a page that
   renders.

   It was live on 43 of the money school's 81 lessons.

   WHAT IT READS

   Every `.tsx` under `next/`, parsed as TSX, twice. The first
   pass records what each component in this repository renders at
   its ROOT, following a component that returns another component
   until the answer stops changing. The second pass walks the
   children of every `<p>` and asks whether any of them is, or
   renders, one of the elements that closes a paragraph.

   `next/lesson.test.ts` is the same question asked at runtime, in
   a browser, and it is the better answer where it can run: it
   sees a mismatch this cannot, such as an attribute the server
   and the browser disagree about. This one runs in a fifth of a
   second with no build and no browser, and it names the line.

   WHAT IT LEAVES ALONE, ON PURPOSE

     A component this cannot resolve: one imported from a package,
     or one whose return is an expression rather than JSX. Naming
     those as suspects would be a check nobody could satisfy.

     A conditional root. A component that returns `<div>` on one
     branch is flagged; one that returns `null` on the other is
     not thereby excused, because null is not what breaks.
   ============================================================ */

import ts from "typescript";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LIST = process.argv.includes("--list");

/** The start tags that close an open `<p>`, out of the HTML
    parser's own "in body" rules. `p` is in its own list because a
    paragraph inside a paragraph is the same fault. */
const CLOSES_P = new Set([
  "address", "article", "aside", "blockquote", "center", "details", "dialog",
  "dir", "div", "dl", "dd", "dt", "fieldset", "figcaption", "figure", "footer",
  "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li",
  "main", "menu", "nav", "ol", "p", "pre", "search", "section", "summary",
  "table", "ul", "xmp",
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

const isComponent = (tag: string): boolean => /^[A-Z]/.test(tag);

/** Every tag a piece of JSX can be at its root. A fragment or a
    conditional has more than one; an expression this cannot read
    has none, which is what keeps the check quiet where it does
    not know. */
function roots(node: ts.Node): string[] {
  if (ts.isParenthesizedExpression(node)) return roots(node.expression);
  if (ts.isJsxElement(node)) return [node.openingElement.tagName.getText()];
  if (ts.isJsxSelfClosingElement(node)) return [node.tagName.getText()];
  if (ts.isJsxFragment(node)) return node.children.flatMap((c) => roots(c));
  if (ts.isJsxExpression(node)) return node.expression ? roots(node.expression) : [];
  if (ts.isConditionalExpression(node)) {
    return [...roots(node.whenTrue), ...roots(node.whenFalse)];
  }
  if (ts.isBinaryExpression(node)) {
    const kind = node.operatorToken.kind;
    if (kind === ts.SyntaxKind.AmpersandAmpersandToken
      || kind === ts.SyntaxKind.BarBarToken
      || kind === ts.SyntaxKind.QuestionQuestionToken) {
      return [...roots(node.left), ...roots(node.right)];
    }
  }
  /* `.map(…)` renders its callback, once per item, in the
     parent's children: what it returns is what lands there. */
  if (ts.isCallExpression(node)) {
    return node.arguments.flatMap((a) =>
      (ts.isArrowFunction(a) || ts.isFunctionExpression(a)) ? body(a) : []);
  }
  return [];
}

/** What a function renders: an arrow's expression body, or every
    `return` in a block body. */
function body(fn: ts.SignatureDeclaration): string[] {
  const inner = (fn as { body?: ts.Node }).body;
  if (!inner) return [];
  if (!ts.isBlock(inner)) return roots(inner);
  const out: string[] = [];
  const visit = (node: ts.Node): void => {
    /* A nested function's returns are its own, not this one's. */
    if (node !== inner && (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)
      || ts.isFunctionExpression(node))) return;
    if (ts.isReturnStatement(node) && node.expression) out.push(...roots(node.expression));
    ts.forEachChild(node, visit);
  };
  visit(inner);
  return out;
}

const parse = (file: string): ts.SourceFile => ts.createSourceFile(
  file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

const files = walk(join(ROOT, "next"));
const parsed = new Map<string, ts.SourceFile>(files.map((f) => [f, parse(f)]));

/* ---- pass one: what each component renders at its root ---- */

const renders = new Map<string, Set<string>>();
const note = (name: string, tags: string[]): void => {
  const set = renders.get(name) ?? new Set<string>();
  for (const tag of tags) set.add(tag);
  renders.set(name, set);
};

for (const source of parsed.values()) {
  const visit = (node: ts.Node): void => {
    if (ts.isFunctionDeclaration(node) && node.name && isComponent(node.name.text)) {
      note(node.name.text, body(node));
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)
      && isComponent(node.name.text) && node.initializer
      && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) {
      note(node.name.text, body(node.initializer));
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

/* A component that returns another component answers with what
   THAT one renders. Repeated until nothing changes, which is at
   most as many rounds as there are components. */
for (let round = 0; round < renders.size + 1; round++) {
  let moved = false;
  for (const [name, tags] of renders) {
    for (const tag of [...tags]) {
      if (!isComponent(tag) || tag === name) continue;
      for (const under of renders.get(tag) ?? []) {
        if (!tags.has(under)) { tags.add(under); moved = true; }
      }
    }
  }
  if (!moved) break;
}

/** The block elements a tag puts into a paragraph, whether it is
    one itself or renders one. */
const blocks = (tag: string): string[] => {
  if (!isComponent(tag)) return CLOSES_P.has(tag) ? [tag] : [];
  return [...(renders.get(tag) ?? [])].filter((t) => !isComponent(t) && CLOSES_P.has(t));
};

/* ---- pass two: what is inside a paragraph ---- */

interface Found { where: string; holder: string; inside: string; why: string }
const found: Found[] = [];

for (const [file, source] of parsed) {
  const visit = (node: ts.Node): void => {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText() === "p") {
      const seen = new Set<string>();
      const inside = (child: ts.Node): void => {
        const tag = ts.isJsxElement(child) ? child.openingElement.tagName.getText()
          : ts.isJsxSelfClosingElement(child) ? child.tagName.getText() : "";
        if (tag) {
          const bad = blocks(tag);
          if (bad.length && !seen.has(tag)) {
            seen.add(tag);
            found.push({
              where: `${relative(ROOT, file)}:`
                + `${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`,
              holder: node.openingElement.getText().slice(0, 60).replace(/\s+/g, " "),
              inside: tag,
              why: isComponent(tag) ? `renders <${bad.join(">, <")}>` : "is a block element",
            });
          }
        }
        ts.forEachChild(child, inside);
      };
      for (const child of node.children) inside(child);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

if (LIST) {
  for (const [name, tags] of [...renders].sort((a, b) => a[0] < b[0] ? -1 : 1)) {
    const at = [...tags].filter((t) => !isComponent(t));
    if (at.length) console.log(`  ${name} -> ${at.join(", ")}`);
  }
}

if (found.length) {
  console.error(`\n${found.length} paragraph(s) hold something a paragraph cannot:\n`);
  for (const f of found) {
    console.error(`  ${f.where}`);
    console.error(`      ${f.holder}`);
    console.error(`      holds <${f.inside}>, which ${f.why}`);
  }
  console.error("\nA block element closes an open <p> in the parser, so the DOM the"
    + "\nbrowser builds is not the tree React rendered: it throws the server's"
    + "\nmarkup away and renders the root again, losing whatever a pre-paint"
    + "\nscript put on <html>. Make the holder a <div>, or make what is inside"
    + "\nit inline.");
  process.exit(1);
}

console.log(`jsx nesting: ${files.length} routes and components read, `
  + `${renders.size} components resolved to a root element, `
  + "and no paragraph holds a block.");
